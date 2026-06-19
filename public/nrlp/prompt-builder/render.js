// ─────────────────────────────────────────────────────────────────────────────
// render.js — HTML generation for both flows + prompt panel update.
// ─────────────────────────────────────────────────────────────────────────────

import { S } from './state.js';
import { buildPrompt, OUTPUT_TYPES, rWertFor } from './prompts.js';
import { skShort } from '../ext/sk-labels.js';

// Kleines R-Badge (R1 hell → R3 dunkel), gleiche Logik wie die Zirkularität-Heatmap.
function rBadge(r) {
  if (!r) return '';
  const tone = { R1: '#ddd6fe', R2: '#c4b5fd', R3: '#a78bfa', R4: '#8b5cf6', R5: '#7c3aed', R6: '#6d28d9' }[r] || '#ddd6fe';
  const fg = (r === 'R1' || r === 'R2') ? '#3b0764' : '#fff';
  return `<span class="r-badge" style="background:${tone};color:${fg}" title="Progressionsstufe ${r}">${r}</span>`;
}

// Escape single quotes for inline onclick attribute values
function esc(s) { return (s || '').replace(/'/g, "\\'"); }
function escDouble(s) { return (s || '').replace(/"/g, "&quot;"); }
function syncInputValue(inputId, value) {
  const input = document.getElementById(inputId);
  if (!input) return;
  if (document.activeElement === input) return;
  if (input.value !== value) input.value = value;
}

function buildExtraFieldsTemplate(kind) {
  if (kind === 'prüfung') {
    return `
      <div class="section-title">Pruefungsparameter</div>
      <input id="pruefungstyp-input" class="output-select" style="margin-bottom:8px" type="text" placeholder="Pruefungstyp (z.B. Erfahrungsnote)" oninput="setPruefungstyp(this.value);">
      <input id="pruefungsdauer-input" class="output-select" style="margin-bottom:8px" type="text" placeholder="Dauer (z.B. 60 Minuten)" oninput="setPruefungsdauer(this.value);">
      <input id="hilfsmittel-input" class="output-select" type="text" placeholder="Hilfsmittel (z.B. Taschenrechner erlaubt)" oninput="setHilfsmittel(this.value);">
    `;
  }
  if (kind === 'combo') {
    return `
      <div class="section-title">Pruefungsparameter</div>
      <input id="pruefungstyp-input" class="output-select" style="margin-bottom:8px" type="text" placeholder="Pruefungstyp (z.B. Erfahrungsnote)" oninput="setPruefungstyp(this.value);">
      <input id="pruefungsdauer-input" class="output-select" style="margin-bottom:8px" type="text" placeholder="Dauer (z.B. 60 Minuten)" oninput="setPruefungsdauer(this.value);">
      <input id="hilfsmittel-input" class="output-select" type="text" placeholder="Hilfsmittel (z.B. Taschenrechner erlaubt)" oninput="setHilfsmittel(this.value);">
      <div class="section-title" style="margin-top:10px">Reflexion</div>
      <input id="handlungsprodukt-input" class="output-select" type="text" placeholder="Handlungsprodukt der Einheit" oninput="setHandlungsprodukt(this.value);">
    `;
  }
  if (kind === 'reflexion') {
    return `
      <div class="section-title">Reflexion</div>
      <input id="handlungsprodukt-input" class="output-select" type="text" placeholder="Handlungsprodukt der Einheit" oninput="setHandlungsprodukt(this.value);">
    `;
  }
  return '';
}

function syncExtraFieldValues(kind) {
  if (kind === 'prüfung' || kind === 'combo') {
    syncInputValue('pruefungstyp-input', S.pruefungstyp || '');
    syncInputValue('pruefungsdauer-input', S.pruefungsdauer || '');
    syncInputValue('hilfsmittel-input', S.hilfsmittel || '');
  }
  if (kind === 'reflexion' || kind === 'combo') {
    syncInputValue('handlungsprodukt-input', S.handlungsprodukt || '');
  }
}

function bulkToggles(fnName, items) {
  const json = escDouble(JSON.stringify(items));
  return `<div class="bulk-actions">
    <span class="bulk-link" onclick="${fnName}('${json}', true)">Alle</span> / 
    <span class="bulk-link" onclick="${fnName}('${json}', false)">Keine</span>
  </div>`;
}

// ─── SHARED: THEMA GRID ───────────────────────────────────────────────────────

function themaGrid(nrlp, showLektionen) {
  let html = `<div class="thema-grid">`;
  for (const t of nrlp.themen) {
    const sel = S.thema?.nr === t.nr ? 'sel' : '';
    const sub = showLektionen
      ? `Lehrjahr ${t.lehrjahr} · ${t.lektionen} Lektionen`
      : `Lehrjahr ${t.lehrjahr}`;
    html += `<div class="thema-card ${sel}" onclick="selectThema(${t.nr})">
      <div class="t-nr">T${t.nr}</div>
      <div class="t-title">${t.titel}</div>
      <div class="t-lj">${sub}</div>
    </div>`;
  }
  return html + `</div>`;
}

// ─── SHARED: KOMPETENZ LIST ───────────────────────────────────────────────────

function kompList(lb) {
  return lb.kompetenzen.map(k => {
    const sel = S.kompetenzen.find(x => x.nr === k.nr) ? 'sel' : '';
    return `<div class="komp-row ${sel}" onclick="toggleKomp('${lb.nr}','${k.nr}')">
      <span class="komp-nr">${k.nr}</span>
      <span class="komp-text">${k.text}</span>
    </div>`;
  }).join('');
}

// ─── SHARED: GI LIST ─────────────────────────────────────────────────────────

function giList(items) {
  return items.map(gi => {
    const sel = S.gesellschaft.find(x => x.aspekt === gi.aspekt && x.detail === gi.detail) ? 'sel' : '';
    return `<div class="gi-row ${sel}" onclick="toggleGI('${esc(gi.aspekt)}','${esc(gi.detail)}')">
      <span class="gi-aspekt">${gi.aspekt}</span>
      <span class="gi-detail">${gi.detail}</span>
    </div>`;
  }).join('');
}

// ─── OFFICIAL FLOW ────────────────────────────────────────────────────────────

export function renderOfficialFlow(nrlp) {
  let html = `<div class="section">
    <div class="section-title">1 — Thema wählen</div>
    ${themaGrid(nrlp, true)}
  </div>`;

  if (!S.thema) return html;

  // Step 2: Lebensbezüge + Kompetenzen
  html += `<div class="section"><div class="section-title">2 — Lebensbezug &amp; Kompetenzen</div>`;
  for (const lb of S.thema.lebensbezuege) {
    const isOpen = S.lebensbezuege.some(x => x.nr === lb.nr);
    html += `<div class="lb-item">
      <div class="lb-header" onclick="selectLB('${lb.nr}')">
        <span class="lb-nr">${lb.nr}</span>
        <span class="lb-text">${lb.text}</span>
        <span class="lb-toggle">${isOpen ? '▾' : '▸'}</span>
      </div>
      <div class="lb-komps ${isOpen ? '' : 'hidden'}">
        <div class="lb-komps-header">
           <span>Kompetenzen</span>
           ${bulkToggles('toggleAllKomp', lb.kompetenzen.map(k => k.nr), lb.nr)}
        </div>
        ${kompList(lb)}
      </div>
    </div>`;
  }
  html += `</div>`;

  if (!S.lebensbezuege.length || S.kompetenzen.length === 0) return html;

  // Step 3: GI from selected kompetenzen (auto-populated, deselectable)
  const allGI = [];
  for (const k of S.kompetenzen)
    for (const gi of (k.gesellschaftliche_inhalte || []))
      if (!allGI.find(x => x.aspekt === gi.aspekt && x.detail === gi.detail)) allGI.push(gi);

  if (allGI.length) {
    html += `<div class="section">
      <div class="section-title">
         <span>3 — Gesellschaftliche Inhalte</span>
         ${bulkToggles('bulkToggleGI', allGI)}
      </div>
      <div class="info">Aus den gewählten Kompetenzen — abwählen was nicht relevant ist.</div>
      <div class="gi-list">${giList(allGI)}</div>
    </div>`;
  }

  // Step 4: Sprachmodi from selected kompetenzen
  const allSM = [];
  for (const k of S.kompetenzen)
    for (const sm of (k.sprachmodi || []))
      if (!allSM.find(x => x.modus === sm.modus && x.detail === sm.detail)) allSM.push(sm);

  if (allSM.length) {
    const smRows = allSM.map(sm => {
      const sel = S.sprachmodi.find(x => x.modus === sm.modus && x.detail === sm.detail) ? 'sel' : '';
      const r = rWertFor(nrlp, 'sprachmodi', sm.modus, S.thema?.nr);
      return `<div class="gi-row ${sel}" onclick="toggleSM_obj('${esc(sm.modus)}','${esc(sm.detail)}')">
        <span class="gi-aspekt">${sm.modus}${rBadge(r)}</span>
        <span class="gi-detail">${sm.detail}</span>
      </div>`;
    }).join('');
    html += `<div class="section">
      <div class="section-title">
        <span>4 — Sprachmodi</span>
        ${bulkToggles('bulkToggleSM_obj', allSM)}
      </div>
      <div class="info">Abwählen was nicht relevant ist.</div>
      <div class="gi-list">${smRows}</div>
    </div>`;
  }

  return html;
}

// ─── FREE FLOW ────────────────────────────────────────────────────────────────

export function renderFreeFlow(nrlp) {
  let html = `<div class="section">
    <div class="section-title">1 — Thema wählen</div>
    ${themaGrid(nrlp, false)}
  </div>`;

  if (!S.thema) return html;

  // Sprachmodi chips (strings from thema level)
  const smChips = S.thema.sprachmodi.map(sm => {
    const sel = S.sprachmodi.includes(sm) ? 'sel' : '';
    const r = rWertFor(nrlp, 'sprachmodi', sm, S.thema?.nr);
    return `<span class="chip ${sel}" onclick="toggleSM_str('${esc(sm)}')">${sm}${rBadge(r)}</span>`;
  }).join('');
  html += `<div class="section">
    <div class="section-title">
      <span>2 — Sprachmodi</span>
      ${bulkToggles('bulkToggleSM_str', S.thema.sprachmodi)}
    </div>
    <div class="chips">${smChips}</div>
  </div>`;

  // Schlüsselkompetenzen chips
  const skChips = S.thema.schluesselkompetenzen.map(sk => {
    const sel = S.schluessel.includes(sk) ? 'sel' : '';
    const r = rWertFor(nrlp, 'schluesselkompetenzen', skShort(sk), S.thema?.nr);
    return `<span class="chip ${sel}" title="${escDouble(sk)}" onclick="toggleSK('${esc(sk)}')">${skShort(sk)}${rBadge(r)}</span>`;
  }).join('');
  html += `<div class="section">
    <div class="section-title">
      <span>3 — Schlüsselkompetenzen</span>
      ${bulkToggles('bulkToggleSK', S.thema.schluesselkompetenzen)}
    </div>
    <div class="chips">${skChips}</div>
  </div>`;

  // Optional: Lebensbezüge (expand to show kompetenzen)
  html += `<div class="section"><div class="section-title">4 — Lebensbezüge (optional)</div>`;
  for (const lb of S.thema.lebensbezuege) {
    const hasKomps = S.kompetenzen.some(x => x._lb === lb.nr);
    const isOpen = S.lebensbezuege.some(x => x.nr === lb.nr);
    html += `<div class="lb-item">
      <div class="lb-header" onclick="toggleLBOpen('${lb.nr}')">
        <span class="lb-nr">${lb.nr}</span>
        <span class="lb-text">${lb.text}</span>
        <span class="chip sm ${hasKomps ? 'sel-green' : ''}" style="margin-left:auto">${hasKomps ? '✓' : '+'}</span>
      </div>
      <div class="lb-komps ${isOpen ? '' : 'hidden'}">
        <div class="lb-komps-header">
           <span>Kompetenzen</span>
           ${bulkToggles('toggleAllKomp', lb.kompetenzen.map(k => k.nr), lb.nr)}
        </div>
        ${kompList(lb)}
      </div>
    </div>`;
  }
  html += `</div>`;

  // Optional: Gesellschaftliche Inhalte (flat from all kompetenzen of thema)
  const allGI = [];
  for (const lb of S.thema.lebensbezuege)
    for (const k of lb.kompetenzen)
      for (const gi of (k.gesellschaftliche_inhalte || []))
        if (!allGI.find(x => x.aspekt === gi.aspekt && x.detail === gi.detail)) allGI.push(gi);

  html += `<div class="section">
    <div class="section-title">
      <span>5 — Gesellschaftliche Inhalte (optional)</span>
      ${bulkToggles('bulkToggleGI', allGI)}
    </div>
    <div class="gi-list">${giList(allGI)}</div>
  </div>`;

  return html;
}

export function renderComboFlow(nrlp) {
  let html = `<div class="section">
    <div class="section-title">Combo-Selektion</div>
    <div class="info">Wähle den Selektions-Stil für die Prompt-Kette:</div>
    <div class="mode-bar sm">
      <button class="mode-btn ${S.comboSelection === 'official' ? 'active' : ''}" onclick="setComboSelection('official')">Strukturiert (A)</button>
      <button class="mode-btn ${S.comboSelection === 'free' ? 'active' : ''}" onclick="setComboSelection('free')">Flexibel (B)</button>
    </div>
  </div>`;

  html += S.comboSelection === 'official' 
    ? renderOfficialFlow(nrlp) 
    : renderFreeFlow(nrlp);
    
  return html;
}

// ─── PROMPT PANEL ─────────────────────────────────────────────────────────────

export function renderPrompt(nrlp) {
  const btnOfficial = document.getElementById('btn-official');
  const btnFree = document.getElementById('btn-free');
  const btnCombo = document.getElementById('btn-combo');
  const mode = btnOfficial?.classList.contains('active') ? 'official' : (btnFree?.classList.contains('active') ? 'free' : 'combo');

  const outputTypeSelect = document.getElementById('output-type');
  const outputTypeContainer = outputTypeSelect?.parentElement;
  
  if (mode === 'combo') {
    if (outputTypeContainer) outputTypeContainer.style.display = 'none';
  } else {
    if (outputTypeContainer) outputTypeContainer.style.display = 'block';
  }

  const outputType = mode === 'combo' ? 'combo' : (outputTypeSelect?.value || 'lernsituation');
  const niveau = document.getElementById('sprachniveau')?.value || 'B1';

  const actions = document.querySelector('.prompt-actions');
  let extra = document.getElementById('output-extra-fields');
  if (actions && !extra) {
    extra = document.createElement('div');
    extra.id = 'output-extra-fields';
    extra.style.width = '100%';
    const firstBtn = actions.querySelector('.btn');
    if (firstBtn) actions.insertBefore(extra, firstBtn);
    else actions.appendChild(extra);
  }

  if (extra) {
    const extraKind =
      outputType === 'combo' ? 'combo' :
      outputType === 'prüfung' ? 'prüfung' :
      outputType === 'reflexion' ? 'reflexion' :
      'none';
    if (extra.dataset.extraKind !== extraKind) {
      extra.innerHTML = buildExtraFieldsTemplate(extraKind);
      extra.dataset.extraKind = extraKind;
    }
    syncExtraFieldValues(extraKind);
  }
  
  const prompt = buildPrompt(S, outputType, niveau, nrlp);
  const empty = document.getElementById('prompt-empty');
  const pre = document.getElementById('prompt-pre');
  if (!prompt) {
    empty.classList.remove('hidden');
    pre.classList.add('hidden');
  } else {
    empty.classList.add('hidden');
    pre.classList.remove('hidden');
    pre.textContent = prompt;
  }
}

// ─── OUTPUT TYPE SELECT ───────────────────────────────────────────────────────

export function renderOutputTypeSelect() {
  const sel = document.getElementById('output-type');
  sel.innerHTML = OUTPUT_TYPES.map(t =>
    `<option value="${t.value}">${t.label}</option>`
  ).join('');
}

