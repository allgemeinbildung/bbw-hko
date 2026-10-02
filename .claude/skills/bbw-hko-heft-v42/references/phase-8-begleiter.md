# Phase 8 — Begleiter (`begleiter.md`)

Ergebnis: `src/data/einheiten/<ordner>/begleiter.md`. Skelett:
`assets/begleiter-template.md`. Voraussetzung: `prinzip.json`, `kn.json`,
beide Hefte und `set.json` sind fertig und `check-v42` ist für sie ruhig — der
Begleiter zitiert sie über Marker und wird darum **zuletzt** geschrieben.

**Fest** (aus der Gold-Datei `1.3.1_konsum_verantworten_v42/begleiter.md`):
Kapitelfolge §0–§7, Überschriften, Marker-Mechanik, Callout-Typen, Du-Form.
**Hergeleitet je Einheit:** jeder Satz Prosa. Das Skelett enthält darum keinen
Satz der Gold-Einheit, nur Überschriften, Marker und Platzhalter `{{…}}`.

## 1. Frontmatter

Der Parser (`parseFrontmatter` in `src/lib/einheiten/begleiter-builder.ts`)
liest nur einzeilige `schluessel: wert`-Paare; Listenzeilen übergeht er. Ein
HTML-Kommentar im Frontmatter bricht ihn — **keine Marker im Frontmatter**.

| Schlüssel | Herkunft | Gedruckt |
|---|---|---|
| `titel` | `Begleit-Dokument — <set.einheit_titel> (<X.Y>)` | Titel, Fusszeile, Seitentitel |
| `untertitel` | eine Zeile: Hefte, Spuren dieser Einheit, Auftrag, KN | unter dem Titel |
| `kompetenz` | `<X.Y> — <kn.kern_kompetenzversprechen>`, zeichengenau; gewollte Kopie | Kopfzeile «KOMPETENZ …» |
| `autor` | fest: `Kernteam 1 — BBW Winterthur` | Metazeile |
| `stand` | Datum des Schreibens, `JJJJ-MM-TT` | Metazeile |
| `version` | `= set.version` | Metazeile |
| `lehrgang` | Anzeigeform `EFZ 3J` / `EFZ 4J` (in den JSON: `EFZ_3J`) | nein |
| `thema` | `T<n> — <Titel des Themas>` aus dem nRLP-Datensatz des Lehrgangs | Metazeile |
| `lebensbezug` | `X.Y` = `nrlp.lebensbezug` der Hefte | nein |
| `quellen_json` | Liste: `set.json`, `prinzip.json`, `herausforderung_A.json`, `herausforderung_B.json`, `kn.json`; mit Medien-Spur zusätzlich eine Zeile mit dem Muster der Karten und ihrer Anzahl | nein |

## 2. Gliederung

Keine H1. Nach dem Frontmatter steht ein Blockzitat als Präambel (4–7 Zeilen).
Danach acht Kapitel in dieser Reihenfolge. Jede H2 erzeugt im Word-Export einen
Seitenumbruch und einen Eintrag im Inhaltsverzeichnis (`buildDocument`) —
darum **keine Marker in H2** und keine zusätzlichen H2.

| Kapitel | Zweck | Hergeleitet | Marker (Pflicht) | Zeilen |
|---|---|---|---|---|
| `## 0. Die Einheit in einem Blick` | Überblick, Bewertung, Abdeckung | Tätigkeiten je Baustein, Begründung der Kriterien-Verteilung, Abdeckungsabsatz | `kn.kern_kompetenzversprechen`, `prinzip.dekontextualisierungs_anker.anker_statement`, `prinzip.mindmap_zentrum_kurz`, Titel von A, B, Auftrag, Kompetenz- und Lebensbezugstext, Abdeckungstabelle (§2.1), `prinzip.kn_kriterien_verteilung.*`, `hf_X.feedback_kriterien[n].*`, drei `…mehrdeutigkeit.trade_off` | 70–90 |
| `## 1. Zeitplan: ein Vorschlag für zwölf Lektionen` | Zeit als Vorschlag | Unterlagen-Spalte, Puffer, Engpässe | `set.wochenplan[n].woche/.lektionen/.inhalt`, `hf_X.wochen_plan[n].text` | 45–60 |
| `## 2. Zwei Spuren: ohne Medien und mit Medien` | Spuren erklären, Wahl, Vorbereitung | alles ausser der Tabelle «gleich / abweichend» | keine | 50–65 |
| `## 3. Herausforderung A — <Label>` | Heft A führen | Hinweise je Seite, Coaching, Stolpersteine, Tafelbild-Prosa | Steckbrief, Situation, Leitfrage, Zahlen, Produkt, Schritte, Abgaben, `mehrdeutigkeit.hint`, Begriffsnetz, `scaffold_100`, vier Checklisten | 140–180 |
| `## 4. Herausforderung B — <Label>` | Heft B führen | wie §3 | wie §3 mit `hf_B` | 140–180 |
| `## 5. Quellen-Stand` | Prüfstand der Quellen | Zugeständnisse je Quelle | `quellen\|quellenstand` | 20–35 |
| `## 6. Gemeinsamer Auftrag «<Titel>»` | Auftrag führen und abgrenzen | Ablauf, Produkt-Abschnitt, Rückmeldung, Abgrenzung | `set.gemeinsamer_auftrag.*` (Skelett) | 90–110 |
| `## 7. Der Kompetenznachweis (KN)` | KN durchführen und bewerten | Methodenwahl, Erwartungshorizonte, Bewertungshinweise | `kn.hybrid_situation.*`, `kn.kn_typen[n].*`, `kn.rubrik_shared.kriterien[n].*` | 90–110 |

H3 in fester Folge (das Skelett führt alle 27):
§0 `Bewertung: Note nur im KN` · §1 `Lektion für Lektion (Vorschlag)`,
`Seitenplan eines Hefts (135 Minuten, beide Spuren)` · §2 `Was gleich ist, was
abweicht`, `Die Spuren in dieser Einheit`, `Spur ohne Medien`, `Spur mit
Medien`, `Welche Spur wann`, `Vorbereitung der Spur mit Medien` · §3 und §4 je
`Produkt: <Marker>`, `Hinweise zu jeder Seite`, `Typische Stolpersteine`,
`Tafelbild — Begriffsnetz Heft A|B`, `Wann ist das Heft fertig? (Selbstcheck —
formativ, nicht benotet)` · §6 `Funktion`, `Die Situation`, `Ablauf über drei
Lektionen (Vorschlag)`, **ein Abschnitt zum Produkt** (Überschrift hergeleitet,
§7.3), `Kriterien und Indikatoren`, `Erwartungshorizont`, `Rückmeldung vor dem
KN`, `Abgrenzung zum KN` · §7 keine H3.

**Zwei Überschriften sind Code-Anker** (`insertionPoint` in
`src/lib/einheiten/begleiter-loesungen.ts`):

- `## <Zahl>. Herausforderung A — …` und `## <Zahl>. Herausforderung B — …`
  müssen auf `^##\s+(?:Sektion\s+)?\d+\s*[.—:–-]?\s*Herausforderung\s+A\b` (bzw.
  `B`) passen. Passt die Zeile nicht, landen die Lösungen dieses Hefts in einem
  angehängten Kapitel `## Lösungen der Leitfragen` am Dokumentende.
- `### Tafelbild …` (`^###\s+Tafelbild\b`) innerhalb des Kapitels: Davor wird
  der Lösungsblock eingefügt. Fehlt die Überschrift, hängt er am Kapitelende.

Fest sind auch die Minuten des Seitenplans (Leitfaden §3, Summe 135); die
Spalten «Lernende tun» und «Spur-abhängig» werden je Einheit formuliert.

### 2.1 Abdeckungstabelle in §0 — Modi, SK, Produkte sichtbar machen

Die Gold-Gliederung hat dafür die Stelle (§0, Blöcke mit fetter Zeile statt
Überschrift) — es entsteht **kein** neues Kapitel. Nach den Kompetenzen steht:

`**Sprachmodi, Schlüsselkompetenzen und Produkte — was wo geübt wird**`

| Zeile | Sprachmodi | SK | Produkt |
|---|---|---|---|
| Heft A / B | `prinzip.modi_pro_heft.A[n]` / `.B[n]` | `prinzip.sk_pro_situation.A[n]` / `.B[n]` | `hf_X.handlungsprodukt.titel` |
| Auftrag | `prinzip.modi_auftrag[n]` | von Hand: SK aus A und B, die er wieder aufnimmt | von Hand: die zwei Produkte mit Modus |
| KN | `prinzip.modi_kn[n]` | `prinzip.sk_schnittmenge_kn.primary[n]` | von Hand: die drei Formen |

SK-Zahlen stehen als `SK<!--hko:…sk…[0]-->5<!--/hko-->` (Zahlwerte löst der
Formatierer als Text auf). Darunter ein Absatz von 2–4 Sätzen: welcher KN-Modus
wo vorbereitet wird, welche Lücke das Prinzip-Dokument ausweist, welche SK des
Themas die Einheit nicht berührt. Dieselben Grössen stehen je Heft nochmals im
Steckbrief von §3/§4 (`hf_X.nrlp.sprachmodi[n]`, `.sk[n]`,
`.gesellschaft[n].aspekt/.iteration`) und für den Auftrag in §6 `Funktion`.

## 3. Marker-Mechanik

`<!--hko:PFAD-->Rückfalltext<!--/hko-->`, mit Formatierer `<!--hko:PFAD|FORMAT-->`.
`withFeldern` (`src/lib/einheiten/begleiter-felder.ts`) ersetzt beim Laden den
Rückfalltext durch den aktuellen Wert; die Marker bleiben stehen.

| Format | Wert im JSON | Ergebnis | Stellung |
|---|---|---|---|
| (keines) | Text oder Zahl | der Wert | in der Zeile |
| `quote` | Text | jede Zeile mit `> ` davor | Marker auf eigenen Zeilen |
| `liste` | Array | je Eintrag `- …` | eigene Zeilen |
| `checkliste` | Array | je Eintrag `☐ …` | eigene Zeilen |
| `persona` | Objekt `persona` | `Beruf — Betrieb, Ort` | in der Zeile; das Skelett nutzt stattdessen die drei Einzelfelder |
| `quellenstand` | nur Pfad `quellen` | ganze Quellentabelle | eigene Zeilen |

Ohne Format löst ein Array oder Objekt **nicht** auf. Mehrzeilige Blöcke
beginnen nach dem Startmarker mit einem Zeilenumbruch (daran erkennt der Loader
sie). Ein Wert mit `|` in einer Tabellenzelle sprengt die Tabelle — dann den
Marker in einen Absatz legen.

**Erlaubte Pfade.** Wurzeln: `hf_A`, `hf_B` (Heft-Dateien), `set`, `kn`, `prinzip`, dazu `quellen`
(nur mit `|quellenstand`). `hf_C` gibt es in v4.2 nicht. Pfadform `a.b[0].c`.
Gelesen wird die **Rohdatei**: `hf_A.spuren.…` ist adressierbar, das Skelett
braucht es nicht. Zeigt ein Pfad ins Leere oder auf den falschen Typ, meldet
`check-einheiten` `ERR_BEGLEITER_MARKER_UNAUFLOESBAR`.

### 3.1 Rückfalltext = Datenwert, zeichengenau

`check-einheiten.mjs` vergleicht jeden Marker mit dem formatierten Wert (nur
Zeilenenden und Rand-Leerraum werden angeglichen): Abweichung →
`WARN_BEGLEITER_DRIFT`. Text aus der Positivliste `KOPIERBAR` (Titel,
Situationstext, Leitfrage, Zentrum, Herausforderungs-Label, Trade-off,
Mindmap-Punkte, Checklisten-Zeilen, Leitfragentexte, KN-Versprechen, KN-Szene,
KN-Fragen, -Aufgaben, -Reflexionsfragen), der ab 45 Zeichen **ausserhalb**
eines Markers wörtlich im Begleiter steht → `WARN_BEGLEITER_KOPIE_OHNE_MARKER`.
**Beide Warnungen sind für eine neue Einheit ein rotes Tor:** `check-einheiten`
endet bei jedem offenen Befund mit Exit 1 — auch bei Warnungen —, und
`check-all` wertet das als Fehler der Zeile «Kopplung · Autarkie ·
Begleiter-Marker».

**Ein Skript, das Marker synchronisiert, gibt es nicht** (weder unter
`scripts/` noch in `package.json`; `sync:einheiten-nrlp` gleicht nRLP-Texte in
den JSON ab, nicht den Begleiter). Darum dieses Vorgehen:

1. Prosa und Gerüst schreiben; Marker stehen mit Platzhalter, wie im Skelett.
2. **Zuletzt** jeden Marker aus der fertigen Datei füllen: Wert lesen, nicht
   aus dem Gedächtnis tippen — auch Anführungszeichen und Striche.
3. Ändert sich danach ein JSON-Feld, den Marker neu füllen; Prüfbefehl in §8.

### 3.2 Variable Längen — Wiederholungsregel

Das Skelett zeigt jede Array-Zeile **einmal** mit Index `[0]` und darunter eine
Zeile `{{WIEDERHOLEN: …}}`. Regel: je Eintrag der fertigen Datei ein Marker,
Index fortlaufend, kein Marker über das Array-Ende hinaus (sonst
`…UNAUFLOESBAR`); die `{{WIEDERHOLEN}}`-Zeile wird gelöscht.

| Stelle | Array | Länge |
|---|---|---|
| Abdeckungstabelle, Steckbrief | `modi_*`, `sk_*`, `nrlp.sprachmodi`, `nrlp.sk`, `nrlp.gesellschaft` | variabel; in der Zelle mit « · » getrennt |
| Steckbrief «Lehrmittel» | `hf_X.quellen_anker[n].seiten` | 1–3; Kapitelangabe davor von Hand |
| Zahlen-Tabelle | `hf_X.zahlen_tabelle[n].label/.wert` | 0–4; bei 0 entfällt die Tabelle |
| Begriffsnetz | `hf_X.mindmap_aeste[0..2].punkte[n]` | bis 5 je Ast; der Transfer-Ast (leer) bekommt keinen Marker |
| Wochenplan · Auftrag | `set.wochenplan[n]` · `sprachmodi[n]`, `erwartungshorizont.gut_wenn[n]` | 4 · variabel |
| Fest | Schritte (5), Feedback-Kriterien (2 je Heft, 4 im Auftrag), Checklisten (4), Fachgespräch (5 Fragen), Mini Case (4), Reflexionsfragen (3), Rubrik (4 × 4), Mapping (2) | im Skelett ausgeschrieben |

**Kompetenztexte:** Die erste Kompetenz eines Hefts steht in
`hf_X.nrlp.kompetenz_text`. Trägt ein Heft zwei Kompetenzen, gilt
`hf_X.nrlp.kompetenzen[1].text` **nur, wenn die fertige Datei das Feld
`nrlp.kompetenzen` führt**; sonst steht der Satz ohne Marker, zeichengenau aus
dem nRLP-Datensatz des Lehrgangs (er steht nicht auf der Positivliste).

## 4. Was nicht von Hand geschrieben wird

`loadEinheit` (`src/lib/einheiten/index.ts`) ruft erst `withFeldern`, dann
`withLeitfragenLoesungen`; HTML-Ansicht, Word und ZIP sehen dasselbe Ergebnis.

### 4.1 Lösungen der Leitfragen

Aus `leitfragen[].loesung` und `spuren.*.leitfragen[].loesung` entsteht je
Heft: `### Lösungen der Leitfragen`, ein Massstab-Satz, `#### Kern — gilt in
beiden Spuren` (LF1, LF2), dann je vorhandener Spur `#### Spur ohne Medien` /
`#### Spur mit Medien` (LF3 mit «Stand: Quelle, geprüft am …», LF4 mit
Erwartungshorizont). Jede Lösung ist ein Callout `loesung`.

Im Markdown steht dafür **nichts** ausser den zwei Code-Ankern aus §2. Nie in
die Datei schreiben: die Überschrift «Lösungen der Leitfragen» (stünde doppelt)
und die Zeichenfolge aus eckiger Klammer, Ausrufezeichen und `loesung` — auch
nicht in einem Hinweistext: Findet der Loader sie irgendwo, spiegelt er **gar
nichts** mehr ein. Ebenfalls nicht im Begleiter ist das Dokument «Lösungen» je
Heft und Spur (E19); es entsteht aus Feldern der Heft-Dateien, der Begleiter
verweist nur darauf (Präambel, Hinweis zu S. 6 unten).

### 4.2 Quellen-Stand

`<!--hko:quellen|quellenstand-->` erzeugt die Tabelle aus den aufgelösten
Karten der Medien-Spur: je Heft «Quelle», darunter «Ersatzquelle», dann
«Vertiefung 1/2». `check-einheiten` prüft diesen Marker nicht; der Rückfall
soll trotzdem lesbar sein und hat die Form des Loaders (`zeileQuelle`): acht
Spalten wie im Skelett; Rolle `A · Quelle (<id>)`, `A · Ersatzquelle (<id>)`,
`A · Vertiefung 1 (<id>)`; Daten `TT.MM.JJJJ` aus `datum` und
`sachlage_geprueft`; Länge `m:ss Min.` oder `n Wörter`; Link `[host](url)`;
fehlendes Feld `—`. Die Gold-Datei schreibt im Rückfall noch «Pflicht» — nicht
übernehmen (E16).

## 5. Callouts

Form: `> [!typ] Titel`, Folgezeilen mit `> `. Der Tokenizer kennt genau die
Typen aus `CALLOUT_LABELS` (`begleiter-builder.ts`); ein unbekannter Typ wird
ein gewöhnliches Blockzitat mit sichtbarem `[!…]`. `coaching` und
`differenzieren` rendern hervorgehoben (Kopfband).

| Typ | Wofür im v4.2-Begleiter |
|---|---|
| `hinweis` | Sachinformation: was die Situation trägt, Puffer, Sozialform, Links pflegen, warum der KN-Fall neu ist |
| `coaching` | ein Zug der Lehrperson: Rückfrage, worauf bestehen, Struktur für ein Gespräch |
| `warnung` | Stolperstein, Zeitfalle, Ausfall eines Links, zwei Noten |
| `troubleshooting` | wenn jemand blockiert — eine spiegelnde Frage |
| `mehrdeutigkeit` | Spannungsfeld halten: Grundsatz (§0), je Heft mit `mehrdeutigkeit.hint`, Bewertungsfehler (§7) |
| `erwartungshorizont` | je Vertiefungskarte, zum Auftrag, zu KN-Fragen |
| `tafelbild` | Erwartungsbild des Begriffsnetzes |
| `differenzieren` | 80 % / 100 % je Heft |
| `lernziel`, `beispiel`, `reflexion` | vom Parser unterstützt, im v4.2-Begleiter nicht verwendet |
| `ki_einsatz` · `loesung` | **nicht schreiben**: kein KI-Teil (§6) · nur vom Loader erzeugt (§4.1) |

**Mindestens je Heft-Kapitel** (so die Gold-Datei; kein Skript prüft
Callouts): `hinweis` 1 · `coaching` 1 · `warnung` 3 · `troubleshooting` 1 ·
`mehrdeutigkeit` 1 · `tafelbild` 1 · `differenzieren` 1 · `erwartungshorizont`
je Vertiefungskarte (ohne Medien-Spur keiner). Titel sind Pflicht bei
`troubleshooting`, `mehrdeutigkeit` («Herausforderung A»), `differenzieren`
(«80 vs. 100 — Herausforderung A») und `erwartungshorizont`.

## 6. Inhaltliche Regeln

1. **Du-Form** an die Lehrperson. Sie-Form nur in Markern (Texte aus Heft und
   Auftrag) und in zitierten Rückfragen an Lernende — dort Du.
2. **«Punkte 0–3», «0 Punkte … 3 Punkte»**, nie «Stufe 1–4» (E17.5). Die vier
   Abstufungen eines Kriteriums heissen «Stufen», ihre Werte Punkte.
3. **Zeit ist Vorschlag** (E17.1): §1 und der Ablauf in §6 sagen es in
   Überschrift und erstem Satz; Hefte und Bogen nennen keine Woche.
4. **Rückmeldung zum Auftrag ist Vorschlag** (E18): A4 heisst
   «Selbsteinschätzung», Spalten «Selbst» und «Fremd»; wer «Fremd» ausfüllt,
   schreibt der Begleiter nicht vor.
5. **Wörter** (E16): «Quelle», «Ersatzquelle», «Vertiefung (freiwillig)» — nie
   «Pflichtquelle». Der QR-Code steht auf S. 3, S. 1 trägt nur den Kurzeintrag.
6. **Erwartungshorizont je Vertiefungskarte, mit Fundstelle** (E17.5): im
   Titel Typ und Zeitmarke, Absatz oder Abschnitt; im Text das Erwartete und
   was der Ausschnitt **nicht** hergibt (auch: nicht gegengehört). Grundlage:
   Archivtext der Karte und `quellen[].erwartung`. In §7 je Fachgespräch-Frage
   einer, mindestens für die Typen Erklären, Beurteilen und Werthaltung.
7. **Nur Stützen nennen, die es gibt** (E17.5): das Beispiel auf S. 6 und die
   Beispielzeile im Raster; sonst nur, was `scaffold_90` der Spur nennt.
8. **KN-Wortlaut erklären** (`coaching` in §0): Die Stufentexte im Heft sind
   die des KN; für die Rückmeldung zum Heft zählt die Indikator-Zeile. An
   einem Stufentext der eigenen Einheit zeigen.
9. **Quellen-Zugeständnisse** (§5): je Quelle Herkunft und Reichweite der
   Daten, Sprache, was nicht zum Auftrag gehört, Stand von Zahlen und Recht.
   Das Prüfdatum liefert die Tabelle.
10. **Vor dem Einsatz der Medien-Spur** (§2): QR-Seite
    `https://bbw-hko.ch/m/<ordner>` mit `#a` / `#b` öffnen, Geräte, Kopfhörer,
    Links prüfen; dazu die `warnung` zum Ausfall. Eine automatische
    Link-Prüfung gibt es nicht (BERICHT §7a).
11. **Kein Lehrmittel- und kein Quellentext.** Eigene Formulierung; Verweis
    über Kapitel, Seite, Absatz, Zeitmarke. `check-all` prüft `begleiter.md`
    absatzweise (Trennung an Leerzeilen, Absätze über 80 Zeichen) gegen
    Lehrmittel und Quellenarchiv: ab 14 Wörtern am Stück
    `WARN_LEHRMITTEL_NAH`, ab 25 `ERR_LEHRMITTEL_WOERTLICH`. Fehlt das
    Lehrmittel lokal, läuft diese Prüfung nicht — die Regel gilt trotzdem.
12. **Fall des KN:** §6 `Abgrenzung zum KN` beschreibt den KN-Fall nicht; seine
    Begriffe stehen nur im Marker `kontext_ausschluss` und in §7.
13. **Nicht im v4.2-Begleiter** (BERICHT §7a): Ressourcenanalyse,
    Bloom-Zielprofil, Zirkularität, Perspektivenwechsel, ein eigenes Kapitel
    «Wo welche SK geübt wird» (dafür die Tabelle in §0), KI-Einsatz-Kapitel und
    `ki_einsatz`-Callout (die KI-Toolbox liefert `hko-ki-komplement`).
14. Kein Eszett, keine Reste `{{…}}`, `TODO`, `TBD`, `[URL` (`ERR_ESZETT`,
    `ERR_PLATZHALTER`).

**Herleitung der Prosa:** Hinweise je Seite aus Leitfragen, Quellenbindung,
Kasten S. 4, Methoden, `beispielbild`, `abschluss` · Coaching aus dem, was die
Lösung von einer schwachen Antwort trennt · Stolpersteine aus «nicht tragfähig»
der Erwartungshorizonte, den LF3-Lösungen und den Zugeständnissen der Karten ·
Zeitplan-Hinweise aus `kn.kn_typen[].format` und dem Produkttyp.

## 7. Fälle

**7.1 Ein Heft hat nur eine Spur.** §2 bleibt mit Titel und allen H3; der
erste Absatz sagt, welches Heft welche Spur hat, und nennt den Grund
(Prüfregel Leitfaden §4.4: Kompetenz verlangt Rezeption mündlich oder
audiovisuell → nur Medien-Spur; oder: Quelle fehlt → nur ohne Medien). In `Die
Spuren in dieser Einheit` steht in der fehlenden Zelle «entfällt». Im
Heft-Kapitel haben S. 3 und S. 4 nur **eine** Zeile, ohne Spur-Vorsatz. Der
`coaching`-Callout «Zwei Spuren in einem Zimmer» steht nur, wenn mindestens ein
Heft beide Spuren hat. Die `warnung` zum Linkausfall nennt den Rückweg «Spur
ohne Medien» nur, wenn das Heft sie hat — sonst Ersatzquelle oder Lektion
verschieben. Der eingespiegelte Lösungsblock zeigt nur die vorhandene Spur;
sein fester Satz spricht dennoch von «beiden Spuren» (Text im Code) — darum
sagt es §2.

**7.2 Die Einheit hat keine Medien-Spur.** Frontmatter: letzte
`quellen_json`-Zeile löschen. §2: `Spur mit Medien` und `Vorbereitung der Spur
mit Medien` behalten die Überschrift und bekommen je einen Satz. §5 bleibt als
Kapitel (die Nummern §6 und §7 sind fest), aber Marker-Block, Liste und
Callout entfallen — ohne Quellen löst der Marker nicht auf, der Rückfall
bliebe stehen; stattdessen ein Absatz mit den Lehrmittel-Abschnitten der Hefte
(Kapitel, Seite). Kein `erwartungshorizont` zu Vertiefungen.

**7.3 Mündliches oder interaktives Produkt (Heft oder Auftrag).**

- **Organisation im Zimmer** (Hinweis zu S. 7 bzw. Produkt-Abschnitt in §6):
  Paare oder Gruppen, Rollen, Rollentausch, Dauer je Durchgang, was als Notiz
  abgegeben wird — aus `format_detail`, Schritten und Abgaben; dazu ein
  `coaching`-Callout zum Produkt.
- **Zeitbedarf** in §1: Durchgänge × Dauer nachrechnen. Passt es nicht in
  Seitenminuten oder Lektionen, steht eine `warnung` mit Staffelung — ebenso
  für KN-Formen, deren `format` pro Person mehr Zeit nennt, als zwei Lektionen
  für eine Klasse hergeben.
- **Bewertung über die Kriterien:** Rückmeldung auf den zwei Feedback-Kriterien
  des Hefts, festgemacht an `indikator_produkt` und der abgegebenen Notiz —
  kein eigenes Raster für den Vortrag.
- **Auftrag:** Der Produkt-Abschnitt in §6 heisst nach dem Produkt, das
  Organisation braucht (Schritt aus `gemeinsamer_auftrag.produkte`, E25; sonst
  Schritt 05). Mit Interaktionsmodus ist die Sozialform Partner- oder
  Gruppenarbeit mit ausgewiesenem Anteil je Person (Leitfaden §7.3). Aufnahmen
  gehen direkt an die Lehrperson, nichts auf die Plattform.
- Zeigt das Beispiel auf S. 6 eine Wechselrede oder einen Fliesstext (E26),
  beschreibt der Hinweis «S. 6 unten» diese Form.

## 8. Selbstprüfung und Prüfbefehl

Von Hand, vor dem Befehl: H2-Folge §0–§7 und 27 H3, die zwei Code-Anker je
Heft · kein Satz, Beispiel oder Wert der Gold-Einheit · jede Fachaussage mit
Kapitel/Seite oder Fundstelle · Abdeckungstabelle §0 gefüllt und gleich wie
Steckbrief und §6 · je Vertiefungskarte ein Erwartungshorizont · Regeln 2–5
und 7 aus §6 · keine Überschrift «Lösungen der Leitfragen», kein
`ki_einsatz`-Callout.

```
node scripts/check-einheiten.mjs <ordner>
node scripts/check-all.mjs <ordner>
```

`check-einheiten` muss für die Einheit **0 offene Befunde** melden (auch keine
Warnung). `check-all` meldet zusätzlich `ERR_PLATZHALTER`, `ERR_ESZETT` und die
Leck-Befunde je `begleiter.md › Absatz n`; die Absatznummer zählt durch
Leerzeilen getrennte Blöcke ab Dateianfang. Das vollständige Tor mit Export
(`begleiter.docx`) beschreibt `references/phase-9-tor.md`.
