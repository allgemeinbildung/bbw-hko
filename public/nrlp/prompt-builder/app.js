// ─────────────────────────────────────────────────────────────────────────────
// app.js — Entry point. Loads data, wires up globals for onclick handlers.
// ─────────────────────────────────────────────────────────────────────────────

import { S, resetState, selectThema as _selectThema, selectLB as _selectLB, toggleLBOpen as _toggleLBOpen, toggleKomp as _toggleKomp, toggleSM_str as _toggleSM_str, toggleSM_obj as _toggleSM_obj, toggleSK as _toggleSK, toggleGI as _toggleGI, bulkToggleGI as _bulkToggleGI, bulkToggleSM_obj as _bulkToggleSM_obj, bulkToggleSM_str as _bulkToggleSM_str, bulkToggleSK as _bulkToggleSK, toggleAllKomp as _toggleAllKomp, setComboSelection as _setComboSelection, setPruefungstyp as _setPruefungstyp, setPruefungsdauer as _setPruefungsdauer, setHilfsmittel as _setHilfsmittel, setHandlungsprodukt as _setHandlungsprodukt } from './state.js';
import { renderOfficialFlow, renderFreeFlow, renderComboFlow, renderPrompt as _renderPrompt, renderOutputTypeSelect } from './render.js';
import { buildPrompt } from './prompts.js';

let nrlp = null;
let datasetPath = '/nrlp_3j.json';

function renderPrompt() {
  _renderPrompt(nrlp);
}
let mode = 'official';

// ─── INIT ─────────────────────────────────────────────────────────────────────

async function loadDataset(path) {
  const res = await fetch(path);
  nrlp = await res.json();
  nrlp._datasetPath = path;
  datasetPath = path;
  updateDatasetHint();
}

function updateDatasetHint() {
  const hint = document.getElementById('dataset-hint');
  if (!hint || !nrlp) return;
  const m = nrlp.meta || {};
  const themen = (nrlp.themen || []).length;
  hint.textContent = m.titel
    ? `${m.titel} · ${m.typ || ''} · ${themen} Themen`.replace(/ · $/, '')
    : '';
}

// Called from the dataset <select>. Switching the Lehrplan invalidates the
// current selection (Themen differ), so reset state and rebuild from scratch.
async function setDataset(path) {
  if (path === datasetPath && nrlp) return;
  resetState();
  await loadDataset(path);
  renderLeft();
  renderPrompt();
}

async function init() {
  // Rolle aus dem iframe-Query (von der Astro-Route gesetzt) + echte Units für
  // das Interim-Orientierungsbeispiel laden (solange umsetzungsbeispiele leer ist).
  window.__NRLP_ROLE = new URLSearchParams(location.search).get('role') || 'lp';
  try {
    const [eh, sit] = await Promise.all([
      fetch('../einheiten.index.json').then(r => r.ok ? r.json() : []),
      fetch('../situationen.index.json').then(r => r.ok ? r.json() : []),
    ]);
    window.__UNITS = { einheiten: eh, situationen: sit };
  } catch (_) { window.__UNITS = { einheiten: [], situationen: [] }; }

  const sel = document.getElementById('dataset-select');
  await loadDataset(sel?.value || datasetPath);
  renderOutputTypeSelect();
  renderLeft();
}

// ─── MODE ─────────────────────────────────────────────────────────────────────

function setMode(m) {
  mode = m;
  document.getElementById('btn-official').classList.toggle('active', m === 'official');
  document.getElementById('btn-free').classList.toggle('active', m === 'free');
  document.getElementById('btn-combo').classList.toggle('active', m === 'combo');
  resetState();
  renderLeft();
  renderPrompt();
}

function setComboSelection(s) {
  _setComboSelection(s);
  renderLeft();
  renderPrompt();
}

function clearAll() {
  resetState();
  renderLeft();
  renderPrompt();
}

function setPruefungstyp(value) {
  _setPruefungstyp(value);
  renderPrompt();
}

function setPruefungsdauer(value) {
  _setPruefungsdauer(value);
  renderPrompt();
}

function setHilfsmittel(value) {
  _setHilfsmittel(value);
  renderPrompt();
}

function setHandlungsprodukt(value) {
  _setHandlungsprodukt(value);
  renderPrompt();
}

// ─── RENDER DISPATCHER ────────────────────────────────────────────────────────

function renderLeft() {
  const el = document.getElementById('left-panel');
  if (mode === 'official') el.innerHTML = renderOfficialFlow(nrlp);
  else if (mode === 'free') el.innerHTML = renderFreeFlow(nrlp);
  else el.innerHTML = renderComboFlow(nrlp);
}

// ─── ACTIONS (called from prompt panel) ──────────────────────────────────────

function getOutputType() { 
  if (document.getElementById('btn-combo')?.classList.contains('active')) return 'combo';
  return document.getElementById('output-type')?.value || 'lernsituation'; 
}
function getNiveau()     { return document.getElementById('sprachniveau')?.value || 'B1'; }

function copyPrompt() {
  const p = buildPrompt(S, getOutputType(), getNiveau(), nrlp);
  if (!p) return;
  navigator.clipboard.writeText(p).then(() => alert('Prompt kopiert!'));
}

function openClaude() {
  const p = buildPrompt(S, getOutputType(), getNiveau(), nrlp);
  if (!p) return;
  navigator.clipboard.writeText(p).then(() => window.open('https://claude.ai/new', '_blank'));
}

function downloadPrompt() {
  const p = buildPrompt(S, getOutputType(), getNiveau(), nrlp);
  if (!p) return;
  const filename = `ABU_Prompt_${S.thema ? 'T' + S.thema.nr : 'Combo'}.txt`;
  const blob = new Blob([p], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── GLOBAL WRAPPERS (required for onclick= in HTML) ─────────────────────────

function selectThema(nr) {
  _selectThema(nrlp, nr);
  renderLeft();
  renderPrompt();
}

function selectLB(nr) {
  _selectLB(nrlp, nr);
  renderLeft();
  renderPrompt();
}

function toggleLBOpen(nr) {
  _toggleLBOpen(nrlp, nr);
  renderLeft();
  renderPrompt();
}

function toggleKomp(lbnr, knr) {
  _toggleKomp(lbnr, knr);
  renderLeft();
  renderPrompt();
}

function toggleSM_str(sm) {
  _toggleSM_str(sm);
  renderLeft();
  renderPrompt();
}

function toggleSM_obj(modus, detail) {
  _toggleSM_obj(modus, detail);
  renderLeft();
  renderPrompt();
}

function toggleSK(sk) {
  _toggleSK(sk);
  renderLeft();
  renderPrompt();
}

function toggleGI(aspekt, detail) {
  _toggleGI(aspekt, detail);
  renderLeft();
  renderPrompt();
}

function bulkToggleGI(itemsJson, selectAll) {
  _bulkToggleGI(JSON.parse(itemsJson), selectAll);
  renderLeft();
  renderPrompt();
}

function bulkToggleSM_obj(itemsJson, selectAll) {
  _bulkToggleSM_obj(JSON.parse(itemsJson), selectAll);
  renderLeft();
  renderPrompt();
}

function bulkToggleSM_str(itemsJson, selectAll) {
  _bulkToggleSM_str(JSON.parse(itemsJson), selectAll);
  renderLeft();
  renderPrompt();
}

function bulkToggleSK(itemsJson, selectAll) {
  _bulkToggleSK(JSON.parse(itemsJson), selectAll);
  renderLeft();
  renderPrompt();
}

function toggleAllKomp(lbnr, knrsJson, selectAll) {
  _toggleAllKomp(lbnr, JSON.parse(knrsJson), selectAll);
  renderLeft();
  renderPrompt();
}

// Expose all to window for inline onclick handlers
Object.assign(window, {
  setMode, clearAll, copyPrompt, openClaude,
  selectThema, selectLB, toggleLBOpen, toggleKomp,
  toggleSM_str, toggleSM_obj, toggleSK, toggleGI,
  bulkToggleGI, bulkToggleSM_obj, bulkToggleSM_str, bulkToggleSK, toggleAllKomp,
  setPruefungstyp, setPruefungsdauer, setHilfsmittel, setHandlungsprodukt,
  setComboSelection, downloadPrompt,
  renderPrompt, setDataset,
});

init();

