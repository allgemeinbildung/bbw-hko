// D4 — Single source of truth for the user-facing KN-Typ labels.
//
// The internal keys (`werkschau_transfer`, `fachgespraech`, …) are stable
// identifiers and must NEVER be renamed. Only the *display* labels below are
// user-facing. The cantonal terminology for «Werkschau» is still open
// (Werkschau vs. Portfolio) — once decided, a rename is a one-line change here
// and propagates to every display surface that routes through `knTypLabel()`.
// See also src/data/glossar.json → «Werkschau» (kanton_alias: offen).
//
// Known display surfaces that use this map:
//   - src/pages/einheiten/[setKey]/feedback.astro  (KN-Typ Dropdown)
//   - src/pages/einheiten/[setKey].astro            (B3 «Was deckt … ab?»-Panel)
//   - src/pages/jahresplanung.astro                 (KN-Format Dropdown)
//   - src/components/einheiten/EinheitWorkbench.tsx (Dokumentbaum + Kopf)
//   - src/components/einheiten/docs/DocKnS.tsx      (Badge)
//   - src/components/einheiten/docs/DocKnLp.tsx     (Typ-Karten + Abschnitts-Titel)
// The label in src/data/einheiten/*/kn.json + einheiten.index.json is only a
// fallback; the map wins wherever `knTypLabel()` is called.

export const KN_TYP_LABELS: Record<string, string> = {
  fachgespraech: 'Fachgespräch',
  mini_case_schriftlich: 'Mini Case schriftlich',
  werkschau_transfer: 'Werkschau + Transfer-Reflexion',
  andere: 'Andere',
}

/** Ordered list for building <select> dropdowns (insertion order = display order). */
export const KN_TYP_OPTIONS: { value: string; label: string }[] =
  Object.entries(KN_TYP_LABELS).map(([value, label]) => ({ value, label }))

/** Resolve a KN-Typ key to its canonical display label, with an optional fallback. */
export function knTypLabel(typ: string, fallback?: string): string {
  return KN_TYP_LABELS[typ] || fallback || typ
}
