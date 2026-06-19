import { getState } from '../state.js';

export function semanticLinkDistance(typeA, typeB, centerType) {
  const pair = [typeA, typeB].sort().join('|');
  const base = (() => {
    if (pair === 'lebensbezug|thema') return 70;
    if (pair === 'kompetenz|lebensbezug') return 56;
    if (pair === 'gesellschaft|kompetenz') return 72;
    if (pair === 'kompetenz|sprachmodus') return 72;
    if (pair === 'kompetenz|sk') return 74;
    if (pair === 'thema|umsetzung') return 92;
    if (pair === 'scaffold|umsetzung') return 60;
    if (pair === 'bewertung|umsetzung') return 62;
    if (pair === 'bewertung|kompetenz') return 72;
    if (pair === 'gesellschaft|thema' || pair === 'sprachmodus|thema' || pair === 'sk|thema') return 145;
    return 108;
  })();
  const touchesCenter = typeA === centerType || typeB === centerType;
  return touchesCenter ? Math.max(45, Math.round(base * 0.85)) : base;
}

export function hashStr(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h) + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function makeCategoryCenterForce() {
  const state = getState();
  let nodes = [];

  function force(alpha) {
    if (!nodes.length || !state.graphInstance) return;

    const width = state.graphInstance.width() || window.innerWidth;
    const height = state.graphInstance.height() || window.innerHeight;
    const cx = width / 2;
    const cy = height / 2;

    let centerNodes = nodes.filter(n => n.type === state.centerMode);
    if (!centerNodes.length && state.centerMode !== 'thema') {
      centerNodes = nodes.filter(n => n.type === 'thema');
    }
    if (!centerNodes.length) return;

    const centerRing = Math.max(40, Math.min(width, height) * 0.14);
    centerNodes.forEach((node, idx) => {
      const angle = (idx / centerNodes.length) * Math.PI * 2;
      const tx = cx + Math.cos(angle) * centerRing;
      const ty = cy + Math.sin(angle) * centerRing;
      node.vx += (tx - node.x) * 0.22 * alpha;
      node.vy += (ty - node.y) * 0.22 * alpha;
    });

    const outerBase = centerRing + Math.max(70, Math.min(width, height) * 0.18);
    nodes.forEach(node => {
      if (node.type === state.centerMode) return;

      const hash = hashStr(node.id);
      const angle = (hash % 360) * Math.PI / 180;
      const outerJitter = (hash % 55) - 27;
      const outerR = outerBase + outerJitter;
      const tx = cx + Math.cos(angle) * outerR;
      const ty = cy + Math.sin(angle) * outerR;

      node.vx += (tx - node.x) * 0.04 * alpha;
      node.vy += (ty - node.y) * 0.04 * alpha;
    });
  }

  force.initialize = initNodes => {
    nodes = initNodes || [];
  };
  return force;
}

export function updateRecenteringForces() {
  const state = getState();
  if (!state.graphInstance) return;
  const centerForce = state.graphInstance.d3Force('center');
  if (centerForce && typeof centerForce.strength === 'function') {
    centerForce.strength(state.hasUserTranslatedGraph ? 0 : 0.08);
  }
  state.graphInstance.d3Force('category-center', state.hasUserTranslatedGraph ? null : makeCategoryCenterForce());
}

export function configureLayoutForCenterMode(reheat = false) {
  const state = getState();
  if (!state.graphInstance) return;

  state.graphInstance
    .d3Force('link', state.graphInstance.d3Force('link')
      .distance(link => {
        const s = typeof link.source === 'object' ? link.source.type : '';
        const t = typeof link.target === 'object' ? link.target.type : '';
        return semanticLinkDistance(s, t, state.centerMode);
      })
      .strength(link => {
        const s = typeof link.source === 'object' ? link.source.type : '';
        const t = typeof link.target === 'object' ? link.target.type : '';
        return (s === state.centerMode || t === state.centerMode) ? 0.68 : 0.4;
      }));

  updateRecenteringForces();
  if (reheat) state.graphInstance.d3ReheatSimulation();
}

export function addCollisionForce() {
  const state = getState();
  if (!state.graphInstance) return;

  let nodes = [];
  function nodeR(n) {
    return Math.sqrt(n.val || 1) * (n.type === 'thema' ? 4.5 : 3.2) + 8;
  }
  function collide(alpha) {
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        if (!dx && !dy) {
          dx = 0.1;
          dy = 0.1;
        }
        const dist = Math.sqrt(dx * dx + dy * dy);
        const minDist = nodeR(a) + nodeR(b);
        if (dist < minDist) {
          const overlap = (minDist - dist) / dist * 0.5 * alpha;
          if (!a.fx) {
            a.x -= dx * overlap;
            a.y -= dy * overlap;
          }
          if (!b.fx) {
            b.x += dx * overlap;
            b.y += dy * overlap;
          }
        }
      }
    }
  }
  collide.initialize = initNodes => {
    nodes = initNodes || [];
  };

  state.graphInstance.d3Force('collision', collide);
}

