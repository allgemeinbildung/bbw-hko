/**
 * leck.mjs — woertliche Uebernahmen aus Lehrmittel und Quellenarchiv finden.
 *
 * Das Repo ist oeffentlich, Lehrmittel und Quellentexte sind es nicht. Dieses
 * Modul traegt die Vergleichsbasis und die Messung; benutzt von
 *   scripts/check-all.mjs   (Einheiten, Feld fuer Feld)
 *   scripts/check-leck.mjs  (beliebige Pfade: Dokumente, Karten, Index)
 *
 * Vergleichsbasis:
 *   material/_lehrmittel* /*.md      Kapiteldateien (gitignored)
 *   <Archiv>/q-* /**.md|.txt         Volltexte der Quellen (ausserhalb des Repos)
 * Mit Optionen (nur check-leck): auch .txt im Lehrmittel und <Archiv>/_kandidaten/.
 *
 * Reines Node, nur lesend.
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
export const MATERIAL = join(ROOT, 'material')
// Volltexte der Quellen: im privaten Spiegel unter material/_quellen-archiv/, lokal ausserhalb des Repos.
export const ARCHIV = [join(MATERIAL, '_quellen-archiv'), process.env.QUELLEN_ARCHIV || 'D:/OS/_lab/quellen-archiv/bbw-hko'].find((p) => existsSync(p))

// Laenge einer woertlichen Uebernahme, in Woertern. Ein Fachbegriff oder eine
// Gesetzesformel ist kuerzer; ab LECK_ERR ist es ein abgeschriebener Absatz.
export const SHINGLE = 8
export const LECK_WARN = 14
export const LECK_ERR = 25

// Links und URNs sind keine Uebernahme — sie stehen in Karte und Quelle zwangslaeufig gleich.
export const wörter = (s) => s.toLowerCase().replace(/https?:\/\/\S+|urn:\S+/g, ' ').match(/[\p{L}\p{N}]+/gu) ?? []

/**
 * Laedt die Vergleichsbasis. Ohne Optionen genau der Umfang, den check-all
 * seit jeher prueft. Rueckgabe null, wenn kein Lehrmittelkapitel gefunden ist.
 *
 *   material    anderer Ordner statt <repo>/material (Tests)
 *   archiv      anderer Archivordner
 *   txt         im Lehrmittel auch .txt lesen
 *   kandidaten  im Archiv auch die Unterordner von _kandidaten/ lesen
 *
 * `set` ist eine Map Wortfolge → Nummer in `herkunft` (wer die Folge zuerst
 * geliefert hat); `set.has()` verhaelt sich wie bei einem Set.
 */
export function ladeLehrmittel({ material = MATERIAL, archiv = ARCHIV, txt = false, kandidaten = false } = {}) {
  if (!existsSync(material)) return null
  const dirs = readdirSync(material).filter((d) => d.startsWith('_lehrmittel') && statSync(join(material, d)).isDirectory())
  const set = new Map()
  const herkunft = []
  const aufnehmen = (w, name) => {
    const nr = herkunft.push(name) - 1
    for (let i = 0; i + SHINGLE <= w.length; i++) {
      const k = w.slice(i, i + SHINGLE).join(' ')
      if (!set.has(k)) set.set(k, nr)
    }
  }
  let dateien = 0
  for (const d of dirs) {
    for (const f of readdirSync(join(material, d))) {
      if (!(f.endsWith('.md') || (txt && f.endsWith('.txt')))) continue
      dateien++
      aufnehmen(wörter(readFileSync(join(material, d, f), 'utf8').replace(/\[seite:\s*\d+\]/g, ' ')), `Lehrmittel ${d}/${f}`)
    }
  }
  let quellen = 0
  const lies = (dir, name) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name)
      if (e.isDirectory()) lies(p, `${name}/${e.name}`)
      else if (/.(md|txt)$/i.test(e.name)) {
        quellen++
        aufnehmen(wörter(readFileSync(p, 'utf8')), `Archiv ${name}/${e.name}`)
      }
    }
  }
  // Nur die Quellenordner (q-…). Arbeitsnotizen daneben (_pruefung, _briefs)
  // zitieren die Einheit selbst und wuerden jede Zeile als Leck melden.
  if (archiv && existsSync(archiv)) {
    for (const d of readdirSync(archiv)) if (d.startsWith('q-')) lies(join(archiv, d), d)
    const kand = join(archiv, '_kandidaten')
    if (kandidaten && existsSync(kand)) {
      for (const e of readdirSync(kand, { withFileTypes: true })) if (e.isDirectory()) lies(join(kand, e.name), `_kandidaten/${e.name}`)
    }
  }
  return dateien ? { set, herkunft, dateien, quellen } : null
}

/** Laengste woertliche Uebernahme in `text`, als { woerter, auszug, quelle }. */
export function laengsteUebernahme(text, lm) {
  const w = wörter(text)
  let best = 0, bestStart = 0, run = 0
  for (let i = 0; i + SHINGLE <= w.length; i++) {
    if (lm.set.has(w.slice(i, i + SHINGLE).join(' '))) {
      run++
      if (run > best) { best = run; bestStart = i - run + 1 }
    } else run = 0
  }
  if (!best) return null
  const n = best + SHINGLE - 1
  const nr = lm.set.get?.(w.slice(bestStart, bestStart + SHINGLE).join(' '))
  return { woerter: n, auszug: w.slice(bestStart, bestStart + Math.min(n, 12)).join(' ') + ' …', quelle: lm.herkunft?.[nr] ?? null }
}

/** Alle Zeichenketten eines JSON-Baums als [pfad, text]. */
export function* strings(node, pfad = '') {
  if (typeof node === 'string') yield [pfad, node]
  else if (Array.isArray(node)) for (let i = 0; i < node.length; i++) yield* strings(node[i], `${pfad}[${i}]`)
  else if (node && typeof node === 'object') for (const [k, v] of Object.entries(node)) yield* strings(v, pfad ? `${pfad}.${k}` : k)
}

/** Alle woertlichen Uebernahmen ab `ab` Woertern in `text`, je { woerter, auszug, quelle }. */
export function alleUebernahmen(text, lm, ab = LECK_WARN) {
  const w = wörter(text)
  const out = []
  let run = 0
  const schliesse = (ende) => {
    const n = run + SHINGLE - 1
    if (run && n >= ab) {
      const start = ende - run
      const nr = lm.set.get?.(w.slice(start, start + SHINGLE).join(' '))
      out.push({ woerter: n, auszug: w.slice(start, start + Math.min(n, 12)).join(' ') + ' …', quelle: lm.herkunft?.[nr] ?? null })
    }
    run = 0
  }
  let i = 0
  for (; i + SHINGLE <= w.length; i++) {
    if (lm.set.has(w.slice(i, i + SHINGLE).join(' '))) run++
    else schliesse(i)
  }
  schliesse(i)
  return out
}
