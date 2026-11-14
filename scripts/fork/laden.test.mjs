// Fork-Pilot: `loadEinheit(slug, { fassung })` (VERTRAG §2, Invarianten 2 und 3).
// `loadEinheit` hängt an `import.meta.glob` — darum über Vite-SSR wie export-v42.mjs.
import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { startSsr } from '../v42-ssr.mjs'
import { wertHash } from '../../src/lib/fork/adresse.ts'

const GOLD = ['1.3.1_konsum_verantworten_v42', '1.1.1_lehrvertrag_orientieren_v42']
const PFAD = 'spuren.ohne_medien.leitfragen[nr=3].text'
// Selbst geschriebener Testtext (Invariante 7).
const NEU = 'Testfassung: Welche Regel gilt hier für dich?'

let server, loadEinheit
before(async () => {
  server = await startSsr()
  ;({ loadEinheit } = await server.ssrLoadModule('/src/lib/einheiten/index.ts'))
})
after(async () => { await server?.close() })

const lf3 = (heft) => heft?.leitfragen?.find((l) => l.nr === 3)

function ersetzung(slug) {
  const ohne = loadEinheit(slug)
  // Originalwert aus der Rohform: in der aufgelösten ohne_medien-Variante steht derselbe Text.
  const original = lf3(ohne.spur_varianten.ohne_medien.hf_A).text
  return { datei: 'herausforderung_A', pfad: PFAD, wert: NEU, original_hash: wertHash(original), auftrag: 'leitfrage_umformulieren', buendel_id: 'test-buendel' }
}

for (const slug of GOLD) {
  test(`${slug}: ohne Option gleich wie mit leerer Fassung (Invariante 3)`, () => {
    const ohne = loadEinheit(slug)
    assert.ok(ohne)
    assert.equal('fassung_bericht' in ohne, false)
    const { fassung_bericht, ...mit } = loadEinheit(slug, { fassung: { ersetzungen: [] } })
    assert.deepEqual(fassung_bericht, { angewendet: 0, veraltet: [], verworfen: [] })
    assert.deepEqual(mit, ohne)
  })

  test(`${slug}: Ersetzung LF3 Heft A wirkt nur in ohne_medien, Begleiter bleibt Original`, () => {
    const ohne = loadEinheit(slug)
    const mit = loadEinheit(slug, { fassung: { ersetzungen: [ersetzung(slug)] } })
    assert.equal(mit.fassung_bericht.angewendet, 1)
    assert.equal(lf3(mit.spur_varianten.ohne_medien.hf_A).text, NEU)
    assert.notEqual(lf3(ohne.spur_varianten.ohne_medien.hf_A).text, NEU)
    assert.deepEqual(mit.spur_varianten.ohne_medien.hf_B, ohne.spur_varianten.ohne_medien.hf_B)
    if (ohne.spur_varianten.mit_medien) {
      assert.deepEqual(mit.spur_varianten.mit_medien, ohne.spur_varianten.mit_medien)
      assert.notEqual(lf3(mit.spur_varianten.mit_medien.hf_A).text, NEU)
    }
    assert.equal(mit.begleiter?.raw, ohne.begleiter?.raw)
    assert.ok(!mit.begleiter?.raw?.includes(NEU))
    // Kein Durchschlagen auf die Glob-Module: ein späterer Aufruf ohne Fassung ist wieder Original.
    assert.deepEqual(loadEinheit(slug), ohne)
  })

  test(`${slug}: veraltete und verworfene Ersetzungen ändern nichts`, () => {
    const ohne = loadEinheit(slug)
    const alt = { ...ersetzung(slug), original_hash: wertHash('anderer Text') }
    const r = loadEinheit(slug, { fassung: { ersetzungen: [alt] }, fassungPruefer: () => null })
    assert.deepEqual(r.fassung_bericht.veraltet, [alt])
    const v = loadEinheit(slug, { fassung: { ersetzungen: [ersetzung(slug)] }, fassungPruefer: () => 'gesperrt' })
    assert.equal(v.fassung_bericht.verworfen[0].grund, 'gesperrt')
    const { fassung_bericht: _a, ...r2 } = r
    const { fassung_bericht: _b, ...v2 } = v
    assert.deepEqual(r2, ohne)
    assert.deepEqual(v2, ohne)
  })
}

test('nur_spur entfernt mit_medien aus spur_varianten und setzt die wirksame Spur', () => {
  const slug = GOLD[0]
  const ohne = loadEinheit(slug, { spur: 'mit_medien' })
  assert.ok(ohne.spur_varianten.mit_medien)
  assert.equal(ohne.spur, 'mit_medien')
  const mit = loadEinheit(slug, { spur: 'mit_medien', fassung: { ersetzungen: [ersetzung(slug)], nur_spur: 'ohne_medien' } })
  assert.deepEqual(Object.keys(mit.spur_varianten), ['ohne_medien'])
  assert.equal(mit.spur, 'ohne_medien')
  assert.equal(mit.hf_A, mit.spur_varianten.ohne_medien.hf_A)
  assert.equal(lf3(mit.hf_A).text, NEU)
  // Begleiter folgt nicht der Fassungs-Spur.
  assert.equal(mit.begleiter?.raw, ohne.begleiter?.raw)
})
