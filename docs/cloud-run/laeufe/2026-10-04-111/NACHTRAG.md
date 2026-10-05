# Nachtrag — 1.1.1_ausbildung_kommunizieren · 05.10.2026

Abschlussdurchgang nach `BERICHT.md` (Lauf 2026-10-04). Geändert wurden nur
`src/data/einheiten/1.1.1_ausbildung_kommunizieren/` (`herausforderung_A.json`,
`herausforderung_B.json`, `set.json`, `begleiter.md`) und die acht Quellenkarten
`src/data/quellen/q-111{a,b}-*.json`. Kein Commit, kein Index-Build, `status` bleibt `entwurf`.
Kein Lehrmittel- oder Quellentext in diesem Dokument.

**Tor nach der letzten Änderung:** `check-all.mjs 1.1.1_ausbildung_kommunizieren` → «GRUEN — keine
Fehler.» · `begleiter-marker --check` → 274 Marker, 0 abweichend · `export-v42` + `messen-v42` →
Exit 0, 56 Seiten ok, kein Überlauf (Reserven wie im Lauf; Auftragsbogen S. 1 neu 19.5 px statt
36.6 px). `bestand-v42` und `npm run build` nicht gelaufen (gehören dem Orchestrator).

---

## 1. Befunde aus dem Bericht

| # | Befund | Stand | Was |
|---|---|---|---|
| 1 | Heft A, LF4: «Novemberwoche tauschen» unterbestimmt | **behoben, Rest braucht Entscheid** | Beide Spuren: «… auf der Herbstferienwoche bestehen und etwas anbieten oder verzichten und eine andere Woche aushandeln?» Beide Wege nennen jetzt ihren Preis; die Frage ist gleich lang gebaut. `beispiel_pol_2` neu («Ich verzichte … Der Preis: Die Reise findet ohne mich statt» statt der Annahme, die Reise lasse sich verschieben). Quer-Check-Lösung und Begleiter (S. 4, Erwartungshorizont) nachgezogen. **Bleibt:** Alle drei Lesenden finden «verzichten» mit dem Material leichter zu belegen als «bestehen» — siehe §5, Entscheid 1. |
| 2 | Offene Fallfrage: gilt eine nur erwähnte Woche als abgemacht? | **geklärt, als Hintergrund im Begleiter** | Begleiter, Hinweis zum Fall von Heft A: Das OR verlangt für das Festlegen der Ferien keine Form; eine mündliche Zusage würde genügen, ist aber schwer zu beweisen; ein Nicken ist keine klare Zusage. Dazu die Auskunft des SECO (früh festlegen, in der Regel drei Monate; Festgelegtes kurzfristig nur im Notfall verschieben). Im Heft und in den Lösungen bleibt es die offene Frage des Falls. In die Lösung zu LF2 passt der Hintergrund nicht (Prüfung `ERR_VORAUSSETZUNG_VOR_START`, Längengrenze 900 Zeichen). |
| 3 | Heft B S. 3 ohne Medien: Kap. 20.8 prüft Informationsseiten | **entschärft, Grundproblem bleibt (Bauplan)** | LF3 sagt es jetzt selbst und verlangt die Übertragung ausdrücklich: «Kap. 20.8 meint Seiten, die informieren. Übertragen Sie …». Der Befund bleibt eine Übertragung; ohne Adresse der Seite sind Endung und Impressum nicht prüfbar (Leser Runde 2). |
| 4 | Heft B S. 3 mit Medien: Quelle verbietet «ein Konto für alle» nicht | **behoben (Sachfehler in der Lösung)** | Die Lösung nannte «ein Passwort für alle» als Verstoss gegen Abs. 5; dort heisst «eigenes Passwort» aber: je Dienst ein anderes. Neu: zwei Verstösse = der Klassenname ist kein Passwort nach Abs. 5 und steht im Klassenchat; das gemeinsame Konto ist ausdrücklich Fallüberlegung (Zeile «Befund», Befundtext, beide LF4-Beispiele, `gut_wenn`, Notiz und Hinweis im Lösungsbild, Begleiter S. 3). |
| 5 | Heft B S. 5: Schritte sagen nicht, wo festgehalten wird | **behoben** | Schritte 01, 02, 04: «Vorarbeit auf S. 2 (LF1) …», «… S. 2 (LF2) …», «… S. 4 (LF4) …»; Abgabe «Zwei Antworten … auf S. 7». Offen (Leser Runde 2): Schritt 03 nennt S. 3 nicht; wie «markiert» wird, steht nur im Begleiter. |
| 6 | Heft B S. 6: «Geändert: …» liest sich als neuer Satz | **behoben** | «Satz 2 neu: «Tragt euch ein oder ruft mich an, dann gebe ich ihn euch.»» — zwei Lesende verstehen es jetzt. S. 6 hält (0 px Reserve, gemessen). Dass die E-Mail des Beispiels nicht geändert wird, ist richtig (verlangt ist eine Stelle); steht jetzt im Begleiter. |
| 7 | Auftrag: Fall ohne Rechtsgrundlage; Stufe 2 verlangt «mit Fundstelle», der Erwartungshorizont sagte «nicht verlangt» | **geändert — bitte bestätigen (§5, Entscheid 2)** | Schritt 04: «… Darunter zu einer Regel: Kapitel und Seite im Lehrmittel als Beleg.» Indikator «Rechtliches Prinzip»: «Unter dem Merkblatt: zu mindestens einer Regel Kapitel und Seite im Lehrmittel.» Erwartungshorizont und Begleiter (Sachgrundlage) nachgezogen; Begleiter nennt den rechtlichen Kern (Datenschutzgesetz Art. 5 Bst. a, Art. 6 Abs. 3) als Hintergrund. |
| 8 | Auftrag: kein Feld für den Einwand | **behoben** | Station 3 heisst «Warum das allen hilft – Einwand und Antwort». Der Leser findet den Ort. |
| 9 | Auftrag, Schritt 02 verwies auf Heft B S. 7 für die Ordnung der Kanäle | **behoben** (neu gefunden) | Verweis nur noch S. 2. |
| 10 | Höchste Punktzahl verlangt, was kein Schritt anleitet | **stehen gelassen (Skill/KN-Wortlaut)** | Heft A, Schritt 04 verlangt neu beim Vorschlag «was bringt er beiden?» (trägt «Folgen für beide Seiten»). «Auf eine neue Lage übertragen» bleibt in beiden Heften und im Auftrag ohne Schritt; der Begleiter sagt es der Lehrperson (Kap. zu den Kriterien). Betrifft jede Einheit — siehe §6. |
| 11 | Fedlex-Fassung Stand 2026-01-01 | **behoben** | Geltende Fassung ist vom 01.10.2026; Art. 329a, 329c, 345a wortgleich. Karte `q-111a-vertiefung-2`: `datum` 2026-10-01, Lizenzhinweis; Heft S. 4 und Begleiter zeigen 01.10.2026. Nächste Fassung ist auf 01.07.2027 angekündigt. |
| 12 | Karten `q-111a-pflicht`, `q-111b-pflicht` ohne Datum | **stehen gelassen, geprüft** | Beide Seiten tragen weder im Text noch in den Metadaten ein Datum; «o. D.» bleibt. Text der Ausschnitte am 05.10.2026 wortgleich mit dem Archiv. |
| 13 | Ersatzartikel Freiburg trägt «Schultag im November» nicht | **stehen gelassen, Lösung geschärft** | Kein Quellentausch. Lösung LF3 (Zeile «Mit Ersatzquelle») und Begleiter sagen jetzt, was stattdessen trägt: Abs. 8 (Ferien gehören in die Unterrichtsferien — stützt den Wunsch eher stärker) und Abs. 10 (Bestätigtes ändert keine Seite allein). |
| 14 | «Ablage der Schule mit eigenem Login» ist Annahme | **stehen gelassen** | Ist im Hinweis des Lösungsbilds und in beiden LF4-Beispielen als Annahme gekennzeichnet. Ob die BBW eine solche Ablage für Lernende hat, ist nicht geprüft. |
| 15 | Einsatzplan mit Kundennamen als Geschäftsgeheimnis nicht belegt | **stehen gelassen, Hintergrund ergänzt** | Bleibt im Heft Deutung. Begleiter neu: Auch OR Art. 321a Abs. 4 zählt nicht auf, was dazugehört; sicher ist, dass Kundennamen Personendaten sind (Datenschutzgesetz Art. 5 Bst. a). |
| 16 | Karte `lm-16-4-fragearten` («Warum …?») | **nur gemeldet** (§6) | Im Heft überschreibt `tun` bereits mit «Wie …?» statt «Warum …?» (Kap. 1.4, S. 36). |

Weitere Korrekturen aus dem Lösungs-Audit: Quer-Check-Lösung Heft A schrieb das Soll «schulfreie Zeit»
auch der Quelle zu (steht nur im Lehrmittel) — getrennt; «Erholung» kommt nicht aus dem Raster,
sondern von S. 34 — berichtigt. Heft A, Schritt 05 und Karte 4: Die Partnerperson liest S. 1, und
die Rückmeldung gibt das Gegenüber (vorher las es sich, als gebe man sie sich selbst).

## 2. Geprüfte Fakten (Abruf 05.10.2026)

| Aussage | Quelle | Ergebnis |
|---|---|---|
| Ferien: vier Wochen, bis 20 fünf; zwei Wochen zusammenhängend; Arbeitgeber bestimmt, nimmt Rücksicht; fünf Wochen je Lehrjahr; Freigabe für die Schule ohne Lohnabzug | OR Art. 329a, 329c, 345a — Fedlex, konsolidierte Fassung 01.10.2026 (`eli/cc/27/317_321_377/20261001`) | stimmt; wortgleich mit Fassung 01.01.2026 |
| Keine Formvorschrift für das Festlegen der Ferien | OR Art. 329c (kein Formerfordernis), Art. 11 Abs. 1 — Fedlex, gleiche Fassung | stimmt; «mündliche Zusage genügt» ist die Folgerung daraus, kein Wortlaut |
| Ferien früh festlegen (in der Regel drei Monate); Festgelegtes kurzfristig nur im Notfall verschieben | SECO, FAQ zum privaten Arbeitsrecht, «Ferien» (seco.admin.ch) | so auf der Seite; Auskunft der Behörde, nicht Gesetz. Zu Schadenersatz und Form sagt die Seite nichts |
| Treuepflicht, Geheimhaltung | OR Art. 321a Abs. 4 — Fedlex | nennt «Fabrikations- und Geschäftsgeheimnisse», keine Aufzählung |
| Kundennamen, Adressen, Telefonnummern sind Personendaten; Zweckbindung | DSG Art. 5 Bst. a, Art. 6 Abs. 3 — Fedlex, Fassung 07.07.2025 (jüngste in Kraft) | stimmt |
| KN: keine zusätzlichen Kosten für den überbetrieblichen Kurs | BBV Art. 21 Abs. 3 — Fedlex, Fassung 01.10.2026 | stimmt (der Lehrbetrieb trägt die Kosten); der KN stützt sich weiter auf Kap. 1.4, S. 34 |
| «Ferien in der schulfreien Zeit» | steht im Lehrmittel (S. 33) und in der Ersatzquelle, nicht im OR | die Lösung zu Vertiefung 2 sagt das richtig |

**Links und Absatzzählung (alle acht Karten):** alle Adressen erreichbar (HTTP 200). Jeder Absatz
der Ausschnitte wurde maschinell gegen den Archivtext vom 03.10.2026 verglichen: wortgleich bei
allen acht (Lexikon und OR über die Rohdaten geprüft, weil die Seiten den Text im Browser laden).
Die Absatznummern des Lexikons entsprechen den Absätzen der Seite (Abs. 1–3 = bis «Arbeitszeit»).
Daten: SRF 30.07.2026 und 21.10.2025 sowie S-U-P-E-R.ch 07.03.2025 stehen so in den Metadaten der
Seiten (S-U-P-E-R.ch: zuletzt geändert 25.03.2026, Ausschnitt unverändert). `sachlage_geprueft`
aller acht Karten: 2026-10-05.

## 3. Gegenleser (Sonnet; Profil b entfällt)

**Runde 1** — Lernende a an A ohne, A mit, B ohne, B mit; Bogen-Leser; Lösungs-Audit A und B
(je beide Fassungen). Sweep per Skript: kein «ß», kein Platzhalter. Der Lauf wurde einmal durch ein
Nutzungslimit unterbrochen; die abgebrochenen Gegenleser wurden neu gestartet, die Befunde der
früheren (A ohne, B mit, Bogen) vor dem Neustart eingearbeitet. Jeder Befund am Text nachgeprüft.

Übernommen: A — Partnerperson liest S. 1, Rückmeldung kommt vom Gegenüber, Schritt 04 sagt, was
aus LF4 und was von S. 6 kommt; LF4 symmetrisch gefasst; drei Korrekturen in Lösungen. B — «Satz 2
neu», Ort der Antworten, vier Präzisierungen der Lösung zu Abs. 5. Bogen — Verweis S. 7 entfernt,
«Fundstelle aus Ihrem Heft» → «Kapitel und Seite im Lehrmittel als Beleg».
Nicht übernommen (so gewollt oder Bauplan): Abgaben ≠ Checkliste; Raster verlangt vier Regeln,
obwohl nur zwei den Fall treffen; Beispielbild A ohne Plan (Entscheid 3 des Laufs); Audit B:
Treuepflicht in LF4-Beispielen ohne Vorbehalt (LF2 und Denkhilfe tragen ihn), Signatur in der
Lösungs-E-Mail, kleine Verdichtungen. Weggefallen: «Fedlex-Datum vertauscht» (das Archiv ausserhalb
des Repos trägt noch den alten Stand; die Karte stimmt).

**Runde 2** (zuletzt gelesen, danach nichts geändert) — Lernende a an Heft A mit Medien S. 4–6,
Heft B ohne Medien S. 3, 5, 6, Auftragsbogen. Die geänderten Stellen werden verstanden; LF4 verrät
keine Möglichkeit. **Offen nach Runde 2:**

1. **Heft A, LF4:** «bestehen» bleibt dünner belegt als «verzichten»; das Mindestziel von «bestehen»
   fällt mit «verzichten» fast zusammen (§5, Entscheid 1).
2. **Heft A, LF4 mit Medien:** «Kap. 1.4, S. 33 sagt, wann …; die Quelle, wie weit Rücksicht
   reicht» — auch S. 33 nennt die Rücksicht; neu an der Quelle ist nur die Grenze «Schulbesuch».
   Wortlaut aus dem Lauf, in Runde 2 gefunden, nicht mehr geändert.
3. **Heft A, S. 5:** Schritt 01 fragt nach der angestrebten Art zu reagieren, bevor Schritt 04
   entscheidet; Einwand und Antwort haben auf S. 7 keinen Ort (sie sind Teil des Gesprächs).
4. **Heft A, S. 6:** Karte `lm-19-1-feedback` zeigt Beispiele zu einem Text, nicht zu einem Gespräch
   (bekannt, geteilte Karte); «Rückmeldung in einem Satz» gegen den Merksatz der Karte (zwei Stellen).
5. **Heft B ohne Medien, S. 3:** «drei weitere Aussagen» gegen Checkliste «Raster mit vier Zeilen»
   (die Beispielzeile zählt mit, gesagt wird es nicht); Befund ohne Adresse der Seite nur Vermutung;
   «Beleg» in drei Bedeutungen.
6. **Heft B, S. 5:** kein Kandidat für den «anderen Weg» im Material (die Lösung nimmt die Ablage
   der Schule an); wer die Antworten ins Heft schreibt und wie «markiert» wird, steht nicht da.
7. **Auftrag:** «Notizblatt» ist eigenes Papier (nicht gesagt); der Beleg verlangt Kapitel und
   Seite, das Kriterium die angewandte Regel; `heft_bezug` nennt S. 7 beider Hefte, kein Schritt
   braucht sie; «zu einer Regel» (S. 1) gegen «zu mindestens einer» (S. 4).
8. **Alle:** Stufe 3 mehrerer Kriterien ohne Schritt (wie Befund 10).

**Zeit (Schätzung, je Heft, Seitenplan 135 Min.):** 97–130 Min.; Auftragsbogen rund 110 Min.
**Nicht von Gegenlesern geprüft:** Seitenbild, QR-Seite am Handy.

## 4. Gegenhör-Liste

Entfällt: Die Einheit hat kein Audio und kein Video. Alle acht Quellen sind Texte und am Text
geprüft (§2). Zum **Gegenlesen am Papier** vor dem Druck: Heft B S. 6 (0 px Reserve, neue Zeile
«Satz 2 neu»), Auftragsbogen S. 1 und 3 (neuer Schritt 04, längere Station 3).

## 5. Entscheide für Pietro

**Entscheid 1 — Heft A, LF4: Soll «bestehen» im Material der Lernenden besser gestützt werden?**
- *Variante A (jetzt):* Material bleibt (Lehrmittel S. 33, Quelle). Die Lehrperson hat den
  Hintergrund im Begleiter (keine Formvorschrift, SECO: früh festlegen). «Bestehen» ist begründbar
  über das Soll «schulfreie Zeit» und den Schultag, aber schwächer als «verzichten».
- *Variante B:* Die SECO-Auskunft zu den Ferien wird Vertiefung 2 anstelle des OR-Textes (oder
  Ersatzquelle anstelle der Freiburger Seite, die mit Abs. 10 dasselbe trägt). Dann finden die
  Lernenden selbst, dass ein später Plan und eine bestätigte Woche Gewicht haben. Das ist ein
  Quellentausch mit neuer Karte, Archivtext und Lösung.
- *Empfehlung:* A für die Freigabe; B beim nächsten Durchgang, falls im Unterricht alle
  «verzichten» wählen.

**Entscheid 2 — Auftrag: Fundstelle unter dem Merkblatt (von mir geändert).**
- *Variante A (jetzt):* Schritt 04 verlangt unter dem Merkblatt zu einer Regel Kapitel und Seite;
  der Indikator und der Erwartungshorizont sagen dasselbe. Damit ist Stufe 2 («mit Fundstelle»)
  erreichbar.
- *Variante B (vorher):* keine Fundstelle auf dem Bogen; dann widerspricht der Erwartungshorizont
  dem gedruckten Stufentext. Rückbau: drei Stellen in `set.json` (Schritt 04, Indikator,
  `gut_wenn[1]`) und ein Absatz im Begleiter («Sachgrundlage»).
- *Empfehlung:* A.

**Entscheid 3 — offen aus dem Lauf, unverändert:** `methoden[0].beispiel` in Heft B (§6 Nr. 1 des
Berichts).

## 6. Vorschläge für geteilte Dateien (nicht geändert)

| Datei | Alt | Neu | Beleg |
|---|---|---|---|
| `src/data/methoden/lm-16-4-fragearten.json` · `merk` (oder neues Feld `fehler`) | «Eine geschlossene Frage bringt ein Ja. Eine offene bringt eine Geschichte.» | «Eine geschlossene Frage bringt ein Ja. Eine offene bringt eine Geschichte – im Konflikt besser mit «Wie …?» als mit «Warum …?».» | Kap. 16.4, S. 373 führt eine «Warum»-Frage als Beispiel einer offenen Frage; Kap. 1.4, S. 36 rät im Konfliktgespräch zu «wie» statt «warum». Die Karte selbst nennt kein «Warum»; der Widerspruch liegt zwischen den zwei Kapiteln |
| `src/data/methoden/lm-17-2-w-fragen.json` · `seiten` | «S. 381–392» | die eine Seite, auf der die W-Fragen stehen (im Kapitel nachsehen) | Bericht §9 Nr. 6; Leser Runde 2 fand die Seiten nicht |
| `src/data/methoden/lm-19-1-feedback.json` · `beispiel` | drei Sätze zu einem Text («Eure Einleitung …») | mindestens ein Beispiel zu einem Gespräch oder Sujet-neutral | zwei Lesende: passt nicht zur Rückmeldung nach einem Gespräch |
| Skill, `references/phase-6` / Bauplan-Vorlage | — | Jede Stufe 3 eines Kriteriums braucht einen Schritt oder ein Feld, der dazu anleitet («neue Lage», «Grenze der Regel», «Folgen für beide») | sechs Lesende in zwei Läufen |
| Renderer, Checkliste S. 8 / Rastertext | «Raster mit vier Zeilen» | Hinweis, dass die Beispielzeile mitzählt (Spur ohne Medien) | Leser Runde 2 |
| `D:\OS\_lab\quellen-archiv\bbw-hko\q-111a-vertiefung-2\gewaehlt\quelle.md` (ausserhalb des Repos) | «Fassung mit Stand 2026-01-01» | «Stand 2026-10-01, Text unverändert» | Fedlex, 05.10.2026 |

## 7. Nicht geprüft

- Seitenbild am Papier und QR-Seite am Handy (Cookie-Hinweise); der Text der QR-Seite `/m/…`
  selbst (die Gegenleser bekamen den Archivausschnitt).
- Ob die Schule eine Ablage mit persönlichem Login für Lernende anbietet (Annahme im Lösungsbild).
- Die SECO-Auskunft über eine Textabfrage der Seite gelesen, nicht am Rohtext verglichen;
  Rechtsprechung oder Lehre zur Verschiebung von Ferien nicht nachgeschlagen.
- Inhalt der Methodenkarten gegen die Kapitel (nur Kap. 16.4, S. 373 angesehen); Glossar-Definitionen
  nicht neu gegen das Lehrmittel geprüft.
- `bestand-v42 --pruefen`, `npm run build`, Index-Build.
- Profil b (Deutsch als Zweitsprache): auftragsgemäss nicht gelesen.
