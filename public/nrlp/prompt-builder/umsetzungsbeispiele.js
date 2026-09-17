// Offizielle Umsetzungsbeispiele des Schullehrplans (Bildungsrat 2026).
//
// Sie liegen in den nRLP-Datensaetzen unter `umsetzungsbeispiele`, dorthin geschrieben
// von scripts/build-umsetzungsbeispiele-nrlp.mjs aus src/data/umsetzungsbeispiele.index.json:
// 9 (EFZ-3J) + 10 (EFZ-4J) + 32 (EBA) = 51 Varianten.
//
// GEMATCHT WIRD UEBER `kompetenz_nrs`, NICHT UEBER `variante`.
// `variante` ist ein menschenlesbares Etikett aus dem SLP-PDF und taugt nicht als
// Schluessel. Was dort real steht:
//   EFZ   "1.1"  ·  "1.1 (erweitertes Niveau) · erw."  ·  "4.1, 4.2"  ·  "6.1, 6.2 und 6.3"  ·  "2.3 & 5.2"
//   EBA   "1.1.1"   — dort eine KOMPETENZ-, keine Lebensbezugsnummer
// Der frueher verwendete Vergleich `variante === lebensbezugNr` erreichte darum
// 9 von 51 Varianten und im EBA keine einzige.
//
// Auch `thema_nr` wird bewusst nicht mehr geprueft: die Kompetenznummer traegt das
// Thema bereits, und die Mehr-Themen-Variante "2.3 & 5.2" hat `thema_nr: 2` — wer in
// T5 arbeitet, haette sie nie gefunden, obwohl `thema_nrs` [2,5] sagt.

/** Grundniveau zuerst, danach die erweiterte Variante derselben Sache. */
function rang(a, b) {
  const n = (x) => (x && x.niveau === 'erweitert' ? 1 : 0);
  return n(a) - n(b);
}

/**
 * Alle offiziellen Varianten zur aktuellen Auswahl, genaueste zuerst.
 * Stufe 1: Treffer auf einer gewaehlten Kompetenz.
 * Stufe 2: Treffer auf dem gewaehlten Lebensbezug (Praefix der Kompetenznummern).
 */
export function beispieleFuer(S, nrlp) {
  const alle = (nrlp && nrlp.umsetzungsbeispiele) || [];
  if (!alle.length || !S) return [];

  const kNrs = new Set((S.kompetenzen || []).map((k) => k.nr));
  if (kNrs.size) {
    const treffer = alle.filter((b) => (b.kompetenz_nrs || []).some((n) => kNrs.has(n)));
    if (treffer.length) return treffer.slice().sort(rang);
  }

  const lbNrs = (S.lebensbezuege || []).map((l) => l.nr).filter(Boolean);
  if (lbNrs.length) {
    const treffer = alle.filter((b) =>
      lbNrs.some(
        (lb) =>
          (b.kompetenz_nrs || []).some((n) => n === lb || String(n).startsWith(lb + '.')) ||
          b.variante === lb
      )
    );
    if (treffer.length) return treffer.slice().sort(rang);
  }

  return [];
}

/** Bestes Beispiel fuer den Prompt. */
export function bestesBeispiel(S, nrlp) {
  return beispieleFuer(S, nrlp)[0] || null;
}
