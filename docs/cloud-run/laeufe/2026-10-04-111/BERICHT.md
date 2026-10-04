# Bericht — lokaler Lauf 2026-10-04 · Einheit 1.1.1_ausbildung_kommunizieren

| | |
|---|---|
| Branch | `v42-skill` (lokal, ein Arbeitsbaum, kein Push) |
| Auftrag | genau eine Einheit: `1.1.1_ausbildung_kommunizieren` (Bauplan `docs/cloud-run/bauplaene/1.1.1_ausbildung_kommunizieren.md`, freigegeben am 2026-10-03) |
| Skill | `.claude/skills/bbw-hko-heft-v42/`, Auto-Modus, Phasen 2–9 (Prompt `docs/cloud-run/prompts/einheit-aus-bauplan-lokal.md`) |
| Ergebnis | **grün** — eine Einheit, `status: "entwurf"` |
| Rollen | Orchestrator (Opus 5.5): Vorprüfung, `prinzip.json`, `kn.json`, alle Gates, Nachprüfung der Befunde, Sweep · Opus-Executor: Heft A, Heft B, Set, Begleiter · Sonnet-Gegenleser: 11 in Runde 1, 5 in Runde 2, 3 in Runde 3 |
| Unterbruch | Sitzungslimit während Runde 1 des Gegenlesens: sechs Gegenleser brachen ab. Fünf hatten ihren Bericht schon geschrieben (verwendet); der Sweep nicht — ihn hat der Orchestrator per Skript gemacht. |

Kein Lehrmittel-, Transkript- oder Artikeltext in diesem Bericht; nur Kapitel, Seite,
Absatz und eigene Formulierungen.

---

## 1. Einheit

| | |
|---|---|
| Ordner | `src/data/einheiten/1.1.1_ausbildung_kommunizieren/` — `prinzip.json`, `kn.json`, `herausforderung_A.json`, `herausforderung_B.json`, `set.json`, `begleiter.md` |
| Titel | «In der Ausbildung kommunizieren» · Modul 1.1 · Thema T1 «Ins Berufsleben einsteigen» · 1. Lehrjahr |
| Lehrgang | kanonisch `EFZ_3J`; `lehrgaenge: ["EFZ_3J","EFZ_4J"]` (Bauplan §1; `sync-einheiten-nrlp` im Tor bestätigt zulässig) |
| Heft A | 1.1.1 — «Ferien gestrichen – wie sage ich es im Betrieb?» · Klärungsgespräch zu zweit mit Gesprächsplan und Vereinbarungsnotiz · beide Fassungen |
| Heft B | 1.1.2 und 1.1.3 — «Schnell geteilt – aber sicher und im richtigen Ton?» · zwei Nachrichten (Chat an die Gruppe, E-Mail an die Lehrperson) mit Antwort aus der Gegenrolle · beide Fassungen |
| Auftrag | «Absagen im Teamchat – was gilt ab jetzt bei uns?» · Verein und Freizeit · Merkblatt «So melden wir uns» (Fläche, Schritt 4) + Erklärung am Elternabend, 2 Minuten (Stationen, Schritt 5) |
| KN | «Materialgeld bar, Fotos in den Kurschat – was sage ich wem?» · überbetrieblicher Kurs · 107 Wörter · Fachgespräch / Mini Case / Werkschau |
| Neue Karten | keine. Die acht Quellenkarten `q-111{a,b}-*` lagen aus der Vorbereitung vor (unverändert, mit diesem Lauf committet). Keine neue Methodenkarte. |

## 2. Tor (letzte Ausgaben, nach Reparaturrunde 3)

| Befehl | Ergebnis |
|---|---|
| `npm run build:einheiten-index` | «17 sets written (src + public/nrlp)» |
| `begleiter-marker.mjs … --check` | «274 Marker · 0 abweichend · 0 unaufloesbar» |
| `check-all.mjs 1.1.1_ausbildung_kommunizieren` | Struktur · Status · Methoden · Sprache · Leck: 0 Fehler, 0 Warnungen · nRLP-Abgleich ok · Kopplung · Autarkie · Begleiter-Marker ok · Leitfragen-Lösungen ok · Heft v4.x ok · **«GRUEN — keine Fehler.»** (Leck-Prüfung gegen 150 Kapitel und 270 Quellentexte; Ausgabe: `check-all.txt`) |
| `export-v42.mjs` | 19 Dateien: je Heft und Fassung `heft-*.html/.docx` und `loesungen-*.html/.docx`, `auftragsbogen.*`, `begleiter.docx` |
| `messen-v42.mjs` | Exit 0 · 56 Seiten ok (4 × 8 Heftseiten, 4 Auftragsbogen, 4 × 5 Lösungen), **kein Überlauf** (Ausgabe: `messung.txt`). Gemessen mit Segoe Print. Ohne Reserve (0 px): S. 1, 6 und 7 aller Hefte, S. 2 und 3 des Auftragsbogens. Knapp: Heft A mit Medien S. 8 (4.2 px), Heft B mit Medien S. 8 (6 px). Die 2-px-Toleranz aus E28 wurde nicht gebraucht. |
| `bestand-v42.mjs --pruefen` | «OK — 26 Dokumente unverändert.» |
| `npm run build` | Exit 0; `git status` vor und nach dem Build gleich (der `prebuild`-Abgleich hat nichts geändert) |
| `check-all.mjs 1.3.1_konsum_verantworten_v42 2.3.1_anliegen_vertreten 2.1.1_informationen_hinterfragen` | «GRUEN — keine Fehler.» |

**Reparaturrunden am Tor:** `check-all` war nach Phase 8 im ersten Lauf grün. Die Messung zeigte
danach zwei Überläufe, beide in den Daten behoben: Heft B S. 6 (101 px, beide Fassungen) und
Auftragsbogen S. 1 (152.8 px). Dazu kamen drei Runden aus dem Gegenlesen (§7). `--baseline`
wurde nie benutzt.

**Von Hand geprüft (phase-9 §3):** Prinzip, Hefte und Set tragen dieselben Werte
(`kn_kriterien_verteilung`, `pol_typ_verteilung`, `mindmap_zentrum_kurz`, `auftrag_lebensbereich`,
`modi_pro_heft` = `nrlp.sprachmodi`, `sk_pro_situation` = `nrlp.sk`, `konzept_progression` =
`kernkonzept`) — per Skript verglichen, alle gleich. Lösungen in keinem Heft-HTML (fünf Proben je
Heft, kein Treffer). Im sichtbaren Text der Hefte kein «Spur», «Pflichtquelle», «Lektion»,
«Trade-off»; «Woche» nur als Ferienwoche des Falls; «Minuten» nur als Produktdauer und in einer
Methodenkarte; «Stufe» nur im festen Text des Renderers (bekannt). Fall-Begriffe des KN nur in
`kn_aktivierung` und `kontext_ausschluss`.

## 3. Kapitel und Seiten

| Heft | Kapitel | Seiten | Wofür |
|---|---|---|---|
| A | Kap. 1.4 Der Lehrvertrag | 32–36 | LF1/LF2 (S. 35–36), LF3 ohne Medien (S. 32–34), LF4 (S. 33) |
| A | Kap. 19.2 Konflikte | 426–429 | LF1/LF2 (vier Botschaften, Aussprache); Karte `lm-19-2-vier-ohren` |
| A | Kap. 19.1 Feedback | 425 | Ich-Botschaft; Karte `lm-19-1-feedback` |
| A | Kap. 18.1 Identität | 412 | nur Lösung LF2, Zeile «Rolle» |
| B | Kap. 17.4 Korrespondenz | 400–401 | LF1/LF2/LF4 (E-Mail, CC/BCC) |
| B | Kap. 1.4 Der Lehrvertrag | 31 | LF1/LF2/LF4 (Sorgfalts- und Treuepflicht) |
| B | Kap. 20.8 Recherchieren | 449–450 | LF3/LF4 ohne Medien (Prüffragen, Endungen) |
| B | Kap. 20.7 Medienkompetenz | 446–447 | Lösung LF1 (Begriff); Karte `lm-20-7-fake-news-check` |
| Auftrag | Kap. 17.4 · Kap. 19.1 | 400–401 · 425 | Sachgrundlage (nur Erwartungshorizont) |
| KN | Kap. 1.4 | 31 · 34 | Anordnungen der Kursleitung · keine zusätzlichen Kosten für den Kurs |

Methodenkarte ausserhalb der Crosswalk-Zeile: `lm-16-4-fragearten` (Kap. 16.4, S. 373; E27).

## 4. Quellen (Spur mit Medien)

Alle acht: Karte **und** Archivtext vorhanden (Vorprüfung), `sachlage_geprueft` 2026-10-03;
Lösungen am Archivtext geschrieben am 2026-10-04 (`quelle_stand`).

| ID | Typ | Titel · Herausgeber · Datum | Ausschnitt | Zugeständnis |
|---|---|---|---|---|
| `q-111a-pflicht` | artikel | Lexikon der Berufsbildung: Ferien · berufsbildung.ch (SDBB) · o. D. | Abs. 1–3 | ohne Datum; dichte Fachsprache; gleicher Typ wie B |
| `q-111a-pflicht-ersatz` | artikel | Ferien während der Berufslehre · Kanton Freiburg · o. D. | Abs. 3–10 | anderer Kanton; kennt keine Regel zu Ferien in der Schulzeit — das Argument «Schultag im November» trägt mit ihr nicht (in Lösung und Begleiter vermerkt) |
| `q-111a-vertiefung-1` | artikel | Rechte im Lehrbetrieb · SRF Kassensturz Espresso · 2026-07-30 | Abs. 8–13 | Auskunftsperson eines Arbeitnehmerverbands; reiht die Schritte anders als Kap. 1.4, S. 35 (Lösung sagt es) |
| `q-111a-vertiefung-2` | rechtstext | OR Art. 329a, 329c, 345a · Fedlex · Stand 2026-01-01 | drei Artikel | Gesetzessprache; neuere Fassung nicht geprüft |
| `q-111b-pflicht` | artikel | Erste Schritte: Konten und Geräte schützen · BACS · o. D. | Abs. 4–9 | Titel ergänzt; ohne Datum; für Privatpersonen geschrieben |
| `q-111b-pflicht-ersatz` | artikel | Wenn ein Passwort mehrere Konten gefährdet · Bundesamt für Cybersicherheit · 2026-04-20 | Abs. 1–13 | trägt nur den Teil «Konten» |
| `q-111b-vertiefung-1` | artikel | Phishing mit Logins · S-U-P-E-R.ch · 2025-03-07 | Abs. 1–7 | duzt; Privatbereich |
| `q-111b-vertiefung-2` | artikel | «123456» als Passwort? · SRF Kassensturz Espresso · 2025-10-21 | Abs. 1–8 | Rangliste in Abs. 2 nicht verwendet |

Audit: Wortzahlen der Karten am Archiv nachgezählt (186/180/173/229 · 262/417/209/287), alle
Fundstellen im Ausschnitt, keine Übernahme ab 14 Wörtern.

## 5. Abdeckung (kohaerenz.md §3) und Vergleich mit Gold

| # | Befund |
|---|---|
| A1 | Rezeption schriftlich und bildlich → A und B, S. 3 · Interaktion mündlich → A, Produkt · Produktion schriftlich und bildlich → Auftrag A2 · Produktion mündlich → Auftrag A3 |
| A2 | A: Rezeption → S. 3, Interaktion mündlich → Schritt 05 · B: Rezeption → S. 3, Interaktion digital → Schritt 05 |
| A3 | entfällt (beide Hefte führen den Modus von S. 3) |
| A4 | `flaeche` Schritt 4 (schriftlich) · `spur` Schritt 5 (mündlich) |
| A5 | zwei Lücken wie im Bauplan: digitaler Modus auf Papier (Senden ist das «Plus»); Suchen auf Webseiten mit Medien nur über die Karte `hko-gezielt-suchen` |
| A6 | SK 2 → A, KN · 4 → B · 6 → A, B, KN · 8 → A, B, KN |
| A7 | je Heft drei `sk_anker`; SK 8 an LF3 bleibt die schwächste Zuordnung (Bauplan §9) |
| A8 | Gespräch mit Plan ≠ Nachrichtenpaar ≠ Merkblatt ≠ Erklärung |
| A9 | Lehrbetrieb · Berufsfachschule · Verein und Freizeit · überbetrieblicher Kurs |
| A10 | A: Argumentation + Rechtliches Prinzip · B: Fachkorrektheit + Position / Werthaltung · Auftrag: alle vier |
| A11 | ohne Medien `recht_praxis` ≠ `modell_eigener_fall` · mit Medien `lehrmittel_quelle` ≠ `modell_eigener_fall` |
| A12 | beide Hefte: beide Fassungen, je Quelle + Ersatzquelle + zwei Vertiefungen |
| A13 | kein Fall-Begriff in Heften, Auftrag, Glossar, Karten (`check-v42` 0 Befunde) |
| A14 | Modi des Auftrags gleich wie Gold (Ergebnis der Formel), Produkttypen und SK anders |

**Fest (F1–F13):** gleich wie Gold — sechs Dateien, Template `heft_8page_v42`, Kern + Spuren, vier
Leitfragen K2/K3/K4/K4, fünf Schritte, Kriterien im KN-Wortlaut (`regel6`), Begriffsnetz = Glossar
(je Heft 10 Knoten), Abschluss 2/3/4, Auftrag mit zwei Produkten, KN mit drei Formen, Lösung zu
jedem Feld, IDs nach E21, Sprache. **Eine Abweichung von der Gold-Form:** `methoden[0].beispiel`
in Heft B (§6, Entscheid 1).

| Hergeleitet | Gold 1.3.1 | 1.1.1 | Herleitung |
|---|---|---|---|
| Modi A | Rezeption schriftlich | Rezeption schriftlich + Interaktion mündlich | Kompetenz 1.1.1 |
| Modi B | Rezeption schriftlich + Interaktion mündlich | Rezeption schriftlich + Interaktion digital | 1.1.2 / 1.1.3 |
| Auftrag | Produktion mündlich + schriftlich | gleich | Formel; kein Heft führt Produktion |
| SK | A 5·11·1 · B 2·6·11 · KN 5·11·6 | A 8·6·2 · B 8·6·4 · KN 6·8·2 | SK von T1 |
| Produkt A | kommentierte Karte (Liste) | Gespräch mit Plan (Wechselrede + Liste) | «kommunizieren», Interaktion mündlich |
| Produkt B | Tabelle + Gespräch | zwei Nachrichten mit Antwort (Fliesstext) | «zielgruppengerecht», Interaktion digital |
| Auftrag | Blatt + Sprachnachricht | Merkblatt + Erklärung vor Publikum | je Modus ein Produkt |
| Quellentyp | Artikel · Grafik | Artikel · Artikel | beide Kompetenzen: Rezeption schriftlich |

## 6. Entscheide, die sonst ein Mensch getroffen hätte

1. **Heft B, `methoden[0].beispiel` überschreibt das Beispiel der Karte `lm-20-7-fake-news-check`**
   (drei statt fünf Zeilen, gleiches Sujet). Grund: Mit den vier Karten des Bauplans lief S. 6 um
   101 px über; das Kürzen des Beispielbilds allein liess 50 px stehen, weil das fünfzeilige
   Kartenbeispiel die untere Reihe bestimmt. Der Loader unterstützt das Feld; Datenvertrag §11.3
   sagt, die Skill schreibe es nicht. Verworfen: eine Karte tauschen (Entscheid des Bauplans)
   oder «nicht erzeugbar». **Bitte ansehen.**
2. **Beispielbild Heft B stark gekürzt** (E-Mail rund 25 Wörter; der Titel sagt, dass die eigene
   50–70 Wörter hat). Blocktitel im Beispiel «E-Mail an die Verwaltung» statt wie im Lösungsbild
   «… an die Lehrperson» (anderer Lebensbereich). Legende `neu` hat im Fliesstext keinen Träger
   (`text` kennt keine `marke`); die geänderte Stelle steht als Absatz «Geändert: …».
3. **Beispielbild Heft A zeigt Gespräch und Vereinbarung, nicht den Gesprächsplan** (Bauplan: zwei
   Blöcke; ein dritter drückt die Wechselrede auf 180 Zeichen). Der Titel verweist auf S. 7 und die
   Liste von S. 5.
4. **`nrlp.gesellschaft` von Heft B führt «Recht» (R1)** neben «Technologische und digitale
   Transformation», weil Bauplan §3 Recht in Heft B über die Konfliktart aktiviert.
5. **Schritt-Labels gekürzt** (Budget 30): A «01 Konflikt, Strategie klären», «05 Gespräch führen,
   notieren»; B «05 Schreiben und überarbeiten». Bauplan-Arbeitsfassung der Leitfrage zu
   Vertiefung 1 (B) von 103 auf 100 Zeichen gekürzt.
6. **LF4 Heft A:** zwei Möglichkeiten «auf der Herbstferienwoche bestehen» / «die Novemberwoche
   gegen eine andere tauschen»; die dritte aus dem Bauplan-Audit («annehmen und etwas aushandeln»)
   steht nur im Lösungsbild. **LF4 Heft B:** «nur unter Bedingungen nutzen» / «anderen Weg
   vorschlagen».
7. **LF2 Heft A** lässt die vier Botschaften am Satz des Kollegen hören (nach Gegenlesen; vorher
   am Ferienplan).
8. **Auftrag:** `zahlen_tabelle` leer, Situation 673 Zeichen (S. 1 lief über); Wortlaut des
   Trainers in Grossbuchstaben erfunden; `heft_bezug` je Heft zwei Einträge.
9. **Stufentexte der Rubrik** je Kriterium ≤ 307 Zeichen (Erfahrung Lauf 121: ≤ 340).
10. **Begleiter:** SK des Auftrags in der Abdeckungstabelle 4 · 6 (der Bauplan nennt keinen Wert);
    Lektionenrahmen 12 von 15; Zeit-Callout mit drei Vorschlägen.
11. **Glossar:** A «Verhandeln» statt «Vereinbarung», eigene Knoten mit Medien «Lehrjahr»,
    «Pflichtunterricht»; B «Adressat/in» statt «Signatur».

Selbstprüfung Phase 3 (§3.7): 1 Fall neu ✓ · 2 Lebensbereiche paarweise verschieden ✓ · 3
Fall-Ausschluss: drei Begriffe ≥ 5 Zeichen, in keinem Konzept, keiner Karte, keinem Stufentext ✓ ·
4 `modi_kn` = Vereinigung ✓ · 5 Abdeckung Modi ✓ · 6 Modi der Hefte nur Kompetenz-Ebene ✓ · 7 SK
aus T1, zwei gemeinsam ✓ · 8 drei Spannungsfelder wörtlich, `mehrdeutigkeits_pflicht` =
`verbindlich` ✓ · 9 Rubrik 2 + 2, Stufen ≤ 87 Zeichen ✓ · 10 Zählwörter: ein «drei» im festen
Ablauf der Werkschau ✓ · 11 Szene 107 Wörter, endet mit der Leitfrage ✓ · 12 Gold-Probe ✓ · 13
Schlüsselmengen = Skelett ✓. Ausnahme laut Bauplan: Karte aus Kap. 16.4.

## 7. Gegenleser

Modelle in einer Rolle: Sie lesen Seitentext, sehen kein Seitenbild. Zeiten sind Schätzungen.

**Runde 1** (nach grünem Tor und Messung): Lernende a an A ohne, A mit, B ohne, B mit · Lernende b
(DaZ, B1) an A mit, B mit · Lernende a am Auftragsbogen · vier Lösungs-Audits · Sweep (Orchestrator,
Skript: kein «ß», kein Platzhalter, Transliteration nur in URLs, Du-Form nur in zitierter Rede).
Jeder Befund am Dokument nachgeprüft. Übernommen (E):

- **Heft A (13 Aufträge):** Widerspruch «Stichwort» gegen «erklären» (S. 2) · «Botschaften /
  Ebenen / Ohren» vereinheitlicht · LF2 an eine Äusserung gebunden · Inhalt des Gesprächsplans an
  drei Stellen gleich · Gegenüber bringt einen Einwand (Schritt 05) · LF4 «sollen» statt «sieht
  vor» · Beispielbild in sich stimmig · Karte «vier Ohren» mit der vierten Seite · fünf Korrekturen
  in Lösungen (Rolle S. 412, «wertfrei» S. 429, Vertiefung 1 «reiht anders», Ersatzquelle,
  Quer-Check).
- **Heft B (11 Aufträge):** Kriterium nahm das «Nein» vorweg (drei Lesende) · «Auflagen» unerklärt
  · Partnerin nicht eingeführt · Belege passten nicht in 40 Wörter · Beispiel-E-Mail gegen 50–70
  Wörter · LF3 mit Medien fragte nach Geräten, wo kein Verstoss ist · fünf Korrekturen in Lösungen
  (Abs. 7 nur Analogie, Befund gegen Beispiel, Rasterbegriffe, Deutung markiert, Lösungsbild 47
  statt 40 Wörter).
- **Auftrag (5):** Indikator verriet Regeln und nannte Lehrmittelseiten · Einwand ohne Schritt ·
  Verweise auf eigene Notizen statt gedruckter Listen · Ort der Vorarbeit.

Weggefallen: Fundstellen «nicht im Paket» (Kap. 20.7, 16.4 — Artefakt des Pakets) · `quelle_stand`
≠ Karte (so gewollt) · «Abgaben ≠ Checkliste» (so gewollt: Produkt gegen ganzes Heft).

**Runde 2** (fünf Lesende an den geänderten Seiten): Widersprüche aus Runde 1 weg. Übernommen:
A vier Stellen (Schritt 01, «(nicht 426)», «Ihr Plan» = Ferienplan, Ort der Abgaben) · B vier
(Belege in «Das geben Sie ab», Haltung im Beispiel-Chat, `liefert` LF3, «Absatz») · Auftrag drei
(Indikator ohne Ortsvorgabe, «Übertragen Sie», Einwand bei Station 3).

**Runde 3** (drei Lesende, letzte): kein neuer Widerspruch zwischen zwei Seiten, der an den Daten
dieser Einheit liegt und sich ohne Änderung eines Bauplan-Entscheids beheben liesse. **Offen
geblieben** (drei Runden ausgeschöpft):

1. **Heft A, LF4:** «die Novemberwoche gegen eine andere tauschen» ist unterbestimmt — der Tausch
   rettet die gebuchte Reise nicht, und Kap. 1.4, S. 33 stützt «bestehen» nur schwach; die Wahl
   kippt zu «verhandeln».
2. **Heft B, S. 3:** Kap. 20.8 (ohne Medien) prüft Informationsseiten, nicht eine Ablage für Fotos;
   die Quelle (mit Medien) verbietet «ein Konto für alle» nicht ausdrücklich. Folge aus Bauplan §2
   und §9 Punkt 2.
3. **Heft B, S. 6:** «Geändert: Wer weg ist, ruft mich an.» liest sich als neuer Satz, nicht als
   geänderte Stelle; die E-Mail des Beispiels wird trotz Antwort nicht geändert.
4. **Heft B, S. 5:** Schritte 01, 02, 04 sagen nicht, wo festgehalten wird; die Kanäle (Chat,
   E-Mail) stehen in der Produktbeschreibung fest, bevor LF2 sie ordnet.
5. **Auftrag:** Der Fall hat keine Rechtsgrundlage; «Rechtliches Prinzip» liest sich dort als
   «stimmt mit dem Lehrmittel überein». Die Stationen (Bauplan, wörtlich) haben kein Feld für den
   Einwand.
6. **Alle Dokumente:** Die höchste Punktzahl mehrerer Kriterien («auf eine neue Lage übertragen»,
   «Folgen für beide Seiten», «Schutz») verlangt etwas, das kein Schritt anleitet (KN-Wortlaut;
   Übertragung nur über «gilt auch bei …» auf S. 8).

**Zeit (Schätzung der Lesenden, je Heft, Seitenplan 135 Min.):** Profil a 90–152 Min.; Profil b
(DaZ) 165–227 Min. Der Begleiter nennt das. **Nicht geprüft von Gegenlesern:** Seitenbild,
QR-Seite am Handy.

## 8. Unbelegt oder nicht geprüft

- Ob eine nur mündlich erwähnte Ferienwoche als abgemacht gilt: offene Frage des Falls (Lösungen,
  Begleiter). Was mit dem Schultag in einer Ferienwoche geschieht: nur Quelle (Abs. 3).
- Heft B ohne Medien: Passwort, gemeinsames Konto, Ablage sind Fallüberlegungen; Regeln für den
  Chat sind eine Übertragung der E-Mail-Regeln; ob ein Einsatzplan mit Kundennamen ein
  Geschäftsgeheimnis ist, sagt das Lehrmittel nicht. «Ablage der Schule mit eigenem Login» im
  Lösungsbild ist eine Annahme.
- KN: ob Bewertungen in einem offenen Chat zulässig sind — kein Rechtsurteil verlangt.
- Inhalt der Methodenkarten gegen die Kapitel; Kap. 16.4, S. 373 nur für die Karte angesehen.
- Fedlex: neuere Fassung als 2026-01-01; Darstellung der Seiten am Handy (Cookie-Hinweis).
- Glossar-Definitionen mit `herkunft: "lehrmittel"`: von den Heft-Executoren am Text belegt, vom
  Set-Executor nur für Kap. 17.4 und 19.1 nachgeprüft.

## 9. Fehler in Skill, Skript, Renderer, Karten (nicht repariert; nur Neues)

Bekannt und wieder aufgefallen (nicht neu gemeldet): «Wissensecke II», «Wortlaut
Kompetenznachweis», «Stufe», SuK/Ges unerklärt, Checkliste ✔ und ☐, Skelett «Begriff aus LF1»
gegen phase-5 §8, `hko-quelle-raster` mit «sehen, hören» und Zeitmarke, `lm-19-1-feedback` mit
Aufsatz-Beispielen, «(Beispielwert)» in phase-5 §9, `budgetAuftrag` ohne Zellenprüfung,
`check-einheiten` ohne `--strict`.

Neu:

1. **Seite 6 ist mit zwei langen Karten nicht zu halten.** `lm-20-7-fake-news-check` (fünfzeiliges
   Beispiel) und `hko-gezielt-suchen` zusammen lassen dem Beispielbild rund 60 px. Phase 1 sollte
   die Höhe der vier Karten prüfen, oder der Datenvertrag `methoden[].beispiel` im Kern zulassen.
2. **Fliesstext-Block (`text`) kennt keine `marke`**; eine Legende ist dort ohne Träger. Der
   Bauplan konnte «Legende `neu`» und Blockart `text` zugleich verlangen.
3. **Bauplan-Vorlage:** Produktbild-Blöcke und «Bild zeigt jede Abgabe» (phase-6) kollidieren, wenn
   das Produkt Plan + Gespräch + Notiz ist; kein Feld «SK des Auftrags» (Begleiter braucht es).
4. **Denkhilfe S. 4:** der Renderer zeichnet drei leere Zeilen; der Hinweis «Zwei Zeilen genügen»
   liest sich als Widerspruch (vier Lesende).
5. **S. 8:** Text «zwei leere Knoten» neben drei freien Feldern (mit «gilt auch bei …»).
6. **Karte `lm-16-4-fragearten`:** führt «Warum …?» als offene Frage; Kap. 1.4, S. 36 rät «wie
   statt warum». Karte `lm-17-2-w-fragen` nennt S. 381–392 für ein Werkzeug einer Seite.
7. **Kapiteldateien:** 19.2, S. 427 Bildbeschreibung nennt eine der vier Seiten falsch (Bauplan
   §9; eine Leserin stolperte darüber); 20.8, S. 450 «Osterreich».
8. **`set-template.json`** führt `lehrgaenge` nicht (nur phase-7 §2).
9. **`gegenleser.md` §3:** Der Auftragsbogen-Leser braucht S. 2 und S. 7 der Hefte (darauf
   verweisen die Schritte), nicht S. 4 und 8; hier bekam er beide Hefte ganz.
10. **Arbeitsbaum:** Während des Laufs schrieb eine andere Sitzung in denselben Baum
    (`ENTSCHEIDE.md` E30, neue Karten `q-3xx` bis `q-6xx`). Diese Einheit ist davon nicht berührt
    (die sechs Wörter aus E24 kommen nicht vor); committet sind nur die Dateien dieses Laufs.

## 10. Für die Abnahme

1. **Vor dem Druck gegenlesen (kein Audio, kein Video in dieser Einheit):** die zwei Seiten ohne
   Datum (`q-111a-pflicht`, `q-111b-pflicht`) am Bildschirm und am Handy; die Fedlex-Fassung;
   S. 6 von Heft B am Papier (0 px Reserve, überschriebenes Kartenbeispiel).
2. **Entscheid 1 (§6):** `methoden[0].beispiel` in Heft B — hinnehmen oder eine Karte im Bauplan
   tauschen.
3. **LF4 von Heft A** (§7, offen 1): die zweite Möglichkeit schärfen oder den Fall so stellen, dass
   «bestehen» tragfähiger ist.
