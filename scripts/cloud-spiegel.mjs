#!/usr/bin/env node
/**
 * cloud-spiegel.mjs — baut den PRIVATEN Produktions-Spiegel fuer Cloud-Sessions.
 *
 * Eine Cloud-Session sieht nur, was im angehaengten GitHub-Repo liegt. Das
 * Lehrmittel und CLAUDE.md sind hier gitignored und duerfen nicht ins
 * oeffentliche Repo. Der Spiegel ist ein eigener Klon mit eigenem privatem
 * Remote; nur dort werden beide versioniert (Branch `cloud`).
 *
 *   node scripts/cloud-spiegel.mjs            # Spiegel lokal bauen/auffrischen
 *   node scripts/cloud-spiegel.mjs --push     # … und nach origin (privat) pushen
 *   node scripts/cloud-spiegel.mjs --ziel <ordner>
 *
 * Der Spiegel wird aus dem COMMITTETEN Stand des aktuellen Branchs gebaut.
 * Zurueck ins oeffentliche Repo geht es nie per merge, nur per
 * scripts/cloud-import.mjs (pfadweise). Ablauf: docs/cloud-run/README.md
 */
import { existsSync, cpSync, readFileSync, writeFileSync, rmSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const argv = process.argv.slice(2)
const zielArg = argv.indexOf('--ziel')
const ZIEL = resolve(zielArg >= 0 ? argv[zielArg + 1] : join(ROOT, '..', 'bbw-hko-produktion'))
const PUSH = argv.includes('--push')
const OEFFENTLICH = /allgemeinbildung\/bbw-hko(\.git)?\/?$/

function git(cwd, ...a) {
  const r = spawnSync('git', a, { cwd, encoding: 'utf8' })
  if (r.status !== 0) {
    console.error(`git ${a.join(' ')}\n${r.stderr}`)
    process.exit(1)
  }
  return r.stdout.trim()
}
const gitOk = (cwd, ...a) => spawnSync('git', a, { cwd, encoding: 'utf8' })

const branch = git(ROOT, 'rev-parse', '--abbrev-ref', 'HEAD')
const kopf = git(ROOT, 'rev-parse', '--short', 'HEAD')
const schmutz = git(ROOT, 'status', '--porcelain', '--untracked-files=no')
if (schmutz) console.log(`HINWEIS: uncommittete Aenderungen gehen NICHT in den Spiegel:\n${schmutz}\n`)

for (const p of ['material/_lehrmittel', 'CLAUDE.md']) {
  if (!existsSync(join(ROOT, p))) { console.error(`${p} fehlt lokal — nichts zu spiegeln.`); process.exit(1) }
}

if (!existsSync(ZIEL)) {
  git(ROOT, 'clone', '--no-hardlinks', ROOT, ZIEL)
  git(ZIEL, 'remote', 'rename', 'origin', 'quelle')
  console.log(`Spiegel angelegt: ${ZIEL}`)
}
git(ZIEL, 'fetch', 'quelle', branch)
git(ZIEL, 'checkout', '-B', 'cloud', `quelle/${branch}`)

// Privat-Schicht: Lehrmittel (nur die aktuelle Ausgabe LM-26) und CLAUDE.md.
rmSync(join(ZIEL, 'material/_lehrmittel'), { recursive: true, force: true })
cpSync(join(ROOT, 'material/_lehrmittel'), join(ZIEL, 'material/_lehrmittel'), { recursive: true })
cpSync(join(ROOT, 'CLAUDE.md'), join(ZIEL, 'CLAUDE.md'))
const gi = join(ZIEL, '.gitignore')
writeFileSync(gi, readFileSync(gi, 'utf8').split('\n')
  .filter((l) => l.trim() !== 'CLAUDE.md' && l.trim() !== 'material/_lehrmittel*/').join('\n'))

git(ZIEL, 'add', '-A', '.gitignore', 'CLAUDE.md', 'material/_lehrmittel')
git(ZIEL, '-c', 'user.name=cloud-spiegel', '-c', 'user.email=noreply@bbw-hko.ch', 'commit', '-q', '-m',
  `PRIVAT: Lehrmittel + CLAUDE.md auf ${branch}@${kopf} — nie ins oeffentliche Repo`)
console.log(`Branch cloud = ${branch}@${kopf} + Privat-Schicht (${git(ZIEL, 'rev-parse', '--short', 'HEAD')})`)

const origin = gitOk(ZIEL, 'remote', 'get-url', 'origin')
if (origin.status !== 0) {
  console.log(`\nNoch kein privates Remote. Einmalig anlegen:\n  gh repo create allgemeinbildung/bbw-hko-produktion --private --source "${ZIEL}" --remote origin\nDanach: node scripts/cloud-spiegel.mjs --push`)
  process.exit(PUSH ? 1 : 0)
}
const url = origin.stdout.trim()
if (OEFFENTLICH.test(url)) { console.error(`ABBRUCH: origin des Spiegels ist das oeffentliche Repo (${url}).`); process.exit(1) }

if (PUSH) {
  // Sichtbarkeit pruefen, bevor urheberrechtlicher Text das Haus verlaesst.
  const slug = url.replace(/^.*github\.com[:/]/, '').replace(/\.git$/, '')
  const sicht = spawnSync('gh', ['repo', 'view', slug, '--json', 'isPrivate', '-q', '.isPrivate'], { encoding: 'utf8' })
  if ((sicht.stdout ?? '').trim() !== 'true') { console.error(`ABBRUCH: ${slug} ist nicht nachweislich privat (gh: «${(sicht.stdout || sicht.stderr || '').trim()}»).`); process.exit(1) }
  git(ZIEL, 'push', '--force', 'origin', 'cloud')
  console.log(`Gepusht: ${slug} › cloud`)
} else console.log(`\nNicht gepusht. Mit --push nach ${url}.`)
