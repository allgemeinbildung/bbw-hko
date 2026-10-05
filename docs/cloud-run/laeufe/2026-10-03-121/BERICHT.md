# Bericht — lokaler Lauf 2026-10-03 · Einheit 1.2.1_lernzeit_planen

| | |
|---|---|
| Branch | `v42-skill` (lokal, ein Arbeitsbaum, kein Push) |
| Auftrag | genau eine Einheit: `1.2.1_lernzeit_planen` (Bauplan `docs/cloud-run/bauplaene/1.2.1_lernzeit_planen.md`, freigegeben am 2026-10-03) |
| Skill | `.claude/skills/bbw-hko-heft-v42/`, Auto-Modus, Phasen 2–9 (Prompt `docs/cloud-run/prompts/einheit-aus-bauplan-lokal.md`) |
| Ergebnis | **grün** — eine Einheit, `status: "entwurf"` |
| Rollen | Orchestrator (Opus 5.5): Vorprüfung, `prinzip.json`, `kn.json`, neue Methodenkarte, alle Gates, Nachprüfung der Befunde · Opus-Executor: Heft A, Heft B, Set, Begleiter · Sonnet-Gegenleser: 12 in Runde 1, 7 in Runde 2, 1 in Runde 3 |
| Dauer | 3. Oktober abends bis 4. Oktober früh; ein Unterbruch am Sitzungslimit (drei Executor brachen ab, bevor sie etwas änderten; neu gestartet) |

Kein Lehrmittel-, Transkript- oder Artikeltext in diesem Bericht; nur Kapitel, Seite,
Absatz, Zeitmarke und eigene Formulierungen.

---

## 1. Einheit

| | |
|---|---|
| Ordner | `src/data/einheiten/1.2.1_lernzeit_planen/` — `prinzip.json`, `kn.json`, `herausforderung_A.json`, `herausforderung_B.json`, `set.json`, `begleiter.md` |
| Titel | «Lernzeit planen» · Modul 1.2 · Thema T1 «Ins Berufsleben einsteigen» · 1. Lehrjahr |
| Lehrgang | kanonisch `EFZ_3J`; `lehrgaenge: ["EFZ_3J","EFZ_4J"]` (Bauplan §1; `sync-einheiten-nrlp` im Tor bestätigt zulässig) |
| Heft A | 1.2.1 — «Meine Woche planen – und umplanen, wenn sie kippt» · Planungsgespräch zu zweit mit Wochenplan und Anpassungsnotiz · beide Fassungen |
| Heft B | 1.2.2 — «Vor dem Kompetenznachweis: lesen, verarbeiten, abfragen» · Abfrageprotokoll einer Übungsrunde mit einem KI-Werkzeug mit Lernstand-Notiz · beide Fassungen |
| Auftrag | «Drei Wochen bis zum Kursabschluss – wie lernen wir?» · Überbetrieblicher Kurs · Ablaufplan (Fläche, Schritt 3) + Erklärung für die Lerngruppe, 2 Minuten (Stationen, Schritt 5) |
| KN | «Fünf Wochen bis zur Regelprüfung – wie plane und lerne ich?» · Verein und Freizeit · 85 Wörter · Fachgespräch / Mini Case / Werkschau |
| Neue Karten | Methodenkarte `src/data/methoden/lm-17-1-sq3r.json` (Bauplan §9, Punkt 3). Die acht Quellenkarten `q-121{a,b}-*` lagen aus der Vorbereitung vor und sind unverändert. |

## 2. Tor (letzte Ausgaben, nach Reparaturrunde 3)

| Befehl | Ergebnis |
|---|---|
| `npm run build:einheiten-index` | «16 sets written (src + public/nrlp)» |
| `begleiter-marker.mjs … --check` | «265 Marker · 0 abweichend · 0 unaufloesbar» |
| `check-all.mjs 1.2.1_lernzeit_planen` | Struktur · Status · Methoden · Sprache · Leck: 0 Fehler, 0 Warnungen · nRLP-Abgleich ok · Kopplung · Autarkie · Begleiter-Marker ok · Leitfragen-Lösungen ok · Heft v4.x ok · **«GRUEN — keine Fehler.»** (Leck-Prüfung gegen 150 Kapitel und 181 Quellentexte) |
| `export-v42.mjs` | 19 Dateien: je Heft und Fassung `heft-*.html/.docx` und `loesungen-*.html/.docx`, `auftragsbogen.*`, `begleiter.docx` |
| `messen-v42.mjs` | Exit 0 · 56 Seiten ok (4 × 8 Heftseiten, 4 Auftragsbogen, 4 × 5 Lösungen), kein Überlauf. Gemessen mit der Schreibschrift Segoe Print. Ohne Reserve (0 px): S. 1, 6 und 7 aller Hefte, S. 2 und 3 des Auftragsbogens. Knapp: Auftragsbogen S. 1 (4 px). Kein Überlauf auf Seite 6 — die 2-px-Toleranz aus E28 wurde nicht gebraucht. |
| `bestand-v42.mjs --pruefen` | «OK — 26 Dokumente unverändert.» |
| `npm run build` | Exit 0 |
| `check-all` an `1.3.1_konsum_verantworten_v42`, `2.3.1_anliegen_vertreten`, `2.1.1_informationen_hinterfragen` | «GRUEN — keine Fehler.» |
| `git status` | neu aus diesem Lauf: Ordner der Einheit, `lm-17-1-sq3r.json`, dieser Bericht; geändert: die zwei Index-Dateien (nur der neue Eintrag, 74 Zeilen dazu, keine entfernt). Alle anderen Änderungen im Arbeitsbaum bestanden vor dem Lauf. |

**Reparaturrunden (Tor): 1.** Die erste Messung zeigte fünf Überläufe bei grünem `check-all`:
Heft B S. 5 (8.9 px) und Auftragsbogen S. 4 (35.8 px) — Ursache zu lange Stufentexte
bei «Fachkorrektheit» und «Technologisches Prinzip», im KN gekürzt und zeichengenau in
Heft B und Auftrag nachgeführt; Auftragsbogen S. 1 (49.5 px) — Situation, Auftrag und
Schritt-Hinweise gekürzt; Lösungen mit Medien S. 3 von Heft A (47.2 px) und Heft B
(28.6 px) — Erwartungshorizont zu LF4 und Erwartungen der Vertiefungen gekürzt. Die
Runden 2 und 3 waren Reparaturen nach den Gegenlesern (Abschnitt 7), das Tor blieb grün.

## 3. Kapitel und Seiten (am Marker geprüft)

| Heft | Kapitel | Seiten | Wofür |
|---|---|---|---|
| A | 20.5 Lernplanung | 442–443 | LF1 (Grundsätze, ABC), LF2 (ALPEN, Richtwert), Pol von LF4 |
| A | 20.4 Arbeitsplanung und Lernjournal | 440–441 | LF3 ohne Medien (im Lehrmittel für Projektarbeiten, im Heft übertragen) |
| A | 20.3 Zielformulierung | 438 | nur Zusatzaufgabe (SMART) |
| A | 19.1 Feedback | 424–425 | Rückmeldung geben und annehmen — **ausserhalb der Crosswalk-Zeile**, Ausnahme laut Bauplan §2 |
| B | 20.6 Lern- und Prüfungsstrategien | 444 | LF1, Pol von LF4. S. 445 ist in der Kapiteldatei beschädigt und nicht verwendet |
| B | 17.1 Lesetechnik | 380 | LF2, Verfahren für S. 3 |
| B | 20.3 Zielformulierung | 438 | LF2 (Lernziel nach SMART; «A» = anspruchsvoll) |
| B | 18.4 Motivation | 420–421 | LF3 ohne Medien |

Der Crosswalk der Skill ist **nicht** nachgeführt (Kap. 19.1 bei 3J 1.2): Die Skill ist
laut Prompt gesperrt. Empfehlung des Bauplans bleibt offen.

## 4. Quellen (Fassung mit Medien; Karten und Archivtexte lagen vor, keine Recherche)

| Slot | ID | Typ · Titel · Herausgeber · Datum | Ausschnitt | Geprüft | Zugeständnis |
|---|---|---|---|---|---|
| A Quelle | `q-121a-pflicht` | Artikel · «Ich habe zu viel zu tun» · feel-ok.ch · o. D. | Abs. 12–35 | 2026-10-03 | ohne Datum; Du-Form; nennt keine Zahl; gleicher Typ wie B |
| A Ersatz | `q-121a-pflicht-ersatz` | Artikel · «Anforderung(en) reduzieren?» · feel-ok.ch · o. D. | Abs. 8–26 | 2026-10-03 | gleicher Herausgeber; trägt den Befund «Reserve fehlt» nicht (Lösung nennt den anderen Befund) |
| A Vertiefung 1 | `q-121a-vertiefung-1` | Datensatz · WorkMed · 2025-06-16 | PDF-Seite 14 | 2026-10-03 | Bericht mit heiklen Nachbarkapiteln; zwei Werte gleichauf (je 63 Prozent) |
| A Vertiefung 2 | `q-121a-vertiefung-2` | Video · SRF Einstein · 2023-06-06 | 07:43–09:57 | 2026-10-03 | nur Untertitel gelesen, nicht gesichtet |
| B Quelle | `q-121b-pflicht` | Artikel · PH Zürich, Akzente 4/2024 | Abs. 6–8 | 2026-10-03 | an Lehrpersonen gerichtet, für B1 schwer (Abschnitt 7) |
| B Ersatz | `q-121b-pflicht-ersatz` | Artikel · SRF Wissen · 2023-06-29 | Abs. 9–14 | 2026-10-03 | andere Schulstufen |
| B Vertiefung 1 | `q-121b-vertiefung-1` | Webseite · Jugend und Medien (BSV) · o. D. | Abs. 1–6, 12 | 2026-10-03 | ohne Datum |
| B Vertiefung 2 | `q-121b-vertiefung-2` | Video · SRF Einstein · 2025-12-04 | 21:10–23:00 | 2026-10-03 | nur Untertitel gelesen; Aussagen betreffen Schulkinder; 21:49 nicht verwendet |

Alle Fundstellen der Lösungen liegen im gültigen Ausschnitt (vier Lösungs-Audits).

## 5. Abdeckung (kohaerenz.md §3)

| # | Befund | Lücke |
|---|---|---|
| A1 | Rezeption schriftlich und bildlich → Heft B S. 3 (geführt) · Produktion mündlich → Auftrag, Erklärung · Interaktion mündlich → Heft A, Produkt · Produktion schriftlich und bildlich → Auftrag, Ablaufplan | keine |
| A2 | A: Interaktion mündlich → Planungsgespräch · B: Rezeption schriftlich → S. 3; Interaktion digital → Abfragerunde | keine |
| A3 | Heft A übt Rezeption schriftlich auf S. 3, ohne sie zu führen (E27); Videos als freiwillige Vertiefung | keine |
| A4 | Produkt 1 `flaeche`/Schritt 3 trägt Produktion schriftlich; Produkt 2 `spur`/Schritt 5 trägt Produktion mündlich | keine |
| A5 | alle drei Kompetenz-Modi des Lebensbezugs geführt | Interaktion digital setzt Gerät und zugelassenes KI-Werkzeug voraus (Begleiter nennt den Rückfall) |
| A6 | SK 2 → A, B, KN · 4 → A, B, KN · 6 → B, KN · 8 → A | keine |
| A7 | je SK ein `sk_anker` | SK 4 in Heft B hängt an einer Strategie von LF3 (schwächste Stelle) |
| A8 | Gespräch mit Wechselrede ≠ Protokoll mit Tabelle ≠ Ablaufplan ≠ Erklärung | keine |
| A9 | Lehrbetrieb · Berufsfachschule · Überbetrieblicher Kurs · Verein und Freizeit | keine |
| A10 | A: Argumentation + Position / Werthaltung · B: Fachkorrektheit + Technologisches Prinzip · Auftrag alle vier | keine (aber Abschnitt 8, Punkt 3) |
| A11 | ohne Medien `modell_eigener_fall` ≠ `position_gegenposition` · mit Medien `modell_eigener_fall` ≠ `lehrmittel_quelle` | keine |
| A12 | beide Hefte beide Fassungen; Karte und Archivtext für alle acht Slots | keine |
| A13 | Fall-Begriffe nur in `kn_aktivierung` und `kontext_ausschluss` (Sweep) | keine |
| A14 | Modi des Auftrags gleich wie Gold (Ergebnis der Formel); Produkttypen, SK und Modi der Hefte anders | keine |

## 6. Vergleich mit der Gold-Einheit (kohaerenz.md §4)

**Fest (F1–F13): gleich.** Sechs Dateien, `heft_8page_v42`, je acht Seiten gemessen;
Kern LF1/LF2, Spuren LF3/LF4 (`regel1`); `bloom_zielprofil` K2/K3/K4/K4; fünf Schritte
(`check-einheiten` ohne Befund); Kriterien im KN-Wortlaut (`regel6`); Begriffsnetz =
Glossar, gleiches Zentrum, ein Transfer-Ast (`regel7`, `regelGlossar`); Abschluss 2/3/4;
Auftrag mit fünf Schritten und zwei Produkten; KN mit drei Formen, `modi_kn` = Vereinigung;
Lösung zu jedem Feld (`regelLoesungen`, `check-lf-loesung`); Benennung nach E21; Sprache
(Sweep ohne Treffer).

**Hergeleitet (H1–H9):**

| | Gold 1.3.1 | 1.2.1_lernzeit_planen | Herleitung |
|---|---|---|---|
| H1 Modi A | Rezeption schriftlich und bildlich | Interaktion und Kollaboration mündlich | Modus von 1.2.1, Kompetenz-Ebene |
| H1 Modi B | dasselbe + Interaktion mündlich | Rezeption schriftlich und bildlich + Interaktion und Kollaboration digital | Modi von 1.2.2 |
| H2 Auftrag | Produktion mündlich + schriftlich und bildlich | gleich | Formel `modi_kn − (A ∪ B)`; hier führt kein Heft einen Produktionsmodus |
| H3 SK | A 5·11·1 · B 2·6·11 · KN 5·11·6 | A 8·2·4 · B 4·6·2 · KN 2·4·6 | SK von T1 (2, 4, 6, 8) |
| H4 Produkte | Karte (Liste) · Tabelle mit Regeln + Gespräch | Planungsgespräch (Liste + Wechselrede) · Abfrageprotokoll (Tabelle + Liste) | Modus und Verb der Kompetenz |
| H5 Auftrag | Blatt + Sprachnachricht | Ablaufplan (Fläche) + Erklärung für die Lerngruppe (Stationen) | je Modus ein Produkt |
| H6 Quelle | Artikel · Grafik | Artikel · Artikel | B: `detail` verlangt Texte; A: Modus des Themas — gleicher Typ ist Zugeständnis |
| H7 Pol-Typ | — | A `modell_eigener_fall` (beide) · B `position_gegenposition` / `lehrmittel_quelle` | Spannung des Hefts |
| H8 Aspekt | Wirtschaft | Technologische und digitale Transformation → «Technologisches Prinzip» | einziger Aspekt beider Kompetenzen |
| H9 Fall | Konsum | Arbeitswoche · Vorbereitung auf den KN · ÜK-Abschluss · Grundkurs im Verein | Bauplan |

Kein hergeleiteter Wert stammt aus Gold; die eine Gleichheit (H2) ist Ergebnis der Formel.

## 7. Gegenleser (Sonnet) und was daraus wurde

Gegenleser sehen Text, kein Seitenbild und kein Audio. Zeiten sind Schätzungen.

**Runde 1 (12, nach dem ersten grünen Tor).** Vier Lösungs-Audits: **kein Befund
«falsch»** — alle Fundstellen, Absätze, Zeitmarken und Rechnungen stimmen, nichts
wörtlich übernommen; 15 Ungenauigkeiten. Sweep: kein «ß», kein Platzhalter, keine
Transliteration, kein gesperrtes Wort, Anrede korrekt; sechs Grenzfälle. Sieben
Lernende: echte Stolperstellen (unten).
**Fehler des Orchestrators:** Die Pakete der vier Lernenden für die Fassung mit Medien
enthielten nur den Kopf der Quelle, nicht den Text (CRLF im Paket-Skript). Ihre
Befunde zu S. 3–4 fielen weg; in Runde 2 lasen sie mit vollständigem Paket.

**Übernommen (E, als genauer Auftrag an den Executor der Datei):**

| Datei | Befund | Behebung |
|---|---|---|
| Heft B | drei Lesende: unklar, worüber die Abfragerunde geht (drei «Stoffe») | durchgehend «Probelauf» zu «acht Punkten» (vier Lernstrategien, vier Kernaussagen), vier Fragen daraus; Lernziel gilt den zwei Kapitel der Situation |
| Heft B | LF4 nennt «Teile des Stoffs» und einen «stärksten Einwand», die nirgends stehen | «je Kapitel aus der Situation», «einen Einwand» |
| Heft B | Lesen in fünf Schritten mit zwei widersprüchlichen Verwendungen; «Text von S. 3» | Planung in LF2, Üben «am Text, den S. 3 nennt» |
| Heft B | Beispiel S. 6, Zeile 4 unverständlich | «falsch: Karte 180 Grad» |
| Heft B (LP) | Seitenbeleg für eine Ableitung; Einschränkung «Kinder und Jugendliche» fehlte (am Archivtext bestätigt); «abfragen» der Quelle zugeschrieben; «erfunden» missverständlich; «Handy» nicht auf S. 421 | gerichtet |
| Heft A | unklar, ob auf 15 oder 11 Stunden geplant wird | «alle 15 Abendstunden neu planen», «Probe danach» (in Runde 3 ohne Konjunktiv) |
| Heft A | Baustein von LF3 passte in der Fassung mit Medien nicht | «belegter Befund für den neuen Wochenplan»; Label «03 Befund in den Plan holen» |
| Heft A | Anpassungsnotiz im Beispiel S. 6 unter dem Massstab von S. 5 | Ich-Sätze mit Verzicht |
| Heft A | eine oder zwei Rückmeldungen | «Eine der zwei Rückmeldungen …» |
| Heft A (LP) | Befund mit Medien zu weit; Vertiefung 2: Ablenkung ist Ursache, «E-Mails»; Ersatzquelle trägt anderen Befund; Priorität je Aufgabe; Richtwert 60/40 nur einmal als Übertragung gekennzeichnet; eine falsche Fundstelle; Rasterzuordnung; Quer-Check gegen Lösungsbild | gerichtet |
| Set | Schritt 02: falsche Seiten, Wort «Lernweg» | «Lernstrategie (Heft B, S. 2) … KI-Werkzeug (S. 4)» |
| Set | Grammatik im Hinweis zur Erklärung | «nicht als ganzen Text» (weicht in diesem Satz vom Bauplan-Wortlaut ab) |

**Runde 2 (7 Lernende, nach den Reparaturen, mit Quellentext).** Keine harten
Widersprüche zwischen Seiten. Die Lesenden wissen, worüber die Abfragerunde geht und
auf wie viele Stunden sie planen. Beide Quellen tragen die Frage von S. 3 («ja, aber
dünn»), alle vier Vertiefungen tragen ihre Fragen. Eine Stelle blieb für die Person
mit Deutsch als Zweitsprache unklar (Heft A, Schritt 04) → Runde 3.

**Runde 3 (1 Lesende/r B1, S. 1, 5, 8 von Heft A).** Kein Widerspruch zwischen
Beschreibung, Schritt 04 und Quer-Check. Rest-Unsicherheit: ob 15 Stunden «vor oder
nach dem Wegfall» gemeint sind. Danach nichts Sichtbares mehr geändert; das Gegenlesen
ist abgeschlossen.

**Zeit je Heft (Runde 2, ohne Vertiefungen) gegen drei Lektionen (135 min):**
Heft A ohne Medien 129 · mit Medien 119 (B1: 148) · Heft B ohne Medien 133 · mit
Medien 113 (B1: **201**) · Auftragsbogen 67.

**Weggefallen nach Nachprüfung:** Befunde zu S. 3–4 der Fassung mit Medien aus Runde 1
(Paketfehler) · «Heft B S. 4 ist leer» am Auftragsbogen (im Paket liegen die Hefte
unausgefüllt) · fehlende Lehrmittelseiten zu Kap. 16.4/19.1 (stehen als Methodenkarte
im Heft) · «QR-Adresse nennt 1.2.1» (Ordnername) · «LF1 unbekannt» in Runde 3
(weggelassene Seiten).

**So gewollt (V), nur gezählt:** Schritte 01–04 ohne eigene Abgabe (Gerüst) · ein
Schreibfeld auf S. 7 · «drei weitere Aussagen» + Beispielzeile = vier Zeilen · keine
Kalenderdaten im Auftrag · Station «Was ich von euch beiden brauche» · Hefttitel mit
«Kompetenznachweis» im `heft_bezug`.

**Nicht prüfbar durch Gegenleser:** Seitenbild, Feldgrössen, Bild und Ton der zwei
Videos, der Player der QR-Seite.

## 8. Offen — was Pietro ansehen sollte

1. **Heft B: Lernziel und Probelauf prüfen verschiedenen Stoff.** Das Lernziel gilt den
   «zwei Kapiteln» der Situation, die keinen Inhalt haben; der Probelauf läuft an den
   acht Punkten des Hefts. Das ist jetzt klar benannt, bleibt aber ein Bruch, und der
   Entscheid in LF4 («je Kapitel») ist freihändig. Folge des Bauplans (§4, Situation
   und Stoff der Runde); eine Lösung wäre, den Fall an den Stoff des Hefts zu binden.
2. **Heft B, Quelle für B1 schwer** (rund ein Dutzend unerklärte Wörter, Konjunktiv,
   ein Personenname im Text der Quelle). Der Bauplan nennt die Alternative: Karten
   tauschen (SRF-Text als Quelle).
3. **«Technologisches Prinzip» im Auftrag und in Heft A** hat wenig zu greifen
   (Bauplan §9, Punkt 5): Stufe 2 verlangt «Ergebnis geprüft», der Auftrag verlangt
   kein Werkzeug. Schritt 02 des Auftrags nennt das KI-Werkzeug als Anker — das steht
   so nicht im Bauplan.
4. **Heft A ohne Medien: Kap. 20.4 trägt LF3 dünn** (ein Satz zu Änderungen, schon in
   der Beispielzeile). **Heft A mit Medien:** Die Quelle bringt gegenüber Lehrmittel
   und LF2 wenig Neues.
5. **Auftrag: «ein Reserveabend» von sechs** neben dem Richtwert von 40 Prozent aus
   Heft A — der Bogen sagt nicht, was gilt (S. 1 hat 4 px Reserve).
6. **Beispiel S. 6 in Heft A:** Die Reserve liegt auf Mittwoch und Freitag — den Tagen,
   die im Fall wegfallen; verleitet zum Abschreiben.

## 9. Entscheide ausserhalb des Bauplans

| Was | Entscheid | Grund · verworfen |
|---|---|---|
| Heft A, `zahlen_tabelle` | 15 frei · 14 verplant · 1 frei gelassen · 4 fallen weg (statt Richtwert 9 und Reserve 6) | die Bauplan-Zeilen nähmen LF2 auf S. 1 vorweg · wörtlich übernehmen |
| Heft A, Situation | fünf Posten mit Stunden; Mittwoch und Freitag je 2 Std. länger | Lösung sonst nicht rechenbar |
| Heft A, Knoten | Nachkontrolle, Ich-Botschaft im Kern; Meilenstein, Lernjournal nur ohne Medien | kommen nur in Kap. 20.4 vor |
| Heft A, Labels | Schritt-Labels gekürzt (Bauplan-Wortlaut über 30 Zeichen); Label 03 neu | Budget; Passung in beiden Fassungen |
| Heft B, Knoten | «Übe-Prompt» statt «Prompt»; «Motivation von innen» nur ohne Medien; drei Begriffe aus LF1 neu | Beleg; 25-Zeichen-Grenze |
| Heft B, LF1 | vier bestimmte Strategien | nur für diese nennt S. 444 eine Wirkung |
| Heft B, Abgaben | drei statt vier (Lernziel und Prompt in einer Zeile) | Budget |
| Heft B, Bilder | je eine Zeile «stimmt nicht»/«falsch», im Hinweis als angenommener Verlauf gekennzeichnet | sonst wirkt die Spalte «Geprüft» sinnlos · Audit: sauber |
| Heft B, `tun` | «Geben Sie nichts Persönliches ein» | Anweisung, keine Fachaussage; belegt nur in Vertiefung 1 |
| Set | Themennamen, Gewichte (30/25/15/10/10/10), Wochentage erfunden; Themennamen nur in der Tabelle | Bauplan nennt nur «sechs Themen, Summe 100»; Platz auf S. 1 |
| Set | Schritt 03 «ein Reserveabend» (ohne «mindestens»); Markieren des Weggelassenen in Schritt 04 | Platz auf S. 1 |
| KN | Stufentexte zweier Kriterien gekürzt | Überlauf S. 5 / A4 |
| Crosswalk | nicht nachgeführt | Skill gesperrt; Kap. 19.1 gilt als Ausnahme laut Bauplan §2 |

## 10. Unbelegt und nicht geprüft

- Künstliche Intelligenz: im Lehrmittel nichts. Kern und Fassung ohne Medien von Heft B
  enthalten keine Fachaussage darüber; Überlegungen sind als Fallüberlegung gekennzeichnet.
- «Neue Lebenssituation»: Fallbeschreibung, keine Fachaussage. «Selbstwirksamkeit» nur
  als Lehrplanzitat.
- Richtwert 60/40 und Kap. 20.4, SMART: im Lehrmittel für Tag bzw. Projektarbeiten, im
  Heft übertragen (in den Lösungen gekennzeichnet).
- Unterschied Dringlichkeit/Priorität; Prioritäten der fünf Aufgaben: Fallüberlegung.
- Nicht geprüft: Karte `lm-16-4-fragearten` vom Executor (ein Audit bestätigt Kap. 16.4,
  S. 373) · Bild und Ton der Videos · Stand der drei Seiten ohne Datum · PDF auf dem
  Handy · Player der QR-Seite · Word-Dokumente (nur exportiert, nicht geöffnet) ·
  Lösungen nach Runde 2 nicht erneut auditiert (geändert wurden sie nach den Audits).

## 11. Fehler in Skill, Skript, Renderer, Karten (nicht repariert; nur Neues)

1. **Bauplan-Vorlage / Phase 1:** Schritt-Labels über 30 Zeichen, vier Abgaben bei
   Budget drei, Glossarvorschlag über 25 Zeichen — die Budgets sollten beim Bauplan
   geprüft werden.
2. **Budgets der Lösungsseite 3 mit Medien** (LF4-Erwartungshorizont + zwei
   Vertiefungs-Erwartungen) prüft kein Skript; beide Hefte liefen dort über.
3. **Stufentexte ≤ 120 Zeichen** genügen nicht: Bei rund 380–416 Zeichen je Kriterium
   laufen S. 5 und A4 über; gepasst haben ≤ 340.
4. **`budgetAuftrag`** prüft Label/Wert der Zahlentabelle des Auftrags nicht.
5. **Skelett `herausforderung-template.json`:** Checklistenzeile «Begriff aus LF1» gegen
   `phase-5-spuren.md` §8 «(LF1 oder Glossar)».
6. **Datenvertrag §2.5** sagt, `tun` fehle bei `hko-…`-Karten; Phase 4 §8 erwartet es.
7. **Skelett Begleiter:** kein Ort für eine technische Voraussetzung eines Hefts (Gerät).
8. **Methodenkarten:** `lm-20-6-lernstrategien` nennt «S. 444–445» und «wirkt besser als
   nochmals lesen» (steht nicht auf S. 444); `lm-19-1-feedback`/`lm-16-4-fragearten`:
   Beispiele handeln von einem Aufsatz; `hko-uebe-prompt-bauen` spricht von «die KI».
9. **Quellenkarte `q-121a-vertiefung-2`:** Kurzbeschrieb nennt «Ablenkung abstellen» als
   Strategie; im Beitrag ist Ablenkung Ursache.
10. **Kapiteldatei 20.6, S. 445** beschädigt; **20.4, S. 440** enthält in einer
    Bildbeschreibung ein «ß».
11. **nRLP:** Lebensbezug 1.2 hat sechs Lektionen, `set.wochenplan` plant zwölf.
12. Renderer-Texte (SuK/Ges, «Persona», «Wortlaut Kompetenznachweis», «gilt auch bei …»):
    bekannt aus den Läufen 211 und 231.

## 12. Selbstprüfung Phase 3 (§3.7)

1 Fall neu: ja · 2 Lebensbereiche paarweise verschieden: ja · 3 Fall-Ausschluss: vier
Begriffe ≥ 5 Zeichen, in keinem Konzept, keiner Karte, keinem Stufentext · 4 `modi_kn` =
Vereinigung: ja · 5 jeder Modus aus `modi_kn` in A, B oder Auftrag: ja · 6 Modi der
Hefte = Kompetenz-Ebene: ja · 7 SK: ja (alle aus T1, zwei gemeinsam) · 8 drei
aktivierte Spannungsfelder, wörtlich: ja · 9 Rubrik 2 + 2, Stufen ≤ 120 (nach Kürzung
≤ 112): ja · 10 Zählwörter: ein «drei» im festen Ablauf der Werkschau · 11 Szene 85
Wörter, endet mit der Leitfrage: ja · 12 Gold-Probe: kein Satz übernommen · 13
Schlüsselmenge wie Skelett: ja. Ausnahme laut Bauplan: Kap. 19.1.
