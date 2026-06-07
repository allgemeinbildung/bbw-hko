// Browser-based login → Playwright storageState (auth.json)
// Navigates to /login, fills credentials, waits for redirect, saves cookies.
import { chromium } from 'playwright'
import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const [,, email, password, ...rest] = process.argv
const outIdx = rest.indexOf('--out')
const outPath = outIdx >= 0 ? rest[outIdx + 1] : '../auth.json'
const BASE = 'http://localhost:4321'

const browser = await chromium.launch({ headless: false, slowMo: 200 })
const ctx = await browser.newContext({ ignoreHTTPSErrors: true })
const page = await ctx.newPage()

console.log('Navigating to /login …')
await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' })

// Fill credentials
await page.fill('input[type="email"], input[name="email"]', email)
await page.fill('input[type="password"], input[name="password"]', password)
await page.click('button[type="submit"]')

// Wait for redirect away from /login
console.log('Submitting, waiting for redirect …')
await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 15000 })
console.log(`Landed on: ${page.url()}`)

const state = await ctx.storageState()
const absOut = resolve(outPath)
writeFileSync(absOut, JSON.stringify(state, null, 2))
console.log(`✓ Saved storageState to ${absOut}`)

await browser.close()
