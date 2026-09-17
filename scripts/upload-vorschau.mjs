// Lädt ein entpacktes Einheiten-Bundle als Vorschau in den privaten Bucket `vorschau`.
//
//   node scripts/upload-vorschau.mjs <entpackter-ordner> <setKey>
//   node scripts/upload-vorschau.mjs "D:\OS\Clippings\unit" 3.2.1_wahre_kosten
//
// Hochgeladen werden html/, word/ und Material_LP/. Die Übersicht selbst nicht —
// sie wird bei jedem Aufruf von /vorschau/{setKey}/ neu erzeugt. Eine frühere
// Vorschau derselben Einheit wird vorher vollständig ersetzt, damit keine
// veralteten Dateien übrig bleiben. Danach: https://bbw-hko.ch/vorschau/{setKey}/

import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const BUCKET = 'vorschau'
const ORDNER = ['html', 'word', 'Material_LP']
const TYPES = {
  html: 'text/html; charset=utf-8',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  pdf: 'application/pdf',
  png: 'image/png',
  svg: 'image/svg+xml',
}

const [src, setKey] = process.argv.slice(2)
if (!src || !setKey) {
  console.error('Aufruf: node scripts/upload-vorschau.mjs <entpackter-ordner> <setKey>')
  process.exit(1)
}
if (!/^[\w.-]+$/.test(setKey) || !existsSync(join(ROOT, 'src', 'data', 'einheiten', setKey))) {
  console.error(`Unbekannte Einheit: ${setKey} (erwartet unter src/data/einheiten/)`)
  process.exit(1)
}

const env = Object.fromEntries(
  readFileSync(join(ROOT, '.env'), 'utf8')
    .split(/\r?\n/)
    .map((l) => l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/))
    .filter(Boolean)
    .map(([, k, v]) => [k, v.replace(/^["']|["']$/g, '')]),
)
const supabase = createClient(env.PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })
const storage = supabase.storage.from(BUCKET)

const { data: buckets, error: bErr } = await supabase.storage.listBuckets()
if (bErr) throw bErr
if (!buckets.some((b) => b.id === BUCKET)) {
  const { error } = await supabase.storage.createBucket(BUCKET, { public: false })
  if (error) throw error
  console.log(`Bucket «${BUCKET}» angelegt (privat).`)
}

// Neue Dateiliste sammeln
const dateien = []
for (const ordner of ORDNER) {
  const dir = join(src, ordner)
  if (!existsSync(dir)) continue
  for (const name of readdirSync(dir)) {
    if (!statSync(join(dir, name)).isFile()) continue
    if (!/^[\w.-]+$/.test(name)) {
      console.warn(`übersprungen (Dateiname): ${ordner}/${name}`)
      continue
    }
    dateien.push({ pfad: `${ordner}/${name}`, voll: join(dir, name) })
  }
}
if (!dateien.length) {
  console.error(`Keine Dateien in ${ORDNER.join('/, ')}/ unter ${src}`)
  process.exit(1)
}

// Alte Vorschau entfernen
const alt = []
for (const ordner of ORDNER) {
  const { data } = await storage.list(`${setKey}/${ordner}`, { limit: 1000 })
  for (const f of data ?? []) if (f.id) alt.push(`${setKey}/${ordner}/${f.name}`)
}
if (alt.length) {
  const { error } = await storage.remove(alt)
  if (error) throw error
  console.log(`${alt.length} alte Dateien entfernt.`)
}

let bytes = 0
for (const { pfad, voll } of dateien) {
  const buf = readFileSync(voll)
  const ext = pfad.split('.').pop().toLowerCase()
  const { error } = await storage.upload(`${setKey}/${pfad}`, buf, {
    contentType: TYPES[ext] ?? 'application/octet-stream',
    upsert: true,
  })
  if (error) throw new Error(`${pfad}: ${error.message}`)
  bytes += buf.length
  console.log(`  ✓ ${pfad}`)
}
console.log(`\n${dateien.length} Dateien (${(bytes / 1024 / 1024).toFixed(1)} MB) → ${BUCKET}/${setKey}/`)
console.log(`Vorschau: https://bbw-hko.ch/vorschau/${setKey}/`)
