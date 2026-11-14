#!/usr/bin/env node
// Invariante 3 (Fork-Pilot): Vergleicht zwei Export-Ordner von `export-v42.mjs`.
// HTML gilt als gleich, wenn es nach dem Entfernen der `data-feld`-Attribute
// zeichengleich ist; .docx, wenn jeder Zip-Eintrag ausser `docProps/core.xml`
// (Erstellungszeit) gleich ist. Alles andere byteweise.
//
//   node scripts/fork/vergleich-export.mjs <referenz> <neu>
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import JSZip from 'jszip'

const [refDir, neuDir] = process.argv.slice(2)
if (!refDir || !neuDir) {
  console.error('Aufruf: node scripts/fork/vergleich-export.mjs <referenz> <neu>')
  process.exit(2)
}

function dateien(dir) {
  const out = []
  for (const n of readdirSync(dir)) {
    const p = join(dir, n)
    if (statSync(p).isDirectory()) out.push(...dateien(p))
    else out.push(p)
  }
  return out
}

const ohneFeld = (s) => s.replace(/ data-feld="[^"]*"/g, '')

async function gleichDocx(a, b) {
  const [za, zb] = await Promise.all([JSZip.loadAsync(readFileSync(a)), JSZip.loadAsync(readFileSync(b))])
  const namen = new Set([...Object.keys(za.files), ...Object.keys(zb.files)])
  for (const n of namen) {
    if (n === 'docProps/core.xml') continue
    // Hyperlink-IDs vergibt `docx` zufällig (rId + 21 Zeichen) — sie tragen keinen Inhalt.
    const norm = (s) => s?.replace(/rId[a-z0-9_-]{21}/g, 'rId~')
    const x = norm(await za.file(n)?.async('string'))
    const y = norm(await zb.file(n)?.async('string'))
    if (x !== y) return `Eintrag ${n}`
  }
  return null
}

let fehler = 0
const ref = dateien(refDir).map((p) => relative(refDir, p)).sort()
const neu = new Set(dateien(neuDir).map((p) => relative(neuDir, p)))
for (const r of ref) {
  if (!neu.has(r)) { console.log(`FEHLT   ${r}`); fehler++; continue }
  neu.delete(r)
  const a = join(refDir, r), b = join(neuDir, r)
  let grund = null
  if (r.endsWith('.html')) {
    if (ohneFeld(readFileSync(a, 'utf8')) !== ohneFeld(readFileSync(b, 'utf8'))) grund = 'HTML'
  } else if (r.endsWith('.docx')) {
    grund = await gleichDocx(a, b)
  } else if (!readFileSync(a).equals(readFileSync(b))) grund = 'Bytes'
  if (grund) { console.log(`ANDERS  ${r} (${grund})`); fehler++ }
}
for (const n of neu) { console.log(`NEU     ${n}`); fehler++ }
console.log(fehler ? `${fehler} Abweichung(en)` : `gleich: ${ref.length} Dateien`)
process.exit(fehler ? 1 : 0)
