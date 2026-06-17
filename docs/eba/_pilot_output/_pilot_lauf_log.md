# Pilot-Lauf-Log — EBA-2er-Set Kompetenz 1.1.1

**Skill:** `hko-2er-EBA-set-generator` · **Datum:** 2026-06-17 · **Slug:** `lehrvertrag_orientieren`
**Output:** `docs/eba/_pilot_output/` (NICHT live, kein Renderer-Eingriff)
**Sprache:** Swiss Standard German, kein Eszett, echte Umlaute, UTF-8.

> **Selbstauskunft-Kennzeichnung:** Dieser Lauf wurde **manuell von Claude** durchgefuehrt (die Skill
> ist ein Dokument-/Prompt-Asset, kein ausfuehrbares Programm). „Skill-geprueft" heisst: nach den
> Regeln/Checks der Skill-Dateien generiert und mit einem Verifikations-Skript geprueft.
> „Manuell verifiziert" heisst: von Claude per Web-Suche oder Augenschein bestaetigt.

---

## 1. Kandidaten-Entscheide (Phasen 0.5 / 1)

**Phase 0.5 — Kern-Kompetenzversprechen (3 Kandidaten):**
1. „Ich kann meinen Lehrvertrag lesen und verstehen, und ich weiss, bei wem ich Hilfe hole." (K2)
2. „Ich kann die wichtigsten Punkte im Lehrvertrag erklaeren und bei einem Problem die richtige Stelle um Hilfe bitten." (K3)
3. **GEWAEHLT:** „Ich kann mich mit dem Lehrvertrag in der Arbeitswelt orientieren. Bei Fragen oder Konflikten kontaktiere ich die richtige Stelle." (K3)

*Begruendung:* #3 deckt beide nRLP-`gesellschaftliche_inhalte` (Lehrvertrag-Aufbau **und** Konfliktmanagement/Kontaktstellen), ist K3 (EBA-Decke, kein K4), ICH-Form, und traegt den Trade-off „selbst klaeren vs. Hilfe holen" ueber beide Herausforderungen. #1 zu flach (nur K2), #2 etwas eng auf „erklaeren".

**Phase 1 — Herausforderungen (4 Optionen, 2 pro A/B):**
- A gewaehlt: „Lehrvertrag verstehen" (Malerpraktiker/in EBA, Winterthur) statt einer reinen Lohn-Frage — die Probezeit-Unklarheit traegt den Trade-off staerker.
- B gewaehlt: „Konflikt im Betrieb / Hilfe holen" (Automobilassistent/in EBA, Olten) statt eines reinen Missverstaendnis-Falls — der Konflikt zwingt zur Entscheidung „selbst aushalten vs. Stelle kontaktieren".
- Kontrast: Abteilung **Bau** (A) vs. **Technik/Ernaehrung** (B) → Spiralen-Regel erfuellt.

---

## 2. Die sechs Test-Stellen — Befund

| # | Test | Befund | Status |
|---|---|---|---|
| 1 | Quoten-Zusammenfuehrung | 2 SK [2,7,11], 1 Modus (SM9 + SM3), 2 Aspekte: **Recht** (nRLP) + **Identitaet und Sozialisation** (antizipiert aus konfliktart „eigene Rolle"). Herkunft im prinzip.json + Begleiter Sektion 1 dokumentiert. | **gehalten** |
| 2 | A2-Gate greift | Laengster Satz ueber alle SuS-Prosa-Felder = **12 Woerter** (Limit 18). Glossar-Deckung: **0** fehlende Eintraege. Skript-geprueft. | **gehalten** (siehe Hinweis unten) |
| 3 | Dossier deckt jede Leitfrage + KN | Herausforderung A: Leitfragen 1-4 gedeckt; B: 1-4 gedeckt. KN-Ansprueche (Probezeit→A-02, Vertragsteile→A-01, Kontaktstellen→B-02, Vorgehen→B-03, Prinzip→Transfer-Blatt). Kein `ERR_DOSSIER_GAP`. | **gehalten** |
| 4 | Spiralen-Regel | Gemeinsamer Trade-off „Selbst klaeren vs. Hilfe holen". A: unklarer Vertragspunkt → nachfragen. B: Konflikt → Stelle kontaktieren. Verschiedene Berufe/Abteilungen. | **gehalten** |
| 5 | Keine 3er-Reste | Skript-Scan: `hf_C`/`"C"` = 0; `k_stufe:4` = 0; Kapitel/Seiten-Anker = 0. Einziger „Lehrmittel"-Treffer ist die **Negation** „EBA hat KEIN Lehrmittel" (Kommentar im prinzip.json). | **gehalten** |
| 6 | Fakten-Anker | 6 Anker: **5 web-validiert**, **1 `lp_pruefen`** (kantonaler Stellenname variiert), **0 ungeflaggt**. | **gehalten** |

**Hinweis zu Test 2 (ehrlich):** Das A2-Gate ist als blockierender Pre-Write-Schritt in der SKILL.md
definiert. Im Pilot wurde **kein** `ERR_A2_*` ausgeloest, weil die Prosa von Anfang an A2-konform
verfasst wurde — d. h. der Blockier-Mechanismus wurde **nicht durch einen echten Verstoss
provoziert**. Die A2-Konformitaet selbst ist messbar bestaetigt (max. Satz 12 W., Glossar vollstaendig).
Ein echter Negativtest (absichtlicher >18-Wort-Satz) steht aus — Empfehlung fuer Pietros Auswertung.

---

## 3. Ausgeloeste Checks (ERR/WARN) und Aufloesung

- **Keine ERR ausgeloest.** Alle Pre-Write-Bedingungen erfuellt.
- Verifikations-Skript (`python`, gegen die EBA-Checks): JSON-Validitaet 6/6 OK; A2 OK; Leitfrage→Nugget OK; Fakten-Flags OK; 3er-Scan OK.
- Kein `WARN_FAKT_UNGEPRUEFT`, kein `ERR_DOSSIER_GAP`, kein `ERR_A2_*`, kein `ERR_PERSONA_*`.

---

## 4. A2-Fixes

Keine nachtraeglichen Auto-Fixes noetig — Prosa wurde direkt A2 verfasst (kurze Saetze, Sie-Form in
Auftraegen, ICH-Form im Narrativ, jeder Fachbegriff im Glossar). Bewusste A2-Entscheide:
- Lange Schachtelsaetze vermieden (Schnitt deutlich < 12 W.).
- Fachbegriffe (Lehrvertrag, Probezeit, Kuendigung, Kontaktstelle, Lehraufsicht, Berufsbildungsamt, Schlichtungsstelle, KI-Tool, Berufsbildner/in) **alle** im Glossar erklaert.

---

## 5. Fakten-Validierungen (Web, manuell verifiziert)

| Fakt | Wert | Quelle | Flag |
|---|---|---|---|
| Probezeit-Dauer | 1-3 Monate; ohne Vereinbarung 3 Monate | OR Art. 344a Abs. 3; berufsbildung.ch | validiert |
| Probezeit-Verlaengerung | bis max. 6 Monate, mit Genehmigung kant. Behoerde | OR Art. 344a Abs. 3; berufsbildung.ch | validiert |
| Kuendigung Probezeit | 7 Tage Frist, kant. Behoerde melden | OR Art. 346; berufsbildung.ch | validiert |
| Kuendigung nach Probezeit | nur wichtige Gruende / Einvernehmen | OR Art. 346; berufsbildung.ch | validiert |
| Lehrvertrag-Genehmigung | schriftlich, kant. Behoerde genehmigt vor Lehrbeginn | berufsbildung.ch | validiert |
| Zustaendige Stelle bei Konflikt | kant. Berufsbildungsamt / Lehraufsicht vermittelt; **genauer Name variiert je Kanton** | berufsbildung.ch (Kantonale Anlaufstellen) | **lp_pruefen** |

Quellen: berufsbildung.ch (Probezeit / Kuendigung / Aufloesung des Lehrvertrags / Behoerden / Kantonale Anlaufstellen), admin.ch (OR), ch.ch. Web-Suche am 2026-06-17.

---

## 6. Offene Punkte / Auffaelligkeiten fuer Pietros Auswertung

1. **Persona-Tabelle ist EFZ-zentriert.** `hko-framework.md` §11 fuehrt EBA-Berufe nur in der Spalte „Umfasst" (z. B. „Malerpraktiker EBA"). Fuer die Personas habe ich diese EBA-Namen als `persona.beruf` verwendet (statt der EFZ-Spalte „Maler/in EFZ"). Der Check `ERR_PERSONA_NOT_CANONICAL` verlangt String-Gleichheit mit der EFZ-Umlauten-Spalte — fuer EBA passt das nicht sauber. **Empfehlung:** eine EBA-Berufsnamen-Spalte in §11 ergaenzen.
2. **teacher.html nicht erzeugt.** Die Teacher-HTML/A4-Broschuere wird im bbw-hko **vom Renderer** (App, `EinheitWorkbench`/DocS) erzeugt, nicht von der Skill. Out-of-scope fuer den Pilot (kein Renderer-Eingriff). Stattdessen liegt `begleiter.md` vor (Phase 5).
3. **A2-Negativtest steht aus** (siehe Test 2): der ERR-Block wurde nicht durch einen echten Verstoss provoziert.
4. **Mini Case + Werkschau** sind als gleichwertige vereinfachte Alternativen generiert (Konzept §8 #4, vorlaeufiger Stand) — Entscheid Pietro noch offen.
5. **`wochen`-Feld:** kein Fixwert gesetzt (`wochen_plan: []`), wie entschieden. Falls der Renderer spaeter ein Feld erzwingt, mit TODO fuellen.
6. **Dossier-Rendering:** Loader liest `dossier.json` noch nicht (Renderer-Anpassung nach Gold-Review). Die Einheit erscheint trotzdem korrekt (2er, `hf_C`=null im Speicher).

---

## 7. Datei-Inventar (`docs/eba/_pilot_output/`)

```
1.1.1_lehrvertrag_orientieren_prinzip.json          (Phase 0.5)
1.1.1_lehrvertrag_orientieren_herausforderung_A.json (Phase 2)
1.1.1_lehrvertrag_orientieren_herausforderung_B.json (Phase 2)
1.1.1_lehrvertrag_orientieren_set.json              (Phase 3)
1.1.1_lehrvertrag_orientieren_kn.json               (Phase 4)
1.1.1_lehrvertrag_orientieren_dossier.json          (Phase 7)
1.1.1_lehrvertrag_orientieren_begleiter.md          (Phase 5)
_pilot_lauf_log.md                                  (dieses Dokument)
```
teacher.html: bewusst nicht erzeugt (Renderer-Aufgabe, siehe Punkt 6.2).

**Status: Pilot vollstaendig durchgelaufen, alle sechs Test-Stellen gehalten.**
