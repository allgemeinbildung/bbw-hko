/**
 * Erzeugt die Schriften der Einheiten-Dokumente — eine Quelle für drei Wege:
 *
 *   public/einheiten-assets/fonts/*.woff2   Schnitte als Dateien (online, bbw-hko.ch)
 *   public/einheiten-assets/fonts.css       @font-face mit URL auf diese Dateien
 *   public/einheiten-assets/fonts-embed.css dieselben @font-face base64-eingebettet
 *                                           (heruntergeladene HTML-Dateien, offline)
 *
 * Warum so vollständig (Rückmeldung EBA-Gold, 03.11.2026): Fehlt ein Schnitt oder ein
 * Zeichen, nimmt der Browser eine Systemschrift — auf jedem Rechner eine andere. Im PDF
 * eines Lehrers waren so die kursiven Hinweise (Segoe UI Italic) unlesbar. Darum:
 *
 *   IBM Plex Sans   400–700 normal, 400/700 kursiv · latin + latin-ext + Satzzeichen,
 *                   Pfeile, Mathe-Zeichen (was Plex hat)
 *   IBM Plex Mono   400–600 normal, 400 kursiv
 *   HKO Symbole     Untermenge von DejaVu Sans: ☐ ✔ ● ◐ ★ ⚠ … — die Zeichen, die Plex
 *                   nicht hat. Steht in jedem font-family-Stapel direkt hinter Plex.
 *   HKO Hand        Kalam 400/700 — Handschrift der Beispielbilder (statt Segoe Print,
 *                   das es nur unter Windows gibt).
 *
 * Prüfen, ob noch etwas auf Systemschriften fällt: node scripts/check-schriften.mjs <exportdir>
 *
 * Quellen (fest versioniert, jsDelivr): @ibm/plex-sans@1.1.0, @ibm/plex-mono@1.1.0
 * (SIL OFL 1.1) · dejavu-fonts-ttf@2.37.3 (Bitstream-Vera-Lizenz + Public Domain,
 * Einbetten und Untermengen erlaubt) · @fontsource/kalam@5.3.0 (SIL OFL 1.1).
 * Untermengen mit Python fontTools (pip install fonttools brotli).
 *
 *   node scripts/build-fonts-embed.mjs
 */
import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const ASSETS = resolve(ROOT, 'public/einheiten-assets')
const FONTDIR = join(ASSETS, 'fonts')
const CACHE = join(tmpdir(), 'bbw-hko-fonts-quelle')
const CDN = 'https://cdn.jsdelivr.net/npm'

const TEXT = [
  'U+0020-007E', 'U+00A0-024F', 'U+0259', 'U+02BB-02BC', 'U+02C6-02DD', 'U+0300-0308', 'U+0327',
  'U+2000-206F', 'U+2070-209F', 'U+20A0-20CF', 'U+2100-214F',
  'U+2190-21FF', 'U+2200-22FF', 'U+25CA', 'U+FB01-FB02', 'U+FEFF', 'U+FFFD',
].join(',')
const SYMBOLE = [
  'U+2190-21FF', 'U+2200-22FF', 'U+25A0-25FF', 'U+2600-26FF', 'U+2700-27BF', 'U+2B00-2B2F',
].join(',')

const sans = (w, it) => `@ibm/plex-sans@1.1.0/fonts/complete/woff2/IBMPlexSans-${w}${it ? 'Italic' : ''}.woff2`.replace('RegularItalic', 'Italic')
const mono = (w, it) => `@ibm/plex-mono@1.1.0/fonts/complete/woff2/IBMPlexMono-${w}${it ? 'Italic' : ''}.woff2`.replace('RegularItalic', 'Italic')
const GEWICHT = { 400: 'Regular', 500: 'Medium', 600: 'SemiBold', 700: 'Bold' }

/** Reihenfolge = Reihenfolge in der CSS. `unicodes` = Untermenge; die Schrift behält nur, was sie hat. */
const FACES = [
  // Kursiv nur 400 und 700: für 500/600 kursiv wählt der Browser den nächsten eingebetteten
  // Schnitt (700 kursiv) — nie eine Systemschrift. Spart gut 50 KB je Dokument.
  ...[400, 500, 600, 700].map((w) => ({ family: 'IBM Plex Sans', weight: w, style: 'normal', quelle: sans(GEWICHT[w], false), unicodes: TEXT })),
  ...[400, 700].map((w) => ({ family: 'IBM Plex Sans', weight: w, style: 'italic', quelle: sans(GEWICHT[w], true), unicodes: TEXT })),
  ...[400, 500, 600].map((w) => ({ family: 'IBM Plex Mono', weight: w, style: 'normal', quelle: mono(GEWICHT[w], false), unicodes: TEXT })),
  { family: 'IBM Plex Mono', weight: 400, style: 'italic', quelle: mono('Regular', true), unicodes: TEXT },
  { family: 'HKO Symbole', weight: '100 900', style: 'normal', quelle: 'dejavu-fonts-ttf@2.37.3/ttf/DejaVuSans.ttf', unicodes: SYMBOLE },
  ...[400, 700].flatMap((w) => ['latin', 'latin-ext'].map((sub) => ({
    family: 'HKO Hand', weight: w, style: 'normal', quelle: `@fontsource/kalam@5.3.0/files/kalam-${sub}-${w}-normal.woff2`, unicodes: TEXT,
  }))),
]

function dateiname(f) {
  const basis = f.quelle.split('/').pop().replace(/\.(woff2|ttf)$/, '')
  return `${basis}.woff2`
}

async function holen(pfad) {
  const ziel = join(CACHE, pfad.replace(/[@/]/g, '_'))
  if (!existsSync(ziel)) {
    const res = await fetch(`${CDN}/${pfad}`)
    if (!res.ok) throw new Error(`${pfad}: HTTP ${res.status}`)
    await writeFile(ziel, Buffer.from(await res.arrayBuffer()))
  }
  return ziel
}

const PY = process.env.PYTHON || (process.platform === 'win32' ? 'py' : 'python3')
function untermenge(ein, aus, unicodes) {
  const args = process.platform === 'win32' && PY === 'py' ? ['-3', '-m', 'fontTools.subset'] : ['-m', 'fontTools.subset']
  execFileSync(PY, [...args, ein, `--output-file=${aus}`, '--flavor=woff2', `--unicodes=${unicodes}`,
    '--layout-features=*', '--no-hinting', '--desubroutinize', '--name-IDs=*', '--name-legacy', '--name-languages=*'],
  { stdio: ['ignore', 'ignore', 'inherit'] })
}

await mkdir(CACHE, { recursive: true })
await rm(FONTDIR, { recursive: true, force: true })
await mkdir(FONTDIR, { recursive: true })

const fertig = []
for (const f of FACES) {
  const ein = await holen(f.quelle)
  const name = dateiname(f)
  const aus = join(FONTDIR, name)
  untermenge(ein, aus, f.unicodes)
  const buf = await readFile(aus)
  if (buf.subarray(0, 4).toString('ascii') !== 'wOF2') throw new Error(`${name}: keine woff2-Datei`)
  // Kalam kommt in zwei Teilen (latin, latin-ext): die Grenze als unicode-range, damit
  // der Browser beide Teile zu einer Schrift zusammensetzt.
  const range = f.family === 'HKO Hand'
    ? (name.includes('latin-ext') ? 'U+0100-024F,U+1E00-1EFF,U+20A0-20CF,U+2113,U+2C60-2C7F,U+A720-A7FF' : 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2212')
    : null
  // Kalam ist schmaler als Segoe Print, für das alle Beispielbilder gemessen sind. size-adjust
  // gleicht die Laufweite an (Mittel über die Texte aller v4.2-Hefte, 03.11.2026): gleiche
  // Zeilenumbrüche, die Messungen von Seite 6 bleiben gültig.
  const adjust = f.family === 'HKO Hand' ? (f.weight === 700 ? '111.6%' : '116.4%') : null
  fertig.push({ ...f, name, range, adjust, bytes: buf.length, b64: buf.toString('base64') })
  console.log(`  ${name.padEnd(38)} ${(buf.length / 1024).toFixed(1).padStart(6)} KB`)
}

const kopf = (art) => [
  `/* GENERIERT — nicht von Hand bearbeiten. Neu erzeugen: npm run build:fonts-embed`,
  `   ${art}. IBM Plex Sans/Mono (SIL OFL 1.1), HKO Symbole = Untermenge DejaVu Sans`,
  `   (Bitstream-Vera-Lizenz), HKO Hand = Kalam (SIL OFL 1.1). Siehe scripts/build-fonts-embed.mjs */`,
]
const face = (f, src) =>
  `@font-face{font-family:'${f.family}';font-style:${f.style};font-weight:${f.weight};font-display:swap;` +
  `src:${src} format('woff2');${f.range ? `unicode-range:${f.range};` : ''}${f.adjust ? `size-adjust:${f.adjust};` : ''}}`

const embed = [...kopf('Base64-eingebettet für heruntergeladene Dokumente'),
  ...fertig.map((f) => face(f, `url(data:font/woff2;base64,${f.b64})`)), ''].join('\n')
const online = [...kopf('Online: Dateien unter /einheiten-assets/fonts/'),
  ...fertig.map((f) => face(f, `url('/einheiten-assets/fonts/${f.name}')`)), ''].join('\n')

await writeFile(join(ASSETS, 'fonts-embed.css'), embed, 'utf8')
await writeFile(join(ASSETS, 'fonts.css'), online, 'utf8')

const binaer = fertig.reduce((n, f) => n + f.bytes, 0)
console.log(`\n${fertig.length} Schnitte · ${(binaer / 1024).toFixed(1)} KB binär → fonts-embed.css ${(embed.length / 1024).toFixed(1)} KB`)
