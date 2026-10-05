/**
 * QR-Baustein für das Heft v4.2 — Pflichtquelle der Medien-Spur auf Seite 1.
 *
 * Eine Matrix, zwei Ausgaben: SVG für das HTML-Heft, PNG-Bytes für das Word-Dokument
 * (`ImageRun`). Läuft unverändert im Browser (Workbench baut Word clientseitig), im
 * Astro-SSR und in Node; alles synchron, weil das HTML über `renderToStaticMarkup` entsteht.
 *
 * Aus dem Paket `qrcode` wird nur der Kern (`lib/core/qrcode.js`) importiert — der
 * Paket-Einstieg zöge je nach Umgebung den Canvas- oder den Node-Renderer (pngjs, fs) mit.
 * Das PNG ist deshalb selbst kodiert: unkomprimierte «stored»-Blöcke, CRC32 und Adler32
 * von Hand. Kein Canvas, kein `zlib`, kein `Buffer`.
 *
 * Der Inhalt ist exakt der übergebene Text. Die Landing-URL ist nach dem ersten Druck
 * nicht mehr änderbar (ENTSCHEIDE E5) — `LANDING_BASIS` deshalb nie «aufräumen».
 */
// @ts-ignore — das Paket liefert keine Typen; die benutzte Form steht in `QrKern`.
import qrcodeKern from 'qrcode/lib/core/qrcode.js'

interface QrKern {
  create(
    text: string,
    opts?: { errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H' },
  ): { modules: { size: number; data: Uint8Array } }
}

const kern = qrcodeKern as QrKern

export const LANDING_BASIS = 'https://bbw-hko.ch/m/'

/** `https://bbw-hko.ch/m/<setKey>`, mit Buchstabe zusätzlich `#a` / `#b`. */
export function landingUrl(setKey: string, buchstabe?: 'A' | 'B' | string): string {
  const anker = buchstabe ? `#${buchstabe.toLowerCase()}` : ''
  return `${LANDING_BASIS}${setKey}${anker}`
}

/** Module zeilenweise, `true` = dunkel. Ohne Ruhezone, Fehlerkorrektur M. */
export function qrMatrix(text: string): boolean[][] {
  const { size, data } = kern.create(text, { errorCorrectionLevel: 'M' }).modules
  const zeilen: boolean[][] = []
  for (let y = 0; y < size; y++) {
    const zeile: boolean[] = []
    for (let x = 0; x < size; x++) zeile.push(data[y * size + x] === 1)
    zeilen.push(zeile)
  }
  return zeilen
}

/**
 * Vollständiges `<svg>` ohne Breite/Höhe — die Grösse setzt das umgebende CSS.
 * Ein `<path>` für alle dunklen Module (zeilenweise Läufe), weisser Grund darunter.
 */
export function qrSvg(text: string, opts: { ruhezone?: number } = {}): string {
  const rz = opts.ruhezone ?? 4
  const m = qrMatrix(text)
  const n = m.length
  const seite = n + 2 * rz
  let d = ''
  for (let y = 0; y < n; y++) {
    let x = 0
    while (x < n) {
      if (!m[y][x]) { x++; continue }
      const start = x
      while (x < n && m[y][x]) x++
      d += `M${start + rz} ${y + rz}h${x - start}v1h-${x - start}z`
    }
  }
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${seite} ${seite}" shape-rendering="crispEdges">` +
    `<rect width="${seite}" height="${seite}" fill="#fff"/>` +
    `<path d="${d}" fill="#000"/>` +
    `</svg>`
  )
}

/**
 * PNG, Graustufen 8 Bit. `modulPx` 8 ergibt für die Landing-URL (Version 4, 33 Module
 * + Ruhezone) 328 px — auf 25 mm Druckbreite rund 330 dpi.
 */
export function qrPng(text: string, opts: { modulPx?: number; ruhezone?: number } = {}): Uint8Array {
  const px = Math.max(1, Math.floor(opts.modulPx ?? 8))
  const rz = opts.ruhezone ?? 4
  const m = qrMatrix(text)
  const n = m.length
  const breite = (n + 2 * rz) * px

  // Rohdaten: je Zeile ein Filterbyte (0 = keiner), dann ein Byte pro Pixel.
  const zeilenLaenge = breite + 1
  const roh = new Uint8Array(zeilenLaenge * breite)
  for (let py = 0; py < breite; py++) {
    const my = Math.floor(py / px) - rz
    const o = py * zeilenLaenge
    roh[o] = 0
    for (let pxX = 0; pxX < breite; pxX++) {
      const mx = Math.floor(pxX / px) - rz
      const dunkel = my >= 0 && my < n && mx >= 0 && mx < n && m[my][mx]
      roh[o + 1 + pxX] = dunkel ? 0x00 : 0xff
    }
  }

  const ihdr = new Uint8Array(13)
  schreibeU32(ihdr, 0, breite)
  schreibeU32(ihdr, 4, breite)
  ihdr[8] = 8 // Bittiefe
  ihdr[9] = 0 // Farbtyp Graustufen
  ihdr[10] = 0 // Kompression deflate
  ihdr[11] = 0 // Filtermethode
  ihdr[12] = 0 // kein Interlace

  return verbinde([
    new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlibStored(roh)),
    chunk('IEND', new Uint8Array(0)),
  ])
}

// ── PNG-Handwerk ────────────────────────────────────────────────────────────

/** zlib-Strom aus unkomprimierten Blöcken (je höchstens 65 535 Bytes). */
function zlibStored(daten: Uint8Array): Uint8Array {
  const BLOCK = 0xffff
  const anzahl = Math.max(1, Math.ceil(daten.length / BLOCK))
  const out = new Uint8Array(2 + anzahl * 5 + daten.length + 4)
  out[0] = 0x78 // CMF: deflate, 32-KB-Fenster
  out[1] = 0x01 // FLG: (0x78 << 8 | 0x01) % 31 === 0
  let o = 2
  for (let i = 0; i < anzahl; i++) {
    const teil = daten.subarray(i * BLOCK, Math.min(daten.length, (i + 1) * BLOCK))
    const len = teil.length
    out[o++] = i === anzahl - 1 ? 1 : 0 // BFINAL, BTYPE 00
    out[o++] = len & 0xff
    out[o++] = len >>> 8
    out[o++] = ~len & 0xff
    out[o++] = (~len >>> 8) & 0xff
    out.set(teil, o)
    o += len
  }
  schreibeU32(out, o, adler32(daten))
  return out
}

function chunk(typ: string, daten: Uint8Array): Uint8Array {
  const out = new Uint8Array(12 + daten.length)
  schreibeU32(out, 0, daten.length)
  for (let i = 0; i < 4; i++) out[4 + i] = typ.charCodeAt(i)
  out.set(daten, 8)
  schreibeU32(out, 8 + daten.length, crc32(out.subarray(4, 8 + daten.length)))
  return out
}

let CRC_TABELLE: Uint32Array | null = null

function crc32(daten: Uint8Array): number {
  if (!CRC_TABELLE) {
    CRC_TABELLE = new Uint32Array(256)
    for (let n = 0; n < 256; n++) {
      let c = n
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
      CRC_TABELLE[n] = c >>> 0
    }
  }
  let crc = 0xffffffff
  for (let i = 0; i < daten.length; i++) crc = CRC_TABELLE[(crc ^ daten[i]) & 0xff] ^ (crc >>> 8)
  return (crc ^ 0xffffffff) >>> 0
}

function adler32(daten: Uint8Array): number {
  let a = 1
  let b = 0
  // Modulo nur alle 5552 Bytes (zlib-Grenze) — bis dahin bleibt b sicher im Ganzzahlbereich.
  for (let i = 0; i < daten.length; ) {
    const ende = Math.min(daten.length, i + 5552)
    for (; i < ende; i++) {
      a += daten[i]
      b += a
    }
    a %= 65521
    b %= 65521
  }
  return ((b << 16) | a) >>> 0
}

function schreibeU32(ziel: Uint8Array, o: number, wert: number): void {
  ziel[o] = (wert >>> 24) & 0xff
  ziel[o + 1] = (wert >>> 16) & 0xff
  ziel[o + 2] = (wert >>> 8) & 0xff
  ziel[o + 3] = wert & 0xff
}

function verbinde(teile: Uint8Array[]): Uint8Array {
  const out = new Uint8Array(teile.reduce((s, t) => s + t.length, 0))
  let o = 0
  for (const t of teile) {
    out.set(t, o)
    o += t.length
  }
  return out
}
