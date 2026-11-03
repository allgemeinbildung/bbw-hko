import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, rmSync, mkdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'
import { pruefeEba } from './check-eba.mjs'
import { ladeEinheit, REPO, seiteVonFeld, textfelder, elementSeiten } from './lib/pruefung.mjs'
import { loesungsfelderAus } from './lib/loesungsfelder.mjs'
import { ladeSchema, validiere } from './lib/schema.mjs'

const slug = '1.1.1_lehrvertrag_orientieren_v42'
function fixture() { return ladeEinheit(REPO, slug) }
function codes(E) {
  const out = []
  pruefeEba(E, { fehler: (code) => out.push(code) })
  return out
}

test('Gold erfüllt EBA-Profil, EFZ wird nicht als EBA geprüft', () => {
  assert.deepEqual(codes(fixture()), [])
  assert.deepEqual(codes(ladeEinheit(REPO, '1.3.1_konsum_verantworten_v42')), [])
})

for (const [name, code, mutate] of [
  ['fehlendes Dossier', 'ERR_EBA_DOSSIER', (E) => delete E.json['dossier.json']],
  ['fehlende Ich-Stufen', 'ERR_EBA_KRITERIEN', (E) => delete E.hefte[0].json.feedback_kriterien[0].stufen_lernende],
  ['unpersönliche Stufen', 'ERR_EBA_KRITERIEN', (E) => E.hefte[0].json.feedback_kriterien[0].stufen_lernende.fill('Die Sprache stimmt.')],
  ['Gruppenarbeit', 'ERR_EBA_SOZIALFORM', (E) => E.json['set.json'].gemeinsamer_auftrag.sozialform.zulaessig.push('gruppe')],
  ['Netz als Abgabe', 'ERR_EBA_ABSCHLUSS', (E) => E.hefte[0].json.bewertungsraster[3].vollstaendig_wenn.push('Begriffsnetz ausgefüllt')],
  ['nicht vorhandene Info-Karte', 'ERR_EBA_ANKER', (E) => E.hefte[0].json.leitfragen[0].knoten_ref = 'Dossier | Info-Karte A-99'],
  ['LF-Kürzel', 'ERR_EBA_LF_KUERZEL', (E) => E.hefte[0].json.leitfragen_intro = 'Bearbeiten Sie LF1.'],
  // Gegenlesung 03.11.2026 (Argon zu 2.1.1 und 1.2.1)
  ['Satz über 18 Wörter', 'ERR_A2_SATZ_ZU_LANG', (E) => E.hefte[0].json.situation_text = 'Im Unterricht hat mein Sitznachbar heimlich ein Foto mit dem Smartphone gemacht, auf dem auch die Lehrperson zu sehen ist, und es geteilt.'],
  ['Paragraph im Fall', 'ERR_EBA_PARAGRAPH', (E) => E.json['set.json'].gemeinsamer_auftrag.situation_text += ' Das steht in § 5.'],
  ['Prüferhinweis im Fall', 'ERR_EBA_META', (E) => E.json['kn.json'].hybrid_situation.text = 'Erfundener Fall. ' + E.json['kn.json'].hybrid_situation.text],
  ['kopierte Satzanfänge', 'ERR_EBA_HILFEN_KOPIE', (E) => E.hefte[1].json.leitfragen[0].scaffolding.satzanfaenge = [...E.hefte[0].json.leitfragen[0].scaffolding.satzanfaenge]],
  ['kopierte Strategien', 'ERR_EBA_HILFEN_KOPIE', (E) => E.hefte[1].json.leitfragen[0].scaffolding.strategien = [...E.hefte[0].json.leitfragen[0].scaffolding.strategien]],
  ['gleiches selbst_pruefen', 'ERR_EBA_HILFEN_KOPIE', (E) => { const n = E.json['dossier.json'].nuggets; n[1].recherche.selbst_pruefen = n[0].recherche.selbst_pruefen }],
  ['gleiche so_gehst_du_vor', 'ERR_EBA_HILFEN_KOPIE', (E) => { const s = E.json['dossier.json'].sprachmodi_scaffolds; s[1].so_gehst_du_vor = s[0].so_gehst_du_vor }],
  ['Info-Karte in Ich-Form', 'ERR_EBA_DOSSIER_FORM', (E) => E.json['dossier.json'].nuggets[0].inhalt += ' Ich darf meine Sicht erklären.'],
  ['Fallzahlen auf der Info-Karte', 'ERR_EBA_VORWEG', (E) => { const z = JSON.stringify(E.hefte[0].json.zahlen_tabelle).match(/\d{2,5}/g); E.json['dossier.json'].nuggets[0].beispiel = `Rechnung: ${z[0]} und ${z[1]}.` }],
  ['Tabelle auf Seite 1, die fehlt', 'ERR_EBA_VERWEIS', (E) => { E.hefte[1].json.zahlen_tabelle = []; E.hefte[1].json.spuren.ohne_medien.leitfragen[0].text = 'Ordnen Sie zwei Pflichten aus der Tabelle auf Seite 1 zu.' }],
  ['unbekannte Info-Karte im Text', 'ERR_EBA_VERWEIS', (E) => E.hefte[0].json.leitfragen[0].scaffolding.strategien[0] = 'Lesen Sie Info-Karte A-09.'],
  ['Raster auf einem Schreibfeld', 'ERR_EBA_VERWEIS', (E) => { const ga = E.json['set.json'].gemeinsamer_auftrag; ga.produkte[0].form = 'flaeche'; ga.schritte[ga.produkte[0].schritt - 1].hint = 'Füllen Sie das Raster auf Seite A2 aus.' }],
  ['Legende ohne Zeichen', 'ERR_EBA_LEGENDE', (E) => { const b = E.hefte[0].json.handlungsprodukt.beispielbild; b.legende.push({ key: 'leer', text: 'nie benutzt' }) }],
  ['Plus als Liste', 'ERR_EBA_PLUS', (E) => E.hefte[0].json.lernfortschritt = ['a', 'b', 'c']],
  ['unbekannter KN-Typ', 'ERR_EBA_KN_TYP', (E) => E.json['kn.json'].kn_typen[1].typ = 'mini_case'],
  ['Denkhilfe-Spalten aus Gold', 'ERR_EBA_GOLD_KOPIE', (E) => { E.ordner = 'x.y.z_kopie'; }],
]) test(`EBA-Tor erkennt ${name}`, () => {
  const E = fixture(); mutate(E); assert.ok(codes(E).includes(code))
})

test('Seitenzuordnung unterscheidet EBA und EFZ', () => {
  assert.equal(seiteVonFeld('spuren.ohne_medien.leitfragen[LF2].text', 'EBA_2J'), 3)
  assert.equal(seiteVonFeld('spuren.ohne_medien.leitfragen[LF3].text', 'EBA_2J'), 4)
  assert.equal(seiteVonFeld('handlungsprodukt.beispielbild.titel', 'EBA_2J'), 5)
  assert.equal(seiteVonFeld('feedback_kriterien[0].stufen[0]', 'EBA_2J'), 7)
  assert.equal(seiteVonFeld('feedback_kriterien[0].stufen[0]', 'EFZ_3J'), 5)
  assert.equal(seiteVonFeld('handlungsprodukt.beispielbild.titel', 'EFZ_3J'), 6)
})

test('nicht gedruckte Netz-Lösungen brauchen bei EBA keine Auditfelder', () => {
  const E = fixture()
  assert.ok(!loesungsfelderAus(E.json).some((f) => /abschluss_(verbindung|transfer|knoten)/.test(f.art)))
  assert.ok(textfelder(E, { dossier: true }).some((f) => f.datei === 'dossier.json' && /inhalt/.test(f.pfad)))
})

test('Dossierbeleg-Schema erzwingt Karte und Dokument', () => {
  const z = { feld: 'herausforderung_A.json › leitfragen[LF1].loesung.kern', spur: 'beide', herkunft: 'dossier', wo: 'dossier.json', stelle: 'nugget_A_01', anker: 'fünf ganze Wörter stehen hier', urteil: 'stimmt', hash: 'a'.repeat(64), geprueft_am: '2026-11-03', von: { rolle: 'Audit', modell: 'Test' } }
  const d = { format: 'bbw-hko/belege@1', einheit: slug, zeilen: [z] }
  assert.deepEqual(validiere(ladeSchema('belege'), d), [])
  z.stelle = 'unbekannt'; assert.ok(validiere(ladeSchema('belege'), d).length)
})

test('EBA-Entwurf mit defekter Kopplung scheitert trotz Baseline', () => {
  const dir = mkdtempSync(join(tmpdir(), 'hko-eba-tor-'))
  try {
    const data = join(dir, 'src', 'data', 'einheiten', slug)
    mkdirSync(data, { recursive: true }); mkdirSync(join(dir, 'scripts'))
    writeFileSync(join(dir, 'scripts', 'check-einheiten.mjs'), readFileSync(join(REPO, 'scripts', 'check-einheiten.mjs')))
    const E = fixture()
    E.json['herausforderung_A.json'].leitfragen = []
    for (const [f, d] of Object.entries(E.json)) writeFileSync(join(data, f), JSON.stringify(d))
    const run = () => spawnSync(process.execPath, [join(dir, 'scripts', 'check-einheiten.mjs'), slug], { encoding: 'utf8' })
    const r = run()
    assert.equal(r.status, 1, r.stdout + r.stderr)
    assert.match(r.stdout, /ERR_KOPPLUNG_NICHT_1ZU1/)
    assert.doesNotMatch(r.stdout, /EINGEFROREN/)
    // Auch --baseline darf den nächsten normalen Lauf nicht grün machen.
    spawnSync(process.execPath, [join(dir, 'scripts', 'check-einheiten.mjs'), slug, '--baseline'])
    assert.equal(run().status, 1)
  } finally { rmSync(dir, { recursive: true, force: true }) }
})

test('Blindpaket enthält Dossier und EBA-Rollen, Probe die echte Abwägungsfrage', () => {
  const dir = mkdtempSync(join(tmpdir(), 'hko-eba-audit-'))
  try {
    for (const [file, flags] of [['blind.md', []], ['probe.md', ['--probe']]]) {
      const out = join(dir, file)
      const r = spawnSync(process.execPath, ['scripts/audit-paket.mjs', slug, '--heft', 'A', '--spur', 'ohne_medien', '--out', out, ...flags], { cwd: REPO, encoding: 'utf8' })
      assert.equal(r.status, 0, r.stdout + r.stderr)
      const text = readFileSync(out, 'utf8')
      if (file === 'blind.md') {
        assert.match(text, /nugget_A_01/)
        assert.match(text, /drei Zeilen inklusive Beispielzeile/)
        assert.doesNotMatch(text, /beschrifte die Verbindungen des Begriffsnetzes/)
      } else {
        assert.match(text, /Abwägungsfrage Leitfrage 3/)
        assert.doesNotMatch(text, /leitfragen\[LF4\]/)
      }
    }
  } finally { rmSync(dir, { recursive: true, force: true }) }
})

// Jede Negativprobe verändert nur die frisch geladene Kopie im Speicher.
for (const bereich of ['auftrag', 'kn', 'heft']) {
  const liste = (E) => bereich === 'auftrag' ? E.json['set.json'].gemeinsamer_auftrag.feedback_kriterien
    : bereich === 'kn' ? E.json['kn.json'].rubrik_shared.kriterien : E.hefte[0].json.feedback_kriterien
  for (const [name, mutate] of [
    ['fehlender Name', (k) => delete k.name_lernende],
    ['leerer Name', (k) => k.name_lernende = ' '],
    ['fehlende Stufen', (k) => delete k.stufen_lernende],
    ['leere Stufe', (k) => k.stufen_lernende[0] = ' '],
    ['Stufenzahl', (k) => k.stufen_lernende.pop()],
    ['Abweichung zum KN', (k) => k.stufen.pop()],
    ['falscher Datentyp', (k) => k.name_lernende = 42],
    ['keine Ich-Form', (k) => k.stufen_lernende.fill('Die Leistung stimmt.')],
  ]) test(`${bereich}: ${name}`, () => {
    const E = fixture(); mutate(liste(E)[0]); assert.ok(codes(E).includes('ERR_EBA_KRITERIEN'))
  })
}
for (const [name, code, mutate] of [
  ['fehlendes Niveau', 'ERR_EBA_NIVEAU', (E) => delete E.json['kn.json'].rubrik_shared.niveaubaender[0].definition_lernende],
  ['leeres Niveau', 'ERR_EBA_NIVEAU', (E) => E.json['kn.json'].rubrik_shared.niveaubaender[1].definition_lernende = ' '],
  ...[undefined, [], {}, [{ begriff: 'Frist', definition: '' }], [{ begriff: 3, definition: 'Zeit' }]].map((wert, i) =>
    [`Wörterstruktur ${i}`, 'ERR_EBA_WOERTER', (E) => E.json['set.json'].gemeinsamer_auftrag.woerter = wert]),
  ...[undefined, {}, { spalten: [], zeilen: 3 }, { spalten: [' '], zeilen: 3 }, { spalten: ['Was?'], zeilen: 0 }, { spalten: ['Was?'], zeilen: 1.5 }, { spalten: ['Was?'], zeilen: '3' }].map((wert, i) =>
    [`Tabellenstruktur ${i}`, 'ERR_EBA_TABELLE', (E) => E.json['kn.json'].kn_typen[1].aufgaben[0].tabelle = wert]),
  ...['Glossar (S. 8)', 'Begriffe und Glossar (S. 8)', 'Wichtige Wörter (S. 8)'].map((text) =>
    [text, 'ERR_EBA_HEFT_BEZUG', (E) => E.json['set.json'].gemeinsamer_auftrag.heft_bezug[0].inhalte[0] = text]),
]) test(`EBA-Tor erkennt ${name}`, () => {
  const E = fixture(); mutate(E); assert.ok(codes(E).includes(code))
})
for (const wort of ['Hybrid-Herausforderung', 'K-Decke', ...Array.from({ length: 6 }, (_, i) => `K${i + 1}`), ...Array.from({ length: 4 }, (_, i) => `LF${i + 1}`), 'Bloom', 'Komplexität']) {
  test(`KN-Sperrwort ${wort}`, () => {
    const E = fixture(); E.json['kn.json'].kn_typen[1].aufgaben[0].aufgabe += ` ${wort}`
    assert.ok(codes(E).includes('ERR_EBA_KN_SPRACHE'))
  })
}
test('KN-Sprachprüfung erreicht alle gedruckten Feldgruppen', () => {
  for (const mutate of [
    (k) => k.hybrid_situation.titel = 'Hybrid',
    (k) => k.hybrid_situation.definition_kurz = 'Hybrid',
    (k) => k.kn_typen[0].format = 'K-Decke',
    (k) => k.kn_typen[0].label = 'K1',
    (k) => k.kn_typen[0].ablauf.push('LF1'),
    (k) => k.kn_typen[0].fragestruktur[0].frage = 'K2',
    (k) => k.kn_typen[1].aufgaben[0].tabelle.spalten[0] = 'LF2',
    (k) => k.kn_typen[2].reflexionsfragen[0] = 'LF3',
    (k) => k.rubrik_shared.kriterien[0].name_lernende = 'Hybrid',
    (k) => k.rubrik_shared.kriterien[0].stufen_lernende[0] = 'Ich kann K3.',
    (k) => k.rubrik_shared.niveaubaender[0].definition_lernende = 'K4',
  ]) {
    const E = fixture(); mutate(E.json['kn.json']); assert.ok(codes(E).includes('ERR_EBA_KN_SPRACHE'))
  }
})
test('LP- und Technikfelder lösen keine KN-Sprachfehler aus', () => {
  const E = fixture(); const k = E.json['kn.json']
  k.hybrid_situation.definition_lang = 'Hybrid K-Decke K1 LF1 Bloom'
  k.hybrid_situation.alignment_note.new_dimensions.push('Hybrid LF2')
  k.kn_typen[0].fragestruktur[0].typ = 'Hybrid K2 LF3'
  k.kn_typen[0].fragestruktur[0].k_stufe = 3
  k.kn_typen[0].sprachmodi.push('Hybrid LF4')
  k.kn_typen[2].optional_praesentation = 'Hybrid LF1'
  assert.deepEqual(codes(E), [])
})
test('Tabelle ist ohne Tabellenauftrag optional, Wörter gehören bei EBA auf S. 2', () => {
  const E = fixture(); const a = E.json['kn.json'].kn_typen[1].aufgaben[0]
  a.aufgabe = 'Schreiben Sie drei Sätze.'; delete a.tabelle
  assert.deepEqual(codes(E), [])
  assert.deepEqual(elementSeiten('EBA_2J').filter((e) => e.wort.test('Wichtige Wörter')).map((e) => e.seiten), [[2]])
  assert.equal(elementSeiten('EBA_2J').some((e) => e.wort.test('Glossar')), false)
  assert.deepEqual(elementSeiten('EFZ_3J').find((e) => e.wort.test('Glossar')).seiten, [8])
})
