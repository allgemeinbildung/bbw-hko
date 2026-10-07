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
//
// Die Umwandlung HTML → Text steht in `scripts/lib/seitentext.mjs` und wird mit
// `scripts/check-zeiger.mjs --export` und `scripts/check-kohaerenz.mjs --export` geteilt.
//
// Dieses Skript liest NUR den Export. Den Text der Quelle (Ausschnitt aus `quelle.md` im
// Archiv) legt es nicht ins Paket — der kommt nach references/gegenleser.md §3 dazu. Wer
// ihn mit einem eigenen Skript holt: `scripts/lib/archiv.mjs` (`ladeArchivtext`) zerlegt
// jede Form der Archivdatei und ist gegen Windows-Zeilenenden fest.

import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { seitenAusHtml } from '../../../../scripts/lib/seitentext.mjs'

const argv = process.argv.slice(2)
const iOut = argv.indexOf('--out')
const quelle = argv.find((a, i) => !a.startsWith('--') && (iOut < 0 || i !== iOut + 1))
if (!quelle || !existsSync(quelle)) {
  console.error('Aufruf: seitentext.mjs <export-ordner> [--out <ordner>]')
  process.exit(2)
}
const ziel = resolve(iOut >= 0 ? argv[iOut + 1] : join(quelle, 'text'))

mkdirSync(ziel, { recursive: true })
const dateien = readdirSync(quelle).filter((n) => /^(heft-.*|auftragsbogen)\.html$/.test(n)).sort()
if (!dateien.length) {
  console.error(`Keine heft-*.html oder auftragsbogen.html in ${quelle}`)
  process.exit(2)
}
for (const n of dateien) {
  const seiten = seitenAusHtml(readFileSync(join(quelle, n), 'utf8'))
  if (!seiten.length) {
    console.error(`${n}: keine Seiten gefunden (article.a4-page)`)
    process.exit(1)
  }
  const aus = seiten.map((t, i) => `=================== SEITE ${i + 1} ===================\n\n${t}`).join('\n\n')
  const name = n.replace(/\.html$/, '.txt')
  writeFileSync(join(ziel, name), aus + '\n')
  console.log(`${name}  ${seiten.length} Seiten  ${[...aus].length} Zeichen`)
}
console.log(`→ ${ziel}`)
