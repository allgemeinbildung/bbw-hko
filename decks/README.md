# Unterrichtsdecks

| Ordner | Was es ist |
|---|---|
| `rechte-verstehen-nutzen/` | **Referenz von Hand gebaut** — der Massstab, gegen den der Generator geprüft wurde. Nicht weiterpflegen. |
| `generated/` | **Generator-Ausgabe** (`npm run build:deck -- --all`). Wegwerf-Artefakt zum Prüfen; die Plattform generiert zur Laufzeit. |

## Generator

Das Deck wird **vollständig** aus `src/data/einheiten/<slug>/` erzeugt — den sechs JSONs
und `begleiter.md`. Keine Handarbeit, keine Konfigurationsdatei pro Deck.

```bash
npm run build:deck -- 1.1.1_rechte_verstehen_nutzen
npm run build:deck -- --all
```

Code: [`src/lib/einheiten/deck-builder.ts`](../src/lib/einheiten/deck-builder.ts).
Gilt für **EFZ (3J/4J) und EBA (2J)** aus derselben Quelle — siehe [EBA](#eba). Der
Generator überspringt nur noch **unvollständige** Einheiten (ohne `kn.json` oder
`begleiter.md`) und nennt in der Meldung, was fehlt.

### Aufbau — zwei Achsen, keine Wochen

Das Deck nennt **keine Wochen**. Es taugt damit gleichermassen als Überblick und als
Präsentation; wie die Herausforderungen auf Lektionen verteilt werden, entscheidet die
Lehrperson (Begleiter Kap. 2).

```
→  Titel · Versprechen · Übersicht · A · B · C · Austausch · Prinzip · Transfer · KN-Fall · KN-Formen · Bewertung
↓                                    └── Leitfragen · [Lösung der Leitfragen] · [Wissens-Anker] · [Mindmap] · Handlungsprodukt · [Musterlösung]
```

- **→ / ←** Hauptlinie (12 Folien; mit `set.vorwissen_check` 13) — die Herausforderung auf einer Folie
- **↓ / ↑** Unterfolien der aktuellen Herausforderung
- **Leertaste** läuft beides in Lesereihenfolge durch
- **N** Notizen · **F** Vollbild · **Beamer** zweites Fenster

**Die Zahl der Unterfolien ist nicht fix.** Zwei entstehen immer (Leitfragen,
Handlungsprodukt), die vier in `[…]` nur, wenn das jeweilige Feld gepflegt ist — jede für
sich, in dieser Reihenfolge:

| Unterfolie | entsteht aus | Lehrgang |
|---|---|---|
| Leitfragen | `leitfragen[]` | immer |
| Wissens-Anker | Dossier-Karten zur Herausforderung | nur EBA |
| Lösung der Leitfragen | `leitfragen[].loesung.zeilen` | optional |
| Mindmap | `mindmap_zentrum` + `mindmap_aeste` | optional |
| Handlungsprodukt | `handlungsprodukt` | immer |
| Musterlösung | `handlungsprodukt.musterloesung.abschnitte` | optional |

Der Wissens-Anker steht **vor** der Lösung, nicht danach: erst die Frage, dann wo das
Wissen liegt, dann der Massstab für eine tragfähige Antwort.

Im aktuellen Korpus sind es bei EFZ **5** Unterfolien und bei EBA **6** (zusätzlich der
Wissens-Anker). Eine EFZ-Einheit mit drei Herausforderungen kommt damit auf **27 Folien**
(12 + 3 × 5), eine EBA-Einheit mit zwei auf **23** (11 + 2 × 6 — EBA hat keine
Vorwissens-Check-Folie).

Folien mit Unterfolien tragen unten rechts ihre eigene Zahl («↓ 5 Unterfolien»); der Zähler
in der Leiste zeigt beide Achsen zugleich («4 / 12 · 3/5»).

### Mindmap — ein Ast pro Klick

Pro Herausforderung eine Mindmap-Folie. Beim Betreten stehen nur **Zentrum und
Ast-Titel** da; der Inhalt kommt pro Klick:

- **Klick auf einen Ast** klappt genau diesen auf (Reihenfolge frei)
- **Leertaste** klappt den nächsten noch geschlossenen Ast auf; sind alle offen, geht sie
  zur nächsten Folie
- Beim Verlassen und erneuten Betreten startet die Folie wieder zugeklappt

Der Zustand läuft über denselben `BroadcastChannel` wie die Navigation: Was die
Lehrperson aufklappt, klappt im Beamer-Fenster mit auf — auch wenn das Beamer-Fenster
erst mitten in der Folie geöffnet wird (Handshake überträgt Folie **und** Ast-Zustand).

Quelle ist `mindmap_zentrum` + `mindmap_aeste` — inhaltlich identisch mit dem
`[!tafelbild]`-Callout des Begleiters, nur bereits strukturiert. Der als `optional`
markierte Ast wird als Vertiefung für 100 % abgesetzt. Auch die Mindmap ist damit
vollständig generiert.

> Das Aufklappen steckt in `SHELL_CSS`, nicht im geteilten CSS. In der
> HyperFrames-Variante bleiben alle Äste offen — `check` validiert so das Layout im
> Vollausbau, also den ungünstigsten Fall.

> Der Body eines Astes braucht **genau ein** Grid-Kind (`.mm-bi`). Bei mehreren zieht
> `grid-template-rows: 1fr` nur die erste Zeile auf, und der «Vertiefung»-Hinweis bliebe
> als eigene auto-Zeile sichtbar stehen.

### Lösungen, Musterlösung und Vorwissens-Check

Drei optionale Felder. Fehlen sie, entfällt die jeweilige Folie — alles andere bleibt gleich.

| Feld | Wo | Folie |
|---|---|---|
| `leitfragen[].loesung` | Herausforderung | Unterfolie direkt nach den Leitfragen: **die tragfähige Antwort je Leitfrage** |
| `handlungsprodukt.musterloesung` | Herausforderung | letzte Unterfolie: ein **ausgefülltes** Produkt auf Stufe 3–4 |
| `set.vorwissen_check` | Set | Hauptlinie nach der Übersicht |

#### Die beiden Lösungsfolien

Das Deck kennt **zwei verschiedene Lösungen**, und sie beantworten verschiedene Fragen:

- **Lösung der Leitfragen** («So sieht eine tragfähige Antwort aus.») — der Massstab für den
  *Denkweg*. Ein Abschnitt pro Leitfrage, Titel `LF <nr> · <bloom> — <kern>`.
- **Musterlösung** («So könnte es aussehen: <Format>») — der Massstab für das *fertige
  Produkt*, abschnittsweise wie das Produkt selbst.

Beide tragen die Herkunftszeile als Zeitangabe im Kopf — **«Erst nach der eigenen
Bearbeitung»** bzw. **«Erst nach dem eigenen Entwurf»**. Das ist die didaktische Ansage der
Folie und keine Dekoration: Beide Folien sind Abgleich, nicht Vorlage.

`leitfragen[].loesung` hat die Form:

```jsonc
"loesung": {
  "kern": "Fünf Pflichten — meine und die des Betriebs",   // optional, steht im Abschnittstitel
  "zeilen": [
    { "label": "Hauptpflicht", "text": "Ich befolge die Anordnungen …", "quelle": "OR 345" }
  ]
}
```

`label` und `quelle` sind optional; `zeilen` ist das Pflichtfeld — **ohne mindestens eine
Zeile entsteht die Folie nicht.** Gepflegt wird pro Leitfrage: Es reicht, wenn *eine*
Leitfrage eine Lösung hat, dann erscheint die Folie mit genau diesen Abschnitten.

**Stand im Korpus:** alle EFZ-Einheiten führen die Lösung auf **jeder** Herausforderung.
Die beiden EBA-Einheiten (`1.1.1_lehrvertrag_orientieren`, `1.1.2_unterlagen_ordnen`) führen
sie nicht — dort steht an dieser Stelle der Wissens-Anker aus dem Dossier. Musterlösungen
haben **alle** Einheiten auf allen Herausforderungen.

#### Gemeinsame Mechanik

Beide Lösungsfolien rendern über denselben `muster`-Block und sind ein **Akkordeon**: immer
nur ein Abschnitt offen, per Klick oder Leertaste. Das ist kein Stilentscheid — vollständig
aufgeklappt läuft eine komplette Lösung unten aus der Folie (`check` meldet
`canvas_overflow`). Faustregel für neue Inhalte: **max. ~900 Zeichen Text pro Abschnitt**.
Die Mindmap bleibt bewusst mehrfach-offen; alle drei Verhalten teilen sich die
`.reveal`-Mechanik und laufen über denselben `BroadcastChannel` ins Beamer-Fenster.

Die Notizen beider Folien tragen fest verdrahtete Coaching-Sätze mit — bei der
Leitfragen-Lösung «kein Wort-für-Wort-Skript, sondern der Massstab», bei der Musterlösung
«nicht als Vorlage zum Abschreiben zeigen» — plus die `[!erwartungshorizont]`-Callouts der
zugehörigen Begleiter-Sektion.

Die HyperFrames-Kopie klappt genau den **längsten** Abschnitt auf, damit `check` den
realistischen Worst Case misst statt eines Zustands, den niemand sieht.

`musterloesung.hinweis` steht **nur in den Referentennotizen** — er richtet sich an die
Lehrperson und gehört nicht auf die Folie.

Beim Vorwissens-Check sieht die Klasse nur die Fragen; Erwartungshorizont und
«wenn unsicher»-Verweis liegen in den Notizen.

Spezifikation für neue Einheiten: `.claude/skills/bbw-hko-3er-set/` →
`references/json-field-mapping.md` (C7 Musterlösung, C10 Leitfragen-Lösung) sowie
Check 30 (Musterlösung) und Check 32 (Leitfragen-Lösung) in `coherence-checklist.md`.

### Farben

`sit_farbe` / `sit_farbe_light` aus den Herausforderungs-JSONs, pro Folie als
`--acc` / `--acc-dark` / `--acc-soft` inline gesetzt (`--acc-dark` wird aus `sit_farbe`
abgedunkelt — das JSON liefert nur einen *helleren* Mid-Ton). A/B/C färben zusätzlich
ihre Chips auf der Titelfolie, ihre Karten auf der Versprechen-Folie und ihre Badges auf
der Übersicht.

**Austausch & Transfer und Kompetenznachweis haben keine eigene Farbe.** Im Renderer
bekommt ihre `A4Page` `sit={null}` und damit das neutrale Slate `#2C3E50`; `set.json`
und `kn.json` führen kein Farbfeld. Im Deck erben sie deshalb BBW-Tiefgrün `#0E6E3A`,
statt eine dritte Farbwelt aufzumachen.

### Woher der Inhalt kommt

**Folie (was die Klasse sieht)** — ausschliesslich aus den JSONs:
Situationstext, Zahlen-Tabelle und Leitfrage aus `herausforderung_*.json`; Selbstcheck
aus `bewertungsraster[produkt="Handlungsprodukt"].vollstaendig_wenn`; Zielkonflikt aus
`mehrdeutigkeit.hint`; Ankersatz aus `prinzip.json`; Hybrid-Fall, Prüfformen und Raster
aus `kn.json`.

**Notizen (nur die Lehrperson)** — aus den Callouts in `begleiter.md`, zugeordnet über
**Sektionsnummer × Callout-Typ**:

| Folie | Callouts |
|---|---|
| Titel | §0 `hinweis` · §2 `coaching` |
| X-Situation | §X AViVA-Tabelle (Ankommen/Vorwissen) · `hinweis` |
| X-Leitfragen | §X `coaching` · `warnung` · `troubleshooting` |
| X-Leitfragen-Lösung | §X `erwartungshorizont` (+ zwei feste Coaching-Sätze) |
| X-Mindmap | §X `tafelbild` |
| X-Produkt | §X `tafelbild` · `differenzieren` · `mehrdeutigkeit` · `ki_einsatz` |
| X-Musterlösung | `musterloesung.hinweis` · §X `erwartungshorizont` (+ ein fester Coaching-Satz) |
| Austausch / Transfer | §6 / §7 |
| KN | §8, per Stichwortliste auf Prüfform vs. Bewertung verteilt |

> Sektionsnummern sind lehrgangsunabhängig: §3/§4/§5 sind Herausforderung A/B/C, und
> ein EBA-Begleiter ohne C lässt §5 einfach aus. Die Tabelle gilt für beide Lehrgänge.

> **`[!loesung]`-Callouts stehen im Begleiter, aber nie in den Deck-Notizen.**
> `loadEinheit` spiegelt die Leitfragen-Lösungen beim Laden in den Begleiter
> (`src/lib/einheiten/begleiter-loesungen.ts`), damit HTML, Word und ZIP dieselbe Form
> sehen. Der Deck-Parser liest sie also mit — `loesung` fehlt aber bewusst in allen
> `pick()`-Listen von `deck-builder.ts`, weil die Lösung im Deck schon **auf der Folie**
> steht. Ein zweites Mal in den Notizen wäre Lärm. Wer den Typ in eine `pick()`-Liste
> aufnimmt, verdoppelt sie.

> **Nicht auf H3-Überschriften abstützen.** `1.3.1_konsum_verantworten` hat keine
> H3-Struktur — jede Zuordnung über Zwischentitel liefert dort stillschweigend leere
> Notizen. Der Callout-Typ ist das einzige verlässliche Signal.

> Callouts und Tabellen dürfen **eingerückt** in einer Liste stehen (so in §6 von
> 1.3.1). Der Parser toleriert führende Leerzeichen; ohne das fehlen genau dort die
> Notizen.

### EBA

EBA-Einheiten laufen durch **denselben** Generator, ohne Sonderpfad. Möglich ist das,
weil sie dieselben Felder führen wie EFZ-Einheiten und ihr Begleiter die EFZ-Sektions­-
nummern behält — er lässt schlicht Sektion 5 weg (A/B statt A/B/C). `sec(3 + i)` trifft
damit beide Lehrgänge, und die Überschriften-Dialekte (`## 3. …` gegenüber
`## Sektion 3 — …`) deckt der Parser ohnehin ab.

Was EBA **nicht** führt, lässt der Generator weg statt es leer zu rendern:
`zahlen_tabelle` (keine Kachelzeile), `handlungsprodukt.musterloesung` und
`leitfragen[].loesung` (keine Lösungs-Unterfolien). Ein EBA-Deck hat deshalb 19 statt
27 Folien. Das ist eine **Inhalts-**, keine Codelücke: sobald die EBA-Skill diese Felder
mitschreibt, erscheinen die Folien von selbst.

**Nur EBA: das Dossier.** EBA hat kein Lehrmittel, das ganze Fachwissen liegt im
selbst erzeugten `dossier.json` (A2). Es speist vier Stellen, alle still übersprungen,
wenn keine `dossier.json` daneben liegt:

| Wo | Was |
|---|---|
| `X-wissen` (neue Unterfolie zwischen Leitfragen und Mindmap) | die Info-Karten dieser Herausforderung, einzeln aufklappbar, darunter der A2-Wortschatz als Chips |
| `X-produkt` (Notizen) | das Sprachmodus-Scaffold (`sm_id`, Schritt für Schritt) |
| `austausch` (Notizen) | Satzanfänge und Ablauf aus `austausch_scaffolds` |
| `prinzip` | `prinzip_in_einfach` als zweite Karte, `fachsystematik` in den Notizen |

Der Deck-Titel kommt bei EBA aus `dossier.kopf.einheit_titel`: `set.json` führt dort
kein `einheit_titel`, und `modul_titel` ist der **Themen**titel — beide T1-Einheiten
hiessen sonst gleich «Ins Berufsleben einsteigen».

> Die zwei **unnummerierten** H2 am Ende der EBA-Begleiter («Wissens-Dossier (A2)»,
> «Von der Lehrperson bereitzustellen») beenden die laufende Sektion, statt sie
> fortzusetzen. Ohne diesen Schnitt landeten ihre Callouts in den Notizen des
> Kompetenznachweises — die kantonale Kontaktstelle stand dann unter «KN-Formen».

### Zwei Ausgaben, ein Modell

| Datei | Wofür |
|---|---|
| `index.html` | HyperFrames-Komposition — nur zum Prüfen mit `npx hyperframes check` |
| `deck.html` | **Eigenständiges Deck** — was die Plattform ausliefert und was im ZIP landet |

`deck.html` bringt seine eigene Navigation mit (kein iframe, keine externen Skripte).
Grund: Der HyperFrames-Player lädt die Komposition in einem iframe und greift auf dessen
Dokument zu. Über http geht das, aber ein Deck aus dem entpackten ZIP läuft auf `file://`,
wo Chrome jeder Datei einen eigenen Origin gibt und genau dieser Zugriff blockiert ist.

**Beamer** öffnet ein zweites Fenster, das per `BroadcastChannel` mitläuft (über http;
auf `file://` ist der Knopf ausgeblendet, weil die Synchronisation dort nicht trägt).

Das BBW-Logo ist dasselbe wie in den gerenderten Einheiten (`public/logo-bbw-doc.png`).
Es steckt **einmal** als CSS-`background-image`; als `<img src>` pro Folie wäre die
Datei sonst von 220 kB auf knapp 3 MB gewachsen. Die Plattform-Route referenziert den
Pfad, das ZIP bettet die Data-URI ein.

### In der Plattform

- Route `/einheiten/<slug>/deck` — gleiche Gast-Sperre wie das Begleitdokument, plus
  dieselbe Entwurf-Sperre wie die Detailseite (Unterrouten werden direkt per URL
  erreicht und müssen sie selbst ziehen)
- Knopf **🖥️ Präsentation** direkt unter **📖 Lies mich!** in der Workbench
- Im ZIP als `Material_LP/<prefix>_unterrichtsdeck.html`

### Prüfen nach Änderungen am Generator

```bash
npm run build:deck -- --all
cd decks/generated/1.1.1_rechte_verstehen_nutzen && npx hyperframes check .
```

`check` deckt Überlauf ab (Layout-Sampling) — der einzige Fehlermodus, den die
Textlängen-Buckets im Generator nicht schon abfangen. Mindestens **je ein Deck pro
Lehrgang** prüfen (ein EFZ-Deck mit drei Herausforderungen und ein EBA-Deck), weil die
Buckets auf EFZ-Textlängen kalibriert sind.
