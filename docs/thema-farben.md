# Thema-Farben (nRLP-Identitätsfarben)

Jedes ABU-Thema (T1–T8) hat eine eigene Identitätsfarbe. Die Werte stammen
**1:1 aus den offiziellen Schullehrplan-PDFs** (zugestellt von Pascal Rusch am
10.06.2026, Bildungsratsbeschluss 09.06.2026) — konkret aus den farbigen
Thementiteln auf der Übersichtsseite jedes PDFs.

**Wichtig:** Die Farbe hängt von **(Lehrgang, `thema_nr`)** ab, nicht nur von der
Nummer:

- **EFZ 3-jährig und 4-jährig** verwenden exakt dieselbe Palette (Default unten).
- **EBA 2-jährig** verwendet **dieselben acht Farben, aber andere Themen und eine
  andere Zuordnung**: T1/T7/T8 stimmen mit EFZ überein, T2–T6 sind anders belegt.

## Palette — EFZ 3-/4-jährig (Default)

| Thema | Titel | Farbe | Hex | Textfarbe (Ink) |
|------:|-------|:-----:|-----|------|
| T1 | Ins Berufsleben einsteigen | 🟦 | `#009EE0` | schwarz |
| T2 | Meinungen bilden und mitgestalten | 🟥 | `#EC008C` | schwarz |
| T3 | Bewusst konsumieren und handeln | 🟧 | `#EB690B` | schwarz |
| T4 | Verantwortung für mich und andere übernehmen | 🟩 | `#3EA743` | schwarz |
| T5 | Mich im Staat orientieren | 🟦 | `#033E80` | weiss |
| T6 | Mein eigenes Zuhause | 🟪 | `#885EA0` | weiss |
| T7 | Schlussarbeit | 🟦 | `#007B7A` | weiss |
| T8 | Arbeiten in der Zukunft | 🟦 | `#00A1A3` | schwarz |

Die **Ink-Spalte** ist die Textfarbe, die auf der jeweiligen Themenfläche den
besseren WCAG-Kontrast liefert (alle Kombinationen erreichen mind. AA / ≥ 4.5:1).
Schwarz für die helleren Töne (T1–T4, T8), weiss für die dunkleren (T5–T7).

## Palette — EBA 2-jährig

| Thema | Titel | Farbe | Hex | Ink | = EFZ |
|------:|-------|:-----:|-----|------|-------|
| T1 | Ins Berufsleben einsteigen | 🟦 | `#009EE0` | schwarz | = EFZ T1 |
| T2 | Bewusst konsumieren und handeln | 🟧 | `#EB690B` | schwarz | (EFZ T3) |
| T3 | Sicherheit und Gesundheit | 🟩 | `#3EA743` | schwarz | (EFZ T4) |
| T4 | Medien und digitale Welt | 🟪 | `#885EA0` | weiss | (EFZ T6) |
| T5 | Meinung bilden und mitgestalten | 🟥 | `#EC008C` | schwarz | (EFZ T2) |
| T6 | Verträge verstehen – fair handeln | 🟦 | `#033E80` | weiss | (EFZ T5) |
| T7 | Arbeit und Zukunft | 🟦 | `#007B7A` | weiss | = EFZ T7 |
| T8 | Kultur und Kunst | 🟦 | `#00A1A3` | schwarz | = EFZ T8 |

> EBA ist als Curriculum-Datensatz noch nicht publiziert (`getNrlp('EBA')` → null,
> Fallback auf EFZ-3J). Damit die Übersichts-/Detail-/Wochen-Ansichten im
> Fallback nicht EBA-Farben auf EFZ-Titel zeigen, setzen diese Seiten
> `data-lehrgang` nur dann auf `EBA`, wenn echte EBA-Daten geladen sind
> (`getNrlp(lehrgang) ? lehrgang : 'EFZ-3J'`). Einheiten-/Material-Karten tragen
> ihre eigene `thema_nr` pro Lehrgang und sind sofort korrekt.

## Designentscheid: bewusste Ausnahme zur «Single-Green»-Regel

Die Plattform folgt sonst der Regel **ein grüner Akzent + Schwarz/Weiss** (siehe
`CLAUDE.md` › Design system / branding): Grün ist die einzige Chrome-Farbe, und
es gibt *keine* Pro-Workflow-Farben. Die Thema-Farben sind die **einzige
bewusste Ausnahme** davon. Begründung:

- Sie sind **keine** dekorative Einfärbung, sondern eine **fachliche
  Kodierung**: dieselbe Farbe, die Lehrpersonen aus dem offiziellen nRLP-PDF
  kennen. Das verankert die Plattform im amtlichen Lehrplan statt eine eigene
  Bildsprache zu erfinden.
- Sie sind auf das **Thema** beschränkt — nicht auf Workflows (Material /
  Situationen / Einheiten bleiben farblich neutral) und nicht auf Status-Badges
  (die ihre dokumentierte Zustandsfarbigkeit behalten).

Früher war die Themen-Einfärbung eine **positionsbasierte Grün-Rotation** (1./2./
3. Thema des Jahres → hell/mittel/dunkelgrün). Diese ist vollständig ersetzt:
gefärbt wird jetzt nach echter `thema_nr`, nicht nach Position im Jahr.

## Architektur (Single Source of Truth)

Zwei gespiegelte Quellen, beide mit denselben Werten:

1. **CSS** — `src/layouts/Base.astro` (global, `:root`):
   - Custom Properties `--thema-1 … --thema-8` und `--thema-N-ink`.
   - `[data-thema="N"]` setzt die lokalen Variablen `--tc` (Fläche) und
     `--tc-ink` (Text). Ein Vorfahr (oder dasselbe Element) mit
     `data-lehrgang="EBA"` mappt T2–T6 auf die EBA-Reihenfolge um.
   - Utility-Klassen, die `--tc` konsumieren:
     - `.thema-fill` — Fläche + Text (volle Einfärbung; Kalenderzellen, Karten-Blöcke, SK-Spirale)
     - `.thema-top` — `border-top-color` (Themen-Detail-Hero, Themen-Karten)
     - `.thema-left` — `border-left-color` (Lebensbezug-Karten)
     - `.thema-chip` — kleines Pill-Badge «T*N*» (Katalog-/Material-Karten)
     - `.thema-soft` — heller Tint + farbiger Text
     - `.thema-ink` / `.thema-dot` — Textfarbe / Punkt
   - Fallback ohne `data-thema` ist immer Brand-Grün.

2. **TypeScript** — `src/lib/thema-colors.ts`:
   - `THEMA_COLORS` + `THEMA_COLORS_EBA` (Records), `themaPalette(lehrgang)`,
     `themaColor(nr, lehrgang?)`, und `themaHexBare(nr, lehrgang?)` /
     `themaInkBare(nr, lehrgang?)` für Stellen, die den rohen Hex-Wert brauchen
     (z.B. der Excel-Export in `jahresplanung.astro`, der eine eigene
     `THEMA_HEX`-Konstante mit denselben EFZ-Werten führt).

**Verwendung:** Element bekommt `data-thema={nr}` plus eine Utility-Klasse,
z.B. `<span class="thema-chip" data-thema={e.thema_nr}>T{e.thema_nr}</span>`.
Für EBA zusätzlich `data-lehrgang="EBA"` am Element oder einem Vorfahren.

## Wo Themen eingefärbt sind

| Ort | Datei | Element |
|-----|-------|---------|
| Wochenplanung — Kalenderzellen | `pages/jahresplanung.astro` | Lehrzelle (`.thema-fill`) |
| Wochenplanung — Legende & Themen-Karten | `pages/jahresplanung.astro` | Swatch + Karten-Top-Border |
| Wochenplanung — Tooltip-Badge | `pages/jahresplanung.astro` | `.tip-badge` |
| Wochenplanung — Excel-Export | `pages/jahresplanung.astro` | Zellfüllung (`THEMA_HEX`) |
| Gesamtübersicht — Curriculum-Blöcke | `pages/jahresplanung/uebersicht.astro` | `.ueb-block` |
| Gesamtübersicht — SK-Spirale | `pages/jahresplanung/uebersicht.astro` | Zelle = Spalten-Thema (R-Stufe im Text) |
| Themen-Detail — Hero + Lebensbezug-Kanten + LB-Badge | `pages/jahresplanung/thema/[nr].astro` | `.thema-top` / `.thema-left` / `--tc` |
| Einheiten-Katalog — Karten | `pages/einheiten/index.astro` | `.thema-chip` |
| Situationen-Katalog — Set-Kopf | `pages/situationen/index.astro` | `.thema-chip` |
| Material-Karten (KT1/LP) | `components/MaterialCard.astro` | `.thema-chip` |

**Bewusst nicht eingefärbt:** Die Thema-Filter sind native `<select>`-Dropdowns
(`FilterBar.astro`, `SituationenFilterBar.astro`); `<option>`-Hintergründe lassen
sich browserübergreifend nicht zuverlässig stylen, deshalb tragen dort nur die
Ergebnis-Karten die Farbe. Situationen-Buchstaben (A–E, `sit_farbe`) und
Status-Badges bleiben unverändert — sie kodieren etwas anderes als Thema-Identität.

## Eine Farbe ändern

1. Wert in `src/layouts/Base.astro` (`--thema-N` / `--thema-N-ink`, plus den
   `[data-lehrgang="EBA"]`-Überschreibungen) **und** in `src/lib/thema-colors.ts`
   (`THEMA_COLORS` bzw. `THEMA_COLORS_EBA`) **und** in der `THEMA_HEX`-Konstante
   des Excel-Exports (`pages/jahresplanung.astro`) anpassen — alle müssen
   übereinstimmen.
2. Kontrast prüfen: Ink schwarz/weiss so wählen, dass ≥ 4.5:1 erreicht wird.
3. `npm run build` laufen lassen.

## Quelle

`raw/emails/2026-06-10_pascal-rusch_slp-abu-genehmigung-schlussbericht.md`
(LifeOS-Archiv) → Anhänge `…_2_EFZ_3jaehrig.pdf` und `…_3_EFZ_4jaehrig.pdf`.
Farben extrahiert aus den Thementiteln der jeweiligen Übersichtsseite.
