import { LEHRJAHR_COLORS } from '../config.js';
import { getState } from '../state.js';
import { rBadgeColor } from '../utils/color.js';
import { escAttr, escHtml } from '../utils/dom.js';

export function updateSubtitle(nrlp) {
  const subtitle = document.getElementById('dataset-subtitle');
  const titel = nrlp?.meta?.titel || 'ABU Schullehrplan';
  const typ = nrlp?.meta?.typ || '';
  subtitle.textContent = typ ? `${titel} — ${typ}` : `${titel} — Zürich`;
}

export function renderLegend(nrlp) {
  const legend = document.getElementById('legend');
  const jahre = [...new Set((nrlp.themen || []).map(t => t.lehrjahr).filter(Boolean))].sort((a, b) => a - b);
  const rows = [];
  jahre.forEach(j => {
    rows.push(`<div class="l-row"><span class="l-dot" style="background:${LEHRJAHR_COLORS[j] || '#888'}"></span>Themen — ${j}. Lehrjahr</div>`);
  });
  rows.push('<div class="l-row"><span class="l-dot" style="background:#6366f1"></span>Lebensbezüge</div>');
  rows.push('<div class="l-row"><span class="l-dot" style="background:#14b8a6"></span>Kompetenzen</div>');
  rows.push('<div class="l-row"><span class="l-dot" style="background:#9b59b6"></span>Gesellschaftsinhalte</div>');
  rows.push('<div class="l-row"><span class="l-dot" style="background:#e91e63"></span>Sprachmodi</div>');
  rows.push('<div class="l-row"><span class="l-dot" style="background:#f97316"></span>Schlüsselkompetenzen</div>');
  rows.push('<div class="l-row"><span class="l-dot" style="background:#10b981"></span>Umsetzungsbeispiele</div>');
  rows.push('<div class="l-row"><span class="l-dot" style="background:#06b6d4"></span>Scaffolds</div>');
  rows.push('<div class="l-row"><span class="l-dot" style="background:#f59e0b"></span>Bewertung</div>');
  legend.innerHTML = rows.join('');
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

function bindZirkActions(panel, focusBySeedIds) {
  panel.querySelectorAll('[data-node-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      const nodeId = btn.getAttribute('data-node-id');
      if (!nodeId) return;
      focusBySeedIds([nodeId]);
    });
  });
  panel.querySelectorAll('[data-focus-ids]').forEach(el => {
    el.addEventListener('click', () => {
      const ids = (el.getAttribute('data-focus-ids') || '').split('|').filter(Boolean);
      if (!ids.length) return;
      focusBySeedIds(ids);
    });
  });
}

function getFilteredRepeats(item, allowedThemes, minR) {
  return Object.entries(item.wiederholungen || {})
    .map(([thema, iter]) => ({ thema, iter, r: parseInt(String(iter).replace(/\D/g, ''), 10) || 1 }))
    .filter(x => allowedThemes.has(x.thema) && x.r >= minR)
    .sort((a, b) => parseInt(a.thema.slice(1), 10) - parseInt(b.thema.slice(1), 10));
}

// ─── Heatmap Grid ─────────────────────────────────────────────────────────────

function renderHeatmapGrid(container, groups, themes, allowedThemes, minR, focusBySeedIds) {
  const themeList = themes.filter(t => allowedThemes.has(`T${t.nr}`));
  const themeKeys = themeList.map(t => `T${t.nr}`);
  const colCount = themeKeys.length + 1; // +1 for label column

  // Build theme header with Lehrjahr color bands
  const lehrjahrBands = {};
  themeList.forEach(t => {
    if (!lehrjahrBands[t.lehrjahr]) lehrjahrBands[t.lehrjahr] = [];
    lehrjahrBands[t.lehrjahr].push(`T${t.nr}`);
  });

  // Two-row header: Lehrjahr spans + theme labels
  let lehrjahrHeaderCells = '<th></th>'; // label col
  let themeHeaderCells = '<th class="zirk-concept-col-header">Konzept</th>';

  Object.entries(lehrjahrBands).sort(([a], [b]) => a - b).forEach(([lj, ts]) => {
    const color = LEHRJAHR_COLORS[parseInt(lj)] || '#888';
    lehrjahrHeaderCells += `<th colspan="${ts.length}" style="background:${color}22;color:${color};border-bottom:2px solid ${color}40">${lj}. Lehrjahr</th>`;
  });
  themeList.forEach(t => {
    const color = LEHRJAHR_COLORS[t.lehrjahr] || '#888';
    themeHeaderCells += `<th class="zirk-theme-col" style="color:${color}">T${t.nr}</th>`;
  });

  let rowHtml = '';
  let totalConcepts = 0;

  groups.forEach(g => {
    const matchingItems = (g.items || []).filter(item => getFilteredRepeats(item, allowedThemes, minR).length > 0);
    if (!matchingItems.length) return;

    rowHtml += `<tr class="zirk-group-header"><td colspan="${colCount}">${escHtml(g.label)}</td></tr>`;

    matchingItems.forEach(item => {
      const repeats = getFilteredRepeats(item, allowedThemes, minR);
      const repeatMap = Object.fromEntries(repeats.map(x => [x.thema, x]));
      const nodeId = `${g.prefix}${item.bezeichnung}`;
      totalConcepts++;

      let cells = `<td class="zirk-concept-label" title="${escAttr(item.beschreibung || item.bezeichnung)}">${escHtml(item.bezeichnung)}</td>`;
      themeKeys.forEach(tk => {
        const rep = repeatMap[tk];
        if (rep) {
          const bg = rBadgeColor(rep.r);
          cells += `<td class="zirk-heatmap-td"><div class="zirk-heat-cell" style="background:${bg}" title="${escAttr(item.beschreibung || '')}" data-node-id="${escAttr(nodeId)}">${escHtml(rep.iter)}</div></td>`;
        } else {
          cells += '<td class="zirk-heat-empty zirk-heatmap-td">·</td>';
        }
      });
      rowHtml += `<tr>${cells}</tr>`;
    });
  });

  container.innerHTML = `
    <h4 style="margin-bottom:8px">Heatmap — Konzepte × Themen</h4>
    <div style="overflow-x:auto">
      <table class="zirk-heatmap-table">
        <thead>
          <tr>${lehrjahrHeaderCells}</tr>
          <tr>${themeHeaderCells}</tr>
        </thead>
        <tbody>${rowHtml || `<tr><td colspan="${colCount}">Keine Treffer.</td></tr>`}</tbody>
      </table>
    </div>
  `;
  return totalConcepts;
}

// ─── Swimlane / Timeline ──────────────────────────────────────────────────────

function renderSwimlanee(container, groups, themes, allowedThemes, minR, focusBySeedIds) {
  const themeList = themes.filter(t => allowedThemes.has(`T${t.nr}`));
  const themeCount = themeList.length;
  if (!themeCount) { container.innerHTML = '<p style="color:var(--text-muted)">Keine Themen im Filter.</p>'; return 0; }

  // Compress theme spacing (T1-T2 etc.) to 50%, while keeping the timeline centered.
  const mapSwimPct = basePct => 50 + (basePct - 50) * 0.5;
  const swimPctForThemeIndex = idx => {
    const basePct = themeCount > 1 ? (idx / (themeCount - 1)) * 100 : 50;
    return mapSwimPct(basePct);
  };

  // Build theme header
  const themeHeaderItems = themeList.map((t, i) => {
    const pct = swimPctForThemeIndex(i);
    const color = LEHRJAHR_COLORS[t.lehrjahr] || '#888';
    return `<div class="zirk-swim-th-item" style="left:${pct}%;color:${color}" title="${t.lehrjahr}. Lehrjahr">T${t.nr}</div>`;
  }).join('');

  // Lehrjahr band markers
  const bands = [];
  let currentLj = themeList[0]?.lehrjahr ?? null;
  let bandStartIdx = 0;
  for (let i = 1; i < themeList.length; i++) {
    if (themeList[i].lehrjahr !== currentLj) {
      bands.push({ lj: currentLj, startIdx: bandStartIdx, endIdx: i - 1 });
      currentLj = themeList[i].lehrjahr;
      bandStartIdx = i;
    }
  }
  if (currentLj !== null) {
    bands.push({ lj: currentLj, startIdx: bandStartIdx, endIdx: themeList.length - 1 });
  }
  const bandHtml = bands.map(({ lj, startIdx, endIdx }) => {
    const color = LEHRJAHR_COLORS[lj] || '#888';
    const startPct = swimPctForThemeIndex(startIdx);
    const endPct = swimPctForThemeIndex(endIdx);
    const widthPct = Math.max(endPct - startPct, 0.8);
    return `<div class="zirk-swim-band" style="left:${startPct}%;width:${widthPct}%;border-left:2px solid ${color}40;background:${color}08" title="${lj}. Lehrjahr"></div>`;
  }).join('');

  let rowsHtml = '';
  let totalConcepts = 0;

  groups.forEach(g => {
    const matchingItems = (g.items || []).filter(item => getFilteredRepeats(item, allowedThemes, minR).length > 0);
    if (!matchingItems.length) return;

    rowsHtml += `<div class="zirk-swim-group-header">${escHtml(g.label)}</div>`;

    matchingItems.forEach(item => {
      const repeats = getFilteredRepeats(item, allowedThemes, minR);
      const nodeId = `${g.prefix}${item.bezeichnung}`;
      totalConcepts++;

      const dotsHtml = repeats.map(rep => {
        const themeIdx = themeList.findIndex(t => `T${t.nr}` === rep.thema);
        if (themeIdx < 0) return '';
        const pct = swimPctForThemeIndex(themeIdx);
        const bg = rBadgeColor(rep.r);
        return `<div class="zirk-swim-dot" style="left:${pct}%;background:${bg}" title="${escAttr(rep.thema + ' ' + rep.iter + (item.beschreibung ? ' — ' + item.beschreibung : ''))}" data-node-id="${escAttr(nodeId)}">${escHtml(rep.iter)}</div>`;
      }).join('');

      rowsHtml += `
        <div class="zirk-swim-row">
          <div class="zirk-swim-label" title="${escAttr(item.beschreibung || item.bezeichnung)}">${escHtml(item.bezeichnung)}</div>
          <div class="zirk-swim-track">
            ${bandHtml}
            <div class="zirk-swim-track-line"></div>
            ${dotsHtml}
          </div>
        </div>`;
    });
  });

  container.innerHTML = `
    <h4 style="margin-bottom:8px">Swimlane — Progressionen</h4>
    <div class="zirk-swimlane-wrap">
      <div class="zirk-swim-row" style="margin-bottom:4px">
        <div class="zirk-swim-label" style="opacity:0"></div>
        <div class="zirk-swim-track" style="height:20px">
          ${themeHeaderItems}
        </div>
      </div>
      ${rowsHtml || '<div style="color:var(--text-muted);padding:8px 0">Keine Treffer.</div>'}
    </div>
  `;
  return totalConcepts;
}

// ─── Card View ────────────────────────────────────────────────────────────────

function renderCardView(container, groups, allowedThemes, minR, focusBySeedIds) {
  let totalConcepts = 0;
  let sectionsHtml = '';

  groups.forEach(g => {
    const matchingItems = (g.items || []).filter(item => getFilteredRepeats(item, allowedThemes, minR).length > 0);
    if (!matchingItems.length) return;

    let cardsHtml = '';
    matchingItems.forEach(item => {
      const repeats = getFilteredRepeats(item, allowedThemes, minR);
      const nodeId = `${g.prefix}${item.bezeichnung}`;
      totalConcepts++;

      const progDots = repeats.map((rep, i) => {
        const bg = rBadgeColor(rep.r);
        const arrow = i < repeats.length - 1 ? '<span class="zirk-prog-arrow">›</span>' : '';
        return `<span class="zirk-prog-dot" style="background:${bg}" title="${escAttr(rep.thema + ' ' + rep.iter)}" data-node-id="${escAttr(nodeId)}">${escHtml(rep.thema)}</span>${arrow}`;
      }).join('');

      const descHtml = item.beschreibung
        ? `<div class="zirk-card-desc" title="${escAttr(item.beschreibung)}">${escHtml(item.beschreibung)}</div>`
        : '';

      cardsHtml += `
        <div class="zirk-card">
          <h5>${escHtml(item.bezeichnung)}</h5>
          ${descHtml}
          <div class="zirk-prog-track">${progDots}</div>
          <button class="zirk-cell-btn" data-node-id="${escAttr(nodeId)}" style="align-self:flex-end;margin-top:auto">Fokus</button>
        </div>`;
    });

    sectionsHtml += `
      <div class="zirk-cards-section">
        <div class="zirk-cards-section-title">${escHtml(g.label)}</div>
        <div class="zirk-cards-grid">${cardsHtml}</div>
      </div>`;
  });

  container.innerHTML = `
    <h4 style="margin-bottom:10px">Karten — Konzept-Übersicht</h4>
    ${sectionsHtml || '<p style="color:var(--text-muted)">Keine Treffer.</p>'}
  `;
  return totalConcepts;
}

// ─── Co-Occurrence Heatmap ────────────────────────────────────────────────────

function splitModusLabel(label) {
  // "Interaktion und Kollaboration X" → split before "Kollaboration"
  const kollPos = label.indexOf('Kollaboration');
  if (kollPos > 0) {
    return escHtml(label.slice(0, kollPos).trim()) + '<br>' + escHtml(label.slice(kollPos));
  }
  // "Rezeption X", "Produktion X" → split at first space
  const spacePos = label.indexOf(' ');
  if (spacePos > 0) {
    return escHtml(label.slice(0, spacePos)) + '<br>' + escHtml(label.slice(spacePos + 1));
  }
  return escHtml(label);
}

function renderCooccurrenceHeatmap(container, allowedThemes, focusBySeedIds) {
  const state = getState();
  const aspektSet = new Set();
  const modusSet = new Set();
  const counts = new Map();

  (state.currentNrlp?.themen || []).forEach(t => {
    if (!allowedThemes.has(`T${t.nr}`)) return;
    (t.lebensbezuege || []).forEach(lb => {
      (lb.kompetenzen || []).forEach(k => {
        const aspekte = (k.gesellschaftliche_inhalte || []).map(gi => gi.aspekt).filter(Boolean);
        const modi = (k.sprachmodi || []).map(sm => sm.modus).filter(Boolean);
        aspekte.forEach(a => aspektSet.add(a));
        modi.forEach(m => modusSet.add(m));
        aspekte.forEach(a => {
          modi.forEach(m => {
            const key = `${a}|||${m}`;
            counts.set(key, (counts.get(key) || 0) + 1);
          });
        });
      });
    });
  });

  const aspekte = [...aspektSet].sort();
  const modi = [...modusSet].sort();
  const maxCount = Math.max(1, ...counts.values());

  let body = '';
  aspekte.forEach(a => {
    let cells = `<td class="zirk-concept-label" style="min-width:90px">${escHtml(a)}</td>`;
    modi.forEach(m => {
      const c = counts.get(`${a}|||${m}`) || 0;
      if (c > 0) {
        const intensity = c / maxCount;
        const bg = `rgba(139,92,246,${(intensity * 0.72).toFixed(2)})`;
        const textColor = intensity > 0.55 ? '#fff' : 'var(--text-muted)';
        cells += `<td style="padding:3px 4px"><button class="zirk-heat-cooc-cell" style="background:${bg};color:${textColor}" data-focus-ids="${escAttr(`G__${a}|SM__${m}`)}" title="${escAttr(a + ' × ' + m + ': ' + c)}">${c}</button></td>`;
      } else {
        cells += '<td class="zirk-heat-cooc-empty"></td>';
      }
    });
    body += `<tr>${cells}</tr>`;
  });

  const headCells = modi.map(m => `<th style="font-size:0.6rem;padding:4px 6px;writing-mode:vertical-rl;transform:rotate(180deg);white-space:normal;height:120px;overflow:visible;overflow-wrap:break-word;vertical-align:bottom" title="${escAttr(m)}">${splitModusLabel(m)}</th>`).join('');

  container.innerHTML = `
    <h4 style="margin-bottom:8px">Aspekt × Modus Co-Occurrence</h4>
    <div style="overflow-x:auto">
      <table class="zirk-heatmap-table">
        <thead><tr><th></th>${headCells}</tr></thead>
        <tbody>${body || '<tr><td colspan="99">Keine Daten.</td></tr>'}</tbody>
      </table>
    </div>
    <div class="zirk-cooc-legend">
      <span>0</span>
      <div class="zirk-cooc-gradient"></div>
      <span>${maxCount}</span>
    </div>
  `;
}

// ─── Main entry point ─────────────────────────────────────────────────────────

export function renderZirkularitaet(focusBySeedIds) {
  const state = getState();
  const panel = document.getElementById('zirk-panel');
  const summary = document.getElementById('zirk-summary');
  const matrix = document.getElementById('zirk-matrix');
  const co = document.getElementById('zirk-cooccurrence');
  if (!panel || !summary || !matrix || !co || !state.currentNrlp) return;

  const allowedThemes = new Set(
    (state.currentNrlp.themen || [])
      .filter(t => state.zirkLehrjahrFilter === 'all' || String(t.lehrjahr) === state.zirkLehrjahrFilter)
      .map(t => `T${t.nr}`)
  );

  const themes = [...(state.currentNrlp.themen || [])].sort((a, b) => a.nr - b.nr);

  const groups = [
    { type: 'gesellschaft', label: 'Gesellschaft', prefix: 'G__', items: state.currentNrlp.zirkularitaet?.gesellschaftsinhalte || [] },
    { type: 'sprachmodus', label: 'Sprachmodi', prefix: 'SM__', items: state.currentNrlp.zirkularitaet?.sprachmodi || [] },
    { type: 'sk', label: 'Schlüsselkompetenzen', prefix: 'SK__', items: state.currentNrlp.zirkularitaet?.schluesselkompetenzen || [] }
  ];

  const viewMode = state.zirkViewMode || 'heatmap';
  let conceptCount = 0;

  if (viewMode === 'heatmap') {
    conceptCount = renderHeatmapGrid(matrix, groups, themes, allowedThemes, state.zirkMinRFilter, focusBySeedIds);
  } else if (viewMode === 'swimlane') {
    conceptCount = renderSwimlanee(matrix, groups, themes, allowedThemes, state.zirkMinRFilter, focusBySeedIds);
  } else if (viewMode === 'cards') {
    conceptCount = renderCardView(matrix, groups, allowedThemes, state.zirkMinRFilter, focusBySeedIds);
  }

  summary.innerHTML = `Konzepte: <strong>${conceptCount}</strong> &middot; Lehrjahr: <strong>${escHtml(state.zirkLehrjahrFilter === 'all' ? 'Alle' : state.zirkLehrjahrFilter)}</strong> &middot; Min-R: <strong>R${state.zirkMinRFilter}+</strong>`;

  renderCooccurrenceHeatmap(co, allowedThemes, focusBySeedIds);
  bindZirkActions(panel, focusBySeedIds);
}
