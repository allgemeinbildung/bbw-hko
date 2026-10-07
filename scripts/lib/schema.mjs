/**
 * schema.mjs — kleiner Prüfer für die Schemas unter scripts/schema/ (ENTSCHEIDE E38).
 *
 *   import { ladeSchema, validiere } from './lib/schema.mjs'
 *   const fehler = validiere(ladeSchema('belege'), daten)   // [] = gültig
 *
 * Kennt genau die Schlüsselwörter, die die Schemas verwenden (references/belege.md §2):
 * type (auch als Liste) · const · enum · pattern · minLength · minItems · required ·
 * properties · additionalProperties · items · $defs · $ref (nur innerhalb der Datei) ·
 * allOf · if · then. Alles andere wird überlesen. Die Meldungen nennen Pfad und Regel,
 * nie den geprüften Wert — der kann ein Anker sein.
 *
 * Reines Node, keine Abhängigkeiten, nur lesend.
 */
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'schema')
const cache = new Map()

/** Lädt `scripts/schema/<name>.schema.json` (belege · fakten · fall · probe · herkunft · karte-belege). */
export function ladeSchema(name) {
  if (!cache.has(name)) cache.set(name, JSON.parse(readFileSync(join(DIR, `${name}.schema.json`), 'utf8')))
  return cache.get(name)
}

const typ = (v) => (Array.isArray(v) ? 'array' : v === null ? 'null' : Number.isInteger(v) ? 'integer' : typeof v)
const passt = (soll, v) => { const t = typ(v); return soll.includes(t) || (t === 'integer' && soll.includes('number')) }

/**
 * Prüft `wert` gegen `schema`. Gibt die Verstösse als Zeilen «$.pfad: Regel» zurück.
 * @returns {string[]}
 */
export function validiere(schema, wert, wurzel = schema, pfad = '$', out = []) {
  if (schema.$ref) {
    const ziel = schema.$ref.replace(/^#\//, '').split('/').reduce((o, k) => o?.[k], wurzel)
    if (!ziel) out.push(`${pfad}: $ref ${schema.$ref} nicht auflösbar`)
    else validiere(ziel, wert, wurzel, pfad, out)
  }
  if (schema.type) {
    const t = [].concat(schema.type)
    if (!passt(t, wert)) { out.push(`${pfad}: Typ ${typ(wert)}, Soll ${t.join('|')}`); return out }
  }
  if ('const' in schema && wert !== schema.const) out.push(`${pfad}: nicht «${schema.const}»`)
  if (schema.enum && !schema.enum.includes(wert)) out.push(`${pfad}: nicht in ${schema.enum.join('|')}`)
  if (typeof wert === 'string') {
    if (schema.pattern && !new RegExp(schema.pattern, 'u').test(wert)) out.push(`${pfad}: Muster verletzt`)
    if (schema.minLength !== undefined && wert.length < schema.minLength) out.push(`${pfad}: zu kurz`)
  }
  if (Array.isArray(wert)) {
    if (schema.minItems !== undefined && wert.length < schema.minItems) out.push(`${pfad}: zu wenige Einträge`)
    if (schema.items) wert.forEach((x, i) => validiere(schema.items, x, wurzel, `${pfad}[${i}]`, out))
  }
  if (wert && typeof wert === 'object' && !Array.isArray(wert)) {
    for (const r of schema.required ?? []) if (!(r in wert)) out.push(`${pfad}: «${r}» fehlt`)
    for (const [k, v] of Object.entries(wert)) {
      if (schema.properties?.[k]) validiere(schema.properties[k], v, wurzel, `${pfad}.${k}`, out)
      else if (schema.additionalProperties === false && schema.properties) out.push(`${pfad}: unbekanntes Feld «${k}»`)
    }
  }
  for (const s of schema.allOf ?? []) validiere(s, wert, wurzel, pfad, out)
  if (schema.if && schema.then && !validiere(schema.if, wert, wurzel, pfad, []).length) validiere(schema.then, wert, wurzel, pfad, out)
  return out
}
