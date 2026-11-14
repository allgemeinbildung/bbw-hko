// Test fuer src/lib/fork/text.ts. Alle Testdateien entstehen hier im Test
// aus selbst geschriebenem Text (Invariante 7: kein fremder Text im Repo).
// Lauf: node --test scripts/fork/text.test.mjs
import { test } from 'node:test'
import assert from 'node:assert/strict'
import JSZip from 'jszip'
import { textAusDatei, textAusEingabe, MAX_ZEICHEN, MAX_BYTES } from '../../src/lib/fork/text.ts'

async function docx(absaetzeXml) {
  const zip = new JSZip()
  zip.file('[Content_Types].xml', '<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"/>')
  zip.file('word/document.xml',
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>' +
    absaetzeXml + '<w:sectPr/></w:body></w:document>')
  return zip.generateAsync({ type: 'uint8array' })
}

// Minimales PDF von Hand: eine Seite, Helvetica, ein Satz; xref mit echten Offsets
function pdf(satz) {
  const inhalt = `BT /F1 12 Tf 72 720 Td (${satz}) Tj ET`
  const objekte = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>',
    `<< /Length ${inhalt.length} >>\nstream\n${inhalt}\nendstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  ]
  let s = '%PDF-1.4\n'
  const offsets = []
  objekte.forEach((o, i) => { offsets.push(s.length); s += `${i + 1} 0 obj\n${o}\nendobj\n` })
  const xref = s.length
  s += `xref\n0 ${objekte.length + 1}\n0000000000 65535 f \n`
  for (const o of offsets) s += `${String(o).padStart(10, '0')} 00000 n \n`
  s += `trailer\n<< /Size ${objekte.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`
  return new TextEncoder().encode(s)
}

test('docx: zwei Absaetze mit Umlauten, Tab, Umbruch, Entities', async () => {
  const bytes = await docx(
    '<w:p><w:r><w:t>Grüezi, die Bäckerei öffnet</w:t></w:r><w:r><w:t xml:space="preserve"> früh &amp; schliesst spät.</w:t></w:r></w:p>' +
    '<w:p><w:r><w:t>Zweiter</w:t><w:tab/><w:t>Absatz</w:t><w:br/><w:t>mit &#252;bergabe &lt;ok&gt;</w:t></w:r></w:p>')
  const r = await textAusDatei('test.docx', bytes)
  assert.equal(r.art, 'docx')
  assert.equal(r.gekuerzt, false)
  assert.equal(r.text, 'Grüezi, die Bäckerei öffnet früh & schliesst spät.\nZweiter\tAbsatz\nmit übergabe <ok>')
})

test('pdf: bekannter Satz wird gelesen', async () => {
  const r = await textAusDatei('test.pdf', pdf('Der Testsatz lautet Apfelbaum am Montag.'))
  assert.equal(r.art, 'pdf')
  assert.match(r.text, /Der Testsatz lautet Apfelbaum am Montag\./)
})

test('Art am Kopf, nicht an der Endung: PDF mit Endung .txt', async () => {
  const r = await textAusDatei('falsch.txt', pdf('Kopf schlaegt Endung.'))
  assert.equal(r.art, 'pdf')
})

test('txt: Normalisierung von Leerzeilen und Rand', async () => {
  const r = await textAusDatei('a.txt', new TextEncoder().encode('﻿  Zeile eins  \r\n\r\n\r\n\r\nZeile   zwei\n\n'))
  assert.deepEqual(r, { text: 'Zeile eins\n\nZeile zwei', art: 'txt', gekuerzt: false })
})

test('Kuerzung auf MAX_ZEICHEN', async () => {
  const lang = 'Wort '.repeat(5000) // 25 000 Zeichen
  const e = textAusEingabe(lang)
  assert.equal(e.gekuerzt, true)
  assert.ok(e.text.length <= MAX_ZEICHEN)
  const d = await textAusDatei('lang.txt', new TextEncoder().encode(lang))
  assert.equal(d.gekuerzt, true)
  assert.ok(d.text.length <= MAX_ZEICHEN)
  assert.deepEqual(textAusEingabe('kurz'), { text: 'kurz', gekuerzt: false })
})

test('falsche Art wird abgelehnt', async () => {
  const png = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0x0d])
  await assert.rejects(textAusDatei('bild.png', png), /nicht unterstützt/)
  await assert.rejects(textAusDatei('bild.txt', png), /nicht unterstützt/)
  const doc = new Uint8Array([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1])
  await assert.rejects(textAusDatei('alt.doc', doc), /\.doc/)
  const zip = new JSZip(); zip.file('hallo.txt', 'kein Word')
  await assert.rejects(textAusDatei('x.docx', await zip.generateAsync({ type: 'uint8array' })), /nicht unterstützt/)
})

test('leer und zu gross', async () => {
  await assert.rejects(textAusDatei('leer.docx', await docx('<w:p/><w:p><w:r><w:t>  </w:t></w:r></w:p>')), /Kein Text gefunden/)
  await assert.rejects(textAusDatei('leer.pdf', pdf('')), /Kein Text gefunden/)
  await assert.rejects(textAusDatei('gross.txt', new Uint8Array(MAX_BYTES + 1)), /zu gross/)
})
