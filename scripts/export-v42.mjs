#!/usr/bin/env node
// export-v42.mjs — schreibt alle v4.2-Dokumente einer Einheit als eigenständige
// HTML- und Word-Dateien, so wie sie der ZIP der Workbench enthält, dazu den
// Begleiter als `begleiter.docx`.
//
//   node scripts/export-v42.mjs <slug> [--out <dir>]
//   node scripts/export-v42.mjs 1.3.1_konsum_verantworten_v42 --out C:/temp/v42
//
// Default für --out: <os.tmpdir()>/bbw-hko-v42/<slug>. Welche Dokumente es gibt,
// entscheidet allein src/lib/einheiten/v42-dokumente.tsx. Prüfen danach mit
// `node scripts/messen-v42.mjs <dir>`.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { ROOT, startSsr } from './v42-ssr.mjs'

const argv = process.argv.slice(2)
const outIdx = argv.indexOf('--out')
const slug = argv.find((a, i) => !a.startsWith('--') && i !== outIdx + 1)
if (!slug || (outIdx > -1 && !argv[outIdx + 1])) {
  console.error('usage: node scripts/export-v42.mjs <slug> [--out <dir>]')
  process.exit(2)
}
const OUT = outIdx > -1 ? resolve(argv[outIdx + 1]) : join(tmpdir(), 'bbw-hko-v42', slug)

// Wie die Workbench: Logo als data-URI (im entpackten ZIP gibt es keinen Server)
// und als Bytes für den Word-Kopf; Schriften eingebettet aus derselben Datei, die
// die Workbench beim Download nachlädt.
const logoBytes = readFileSync(join(ROOT, 'public', 'logo-bbw-doc.png'))
const pngDataUrl = 'data:image/png;base64,' + logoBytes.toString('base64')
const fontsCss = readFileSync(join(ROOT, 'public', 'einheiten-assets', 'fonts-embed.css'), 'utf8')

const server = await startSsr()
const geschrieben = []
try {
  const { loadEinheit } = await server.ssrLoadModule('/src/lib/einheiten/index.ts')
  const { enrichKompetenzen } = await server.ssrLoadModule('/src/lib/einheiten/kompetenz-text.ts')
  const { v42Dokumente } = await server.ssrLoadModule('/src/lib/einheiten/v42-dokumente.tsx')
  const { buildStandaloneHtml } = await server.ssrLoadModule('/src/lib/einheiten/standalone-shell.ts')
  const { cssFuerEinheit } = await server.ssrLoadModule('/src/lib/einheiten/css-v42.ts')
  const cssRendererBasis = (await server.ssrLoadModule('/src/styles/einheiten-renderer.css?raw')).default
  // Packer aus derselben docx-Instanz wie die Builder (ESM über Vite, nicht das CJS-Paket).
  const { Packer } = await server.ssrLoadModule('docx')
  const { buildBegleiterBuffer } = await server.ssrLoadModule('/src/lib/einheiten/begleiter-builder.ts')

  const roh = loadEinheit(slug)
  if (!roh) throw new Error(`Einheit «${slug}» nicht im Index`)
  // Wie [setKey].astro: Kompetenz-Klartexte vor dem Rendern auflösen.
  const d = enrichKompetenzen(roh)
  const cssRenderer = cssFuerEinheit(cssRendererBasis, d)

  const dokumente = v42Dokumente(d, { logoPng: new Uint8Array(logoBytes) })
  if (!dokumente.length) throw new Error(`«${slug}» hat keine v4.2-Dokumente (keine spur_varianten)`)

  mkdirSync(OUT, { recursive: true })
  for (const dok of dokumente) {
    const html = buildStandaloneHtml({
      cssRenderer,
      title: dok.titel,
      bodyMarkup: dok.markup(),
      pngDataUrl,
      docKey: `${slug}_${dok.datei}`,
      fontsCss,
      // Wie im ZIP der Workbench: Schreibprotokoll in den Heften (Auftragsfassung),
      // nicht im Auftragsbogen — der ist wie der Austausch davon ausgenommen.
      protokoll: dok.datei !== 'auftragsbogen',
    })
    const htmlPfad = join(OUT, `${dok.datei}.html`)
    writeFileSync(htmlPfad, html, 'utf8')
    geschrieben.push(htmlPfad)

    const doc = dok.docx()
    if (doc) {
      const docxPfad = join(OUT, `${dok.datei}.docx`)
      writeFileSync(docxPfad, await Packer.toBuffer(doc))
      geschrieben.push(docxPfad)
    }
  }

  // Begleiter als Word, damit die Übergabe vollständig ist — derselbe Builder wie im
  // ZIP der Workbench (dort unter Material_LP/).
  if (d.begleiter?.raw) {
    const begleiterPfad = join(OUT, 'begleiter.docx')
    writeFileSync(begleiterPfad, await buildBegleiterBuffer(d.begleiter.raw, new Uint8Array(logoBytes)))
    geschrieben.push(begleiterPfad)
  }
} finally {
  await server.close()
}

for (const p of geschrieben) console.log(p)
