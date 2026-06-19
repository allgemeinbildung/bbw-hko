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

// --- CHORD: Ko-Vorkommen von Konzepten, die sich Themen teilen -----------------
//     Klick auf einen Bogen hebt seine Verbindungen hervor (Auswahl); Hover zeigt
//     eine Vorschau; Klick in die Fläche oder erneut auf den Bogen hebt sie auf.
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
  const svgRoot = D.select(mount).append('svg').attr('viewBox', `0 0 ${W} ${H}`).attr('width', '100%').attr('height', H);
  const svg = svgRoot.append('g').attr('transform', `translate(${W / 2},${H / 2})`);
  const chord = D.chord().padAngle(0.04).sortSubgroups(D.descending)(matrix);
  const arc = D.arc().innerRadius(ir).outerRadius(R);
  const ribbon = D.ribbon().radius(ir);

  // Welche Konzepte teilen mindestens ein Thema mit i? (für das Dimmen der Bögen)
  const neighbors = i => {
    const s = new Set([i]);
    chord.forEach(r => {
      if (r.source.index === i) s.add(r.target.index);
      if (r.target.index === i) s.add(r.source.index);
    });
    return s;
  };

  const arcs = svg.append('g').selectAll('path').data(chord.groups).join('path')
    .attr('d', arc).attr('fill', d => concepts[d.index].color)
    .attr('stroke', '#fff').attr('stroke-width', 0.5)
    .attr('opacity', 0.85).style('cursor', 'pointer');
  arcs.append('title').text(d => concepts[d.index].label);

  const ribbons = svg.append('g').attr('fill-opacity', 0.55).selectAll('path').data(chord).join('path')
    .attr('d', ribbon).attr('fill', d => concepts[d.source.index].color);
  ribbons.append('title').text(d => `${concepts[d.source.index].label} ↔ ${concepts[d.target.index].label}: ${d.source.value} gemeinsame Themen`);

  const labels = svg.append('g').style('pointer-events', 'none').selectAll('text').data(chord.groups).join('text')
    .each(d => { d.angle = (d.startAngle + d.endAngle) / 2; })
    .attr('transform', d => `rotate(${(d.angle * 180 / Math.PI) - 90}) translate(${R + 6}) ${d.angle > Math.PI ? 'rotate(180)' : ''}`)
    .attr('text-anchor', d => d.angle > Math.PI ? 'end' : null)
    .attr('font-size', 9).attr('fill', '#374151')
    .text(d => { const l = concepts[d.index].label; return l.length > 18 ? l.slice(0, 17) + '…' : l; });

  // Hervorhebung: i = ausgewählter Bogen, oder null = alles zurücksetzen.
  function apply(i) {
    if (i == null) {
      arcs.attr('opacity', 0.85).attr('stroke-width', 0.5);
      ribbons.attr('fill-opacity', 0.55);
      labels.attr('opacity', 1).attr('font-weight', null);
      return;
    }
    const near = neighbors(i);
    arcs.attr('opacity', d => near.has(d.index) ? 0.95 : 0.12)
      .attr('stroke-width', d => d.index === i ? 2 : 0.5);
    ribbons.attr('fill-opacity', d => (d.source.index === i || d.target.index === i) ? 0.85 : 0.04);
    labels.attr('opacity', d => near.has(d.index) ? 1 : 0.15)
      .attr('font-weight', d => d.index === i ? 700 : null);
  }

  let selected = null;
  arcs
    .on('mouseover', (e, d) => { if (selected == null) apply(d.index); })
    .on('mouseout', () => { if (selected == null) apply(null); })
    .on('click', (e, d) => {
      e.stopPropagation();
      selected = (selected === d.index) ? null : d.index;
      apply(selected);
    })
    // Doppelklick: ins Netzwerk wechseln und das Konzept dort fokussieren.
    .on('dblclick', (e, d) => { e.stopPropagation(); onFocus && onFocus([concepts[d.index].seed]); });

  // Klick in die freie Fläche hebt die Auswahl auf.
  svgRoot.on('click', () => { selected = null; apply(null); });

  caption(mount, 'Chord — Konzepte, die sich Themen teilen; dickere Bänder = mehr gemeinsame Themen. Klick auf einen Bogen hebt seine Verbindungen hervor (Klick in die Fläche hebt auf); Doppelklick fokussiert das Konzept im Netzwerk.');
}

function caption(mount, text) {
  const p = document.createElement('p');
  p.className = 'nrlp-extra-caption';
  p.textContent = text;
  mount.appendChild(p);
}

export function renderExtra(mode, nrlp, onFocus) {
  if (!nrlp || !window.d3) { MOUNT().innerHTML = '<p style="padding:20px">d3 lädt …</p>'; return; }
  if (mode === 'chord') return renderChord(nrlp, onFocus);
}
