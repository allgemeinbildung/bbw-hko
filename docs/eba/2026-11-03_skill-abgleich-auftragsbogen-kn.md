# Skill-Abgleich: Auftragsbogen und Kompetenznachweis (EBA-Gold) → `bbw-hko-heft-v42`

Stand 03.11.2026, ca. 15:15. Lesung: GPT 6.1 Sol (high), nachgeprüft und entschieden von Claude.
Grundlage: Änderungen vom 03.11. an `set.json › gemeinsamer_auftrag` und `kn.json` der Gold-Einheit
`1.1.1_lehrvertrag_orientieren_v42` (siehe `aufnahme-2026-10-23_eba-gold-punkte.md`, letzter Abschnitt).
Die Skill und die Prüfskripte überarbeitet eine andere Sitzung — diese Liste ist für sie.

Kategorie: **a** Skill widerspricht Gold · **b** Gold-Regel fehlt in der Skill.

## Auftragsbogen
1. **b** — Lernendenfassung der vier Kriterien (`gemeinsamer_auftrag.feedback_kriterien[].name_lernende`, `stufen_lernende`, Ich-Form, an den Produktmodus angepasst: «beim Sprechen», «im Reglement») fehlt in `assets/eba-set-template.json`, `references/phase-7-set.md`, `references/datenvertrag.md`; `eba-profil.md` verlangt Ich-Stufen nur für die Hefte. Pflicht machen; `stufen` bleibt KN-Wortlaut (R6).
2. **a/b** — `gemeinsamer_auftrag.woerter: [{begriff, definition}]` («Wichtige Wörter» vor der Situation auf A1) fehlt in Vorlage und Datenvertrag; `phase-7-set.md` sagt «Kein weiteres Feld» → für EBA erweitern.
3. **a/b** — `heft_bezug`: EBA verweist auf «Wichtige Wörter (S. 2)», nicht auf Glossar S. 8; der Kasten steht bei EBA auf A2 (`worte().auftrag.heftBezugAufA2`). `phase-7-set.md` nennt A1 und S. 8.
4. **a** — `phase-8-begleiter.md` und `assets/begleiter-template.md` beschreiben A4 mit «Selbst/Fremd» und gleichem KN-Wortlaut; EBA: «Ich» / «Partner/in», Lernendenfassung, gleicher Massstab. Auch in `assets/eba-begleiter-template.md` festhalten.

## Kompetenznachweis
5. **a** — `assets/eba-kn-template.json` setzt «Eine Hybrid-Herausforderung …», «Lehrmittel erlaubt nach LP-Entscheid», «Aufgaben steigender Komplexität»; Gold: «Dieser Fall ist neu. Sie brauchen dafür beide Hefte.», Dossier und Hefte erlaubt, «Vier kurze Aufgaben. Sie werden Schritt für Schritt schwieriger.» Konstanten in `phase-2-3-prinzip-kn.md` und `datenvertrag.md` angleichen.
6. **b** — `kn.rubrik_shared.kriterien[].name_lernende/stufen_lernende` und `niveaubaender[].definition_lernende` fehlen in Vorlage, Phase 3, Datenvertrag, Profil. Pflicht für EBA, gleiche Stufenzahl, gleiche Bedeutung.
7. **b** — `kn_typen[].aufgaben[].tabelle: {spalten, zeilen}` dokumentieren; verlangen, wenn eine Aufgabe eine Tabelle voraussetzt («Füllen Sie die Fakten-Tabelle aus»).
8. **a** — Werkwahl EBA: 2 Sätze (Vorlage: «2–3 Sätze»). Renderer druckt die EBA-Texte fest aus `src/lib/einheiten/kn-lernende.ts` (zwei Produkte, 2 Sätze, 120–150 Wörter) — die Vorlage muss dazu passen.
9. **b** — Eine Regel für alle gedruckten Lernendentexte im KN (kein «Hybrid-Herausforderung», keine K-Stufen, keine Bloom-Wörter); LP- und Technikfelder (`definition_lang`, `typ`, `k_stufe`) ausgenommen.

## Prüfskripte
10. **b** — `check-eba.mjs` prüft Lernendenfassungen nur in den Heften; Auftrag und KN fehlen (Name nicht leer, 4 Stufen, Länge = `stufen`, `definition_lernende` je Band).
11. **b** — KN-Lernendentexte sind aus den Sprachprüfungen ausgenommen (`kn: false` in `check-eba`, `check-kohaerenz`, `check-skelette`). Selektor für gedruckte KN-Texte einführen.
12. **a/b** — `ELEMENT_SEITEN_EBA` übernimmt `ELEMENT_SEITEN[7]` (Glossar → S. 8). Für EBA: «Wichtige Wörter» → S. 2, «Glossar (S. 8)» im Heft-Bezug zurückweisen.
13. **b** — Keine Strukturprüfung für `gemeinsamer_auftrag.woerter` und `aufgaben[].tabelle`.
14. **b** — Export/Messung (`export-v42.mjs` über `v42Dokumente()`) enthält keinen KN und kein Dossier. Zum Messen gibt es vorerst `D:\OS\_lab\eba-gold-2026-10-23\kn-export.mjs` und `dossier-export.mjs`; besser in `v42-dokumente.tsx` aufnehmen. Word-Seitenzahl separat (Word-COM: `_lab\eba-gold-2026-10-23\word-seiten.ps1`).

## In Gold bereits behoben (03.11.)
Begleiter-Altstellen (Indikator S. 7, A2-Heft-Bezug, Spalten, «gleicher Massstab»); Word-DOC-KN-LP-Satz zur Ich-Fassung; Niveauband 80 % präzisiert («auf mindestens 2 Punkten»); Absenz, unentschuldigt, Frist im Dossier-Glossar; Glossarseite des Dossiers nach Textmenge geteilt (lief 263 px über).
