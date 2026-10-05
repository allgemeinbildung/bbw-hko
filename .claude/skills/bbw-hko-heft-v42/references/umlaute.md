# Umlaute und häufige Verschreiber — Prüfung vor dem Schreiben

Übernommen und angepasst aus `_common_misspellings.md` der Skill
`bbw-hko-3er-set` (dort unverändert). Diese Datei listet bekannte Verschreiber
mit der richtigen Schreibweise. Vor jedem Schreiben einer Datei wird jeder
erzeugte Text gegen diese Tabellen geprüft; bei einem Treffer wird ohne
Rückfrage korrigiert.

**Prosa trägt echte Umlaute ä/ö/ü.** Die rechte Spalte («Korrekt») ist die Form,
wie sie in die Datei geschrieben wird. Transliteration (`ae/oe/ue`) bleibt nur
in IDs, Verweisen, Ordner- und Dateinamen und in den Schlüsseln des JSON.

**Kein Skript prüft Transliteration.** `check-v42.mjs` und `check-all.mjs`
melden nur das Eszett. Ein «fuer» oder «Loesung» im Heft fällt im Tor nicht auf
— darum diese Prüfung von Hand.

Erweiterung: Neue Verschreiber nach jedem Lauf hier eintragen. Die Datei wächst
nur.

## Adjektive und Partizipien

| Falsch        | Korrekt       | Hinweis |
|---------------|---------------|---------|
| berechtig     | berechtigt    | abgeschnittenes Wortende |
| verfuegbar    | verfügbar     | Prosa: ue → ü |
| ueberlegt     | überlegt      | Prosa: ue → ü |
| Bedduerfnis   | Bedürfnis     | Tippfehler und Umlaut |

## Häufige Tippfehler in Fachbegriffen

| Falsch                 | Korrekt              |
|------------------------|----------------------|
| Massssstab             | Massstab             |
| sssss                  | (nie fünfmal s — meistens ss) |
| Oekobilanze            | Ökobilanz            |
| Oekobilanz             | Ökobilanz            |
| Wertschoepfung-kette   | Wertschöpfungskette  |
| Wertschoepfungskette   | Wertschöpfungskette  |

## Pauschale Korrekturen (nur Prosa-Felder)

Diese Muster nur in Prosa-Feldern anwenden (Liste unten). Nicht in IDs,
Verweisen, Dateinamen, Schlüsseln und `topic_slug`.

| Muster (Wortteil)      | Ersatz       | Beispiel falsch → richtig |
|------------------------|--------------|---------------------------|
| `fuer`                 | `für`        | „fuer Sie" → „für Sie" |
| `ueber`                | `über`       | „ueberlegen" → „überlegen" |
| `muess`                | `müss`       | „muessen" → „müssen" |
| `moeg`                 | `mög`        | „moeglich" → „möglich" |
| `Aend`                 | `Änd`        | „Aenderung" → „Änderung" |
| `naeh`                 | `näh`        | „naeher" → „näher" |
| `haeu`                 | `häu`        | „haeufig" → „häufig" |
| `Pruef`                | `Prüf`       | „Pruefung" → „Prüfung" |
| `Befuel`               | `Befül`      | „Befuellung" → „Befüllung" |
| `gemaess`              | `gemäss`     | „gemaess Vorgabe" → „gemäss Vorgabe" |
| `staedte`              | `städte`     | „Schweizer Staedte" → „Schweizer Städte" |
| `oekolog`              | `ökolog`     | „oekologisch" → „ökologisch" |
| `Beduerfn`             | `Bedürfn`    | „Beduerfnis" → „Bedürfnis" |
| `verfueg`              | `verfüg`     | „verfuegbar" → „verfügbar" |
| `auswael`              | `auswähl`    | „auswaehlen" → „auswählen" |
| `unguen`               | `ungün`      | „unguenstig" → „ungünstig" |
| `guen`                 | `gün`        | „guenstig" → „günstig" |
| `Loes`                 | `Lös`        | „Loesung" → „Lösung" |
| `Foerd`                | `Förd`       | „Foerderung" → „Förderung" |
| `Stoer`                | `Stör`       | „Stoerung" → „Störung" |
| `Erklaer`              | `Erklär`     | „Erklaerung" → „Erklärung" |
| `Erfaehr`              | `Erfähr`     | „erfaehrt" → „erfährt" |
| `waehl`                | `wähl`       | „waehlen" → „wählen" |
| `Maerk`                | `Märk`       | „Maerkte" → „Märkte" |
| `Geschae`              | `Geschä`     | „Geschaeft" → „Geschäft" |

**Eszett bleibt verboten.** Das Zeichen wird nie geschrieben, auch nicht in
Eigennamen (`references/sprache.md` §9). «Strasse», «muss», «gross», «heisst» —
alle mit ss.

## Suchen, ohne falsch zu treffen

Nach den **Mustern oben** suchen, nicht nach den blossen Buchstabenpaaren
`ae`, `oe`, `ue`. Viele richtige Wörter enthalten sie: Quelle, aktuell, neue,
Steuer, teuer, Dauer, Mauer, Frauen, Poesie, Koexistenz, Israel, Michael,
Duell. Ein Treffer auf ein Buchstabenpaar ist ein Anlass zum
Hinsehen, kein Fehler.

## Wo die Prüfung gilt

Jeder Text, den Lernende oder Lehrpersonen lesen:

- **Heft, Kern:** `titel`, `modul_titel`, `herausforderung.label`,
  `situation_text`, `zahlen_tabelle[].label`, `leitfrage`,
  `mehrdeutigkeit.{trade_off, hint}`, `quellen_anker[].{titel, unterueberschrift}`,
  `leitfragen_intro`, `leitfragen[].{text, liefert}`,
  `leitfragen[].scaffolding.*`, `leitfragen[].loesung.*`,
  `handlungsprodukt.{format, titel, format_detail, beschreibung, abgaben}`,
  `handlungsprodukt.schritte[].{label, hint}`,
  `handlungsprodukt.beispielbild.*`, `handlungsprodukt.loesungsbild.*`,
  `feedback_kriterien[].{stufen, indikator_produkt}`, `lernfortschritt.*`,
  `methoden[].{fuer, tun}`, `mindmap_zentrum`, `mindmap_aeste[].{titel, punkte}`,
  `abschluss.*`, `bewertungsraster[].*`, `wochen_plan[].text`,
  `dekontextualisierung.*`, `prinzip_handoff.*`, `sk_anker[].wo`
- **Heft, Spuren:** `spuren.*.leitfragen[]` ganz (auch `raster.*` und
  `loesung.*`), `spuren.*.quellen[].{auftrag, leitfrage_vertiefung, erwartung}`,
  `spuren.*.kasten_s4.*`, `spuren.*.methoden_ref_rezeption.{fuer, beispiel}`,
  `spuren.*.scaffold_90`
- **Set:** `einheit_titel`, `modul_titel`, `konzept_progression[].konzept`,
  `glossar[].{begriff, definition}`, `gemeinsamer_auftrag.*`,
  `wochenplan[].inhalt`
- **KN:** `kern_kompetenzversprechen`, `mehrdeutigkeits_pflicht`,
  `hybrid_situation.*`, `kn_typen[].{label, format, ablauf, reflexionsfragen,
  optional_praesentation}`, `kn_typen[].fragestruktur[].frage`,
  `kn_typen[].aufgaben[].aufgabe`, `rubrik_shared.kriterien[].{name, stufen}`,
  `rubrik_shared.niveaubaender[].*`
- **Prinzip:** `kern_kompetenzversprechen`, `herausforderungen.*.{herausforderung,
  konfliktart, handlungsprodukt_typ}`, `mehrdeutigkeits_architektur.*`,
  `dekontextualisierungs_anker.*`, `zirkularitaet.*`, `quellen_anker.*`,
  `hybrid_situation_spec.{persona_neutral, qualitaetskriterien,
  fall_ausschluss_hefte_und_auftrag}`, `mindmap_zentrum_kurz`,
  `auftrag_lebensbereich`
- **Quellenkarte:** `kurzbeschrieb`, `lizenz_hinweis`, `verortung.absaetze`
- **`begleiter.md`**, der Bauplan und der Bericht

## Wo sie nicht gilt

Diese Stellen nie mit den Mustern ändern:

- `id`, jeder Verweis (`*_ref`, `ref`, `herausforderungen[]`,
  `anchored_situations[]`, `quelle_ref`), `topic_slug`, `archiv_ref`,
  Ordner- und Dateinamen, Schlüssel
- feste Werte, die Code liest: `template`, `typ`, `antwortform`, `pol_typ`,
  `rolle`, `spur`, `status`, `bogen[]`, `kn_typen[].typ`
- `url` und `urn` einer Quellenkarte
- `titel`, `titel_original` und `herausgeber` einer Quellenkarte: Sie stehen in
  der Schreibweise der Quelle. Dort wird nur das Eszett ersetzt.
- Namen und Sätze aus dem nRLP-Datensatz (`nrlp.kompetenz_text`,
  `nrlp.lebensbezug_text`, Aspekte, Sprachmodi): zeichengenau wie im Datensatz
- Eigennamen von Orten, Personen und Organisationen in einem Fall

## Protokoll

Jede Korrektur im Lauf notieren: `falsch → korrekt in feld`. Mehr als fünf
Korrekturen in einer Datei sind ein Zeichen, dass der Text als Ganzes schlecht
geraten ist: Datei neu lesen, nicht nur flicken, und im Bericht vermerken.
