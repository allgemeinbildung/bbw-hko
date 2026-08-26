#!/usr/bin/env node
/**
 * migrate-rubrik-skala — schreibt die KN-Rubrik von «Stufe 1–4» auf «0–3 Punkte» um.
 *
 * Hintergrund: Kernteam-1-Entscheid (Pascal Rusch / Patrizia, 2026-08). Das tiefste
 * Band bedeutet «nichts Wesentliches der geforderten Kompetenz beobachtbar» — dafür
 * gibt es 0 Punkte, nicht 1. Vier Bänder, Skala 0–3. Die Spaltenköpfe kommen aus
 * src/lib/einheiten/rubrik-skala.ts; dieses Skript erledigt die Textstellen, die als
 * *Daten* in den Einheiten liegen.
 *
 * Schicht 2 (dieses Skript): rubrik_shared.niveaubaender[].definition in jeder kn.json.
 * Die Ersetzung ist rein textuell, damit die Handformatierung der JSONs erhalten bleibt.
 *
 *   node scripts/migrate-rubrik-skala.mjs           # Vorschau (nichts wird geschrieben)
 *   node scripts/migrate-rubrik-skala.mjs --write   # anwenden
 *   node scripts/migrate-rubrik-skala.mjs --check   # Exit 1, falls noch «Stufe N» übrig
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(process.cwd(), 'src/data/einheiten')
const WRITE = process.argv.includes('--write')
const CHECK = process.argv.includes('--check')

const punkte = (n) => (n === 1 ? '1 Punkt' : `${n} Punkte`)

/**
 * Verschiebt jede Rubrik-Stufenangabe um eins nach unten. Die Reihenfolge ist bindend:
 * die Paar-Muster müssen vor dem Einzelmuster greifen, sonst wird «Stufe 1 oder 2»
 * zu «0 Punkte oder 2» verstümmelt.
 */
export function rewriteSkala(text) {
  return text
    .replace(/Stufen\s+(\d)\s*[-–]\s*(\d)/g, (_, a, b) => `${a - 1}–${b - 1} Punkte`)
    .replace(/Stufe\s+(\d)\s+oder\s+(\d)/g, (_, a, b) => `${a - 1} oder ${punkte(Number(b) - 1)}`)
    .replace(/Stufen\s+(\d)\s+und\s+(\d)/g, (_, a, b) => `${a - 1} und ${punkte(Number(b) - 1)}`)
    .replace(/Stufe\s+(\d)/g, (_, a) => punkte(Number(a) - 1))
}

let touched = 0
let rest = 0

for (const slug of fs.readdirSync(ROOT).sort()) {
  const file = path.join(ROOT, slug, 'kn.json')
  if (!fs.existsSync(file)) continue

  const raw = fs.readFileSync(file, 'utf8')
  const baender = JSON.parse(raw).rubrik_shared?.niveaubaender ?? []
  let out = raw

  for (const b of baender) {
    const alt = b.definition
    if (!alt) continue
    const neu = rewriteSkala(alt)
    if (neu === alt) continue
    const needle = `"definition": ${JSON.stringify(alt)}`
    if (!out.includes(needle)) {
      console.error(`  ! ${slug}: Fundstelle nicht wörtlich im JSON — übersprungen: ${alt}`)
      continue
    }
    out = out.replace(needle, `"definition": ${JSON.stringify(neu)}`)
    console.log(`  ${slug}\n    − ${alt}\n    + ${neu}`)
  }

  if (out !== raw) {
    touched++
    if (WRITE) fs.writeFileSync(file, out)
  }
  if (/Stufe[n]?\s+\d/.test(out)) {
    rest++
    console.error(`  ! ${slug}: kn.json enthält weiterhin «Stufe N»`)
  }
}

console.log(`\n${touched} kn.json ${WRITE ? 'geschrieben' : 'zu ändern (Vorschau — --write zum Anwenden)'}`)
if (CHECK && rest) {
  console.error(`${rest} Datei(en) mit verbliebener Stufenskala.`)
  process.exit(1)
}
