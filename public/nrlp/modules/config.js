export const LEHRJAHR_COLORS = {
  1: '#3b82f6',
  2: '#f59e0b',
  3: '#22c55e',
  4: '#ec4899'
};

// nRLP Thema-Identitaetsfarben (EFZ 3-/4-jaehrig), Spiegel von
// src/lib/thema-colors.ts. Themen-Knoten tragen ihre offizielle Lehrplanfarbe.
export const THEMA_COLORS = {
  1: '#009EE0', 2: '#EC008C', 3: '#EB690B', 4: '#3EA743',
  5: '#033E80', 6: '#885EA0', 7: '#007B7A', 8: '#00A1A3'
};

export const GESELLSCHAFT_COLORS = {
  'Ethik': '#af7ac5',
  'Identität & Sozialisation': '#5499c7',
  'Kultur': '#48c9b0',
  'Ökologie': '#52be80',
  'Politik': '#e8d44d',
  'Recht': '#eb984e',
  'Technologie und digitale Transformation': '#94a3b8',
  'Technologische und digitale Transformation': '#94a3b8',
  'Techn. & dig. Transformation': '#94a3b8',
  'Wirtschaft': '#f5b041'
};

export const CATEGORY_CONFIG = [
  { cat: 'thema', label: 'Themen', color: '#3b82f6' },
  { cat: 'lebensbezug', label: 'Lebensbezüge', color: '#6366f1' },
  { cat: 'kompetenz', label: 'Kompetenzen', color: '#14b8a6' },
  { cat: 'gesellschaft', label: 'Gesellschaft', color: '#9b59b6' },
  { cat: 'sprachmodus', label: 'Sprachmodi', color: '#e91e63' },
  { cat: 'sk', label: 'Schlüsselkompetenzen', color: '#f97316' },
  { cat: 'umsetzung', label: 'Umsetzungen', color: '#10b981' },
  { cat: 'scaffold', label: 'Scaffolds', color: '#06b6d4' },
  { cat: 'bewertung', label: 'Bewertung', color: '#f59e0b' },
  { cat: 'einheit', label: 'Einheiten', color: '#0E6E3A' },
  { cat: 'situation', label: 'Situationen', color: '#6b21a8' }
];

export const PRESET_CONFIGS = {
  basis: {
    visibleCats: ['thema', 'lebensbezug', 'kompetenz'],
    density: 'medium',
    center: 'thema'
  },
  didaktik: {
    visibleCats: ['thema', 'lebensbezug', 'kompetenz', 'umsetzung', 'scaffold', 'bewertung'],
    density: 'medium',
    center: 'umsetzung'
  },
  kompetenzen: {
    visibleCats: ['thema', 'lebensbezug', 'kompetenz', 'gesellschaft', 'sprachmodus', 'sk'],
    density: 'low',
    center: 'kompetenz'
  },
  zirkularitaet: {
    visibleCats: ['thema', 'gesellschaft', 'sprachmodus', 'sk'],
    density: 'low',
    center: 'thema'
  },
  voll: {
    visibleCats: CATEGORY_CONFIG.map(c => c.cat),
    density: 'high',
    center: 'thema'
  }
};

export const TYPE_LABELS = {
  thema: 'Thema',
  lebensbezug: 'Lebensbezug',
  kompetenz: 'Kompetenz',
  gesellschaft: 'Gesellschaft',
  sprachmodus: 'Sprachmodus',
  sk: 'Schlüsselkompetenz',
  umsetzung: 'Umsetzung',
  scaffold: 'Scaffold',
  bewertung: 'Bewertung',
  einheit: 'Einheit',
  situation: 'Situation'
};

