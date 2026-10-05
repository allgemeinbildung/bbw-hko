#!/usr/bin/env node
// Schreibt den sichtbaren Text der exportierten Lernenden-Dokumente Seite fuer Seite
// in Textdateien — das, was ein Gegenleser bekommt (references/gegenleser.md).
//
//   node .claude/skills/bbw-hko-heft-v42/scripts/seitentext.mjs <export-ordner> [--out <ordner>]
//
// <export-ordner>  Ausgabe von `node scripts/export-v42.mjs <ordner> --out <export-ordner>`
// --out            Zielordner (Vorgabe: <export-ordner>/text)
//
// Verarbeitet heft-*.html und auftragsbogen.html, nie loesungen-*.html. Die Bedienleiste
// der Datei entfaellt. Marken: «[Schreibfeld]» = leeres Feld, «[leere Rasterzeile]» =
// leere Tabellenzeile zum Ausfuellen. Nur lesend ausser im Zielordner; reines Node.

import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

const argv = process.argv.slice(2)
const iOut = argv.indexOf('--out')
const quelle = argv.find((a, i) => !a.startsWith('--') && (iOut < 0 || i !== iOut + 1))
if (!quelle || !existsSync(quelle)) {
  console.error('Aufruf: seitentext.mjs <export-ordner> [--out <ordner>]')
  process.exit(2)
}
const ziel = resolve(iOut >= 0 ? argv[iOut + 1] : join(quelle, 'text'))

const entitaeten = (s) =>
  s
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&shy;|­|​/g, '')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))

const nackt = (s) => entitaeten(s.replace(/<[^>]+>/g, '')).trim()

function text(html) {
  let s = html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<img[^>]*class="page-head-logo"[^>]*>/gi, '')
    .replace(/<img[^>]*alt="([^"]+)"[^>]*>/gi, (_, a) => `\n[Bild: ${a}]\n`)
    .replace(/<img[^>]*>/gi, '\n[Bild]\n')
  // Eine Tabellenzeile ohne gedruckten Text ist eine Zeile zum Ausfuellen — eine Marke,
  // nicht eine je Zelle.
  s = s.replace(/<tr[\s\S]*?<\/tr>/gi, (tr) => (nackt(tr.replace(/<textarea[\s\S]*?<\/textarea>/gi, '')) === '' ? '\n[leere Rasterzeile]\n' : tr))
  s = s
    .replace(/<textarea[^>]*>[\s\S]*?<\/textarea>/gi, '\n[Schreibfeld]\n')
    .replace(/<[a-z0-9]+[^>]*contenteditable[^>]*>/gi, '\n[Schreibfeld]\n')
    .replace(/<input[^>]*type="checkbox"[^>]*>/gi, ' ☐ ')
    .replace(/<input[^>]*>/gi, ' [Feld] ')
    .replace(/<\/(td|th)>/gi, ' | ').replace(/<\/tr>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n').replace(/<li[^>]*>/gi, '\n- ')
    .replace(/<h[1-6][^>]*>/gi, '\n\n## ')
    .replace(/<\/?(p|div|section|header|footer|article|table|thead|tbody|ul|ol|h[1-6]|figure|figcaption|dl|dt|dd|svg|text|g|aside|main|nav|blockquote|button)[^>]*>/gi, '\n')
    // Nebeneinander gesetzte Inline-Elemente («Persona» + Wert) nicht zusammenkleben.
    .replace(/<\/(span|strong|b|em|i|label)>/gi, ' ')
    .replace(/<[^>]+>/g, '')
  const aus = []
  for (const roh of entitaeten(s).split('\n')) {
    const z = roh.replace(/[ \t]+/g, ' ').trim()
    const letzte = aus[aus.length - 1]
    if (z === '' && letzte === '') continue
    if (z === '[Schreibfeld]' && aus.filter(Boolean).slice(-1)[0] === '[Schreibfeld]') continue
    aus.push(z)
  }
  return aus.join('\n').replace(/\n{3,}/g, '\n\n').trim()
}

mkdirSync(ziel, { recursive: true })
const dateien = readdirSync(quelle).filter((n) => /^(heft-.*|auftragsbogen)\.html$/.test(n)).sort()
if (!dateien.length) {
  console.error(`Keine heft-*.html oder auftragsbogen.html in ${quelle}`)
  process.exit(2)
}
for (const n of dateien) {
  const html = readFileSync(join(quelle, n), 'utf8')
  const body = html.slice(html.indexOf('<body')).replace(/<div class="standalone-bar"[\s\S]*?<main/i, '<main')
  const seiten = body.split(/(?=<article class="a4-page[ "])/).filter((p) => p.startsWith('<article class="a4-page'))
  if (!seiten.length) {
    console.error(`${n}: keine Seiten gefunden (article.a4-page)`)
    process.exit(1)
  }
  const aus = seiten.map((p, i) => `=================== SEITE ${i + 1} ===================\n\n${text(p)}`).join('\n\n')
  const name = n.replace(/\.html$/, '.txt')
  writeFileSync(join(ziel, name), aus + '\n')
  console.log(`${name}  ${seiten.length} Seiten  ${[...aus].length} Zeichen`)
}
console.log(`→ ${ziel}`)
