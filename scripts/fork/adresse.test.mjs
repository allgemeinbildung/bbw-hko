// Fork-Pilot: Tests für src/lib/fork/adresse.ts (VERTRAG §1). Reines node:test,
// Node 24 lädt die .ts-Datei per Type-Stripping.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { parsePfad, formatPfad, lesePfad, setzePfad, kanonisch, wertHash, sha256Hex } from '../../src/lib/fork/adresse.ts'

test('Pfad-Grammatik: Segmente, Schlüsselwahl, Rundlauf', () => {
  const seg = parsePfad('spuren.ohne_medien.leitfragen[nr=3].text')
  assert.deepEqual(seg, [
    { name: 'spuren' }, { name: 'ohne_medien' },
    { name: 'leitfragen', wahl: { schluessel: 'nr', wert: '3' } }, { name: 'text' },
  ])
  assert.equal(formatPfad(seg), 'spuren.ohne_medien.leitfragen[nr=3].text')
})

test('Pfad-Grammatik: Punkt im Label-Wert gehört zum Wert', () => {
  const seg = parsePfad('handlungsprodukt.schritte[label=01 Bedürfnisse sammeln.].hint')
  assert.equal(seg.length, 3)
  assert.deepEqual(seg[1].wahl, { schluessel: 'label', wert: '01 Bedürfnisse sammeln.' })
  assert.equal(seg[2].name, 'hint')
})

test('Pfad-Grammatik: Abweichungen werfen', () => {
  for (const p of ['', 'a..b', 'A', 'leitfragen[0]', 'leitfragen[index=1]', 'a[nr=]', 'a b', 'a.']) {
    assert.throws(() => parsePfad(p), undefined, p)
  }
})

test('Schlüssel eindeutig: lesen und setzen treffen genau ein Element', () => {
  const obj = { leitfragen: [{ nr: 1, text: 'eins' }, { nr: 3, text: 'drei' }] }
  assert.equal(lesePfad(obj, 'leitfragen[nr=3].text'), 'drei')
  assert.equal(setzePfad(obj, 'leitfragen[nr=3].text', 'neu'), true)
  assert.equal(obj.leitfragen[1].text, 'neu')
  assert.equal(obj.leitfragen[0].text, 'eins')
})

test('Schlüssel mehrdeutig oder fehlend: nicht lesbar, nicht setzbar', () => {
  const obj = { schritte: [{ label: 'x', hint: 'a' }, { label: 'x', hint: 'b' }] }
  assert.equal(lesePfad(obj, 'schritte[label=x].hint'), undefined)
  assert.equal(setzePfad(obj, 'schritte[label=x].hint', 'c'), false)
  assert.equal(lesePfad(obj, 'schritte[label=y].hint'), undefined)
  assert.equal(setzePfad(obj, 'schritte[label=y].hint', 'c'), false)
  assert.deepEqual(obj.schritte.map((s) => s.hint), ['a', 'b'])
})

test('setzen legt nur das letzte Feld an, nie Zwischenobjekte', () => {
  const leer = {}
  assert.equal(setzePfad(leer, 'a.b', 1), false)
  assert.deepEqual(leer, {})
  const obj = { a: {} }
  assert.equal(setzePfad(obj, 'a.b', 1), true)
  assert.deepEqual(obj, { a: { b: 1 } })
  // Ein ganzes Listenelement über den Schlüssel ersetzen
  const m = { methoden: [{ ref: 'x' }, { ref: 'y' }] }
  assert.equal(setzePfad(m, 'methoden[ref=y]', { ref: 'z' }), true)
  assert.deepEqual(m.methoden, [{ ref: 'x' }, { ref: 'z' }])
})

test('kanonisch: Schlüssel alphabetisch, ohne Leerraum, undefined → fehlt bzw. null', () => {
  assert.equal(kanonisch({ b: 1, a: { d: [1, 'ä'], c: null } }), '{"a":{"c":null,"d":[1,"ä"]},"b":1}')
  assert.equal(kanonisch({ b: undefined, a: 1 }), '{"a":1}')
  assert.equal(kanonisch(undefined), 'null')
  assert.equal(kanonisch([undefined, 2]), '[null,2]')
  assert.equal(kanonisch({ x: 1, y: 2 }), kanonisch({ y: 2, x: 1 }))
})

test('sha256 stimmt mit node:crypto überein (leer, Umlaute, mehrere Blöcke)', () => {
  const texte = ['', 'abc', 'Grüsse aus Winterthur — «Test»', 'x'.repeat(55), 'y'.repeat(56), 'z'.repeat(64), 'ö'.repeat(1000)]
  for (const t of texte) assert.equal(sha256Hex(t), createHash('sha256').update(t, 'utf8').digest('hex'), t.slice(0, 20))
  const v = { text: 'Meine Frage', nr: 3 }
  assert.equal(wertHash(v), 'sha256:' + createHash('sha256').update(kanonisch(v)).digest('hex'))
  assert.match(wertHash(undefined), /^sha256:[0-9a-f]{64}$/)
  assert.equal(wertHash(undefined), wertHash(null))
})
