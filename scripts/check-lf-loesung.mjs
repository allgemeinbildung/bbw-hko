#!/usr/bin/env node
// Check 32 (C10) als ausfuehrbarer Test: prueft `leitfragen[].loesung` in den
// Herausforderungs-JSONs gegen die Grenzen, die das Unterrichtsdeck real rendert.
//
//   node scripts/check-lf-loesung.mjs 1.3.1_konsum_verantworten
//   node scripts/check-lf-loesung.mjs --all
//
// Die Zeichengrenzen sind nicht kosmetisch: die Deck-Folie ist ein Akkordeon mit
// genau einer offenen Leitfrage (`deck-builder.ts`, Block `muster`). Laenger passt
// nicht auf die Folie, `hyperframes check` meldet dann `canvas_overflow`.
// Einheiten ohne jede `loesung` werden uebersprungen — das Feld ist additiv.

import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)))
const UNITS = join(ROOT, 'src', 'data', 'einheiten')

const LIMITS = { zeilenMin: 3, zeilenMax: 6, textMax: 900, kern: 55, label: 24, quelle: 30 }

const argv = process.argv.slice(2)
const targets = argv.includes('--all') ? readdirSync(UNITS) : argv.filter((a) => !a.startsWith('--'))
if (!targets.length) {
  console.error('usage: node scripts/check-lf-loesung.mjs <slug> | --all')
  process.exit(1)
}

let befunde = 0
let geprueft = 0

for (const slug of targets) {
  for (const L of ['A', 'B', 'C']) {
    const file = join(UNITS, slug, `herausforderung_${L}.json`)
    if (!existsSync(file)) continue

    let json
    try {
      json = JSON.parse(readFileSync(file, 'utf8'))
    } catch (e) {
      console.log(`ERR_JSON_INVALID  ${slug}/${L} — ${e.message}`)
      befunde++
      continue
    }

    // Heft-Format v4.2 (`template: "heft_8page_v42"`): LF1/LF2 stehen im Kern, LF3/LF4
    // je Spur unter `spuren`. Geprueft wird Kern + Spur, einmal je Spur. Ohne das
    // Template: ein Durchgang wie bisher.
    const v42 = json.template === 'heft_8page_v42'
    const kern = json.leitfragen ?? []
    const spuren = v42 && json.spuren && typeof json.spuren === 'object'
      ? Object.entries(json.spuren).filter(([, s]) => s && typeof s === 'object')
      : []
    const durchgaenge = spuren.length
      ? spuren.map(([key, s]) => [`${L}[${key}]`, [...kern, ...(s.leitfragen ?? [])].sort((a, b) => (a.nr ?? 0) - (b.nr ?? 0))])
      : [[L, kern]]

    for (const [marke, lfs] of durchgaenge) {
    if (!lfs.some((lf) => lf.loesung)) continue // Einheit noch ohne C10 — kein Befund

    for (const lf of lfs) {
      const tag = `${slug}/${marke}/LF${lf.nr}`
      const sol = lf.loesung
      geprueft++

      // v4.2, LF4: `loesung.erwartungshorizont` traegt die Loesung, `zeilen` darf fehlen.
      const eh = sol?.erwartungshorizont
      if (v42 && lf.nr === 4 && !sol.zeilen?.length && eh && typeof eh === 'object' && Object.keys(eh).length) {
        if ((sol.kern ?? '').length > LIMITS.kern) {
          console.log(`WARN_LF_LOESUNG_ZU_LANG  ${tag} — kern ${sol.kern.length} Zeichen (max ${LIMITS.kern}): «${sol.kern}»`)
          befunde++
        }
        if (/ß/.test(JSON.stringify(eh))) {
          console.log(`ERR_ESZETT_FOUND  ${tag}`)
          befunde++
        }
        continue
      }

      if (!sol?.zeilen?.length) {
        console.log(`ERR_LF_LOESUNG_MISSING  ${tag}`)
        befunde++
        continue
      }

      const chars = sol.zeilen.reduce((n, z) => n + String(z.text ?? '').length, 0)
      if (sol.zeilen.some((z) => !z.text)) {
        console.log(`ERR_LF_LOESUNG_MISSING  ${tag} — Zeile ohne text`)
        befunde++
      }
      if (sol.zeilen.length < LIMITS.zeilenMin || sol.zeilen.length > LIMITS.zeilenMax) {
        console.log(`WARN_LF_LOESUNG_ZU_LANG  ${tag} — ${sol.zeilen.length} Zeilen (erlaubt ${LIMITS.zeilenMin}-${LIMITS.zeilenMax})`)
        befunde++
      }
      if (chars > LIMITS.textMax) {
        console.log(`WARN_LF_LOESUNG_ZU_LANG  ${tag} — ${chars} Zeichen text (max ${LIMITS.textMax})`)
        befunde++
      }
      if ((sol.kern ?? '').length > LIMITS.kern) {
        console.log(`WARN_LF_LOESUNG_ZU_LANG  ${tag} — kern ${sol.kern.length} Zeichen (max ${LIMITS.kern}): «${sol.kern}»`)
        befunde++
      }
      for (const z of sol.zeilen) {
        if ((z.label ?? '').length > LIMITS.label) {
          console.log(`WARN_LF_LOESUNG_ZU_LANG  ${tag} — label ${z.label.length} Zeichen (max ${LIMITS.label}): «${z.label}»`)
          befunde++
        }
        if ((z.quelle ?? '').length > LIMITS.quelle) {
          console.log(`WARN_LF_LOESUNG_ZU_LANG  ${tag} — quelle ${z.quelle.length} Zeichen (max ${LIMITS.quelle}): «${z.quelle}»`)
          befunde++
        }
      }

      // Bloom-Treue: eine Entscheidungsfrage mit genau einer zulaessigen Antwort war keine.
      if (lf.bloom === 'Entscheiden') {
        const labels = sol.zeilen.map((z) => z.label ?? '')
        const hatErwartet = labels.some((l) => /^Erwartet/.test(l))
        const hatGegenpol = labels.some((l) => /^(Ebenfalls tragfähig|Nicht tragfähig)/.test(l))
        if (!hatErwartet || !hatGegenpol) {
          console.log(`WARN_LF_LOESUNG_BLOOM_FLACH  ${tag} — braucht «Erwartet» + «Ebenfalls tragfähig»/«Nicht tragfähig», hat: ${labels.join(' · ') || '—'}`)
          befunde++
        }
      }

      const eszett = sol.zeilen.find((z) => /ß/.test(z.text) || /ß/.test(z.label ?? ''))
      if (eszett) {
        console.log(`ERR_ESZETT_FOUND  ${tag}`)
        befunde++
      }
    }
    }
  }
}

console.log(
  befunde
    ? `\n${befunde} Befund(e) in ${geprueft} geprüften Leitfragen.`
    : `Check 32: ${geprueft} Leitfragen geprüft, keine Befunde.`
)
process.exit(befunde ? 1 : 0)
