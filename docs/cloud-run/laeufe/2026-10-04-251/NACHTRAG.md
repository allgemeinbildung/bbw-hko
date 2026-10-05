# Nachtrag — Einheit 2.5.1_klimaveraenderung_diskutieren · 2026-10-05

Abschlussrunde nach `BERICHT.md` (Lauf 2026-10-04). Ziel: freigabereif, sobald die
Videos einmal gegengesehen sind. Kein Lehrmittel-, Untertitel- oder Artikeltext in
diesem Nachtrag; nur Seite, Zeitmarke und eigene Formulierungen.

Geändert: `herausforderung_A.json`, `herausforderung_B.json`, `set.json`,
`begleiter.md` (Marker neu gefüllt + vier Freitextstellen), Karte
`src/data/quellen/q-251b-pflicht.json`. Nicht angefasst: `kn.json`, `prinzip.json`,
die vier anderen Karten, alles Geteilte. `set.json`-Status bleibt `entwurf`.

## 1. Tor und Messung (nach der letzten Änderung)

| Befehl | Ergebnis |
|---|---|
| `begleiter-marker.mjs … --check` | 266 Marker · 0 abweichend · 0 unauflösbar |
| `check-all.mjs 2.5.1_klimaveraenderung_diskutieren` | **GRUEN — keine Fehler.** |
| `export-v42.mjs` + `messen-v42.mjs` | Exit 0 · 56 Seiten ok · **kein Überlauf**. Knapp wie zuvor: Heft B S. 8 «Reserve −0.3 px» (Toleranz des Skripts), Auftragsbogen A1 0.5 px, Lösungen mit Medien S. 3 je 8.7 px |

Nicht gelaufen (laut Auftrag nicht meine Sache): `build:einheiten-index`, `npm run build`, Commit.

## 2. Befunde aus dem Bericht — was damit geschehen ist

### Heft A

| Befund | Stand |
|---|---|
| Schritte 01/02 nennen keinen Ort für die Stichworte | **behoben** — beide Schritte heissen jetzt «Unterstreichen Sie in Ihrer Antwort zu LF1 / LF2 (S. 2) …»; es entsteht kein neuer Text ohne Ort |
| «Zukunftsaussage» neben «Aussage zur Zukunft» | **behoben** — überall «Aussage zur Zukunft» (Label Schritt 04, Schritt 05, Abgabe) |
| S. 7 hat ein einziges Schreibfeld; Liste «Belege» nur per Text verortet | **stehen gelassen** (Renderer). Schritt 03 sagt «S. 7, unter dem Text». Beide Gegenleser der Runde 2 haben die Liste trotzdem richtig angelegt, nennen es aber weiter als Stolperstelle |
| neu (Gegenleser): Schritt 03 und «Ins Produkt» von LF3 schickten den Befund in die Liste «Belege»; Beispiel und Lösungsbild führen dort keinen Befund | **behoben** — «Zwei Aussagen … kommen in die Liste «Belege»; der Befund stützt Absatz 3» (Schritt 03, LF3 beider Fassungen) |
| neu (Gegenleser): Beispiel S. 6 machte aus «kann zu … kommen» (Kap. 9.1, S. 223) ein «sind eine Folge» | **behoben** — «Bergstürze und Erdrutsche sind möglich» |
| neu (Gegenleser): Signalwort «wenn» für künftig führt bei 00:42 in die Irre | **behoben** — «seit», «schon» für heute; «dürfte», «bis» für künftig. Runde 2: hilft «halb» (droht, werden, könnten fehlen) — stehen gelassen |
| neu: Methodenkarte Raster «(S. 3)» wurde als Buchseite gelesen | **behoben** in A und B — «(Heft, S. 3)» |

### Heft B ohne Medien

| Befund | Stand |
|---|---|
| LF3 `liefert` «Belege für beide Seiten», Frage fragt nach Bindungsstärke | **behoben** — «Instrumente als Belege für beide Seiten» |
| Einwand doppelt (S. 4 und Schritt 03) | **behoben** — Schritt 03 heisst «Zweites Argument belegen»: Argument auf eine Rasterzeile stützen, die Zeile markieren, die gegen die eigene Position spricht. Der Einwand entsteht nur noch in LF4 und kommt in Schritt 04 auf die Karte. Runde 2: Einwand und Antwort stehen weiter in Denkhilfe, LF4-Feld und Karte (Gerüst: Denkhilfe → Leitfrage → Produkt) |
| «Ein Eintrag je Spalte genügt» über drei leeren Zeilen | **stehen gelassen** (Renderer) |
| neu: Befund-Umfang stand nur in der Checkliste | **behoben** — LF3: «Befund (zwei, drei Sätze): …» |
| neu: Beispiel der Rasterkarte verletzte die eigene Fünf-Wörter-Regel | **behoben** (Override gekürzt) |

### Heft B mit Medien

| Befund | Stand |
|---|---|
| «meine Seite» an der Quelle nicht eindeutig | **behoben** — «Ins Produkt» und Schritt 03 sprechen von «Ihr zweites Argument» und der Zeile, «die gegen Ihre Position spricht»; LF4 verlangt «die Aussage der Quelle, die am stärksten gegen Ihre Position spricht (Zeitmarke)» statt eines «Einwands aus der Quelle» (die Sendung streitet über die Initiative, nicht über die Kaufpause). Runde 2: Der Leser findet in beide Richtungen eine Gegenaussage (18:20 bzw. 17:37) |
| Raster ohne Zeitmarken-Spalte | **behoben** — erster Spaltenkopf «Zeit / wer spricht» (wie Heft A; `check-v42` grün). Abweichung vom Bauplan §7 in einem Spaltenkopf, bewusst |
| Verteilung der vier Aussagen | **behoben** — Auftrag: «Vier Aussagen, von beiden Sprechern». Eine Zahl je Sprecher steht nicht da; die Lösung hat 3 + 1 |
| Zwei ungeprüfte Behauptungen (16:07–16:19, 16:42–16:49) | **behoben, soweit im Text möglich** — Heft S. 3 sagt neu: «Zahlen der Sprechenden: mit «laut …»»; Lösung LF3 führt 16:17 als «behauptet»; Erwartungshorizont LF4 und Begleiter warnten schon. Runde 2: unklar bleibt für Lernende, welche der zwei Prozentzahlen bei 16:42–16:49 gilt — die Lösung verwendet keine |
| «die Vorlage» nicht eingeführt | **behoben** — Heft sagt durchgehend «Initiative» |
| Karte sagt «Umweltminister», Heft «Bundesrat» | **behoben** — Kurzbeschrieb der Karte: «Ein Befürworter und ein Bundesrat streiten …». Wer spricht: laut Untertitel (15:10, 15:44) und UVEK-Seite ein SP-Nationalrat aus Luzern als Befürworter und Bundesrat Albert Rösti, Vorsteher des UVEK. Heft, Lösungen und Karte führen weiter nur Rollen (Bauplan). Die Namen fallen im Video selbst |

### Auftragsbogen

| Befund | Stand |
|---|---|
| Schritt 01 (letzte Änderung des Laufs, ungelesen) | **neu gefasst und zweimal gelesen** — «A2, Tabelle mit vier Zeilen: je Vorschlag (zwei je Variante) Art (…) und Folge.» «Punkte» heisst überall «Vorschläge» (Kriterium, Erwartungshorizont, Begleiter) |
| Notizen zu 02/03 nicht unter «Das geben Sie ab» | **behoben** — «A2: Tabelle mit vier Zeilen; darunter Nachfrage, Argument, Einwand, Antwort» |
| «füllt eines der vier Felder aus» bei Partnerarbeit | **behoben** — «mindestens eines der Felder»; `gut_wenn[2]` und Begleiter angeglichen |
| Schritt 05 und Feld 4 überschneiden sich | **behoben** — Schritt 04 füllt Felder 1 bis 3, Schritt 05 schreibt Feld 4. Runde 2: Felder 2 und 3 decken sich inhaltlich weiter mit «worauf wir uns einigen / was offen bleibt» (Stationen aus dem Bauplan, stehen gelassen) |
| Kriterium «Ökologisches Prinzip» ohne Schritt | **behoben** — Schritt 03 verlangt ein Argument, «das Energieverbrauch, Folge und Betroffene verbindet»; Indikator verweist auf Schritt 03. Offen: Stufen 2 und 3 (heute/künftig, weitere Situation) sind KN-Wortlaut und haben auf dem Bogen keinen eigenen Auftrag |
| `gut_wenn[2]` «eine Station» | **behoben** |
| neu: Schritt 02 ohne Ort für die Einordnung | **behoben** — «Markieren Sie in der Tabelle wie in Heft A, was belegt, erwartet oder vermutet ist.» |
| neu: Heft-Verweis «Legende (S. 7)» falsch, Wirkungskette fehlte | **behoben** — Legende S. 6; statt des Rasters verweist der Bogen auf die Wirkungskette (S. 6), die zum Kriterium passt |
| Position hat nur mündlich einen Ort | **stehen gelassen** — Interaktionsmodus; Begleiter rät, die zwei Sätze vorher notieren zu lassen |

### Lösungen und Glossar

| Befund | Stand |
|---|---|
| «Regeln erreichen mehr Leute» ohne «Folgerung» | **behoben** an fünf Stellen (Hinweis und Notiz im Lösungsbild, Denkhilfe, Mitnahme, Beispiel 1 mit Medien) |
| Abstimmungsausgang nur nach SRF | **amtlich bestätigt**, Hinweis in Lösung, Begleiter (zwei Stellen) und Karte ersetzt |
| Glossar zirkulär | **teils behoben** — Hitzeperiode, Starkniederschlag, Pollensaison neu. Nullgradgrenze und Trockenperiode erklären das Wort brauchbar; belassen |
| Audit Runde 2 (rund 55 Stellen, kein Sachfehler, alle Zeitmarken und Rollen bestätigt) | **behoben:** Beispiel 2 mit Medien kennzeichnet «Jemand muss anfangen» als Satz des Vaters · «behauptet» in der Erwartet-Zeile zu 16:17 · «(Deutung)» an zwei Rasterzellen · Notiz zum erwarteten Einwand trennt Seite und Folgerung · «ich stütze ihn auf das Lehrmittel» statt «das Lehrmittel stützt ihn». **Stehen gelassen:** Kanten des Begriffsnetzes als Setzung des Hefts; Beispiel 2 mit Medien stützt den Einwand weiter auf 16:55 — die Passung zur Aufgabe ist nur über die gekennzeichnete Folgerung gegeben (schwächste Lösungsstelle der Einheit) |

Diese Lösungsänderungen sind nach dem Audit entstanden und **nicht noch einmal auditiert**.

## 3. Geprüfte Fakten

| Aussage | Quelle | Abruf |
|---|---|---|
| Umweltverantwortungsinitiative am 9.2.2025 mit 69,8 Prozent Nein abgelehnt; Frist der Initiative zehn Jahre | uvek.admin.ch/de/uvi (UVEK) | 2026-10-05 |
| Bundesrat Albert Rösti als zuständiger Bundesrat | dieselbe Seite (Verweis auf seine Statements); Vorsteher UVEK aus eigenem Wissen, auf der Seite nicht ausdrücklich | 2026-10-05 |
| Kap. 9.1, S. 220: natürlicher und verstärkter Treibhauseffekt | Kapiteldatei | 2026-10-05 |
| Kap. 9.1, S. 222: zwei Grad seit 1864, bis 2060 ein bis drei Grad möglich, Pollen | Kapiteldatei | 2026-10-05 |
| Kap. 9.1, S. 223: Gletscher, Permafrost | Kapiteldatei | 2026-10-05 |
| Kap. 9.3, S. 232: Halbierung bis 2030 gegenüber 1990, Netto-Null ab 2050; S. 233 vier Instrumente; S. 235 Technik und Verzicht | Kapiteldatei | 2026-10-05 |
| Kap. 9.2, S. 230: graue Energie | Kapiteldatei | 2026-10-05 |
| Alle fünf Links der Karten antworten mit HTTP 200; die vier Videos sind im SRG-Integrationslayer ohne Sperre und ohne Ablaufdatum geführt; Segmentlängen 136,2 s (A), 271,9 s (A Ersatz, Ausschnitt 194 s), 74,5 s (B Vertiefung) stimmen mit den Karten | srf.ch, il.srgssr.ch | 2026-10-05 |

Nicht gelungen: die Resultatseite der Bundeskanzlei (bk.admin.ch) lieferte nur das
Seitengerüst; die Zahl stammt vom UVEK, nicht von der Bundeskanzlei. Die Zahlen des
Lehrmittels sind gegen das Lehrmittel geprüft, nicht gegen heutige Messwerte.

## 4. Gegenleser

Profil b entfällt (Entscheid 05.10.2026). Modell Sonnet, Pakete mit `seitentext.mjs`.

| Runde | Gegenleser | Kern | Folge |
|---|---|---|---|
| 1 | Lernende a · A ohne, A mit | Befund in der Liste «Belege»; Signalwort; «sind eine Folge»; Kartenverweis | vier Korrekturen (oben) |
| 1 | Lernende a · B ohne, B mit | kein Einwand gegen die Kaufpause in der Quelle; «je Seite» zweideutig; Beispielkarte ohne Ich-Form und Argument 2 ohne Beispiel; Zuhörende unklar; «gelten lasse» ohne Ort | LF4 mit Medien neu gefasst; Auftrag; Beispielkarte; «Mitlernenden»; Schritt 04 nennt den Punkt, den man gelten lässt; Schritt 01 «Unterstreichen …» |
| 1 | Bogen | Einordnung ohne Ort; falsche Heftseiten | Schritt 02; Heft-Verweise |
| 1 | Sweep (selbst, per Suche; der Subagent kam wegen des Limits nicht zustande) | kein «ß», kein Platzhalter, keine Transliteration | — |
| 2 | Audit B (beide Fassungen) | sechs Kennzeichnungen, kein Sachfehler | Abschnitt 2 |
| 2 | Lernende a · A ohne, A mit (S. 3, 5–7) | niemand blieb stecken; Liste ohne Feld; Zahl der Listeneinträge | nichts mehr geändert |
| 2 | Lernende a · B ohne, B mit (S. 2–7), Bogen | siehe «offen» | nichts mehr geändert |

Zuletzt gelesen: Runde 2. Danach keine Änderung an Heften oder Bogen. Weggefallen
nach Nachprüfung: fehlende Legende, «✔ … ☐», «entscheidenRückmeldung», fehlender
QR-Code (Artefakte der Textaufbereitung); «Beispiel hat drei Belege» (es sind zwei
belegte, eine erwartete, eine vermutete Zeile — die Marken sieht der Textleser nicht).

**Offen nach Runde 2**

- Heft B S. 6, Karte Statement: mein `tun` sagt «rund zwei Minuten, nicht eine», der feste Merksatz der Karte darunter «mehr passt in eine Minute nicht». Drei Gegenleser nennen das als Stelle 1. Der Widerspruch bestand schon vorher; lösen lässt er sich nur in der Karte (Abschnitt 6).
- Heft B S. 6: Merksatz der 3B-Karte spricht von drei Argumenten, verlangt sind zwei; Karte Diskussion nennt den Kompromiss als Schluss, das Heft die Bitte; Karte Statement verlangt einen Satz zur Ausgangslage, die Stichwortkarte führt ihn nicht.
- Heft B: Kriterium Argumentation Stufe 3 «Folgen sind bedacht» (KN-Wortlaut) hat keinen Schritt. Wer in Schritt 05 den Einwand bringt, steht nicht da.
- Heft B mit Medien: «Ansatz bei wem» — der Bundesrat sagt nirgends, wo er ansetzt (Lösung: «Haushalte nur als Warnung»). Ob die Zeit im Player oder seit Beginn des Ausschnitts gemeint ist, steht nicht da.
- Heft B ohne Medien: Wo das zweite Argument formuliert wird (nur auf der Karte), ist für den Leser nicht eindeutig.
- Heft A: 100 bis 130 Wörter sind für alles Verlangte knapp; «wovon sie abhängt» wird in Schritt 04 nicht erklärt (LF4 trägt es); Beispiel S. 6 stammt aus demselben Kapitel wie der Auftrag.
- Bogen: Stufen 2 und 3 von «Ökologisches Prinzip»; Felder 2/3 gegen Schritt 05; Position ohne schriftlichen Ort; «Zahlen | Betrag» als Tabellenkopf (Renderer).
- Persona «eigener Wohnort» neben «wohne bei meiner Familie» (Gerüstwert).

Zeitschätzungen der Leser (Runde 1, ganzes Heft): A ohne 127 min · A mit 115 min · B ohne rund 130 min · B mit rund 121 min · Bogen rund 50 bis 55 min.

## 5. Gegenhör-Liste für Pietro

Kein Video wurde angesehen. Alles Folgende stammt aus den Untertiteln im Archiv.
Zeiten der Segmente A, A Ersatz und B Vertiefung zählen ab Beginn des Segments;
bei B Quelle ist es die Zeit in der ganzen Sendung.

### A Quelle — `q-251a-pflicht` · Tagesschau 4.11.2025 · 00:00–02:16
https://www.srf.ch/play/embed?urn=urn:srf:video:8136bb83-fc31-406b-8733-e22013e1db6c&subdivisions=false

| ☐ | Marke | Erwartet | Wer (laut Lösung) | Hängt daran |
|---|---|---|---|---|
| ☐ | 00:00 / 02:16 | Player startet mit der Anmoderation und endet nach dem Schlusssatz zu den Gletschern | Moderation / Reporter | Karte, Heft A S. 3 «Ausschnitt» |
| ☐ | 00:15 | bis 2100 fast fünf Grad Erwärmung | Moderation | LF3 «Auch gültig», LF4 beide Beispiele |
| ☐ | 00:42 (Aussage fällt bei 00:46) | Höchsttemperatur in den Städten schon über drei Grad höher | **«Fachperson» — wer ist es? Einblendung prüfen** | Rasterzeile 1, Befund, LF4 Beispiel 2, Glossar |
| ☐ | 00:54 | Hitzetage in Zürich bis Ende Jahrhundert doppelt bis dreifach | Reporter? (Leser hielt es für die Fachperson) | Rasterzeile 2, Befund, LF4 |
| ☐ | 01:02–01:12 | Wintertourismus; Nullgradgrenze seit 1900 um 500 m höher, bis 2100 nochmals | Reporter | Rasterzeile 3, Glossar «Nullgradgrenze (01:06)», LF4 |
| ☐ | 01:17–01:25 | mehr Starkniederschläge, wenn nicht mehr Klimaschutz kommt | Reporter | Rasterzeile 4, Glossar «Starkniederschlag (01:17)», Bedingung im Befund |
| ☐ | 01:29–01:43 | schon heute Veränderungen; vieles vermeidbar, wenn der Ausstoss jetzt sinkt | Klimaforscher | LF3 «Auch gültig», Befund (01:40), LF4 |
| ☐ | 01:46–02:01 | Bundesrätin zur Klimapolitik | Bundesrätin | nicht verwendet; nur Rollenname im Begleiter |

### A Ersatzquelle — `q-251a-pflicht-ersatz` · 10 vor 10, 4.11.2025 · 00:02–03:16
https://www.srf.ch/play/embed?urn=urn:srf:video:9256b166-fe24-4d2a-8cee-f492dd5d032f&subdivisions=false

| ☐ | Marke | Erwartet | Hängt daran |
|---|---|---|---|
| ☐ | 00:02 | Beginn mit der Anmoderation | Karte |
| ☐ | 00:23 | bei 1,5 Grad weltweit 2,9 Grad in der Schweiz | Lösung LF3 «Mit Ersatzquelle» |
| ☐ | 00:45 | Arbeit im Freien anstrengend | ebenda |
| ☐ | 00:59–01:09 | Hitzewellen häufiger | ebenda |
| ☐ | 01:35–01:53 | Tropennächte in Zürich gemessen und erwartet | ebenda |
| ☐ | 02:12–02:30 | Todesfälle durch Hitze, meist ab 75 | ebenda |
| ☐ | **03:16** | **endet der Ausschnitt sauber?** Laut Untertitel schliesst der Satz bei 03:13, bei 03:16 folgt ein Zwischentitel, danach der Teil zu Hitzeaktionsplänen. Der Player läuft bis 04:32 weiter — die Lernenden müssen selbst stoppen | Karte `verortung.bis` |

### B Quelle — `q-251b-pflicht` · Abstimmungs-Arena 24.1.2025 · 15:10–18:51 in der ganzen Sendung
https://www.srf.ch/play/embed?urn=urn:srf:video:0affffee-5616-4921-b6af-354dd1817551&subdivisions=false

| ☐ | Marke | Erwartet | Wer (erschlossen) | Hängt daran |
|---|---|---|---|---|
| ☐ | **15:10** | Moderator stellt den Befürworter vor und fragt nach Vorschriften und Verboten. **Stimmt die Sekunde im Player?** | Moderator | Karte, Heft B S. 3 |
| ☐ | 15:27–15:36 | Initiative gebe nur das Ziel vor, den Weg bestimme das Parlament | Befürworter | Rasterzeile 1 (15:29), Befund |
| ☐ | 16:00–16:19 | Lebensmittel würden schon jetzt teurer, mit Prozentzahl | Befürworter | **ungeprüfte Behauptung** — Heft: «laut …»; `nicht_tragfaehig` |
| ☐ | 16:17–16:26 | Nichtstun koste schon jetzt; die Leute zahlten, grosse Unternehmen profitierten | Befürworter | Rasterzeile 2, als «behauptet» |
| ☐ | **16:29** | **Sprecherwechsel zum Bundesrat — hört und sieht man ihn?** | Bundesrat | Satzanfang S. 3, alle Zuordnungen |
| ☐ | 16:42–16:49 | Anteil weniger Firmen am Ausstoss, zwei Prozentzahlen; **bei 16:49 korrigiert jemand dazwischen — wer?** | Bundesrat, Einwurf vermutlich Befürworter | **ungeprüfte Behauptung**; Lösung nennt keine Zahl |
| ☐ | 16:55 | diese Firmen stellten her, was wir kaufen | Bundesrat | LF4 Beispiele 1 und 2 |
| ☐ | 17:06–17:08 | am Ziel netto null bis 2050 halte man fest | Bundesrat | LF3 «Auch gültig» |
| ☐ | 17:11–17:22 | zehn Jahre Frist; Haushalte müssten stark reduzieren | Bundesrat | LF3 «Erwartet» (16:55–17:42) |
| ☐ | 17:37–17:47 | einzelne Familie müsste den Lebensstandard rasch senken; technischer Fortschritt brauche Zeit | Bundesrat | Rasterzeile 3, Befund, Glossar «Technischer Fortschritt (17:44)» |
| ☐ | **18:15** | **Sprecherwechsel zurück zum Befürworter** | Befürworter | Rasterzeile 4 |
| ☐ | 18:18–18:42 | nicht weniger Konsum, sondern sauberere Herstellung; dafür Rahmenbedingungen | Befürworter | Rasterzeile 4, Befund (18:37), Glossar «Rahmenbedingung (18:37)», LF4 Beispiel 1 (18:18–18:40), Beispiel 2 (18:37) |
| ☐ | **18:51** | Ende des Votums. **Stimmt die Sekunde, und bricht nichts mitten im Satz ab?** Die Sendung läuft weiter; die Lernenden stoppen selbst | Befürworter | Karte |
| ☐ | ganzer Ausschnitt | Gesprochen wird teils Mundart, die Untertitel sind Hochdeutsch: verständlich für die Klasse? Namen beider Sprecher fallen im Bild oder Ton — in den Unterlagen stehen nur Rollen | — | Begleiter |

### B Vertiefung — `q-251b-vertiefung-1` · Erklärvideo · 00:00–01:14
https://www.srf.ch/play/embed?urn=urn:srf:video:09ef8764-b1e9-40fe-b47b-a85142f10b66&subdivisions=false

| ☐ | Marke | Erwartet | Hängt daran |
|---|---|---|---|
| ☐ | 00:03–00:09 | was die Initiative von der Wirtschaft verlangt | `erwartung` |
| ☐ | 00:50–01:01 | Ziel für den Konsum im Land, bis 2035 | `erwartung` |
| ☐ | 01:04 / 01:07 | Weg offen; Massnahmen sozial tragbar | `erwartung` |
| ☐ | 01:13 | Überleitung nennt den Bundesrat beim Namen | nur zur Kenntnis |

### A Vertiefung — `q-251a-vertiefung-1` · Artikel SRF Meteo, 14.11.2025
https://www.srf.ch/meteo/meteo-stories/schweizer-klimaszenarien-die-wichtigsten-neuerungen-in-den-klimaszenarien
☐ Link öffnet den Artikel (HTTP 200 am 5.10.2026); Inhalt nur am Archivtext des Laufs geprüft, heute nicht neu gelesen.

Dazu: ☐ QR-Seite `/m/2.5.1_klimaveraenderung_diskutieren` (#a, #b) öffnen — nicht geprüft. ☐ Ein Heft und den Bogen auf Papier ansehen (Legende, Feldgrössen, Word-Dateien) — nicht geprüft.

## 6. Vorschläge für geteilte Dateien (nicht geändert)

| Datei | Alt | Neu | Beleg |
|---|---|---|---|
| `src/data/methoden/lm-16-2-statement.json` · `merk` | «Ein Satz Ausgangslage, zwei Sätze Begründung, ein Satz Entscheid — mehr passt in eine Minute nicht.» | «Ein Satz Ausgangslage, die Begründung, ein Satz Entscheid — mehr braucht ein kurzes Statement nicht.» | Das Heft verlangt zwei Minuten und zwei Argumente; drei Gegenleser nennen den Widerspruch an erster Stelle |
| `src/data/methoden/lm-17-3-3b-schema.json` · `merk` | «Drei Argumente nach 3B tragen weiter als sechs Behauptungen.» | «Ein Argument nach 3B trägt weiter als drei Behauptungen.» | Heft B verlangt zwei Argumente, Heft A eines |
| `src/data/methoden/lm-16-1-diskussion.json` · `beispiel`, `fehler`, `merk` | Wendungen und eine Killerphrase nahe am Wortlaut von Kap. 16.1, S. 367 | eigene Wendungen; im Beispiel zuerst sagen, was stimmt | öffentliches Repo; in dieser Einheit ist `beispiel` überschrieben, `fehler` und `merk` stehen weiter im Heft |
| `src/data/methoden/lm-17-2-w-fragen.json` · `seiten` | «S. 381–392» | «S. 386» (oder der Abschnitt, den die Karte meint) | Heft A S. 1 nennt S. 386; Gegenleser fand zwei Angaben |
| `src/data/methoden/hko-quelle-raster.json` | «sehen, hören oder lesen», «Zeitmarke» auch in der Fassung ohne Medien | je Fassung eigener Wortlaut | zwei Gegenleser |
| Renderer Auftragsbogen | Tabellenkopf «Zahlen | Betrag»; «Ende Ziel … · Probelauf» | «Angabe | Wert»; Zeile nur bei gesprochenen Produkten | Bogen-Leser, beide Runden |
| Renderer Heft S. 7 | ein Schreibfeld | zweites Feld, wenn `abgaben` eine Liste nennt | Heft A, alle Leser |

## 7. Braucht einen Entscheid

1. **Fehlende Slots** (A Vertiefung 2, B Ersatz, B Vertiefung 2): nicht gefüllt. Ich habe keine neue Quelle gesucht und geprüft; ein neuer Slot bräuchte Karte, Archivtext, Lösung und Platz auf S. 4 bzw. in den Lösungen (S. 3 hat 8.7 px Reserve). Variante a: so lassen — je Heft eine Vertiefung, Heft B fällt bei Ausfall auf die Fassung ohne Medien zurück (Empfehlung). Variante b: für B einen Ersatz nachrecherchieren, in dem jemand ausdrücklich für oder gegen persönlichen Verzicht spricht; das würde auch die schwächste Stelle (LF4 mit Medien) stützen.
2. **Spaltenkopf «Zeit / wer spricht»** in Heft B mit Medien weicht vom Bauplan §7 ab. Variante a: so lassen (Empfehlung). Variante b: zurück auf «Wer spricht».
3. **Beispiel S. 6 in Heft A** aus demselben Kapitel wie der Auftrag (Permafrost). Variante a: lassen (Empfehlung; das Beispiel zeigt die Form am gleichen Stoff). Variante b: Fall ausserhalb von Kap. 9.1.

## 8. Nicht geprüft

- Bild und Ton aller vier Videos; alle Sprecherzuordnungen; die Sekunden 15:10 und 18:51.
- Die zwei Behauptungen bei 16:07–16:19 und 16:42–16:49 in der Sache.
- Das Resultat an der Seite der Bundeskanzlei (nur UVEK).
- Die Ersatzquelle von Heft A und beide Vertiefungen wurden von keinem Lernenden-Gegenleser bearbeitet; die Lösungen von Heft A in dieser Runde nicht auditiert (unverändert seit dem Audit des Laufs, bis auf «Ins Produkt»).
- Die Lösungsänderungen nach dem Audit von Heft B.
- QR-Seite, Seitenbild, Word-Dokumente, `npm run build`.
- Inhalt der Methodenkarten gegen ihre Kapitel (ausser 16.1 S. 366 und 17.3 S. 394 durch das Audit).
- Verkehr als Fallthema bleibt ausgespart (Bauplan).
