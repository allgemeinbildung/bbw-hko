import nrlp3j from '../../public/nrlp_3j.json'
import nrlp4j from '../../public/nrlp_4j.json'

export type Lehrdauer = 'EBA' | 'EFZ-3J' | 'EFZ-4J'

export interface NrlpEntry {
  bezeichnung: string
  beschreibung?: string
  [key: string]: unknown
}

export interface Thema {
  nr: number
  titel: string
  lehrjahr?: number
  [key: string]: unknown
}

export interface Nrlp {
  meta: Record<string, unknown>
  zirkularitaet: {
    gesellschaftsinhalte: NrlpEntry[]
    schluesselkompetenzen: NrlpEntry[]
    sprachmodi: NrlpEntry[]
  }
  themen: Thema[]
  umsetzungsbeispiele?: unknown[]
}

const datasets: Partial<Record<Lehrdauer, Nrlp>> = {
  'EFZ-3J': nrlp3j as unknown as Nrlp,
  'EFZ-4J': nrlp4j as unknown as Nrlp,
  // 'EBA': nrlp2j — to be added when the 2-jährige curriculum is published
}

/**
 * Returns the nRLP dataset for a given Lehrdauer, or `null` if that curriculum
 * has not been published yet (currently EBA / 2-jährig).
 */
export function getNrlp(lehrdauer: Lehrdauer | string | null | undefined): Nrlp | null {
  if (!lehrdauer) return null
  return datasets[lehrdauer as Lehrdauer] ?? null
}

/**
 * The taxonomy block (`zirkularitaet`) is identical across the 3j and 4j
 * curricula, so SK / Aspekt / Sprachmodus dropdowns and filters can reuse a
 * single source. Falls back to 3j (the most complete dataset).
 */
export const nrlpGlobal: Nrlp = nrlp3j as unknown as Nrlp

/**
 * Backwards-compatible default export used by code that doesn't (yet) know
 * about lehrdauer (situationen lib, admin views). Points at 3j.
 */
export const nrlp: Nrlp = nrlpGlobal

export const supportedLehrdauer: Lehrdauer[] = Object.keys(datasets) as Lehrdauer[]
