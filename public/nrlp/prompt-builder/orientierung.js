// Ersatz-Orientierungsbeispiel aus echten bbw-hko-Units fuer die Faelle, in denen
// es KEIN offizielles Umsetzungsbeispiel gibt. Die offiziellen (51 Varianten, seit
// Juli 2026 in den Datensaetzen) haben Vorrang und werden in prompts.js zuerst
// gesucht — siehe umsetzungsbeispiele.js. Ungedeckt bleiben vor allem die EFZ-Themen
// ohne SLP-Variante (u. a. T7 Schlussarbeit und T8).
//
// Die Suche selbst steht in einheiten.js — dasselbe Matching speist das
// Werkstatt-Panel, das die passenden Einheiten auflistet.
import { besteEinheit, besteSituation } from './einheiten.js';

export function orientierungAusUnits(S, datasetPath) {
  const eh = besteEinheit(S, datasetPath);
  if (eh) {
    const hf = eh.hf_titel ? Object.values(eh.hf_titel)[0] : (eh.einheit_titel || eh.titel);
    return { quelle: `Einheit ${eh.id}`, herausforderung: hf, produkt: eh.einheit_titel || eh.titel };
  }
  const sit = besteSituation(S);
  if (sit) {
    return {
      quelle: `Situation ${sit.id}`,
      herausforderung: sit.leitfrage || sit.titel,
      produkt: sit.handlungsprodukt_format || sit.handlungsprodukt_titel || '',
    };
  }
  return null;
}
