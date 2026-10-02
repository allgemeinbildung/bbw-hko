#!/usr/bin/env node
/**
 * cloud-import.mjs — holt das Ergebnis eines Cloud-Laufs aus dem privaten
 * Spiegel ins oeffentliche Repo. Pfadweise, nie per merge: die Historie des
 * Spiegels enthaelt das Lehrmittel.
 *
 *   node scripts/cloud-import.mjs <branch>            # zeigt, was kaeme
 *   node scripts/cloud-import.mjs <branch> --anwenden # legt die Dateien in den Arbeitsbaum
 *
 * Uebernommen wird nur, was unter ERLAUBT liegt. Alles andere wird gemeldet und
 * bleibt draussen. Danach laeuft das Tor (mit lokaler Leck-Pruefung). Committet
 * wird nichts — das entscheidet, wer importiert.
 */
import { existsSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const argv = process.argv.slice(2)
const branch = argv.find((a) => !a.startsWith('--'))
const zielArg = argv.indexOf('--ziel')
const ZIEL = resolve(zielArg >= 0 ? argv[zielArg + 1] : join(ROOT, '..', 'bbw-hko-produktion'))
const ANWENDEN = argv.includes('--anwenden')
const ERLAUBT = ['src/data/einheiten/', 'src/data/methoden/', 'src/data/quellen/', 'docs/cloud-run/laeufe/']

if (!branch) { console.error('usage: node scripts/cloud-import.mjs <branch> [--anwenden] [--ziel <ordner>]'); process.exit(2) }
if (!existsSync(ZIEL)) { console.error(`Spiegel nicht gefunden: ${ZIEL}`); process.exit(2) }

function git(cwd, opt, ...a) {
  const r = spawnSync('git', a, { cwd, encoding: opt.buffer ? 'buffer' : 'utf8', maxBuffer: 64 * 1024 * 1024 })
  if (r.status !== 0) { console.error(`git ${a.join(' ')}\n${r.stderr}`); process.exit(1) }
  return opt.buffer ? r.stdout : r.stdout.trim()
}

git(ZIEL, {}, 'fetch', 'origin', branch, 'cloud')
const basis = git(ZIEL, {}, 'merge-base', 'origin/cloud', `origin/${branch}`)
const zeilen = git(ZIEL, {}, 'diff', '--name-status', '--no-renames', basis, `origin/${branch}`).split('\n').filter(Boolean)

const rein = [], draussen = []
for (const z of zeilen) {
  const [art, pfad] = z.split('\t')
  ;(ERLAUBT.some((e) => pfad.startsWith(e)) ? rein : draussen).push({ art, pfad })
}

console.log(`${branch}: ${rein.length} Datei(en) im erlaubten Bereich, ${draussen.length} ausserhalb.\n`)
for (const d of rein) console.log(`  ${d.art}  ${d.pfad}`)
if (draussen.length) {
  console.log('\nNICHT uebernommen (ausserhalb von ' + ERLAUBT.join(', ') + '):')
  for (const d of draussen) console.log(`  ${d.art}  ${d.pfad}`)
}
if (!ANWENDEN) { console.log('\nNichts geschrieben. Mit --anwenden uebernehmen.'); process.exit(0) }

for (const { art, pfad } of rein) {
  const ziel = join(ROOT, pfad)
  if (art === 'D') { rmSync(ziel, { force: true }); continue }
  mkdirSync(dirname(ziel), { recursive: true })
  writeFileSync(ziel, git(ZIEL, { buffer: true }, 'show', `origin/${branch}:${pfad}`))
}

const slugs = [...new Set(rein.filter((d) => d.pfad.startsWith('src/data/einheiten/')).map((d) => d.pfad.split('/')[3]))]
  .filter((s) => existsSync(join(ROOT, 'src/data/einheiten', s)))
console.log(`\nUebernommen. Tor fuer: ${slugs.join(', ') || '—'}\n`)
if (!slugs.length) process.exit(0)
const tor = spawnSync(process.execPath, [join(ROOT, 'scripts/check-all.mjs'), ...slugs], { cwd: ROOT, stdio: 'inherit' })
console.log('\nNaechste Schritte: npm run build:einheiten-index · im Browser ansehen · committen.')
process.exit(tor.status ?? 1)
