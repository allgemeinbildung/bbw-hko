# Bericht — Produktionslauf 2026-10-03 · Zeile 231

| | |
|---|---|
| Branch | `lauf/2026-10-03-231` |
| Auftrag | genau eine Einheit: `2.3.1_anliegen_vertreten` (Bauplan `docs/cloud-run/bauplaene/2.3.1_anliegen_vertreten.md`, freigegeben am 2026-10-02) |
| Skill | `.claude/skills/bbw-hko-heft-v42/`, Auto-Modus, Phasen 2–9 |
| Ergebnis | **grün** — eine Einheit, `status: "entwurf"` |
| Preflight | GRUEN (Lehrmittel 76 Kapitel, Quellenarchiv 23 Volltexte, Bauplan vorhanden, Ordner frei) |
| Rollen | Orchestrator: Phasen 2 und 3 (`prinzip.json`, `kn.json`), Integration, alle Gates · Opus-Executors: Heft A, Heft B, Set, Begleiter · Sonnet-Gegenleser: 4 Blindleser, 4 Lösungs-Audits, 1 Sweep |
| Entscheide | `ENTSCHEIDE.md` in diesem Ordner |

Kein Lehrmittel-, Transkript- oder Artikeltext in diesem Bericht; nur Kapitel, Seite,
Zeitmarke und eigene Formulierungen.

---

## 1. Einheit

| | |
|---|---|
| Ordner | `src/data/einheiten/2.3.1_anliegen_vertreten/` — `prinzip.json`, `kn.json`, `herausforderung_A.json`, `herausforderung_B.json`, `set.json`, `begleiter.md` |
| Titel | «Anliegen vertreten» · Modul 2.3 · Thema T2 «Meinungen bilden und mitgestalten» · 1. Lehrjahr |
| Lehrgang | kanonisch `EFZ_3J`; `lehrgaenge: ["EFZ_3J","EFZ_4J"]` (Bauplan §1; `sync-einheiten-nrlp` bestätigt zulässig) |
| Heft A | 2.3.1 — «Mein Anliegen – auf welchem Weg bringe ich es ein?» · Factsheet · Spuren `ohne_medien` + `mit_medien` |
| Heft B | 2.3.2 — «Meine Meinung in der Runde vertreten» · Gruppendiskussion mit Diskussionskarte und Ergebnisnotiz · Spuren `ohne_medien` + `mit_medien` |
| Auftrag | «Mehr Kurstage – was sage ich an der Sitzung?» · Lehrbetrieb und Berufsverband · Auswertung des Schreibens (Fläche) + Statement 2 Minuten (Spur) |
| KN | «Der Kanton kürzt – was schlägt unser Verein vor?» · Verein und Freizeit · 113 Wörter · Fachgespräch / Mini Case / Werkschau |
| Neue Karten | keine (Quellenkarten lagen vor; keine neue Methodenkarte) |

## 2. Tor (letzte Ausgaben, nach Reparaturrunde 1)

```
$ npm run build:einheiten-index
einheiten.index.json: 13 sets written (src + public/nrlp)

$ node .claude/skills/bbw-hko-heft-v42/scripts/begleiter-marker.mjs 2.3.1_anliegen_vertreten --check
262 Marker · 0 abweichend · 0 unaufloesbar · nichts geschrieben

$ node scripts/check-all.mjs 2.3.1_anliegen_vertreten --cloud
check-all — 1 Einheit(en) · status muss "entwurf" sein · --cloud
  ok      Lehrmittel  76 Kapitel und 91 Quellentexte fuer die Leck-Pruefung geladen
  ok      nRLP-Datensaetze
2.3.1_anliegen_vertreten
  ok      Struktur · Status · Methoden · Sprache · Leck  0 Fehler, 0 Warnungen
  ok      nRLP-Abgleich (Kompetenz-/Lebensbezugstexte, Lehrgaenge)
  ok      Kopplung · Autarkie · Begleiter-Marker
  ok      Leitfragen-Loesungen
  ok      Heft v4.x (Budgets, Spuren, Quellen)
GRUEN — keine Fehler.

$ node scripts/check-v42.mjs 2.3.1_anliegen_vertreten
2.3.1_anliegen_vertreten: 0 Befunde (0 / 0 / 0 in a / b / c).
$ node scripts/check-einheiten.mjs 2.3.1_anliegen_vertreten
1 Einheiten geprueft — 0 offene Befunde (0 Fehler), 172 in der Baseline.
$ node scripts/check-lf-loesung.mjs 2.3.1_anliegen_vertreten
Check 32: 16 Leitfragen geprüft, keine Befunde.

$ node scripts/export-v42.mjs 2.3.1_anliegen_vertreten --out <tmp>
19 Dateien: heft-{a,b}-{ohne,mit}-medien.{html,docx}, loesungen-{a,b}-{ohne,mit}-medien.{html,docx},
auftragsbogen.{html,docx}, begleiter.docx

$ CHROME_PATH=<wrapper> node scripts/messen-v42.mjs <tmp>        → Exit 0, kein ÜBERLAUF
auftragsbogen 4 Seiten (Reserve S.1 20.1 px · S.4 25.5 px)
heft-a-* 8 Seiten (S.8 42 px) · heft-b-* 8 Seiten (S.8 18.5 px) · loesungen-* je 5 Seiten (≥ 27 px)
S.1, S.6, S.7 der Hefte und A2/A3 des Bogens zeigen 0 px — Flächen, die den Rest füllen;
die Gold-Einheit misst dort im selben Container ebenso 0 px.

$ node scripts/bestand-v42.mjs --pruefen
ABWEICHUNG in 2 von 26 Dokumenten:
  1.3.1_konsum_verantworten · css: f0123cc13cac → bb1735327fb8
  1.1.1_konflikt_kommunizieren · css: f0123cc13cac → bb1735327fb8

$ npm run build            → Exit 0 (prebuild sync:einheiten-nrlp änderte keine Datei)
$ git status --short       → nur der Ordner der Einheit, die zwei Index-Dateien, dieser Berichtsordner
```

**Bestand-Abweichung: nicht von diesem Lauf.** Dieselbe Ausgabe entsteht in einem frischen
Worktree des unveränderten Ausgangs-Commits `cf7aaa4` (geprüft). Der Lauf hat weder CSS noch
Renderer noch eine andere Einheit angefasst. Vermutlich ist die Bestandsbasis veraltet oder der
Hash hängt von der Umgebung ab (Zeilenenden Windows/Linux) — lokal prüfen.

**Messung im Container.** Chromium startet als root nur mit `--no-sandbox`; `messen-v42.mjs`
gibt das nicht mit und findet ohne `CHROME_PATH` nur Windows-Pfade. Gemessen wurde mit
`CHROME_PATH` auf einen Wrapper im Scratchpad (nicht im Repo). Gegenprobe: Gold misst damit
ohne Überlauf. Die Messung ist also gültig; die lokale Abnahme kann sie wiederholen.

**Reparaturrunden.** Runde 0 (vor dem ersten grünen Tor, laufende Prüfung): Überläufe aus der
ersten Messung (Bogen A1 85,6 px; Heft A S. 8 19 px; Heft B S. 6/S. 8; Lösungen B S. 3) —
behoben durch Kürzen der Situation des Auftrags, der Checkliste, der Wechselrede und der
Glossar-Definitionen (alle ≤ 68 Zeichen, weil das dreispaltige Glossar sonst dreizeilig
umbricht). Runde 1: Befunde der Gegenleser (Abschnitt 7). Danach Tor grün. Runden 2 und 3
nicht gebraucht.

## 3. Kapitel und Seiten

| Kapitel (Datei unter `material/_lehrmittel/`) | Seiten | Wofür |
|---|---|---|
| 3.2 Mitwirkungsrechte und Pflichten | 93–95 | A: LF1/LF2 (Stufen der Rechte S. 93–94, politische Rechte S. 94, Stimm- und Wahlrecht, Voraussetzungen S. 95) · B: S. 95 Sachgrundlage |
| 6.4 Referendum und Initiative | 168–170 | A: LF1/LF2, LF4 ohne Medien (Petitionsrecht S. 170) |
| 6.6 Interessengruppen | 177–179 | A: LF3 ohne Medien (Funktion der Verbände S. 179; S. 177–178 Verbände) |
| 6.5 Entstehung eines Gesetzes | 171 | Reserve (Prinzip); keine Lösung zitiert es |
| 17.3 Argumentieren | 393–395 | B: LF1/LF2 (3B-Schema S. 394) |
| 16.1 Diskussion | 366–367 | B: LF1 (Ziel S. 366), LF3 ohne Medien (Regeln, Killerphrasen, Wendungen S. 367) |
| 16.2 Statement · 16.3 Präsentation · 17.3 | 368 · 369–371 | nur Methodenkarten (`lm-16-2-statement`, `lm-16-3-gestaltung`, `lm-17-3-3b-schema`) |

## 4. Quellen (Medien-Spur; Karten lagen vor, keine Recherche)

| ID | Typ | Titel · Herausgeber · Datum | Ausschnitt | Länge | Prüfdatum | Zugeständnis |
|---|---|---|---|---|---|---|
| `q-231a-pflicht` | audio | «Luzerner Jugendparlament erhält kein Vorstossrecht» · Regionaljournal Zentralschweiz · 2023-06-26 | 00:13–03:25 | 192 s | 2026-10-02 | Mundart, maschinelles Transkript; Ende geschätzt; Stand Juni 2023 (was danach in Luzern geschah, nicht geprüft); keine Ersatzquelle |
| `q-231a-vertiefung-1` | webseite | «Eine Petition lancieren» · ch.ch · o. D. | Abs. 1–11 | 244 Wörter | 2026-10-02 | ohne Datum |
| `q-231a-vertiefung-2` | video | «Eidgenössische Jugendsession – brav, aber engagiert» · SRF Tagesschau · 2021-11-07 | 00:00–03:08 | 188 s | 2026-10-02 | Beitrag 2021 |
| `q-231b-pflicht` | audio | «Stimmrechtsalter 16?» · SRF Regionaljournal Graubünden · 2026-09-02 | 07:42–11:18 | 216 s | 2026-10-02 | Mundart, maschinelles Transkript; Ausschnitt aus 24-Min.-Sendung; keine Ersatzquelle; Ausgang (Nein, 27.09.2026) nur laut SRF-Begleittext |
| `q-231b-vertiefung-1` | artikel | «Stimmrechtsalter 16 auf Bundesebene nach langem Streit vom Tisch» · parlament.ch / SDA · 2024-02-28 | Abs. 5–10 | 207 Wörter | 2026-10-02 | Ausschnitt |
| `q-231b-vertiefung-2` | video | «Mit 16 reif genug für Politik?» · SRF Arena · 2020-05-29 | 03:14–09:05 | 351 s | 2026-10-02 | Sendung 2020 |

Lösungen, Zeitmarken und Beispielwerte der Medien-Spur stammen nur aus den Archivtexten
`material/_quellen-archiv/<id>/gewaehlt/`. Namen von Sprechenden stehen nirgends, nur Rollen.

**Vor dem Druck (Abnahme):** beide Audios gegenhören — Zeitmarken auf die Sekunde, Sprecherrollen
(nur aus dem Inhalt erschlossen), Ende des A-Ausschnitts; Ausgang Graubünden an einer amtlichen
Quelle prüfen. **Beleg des Ausgangs:** Er steht in der Sachlage des gewählten Archivtexts
`q-231b-pflicht` und im `lizenz_hinweis` der Karte; die Quelle dafür ist das Transkript im Ordner
`q-231b-pflicht-ersatz/gewaehlt/`, dessen Karte gelöscht ist (Bauplan §7). Das Archiv enthält
diesen Ordner noch; die Leck-Prüfung liest ihn mit.

## 5. Abdeckung (kohaerenz.md §3)

| # | Prüfung | Befund | Lücke |
|---|---|---|---|
| A1 | jeder Modus aus `modi_kn` → A, B oder Auftrag | Rezeption schriftlich und bildlich → Auftrag A2 (Auswertung des Schreibens) · Produktion mündlich → Auftrag A3 (Statement) · Interaktion und Kollaboration mündlich → Heft B (Gruppendiskussion, Schritt 05) · Produktion schriftlich und bildlich → Heft A (Factsheet, S. 7) | keine |
| A2 | geführter Modus eines Hefts → S. 3 oder Produkt | A: SM5 → Produkt S. 7 · B: SM7 → Produkt (Schritt 05, Ergebnisnotiz S. 7) | keine |
| A3 | Rezeption auf S. 3, nicht geführt → «geübt» | geübt, nicht geführt (E27): ohne Medien Rezeption schriftlich und bildlich (Kap. 6.6 bzw. 16.1) · mit Medien Rezeption mündlich (Audio) · freiwillig über Vertiefungen: Webseite/Artikel und Video. Kein Rezeptionsmodus in `nrlp.sprachmodi` oder `modi_pro_heft` | keine |
| A4 | jeder Modus des Auftrags → ein Produkt | `produkte[0]` Rezeption schriftlich und bildlich (`flaeche`, Schritt 1) · `produkte[1]` Produktion mündlich (`spur`, Schritt 5) | keine |
| A5 | jeder Kompetenz-Modus des Lebensbezugs → geführt | 2.3.1 SM5 → Heft A · 2.3.2 SM7 → Heft B | Detail von 2.3.1 verlangt ein **digitales** Produkt; das Heft ist Papier, die digitale Fassung ist `scaffold_100` («Plus») |
| A6 | jede SK des Themas → A, B oder KN | 1 → A · 5 → B · 6 → A, B, KN · 7 → B, KN · 12 → A, KN | keine |
| A7 | jede SK eines Hefts → Stelle | A: 1 → LF3 · 12 → LF4 + Schritt 04 · 6 → Produkt + Schritt 05 · B: 7 → LF3 + Schritt 03 · 5 → LF4 · 6 → Schritt 05 + Produkt (`sk_anker`) | keine |
| A8 | Produkttyp A ≠ B; Auftrag ≠ A, B | Factsheet (Liste) · Gruppendiskussion (Wechselrede + Liste) · Auswertungstabelle + Statement | keine |
| A9 | Lebensbereiche paarweise verschieden | Wohngemeinde · Berufsfachschule · Lehrbetrieb und Berufsverband · Verein und Freizeit | keine |
| A10 | KN-Kriterien | A: Fachkorrektheit + Politisches Prinzip · B: Argumentation + Position / Werthaltung · Auftrag: alle vier (zeichengleich, `regel6`) | keine |
| A11 | Pol-Typ A ≠ B je Spur | ohne: `recht_praxis` ≠ `position_gegenposition` · mit: `lehrmittel_quelle` ≠ `position_gegenposition` | keine |
| A12 | je Heft mindestens eine Spur | beide Hefte beide Spuren; Medien-Spur mit Quelle + zwei Vertiefungen | keine Ersatzquelle in A und B (Bauplan §9, zulässig) |
| A13 | Fall-Begriffe | «Sommerlager», «Lagerbeitrag», «Leiterrunde»: kein Treffer in Heften, Auftrag, Glossar, Karten (`fallAusschluss` grün; Sweep bestätigt); nur in `kontext_ausschluss` und im LP-Feld `prinzip_handoff.kn_aktivierung` von Heft A (vom Skript ausgenommen) | keine |
| A14 | Vergleich mit Gold | siehe §6 | keine |

## 6. Vergleich mit der Gold-Einheit (kohaerenz.md §4)

**Fest (F1–F13) — gleich:**

| # | Gold | 2.3.1_anliegen_vertreten | Beleg |
|---|---|---|---|
| F1 | sechs Dateien | sechs Dateien | check-all Struktur ok |
| F2 | `heft_8page_v42`, 8 Seiten | gleich | `template`; Messung 8 Seiten je Heft |
| F3 | Kern einmal, Spuren | gleich; beide Spuren je Heft | `regel1`, `regel4` grün |
| F4 | LF1 K2 · LF2 K3 · LF3 K4 · LF4 K4 | gleich | `bloom_zielprofil`; check-v42 |
| F5 | fünf Schritte mit `liefert` | gleich | check-einheiten 0 |
| F6 | Kriterien im KN-Wortlaut, Hefte 1+1, Auftrag 4 | gleich | `regel6` grün |
| F7 | Begriffsnetz, gleiches Zentrum, Transfer-Ast | Zentrum «Durchsetzen oder andere gewinnen» in A und B; je 10 Knoten | `regel7`, `regelGlossar` grün |
| F8 | 2 Quer-Check, 3 «Das nehme ich mit», 4 Checklisten-Zeilen | gleich | Budgets grün |
| F9 | Auftrag: neuer Fall, 5 Schritte, 2 Produkte, 4 Seiten | gleich | `budgetAuftrag`, `regel8`, `regel9Kontext`; Messung 4 Seiten |
| F10 | KN: Hybrid, drei Formen mit ihren Modi, 4 Kriterien; `modi_kn` = 4 Modi | gleich (`modi_kn` gleich Gold — Gerüstwert, kein Befund) | Schlüsselmenge = Skelett; Vereinigung geprüft |
| F11 | Lösung zu jedem Feld | gleich | `regelLoesungen`, check-lf-loesung 16/16 |
| F12 | Benennung nach Regel | `2.3.1_anliegen_vertreten`, IDs `…_hf_A/B/_set/_kn/_prinzip`, Quellen `q-231a/b-…` | E21-Prüfung bestanden |
| F13 | Sprache, Anrede, Persona | gleich | Sweep: kein ß, keine Transliteration; Ich/Sie/Du korrekt |

**Hergeleitet (H1–H9) — nebeneinander:**

| # | Gold | Diese Einheit | Herleitung |
|---|---|---|---|
| H1 | A: Rezeption schriftlich und bildlich · B: dasselbe + Interaktion und Kollaboration mündlich | A: Produktion schriftlich und bildlich (SM5) · B: Interaktion und Kollaboration mündlich (SM7) | Kompetenz-Ebene im nRLP: 2.3.1 bzw. 2.3.2 nennen je genau diesen Modus; keiner nennt Rezeption |
| H2 | Produktion mündlich + Produktion schriftlich und bildlich | Rezeption schriftlich und bildlich + Produktion mündlich | `modi_kn` − (SM5 ∪ SM7); kein Sonderfall |
| H3 | A 5·11·1 · B 2·6·11 · KN 5·11·6 | A 1·12·6 · B 7·5·6 · KN 6·12·7 | die fünf SK von T2 auf A und B verteilt, 6 gemeinsam; KN = 6 + 12 (Weg wählen) + 7 (Skeptische mitnehmen) |
| H4 | A kommentierte Karte (Liste) · B Tabelle mit Regeln + Gespräch (Tabelle) | A Factsheet (Liste) · B Gruppendiskussion mit Diskussionskarte und Ergebnisnotiz (Wechselrede + Liste) | 2.3.1: «formulieren, aufzeigen» + Detail Factsheet · 2.3.2: «vertreten in Diskussionen» + Detail Gruppendiskussion |
| H5 | Blatt (Fläche) + Sprachnachricht (Spur) | Auswertung des Schreibens (Fläche, Schritt 1) + Statement 2 Min. (Spur, Schritt 5) | Rezeptionsmodus → sichtbare Auswertung eines Dokuments in der Situation; Produktion mündlich → Statement (Kap. 16.2) |
| H6 | Artikel und Grafik | Audio in A und B; Spalten ohne Medien «Absatz · Kernaussage · Beleg / Beispiel · → Begriff», mit Medien «Wer spricht · Kernaussage · Absicht · → Begriff» | keine Kompetenz nennt Rezeption → Modus des Themas (Rezeption mündlich) → Audio |
| H7 | — | A `recht_praxis` / `lehrmittel_quelle` · B `position_gegenposition` / `position_gegenposition` | A: Norm (Antwortpflicht, Rechte) vs. Praxis bzw. Quelle · B: zwei begründbare Haltungen |
| H8 | — | Politik R1 (dominant), Ethik R2; Kriterium «Politisches Prinzip» | nRLP; kein gemeinsamer Aspekt → erster Aspekt von Heft A (Bauplan §3) |
| H9 | — | Freibad (Gemeinde), Podium zum Stimmrechtsalter (Schule), Kurstage (Berufsverband), Kürzung der Lagerbeiträge (Kanton/Verein) | Bauplan §4–§6 |

Modi des Auftrags, Produkttypen und SK sind **nicht** alle gleich wie Gold; gleich ist nur
«Produktion mündlich» im Auftrag (Ergebnis der Formel). Keine Herleitung aus Gold oder Skelett.

## 7. Gegenleser (Sonnet) und was daraus wurde

Neun Gegenleser nach dem ersten grünen Tor. Alle Befunde vom Orchestrator beurteilt; was
zutraf, ging als genauer Auftrag an den Executor der Datei (Runde 1), danach Tor neu.

| Gegenleser | Wichtigste Befunde | Ergebnis |
|---|---|---|
| Lösungs-Audit A ohne Medien | Fundstelle Referendum/Initiative (S. 94 statt nur 95); Unterschriftenpetition und «alle Badegäste» unbelegt; «verbindliche Wege» im Befund nicht belegt; Lösungsbild ohne belegtes Mittel aus LF3, vier statt höchstens drei Wege; leere Knoten nicht aus dem Raster | behoben |
| Lösungs-Audit A mit Medien | Lösungsbild-Hinweis passte nicht zum gewählten Weg; Rasterzeilen fehlten im Factsheet; 01:29 spricht der Reporter; «Petition allen offen» kommt aus dem Lehrmittel, nicht der Quelle; «Regierung prüft» → «Rat beauftragt»; «Teilnehmerin» → «teilnehmende Person»; LF4-Antworten erfüllten eigene Kriterien nicht | behoben |
| Lösungs-Audit B ohne Medien | Glarus-Ausnahme ungenau (S. 95: nur aktives Wahlrecht, ein Kanton); Fallüberlegungen nicht gekennzeichnet; «Kompromiss» ohne Zustimmung; Rasterzeile mit zwei Begriffen; Präteritum | behoben (Lösungsbild: Banknachbar stimmt jetzt zu; Gründe überall als Fallüberlegung) |
| Lösungs-Audit B mit Medien | Quer-Check-Fundstelle LF1 statt LF3; LF4-Antworten ohne 3B; Glarus-Dauer und Beteiligung (10:40) als Tatsache | behoben |
| Blindleser A ohne / mit Medien | vier Teile des Factsheets nicht benannt; 3B-Begründung ohne Schritt; Rasterbegriff «aus LF1» trägt Vorstoss/Lobby nicht; «Pol» unerklärt; Quer-Check «in sechs Wochen» aus Material nicht beantwortbar; Gestaltungskarte (Stichworte) gegen Sätze im Factsheet | behoben (Rasterauftrag lässt jetzt Glossarbegriff zu; Quer-Check fragt nach Verbindlichkeit) |
| Blindleser B ohne / mit Medien | Ablauf der Diskussion, Rollen, Rückmeldung fehlten; «zu dritt oder zu viert» gegen «zu viert»; Schritt 03 und 04 überlappten; zweites Argument ohne Herkunft; Rasterbeispiel mit Medienbegriffen und Verweis ins Leere | behoben |
| Sweep | kein ß, kein Platzhalter, keine Namen, keine Transliteration; «Woche» nur als Fallfrist, «Minuten» nur als Produktdauer (beides erlaubt, sprache.md §2) | kein Datenbefund; zwei Renderer-Befunde (§9) |

**Nicht übernommen, mit Grund:**
- Blindleser bemängelten die Sie-Form und Ich-Form-Situation — das ist die Vorgabe (sprache.md).
- Zeitmarken und Mundart können im Container nicht gegengehört werden → Abnahme (§4).
- Executor A hatte auf meine Anweisung die Checklistenzeile «Jede Zeile hat einen Begriff aus
  LF1» geändert; sie ist laut Datenvertrag §2.6 KONSTANT → zurückgesetzt. Folge: Rasterauftrag
  (LF1 oder Glossar) und Checkliste (nur LF1) widersprechen sich leicht; der Begleiter erklärt
  es (§3/§4 Stolpersteine). Befund an die Skill (§9).
- Inhalte bestehender Methodenkarten (siehe §9) wurden nicht geändert.

## 8. Unbelegt und nicht geprüft

- **Mitwirkung auf Gemeindeebene:** Das Lehrmittel behandelt Referendum, Initiative und ihre
  Zahlen nur auf Bundesebene; ob gegen einen Gemeinderatsentscheid Referendum oder Initiative
  möglich sind, ist nicht belegt. Heft A sagt dazu nichts und führt diese Wege nur als
  «verschlossen» (Alter, Bürgerrecht).
- **Fallüberlegungen** (gekennzeichnet): Unterschriften für eine Petition sammeln; ein
  Ratsmitglied ansprechen; Stimmberechtigte (Eltern) tragen das Anliegen mit; alle Gründe für
  und gegen Stimmrechtsalter 16 in der Spur ohne Medien.
- **Aussagen von Sprechenden, nicht geprüft:** Studie (09:46), Abgaben (07:53), Glarus-Dauer
  und tiefe Beteiligung (10:40), Glossar «Volljährigkeit» (08:44, Aussage der Quelle).
- **«Vorstoss»:** Wort der Quelle; ob die Kapitel der Zeile es führen, nicht geprüft.
- **«Ethische Prinzipien»** (Aspekt-Detail 2.3.2): nicht in den Kapiteln der Zeile; belegt ist nur
  Perspektivenübernahme (Kap. 16.1, S. 366).
- **Mitwirkungswege eigens für Jugendliche** (Jugendparlament, Jugendsession) kommen nur über die
  Medien-Spur.
- **Luzern nach Juni 2023**, **Graubünden-Ausgang amtlich**: nicht geprüft (Abnahme).
- **Karte `lm-16-3-gestaltung`**: Inhalt nicht gegen Kap. 16.3 gegengelesen; Seitenangabe siehe §9.
- **Berufsverband legt überbetriebliche Kurse fest**: Annahme des erfundenen Auftrags-Falls.

## 9. Fehler in Skill, Skript, Renderer, Daten (nicht repariert)

1. **`messen-v42.mjs`** findet ohne `CHROME_PATH` nur Windows-Pfade und startet Chromium ohne
   `--no-sandbox` — im Linux-Container als root bricht jede Messung ab («DOM ohne Messung»).
   Abhilfe ohne Skriptänderung: Wrapper über `CHROME_PATH`.
2. **`bestand-v42.mjs --pruefen`** meldet auf dem unveränderten Ausgangsstand eine CSS-Abweichung
   in `1.3.1_konsum_verantworten` und `1.1.1_konflikt_kommunizieren` (Basis veraltet oder
   umgebungsabhängiger Hash).
3. **Renderer, sichtbarer Text für Lernende:** Feedback-Tabelle S. 5 «Beschreibung (Wortlaut
   Kompetenznachweis)» (`heft-v42/seiten-5-8.tsx:107`, `docx-heft-v42-5-8.ts:89`) — Lernende kennen
   den KN nicht; Hinweiszeile «Tippe in die Felder — «Speichern» sichert deine Eingaben» im
   Auftragsbogen (`standalone-shell.ts:827`) in Du-Form; Überschrift «Wissensecke II» auf S. 4,
   obwohl dort LF4 steht; Checkliste S. 8 zeigt ✔ und ☐ zugleich. Alle auch in Gold.
4. **Skelett/Datenvertrag:** Die konstante Checklistenzeile «Jede Zeile hat einen Begriff aus
   LF1» und die Rezeptionskarte («Passt keiner, ist die Aussage nicht wichtig») passen schlecht
   zu einem Lehrmittelabschnitt mit Regeln oder zu einer Quelle mit Wörtern, die LF1 nicht führt
   (Vorstoss, Einwand). Vorschlag: «aus LF1 oder dem Glossar».
5. **Methodenkarten (bestehend):** `lm-16-3-gestaltung` nennt S. 369–370, die Folienregeln
   stehen auf S. 371 (am Kapiteltext bestätigt); `lm-16-1-diskussion` spricht von acht Regeln
   und zählt fünf auf; `lm-16-2-statement` bringt einen Merksatz «drei Argumente», Heft B
   verlangt zwei; `hko-quelle-raster` spricht von «sehen, hören oder lesen» und Zeitmarke auch in
   der Spur ohne Medien.
6. **Skill-Prosa:** `phase-5-spuren.md` §13 sperrt «Minuten» pauschal, `sprache.md` §2 erlaubt
   Produktdauer; `phase-4` §13 nennt `ERR_DATEI_FEHLT begleiter.md` nicht unter den erwarteten
   Befunden; kein Skript prüft, dass `liefert` von LF3/LF4 in beiden Spuren gleich ist;
   `check-lf-loesung` zählt UTF-16, `check-v42` Codepoints; die Zwei-Kapitel-Form von
   `knoten_ref` ist nur für LF2 beschrieben.
7. **Bauplan §7**, `q-231b-pflicht` 10:40: verknüpft die tiefe Beteiligung mit Glarus; das
   Transkript trägt die Verknüpfung nicht eindeutig (im Heft getrennt).
8. **Archiv:** `q-231b-pflicht-ersatz/gewaehlt/` liegt noch im Archiv, obwohl die Karte gelöscht
   ist; er ist der einzige Beleg für den Ausgang der Bündner Abstimmung.
9. **QR-Adresse** auf S. 3 enthält laut Blindleser ein unsichtbares Zeichen (vermutlich ein
   Umbruchzeichen des Renderers) — lokal prüfen.

## 10. Wie trägt der Heft-Renderer das mündliche Produkt von Heft B?

Kurz: **schriftlich, über die Vorbereitung und die Spur danach — die Diskussion selbst bildet
das Heft nicht ab.**

- **S. 5 (Auftrag):** `handlungsprodukt.titel` «Meine Diskussionskarte und Ergebnisnotiz», fünf
  Schritte: 01–04 bauen die Diskussionskarte auf Papier (Argument nach 3B, Bezug zur Gegenseite,
  Position, stärkster Einwand, Antwort); Schritt 05 ist die Durchführung — «zu viert, rund zehn
  Minuten: Eröffnung je Person, Argument, Antwort auf Einwand; eine Person fasst zusammen. Dann die
  Notiz.» Die Dauer ist als Produktdauer erlaubt. Abgaben: Karte, Ergebnisnotiz, eine Rückmeldung
  aus der Gruppe in einem Satz — das Gespräch selbst ist keine Abgabe. Die zwei Feedback-Kriterien
  (Argumentation, Position / Werthaltung) tragen beobachtbare Indikatoren.
- **S. 6 (Methoden + Beispielbild):** Karten Diskussion (Regeln, Killerphrasen, Wendungen),
  Statement (für die Eröffnung), 3B-Schema, Rezeptionskarte. Das Beispielbild nutzt die
  **Wechselrede** (E26) — ein Familienrat mit fünf Beiträgen — und einen Listenblock
  «Ergebnisnotiz». Das ist die einzige Stelle, an der das Heft Mündliches zeigt.
- **S. 7 (Arbeitsfläche):** eine freie Fläche ohne vorgegebene Gliederung; was darauf gehört,
  steht nur in Schritt-Hints und Abgaben (Karte oben, Notiz unten).
- **Lösungsbild (nur LP):** Wechselrede mit acht Beiträgen + Ergebnisnotiz.
- **Wo das Gerüst einengt:** (1) S. 7 gliedert Karte und Notiz nicht; (2) bei zwei Blöcken passt
  die Diskussionskarte nicht als eigener Block ins Produktbild — mit drei Blöcken fiele die
  Wechselrede auf 180 Zeichen (PB_E26), zu wenig für Argument, Einwand und Antwort; (3) Verlauf,
  Ton und Sprecherwechsel der Diskussion hinterlassen im Heft nur Notiz und Rückmeldung — die
  Beobachtung leistet die Lehrperson (Begleiter §4: reihum zuhören, eine Beobachtung je Kriterium;
  Variante Fishbowl). Der Renderer ist datengesteuert genug, dass das Produkt **ohne Verbiegen**
  hineinpasst; ein gegliedertes Formular für S. 7 oder ein Beobachtungsbogen wären Erweiterungen
  des Renderers, nicht der Daten.

## 11. Selbstprüfung Phase 3 (§3.7)

1 Fall neu ✓ · 2 Lebensbereiche paarweise verschieden ✓ · 3 Fall-Ausschluss tragfähig (≥ 5
Zeichen, nicht in `konzepte`, Karten, Stufen) ✓ · 4 `modi_kn` = Vereinigung ✓ · 5 Abdeckung Modi ✓
· 6 Modi der Hefte nur Kompetenz-Ebene, kein Rezeptionsmodus bei Spur ohne Medien ✓ · 7 SK ✓
(6 gemeinsam) · 8 Spannungen: drei, wörtlich ✓; `mehrdeutigkeits_pflicht` = `verbindlich` ✓ ·
9 Rubrik 2+2, Stufen ≤ 120 ✓ · 10 Zählwörter: Treffer nur «drei Monaten»/«Drittel» im Fall
(Fallzahlen, ENTSCHEIDE O11), die drei KN-Formen und Reflexionsfragen ✓ · 11 Szene 113 Wörter,
endet mit Leitfrage, Ich-Form ✓ · 12 Gold-Probe ✓ · 13 Schlüsselmengen = Skelett ✓.
