// Fork-Pilot: Tests für «Selbst bearbeiten» (src/lib/fork/manuell.ts, 15.11.2026). Reines node:test, selbst geschriebene Texte.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { manuellBearbeitbar, jetzigerWert, wendeManuellAn } from '../../src/lib/fork/manuell.ts'
import { wendeAn } from '../../src/lib/fork/anwenden.ts'
import { lesePfad, wertHash } from '../../src/lib/fork/adresse.ts'

const SIT = 'Ich arbeite seit drei Monaten in einer Schreinerei und muss bis Freitag entscheiden, ob ich ein neues Velo auf Raten kaufe oder noch spare.'
const roh = () => ({
  herausforderung_A: {
    template: 'heft_8page_v42', titel: 'Velo oder sparen?', situation_text: SIT,
    persona: { beruf: 'Schreiner EFZ', betrieb: 'Schreinerei', ort: 'Winterthur' },
    leitfragen: [{ nr: 1, text: 'Welche Kosten entstehen bei einem Kauf auf Raten?' }],
  },
  herausforderung_B: { template: 'heft_8page_v42', titel: 'B' },
  set: { gemeinsamer_auftrag: { leitfrage: 'Wie entscheiden Sie verantwortungsvoll?' } },
})
const an = (r, ersetzungen, pfad, wert, buendelId = 'b-1', datei = 'herausforderung_A') =>
  wendeManuellAn({ roh: r, ersetzungen, datei, pfad, wert, buendelId })

test('Nur reine Textfelder der Positivliste sind selbst bearbeitbar', () => {
  assert.equal(manuellBearbeitbar('herausforderung_A', 'situation_text'), true)
  assert.equal(manuellBearbeitbar('herausforderung_A', 'leitfragen[nr=1].text'), true)
  assert.equal(manuellBearbeitbar('herausforderung_A', 'persona'), false, 'Objekt')
  assert.equal(manuellBearbeitbar('herausforderung_A', 'template'), false, 'nicht auf der Positivliste')
  assert.equal(manuellBearbeitbar('dossier', 'leseblatt.einleitung'), false, 'Dossier nicht in der ersten Fassung')
})

test('Ein paar Wörter ändern ergibt eine Ersetzung «manuell», die sich anwenden lässt', () => {
  const r = roh()
  const neu = SIT.replace('drei Monaten', 'vier Monaten')
  const e = an(r, [], 'situation_text', neu)
  assert.equal(e.ok, true)
  assert.equal(e.geaendert, true)
  assert.equal(e.ersetzungen.length, 1)
  assert.equal(e.ersetzungen[0].auftrag, 'manuell')
  assert.equal(e.ersetzungen[0].original_hash, wertHash(SIT))
  const { dateien, bericht } = wendeAn(r, e.ersetzungen)
  assert.equal(bericht.angewendet, 1)
  assert.equal(lesePfad(dateien.herausforderung_A, 'situation_text'), neu)
  assert.equal(r.herausforderung_A.situation_text, SIT, 'Original unverändert')
})

test('Handänderung verdrängt eine frühere Ersetzung desselben Felds; jetzigerWert zeigt die Fassung', () => {
  const r = roh()
  const alt = [{ datei: 'herausforderung_A', pfad: 'situation_text', wert: 'Vorschlag des Modells.', original_hash: wertHash(SIT), auftrag: 'situation_umformulieren', buendel_id: 'm-1' }]
  assert.equal(jetzigerWert(r, alt, 'herausforderung_A', 'situation_text').wert, 'Vorschlag des Modells.')
  const e = an(r, alt, 'situation_text', 'Vorschlag des Modells, leicht geändert.')
  assert.equal(e.ok, true)
  assert.deepEqual(e.ersetzungen.map((x) => x.auftrag), ['manuell'])
  assert.equal(e.ersetzungen[0].original_hash, wertHash(SIT), 'Hash am Original, weil die alte Ersetzung wegfällt')
})

test('Zurück zum Original entfernt die eigene Ersetzung; unveränderter Text ändert nichts', () => {
  const r = roh()
  const erste = an(r, [], 'titel', 'Velo oder weiter sparen?')
  assert.equal(erste.ok, true)
  const zurueck = an(r, erste.ersetzungen, 'titel', 'Velo oder sparen?')
  assert.equal(zurueck.ok, true)
  assert.equal(zurueck.ersetzungen.length, 0)
  const gleich = an(r, erste.ersetzungen, 'titel', 'Velo oder weiter sparen?')
  assert.equal(gleich.geaendert, false)
})

test('Prüfungen: leer, zu lang, Du-Anrede, falsches Feld', () => {
  const r = roh()
  assert.match(an(r, [], 'situation_text', '   ').fehler, /leer/)
  assert.match(an(r, [], 'situation_text', SIT + ' ' + SIT).fehler, /zu lang/)
  assert.match(an(r, [], 'leitfragen[nr=1].text', 'Welche Kosten hast du bei Raten?').fehler, /«Sie»/)
  assert.match(an(r, [], 'persona', 'Text').fehler, /nicht selbst bearbeiten/)
  assert.equal(an(r, [], 'situation_text', 42).ok, false)
})

test('Auftragsbogen: Leitfrage selbst bearbeiten', () => {
  const r = roh()
  const e = an(r, [], 'gemeinsamer_auftrag.leitfrage', 'Wie entscheiden Sie verantwortungsvoll beim Kauf?', 'b-2', 'set')
  assert.equal(e.ok, true)
  assert.equal(e.ersetzungen[0].datei, 'set')
})
