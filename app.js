(function () {
  "use strict";

  const $ = (selector) => document.querySelector(selector);
  const screens = {
    start: $("#start-screen"),
    quiz: $("#quiz-screen"),
    result: $("#result-screen")
  };

  const ui = {
    name: $("#player-name"), start: $("#start-button"), section: $("#section-label"), counter: $("#question-counter"),
    progress: $("#progress-bar"), progressTrack: $(".progress-track"), timer: $("#timer"), timerBox: $("#timer-box"),
    difficulty: $("#difficulty-badge"), type: $("#type-badge"), title: $("#question-title"), instruction: $("#question-instruction"),
    maxPoints: $("#max-points"), content: $("#question-content"), feedback: $("#feedback"), submit: $("#submit-button"),
    next: $("#next-button"), resultTitle: $("#result-title"), resultMessage: $("#result-message"), scoreRing: $("#score-ring"),
    scorePercent: $("#score-percent"), finalScore: $("#final-score"), finalMax: $("#final-max-score"),
    reviewToggle: $("#review-toggle"), reviewList: $("#review-list"), toast: $("#toast")
  };

  let questions = [];
  let state = {};

  function freshState() {
    return {
      index: 0,
      player: "",
      totalScore: 0,
      answers: [],
      submitted: false,
      timeLeft: 0,
      endAt: 0,
      timerHandle: null,
      selectedChoice: null,
      selectedChoices: new Set(),
      matches: {},
      activeMatchItem: null,
      activeMatchOption: null,
      diagramSelected: new Set()
    };
  }

  function shuffle(values) {
    const copy = [...values];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function prepareQuestions() {
    questions = window.QUIZ_DATA.map((question) => ({
      ...question,
      options: question.options ? shuffle(question.options.map((option) => ({ ...option }))) : undefined,
      items: question.items ? question.items.map((item) => ({ ...item })) : undefined
    }));
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function formatNumber(value) {
    return new Intl.NumberFormat("de-DE").format(value);
  }

  function formatTime(seconds) {
    const safe = Math.max(0, Math.ceil(seconds));
    return `${String(Math.floor(safe / 60)).padStart(2, "0")}:${String(safe % 60).padStart(2, "0")}`;
  }

  function showScreen(name) {
    Object.entries(screens).forEach(([key, element]) => { element.hidden = key !== name; });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function showToast(message) {
    ui.toast.textContent = message;
    ui.toast.hidden = false;
    window.clearTimeout(showToast.handle);
    showToast.handle = window.setTimeout(() => { ui.toast.hidden = true; }, 2400);
  }

  function startQuiz() {
    const name = ui.name.value.trim();
    if (!name) {
      showToast("Bitte trage zuerst deinen Namen ein.");
      ui.name.focus();
      return;
    }
    prepareQuestions();
    state = freshState();
    state.player = name;
    showScreen("quiz");
    renderQuestion();
  }

  function renderQuestion() {
    stopTimer();
    const question = questions[state.index];
    state.submitted = false;
    state.selectedChoice = null;
    state.selectedChoices = new Set();
    state.matches = {};
    state.activeMatchItem = null;
    state.activeMatchOption = null;
    state.diagramSelected = new Set();
    state.timeLeft = question.time;

    ui.section.textContent = question.section;
    ui.counter.textContent = `Aufgabe ${state.index + 1} von ${questions.length}`;
    ui.progress.style.width = `${((state.index + 1) / questions.length) * 100}%`;
    ui.progressTrack.setAttribute("aria-valuemax", String(questions.length));
    ui.progressTrack.setAttribute("aria-valuenow", String(state.index + 1));
    ui.difficulty.textContent = question.difficulty;
    ui.difficulty.dataset.level = question.difficulty;
    ui.type.textContent = question.typeLabel;
    ui.title.textContent = question.title;
    ui.instruction.textContent = question.instruction;
    ui.maxPoints.textContent = formatNumber(question.points);
    ui.feedback.hidden = true;
    ui.feedback.className = "feedback";
    ui.submit.hidden = false;
    ui.submit.disabled = true;
    ui.next.hidden = true;
    ui.timerBox.classList.remove("is-warning");
    updateTimer(question.time);

    if (question.type === "choice") renderChoice(question);
    if (question.type === "multi-choice") renderMultiChoice(question);
    if (question.type === "match") renderMatch(question);
    if (question.type === "diagram") renderDiagram(question);
    startTimer(question);
  }

  function renderChoice(question) {
    const letters = "ABCD";
    ui.content.innerHTML = `<div class="choice-grid" role="radiogroup" aria-label="Antwortmöglichkeiten">${question.options.map((option, index) => `
      <button class="choice-card" type="button" role="radio" aria-checked="false" data-choice="${escapeHtml(option.id)}">
        <span class="choice-letter">${letters[index]}</span>
        <span class="choice-text">${escapeHtml(option.text)}</span>
        <span class="choice-mark" aria-hidden="true"></span>
      </button>`).join("")}</div>`;

    ui.content.querySelectorAll(".choice-card").forEach((button) => {
      button.addEventListener("click", () => {
        if (state.submitted) return;
        state.selectedChoice = button.dataset.choice;
        ui.content.querySelectorAll(".choice-card").forEach((item) => {
          const selected = item === button;
          item.classList.toggle("is-selected", selected);
          item.setAttribute("aria-checked", String(selected));
        });
        updateSubmitState();
      });
    });
  }

  function renderMultiChoice(question) {
    const letters = "ABCD";
    const required = question.correctIds.length;
    ui.content.innerHTML = `
      <div class="multi-choice-status" aria-live="polite"><strong id="multi-choice-count">0</strong> von ${required} ausgewählt</div>
      <div class="choice-grid" role="group" aria-label="Mehrere Antwortmöglichkeiten auswählen">${question.options.map((option, index) => `
        <button class="choice-card" type="button" role="checkbox" aria-checked="false" data-choice="${escapeHtml(option.id)}">
          <span class="choice-letter">${letters[index]}</span>
          <span class="choice-text">${escapeHtml(option.text)}</span>
          <span class="choice-mark" aria-hidden="true"></span>
        </button>`).join("")}</div>`;

    ui.content.querySelectorAll(".choice-card").forEach((button) => {
      button.addEventListener("click", () => {
        if (state.submitted) return;
        const id = button.dataset.choice;
        if (state.selectedChoices.has(id)) {
          state.selectedChoices.delete(id);
        } else if (state.selectedChoices.size < required) {
          state.selectedChoices.add(id);
        } else {
          showToast(`Für diese Aufgabe werden genau ${required} Antworten ausgewählt.`);
        }
        ui.content.querySelectorAll(".choice-card").forEach((item) => {
          const selected = state.selectedChoices.has(item.dataset.choice);
          item.classList.toggle("is-selected", selected);
          item.setAttribute("aria-checked", String(selected));
        });
        const counter = ui.content.querySelector("#multi-choice-count");
        counter.textContent = String(state.selectedChoices.size);
        updateSubmitState();
      });
    });
  }

  function renderMatch(question) {
    ui.content.innerHTML = `
      ${question.illustration ? `<figure class="match-illustration">
        <img src="${escapeHtml(question.illustration.image)}" alt="${escapeHtml(question.illustration.alt)}">
        <figcaption>${escapeHtml(question.illustration.caption)}</figcaption>
      </figure>` : ""}
      ${question.calculation ? `<div class="roll-calculation-guide">
        <figure>
          <img src="${escapeHtml(question.calculation.image)}" alt="${escapeHtml(question.calculation.imageAlt)}">
          <figcaption>Originalskizze aus dem Arbeitsblatt</figcaption>
        </figure>
        <div class="roll-formula-card">
          <span>So setzt sich der Umfang zusammen</span>
          <p><strong>D</strong> = 2 · H + d<sub>Felge</sub></p>
          <p><strong>U</strong> = π · D</p>
          <small>H: Reifenhöhe · d<sub>Felge</sub>: Felgendurchmesser · D: gesamter Raddurchmesser</small>
        </div>
      </div>` : ""}
      <p class="match-help">Tippe zuerst auf einen Begriff und dann auf die passende Antwort – oder ziehe die Antwort direkt in das Feld.</p>
      <div class="match-layout">
        <div class="match-targets" aria-label="Zuordnungsfelder">
          ${question.items.map((item) => `
            <div class="match-target" role="button" tabindex="0" data-item="${escapeHtml(item.id)}" aria-label="${escapeHtml(item.label)} zuordnen">
              <div class="match-source ${item.hideLabel ? "image-only" : ""}">
                ${item.image ? `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.alt || "")}">` : ""}
                ${item.hideLabel ? "" : item.token ? `<span class="source-token">${escapeHtml(item.label)}</span>` : `<span>${escapeHtml(item.label)}</span>`}
              </div>
              <div class="match-slot" data-slot="${escapeHtml(item.id)}"><span>Antwort ablegen</span></div>
            </div>`).join("")}
        </div>
        <div class="match-options" aria-label="Verfügbare Antworten">
          ${question.options.map((option) => `<button class="match-option" type="button" draggable="true" data-option="${escapeHtml(option.id)}">${escapeHtml(option.label)}</button>`).join("")}
        </div>
      </div>
      ${question.calculation ? `<div id="roll-calculation-result" class="roll-calculation-result" aria-live="polite">
        <span>Automatische Berechnung</span>
        <strong>Wähle Reifenhöhe und Felgendurchmesser aus.</strong>
      </div>` : ""}`;

    ui.content.querySelectorAll(".match-target").forEach((target) => {
      target.addEventListener("click", (event) => {
        if (state.submitted || event.target.closest(".clear-match")) return;
        const itemId = target.dataset.item;
        if (state.activeMatchOption) {
          assignMatch(question, itemId, state.activeMatchOption);
        } else {
          state.activeMatchItem = state.activeMatchItem === itemId ? null : itemId;
          refreshMatchUi(question);
        }
      });
      target.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          target.click();
        }
      });
      target.addEventListener("dragover", (event) => {
        if (state.submitted) return;
        event.preventDefault();
        target.classList.add("is-over");
      });
      target.addEventListener("dragleave", () => target.classList.remove("is-over"));
      target.addEventListener("drop", (event) => {
        if (state.submitted) return;
        event.preventDefault();
        target.classList.remove("is-over");
        const optionId = event.dataTransfer.getData("text/plain");
        if (optionId) assignMatch(question, target.dataset.item, optionId);
      });
    });

    ui.content.querySelectorAll(".match-option").forEach((option) => {
      option.addEventListener("click", () => {
        if (state.submitted || option.classList.contains("is-used")) return;
        const optionId = option.dataset.option;
        if (state.activeMatchItem) {
          assignMatch(question, state.activeMatchItem, optionId);
        } else {
          state.activeMatchOption = state.activeMatchOption === optionId ? null : optionId;
          refreshMatchUi(question);
        }
      });
      option.addEventListener("dragstart", (event) => {
        if (option.classList.contains("is-used")) {
          event.preventDefault();
          return;
        }
        event.dataTransfer.setData("text/plain", option.dataset.option);
      });
    });
  }

  function assignMatch(question, itemId, optionId) {
    Object.keys(state.matches).forEach((key) => {
      if (state.matches[key] === optionId) delete state.matches[key];
    });
    state.matches[itemId] = optionId;
    state.activeMatchItem = null;
    state.activeMatchOption = null;
    refreshMatchUi(question);
    updateSubmitState();
  }

  function refreshMatchUi(question) {
    const used = new Set(Object.values(state.matches));
    ui.content.querySelectorAll(".match-target").forEach((target) => {
      const itemId = target.dataset.item;
      const optionId = state.matches[itemId];
      const slot = target.querySelector(".match-slot");
      target.classList.toggle("is-active", state.activeMatchItem === itemId);
      if (optionId) {
        const option = question.options.find((entry) => entry.id === optionId);
        slot.classList.add("has-value");
        slot.innerHTML = `<span>${escapeHtml(option.label)}</span><button type="button" class="clear-match" aria-label="Zuordnung lösen">×</button>`;
        slot.querySelector(".clear-match").addEventListener("click", (event) => {
          event.stopPropagation();
          delete state.matches[itemId];
          refreshMatchUi(question);
          updateSubmitState();
        });
      } else {
        slot.classList.remove("has-value");
        slot.innerHTML = "<span>Antwort ablegen</span>";
      }
    });
    ui.content.querySelectorAll(".match-option").forEach((button) => {
      const isUsed = used.has(button.dataset.option);
      button.classList.toggle("is-used", isUsed);
      button.classList.toggle("is-active", state.activeMatchOption === button.dataset.option);
      button.setAttribute("aria-disabled", String(isUsed));
    });
    updateRollCalculation(question);
  }

  function updateRollCalculation(question) {
    if (!question.calculation) return;
    const result = ui.content.querySelector("#roll-calculation-result");
    const heightOption = question.options.find((option) => option.id === state.matches[question.calculation.heightItemId]);
    const rimOption = question.options.find((option) => option.id === state.matches[question.calculation.rimItemId]);
    if (!heightOption || !rimOption) {
      const missing = !heightOption && !rimOption
        ? "Reifenhöhe und Felgendurchmesser"
        : !heightOption ? "die Reifenhöhe" : "den Felgendurchmesser";
      result.innerHTML = `<span>Automatische Berechnung</span><strong>Wähle noch ${missing} aus.</strong>`;
      return;
    }
    const diameter = 2 * heightOption.valueMm + rimOption.valueMm;
    const circumference = Math.PI * diameter;
    const decimal = (value) => new Intl.NumberFormat("de-DE", { maximumFractionDigits: 2 }).format(value);
    result.innerHTML = `
      <span>Automatische Berechnung</span>
      <div><b>Raddurchmesser:</b> D = 2 · ${decimal(heightOption.valueMm)} mm + ${decimal(rimOption.valueMm)} mm = <strong>${decimal(diameter)} mm</strong></div>
      <div><b>Statischer Abrollumfang:</b> U = π · ${decimal(diameter)} mm ≈ <strong>${formatNumber(Math.round(circumference))} mm</strong></div>`;
  }

  function renderDiagram(question) {
    const config = getDiagram(question.diagram);
    ui.content.innerHTML = `
      <div class="diagram-wrap" role="group" aria-label="${escapeHtml(config.ariaLabel)}">
        ${config.image ? `<img class="diagram-image" src="${escapeHtml(config.image)}" alt="${escapeHtml(config.imageAlt || config.ariaLabel)}">` : config.svg}
        ${config.hotspots.map((spot) => `<button type="button" class="hotspot ${spot.className || ""}" style="left:${spot.x}%;top:${spot.y}%" data-hotspot="${escapeHtml(spot.id)}" aria-pressed="false" aria-label="${escapeHtml(spot.ariaLabel)}">${escapeHtml(spot.label)}</button>`).join("")}
      </div>
      ${config.legend ? `<div class="diagram-legend">${config.legend.map((entry) => `<span>${escapeHtml(entry)}</span>`).join("")}</div>` : ""}`;

    ui.content.querySelectorAll(".hotspot").forEach((button) => {
      button.addEventListener("click", () => {
        if (state.submitted) return;
        const key = button.dataset.hotspot;
        const required = question.correct.length;
        if (state.diagramSelected.has(key)) {
          state.diagramSelected.delete(key);
        } else if (required === 1) {
          state.diagramSelected = new Set([key]);
        } else if (state.diagramSelected.size < required) {
          state.diagramSelected.add(key);
        } else {
          showToast(`Für diese Aufgabe werden ${required} Bereiche ausgewählt.`);
        }
        refreshDiagramUi();
        updateSubmitState();
      });
    });
  }

  function refreshDiagramUi() {
    ui.content.querySelectorAll(".hotspot").forEach((button) => {
      const selected = state.diagramSelected.has(button.dataset.hotspot);
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
  }

  function updateSubmitState() {
    const question = questions[state.index];
    if (question.type === "choice") ui.submit.disabled = !state.selectedChoice;
    if (question.type === "multi-choice") ui.submit.disabled = state.selectedChoices.size !== question.correctIds.length;
    if (question.type === "match") ui.submit.disabled = Object.keys(state.matches).length !== question.items.length;
    if (question.type === "diagram") ui.submit.disabled = state.diagramSelected.size !== question.correct.length;
  }

  function startTimer(question) {
    state.endAt = Date.now() + question.time * 1000;
    state.timerHandle = window.setInterval(() => {
      state.timeLeft = Math.max(0, (state.endAt - Date.now()) / 1000);
      updateTimer(state.timeLeft);
      if (state.timeLeft <= 0) submitCurrent(true);
    }, 200);
  }

  function stopTimer() {
    if (state.timerHandle) window.clearInterval(state.timerHandle);
    state.timerHandle = null;
  }

  function updateTimer(seconds) {
    ui.timer.textContent = formatTime(seconds);
    ui.timerBox.classList.toggle("is-warning", seconds <= 10 && seconds > 0);
  }

  function evaluate(question) {
    if (question.type === "choice") return state.selectedChoice === question.correctId;
    if (question.type === "multi-choice") {
      const correct = new Set(question.correctIds);
      return state.selectedChoices.size === correct.size && [...state.selectedChoices].every((id) => correct.has(id));
    }
    if (question.type === "match") return question.items.every((item) => state.matches[item.id] === question.answer[item.id]);
    if (question.type === "diagram") {
      const correct = new Set(question.correct);
      return state.diagramSelected.size === correct.size && [...state.diagramSelected].every((key) => correct.has(key));
    }
    return false;
  }

  function assessAnswer(question, timeout) {
    if (timeout) {
      return { correct: false, partial: false, scoreRatio: 0, correctCount: 0, totalCount: question.type === "match" ? question.items.length : null };
    }
    if (question.type === "match") {
      const totalCount = question.items.length;
      const correctCount = question.items.filter((item) => state.matches[item.id] === question.answer[item.id]).length;
      return {
        correct: correctCount === totalCount,
        partial: correctCount > 0 && correctCount < totalCount,
        scoreRatio: correctCount / totalCount,
        correctCount,
        totalCount
      };
    }
    const correct = evaluate(question);
    return { correct, partial: false, scoreRatio: correct ? 1 : 0, correctCount: null, totalCount: null };
  }

  function calculatePoints(question, scoreRatio) {
    if (scoreRatio <= 0) return 0;
    const availablePoints = question.points * scoreRatio;
    const graceSeconds = 10;
    const elapsedSeconds = Math.max(0, question.time - state.timeLeft);
    if (elapsedSeconds <= graceSeconds) return Math.round(availablePoints);

    const scoringWindow = Math.max(1, question.time - graceSeconds);
    const remainingRatio = Math.max(0, Math.min(1, state.timeLeft / scoringWindow));
    return Math.round(availablePoints * (0.3 + 0.7 * remainingRatio));
  }

  function submitCurrent(timeout) {
    if (state.submitted) return;
    state.submitted = true;
    stopTimer();
    const question = questions[state.index];
    const assessment = assessAnswer(question, timeout);
    const points = calculatePoints(question, assessment.scoreRatio);
    state.totalScore += points;
    state.answers.push({
      id: question.id, title: question.title, section: question.section, correct: assessment.correct, partial: assessment.partial, timeout,
      correctCount: assessment.correctCount, totalCount: assessment.totalCount, points, maxPoints: question.points
    });

    revealAnswer(question);
    showFeedback(question, assessment, timeout, points);
    ui.submit.hidden = true;
    ui.next.hidden = false;
    ui.next.textContent = state.index === questions.length - 1 ? "Auswertung anzeigen" : "Nächste Aufgabe";
    ui.next.focus();
  }

  function revealAnswer(question) {
    if (question.type === "choice") {
      ui.content.querySelectorAll(".choice-card").forEach((button) => {
        button.disabled = true;
        const id = button.dataset.choice;
        const mark = button.querySelector(".choice-mark");
        if (id === question.correctId) {
          button.classList.add("is-correct");
          mark.textContent = "✓";
        } else if (id === state.selectedChoice) {
          button.classList.add("is-wrong");
          mark.textContent = "×";
        }
      });
    }
    if (question.type === "multi-choice") {
      const correct = new Set(question.correctIds);
      ui.content.querySelectorAll(".choice-card").forEach((button) => {
        button.disabled = true;
        const id = button.dataset.choice;
        const mark = button.querySelector(".choice-mark");
        if (correct.has(id)) {
          button.classList.add("is-correct");
          mark.textContent = "✓";
        } else if (state.selectedChoices.has(id)) {
          button.classList.add("is-wrong");
          mark.textContent = "×";
        }
      });
    }
    if (question.type === "match") {
      ui.content.querySelectorAll(".match-target").forEach((target) => {
        const itemId = target.dataset.item;
        target.classList.add(state.matches[itemId] === question.answer[itemId] ? "is-correct" : "is-wrong");
        target.setAttribute("aria-disabled", "true");
        const correctOption = question.options.find((entry) => entry.id === question.answer[itemId]);
        if (state.matches[itemId] !== question.answer[itemId]) {
          const slot = target.querySelector(".match-slot");
          slot.innerHTML = `<span>Richtig: ${escapeHtml(correctOption.label)}</span>`;
        }
      });
      ui.content.querySelectorAll("button").forEach((button) => { button.disabled = true; });
    }
    if (question.type === "diagram") {
      const correct = new Set(question.correct);
      ui.content.querySelectorAll(".hotspot").forEach((button) => {
        button.disabled = true;
        const key = button.dataset.hotspot;
        if (correct.has(key)) button.classList.add("is-correct");
        else if (state.diagramSelected.has(key)) button.classList.add("is-wrong");
      });
    }
  }

  function showFeedback(question, assessment, timeout, points) {
    let kind = "is-wrong";
    let symbol = "×";
    let title = "Noch nicht ganz.";
    if (assessment.correct) { kind = "is-correct"; symbol = "✓"; title = "Richtig gelöst!"; }
    if (assessment.partial) { kind = "is-partial"; symbol = "~"; title = "Teilweise richtig."; }
    if (timeout) { kind = "is-timeout"; symbol = "!"; title = "Zeit abgelaufen – 0 Punkte"; }
    const matchSummary = question.type === "match" && !timeout
      ? `<p><strong>${assessment.correctCount} von ${assessment.totalCount} Zuordnungen richtig.</strong></p>`
      : "";
    ui.feedback.className = `feedback ${kind}`;
    ui.feedback.innerHTML = `
      <div class="feedback-title"><span><i>${symbol}</i></span><span>${title}</span></div>
      ${matchSummary}
      <p>${escapeHtml(question.explanation)}</p>
      <span class="feedback-points">+ ${formatNumber(points)} Punkte</span>`;
    ui.feedback.hidden = false;
  }

  function nextQuestion() {
    if (state.index >= questions.length - 1) {
      renderResults();
      return;
    }
    state.index += 1;
    renderQuestion();
  }

  function renderResults() {
    stopTimer();
    showScreen("result");
    const max = window.QUIZ_META.totalPoints;
    const percent = Math.round((state.totalScore / max) * 100);
    ui.resultTitle.textContent = percent >= 80 ? "Starke Leistung!" : percent >= 55 ? "Gute Basis!" : "Weiter trainieren!";
    ui.resultMessage.textContent = `${state.player}, du hast die Werkstatt-Challenge abgeschlossen.`;
    ui.scorePercent.textContent = `${percent}%`;
    ui.scoreRing.style.setProperty("--score-angle", `${percent * 3.6}deg`);
    ui.finalScore.textContent = formatNumber(state.totalScore);
    ui.finalMax.textContent = formatNumber(max);

    ui.reviewList.className = "review-list";
    ui.reviewList.innerHTML = state.answers.map((answer, index) => {
      const stateClass = answer.correct ? "is-correct" : answer.timeout ? "is-timeout" : answer.partial ? "is-partial" : "";
      const icon = answer.correct ? "✓" : answer.timeout ? "!" : answer.partial ? "~" : "×";
      const label = answer.correct
        ? "Richtig"
        : answer.timeout
          ? "Zeit abgelaufen"
          : answer.partial
            ? `${answer.correctCount} von ${answer.totalCount} Zuordnungen richtig`
            : "Falsch";
      return `<div class="review-item ${stateClass}">
        <span class="review-icon">${icon}</span>
        <div><strong>${index + 1}. ${escapeHtml(answer.title)}</strong><small>${label} · ${escapeHtml(answer.section)}</small></div>
        <span>${formatNumber(answer.points)} / ${formatNumber(answer.maxPoints)} P.</span>
      </div>`;
    }).join("");
    ui.reviewList.hidden = true;
    ui.reviewToggle.setAttribute("aria-expanded", "false");
    ui.reviewToggle.textContent = "Ergebnisse anzeigen";
  }

  function toggleReview() {
    const willOpen = ui.reviewList.hidden;
    ui.reviewList.hidden = !willOpen;
    ui.reviewToggle.setAttribute("aria-expanded", String(willOpen));
    ui.reviewToggle.textContent = willOpen ? "Ergebnisse ausblenden" : "Ergebnisse anzeigen";
  }

  function getDiagram(type) {
    const diagrams = {
      "tire-markings": {
        ariaLabel: "Reifenflanke mit verschiedenen Kennzeichnungen",
        svg: `<svg viewBox="0 0 700 420" role="img" aria-labelledby="tire-mark-title tire-mark-desc">
          <title id="tire-mark-title">Reifenflanke</title><desc id="tire-mark-desc">Reifen mit Größenangabe, DOT-Code, Alpine-Symbol und Laufrichtung</desc>
          <circle cx="350" cy="210" r="170" fill="#24323a"/><circle cx="350" cy="210" r="105" fill="#b7c3c9" stroke="#70808a" stroke-width="12"/>
          <circle cx="350" cy="210" r="54" fill="#edf1f3" stroke="#7b8991" stroke-width="6"/>
          <g fill="#62717a">${Array.from({length: 10}, (_, i) => `<circle cx="${350 + Math.cos(i*Math.PI/5)*78}" cy="${210 + Math.sin(i*Math.PI/5)*78}" r="8"/>`).join("")}</g>
          <text x="350" y="73" text-anchor="middle" fill="#fff" font-size="28" font-weight="800">215/65 R17 97H</text>
          <text x="513" y="205" fill="#fff" font-size="21" font-weight="800" transform="rotate(84 513 205)">DOT 2319</text>
          <text x="164" y="208" fill="#fff" font-size="20" font-weight="800" transform="rotate(-83 164 208)">△ ❄ ALPINE</text>
          <path d="M285 356q65 40 130 0" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"/><path d="m405 347 16 6-11 13" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/>
          <text x="350" y="398" text-anchor="middle" font-size="16" font-weight="700">Laufrichtung</text>
        </svg>`,
        hotspots: [
          { id: "size", label: "1", x: 50, y: 17, ariaLabel: "Bereich 1 oben" },
          { id: "dot", label: "2", x: 77, y: 47, ariaLabel: "Bereich 2 rechts" },
          { id: "alpine", label: "3", x: 23, y: 47, ariaLabel: "Bereich 3 links" },
          { id: "rotation", label: "4", x: 50, y: 85, ariaLabel: "Bereich 4 unten" }
        ],
        legend: ["Wähle 3 von 4 markierten Bereichen"]
      },
      "tire-section": {
        ariaLabel: "Originaler Reifenquerschnitt aus dem Arbeitsblatt mit vier markierten Bauteilen",
        image: "assets/tire-section-original.jpg",
        imageAlt: "Originalgrafik eines aufgeschnittenen Reifens aus dem Arbeitsblatt Reifenaufbau",
        svg: `<svg viewBox="0 0 700 470" role="img" aria-labelledby="section-title section-desc">
          <title id="section-title">Detaillierter Reifenquerschnitt</title><desc id="section-desc">Mehrschichtiges Schnittmodell mit Profilblöcken, Zwischenbau, Gürtel, Karkasse, Inliner, Seitenwand und Wulstkernen</desc>
          <defs>
            <linearGradient id="sidewallShade" x1="0" x2="1"><stop offset="0" stop-color="#17252d"/><stop offset=".5" stop-color="#3b4b53"/><stop offset="1" stop-color="#17252d"/></linearGradient>
            <pattern id="cordPattern" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(28)"><line x1="0" y1="0" x2="0" y2="10" stroke="#20313a" stroke-width="3"/></pattern>
            <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="4" stdDeviation="4" flood-opacity=".18"/></filter>
          </defs>

          <path d="M96 369C102 145 191 63 350 49C509 63 598 145 604 369L535 369C530 221 478 142 350 123C222 142 170 221 165 369Z" fill="url(#sidewallShade)" stroke="#0f1d24" stroke-width="5" filter="url(#softShadow)"/>

          <path d="M151 354C159 204 221 127 350 108C479 127 541 204 549 354" fill="none" stroke="#64bdd1" stroke-width="10" stroke-linecap="round"/>
          <path d="M137 358C145 193 211 111 350 93C489 111 555 193 563 358" fill="none" stroke="#e7c038" stroke-width="14" stroke-linecap="round"/>
          <path d="M137 358C145 193 211 111 350 93C489 111 555 193 563 358" fill="none" stroke="url(#cordPattern)" stroke-width="10" stroke-linecap="round" opacity=".7"/>

          <path d="M205 103Q350 60 495 103" fill="none" stroke="#e9663d" stroke-width="18" stroke-linecap="round"/>
          <path d="M218 116Q350 80 482 116" fill="none" stroke="#f2cf3c" stroke-width="13" stroke-linecap="round"/>
          <path d="M218 116Q350 80 482 116" fill="none" stroke="#6a5715" stroke-width="3" stroke-dasharray="8 6" stroke-linecap="round"/>

          <g fill="#2f4048" stroke="#101c22" stroke-width="3">
            <path d="M185 82l48-19 11 42-47 18Z"/><path d="M232 61l49-12 7 44-48 12Z"/>
            <path d="M281 49l48-5 3 45-47 4Z"/><path d="M329 44h43v45h-40Z"/>
            <path d="M372 44l48 5-4 44-44-4Z"/><path d="M420 49l49 12-8 44-45-12Z"/>
            <path d="M469 63l47 19-13 41-43-18Z"/>
          </g>
          <g fill="none" stroke="#75838a" stroke-width="4" stroke-linecap="round">
            <path d="M207 75l8 31"/><path d="M255 59l6 35"/><path d="M304 51l2 35"/>
            <path d="M350 50v35"/><path d="M397 51l-3 35"/><path d="M445 59l-7 35"/><path d="M493 75l-9 31"/>
          </g>

          <path d="M105 345Q130 312 166 344L164 392H96Z" fill="#263840" stroke="#0e1b21" stroke-width="4"/>
          <path d="M595 345Q570 312 534 344L536 392H604Z" fill="#263840" stroke="#0e1b21" stroke-width="4"/>
          <g fill="#b9c3c8" stroke="#56666f" stroke-width="2">
            <circle cx="139" cy="354" r="18"/><circle cx="139" cy="354" r="12"/><circle cx="139" cy="354" r="6"/>
            <circle cx="561" cy="354" r="18"/><circle cx="561" cy="354" r="12"/><circle cx="561" cy="354" r="6"/>
          </g>
          <path d="M76 394h112l32 34h260l32-34h112" fill="none" stroke="#74838b" stroke-width="13" stroke-linejoin="round"/>
          <path d="M76 394h112l32 34h260l32-34h112" fill="none" stroke="#cbd3d7" stroke-width="7" stroke-linejoin="round"/>

          <g font-size="14" font-weight="700" fill="#40515a">
            <text x="350" y="458" text-anchor="middle">Mehrschichtiger Reifenquerschnitt</text>
          </g>
        </svg>`,
        hotspots: [
          { id: "tread", label: "A", x: 50, y: 8, ariaLabel: "Bereich A an den Profilblöcken" },
          { id: "belt", label: "B", x: 50, y: 18, ariaLabel: "Bereich B an der gelben Gürtellage unter der Lauffläche" },
          { id: "carcass", label: "C", x: 14, y: 50, ariaLabel: "Bereich C an der Karkasse und Seitenwand" },
          { id: "bead", label: "D", x: 19, y: 81, ariaLabel: "Bereich D am Wulst mit Drahtkern" }
        ]
      },
      "friction-circle": {
        ariaLabel: "Kamm'scher Reibungskreis mit Brems- und Seitenführungskraft",
        svg: `<svg viewBox="0 0 700 470" role="img" aria-labelledby="circle-title circle-desc">
          <title id="circle-title">Kamm'scher Reibungskreis</title><desc id="circle-desc">Kreis mit horizontaler Seitenführungskraft und vertikaler Bremskraft</desc>
          <circle cx="350" cy="220" r="145" fill="#fff" stroke="#7a8992" stroke-width="3"/>
          <line x1="110" y1="220" x2="590" y2="220" class="axis"/><line x1="350" y1="34" x2="350" y2="418" class="axis"/>
          <path d="m590 220-13-7v14Z" fill="#667781"/><path d="m350 418-7-13h14Z" fill="#667781"/>
          <text x="600" y="213" font-size="16">Rechtskurve</text><text x="360" y="444" font-size="16">Bremsen</text>
          <path d="M350 220H505" class="accent-stroke"/><path d="m505 220-14-8v16Z" fill="#006b8f"/>
          <path d="M350 220V375" class="orange-stroke"/><path d="m350 375-8-14h16Z" fill="#f7a11a"/>
          <line x1="505" y1="220" x2="505" y2="375" stroke="#7f8e97" stroke-width="2" stroke-dasharray="7 7"/>
          <line x1="350" y1="375" x2="505" y2="375" stroke="#7f8e97" stroke-width="2" stroke-dasharray="7 7"/>
          <path d="M350 220L505 375" fill="none" stroke="#10222d" stroke-width="5"/>
          <text x="420" y="205" font-size="17" font-weight="800">FS = 2.000 N</text><text x="360" y="305" font-size="17" font-weight="800">FB = 2.000 N</text>
          <text x="215" y="63" font-size="15">Haftgrenze</text>
        </svg>`,
        hotspots: [
          { id: "a", label: "A", x: 72, y: 47, ariaLabel: "Punkt A rechts auf der Horizontalachse" },
          { id: "b", label: "B", x: 50, y: 79, ariaLabel: "Punkt B unten auf der Vertikalachse" },
          { id: "result", label: "C", x: 72, y: 79, ariaLabel: "Punkt C diagonal rechts unten" },
          { id: "d", label: "D", x: 28, y: 17, ariaLabel: "Punkt D links oben" }
        ]
      },
      "steering": {
        ariaLabel: "Zwei Fahrspuren zum Vergleich von Übersteuern und Untersteuern",
        svg: `<svg viewBox="0 0 700 420" role="img" aria-labelledby="steer-title steer-desc">
          <title id="steer-title">Fahrspuren in einer Rechtskurve</title><desc id="steer-desc">Links dreht das Heck ein, rechts schiebt das Fahrzeug nach außen</desc>
          <rect x="25" y="25" width="310" height="350" rx="22" fill="#fff" stroke="#d3dde2" stroke-width="3"/>
          <rect x="365" y="25" width="310" height="350" rx="22" fill="#fff" stroke="#d3dde2" stroke-width="3"/>
          <path d="M80 335Q90 145 285 85" fill="none" stroke="#c3cdd2" stroke-width="80" stroke-linecap="round"/>
          <path d="M420 335Q430 145 625 85" fill="none" stroke="#c3cdd2" stroke-width="80" stroke-linecap="round"/>
          <path d="M80 335Q90 145 285 85" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="12 12"/>
          <path d="M420 335Q430 145 625 85" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="12 12"/>
          <path d="M84 332Q140 170 246 146" class="accent-stroke"/>
          <path d="M424 332Q446 157 644 124" class="orange-stroke"/>
          <g transform="translate(213 136) rotate(58)"><rect x="-20" y="-38" width="40" height="76" rx="12" fill="#006b8f"/><rect x="-14" y="-20" width="28" height="26" rx="5" fill="#bde7f2"/></g>
          <g transform="translate(600 126) rotate(72)"><rect x="-20" y="-38" width="40" height="76" rx="12" fill="#f7a11a"/><rect x="-14" y="-20" width="28" height="26" rx="5" fill="#fff0ce"/></g>
          <text x="180" y="405" text-anchor="middle" font-size="16" font-weight="750">Fahrspur A</text><text x="520" y="405" text-anchor="middle" font-size="16" font-weight="750">Fahrspur B</text>
        </svg>`,
        hotspots: [
          { id: "over", label: "A", x: 25, y: 48, ariaLabel: "Fahrspur A auswählen", className: "panel-hotspot" },
          { id: "under", label: "B", x: 75, y: 48, ariaLabel: "Fahrspur B auswählen", className: "panel-hotspot" }
        ]
      },
      "esp-wheel": {
        ariaLabel: "Fahrzeugdraufsicht mit vier anwählbaren Rädern",
        svg: `<svg viewBox="0 0 700 450" role="img" aria-labelledby="esp-title esp-desc">
          <title id="esp-title">Fahrzeug in einer Rechtskurve</title><desc id="esp-desc">Draufsicht eines Fahrzeugs mit vier Rädern</desc>
          <path d="M110 380Q130 100 560 75" fill="none" stroke="#dbe3e7" stroke-width="110" stroke-linecap="round"/>
          <path d="M110 380Q130 100 560 75" fill="none" stroke="#fff" stroke-width="4" stroke-dasharray="16 14"/>
          <g transform="translate(350 225)">
            <rect x="-85" y="-150" width="170" height="300" rx="62" fill="#006b8f" stroke="#004f6c" stroke-width="5"/>
            <path d="M-58-64h116l-16-55h-84Z" fill="#bde7f2"/><path d="M-58 22h116l-13 68h-90Z" fill="#bde7f2"/>
            <rect x="-105" y="-105" width="27" height="72" rx="8" fill="#1d2d35"/><rect x="78" y="-105" width="27" height="72" rx="8" fill="#1d2d35"/>
            <rect x="-105" y="43" width="27" height="72" rx="8" fill="#1d2d35"/><rect x="78" y="43" width="27" height="72" rx="8" fill="#1d2d35"/>
            <path d="M0-175v-35m0 0-12 18m12-18 12 18" fill="none" stroke="#10222d" stroke-width="5" stroke-linecap="round"/>
          </g>
          <text x="350" y="438" text-anchor="middle" font-size="16" font-weight="750">Fahrtrichtung nach oben · Rechtskurve</text>
        </svg>`,
        hotspots: [
          { id: "front-left", label: "VL", x: 38, y: 28, ariaLabel: "Vorderrad links" },
          { id: "front-right", label: "VR", x: 62, y: 28, ariaLabel: "Vorderrad rechts" },
          { id: "rear-left", label: "HL", x: 38, y: 68, ariaLabel: "Hinterrad links" },
          { id: "rear-right", label: "HR", x: 62, y: 68, ariaLabel: "Hinterrad rechts" }
        ]
      },
      "socket": {
        ariaLabel: "Frontansicht einer 13-poligen Anhängersteckdose",
        svg: `<svg viewBox="0 0 700 520" role="img" aria-labelledby="socket-title socket-desc">
          <title id="socket-title">13-polige Steckdose</title><desc id="socket-desc">Runde Steckdose mit dreizehn nummerierten Kontakten</desc>
          <circle cx="350" cy="250" r="208" fill="#eef3f5" stroke="#566770" stroke-width="11"/>
          <circle cx="350" cy="250" r="165" fill="#fff" stroke="#9aa8af" stroke-width="4"/>
          <path d="M312 43h76l-12 46h-52Z" fill="#566770"/>
          <text x="350" y="493" text-anchor="middle" font-size="17" font-weight="750">Ansicht von hinten · Anschlussseite</text>
        </svg>`,
        hotspots: [
          { id: "8", label: "8", x: 50, y: 25, ariaLabel: "Kontakt 8" }, { id: "7", label: "7", x: 64, y: 30, ariaLabel: "Kontakt 7" },
          { id: "6", label: "6", x: 69, y: 44, ariaLabel: "Kontakt 6" }, { id: "5", label: "5", x: 64, y: 58, ariaLabel: "Kontakt 5" },
          { id: "4", label: "4", x: 54, y: 48, ariaLabel: "Kontakt 4" }, { id: "3", label: "3", x: 50, y: 64, ariaLabel: "Kontakt 3" },
          { id: "2", label: "2", x: 36, y: 58, ariaLabel: "Kontakt 2" }, { id: "1", label: "1", x: 50, y: 37, ariaLabel: "Kontakt 1" },
          { id: "9", label: "9", x: 36, y: 30, ariaLabel: "Kontakt 9" }, { id: "10", label: "10", x: 29, y: 44, ariaLabel: "Kontakt 10" },
          { id: "11", label: "11", x: 33, y: 70, ariaLabel: "Kontakt 11" }, { id: "12", label: "12", x: 45, y: 79, ariaLabel: "Kontakt 12" },
          { id: "13", label: "13", x: 55, y: 79, ariaLabel: "Kontakt 13" }
        ]
      }
    };
    return diagrams[type];
  }

  ui.start.addEventListener("click", startQuiz);
  ui.name.addEventListener("keydown", (event) => { if (event.key === "Enter") startQuiz(); });
  ui.submit.addEventListener("click", () => submitCurrent(false));
  ui.next.addEventListener("click", nextQuestion);
  ui.reviewToggle.addEventListener("click", toggleReview);
  window.addEventListener("beforeunload", stopTimer);

  state = freshState();
})();
