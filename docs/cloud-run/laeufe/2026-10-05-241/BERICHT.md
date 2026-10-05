# Bericht — 2.4.1_haltung_zeigen (bbw-hko-heft-v42, Auto-Modus, lokal)

Lauf vom 2026-10-05, eine Einheit aus dem Bauplan
`docs/cloud-run/bauplaene/2.4.1_haltung_zeigen.md` (freigegeben am 2026-10-04,
gemeinsamer Auftrag in Variante J). Ergebnis: **grün**. Kein Loop, keine zweite
Session mit offenem Tor.

## 1. Einheit

| | |
|---|---|
| Ordner | `src/data/einheiten/2.4.1_haltung_zeigen/` (sechs Dateien) |
| Lehrgang | EFZ_4J, 1. Lehrjahr · kein `lehrgaenge` — den Lebensbezug 2.4 gibt es im dreijährigen Lehrplan nicht |
| Heft A | 2.4.1 · «Mein Plakat – wie deutlich zeige ich meine Haltung?» · Plakat-Entwurf mit Schlagzeile, Bildskizze und Werkkommentar · Spuren `ohne_medien`, `mit_medien` |
| Heft B | 2.4.2 · «Meine Rezension – klar urteilen und fair bleiben» · Rezension (150–200 Wörter) zu einem selbst gewählten Werk · Spuren `ohne_medien`, `mit_medien` |
| Auftrag | «Drei Entwürfe für die Wand – welchen empfehlen wir?» · Jury-Übersicht (`flaeche`) und Jury-Gespräch zu dritt (`spur`) · Lebensbereich Lehrbetrieb |
| KN | «Der Vers über den Wirt – bringen wir ihn so?» · Verein und Brauchtum im Dorf |
| Status | `"entwurf"` |
| Neue Methodenkarten | keine |
| Quellenkarten | `q-241a-*` (4), `q-241b-*` (4) — lagen aus Phase Q vor, unverändert |

Mit dieser Einheit ist das 1. Lehrjahr in EFZ 3J und EFZ 4J auf der Ebene der
Kompetenzen vollständig abgedeckt.

## 2. Tor (letzte Ausgaben, nach der letzten Änderung)

- `npm run build:einheiten-index`: 25 Sets geschrieben.
- `begleiter-marker --check`: 271 Marker · 0 abweichend · 0 unauflösbar.
- `check-all 2.4.1_haltung_zeigen`: **GRUEN — keine Fehler.** (Datei `check-all.txt`)
- `export-v42` + `messen-v42`: Exit 0, 56 Seiten ok, kein Überlauf (Datei `messung.txt`).
  Reserve 0 px auf S. 1, 6, 7 der Hefte und A2/A3 (Füllflächen); S. 8: Heft A
  16.2 px, Heft B 12.8 px; A1 19.5 px, A4 56.2 px; knappste Lösungsseite:
  Heft A mit Medien S. 3 (46 px).
- `bestand-v42 --pruefen`: **Abweichung in 2 von 26 Dokumenten, nicht aus
  diesem Lauf** — `1.3.1_konsum_verantworten`, Heft C (HTML und Word). Ursache:
  fremde, uncommittete Änderungen an den Methodenkarten `lm-16-1-diskussion`
  und `lm-16-3-gestaltung` (beide am 2026-10-05 um 00:05 geändert, vor dem
  Start der Executors), die jenes Heft einbindet. Dieser Lauf hat keine
  bestehende Karte angefasst; nichts zurückgesetzt.
- `npm run build`: Exit 0.
- `check-all 1.3.1_konsum_verantworten_v42 2.3.1_anliegen_vertreten 2.1.1_informationen_hinterfragen`: GRUEN.

Reparaturrunden am Tor: keine. `check-all` und Messung waren beim ersten
Lauf grün; die Executors haben von Anfang an selbst gemessen (S. 8 von Heft A
lief nur über, solange `set.json` fehlte — der Renderer zeichnet ohne Glossar
eine alte Mindmap).

## 3. Kapitel, Seiten, Quellen

Lehrmittel (am Kapiteltext gelesen): Kap. 7.1 S. 187–188 · Kap. 12.1
S. 292–294 · Kap. 17.2 S. 388–389 · Kap. 17.3 S. 393–394, 396 · Kap. 18.3
S. 418–419 (nur Vorurteil, Emotionen, Empathie). Nur über Methodenkarten:
Kap. 16.3, 17.3, 19.1, 20.1. Kein Kapitel der Crosswalk-Zeile handelt von
Kunst; das Lehrmittel liefert Werkzeuge, nicht den Gegenstand.

| Slot | ID | Typ | Herausgeber · Datum | Ausschnitt | geprüft |
|---|---|---|---|---|---|
| A Quelle | `q-241a-pflicht` | Video | SRF 10 vor 10 · 2023-05-09 | 00:00–03:38 | 2026-10-03 |
| A Ersatz | `q-241a-pflicht-ersatz` | Video | SRF 10 vor 10 · 2024-08-13 | 00:00–03:10 | 2026-10-03 |
| A Vertiefung 1 | `q-241a-vertiefung-1` | Artikel | GBS St.Gallen · 2026-08-17 | 1. Antwort; Abschnitt zum Hodler-Plakat | 2026-10-03 |
| A Vertiefung 2 | `q-241a-vertiefung-2` | Audio | SRF 2 Kultur · 2026-09-24 | 00:00–03:34 | 2026-10-03 |
| B Quelle | `q-241b-pflicht` | Audio | SRF 2 Kultur · 2026-09-21 | 06:19–09:59 in der Sendung | 2026-10-03 |
| B Ersatz | `q-241b-pflicht-ersatz` | Audio | SRF 2 Kultur · 2026-09-25 | 01:03–02:48 in der Sendung | 2026-10-03 |
| B Vertiefung 1 | `q-241b-vertiefung-1` | Artikel | watson · 2018-03-14 | Abs. 1–4 und Fazit | 2026-10-03 |
| B Vertiefung 2 | `q-241b-vertiefung-2` | Video | SRF Literaturclub · 2023-12-19 | 05:42–08:40 | 2026-10-03 |

Zugeständnisse wie Bauplan §7. Keine Recherche in diesem Lauf.

## 4. Abdeckung (kohaerenz.md §3)

Die Tabelle des Bauplans §8 (Variante J) ist an den fertigen Dateien
nachgeprüft.

| # | Befund an den Dateien |
|---|---|
| A1 | `modi_kn` (vier): Rezeption schriftlich und bildlich → Auftrag A2 · Interaktion mündlich → Auftrag A3 · Produktion schriftlich und bildlich → Heft A und Heft B · **Lücke: Produktion mündlich** (nur geübt in Station 1 des Jury-Gesprächs; steht in `modi_auftrag_herleitung`) |
| A2 | A und B führen je «Produktion schriftlich und bildlich», Stelle: Produkt auf S. 7 |
| A3 | Rezeption auf S. 3 in beiden Heften geübt, nicht geführt (A: ohne Medien Text und zwei Bilder im Buch, mit Medien Video; B: ohne Medien Text, mit Medien Audio) |
| A4 | `produkte[0]` flaeche, Schritt 1 · `produkte[1]` spur, Schritt 5 |
| A5 | 2.4.1 und 2.4.2 je geführt; «Prompt formulieren, Bild erzeugen» (Detail von 2.4.1) nur als Erweiterung |
| A6/A7 | SK A 7·5·12, B 1·7·6, KN 7·5·6 (Werkschau 5·6·7); alle fünf SK des Themas stehen in A oder B |
| A8/A9 | Produkte verschieden (Plakat-Entwurf · Rezension · Jury-Übersicht · Jury-Gespräch); Lebensbereiche paarweise verschieden (Berufsfachschule · Freizeit und Freundeskreis · Lehrbetrieb · Verein und Brauchtum) |
| A10 | A: Fachkorrektheit + Position / Werthaltung · B: Argumentation + Kulturelles Prinzip · Auftrag: alle vier; Stufentexte zeichengleich mit `kn.rubrik_shared` |
| A11 | Pol-Typen: A `modell_eigener_fall` / `lehrmittel_quelle`, B `position_gegenposition` in beiden Spuren |
| A12 | beide Hefte mit beiden Spuren |
| A13 | Fall-Begriffe: kein Treffer in Heften, Auftrag, Glossar, Karten |
| A14 | siehe §5 |

**Aspekt «Identität und Sozialisation»:** Beide Kompetenzen nennen ihn; der
Datensatz führt für T2 keine Iteration. `prinzip.aspekte` trägt darum nur
«Kultur» (R1). Der Inhalt (Perspektivenübernahme) bleibt über Kap. 18.3,
S. 419 in Heft B.

## 5. Vergleich mit Gold (nur Kurzliste aus kohaerenz.md §4)

| | diese Einheit | Gold 1.3.1 | Herleitung |
|---|---|---|---|
| Modi Heft A | Produktion schriftlich und bildlich | Rezeption schriftlich und bildlich | 2.4.1, Kompetenz-Ebene |
| Modi Heft B | Produktion schriftlich und bildlich | Rezeption schriftlich und bildlich · Interaktion mündlich | 2.4.2 |
| Modi Auftrag | Rezeption schriftlich und bildlich · Interaktion mündlich | Produktion mündlich · Produktion schriftlich und bildlich | Formel; Sonderfall «drei Modi», Ausnahme laut Bauplan §9 (Interaktion statt Produktion) |
| `modi_kn` | Gerüst-Wert | gleich | E27 |
| SK | A 7·5·12 · B 1·7·6 · KN 7·5·6 | A 5·11·1 · B 2·6·11 · KN 5·11·6 | SK des Themas T2 |
| Produkte | Plakat-Entwurf mit Werkkommentar (Liste mit Marken) · Rezension (Fliesstext) · Jury-Übersicht · Jury-Gespräch | alle anders | Verben der Kompetenzen |
| Quellentyp A · B | Video · Audio | Artikel · Grafik | Produkt von A ist ein Bildwerk; Modus des Themas |

## 6. Entscheide im Lauf (auto-modus §4)

Kein Entscheid des Bauplans wurde geändert. Wo er schwieg:

- **Prinzip/KN:** `aktivierte_trade_offs` des KN = Spannungsfelder 2, 3, 4.
  Leitfrage des KN eigene Formulierung. **Stufentexte nach dem Gegenlesen
  geändert:** Vier Lesende konnten die höchste Stufe nicht erreichen oder
  verstehen («an einem neuen Werk getrennt», «wo ein Begriff nicht mehr
  passt»). Neu: Fachkorrektheit 3 Punkte «gesagt ist auch, welches Mittel was
  bewirkt»; Kulturelles Prinzip 3 Punkte «gesagt ist auch, warum das Werk auf
  andere anders wirken kann». Damit weicht Kriterium 3 von der Progression
  «übertragen» der Skill ab — gewollt, weil «übertragen» im Heft keinen Ort
  hatte.
- **Heft A:** Für das Plakat gelten überall drei Mittel (Bildaufbau, Symbol,
  Wortwahl); Auswahl und Gewichtung sind die zwei weiteren des Lehrmittels und
  stehen als Knoten im Netz. Jeder Teil des Produkts hat eine Herkunft (LF2 →
  Bildskizze und Satz 1 · LF3 → Satz 2 · LF4 → Schlagzeile, Satz 3, Satz 4).
  LF4 fragt nach der Deutlichkeit («klar sagen oder Raum für eigene Deutung»),
  nicht nach «Schlagzeile oder Bild». Markiert wird mit drei Kreisen (voll,
  leer, halb), wie der Renderer die Legende druckt. Eigenes Thema erlaubt; der
  Fall der Lösungen ist das Handy in der Pause. Beispielbild: Plakat im
  Hauseingang eines Wohnblocks. Karte 4 bleibt `hko-was-zeige-ich` — der im
  Bauplan genannte Ersatz `hko-storyboard` plant eine Bildfolge und trägt den
  Entscheid über die Deutlichkeit nicht.
- **Heft B:** erfundenes Werk der Ich-Person: Kurzfilm «Drei Runden» einer
  Jugendfilmgruppe; Beispielbild an einem erfundenen Hörspiel. Die vier Stücke
  der Rezension heissen «Abschnitte» (Beschreibung · Urteil · andere Sicht ·
  Schlusssatz), weil der Renderer auf S. 1 «Teil 1–3» für etwas anderes
  druckt. Blocktitel «Mein Urteil, eine andere Sicht» (Budget 32). Titel und
  Rückmeldung zählen nicht zu den Wörtern. `zahlen_tabelle` mit vier Zeilen.
  Rollenwort «Gesprächsleitung» (Geschlecht aus der Abschrift nicht
  bestimmbar). Vertiefung 2: Leitfrage umformuliert (99 Zeichen).
- **Set:** Wort auf Entwurf 1: «Miteinander». Die wertenden Stichworte zu den
  drei Entwürfen stehen nicht in der Situation (sie nähmen die Jury-Übersicht
  vorweg), sondern im Erwartungshorizont. `zahlen_tabelle` wiederholt Angaben
  des Textes (kein Fall mit Zahlen). Schritt 03 ist «Vorarbeit fürs Urteil»:
  Das Label «Urteil und andere Sicht» steht laut Bauplan fest, geurteilt wird
  in Schritt 04. `heft_bezug` mit je zwei Einträgen (A1). Glossar «Wirkung»
  als zwei Einträge mit gleicher Definition (je Heft nötig).
- **Begleiter:** SK des Auftrags 6·7; «vor dem Druck» und technische
  Voraussetzung als `warnung` unter «Vorbereitung der Spur mit Medien»;
  zusätzliche Callouts (Werkwahl, Nähe zu 2.2, Karte «Auswählen, was ich
  zeige»); Hinweis zur Zeit für Lernende mit Deutsch als Zweitsprache als
  Erfahrung aus anderen Läufen, für diese Einheit nicht gemessen.
- **Gegenleser:** die Lösungs-Audits je Heft für beide Spuren in einem Auftrag
  (zwei statt vier); der Text der QR-Seite fehlte in den Paketen (kein
  Dev-Server).

## 7. Gegenleser (gegenleser.md §6)

Besetzung, gleichzeitig: Lernende/r Profil a an Heft A ohne, Heft A mit, Heft B
ohne, Heft B mit, Auftragsbogen; Profil b an Heft A mit und Heft B mit;
Lösungs-Audit Heft A, Heft B (je beide Spuren); Sweep.

| Gegenleser | Runde 1 | übernommen | nicht übernommen |
|---|---|---|---|
| Lernende a, Heft A ohne | 3 Stellen + 25 Hänger | drei Mittel einheitlich, Satz 4 und Kriterium, Satz 2, Markieren, Auftrag S. 3, Bezug zu S. 292 und S. 389 | Merksatz der Karte `lm-16-3-gestaltung` (S); Karte 4 mit Zonen-Beispiel (S, Bauplan); ein Schreibfeld auf S. 7, «SuK/Ges», «Teil 1–3», Checkliste ohne LF3 (R); beide Plakate im Buch sind eindeutig — für LF4 fehlt ein offenes Gegenbeispiel (Lehrmittel) |
| Lernende a, Heft A mit | 3 Stellen + 20 Hänger | wie oben; LF4 behauptet über die Quelle nur noch, was der Ton trägt; Auftrag zur Quelle (Bild, Ton, Aussage), «QR-Seite» erklärt | Quelle belegt weder Wortwahl noch Bildaufbau (Q); Vertiefung «1. Antwort» (Q) |
| Lernende b, Heft A mit | 3 Stellen, Wortliste | wie oben | Wörter des Gerüsts (Persona, Sprachmodus, Quer-Check, Knoten — R); Kap. 16.3/20.1 nicht im Heft (so gewollt) |
| Lernende a, Heft B ohne | 3 Stellen + 30 Hänger | «welches Werk?» geklärt, Abschnitte statt Teile, Beispielzeile des Rasters, kritisches Beispiel auf S. 6, `tun` der Karten, Rückmeldung, Seitenangaben in LF1 | Merksätze der Karten `lm-17-3-stellungnahme` und `lm-17-3-3b-schema` (S); Kap. 17.2 trägt nur die Beschreibung, nicht das faire Kritisieren (Bauplan; das trägt Kap. 17.3/18.3 und die Karte Feedback) |
| Lernende a, Heft B mit | 3 Stellen + 25 Hänger | wie oben; Zeitmarke mit Rolle in «Wer spricht», vier Werte für «Absicht», Muster 08:09 / 09:00 / ab 09:16 | QR-Adresse mit 2.4.1 (V, E21); Hörfehler der Abschrift (Paket); Theaterkritik als Quelle (Q, Bauplan Entscheid 3) |
| Lernende b, Heft B mit | 3 Stellen, Wortliste | wie oben | Wörter der Stufentexte («schlüssig», «ansatzweise» — KN-Wortlaut); «Kernaussage», «Befund» (R/Gerüst) |
| Lernende a, Auftragsbogen | 3 Stellen + 15 Hänger | Schritt 02 (Haltung des Entwurfs, «offen»), Schritt 03 (nur Wirkung und offene Frage), Indikatoren, Glossar «Haltung», Spannungsfeld-Hinweis | Label «03 Urteil und andere Sicht» (V, Bauplan); «Zahlen \| Betrag», «Ende Ziel … Probelauf» (R); Rückfrage ohne Feld; «geben Sie diese Seite ab» vor Station 4 (V, Bauplan wörtlich) |
| Audit Heft A | 13 Befunde, 2 «falsch» | alle 13 (LF4 mit Medien: kein belegtes «offenes» Werk in der Quelle; Werkkommentar hatte fünf statt vier Sätze; Bildlegende trägt nur die Jahre; Bildaufbau und Symbol stehen im Lehrmittel unter Bildmanipulation; Zeitmarken und Deutungen gekennzeichnet) | — |
| Audit Heft B | 14 Befunde, 2 «falsch» | alle 14 (Vertiefung 2 verkehrte den Sinn einer Aussage; Beschreibung im Lösungsbild hatte vier statt zwei bis drei Sätze; Sprecherzuordnung als erschlossen gekennzeichnet; Annahmen am erfundenen Werk gekennzeichnet) | — |
| Sweep | kein Regelverstoss | — | «Plakat» im `heft_bezug.titel` (Titel von Heft A); zwei Glossareinträge «Wirkung» (je Heft nötig) |

Weggefallen nach Nachprüfung: «Affe» statt «Gorilla» in der Ersatzquelle von
Heft A (die Untertitel sagen bei 00:39 «Gorilla»; ungenau war die Notiz im
Bauplan); «keine Kreise im Beispiel auf S. 6» (Textaufbereitung der Pakete —
der Renderer druckt die Legende als drei Kreise; am Seitenbild zu prüfen);
«✔ … ☐» und zusammengezogene Wechselrede (Artefakte).

**Runde 2** (alle sieben Lernenden an den geänderten Seiten): Kernbefunde
behoben oder «teilweise». Neu aus den Änderungen: «vier Mittel … drei davon»
(Heft A), Grenze Satz 2 / Satz 3, «klar oder Frage» ohne «Raum für Deutung»;
«darüber», «trotzdem», «enger», Hinweis auf den Merksatz der Karten,
Überlappung der zwei Indikatoren (Heft B); Label gegen Hint in Schritt 03,
«‹offen› gilt», Indikator auf der gemeinsamen Station 4 (Set).
**Runde 3** (dieselben sieben, nur die geänderten Zeilen): fast alles behoben;
sechs Zeilen gingen in eine dritte, letzte Korrektur (Heft A S. 4: kaputter
Satz in LF4 ohne Medien, Denkhilfe; Heft B: Reihenfolge im Intro, Indikator
«Kulturelles Prinzip» bei 2 Punkten, Stütze zu «fragt»; Set: Indikator
Position). Diese sechs Zeilen sind nicht mehr gegengelesen. Zuletzt gelesen:
Runde 3.

**Offen nach drei Runden** (nicht mehr geändert):

- **Heft A, Kreise:** Ob die drei Kreise im Beispiel auf S. 6 für Lernende als
  Markierzeichen erkennbar sind, ist am Seitenbild zu prüfen.
- **Heft A mit Medien, LF4:** Die Angabe zur Quelle hat keine Zeitmarke
  (Budget), und die Quelle belegt nur das eindeutige Werk (00:50–00:53); für
  «Raum für Deutung» liefert sie kein Beispiel. Die Ersatzquelle trägt gerade
  den offenen Pol.
- **Heft A, Satz 2 für 3 Punkte:** drei Mittel mit je einer Leistung in einem
  Satz; das Beispiel zeigt es knapp, eine B1-Leserin weiss nicht, was genügt.
- **Heft A S. 6:** Merksatz der Karte `lm-16-3-gestaltung` («Steht ein ganzer
  Satz darauf, ist es zu viel») unter dem Hinweis, dass die Schlagzeile die
  Ausnahme ist; Karte `hko-was-zeige-ich` mit Zonen-Beispiel aus einem
  Sportverein.
- **Heft A S. 8:** Knoten «Auswahl» und «Gewichtung» stehen im Netz, obwohl
  LF1 nur drei Mittel verlangt.
- **Heft B S. 6:** Das Beispiel zeigt ein Argument statt zwei und nicht, ob
  das Urteil bleibt oder eingeschränkt wird; Merksätze zweier Karten
  widersprechen (das Heft sagt, was gilt); die Rezeptionskarte spricht ohne
  Medien von «Zeitmarke».
- **Heft B S. 5:** Argumentation und Kulturelles Prinzip belohnen bei 3 Punkten
  denselben Abschnitt (andere Sicht) — einmal für die Antwort, einmal für die
  Erklärung.
- **Heft B S. 2:** Die Begriffe aus LF1 fliessen nur als Gliederung in das
  Produkt (Schritt 01).
- **Heft B mit Medien, S. 3:** Was in «Wer spricht» und was in «Absicht»
  gehört, bleibt bei Fragen unsicher; die Abschrift kennt keine Sprecher.
- **Auftragsbogen:** Label «03 Urteil und andere Sicht» gegen den Hint
  «Vorarbeit fürs Urteil»; die Schritte 02 und 03 verweisen auf Heftseiten,
  die nicht zum Bogen gehören.
- **Alle:** «SuK», «Ges», «Kulturelles Prinzip», «Wortlaut Kompetenznachweis»
  unerklärt; ein Schreibfeld auf S. 7 für alle Teile; «gilt auch bei …».

Zeitsummen der Lernenden (Schätzungen, Runde 1): Heft A Profil a 140 Min.
(ohne) und 145 Min. (mit), Profil b 200 Min.; Heft B Profil a 156 Min. (ohne)
und 115 Min. (mit), Profil b 176 Min.; Auftragsbogen 63 Min.

Kein Gegenleser konnte prüfen: Ton und Bild, Seitenbild und Feldgrössen, die
QR-Seite, die zwei Plakate im gedruckten Buch.

## 8. Vor dem Druck gegenhören / gegensehen / am Buch prüfen

- **Kap. 12.1, S. 293 am gedruckten Buch:** Dass das linke Plakat (1946)
  ablehnt und das rechte (1953) wirbt, stammt aus einer maschinellen
  Bildbeschreibung; die Bildlegende nennt nur die Jahre. Die gedruckte
  Beispielzeile des Rasters in Heft A ohne Medien hängt daran (die Lösung
  trägt den Vorbehalt, die Beispielzeile nicht).
- **`q-241a-pflicht` und Ersatz:** jede Zelle der Spalte «Bild» ist aus dem
  Ton erschlossen; Zeitmarken 00:33, 00:50–00:53, 01:28, 01:56–02:05,
  02:38–02:43, 03:21–03:35 (Ersatz: 00:39, 01:08, 01:23–01:48, 03:01–03:07).
  Eignung des Schauplatzes (Kriegsgebiet) für die Klasse.
- **`q-241b-pflicht`:** Beginn 06:19 und Ende 09:59 in der ganzen Sendung
  (±10 Sek.); Zeitmarken 07:15, 08:09, 09:00, 09:16; wer jeweils spricht
  (Rollen aus dem Text erschlossen). **Ersatz:** 01:03–02:48; 01:21, 01:56,
  02:03.
- **`q-241a-vertiefung-2`:** Transkript aus einer anderen Ausgabe desselben
  Tages, nicht gegengehört. **`q-241b-vertiefung-2`:** 05:42–08:40, nicht
  gegengesehen; zwei heikle Wörter bei 07:02.
- **Vertiefungs-Artikel am Handy** (Ausschnitte nicht zusammenhängend; Seite
  mit Werbung); alle SRF-Links kurz vor dem Einsatz.
- **Heft A S. 6:** ob die Kreise der Legende im Beispiel erkennbar sind.
- **S. 7 beider Hefte:** leere Fläche — ob Skizze, Schlagzeile und vier Sätze
  bzw. 150–200 Wörter plus Rückmeldung Platz haben.

## 9. Unbelegt, nicht geprüft

- **Kunst als Gegenstand, Rezension als Textsorte, Kunstfreiheit:** nicht im
  Lehrmittel der Zeile. Das Heft macht keine Aussage zur Kunstfreiheit als
  Recht; «Rezension» ist mit dem Wortlaut der Kompetenz erklärt.
- **Mittel:** Kap. 7.1 führt sie als Beeinflussung in Nachrichten, Bildaufbau,
  Symbolisierung und Retusche unter Bildmanipulation. Dass sie auf einem
  Plakat erlaubte Mittel sind, ist eigene Übertragung (in den Lösungen so
  gekennzeichnet); ebenso «hinter einer Haltung steht ein Wert» (S. 292
  handelt von Partnerschaft) und die Erklärungen von Bildaufbau und Symbol.
- **Beispiel = Stelle im Werk** (Heft B): Übertragung; im Lehrmittel ist das
  Beispiel ein Beleg. **Fairer Ton:** S. 396 gilt dem Kommentar.
- **Wirkung eines Werks:** eigene Beobachtung der Lernenden.
- **Glossar:** «Rollenbild» steht als Wort nicht in Kap. 12.1; die vier
  Begriffe der Medien-Spuren (Ort, Wandbild, Inszenierung, Ensemble) sind
  allgemeine Worterklärungen.
- Nicht geprüft: Ton, Bild, QR-Seite, Aussehen in Word (nur Seiten gezählt),
  Workbench im Browser, Inhalt der Methodenkarten gegen ihre Kapitel.

## 10. Fehler in Skill, Skript, Renderer, Bestand (nicht repariert)

Neu in diesem Lauf:

- **Bauplan, Kohärenz-Audit zu `q-241a-pflicht`:** Rasterzeile 5 und der
  Befund zu LF4 nehmen an, die Quelle zeige neben dem eindeutigen Werk Werke
  mit offener Aussage. Am Ton belegt ist nur, dass der Reporter ihren Sinn
  eindeutig benennt. Die Notiz zur Ersatzquelle nennt «Affe», die Untertitel
  sagen «Gorilla».
- **Gedruckte Merksätze von Methodenkarten widersprechen dem Heft:**
  `lm-16-3-gestaltung` («Folienregeln», «Steht ein ganzer Satz darauf, ist es
  zu viel»), `lm-17-3-stellungnahme` («Der Titel ist eine Frage»),
  `lm-17-3-3b-schema` («Drei Argumente»). Überschreibbar ist nur `tun`/`fuer`.
- **`hko-was-zeige-ich`** ist für Texte über sich selbst gebaut (Zonen,
  Beispiel Sportverein); für die Deutlichkeit eines Plakats trägt sie nur
  Schritt 1 und 4. Eine Karte zur Bild- und Werkbeschreibung fehlt.
- **Renderer, S. 8 ohne Glossar:** zeichnet eine alte Mindmap und läuft über
  (37.7 px) — eine Messung vor Phase 7 ist für S. 8 wertlos.
- **Renderer, S. 1:** druckt «Teil 1–3» für die Übersicht; ein Produkt mit
  eigenen «Teilen» kollidiert damit.
- **Renderer:** «Plus» wird doppelt gedruckt, wenn `scaffold_100` mit «Plus:»
  beginnt.
- **`check-v42` (`auftragSpalten`):** «S. 8» in einer Klammer nach dem
  Doppelpunkt löst fälschlich `ERR_V42_AUFTRAG_SPALTEN` aus.
- **`check-lf-loesung`** zählt Lösungslängen anders als ein Codepoint-Zähler.
- **phase-7 §4.2** («zahlen_tabelle: nur Zahlen») passt nicht zu einem Fall,
  dessen Material Kurzbeschriebe sind; der feste Tabellenkopf «Zahlen | Betrag»
  steht dann über Text.
- **Skelett Begleiter:** kein Ort für «vor dem Druck prüfen» und für «was das
  Lehrmittel nicht trägt»; die Zeile «Sprachmodi» in §6 kennt den Sonderfall
  «drei Modi, der Auftrag trägt zwei» nicht.
- **Kriterium 3, Progression «übertragen»** (phase-2-3 §3.5): im Heft für
  Lernende nicht erreichbar formuliert; hier ersetzt (§6).
- **Gemeinsamer Scratchpad:** Ein Executor startete versehentlich ein altes
  Hilfsskript des Laufs 3.3.1. Es brach vor seiner einzigen Schreibzeile ab;
  `3.3.1_kaufvertrag_beurteilen` ist unversehrt (`check-v42`: 0 Befunde). Die
  alten Skripte liegen jetzt in einem Unterordner.

Bekannt aus früheren Läufen, hier wieder berührt: E30 in der Skill nicht
nachgeführt; Skelett-Checkliste «Begriff aus LF1» gegen phase-5 §8; `tun` wird
für `hko-`Karten nicht gedruckt; `hko-quelle-raster` spricht ohne Medien von
«sehen, hören» und «Zeitmarke»; «SuK/Ges» und «Wortlaut Kompetenznachweis»
ohne Erklärung; «Ende Ziel … Probelauf»; kein Budget für Leitfrage, Auftrag,
Tabellenzellen des Auftragsbogens und für `erwartung`; Leck-Prüfung nur in
`check-all`; jede Änderung an Heft, Set oder KN verlangt einen neuen Lauf des
Marker-Skripts und einen Blick auf die Prosa des Begleiters (hier dreimal).

Bestand und Arbeitsbaum: Im Arbeitsbaum liegen fremde, uncommittete Änderungen
an rund zehn committeten Einheiten (auch 3.3.1, 4.1.1, 4.2.1), an vier
Methodenkarten, über fünfzig Quellenkarten, an Skill, Renderer, Skripten und
Seiten. Ein Teil entstand während dieses Laufs. Sie sind nicht angefasst und
nicht im Commit; Messung und Build liefen mit ihnen. Heft A dieser Einheit
bindet `lm-16-3-gestaltung` ein und ist mit deren geänderter Fassung gemessen.

## 11. Commit

Ein Commit «Einheit 2.4.1_haltung_zeigen (bbw-hko-heft-v42)»: Ordner der
Einheit, die acht Karten `q-241a-*`/`q-241b-*`, dieser Bericht mit
`check-all.txt` und `messung.txt`, die zwei Index-Dateien. Kein Push.
