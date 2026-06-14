/**
 * SK label maps for the 12 Schlüsselkompetenzen.
 *
 * The data (short labels + full Bildungsrat sentences) is AUTO-DERIVED from
 * public/nrlp_3j.json at build time — see scripts/build-sk-labels.mjs, which
 * writes ./sk-labels.generated.ts. Do not hand-edit the data here; update the
 * nRLP JSON and run `npm run build:sk-labels` (or just `npm run build`, which
 * regenerates via the prebuild hook).
 *
 * - skFullName  : short label -> full Bildungsrat sentence (shown on hover)
 * - skShortByNr : SK id 1..12 -> short label (Situation JSONs store sk as numbers)
 *
 * This module re-exports the generated maps and adds the hand-written helpers.
 */
export { skFullName, skShortByNr } from './sk-labels.generated'

import { skFullName, skShortByNr } from './sk-labels.generated'

export function skTooltip(short: string): string {
  return skFullName[short] || short
}

export function skNameByNr(n: number): string {
  return skShortByNr[n] || `SK ${n}`
}
