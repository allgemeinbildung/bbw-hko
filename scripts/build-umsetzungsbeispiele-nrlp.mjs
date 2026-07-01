// Populates the `umsetzungsbeispiele` array of each public nRLP dataset
// (nrlp_3j / nrlp_4j / nrlp_2j) from src/data/umsetzungsbeispiele.index.json,
// mapped into the shape the nRLP graph app (public/nrlp/modules/data/buildGraph.js)
// expects for `umsetzung` / `scaffold` / `bewertung` nodes.
//
// Idempotent: overwrites the array on every run. Safe to add to the prebuild chain.
//   node scripts/build-umsetzungsbeispiele-nrlp.mjs

import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const src = JSON.parse(
  readFileSync(join(root, 'src/data/umsetzungsbeispiele.index.json'), 'utf-8'),
)
const entries = src.entries || []

// Lehrgang -> public dataset file
const TARGETS = {
  'EFZ-3J': 'public/nrlp_3j.json',
  'EFZ-4J': 'public/nrlp_4j.json',
  'EBA': 'public/nrlp_2j.json',
}

function toGraphShape(e) {
  // Unique `variante` per entry (grund + erweitert share a label like "1.1").
  const variante =
    e.niveau === 'erweitert' ? `${e.variant_label} · erw.` : e.variant_label

  const scaffolds = (e.scaffolds || []).map((s) => ({
    modus: s.bereich || 'Scaffold',
    detail: s.text || '',
  }))

  const bewertung = [
    ...(e.bewertung?.suk || []).map((text) => ({ domain: 'Sprache und Kommunikation', text })),
    ...(e.bewertung?.ges || []).map((text) => ({ domain: 'Gesellschaft', text })),
  ]

  return {
    variante,
    niveau: e.niveau,
    thema_nr: e.thema_nrs?.[0] ?? null,
    thema_nrs: e.thema_nrs || [],
    kompetenz_nrs: e.kompetenz_nrs || [],
    lehrgang: e.lehrgang,
    lebensbezug: e.titel || '',
    herausforderung: e.herausforderung || '',
    produkt: e.produkt || '',
    scaffolds,
    bewertung,
  }
}

let totalWritten = 0
for (const [lehrgang, rel] of Object.entries(TARGETS)) {
  const list = entries.filter((e) => e.lehrgang === lehrgang).map(toGraphShape)
  const p = join(root, rel)
  const data = JSON.parse(readFileSync(p, 'utf-8'))
  data.umsetzungsbeispiele = list
  writeFileSync(p, JSON.stringify(data, null, 2) + '\n', 'utf-8')
  console.log(`  ${rel}: ${list.length} Umsetzungsvarianten`)
  totalWritten += list.length
}
console.log(`build-umsetzungsbeispiele-nrlp: ${totalWritten} variants injected into 3 datasets.`)
