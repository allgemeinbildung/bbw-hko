import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = 'src/data/einheiten'
const files = readdirSync(ROOT, { withFileTypes: true })
  .filter(d => d.isDirectory() && !d.name.startsWith('5.4.2_internationale'))
  .flatMap(d => readdirSync(join(ROOT, d.name))
    .filter(f => /^herausforderung_.*\.json$/.test(f))
    .map(f => join(ROOT, d.name, f)))

const bad = files.filter(f => {
  const raw = readFileSync(f, 'utf8')
  return JSON.parse(raw).template !== 'default_4page_v2'
    || raw.includes('"liefert"') || raw.includes('"auftakt')
})

console.log(bad.length ? `VERLETZT: ${bad.join(', ')}`
  : `OK — ${files.length} publizierte Dateien unberuehrt`)
