#!/usr/bin/env node
// Fork-Pilot: Jede `data-feld`-Marke im exportierten HTML muss auf ein Feld zeigen,
// das in der Rohdatei existiert UND in der Positivliste steht (VERTRAG §10).
// Ausserdem: Jeder Eintrag von FELDER ist im Vertrag genannt und umgekehrt.
//
//   node scripts/fork/check-data-feld.mjs <export-ordner> <slug> [<export-ordner> <slug> …]
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { lesePfad, parseFeldAttr } from '../../src/lib/fork/adresse.ts'
import { feldFuer, FELDER } from '../../src/lib/fork/positivliste.ts'

const args = process.argv.slice(2)
if (args.length < 2 || args.length % 2) {
  console.error('Aufruf: node scripts/fork/check-data-feld.mjs <export-ordner> <slug> […]')
  process.exit(2)
}

let fehler = 0
const unent = (s) => s.replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')

for (let i = 0; i < args.length; i += 2) {
  const [ordner, slug] = [args[i], args[i + 1]]
  const roh = {}
  for (const d of ['herausforderung_A', 'herausforderung_B', 'set', 'dossier']) {
    try { roh[d] = JSON.parse(readFileSync(`src/data/einheiten/${slug}/${d}.json`, 'utf8')) } catch {}
  }
  const marken = new Set()
  for (const f of readdirSync(ordner).filter((n) => n.endsWith('.html'))) {
    for (const m of readFileSync(join(ordner, f), 'utf8').matchAll(/data-feld="([^"]*)"/g)) marken.add(unent(m[1]))
  }
  let ok = 0
  for (const m of marken) {
    const a = parseFeldAttr(m)
    if (!a) { console.log(`FORMAT   ${slug} ${m}`); fehler++; continue }
    if (lesePfad(roh[a.datei], a.pfad) === undefined) { console.log(`FEHLT    ${slug} ${m} (nicht in der Rohdatei)`); fehler++; continue }
    if (!feldFuer(a.datei, a.pfad)) { console.log(`NICHT-PL ${slug} ${m} (nicht in der Positivliste)`); fehler++; continue }
    ok++
  }
  console.log(`${slug}: ${ok} von ${marken.size} Marken gültig`)
}

// Positivliste im Code ↔ Vertrag (gleiche Nummern).
const vertrag = readFileSync('docs/fork/VERTRAG.md', 'utf8')
const imVertrag = new Set([...vertrag.matchAll(/^\| ([HGD]\d+L?) \|/gm)].map((m) => m[1]))
const imCode = new Set(FELDER.map((f) => f.nr))
for (const n of imVertrag) if (!imCode.has(n)) { console.log(`VERTRAG  ${n} fehlt im Code`); fehler++ }
for (const n of imCode) if (!imVertrag.has(n)) { console.log(`CODE     ${n} fehlt im Vertrag`); fehler++ }
console.log(`Positivliste: ${imCode.size} Nummern im Code, ${imVertrag.size} im Vertrag`)

process.exit(fehler ? 1 : 0)
