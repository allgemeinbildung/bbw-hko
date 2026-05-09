#!/usr/bin/env node
// Local sync: copies `*_sit_*.json` mission files from the local hko-deploy repo
// into bbw-hko/src/data/situationen/ and generates a slim index file.
//
// Usage:
//   node scripts/sync-situationen.mjs
//   node scripts/sync-situationen.mjs --source "D:/path/to/hko-deploy"
//
// Default source assumes hko-deploy lives next to bbw-hko:
//   <parent>/bbw-hko/
//   <parent>/hko-deploy/public/missions-renderer/public/data/

import { readdir, readFile, writeFile, mkdir, rm } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '..')

function parseArgs() {
  const args = process.argv.slice(2)
  const out = { source: null, dryRun: false }
  for (let i = 0; i < args.length; i++) {
    const a = args[i]
    if (a === '--source') out.source = args[++i]
    else if (a === '--dry-run') out.dryRun = true
  }
  return out
}

function defaultSource() {
  const parent = path.resolve(repoRoot, '..')
  return path.join(parent, 'hko-deploy')
}

async function loadJson(file) {
  const txt = await readFile(file, 'utf8')
  return JSON.parse(txt)
}

function slimEntry(full, fileBaseName) {
  const id = full.id
  const kompetenz_nr = full.nrlp?.nr ?? null
  const lebensbezug_nr = full.nrlp?.lebensbezug ?? null
  const thema_nr = kompetenz_nr ? Number(kompetenz_nr.split('.')[0]) : null
  const aspekte = (full.nrlp?.gesellschaft ?? []).map((g) => g.aspekt).filter(Boolean)
  const sprachmodi = full.nrlp?.sprachmodi ?? []
  const sk = full.nrlp?.sk ?? []
  const themen = full.nrlp?.themen ?? []
  return {
    id,
    modul: full.modul ?? null,
    modul_titel: full.modul_titel ?? null,
    thema_nr,
    themen,
    lebensbezug_nr,
    kompetenz_nr,
    sit_letter: full.situation ?? null,
    titel: full.titel ?? null,
    emotion_tag: full.emotion_tag ?? null,
    persona: full.persona ?? null,
    aspekte,
    sprachmodi,
    sk,
    wochen: full.wochen ?? null,
    leitfrage: full.leitfrage ?? null,
    handlungsprodukt_format: full.handlungsprodukt?.format ?? null,
    handlungsprodukt_titel: full.handlungsprodukt?.titel ?? null,
    quelle_json: fileBaseName,
    quelle_html: `https://www.abu-hko.ch/nrlp/situationen/missions/${id.toLowerCase()}.html`,
  }
}

async function main() {
  const args = parseArgs()
  const sourceRepo = args.source ? path.resolve(args.source) : defaultSource()
  const sourceDir = path.join(sourceRepo, 'public', 'missions-renderer', 'public', 'data')
  if (!existsSync(sourceDir)) {
    console.error(`[sync-situationen] Source dir not found: ${sourceDir}`)
    console.error('Pass --source <path-to-hko-deploy> if hko-deploy is not next to this repo.')
    process.exit(1)
  }

  const outDir = path.join(repoRoot, 'src', 'data', 'situationen')
  const indexFile = path.join(repoRoot, 'src', 'data', 'situationen.index.json')

  console.log(`[sync-situationen] Source: ${sourceDir}`)
  console.log(`[sync-situationen] Target: ${outDir}`)

  const all = await readdir(sourceDir)
  const sitFiles = all.filter((f) => /_sit_[A-Z]\.json$/.test(f)).sort()
  console.log(`[sync-situationen] Found ${sitFiles.length} situation files.`)

  if (!args.dryRun) {
    if (existsSync(outDir)) await rm(outDir, { recursive: true, force: true })
    await mkdir(outDir, { recursive: true })
  }

  const index = []
  for (const fname of sitFiles) {
    const src = path.join(sourceDir, fname)
    const data = await loadJson(src)
    if (!data?.id) {
      console.warn(`  skip ${fname} — missing id`)
      continue
    }
    const slim = slimEntry(data, fname)
    index.push(slim)
    if (!args.dryRun) {
      const dst = path.join(outDir, fname)
      await writeFile(dst, JSON.stringify(data, null, 2), 'utf8')
    }
  }

  index.sort((a, b) => {
    const k = (a.kompetenz_nr ?? '').localeCompare(b.kompetenz_nr ?? '')
    if (k !== 0) return k
    return (a.sit_letter ?? '').localeCompare(b.sit_letter ?? '')
  })

  if (!args.dryRun) {
    await writeFile(indexFile, JSON.stringify(index, null, 2), 'utf8')
  }

  console.log(`[sync-situationen] Wrote ${index.length} situations + index.`)
  console.log(`[sync-situationen] Index: ${indexFile}`)
}

main().catch((err) => {
  console.error('[sync-situationen] FAILED:', err)
  process.exit(1)
})
