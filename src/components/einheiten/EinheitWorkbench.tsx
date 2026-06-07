import { useCallback, useEffect, useMemo, useState } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import JSZip from 'jszip'

import { DocS } from './docs/DocS'
import { DocAustausch } from './docs/DocAustausch'
import { DocKnS } from './docs/DocKnS'
import { DocKnLp } from './docs/DocKnLp'
import { ABTEILUNGEN } from '../../lib/einheiten'
import type { EinheitFullSet } from '../../lib/einheiten/types'

import { buildDocS, buildAustausch, buildKnS, buildKnLp, docToBlob } from '../../lib/einheiten/docx-builder'
import { buildBegleiterDocx } from '../../lib/einheiten/begleiter-builder'

interface Props {
  set: EinheitFullSet
  cssRenderer: string
  cssBegleiter: string
  logoUrl: string
  feedbackUrl: string
  /** Read-only guest view: hides the bundle download and the feedback link. */
  readOnly?: boolean
}

type DocSel = 'doc-s' | 'doc-austausch' | 'doc-kn-s' | 'doc-kn-lp'
type SitLetter = 'A' | 'B' | 'C'

function classifySit(d: EinheitFullSet, letter: SitLetter) {
  return d[`hf_${letter}`]
}

export default function EinheitWorkbench({ set: d, cssRenderer, logoUrl, feedbackUrl, readOnly = false }: Props) {
  const [doc, setDoc] = useState<DocSel>('doc-s')
  const [situation, setSituation] = useState<SitLetter>('A')
  const [mode, setMode] = useState<'info' | 'fill'>('fill')
  const [abteilung, setAbteilung] = useState('')
  const [edits, setEdits] = useState<Record<string, string>>({})
  const [knTyp, setKnTyp] = useState<string>(d.kn?.kn_typen?.[0]?.typ || 'fachgespraech')
  const [bundling, setBundling] = useState(false)
  const [toast, setToast] = useState<{ kind: 'ok' | 'error'; msg: string } | null>(null)
  const [navOpen, setNavOpen] = useState(false)
  const [wbTop, setWbTop] = useState(80)

  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = '@media print { .wb-nav, .wb-dochead, .download-fab, .toast { display: none !important; } .wb-canvas .pages { padding: 0; gap: 0; margin: 0; } body { margin: 0; padding: 0; } }'
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
          const filename = `${prefix}_doc-s_sit-${letter}_${m}.html`
          const title = `DOC-S Sit ${letter} (${m}) · ${s.titel}`
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
          const filename = `${prefix}_begleiter.docx`
          zip.file(filename, blob)
          log.push(filename)
        } catch (e) { console.warn('begleiter docx failed', e) }
      }

      const readme = buildReadme({ prefix, log, d, when: new Date() })
      zip.file('README.md', readme)

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
    docName = knTypen.find((t) => t.typ === knTyp)?.label || 'Kompetenznachweis'
  } else {
    docKicker = 'Kompetenznachweis'
    docName = 'Lehrperson + Bewertung'
  }

  const selectSit = (s: SitLetter) => { setDoc('doc-s'); setSituation(s); setNavOpen(false) }
  const selectKnTyp = (t: string) => { setDoc('doc-kn-s'); setKnTyp(t); setNavOpen(false) }
  const pick = (target: DocSel) => { setDoc(target); setNavOpen(false) }

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
                  <span className="wb-item-title">{t.label}</span>
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

function buildReadme({ prefix, log, d, when }: { prefix: string; log: string[]; d: EinheitFullSet; when: Date }) {
  const kompetenz = d.kn?.kompetenz_nr || (d.id.match(/^([\d.]+)/)?.[1]) || ''
  const slug = d.id.replace(/^[\d.]+_/, '')
  return `# HKO ${prefix} — Inhalt des Bundles

**Kompetenz:** ${kompetenz} · **Thema:** ${slug.replace(/_/g, ' ')}
**Generiert:** ${when.toLocaleString('de-CH')}
**Dateien:** ${log.length}

---

## Was ist drin?

Dieses Bundle enthält ${log.length} Dokumente in zwei Formaten: druckfertige
HTML-Dateien (A4, zum Direkt-Drucken im Browser) und Word-Dateien (.docx)
(zum Anpassen / Kommentieren in Word). Beide Formate enthalten die gleichen
Inhalte; HTML druckt 1:1 wie geplant, Word lässt sich weiterbearbeiten.

Das Situationsheft (DOC-S) gibt es je Herausforderung als Auftrag (zum Ausfüllen)
und als Dossier (mit ausgearbeiteter Lösung). Der gemeinsame Set-Abschluss
«Austausch & Transfer» (\`_doc-austausch\`) liegt einmal pro Set bei — er bündelt
den Vergleich der drei Lösungen (Einzelauftrag / Gruppenpuzzle / Plenum) und die
Transfer-Aufgabe.

Zusätzlich liegt das Begleitdokument für die Lehrperson (\`_begleiter.docx\`)
bei — Hintergrund, didaktische Hinweise, Coaching-Moves, Mehrdeutigkeit-Hinweise.

---

## Set-Übersicht

| Komponente | Titel |
|---|---|
| Herausforderung A (rot) | ${d.hf_A?.titel || '—'} |
| Herausforderung B (blau) | ${d.hf_B?.titel || '—'} |
| Herausforderung C (grün) | ${d.hf_C?.titel || '—'} |
| KN Hybrid-Herausforderung | ${d.kn?.hybrid_situation?.titel || '—'} |
| Begleitdokument | ${d.begleiter?.meta?.titel || '—'} |

---

## Nach dem Unterricht

Wenn du die Einheit umgesetzt hast, gib uns Feedback über das Online-Formular,
das du im Workbench unter «Feedback nach Unterricht» findest. Das Feedback
fliesst direkt ins Kernteam-1 Reviewing.

---

## Dateiliste

${log.map((f) => '- ' + f).join('\n')}
`
}
