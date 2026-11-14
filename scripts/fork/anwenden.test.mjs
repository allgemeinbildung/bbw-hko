// Fork-Pilot: Tests für src/lib/fork/anwenden.ts (VERTRAG §1, §2). Reines node:test.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { wendeAn } from '../../src/lib/fork/anwenden.ts'
import { wertHash } from '../../src/lib/fork/adresse.ts'

const roh = () => ({
  herausforderung_A: {
    titel: 'Titel A',
    spuren: { ohne_medien: { leitfragen: [{ nr: 3, text: 'Frage drei' }, { nr: 4, text: 'Frage vier' }] } },
    handlungsprodukt: { schritte: [{ label: '01 Sammeln.', hint: 'Hinweis eins' }] },
  },
  set: { gemeinsamer_auftrag: { titel: 'Auftrag' } },
})

const e = (datei, pfad, wert, original) => ({
  datei, pfad, wert, original_hash: wertHash(original), auftrag: 'leitfrage_umformulieren', buendel_id: 'b-1',
})

test('tiefe Kopie: Eingaben bleiben unverändert, unbetroffene Dateien dieselbe Referenz', () => {
  const r = roh()
  const vorher = structuredClone(r)
  const wert = { liste: ['a'] }
  const { dateien, bericht } = wendeAn(r, [
    e('herausforderung_A', 'spuren.ohne_medien.leitfragen[nr=3].text', 'Meine Frage', 'Frage drei'),
    e('herausforderung_A', 'titel', wert, 'Titel A'),
  ])
  assert.deepEqual(r, vorher)
  assert.equal(bericht.angewendet, 2)
  assert.equal(dateien.herausforderung_A.spuren.ohne_medien.leitfragen[0].text, 'Meine Frage')
  assert.notEqual(dateien.herausforderung_A, r.herausforderung_A)
  assert.equal(dateien.set, r.set)
  // auch der eingesetzte Wert ist eine Kopie
  wert.liste.push('b')
  assert.deepEqual(dateien.herausforderung_A.titel, { liste: ['a'] })
})

test('veraltet: geändertes Original wird nicht angewendet', () => {
  const r = roh()
  const x = e('herausforderung_A', 'titel', 'Neu', 'Anderer Titel')
  const { dateien, bericht } = wendeAn(r, [x])
  assert.equal(bericht.angewendet, 0)
  assert.deepEqual(bericht.veraltet, [x])
  assert.equal(dateien.herausforderung_A.titel, 'Titel A')
})

test('fehlendes Feld: Hash von null, Elternteil muss existieren', () => {
  const { dateien, bericht } = wendeAn(roh(), [
    e('set', 'gemeinsamer_auftrag.leitfrage', 'Neu', undefined),
    e('set', 'gemeinsamer_auftrag.fehlt.leitfrage', 'Neu', undefined),
  ])
  assert.equal(bericht.angewendet, 1)
  assert.equal(dateien.set.gemeinsamer_auftrag.leitfrage, 'Neu')
  assert.equal(bericht.verworfen.length, 1)
  assert.equal(bericht.verworfen[0].e.pfad, 'gemeinsamer_auftrag.fehlt.leitfrage')
})

test('verworfen: istErlaubt, fehlende Datei, ungültiger und unerreichbarer Pfad', () => {
  const nein = e('herausforderung_A', 'titel', 'X', 'Titel A')
  const ohneDatei = e('dossier', 'titel', 'X', undefined)
  const kaputt = e('herausforderung_A', 'leitfragen[0].text', 'X', undefined)
  const weg = e('herausforderung_A', 'spuren.ohne_medien.leitfragen[nr=9].text', 'X', undefined)
  const r = roh()
  const { dateien, bericht } = wendeAn(r, [nein, ohneDatei, kaputt, weg], (x) => (x === nein ? 'nicht auf der Positivliste' : null))
  assert.equal(bericht.angewendet, 0)
  assert.deepEqual(bericht.verworfen.map((v) => v.e), [nein, ohneDatei, kaputt, weg])
  assert.equal(bericht.verworfen[0].grund, 'nicht auf der Positivliste')
  assert.equal(dateien.herausforderung_A, r.herausforderung_A)
})

test('Reihenfolge: Listenreihenfolge, spätere Ersetzung sieht die frühere', () => {
  const { dateien, bericht } = wendeAn(roh(), [
    e('herausforderung_A', 'titel', 'Zwei', 'Titel A'),
    e('herausforderung_A', 'titel', 'Drei', 'Zwei'),
    e('herausforderung_A', 'titel', 'Vier', 'Titel A'),
  ])
  assert.equal(dateien.herausforderung_A.titel, 'Drei')
  assert.equal(bericht.angewendet, 2)
  assert.equal(bericht.veraltet.length, 1)
  // Schlüsselwechsel: der alte Schlüssel ist danach nicht mehr adressierbar (VERTRAG §1)
  const r2 = wendeAn(roh(), [
    e('herausforderung_A', 'handlungsprodukt.schritte[label=01 Sammeln.]', { label: '01 Neu.', hint: 'h' }, { label: '01 Sammeln.', hint: 'Hinweis eins' }),
    e('herausforderung_A', 'handlungsprodukt.schritte[label=01 Sammeln.].hint', 'zu spät', 'Hinweis eins'),
  ])
  assert.equal(r2.bericht.angewendet, 1)
  assert.equal(r2.bericht.verworfen.length, 1)
})
