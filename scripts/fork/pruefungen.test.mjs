// Fork-Pilot: automatische Prüfungen der Modellvorschläge (Entscheid F18). Reines node:test.
// Alle Texte sind für diesen Test selbst geschrieben (Invariante 7).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { duFormen, duFormenIn, pruefeAnrede, zahlenWarnungen, zahlenVon } from '../../src/lib/fork/pruefungen.ts'
import { pruefeVorschlag } from '../../src/lib/fork/vorschlag.ts'

const BASIS = join(import.meta.dirname, '../../src/data')
const A = JSON.parse(readFileSync(join(BASIS, 'einheiten', '1.3.1_konsum_verantworten_v42', 'herausforderung_A.json'), 'utf8'))

test('Du-Formen: Wortgrenzen, Gross-/Kleinschreibung, Zitate zählen nicht', () => {
  assert.deepEqual(duFormen('Planen Sie dein Budget. Du bist dran.'), ['dein', 'du'])
  assert.deepEqual(duFormen('Dübel, Duden, dirigieren, Dirndl, Sie, Ihr Budget'), [])
  assert.deepEqual(duFormen('Lea fragt: «Kannst du mir helfen?» Antworten Sie ihr.'), [])
  assert.deepEqual(duFormen('Er sagt „Gib mir dein Heft“.'), [])
  assert.deepEqual(duFormen('Was wollt ihr? Ich sage euch: eure Liste fehlt.'), ['euch', 'eure'])
})

test('Anrede: verworfen nur, wenn das Original des Felds nicht duzt; Gesprächszüge erlaubt', () => {
  assert.match(pruefeAnrede('Schreib deine Antwort auf.', 'Schreiben Sie Ihre Antwort auf.'), /Du-Anrede \(«deine»\)/)
  assert.match(pruefeAnrede({ titel: 'Ziel', schritte: ['Notiere dir drei Punkte.'] }, { titel: 'Ziel' }), /«dir»/)
  assert.equal(pruefeAnrede('Schreiben Sie Ihre Antwort auf.', 'Schreiben Sie Ihre Antwort auf.'), null)
  // Rollenspiel-Lösung duzt schon im Original.
  assert.equal(pruefeAnrede('Du hast recht, ich ändere es.', 'Du siehst das anders.'), null)
  // Gesprächszüge eines Beispielbilds sind wörtliche Rede.
  const bild = { bloecke: [{ wechsel: [{ text: 'Warum sagst du das?' }, { text: 'Weil dein Plan fehlt.' }] }] }
  assert.deepEqual(duFormenIn(bild), [])
  assert.equal(pruefeAnrede(bild, { bloecke: [] }), null)
})

test('Zahlen: Tausender, Dezimal, Daten und Nummern', () => {
  const m = zahlenVon({ a: "Lohn 1'200 Franken, Rest 1200", b: 'Seite 381, Preis 12.50', c: 'Einheit 1.3.1 am 14.11.2026', d: 'Schritt 2 von 5' })
  assert.deepEqual([...m.keys()].sort(), ['1200', '12.50', '381'].sort())
  assert.equal(m.get('1200').length, 2)
})

test('Zahlen: Warnung nur, wenn eine mehrfache Zahl teilweise geändert wird', () => {
  const vor = { a: 'Lohn 650 Franken', b: ['Sie verdienen 650.–', 'Miete 900'], c: 'Rest 900' }
  assert.deepEqual(zahlenWarnungen(vor, { ...vor, a: 'Lohn 700 Franken' }), [{ zahl: '650', vorher: 2, nachher: 1, pfade: ['b[0]'] }])
  // Überall geändert: stimmig, keine Warnung.
  assert.deepEqual(zahlenWarnungen(vor, { ...vor, a: 'Lohn 700', b: ['Sie verdienen 700.–', 'Miete 900'] }), [])
  // Unverändert oder nur einmal vorhanden: keine Warnung.
  assert.deepEqual(zahlenWarnungen(vor, vor), [])
  assert.deepEqual(zahlenWarnungen({ a: 'Preis 450' }, { a: 'Preis 500' }), [])
})

const ers = (pfad, wert) => ({ datei: 'herausforderung_A', pfad, wert_json: JSON.stringify(wert), begruendung: 'Testbegründung' })
const vorschlag = (kommentare, ersetzungen) => pruefeVorschlag({
  datei: 'herausforderung_A', rohOriginal: A, rohAktuell: A, eba: false, buendelId: '00000000-0000-4000-8000-000000000001',
  pflicht: [], methodenRefs: new Set(), antwort: { ersetzungen, bestaetigt: [], hinweis: '' }, kommentare,
})

test('Vorschlag: Leitfrage mit Du-Anrede wird verworfen (F18)', () => {
  const k = [{ auftrag: 'leitfrage_umformulieren', datei: 'herausforderung_A', pfad: 'leitfragen[nr=1].text', kommentar: 'Einfacher bitte.' }]
  const v = vorschlag(k, [ers('leitfragen[nr=1].text', 'Erkläre mit Maslow, was du zum Leben brauchst und was du dir nur wünschst.')])
  assert.equal(v.ersetzungen.length, 0)
  assert.match(v.verworfen[0].grund, /Du-Anrede/)
  const ok = vorschlag(k, [ers('leitfragen[nr=1].text', 'Erklären Sie mit Maslow, was Sie zum Leben brauchen und was Sie sich nur wünschen.')])
  assert.equal(ok.ersetzungen.length, 1)
  assert.equal(ok.zahlen_warnungen, undefined)
})

test('Vorschlag: Situation ändert eine mehrfache Zahl nur einmal → Warnung, nicht verworfen (F18)', () => {
  assert.ok(A.situation_text.includes('300 Franken'))
  assert.ok(zahlenVon(A).get('300').length >= 2)
  const k = [{ auftrag: 'situation_umformulieren', datei: 'herausforderung_A', pfad: 'situation_text', kommentar: 'Anderer Betrag.' }]
  const v = vorschlag(k, [ers('situation_text', A.situation_text.replace('300 Franken', '350 Franken'))])
  assert.equal(v.ersetzungen.length, 1)
  assert.equal(v.zahlen_warnungen?.[0]?.zahl, '300')
})
