import { getState } from '../state.js';

function resolveId(endpoint) {
  return typeof endpoint === 'object' ? endpoint.id : endpoint;
}

function buildImplicitlyHidden(allNodes, allLinks, hiddenIds) {
  const hiddenThemas = new Set(
    allNodes.filter(n => n.type === 'thema' && hiddenIds.has(n.id)).map(n => n.id)
  );
  if (hiddenThemas.size === 0) return new Set();

  const hidden = new Set();

  // Pass 1: LBs and Umsetzungen directly attached to hidden Themen
  allLinks.forEach(l => {
    const s = resolveId(l.source);
    const t = resolveId(l.target);
    if (l.type === 'thema_lebensbezug' && hiddenThemas.has(s)) hidden.add(t);
    if (l.type === 'thema_umsetzung' && hiddenThemas.has(s)) hidden.add(t);
  });

  // Pass 2: Kompetenzen, Scaffolds, Bewertungen that hang off hidden parents
  allLinks.forEach(l => {
    const s = resolveId(l.source);
    const t = resolveId(l.target);
    if (l.type === 'lebensbezug_kompetenz' && hidden.has(s)) hidden.add(t);
    if (l.type === 'umsetzung_scaffold' && hidden.has(s)) hidden.add(t);
    if (l.type === 'bewertung_umsetzung' && hidden.has(t)) hidden.add(s);
  });

  return hidden;
}

export function getVisibleData() {
  const state = getState();
  const implicit = buildImplicitlyHidden(state.allNodes, state.allLinks, state.hiddenIds);
  const visible = state.allNodes.filter(n => {
    // Always include nodes inside the current focus neighborhood — depth expansion
    // should surface them even if hidden by preset/sidebar.
    if (state.focusedIds?.has(n.id)) return true;
    return !state.hiddenIds.has(n.id) && !implicit.has(n.id);
  });
  const visibleIds = new Set(visible.map(n => n.id));
  const links = state.allLinks.filter(l => {
    const s = resolveId(l.source);
    const t = resolveId(l.target);
    return visibleIds.has(s) && visibleIds.has(t);
  });
  return { nodes: visible, links };
}

export function getVisibleLinks() {
  const state = getState();
  const visibleIds = new Set(state.allNodes.filter(n => !state.hiddenIds.has(n.id)).map(n => n.id));
  return state.allLinks.filter(l => {
    const s = typeof l.source === 'object' ? l.source.id : l.source;
    const t = typeof l.target === 'object' ? l.target.id : l.target;
    return visibleIds.has(s) && visibleIds.has(t);
  });
}

