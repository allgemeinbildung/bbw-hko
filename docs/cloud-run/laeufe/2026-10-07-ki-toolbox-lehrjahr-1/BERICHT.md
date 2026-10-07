# KI-Toolbox 1. Lehrjahr — Bericht des Laufs vom 07.10.2026

> **Stand: Schlussbericht für 14 von 17 Einheiten.** Nach den zwei Sonden stand der Lauf
> nach §7 des Auftrags («derselbe Mangel in mehreren Einheiten → einmal beschreiben und
> Pietro fragen»). Entscheid Pietro (07.10.2026): **die Skill wird angepasst** — umgesetzt,
> siehe §4b; die zwei Sonden sind mit der neuen Skill ein zweites Mal erzeugt worden.
> Danach liefen zwölf weitere Einheiten. **Drei sind auf Anweisung Pietros nicht gestartet**
> (`3.2.1_konsumfolgen_beurteilen`, `3.2.1_wahre_kosten`, `3.3.1_kaufvertrag_beurteilen`).
> Der Pilot ist nur geprüft.

Auftrag: `docs/cloud-run/prompts/ki-toolbox-lehrjahr-1.md` · Skill `hko-ki-komplement`
(Arbeitsbaum, nicht eingecheckt) · Branch `v42-skill` · kein Worktree, kein Commit, kein Index-Bau.

## 1. Tabelle

Seiten = Basis-Auftrag · Plus-Auftrag · Lernprompt · Lernbegleiter (erwartet 2 · 3 · 3 · 3).

| Einheit | Format | Lehrgang | Status | Basis-Muster | Plus-Muster | check-ki-toolbox | Seiten / Überlauf | check-all | Gegenleser | Runden | offen |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1.3.1_konsum_verantworten_v42 (Pilot, nur geprüft) | v4.2 | 4J | publiziert | ai_entscheidungscoach | ai_gegenpositionen | GRUEN, 0 Warn. | 2·3·3·3, kein Überlauf | kein Befund in Toolbox-Dateien | **zurück** | 0 (nur melden) | §3.1 |
| 1.1.1_konflikt_kommunizieren (Sonde, 2× erzeugt) | 3er-Set | 3J+4J (kanonisch 3J) | publiziert | ai_lernassistent (35) | ai_gegenpositionen (80) | GRUEN, 0 Warn. | 2·3·3·3; erst Überlauf Lernbegleiter S. 1 (13.8 px), nach Kürzen keiner | — | 1. Lesung **zurück**, 2. zurück (4 Stellen), letzte Lesung **in Ordnung** | 2 (+1 Kürzungsrunde) | nur Geschmack und Regelfragen · §3.2 |
| 2.1.1_informationen_hinterfragen (Sonde, 2× erzeugt) | v4.2 | 3J+4J (kanonisch 4J) | publiziert | ai_lernassistent (35) | ai_gegenpositionen (50) | GRUEN, 0 Warn. | 2·3·3·3; erst Überlauf Basis-Auftrag S. 2 (28.3 → 10.4 px), nach Kürzen keiner | kein Befund in Toolbox-Dateien | 1. Lesung **zurück**, 2. Lesung **in Ordnung** | 1 (+2 Kürzungsrunden, +1 Nachbesserung) | «Absender» (M13) · §3.3 |
| 1.2.1_lernzeit_planen | v4.2 | 3J (+4J) | publiziert | ai_lernassistent (55) | ai_gegenpositionen (35) | GRUEN, 0 Warn. | 2·3·3·3, kein Überlauf (beim ersten Mal) | kein Befund in Toolbox-Dateien | 1. Lesung **in Ordnung** | 0 (+1 Glättung) | §3.4 |
| 1.1.1_ausbildung_kommunizieren | v4.2 | 3J (+4J) | publiziert | ai_lernassistent (55) | ai_gegenpositionen (80) | GRUEN, 0 Warn. | 2·3·3·3; nach Runde 1 Überlauf Lernbegleiter S. 3 (6.6 px), gekürzt | kein Befund in Toolbox-Dateien | 1. zurück, 2. **in Ordnung** | 1 (+1 Kürzung) | §3.5 |
| 1.1.1_ausbildung_erfassen_zeigen | 3er-Set | 3J (+4J) | **Entwurf** | ai_lernassistent (35) | ai_gegenpositionen (80) | GRUEN, 0 Warn. | 2·3·3·3, kein Überlauf | — | 1. zurück, 2. **in Ordnung** | 1 (+1 Nachbesserung) | §3.6 |
| 1.1.1_rechte_verstehen_nutzen | 3er-Set | 3J (+4J) | publiziert | ai_lernassistent (35) | ai_redaktion (75) | GRUEN, 0 Warn. | 2·3·3·3, kein Überlauf | — | 1. zurück, 2. **in Ordnung** | 1 | §3.7, **§5b** |
| 1.2.2_ki_kompetenznachweis_vorbereiten | 3er-Set | 3J | publiziert | ai_lernassistent (55) | ai_prompt_duell (35) | erst **ROT** (`begriffe`), dann GRUEN | 2·3·3·3, kein Überlauf | — | 1. Lesung **in Ordnung** | 0 (+1 Glättung) | §3.8 |
| 2.2.1_meinungsfreiheit_reflektieren | v4.2 | 4J | publiziert | ai_lernassistent (35) | ai_gegenpositionen (80) | GRUEN, 0 Warn. | 2·3·3·3, kein Überlauf | kein Befund in Toolbox-Dateien | 1. zurück, 2. **in Ordnung** | 1 | §3.9 |
| 1.1.1_einstieg_interview | 3er-Set (nur A/B) | 3J | **Entwurf** | ai_lernassistent (35) | ai_gegenpositionen (35) | GRUEN, 0 Warn. | 2·3·3·3, kein Überlauf | — | 1. zurück, 2. **in Ordnung** | 1 | §3.10 |
| 2.2.1_ausgrenzung_analysieren | v4.2 | 3J | publiziert | ai_lernassistent (35) | ai_gegenpositionen (80) | GRUEN, 0 Warn. | 2·3·3·3; erst Überlauf Lernprompt S. 1 (25.4 px) und S. 2 (7 px), gekürzt | kein Befund in Toolbox-Dateien | 1. zurück, 2. **in Ordnung** | 1 (+1 Kürzung) | §3.11 |
| 2.3.1_anliegen_vertreten | v4.2 | 3J (+4J) | publiziert | ai_lernassistent (35) | ai_gegenpositionen (80) | GRUEN, 0 Warn. | 2·3·3·3; erst Überlauf Lernbegleiter S. 3 (21.5 px), gekürzt | kein Befund in Toolbox-Dateien | 1. zurück, 2. **in Ordnung** | 1 (+1 Kürzung) | §3.12 |
| 2.4.1_haltung_zeigen | v4.2 | 4J | publiziert | ai_lernassistent (35) | ai_gegenpositionen (50) | GRUEN, 0 Warn. | 2·3·3·3, kein Überlauf (beim ersten Mal) | kein Befund in Toolbox-Dateien | 1. Lesung **in Ordnung** | 0 (+1 Glättung) | §3.13 |
| 2.5.1_klimaveraenderung_diskutieren | v4.2 | 4J | publiziert | ai_lernassistent (35) | ai_gegenpositionen (80) | GRUEN, 0 Warn. | 2·3·3·3; erst Überlauf Lernprompt S. 1 (23.8 px), gekürzt | kein Befund in Toolbox-Dateien | 1. zurück, 2. zurück, Schlusslesung **in Ordnung** | **2** (+1 Kürzung) | §3.14 |
| 3.1.1_konsum_verantworten_3j | v4.2 | 3J | publiziert | ai_lernassistent (35) | ai_gegenpositionen (80) | GRUEN, 0 Warn. | 2·3·3·3, kein Überlauf (beim ersten Mal) | kein Befund in Toolbox-Dateien | 1. Lesung **in Ordnung** | 0 (+1 Glättung) | §3.15 |
| 3.2.1_konsumfolgen_beurteilen | v4.2 | 3J (+4J) | publiziert | | | **nicht gestartet** (Anweisung Pietro) | | | | | |
| 3.2.1_wahre_kosten | 3er-Set | 3J (+4J) | Entwurf, hat Toolbox 1.0.0 | | | **nicht gestartet** (Anweisung Pietro) | | | | | |
| 3.3.1_kaufvertrag_beurteilen | v4.2 | 3J (+4J) | publiziert | | | **nicht gestartet** (Anweisung Pietro) | | | | | |

Modelle: Erzeuger durchwegs Opus. Gegenleser: bis `1.2.2` und die ersten Lesungen von
`2.2.1_*` und `1.1.1_einstieg_interview` Opus; ab dann auf Anweisung Pietros Sonnet 5.5 für
Kürzungen, Korrekturrunden und zweite Lesungen, zuletzt auch für die ersten Lesungen
(`2.3.1`, `2.4.1`, `2.5.1`, `3.1.1`).

## 2. Abweichungen von der Liste im Auftrag (§2)

Keine. `src/data/einheiten.index.json` deckt sich in Einheiten, Format, Lehrgang und Status
mit der Liste (18 Einheiten T1–T3, davon 17 zu erzeugen, 1 Pilot). Zwei Anmerkungen:

- `2.1.1_informationen_hinterfragen` hat kanonisch `lehrgang: EFZ_4J`, `lehrgaenge` 3J + 4J —
  die Toolbox trägt darum `EFZ_4J`.
- `CLAUDE.md` nennt `1.1.1_konflikt_kommunizieren` als Beispiel für
  `entwurf_komponenten: ["ki-fluency"]`. In `set.json` steht das Feld **nicht** — die alte
  Toolbox (1.0.0) dieser Einheit ist also bereits für alle sichtbar.

## 3. Was offen blieb, je Einheit

### 3.1 Pilot `1.3.1_konsum_verantworten_v42` — nur gemeldet, nichts behoben

Urteil Gegenleser: **zurück**. Kein KN-Verrat, kein Spur-Inhalt, keine falsche Sachaussage.

- **A1** `ki.json › ki_1.schritte` gegen `prompt_strategie` / `guetekriterien`: «Beantworten Sie
  die Fragen der KI aus Prompt 1 selbst.» / «Halten Sie fest, ob Ihr Entscheid bleibt oder sich
  ändert.» — Prompt 2 und das Prüfen kommen in keinem Schritt vor; «Prompt 2, wenn die KI
  geantwortet hat» passt nicht (die KI fragt); Prompt 1 hat kein Ende. → Muster M1.
- **A2** `lernprompt.json › beispiel_dialog.frage`: «Handy 35 Franken, Streaming 15 Franken,
  Fitness 80 Franken» — Heft B (`zahlen_tabelle`) führt dieselben Abos mit 45 / 20 / 65. Wer
  nachschlägt, findet einen zweiten scheinbaren Fehler. **Nur diese Einheit.**
- **A3** `ki.json › ki_2`: `prompt_strategie[3]` «Schlagen Sie jede Angabe der KI zu Geld und
  Recht im Lehrmittel nach.» gegen `schritte[3]` / `guetekriterien[1]` «mindestens eine Angabe»;
  «Recht» ist in der Einheit nicht gedeckt. Liesmich §2: «Das steht in beiden KI-Aufträgen als
  Kriterium» stimmt für `ki_2` nicht. → teils M7.
- **A4** Prompts ohne Kontext: `lernbegleiter.json › strategie_karten[0].prompt_basis` «Frag mich
  diese Begriffe ab: … Fixe Kosten, Variable Kosten, Rückstellung, Saldo …» (die KI liefert die
  betriebliche Bedeutung); `[2]`/`[3].prompt_fortgeschritten` «… «Wirtschaftliches Prinzip»»;
  `[4].prompt_fortgeschritten` Lernkarten zu heft-eigenen Begriffen;
  `lernprompt.json › stacking_seite_2.prompt_1` «… ob er zu meinem Budget passt» (Budget steht
  nicht im Prompt). → M3.
- Weiter: `kn_typ_tracks[2]` «[mein Prinzip]» (M5) · `prompt_vorlage` «Format» (M6) ·
  `selbstcheck[1]` «Meine Übungsfälle waren andere als mein Kompetenznachweis.» (M4) ·
  `ki_1.reflexion[1]` «Im Fachgespräch des Kompetenznachweises …» (M2) ·
  `nrlp_anker.thema_text` «T1 — …» im Word (M8) ·
  `ki_2.prompt_strategie[1]` «Welches deiner drei Argumente ist das stärkste?» widerspricht dem
  `auftrag` («Entscheiden Sie am Schluss, welches Argument Sie ernst nehmen») ·
  `ki_2.prompt_strategie[2]` «Verraten Sie der KI … nicht, welche Antwort Sie sich wünschen» ohne
  Funktion bei fertigem Prompt · Ausschlussliste «keine Kopfhörer, kein Handy, kein Abo und kein
  Openair» nur in `strategie_karten[3].prompt_basis`, nicht in den drei `kn_typ_tracks[].prompt` ·
  `selbsteinschaetzung[0]` «(Kap. 2.7, S. 73–77)» — S. 76–77 liest nur die Spur ohne Medien ·
  `nrlp_anker.gesellschaft_details[0].kompetenz_anker` «1.3.1» für Budget/Schuldenspirale
  (wären 1.3.2 / 1.3.3; nicht gedruckt) · Datenschutz-Hinweis fehlt bei
  `strategie_karten[2].prompt_fortgeschritten` «[mein Budget]».
- Liesmich: §3 «bauen eigene Prompts» (M7) · Zeitpunkt Basis/Plus gegen `ki.json › timing` (M7) ·
  kein Hinweis auf den absichtlichen Rechenfehler im Beispiel-Verlauf, auf die Begriffe-Liste
  und die Notizfelder.

### 3.2 `1.1.1_konflikt_kommunizieren` (zweimal erzeugt)

**Erster Durchgang (alte Skill)** — ersetzt. Er zeigte die Muster M1–M8 und M12 (§4).

**Zweiter Durchgang (neue Skill).** Basis `ai_lernassistent` 35 (Entscheidungs-Leitfragen
3 von 12, nicht dominant), Plus `ai_gegenpositionen` 80; Plus-Techniken «Gegenseite
verlangen», «Quellen verlangen». Fehler im Beispiel-Verlauf: 10 statt 9 Stunden tägliche
Höchstarbeitszeit (ArG 31 stimmt). Überlauf Lernbegleiter S. 1 (13.8 px) → `begriffe` von 20
auf 11 gekürzt (Reserve jetzt 7.5 px). Gegenleser: 1. Lesung «zurück» (11 Befunde, u. a. Lücke
«[mein Produkt]», Varianten des Begleiters, «Register» nicht nachschlagbar), 2. Lesung «zurück»
(4 neue Stellen, u. a. «gilt sie nicht»), letzte Lesung **«in Ordnung»**, Fehler: keine.

Offen (vom Gegenleser ausdrücklich nicht als Fehler gewertet):

- Ungenau: `lernprompt.json › stacking_seite_1.logik_und_ziel` «Prompt 2 zeigt auf eine Stelle in
  Ihren Antworten.» — auf die Stelle zeigt die KI, nicht der Prompt.
- Regelfrage: `ki.json › ki_1`, Zeile «Prüfen» «Schlagen Sie jede Angabe zu Recht und Regeln …
  nach» ist nicht bedingt formuliert («Nennt die KI …»); in der Sache gedeckt.
- Plus: `lernbegleiter.json › uebungs_feedback.prompt_fortgeschritten` «… Stell mir zwei Fragen
  zu Lücken, eine nach der anderen.» — «je Kriterium» ist weggefallen, die KI kann beide Fragen
  zum selben Kriterium stellen.
- Geschmack: `ki_2.auftrag` «Ihre Position ist, was Sie im Konflikt Ihrer Herausforderung
  verlangen. …» (vier Erklärungen, ein Auftragssatz) · `rubrik_fokus[Ges].so_uebst_du` «… Sicht
  der anderen Seite üben Sie am Übungsfall dieser Seite.» («Seite» zweimal) ·
  `techniken[2].erklaerung` sagt nicht mehr, was die Lernenden tun · die Lücke «[meine wichtigste
  Aussage]» steht in Karte 1, woher sie kommt erst in Karte 2 · `techniken[3].thema_bezug` (Plus)
  «Ihr Positionspapier braucht Quellen, die es wirklich gibt.» setzt Produkt A voraus.

Vom Erzeuger gemeldet, Entscheid Pietro: `begriffe` hat 11 von 22 Konzepten (weg: 1 Sperrwort,
6 Ausschreibungen, 3 ohne Leitfrage, «Register»); `selbstcheck` hat drei Zeilen; der
Fachgespräch-Prompt stellt drei Fragen (der KN fünf); `kompetenzversprechen` trägt wörtlich
«adressatengerecht»; Übungsfälle spielen ausserhalb des Lehrbetriebs (Verein, Schule, Familie).
Nicht Skill: `docx-builder.ts` überschreibt den Ohne-KI-Schritt im Word mit «Eigene Position
festhalten».

### 3.3 `2.1.1_informationen_hinterfragen` (zweimal erzeugt)

**Erster Durchgang (alte Skill)** — ersetzt. Er zeigte M1, M3–M7 und M13.

**Zweiter Durchgang (neue Skill).** Basis `ai_lernassistent` 35 (Entscheidungs-Leitfragen 4 von
10; die Produkte heissen «Standort» und «Regel»), Plus `ai_gegenpositionen` 50; Plus-Techniken
«Gegenseite verlangen», «Quellen verlangen» (Gleichstand zu viert, feste Reihenfolge). Fehler im
Beispiel-Verlauf: Die KI beschreibt unter «Quellen-Check» den Google-Check. Überlauf
Basis-Auftrag S. 2 (28.3 px, nach erstem Kürzen 10.4 px) → zwei Kriterien auf je eine Zeile.
Gegenleser: 1. Lesung «zurück» (B1–B4 und 18 kleine), 2. Lesung **«in Ordnung»**; fünf kleine
Reststellen danach gerichtet, §5 erneut grün.

Offen:

- **«Absender» fehlt in allen Texten für Lernende** (M13): Kernwort der Einheit, im Glossar nur
  mit `spur: "mit_medien"`, vom Skript gesperrt; umschrieben («kommt von jemandem mit einem
  Interesse», «woher sie stammt»). Entscheid Pietro: Glossar oder Skript.
- Die Plus-Wahl hängt an einem Urteil: Gälte das «Mediennutzungs-Protokoll mit Reflexion» als
  «schriftlich-formell», hätte `ai_redaktion` 75 statt 45 und läge vor `ai_gegenpositionen`.
  `ki-scoring.md` definiert «schriftlich-formell» nur über Beispiele.
- Beide KI-Aufträge arbeiten mit der «Regel» aus Heft B; der «Standort» aus Heft A steht nur im
  `bezug` und im Plus des Lernprompts.
- `lernprompt.json › techniken[1].warnung` «Kopieren Sie keine Chat-Nachrichten mit Namen in den
  Prompt.» — nicht wörtlich der Satz der Skill («Schreiben Sie keine Namen in den Prompt.»).
- Hinweise des Gegenlesers: «Heirat» ist aus der Ausschlussliste der Übungsfälle gefallen;
  «Interesse» und «Wert» sind für die KI Alltagswörter (die Warnung fängt es auf); im Plus wählen
  die Lernenden das stärkste Argument ohne Massstab.
- `check-all` in **anderen** Dateien der Einheit (nicht angefasst): `herausforderung_B.json ›
  handlungsprodukt.beschreibung` `WARN_KOH_ANZAHL` («vier weitere Inhalte» gegen «fünf
  Inhalten»); `set.json › gemeinsamer_auftrag.schritte[2].hint` `ERR_KOH_ANZAHL` («drei
  Stationen», `produkte[1].stationen` führt 4); je einmal `ERR_BELEGE_FEHLT`, `ERR_FAKTEN_FEHLT`,
  `ERR_FALL_FEHLT`; 9× `ERR_ZEIGER_SCHRITT_OHNE_SEITE`.

### 3.4 `1.2.1_lernzeit_planen`

Basis `ai_lernassistent` 55, Plus `ai_gegenpositionen` 35; Plus-Techniken «Schritt für Schritt
denken», «Gegenseite verlangen». Fehler im Beispiel-Verlauf: C heisse «soll» statt «kann»
(ABC-Analyse). §5 beim ersten Mal grün. Gegenleser 1. Lesung **«in Ordnung»** (zehn kleine
Stellen) → eine Glättungsrunde, §5 erneut grün, keine weitere Lesung.

Offen / Entscheid:

- Die Plus-Wahl hängt an einem Urteil: Zählt der KN mit, hätte `ai_redaktion` 45 statt 35.
- Karte «Lernplan machen»: Die KI fragt, sie plant nicht (so gewollt nach «die KI liefert keinen
  Stoff»); Übungsfälle spielen bei Nebenjob / Geld / Computer.
- `begriffe`: 17 Einträge, 221 Zeichen (Richtwert 200).
- `check-all` in anderen Dateien: `herausforderung_A.json` 2× `WARN_KOH_WOCHE_MINUTE`,
  `WARN_KOH_ANZAHL`; `begleiter.md` `ERR_KOH_STUFE_PUNKTE`.

### 3.5 `1.1.1_ausbildung_kommunizieren`

Basis `ai_lernassistent` 55, Plus `ai_gegenpositionen` 80; «Gegenseite verlangen», «Quellen
verlangen». Fehler im Beispiel-Verlauf: Bei BCC sähen alle Empfänger einander. §5 beim ersten Mal
grün; nach Runde 1 Überlauf Lernbegleiter S. 3 (6.6 px) → gekürzt. Gegenleser 1. Lesung «zurück»
(u. a. zweiter Fehler im Beispiel-Verlauf, Spur-Inhalt «Belege mit Kapitel und Seite»),
2. Lesung **«in Ordnung»**.

Offen (Ungenauigkeit):

- `ki.json › ki_2.schritte[2]` und Zeile «Prüfen»: «Schlagen Sie jede Regel der KI im Lehrmittel
  nach.» — unbedingt, obwohl Prompt 1 die Regel freiwillig macht (`ki_1` hat die bedingte Form
  «Nennt die KI Regeln, …»).
- `ki_1.bezug` / `ki_2.bezug`: «dann Kanal und Ton wählen und schützen» — «Kanal» kommt in Heft A
  nicht vor, die Einheit sagt «Weg und Ton».
- `lernprompt.json › techniken[3]`: «So können Sie gezielt nachschlagen.» — wo, steht nicht.
- `ki-liesmich.md` §4, Demo im Plenum: Live eingetippt kommt der Fehler des Beispiels wohl nicht.
- Geschmack: Karte 1 fragt «BCC» ab, der Beispiel-Verlauf druckt die Antwort; `feynman.warnung`
  «die Lücke der KI».
- `check-all` in anderen Dateien: 5× `ERR_ZEIGER_SCHRITT_OHNE_SEITE`, `herausforderung_A.json ›
  schritte[4].hint` `WARN_KOH_WOCHE_MINUTE`. Liesmich-Frontmatter `lehrgang: EFZ 3J`
  (`set.lehrgaenge` führt auch 4J).

### 3.6 `1.1.1_ausbildung_erfassen_zeigen` (Entwurf)

Basis `ai_lernassistent` 35, Plus `ai_gegenpositionen` 80; «Gegenseite verlangen», «Quellen
verlangen». Fehler im Beispiel-Verlauf: vier statt fünf Wochen Ferien mit 17. §5 beim ersten Mal
grün. Gegenleser 1. Lesung «zurück» (B1: «ohne KI» / «nie bei der Abgabe» nicht gedeckt — der
Hauptweg ist die Werkschau mit genau den Produkten des Basis-Auftrags), 2. Lesung
**«in Ordnung»**; F1 danach behoben, §5 grün.

Offen (Ungenauigkeit):

- Welche Begriffe zu welcher Herausforderung gehören, steht nur im Liesmich; «Duale
  Berufsbildung» und «Soziale Rolle» stehen nicht im Lehrmittel; «SMART-Ziel» nicht wörtlich.
- `lernbegleiter.json › integritaet_warnung`: «Was auf Ihrem Blatt steht» ist unbestimmt; «nie
  eine Lösung für den Kompetenznachweis» steht nur noch auf der Plus-Seite.
- Reihenfolge der Plus-Karten: «Rückmeldung holen» steht vor «Übungsfall lösen» (fest in der Skill).
- `begriffe`: 6 Einträge, 210 Zeichen (der erste hat 74) — Richtwert 200 unerfüllbar.
- Der Nachschlage-Ort deckt Herausforderung B nicht ganz.

### 3.7 `1.1.1_rechte_verstehen_nutzen`

Basis `ai_lernassistent` 35, Plus `ai_redaktion` 75 (`ai_gegenpositionen` 65, mit dem Zuschlag
«Akteurs-Seiten» 80 — Urteil); «Gegenseite verlangen», «Quellen verlangen». Fehler im
Beispiel-Verlauf: Überstundenzuschlag 50 statt 25 Prozent. §5 beim ersten Mal grün. Gegenleser
1. Lesung «zurück» (B1: `ki_2.auftrag` schlug «Lohnabzug» vor = Thema des KN; B3 Kriterium
«Position / Werthaltung» falsch erklärt), 2. Lesung **«in Ordnung»**.

Offen (Ungenauigkeit):

- `lernbegleiter.json › uebungs_feedback.wann`: «im selben Chat» ohne Bezug.
- «Begründung» meint einmal das Ganze, einmal einen Teil.
- `rubrik_fokus[].so_uebst_du`: «wo Sie weiterverweisen» ohne Ziel (20 Wörter).
- `lernprompt.json › techniken[1].thema_bezug`: «aus einer Ihrer Arbeiten» ist ungenauer als vorher.
- Sieben `begriffe` ausserhalb Kap. 1.4 haben keine Basis-Karte.
- Geschmack: `ki_2.auftrag` nimmt als Beispiel «Überstunden» (= Beispiel-Verlauf);
  «Personalabteilung» als Rolle.
- `ai_redaktion` reibt sich an «die KI liefert keinen Stoff» (die KI schreibt einen Entwurf von
  fünf Sätzen) — Klausel dazu steht jetzt in `basis-plus.md` §1 Nr. 5.
- `kompetenzversprechen` trägt wörtlich «adressatengerecht» (Sperrwort, bleibt).

**Nicht Toolbox, aber gewichtig — siehe §5b:** `herausforderung_C.json ›
handlungsprodukt.musterloesung` enthält den KN-Fall wörtlich.

### 3.8 `1.2.2_ki_kompetenznachweis_vorbereiten`

Einheit ohne Lehrmittel. Basis `ai_lernassistent` 55, Plus `ai_prompt_duell` 35; «Form der
Antwort vorgeben» (1 Signal), «Gegenseite verlangen» (0 Signale, nur über die Reihenfolge bei
Gleichstand). Fehler im Beispiel-Verlauf: 3 Wochen × 2 h = 8 statt 6 h. Kam **ROT** zurück
(`begriffe` nur 5, weil «Halluzination» gesperrt ist und hier Prüfstoff) → Skill-Ausnahme, danach
grün. Gegenleser 1. Lesung **«in Ordnung»** → eine Glättungsrunde, §5 grün.

Offen / Entscheid:

- `prompt_vorlage` heisst hier «… Rolle, Ziel, Kontext, Format.» (Formel der Einheit). Der
  Renderer druckt die Spalten des Baukastens fest als «Rolle · Kontext · Aufgabe · Format»
  (`DocLernprompt.tsx`); kein fertiger Prompt nennt ein «Ziel».
- `begriffe`: «Sprachmodell (LLM)», «Quellenkritik», «Lernstrategie» stehen in keinem Heft.
- «Quellen verlangen» hätte inhaltlich Sinn, bekommt aber kein Signal (die Tabelle liest nur
  `sk_schnittmenge_kn.primary`).
- Fertige Prompts sind in dieser Einheit selbst das Handlungsprodukt (A LF2, C LF4, KN-Aufgabe 3);
  der Liesmich setzt den Lernprompt darum «nach den Herausforderungen».
- Das Skript sperrt «halluzin» in allen Feldern — siehe §5b.

### 3.9 `2.2.1_meinungsfreiheit_reflektieren`

Basis `ai_lernassistent` 35, Plus `ai_gegenpositionen` 80; «Gegenseite verlangen», «Schritt für
Schritt denken». Fehler im Beispiel-Verlauf: Die Meinungsfreiheit habe keine Schranken. §5 beim
ersten Mal grün. Gegenleser 1. Lesung «zurück» (B1 «ohne KI» / «allein» nicht für die Werkschau
gedeckt; B3 «Prüfen Sie … zuerst selbst» ohne Massstab), 2. Lesung **«in Ordnung»**.

Offen (Ungenauigkeit):

- `ki-liesmich.md` §2: «geübt wird an *anderen* Fällen, auch nicht an den Fällen der zwei Hefte
  und des gemeinsamen Auftrags.» — schief; gilt nur für den Übungsfall.
- `lernbegleiter.json › mock_transfer.prompt_fortgeschritten`: «Sag mir nach meiner Antwort, was
  fehlt.» — der Prompt stellt keine Frage.
- `ki.json › ki_1.ki_frei_vorher` / `schritte[0]`: «Prüfen Sie ohne KI, ob Einordnung, Recht und
  Schranke stehen.» — der Gegenstand («Ihre drei Sätze») fehlt; «Einordnung» gehört zur Tabelle.
- `ki_1.bezug`: «In beiden schützt die Meinungsfreiheit …» — in Heft B nur im Titel.
- «KI» steht in `ziel` / `titel` vor der Erklärung im `auftrag` (der Renderer druckt Ziel und
  Bezug zuerst).
- `ki_2.schritte`: Kein Schritt sagt «auf den stärkeren Einwand antworten und Prompt 2 senden».
- `kn_typ_tracks[1].uebungsfokus`: «begründen am Schluss Ihren Standpunkt in Ich-Form» — der
  Prompt verlangt nur zwei Aufgaben.
- Nicht geändert: Seitenzahl in `ki_1`, Zeile «Prüfen».
- Empfindlicher Stoff (Standpunkt zur Einbürgerung): Die Plus-Prompts tragen «Greif keine
  Menschen an.»
- `check-all` in anderen Dateien: `herausforderung_B.json › bewertungsraster[2]`
  `WARN_KOH_WOCHE_MINUTE`; `herausforderung_A.json › handlungsprodukt.abgaben[0]`
  `WARN_KOH_ANZAHL`, `loesungsbild.bloecke[0]` `ERR_KOH_ANZAHL`; `q-221.2a-vertiefung-2`
  `WARN_KOH_KURZBESCHRIEB`; 1× `ERR_ZEIGER_WOERTER`; 11× `ERR_ZEIGER_SCHRITT_OHNE_SEITE`.

### 3.10 `1.1.1_einstieg_interview` (Entwurf, Variantenset nur A/B)

Basis `ai_lernassistent` 35, Plus `ai_gegenpositionen` 35; «Gegenseite verlangen», «Schritt für
Schritt denken». Fehler im Beispiel-Verlauf: Detailfragen vor Grundsatzfragen (Kap. 16.4 sagt es
umgekehrt). §5 beim ersten Mal grün. Gegenleser 1. Lesung «zurück» (u. a. «ohne KI» nicht für
jede Form gedeckt; Warnung zu den Daten des Gegenübers widersprach Heft B), 2. Lesung
**«in Ordnung»**.

Offen (Ungenauigkeit):

- `ki-liesmich.md` §2: «in der Werkschau legen die Lernenden genau die Arbeiten vor, an denen der
  Basis-Auftrag mit der KI gearbeitet hat» — die KI sieht nur einen Satz; das Kurzprofil geht nie
  in die KI. · «Ohne KI» steht darum nicht auf den Blättern» — doppeldeutig (Feldtitel «Ohne KI
  zuerst»).
- `lernbegleiter.json › uebungs_feedback`: Das Blatt sagt nicht, dass die Notiz vor dem Einfügen
  umformuliert wird (das Musterbeispiel B enthält das wörtliche Stück «Zugeschaut?»);
  `prompt_fortgeschritten` «Steht bei jedem Satz ein Beispiel aus dem Gespräch?» passt nicht zu
  Satz 1 und 4 der Notiz.
- Die Regel zum Gegenüber steht nicht überall gleich lang: voll nur im Lernbegleiter und im
  Liesmich, auf Aufträgen und Lernprompt nur «keine Namen».
- «Satz zur Methode» ist in `ki_1` und im Lernprompt verschieden bestimmt; die Prompts nennen die
  eigene Methode nicht selbst (der Satz in der Lücke muss sie nennen).
- `lernprompt.json › techniken[3]`: «Ziel, Zeit, Gegenüber» gegen Prompt «Zeit und Ort».
- Geschmack: Der Liesmich mischt «Heft A/B» und «Herausforderung A/B»; `ki_1.bezug` «In beiden
  gilt der Satz «Wer fragt, entscheidet mit …»» steht in keinem Heft; `ki_1` Schritt 3: Prompt 2
  stellt eine letzte Frage, deren Beantwortung kein Schritt vorsieht.
- Variantenset: Jede Person bearbeitet nur eine Herausforderung — `ki.timing` sagt «nach
  Austausch & Transfer», obwohl die Phase entfällt; `begriffe` 12 von 23.

### 3.11 `2.2.1_ausgrenzung_analysieren`

Basis `ai_lernassistent` 35, Plus `ai_gegenpositionen` 80; «Gegenseite verlangen», «Schritt für
Schritt denken». Fehler im Beispiel-Verlauf: Die KI nennt das Vorurteil eine Handlung
(= Diskriminierung). §5: Überlauf Lernprompt S. 1 (25.4 px) und S. 2 (7 px) → gekürzt. Gegenleser
1. Lesung «zurück» (knapp, Formulierungen: «Das Stereotyp stimmt.» wörtlich missverständlich),
2. Lesung **«in Ordnung»**.

Offen (Ungenauigkeit):

- `lernprompt.json › beispiel_dialog.pruefung`: «Ein Stereotyp ist ein Bild, richtig.» —
  «richtig» ohne Bezugswort (kann an «Bild» hängen); gekürzte Glossarformen.
- `lernbegleiter.json › strategie_karten[2].warnung`: «Die KI kennt Ihr Heft nicht. Sie zeigt nur
  Lücken und bewertet Ihre Lösung nicht.» — «Sie» / «Ihre» mit zwei Bezügen.
- `lernprompt.json › techniken[0].warnung`: «Was sie sagt, prüfen Sie.»
- `lernprompt.json › techniken[2]`: Das Blatt sagt nicht, dass die Grenze der Standpunkt ist.
- `ki.json › ki_2`: Das Wählen des stärkeren Einwands steht nur im Nebensatz von Schritt 4;
  `reflexion[0]` setzt einen Entscheid voraus, den kein Schritt mehr verlangt; `reflexion[1]`
  «Welcher Einwand der KI passte nicht zu Ihrem Standpunkt?» (jeder Einwand passt nicht).
- «Rechte und Begriffe der KI sind nachgeschlagen» — der Genitiv liest sich als Rechte der KI.
- `ki-liesmich.md` §2 «Keine Namen»: Die Stichwort-Zeile fehlt auch in `ki_2` Prompt 1,
  `techniken[2]`, `stacking_seite_2.prompt_2` und «Selbst erklären» — der Satz klingt abschliessend.
- Regelkonflikt **«Stufe»**: Heft A nennt die Kettenglieder «Stufen», das Skript sperrt «stufe»
  — siehe §5b. `begriffe` 19 («Wirkung» steht doppelt im Glossar).
- `check-all` in anderen Dateien: `herausforderung_B.json › bewertungsraster[2]`
  `WARN_KOH_WOCHE_MINUTE`; `q-221b-vertiefung-2` `WARN_KOH_KURZBESCHRIEB`;
  10× `ERR_ZEIGER_SCHRITT_OHNE_SEITE`.

### 3.12 `2.3.1_anliegen_vertreten`

Basis `ai_lernassistent` 35 (Entscheidungs-Leitfragen 1 von 6), Plus `ai_gegenpositionen` 80;
«Schritt für Schritt denken», «Gegenseite verlangen». Fehler im Beispiel-Verlauf: Eine Petition
sei nur für Stimmberechtigte offen (Glossar: für alle Urteilsfähigen). §5: Überlauf Lernbegleiter
S. 3 (21.5 px, Plus-Karten 3'043 Zeichen) → auf 2'696 gekürzt. Gegenleser 1. Lesung «zurück»
(F1: `ki_2` Prompt 2 «deinen Einwand» bei drei Einwänden mehrdeutig; Lücke «Position mit
Begründung» gibt es auf der Diskussionskarte nicht; Übungsfall «Buslinie» stammt aus den Heften),
2. Lesung **«in Ordnung»**, Fehler: keine.

Offen (Ungenauigkeit, Wortlaut des Gegenlesers):

- `lernbegleiter.json › kn_typ_tracks[fachgespraech]`: `uebungsfokus` «Sie erklären mündlich einen
  Weg der Mitwirkung und vertreten Ihre Position …», der Prompt bestellt nur «Stell mir dazu drei
  Fragen, eine nach der anderen. Frag auch nach meiner Position.» — vom Weg steht nichts darin.
- `kn_typ_tracks[mini_case_schriftlich]`: Der Prompt sagt «Zwei Wege sind möglich … Stell mir dazu
  zwei Aufgaben» — was die zwei Aufgaben sind, steht nicht darin.
- `strategie_karten[mock_transfer].prompt_fortgeschritten`: «Stell mir eine Aufgabe zum Fall» —
  die Aufgabe verlangt weder Weg noch Begründung, die danach geprüften Kriterien können ins Leere
  laufen. (64 Wörter; Richtwert 55, Grenze 70.)
- `ki.json › ki_2.prompt_strategie[0]`: Der Prompt sagt nicht, dass die KI keinen Einwand als den
  stärksten bezeichnen soll (die Technik im Lernprompt hat «Sag nicht, welcher Einwand stärker ist»).
- `ki_2`: Nirgends steht, woran man den «stärksten Einwand» erkennt (Heft B: «der Grund, der
  Ihnen selbst am meisten zu denken gibt»); ein eigener Schritt «Wählen Sie …» fehlt.
- `ki_2.ziel`: «Sie prüfen Ihre Position an drei Einwänden der KI» — beantwortet wird einer.
- `ki_2.prompt_strategie[1]`, Lücke «[meine Antwort]»: Der Name sagt nicht, was hineinkommt
  (Behauptung, Begründung, Beispiel); die Karte in Heft B trägt auch eine «Antwort», aber auf den
  eigenen Einwand.
- `ki_2.reflexion[0]`: «Welcher Einwand der KI war stärker als der Einwand auf Ihrer
  Diskussionskarte?» setzt voraus, dass es einen gab.
- `ki-liesmich.md` §2: «… zeigen die Lernenden ein Produkt, an dem der Basis-Auftrag mit der KI
  gearbeitet hat (das Factsheet).» — nach `kn.json` Factsheet **oder** Diskussionskarte.
- `ki-liesmich.md` §3: «Niemand tippt ein ganzes Produkt ab» gilt für die Basis; im Plus tippen
  die Lernenden eine Antwort in drei Teilen und ein Argument — steht nirgends.
- Geschmack: Wechsel «Position» / «Argument» zwischen Technik und Seite mit zwei Prompts;
  `warnung` der Karte «Lernplan machen» («Freie Zeiten … tragen Sie selbst ein») leicht unklar;
  das Kriterium «Nachgeschlagen» deckt die Antwort der KI auf Prompt 2 nicht (nur die Zeile «Prüfen»).
- `beispiel_dialog.frage` trägt keine Rolle mehr («Du bist mein Lerncoach.» fiel der Länge zum
  Opfer). «Urteilsfähige» und «Stimmberechtigte» sind dort nicht erklärt (Wörter des Glossars).
- Regelkonflikt **«Ich-Form»** — siehe §5b. `begriffe` 20 Einträge, 208 Zeichen.
- `check-all` in anderen Dateien: `herausforderung_B.json › schritte[4].hint`
  `WARN_KOH_WOCHE_MINUTE`; `set.json › gemeinsamer_auftrag.schritte[3].hint` `WARN_KOH_ANZAHL`;
  12× `ERR_ZEIGER_SCHRITT_OHNE_SEITE`.

### 3.13 `2.4.1_haltung_zeigen`

Basis `ai_lernassistent` 35 (1 von 6), Plus `ai_gegenpositionen` 50 (`ai_redaktion` 45 — oder
75, falls die Rezension als «schriftlich-formell» gilt: Urteil); «Gegenseite verlangen», «Schritt
für Schritt denken». Fehler im Beispiel-Verlauf: Die KI nennt «… und ist langweilig» eine reine
Beschreibung. §5 beim ersten Mal grün. Gegenleser 1. Lesung **«in Ordnung»**, Fehler: keine,
zwölf Ungenauigkeiten → eine Glättungsrunde (alle zwölf bearbeitet), §5 erneut grün, keine
weitere Lesung.

Offen / Entscheid:

- `ki.json › ki_1.auftrag` / `ki_2.auftrag`: «Satz 1 im Werkkommentar oder Satz 1 im Abschnitt
  Urteil» — ohne «Ihrer Rezension» (Platz); Heft B nennt den Abschnitt selbst «Urteil».
- `ki_1.prompt_strategie[0]`: Die Rolle «Du bist mein Lerncoach.» ist dem Platz gewichen; die KI
  erfährt weiterhin nicht, um **welches** Werk es geht (eine Lücke in der Basis).
- `lernbegleiter.json › kn_typ_tracks[0].prompt` (Fachgespräch): «Gib mir keine Lösung.» ist
  entfallen (45 Wörter); die KI soll nur fragen. `kn_typ_tracks[2].prompt` beginnt «Gelernt:
  [was ich gelernt habe].» (in den anderen Einheiten «Das habe ich gelernt: …»).
- `rubrik_fokus[1].so_uebst_du`: «Üben Sie, Zeigen und Wirken eines Werks zu trennen und Ihre
  Haltung in Ich-Form zu sagen (Übungsfall hier).» — verdichtet, weil die ausgeschriebene Fassung
  24 Wörter gehabt hätte.
- Aus der Lesung nicht behandelt (Geschmack): «Keine Namen» ist bei Werktiteln mehrdeutig;
  `nrlp_anker` führt nur «Kultur»; `begriffe` 19 («Wirkung» doppelt im Glossar).
- `check-all` in anderen Dateien: `herausforderung_A.json` `ERR_KOH_LOESUNG_SICHTBAR`
  (`loesungsbild.bloecke[2]` teilt acht Wörter mit dem Beispielbild); 7×
  `ERR_ZEIGER_SCHRITT_OHNE_SEITE`.

### 3.14 `2.5.1_klimaveraenderung_diskutieren`

Basis `ai_lernassistent` 35 (2 von 6), Plus `ai_gegenpositionen` 80; «Gegenseite verlangen»,
«Quellen verlangen». Fehler im Beispiel-Verlauf: Netto-Null «ab 2040» statt «ab 2050». §5:
Überlauf Lernprompt S. 1 (23.8 px) → 15 Felder gekürzt. Gegenleser 1. Lesung «zurück» (F1 die
Lernkarten ordneten Ursachen unter «Folgen und Lösungen»; F2 «Position (wofür Sie sind)» zu eng),
2. Lesung «zurück» (ein Fehler im Liesmich, den Runde 1 eingeführt hatte: «Nur im Plus bringt sie
selbst Behauptungen ein»), nach Runde 2 Schlusslesung **«in Ordnung»**, Fehler: keine.
**Zwei Runden — damit ist nach §6 Schluss; was bleibt, steht hier.**

Offen (Ungenauigkeit, Wortlaut des Gegenlesers):

- `ki-liesmich.md` §2: «auch in der Basis kann sie Falsches sagen — darum wird jede Zahl und jeder
  Fachbegriff nachgeschlagen» gilt wörtlich nur für den Basis-Auftrag; Lernprompt und
  Lernbegleiter verlangen in der Basis nur den Vergleich mit dem Glossar. Der Kasten darunter
  heisst «Zahlen, Fachbegriffe und Quellen: immer gegenprüfen», nennt im Text aber nur Glossar
  oder Lehrmittel (Quellen prüfen die Lernenden «im Netz»).
- `lernbegleiter.json › repetitionsplan.prompt_fortgeschritten`: «Temperaturanstieg» ist zwischen
  Ursache und Folge nicht eindeutig; «zehn Lernkarten» bei acht Begriffen — für zwei Karten ist
  kein Begriff vorgegeben.
- `lernprompt.json › «Kontext geben» › thema_bezug`: «Ihre Aussage zur Zukunft (A) oder Ihre
  Position (B).» — Fragment ohne Verb, «(A)/(B)» ohne «Heft» (Platz auf Seite 1); es steht nicht
  da, dass dies in die Lücke kommt. `stacking_seite_1` ist dazu nicht geändert (die Lücke erklärt
  nur der `thema_bezug`).
- `ki.json › ki_1`: Schritt 1 und `ki_frei_vorher` sagen nur «Aussage»; wer aus Heft B kommt, hat
  eine «Position» — die Zuordnung steht nur im `auftrag`. Kein Schritt sagt, dass Prompt 2
  abzuschicken ist (Schritt 3: «nach Prompt 2»).
- `ki.json › ki_2.schritte[3]`: «Beantworten Sie den stärksten Einwand, bevor Sie Prompt 2
  abschicken.» — das Abschicken steht nur im Nebensatz.
- `lernbegleiter.json › rubrik_fokus[SuK].so_uebst_du`: «… (Übungsfall oben).» — auf der Seite
  heissen die Übungsfälle «neuer Fall»; die Tracks verlangen kein Beispiel («mit Beispiel zu
  begründen» prüft nur die Plus-Karte «Rückmeldung holen»).
- **Nicht geändert:** der Verweis «(Kap. 9)» in `ki_1.prompt_strategie[2]`,
  `ki_2.prompt_strategie[2]` und der `warnung` von «Gegenseite verlangen» — die Begriffe aus
  Heft B stehen in Kap. 16/17; der zweite Verweis hätte die Felder verlängert (0 px Reserve).
- `ki_2`, Zeile «Prüfen» weicht vom festen Wortlaut der Skill ab («jede Begründung der KI»,
  «nicht als belegt» — die Wörter von Heft A). `begriffe` 20 Einträge, 238 Zeichen; Lernbegleiter
  S. 1 hat nur 9.2 px Reserve.
- `check-all` in anderen Dateien: `herausforderung_A.json` `ERR_KOH_LOESUNG_SICHTBAR`,
  `WARN_KOH_ANZAHL`; `herausforderung_B.json` 3× `WARN_KOH_WOCHE_MINUTE`; `q-251b-pflicht`
  `WARN_KOH_KURZBESCHRIEB`.

### 3.15 `3.1.1_konsum_verantworten_3j` (nur Spur mit Medien)

Basis `ai_lernassistent` 35 (1 von 6), Plus `ai_gegenpositionen` 80; «Gegenseite verlangen»,
«Quellen verlangen». Fehler im Beispiel-Verlauf: Abos 130 Franken im Monat stimmen, aufs Jahr
1460 statt 1560 Franken. §5 beim ersten Mal grün. Gegenleser 1. Lesung **«in Ordnung»**, Fehler:
keine, zehn Ungenauigkeiten → eine Glättungsrunde (alle zehn behoben), §5 erneut grün, keine
weitere Lesung.

Offen / Entscheid:

- **Zahlen der KI prüft niemand mehr.** Die Zeile «Prüfen:» hiess «Nennt die KI einen Begriff oder
  eine Zahl, schlagen Sie die Angabe im Heft nach (Glossar, S. 8).» — ein Glossar führt keine
  Zahlen. Neu: «Prüfen: Nennt die KI einen Begriff, schlagen Sie ihn in Ihren Heften nach
  (Glossar, S. 8). Steht er dort nicht, übernehmen Sie ihn nicht.»; Schritt, Kriterium und
  Liesmich sagen dasselbe. Die Prompts bestellen keine Zahlen; nennt die KI in einem Einwand
  trotzdem eine, fängt sie nichts auf. Ein Satz «Zahlen rechnen Sie selbst nach» kostet auf
  Seite 1 des Plus-Auftrags eine Zeile.
- «Schuldenrisiko» (Karte 3, `mock_transfer` Plus, `so_uebst_du`): Wort von Heft B; die Rubrik
  sagt «Verschuldungsrisiko», das Glossar «Schuldenspirale».
- `mock_transfer.prompt_fortgeschritten` «Erfinde einen neuen Fall mit Zahlen: Wunsch, knappes
  Budget, Druck von Kollegen.» und der Übungsfall «drei Zahlen zum Wohnen»: Die Bausteine sind
  auch die Szene des KN-Falls; die Fallwörter selbst kommen nirgends vor.
- `kn_typ_tracks[fachgespraech]`: «Sie erklären mündlich» — der Prompt läuft getippt im Chat.
- Die drei Plus-Karten des Lernbegleiters haben 2'652 Zeichen (Richtwert 2'600; gemessen 53 px
  Reserve).
- `check-all` in anderen Dateien: 12× `ERR_ZEIGER_SCHRITT_OHNE_SEITE`, `WARN_KOH_ANZAHL`, je
  einmal `ERR_BELEGE_FEHLT`, `ERR_FAKTEN_FEHLT`, `ERR_FALL_FEHLT`.

## 4. Was an der Skill zu ändern war (Befund nach Pilot und Sonden; umgesetzt in §4b)

Je Muster: Regel (wo sie steht) · Beispiel · Vorschlag. «3/3» = Pilot und beide Sonden.

**M1 — Basis-Auftrag: Prompt 1 → Prompt 2 → Prüfen trägt nicht (3/3).**
Regel: `basis-plus.md` §3 Zeile `prompt_strategie` und `assets/ki-template.json` Z. 39 geben
wörtlich «Prompt 2, wenn die KI geantwortet hat» vor; `schritte` «genau 3: ohne KI · mit KI ·
prüfen und entscheiden»; Check P5 verlangt ein Kriterium «Nachschlagen».
Beispiel: Prompt 1 lässt die KI nur fragen («Stell immer nur eine Frage und warte») — sie
«antwortet» nie, und kein Schritt sagt, wann Schluss ist. Prompt 2 steht in keinem Schritt.
Prompt 2 lautet in Pilot und 2.1.1 «Nenne mir jetzt eine Folge meines Entscheids …» — die KI
liefert Inhalt, den die Lernenden beurteilen müssen (gegen Grundsatz 4). Das Kriterium
«Nachgeschlagen» hat im Basis-Auftrag nichts zum Nachschlagen.
Vorschlag: «Prompt 2, nach drei Fragen: «…»»; Prompt 2 lässt die KI die schwächste Stelle
**als Frage** nennen statt etwas zu liefern; Schritt 2 nennt beide Prompts; das
Verifikations-Kriterium der Basis heisst «Jede Angabe der KI geprüft — oder die KI hat nur
gefragt».

**M2 — KN-Brücke setzt eine KN-Form voraus (Pilot, Konflikt).**
Regel: `SKILL.md` Z. 220 und `ki-architecture.md` Z. 44 geben als Beispiel «Im Fachgespräch
müssen Sie …».
Beispiel: `ki_1.reflexion[1]` «Im Fachgespräch des Kompetenznachweises begründen Sie …» — steht
im Basis-Auftrag, den alle bekommen; die Einheit hat drei KN-Formen.
Vorschlag: Beispiel der Skill auf «Im Kompetenznachweis …» ändern; eine Form nur nennen, wenn
`kn.kn_typen` genau eine hat.

**M3 — Prompts geben der KI die Bedeutungen der Einheit nicht mit (3/3).**
Regel: `basis-plus.md` §1 Nr. 3 (Andocken) verlangt Begriffe und Kriterien der Einheit, aber
nirgends, dass die KI deren Bedeutung kennt; die 45-Wörter-Grenze drückt den Kontext weg.
Beispiel: «Frag mich diese Begriffe ab: … Sag mir die Lösung erst nach meiner Antwort.» — die KI
definiert «Rückstellung», «Fakten-Check», «3B-Schema» anders als das Heft, die Lernenden
entscheiden darunter in «Das stimmt · Das stimmt nicht». «Was fehlt beim Kriterium «Position /
Werthaltung»?» — die KI erfindet, was das Kriterium verlangt.
Vorschlag: (a) Abfrage- und Erklär-Prompts tragen einen Halbsatz Kontext («Ich bin im
1. Lehrjahr, Thema: …») und die `warnung` der Karte sagt: «Vergleichen Sie die Lösung der KI mit
Ihrem Glossar»; (b) ein Prompt, der ein Kriterium nennt, gibt dessen Kurzbeschrieb aus
`kn.rubrik_shared` mit; (c) `repetitionsplan`: die KI macht nur Fragen, die Antworten kommen
aus dem Glossar. Dafür braucht es etwas mehr Wörter als 45 — oder die Sprachzeile zählt nicht mit.

**M4 — «Meine Übungsfälle waren andere als mein Kompetenznachweis» ist nicht abhakbar (3/3).**
Regel: `lernbegleiter-architecture.md` Z. 37 und `assets/lernbegleiter-template.json` Z. 54
schreiben den Satz vor.
Vorschlag: «Ich habe an neuen Fällen geübt, nicht an den Fällen aus meinen Heften.» und
«Ich habe die KI nie nach dem Kompetenznachweis gefragt.»

**M5 — «[mein Prinzip]» ohne Stütze (Pilot, 2.1.1).**
Beispiel: `kn_typ_tracks[2].prompt` «Ich sage dir das Prinzip, das ich in dieser Einheit gelernt
habe: [mein Prinzip].» — der Satz steht nur in `ki.json › bezug`; im Pilot stösst das Wort mit
dem Kriterium «Wirtschaftliches Prinzip» zusammen.
Vorschlag: Der Lernbegleiter nennt den Leitsatz einmal (z. B. im `uebungsfokus` dieses Tracks),
oder die Lücke heisst «[was ich gelernt habe, in einem Satz]».

**M6 — Feste Texte der Basis erklären ihre Wörter nicht (3/3).**
Regel: `basis-plus.md` §4 `prompt_vorlage` (fest).
Beispiel: «Ein guter Prompt nennt vier Dinge: Rolle, Kontext, Aufgabe, Format.» — «Format» ist
in der Basis nirgends erklärt. «KI» und «Prompt» sind nicht in jedem Dokument erklärt, obwohl
der Liesmich «der Basis-Auftrag allein» erlaubt (2.1.1 hat es von sich aus getan).
Vorschlag: Vorlage mit je zwei Wörtern Erklärung; Regel «KI und Prompt beim ersten Vorkommen je
Dokument erklären».

**M7 — Liesmich-Template widerspricht den Daten (3/3).**
Regel: `assets/ki-liesmich-template.md` Z. 65 «Dort beurteilen die Lernenden die KI selbst und
bauen eigene Prompts»; Z. 110 Spalte «Wann» («nach Heft A und B») gegen `input-adapter.md` §2c
(`ki.timing` «nach dem gemeinsamen Auftrag»); §2 «in beiden KI-Aufträgen als Kriterium».
Vorschlag: «bauen eigene Prompts» streichen (das tut nur der Lernprompt-Baukasten); eine Quelle
für den Zeitpunkt; dazu ein Satz, dass der Beispiel-Verlauf einen absichtlichen Fehler enthält,
und je ein Hinweis auf Begriffe-Liste und Notizfelder.

**M8 — `nrlp_anker.thema_text` «T1 — …» steht im Word-Blatt, nicht in der Vorschau (Pilot, Konflikt).**
Der Word-Builder druckt das Feld unter «Kompetenzen — Das üben Sie», `DocKi.tsx` nicht.
Vorschlag: Template ohne «T1 —» (roher Code), und Renderer und Word angleichen. Der zweite Teil
ist Renderer, nicht Skill.

**M9 — Sprachzeile gegen B4 (beide Erzeuger).**
Regel: Muster in `basis-plus.md` §1 Nr. 2 «Stell immer nur eine Frage und warte auf meine
Antwort.» hat zwei Du-Imperative; `b1-language-rules.md` §2 zählt den Du-Imperativ wie einen
Auftrag; das Skript zählt nur «…en Sie».
Folge: Konflikt hat die Zeile unverändert, 2.1.1 hat sie geteilt («Stell immer nur eine Frage.
Warte dann auf meine Antwort.») — die Einheiten laufen auseinander.
Vorschlag: eine Form festlegen (geteilt), oder die Sprachzeile ausdrücklich von B4 ausnehmen.

**M10 — Technik-Titel: Bibliothek «unveränderlich» gegen Pilot (beide Erzeuger).**
Regel: `lernprompt-techniken.md` Z. 7. Konflikt druckt «Rollen-Prompting», «Gegenposition
fordern», «Quellen und Belege anfordern»; Pilot und 2.1.1 «Der KI eine Rolle geben», «Gegenseite
verlangen», «Quellen verlangen». «Rollen-Prompting» ist das einzige Wort der KI-Fachsprache in
einem Basis-Titel.
Vorschlag: eine Titelliste für Lernende in der Bibliothek, für alle Einheiten gleich.

**M11 — Auswahl ist nicht eindeutig (beide Erzeuger).**
`ki-scoring.md` Z. 35 «+25 wenn … Entscheidungs-Leitfragen … dominant» — in beiden Sonden
kippt die Basis an diesem Urteil (Konflikt 35 gegen 15/40, 2.1.1 40 gegen 35).
`lernprompt-techniken.md` Z. 31 regelt den Gleichstand nur für `chain_of_thought` vor
`format_vorgeben`; in 2.1.1 standen vier Techniken gleich.
Vorschlag: «dominant» zählbar machen; vollständige Rangfolge bei Gleichstand.

**M12 — 3er-Set: `begriffe` und Sperrwörter aus der Quelle (Konflikt).**
`prinzip.quellen_anker.konzepte` kann mehr als 20 Einträge haben und Sperrwörter enthalten;
`kompetenzversprechen` wird wörtlich gedruckt und trägt «adressatengerecht».
Vorschlag: Auswahlregel bei mehr als 20 (welche fallen weg); Ausnahme oder Umschreibung für
das Kompetenzversprechen entscheiden.

**M13 — v4.2: Kernwort mit `spur` im Glossar (2.1.1, bisher eine Einheit).**
«Absender» steht in Prinzip-Satz, Situation von Heft B, KN-Kriterien und gemeinsamem Auftrag,
im Glossar aber nur mit `spur: "mit_medien"` → `ERR_V42_SPUR`. Entweder ist der Glossareintrag
falsch markiert (Einheit) oder das Skript braucht die Ausnahme «steht im Kern». Entscheid offen.

**M14 — Skill-Texte sind seit diesem Lauf überholt.**
`SKILL.md` und `basis-plus.md` §8 nennen `1.1.1_konflikt_kommunizieren` als Gold-Referenz in
voller Dichte (1.x) und zählen zehn Bestands-Toolboxen; die Einheit trägt jetzt 2.0.0.

**M15 — Feldgrenzen garantieren die Seite nicht.**
2.1.1 hielt jede Grenze aus `basis-plus.md` §4 ein und lief auf Seite 1 des Lernprompts um
6.5 px über; behoben erst nach rund 380 Zeichen Kürzung. Fast alle Seiten messen 0 px Reserve.
Der Erzeuger kann nicht messen (fester Port) — mit einer Kürzungsrunde je Einheit ist zu rechnen.

## 4b. Was an der Skill geändert wurde (07.10.2026, auf Entscheid Pietro)

Die Skill-Dateien waren schon vor dem Lauf uneingecheckt geändert, zwei davon
(`basis-plus.md`, `b1-language-rules.md`) sind nicht im Git — `git diff` zeigt diese
Änderungen darum nicht getrennt. Die Liste hier ist vollständig. Skripte, Renderer
und Einheiten sind nicht angefasst; `check-ki-toolbox.mjs` läuft unverändert, alle
neuen Regeln passen in seine Grenzen (45 Wörter je Basis-Prompt, genau 3 Schritte,
genau 3 Prompt-Zeilen).

| Muster | Datei › Stelle | Vorher → Nachher |
|---|---|---|
| M1 | `basis-plus.md` §3 (neu: Tabelle «Aufbau des Basis-Auftrags»), `ki-template.json`, `ki-architecture.md` §2 + §5 | «Prompt 2, wenn die KI geantwortet hat» → Prompt 1 stellt **drei** Fragen · Vorspann «Prompt 2, nach der dritten Frage:» · Prompt 2 zeigt auf die schwächste Antwort und liefert keinen Inhalt · Schritt 2 nennt Prompt 1, Schritt 3 nennt Prompt 2 · «Prüfen:» bedingt und mit Ort · Kriterium «Nachgeschlagen» auch erfüllbar, wenn die KI nur gefragt hat. Dazu: ein Gegenstand, ein Wort; «jede» / «mindestens eine» nie gemischt; kein Prompt liefert, was ein Kriterium den Lernenden zuschreibt. Neuer Check **BP9** |
| M2 | `SKILL.md` Phase 2 + Checks, `ki-architecture.md` §3, `basis-plus.md` §3, `ki-template.json` | Beispiel «Im Fachgespräch müssen Sie …» → «Im Kompetenznachweis …», **ohne Form**; eine Form nur, wenn `kn.kn_typen` genau eine hat; die Brücke greift auf, was der Auftrag geübt hat |
| M3 | `basis-plus.md` §1 (neuer Grundsatz 5 «Die KI kennt die Einheit nicht») + §5 (Tabelle je Karte), `lernbegleiter-architecture.md`, `lernprompt-techniken.md`, `lernbegleiter-template.json` | neu: Thema im Prompt, wo die KI abfragt, beurteilt oder einen Fall erfindet · `warnung` von «Abfragen lassen» / «Selbst erklären» sagt, womit verglichen wird («… gilt das Glossar») · Kriterium nie nur als Name (höchstens zwei, je mit dem, was es verlangt) · die KI liefert keinen Stoff (Lernkarten nur mit Fragen; Plus-Beispiele arbeiten an einer Liste der Lernenden) · jeder Übungsfall-Prompt sagt, was der Fall nicht sein soll. Neuer Check **BP8** |
| M4 | `lernbegleiter-architecture.md`, `lernbegleiter-template.json`, `basis-plus.md` §5 | «Übungsfälle anders als mein KN» → «Ich habe an neuen Fällen geübt, nicht an den Fällen aus meinen Heften.»; `mock_transfer.warnung` → «Verlangen Sie von der KI nie eine Lösung für Ihren Kompetenznachweis. Üben Sie an neuen Fällen.» |
| M5 | `basis-plus.md` §5, `lernbegleiter-architecture.md`, `lernbegleiter-template.json`, `b1-language-rules.md` §3 | «[mein Prinzip]» → «[was ich gelernt habe]» (zuerst «[mein wichtigster Satz]», im zweiten Durchgang angeglichen); das Wort «Prinzip» steht im Lernbegleiter nicht für den Leitsatz |
| M6 | `basis-plus.md` §3–§5, `lernprompt-techniken.md`, `lernprompt-template.json`, `b1-language-rules.md` §3 | `prompt_vorlage` «… Rolle, Kontext, Aufgabe, Format.» → «… Rolle, Kontext, Aufgabe, **Form der Antwort**.»; «KI» und «Prompt» werden in **jedem** der vier Blätter erklärt (`ki_1.auftrag`, `ki_2.auftrag`, `thema_kontext`, `lernbegleiter.ziel`) |
| M7 | `ki-liesmich-template.md`, `ki-liesmich-architecture.md` (neuer Check **LM4**), `input-adapter.md` §2c | «… und bauen eigene Prompts» gestrichen (das tut nur der Baukasten des Lernprompts) · Platzhalter `{{WANN_BASIS}}` / `{{WANN_PLUS}}`: je **ein** Wortlaut für §1 und §4 · Menge beim Nachschlagen wörtlich wie in den Kriterien · neuer Hinweis «Der Fehler im Beispiel ist Absicht» samt Notizfeldern · Titel der Einheit wie `set.einheit_titel` |
| M8 | `basis-plus.md` §3, `ki-architecture.md` §2, `ki-template.json` | `thema_text` ohne Code («T1 —»). Der Unterschied Vorschau/Word im Renderer bleibt (nicht Skill) |
| M9 | `basis-plus.md` §1 Nr. 2, `b1-language-rules.md` §2 | Muster «Stell immer nur eine Frage und warte auf meine Antwort.» → **feste** Sprachzeile, ein Auftrag je Satz: «Antworte in kurzen, einfachen Sätzen. Stell immer nur eine Frage. Warte auf meine Antwort.» (bzw. «Stell mir drei Fragen, eine nach der anderen.») |
| M10 | `lernprompt-techniken.md` (Bibliothek), `basis-plus.md` §4, `lernprompt-template.json` | feste Titel für Lernende: «Der KI eine Rolle geben» · «Kontext geben» · «Schritt für Schritt denken» · «Form der Antwort vorgeben» · «Gegenseite verlangen» · «Quellen verlangen» (vorher u. a. «Rollen-Prompting», «Gegenposition fordern», «Quellen und Belege anfordern») |
| M11 | `ki-scoring.md`, `lernprompt-techniken.md` | «dominant» wird gezählt: mindestens die Hälfte aller Leitfragen ist eine Entscheidungsfrage (Zähler in der Rückmeldung); der Entscheidungscoach braucht einen Entscheid, den die Einheit so nennt. Gleichstand der Plus-Techniken: feste Reihenfolge `gegenposition_fordern`, `quellen_anfordern`, `chain_of_thought`, `format_vorgeben` |
| M12 | `basis-plus.md` §5, `b1-language-rules.md` §6 | 3er-Set mit mehr als 20 Konzepten oder Sperrwort: Reihenfolge des Weglassens festgelegt; Sperrwort im wörtlichen `kompetenzversprechen` bleibt und wird gemeldet |
| M14 | `SKILL.md` (Beschreibung, Output-Vertrag, References), `basis-plus.md` §7 + §8, `ki-scoring.md` | «Gold-Referenz 1.1.1_konflikt» → für die Form gelten `assets/*.json`; **kein Wortlaut aus einer anderen Toolbox**, auch nicht aus dem Pilot |
| M15 | `basis-plus.md` §4, `SKILL.md` Phase 3 | neu: Richtwerte für Seite 1 des Lernprompts unter den harten Grenzen; Beispiel-Verlauf mit Zahlen wie im Heft, höchstens zwei Angaben, beide geprüft |

Nicht umgesetzt: **M13** («Absender» in 2.1.1) — das ist Glossar der Einheit oder
Skript, nicht Skill.

### Zweiter Durchgang der Sonden mit der neuen Skill — was dabei noch dazukam

Beide Sonden wurden mit der geänderten Skill von frischen Erzeugern neu geschrieben
und von frischen Gegenlesern gelesen. **Die Muster M1–M8 kamen in keiner der zwei
Lesungen mehr vor.** Die Urteile lauteten wieder «zurück», die Befunde lagen aber
eine Ebene tiefer und waren überwiegend einheitsspezifisch. Was davon allgemein
ist, steht jetzt ebenfalls in der Skill (`basis-plus.md` §3–§5, `b1-language-rules.md`
§3, `ki-liesmich-architecture.md` LM4, `ki-liesmich-template.md`, `ki-template.json`):

| Neu | Regel |
|---|---|
| N1 Seiten | Richtwerte **unter** den harten Grenzen für die drei engen Seiten: Lernprompt S. 1 · Lernbegleiter S. 1 (`begriffe` zusammen ≤ 200 Zeichen) · Basis-Auftrag S. 2 (es zählen Zeilen: zwei Kriterien je ≤ 85 Zeichen, Nachschlagen ≤ 110). v4.2 ist enger als das 3er-Set. Anlass: drei Überläufe (13.8 px, 28.3 px, 6.5 px) bei eingehaltenen Grenzen |
| N2 Lücke | Die Lücke nennt einen kleinen, benannten Teil («[meine wichtigste Aussage]»), nicht «[mein Produkt]» — niemand tippt 300 Wörter ab |
| N3 Datenschutz | «Schreiben Sie keine Namen in den Prompt.» steht auf jedem Blatt, auf dem eigener Text eingegeben wird (zweiter Satz von `ki_frei_vorher`) |
| N4 Ausweg | «Prüfen:» darf zwei kurze Sätze haben: wo nachschlagen, und der Ausweg, wenn die Angabe dort nicht steht (Wortlaut später berichtigt, siehe H1) |
| N5 Kriterium/Schritt | Kein Kriterium verlangt, was kein Schritt verlangt |
| N6 KN-Brücke | verspricht nur, was **jede** KN-Form verlangt (aus dem Kompetenzversprechen) |
| N7 Ein Name | Ein Produkt und ein Begriff heissen in allen drei Dateien gleich; passt die Glossar-Definition nicht zum Gebrauch («Einwand»), wählt der Auftrag ein anderes Wort |
| N8 3er-Set | Nicht alle haben alle drei Herausforderungen bearbeitet: `bezug` neutral, Basis-Prompts docken an einem beliebigen Produkt an, kein Prompt setzt eine Wahl der Lernenden fest |
| N9 Abfragen | nur Begriffe, die dort stehen, wohin die Warnung zeigt (3er-Set: im Kapitel nachsehen — «Register» steht in `prinzip.json`, aber in keinem Kapitel) |
| N10 Lernprompt | Kein Basis-Prompt ohne Andockpunkt (die KI erfindet keine «Aussage»); eine `erklaerung` widerspricht der Einheit nicht |
| N11 Begriffe 3er-Set | Weglass-Reihenfolge: Sperrwort · Ausschreibungen · in keiner Leitfrage/keinem Handlungsprodukt · erst dann von hinten |
| N12 Liesmich | Notizfelder mit echtem Wortlaut; KN-Formen mit dem Namen auf dem Blatt der Lernenden daneben |
| N13 Sprachzeile | andere Zahl als zwei/drei Fragen; was die KI im Plus behaupten darf; Wortlaut des Selbstchecks je Format («Heften» / «Herausforderungen») |

### Hauptlauf (zwölf Einheiten) — was dabei noch in die Skill kam

Jede Regel hier stammt aus einem Befund eines Gegenlesers oder einer Meldung eines
Erzeugers, der in **zwei oder mehr** Einheiten auftrat oder ein Beispiel der Skill selbst
betraf. Alle stehen in `basis-plus.md` (§1, §3, §5), soweit nicht anders vermerkt.

| Neu | Regel | Anlass |
|---|---|---|
| H1 Ausweg berichtigt | «Steht sie dort nicht, **übernehmen Sie sie nicht**» — nie «gilt sie nicht» (ein Artikel, der im Kapitel fehlt, gilt trotzdem). Die Zeile nennt die **Art** der Angabe (Recht, Regel, Zahl, Begriff) | Beispiel der Skill aus N4 war rechtlich falsch (Konflikt, 2.1.1) |
| H2 Skala | `ki_frei_zuerst.auftrag` nennt die Skala «von 1 (unsicher) bis 5 (sicher)» — der Renderer druckt fünf Kästchen ohne Legende | acht Einheiten |
| H3 «ohne KI» | KN-Brücke und `integritaet_warnung` sagen «ohne KI» / «allein» nur, wenn `kn.json` es für **jede** Form sagt. Bei einer Werkschau: «Die KI stellt Fragen und zeigt Lücken. Was auf Ihrem Blatt steht, schreiben Sie selbst.» Liesmich: Platzhalter `{{KN_LEITPLANKE}}` | erfassen_zeigen, meinungsfreiheit, einstieg, ausgrenzung |
| H4 Karten | `feynman`-Lücke «[Begriff und Erklärung]» · `uebungs_feedback` «im selben Chat» · `mock_transfer` bestellt zum Fall eine Aufgabe · `repetitionsplan`: Warnung stimmt für beide Prompts, Gruppen decken jeden Begriff · `so_uebst_du`: Verb vorn, sagt, was die Kriterien verlangen, nennt nur Basis-Karten | lernzeit, 1.2.2, klima, haltung, konsum_3j |
| H5 `ai_redaktion` | Klausel zu «die KI liefert keinen Stoff»: Die KI darf einen kurzen Entwurf schreiben, wenn die eigene Antwort der Lernenden vorher ohne KI dasteht und der Entwurf nur geprüft, nie abgegeben wird (§1 Nr. 5) | rechte_verstehen |
| H6 Die Einheit lehrt das Wort | Ein Sperrwort, das Prüfstoff ist («Halluzination»), steht in `begriffe` und sonst nirgends; `prompt_vorlage` darf die Formel der Einheit tragen (`b1-language-rules.md` §4) | 1.2.2 |
| H7 Ohne Lehrmittel | Ausweg beim Nachschlagen: «fragen Sie die Lehrperson» | 1.2.2 |
| H8 Seite 3 Lernbegleiter | Richtwert: die drei Plus-Karten zusammen ≤ 2'600 Zeichen | Überläufe 6.6 px und 21.5 px |
| H9 Liesmich | Die Stellen des Namen-Satzes werden genannt, nicht «auf jedem Blatt» · «sitzen die Lernenden allein da» gestrichen | lernzeit, ausgrenzung |
| H10 Zwei Prompts | Prompt 2 braucht den Chat von Prompt 1 — das Blatt sagt es · wer einen Einwand wählen soll, bekommt Nummern («Nummeriere sie.» / «Einwand Nummer [Nummer]») | anliegen, haltung, konsum_3j |
| H11 Lücke | Die Lücke nennt, was auf dem Blatt der Lernenden wirklich so steht (kein «Position mit Begründung», wenn die Karte Position und Argument trennt; «der erste Satz im Abschnitt Urteil») | anliegen, haltung |
| H12 Zwei Hefte | v4.2: «Ihre Hefte (Glossar, S. 8)»; ein Glossar führt keine Zahlen — die Zeile nennt den Ort der Zahlen oder den Weg | haltung, konsum_3j |
| H13 Gegenstand | Fragt die KI zu einem Satz, erfährt sie, worüber er geht; Glossarwörter in der Bedeutung der Einheit | haltung |
| H14 `kn_typ_tracks` | Der Prompt bestellt, was der `uebungsfokus` verspricht; die Ausschlussliste ist in allen Tracks dieselbe · `mock_transfer` Plus: Der Gegenstand kommt in keiner Datei der Einheit vor (auch nicht als Transferbeispiel) | anliegen («Buslinie»), haltung («Abschlussfeier»), meinungsfreiheit, konsum_3j |

H10–H14 sind erst nach den Einheiten `2.3.1`–`3.1.1` dazugekommen; die drei
zurückgehaltenen Einheiten wären die ersten, die damit erzeugt werden.

**Drei Setzungen, die Pietro bestätigen oder ändern sollte** (sie gehen über das
reine Flicken hinaus):

1. **Zeitpunkt.** `ki.timing` sagt für beide Aufträge «nach dem gemeinsamen Auftrag /
   nach Austausch & Transfer». Die Liesmich-Vorlage setzte die Aufträge «mitten in der
   Einheit». Gesetzt ist jetzt: `ki.timing` = spätester Zeitpunkt (nicht gedruckt);
   Liesmich: Basis-Auftrag «sobald die Hefte / Herausforderungen fertig sind»,
   Plus-Auftrag wie `ki.timing`.
2. **Technik-Titel.** Die Titel des Pilots sind zur festen Liste geworden;
   `format_vorgeben` heisst neu «Form der Antwort vorgeben».
3. **Scoring.** Mit der Zählregel fällt die Basis häufiger auf `ai_lernassistent`.

## 5. Sichtbarkeit — Entscheid Pietro

Kein `set.json` wurde angefasst, kein Index gebaut. In keiner der Einheiten steht heute
`entwurf_komponenten: ["ki-fluency"]`. **Mit dem nächsten `npm run build:einheiten-index`
und Deploy ist die Toolbox dieser publizierten Einheiten für alle Lehrpersonen sichtbar** —
ausser `set.json` bekommt vorher `"entwurf_komponenten": ["ki-fluency"]`:

| Einheit | Lage |
|---|---|
| `1.1.1_konflikt_kommunizieren` | `set.json` ohne `status` → live. **Ersetzt** eine bereits sichtbare Toolbox 1.0.0 |
| `1.1.1_rechte_verstehen_nutzen` | `set.json` ohne `status` → live. **Ersetzt** eine bereits sichtbare Toolbox 1.0.0 |
| `1.2.2_ki_kompetenznachweis_vorbereiten` | publiziert. **Ersetzt** eine bereits sichtbare Toolbox 1.x |
| `1.1.1_ausbildung_kommunizieren` | publiziert, Toolbox neu |
| `1.2.1_lernzeit_planen` | publiziert, Toolbox neu |
| `2.1.1_informationen_hinterfragen` | publiziert, Toolbox neu |
| `2.2.1_ausgrenzung_analysieren` | publiziert, Toolbox neu |
| `2.2.1_meinungsfreiheit_reflektieren` | publiziert, Toolbox neu |
| `2.3.1_anliegen_vertreten` | publiziert, Toolbox neu |
| `2.4.1_haltung_zeigen` | publiziert, Toolbox neu |
| `2.5.1_klimaveraenderung_diskutieren` | publiziert, Toolbox neu |
| `3.1.1_konsum_verantworten_3j` | publiziert, Toolbox neu |
| `1.3.1_konsum_verantworten_v42` (Pilot) | publiziert, Toolbox neu (nicht von diesem Lauf); Gegenleser **«zurück»**, nichts behoben (§3.1) |

Nicht betroffen (ganze Einheit `status: "entwurf"`, nur KT1): `1.1.1_ausbildung_erfassen_zeigen`,
`1.1.1_einstieg_interview`.

Bei den drei Einheiten, die eine alte Toolbox ersetzen, gibt es kein «vorher unsichtbar»: Dort
wechselt mit dem nächsten Deploy die dichte Fassung 1.x zur Basis/Plus-Fassung 2.0.0.

## 5b. Befunde ausserhalb der Toolbox — Entscheid Pietro

Nichts davon hat dieser Lauf angefasst (§7 des Auftrags).

1. **KN-Fall steht in einer publizierten Musterlösung.**
   `1.1.1_rechte_verstehen_nutzen › herausforderung_C.json › handlungsprodukt.musterloesung`
   enthält den Fall des Kompetenznachweises wörtlich («ob dein Berufsbildner CHF 150 von deinem
   Lohn abziehen darf, weil ein fertiges Werkstück einen Kratzer hat», Betreff «Lohnabzug für den
   Kratzer») und passt nicht zu Heft C selbst (dort CHF 200, Familien-Chat). In derselben Einheit:
   Kap. 20.7 enthält weder «Datenschutz» noch «Zweckbindung», die Leitfragen A3 / C3 verweisen
   aber darauf; Kap. 1.4 sagt «fahrlässig oder absichtlich», die Lösungsfelder «Verschulden».
2. **Das Prüfskript sperrt Wörter, die Einheiten lehren.** `check-ki-toolbox.mjs` ist nicht
   geändert; die Toolboxen umschreiben oder brauchen die Ausnahme der Skill:
   - «Absender» (`2.1.1`): im Glossar nur mit `spur: "mit_medien"`, aber Kernwort in Prinzip-Satz,
     Heft B, KN-Kriterien → `ERR_V42_SPUR`. Glossar oder Skript.
   - «Halluzination» (`1.2.2`): Prüfstoff, als Teilwort `halluzin` in allen Feldern gesperrt —
     steht jetzt nur in `begriffe`.
   - «Stufe» (`2.2.1_ausgrenzung`): Heft A nennt die Kettenglieder so; v4.2-Sperrwort.
   - «Ich-Form» (`2.3.1`): KN-Kriterium verlangt sie; Glossarbegriff nur in der Spur ohne Medien.
   - Falschtreffer: Der Mehrfachauftrag-Zähler liest Relativsätze («…, den Sie erwarten», «oder
     wogegen Sie») als zweiten Auftrag; «… bis 5. Üben Sie …» wird nicht als Satzende gelesen.
3. **Renderer / Word.** `DocLernprompt.tsx` druckt die Spalten des Baukastens fest als «Rolle ·
   Kontext · Aufgabe · Format» (die Skill sagt jetzt «Form der Antwort»; `1.2.2` hat eine eigene
   Formel). `docx-builder.ts` druckt `nrlp_anker.thema_text` (die Vorschau nicht) und überschreibt
   den Ohne-KI-Schritt mit «Eigene Position festhalten». Die Selbsteinschätzung im Lernbegleiter
   druckt fünf Kästchen ohne Legende (die Toolboxen schreiben die Skala darum in den Auftrag).
4. **`check-all` meldet in anderen Dateien der v4.2-Einheiten** (je Einheit in §3 aufgeführt):
   durchgehend `ERR_ZEIGER_SCHRITT_OHNE_SEITE` (5–12 je Einheit), dazu `WARN_KOH_WOCHE_MINUTE`,
   `WARN_KOH_ANZAHL` / `ERR_KOH_ANZAHL`, `WARN_KOH_KURZBESCHRIEB`; in `2.4.1` und `2.5.1` je
   `herausforderung_A.json` `ERR_KOH_LOESUNG_SICHTBAR` (Lösungsbild teilt acht Wörter mit dem
   Beispielbild); in `1.2.1` `begleiter.md` `ERR_KOH_STUFE_PUNKTE`. `check-all` endet für alle
   trotzdem GRUEN; in den vier Toolbox-Dateien gibt es keinen Treffer.
5. **Kleines.** `CLAUDE.md` nennt `1.1.1_konflikt_kommunizieren` als Beispiel für
   `entwurf_komponenten: ["ki-fluency"]` — `set.json` hat das Feld nicht. Das Frontmatter
   `kompetenz` der Liesmich-Dateien trägt den Text des Lebensbezugs, nicht der Kompetenz (so in
   der Vorlage, wie `begleiter.md`). In `set.glossar` von `2.2.1_ausgrenzung` und `2.4.1` steht
   «Wirkung» doppelt.

## 6. Zwischenfälle

- **Fremder Commit.** Während des Laufs hat eine andere Sitzung `f79e31b` gesetzt («Präsentation
  v4.2: je Spur ein Knopf …», E43, acht Dateien). Nicht von diesem Lauf; der Vergleichsstand für
  «ausserhalb nichts Neues» wurde danach neu gezogen.
- **Nutzungslimit** (rund 14:15–18:40): vier Agenten brachen ab; alle wurden an ihrem Stand
  wieder aufgenommen, keine halbe Datei blieb liegen.
- **Geteiltes Scratchpad.** Erzeuger überschrieben sich Hilfsskripte; einer startete versehentlich
  ein fremdes Skript für `2.1.1`. Es brach ohne Schreiben ab (Zeitstempel und Prüfung der
  `2.1.1`-Dateien bestätigt). Seither arbeitet jeder Agent in einem eigenen Unterordner.
- **Kein sauberer Diff der Skill.** Die Skill war vor dem Lauf schon uneingecheckt geändert, zwei
  Dateien sind nicht im Git. Was dieser Lauf geändert hat, steht darum nur in §4b.

## 7. Schlusspass und `git status --short`

**Schlusspass (07.10.2026, nach der letzten Änderung).** Für alle 15 Ordner (Pilot + 14) ist §5
noch einmal ganz gelaufen: je genau vier Toolbox-Dateien, `check-ki-toolbox` GRUEN mit 0
Warnungen, Export 2 · 3 · 3 · 3 Seiten, `messen-v42` ohne Überlauf, bei v4.2 `check-all` GRUEN
ohne Treffer in den Toolbox-Dateien, ausserhalb der Einheiten nichts Neues. Die drei
zurückgehaltenen Ordner sind unberührt (`3.2.1_wahre_kosten` trägt weiter seine Toolbox 1.0.0).
Kein Index-Bau, kein Commit, kein Push; `set.json`, Renderer, Skripte und alle anderen Dateien
der Einheiten sind nicht angefasst.

**Von diesem Lauf**

```
 M src/data/einheiten/1.1.1_ausbildung_erfassen_zeigen/{ki.json,lernprompt.json,lernbegleiter.json,ki-liesmich.md}
 M src/data/einheiten/1.1.1_konflikt_kommunizieren/{…}
 M src/data/einheiten/1.1.1_rechte_verstehen_nutzen/{…}
 M src/data/einheiten/1.2.2_ki_kompetenznachweis_vorbereiten/{…}
?? src/data/einheiten/1.1.1_ausbildung_kommunizieren/{ki.json,lernprompt.json,lernbegleiter.json,ki-liesmich.md}
?? src/data/einheiten/1.1.1_einstieg_interview/{…}
?? src/data/einheiten/1.2.1_lernzeit_planen/{…}
?? src/data/einheiten/2.1.1_informationen_hinterfragen/{…}
?? src/data/einheiten/2.2.1_ausgrenzung_analysieren/{…}
?? src/data/einheiten/2.2.1_meinungsfreiheit_reflektieren/{…}
?? src/data/einheiten/2.3.1_anliegen_vertreten/{…}
?? src/data/einheiten/2.4.1_haltung_zeigen/{…}
?? src/data/einheiten/2.5.1_klimaveraenderung_diskutieren/{…}
?? src/data/einheiten/3.1.1_konsum_verantworten_3j/{…}
?? docs/cloud-run/laeufe/2026-10-07-ki-toolbox-lehrjahr-1/
```

Je Ordner genau vier Dateien (56 insgesamt). Dazu, auf Entscheid Pietro, Änderungen **in** den
Skill-Dateien unten (§4b) — sie waren schon vor dem Lauf geändert bzw. nicht im Git, `git status`
zeigt sie darum unter «war schon da».

**War schon da** (acht weitere Dateien vom Start sind mit `f79e31b` von einer anderen Sitzung
eingecheckt worden)

```
 M .claude/skills/hko-ki-komplement/SKILL.md                                  ← in diesem Lauf weiter geändert
 M .claude/skills/hko-ki-komplement/assets/ki-liesmich-template.md            ← dito
 M .claude/skills/hko-ki-komplement/assets/ki-template.json                   ← dito
 M .claude/skills/hko-ki-komplement/assets/lernbegleiter-template.json        ← dito
 M .claude/skills/hko-ki-komplement/assets/lernprompt-template.json           ← dito
 M .claude/skills/hko-ki-komplement/references/input-adapter.md               ← dito
 M .claude/skills/hko-ki-komplement/references/ki-architecture.md             ← dito
 M .claude/skills/hko-ki-komplement/references/ki-liesmich-architecture.md    ← dito
 M .claude/skills/hko-ki-komplement/references/ki-scoring.md                  ← dito
 M .claude/skills/hko-ki-komplement/references/language-rules.md
 M .claude/skills/hko-ki-komplement/references/lernbegleiter-architecture.md  ← dito
 M .claude/skills/hko-ki-komplement/references/lernprompt-techniken.md        ← dito
 M docs/upgrade-v4.2/ENTSCHEIDE.md
 M public/nrlp/einheiten.index.json
 M src/components/einheiten/EinheitWorkbench.tsx
 M src/components/einheiten/docs/DocKi.tsx
 M src/components/einheiten/docs/DocLernbegleiter.tsx
 M src/components/einheiten/docs/DocLernprompt.tsx
 M src/components/einheiten/docs/chrome.tsx
 M src/data/einheiten.index.json
 M src/lib/einheiten/docx-builder.ts
 M src/lib/einheiten/types.ts
?? .claude/skills/hko-ki-komplement/references/b1-language-rules.md           ← in diesem Lauf weiter geändert
?? .claude/skills/hko-ki-komplement/references/basis-plus.md                  ← dito
?? docs/cloud-run/prompts/ki-toolbox-lehrjahr-1.md
?? scripts/check-ki-toolbox.mjs
?? scripts/export-ki-toolbox.mjs
?? src/data/einheiten/1.3.1_konsum_verantworten_v42/{ki.json,lernprompt.json,lernbegleiter.json,ki-liesmich.md}
?? src/data/quellen/q-531b-vertiefung-1.json
?? src/lib/einheiten/ki-toolbox.ts
```

## 8. In drei Sätzen

**Fertig** sind 14 der 17 Toolboxen (2.0.0, alle Skript-Prüfungen grün, Seiten 2 · 3 · 3 · 3 ohne
Überlauf, Gegenleser am Schluss überall «in Ordnung»), dazu die Prüfung des Pilots und die
angepasste Skill. **Nicht fertig** sind die drei zurückgehaltenen Einheiten
(`3.2.1_konsumfolgen_beurteilen`, `3.2.1_wahre_kosten`, `3.3.1_kaufvertrag_beurteilen`), der Pilot
(Gegenleser «zurück», nur gemeldet) und die kleinen Reststellen je Einheit in §3. **Zu entscheiden**
hat Pietro: (1) die Sichtbarkeit der zwölf publizierten Einheiten vor dem nächsten Index-Bau
(§5), (2) den KN-Fall in der Musterlösung von `1.1.1_rechte_verstehen_nutzen` und die gesperrten
Kernwörter im Prüfskript (§5b), (3) die drei Setzungen der Skill (§4b: Zeitpunkt, Technik-Titel,
Scoring) — und wann die letzten drei Einheiten und eine Überarbeitung des Pilots laufen.

## 9. Nachtrag — Entscheide Pietro nach dem Bericht (07.10.2026, E44)

1. **Sichtbarkeit:** kein `entwurf_komponenten`; Index gebaut, Stand committet und deployt.
2. **KN-Fall in der Musterlösung von `1.1.1_rechte_verstehen_nutzen`:** bleibt — die Einheiten
   dieses Formats werden später neu erzeugt.
3. **Sperrwörter:** Ausnahme nur für die Einheit über KI. `check-ki-toolbox.mjs` lässt
   «Halluzination» in `1.2.2_ki_kompetenznachweis_vorbereiten` zu (`SPERRWORT_AUSNAHMEN`);
   `b1-language-rules.md` §4 nennt den Entscheid. «Absender», «Stufe», «Ich-Form» bleiben
   gesperrt. Die Toolbox von `1.2.2` ist dafür nicht umgeschrieben worden (das Wort steht
   weiter nur in `begriffe`).
4. **Die letzten drei Einheiten:** Prompt `docs/cloud-run/prompts/ki-toolbox-lehrjahr-1-rest.md`.

Nach dem Bericht geändert: `scripts/check-ki-toolbox.mjs` (Ausnahme), `b1-language-rules.md` §4,
`src/data/einheiten.index.json` und `public/nrlp/einheiten.index.json` (Index-Bau),
`docs/upgrade-v4.2/ENTSCHEIDE.md` (E44), `CLAUDE.md` (drei überholte Sätze zur Toolbox).
Lokaler Produktions-Build (`npm run build`) läuft durch.
