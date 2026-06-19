import { CATEGORY_CONFIG } from '../config.js';
import { getState } from '../state.js';

const MAX_PINS = 3;

export function buildSidebar({ onPinChanged } = {}) {
  const state = getState();
  const sidebar = document.getElementById('sidebar');
  sidebar.innerHTML = '';

  // Instruction / pin counter
  const counter = document.createElement('div');
  counter.className = 'sidebar-pin-counter';
  counter.id = 'sidebar-pin-counter';
  sidebar.appendChild(counter);
  _updateCounter(counter, state.pinnedHighlightIds.size);

  CATEGORY_CONFIG.forEach(cfg => {
    const catNodes = state.allNodes.filter(n => n.type === cfg.cat);
    if (catNodes.length === 0) return;

    const section = document.createElement('div');
    section.className = 'sidebar-section';

    const header = document.createElement('div');
    header.className = 'sidebar-section-header';

    const dot = document.createElement('span');
    dot.className = 'section-dot';
    dot.style.background = cfg.color;

    const title = document.createElement('span');
    title.className = 'section-title';
    title.textContent = cfg.label;

    const chevron = document.createElement('span');
    chevron.className = 'section-chevron open';
    chevron.textContent = '▾';

    header.append(dot, title, chevron);

    const itemsDiv = document.createElement('div');
    itemsDiv.className = 'sidebar-items';
    itemsDiv.id = `items-${cfg.cat}`;

    header.addEventListener('click', () => {
      itemsDiv.classList.toggle('collapsed');
      chevron.classList.toggle('open');
    });

    catNodes.forEach(n => {
      const item = document.createElement('div');
      item.className = 'sidebar-item sidebar-pin-item';
      item.dataset.nodeId = n.id;
      item.title = n.name;

      const colorDot = document.createElement('span');
      colorDot.className = 'item-color-dot';
      colorDot.style.background = n.color;

      const lbl = document.createElement('span');
      lbl.className = 'item-label';
      lbl.textContent = n.label;

      const pinDot = document.createElement('span');
      pinDot.className = 'item-pin-dot';

      item.append(colorDot, lbl, pinDot);
      itemsDiv.appendChild(item);

      item.addEventListener('click', () => {
        const pins = state.pinnedHighlightIds;
        if (pins.has(n.id)) {
          pins.delete(n.id);
        } else {
          if (pins.size >= MAX_PINS) return;
          pins.add(n.id);
        }
        syncSidebarPins();
        onPinChanged?.();
      });
    });

    section.append(header, itemsDiv);
    sidebar.appendChild(section);
  });
}

function _updateCounter(el, count) {
  if (count === 0) {
    el.textContent = 'Knoten anklicken zum Hervorheben (max. 3)';
  } else {
    el.textContent = `${count} / ${MAX_PINS} hervorgehoben`;
  }
}

export function syncSidebarPins() {
  const state = getState();
  const pins = state.pinnedHighlightIds;

  const counter = document.getElementById('sidebar-pin-counter');
  if (counter) _updateCounter(counter, pins.size);

  document.querySelectorAll('.sidebar-pin-item').forEach(item => {
    const nodeId = item.dataset.nodeId;
    const isPinned = pins.has(nodeId);
    const isFull = pins.size >= MAX_PINS && !isPinned;
    item.classList.toggle('pinned', isPinned);
    item.classList.toggle('pin-disabled', isFull);
  });
}
