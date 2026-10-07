#!/usr/bin/env node
/**
 * gegenhoeren.mjs — erzeugt die Gegenhör-Liste einer v4.2-Einheit: was ein Mensch
 * vor der Freigabe hören und sehen muss, weil kein Modell ein Audio hört
 * (ENTSCHEIDE E38, Stufe C; references/phase-10-abschluss.md §6 der Skill).
 *
 *   node scripts/gegenhoeren.mjs <ordner>
 *   … --out <datei>      # die Liste als Markdown in eine Datei (sonst auf die Konsole)
 *   … --wurzel <ordner>  # anderer Baum statt dieses Repos (Temp-Kopie eines Altstands)
 *
 * Je Audio und Video, das die Einheit führt (Quelle, Ersatzquelle, Vertiefungen):
 *   Karten-ID · Titel · Herausgeber · Datum · Adresse der QR-Seite · Ausschnitt von–bis ·
 *   wie genau die Zeitmarken am Archivtext prüfbar waren · jede Zeitmarke, die Heft oder
 *   Lösung nennt, je mit dem Feld und der Frage «Hört man hier …?».
 * Dazu «gegensehen»: die Text- und Bildquellen am Handy, die QR-Seite, das Papier.
 *
 * Die Frage entsteht aus dem FELDNAMEN (Leitfrage, Rasterzeile, Befund …), nicht aus dem
 * Text: Die Liste enthält keinen Anker und keinen Satz aus Quelle oder Lehrmittel — sie darf
 * in den Bericht. Was an der Stelle zu hören sein soll, steht im genannten Feld der Einheit.
 *
 * Zeitmarken werden gelesen wie in check-zeiger (lib/pruefung.mjs, zeitmarkenIn): im Text
 * beider Hefte samt Lösungen, ohne die Felder mit erfundenem Fall (Beispielbild, Beispiel
 * einer Karte, Beispielzeile). Der Begleiter zählt nicht: Seine Lösungsstellen füllt das
 * Marker-Skript aus denselben Feldern. Eine Marke gehört zur Karte, die das Feld nennt
 * (Slot der Quelle, `quelle_ref` der Leitfrage), sonst zu der Karte des Hefts, in deren
 * Ausschnitt sie liegt.
 *
 * Hinweise zur Genauigkeit — dieselben Bedingungen wie in check-zeiger und check-belege:
 *   ZEIT_NUR_BLOCK       Transkript in Blöcken: Die Marke ist nur auf den Block genau geprüft.
 *   ZEIT_NICHT_PRUEFBAR  Archivtext ohne Zeitmarken: Keine Marke dieser Karte ist geprüft.
 *   ZEIT_VERMERK         Der Kopf der Archivdatei nennt die Zeitmarken berechnet, geschätzt oder nicht gegengehört.
 *   KEIN_ARCHIVTEXT      Zur Karte gibt es im Archiv keinen Text.
 *   ZEIT_AUSSERHALB      Die Marke liegt in keinem Ausschnitt einer Karte des Hefts.
 *
 * Exit 0  Liste erzeugt
 * Exit 2  Aufruf falsch, oder das Quellenarchiv fehlt lokal — die Liste entsteht dann
 *         trotzdem, aber ohne Angabe zur Genauigkeit, und sagt das in der ersten Zeile
 *
 * Reines Node, keine Abhängigkeiten, ohne Netz, nur lesend (ausser --out).
 */
import { writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join, dirname, resolve, basename } from 'node:path'
import { REPO, ladeEinheit, textfelder, zeitmarkenIn, seiteVonFeld, ERFUNDEN } from './lib/pruefung.mjs'
import { archivWurzel, ladeArchivtext, ausschnittDerKarte, formatZeit } from './lib/archiv.mjs'

const NAME = 'gegenhoeren'
const bad = (m) => { console.error(`${NAME}: ${m}\nusage: node scripts/gegenhoeren.mjs <ordner> [--out <datei>] [--wurzel <ordner>]`); process.exit(2) }
const argv = process.argv.slice(2)
let wurzel = REPO; let out = null; let ordner = null
for (let i = 0; i < argv.length; i++) {
  const a = argv[i]
  if (a === '--wurzel') wurzel = resolve(argv[++i] ?? bad('--wurzel braucht einen Ordner'))
  else if (a === '--out') out = resolve(argv[++i] ?? bad('--out braucht eine Datei'))
  else if (a.startsWith('--')) bad(`unbekannter Schalter ${a}`)
  else if (ordner) bad('genau ein Ordner')
  else ordner = basename(a.replace(/[\\/]+$/, ''))
}
if (!ordner) bad('kein Ordner genannt')
if (!existsSync(join(wurzel, 'src', 'data', 'einheiten', ordner))) bad(`kein Ordner src/data/einheiten/${ordner} unter ${wurzel}`)
const E = ladeEinheit(wurzel, ordner)
if (!E.v42) bad(`${ordner} ist keine Einheit im Format heft_8page_v42`)
const archiv = archivWurzel({ wurzel })

// ------------------------------------------------------------- Feldname → Frage

const ROLLE = { pflicht: 'Quelle', 'pflicht-ersatz': 'Ersatzquelle' }
const rolleName = (r) => ROLLE[r] ?? r.replace(/^vertiefung-(\d)(-ersatz)?$/, (_, n, e) => `Vertiefung ${n}${e ? ' (Ersatz)' : ''}`)

/** Was ein Feld ist, in Worten — aus dem Pfad, nie aus dem Text. */
function feldName(pfad, loesung) {
  const lf = /leitfragen\[LF(\d)\]/.exec(pfad)?.[1]
  const idx = (re) => { const m = re.exec(pfad); return m ? +m[1] + 1 : null }
  const v = idx(/quellen\[(\d+)\]/)
  if (/\.loesung\.raster_zeilen\[/.test(pfad)) return `die Rasterzeile ${idx(/raster_zeilen\[(\d+)\]/)} von LF${lf} (Lösung)`
  if (/\.loesung\.zeilen\[/.test(pfad)) return `die Zeile ${idx(/zeilen\[(\d+)\]/)} der Lösung von LF${lf}`
  if (/\.loesung\.befund$/.test(pfad)) return `der Befund von LF${lf} (Lösung)`
  if (/\.loesung\.kern$/.test(pfad)) return `die Kurzzeile der Lösung von LF${lf}`
  if (/\.loesung\.erwartungshorizont\./.test(pfad)) return `der Erwartungshorizont von LF${lf} (${pfad.split('.').pop().replace(/\[\d+\]$/, '')})`
  if (/quellen\[\d+\]\.erwartung$/.test(pfad)) return `die Erwartung zur Vertiefung ${v - 1} (Lösung)`
  if (/quellen\[\d+\]\.leitfrage_vertiefung$/.test(pfad)) return `die Frage der Vertiefung ${v - 1} (Heft S. 4)`
  if (/quellen\[0\]\.auftrag$/.test(pfad)) return 'der Auftrag zur Quelle (Heft S. 3)'
  if (/kasten_s4\.loesung_zeilen\[/.test(pfad)) return `die Zeile ${idx(/loesung_zeilen\[(\d+)\]/)} der Denkhilfe (Lösung)`
  if (/handlungsprodukt\.loesungsbild/.test(pfad)) return 'das Lösungsbild'
  if (/abschluss\.loesung\./.test(pfad)) return `der Abschluss (Lösung, ${pfad.replace(/^abschluss\.loesung\./, '')})`
  if (lf && /\.raster\./.test(pfad)) return `der Auftrag über dem Raster von LF${lf} (Heft S. 3)`
  if (lf && /\.text$/.test(pfad)) return `die Leitfrage LF${lf} (Heft S. ${seiteVonFeld(pfad.replace(/^spuren\.\w+\./, '')) ?? '?'})`
  if (lf) return `LF${lf} im Heft (${pfad.split('.').slice(-2).join('.')})`
  const s = seiteVonFeld(pfad)
  return loesung ? `die Lösung (${pfad})` : `das Heft${s ? `, S. ${s}` : ''} (${pfad})`
}
const frage = (namen) => `Hört man hier, was dort angesetzt ist: ${namen}?`

/** Zeitmarken eines Texts; «mm:ss–mm:ss» ist EINE Stelle. → [{ von, bis, text }] */
function stellenIn(text) {
  const m = zeitmarkenIn(text); const res = []
  for (let i = 0; i < m.length; i++) {
    const zw = m[i + 1] ? text.slice(m[i].pos + m[i].text.length, m[i + 1].pos) : null
    if (zw !== null && /^\s?[–-]\s?$/.test(zw)) { res.push({ von: m[i].sek, bis: m[i + 1].sek, text: `${formatZeit(m[i].sek)}–${formatZeit(m[i + 1].sek)}` }); i++ } else res.push({ von: m[i].sek, bis: m[i].sek, text: formatZeit(m[i].sek) })
  }
  return res
}

// ---------------------------------------------------------------- Sammeln

const istAv = (k) => k.typ === 'audio' || k.typ === 'video'
const karten = [...E.quellen].map(([id, v]) => ({ id, ...v, aus: ausschnittDerKarte(v.karte), stellen: [] }))
const av = karten.filter((k) => istAv(k.karte))
const ausserhalb = [] // Marken, die in keinem Ausschnitt liegen
const drin = (k, s) => k.aus.art === 'zeit' && s.von >= k.aus.von_sek && s.bis <= k.aus.bis_sek

for (const h of E.hefte) {
  const eigene = av.filter((k) => k.heft === h.heft && k.aus.art === 'zeit')
  if (!eigene.length) continue
  const mitErsatz = (ref) => eigene.filter((k) => k.id === ref || k.id === E.quellen.get(ref)?.karte?.ersatz_ref)
  for (const f of textfelder(E, { karten: false, begleiter: false, kn: false })) {
    if (f.traeger !== h.heft || ERFUNDEN.test(f.pfad)) continue
    const stellen = stellenIn(f.text)
    if (!stellen.length) continue
    // Die Karte, die das Feld nennt: der Slot der Quelle, sonst quelle_ref der Leitfrage.
    const slot = /^spuren\.(\w+)\.quellen\[(\d+)\]/.exec(f.pfad)
    const lfm = /^spuren\.(\w+)\.leitfragen\[LF(\d)\]/.exec(f.pfad)
    const lf = lfm ? (h.json.spuren?.[lfm[1]]?.leitfragen ?? []).find((x) => x.nr === +lfm[2]) : null
    const ref = slot ? h.json.spuren?.[slot[1]]?.quellen?.[+slot[2]]?.ref : lf?.raster?.quelle_ref ?? lf?.loesung?.quelle_ref
    const gemeint = ref ? mitErsatz(ref) : []
    const name = feldName(f.pfad, f.loesung)
    for (const s of stellen) {
      const ziel = gemeint.find((k) => drin(k, s)) ?? (gemeint.length ? null : eigene.find((k) => drin(k, s)))
      const eintrag = { ...s, feld: f.feld, name }
      if (ziel) { if (!ziel.stellen.some((x) => x.text === s.text && x.feld === f.feld)) ziel.stellen.push(eintrag) }
      else if (gemeint.length) { if (!gemeint[0].stellen.some((x) => x.text === s.text && x.feld === f.feld)) gemeint[0].stellen.push({ ...eintrag, draussen: true }) }
      else ausserhalb.push({ ...eintrag, heft: h.heft })
    }
  }
}

// ------------------------------------------------------------------ Liste

const z = []
const anker = (heft) => `https://bbw-hko.ch/m/${ordner}#${heft.toLowerCase()}`
z.push(`# Gegenhören und gegensehen — ${ordner}`, '')
z.push(`Erzeugt von \`node scripts/gegenhoeren.mjs ${ordner}\`. Kein Modell hört ein Audio oder sieht ein Video: Gelesen sind Untertitel und Transkripte. Einmal mit Kopfhörer durchgehen und abhaken. Die Liste nennt Felder, keinen Wortlaut der Quellen; was an einer Stelle zu hören sein soll, steht im genannten Feld (Dokument «Lösungen» bzw. Heft).`, '')
if (!archiv.pfad) z.push(`**HINWEIS — Quellenarchiv fehlt lokal (${archiv.grund}): Wie genau die Zeitmarken geprüft sind, ist für keine Karte bekannt. Jede Marke gilt als ungeprüft.**`, '')

let nStellen = 0
if (!av.length) z.push('## Gegenhören', '', 'Die Einheit führt weder Audio noch Video — nichts zu hören.', '')
for (const h of E.hefte) {
  const eigene = av.filter((k) => k.heft === h.heft)
  if (!eigene.length) continue
  z.push(`## Gegenhören — Heft ${h.heft} · QR-Seite ${anker(h.heft)}`, '')
  for (const k of eigene) {
    const c = k.karte
    z.push(`### ${k.id} · ${rolleName(k.rolle)} · ${c.typ}`, '')
    z.push(`- «${c.titel ?? '—'}» · ${c.herausgeber ?? '—'} · ${c.datum ?? '—'}`)
    if (k.aus.art === 'zeit') z.push(`- Ausschnitt **${c.verortung.von}–${c.verortung.bis}** (${Math.round(k.aus.bis_sek - k.aus.von_sek)} s)`)
    else z.push('- Ausschnitt: **die Karte nennt kein von–bis**')
    if (archiv.pfad) {
      const t = ladeArchivtext(archiv.pfad, c.archiv_ref ? c : { ...c, archiv_ref: `${k.id}/gewaehlt` })
      const g = []
      if (!t.vorhanden) g.push(`KEIN_ARCHIVTEXT — ${t.grund}: Nichts an dieser Karte ist am Text geprüft`)
      else {
        if (t.zeit.stufe === 'block') g.push(`ZEIT_NUR_BLOCK — Transkript in Blöcken (Median ${t.zeit.median_sek ?? '—'} s): Jede Marke ist nur auf den Block genau; hier besonders genau hinhören`)
        if (t.zeit.stufe === 'nein') g.push('ZEIT_NICHT_PRUEFBAR — der Archivtext trägt keine Zeitmarken: Keine Marke dieser Karte ist geprüft')
        if (t.zeit.vermerk.length) g.push(`ZEIT_VERMERK — Kopf der Archivdatei: ${t.zeit.vermerk.join(', ')}`)
        if (!g.length) g.push('Marken am Transkript auf die Zeile genau prüfbar (check-belege: höchstens 3 s daneben)')
      }
      for (const x of g) z.push(`- Genauigkeit: ${x}`)
    }
    if (k.aus.art === 'zeit') z.push(`- [ ] Beginnt der Ausschnitt bei ${c.verortung.von} mit einem ganzen Satz, und endet er bei ${c.verortung.bis} — oder läuft der Player in den nächsten Beitrag?`)
    z.push('- [ ] Mundart, Namen, Zahlen im Ausschnitt: Verstehen Lernende, was das Raster sucht?')
    // Eine Zeile je Zeitmarke: Dieselbe Marke steht meist in mehreren Feldern (Rasterzeile, Befund, Lösungsbild).
    k.stellen.sort((a, b) => a.von - b.von || a.bis - b.bis || a.feld.localeCompare(b.feld))
    const jeMarke = new Map()
    for (const s of k.stellen) (jeMarke.get(s.text) ?? jeMarke.set(s.text, []).get(s.text)).push(s)
    if (!jeMarke.size) z.push('', 'Heft und Lösung nennen zu dieser Karte keine Zeitmarke.')
    else {
      z.push('', '| ☐ | Zeitmarke | Frage | Felder |', '|---|---|---|---|')
      for (const [marke, ss] of jeMarke) {
        nStellen++
        z.push(`| ☐ | ${marke}${ss.some((s) => s.draussen) ? ' **(ZEIT_AUSSERHALB des Ausschnitts)**' : ''} | ${frage([...new Set(ss.map((s) => s.name))].join(' · '))} | ${[...new Set(ss.map((s) => `\`${s.feld}\``))].join('<br>')} |`)
      }
    }
    z.push('')
  }
}
if (ausserhalb.length) {
  z.push('## Zeitmarken ohne Karte (ZEIT_AUSSERHALB)', '', 'Diese Marken liegen in keinem Ausschnitt einer Karte ihres Hefts — zuerst klären, was gemeint ist.', '', '| ☐ | Heft | Zeitmarke | Feld |', '|---|---|---|---|')
  for (const s of ausserhalb) { nStellen++; z.push(`| ☐ | ${s.heft} | ${s.text} | \`${s.feld}\` |`) }
  z.push('')
}

z.push('## Gegensehen (kein Ton)', '')
const text = karten.filter((k) => !istAv(k.karte))
for (const k of text) z.push(`- [ ] ${k.id} · Heft ${k.heft} · ${rolleName(k.rolle)} · ${k.karte.typ} · «${k.karte.titel ?? '—'}» · Ausschnitt ${k.aus.art === 'absaetze' ? k.aus.text : '—'}: am Handy öffnen — finden Lernende die Stelle so, wie Raster und Erwartung sie zählen?`)
for (const h of E.hefte) z.push(`- [ ] QR-Seite ${anker(h.heft)}: Player, Startpunkt, Kurztexte; verrät ein Kurztext die Lösung?`)
z.push('- [ ] Papier: die Seiten mit 0 px Reserve laut `messung.txt` (meist S. 6) und die Arbeitsfläche S. 7.', '')
z.push(`${av.length} Audio/Video · ${nStellen} Stelle(n) mit Zeitmarke · ${text.length} Text- und Bildquelle(n) zum Gegensehen.`)

const ausgabe = z.join('\n') + '\n'
if (out) { mkdirSync(dirname(out), { recursive: true }); writeFileSync(out, ausgabe, 'utf8'); console.log(`${NAME} — ${ordner}: ${av.length} Audio/Video · ${nStellen} Stelle(n) · ${text.length} zum Gegensehen → ${out}`) }
else process.stdout.write(ausgabe)
process.exit(archiv.pfad ? 0 : 2)
