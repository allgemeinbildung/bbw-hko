// Interim-Orientierungsbeispiel aus echten bbw-hko-Units, solange
// nrlp.umsetzungsbeispiele leer ist (offizielle folgen ~Ende Juni 2026).
const DATASET_LEHRGANG = { '3j': 'EFZ_3J', '4j': 'EFZ_4J', '2j': 'EBA_2J' };

function lehrgangArr(v) { return Array.isArray(v) ? v : (v ? [v] : []); }

export function orientierungAusUnits(S, datasetPath) {
  const U = window.__UNITS || { einheiten: [], situationen: [] };
  const m = String(datasetPath).match(/nrlp_(\dj)/);
  const want = DATASET_LEHRGANG[m ? m[1] : '3j'];
  const kNrs = new Set((S.kompetenzen || []).map(k => k.nr));
  const lbNr = (S.lebensbezuege || [])[0]?.nr;

  // 1) passende Einheit (Kompetenz-Treffer, Lehrgang passend, nicht Entwurf für lp/gast)
  const role = window.__NRLP_ROLE || 'lp';
  const eh = (U.einheiten || []).find(e => {
    const lg = lehrgangArr(e.lehrgang);
    const lgOk = !lg.length || lg.includes(want);
    const draftOk = (role === 'kt1' || role === 'reviewer') ? true : e.status !== 'entwurf';
    const komp = (e.abgedeckte_kompetenzen || [e.kompetenz_nr]).some(n => kNrs.has(n));
    return lgOk && draftOk && komp;
  });
  if (eh) {
    const hf = eh.hf_titel ? Object.values(eh.hf_titel)[0] : (eh.einheit_titel || eh.titel);
    return { quelle: `Einheit ${eh.id}`, herausforderung: hf, produkt: eh.einheit_titel || eh.titel };
  }
  // 2) sonst passende Situation über Lebensbezug
  const sit = (U.situationen || []).find(s => s.lebensbezug_nr === lbNr || s.modul === lbNr);
  if (sit) return { quelle: `Situation ${sit.id}`, herausforderung: sit.leitfrage || sit.titel, produkt: sit.handlungsprodukt_format || sit.handlungsprodukt_titel || '' };
  return null;
}
