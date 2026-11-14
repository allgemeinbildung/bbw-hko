/**
 * Fork-Pilot «Meine Fassung» — Adressformat einer Ersetzung (VERTRAG §1).
 *
 * ACHTUNG: Das Format ist endgültig, sobald die erste Fassung gespeichert ist
 * (Invariante 1). Ein Pfad adressiert die ROHFORM auf der Platte; Listenelemente
 * nur über ihren Schlüssel, nie über den Index.
 *
 * Bewusst ohne Node-Importe: `src/lib/einheiten/index.ts` wird auch ins
 * Client-Bundle gezogen, darum ist auch sha256 hier in reinem JS.
 */

export const DATEIEN = ['herausforderung_A', 'herausforderung_B', 'set', 'dossier'] as const
export type FassungsDatei = (typeof DATEIEN)[number]

export const SCHLUESSEL = ['nr', 'label', 'kn_kriterium', 'ref', 'id', 'tag', 'heft'] as const
export type Schluessel = (typeof SCHLUESSEL)[number]

export interface Segment {
  name: string
  /** Gesetzt, wenn das Segment ein Listenelement über seinen Schlüssel wählt. */
  wahl?: { schluessel: Schluessel; wert: string }
}

const SEGMENT = /^([a-z0-9_]+)(?:\[([a-z_]+)=([^\]]+)\])?$/

/** Zerlegt einen Pfad nach VERTRAG §1. Wirft bei jeder Abweichung von der Grammatik. */
export function parsePfad(pfad: string): Segment[] {
  if (typeof pfad !== 'string' || !pfad) throw new Error('Pfad leer')
  // Punkte innerhalb von [..] gehören zum Wert (z. B. label=01 Bedürfnisse sammeln.)
  const teile: string[] = []
  let tief = 0
  let akt = ''
  for (const ch of pfad) {
    if (ch === '[') tief++
    if (ch === ']') tief--
    if (ch === '.' && tief === 0) { teile.push(akt); akt = ''; continue }
    akt += ch
  }
  teile.push(akt)
  return teile.map((t) => {
    const m = SEGMENT.exec(t)
    if (!m) throw new Error(`Ungültiges Segment «${t}» in «${pfad}»`)
    if (!m[2]) return { name: m[1] }
    if (!(SCHLUESSEL as readonly string[]).includes(m[2])) throw new Error(`Unbekannter Schlüssel «${m[2]}» in «${pfad}»`)
    return { name: m[1], wahl: { schluessel: m[2] as Schluessel, wert: m[3] } }
  })
}

export function formatPfad(seg: Segment[]): string {
  return seg.map((s) => (s.wahl ? `${s.name}[${s.wahl.schluessel}=${s.wahl.wert}]` : s.name)).join('.')
}

function passt(el: unknown, wahl: NonNullable<Segment['wahl']>): boolean {
  if (!el || typeof el !== 'object') return false
  const v = (el as Record<string, unknown>)[wahl.schluessel]
  return v != null && String(v) === wahl.wert
}

/** Liest den Wert an `pfad`. `undefined`, wenn ein Teil fehlt oder ein Schlüssel nicht eindeutig ist. */
export function lesePfad(obj: unknown, pfad: string | Segment[]): unknown {
  const seg = typeof pfad === 'string' ? parsePfad(pfad) : pfad
  let cur: unknown = obj
  for (const s of seg) {
    if (!cur || typeof cur !== 'object' || Array.isArray(cur)) return undefined
    cur = (cur as Record<string, unknown>)[s.name]
    if (s.wahl) {
      if (!Array.isArray(cur)) return undefined
      const treffer = cur.filter((el) => passt(el, s.wahl!))
      if (treffer.length !== 1) return undefined
      cur = treffer[0]
    }
  }
  return cur
}

/**
 * Setzt `wert` an `pfad` — verändert `obj` an Ort und Stelle (Aufrufer arbeitet auf
 * einer tiefen Kopie). Legt nur das letzte Feld an, nie Zwischenobjekte oder
 * Listenelemente. Gibt `false` zurück, wenn der Pfad nicht erreichbar ist.
 */
export function setzePfad(obj: unknown, pfad: string | Segment[], wert: unknown): boolean {
  const seg = typeof pfad === 'string' ? parsePfad(pfad) : pfad
  let cur: unknown = obj
  for (let i = 0; i < seg.length; i++) {
    const s = seg[i]
    const letztes = i === seg.length - 1
    if (!cur || typeof cur !== 'object' || Array.isArray(cur)) return false
    const rec = cur as Record<string, unknown>
    if (!s.wahl) {
      if (letztes) { rec[s.name] = wert; return true }
      cur = rec[s.name]
      continue
    }
    const liste = rec[s.name]
    if (!Array.isArray(liste)) return false
    const idx = liste.map((el, j) => (passt(el, s.wahl!) ? j : -1)).filter((j) => j >= 0)
    if (idx.length !== 1) return false
    if (letztes) { liste[idx[0]] = wert; return true }
    cur = liste[idx[0]]
  }
  return false
}

/** JSON mit alphabetisch sortierten Objektschlüsseln, ohne Leerraum. `undefined` → `null`. */
export function kanonisch(v: unknown): string {
  if (v === undefined || v === null) return 'null'
  if (Array.isArray(v)) return `[${v.map((x) => (x === undefined ? 'null' : kanonisch(x))).join(',')}]`
  if (typeof v === 'object') {
    const keys = Object.keys(v as object).filter((k) => (v as Record<string, unknown>)[k] !== undefined).sort()
    return `{${keys.map((k) => `${JSON.stringify(k)}:${kanonisch((v as Record<string, unknown>)[k])}`).join(',')}}`
  }
  return JSON.stringify(v)
}

// --- sha256 (FIPS 180-4), reines JS, UTF-8 -------------------------------------------
const K = new Uint32Array([
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
])

export function sha256Hex(text: string): string {
  const daten = new TextEncoder().encode(text)
  const bitLen = daten.length * 8
  const len = ((daten.length + 9 + 63) >> 6) << 6
  const buf = new Uint8Array(len)
  buf.set(daten)
  buf[daten.length] = 0x80
  const dv = new DataView(buf.buffer)
  dv.setUint32(len - 4, bitLen >>> 0)
  dv.setUint32(len - 8, Math.floor(bitLen / 0x100000000))
  const H = new Uint32Array([0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19])
  const W = new Uint32Array(64)
  const rotr = (x: number, n: number) => (x >>> n) | (x << (32 - n))
  for (let off = 0; off < len; off += 64) {
    for (let t = 0; t < 16; t++) W[t] = dv.getUint32(off + t * 4)
    for (let t = 16; t < 64; t++) {
      const s0 = rotr(W[t - 15], 7) ^ rotr(W[t - 15], 18) ^ (W[t - 15] >>> 3)
      const s1 = rotr(W[t - 2], 17) ^ rotr(W[t - 2], 19) ^ (W[t - 2] >>> 10)
      W[t] = (W[t - 16] + s0 + W[t - 7] + s1) >>> 0
    }
    let [a, b, c, d, e, f, g, h] = H
    for (let t = 0; t < 64; t++) {
      const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25)
      const ch = (e & f) ^ (~e & g)
      const t1 = (h + S1 + ch + K[t] + W[t]) >>> 0
      const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)
      const maj = (a & b) ^ (a & c) ^ (b & c)
      const t2 = (S0 + maj) >>> 0
      h = g; g = f; f = e; e = (d + t1) >>> 0; d = c; c = b; b = a; a = (t1 + t2) >>> 0
    }
    H[0] += a; H[1] += b; H[2] += c; H[3] += d; H[4] += e; H[5] += f; H[6] += g; H[7] += h
  }
  return Array.from(H, (x) => x.toString(16).padStart(8, '0')).join('')
}

/** `original_hash` nach VERTRAG §1. */
export function wertHash(v: unknown): string {
  return `sha256:${sha256Hex(kanonisch(v))}`
}

/** `data-feld`-Wert nach VERTRAG §10. */
export function feldAttr(datei: FassungsDatei, pfad: string): string {
  return `${datei}:${pfad}`
}

export function parseFeldAttr(attr: string): { datei: FassungsDatei; pfad: string } | null {
  const i = attr.indexOf(':')
  if (i < 0) return null
  const datei = attr.slice(0, i) as FassungsDatei
  if (!(DATEIEN as readonly string[]).includes(datei)) return null
  return { datei, pfad: attr.slice(i + 1) }
}
