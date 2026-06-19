import { useCallback, useEffect, useMemo, useState } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import JSZip from 'jszip'

import { DocS } from './docs/DocS'
import { DocAustausch } from './docs/DocAustausch'
import { DocKnS } from './docs/DocKnS'
import { DocKnLp } from './docs/DocKnLp'
import { DocKi } from './docs/DocKi'
import { DocLernprompt } from './docs/DocLernprompt'
import { DocLernbegleiter } from './docs/DocLernbegleiter'
import { DocEbaDossier } from './docs/DocEbaDossier'
import { ABTEILUNGEN } from '../../lib/einheiten'
import { knTypLabel } from '../../lib/einheiten/kn-typ-labels'
import type { EinheitFullSet } from '../../lib/einheiten/types'

import { buildDocS, buildAustausch, buildKnS, buildKnLp, buildKi, buildLernprompt, buildLernbegleiter, buildDossier, docToBlob } from '../../lib/einheiten/docx-builder'
import { buildBegleiterDocx } from '../../lib/einheiten/begleiter-builder'

interface Props {
  set: EinheitFullSet
  cssRenderer: string
  cssBegleiter: string
  logoUrl: string
  feedbackUrl: string
  /** B1/B2 — alle abgedeckten Kompetenzen der Einheit (Union über A/B/C; für die README-Übersicht). */
  abgedeckteKompetenzen?: string[]
  /** Vorbelegung des Abteilungs-Dropdowns aus dem LP-Profil (auf eine ABTEILUNGEN-Option gemappt). */
  defaultAbteilung?: string
  /** Read-only guest view: hides the bundle download and the feedback link. */
  readOnly?: boolean
}

type DocSel = 'doc-s' | 'doc-austausch' | 'doc-kn-s' | 'doc-kn-lp' | 'doc-ki-1' | 'doc-ki-2' | 'doc-lernprompt' | 'doc-lernbegleiter' | 'doc-dossier'
type SitLetter = 'A' | 'B' | 'C'

function classifySit(d: EinheitFullSet, letter: SitLetter) {
  return d[`hf_${letter}`]
}

export default function EinheitWorkbench({ set: d, cssRenderer, logoUrl, feedbackUrl, abgedeckteKompetenzen, defaultAbteilung = '', readOnly = false }: Props) {
  // B1/B2 — Union aller abgedeckten Kompetenzen der Einheit (für die README-Übersicht).
  // Die DocS-Fusszeilen verwenden bewusst die PRO-Herausforderung-Werte (sit.nrlp.nr_primary),
  // damit z.B. nur die Kanal-Herausforderung «(+1.1.3)» trägt, nicht jede Seite der Einheit.
  const docAbgedeckte = abgedeckteKompetenzen && abgedeckteKompetenzen.length
    ? abgedeckteKompetenzen
    : Array.from(new Set([d.hf_A, d.hf_B, d.hf_C].flatMap((s) => s?.nrlp?.nr_primary || []).filter(Boolean)))
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  const [doc, setDoc] = useState<DocSel>('doc-s')
  const [situation, setSituation] = useState<SitLetter>('A')
  const [mode, setMode] = useState<'info' | 'fill'>('fill')
  const [abteilung, setAbteilung] = useState(defaultAbteilung || '')
  const [edits, setEdits] = useState<Record<string, string>>({})
  const [knTyp, setKnTyp] = useState<string>(d.kn?.kn_typen?.[0]?.typ || 'fachgespraech')
  const [bundling, setBundling] = useState(false)
  const [toast, setToast] = useState<{ kind: 'ok' | 'error'; msg: string } | null>(null)
  const [navOpen, setNavOpen] = useState(false)
  const [kiOpen, setKiOpen] = useState(false)
  const [wbTop, setWbTop] = useState(80)

  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = '@media print { .wb-nav, .wb-dochead, .wb-ki-banner, .download-fab, .toast { display: none !important; } .wb-canvas .pages { padding: 0; gap: 0; margin: 0; } body { margin: 0; padding: 0; } }'
    document.head.appendChild(style)
    return () => document.head.removeChild(style)
  }, [])

  // Dock the sidebar / doc-header right beneath the page's sticky top bar.
  useEffect(() => {
    const measure = () => {
      const h = document.querySelector('header')?.getBoundingClientRect().height
      if (h) setWbTop(Math.round(h))
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const onEdit = useCallback((k: string, v: string) => {
    setEdits((prev) => ({ ...prev, [k]: v }))
  }, [])

  const sit = classifySit(d, situation)

  const docNode = useMemo(() => {
    if (doc === 'doc-s') {
      if (!sit) return <div className="a4-page"><p style={{ padding: '40mm 0' }}>Herausforderung {situation} fehlt.</p></div>
      return <DocS sit={sit} set={d.set} abteilung={abteilung} mode={mode} edits={edits} onEdit={onEdit} />
    }
    if (doc === 'doc-austausch') {
      if (!d.set) return <div className="a4-page"><p style={{ padding: '40mm 0' }}>Set fehlt.</p></div>
      return <DocAustausch set={d.set} sits={[d.hf_A, d.hf_B, d.hf_C]} abteilung={abteilung} edits={edits} onEdit={onEdit} />
    }
    if (doc === 'doc-kn-s') {
      if (!d.kn) return <div className="a4-page"><p style={{ padding: '40mm 0' }}>KN fehlt.</p></div>
      return <DocKnS kn={d.kn} knTyp={knTyp} abteilung={abteilung} edits={edits} onEdit={onEdit} />
    }
    if (doc === 'doc-ki-1') {
      if (!d.ki) return <div className="a4-page"><p style={{ padding: '40mm 0' }}>KI-Auftrag 1 fehlt.</p></div>
      return <DocKi ki={d.ki} which="ki_1" abteilung={abteilung} edits={edits} onEdit={onEdit} />
    }
    if (doc === 'doc-ki-2') {
      if (!d.ki) return <div className="a4-page"><p style={{ padding: '40mm 0' }}>KI-Auftrag 2 fehlt.</p></div>
      return <DocKi ki={d.ki} which="ki_2" abteilung={abteilung} edits={edits} onEdit={onEdit} />
    }
    if (doc === 'doc-lernprompt') {
      if (!d.lernprompt) return <div className="a4-page"><p style={{ padding: '40mm 0' }}>Lernprompt fehlt.</p></div>
      return <DocLernprompt lernprompt={d.lernprompt} abteilung={abteilung} edits={edits} onEdit={onEdit} />
    }
    if (doc === 'doc-lernbegleiter') {
      if (!d.lernbegleiter) return <div className="a4-page"><p style={{ padding: '40mm 0' }}>Lernbegleiter fehlt.</p></div>
      return <DocLernbegleiter lernbegleiter={d.lernbegleiter} abteilung={abteilung} edits={edits} onEdit={onEdit} />
    }
    if (doc === 'doc-dossier') {
      if (!d.dossier) return <div className="a4-page"><p style={{ padding: '40mm 0' }}>Dossier fehlt.</p></div>
      return <DocEbaDossier dossier={d.dossier} abteilung={abteilung} kompetenzNr={d.kn?.kompetenz_nr} />
    }
    if (!d.kn) return <div className="a4-page"><p style={{ padding: '40mm 0' }}>KN fehlt.</p></div>
    return <DocKnLp kn={d.kn} prinzip={d.prinzip} set={d.set} abteilung={abteilung} sits={[d.hf_A, d.hf_B, d.hf_C]} />
  }, [doc, situation, mode, abteilung, edits, knTyp, sit, d, onEdit])

  const showToast = (msg: string, kind: 'ok' | 'error' = 'ok') => {
    setToast({ msg, kind })
    setTimeout(() => setToast(null), 3500)
  }

  const handleBundle = async () => {
    if (bundling) return
    setBundling(true)
    try {
      const [pngArrayBuffer] = await Promise.all([
        fetch(logoUrl).then((r) => r.arrayBuffer()),
      ])
      const pngBytes = new Uint8Array(pngArrayBuffer)
      let bin = ''
      for (let i = 0; i < pngBytes.length; i++) bin += String.fromCharCode(pngBytes[i])
      const pngDataUrl = 'data:image/png;base64,' + btoa(bin)

      const wrap = (title: string, bodyMarkup: string, opts: { compact?: boolean } = {}) => {
        const cls = ['aesthetic-modern']
        if (opts.compact) cls.push('density-compact')
        const markup = bodyMarkup.replaceAll('assets/logo-bbw.png', pngDataUrl).replaceAll('/einheiten-assets/logo-bbw.png', pngDataUrl).replaceAll('/logo-bbw-doc.png', pngDataUrl)
        return `<!DOCTYPE html>
<html lang="de-CH">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap" />
  <style>
${cssRenderer}

.standalone-bar{position:fixed;top:0;left:0;right:0;z-index:50;background:#1d2026;color:#e8eaee;padding:10px 18px;display:flex;align-items:center;gap:14px;font-family:'IBM Plex Sans',system-ui,sans-serif;font-size:13px;}
.standalone-bar .name{font-weight:600}
.standalone-bar .spacer{flex:1}
.standalone-bar button{font-family:inherit;background:#e8eaee;color:#1d2026;border:0;padding:6px 14px;border-radius:4px;cursor:pointer;font-size:12px;font-weight:500;letter-spacing:.02em}
.standalone-bar button:hover{background:#fff}
.standalone-bar .hint{color:#a3a8b2;font-size:11px}
.pages{padding:60px 24px 64px}
@media print { .standalone-bar { display:none !important } .pages { padding: 0 } }
  </style>
</head>
<body class="${cls.join(' ')}">
  <div class="standalone-bar">
    <span class="name">${title}</span>
    <span class="hint">Tippe oder klicke in die Felder, dann auf Drucken.</span>
    <span class="spacer"></span>
    <button onclick="window.print()">Drucken</button>
  </div>
  <main class="pages">${markup}</main>
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      document.querySelectorAll('.feld, .hp-flaeche').forEach(el => el.setAttribute('contenteditable', 'true'));
    });
  </script>
</body>
</html>`
      }

      const zip = new JSZip()
      const log: string[] = []
      const kompetenz = d.kn?.kompetenz_nr || d.prinzip?.kern_kompetenzversprechen || (d.id.match(/^([\d.]+)/)?.[1]) || 'kompetenz'
      const slugPart = d.id.replace(/^[\d.]+_/, '')
      const prefix = `${kompetenz}_${slugPart}`

      for (const letter of ['A', 'B', 'C'] as SitLetter[]) {
        const s = classifySit(d, letter)
        if (!s || !d.set) continue
        for (const m of ['info', 'fill'] as const) {
          const markup = renderToStaticMarkup(<DocS sit={s} set={d.set} abteilung={abteilung} mode={m} edits={{}} onEdit={() => {}} />)
          const suffix = m === 'fill' ? 'auftrag' : 'dossier'
          const filename = `${prefix}_doc-s_hf-${letter}_${suffix}.html`
          const title = `DOC-S HF ${letter} (${suffix}) · ${s.titel}`
          zip.file(`html/${filename}`, wrap(title, markup, { compact: m === 'info' }))
          log.push(`html/${filename}`)
          try {
            const docx = buildDocS({ sit: s, set: d.set, abteilung, mode: m, logoPng: pngArrayBuffer })
            zip.file(`word/${filename.replace(/\.html$/, '.docx')}`, await docToBlob(docx))
            log.push(`word/${filename.replace(/\.html$/, '.docx')}`)
          } catch (e) { console.warn('docx DocS failed', filename, e) }
        }
      }

      // C8 — set-level Austausch & Transfer doc (once per set; no longer embedded in the 6 DocS)
      if (d.set) {
        const markup = renderToStaticMarkup(<DocAustausch set={d.set} sits={[d.hf_A, d.hf_B, d.hf_C]} abteilung={abteilung} edits={{}} onEdit={() => {}} />)
        const filename = `${prefix}_doc-austausch.html`
        zip.file(`html/${filename}`, wrap('DOC-AUSTAUSCH · Set-Abschluss', markup))
        log.push(`html/${filename}`)
        try {
          const docx = buildAustausch({ set: d.set, sits: [d.hf_A, d.hf_B, d.hf_C], abteilung, logoPng: pngArrayBuffer })
          zip.file(`word/${filename.replace(/\.html$/, '.docx')}`, await docToBlob(docx))
          log.push(`word/${filename.replace(/\.html$/, '.docx')}`)
        } catch (e) { console.warn('docx Austausch failed', filename, e) }
      }

      if (d.dossier) {
        const markup = renderToStaticMarkup(<DocEbaDossier dossier={d.dossier} abteilung={abteilung} kompetenzNr={d.kn?.kompetenz_nr} />)
        const filename = `${prefix}_doc-dossier.html`
        zip.file(`html/${filename}`, wrap('Glossar+ (EBA) · Nachschlagen & Lernen', markup))
        log.push(`html/${filename}`)
        try {
          const docx = buildDossier({ dossier: d.dossier, abteilung, kompetenzNr: d.kn?.kompetenz_nr, logoPng: pngArrayBuffer })
          if (docx) {
            zip.file(`word/${filename.replace(/\.html$/, '.docx')}`, await docToBlob(docx))
            log.push(`word/${filename.replace(/\.html$/, '.docx')}`)
          }
        } catch (e) { console.warn('docx Dossier failed', filename, e) }
      }

      if (d.kn) {
        for (const typ of d.kn.kn_typen || []) {
          const markup = renderToStaticMarkup(<DocKnS kn={d.kn} knTyp={typ.typ} abteilung={abteilung} edits={{}} onEdit={() => {}} />)
          const filename = `${prefix}_doc-kn-s_${typ.typ}.html`
          zip.file(`html/${filename}`, wrap(`DOC-KN-S ${typ.label}`, markup))
          log.push(`html/${filename}`)
          try {
            const docx = buildKnS({ kn: d.kn, knTyp: typ.typ, abteilung, logoPng: pngArrayBuffer })
            if (docx) {
              zip.file(`word/${filename.replace(/\.html$/, '.docx')}`, await docToBlob(docx))
              log.push(`word/${filename.replace(/\.html$/, '.docx')}`)
            }
          } catch (e) { console.warn('docx KnS failed', filename, e) }
        }
      }

      if (d.kn && d.prinzip) {
        const markup = renderToStaticMarkup(<DocKnLp kn={d.kn} prinzip={d.prinzip} set={d.set} abteilung={abteilung} sits={[d.hf_A, d.hf_B, d.hf_C]} />)
        const filename = `${prefix}_doc-kn-lp.html`
        zip.file(`html/${filename}`, wrap('DOC-KN-LP Lehrperson + Bewertung', markup))
        log.push(`html/${filename}`)
        try {
          const docx = buildKnLp({ kn: d.kn, prinzip: d.prinzip, set: d.set, abteilung, logoPng: pngArrayBuffer, sits: [d.hf_A, d.hf_B, d.hf_C] })
          zip.file(`word/${filename.replace(/\.html$/, '.docx')}`, await docToBlob(docx))
          log.push(`word/${filename.replace(/\.html$/, '.docx')}`)
        } catch (e) { console.warn('docx KnLp failed', filename, e) }
      }

      if (d.begleiter?.raw) {
        try {
          const blob = await buildBegleiterDocx(d.begleiter.raw, pngArrayBuffer)
          const path = `Material_LP/${prefix}_begleiter.docx`
          zip.file(path, blob)
          log.push(path)
        } catch (e) { console.warn('begleiter docx failed', e) }
      }

      // KI-Toolbox-Dokumente (additiv) — nur wenn die jeweilige Datei existiert.
      if (d.ki) {
        for (const which of ['ki_1', 'ki_2'] as const) {
          if (!d.ki.assignments?.some((a) => a.key === which)) continue
          const num = which === 'ki_1' ? '1' : '2'
          const markup = renderToStaticMarkup(<DocKi ki={d.ki} which={which} abteilung={abteilung} edits={{}} onEdit={() => {}} />)
          const filename = `${prefix}_doc-ki-${num}.html`
          zip.file(`html/${filename}`, wrap(`DOC-KI-${num} · KI-Toolbox`, markup))
          log.push(`html/${filename}`)
          try {
            const docx = buildKi({ ki: d.ki, which, abteilung, logoPng: pngArrayBuffer })
            if (docx) {
              zip.file(`word/${filename.replace(/\.html$/, '.docx')}`, await docToBlob(docx))
              log.push(`word/${filename.replace(/\.html$/, '.docx')}`)
            }
          } catch (e) { console.warn('docx Ki failed', filename, e) }
        }
      }

      if (d.lernprompt) {
        const markup = renderToStaticMarkup(<DocLernprompt lernprompt={d.lernprompt} abteilung={abteilung} edits={{}} onEdit={() => {}} />)
        const filename = `${prefix}_doc-lernprompt.html`
        zip.file(`html/${filename}`, wrap('DOC-LERNPROMPT · KI-Toolbox', markup))
        log.push(`html/${filename}`)
        try {
          const docx = buildLernprompt({ lernprompt: d.lernprompt, abteilung, logoPng: pngArrayBuffer })
          if (docx) {
            zip.file(`word/${filename.replace(/\.html$/, '.docx')}`, await docToBlob(docx))
            log.push(`word/${filename.replace(/\.html$/, '.docx')}`)
          }
        } catch (e) { console.warn('docx Lernprompt failed', filename, e) }
      }

      if (d.lernbegleiter) {
        const markup = renderToStaticMarkup(<DocLernbegleiter lernbegleiter={d.lernbegleiter} abteilung={abteilung} edits={{}} onEdit={() => {}} />)
        const filename = `${prefix}_doc-lernbegleiter.html`
        zip.file(`html/${filename}`, wrap('DOC-LERNBEGLEITER · KI-Toolbox', markup))
        log.push(`html/${filename}`)
        try {
          const docx = buildLernbegleiter({ lernbegleiter: d.lernbegleiter, abteilung, logoPng: pngArrayBuffer })
          if (docx) {
            zip.file(`word/${filename.replace(/\.html$/, '.docx')}`, await docToBlob(docx))
            log.push(`word/${filename.replace(/\.html$/, '.docx')}`)
          }
        } catch (e) { console.warn('docx Lernbegleiter failed', filename, e) }
      }

      if (d.kiLiesmich?.raw) {
        try {
          const blob = await buildBegleiterDocx(d.kiLiesmich.raw, pngArrayBuffer)
          const path = `Material_LP/${prefix}_ki-liesmich.docx`
          zip.file(path, blob)
          log.push(path)
        } catch (e) { console.warn('ki-liesmich docx failed', e) }
      }

      const readme = buildReadme({ prefix, log, d, when: new Date(), abgedeckteKompetenzen: docAbgedeckte })
      zip.file('Übersicht_LP.html', readme)

      const blob = await zip.generateAsync({ type: 'blob' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${prefix}_hko_bundle.zip`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      setTimeout(() => URL.revokeObjectURL(url), 1000)
      showToast(`${log.length} Dateien als Zip exportiert.`)
    } catch (e: any) {
      console.error(e)
      showToast('Fehler beim Bundling: ' + e.message, 'error')
    } finally {
      setBundling(false)
    }
  }

  const knTypen = d.kn?.kn_typen || []
  let docKicker = ''
  let docName = ''
  if (doc === 'doc-s') {
    docKicker = `Herausforderung ${situation}`
    docName = sit?.titel || `Herausforderung ${situation}`
  } else if (doc === 'doc-austausch') {
    docKicker = 'Set-Abschluss'
    docName = 'Austausch & Transfer'
  } else if (doc === 'doc-kn-s') {
    docKicker = 'Kompetenznachweis · Schüler/in'
    docName = knTypLabel(knTyp, knTypen.find((t) => t.typ === knTyp)?.label) || 'Kompetenznachweis'
  } else if (doc === 'doc-ki-1' || doc === 'doc-ki-2') {
    const which = doc === 'doc-ki-1' ? 'ki_1' : 'ki_2'
    const a = d.ki?.assignments?.find((x) => x.key === which)
    docKicker = 'KI-Toolbox · formativ'
    docName = a?.titel || (doc === 'doc-ki-1' ? 'KI-Auftrag 1' : 'KI-Auftrag 2')
  } else if (doc === 'doc-lernprompt') {
    docKicker = 'KI-Toolbox · Prompting'
    docName = 'KI-Lernprompt'
  } else if (doc === 'doc-lernbegleiter') {
    docKicker = 'KI-Toolbox · Lernen'
    docName = 'KI-Lernbegleiter'
  } else if (doc === 'doc-dossier') {
    docKicker = 'EBA · Nachschlagen & Lernen'
    docName = 'Glossar+'
  } else {
    docKicker = 'Kompetenznachweis'
    docName = 'Lehrperson + Bewertung'
  }

  const selectSit = (s: SitLetter) => { setDoc('doc-s'); setSituation(s); setNavOpen(false) }
  const selectKnTyp = (t: string) => { setDoc('doc-kn-s'); setKnTyp(t); setNavOpen(false) }
  const pick = (target: DocSel) => { setDoc(target); setNavOpen(false) }

  const isKiDoc = doc === 'doc-ki-1' || doc === 'doc-ki-2' || doc === 'doc-lernprompt' || doc === 'doc-lernbegleiter'

  return (
    <div className="aesthetic-modern wb-root" style={{ '--wb-top': `${wbTop}px` } as any}>
      <button className="wb-nav-toggle" onClick={() => setNavOpen((v) => !v)}>☰ Dokumente</button>

      <aside className={`wb-nav${navOpen ? ' open' : ''}`}>
        <div className="wb-field">
          <label htmlFor="wb-abt">Abteilung</label>
          <select
            id="wb-abt"
            className="wb-select"
            value={abteilung}
            onChange={(e) => setAbteilung(e.target.value)}
          >
            {ABTEILUNGEN.map((a) => (
              <option key={a} value={a}>{a || '— Abteilung wählen —'}</option>
            ))}
          </select>
        </div>

        {d.begleiter?.raw && (
          <a
            className="wb-action lies"
            href={`/einheiten/${d.id}/begleiter`}
            target="_blank"
            rel="noopener noreferrer"
          >
            📖 Lies mich!
          </a>
        )}

        <nav className="wb-tree">
          <div className="wb-tree-group">
            <div className="wb-tree-head">Herausforderungen</div>
            {(['A', 'B', 'C'] as SitLetter[]).map((s) =>
              classifySit(d, s) ? (
                <button
                  key={s}
                  className={`wb-item${doc === 'doc-s' && situation === s ? ' active' : ''}`}
                  onClick={() => selectSit(s)}
                >
                  <span className={`wb-letter wb-letter-${s}`}>{s}</span>
                  <span className="wb-item-title">{classifySit(d, s)?.titel || `Herausforderung ${s}`}</span>
                </button>
              ) : null,
            )}
          </div>

          <button
            className={`wb-item solo${doc === 'doc-austausch' ? ' active' : ''}`}
            onClick={() => pick('doc-austausch')}
          >
            <span className="wb-dot">🔄</span>
            <span className="wb-item-title">Austausch &amp; Transfer</span>
          </button>

          {d.dossier && (
            <button
              className={`wb-item solo${doc === 'doc-dossier' ? ' active' : ''}`}
              onClick={() => pick('doc-dossier')}
            >
              <span className="wb-dot">📖</span>
              <span className="wb-item-title">Glossar+</span>
            </button>
          )}

          {d.kn && (
            <div className="wb-tree-group">
              <div className="wb-tree-head">Kompetenznachweis</div>
              <div className="wb-tree-sub">Schüler/in</div>
              {knTypen.map((t) => (
                <button
                  key={t.typ}
                  className={`wb-item nested${doc === 'doc-kn-s' && knTyp === t.typ ? ' active' : ''}`}
                  onClick={() => selectKnTyp(t.typ)}
                >
                  <span className="wb-item-title">{knTypLabel(t.typ, t.label)}</span>
                </button>
              ))}
              <button
                className={`wb-item${doc === 'doc-kn-lp' ? ' active' : ''}`}
                onClick={() => pick('doc-kn-lp')}
              >
                <span className="wb-dot">📋</span>
                <span className="wb-item-title">Lehrperson + Bewertung</span>
              </button>
            </div>
          )}

          {(d.ki || d.lernprompt || d.lernbegleiter || d.kiLiesmich) && (
            <div className="wb-tree-group wb-tree-ki">
              <button
                type="button"
                className={`wb-tree-head wb-tree-head-toggle${kiOpen ? ' open' : ''}`}
                onClick={() => setKiOpen((v) => !v)}
                aria-expanded={kiOpen}
              >
                <span className="wb-ki-badge">KI</span>
                <span className="wb-ki-label">KI-Toolbox</span>
                <span className="wb-chevron" aria-hidden="true">▾</span>
              </button>
              {kiOpen && (
              <>
              <p className="wb-ki-hint">Optionales Zusatzangebot — die Lehrperson entscheidet über den Einsatz.</p>
              {d.kiLiesmich?.raw && (
                <a
                  className="wb-action lies wb-ki-lies"
                  href={`/einheiten/${d.id}/ki-liesmich`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  📖 KI-Toolbox — Lies mich!
                </a>
              )}
              {d.ki?.assignments?.some((a) => a.key === 'ki_1') && (
                <button
                  className={`wb-item${doc === 'doc-ki-1' ? ' active' : ''}`}
                  onClick={() => pick('doc-ki-1')}
                >
                  <span className="wb-letter wb-letter-ki">1</span>
                  <span className="wb-item-title">{d.ki?.assignments?.find((a) => a.key === 'ki_1')?.titel || 'KI-Auftrag 1'}</span>
                </button>
              )}
              {d.ki?.assignments?.some((a) => a.key === 'ki_2') && (
                <button
                  className={`wb-item${doc === 'doc-ki-2' ? ' active' : ''}`}
                  onClick={() => pick('doc-ki-2')}
                >
                  <span className="wb-letter wb-letter-ki">2</span>
                  <span className="wb-item-title">{d.ki?.assignments?.find((a) => a.key === 'ki_2')?.titel || 'KI-Auftrag 2'}</span>
                </button>
              )}
              {d.lernprompt && (
                <button
                  className={`wb-item${doc === 'doc-lernprompt' ? ' active' : ''}`}
                  onClick={() => pick('doc-lernprompt')}
                >
                  <span className="wb-letter wb-letter-ki">P</span>
                  <span className="wb-item-title">KI-Lernprompt</span>
                </button>
              )}
              {d.lernbegleiter && (
                <button
                  className={`wb-item${doc === 'doc-lernbegleiter' ? ' active' : ''}`}
                  onClick={() => pick('doc-lernbegleiter')}
                >
                  <span className="wb-letter wb-letter-ki">L</span>
                  <span className="wb-item-title">KI-Lernbegleiter</span>
                </button>
              )}
              </>
              )}
            </div>
          )}
        </nav>

        {!readOnly && (
          <a className="wb-action" href={feedbackUrl}>✍ Feedback nach Unterricht</a>
        )}
      </aside>

      <div className="wb-canvas">
        <div className="wb-dochead">
          <div className="wb-dochead-title">
            <span className="wb-dochead-kicker">{docKicker}</span>
            <span className="wb-dochead-name">{docName}</span>
          </div>
          {doc === 'doc-s' && (
            <div className="wb-mode">
              <button className={mode === 'fill' ? 'on' : ''} onClick={() => setMode('fill')}>Auftrag</button>
              <button className={mode === 'info' ? 'on' : ''} onClick={() => setMode('info')}>Dossier</button>
            </div>
          )}
        </div>

        {isKiDoc && (
          <div className="wb-ki-banner" role="note">
            <p>
              <strong>KI-Toolbox — optionales Zusatzangebot.</strong> Der Einsatz dieser Materialien
              entscheidet die Lehrperson; sie sind <strong>kein Pflichtteil</strong> der Einheit.
              Verbindlich sind die drei Herausforderungen, der Kompetenznachweis und der
              Lehrpersonen-/Bewertungsteil.
            </p>
            <p>
              Jedes Dokument ist als <strong>Word-Datei</strong> herunterladbar und
              <strong> nach Bedarf anpassbar</strong>. Tipps zur Reduktion der Dichte:
              in <strong>Gruppenarbeit</strong> einsetzen · als <strong>Vertiefung für starke
              Lernende</strong> · zum <strong>Üben vor dem Kompetenznachweis</strong>.
            </p>
          </div>
        )}
        <main className="pages">{docNode}</main>
      </div>

      {readOnly ? (
        <div className="download-fab" style={{ cursor: 'default', opacity: 0.85 }}>
          👁 Gast-Ansicht · Download nur für angemeldete Lehrpersonen
        </div>
      ) : (
        <button className="download-fab" onClick={handleBundle} disabled={bundling}>
          {bundling ? '⏳ Download läuft…' : '⬇ Download'}
        </button>
      )}

      {navOpen && <div className="wb-scrim" onClick={() => setNavOpen(false)} />}
      {toast && <div className={`toast ${toast.kind === 'error' ? 'error' : ''}`}>{toast.msg}</div>}
    </div>
  )
}

function buildReadme({ prefix, log, d, when, abgedeckteKompetenzen = [] }: { prefix: string; log: string[]; d: EinheitFullSet; when: Date; abgedeckteKompetenzen?: string[] }) {
  const kompetenz = d.kn?.kompetenz_nr || (d.id.match(/^([\d.]+)/)?.[1]) || ''
  const kompetenzList = abgedeckteKompetenzen.length ? abgedeckteKompetenzen.join(', ') : kompetenz
  const slug = d.id.replace(/^[\d.]+_/, '')
  const esc = (v: string) =>
    String(v ?? '—')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
  // The build log is the single source of truth for which files actually landed in the ZIP
  // (some .docx builds can fail in try/catch). Only render a link if its path is present.
  const logSet = new Set(log)
  const has = (p: string) => logSet.has(p)

  // A single document row: a label plus whichever of HTML / Word actually exists.
  // htmlBase is the *.html filename (no folder); the Word twin lives under word/ with .docx.
  const row = (label: string, opts: { htmlBase?: string; wordRoot?: string }) => {
    const links: string[] = []
    if (opts.htmlBase) {
      const hp = `html/${opts.htmlBase}`
      const wp = `word/${opts.htmlBase.replace(/\.html$/, '.docx')}`
      if (has(hp)) links.push(`<a class="btn btn-html" href="${esc(hp)}" target="_blank" rel="noopener">HTML · drucken</a>`)
      if (has(wp)) links.push(`<a class="btn btn-word" data-doc="${esc(wp)}" href="${esc(wp)}" title="Öffnet direkt in Microsoft Word">Word · öffnen</a>`)
    }
    if (opts.wordRoot && has(opts.wordRoot)) {
      links.push(`<a class="btn btn-word" data-doc="${esc(opts.wordRoot)}" href="${esc(opts.wordRoot)}" title="Öffnet direkt in Microsoft Word">Word · öffnen</a>`)
    }
    if (!links.length) return ''
    return `        <div class="row"><span class="row-label">${esc(label)}</span><span class="row-links">${links.join('')}</span></div>`
  }

  // A card groups one document family (e.g. Herausforderung A) and its rows.
  const card = (title: string, rowsHtml: string[], opts: { accent?: string; sub?: string } = {}) => {
    const body = rowsHtml.filter(Boolean)
    if (!body.length) return ''
    const style = opts.accent ? ` style="border-left-color:${opts.accent}"` : ''
    const sub = opts.sub ? `<p class="card-sub">${esc(opts.sub)}</p>` : ''
    return `      <article class="card"${style}>
        <h3 class="card-title">${esc(title)}</h3>${sub}
${body.join('\n')}
      </article>`
  }

  const sections: string[] = []

  // ── Herausforderungen A/B/C ────────────────────────────────────────────────
  const hfAccent: Record<string, string> = { A: '#e11d48', B: '#0284c7', C: '#059669' }
  const hfCards: string[] = []
  for (const letter of ['A', 'B', 'C'] as const) {
    const s = d[`hf_${letter}`]
    if (!s) continue
    hfCards.push(
      card(`Herausforderung ${letter} — ${s.titel || ''}`.trim(), [
        row('Auftrag (zum Ausfüllen)', { htmlBase: `${prefix}_doc-s_hf-${letter}_auftrag.html` }),
        row('Dossier (nur Inhalte)', { htmlBase: `${prefix}_doc-s_hf-${letter}_dossier.html` }),
      ], { accent: hfAccent[letter] }),
    )
  }
  hfCards.push(card('Austausch & Transfer', [row('Set-Abschluss', { htmlBase: `${prefix}_doc-austausch.html` })]))
  if (d.dossier) hfCards.push(card('Glossar+ (EBA)', [row('Nuggets · Sprachhilfe · Glossar · Notizen', { htmlBase: `${prefix}_doc-dossier.html` })]))
  const hfC = hfCards.filter(Boolean)
  if (hfC.length) sections.push(`  <details class="group"><summary>Herausforderungen <span class="count">${hfC.length}</span></summary><div class="group-body">${hfC.join('\n')}</div></details>`)

  // ── Kompetenznachweis ──────────────────────────────────────────────────────
  if (d.kn) {
    const knCards: string[] = []
    for (const typ of d.kn.kn_typen || []) {
      knCards.push(card(`KN · ${knTypLabel(typ.typ, typ.label)}`, [
        row('Schüler/in', { htmlBase: `${prefix}_doc-kn-s_${typ.typ}.html` }),
      ]))
    }
    knCards.push(card('Lehrperson + Bewertung', [row('Auswertung & Bewertungsraster', { htmlBase: `${prefix}_doc-kn-lp.html` })]))
    const knC = knCards.filter(Boolean)
    if (knC.length) sections.push(`  <details class="group"><summary>Kompetenznachweis <span class="count">${knC.length}</span></summary><div class="group-body">${knC.join('\n')}</div></details>`)
  }

  // ── Begleitung (Lehrperson) ────────────────────────────────────────────────
  const begleitCard = card('Begleitdokument', [row(d.begleiter?.meta?.titel || 'Didaktische Hinweise (Lehrperson)', { wordRoot: `Material_LP/${prefix}_begleiter.docx` })])
  if (begleitCard) sections.push(`  <details class="group"><summary>Begleitung <span class="count">1</span></summary><div class="group-body">${begleitCard}</div></details>`)

  // ── KI-Toolbox (optional) ──────────────────────────────────────────────────
  const kiCards: string[] = []
  if (d.kiLiesmich?.raw) kiCards.push(card('KI-Toolbox — Lies mich!', [row('Didaktischer Kompass (Lehrperson)', { wordRoot: `Material_LP/${prefix}_ki-liesmich.docx` })]))
  if (d.ki?.assignments?.some((a) => a.key === 'ki_1')) kiCards.push(card(d.ki.assignments.find((a) => a.key === 'ki_1')?.titel || 'KI-Auftrag 1', [row('Formativer KI-Auftrag', { htmlBase: `${prefix}_doc-ki-1.html` })]))
  if (d.ki?.assignments?.some((a) => a.key === 'ki_2')) kiCards.push(card(d.ki.assignments.find((a) => a.key === 'ki_2')?.titel || 'KI-Auftrag 2', [row('Formativer KI-Auftrag', { htmlBase: `${prefix}_doc-ki-2.html` })]))
  if (d.lernprompt) kiCards.push(card('KI-Lernprompt', [row('Prompting-Werkstatt', { htmlBase: `${prefix}_doc-lernprompt.html` })]))
  if (d.lernbegleiter) kiCards.push(card('KI-Lernbegleiter', [row(d.lernbegleiter.lernbegleiter?.titel || 'KN-Vorbereitung', { htmlBase: `${prefix}_doc-lernbegleiter.html` })]))
  const kiC = kiCards.filter(Boolean)
  if (kiC.length) {
    sections.push(`  <details class="group"><summary>KI-Toolbox <span class="opt">optional</span> <span class="count">${kiC.length}</span></summary><div class="group-body"><p class="ki-note">Komplementär zur Einheit, formativ — der Einsatz entscheidet die Lehrperson.</p>${kiC.join('\n')}</div></details>`)
  }

  return `<!DOCTYPE html>
<html lang="de-CH">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>HKO ${esc(prefix)} — Übersicht der Einheit</title>
<style>
  :root { --brand:#0E6E3A; --brand-dark:#094d28; --brand-tint:#e8f3ec; --ink:#1d2026; --muted:#5b6470; --line:#e2e6ea; }
  * { box-sizing: border-box; }
  body { margin:0; padding:40px 20px; background:#f6f7f8; color:var(--ink);
    font-family:'IBM Plex Sans',system-ui,-apple-system,Segoe UI,Roboto,sans-serif; line-height:1.55; }
  .sheet { max-width:820px; margin:0 auto; background:#fff; border:1px solid var(--line);
    border-top:4px solid var(--brand); border-radius:10px; padding:36px 44px 44px; }
  h1 { font-size:1.5rem; margin:0 0 4px; color:var(--brand-dark); }
  .meta { color:var(--muted); font-size:.92rem; margin:0 0 4px; }
  .meta strong { color:var(--ink); }
  .intro { margin:14px 0 14px; }
  .toolbar { display:flex; justify-content:flex-end; margin:0 0 12px; }
  .group { border:1px solid var(--line); border-radius:8px; margin:0 0 10px; background:#fff; overflow:hidden; }
  .group > summary { cursor:pointer; list-style:none; padding:13px 16px; font-size:1rem; font-weight:600;
    color:var(--brand-dark); background:var(--brand-tint); display:flex; align-items:center; gap:8px; }
  .group > summary::-webkit-details-marker { display:none; }
  .group > summary::before { content:'▸'; font-size:.8rem; color:var(--brand); transition:transform .15s; }
  .group[open] > summary::before { transform:rotate(90deg); }
  .group > summary .count { margin-left:auto; font-size:.72rem; font-weight:700; color:var(--brand-dark);
    background:#fff; border:1px solid var(--brand); padding:1px 9px; border-radius:999px; }
  .group > summary .opt { font-size:.64rem; font-weight:700; text-transform:uppercase; letter-spacing:.05em;
    color:#fff; background:var(--brand); padding:2px 7px; border-radius:999px; }
  .group-body { padding:14px 16px 6px; }
  .ki-note { color:var(--muted); font-size:.88rem; margin:-4px 0 10px; }
  .card { border:1px solid var(--line); border-left:4px solid var(--brand); border-radius:8px;
    padding:14px 16px; margin:0 0 10px; background:#fff; }
  .card-title { font-size:.98rem; margin:0 0 8px; color:var(--ink); font-weight:600; }
  .card-sub { color:var(--muted); font-size:.85rem; margin:-4px 0 8px; }
  .row { display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between;
    gap:8px 12px; padding:6px 0; border-top:1px dashed var(--line); }
  .card .row:first-of-type { border-top:0; }
  .row-label { font-size:.92rem; color:var(--ink); }
  .row-links { display:flex; gap:8px; flex-wrap:wrap; }
  .btn { display:inline-block; text-decoration:none; font-size:.82rem; font-weight:600;
    padding:6px 12px; border-radius:6px; white-space:nowrap; line-height:1.2; }
  .btn-html { background:var(--brand); color:#fff; }
  .btn-html:hover { background:var(--brand-dark); }
  .btn-word { background:#fff; color:var(--brand-dark); border:1px solid var(--brand); }
  .btn-word:hover { background:var(--brand-tint); }
  code { background:var(--brand-tint); color:var(--brand-dark); padding:1px 6px; border-radius:4px;
    font-family:'IBM Plex Mono',ui-monospace,Menlo,Consolas,monospace; font-size:.85em; }
  details { margin-top:26px; }
  summary { cursor:pointer; font-size:.95rem; color:var(--brand-dark); font-weight:600; }
  ul.files { columns:2; column-gap:28px; padding-left:18px; margin:10px 0 0; font-size:.86rem; color:var(--muted); }
  ul.files li { break-inside:avoid; margin:0 0 3px; }
  @media (max-width:560px){ ul.files{columns:1;} .sheet{padding:28px 22px;} .row{justify-content:flex-start;} }
</style>
</head>
<body>
<main class="sheet">
  <h1>HKO ${esc(prefix)} — Übersicht der Einheit</h1>
  <p class="meta"><strong>Abgedeckte Kompetenzen:</strong> ${esc(kompetenzList)} · <strong>Thema:</strong> ${esc(slug.replace(/_/g, ' '))}</p>
  <p class="meta"><strong>Generiert:</strong> ${esc(when.toLocaleString('de-CH'))} · <strong>Dateien:</strong> ${log.length}</p>

  <p class="intro">Diese Seite verbindet alle Dokumente der Einheit. Klicke auf
  <strong>HTML · drucken</strong>, um ein Dokument druckfertig im Browser zu öffnen, oder auf
  <strong>Word · öffnen</strong>, um die <code>.docx</code>-Version direkt in Microsoft Word zum
  Anpassen zu öffnen (Word muss installiert sein; beim ersten Mal fragt der Browser, ob Word
  geöffnet werden darf — bestätigen). Beide Formate enthalten die gleichen Inhalte. Damit die
  Links funktionieren, muss der ZIP-Ordner <em>vollständig entpackt</em> sein (Ordner
  <code>html/</code> und <code>word/</code> daneben).</p>

  <div class="toolbar"><button type="button" id="toggleAll" class="btn btn-word">Alles aufklappen</button></div>

${sections.join('\n')}

  <details class="group">
    <summary>Nach dem Unterricht</summary>
    <div class="group-body">
      <p>Wenn du die Einheit umgesetzt hast, gib uns Feedback über das Online-Formular,
      das du im Workbench unter «Feedback nach Unterricht» findest. Das Feedback
      fliesst direkt ins Kernteam-1 Reviewing.</p>
    </div>
  </details>

  <details class="filelist">
    <summary>Vollständige Dateiliste (${log.length})</summary>
    <ul class="files">
${log.map((f) => `      <li>${esc(f)}</li>`).join('\n')}
    </ul>
  </details>
</main>
<script>
  (function(){
    var tg=document.getElementById('toggleAll');
    if(tg){
      var groups=Array.prototype.slice.call(document.querySelectorAll('details.group'));
      tg.addEventListener('click',function(){
        var anyClosed=groups.some(function(d){return !d.open;});
        groups.forEach(function(d){d.open=anyClosed;});
        tg.textContent=anyClosed?'Alles zuklappen':'Alles aufklappen';
      });
    }
    // "Word · öffnen": launch the .docx directly in Microsoft Word via the ms-word: protocol
    // handler, building an absolute file:// URL from this page's own location so it works
    // wherever the teacher extracted the ZIP. Falls back to the plain link if JS is off.
    Array.prototype.slice.call(document.querySelectorAll('a.btn-word[data-doc]')).forEach(function(a){
      a.addEventListener('click',function(e){
        e.preventDefault();
        var abs=new URL(a.getAttribute('data-doc'),location.href).href;
        window.location.href='ms-word:ofe|u|'+abs;
      });
    });
  })();
</script>
</body>
</html>`
}
