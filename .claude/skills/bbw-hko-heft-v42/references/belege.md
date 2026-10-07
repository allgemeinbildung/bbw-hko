# Belege — Ort, Dateien, Felder, Urteile

Eine prüfende Rolle gibt ihr Ergebnis nicht als Prosa ab, sondern als
**Beleg-Datei**. Ein Skript prüft sie dann mechanisch: Der Anker steht im
Archivtext, die Zeitmarke liegt im Fenster der Ankerzeile, der Hash stimmt noch,
jedes Lösungsfeld hat eine Zeile. Diese Datei beschreibt **Ort und Form** der
Beleg-Dateien. Wie die Audits arbeiten — Paket, Auftrag, Abgabe —, steht in
`audits.md`; wann sie im Lauf stehen, in `lauf.md` §4.

Herkunft: ENTSCHEIDE E38; Rückblick
`docs/upgrade-v4.2/RUECKBLICK-produktion-2026-10-06.md` §5.1–§5.4; Entscheid
Pietro 07.10.2026 («Beleg-Dateien liegen ausserhalb des Repos»).

**Stand 07.10.2026:** Ort, Format, Schemas und Bibliotheken bestehen (Stufe A);
die fünf Skripte, die die Dateien prüfen, laufen im Tor (Stufe B,
Abschnitt 11); die Rollen, die sie schreiben, und das Skript, das ihre Pakete
baut und ihre Teildateien zusammenführt, stehen in `audits.md` (Stufe C,
Abschnitt 12); `herkunft.json` und die Kartenbelege werden gelesen und geprüft
(Stufe D, Abschnitte 8, 9 und 13).

## 1. Ort

```
<Quellenarchiv>/_pruefung/<ordnername>/        ein Ordner je Einheit, nicht je Lauf
<Quellenarchiv>/_pruefung/_karten/<id>.json    Belege einer geteilten Karte
```

- `<Quellenarchiv>` ist lokal `D:\OS\_lab\quellen-archiv\bbw-hko\`; die
  Umgebungsvariable `QUELLEN_ARCHIV` überschreibt es (wie in `check-namen.mjs`).
  Auflösen: `archivWurzel()` in `scripts/lib/archiv.mjs`.
- `<ordnername>` ist der volle Ordnername der Einheit unter
  `src/data/einheiten/` (`references/ableitungsregeln.md` §10).
- **Nichts davon liegt je im Repo** — die Dateien tragen Wortlaut aus Quelle
  und Lehrmittel (die Anker), und das Repo ist öffentlich. Im Repo liegen nur
  die Schemas (`scripts/schema/`), die Bibliotheken und später das Protokoll
  eines Prüflaufs im Laufordner: Feld, Urteil, Fundstelle — **nie der Anker**.
- Unter `_pruefung/` liegen lose Dateien einer früheren Prüfung (Exporte der
  Gold-Einheit). Sie bleiben, wie sie sind; neu entstehen nur Unterordner.
- **Folgen:** Das Tor braucht das Archiv. Fehlt es lokal, ist nichts geprüft —
  ein Skript meldet dann HINWEIS und endet mit Exit 2, nie «grün». Und:
  `_pruefung/` gehört ins Backup des Archivs; geht der Ordner verloren, sind
  alle Audits zu wiederholen.

## 2. Die Dateien

| Datei | Inhalt | Schreibt | Schema |
|---|---|---|---|
| `belege.json` | je Lösungsfeld: Herkunft, Anker, Fundstelle, Urteil, Hash | Lösungs-Audit | `scripts/schema/belege.schema.json` |
| `fakten.json` | je Rechts- oder Sachaussage über die Welt: Primärquelle, Abruf, Urteil | Fakten-Audit | `fakten.schema.json` |
| `fall.json` | die erfundenen Fallzahlen der Situationen und was die Situation ausschliesst | Executor des Hefts (A, B); Executor Set (Auftrag) — **nicht** ein Audit | `fall.schema.json` |
| `probe.json` | Befunde der Lösbarkeitsprobe, je mit Stand offen oder erledigt | Lösbarkeitsprobe; den Stand führt der Orchestrator nach | `probe.schema.json` |
| `herkunft.json` | `{ abgeleitet_von, stand_commit }` — nur bei einer Einheit, die aus einer anderen entstanden ist | wer die Anpassung beginnt (Orchestrator) | `herkunft.schema.json` |
| `_karten/<id>.json` | Belege und Fakten einer Methoden- oder Quellenkarte | Audit der Karte | `karte-belege.schema.json` |

Jede Datei beginnt mit `"format": "bbw-hko/<name>@1"` und `"einheit":
"<ordnername>"`. Die Schemas enthalten je ein Beispiel mit erfundenem
Platzhaltertext — nie ein Beispiel aus einer Quelle. Sie verwenden nur `type`
(auch als Liste), `const`, `enum`, `pattern`, `minLength`, `minItems`,
`required`, `properties`, `additionalProperties`, `items`, `$defs`, `$ref`
innerhalb der Datei, `allOf`, `if`, `then` — ein Skript kann sie ohne
Abhängigkeit prüfen.

Ein Audit **ändert nichts an der Einheit** und schreibt nur in seinen Ordner
unter `_pruefung/`. `set.json` bekommt kein Feld für die Abstammung; der
Datenvertrag bleibt.

**Teildateien.** Wo mehrere Agenten gleichzeitig an einer Datei schreiben
würden, schreibt jeder seine eigene Teildatei in denselben Ordner, und
`node scripts/audit-paket.mjs <ordner> --zusammenfuehren` baut daraus die
Datei, die die Prüfskripte lesen (Abschnitt 12; `audits.md` §1.4):

| Datei | Teildateien | Form der Teildatei |
|---|---|---|
| `belege.json` | `belege.<heft>.<spur>.json` (Nachprüfung: `….r2.json`) | wie `belege.json`, mit den Zeilen eines Pakets |
| `probe.json` | `probe.<heft>.<spur>.json` | wie `probe.json`, mit einem Lauf |
| `fall.json` | `fall.A.json`, `fall.B.json`, `fall.auftrag.json` | **ein** Block `{ zahlen, ausgeschlossen, geschrieben_am, von }` — der Wert von `faelle.<Träger>` |

`fakten.json` und `herkunft.json` haben einen Schreiber und keine Teildatei.
(Herkunft: Executor A und B arbeiten gleichzeitig, ebenso die Auditoren —
`lauf.md` §5; ein Schreiber je Datei: Entscheid Executor Stufe C, E38.)

## 3. Lösungsfelder und Hash

**Lösungsfeld** ist ein Feld, das nur die Lehrperson sieht und sagt, was als
Antwort gilt. Die Liste steht an genau einer Stelle: `MUSTER` in
`scripts/lib/loesungsfelder.mjs`. `loesungsfelder(<ordner>)` liefert jedes Feld
mit Pfad, Heft, Spur, Art, Text und Hash; die Zahl je Einheit zeigt
`node scripts/lib/loesungsfelder.mjs <ordner>` (mit `--felder` jede Zeile).

| Wo | Felder | Körnung |
|---|---|---|
| `leitfragen[LF1]`, `[LF2]` (Kern) und `spuren.<spur>.leitfragen[LF3]`, `[LF4]` | `loesung.kern` · `loesung.zeilen[i]` · `loesung.raster_zeilen[i]` · `loesung.befund` · `loesung.erwartungshorizont.gut_wenn` · `.beispiel_pol_1` · `.beispiel_pol_2` · `.nicht_tragfaehig` | jede Lösungszeile und jede Rasterzeile ein Feld; `gut_wenn` als Ganzes |
| `spuren.<spur>.kasten_s4` | `loesung_zeilen[i]` (Denkhilfe) | jede Zeile |
| `spuren.<spur>.quellen[i]` | `erwartung` (Vertiefung) | je Vertiefung |
| `handlungsprodukt.loesungsbild` | `hinweis` · `bloecke[i]` | je Block (Titel und alle Einträge) |
| `abschluss.loesung` | `verbindungen[i]` · `transfer` · `eigene_knoten.<spur>` · `quercheck[i]` · `mitnahme` | jede Verbindung, jede Quer-Check-Antwort; Listen als Ganzes |
| `set.json › gemeinsamer_auftrag.erwartungshorizont` | `gut_wenn` · `tragfaehig` · `nicht_tragfaehig` | Auftragsbogen |

Kein Lösungsfeld: Fragen, Rasterspalten, Beispielbild (neutraler Fall, im
Heft), Methodenkarten, Glossar, `kn.json` (führt keine Lösung), `begleiter.md`
(seine Lösungsstellen füllt das Marker-Skript aus diesen Feldern), Titel und
Legende des Lösungsbilds, `quelle_ref`, `quelle_stand`.

**`feld`** heisst überall `Datei › JSON-Pfad`, zeichengleich mit der Ausgabe
der Bibliothek: `herausforderung_A.json ›
spuren.mit_medien.leitfragen[LF3].loesung.zeilen[1]`. Eine Leitfrage wird über
ihre Nummer angesprochen (`[LF3]`), Listen über den Index.

**`spur`** ist `ohne_medien` oder `mit_medien` für alles unter
`spuren.<spur>` und für `eigene_knoten.<spur>`; sonst `beide` (Kern des Hefts,
gemeinsamer Auftrag).

**`hash`** ist SHA-256 (hex) über den normalisierten Text des Felds:
Unicode NFC · Zeilenenden zu `\n` · jede Folge von Leerraum zu einem
Leerzeichen · Rand weg. Gross/Klein, Satzzeichen und Ziffern zählen. Jede
sichtbare Änderung einer Lösung macht die Belegzeile ungültig
(`ERR_AUDIT_VERALTET`); geprüft wird dann nur dieses Feld neu. Wie der Text
eines Felds aus Zeile, Zellen oder Block gebildet wird, steht im Kopf von
`loesungsfelder.mjs`; den Hash berechnet `hashText()` — nie von Hand.

## 4. `belege.json`

Genau **eine Zeile je Lösungsfeld**, keine Zeile ohne Feld.

| Feld | Inhalt |
|---|---|
| `feld` | `Datei › JSON-Pfad` (Abschnitt 3) |
| `spur` | `beide` · `ohne_medien` · `mit_medien` |
| `herkunft` | `quelle` · `lehrmittel` · `fallueberlegung` · `nrlp` — woher die Aussage **nach dem Befund des Audits** stammt, nicht nach der Behauptung des Felds |
| `anker` | wörtlich, 5 bis 12 Wörter am Stück; leer bei `fallueberlegung` |
| `wo` | Quelle: ID der Karte (`q-…`) · Lehrmittel: Dateiname der Kapiteldatei · nRLP: `nrlp_3j.json` bzw. `nrlp_4j.json` · sonst leer |
| `stelle` | wo der Anker beginnt — je Form: Abschnitt 4.2 und 4.3 |
| `urteil` | `stimmt` · `fundstelle_falsch` · `ableitung` · `falsch` |
| `hash` | Hash des geprüften Lösungstexts (Abschnitt 3) |
| `geprueft_am` | `JJJJ-MM-TT` |
| `von` | `{ "rolle": …, "modell": … }` |
| `weitere_belege` | optional: weitere Fundstellen desselben Felds (`herkunft`, `anker`, `wo`, `stelle`) — für eine Lösungszeile, die zwei Seiten oder zwei Zeitmarken nennt |
| `bemerkung` | optional, in eigenen Worten: was die Grundlage wirklich sagt |

### 4.1 Urteile

| `urteil` | Bedeutung | Folge im Tor |
|---|---|---|
| `stimmt` | Die Aussage steht an der genannten Stelle — oder das Feld ist eine Fallüberlegung und gibt sich als solche | — |
| `fundstelle_falsch` | Die Aussage stimmt, aber die Fundstelle, die das Feld nennt (Karte, Seite, Absatz, Zeitmarke), ist falsch. `wo` und `stelle` der Zeile nennen die richtige | Fehler |
| `ableitung` | Die Aussage steht weder in der Quelle noch im Lehrmittel; das Heft folgert sie | zulässig nur, wenn das Feld sie als Fallüberlegung oder Deutung kennzeichnet (`references/sprache.md`); sonst Fehler |
| `falsch` | Die Grundlage sagt etwas anderes, oder die Aussage widerspricht dem Fall | Fehler |

Zusammenhang mit `herkunft`: Bei `quelle`, `lehrmittel` und `nrlp` ist das
Urteil `stimmt`, `fundstelle_falsch` oder `falsch`, und Anker, `wo`, `stelle`
sind gesetzt (bei `falsch` darf der Anker fehlen: Es gibt die Stelle nicht).
Bei `fallueberlegung` sind Anker, `wo` und `stelle` leer, und das Urteil ist
`stimmt` (reine Überlegung am Fall, die nichts über die Quelle behauptet),
`ableitung` (Aussage über die Sache, die die Grundlage nicht trägt) oder
`falsch`.

Der **Anker** wird aus dem Archivtext bzw. der Kapiteldatei **kopiert**, nicht
nacherzählt. Die Suche vergleicht Wörter: Gross/Klein, Satzzeichen, Leerraum,
Anführungszeichen und Trennstriche zählen nicht; Umlaute und Ziffern zählen
(`ankerWoerter()` in `scripts/lib/archiv.mjs`). Er darf über eine Zeilengrenze
laufen — Untertitelzeilen sind kürzer als ein Anker —, aber nicht aus zwei
entfernten Stellen zusammengesetzt sein. Ein Anker, der nur im Kopf oder in
einer Notiz der Archivdatei steht, ist kein Beleg aus der Quelle.

### 4.2 Was «stelle» je Archivform heisst

Ein Archivtext liegt unter `<Quellenarchiv>/<karten-id>/gewaehlt/quelle.md`
(`phase-q-quellen.md` §9). Die Datei hat drei Teile; `zerlegeArchivtext()`
trennt sie:

- **Kopf** — die Zeile `# Titel` und die Liste `- Schlüssel: Wert` darunter
  (Herausgeber, Datum, URL bzw. URN, Abrufdatum, Typ, Ausschnitt, Länge,
  Transkriptart, Zeitmarken, Prüfnachweis, Sachlage …), bis zur Trennlinie
  `---` bzw. bis zur ersten Textzeile. Die Schlüssel sind nicht in jeder Datei
  gleich geschrieben; `kopfFeld(text, /^ausschnitt/)` sucht nach Muster.
- **Quellentext** — jede Zeile, die mit einer **Marke in eckigen Klammern**
  beginnt (auch fett, auch mit vorangestelltem `»`), dazu eine Zeit ohne
  Klammer am Zeilenanfang und die Tabellenzeilen unter dem Kopf (Werte einer
  Grafik).
- **Notiz** — alles Übrige: Abschnitte, deren Überschrift «Audit-Notiz»,
  «Bildprotokoll», «eigene Beschreibung» und Ähnliches nennt; Listenzeilen
  nach dem Kopf; einzelne Hinweiszeilen. Unmarkierte Prosazeilen nach dem Kopf
  gelten als Text **ohne Stelle** («lose»).

Die Trennung ist eine Regel am Schriftbild, kein Wissen über den Inhalt. Wer
ein Archiv neu schreibt, hält sich an die Marken unten — dann ist sie sicher.

| Form | Schreibweise der Marke | `stelle` | Zeitmarken prüfbar |
|---|---|---|---|
| **Zeitzeilen** (Untertitel, Audio und Video) | `[mm:ss]` · `[mm:ss.d]` · `[mm:ss–mm:ss]` · `mm:ss` ohne Klammer, je Zeile | `mm:ss` — die Einsatzzeit der Zeile, in der der Anker beginnt, abgerundet auf die Sekunde | **ja**: Die Zeitmarke, die Heft oder Lösung nennen, liegt im Fenster «Einsatz der Ankerzeile bis Einsatz der nächsten Zeile nach dem Anker», ± 3 Sekunden |
| **Absatz mit Zeit** (Transkript in Blöcken) | `[N] mm:ss — …` · `[N] mm:ss–mm:ss …` · `[N] mm:ss (Sendung hh:mm:ss) …` | `mm:ss` — die Einsatzzeit des Absatzes; `Abs. N` ist ebenfalls gültig | **nur auf den Block genau**: gleiches Fenster, aber der Block dauert meist 10 bis 30 Sekunden. HINWEIS je Karte; jede Zeitmarke dieser Quelle gehört auf die Gegenhör-Liste |
| **Absatz** (Artikel, Webseite, Rechtstext; auch der Begleittext eines Beitrags ohne Transkript) | `[N]` · `**[N]**` · `[Abs. N]` · `[S. P, Abs. N]` | `Abs. N` bzw. `S. P, Abs. N` | Textquelle: entfällt. Audio oder Video mit solchem Text: **nicht möglich** — HINWEIS je Karte, nie still bestehen |
| **Etikett** | `[Lead]` · `[Begleittext]` · `[Zwischentitel]` | das Etikett | wie Absatz |
| **Tabelle** (Werte einer Grafik) | Tabellenzeile `\| … \|` | `Tabelle` | entfällt |
| **ohne Marke** | Prosazeile nach dem Kopf | leer | nicht prüfbar — HINWEIS je Zeile der `belege.json` |
| **kein Text** | Ordner oder `quelle.md` fehlt; nur PDF, PNG oder Tabellendatei | — | nichts prüfbar: Eine Zeile mit `herkunft: quelle` auf diese Karte ist ein Fehler |

Dazu, unabhängig von der Form:

- **Zeit zählt wie im Player des Beitrags** — dieselbe Zählung wie
  `verortung.von`/`bis` der Karte. Stunden werden in Minuten umgerechnet
  (`01:02:03` → `62:03`).
- Der Kopf sagt bei einigen Dateien selbst, dass die Zeitmarken **berechnet**,
  **geschätzt** oder **nicht gegengehört** sind. `zeitPruefbar()` gibt das als
  Stichwort in `vermerk` zurück. Solche Karten bekommen einen HINWEIS, auch
  wenn die Form «Zeitzeilen» ist.
- Zeilen, die die Datei als ausserhalb des gewählten Ausschnitts kennzeichnet
  (Zusatz am Zeilenende oder fehlendes `»`), bleiben Quellentext. Ob ein Anker
  im Ausschnitt liegt, entscheidet `verortung` der Karte.
- **Beilagen** im Ordner (`*.png`, `*.pdf`, `*.xlsx`) sind kein Text. Eine
  Beilage `transkript.md` wird mitgelesen.

`node scripts/lib/archiv.mjs --formen` zeigt für jede Karte des Archivs Form,
Zahl der Zeilen und die Stufe der Zeitmarken-Prüfung (`zeile` · `block` ·
`nein` · `entfaellt`) — ohne Text.

Erhoben am 07.10.2026 an allen 158 Ordnern `q-…` des Archivs: 92 Absatz ·
45 Zeitzeilen · 19 Absatz mit Zeit · 1 Etikett · 1 ohne Ordner `gewaehlt`.
Keine Karte hat nur Bild oder PDF; vier Ordner führen Beilagen neben dem Text.
Zeitmarken: 48 auf die Zeile, 16 nur auf den Block, 5 nicht prüfbar, 89
entfallen (Textquellen).

### 4.3 Was «stelle» im Lehrmittel heisst

Kapiteldateien liegen unter `material/_lehrmittel/<Kapitelnummer>_<Titel>.md`
(gitignored). Eine Zeile `[seite: N]` beginnt die Buchseite N; alles bis zur
nächsten Marke gehört zu ihr. Kommentare `<!-- header|footer|style: … -->` sind
Satzangaben und kein Text.

- `wo` ist der **Dateiname** der Kapiteldatei, `stelle` ist `S. N` — die Seite,
  auf der der Anker beginnt. Ein Anker darf über einen Seitenwechsel laufen.
- Die Seite, die das Heft oder die Lösung nennt, muss die Seite des Ankers
  sein (bei einem Bereich «S. 55–60»: darin liegen).
- Zwei Kapitelnummern tragen zwei Dateien; `kapitelDateien()` gibt dann beide
  zurück. In drei Dateien stehen Seitenmarken nicht aufsteigend, in zwei steht
  Text vor der ersten Marke (ohne Seite) — `ladeKapitel()` meldet das als
  `ungeordnet` bzw. `seite: null`.

`herkunft: nrlp`: `wo` ist die Datei des Datensatzes unter `public/`, `stelle`
die Nummer der Kompetenz oder des Lebensbezugs, der Anker ein Stück des
Wortlauts dort.

## 5. `fakten.json`

Eine Zeile je **Aussage über die Welt** im sichtbaren Text der Einheit (Hefte,
Lösungen, Auftragsbogen, Begleiter, Glossar, Karten): Gesetzeskürzel mit
Artikel, Frist, Betrag, Prozent, Datum, «Stand …», Ergebnis einer Abstimmung.
Nicht: die Fallzahlen aus `fall.json`.

| Feld | Inhalt |
|---|---|
| `wortlaut_im_heft` | die Aussage, wie sie im Feld steht — eigener Text der Einheit, so lang, dass Kürzel, Zahl und Einheit darin stehen. Das Skript sucht den Wortlaut im Feld; ändert sich der Text, fehlt die Zeile wieder |
| `feld` | `Datei › Stelle`; Karten als `quellen/<id>.json › …` bzw. `methoden/<id>.json › …`; Begleiter als `begleiter.md › Absatz N` |
| `auch_in` | optional: weitere Felder mit derselben Aussage im selben Wortlaut |
| `art` | optional: `artikel` · `frist` · `betrag` · `prozent` · `datum` · `stand` · `abstimmung` · `zahl` · `sonst` |
| `primaerquelle` | URL der amtlichen Stelle; leer nur bei `nicht_belegbar` |
| `fundstelle` | optional: Artikel und Absatz, Tabelle — in eigenen Worten |
| `abgerufen_am` | `JJJJ-MM-TT` |
| `urteil` | `belegt` · `abweichend` · `nicht_belegbar` |
| `bemerkung` | in eigenen Worten; Pflicht bei `abweichend` und `nicht_belegbar` |
| `von` | optional: `{ rolle, modell }` |

Die frühere Fakten-Tabelle im Bericht kannte vier Urteile (Läufe bis
07.10.2026); die Datei kennt drei: «stimmt» und «vertretbar vereinfacht» →
`belegt` (was weggelassen ist, steht in `bemerkung`) · «stimmt nicht» →
`abweichend` · «nicht belegbar» → `nicht_belegbar`. Die Tabelle selbst entfällt
(`phase-10-abschluss.md` §2): Der Bericht nennt die Zahlen je Urteil und jede
Zeile, die nicht `belegt` heisst. `abweichend` ist im Tor ein
Fehler; `nicht_belegbar` ebenfalls, ausser die Stelle ist als Fallüberlegung
gekennzeichnet. Ein Abruf, der älter als zwölf Monate ist, ist eine Warnung.

## 6. `fall.json`

Die **erfundenen** Zahlen und Angaben der Situationen — je Träger ein Fall:
`faelle.A`, `faelle.B`, wahlweise `faelle.auftrag`. Geschrieben von dem, der
die Situation schreibt, in derselben Phase — **nie von einem Audit**: Executor
A schreibt `fall.A.json`, Executor B `fall.B.json` (Phase 4, ergänzt bis zur
Abgabe des Hefts nach Phase 6), der Executor Set `fall.auftrag.json`
(Phase 7), je als Teildatei mit einem Block (Abschnitt 2). Der Orchestrator
führt sie im Tor zusammen. Ändert eine Korrektur eine Fallzahl, führt ihr
Schreiber die eigene Teildatei nach. `node scripts/check-zahlen.mjs <ordner>
--liste` zeigt jede Zahl mit Einheit im Text — die Arbeitsliste dafür.
(Herkunft: Auftrag 10, Stufe A: «Geschrieben vom Executor des Hefts, nicht vom
Audit»; E38.)

- `zahlen[]`: `name` (wie das Heft die Grösse nennt) · `wert` (Zahl; Text nur
  für Wochentag, Datum, Uhrzeit) · `einheit` · wahlweise `schreibweisen[]`
  (wie der Wert im Text steht, wenn es abweicht) und `abgeleitet_aus` (die
  Rechnung, wenn der Wert aus anderen Fallzahlen folgt).
- `ausgeschlossen[]`: `was` · `werte[]` · wahlweise `grund` — was die Situation
  ausschliesst (ein Wochentag, ein Datum). Das Beispiel auf S. 6, das
  Lösungsbild und die Lösungen dürfen es nicht als möglich zeigen.
- je Fall `geschrieben_am` und `von`.

Die Datei dient zwei Prüfungen: Jede Fallzahl steht überall mit demselben Wert
(`check-zahlen`), und eine Fallzahl braucht keine Zeile in `fakten.json`
(`check-fakten`).

## 7. `probe.json`

Ergebnis der Lösbarkeitsprobe. `laeufe[]` hält fest, **was** geprobt wurde
(`heft`, `spur`, `geprueft_am`, `von`) — «keine Befunde» ist damit etwas
anderes als «nicht gelaufen». `zeilen[]` sind die Befunde:

| Feld | Inhalt |
|---|---|
| `feld` | `Datei › JSON-Pfad` der Stelle, an der die **Aufgabe** der Fehler ist |
| `heft` · `spur` | `A` · `B` · `auftrag`; Spur wie oben |
| `art` | `stufe3_unerreichbar` · `form_weicht_ab` · `keine_echte_wahl` · `sonst` |
| `befund` | ein Satz |
| `beleg` | die Stelle im Produkt und die Stelle in Kriterium, Auftrag oder Lösungsbild |
| `stand` | `offen` · `erledigt` — `erledigt` verlangt `erledigt_am` und `erledigt_wie` (behoben, stehen gelassen mit Grund, Entscheid Pietro) |

Ein Befund mit Stand `offen` ist im Tor ein Fehler (`ERR_PROBE_OFFEN`). Die
Probe schreibt ihre Teildatei immer mit `offen`; den Stand führt der
Orchestrator in `probe.json` nach — das Zusammenführen lässt eine vorhandene
Zeile stehen. Auftrag der Probe und die Regeln für `erledigt_wie`:
`audits.md` §4.

## 8. `herkunft.json`

Nur bei einer Einheit, die aus einer anderen entstanden ist (Anpassungsplan):

```json
{ "abgeleitet_von": "<ordnername der Vorlage>", "stand_commit": "<git-hash>" }
```

`stand_commit` ist der Commit des Repos, dessen Stand der Vorlage übernommen
wurde (7 bis 40 Hex-Zeichen). Eine abgeleitete Einheit ist eine neue Einheit:
eigene `belege.json`, eigene `fakten.json`, kein übernommener Beleg
(`phase-10-abschluss.md` §1 Nr. 5). `set.json` führt die Abstammung nicht —
der Datenvertrag bleibt.

**Wer schreibt, wann.** Der Orchestrator, **vor dem ersten Schreiben** der
Anpassung. Den Commit liefert
`git rev-list -1 HEAD -- src/data/einheiten/<vorlage>` (der letzte Commit, der
die Vorlage geändert hat) zu dem Zeitpunkt, an dem die Vorlage gelesen wird.
Optional `format` (`bbw-hko/herkunft@1`), `einheit`, `bemerkung`.

**Was `check-belege` daraus macht** (seit E38, Stufe D; `check-fakten` für die
Faktenzeilen):

| Prüfung | Was verglichen wird | Code |
|---|---|---|
| eigene Audits | `belege.json` **und** `fakten.json` liegen im Ordner der Abgeleiteten | `ERR_HERKUNFT_OHNE_AUDIT` (mit `--vor-audit`: kein Befund) |
| kein kopierter Beleg | Eine Belegzeile, deren `hash` **nicht** zum heutigen Text ihres Felds passt, aber der Hash eines Lösungsfelds der Vorlage ist — heute, am `stand_commit` oder in der `belege.json` der Vorlage. Dasselbe für eine Zeile, deren Feld es hier nicht gibt | `ERR_BELEG_KOPIERT` (statt `ERR_AUDIT_VERALTET` bzw. `ERR_BELEG_OHNE_FELD`) |
| keine kopierte Faktenzeile | Eine verwaiste Zeile (ihr Wortlaut steht nicht im genannten Feld), deren Wortlaut in der `fakten.json` der Vorlage steht | `ERR_FAKT_KOPIERT` (statt `ERR_FAKT_ZEILE_VERWAIST`) |
| Vorlage korrigiert | Die Vorlage am `stand_commit` (`git show`) gegen die Vorlage heute im Baum: jedes **Lösungsfeld** (Hash je Feldpfad: geändert, neu, entfernt) und jedes **Faktenfeld** (ein Textfeld von Heft, `set.json`, `kn.json` oder der Begleiter als Ganzes, dessen Aussagen über die Welt — Artikel, Zahl mit Einheit, Datum, «Stand» — nicht mehr dieselben sind) | `ERR_VORLAGE_GEAENDERT` — eine Zeile mit den Zahlen, dann eine je Feld; «hier noch im alten Wortlaut» heisst: Die Abgeleitete trägt in einem Lösungsfeld noch genau den Text, den die Vorlage korrigiert hat |
| Vergleich nicht möglich | Git fehlt, oder der Commit ist im Repo nicht lesbar | `HINWEIS_HERKUNFT_NICHT_PRUEFBAR`, Exit 2 — nie grün |
| Form | unlesbar, Schema verletzt, `einheit` nennt einen anderen Ordner, `abgeleitet_von` nennt die Einheit selbst; die Vorlage fehlt im Baum oder am Commit | `ERR_HERKUNFT_SCHEMA`, `ERR_HERKUNFT_VORLAGE_FEHLT` |

- **Derselbe Text ist kein kopierter Beleg.** Trägt die Abgeleitete in einem
  Feld wörtlich den Text der Vorlage, ist der Hash derselbe — ob die Zeile neu
  auditiert oder abgeschrieben ist, sieht kein Skript. Das sichert die Regel
  (volle Audits) und das Blind-Paket; `ERR_BELEGE_EINHEIT` fängt die ganze
  kopierte Datei.
- **«Neu zu prüfen» endet mit einem neuen `stand_commit`.** Hat der
  Orchestrator die gemeldeten Felder an der Abgeleiteten geprüft (und wo nötig
  korrigiert und neu auditiert), trägt er in `herkunft.json` den Commit ein,
  gegen den geprüft wurde; `bemerkung` nennt Datum und Bericht. Vorher bleibt
  die Meldung stehen — an einem Entwurf als Fehler, an einer gebundenen
  Einheit als Warnung.
- **Schwere** wie überall: gebunden → Warnung, Entwurf oder `--streng` →
  Fehler. Ohne `herkunft.json` gilt eine Einheit als nicht abgeleitet; heute
  trägt keine eine (die Abstammung von `3.1.1_konsum_verantworten_3j` ist im
  Archiv nicht eingetragen — E38 Stufe D, «offen für Pietro»).
- Unter `--wurzel` (Temp-Kopie ohne `.git`) kommt der Stand am Commit aus dem
  Repo des Skripts, «heute» aus der Temp-Kopie — wie bei `karten.mjs`.

## 9. Karten: `_pruefung/_karten/<id>.json`

Für eine Methoden- oder Quellenkarte, deren Text an Lehrmittel oder Quelle
hängt: `belege[]` (Zeilen wie in `belege.json`, `feld` ist der JSON-Pfad in
der Karte, ohne `spur`) und `fakten[]` (Zeilen wie in `fakten.json`, mit
`wortlaut_in_der_karte`). Der Hash läuft über den Text des Kartenfelds (eine
Liste wie `schritte` oder `beispiel` als Ganzes: Einträge mit Zeilenwechsel
verbunden; ein einzelner Eintrag als `schritte[2]`).

**Was belegt sein muss** (seit E38, Stufe D; `belegPflicht()` in
`scripts/karten.mjs`):

| Karte | Feld | Zeile |
|---|---|---|
| Lehrmittelkarte (`quelle: "lehrmittel"`) | `lesen`, `merk` — sie sagen, was im Kapitel steht | `belege[]`, Herkunft `lehrmittel`, `wo` = Kapiteldatei des Kapitels `kap`, `stelle` = `S. N` auf einer Seite aus `seiten` |
| jede Methodenkarte | jede Aussage über die Welt in `fuer`, `lesen`, `schritte`, `ankommt`, `fehler`, `merk` (Artikel, Zahl mit Einheit, Datum, «Stand»; im Musterbeispiel `beispiel` nur Artikel, «Stand», Abstimmung) | `fakten[]` — oder eine Belegzeile für das Feld |
| Quellenkarte | nichts von selbst (ihre Aussagen prüft `check-fakten` in jeder Einheit, die sie führt); eine Datei ist zulässig | — |

**Prüfen:** `node scripts/karten.mjs belege [<karten-id>]` — ohne ID alle
Methodenkarten. Schema, Hash je Zeile gegen den heutigen Text des Felds
(`KARTE_BELEGE_VERALTET`), Anker im Kapitel bzw. im Archivtext, Seite des
Ankers gleich `stelle` (`KARTE_STELLE_FALSCH`) und in `seiten` der Karte
(`KARTE_SEITE_DANEBEN`), Urteil (`KARTE_URTEIL`), fehlende Zeilen
(`KARTE_BELEG_FEHLT`, Warnung). **Fehlt die Datei, ist die Karte «nicht
belegt» — ein Hinweis, kein Fehler** (Stand 07.10.2026: keine der 42
Methodenkarten hat eine). `karten.mjs geaendert` — die Zeile «Karten» im Tor —
liest die vorhandenen Dateien mit: Eine Karte, deren Text nach dem Audit
geändert wurde, macht ihre Belege ungültig und erscheint als Warnung
`KARTE_BELEGE_VERALTET`. Wer die Datei schreibt: `audits.md` §6
(Karten-Audit).

## 10. Die zwei Bibliotheken

Beide lesen nur, brauchen keine Abhängigkeit und geben auf der Konsole nie
Quellentext aus.

| Datei | Liefert |
|---|---|
| `scripts/lib/loesungsfelder.mjs` | `MUSTER` · `loesungsfelder(ordner)` · `loesungsfelderAus(dateien)` · `leseFeld(json, pfad)` · `normalisiereLoesungstext()` · `hashText()` |
| `scripts/lib/archiv.mjs` | `archivWurzel()` · `lehrmittelWurzel()` · `pruefOrdner()` · `kartenBelegDatei()` · `liesBelegDatei()` · `ladeArchivtext()` · `zerlegeArchivtext()` · `kopfFeld()` · `formVon()` · `zeitPruefbar()` · `ausschnittDerKarte()` · `ankerWoerter()` · `sucheAnker()` · `laengsterTeilanker()` · `imFenster()` · `kapitelDateien()` · `ladeKapitel()` · `sucheAnkerKapitel()` · `parseZeit()` · `formatZeit()` |

Beide nehmen `--wurzel <ordner>` (Repo-Wurzel einer Temp-Kopie). Das Archiv
bleibt dabei das lokale bzw. `QUELLEN_ARCHIV`; das Lehrmittel wird zuerst in
der Temp-Kopie gesucht, dann im Repo, oder über `LEHRMITTEL` gesetzt.

## 11. Stufe B — die Skripte, die die Dateien prüfen

Seit 07.10.2026 (ENTSCHEIDE E38, Stufe B). Jedes Skript führt seinen
Codekatalog im Kopfkommentar; je Befund gibt es aus: **Code · Datei › Feld ·
Kurzbefund**.

| Skript | Liest | Prüft |
|---|---|---|
| `scripts/check-belege.mjs` | `belege.json`, `probe.json`, Archivtext, Kapiteldatei | jedes Lösungsfeld genau eine Zeile · Hash (`ERR_AUDIT_VERALTET`) · Anker im Quellentext bzw. auf der Seite · Zeile des Ankers im Ausschnitt der Karte · Zeitmarke der Lösung höchstens 3 s neben dem Fenster des Ankers · Urteil · Ableitung gekennzeichnet · keine Fundstelle in der Lösung ohne Belegzeile · kein offener Befund der Lösbarkeitsprobe |
| `scripts/check-fakten.mjs` | `fakten.json`, `fall.json` | jede Aussage über die Welt (Artikel, «Stand …», Datum, Betrag, Prozent, Frist, Menge, Abstimmung) hat eine Zeile mit Urteil `belegt` · `abweichend` · `nicht_belegbar` ohne Kennzeichnung · Abruf älter als zwölf Monate |
| `scripts/check-zeiger.mjs` | Karten, Archivtext, Kapiteldateien | `archiv_ref` · `woerter` ± 5 % · Absatz ≤ Absatzzahl · `von` < `bis`, `dauer_sek` · Zeitmarken und Absätze im Heft liegen im Ausschnitt · «S. n» trägt das genannte Element · jeder Schritt-Hinweis nennt eine Seite · Lehrmittelseite liegt im Kapitel |
| `scripts/check-zahlen.mjs` | `fall.json` | Rechnungen im Text · Summenzeile einer Tabelle · jede Fallzahl überall mit demselben Wert · was die Situation ausschliesst |
| `scripts/check-kohaerenz.mjs` | nur die Einheit | gleiche Werte in Prinzip, Heft und Set · kein Lösungssatz bei den Lernenden · gesperrte Wörter · Umlaute · Anzahl und Bezeichner · Kurzbeschrieb gegen Lösung · «Punkte» statt «Stufe» |
| `scripts/check-links.mjs` | Karten und Hefte, **mit Netz** | Status und Weiterleitung jeder URL — nicht im Tor |

**Gleiche Schalter in den fünf Tor-Skripten:**

- `<ordner> [<ordner> …]` oder `--v42` (alle Einheiten im Format v4.2)
- `--streng` — jede Einheit wie ein Entwurf: Befunde sind Fehler
- `--protokoll <datei>` — dieselbe Ausgabe **ohne Anker und ohne Textauszug**
  (nur Feld, Urteil, Fundstelle, Code): die Fassung für
  `laeufe/<…>/belege-check.txt`. Die Konsole zeigt Anker; ins Repo gehört nur
  das Protokoll.
- `--wurzel <ordner>` — anderer Baum statt dieses Repos (Gegenproben)
- `--vor-audit` (nur belege und fakten; `check-all` reicht ihn durch) — erster
  Durchgang des Tors: Fehlt die Datei noch, ist das `HINWEIS_AUDIT_STEHT_AUS`
  statt `ERR_BELEGE_FEHLT` bzw. `ERR_FAKTEN_FEHLT`. Sonst ändert der Schalter
  nichts (`phase-9-tor.md` §1)
- `--liste` (belege, fakten, zahlen) — die Arbeitsliste, ohne zu prüfen:
  alle Lösungsfelder mit Hash · alle gefundenen Aussagen mit Art und Umfeld ·
  alle Rechnungen und Zahlen mit Einheit
- `--export <ordner>` (zeiger, kohaerenz) — die Ausgabe von
  `scripts/export-v42.mjs` dieser einen Einheit: liest zusätzlich den
  gedruckten Seitentext. Die Skripte exportieren nie selbst.

**Schwere.** Bei einer gebundenen Einheit (`publiziert`, `archiviert`, kein
Feld) ist jeder Befund eine Warnung, bei `entwurf` und unter `--streng` ein
Fehler. Fehlt `belege.json`, `fakten.json` oder `fall.json`, gibt es **eine**
Zeile je Datei («nicht auditiert»), nicht eine je Feld. Codes mit `WARN_` sind
immer Warnungen (ein Mensch entscheidet), `HINWEIS_` heisst «nicht prüfbar» und
zählt nie als bestanden.

**Exit.** 0 ohne Fehler · 1 mit Fehlern · 2 bei falschem Aufruf oder wenn
Archiv bzw. Lehrmittel lokal fehlt. `check-all` führt die fünf als eigene
Zeilen je v4.2-Einheit, zeigt ihre Warnungen und Hinweise als Zählung je Code
und reicht `--streng` durch; ein Exit 2 heisst dort «nicht geprüft», die
Schlusszeile lautet dann nicht «GRUEN», und unter `--cloud` ist es ein Fehler.

**Wie die Skripte lesen** (damit ein Audit Zeilen schreibt, die bestehen):

- *Zeitmarke.* Die Lösung nennt `mm:ss` oder eine Spanne `mm:ss–mm:ss`. Eine
  Einzelmarke muss im Fenster eines Ankers liegen (Einsatz der Ankerzeile bis
  Einsatz der nächsten Zeile, ± 3 s); bei einer Spanne muss ein Anker in ihr
  beginnen. Jede genannte Marke braucht einen Beleg — die Hauptzeile oder
  `weitere_belege`.
- *Seite.* Nennt die Lösung «Kap. x.y, S. n» oder «S. n» über 8, muss ein
  Beleg mit `herkunft: lehrmittel` auf dieser Seite (im Bereich) stehen, und
  kein Beleg ausserhalb der genannten Seiten. «S. 1» bis «S. 8» ohne Kapitel
  sind Heftseiten.
- *Absatz.* «Abs. n» meint den Absatz der Quelle. «S. 62, Absatz 2» meint
  einen Absatz der Lehrmittelseite; geprüft wird dort nur die Seite.
  «Art. … Abs. …» ist Gesetz und kein Zeiger.
- *Ableitung.* Das Feld kennzeichnet sie mit einem Wort der Liste in
  `references/sprache.md` §7.4 (Fallüberlegung, Annahme, Deutung, Auslegung,
  «nicht belegt» …). Massgebend ist `RE_FALLKENNZEICHEN` in
  `scripts/lib/pruefung.mjs`; die Liste in `sprache.md` ist ihre Abschrift.
- *Fakten.* `wortlaut_im_heft` muss im genannten Feld stehen und den Treffer
  des Skripts enthalten (Kürzel mit Artikel, Zahl mit Einheit …). Im Begleiter
  zählt jeder Absatz, der den Wortlaut trägt — die Absatzzählung verschiebt
  sich mit jeder Änderung. Felder mit erfundenem Fall (Beispielbild, Beispiel
  einer Karte, Beispielzeile) brauchen nur für Artikel, «Stand» und
  Abstimmungen eine Zeile.
- *Fallzahlen.* Ohne `fall.json` gelten die Zeilen der `zahlen_tabelle` als
  Fallzahlen (Name = `label`). Mit `fall.json` gilt zusätzlich: Jede Zahl steht
  im Text ihres Hefts, und was `ausgeschlossen` nennt, zeigen Beispiel,
  Lösungsbild und Lösungen nicht als möglich (ein Satz mit «nicht», «kein»,
  «ausser» zählt nicht).
- *Seitenzeiger.* Welches Feld auf welcher Heftseite steht, ist am Renderer
  abgelesen (feste Folge Seite 1 bis 8; `ELEMENT_SEITEN` in
  `scripts/lib/pruefung.mjs`): Situation 1 · LF1, LF2 2 · LF3, Raster 3 · LF4,
  Denkhilfe, Vertiefung 4 · «Das geben Sie ab», Kriterien 5 · Methoden,
  Beispiel 6 · Arbeitsfläche 7 · Checkliste, Begriffsnetz, Glossar,
  Quer-Check 8. Geprüft wird ein Verweis, der das Element unmittelbar vor der
  Seite nennt («Checkliste (S. 8)», «Raster auf S. 3»).

Die Bibliotheken dazu: `scripts/lib/pruefung.mjs` (Aufruf, Einheit laden,
Schwere, Bericht, Textfelder, Seiten, Marken), `scripts/lib/aussagen.mjs`
(Aussagen und Zahlen finden), `scripts/lib/schema.mjs` (Schemas prüfen),
`scripts/lib/seitentext.mjs` (Text eines exportierten Dokuments je Seite —
geteilt mit `scripts/seitentext.mjs` der Skill).

## 12. Stufe C — Pakete, Teildateien, Gegenhör-Liste

Seit 07.10.2026 (ENTSCHEIDE E38, Stufe C). Beide Skripte prüfen nichts und
laufen nicht als Zeile in `check-all`; das Zusammenführen ist Schritt 3 des
Tors (`phase-9-tor.md` §1).

| Skript | Tut | Schreibt |
|---|---|---|
| `scripts/audit-paket.mjs <ordner> --plan` | nennt die Pakete des Lösungs-Audits (Heft, Spur, Zahl der Felder) und rechnet nach, dass jedes Lösungsfeld in genau einem liegt | nichts |
| `… --heft <heft> --spur <spur> --out <datei>` | **Blind-Paket**: Aufgaben, was die Lernenden sehen, Quelle und Lehrmittel in voller Auflösung — keine Lösung | `<datei>`, nie in einem Repo |
| `… --mit-loesung --antworten <datei> --out <datei> [--geruest <datei>]` | **Vergleichs-Paket** und Gerüst der Teildatei — nur, wenn die Antworten-Datei jede Aufgabe trägt | `<datei>`, nie in einem Repo |
| `… --probe --heft <heft> [--spur <spur>] --out <datei>` | **Paket der Lösbarkeitsprobe** | `<datei>`, nie in einem Repo |
| `… --zusammenfuehren` | Teildateien → `belege.json`, `probe.json`, `fall.json` (Abschnitt 2) | im Ordner `_pruefung/<ordnername>/` |
| `… --pruefen --heft <heft> --spur <spur>` | zusammenführen, dann `check-belege --streng`, gezeigt nur die Felder des Pakets: `ZEILE` (die Belegzeile stimmt nicht) oder `BEFUND` (das Audit hat etwas gefunden) | wie `--zusammenfuehren` |
| `scripts/gegenhoeren.mjs <ordner> [--out <datei>]` | Gegenhör-Liste aus Karten und Feldnamen, mit der Genauigkeit der Zeitmarken je Karte — ohne Anker | `<datei>` (darf in den Bericht) |

Alle nehmen `--wurzel <ordner>`. `audit-paket.mjs` verweigert jede Ausgabe in
dieses Repo, unter `--wurzel` und in jedes Git-Repo (Exit 2). Was «blind»
heisst, steht im Kopf des Skripts: kein Feld, das `lib/pruefung.mjs` als Lösung
führt, kein Kurzbeschrieb der Karte, weder Kopf noch Notizen der Archivdatei.

## 13. Stufe D — keine Vererbung

Seit 07.10.2026 (ENTSCHEIDE E38, Stufe D; Rückblick §5.4). Vier Wege, auf denen
sich ein Fehler vervielfacht hat, und was ihn heute aufhält:

| Weg | Riegel | Wo beschrieben |
|---|---|---|
| Einheit aus Einheit | `herkunft.json`; `check-belege` und `check-fakten` melden übernommene Zeilen und eine später korrigierte Vorlage | Abschnitt 8 |
| geteilte Karte | `karten.mjs` (ändern oder neu, Vermerk); Kartenbelege mit Hash | Abschnitt 9, `karten.md` |
| Skelett, Skill | `scripts/check-skelette.mjs` — Zeile «Skelette» im Tor; Start-Riegel über `docs/cloud-run/OFFEN.md` | `lauf.md` §3 Zeile 9 |
| gefundener Fehler bleibt in den anderen Einheiten | `scripts/gleiche-stelle.mjs` — Rückweg, bevor der Lauf endet | `phase-9-tor.md` §5 |

| Skript | Tut | Im Tor |
|---|---|---|
| `scripts/check-skelette.mjs` | prüft die Vorlagen unter `assets/` ungefüllt: gültiges JSON · Platzhalterform «{{…}}» (nur diese findet `check-all` in einer Einheit wieder) · kein «ß» · kein Du und kein gesperrtes Wort im festen Text der Lernenden · kein transliterierter Umlaut · jeder Feldpfad steht in der Gold-Einheit oder im Datenvertrag (gegen `types.ts` nur der Feldname — statisch gelesen, kein Compiler) · `status: "entwurf"`, Template · jeder Marker des Begleiter-Skeletts führt in ein Feld · die wörtlichen Auftragsvorlagen in `gegenleser.md` und `audits.md` nennen kein festes Lehrjahr, keinen Lehrgang, kein Alter, kein Modell mit Version, keinen absoluten Pfad. `--felder` listet jeden Pfad | ja, Zeile «Skelette», einmal je Aufruf |
| `scripts/gleiche-stelle.mjs <feldpfad> <muster>` | sucht eine Fehlerform in allen Einheiten und Karten; gibt Einheit · Datei › Pfad · Ausschnitt (höchstens acht Wörter eigenen Texts) und die Trefferzahl je Einheit aus. Exit 1 = Treffer | nein |
| `scripts/karten.mjs belege [<id>]` | Kartenbelege prüfen (Abschnitt 9) | mittelbar: `geaendert` meldet veraltete Zeilen |
| `scripts/lib/herkunft.mjs` | Bibliothek: Stand der Vorlage an einem Commit, Vergleich der Lösungs- und Faktenfelder | — |

Ein Befund in einem Skelett ist ein Fehler, ausser er steht mit Datum und Grund
in der Liste `HINGENOMMEN` im Kopf von `check-skelette.mjs` — dann ist er eine
Warnung, bis er entschieden ist. Die Liste ist leer (07.10.2026: kein Befund).
