#!/usr/bin/env node
// export-ki-toolbox.mjs — schreibt die vier KI-Toolbox-Dokumente einer Einheit als
// eigenständige HTML-Dateien, mit denselben Komponenten und derselben Hülle wie der
// ZIP der Workbench. Zweck: die Seiten mit `messen-v42.mjs` auf Überlauf prüfen
// (A4-Seiten haben `overflow: hidden` — was nicht passt, wird lautlos abgeschnitten).
//
//   node scripts/export-ki-toolbox.mjs <slug> [--out <dir>]
//   node scripts/messen-v42.mjs <dir>
//
// Default für --out: <os.tmpdir()>/bbw-hko-ki/<slug>. Nicht parallel starten: der
// SSR-Server belegt einen festen Port.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { ROOT, startSsr } from './v42-ssr.mjs'

const argv = process.argv.slice(2)
const outIdx = argv.indexOf('--out')
const slug = argv.find((a, i) => !a.startsWith('--') && (outIdx === -1 || i !== outIdx + 1))
if (!slug || (outIdx > -1 && !argv[outIdx + 1])) {
  console.error('usage: node scripts/export-ki-toolbox.mjs <slug> [--out <dir>]')
  process.exit(2)
}
const OUT = outIdx > -1 ? resolve(argv[outIdx + 1]) : join(tmpdir(), 'bbw-hko-ki', slug)

const logoBytes = readFileSync(join(ROOT, 'public', 'logo-bbw-doc.png'))
const pngDataUrl = 'data:image/png;base64,' + logoBytes.toString('base64')
const fontsCss = readFileSync(join(ROOT, 'public', 'einheiten-assets', 'fonts-embed.css'), 'utf8')
// React aus node_modules des Repos — dieselbe Instanz, die Vite für die Komponenten auslagert.
const req = createRequire(join(ROOT, 'package.json'))
const React = req('react')
const { renderToStaticMarkup } = req('react-dom/server')

const server = await startSsr()
try {
  const { loadEinheit } = await server.ssrLoadModule('/src/lib/einheiten/index.ts')
  const { buildStandaloneHtml } = await server.ssrLoadModule('/src/lib/einheiten/standalone-shell.ts')
  const { cssFuerEinheit } = await server.ssrLoadModule('/src/lib/einheiten/css-v42.ts')
  const cssBasis = (await server.ssrLoadModule('/src/styles/einheiten-renderer.css?raw')).default
  const { DocKi } = await server.ssrLoadModule('/src/components/einheiten/docs/DocKi.tsx')
  const { DocLernprompt } = await server.ssrLoadModule('/src/components/einheiten/docs/DocLernprompt.tsx')
  const { DocLernbegleiter } = await server.ssrLoadModule('/src/components/einheiten/docs/DocLernbegleiter.tsx')

  const d = loadEinheit(slug)
  if (!d) throw new Error(`Einheit «${slug}» nicht gefunden`)
  if (!d.ki || !d.lernprompt || !d.lernbegleiter) {
    throw new Error(`«${slug}»: Toolbox unvollständig — ki ${!!d.ki}, lernprompt ${!!d.lernprompt}, lernbegleiter ${!!d.lernbegleiter}`)
  }
  const cssRenderer = cssFuerEinheit(cssBasis, d)
  const base = { abteilung: '', edits: {}, onEdit: () => {} }
  const docs = [
    ['doc-ki-1', React.createElement(DocKi, { ki: d.ki, which: 'ki_1', ...base })],
    ['doc-ki-2', React.createElement(DocKi, { ki: d.ki, which: 'ki_2', ...base })],
    ['doc-lernprompt', React.createElement(DocLernprompt, { lernprompt: d.lernprompt, ...base })],
    ['doc-lernbegleiter', React.createElement(DocLernbegleiter, { lernbegleiter: d.lernbegleiter, ...base })],
  ]
  mkdirSync(OUT, { recursive: true })
  for (const [name, el] of docs) {
    const markup = renderToStaticMarkup(el)
    const seiten = (markup.match(/class="a4-page(?![-\w])/g) || []).length
    writeFileSync(join(OUT, `${name}.html`), buildStandaloneHtml({ cssRenderer, title: name, bodyMarkup: markup, pngDataUrl, docKey: `${slug}_${name}`, fontsCss }), 'utf8')
    console.log(`${name} · ${seiten} Seiten`)
  }
  console.log(OUT)
} finally {
  await server.close()
}
