#!/usr/bin/env node
/**
 * patch-vercel-runtime.mjs — setzt die Laufzeit der Vercel-Funktionen nach dem Build.
 *
 * Vercel hat Node.js 18 und 20 eingestellt (Oktober 2026); `engines.node` steht darum auf
 * 24.x. Der Adapter @astrojs/vercel 7.x (Astro 4) kennt nur 18 und 20 und schreibt bei jeder
 * anderen Build-Version `"runtime": "nodejs18.x"` in die Funktionskonfiguration — das Deploy
 * scheitert dann. Dieses Skript läuft als `postbuild` und trägt die Version aus
 * `engines.node` ein. Es entfällt mit dem Wechsel auf Astro 5 / @astrojs/vercel ≥ 8.
 */
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const FUNCTIONS = join(ROOT, '.vercel', 'output', 'functions')

const engines = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')).engines?.node ?? ''
const major = engines.match(/\d+/)?.[0]
if (!major) {
  console.error('[patch-vercel-runtime] engines.node fehlt in package.json')
  process.exit(1)
}
const runtime = `nodejs${major}.x`

if (!existsSync(FUNCTIONS)) {
  console.log('[patch-vercel-runtime] kein .vercel/output/functions — nichts zu tun')
  process.exit(0)
}

let n = 0
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p)
    else if (name === '.vc-config.json') {
      const cfg = JSON.parse(readFileSync(p, 'utf8'))
      if (typeof cfg.runtime === 'string' && cfg.runtime.startsWith('nodejs') && cfg.runtime !== runtime) {
        console.log(`[patch-vercel-runtime] ${cfg.runtime} → ${runtime}  (${p.slice(ROOT.length + 1)})`)
        cfg.runtime = runtime
        writeFileSync(p, JSON.stringify(cfg, null, '\t'))
        n++
      }
    }
  }
}
walk(FUNCTIONS)
console.log(`[patch-vercel-runtime] ${n} Funktion(en) auf ${runtime} gesetzt`)
