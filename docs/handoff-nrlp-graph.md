# Handoff — nRLP-Graph in bbw-hko (Netzwerk + Zirkularität + Units-as-Nodes + neue Ansichten)

**Ziel.** Den bestehenden nRLP-Graph (heute live auf `abu-hko.ch/nrlp/`, hko-deploy) nach **bbw-hko** bringen, für die Datensätze **EBA 2-jährig / EFZ 3-jährig / EFZ 4-jährig**, als integrierte, navigierbare Karte: Graph-Knoten verlinken in die echten `/einheiten` und `/situationen`, **und unsere eigenen Einheiten/Situationen erscheinen selbst als Knoten** im Graph. Plus drei neue Ansichten (Spirale, Chord, Sankey/Sunburst), die die Zirkularität/Vernetzung sichtbar machen.

**Warum dieser Handoff statt direkter Umsetzung.** Erstellt in einer Cowork-Session ohne funktionierende Sandbox-Shell (kein Massen-Copy, kein Build). Ausführung gehört ohnehin auf Windows (vgl. `CLAUDE.md`-Memory „build/commit on Windows only"). Claude Code führt unten Schritt für Schritt aus und buildet/validiert lokal.

---

## 0. Architekturentscheid

- bbw-hko ist Astro SSR (Vercel). Der Graph ist eine **eigenständige Vanilla-JS-App** (ES-Module, lädt `force-graph` per CDN). Sauberster Weg: als **statisches Passthrough** unter `public/nrlp/` ablegen (Astro serviert `public/` unverändert) → erreichbar unter `bbw-hko.ch/nrlp/`.
- Dazu eine dünne **Astro-Route `/nrlp`** in BBW-Chrome (grün, rollenbewusst, `← Hauptplattform`), die die App full-bleed einbettet (iframe). So bleibt die App framework-entkoppelt, bekommt aber Layout + Auth-Guard.
- **Eine Datenquelle:** Die App nutzt bbw-hkos eigene `public/nrlp_{2j,3j,4j}.json` (frischer als die in hko-deploy gebündelten Kopien). Das Import-Skript kopiert die JSONs **nicht** mit und patcht die Pfade auf absolut `/nrlp_*.json`.
- **Units-as-Nodes / Deep-Links:** Eine additive Overlay-Datei (`public/nrlp/ext/units-overlay.js`) lädt `einheiten.index.json` + `situationen.index.json` (vom Import-Skript nach `public/nrlp/` gespiegelt) und hängt Einheit-/Situations-Knoten an die passenden Kompetenz-/Lebensbezug-Knoten. Klick auf einen Unit-Knoten öffnet `/einheiten/<id>` bzw. `/situationen/<id>`.

### Schema-Fakten (verifiziert)
- Graph baut Kompetenz-Knoten mit `label = k.nr` (z. B. `"1.1.1"`), Lebensbezug-Knoten mit `label = lb.nr` (z. B. `"1.1"`), Thema-Knoten `id = "T<nr>"`.
- `einheiten.index.json`: `id`, `kompetenz_nr` (primär), `abgedeckte_kompetenzen[]`, `lehrgang` (String **oder** Array), `status`, `entwurf_komponenten[]`, `modul`, `themen[]`.
- `situationen.index.json`: `id`, `modul`, `lebensbezug_nr` (z. B. `"3.1"`), `themen[]`.
- Lehrgang-Tokens: `EFZ_3J`, `EFZ_4J`, `EBA_2J`. Dataset→Lehrgang: `nrlp_3j→EFZ_3J`, `nrlp_4j→EFZ_4J`, `nrlp_2j→EBA_2J`.
- Deep-Link-URLs (gleiche Origin): `/einheiten/<id>`, `/situationen/<id>`.

---

## 1. Phase 0 — Import (deterministisch)

Aus dem bbw-hko-Repo-Root:

```powershell
pwsh ./scripts/import-nrlp-graph.ps1
# bei abweichendem hko-deploy-Pfad:
# pwsh ./scripts/import-nrlp-graph.ps1 -Source "D:\OneDrive - bbw.ch\+GIT\+ORGs\hko-deploy"
```

Das Skript (liegt bereits im Repo) kopiert App-Shell + `modules/**` + `shared/modals.*` + `modals/nrlp-graph-*.html`, **ohne** `_lehrmittel/`, `pdfs/`, `prompt-builder/`, `*.py`, `*.md`, `nrlp_*.json`. Es patcht die Dataset-Pfade auf `/nrlp_*.json` und spiegelt die beiden Index-Dateien nach `public/nrlp/`.

> **Wichtig:** Nach diesem Schritt die unter §3–§6 genannten Edits anwenden. `index.html` wird vom Skript kopiert — die Edits in §5/§6 danach anwenden (oder das Skript so anpassen, dass es `index.html` überspringt, falls eine bbw-spezifische Version gepflegt wird).

---

## 2. Phase 1 — Astro-Route `/nrlp` (BBW-Chrome, rollenbewusst)

Neue Datei `src/pages/nrlp.astro`. Nutzt das bestehende `LP`-Layout-Muster (weißer Header, `h-14` PNG-Logo, grüne Akzente). Guard wie andere LP/gast-Seiten über `Astro.locals.user`/`profile.role`.

```astro
---
// src/pages/nrlp.astro
import Base from "../layouts/Base.astro";

const { user } = Astro.locals;
if (!user) return Astro.redirect("/login");
// lp / kt1 / gast dürfen alle schauen (read-only). Bei Bedarf gast einschränken.
---
<Base title="nRLP-Netzwerk — ABU Reform 2030">
  <header class="nrlp-bar">
    <a class="back" href="/">← Hauptplattform</a>
    <span class="title">nRLP-Netzwerk</span>
    <span class="sub">Vernetzung &amp; Zirkularität der ABU-Inhalte</span>
  </header>
  <iframe id="nrlp-frame" src="/nrlp/index.html" title="nRLP-Graph" loading="lazy"></iframe>

  <style>
    .nrlp-bar{display:flex;align-items:center;gap:.75rem;padding:.6rem 1rem;
      border-bottom:1px solid var(--brand-tint);background:#fff}
    .nrlp-bar .back{color:var(--brand-dark);font-weight:600;text-decoration:none}
    .nrlp-bar .title{font-weight:700}
    .nrlp-bar .sub{color:#6b7280;font-size:.85rem}
    #nrlp-frame{display:block;width:100%;height:calc(100vh - 52px);border:0}
  </style>
</Base>
```

> Wenn `Base.astro` bereits eine globale Topbar rendert, stattdessen das vorhandene LP-Shell verwenden und nur das `<iframe>` als full-bleed Inhalt einsetzen. Die App selbst bringt ihren eigenen Header (Dataset-Picker, Ansicht, Presets) mit.

**Verlinkung (Holistische Navigation):**
- Hub `src/pages/index.astro`: eine vierte, dezente Karte/Link „nRLP-Netzwerk — Inhalte vernetzt erkunden" → `/nrlp` (gleicher grüner Wappen-Stil, ohne Letter-Mark).
- Jahresplanung `src/pages/jahresplanung.astro`: im Toolbar-/Export-Bereich einen Button „🕸 nRLP-Netzwerk" → `/nrlp` (öffnet die Karte zur aktuell geplanten LB).

---

## 3. Phase 2 — Units-as-Nodes (neue Datei, additiv)

Neue Datei **`public/nrlp/ext/units-overlay.js`** (liegt außerhalb von `modules/`, wird vom Import-Skript nicht überschrieben):

```js
// public/nrlp/ext/units-overlay.js
// Hängt Einheiten- und Situationen-Knoten an Kompetenz-/Lebensbezug-Knoten.
// Aufruf aus controller.loadDataset() NACH buildGraphData().

const DATASET_LEHRGANG = {
  'nrlp_3j': 'EFZ_3J',
  'nrlp_4j': 'EFZ_4J',
  'nrlp_2j': 'EBA_2J',
};

function datasetKey(path) {
  const m = String(path).match(/nrlp_(\dj)/);
  return m ? `nrlp_${m[1]}` : 'nrlp_3j';
}

function lehrgangMatches(unitLehrgang, want) {
  if (!unitLehrgang) return true; // unspezifisch → überall zeigen
  const arr = Array.isArray(unitLehrgang) ? unitLehrgang : [unitLehrgang];
  return arr.includes(want);
}

// Sichtbarkeit: Entwurf-Einheiten für lp/gast ausblenden.
function einheitVisible(e, role) {
  if (role === 'kt1' || role === 'reviewer') return true;
  return e.status !== 'entwurf';
}

async function fetchIndex(url) {
  try {
    const r = await fetch(url);
    if (!r.ok) return [];
    return await r.json();
  } catch (_) { return []; }
}

/**
 * @param {{nodes:Array,links:Array}} graphData  Ergebnis von buildGraphData()
 * @param {string} datasetPath                   z. B. "/nrlp_3j.json"
 * @param {string} role                          "lp" | "kt1" | "gast" | ...
 */
export async function augmentGraphWithUnits(graphData, datasetPath, role = 'lp') {
  const wantLehrgang = DATASET_LEHRGANG[datasetKey(datasetPath)];
  const [einheiten, situationen] = await Promise.all([
    fetchIndex('./einheiten.index.json'),
    fetchIndex('./situationen.index.json'),
  ]);

  // Lookup: Kompetenz-Label (k.nr) → Knoten-id ; Lebensbezug-Label (lb.nr) → Knoten-id
  const kompByLabel = new Map();
  const lbByLabel = new Map();
  graphData.nodes.forEach(n => {
    if (n.type === 'kompetenz') kompByLabel.set(String(n.label), n.id);
    if (n.type === 'lebensbezug') lbByLabel.set(String(n.label), n.id);
  });

  const existing = new Set(graphData.nodes.map(n => n.id));
  function pushNode(node) { if (!existing.has(node.id)) { existing.add(node.id); graphData.nodes.push(node); } }
  function pushLink(s, t, type, color) {
    if (!s || !t) return;
    graphData.links.push({ source: s, target: t, type, baseColor: color });
  }

  // --- Einheiten ---
  einheiten
    .filter(e => lehrgangMatches(e.lehrgang, wantLehrgang) && einheitVisible(e, role))
    .forEach(e => {
      const targets = new Set();
      (e.abgedeckte_kompetenzen && e.abgedeckte_kompetenzen.length
        ? e.abgedeckte_kompetenzen
        : [e.kompetenz_nr]
      ).forEach(knr => { const id = kompByLabel.get(String(knr)); if (id) targets.add(id); });
      if (!targets.size) return; // keine Anknüpfung im aktiven Datensatz
      const id = `EH__${e.id}`;
      pushNode({
        id, label: '★ ' + (e.einheit_titel || e.id),
        name: `Einheit: ${e.einheit_titel || e.id}`,
        type: 'einheit', color: '#0E6E3A', val: 9,
        data: { ...e, url: `/einheiten/${e.id}`, kind: 'einheit' },
      });
      targets.forEach(kId => pushLink(id, kId, 'einheit_kompetenz', '#0E6E3A'));
    });

  // --- Situationen ---
  situationen.forEach(s => {
    const lbId = lbByLabel.get(String(s.lebensbezug_nr)) || lbByLabel.get(String(s.modul));
    if (!lbId) return;
    const id = `SIT__${s.id}`;
    pushNode({
      id, label: '◇ ' + (s.titel || s.id),
      name: `Situation: ${s.titel || s.id}`,
      type: 'situation', color: '#6b21a8', val: 7,
      data: { ...s, url: `/situationen/${s.id}`, kind: 'situation' },
    });
    pushLink(id, lbId, 'situation_lebensbezug', '#6b21a8');
  });

  return graphData;
}
```

### Vendored-Edits für Units-as-Nodes

**a) `public/nrlp/modules/app/controller.js`** — Overlay aufrufen + Klick-Navigation.

1. Import oben ergänzen:
   ```js
   import { augmentGraphWithUnits } from '../../ext/units-overlay.js';
   ```
2. In `loadDataset()` direkt nach `const graphData = buildGraphData(nrlp);` einfügen:
   ```js
   const role = (window.NRLP_ROLE || 'lp');
   await augmentGraphWithUnits(graphData, path, role);
   ```
3. In `onNodeSelected(nodeId)` ganz am Anfang (nach `if (!node) return;`) einfügen:
   ```js
   if (node.data && node.data.url) { window.open(node.data.url, '_top'); return; }
   ```
   (öffnet die echte Einheit/Situation; `_top` bricht aus dem iframe aus.)

**b) `public/nrlp/modules/config.js`** — neue Kategorien (Toggle/Legende/Preset):
```js
// in CATEGORY_CONFIG ergänzen:
{ cat: 'einheit',   label: 'Einheiten',   color: '#0E6E3A' },
{ cat: 'situation', label: 'Situationen', color: '#6b21a8' },
// in TYPE_LABELS ergänzen:
einheit: 'Einheit',
situation: 'Situation',
// In PRESET_CONFIGS: 'einheit'/'situation' zu visibleCats von `voll`
// (entsteht automatisch via CATEGORY_CONFIG.map) und optional zu `didaktik`.
```

**c) `public/nrlp/modules/ui/details.js`** — Detail-Branch + „Öffnen"-Button. Vor dem finalen `else {` einfügen:
```js
} else if (node.type === 'einheit' || node.type === 'situation') {
  const d = node.data;
  if (d.einheit_titel || d.modul_titel)
    html += `<div class="detail-meta">${escHtml(d.modul_titel || ('Modul ' + (d.modul||'')))}</div>`;
  if (d.titel) html += `<div class="detail-leitidee-kurz">${escHtml(d.titel)}</div>`;
  html += `<a class="nrlp-open-btn" href="${d.url}" target="_top">
             ${node.type === 'einheit' ? 'Einheit öffnen →' : 'Situation öffnen →'}
           </a>`;
```
CSS (ans Ende von `public/nrlp/style.css`):
```css
.nrlp-open-btn{display:inline-block;margin-top:12px;padding:8px 14px;border-radius:8px;
  background:#0E6E3A;color:#fff;text-decoration:none;font-weight:600;font-size:.8rem}
.nrlp-open-btn:hover{background:#094d28}
```

**d) Rolle in den iframe geben.** In `public/nrlp/index.html` vor `app.js` ein kleines Inline-Script, das die Rolle aus dem Query liest (die Astro-Route hängt sie an):
```html
<script>window.NRLP_ROLE = new URLSearchParams(location.search).get('role') || 'lp';</script>
```
und in `src/pages/nrlp.astro` den iframe-`src` zu `/nrlp/index.html?role={profile.role}` setzen.

**e) Indizes aktuell halten.** Das Import-Skript spiegelt die Indizes einmalig. Damit sie nach `sync:situationen` / `build:einheiten-index` frisch bleiben, in `package.json` einen Schritt ergänzen, der nach den Index-Builds `src/data/*.index.json` nach `public/nrlp/` kopiert (oder die Spiegelung in jenen Skripten anhängen).

---

## 4. Phase 3 — Neue Ansichten: Spirale · Chord · Sankey/Sunburst

Neue Datei **`public/nrlp/ext/visualizations.js`** + **`public/nrlp/ext/visualizations.css`**. Nutzt **d3 v7** (per CDN). Rendert in einen eigenen Container `#nrlp-extra`.

### 4.1 CDN + Container (in `public/nrlp/index.html`)
Im `<head>` nach den Stylesheets:
```html
<link rel="stylesheet" href="./ext/visualizations.css">
```
Vor `</body>` (nach `app.js`):
```html
<script src="https://unpkg.com/d3@7/dist/d3.min.js"></script>
<script src="https://unpkg.com/d3-sankey@0.12/dist/d3-sankey.min.js"></script>
<script type="module">
  import { renderExtra } from './ext/visualizations.js';
  window.NRLP_renderExtra = renderExtra;
</script>
```
Container im `#graph-container` (nach `#zirk-panel`):
```html
<section id="nrlp-extra" class="hidden"></section>
```
Drei neue Buttons in der `view-toggle-group` (nach „Zirkularität"):
```html
<button class="view-btn" data-view="spirale">Spirale</button>
<button class="view-btn" data-view="chord">Chord</button>
<button class="view-btn" data-view="sankey">Sankey</button>
```

### 4.2 Controller-Wiring (`modules/app/controller.js`)
In `applyViewMode()` die neuen Modi behandeln: bei `spirale|chord|sankey` `#graph`, `#legend`, `#zirk-panel` ausblenden, `#nrlp-extra` einblenden und rendern:
```js
const EXTRA = ['spirale','chord','sankey'];
const isExtra = EXTRA.includes(state.viewMode);
document.getElementById('nrlp-extra')?.classList.toggle('hidden', !isExtra);
if (graphEl) graphEl.classList.toggle('hidden', isZirk || isExtra);
if (legendEl) legendEl.classList.toggle('hidden', isZirk || isExtra);
if (zirkPanel) zirkPanel.classList.toggle('hidden', !isZirk);
if (isExtra && window.NRLP_renderExtra) {
  window.NRLP_renderExtra(state.viewMode, state.currentNrlp,
    seedIds => focusBySeedIds(seedIds, { refreshGraph, showDetail, switchToGraphView }));
  return;
}
```
(`onViewModeChanged` akzeptiert die neuen `data-view`-Werte bereits, da es generisch `btn.dataset.view` durchreicht.)

### 4.3 `public/nrlp/ext/visualizations.js`
Vollständige, in sich geschlossene Implementierung. Liest dieselbe `zirkularitaet`-Struktur wie der Graph. Klick auf ein Element ruft den `onFocus(seedIds)`-Callback (Sprung zurück in die Netzwerkansicht mit Fokus).

```js
// public/nrlp/ext/visualizations.js
const d3 = () => window.d3;

const MOUNT = () => document.getElementById('nrlp-extra');

// Sammelt alle zirkulären Konzepte (Aspekte + SK + Sprachmodi) mit wiederholungen{}
function collectConcepts(nrlp) {
  const z = nrlp.zirkularitaet || {};
  const out = [];
  (z.gesellschaftsinhalte || []).forEach(g =>
    out.push({ kind: 'Aspekt', label: g.bezeichnung, rep: g.wiederholungen || {}, color: '#9b59b6', seed: `G__${g.bezeichnung}` }));
  (z.schluesselkompetenzen || []).forEach(s =>
    out.push({ kind: 'SK', label: s.bezeichnung, rep: s.wiederholungen || {}, color: '#f97316', seed: `SK__${s.bezeichnung}` }));
  (z.sprachmodi || []).forEach(s =>
    out.push({ kind: 'Sprachmodus', label: s.bezeichnung, rep: s.wiederholungen || {}, color: '#e91e63', seed: `SM__${s.bezeichnung}` }));
  return out;
}

function themaOrder(nrlp) {
  return (nrlp.themen || [])
    .map(t => ({ id: `T${t.nr}`, nr: t.nr, titel: t.titel, lehrjahr: t.lehrjahr }))
    .sort((a, b) => a.nr - b.nr);
}

// --- SPIRALE: jedes Konzept ein Faden, der über die Themen nach außen spiralt;
//     Punkt je Vorkommen, Radius wächst mit der Iteration (R1<R2<...). ----------
function renderSpirale(nrlp, onFocus) {
  const D = d3(); const mount = MOUNT(); mount.innerHTML = '';
  const W = mount.clientWidth || 900, H = Math.max(560, mount.clientHeight || 600);
  const cx = W / 2, cy = H / 2, rMax = Math.min(W, H) / 2 - 40, rMin = 36;
  const themen = themaOrder(nrlp);
  const tIndex = new Map(themen.map((t, i) => [t.id, i]));
  const concepts = collectConcepts(nrlp).filter(c => Object.keys(c.rep).length);
  const turns = 2.4; // Windungen
  const angleFor = i => (i / Math.max(1, themen.length - 1)) * turns * 2 * Math.PI - Math.PI / 2;
  const radiusFor = i => rMin + (i / Math.max(1, themen.length - 1)) * (rMax - rMin);

  const svg = D.select(mount).append('svg').attr('viewBox', `0 0 ${W} ${H}`).attr('width', '100%').attr('height', H);
  // Themen-Speichen + Labels
  themen.forEach((t, i) => {
    const a = angleFor(i), r = radiusFor(i);
    const x = cx + r * Math.cos(a), y = cy + r * Math.sin(a);
    svg.append('circle').attr('cx', cx).attr('cy', cy).attr('r', r).attr('fill', 'none').attr('stroke', '#eee');
    svg.append('text').attr('x', x).attr('y', y).attr('font-size', 11).attr('fill', '#374151')
      .attr('text-anchor', 'middle').text(t.id).append('title').text(`${t.id}: ${t.titel}`);
  });

  const line = D.line().curve(D.curveCardinal).x(d => d.x).y(d => d.y);
  concepts.forEach((c, ci) => {
    const pts = Object.keys(c.rep)
      .filter(tid => tIndex.has(tid))
      .sort((a, b) => tIndex.get(a) - tIndex.get(b))
      .map(tid => {
        const i = tIndex.get(tid);
        const rep = parseInt(String(c.rep[tid]).replace(/\D/g, ''), 10) || 1;
        const jitter = (ci % 7) * 3 - 9;
        const a = angleFor(i), r = radiusFor(i) + jitter + rep * 2;
        return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a), tid, rep };
      });
    if (pts.length < 1) return;
    const g = svg.append('g').attr('class', 'spiral-thread').style('cursor', 'pointer')
      .on('click', () => onFocus && onFocus([c.seed]));
    if (pts.length > 1) g.append('path').attr('d', line(pts)).attr('fill', 'none')
      .attr('stroke', c.color).attr('stroke-width', 2).attr('opacity', 0.55);
    g.selectAll('circle').data(pts).join('circle')
      .attr('cx', d => d.x).attr('cy', d => d.y).attr('r', d => 3 + d.rep)
      .attr('fill', c.color).attr('opacity', 0.9)
      .append('title').text(d => `${c.label} — ${d.tid} (R${d.rep})`);
    // Label am letzten Punkt
    const last = pts[pts.length - 1];
    g.append('text').attr('x', last.x + 6).attr('y', last.y).attr('font-size', 9)
      .attr('fill', c.color).text(c.label.length > 22 ? c.label.slice(0, 21) + '…' : c.label);
  });
  caption(mount, 'Spirallehrplan — jeder Faden ein Konzept, das über die Themen wiederkehrt; größere Punkte = tiefere Iteration (R). Klick fokussiert im Netzwerk.');
}

// --- CHORD: Ko-Vorkommen von Konzepten, die sich Themen teilen -----------------
function renderChord(nrlp, onFocus) {
  const D = d3(); const mount = MOUNT(); mount.innerHTML = '';
  const concepts = collectConcepts(nrlp).filter(c => Object.keys(c.rep).length);
  const n = concepts.length;
  const matrix = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    if (i === j) continue;
    const ti = new Set(Object.keys(concepts[i].rep));
    const shared = Object.keys(concepts[j].rep).filter(t => ti.has(t)).length;
    matrix[i][j] = shared;
  }
  const W = mount.clientWidth || 900, H = Math.max(560, mount.clientHeight || 600);
  const R = Math.min(W, H) / 2 - 90, ir = R - 14;
  const svg = D.select(mount).append('svg').attr('viewBox', `0 0 ${W} ${H}`).attr('width', '100%').attr('height', H)
    .append('g').attr('transform', `translate(${W / 2},${H / 2})`);
  const chord = D.chord().padAngle(0.04).sortSubgroups(D.descending)(matrix);
  const arc = D.arc().innerRadius(ir).outerRadius(R);
  const ribbon = D.ribbon().radius(ir);
  svg.append('g').selectAll('path').data(chord.groups).join('path')
    .attr('d', arc).attr('fill', d => concepts[d.index].color).attr('opacity', 0.85)
    .style('cursor', 'pointer').on('click', (e, d) => onFocus && onFocus([concepts[d.index].seed]))
    .append('title').text(d => concepts[d.index].label);
  svg.append('g').attr('fill-opacity', 0.55).selectAll('path').data(chord).join('path')
    .attr('d', ribbon).attr('fill', d => concepts[d.source.index].color)
    .append('title').text(d => `${concepts[d.source.index].label} ↔ ${concepts[d.target.index].label}: ${d.source.value} gemeinsame Themen`);
  // Labels
  svg.append('g').selectAll('text').data(chord.groups).join('text')
    .each(d => { d.angle = (d.startAngle + d.endAngle) / 2; })
    .attr('transform', d => `rotate(${(d.angle * 180 / Math.PI) - 90}) translate(${R + 6}) ${d.angle > Math.PI ? 'rotate(180)' : ''}`)
    .attr('text-anchor', d => d.angle > Math.PI ? 'end' : null)
    .attr('font-size', 9).attr('fill', '#374151')
    .text(d => { const l = concepts[d.index].label; return l.length > 18 ? l.slice(0, 17) + '…' : l; });
  caption(mount, 'Chord — Konzepte, die sich Themen teilen; dickere Bänder = mehr gemeinsame Themen. Klick auf einen Bogen fokussiert im Netzwerk.');
}

// --- SANKEY: Lehrjahr → Thema → Aspekt (Fluss der Inhalte) ---------------------
function renderSankey(nrlp, onFocus) {
  const D = d3(); const sankey = window.d3; const mount = MOUNT(); mount.innerHTML = '';
  const themen = themaOrder(nrlp);
  const aspekte = (nrlp.zirkularitaet?.gesellschaftsinhalte || []);
  const nodes = []; const nodeIndex = new Map();
  function node(id, name, col) { if (!nodeIndex.has(id)) { nodeIndex.set(id, nodes.length); nodes.push({ id, name, col }); } return nodeIndex.get(id); }
  const links = [];
  themen.forEach(t => {
    const lj = `LJ${t.lehrjahr}`;
    node(lj, `Lehrjahr ${t.lehrjahr}`, '#3b82f6');
    node(t.id, `${t.id}`, '#22c55e');
    links.push({ source: nodeIndex.get(lj), target: nodeIndex.get(t.id), value: 1, seed: t.id });
  });
  aspekte.forEach(a => {
    const aid = `A__${a.bezeichnung}`;
    node(aid, a.bezeichnung, '#9b59b6');
    Object.keys(a.wiederholungen || {}).forEach(tid => {
      if (!nodeIndex.has(tid)) return;
      links.push({ source: nodeIndex.get(tid), target: nodeIndex.get(aid), value: 1, seed: `G__${a.bezeichnung}` });
    });
  });
  const W = mount.clientWidth || 900, H = Math.max(560, mount.clientHeight || 600);
  const svg = D.select(mount).append('svg').attr('viewBox', `0 0 ${W} ${H}`).attr('width', '100%').attr('height', H);
  const sk = sankey.sankey().nodeWidth(14).nodePadding(10).extent([[8, 8], [W - 8, H - 8]]);
  const graph = sk({ nodes: nodes.map(d => ({ ...d })), links: links.map(d => ({ ...d })) });
  svg.append('g').attr('fill', 'none').selectAll('path').data(graph.links).join('path')
    .attr('d', sankey.sankeyLinkHorizontal()).attr('stroke', d => d.target.col || '#bbb')
    .attr('stroke-width', d => Math.max(1, d.width)).attr('opacity', 0.4);
  const gn = svg.append('g').selectAll('g').data(graph.nodes).join('g').style('cursor', 'pointer')
    .on('click', (e, d) => { if (d.seed && onFocus) onFocus([d.seed]); });
  gn.append('rect').attr('x', d => d.x0).attr('y', d => d.y0)
    .attr('width', d => d.x1 - d.x0).attr('height', d => Math.max(1, d.y1 - d.y0))
    .attr('fill', d => d.col || '#888').append('title').text(d => d.name);
  gn.append('text').attr('x', d => d.x0 < W / 2 ? d.x1 + 4 : d.x0 - 4)
    .attr('y', d => (d.y0 + d.y1) / 2).attr('dy', '0.35em')
    .attr('text-anchor', d => d.x0 < W / 2 ? 'start' : 'end')
    .attr('font-size', 9).attr('fill', '#374151')
    .text(d => d.name.length > 22 ? d.name.slice(0, 21) + '…' : d.name);
  caption(mount, 'Sankey — Fluss Lehrjahr → Thema → Aspekt. Klick auf Thema/Aspekt fokussiert im Netzwerk.');
}

function caption(mount, text) {
  const p = document.createElement('p');
  p.className = 'nrlp-extra-caption';
  p.textContent = text;
  mount.appendChild(p);
}

export function renderExtra(mode, nrlp, onFocus) {
  if (!nrlp || !window.d3) { MOUNT().innerHTML = '<p style="padding:20px">d3 lädt …</p>'; return; }
  if (mode === 'spirale') return renderSpirale(nrlp, onFocus);
  if (mode === 'chord') return renderChord(nrlp, onFocus);
  if (mode === 'sankey') return renderSankey(nrlp, onFocus);
}
```

### 4.4 `public/nrlp/ext/visualizations.css`
```css
#nrlp-extra{position:absolute;inset:0;overflow:auto;background:var(--bg,#fff);padding:8px}
#nrlp-extra.hidden{display:none}
#nrlp-extra svg{display:block;margin:0 auto}
.nrlp-extra-caption{max-width:720px;margin:10px auto 0;color:#6b7280;font-size:.8rem;text-align:center}
```

> **Sunburst-Alternative:** Falls statt Sankey ein radiales Sunburst (Thema › Lebensbezug › Kompetenz) gewünscht ist, denselben `#nrlp-extra`-Container mit `d3.partition()` + `d3.arc()` über `nrlp.themen[].lebensbezuege[].kompetenzen[]` füllen. Sankey ist als Default gewählt, weil es den **Fluss** der Querschnitts-Aspekte über die Lehrjahre am direktesten zeigt.

---

## 5. Phase 4 — Verifizieren

```bash
npm run build          # Astro-Build muss grün sein
npm run sync:situationen && npm run build:einheiten-index   # Indizes frisch
# danach Index-Spiegelung nach public/nrlp/ (siehe §3e)
npm run preview
```

Checkliste:
- [ ] `/nrlp` lädt in BBW-Chrome; iframe zeigt die App, `← Hauptplattform` funktioniert.
- [ ] Dataset-Picker schaltet zwischen **2j / 3j / 4j**; jeder Datensatz rendert ohne Konsole-Fehler.
- [ ] Einheiten erscheinen als grüne ★-Knoten an ihren Kompetenzen; Klick öffnet `/einheiten/<id>` (bricht aus iframe via `_top`).
- [ ] Situationen erscheinen als violette ◇-Knoten an ihren Lebensbezügen; Klick öffnet `/situationen/<id>`.
- [ ] `status:"entwurf"`-Einheiten sind für lp/gast unsichtbar, für kt1 sichtbar (Rolle via `?role=`).
- [ ] Ansichten **Spirale / Chord / Sankey** rendern; Klick springt zurück in den fokussierten Graph.
- [ ] Zirkularität-Ansicht (Heatmap/Swimlane/Karten) unverändert funktionsfähig.
- [ ] Kein Vercel-SSR-Bruch (alles unter `public/` ist statisch).

## 6. Deploy
`git add public/nrlp public/shared public/modals src/pages/nrlp.astro scripts/import-nrlp-graph.ps1 docs/handoff-nrlp-graph.md` (+ geänderte `index.astro`/`jahresplanung.astro`/`package.json`) → commit → Vercel.

---

## Offene Designfragen (für später)
- **gast** evtl. von `/nrlp` ausschließen oder nur Netzwerk/Zirkularität ohne Deep-Links zeigen.
- Eigene **Materialien** (`/einreichen`-Beiträge) ebenfalls als Knoten? Hätte dieselbe Anknüpfung über `kompetenz_nr`/`kompetenz_nrs[]`.
- Label-Drift: die in hko-deploy gebündelten `nrlp_*.json` sind älter (z. B. „Identität & Sozialisation"). bbw-hkos Dateien sind kanonisch — Import-Skript kopiert sie bewusst nicht mit.
- Nexus (markdown-basierter Knowledge-Graph aus hko-deploy) als möglicher 2. Schritt — separates, größeres Projekt.
