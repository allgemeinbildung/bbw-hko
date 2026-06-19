# Handoff — Prompt-Builder in bbw-hko (Port + nRLP-Verbesserungen)

**Ziel.** Den Prompt-Builder (heute `abu-hko.ch/nrlp/prompt-builder/`, hko-deploy) nach **bbw-hko** bringen — als Unter-App des nRLP-Graphen unter `/nrlp/prompt-builder/`, in BBW-Chrome, rollenbewusst. Plus gezielte Verbesserungen, die enger an die `nrlp_*.json` andocken.

**Was der Builder tut.** Lehrperson wählt Thema → Lebensbezug → Kompetenz(en) aus der nRLP; das Tool zieht automatisch die `gesellschaftliche_inhalte` + `sprachmodi` (mit `detail`) jeder Kompetenz und die Thema-`schluesselkompetenzen`, und baut daraus einen ausgefeilten LLM-Prompt für 6 Output-Typen (Lernsituation, Aufgabe, Raster, Prüfung, Arbeitsblatt, Reflexion) + eine 6-Schritt-Combo-Kette. Drei Modi: A Lehrplankonform, B Freie Auswahl, C Combo.

**Voraussetzung.** Der Graph-Import-Schritt (`docs/handoff-nrlp-graph.md`, Phase 0) ist gelaufen — `scripts/import-nrlp-graph.ps1` kopiert jetzt **auch** den Prompt-Builder nach `public/nrlp/prompt-builder/`, patcht die Dataset-Pfade auf `/nrlp_*.json` und stellt die `einheiten.index.json`/`situationen.index.json` unter `public/nrlp/` bereit (von der Unter-App via `../` erreichbar).

---

## Entscheide aus dem Review (verbindlich)

- **Offizielle `umsetzungsbeispiele` kommen** (~Ende Juni 2026, Stand 2026-06-19). Das `nrlp.umsetzungsbeispiele`-Feld ist heute `[]`. → Den bestehenden Pfad **nicht** entfernen; einen sichtbaren **Hinweis** zeigen und als **Interim** die echten Einheiten/Situationen als Orientierungsbeispiel nutzen. Sobald die offiziellen Beispiele publiziert sind, haben sie Vorrang (automatisch).
- **R-Progression** (R1/R2/R3-Hinweise) heute nur für Gesellschaftsinhalte → **auf SK und Sprachmodi ausweiten**.
- **Lektionen** in den Prompt aufnehmen, aber als **Lehrpersonen-Entscheid** rahmen; der Prompt weiß, dass ABU **3 Lektionen à 45 Min pro Woche** umfasst.
- **nRLP sind vollständig** → **keine** Vollständigkeits-/Skizze-Warnung nötig.
- **Kurze SK-Labels** zur Lesbarkeit (Graph + Builder), **Volltext in Sidebar/Tooltip**.

---

## 1. Astro-Route + Chrome + Verlinkung

Neue Datei `src/pages/prompt-builder.astro` (analog zu `nrlp.astro`):

```astro
---
import Base from "../layouts/Base.astro";
const { user } = Astro.locals;
if (!user) return Astro.redirect("/login");
const role = (user && Astro.locals.profile?.role) || "lp";
---
<Base title="Prompt-Builder — ABU Reform 2030">
  <header class="nrlp-bar">
    <a class="back" href="/nrlp">← nRLP-Netzwerk</a>
    <span class="title">Prompt-Builder</span>
    <span class="sub">LLM-Prompts aus dem Lehrplan generieren</span>
  </header>
  <iframe id="pb-frame" src={`/nrlp/prompt-builder/index.html?role=${role}`} title="Prompt-Builder" loading="lazy"></iframe>
  <style>
    .nrlp-bar{display:flex;align-items:center;gap:.75rem;padding:.6rem 1rem;border-bottom:1px solid var(--brand-tint);background:#fff}
    .nrlp-bar .back{color:var(--brand-dark);font-weight:600;text-decoration:none}
    .nrlp-bar .title{font-weight:700}.nrlp-bar .sub{color:#6b7280;font-size:.85rem}
    #pb-frame{display:block;width:100%;height:calc(100vh - 52px);border:0}
  </style>
</Base>
```

**Verlinkung:**
- Im Graph-Header (`public/nrlp/index.html`) einen Button „Prompt-Builder →" → `prompt-builder/index.html` (gibt es im Original schon als Rück-Link `../index.html`; hier die Vorwärts-Richtung ergänzen).
- Hub `src/pages/index.astro`: kleiner Link unter der nRLP-Karte „Prompt-Builder".
- **Zwei-Wege-Link (empfohlen, optional):** Im Graph-Detail einer Kompetenz ein „Prompt erzeugen →", das `prompt-builder/index.html?thema=<n>&lb=<nr>&komp=<nr>` öffnet; `app.js init()` liest diese Query-Parameter und ruft `selectThema/selectLB/toggleKomp` vorbefüllt auf. (Klein, macht beide Tools zu einem Workflow.)

---

## 2. #1 — Orientierungsbeispiel: Hinweis + Interim aus echten Units

**a) Index einmalig laden.** In `public/nrlp/prompt-builder/app.js`, `init()` ergänzen (vor `renderLeft()`):
```js
window.__NRLP_ROLE = new URLSearchParams(location.search).get('role') || 'lp';
try {
  const [eh, sit] = await Promise.all([
    fetch('../einheiten.index.json').then(r => r.ok ? r.json() : []),
    fetch('../situationen.index.json').then(r => r.ok ? r.json() : []),
  ]);
  window.__UNITS = { einheiten: eh, situationen: sit };
} catch (_) { window.__UNITS = { einheiten: [], situationen: [] }; }
```

**b) Fallback-Helper.** Neue Datei `public/nrlp/prompt-builder/orientierung.js`:
```js
// Interim-Orientierungsbeispiel aus echten bbw-hko-Units, solange
// nrlp.umsetzungsbeispiele leer ist (offizielle folgen ~Ende Juni 2026).
const DATASET_LEHRGANG = { '3j':'EFZ_3J', '4j':'EFZ_4J', '2j':'EBA_2J' };

function lehrgangArr(v){ return Array.isArray(v)?v:(v?[v]:[]); }

export function orientierungAusUnits(S, datasetPath) {
  const U = window.__UNITS || { einheiten:[], situationen:[] };
  const m = String(datasetPath).match(/nrlp_(\dj)/);
  const want = DATASET_LEHRGANG[m ? m[1] : '3j'];
  const kNrs = new Set((S.kompetenzen||[]).map(k => k.nr));
  const lbNr = (S.lebensbezuege||[])[0]?.nr;

  // 1) passende Einheit (Kompetenz-Treffer, Lehrgang passend, nicht Entwurf für lp/gast)
  const role = window.__NRLP_ROLE || 'lp';
  const eh = (U.einheiten||[]).find(e => {
    const lg = lehrgangArr(e.lehrgang);
    const lgOk = !lg.length || lg.includes(want);
    const draftOk = (role==='kt1'||role==='reviewer') ? true : e.status !== 'entwurf';
    const komp = (e.abgedeckte_kompetenzen||[e.kompetenz_nr]).some(n => kNrs.has(n));
    return lgOk && draftOk && komp;
  });
  if (eh) {
    const hf = eh.hf_titel ? Object.values(eh.hf_titel)[0] : (eh.einheit_titel||eh.titel);
    return { quelle:`Einheit ${eh.id}`, herausforderung: hf, produkt: eh.einheit_titel || eh.titel };
  }
  // 2) sonst passende Situation über Lebensbezug
  const sit = (U.situationen||[]).find(s => s.lebensbezug_nr === lbNr || s.modul === lbNr);
  if (sit) return { quelle:`Situation ${sit.id}`, herausforderung: sit.leitfrage || sit.titel, produkt: sit.handlungsprodukt_format || sit.handlungsprodukt_titel || '' };
  return null;
}
```

**c) In `prompts.js` einbinden.** Import oben: `import { orientierungAusUnits } from './orientierung.js';`
In `sharedBlocks(S, nrlp)` die `beispiel*`-Zeilen ersetzen:
```js
const offiziell = firstBeispiel(S); // aus nrlp.umsetzungsbeispiele (sobald publiziert)
const interim = offiziell ? null : orientierungAusUnits(S, nrlp?._datasetPath);
const beH = offiziell?.herausforderung || interim?.herausforderung
  || 'Noch kein Orientierungsbeispiel — offizielle Umsetzungsbeispiele folgen (~Ende Juni 2026).';
const beP = offiziell?.produkt || interim?.produkt
  || 'Noch kein Produktbeispiel verfügbar.';
// ... beispielHerausforderung: beH, beispielProdukt: beP,
const beQuelle = offiziell ? 'nRLP-Umsetzungsbeispiel' : (interim?.quelle || '—');
```
und im Prompt-Block (`lernsituation`/`combo`) die Quelle transparent machen:
```js
`ORIENTIERUNGSBEISPIEL (${C.beQuelle} — nicht 1:1 kopieren, nur als Massstab):`,
```
> `nrlp._datasetPath` in `app.js loadDataset()` setzen: `nrlp._datasetPath = path;` direkt nach `nrlp = await res.json();`.

**d) UI-Hinweis.** In `index.html` unter der `dataset-bar` ein dezenter Banner:
```html
<div class="pb-note">Offizielle Umsetzungsbeispiele folgen (~Ende Juni 2026). Bis dahin dient eine passende Einheit/Situation als Orientierung.</div>
```
CSS (style.css): `.pb-note{font-size:.78rem;color:#6b21a8;background:#f5f3ff;border:1px solid #e9d5ff;border-radius:6px;padding:6px 10px;margin:8px 0}`

---

## 3. #2 — R-Progression für SK + Sprachmodi

Heute liefert nur `formatGesellschaft()` einen R-Hinweis. Verallgemeinern in `prompts.js`:

```js
// generisch: R-Wert eines Konzepts im aktuellen Thema aus zirkularitaet ziehen
function rWertFor(nrlp, bucket, name, themaNr) {
  const list = nrlp?.zirkularitaet?.[bucket] || [];
  const hit = list.find(x => x.bezeichnung === name);
  return hit?.wiederholungen?.[`T${themaNr}`] || null;
}
```
- In `formatSprachmodi` einen zweiten Parameter `(sprachmodi, nrlp, themaNr)` ergänzen und je Modus `rWertFor(nrlp,'sprachmodi', sm.modus||sm, themaNr)` + `giProgressionHint(r)` anhängen (gleiche Hint-Texte wie bei GI).
- In `formatSchluesselkompetenzen` analog mit `bucket='schluesselkompetenzen'`.
- Aufrufer in `sharedBlocks` entsprechend mit `nrlp` + `S.thema?.nr` versorgen.
- **UI:** in `render.js` neben SM-/SK-Zeilen ein kleines R-Badge zeigen (`rWertFor(...)`), Farbe heller→dunkler R1→R3 — dieselbe Logik wie die Zirkularität-Heatmap des Graphen.

---

## 4. Lektionen + ABU-Rhythmus in den Prompt

In `sharedBlocks` ergänzen:
```js
lektionenThema: S.thema?.lektionen || null,
lektionenLB: (firstLebensbezug(S)?.lektionen) || null,
```
Im Kontextkopf jedes Templates (nach der Lehrjahr-Zeile) einfügen:
```js
'ABU umfasst 3 Lektionen à 45 Min pro Woche. Wie viele Lektionen du einsetzt, entscheidest du als Lehrperson.',
C.lektionenLB ? `Richtwert nRLP für diesen Lebensbezug: ca. ${C.lektionenLB} Lektionen (Thema gesamt: ${C.lektionenThema}).` : '',
```
(Leere Zeile via `.filter(Boolean)` am Ende des `[...]` vermeiden oder leere Strings stehen lassen — sie erzeugen nur Leerzeilen.)

---

## 5. Kurze SK-Labels (Builder + Graph)

Die nRLP speichert SK auf Thema-Ebene als **volle Bildungsrat-Sätze**; im Builder (Free-Flow-Chips) und im Graph (SK-Knoten) sind die als Label zu lang. bbw-hko hat die Kurz↔Lang-Map in `src/lib/sk-labels.ts` — die statischen Apps können TS nicht importieren, daher eine kleine JS-Spiegelung:

Neue Datei `public/nrlp/ext/sk-labels.js` (vom Import-Skript nicht überschrieben):
```js
// Spiegel von src/lib/sk-labels.ts — kurz ↔ voll. Bei Änderungen dort hier nachziehen.
export const SK_FULL_TO_SHORT = {
  // "Sich selbst Ziele setzen, die Zielsetzung überprüfen und sich adaptiv verhalten": "Ziele setzen & adaptiv handeln",
  // ... vollständige Map aus sk-labels.ts übernehmen ...
};
export function skShort(full){ return SK_FULL_TO_SHORT[full] || full; }
```
- **Builder** (`render.js`, Free-Flow SK-Chips): Chip-Text = `skShort(sk)`, `title="${sk}"` (Volltext im Tooltip), Toggle-Wert bleibt der Volltext (Prompt nutzt weiterhin den vollen Satz).
- **Graph** (`modules/data/buildGraph.js`, SK-Knoten): `label: skShort(sk.bezeichnung)` setzen, `name`/Detail-Sidebar behält den Volltext (`details.js` zeigt `node.name`). → ergänzt `docs/handoff-nrlp-graph.md`.

> Sobald sich `sk-labels.ts` ändert, die JS-Spiegelung anpassen (oder mittelfristig die Map per Build-Step aus der TS-Quelle generieren).

---

## 6. Bewusst NICHT umgesetzt
- **Vollständigkeits-/Skizze-Warnung** — entfällt (nRLP sind vollständig).

## 7. Spätere Optionen (nicht in dieser Runde)
- **#3 Sprachmodus↔SK-Vorschläge** via `zirkularitaet.sprachmodi[].bezuege.schluesselkompetenzen`.
- **#8 „An Material-Intake übergeben"** — `/einreichen` mit `kompetenz_nr(s)`, `schluesselkompetenzen[]`, `aspekte[]`, `sprachmodus` vorbefüllen (Intake-Blöcke A/B/H/K passen 1:1).

---

## 8. Verifizieren
```bash
npm run build && npm run preview
```
- [ ] `/prompt-builder` lädt in BBW-Chrome; `← nRLP-Netzwerk` funktioniert; iframe ok.
- [ ] Dataset-Picker 2j/3j/4j; jede Auswahl baut Prompts ohne Konsole-Fehler.
- [ ] Orientierungsbeispiel zeigt eine echte Einheit/Situation (Interim) + Hinweis-Banner sichtbar.
- [ ] R-Hinweise erscheinen jetzt auch für SK und Sprachmodi.
- [ ] Prompt enthält die ABU-3×45-Min-Zeile + nRLP-Lektionen-Richtwert.
- [ ] SK-Chips/Knoten zeigen Kurzlabels, Volltext im Tooltip/Sidebar.
- [ ] Copy/Download funktionieren; kein Vercel-SSR-Bruch (alles statisch unter `public/`).

## 9. Wenn die offiziellen Umsetzungsbeispiele publiziert sind (~Ende Juni 2026)
- `nrlp_*.json` mit befülltem `umsetzungsbeispiele[]` aktualisieren → der Builder nimmt sie automatisch (Vorrang vor dem Interim). Den `.pb-note`-Banner dann entfernen.
