# Bericht — 2.1.1_budget_planen (bbw-hko-heft-v42)

| Feld | Stand |
|---|---|
| Ordner | `src/data/einheiten/2.1.1_budget_planen/` |
| Bauplan | `docs/cloud-run/bauplaene/2.1.1_budget_planen.md`, Freigabe und Auflagen vom 03.11.2026 |
| Lauf | Einzelauftrag als Implementation-Subagent; 03.11.2026 |
| Laufordner | `docs/cloud-run/laeufe/2026-11-03-2.1.1_budget_planen/` |
| Modell | gpt-6.1-sol; Autor, Sachprüfung und schriftliche Bearbeitungsproben in derselben Session; keine Unteragenten |
| Ergebnis | **Nachlauf: technische Abnahme vollständig grün; unabhängige Audits weiterhin offen** |
| Status | `entwurf`, kein Commit, Push oder Deploy |

Die Einheit ist mit den genehmigten Anpassungen geschrieben. Das Ratenangebot
enthält CHF 12 Aufpreis. Heft A bearbeitet Budget, Konsumentscheidung und
Schuldenrisiko; B verbindet längere Nutzung mit Bezahlbarkeit. Die Daten
bleiben zur Prüfung im eigenen Einheitenordner. Die abschliessende rote
Faktenprüfung stammt aus den unter §10 beschriebenen Skriptbefunden; keine
scheinbaren Primärbelege und keine Datenumgehung wurden dafür eingebaut.

## 1. Einheit

| Datei | Erzeugter Inhalt |
|---|---|
| `prinzip.json` | Prinzip, Spannungen, Kompetenzen, SK 1/3/9, genehmigte Modi und KN-Verknüpfung |
| `kn.json` | neuer Pavillon-Fall, Kurzgespräch, schriftlicher Mini Case, Werkschau, vier Kriterien samt Ich-Fassungen und einfachen Niveaubändern |
| `herausforderung_A.json` | achtseitiges Budgetheft zu 2.1.1, drei Leitfragen, Monatsbudget, Zahlungswahl, zwei Risiken mit Massnahmen, Lösungen |
| `herausforderung_B.json` | achtseitiges Konsumheft zu 2.1.2, drei Leitfragen, Angebotsvergleich, bezahlbare mündliche Wahl mit nächstem Schritt, Lösungen |
| `dossier.json` | sechs Info-Karten, Sprachgerüste, Transferblatt, Glossar, dreiseitiges Leseblatt |
| `set.json` | Entwurfsstatus, Heftverknüpfung, Glossar, gemeinsamer Auftrag mit Beschlussnotiz und Einigungsgespräch |
| `begleiter.md` | Durchführung, Seitenhinweise, Coaching, KN-Horizont, ausdrückliche SM2-Lücke und freiwilliger Clip-Suchauftrag ohne erfundene URL |

A: private Monatsfinanzen zu Hause. B: Kleidung/Freizeit. Auftrag:
Berufsfachschule, Becher für einen Klassenstand. KN: freiwilliges Engagement
im Quartier. Beide Hefte haben ausschliesslich `ohne_medien`. Es gibt keine
neue Methoden- oder Quellenkarte und keine KI-Toolbox.

## 2. Tor und Messung (historischer Erstlauf; aktueller Stand in §13)

Der erste Durchgang erreichte «VOR AUDIT — keine Fehler»; Protokoll
`vor-audit.txt`. Nach den Prüfdateien wurde das vollständige Tor ohne diesen
Schalter ausgeführt. Ergebnis: **ROT — 1 Prüfung mit Fehlern**, ausschliesslich
die Faktenzeile. Vollständige Ausgabe in `check-all.txt`.

| Prüfung | Ergebnis |
|---|---|
| `build:einheiten-index` | Exit 0; zuletzt 29 Sets; beide Indexdateien nur vom Builder geschrieben |
| Begleitermarker | 90 Marker, 0 abweichend, 0 unauflösbar |
| Namen, Karten, Skelette | grün; bestehende Karten nicht geändert; eine globale Warnung `KARTE_FESTE_ZAHL` an `hko-eba-fakt-oder-gefuehl.schritte[3]` |
| Struktur/Status/Methoden/Sprache/Leck | grün, keine Befunde |
| nRLP-Abgleich | grün |
| Kopplung/Autarkie/Marker | grün |
| Leitfragen-Lösungen | grün |
| Heft-v4.x-Budgets | grün |
| EBA-Profil | grün, keine Warnungen |
| Belege | grün, 53 von 53 Feldern, kein veralteter Hash; Autoren-Selbstprüfung, kein unabhängiges Audit |
| Fakten | rot: 33 verwaiste Dossierzeilen und 11 unpassend als Weltfakten erfasste Angaben, §10 |
| Zeiger, ohne Export | grün im Gesamttor |
| Zeiger, mit Export | zwei Fehler zur Beschriftung der Selbsteinschätzung auf S. 7, §10 |
| Zahlen | grün, keine Fehler/Warnungen/Hinweise |
| Kohärenz, einschliesslich Export | grün |
| Export | Exit 0, alle verlangten Materialien als HTML/DOCX; Begleiter als DOCX |
| Messung | Exit 0, alle 11 HTML-Dokumente ohne Überlauf; `messung.txt` |
| Schriften | Exit 0; alle 11 HTML-Dokumente nur mit eingebetteten Schriften; `schriften.txt` |
| Word-Seiten | Hefte je 8, Auftragsbogen 4; Soll erfüllt; `word-seiten.txt` |
| Bestand-v42 | zwei CSS-Abweichungen im bereits gemeinsam bearbeiteten Bestand; nicht von diesem Lauf geschrieben, nicht zurückgesetzt |
| Vollständiger npm-Build | nicht ausgeführt: sein Prebuild kann andere Einheiten synchronisieren; Schreibscope des Auftraggebers ist enger. Der verlangte Indexbau lief. |
| Leckprüfung Bauplan/Lauf | abschliessend ausgeführt; siehe `leck-check.txt` |

Word zählt zusätzlich: Lösungen je 5, Dossier 13, Leseblatt 3, KN-LP 7,
KN-Lernende je 4, Begleiter 18 Seiten. Exportordner:
`C:/Users/LP4PRO~1/AppData/Local/Temp/v42-2.1.1_budget_planen/`.

Messung während des Schreibens: Beide Hefte und beide Lösungen passten schon
beim ersten Export. A1 des Auftragsbogens ragte zuerst 28.7 px hinaus; nach
Kürzung des Situationsfeldes noch 6.5 px. Kürzere A2-Erklärungen für Budget und
Restbetrag beseitigten den Rest. Letzte A1-Reserve 29.9 px. Hefte S. 1 und 6
sowie Bogen A2/A3 nutzen den vorgesehenen Platz vollständig (0 px Reserve).
Schriftgrösse, Renderer, CSS und Prüfskripte wurden nicht verändert.

Bestandsbefund: `1.3.1_konsum_verantworten` und
`1.1.1_konflikt_kommunizieren`, jeweils CSS-Signatur
`f0123cc13cac → d039bcdb00c4`. Bereits der Ausgangsbaum hatte zahlreiche
fremde Änderungen an Renderer, Skill und Gold-Einheit. Eine parallele Sitzung
bearbeitet ausserdem 1.2.1. Fremde Dateien wurden nicht zurückgesetzt. Der
zusätzliche Gesamttest dreier Bestandseinheiten wurde nicht ausgeführt;
unveränderten Gesamtbestand behauptet dieser Bericht nicht.

## 3. Kapitel, Seiten, Quellen

Keine Lehrmittelpflicht: Wissen steht in den Info-Karten A-01 bis B-03.
Keine Medienquelle, Ersatzquelle oder Vertiefung. §10 des Bauplans hält die
Sachgrundlagen mit Datum und URL fest. Am 03.11.2026 erneut gelesen:
Stadt Zürich, Schulkreisel Mai 2026, S. 5 (Budget und Kostenträger);
Kanton Zürich, Sozialhilfehandbuch 4.2.01, Abschnitte 4.1 und 5
(Zahlungsprinzip, keine Jugendkauf-Rechtsregel); BAFU Kreislaufwirtschaft
(Produkte länger nutzen); Kanton Zürich, Textilien (Lebensphasen,
Langlebigkeit); Stadt Zürich, Schuldenprävention (vertrauliche Unterstützung).

Ergänzend: Budgetvorlage und Lernendenbudget der Schuldenberatung für
Rechenverfahren und Plausibilität. Die Definition von Nettolohn wurde im
Faktenlauf an der kantonalen Ausgleichskasse Bern bestätigt; keine konkreten
Beitragssätze oder Altersregeln übernommen. Die neue Fundstelle steht in
`fakten.json`. Alle Beträge der Übungsfälle bleiben erfunden.

## 4. Abdeckung (Kohärenz A1–A14)

| Nr. | Befund | Lücke |
|---|---|---|
| A1 | SM3 in A, SM4 in B, SM5/SM7 im Auftrag | keine innerhalb genehmigter Ersetzung |
| A2 | A liest und wertet aus; B erklärt mündlich | SM3 in A ist ausdrücklich genehmigter Ersatz |
| A3 | B liest Dossier und Angebote, nur geübt | keine Videoleistung behauptet |
| A4 | Beschlussnotiz SM5, Einigungsgespräch SM7 | keine |
| A5 | SM4 erfüllt; SM2 nicht bearbeitet | genehmigte SM2-Lehrplanlücke, Begleiter §2 |
| A6 | alle Themen-SK 1, 3, 9 in A/B/KN | keine |
| A7 | Raster: 1; Wege entwickeln: 3; Folgen/Nutzung: 9 | keine |
| A8 | Budgettabelle, Erklärung, Beschlussnotiz, Gespräch unterscheiden sich | keine |
| A9 | Zuhause, Kleidung/Freizeit, Berufsfachschule, Engagement | alle sechs Paare verschieden |
| A10 | A Fachkorrektheit/Wirtschaft, B Argumentation/Position; Auftrag alle vier | keine |
| A11 | modell_eigener_fall / position_gegenposition | keine |
| A12 | beide ohne_medien | genehmigte Ersetzung bleibt sichtbar |
| A13 | Pavillon und Quartierfest nur im KN bzw. erlaubten LP-/Ausschlussfeldern | keine |
| A14 | eigene SK 1/3/9 und andere Produkte/Modi | keine Inhaltskopie aus Gold |

## 5. Vergleich mit Gold

Fest F1–F13, mit EBA-Profil angewandt: Aufbau mit sieben Kerndateien;
achtseitige Hefte; Kern und eine Variante; drei Leitfragen K2/K3/K3; fünf
Produktschritte; KN-Wortlaut plus Ich-Fassung; technische Glossarkopplung ohne
Netzabgabe; Abschluss; vierseitiger gemeinsamer Auftrag; drei KN-Formen;
Lösungsfelder; eindeutige Namen; Schweizer Sprache und neutrale Persona.
Automatische Belege: Heftcheck, EBA-Check, Kohärenz und Export-Seitenzahlen.

| Hergeleitet | Vergleich und Herleitung dieser Einheit |
|---|---|
| H1 Modi | A SM3 ausdrücklich statt SM2 genehmigt; B SM4 aus 2.1.2; kein Kopieren der Gold-Kompetenzmodi |
| H2 Auftragsmodi | KN-Menge minus SM3/SM4 ergibt SM5/SM7 |
| H3 SK | nur 1/3/9 aus EBA-Thema 2; dadurch beide Hefte gleich besetzt, sachlich begründet |
| H4 Heftprodukte | Budget aus «Budget erstellen»; Erklärung aus «Produktion mündlich» und Konsumstrategie |
| H5 Auftragsprodukte | schriftlicher Beschluss plus Gespräch aus den verbleibenden Modi |
| H6 Grundlage/Raster | eigenes Dossier und Fallzahlen; Kategorien bzw. Wege im Raster, keine Gold-Quelle |
| H7 Pol-Typ | Budgetmodell am Fall gegenüber zwei Konsumpositionen |
| H8 Aspekte | Wirtschaft und Ökologie aus 2.1.1/2.1.2, Wirtschaft dominant |
| H9 Fälle/Methoden/Wörter | eigene Monatsgeld-, Kleidungs-, Klassen- und Engagementfälle; vorhandene A2-Methoden nach Passung |

## 6. Fakten-Audit und Zahlen

Autoren-Sachprüfung gpt-6.1-sol, Abruf 03.11.2026. `fakten.json` liegt
ausserhalb dieses Repos im vorgeschriebenen Prüfarchiv: **39 Zeilen, alle mit
Urteil belegt, keine abweichend und keine nicht_belegbar**. Auch Aussagen ohne
Ziffern sind erfasst. Das ist eine Selbstprüfung, kein unabhängiger Opus-Lauf.
Trotz vorhandener Zeilen scheitert das Fakten-Prüfskript an der Dossierzuordnung.
Lokale Unterrichts- und Bewertungsvorgaben erhielten keine erfundenen
amtlichen URLs. Es gibt keinen behaupteten Gesetzesstand oder Rechtsrat für
Minderjährigenkauf. Ein Lehrmittel-Gesetz-Widerspruch entfällt.

`fall.json`: 42 echte Fallwerte und abgeleitete Werte in A, B und Auftrag,
vom Autor während der Produktion geschrieben. Keine sachfremde Zahl zum
Unterdrücken einer Meldung ergänzt. Die anfänglichen Preis-/Restverwechslungen
des heuristischen Namensprüfers verschwinden mit der vollständigen Erfassung
der tatsächlichen Werte; sie wurden nicht durch falsche Zahlen «behoben».

| Nachrechnung | Ergebnis |
|---|---|
| A feste Posten: 120 + 30 + 80 + 15 | 245 |
| A veränderbar: 140 + 110 + 60 + 40 + 10 | 360 |
| A Monat: 780 − 245 − 360 − 100 | 75 frei |
| Sofortkauf 120 gegenüber 75 | 45 fehlen |
| Raten: 3 × 44, verglichen mit 120 | 132 total, 12 Aufpreis |
| Rest mit Rate bzw. beim Ansparen | 31 bzw. 35 |
| neue Monatsrate 20 auf dem Ratenweg | 11 Rest |
| B: 90 − 35 / 90 − 60 / 90 − 120 | 55 / 30 / −30 |
| Auftrag: 100 − 45 − 30 / 100 − 45 − 70 | 25 / −15 |
| Auftrag mit neuen Kosten 10 beim Leihen | 15 Rest |
| KN: 180 − 60 − 70 | 50 Rest; nach erster Kaufrate bleiben 140 offen |
| KN Sofortkauf: 180 − 60 − 210 | −90 |

Die Preise sind plausible konstruierte Angebote, keine behaupteten Tarife.
Krankenkasse und Gesundheitskosten sind ausdrücklich Elternzahlungen im Fall.
Kein 13. Monatslohn und keine ungesicherten Einnahmen wurden zum Ausgleichen
eines Budgets erfunden. B nennt den Preisnachteil beider Konsumwege deutlich.

## 7. Entscheide im Lauf

- Auflagen der Freigabe übernommen: Headsetrate 44 statt 40; Gesamtpreis,
  Aufpreis, Monatsrest und Transferrechnung überall angepasst.
- Leih- und Kaufbedingungen des KN bleiben ein anderer konstruierter Fall;
  keine allgemeine Aussage über zinsfreie Kredite.
- Zusätzliche Belastung im gemeinsamen Auftrag sichtbar prüfen lassen, damit
  auch das höchste wirtschaftliche Kriterium erreichbar ist.
- A1-Sprache gekürzt, alle entscheidenden Angaben erhalten; keine Schrift-
  oder Layoutänderung. Der vorgeschriebene Heft-Bezug blieb als Datenfeld
  erhalten, statt das Produkt zur Umgehung des Renderers zu vertauschen.
- Keine bestehenden Karten geändert; lediglich zulässige eigene
  Anwendungshinweise und Beispiele in den Heftreferenzen. Keine neue Methode.
- Keine Unterdelegation im Implementation-Subagent-Auftrag. Deshalb keine
  unabhängige Lesung oder Modellbesetzung als ausgeführt ausgegeben.
- Bestandsdateien und Skill blieben unangetastet. Kein vollständiger Build
  mit schreibendem nRLP-Prebuild; geforderter Indexbau wurde ausgeführt.

## 8. Gegenleser und Audits

**Agenten:** keine Gegenleser-Unteragenten, keine unabhängigen Lösungs- oder
Faktenauditoren. Die erstellten Dateien nennen den Autor und gpt-6.1-sol offen.
Die Skill-Forderung nach unabhängigen Opus-/Sonnet-Läufen ist nicht erfüllt.
Die gleiche Session kann nach dem Schreiben keine echte Blindheit herstellen.
Es liegen trotzdem getrennte Aufgaben-/Vergleichspakete und nachvollziehbare
schriftliche Produktproben im Temp-/Archivbereich vor. Keine Gold-Belege kopiert.

| Paket | Lösungsfelder | Selbstprüfung stimmt | andere Urteile |
|---|---:|---:|---:|
| A ohne_medien | 25 | 25 | 0 |
| B ohne_medien | 25 | 25 | 0 |
| Auftrag | 3 | 3 | 0 |

`belege.json` hat alle 53 aktuellen Hashes; Dossieranker sind 5–12 Wörter aus
den tatsächlich vorhandenen Karten. Fallrechnungen sind als solche erfasst.
`probe.json` enthält drei ausdrücklich als Autorenproben bezeichnete Läufe,
keinen offenen inhaltlichen Aufgabenbefund. Textproben machen keine Aussage
darüber, ob Lernende die mündlichen Produkte wirklich gesprochen haben.

Die exportierten Seitentexte wurden gelesen. Drei auffällige Punkte:
Raster und Info-Karten sind vorhanden und tragen die Fragen; die zwei Wahlen
sind begründbar; auf A2 fehlt trotz Datenfeld der Heft-Bezug (Rendererbefund).
Die höchste wirtschaftliche Stufe ist über eine neue Belastung, Argumentation
über Gegenargument/Folge erreichbar. Einzelaufträge, Wortgebrauch, Kriterien
und Seiten 5–7 stimmen. Kein Netz und keine private Auskunft als Lernendenabgabe.

Zeitbedarf und A2-Verständlichkeit wurden redaktionell eingeschätzt, nicht mit
realen Lernenden erprobt. Ein pauschaler Nachweis «135 Minuten genügen» wird
nicht gegeben. Letzte Textänderung: kurze Wörtererklärungen auf A1; danach
Export, Messung, Schriften und Word-Seiten erneut geprüft. Mündliche
Durchführung und externe unabhängige Lesung bleiben ungeprüft.

## 9. Vor der Freigabe gegenhören und gegensehen

`gegenhoeren.mjs`: 0 Audio/Video, 0 Zeitmarken, 0 externe Text-/Bildquellen.
Die erzeugte Liste liegt im Exportordner als `gegenhoeren.md`. Ihre generischen
Hinweise zu Playern und Arbeitsfläche S. 7 passen nicht zum EBA-Heft ohne
Medien und ohne Arbeitsfläche. Sie wurden nicht in die Lernendenmaterialien
übernommen. Tatsächlich sinnvoll: Seiten mit 0 px Reserve am Papier ansehen,
Heft-Bezug auf A2 nach Rendererreparatur prüfen, unabhängige A2-Lesung nachholen.
Es wurde kein Clip ausgewählt und kein Videoverstehen als geprüft ausgegeben.

## 10. Befunde des Erstlaufs (Nachführung in §13)

| Nr. | Art | Befund und Fundstelle | Stand |
|---|---|---|---|
| 1 | S | `check-fakten.mjs` sammelt mit `textfelder(E, {dossier:true})`, bildet aber seine Beleg-Ortsmenge in Zeile 135 mit `textfelder(E)` ohne Dossier; `pruefung.mjs` hat dafür standardmässig `dossier:false`. 33 vorhandene Dossierbelege werden deshalb als verwaist gemeldet. | offen; Prüfer unverändert |
| 2 | S | Fakten-Erkennung verlangt für den Kartentitel zum Monat, die didaktischen Rubriklabels, den LP-Zeitvorschlag, das Freigabedatum und die nicht im Fallschema vorgesehenen KN-Beträge Weltbelege. Das sind die 11 `ERR_FAKT_OHNE_ZEILE`; sie stehen im Einzelprotokoll. | offen; keine fingierten Primärquellen oder Textverstecke |
| 3 | R | `DocAuftragsbogen.tsx`, `ProduktSeite`: frühe Rückgabe bei `flaeche` in Zeilen 278 ff. überspringt `HeftBezug`; in `docx-auftragsbogen-v42.ts` geschieht dasselbe in `produktSeite`, Zeilen 262 ff. Heft-Bezug ist in `set.json` korrekt vorhanden, wird auf A2 aber nicht gedruckt. | offen; kein Produkttausch als Umgehung |
| 4 | S | `check-zeiger --export` verlangt den exakten Ausdruck Selbsteinschätzung auf S. 7. Der EBA-Renderer nennt diese Seite «Prüfen» mit Ich-Ankreuzkriterien. Beide Verweise sind fachlich richtig, der Prüfer meldet trotzdem zwei Fehler. | offen; Daten zeigen weiter die richtige Seite |
| 5 | S | `audit-paket --geruest` lehnt den vorgeschriebenen Archivordner wegen des übergeordneten Git-Repos `D:/OS` ab, obwohl er ausserhalb `D:/OS/dev/bbw-hko` liegt. Vergleichsgerüste deshalb im erlaubten Tempbereich erstellt; geprüfte Teildateien anschliessend am vorgeschriebenen Archivort abgelegt. | dokumentiert; kein Skript verändert |
| 6 | S | `gegenhoeren.mjs` bestellt für diesen EBA-Fall generisch einen Player und eine Arbeitsfläche S. 7, beides nicht vorhanden bzw. vorgesehen. | offen; betrifft nur die generierte LP-Prüfliste |
| 7 | S | Globale Kartenwarnung `KARTE_FESTE_ZAHL`, `hko-eba-fakt-oder-gefuehl.schritte[3]`. | gemeldet; bestehende Karte nicht verändert |
| 8 | E | Unabhängige Blind-/A2-Gegenlesungen und externe Lösbarkeitsprobe fehlen. | offen, keine Unterdelegation im Implementation-Auftrag |
| 9 | E | Mündliche Erklärung und Gespräch liegen als schriftliche Proben, nicht als tatsächlich durchgeführte mündliche Leistungen vor. | offen für Unterrichtserprobung |
| 10 | E | `bestand-v42` meldet zwei CSS-Signaturabweichungen im parallelen Ausgangsbestand. | fremder Bestand; unangetastet |
| 11 | E | Anfangsüberlauf des Auftragsbogens A1. | behoben, letzte Messung 29.9 px Reserve |

Rückwegsuche nur lesend:

- Nr. 1: nach Dossier-IDs gesucht, 24 Vorkommen in vier anderen Einheiten,
  je sechs in `1.1.1_lehrvertrag_orientieren`,
  `1.1.1_lehrvertrag_orientieren_v42`, `1.1.2_unterlagen_ordnen`,
  `1.2.1_regeln_schule_betrieb`. Das sind mögliche Dossier-Verbraucher,
  keine Behauptung, ihre Fakten-Audits seien ebenfalls gelaufen.
- Nr. 2: Rubriklabels 60/80/100: 87 Vorkommen in 29 anderen Einheiten,
  je drei; Monatstitel: kein anderer Treffer. Die generische Fehlklassifikation
  hängt vom Prüfer und von vorhandenen lokalen Faktenzeilen ab.
- Nr. 3: `gemeinsamer_auftrag.produkte[*].form`, Muster `flaeche`:
  15 Vorkommen in 13 Einheiten (je 2 in `3.2.1_konsumfolgen_beurteilen` und
  `5.2.1_gesetze_veraendern`, je 1 in `1.1.1_ausbildung_kommunizieren`,
  `1.2.1_lernzeit_planen`, `1.2.1_regeln_schule_betrieb`,
  `2.2.1_ausgrenzung_analysieren`, `2.2.1_meinungsfreiheit_reflektieren`,
  `2.3.1_anliegen_vertreten`, `2.4.1_haltung_zeigen`,
  `2.5.1_klimaveraenderung_diskutieren`, `3.3.1_kaufvertrag_beurteilen`,
  `4.1.1_wohlbefinden_staerken`, `4.2.1_risiken_absichern`). Der konkrete
  fehlende EBA-Heftbezug ist profilabhängig; die EFZ-Treffer sind keine Fehlerbestätigung.
- Nr. 4: Abgabenmuster mit Selbsteinschätzung S. 7: keine anderen Treffer.
- Nr. 5/6: Skriptlogik, kein einheitenbezogenes Textmuster; bereits am
  konkreten Fehlerpfad bzw. am erzeugten EBA-Prüflistentext nachgewiesen.
- Nr. 7: gemeinsame bestehende Methodenkarte, nicht ein neuer Datenfehler;
  Verbraucher und globale Warnung aus dem Tor. Kein Eintrag in die gemeinsame
  `OFFEN.md` geschrieben, da der Auftrag dies nicht erlaubt.

Nur eigener Einheitenordner, eigener Bauplan, Lauf-/Prüfbereich und durch den
Builder erzeugte Indexdateien wurden geschrieben. Kein Renderer, Script,
Stylesheet, Skill, fremde Einheit oder bestehende Karte geändert.

## 11. Vorlage zur Freigabe (historischer Erstlauf; aktueller Stand in §13)

Keine erneute Frage: Der Auftraggeber verlangte nach Bauplanfreigabe den
Durchlauf bis zum Bericht. **Freigabereif: nein.** Messung, Schriften,
Word-Seiten und Zahlen sind bestanden. Das Gesamttor bleibt wegen der
Faktenprüfung rot; exportbezogene Zeigerprüfung und Heft-Bezug haben die
zusätzlichen dokumentierten Befunde. Unabhängige Audits bleiben nachzuholen.
Die Einheit ist indexiert, lokal unter `/einheiten/2.1.1_budget_planen`
auffindbar und bleibt ausschliesslich Entwurf für KT1. Keine Publikation.

## 12. Commit

Keiner, ausdrücklich gemäss Auftrag. Kein Staging, Push, Merge oder Deploy.
`check-leck --staged` entfällt. Ein öffentlicher Freigabeschritt wurde nicht
ausgeführt und `set.json` bleibt `entwurf`.


## 13. Nachlauf vom 03.11.2026 — Codekorrekturen und Abschluss

**Aktueller Stand: Alle vom Auftraggeber verlangten technischen Prüfungen sind grün.** Die unabhängigen Audits bleiben ausdrücklich offen; der Auftraggeber hat dies für diesen Nachlauf akzeptiert. Keine Änderung an Renderer, Prüfskripten oder Skill durch diesen Lauf. Kein Commit, Status weiterhin `entwurf`.

Geändert wurden ausschliesslich die verlangten Inhalte:

- `herausforderung_A.json`: Titel des ersten Dossierankers «Mein Monatsgeld».
- `dossier.json`: zugehöriger Kartentitel identisch angepasst; Karteninhalt und Lösungsanker unverändert.
- `begleiter.md`: Wochenvorschlag klar gegliedert, Freigabe ohne Datumsangabe; Lehrplanlücke und freiwillige Clip-Suche bleiben erhalten.
- Prüfarchiv `fall.json`: neuer Träger `faelle.kn` mit 180 Budget, 60 anderen Ausgaben, 70 Miete, 210 Kaufpreis, drei Raten zu je 70 und 20 zusätzlicher Belastung. Insgesamt jetzt 49 Fallwerte über A/B/Auftrag/KN. Zusätzlich `fall.kn.json` als eigene Teildatei gesichert.

| Erneute Abnahme | Letztes Ergebnis |
|---|---|
| `check-all` | Exit 0, **GRUEN — keine Fehler.** |
| `check-fakten` | Exit 0, 39 Faktenzeilen anerkannt, 0 Fehler/Warnungen/Hinweise |
| `check-zahlen` | Exit 0, inklusive `faelle.kn`, 0 Fehler/Warnungen/Hinweise |
| `check-belege` | Exit 0, 53 aktuelle Lösungsfelder; Selbstprüfungsgrenze bleibt bestehen |
| `export-v42` | Exit 0, alle Materialien erneut exportiert |
| `messen-v42` | Exit 0, alle 11 HTML-Dokumente ohne Überlauf |
| `check-schriften` | Exit 0, alle 11 HTML-Dokumente nur mit eingebetteten Schriften |
| Word-Seitenzählung | Exit 0: Heft A 8, Heft B 8, Auftragsbogen 4 |
| `check-zeiger --export` | Exit 0, 0 Fehler/Warnungen/Hinweise |
| `check-kohaerenz --export` | Exit 0, 0 Fehler/Warnungen/Hinweise |
| `build:einheiten-index` | Exit 0, 30 Sets; beide Indexdateien vom Builder aktualisiert |

A2 zeigt im neuen Export tatsächlich «Das brauchen Sie aus Ihren Heften» mit beiden Heften und beiden Verweisen «Wichtige Wörter (S. 2)». Word bleibt trotz des zusätzlichen Kastens bei vier Bogenseiten. Die beiden Hefte bleiben achtseitig. Der Daten- und Seitentextvergleich bestätigt die verlangten neuen Formulierungen.

Befunde §10 Nr. 1–4 sind erledigt: Codekorrekturen des Auftraggebers und die hier verlangten Formulierungs-/Fallzahlkorrekturen beseitigen sämtliche damaligen Fehlermeldungen. Die globale bestehende Kartenwarnung bleibt informativ und blockiert `check-all` nicht. Nr. 8–9 (unabhängige Audits und tatsächliche mündliche Erprobung) bleiben offen wie vereinbart. Nr. 5–7 und 10 betreffen den dokumentierten Werkzeug-/Bestandskontext, nicht die jetzt bestandene technische Abnahme.

Hinweis für eine spätere Wiederaufnahme: Der ursprüngliche Generator `erzeugen.py` dokumentiert den Erstlauf und wurde im Nachlauf nicht ausgeführt. `audit-paket --zusammenfuehren` schreibt derzeit `fall.json` nur mit A/B/Auftrag (`scripts/audit-paket.mjs`, Zeile 369); ein späteres Zusammenführen würde den KN-Block entfernen. Im vorliegenden Nachlauf wurde der gültige vollständige `fall.json` daher direkt nachgeführt und geprüft. Keine Änderung des Skripts, kein Verlust des KN-Trägers.

Die Prüfprotokolle und Exportdateien wurden durch die aktuellen Ergebnisse ersetzt. Der ursprüngliche rote Stand bleibt oben als Verlauf dokumentiert; massgeblich ist dieser Abschlussabschnitt. Material bleibt lokal indexierter KT1-Entwurf unter `/einheiten/2.1.1_budget_planen`.
