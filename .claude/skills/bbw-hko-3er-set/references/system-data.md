> **v2.0 — Auftrag/Dossier-Redesign (2026-06):** Die Spalte **bbw-hko modern (B)** in den Tabellen unten beschreibt teils den Stand VOR dem Redesign. Geaendert in B (`src/components/einheiten/docs/DocS.tsx`, neu `DocAustausch.tsx`, `docx-builder.ts`):
> - **Seite 1 (Cockpit)** traegt jetzt die zusammengefuehrte Herausforderung: `situation_text` + `leitfrage` (+ `mehrdeutigkeit.trade_off` als **Spannungsfeld**, das jetzt gerendert wird) stehen auf Seite 1 statt Seite 2.
> - **Kein** KOMP-Badge, **kein** `emotion_tag`, **kein** Wochenplan, **kein** `zahlen_tabelle` mehr in B. `herausforderung` nur als Label (ohne "Herausforderung X:"-Prefix).
> - `bewertungsraster` → **Checkliste Vollständigkeit** (4 Zeilen: Produkt · Kriterien · ☐; `vollstaendig_wenn`-Bullets; keine Transfer-Zeile). "Quellen" → "Ressourcen".
> - **Mindmap** radial (HTML, 4 Aeste, 4. gestrichelt) bzw. 2×2-Quadrant (DOCX), mit AS-2-Hinweis.
> - **Handlungsprodukt** geteilt: 6a Anleitung (Metadaten Lebensbezug + Sprachmodi · Beschreibung · Schritte · Abgabe · **Gütekriterien** aus `lernfortschritt.kriterien` · **Scaffolding** aus `handlungsprodukt.scaffolding`) + 6b Arbeitsflaeche. `handlungsprodukt.scaffolding` wird also gerendert (nicht mehr "never rendered").
> - **Austausch & Transfer** ist ein eigenstaendiges Set-Dokument (`DocAustausch.tsx` / `buildAustausch`) mit EA/GA/PL-Checkboxen — nicht mehr in DocS Sektion 07. `set.austausch_phase.einzelauftrag` ist neu.
> - Spalte **hko-deploy (A)** und Legacy **(C)** sind unveraendert (out of scope).

## Three rendering systems

There are actually **three** separate renderers across the two repos:

| # | Where | Stack | Purpose |
|---|---|---|---|
| A | `hko-deploy/src/templates/default_4page_v2/` | Vite + React JSX | Web viewer — interactive, screen-optimized, 4 fixed pages |
| B | `bbw-hko/src/components/einheiten/docs/` | TypeScript React | Print/ZIP — A4-optimized, variable page count |
| C | `bbw-hko/renderer/` | Plain JS + global React | Legacy — functionally identical to B, no longer maintained |

B and C are nearly identical. The real gap is **A vs B**.

---

## `sit_*.json` — Page-by-page field differences

### Page 1

| Field | hko-deploy (A) | bbw-hko modern (B) |
|---|---|---|
| `modul` + `modul_titel` | Chip top-left | — (modul_titel shown in cockpit sub-heading) |
| `herausforderung.buchstabe` | "Herausforderung {buchstabe}" chip | "Herausforderung A — {label}" line |
| `wochen_plan.length` | "Woche 1–{n}" chip | — |
| `wissensknoten[]` | Monospace line below title (`→ wissen/node1 | node2`) | — |
| `nrlp.gesellschaft[].aspekt` | Same monospace line as chips | — |
| `nrlp.sk[]` | Same monospace line as `SK 1 + SK 6` | — |
| `nrlp.nr` | — | "Kompetenz {nr}" outline badge |
| `emotion_tag` | Small colored tag next to "Deine Herausforderung" header | Badge next to "Herausforderung A" |
| QR code | Yes (`id` → QRCodeBlock) | No |
| NexusButton | Yes | No |
| Name / Klasse fields | Yes (editable in header) | No |
| Persona card | No (persona appears inside situation block) | Yes — dedicated card: beruf (bold), betrieb+ort (muted) |
| Handlungsprodukt card | No | Yes — format (bold), titel (muted) |
| `situation_text` | **On page 1**, inside colored situation box | On page 2 |
| `zahlen_tabelle` | On page 1, inside situation box | On page 2 |
| `leitfrage` | On page 1 as `→ {leitfrage}` italic | On page 2 as `.leitfrage-callout` div |
| `mehrdeutigkeit.trade_off` | On page 1: `"Offene Frage: {trade_off}"` muted italic with left border | **Not rendered** in DocS.tsx at all |
| `bewertungsraster` | Table with Dekontext row muted/italic if `abgabe` includes "Set-Aufgabe" | Table, all rows styled equally |
| Niveaubänder | **Hardcoded** 3-band row on page 1 (text: "Grundanforderungen nicht erreicht / erreicht / Vertiefung abgeschlossen") | Not on page 1 — only in DocKnS rubrik page |
| `wochen_plan[]` | Grid of week boxes; `aktiv: true` → highlighted border+bg | Table with "Woche N" prefix stripped from label; `aktiv` field **ignored** |
| `quellen_anker` | — | `<ul>` list with `ref · titel · seiten` |

### Page 2

| | hko-deploy (A) | bbw-hko info mode (B) | bbw-hko fill mode (B) |
|---|---|---|---|
| Content | Leitfragen + Mindmap together | Herausforderung text + all Leitfragen | Herausforderung text only |
| `situation_text` | On page 1 | Here | Here |
| `leitfragen_intro` | Colored callout box (sit-light bg, left border) | Plain small italic text | Plain small italic text |
| LF number style | Colored circle (●) | Monospace `LF{n}` prefix | Monospace `LF{n}` prefix |
| `lf.bloom` | Small monospace chip | Badge (outline) | Badge (outline) |
| `lf.knoten_ref` | Monospace span, plain | `source-ref` span | `source-ref` span |
| Writing fields | Always present (`feld_hoehe_mm`, min 12mm) | None | 55mm fixed per LF (2 LF per page) |
| `mindmap_zentrum` | On page 2, right-draw zone with left-rail legend | On page 3 | On separate page (skeleton) |
| Mindmap ast `punkte` | Shown in left-rail legend | Shown as `<ul>` (info) | Not shown (skeleton) |

### Page 3

| | hko-deploy (A) | bbw-hko info (B) | bbw-hko fill (B) |
|---|---|---|---|
| Content | Handlungsprodukt | Mindmap (full) + Handlungsprodukt | Mindmap skeleton |
| `handlungsprodukt.format` | On page 3 (need to read — likely similar) | `<Badge>` outline | `<Badge>` outline |
| `handlungsprodukt.schritte` | On page 3 | `<ol>` with label+hint | `<ol>` with label+hint + `HandlungsFlaeche` |
| `scaffolding.leicht/stark` | Optional sidebar on page 2 (for LF hints, Satzanfänge, Vokabular) | **Never rendered** | **Never rendered** |

### Page 4

| | hko-deploy (A) | bbw-hko (B) |
|---|---|---|
| Content | Reflexion | Info: Reflexion + Austausch · Fill: Austausch only (Reflexion is on its own page) |
| `reflexion_fragen[].nr` | Colored square badge | Monospace prefix |
| `reflexion_fragen[].sub` | Not rendered | Rendered as muted italic |
| Writing field height | `max(15, feld_hoehe_mm + 5)mm` | 35mm fixed (fill mode) |
| `prinzip_handoff.kn_aktivierung` | **Rendered** — box "WORAUF BEREITET DIESE LERNAUFGABE VOR?" | **Not rendered** anywhere in DocS or DocKnS |
| `wochen_plan[]` week strip | Repeated with last week highlighted | Not shown |
| Austausch + Dekontext | **Not on page 4** — set.json handled by a separate DreiSetTemplate | Rendered inline in section 07 |

---

## `kn.json` rendering differences

hko-deploy has a dedicated **DreiKnTemplate** (separate document for the KN). bbw-hko merges it into **DocKnS** (student) + **DocKnLp** (teacher).

| Aspect | hko-deploy DreiKn | bbw-hko DocKnS + DocKnLp |
|---|---|---|
| Documents | Single template, 1 view | Two separate docs: student + teacher |
| `dominanter_aspekt` | Likely in cover | DocKnLp page 1 badge |
| `mehrdeutigkeits_pflicht` | Likely in cover | DocKnLp page 1 italic sub-heading |
| `prinzip.herausforderungen` | Likely in a context block | DocKnLp page 1: 3-column card grid |
| `prinzip.zirkularitaet` | Unknown | DocKnLp page 1: 3-column R1/R2/R3 cards |
| `set.konzept_progression` | DreiSetTemplate | DocKnLp page 1: `# | Konzept` table |
| `alignment_note.herausforderungen_mapping` | DreiKn page | DocKnLp section 05: `Herausforderung | Szenen-Element` table |
| `rubrik_shared.kriterien[].stufen` | DreiKnRubrikPage | DocKnLp: full 4×4 grid with checkboxes · DocKnS: criteria+dimension table only |
| `optional_praesentation` | Unknown | DocKnLp: muted italic "Optional:" line |
| `k_stufe` badge per question | Unknown | DocKnLp only (badge `K{n}`); not shown in DocKnS |

---

## `set.json` rendering

| | hko-deploy | bbw-hko |
|---|---|---|
| Renderer | Dedicated **DreiSetTemplate** (2 pages) | Embedded in DocS section 07 |
| `konzept_progression[].konzept` | DreiSet page | DocKnLp section 03 |
| Jigsaw Runden | DreiSet page | DocS section 07 |
| Transfer-Aufgabe | DreiSet page | DocS section 07 + `sit.dekontextualisierung.frage` line |

---

## Fields rendered in one repo but not the other

**Only in hko-deploy (A):**
- `wissensknoten[]` — visible as monospace "→ wissen/..." navigation tag
- `nrlp.gesellschaft[].aspekt` — page 1 chip line
- `nrlp.sk[]` — page 1 chip line
- `wochen_plan[].aktiv` — week strip highlighting
- `prinzip_handoff.kn_aktivierung` — page 4 box
- `scaffolding.leicht/stark` — optional sidebar with per-LF hints and Satzanfänge
- QR code / NexusButton
- Name/Klasse inline fields

**Only in bbw-hko (B):**
- `quellen_anker` — sources list on page 1
- `reflexion_fragen[].sub` — sub-question text
- `prinzip.zirkularitaet` — rendered in DocKnLp
- `rubrik_shared.kriterien[].stufen[]` — full 4×4 grid in DocKnLp (hko-deploy has it in DreiKnRubrikPage but fields unknown)
- `kn_typen[].optional_praesentation` — rendered in DocKnLp

**`mehrdeutigkeit.trade_off`** — rendered in hko-deploy (page 1 "Offene Frage"), in legacy renderer (`.tradeoff-callout`), in docx-builder ("SPANNUNGSFELD" callout) — **but missing from DocS.tsx**. This is a gap in the modern bbw-hko HTML renderer.
