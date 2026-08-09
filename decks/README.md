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
Aktuell **nur EFZ** (3J und 4J) — EBA hat eine andere Logik und folgt separat; der
Generator überspringt EBA-Einheiten still.

### Aufbau — zwei Achsen, keine Wochen

Das Deck nennt **keine Wochen**. Es taugt damit gleichermassen als Überblick und als
Präsentation; wie die Herausforderungen auf Lektionen verteilt werden, entscheidet die
Lehrperson (Begleiter Kap. 2).

```
→  Titel · Versprechen · Übersicht · A · B · C · Austausch · Prinzip · Transfer · KN-Fall · KN-Formen · Bewertung
↓                                    └── Leitfragen · Mindmap · Handlungsprodukt (je Herausforderung)
```

- **→ / ←** Hauptlinie (12 Folien) — die Herausforderung auf einer Folie
- **↓ / ↑** Unterfolien der aktuellen Herausforderung (je 3)
- **Leertaste** läuft beides in Lesereihenfolge durch (alle 21 Folien)
- **N** Notizen · **F** Vollbild · **Beamer** zweites Fenster

Folien mit Unterfolien tragen unten rechts einen Hinweis («↓ 3 Unterfolien»).

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

### Musterlösung und Vorwissens-Check

Zwei optionale Felder. Fehlen sie, entfällt die jeweilige Folie — alles andere bleibt gleich.

| Feld | Wo | Folie |
|---|---|---|
| `handlungsprodukt.musterloesung` | Herausforderung | letzte Unterfolie: ein **ausgefülltes** Produkt auf Stufe 3–4 |
| `set.vorwissen_check` | Set | Hauptlinie nach der Übersicht |

Die Musterlösung ist ein **Akkordeon**: immer nur ein Abschnitt offen, per Klick oder
Leertaste. Das ist kein Stilentscheid — vollständig aufgeklappt läuft eine komplette
Musterlösung unten aus der Folie (`check` meldet `canvas_overflow`). Faustregel für neue
Inhalte: **max. ~900 Zeichen Text pro Abschnitt**. Die Mindmap bleibt bewusst
mehrfach-offen; beide Verhalten teilen sich die `.reveal`-Mechanik.

Die HyperFrames-Kopie klappt genau den **längsten** Abschnitt auf, damit `check` den
realistischen Worst Case misst statt eines Zustands, den niemand sieht.

`musterloesung.hinweis` steht **nur in den Referentennotizen** — er richtet sich an die
Lehrperson und gehört nicht auf die Folie.

Beim Vorwissens-Check sieht die Klasse nur die Fragen; Erwartungshorizont und
«wenn unsicher»-Verweis liegen in den Notizen.

Spezifikation für neue Einheiten: `.claude/skills/bbw-hko-3er-set/` →
`references/json-field-mapping.md` (C7) und Check 30 in `coherence-checklist.md`.

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
| X-Mindmap | §X `tafelbild` |
| X-Produkt | §X `tafelbild` · `differenzieren` · `mehrdeutigkeit` · `ki_einsatz` |
| Austausch / Transfer | §6 / §7 |
| KN | §8, per Stichwortliste auf Prüfform vs. Bewertung verteilt |

> **Nicht auf H3-Überschriften abstützen.** `1.3.1_konsum_verantworten` hat keine
> H3-Struktur — jede Zuordnung über Zwischentitel liefert dort stillschweigend leere
> Notizen. Der Callout-Typ ist das einzige verlässliche Signal.

> Callouts und Tabellen dürfen **eingerückt** in einer Liste stehen (so in §6 von
> 1.3.1). Der Parser toleriert führende Leerzeichen; ohne das fehlen genau dort die
> Notizen.

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

- Route `/einheiten/<slug>/deck` — gleiche Gast-Sperre wie das Begleitdokument
- Knopf **🖥️ Präsentation** direkt unter **📖 Lies mich!** in der Workbench
- Im ZIP als `Material_LP/<prefix>_unterrichtsdeck.html`

### Prüfen nach Änderungen am Generator

```bash
npm run build:deck -- --all
cd decks/generated/1.1.1_rechte_verstehen_nutzen && npx hyperframes check .
```

`check` deckt Überlauf ab (Layout-Sampling) — der einzige Fehlermodus, den die
Textlängen-Buckets im Generator nicht schon abfangen.
