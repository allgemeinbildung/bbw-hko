export function hexToRgba(hex, alpha) {
  if (!hex || !hex.startsWith('#')) return `rgba(150,150,150,${alpha})`;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export function rBadgeColor(r) {
  const colors = {
    1: 'rgba(59,130,246,0.25)',
    2: 'rgba(34,197,94,0.25)',
    3: 'rgba(245,158,11,0.28)',
    4: 'rgba(249,115,22,0.3)',
    5: 'rgba(236,72,153,0.32)',
    6: 'rgba(239,68,68,0.34)'
  };
  return colors[r] || 'rgba(148,163,184,0.3)';
}

