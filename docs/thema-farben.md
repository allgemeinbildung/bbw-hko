# Thema-Farben (nRLP-Identitätsfarben)

Jedes ABU-Thema (T1–T8) hat eine eigene Identitätsfarbe. Ursprünglich 1:1 aus den
offiziellen Schullehrplan-PDFs extrahiert (Pascal Rusch, 10.06.2026), am
01.09.2026 von Christof anhand des offiziellen CD-Blatts "Kanton ZH" korrigiert
und bestätigt — die PDF-Extraktion hatte bei T2–T8 teils falsche/eigene
Farbtöne statt der amtlichen CI-Farben ergeben (z.B. T5 EFZ `#033E80` statt
korrekt Grün ZH `#3EA743`). Alle Werte unten stimmen exakt mit dem CD-Blatt.

**Wichtig:** Die Farbe hängt von **(Lehrgang, `thema_nr`)** ab, nicht nur von der
Nummer:

- **EFZ 3-jährig und 4-jährig** verwenden exakt dieselbe Palette (Default unten).
- **EBA 2-jährig** verwendet **dieselben acht ZH-Farben, aber andere Themen und
  eine andere Zuordnung**: nur T1 stimmt mit EFZ überein, T2–T8 sind jeweils
  individuell anders belegt.

## Palette — EFZ 3-/4-jährig (Default)

| Thema | Titel | Farbe (ZH) | Hex | Textfarbe (Ink) |
|------:|-------|:-----:|-----|------|
| T1 | Ins Berufsleben einsteigen | Cyan ZH | `#009EE0` | schwarz |
| T2 | Meinungen bilden und mitgestalten | Violett ZH | `#885EA0` | weiss |
| T3 | Bewusst konsumieren und handeln | Gelb ZH | `#FFCC00` | schwarz |
| T4 | Verantwortung für mich und andere übernehmen | Orange ZH | `#EB690B` | schwarz |
| T5 | Mich im Staat orientieren | Grün ZH | `#3EA743` | schwarz |
| T6 | Mein eigenes Zuhause | Magenta ZH | `#EC008C` | schwarz |
| T7 | Schlussarbeit | Türkis ZH | `#00A1A3` | schwarz |
| T8 | Arbeiten in der Zukunft | Blau ZH | `#0076BD` | weiss |

Die **Ink-Spalte** ist die Textfarbe, die auf der jeweiligen Themenfläche den
besseren WCAG-Kontrast liefert (alle Kombinationen erreichen mind. AA / ≥ 4.5:1).
Schwarz für die helleren Töne (T1, T3–T7), weiss für die dunkleren (T2, T8).
Rot ZH (`#E2001A`) und Grau ZH (`#9D9D9D`) sind in keiner der beiden Paletten
vergeben.

## Palette — EBA 2-jährig

| Thema | Titel | Farbe (ZH) | Hex | Ink | = EFZ |
|------:|-------|:-----:|-----|------|-------|
| T1 | Ins Berufsleben einsteigen | Cyan ZH | `#009EE0` | schwarz | = EFZ T1 |
| T2 | Bewusst konsumieren und handeln | Gelb ZH | `#FFCC00` | schwarz | (EFZ T3) |
| T3 | Sicherheit und Gesundheit | Orange ZH | `#EB690B` | schwarz | (EFZ T4) |
| T4 | Medien und digitale Welt | Grün ZH | `#3EA743` | schwarz | (EFZ T5) |
| T5 | Meinung bilden und mitgestalten | Violett ZH | `#885EA0` | weiss | (EFZ T2) |
| T6 | Verträge verstehen – fair handeln | Magenta ZH | `#EC008C` | schwarz | (EFZ T6) |
| T7 | Arbeit und Zukunft | Blau ZH | `#0076BD` | weiss | (EFZ T8) |
| T8 | Kultur und Kunst | Türkis ZH | `#00A1A3` | schwarz | (EFZ T7) |

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

Vier gespiegelte Quellen, alle mit denselben Werten:

1. **CSS** — `src/layouts/Base.astro` (global, `:root`):
   - Custom Properties `--thema-1 … --thema-8` und `--thema-N-ink`.
   - `[data-thema="N"]` setzt die lokalen Variablen `--tc` (Fläche) und
     `--tc-ink` (Text). Ein Vorfahr (oder dasselbe Element) mit
     `data-lehrgang="EBA"` mappt T2–T8 auf die EBA-Reihenfolge um.
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
3. **`public/nrlp/prompt-builder/render.js`** — eigene `THEMA_COLORS`-Konstante
   (EFZ-Werte, keine EBA-Variante), fürs clientseitige Rendering des
   Prompt-Builder-Tools ausserhalb der Astro-App.
4. **`public/nrlp/modules/config.js`** — dieselbe `THEMA_COLORS`-Konstante
   (EFZ-Werte, keine EBA-Variante) für die anderen nRLP-Module unter `public/nrlp/`.

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
   des Excel-Exports (`pages/jahresplanung.astro`) **und** in den beiden Mirrors
   `public/nrlp/prompt-builder/render.js` + `public/nrlp/modules/config.js`
   anpassen — alle fünf Stellen müssen übereinstimmen.
2. Kontrast prüfen: Ink schwarz/weiss so wählen, dass ≥ 4.5:1 erreicht wird.
3. `npm run build` laufen lassen.

## Quelle

Ursprünglich `raw/emails/2026-06-10_pascal-rusch_slp-abu-genehmigung-schlussbericht.md`
(LifeOS-Archiv) → Anhänge `…_2_EFZ_3jaehrig.pdf` und `…_3_EFZ_4jaehrig.pdf`,
Farben extrahiert aus den Thementiteln der jeweiligen Übersichtsseite.

**Korrigiert und verbindlich bestätigt von Christof am 01.09.2026** anhand des
offiziellen CD-Blatts "Kanton ZH" (10 Referenzfarben Cyan/Blau/Violett/Magenta/
Rot/Orange/Gelb/Türkis/Grün/Grau ZH, mit Hex + CMYK). Die PDF-Extraktion hatte
bei T2–T8 (EFZ) bzw. T2–T8 (EBA, ausser T1/T8) von den amtlichen CI-Hexwerten
abweichende Töne ergeben (u.a. T5 EFZ `#033E80` statt `#3EA743`, T7 EFZ `#007B7A`
statt `#00A1A3`) — Christofs Tabelle liefert die exakte (Lehrgang, thema_nr) →
ZH-Farbe-Zuordnung, siehe Paletten oben. Rot ZH und Grau ZH bleiben unbelegt.
