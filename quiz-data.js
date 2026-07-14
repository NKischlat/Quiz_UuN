window.QUIZ_DATA = [
  {
    id: 1, section: "Reifen & Räder", type: "match", typeLabel: "Zuordnung", difficulty: "Mittel", time: 60, points: 750,
    title: "Welche Reifen gehören zu welchem Fahrzeug?",
    instruction: "Ordne jedes Reifenbild der passenden Fahrzeugart zu. Ziehe eine Antwort auf das Bild oder wähle beide nacheinander aus.",
    items: [
      { id: "a", label: "Reifen A", image: "assets/tire-agriculture.webp", alt: "Grobstolliger breiter Reifen" },
      { id: "b", label: "Reifen B", image: "assets/tire-bicycle.webp", alt: "Zwei schmale Reifen" },
      { id: "c", label: "Reifen C", image: "assets/tire-car.webp", alt: "Breiter Straßenreifen auf Leichtmetallrad" },
      { id: "d", label: "Reifen D", image: "assets/tire-truck.webp", alt: "Großer Nutzfahrzeugreifen" },
      { id: "e", label: "Reifen E", image: "assets/tire-motorcycle.webp", alt: "Gewölbter Motorradreifen" }
    ],
    options: [
      { id: "land", label: "Land- und Baumaschinen" }, { id: "bike", label: "Fahrrad" }, { id: "car", label: "Pkw" },
      { id: "truck", label: "Lkw" }, { id: "moto", label: "Motorrad" }
    ],
    answer: { a: "land", b: "bike", c: "car", d: "truck", e: "moto" },
    explanation: "Profilform, Baugröße und Querschnitt sind auf die jeweilige Fahrzeugart und deren Einsatz abgestimmt."
  },
  {
    id: 2, section: "Reifen & Räder", type: "match", typeLabel: "Zuordnung", difficulty: "Mittel", time: 70, points: 750,
    title: "Entschlüssle die Reifenbezeichnung 215/65 R17 97H.",
    instruction: "Ordne jedem Bestandteil die richtige Bedeutung zu.",
    items: [
      { id: "215", label: "215", token: true }, { id: "65", label: "65", token: true }, { id: "r", label: "R", token: true },
      { id: "17", label: "17", token: true }, { id: "97", label: "97", token: true }, { id: "h", label: "H", token: true }
    ],
    options: [
      { id: "width", label: "Reifenbreite in mm" }, { id: "ratio", label: "Verhältnis Höhe/Breite in %" },
      { id: "radial", label: "Radialbauart" }, { id: "rim", label: "Felgendurchmesser in Zoll" },
      { id: "load", label: "Tragfähigkeitskennzahl" }, { id: "speed", label: "Geschwindigkeitsindex (210 km/h)" }
    ],
    answer: { "215": "width", "65": "ratio", r: "radial", "17": "rim", "97": "load", h: "speed" },
    explanation: "Die Größenangabe beschreibt Abmessungen und Bauart; Last- und Geschwindigkeitsindex folgen am Ende."
  },
  {
    id: 3, section: "Reifen & Räder", type: "diagram", typeLabel: "Diagrammauswahl", difficulty: "Leicht", time: 50, points: 500,
    title: "Finde die wichtigen Kennzeichnungen auf der Reifenflanke.",
    instruction: "Markiere Reifengröße, DOT-Code und Laufrichtung. Drei Bereiche sind richtig.",
    diagram: "tire-markings", correct: ["size", "dot", "rotation"],
    explanation: "Reifengröße, DOT-Code und Laufrichtung stehen auf der Seitenwand. Das Alpine-Symbol kennzeichnet die Wintereignung."
  },
  {
    id: 4, section: "Reifen & Räder", type: "diagram", typeLabel: "Diagrammauswahl", difficulty: "Leicht", time: 40, points: 500,
    title: "Wo befindet sich der Gürtel im Reifen?",
    instruction: "Wähle im Querschnitt den Bereich direkt unter der Lauffläche.",
    diagram: "tire-section", correct: ["belt"],
    explanation: "Der Gürtel liegt unter der Lauffläche. Er stabilisiert die Karkasse gegen Seitenkräfte und die Bodenaufstandsfläche gegen Verformung."
  },
  {
    id: 5, section: "Reifen & Räder", type: "match", typeLabel: "Zuordnung", difficulty: "Schwer", time: 105, points: 1000,
    title: "Welche Funktion erfüllt welches Reifenbauteil?",
    instruction: "Verbinde die sieben Komponenten mit ihrer Hauptfunktion.",
    items: [
      { id: "carcass", label: "Karkasse" }, { id: "belt", label: "Gürtel" }, { id: "tread", label: "Lauffläche mit Profil" },
      { id: "bead", label: "Wulst mit Drahtkern" }, { id: "liner", label: "Luftdichte Innenschicht" },
      { id: "intermediate", label: "Zwischenbau" }, { id: "sidewall", label: "Seitenwand" }
    ],
    options: [
      { id: "shape", label: "Gibt Form und Belastbarkeit" }, { id: "stabilize", label: "Stabilisiert Karkasse und Aufstandsfläche" },
      { id: "transfer", label: "Überträgt Antriebs- und Bremskräfte" }, { id: "hold", label: "Hält den Reifen auf der Felge" },
      { id: "seal", label: "Hält die Luft im schlauchlosen Reifen" }, { id: "dampen", label: "Schützt die Karkasse und dämpft Stöße" },
      { id: "protect", label: "Schützt vor äußeren Einflüssen" }
    ],
    answer: { carcass: "shape", belt: "stabilize", tread: "transfer", bead: "hold", liner: "seal", intermediate: "dampen", sidewall: "protect" },
    explanation: "Erst das Zusammenspiel aller Schichten ermöglicht Kraftübertragung, Dichtheit, Stabilität und Schutz."
  },
  {
    id: 6, section: "Reifen & Räder", type: "match", typeLabel: "Zuordnung", difficulty: "Mittel", time: 60, points: 750,
    title: "Radialreifen oder Diagonalreifen?",
    instruction: "Ordne die Karkassenkonstruktionen der richtigen Reifenbauart zu.",
    items: [
      { id: "ninety", label: "Cordfäden verlaufen in 90° zur Laufrichtung; zusätzlich ist ein Gürtel vorhanden." },
      { id: "diagonal", label: "Cordfäden verlaufen in mehreren Lagen diagonal und überkreuzen sich." }
    ],
    options: [{ id: "radial", label: "Radialreifen" }, { id: "bias", label: "Diagonalreifen" }],
    answer: { ninety: "radial", diagonal: "bias" },
    explanation: "Radialreifen bieten bessere Fahreigenschaften; Diagonalreifen sind durch ihre gekreuzten Lagen besonders robust."
  },
  {
    id: 7, section: "Reifen & Räder", type: "match", typeLabel: "Zuordnung", difficulty: "Mittel", time: 60, points: 750,
    title: "Erkennst du die drei Ventilarten?",
    instruction: "Ordne jedem Bild die passende Ventilbezeichnung zu.",
    items: [
      { id: "a", label: "Ventilbild A", hideLabel: true, image: "assets/valve-transporter.webp", alt: "Längliches Ventil mit Metallhülse" },
      { id: "b", label: "Ventilbild B", hideLabel: true, image: "assets/valve-snap-in.webp", alt: "Schwarzes Gummiventil" },
      { id: "c", label: "Ventilbild C", hideLabel: true, image: "assets/valve-metal.webp", alt: "Kurzes verschraubtes Metallventil" }
    ],
    options: [
      { id: "transport", label: "Transporterventil" }, { id: "snap", label: "Snap-in-Ventil" }, { id: "metal", label: "Metallventil" }
    ],
    answer: { a: "transport", b: "snap", c: "metal" },
    explanation: "Die Bauform muss zu Felge, Fahrzeug und zulässiger Geschwindigkeit passen."
  },
  {
    id: 8, section: "Reifen & Räder", type: "choice", typeLabel: "Single-Choice", difficulty: "Leicht", time: 40, points: 500,
    title: "Welches Ventil ist für einen Reifen bis 240 km/h geeignet?",
    instruction: "Wähle genau eine Antwort aus.",
    options: [
      { id: "snap", text: "Snap-in-Ventil" }, { id: "metal", text: "Metallventil" },
      { id: "transport", text: "Transporterventil" }, { id: "tube", text: "Schlauchventil" }
    ], correctId: "metal",
    explanation: "Snap-in-Ventile sind laut Material nur für Geschwindigkeiten unter 210 km/h geeignet. Für 240 km/h wird ein Metallventil gewählt."
  },
  {
    id: 9, section: "Reifen & Räder", type: "match", typeLabel: "Zuordnung", difficulty: "Schwer", time: 75, points: 1000,
    title: "Welche Schadensarten zeigen die drei Reifenbilder?",
    instruction: "Ordne jedem Bild die passende Schadensart zu.",
    items: [
      { id: "aging", label: "Schadensbild A", hideLabel: true, image: "assets/wear-aging.webp", alt: "Schadensbild A: Risse an Reifenflanke und Profil" },
      { id: "oneside", label: "Schadensbild B", hideLabel: true, image: "assets/wear-one-sided.webp", alt: "Schadensbild B: Profil einseitig abgefahren" },
      { id: "bothsides", label: "Schadensbild C", hideLabel: true, image: "assets/wear-both-sides.webp", alt: "Schadensbild C: Profil auf beiden Außenseiten abgefahren" }
    ],
    options: [
      { id: "aging-damage", label: "Alterungsrisse" },
      { id: "one-sided-damage", label: "Einseitiger Abrieb" },
      { id: "both-sides-damage", label: "Beidseitiger Abrieb" }
    ],
    answer: { aging: "aging-damage", oneside: "one-sided-damage", bothsides: "both-sides-damage" },
    explanation: "Die Bilder zeigen Alterungsrisse, einseitigen Abrieb und beidseitigen Abrieb."
  },
  {
    id: 10, section: "Reifen & Räder", type: "choice", typeLabel: "Single-Choice", difficulty: "Mittel", time: 50, points: 750,
    title: "Was bedeutet der DOT-Code 2319 im Jahr 2026?",
    instruction: "Wähle die vollständig richtige Aussage aus.",
    options: [
      { id: "correct", text: "Produktion in Kalenderwoche 23 des Jahres 2019; der Reifen ist rund sieben Jahre alt." },
      { id: "month", text: "Produktion am 23. Januar 2019; der Reifen ist rund sieben Jahre alt." },
      { id: "2023", text: "Produktion in Kalenderwoche 19 des Jahres 2023; der Reifen ist rund drei Jahre alt." },
      { id: "serial", text: "Der Code ist nur eine Seriennummer und enthält kein Produktionsdatum." }
    ], correctId: "correct",
    explanation: "Die ersten beiden Stellen stehen für die Kalenderwoche, die letzten beiden für das Produktionsjahr."
  },
  {
    id: 11, section: "Reifen & Räder", type: "choice", typeLabel: "Single-Choice", difficulty: "Leicht", time: 50, points: 500,
    title: "Welches Zeichen weist einen zulässigen Winterreifen aus?",
    instruction: "Wähle das entscheidende Symbol aus.",
    options: [
      { id: "alpine", text: "Alpine-Symbol: Bergpiktogramm mit Schneeflocke" }, { id: "ms", text: "Nur die Aufschrift M+S" },
      { id: "rotation", text: "Laufrichtungspfeil" }, { id: "dot", text: "DOT-Kennzeichnung" }
    ], correctId: "alpine",
    explanation: "Das Alpine-Symbol kennzeichnet die geprüfte Wintereignung. M+S allein genügt bei neueren Reifen nicht."
  },
  {
    id: 12, section: "Reifen & Räder", type: "multi-choice", typeLabel: "Mehrfachauswahl", difficulty: "Mittel", time: 60, points: 750,
    title: "Welche Arten von Reifendruckkontrollsystemen werden im Fahrzeug eingesetzt?",
    instruction: "Wähle genau zwei der vier Antwortmöglichkeiten aus.",
    options: [
      { id: "direct", text: "Direkt messendes Reifendruckkontrollsystem" },
      { id: "indirect", text: "Indirekt messendes Reifendruckkontrollsystem" },
      { id: "hydraulic", text: "Hydraulisch messendes Reifendruckkontrollsystem" },
      { id: "optical", text: "Optisch messendes Reifendruckkontrollsystem" }
    ],
    correctIds: ["direct", "indirect"],
    explanation: "Bei Fahrzeugen werden direkt und indirekt messende Reifendruckkontrollsysteme unterschieden."
  },
  {
    id: 13, section: "Reifen & Räder", type: "choice", typeLabel: "Single-Choice", difficulty: "Leicht", time: 50, points: 500,
    title: "Welches Reifendruckkontrollsystem wird beschrieben?",
    instruction: "Sensoren an den Rädern messen den Reifendruck unmittelbar und übertragen die Messwerte an das Steuergerät.",
    options: [
      { id: "direct", text: "Direkt messendes Reifendruckkontrollsystem" },
      { id: "indirect", text: "Indirekt messendes Reifendruckkontrollsystem" },
      { id: "hydraulic", text: "Hydraulisch messendes Reifendruckkontrollsystem" },
      { id: "optical", text: "Optisch messendes Reifendruckkontrollsystem" }
    ],
    correctId: "direct",
    explanation: "Ein direkt messendes Reifendruckkontrollsystem erfasst den Druck mit eigenen Sensoren an den Rädern."
  },
  {
    id: 14, section: "Reifen & Räder", type: "match", typeLabel: "Zuordnung", difficulty: "Mittel", time: 75, points: 750,
    title: "Welche Werte werden für den statischen Abrollumfang benötigt?",
    instruction: "Wähle für den Reifen 195/65 R15 die Reifenhöhe H und den Felgendurchmesser dFelge in Millimetern aus. Das Quiz berechnet daraus automatisch den Abrollumfang. Jede richtige Auswahl zählt die Hälfte der Aufgabenpunkte.",
    calculation: {
      image: "assets/abrollumfang-skizze.png",
      imageAlt: "Originalskizze aus dem Arbeitsblatt mit Reifenhöhe H, Felgendurchmesser und gesamtem Raddurchmesser D",
      heightItemId: "height",
      rimItemId: "rim"
    },
    items: [
      { id: "height", label: "Reifenhöhe H" },
      { id: "rim", label: "Felgendurchmesser dFelge" }
    ],
    options: [
      { id: "height-12675", label: "126,75 mm", valueMm: 126.75 },
      { id: "rim-381", label: "381 mm", valueMm: 381 },
      { id: "width-195", label: "195 mm", valueMm: 195 },
      { id: "inch-15", label: "15 mm", valueMm: 15 }
    ],
    answer: { height: "height-12675", rim: "rim-381" },
    explanation: "H = 195 mm · 0,65 = 126,75 mm; dFelge = 15 · 25,4 = 381 mm. Damit D = 634,5 mm und U ≈ 1.993 mm."
  },
  {
    id: 15, section: "Reifen & Räder", type: "match", typeLabel: "Zuordnung", difficulty: "Mittel", time: 70, points: 750,
    title: "Wie verändert sich der dynamische Abrollumfang?",
    instruction: "Ordne jedem Einfluss die im Material beschriebene Auswirkung zu.",
    items: [
      { id: "temp", label: "Temperatur steigt" }, { id: "wear", label: "Profilverschleiß nimmt zu" },
      { id: "load", label: "Radlast steigt" }, { id: "speed", label: "Fahrgeschwindigkeit steigt" }
    ],
    options: [
      { id: "tempup", label: "Druck und Abrollumfang steigen" }, { id: "weardown", label: "Abrollumfang sinkt durch weniger Profil" },
      { id: "loaddown", label: "Reifen wird stärker abgeplattet; Umfang sinkt" }, { id: "speedup", label: "Fliehkraft dehnt den Reifen; Umfang steigt" }
    ],
    answer: { temp: "tempup", wear: "weardown", load: "loaddown", speed: "speedup" },
    explanation: "Der dynamische Abrollumfang hängt von Betriebszustand, Belastung, Verschleiß und Geschwindigkeit ab."
  },
  {
    id: 16, section: "Reifen & Räder", type: "match", typeLabel: "Zuordnung", difficulty: "Schwer", time: 90, points: 1000,
    title: "Entschlüssle die Felgenbezeichnung 7,5 J × 18 H2 ET45, LK 112, ML 82,5.",
    instruction: "Ordne den Kennwerten ihre technische Bedeutung zu.",
    items: [
      { id: "7.5", label: "7,5", token: true }, { id: "j", label: "J", token: true }, { id: "18", label: "18", token: true },
      { id: "h2", label: "H2", token: true }, { id: "et", label: "ET45", token: true },
      { id: "lk", label: "LK 112", token: true }, { id: "ml", label: "ML 82,5", token: true }
    ],
    options: [
      { id: "mouth", label: "Maulweite in Zoll" }, { id: "horn", label: "Hornabmessung" }, { id: "diameter", label: "Felgendurchmesser in Zoll" },
      { id: "hump", label: "Zwei Hump" }, { id: "offset", label: "Einpresstiefe 45 mm" },
      { id: "bolt", label: "Lochkreisdurchmesser 112 mm" }, { id: "center", label: "Mittelbohrung 82,5 mm" }
    ],
    answer: { "7.5": "mouth", j: "horn", "18": "diameter", h2: "hump", et: "offset", lk: "bolt", ml: "center" },
    explanation: "Die Felgenbezeichnung enthält Maße, Bauform, Einpresstiefe sowie Angaben zu Lochkreis und Mittelbohrung."
  },
  {
    id: 17, section: "Fahrdynamik", type: "match", typeLabel: "Zuordnung", difficulty: "Leicht", time: 55, points: 500,
    title: "Welches Regelsystem passt zu welcher Fahrsituation?",
    instruction: "Ordne die drei Fahrsituationen zu.",
    items: [
      { id: "curve", label: "Kurvenfahrt" }, { id: "brake", label: "Bremsen auf gerader Strecke" },
      { id: "accel", label: "Beschleunigen auf gerader Strecke" }
    ],
    options: [{ id: "esp", label: "ESP" }, { id: "abs", label: "ABS" }, { id: "asr", label: "ASR" }],
    answer: { curve: "esp", brake: "abs", accel: "asr" },
    explanation: "ESP stabilisiert vor allem in Querrichtung, ABS beim Bremsen und ASR beim Beschleunigen."
  },
  {
    id: 18, section: "Fahrdynamik", type: "choice", typeLabel: "Single-Choice", difficulty: "Leicht", time: 45, points: 500,
    title: "Was können Fahrwerkregelsysteme nicht verändern?",
    instruction: "Wähle genau eine Antwort aus.",
    options: [
      { id: "limit", text: "Die physikalische Haftgrenze zwischen Reifen und Fahrbahn" },
      { id: "brake", text: "Die wirksame Bremskraft" }, { id: "drive", text: "Die wirksame Antriebskraft" },
      { id: "wheel", text: "Die Bremskraft an einzelnen Rädern" }
    ], correctId: "limit",
    explanation: "Regelsysteme reduzieren oder verteilen Kräfte, können die physikalische Haftgrenze aber nicht anheben."
  },
  {
    id: 19, section: "Fahrdynamik", type: "choice", typeLabel: "Single-Choice", difficulty: "Mittel", time: 50, points: 750,
    title: "Was stellt der Kamm’sche Reibungskreis dar?",
    instruction: "Wähle die fachlich richtige Beschreibung.",
    options: [
      { id: "combined", text: "Die Grenze der gemeinsam übertragbaren Längs- und Seitenkräfte eines Reifens" },
      { id: "turn", text: "Den kleinsten möglichen Wendekreis des Fahrzeugs" },
      { id: "pressure", text: "Die zulässige Druckverteilung im Reifen" },
      { id: "brake", text: "Nur die maximal übertragbare Bremskraft" }
    ], correctId: "combined",
    explanation: "Der Kreis zeigt die verfügbare Reifenhaftung für die Kombination aus Seitenführungs- und Längskräften."
  },
  {
    id: 20, section: "Fahrdynamik", type: "diagram", typeLabel: "Diagrammauswahl", difficulty: "Schwer", time: 75, points: 1000,
    title: "Wo endet die resultierende Reifenkraft?",
    instruction: "Beim Bremsen in einer Rechtskurve wirken FB = 2.000 N und FS = 2.000 N. Wähle den Endpunkt von FRES.",
    diagram: "friction-circle", correct: ["result"],
    explanation: "Die Vektoraddition führt diagonal nach rechts unten. FRES beträgt etwa 2.828 N und liegt damit außerhalb des dargestellten Haftbereichs."
  },
  {
    id: 21, section: "Fahrdynamik", type: "choice", typeLabel: "Single-Choice", difficulty: "Mittel", time: 60, points: 750,
    title: "Liegt beim Bremsen in der Rechtskurve ein Haftungsverlust vor?",
    instruction: "FB und FS betragen jeweils 2.000 N; die Haftgrenze liegt bei 2.200 N.",
    options: [
      { id: "yes", text: "Ja, weil die resultierende Kraft mit rund 2.828 N die Haftgrenze überschreitet." },
      { id: "no-side", text: "Nein, weil nur die Seitenführungskraft betrachtet werden muss." },
      { id: "no-both", text: "Nein, weil beide Einzelkräfte kleiner als 2.200 N sind." },
      { id: "zero", text: "Nein, weil sich Brems- und Seitenführungskraft gegenseitig aufheben." }
    ], correctId: "yes",
    explanation: "Entscheidend ist die resultierende Kraft aus beiden Komponenten, nicht jede Einzelkraft für sich."
  },
  {
    id: 22, section: "Fahrdynamik", type: "diagram", typeLabel: "Diagrammauswahl", difficulty: "Schwer", time: 75, points: 1000,
    title: "Welches Rad bremst das ESP beim Übersteuern ab?",
    instruction: "Das Fahrzeug fährt eine Rechtskurve und übersteuert. Markiere das Rad, welches durch das ESP abgebremst werden muss.",
    diagram: "esp-wheel", correct: ["front-left"],
    explanation: "Beim Übersteuern wird das kurvenäußere Vorderrad abgebremst. In der Rechtskurve ist das das linke Vorderrad."
  },
  {
    id: 23, section: "Anhänger & Dokumente", type: "match", typeLabel: "Zuordnung", difficulty: "Mittel", time: 55, points: 750,
    title: "D-Wert, Stützlast, Zug- oder Druckbelastung?",
    instruction: "Ordne die vier Beschreibungen richtig zu.",
    items: [
      { id: "d", label: "Horizontale Belastbarkeit der Anhängerkupplung, Einheit kN" },
      { id: "s", label: "Senkrechte Belastung auf der Kupplung, Angabe in kg" },
      { id: "pull", label: "Entsteht zum Beispiel beim Anfahren und Beschleunigen" },
      { id: "push", label: "Entsteht zum Beispiel beim Bremsen und Bergabfahren" }
    ],
    options: [
      { id: "dvalue", label: "D-Wert" }, { id: "support", label: "Stützlast" },
      { id: "tension", label: "Zugbelastung" }, { id: "compression", label: "Druckbelastung" }
    ],
    answer: { d: "dvalue", s: "support", pull: "tension", push: "compression" },
    explanation: "D-Wert und Stützlast beschreiben unterschiedliche Wirkrichtungen; während der Fahrt treten außerdem Zug- und Druckbelastungen auf."
  },
  {
    id: 24, section: "Anhänger & Dokumente", type: "choice", typeLabel: "Single-Choice", difficulty: "Schwer", time: 105, points: 1000,
    title: "Berechne den erforderlichen D-Wert des Gespanns.",
    instruction: "T = 2.200 kg, R = 1.400 kg, g = 9,81 m/s². Verwende D = (T · R / (T + R)) · g und gib das Ergebnis in kN an.",
    options: [
      { id: "8.39", text: "8,39 kN" }, { id: "7.08", text: "7,08 kN" },
      { id: "10.58", text: "10,58 kN" }, { id: "83.93", text: "83,93 kN" }
    ], correctId: "8.39",
    explanation: "D = (2.200 · 1.400 / 3.600) · 9,81 = 8.393 N ≈ 8,39 kN."
  },
  {
    id: 25, section: "Anhänger & Dokumente", type: "match", typeLabel: "Zuordnung", difficulty: "Mittel", time: 70, points: 750,
    title: "Welche Klemmenbezeichnung gehört zu welcher lichttechnischen Einrichtung",
    instruction: "Ordne die sechs lichttechnischen Einrichtungen zu.",
    items: [
      { id: "lefttail", label: "Schlussleuchte links" }, { id: "righttail", label: "Schlussleuchte rechts" },
      { id: "brake", label: "Bremsleuchten" },
      { id: "fog", label: "Nebelschlussleuchte" }, { id: "leftturn", label: "Fahrtrichtungsanzeiger links" },
      { id: "rightturn", label: "Fahrtrichtungsanzeiger rechts" }
    ],
    options: [
      { id: "58l", label: "58L" }, { id: "58r", label: "58R" },
      { id: "54", label: "54" }, { id: "54g", label: "54g" }, { id: "l", label: "L" }, { id: "r", label: "R" }
    ],
    answer: { lefttail: "58l", righttail: "58r", brake: "54", fog: "54g", leftturn: "l", rightturn: "r" },
    explanation: "Die Klemmenbezeichnungen identifizieren die jeweiligen Lichtfunktionen unabhängig von möglichen Kabelfarben."
  },
  {
    id: 26, section: "Anhänger & Dokumente", type: "choice", typeLabel: "Single-Choice", difficulty: "Mittel", time: 60, points: 750,
    title: "Was unterscheidet Steuerstromkreis und Arbeitsstromkreis?",
    instruction: "Wähle die fachlich richtige Aussage aus.",
    options: [
      { id: "correct", text: "Der Steuerstromkreis betätigt mit einem kleinen Strom die Relaisspule; der Arbeitsstromkreis führt über die Relaiskontakte den größeren Strom zum Verbraucher." },
      { id: "swapped", text: "Der Arbeitsstromkreis betätigt nur die Relaisspule; der Steuerstromkreis versorgt den Verbraucher mit dem größeren Strom." },
      { id: "voltage", text: "Im Steuerstromkreis liegen 12 V an, im Arbeitsstromkreis grundsätzlich 24 V." },
      { id: "same", text: "Beide Stromkreise haben dieselbe Aufgabe und unterscheiden sich nur durch die Kabelfarbe." }
    ],
    correctId: "correct",
    explanation: "Der Steuerstromkreis schaltet die Relaisspule mit geringem Strom. Die Relaiskontakte schließen daraufhin den Arbeitsstromkreis, der den höheren Laststrom zum Verbraucher führt."
  },
  {
    id: 27, section: "Anhänger & Dokumente", type: "match", typeLabel: "Zuordnung", difficulty: "Schwer", time: 75, points: 1000,
    title: "Welche Klemmenbezeichnung gehört zu welchem Buchstaben?",
    instruction: "Ordne den in der Abbildung markierten Buchstaben A bis D die richtigen Klemmenbezeichnungen zu.",
    illustration: {
      image: "assets/relais-pin-klemmen.svg",
      alt: "Schaltbild eines vierpoligen Schließerrelais mit den Buchstaben A und B an der Spule sowie C und D am Schließerkontakt",
      caption: "4-poliges Kfz-Schließerrelais"
    },
    items: [
      { id: "a", label: "A" }, { id: "b", label: "B" },
      { id: "c", label: "C" }, { id: "d", label: "D" }
    ],
    options: [
      { id: "86", label: "Klemme 86" }, { id: "85", label: "Klemme 85" },
      { id: "30", label: "Klemme 30" }, { id: "87", label: "Klemme 87" }
    ],
    answer: { a: "86", b: "85", c: "30", d: "87" },
    explanation: "Klemmen 85 und 86 gehören zur Relaisspule des Steuerstromkreises. Klemme 30 ist der Eingang des Arbeitsstromkreises; Klemme 87 führt nach dem Schalten zum Verbraucher."
  },
  {
    id: 28, section: "Anhänger & Dokumente", type: "match", typeLabel: "Zuordnung", difficulty: "Schwer", time: 70, points: 1000,
    title: "Welches Genehmigungsdokument ist gemeint?",
    instruction: "Ordne die typischen Merkmale dem richtigen Dokument oder Verfahren zu.",
    items: [
      { id: "coc", label: "EU-Konformitätsnachweis mit umfangreichen Fahrzeugdaten; wichtig für die Erstzulassung" },
      { id: "approval", label: "Nationale Genehmigung mit sechsstelliger KBA-Nummer; Abnahme meist nicht notwendig" },
      { id: "single", label: "Prüfung eines umfangreichen Umbaus ohne ausreichende Genehmigungsdokumente" }
    ],
    options: [
      { id: "coc-doc", label: "CoC" }, { id: "type-approval", label: "Teiletypgenehmigung" },
      { id: "individual", label: "Einzelabnahme" }
    ],
    answer: { coc: "coc-doc", approval: "type-approval", single: "individual" },
    explanation: "Die Dokumente unterscheiden sich in Zweck, Aussteller, Mitführpflicht und notwendiger Abnahme."
  },
  {
    id: 29, section: "Anhänger & Dokumente", type: "choice", typeLabel: "Single-Choice", difficulty: "Mittel", time: 60, points: 750,
    title: "Was ist bei einem Umbau ohne ausreichende Genehmigungsdokumente erforderlich?",
    instruction: "Wähle den richtigen Ablauf aus.",
    options: [
      { id: "individual", text: "Einzelabnahme; bei positivem Gutachten Betriebserlaubnis erneut beantragen und Änderung nachtragen lassen" },
      { id: "coc", text: "Nur ein neues CoC beim Fahrzeughersteller bestellen" },
      { id: "none", text: "Keine Prüfung, wenn das Fahrzeug weiterhin fahrbereit ist" },
      { id: "insurance", text: "Ausschließlich die Versicherung schriftlich informieren" }
    ], correctId: "individual",
    explanation: "Ohne passende Genehmigungsdokumente ist meist eine Einzelabnahme notwendig. Danach werden Betriebserlaubnis und Fahrzeugpapiere angepasst."
  }
];

window.QUIZ_META = {
  totalTime: 1860,
  totalPoints: 22000,
  sections: ["Reifen & Räder", "Fahrdynamik", "Anhänger & Dokumente"]
};
