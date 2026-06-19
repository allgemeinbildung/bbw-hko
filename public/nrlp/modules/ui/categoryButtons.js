import { CATEGORY_CONFIG } from '../config.js';
import { getState } from '../state.js';
import { syncSidebarPins } from './sidebar.js';

export function buildCatButtons({ onVisibilityChanged } = {}) {
  const state = getState();
  const container = document.getElementById('cat-btns');
  container.innerHTML = '';

  CATEGORY_CONFIG.forEach(cfg => {
    const btn = document.createElement('button');
    btn.className = 'cat-btn';
    btn.dataset.cat = cfg.cat;
    btn.style.background = cfg.color;
    if (cfg.cat === 'sk') btn.style.color = '#111';

    const dot = document.createElement('span');
    dot.className = 'dot';
    dot.style.background = cfg.cat === 'thema'
      ? 'rgba(255,255,255,0.6)'
      : 'rgba(255,255,255,0.5)';

    btn.append(dot, document.createTextNode(cfg.label));
    btn.addEventListener('click', () => {
      const catNodes = state.allNodes.filter(n => n.type === cfg.cat);
      const allOff = catNodes.every(n => state.hiddenIds.has(n.id));
      catNodes.forEach(n => {
        if (allOff) state.hiddenIds.delete(n.id);
        else state.hiddenIds.add(n.id);
      });
      btn.classList.toggle('off', !allOff);
      syncSidebarPins();
      onVisibilityChanged?.();
    });

    container.appendChild(btn);
  });
}

export function syncCatButton(cat) {
  const state = getState();
  const btn = document.querySelector(`.cat-btn[data-cat="${cat}"]`);
  if (!btn) return;
  const catNodes = state.allNodes.filter(n => n.type === cat);
  const allOff = catNodes.length > 0 && catNodes.every(n => state.hiddenIds.has(n.id));
  btn.classList.toggle('off', allOff);
}

export function syncAllCategoryUI() {
  syncSidebarPins();
  CATEGORY_CONFIG.forEach(cfg => syncCatButton(cfg.cat));
}

