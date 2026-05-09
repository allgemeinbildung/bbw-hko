import index from '../data/situationen.index.json'
import { nrlp } from './nrlp'

export interface SituationIndexEntry {
  id: string
  modul: string | null
  modul_titel: string | null
  thema_nr: number | null
  themen: string[]
  lebensbezug_nr: string | null
  kompetenz_nr: string | null
  sit_letter: string | null
  titel: string | null
  emotion_tag: string | null
  persona: { beruf?: string; betrieb?: string; ort?: string } | null
  aspekte: string[]
  sprachmodi: string[]
  sk: number[]
  wochen: number | null
  leitfrage: string | null
  handlungsprodukt_format: string | null
  handlungsprodukt_titel: string | null
  quelle_json: string
  quelle_html: string
}

export const situationenIndex = index as SituationIndexEntry[]

export const themaLehrjahrMap: Record<number, number | null> = Object.fromEntries(
  nrlp.themen.map((t: any) => [t.nr, t.lehrjahr ?? null]),
)

export function lehrjahrForEntry(e: SituationIndexEntry): number | null {
  return e.thema_nr != null ? themaLehrjahrMap[e.thema_nr] ?? null : null
}

export interface SituationFilters {
  thema_nr: string
  lebensbezug: string
  kompetenz: string
  lehrjahr: string
  sk: string
  aspekt: string
  sprachmodus: string
  q: string
}

export function emptyFilters(): SituationFilters {
  return {
    thema_nr: '',
    lebensbezug: '',
    kompetenz: '',
    lehrjahr: '',
    sk: '',
    aspekt: '',
    sprachmodus: '',
    q: '',
  }
}

export function applyFilters(
  list: SituationIndexEntry[],
  f: SituationFilters,
): SituationIndexEntry[] {
  const q = f.q.trim().toLowerCase()
  return list.filter((e) => {
    if (f.thema_nr && String(e.thema_nr ?? '') !== f.thema_nr) return false
    if (f.lebensbezug && e.lebensbezug_nr !== f.lebensbezug) return false
    if (f.kompetenz && e.kompetenz_nr !== f.kompetenz) return false
    if (f.lehrjahr) {
      const lj = lehrjahrForEntry(e)
      if (lj == null || String(lj) !== f.lehrjahr) return false
    }
    if (f.sk && !e.sk.map(String).includes(f.sk)) return false
    if (f.aspekt && !e.aspekte.includes(f.aspekt)) return false
    if (f.sprachmodus && !e.sprachmodi.includes(f.sprachmodus)) return false
    if (q) {
      const hay = [
        e.titel ?? '',
        e.kompetenz_nr ?? '',
        e.persona?.beruf ?? '',
        e.persona?.betrieb ?? '',
        e.handlungsprodukt_format ?? '',
        e.leitfrage ?? '',
      ]
        .join(' ')
        .toLowerCase()
      if (!hay.includes(q)) return false
    }
    return true
  })
}

export async function loadFullSituation(id: string): Promise<any | null> {
  try {
    const mods = import.meta.glob('../data/situationen/*.json')
    const match = Object.entries(mods).find(([p]) => p.endsWith(`/${id}.json`))
    if (!match) return null
    const mod = await match[1]()
    return (mod as any).default ?? mod
  } catch {
    return null
  }
}
