# Bericht — 5.2.1_gesetze_veraendern (bbw-hko-heft-v42, Abschluss vor der Freigabe, lokal)

Lauf vom 2026-10-06. Die Einheit lag seit dem 05.10.2026 uncommittet im
Arbeitsbaum: sechs Dateien, acht Karten, Bauplan
`docs/cloud-run/bauplaene/5.2.1_gesetze_veraendern.md` (freigegeben am
2026-10-04), `check-all` grün — aber ohne Laufordner, ohne Messung, ohne
belegtes Gegenlesen. Dieser Lauf hat das nachgeholt: Bestand gegen den Bauplan,
Tor mit Export und Messung, Gegenleser in drei Runden, Lösungs-Audits mit
Untertiteln in voller Auflösung, ein Fakten-Audit an Primärquellen.
Ergebnis: **grün**. Kein Entscheid des Bauplans ist geändert. Status bleibt
`"entwurf"` bis zur Freigabe.

## 1. Einheit

| | |
|---|---|
| Ordner | `src/data/einheiten/5.2.1_gesetze_veraendern/` (sechs Dateien) |
| Lehrgang | EFZ_3J (kanonisch, 2. Lehrjahr) · `lehrgaenge`: EFZ_3J, EFZ_4J (dort 3. Lehrjahr; 5.2.1 und 5.2.2 nummern- und textgleich, `sync-einheiten-nrlp` ohne Befund) |
| Heft A | 5.2.1 · «Durchgreifen – und wer kontrolliert das?» · gemeinsam geführtes Online-Dokument zu zweit (Rechtsstaat-Check mit Gegenbild, Urteil, Kommentaren und Antworten) · Spuren `ohne_medien`, `mit_medien` |
| Heft B | 5.2.2 · «Vom Ärger zum Anliegen – und wie es Gesetz wird» · Kurzvortrag von drei Minuten mit Präsentationskarte und Wegskizze · Spuren `ohne_medien`, `mit_medien` |
| Auftrag | «Neue Vereinsordnung – was schreibe ich dem Vorstand?» · Auswertung des Entwurfs (`flaeche`) und schriftliche Stellungnahme mit Änderungsantrag (`flaeche`) · Lebensbereich Verein und Freizeit |
| KN | «Acht Franken pro Tag – wer darf das beschliessen?» · Berufsfachschule (Kanton als Träger) |
| Status | `"entwurf"` |
| Neue Methodenkarten | keine |
| Quellenkarten | `q-521a-*` (4), `q-521b-*` (4) — aus Phase Q; in diesem Lauf geändert: vier Kurztexte, ein Datum (Abschnitt 6) |

## 2. Tor (letzte Ausgaben, nach der letzten Änderung)

- `npm run build:einheiten-index`: 27 Sets geschrieben. Die zwei Index-Dateien
  sind gegenüber dem letzten Commit unverändert (sie führten die Einheit schon).
- `begleiter-marker --check`: 272 Marker · 0 abweichend · 0 unauflösbar.
- `check-all 5.2.1_gesetze_veraendern`: **GRUEN — keine Fehler.** (Datei `check-all.txt`)
- `export-v42` + `messen-v42`: Exit 0, kein Überlauf in neun Dokumenten (Datei
  `messung.txt`). Reserve 0 px auf S. 1, 6, 7 der Hefte und A1–A3; S. 8 je
  Heft 6 px. Knappste Lösungsseiten: Heft A mit Medien S. 3 (8.7 px), Heft A
  ohne Medien S. 3 (11.3 px), Heft A S. 4 (5 px), Heft B S. 4 (16 px).
- `bestand-v42 --pruefen`: OK — 26 Dokumente unverändert.
- `npm run build`: Exit 0.
- `git status`: neu nur der Ordner der Einheit, die acht Karten `q-521*`, der
  Bauplan und dieser Laufordner. (`4.3.1_vielfalt_untersuchen` und fremde
  Karten liegen weiter uncommittet im Arbeitsbaum und sind nicht angefasst.)

**Was das Tor beim Start nicht zeigte.** `check-all` war grün, die Messung
aber rot: Heft B S. 8 lief in beiden Spuren um 19 px über, der Auftragsbogen
S. 1 um 20 px, die Lösungen mit Medien S. 3 um 124 px (A) und 178 px (B).
Behoben in den Daten: eine Checklistenzeile und drei Glossareinträge gekürzt
(Heft B), zwei Schritt-Hinweise gekürzt (Bogen), Erwartungshorizonte der
Vertiefungen und von LF4 gestrafft (Lösungen). Nach der ersten Korrekturrunde
meldete `check-lf-loesung` sechs Lösungstexte über 900 Zeichen; gekürzt.
Reparaturrunden am Tor: zwei (Überlauf; 900-Zeichen-Grenze).

## 3. Kapitel, Seiten, Quellen

Lehrmittel (alle Seiten am Marker der Kapiteldatei geprüft, 2026-10-05 und
erneut in den Lösungs-Audits vom 2026-10-06):

| Heft | Kapitel | Seiten | wofür |
|---|---|---|---|
| A | 3.1 Entwicklung der modernen Schweiz | 91 | LF1, LF2, LF4; Gegenbild in der Spur mit Medien |
| A | 1.3 Rechtsgrundlagen | 21–24 | LF1, LF2, LF4 (S. 23 trägt «vertretbar») |
| A | 6.2 Bundesstaat Schweiz | 162 | LF3 ohne Medien |
| A | 6.3 Gewaltenteilung | 167 | Verwaltungsgericht (Fallüberlegung) |
| A | 6.4 Referendum und Initiative | 168–169 | Plus-Aufgabe |
| B | 6.5 Entstehung eines Gesetzes | 171 | LF1, LF3 ohne Medien, LF4 |
| B | 6.4 Referendum und Initiative | 168–170 | LF1, LF4 |
| B | 6.2 Bundesstaat Schweiz | 159 | LF2; Beispiel S. 6 |
| B | 1.3 Rechtsgrundlagen | 22 | LF2 |
| Auftrag | 17.3 Argumentieren | 393–394 (3B-Schema: 394) | Stellungnahme |

Kapitel ausserhalb der Crosswalk-Zeile (Bauplan §2, §9): 6.2 und 3.1. Der
Crosswalk ist nicht nachgeführt (Skill nicht angefasst).

Quellen (alle acht mit Karte und Archivtext; Prüfdatum der Karten 2026-10-04,
Abrufbarkeit und Metadaten erneut geprüft am 2026-10-06):

| ID | Typ | Titel · Herausgeber · Datum | Ausschnitt | Zugeständnis |
|---|---|---|---|---|
| `q-521a-pflicht` | Video | «Notrecht – die Zahl der Kritiker wächst» · SRF Tagesschau · 2020-04-28 | 00:00–02:49 (ganzer Beitrag) | älterer Beitrag; Spalte «Bild» nur aus dem Ton erschlossen |
| `q-521a-pflicht-ersatz` | Video | «Abstimmung über Heiratsstrafe ist ungültig» · SRF Tagesschau · 2019-04-10 | 00:00–03:46 (Segment dauert 07:23) | Ausschnitt; andere kontrollierende Gewalt als in der Quelle; keine Zahl verwendbar |
| `q-521a-vertiefung-1` | Webseite | «Gewaltenteilung» · ch.ch · o. D. | Abs. 1–7, 213 Wörter | ohne Datum; lädt nur im Browser |
| `q-521a-vertiefung-2` | Webseite | «Rechtsstaat» · Beobachter, Rechtslexikon · 2017-08-07 | ein Absatz, 98 Wörter | dichte Fachsprache; Abo-Werbung unter dem Eintrag |
| `q-521b-pflicht` | Video | «Begehren für vier Wochen Vaterschaftsurlaub vom Tisch» · SRF Tagesschau · 2019-10-02 | 00:00–02:26 (ganzer Beitrag) | älterer Beitrag; Ausgang ausserhalb (Vertiefung 2) |
| `q-521b-pflicht-ersatz` | Video | «Der Nationalrat sagt Ja zum Vaterschaftsurlaub» · SRF Tagesschau · 2019-09-11 | 00:00–02:32 (Segment dauert 04:13) | derselbe Gegenstand wie die Quelle; Ausschnitt |
| `q-521b-vertiefung-1` | Webseite | «Gesetze in der Schweiz» · ch.ch · o. D. | Abs. 1–13, 321 Wörter | ohne Datum; Abs. 9 verkürzt (Abschnitt 6, Nr. 45) |
| `q-521b-vertiefung-2` | Artikel | «Zwei Wochen – 60.3 Prozent sagen Ja zum Vaterschaftsurlaub» · SRF News (sda) · 2020-09-27 | Abs. 1–15, 539 Wörter | Stimmbeteiligung im Artikel mit zwei Werten — nicht verwenden |

Alle vier Videos sind über den SRG-Integration-Layer abrufbar (kein
`blockReason`, Untertitel vorhanden); die zwei ch.ch-Seiten und der
Lexikoneintrag sind heute wortgleich mit dem Archiv; Wortzahlen und
Absatzzählung von zwei Auditoren nachgezählt.

## 4. Abdeckung (kohaerenz.md §3)

| # | Befund | Lücke |
|---|---|---|
| A1 | Rezeption schriftlich und bildlich → Auftrag (Auswertung) · Produktion mündlich → Heft B (Kurzvortrag) · Produktion schriftlich und bildlich → Auftrag (Stellungnahme) | **Interaktion und Kollaboration mündlich: nirgends geführt** (Regel «mehr als zwei», Bauplan §6); geübt in der Rückmeldung nach dem Vortrag und beim Vorlesen der Stellungnahme |
| A2 | A: Interaktion und Kollaboration digital → Produkt · B: Produktion mündlich → Produkt | keine |
| A3 | S. 3 «geübt, nicht geführt»: ohne Medien Rezeption schriftlich und bildlich, mit Medien Rezeption audiovisuell | keine |
| A4 | Auftrag: je Modus ein Produkt (`flaeche`, `flaeche`) | keine |
| A5 | 5.2.1 digital → Heft A · 5.2.2 mündlich → Heft B | Heft A braucht auch ohne Medien ein Gerät und ein geteiltes Dokument mit Kommentarfunktion |
| A6 | 3J: SK 2 → A · 9, 11 → A, B, KN · 12 → B, KN | 4J führt zusätzlich SK 5 und 6; nicht geführt (SK 6 wird geübt), im Begleiter genannt |
| A7 | A: 9 → LF3 · 11 → LF4 · 2 → Produkt · B: 9 → LF3 · 11 → LF4 · 12 → Produkt (`sk_anker`) | keine |
| A8 | geteiltes Dokument ≠ Kurzvortrag ≠ Auswertung + Stellungnahme | keine |
| A9 | Wohngemeinde · Lehre und Lehrbetrieb · Verein und Freizeit · Berufsfachschule | keine |
| A10 | A: Fachkorrektheit + Politisches Prinzip · B: Argumentation + Position / Werthaltung · Auftrag: alle vier — Wortlaut zeichengleich mit `kn.rubrik_shared` (von Hand und per Skript verglichen) | keine |
| A11 | ohne Medien `recht_praxis` ≠ `modell_eigener_fall` · mit Medien `lehrmittel_quelle` ≠ `modell_eigener_fall` | keine |
| A12 | je Heft beide Spuren; Karte und Archivtext für alle acht Slots | keine |
| A13 | Fall-Begriffe des KN: kein Treffer in Heften, Auftrag, Glossar, Karten (auch nicht unter anderem Wort); Heft-Fälle nicht in Auftrag und KN | keine |
| A14 | siehe Abschnitt 5 | — |

Von Hand geprüft (phase-9 §3): Prinzip, Hefte, Set und KN tragen dieselben
Werte (31 Vergleiche, alle gleich); kein Lösungssatz im sichtbaren Text der
Hefte und des Bogens; keine gesperrten Wörter im Heft («Woche» und «Minuten»
nur im Fall, im Titel einer Quelle und als Dauer des Vortrags); kein «ß»,
keine Transliteration, kein Platzhalter.

## 5. Vergleich mit Gold (nur Kurzliste aus kohaerenz.md §4)

Fest (F1–F13): gleich — sechs Dateien, Template `heft_8page_v42`, acht Seiten
je Heft, vier Leitfragen mit fester Funktion, fünf Schritte, Kriterien im
Wortlaut des KN, Begriffsnetz mit gleichem Zentrum, Bogen mit vier Seiten, drei
KN-Formen, Lösung zu jedem Feld. Eine Abweichung, bewusst: Die drei Abschnitte
auf S. 1 von Heft A heissen «Etappe 1/2/3» statt «Teil 1/2/3» (Abschnitt 7,
Entscheid 1).

| | Gold 1.3.1 | diese Einheit | Herleitung |
|---|---|---|---|
| Modi A | Rezeption schriftlich und bildlich | Interaktion und Kollaboration digital | Modus von 5.2.1 |
| Modi B | wie A + Interaktion mündlich | Produktion mündlich | Modus von 5.2.2 |
| Modi Auftrag | Produktion mündlich + Produktion schriftlich | Rezeption schriftlich + Produktion schriftlich | `modi_kn` minus A und B, Regel «mehr als zwei» |
| SK | A 5, 11, 1 · B 2, 6, 11 · KN 5, 11, 6 | A 9, 11, 2 · B 9, 11, 12 · KN 9, 11, 12 | SK von T5 im dreijährigen Lehrplan |
| Produkte | Karte · Tabelle + Gespräch · Blatt + Sprachnachricht | geteiltes Dokument · Kurzvortrag mit Karte und Wegskizze · Auswertung + Stellungnahme | Modi und Verben der Kompetenzen |

Nicht kopiert: Modi, Produkte und SK unterscheiden sich; gemeinsam ist nur SK 11.

## 6. Fakten-Audit an Primärquellen (Abruf 2026-10-06)

Eigener Subagent (Opus, mit Netz): 64 Aussagen. **34 stimmen · 22 vertretbar
vereinfacht · 6 stimmen nicht · 2 nicht belegbar.** Die Schlüsselstellen hat
der Orchestrator selbst am Wortlaut nachgelesen (BV Art. 8, 63, 138, 139, 141,
173, 185; KV ZH Art. 16; Datum der Beobachter-Seite).

Quellen: **BV** <https://www.fedlex.admin.ch/eli/cc/1999/404/de> · **ParlG**
<https://www.fedlex.admin.ch/eli/cc/2003/510/de> · **BPR**
<https://www.fedlex.admin.ch/eli/cc/1978/688_688_688/de> · **VlG**
<https://www.fedlex.admin.ch/eli/cc/2005/542/de> · **BBG**
<https://www.fedlex.admin.ch/eli/cc/2003/674/de> · **ZGB**
<https://www.fedlex.admin.ch/eli/cc/24/233_245_233/de> · **KV ZH** (Stand
6.3.2023) <https://fedlex.data.admin.ch/filestore/fedlex.data.admin.ch/eli/cc/2006/14_fga/20230306/de/pdf-a/fedlex-data-admin-ch-eli-cc-2006-14_fga-20230306-de-pdf-a.pdf>
· **GG ZH** <https://www2.zhlex.zh.ch/appl/zhlex_r.nsf/WebView/E015A210ED59771EC12588C30031E1C0/$File/131.1_20.4.15_118.pdf>
· **GO Zürich** <https://www.zh.ch/bin/zhweb/publish/regierungsratsbeschluss-unterlagen./2021/1168/GO_PG_Zuerich.pdf>
· **BK-Abst.** <https://www.bk.admin.ch/de/volksabstimmung?date=2020-09-27>,
<https://www.bk.admin.ch/de/volksabstimmung?date=2016-02-28> · **BK-Init.**
<https://www.bk.admin.ch/de/details-volksinitiativen?initiative=468> ·
**BGer** <https://www.bger.ch/files/live/sites/bger/files/pdf/de/archive/1C_315_2018_yyyy_mm_dd_T_d_13_11_34.pdf>
· **BR 16.3.2020** <https://www.admin.ch/de/nsb?id=78454> · **BR 21.10.2020**
<https://www.admin.ch/de/nsb?id=80729> · **BR 21.6.2019**
<https://www.admin.ch/gov/de/start/dokumentation/medienmitteilungen.msg-id-75521.html>
· **PD-Bericht** <https://www.parlament.ch/centers/documents/de/Faktenbericht-Bundesversammlung%20in%20der%20Covid-19%20Krise-d.pdf>
· **Session** <https://www.parlament.ch/de/ratsbetrieb/sessionen/fruehere-sessionen/ausserordentliche-session-mai-2020>
· **ch.ch GT** <https://www.ch.ch/de/politisches-system/funktionsweise-und-organisation/gewaltenteilung/>
· **ch.ch Ges.** <https://www.ch.ch/de/politisches-system/funktionsweise-und-organisation/wie-entsteht-ein-gesetz/>
· **ch.ch Lohn** <https://www.ch.ch/de/arbeit/mindestlohne-und-medianlohn/> ·
**SRG-IL** `https://il.srgssr.ch/integrationlayer/2.0/mediaComposition/byUrn/<urn>.json`

Kürzel der Urteile: ✔ stimmt · ≈ vertretbar vereinfacht · ✘ stimmt nicht · ? nicht belegbar.
«Ort»: hf = Heft, om/mm = Spur ohne/mit Medien, EH = Erwartungshorizont.

| Nr | Aussage (sinngemäss) | Ort | Primärquelle | Urteil | Folge in diesem Lauf |
|---|---|---|---|---|---|
| 1 | Aufgaben der drei Gewalten; im Bund Parlament, Bundesrat, Gerichte | hf_A LF1; Glossar | BV Art. 148, 163–164, 174, 182, 188; ch.ch GT | ✔ | — |
| 2 | Legislative kontrolliert die Ausführung bzw. die Exekutive | hf_A LF1, LF2, Netz, Lösungsbild | BV Art. 169; ParlG Art. 26 | ≈ | gemeint ist Oberaufsicht; im Heft als Fallüberlegung geführt |
| 3 | Parlament der Gemeinde heisst «Einwohnerrat» | hf_A LF1, Lösungsbild | GG ZH § 5; KV ZH Art. 87 | ✘ | Lösung nennt «Gemeindeparlament» und das Lehrmittelwort; Begleiter erklärt |
| 4 | Exekutive der Gemeinde: Gemeinderat oder Stadtrat | hf_A LF1, LF2 | GG ZH § 5, § 48; GO Zürich Art. 3 | ≈ | Stolperstein im Begleiter: In der Stadt Zürich heisst das Parlament «Gemeinderat» |
| 5 | Gewalten kontrollieren einander, sind personell und im Aufbau unabhängig | hf_A LF1, LF4 mm, Vertiefung 1 | BV Art. 144; ch.ch GT | ✔ | — |
| 6 | Gerichte urteilen unabhängig von Parlament und Regierung | Glossar | BV Art. 191c, 30 | ✔ | — |
| 7 | Streit Privatperson gegen Staat: Verwaltungsgericht | hf_A; Glossar; Begleiter | BV Art. 29a; KV ZH Art. 77 | ≈ | überall als Fallüberlegung gekennzeichnet; kein Rechtsweg behauptet |
| 8 | Parlament: Gesetze, Oberaufsicht über Regierung und oberstes Gericht, vom Volk gewählt | hf_A Vertiefung 1 | ch.ch GT; BV Art. 169 | ✔ | — |
| 9 | Stufen Verfassung–Gesetz–Verordnung–Reglement; nichts widerspricht der Verfassung | hf_A LF1; Glossar | BV Art. 5, 164, 182 | ≈ | — |
| 10 | Eine Verordnung braucht ein Gesetz | hf_A LF1, LF2, Denkhilfe; hf_B LF2 | BV Art. 182 Abs. 1, 164 | ≈ | Lösung nennt die Ausnahme Notverordnung als «nicht im Lehrmittel» |
| 11 | «Ohne Gesetz gibt es keine Verordnung» | Glossar | BV Art. 182, 184, 185, 173 | ✘ | Glossar: «braucht in der Regel ein Gesetz als Grundlage» |
| 12 | Rechtsgleichheit; Alter als Merkmal | hf_A; Glossar; set EH | BV Art. 8 Abs. 1–2 | ✔ | Glossar und Lösung sagen «diskriminiert» statt «benachteiligt» |
| 13 | Rechtsstaat: Macht geteilt und an Verfassung und Gesetz gebunden | Glossar; Prinzip | BV Art. 5 Abs. 1 | ✔ | — |
| 14 | Menschenrechte in einer Demokratie garantiert | Glossar; hf_A LF3 om | BV Art. 7–36 | ≈ | Gegenüberstellung des Lehrmittels |
| 15 | Pressefreiheit | Glossar | BV Art. 17 | ✔ | — |
| 16 | Notrecht = Verordnungen der Regierung in der Krise | Glossar; hf_A mm | BV Art. 185 Abs. 3, 173 Abs. 1 Bst. c | ≈ | Glossar und Hinweis neutral gefasst (auch das Parlament kann verordnen); keine Rechtsgrundlage genannt |
| 17 | Regierung regiert am 28.4.2020 seit sechs Wochen per Notrecht | hf_A mm LF3, LF4 | BR 16.3.2020; PD-Bericht | ≈ | als Aussage der Quelle geführt, Stand April 2020 |
| 18 | Parlament kann selbst verordnen | hf_A mm LF3 | BV Art. 173 Abs. 1 Bst. c | ✔ | Lösung trennt «kann» von «stimmt faktisch zu» |
| 19 | Motion: beide Räte, danach ein bis zwei Jahre | hf_A mm LF3 | ParlG Art. 120–122 | ≈ | als Einschätzung des Politologen gekennzeichnet; Gegenstimme unter «Auch gültig» |
| 20 | Ab Anfang Mai bestimmt das Parlament wieder mit | hf_A mm | Session 4.–6.5.2020 | ✔ | — |
| 21 | Bundesgericht hebt 2019 eine eidgenössische Abstimmung auf (falsche Angaben) | hf_A mm; Karte | BGer 10.4.2019; BR 21.6.2019 | ✔ | — |
| 22 | … «erstmals» | Karte Ersatzquelle | amtlich nirgends so formuliert | ? | aus dem Kurztext gestrichen; im Begleiter als Aussage des Beitrags |
| 23 | Anstoss: Bundesrat oder Motion | hf_B LF1, LF3 om | BV Art. 160, 181; ParlG Art. 120 | ≈ | «ohne … beginnt nichts» gestrichen |
| 24 | Motion = Auftrag, ein neues Gesetz auszuarbeiten | Glossar; hf_B LF1 | ParlG Art. 120 Abs. 1 | ≈ | Glossar: «Gesetz vorschlagen oder handeln» |
| 25 | Vorentwurf: Fachleute | hf_B LF1 | kein Erlass regelt es | ? | bleibt als Lehrmittelaussage (Kap. 6.5, S. 171) |
| 26 | Vernehmlassung: Kantone, Parteien, Verbände | hf_B; Glossar | VlG Art. 4 | ✔ | — |
| 27 | Entwurf mit Botschaft geht ans Parlament (ohne Absender) | hf_B LF1; Glossar | ParlG Art. 141; BV Art. 181 | ≈ | Glossar und Lösung nennen den Bundesrat |
| 28 | Kommission, dann Rat; Nichteintreten, Rückweisung | hf_B LF1, LF3 om | ParlG Art. 44, 74, 75 | ✔ | — |
| 29 | Differenzbereinigung; ohne Einigung kein Gesetz | hf_B; Glossar | ParlG Art. 83, 89, 91, 93 | ✔ | — |
| 30 | Referendumsfrist 100 Tage ab Veröffentlichung | hf_B; Glossar | BV Art. 141 Abs. 1 | ✔ | Vermerk «an keiner amtlichen Quelle nachgeprüft» ersetzt |
| 31 | Volksabstimmung, falls das Referendum zustande kommt | hf_B LF1 | BPR Art. 59c, 66 | ✔ | — |
| 32 | Inkrafttreten meist durch den Bundesrat | hf_B LF1 | Schlussbestimmungen; ch.ch Ges. | ≈ | — |
| 33 | 50 000 Unterschriften oder acht Kantone, 100 Tage, Volksmehr | hf_B LF1, LF3 om | BV Art. 141, 142 Abs. 1 | ✔ | — |
| 34 | Obligatorisches Referendum bei Verfassungsänderungen | hf_B LF1 | BV Art. 140, 142 Abs. 2 | ≈ | «doppeltes Mehr» ergänzt |
| 35 | Volksinitiative: 100 000 in 18 Monaten, Verfassung, doppeltes Mehr | hf_B LF1, LF4, Denkhilfe | BV Art. 138, 139, 142 | ✔ | — |
| 36 | Referendum = Abstimmung über einen Beschluss des Parlaments | Glossar | BV Art. 140, 141 | ≈ | — |
| 37 | Volksinitiative: «das Volk» verlangt eine Abstimmung | Glossar | BV Art. 139 Abs. 1 | ≈ | Glossar: «Stimmberechtigte verlangen …» |
| 38 | Gegenvorschlag «von Bundesrat und Parlament» | Glossar; hf_B Netz, Denkhilfe, LF1, LF4 | BV Art. 139 Abs. 5; ParlG Art. 101 | ✘ | überall: Sache des Parlaments; Lösung nennt, dass das Lehrmittel (S. 170) auch den Bundesrat nennt |
| 39 | Initiative kommt unverändert vors Volk (Deutung) | hf_B LF4 | BV Art. 139 | ✔ | als Fallüberlegung gekennzeichnet |
| 40 | Gesetz: im Bund beschliesst es das Parlament | Glossar | BV Art. 163, 164, 141 | ≈ | — |
| 41 | Föderalismus | Glossar | BV Art. 3, 42 | ≈ | — |
| 42 | Bund zuständig für die Berufsbildung; Stufe Gesetz | hf_B LF2 | BV Art. 63; BBG Art. 14 | ✔ | bleibt Ableitung aus dem Lehrmittel; keine Aussage zu Lohnregeln |
| 43 | «Das regelt der Kanton» ist nicht tragfähig | hf_B LF4 om; Begleiter | ch.ch Lohn | ✘ | Fehler ist nur die Begründung «weil die Schule kantonal ist»; so gefasst |
| 44 | Je Ebene beschliesst das Parlament, in Gemeinden auch die Versammlung | hf_B Vertiefung 1 | ch.ch Ges.; GG ZH § 4 | ✔ | — |
| 45 | In Kraft erst, wenn «das Volk einverstanden ist» | hf_B Vertiefung 1 | ch.ch Ges. Abs. 9; BV Art. 141 | ≈ | Erwartung nennt: abgestimmt wird nur bei einem Referendum (S. 171) |
| 46 | Dringliche Gesetze gelten sofort und befristet | hf_B Vertiefung 1 | BV Art. 165 | ✔ | — |
| 47 | Initiative vier Wochen, Parlament zwei | hf_B mm | BK-Init. 468; BK-Abst. 634 | ✔ | «die Hälfte» als Rechnung gekennzeichnet |
| 48 | Das Komitee zieht 2019 zurück | hf_B mm; Karte; Glossar | BK-Init. 468 (bedingter Rückzug 3.10.2019, wirksam 23.11.2020) | ≈ | Satz für die Lehrperson im Begleiter |
| 49 | Danach Referendum, 2020 stimmte das Volk zu | hf_B mm Auftrag | BK-Abst. 27.9.2020 | ✔ | — |
| 50 | 60,3 % Ja | Karte; Vertiefung 2 | BK-Abst. (60,34 %); BR 21.10.2020 | ✔ | — |
| 51 | Bundesrat setzt in Kraft | hf_B Vertiefung 2 | BR 21.10.2020 (1.1.2021) | ✔ | — |
| 52 | Nationalrat lehnt die Initiative ab, stützt den Gegenentwurf | hf_B mm Ersatzquelle | BV Art. 139 Abs. 5 | ≈ | Wortlaut folgt dem Beitrag |
| 53 | Anliegen in der Beratung des Parlaments verändert | hf_B mm LF3 | BK-Init. 468 | ≈ | als Deutung gekennzeichnet |
| 54 | Regierungsrat ausführend, Kantonsrat gesetzgebend | KN; Begleiter | KV ZH Art. 50, 60 | ✔ | — |
| 55 | Petition: eine Antwort ist nicht vorgeschrieben | Begleiter, EH zum KN | BV Art. 33; **KV ZH Art. 16** | ✘ | berichtigt: im Kanton Zürich Prüfung und Stellungnahme innert sechs Monaten |
| 56 | Kantone kennen Gesetzesinitiativen | Begleiter | KV ZH Art. 23, 24 | ✔ | — |
| 57 | Das Kantonsparlament kontrolliert | Begleiter | KV ZH Art. 57 | ✔ | — |
| 58 | Verein handelt durch den Vorstand | set EH | ZGB Art. 69 | ✔ | — |
| 59 | Mitgliederversammlung entscheidet über die Ordnung | Auftrag | ZGB Art. 64, 65, 67 | ✔ | — |
| 60 | «eine unabhängige Stelle fehlt» | set EH | ZGB Art. 65 Abs. 2, 75 | ≈ | Stimme der Lernenden, keine Rechtsaussage |
| 61 | Lehrplanangaben (Lektionen, Lehrjahr, Gleichheit 3J/4J) | Begleiter; set | nur gegen `public/nrlp_*.json` | ✔ | nicht gegen das SLP-PDF geprüft |
| 62 | Titel, Datum, Länge der vier Beiträge | Karten | SRG-IL | ✔ | — |
| 63 | QR-Seite erreichbar | Begleiter | Direktabruf: HTTP 404 | ✘ | erwartet, solange die Einheit Entwurf ist; nach der Freigabe prüfen |
| 64 | Stimmbeteiligung: zwei Werte im Artikel | hf_B Vertiefung 2 | BK-Abst. (59,36 %) | ✔ | Warnung bleibt |

**Nicht belegbar** (zwei): «erstmals» (Nr. 22) — gestrichen bzw. als Aussage
des Beitrags gekennzeichnet; «Vorentwurf: Fachleute» (Nr. 25) — steht so im
Lehrmittel und bleibt als Lehrmittelaussage.

**Nicht geprüft im Fakten-Audit:** Bild und Ton der Beiträge; die Fassung der
Zürcher Kantonsverfassung vom 1.7.2024 (gelesen: Stand 6.3.2023);
«Einwohnerrat» in anderen Kantonen; ob kantonale Mindestlöhne Lernende
erfassen (die Einheit behauptet es nicht); Rechtsweg gegen einen
Gemeindeentscheid (die Einheit behauptet nichts dazu).

## 7. Entscheide im Lauf (auto-modus §4)

1. **«Etappe 1/2/3» statt «Teil 1/2/3» auf S. 1 von Heft A.** Der Datenvertrag
   führt die Labels von `wochen_plan` als Konstante «Teil 1/2/3»; das Produkt
   von Heft A hat selbst «Teil 1/2/3» (Bauplan). Drei Leser haben beides
   verwechselt. Verworfen: die Teile des Dokuments umbenennen (Bauplan-Wortlaut,
   rund 40 Stellen).
2. **Beispiel auf S. 6 von Heft B: neuer Gegenstand im selben Lebensbereich.**
   Der Bauplan empfahl «Wohnquartier (Übergang vor einem Schulhaus)»; das
   Beispiel setzte dafür «Ebene: Gemeinde», während Kap. 6.2, S. 159 den
   Strassenverkehr beim Bund führt — genau in diese Liste schickt LF2. Neu:
   Sammelstelle im Quartier (Kehricht ist nach S. 159 Gemeindeaufgabe).
   Lebensbereich unverändert. Verworfen: Beispiel lassen und im Begleiter warnen.
3. **LF4 von Heft A fragt «vertretbar oder nicht – und welche Kontrolle
   verlangen Sie?»** (Bauplan §7, Arbeitsfassung). Vorher: «vertretbar – oder
   erst mit mehr Kontrolle?»; zwei Leser fanden keine echte Wahl und keinen
   Beleg für «vertretbar». Der Beleg ist jetzt genannt (Kap. 3.1, S. 91;
   Kap. 1.3, S. 23) und in der Lösung als Deutung gekennzeichnet.
4. **«allein» ist keine Tatsache der Situation.** Die Situation nennt nur den
   Gemeinderat. LF4 und Lösungen sagen es jetzt vorsichtig. Der Bauplan §4
   schreibt beim Pol-Typ «allein beschliesst»; der Pol-Typ selbst ist
   unverändert.
5. **Kurztexte der vier Videokarten neutral gefasst.** Sie stehen im Heft auf
   S. 3 und auf der QR-Seite und nahmen die Antwort auf LF3 vorweg (vier
   Prüfer). Die Karten gehören dieser Einheit und waren nicht committet.
6. **Glossar folgt bei vier Einträgen der Bundesverfassung statt dem
   Lehrmittel** (Gegenvorschlag, Verordnung, Motion, Volksinitiative), dazu
   Botschaft, Notrecht, Rechtsgleichheit genauer. Die Lösungen nennen, wo das
   Lehrmittel anders formuliert.
7. **Lösungsbild von Heft A gilt für beide Spuren.** Es steht im Kern und
   zeigte die Belege der Spur ohne Medien auch im Dokument «mit Medien». Die
   Gegenbilder stützen sich jetzt auf Kap. 3.1, S. 91 (in beiden Spuren
   vorhanden), die Belege von S. 162 sind als «ohne Medien» bezeichnet, die
   zwei Rasterzeilen der Quelle stehen im Hinweis.
8. **Datum der Beobachter-Karte:** 2017-08-07 statt «o. D.» (die Seite trägt
   ein Datum; laut Metadaten zuletzt geändert am 9.12.2022).

## 8. Gegenleser (gegenleser.md §6)

Alle Gegenleser Sonnet; Executors und Fakten-Audit Opus. Jeder Befund wurde am
Dokument nachgeprüft (Hauptbefunde durch den Orchestrator an Heft,
Lehrmittelseite und Untertitel; die übrigen durch den Executor der Datei, je
mit Kürzel).

**Runde 1** (zwölf Prüfer, parallel, nach dem ersten Tor ohne Überlauf in den
Lernenden-Dokumenten):

| Prüfer | Wichtigste Befunde | Folge |
|---|---|---|
| Lernende A ohne Medien | Teil 2 unklar; LF4 nimmt die Antwort vorweg; Beispiel S. 6 widerspricht sich | E — behoben |
| Lernende A mit Medien | Teil 2 zugleich Gegenbild und Beispiel aus der Schweiz; Kurztext verrät LF3; Beispiel ohne Fachbegriff | E — behoben |
| Lernende B ohne Medien | Beleg je Schritt (Karte) gegen zwei Belege; «Offen» entscheidet LF4 vor; Stufe aus S. 22 nur ableitbar | E — behoben; Karte: S |
| Lernende B mit Medien | acht Stationen gegen «vier bis sechs»; Rasterzeilen als «Stationen»; zwei Wege, Petition | E — behoben |
| Lernende am Bogen | Stufe 3 der Kriterien ohne Auftrag; wem schreibe ich; Seitenfuss A2/A3 | S, V, R — Abschnitt 11 |
| Lösungs-Audit A ohne | kein Lehrmittelfehler; Plus-Aufgabe und Plan ohne Lösung; «allein»; Ableitungen ohne Kennzeichnung | E — behoben |
| Lösungs-Audit A mit | 22 Zeitmarken tragen; zwei falsche Fundstellen; eine Ableitung als Quellenaussage; Glossar «Notrecht» | E — behoben |
| Lösungs-Audit B ohne | alle Zahlen und Seiten stimmen; Beispiel S. 6 gegen S. 159; Hinweis mit Video in der Fassung ohne Medien | E — behoben |
| Lösungs-Audit B mit | alle Marken und Absatzangaben stimmen; Kurztext verrät LF3; zwei schwache Beispielantworten zu LF4 | E — behoben |
| Sweep | kein «ß», kein Platzhalter, kein Fall-Begriff; dreimal «ihr/euer» im Begleiter; Seitenangabe 3B-Schema | E — behoben |
| Fakten-Audit | Abschnitt 6 | E — behoben |
| Begleiter-Abgleich | kein schwerer Befund; Zeitrechnung, Plus-Antwort, Abwägung als Rechtsaussage; Bauplan §9 a–k alle vorhanden | E — behoben |

Zählung der Executors: Heft A — E 77 · S 7 · R 7 · Q 6 · V 21 · W 5 ·
Heft B — E 59 · S 7 · R 6 · Q 5 · V 22 · W 6 · Begleiter — behoben 58 ·
teilweise 2 · nicht behoben 3 · so gewollt 1 · fällt weg 9.
Weggefallen nach Nachprüfung (W) unter anderem: «Seiten nicht prüfbar»
(fehlten nur im Paket des Lesers), «02:49 gegen 02:48» (Rundung von
168,6 Sekunden), «Spalte Bild nicht füllbar» (die Leser hatten kein Bild),
«QR-Kürzel 5.2.1 gegen Kompetenz 5.2.2» (Ordnername).

**Runde 2** (vier Lernende, zwei Lösungs-Audits, nach der Korrektur von
Heften, Set, Karten):

- Lernende: Die Kernpunkte bestehen in allen vier Fassungen — LF2 verlangt
  nichts aus S. 3, LF3 ist aus Quelle bzw. Abschnitt beantwortbar, LF4 lässt
  zwei Möglichkeiten offen, die Quer-Check-Fragen haben eine Stelle, «Teil»
  und «Etappe» sind getrennt, die Kurztexte verraten LF3 nicht mehr, die
  Zahlen stehen überall gleich. Restpunkte: Beispiel S. 6 von Heft A (Titel
  doppeldeutig, Gewalt und Ebene fehlten); Checkliste verlangte die
  «Gegenseite»; «Spalte 3» doppeldeutig; «dafür» unklar; Volksinitiative gegen
  Stufe «Gesetz».
- Lösungs-Audit A: 110 Felder, 92 stimmen; 1 hoch (Lösungsbild Teil 2 in der
  Fassung mit Medien zeigte die Belege der anderen Spur), 2 mittel, 12 klein.
- Lösungs-Audit B: 136 Felder, 118 stimmen; 0 hoch, 3 mittel (einer davon
  Paketfehler: S. 91 lag nicht bei; einer die Karte «Wirkungskette»; einer das
  Lösungsbild mit Medien), 13 klein.
- Alle Zeitmarken beider Hefte trugen in beiden Runden (Toleranz 2 Sekunden).

**Runde 3** (ein Lernenden-Leser über die geänderten Seiten aller vier
Fassungen, ein Lösungs-Audit über die geänderten Lösungsfelder): siehe
Nachtrag am Schluss dieses Abschnitts.

**Zeitsummen der Lernenden-Gegenleser** (Schätzungen in der Rolle, starkes
Profil; Seitenplan: 135 Minuten je Heft):

| | Runde 1 | Runde 2 |
|---|---|---|
| Heft A ohne Medien | 116 min + rund 40 für das Dokument | 87 min + 38 |
| Heft A mit Medien | 110 min + rund 75 | 87 min |
| Heft B ohne Medien | 121 min | 85 min |
| Heft B mit Medien | 153 min (ohne Vertiefungen) | 80 min |
| Auftragsbogen | 59 min | nicht erneut gelesen (unverändert) |

Der Begleiter sagt jetzt offen, dass drei Lektionen für Heft A mit dem
geteilten Dokument knapp sind, und nennt, was zuerst in die Hausarbeit oder in
den Puffer wandert.

**Was kein Gegenleser prüfen konnte:** Bild und Ton der vier Videos; das
Seitenbild (Überlauf prüft `messen-v42`); Word-Dokumente; ob die Schule ein
geteiltes Dokument mit Kommentarfunktion bereitstellt; die QR-Seite.

**Runde 3** (letzte Runde; ein Lernenden-Leser über die geänderten Seiten
aller vier Fassungen, ein Lösungs-Audit über die geänderten Lösungsfelder):
kein Befund «hoch», kein neuer Widerspruch gegenüber Runde 2. Zwei Befunde
«mittel», beide danach behoben und **nicht mehr gegengelesen** (die drei
Runden sind ausgeschöpft): (1) Heft B, S. 4, Hilfe zu LF4 war zu knapp — neu
«Wege: Motion im Parlament (S. 171) oder Volksinitiative – ändert die
Verfassung (S. 169)»; (2) Heft A, Lösungsbild und Hinweis sagten für die Spur
ohne Medien, zu Gerichten stehe auf S. 162 nichts — dort steht, dass der
Herrschende selbst verurteilt; berichtigt. Kleine Befunde ohne Änderung:
«der Befund (LF3) stützt es» lässt offen, ob der Befund mitgeschrieben wird;
«Die Leiterin (Exekutive der Gemeinde)» im Beispiel auf S. 6 ist eine Setzung
(Verwaltung als Teil der Exekutive, Kap. 3.1, S. 91 nennt nur Gemeinderat und
Stadtrat); «am Ende erhalten» in LF3 von Heft B mit Medien könnte auf den
Ausgang von 2020 bezogen werden.

## 9. Vor dem Druck gegenhören / gegensehen

Niemand hat die vier Videos gesehen oder gehört; gelesen sind die Untertitel
von SRF (live untertitelt, ohne Sprecherkennung). Zeitmarken relativ zum
Beginn des Segments, wie der Player auf der QR-Seite sie zeigt.

- **`q-521a-pflicht` — «Notrecht – die Zahl der Kritiker wächst», 00:00–02:49.**
  Achte auf: (a) Beginn und Ende des Segments — endet der Beitrag bei 02:49
  oder läuft der Player in den nächsten Beitrag? (b) die vier Rasterzeilen
  der Lösung: 00:01 (Regierung regiert seit sechs Wochen weitgehend allein),
  00:18 (Parlament kann korrigieren, teils auf die Regierung angewiesen),
  01:14 (Auftrag an die Regierung; Einschätzung des Politologen, 01:09–01:27),
  01:56 (Parlament kann selbst verordnen) mit 02:11–02:16 (stimmt den
  wichtigen Entscheiden faktisch zu); (c) **wer spricht** bei 00:18 und bei
  01:56–02:19 (Bericht oder Politologe?) und was im Bild ist — die erste Zelle
  jeder Rasterzeile ist erschlossen; (d) 01:34: Hier fällt der einzige Name;
  die Lösung nennt die Rolle; (e) 02:43: «ab Anfang Mai».
- **`q-521a-pflicht-ersatz` — «Abstimmung über Heiratsstrafe ist ungültig»,
  00:00–03:46.** Achte auf: (a) **Schnittmarke 03:46** — endet dort die
  Einschätzung des Korrespondenten? (b) 00:06 (Gericht hebt die ganze
  Abstimmung auf), 01:19–01:24 (falsche Angabe in den Unterlagen),
  01:41–01:48 (Ergebnis verfälscht, ungültig), 01:51, 03:17–03:42
  (Gewaltenteilung funktioniert); (c) dass im Ausschnitt Zahlen fallen, die
  das Heft bewusst nicht verwendet.
- **`q-521b-pflicht` — «Begehren für vier Wochen Vaterschaftsurlaub vom
  Tisch», 00:00–02:26.** Achte auf: (a) Ende bei 02:26 (Archiv: 145,6
  Sekunden); (b) 00:11–00:14 (vier Wochen verlangt, zwei angeboten), 00:18–00:20
  und 00:32 (Rückzug), 00:36–00:44 (was das Komitee erreicht hat), 00:53 (neue
  Initiativen), 01:22–01:39 (eine Seite will bei zwei Wochen bleiben; «KMU»),
  01:56–02:11 (die andere will weitergehen); (c) **wer spricht** bei
  01:22–01:48 und 01:56–02:11 — die Lösung sagt nur «die eine Seite», «die
  andere Seite»; (d) Organisations- und Personennamen im Ausschnitt (das Heft
  nennt keine); (e) die Hilfe «bis 00:32 gemeinsam ansehen» — passt der Schnitt?
- **`q-521b-pflicht-ersatz` — «Der Nationalrat sagt Ja zum
  Vaterschaftsurlaub», 00:00–02:32.** Achte auf: (a) **Schnittmarke 02:32** —
  endet dort der Bericht vor dem Studiogespräch? (b) 00:38–00:42 (Nationalrat
  berät), 00:50–00:55 (Vorschlag, der eine Mehrheit finden kann), 01:00
  (Gegenentwurf des Ständerats), 01:54–02:02 (Initiative abgelehnt, kürzere
  Dauer gestützt), 02:06–02:14 (Rückzug wird erwogen).
- **Gegensehen, nicht Audio:** `q-521a-vertiefung-1` und `q-521b-vertiefung-1`
  (ch.ch) laden nur im Browser, Abschnitte aufklappbar — am Handy prüfen, ob
  Lernende die Absätze 1–7 bzw. 1–13 so finden, wie die Erwartung sie zählt
  (Zwischentitel nicht gezählt; Abs. 4–5 der ersten Seite sind Aufzählungspunkte).
  `q-521a-vertiefung-2` (Beobachter): Der Eintrag ist frei, darunter wirbt die
  Seite für ein Abo. `q-521b-vertiefung-2` (SRF News): 15 Absätze, Seite mit
  Werbung.
- **Am Papier:** S. 6 von Heft A (Beispiel mit Wechselrede) und von Heft B
  (Karte mit vollem und leerem Kreis, Tabelle «Wegskizze») — beide Seiten haben
  0 px Reserve. S. 7 beider Hefte ist eine leere Fläche: Reicht sie für drei
  Felder (A) bzw. Karte, Wegskizze, Dauer und Rückmeldung (B)?
- **QR-Seite** `https://bbw-hko.ch/m/5.2.1_gesetze_veraendern`: erst nach der
  Freigabe erreichbar; Player, Startpunkt und die neutralen Kurztexte prüfen.

## 10. Unbelegt, nicht geprüft

- Bild und Ton der vier Beiträge (Abschnitt 9).
- Die zwei nicht belegbaren Aussagen aus Abschnitt 6 (Nr. 22, 25).
- Methodenkarten gegen ihre Kapitel: nur die Seitenmarker; `lm-17-2-w-fragen`
  (S. 386) nicht am Text gegengelesen.
- Word-Dokumente: exportiert, nicht geöffnet. Präsentation und Werkstatt der
  Einheit: nicht geprüft.
- Die Fassung 1.7.2024 der Zürcher Kantonsverfassung (Art. 16 im Stand
  6.3.2023 gelesen).
- Zeitbedarf: nur Schätzungen von Modellen in der Rolle.

## 11. Fehler in Skill, Skript, Renderer, Karten (nicht repariert)

**Offen** (als Liste, für die Sammelliste):

- Methodenkarte `hko-wirkungskette`: Schritt 4 verlangt «hinter jeden Schritt
  einen Beleg» und spricht von Pfeilen; Heft B verlangt eine Tabelle und Belege
  in zwei Zeilen. Die Kopfzeile der Karte ist überschrieben; der Kartentext
  steht weiter daneben. Im Begleiter angesagt.
- Methodenkarte `hko-quelle-raster`: «Begriff aus den Leitfragen» statt «LF1
  oder Glossar»; «Zeitmarke», «sehen, hören» auch in der Spur ohne Medien;
  «Beleg» meint dort die Fundstelle, die feste Spalte «Beleg / Beispiel» etwas
  anderes.
- Methodenkarte `lm-17-3-3b-schema`: druckt «S. 394–395»; das Schema steht auf
  S. 394. Methodenkarte `lm-17-2-w-fragen`: Der Merksatz zum «Warum» passt
  nicht zu «gestützt worauf».
- Datenvertrag: `wochen_plan[].label` als Konstante «Teil 1/2/3» kollidiert mit
  Produkten, die selbst Teile haben (Entscheid 1).
- `check-lf-loesung`: 900 Zeichen für alle Lösungszeilen einer Leitfrage sind
  bei einer Medienquelle mit Ersatzquelle, Einordnung und Gegenstimme knapp
  (Heft A mit Medien: 899; Heft A LF1: 900).
- Lösungsbild steht im Kern und gilt für beide Spuren; es gibt kein Feld für
  Abgaben, die nicht im Bild stehen (Plan, Plus-Antwort, Fassung mit Medien) —
  alles landet im Hinweis.
- `quellen_anker` fasst drei Einträge und gilt für beide Spuren: Heft A nennt
  auf S. 1 Kap. 6.3 und 6.4 nicht, obwohl sie gebraucht werden (im Begleiter
  angesagt); Seitenbereiche dort mit Bindestrich («Seite 21-24»).
- Renderer: «So starten Sie … Quer-Check» auf S. 1; keine Spalte für die
  Zeitmarke, LF3 steht unter dem Raster; «SuK», «Ges» ohne Erklärung; Plus ohne
  Schreibfeld; Denkhilfe druckt drei Zeilen; «Kreuzen Sie vor der Abgabe …» bei
  einem Vortrag; Seitenfuss A2 nennt nur Schritt 01; A4 sagt «Stufe» statt
  «Punkte»; QR-Seite sagt nicht, dass die Ersatzquelle dasselbe Raster füllt.
- Kriterien: Stufe 3 verlangt teils, was kein Auftrag ausdrücklich verlangt
  (Bogen-Leser; bekannt aus RUECKBLICK §5.6).
- Auftragsbogen: Wem die Stellungnahme gilt (Vorstand) und wer entscheidet
  (Mitgliederversammlung), muss man aus der Situation zusammenlesen; zwei
  Schritte arbeiten auf einem eigenen Blatt ohne Abgabe (so gewollt).
- Glossar: Wörter der Quellen ohne Erklärung (je Spur nur zwei eigene Begriffe
  möglich): «Session», «Kommissionen», «KMU», «Elternzeit».
- Archivköpfe nennen 02:48 bzw. 02:25, die Karten 02:49 bzw. 02:26 (Rundung
  von 168,6 und 145,6 Sekunden).
- Crosswalk (Zeile 3J 5.2) nicht um Kap. 6.2 und 3.1 ergänzt (Bauplan §9).
- Skill: `SKILL.md` und References führen die mit E30 aufgehobenen Wörter
  weiter; der Gegenleser-Auftrag der Skill nennt «1. Lehrjahr» (hier: 2. Lehrjahr).
- Diese Einheit steht in EFZ 4J im 3. Lehrjahr; Persona und SK-Stufen folgen
  dem dreijährigen Lehrplan (Bauplan §9, im Begleiter gesagt).

## 12. Commit

Ein Commit «Einheit 5.2.1_gesetze_veraendern (bbw-hko-heft-v42)»: Ordner der
Einheit, die acht Karten `q-521*`, der Bauplan, dieser Bericht mit
`check-all.txt` und `messung.txt`. Die zwei Index-Dateien sind gegenüber dem
letzten Commit unverändert. Status `"entwurf"`. Kein Push.

## 13. Nachtrag vom 2026-10-07 — vier offene Punkte entschieden (Pietro)

Nach dem Stopp vor der Freigabe hat Pietro vier Punkte aus Abschnitt 11
entschieden. Umgesetzt, Tor danach vollständig neu (Dateien `check-all.txt`
und `messung.txt` sind die Ausgaben nach diesem Nachtrag):

1. **Neue Methodenkarte `hko-wegskizze` («Wegskizze als Tabelle») für Heft B**
   anstelle von `hko-wirkungskette`. Das ändert einen Entscheid des Bauplans
   (§4, Karte 3; §9 «keine neue Karte nötig») — mit Freigabe von Pietro. Die
   Karte beschreibt, was das Heft verlangt: Tabelle, vier bis sechs Stationen,
   an jeder entscheidet jemand, ein Beleg in zwei Zeilen; Musterbeispiel mit
   neutralem Sujet. `hko-wirkungskette` bleibt unverändert für die anderen
   Einheiten. Seite 6 von Heft B: Die Karte ist 28 px niedriger als die alte,
   nichts abgeschnitten. Der Hinweis im Begleiter auf den Widerspruch der
   Karte ist entfallen. Die Karte ist nicht gegengelesen (keine vierte Runde).
2. **Methodenkarte `lm-17-3-3b-schema`: `seiten` «S. 394» statt «S. 394–395».**
   Am Kapitel nachgeschlagen: Das Schema steht ganz auf S. 394; S. 395 trägt
   Hinweise zur Sprache und kein Wort zum Schema. Fehler in der Karte, nach
   E31 behoben. Betrifft den Druck von 22 Heften in 18 Einheiten (ein Feld,
   wird kürzer). `bestand-v42 --pruefen`: 26 Dokumente unverändert — der
   Bestand muss nicht neu geschrieben werden. `check-all` über die 16 anderen
   Einheiten mit dieser Karte: 14 grün; `1.1.1_ausbildung_erfassen_zeigen` und
   `5.4.2_internationale_entscheide_wirken_4j` sind rot wegen zu langer
   Lösungstexte — schon vor der Änderung, ohne Zusammenhang mit der Karte.
   Nicht angefasst: Eigene Texte anderer Einheiten, die «S. 394–395» nennen
   (acht Dateien, darunter die Begleiter von 3.3.1 und 4.2.1).
3. **W-Fragen in Heft A:** Die Übertragung heisst neu «Wer hat was
   beschlossen, wo, wann – und warum, gestützt worauf?»; damit passt der
   Merksatz der Karte zum «Warum». Karte unverändert.
4. **«Etappe 1/2/3» und das Beispiel «Sammelstelle» bleiben** (Entscheide 1
   und 2 in Abschnitt 7); sie werden im Freigabe-Eintrag in `ENTSCHEIDE.md`
   festgehalten. Die Rasterkarte `hko-quelle-raster` bleibt unverändert
   (Sammelliste, mit dem Karten-Auftrag).

Tor nach dem Nachtrag: `check-all` GRUEN · Messung Exit 0, kein Überlauf ·
`bestand-v42 --pruefen` OK · `npm run build` Exit 0.

Damit erledigt aus Abschnitt 11: die Punkte zu `hko-wirkungskette`, zur
Seitenangabe der 3B-Karte und zum Merksatz der W-Fragen. Abschnitt 1 ist zu
lesen als: neue Methodenkarten — eine (`hko-wegskizze`).
