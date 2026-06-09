// SSR-only: löst die Kompetenz-Sätze einer Herausforderung VERBATIM aus dem
// kanonischen nRLP-Datensatz (public/nrlp_3j.json / nrlp_4j.json) auf.
//
// Warum hier und nicht im Renderer-Island: DocS.tsx wird `client:only` gerendert
// (Preview + ZIP-Bundle laufen im Browser). Würde der Renderer den nRLP-Datensatz
// (~84 KB) importieren, landete er im Client-Bundle. Stattdessen reichern wir die
// `EinheitFullSet` SSR-seitig in [setKey].astro an (`enrichKompetenzen`) und
// serialisieren nur das Ergebnis ins Island. Dieses Modul darf deshalb NIEMALS aus
// einem `client:*`-Component importiert werden — nur aus .astro-Frontmatter/SSR.
//
// Automatisierung für künftige Einheiten: Der Architekt setzt pro Herausforderung
// nur `nrlp.nr_primary` (welche Kompetenzen real abgedeckt sind). Den Klartext-Satz
// holt diese Funktion bei jedem Request frisch aus dem nRLP — kein manuelles
// Kopieren, keine Build-Schritte, keine Datenduplikate, die veralten können.

import { getNrlp } from '../nrlp'
import type { EinheitFullSet, NrlpRef, SituationJson } from './types'

export interface KompetenzText {
  nr: string
  text: string
}

// einheiten-Lehrgang ("EFZ_3J") → getNrlp-Schlüssel ("EFZ-3J").
function lehrgangToLehrdauer(lehrgang?: string | null): string {
  const s = (lehrgang || '').toUpperCase()
  if (s.includes('4J')) return 'EFZ-4J'
  if (s.includes('EBA') || s.includes('2J')) return 'EBA'
  return 'EFZ-3J'
}

// Flache { Kompetenz-Nr → Klartext }-Map pro Datensatz, memoisiert.
const mapCache = new Map<string, Map<string, string>>()
function kompMap(lehrdauer: string): Map<string, string> {
  const cached = mapCache.get(lehrdauer)
  if (cached) return cached
  const map = new Map<string, string>()
  const ds = getNrlp(lehrdauer)
  for (const t of (ds?.themen as Array<Record<string, unknown>>) || []) {
    for (const lb of (t.lebensbezuege as Array<Record<string, unknown>>) || []) {
      for (const k of (lb.kompetenzen as Array<{ nr?: string; text?: string }>) || []) {
        if (k?.nr && k?.text) map.set(String(k.nr), String(k.text))
      }
    }
  }
  mapCache.set(lehrdauer, map)
  return map
}

// Alle abgedeckten Kompetenzen (nr_primary, Fallback [nr]) als {nr, text}, verbatim
// aus dem nRLP. Reihenfolge = nr_primary; dedupliziert. Fällt der Lookup aus
// (Nummer nicht im Datensatz), greift für die Primärnummer der bereits in der
// Herausforderung gespeicherte `kompetenz_text`.
export function resolveKompetenzen(nrlp: NrlpRef | undefined, lehrgang?: string | null): KompetenzText[] {
  if (!nrlp) return []
  const source = nrlp.nr_primary && nrlp.nr_primary.length ? nrlp.nr_primary : [nrlp.nr]
  const nrs = source.filter(Boolean) as string[]
  const map = kompMap(lehrgangToLehrdauer(lehrgang))
  const seen = new Set<string>()
  const out: KompetenzText[] = []
  for (const raw of nrs) {
    const nr = String(raw)
    if (seen.has(nr)) continue
    seen.add(nr)
    const text = map.get(nr) || (nr === String(nrlp.nr || '') ? nrlp.kompetenz_text || '' : '')
    if (text) out.push({ nr, text })
  }
  return out
}

// Liefert eine NEUE Herausforderung mit befülltem `nrlp.kompetenzen`. Wichtig:
// die JSON-Module sind via import.meta.glob modul-global gecached — niemals
// in-place mutieren, sonst leckt der Wert über Requests hinweg.
function enrichHf(hf: SituationJson | null, lehrgang?: string | null): SituationJson | null {
  if (!hf) return hf
  const kompetenzen = resolveKompetenzen(hf.nrlp, lehrgang ?? hf.lehrgang)
  if (!kompetenzen.length) return hf
  return { ...hf, nrlp: { ...hf.nrlp, kompetenzen } }
}

// Reichert ein komplettes Set (A/B/C) an. SSR aufrufen, bevor das Set ins
// `client:only`-Island serialisiert wird.
export function enrichKompetenzen(set: EinheitFullSet): EinheitFullSet {
  const lehrgang = set.hf_A?.lehrgang || set.hf_B?.lehrgang || set.hf_C?.lehrgang
  return {
    ...set,
    hf_A: enrichHf(set.hf_A, lehrgang),
    hf_B: enrichHf(set.hf_B, lehrgang),
    hf_C: enrichHf(set.hf_C, lehrgang),
  }
}
