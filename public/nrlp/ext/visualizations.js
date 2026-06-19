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
