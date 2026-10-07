#!/usr/bin/env node
/**
 * check-skelette.mjs — die Vorlagen der Skill bbw-hko-heft-v42 verletzen selbst keine
 * Regel. Ein Fehler in einem Skelett oder in einer Auftragsvorlage steht sonst in jeder
 * Einheit, die daraus entsteht (ENTSCHEIDE E38, Stufe D — keine Vererbung; Rückblick
 * RUECKBLICK-produktion-2026-10-06.md §5.4, Zeile «Skelett, Skill, Renderer»).
 *
 *   node scripts/check-skelette.mjs                # alle Vorlagen (so ruft check-all auf, Zeile «Skelette»)
 *   node scripts/check-skelette.mjs --felder       # dazu je Skelett: jeder Feldpfad und wo er belegt ist
 *   … --wurzel <ordner>                            # anderer Baum statt dieses Repos (Gegenproben)
 *
 * Die Skelette werden NICHT gefüllt. Geprüft wird, was in ihnen fest steht:
 *
 *   JSON        jedes Skelett unter assets/*.json ist gültiges JSON
 *   PLATZHALTER die Form ist «{{…}}» ohne Klammer im Innern — nur diese Form findet check-all
 *               (ERR_PLATZHALTER) in einer Einheit wieder; im festen Text daneben steht keine
 *               zweite Form («<…>», «[…]», TODO). Im Bericht-Gerüst ist die Form «<…>» bzw.
 *               JJJJ-MM-TT, und «{{» kommt nicht vor; spitze Klammern gehen auf.
 *   ESZETT      kein «ß», auch nicht in einer Anweisung
 *   ANREDE      kein Du im festen Text der Lernenden (Hefte, Auftrag, Glossar, Quellenkarte) und
 *               keine Anweisung «Du-Form» dort; der Begleiter spricht die Lehrperson an und ist ausgenommen
 *   GESPERRT    «Spur», «Pflichtquelle», «Lektion» nicht im festen Text der Lernenden
 *   UMLAUT      kein transliterierter Umlaut im festen Text
 *   FELDER      jeder Feldpfad eines JSON-Skeletts steht in der Gold-Einheit
 *               (1.3.1_konsum_verantworten_v42) oder im Datenvertrag der Skill
 *               (references/datenvertrag.md). Gegen `src/lib/einheiten/types.ts` wird nur auf
 *               NAMENSEBENE geprüft — die Datei wird statisch gelesen, ohne Compiler; ein Pfad
 *               lässt sich so nicht sicher auflösen (Vereinigungstypen, Erweiterungen, Record).
 *   FESTWERTE   set-Skelett trägt status "entwurf", Heft-Skelett das Template heft_8page_v42
 *   MARKER      im Begleiter-Skelett geht jeder Marker «<!--hko:pfad-->…<!--/hko-->» zu, und sein
 *               Pfad führt in ein Feld des passenden JSON-Skeletts
 *   FEST        die wörtlichen Auftragsvorlagen (Zeilen mit «>» in references/gegenleser.md und
 *               references/audits.md) nennen kein festes Lehrjahr, keinen Lehrgang, kein Alter,
 *               kein Modell mit Version und keinen absoluten Pfad — das leitet der Orchestrator
 *               aus der Einheit her (Platzhalter «<…>»)
 *
 * Codes:
 *   ERR_SKEL_JSON               Skelett ist kein gültiges JSON.
 *   ERR_SKEL_PLATZHALTER_FORM   Platzhalter in anderer Form, nicht geschlossen, leer oder mit Klammer im Innern.
 *   ERR_SKEL_ESZETT             «ß» im Skelett.
 *   ERR_SKEL_ANREDE_DU          Du-Anrede oder die Anweisung «Du-Form» in einem Feld der Lernenden.
 *   ERR_SKEL_GESPERRT           Gesperrtes Wort im festen Text der Lernenden.
 *   ERR_SKEL_TRANSLIT           Transliterierter Umlaut im festen Text.
 *   ERR_SKEL_FELD_UNBEKANNT     Feldpfad steht weder in der Gold-Einheit noch im Datenvertrag.
 *   WARN_SKEL_FELD_NICHT_IN_TYPES  Feldname kommt in types.ts nicht vor (laut Datenvertrag «nur Gold» oder vergessen).
 *   ERR_SKEL_FESTWERT           status bzw. template des Skeletts ist nicht der verlangte Wert.
 *   ERR_SKEL_MARKER             Marker geht nicht zu, oder sein Pfad führt in kein Feld des Skeletts.
 *   ERR_SKEL_FEST               Auftragsvorlage nennt eine feste Angabe, die aus der Einheit hergeleitet wird.
 *   HINWEIS_SKEL_NICHT_GEPRUEFT Gold-Einheit, Datenvertrag oder types.ts fehlt im Baum: FELDER nur teilweise geprüft.
 *
 * HINGENOMMEN (Liste unten): Befunde, die bis zu einem Entscheid stehen bleiben, sind Warnungen —
 * die Zeile «Skelette» macht das Tor der publizierten Einheiten nicht rot. Jeder Eintrag trägt
 * Datum und Grund; ohne Eintrag ist ein Befund ein Fehler.
 *
 * Exit 0  keine Fehler (Warnungen und Hinweise möglich)
 * Exit 1  mindestens ein Fehler
 * Exit 2  Aufruf falsch, oder die Skill fehlt im Baum
 *
 * Reines Node, keine Abhängigkeiten, ohne Netz, nur lesend. Gibt eigenen Text der Skill aus,
 * höchstens acht Wörter je Befund.
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { textfelder, umfeld, TEMPLATE_V42 } from './lib/pruefung.mjs'

const NAME = 'check-skelette'
const SKILL_REL = '.claude/skills/bbw-hko-heft-v42'
const GOLD = '1.3.1_konsum_verantworten_v42'

// ----------------------------------------------------------------- Aufruf

const argv = process.argv.slice(2)
let wurzel = join(dirname(fileURLToPath(import.meta.url)), '..')
let FELDER = false
const bad = (m) => { console.error(`${NAME}: ${m}\nusage: node scripts/check-skelette.mjs [--felder] [--wurzel <ordner>]`); process.exit(2) }
for (let i = 0; i < argv.length; i++) {
  const a = argv[i]
  if (a === '--wurzel') wurzel = resolve(argv[++i] ?? bad('--wurzel braucht einen Ordner'))
  else if (a === '--felder') FELDER = true
  else bad(`unbekannte Angabe ${a}`)
}
const SKILL = join(wurzel, ...SKILL_REL.split('/'))
const ASSETS = join(SKILL, 'assets')
if (!existsSync(ASSETS)) {
  console.log(`${NAME}\n  HINWEIS Skill fehlt im Baum (${SKILL_REL}/assets) — Skelette NICHT geprüft.\n\nNICHT GEPRUEFT — kein Ordner ${SKILL_REL}/assets`)
  process.exit(2)
}

// --------------------------------------------- Hingenommen bis Entscheid
// Jeder Eintrag: Code · Datei · Muster auf «wo» des Befunds · seit · Grund. Ein Befund, der hier steht, ist eine Warnung.
// Leer heisst: Jeder Befund ist ein Fehler. Einträge nur mit Entscheid oder mit offenem Punkt in der Rückgabe/ENTSCHEIDE.
const HINGENOMMEN = [
  // { code: 'ERR_SKEL_…', datei: '…-template.json', wo: /…/, seit: 'JJJJ-MM-TT', grund: '…' },
]

// ----------------------------------------------------------------- Regeln

// Abschrift von PLATZHALTER in scripts/check-all.mjs: Was dieses Muster nicht trifft, bleibt in einer Einheit unbemerkt stehen.
const TOR_PLATZHALTER = /\[QUELLE SUCHEN|\[URL\b|\[JJJJ|\[HERAUSGEBER|verifizieren\]|\[Beispiel aus|\bTODO\b|\bTBD\b|\{\{[^}]*\}\}|\{[A-Z][A-Z0-9_.]{3,}\}/
const RE_PLATZHALTER = /\{\{[\s\S]*?\}\}/g
// Abschriften aus scripts/check-kohaerenz.mjs (WÖRTER, UMLAUTE) — dort massgebend.
const RE_GESPERRT = /\bSpur(?:en)?\b|\bPflichtquellen?\b|\bLektion(?:en)?\b/g
const RE_DU = /(?<![\p{L}])(?:du|dir|dich|dein|deine[nmrs]?|euch|euer|eure[nmrs]?)(?![\p{L}])/iu
const RE_TRANSLIT = /(?<![\p{L}])[\p{L}]*(?:fuer|ueber|muess|moeg|aend|naeh|haeu|pruef|befuel|gemaess|staedte|oekolog|beduerfn|verfueg|auswae?l|guenst|loes|foerd|stoer|erklaer|erfaehr|waehl|maerk|geschae|koenn|wuerd|waere|haett|spaet|naechst|zusaetz|taegl|jaehr|schuel|uebung|gespraech|faehig|oeffentl|zurueck|natuerl|duerf|hoer|fuehr|gebuehr|praemie|vertraeg|betraeg|beitraeg|groess)[\p{L}]*/giu
const ohneRede = (s) => String(s).replace(/«[^»]*»/g, ' ').replace(/"[^"]*"/g, ' ')
// Feste Angaben in einer Auftragsvorlage, die je Einheit anders sind.
const FEST = [
  [/\b[1-4]\.\s?Lehrjahr\b/, 'festes Lehrjahr'],
  [/\bE(?:FZ|BA)_[234]J\b|\bEFZ\s[34]J\b|\b[234]-jährig/, 'fester Lehrgang'],
  [/\b1[5-9]\s?(?:Jahre\b|-?jährig)/, 'festes Alter'],
  [/\b(?:Opus|Sonnet|Haiku|Fable)\s?\d|\bclaude-[a-z0-9.-]+/i, 'Modell mit Version'],
  [/\b[A-Z]:\\[A-Za-z_]/, 'absoluter Pfad'],
]

const befunde = []
const felderZeilen = [] // Übersicht FELDER je Skelett
let markerZeile = ''     // Übersicht MARKER
const FEHLER = 'FEHLER '
const WARNUNG = 'warnung'
const HINWEIS = 'HINWEIS'
function melde(code, datei, wo, was, art = FEHLER) {
  const h = art === FEHLER ? HINGENOMMEN.find((x) => x.code === code && x.datei === datei && x.wo.test(wo)) : null
  befunde.push({ art: h ? WARNUNG : art, code, datei, wo, was: h ? `${was} — hingenommen bis Entscheid (seit ${h.seit}: ${h.grund})` : was })
}
const kurz = (text, pos, len) => umfeld(text, pos, len, 8)

// ------------------------------------------------------------------ Lesen

const lies = (p) => readFileSync(p, 'utf8').replace(/^﻿/, '').replace(/\r\n?/g, '\n')
const dateien = readdirSync(ASSETS).sort()
const skelett = {}
for (const f of dateien.filter((x) => x.endsWith('.json'))) {
  try { skelett[f] = JSON.parse(lies(join(ASSETS, f))) } catch (e) { melde('ERR_SKEL_JSON', f, f, e.message) }
}

/** Jede Zeichenkette eines JSON mit Pfad; auch die Schlüssel (als «pfad#schluessel»). */
function* blaetter(o, p = '') {
  if (typeof o === 'string') yield [p, o]
  else if (Array.isArray(o)) for (let i = 0; i < o.length; i++) yield* blaetter(o[i], `${p}[${i}]`)
  else if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) { yield [`${p ? p + '.' : ''}${k}#schluessel`, k]; yield* blaetter(v, p ? `${p}.${k}` : k) }
}
const festerText = (s) => s.replace(RE_PLATZHALTER, ' ')

// ------------------------------------------ PLATZHALTER · ESZETT (alle Dateien)

function pruefePlatzhalter(datei, wo, s) {
  for (const m of s.matchAll(RE_PLATZHALTER)) {
    const innen = m[0].slice(2, -2)
    if (!innen.trim()) melde('ERR_SKEL_PLATZHALTER_FORM', datei, wo, 'leerer Platzhalter «{{}}»')
    else if (/[{}]/.test(innen)) melde('ERR_SKEL_PLATZHALTER_FORM', datei, wo, `geschweifte Klammer im Platzhalter — check-all findet ihn so nicht: «${kurz(s, m.index, m[0].length)}»`)
    else if (!TOR_PLATZHALTER.test(m[0])) melde('ERR_SKEL_PLATZHALTER_FORM', datei, wo, `check-all (ERR_PLATZHALTER) erkennt diesen Platzhalter nicht: «${kurz(s, m.index, m[0].length)}»`)
  }
  const rest = festerText(s)
  const offen = /\{\{|\}\}/.exec(rest)
  if (offen) melde('ERR_SKEL_PLATZHALTER_FORM', datei, wo, `«${offen[0]}» ohne Gegenstück: «${kurz(rest, offen.index, 2)}»`)
  return rest
}

for (const [f, j] of Object.entries(skelett)) {
  for (const [p, s] of blaetter(j)) {
    if (s.includes('ß')) melde('ERR_SKEL_ESZETT', f, p, `«${kurz(s, s.indexOf('ß'), 1)}»`)
    const rest = pruefePlatzhalter(f, p, s)
    if (p.endsWith('#schluessel')) continue
    // Im festen Text eines JSON-Skeletts steht keine zweite Platzhalterform.
    const zweite = /<[A-Za-zÄÖÜ][^<>]{1,60}>|\[(?:[A-ZÄÖÜ]{3,}[^\]]*|…|\.\.\.)\]|\bTODO\b|\bTBD\b|\bXXX\b/.exec(rest)
    if (zweite) melde('ERR_SKEL_PLATZHALTER_FORM', f, p, `zweite Platzhalterform «${zweite[0]}» im festen Text — die Form ist «{{…}}»`)
    // Ein einzelnes Wort ohne Leerraum ist ein technischer Wert (Kennung, Pfad, Aufzählungswert), kein Text.
    const t = /\s/.test(rest.trim()) ? [...rest.matchAll(RE_TRANSLIT)][0] : null
    if (t) melde('ERR_SKEL_TRANSLIT', f, p, `«${t[0]}» — Umlaut transliteriert`)
  }
}

// ------------------------------- ANREDE · GESPERRT (Felder der Lernenden)

{
  const heft = skelett['herausforderung-template.json']
  const set = skelett['set-template.json']
  const E = { hefte: heft ? [{ heft: 'A', datei: 'herausforderung-template.json', json: heft }] : [], json: { ...(set ? { 'set.json': set } : {}) }, begleiter: null, quellen: new Map(), methoden: new Map() }
  if (skelett['quelle-template.json']) E.quellen.set('quelle-template', { karte: skelett['quelle-template.json'] })
  // Wie `lernende` in scripts/check-kohaerenz.mjs: Hefte, gemeinsamer Auftrag und Glossar — ohne Lösungsfelder und Technik.
  const lernende = textfelder(E, { begleiter: false, kn: false }).filter((f) => (f.traeger === 'A' || f.traeger === 'karte' || (f.datei === 'set.json' && (f.pfad.startsWith('gemeinsamer_auftrag') || f.pfad.startsWith('glossar')))) && !f.loesung && !/kontext_ausschluss|aktivierte_trade_offs|dekontextualisierung|\.wo$|sozialform\.zulaessig/.test(f.pfad))
  for (const f of lernende) {
    const datei = f.datei === 'set.json' ? 'set-template.json' : f.traeger === 'karte' ? 'quelle-template.json' : f.datei
    const rest = festerText(f.text)
    for (const m of rest.matchAll(RE_GESPERRT)) melde('ERR_SKEL_GESPERRT', datei, f.pfad, `«${m[0]}» im festen Text der Lernenden: «${kurz(rest, m.index, m[0].length)}»`)
    const rede = /situation_text|persona|hybrid_situation|stationen|satzanfaenge|beispiel/.test(f.pfad)
    const du = rede ? null : RE_DU.exec(ohneRede(rest))
    if (du) melde('ERR_SKEL_ANREDE_DU', datei, f.pfad, `«${du[0]}» im festen Text — Aufträge stehen in der Sie-Form`)
    if (!rede) for (const m of f.text.matchAll(RE_PLATZHALTER)) if (/\bDu-Form\b|\bduzen\b/i.test(m[0]) && !/\b(?:nie|nicht|keine?)\b[^.]{0,30}Du-Form/i.test(m[0])) melde('ERR_SKEL_ANREDE_DU', datei, f.pfad, 'die Anweisung im Platzhalter verlangt die Du-Form — Aufträge stehen in der Sie-Form')
  }
}

// ----------------------------------------------------------------- FELDER

function* schluesselPfade(o, p = '') {
  if (Array.isArray(o)) for (const x of o) yield* schluesselPfade(x, `${p}[]`)
  else if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) { const q = p ? `${p}.${k}` : k; yield q; yield* schluesselPfade(v, q) }
}
const GOLD_DATEI = { 'herausforderung-template.json': ['herausforderung_A.json', 'herausforderung_B.json'], 'set-template.json': ['set.json'], 'kn-template.json': ['kn.json'], 'prinzip-template.json': ['prinzip.json'] }
{
  const goldDir = join(wurzel, 'src', 'data', 'einheiten', GOLD)
  const vertragPfad = join(SKILL, 'references', 'datenvertrag.md')
  const typesPfad = join(wurzel, 'src', 'lib', 'einheiten', 'types.ts')
  const fehlt = [existsSync(goldDir) ? null : `Gold-Einheit ${GOLD}`, existsSync(vertragPfad) ? null : 'references/datenvertrag.md', existsSync(typesPfad) ? null : 'src/lib/einheiten/types.ts'].filter(Boolean)
  if (fehlt.length) melde('HINWEIS_SKEL_NICHT_GEPRUEFT', 'assets', 'FELDER', `fehlt im Baum: ${fehlt.join(', ')} — Feldpfade nur gegen das Vorhandene geprüft`, HINWEIS)

  // Datenvertrag: jeder Pfad in Backticks in der ersten Spalte einer Tabellenzeile. «*» steht für einen freien Schlüssel.
  const vertrag = new Set()
  if (existsSync(vertragPfad)) for (const z of lies(vertragPfad).split('\n')) {
    const erste = /^\|([^|]*)\|/.exec(z)?.[1]
    if (!erste) continue
    for (const m of erste.matchAll(/`([A-Za-z_][\w.[\]*<>|/-]*)`/g)) vertrag.add(m[1])
  }
  // Der Datenvertrag schreibt Pfade in Untertabellen relativ zum Abschnitt («produkte[].form» unter gemeinsamer_auftrag):
  // Ein Pfad gilt als belegt, wenn er ganz oder ab einer Segmentgrenze im Vertrag steht.
  const vertragMuster = [...vertrag].filter((v) => v.includes('*')).map((v) => new RegExp('(?:^|\\.)' + v.replace(/[.[\]]/g, '\\$&').replace(/\*/g, '[^.\\[\\]]+') + '$'))
  const imVertrag = (p) => {
    const teile = p.split('.')
    for (let i = 0; i < teile.length; i++) if (vertrag.has(teile.slice(i).join('.'))) return true
    return vertragMuster.some((re) => re.test(p))
  }
  // types.ts, statisch: jeder Eigenschaftsname in einer Interface- oder Typdeklaration (auch in einer Zeile mit
  // mehreren). Namensebene, kein Pfad. Kommentare zählen nicht.
  const typNamen = new Set()
  if (existsSync(typesPfad)) for (const m of lies(typesPfad).replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, ' ').matchAll(/(?<![\w.'"])['"]?([A-Za-z_]\w*)['"]?\??:\s/g)) typNamen.add(m[1])

  // Quellenkarte: Felder gegen die vorhandenen Karten (jede Karte unter src/data/quellen/).
  const quellenDir = join(wurzel, 'src', 'data', 'quellen')
  const kartenPfade = new Set()
  if (existsSync(quellenDir)) for (const f of readdirSync(quellenDir).filter((x) => x.endsWith('.json') && !x.startsWith('_'))) { try { for (const p of schluesselPfade(JSON.parse(lies(join(quellenDir, f))))) kartenPfade.add(p) } catch { /* unlesbare Karte: check-namen meldet sie */ } }

  for (const [f, j] of Object.entries(skelett)) {
    const gold = new Set()
    for (const g of GOLD_DATEI[f] ?? []) { const p = join(goldDir, g); if (existsSync(p)) { try { for (const x of schluesselPfade(JSON.parse(lies(p)))) gold.add(x) } catch { /* Gold unlesbar: check-all meldet es */ } } }
    const bekannt = f === 'quelle-template.json' ? kartenPfade : gold
    const pfade = [...new Set([...schluesselPfade(j)])].filter((p) => !/\{\{/.test(p))
    let nurVertrag = 0; let unbekannt = 0; let ohneTyp = 0
    const ohneTypUndVertrag = []
    for (const p of pfade) {
      const inGold = bekannt.has(p)
      const inVertrag = imVertrag(p)
      const name = p.split('.').pop().replace(/\[\]$/, '')
      const inTyp = typNamen.has(name)
      if (FELDER) console.log(`  ${f.padEnd(30)} ${inGold ? 'Gold   ' : '—      '} ${inVertrag ? 'Vertrag' : '—      '} ${inTyp ? 'types' : '—    '}  ${p}`)
      if (!inGold && !inVertrag) { unbekannt++; melde('ERR_SKEL_FELD_UNBEKANNT', f, p, `Feld steht weder in ${f === 'quelle-template.json' ? 'einer Quellenkarte' : 'der Gold-Einheit'} noch im Datenvertrag${inTyp ? ' (der Name kommt in types.ts vor)' : ''}`) }
      else if (!inGold) nurVertrag++
      if (typNamen.size && !inTyp && (inGold || inVertrag)) { ohneTyp++; if (!inVertrag) ohneTypUndVertrag.push(p) }
    }
    // Ein Name, den types.ts nicht kennt, ist kein Befund, solange der Datenvertrag das Feld führt («nur Gold»).
    if (ohneTypUndVertrag.length) melde('WARN_SKEL_FELD_NICHT_IN_TYPES', f, `${ohneTypUndVertrag.length} Feldpfad(e)`, `der Feldname kommt in types.ts nicht vor, und der Datenvertrag führt den Pfad nicht: ${ohneTypUndVertrag.slice(0, 10).join(', ')}${ohneTypUndVertrag.length > 10 ? ' …' : ''}`, WARNUNG)
    felderZeilen.push(`${f}: ${pfade.length} Feldpfade · ${pfade.length - unbekannt - nurVertrag} in ${f === 'quelle-template.json' ? 'den Quellenkarten' : 'Gold'} · ${nurVertrag} nur im Datenvertrag · ${unbekannt} unbekannt · ${ohneTyp} Feldname(n) nicht in types.ts`)
  }
}

// -------------------------------------------------------------- FESTWERTE

if (skelett['set-template.json'] && skelett['set-template.json'].status !== 'entwurf') melde('ERR_SKEL_FESTWERT', 'set-template.json', 'status', `«${skelett['set-template.json'].status}» — eine neue Einheit trägt "entwurf"`)
if (skelett['herausforderung-template.json'] && skelett['herausforderung-template.json'].template !== TEMPLATE_V42) melde('ERR_SKEL_FESTWERT', 'herausforderung-template.json', 'template', `«${skelett['herausforderung-template.json'].template}» — Soll ${TEMPLATE_V42}`)

// --------------------------------------------------- Markdown-Skelette

const zeileVon = (text, pos) => text.slice(0, pos).split('\n').length
for (const f of dateien.filter((x) => x.endsWith('.md'))) {
  const text = lies(join(ASSETS, f))
  for (const m of text.matchAll(/ß/g)) melde('ERR_SKEL_ESZETT', f, `Zeile ${zeileVon(text, m.index)}`, `«${kurz(text, m.index, 1)}»`)
  if (f === 'bericht-template.md') {
    for (const m of text.matchAll(/\{\{|\}\}/g)) melde('ERR_SKEL_PLATZHALTER_FORM', f, `Zeile ${zeileVon(text, m.index)}`, `«${m[0]}» — im Bericht-Gerüst ist die Form «<…>»`)
    // Spitze Klammern gehen auf: ohne Kommentare, Pfeile und Vergleichszeichen mit Leerraum.
    const t = text.replace(/<!--[\s\S]*?-->/g, (x) => x.replace(/[<>]/g, ' ')).replace(/[-=]>/g, '  ').replace(/\s[<>]=?\s/g, '   ')
    let tiefe = 0; let auf = -1
    for (let i = 0; i < t.length; i++) {
      if (t[i] === '<') { if (tiefe === 0) auf = i; tiefe++ } else if (t[i] === '>') { if (tiefe === 0) melde('ERR_SKEL_PLATZHALTER_FORM', f, `Zeile ${zeileVon(t, i)}`, '«>» ohne «<» davor'); else tiefe-- }
    }
    if (tiefe > 0) melde('ERR_SKEL_PLATZHALTER_FORM', f, `Zeile ${zeileVon(t, auf)}`, '«<» ohne «>» danach')
    continue
  }
  // Platzhalter: je Zeile (ein Platzhalter läuft nie über einen Zeilenwechsel).
  text.split('\n').forEach((z, i) => { if (/\{\{|\}\}/.test(z)) pruefePlatzhalter(f, `Zeile ${i + 1}`, z) })
  // Marker gehen zu, und ihr Pfad führt in ein Feld des passenden Skeletts.
  const auf = [...text.matchAll(/<!--\s*hko:([^|\s>]+?)(?:\s*\|\s*([a-z]+))?\s*-->/g)]
  const zu = [...text.matchAll(/<!--\s*\/hko\s*-->/g)]
  if (auf.length !== zu.length) melde('ERR_SKEL_MARKER', f, 'Marker', `${auf.length} öffnende, ${zu.length} schliessende Marker`)
  const WURZEL = { hf_A: 'herausforderung-template.json', hf_B: 'herausforderung-template.json', set: 'set-template.json', kn: 'kn-template.json', prinzip: 'prinzip-template.json' }
  let geprueft = 0
  for (const m of auf) {
    const [kopf, ...rest] = m[1].split('.')
    if (kopf === 'quellen' && !rest.length) continue // «quellen|quellenstand» baut das Marker-Skript aus den Karten
    const j = skelett[WURZEL[kopf]]
    if (!WURZEL[kopf]) { melde('ERR_SKEL_MARKER', f, `Zeile ${zeileVon(text, m.index)}`, `Marker «${m[1]}» beginnt mit keinem bekannten Dokument (hf_A, hf_B, set, kn, prinzip)`); continue }
    if (!j) continue
    // Wie pfadWert() in scripts/begleiter-marker.mjs der Skill; ein Index über dem Skelett-Beispiel meint dessen erstes Element.
    let cur = j; let ok = true
    for (const teil of rest) {
      const t = /^([^[\]]+)((?:\[\d+\])*)$/.exec(teil)
      if (!t || cur === null || typeof cur !== 'object') { ok = false; break }
      cur = cur[t[1]]
      for (const idx of t[2].match(/\d+/g) ?? []) { if (!Array.isArray(cur) || !cur.length) { ok = false; break } cur = cur[Math.min(+idx, cur.length - 1)] }
      if (!ok || cur === undefined) { ok = false; break }
    }
    geprueft++
    if (!ok) melde('ERR_SKEL_MARKER', f, `Zeile ${zeileVon(text, m.index)}`, `Marker «${m[1]}» führt in kein Feld von ${WURZEL[kopf]}`)
  }
  markerZeile = `${f}: ${auf.length} Marker, ${geprueft} Pfade gegen die JSON-Skelette geprüft`
}

// ------------------------------------------- FEST (Auftragsvorlagen)

let vorlagenZeilen = 0
for (const ref of ['gegenleser.md', 'audits.md']) {
  const p = join(SKILL, 'references', ref)
  if (!existsSync(p)) { melde('HINWEIS_SKEL_NICHT_GEPRUEFT', `references/${ref}`, ref, 'Datei fehlt — Auftragsvorlagen nicht geprüft', HINWEIS); continue }
  lies(p).split('\n').forEach((z, i) => {
    if (!/^>/.test(z)) return
    vorlagenZeilen++
    if (z.includes('ß')) melde('ERR_SKEL_ESZETT', `references/${ref}`, `Zeile ${i + 1}`, `«${kurz(z, z.indexOf('ß'), 1)}»`)
    for (const [re, was] of FEST) { const m = re.exec(z); if (m) melde('ERR_SKEL_FEST', `references/${ref}`, `Zeile ${i + 1}`, `${was} «${m[0]}» in einer Auftragsvorlage — aus der Einheit herleiten (Platzhalter)`) }
  })
}

// ---------------------------------------------------------------- Ausgabe

console.log(`${NAME} — ${dateien.length} Vorlagen unter ${SKILL_REL}/assets · ${vorlagenZeilen} Zeilen Auftragsvorlage in references/gegenleser.md, audits.md`)
for (const z of felderZeilen) console.log(`  ${z}`)
if (markerZeile) console.log(`  ${markerZeile}`)
console.log('  Felder: Pfad gegen Gold-Einheit und Datenvertrag; gegen types.ts nur der Feldname (statisch gelesen, kein Compiler)')
befunde.sort((a, b) => [FEHLER, WARNUNG, HINWEIS].indexOf(a.art) - [FEHLER, WARNUNG, HINWEIS].indexOf(b.art))
if (befunde.length) console.log('')
for (const b of befunde) console.log(`  ${b.art}  ${b.code}  ${b.datei} › ${b.wo}\n           ${b.was}`)
const n = (a) => befunde.filter((b) => b.art === a).length
console.log(`\n${n(FEHLER) ? `ROT — ${n(FEHLER)} Fehler, ${n(WARNUNG)} Warnung(en), ${n(HINWEIS)} Hinweis(e).` : `GRUEN — keine Fehler, ${n(WARNUNG)} Warnung(en), ${n(HINWEIS)} Hinweis(e).`}`)
process.exit(n(FEHLER) ? 1 : 0)
