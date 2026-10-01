#!/usr/bin/env node
// bestand-v42.mjs — Invariante 4: Bestandseinheiten rendern gleich.
//
//   node scripts/bestand-v42.mjs --schreiben   Fingerabdrücke nach docs/upgrade-v4.2/bestand-vorher.json
//   node scripts/bestand-v42.mjs --pruefen     dasselbe neu rechnen und vergleichen; Exit 1 bei Abweichung
//
// Gehasht wird je Bestandseinheit, je Herausforderung (A/B/C) und je Modus (info/fill):
//   - das HTML-Markup aus `renderToStaticMarkup(<DocS …/>)`
//   - `word/document.xml` aus dem Paket von `buildDocS` (nicht das Zip — das trägt Zeitstempel)
// dazu der CSS-String, den `[setKey].astro` für diese Einheit an die Workbench gibt.
// `--schreiben` gehört genau einmal VOR jede Renderer-Änderung; danach nur noch `--pruefen`.

import { createHash } from 'node:crypto'
import { createRequire } from 'node:module'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { ROOT, startSsr } from './v42-ssr.mjs'

const EINHEITEN = ['1.3.1_konsum_verantworten', '1.1.1_konflikt_kommunizieren']
const MODI = ['info', 'fill']
// Fest gewählt, damit der Kopfzeilen-Zweig mit Abteilung mitgeprüft wird.
const ABTEILUNG = 'Abteilung Bau'
const DATEI = join(ROOT, 'docs', 'upgrade-v4.2', 'bestand-vorher.json')

const modus = process.argv.includes('--schreiben') ? 'schreiben' : process.argv.includes('--pruefen') ? 'pruefen' : null
if (!modus) {
  console.error('usage: node scripts/bestand-v42.mjs --schreiben | --pruefen')
  process.exit(2)
}

const require = createRequire(join(ROOT, 'package.json'))
const { createElement } = require('react')
const { renderToStaticMarkup } = require('react-dom/server')
const JSZip = require('jszip')
const sha = (s) => createHash('sha256').update(s).digest('hex')

const server = await startSsr()
const ist = {}
try {
  const { loadEinheit } = await server.ssrLoadModule('/src/lib/einheiten/index.ts')
  const { DocS } = await server.ssrLoadModule('/src/components/einheiten/docs/DocS.tsx')
  const { buildDocS } = await server.ssrLoadModule('/src/lib/einheiten/docx-builder.ts')
  const { Packer } = await server.ssrLoadModule('docx')
  const cssRenderer = (await server.ssrLoadModule('/src/styles/einheiten-renderer.css?raw')).default
  // Nach der v4.2-Verdrahtung rechnet [setKey].astro den CSS-String über `cssFuerEinheit`;
  // davor gab es die Datei nicht, und der String war das Renderer-CSS allein.
  const cssModul = existsSync(join(ROOT, 'src', 'lib', 'einheiten', 'css-v42.ts'))
    ? await server.ssrLoadModule('/src/lib/einheiten/css-v42.ts')
    : null
  const cssFuerEinheit = cssModul?.cssFuerEinheit ?? ((css) => css)

  for (const slug of EINHEITEN) {
    const d = loadEinheit(slug)
    if (!d) throw new Error(`Einheit ${slug} nicht gefunden`)
    ist[`${slug} · css`] = sha(cssFuerEinheit(cssRenderer, d))
    for (const L of ['A', 'B', 'C']) {
      const sit = d[`hf_${L}`]
      if (!sit) continue
      for (const mode of MODI) {
        const markup = renderToStaticMarkup(
          createElement(DocS, { sit, set: d.set, abteilung: ABTEILUNG, mode, edits: {}, onEdit: () => {} }),
        )
        ist[`${slug} · HF ${L} · ${mode} · html`] = sha(markup)
        const doc = buildDocS({ sit, set: d.set, abteilung: ABTEILUNG, mode, logoPng: null })
        const zip = await JSZip.loadAsync(await Packer.toBuffer(doc))
        const xml = await zip.file('word/document.xml').async('string')
        ist[`${slug} · HF ${L} · ${mode} · word`] = sha(xml)
      }
    }
  }
} finally {
  await server.close()
}

if (modus === 'schreiben') {
  const out = { erzeugt: new Date().toISOString(), abteilung: ABTEILUNG, dokumente: ist }
  writeFileSync(DATEI, JSON.stringify(out, null, 2) + '\n', 'utf8')
  console.log(`${Object.keys(ist).length} Fingerabdrücke → ${DATEI}`)
  process.exit(0)
}

const soll = JSON.parse(readFileSync(DATEI, 'utf8')).dokumente
const abweichungen = []
for (const name of new Set([...Object.keys(soll), ...Object.keys(ist)])) {
  if (!(name in ist)) abweichungen.push(`${name}: fehlt jetzt`)
  else if (!(name in soll)) abweichungen.push(`${name}: neu (nicht im Bestand)`)
  else if (soll[name] !== ist[name]) abweichungen.push(`${name}: ${soll[name].slice(0, 12)} → ${ist[name].slice(0, 12)}`)
}
if (abweichungen.length) {
  console.error(`ABWEICHUNG in ${abweichungen.length} von ${Object.keys(soll).length} Dokumenten:`)
  for (const a of abweichungen) console.error(`  ${a}`)
  process.exit(1)
}
console.log(`OK — ${Object.keys(soll).length} Dokumente unverändert.`)
