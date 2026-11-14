// Test der Positivliste (VERTRAG §3–§6). Aufruf: node --test scripts/fork/positivliste.test.mjs
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import {
  FELDER, AUFTRAEGE, feldFuer, konkretePfade, darfForken, istV42Einheit, erlaubtFuerAuftrag,
  zielFelder, pflichtPfade, pruefeWert, warnungen, lpTexte, WARNTEXTE,
} from '../../src/lib/fork/positivliste.ts'
import { lesePfad } from '../../src/lib/fork/adresse.ts'

const BASIS = join(import.meta.dirname, '../../src/data')
const lies = (einheit, datei) => JSON.parse(readFileSync(join(BASIS, 'einheiten', einheit, `${datei}.json`), 'utf8'))
const EFZ = '1.3.1_konsum_verantworten_v42'
const EBA = '1.1.1_lehrvertrag_orientieren_v42'
const gold = {
  efz: { A: lies(EFZ, 'herausforderung_A'), B: lies(EFZ, 'herausforderung_B'), set: lies(EFZ, 'set') },
  eba: { A: lies(EBA, 'herausforderung_A'), B: lies(EBA, 'herausforderung_B'), set: lies(EBA, 'set'), dossier: lies(EBA, 'dossier') },
}
const METHODEN = new Set(readdirSync(join(BASIS, 'methoden')).filter((f) => f.endsWith('.json') && !f.startsWith('_')).map((f) => f.slice(0, -5)))
const kopie = (v) => JSON.parse(JSON.stringify(v))
const ctx = { methodenRefs: METHODEN }

// Felder des Vertrags, die in keiner v4.2-Einheit auf der Platte stehen (nur in types.ts).
const NICHT_IN_GOLD = ['handlungsprodukt.schreib_label', 'handlungsprodukt.schreib_note', 'handlungsprodukt.scaffolding']

test('jedes Muster trifft einen echten Pfad einer Gold-Einheit und führt zurück auf sich', () => {
  for (const f of FELDER) {
    if (NICHT_IN_GOLD.includes(f.muster)) {
      for (const g of [gold.efz.A, gold.efz.B, gold.eba.A, gold.eba.B]) assert.equal(konkretePfade(f.muster, g).length, 0, f.muster)
      continue
    }
    const quellen = f.datei === 'heft'
      ? (f.nurEba ? [['herausforderung_A', gold.eba.A], ['herausforderung_B', gold.eba.B]]
        : [['herausforderung_A', gold.efz.A], ['herausforderung_B', gold.efz.B], ['herausforderung_A', gold.eba.A]])
      : f.datei === 'set' ? [['set', gold.efz.set], ['set', gold.eba.set]] : [['dossier', gold.eba.dossier]]
    let treffer = 0
    for (const [datei, roh] of quellen) {
      for (const p of konkretePfade(f.muster, roh)) {
        treffer++
        assert.notEqual(lesePfad(roh, p), undefined, p)
        assert.equal(feldFuer(datei, p), f, `${datei}:${p} → ${f.nr}`)
      }
    }
    assert.ok(treffer > 0, `${f.nr} ${f.muster} trifft nichts`)
  }
})

test('nie ersetzbar → feldFuer null', () => {
  const heft = [
    'template', 'lehrgang', 'nrlp.nr', 'nrlp', 'buchstabe', 'id', 'modul', 'sit_farbe', 'leitfragen[nr=1].nr',
    'leitfragen[nr=1].bloom', 'leitfragen[nr=1].antwortform', 'leitfragen[nr=1].feld_hoehe_mm',
    'feedback_kriterien[kn_kriterium=Fachkorrektheit].kn_kriterium', 'feedback_kriterien[kn_kriterium=Fachkorrektheit].dimension',
    'feedback_kriterien[kn_kriterium=Fachkorrektheit]', 'feedback_kriterien',
    'handlungsprodukt.schritte[label=01 Karte einteilen].label', 'handlungsprodukt.schritte[label=01 Karte einteilen]',
    'spuren.mit_medien.quellen', 'spuren.ohne_medien.leitfragen[nr=3].raster.zeilen', 'spuren.mit_medien.leitfragen[nr=3].raster.quelle_ref',
    'spuren.mit_medien.leitfragen[nr=3].raster.vorgabe', 'spuren.ohne_medien.leitfragen[nr=4].pol_typ', 'mehrdeutigkeit.trade_off',
    'spuren.ohne_medien.methoden_ref_rezeption', 'methoden[ref=__spur__]', 'methoden[ref=hko-bedarf-oder-wunsch].ref', 'methoden',
    'prinzip_handoff', 'sk_anker', 'dekontextualisierung', 'leitfragen', 'leitfragen[3].text', 'leitfragen[nr=x].text',
    'spuren.mit_medien.leitfragen[nr=3].raster.knoten_ref', 'spuren.mit_medien.leitfragen[nr=3].raster.beispielzeile', 'spuren.mit_medien.kasten_s4',
  ]
  for (const p of heft) assert.equal(feldFuer('herausforderung_A', p), null, p)
  for (const p of ['glossar', 'gemeinsamer_auftrag.schritte[label=x].label', 'gemeinsamer_auftrag.feedback_kriterien[kn_kriterium=x].dimension', 'gemeinsamer_auftrag.mehrdeutigkeit.trade_off', 'status'])
    assert.equal(feldFuer('set', p), null, p)
  for (const p of ['id', 'kopf', 'lehrgang', 'sprachniveau', 'template', 'einleitung.so_benutzt_du_es', 'leseblatt.titel', 'nuggets[id=nugget_A_01].inhalt'])
    assert.equal(feldFuer('dossier', p), null, p)
  assert.equal(feldFuer('kn', 'titel'), null)
})

test('darfForken nur kt1, istV42Einheit nur mit zwei v4.2-Heften', () => {
  assert.equal(darfForken('kt1'), true)
  for (const r of ['lp', 'gast', 'reviewer', '', null, undefined, 'KT1']) assert.equal(darfForken(r), false)
  assert.equal(istV42Einheit({ A: gold.efz.A, B: gold.efz.B }), true)
  assert.equal(istV42Einheit({ A: gold.efz.A, B: { template: 'default_4page_v2' } }), false)
  assert.equal(istV42Einheit({ A: gold.efz.A }), false)
  assert.equal(istV42Einheit(null), false)
})

test('Aufträge: Labels, Ziel, erlaubt', () => {
  assert.deepEqual(Object.keys(AUFTRAEGE).sort(), ['eigener_text', 'handlungsprodukt_aendern', 'leitfrage_umformulieren', 'situation_umformulieren'])
  assert.ok(zielFelder('leitfrage_umformulieren').some((f) => f.muster === 'gemeinsamer_auftrag.leitfrage'))
  assert.deepEqual([...new Set(zielFelder('handlungsprodukt_aendern').map((f) => f.nr))].sort(), ['G5', 'G6L', 'G9', 'H22', 'H23', 'H24L'])
  const e = { eba: false }
  assert.equal(erlaubtFuerAuftrag('eigener_text', 'herausforderung_A', 'spuren.ohne_medien.leitfragen[nr=3].text', e), null)
  assert.match(erlaubtFuerAuftrag('eigener_text', 'herausforderung_A', 'spuren.mit_medien.leitfragen[nr=3].text', e), /ohne Medien/)
  assert.match(erlaubtFuerAuftrag('leitfrage_umformulieren', 'herausforderung_A', 'leitfragen[nr=1].loesung', e), /Lösung/)
  assert.equal(erlaubtFuerAuftrag('leitfrage_umformulieren', 'herausforderung_A', 'leitfragen[nr=1].text', e), null)
  assert.match(erlaubtFuerAuftrag('leitfrage_umformulieren', 'herausforderung_A', 'leitfragen[nr=2].text', { eba: false, zielLeitfragen: [1] }), /derselben/)
  assert.match(erlaubtFuerAuftrag('leitfrage_umformulieren', 'set', 'gemeinsamer_auftrag.auftrag', e), /Leitfrage/)
  assert.equal(erlaubtFuerAuftrag('eigener_text', 'dossier', 'glossar', { eba: true }), null)
  assert.match(erlaubtFuerAuftrag('eigener_text', 'dossier', 'glossar', { eba: false }), /Dossier/)
  // F15: Situations- und Produktwechsel ziehen das EBA-Dossier mit.
  assert.equal(erlaubtFuerAuftrag('situation_umformulieren', 'dossier', 'glossar', { eba: true }), null)
  assert.equal(erlaubtFuerAuftrag('handlungsprodukt_aendern', 'dossier', 'nuggets[id=nugget_A_01]', { eba: true }), null)
  assert.match(erlaubtFuerAuftrag('situation_umformulieren', 'dossier', 'glossar', { eba: false }), /Dossier/)
  assert.match(erlaubtFuerAuftrag('leitfrage_umformulieren', 'dossier', 'glossar', { eba: true }), /Dossier/)
  // F14: die ganze Schrittliste nur beim Produktwechsel.
  assert.equal(erlaubtFuerAuftrag('handlungsprodukt_aendern', 'herausforderung_A', 'handlungsprodukt.schritte', e), null)
  assert.equal(erlaubtFuerAuftrag('handlungsprodukt_aendern', 'set', 'gemeinsamer_auftrag.schritte', e), null)
  assert.match(erlaubtFuerAuftrag('situation_umformulieren', 'herausforderung_A', 'handlungsprodukt.schritte', e), /H24L/)
  assert.match(erlaubtFuerAuftrag('situation_umformulieren', 'set', 'gemeinsamer_auftrag.schritte', e), /G6L/)
  assert.match(erlaubtFuerAuftrag('situation_umformulieren', 'herausforderung_A', 'handlungsprodukt.titel', e), /H22/)
  assert.match(erlaubtFuerAuftrag('handlungsprodukt_aendern', 'herausforderung_A', 'feedback_kriterien[kn_kriterium=x].name_lernende', e), /EBA/)
  assert.equal(erlaubtFuerAuftrag('handlungsprodukt_aendern', 'herausforderung_A', 'feedback_kriterien[kn_kriterium=x].name_lernende', { eba: true }), null)
  assert.match(erlaubtFuerAuftrag('handlungsprodukt_aendern', 'herausforderung_A', 'template', e), /Positivliste/)
})

test('pflichtPfade handlungsprodukt_aendern auf EFZ-A', () => {
  const p = pflichtPfade('handlungsprodukt_aendern', 'herausforderung_A', gold.efz.A, { eba: false })
  const mit = (re) => p.filter((x) => re.test(x))
  // F14: Pflicht ist die ganze Schrittliste (H24L), nicht die Einzel-Hints.
  assert.ok(p.includes('handlungsprodukt.schritte'))
  assert.equal(mit(/^handlungsprodukt\.schritte\[/).length, 0)
  for (const k of ['Fachkorrektheit', 'Position / Werthaltung']) {
    assert.ok(p.includes(`feedback_kriterien[kn_kriterium=${k}].indikator_produkt`))
    assert.ok(p.includes(`feedback_kriterien[kn_kriterium=${k}].stufen`))
  }
  assert.deepEqual(mit(/^methoden/).sort(), ['methoden[ref=hko-bedarf-oder-wunsch]', 'methoden[ref=lm-17-2-stichwortnotizen]', 'methoden[ref=lm-17-3-3b-schema]'])
  for (const x of ['handlungsprodukt.titel', 'handlungsprodukt.beschreibung', 'handlungsprodukt.abgaben', 'handlungsprodukt.beispielbild',
    'handlungsprodukt.loesungsbild', 'bewertungsraster', 'lernfortschritt.scaffold_90', 'lernfortschritt.scaffold_100',
    'leitfragen[nr=1].liefert', 'spuren.mit_medien.leitfragen[nr=4].scaffolding']) assert.ok(p.includes(x), x)
  assert.ok(!p.some((x) => /name_lernende|__spur__|schreib_/.test(x)))
  for (const x of p) assert.notEqual(lesePfad(gold.efz.A, x), undefined, x)
  const ps = pflichtPfade('handlungsprodukt_aendern', 'set', gold.efz.set, { eba: false })
  assert.ok(ps.includes('gemeinsamer_auftrag.schritte'))
  assert.equal(ps.filter((x) => x.endsWith('.hint') && x.includes('schritte')).length, 0)
  assert.equal(ps.filter((x) => x.endsWith('.stufen')).length, 4)
})

test('pflichtPfade eigener_text, situation_umformulieren, EBA-Dossier', () => {
  const p = pflichtPfade('eigener_text', 'herausforderung_A', gold.efz.A, { eba: false, geaenderteLeitfragen: [3] })
  assert.ok(p.includes('spuren.ohne_medien.leitfragen[nr=3].text'))
  assert.ok(p.includes('spuren.ohne_medien.leitfragen[nr=3].raster.beispielzeile'))
  assert.ok(p.includes('quellen_anker') && p.includes('abschluss'))
  assert.ok(!p.some((x) => x.startsWith('spuren.mit_medien') || x.includes('kasten_s4') || x.includes('nr=4')))
  const p4 = pflichtPfade('eigener_text', 'herausforderung_A', gold.efz.A, { eba: false, geaenderteLeitfragen: [4] })
  assert.ok(p4.includes('spuren.ohne_medien.kasten_s4') && p4.includes('spuren.ohne_medien.leitfragen[nr=4].loesung'))
  const s = pflichtPfade('situation_umformulieren', 'herausforderung_A', gold.efz.A, { eba: false })
  assert.equal(s.filter((x) => x.endsWith('.loesung')).length, 6) // LF1, LF2 + je zwei pro Spur
  const d = pflichtPfade('eigener_text', 'dossier', gold.eba.dossier, { eba: true, geaenderteLeitfragen: [2], heft: 'A' })
  assert.deepEqual(d.filter((x) => x.startsWith('nuggets')), ['nuggets[id=nugget_A_02]'])
  for (const x of ['glossar', 'leseblatt.richtig_falsch', 'leseblatt.w_fragen', 'leseblatt.vokabeln']) assert.ok(d.includes(x), x)
  assert.deepEqual(pflichtPfade('eigener_text', 'dossier', gold.eba.dossier, { eba: false }), [])
  const h = pflichtPfade('handlungsprodukt_aendern', 'herausforderung_A', gold.eba.A, { eba: true })
  assert.equal(h.filter((x) => /name_lernende|stufen_lernende/.test(x)).length, 4)
})

test('Budgets und Form', () => {
  const A = gold.efz.A
  const sit = A.situation_text
  const n = sit.length
  const max = Math.ceil((n * 115) / 100)
  assert.equal(pruefeWert('herausforderung_A', 'situation_text', sit, 'x'.repeat(max), ctx), null)
  assert.match(pruefeWert('herausforderung_A', 'situation_text', sit, 'x'.repeat(max + 1), ctx), /zu lang/)
  assert.equal(pruefeWert('herausforderung_A', 'titel', 'kurz', 'y'.repeat(60), ctx), null)
  assert.match(pruefeWert('herausforderung_A', 'titel', 'kurz', 'y'.repeat(61), ctx), /zu lang/)
  assert.match(pruefeWert('herausforderung_A', 'titel', 'kurz', 42, ctx), /Form/)
  assert.match(pruefeWert('herausforderung_A', 'handlungsprodukt.schreib_note', undefined, 'neu', ctx), /fehlt/)
  const K = 'feedback_kriterien[kn_kriterium=Fachkorrektheit].stufen'
  const st = lesePfad(A, K)
  assert.equal(pruefeWert('herausforderung_A', K, st, st.map((x) => x.slice(0, 20)), ctx), null)
  assert.match(pruefeWert('herausforderung_A', K, st, st.slice(0, 3), ctx), /Anzahl/)
  const wp = kopie(A.wochen_plan); wp[0].label = 'Woche 1'
  assert.match(pruefeWert('herausforderung_A', 'wochen_plan', A.wochen_plan, wp, ctx), /label/)
  const wp2 = kopie(A.wochen_plan); wp2[0].text = 'Situation lesen'
  assert.equal(pruefeWert('herausforderung_A', 'wochen_plan', A.wochen_plan, wp2, ctx), null)
  const sp = 'spuren.ohne_medien.leitfragen[nr=3].raster.spalten'
  const spo = lesePfad(A, sp)
  const spn = [...spo]; spn[spn.length - 1] = 'anders'
  assert.match(pruefeWert('herausforderung_A', sp, spo, spn, ctx), /-1/)
  const lo = 'spuren.ohne_medien.leitfragen[nr=3].loesung'
  const loo = lesePfad(A, lo); const lon = kopie(loo); lon.raster_zeilen[0].pop()
  assert.match(pruefeWert('herausforderung_A', lo, loo, lon, ctx), /raster_zeilen/)
  const bb = kopie(A.handlungsprodukt.beispielbild); bb.bloecke[0] = { titel: 'x', text: ['y'] }
  assert.match(pruefeWert('herausforderung_A', 'handlungsprodukt.beispielbild', A.handlungsprodukt.beispielbild, bb, ctx), /Blockart/)
  const m = 'methoden[ref=hko-bedarf-oder-wunsch]'
  assert.equal(pruefeWert('herausforderung_A', m, lesePfad(A, m), { ref: 'lm-17-1-sq3r', fuer: 'Lesen' }, ctx), null)
  assert.match(pruefeWert('herausforderung_A', m, lesePfad(A, m), { ref: 'erfunden', fuer: 'Lesen' }, ctx), /gibt es nicht/)
  assert.match(pruefeWert('herausforderung_A', m, lesePfad(A, m), { ref: '__spur__' }, ctx), /__spur__/)
  const begriffe = gold.efz.set.glossar.map((g) => g.begriff)
  const mm = kopie(A.mindmap_aeste)
  assert.equal(pruefeWert('herausforderung_A', 'mindmap_aeste', A.mindmap_aeste, mm, { ...ctx, glossarBegriffe: begriffe }), null)
  mm[0].punkte = ['Erfundenes Wort']
  assert.match(pruefeWert('herausforderung_A', 'mindmap_aeste', A.mindmap_aeste, mm, { ...ctx, glossarBegriffe: begriffe }), /Nicht im Glossar/)
  const mm2 = kopie(A.mindmap_aeste); mm2[3].transfer = false
  assert.match(pruefeWert('herausforderung_A', 'mindmap_aeste', A.mindmap_aeste, mm2, { ...ctx, glossarBegriffe: begriffe }), /transfer/)
  const D = gold.eba.dossier
  const nug = kopie(D.nuggets[0])
  nug.fakten_anker = []; nug.inhalt = 'Ein eigener, kurzer Text.'
  assert.equal(pruefeWert('dossier', 'nuggets[id=nugget_A_01]', D.nuggets[0], nug, ctx), null)
  assert.match(pruefeWert('dossier', 'nuggets[id=nugget_A_01]', D.nuggets[0], { ...nug, inhalt: 'a'.repeat(701) }, ctx), /700/)
  assert.match(pruefeWert('dossier', 'nuggets[id=nugget_A_01]', D.nuggets[0], { ...nug, fakten_anker: D.nuggets[0].fakten_anker }, ctx), /fakten_anker/)
  assert.match(pruefeWert('dossier', 'nuggets[id=nugget_A_01]', D.nuggets[0], { ...nug, tag: 'B' }, ctx), /tag/)
  const ids = D.glossar.map((g) => g.id)
  assert.equal(pruefeWert('dossier', 'leseblatt.vokabeln', D.leseblatt.vokabeln, ids.slice(0, 6), { ...ctx, glossarIds: ids }), null)
  assert.match(pruefeWert('dossier', 'leseblatt.vokabeln', D.leseblatt.vokabeln, [...ids.slice(0, 5), 'gibtsnicht'], { ...ctx, glossarIds: ids }), /Nicht im Glossar/)
  assert.match(pruefeWert('dossier', 'glossar', D.glossar, D.glossar.slice(0, 11), ctx), /Anzahl/)
  assert.match(pruefeWert('dossier', 'glossar', D.glossar, [...D.glossar.slice(0, 12), D.glossar[0]], ctx), /eindeutig/)
})

test('LP-Leck: Lösungstext in einem Feld für Lernende wird verworfen', () => {
  const A = gold.efz.A
  const lp = lpTexte('herausforderung_A', A)
  const kern = A.leitfragen[0].loesung.kern
  assert.ok(lp.includes(kern) && kern.length >= 40)
  assert.ok(lp.some((t) => A.spuren.ohne_medien.kasten_s4.loesung_zeilen.flat().includes(t)))
  const p = 'leitfragen[nr=1].scaffolding'
  const o = A.leitfragen[0].scaffolding
  const n = kopie(o); n.produkt = kern.slice(0, 45)
  assert.match(pruefeWert('herausforderung_A', p, o, n, { ...ctx, lpTexte: lp }), /Lösung/)
  n.produkt = kern.slice(0, 39)
  assert.equal(pruefeWert('herausforderung_A', p, o, n, { ...ctx, lpTexte: lp }), null)
  // LP-Feld selbst darf Lösungstext tragen; ebenso der LP-Teil eines gemischten Blocks.
  assert.equal(pruefeWert('herausforderung_A', 'leitfragen[nr=1].loesung', A.leitfragen[0].loesung, A.leitfragen[0].loesung, { ...ctx, lpTexte: lp }), null)
  assert.equal(pruefeWert('herausforderung_A', 'spuren.ohne_medien.kasten_s4', A.spuren.ohne_medien.kasten_s4, A.spuren.ohne_medien.kasten_s4, { ...ctx, lpTexte: lp }), null)
})

test('Warnungen: Wortlaut aus §5, {liste} aus dem Pfad', () => {
  const w = warnungen([
    { datei: 'herausforderung_A', pfad: 'handlungsprodukt.titel', auftrag: 'handlungsprodukt_aendern' },
    { datei: 'herausforderung_A', pfad: 'feedback_kriterien[kn_kriterium=Fachkorrektheit].stufen', auftrag: 'handlungsprodukt_aendern' },
    { datei: 'set', pfad: 'gemeinsamer_auftrag.feedback_kriterien[kn_kriterium=Position / Werthaltung].stufen', auftrag: 'handlungsprodukt_aendern' },
  ])
  assert.deepEqual(w.map((x) => x.code), ['handlungsprodukt', 'kriterien', 'fusszeile'])
  assert.equal(w[1].text, 'Die Kriterien «Fachkorrektheit», «Position / Werthaltung» haben in Ihrer Fassung einen anderen Wortlaut als im Kompetenznachweis der Plattform. Für die Bewertung gilt der KN.')
  assert.equal(w[0].text, 'Das Handlungsprodukt Ihrer Fassung ist ein anderes als in der Einheit. Der Kompetenznachweis der Plattform prüft möglicherweise etwas anderes, als Ihre Klasse geübt hat. Prüfen Sie den KN vor dem Einsatz.')
  assert.equal(w[2].text, 'Angepasst, nicht von KT1 geprüft')
  const s = warnungen([{ datei: 'set', pfad: 'gemeinsamer_auftrag.situation_text', auftrag: 'situation_umformulieren' }])
  assert.equal(s[0].text, 'Die Situation ist angepasst. Begleitdokument, KI-Toolbox und Präsentation erzählen weiter die ursprüngliche Situation.')
  const e = warnungen([{ datei: 'herausforderung_A', pfad: 'spuren.ohne_medien.leitfragen[nr=3].text', auftrag: 'eigener_text' }])
  assert.equal(e[0].text, 'Ihre Fassung stützt sich auf Ihren eigenen Text. Begleitdokument, KI-Toolbox und Präsentation beziehen sich weiter auf das Lehrmittel. Die Fassung gilt nur für die Spur ohne Medien.')
  assert.deepEqual(warnungen([]), [])
  assert.equal(WARNTEXTE.kriterien.includes('{liste}'), true)
})

test('Gold-Originale bestehen Form-, Budget- und Leckprüfung gegen sich selbst (ausser Nuggets mit fakten_anker)', () => {
  const kontext = { ...ctx, glossarBegriffe: [...gold.efz.set.glossar, ...gold.eba.set.glossar].map((g) => g.begriff), glossarIds: gold.eba.dossier.glossar.map((g) => g.id) }
  const dateien = [['herausforderung_A', gold.efz.A], ['herausforderung_B', gold.efz.B], ['set', gold.efz.set],
    ['herausforderung_A', gold.eba.A], ['herausforderung_B', gold.eba.B], ['set', gold.eba.set], ['dossier', gold.eba.dossier]]
  for (const [datei, roh] of dateien) {
    const art = datei === 'set' || datei === 'dossier' ? datei : 'heft'
    for (const f of FELDER.filter((x) => x.datei === art)) {
      for (const p of konkretePfade(f.muster, roh)) {
        const v = lesePfad(roh, p)
        const grund = pruefeWert(datei, p, v, v, { ...kontext, lpTexte: lpTexte(datei, roh) })
        if (f.nr === 'D2' && v.fakten_anker.length) assert.match(grund, /fakten_anker/)
        else assert.equal(grund, null, `${datei}:${p}`)
      }
    }
  }
})

test('H24L/G6L: ganze Schrittliste — gleiche Anzahl, gleiche Nummer je Label, Budget wie Objekt (F14)', () => {
  const pfad = 'handlungsprodukt.schritte'
  const alt = gold.efz.A.handlungsprodukt.schritte
  assert.equal(feldFuer('herausforderung_A', pfad)?.nr, 'H24L')
  assert.equal(feldFuer('set', 'gemeinsamer_auftrag.schritte')?.nr, 'G6L')
  const neu = alt.map((s, i) => ({ label: `${s.label.split(' ')[0]} Neuer Schritt ${i + 1}`, hint: s.hint }))
  assert.equal(pruefeWert('herausforderung_A', pfad, alt, neu, ctx), null)
  // Nummer an Position 2 vertauscht
  const falsch = kopie(neu); falsch[1].label = '03 Anders'
  assert.equal(pruefeWert('herausforderung_A', pfad, alt, falsch, ctx), 'Schritt 2: Das Label muss mit «02» beginnen')
  // Nummer fehlt ganz
  const ohne = kopie(neu); ohne[0].label = 'Ohne Nummer'
  assert.match(pruefeWert('herausforderung_A', pfad, alt, ohne, ctx), /Schritt 1: .*«01»/)
  // Anzahl
  assert.match(pruefeWert('herausforderung_A', pfad, alt, neu.slice(0, 4), ctx), /«#» muss unverändert bleiben/)
  // Budget: Summe aller Texte × 1.15
  const lang = kopie(neu); lang[0].hint = 'x'.repeat(2000)
  assert.match(pruefeWert('herausforderung_A', pfad, alt, lang, ctx), /zu lang/)
  // Form: nur {label, hint}
  assert.equal(pruefeWert('herausforderung_A', pfad, alt, neu.map((s) => ({ ...s, extra: 'x' })), ctx), 'Wert hat nicht die erwartete Form')
  // Auftragsbogen gleich
  const altSet = gold.eba.set.gemeinsamer_auftrag.schritte
  const neuSet = altSet.map((s) => ({ label: `${s.label.split(' ')[0]} Kurz`, hint: s.hint }))
  assert.equal(pruefeWert('set', 'gemeinsamer_auftrag.schritte', altSet, neuSet, ctx), null)
})

test('Einzel-Hint mit Label, das es im Original nicht gibt: verständliche Meldung (F14, bekannte Kante)', () => {
  assert.equal(pruefeWert('herausforderung_A', 'handlungsprodukt.schritte[label=01 Neu].hint', undefined, 'Neuer Hinweis.', ctx),
    'Dieser Schritt wurde umbenannt — bitte die ganze Schrittliste markieren.')
  assert.equal(pruefeWert('set', 'gemeinsamer_auftrag.schritte[label=01 Neu].hint', undefined, 'Neuer Hinweis.', ctx),
    'Dieser Schritt wurde umbenannt — bitte die ganze Schrittliste markieren.')
  assert.equal(pruefeWert('herausforderung_A', 'leitfragen_intro', undefined, 'x', ctx), 'Feld fehlt im Original')
})

test('pflichtPfade Dossier bei EBA-Situation und -Produktwechsel: Info-Karten und Sprachkarte des Hefts (F15)', () => {
  for (const a of ['situation_umformulieren', 'handlungsprodukt_aendern']) {
    const dA = pflichtPfade(a, 'dossier', gold.eba.dossier, { eba: true, heft: 'A' })
    assert.deepEqual(dA, ['nuggets[id=nugget_A_01]', 'nuggets[id=nugget_A_02]', 'nuggets[id=nugget_A_03]', 'sprachmodi_scaffolds[tag=A]'], a)
    const dB = pflichtPfade(a, 'dossier', gold.eba.dossier, { eba: true, heft: 'B' })
    assert.deepEqual(dB, ['nuggets[id=nugget_B_01]', 'nuggets[id=nugget_B_02]', 'nuggets[id=nugget_B_03]', 'sprachmodi_scaffolds[tag=B]'], a)
    assert.deepEqual(pflichtPfade(a, 'dossier', gold.eba.dossier, { eba: false, heft: 'A' }), [], a)
    for (const p of dA) assert.equal(erlaubtFuerAuftrag(a, 'dossier', p, { eba: true }), null, p)
  }
  assert.deepEqual(pflichtPfade('leitfrage_umformulieren', 'dossier', gold.eba.dossier, { eba: true, heft: 'A' }), [])
})
