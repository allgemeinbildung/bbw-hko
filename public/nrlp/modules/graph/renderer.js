import { getState, setState } from '../state.js';
import { hexToRgba } from '../utils/color.js';
import { getVisibleData } from './visibility.js';
import { addCollisionForce, configureLayoutForCenterMode, semanticLinkDistance } from './layout.js';

function nodeAlphaByDensity(node) {
  const state = getState();
  if (state.focusedIds) return state.focusedIds.has(node.id) ? 1 : 0.1;
  return 1;
}

function shouldShowNodeLabel(node, scale) {
  const state = getState();
  if (node.type === 'thema') return true;
  if (state.focusedIds) return state.focusedIds.has(node.id) && scale > 0.45;
  if (state.densityMode === 'high') return true;

  const deg = state.nodeDegreeMap.get(node.id) || 0;
  const cfg = state.densityMode === 'high'
    ? { minScale: 1.05, minDeg: 2 }
    : state.densityMode === 'medium'
      ? { minScale: 0.8, minDeg: 1 }
      : { minScale: 0.55, minDeg: 0 };

  const priorityTypes = new Set(['kompetenz', 'lebensbezug', 'umsetzung']);
  const scaleOk = scale >= (priorityTypes.has(node.type) ? cfg.minScale * 0.9 : cfg.minScale);
  return scaleOk && (deg >= cfg.minDeg || priorityTypes.has(node.type));
}

function buildGraphInstance(container, callbacks) {
  const state = getState();

  const graph = ForceGraph()(container)
    .backgroundColor('#0f1117')
    .warmupTicks(250)
    .cooldownTicks(0)
    .linkColor(link => {
      const s = typeof link.source === 'object' ? link.source.id : link.source;
      const t = typeof link.target === 'object' ? link.target.id : link.target;
      const inFocus = !state.focusedIds || (state.focusedIds.has(s) && state.focusedIds.has(t));
      if (!inFocus) return 'rgba(110,110,120,0.045)';
      if (state.highlightLinks.size > 0) {
        return state.highlightLinks.has(link)
          ? hexToRgba(link.baseColor, 0.56)
          : 'rgba(110,110,120,0.045)';
      }
      return hexToRgba(link.baseColor, 0.18);
    })
    .linkWidth(link => {
      const s = typeof link.source === 'object' ? link.source.id : link.source;
      const t = typeof link.target === 'object' ? link.target.id : link.target;
      if (state.focusedIds && !(state.focusedIds.has(s) && state.focusedIds.has(t))) return 0.55;
      return state.highlightLinks.has(link) ? 1.2 : 0.8;
    })
    .linkLabel(link => {
      const s = typeof link.source === 'object' ? link.source.name : link.source;
      const t = typeof link.target === 'object' ? link.target.name : link.target;
      return `${s} ? ${t} (${link.iteration})`;
    })
    .nodeCanvasObject((node, ctx, scale) => {
      const isThema = node.type === 'thema';
      const r = Math.sqrt(node.val) * (isThema ? 3.8 : 2.6);
      const dimmed = state.focusedIds && !state.focusedIds.has(node.id);
      const alpha = nodeAlphaByDensity(node);

      ctx.save();
      ctx.globalAlpha = dimmed ? Math.min(alpha, 0.1) : alpha;

      ctx.beginPath();
      ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
      ctx.fillStyle = node.color;
      ctx.fill();

      if (isThema) {
        ctx.strokeStyle = 'rgba(255,255,255,0.45)';
        ctx.lineWidth = 2 / scale;
        ctx.stroke();

        const fs = Math.max(10, Math.min(14, 13 / scale));
        ctx.font = `bold ${fs}px 'Segoe UI', 'Noto Sans', Arial, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#fff';
        ctx.fillText(node.label, node.x, node.y);
      } else if (shouldShowNodeLabel(node, scale)) {
        const maxLen = 20;
        const lbl = node.label.length > maxLen
          ? `${node.label.substring(0, maxLen - 3)}...`
          : node.label;
        const fs = Math.max(7, Math.min(10, 9 / scale));
        ctx.font = `${fs}px 'Segoe UI', 'Noto Sans', Arial, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillStyle = dimmed ? 'rgba(160,160,160,0.2)' : 'rgba(220,220,230,0.85)';
        ctx.fillText(lbl, node.x, node.y + r + 2 / scale);
      }

      ctx.restore();
    })
    .nodeCanvasObjectMode(() => 'replace')
    .nodePointerAreaPaint((node, color, ctx) => {
      const r = Math.sqrt(node.val) * (node.type === 'thema' ? 3.8 : 2.6) + 10;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
      ctx.fill();
    })
    .onNodeDrag(() => {
      // Re-enable the animation loop so connected nodes spring along during drag.
      // force-graph already sets alphaTarget(0.3) internally — we just need to
      // restart the RAF loop. Do NOT call d3ReheatSimulation() (alpha=1 causes jump).
      graph.cooldownTicks(Infinity);
      graph.resumeAnimation();
    })
    .onNodeDragEnd(() => {
      // Let nodes settle for 2 s then freeze
      setTimeout(() => graph.cooldownTicks(0), 2000);
    })
    .onNodeClick(node => callbacks.onNodeClick?.(node))
    .onBackgroundClick(() => callbacks.onBackgroundClick?.())
    .onNodeRightClick(node => callbacks.onNodeRightClick?.(node));

  graph
    .d3Force('charge', graph.d3Force('charge').strength(-280).distanceMax(500))
    .d3Force('link', graph.d3Force('link').distance(link => {
      const s = typeof link.source === 'object' ? link.source.type : '';
      const t = typeof link.target === 'object' ? link.target.type : '';
      return semanticLinkDistance(s, t, state.centerMode);
    }).strength(0.4))
    .d3Force('center', graph.d3Force('center').strength(0.08));

  return graph;
}

function initForceGraph(callbacks) {
  const container = document.getElementById('graph');
  const graph = buildGraphInstance(container, callbacks);
  setState({ graphInstance: graph });

  addCollisionForce();
  configureLayoutForCenterMode(true);
  graph.graphData(getVisibleData());
  setTimeout(() => graph.zoomToFit(800, 80), 2200);

  const ro = new ResizeObserver(() => {
    const c = document.getElementById('graph-container');
    graph.width(c.clientWidth).height(c.clientHeight);
  });
  ro.observe(document.getElementById('graph-container'));

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      callbacks.onEscape?.();
    }
  });
}

export function loadForceGraph(callbacks) {
  const existing = document.querySelector('script[data-force-graph="1"]');
  if (existing && window.ForceGraph) {
    initForceGraph(callbacks);
    return;
  }

  const script = document.createElement('script');
  script.src = 'https://unpkg.com/force-graph@1.43.3/dist/force-graph.min.js';
  script.dataset.forceGraph = '1';
  script.onload = () => initForceGraph(callbacks);
  script.onerror = () => {
    document.getElementById('graph').innerHTML =
      '<p style="color:#e74c3c;padding:20px">force-graph konnte nicht geladen werden (Netzwerk-Fehler).</p>';
  };
  document.head.appendChild(script);
}

export function repaintGraph() {
  const state = getState();
  if (!state.graphInstance) return;
  if (typeof state.graphInstance.refresh === 'function') {
    state.graphInstance.refresh();
  }
}

