// Test der Prüfung einer Modellantwort (VERTRAG §4, §6, §7). Aufruf: node --test scripts/fork/vorschlag.test.mjs
// Alle Ersatztexte sind für diesen Test selbst geschrieben (Invariante 7).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { pruefeVorschlag } from '../../src/lib/fork/vorschlag.ts'
import { pflichtPfade } from '../../src/lib/fork/positivliste.ts'
import { lesePfad, setzePfad, wertHash } from '../../src/lib/fork/adresse.ts'

const BASIS = join(import.meta.dirname, '../../src/data')
const lies = (einheit, datei) => JSON.parse(readFileSync(join(BASIS, 'einheiten', einheit, `${datei}.json`), 'utf8'))
const EFZ = '1.3.1_konsum_verantworten_v42'
const EBA = '1.1.1_lehrvertrag_orientieren_v42'
const A = lies(EFZ, 'herausforderung_A')
const DOSSIER = lies(EBA, 'dossier')
const METHODEN = new Set(readdirSync(join(BASIS, 'methoden')).filter((f) => f.endsWith('.json') && !f.startsWith('_')).map((f) => f.slice(0, -5)))
const kopie = (v) => JSON.parse(JSON.stringify(v))
const BUENDEL = '00000000-0000-4000-8000-000000000001'

const LF1 = 'leitfragen[nr=1].text'
const NEU_LF1 = 'Erklären Sie mit Maslow, was ein Existenzbedürfnis und was ein Wahlbedürfnis ist. Nennen Sie je ein Beispiel aus Ihrem Alltag.'

const ers = (pfad, wert, datei = 'herausforderung_A') => ({ datei, pfad, wert_json: JSON.stringify(wert), begruendung: 'Testbegründung' })
const antwort = (ersetzungen = [], bestaetigt = [], hinweis = '') => ({ ersetzungen, bestaetigt, hinweis })
const komm = (auftrag, pfad, datei = 'herausforderung_A') => ({ auftrag, datei, pfad, kommentar: 'Selbst geschriebener Testkommentar.' })

function pruefe(o) {
  return pruefeVorschlag({
    datei: 'herausforderung_A', rohOriginal: A, rohAktuell: A, eba: false, buendelId: BUENDEL,
    pflicht: [], methodenRefs: METHODEN, kommentare: [komm('leitfrage_umformulieren', LF1)], ...o,
  })
}
const grundVon = (v, pfad) => v.verworfen.find((x) => x.pfad === pfad)?.grund

test('gültige Ersetzung: Wert, Hash über das Original, Auftrag und Bündel gesetzt', () => {
  const v = pruefe({ antwort: antwort([ers(LF1, NEU_LF1)]) })
  assert.deepEqual(v.verworfen, [])
  assert.equal(v.ersetzungen.length, 1)
  const e = v.ersetzungen[0]
  assert.equal(e.wert, NEU_LF1)
  assert.equal(e.original_hash, wertHash(lesePfad(A, LF1)))
  assert.match(e.original_hash, /^sha256:[0-9a-f]{64}$/)
  assert.equal(e.auftrag, 'leitfrage_umformulieren')
  assert.equal(e.buendel_id, BUENDEL)
  assert.equal(e.datei, 'herausforderung_A')
  assert.equal(e.begruendung, 'Testbegründung')
  assert.equal(v.vollstaendig, true)
})

test('ausserhalb der Positivliste: verworfen «nicht ersetzbar»', () => {
  const v = pruefe({ antwort: antwort([ers('template', 'heft_anders'), ers('leitfragen[nr=1].bloom', 'K2')]) })
  assert.equal(v.ersetzungen.length, 0)
  assert.equal(grundVon(v, 'template'), 'nicht ersetzbar')
  assert.equal(grundVon(v, 'leitfragen[nr=1].bloom'), 'nicht ersetzbar')
})

test('falscher Auftrag: leitfrage_umformulieren darf die Lösung nicht ändern', () => {
  const pfad = 'leitfragen[nr=1].loesung'
  const neu = { ...kopie(lesePfad(A, pfad)), kern: 'Bedürfnisarten kurz' }
  const v = pruefe({ antwort: antwort([ers(pfad, neu)]) })
  assert.equal(v.ersetzungen.length, 0)
  assert.equal(grundVon(v, pfad), 'Die Lösung darf beim Umformulieren nicht geändert werden')
})

test('leitfrage_umformulieren: nur Felder derselben Leitfrage', () => {
  const pfad = 'leitfragen[nr=2].liefert'
  const v = pruefe({ antwort: antwort([ers(pfad, 'Eigene Zuordnung')]) })
  assert.equal(grundVon(v, pfad), 'Nur Felder derselben Leitfrage')
})

test('mehrere Aufträge: der erste, der das Feld erlaubt, wird Auftrag der Ersetzung', () => {
  const pfad = 'leitfragen[nr=2].liefert'
  const v = pruefe({
    kommentare: [komm('leitfrage_umformulieren', LF1), komm('handlungsprodukt_aendern', 'handlungsprodukt.titel')],
    antwort: antwort([ers(pfad, 'Eigene Zuordnung')]),
  })
  assert.equal(v.ersetzungen[0]?.auftrag, 'handlungsprodukt_aendern')
})

test('Budget überschritten: verworfen mit Zeichenzahl', () => {
  const lang = NEU_LF1 + ' ' + 'Begründen Sie Ihre Zuordnung in zwei bis drei ganzen Sätzen. '.repeat(3)
  const v = pruefe({ antwort: antwort([ers(LF1, lang)]) })
  assert.equal(v.ersetzungen.length, 0)
  assert.match(grundVon(v, LF1), /^zu lang: \d+ Zeichen, erlaubt 245$/)
})

test('unveränderter Wert gilt als Bestätigung, nicht als Ersetzung', () => {
  const v = pruefe({ antwort: antwort([ers(LF1, lesePfad(A, LF1))]), pflicht: [LF1] })
  assert.equal(v.ersetzungen.length, 0)
  assert.deepEqual(v.bestaetigt, [{ pfad: LF1, begruendung: 'Testbegründung' }])
  assert.deepEqual(v.fehlend, [])
  assert.equal(v.vollstaendig, true)
})

test('Bestätigung misst gegen die bisherige Fassung, Hash und Budget gegen das Original', () => {
  const aktuell = kopie(A)
  setzePfad(aktuell, LF1, NEU_LF1)
  const gleich = pruefe({ rohAktuell: aktuell, antwort: antwort([ers(LF1, NEU_LF1)]) })
  assert.equal(gleich.ersetzungen.length, 0)
  assert.equal(gleich.bestaetigt[0]?.pfad, LF1)
  const zurueck = pruefe({ rohAktuell: aktuell, antwort: antwort([ers(LF1, 'Erklären Sie mit Maslow zwei Arten von Bedürfnissen.')]) })
  assert.equal(zurueck.ersetzungen[0]?.original_hash, wertHash(lesePfad(A, LF1)))
})

test('fehlende Pflicht: unvollständig mit Liste; mit Bestätigung vollständig', () => {
  const kommentare = [komm('situation_umformulieren', 'situation_text')]
  const pflicht = pflichtPfade('situation_umformulieren', 'herausforderung_A', A, { eba: false })
  assert.ok(pflicht.includes('persona') && pflicht.length > 5)
  const persona = { beruf: 'Detailhandelsfachfrau EFZ', betrieb: 'Velogeschäft', ort: 'Winterthur' }
  const teil = pruefe({ kommentare, pflicht, antwort: antwort([ers('persona', persona)]) })
  assert.equal(teil.ersetzungen.length, 1)
  assert.equal(teil.vollstaendig, false)
  assert.deepEqual(teil.fehlend, pflicht.filter((p) => p !== 'persona'))
  const rest = pflicht.filter((p) => p !== 'persona').map((pfad) => ({ pfad, begruendung: 'stimmt weiter' }))
  const ganz = pruefe({ kommentare, pflicht, antwort: antwort([ers('persona', persona)], rest) })
  assert.deepEqual(ganz.fehlend, [])
  assert.equal(ganz.vollstaendig, true)
})

test('verworfene Ersetzung einer Pflicht zählt nicht als erledigt', () => {
  const kommentare = [komm('situation_umformulieren', 'situation_text')]
  const v = pruefe({ kommentare, pflicht: ['persona'], antwort: antwort([ers('persona', { beruf: 'Koch EFZ' })]) })
  assert.equal(grundVon(v, 'persona'), 'Wert hat nicht die erwartete Form')
  assert.deepEqual(v.fehlend, ['persona'])
  assert.equal(v.vollstaendig, false)
})

test('eigener_text: Ersetzung unter spuren.mit_medien wird verworfen', () => {
  const kommentare = [komm('eigener_text', 'spuren.ohne_medien.leitfragen[nr=3].text')]
  const mit = 'spuren.mit_medien.leitfragen[nr=3].text'
  const ohne = 'spuren.ohne_medien.leitfragen[nr=3].text'
  const neu = 'Werten Sie Ihr Raster mit dem eigenen Text aus: Welche zwei Einflüsse nennt er?'
  const v = pruefe({ kommentare, antwort: antwort([ers(mit, neu), ers(ohne, neu)]) })
  assert.equal(grundVon(v, mit), 'Eigener Text gilt nur für die Spur ohne Medien')
  assert.deepEqual(v.ersetzungen.map((e) => e.pfad), [ohne])
  assert.equal(v.ersetzungen[0].auftrag, 'eigener_text')
})

test('kein gültiges JSON, falsche Datei, doppelter Pfad', () => {
  const v = pruefe({
    antwort: antwort([
      // Objektfeld: kaputtes JSON bleibt verworfen (nur Textfelder dürfen nackten Text tragen).
      { datei: 'herausforderung_A', pfad: 'persona', wert_json: '{kaputt', begruendung: '' },
      { datei: 'herausforderung_A', pfad: 'persona', wert_json: '{"beruf":"x","betrieb":"y","ort":"z"}', begruendung: '' },
      ers('titel', 'Anderer Titel', 'herausforderung_B'),
    ]),
  })
  assert.deepEqual(v.verworfen.map((x) => x.grund), ['kein gültiges JSON', 'doppelt', 'falsche Datei (erwartet herausforderung_A)'])
  assert.equal(v.verworfen[2].datei, 'herausforderung_B')
  assert.equal(v.ersetzungen.length, 0)
})

test('Textfeld als nackter Text (statt JSON-Zeichenkette) gilt als Text', () => {
  const v = pruefe({ antwort: antwort([{ datei: 'herausforderung_A', pfad: LF1, wert_json: NEU_LF1, begruendung: '' }]) })
  assert.deepEqual(v.verworfen, [])
  assert.equal(v.ersetzungen.length, 1)
  assert.equal(v.ersetzungen[0].wert, NEU_LF1)
})

test('Bestätigung ausserhalb der Feldliste wird ignoriert; Hinweis auf 1000 Zeichen gekürzt', () => {
  const v = pruefe({ pflicht: ['template'], antwort: antwort([], [{ pfad: 'template', begruendung: 'x' }, { pfad: 'kaputt[', begruendung: 'x' }], 'ä'.repeat(1500)) })
  assert.deepEqual(v.bestaetigt, [])
  assert.deepEqual(v.fehlend, ['template'])
  assert.equal([...v.hinweis].length, 1000)
})

test('LP-Leck: Lösungstext im Feld für Lernende wird verworfen (Invariante 6)', () => {
  const kommentare = [komm('situation_umformulieren', 'situation_text')]
  const loesung = 'Fünf Einträge im Dreischritt Gut, Bedürfnis und Art, jeweils mit einem eigenen Beispiel belegt.'
  const lp = kopie(lesePfad(A, 'leitfragen[nr=2].loesung'))
  lp.zeilen[0].text = loesung
  const v = pruefe({
    kommentare,
    antwort: antwort([ers('leitfragen[nr=2].loesung', lp), ers('leitfragen_intro', loesung)]),
  })
  assert.equal(grundVon(v, 'leitfragen_intro'), 'Text aus einer Lösung im Feld für Lernende')
})

test('Dossier nur bei EBA (eigener Text, Situation, Produkt)', () => {
  const pfad = 'einleitung.was_ist_das'
  const neu = 'Dieses Dossier erklärt den Lehrvertrag in kurzen Sätzen. Es hilft Ihnen bei den Fragen im Heft.'
  const basis = { datei: 'dossier', rohOriginal: DOSSIER, rohAktuell: DOSSIER, kommentare: [komm('eigener_text', 'leitfragen[nr=1].text')], antwort: antwort([ers(pfad, neu, 'dossier')]) }
  const eba = pruefe({ ...basis, eba: true })
  assert.deepEqual(eba.verworfen, [])
  assert.equal(eba.ersetzungen[0]?.original_hash, wertHash(DOSSIER.einleitung.was_ist_das))
  const efz = pruefe({ ...basis, eba: false })
  assert.equal(grundVon(efz, pfad), 'Das Dossier ist nur bei EBA mit eigenem Text, neuer Situation oder neuem Handlungsprodukt ersetzbar')
})

test('Vorrang: ganze Schrittliste (H24L) vor Einzel-Hints (H24) derselben Datei (F14)', () => {
  const alt = A.handlungsprodukt.schritte
  const neu = alt.map((s, i) => ({ label: `${s.label.split(' ')[0]} Neuer Schritt ${i + 1}`, hint: `Selbst geschriebener Hinweis ${i + 1}.` }))
  const hint = `handlungsprodukt.schritte[label=${alt[0].label}].hint`
  const kommentare = [komm('handlungsprodukt_aendern', 'handlungsprodukt.titel')]
  const v = pruefe({ kommentare, antwort: antwort([ers(hint, 'Anderer Hinweis zum ersten Schritt.'), ers('handlungsprodukt.schritte', neu)]) })
  assert.equal(grundVon(v, hint), 'durch Schrittliste ersetzt')
  assert.deepEqual(v.ersetzungen.map((e) => e.pfad), ['handlungsprodukt.schritte'])
  assert.equal(v.ersetzungen[0].original_hash, wertHash(alt))
  // Ohne Liste bleibt der Einzel-Hint gültig.
  const nur = pruefe({ kommentare, antwort: antwort([ers(hint, 'Anderer Hinweis zum ersten Schritt.')]) })
  assert.deepEqual(nur.verworfen, [])
  assert.deepEqual(nur.ersetzungen.map((e) => e.pfad), [hint])
  // Pflicht beim Produktwechsel ist die Liste: mit ihr erfüllt.
  const mitPflicht = pruefe({ kommentare, pflicht: ['handlungsprodukt.schritte'], antwort: antwort([ers('handlungsprodukt.schritte', neu)]) })
  assert.equal(mitPflicht.vollstaendig, true)
  // Situationswechsel darf die Liste nicht ersetzen.
  const sit = pruefe({ kommentare: [komm('situation_umformulieren', 'situation_text')], antwort: antwort([ers('handlungsprodukt.schritte', neu)]) })
  assert.match(grundVon(sit, 'handlungsprodukt.schritte'), /H24L/)
})

test('Einzel-Hint auf ein umbenanntes Label: verworfen mit Hinweis auf die Schrittliste (F14)', () => {
  const v = pruefe({
    kommentare: [komm('handlungsprodukt_aendern', 'handlungsprodukt.titel')],
    antwort: antwort([ers('handlungsprodukt.schritte[label=01 Neuer Schritt].hint', 'Neuer Hinweis.')]),
  })
  assert.equal(grundVon(v, 'handlungsprodukt.schritte[label=01 Neuer Schritt].hint'), 'Dieser Schritt wurde umbenannt — bitte die ganze Schrittliste markieren.')
})

test('Dossier bei EBA-Situation: Pflicht Info-Karten und Sprachkarte des Hefts, Ersetzung erlaubt (F15)', () => {
  const pflicht = pflichtPfade('situation_umformulieren', 'dossier', DOSSIER, { eba: true, heft: 'A' })
  const kommentare = [komm('situation_umformulieren', 'einleitung.was_ist_das', 'dossier')]
  const basis = { datei: 'dossier', rohOriginal: DOSSIER, rohAktuell: DOSSIER, eba: true, kommentare, pflicht }
  const leer = pruefe({ ...basis, antwort: antwort() })
  assert.equal(leer.vollstaendig, false)
  assert.deepEqual(leer.fehlend, pflicht)
  const nug = kopie(lesePfad(DOSSIER, 'nuggets[id=nugget_A_01]'))
  nug.inhalt = 'Selbst geschriebene Info-Karte zur neuen Situation in kurzen Sätzen.'
  nug.fakten_anker = []
  const v = pruefe({ ...basis, antwort: antwort([ers('nuggets[id=nugget_A_01]', nug, 'dossier')], pflicht.slice(1).map((pfad) => ({ pfad, begruendung: 'Passt weiter.' }))) })
  assert.deepEqual(v.verworfen, [])
  assert.equal(v.ersetzungen[0]?.auftrag, 'situation_umformulieren')
  assert.equal(v.vollstaendig, true)
  // EFZ: nie
  const efz = pruefe({ ...basis, eba: false, antwort: antwort([ers('nuggets[id=nugget_A_01]', nug, 'dossier')]) })
  assert.match(grundVon(efz, 'nuggets[id=nugget_A_01]'), /Dossier/)
})
