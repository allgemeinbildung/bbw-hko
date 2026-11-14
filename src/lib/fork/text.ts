// Klartext aus hochgeladener Datei (Word, PDF, Text) bzw. eingefuegtem Text.
// Nur serverseitig (API-Route). ENTSCHEIDE F2, VERTRAG §9.
// Es wird nie Textinhalt geloggt.
import JSZip from 'jszip'
import { extractText, getDocumentProxy } from 'unpdf'

export const MAX_BYTES = 5 * 1024 * 1024
export const MAX_ZEICHEN = 20000

export type TextArt = 'docx' | 'pdf' | 'txt'
export interface TextErgebnis { text: string; art: TextArt; gekuerzt: boolean }

const ZIP_KOPF = [0x50, 0x4b, 0x03, 0x04] // «PK\3\4»
const PDF_KOPF = [0x25, 0x50, 0x44, 0x46, 0x2d] // «%PDF-»
const OLE_KOPF = [0xd0, 0xcf, 0x11, 0xe0] // altes .doc

function beginntMit(b: Uint8Array, kopf: number[]): boolean {
  return b.length >= kopf.length && kopf.every((x, i) => b[i] === x)
}

function endung(name: string): string {
  const i = name.lastIndexOf('.')
  return i >= 0 ? name.slice(i + 1).toLowerCase() : ''
}

/** Zeilenenden vereinheitlichen, Leerraum je Zeile straffen, hoechstens eine Leerzeile, trimmen, kuerzen. */
function normalisieren(roh: string): { text: string; gekuerzt: boolean } {
  let t = roh
    .replace(/\r\n?/g, '\n')
    .replace(/ /g, ' ')
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '')
    .split('\n')
    .map((z) => z.replace(/[ \t]+/g, (m) => (m.includes('\t') ? '\t' : ' ')).trimEnd())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
  const gekuerzt = t.length > MAX_ZEICHEN
  if (gekuerzt) t = Array.from(t).slice(0, MAX_ZEICHEN).join('').trimEnd()
  return { text: t, gekuerzt }
}

/** Dieselbe Normalisierung und Kuerzung fuer eingefuegten Text. */
export function textAusEingabe(s: string): { text: string; gekuerzt: boolean } {
  return normalisieren(s ?? '')
}

const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" }

function entitiesDekodieren(s: string): string {
  return s.replace(/&(#x[0-9a-fA-F]+|#[0-9]+|[a-zA-Z]+);/g, (m, e: string) => {
    if (e[0] === '#') {
      const n = e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10)
      return Number.isFinite(n) && n > 0 && n <= 0x10ffff ? String.fromCodePoint(n) : ''
    }
    return ENTITIES[e] ?? m
  })
}

/** word/document.xml: Absaetze (w:p) als Zeilen, w:t zusammensetzen, w:tab und w:br beachten. */
function docxXmlZuText(xml: string): string {
  const body = xml.match(/<w:body[\s>][\s\S]*<\/w:body>/)?.[0] ?? xml
  const zeilen: string[] = []
  // Absaetze; selbstschliessende <w:p/> ergeben eine Leerzeile
  const absatzRe = /<w:p(?:\s[^>]*)?\/>|<w:p(?:\s[^>]*)?>([\s\S]*?)<\/w:p>/g
  // Text, Tabulator, Umbruch in Dokumentreihenfolge
  const teilRe = /<w:t(?:\s[^>]*)?>([\s\S]*?)<\/w:t>|<w:t(?:\s[^>]*)?\/>|<w:(tab|br|cr)(?:\s[^>]*)?\/>/g
  for (const a of body.matchAll(absatzRe)) {
    const inhalt = a[1] ?? ''
    let z = ''
    for (const t of inhalt.matchAll(teilRe)) {
      if (t[1] !== undefined) z += entitiesDekodieren(t[1])
      else if (t[2] === 'tab') z += '\t'
      else if (t[2] === 'br' || t[2] === 'cr') z += '\n'
    }
    zeilen.push(z)
  }
  return zeilen.join('\n')
}

async function ausDocx(bytes: Uint8Array): Promise<string> {
  let zip: JSZip
  try {
    zip = await JSZip.loadAsync(bytes)
  } catch {
    throw new Error('Die Word-Datei ist beschädigt und lässt sich nicht lesen.')
  }
  const datei = zip.file('word/document.xml')
  if (!datei) throw new Error('Dateityp nicht unterstützt. Erlaubt sind Word (.docx), PDF und Text (.txt).')
  return docxXmlZuText(await datei.async('string'))
}

async function ausPdf(bytes: Uint8Array): Promise<string> {
  try {
    // Kopie, weil PDF.js den Puffer uebernehmen (detachen) kann
    const pdf = await getDocumentProxy(new Uint8Array(bytes))
    const { text } = await extractText(pdf, { mergePages: true })
    return Array.isArray(text) ? text.join('\n\n') : text
  } catch {
    throw new Error('Die PDF-Datei lässt sich nicht lesen (beschädigt oder passwortgeschützt?).')
  }
}

function ausTxt(bytes: Uint8Array): string {
  if (bytes.includes(0)) throw new Error('Dateityp nicht unterstützt. Erlaubt sind Word (.docx), PDF und Text (.txt).')
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes).replace(/^﻿/, '')
  } catch {
    // kein gueltiges UTF-8: als Windows-1252 lesen (aeltere Windows-Textdateien)
    return new TextDecoder('windows-1252').decode(bytes)
  }
}

/** Erkennt die Art am Dateikopf (nicht nur an der Endung) und liefert normalisierten Klartext. */
export async function textAusDatei(name: string, bytes: Uint8Array): Promise<TextErgebnis> {
  if (!bytes || bytes.length === 0) throw new Error('Die Datei ist leer.')
  if (bytes.length > MAX_BYTES) throw new Error('Die Datei ist zu gross (höchstens 5 MB).')
  const ext = endung(name)
  let art: TextArt
  let roh: string
  if (beginntMit(bytes, PDF_KOPF)) {
    art = 'pdf'
    roh = await ausPdf(bytes)
  } else if (beginntMit(bytes, ZIP_KOPF)) {
    art = 'docx'
    roh = await ausDocx(bytes)
  } else if (beginntMit(bytes, OLE_KOPF)) {
    throw new Error('Alte Word-Dateien (.doc) werden nicht unterstützt. Bitte in Word als .docx speichern.')
  } else if (ext === 'txt' || ext === 'md' || ext === '') {
    art = 'txt'
    roh = ausTxt(bytes)
  } else {
    throw new Error('Dateityp nicht unterstützt. Erlaubt sind Word (.docx), PDF und Text (.txt).')
  }
  const { text, gekuerzt } = normalisieren(roh)
  if (!text) throw new Error('Kein Text gefunden (gescanntes PDF?)')
  return { text, art, gekuerzt }
}
