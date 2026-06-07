# Handoff: Terminology Rename — Facetten/Situationen → Herausforderungen

**Target repo:** `bbw-hko`  
**Skill repo:** `hko-deploy/.claude/skills/hko-3er-set-generator`  
**Author:** Pietro (via Cowork analysis)  
**Date:** 2026-06-07

---

## Goal

Rename all legacy field names, filenames, TypeScript identifiers, CSS classes, and skill instructions that use the old `sub_facette`/`subfacetten`/`situation`/`sit_A` vocabulary to the new canonical `herausforderung`/`herausforderungen`/`buchstabe`/`hf_A` vocabulary.

The visible UI already says "Herausforderung" everywhere. This rename makes the internal data model consistent with the display layer.

---

## CRITICAL: What NOT to touch

The following use "Situation/Situationen" with a completely different meaning and must NOT be modified:

- `src/lib/situationen.ts` — the separate `/situationen` catalog workflow
- `src/pages/situationen/**` — catalog pages and routes
- `src/data/situationen/**` — individual Lernsituationen JSON files
- `src/data/situationen.index.json` — catalog index
- `scripts/sync-situationen.mjs` — catalog build script
- `src/components/IntakeForm.astro` — field `herausforderung_text` is a materials DB column, unrelated
- `src/components/FilterBar.astro` — `value="herausforderung"` is a material type option, unrelated
- `supabase/schema.sql` — `herausforderung_text` is a materials DB column, unrelated
- The word "Lernsituation" anywhere in prose (pedagogical term per nRLP — intentionally kept per SKILL.md)
- `sit_farbe`, `sit_farbe_light`, `sit_farbe_mid` — internal CSS variable names, leave as-is
- `SituationIndexEntry` in `situationen.ts` — this is the catalog type, not the Einheiten type

**Scope:** only touch files under `src/lib/einheiten/`, `src/components/einheiten/`, `src/data/einheiten/`, `src/pages/einheiten/`, `src/styles/einheiten-renderer.css`, `scripts/build-einheiten-index.mjs`, the skill files, and the legacy `renderer/` folder.

---

## Complete Rename Mapping

### Family 1 — Facetten family

| Old | New |
|-----|-----|
| JSON key `sub_facette` (top-level in sit_*.json) | `herausforderung` |
| JSON key `sub_facetten` (top-level in prinzip.json) | `herausforderungen` |
| JSON field `"facette": "…"` (inside each herausforderungen entry) | `"herausforderung": "…"` |
| JSON key `subfacetten_mapping` (in kn.json alignment_note) | `herausforderungen_mapping` |
| JSON field `sit_letter` (within herausforderungen_mapping entries) | `hf_letter` |
| JSON key `must_combine_subfacetten` (in prinzip.json hybrid_situation_spec) | `must_combine_herausforderungen` |
| TypeScript `interface SubFacette` | `interface SubHerausforderung` |
| TypeScript field `sub_facette?: SubFacette` on `SituationJson` | `herausforderung?: SubHerausforderung` |
| TypeScript field `sub_facetten?: Record<string, { facette: string; … }>` on `PrinzipJson` | `herausforderungen?: Record<string, { herausforderung: string; … }>` |
| TypeScript field `subfacetten_mapping?: { sit_letter: string; … }[]` on `KnJson` | `herausforderungen_mapping?: { hf_letter: string; … }[]` |
| TypeScript field `must_combine_subfacetten?: string[]` on `PrinzipJson.hybrid_situation_spec` | `must_combine_herausforderungen?: string[]` |
| CSS class `.subfacette` | `.herausforderung` |

### Family 2 — Sit/Situation family (Einheiten-scoped only)

| Old | New |
|-----|-----|
| Filename `sit_A.json` | `herausforderung_A.json` |
| Filename `sit_B.json` | `herausforderung_B.json` |
| Filename `sit_C.json` | `herausforderung_C.json` |
| JSON field `"situation": "A"` (letter field in SituationJson) | `"buchstabe": "A"` |
| JSON field `"situationen": […]` (in set.json) | `"herausforderungen": […]` |
| JSON field `konzept_progression[].situation` (in set.json) | `konzept_progression[].herausforderung` |
| ID values `…_sit_A`, `…_sit_B`, `…_sit_C` (in sit JSON id fields and set.json ID references) | `…_hf_A`, `…_hf_B`, `…_hf_C` |
| TypeScript `SituationJson.situation: 'A' \| 'B' \| 'C'` | `SituationJson.buchstabe: 'A' \| 'B' \| 'C'` |
| TypeScript `SetJson.situationen?: string[]` | `SetJson.herausforderungen?: string[]` |
| TypeScript `SetJson.konzept_progression[].situation?` | `SetJson.konzept_progression[].herausforderung?` |
| TypeScript `EinheitFullSet.sit_A` | `EinheitFullSet.hf_A` |
| TypeScript `EinheitFullSet.sit_B` | `EinheitFullSet.hf_B` |
| TypeScript `EinheitFullSet.sit_C` | `EinheitFullSet.hf_C` |
| TypeScript `EinheitIndexEntry.situationen` | `EinheitIndexEntry.herausforderungen` |
| TypeScript `EinheitIndexEntry.sit_titel` | `EinheitIndexEntry.hf_titel` |

---

## Implementation Order

Execute strictly in this order. TypeScript types must come first so the compiler catches every missed usage after each subsequent file edit.

1. `src/lib/einheiten/types.ts`
2. JSON data files in `src/data/einheiten/` (rename + edit)
3. `scripts/build-einheiten-index.mjs`
4. `src/lib/einheiten/index.ts`
5. `src/lib/einheiten/docx-builder.ts`
6. `src/components/einheiten/docs/DocS.tsx`
7. `src/components/einheiten/docs/DocKnLp.tsx`
8. `src/components/einheiten/docs/DocAustausch.tsx`
9. `src/components/einheiten/EinheitWorkbench.tsx`
10. `src/pages/einheiten/index.astro`
11. `src/styles/einheiten-renderer.css`
12. Skill: `assets/prinzip-template.json`
13. Skill: `assets/mission-template.json`
14. Skill: `assets/kn-template.json`
15. Skill: `references/*.md` (6 files)
16. Skill: `SKILL.md`
17. Legacy: `renderer/` JSX files + JSON files
18. Prose: `begleiter.md` files

After step 2 (data files), run `npm run build:einheiten-index` to regenerate `src/data/einheiten.index.json`.
After all steps, run `npm run build` and confirm zero TypeScript errors.

---

## Step-by-Step File Changes

---

### 1. `src/lib/einheiten/types.ts`

**Line 12–15** — rename interface and keep field names:
```typescript
// OLD
export interface SubFacette {
  buchstabe?: string
  label?: string
}

// NEW
export interface SubHerausforderung {
  buchstabe?: string
  label?: string
}
```

**Line 38** — rename letter field on `SituationJson`:
```typescript
// OLD
  situation: 'A' | 'B' | 'C'

// NEW
  buchstabe: 'A' | 'B' | 'C'
```

**Line 46** — rename sub_facette field on `SituationJson`:
```typescript
// OLD
  sub_facette?: SubFacette

// NEW
  herausforderung?: SubHerausforderung
```

**Lines 93–94** — rename situationen and konzept_progression.situation on `SetJson`:
```typescript
// OLD
  situationen?: string[]
  konzept_progression?: { position: number | string; situation?: string; konzept: string }[]

// NEW
  herausforderungen?: string[]
  konzept_progression?: { position: number | string; herausforderung?: string; konzept: string }[]
```

**Line 146** — rename subfacetten_mapping and sit_letter on `KnJson.hybrid_situation.alignment_note`:
```typescript
// OLD
      subfacetten_mapping?: { sit_letter: string; scene_element: string }[]

// NEW
      herausforderungen_mapping?: { hf_letter: string; scene_element: string }[]
```

**Line 164** — rename sub_facetten and facette field on `PrinzipJson`:
```typescript
// OLD
  sub_facetten?: Record<string, { facette: string; konfliktart: string; handlungsprodukt_typ?: string; transferrable?: boolean }>

// NEW
  herausforderungen?: Record<string, { herausforderung: string; konfliktart: string; handlungsprodukt_typ?: string; transferrable?: boolean }>
```

**Line 181** — rename must_combine_subfacetten on `PrinzipJson.hybrid_situation_spec`:
```typescript
// OLD
    must_combine_subfacetten?: string[]

// NEW
    must_combine_herausforderungen?: string[]
```

**Lines 215–228** — rename sit fields on `EinheitIndexEntry` and `EinheitFullSet`:
```typescript
// EinheitIndexEntry (around line 215-216):
// OLD
  situationen: string[]
  sit_titel: { A: string | null; B: string | null; C: string | null }

// NEW
  herausforderungen: string[]
  hf_titel: { A: string | null; B: string | null; C: string | null }

// EinheitFullSet (around line 226-228):
// OLD
  sit_A: SituationJson | null
  sit_B: SituationJson | null
  sit_C: SituationJson | null

// NEW
  hf_A: SituationJson | null
  hf_B: SituationJson | null
  hf_C: SituationJson | null
```

---

### 2. JSON data files — `src/data/einheiten/`

Apply to **both** slug folders:
- `src/data/einheiten/1.1.1_konflikt_kommunizieren/`
- `src/data/einheiten/1.1.1_rechte_verstehen_nutzen/`

#### 2a. Rename files

In each slug folder:
```
sit_A.json  →  herausforderung_A.json
sit_B.json  →  herausforderung_B.json
sit_C.json  →  herausforderung_C.json
```

#### 2b. Edit each `herausforderung_A/B/C.json` (was `sit_A/B/C.json`)

**Field: `"situation"` → `"buchstabe"`** (the letter field, value unchanged)

```json
// OLD
  "situation": "A",

// NEW
  "buchstabe": "A",
```

**Field: `"sub_facette"` → `"herausforderung"`** (keep inner fields `buchstabe` and `label` as-is)

```json
// OLD
  "sub_facette": {
    "buchstabe": "A",
    "label": "Rechte und Pflichten im Lehrvertrag klären und Position formulieren"
  },

// NEW
  "herausforderung": {
    "buchstabe": "A",
    "label": "Rechte und Pflichten im Lehrvertrag klären und Position formulieren"
  },
```

**Field: `"id"` value** — replace `_sit_` with `_hf_` in the id string:

```json
// OLD
  "id": "1.1.1_konflikt_kommunizieren_sit_A",

// NEW
  "id": "1.1.1_konflikt_kommunizieren_hf_A",
```

(Same pattern for `_sit_B` → `_hf_B`, `_sit_C` → `_hf_C`.)

**Field `"kn_aktivierung"` string values** — these contain the prose text "Subfacette" and "Sit-Letter" references. Update each:

In `herausforderung_A.json` (konflikt): replace `"Im KN erscheint diese Subfacette"` → `"Im KN erscheint diese Herausforderung"`.  
In `herausforderung_B.json` (konflikt): same replacement.  
In `herausforderung_C.json` (konflikt): same replacement.  
Repeat for rechte_verstehen_nutzen variants.

#### 2c. Edit each `prinzip.json`

**Key `"sub_facetten"` → `"herausforderungen"`**

**Within each A/B/C entry, field `"facette"` → `"herausforderung"`**:

```json
// OLD
  "sub_facetten": {
    "A": {
      "facette": "Rechte und Pflichten im Lehrvertrag klären und Position formulieren",
      "konfliktart": "…",
      "handlungsprodukt_typ": "…",
      "transferrable": true
    },
    …
  }

// NEW
  "herausforderungen": {
    "A": {
      "herausforderung": "Rechte und Pflichten im Lehrvertrag klären und Position formulieren",
      "konfliktart": "…",
      "handlungsprodukt_typ": "…",
      "transferrable": true
    },
    …
  }
```

**In `hybrid_situation_spec`, key `"must_combine_subfacetten"` → `"must_combine_herausforderungen"`**:

```json
// OLD
    "must_combine_subfacetten": ["A", "B", "C"],

// NEW
    "must_combine_herausforderungen": ["A", "B", "C"],
```

**Comment strings inside the JSON** that mention `sub_facetten` — update to `herausforderungen`.

#### 2d. Edit each `kn.json`

**In `hybrid_situation.alignment_note`, key `"subfacetten_mapping"` → `"herausforderungen_mapping"`**

**Within each mapping entry, key `"sit_letter"` → `"hf_letter"`**:

```json
// OLD
      "subfacetten_mapping": [
        { "sit_letter": "A", "scene_element": "…" },
        { "sit_letter": "B", "scene_element": "…" },
        { "sit_letter": "C", "scene_element": "…" }
      ]

// NEW
      "herausforderungen_mapping": [
        { "hf_letter": "A", "scene_element": "…" },
        { "hf_letter": "B", "scene_element": "…" },
        { "hf_letter": "C", "scene_element": "…" }
      ]
```

#### 2e. Edit each `set.json`

**Key `"situationen"` → `"herausforderungen"`**

**ID values** within the array: replace `_sit_A/B/C` → `_hf_A/B/C`:

```json
// OLD
  "situationen": [
    "1.1.1_konflikt_kommunizieren_sit_A",
    "1.1.1_konflikt_kommunizieren_sit_B",
    "1.1.1_konflikt_kommunizieren_sit_C"
  ]

// NEW
  "herausforderungen": [
    "1.1.1_konflikt_kommunizieren_hf_A",
    "1.1.1_konflikt_kommunizieren_hf_B",
    "1.1.1_konflikt_kommunizieren_hf_C"
  ]
```

**In `konzept_progression[]`, field `"situation"` → `"herausforderung"`** and update ID values:

```json
// OLD
  {"position": 1, "situation": "1.1.1_konflikt_kommunizieren_sit_A", "konzept": "…"}

// NEW
  {"position": 1, "herausforderung": "1.1.1_konflikt_kommunizieren_hf_A", "konzept": "…"}
```

#### 2f. Edit each `begleiter.md`

Replace all prose occurrences of old terminology (case-sensitive search + replace):

| Find | Replace |
|------|---------|
| `Facetten` | `Herausforderungen` |
| `Facette` | `Herausforderung` |
| `Subfacetten` | `Herausforderungen` |
| `Subfacette` | `Herausforderung` |
| `Sub-Facette` | `Herausforderung` |
| `Sub-Facetten` | `Herausforderungen` |
| `Teilfacetten` | `Herausforderungen` |
| `Teilfacette` | `Herausforderung` |
| `sub_facette` | `herausforderung` |
| `sub_facetten` | `herausforderungen` |

**Do NOT** replace any occurrence of `Lernsituation` or `Lernsituationen` — these are the retained pedagogical terms.  
**Do NOT** touch the code fence blocks (` ```json `) except for actual key names inside them.  
**Do NOT** touch `sit_A.json` references in the generation metadata footer — those are historical notes.

---

### 3. `scripts/build-einheiten-index.mjs`

**Lines 46–48** — update filename strings:
```javascript
// OLD
  const sitA = readMaybe(join(dir, 'sit_A.json'))
  const sitB = readMaybe(join(dir, 'sit_B.json'))
  const sitC = readMaybe(join(dir, 'sit_C.json'))

// NEW
  const sitA = readMaybe(join(dir, 'herausforderung_A.json'))
  const sitB = readMaybe(join(dir, 'herausforderung_B.json'))
  const sitC = readMaybe(join(dir, 'herausforderung_C.json'))
```

Note: variable names `sitA/sitB/sitC` can stay as local variables — they're not exported and renaming them would be cosmetic churn with no benefit.

**Line 84** — rename `situationen` key in index output:
```javascript
// OLD
    situationen: ['A', 'B', 'C'].filter((l) => [sitA, sitB, sitC][{ A: 0, B: 1, C: 2 }[l]] != null),

// NEW
    herausforderungen: ['A', 'B', 'C'].filter((l) => [sitA, sitB, sitC][{ A: 0, B: 1, C: 2 }[l]] != null),
```

**Lines 85–89** — rename `sit_titel` key in index output:
```javascript
// OLD
    sit_titel: {
      A: sitA?.titel || null,
      B: sitB?.titel || null,
      C: sitC?.titel || null,
    },

// NEW
    hf_titel: {
      A: sitA?.titel || null,
      B: sitB?.titel || null,
      C: sitC?.titel || null,
    },
```

**After editing**, run:
```bash
npm run build:einheiten-index
```
This regenerates `src/data/einheiten.index.json` with the new key names.

---

### 4. `src/lib/einheiten/index.ts`

**Lines 51–53** — update `pickJson` filename arguments:
```typescript
// OLD
    sit_A: pickJson<SituationJson>(slug, 'sit_A'),
    sit_B: pickJson<SituationJson>(slug, 'sit_B'),
    sit_C: pickJson<SituationJson>(slug, 'sit_C'),

// NEW
    hf_A: pickJson<SituationJson>(slug, 'herausforderung_A'),
    hf_B: pickJson<SituationJson>(slug, 'herausforderung_B'),
    hf_C: pickJson<SituationJson>(slug, 'herausforderung_C'),
```

---

### 5. `src/lib/einheiten/docx-builder.ts`

**Line 304** — `sit.situation` → `sit.buchstabe`:
```typescript
// OLD
      badgeRun('Herausforderung ' + sit.situation, akzent),

// NEW
      badgeRun('Herausforderung ' + sit.buchstabe, akzent),
```

**Lines 311–312** — `sit.sub_facette` → `sit.herausforderung`:
```typescript
// OLD
  if (sit.sub_facette?.label) {
    els.push(p(sit.sub_facette.label, { run: { color: akzent, bold: true, size: 18 } }))

// NEW
  if (sit.herausforderung?.label) {
    els.push(p(sit.herausforderung.label, { run: { color: akzent, bold: true, size: 18 } }))
```

**Line 660** — `sit.situation` → `sit.buchstabe`:
```typescript
// OLD
  const docCode = `DOC-S · SIT ${sit.situation} · ${mode === 'info' ? 'DOSSIER' : 'AUFTRAG'}`

// NEW
  const docCode = `DOC-S · HF ${sit.buchstabe} · ${mode === 'info' ? 'DOSSIER' : 'AUFTRAG'}`
```

**Line 728** — `k.situation` → `k.herausforderung`:
```typescript
// OLD
  const konzeptFor = (s: SituationJson) => set?.konzept_progression?.find((k) => k.situation === s.id)?.konzept

// NEW
  const konzeptFor = (s: SituationJson) => set?.konzept_progression?.find((k) => k.herausforderung === s.id)?.konzept
```

**Lines 765, 823** — `s.situation` → `s.buchstabe`:
```typescript
// OLD (line 765)
        new TextRun({ text: 'HF ' + s.situation + ': ', bold: true, color: akzent, size: 18 }),
// OLD (line 823)
            new TextRun({ text: 'HF ' + s.situation + ': ', bold: true, color: akzent, size: 16 }),

// NEW (both)
        new TextRun({ text: 'HF ' + s.buchstabe + ': ', bold: true, color: akzent, size: 18 }),
            new TextRun({ text: 'HF ' + s.buchstabe + ': ', bold: true, color: akzent, size: 16 }),
```

**Lines 1082–1090** — `sub_facetten` → `herausforderungen`, `sf.facette` → `sf.herausforderung`:
```typescript
// OLD
  if (prinzip?.sub_facetten) {
    for (const letter of ['A', 'B', 'C']) {
      const sf = prinzip.sub_facetten![letter]
      …
      children.push(p(sf.facette, { run: { bold: true, size: 22 } }))

// NEW
  if (prinzip?.herausforderungen) {
    for (const letter of ['A', 'B', 'C']) {
      const sf = prinzip.herausforderungen![letter]
      …
      children.push(p(sf.herausforderung, { run: { bold: true, size: 22 } }))
```

**Lines 1147–1152** — `subfacetten_mapping` → `herausforderungen_mapping`, `m.sit_letter` → `m.hf_letter`:
```typescript
// OLD
  if (hs.alignment_note?.subfacetten_mapping) {
    …
      hs.alignment_note.subfacetten_mapping.map((m) => [
        new Paragraph({ children: [new TextRun({ text: m.sit_letter, bold: true, … })] }),

// NEW
  if (hs.alignment_note?.herausforderungen_mapping) {
    …
      hs.alignment_note.herausforderungen_mapping.map((m) => [
        new Paragraph({ children: [new TextRun({ text: m.hf_letter, bold: true, … })] }),
```

---

### 6. `src/components/einheiten/docs/DocS.tsx`

**Line 14** — update comment:
```typescript
// OLD
// C1 — Cockpit head: no Kompetenz badge, no emotion on the HF badge, sub-facette label only.

// NEW
// C1 — Cockpit head: no Kompetenz badge, no emotion on the HF badge, herausforderung label only.
```

**Line 19** — `sit.situation` → `sit.buchstabe`:
```tsx
// OLD
        <Badge>Herausforderung {sit.situation}</Badge>

// NEW
        <Badge>Herausforderung {sit.buchstabe}</Badge>
```

**Lines 23–25** — `sit.sub_facette` → `sit.herausforderung`, CSS class `subfacette` → `herausforderung`:
```tsx
// OLD
      {sit.sub_facette?.label && (
        <div className="badge-row" style={{ marginBottom: '3mm' }}>
          <span className="subfacette">{sit.sub_facette.label}</span>

// NEW
      {sit.herausforderung?.label && (
        <div className="badge-row" style={{ marginBottom: '3mm' }}>
          <span className="herausforderung">{sit.herausforderung.label}</span>
```

**Lines 396–400** — `common.sit.situation` → `common.sit.buchstabe` (3 occurrences):
```tsx
// OLD
      sit={common.sit.situation}
      …
      docCode={`DOC-S · HF ${common.sit.situation} · …`}
      …
      sitLetter={common.sit.situation}

// NEW
      sit={common.sit.buchstabe}
      …
      docCode={`DOC-S · HF ${common.sit.buchstabe} · …`}
      …
      sitLetter={common.sit.buchstabe}
```

---

### 7. `src/components/einheiten/docs/DocKnLp.tsx`

**Line 48** — `prinzip?.sub_facetten` → `prinzip?.herausforderungen`:
```tsx
// OLD
      {prinzip?.sub_facetten && (

// NEW
      {prinzip?.herausforderungen && (
```

**Line 51** — `prinzip.sub_facetten!` → `prinzip.herausforderungen!`, `sf.facette` → `sf.herausforderung`:
```tsx
// OLD
            const sf = prinzip.sub_facetten![letter]
            …
            <div className="big" …>{sf.facette}</div>

// NEW
            const sf = prinzip.herausforderungen![letter]
            …
            <div className="big" …>{sf.herausforderung}</div>
```

**Line 150** — `subfacetten_mapping` → `herausforderungen_mapping`:
```tsx
// OLD
          {hs?.alignment_note?.subfacetten_mapping?.map((m, i) => (

// NEW
          {hs?.alignment_note?.herausforderungen_mapping?.map((m, i) => (
```

**Line 152** — `m.sit_letter` → `m.hf_letter`:
```tsx
// OLD
              <td className="letter">{m.sit_letter}</td>

// NEW
              <td className="letter">{m.hf_letter}</td>
```

---

### 8. `src/components/einheiten/docs/DocAustausch.tsx`

**Line 38** — `k.situation` → `k.herausforderung`:
```typescript
// OLD
  return set.konzept_progression.find((k) => k.situation === sit.id)?.konzept

// NEW
  return set.konzept_progression.find((k) => k.herausforderung === sit.id)?.konzept
```

**Lines 76, 165** — `s.situation` → `s.buchstabe`:
```tsx
// OLD (line 76)
                    <span className="bsp-sit">HF {s.situation}:</span>
// OLD (line 165)
                      <li key={i}><span className="bsp-sit">HF {s.situation}:</span>

// NEW (both)
                    <span className="bsp-sit">HF {s.buchstabe}:</span>
                      <li key={i}><span className="bsp-sit">HF {s.buchstabe}:</span>
```

---

### 9. `src/components/einheiten/EinheitWorkbench.tsx`

**Line 27** — `classifySit` helper — `sit_${letter}` → `hf_${letter}`:
```typescript
// OLD
function classifySit(d: EinheitFullSet, letter: SitLetter) {
  return d[`sit_${letter}`]

// NEW
function classifySit(d: EinheitFullSet, letter: SitLetter) {
  return d[`hf_${letter}`]
```

**Lines 73, 80, 168, 173, 196, 201** — `d.sit_A, d.sit_B, d.sit_C` → `d.hf_A, d.hf_B, d.hf_C` (6 occurrences, replace all):
```typescript
// OLD
sits={[d.sit_A, d.sit_B, d.sit_C]}

// NEW
sits={[d.hf_A, d.hf_B, d.hf_C]}
```

**Lines 400–402** — `d.sit_A`, `d.sit_B`, `d.sit_C` in README template:
```typescript
// OLD
| Herausforderung A (rot) | ${d.sit_A?.titel || '—'} |
| Herausforderung B (blau) | ${d.sit_B?.titel || '—'} |
| Herausforderung C (grün) | ${d.sit_C?.titel || '—'} |

// NEW
| Herausforderung A (rot) | ${d.hf_A?.titel || '—'} |
| Herausforderung B (blau) | ${d.hf_B?.titel || '—'} |
| Herausforderung C (grün) | ${d.hf_C?.titel || '—'} |
```

**Line 68** — `sit.situation` → `sit.buchstabe` (error message):
```typescript
// OLD
      if (!sit) return <div className="a4-page"><p …>Herausforderung {situation} fehlt.</p></div>

// (situation here is the letter prop, not sit.situation — leave as-is, this is a local variable named `situation`)
```

**Line 241–242** — `sit.situation` in docKicker/docName:
Grep for `sit?.situation` or `sit.situation` in EinheitWorkbench and replace all with `sit?.buchstabe` / `sit.buchstabe`.

---

### 10. `src/pages/einheiten/index.astro`

**Line 92** — `e.sit_titel` → `e.hf_titel`:
```astro
// OLD
              {(['A','B','C'] as const).map((l) => e.sit_titel[l] ? l : null).filter(Boolean).join(' · ') || '—'}

// NEW
              {(['A','B','C'] as const).map((l) => e.hf_titel[l] ? l : null).filter(Boolean).join(' · ') || '—'}
```

Also grep the file for any other `e.situationen` or `e.sit_` references.

---

### 11. `src/styles/einheiten-renderer.css`

**Lines 1329–1330** — rename CSS class:
```css
/* OLD */
/* ---------- Subfacette tag ---------- */
.subfacette {

/* NEW */
/* ---------- Herausforderung tag ---------- */
.herausforderung {
```

---

### 12. Skill: `assets/prinzip-template.json`

**Key `"sub_facetten"` → `"herausforderungen"`** (the top-level key, line 36).

**Within each A/B/C entry, `"facette"` → `"herausforderung"`** (lines 39, 45, 51).

**Key `"must_combine_subfacetten"` → `"must_combine_herausforderungen"`** (line 142).

**All comment strings** inside the JSON that mention `sub_facetten`, `sub_facette`, or `Subfacetten` — update to `herausforderungen`/`herausforderung`. Specifically:
- Line 7: `sub_facetten[].*, …` → `herausforderungen[].*, …`
- Line 9: `"sub_facetten enthaelt GENAU 3 Eintraege A/B/C."` → `"herausforderungen enthaelt GENAU 3 Eintraege A/B/C."`
- Line 15: `prinzip_ref + sub_facette + mehrdeutigkeit` → `prinzip_ref + herausforderung + mehrdeutigkeit`
- Line 71: `sub_facetten[*].konfliktart` → `herausforderungen[*].konfliktart`
- Line 71 second occurrence: same

---

### 13. Skill: `assets/mission-template.json`

**Key `"sub_facette"` → `"herausforderung"`** (line 149 area, the top-level field in the sit template).

**Field `"situation": "{LETTER}"` → `"buchstabe": "{LETTER}"`** (line 30 area).

**Comment string** on `prinzip_first_additiv` (line 7): `prinzip_ref, sub_facette, …` → `prinzip_ref, herausforderung, …`

---

### 14. Skill: `assets/kn-template.json`

**Key `"subfacetten_mapping"` → `"herausforderungen_mapping"`** (line 55 area).

**Keys `"sit_letter"` → `"hf_letter"`** within each mapping entry (lines 56–58 area).

**Comment string** (line 54): update `subfacetten_mapping` → `herausforderungen_mapping` and `Sit-Prinzip` → `Herausforderungs-Prinzip`.

---

### 15. Skill: `references/*.md`

For each of the 6 files with hits, do targeted replacements (do NOT touch "Lernsituation"):

#### `references/json-field-mapping.md`

- `sub_facette` → `herausforderung` (field name entries)
- `sub_facetten` → `herausforderungen`
- `prinzip.sub_facetten[LETTER].facette` → `prinzip.herausforderungen[LETTER].herausforderung`
- `prinzip.sub_facetten[LETTER].handlungsprodukt_typ` → `prinzip.herausforderungen[LETTER].handlungsprodukt_typ`

#### `references/prinzip-architecture.md`

- `sub_facetten` → `herausforderungen` (field references and examples)
- `facette` (when referring to the field name) → `herausforderung`
- `must_combine_subfacetten` → `must_combine_herausforderungen`
- In the example JSON block: same key renames as section 2c above

#### `references/kn-architecture.md`

- `sub_facette.label` → `herausforderung.label`
- `sub_facette.konfliktart` → `herausforderung.konfliktart` (via `prinzip`)
- `subfacetten_mapping` → `herausforderungen_mapping`
- `sit_letter` → `hf_letter` (within mapping entries)
- In example JSON: same key renames as section 2d above

#### `references/coherence-checklist.md`

- Check 1 title: `sub_facette aus dem Prinzip` → `herausforderung aus dem Prinzip`
- `sit_*.sub_facette.buchstabe` → `sit_*.herausforderung.buchstabe`
- `sit_*.sub_facette.label === prinzip.sub_facetten[buchstabe].facette` → `sit_*.herausforderung.label === prinzip.herausforderungen[buchstabe].herausforderung`
- Check 2 title: `sub_facette` → `herausforderung`
- `sit_A/B/C.sub_facette.buchstabe` → `sit_A/B/C.herausforderung.buchstabe` (check 2 body)
- Error codes: `ERR_SUB_FACETTE_MISSING` → `ERR_HERAUSFORDERUNG_MISSING`, `ERR_DUPLICATE_SUB_FACETTE` → `ERR_DUPLICATE_HERAUSFORDERUNG`
- `subfacetten_mapping` → `herausforderungen_mapping` (check 7 area)
- `sit_*.sub_facette.konfliktart` → `sit_*.herausforderung.konfliktart`

#### `references/system-overview.md`

- All `sub_facetten` → `herausforderungen` (field references, example JSON, table entries)
- All `sub_facette` → `herausforderung`
- `subfacetten_mapping` → `herausforderungen_mapping`
- `sit_letter` → `hf_letter`
- `prinzip.sub_facetten.A/B/C.facette` → `prinzip.herausforderungen.A/B/C.herausforderung`
- `prinzip.sub_facetten.A/B/C.konfliktart` → `prinzip.herausforderungen.A/B/C.konfliktart`
- Table column `SUBFACETTE A` label → `HERAUSFORDERUNG A`
- `Steckbrief-Tabelle` entry: `sub_facette.label` → `herausforderung.label`

#### `references/system-data.md`

- `sub_facette` → `herausforderung`
- `sub_facette.buchstabe` → `herausforderung.buchstabe`
- `"Herausforderung {buchstabe}" chip` line — stays as-is (already correct display)
- `prinzip.sub_facetten` → `prinzip.herausforderungen`
- `alignment_note.subfacetten_mapping` → `alignment_note.herausforderungen_mapping`

---

### 16. Skill: `SKILL.md`

This file has ~29 occurrences. Make the following changes:

#### Section A "Vokabular" (lines 1120–1134)

Replace the entire section. The old version said "JSON keys are intentionally kept unchanged for backward compat." The new version acknowledges the rename is complete:

```markdown
### A) Vokabular: Herausforderung — Prosa und Keys

Alle sichtbaren Begriffe UND die JSON-Keys/Feldnamen sind nun vereinheitlicht auf **Herausforderung**. Die Tabelle zeigt die kanonischen Bezeichnungen:

| Begriff in Prosa & Display | JSON-Key / ID / Dateiname |
|---|---|
| Herausforderung A/B/C | `buchstabe`, `herausforderungen[]`, `hf_A/B/C`, `hf_letter`, `{X.Y.Z}_{slug}_herausforderung_A.json` |
| Herausforderung (Teilkompetenz) | `herausforderung`, `herausforderungen`, `herausforderungen_mapping` |
| Hybrid-Herausforderung | `hybrid_situation`, `hybrid_situation_spec`, `herausforderungen` (anchored) |
| Transfer | `dekontextualisierung`, `dekontextualisierungs_aufgabe`, `dekontextualisierungs_anker` |

Regel: Schreibe in **sichtbaren Text niemals** "Situation", "Sit A", "Subfacette" oder "Dekontextualisierung" — immer **Herausforderung A/B/C**, **Hybrid-Herausforderung**, **Transfer**. Ausnahme: der didaktische Fachbegriff **Lernsituation** (8 Merkmale einer Lernsituation) bleibt erhalten.
```

#### All other occurrences in SKILL.md — targeted replacements

Search for each of the following and replace (case-sensitive, use context to avoid false positives):

| Find | Replace |
|------|---------|
| `sub_facetten[].{facette,` | `herausforderungen[].{herausforderung,` |
| `sub_facetten[].{` | `herausforderungen[].{` |
| `sub_facetten` | `herausforderungen` |
| `sub_facette` | `herausforderung` |
| `"facette"` (when referring to the JSON field name) | `"herausforderung"` |
| `{facette}` (in table template columns) | `{herausforderung}` |
| `A: {facette}` (in Konzept-Bogen tables) | `A: {herausforderung}` |
| `subfacetten_mapping` | `herausforderungen_mapping` |
| `must_combine_subfacetten` | `must_combine_herausforderungen` |
| `sit_*.sub_facette` | `sit_*.herausforderung` |
| `ERR_SUB_FACETTE_MISSING` | `ERR_HERAUSFORDERUNG_MISSING` |
| `ERR_DUPLICATE_SUB_FACETTE` | `ERR_DUPLICATE_HERAUSFORDERUNG` |
| `Subfacetten A/B/C` | `Herausforderungen A/B/C` |
| `Subfacette {letter}` | `Herausforderung {letter}` |
| `SUBFACETTE` | `HERAUSFORDERUNG` |
| `prinzip.sub_facetten` | `prinzip.herausforderungen` |
| `prinzip_ref, sub_facette,` | `prinzip_ref, herausforderung,` |
| `if (json.sub_facetten)` | `if (json.herausforderungen)` |
| `if (json.sub_facette)` | `if (json.herausforderung)` |
| `sub_facette.label === prinzip.sub_facetten[buchstabe].facette` | `herausforderung.label === prinzip.herausforderungen[buchstabe].herausforderung` |
| `A: {facette} — {konfliktart}` (in Phase tables) | `A: {herausforderung} — {konfliktart}` |

#### Validation check in checklist section (around line 1062)

```markdown
// OLD
- [ ] `sub_facette.label === prinzip.sub_facetten[buchstabe].facette`

// NEW
- [ ] `herausforderung.label === prinzip.herausforderungen[buchstabe].herausforderung`
```

---

### 17. Legacy `renderer/` folder

The `renderer/` folder is marked as deprecated reference code in CLAUDE.md. Rename for consistency so it doesn't mislead future readers. Apply the same changes as above to:

**JSX files** (`renderer/app.jsx`, `renderer/doc-s.jsx`, `renderer/doc-kn-lp.jsx`, `renderer/docx-builder.jsx`):
- Same field/key renames as sections 5–8 above
- `sub_facetten`, `sub_facette`, `facette`, `subfacetten_mapping`, `sit_letter` → new equivalents
- `sit.situation` → `sit.buchstabe`
- Section head labels: `"01 · Subfacetten A·B·C"` → `"01 · Herausforderungen A·B·C"`
- `<h4>Subfacette {letter}</h4>` → `<h4>Herausforderung {letter}</h4>`
- Table header `"Subfacette"` → `"Herausforderung"`

**JSON files** (`renderer/data/` and `renderer/uploads/`, 10 files total):
- Same JSON key renames as sections 2b–2e above
- `"sub_facette"` → `"herausforderung"`, `"sub_facetten"` → `"herausforderungen"`, etc.
- Rename the `_sit_A/B/C` portion of id values: `_sit_A` → `_hf_A`
- NOTE: Do NOT rename the physical files in `renderer/data/` and `renderer/uploads/` — they use the old naming convention for filenames and that's fine for deprecated reference material. Only rename keys inside the JSON content.

---

## Verification

After all changes, run these checks in order:

### 1. TypeScript compile check
```bash
npm run build
```
Zero type errors expected. Any remaining `Property 'sit_A' does not exist` or `Property 'sub_facette' does not exist` errors indicate a missed occurrence.

### 2. Index rebuild
```bash
npm run build:einheiten-index
```
Verify `src/data/einheiten.index.json` now contains `herausforderungen` and `hf_titel` keys (not `situationen`/`sit_titel`).

### 3. Grep for missed occurrences in einheiten scope
```bash
grep -rn "sub_facette\|sub_facetten\|subfacetten\|\.situation\b" \
  src/lib/einheiten/ src/components/einheiten/ src/data/einheiten/ \
  src/pages/einheiten/ src/styles/einheiten-renderer.css \
  scripts/build-einheiten-index.mjs
```
Expected output: zero results (except for comments referencing old names as migration notes, which are acceptable).

### 4. Grep for missed sit_ properties
```bash
grep -rn "\bsit_A\b\|\bsit_B\b\|\bsit_C\b\|\bsit_titel\b\|\bsituationen\b" \
  src/lib/einheiten/ src/components/einheiten/ src/data/einheiten/ \
  src/pages/einheiten/ scripts/build-einheiten-index.mjs
```
Expected output: zero results.

### 5. Confirm /situationen catalog untouched
```bash
grep -rn "sub_facette\|sub_facetten\|subfacetten" src/lib/situationen.ts src/pages/situationen/
```
Expected output: zero results (these files should never have had these keys).

### 6. Confirm skill templates are valid JSON
```bash
node -e "require('./assets/prinzip-template.json')"
node -e "require('./assets/mission-template.json')"
node -e "require('./assets/kn-template.json')"
```
Run from within the skill directory. Expected: no errors.

### 7. Dev server smoke test
```bash
npm run dev
```
Navigate to `/einheiten` — confirm units load. Open a unit workbench — confirm Herausforderung A/B/C render correctly. Download a ZIP — open a DocS DOCX and confirm the Herausforderung badge and label are present.

---

## Notes on backward compatibility

- **`src/data/einheiten.index.json`** is a generated file. After running `build:einheiten-index` it will have the new keys. Any Vercel deploy will regenerate it at build time.
- **No database changes needed** — the Einheiten workflow is entirely file-based; nothing is stored in Supabase.
- **No URL changes** — `/einheiten/[setKey]` routes use the slug (folder name), not the sit filenames.
- **No API changes** — the `einheit-feedbacks` table references slugs, not sit filenames.
- **The `/situationen` catalog is completely unaffected** by this rename.
