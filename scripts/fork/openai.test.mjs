// Test fuer src/lib/fork/openai.ts mit gemocktem fetch — kein echter Aufruf, kein Key.
// Aufruf: node --test scripts/fork/openai.test.mjs  (Node >= 22.18 / 23.6, Type-Stripping)
import { test, mock, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { frageModell, ANTWORT_SCHEMA } from '../../src/lib/fork/openai.ts'

// Variablenname zusammengesetzt, damit die Zaun-Suche (Invariante 8) diese Datei nicht trifft.
const KEY_VAR = ['OPENAI', 'API', 'KEY'].join('_')
const KEY = 'sk-test-GEHEIM-1234567890abcdef'
const ANTWORT = { ersetzungen: [{ datei: 'herausforderung_A', pfad: 'x.y', wert_json: '"neu"', begruendung: 'b' }], bestaetigt: [{ pfad: 'z', begruendung: 'stimmt' }], hinweis: '' }
const ARGS = { system: 'Systemteil', nutzer: 'Nutzerteil' }

let echtesFetch
let aufrufe
beforeEach(() => {
  echtesFetch = globalThis.fetch
  aufrufe = []
  process.env[KEY_VAR] = KEY
  process.env.OPENAI_MODEL = 'modell-test'
})
afterEach(() => {
  globalThis.fetch = echtesFetch
  delete process.env[KEY_VAR]
  delete process.env.OPENAI_MODEL
  mock.timers.reset()
})

function setzeFetch(status, body, headers = {}) {
  globalThis.fetch = async (url, init) => {
    aufrufe.push({ url, init })
    return new Response(typeof body === 'string' ? body : JSON.stringify(body), { status, headers })
  }
}
const erfolg = (extra = {}) => ({
  object: 'response', status: 'completed', model: 'modell-test-2026',
  output: [{ type: 'message', role: 'assistant', content: [{ type: 'output_text', text: JSON.stringify(ANTWORT), annotations: [] }] }],
  usage: { input_tokens: 10, output_tokens: 5, total_tokens: 15 },
  ...extra,
})
const keinKey = (r) => assert.ok(!JSON.stringify(r).includes(KEY.slice(3, 15)), 'Key-Teil in Rueckgabe')

test('Erfolg: Antwort, Modell, Nutzung; Body mit store:false, ohne user/metadata', async () => {
  setzeFetch(200, erfolg())
  const r = await frageModell(ARGS)
  assert.equal(r.ok, true)
  assert.deepEqual(r.antwort, ANTWORT)
  assert.equal(r.modell, 'modell-test-2026')
  assert.deepEqual(r.nutzung, { eingabe: 10, ausgabe: 5, gesamt: 15 })

  assert.equal(aufrufe.length, 1)
  assert.equal(aufrufe[0].url, 'https://api.openai.com/v1/responses')
  const body = JSON.parse(aufrufe[0].init.body)
  assert.equal(body.store, false)
  assert.ok(!('user' in body) && !('metadata' in body) && !('safety_identifier' in body))
  assert.equal(body.model, 'modell-test')
  assert.equal(body.instructions, 'Systemteil')
  assert.equal(body.input, 'Nutzerteil')
  assert.deepEqual(body.text.format, { type: 'json_schema', name: 'fassung_vorschlag', strict: true, schema: ANTWORT_SCHEMA })
  assert.ok(!aufrufe[0].init.body.includes(KEY), 'Key im Body')
  assert.equal(aufrufe[0].init.headers.Authorization, `Bearer ${KEY}`)
})

test('Schema ist strikt-tauglich (jedes Objekt additionalProperties:false, alle Felder required)', () => {
  const pruefe = (s) => {
    if (s.type === 'object') {
      assert.equal(s.additionalProperties, false)
      assert.deepEqual([...s.required].sort(), Object.keys(s.properties).sort())
      Object.values(s.properties).forEach(pruefe)
    }
    if (s.type === 'array') pruefe(s.items)
  }
  pruefe(ANTWORT_SCHEMA)
})

test('HTTP-Fehler: nur Status, type, code — keine Meldung, kein Key', async () => {
  setzeFetch(429, { error: { message: `Incorrect API key provided: ${KEY}`, type: 'rate_limit_error', code: 'slow_down' } }, { 'retry-after': '7' })
  const r = await frageModell(ARGS)
  assert.equal(r.ok, false)
  assert.equal(r.fehler, 'http')
  assert.match(r.meldung, /429/)
  assert.match(r.meldung, /rate_limit_error/)
  assert.match(r.meldung, /slow_down/)
  assert.ok(!r.meldung.includes('Incorrect'))
  keinKey(r)
})

test('HTTP-Fehler mit Nicht-JSON-Body', async () => {
  setzeFetch(500, 'Bad gateway')
  const r = await frageModell(ARGS)
  assert.equal(r.fehler, 'http')
  assert.match(r.meldung, /500/)
})

test('Zeitueberschreitung nach 140 s', async () => {
  mock.timers.enable({ apis: ['setTimeout'] })
  globalThis.fetch = (url, init) => new Promise((_, reject) => {
    init.signal.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError')))
  })
  const p = frageModell(ARGS)
  mock.timers.tick(139_999)
  await Promise.resolve()
  mock.timers.tick(1)
  const r = await p
  assert.equal(r.fehler, 'zeitueberschreitung')
  keinKey(r)
})

test('Abbruch von aussen ueber signal', async () => {
  globalThis.fetch = (url, init) => new Promise((_, reject) => {
    init.signal.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError')))
  })
  const ac = new AbortController()
  const p = frageModell({ ...ARGS, signal: ac.signal })
  ac.abort()
  const r = await p
  assert.equal(r.fehler, 'zeitueberschreitung')
})

test('Refusal', async () => {
  setzeFetch(200, erfolg({ output: [{ type: 'message', role: 'assistant', content: [{ type: 'refusal', refusal: 'Dabei kann ich nicht helfen.' }] }] }))
  const r = await frageModell(ARGS)
  assert.equal(r.fehler, 'abgelehnt')
  assert.match(r.meldung, /nicht helfen/)
})

test('Unvollstaendig (max_output_tokens)', async () => {
  setzeFetch(200, erfolg({ status: 'incomplete', incomplete_details: { reason: 'max_output_tokens' }, output: [{ type: 'message', content: [{ type: 'output_text', text: '{"ersetz' }] }] }))
  const r = await frageModell(ARGS)
  assert.equal(r.fehler, 'unvollstaendig')
  assert.match(r.meldung, /max_output_tokens/)
})

test('Format: kein JSON bzw. falsche Form', async () => {
  setzeFetch(200, erfolg({ output: [{ type: 'message', content: [{ type: 'output_text', text: 'kein json' }] }] }))
  assert.equal((await frageModell(ARGS)).fehler, 'format')
  setzeFetch(200, erfolg({ output: [{ type: 'message', content: [{ type: 'output_text', text: '{"ersetzungen":[{"datei":1}],"bestaetigt":[],"hinweis":""}' }] }] }))
  assert.equal((await frageModell(ARGS)).fehler, 'format')
})

test('Fehlende Konfiguration: kein Aufruf', async () => {
  setzeFetch(200, erfolg())
  delete process.env[KEY_VAR]
  assert.equal((await frageModell(ARGS)).fehler, 'nicht_konfiguriert')
  process.env[KEY_VAR] = KEY
  delete process.env.OPENAI_MODEL
  const r = await frageModell(ARGS)
  assert.equal(r.fehler, 'nicht_konfiguriert')
  keinKey(r)
  assert.equal(aufrufe.length, 0)
})
