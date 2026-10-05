# Bericht — lokaler Lauf 2026-10-04 · Einheit 2.5.1_klimaveraenderung_diskutieren

| | |
|---|---|
| Branch | `v42-skill` (lokal, ein Arbeitsbaum, kein Push) |
| Auftrag | genau eine Einheit: `2.5.1_klimaveraenderung_diskutieren` (Bauplan `docs/cloud-run/bauplaene/2.5.1_klimaveraenderung_diskutieren.md`, freigegeben am 2026-10-03), ausgelöst über `docs/cloud-run/prompts/alle-bauplaene-seriell.md` (ein Durchgang, streng seriell) |
| Skill | `.claude/skills/bbw-hko-heft-v42/`, Auto-Modus, Phasen 2–9 (Prompt `docs/cloud-run/prompts/einheit-aus-bauplan-lokal.md`) |
| Ergebnis | **grün** — eine Einheit, `status: "entwurf"` |
| Rollen | Orchestrator (Opus 5.5): Vorprüfung, `prinzip.json`, `kn.json`, alle Gates, Nachprüfung der Befunde, Marker-Füllung · Opus-Executor (je einer, nacheinander): Heft A, Heft B, Set, Begleiter, drei Kürzungsaufträge, drei Korrekturaufträge · Sonnet-Gegenleser (einzeln nacheinander): zwölf in Runde 1, vier in Runde 2 |

Kein Lehrmittel-, Transkript- oder Artikeltext in diesem Bericht; nur Kapitel, Seite,
Zeitmarke und eigene Formulierungen.

---

## 1. Einheit

| | |
|---|---|
| Ordner | `src/data/einheiten/2.5.1_klimaveraenderung_diskutieren/` — `prinzip.json`, `kn.json`, `herausforderung_A.json`, `herausforderung_B.json`, `set.json`, `begleiter.md` |
| Titel | «Klimaveränderung beschreiben und diskutieren» · Modul 2.5 · Thema T2 «Meinungen bilden und mitgestalten» · 1. Lehrjahr |
| Lehrgang | `EFZ_4J`, kein `lehrgaenge` (den Lebensbezug 2.5 gibt es nur in 4J) |
| Heft A | 2.5.1 — «Was heute Hitze heisst – und was morgen kommt» · faktenorientierte Beschreibung in drei Absätzen (100–130 Wörter) mit Liste «Belege» · beide Fassungen (ohne Medien, mit Medien) |
| Heft B | 2.5.2 — «Verzicht oder Regeln – meine Position in der Runde» · Statement von rund zwei Minuten mit Stichwortkarte und Erwiderung auf einen Einwand · beide Fassungen |
| Auftrag | «20 Grad im Schulzimmer – was meldet unsere Klasse zurück?» · Berufsfachschule (Klasse) · Auswertung des Schreibens (Fläche, Schritt 1) + Aushandlung in der Gruppe (vier Felder, Schritt 4) |
| KN | «Zwei trockene Sommer – was beschliesst unser Verein?» · Verein und Freizeit · 115 Wörter · Fachgespräch / Mini Case / Werkschau |
| Neue Karten | keine. Die fünf Quellenkarten `q-251a-pflicht`, `q-251a-pflicht-ersatz`, `q-251a-vertiefung-1`, `q-251b-pflicht`, `q-251b-vertiefung-1` lagen aus der Vorbereitung vor (unverändert, mit diesem Lauf committet). Keine neue Methodenkarte. |

## 2. Tor (letzte Ausgaben, nach der letzten Änderung)

| Befehl | Ergebnis |
|---|---|
| `npm run build:einheiten-index` | «18 sets written (src + public/nrlp)» |
| `begleiter-marker.mjs … --check` | «266 Marker · 0 abweichend · 0 unaufloesbar» |
| `check-all.mjs 2.5.1_klimaveraenderung_diskutieren` | Struktur · Status · Methoden · Sprache · Leck: 0 Fehler, 0 Warnungen · nRLP-Abgleich ok · Kopplung · Autarkie · Begleiter-Marker ok · Leitfragen-Lösungen ok · Heft v4.x ok · **GRUEN** (Ausgabe: `check-all.txt`) |
| `export-v42.mjs` | 19 Dateien (je Heft und Fassung `heft-*`, `loesungen-*`; `auftragsbogen.*`; `begleiter.docx`) |
| `messen-v42.mjs` | Exit 0 · 56 Seiten ok, **kein Überlauf** (Ausgabe: `messung.txt`). Gemessen mit Segoe Print. Knapp: Heft B S. 8 «Reserve −0.3 px» (innerhalb der Toleranz des Skripts), Auftragsbogen A1 5.8 px, Lösungen mit Medien S. 3 je 8.7 px |
| `bestand-v42.mjs --pruefen` | «OK — 26 Dokumente unverändert.» |
| `npm run build` | Exit 0 |
| `check-all.mjs 1.3.1_konsum_verantworten_v42 2.3.1_anliegen_vertreten 2.1.1_informationen_hinterfragen` | GRUEN |

Reparaturrunden von `check-all`: keine (das Tor war beim ersten Lauf grün). Die
Messung brauchte eine Kürzungsrunde (Abschnitt 6).

## 3. Kapitel, Seiten, Quellen

**Lehrmittel** (am Text der Kapiteldateien geprüft, 2026-10-04): Kap. 9.1 S. 220,
222–223 (Heft A; S. 221 nicht als Stoff verwendet) · Kap. 9.2 S. 230 (Heft B,
graue Energie) · Kap. 9.3 S. 231–235 (Heft B) · Kap. 16.1 S. 366–367 · Kap. 17.3
S. 393–395 · über Methodenkarten: Kap. 17.2 S. 386, Kap. 16.2 S. 368. Kap. 9.4
ist nicht verwendet und nirgends genannt (Bauplan §9 Punkt 2).

| Quelle | Titel · Herausgeber · Datum | Ausschnitt | Geprüft | Zugeständnis |
|---|---|---|---|---|
| `q-251a-pflicht` | «Schweizer Klimaszenarien 2025» · SRF Tagesschau · 2025-11-04 | 00:00–02:16 | 2026-10-03 (Vorbereitung); Zeitmarken im Lösungs-Audit 2026-10-04 am Untertiteltext bestätigt | Video statt Audio · Sprechende in den Untertiteln nicht benannt |
| `q-251a-pflicht-ersatz` | «Schweizer Klimazukunft wird heiss» · SRF 10 vor 10 · 2025-11-04 | 00:02–03:16 | wie oben | Ausschnitt · gleicher Tag und gleiches Ereignis wie die Quelle |
| `q-251a-vertiefung-1` | «Schweizer Klimaszenarien CH2025: Wie trifft es uns?» · SRF Meteo · 2025-11-14 | ganzer Artikel | wie oben | keines |
| `q-251b-pflicht` | «Abstimmungs-Arena» zur Umweltverantwortungsinitiative · SRF Arena · 2025-01-24 | 15:10–18:51 | wie oben | Video statt Audio · Ausschnitt aus langer Sendung · Vorlage seither abgelehnt · Sprecherwechsel erschlossen · **keine Ersatzquelle** |
| `q-251b-vertiefung-1` | «Erklärvideo: Das will die Umweltverantwortungsinitiative» · SRF Arena · 2025-01-24 | 00:00–01:14 | wie oben | gleiche Sendung wie die Quelle |

Offen laut Bauplan §7: A Vertiefung 2, B Ersatz, B Vertiefung 2 (keine Karte, kein
Archivtext → nicht erzeugt; je Heft eine Vertiefung, Heft B fällt bei Ausfall der
Quelle auf die Fassung ohne Medien zurück).

## 4. Abdeckung (kohaerenz.md §3)

| # | Befund |
|---|---|
| A1 | Rezeption schriftlich und bildlich → Auftrag (Auswertung, A2) · Produktion mündlich → Heft B (Statement) · Interaktion und Kollaboration mündlich → Auftrag (Aushandlung, A3) · Produktion schriftlich und bildlich → Heft A (Beschreibung) |
| A2 | A: Produktion schriftlich und bildlich → Produkt S. 7 · B: Produktion mündlich → Produkt (Schritt 05) |
| A3 | geübt, nicht geführt: ohne Medien Rezeption schriftlich und bildlich (Lehrmittel-Abschnitt), mit Medien Rezeption audiovisuell (Video). Lücke wie im Bauplan: «Rezeption mündlich» (Modus des Themas) wird in keiner Quelle geübt |
| A4 | beide Modi des Auftrags tragen je ein Produkt (`produkte[0]` Fläche, `produkte[1]` Spur) |
| A5 | 2.5.1 → Heft A · 2.5.2 → Heft B |
| A6 | SK 1 → A, KN · 5 → B, KN-Werkschau · 6 → A, B, KN · 7 → B, KN · 12 → A |
| A7 | A: 1 → LF3 · 6 → LF4/Schritt 04 · 12 → Produkt (Absatz 3 «wo der Betrieb Spielraum hat»; schwächste Stelle, im Begleiter benannt) · B: 7 → LF3 · 5 → LF4 · 6 → Produkt |
| A8 | Beschreibung (Fliesstext) ≠ Statement mit Erwiderung (Wechselrede) ≠ Auswertungstabelle ≠ Aushandlung |
| A9 | Lehrbetrieb · Familie und Haushalt · Berufsfachschule · Verein und Freizeit |
| A10 | A: Fachkorrektheit + Ökologisches Prinzip · B: Argumentation + Position / Werthaltung · Auftrag: alle vier (zeichengleich mit `kn.rubrik_shared`, vom Skript geprüft) |
| A11 | ohne Medien: A `modell_eigener_fall` ≠ B `position_gegenposition` · mit Medien: A `lehrmittel_quelle` ≠ B `position_gegenposition` |
| A12 | beide Hefte beide Fassungen; A mit Ersatzquelle, B ohne (zulässig, weil B auch ohne Medien besteht) |
| A13 | Fall-Begriffe: kein Treffer in Heften, Auftrag, Glossar, Karten (Skript und Sweep); nur in `kontext_ausschluss` |
| A14 | siehe Abschnitt 5 |

Selbstprüfung Phase 3 (phase-2-3 §3.7), Zeilen 1–13: bestanden. Vermerke: Zeile 10
— «drei» steht in `kn.hybrid_situation.text` («zum zweiten Mal in drei Jahren»,
Fall aus Bauplan §5), in `prinzip.herausforderungen.A.handlungsprodukt_typ` («drei
Absätzen») und im Kapiteltitel «drei Seiten der Nachhaltigkeit» — kein Zählwort
für Herausforderungen. Aspekt Ökologie als «R1» ist die Ausnahme aus Bauplan §9
Punkt 1 (der Datensatz führt Ökologie für T2 nicht).

## 5. Vergleich mit Gold (nur Kurzliste aus kohaerenz.md §4)

**Fest (F1–F13):** gleich — sechs Dateien, Template `heft_8page_v42`, Kern einmal
und Spuren nur das Abweichende, vier Leitfragen mit K2/K3/K4/K4, fünf Schritte,
Kriterien im KN-Wortlaut, Begriffsnetz mit gleichem Zentrum («Heute zahlen oder
morgen Schäden tragen») und Transfer-Ast, Abschluss, Auftrag mit vier Seiten, KN
mit drei Formen und `modi_kn` (Gerüstwert), Lösung zu jedem Feld (16 Leitfragen
geprüft), Benennung nach E21, Sprache. Belege: `check-all` GRUEN, `messen-v42`
8/4/5 Seiten.

| Hergeleitet | Gold | 2.5.1 | Herleitung |
|---|---|---|---|
| Modi A | Rezeption schriftlich und bildlich | Produktion schriftlich und bildlich | Kompetenz 2.5.1 nennt nur diesen Modus |
| Modi B | Rezeption schriftlich und bildlich + Interaktion mündlich | Produktion mündlich | Kompetenz 2.5.2 |
| Modi Auftrag | Produktion mündlich + Produktion schriftlich | Rezeption schriftlich und bildlich + Interaktion und Kollaboration mündlich | `modi_kn − (A ∪ B)` |
| SK | A 5·11·1 · B 2·6·11 · KN 5·11·6 | A 1·6·12 · B 7·5·6 · KN 6·1·7 | SK des Themas T2, Stellen in Bauplan §3 |
| Produkt A | kommentierte Karte (Liste) | Beschreibung (Fliesstext + Liste «Belege») | Detail der Kompetenz: faktenorientierte Beschreibung |
| Produkt B | Tabelle mit Regeln + Gespräch | Statement mit Erwiderung (Wechselrede + Stichwortkarte) | Detail: Meinung äussern mit Argumentstruktur |
| Auftrag | Blatt + Sprachnachricht | Auswertungstabelle + Aushandlung | Modi des Auftrags |
| Quelle | Artikel, Grafik | Video in A und B | Modus des Themas (Audio), Ausweichfolge ohne Swissdox |
| Pol-Typ | — | A `modell_eigener_fall` / `lehrmittel_quelle`, B `position_gegenposition` | Bauplan §4 |

Keine Übereinstimmung in Modi des Auftrags, Produkttypen und SK.

## 6. Entscheide im Lauf (auto-modus §4)

**Orchestrator**
- `quellen_anker.chapters` des Prinzips: Kap. 9.1 als «Seite 220-223» (S. 221 am Text gelesen, nicht als Stoff verwendet), Kap. 9.2 «230-230», Kap. 9.3 «231-235», Kap. 16.1, Kap. 17.3. Kap. 17.2 und 16.2 nicht aufgenommen (nur Methodenkarten).
- `transferfeld`: Bäume und Schatten auf dem Spielplatz, Stromverbrauch einer Wohngemeinschaft, Einweggeschirr eines Sportclubs — keines aus A, B, Auftrag, KN.
- KN-Leitfrage und die Fragen der drei Formen verlangen keine Zahlen zum Wasser (Bauplan §9).
- Letzte Korrektur am Auftragsbogen (Schritt 01, ein String in `set.json`) hat der Orchestrator selbst gesetzt statt einen Executor zu starten: «A2: die vier Vorschläge (zwei je Variante), je mit Art (…) und Folge für Ihre Klasse.» (140 Zeichen; eine Fassung mit «Tragen Sie … ein» hatte 142).

**Heft A** — Reihenfolge der `quellen_anker` (S. 222–223 vor S. 220, weil der Renderer den ersten Anker mit passendem `ref` über das Raster setzt) · LF1 deckt S. 220 und den weltweiten Absatz von S. 222, LF2 die Folgen für die Schweiz am eigenen Fall · Zahlentabelle mit vier Zeilen (Arbeitsbeginn auf zwei Zeilen, Budget 15 Zeichen) · Schritt 04 heisst «04 Zukunftsaussage festlegen» (Label-Budget) · Absatz 3 nennt zusätzlich, wo der Betrieb Spielraum hat (Stelle für SK 12) · Beispielbild: Steinschlag an der Zufahrt eines Wohnquartiers (Permafrost, Kap. 9.1 S. 223; eine erfundene Fallzahl «zweimal gesperrt») · Sprecher bei 00:42 heisst «Fachperson» · Fundstellen der Vertiefung als Abschnitte, nicht als Zeilen des Archivtexts.

**Heft B** — `zahlen_tabelle` leer (Bauplan: keine Fallzahlen) · Knoten «Regel für alle» und «Einwand» sind heft-eigene Arbeitsbegriffe · Raster mit Medien: vier der fünf Zeilen des Bauplans, Startmarken 15:29 und 16:17 statt 15:27 und 16:00 (damit keine Zeile auf der ungeprüften Preisangabe aufsetzt) · Ausgang der Abstimmung ohne Prozentzahl · Beispielbild: Aufräumen nach dem Grillabend im Freundeskreis · einzige Watt-Angabe ist der Name «2000-Watt-Gesellschaft».

**Set** — Beitrag an die Klassenkasse ohne Betrag · drei Zahlenzeilen (22 Grad, 20 Grad, drei Wochen) · vier Punkte des Schreibens: 20 statt 22 Grad und Geräte aus (Vorschrift), freiwillig sparen (Appell), Beitrag (Anreiz) · `heft_bezug` B verweist auf 3B-Schema (S. 2) und Position/Einwand/Antwort (S. 4, S. 7), nicht auf das Raster, weil die Instrumente nur in der Fassung ohne Medien vorkommen · Stationen in Wir-Form (Bauplan §6 wörtlich; die Skill verlangt Ich-Form).

**Begleiter** — SK des Auftrags in der Handzeile: 1 · 6 · 7 · Abstimmungsausgang nur mit Datum · «nicht gegengesehen» an vier Stellen.

**Kürzungsrunde nach der ersten Messung** (Überläufe: Heft A S. 3 mit Medien 4.3 px, S. 8 6 px, Lösungen A mit Medien S. 3 84.5 px · Heft B S. 3 mit Medien 4.3 px, S. 6 124.8 px, S. 8 4.2 px, Lösungen B mit Medien S. 3 103.2 px · Auftragsbogen A1 49.5 px): Checklisten der unteren Reihe auf je zwei Punkte zusammengezogen (A und B), Randspalte S. 3 mit Medien gestrafft, Methodenkarten-`fuer`/`tun` in Heft B gekürzt (der Überlauf auf S. 6 kam vor allem von dort), Beispielbild B mässig gekürzt, Erwartungshorizonte LF4 mit Medien und Erwartung der Vertiefung gestrafft, `situation_text` des Auftrags 870 → 667 Zeichen und Leitfrage 135 → 89 Zeichen. Keine Fundstelle, Zeitmarke oder Zahl geändert.

## 7. Gegenleser

Runde 1 nach grünem Tor und Messung ohne Überlauf, Runde 2 nach den Korrekturen
(geänderte Seiten). Pakete mit `seitentext.mjs`; Auftrag wörtlich aus
gegenleser.md §4.1. Zuletzt gelesen: Runde 2. Danach wurde noch **ein** String
geändert (Auftragsbogen Schritt 01, siehe unten) — er ist nicht mehr gegengelesen.

| Gegenleser | Befunde (Kern) | Übernommen | Nicht übernommen / weggefallen |
|---|---|---|---|
| Lernende a · A ohne Medien | Liste «Belege» ohne Ort, «nach der Legende» ohne Ort · «jede Aussage mit Fundstelle» gegen Absatz 1 (Erlebtes) · Quer-Check 1 ohne Stelle | E → Executor A (A1–A3) | Quer-Check 1: hat seine Stelle in LF2 (Satzanfang) — weggefallen · Zentrum des Begriffsnetzes «ohne Vorbereitung»: Gerüst (V) |
| Lernende a · A mit Medien | wie oben · Beispiel S. 6 kürzer als 100 Wörter · «SuK», «Ges», «Plus» | E wie oben | Beispiel ist als «gekürzt» bezeichnet (Budget E26) (V) · «SuK»/«Ges»/«Plus: Plus» sind fester Text des Renderers bzw. Konvention aller Einheiten (R) |
| Lernende a · B ohne Medien | «Einwand aus dem Raster» — im Raster stehen Instrumente · LF3 «freiwillig/verpflichtet» passt für Anreize und Nachsorge nicht · Karte Diskussion und Karte Statement widersprechen dem Heft | E → Executor B (B1, B2) | Karten `lm-16-1-diskussion` (Beispiel) und `lm-16-2-statement` («eine Minute») sind Bestand (S, Abschnitt 9) |
| Lernende a · B mit Medien | Quelle trägt «bei den Einzelnen» nur zur Hälfte · «zweites Argument» entsteht nirgends · Auftrag nennt «Zeitmarke», Raster hat keine Spalte · «je Sprecherwechsel eine Zeile» | E → Executor B (B3, B4) | Quelle (Q, bekannt aus Bauplan §7) · Spalte «Wer spricht» ist Bauplan §7 (Zeitmarke vorn in der ersten Zelle) (V) |
| Lernende b · A mit Medien | wie a · Sprachlast der Kriterien | E wie oben | Stufentexte sind KN-Wortlaut (V) |
| Lernende b · B mit Medien | «zweites Argument» · «die Vorlage» nicht eingeführt · drei leere Felder im Begriffsnetz | E → Executor B (B3, B4a) | Begriffsnetz: «gilt auch bei …» ist festes Feld des Renderers (R) · «Umweltminister» steht im Kurzbeschrieb der Karte `q-251b-pflicht` (Q) |
| Lernende a · Auftragsbogen | «Station» unerklärt · Schritte 02/03 ohne Ort · «vier Punkte» unklar; Appell/Anreiz/Vorschrift unerklärt | E → Executor Set (S1–S4) | «Ende Ziel … · Probelauf» ist fester Text des Renderers (R) |
| Audit A ohne Medien (ca. 38 Stellen, 3 Befunde) | «hängt vom Ausstoss ab (S. 220)» ist Folgerung · «erwartet» statt «könnte» · Gletscher als Tatsache | E → Executor A (A4–A6) | — |
| Audit A mit Medien (ca. 40 Stellen, 3 Befunde) | LF4-Musterantwort vergleicht Verschiedenes · Befund zieht «bis Ende Jahrhundert» auf 01:17 | E → Executor A (A7, A8) | Rolle «Fachperson» bei 00:42: der Hinweis im Lösungsdokument sagt, dass die Untertitel sie nicht nennen — belassen |
| Audit B ohne Medien (ca. 38 Stellen, 8 Befunde) | Deutung mit Seitenangabe («wirken stärker», Anreiz/Verursacher, Nachsorge) · Quer-Check | E → Executor B (B5, B6) | Kanten des Begriffsnetzes und «zuerst sagen, was stimmt» sind Setzungen des Hefts, nicht als Lehrmittelaussage ausgewiesen — belassen |
| Audit B mit Medien (27 Stellen, 5 Befunde) | Zuordnung Bundesrat → Haushalte ist Warnung · 16:17 als Behauptung · «wir sind Teil der Ursache» · Herkunft des Abstimmungsausgangs | E → Executor B (B7–B9) | — |
| Sweep | kein «ß», kein Platzhalter, keine Transliteration, kein Fall-Begriff, keine Namen; «du» nur in der Wechselrede des Lösungsbilds (Familie); «Woche» nur als Frist des Falls und im Beispiel der Rezeptionskarte; «Minuten» nur als Dauer des Produkts | — | alles zulässig (V) |

**Runde 2** (Lernende a: A S. 5–8 · B ohne Medien S. 3–5 · Bogen; Lernende b: B mit
Medien S. 3–5): niemand blieb stecken. Übernommen: Auftragsbogen, Schritt 01
(«je Variante zwei Punkte» wurde als Art/Folge gelesen und passte nicht zur
Abgabe «Tabelle mit vier Zeilen») → vom Orchestrator geändert (Abschnitt 6).
**Offen geblieben, nicht behoben** (Rundenzahl erreicht bzw. Renderer, Bauplan,
Quelle):
- Heft A: S. 7 hat ein einziges Schreibfeld; die Liste «Belege» hat nur per Text einen Ort (R). Die Schritte 01 und 02 nennen keinen Ort für die Stichworte. «Zukunftsaussage» (S. 5) und «Aussage zur Zukunft» (S. 4, S. 8) stehen nebeneinander.
- Heft B ohne Medien: `liefert` von LF3 heisst weiter «Belege für beide Seiten mit Fundstelle», die Frage fragt nach der Bindungsstärke · Einwand auf S. 4 (Denkhilfe) und in Schritt 03 doppelt · «Ein Eintrag je Spalte genügt» über drei leeren Zeilen (R).
- Heft B mit Medien: «meine Seite» ist an der Quelle nicht eindeutig (die Seiten der Sendung sind nicht die Seiten des Falls) · Raster hat keine Zeitmarken-Spalte (Bauplan) · wie die vier Aussagen auf die zwei Seiten verteilt werden, steht nicht (die Lösung hat drei Zeilen Befürworter, eine Bundesrat).
- Auftragsbogen: Notizen zu 02/03 stehen nicht unter «Das geben Sie ab» · «füllt eines der vier Felder aus» geht bei Partnerarbeit nicht auf · Schritt 05 und Feld 4 auf A3 überschneiden sich · Kriterium «Ökologisches Prinzip» hat auf dem Bogen keinen eigenen Schritt · `erwartungshorizont.gut_wenn[2]` in `set.json` sagt noch «eine Station» (nicht auf dem Bogen sichtbar).

**Zeitsummen der Lernenden-Gegenleser (Schätzungen):** A ohne Medien 142 min ·
A mit Medien 127 min (Profil a), 195 min
(Profil b) · B ohne Medien 128 min · B mit Medien 117 min (a), 160 min (b) ·
Auftragsbogen 51 min.

**Was kein Gegenleser prüfen konnte:** Bild und Ton der Videos, das Seitenbild
(Farben der Legende, Feldgrössen), Word-Dokumente.

Sinnprobe (phase-9 §3 Nr. 9) nach Runde 2: 1 ja · 2 ja (LF3 ohne Medien nach B2) ·
3 teils — Heft B mit Medien nennt über dem Raster «Zeitmarke», die kein
Spaltenkopf ist (Bauplan §7) · 4 ja · 5 ja (A: Beispiel zeigt zwei Belege und die
Zukunftsaussage) · 6 ja.

## 8. Vor dem Druck gegenhören / gegensehen

- **Kein Video wurde angesehen**, nur Untertitel gelesen. `q-251b-pflicht`: stimmen 15:10 und 18:51 im Player auf die Sekunde, und wer spricht in welchem Abschnitt (Befürworter 15:27–16:26 und ab 18:15, Bundesrat 16:29–18:12 — aus Anrede und Inhalt erschlossen)? `q-251a-pflicht`: wer spricht bei 00:42? `q-251a-pflicht-ersatz`: endet der Ausschnitt bei 03:16 sauber?
- **Ausgang der Abstimmung** (Heft B S. 3: «seit dem 9.2.2025 abgelehnt»): Quelle ist die Abstimmungsseite von SRF (abgerufen 2026-10-03) — an amtlicher Stelle prüfen.
- Zwei Behauptungen im Ausschnitt von Heft B (Lebensmittelpreise 16:07–16:19; Anteil von Unternehmen am Ausstoss 16:42–16:49) sind ungeprüft; die Lösungen kennzeichnen sie so.
- Zahlen aus Kap. 9.1 S. 222 und Kap. 9.3 S. 232 tragen den Stand des Lehrmittels.
- QR-Seite `/m/2.5.1_klimaveraenderung_diskutieren` (#a, #b) nicht geöffnet (kein Dev-Server in diesem Lauf).
- Word-Dokumente nur erzeugt, nicht angesehen.

## 9. Unbelegt, nicht geprüft

- Hitze am Arbeitsplatz (Heft A ohne Medien): Fallüberlegung, im Lösungsdokument so gekennzeichnet.
- «Wovon es abhängt» (Heft A ohne Medien): Folgerung aus Kap. 9.1 S. 220 und S. 222, so gekennzeichnet.
- Heft B: keine Zahl zur Wirkung einer Kaufpause; Zuordnungen der Instrumente und der Sprechenden zu «Einzelne / Regeln für alle» sind Deutung, in den Lösungen gekennzeichnet. «Regeln erreichen mehr Leute» steht im Lösungsbild und an drei weiteren Lösungsstellen als Zugeständnis der sprechenden Person ohne das Wort «Folgerung».
- Glossar: Nullgradgrenze, Starkniederschlag, Hitze-/Trockenperiode, Pollensaison erklären das Wort selbst; belegt ist je nur die Entwicklung.
- Nicht im Heft (Bauplan §2): Allmendegut, Wetter/Klima als Begriffspaar, Verkehr.
- Inhalt der Methodenkarten gegen ihre Kapitel nicht gegengelesen.
- Zeitangaben im Begleiter (Dauer der Statement-Runden, Fachgespräche) sind eigene Rechnung.

## 10. Fehler in Skill, Skript, Renderer, Bestand (nicht repariert)

Bereits bekannt aus früheren Berichten und hier wieder aufgetreten: E30 ist in
der Skill nicht nachgeführt (die sechs Wörter stehen weiter als gesperrt) ·
fester Text «Ende Ziel … · Probelauf» auf A3 · «SuK»/«Ges» im Heft unerklärt ·
S. 7 mit nur einem Schreibfeld. Neu bzw. hier deutlich:

- **Skelett und Datenvertrag** führen die Rasterspalten ohne Medien als Konstante; Bauplan §7 gibt eigene Spalten vor, `check-v42` akzeptiert sie. Die Skill widerspricht sich dort.
- **`ankerZu()`** (`seiten-1-4.tsx`) nimmt bei zwei `quellen_anker` mit gleichem `ref` immer den ersten; der Kasten «Lehrmittel-Abschnitt» stimmt darum nur über die Reihenfolge. In Heft B zeigt er «Kap. 9.3 · S. 233» über dem Raster, der Anker selbst ist S. 231–235.
- **Budgets E26 für gemischte Blätter** tragen nicht: Heft B S. 6 lief trotz eingehaltener Zeichenbudgets um 124.8 px über — Ursache waren vor allem lange `fuer`/`tun` der Methodenkarten (kein Budget im Skript).
- **Lösungsdokument S. 3 der Fassung mit Medien** (LF4 + Vertiefung) lief in beiden Heften über (84.5 und 103.2 px), ohne dass ein Budget verletzt war.
- **Auftragsbogen A1**: `situation_text` im Budget (870 Zeichen) lief um 49.5 px über.
- **`lm-16-1-diskussion`** (Bestand): `beispiel`, `fehler`, `merk` führen Wendungen und eine Killerphrase nahe am Wortlaut von Kap. 16.1 S. 367 (öffentliches Repo); das Beispiel der Karte widerspricht dem `tun` des Hefts («zuerst sagen, was stimmt»). **`lm-16-2-statement`**: «mehr passt in eine Minute nicht» gegen das Statement von zwei Minuten. **`hko-quelle-raster`** spricht in der Fassung ohne Medien von «sehen, hören» und «Zeitmarke».
- **Karte `q-251b-pflicht`**: Kurzbeschrieb sagt «Umweltminister», das Heft «Bundesrat».
- **phase-7-set.md / Datenvertrag** verlangen Stationen in Ich-Form; Bauplan §6 gibt Wir-Form vor (Gruppenprodukt). `check-v42` prüft die Form nicht.
- **`check-einheiten.mjs`** prüft je kopiergeschütztem Wert nur das erste Vorkommen im Begleiter; behandelt einen Ordner ohne `set.json` als eingefroren.
- **Kapiteldatei `9.1_Klima.md`**: Zwischentitel Gletscher/Permafrost auf S. 223 vertauscht; Bildbeschreibungen S. 221–223 passen nicht zu den Legenden.
- **Arbeitsbaum:** `src/data/methoden/hko-quelle-raster.json`, `scripts/check-v42.mjs`, Skill-References u. a. waren schon vor dem Lauf geändert (nicht von diesem Lauf, nicht committet).

## 11. Commit

Ein Commit «Einheit 2.5.1_klimaveraenderung_diskutieren (bbw-hko-heft-v42)»: der
Ordner der Einheit, die fünf Karten `q-251*`, dieser Bericht mit `check-all.txt`
und `messung.txt`, die zwei Index-Dateien. Kein Push. Kein Dev-Server.
