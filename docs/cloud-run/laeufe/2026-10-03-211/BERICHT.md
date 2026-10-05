# Bericht — Produktionslauf 2026-10-03, Zeile 2.1.1_informationen_hinterfragen

Branch `lauf/2026-10-03-211` · Skill `bbw-hko-heft-v42`, Auto-Modus (Phasen 2–9) ·
Bauplan `docs/cloud-run/bauplaene/2.1.1_informationen_hinterfragen.md` (freigegeben 2026-10-02).
Nur diese eine Zeile der Auftragsliste bearbeitet.

**Ergebnis: GRÜN.** Ordner `src/data/einheiten/2.1.1_informationen_hinterfragen/`, sechs
Dateien, `status: "entwurf"`, `lehrgaenge: ["EFZ_4J", "EFZ_3J"]` (kanonisch EFZ_4J).
Keine neue Quellen- oder Methodenkarte. Kein Lehrmittel- oder Quellentext in diesem Bericht.

Alle Entscheide, die sonst ein Mensch getroffen hätte, stehen einzeln mit Grund und
verworfenen Alternativen in `ENTSCHEIDE.md` (31 Einträge). Hier nur die Zusammenfassung.

## 1. Ablauf und Rollen

| Phase | Wer | Ergebnis |
|---|---|---|
| Start | Orchestrator | `npm ci`, `cloud-preflight` GRÜN (17 × ok), Branch angelegt |
| 2, 3 | Orchestrator | `prinzip.json`, `kn.json`; Selbstprüfung phase-2-3 §3.7 (Abschnitt 6) |
| 4–6 A | Executor A (Opus) | `herausforderung_A.json`, nur Spur `mit_medien` |
| 4–6 B | Executor B (Opus) | `herausforderung_B.json`, Spuren `ohne_medien` und `mit_medien` |
| 7 | Executor Set (Opus) | `set.json` |
| 8 | Executor Begleiter (Opus) | `begleiter.md`, Marker per `begleiter-marker.mjs` |
| Messung vor dem Tor | Orchestrator | sechs Überläufe → drei Kürzungsaufträge an A, B, Set |
| Gegenlesen | 7 × Sonnet | 3 Blindleser, 3 Lösungs-Audits, 1 Sweep (Abschnitt 8) |
| Reparatur | Executoren A, B, Begleiter | 15 + 18 + 1 Punkte |
| 9 | Orchestrator | Tor zweimal vollständig ausgeführt, beide Male grün |

Jedes Gate hat der Orchestrator selbst ausgeführt; kein Ergebnis eines Executors ist ungeprüft übernommen.

## 2. Tor (letzter Lauf)

```
$ npm run build:einheiten-index
einheiten.index.json: 13 sets written (src + public/nrlp)

$ node .claude/skills/bbw-hko-heft-v42/scripts/begleiter-marker.mjs 2.1.1_informationen_hinterfragen --check
274 Marker · 0 abweichend · 0 unaufloesbar · nichts geschrieben

$ node scripts/check-all.mjs 2.1.1_informationen_hinterfragen --cloud
  ok      Lehrmittel  76 Kapitel und 91 Quellentexte fuer die Leck-Pruefung geladen
  ok      nRLP-Datensaetze
2.1.1_informationen_hinterfragen
  ok      Struktur · Status · Methoden · Sprache · Leck  0 Fehler, 0 Warnungen
  ok      nRLP-Abgleich (Kompetenz-/Lebensbezugstexte, Lehrgaenge)
  ok      Kopplung · Autarkie · Begleiter-Marker
  ok      Leitfragen-Loesungen
  ok      Heft v4.x (Budgets, Spuren, Quellen)
GRUEN — keine Fehler.

$ node scripts/check-v42.mjs 2.1.1_informationen_hinterfragen
2.1.1_informationen_hinterfragen: 0 Befunde (0 / 0 / 0 in a / b / c).

$ node scripts/export-v42.mjs 2.1.1_informationen_hinterfragen --out <tmp>
15 Dateien: heft-a-mit-medien, heft-b-ohne-medien, heft-b-mit-medien,
loesungen-a-mit-medien, loesungen-b-ohne-medien, loesungen-b-mit-medien,
auftragsbogen (je .html + .docx), begleiter.docx

$ CHROME_PATH=<wrapper> node scripts/messen-v42.mjs <tmp>      → Exit 0
43 Seiten, alle «ok»: Hefte je 8, Auftragsbogen 4, Lösungen je 5  (vollständig: messung.txt)

$ node scripts/bestand-v42.mjs --pruefen                         → Exit 1, siehe 11.1
ABWEICHUNG in 2 von 26 Dokumenten:
  1.3.1_konsum_verantworten · css: f0123cc13cac → bb1735327fb8
  1.1.1_konflikt_kommunizieren · css: f0123cc13cac → bb1735327fb8

$ npm run build                                                   → Exit 0 («Complete!»)
$ git status --short
 M public/nrlp/einheiten.index.json
 M src/data/einheiten.index.json
?? docs/cloud-run/laeufe/
?? src/data/einheiten/2.1.1_informationen_hinterfragen/
```

Volle `check-all`-Ausgabe: `check-all.txt`; Messung: `messung.txt` (beide in diesem Ordner).

**Bestand:** Die Abweichung ist **nicht** von diesem Lauf. Gegenprobe: Neuer Ordner
weggeräumt, beide Index-Dateien auf HEAD zurückgesetzt, `bestand-v42 --pruefen` erneut → dieselbe
Abweichung. Es weicht nur der CSS-Fingerabdruck ab, Markup und Word sind gleich. Vermutete
Ursache: Die Fingerabdrücke wurden unter Windows (CRLF im Checkout) geschrieben, der Container
checkt LF aus. Kein CSS, kein Renderer, keine andere Einheit wurde verändert (`git status` oben).

**`sync:einheiten-nrlp`** (im `prebuild`) hat keine Datei der neuen Einheit geändert: Lehrplantexte wörtlich.

**Reparaturrunden:** `check-all` war in beiden vollständigen Läufen grün. Die Kürzungen nach der
ersten Messung und die Korrekturen aus dem Gegenlesen gelten je als eine Runde (zwei von drei).

## 3. Kapitel und Seiten

| Kapitel (Datei) | Seiten | Wofür |
|---|---|---|
| 6.6 Interessengruppen | 172–173, 177–179 | Heft A: LF1 (Parteien, Verbände, NGO, Lobby), LF2 (Grundhaltungen, Grenzen des Schemas), Glossar |
| 7.1 Medien | 186–189 | Heft B: LF1 (Auswahl, Gewichtung, Wortwahl, Bildmanipulation; Selbstschutz, Fake News); S. 186 belegt Spannungsfeld 4 |
| 20.7 Medienkompetenz | 446–447 | Heft B: LF2 (drei Checks), LF3 ohne Medien (nur Fliesstext; Diagrammwerte ausgeschlossen), Methodenkarte |
| 20.8 Recherchieren | — | Reserve laut Bauplan; keine Lösung zitiert daraus → nicht in `quellen_anker` |

Methodenkarten ausserhalb der Crosswalk-Zeile (`lm-19-2-vier-ohren`, `lm-17-3-3b-schema`,
`lm-17-2-stichwortnotizen`, `lm-17-3-stellungnahme`): nur Karte verwendet, kein Kapitelinhalt (Bauplan §9).

## 4. Quellen

Alle acht Karten lagen vor (Phase Q lokal, Bauplan §7), je Karte **und** `gewaehlt/quelle.md`.
Prüfdatum der Karten (`sachlage_geprueft`): 2026-10-02. Lösungen dazu geschrieben und
geprüft in diesem Lauf; `quelle_stand` in den Heften: 2026-10-03 (Laufdatum).

| Slot | ID | Typ | Titel · Herausgeber · Datum | Ausschnitt | Zugeständnis |
|---|---|---|---|---|---|
| A Quelle | `q-211a-pflicht` | audio | Pro und Contra zur Individualbesteuerung · SRF Rendez-vous · 2026-01-15 | 00:00–03:53 | Vorbericht zur angenommenen Vorlage; automatisches Transkript; Zeitmarken berechnet |
| A Ersatz | `q-211a-pflicht-ersatz` | audio | Individualbesteuerung: Linke Hilfe als Zünglein an der Waage · SRF Echo der Zeit · 2026-03-09 | 00:00–03:27 | keine Gegenstimme → Einwand für LF4 aus Vertiefung 2 |
| A Vertiefung 1 | `q-211a-vertiefung-1` | video | Abstimmung Individualbesteuerung: Folgen für die Kantone · SRF 10 vor 10 · 2026-01-30 | 00:00–04:46 | Umfragewerte überholt; nur Untertitel geprüft |
| A Vertiefung 2 | `q-211a-vertiefung-2` | artikel | Individualbesteuerung: Argumente der Komitees und des Bundesrates · Bundesrat / Bundeskanzlei · 2026-02-12 | S. 59–60 | Link am 2026-10-02 zweimal HTTP 403 |
| B Quelle | `q-211b-pflicht` | grafik | JAMESfocus «News und Fake News» · ZHAW · 2019 | PDF-S. 20, Abb. 10 | Erhebung 2018 |
| B Ersatz | `q-211b-pflicht-ersatz` | grafik | Digital News Report 2025, Darst. 33 · fög UZH · 2025 | S. 27 | ganze Online-Bevölkerung; hypothetisch («würden») |
| B Vertiefung 1 | `q-211b-vertiefung-1` | webseite | Was ist ein Algorithmus und wie entstehen Filterblasen? · Saferinternet.at · o. D. | Teile zu Algorithmus, Filterblase | Österreich, ohne Datum |
| B Vertiefung 2 | `q-211b-vertiefung-2` | video | Deepfakes im Netz … · SRF 10 vor 10 · 2024-05-31 | 00:02–05:40 | Thema Anlagebetrug, nicht Politik |

## 5. Die zwei ausdrücklichen Fragen

### 5.1 Heft A mit nur einer Spur — Export, Dokument «Lösungen», Begleiter

- **Daten:** `herausforderung_A.json` trägt unter `spuren` nur `mit_medien`; `pol_typ_verteilung.A`
  und `abschluss.loesung.eigene_knoten` ebenso. `check-v42` (regel1, regel4, Glossar) akzeptiert das ohne Befund.
- **Export:** `export-v42` schreibt für Heft A genau **ein** Heft (`heft-a-mit-medien`) und
  **ein** Dokument «Lösungen» (`loesungen-a-mit-medien`), keine leere oder halbe Fassung
  `ohne-medien`. Insgesamt drei Hefte, drei Lösungsdokumente, Auftragsbogen, Begleiter — 15 Dateien.
- **Lösungen A:** fünf Seiten, alle «ok» (Reserven 263 / 197 / 139 / 407 / 318 px); S. 3 trägt
  LF3 mit der Zeile «Mit Ersatzquelle», S. 4 LF4 mit dem Hinweis, dass der Einwand mit der Ersatzquelle aus Vertiefung 2 (S. 59, Abs. 2) kommt.
- **Begleiter:** Die Präambel nennt drei Lösungsdokumente. §2 sagt zuerst, dass Heft A nur die Spur mit
  Medien hat, und begründet es mit 2.1.1. In der Spurtabelle steht bei Heft A ohne Medien
  «entfällt» (LF3 und Pol-Typ). Der Callout «Zwei Spuren in einem Zimmer» bleibt, gilt aber nur
  für Heft B. Die Warnung zum Linkausfall nennt für Heft A die Ersatzquelle oder das Verschieben,
  nie die Spur ohne Medien. Dazu kommen der Hinweis auf Abspielgeräte und Kopfhörer für alle und ein Satz
  vor dem Tafelbild A, dass «beide Spuren» hier «diese Spur» heisst.
  Fester H3-Titel des Skeletts «Seitenplan eines Hefts (… beide Spuren)» bleibt wörtlich, weil die Skill ihn fest vorgibt.
- **Nicht geprüft:** wie die Workbench im Browser Heft A anzeigt (laut Begleiter fällt sie auf die
  einzige Spur zurück, `spuren.ts` — nur am Code gelesen, nicht am Bildschirm).

### 5.2 Gemischtes Produktbild von Heft B (Tabelle + Fliesstext) — passt es auf Seite 6?

- **Ja, nach einer Kürzung.** Erste Messung: S. 6 lief in beiden Spuren um 11,3 px über (Tabelle
  5 × 5 mit 281 Zeichen + Fliesstext 2 Absätze / 275 Zeichen + vier Methodenkarten). Behoben durch:
  Fliesstext auf einen Absatz (180 Zeichen), kürzere `fuer`/`tun` der Methoden. Jetzt «ok» (0 px
  Reserve — S. 6 misst auch in Gold immer 0 px, weil die Seite bis unten füllt; ein Test von
  Executor A mit zusätzlichen Zeilen zeigte bei A rund eine Zeile Spielraum).
- **Lösungsbild B** (Tabelle 5 × 5, 396 Zeichen + Fliesstext 3 Absätze, 434 Zeichen) auf S. 4 des
  Dokuments «Lösungen»: von Anfang an «ok», rund 500 px Reserve.
- **Folge für E26:** Für gemischte Blätter gibt es kein Budget im Skript. Gemessener Anhaltspunkt aus dieser Einheit:
  Beispielbild klein, zwei Blöcke, Tabelle 5 × 5 (~280 Zeichen) + Fliesstext ~180 Zeichen passt
  neben vier Methodenkarten; ~275 Zeichen Fliesstext nicht. Empfehlung: in ENTSCHEIDE E26 nachtragen.
- Spaltenköpfe des Bilds gekürzt («Inhalt · Woher · Fakt/Meinung · Merkmal · Was ich tue»); der volle
  Wortlaut steht im Produktauftrag auf S. 5.

## 6. Selbstprüfung nach Phase 3 (phase-2-3 §3.7)

| # | Prüfung | Ergebnis |
|---|---|---|
| 1 | Fall neu | ja — Kantine, Geschäftsführerin/Personalkommission, Bild einer Preisliste, Fallzahl 18/9 Fr.; kein Gegenstand aus A, B, Auftrag. «Chat» und «weiterleiten» teilt der Fall mit B (vom Bauplan so entschieden) |
| 2 | Lebensbereiche paarweise verschieden | Familie und Zuhause · Freundeskreis und Gruppenchat · Wohngemeinde und Quartier · Lehrbetrieb — sechs Paare verschieden |
| 3 | Fall-Ausschluss tragfähig | drei Begriffe ≥ 7 Zeichen, nicht in `konzepte`, keiner Quellenkarte (grep), keinem Stufentext; kein E24-Wort |
| 4 | `modi_kn` = Vereinigung der KN-Typen | ja (geprüft mit node) |
| 5 | Abdeckung Modi | jeder Modus aus `modi_kn` in A, B oder Auftrag (Tabelle 7.1) |
| 6 | Modi der Hefte | A = beide Rezeptionsmodi von 2.1.1, keine Spur ohne Medien; B = Modi von 2.1.2 |
| 7 | Abdeckung SK | `primary` 5·6·1 in allen drei Typen; jedes `sk` ⊆ A ∪ B; A ∩ B = {5}; alle fünf SK des Themas |
| 8 | Spannungen | drei `aktivierte_trade_offs`, zeichengleich; `mehrdeutigkeits_pflicht` = `verbindlich` |
| 9 | Rubrik | 4 Kriterien, 2 SuK + 2 Ges, je 4 Stufen ≤ 120 Zeichen; Namen = `kn_kriterien_verteilung` |
| 10 | Zählwörter | Treffer nur «drei Checks», «zwei bis drei Sätzen», «drei bis vier …» (keine Aussage über Hefte) |
| 11 | Szene | 101 Wörter, endet mit der Leitfrage, Ich-Form, kein «du», kein «ß» |
| 12 | Gold-Probe | kein Satz der Gold-Einheit; zwei zu gold-nahe Stufentexte vor dem Schreiben umformuliert |
| 13 | Schlüsselmenge | beide Dateien = Schlüssel der Skelette (node-Vergleich) |

## 7. Abdeckung und Vergleich mit Gold (kohaerenz.md §3 und §4)

### 7.1 Abdeckungstabelle (§3)

| # | Prüfung | Befund | Lücke |
|---|---|---|---|
| A1 | Modi aus `modi_kn` → A, B oder Auftrag | Rezeption schriftlich und bildlich: B S. 3 · Produktion schriftlich und bildlich: B Produkt · Produktion mündlich: Auftrag A2 (Statement) · Interaktion und Kollaboration mündlich: Auftrag A3 (Diskussion) | keine |
| A2 | geführter Modus → S. 3 oder Produkt | A: Rezeption mündlich → S. 3 (Audio, Ersatz Audio); Rezeption audiovisuell → nur Vertiefung 1 (Video, S. 4) · B: Rezeption schriftlich und bildlich → S. 3 (Grafik bzw. Lehrmittel-Abschnitt); Produktion schriftlich und bildlich → Protokoll mit Reflexion | A: audiovisuell geführt, **freiwillig geübt**, keine verpflichtende Stelle (E27 Punkt 3) |
| A3 | Rezeption «geübt», zweiter Rezeptionsmodus «freiwillig geübt» | beide Hefte üben auf S. 3 einen geführten Modus; zweiter Modus von 2.1.1 (audiovisuell) freiwillig über Vertiefung 1 (Video) | keine |
| A4 | Modus des Auftrags → Produkt | Produktion mündlich → `produkte[0]` (Schritt 3, `spur`); Interaktion mündlich → `produkte[1]` (Schritt 4, `spur`) | keine |
| A5 | Kompetenz-Modi des Lebensbezugs geführt | alle vier geführt (A zwei, B zwei) | audiovisuell s. A2 |
| A6 | SK des Themas → A, B oder KN | 1: B, KN · 5: A, B, KN · 6: A, KN · 7: A · 12: B | keine |
| A7 | SK eines Hefts → Stelle | A: 7 LF3 (Spalte «Absicht»), 6 LF4, 5 Produkt («Wert dahinter», «Mein Standort») · B: 1 LF2/LF3, 5 LF4, 12 Schritt 04 und Produkt | keine |
| A8 | Produkttypen verschieden | A Interessen-Übersicht (Liste) · B Protokoll mit Reflexion (Tabelle + Fliesstext) · Auftrag Statement (`spur`) und Diskussion (`spur`) | keine |
| A9 | Lebensbereiche paarweise verschieden | siehe 6, Z. 2 | keine |
| A10 | KN-Kriterien | A: Fachkorrektheit + Politisches Prinzip · B: Argumentation + Position / Werthaltung · Auftrag: alle vier, zeichengenau (`regel6` grün) | keine |
| A11 | Pol-Typen | mit Medien A `position_gegenposition` ≠ B `modell_eigener_fall`; ohne Medien nur B; kein Medien-Typ ohne Medien | keine |
| A12 | je Heft ≥ 1 Spur; nur Medien → Quelle + Ersatz | A: `mit_medien`, Quelle und Ersatz je Karte + Archivtext; B: beide Spuren | Ersatz A ohne Gegenstimme (Bauplan §9) |
| A13 | Fall-Begriffe | kein Treffer in Heften, Auftrag, Glossar, Karten (`regel9` grün; Sweep: nur `kontext_ausschluss`, KN, Prinzip, Begleiter §6/§7) | keine |
| A14 | Vergleich mit 1.3.1 | Modi des Auftrags, Produkttypen und SK verschieden (7.3) | keine |

### 7.2 Fest (F1–F13): Gold und neue Einheit

| # | Gold 1.3.1 | 2.1.1_informationen_hinterfragen | Beleg |
|---|---|---|---|
| F1 | sechs Dateien | gleich | `check-all` Struktur ok |
| F2 | 8 Seiten, `heft_8page_v42` | gleich | `template`; Messung 8 Seiten je Heft |
| F3 | Kern einmal, Spuren abweichend | gleich; A nur `mit_medien` (Modus trägt keine Spur ohne Medien) | `regel1`, `regel4` grün |
| F4 | LF1 K2 · LF2 K3 · LF3 K4 · LF4 K4 | gleich | `bloom_zielprofil`, `pol_typ` je Spur |
| F5 | fünf Schritte mit `liefert` | gleich | `check-einheiten` 0 Befunde |
| F6 | Kriterien im KN-Wortlaut, 1 SuK + 1 Ges je Heft, Auftrag alle 4 | gleich | `regel6` grün |
| F7 | Begriffsnetz aus Glossar, gleiches Zentrum, Transfer-Ast | gleich: Zentrum «Aussage oder Absicht dahinter» in A und B; je 10 Knoten | `regel7`, `regelGlossar` grün |
| F8 | 2 Quer-Checks, 3 Mitnahme-Zeilen, 4 Checklisten-Zeilen | gleich (B: Zeilen 1 und 2 je zwei Punkte, zulässig 2–3) | Budgets grün |
| F9 | neuer Fall, neuer Lebensbereich, 5 Schritte, 2 Produkte, 4 Seiten | gleich | `budgetAuftrag`, `regel8`, `regel9Kontext`; Messung 4 Seiten |
| F10 | eine Hybrid-Situation, drei Formen mit ihren Modi, 4 Kriterien | gleich; `modi_kn` gleich wie Gold (Gerüst, kein Befund) | Schlüsselmenge `kn.json` |
| F11 | Lösung zu jedem Feld mit Fundstelle | gleich | `regelLoesungen`, `check-lf-loesung` 12 LF ohne Befund |
| F12 | Benennung, IDs, Kurzlink, Quellen-IDs | gleich (Regeln aus `ableitungsregeln.md`; Ordner ohne Suffix, `q-211a/b-…`) | Bauplan §1, `check-all` ID |
| F13 | Sprache, Anrede, neutrale Persona | gleich | Sweep (Abschnitt 8); Persona wörtlich |

Keine Abweichung im Gerüst.

### 7.3 Hergeleitet (H1–H9): Gold und neue Einheit

| # | Gold 1.3.1 | 2.1.1 | Herleitung |
|---|---|---|---|
| H1 Modi A | Rezeption schriftlich und bildlich | Rezeption mündlich · Rezeption audiovisuell | Kompetenz-Ebene 2.1.1 im Datensatz 4J |
| H1 Modi B | dasselbe + Interaktion und Kollaboration mündlich | Rezeption schriftlich und bildlich · Produktion schriftlich und bildlich | Kompetenz-Ebene 2.1.2 |
| H2 Modi Auftrag | Produktion mündlich + Produktion schriftlich und bildlich | Produktion mündlich · Interaktion und Kollaboration mündlich | `modi_kn − (A ∪ B)`, kein Sonderfall |
| H3 SK | A 5·11·1 · B 2·6·11 · KN 5·11·6 | A 7·6·5 · B 1·5·12 · KN 5·6·1 | T2 hat genau SK 1, 5, 6, 7, 12; auf A und B verteilt, gemeinsam 5; KN = 5 + 6 (A) + 1 (B) |
| H4 Produkt A | kommentierte Karte (Liste) | Interessen-Übersicht (Liste mit Legende) | «identifizieren … Interessen und Werte der betroffenen Personen» → Ordnung nach Personen; A führt nur Rezeption |
| H4 Produkt B | Tabelle mit Regeln + Gespräch | Mediennutzungs-Protokoll (Tabelle) + Reflexion (Fliesstext) | `detail` Produktion: «eigene Mediennutzung dokumentieren», Fakt/Meinung; «reflektieren» → Textteil |
| H5 Produkte Auftrag | Blatt (Fläche) + Sprachnachricht (Spur) | Statement (Spur) + Diskussion (Spur) | H2: zwei mündliche Modi → zweimal `spur`; Interaktion → keine Einzelarbeit |
| H6 Quelle, Raster | (Gold: Text/Grafik) | A Audio, Spalten Wer spricht · Kernaussage · Absicht · → Begriff · B Grafik bzw. Lehrmittel-Abschnitt | 2.1.1 nennt Rezeption mündlich zuerst; 2.1.2 `detail` nennt Grafiken |
| H7 Pol-Typ | — | A `position_gegenposition` · B `modell_eigener_fall` (beide Spuren) | Spannung A: zwei Haltungen zur selben Frage; B: Schema der drei Checks gegen den Alltag |
| H8 Aspekte | Wirtschaft (dominant) u. a. | Politik R1 (dominant) · Technologische und digitale Transformation R2; Kriterium 3 «Politisches Prinzip» | Aspekte von 2.1.1 und 2.1.2; Politik in beiden |
| H9 Fall, Lebensbereiche, Karten, Glossar | Konsum | Interessen und Feed-Inhalte; Familie · Freundeskreis · Quartier · Lehrbetrieb; 26 Glossar-Einträge | Bauplan §4–§6, Kapitel 6.6, 7.1, 20.7 |

Modi des Auftrags, Produkttypen und SK sind verschieden von Gold → kein Hinweis auf Kopie. Gleich
sind nur `modi_kn` (Gerüst), Listenbild in A (beide A führen nur Rezeption), die Rezeptionskarten
(die Kartei hat nur zwei) und SK 1, 5, 6 (T2 hat nur fünf SK) — Gründe wie im Bauplan §8.

## 8. Gegenleser (Sonnet) — Befunde und was daraus wurde

| Leser | Befunde | Übernommen → Auftrag an | Nicht übernommen (Grund) |
|---|---|---|---|
| Sweep über alle Dateien | 1 Fehler, 2 «prüfen» | «Sie arbeiten mit» im Begleiter → «Die Lernenden arbeiten mit» (Begleiter) | Du-Form «Tippe in die Felder … deine Eingaben» auf dem Auftragsbogen: Text des Renderers (`src/lib/einheiten/standalone-shell.ts:827`) → 11.2; Daten der Abstimmung stammen aus den Quellenkarten |
| Blindleser A mit Medien | 15 | LF2 an die Situation gebunden, Grundhaltungen des Lehrmittels; Zeitmarke/eine Aussage je Zeile im Hörauftrag; «Heiratsstrafe» und Paare mit einem/zwei Einkommen auf S. 3 erklärt (aus Abs. 1, 6); `tun` der Akteurskarte und der vier Ohren an das Produkt angepasst; Schritte 02–04 und LF4 (Neigung → Einwand → Standort); QR-Wortlaut (A) | Ersatzquelle ohne Gegenstimme, «sagen das Gegenteil» (Bauplan); Text «Passt keiner …» der Karte `hko-quelle-raster` (bestehende Karte) |
| Lösungs-Audit A | 12 (alle Zeitmarken richtig gerechnet) | Satz zur Ersatzquelle in LF4; Mitte-Absicht als Folgerung markiert; «Partei · Grundhaltung» statt «konservativ»; Eigenständigkeit «der Frauen»; 01:26 = Redaktor; «fast alle Länder Europas»; NGO und Lobby genau nach S. 178/179; Kantone als Deutung (A) | Prüfdatum 03.10. (Laufdatum, siehe 9); Begriffsnetz-Verbindungen sind Leistung der Einheit |
| Blindleser B ohne Medien | 15 | «Merkmal» einheitlich definiert; Spalten im Produktauftrag; Fakt/Meinung in LF2 eingeführt; LF2 «prüfen würden»; Clip als einer der fünf Inhalte; «erste Tabelle», Selektion = Auswahl; Begriff aus LF1 **oder LF2** im Raster; erfundener Weltbefund im Kartenbeispiel ersetzt (B) | Abgabeliste, Kürzel SuK/Ges, leere Arbeitsfläche S. 7 (Gerüst/Renderer); «Vertrauen und Prüfen» im Kriterium (KN-Wortlaut) |
| Blindleser B mit Medien | 15 | wie oben, dazu «Mehrfachnennungen nicht zusammenzählen», Auswahlregel zwei häufige / zwei seltene Prüfwege (B) | Videolänge 5:38 = Ausschnitt 00:02–05:40; Kurzlink folgt der Regel |
| Lösungs-Audit B ohne Medien | 12 | Selbstschutz als Fallüberlegung; Fake News und «schwer aufdecken» richtig zugeordnet; «häufig, u. a. wegen Aufmerksamkeit»; Begriffsnetz Bildmanipulation/Google-Check und Gewichtung/Auswahl; Lösungsbild-Merkmale (B) | Prüfdatum (s. o.) |
| Lösungs-Audit B mit Medien | 17 (alle Prozente richtig) | «am häufigsten» statt «zuerst»; Befund nennt die seltenen Wege (10/8/3 %); «glaubten … gesehen zu haben»; Ersatzquelle Suchmaschine → Google-Check; Polbeispiele erfüllen den eigenen Erwartungshorizont; Vertiefung 2 «Promis … Renditen», 04:10–04:31, «echtes Studio»; Vertiefung 1 Abs. 2–7 (B) | — |

Danach Tor neu: grün (Abschnitt 2), Messung ohne Überlauf, Leck-Probe der Lösungen gegen die
Hefte 0 Treffer, sichtbarer Text der Hefte ohne «Spur», «Pflichtquelle», «Woche», «Lektion»;
einziges «Minuten» = Dauer der Diskussion «8–10 Minuten» (Produktdauer, zulässig).

## 9. Unbelegt, nicht geprüft

- **Zeitmarken Heft A** (Quelle, Ersatzquelle) aus dem Swissdox-Transkript **berechnet**,
  nicht gegengehört; die Rechnung ist im Audit bestätigt. Vor dem Druck am Audio prüfen.
- **Sprechende:** Funktion und Partei aus automatischem Transkript; im Heft kein Name.
- **Deutungen, ausdrücklich als solche markiert:** Mitte «eher bewahrend» (beide nennen sich
  liberal), Kantone «weder Partei noch Verband», die zwei betroffenen Gruppen ohne Organisation.
- **Nicht im Lehrmittel** (Bauplan §2): Algorithmus, Filterblase (nur Vertiefung 1 der Medien-Spur;
  ohne Medien als Fallüberlegung), «Desinformation» (nur im Kompetenztext), Erklärung von «Wert»
  und «Interesse» (Glossar `heft`), Fakt gegenüber Meinung, «Eigene Regel», «Zielkonflikt», «Einwand»
  (Begriffe des Hefts).
- **Nicht geprüft:** Audios und Videos selbst; Link von `q-211a-vertiefung-2` (HTTP 403 in Phase Q);
  Seitenbilder der zwei PDF-Grafiken; Sprung der `#page=`-Links auf dem Handy; Ja-Anteil
  (steht nirgends in den Daten); Anzeige von Heft A in der Workbench am Bildschirm; die
  Word-Dateien optisch (nur erzeugt); Seitenzahlen der vier Karten ausserhalb der Crosswalk-Zeile.
- **Datum:** Die Systemuhr des Containers zeigte 2026-10-02 (UTC). `erstellt_am` und
  `quelle_stand` tragen das Laufdatum 2026-10-03; die Karten tragen `sachlage_geprueft` 2026-10-02
  aus Phase Q. Zwei Audits haben das als «Datum in der Zukunft» gemeldet.
- «Heiratsstrafe»-Satz auf S. 3 von Heft A: eigene Kurzfassung aus Abs. 1 und 6 der Quelle, ohne
  Beträge; vor dem Druck gegen das Audio lesen.

## 10. Entscheide, die sonst ein Mensch getroffen hätte (Kurzfassung)

Vollständig in `ENTSCHEIDE.md`. Die wichtigsten:

1. KN-Szene von drei Sätzen auf 101 Wörter ausgebaut (Zitate der zwei Stimmen, Fallzahl 18/9 Fr.,
   Unterschriftenliste); Leitfrage wörtlich aus dem Bauplan.
2. LF2 von Heft A an die Situation gebunden («die eine will beim Bisherigen bleiben, die andere den
   Wechsel»), weil der Kern keine Spur voraussetzen darf.
3. LF3 ohne Medien von Heft B selbst formuliert (der Bauplan gibt nur die Medien-Fassung).
4. Raster beider Hefte: Begriff aus LF1 **oder LF2** (nach Blindlesern; sonst trägt der Abschnitt das Raster nicht).
5. Checkliste B, Zeilen 1 und 2 je zwei statt drei Punkte (Platz auf S. 8); Inhalt der Regel phase-6 §3 vollständig.
6. Glossar «Interesse» `heft`, «Vergleich mehrerer Medien» `quelle`; `heft_bezug` B «S. 4 und S. 7» statt «S. 7 und S. 8».
7. `quelle_stand` einheitlich Laufdatum.
8. Kürzungen nach Messung (Auftrag 814 → 562 Zeichen; Beispielbild A drei statt vier Beteiligte; Fliesstext B ein Absatz).

## 11. Fehler in Skill, Skripten und Renderer (nicht repariert)

1. **`bestand-v42 --pruefen` ist im Container rot** ohne jede Änderung (CSS-Fingerabdruck; Gegenprobe
   in Abschnitt 2). Vermutlich CRLF/LF. Die Fingerabdrücke sollten zeilenendenunabhängig gehasht werden.
2. **Renderer, Auftragsbogen:** Bedienzeile «Tippe in die Felder — «Speichern» sichert deine
   Eingaben in der Datei.» (`src/lib/einheiten/standalone-shell.ts:827`) ist Du-Form auf einem
   Bogen in Sie-Form.
3. **`messen-v42` im Container:** Chromium startet als root nur mit `--no-sandbox`; das Skript
   übergibt das nicht und meldet sonst «DOM ohne Messung» (Exit 2). Umgangen ohne Skriptänderung
   über `CHROME_PATH` auf einen Wrapper im Scratchpad, der `--no-sandbox` anhängt. Die Messung ist damit echt.
4. **Seite 6 misst immer «Reserve 0 px»** (auch Gold): Ein knapper Überlauf und eine knapp
   passende Seite sind dort nicht zu unterscheiden, solange nichts übersteht.
5. **`check-einheiten` ohne `set.json`:** zählt Befunde als «eingefroren» nicht — bis Phase 7 sind
   Kopplung und Autarkie stumm, auch in `check-all` («ok» ist dann eine Scheinentwarnung).
6. **`zaehleAuftraege` (`check-einheiten`)** zählt nach «und» nur grossgeschriebene Verben;
   «… und zeigen Sie …» entgeht `WARN_LF_MEHRFACHAUFTRAG`.
7. **Budget Lösung LF3 (900 Zeichen)** lässt mit Pflichtzeile «Mit Ersatzquelle», «Lesehilfe» und
   vier Rasterzeilen kaum Platz für die Hinweiszeile, die phase-5-spuren.md anbietet (beide Hefte 886–898).
8. **E26:** Für gemischte Produktbilder (Tabelle + Fliesstext) fehlt ein Budget; Messwerte in 5.2.
9. **`check-lf-loesung.mjs`** ohne Argument gibt nur die Hilfe aus (braucht `<slug>` oder `--all`);
   Phase-Texte nennen den Aufruf ohne Argument.
10. **Datenvertrag:** `quelle_stand` «heute» und `erstellt_am` (Laufdatum) können auseinanderlaufen, wenn
    die Uhr in UTC läuft (9).
11. **Karte `hko-quelle-raster`:** «Passt keiner, ist die Aussage für diese Frage nicht wichtig» steht
    neben der Checkliste «je Zeile ein Begriff»; Lernende lesen das als Widerspruch (Blindleser A).

## 12. Für die Abnahme

1. **Heft A vor dem Druck gegenhören:** Zeitmarken, Funktionen der Sprechenden und der neue
   Erklärsatz zu «Heiratsstrafe» auf S. 3 stammen aus dem Transkript. Dazu die Ersatzquelle von A:
   Sie hat keine Gegenstimme, LF4 hängt dann an Vertiefung 2 — deren Link war in Phase Q gesperrt.
2. **Gemischtes Produktbild B passt erst nach Kürzung** (S. 6: 0 px, wie Gold immer). Bitte die
   Messwerte aus 5.2 als erstes Budget für Tabelle + Fliesstext in E26 aufnehmen.
3. **Bestand und Messung im Container:** `bestand-v42` ist ohne Zutun dieses Laufs rot (CSS, vermutlich
   Zeilenenden), und `messen-v42` braucht `--no-sandbox`. Lokal beides nachprüfen; die Du-Form-Zeile
   im Renderer des Auftragsbogens korrigieren.
