import type { CSSProperties, ReactNode } from 'react'
import { A4Page, SectionHead } from './chrome'
import type { LernbegleiterJson, LernbegleiterStrategie } from '../../../lib/einheiten/types'
import { dimensionLabel, istBasisKarte, istNeueFassung, knTypFuerLernende } from '../../../lib/einheiten/ki-toolbox'

// KI-Toolbox · Lernen — NEW doc (no hko-deploy precedent).
// Pagination: page 1 = Kopf + Ohne-KI + erste 2 Strategie-Karten; weitere
// Karten je 3 pro Seite; Schlussseite = KN-Tracks + Rubrik + Integrität +
// Selbstcheck. Accent #3B6FD4 as a local constant only. renderToStaticMarkup-safe.
//
// Basis-Form (E40): tragen die ersten zwei Karten nur den fertigen Prompt
// (`istBasisKarte`), folgt die KN-Seite direkt auf Seite 1 und die übrigen Karten
// stehen als «Plus» am Schluss — Basis ist dann Seite 1-2, Plus der Rest.

const LB_AKZENT = '#3B6FD4'
const LB_LIGHT = '#E8F0FE'
const LB_DARK = '#1E3A5F'

const lbVars = {
  '--sit-akzent': LB_AKZENT,
  '--sit-light': LB_LIGHT,
  '--sit-mid': LB_DARK,
} as CSSProperties

const microLabel = {
  fontSize: '7.2pt', fontWeight: 600, letterSpacing: '0.05em',
  textTransform: 'uppercase', color: LB_AKZENT, margin: '1.4mm 0 0.6mm',
} as const

const promptBox = {
  background: '#f5f7fa', border: '1px solid #d8dde4', borderRadius: '1mm',
  padding: '1.6mm 2.2mm', margin: '0.6mm 0', fontFamily: "'IBM Plex Mono', ui-monospace, Menlo, Consolas, monospace",
  fontSize: '8.2pt', lineHeight: 1.36, color: '#2a2f36', whiteSpace: 'pre-wrap',
} as const

const warnBox = {
  background: '#fff7ed', borderLeft: '3px solid #d97706',
  padding: '1.2mm 2.2mm', borderRadius: '1mm', margin: '1mm 0',
  fontSize: '8pt', lineHeight: 1.34, color: '#7c4a03',
} as const

// E42 — drei kleine Schreibfelder nebeneinander: aus dem Lesen wird ein Arbeitsblatt.
// `grow` lässt die Reihe den freien Platz der Seite aufnehmen (KN-Seite).
function Notizreihe({ labels, grow = false }: { labels: [string, string, string]; grow?: boolean }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2mm', marginTop: '1.2mm', ...(grow ? { flex: '1 0 auto' } : {}) }}>
      {labels.map((l) => (
        <div key={l} style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ ...microLabel, margin: '0 0 0.6mm' }}>{l}</div>
          <div className="feld" style={{ flex: '1 0 auto', minHeight: '17mm' }} contentEditable suppressContentEditableWarning spellCheck={false} />
        </div>
      ))}
    </div>
  )
}

function StrategieKarte({ s, notiz = false }: { s: LernbegleiterStrategie; notiz?: boolean }) {
  return (
    <div style={{
      border: '1px solid #d8dde4', borderTop: `2px solid ${LB_AKZENT}`,
      borderRadius: '1.5mm', padding: '1.8mm 2.5mm', marginBottom: '1.8mm', breakInside: 'avoid',
    }}>
      <div style={{ fontSize: '10pt', fontWeight: 700, color: LB_DARK, marginBottom: '0.7mm' }}>{s.technik}</div>
      {s.wann && <p style={{ margin: '0 0 1.2mm', fontSize: '8.7pt', lineHeight: 1.34, color: '#3a4049' }}><strong>Wann:</strong> {s.wann}</p>}
      {s.prompt_basis && (<><div style={microLabel}>{s.prompt_fortgeschritten ? 'Prompt · Basis' : 'Fertiger Prompt'}</div><div style={promptBox}>{s.prompt_basis}</div></>)}
      {s.prompt_fortgeschritten && (<><div style={microLabel}>Prompt · fortgeschritten</div><div style={promptBox}>{s.prompt_fortgeschritten}</div></>)}
      {s.warnung && <div style={warnBox}>⚠ {s.warnung}</div>}
      {notiz && <Notizreihe labels={['Das hat die KI gesagt', 'Das stimmt', 'Das stimmt nicht']} />}
    </div>
  )
}

function PageHeader({ titel }: { titel: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '2.5mm', marginBottom: '2mm' }}>
      <span style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: '8mm', height: '8mm', borderRadius: '50%', background: LB_AKZENT,
        color: '#fff', fontWeight: 700, fontSize: '12pt', flexShrink: 0,
      }}>L</span>
      <div>
        <div style={{ fontSize: '7pt', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: LB_DARK }}>
          KI-Toolbox · Lernen
        </div>
        <div style={{ fontSize: '13pt', fontWeight: 700, color: 'var(--ink, #1d2026)', lineHeight: 1.12 }}>{titel}</div>
      </div>
    </div>
  )
}

export interface DocLernbegleiterProps {
  lernbegleiter: LernbegleiterJson
  abteilung?: string
  edits: Record<string, string>
  onEdit: (key: string, value: string) => void
}

export function DocLernbegleiter({ lernbegleiter, abteilung }: DocLernbegleiterProps) {
  const lb = lernbegleiter.lernbegleiter
  if (!lb) {
    return <div className="a4-page"><p style={{ padding: '40mm 0' }}>Lernbegleiter fehlt.</p></div>
  }
  const frei = lb.ki_frei_zuerst
  const karten = lb.strategie_karten || []
  const tracks = lb.kn_typ_tracks || []
  const rubrik = lb.rubrik_fokus || []
  const ebaClass = lernbegleiter.lehrgang === 'EBA_2J' ? 'doc-eba' : undefined

  // Page 1 carries the first 2 cards; remaining cards go 3 per page; then a final KN page.
  const firstCards = karten.slice(0, 2)
  const restCards = karten.slice(2)
  const restChunks: LernbegleiterStrategie[][] = []
  for (let i = 0; i < restCards.length; i += 3) restChunks.push(restCards.slice(i, i + 3))
  const pageTotal = 1 + restChunks.length + 1
  const neu = istNeueFassung(lernbegleiter)
  const basisForm = neu && restCards.length > 0 && firstCards.length > 0 && firstCards.every(istBasisKarte)
  const begriffe = neu ? (lb.begriffe || []) : []

  const page = (n: number, code: string, children: ReactNode) => (
    <A4Page
      key={n}
      sit={null}
      abteilung={abteilung}
      docCode={`DOC-LERNBEGLEITER · ${code}`}
      docTitel="KI-Lernbegleiter"
      sitLetter={null}
      pageNum={n}
      pageTotal={pageTotal}
    >
      <div className="a4-page-body">{children}</div>
    </A4Page>
  )

  let pn = 0

  return (
    <div className={ebaClass} style={lbVars}>
      {/* Page 1 — Start + erste Strategien */}
      {page(++pn, 'LERNEN', (
        <>
          <PageHeader titel={lb.titel || 'KI-Lernbegleiter'} />
          {lb.ziel && <p style={{ margin: '0 0 2mm', fontSize: '9.3pt', lineHeight: 1.4, color: '#3a4049' }}>{lb.ziel}</p>}

          {frei && (
            <section style={{ marginBottom: '2.5mm' }}>
              <SectionHead num="Ohne KI zuerst">Wo stehen Sie?</SectionHead>
              {frei.auftrag && <p style={{ margin: '0 0 1.4mm', fontSize: '9.3pt', lineHeight: 1.4 }}>{frei.auftrag}</p>}
              {frei.selbsteinschaetzung?.map((line, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '2mm', padding: '1mm 0', borderBottom: '1px solid #eef0f3' }}>
                  <span style={{ flex: 1, fontSize: '8.8pt', lineHeight: 1.34 }}>{line}</span>
                  <span style={{ flexShrink: 0, fontSize: '8pt', color: LB_AKZENT, fontWeight: 600, fontFamily: "'IBM Plex Mono', Consolas, monospace" }}>
                    1 ☐ 2 ☐ 3 ☐ 4 ☐ 5 ☐
                  </span>
                </div>
              ))}
            </section>
          )}

          {begriffe.length ? (
            <section style={{ marginBottom: '2.5mm' }}>
              <SectionHead num="Meine Begriffe">Kann ich das erklären?</SectionHead>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1mm 4mm', fontSize: '8.8pt', lineHeight: 1.5 }}>
                {begriffe.map((b, i) => (
                  <span key={i} style={{ whiteSpace: 'nowrap' }}><span style={{ color: LB_AKZENT, fontWeight: 600 }}>☐</span> {b}</span>
                ))}
              </div>
            </section>
          ) : null}

          {firstCards.length ? (
            <section>
              <SectionHead num="Strategien">So lernen Sie mit der KI</SectionHead>
              {firstCards.map((s, i) => <StrategieKarte key={i} s={s} notiz={basisForm} />)}
            </section>
          ) : null}
        </>
      ))}

      {/* Folgeseiten — weitere Strategie-Karten (volle Dichte: vor der KN-Seite) */}
      {!basisForm && restChunks.map((chunk) => page(++pn, 'STRATEGIEN', (
        <>
          <PageHeader titel="So lernen Sie mit der KI" />
          {chunk.map((s, i) => <StrategieKarte key={i} s={s} />)}
        </>
      )))}

      {/* KN-Vorbereitung — Schlussseite; in der Basis-Form Seite 2 */}
      {page(++pn, 'KN-VORBEREITUNG', (
        <>
          {tracks.length ? (
            <section style={{ marginBottom: '2.5mm' }}>
              <SectionHead num="Kompetenznachweis">Üben für Ihren Kompetenznachweis</SectionHead>
              {tracks.map((t, i) => (
                <div key={i} style={{ border: '1px solid #d8dde4', borderLeft: `3px solid ${LB_AKZENT}`, borderRadius: '1mm', padding: '1.5mm 2.5mm', marginBottom: '1.5mm', breakInside: 'avoid' }}>
                  <div style={{ fontSize: '9.3pt', fontWeight: 700, color: LB_DARK }}>{knTypFuerLernende(t.typ, t.label, lernbegleiter.lehrgang)}</div>
                  {t.uebungsfokus && <p style={{ margin: '0.5mm 0 0.9mm', fontSize: '8.6pt', lineHeight: 1.34, color: '#3a4049' }}>{t.uebungsfokus}</p>}
                  {t.prompt && <div style={promptBox}>{t.prompt}</div>}
                </div>
              ))}
            </section>
          ) : null}

          {rubrik.length ? (
            <section style={{ marginBottom: '2.5mm' }}>
              <SectionHead num="Kriterien">Worauf es im Kompetenznachweis ankommt</SectionHead>
              {rubrik.map((r, i) => (
                <div key={i} style={{ marginBottom: '1.2mm' }}>
                  <div style={{ fontSize: '9pt', fontWeight: 700, color: LB_AKZENT }}>
                    {dimensionLabel(r.dimension)}{r.kriterien?.length ? <span style={{ color: '#5b6470', fontWeight: 400 }}> — {r.kriterien.join(' · ')}</span> : null}
                  </div>
                  {r.so_uebst_du && <p style={{ margin: '0.3mm 0 0', fontSize: '8.6pt', lineHeight: 1.34 }}>{r.so_uebst_du}</p>}
                </div>
              ))}
            </section>
          ) : null}

          {lb.integritaet_warnung && (
            <div style={{ background: '#fef2f2', borderLeft: '3px solid #dc2626', padding: '1.8mm 2.5mm', borderRadius: '1mm', margin: '1.5mm 0', fontSize: '8.7pt', lineHeight: 1.38, color: '#7f1d1d' }}>
              <strong>Fairness:</strong> {lb.integritaet_warnung}
            </div>
          )}

          {lb.selbstcheck?.length ? (
            <section>
              <div style={microLabel}>Selbstcheck</div>
              <ul className="guete-list">
                {lb.selbstcheck.map((c, i) => (
                  <li key={i}><span className="check-box">☐</span><span>{c}</span></li>
                ))}
              </ul>
            </section>
          ) : null}

          {basisForm && (
            <section style={{ display: 'flex', flexDirection: 'column', flex: '1 0 auto', marginTop: '2.5mm' }}>
              <SectionHead num="Nach dem Üben">Das halte ich fest</SectionHead>
              <Notizreihe grow labels={['Mein Übungsfall', 'Das konnte ich', 'Das übe ich noch']} />
            </section>
          )}
        </>
      ))}

      {/* Basis-Form: die übrigen Karten als Plus am Schluss */}
      {basisForm && restChunks.map((chunk) => page(++pn, 'PLUS', (
        <>
          <PageHeader titel="Plus — weitere Strategien" />
          {chunk.map((s, i) => <StrategieKarte key={i} s={s} />)}
        </>
      )))}
    </div>
  )
}
