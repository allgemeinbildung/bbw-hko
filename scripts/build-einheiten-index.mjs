// Builds src/data/einheiten.index.json from src/data/einheiten/<slug>/*.
//
// One entry per slug. Reads kn.json + prinzip.json + herausforderung_A.json to denormalize
// the metadata teachers filter / browse by (kompetenz, titel, dominanter Aspekt,
// SK, Aspekte, Sprachmodi, themen). Mirrors how scripts/sync-situationen.mjs
// produces situationen.index.json.

import { readFileSync, readdirSync, statSync, writeFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const DATA_DIR = join(ROOT, 'src', 'data', 'einheiten')
const OUT = join(ROOT, 'src', 'data', 'einheiten.index.json')

function readJson(p) {
  return JSON.parse(readFileSync(p, 'utf8'))
}

function readMaybe(p) {
  try { return readJson(p) } catch { return null }
}

function parseFrontmatter(raw) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw || '')
  if (!m) return {}
  const out = {}
  m[1].split(/\r?\n/).forEach((line) => {
    const km = /^([A-Za-z0-9_\-]+)\s*:\s*(.*)$/.exec(line)
    if (!km) return
    let v = km[2].trim()
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1)
    out[km[1]] = v
  })
  return out
}

const slugs = readdirSync(DATA_DIR).filter((n) => {
  const p = join(DATA_DIR, n)
  return statSync(p).isDirectory()
})

const index = []
for (const slug of slugs) {
  const dir = join(DATA_DIR, slug)
  const sitA = readMaybe(join(dir, 'herausforderung_A.json'))
  const sitB = readMaybe(join(dir, 'herausforderung_B.json'))
  const sitC = readMaybe(join(dir, 'herausforderung_C.json'))
  const kn = readMaybe(join(dir, 'kn.json'))
  const prinzip = readMaybe(join(dir, 'prinzip.json'))
  const set = readMaybe(join(dir, 'set.json'))
  const ki = readMaybe(join(dir, 'ki.json'))
  const lernprompt = readMaybe(join(dir, 'lernprompt.json'))
  const lernbegleiter = readMaybe(join(dir, 'lernbegleiter.json'))
  const begleiterPath = join(dir, 'begleiter.md')
  const begleiterMeta = existsSync(begleiterPath) ? parseFrontmatter(readFileSync(begleiterPath, 'utf8')) : {}

  const nrlp = sitA?.nrlp || {}
  const aspekte = Array.from(new Set((nrlp.gesellschaft || []).map((g) => g.aspekt))).filter(Boolean)
  const themaNr = Array.isArray(nrlp.themen) && nrlp.themen[0]
    ? parseInt(String(nrlp.themen[0]).replace(/^T/, ''), 10) || null
    : null

  const titel = prinzip?.kern_kompetenzversprechen
    || kn?.kern_kompetenzversprechen
    || begleiterMeta.titel
    || slug.replace(/_/g, ' ')

  const m = slug.match(/^([\d.]+)_(.+)$/)
  const kompetenzNr = (m && m[1]) || kn?.kompetenz_nr || nrlp.nr || ''
  const slugPart = m ? m[2] : slug

  // B1 — alle real abgedeckten Kompetenzen: Union aus nrlp.nr_primary der drei
  // Herausforderungen A/B/C, dedupliziert + numerisch sortiert. Fallback: [kompetenz_nr].
  const abgedeckteSet = new Set()
  for (const s of [sitA, sitB, sitC]) {
    for (const n of (s?.nrlp?.nr_primary || [])) if (n) abgedeckteSet.add(String(n))
  }
  if (abgedeckteSet.size === 0 && kompetenzNr) abgedeckteSet.add(String(kompetenzNr))
  const abgedeckteKompetenzen = Array.from(abgedeckteSet)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))

  // Sichtbarkeits-Steuerung (KT1-only Drafts). Beide Felder optional in set.json:
  //  • status: 'entwurf' → ganze Einheit nur für KT1 sichtbar (neue Einheit)
  //  • entwurf_komponenten: ['ki-fluency', …] → einzelne Bausteine einer sonst
  //    live geschalteten Einheit nur für KT1 (selektives Publizieren)
  const status = set?.status === 'entwurf' ? 'entwurf' : 'publiziert'
  const entwurfKomponenten = Array.isArray(set?.entwurf_komponenten)
    ? set.entwurf_komponenten.filter((x) => typeof x === 'string')
    : []

  index.push({
    id: slug,
    status,
    entwurf_komponenten: entwurfKomponenten,
    kompetenz_nr: kompetenzNr,
    abgedeckte_kompetenzen: abgedeckteKompetenzen,
    slug: slugPart,
    titel,
    einheit_titel: set?.einheit_titel || slugPart.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase()),
    lehrgang: sitA?.lehrgang || begleiterMeta.beruf || 'EFZ_3J',
    modul: sitA?.modul || null,
    modul_titel: sitA?.modul_titel || null,
    thema_nr: themaNr,
    themen: nrlp.themen || [],
    aspekte,
    dominanter_aspekt: kn?.dominanter_aspekt || null,
    sk: Array.isArray(nrlp.sk) ? nrlp.sk : [],
    sprachmodi: nrlp.sprachmodi || [],
    herausforderungen: ['A', 'B', 'C'].filter((l) => [sitA, sitB, sitC][{ A: 0, B: 1, C: 2 }[l]] != null),
    hf_titel: {
      A: sitA?.titel || null,
      B: sitB?.titel || null,
      C: sitC?.titel || null,
    },
    hat_kn: !!kn,
    hat_begleiter: existsSync(begleiterPath),
    hat_ki: !!ki,
    hat_lernprompt: !!lernprompt,
    hat_lernbegleiter: !!lernbegleiter,
    hybrid_situation_titel: kn?.hybrid_situation?.titel || null,
    kn_typen: (kn?.kn_typen || []).map((t) => ({ typ: t.typ, label: t.label })),
    bundle_dateien: estimateBundleCount({ sitA, sitB, sitC, kn, prinzip, hatBegleiter: existsSync(begleiterPath), ki, lernprompt, lernbegleiter }),
  })
}

function estimateBundleCount({ sitA, sitB, sitC, kn, prinzip, hatBegleiter, ki, lernprompt, lernbegleiter }) {
  // 6 DocS (3 letters × 2 modes) × 2 formats (html+docx) = 12
  // KnS variants × 2 formats
  // KnLp × 2 formats
  // KI-Fluency: each KI-Auftrag × 2 formats, Lernprompt × 2, Lernbegleiter × 2
  // begleiter docx 1
  // readme 1
  let n = 0
  ;['A', 'B', 'C'].forEach((l, i) => {
    if ([sitA, sitB, sitC][i]) n += 2 * 2
  })
  if (kn) n += (kn.kn_typen?.length || 0) * 2
  if (kn && prinzip) n += 2
  if (ki) n += (ki.assignments?.length || 0) * 2
  if (lernprompt) n += 2
  if (lernbegleiter) n += 2
  if (hatBegleiter) n += 1
  n += 1
  return n
}

index.sort((a, b) => a.id.localeCompare(b.id))
writeFileSync(OUT, JSON.stringify(index, null, 2) + '\n')
console.log(`einheiten.index.json: ${index.length} sets written`)
