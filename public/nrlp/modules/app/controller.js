import { CATEGORY_CONFIG, PRESET_CONFIGS } from '../config.js';
import { getState, resetStateForDataset, setState } from '../state.js';
import { fetchDataset } from '../data/dataset.js';
import { buildGraphData, updateNodeDegrees } from '../data/buildGraph.js';
import { configureLayoutForCenterMode } from '../graph/layout.js';
import { applyPinnedHighlights, clearFocusMode as clearFocusModeState, focusBySeedIds, selectNodeNeighborhood } from '../graph/focus.js';
import { loadForceGraph, repaintGraph } from '../graph/renderer.js';
import { getVisibleData } from '../graph/visibility.js';
import { syncAllCategoryUI, buildCatButtons, syncCatButton } from '../ui/categoryButtons.js';
import { buildSidebar, syncSidebarPins } from '../ui/sidebar.js';
import { hideDetail, showDetail } from '../ui/details.js';
import { renderLegend, renderZirkularitaet, updateSubtitle } from '../ui/zirkularitaet.js';
import { initTour, maybeStartTourOnFirstVisit } from '../ui/tour.js';
import { augmentGraphWithUnits } from '../../ext/units-overlay.js';

let firstVisitTourChecked = false;
const SIDEBAR_COLLAPSED_STORAGE_KEY = 'nrlp.sidebarCollapsed';
const DETAIL_SIDEBAR_COLLAPSED_STORAGE_KEY = 'nrlp.detailSidebarCollapsed';

function readCollapsedFromStorage(key) {
  try {
    return localStorage.getItem(key) === '1';
  } catch (_) {
    return false;
  }
}

function writeCollapsedToStorage(key, collapsed) {
  try {
    localStorage.setItem(key, collapsed ? '1' : '0');
  } catch (_) {
    // ignore storage failures
  }
}

function applySidebarCollapsed(collapsed) {
  const app = document.getElementById('app');
  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.getElementById('sidebar-toggle-btn');

  if (app) app.classList.toggle('sidebar-collapsed', collapsed);
  if (sidebar) sidebar.setAttribute('aria-hidden', collapsed ? 'true' : 'false');

  if (toggleBtn) {
    const label = collapsed ? 'Sidebar einblenden' : 'Sidebar ausblenden';
    toggleBtn.textContent = label;
    toggleBtn.title = label;
    toggleBtn.setAttribute('aria-pressed', collapsed ? 'true' : 'false');
  }
}

function applyDetailSidebarCollapsed(collapsed) {
  const app = document.getElementById('app');
  const detailSidebar = document.getElementById('detail-sidebar');
  const toggleBtn = document.getElementById('detail-sidebar-toggle-btn');

  if (app) app.classList.toggle('detail-sidebar-collapsed', collapsed);
  if (detailSidebar) detailSidebar.setAttribute('aria-hidden', collapsed ? 'true' : 'false');

  if (toggleBtn) {
    const label = collapsed ? 'Details einblenden' : 'Details ausblenden';
    toggleBtn.textContent = label;
    toggleBtn.title = label;
    toggleBtn.setAttribute('aria-pressed', collapsed ? 'true' : 'false');
  }
}

function clearFocusMode(refreshData = false) {
  const state = getState();
  state.pinnedHighlightIds.clear();
  syncSidebarPins();
  clearFocusModeState({
    refreshGraph,
    repaintGraph,
    hideDetail,
    refreshData
  });
}

function setVisibleCategories(visibleCats) {
  const state = getState();
  const allowed = new Set(visibleCats || []);
  state.allNodes.forEach(n => {
    if (allowed.has(n.type)) state.hiddenIds.delete(n.id);
    else state.hiddenIds.add(n.id);
  });
  syncAllCategoryUI();
}

function setZirkBackBtn(visible) {
  const btn = document.getElementById('zirk-back-btn');
  if (btn) btn.classList.toggle('hidden', !visible);
}

function setViewBtnActive(mode) {
  document.querySelectorAll('.view-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.view === mode)
  );
}

function setPresetBtnActive(name) {
  document.querySelectorAll('.preset-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.preset === name)
  );
}

function switchToGraphView() {
  const state = getState();
  state.viewMode = 'graph';
  state.fromZirk = true;
  setViewBtnActive('graph');
  applyViewMode();
  setZirkBackBtn(true);
}

function renderZirk() {
  renderZirkularitaet(seedIds => {
    focusBySeedIds(seedIds, {
      refreshGraph,
      showDetail,
      switchToGraphView
    });
  });
}

const GRAPH_PLACEHOLDER_HTML = `
  <strong>So nutzt du das Netzwerk</strong><br><br>
  1. Klicke einen Knoten, um dessen Beziehungen hervorzuheben.<br>
  2. Klicke erneut, drücke <code>Esc</code> oder klicke den Hintergrund, um den Fokus zu verlassen.<br>
  3. Rechtsklick auf einen Knoten blendet ihn aus.<br>
  4. Nutze <em>Preset</em> und Kategorien oben, um die Ansicht zu verdichten oder zu öffnen.
`;

const ZIRK_PLACEHOLDER_HTML = `
  <strong style="font-size:0.82rem;color:var(--text)">Zirkularität — Spiralcurriculum</strong>
  <p style="margin:8px 0 12px">Konzepte werden spiralförmig eingeführt: zuerst oberflächlich (R1), dann in jedem Thema weiter vertieft (R2, R3 …). Diese Ansicht zeigt, wie Gesellschaftsinhalte, Sprachmodi und Schlüsselkompetenzen über die Lehrjahre aufgebaut werden.</p>

  <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:14px">
    <div class="zirk-help-view">
      <div class="zirk-help-view-icon">⊞</div>
      <div>
        <strong>Heatmap</strong>
        <div>Alle 29 Konzepte als Zeilen, Themen T1–T7 als Spalten. Farbige Zellen zeigen, wann ein Konzept erscheint und auf welcher Stufe (R1–R6). Ideal für den Überblick: <em>Was passiert in welchem Thema?</em></div>
      </div>
    </div>
    <div class="zirk-help-view">
      <div class="zirk-help-view-icon">〰</div>
      <div>
        <strong>Swimlane</strong>
        <div>Jedes Konzept bekommt eine horizontale Spur. Punkte zeigen die Themen, in denen es erscheint — verbunden durch eine Linie. Ideal zum Verfolgen der Progression: <em>Wie entwickelt sich Ethik über 4 Jahre?</em></div>
      </div>
    </div>
    <div class="zirk-help-view">
      <div class="zirk-help-view-icon">▦</div>
      <div>
        <strong>Karten</strong>
        <div>Jedes Konzept als Karte mit Beschreibung und Mini-Progression. Ideal für die Detailplanung: <em>Was genau steckt hinter diesem Konzept?</em></div>
      </div>
    </div>
  </div>

  <hr style="border:none;border-top:1px solid var(--border);margin:12px 0">

  <strong style="font-size:0.75rem;color:var(--text)">Filter</strong>
  <div style="margin-top:6px;font-size:0.74rem;line-height:1.6;color:var(--text-muted)">
    <div><strong style="color:var(--text)">Lehrjahr</strong> — schränkt auf Themen des gewählten Lehrjahrs ein (1, 2 oder 3).</div>
    <div><strong style="color:var(--text)">Min R</strong> — zeigt nur Konzepte, die mindestens so oft wiederholt werden. R2+ filtert alle Konzepte heraus, die nur einmalig eingeführt werden.</div>
  </div>

  <hr style="border:none;border-top:1px solid var(--border);margin:12px 0">

  <strong style="font-size:0.75rem;color:var(--text)">Interaktion</strong>
  <div style="margin-top:6px;font-size:0.74rem;line-height:1.6;color:var(--text-muted)">
    Klick auf eine Zelle, einen Punkt oder den <em>Fokus</em>-Button wechselt zur Netzwerkansicht und hebt das gewählte Konzept mit all seinen Verbindungen hervor.
  </div>

  <hr style="border:none;border-top:1px solid var(--border);margin:12px 0">

  <strong style="font-size:0.75rem;color:var(--text)">Co-Occurrence (unten)</strong>
  <div style="margin-top:6px;font-size:0.74rem;line-height:1.6;color:var(--text-muted)">
    Zeigt, welche Gesellschaftsinhalte gemeinsam mit welchen Sprachmodi in Kompetenzen vorkommen. Je satter die Farbe, desto häufiger die Kombination.
  </div>
`;

function applyViewMode() {
  const state = getState();
  const graphEl = document.getElementById('graph');
  const legendEl = document.getElementById('legend');
  const zirkPanel = document.getElementById('zirk-panel');
  const placeholder = document.getElementById('detail-placeholder');
  const detailSidebar = document.getElementById('detail-sidebar');
  const detailContent = document.getElementById('detail-content');
  const isZirk = state.viewMode === 'zirkularitaet';
  const EXTRA = ['spirale', 'chord', 'sankey'];
  const isExtra = EXTRA.includes(state.viewMode);
  const extraEl = document.getElementById('nrlp-extra');

  if (graphEl) graphEl.classList.toggle('hidden', isZirk || isExtra);
  if (legendEl) legendEl.classList.toggle('hidden', isZirk || isExtra);
  if (zirkPanel) zirkPanel.classList.toggle('hidden', !isZirk);
  if (extraEl) extraEl.classList.toggle('hidden', !isExtra);
  const depthWrap = document.getElementById('depth-wrap');
  if (depthWrap) depthWrap.classList.toggle('hidden', isZirk || isExtra);

  if (placeholder) {
    placeholder.innerHTML = isZirk ? ZIRK_PLACEHOLDER_HTML : GRAPH_PLACEHOLDER_HTML;
  }
  if ((isZirk || isExtra) && detailSidebar) {
    detailSidebar.classList.add('empty');
    if (detailContent) detailContent.innerHTML = '';
  }

  if (isExtra) {
    if (window.NRLP_renderExtra) {
      window.NRLP_renderExtra(
        state.viewMode,
        state.currentNrlp,
        seedIds => focusBySeedIds(seedIds, { refreshGraph, showDetail, switchToGraphView })
      );
    }
    return;
  }

  if (isZirk) renderZirk();
  else refreshGraph();
}

function applyPreset(name, forceCategoryReset = false) {
  const state = getState();
  state.activePreset = name;
  setPresetBtnActive(name);
  state.pinnedHighlightIds.clear();
  syncSidebarPins();

  if (name === 'density_low' || name === 'density_medium' || name === 'density_high') {
    state.densityMode = name.replace('density_', '');
  } else {
    const cfg = PRESET_CONFIGS[name] || PRESET_CONFIGS.basis;
    state.densityMode = cfg.density;
    if (cfg.center) state.centerMode = cfg.center;
    if (forceCategoryReset || cfg.visibleCats) {
      setVisibleCategories(cfg.visibleCats);
    }
  }

  if (state.selectedNodeId) {
    const selected = state.allNodes.find(n => n.id === state.selectedNodeId);
    if (selected && !state.hiddenIds.has(selected.id)) {
      selectNodeNeighborhood(selected);
    } else {
      clearFocusMode(true);
      return;
    }
  }

  configureLayoutForCenterMode(false);
  refreshGraph();
}

export function refreshGraph() {
  const state = getState();
  if (!state.graphInstance) return;
  if (state.selectedNodeId && state.hiddenIds.has(state.selectedNodeId)) {
    clearFocusModeState({ hideDetail });
  }

  const data = getVisibleData();
  const degreeData = updateNodeDegrees(data);
  setState(degreeData);

  state.graphInstance.graphData(data);
}

function populateZirkLehrjahrOptions(nrlp) {
  const state = getState();
  const select = state.dom.zirkLehrjahrSelect;
  if (!select) return;
  const jahre = [...new Set((nrlp.themen || [])
    .map(t => t.lehrjahr)
    .filter(j => j != null))]
    .sort((a, b) => a - b);
  select.innerHTML =
    '<option value="all">Alle</option>' +
    jahre.map(j => `<option value="${j}">${j}</option>`).join('');
  // Reset filter so a stale year from a previous dataset doesn't carry over
  state.zirkLehrjahrFilter = 'all';
  select.value = 'all';
}

async function loadDataset(path) {
  const state = getState();
  state.currentDatasetPath = path;

  try {
    const nrlp = await fetchDataset(path);
    state.currentNrlp = nrlp;

    resetStateForDataset();
    hideDetail();

    populateZirkLehrjahrOptions(nrlp);

    const graphData = buildGraphData(nrlp);
    const role = (window.NRLP_ROLE || 'lp');
    await augmentGraphWithUnits(graphData, path, role);
    state.allNodes = graphData.nodes;
    state.allLinks = graphData.links;

    buildSidebar({
      onPinChanged: () => {
        applyPinnedHighlights();
        refreshGraph();
      }
    });

    buildCatButtons({
      onVisibilityChanged: refreshGraph
    });

    updateSubtitle(nrlp);
    renderLegend(nrlp);
    renderZirk();

    applyPreset(state.activePreset, true);
    applyViewMode();
    refreshGraph();

    if (state.graphInstance) {
      setTimeout(() => state.graphInstance.zoomToFit(600, 80), 200);
    }

    if (!firstVisitTourChecked) {
      firstVisitTourChecked = true;
      setTimeout(() => maybeStartTourOnFirstVisit(), 220);
    }
  } catch (err) {
    document.getElementById('graph').innerHTML =
      `<p style="color:#e74c3c;padding:20px">Fehler beim Laden von ${path}: ${err.message}</p>`;
  }
}

export function onNodeSelected(nodeId) {
  const state = getState();
  const node = state.allNodes.find(n => n.id === nodeId);
  if (!node) return;

  // Unit nodes (Einheit/Situation) deep-link to the real page, breaking out of the iframe.
  if (node.data && node.data.url) { window.open(node.data.url, '_top'); return; }

  // Double-click same node (with no pins active) → clear focus
  if (state.selectedNodeId === node.id && state.pinnedHighlightIds.size === 0) {
    clearFocusMode();
    return;
  }

  // Switching from pin mode to graph-click mode → clear pins silently
  if (state.pinnedHighlightIds.size > 0) {
    state.pinnedHighlightIds.clear();
    syncSidebarPins();
  }

  selectNodeNeighborhood(node);
  refreshGraph();
  showDetail(node);
}

export function onNodeHidden(nodeId) {
  const state = getState();
  const node = state.allNodes.find(n => n.id === nodeId);
  if (!node) return;
  state.hiddenIds.add(node.id);
  clearFocusMode(true);
  syncCatButton(node.type);
}

export function onPresetChanged(name) {
  applyPreset(name);
}

export function onDepthChanged(depth) {
  const state = getState();
  state.neighborhoodDepth = depth;
  document.querySelectorAll('.depth-btn').forEach(b =>
    b.classList.toggle('active', Number(b.dataset.depth) === depth)
  );
  // Re-apply whichever focus mode is currently active
  if (state.pinnedHighlightIds.size > 0) {
    applyPinnedHighlights();
    refreshGraph();
  } else if (state.selectedNodeId) {
    const node = state.allNodes.find(n => n.id === state.selectedNodeId);
    if (node) {
      selectNodeNeighborhood(node);
      refreshGraph();
    }
  }
}

export function onViewModeChanged(mode) {
  const state = getState();
  state.viewMode = mode;
  state.fromZirk = false;
  setZirkBackBtn(false);
  setViewBtnActive(mode);
  applyViewMode();
}

export function onDatasetChanged(path) {
  loadDataset(path);
}

function bindDomEvents() {
  const state = getState();
  const { datasetSelect, zirkLehrjahrSelect, zirkMinRSelect } = state.dom;

  datasetSelect.addEventListener('change', () => onDatasetChanged(datasetSelect.value));

  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => onViewModeChanged(btn.dataset.view));
  });

  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => onPresetChanged(btn.dataset.preset));
  });

  document.querySelectorAll('.depth-btn').forEach(btn => {
    btn.addEventListener('click', () => onDepthChanged(Number(btn.dataset.depth)));
  });

  if (zirkLehrjahrSelect) {
    zirkLehrjahrSelect.addEventListener('change', () => {
      state.zirkLehrjahrFilter = zirkLehrjahrSelect.value;
      renderZirk();
    });
  }

  if (zirkMinRSelect) {
    zirkMinRSelect.addEventListener('change', () => {
      state.zirkMinRFilter = parseInt(zirkMinRSelect.value, 10) || 1;
      renderZirk();
    });
  }

  document.querySelectorAll('.zirk-view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.zirkViewMode = btn.dataset.zview;
      document.querySelectorAll('.zirk-view-btn').forEach(b => b.classList.toggle('active', b === btn));
      renderZirk();
    });
  });

  const zirkBackBtn = document.getElementById('zirk-back-btn');
  if (zirkBackBtn) {
    zirkBackBtn.addEventListener('click', () => {
      state.fromZirk = false;
      setZirkBackBtn(false);
      onViewModeChanged('zirkularitaet');
      setViewBtnActive('zirkularitaet');
    });
  }

  const sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');
  if (sidebarToggleBtn) {
    sidebarToggleBtn.addEventListener('click', () => {
      const app = document.getElementById('app');
      const isCollapsed = app?.classList.contains('sidebar-collapsed') || false;
      const nextCollapsed = !isCollapsed;
      applySidebarCollapsed(nextCollapsed);
      writeCollapsedToStorage(SIDEBAR_COLLAPSED_STORAGE_KEY, nextCollapsed);
    });
  }

  const detailSidebarToggleBtn = document.getElementById('detail-sidebar-toggle-btn');
  if (detailSidebarToggleBtn) {
    detailSidebarToggleBtn.addEventListener('click', () => {
      const app = document.getElementById('app');
      const isCollapsed = app?.classList.contains('detail-sidebar-collapsed') || false;
      const nextCollapsed = !isCollapsed;
      applyDetailSidebarCollapsed(nextCollapsed);
      writeCollapsedToStorage(DETAIL_SIDEBAR_COLLAPSED_STORAGE_KEY, nextCollapsed);
    });
  }
}

function cacheDomRefs() {
  setState({
    dom: {
      datasetSelect: document.getElementById('dataset-select'),
      zirkLehrjahrSelect: document.getElementById('zirk-lehrjahr'),
      zirkMinRSelect: document.getElementById('zirk-min-r')
    }
  });
}

export function initController() {
  applySidebarCollapsed(readCollapsedFromStorage(SIDEBAR_COLLAPSED_STORAGE_KEY));
  applyDetailSidebarCollapsed(readCollapsedFromStorage(DETAIL_SIDEBAR_COLLAPSED_STORAGE_KEY));
  cacheDomRefs();
  bindDomEvents();
  initTour({
    onOpenView: mode => onViewModeChanged(mode)
  });

  loadForceGraph({
    onNodeClick: node => onNodeSelected(node.id),
    onBackgroundClick: () => clearFocusMode(),
    onNodeRightClick: node => onNodeHidden(node.id),
    onEscape: () => clearFocusMode()
  });

  const state = getState();
  loadDataset(state.dom.datasetSelect.value || '/nrlp_3j.json');
}

export function syncCategoryUi() {
  CATEGORY_CONFIG.forEach(cfg => {
    syncCatButton(cfg.cat);
  });
}
