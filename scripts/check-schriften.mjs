#!/usr/bin/env node
// check-schriften.mjs — prüft, dass jedes gedruckte Zeichen aus einer eingebetteten Schrift kommt.
//
//   node scripts/check-schriften.mjs <dir>
//
// Die heruntergeladenen HTML-Dateien werden auf fremden Rechnern geöffnet und dort gedruckt.
// Fehlt einer eingebetteten Schrift ein Zeichen oder ein Schnitt (z. B. kursiv), nimmt der
// Browser eine Systemschrift — auf jedem Rechner eine andere. Im PDF kann das als
// unlesbarer Text enden (Rückmeldung EBA-Gold, 03.11.2026: kursive Hinweise «verschwommen»).
//
// Je `*.html` in <dir>: im Browser öffnen, für jedes Element mit eigenem Text über das
// DevTools-Protokoll abfragen, welche Schrift tatsächlich zeichnet (CSS.getPlatformFontsForNode).
// Erlaubt sind nur eingebettete Webfonts (isCustomFont). Alles andere wird mit Zeichen gemeldet.
// Online-Weg: SCHRIFTEN_URL=http://127.0.0.1:8899 node scripts/check-schriften.mjs <dir>
// (dir = die Dateien, die unter dieser URL liegen).
// Exit 0 = alles eingebettet · 1 = Systemschrift im Spiel · 2 = Messung unmöglich.

import { createRequire } from 'node:module'
import { existsSync, readdirSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const dir = process.argv[2] ? resolve(process.argv[2]) : null
if (!dir || !existsSync(dir)) {
  console.error('usage: node scripts/check-schriften.mjs <dir>')
  process.exit(2)
}

const require = createRequire(import.meta.url)
let chromium
try { ({ chromium } = require('playwright')) } catch {
  console.error('playwright fehlt (npm i -D playwright)')
  process.exit(2)
}

function findeBrowser() {
  const env = process.env
  return [
    env.CHROME_PATH,
    join(env.PROGRAMFILES || 'C:\\Program Files', 'Google', 'Chrome', 'Application', 'chrome.exe'),
    join(env['PROGRAMFILES(X86)'] || 'C:\\Program Files (x86)', 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
  ].find((p) => p && existsSync(p))
}

const dateien = readdirSync(dir).filter((f) => f.endsWith('.html')).sort()
if (!dateien.length) { console.error(`keine .html in ${dir}`); process.exit(2) }

const browser = await chromium.launch({ executablePath: findeBrowser() })
let fehler = 0
try {
  for (const datei of dateien) {
    const page = await browser.newPage()
    // SCHRIFTEN_URL=http://…: die Dateien von dort laden (Online-Weg prüfen: Seite und
    // /einheiten-assets/fonts.css vom selben Ursprung, wie auf bbw-hko.ch).
    const basis = process.env.SCHRIFTEN_URL
    await page.goto(basis ? `${basis.replace(/\/$/, '')}/${encodeURIComponent(datei)}` : pathToFileURL(join(dir, datei)).href)
    await page.waitForLoadState('networkidle')
    await page.evaluate(async () => { try { await document.fonts.ready } catch {} })
    await page.emulateMedia({ media: 'print' })
    // Jedes Element mit eigenem, nicht leerem Text markieren.
    const anzahl = await page.evaluate(() => {
      let n = 0
      for (const el of document.body.querySelectorAll('*')) {
        if (el.closest('script,style,.standalone-bar,.hko-panel,[hidden]')) continue
        const eigen = [...el.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim())
        const ph = (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') && el.placeholder
        if (eigen || ph) el.setAttribute('data-sk', String(n++))
      }
      return n
    })
    const cdp = await page.context().newCDPSession(page)
    await cdp.send('DOM.enable'); await cdp.send('CSS.enable')
    const { root } = await cdp.send('DOM.getDocument', { depth: -1 })
    const { nodeIds } = await cdp.send('DOM.querySelectorAll', { nodeId: root.nodeId, selector: '[data-sk]' })
    const fremd = new Map() // Schrift -> Set(Zeichen)
    for (const nodeId of nodeIds) {
      const { fonts } = await cdp.send('CSS.getPlatformFontsForNode', { nodeId })
      const sys = fonts.filter((f) => !f.isCustomFont)
      if (!sys.length) continue
      // Welche Zeichen? Einzeln in einer Kopie mit gleichem Stil messen.
      const { attributes } = await cdp.send('DOM.getAttributes', { nodeId })
      const sk = attributes[attributes.indexOf('data-sk') + 1]
      const zeichen = await page.evaluate((sk) => {
        const el = document.querySelector(`[data-sk="${sk}"]`)
        const text = [...el.childNodes].filter((c) => c.nodeType === 3).map((c) => c.textContent).join('') || el.placeholder || ''
        // Farb-Emoji (📖 vor Quellen im EBA-Dossier) zeichnet jedes System selbst — ausgenommen.
        return [...new Set([...text].filter((c) => c.trim() && !/\p{Extended_Pictographic}|️/u.test(c)))]
      }, sk)
      const verdaechtig = []
      for (const z of zeichen) {
        await page.evaluate(({ sk, z }) => {
          const el = document.querySelector(`[data-sk="${sk}"]`)
          let p = document.getElementById('sk-probe')
          if (!p) { p = document.createElement('span'); p.id = 'sk-probe' }
          el.append(p); p.textContent = z
        }, { sk, z })
        const { nodeIds: [pid] } = await cdp.send('DOM.querySelectorAll', {
          nodeId: root.nodeId, selector: '#sk-probe' })
        const r = await cdp.send('CSS.getPlatformFontsForNode', { nodeId: pid })
        const s = r.fonts.filter((f) => !f.isCustomFont)
        if (s.length) verdaechtig.push([z, s.map((f) => f.familyName).join('/')])
      }
      await page.evaluate(() => document.getElementById('sk-probe')?.remove())
      const stil = await page.evaluate((sk) => {
        const cs = getComputedStyle(document.querySelector(`[data-sk="${sk}"]`))
        return `${cs.fontFamily.split(',')[0]} ${cs.fontStyle} ${cs.fontWeight}`
      }, sk)
      // Kein Einzelzeichen fällt: dann zeichnete die Systemschrift nur ausgenommene Zeichen (Emoji)
      // oder ein Zeichen aus einem Kindelement, das selbst geprüft wird.
      if (!verdaechtig.length) continue
      const liste = verdaechtig
      for (const [z, schrift] of liste) {
        const key = `${schrift} für «${stil}»`
        if (!fremd.has(key)) fremd.set(key, new Set())
        fremd.get(key).add(z)
      }
    }
    if (fremd.size) {
      fehler++
      console.log(`✗ ${datei} (${anzahl} Textelemente)`)
      for (const [k, z] of fremd) console.log(`    ${k}: ${[...z].map((c) => c.length === 1 ? `${c} U+${c.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')}` : c).join(' · ')}`)
    } else {
      console.log(`✓ ${datei} (${anzahl} Textelemente, nur eingebettete Schriften)`)
    }
    await page.close()
  }
} finally { await browser.close() }
process.exit(fehler ? 1 : 0)
