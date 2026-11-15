// Fork-Pilot: Kosten aus Tokens (src/lib/fork/kosten.ts) und Auswertung der Nutzung
// (src/lib/fork/nutzung.ts). Reine Rechenlogik, ohne Supabase und ohne OpenAI.
//   node --test scripts/fork/kosten.test.mjs
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { kostenUsd, preisFuer, betrag, usdZuChf, USD_CHF } from '../../src/lib/fork/kosten.ts'
import { werteAus, zurichTag } from '../../src/lib/fork/nutzung.ts'

const nah = (a, b) => assert.ok(Math.abs(a - b) < 1e-12, `${a} ≠ ${b}`)

test('Preis: exakter Name, Snapshot-Suffix, unbekannt', () => {
  assert.deepEqual(preisFuer('gpt-6-luna'), { eingabe: 0.10, gecacht: 0.01, ausgabe: 0.50 })
  assert.equal(preisFuer('gpt-6-luna-2026-10-01')?.ausgabe, 0.50)
  assert.equal(preisFuer('GPT-6-Luna')?.eingabe, 0.10)
  assert.equal(preisFuer('gpt-6.1-sol')?.ausgabe, 10)
  assert.equal(preisFuer('gpt-6-lunatic'), null, 'nur ganzer Name oder Name + «-»')
  assert.equal(preisFuer(null), null)
  assert.equal(preisFuer('modell-test'), null)
})

test('Kosten: gecachter Anteil billiger, Ausgabe inkl. Denk-Tokens', () => {
  // 10 000 ein (davon 2 000 gecacht), 4 000 aus bei gpt-6-luna:
  // 8 000 × 0.10 + 2 000 × 0.01 + 4 000 × 0.50 = 800 + 20 + 2 000 = 2 820 / 1e6
  nah(kostenUsd({ eingabe: 10_000, gecacht: 2_000, ausgabe: 4_000 }, 'gpt-6-luna'), 0.00282)
  nah(kostenUsd({ eingabe: 1_000_000, ausgabe: 0 }, 'gpt-6-luna'), 0.10)
  nah(kostenUsd({ eingabe: 0, ausgabe: 1_000_000 }, 'gpt-6-luna'), 0.50)
  // gecacht über eingabe wird gekappt, negative Werte zählen nicht
  nah(kostenUsd({ eingabe: 100, gecacht: 500, ausgabe: -3 }, 'gpt-6-luna'), (100 * 0.01) / 1e6)
  assert.equal(kostenUsd({ eingabe: 1, ausgabe: 1 }, 'unbekannt'), null)
})

test('Umrechnung und Anzeige', () => {
  nah(usdZuChf(1), USD_CHF)
  assert.equal(betrag(0.00282, 'USD'), 'USD 0.0028')
  assert.equal(betrag(1.5, 'CHF'), 'CHF 1.50')
  assert.equal(betrag(0, 'CHF'), 'CHF 0.00')
})

test('Zürcher Kalendertag', () => {
  assert.equal(zurichTag('2026-11-15T23:30:00Z'), '2026-11-16')
  assert.equal(zurichTag('2026-07-01T21:59:00Z'), '2026-07-01')
  assert.equal(zurichTag('2026-07-01T22:00:00Z'), '2026-07-02')
})

const F = [
  { id: 'f1', user_id: 'u1', einheit_id: 'e1', created_at: '2026-11-15T08:00:00Z' },
  { id: 'f2', user_id: 'u2', einheit_id: 'e2', created_at: '2026-11-15T09:00:00Z' },
]
const B = [
  // u1: Modell-Bündel mit Tokens, 3 Ersetzungen, 1 übernommen, 1 verworfen
  { id: 'b1', fassung_id: 'f1', user_id: 'u1', status: 'vorschlag', created_at: '2026-11-15T08:01:00Z', modell: 'gpt-6-luna',
    kommentare: [{ auftrag: 'situation_umformulieren' }, { auftrag: 'situation_umformulieren' }],
    vorschlag: { ersetzungen: [1, 2, 3] }, entscheide: { 'a:x': 'angenommen', 'a:y': 'verworfen' },
    tokens_eingabe: 10_000, tokens_gecacht: 2_000, tokens_ausgabe: 4_000, tokens_denken: 1_000, modell_aufrufe: 2, fehler_art: null },
  // u1: Selbst bearbeitet
  { id: 'b2', fassung_id: 'f1', user_id: 'u1', status: 'abgeschlossen', created_at: '2026-11-15T08:05:00Z', modell: null,
    kommentare: [{ auftrag: 'manuell' }], vorschlag: null, entscheide: {}, tokens_eingabe: null, tokens_ausgabe: null },
  // u2: Fehler ohne Tokens
  { id: 'b3', fassung_id: 'f2', user_id: 'u2', status: 'fehler', created_at: '2026-11-15T09:01:00Z', modell: null,
    kommentare: [{ auftrag: 'leitfrage_umformulieren' }], vorschlag: null, entscheide: {}, tokens_eingabe: null, tokens_ausgabe: null, fehler_art: 'zeitueberschreitung' },
]
const A = [
  { user_id: 'u1', art: 'buendel', created_at: '2026-11-15T08:01:00Z' },
  { user_id: 'u1', art: 'korrektur', created_at: '2026-11-15T08:02:00Z' },
  { user_id: 'u2', art: 'buendel', created_at: '2026-11-15T09:01:00Z' },
]

test('Auswertung: pro Person, Summe, Tage, Aufträge, Einheiten, Fehler', () => {
  const r = werteAus({ aufrufe: A, buendel: B, fassungen: F })
  const u1 = r.personen.find((p) => p.user_id === 'u1').zahlen
  const u2 = r.personen.find((p) => p.user_id === 'u2').zahlen
  assert.equal(r.personen[0].user_id, 'u1', 'meiste Aufrufe zuerst')
  assert.deepEqual([u1.modellaufrufe, u1.korrekturen, u1.manuell, u1.fassungen, u1.buendel], [2, 1, 1, 1, 1])
  assert.deepEqual([u1.vorschlaege, u1.angenommen, u1.verworfen, u1.offen], [3, 1, 1, 1])
  assert.deepEqual([u1.tokensEingabe, u1.tokensGecacht, u1.tokensAusgabe, u1.tokensDenken], [10_000, 2_000, 4_000, 1_000])
  nah(u1.kostenUsd, 0.00282)
  assert.equal(u2.kostenUsd, null, 'ohne Tokens keine Kosten')
  assert.deepEqual([u2.fehler, u2.ohneTokens], [1, 1])
  assert.deepEqual([r.summe.modellaufrufe, r.summe.manuell, r.summe.fassungen, r.summe.fehler], [3, 1, 2, 1])
  nah(r.summe.kostenUsd, 0.00282)
  assert.deepEqual(r.proTag, [{ tag: '2026-11-15', buendel: 2, korrektur: 1 }])
  assert.deepEqual(r.auftraege, [{ auftrag: 'leitfrage_umformulieren', n: 1 }, { auftrag: 'situation_umformulieren', n: 1 }])
  assert.deepEqual(r.einheiten, [{ einheit_id: 'e1', n: 2 }, { einheit_id: 'e2', n: 1 }])
  assert.deepEqual(r.fehler, [{ art: 'zeitueberschreitung', n: 1 }])
  assert.equal(r.tokenSpalten, true)
})

test('Ohne Migration 030 und ohne fork_aufrufe: «noch nicht erfasst», Aufrufe aus Bündeln', () => {
  const alt = B.map(({ tokens_eingabe, tokens_gecacht, tokens_ausgabe, tokens_denken, modell_aufrufe, fehler_art, ...rest }) => rest)
  const r = werteAus({ aufrufe: null, buendel: alt, fassungen: F })
  assert.equal(r.tokenSpalten, false)
  assert.equal(r.summe.kostenUsd, null)
  assert.equal(r.summe.modellaufrufe, 1, 'nur Bündel mit Modell')
  assert.deepEqual(r.fehler, [{ art: 'unbekannt', n: 1 }])
  assert.deepEqual(r.proTag, [{ tag: '2026-11-15', buendel: 1, korrektur: 0 }])
})
