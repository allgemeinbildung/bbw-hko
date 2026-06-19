import { getState } from '../state.js';

/**
 * BFS neighborhood up to `depth` hops from seedIds.
 * @param {string[]} seedIds
 * @param {number} depth
 * @param {Array|undefined} links  Defaults to state.allLinks (full graph).
 *   Pass getVisibleLinks() to restrict traversal to the currently visible subgraph.
 */
export function buildNeighborhood(seedIds, depth, links) {
  const seeds = new Set((seedIds || []).filter(Boolean));
  const state = getState();
  const allLinks = links !== undefined ? links : state.allLinks;

  const neighbors = new Map();
  allLinks.forEach(l => {
    const s = typeof l.source === 'object' ? l.source.id : l.source;
    const t = typeof l.target === 'object' ? l.target.id : l.target;
    if (!neighbors.has(s)) neighbors.set(s, new Set());
    if (!neighbors.has(t)) neighbors.set(t, new Set());
    neighbors.get(s).add(t);
    neighbors.get(t).add(s);
  });

  const dist = new Map();
  const queue = [];
  seeds.forEach(id => {
    dist.set(id, 0);
    queue.push(id);
  });

  while (queue.length) {
    const cur = queue.shift();
    const d = dist.get(cur) || 0;
    if (d >= depth) continue;
    (neighbors.get(cur) || []).forEach(nb => {
      if (!dist.has(nb)) {
        dist.set(nb, d + 1);
        queue.push(nb);
      }
    });
  }

  const nodeSet = new Set(dist.keys());
  const linkSet = new Set();
  allLinks.forEach(l => {
    const s = typeof l.source === 'object' ? l.source.id : l.source;
    const t = typeof l.target === 'object' ? l.target.id : l.target;
    if (nodeSet.has(s) && nodeSet.has(t)) linkSet.add(l);
  });
  return { nodeSet, linkSet };
}

export function clearHighlight() {
  const state = getState();
  state.focusedIds = null;
  state.selectedNodeId = null;
  state.highlightNodes.clear();
  state.highlightLinks.clear();
}

export function selectNodeNeighborhood(node) {
  const state = getState();
  state.selectedNodeId = node.id;
  state.highlightNodes.clear();
  state.highlightLinks.clear();
  // Graph-click uses all links so depth can surface hidden nodes
  const { nodeSet, linkSet } = buildNeighborhood([node.id], state.neighborhoodDepth);
  nodeSet.forEach(id => state.highlightNodes.add(id));
  linkSet.forEach(l => state.highlightLinks.add(l));
  state.focusedIds = new Set(nodeSet);
}

/**
 * Apply focus from the sidebar's pinned nodes (always depth 1, visible links only).
 * Clears single-node graph-click selection.
 */
export function applyPinnedHighlights() {
  const state = getState();
  const pins = state.pinnedHighlightIds;

  state.selectedNodeId = null;
  state.highlightNodes.clear();
  state.highlightLinks.clear();

  if (!pins || pins.size === 0) {
    state.focusedIds = null;
    return;
  }

  // Sidebar pins use the same depth and link set as graph-click focus
  const { nodeSet, linkSet } = buildNeighborhood([...pins], state.neighborhoodDepth);
  nodeSet.forEach(id => state.highlightNodes.add(id));
  linkSet.forEach(l => state.highlightLinks.add(l));
  state.focusedIds = new Set(nodeSet);
}

export function clearFocusMode({ refreshGraph, repaintGraph, hideDetail, refreshData = false } = {}) {
  const state = getState();
  const hadFocus = !!state.selectedNodeId || !!state.focusedIds;
  clearHighlight();
  if (typeof hideDetail === 'function') hideDetail();
  if (refreshData || hadFocus) {
    if (typeof refreshGraph === 'function') refreshGraph();
    return;
  }
  if (typeof repaintGraph === 'function') repaintGraph();
}

export function focusBySeedIds(seedIds, { refreshGraph, showDetail, switchToGraphView } = {}) {
  const state = getState();
  const seedSet = new Set((seedIds || []).filter(Boolean));
  if (!seedSet.size) return;

  state.selectedNodeId = [...seedSet][0];
  state.highlightNodes.clear();
  state.highlightLinks.clear();

  const { nodeSet, linkSet } = buildNeighborhood([...seedSet], state.neighborhoodDepth);
  nodeSet.forEach(id => state.highlightNodes.add(id));
  linkSet.forEach(l => state.highlightLinks.add(l));
  state.focusedIds = new Set(nodeSet);

  if (typeof refreshGraph === 'function') refreshGraph();

  const primary = state.allNodes.find(n => n.id === state.selectedNodeId);
  if (primary && typeof showDetail === 'function') showDetail(primary);

  if (state.viewMode !== 'graph' && typeof switchToGraphView === 'function') {
    switchToGraphView();
  }
}
