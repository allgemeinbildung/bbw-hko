#!/usr/bin/env node
// Erzeugt ein SCORM-1.2-Paket fuer eine Herausforderung — vollstaendig aus
// src/data/einheiten/<slug>/herausforderung_<X>.json abgeleitet.
//
//   node scripts/build-scorm.mjs 3.2.1_wahre_kosten A
//   node scripts/build-scorm.mjs 3.2.1_wahre_kosten --all
//   node scripts/build-scorm.mjs --all
//   node scripts/build-scorm.mjs 3.2.1_wahre_kosten A --out scorm/generated
//
// Vorbild ist das handgebaute Paket von Pascal Rusch (Mail 17.09.2026):
// gleiche Feedback-Architektur (formal lokal + inhaltlich per KI-Proxy, EIN
// Feedback), gleiche SCORM-Anbindung, gleiche Leistungsdokumentation. Neu ist,
// dass Inhalt und Pruefregeln nicht mehr von Hand in app.js geschrieben, sondern
// aus der Herausforderung abgeleitet werden — und dass die seither
// dazugekommenen Felder (Methodenkarten, Scaffolding je Leitfrage, liefert-Kette,
// Mehrdeutigkeit, Lernfortschritt) mitgenommen werden.
//
// Der Generator erfindet nichts. Was nicht aus den Daten folgt, entsteht auch
// nicht — er meldet stattdessen, welche Pruefung er fuer welchen Posten
// herleiten konnte und welche nicht.

import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync, rmSync, cpSync } from 'node:fs'
import { join, resolve, basename } from 'node:path'
import { fileURLToPath } from 'node:url'
import { deflateRawSync } from 'node:zlib'

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)))
const UNITS = join(ROOT, 'src', 'data', 'einheiten')
const METHODEN = join(ROOT, 'src', 'data', 'methoden')
const TEMPLATE = join(ROOT, 'scripts', 'scorm-template')

/* Zentral betriebener Proxy aus Pascals ANLEITUNG-KI-Baustein.md. Er ist an den
   Aufruf aus OLAT gebunden; lokal antwortet er 403 und die Einheit faellt auf
   die formale Pruefung zurueck. Ueber HKO_SCORM_PROXY austauschbar. */
const PROXY_URL = process.env.HKO_SCORM_PROXY || 'https://ki-chat-claude-pool-pama.vercel.app/api/chat'

const readJson = (p) => JSON.parse(readFileSync(p, 'utf8'))

/* ---------------------------------------------------------------- CLI */

const argv = process.argv.slice(2)
const outFlag = argv.indexOf('--out')
const OUT = outFlag > -1 ? resolve(ROOT, argv[outFlag + 1]) : join(ROOT, 'scorm', 'generated')
const wantAll = argv.includes('--all')
const noZip = argv.includes('--no-zip')
const positional = argv.filter((a, n) => !a.startsWith('--') && !(outFlag > -1 && n === outFlag + 1))
const [slugArg, letterArg] = positional

/* ---------------------------------------------------------------- Farben */

function clamp(n) { return Math.max(0, Math.min(255, Math.round(n))) }

function darken(hex, factor = 0.72) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex || '')
  if (!m) return hex || '#1a5276'
  const v = parseInt(m[1], 16)
  const r = clamp(((v >> 16) & 255) * factor)
  const g = clamp(((v >> 8) & 255) * factor)
  const b = clamp((v & 255) * factor)
  return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')
}

/* ---------------------------------------------------------------- ZIP

   Eigener Writer statt Compress-Archive: PowerShell schreibt auf Windows
   Backslashes in die Eintragsnamen ("assets\bbw_logo.png"). Die ZIP-Spezifikation
   verlangt Schrägstriche, und ein Java-Entpacker (OLAT) legt sonst eine Datei
   mit Backslash im Namen an — das Logo fehlt dann im Kurs. Store/Deflate von
   Hand ist kuerzer als die Fehlersuche danach. */

const CRC_TABLE = (() => {
  const t = new Int32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[n] = c
  }
  return t
})()

function crc32(buf) {
  let c = -1
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  return (c ^ -1) >>> 0
}

// entries: [{ name: 'assets/bbw_logo.png', data: Buffer }] — name immer mit /
function writeZip(zipPath, entries) {
  const locals = []
  const centrals = []
  let offset = 0
  for (const e of entries) {
    const name = Buffer.from(e.name.replace(/\\/g, '/'), 'utf8')
    const deflated = deflateRawSync(e.data, { level: 9 })
    const useDeflate = deflated.length < e.data.length
    const body = useDeflate ? deflated : e.data
    const method = useDeflate ? 8 : 0
    const crc = crc32(e.data)

    const lh = Buffer.alloc(30)
    lh.writeUInt32LE(0x04034b50, 0)
    lh.writeUInt16LE(20, 4)          // version needed
    lh.writeUInt16LE(0x0800, 6)      // UTF-8 flag
    lh.writeUInt16LE(method, 8)
    lh.writeUInt16LE(0, 10)          // time
    lh.writeUInt16LE(0x21, 12)       // date (2000-01-01, reproduzierbar)
    lh.writeUInt32LE(crc, 14)
    lh.writeUInt32LE(body.length, 18)
    lh.writeUInt32LE(e.data.length, 22)
    lh.writeUInt16LE(name.length, 26)
    lh.writeUInt16LE(0, 28)
    locals.push(lh, name, body)

    const ch = Buffer.alloc(46)
    ch.writeUInt32LE(0x02014b50, 0)
    ch.writeUInt16LE(20, 4)
    ch.writeUInt16LE(20, 6)
    ch.writeUInt16LE(0x0800, 8)
    ch.writeUInt16LE(method, 10)
    ch.writeUInt16LE(0, 12)
    ch.writeUInt16LE(0x21, 14)
    ch.writeUInt32LE(crc, 16)
    ch.writeUInt32LE(body.length, 20)
    ch.writeUInt32LE(e.data.length, 24)
    ch.writeUInt16LE(name.length, 28)
    ch.writeUInt32LE(0, 38)          // external attrs
    ch.writeUInt32LE(offset, 42)
    centrals.push(ch, name)

    offset += lh.length + name.length + body.length
  }
  const centralBuf = Buffer.concat(centrals)
  const end = Buffer.alloc(22)
  end.writeUInt32LE(0x06054b50, 0)
  end.writeUInt16LE(entries.length, 8)
  end.writeUInt16LE(entries.length, 10)
  end.writeUInt32LE(centralBuf.length, 12)
  end.writeUInt32LE(offset, 16)
  writeFileSync(zipPath, Buffer.concat([...locals, centralBuf, end]))
}

/* ---------------------------------------------------------------- Methoden */

// Spiegelt src/lib/einheiten/methoden.ts. Eine unbekannte Referenz wird gemeldet
// und uebersprungen, statt das Paket unbaubar zu machen.
function loadKartei() {
  const kartei = {}
  for (const f of readdirSync(METHODEN).filter((f) => f.endsWith('.json'))) {
    const k = readJson(join(METHODEN, f))
    if (k?.id) kartei[k.id] = k
  }
  return kartei
}

function resolveMethoden(refs, kartei, warn) {
  const out = []
  for (const r of refs || []) {
    if (!r?.ref) continue
    const karte = kartei[r.ref]
    if (!karte) { warn(`Unbekannte Methodenkarte «${r.ref}» — übersprungen.`); continue }
    out.push({
      ...karte,
      ...(r.fuer ? { fuer: r.fuer } : {}),
      ...(r.beispiel?.length ? { beispiel: r.beispiel } : {}),
      ...(r.tun ? { tun: r.tun } : {}),
    })
  }
  return out
}

/* ---------------------------------------------------------------- Ableitungen */

// Labels aus loesung.zeilen sind teils Sachbegriffe («Angebot», «Kapital»), teils
// Meta-Etiketten («Erwartet», «Häufiger Fehler», «Satz 1 — zeigt an»). Nur die
// erste Sorte taugt als Stichwort fuer eine formale Pruefung. Alles andere faellt
// raus — dann prueft bei diesem Posten eben nur die KI. Das ist der ehrlichere
// Weg: ein erfundenes Stichwortkriterium bewertet Wortwahl statt Verstaendnis.
const META_LABEL = /^(erwartet|ebenfalls|häufiger|haeufiger|massstab|hinweis|fehlt|satz|bild|variante|gegenposition|typischer|aufbau|kriterium|beispiel|fall|ergebnis|fazit|ziel|vorgehen|methode|abgrenzung|schwache|starke|gebunden|zweiter|erster|politisch)$/i

/* Ein Stichwort taugt nur, wenn es ein Sachbegriff ist: ein Wort, keine Ziffer,
   kein didaktisches Etikett. Alles andere («Erwartet», «Zweiter Fall»,
   «Gebunden 1», «Satz 1 — zeigt an») ist Ordnungsschrift der Musterloesung und
   haette als Pruefstichwort nur Wortwahl statt Verstaendnis gemessen.
   Bleiben weniger als zwei Begriffe uebrig, prueft bei diesem Posten die KI
   allein — das ist die ehrlichere Luecke. */
function termsFromLoesung(loesung) {
  const terms = []
  const gesehen = new Set()
  for (const z of loesung?.zeilen || []) {
    const label = (z.label || '').trim().replace(/[?!:]+$/, '')
    if (!label) continue
    if (/\d/.test(label)) continue
    if (/^muster/i.test(label)) continue
    if (gesehen.has(label.toLowerCase())) continue
    gesehen.add(label.toLowerCase())
    if (label.includes('—') || label.includes('–')) continue
    // «Boden/Umwelt» ist EIN Begriff mit zwei zulaessigen Schreibweisen — die
    // Ein-Wort-Regel gilt je Schreibweise, nicht fuer das Label als Ganzes.
    const alt = label.split('/').map((s) => s.trim()).filter(Boolean)
    if (!alt.length || alt.some((a) => a.split(/\s+/).length > 1)) continue
    if (alt.some((a) => META_LABEL.test(a))) continue
    terms.push(alt)
  }
  return terms
}

function pruefpunkteFromLoesung(loesung, maxN = 3) {
  const zeilen = (loesung?.zeilen || []).filter((z) => z.text)
  const punkte = zeilen.slice(0, maxN).map((z) => ({
    label: (z.label || 'Inhalt').replace(/\s*[—–]\s*/g, ' — '),
    erwartung: z.text,
  }))
  return punkte
}

function kontextFromLoesung(loesung) {
  const kern = loesung?.kern ? loesung.kern + '. ' : ''
  const zeilen = (loesung?.zeilen || [])
    .filter((z) => z.text)
    .map((z) => `${z.label}: ${z.text}${z.quelle ? ` (${z.quelle})` : ''}`)
    .join(' ')
  return (kern + zeilen).trim()
}

// Eine Herausforderung ist an diesem Posten mehrdeutig, wenn die Musterloesung
// selbst eine zweite tragfaehige Position auffuehrt.
function istMehrdeutig(loesung) {
  return (loesung?.zeilen || []).some((z) => /^(ebenfalls|auch|alternativ)/i.test((z.label || '').trim()))
}

// «Sprechspur als Text (150–200 Wörter)» -> {min:150, max:200}
function wordRangeFrom(str) {
  const m = /(\d{2,4})\s*(?:bis|–|-|—)\s*(\d{2,4})\s*W[öo]rter/i.exec(str || '')
  if (m) return { min: Number(m[1]), max: Number(m[2]) }
  const single = /(\d{2,4})\s*W[öo]rter/i.exec(str || '')
  return single ? { min: Number(single[1]), max: null } : null
}

const istTextAbgabe = (s) => /W[öo]rter/i.test(s || '')

// Zahlen aus der Zahlentabelle, auf die sich eine Antwort beziehen kann.
function zahlenAus(tabelle) {
  const out = new Set()
  for (const z of tabelle || []) {
    for (const m of String(z.wert || '').matchAll(/\d[\d'’.]*/g)) {
      const v = m[0].replace(/['’]/g, '')
      if (v.replace(/\D/g, '').length >= 2) out.add(v)
    }
  }
  return [...out]
}

/* ---------------------------------------------------------------- Aufbau */

function buildData(sit, kartei, report) {
  const items = []
  const warn = (m) => report.warnings.push(m)

  /* ---- Leitfragen ---- */
  for (const lf of sit.leitfragen || []) {
    const id = 'lf' + lf.nr
    const criteria = [{
      kind: 'minWords', n: 25,
      label: 'Umfang ausreichend', quelle: 'Aufgabenstellung',
      hinweisOk: 'Der Umfang reicht für eine ausgeführte Antwort.',
      hinweisFehlt: 'Antworten Sie ausführlicher (mind. ca. 25 Wörter).',
    }]

    const terms = termsFromLoesung(lf.loesung)
    if (terms.length >= 2) {
      const need = Math.max(2, Math.ceil(terms.length * 0.6))
      criteria.push({
        kind: 'anyOf', terms, need,
        label: `Fachbegriffe verwendet (${need} von ${terms.length})`,
        quelle: lf.knoten_ref ? lf.knoten_ref.split('|')[0].trim() : 'Lehrmittel',
        hinweisOk: 'Die tragenden Begriffe der Aufgabe kommen vor.',
        hinweisFehlt: `Verwenden Sie die Fachbegriffe: ${terms.map((t) => t[0]).join(', ')}.`,
      })
      report.items.push(`${id}: Stichwortprüfung aus ${terms.length} Begriffen (${terms.map((t) => t[0]).join(', ')})`)
    } else {
      report.items.push(`${id}: keine Stichwortprüfung ableitbar — nur Umfang + KI`)
    }

    items.push({
      id, group: 'lf', section: 'sec-leitfragen',
      tag: 'LF' + lf.nr,
      label: lf.liefert || 'Leitfrage ' + lf.nr,
      bloom: lf.bloom || '',
      quelle: (lf.knoten_ref || '').replace(/\s*\|\s*/g, ' · '),
      prompt: lf.text,
      liefert: lf.scaffolding?.produkt || '',
      minWords: 25, maxWords: null,
      scaffold: lf.scaffolding || null,
      criteria,
      ki: lf.loesung ? {
        aufgabe: lf.text,
        kontext: kontextFromLoesung(lf.loesung),
        pruefpunkte: pruefpunkteFromLoesung(lf.loesung),
        ambiguity: (sit.mehrdeutigkeit?.explizit && istMehrdeutig(lf.loesung)) ? sit.mehrdeutigkeit.hint : null,
      } : null,
    })
  }

  /* ---- Mindmap ----
     Die punkte der Aeste sind Loesung, nicht Aufgabe (DocS zeigt sie den
     Lernenden nur in der vollen Variante). Sie gehen deshalb in die
     KI-Rubrik, nie in die Oberflaeche. */
  ;(sit.mindmap_aeste || []).forEach((ast, i) => {
    if (ast.optional) return
    const id = 'mm' + (i + 1)
    items.push({
      id, group: 'mindmap', section: 'sec-mindmap',
      tag: 'Ast ' + (i + 1),
      label: ast.titel,
      bloom: '', quelle: '',
      prompt: `Ergänzen Sie die Detail-Punkte zum Ast «${ast.titel}» — ein Punkt pro Zeile.`,
      liefert: '',
      minWords: 12, maxWords: null,
      scaffold: null,
      criteria: [
        {
          kind: 'lines', n: 3,
          label: 'Mindestens drei Punkte', quelle: 'Bewertungsraster',
          hinweisOk: 'Der Ast trägt mehrere Punkte.',
          hinweisFehlt: 'Schreiben Sie mindestens drei Punkte, je einen pro Zeile.',
        },
        {
          kind: 'minWords', n: 12,
          label: 'Punkte ausformuliert', quelle: 'Aufgabenstellung',
          hinweisOk: 'Die Punkte sind mehr als Einzelwörter.',
          hinweisFehlt: 'Formulieren Sie die Punkte aus — Einzelwörter tragen den Ast nicht.',
        },
      ],
      ki: ast.punkte?.length ? {
        aufgabe: `Detail-Punkte zum Mindmap-Ast «${ast.titel}» im Zentrum «${sit.mindmap_zentrum}».`,
        kontext: 'Erwartete Punkte: ' + ast.punkte.join(' / '),
        pruefpunkte: [
          { label: 'Inhaltlich zum Ast passend', erwartung: `Die Punkte gehören zum Ast «${ast.titel}» und nicht zu einem anderen.` },
          { label: 'Mehrere verschiedene Aspekte', erwartung: 'Die Punkte wiederholen sich nicht, sondern decken verschiedene Aspekte ab.' },
        ],
        ambiguity: null,
      } : null,
    })
  })

  /* ---- Handlungsprodukt ----
     abgaben ist der Vertrag: was Woerter hat, wird getippt und geprueft; alles
     andere entsteht ausserhalb der Lerneinheit (Aufnahme, Bild, Folie) und kann
     hier nur bestaetigt werden. */
  const hp = sit.handlungsprodukt || {}
  const abgaben = hp.abgaben || []
  const textAbgaben = abgaben.filter(istTextAbgabe)
  const restAbgaben = abgaben.filter((a) => !istTextAbgabe(a))
  const zahlen = zahlenAus(sit.zahlen_tabelle)

  const lfKriterien = (sit.lernfortschritt?.kriterien || []).map((k) => ({
    label: k.kriterium, erwartung: k.indikator,
  }))

  textAbgaben.forEach((abgabe, i) => {
    const range = wordRangeFrom(abgabe)
    const id = 'pos' + (textAbgaben.length > 1 ? i + 1 : '')
    const criteria = []
    if (range) {
      // Toleranzband um den Zielbereich — wie im Original, damit nicht ein Wort
      // zu viel ein Kriterium kippt.
      const min = Math.floor(range.min * 0.85)
      const max = range.max ? Math.ceil(range.max * 1.15) : null
      criteria.push(max
        ? {
            kind: 'wordRange', min, max,
            label: `Wortzahl im Zielbereich (${range.min}–${range.max})`, quelle: 'Vorgabe',
            hinweisOk: 'Die Wortzahl liegt im oder nahe am Zielbereich.',
            hinweisFehlt: `Ziel sind ${range.min}–${range.max} Wörter.`,
          }
        : {
            kind: 'minWords', n: min,
            label: `Umfang erreicht (mind. ${range.min} Wörter)`, quelle: 'Vorgabe',
            hinweisOk: 'Der Umfang ist erreicht.',
            hinweisFehlt: `Ziel sind mindestens ${range.min} Wörter.`,
          })
    }
    if (zahlen.length) {
      criteria.push({
        kind: 'number', values: zahlen,
        label: 'Bezug auf die Zahlen der Ausgangslage', quelle: 'Zahlentabelle',
        hinweisOk: 'Mindestens eine Zahl aus der Ausgangslage kommt vor.',
        hinweisFehlt: 'Belegen Sie mit mindestens einer Zahl aus der Tabelle in der Ausgangslage.',
      })
    }
    if (sit.mehrdeutigkeit?.explizit) {
      criteria.push({
        kind: 'tradeoff',
        label: 'Zielkonflikt benannt', quelle: 'Gütekriterium: Mehrdeutigkeit',
        hinweisOk: 'Beide Seiten werden nebeneinandergestellt.',
        hinweisFehlt: `Benennen Sie den Zielkonflikt ausdrücklich: ${sit.mehrdeutigkeit.trade_off}.`,
      })
    }

    items.push({
      id, group: 'pos', section: 'sec-pos',
      tag: 'Abgabe ' + (i + 1),
      label: abgabe,
      bloom: '', quelle: hp.titel || '',
      // Die Karte fragt genau den Textteil ab, nicht das ganze Produkt — das
      // steht als Auftrag ueber der Sektion.
      prompt: `Textteil Ihrer Abgabe: ${abgabe}.`,
      liefert: '',
      minWords: range ? range.min : 100,
      maxWords: range ? range.max : null,
      scaffold: hp.scaffolding || null,
      criteria,
      ki: lfKriterien.length ? {
        aufgabe: `${hp.titel || 'Handlungsprodukt'} — ${hp.format_detail || ''}`.trim(),
        kontext: (hp.musterloesung?.abschnitte || [])
          .flatMap((a) => (a.zeilen || []).map((z) => `${a.titel}: ${z.text}`))
          .join(' ') || hp.beschreibung || '',
        pruefpunkte: lfKriterien,
        ambiguity: sit.mehrdeutigkeit?.explizit ? sit.mehrdeutigkeit.hint : null,
      } : null,
    })
    report.items.push(`${id}: ${criteria.map((c) => c.kind).join(' + ')}${lfKriterien.length ? ' + KI aus lernfortschritt.kriterien' : ' — ohne KI-Rubrik'}`)
  })

  if (restAbgaben.length) {
    const raster = (sit.bewertungsraster || []).find((r) => /handlungsprodukt/i.test(r.produkt || ''))
    const checks = raster?.vollstaendig_wenn?.length ? raster.vollstaendig_wenn : restAbgaben
    items.push({
      id: 'decl', group: 'decl', section: 'sec-pos',
      tag: 'Abgabe ausserhalb',
      label: restAbgaben.join(' · '),
      quelle: hp.titel || '',
      prompt: `Diese Teile entstehen ausserhalb der Lerneinheit: ${restAbgaben.join(', ')}. `
        + `Bestätigen Sie, was auf Ihre Abgabe zutrifft — die Lerneinheit kann das nicht selbst prüfen.`,
      checks,
      criteria: [], ki: null, scaffold: null,
    })
    report.items.push(`decl: ${checks.length} Selbstdeklarations-Punkte aus bewertungsraster/Handlungsprodukt`)
  }

  /* ---- Reflexion + Transfer ---- */
  const kurz = (s, n = 52) => (s || '').length > n ? (s || '').slice(0, n).replace(/\s+\S*$/, '') + ' …' : (s || '')

  ;(sit.reflexion_fragen || []).forEach((r, i) => {
    items.push({
      id: 'r' + (i + 1), group: 'reflexion', section: 'sec-reflexion',
      tag: r.nr || 'R' + (i + 1),
      label: kurz(r.text),
      bloom: '', quelle: '', prompt: r.text + (r.sub ? ' ' + r.sub : ''),
      liefert: '', minWords: 15, maxWords: null, scaffold: null,
      criteria: [{
        kind: 'minWords', n: 15,
        label: 'Ausgeführt beantwortet', quelle: 'Selbstcheck',
        hinweisOk: 'Die Antwort ist ausgeführt.',
        hinweisFehlt: 'Antworten Sie in mindestens zwei Sätzen (ca. 15 Wörter).',
      }],
      ki: null,
    })
  })

  if (sit.dekontextualisierung?.frage) {
    items.push({
      id: 'transfer', group: 'reflexion', section: 'sec-reflexion',
      tag: 'T1', label: kurz(sit.dekontextualisierung.frage),
      bloom: '', quelle: '', prompt: sit.dekontextualisierung.frage,
      liefert: '', minWords: 15, maxWords: null, scaffold: null,
      criteria: [{
        kind: 'minWords', n: 15,
        label: 'Eigenes Beispiel genannt', quelle: 'Transfer',
        hinweisOk: 'Die Antwort nennt einen eigenen Fall.',
        hinweisFehlt: 'Nennen Sie ein konkretes eigenes Beispiel, nicht nur eine allgemeine Regel.',
      }],
      ki: null,
    })
  }

  /* ---- Gewichte ----
     Pascals Verteilung, aber nur ueber die Kategorien, die es hier wirklich
     gibt; die Engine normiert auf die Summe. Existiert eine Abgabe ausserhalb
     der Lerneinheit, gibt das Handlungsprodukt 10 Punkte an sie ab. */
  const hatDecl = items.some((i) => i.group === 'decl')
  const weights = { lf: 30, mindmap: 10, pos: hatDecl ? 30 : 40, reflexion: 20 }
  if (hatDecl) weights.decl = 10

  const methoden = resolveMethoden(sit.methoden, kartei, warn)

  return {
    unitId: sit.id,
    titel: sit.titel,
    badge: `Herausforderung ${sit.buchstabe}`,
    docTag: `DOC-S · HF ${sit.buchstabe} · AUFTRAG`,
    untertitel: [sit.persona?.beruf, sit.persona?.betrieb, sit.handlungsprodukt?.titel]
      .filter(Boolean).join(' · '),
    proxyUrl: PROXY_URL,
    lernproduktSchwelle: 60,
    leitfragenIntro: sit.leitfragen_intro || '',
    mindmapZentrum: sit.mindmap_zentrum || '',
    posTitel: hp.titel || 'Handlungsprodukt',
    posIntro: hp.format_detail || '',
    posBeschreibung: hp.beschreibung || '',
    posSchritte: (hp.schritte || []).map((s) => ({ label: s.label || '', hint: s.hint || '' })),
    intro: {
      persona: sit.persona || {},
      produkt: { titel: hp.titel || '', format: hp.format || '', formatDetail: hp.format_detail || '', beschreibung: hp.beschreibung || '' },
      situationText: sit.situation_text || '',
      leitfrage: sit.leitfrage || '',
      tradeOff: sit.mehrdeutigkeit?.explizit ? { trade_off: sit.mehrdeutigkeit.trade_off, hint: sit.mehrdeutigkeit.hint } : null,
      zahlen: sit.zahlen_tabelle || [],
      quellen: sit.quellen_anker || [],
      fahrplan: sit.wochen_plan || [],
    },
    methoden,
    items,
    weights,
    sectionTitles: {
      'sec-leitfragen': '01 · Leitfragen',
      'sec-mindmap': '02 · Mindmap',
      'sec-pos': '03 · Handlungsprodukt',
      'sec-reflexion': '04 · Selbstcheck',
    },
  }
}

/* ---------------------------------------------------------------- Ausgabe */

const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')

function buildIndexHtml(data) {
  const hatMethoden = data.methoden.length > 0
  const nav = [
    ['sec-intro', 'Ausgangslage'],
    ['sec-leitfragen', 'Leitfragen'],
    ['sec-mindmap', 'Mindmap'],
    ...(hatMethoden ? [['sec-methoden', 'Methoden']] : []),
    ['sec-pos', 'Handlungsprodukt'],
    ['sec-reflexion', 'Selbstcheck'],
    ['sec-abschluss', 'Abschluss'],
  ]
  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(data.titel)}</title>
<link rel="stylesheet" href="style.css">
</head>
<body>

<div class="app-topbar"></div>

<header class="app-header">
  <div class="header-top">
    <div class="brand-block">
      <img src="assets/bbw_logo.png" alt="BBW" class="brand-logo">
      <span class="doc-tag">${esc(data.docTag)}</span>
    </div>
    <div class="progress-wrap">
      <div class="progress-track"><div class="progress-bar" id="overall-progress-bar"></div></div>
      <div id="overall-progress-label">0% bearbeitet</div>
    </div>
  </div>
  <div class="header-rule"></div>
  <div class="title-block">
    <span class="badge">${esc(data.badge)}</span>
    <h1>${esc(data.titel)}</h1>
    <p>${esc(data.untertitel)}</p>
  </div>
</header>

<nav class="section-nav">
${nav.map(([id, label], i) => `  <button class="nav-btn${i === 0 ? ' active' : ''}" data-target="${id}">${esc(label)}</button>`).join('\n')}
</nav>

<main>

  <section class="section active" id="sec-intro">
    <div class="persona-grid">
      <div class="info-box"><h3>Persona</h3><p id="intro-persona"></p></div>
      <div class="info-box"><h3>Handlungsprodukt</h3><p id="intro-produkt"></p></div>
    </div>
    <div class="info-box"><h3>Ausgangslage</h3><p id="intro-situation"></p></div>
    <div class="info-box"><h3>Leitfrage</h3><p id="intro-leitfrage"></p></div>
    <div id="intro-tradeoff-wrap" class="tradeoff-callout"><span id="intro-tradeoff"></span></div>
    <div id="intro-zahlen-wrap">
      <h2>Zahlen der Ausgangslage</h2>
      <table class="checkliste zahlen-tabelle" id="intro-zahlen"></table>
    </div>
    <div id="intro-quellen-wrap">
      <h2>Ressourcen</h2>
      <table class="checkliste" id="intro-quellen"></table>
    </div>
    <div id="intro-fahrplan-wrap">
      <h2>Fahrplan</h2>
      <div class="fahrplan" id="intro-fahrplan"></div>
    </div>
  </section>

  <section class="section" id="sec-leitfragen">
    <h2>Leitfragen</h2>
    <p>${esc(data.leitfragenIntro)}</p>
    <div id="sec-leitfragen-container"></div>
  </section>

  <section class="section" id="sec-mindmap">
    <h2>Mindmap</h2>
    <p>Zentrum und Ast-Titel sind gesetzt — ergänzen Sie die Detail-Punkte selbst, aus Ihren Leitfragen-Antworten und den Ressourcen.</p>
    <div class="mindmap-visual">
      <div class="mm-hub">${esc(data.mindmapZentrum)}</div>
      <div class="mm-connector"></div>
    </div>
    <div class="mm-branches" id="sec-mindmap-container"></div>
  </section>

${hatMethoden ? `  <section class="section" id="sec-methoden">
    <h2>Womit Sie das herstellen</h2>
    <p class="methoden-intro">Vier Werkzeuge, vier Felder. Wo ein Kapitel steht, schlagen Sie im Lehrmittel nach — hier steht, was Sie damit für diese Abgabe machen. Die übrigen Felder stehen für sich.</p>
    <div class="methoden-grid" id="methoden-container"></div>
  </section>

` : ''}  <section class="section" id="sec-pos">
    <h2>Handlungsprodukt: ${esc(data.posTitel)}</h2>
    <p>${esc(data.posIntro)}</p>
    ${data.posBeschreibung ? `<div class="info-box"><h3>Was Sie abgeben</h3><p>${esc(data.posBeschreibung)}</p></div>` : ''}
    ${data.posSchritte.length ? `<h3>So gehen Sie vor</h3>
    <ol class="schritte">
${data.posSchritte.map((s) => `      <li><strong>${esc(s.label)}</strong> ${esc(s.hint)}</li>`).join('\n')}
    </ol>` : ''}
    <div id="sec-pos-container"></div>
  </section>

  <section class="section" id="sec-reflexion">
    <h2>Selbstcheck: Reflexion und Transfer</h2>
    <div id="sec-reflexion-container"></div>
  </section>

  <section class="section" id="sec-abschluss">
    <h2>Abschluss</h2>
    <p>Übersicht über Ihren Bearbeitungsstand. Wenn Sie fertig sind, schliessen Sie die Bearbeitung ab — Ihr Ergebnis wird dabei explizit an das LMS übermittelt (gespeichert wird aber auch schon laufend). Zusätzlich können Sie eine druckbare Übersicht all Ihrer Antworten erstellen, fürs Dossier oder das Gespräch mit der Lehrperson.</p>
    <div class="warn-banner" id="suspend-warn" style="display:none"></div>
    <div id="abschluss-overview"></div>
    <div class="card-actions" style="margin-top:18px;">
      <button id="btn-complete" class="btn-check">✅ Bearbeitung abschliessen</button>
      <button id="btn-print" class="btn-ai">🖨️ Leistungsdokumentation drucken / als PDF speichern</button>
    </div>
    <div id="complete-msg" class="fb-note" style="display:none;"></div>
  </section>

</main>

<!-- Nur beim Drucken sichtbar (siehe @media print in style.css) -->
<div id="print-doc" class="print-only">
  <div class="pd-topbar"></div>
  <div class="pd-header">
    <img src="assets/bbw_logo.png" alt="BBW" class="pd-logo">
    <span class="pd-doctag">DOC-S · HF ${esc(data.badge.slice(-1))} · LEISTUNGSDOKUMENTATION</span>
  </div>
  <div class="pd-rule"></div>
  <div class="pd-badge">${esc(data.badge)}</div>
  <h1 class="pd-title">${esc(data.titel)}</h1>
  <p class="pd-subtitle">Leistungsdokumentation · ${esc(data.untertitel)}</p>
  <div class="pd-grid">
    <div class="pd-box"><div class="pd-box-label">Lernende / Lernender</div><div class="pd-box-value" id="printName"></div></div>
    <div class="pd-box"><div class="pd-box-label">Datum</div><div class="pd-box-value" id="printDate"></div></div>
    <div class="pd-box"><div class="pd-box-label">Gesamtfortschritt</div><div class="pd-box-value" id="printScore"></div></div>
  </div>
  <div class="pd-section-label">Checkliste Vollständigkeit</div>
  <table class="pd-table" id="printOverviewTable"></table>
  <div id="printAnswers"></div>
  <p class="pd-footer">${esc(data.titel)} · BBW</p>
</div>

<footer class="app-footer">
  Adaptive Lernlandschaft · BBW · Formales Feedback lokal regelbasiert, inhaltliches Feedback via KI-Proxy — beide werden automatisch gespeichert.
</footer>

<script src="scorm_api.js"></script>
<script src="app.js"></script>
</body>
</html>
`
}

function buildManifest(sit, data) {
  const ident = 'COM.BBW.HKO.' + String(sit.id || '').toUpperCase().replace(/[^A-Z0-9]+/g, '.')
  return `<?xml version="1.0" standalone="no" ?>
<manifest identifier="${ident}" version="1.0"
  xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2"
  xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd
                       http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd">
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>1.2</schemaversion>
  </metadata>
  <organizations default="ORG-1">
    <organization identifier="ORG-1">
      <title>${esc(data.titel)}</title>
      <item identifier="ITEM-1" identifierref="RES-1" isvisible="true">
        <title>${esc(sit.herausforderung?.label || data.titel)}</title>
        <adlcp:masteryscore>80</adlcp:masteryscore>
      </item>
    </organization>
  </organizations>
  <resources>
    <resource identifier="RES-1" type="webcontent" adlcp:scormtype="sco" href="index.html">
      <file href="index.html"/>
      <file href="scorm_api.js"/>
      <file href="app.js"/>
      <file href="style.css"/>
      <file href="assets/bbw_logo.png"/>
    </resource>
  </resources>
</manifest>
`
}

/* ---------------------------------------------------------------- Lauf */

function buildOne(slug, letter, kartei) {
  const src = join(UNITS, slug, `herausforderung_${letter}.json`)
  if (!existsSync(src)) throw new Error(`Nicht gefunden: ${src}`)
  const sit = readJson(src)

  const report = { slug, letter, items: [], warnings: [] }
  const data = buildData(sit, kartei, report)

  const dir = join(OUT, `${slug}_hf_${letter}`)
  rmSync(dir, { recursive: true, force: true })
  mkdirSync(join(dir, 'assets'), { recursive: true })

  // app.js = Engine mit eingesetztem DATA. Der Platzhalter steht als Kommentar
  // in der Engine, damit die Vorlage fuer sich allein syntaktisch gueltig bleibt.
  const engine = readFileSync(join(TEMPLATE, 'engine.js'), 'utf8')
  const appJs = engine.replace('/*__DATA__*/ null', JSON.stringify(data, null, 1))
  if (appJs === engine) throw new Error('DATA-Platzhalter in engine.js nicht gefunden')

  const css = readFileSync(join(TEMPLATE, 'style.css'), 'utf8')
    .replace('__AKZENT__', sit.sit_farbe || '#2C3E50')
    .replace('__AKZENT_DARK__', darken(sit.sit_farbe || '#2C3E50'))
    .replace('__AKZENT_LIGHT__', sit.sit_farbe_light || '#ECF0F1')
    .replace('__AKZENT_MID__', sit.sit_farbe_mid || '#7F8C8D')

  writeFileSync(join(dir, 'app.js'), appJs, 'utf8')
  writeFileSync(join(dir, 'style.css'), css, 'utf8')
  writeFileSync(join(dir, 'index.html'), buildIndexHtml(data), 'utf8')
  writeFileSync(join(dir, 'imsmanifest.xml'), buildManifest(sit, data), 'utf8')
  cpSync(join(TEMPLATE, 'scorm_api.js'), join(dir, 'scorm_api.js'))
  cpSync(join(ROOT, 'public', 'logo-bbw-doc.png'), join(dir, 'assets', 'bbw_logo.png'))

  let zip = null
  if (!noZip) {
    zip = dir + '.zip'
    rmSync(zip, { force: true })
    // imsmanifest.xml muss auf oberster Ebene des Archivs liegen — gepackt wird
    // der Ordnerinhalt, nicht der Ordner.
    writeZip(zip, [
      { name: 'imsmanifest.xml', data: readFileSync(join(dir, 'imsmanifest.xml')) },
      { name: 'index.html', data: readFileSync(join(dir, 'index.html')) },
      { name: 'app.js', data: readFileSync(join(dir, 'app.js')) },
      { name: 'scorm_api.js', data: readFileSync(join(dir, 'scorm_api.js')) },
      { name: 'style.css', data: readFileSync(join(dir, 'style.css')) },
      { name: 'assets/bbw_logo.png', data: readFileSync(join(dir, 'assets', 'bbw_logo.png')) },
    ])
  }

  return { dir, zip, report, data }
}

function main() {
  const kartei = loadKartei()
  const jobs = []

  if (slugArg && letterArg && !wantAll) {
    jobs.push([slugArg, letterArg.toUpperCase()])
  } else {
    const slugs = slugArg ? [slugArg] : readdirSync(UNITS).filter((d) => existsSync(join(UNITS, d)))
    for (const s of slugs) {
      for (const f of readdirSync(join(UNITS, s)).filter((f) => /^herausforderung_[A-Z]\.json$/.test(f))) {
        jobs.push([s, f.slice('herausforderung_'.length, -'.json'.length)])
      }
    }
  }

  if (!jobs.length) {
    console.error('Nichts zu bauen. Aufruf: node scripts/build-scorm.mjs <slug> <A|B|C>')
    process.exit(1)
  }

  for (const [slug, letter] of jobs) {
    const { dir, zip, report, data } = buildOne(slug, letter, kartei)
    console.log(`\n▣ ${slug} · HF ${letter} — ${data.titel}`)
    console.log(`  ${data.items.length} Posten, Gewichte ${JSON.stringify(data.weights)}, ${data.methoden.length} Methodenkarten`)
    report.items.forEach((l) => console.log(`  · ${l}`))
    report.warnings.forEach((l) => console.log(`  ! ${l}`))
    console.log(`  → ${dir}${zip ? `\n  → ${basename(zip)}` : ''}`)
  }
}

main()
