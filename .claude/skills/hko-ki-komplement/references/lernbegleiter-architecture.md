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
| `ki_frei_zuerst.selbsteinschaetzung[]` | je ein «Ich kann …»-Satz aus den Teilen des Kompetenzversprechens (Renderer baut 1-5-Skala) |
| `strategie_karten[5]` | `key`, `technik`, `wann`, `prompt_basis`, `prompt_fortgeschritten`, `warnung` — die 5 Keys siehe unten |
| `kn_typ_tracks[]` | EINER pro `kn.kn_typen[]`: `typ`, `label`, `uebungsfokus`, `prompt` |
| `rubrik_fokus[]` | pro Dimension (SuK, Ges): `dimension`, `kriterien[]` (Teilmenge von `kn.rubrik_shared.kriterien` derselben Dimension), `so_uebst_du` |
| `integritaet_warnung` | Leitplanke in Lernenden-Sprache |
| `selbstcheck[]` | 4-5 Häkchen-Sätze (inkl. «Mock-Fälle anders als KN», «Quellen geprüft») |

## Die 5 Strategie-Karten (feste Keys)

| `key` | technik | Kern-Prompt |
|---|---|---|
| `retrieval` | Abfragen lassen | KI stellt Prüfungsfragen, Lösung erst NACH der Antwort |
| `feynman` | Selbst erklären | Lernende/r erklärt, KI nennt Lücken — keine fertige Erklärung |
| `mock_transfer` | Übungsfall lösen | KI erfindet einen **NEUEN** Fall (disjunkt vom KN), bewertet nach den Rubrik-Kriterien |
| `uebungs_feedback` | Feedback auf einen Versuch | KI nennt Lücken als Fragen, KEINE Musterlösung |
| `repetitionsplan` | Repetitionsplan / Karteikarten | Lernplan/Karteikarten; mit Lehrmittel/Dossier gegenchecken |

## L1-L3 (Checks)

- **L1:** referenziert `kompetenzversprechen` + `kn.kn_typen[]` + die
  `rubrik_shared`-Dimensionen (SuK/Ges).
- **L2:** `mock_transfer.prompt_basis` fordert einen NEUEN, von `kn.hybrid_situation`
  disjunkten Fall; keine Karte erzeugt das KN-Produkt; `mock_transfer.warnung`
  verbietet die KN-Musterlösung explizit.
- **L3:** jede `strategie_karten`-Karte hat `prompt_basis` UND eine technik-
  spezifische (nicht generische) `warnung`.

## EBA-Hinweis

Bei `lehrgang: "EBA_2J"`: «im Lehrmittel» → «im Dossier»; Sätze einfach halten
(A2-nah); `fachgespraech`-Track besonders ausführlich (mündliche KN-Primärform).
