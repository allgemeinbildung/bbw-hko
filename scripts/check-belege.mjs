#!/usr/bin/env node
/**
 * check-belege.mjs — prüft die Beleg-Datei des Lösungs-Audits gegen die Einheit,
 * das Quellenarchiv und das Lehrmittel (ENTSCHEIDE E38, references/belege.md).
 *
 *   node scripts/check-belege.mjs <ordner> [<ordner> …]
 *   node scripts/check-belege.mjs --v42                  # alle Einheiten im Format v4.2
 *   … --streng                                           # jede Einheit wie ein Entwurf: Befunde sind Fehler
 *   … --liste                                            # nur die Lösungsfelder mit Hash (Arbeitsliste fürs Audit)
 *   … --protokoll <datei>                                # Fassung OHNE Anker (für laeufe/<…>/belege-check.txt)
 *   … --wurzel <ordner>                                  # anderer Baum statt dieses Repos (Gegenproben)
 *
 * Gelesen wird `<Quellenarchiv>/_pruefung/<ordner>/belege.json` (dazu `probe.json`).
 * Das Archiv löst lib/archiv.mjs auf (QUELLEN_ARCHIV gewinnt); das Lehrmittel
 * `material/_lehrmittel/` bzw. LEHRMITTEL.
 *
 * Schwere: Bei einer gebundenen Einheit (publiziert, archiviert, kein Feld) sind alle
 * Befunde Warnungen, bei einem Entwurf und unter --streng Fehler. Fehlt belege.json,
 * gibt es genau EINE Zeile («nicht auditiert»).
 *
 * Codes:
 *   ERR_BELEGE_FEHLT                 belege.json fehlt — die Einheit ist nicht auditiert.
 *   ERR_BELEGE_UNLESBAR              belege.json ist kein gültiges JSON.
 *   ERR_BELEGE_SCHEMA                belege.json verletzt scripts/schema/belege.schema.json.
 *   ERR_BELEGE_EINHEIT               `einheit` nennt einen anderen Ordner (kopierte Datei).
 *   ERR_BELEG_FEHLT                  Ein Lösungsfeld hat keine Zeile.
 *   ERR_BELEG_DOPPELT                Ein Lösungsfeld hat mehr als eine Zeile.
 *   ERR_BELEG_OHNE_FELD              Eine Zeile nennt ein Feld, das es (so) nicht mehr gibt.
 *   ERR_BELEG_SPUR                   `spur` der Zeile ist nicht die Spur des Felds.
 *   ERR_AUDIT_VERALTET               Der Hash stimmt nicht mehr: Die Lösung wurde nach dem Audit geändert.
 *   ERR_URTEIL_FALSCH                Das Audit urteilt «falsch».
 *   ERR_URTEIL_FUNDSTELLE            Das Audit urteilt «fundstelle_falsch».
 *   ERR_ABLEITUNG_UNGEKENNZEICHNET   Urteil «ableitung», aber das Feld kennzeichnet die Aussage nicht als Fallüberlegung oder Deutung.
 *   ERR_BELEG_KARTE_FREMD            `wo` nennt eine Karte, die die Einheit nicht führt.
 *   ERR_BELEG_ARCHIV_FEHLT           Zur Karte gibt es im Archiv keinen Text (oder die Kapiteldatei fehlt).
 *   ERR_ANKER_NICHT_IM_TEXT          Der Anker steht nicht im Archivtext bzw. in der Kapiteldatei.
 *   ERR_ANKER_NUR_KOPF               Der Anker steht nur im Kopf oder in einer Notiz der Archivdatei, nicht im Quellentext.
 *   ERR_STELLE_FALSCH                Der Anker steht an einer anderen Stelle als `stelle` sagt.
 *   ERR_ANKER_AUSSERHALB_AUSSCHNITT  Die Zeile des Ankers liegt nicht im Ausschnitt der Karte (verortung).
 *   ERR_ZEITMARKE_DANEBEN            Eine Zeitmarke der Lösung liegt mehr als 3 Sekunden neben dem Fenster jedes Ankers.
 *   ERR_SEITE_DANEBEN                Die Seite des Ankers liegt nicht auf einer Seite, die die Lösung nennt.
 *   ERR_ABSATZ_DANEBEN               Der Absatz des Ankers liegt nicht in einem Absatz, den die Lösung nennt.
 *   ERR_FUNDSTELLE_OHNE_BELEG        Die Lösung nennt eine Zeitmarke, Seite oder einen Absatz ohne Belegzeile dort.
 *   ERR_PROBE_SCHEMA                 probe.json verletzt das Schema oder ist unlesbar.
 *   ERR_PROBE_OFFEN                  Die Lösbarkeitsprobe führt einen Befund mit Stand «offen».
 *   HINWEIS_ZEIT_NUR_BLOCK           Das Transkript der Karte hat nur Blöcke: Zeitmarken sind nur auf den Block genau geprüft.
 *   HINWEIS_ZEIT_NICHT_PRUEFBAR      Audio/Video ohne Zeitmarken im Archivtext: Zeitmarken sind nicht geprüft.
 *   HINWEIS_ZEIT_VERMERK             Der Kopf der Archivdatei nennt die Zeitmarken berechnet, geschätzt oder nicht gegengehört.
 *   HINWEIS_STELLE_OHNE_MARKE        Der Anker steht in Text ohne Marke: Die Stelle ist nicht prüfbar.
 *   HINWEIS_LEHRMITTEL_FEHLT         Das Lehrmittel fehlt lokal: Zeilen mit Herkunft «lehrmittel» sind nicht geprüft.
 *   HINWEIS_PROBE_FEHLT              probe.json fehlt: Die Lösbarkeitsprobe ist nicht gelaufen.
 *   HINWEIS_KEIN_V42                 Die Einheit ist nicht im Format v4.2 — nichts zu prüfen.
 *
 * Exit 0  keine Fehler (Warnungen und Hinweise möglich)
 * Exit 1  mindestens ein Fehler
 * Exit 2  Aufruf falsch, oder Archiv bzw. Lehrmittel fehlt lokal — dann ist nichts «grün»
 *
 * Reines Node, keine Abhängigkeiten, nur lesend (ausser --protokoll). Kein Wortlaut
 * aus Quelle oder Lehrmittel in dieser Datei.
 */
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { aufruf, ladeEinheit, Bericht, schluss, RE_FALLKENNZEICHEN, zeitmarkenIn, absaetzeIn, lehrmittelVerweise, seitenIn, HEFT_SEITEN } from './lib/pruefung.mjs'
import { loesungsfelder } from './lib/loesungsfelder.mjs'
import { archivWurzel, lehrmittelWurzel, liesBelegDatei, ladeArchivtext, sucheAnker, laengsterTeilanker, imFenster, ausschnittDerKarte, ladeKapitel, sucheAnkerKapitel, ankerWoerter, formatZeit, parseZeit } from './lib/archiv.mjs'
import { ladeSchema, validiere } from './lib/schema.mjs'

const NAME = 'check-belege'
const A = aufruf(NAME, 'node scripts/check-belege.mjs <ordner>… | --v42  [--streng] [--liste] [--protokoll <datei>] [--wurzel <ordner>]')
const TOLERANZ_SEK = 3

if (A.liste) {
  for (const o of A.ordner) {
    const r = loesungsfelder(join(A.einheitenDir, o))
    console.log(`${o} — ${r.felder.length} Lösungsfelder`)
    for (const f of r.felder) console.log(`  ${f.hash}  ${f.spur.padEnd(11)} ${f.art.padEnd(26)} ${f.feld}`)
  }
  process.exit(0)
}

const archiv = archivWurzel({ wurzel: A.wurzel })
const lehrmittel = lehrmittelWurzel({ wurzel: A.wurzel })
const berichte = []
let lehrmittelGefehlt = false
const kapitelCache = new Map()
const kapitel = (datei) => { if (!kapitelCache.has(datei)) kapitelCache.set(datei, existsSync(join(lehrmittel.pfad, datei)) ? ladeKapitel(lehrmittel.pfad, datei) : null); return kapitelCache.get(datei) }

/** Seiten des Lehrmittels, die ein Lösungstext nennt: an ein Kapitel gebunden, oder «S. N» über der Heftseitenzahl. */
function lehrmittelSeitenIn(text) {
  const out = []
  for (const v of lehrmittelVerweise(text)) out.push(...v.seiten)
  for (const s of seitenIn(text)) if (s.von > HEFT_SEITEN && !out.some((x) => x.von === s.von && x.bis === s.bis)) out.push({ von: s.von, bis: s.bis })
  return out
}

/** Zeitmarken und Spannen eines Lösungstexts: [{ von, bis }] in Sekunden (Einzelmarke: von = bis). */
function zeitSpannenIn(text) {
  const m = zeitmarkenIn(text)
  const out = []
  for (let i = 0; i < m.length; i++) {
    const zw = m[i + 1] ? text.slice(m[i].pos + m[i].text.length, m[i + 1].pos) : null
    if (zw !== null && /^\s?[–-]\s?$/.test(zw)) { out.push({ von: m[i].sek, bis: m[i + 1].sek }); i++ } else out.push({ von: m[i].sek, bis: m[i].sek })
  }
  return out
}

function pruefeEinheit(ordner) {
  const E = ladeEinheit(A.wurzel, ordner)
  const B = new Bericht(NAME, E, { streng: A.streng })
  berichte.push(B)
  if (!E.v42) { B.hinweis('HINWEIS_KEIN_V42', ordner, 'kein Heft im Format heft_8page_v42 — nichts zu prüfen'); return }
  const L = loesungsfelder(E.dir)
  const rel = `_pruefung/${ordner}`

  const datei = liesBelegDatei(archiv.pfad, ordner, 'belege')
  if (!datei.vorhanden) {
    B.fehler('ERR_BELEGE_FEHLT', `${rel}/belege.json`, `nicht auditiert: ${L.felder.length} Lösungsfelder ohne Beleg`)
  } else if (datei.fehler) {
    B.fehler('ERR_BELEGE_UNLESBAR', `${rel}/belege.json`, 'kein gültiges JSON')
  } else pruefeBelege(E, B, L, datei.daten, rel)

  // Lösbarkeitsprobe: mitgelesen. Ein offener Befund hält den Lauf an.
  const probe = liesBelegDatei(archiv.pfad, ordner, 'probe')
  if (!probe.vorhanden) { if (datei.vorhanden) B.hinweis('HINWEIS_PROBE_FEHLT', `${rel}/probe.json`, 'Lösbarkeitsprobe nicht gelaufen') }
  else if (probe.fehler) B.fehler('ERR_PROBE_SCHEMA', `${rel}/probe.json`, 'kein gültiges JSON')
  else {
    const v = validiere(ladeSchema('probe'), probe.daten)
    for (const x of v.slice(0, 8)) B.fehler('ERR_PROBE_SCHEMA', `${rel}/probe.json`, x)
    for (const [i, z] of (probe.daten.zeilen ?? []).entries()) if (z?.stand === 'offen') B.fehler('ERR_PROBE_OFFEN', `${z.feld ?? `${rel}/probe.json › zeilen[${i}]`}`, `Lösbarkeitsprobe, Art ${z.art ?? '—'}, Heft ${z.heft ?? '—'}, Spur ${z.spur ?? '—'}: Befund offen`)
  }
}

function pruefeBelege(E, B, L, daten, rel) {
  const v = validiere(ladeSchema('belege'), daten)
  for (const x of v.slice(0, 12)) B.fehler('ERR_BELEGE_SCHEMA', `${rel}/belege.json`, x)
  if (v.length > 12) B.fehler('ERR_BELEGE_SCHEMA', `${rel}/belege.json`, `… und ${v.length - 12} weitere Verstösse`)
  if (daten.einheit !== E.ordner) B.fehler('ERR_BELEGE_EINHEIT', `${rel}/belege.json › einheit`, `«${daten.einheit}» — die Datei gehört nicht zu dieser Einheit`)
  const zeilen = Array.isArray(daten.zeilen) ? daten.zeilen.filter((z) => z && typeof z === 'object') : []

  const felder = new Map(L.felder.map((f) => [f.feld, f]))
  const nachFeld = new Map()
  for (const z of zeilen) (nachFeld.get(z.feld) ?? nachFeld.set(z.feld, []).get(z.feld)).push(z)
  for (const f of L.felder) if (!nachFeld.has(f.feld)) B.fehler('ERR_BELEG_FEHLT', f.feld, `kein Beleg (Art ${f.art}, Spur ${f.spur})`)
  for (const [feld, zs] of nachFeld) {
    if (!felder.has(feld)) { B.fehler('ERR_BELEG_OHNE_FELD', String(feld), 'Zeile ohne Lösungsfeld — Feld entfernt oder Pfad verschoben'); continue }
    if (zs.length > 1) B.fehler('ERR_BELEG_DOPPELT', feld, `${zs.length} Zeilen für ein Feld`)
    pruefeZeile(E, B, felder.get(feld), zs[0])
  }
}

const zeitHinweis = new Set()

function pruefeZeile(E, B, f, z) {
  if (z.hash !== f.hash) { B.fehler('ERR_AUDIT_VERALTET', f.feld, `Lösung nach dem Audit geändert (geprüft am ${z.geprueft_am ?? '—'}) — dieses Feld neu prüfen`); return }
  if (z.spur !== f.spur) B.fehler('ERR_BELEG_SPUR', f.feld, `Zeile sagt «${z.spur}», das Feld gehört zu «${f.spur}»`)
  if (z.urteil === 'falsch') B.fehler('ERR_URTEIL_FALSCH', f.feld, `Urteil «falsch» (Herkunft ${z.herkunft})`)
  if (z.urteil === 'fundstelle_falsch') B.fehler('ERR_URTEIL_FUNDSTELLE', f.feld, `Urteil «fundstelle_falsch» — richtig laut Audit: ${z.wo || '—'}, ${z.stelle || '—'}`)
  if (z.urteil === 'ableitung' && !RE_FALLKENNZEICHEN.test(f.text)) B.fehler('ERR_ABLEITUNG_UNGEKENNZEICHNET', f.feld, 'Urteil «ableitung», aber das Feld nennt die Aussage nicht Fallüberlegung, Annahme oder Deutung')

  // Fundstellen der Belege sammeln, dann mit dem vergleichen, was die Lösung selbst nennt.
  const zeiten = []   // Fenster der Anker { von_sek, bis_sek }
  const seiten = []   // Buchseiten der Anker
  const absaetze = [] // Absätze der Anker
  const belege = [z, ...(Array.isArray(z.weitere_belege) ? z.weitere_belege : [])]
  let geprueft = true
  for (const [i, b] of belege.entries()) {
    const wo = i ? `${f.feld} (weiterer Beleg ${i})` : f.feld
    if (b.herkunft === 'quelle') geprueft = belegQuelle(E, B, wo, b, z.urteil, { zeiten, absaetze }) && geprueft
    else if (b.herkunft === 'lehrmittel') geprueft = belegLehrmittel(B, wo, b, z.urteil, seiten) && geprueft
    else if (b.herkunft === 'nrlp') belegNrlp(B, wo, b)
  }
  if (!geprueft || z.urteil === 'falsch') return

  // Was die Lösung nennt, muss in ihren Belegen vorkommen — und umgekehrt jeder Beleg dort, wo sie hinzeigt.
  const text = f.text
  const genannteZeit = zeitSpannenIn(text)
  if (genannteZeit.length || zeiten.length) {
    let daneben = false
    for (const g of genannteZeit) {
      const ok = zeiten.some((w) => (g.von === g.bis ? imFenster(g.von, w, TOLERANZ_SEK) : w.von_sek >= g.von - TOLERANZ_SEK && w.von_sek <= g.bis + TOLERANZ_SEK))
      if (ok) continue
      daneben = true
      const marke = g.von === g.bis ? formatZeit(g.von) : `${formatZeit(g.von)}–${formatZeit(g.bis)}`
      if (!zeiten.length) B.fehler('ERR_FUNDSTELLE_OHNE_BELEG', f.feld, `Lösung nennt Zeitmarke ${marke}, keine Belegzeile mit Zeit`)
      else {
        const naechste = zeiten.map((w) => Math.min(Math.abs(g.von - w.von_sek), Math.abs(g.bis - w.von_sek))).sort((a, b) => a - b)[0]
        B.fehler('ERR_ZEITMARKE_DANEBEN', f.feld, `Lösung nennt ${marke}; der nächste Anker beginnt ${Math.round(naechste)} s daneben (${zeiten.map((w) => formatZeit(w.von_sek)).join(', ')}) — Toleranz ${TOLERANZ_SEK} s`)
      }
    }
    if (genannteZeit.length) for (const w of zeiten) {
      const ok = genannteZeit.some((g) => (g.von === g.bis ? imFenster(g.von, w, TOLERANZ_SEK) : w.von_sek >= g.von - TOLERANZ_SEK && w.von_sek <= g.bis + TOLERANZ_SEK))
      if (!ok && !daneben) B.fehler('ERR_ZEITMARKE_DANEBEN', f.feld, `Anker bei ${formatZeit(w.von_sek)} liegt bei keiner Zeitmarke der Lösung`)
    }
  }
  const genannteSeiten = lehrmittelSeitenIn(text)
  for (const g of genannteSeiten) if (!seiten.some((s) => s >= g.von && s <= g.bis)) B.fehler('ERR_FUNDSTELLE_OHNE_BELEG', f.feld, `Lösung nennt S. ${g.von}${g.bis !== g.von ? `–${g.bis}` : ''}, keine Belegzeile auf dieser Seite`)
  if (genannteSeiten.length) for (const s of seiten) if (!genannteSeiten.some((g) => s >= g.von && s <= g.bis)) B.fehler('ERR_SEITE_DANEBEN', f.feld, `Anker steht auf S. ${s}; die Lösung nennt ${genannteSeiten.map((g) => `S. ${g.von}${g.bis !== g.von ? `–${g.bis}` : ''}`).join(', ')}`)
  const genannteAbs = absaetzeIn(text)
  for (const g of genannteAbs) if (!absaetze.some((a) => a >= g.von && a <= g.bis)) B.fehler('ERR_FUNDSTELLE_OHNE_BELEG', f.feld, `Lösung nennt Abs. ${g.von}${g.bis !== g.von ? `–${g.bis}` : ''}, keine Belegzeile in diesem Absatz`)
  if (genannteAbs.length) for (const a of absaetze) if (!genannteAbs.some((g) => a >= g.von && a <= g.bis)) B.fehler('ERR_ABSATZ_DANEBEN', f.feld, `Anker steht in Abs. ${a}; die Lösung nennt ${genannteAbs.map((g) => `Abs. ${g.von}${g.bis !== g.von ? `–${g.bis}` : ''}`).join(', ')}`)
}

/** @returns {boolean} false, wenn die Fundstelle dieses Belegs nicht feststeht (Folgeprüfungen entfallen). */
function belegQuelle(E, B, wo, b, urteil, sammel) {
  const eintrag = E.quellen.get(b.wo)
  if (!eintrag) { B.fehler('ERR_BELEG_KARTE_FREMD', wo, `«${b.wo}» ist keine Quellenkarte dieser Einheit`); return false }
  const karte = eintrag.karte
  const t = ladeArchivtext(archiv.pfad, karte)
  if (!t.vorhanden || (!t.zeilen.length && !t.lose.length)) { B.fehler('ERR_BELEG_ARCHIV_FEHLT', wo, `${b.wo}: ${t.grund || 'Archivdatei ohne Quellentext'}`); return false }
  const av = karte.typ === 'audio' || karte.typ === 'video'
  if (av && !zeitHinweis.has(`${B.einheit}|${b.wo}`)) {
    zeitHinweis.add(`${B.einheit}|${b.wo}`)
    if (t.zeit.stufe === 'block') B.hinweis('HINWEIS_ZEIT_NUR_BLOCK', `quellen/${b.wo}.json`, `Transkript in Blöcken (Median ${t.zeit.median_sek ?? '—'} s): Zeitmarken nur auf den Block genau geprüft — gehört auf die Gegenhör-Liste`)
    if (t.zeit.stufe === 'nein') B.hinweis('HINWEIS_ZEIT_NICHT_PRUEFBAR', `quellen/${b.wo}.json`, 'Archivtext ohne Zeitmarken: Zeitmarken dieser Karte sind NICHT geprüft')
    if (t.zeit.vermerk.length) B.hinweis('HINWEIS_ZEIT_VERMERK', `quellen/${b.wo}.json`, `Kopf der Archivdatei: ${t.zeit.vermerk.join(', ')}`)
  }
  if (!b.anker) return urteil === 'falsch'
  const s = sucheAnker(t, b.anker)
  if (!s.treffer.length) {
    if (s.ausserhalb_text.length) B.fehler('ERR_ANKER_NUR_KOPF', wo, `${b.wo}: Anker steht nur im ${[...new Set(s.ausserhalb_text.map((x) => x.bereich))].join('/')} der Archivdatei (Zeile ${s.ausserhalb_text[0].nr}), nicht im Quellentext`, `· Anker «${b.anker}»`)
    else {
      const teil = laengsterTeilanker(t, b.anker)
      B.fehler('ERR_ANKER_NICHT_IM_TEXT', wo, `${b.wo}: Anker (${s.woerter} Wörter) steht nicht im Archivtext; längstes Stück: ${teil.woerter} von ${teil.von} Wörtern${teil.stelle ? ` bei ${teil.stelle}` : ''}`, `· Anker «${b.anker}»`)
    }
    return false
  }
  // Der Treffer, den die Zeile meint: gleiche Stelle. Bei einem Absatz mit Zeit gilt auch «Abs. N».
  const sagt = String(b.stelle ?? '').trim()
  const sagtSek = parseZeit(sagt)
  const passt = (tr) => tr.stelle === sagt || (sagtSek !== null && tr.zeile.sek !== null && Math.floor(tr.zeile.sek) === Math.floor(sagtSek)) || (tr.zeile.absatz !== null && sagt === `Abs. ${tr.zeile.absatz}`)
  let tr = s.treffer.find(passt)
  if (!tr) {
    tr = s.treffer[0]
    if (!tr.stelle) { B.hinweis('HINWEIS_STELLE_OHNE_MARKE', wo, `${b.wo}: Anker steht in Text ohne Marke — Stelle «${sagt}» nicht prüfbar`); return false }
    B.fehler('ERR_STELLE_FALSCH', wo, `${b.wo}: Anker steht bei ${s.treffer.map((x) => x.stelle).join(', ')}, die Zeile sagt «${sagt || 'leer'}»`)
  }
  // Ausschnitt der Karte.
  const aus = ausschnittDerKarte(karte)
  if (aus.art === 'zeit' && tr.zeile.sek !== null) {
    if (tr.zeile.sek < aus.von_sek - TOLERANZ_SEK || tr.zeile.sek > aus.bis_sek + TOLERANZ_SEK) B.fehler('ERR_ANKER_AUSSERHALB_AUSSCHNITT', wo, `${b.wo}: Anker bei ${formatZeit(tr.zeile.sek)}, Ausschnitt der Karte ${karte.verortung.von}–${karte.verortung.bis}`)
  } else if (aus.art === 'absaetze' && tr.zeile.absatz !== null) {
    const bereiche = absaetzeIn(aus.text)
    if (bereiche.length && !bereiche.some((g) => tr.zeile.absatz >= g.von && tr.zeile.absatz <= g.bis)) B.fehler('ERR_ANKER_AUSSERHALB_AUSSCHNITT', wo, `${b.wo}: Anker in Abs. ${tr.zeile.absatz}, Ausschnitt der Karte «${aus.text}»`)
  } else if (tr.zeile.im_ausschnitt_laut_datei === false) B.fehler('ERR_ANKER_AUSSERHALB_AUSSCHNITT', wo, `${b.wo}: Die Archivdatei kennzeichnet die Zeile des Ankers als ausserhalb des Ausschnitts`)
  if (tr.fenster) sammel.zeiten.push(tr.fenster)
  if (tr.zeile.absatz !== null && tr.zeile.absatz !== undefined) sammel.absaetze.push(tr.zeile.absatz)
  return true
}

function belegLehrmittel(B, wo, b, urteil, seiten) {
  if (!lehrmittel.pfad) { lehrmittelGefehlt = true; B.hinweis('HINWEIS_LEHRMITTEL_FEHLT', wo, 'Lehrmittel fehlt lokal — Anker und Seite NICHT geprüft'); return false }
  const k = kapitel(String(b.wo ?? ''))
  if (!k) { B.fehler('ERR_BELEG_ARCHIV_FEHLT', wo, `Kapiteldatei «${b.wo}» gibt es nicht unter material/_lehrmittel/`); return false }
  if (!b.anker) return urteil === 'falsch'
  const s = sucheAnkerKapitel(k, b.anker)
  if (!s.treffer.length) { B.fehler('ERR_ANKER_NICHT_IM_TEXT', wo, `${b.wo}: Anker (${s.woerter} Wörter) steht nicht in der Kapiteldatei`, `· Anker «${b.anker}»`); return false }
  const sagt = /^S\.\s?(\d+)$/.exec(String(b.stelle ?? '').trim())?.[1]
  let tr = s.treffer.find((x) => sagt !== undefined && x.seite === +sagt)
  if (!tr) {
    tr = s.treffer[0]
    B.fehler('ERR_STELLE_FALSCH', wo, `${b.wo}: Anker steht auf ${s.treffer.map((x) => x.stelle || 'ohne Seite').join(', ')}, die Zeile sagt «${b.stelle || 'leer'}»`)
  }
  if (tr.seite !== null) seiten.push(tr.seite)
  return true
}

const nrlpCache = new Map()
function belegNrlp(B, wo, b) {
  const p = join(A.wurzel, 'public', String(b.wo ?? ''))
  if (!/^nrlp_[234]j\.json$/.test(String(b.wo)) || !existsSync(p)) { B.fehler('ERR_BELEG_ARCHIV_FEHLT', wo, `nRLP-Datensatz «${b.wo}» gibt es nicht unter public/`); return }
  if (!nrlpCache.has(p)) nrlpCache.set(p, JSON.parse(readFileSync(p, 'utf8')))
  const nr = String(b.stelle ?? '').trim()
  const texte = []
  const such = (o) => {
    if (Array.isArray(o)) o.forEach(such)
    else if (o && typeof o === 'object') {
      if (o.nr === nr || String(o.nr) === nr) texte.push(JSON.stringify(o))
      Object.values(o).forEach(such)
    }
  }
  such(nrlpCache.get(p))
  if (!texte.length) { B.fehler('ERR_STELLE_FALSCH', wo, `${b.wo}: keine Kompetenz und kein Lebensbezug «${nr}»`); return }
  const a = ankerWoerter(b.anker).join(' ')
  if (a && !texte.some((t) => ankerWoerter(t).join(' ').includes(a))) B.fehler('ERR_ANKER_NICHT_IM_TEXT', wo, `${b.wo} › ${nr}: Anker steht nicht im Wortlaut des Lehrplans`)
}

if (!archiv.pfad) {
  console.log(`${NAME} — ${A.ordner.length} Einheit(en)\n  HINWEIS Quellenarchiv fehlt lokal (${archiv.grund}) — Belege NICHT geprüft.\n\nNICHT GEPRUEFT — ohne Archiv gibt es keine Beleg-Dateien.`)
  process.exit(2)
}
for (const o of A.ordner) pruefeEinheit(o)
schluss(NAME, berichte, {
  protokoll: A.protokoll,
  vorspann: [`  Archiv ${archiv.pfad} · Lehrmittel ${lehrmittel.pfad ?? 'fehlt lokal'}`],
  nichtGeprueft: lehrmittelGefehlt ? 'Lehrmittel fehlt lokal: Zeilen mit Herkunft «lehrmittel» sind nicht geprüft.' : '',
})
