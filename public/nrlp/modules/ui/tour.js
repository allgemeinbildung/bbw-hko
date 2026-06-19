const STORAGE_KEY = 'nrlpTourSeenV1';
const VIEWPORT_GAP = 12;
const SPOTLIGHT_PADDING = 7;

const TOUR_STEPS = [
  {
    title: 'Willkommen im NRLP-Netzwerk',
    body: 'Hier siehst du Zusammenhaenge zwischen Themen, Kompetenzen und Bezuegen. In 60 Sekunden kennst du die wichtigsten Bedienelemente.',
    selector: '#header',
    placement: 'bottom'
  },
  {
    title: 'Ansicht: Netzwerk vs. Zirkularitaet',
    body: 'Netzwerk zeigt direkte Beziehungen. Zirkularitaet zeigt Wiederholungen und Progression ueber die Themen und Lehrjahre.',
    selector: '[data-tour="view-toggle"]',
    placement: 'bottom'
  },
  {
    title: 'Preset-Leiste',
    body: 'Mit Presets wechselst du schnell zwischen dichten und fokussierten Perspektiven, ohne alles manuell zu filtern.',
    selector: '[data-tour="preset-group"]',
    placement: 'bottom'
  },
  {
    title: 'Kategorien ein- und ausblenden',
    body: 'Ueber die Kategorie-Chips blendest du Knotentypen direkt ein oder aus und reduzierst visuelle Komplexitaet.',
    selector: '[data-tour="category-group"]',
    placement: 'bottom'
  },
  {
    title: 'Zirkularitaet-Ansicht',
    body: 'Hier siehst du die spiralförmige Progression der Konzepte ueber Themen und Lehrjahre. Wechsle die Ansicht oben zwischen Netzwerk und Zirkularitaet.',
    selector: '#zirk-panel',
    placement: 'top',
    ensureView: 'zirkularitaet'
  },
  {
    title: 'Zirkularitaet-Filter',
    body: 'Mit Lehrjahr und Min R filterst du die Daten. Heatmap, Swimlane und Karten zeigen dieselben Inhalte in drei unterschiedlichen Perspektiven.',
    selector: '.zirk-toolbar',
    placement: 'bottom',
    ensureView: 'zirkularitaet'
  },
  {
    title: 'Im Graph interagieren',
    body: 'Klick auf einen Knoten fokussiert und zeigt Details. Klick auf Hintergrund oder Esc setzt zurueck. Rechtsklick blendet den Knoten aus.',
    selector: '[data-tour="graph-area"]',
    placement: 'top',
    ensureView: 'graph'
  },
  {
    title: 'Hilfe jederzeit oeffnen',
    body: 'Die Tour ist immer ueber dieses ? erreichbar. Nutze sie jederzeit als schnelle Orientierung.',
    selector: '[data-tour="help-button"]',
    placement: 'left'
  }
];

const runtime = {
  initialized: false,
  isOpen: false,
  stepIndex: 0,
  onOpenView: null,
  onClose: null,
  dom: null
};

function safeGetSeen() {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

function safeSetSeen() {
  try {
    localStorage.setItem(STORAGE_KEY, '1');
  } catch {
    // ignore storage errors
  }
}

function isVisible(el) {
  if (!el) return false;
  const rect = el.getBoundingClientRect();
  if (rect.width < 2 || rect.height < 2) return false;
  const style = window.getComputedStyle(el);
  return style.display !== 'none' && style.visibility !== 'hidden' && parseFloat(style.opacity || '1') > 0;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function getFocusableInPopover() {
  if (!runtime.dom?.popover) return [];
  return Array.from(
    runtime.dom.popover.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
  ).filter(el => !el.hasAttribute('disabled'));
}

function setHelpPulse(shouldPulse) {
  const btn = runtime.dom?.helpBtn;
  if (!btn) return;
  btn.classList.toggle('pulse', Boolean(shouldPulse));
}

function resolveStepTarget(step) {
  if (!step?.selector) return null;
  let target = document.querySelector(step.selector);
  if (isVisible(target)) return target;

  if (step.ensureView && typeof runtime.onOpenView === 'function') {
    runtime.onOpenView(step.ensureView);
    target = document.querySelector(step.selector);
  }

  return isVisible(target) ? target : null;
}

function setSpotlightRect(rect) {
  const { spotlight } = runtime.dom;
  if (!spotlight) return;

  if (!rect) {
    spotlight.classList.add('hidden');
    return;
  }

  spotlight.classList.remove('hidden');
  spotlight.style.left = `${Math.max(0, rect.left - SPOTLIGHT_PADDING)}px`;
  spotlight.style.top = `${Math.max(0, rect.top - SPOTLIGHT_PADDING)}px`;
  spotlight.style.width = `${rect.width + SPOTLIGHT_PADDING * 2}px`;
  spotlight.style.height = `${rect.height + SPOTLIGHT_PADDING * 2}px`;
}

function positionPopover(rect, placement) {
  const { popover } = runtime.dom;
  if (!popover) return;

  const popRect = popover.getBoundingClientRect();
  const w = window.innerWidth;
  const h = window.innerHeight;

  const centerPos = {
    left: clamp((w - popRect.width) / 2, VIEWPORT_GAP, w - popRect.width - VIEWPORT_GAP),
    top: clamp((h - popRect.height) / 2, VIEWPORT_GAP, h - popRect.height - VIEWPORT_GAP)
  };

  if (!rect) {
    popover.style.left = `${centerPos.left}px`;
    popover.style.top = `${centerPos.top}px`;
    return;
  }

  const gap = 10;
  const preferred = placement || 'bottom';
  const order = [preferred, 'bottom', 'top', 'right', 'left'];
  const unique = [...new Set(order)];

  const candidates = {
    bottom: {
      left: rect.left + (rect.width - popRect.width) / 2,
      top: rect.bottom + gap
    },
    top: {
      left: rect.left + (rect.width - popRect.width) / 2,
      top: rect.top - popRect.height - gap
    },
    right: {
      left: rect.right + gap,
      top: rect.top + (rect.height - popRect.height) / 2
    },
    left: {
      left: rect.left - popRect.width - gap,
      top: rect.top + (rect.height - popRect.height) / 2
    }
  };

  const fits = pos =>
    pos.left >= VIEWPORT_GAP &&
    pos.top >= VIEWPORT_GAP &&
    pos.left + popRect.width <= w - VIEWPORT_GAP &&
    pos.top + popRect.height <= h - VIEWPORT_GAP;

  const fitPos = unique.map(k => candidates[k]).find(fits) || candidates[preferred];
  popover.style.left = `${clamp(fitPos.left, VIEWPORT_GAP, w - popRect.width - VIEWPORT_GAP)}px`;
  popover.style.top = `${clamp(fitPos.top, VIEWPORT_GAP, h - popRect.height - VIEWPORT_GAP)}px`;
}

function updateStepUi() {
  const step = TOUR_STEPS[runtime.stepIndex];
  const { stepIndicator, title, body, prevBtn, nextBtn } = runtime.dom;
  if (!step || !stepIndicator || !title || !body) return;

  stepIndicator.textContent = `Schritt ${runtime.stepIndex + 1} von ${TOUR_STEPS.length}`;
  title.textContent = step.title;
  body.textContent = step.body;
  prevBtn.disabled = runtime.stepIndex === 0;
  nextBtn.textContent = runtime.stepIndex === TOUR_STEPS.length - 1 ? 'Fertig' : 'Weiter';
}

function renderCurrentStep() {
  if (!runtime.isOpen || !runtime.dom) return;
  updateStepUi();

  const step = TOUR_STEPS[runtime.stepIndex];
  const target = resolveStepTarget(step);
  const rect = target?.getBoundingClientRect() || null;

  setSpotlightRect(rect);
  positionPopover(rect, step?.placement);
}

function openOverlay() {
  const { overlay, nextBtn } = runtime.dom;
  if (!overlay || !nextBtn) return;
  runtime.isOpen = true;
  overlay.classList.remove('hidden');
  overlay.setAttribute('aria-hidden', 'false');
  renderCurrentStep();
  setTimeout(() => nextBtn.focus(), 0);
}

function closeOverlay(markSeen) {
  if (!runtime.dom?.overlay) return;
  runtime.isOpen = false;
  runtime.dom.overlay.classList.add('hidden');
  runtime.dom.overlay.setAttribute('aria-hidden', 'true');
  if (markSeen) {
    safeSetSeen();
    setHelpPulse(false);
  }
  if (typeof runtime.onClose === 'function') runtime.onClose();
}

function onKeyDown(e) {
  if (!runtime.isOpen) return;
  if (e.key === 'Escape') {
    e.preventDefault();
    closeOverlay(true);
    return;
  }
  if (e.key === 'ArrowRight') {
    e.preventDefault();
    nextStep();
    return;
  }
  if (e.key === 'ArrowLeft') {
    e.preventDefault();
    prevStep();
    return;
  }
  if (e.key !== 'Tab') return;

  const focusables = getFocusableInPopover();
  if (!focusables.length) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  const active = document.activeElement;
  if (!focusables.includes(active)) {
    e.preventDefault();
    first.focus();
    return;
  }

  if (e.shiftKey && active === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && active === last) {
    e.preventDefault();
    first.focus();
  }
}

function onViewportChange() {
  if (!runtime.isOpen) return;
  renderCurrentStep();
}

export function startTour() {
  if (!runtime.dom) return;
  runtime.stepIndex = 0;
  openOverlay();
}

export function stopTour() {
  closeOverlay(false);
}

export function nextStep() {
  if (!runtime.isOpen) return;
  if (runtime.stepIndex >= TOUR_STEPS.length - 1) {
    closeOverlay(true);
    return;
  }
  runtime.stepIndex += 1;
  renderCurrentStep();
}

export function prevStep() {
  if (!runtime.isOpen) return;
  runtime.stepIndex = Math.max(0, runtime.stepIndex - 1);
  renderCurrentStep();
}

export function maybeStartTourOnFirstVisit() {
  if (safeGetSeen()) {
    setHelpPulse(false);
    return;
  }
  setHelpPulse(true);
  if (!runtime.isOpen) startTour();
}

export function initTour({ onOpenView, onClose } = {}) {
  runtime.onOpenView = onOpenView || null;
  runtime.onClose = onClose || null;

  if (runtime.initialized) return;

  const overlay = document.getElementById('tour-overlay');
  const backdrop = overlay?.querySelector('.tour-backdrop') || null;
  const spotlight = document.getElementById('tour-spotlight');
  const popover = document.getElementById('tour-popover');
  const helpBtn = document.getElementById('tour-help-btn');
  const closeBtn = document.getElementById('tour-close-btn');
  const skipBtn = document.getElementById('tour-skip-btn');
  const prevBtn = document.getElementById('tour-prev-btn');
  const nextBtn = document.getElementById('tour-next-btn');
  const stepIndicator = document.getElementById('tour-step-indicator');
  const title = document.getElementById('tour-title');
  const body = document.getElementById('tour-body');

  if (!overlay || !backdrop || !spotlight || !popover || !helpBtn || !closeBtn || !skipBtn || !prevBtn || !nextBtn || !stepIndicator || !title || !body) {
    return;
  }

  popover.setAttribute('tabindex', '-1');
  runtime.dom = { overlay, backdrop, spotlight, popover, helpBtn, closeBtn, skipBtn, prevBtn, nextBtn, stepIndicator, title, body };

  helpBtn.addEventListener('click', () => startTour());
  closeBtn.addEventListener('click', () => closeOverlay(true));
  skipBtn.addEventListener('click', () => closeOverlay(true));
  prevBtn.addEventListener('click', () => prevStep());
  nextBtn.addEventListener('click', () => nextStep());
  overlay.addEventListener('click', e => {
    if (e.target === overlay || e.target === runtime.dom.backdrop) {
      closeOverlay(true);
    }
  });

  document.addEventListener('keydown', onKeyDown);
  window.addEventListener('resize', onViewportChange);
  window.addEventListener('scroll', onViewportChange, true);

  setHelpPulse(!safeGetSeen());
  runtime.initialized = true;
}
