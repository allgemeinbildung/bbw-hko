#!/usr/bin/env node
/**
 * abdeckung.mjs — welche nRLP-Kompetenzen haben noch keine Einheit?
 * Grundlage der Auftragsliste eines Produktionslaufs (docs/cloud-run/).
 *
 *   node scripts/abdeckung.mjs          # Markdown auf stdout
 *
 * Liest src/data/einheiten.index.json (vorher `npm run build:einheiten-index`)
 * und den Crosswalk der Skill: ein Lebensbezug ohne Kernkapitel hat keinen
 * Sach-Quelltext und ist mit der 3er-Skill nicht erzeugbar.
 */
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const json = (p) => JSON.parse(readFileSync(join(ROOT, p), 'utf8'))
const index = json('src/data/einheiten.index.json')
const SAETZE = [['EFZ_3J', 'nrlp_3j.json', 'EFZ 3-jährig'], ['EFZ_4J', 'nrlp_4j.json', 'EFZ 4-jährig']]

// Crosswalk: Abschnitt je Lehrgang → LB → hat Kernkapitel?
const cw = readFileSync(join(ROOT, '.claude/skills/bbw-hko-3er-set/references/nrlp-lehrmittel-crosswalk.md'), 'utf8')
const kern = {}
let abschnitt = null
for (const l of cw.split('\n')) {
  const h = /^## (EFZ \d-jährig)/.exec(l)
  if (h) { abschnitt = h[1]; kern[abschnitt] = {}; continue }
  if (/^## /.test(l)) abschnitt = null
  const z = /^\| \*\*([\d.]+)\*\* \|[^|]*\|([^|]*)\|/.exec(l)
  if (abschnitt && z) kern[abschnitt][z[1]] = z[2].trim() !== '—'
}

console.log(`# Abdeckung — Stand ${new Date().toISOString().slice(0, 10)}\n`)
console.log('`[x]` = Einheit vorhanden (E = Entwurf, P = publiziert) · `[ ]` = offen · ⚠ = Lebensbezug ohne Kernkapitel im Crosswalk\n')
for (const [lg, file, label] of SAETZE) {
  const ds = json('public/' + file)
  let offen = 0, total = 0
  const out = []
  for (const t of ds.themen) {
    if (!(t.lebensbezuege || []).length) continue
    out.push(`\n**T${t.nr} ${t.titel}** (${t.lehrjahr}. Lehrjahr)\n`)
    for (const lb of t.lebensbezuege) {
      const hatKern = kern[label]?.[lb.nr]
      for (const k of lb.kompetenzen || []) {
        total++
        const da = index.filter((e) => (e.lehrgaenge || [e.lehrgang]).includes(lg) && (e.abgedeckte_kompetenzen || [e.kompetenz_nr]).includes(k.nr))
        if (!da.length) offen++
        const marke = da.length ? `[x] ${da.map((e) => (e.status === 'entwurf' ? 'E' : 'P')).join('')}` : '[ ]'
        out.push(`- ${marke} \`${lg} ${k.nr}\`${hatKern === false ? ' ⚠' : ''} ${k.text.replace(/\s+/g, ' ').slice(0, 110)}`)
      }
    }
  }
  console.log(`\n## ${label} — ${total - offen} von ${total} Kompetenzen abgedeckt`)
  console.log(out.join('\n'))
}
