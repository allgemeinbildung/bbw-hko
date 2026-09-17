// Einheiten-Treffer zur aktuellen Lehrplan-Auswahl.
//
// Zwei Konsumenten, eine Suche: das Orientierungsbeispiel im Prompt (orientierung.js)
// nimmt den besten Kompetenz-Treffer, das Werkstatt-Panel (render.js) zeigt beide
// Ebenen an. Beides laeuft ueber `window.__UNITS`, das app.js beim Start aus
// einheiten.index.json laedt.
//
// Die zwei Ebenen bleiben getrennt, weil sie Verschiedenes bedeuten: ein Treffer auf
// der gewaehlten Kompetenz ist eine Einheit, die dasselbe leistet; ein Treffer auf dem
// Lebensbezug ist eine Einheit aus derselben Nachbarschaft. Nur die erste taugt als
// Massstab im Prompt — die zweite taugt als Angebot in der Liste.

const DATASET_LEHRGANG = { '3j': 'EFZ_3J', '4j': 'EFZ_4J', '2j': 'EBA_2J' };

function lehrgangArr(v) { return Array.isArray(v) ? v : (v ? [v] : []); }

export function lehrgangAusDataset(datasetPath) {
  const m = String(datasetPath || '').match(/nrlp_(\dj)/);
  return DATASET_LEHRGANG[m ? m[1] : '3j'];
}

/**
 * { kompetenz: [...], lebensbezug: [...] } — nach Naehe getrennt, ohne Ueberschneidung.
 * Ohne Thema-Auswahl gibt es bewusst nichts: eine Liste aller Einheiten waere kein
 * Treffer, sondern der Katalog.
 */
export function passendeEinheiten(S, datasetPath) {
  const leer = { kompetenz: [], lebensbezug: [] };
  const U = window.__UNITS || { einheiten: [], situationen: [] };
  if (!S || !S.thema) return leer;

  const want = lehrgangAusDataset(datasetPath);
  const role = window.__NRLP_ROLE || 'lp';
  const kNrs = new Set((S.kompetenzen || []).map(k => k.nr));
  const lbNrs = new Set((S.lebensbezuege || []).map(l => l.nr));

  const kompetenz = [];
  const lebensbezug = [];

  for (const e of (U.einheiten || [])) {
    const lg = lehrgangArr(e.lehrgaenge && e.lehrgaenge.length ? e.lehrgaenge : e.lehrgang);
    if (lg.length && !lg.includes(want)) continue;
    // Entwuerfe sieht nur KT1 — dieselbe Schranke wie im Katalog.
    if (role !== 'kt1' && role !== 'reviewer' && e.status === 'entwurf') continue;

    const komp = (e.abgedeckte_kompetenzen && e.abgedeckte_kompetenzen.length)
      ? e.abgedeckte_kompetenzen
      : [e.kompetenz_nr];
    if (komp.some(n => kNrs.has(n))) kompetenz.push(e);
    else if (lbNrs.has(e.modul)) lebensbezug.push(e);
  }

  return { kompetenz, lebensbezug };
}

/**
 * Bester Treffer fuer das Orientierungsbeispiel im Prompt — bewusst nur auf
 * Kompetenz-Ebene. Eine Nachbar-Einheit als Massstab auszugeben, waere eine
 * Genauigkeit, die sie nicht hat.
 */
export function besteEinheit(S, datasetPath) {
  return passendeEinheiten(S, datasetPath).kompetenz[0] || null;
}

/** Fallback, wenn keine Einheit passt: eine Situation ueber den Lebensbezug. */
export function besteSituation(S) {
  const U = window.__UNITS || { situationen: [] };
  const erste = (S.lebensbezuege || [])[0];
  const lbNr = erste && erste.nr;
  if (!lbNr) return null;
  return (U.situationen || []).find(s => s.lebensbezug_nr === lbNr || s.modul === lbNr) || null;
}
