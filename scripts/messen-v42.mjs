#!/usr/bin/env node
// messen-v42.mjs — misst den Überlauf jeder A4-Seite in einem echten Browser.
//
//   node scripts/messen-v42.mjs <dir>
//
// `.a4-page` und `.a4-page-body` haben `overflow: hidden`: was nicht passt, wird
// lautlos abgeschnitten, im Browser wie im Druck. Dieses Skript macht es sichtbar.
// Je `*.html` in <dir>: Wegwerfkopie mit angehängtem Mess-Skript (im Temp, das
// Original bleibt unberührt) → Chrome/Edge headless `--dump-dom` → JSON aus dem DOM.
//
// Überlauf, wenn auf einer Seite eines davon gilt (Toleranz 1 px):
//   - `.a4-page` oder `.a4-page-body`: scrollHeight > clientHeight
//   - das tiefste sichtbare Element im Seitenkörper ragt unter dessen Unterkante
// Exit 0 = alles passt · 1 = mindestens eine Seite läuft über · 2 = Messung unmöglich.
// Browser: CHROME_PATH, sonst Chrome oder Edge unter den üblichen Windows-Pfaden.

import { spawn, spawnSync } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const ZEITGRENZE_MS = 60_000
const TOLERANZ_PX = 1

const dir = process.argv[2] ? resolve(process.argv[2]) : null
if (!dir || !existsSync(dir)) {
  console.error('usage: node scripts/messen-v42.mjs <dir>')
  process.exit(2)
}

function findeBrowser() {
  const env = process.env
  const kandidaten = [
    env.CHROME_PATH,
    join(env.PROGRAMFILES || 'C:\\Program Files', 'Google', 'Chrome', 'Application', 'chrome.exe'),
    join(env['PROGRAMFILES(X86)'] || 'C:\\Program Files (x86)', 'Google', 'Chrome', 'Application', 'chrome.exe'),
    env.LOCALAPPDATA && join(env.LOCALAPPDATA, 'Google', 'Chrome', 'Application', 'chrome.exe'),
    join(env['PROGRAMFILES(X86)'] || 'C:\\Program Files (x86)', 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
    join(env.PROGRAMFILES || 'C:\\Program Files', 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
  ]
  return kandidaten.find((p) => p && existsSync(p)) ?? null
}

// Läuft im Browser. Wartet auf die Schriften (eingebettet, aber asynchron dekodiert)
// und eine kurze Pause, dann je Seite die Masse als JSON in <pre id="v42-messung">.
const MESS_SKRIPT = `
<script>
(async () => {
  try { await document.fonts.ready } catch (e) {}
  // Kein requestAnimationFrame: unter --virtual-time-budget kommt bei grossen Seiten
  // kein Frame mehr, bevor das DOM ausgegeben wird. Das Layout erzwingt ohnehin
  // getBoundingClientRect; die Pause lässt nur späte Skripte der Shell durchlaufen.
  await new Promise((r) => setTimeout(r, 100))
  const seiten = [...document.querySelectorAll('.a4-page')].map((pg, i) => {
    const body = pg.querySelector('.a4-page-body')
    const m = { seite: i + 1, page: { scroll: pg.scrollHeight, client: pg.clientHeight }, body: null, unterkante: null, tiefstes: null }
    if (body) {
      m.body = { scroll: body.scrollHeight, client: body.clientHeight }
      const unten = body.getBoundingClientRect().bottom
      let tief = -Infinity, wer = null
      for (const el of body.querySelectorAll('*')) {
        const cs = getComputedStyle(el)
        if (cs.display === 'none' || cs.visibility === 'hidden') continue
        const r = el.getBoundingClientRect()
        if (r.width === 0 && r.height === 0) continue
        if (r.bottom > tief) { tief = r.bottom; wer = el }
      }
      if (wer) {
        m.unterkante = Math.round((tief - unten) * 10) / 10
        m.tiefstes = wer.tagName.toLowerCase() + (wer.className && typeof wer.className === 'string' ? '.' + wer.className.trim().split(/\\s+/).join('.') : '')
      }
    }
    return m
  })
  const pre = document.createElement('pre')
  pre.id = 'v42-messung'
  pre.textContent = JSON.stringify(seiten)
  document.body.appendChild(pre)
})()
</script>`

/** Beendet den Browser samt Kindprozessen — nur diesen Baum, nie andere Chrome-Fenster. */
function beende(kind) {
  if (kind.exitCode !== null) return
  if (process.platform === 'win32') spawnSync('taskkill', ['/PID', String(kind.pid), '/T', '/F'], { stdio: 'ignore' })
  else kind.kill('SIGKILL')
}

/** Startet den Browser auf die Datei und liefert das JSON, sobald es im DOM steht. */
function miss(browser, datei, profil) {
  return new Promise((done) => {
    const kind = spawn(browser, [
      '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
      '--disable-extensions', `--user-data-dir=${profil}`, '--window-size=1200,1700',
      '--virtual-time-budget=15000', '--dump-dom', pathToFileURL(datei).href,
    ], { stdio: ['ignore', 'pipe', 'ignore'], windowsHide: true })
    let aus = ''
    let fertig = false
    const ende = (ergebnis) => {
      if (fertig) return
      fertig = true
      clearTimeout(uhr)
      beende(kind)
      done(ergebnis)
    }
    const lies = () => {
      const m = /<pre id="v42-messung">([\s\S]*?)<\/pre>/.exec(aus)
      if (m) {
        const json = m[1].replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
        try { ende({ seiten: JSON.parse(json) }) } catch (e) { ende({ fehler: `JSON unlesbar: ${e.message}` }) }
      }
    }
    // Kein Schluss aus «</html>» im Strom: das Laufzeit-Skript der Shell enthält den
    // String selbst. Massgebend sind nur die Messung, das Prozessende und die Zeitgrenze.
    kind.stdout.setEncoding('utf8')
    kind.stdout.on('data', (s) => { aus += s; lies() })
    kind.on('close', () => { lies(); ende({ fehler: 'DOM ohne Messung (Skript lief nicht zu Ende — Budget zu knapp?)' }) })
    kind.on('error', (e) => ende({ fehler: `Browser startet nicht: ${e.message}` }))
    const uhr = setTimeout(() => ende({ fehler: `Zeitgrenze ${ZEITGRENZE_MS / 1000} s überschritten` }), ZEITGRENZE_MS)
  })
}

function bewerte(s) {
  const gruende = []
  if (s.page.scroll > s.page.client + TOLERANZ_PX) gruende.push(`Seite ${s.page.scroll}>${s.page.client} px`)
  if (s.body && s.body.scroll > s.body.client + TOLERANZ_PX) gruende.push(`Körper ${s.body.scroll}>${s.body.client} px`)
  if (s.unterkante !== null && s.unterkante > TOLERANZ_PX) gruende.push(`${s.tiefstes} ragt ${s.unterkante} px hinaus`)
  if (!s.body) gruende.push('kein .a4-page-body')
  return gruende
}

const browser = findeBrowser()
if (!browser) {
  console.error('Weder Chrome noch Edge gefunden — CHROME_PATH setzen.')
  process.exit(2)
}
const dateien = readdirSync(dir).filter((f) => f.toLowerCase().endsWith('.html')).sort()
if (!dateien.length) {
  console.error(`Keine *.html in ${dir}`)
  process.exit(2)
}

const temp = mkdtempSync(join(tmpdir(), 'bbw-hko-messen-'))
const zeilen = []
let ueberlauf = false
let messfehler = false
try {
  for (const [n, f] of dateien.entries()) {
    const html = readFileSync(join(dir, f), 'utf8')
    const kopie = join(temp, f)
    const bodyEnde = html.lastIndexOf('</body>')
    writeFileSync(kopie, bodyEnde < 0 ? html + MESS_SKRIPT : html.slice(0, bodyEnde) + MESS_SKRIPT + '\n' + html.slice(bodyEnde), 'utf8')
    const r = await miss(browser, kopie, join(temp, `profil-${n}`))
    if (r.fehler) {
      messfehler = true
      zeilen.push([f, '–', `FEHLER: ${r.fehler}`])
      continue
    }
    zeilen.push([f, `${r.seiten.length} Seiten`, r.seiten.length ? '' : 'keine .a4-page'])
    for (const s of r.seiten) {
      const g = bewerte(s)
      if (g.length) ueberlauf = true
      zeilen.push(['', String(s.seite), g.length ? `ÜBERLAUF: ${g.join(' · ')}` : `ok (Reserve ${s.unterkante === null ? '–' : -s.unterkante} px)`])
    }
  }
} finally {
  try { rmSync(temp, { recursive: true, force: true, maxRetries: 5, retryDelay: 300 }) } catch { /* Profil evtl. noch gesperrt — bleibt im Temp */ }
}

const breite = [0, 1].map((i) => Math.max(...zeilen.map((z) => z[i].length), i ? 5 : 5))
console.log(`${'Datei'.padEnd(breite[0])}  ${'Seite'.padEnd(breite[1])}  Ergebnis`)
for (const z of zeilen) console.log(`${z[0].padEnd(breite[0])}  ${z[1].padEnd(breite[1])}  ${z[2]}`)
process.exit(messfehler ? 2 : ueberlauf ? 1 : 0)
