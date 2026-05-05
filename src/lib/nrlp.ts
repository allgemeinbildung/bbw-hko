import data from '../../public/nrlp.json'

export interface NrlpEntry {
  bezeichnung: string
  beschreibung?: string
  [key: string]: unknown
}

export interface Thema {
  nr: number
  titel: string
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
}

export const nrlp = data as unknown as Nrlp
