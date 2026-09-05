/**
 * Regressions-Guard: die EINGEFRORENEN Einheiten bleiben unberuehrt.
 *
 * Eingefroren ist alles, was nicht ausdruecklich `status: "entwurf"` traegt
 * (CLAUDE.md: fehlendes Feld = live fuer alle) sowie jede EBA-Einheit
 * (Entscheid Pietro, 2026-09-04). Sie duerfen weder auf ein anderes Template
 * wandern noch die Bogen-Kopplungs-Felder bekommen.
 *
 * Vorher stand hier eine Namensliste: alles ausser `5.4.2_internationale` galt
 * als geschuetzt. Das war richtig, solange 5.4.2 der einzige Pilot war — seit
 * die Kopplung fuer alle EFZ-Entwuerfe gilt, schlug der Guard bei jeder korrekt
 * migrierten Einheit an. Die geschuetzte Menge wird darum aus `set.json`
 * abgeleitet, nicht mehr aufgezaehlt.
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = 'src/data/einheiten'

function eingefroren(slug) {
  const sp = join(ROOT, slug, 'set.json')
  const status = existsSync(sp) ? (JSON.parse(readFileSync(sp, 'utf8')).status ?? null) : null
  if (status !== 'entwurf') return status ? `live (${status})` : 'live (kein status-Feld)'
  const hp = join(ROOT, slug, 'herausforderung_A.json')
  const lg = existsSync(hp) ? (JSON.parse(readFileSync(hp, 'utf8')).lehrgang ?? '') : ''
  return lg.startsWith('EBA') ? 'EBA — vorerst ausgenommen' : null
}

const slugs = readdirSync(ROOT, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)

const geschuetzt = slugs.filter((s) => eingefroren(s))
const bad = []

for (const slug of geschuetzt) {
  for (const f of readdirSync(join(ROOT, slug)).filter((f) => /^herausforderung_.*\.json$/.test(f))) {
    const p = join(ROOT, slug, f)
    const raw = readFileSync(p, 'utf8')
    const gruende = []
    if (JSON.parse(raw).template !== 'default_4page_v2') gruende.push('template != v2')
    if (raw.includes('"liefert"')) gruende.push('liefert gesetzt')
    if (raw.includes('"auftakt')) gruende.push('auftakt_typ gesetzt')
    if (raw.includes('"bereitet_vor"')) gruende.push('bereitet_vor gesetzt')
    if (gruende.length) bad.push(`${p} (${gruende.join(', ')})`)
  }
}

if (bad.length) {
  console.log('VERLETZT — eingefrorene Einheiten wurden veraendert:')
  for (const b of bad) console.log(`  ${b}`)
  process.exit(1)
}

console.log(`OK — ${geschuetzt.length} eingefrorene Einheiten unberuehrt:`)
for (const s of geschuetzt) console.log(`  ${s}  [${eingefroren(s)}]`)
