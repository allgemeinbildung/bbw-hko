// scripts/sync-nrlp-indexes.mjs
// Mirrors the einheiten/situationen indexes into public/nrlp/ so the
// "units as nodes" overlay (public/nrlp/ext/units-overlay.js) can fetch them
// at runtime. Run after `build:einheiten-index` / `sync:situationen`.
import { copyFileSync, existsSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dst = join(root, 'public', 'nrlp')
if (!existsSync(dst)) mkdirSync(dst, { recursive: true })

const files = ['einheiten.index.json', 'situationen.index.json']
let copied = 0
for (const f of files) {
  const src = join(root, 'src', 'data', f)
  if (existsSync(src)) {
    copyFileSync(src, join(dst, f))
    copied++
    console.log(`  mirrored ${f} → public/nrlp/`)
  } else {
    console.warn(`  skipped ${f} (not found at src/data/)`)
  }
}
console.log(`sync-nrlp-indexes: ${copied}/${files.length} index files mirrored.`)
