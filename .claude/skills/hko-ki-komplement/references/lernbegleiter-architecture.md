# Lernbegleiter-Architektur — das 4. Dokument (Phase 4)

NEU gegenüber hko-deploy. Eine Datei `lernbegleiter.json` (Top-Level-Key
`lernbegleiter`), **learner-facing**, gebunden an die ganze Einheit. Renderer:
`DocLernbegleiter` (Start + Strategie-Karten, Schlussseite KN-Vorbereitung).

## Zweck

KI als **Lerncoach** für Repetition und Vorbereitung auf einen möglichen KN —
«KI-Toolbox fürs Lernen» statt fürs Produzieren. Sinnvoll, weil bbw-hko (anders als
hko-deploy) einen **summativen KN** behält.

## Integritäts-Leitplanke (zwingend — Checks L1-L3)

Der KN ist summativ und prüft **Transfer** über eine *neue* Hybrid-Szene. Der
Lernbegleiter bereitet darum auf die **Kompetenz** vor, NIE auf die konkrete
KN-Abgabe:

- Die KI darf **keine fertige KN-Lösung / kein KN-Produkt** erzeugen.
- Übungs-Fälle sind **andere** Fälle als `kn.hybrid_situation` (frische
  Persona/Szene) — der Begleiter trainiert das Übertragen, nicht das Auswendiglernen.
- Feedback-Prompts fordern **Hinweise auf Lücken, keine Musterantwort**.

## Pflichtfelder (Schema: assets/lernbegleiter-template.json)

| Feld | Inhalt |
|---|---|
| `titel`, `ziel` | 1 Satz; Lerncoach + KN-Vorbereitung |
| `kompetenzversprechen` | verbatim aus `prinzip.kern_kompetenzversprechen` |
| `ki_frei_zuerst.auftrag` | Selbsteinschätzung VOR KI-Nutzung |
| `begriffe[]` | Begriffe der Einheit zum Abhaken, 6-20 (`basis-plus.md` §5); bei v4.2 alle Glossarbegriffe ohne `spur` |
| `ki_frei_zuerst.selbsteinschaetzung[]` | je ein «Ich kann …»-Satz aus den Teilen des Kompetenzversprechens (Renderer baut 1-5-Skala) |
| `strategie_karten[5]` | `key`, `technik`, `wann`, `prompt_basis`, `warnung`; `prompt_fortgeschritten` nur bei Karte 3-5 — Keys und Reihenfolge siehe unten |
| `kn_typ_tracks[]` | EINER pro `kn.kn_typen[]`: `typ`, `label`, `uebungsfokus`, `prompt`. `label` steht wörtlich wie in `kn.json` (Vertrag) und wird **nicht** gedruckt: der Renderer zeigt den Lernenden «Fachgespräch» · «Schriftliche Aufgabe zu einem neuen Fall» · «Eigene Arbeiten zeigen und erklären» (`knTypFuerLernende` in `src/lib/einheiten/ki-toolbox.ts`). `uebungsfokus` und `prompt` nennen den Namen der KN-Form ebenfalls nie |
| `rubrik_fokus[]` | pro Dimension (SuK, Ges): `dimension`, `kriterien[]` (Teilmenge von `kn.rubrik_shared.kriterien` derselben Dimension), `so_uebst_du` |
| `integritaet_warnung` | Leitplanke in Lernenden-Sprache |
| `selbstcheck[]` | 3-4 Häkchen-Sätze, darunter «Ich habe an neuen Fällen geübt, nicht an den Fällen aus meinen Heften.» und «Ich habe Angaben der KI nachgeschlagen.» — **nicht** «Meine Übungsfälle waren andere als mein Kompetenznachweis»: den Fall des KN kennt vorher niemand, der Satz ist nicht abhakbar und lädt dazu ein, nach dem Fall zu fragen |

## Die 5 Strategie-Karten (feste Keys, feste Reihenfolge)

Die Reihenfolge entscheidet über die Seite: Karte 1 + 2 stehen auf Seite 1
(**Basis**), Karte 3-5 auf Seite 2 (**Plus**), die KN-Seite schliesst ab
(`basis-plus.md` §5). Der Name in `technik` ist ein deutsches Wort ohne Klammer —
der Schlüssel bleibt, das Fachwort erscheint nie.

| # | `key` | `technik` | Kern-Prompt | |
|---|---|---|---|---|
| 1 | `retrieval` | Abfragen lassen | KI stellt Fragen zu den Begriffen der Einheit, eine aufs Mal; Lösung erst NACH der Antwort; Prompt nennt das Thema | Basis |
| 2 | `feynman` | Selbst erklären | Lernende/r erklärt, KI nennt Lücken — keine fertige Erklärung; Prompt nennt das Thema | Basis |
| 3 | `uebungs_feedback` | Rückmeldung holen | KI nennt Lücken als Fragen, KEINE Musterlösung; Kriterium mit dem, was es verlangt | Plus |
| 4 | `mock_transfer` | Übungsfall lösen | KI erfindet einen **NEUEN** Fall (disjunkt vom KN und von den Heften), bewertet nach höchstens zwei erklärten Kriterien | Plus |
| 5 | `repetitionsplan` | Lernplan machen | Lernplan; Lernkarten nur mit Fragen — die Antworten schreiben die Lernenden aus Glossar/Lehrmittel/Dossier | Plus |

Basis-Karten tragen `prompt_basis` (fertig, mit Sprachzeile, höchstens eine Lücke)
und `warnung`, kein `prompt_fortgeschritten`. Der Übungsfall der Basis ist der
Prompt des eigenen KN-Typs auf der KN-Seite (`kn_typ_tracks`).

**Die KI kennt die Einheit nicht** (`basis-plus.md` §1 Nr. 5 und §5, Check BP8).
Unter den zwei Basis-Karten stehen die Felder «Das hat die KI gesagt · Das stimmt ·
Das stimmt nicht». Diese Entscheidung können Lernende nur treffen, wenn die Karte
sagt, **womit** sie vergleichen: Die `warnung` von `retrieval` und `feynman` nennt
das Glossar im Heft (v4.2), das Lehrmittel (3er-Set) oder das Dossier (EBA) und
sagt, dass es gilt, wenn die KI etwas anderes sagt. Kriterien stehen in keinem
Prompt nur als Name. Das Wort «Prinzip» steht im Lernbegleiter nicht für den
Leitsatz der Einheit (er steht nur in `ki.json › bezug`, und oft heisst ein
Kriterium «… Prinzip»): Die Lücke heisst «[was ich gelernt habe]».

## L1-L3 (Checks)

- **L1:** referenziert `kompetenzversprechen` + `kn.kn_typen[]` + die
  `rubrik_shared`-Dimensionen (SuK/Ges).
- **L2:** `mock_transfer.prompt_basis` fordert einen NEUEN, von `kn.hybrid_situation`
  disjunkten Fall; keine Karte erzeugt das KN-Produkt; `mock_transfer.warnung`
  verbietet die KN-Musterlösung explizit («Verlangen Sie von der KI nie eine Lösung
  für Ihren Kompetenznachweis. Üben Sie an neuen Fällen.»). **Jeder** Prompt, der
  einen neuen Fall bestellt — auch die drei `kn_typ_tracks[].prompt` und
  `prompt_fortgeschritten` —, nennt das Thema und sagt in Wörtern der Hefte, was der
  Fall nicht sein soll; sonst liefert die KI einen Heft-Fall als «neu».
- **L3:** jede `strategie_karten`-Karte hat `prompt_basis` UND eine technik-
  spezifische (nicht generische) `warnung`.

## v4.2-Hinweis (`template: "heft_8page_v42"`)

- `ki_frei_zuerst.selbsteinschaetzung[]`: Fundstellen aus
  `prinzip.quellen_anker.chapters` (Kapitel, Seite), nicht aus dem Gedächtnis.
- `retrieval`, `repetitionsplan`: die Begriffe sind `set.glossar[].begriff` ohne
  `spur` — beide Hefte zusammen, gleiche Schreibweise.
- `mock_transfer`, `kn_typ_tracks[]`: der neue Fall ist disjunkt von
  `kn.hybrid_situation` **und** von Heft A, Heft B und dem gemeinsamen Auftrag
  (`set.gemeinsamer_auftrag.kontext_ausschluss`). Der Prompt nennt, was der Fall
  nicht sein soll, in Wörtern der Hefte — nie mit einem Begriff des
  Fall-Ausschlusses (das verriete den KN-Fall gerade durch das Verbot).
- `rubrik_fokus[]`: alle vier Kriterien-Namen zeichengenau aus
  `kn.rubrik_shared`; Punkte heissen «0 bis 3 Punkte».
- Nichts aus `spuren.*`, nichts aus einem Lösungsfeld.

## EBA-Hinweis

Bei `lehrgang: "EBA_2J"`: «im Lehrmittel» → «im Dossier»; Sätze einfach halten
(A2-nah); `fachgespraech`-Track besonders ausführlich (mündliche KN-Primärform).
