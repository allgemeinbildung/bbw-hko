# Fakten-Audit · 4.3.1_vielfalt_untersuchen

**Abrufdatum aller Quellen: 2026-10-06.** Geprüft: `prinzip.json`, `kn.json`, `herausforderung_A.json`, `herausforderung_B.json`, `set.json` und die acht Karten `src/data/quellen/q-431*.json`. Nicht geprüft: `begleiter.md` (entsteht parallel).

**Stand der Dateien:** `herausforderung_A.json`, `herausforderung_B.json` und `set.json` wurden während des Audits von anderer Seite geändert (u. a. die `erwartung`-Texte der Vertiefungen gekürzt). Die JSON-Pfade und Urteile unten gelten für den Stand von 14:17 Uhr.

**Regel:** «stimmt» heisst: heute an der genannten Quelle gelesen. Was nicht abrufbar war, steht als «nicht belegbar». Hier steht kein Lehrmittel- und kein Artikeltext, nur die Aussage in eigenen Worten. Namen von Personen aus Artikel und Film sind weggelassen.

**Abkürzungen der Pfade:** `A` = herausforderung_A.json · `B` = herausforderung_B.json · `set` = set.json · `kn` = kn.json · `mm` = `spuren.mit_medien` · `om` = `spuren.ohne_medien` · `LFn` = die Leitfrage mit `nr: n`.

**Quellen (Kurzname → URL)**

| Kurz | Quelle |
|---|---|
| SEM-25 | Jahresstatistik Zuwanderung 2025, PDF, 17 Seiten — https://www.sem.admin.ch/dam/sem/de/data/publiservice/statistik/auslaenderstatistik/monitor/2025/statistik-zuwanderung-2025-jahr.pdf |
| SEM-24 | Jahresstatistik Zuwanderung 2024, PDF — https://www.sem.admin.ch/dam/sem/de/data/publiservice/statistik/auslaenderstatistik/monitor/2024/statistik-zuwanderung-2024-jahr.pdf |
| SEM-Asyl-25 | Asylstatistik 2025, Kommentar — https://www.sem.admin.ch/dam/sem/de/data/publiservice/statistik/asylstatistik/2025/stat-jahr-2025-kommentar.pdf.download.pdf/stat-jahr-2025-kommentar-d.pdf |
| SEM-F | Ausweis F — https://www.sem.admin.ch/sem/de/home/themen/aufenthalt/nicht_eu_efta/ausweis_f__vorlaeufig.html |
| SEM-N / SEM-S | https://www.sem.admin.ch/sem/de/home/themen/aufenthalt/nicht_eu_efta/ausweis_n__asylsuchende.html · …/ausweis_s__schutzbeduerftige.html |
| SEM-B/L/C-EU | https://www.sem.admin.ch/sem/de/home/themen/aufenthalt/eu_efta/ausweis_b_eu_efta.html · …/ausweis_l_eu_efta.html · …/ausweis_c_eu_efta.html |
| AsylG | SR 142.31, Fassung vom 12.06.2026 — https://www.fedlex.admin.ch/eli/cc/1999/358/de |
| AIG | SR 142.20, Fassung vom 12.06.2026 — https://www.fedlex.admin.ch/eli/cc/2007/758/de |
| FZA | SR 0.142.112.681, Stand 15.12.2020 — https://www.fedlex.admin.ch/eli/cc/2002/243/de |
| BFS-ZidS | Mitteilung vom 11.03.2025 — https://www.bfs.admin.ch/bfs/de/home/statistiken/bevoelkerung/erhebungen/zids.gnpdetail.2025-0559.html |
| BFS-Mig | Bevölkerung nach Migrationsstatus — https://www.bfs.admin.ch/bfs/de/home/statistiken/bevoelkerung/migration-integration/nach-migrationsstatuts.html |
| BFS-Geb | Bevölkerung nach Geburtsort — https://www.bfs.admin.ch/bfs/de/home/statistiken/bevoelkerung/migration-integration/nach-geburtsort.html |
| BR-Konk | Bericht des Bundesrates vom 30.03.2022 zum Konkubinat im geltenden Recht — https://www.newsd.admin.ch/newsd/message/attachments/70844.pdf |
| HLS-Ausw | Historisches Lexikon der Schweiz, «Auswanderung» — https://hls-dhs-dss.ch/de/articles/007988/ |
| HLS-Konk | Historisches Lexikon der Schweiz, «Konkubinat» — https://hls-dhs-dss.ch/de/articles/016107/ |
| IOM | World Migration Report 2024, Mitteilung vom 07.05.2024 — https://worldmigrationreport.iom.int/news/world-migration-report-2024-reveals-latest-global-trends-and-challenges-human-mobility |
| ILO | Global Estimates on International Migrant Workers, 4. Ausgabe (Dez. 2024), Zusammenfassung — https://www.ilo.org/sites/default/files/2024-12/MIGRANT%20%E2%80%93%20ILO%20Global%20Estimates%20Exec%20Summary_Embargo.pdf |
| SRF-IL | Integrationsschicht SRG, Metadaten und Untertitel (VTT) zur URN der Karte — https://il.srgssr.ch/integrationlayer/2.0/mediaComposition/byUrn/urn:srf:video:c0486414-6e5e-4596-9a02-af69de3cfa8f.json |
| LM | Lehrmittel, lokal: `material/_lehrmittel/3.4_…`, `12.1_Werte.md`, `12.2_Lebensformen.md` (nicht im Repo veröffentlicht) |

## Tabelle

| Nr | Aussage (eigene Worte) | Datei › Feld | Primärquelle | Urteil | Bemerkung |
|---|---|---|---|---|---|
| **A** | **Zahlen des SEM** | | | | |
| 1 | 2025 wanderten 88 355 Personen für eine Erwerbstätigkeit ein, 95 % aus EU/EFTA; häufigster Grund | B › mm.LF3.loesung.zeilen[0], raster_zeilen[0], befund; B › handlungsprodukt.loesungsbild.hinweis; B › abschluss.loesung.mitnahme[1] | SEM-25, S. 11 (Balken und Text) | stimmt | 88 355 ÷ 165 386 = 53,4 % aller Zugänge. |
| 2 | Familiennachzug 2025: 42 170; 53 % EU/EFTA, 47 % Drittstaaten; zweithäufigster Grund | B › mm.LF3.loesung.zeilen[0], raster_zeilen[1] | SEM-25, S. 11 | stimmt | |
| 3 | Aus- und Weiterbildung 2025: 17 579; je 50 % | B › mm.LF3.loesung.zeilen[0], raster_zeilen[2] | SEM-25, S. 11 | stimmt | |
| 4 | Ohne Erwerbstätigkeit 5087; Übrige Zugänge 4076 | B › mm.LF3.loesung.zeilen[1] | SEM-25, S. 11 | stimmt | Anteile 92/8 und 23/77 %. |
| 5 | Übertritte aus dem Asylbereich: am Balken 8119, im Begleittext 8199; alle aus Drittstaaten | B › mm.LF3.loesung.zeilen[2], raster_zeilen[3], befund; B › mm.LF4.loesung.erwartungshorizont (gut_wenn[1], beide Beispiele); Karte q-431b-pflicht › lizenz_hinweis | SEM-25, S. 11 | stimmt | Beide Werte stehen so im PDF. Nur 8119 geht in der Summe auf (Zeile R1); 8199 ist ein Tippfehler des SEM. |
| 6 | Summe der sechs Balken 165 386; sie entspricht dem Total der Publikation | B › mm.LF3.loesung.zeilen[1], zeilen[2] | SEM-25, S. 5 (Total Zuzug 165 386) | stimmt | Nachgerechnet, siehe R1. |
| 7 | Gezählt wird die ständige ausländische Wohnbevölkerung: Ausweis C, B und L ab zwölf Monaten; Asylsuchende (N) und vorläufig Aufgenommene (F) zählen nicht | B › mm.LF3.scaffolding.strategien[1]; B › mm.LF3.loesung.zeilen[3]; set › glossar[27] | SEM-25, S. 16 (Glossar) | stimmt | Die Definition schliesst «Übertritte aus dem Asylbereich» ausdrücklich ein. |
| 8 | Die Statistik zählt nicht, wer «im Asylverfahren ist (Ausweis N, F)» | B › mm.LF3.loesung.befund | SEM-25, S. 16; SEM-F; AIG Art. 83 | stimmt nicht | Ungenau: Wer Ausweis F hat, ist nicht mehr im Verfahren (Wegweisung verfügt, Vollzug ausgesetzt). Das SEM sagt «Asylbereich» bzw. «Asylprozess». Korrektur siehe K1. |
| 9 | Die Grafik zählt keine Asylgesuche; «nur 5 Prozent wegen Asyl» ist ein Fehlschluss | B › mm.LF3.loesung.zeilen[3]; B › mm.LF4.loesung.erwartungshorizont.nicht_tragfaehig | SEM-25, S. 11, 16; SEM-Asyl-25 | stimmt | Zum Vergleich: 2025 wurden 25 781 Asylgesuche gestellt (SEM-Asyl-25). Rechnung R3. |
| 10 | Wer übertritt, sagt der Ausschnitt (S. 11) nicht | B › mm.LF4.loesung.erwartungshorizont.gut_wenn[2] | SEM-25, S. 11 und S. 16 | stimmt | S. 16 sagt es: drei Fälle — anerkannte Flüchtlinge nach Asylgewährung, Härtefallregelung nach dem Asylprozess, ausländerrechtliche Regelung nach dem Asylprozess. Für die Lehrperson nützlich; Vorschlag E1. |
| 11 | 2024: 89 410 (95 % EU/EFTA), 42 433, 17 652, Übertritte 11 433; Summe 170 607; Balken und Text gleich | B › mm.LF3.loesung.zeilen[5]; B › mm.LF4.loesung.erwartungshorizont.gut_wenn[1] | SEM-24, S. 11 und S. 5 | stimmt | Dazu 4655 und 5024; Anteile 51/49 (Familie), 49/51 (Bildung). Rechnung R2. |
| 12 | Fehlschluss 2024: «knapp 7 Prozent» (6,7 %) | B › mm.LF3.loesung.zeilen[5] | SEM-24 | stimmt | 11 433 ÷ 170 607 = 6,70 %. |
| 13 | Die Definition der ständigen Wohnbevölkerung steht auf «S. 16» | B › mm.LF3.scaffolding.strategien[1]; B › mm.LF3.loesung.zeilen[3] | SEM-25 S. 16; SEM-24 **S. 15** | stimmt | Gilt für die Pflichtquelle. In der Ersatzquelle (2024) steht dieselbe Definition auf S. 15. Vorschlag E2. |
| 14 | Karte q-431b-pflicht: Titel, Herausgeber, S. 11, Darstellung 3.1 | q-431b-pflicht › titel, titel_original, herausgeber, verortung | SEM-25 | stimmt | HTTP 200, PDF. Gedruckte Seitenzahl 11 = PDF-Seite 11; `#page=11` trifft. |
| 15 | Karte q-431b-pflicht: Datum «2026-02» | q-431b-pflicht › datum | SEM-25 (PDF-Metadaten) | nicht belegbar | Die Metadaten nennen ein Erstelldatum vom 12.01.2026; ein Publikationsmonat steht weder im PDF noch war er auf der SEM-Übersichtsseite zu finden. |
| 16 | Karte q-431b-pflicht-ersatz: Titel, S. 11, Datum «2025-02» | q-431b-pflicht-ersatz › titel, datum, verortung | SEM-24 (PDF erstellt 18./19.02.2025) | stimmt | HTTP 200; `#page=11` trifft. |
| 17 | Wortzahl Begleittext 131 (2025) und 136 (2024) | q-431b-pflicht › woerter; q-431b-pflicht-ersatz › woerter | SEM-25, SEM-24 | stimmt | Fliesstext rund 100 Wörter, mit Titel und Balkenbeschriftung plausibel. |
| **B** | **Zahlen des BFS** | | | | |
| 18 | Fast 90 % haben oft mit Menschen anderer Staatsangehörigkeit, Religion oder Hautfarbe zu tun (Abs. 2) | A › mm.LF3.loesung.zeilen[5] | BFS-ZidS, Abs. 2 | stimmt | |
| 19 | Kontakte meist harmonisch; ein Drittel fühlt sich gestört (Abs. 2) | A › mm.LF3.loesung.zeilen[5]; A › mm.LF4.loesung.erwartungshorizont.gut_wenn[3] | BFS-ZidS, Abs. 2 | stimmt | |
| 20 | Rund zwei Drittel offen; der Trend zu mehr Offenheit ist gebrochen (Abs. 3) | A › mm.LF3.loesung.zeilen[5] | BFS-ZidS, Abs. 3 | stimmt | Im selben Absatz: Index fremdenfeindlicher Einstellungen 2020–2024 von 2,1 auf 2,3 (Skala 1–4). |
| 21 | 27 % mit Diskriminierungserfahrung (Abs. 4) | A › mm.LF3.loesung.zeilen[5] | BFS-ZidS, Abs. 4 | stimmt | |
| 22 | Karte: Titel, Herausgeber, Datum 11.03.2025, Absätze 1–5, rund 260 Wörter | q-431a-pflicht-ersatz › titel, datum, verortung, woerter | BFS-ZidS | stimmt | HTTP 200. Fünf Absätze, drei Zwischentitel (ohne Nummer). Der Text wird im Browser aufgebaut — wie die Karte vermerkt. |
| **C** | **Recht** | | | | |
| 23 | Flüchtling ist, wer wegen Religion, Nationalität, sozialer Gruppe, politischer Anschauung oder aus rassistischen Gründen ernsthaft bedroht ist | B › leitfragen[0].loesung.zeilen[3] | AsylG Art. 3 Abs. 1–2 | stimmt | Das Gesetz schreibt «Rasse» und nennt auch die begründete Furcht vor solchen Nachteilen. |
| 24 | Als Asylgrund gilt nur Verfolgung | B › leitfragen[0].text, loesung.kern; B › om.LF4 und mm.LF4 (text, gut_wenn, Beispiele); set › glossar[19]; B › handlungsprodukt.loesungsbild.bloecke[0].text[3] | AsylG Art. 2, 3 | stimmt | Vertretbare Kurzform. |
| 25 | Krieg und Hunger geben kein Recht auf dauerhaften Aufenthalt | B › leitfragen[0].loesung.zeilen[3]; B › om.LF4.loesung.erwartungshorizont; B › om.kasten_s4.loesung_zeilen[1] | AsylG Art. 3, 4; AIG Art. 83 Abs. 4, Art. 84 | stimmt | Krieg steht nicht in Art. 3. Es gibt zwei Wege auf Zeit: vorläufige Aufnahme (AIG 83) und vorübergehenden Schutz (AsylG 4, Ausweis S). Den zweiten nennt das Heft nicht — Hinweis H2. |
| 26 | «Krieg ist ein Asylgrund» als Tatsache ist nicht tragfähig | B › om.LF4 und mm.LF4 › loesung.erwartungshorizont.nicht_tragfaehig | AsylG Art. 3 | stimmt | Wer im Krieg zusätzlich persönlich verfolgt wird, kann Flüchtling sein; als allgemeine Tatsache ist der Satz falsch. |
| 27 | Vorläufige Aufnahme: der Vollzug der Wegweisung ist unzulässig, unzumutbar oder unmöglich; Ausweis F | B › mm.LF4.scaffolding.strategien[0]; B › mm.quellen[2].erwartung | AIG Art. 83 Abs. 1; SEM-F | stimmt | |
| 28 | «Unzulässig: Person gefährdet. Unzumutbar: etwa Krieg. Unmöglich: Land nimmt sie nicht auf.» | B › mm.LF4.scaffolding.strategien[1] | AIG Art. 83 Abs. 2–4 | stimmt nicht | Das Gesetz: unzulässig = Völkerrecht steht entgegen (Abs. 3); unzumutbar = konkrete Gefährdung durch Krieg, Bürgerkrieg, allgemeine Gewalt, medizinische Notlage (Abs. 4); unmöglich = Ausreise oder Rückführung geht nicht (Abs. 2). «Person gefährdet» gehört zur Unzumutbarkeit. Korrektur K2. |
| 29 | Die SEM-Seite nennt unzulässig (Völkerrecht), unzumutbar (konkrete Gefährdung), unmöglich; das Lehrmittel ordnet die Gefährdung «unzulässig» zu und Krieg «unzumutbar» | B › mm.quellen[2].erwartung | SEM-F; AIG Art. 83; LM S. 114 | stimmt | Beide Wiedergaben stimmen. In der Sache deckt sich die SEM-Seite mit dem Gesetz; das Lehrmittel ist bei «unzulässig» unscharf, bei «unzumutbar» (Krieg, Notlage) nahe am Gesetz. «Beides gilt mit Fundstelle» ist vertretbar; Ergänzung K3. |
| 30 | Unzumutbar ist die Rückschaffung etwa wegen Krieg oder schwerer Notlage | B › om.LF4.scaffolding.strategien[1]; B › om.LF4.loesung.erwartungshorizont; B › abschluss.loesung.verbindungen[5] | AIG Art. 83 Abs. 4 | stimmt | Das Gesetz verlangt eine konkrete Gefährdung im Einzelfall; das Heft sagt das im Hinweis zum Lösungsbild. |
| 31 | Vorläufige Aufnahme = «Asylgesuch abgelehnt, Rückkehr aber nicht möglich oder unzumutbar: Ausweis F» | set › glossar[20]; B › leitfragen[1].scaffolding.strategien[1] | AIG Art. 83 Abs. 1, 8; AsylG Art. 44 | stimmt nicht | Zwei Lücken: (a) der dritte Grund «unzulässig» fehlt; (b) ein abgelehntes Asylgesuch ist der häufigste, nicht der einzige Weg — Voraussetzung ist eine Wegweisung; auch anerkannte Flüchtlinge mit Asylausschlussgrund werden vorläufig aufgenommen (Abs. 8). Korrektur K4. |
| 32 | Nachbar: kein Asylgrund, Rückkehr unzumutbar, vorläufige Aufnahme, Ausweis F | B › leitfragen[1].loesung.zeilen[3]; B › om.kasten_s4.loesung_zeilen[1] | AIG Art. 83 Abs. 4; SEM-F | stimmt | Als Fall stimmig. |
| 33 | Die vorläufige Aufnahme gilt zwölf Monate; der Kanton verlängert um je zwölf Monate (Satz 3) | B › mm.quellen[2].erwartung | SEM-F | stimmt | So auf der Seite, letzte Änderung 10.11.2025. |
| 34 | Vorläufig Aufgenommene dürfen in der ganzen Schweiz arbeiten (Satz 4) | B › mm.quellen[2].erwartung; q-431b-vertiefung-2 › kurzbeschrieb | SEM-F; AIG Art. 85a Abs. 1 | stimmt | Der Arbeitgeber muss die Stelle melden (Art. 85a Abs. 2). |
| 35 | Rechtsstand der SEM-Seite: 10.11.2025 | B › mm.quellen[2].erwartung; q-431b-vertiefung-2 › datum, lizenz_hinweis | SEM-F («Letzte Änderung 10.11.2025») | stimmt | Heute unverändert. |
| 36 | Asylsuchende haben Ausweis N; solange das Verfahren läuft, dürfen sie bleiben | kn › hybrid_situation.text; B › prinzip_handoff.kn_aktivierung | SEM-N; AsylG Art. 42 | stimmt | |
| 37 | Bezeichnungen der Ausweise B, C, L, F, N (im Heft verwendet) | B › leitfragen[1].loesung; set › glossar[27] | SEM-25 S. 16; SEM-F; SEM-N; SEM-B/L/C-EU | stimmt | Ci, G und S nennt das Heft nicht. Die EU/EFTA-Seiten zu Ci und G sowie die Seite zu S sind erreichbar. |
| 38 | Die Personenfreizügigkeit trat 2002 in Kraft | A › om.LF3.loesung.zeilen[1] | FZA (in Kraft 01.06.2002) | stimmt | |
| 39 | Personenfreizügigkeit ist ein Recht «für Angehörige der EU» | set › glossar[17]; B › leitfragen[1].scaffolding.strategien[0]; B › leitfragen[1].loesung.zeilen[1]; B › abschluss.loesung.verbindungen[2]; B › mm.LF3.loesung.zeilen[4] | FZA; SEM-25 S. 16 (EFTA) | stimmt nicht | Unvollständig: Sie gilt ebenso für die EFTA-Staaten Island, Liechtenstein und Norwegen (EFTA-Übereinkommen). In der Spur mit Medien steht «EU/EFTA» in der Grafik neben «EU» im Glossar. Der Zusatz «laut Lehrmittel» macht den Satz ehrlich, nicht vollständig. Korrektur K5. |
| 40 | Bedingung: eine Stelle oder der eigene Lebensunterhalt | B › leitfragen[1].loesung.zeilen[1]; set › glossar[17] | FZA Anhang I Art. 6 und 24 | stimmt | Für Nichterwerbstätige zusätzlich eine Krankenversicherung. |
| 41 | Ausweis B EU/EFTA bei einem Vertrag ab einem Jahr, sonst L | B › leitfragen[1].loesung.zeilen[1] | SEM-B/L/C-EU; FZA Anhang I Art. 6 | stimmt | Vereinfacht: L gilt für Verträge von drei Monaten bis unter einem Jahr; darunter genügt eine Meldung ohne Bewilligung. B ist fünf Jahre gültig. |
| 42 | «Nach fünf bis zehn Jahren Ausweis C» | — | SEM-B/L/C-EU | — | Steht nicht (mehr) im Heft. Zur Kenntnis: SEM nennt fünf oder zehn Jahre, je nach Staat. |
| 43 | Duales System: Drittstaaten nur Führungskräfte, Spezialistinnen und Spezialisten, qualifizierte Arbeitskräfte | prinzip › quellen_anker.konzepte; B › prinzip_handoff.lehrmittel_anker | AIG Art. 21, 23 | stimmt | Nur als Begriff genannt, keine eigene Aussage im Heft. |
| 44 | Familiennachzug: Angehörige ziehen zu einer Person, die schon hier lebt | set › glossar[18]; B › leitfragen[1].loesung.zeilen[2] | SEM-25 S. 16; AIG Art. 42–44; FZA Anhang I Art. 3 | stimmt | |
| 45 | Drittstaat: weder EU noch EFTA | set › glossar[26]; B › mm.quellen[0].auftrag | SEM-25 S. 16 | stimmt | |
| 46 | Stagiaires-Abkommen Schweiz–Philippinen; «Drittstaatenbewilligung» | — | — | — | Das Heft behauptet dazu nichts; beides steht nur im Artikel (Abs. 1 und 7). Nicht geprüft. |
| 47 | Das Konkubinat ist gesetzlich nicht geregelt | A › leitfragen[0].loesung.zeilen[3] | BR-Konk (Auftrag, Zusammenfassung) | stimmt | Der Bericht sagt es wörtlich so; einzelne Gesetze knüpfen punktuell Wirkungen daran. |
| 48 | Früher war das Konkubinat in einigen Kantonen verboten, heute ist es verbreitet | A › leitfragen[0].loesung.zeilen[3] | HLS-Konk | stimmt | Mitte der 1970er-Jahre Verbote in 14 Kantonen; das Wallis hob seines zuletzt auf (Mitte der 1990er-Jahre). |
| 49 | KN: Fall und Fragen behaupten keine Rechtsfolge | kn › hybrid_situation, kn_typen[*] | AsylG Art. 42; SEM-N | stimmt | «Er muss ja sowieso wieder gehen» ist eine Stimme im Fall. Dass ein Verein die Lizenz lösen kann, setzt der Fall offen voraus. Hinweis H2 (Krieg und Ausweis S). |
| 50 | Krieg allein ist kein Asylgrund; eine vorläufige Aufnahme ist möglich | B › prinzip_handoff.kn_aktivierung | AsylG Art. 3; AIG Art. 83 Abs. 4 | stimmt | |
| **D** | **Zahlen «laut Lehrmittel»** | | | | |
| 51 | Über 280 Millionen Menschen leben fern ihrer Heimat | B › om.LF3.loesung (zeilen[0], raster_zeilen[1], befund); B › handlungsprodukt.loesungsbild (text[1], Belege); B › abschluss.loesung.mitnahme[1] | LM S. 107; IOM (281 Mio.); ILO (284,5 Mio. im Jahr 2022) | stimmt | Wiedergabe richtig. Als Untergrenze gilt die Zahl weiter; die UNO-Schätzung für 2024 liegt laut Suchauszug bei rund 304 Mio. (PDF der UNO nicht lesbar). |
| 52 | Mehr als die Hälfte davon ging aus wirtschaftlichen Gründen | B › om.LF3.loesung (zeilen[0], raster_zeilen[1], befund); B › handlungsprodukt.loesungsbild.bloecke[0].text[1]; bloecke[1].eintraege[0]; B › abschluss.loesung.mitnahme[1] | LM S. 107; ILO; IOM | nicht belegbar | Wiedergabe richtig, aber keine Quelle misst den Grund. Die ILO zählt 167,7 von 284,5 Mio. Migrantinnen und Migranten als Erwerbspersonen (59 %) — das ist Erwerbsbeteiligung, kein Wanderungsgrund. Die IOM nennt keinen Anteil. Im Musterbrief ist die Zahl Beleg 1: Vorschlag N1. |
| 53 | Rund 120 Millionen Vertriebene, Stand Mai 2024 (UNHCR) | B › om.LF3.loesung (zeilen[0], raster_zeilen[1]) | LM S. 107; unhcr.org | nicht belegbar | Wiedergabe richtig, Stand ist genannt. unhcr.org lieferte heute HTTP 403 (Seiten und PDF). Suchauszüge von unhcr.org nennen 123,2 Mio. (Ende 2024), 117,3 Mio. (Mitte 2025), 117,8 Mio. (Ende 2025); die Grössenordnung passt. Die Mehrheit sind Binnenvertriebene — «nicht verrechnen» im Heft ist richtig. |
| 54 | Auswanderung nach Übersee: rund 50 000, 70 000, 90 000, 180 000; zusammen rund 390 000 | B › om.LF3.raster.beispielzeile; B › om.LF3.loesung (zeilen[1], raster_zeilen[0]) | LM S. 109; HLS-Ausw | stimmt | HLS: 1851–1860 rund 50 000; 1860er- und 1870er-Jahre je 35 000; 1881–1890 über 90 000; 1891–1930 je Jahrzehnt 40 000–50 000 (also 160 000–200 000). Rechnung R4. |
| 55 | Zuerst aus Not ausgewandert, später für mehr Wohlstand und bessere Berufschancen | B › om.LF3.loesung (zeilen[0], raster_zeilen[3], befund); B › handlungsprodukt.loesungsbild.bloecke[0].text[1]; set › gemeinsamer_auftrag.erwartungshorizont.gut_wenn[0] | LM S. 109; HLS-Ausw | stimmt | HLS nennt Agrarkrisen und Hungerjahre und, gegen Ende des 19. Jahrhunderts, die Berufschancen. |
| 56 | Die Schweiz war im 19. Jahrhundert ein Auswanderungsland | set › glossar[25] | HLS-Ausw | stimmt | |
| 57 | Mehr als ein Drittel der Bevölkerung hat einen Migrationshintergrund | A › leitfragen[0].loesung.zeilen[0] | LM S. 111; BFS-Mig | überholt | BFS 2024: 41 % der ständigen Wohnbevölkerung ab 15 Jahren (3,086 Mio.). «Mehr als ein Drittel» ist nicht falsch, untertreibt aber. Korrektur K6. |
| 58 | Migrationshintergrund hat, wer selbst eingewandert ist oder **einen** eingewanderten Elternteil hat | set › glossar[0]; A › leitfragen[0].loesung.zeilen[0]; A › abschluss.loesung.verbindungen[0] | LM S. 111; BFS-Mig (Definition) | stimmt nicht | Wiedergabe des Lehrmittels richtig, die Definition des BFS ist enger: Gebürtige Schweizerinnen und Schweizer zählen nur dazu, wenn **beide** Eltern im Ausland geboren sind; Eingebürgerte und Ausländerinnen und Ausländer zählen dazu, ausser beide Eltern sind in der Schweiz geboren. Korrektur K6. |
| 59 | Ein Viertel der Einwohnerinnen und Einwohner ist im Ausland geboren | A › leitfragen[0].loesung.zeilen[0] | LM S. 111; BFS-Geb | überholt | BFS: knapp ein Drittel der ständigen Wohnbevölkerung. Korrektur K6. |
| 60 | Einwanderungsgründe: Erwerbstätigkeit, Familiennachzug, Aus- und Weiterbildung, Übertritt aus dem Asylbereich; Liste nicht vollständig | A › leitfragen[0].loesung.zeilen[1] | LM S. 111; SEM-25 S. 11 | stimmt | Dieselben vier Kategorien wie beim SEM; dort zusätzlich «ohne Erwerbstätigkeit» und «Übrige». |
| 61 | Ausländerinnen und Ausländer leisten rund die Hälfte der Arbeit in Gastgewerbe und Bau | A › om.LF3.loesung.zeilen[1]; B › leitfragen[1].loesung.zeilen[2] | LM S. 111; BFS (Erwerbstätigenstatistik) | nicht belegbar | Wiedergabe richtig. Die BFS-Tabelle nach Wirtschaftsabschnitt und Nationalität war nicht maschinell abrufbar; die BFS-Themenseite nennt nur das Total (2. Quartal 2026: 1,895 Mio. ausländische Erwerbstätige). Vorschlag N2. |
| 62 | Rund 40 % Ausländeranteil in Industrie, Energie, Wasser | — | — | — | Steht nicht im Heft. |
| 63 | Im Gesundheits- und Sozialwesen ist ein Drittel der Angestellten «ausländischer Herkunft» | B › leitfragen[1].loesung.zeilen[1]; B › handlungsprodukt.loesungsbild.bloecke[0].text[2]; bloecke[1].eintraege[1] | LM S. 111; BFS | nicht belegbar | Wiedergabe richtig. Quelle wie Nr. 61 nicht abrufbar; zudem ist «Herkunft» kein Merkmal der BFS-Statistik (dort Staatsangehörigkeit oder Migrationsstatus). Im Musterbrief ist die Zahl Beleg 2: Vorschlag N2. |
| 64 | Etwa 2,4 % der ausländischen Wohnbevölkerung kamen über das Asylverfahren (Bestand, ohne Jahr) | B › handlungsprodukt.loesungsbild.hinweis; B › mm.LF4.loesung.erwartungshorizont.gut_wenn[2] | LM S. 114; SEM-Asyl-25; SEM-25 | nicht belegbar | Wiedergabe richtig; die Zahl lässt sich nicht nachvollziehen. Ende 2025: 94 261 anerkannte Flüchtlinge bei 2 414 408 Personen der ständigen ausländischen Wohnbevölkerung = 3,9 % (R5); dazu 42 275 vorläufig Aufgenommene. Das Heft warnt bereits vor der Zahl; Vorschlag N3. |
| 65 | «Die wenigsten seien verfolgt» lässt sich mit dem Material des Hefts nicht prüfen | B › mm.LF3.loesung.zeilen[3]; B › handlungsprodukt.loesungsbild.hinweis | SEM-Asyl-25 | stimmt | Für die Lehrperson: 2025 lag die Asylgewährungsquote bei 27,1 %, die Schutzquote (mit vorläufigen Aufnahmen) bei 43,8 %; 2024 bei 34,2 % und 54,1 %. Vorschlag E3. |
| 66 | Die Arbeitslosenquote ist ohne Schweizer Pass höher | set › glossar[10]; A › om.LF3.loesung (zeilen[0], raster_zeilen[1]) | LM S. 111 | nicht belegbar | Wiedergabe richtig; SECO/BFS heute nicht abgerufen. Das Heft schreibt «laut Lehrmittel». |
| 67 | In Krisenjahren gingen mehr ausländische Arbeitskräfte, als kamen; so blieb die Arbeitslosigkeit im Land tiefer | A › om.LF3.loesung (zeilen[0], raster_zeilen[1]) | LM S. 111 | nicht belegbar | Wiedergabe richtig (das Lehrmittel nennt 1990–1999 und die 1970er-Jahre). Wanderungssaldo je Jahr heute nicht geprüft; für das ganze Jahrzehnt 1990–1999 ist der Satz zweifelhaft. Vorschlag N4. |
| 68 | Integration war lange kein Ziel; eine Landessprache zu lernen galt als zweitrangig | set › glossar[11]; A › om.LF3.loesung (zeilen[0], raster_zeilen[2], befund) | LM S. 112 | nicht belegbar | Wiedergabe richtig; historisch heute nicht an einer Primärquelle geprüft. |
| 69 | Wer geht, wählt Staaten, in denen schon Landsleute leben | B › om.LF3.loesung (zeilen[1], raster_zeilen[2]) | LM S. 107 | nicht belegbar | Wiedergabe richtig; allgemeine Aussage, nicht geprüft. |
| 70 | Hoher Ausländeranteil: stetige Zuwanderung und hohe Hürden bei der Einbürgerung | B › om.LF3.loesung.zeilen[1] | LM S. 108 | nicht belegbar | Wiedergabe richtig; nicht geprüft. |
| 71 | Push- und Pull-Faktoren: je vier; Verfolgung ist einer von vier Push-Faktoren | B › leitfragen[0].loesung.zeilen[1–2]; B › abschluss.loesung.verbindungen[4] | LM S. 106 | stimmt | Wiedergabe; Zählung stimmt. |
| 72 | Assimilation und Integration; wie weit Anpassung gehen muss, ist umstritten | A › leitfragen[1].loesung.zeilen[0–1]; set › glossar[4–5]; set › gemeinsamer_auftrag.erwartungshorizont.gut_wenn[1] | LM S. 112 | stimmt | Wiedergabe. |
| 73 | Lebensformen: Alleinleben, Partnerschaft, Konkubinat; Patchworkfamilie und Paar ohne Kinder nur nebenbei | A › leitfragen[0].loesung.zeilen[2] | LM S. 292, 299 | stimmt | Wiedergabe. |
| 74 | Seitenangaben der Methodenkarten (S. 368, 373, 381–382, 394, 397) | A › prinzip_handoff.lehrmittel_anker; B › prinzip_handoff.lehrmittel_anker; set › gemeinsamer_auftrag.erwartungshorizont.gut_wenn[2] | LM (Seitenmarker) | stimmt | Die Marker stehen in Kap. 16.2, 16.4, 17.2, 17.3. |
| **E** | **Quellenkarten und Zählweise** | | | | |
| 75 | q-431a-pflicht: Titel, SRF News, 15.10.2025, Lead und zwölf Absätze | q-431a-pflicht › titel, datum, verortung | SRF-Seite der Karte | stimmt | HTTP 200. Veröffentlicht 15.10.2025, 16:25; zuletzt geändert am selben Tag, 20:08. |
| 76 | Wortzahl 448 | q-431a-pflicht › woerter | SRF-Seite | stimmt | Gezählt: Lead 14 + Absätze 419 = 433; mit zwei Zwischentiteln 439, mit Titel 450. Plausibel. |
| 77 | Absatzzählung: Abs. 1–2 Entlastung und sieben Fachkräfte seit Frühjahr 2024; Abs. 3–4 Aufwand, Sprache, B2, drei von sieben nach der Probezeit; Abs. 5 Achterbahn; Abs. 8–9 Verband; Abs. 10 wertvolle Erfahrung; Abs. 12 Bilanz nach 18 Monaten; Galerie nach Abs. 3 | A › mm.LF3.loesung (zeilen[0–1], zeilen[4], raster_zeilen, befund); A › mm.LF4.loesung.erwartungshorizont | SRF-Seite | stimmt | Alle Nummern treffen, wenn Zwischentitel, Galerie und Bildlegenden nicht zählen. |
| 78 | Deutung «enttäuscht (Abs. 12)» | A › mm.LF3.loesung.zeilen[2] | SRF-Seite | stimmt nicht | Die Ernüchterung der Pflegenden steht in Abs. 11; Abs. 12 zieht die Bilanz. Korrektur K7. |
| 79 | Kurzbeschrieb q-431a-pflicht: Ende nach 18 Monaten, sieben Fachkräfte, drei Stimmen | q-431a-pflicht › kurzbeschrieb | SRF-Seite | stimmt | Der Lead sagt «für immer», Abs. 12 «vorerst»: Widerspruch in der Quelle selbst. Das Heft folgt Abs. 12. |
| 80 | q-431a-vertiefung-1: Titel, DOK, 19.12.2018, Sendung von 52 Minuten, kein eigenes Segment | q-431a-vertiefung-1 › titel, datum, lizenz_hinweis | SRF-IL | stimmt | Embed-URL HTTP 200. Dauer 51:45; keine Segmente; Untertitel (VTT) öffentlich abrufbar. |
| 81 | Ausschnitt 22:49–26:52 = 243 Sekunden | q-431a-vertiefung-1 › verortung, dauer_sek; A › mm.quellen[1].leitfrage_vertiefung | SRF-IL (VTT) | stimmt | Rechnung R6. |
| 82 | Zeitmarken 23:01–23:32 (Aufgabe des Poliers, Verantwortung), 24:06, 25:13–25:23, 26:00 | A › mm.quellen[1].erwartung | SRF-IL (VTT) | stimmt | Der Satz zur Schuld bei Fehlern folgt erst 23:32–23:37; genauer wäre 23:01–23:37 (K8). Die Stimmen ab 22:57 und ab 24:48 sind in den Untertiteln nicht bezeichnet; «Polier» und «Baggerführer» sind aus dem Inhalt erschlossen. |
| 83 | q-431a-vertiefung-2: Titel, swissinfo, 19.09.2022, Abs. 1–3, 189 Wörter, zuletzt geändert 24.03.2026 | q-431a-vertiefung-2 › alle Felder; A › mm.quellen[2].erwartung | swissinfo-Seite der Karte | stimmt | HTTP 200. Wortzahl exakt (48 + 81 + 60). Abs. 2: Fähigkeiten des Teams; Abs. 3: Wertschätzung unabhängig von Geschlecht, ethnischer Zugehörigkeit, Alter. Ein Satz in Abs. 2 nennt noch «bis Ende 2023». |
| 84 | q-431b-vertiefung-1: Titel, SRF News, 02.09.2025, Lead und elf Absätze, 485 Wörter | q-431b-vertiefung-1 › titel, datum, verortung, woerter | SRF-Seite der Karte | stimmt | HTTP 200. Wortzahl exakt. Veröffentlicht und zuletzt geändert 02.09.2025, 17:37 — seither **nicht** aktualisiert; der Ausgang des Verfahrens steht nicht im Artikel. |
| 85 | Absatzzählung: Abs. 1 Ausbildung und Heim seit Mai 2025; Abs. 3 Ausbildung tut gut; Abs. 4 Mehrwert; Abs. 11 einmal abgelehnt, Rekurs | B › mm.quellen[1].erwartung | SRF-Seite | stimmt | Abs. 9 (Investition für beide Seiten) stimmte im früheren Text ebenfalls. Abs. 7–9 stehen unter einem Kastentitel; wer den Kasten auslässt, zählt anders (E4). |
| 86 | Kurzbeschrieb: «ihr Asylentscheid steht noch aus» | q-431b-vertiefung-1 › kurzbeschrieb | SRF-Seite, Abs. 11 | stimmt nicht | Laut Artikel gab es schon einen negativen Entscheid; offen ist der Rekurs. Korrektur K9. |
| 87 | q-431b-vertiefung-2: Titel, Datum 10.11.2025, ein Absatz, 101 Wörter | q-431b-vertiefung-2 › titel, datum, verortung, woerter | SEM-F | stimmt | HTTP 200. Unter dem Absatz steht noch ein Einzelsatz zum Ausweis. Herausgeber ist abgekürzt geschrieben (K10). |
| 88 | Kurzbeschrieb q-431b-vertiefung-2 nennt, dass die Person in der ganzen Schweiz arbeiten darf | q-431b-vertiefung-2 › kurzbeschrieb | — | stimmt nicht | Sachlich richtig, verrät aber die halbe Antwort auf die Vertiefungsfrage («… und was darf die Person?»). Korrektur K10. |
| **F** | **Stand-Angaben und Daten** | | | | |
| 89 | «Stand Mai 2024» bei den Vertriebenen; 280 Millionen ohne eigenes Datum | B › om.LF3.loesung; B › handlungsprodukt.loesungsbild.hinweis | LM S. 107 | stimmt | Wiedergabe. |
| 90 | «Stand September 2025» zum Artikel | B › mm.quellen[1].erwartung; q-431b-vertiefung-1 › lizenz_hinweis | SRF-Seite | stimmt | |
| 91 | «Artikel vom 15.10.2025» | A › mm.LF3.loesung.zeilen[4] | SRF-Seite | stimmt | |
| 92 | «Seite von 2022, geändert am 24.3.2026» | A › mm.quellen[2].erwartung; q-431a-vertiefung-2 › lizenz_hinweis | swissinfo-Seite | stimmt | |
| 93 | `quelle_stand` 2026-10-05 (viermal), `sachlage_geprueft` 2026-10-04 (acht Karten), `erstellt_am` 2026-10-05 | A, B › …loesung.quelle_stand; Karten; prinzip, kn | heutige Abrufe | stimmt | Alle acht Quellen sind heute unverändert erreichbar; keine ist seit dem 04.10.2026 geändert worden. |
| 94 | «Film von 2018» | q-431a-vertiefung-1 › lizenz_hinweis | SRF-IL | stimmt | |

## Erreichbarkeit der acht URLs (2026-10-06)

| Karte | HTTP | Befund |
|---|---|---|
| q-431a-pflicht | 200 | Artikel vollständig, zwölf Absätze |
| q-431a-pflicht-ersatz | 200 | Text nur mit JavaScript sichtbar |
| q-431a-vertiefung-1 | 200 | Player; URN gültig, Untertitel vorhanden |
| q-431a-vertiefung-2 | 200 | drei Absätze |
| q-431b-pflicht | 200 | PDF, `#page=11` zeigt auf die gedruckte Seite 11 |
| q-431b-pflicht-ersatz | 200 | PDF, `#page=11` zeigt auf die gedruckte Seite 11 |
| q-431b-vertiefung-1 | 200 | Artikel vollständig, elf Absätze, nicht aktualisiert |
| q-431b-vertiefung-2 | 200 | letzte Änderung 10.11.2025 |

## Stimmt nicht — zu korrigieren

- **K1** (Nr. 8) · `herausforderung_B.json › spuren.mit_medien.leitfragen[0].loesung.befund`: «wer im Asylverfahren ist (Ausweis N, F)» → **«wer zum Asylbereich zählt (Ausweis N und F)»**.
- **K2** (Nr. 28) · `herausforderung_B.json › spuren.mit_medien.leitfragen[1].scaffolding.strategien[1]` → **«Unzulässig: Völkerrecht verbietet es. Unzumutbar: Gefahr, etwa Krieg. Unmöglich: Ausreise geht nicht.»** (AIG Art. 83 Abs. 2–4).
- **K3** (Nr. 29) · `herausforderung_B.json › spuren.mit_medien.quellen[2].erwartung`: nach «beides gilt mit Fundstelle» ergänzen: **«Massgebend ist das Gesetz (AIG Art. 83 Abs. 2–4); die Seite des SEM folgt ihm.»**
- **K4** (Nr. 31) · `set.json › glossar[20].definition` → **«Wer gehen müsste, darf vorläufig bleiben, wenn die Rückkehr unzulässig, unzumutbar oder unmöglich ist: Ausweis F.»** Dieselbe Lücke in `herausforderung_B.json › leitfragen[1].scaffolding.strategien[1]` → **«Vorläufige Aufnahme: meist Asylgesuch abgelehnt, Rückkehr aber unzumutbar oder unmöglich (S. 114).»**
- **K5** (Nr. 39) · `set.json › glossar[17].definition` → **«Recht für Angehörige der EU- und EFTA-Staaten, herzukommen und zu bleiben, etwa mit einer Stelle.»** Entsprechend: `herausforderung_B.json › leitfragen[1].scaffolding.strategien[0]` («mit EU und EFTA»); `leitfragen[1].loesung.zeilen[1].text` («Personenfreizügigkeit mit EU und EFTA; das Lehrmittel nennt nur die EU»); `abschluss.loesung.verbindungen[2].text` («Staatsangehörige der EU- und EFTA-Staaten; das Lehrmittel nennt nur die EU»); `spuren.mit_medien.leitfragen[0].loesung.zeilen[4].text` («Personenfreizügigkeit gilt für EU und EFTA; das Lehrmittel, S. 111, nennt nur die EU»).
- **K6** (Nr. 57–59) · `herausforderung_A.json › leitfragen[0].loesung.zeilen[0].text` → **«Laut Lehrmittel: wer selbst eingewandert ist oder einen eingewanderten Elternteil hat. Das Bundesamt für Statistik zählt enger (bei gebürtigen Schweizerinnen und Schweizern: beide Eltern im Ausland geboren). Zahlen des Bundesamts, 2024: 41 % der Bevölkerung ab 15 Jahren; knapp ein Drittel ist im Ausland geboren. Das Lehrmittel nennt ältere Werte (ein Drittel, ein Viertel): auch gültig.»** `set.json › glossar[0].definition` kann bleiben, wenn der Zusatz «(laut Lehrmittel)» dazukommt.
- **K7** (Nr. 78) · `herausforderung_A.json › spuren.mit_medien.leitfragen[0].loesung.zeilen[2].text`: «‹enttäuscht› (Abs. 12)» → **«‹enttäuscht› (Abs. 11–12)»**.
- **K8** (Nr. 82) · `herausforderung_A.json › spuren.mit_medien.quellen[1].erwartung`: «(23:01–23:32)» → **«(23:01–23:37)»**. Geringfügig.
- **K9** (Nr. 86) · `q-431b-vertiefung-1.json › kurzbeschrieb`: «ihr Asylentscheid steht noch aus» → **«ob sie bleiben darf, ist noch offen»**.
- **K10** (Nr. 87–88) · `q-431b-vertiefung-2.json › kurzbeschrieb` → **«Die Behörde erklärt, wer vorläufig aufgenommen wird, für wie lange die Aufnahme gilt und was die Person darf.»** · `herausgeber` → **«Staatssekretariat für Migration»** (wie in den zwei anderen SEM-Karten).

**Ergänzungen (kein Fehler, aber eine Lücke)**

- **E1** (Nr. 10) · `herausforderung_B.json › spuren.mit_medien.leitfragen[1].loesung.erwartungshorizont.gut_wenn[2]`: ergänzen, dass S. 16 der Quelle die drei Fälle nennt (anerkannte Flüchtlinge, Härtefall, ausländerrechtliche Regelung).
- **E2** (Nr. 13) · `herausforderung_B.json › spuren.mit_medien.leitfragen[0].loesung.zeilen[5].text`: anfügen **«Definition dort auf S. 15.»**
- **E3** (Nr. 65) · Für die Lehrperson (Begleiter oder Hinweis zum Lösungsbild): Asylgewährungsquote 2025 27,1 %, Schutzquote 43,8 % (SEM, Asylstatistik 2025) — damit lässt sich die Behauptung des Briefs einordnen, ohne dass die Lernenden sie prüfen müssen.
- **E4** (Nr. 85) · `herausforderung_B.json › spuren.mit_medien.quellen[1].erwartung`: anfügen **«Der Kasten zum Besuch des Bundesrats zählt mit (Abs. 7–9).»**

**Hinweise**

- **H1** · Film, 21:49–27:52 mitgelesen (nur Untertitel, kein Bild, kein Ton). Was in einer Klasse heikel sein kann: **22:49** Einführung einer Person mit vollem Namen, Jahrgang und Geburtsland. **23:32–23:37** «alles meine Schuld» — unkritisch. **26:08–26:28** rund 20 Sekunden Portugiesisch, nicht übersetzt; Inhalt unbekannt. **26:39–26:46** Aufzählung von Ländern, Nationalitäten und einer Sprache; Menschen werden über ihre Nationalität bezeichnet. **26:47** ein Mann wird mit einer Nationalitätsbezeichnung gerufen, die Bezeichnung wird wiederholt — ob als Spitzname unter Kollegen oder abwertend, zeigt nur Bild und Ton. **26:49–26:52** Scherz, welche Nationalität «gewonnen» habe, «wie immer» — eine Rangordnung von Herkünften, auch wenn neckend gemeint. Nach dem Stopp: **27:27** eine Stelle auf Italienisch, nicht übersetzt; **27:42** nächstes Porträt, wieder mit vollem Namen, Jahrgang, Geburtsland. Vor dem Ausschnitt (21:42–22:29) nur Arbeitsdruck auf der Baustelle, unkritisch. Der gekürzte `erwartung`-Text verweist dafür auf den Begleiter; dort müssen 22:49 und 26:39–26:52 stehen.
- **H2** · Krieg und Ausweis S: Für Geflüchtete aus der Ukraine gilt seit März 2022 der Schutzstatus S (AsylG Art. 4), kein Asylverfahren; er ist laut SEM bis mindestens 4. März 2027 nicht aufgehoben und seit 1. November 2025 nach Regionen eingeschränkt. Heft B («Nachbar, vor einem Krieg geflohen, vorläufig aufgenommen») und der KN («vor einem Krieg geflohen, Asylgesuch offen») sind in sich richtig, passen aber nicht auf Lernende oder Angehörige mit Ausweis S. Eine Zeile für die Lehrperson genügt.

## Nicht belegbar — als Fallüberlegung kennzeichnen oder streichen

- **N1** (Nr. 52) · «Mehr als die Hälfte aus wirtschaftlichen Gründen» · `herausforderung_B.json › handlungsprodukt.loesungsbild.bloecke[0].text[1]` und `bloecke[1].eintraege[0]`; `spuren.ohne_medien.leitfragen[0].loesung` (zeilen[0], raster_zeilen[1], befund); `abschluss.loesung.mitnahme[1]`. Keine internationale Stelle misst den Wanderungsgrund so. «Laut Lehrmittel» reicht für eine Rasterzeile, nicht für Beleg 1 der Musterlösung. **Vorschlag:** Im Musterbrief Beleg 1 auf die geprüfte Tabelle umstellen — «Zwischen 1850 und 1930 wanderten laut meinem Lehrmittel rund 390 000 Menschen aus der Schweiz nach Übersee aus» (Kap. 3.4, S. 109; durch das HLS gedeckt) — und in «Meine Belege» entsprechend. In Raster und Befund den Zusatz «laut Lehrmittel; nicht nachprüfbar» setzen.
- **N2** (Nr. 61, 63) · Branchenanteile · `herausforderung_B.json › leitfragen[1].loesung.zeilen[1–2]`; `handlungsprodukt.loesungsbild.bloecke[0].text[2]` und `bloecke[1].eintraege[1]`; `herausforderung_A.json › spuren.ohne_medien.leitfragen[0].loesung.zeilen[1]`. Heute nicht prüfbar; «ausländischer Herkunft» ist zudem kein statistisches Merkmal. **Vorschlag:** im Musterbrief «laut meinem Lehrmittel (ohne Jahr)» ausschreiben und im Hinweis vermerken «nicht nachgeprüft»; besser vor dem Einsatz die BFS-Tabelle «Erwerbstätige nach Wirtschaftsabschnitt und Nationalität» von Hand nachschlagen und den Wert ersetzen.
- **N3** (Nr. 64) · «Etwa 2,4 %» · `herausforderung_B.json › handlungsprodukt.loesungsbild.hinweis`; `spuren.mit_medien.leitfragen[1].loesung.erwartungshorizont.gut_wenn[2]`. Das Heft warnt schon; ergänzen: **«Die Zahl lässt sich mit den Statistiken des SEM nicht nachvollziehen (Ende 2025 rund 3,9 % allein anerkannte Flüchtlinge).»**
- **N4** (Nr. 67) · Weniger Arbeitslosigkeit durch Wegzug in Krisenjahren · `herausforderung_A.json › spuren.ohne_medien.leitfragen[0].loesung.zeilen[0]` und `raster_zeilen[1]`. Als «laut Lehrmittel» kennzeichnen, nicht als Deutung der Lehrperson; das Wort «Nutzen für die Schweiz» streichen oder mit «so das Lehrmittel» versehen.
- (Nr. 53) · 120 Millionen Vertriebene: Stand ist im Heft genannt; unhcr.org war nicht abrufbar. Kann bleiben.
- (Nr. 15) · Datum «2026-02» der Karte q-431b-pflicht: nicht belegt; entweder auf «2026» kürzen oder auf der SEM-Seite von Hand nachsehen.
- (Nr. 66, 68, 69, 70) · Aussagen des Lehrmittels zu Arbeitslosenquote, früherer Integrationspolitik, Kettenmigration und Einbürgerungshürden: im Heft bereits als «laut Lehrmittel» geführt; heute nicht an einer Primärquelle geprüft. Können bleiben.

## Rechnungen nachgerechnet

- **R1** · Summe 2025: 88 355 + 42 170 + 17 579 + 5087 + 8119 + 4076 = **165 386** ✓ (Total S. 5: 165 386). Mit dem Textwert 8199: 165 466 ✗ — der Balkenwert ist der richtige.
- **R2** · Summe 2024: 89 410 + 42 433 + 17 652 + 4655 + 11 433 + 5024 = **170 607** ✓ (Total S. 5: 170 607).
- **R3** · Fehlschluss 2025: 8119 ÷ 165 386 = 4,91 % (mit 8199: 4,96 %) → «rund 5 Prozent» ✓. Fehlschluss 2024: 11 433 ÷ 170 607 = 6,70 % → «knapp 7 Prozent (6,7 %)» ✓.
- **R4** · Auswanderung: 50 000 + 70 000 + 90 000 + 180 000 = **390 000** ✓.
- **R5** · Kontrolle zu «2,4 %»: 94 261 ÷ 2 414 408 = 3,90 % (anerkannte Flüchtlinge Ende 2025 ÷ ständige ausländische Wohnbevölkerung Ende 2025). Passt nicht zu 2,4 %.
- **R6** · Filmausschnitt: 26:52 − 22:49 = 4 Min. 3 Sek. = **243 Sekunden** ✓.
- **R7** · Musterbrief Heft B: Absätze 37 + 41 + 34 + 32 = **144 Wörter** ✓; mit Titel (4 Wörter) **148** ✓; liegt in 120–150 ✓. Mit dem Ersatzargument zur Grafik (33 statt 41 Wörter): 136 — die Zahl steht im aktuellen Hinweis nicht mehr.
- **R8** · Beispielbrief Heft B («halb so lang»): 12 + 21 + 18 + 19 = **70 Wörter**; die Hälfte von 120–150 wäre 60–75 ✓.
- **R9** · Leitfaden Heft A: 1 Frage aus LF2 + 2 Gutes + 2 Schwieriges + 1 Nachhaken = **6** ✓; im Lösungsbild Fragen 2 und 4 (Gutes), 3 und 5 (Schwieriges), 6 (Nachhaken) ✓; «fünf offene Fragen, die sechste hakt nach» ✓.
- **R10** · Artikel Heft A: sieben Fachkräfte, drei nach der Probezeit weg → vier verbleiben ✓ (so auch im Artikel, Abs. 5).
- **R11** · Gemeinsamer Auftrag: CHF 5'200 statt CHF 4'500 = CHF 700 mehr im Monat; das Heft nennt die Differenz nicht, die zwei Beträge stimmen in `situation_text`, `zahlen_tabelle` und Erwartungshorizont überein ✓. Kurzrede 2 Minuten + Antwort 1 Minute ✓.
- **R12** · KN Fachgespräch: 15 Min. Vorbereitung + 15–20 Min. Gespräch = **30–35 Min.** ✓. Wochenplan: 4 × 3 Lektionen; Woche 3 = 2 + 1, Woche 4 = 2 + 1 ✓.
- **R13** · Wortzahlen der Karten: q-431a-vertiefung-2 48 + 81 + 60 = 189 ✓; q-431b-vertiefung-1 Lead 17 + Absätze 468 = 485 ✓; q-431a-pflicht Lead 14 + Absätze 419 = 433 (Karte: 448; mit Zwischentiteln und Titel 450).

## Nicht geprüft oder nicht prüfbar

- unhcr.org (HTTP 403): die Zahl «120 Millionen, Mai 2024» nur über Suchauszüge eingeordnet.
- BFS-Tabellen zu Ausländeranteilen nach Branche und zur Arbeitslosenquote nach Nationalität; Wanderungssaldo der 1990er-Jahre.
- UNO-Schätzung der Migrantenzahl 2024 (PDF nicht lesbar); ch.ch zum Konkubinat (Seite nicht abrufbar; ersetzt durch den Bericht des Bundesrates).
- Publikationsmonat der Jahresstatistik 2025.
- Bild und Ton des Films; die nicht übersetzten Stellen. Der Audiobeitrag zu den zwei SRF-Artikeln.
- Die SEM-Seiten zu den Ausweisen B, C und L für Drittstaatsangehörige (vermutete Adressen ergaben 404); die Bezeichnungen sind über das Glossar der Jahresstatistik belegt.
- `begleiter.md` (nicht Gegenstand). Ob 4.3.1 und 4.3.2 in den Lehrplänen 3J und 4J text- und nummerngleich sind (`set.json › lehrgaenge`), prüft `scripts/sync-einheiten-nrlp.mjs`.

---

## Nachtrag des Orchestrators (2026-10-06, nach den Korrekturrunden)

Die Tabelle oben zeigt den Stand der Dateien zur Zeit des Audits. Danach geändert:

| Nr. | Befund | Was geschehen ist |
|---|---|---|
| K1 | Ausweis F als «im Asylverfahren» | korrigiert in Heft B (Befund und Lösungszeilen der Medien-Spur): «Asylsuchende (N) und vorläufig Aufgenommene (F) zählt sie nicht» |
| K2, K3 | Zuordnung «unzulässig / unzumutbar» | Hefte, Glossar und Begleiter richten sich nach AIG Art. 83 Abs. 2–4; die abweichende Zuordnung des Lehrmittels (S. 114) steht in Lösung und Begleiter |
| K4 | Glossar «vorläufige Aufnahme» | neu gefasst (kein «Asylgesuch abgelehnt» als Voraussetzung); Hilfe bei LF2: «meist» |
| K5 | Personenfreizügigkeit ohne EFTA | überall «EU/EFTA»; Vermerk, dass S. 111 nur die EU nennt |
| K6 | Migrationshintergrund, überholte Anteile | «laut Lehrmittel»; BFS-Werte 2024 in der Lösung zu LF1 und im Begleiter |
| K7 | «enttäuscht (Abs. 12)» | ersetzt: Ernüchterung bei den Pflegenden (Abs. 11), Erwartungen beider Seiten nicht erfüllt (Abs. 12) |
| K9, K10 | Kurzbeschriebe zweier Karten | neu gefasst (kein Herkunftsland, kein «Asylentscheid steht noch aus», keine halbe Lösung); `herausgeber` der Karte `q-431b-vertiefung-2` bleibt abgekürzt (Budget 40 Zeichen mit Datum) |
| N1 | «mehr als die Hälfte aus wirtschaftlichen Gründen» | nicht mehr Beleg im Muster-Leserbrief; in der Lösung als «laut Lehrmittel, nicht belegbar» gekennzeichnet. Neuer Beleg 1: Tabelle S. 109 (rund 390 000, addiert) |
| N2 | Branchenanteile (S. 111) | «laut Lehrmittel, ohne Jahr, nicht nachgeprüft»; nicht mehr Beleg im Muster-Leserbrief. Neuer Beleg 2: Personenfreizügigkeit seit 2002 |
| N3 | «etwa 2,4 Prozent» | als Anteil am Bestand, ohne Jahr, amtlich nicht nachvollziehbar gekennzeichnet (Lösung und Begleiter) |
| N4 | «in Krisen gingen mehr, als kamen» | als «laut Lehrmittel» gekennzeichnet |
| Nr. 76 | Wortzahl der Quelle A | Karte `q-431a-pflicht`: `woerter` 448 → 439 (Vorspann 14, Lauftext 419, Zwischentitel 6) |
| E3, H2 | Anerkennungsquoten, Schutzstatus S | als Information für die Lehrperson im Begleiter (Kap. 4 und 7) |

Nicht geändert: Datum der Karte `q-431b-pflicht` («2026-02», Monat nicht bestätigt); Bauplan (nennt weiterhin 448 Wörter und im Audit §7 drei Aussagen, die am Archivtext nicht halten — massgebend sind die Hefte).
