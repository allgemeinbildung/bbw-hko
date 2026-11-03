# Gegenlesung — `1.2.1_regeln_schule_betrieb` (Argon)

- **Gegenleser:** `gemini-4-argon` (Rolle: EBA-Lehrperson & kritische Fachlektorin)
- **Einheit:** `src/data/einheiten/1.2.1_regeln_schule_betrieb/` (`EBA_2J`, 1. Lehrjahr, Sprachniveau A2, Kompetenz 1.2.1)
- **Geprüft gegen:**
  - Disziplinarreglement Berufsbildung Kanton Zürich vom 5. März 2015 (LS 413.322, `D:\OS\Clippings\Disziplinarreglement.pdf`)
  - Leitbild BBW (`D:\OS\Clippings\A010101L1_Leitbild_BBW_20260903.pdf`)
  - Schulinterne BBW-Praxis (4 Wochen Frist für Unterschrift/Abgabe von Absenzen) sowie OR Art. 321a / 321d
  - EBA-Profil (`eba-profil.md`), A2-Sprachregeln (`a2-language-rules.md`), Gold-Einheit `1.1.1_lehrvertrag_orientieren_v42`
  - Gedruckter HTML-Export (`node scripts/export-v42.mjs 1.2.1_regeln_schule_betrieb --out %TEMP%\argon-1.2.1`)

---

## Befunde nach Schweregrad

### Kategorie A — Muss vor dem Unterricht behoben werden (Sachfehler, unlösbare Aufträge, harte A2-Verstösse)

#### A-01 · Toter Verweis auf nicht existierende Tabelle auf Seite 1 (Aufgabe unlösbar)
- **Dokument + Seite/Feld:** `herausforderung_B.json` › `spuren.ohne_medien.leitfragen[0].text` (Heft B, S. 3, Leitfrage 2; ebenso `loesungen-b-ohne-medien.html`, S. 2)
- **Was steht:** «Füllen Sie das Raster aus. Welche Regeln gelten im Betrieb? Ordnen Sie zwei Pflichten aus der Tabelle auf Seite 1 zu.»
- **Was falsch ist:** Auf Seite 1 von Heft B gibt es keine Tabelle (`zahlen_tabelle: []`); Lernende suchen auf Seite 1 vergeblich nach einer Tabelle mit Pflichten.
- **Beleg:** `herausforderung_B.json` › `zahlen_tabelle` ist `[]`; im Drucktext `heft-b-ohne-medien.html` (S. 1) existiert nur der Situationstext und der Dossier-Kasten. (Relikt aus der Gold-Einheit `1.1.1`, wo auf S. 1 eine Vertrags-Tabelle stand.)
- **Vorschlag:** Den zweiten Satz ändern in: «Ordnen Sie zwei weitere Situationen und Pflichten aus Info-Karte B-01 und B-02 zu.»

#### A-02 · KN Kurzgespräch und Mini Case verlangen Wissen zum überbetrieblichen Kurs (üK), das im Dossier komplett fehlt
- **Dokument + Seite/Feld:** `kn.json` › `kn_typen[0].fragestruktur[0].frage`, `kn_typen[0].fragestruktur[1].frage`, `kn_typen[0].fragestruktur[2].frage` sowie `kn_typen[1].aufgaben[0..2]` (`kn-s_fachgespraech.html` S. 2, `kn-s_mini_case_schriftlich.html` S. 2–3) und `dossier.json` › `nuggets`
- **Was steht:** F1: «Wer hat in der Kurswerkstatt welche Zuständigkeit?»; F2: «Welche Regel wurde im Fall verletzt? Wo schauen Sie nach, was gilt?»; F3: «Darf die Kursleitung sofort dem Lehrbetrieb melden, ohne Sie anzuhören? Begründen Sie.» (Analog Mini Case A1–A3).
- **Was falsch ist:** Im gesamten Dossier (`nugget_A_01` bis `nugget_B_03`) und in beiden Heften kommen weder der überbetriebliche Kurs (üK) noch die Kursleitung oder deren rechtliche Stellung/Meldewege vor. Nach § 1 Disziplinarreglement gilt das kantonale Disziplinarreglement (§ 15 rechtliches Gehör, § 14 Zuständigkeiten) für Berufsfachschulen und Lehrwerkstätten, nicht für üK-Zentren der Berufsverbände. Lernende können mit Dossier und Heften nicht nachschlagen, wer im üK zuständig ist oder ob die Kursleitung dem Lehrbetrieb einen Vorfall melden darf.
- **Beleg:** `Disziplinarreglement.pdf` § 1 («Dieses Reglement gilt für Lernende an: a. einer kantonalen oder vom Kanton beauftragten Berufsfach- oder Berufsmaturitätsschule, b. einer kantonalen Vollzeitschule oder Lehrwerkstätte...»); `eba-dossier.md` («Jeder KN-Anspruch wird geübt und hat Wissensdeckung; sonst ergänzen oder ändern»).
- **Vorschlag:** In Info-Karte B-01 oder B-02 einen Satz zum üK ergänzen (z. B. dass im üK die Haus- und Sicherheitsregeln des Kurszentrums sowie die Sorgfaltspflicht gelten und man bei Fehlern wie im Betrieb zuerst das klärende Gespräch mit der Kursleitung sucht) und F3/A3 auf den Sinn eines vorgängigen Klärungsgesprächs statt auf ein formelles Meldeverbot ausrichten.

#### A-03 · Sachlich falscher Prüfungsanspruch im Erwartungshorizont des gemeinsamen Auftrags (4-Wochen-Frist statt 14-Tage-Vorabfrist)
- **Dokument + Seite/Feld:** `set.json` › `gemeinsamer_auftrag.erwartungshorizont.gut_wenn[1]`
- **Was steht:** «Die Regel aus der BBW-Praxis ist genannt (Entschuldigung innert 4 Wochen unterschrieben vorlegen).»
- **Was falsch ist:** Im Fall des gemeinsamen Auftrags geht es um ein **vorhersehbares** Urlaubsgesuch für geschäftliche Inanspruchnahme am nächsten Dienstag (§ 4 Abs. 1 lit. f, § 5, § 8 Abs. 1 lit. a: mindestens 14 Tage im Voraus bei der Schulleitung einzureichen). Die 4-Wochen-Frist der BBW gilt für das nachträgliche Unterschreibenlassen einer Absenz bei der Lehrperson und steht zudem auf S. 1–2 des Auftragsbogens gar nicht im Text (sie stammt per Copy-Paste aus `1.1.1`).
- **Beleg:** `Disziplinarreglement.pdf` § 8 Abs. 1 lit. a («Das Entschuldigungsgesuch ist einzureichen bei a. vorhersehbaren Absenzen mindestens 14 Tage im Voraus») und § 5 («Die geschäftliche Inanspruchnahme gilt als Entschuldigungsgrund, wenn a. bei ausserordentlichen Ereignissen ein bedeutender Schaden abgewendet und das übrige Personal für den gleichen Zweck in Anspruch genommen wird...»).
- **Vorschlag:** Den Punkt `gut_wenn[1]` ändern auf: «Die Regel aus dem Disziplinarreglement ist genannt (geschäftliche Inanspruchnahme nur zur Abwendung bedeutenden Schadens; Gesuch mindestens 14 Tage im Voraus an die Schulleitung).»

#### A-04 · Auftragsbogen bestellt ein «Auswertungsraster», druckt aber nur ein leeres Schreibfeld ohne Spalten und lässt die Regeln im Dossier weg
- **Dokument + Seite/Feld:** `set.json` › `gemeinsamer_auftrag.schritte[1..2]`, `gemeinsamer_auftrag.produkte[0]` und `dossier.json` (`auftragsbogen.html` S. 1–2)
- **Was steht:** Schritt 02: «Prüfen Sie die Vorgaben im Dossier und in Wichtige Wörter (S. 2).» Schritt 03: «Füllen Sie das Auswertungsraster auf Seite A2 aus.» Auf Seite A2 steht jedoch unter «Schritt 03: Füllen Sie das Auswertungsraster auf Seite A2 aus» nur ein leeres lininiertes Schreibfeld (`form: "flaeche"`).
- **Was falsch ist:** Erstens steht auf Seite A2 gar kein Raster (keine Tabelle, keine Spaltenköpfe), sodass EBA-Lernende nicht wissen, welche Spalten sie ausfüllen sollen. Zweitens stehen die Regeln zur geschäftlichen Inanspruchnahme (§ 5) und zur 14-Tage-Frist (§ 8) im `dossier.json` in keiner einzigen Info-Karte (entgegen Bauplan § 10 Nr. 8/9, der behauptet, sie stünden in `B-02`), sondern nur im Glossar und im Situationstext auf A1.
- **Beleg:** `auftragsbogen.html` S. 2 (leeres `.schreibfeld` statt Raster); `dossier.json` › `nugget_B_02.inhalt` (enthält nur mündliche Ermahnung im Betrieb, nichts zu § 5 oder § 8).
- **Vorschlag:** Auf Seite A2 im `schritte[2].hint` (oder als `spur`-Stationen) klar benennen, welche Punkte auf A2 notiert werden sollen (z. B. «Notieren Sie auf Seite A2: 1. Wunsch des Betriebs, 2. Regel der Schule, 3. Warum kein Notfall vorliegt»), und in Schritt 02 auf «Seite A1 und im Glossar des Dossiers» statt auf nicht vorhandene Dossier-Vorgaben verweisen.

#### A-05 · Harte Verstösse gegen die A2-Satzlängengrenze (> 18 Wörter) und Nebensatzketten in den Situationstexten + Paragraphenflut auf A1
- **Dokument + Seite/Feld:**
  1. `herausforderung_A.json` › `situation_text` (Satz 1: **31 Wörter**, 2 Nebensätze; Satz 2: **22 Wörter**, 2 Nebensätze)
  2. `herausforderung_B.json` › `situation_text` (Satz 1: **24 Wörter**; Satz 2: **27 Wörter**, 2 Nebensätze; Satz 4 / `leitfrage`: **20 Wörter**)
  3. `set.json` › `gemeinsamer_auftrag.situation_text` (Satz 4: **26 Wörter** mit `§ 4 Abs. 1 lit. f und § 5`; Satz 5: **20 Wörter** mit `§ 8 Abs. 1 lit. a`, Passiv)
  4. `dossier.json` › `nuggets[3].beispiel` (**19 Wörter**)
  5. `kn.json` › `kn_typen[0].ablauf[0]` (**19 Wörter**)
- **Was steht:** Siehe z. B. Heft A S. 1: «Im Unterricht an der BBW hat mein Sitznachbar heimlich ein Foto mit dem Smartphone gemacht, auf dem auch die Lehrperson im Hintergrund zu sehen ist, und es in den Klassen-Chat gestellt.» (31 Wörter) sowie Auftragsbogen A1: «Laut Disziplinarreglement (§ 4 Abs. 1 lit. f und § 5) gilt eine Inanspruchnahme nur bei Notfällen zur Abwendung bedeutenden Schadens, wenn alles Personal gebraucht wird.» (26 Wörter).
- **Was falsch ist:** Gemäss `a2-language-rules.md` ist jeder Satz > 18 Wörter in SuS-gerichteten Prosa-Feldern ein harter Sperrfehler (`ERR_A2_SATZ_ZU_LANG`), und Nebensatzketten (> 1 Nebensatz) sowie juristische Detailzitate wie `(§ 4 Abs. 1 lit. f und § 5)` oder `(§ 8 Abs. 1 lit. a)` im Ich-Erzähltext eines 15-jährigen EBA-Lernenden sind sprachlich wie lebensweltlich auf Niveau A2 unzumutbar (vgl. Gold-Einheit `1.1.1`, wo alle Sätze 5–13 Wörter lang sind und keine Paragraphen im Situationstext stehen).
- **Beleg:** `.claude/skills/bbw-hko-heft-v42/references/a2-language-rules.md` § 1 Regel A1 (Schnitt ≤ 12 W.), A2 (Max. ≤ 18 W. = `ERR_A2_SATZ_ZU_LANG`), A3 (max. 1 Nebensatz).
- **Vorschlag:** Die langen Sätze in `situation_text` (Heft A, Heft B, Auftragsbogen), `leitfrage` (Heft B), `nuggets[3].beispiel` und `kn_typen[0].ablauf[0]` in kurze Hauptsätze von maximal 12–15 Wörtern teilen und die Paragraphenangaben `(§ 4 Abs. 1 lit. f und § 5)` / `(§ 8 Abs. 1 lit. a)` aus dem Ich-Situationstext des Auftragsbogens entfernen (sie gehören nur in den Begleiter bzw. die Quellenangabe im Dossier).

#### A-06 · Ungenaue und verkürzte Rechtsaussagen zum Disziplinarreglement in Info-Karte A-02, Lösung A und Glossar
- **Dokument + Seite/Feld:**
  1. `dossier.json` › `nuggets[1].inhalt` (Info-Karte A-02)
  2. `herausforderung_A.json` › `leitfragen[0].loesung.zeilen[1].text` (`loesungen-a-ohne-medien.html` S. 1)
  3. `herausforderung_A.json` › `spuren.ohne_medien.leitfragen[0].loesung.raster_zeilen[2]` (`loesungen-a-ohne-medien.html` S. 2)
  4. `dossier.json` › `glossar[15..16]` (`berufsbildner`, `ermahnung`)
- **Was steht:**
  1. Info-Karte A-02: «Schriftliche Ermahnungen, Verweise oder Bussen darf nur die Schulleitung aussprechen.»
  2. Lösung A LF1: «Bild- und Tonaufnahmen sind ohne Erlaubnis der Lehrperson verboten (§ 10 Disziplinarreglement).»
  3. Lösung A LF2 Raster Zeile 3: `["Schwere Störung", "Regeln einhalten", "Schulleitung verfügt Busse", "Schulleitung"]`.
  4. Glossar `ermahnung`: «Der Chef spricht eine mündliche Ermahnung aus.» (`weisungsrecht`: «Das Recht des Chefs...»).
- **Was falsch ist:**
  1. Nach § 14 Abs. 1 lit. b Disziplinarreglement können mündliche oder schriftliche Ermahnungen «durch die Schulleitung **oder, wenn von dieser vorgesehen, durch die Lehrperson**» ausgesprochen werden; nur schriftliche Verweise (§ 14 Abs. 1 lit. c Ziff. 1) und Bussen (§ 16) liegen nicht bei der einzelnen Lehrperson.
  2. Nach § 10 lit. e braucht es für Bild- und Tonaufnahmen die «ausdrückliche Genehmigung **der betroffenen Person**», nicht einfach die «Erlaubnis der Lehrperson» (auch Mitschüler/innen sind geschützt).
  3. Eine Busse ist nach § 14 und § 16 keine eigenständige Disziplinarmassnahme, sondern kann nach § 16 Abs. 1 nur «**bei schriftlichen Verweisen**» erhoben werden.
  4. «Chef» ist unpräzise Umgangssprache; in EBA-Unterlagen heisst die Rolle durchgängig «Berufsbildner/in» oder «Arbeitgeber/in».
- **Beleg:** `Disziplinarreglement.pdf` § 10 lit. e («ohne ausdrückliche Genehmigung der betroffenen Person»), § 14 Abs. 1 lit. b («durch die Schulleitung oder, wenn von dieser vorgesehen, durch die Lehrperson: mündliche oder schriftliche Ermahnung»), § 16 Abs. 1 («Bei schriftlichen Verweisen kann eine Busse erhoben werden»).
- **Vorschlag:** In Info-Karte A-02 präzisieren auf «Schriftliche Verweise und Bussen darf nur die Schulleitung verfügen (bei Verweisen bis Fr. 100.– Busse beim ersten Mal)», in Lösung A LF1 «ohne Erlaubnis der betroffenen Person» und in Lösung A LF2 Zeile 3 «Schulleitung verfügt Verweis» schreiben sowie im Glossar «Chef» durch «Berufsbildner/in» ersetzen.

---

### Kategorie B — Sollte behoben werden (Didaktik, Kohärenz, Lösbarkeit im Detail, Begleiter)

#### B-01 · Leitfrage 3 verlangt in beiden Heften «Wählen Sie zwei Haltungen aus», meint aber das Abwägen zweier Wege und die Wahl einer Haltung
- **Dokument + Seite/Feld:** `herausforderung_A.json` › `spuren.ohne_medien.leitfragen[1].text` (Heft A, S. 4) und `herausforderung_B.json` › `spuren.ohne_medien.leitfragen[1].text` (Heft B, S. 4)
- **Was steht:** «Wie verhalte ich mich bei einem falschen Vorwurf? Wählen Sie zwei Haltungen aus und begründen Sie Ihre Entscheidung.» (Heft A) bzw. «Wie reagiere ich auf eine laute Ermahnung? Wählen Sie zwei Haltungen aus und begründen Sie Ihre Entscheidung.» (Heft B).
- **Was falsch ist:** Im Scaffolding darunter steht «Schreiben Sie Ihre Haltung mit einer klaren Begründung» (`«Ich wähle die Haltung …, weil …»` im Singular) und auf der Methodenkarte S. 6 (`hko-eba-zwei-wege-abwaegen`) steht: «Beide Wege anschauen, dann entscheiden und begründen.» Wenn Lernende zwei Haltungen *auswählen* sollen, wissen sie nicht, ob sie beide Pole nennen und sich für einen entscheiden sollen oder ob sie zwei Dinge gleichzeitig tun sollen.
- **Beleg:** `eba-profil.md` § 2 («Leitfrage 3, Denkhilfe zuerst, dann Entscheid mit Grund»); `herausforderung_B.json` › `bewertungsraster[0].vollstaendig_wenn` (in `1.1.1`: «Leitfrage 3 nennt beide Wege» / «Leitfrage 3 nennt einen Weg mit Grund»).
- **Vorschlag:** In beiden Heften präzisieren: «Prüfen Sie zwei mögliche Haltungen. Wählen Sie Ihren Weg aus und begründen Sie Ihre Entscheidung.»

#### B-02 · Denkhilfe-Spalten auf Seite 4 passen nicht zu Leitfrage 3 und zur Methodenkarte «Zwei Wege abwägen»
- **Dokument + Seite/Feld:** `herausforderung_A.json` › `spuren.ohne_medien.kasten_s4.spalten` und `herausforderung_B.json` › `spuren.ohne_medien.kasten_s4.spalten` (Heft A und B, je S. 4)
- **Was steht:** Spalten: `["Was sofort tun?", "Was kann warten?", "Hier frage ich nach"]`.
- **Was falsch ist:** Diese drei Spalten wurden aus Heft A der Gold-Einheit `1.1.1` übernommen (wo es darum ging, welche Vertragspunkte im 1. Monat wichtig sind und welche warten können). In `1.2.1` geht es in Leitfrage 3 aber um einen Verhaltensentscheid bei einem Vorwurf bzw. einer Ermahnung; insbesondere in Heft B verweist S. 6 auf die Methodenkarte `hko-eba-zwei-wege-abwaegen` («Jeder Weg bekommt eine Spalte»), was nicht zu den Spalten «Was sofort tun? | Was kann warten? | Hier frage ich nach» passt (vgl. `1.1.1` Heft B, wo die Spalten passend hiessen: `["Selbst ansprechen: dafür", "Hilfe holen: dafür", "Mein Weg"]`).
- **Beleg:** `herausforderung_B.json` › `spuren.ohne_medien.kasten_s4.spalten` vs. `methoden[2]` (`hko-eba-zwei-wege-abwaegen`).
- **Vorschlag:** Die Spalten der Denkhilfe an den Entscheid von Leitfrage 3 anpassen, z. B. in Heft A `["Sofort widersprechen", "Sachlich klären (Gehör)", "Mein nächster Schritt"]` und in Heft B `["Schweigen / streiten", "Gespräch unter 4 Augen", "Mein Vorschlag"]`.

#### B-03 · Schritt 01 im Auftrag (S. 5) verweist auf Fakten zum Vorfall aus Leitfrage 1 (S. 2), obwohl Leitfrage 1 nur allgemeine Regeln abfragt
- **Dokument + Seite/Feld:** `herausforderung_A.json` › `handlungsprodukt.schritte[0].hint` und `herausforderung_B.json` › `handlungsprodukt.schritte[0].hint` (Heft A und B, je S. 5)
- **Was steht:** Heft A: «Notieren Sie die Tatsachen zum Vorfall aus Leitfrage 1 (S. 2), wie im Beispiel unten (S. 5).» Heft B: «Notieren Sie die Fakten zur Pause und Ermahnung aus Leitfrage 1 (S. 2), wie im Beispiel (S. 5).» (Zudem in Heft B S. 6 Methodenkarte 3: «für die Fakten in Leitfrage 1 und im Gespräch»).
- **Was falsch ist:** In beiden Heften fragt Leitfrage 1 (S. 2) ausschliesslich nach den allgemeinen Regeln aus dem Dossier («Welche Regeln gelten für elektronische Geräte und das Verhalten im Schulzimmer?» bzw. «Welche Rechte und Pflichten gelten für die Arbeitszeit und bei Ermahnungen im Betrieb?»), überhaupt nicht nach den Tatsachen/Fakten des Falls auf Seite 1!
- **Beleg:** `herausforderung_A.json` › `leitfragen[0].text` und `herausforderung_B.json` › `leitfragen[0].text`.
- **Vorschlag:** Entweder in Leitfrage 1 (S. 2) auch nach den Fakten des Vorfalls fragen oder in Schritt 01 auf S. 5 formulieren: «Notieren Sie die Tatsachen zum Vorfall von Seite 1 und die Grundregel aus Leitfrage 1 (S. 2), wie im Beispiel unten (S. 5).»

#### B-04 · Methodenkarte «Eine sachliche Nachricht aufbauen» in Heft B passt nicht zum Produkt «Gesprächsplan (Stichwortblatt)»
- **Dokument + Seite/Feld:** `herausforderung_B.json` › `methoden[3]` (Heft B, S. 6, Karte 2) vs. Bauplan § 4 Heft B
- **Was steht:** In `herausforderung_B.json` ist `hko-eba-nachricht-aufbauen` («für den Aufbau Ihres Gesprächsplans») eingebunden. Auf der Karte steht: «1 Beginnen Sie mit der Anrede... 4 Schliessen Sie mit einem Gruss. Lesen Sie die Nachricht einmal laut.»
- **Was falsch ist:** Das Produkt von Heft B ist keine schriftliche Nachricht mit Anrede und Grusszeile, sondern ein «Gesprächsplan für das Klärungsgespräch mit dem Berufsbildner (Stichwortblatt mit 4 Punkten)» nach Info-Karte B-03 (1. Einstieg, 2. Fakten, 3. Verständnis, 4. Lösung). Laut Bauplan § 4 war für Heft B stattdessen `hko-eba-klare-frage` vorgesehen.
- **Beleg:** `docs/cloud-run/bauplaene/1.2.1_regeln_schule_betrieb.md` § 4 Heft B («Methodenkarten: ... 4. `hko-eba-klare-frage`») vs. `herausforderung_B.json` › `methoden[3]`.
- **Vorschlag:** Gemäss Bauplan in Heft B `hko-eba-klare-frage` (für die Einstiegsfrage und das Nachfragen im Klärungsgespräch) statt `hko-eba-nachricht-aufbauen` verwenden.

#### B-05 · Kein «Freiwilliges Plus» (`scaffold_100`) auf Seite 7 beider Hefte und extrem knapper Begleiter im Vergleich zur Gold-Einheit
- **Dokument + Seite/Feld:** `herausforderung_A.json` › `lernfortschritt`, `herausforderung_B.json` › `lernfortschritt` (Heft A/B, S. 7) und `begleiter.md`
- **Was steht:** In `herausforderung_A.json` und `herausforderung_B.json` ist `lernfortschritt` ein Array aus 3 Schritten statt eines Objekts mit `scaffold_90` und `scaffold_100`. Auf S. 7 beider Hefte fehlt dadurch der Kasten «Freiwilliges Plus» (383 px Leerraum auf S. 7). Der `begleiter.md` umfasst nur ca. 155 Zeilen (Gold-Einheit `1.1.1`: über 400 Zeilen) und enthält weder die im EBA-Template (`assets/eba-begleiter-template.md`) geforderten Hinweise pro Heftseite (S. 1–8) noch Coaching-Moves, Tafelbilder, Selbstcheck-Tabellen oder Erwartungshorizonte zu den KN-Fragen.
- **Was falsch ist:** `eba-profil.md` § 2 verlangt für S. 7: «Prüfen: zwei Kriterien und freiwilliges Plus; keine Arbeitsfläche», und § 4 verlangt für den Begleiter die Struktur aus `assets/eba-begleiter-template.md` inklusive beider S.-1–8-Beschreibungen, Tafelbildern und Nennung der Einschränkungen bei der Erreichbarkeit der höchsten Kriterienstufe.
- **Beleg:** `eba-profil.md` § 2 und § 4; `assets/eba-begleiter-template.md`; Vergleich mit `src/data/einheiten/1.1.1_lehrvertrag_orientieren_v42/herausforderung_A.json` (`lernfortschritt.scaffold_100`) und `begleiter.md`.
- **Vorschlag:** In `herausforderung_A.json` und `herausforderung_B.json` `lernfortschritt: { scaffold_90, scaffold_100 }` ergänzen, damit auf S. 7 das freiwillige Plus erscheint, und `begleiter.md` nach `assets/eba-begleiter-template.md` um die Seitenhinweise S. 1–8, Tafelbilder und KN-Erwartungshorizonte ausbauen.

#### B-06 · Indikatoren im Auftragsbogen nennen Fachwörter, die im Fall gar nicht passen, und Kriterien passen sprachlich nicht zum Sprechmodus
- **Dokument + Seite/Feld:** `set.json` › `gemeinsamer_auftrag.feedback_kriterien[0].indikator_produkt` und `feedback_kriterien[2].indikator_produkt` (`auftragsbogen.html` S. 4)
- **Was steht:** Indikator 1: «Fachwörter wie Weisungsrecht und Disziplinarreglement passen.» Indikator 3: «Die Regeln zu Absenzen und Zuständigkeiten stimmen.»
- **Was falsch ist:** Auf Seite A1 lernen die Lernenden unter «Wichtige Wörter» extra die drei Begriffe `geschäftliche Inanspruchnahme`, `Schadensabwehr` und `Schulleitungsentscheid`, aber der Indikator auf A4 verlangt stattdessen `Weisungsrecht` und `Disziplinarreglement`. Zudem verlangt `eba-profil.md` § 3, `stufen_lernende` an den Produktmodus anzupassen (z. B. «beim Sprechen / Schreiben»), während hier derselbe generische Text steht.
- **Beleg:** `set.json` › `gemeinsamer_auftrag.woerter` vs. `feedback_kriterien[0].indikator_produkt`; `eba-profil.md` § 3 («An den Produktmodus anpassen»).
- **Vorschlag:** Den Indikator von Kriterium 1 im Auftragsbogen auf «Fachwörter wie geschäftliche Inanspruchnahme, Schadensabwehr und Schulleitung sind richtig verwendet» anpassen.

---

### Kategorie C — Kleinigkeiten (Formulierungen, Layout-Details, Redaktionelles)

#### C-01 · Sprachlicher Stolperstein auf Seite A3 des Auftragsbogens: «Gespräch üben planen»
- **Dokument + Seite/Feld:** `set.json` › `gemeinsamer_auftrag.schritte[3].label` (`04 Gespräch üben`) in Kombination mit dem Renderer auf `auftragsbogen.html` S. 3
- **Was steht:** Die Überschrift auf Seite A3 lautet: «## Gespräch üben planen».
- **Was falsch ist:** Der Renderer hängt an das Schritt-Label von Produkt 2 automatisch das Wort «planen» an (in `1.1.1` hiess das Label `05 Gespräch führen` → «Gespräch führen planen»); bei `04 Gespräch üben` entsteht das ungrammatische «Gespräch üben planen».
- **Beleg:** `auftragsbogen.txt` Seite 3, Zeile «## Gespräch üben planen».
- **Vorschlag:** `set.json` › `gemeinsamer_auftrag.schritte[3].label` in `04 Gespräch führen` ändern.

#### C-02 · Ich-Perspektive mitten im Sachtext von Info-Karte A-01 und A-03
- **Dokument + Seite/Feld:** `dossier.json` › `nuggets[0].inhalt` (Info-Karte A-01) und `nuggets[2].inhalt` (Info-Karte A-03)
- **Was steht:** Info-Karte A-03: «Lernende haben vor jeder Disziplinarmassnahme das Recht auf rechtliches Gehör (§ 15). Das heisst: Die Schule muss die betroffene Person anhören, bevor eine Massnahme beschlossen wird. Ich darf meine Sicht sachlich und ruhig erklären. Bei einer schriftlichen Klärungsnotiz nenne ich die Tatsachen. Ich sage klar, was mein Anteil war, und bitte um ein klärendes Gespräch.»
- **Was falsch ist:** Info-Karten im Dossier sind erklärende Sachtexte, die Lernende gemäss `a2-language-rules.md` und Gold-Einheit `1.1.1` mit «Sie» ansprechen (die Ich-Form gehört ins `beispiel` oder in den Situationstext). Zudem stehen in Info-Karte A-02, A-03 und B-01 Paragraphenangaben (`§ 10`, `§ 14`, `§ 15`, `OR Art. 321d`, `OR Art. 321a`) mitten im A2-Lesetext, obwohl sie bereits in `fakten_anker[].quelle` hinterlegt sind (und noch stärker in `herausforderung_B.json` › `leitfragen[0].scaffolding.strategien[0..1]` auf S. 2).
- **Beleg:** `a2-language-rules.md` («Sie in Aufträgen/Anweisungen, ICH im Narrativ»); Vergleich mit `1.1.1_lehrvertrag_orientieren_v42/dossier.json` (durchgängig «Sie» in `nuggets[].inhalt`, keine Gesetzesartikel im Fliesstext).
- **Vorschlag:** In `nuggets[2].inhalt` die Sätze 3–5 in die Sie-Form setzen («Sie dürfen Ihre Sicht sachlich und ruhig erklären...») und auf Paragraphen-/OR-Kürzel in den Scaffolding-Strategien von Heft B S. 2 verzichten.

#### C-03 · Unbelegte 4-Wochen-Frist für Absenzen in Info-Karte A-02 wirkt zusammenhangslos zum Fall von Heft A
- **Dokument + Seite/Feld:** `dossier.json` › `nuggets[1].inhalt` (Info-Karte A-02, letzter Satz)
- **Was steht:** «An der BBW haben Lernende vier Wochen Zeit, eine Absenz unterschreiben zu lassen.»
- **Was falsch ist:** Sachlich stimmt die Aussage gemäss BBW-Praxis zwar, aber in Heft A geht es überhaupt nicht um eine Absenz (sondern um ein heimliches Foto im Unterricht), und keine einzige Leitfrage in Heft A fragt nach der 4-Wochen-Frist; umgekehrt fehlt im gemeinsamen Auftrag (wo es um Absenzen geht) die Erklärung, dass die 4-Wochen-Frist für nachträgliche Entschuldigungen gilt, während für vorhersehbare Freistellungen 14 Tage im Voraus gelten (§ 8 Abs. 1 lit. a).
- **Beleg:** `dossier.json` › `nuggets[1].inhalt` vs. `herausforderung_A.json` und `set.json`.
- **Vorschlag:** Den Satz in Info-Karte A-02 um den Kontrast ergänzen: «Fehlen Sie wegen Krankheit, haben Sie an der BBW vier Wochen Zeit für die Unterschrift; bekannte Absenzen müssen Sie 14 Tage im Voraus beantragen.»

---

## Gesamturteil

**Einsetzbar: Mit Korrekturen (nach Behebung der A-Befunde).**

### Was gut ist
- **Technisches Grundgerüst und Layout:** Alle automatischen Checks (`check-v42`, `check-eba`, `check-all --vor-audit`, `check-zeiger`, `messen-v42`) laufen mit 0 Fehlern und ohne Seitenüberlauf durch; die EBA-Seitenfolge (S. 1–8) stimmt exakt.
- **Fallauswahl und Ton:** Die vier Fälle — Foto im Klassen-Chat (Heft A), Pause wegen Mithilfe überzogen (Heft B), Kundenauftrag vs. Schultag (Auftrag) und nicht gereinigtes Spezialwerkzeug im üK (KN) — sind lebensnah, klar voneinander abgegrenzt, berufsneutral und respektvoll formuliert.
- **Leitbild und Grundwerte:** Die sechs Werte des BBW-Leitbilds (Verantwortung, Respekt, Gelassenheit, Verbindlichkeit, Haltung, Vielfalt) und die Grundgedanken von OR Art. 321a / 321d sowie § 10, § 14 und § 15 Disziplinarreglement sind sinnvoll in eine klare didaktische Progression (Verstehen → Einordnen → Sachlich klären) übersetzt.

### Was nicht geprüft werden konnte
- **Optisches Druckbild im Browser/Papierdruck:** Geprüft wurden die HTML-Struktur, die Textauszüge (`seitentext.mjs`) und die Höhenmessung via `messen-v42.mjs` (Playwright); ein visueller Blick eines Menschen auf das gedruckte A4-Blatt (Schriftwirkung, Linienabstände beim Ausfüllen von Hand) bleibt vorbehalten.
- **Formelle Audits (`belege.json`, `fakten.json`, `probe.json`):** Da die Einheit noch auf `status: "entwurf"` steht, liegen die separaten Audit-JSON-Dateien noch nicht vor.
