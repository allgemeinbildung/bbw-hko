# Nachtrag — 4.1.1_wohlbefinden_staerken (Abschlussrunde vom 2026-10-05)

Grundlage: `BERICHT.md` dieses Laufs, Abschnitte 7–10. Geändert wurden nur
`src/data/einheiten/4.1.1_wohlbefinden_staerken/` (Heft A, Heft B, Set,
Begleiter) und die acht Karten `q-411a-*` / `q-411b-*`. `kn.json` und
`prinzip.json` sind unverändert. Kein Lehrmittel-, Untertitel- oder Artikeltext
in dieser Datei.

**Tor nach der letzten Änderung:** `check-all` GRUEN — keine Fehler.
`export-v42` + `messen-v42`: Exit 0, 56 Seiten ok, kein Überlauf (`messung.txt`
in diesem Ordner; kleinste Reserve ausser den vollen Seiten: Lösungen Heft B mit
Medien S. 3, 8.7 px — unverändert).

## 1. Heikles Thema (Aussehen, Selbstbild) — geprüft am Volltext

Gelesen: alle Archivtexte von Heft A ganz (Quelle, Ersatzquelle, Vertiefung 1,
Untertitel von Vertiefung 2 von 00:00 bis zum Ende).

| Material | Was ausserhalb des Ausschnitts steht | Urteil |
|---|---|---|
| Quelle `q-411a-pflicht` (Interview) | fünfte Frage: Tipps für Eltern und Lehrpersonen | unbedenklich; im Ausschnitt nennt Antwort 2 Schlanksein und Muskeln als Ideale, sonst nichts Körperliches |
| Vertiefung 1 `q-411a-vertiefung-1` | Abschnitt «Der Vergleich mit ‹unechten› Menschen»: Folgen für die psychische Gesundheit, **ein Satz** mit Essstörungen, Schönheitsoperationen, Fitnesswahn, dazu Studienzahlen | zumutbar; kein Erfahrungsbericht, keine Anleitung. Lernende sehen es beim Öffnen |
| Vertiefung 2 `q-411a-vertiefung-2` (Video) | vor 05:05: einzeln aufgezählte Körperideale (auch ein «Trend» zu dünnen Beinen), Zahlen zu Eingriffen, **Erfahrungsbericht einer Frau mit Essstörung** (Beginn im Kindesalter, wie sie herausfand) | für die meisten 16- bis 20-Jährigen zumutbar (öffentliches Fernsehen, von 14-/15-Jährigen gedreht); für Betroffene kann es zu nah sein. **Braucht Entscheid, siehe §6** |
| Heft B, Vertiefung 1 | Kasten am Schluss: Klinikeintritte, IV-Zahlen | unbedenklich; kein Suizid, keine Selbstverletzung auf der Seite (am 05.10.2026 nachgelesen) |

- **Verlangt eine Aufgabe Persönliches über den eigenen Körper? Nein.** Alle neun
  Gegenleser (zwei Runden) bestätigen: nirgends ist eine Angabe über sich
  verlangt; «Person im Fall» steht auf S. 2 beider Hefte, in Schritt 05 von
  Heft A und auf A1. Es bleibt ein **Sog**, kein Zwang: die feste Persona-Zeile
  («eigener Lehrbetrieb, eigener Wohnort») und die Ich-Form der Kompetenz —
  beides Gerüst (Skill/Renderer), nicht geändert.
- **Begleiter:** Der Block «Wenn es persönlich wird» (Kap. 0, Punkt 4) nannte die
  Teile ausserhalb nur als «Erkrankungen und Eingriffe». **Behoben:** Er sagt
  jetzt je Vertiefung, was genau kommt (Satz mit Essstörungen und Operationen;
  im Film Körperideale, Eingriffszahlen, Erfahrungsbericht), und verlangt, den
  ganzen Film zu sehen, bevor Vertiefung 2 freigegeben wird. Der Block ist
  nummerierte Prosa, kein `warnung`-Callout — das Skelett hat dafür keinen Ort
  (BERICHT §10); die `warnung`-Callouts stehen bei den Stolpersteinen und bei
  «Wenn ein Link nicht geht».
- **Karte `hko-stille-aushalten` (Heft A, S. 6):** Der BERICHT ging davon aus,
  der Impuls zum Fall stehe im «Damit tun Sie». **Das stimmte nicht:** Der
  Renderer druckt `tun` nur bei Lehrmittel-Karten (`DocS.tsx`, Zweig
  `m.quelle === 'lehrmittel'`); gedruckt wurde allein das Kartenbeispiel mit dem
  Impuls zum ersten Arbeitstag des Gegenübers. **Behoben** über ein eigenes
  `beispiel` in `methoden[]` von Heft A: Der Impuls fragt jetzt, warum die
  Person im Fall das Bild gelöscht hat. (Der Datenvertrag §11.3 sagt, die Skill
  schreibe `methoden[].beispiel` im Kern nicht; Typ, Loader und `check-v42`
  lassen es zu, der Auftrag dieser Runde erlaubt es ausdrücklich.)
- **Karte `hko-befund-kachel` (Heft B, S. 6):** **Behoben** über ein eigenes
  `beispiel`: erfundene Klassenumfrage (15 von 20 = 75 %, Balken 30 mm bei 2 mm
  je Person) statt «eigenes Foto der gesammelten Becher» und der Rechnung, die
  nicht aufging. `fuer` sagt neu «Aussage und Einordnung in einem Satz; Zahl =
  Anteil, Bild = Ihr Balken; kein Foto». Die festen Schritte der Karte («eigene
  Zahl», «eigenes Bild») werden weiter gedruckt → Vorschlag §7.

## 2. Befunde aus BERICHT §7 «Offen nach drei Runden»

| Befund | Stand | Was |
|---|---|---|
| Heft A S. 5, Schritt 03: «Beleg» meint Zeile und Spalte | **behoben** | Hint neu: zwei Wirkungen, «Hinter jede: woher sie stammt – Fundstelle (1. Rasterspalte) und Begriff». Beispielbild S. 6: «Beleg: S. 40, Abs. 2 (Fundstelle aus dem Raster)» statt «Raster, Zeile 3 …» |
| Heft A S. 5/6: Karte 4 mit Beispiel «erster Arbeitstag» | **behoben** | siehe §1 |
| Heft A S. 3 ohne Medien: Brücke zum Fall leisten die Lernenden | **stehen gelassen, gestützt** | Das Lehrmittel sagt nichts zum Selbstbild (Bauplan; Medieneinfluss nicht belegt). Satzanfang neu: «Für den Fall leite ich ab: Die Regel wirkt, weil …». Gegenleser Runde 1 löst die Seite ohne Rückfrage |
| Heft A S. 3 mit Medien: «Antwort 1–4» eindeutig? | **behoben** | Website am 05.10.2026: fünf Fragen, dazwischen ein gross gesetztes Zitat und zwei Bildlegenden. Auftrag neu «(bis vor die Empfehlungen)»; Stütze 1 neu: «Der gross gesetzte Satz dazwischen ist nur ein Zitat». Karte: Ausschnitt «erste vier Fragen mit Antworten» statt «Abs. 6–16 …» |
| Heft A S. 4: «Lesen Sie: Abs. 1–5, 11 und 18–20» (Website ohne Nummern) | **behoben** (neu gefunden) | Karte `q-411a-vertiefung-1`: «ohne den Abschnitt «Der Vergleich …»» — das ist zugleich der heikle Abschnitt |
| Heft B S. 5, Schritt 04: wo festgehalten, ob es die zwei Massnahmen sind | **behoben** | 04: «Haltung wählen. S. 7 unten, 2 Sätze in Ich-Form: Antwort auf den Einwand, Verzicht. Dazu 2 Zeilen der Umfrage wählen (für Schritt 05)». 05: «je gewählte Zeile eine Massnahme …». Beispielbild: Massnahme 1 belegt neu mit **einer** Zeile (vorher zwei → drei Zeilen für zwei Massnahmen) |
| Heft B: «Einwand» gegen «Antwort auf den Einwand» | **behoben** | Schritt 04, «Ins Produkt» (S. 4), Abgabe und Checkliste sagen jetzt dasselbe |
| Heft B S. 3 mit Medien: Absatznummern, die das PDF nicht zeigt; «erster Absatz» zweideutig | **behoben** | Stütze 1 ohne Nummern; Satzanfang «(PDF S. 16 bzw. G14)»; Karte: «PDF-S. 16–17: 2 Absätze, Fussnote 1, G14» |
| Heft B S. 3: Sitzdauer hat keine Zeile der Umfrage | **teilweise** | Stütze sagt es jetzt («Sitzen fehlt in der Umfrage, taugt aber als Beleg»). Gegenleser Runde 2: «wofür, muss ich selbst herleiten» — stört, hindert nicht. Die Quelle trägt nur Bewegung und Sitzen (Bauplan, Zugeständnis) |
| Heft B S. 4: Verweis Kap. 18.4 gehört zu Schritt 05 | **behoben** | aus «Ins Produkt» von LF4 entfernt, steht in Schritt 05 |
| Heft B S. 6: Kachel «eigenes Foto», falsche Rechnung | **behoben** | siehe §1 |
| Heft B S. 6: «Wert: 240» ohne Einheit | **behoben** | «Wert: 240 Ausleihen (erfunden)» |
| Heft B S. 4: «Lesen Sie: Abs. 18–24 und 33–42» | **behoben** (neu gefunden) | Karte `q-411b-vertiefung-1`: «nach den Bildern bis und mit Tipp-Liste»; Wortzahl neu 360 (die Elternliste dazwischen zählt jetzt mit) |
| Beide Hefte S. 5 gegen S. 8: «Das geben Sie ab» gegen Checkliste | **stehen gelassen** | Gerüst aller v4.2-Hefte: S. 5 nennt das Produkt, S. 8 das ganze Heft. Ein Gegenleser (B ohne Medien) nennt es hinderlich beim Abgeben. Der Begleiter sagt der Lehrperson jetzt bei S. 5 beider Hefte, dass sie ansagen muss, was eingesammelt wird |
| Beide Hefte S. 8: «gilt auch bei …» unerklärt | **stehen gelassen** | fester Text des Renderers; ein Gegenleser (A mit Medien, Runde 1) nennt es hinderlich. Begleiter sagt neu, was die Lehrperson dazu ansagt → Vorschlag §7 |
| «So starten Sie» verspricht Quer-Check der eigenen Markierungen | **stehen gelassen** | fester Text → Vorschlag §7 |
| Auftragsbogen A3: Stationen 2 und 3 setzen eine geänderte Regel voraus; Einwand ohne Feld | **behoben** | Stationen neu: 1 Was ich an der Idee gut finde · 2 Mein Entscheid – und die Regel, an der er hängt · 3 Ein Einwand aus der Gruppe – und meine Antwort · 4 Was ich zusage oder absage und was ich mir wünsche. Schritt 03 ohne «eine zum Ändern markieren»; Schritt 04: «Regel markieren, an der es hängt»; Schritt 05 nennt Beleg (Station 2) und Einwand (Station 3). Erwartungshorizont, Indikator «Argumentation» und Begleiter Kap. 6 nachgezogen. Runde 2: alle drei Wege (ganz mitmachen, eigene Regel, absagen) füllen alle vier Stationen |
| Auftragsbogen A4, Identitätskonstrukt: kein Schritt verlangt das Bild von sich | **behoben** | Schritt 03: «Regel 3 auch: Wirkung auf das Bild von sich». Rest: Stufe 3 («neue Situation») verlangt weiterhin kein Schritt des Bogens — Wortlaut des KN, bleibt |
| Auftragsbogen: «Wirkung (02)» unklar (Runde 1) | **behoben** | «Folge für die Gesundheit (02)»; Indikator Fachkorrektheit angepasst |
| Mehrere Deutungen nur in den Lösungen gekennzeichnet | **stehen gelassen** | Die Aufgaben verlangen überall Begründung («vermutlich», «weil», «leite ich ab»); die Kennzeichnung in Lösung und Begleiter sorgt dafür, dass andere begründete Zuordnungen gelten |
| Medieneinfluss im Lehrmittel nicht belegt | **geprüft, in Ordnung** | Heft A ohne Medien macht keine Aussage dazu; Begleiter Kap. 0 sagt es |
| Vergleich Umfrage ↔ Erhebung des Bundes misst nicht dasselbe | **geprüft, in Ordnung** | Heft (Satzanfang), Lösung (Befund, «Ableitung») und Begleiter (Stolperstein) sagen es |

Nicht bearbeitet (Entscheid 05.10.2026): alles, was nur Profil b betrifft.

## 3. Geprüfte Fakten und Links (Abruf 2026-10-05)

| Was | Ergebnis | Quelle |
|---|---|---|
| `q-411b-pflicht`: wer gibt heraus | **Bundesamt für Statistik (BFS)**, «Schweizerische Gesundheitsbefragung 2022. Übersicht», Neuchâtel 2023, BFS-Nummer 213-2201 (Impressum PDF-S. 2). `dam-api.bfs.admin.ch` ist die Dateiablage des BFS. Die Karte stimmt; mit der BFU hat die Quelle nichts zu tun | PDF, HTTP 200, 28 Seiten |
| Zahlen Heft B mit Medien / Lösung | 76 % aktiv, 8 % inaktiv; unter 25: 81 % und 5 %; G14 Reihe 15–24: 21,5 + 22,5 = 44; 65–74: 3,4 + 5,8 = 9,2; Fussnote 1: 150 bzw. 75 Minuten — **alle stimmen**. Die gedruckten Seitenzahlen 16/17 sind zugleich die PDF-Seiten | PDF S. 16–17, mit `pdftotext` nachgelesen |
| Bewegungsempfehlung | 150/75 Minuten pro Woche gelten für **Erwachsene** (18–64: 150–300 bzw. 75–150 Min.); für 5- bis 17-Jährige: im Schnitt mindestens 60 Minuten pro Tag. **Neu** in Lösung LF3 («Nicht in der Quelle: …») und im Begleiter (Stolperstein «Ungleiche Fragen») | hepa.admin.ch / BASPO, «Bewegungsempfehlungen Schweiz», Dezember 2023 (über Websuche; die Seite selbst nicht einzeln abgerufen) |
| `q-411a-pflicht` | HTTP 200, ohne Login; fünf Fragen, Zitat, zwei Legenden; Datum 05.12.2025 | srf.ch |
| `q-411a-pflicht-ersatz` | HTTP 200; über 1100 Befragte, 12–19 Jahre, Erhebung April–Juni 2024; Aussagen der Lösung zu Selbstwert und Alter stimmen | swisscom.ch |
| `q-411a-vertiefung-1` | HTTP 200; Zwischentitel und Lage des heiklen Abschnitts wie im Archiv. Die sichtbare Überschrift der Seite weicht vom Kartentitel ab (dieser ist der Titel im Browser-Tab) — im Begleiter vermerkt | srf.ch |
| `q-411b-pflicht-ersatz` | HTTP 200; 11 %, Halbierung seit 2020, 69 %, 41 %, «fast die Hälfte der 18- bis 35-Jährigen», Krankenkasse, 4.–25. Juni, rund 2800 — stimmen | srf.ch |
| `q-411b-vertiefung-1` | HTTP 200; Liste mit sieben Tipps samt Beratungsangebot; Kasten am Schluss wie beschrieben | srf.ch |
| beide Videos | Play-Adressen HTTP 200; SRG-API: Segmente vorhanden, nicht gesperrt; Segment A2 dauert 371 s (endet bei 06:11 — der Beitrag ist kurz nach dem Ausschnitt zu Ende), Segment B2 127 s | il.srgssr.ch |
| Lehrmittel Kap. 18.2, S. 413–414 | Absatzzählung an der Kapiteldatei nachgezählt: S. 413 Abs. 2, 4, 5, 6 und S. 414 Abs. 2, 3, 4, 5 stimmen mit Beispielzeile und Lösung überein. Die Randtitel stehen in der Datei **nach** ihrem Absatz; am Buch nachzählen | Kapiteldatei |
| Lehrmittel Kap. 18.4, S. 421 | «kleine, konkrete Teilziele» steht dort, als Lerntipp; die Übertragung ist im Begleiter als solche benannt | Kapiteldatei |
| Rechnungen Heft B | 65/40/55/60 %, Balken 26/16/22/24 mm; Beispielbild 30/25/70/45 %, «fast doppelt» (9 gegen 5), acht Häkchen; Kachel 75 %, 30 mm — stimmen | Audit Runde 1 |

Alle acht Karten tragen `sachlage_geprueft: 2026-10-05`. Kein Link war tot.
`q-411a-vertiefung-2`: der Karten-Link trägt neu `&startTime=305`.

## 4. Gegenleser

**Runde 1** (nach den Korrekturen; Sonnet, gleichzeitig): Lernende/r Profil a an
Heft A ohne, Heft A mit, Heft B ohne, Heft B mit (je ganzes Heft mit
Lehrmittelseiten bzw. Quellentext), Bogen-Leser (Bogen plus S. 2, 4, 8 beider
Hefte), Lösungs-Audit (Spur mit Medien beider Hefte, Rechnungen, Auftrag,
Begleiter gegen Daten) mit Sweep. Rolle: 2. Lehrjahr, 17 Jahre. Kein Profil b.

| Gegenleser | übernommen | nicht übernommen |
|---|---|---|
| A ohne Medien | Beleg-Form Schritt 03 gegen Beispielbild | Absatzzählung S. 413 (kommt richtig heraus; am Buch prüfen); S. 7 ein leeres Feld (R); Schritt 01 ohne Abgabe (V) |
| A mit Medien | wie oben | «gilt auch bei …» (R, **hindert** laut Leser/in); Rubrik 2 ohne Namen auf S. 5; Rollen im Gespräch |
| B ohne Medien | Beispielbild: drei Zeilen für zwei Massnahmen; «Zeichen: S. 6» → «Kreise: S. 6»; Kachel-Zeile | Abgabe gegen Checkliste (**hindert** laut Leser/in; Gerüst, Begleiter ergänzt); Merksatz «Gestaltungsregeln» (S, im `tun` aufgelöst) |
| B mit Medien | Stütze zur Sitzdauer umformuliert | Quelle trägt nur Bewegung und Sitzen (Q) |
| Auftragsbogen | «Wirkung (02)» → «Folge für die Gesundheit (02)»; Station 4 «zusage oder absage»; Schritt 05 nennt den Einwand; Schritt 04 «Ich-Satz» | «nur Vorarbeit» bei 01/02 (V); «vor zwei Personen» gegen «vor der Gruppe» (V: Fall gegen Zimmer); «Ende Ziel …» (R) |
| Audit | wörtliches Zitat in Lösung A richtiggestellt («so muss ich aussehen»); Empfehlung als «nicht in der Quelle» gekennzeichnet; Beispiel im Erwartungshorizont des Auftrags belegt jetzt aus dem Randkommentar | «Niemand hat etwas verlangt» etwas absolut (LP-Text, Freundin steht im Fall); Antwort 4 gilt in der Quelle «eher» für Mädchen (Lösung nennt die Zeile ohne diese Einschränkung — siehe §8) |
| Sweep | — | kein Regelverstoss; «S. xx» nur im erfundenen Kartenbeispiel von Heft B ohne Medien |

Kein Befund fiel als Artefakt weg ausser den Markierungszeichen (im Text nicht
sichtbar, im Paket angesagt).

**Runde 2** (nur gelesen, danach nichts mehr geändert): Heft A mit Medien S. 3,
5–7; Heft B mit Medien S. 3–7; Auftragsbogen ganz, Stationen auf allen drei
Wegen. **Alle drei: «Nichts hindert am Arbeiten.»**

Offen nach Runde 2 (stört, hindert nicht):

- Heft A: «Beleg» heisst in Schritt 03 die Fundstelle, in der Rasterspalte
  «Beleg / Beispiel» und auf der Rasterkarte das Zitat. Das Beispielbild zeigt
  die Erkenntnis als ganzen Satz (verlangt: Stichworte), und sein Entscheid nennt
  weder Wert noch Preis. «Plus» steht ohne «freiwillig».
- Heft B: Die Kachel-Zeile sagt «Aussage und Einordnung in einem Satz», das
  Kartenbeispiel zeigt sie als zwei Zeilen. «Kreise: S. 6» sagt nicht, was mit
  den Kreisen zu tun ist (die Legende des Beispielbilds zeigt es im Druck; im
  Textauszug nicht sichtbar). Abgabe sagt «Begründung und Beleg», das
  Beispielbild zeigt nur ein «Weil …». Wofür der Sitzwert dient, bleibt
  Herleitung.
- Auftragsbogen: wie markiert wird und wo die eigene Regel steht; bei «ganz
  mitmachen» wirkt «die Regel, an der er hängt» gesucht; Stufe 3 des Kriteriums
  Identitätskonstrukt («neue Situation») und «Wert, der dahintersteht» verlangt
  kein Schritt des Bogens.
- Beide Hefte: S. 7 ist ein einziges Schreibfeld; Rubriken bzw. «oben, Mitte,
  unten» legen die Lernenden selbst an (so gewollt, das Beispielbild zeigt die
  Form).

Zeitsummen Runde 1 (Schätzungen): A ohne ca. 85 Min., A mit ca. 115–127 Min.,
B ohne ca. 94 Min., B mit ca. 115–135 Min. Seitenplan: 135 Minuten.

## 5. Gegenhör-Liste für Pietro (ein Durchgang)

### Video A2 — `q-411a-vertiefung-2`, «Schönheitsideale auf Social Media», SRF 10 vor 10, 09.05.2024

Adresse: `https://www.srf.ch/play/embed?urn=urn:srf:video:9b4eb9ec-a925-4ee7-88e6-451e6af4acff&subdivisions=false&startTime=305`
(auf der QR-Seite `bbw-hko.ch/m/4.1.1_wohlbefinden_staerken#a` als Player
eingebettet). Zeitmarken = Zeit im Beitrag (Sendungszeit minus 18:46).

- [ ] **Start:** Setzt der Player bei **05:05 des Beitrags** ein? Möglich wäre
      auch der Anfang des Beitrags oder 05:05 der ganzen Sendung (dann läuft ein
      anderer Beitrag). An der API liess sich das nicht klären.
- [ ] **Ganzen Beitrag 00:00–05:05 einmal ansehen** (Körperideale einzeln,
      Eingriffszahlen ab ca. 02:51, Erfahrungsbericht Essstörung ca. 03:39–04:52)
      und entscheiden, ob Vertiefung 2 bleibt (§6).
- [ ] 05:05–05:11 — Reporterinnen fragen, wie Jugendliche mit Idealen umgehen
      sollen. Hängt daran: Leitfrage der Vertiefung (Heft A S. 4).
- [ ] 05:13–05:21 — **Medienpsychologin** (erschlossen): gut überlegen, welchen
      Konten man folgt; man bestimmt mit, was man täglich sieht. → Ratschlag 1
      in `erwartung` und Begleiter.
- [ ] 05:24–05:33 — **Reporterin** gibt den Rat wieder (erschlossen aus der
      indirekten Rede): ein Teil wird vom System bestimmt, darum Bilder
      hinterfragen. → Ratschlag 2. Prüfen: wer spricht.
- [ ] 05:33–05:47 — wieder die Fachperson (erschlossen): Bilder sind ein
      Ausschnitt und oft bearbeitet; der Vergleich lohnt sich nicht. →
      Ratschlag 3.
- [ ] 05:47–06:10 — Schlusswort der Reporterinnen. Der Beitrag endet bei 06:11;
      ob der Player danach in den nächsten Beitrag der Sendung weiterläuft.

### Video B2 — `q-411b-vertiefung-2`, «Puls kompakt: Vier Tipps für einen besseren Schlaf», SRF Puls, 28.03.2022

Adresse: `https://www.srf.ch/play/embed?urn=urn:srf:video:0df89419-b7ba-4cf7-b776-92e2b1e5be57&subdivisions=false`
(QR-Seite, Anker `#b`). Ganzer Beitrag, 02:07. Wer spricht: aus den Untertiteln
nicht ersichtlich (vermutlich Sprecherin oder Sprecher aus dem Off).

- [ ] Startet der Player am Anfang **des Beitrags** (nicht der Sendung)?
- [ ] 00:05 — Einleitung. Die **Titel der vier Tipps stehen nur im Bild**: je
      Tipp den eingeblendeten Titel lesen und mit der Erwartung vergleichen.
- [ ] 00:16–00:36 — Tipp 1: Ritual in der Stunde vor dem Zubettgehen.
- [ ] 00:47–01:08 — Tipp 2: gleiche Zeiten für Zubettgehen und Aufstehen, auch
      am Wochenende (dazu: kein langes Nickerchen am Tag).
- [ ] 01:18–01:35 — Tipp 3: nach längerem Wachliegen aufstehen.
- [ ] 01:44–02:03 — Tipp 4: Tageslicht am Morgen, Bewegung draussen.
      Hängt an allen vier: Leitfrage der Vertiefung (Heft B S. 4), `erwartung`
      und Erwartungshorizont im Begleiter; die Fallüberlegung «feste Zeit an
      Arbeitstagen».

### Gegensehen (kein Ton)

- [ ] **Quelle B (PDF)** auf einem Handy: öffnet es auf Seite 16; ist G14 lesbar.
- [ ] **Quelle A** auf einem Handy: sind die vier Fragen und das Zitat so
      abgesetzt wie am 05.10.2026.
- [ ] **Vertiefung A1:** wie nah der Abschnitt «Der Vergleich …» am Rest steht;
      ob der Kasten «Das perfekte Gesicht» zugeklappt ist.
- [ ] **Buch Kap. 18.2, S. 413–414:** Absatzzählung (Beispielzeile «S. 413,
      Abs. 4»; Lösung S. 413 Abs. 2, 4, 5, 6; S. 414 Abs. 2, 3, 4, 5).
- [ ] **Seitenangaben der vier Lehrmittel-Karten** (Kap. 19.2 S. 427–429;
      17.2 S. 381–382; 17.3 S. 394–395; 16.3 S. 369–370) am Buch.
- [ ] **Seitenbild** S. 6 beider Hefte (neue Kartenbeispiele; gemessen ohne
      Überlauf) und A3 des Auftragsbogens.

## 6. Braucht Entscheid von Pietro

**Vertiefung 2 von Heft A (Video mit heiklem Vorlauf).** Text unverändert
gelassen; nur der Begleiter warnt jetzt genauer.

- **Variante 1 — behalten:** Der Ausschnitt (drei Ratschläge) ist gut und
  unbedenklich; die QR-Seite gibt die Startzeit mit; die Lehrperson entscheidet
  nach dem Begleiter. Risiko: Wer zurückspult oder wessen Player vorn beginnt,
  sieht den Erfahrungsbericht ohne Begleitung.
- **Variante 2 — streichen bzw. ersetzen:** Vertiefung 2 entfällt (Kasten S. 4
  mit einer Karte — ob das Layout das trägt, ist nicht geprüft) oder wird durch
  eine Quelle ohne heiklen Vorlauf ersetzt (Quellentausch, Phase Q).
- **Empfehlung:** Variante 1, **wenn** der Player beim Gegenhören zuverlässig
  bei 05:05 einsetzt; sonst Variante 2. Vertiefung 1 (ein Satz) kann bleiben.

## 7. Vorschläge für geteilte Dateien (nicht geändert)

1. `src/data/methoden/hko-befund-kachel.json` · `beispiel` —
   alt: «An zwei von drei Tagen kaufte ich unterwegs etwas zu trinken.» / «5 von
   8 Getränken in Einwegbechern» / «eigenes Foto der gesammelten Becher» / «rund
   230 Becher» ·
   neu: ein Beispiel, das aufgeht und kein eigenes Foto verlangt, z. B. das in
   Heft B gesetzte (15 von 20 = 75 %; Balken; Vergleich mit einer zweiten Zahl).
   Beleg: zwei von drei Tagen, 5 von 8 und 230 pro Jahr passen nicht zusammen;
   «eigenes Foto» lädt bei heiklen Themen zur Selbstauskunft ein. Dazu
   `schritte[1]`/`[2]`: «Eine eigene Zahl» → «Eine Zahl»; «Ein eigenes Bild, das
   die Zahl zeigt — kein Symbolfoto» → «Ein Bild, das die Zahl zeigt (Balken,
   Skizze) — kein Symbolfoto».
2. `src/data/methoden/hko-stille-aushalten.json` · `beispiel[0]` und `[2]` —
   alt: «Impuls: «Erzähl mir von deinem ersten Arbeitstag.»» / ««Also …
   eigentlich war der ziemlich seltsam.»» · neu: ein Impuls zu einer Sache statt
   zur Person, z. B. «Impuls: «Erzähl, wie du den Text verstanden hast.»» /
   ««Also … eigentlich geht es um zwei Dinge.»». Beleg: Die Karte lädt zum
   Erzählen von sich ein; in 4.1.1 musste sie überschrieben werden.
3. `src/components/einheiten/docs/DocS.tsx` (und der Word-Zweig) · Methodenkarte,
   Zweig «nicht im Lehrmittel» — `tun` wird dort nicht gedruckt. Entweder
   drucken («Damit tun Sie», wie bei Lehrmittel-Karten) oder im Datenvertrag
   Zeile 147 und in `docs/methodenkartei.md` festhalten, dass `tun` bei
   `hko-`Karten wirkungslos ist und die Übertragung über `fuer` bzw. `beispiel`
   läuft. Beleg: Im Lauf vom 04.10. galt der Impuls zum Fall als gedruckt; er
   war es nicht.
4. `.claude/skills/bbw-hko-heft-v42/references/datenvertrag.md` §11.3 ·
   alt: «`methoden[].beispiel` im Kern … `beispiel` nur in
   `methoden_ref_rezeption`» · neu: Ausnahme zulassen, wenn das Kartenbeispiel
   Persönliches verlangt oder sachlich nicht passt (wie `docs/methodenkartei.md`
   sie schon vorsieht).
5. `src/components/einheiten/docs/heft-v42/seiten-5-8.tsx` · Auftrag über dem
   Begriffsnetz — alt: «… eine davon zum Feld «gilt auch bei …».» · neu: «… eine
   davon zum Feld «gilt auch bei …»: Notieren Sie dort eine andere Situation, in
   der dasselbe gilt.» Beleg: in zwei Läufen als unerklärt gemeldet, hier von
   einem Gegenleser als hinderlich.
6. `seiten-1-4.tsx` · «So starten Sie» — alt: «… am Ende des Hefts prüfen Sie es
   im Quer-Check (S. 8).» · neu: «… am Ende des Hefts halten Sie fest, was noch
   unklar ist (S. 8).» Beleg: Der Quer-Check fragt nach dem Produkt, nicht nach
   den Markierungen.
7. `src/pages/m/[setKey].astro` · `embedSrc` — prüfen, ob `startTime` bei einer
   Segment-URN ab Segmentbeginn oder ab Sendungsbeginn zählt; je nach Befund
   `markIn` des Segments addieren. Beleg: betrifft jede Video-/Audio-Karte mit
   `verortung.von` > 0 und Segment-URN.
8. `references/phase-q-quellen.md` / Bauplan-Vorlage · `verortung.absaetze` für
   Websites: in Worten, die auf der Seite auffindbar sind (Zwischentitel, «erste
   vier Fragen»), nicht als Absatznummern des Archivs. Beleg: drei Karten dieser
   Einheit.

## 8. Nicht geprüft

- Bild und Ton beider Videos; wo der Player einsetzt; Verhalten nach Ende des
  Ausschnitts.
- PDF und QR-Seite auf einem Handy; Workbench im Browser; Aussehen in Word.
- Seitenbild (nur Überlauf gemessen): ob die längeren Kartenbeispiele auf S. 6
  und die neuen Stationstitel auf A3 gut aussehen.
- Absatzzählung und Seitenangaben am gedruckten Buch.
- Die Seite hepa.admin.ch selbst (Abruf scheiterte an einer alten Adresse; die
  Zahlen stammen aus der Websuche über hepa.admin.ch/BASPO).
- Lösungen der Spur **ohne Medien** wurden in dieser Runde nicht neu auditiert
  (unverändert seit dem Audit vom 04.10.).
- Lösung Heft A mit Medien, Rasterzeile zu Antwort 4: Die Quelle sagt den
  Aufwärtsvergleich «eher» für Mädchen aus; die Lösung nennt ihn allgemein. Der
  Begleiter hält den Geschlechtervergleich als «laut Befragung» fest; die
  Lösungszeile selbst ist nicht nachgeschärft.
- Kachel-`fuer` in Heft B hat 106 Zeichen; ein Budget dafür prüft kein Skript,
  die Messung zeigt keinen Überlauf.
