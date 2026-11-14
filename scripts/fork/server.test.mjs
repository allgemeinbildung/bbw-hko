// Fork-Pilot: Tests für die reinen Teile von src/lib/fork/server.ts (VERTRAG §8, §9). Reines node:test.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  pruefeKommentare, zurichMitternacht, leitfragenAus, glossarBegriffe, maxAufrufeProTag, buendelSicht, fehlerMeldung, reservierungsMeldung,
} from '../../src/lib/fork/server.ts'

const k = (auftrag, datei, pfad, kommentar = 'Bitte einfacher.') => ({ auftrag, datei, pfad, kommentar })
const pk = (liste, heft = 'A', eba = false) => pruefeKommentare(JSON.stringify(liste), heft, eba)

test('Kommentare: gültige Ziele je Auftrag werden angenommen und getrimmt', () => {
  const r = pk([
    k('leitfrage_umformulieren', 'herausforderung_A', 'leitfragen[nr=1].text', '  kürzer  '),
    k('eigener_text', 'herausforderung_A', 'spuren.ohne_medien.leitfragen[nr=3].text'),
    k('situation_umformulieren', 'herausforderung_A', 'situation_text'),
    k('handlungsprodukt_aendern', 'herausforderung_A', 'handlungsprodukt.titel'),
  ])
  assert.ok('kommentare' in r, JSON.stringify(r))
  assert.equal(r.kommentare.length, 4)
  assert.equal(r.kommentare[0].kommentar, 'kürzer')
  const set = pk([k('leitfrage_umformulieren', 'set', 'gemeinsamer_auftrag.leitfrage')], 'auftrag')
  assert.ok('kommentare' in set, JSON.stringify(set))
})

test('Kommentare: Heft, Anzahl, Länge, Datei', () => {
  assert.ok('fehler' in pk([k('leitfrage_umformulieren', 'dossier', 'einleitung.was_ist_das')], 'dossier'))
  assert.ok('fehler' in pk([]))
  assert.ok('fehler' in pruefeKommentare('kein json', 'A', false))
  assert.ok('fehler' in pruefeKommentare(null, 'A', false))
  const viele = Array.from({ length: 31 }, () => k('leitfrage_umformulieren', 'herausforderung_A', 'leitfragen[nr=1].text'))
  assert.ok('fehler' in pk(viele))
  assert.ok('kommentare' in pk(viele.slice(0, 30)))
  assert.ok('fehler' in pk([k('leitfrage_umformulieren', 'herausforderung_A', 'leitfragen[nr=1].text', 'x'.repeat(2001))]))
  assert.ok('kommentare' in pk([k('leitfrage_umformulieren', 'herausforderung_A', 'leitfragen[nr=1].text', 'x'.repeat(2000))]))
  assert.ok('fehler' in pk([k('leitfrage_umformulieren', 'herausforderung_A', 'leitfragen[nr=1].text', '   ')]))
  // Datei passt nicht zum Heft.
  assert.ok('fehler' in pk([k('leitfrage_umformulieren', 'herausforderung_B', 'leitfragen[nr=1].text')], 'A'))
  assert.ok('fehler' in pk([k('unbekannt', 'herausforderung_A', 'leitfragen[nr=1].text')]))
})

test('Kommentare: Pfad muss Ziel des Auftrags und erlaubt sein', () => {
  // Nicht auf der Positivliste.
  assert.ok('fehler' in pk([k('situation_umformulieren', 'herausforderung_A', 'template')]))
  // Lösung ist kein Ziel von «Leitfrage umformulieren».
  assert.ok('fehler' in pk([k('leitfrage_umformulieren', 'herausforderung_A', 'leitfragen[nr=1].loesung')]))
  // Eigener Text nie in der Medien-Spur (F6).
  assert.ok('fehler' in pk([k('eigener_text', 'herausforderung_A', 'spuren.mit_medien.leitfragen[nr=3].text')]))
  // Situation ist kein Ziel von «Handlungsprodukt ändern».
  assert.ok('fehler' in pk([k('handlungsprodukt_aendern', 'herausforderung_A', 'situation_text')]))
  // Eigener Text nicht im Auftragsbogen.
  assert.ok('fehler' in pk([k('eigener_text', 'set', 'gemeinsamer_auftrag.leitfrage')], 'auftrag'))
})

test('Mitternacht in Europe/Zurich, auch an den Umstelltagen', () => {
  assert.equal(zurichMitternacht(new Date('2026-11-14T10:00:00Z')), '2026-11-13T23:00:00.000Z')
  assert.equal(zurichMitternacht(new Date('2026-07-01T22:30:00Z')), '2026-07-01T22:00:00.000Z') // 00:30 lokal
  assert.equal(zurichMitternacht(new Date('2026-07-01T21:59:00Z')), '2026-06-30T22:00:00.000Z') // 23:59 lokal
  assert.equal(zurichMitternacht(new Date('2026-03-29T12:00:00Z')), '2026-03-28T23:00:00.000Z') // Sommerzeit ab 02:00
  assert.equal(zurichMitternacht(new Date('2026-10-25T12:00:00Z')), '2026-10-24T22:00:00.000Z') // Winterzeit ab 03:00
  assert.equal(zurichMitternacht(new Date('2026-01-01T00:00:00Z')), '2025-12-31T23:00:00.000Z') // 01:00 lokal
})

test('Hilfen: Leitfragen, Glossar, Tagesgrenze', () => {
  assert.deepEqual(leitfragenAus([{ pfad: 'spuren.ohne_medien.leitfragen[nr=3].text' }, { pfad: 'leitfragen[nr=1].text' }, { pfad: 'leitfragen[nr=3].text' }, { pfad: 'titel' }]), [1, 3])
  assert.deepEqual(glossarBegriffe({ glossar: [{ begriff: 'Budget', heft: 'A' }, { begriff: 'Lohn', heft: 'B' }, { begriff: 'Budget', heft: 'A', spur: 'mit_medien' }] }, 'A'), ['Budget'])
  assert.deepEqual(glossarBegriffe(null, 'A'), [])
  const alt = process.env.FORK_MAX_AUFRUFE_PRO_TAG
  delete process.env.FORK_MAX_AUFRUFE_PRO_TAG
  assert.equal(maxAufrufeProTag(), 20)
  process.env.FORK_MAX_AUFRUFE_PRO_TAG = '5'
  assert.equal(maxAufrufeProTag(), 5)
  process.env.FORK_MAX_AUFRUFE_PRO_TAG = 'viel'
  assert.equal(maxAufrufeProTag(), 20)
  if (alt === undefined) delete process.env.FORK_MAX_AUFRUFE_PRO_TAG; else process.env.FORK_MAX_AUFRUFE_PRO_TAG = alt
})

test('Bündel-Sicht: kein Klartext, bei Fehler nur allgemeine Meldung', () => {
  const row = { id: 'b1', fassung_id: 'f1', user_id: 'u1', heft: 'A', kommentare: [], text_pfad: 'u1/b1.txt', status: 'fehler', vorschlag: null, entscheide: {}, modell: null, created_at: '2026-11-14T10:00:00Z' }
  const s = buendelSicht(row, 'abgelehnt')
  assert.equal(s.hat_text, true)
  assert.equal('text_pfad' in s, false)
  assert.equal('user_id' in s, false)
  assert.equal(s.meldung, fehlerMeldung('abgelehnt'))
  assert.equal(buendelSicht({ ...row, status: 'vorschlag', text_pfad: null }).meldung, undefined)
  assert.equal(buendelSicht({ ...row, text_pfad: null }).hat_text, false)
})

test('Not-Aus und Grenzen: Meldungen je Ergebnis der Reservierung (F16)', () => {
  assert.equal(reservierungsMeldung('ok', 20), null)
  assert.equal(reservierungsMeldung('aus', 20).status, 503)
  assert.equal(reservierungsMeldung('gesamt', 20).status, 429)
  assert.match(reservierungsMeldung('person', 7).text, /höchstens 7 Vorschläge/)
})

test('Bündel-Sicht: nach der Löschfrist bleibt «hat Text» stehen (F17)', () => {
  const row = { id: 'b1', fassung_id: 'f1', user_id: 'u1', heft: 'A', kommentare: [], text_pfad: null, text_geloescht_am: '2026-12-14T10:00:00Z', status: 'abgeschlossen', vorschlag: null, entscheide: {}, modell: null, created_at: '2026-11-14T10:00:00Z' }
  assert.equal(buendelSicht(row).hat_text, true)
})
