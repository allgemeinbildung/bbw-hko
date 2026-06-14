// Re-syncs the *verbatim* nRLP copies baked into each Einheit's Herausforderung
// JSONs from the canonical master dataset (public/nrlp_3j.json / nrlp_4j.json):
//
//   nrlp.kompetenz_text   <- master kompetenzen[nrlp.nr].text
//   nrlp.lebensbezug_text <- master lebensbezuege[nrlp.lebensbezug].text
//
// It deliberately does NOT touch nrlp.gesellschaft / nrlp.sprachmodi /
// nrlp.sprachmodus_ids / nrlp.sk — those are per-Herausforderung EDITORIAL
// SELECTIONS (a chosen subset of the Kompetenz), not copies of the master.
//
// Writes are SURGICAL: only the drifted string value is swapped in the raw
// file text (anchored on its key), so indentation, key order, inline arrays and
// trailing-newline style of the hand-authored JSON are preserved byte-for-byte.
//
// Modes:
//   node scripts/sync-einheiten-nrlp.mjs --check   -> report only, exit 1 on drift/miss
//   node scripts/sync-einheiten-nrlp.mjs           -> rewrite drifted text fields
//
// Runs on prebuild (write mode). Idempotent: a clean tree produces no changes.

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')
const DATA_DIR = join(root, 'src', 'data', 'einheiten')
const CHECK = process.argv.includes('--check')

const datasetFile = { 'EFZ-3J': 'nrlp_3j.json', 'EFZ-4J': 'nrlp_4j.json' }
const dsCache = new Map()
function loadDataset(key) {
  if (dsCache.has(key)) return dsCache.get(key)
  const file = datasetFile[key]
  const komp = new Map()
  const lb = new Map()
  if (file) {
    const data = JSON.parse(readFileSync(join(root, 'public', file), 'utf8'))
    for (const t of data.themen || []) {
      for (const l of t.lebensbezuege || []) {
        if (l?.nr && l?.text) lb.set(String(l.nr), String(l.text))
        for (const k of l.kompetenzen || []) {
          if (k?.nr && k?.text) komp.set(String(k.nr), String(k.text))
        }
      }
    }
  }
  const maps = { komp, lb, present: Boolean(file) }
  dsCache.set(key, maps)
  return maps
}

function lehrgangToKey(lehrgang) {
  const s = String(lehrgang || '').toUpperCase()
  if (s.includes('4J')) return 'EFZ-4J'
  if (s.includes('EBA') || s.includes('2J')) return 'EBA'
  return 'EFZ-3J'
}

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

function replaceStringField(text, key, oldVal, newVal) {
  if (oldVal === newVal) return null
  const re = new RegExp(`("${key}"\\s*:\\s*)${escapeRe(JSON.stringify(oldVal))}`)
  if (!re.test(text)) return null
  return text.replace(re, `$1${JSON.stringify(newVal)}`)
}

const units = readdirSync(DATA_DIR).filter((n) => {
  try { return statSync(join(DATA_DIR, n)).isDirectory() } catch { return false }
})

let drift = 0
let misses = 0
let filesChanged = 0

for (const unit of units) {
  const dir = join(DATA_DIR, unit)
  const hfFiles = readdirSync(dir).filter((f) => /^herausforderung_.*\.json$/i.test(f))
  for (const f of hfFiles) {
    const path = join(dir, f)
    let text = readFileSync(path, 'utf8')
    const json = JSON.parse(text)
    const nrlp = json.nrlp
    if (!nrlp) continue
    const ds = loadDataset(lehrgangToKey(json.lehrgang))
    const label = `${unit}/${f}`

    const covered = (nrlp.nr_primary?.length ? nrlp.nr_primary : [nrlp.nr]).filter(Boolean).map(String)
    for (const nr of covered) {
      if (!ds.present) { console.log(`  MISS  ${label}: dataset for lehrgang "${json.lehrgang}" not published`); misses++ }
      else if (!ds.komp.has(nr)) { console.log(`  MISS  ${label}: Kompetenz ${nr} not in master -> live lookup falls back to baked text`); misses++ }
    }

    let fileChanged = false
    const swaps = [
      ['kompetenz_text', nrlp.kompetenz_text, ds.komp.get(String(nrlp.nr))],
      ['lebensbezug_text', nrlp.lebensbezug_text, ds.lb.get(String(nrlp.lebensbezug))],
    ]
    for (const [field, oldVal, masterVal] of swaps) {
      if (!masterVal || masterVal === oldVal) continue
      console.log(`  DRIFT ${label}: ${field} differs from master`)
      drift++
      if (!CHECK) {
        const next = replaceStringField(text, field, oldVal, masterVal)
        if (next) { text = next; fileChanged = true }
        else console.log(`  WARN  ${label}: could not surgically locate ${field} -- left unchanged`)
      }
    }

    if (fileChanged) {
      JSON.parse(text)
      writeFileSync(path, text)
      filesChanged++
    }
  }
}

const verb = CHECK ? 'would re-sync' : 're-synced'
console.log(
  `[sync-einheiten-nrlp] ${units.length} units scanned | ${drift} drifted text field(s) ${verb} | ` +
    `${misses} unresolved Kompetenz-Nr` + (CHECK ? '' : ` | ${filesChanged} file(s) written`),
)

if (CHECK && (drift > 0 || misses > 0)) process.exit(1)
