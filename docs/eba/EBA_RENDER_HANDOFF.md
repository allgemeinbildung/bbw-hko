# EBA-Render — Umsetzung & Handoff

**Stand:** 2026-06-17 · **Repo:** `bbw-hko` · Render-Pfad: `src/components/einheiten/docs/` (Renderer B, A4/Print) + `einheiten-renderer.css`.
**Sprache:** Swiss Standard German, kein Eszett, echte Umlaute, UTF-8.

> **Warum dieser Handoff (ehrlich):** Die Print-Prototyp-Datei
> `docs/eba/_pilot_output/1.1.1_PRINT_PROTOTYP.html` ist **fertig und sofort testbar** (Browser →
> Drucken → PDF). Die untenstehenden Repo-Änderungen (TSX/CSS/Loader) ändern die **live React/Astro-
> App** und müssen mit `npm run build` kompiliert + gegen das EFZ-Rendering regressionsgeprüft werden.
> Cowork hat hier keinen Build/Browser — darum sind diese Teile als **anwendungsfertige Diffs**
> aufbereitet (Schritt 0 + Komponente sind bereits erledigt), zum Kompilieren im Dev-Env.

---

## Schritt 0 — Ist-Stand (gelesen, bestätigt)

- `DocS.tsx`, `DocAustausch.tsx`, `DocKnS.tsx`, `DocKnLp.tsx` konsumieren `sit.*` / `kn.*` Felder;
  **keine** liest aktuell `lehrgang`. Alle Typografie/Layout-Regeln liegen in
  `src/styles/einheiten-renderer.css` (A4 210×297mm, padding 12/16mm, Basis 10.5pt/1.4, IBM Plex Sans).
- `chrome.tsx` liefert das gemeinsame Gerüst (`A4Page`, `SectionHead`, `Schreibfeld`, `sitColors`).
- `EinheitWorkbench.tsx` iteriert Herausforderungen null-sicher (`['A','B','C']` + `classifySit ? … : null`,
  `if (!s) continue`) → ein 2er rendert bereits ohne Crash. **`template`-Wert wird nirgends gematcht.**
- **Dossier:** `loadEinheit` lädt `dossier.json` **nicht**; es gibt **keinen** Dossier-Renderer.

## Einhak-Ansatz: **Conditional-Weiche, kein Fork** (begründet)

Gewählt: **bestehende Komponenten + `lehrgang === "EBA_2J"`-Weiche**, plus **eine neue** additive
Komponente fürs Dossier. Begründung:

- Das A4-Grundraster, die Feldanbindung und die Doc-Builder sind identisch — ein Fork würde sie
  duplizieren und zwei Render-Stränge zum Pflegen erzeugen.
- P3/P4/P5 sind **fast vollständig Typografie/Layout** → über eine CSS-Klasse `doc-eba` lösbar, ohne
  TSX-Logik zu verdoppeln.
- P1 (Segmentierung) + P2 (Dossier-Sprungmechanik) brauchen **neue Markup-Struktur** nur dort, wo es
  sie im EFZ nicht gibt → genau **eine** neue Komponente `DocEbaDossier.tsx` (bereits geschrieben).

EFZ bleibt damit **unberührt** (kein Pfad, kein Verhalten geändert).

---

## Bereits erledigt (in diesem Schritt)

1. `src/components/einheiten/docs/DocEbaDossier.tsx` — **neu, additiv** (noch nicht importiert →
   ändert den Build nicht). Rendert `nuggets` (A/B-gruppiert, sichtbarer Anker A-01…B-03),
   `sprachmodi_scaffolds` (so_gehst_du_vor als „Schritt n von m"), `transfer_wissensblatt`, `glossar`.
2. `docs/eba/_pilot_output/1.1.1_PRINT_PROTOTYP.html` — Print-Prototyp (P1–P5), Pietro-testbar.

---

## Anzuwenden im Dev-Env (kompilieren + EFZ-Regression prüfen)

### A) `src/lib/einheiten/types.ts` — DossierJson + Feld am Set
```ts
// am Ende der Datei:
export interface DossierJson {
  id: string; kompetenz_nr?: string; sprachniveau?: string
  nuggets?: any[]; sprachmodi_scaffolds?: any[]
  transfer_wissensblatt?: any; glossar?: any[]
}
// im EinheitFullSet-Interface ergänzen:
//   dossier: DossierJson | null
```
(Optional die `any[]` durch die Interfaces aus `DocEbaDossier.tsx` ersetzen — dort exportiert.)

### B) `src/lib/einheiten/index.ts` — Loader lädt dossier.json
```ts
// in loadEinheit(), bei den pickJson-Zeilen:
dossier: pickJson<DossierJson>(slug, 'dossier'),
```
Null-sicher wie alle anderen (fehlt die Datei → `null`). **EFZ-Einheiten haben keine `dossier.json`
→ `null` → keine Auswirkung.**

### C) `DocS.tsx` — EBA-Klasse via lehrgang-Weiche (P3/P4/P5)
Die zwei Wurzel-`<div style={sitColors(sit)}>` in `DocSInfo`/`DocSFill` bekommen die EBA-Klasse:
```tsx
const ebaClass = sit.lehrgang === 'EBA_2J' ? ' doc-eba' : ''
// …
<div className={`doc-s-root${ebaClass}`} style={sitColors(sit)}>
```
Nur ein zusätzlicher Klassenname — EFZ (`lehrgang !== "EBA_2J"`) bleibt exakt wie bisher.

### D) `EinheitWorkbench.tsx` — Dossier in Selector + ZIP (nur wenn vorhanden)
- Import: `import { DocEbaDossier } from './docs/DocEbaDossier'`
- Doc-Auswahl: einen Eintrag „Dossier (EBA)" nur zeigen, wenn `d.dossier` existiert
  (`d.dossier ? <button … /> : null`).
- Render-Case: `return <DocEbaDossier dossier={d.dossier} abteilung={abteilung} />`
- ZIP: analog zu DOC-AUSTAUSCH einen Block `if (d.dossier) { … renderToStaticMarkup(<DocEbaDossier …/>) … }`
  (HTML; DOCX optional später).

### E) `src/styles/einheiten-renderer.css` — EBA-Block (additiv, scoped `.doc-eba`)
Komplett additiv; greift nur unter `.doc-eba` → **EFZ unverändert**. Block ans Dateiende:

```css
/* ===================== EBA (lehrgang EBA_2J) — P3/P4/P5 ===================== */
/* P3 Typografie: groesser, kurze Zeilen, mehr Abstand, linksbuendig (kein Blocksatz) */
.doc-eba{ font-size:12.5pt; line-height:1.6; text-align:left; }
.doc-eba p{ max-width:62ch; text-align:left; }
.doc-eba .lf-text p{ font-size:12.5pt; }
.doc-eba .sit-text{ font-size:12.5pt; line-height:1.65; }
.doc-eba h1,.doc-eba .cockpit-title{ font-size:22pt; }
.doc-eba h2,.doc-eba .section-title{ font-size:16pt; }

/* P1 Segmentierung: klar abgegrenzte Bloecke, je eine Sache */
.doc-eba .lf-item{ border:1.4px solid var(--rule); border-radius:3mm; padding:4mm 5mm; margin-bottom:4mm; page-break-inside:avoid; }
.doc-eba .lf-nr{ background:var(--sit-akzent); color:#fff; border-radius:100px; padding:.4mm 3mm; }

/* P2 Nachschlagbar: Quellen-/Nugget-Anker sichtbar markieren */
.doc-eba .source-ref{ border:1.3px solid var(--sit-akzent); color:var(--sit-akzent); border-radius:2mm; padding:.2mm 2mm; font-weight:600; }
.doc-eba .source-ref::before{ content:"\1F4D6  "; }

/* P4 Scaffolding prominent (nicht versteckt) */
.doc-eba .scaffolding{ background:#fffdf5; border:1.4px solid #e7dca8; border-radius:3mm; padding:4mm; }
.doc-eba .scaffolding-label{ color:#8a6d1f; }

/* P5 Affekt: Trade-off einladend, Fortschritt */
.doc-eba .tradeoff-callout{ background:var(--brand-tint); border:1px dashed var(--brand); border-radius:3mm; color:var(--brand-dark); }

/* DocEbaDossier-spezifische Klassen */
.doc-eba .eba-dossier-intro{ background:var(--brand-tint); border-radius:3mm; padding:4mm 5mm; margin-bottom:5mm; }
.doc-eba .eba-nugget{ border:1.5px solid var(--rule); border-radius:3mm; padding:4mm 5mm; margin-bottom:4mm; page-break-inside:avoid; }
.doc-eba .eba-nugget.tag-a{ border-left:5px solid #C0392B; }
.doc-eba .eba-nugget.tag-b{ border-left:5px solid #1A5276; }
.doc-eba .eba-nugget-top{ display:flex; align-items:center; gap:3mm; margin-bottom:1.5mm; }
.doc-eba .eba-ncode{ color:#fff; border-radius:2mm; padding:.6mm 2.5mm; font-weight:700; }
.doc-eba .eba-nugget.tag-a .eba-ncode{ background:#C0392B; }
.doc-eba .eba-nugget.tag-b .eba-ncode{ background:#1A5276; }
.doc-eba .eba-bsp{ background:#f6f7f9; border-radius:2mm; padding:2.5mm 3.5mm; margin-top:2mm; font-size:11pt; }
.doc-eba .eba-fakt{ font-size:9.5pt; color:var(--ink-mute); margin-top:2mm; }
.doc-eba .eba-fakt-ok{ color:var(--brand); margin-right:3mm; }
.doc-eba .eba-fakt-pruef{ color:#b7791f; }
.doc-eba .eba-schritte{ list-style:none; padding:0; margin:2mm 0; }
.doc-eba .eba-schritte li{ display:flex; gap:3mm; align-items:flex-start; border:1.3px solid var(--rule); border-radius:2.5mm; padding:3mm 4mm; margin-bottom:2.5mm; }
.doc-eba .eba-schritt-n{ flex:0 0 auto; width:8mm; height:8mm; border-radius:100px; background:var(--sit-akzent,#0E6E3A); color:#fff; font-weight:700; display:flex; align-items:center; justify-content:center; }
.doc-eba .eba-of{ display:block; font-size:9pt; color:var(--ink-mute); font-style:normal; }
.doc-eba .eba-glossar{ column-count:2; column-gap:8mm; }
.doc-eba .eba-gloss{ break-inside:avoid; margin-bottom:3mm; }
.doc-eba .eba-gloss-b{ font-weight:700; color:var(--brand-dark); }
```

---

## Was NICHT geändert wurde / wird
- EFZ-Doc-Komponenten-Pfade + EFZ-Verhalten: **unverändert** (Weiche, kein Umbau).
- Skill / Datenmodell / JSON-Outputs: **unverändert**.
- `hko-deploy`-Web-Viewer (Renderer A): **nicht angefasst**.
- Punkte/Badges + übermässiger Bildeinsatz: **nicht** umgesetzt (Teil-2-Defaults; nur funktionale
  Marker + Fortschritt). Drei offene Fragen sind **nicht** im Code gehärtet — Print = Default.

## Dev-Env-Verifikation (Checkliste)
- [ ] A–E anwenden, `npm run build` läuft fehlerfrei.
- [ ] Eine EFZ-Einheit (z. B. `1.1.1_konflikt_kommunizieren`) im Workbench öffnen → **identisch wie vorher** (kein `doc-eba`, keine Dossier-Option).
- [ ] Die EBA-Pilot-Einheit (nach Deploy nach `src/data/einheiten/…`, separat) → `doc-eba`-Typografie greift, Dossier-Doc erscheint, ZIP enthält das Dossier.
- [ ] Print/PDF der EBA-Herausforderung A + Dossier visuell gegen `1.1.1_PRINT_PROTOTYP.html` abgleichen.

## Offene Frage an Pietro
Soll die EBA-Pilot-Einheit zum Renderer-Test **nach `src/data/einheiten/`** deployt werden (dann live
im Katalog, mit `status:"entwurf"` nur für KT1 sichtbar), oder bleibt der Test rein auf dem Print-
Prototyp, bis die Komponenten kompiliert sind?
