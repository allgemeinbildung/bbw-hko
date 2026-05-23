import indexJson from '../../data/einheiten.index.json'
import type { EinheitIndexEntry, EinheitFullSet, SituationJson, KnJson, PrinzipJson, SetJson, BegleiterMeta } from './types'

export const einheitenIndex = indexJson as EinheitIndexEntry[]

export function einheitById(id: string): EinheitIndexEntry | undefined {
  return einheitenIndex.find((e) => e.id === id)
}

export function prettifyId(id: string): string {
  const m = id.match(/^([\d.]+)_(.+)$/)
  if (!m) return id.replace(/_/g, ' ')
  return `${m[1]} · ${m[2].replace(/_/g, ' ')}`
}

// Eagerly import every set file at build time so /einheiten/[setKey] pages can
// serialize the full set into the client island without filesystem access at
// request time. Vite supports import.meta.glob with { eager: true } in SSR.
// Path is relative to this file.
const sitFiles = import.meta.glob('../../data/einheiten/*/*.json', { eager: true }) as Record<string, { default: unknown }>
const begleiterFiles = import.meta.glob('../../data/einheiten/*/begleiter.md', { eager: true, query: '?raw', import: 'default' }) as Record<string, string>

function pickJson<T>(slug: string, name: string): T | null {
  for (const [path, mod] of Object.entries(sitFiles)) {
    if (path.endsWith(`/${slug}/${name}.json`)) return (mod.default as T) ?? null
  }
  return null
}

function parseFrontmatter(raw: string): { meta: BegleiterMeta; body: string } {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw)
  if (!m) return { meta: {}, body: raw }
  const meta: BegleiterMeta = {}
  m[1].split(/\r?\n/).forEach((line) => {
    if (!line.trim() || line.trim().startsWith('#')) return
    const km = /^([A-Za-z0-9_\-]+)\s*:\s*(.*)$/.exec(line)
    if (!km) return
    let v = km[2].trim()
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1)
    meta[km[1]] = v
  })
  return { meta, body: raw.slice(m[0].length) }
}

export function loadEinheit(slug: string): EinheitFullSet | null {
  if (!einheitById(slug)) return null
  const raw = Object.entries(begleiterFiles).find(([path]) => path.endsWith(`/${slug}/begleiter.md`))?.[1]
  const begleiter = raw ? { raw, ...parseFrontmatter(raw) } : null
  return {
    id: slug,
    sit_A: pickJson<SituationJson>(slug, 'sit_A'),
    sit_B: pickJson<SituationJson>(slug, 'sit_B'),
    sit_C: pickJson<SituationJson>(slug, 'sit_C'),
    kn: pickJson<KnJson>(slug, 'kn'),
    prinzip: pickJson<PrinzipJson>(slug, 'prinzip'),
    set: pickJson<SetJson>(slug, 'set'),
    begleiter: begleiter ? { raw: begleiter.raw, meta: begleiter.meta } : null,
  }
}

export const ABTEILUNGEN = [
  '',
  'Abteilung Bau',
  'Abteilung Technik | Ernaehrung',
  'Abteilung Maschinenbau',
  'Abteilung Informatik | Naturwissenschaften',
]

export interface EinheitenFilters {
  thema_nr: string
  lehrgang: string
  aspekt: string
  sk: string
  q: string
}

export function emptyEinheitenFilters(): EinheitenFilters {
  return { thema_nr: '', lehrgang: '', aspekt: '', sk: '', q: '' }
}

export function applyEinheitenFilters(list: EinheitIndexEntry[], f: EinheitenFilters): EinheitIndexEntry[] {
  const qWords = f.q.trim().toLowerCase().split(/\s+/).filter(Boolean)
  return list.filter((e) => {
    if (f.thema_nr && String(e.thema_nr ?? '') !== f.thema_nr) return false
    if (f.lehrgang && e.lehrgang !== f.lehrgang) return false
    if (f.aspekt && !e.aspekte.includes(f.aspekt)) return false
    if (f.sk && !e.sk.map(String).includes(f.sk)) return false
    if (qWords.length) {
      const hay = `${e.id} ${e.titel} ${e.kompetenz_nr} ${e.aspekte.join(' ')} ${e.modul_titel ?? ''}`.toLowerCase()
      if (!qWords.every((w) => hay.includes(w))) return false
    }
    return true
  })
}
