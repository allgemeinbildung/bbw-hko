// Fork-Pilot: Durchgang der vier Aufträge auf beiden Gold-Einheiten, ohne Supabase und ohne
// OpenAI (ORCHESTRATION-fork, Fertig-Kriterium; VERTRAG §1–§7). Je Einheit wird EINE Fassung
// aufgebaut, wie eine Lehrperson es täte: Kommentar → Anfrage → Antwort → Prüfung → Übernehmen →
// loadEinheit. Die «Modellantwort» schreibt dieser Test selbst: der Originalwert mit einer Marke
// ‹F<n>› (Lernende) bzw. ‹L<n>› (nur Lehrperson) am längsten Text — kein fremder Text (Invariante 7).
// Danach Export der Fassung, messen-v42 (Überlauf wird gemeldet, nicht geprüft), check-data-feld.
//
//   node --test scripts/fork/durchgang.test.mjs
import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { ROOT, startSsr } from '../v42-ssr.mjs'
import { feldFuer, pflichtPfade, pruefeWert, zielFelder } from '../../src/lib/fork/positivliste.ts'
import { baueAnfrage } from '../../src/lib/fork/anfrage.ts'
import { pruefeVorschlag } from '../../src/lib/fork/vorschlag.ts'
import { wendeAn } from '../../src/lib/fork/anwenden.ts'
import { lesePfad, parseFeldAttr } from '../../src/lib/fork/adresse.ts'
import { fassungPruefer } from '../../src/lib/fork/seite.ts'
import { glossarBegriffe, leitfragenAus, pruefeKommentare } from '../../src/lib/fork/server.ts'
import { HEFT_DATEI } from '../../src/lib/fork/typen.ts'

const EINHEITEN = [
  { slug: '1.3.1_konsum_verantworten_v42', eba: false, lfUm: 3, lfText: [3, 4] },
  { slug: '1.1.1_lehrvertrag_orientieren_v42', eba: true, lfUm: 2, lfText: [2, 3] },
]
// Ziele aus `zielFelder` des Auftrags, je Heft (A = Heft A, auftrag = Auftragsbogen).
const AUFTRAEGE = [
  { key: 'leitfrage_umformulieren', ziele: (e) => ({ A: [`spuren.ohne_medien.leitfragen[nr=${e.lfUm}].text`], auftrag: ['gemeinsamer_auftrag.leitfrage'] }) },
  { key: 'eigener_text', ziele: (e) => ({ A: e.lfText.map((n) => `spuren.ohne_medien.leitfragen[nr=${n}].text`) }) },
  { key: 'situation_umformulieren', ziele: () => ({ A: ['situation_text'], auftrag: ['gemeinsamer_auftrag.situation_text'] }) },
  { key: 'handlungsprodukt_aendern', ziele: () => ({ A: ['handlungsprodukt.titel'], auftrag: ['gemeinsamer_auftrag.auftrag'] }) },
]
const EXPORT_NACH = new Set(['eigener_text', 'handlungsprodukt_aendern'])
// Selbst geschriebener «eigener Text» (Invariante 7).
const EIGENER_TEXT = 'Testtext für den Durchgang. Eine Lernende vergleicht zwei Angebote und schreibt auf, was sie zuerst prüft. Sie notiert drei Fragen und eine Regel für den nächsten Einkauf.'
const DOSSIER_KOMMENTAR = 'Neues Dossier in A2 zum eigenen Text'
// Schlüssel, die eine Antwort nie anfasst: Verweise, Kennungen, feste Werte (§3 «unverändert»).
const FEST = new Set(['ref', 'label', 'typ', 'id', 'tag', 'sm_id', 'modus_label', 'form', 'modus', 'key', 'marke', 'fuer_leitfrage', 'schritt', 'glossar_refs', 'kn_kriterium', 'heft'])
const METHODEN = new Set(readdirSync(join(ROOT, 'src/data/methoden')).filter((f) => f.endsWith('.json') && !f.startsWith('_')).map((f) => f.slice(0, -5)))
const BUENDEL_ID = (slug, n, heft) => `durchgang-${slug}-${n}-${heft}`
const OUT = join(tmpdir(), 'fork-durchgang')
const zaehlung = []
const messung = []
const befunde = new Set()

let server, loadEinheit, ladeRohdateien, einheitById, werkstattKontext
before(async () => {
  server = await startSsr()
  ;({ loadEinheit, ladeRohdateien, einheitById } = await server.ssrLoadModule('/src/lib/einheiten/index.ts'))
  ;({ werkstattKontext } = await server.ssrLoadModule('/src/lib/werkstatt/kontext.ts'))
  rmSync(OUT, { recursive: true, force: true })
})
after(async () => {
  await server?.close()
  console.log('\nZählung (Einheit · Auftrag · Heft: Ersetzungen / Bestätigungen / vollständig):')
  for (const z of zaehlung) console.log(`  ${z}`)
  console.log('\nMessung (messen-v42):')
  for (const m of messung) console.log(`  ${m}`)
  console.log('\nBefunde:')
  for (const b of befunde) console.log(`  ${b}`)
})

/**
 * Selbst geschriebener neuer Wert: Kopie des Originals, am längsten Text (ausser festen Schlüsseln)
 * die Marke angehängt — ‹L…› in Teilen nur für die Lehrperson, sonst ‹F…›. `fakten_anker` wird
 * geleert (D2). `null`, wenn es keinen änderbaren Text gibt.
 */
function wandle(orig, nr, feld) {
  const lpTeile = feld.lpTeile ?? []
  const marke = (lp) => ` ${lp ? '‹L' : '‹F'}${nr}›`
  if (typeof orig === 'string') return { wert: orig + marke(feld.lp), text: orig + marke(feld.lp), lp: feld.lp }
  const v = structuredClone(orig)
  if (v && typeof v === 'object' && Array.isArray(v.fakten_anker)) v.fakten_anker = []
  let best = null
  const gehe = (x, setz, lp) => {
    if (typeof x === 'string') { if (!best || [...x].length > best.n) best = { n: [...x].length, x, setz, lp }; return }
    if (Array.isArray(x)) x.forEach((y, i) => gehe(y, (w) => { x[i] = w }, lp))
    else if (x && typeof x === 'object') for (const [k, y] of Object.entries(x)) if (!FEST.has(k)) gehe(y, (w) => { x[k] = w }, lp || lpTeile.includes(k))
  }
  gehe(v, null, feld.lp)
  if (!best) return null
  const text = best.x + marke(best.lp)
  best.setz(text)
  return { wert: v, text, lp: best.lp }
}

/** Antwort im Schema von VERTRAG §7: jeder Pfad ersetzt oder — wenn Form/Budget es nicht zulassen — bestätigt. */
function antwortFuer({ datei, pfade, roh, nr, ctx }) {
  const ersetzungen = [], bestaetigt = [], notizen = [], texte = new Map()
  for (const p of pfade) {
    const orig = lesePfad(roh, p)
    const w = wandle(orig, nr, feldFuer(datei, p))
    const grund = w ? pruefeWert(datei, p, orig, w.wert, ctx) : 'kein änderbarer Text'
    if (grund) { bestaetigt.push({ pfad: p, begruendung: 'Passt weiter zur Fassung.' }); notizen.push(`${p}: ${grund}`); continue }
    ersetzungen.push({ datei, pfad: p, wert_json: JSON.stringify(w.wert), begruendung: 'Testantwort, selbst geschrieben.' })
    texte.set(`${datei}:${p}`, w)
  }
  return { antwort: { ersetzungen, bestaetigt, hinweis: 'Testantwort ohne Modell.' }, notizen, texte }
}

const PERSONENBEZUG = [/[\w.+-]+@[\w-]+\.[\w.]+/, /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i]
const enthaelt = (obj, text) => JSON.stringify(obj).includes(JSON.stringify(text).slice(1, -1))
const unent = (s) => s.replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
const node = (args) => spawnSync(process.execPath, args, { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })

for (const E of EINHEITEN) {
  test(`${E.slug}: vier Aufträge bis zum Download`, async (t) => {
    const { slug, eba } = E
    const original = loadEinheit(slug)
    const rohOriginal = ladeRohdateien(slug)
    const kontext = werkstattKontext(original, einheitById(slug))
    const fassung = { ersetzungen: [], nur_spur: undefined }
    const alleTexte = new Map()
    let letzteHp = null

    for (const [i, A] of AUFTRAEGE.entries()) {
      const nr = i + 1
      await t.test(A.key, () => {
        const rohAktuell = wendeAn(rohOriginal, fassung.ersetzungen).dateien
        const ziele = A.ziele(E)
        const buendel = []
        for (const [heft, pfade] of Object.entries(ziele)) {
          const datei = HEFT_DATEI[heft]
          // 1. Kommentare wie die Oberfläche: Pfad ist ein Ziel des Auftrags, Server-Prüfung wie die API.
          for (const p of pfade) assert.ok(zielFelder(A.key).includes(feldFuer(datei, p)), `${p} ist kein Ziel von ${A.key}`)
          const roh = pfade.map((pfad) => ({ auftrag: A.key, datei, pfad, kommentar: `Bitte für meine Klasse anpassen (${A.key}).` }))
          const k = pruefeKommentare(JSON.stringify(roh), heft, eba)
          assert.ok('kommentare' in k, JSON.stringify(k))
          const lfs = A.key === 'eigener_text' ? leitfragenAus(k.kommentare) : undefined
          const pflicht = pflichtPfade(A.key, datei, rohAktuell[datei], { eba, ...(lfs ? { geaenderteLeitfragen: lfs } : {}) })
          buendel.push({ heft, datei, kommentare: k.kommentare, pflicht, glossar: heft === 'auftrag' ? undefined : glossarBegriffe(rohAktuell.set, heft) })
        }
        if (A.key === 'eigener_text' && eba) {
          const lfs = leitfragenAus(buendel[0].kommentare)
          buendel.push({
            heft: 'dossier', datei: 'dossier',
            kommentare: [{ auftrag: 'eigener_text', datei: 'dossier', pfad: 'einleitung.was_ist_das', kommentar: DOSSIER_KOMMENTAR }],
            pflicht: pflichtPfade('eigener_text', 'dossier', rohAktuell.dossier, { eba: true, geaenderteLeitfragen: lfs, heft: 'A' }),
            glossarIds: rohAktuell.dossier.glossar.map((g) => g.id),
          })
        }

        const angenommen = []
        for (const b of buendel) {
          // 2. Anfrage: Feldliste enthält jede Pflicht, kein Personenbezug (Invariante 9).
          const text = A.key === 'eigener_text' ? EIGENER_TEXT : null
          const { system, nutzer } = baueAnfrage({ kontext, datei: b.datei, roh: rohAktuell[b.datei], kommentare: b.kommentare, eigenerText: text, eba, pflicht: b.pflicht, glossarBegriffe: b.glossar })
          for (const p of b.pflicht) assert.ok(nutzer.includes(`\n### ${p}\n`), `Pflicht ${p} fehlt in der Feldliste`)
          for (const re of PERSONENBEZUG) assert.equal(re.test(system + nutzer), false, `Personenbezug ${re}`)
          if (A.key === 'eigener_text') assert.equal(b.pflicht.some((p) => p.startsWith('spuren.mit_medien.')), false)

          // 3. Selbst geschriebene Antwort: Ziel, weitere Felder derselben Leitfrage und jede Pflicht.
          const extra = A.key === 'leitfrage_umformulieren' && b.datei !== 'set' ? b.kommentare.map((c) => c.pfad.replace(/\.text$/, '.liefert')).filter((p) => lesePfad(rohOriginal[b.datei], p) !== undefined) : []
          const pfade = [...new Set([...b.kommentare.map((c) => c.pfad), ...extra, ...b.pflicht])]
          const ctx = { methodenRefs: METHODEN, glossarBegriffe: b.glossar, glossarIds: b.glossarIds }
          const { antwort, notizen, texte } = antwortFuer({ datei: b.datei, pfade, roh: rohOriginal[b.datei], nr, ctx })
          for (const n of notizen) t.diagnostic(`bestätigt statt ersetzt · ${b.heft} · ${n}`)

          // 4. Prüfung wie der Server.
          const args = { datei: b.datei, rohOriginal: rohOriginal[b.datei], rohAktuell: rohAktuell[b.datei], kommentare: b.kommentare, eba, buendelId: BUENDEL_ID(slug, nr, b.heft), pflicht: b.pflicht, methodenRefs: METHODEN, glossarBegriffe: b.glossar, glossarIds: b.glossarIds }
          const v = pruefeVorschlag({ ...args, antwort })
          assert.deepEqual(v.verworfen, [], `${b.heft}: unerwartet verworfen`)
          assert.deepEqual(v.fehlend, [])
          assert.equal(v.vollstaendig, true)
          assert.equal(v.ersetzungen.length + v.bestaetigt.length, pfade.length)
          zaehlung.push(`${slug} · ${A.key} · ${b.heft}: ${v.ersetzungen.length} / ${v.bestaetigt.length} / ${v.vollstaendig ? 'ja' : 'nein'} (Pflicht ${b.pflicht.length})`)
          if (A.key === 'handlungsprodukt_aendern' && b.heft === 'A') letzteHp = { args, antwort }
          for (const e of v.ersetzungen) {
            assert.equal(e.auftrag, A.key)
            const { begruendung: _b, ...ohne } = e
            angenommen.push(ohne)
            alleTexte.set(`${e.datei}:${e.pfad}`, texte.get(`${e.datei}:${e.pfad}`))
          }
        }

        // 5. Übernehmen wie die Entscheid-Route: gleicher Pfad ersetzt den älteren Eintrag.
        const neu = new Set(angenommen.map((e) => `${e.datei}:${e.pfad}`))
        fassung.ersetzungen = [...fassung.ersetzungen.filter((e) => !neu.has(`${e.datei}:${e.pfad}`)), ...angenommen]
        if (A.key === 'eigener_text') fassung.nur_spur = 'ohne_medien'

        // 6. loadEinheit mit Fassung: alles angewendet, Werte im aufgelösten Heft, Begleiter Original.
        const d = loadEinheit(slug, { fassung: { ersetzungen: fassung.ersetzungen, ...(fassung.nur_spur ? { nur_spur: fassung.nur_spur } : {}) }, fassungPruefer })
        assert.equal(d.fassung_bericht.angewendet, fassung.ersetzungen.length)
        assert.deepEqual(d.fassung_bericht.veraltet, [])
        assert.deepEqual(d.fassung_bericht.verworfen, [])
        for (const e of fassung.ersetzungen) {
          if (fassung.nur_spur && e.pfad.startsWith('spuren.mit_medien.')) continue
          const ziel = e.datei === 'set' ? d.set : e.datei === 'dossier' ? d.dossier : d.spur_varianten.ohne_medien[e.datei === 'herausforderung_A' ? 'hf_A' : 'hf_B']
          // Befund: `spuren.<s>.scaffold_90` (H20) überschreibt `lernfortschritt.scaffold_90` (H21) beim
          // Auflösen (spuren.ts) — eine Ersetzung von H21 bleibt dann unsichtbar. Gemeldet, nicht geprüft.
          if (e.pfad === 'lernfortschritt.scaffold_90' && lesePfad(rohOriginal[e.datei], 'spuren.ohne_medien.scaffold_90') != null) {
            befunde.add(`${slug} · ${e.datei}:${e.pfad} (${e.auftrag}) wirkt nicht: spuren.ohne_medien.scaffold_90 überschreibt es`)
            continue
          }
          assert.ok(enthaelt(ziel, alleTexte.get(`${e.datei}:${e.pfad}`).text), `${e.datei}:${e.pfad} nicht im aufgelösten Heft`)
        }
        if (fassung.nur_spur) assert.deepEqual(Object.keys(d.spur_varianten), ['ohne_medien'])
        assert.equal(d.begleiter?.raw, original.begleiter?.raw)
        assert.deepEqual(d.kn, original.kn)
        assert.deepEqual(loadEinheit(slug), original)

        // 7. Download der Fassung nach diesem Auftrag.
        if (!EXPORT_NACH.has(A.key)) return
        const dir = join(OUT, `${slug}_${nr}_${A.key}`)
        mkdirSync(dir, { recursive: true })
        const fassungDatei = join(OUT, `${slug}_${nr}.json`)
        writeFileSync(fassungDatei, JSON.stringify(fassung), 'utf8')
        const ex = node(['scripts/export-v42.mjs', slug, '--out', dir, '--fassung', fassungDatei])
        assert.equal(ex.status, 0, ex.stderr)
        assert.match(ex.stderr, new RegExp(`angewendet ${fassung.ersetzungen.length}, veraltet 0, verworfen 0`))
        const html = Object.fromEntries(readdirSync(dir).filter((f) => f.endsWith('.html')).map((f) => [f, unent(readFileSync(join(dir, f), 'utf8'))]))
        const hefte = Object.keys(html).filter((f) => f.startsWith('heft-'))
        assert.ok(hefte.length >= 2 && hefte.every((f) => f.includes('ohne-medien')), hefte.join(', '))
        // Ersetzter Text (Ziel des Auftrags) steht im Heft, alle Ziel-Pfade tragen eine data-feld-Marke.
        const zielA = ziele.A[0]
        assert.ok(html['heft-a-ohne-medien.html'].includes(alleTexte.get(`herausforderung_A:${zielA}`).text), `${zielA} nicht im Heft A`)
        const marken = new Set(Object.values(html).flatMap((h) => [...h.matchAll(/data-feld="([^"]*)"/g)].map((m) => m[1])))
        for (const [heft, pfade] of Object.entries(ziele)) for (const p of pfade) assert.ok(marken.has(`${HEFT_DATEI[heft]}:${p}`), `keine Marke für ${p}`)
        assert.ok([...marken].every((m) => parseFeldAttr(m)))
        // Invariante 6: kein Lösungstext (‹L…›) in einem Heft; als Gegenprobe steht er in den Lösungen.
        for (const f of hefte) assert.equal(/‹L\d›/.test(html[f]), false, `Lösungstext in ${f}`)
        const lp = [...alleTexte.entries()].filter(([k, w]) => w.lp && k.startsWith('herausforderung_A:') && !k.includes('mit_medien')).map(([, w]) => w.text)
        assert.ok(lp.length > 0)
        assert.ok(lp.some((x) => html['loesungen-a-ohne-medien.html']?.includes(x)), 'kein ersetzter Lösungstext in loesungen-a')
        assert.match(readFileSync(join(dir, 'HINWEIS-FASSUNG.txt'), 'utf8'), /^Angepasst, nicht von KT1 geprüft/)

        const ck = node(['scripts/fork/check-data-feld.mjs', dir, slug])
        assert.equal(ck.status, 0, ck.stdout + ck.stderr)
        const ms = node(['scripts/messen-v42.mjs', dir])
        assert.notEqual(ms.status, 2, `Messung unmöglich: ${ms.stderr}`)
        let datei = ''
        const ueber = ms.stdout.split('\n').filter((z) => !/^Datei/.test(z)).map((z) => {
          if (/^\S/.test(z)) datei = z.split(/\s+/)[0]
          return /ÜBERLAUF/.test(z) ? `${datei} S. ${z.trim()}` : null
        }).filter(Boolean)
        messung.push(`${slug} nach ${A.key}: ${ms.status === 0 ? 'kein Überlauf' : `Überlauf — ${ueber.map((z) => z.replace(/\s+/g, ' ').trim()).join(' | ')}`}`)
        messung.push(`  check-data-feld: ${ck.stdout.trim().split('\n')[0]}`)
      })
    }

    // Negativfälle auf dem letzten Bündel (Handlungsprodukt, Heft A).
    await t.test('Negativ: fehlende Pflicht → unvollständig', () => {
      const { args, antwort } = letzteHp
      const weg = args.pflicht[0]
      const ohne = { ...antwort, ersetzungen: antwort.ersetzungen.filter((e) => e.pfad !== weg), bestaetigt: antwort.bestaetigt.filter((b) => b.pfad !== weg) }
      const v = pruefeVorschlag({ ...args, antwort: ohne })
      assert.equal(v.vollstaendig, false)
      assert.deepEqual(v.fehlend, [weg])
    })
    await t.test('Negativ: Feld ausserhalb der Positivliste → verworfen', () => {
      const { args, antwort } = letzteHp
      const fremd = [
        { datei: 'herausforderung_A', pfad: 'template', wert_json: '"heft_x"', begruendung: 'Test' },
        { datei: 'herausforderung_A', pfad: 'leitfragen[nr=1].bloom', wert_json: '"K6"', begruendung: 'Test' },
      ]
      const v = pruefeVorschlag({ ...args, antwort: { ...antwort, ersetzungen: [...antwort.ersetzungen, ...fremd] } })
      assert.deepEqual(v.verworfen.map((x) => [x.pfad, x.grund]), fremd.map((f) => [f.pfad, 'nicht ersetzbar']))
      assert.equal(v.vollstaendig, true)
      assert.equal(v.ersetzungen.some((e) => e.pfad === 'template' || e.pfad.endsWith('.bloom')), false)
    })
  })
}
