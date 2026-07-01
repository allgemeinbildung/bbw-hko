import index from '../data/umsetzungsbeispiele.index.json'
import { getNrlp } from './nrlp'

export type UbLehrgang = 'EBA' | 'EFZ-3J' | 'EFZ-4J'

export interface UbLabeled {
  bereich: string | null
  text: string
}

export interface UbEntry {
  id: string
  lehrgang: UbLehrgang
  variant_label: string
  niveau: 'grund' | 'erweitert'
  thema_nr_ctx: number | null
  thema_nrs: number[]
  codes: string[]
  kompetenz_nrs: string[]
  titel: string
  herausforderung: string
  produkt: string
  gesellschaftliche_inhalte: UbLabeled[]
  schluesselkompetenzen: string[]
  sprachmodi: UbLabeled[]
  scaffolds: UbLabeled[]
  bewertung: { suk: string[]; ges: string[] }
  raster_md: string
  raw_md: string
}

const raw = (index as any).entries as UbEntry[]

export const umsetzungsbeispiele = raw

export const UB_LEHRGAENGE: { key: UbLehrgang; label: string; file: string; desc: string }[] = [
  { key: 'EFZ-3J', label: 'EFZ 3-jährig', file: '/umsetzungsbeispiele/efz-3j.pdf', desc: 'Herausforderungen mit Kompetenzrastern · z.T. mehrere Kompetenzen kombiniert' },
  { key: 'EFZ-4J', label: 'EFZ 4-jährig', file: '/umsetzungsbeispiele/efz-4j.pdf', desc: 'Herausforderungen mit Kompetenzrastern · erweiterte Varianten' },
  { key: 'EBA', label: 'EBA 2-jährig', file: '/umsetzungsbeispiele/eba.pdf', desc: 'Eine Umsetzungsvariante pro Einzelkompetenz' },
]

/** Titles for Themen 1–8, per Lehrgang, read from the matching nRLP dataset. */
export function themaTitles(lehrgang: UbLehrgang): Record<number, string> {
  const ds = getNrlp(lehrgang === 'EBA' ? 'EBA' : lehrgang) as any
  const out: Record<number, string> = {}
  if (ds?.themen) for (const t of ds.themen) out[t.nr] = t.titel
  return out
}

/** All Themen present in the data, with a best-effort title. */
export function allThemen(): { nr: number; titel: string }[] {
  const efz = themaTitles('EFZ-3J')
  const eba = themaTitles('EBA')
  const nums = new Set<number>()
  for (const e of raw) for (const n of e.thema_nrs) nums.add(n)
  return [...nums].sort((a, b) => a - b).map((nr) => ({ nr, titel: efz[nr] || eba[nr] || `Thema ${nr}` }))
}

/** Unique Sprachmodus labels (the part before the colon). */
export function allSprachmodi(): string[] {
  const s = new Set<string>()
  for (const e of raw) for (const m of e.sprachmodi) if (m.bereich) s.add(m.bereich.trim())
  return [...s].sort()
}

/** Unique Schlüsselkompetenz sentences. */
export function allSchluesselkompetenzen(): string[] {
  const s = new Set<string>()
  for (const e of raw) for (const k of e.schluesselkompetenzen) s.add(k.trim())
  return [...s].sort()
}

/** Convert the raster markdown (pipe tables + ### sub-headings) to safe HTML. */
export function rasterMdToHtml(md: string): string {
  if (!md) return ''
  const esc = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const lines = md.split('\n')
  const out: string[] = []
  let tbl: string[][] = []
  const flush = () => {
    if (!tbl.length) return
    // drop separator rows (--- | --- ...)
    const rows = tbl.filter((r) => !r.every((c) => /^:?-{2,}:?$/.test(c.trim()) || c.trim() === ''))
    if (rows.length) {
      out.push('<table class="ub-raster"><tbody>')
      rows.forEach((r, i) => {
        const tag = i === 0 ? 'th' : 'td'
        out.push('<tr>' + r.map((c) => `<${tag}>${esc(c.trim())}</${tag}>`).join('') + '</tr>')
      })
      out.push('</tbody></table>')
    }
    tbl = []
  }
  for (const ln of lines) {
    const t = ln.trim()
    if (t.startsWith('|')) {
      const cells = t.replace(/^\|/, '').replace(/\|$/, '').split('|')
      tbl.push(cells)
    } else if (/^#{1,6}\s/.test(t)) {
      flush()
      out.push(`<h5 class="ub-raster-h">${esc(t.replace(/^#{1,6}\s*/, ''))}</h5>`)
    } else if (t) {
      flush()
      out.push(`<p class="ub-raster-p">${esc(t)}</p>`)
    }
  }
  flush()
  return out.join('\n')
}

export function niveauLabel(n: string): string {
  return n === 'erweitert' ? 'erweitertes Niveau' : 'Grundniveau'
}

export interface RubrikPosition {
  position: string
  levels: string[] // [Stufe0, Stufe1, Stufe2, Stufe3]
}
export interface Rubrik {
  suk: RubrikPosition[]
  ges: RubrikPosition[]
}

/**
 * Parse the Kompetenzraster markdown into a structured bi-dimensional rubric.
 * Handles the combined 10-column layout (SuK cols 0–4, Gesellschaft cols 5–9)
 * as well as the separate ### Sprache und Kommunikation / ### Gesellschaft tables.
 */
export function parseRaster(md: string): Rubrik {
  const suk: RubrikPosition[] = []
  const ges: RubrikPosition[] = []
  if (!md) return { suk, ges }

  let domain: 'suk' | 'ges' = 'suk'
  const isSep = (cells: string[]) => cells.every((c) => /^:?-{2,}:?$/.test(c.trim()) || c.trim() === '')
  const norm = (s: string) => s.trim().toLowerCase()

  for (const rawLine of md.split('\n')) {
    const line = rawLine.trim()
    if (!line) continue

    // domain switch via a heading (### Gesellschaft / ### Sprache und Kommunikation)
    if (/^#{1,6}\s/.test(line)) {
      const h = norm(line.replace(/^#{1,6}\s*/, ''))
      if (h.startsWith('gesellschaft')) domain = 'ges'
      else if (h.startsWith('sprache')) domain = 'suk'
      continue
    }
    if (!line.startsWith('|')) continue

    const cells = line.replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim())
    if (isSep(cells)) continue

    const first = norm(cells[0])
    // skip the two header rows
    if (first === 'bewertungsposition') continue
    if (first === 'sprache und kommunikation' || first === 'gesellschaft' || cells[0] === '') {
      // combined domain-title row like "Sprache und Kommunikation | | | | | Gesellschaft | ..."
      continue
    }

    if (cells.length >= 10) {
      // combined row: SuK = 0..4, Gesellschaft = 5..9
      if (cells[0]) suk.push({ position: cells[0], levels: [cells[1], cells[2], cells[3], cells[4]] })
      if (cells[5]) ges.push({ position: cells[5], levels: [cells[6], cells[7], cells[8], cells[9]] })
    } else if (cells.length >= 5) {
      // separate 5-col row under the current domain heading
      const rec = { position: cells[0], levels: [cells[1], cells[2], cells[3], cells[4]] }
      ;(domain === 'ges' ? ges : suk).push(rec)
    }
  }
  return { suk, ges }
}
