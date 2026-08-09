#!/usr/bin/env node
// Generates the teacher slide deck for one Einheit (or all EFZ Einheiten) from its
// JSON files + begleiter.md. Fully derived — no per-deck handwork.
//
//   node scripts/build-deck.mjs 1.1.1_rechte_verstehen_nutzen
//   node scripts/build-deck.mjs --all
//   node scripts/build-deck.mjs <slug> --out decks/generated
//
// Node >= 23.6 runs the TypeScript builder directly (type stripping), so the same
// module also feeds the browser-side ZIP bundle.

import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildDeckHtml, buildStandaloneDeckHtml, deckSourceFromFullSet } from '../src/lib/einheiten/deck-builder.ts'

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)))
const UNITS = join(ROOT, 'src', 'data', 'einheiten')

const argv = process.argv.slice(2)
const outFlag = argv.indexOf('--out')
const OUT = outFlag > -1 ? resolve(ROOT, argv[outFlag + 1]) : join(ROOT, 'decks', 'generated')
const all = argv.includes('--all')
const outValue = outFlag > -1 ? argv[outFlag + 1] : null
const slugs = argv.filter((a, n) => !a.startsWith('--') && !(outValue !== null && n === outFlag + 1))

const readJson = (p) => JSON.parse(readFileSync(p, 'utf8'))

// Inline the same logo the rendered Einheiten use, so a generated deck opens
// standalone (no server, no missing image).
const LOGO_DATA_URL =
  'data:image/png;base64,' + readFileSync(join(ROOT, 'public', 'logo-bbw-doc.png')).toString('base64')
const LION_DATA_URL =
  'data:image/svg+xml;base64,' + readFileSync(join(ROOT, 'public', 'lion-only.svg')).toString('base64')

// Einheiten in Arbeit können unvollständig sein (z. B. noch ohne kn.json oder
// begleiter.md). Alles optional einlesen und die Entscheidung dem gleichen Gate
// überlassen, das auch Route, Knopf und ZIP steuert.
const maybeJson = (p) => (existsSync(p) ? readJson(p) : null)
const maybeText = (p) => (existsSync(p) ? readFileSync(p, 'utf8') : null)

function loadUnit(slug) {
  const dir = join(UNITS, slug)
  const raw = maybeText(join(dir, 'begleiter.md'))
  return {
    set: maybeJson(join(dir, 'set.json')),
    prinzip: maybeJson(join(dir, 'prinzip.json')),
    kn: maybeJson(join(dir, 'kn.json')),
    hf_A: maybeJson(join(dir, 'herausforderung_A.json')),
    hf_B: maybeJson(join(dir, 'herausforderung_B.json')),
    hf_C: maybeJson(join(dir, 'herausforderung_C.json')),
    begleiter: raw ? { raw } : null,
  }
}

/** Was fehlt — nur für die Konsolenmeldung. */
function missing(u) {
  const m = []
  if (!u.set) m.push('set.json')
  if (!u.prinzip) m.push('prinzip.json')
  if (!u.kn) m.push('kn.json')
  if (!u.begleiter?.raw) m.push('begleiter.md')
  if (!u.hf_A && !u.hf_B && !u.hf_C) m.push('herausforderung_*.json')
  return m
}

const targets = all ? readdirSync(UNITS) : slugs

if (!targets.length) {
  console.error('usage: node scripts/build-deck.mjs <slug> | --all  [--out <dir>]')
  process.exit(1)
}

for (const slug of targets) {
  const unit = loadUnit(slug)
  const src = deckSourceFromFullSet(unit)
  if (!src) {
    const lg = unit.set?.lehrgang
    const why = lg && !String(lg).startsWith('EFZ') ? `${lg} — EBA folgt separat` : `unvollständig: ${missing(unit).join(', ')}`
    console.log(`  skip ${slug}  (${why})`)
    continue
  }
  const assets = { logoSrc: LOGO_DATA_URL, lionSrc: LION_DATA_URL }
  const html = buildDeckHtml(src, assets)
  const standalone = buildStandaloneDeckHtml(src, slug, assets)
  const dir = join(OUT, slug)
  mkdirSync(dir, { recursive: true })
  // index.html = HyperFrames composition (authoring + `hyperframes check`)
  // deck.html  = self-contained deck (platform route + ZIP)
  writeFileSync(join(dir, 'index.html'), html, 'utf8')
  writeFileSync(join(dir, 'deck.html'), standalone, 'utf8')
  // Minimal project marker so `npx hyperframes check .` runs in the output folder.
  writeFileSync(
    join(dir, 'hyperframes.json'),
    JSON.stringify({ $schema: 'https://hyperframes.heygen.com/schema/hyperframes.json', authoringSkill: 'slideshow' }, null, 2)
  )
  const slides = (html.match(/data-scene-id="/g) || []).length
  console.log(
    `  ${slug}  →  ${slides} Folien · composition ${(html.length / 1024).toFixed(0)} kB · standalone ${(
      standalone.length / 1024
    ).toFixed(0)} kB`
  )
}
