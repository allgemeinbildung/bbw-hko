#!/usr/bin/env node
// export-v42.mjs — schreibt alle v4.2-Dokumente einer Einheit als eigenständige
// HTML- und Word-Dateien, so wie sie der ZIP der Workbench enthält — Hefte, Auftragsbogen,
// Lösungen, Kompetenznachweis (kn-s_<form>, kn-lp), bei EBA Dossier und Leseblatt —, dazu den
// Begleiter als `begleiter.docx`.
//
//   node scripts/export-v42.mjs <slug> [--out <dir>] [--fassung <json-datei>]
//   node scripts/export-v42.mjs 1.3.1_konsum_verantworten_v42 --out C:/temp/v42
//
// Fork-Pilot: `--fassung` liest `{ ersetzungen, nur_spur }` (VERTRAG §2) und exportiert
// die eigene Fassung wie ihr ZIP — Vermerk in Fusszeile (HTML) bzw. Kopfzeile (Word),
// dazu HINWEIS-FASSUNG.txt. Ohne die Option ist die Ausgabe unverändert.
//
// Default für --out: <os.tmpdir()>/bbw-hko-v42/<slug>. Welche Dokumente es gibt,
// entscheidet allein src/lib/einheiten/v42-dokumente.tsx. Prüfen danach mit
// `node scripts/messen-v42.mjs <dir>`.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { ROOT, startSsr } from './v42-ssr.mjs'
import { renderToStaticMarkup } from 'react-dom/server'
import { createElement } from 'react'

const argv = process.argv.slice(2)
const outIdx = argv.indexOf('--out')
const faIdx = argv.indexOf('--fassung')
const slug = argv.find((a, i) => !a.startsWith('--') && i !== outIdx + 1 && (faIdx < 0 || i !== faIdx + 1))
if (!slug || (outIdx > -1 && !argv[outIdx + 1]) || (faIdx > -1 && !argv[faIdx + 1])) {
  console.error('usage: node scripts/export-v42.mjs <slug> [--out <dir>] [--fassung <json-datei>]')
  process.exit(2)
}
const OUT = outIdx > -1 ? resolve(argv[outIdx + 1]) : join(tmpdir(), 'bbw-hko-v42', slug)
const fassung = faIdx > -1 ? JSON.parse(readFileSync(resolve(argv[faIdx + 1]), 'utf8')) : null

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

  let roh, fork = null
  if (fassung) {
    const { fassungPruefer } = await server.ssrLoadModule('/src/lib/fork/seite.ts')
    const { warnungen } = await server.ssrLoadModule('/src/lib/fork/positivliste.ts')
    const { VERMERK } = await server.ssrLoadModule('/src/lib/fork/typen.ts')
    const { VERMERK_CSS, abteilungMitVermerk } = await server.ssrLoadModule('/src/components/einheiten/fork/fork-hilfe.ts')
    fork = { VERMERK, VERMERK_CSS, abteilungMitVermerk, warnungen: warnungen(fassung.ersetzungen ?? []).filter((w) => w.code !== 'fusszeile').map((w) => w.text) }
    roh = loadEinheit(slug, { fassung: { ersetzungen: fassung.ersetzungen ?? [], ...(fassung.nur_spur ? { nur_spur: fassung.nur_spur } : {}) }, fassungPruefer })
    const b = roh?.fassung_bericht
    if (b) console.error(`Fassung: angewendet ${b.angewendet}, veraltet ${b.veraltet.length}, verworfen ${b.verworfen.length}`)
  } else roh = loadEinheit(slug)
  if (!roh) throw new Error(`Einheit «${slug}» nicht im Index`)
  // Wie [setKey].astro: Kompetenz-Klartexte vor dem Rendern auflösen.
  const d = enrichKompetenzen(roh)
  // Fassung wie im ZIP der Workbench: Vermerk an der HTML-Fusszeile, im Word in der Kopfzeile.
  const cssRenderer = cssFuerEinheit(cssRendererBasis, d) + (fork ? fork.VERMERK_CSS : '')

  const dokumente = v42Dokumente(d, { logoPng: new Uint8Array(logoBytes) })
  if (fork) {
    const word = v42Dokumente(d, { logoPng: new Uint8Array(logoBytes), abteilung: fork.abteilungMitVermerk('') })
    dokumente.forEach((x, i) => { x.docx = word[i].docx })
  }
  if (d.hf_A?.lehrgang === 'EBA_2J' && d.dossier) {
    const { DocEbaDossier } = await server.ssrLoadModule('/src/components/einheiten/docs/DocEbaDossier.tsx')
    const { DocLeseblatt } = await server.ssrLoadModule('/src/components/einheiten/docs/DocLeseblatt.tsx')
    const { buildDossier, buildLeseblatt } = await server.ssrLoadModule('/src/lib/einheiten/docx-builder.ts')
    // `fork`: Feldmarken (Fork-Pilot) nur bei v4.2-Hefte; buildDossier/buildLeseblatt ignorieren das Feld.
    const props = { dossier: d.dossier, logoPng: new Uint8Array(logoBytes), fork: d.hf_A?.template === 'heft_8page_v42' }
    dokumente.push({ datei: 'dossier', titel: 'Dossier', markup: () => renderToStaticMarkup(createElement(DocEbaDossier, props)), docx: () => buildDossier(props), protokoll: false })
    if (d.dossier.leseblatt) dokumente.push({ datei: 'leseblatt', titel: 'Leseblatt', markup: () => renderToStaticMarkup(createElement(DocLeseblatt, props)), docx: () => buildLeseblatt(props), protokoll: false })
  }
  // Kompetenznachweis: je KN-Form das Blatt für Lernende (DOC-KN-S) und das LP-Dokument (DOC-KN-LP),
  // wie im ZIP der Workbench — damit Messung, Schriftprüfung und Word-Seitenzahl auch sie erfassen.
  if (d.kn?.kn_typen?.length) {
    const { DocKnS } = await server.ssrLoadModule('/src/components/einheiten/docs/DocKnS.tsx')
    const { DocKnLp } = await server.ssrLoadModule('/src/components/einheiten/docs/DocKnLp.tsx')
    const { buildKnS, buildKnLp } = await server.ssrLoadModule('/src/lib/einheiten/docx-builder.ts')
    const logoPng = new Uint8Array(logoBytes)
    for (const t of d.kn.kn_typen) {
      const props = { kn: d.kn, knTyp: t.typ, edits: {}, onEdit: () => {} }
      dokumente.push({ datei: `kn-s_${t.typ}`, titel: `Kompetenznachweis · ${t.label ?? t.typ}`, markup: () => renderToStaticMarkup(createElement(DocKnS, props)), docx: () => buildKnS({ kn: d.kn, knTyp: t.typ, logoPng }), protokoll: false })
    }
    const lp = { kn: d.kn, prinzip: d.prinzip, set: d.set, sits: [d.hf_A, d.hf_B, d.hf_C] }
    dokumente.push({ datei: 'kn-lp', titel: 'Kompetenznachweis · Lehrperson', markup: () => renderToStaticMarkup(createElement(DocKnLp, lp)), docx: () => buildKnLp({ ...lp, logoPng }), protokoll: false })
  }
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
      // Wie im ZIP der Workbench: Schreibprotokoll nur in den Heften (Auftragsfassung),
      // nicht im Auftragsbogen und nicht in den Lösungen — das sagt die Liste selbst.
      protokoll: dok.protokoll,
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
  if (fork) {
    const hinweis = join(OUT, 'HINWEIS-FASSUNG.txt')
    writeFileSync(hinweis, [fork.VERMERK, '', ...fork.warnungen.map((w) => `- ${w}`)].join('\n') + '\n', 'utf8')
    geschrieben.push(hinweis)
  }
} finally {
  await server.close()
}

for (const p of geschrieben) console.log(p)
