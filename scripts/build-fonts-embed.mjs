/**
 * Erzeugt public/einheiten-assets/fonts-embed.css — IBM Plex Sans + Mono als
 * base64-Data-URIs, damit die heruntergeladenen Einheiten-HTMLs offline exakt
 * gleich aussehen wie online (mm-genaue A4-Seiten reagieren empfindlich auf
 * Font-Metriken; ohne Embedding fällt der Browser auf Systemschrift zurück und
 * die Umbrüche verschieben sich).
 *
 * Quelle: @fontsource/ibm-plex-{sans,mono} v5 über jsDelivr — statische
 * Einzelgewichte, nicht die Variable-Font-Variante von Google Fonts (die liefert
 * für alle Gewichte dieselbe URL und ist damit nicht deterministisch einbettbar).
 * Lizenz: SIL Open Font License 1.1 (Embedding ausdrücklich erlaubt).
 *
 * Nur der `latin`-Subset: Deutsch/Französisch/Italienisch sind vollständig
 * abgedeckt. Zeichen ausserhalb (z. B. osteuropäische Namen in Schreibfeldern)
 * fallen sauber auf die Systemschrift zurück — das kostet 0 KB statt +136 KB
 * für latin-ext pro Dokument.
 *
 *   node scripts/build-fonts-embed.mjs
 */
import { writeFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = resolve(ROOT, 'public/einheiten-assets/fonts-embed.css')

/** Muss mit dem <link>-Fallback in src/lib/einheiten/standalone-shell.ts übereinstimmen. */
const FACES = [
  { family: 'IBM Plex Sans', pkg: 'ibm-plex-sans', weight: 400 },
  { family: 'IBM Plex Sans', pkg: 'ibm-plex-sans', weight: 500 },
  { family: 'IBM Plex Sans', pkg: 'ibm-plex-sans', weight: 600 },
  { family: 'IBM Plex Sans', pkg: 'ibm-plex-sans', weight: 700 },
  { family: 'IBM Plex Mono', pkg: 'ibm-plex-mono', weight: 400 },
  { family: 'IBM Plex Mono', pkg: 'ibm-plex-mono', weight: 500 },
  { family: 'IBM Plex Mono', pkg: 'ibm-plex-mono', weight: 600 },
]

const WOFF2_SIG = 'wOF2'

async function fetchFace(face) {
  const file = `${face.pkg}-latin-${face.weight}-normal.woff2`
  const url = `https://cdn.jsdelivr.net/npm/@fontsource/${face.pkg}@5/files/${file}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${file}: HTTP ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  if (buf.subarray(0, 4).toString('ascii') !== WOFF2_SIG) {
    throw new Error(`${file}: keine gültige woff2-Datei (Signatur ${buf.subarray(0, 4).toString('ascii')})`)
  }
  return { ...face, file, bytes: buf.length, b64: buf.toString('base64') }
}

const results = []
for (const face of FACES) {
  const r = await fetchFace(face)
  results.push(r)
  console.log(`  ${r.file.padEnd(38)} ${(r.bytes / 1024).toFixed(1).padStart(6)} KB`)
}

const css = [
  '/* GENERIERT — nicht von Hand bearbeiten. Neu erzeugen: npm run build:fonts-embed',
  '   IBM Plex Sans + IBM Plex Mono, latin-Subset, base64-eingebettet.',
  '   Quelle: @fontsource/ibm-plex-{sans,mono} v5 · SIL Open Font License 1.1 */',
  ...results.map((r) =>
    `@font-face{font-family:'${r.family}';font-style:normal;font-weight:${r.weight};` +
    `font-display:swap;src:url(data:font/woff2;base64,${r.b64}) format('woff2');}`,
  ),
  '',
].join('\n')

await mkdir(dirname(OUT), { recursive: true })
await writeFile(OUT, css, 'utf8')

const binary = results.reduce((n, r) => n + r.bytes, 0)
console.log(
  `\n${results.length} Schnitte · ${(binary / 1024).toFixed(1)} KB binär ` +
  `→ ${(css.length / 1024).toFixed(1)} KB CSS\n${OUT}`,
)
