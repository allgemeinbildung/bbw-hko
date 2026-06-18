import type { CSSProperties, ReactNode } from 'react'
import { A4Page, Badge, Schreibfeld, SectionHead } from './chrome'
import type { KiJson, KiAssignment } from '../../../lib/einheiten/types'

// KI-Toolbox · formativ — renders ONE KI-Auftrag (chosen via `which`) across
// four A4 pages: Überblick (nRLP-Anker + Leitfragen) / Auftrag / Prompting &
// Schritte / Kontrolle & Reflexion. Used twice in the workbench (ki_1, ki_2).
// Accent is a local constant (#1E3A5F) and never written into the brand CSS
// variables (those stay green). renderToStaticMarkup-safe: no useState.

const KI_AKZENT = '#1E3A5F'
const KI_LIGHT = '#E8F0FE'
const KI_MID = '#3B6FD4'

const kiVars = {
  '--sit-akzent': KI_AKZENT,
  '--sit-light': KI_LIGHT,
  '--sit-mid': KI_MID,
} as CSSProperties

const microLabel = {
  fontSize: '8pt', fontWeight: 600, letterSpacing: '0.05em',
  textTransform: 'uppercase', color: KI_AKZENT, margin: '2.5mm 0 1mm',
} as const

const calloutBox = {
  background: KI_LIGHT, borderLeft: `3px solid ${KI_AKZENT}`,
  padding: '2.5mm 3mm', borderRadius: '1mm', margin: '2mm 0',
  fontSize: '9.8pt', lineHeight: 1.4,
} as const

const bodyText = { fontSize: '10pt', lineHeight: 1.42, margin: 0 } as const
const listStyle = { margin: 0, paddingLeft: '5mm' } as const
const listItem = { marginBottom: '1.6mm', fontSize: '10pt', lineHeight: 1.4 } as const

function Header({ num, titel, pattern }: { num: string; titel: string; pattern?: string }) {
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: '3mm', marginBottom: '1.5mm' }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: '9mm', height: '9mm', borderRadius: '50%', background: KI_AKZENT,
          color: '#fff', fontWeight: 700, fontSize: '14pt', flexShrink: 0,
        }}>{num}</span>
        <div>
          <div style={{ fontSize: '8pt', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: KI_MID }}>
            KI-Toolbox · formativ
          </div>
          <div style={{ fontSize: '16pt', fontWeight: 700, color: 'var(--ink, #1d2026)', lineHeight: 1.12 }}>
            {titel}
          </div>
        </div>
      </div>
      {pattern && (
        <Badge variant="outline" style={{ color: KI_AKZENT, borderColor: KI_AKZENT, fontSize: '8pt' }}>{pattern}</Badge>
      )}
    </>
  )
}

export interface DocKiProps {
  ki: KiJson
  which: 'ki_1' | 'ki_2'
  abteilung?: string
  edits: Record<string, string>
  onEdit: (key: string, value: string) => void
}

function pickAssignment(ki: KiJson, which: 'ki_1' | 'ki_2'): KiAssignment | undefined {
  const list = ki.assignments || []
  return list.find((a) => a.key === which) || (which === 'ki_1' ? list[0] : list[1])
}

export function DocKi({ ki, which, abteilung, edits, onEdit }: DocKiProps) {
  const a = pickAssignment(ki, which)
  const num = which === 'ki_1' ? '1' : '2'
  const key = `ki_${num}`
  const anker = ki.nrlp_anker
  const skTexte = anker?.schluesselkompetenzen_texte || []
  const lf = ki.ki_leitfragen
  const titel = a?.titel || `KI-Auftrag ${num}`

  if (!a) {
    return (
      <div className="a4-page"><p style={{ padding: '40mm 0' }}>KI-Auftrag {num} fehlt.</p></div>
    )
  }

  const PageShell = ({ code, n, children }: { code: string; n: number; children: ReactNode }) => (
    <A4Page
      sit={null}
      abteilung={abteilung}
      docCode={`DOC-KI-${num} · ${code}`}
      docTitel={titel}
      sitLetter={null}
      pageNum={n}
      pageTotal={3}
    >
      <div className="a4-page-body">{children}</div>
    </A4Page>
  )

  return (
    <div style={kiVars}>
      {/* ---------------- Page 1 — Überblick (Ziel + nRLP-Anker + Leitfragen) ---------------- */}
      <PageShell code="ÜBERBLICK" n={1}>
        <Header num={num} titel={titel} pattern={a.pattern} />

        {(a.ziel || a.bezug) && (
          <div style={{ ...calloutBox, marginTop: '3mm' }}>
            {a.ziel && <p style={{ margin: '0 0 1.5mm' }}><strong>Ziel:</strong> {a.ziel}</p>}
            {a.bezug && <p style={{ margin: 0, fontSize: '9pt', color: '#3a4049' }}><strong>Bezug:</strong> {a.bezug}</p>}
          </div>
        )}

        {skTexte.length > 0 && (
          <section style={{ marginTop: '2mm' }}>
            <SectionHead num="Lehrplan-Bezug">Worum es geht</SectionHead>
            <div style={microLabel}>Schlüsselkompetenzen dieser Einheit</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5mm', marginTop: '0.5mm' }}>
              {skTexte.map((s, i) => {
                const [code, ...rest] = s.split(' — ')
                return (
                  <span key={i} style={{
                    display: 'inline-flex', alignItems: 'baseline', gap: '1mm',
                    background: KI_LIGHT, borderRadius: '3mm', padding: '0.8mm 2.5mm',
                    fontSize: '9pt', lineHeight: 1.3,
                  }}>
                    <strong style={{ color: KI_AKZENT }}>{code}</strong>
                    {rest.length ? <span style={{ color: '#3a4049' }}>{rest.join(' — ')}</span> : null}
                  </span>
                )
              })}
            </div>
          </section>
        )}

        {lf && (
          <section style={{ marginTop: '2.5mm' }}>
            <SectionHead num="Leitfragen">Behalte diese Fragen im Kopf</SectionHead>
            <div style={{ background: KI_LIGHT, borderRadius: '1mm', padding: '2.5mm 3mm', fontSize: '9.3pt', lineHeight: 1.4 }}>
              {lf.offen && <p style={{ margin: '0 0 1mm' }}><strong>Offen:</strong> {lf.offen}</p>}
              {lf.kritisch && <p style={{ margin: '0 0 1mm' }}><strong>Kritisch:</strong> {lf.kritisch}</p>}
              {lf.vergleichend && <p style={{ margin: '0 0 1mm' }}><strong>Vergleichend:</strong> {lf.vergleichend}</p>}
              {lf.urteilend && <p style={{ margin: 0 }}><strong>Urteilend:</strong> {lf.urteilend}</p>}
            </div>
          </section>
        )}

        {a.auftrag && (
          <section style={{ marginTop: '2.5mm' }}>
            <SectionHead num="01 · Auftrag">Das ist deine Aufgabe</SectionHead>
            <p style={bodyText}>{a.auftrag}</p>
          </section>
        )}

        {a.ki_frei_vorher && (
          <section style={{ marginTop: '2.5mm' }}>
            <div style={microLabel}>Ohne KI zuerst</div>
            <p style={{ ...bodyText, margin: '0 0 1.5mm' }}>{a.ki_frei_vorher}</p>
            <Schreibfeld heightMm={17} value={edits[`${key}_frei`] || ''} onChange={(v) => onEdit(`${key}_frei`, v)} />
          </section>
        )}
      </PageShell>

      {/* ---------------- Page 2 — Prompting, Schritte & Gütekriterien ---------------- */}
      <PageShell code="PROMPTING" n={2}>
        {a.prompt_strategie?.length ? (
          <section>
            <SectionHead num="02 · Prompt-Strategie">So sprichst du mit der KI</SectionHead>
            <ol style={listStyle}>
              {a.prompt_strategie.map((s, i) => <li key={i} style={listItem}>{s}</li>)}
            </ol>
          </section>
        ) : null}

        {a.schritte?.length ? (
          <section style={{ marginTop: '3mm' }}>
            <SectionHead num="03 · Schritte">Schritt für Schritt</SectionHead>
            <ol style={listStyle}>
              {a.schritte.map((s, i) => <li key={i} style={listItem}>{s}</li>)}
            </ol>
          </section>
        ) : null}

        {a.guetekriterien?.length ? (
          <section style={{ marginTop: '3mm' }}>
            <SectionHead num="04 · Gütekriterien">Daran erkennst du gute Arbeit</SectionHead>
            <ul className="guete-list" style={{ fontSize: '9.6pt' }}>
              {a.guetekriterien.map((g, i) => (
                <li key={i}>
                  <span className="check-box">☐</span>
                  <span><strong>{g.kriterium}</strong> — {g.indikator}</span>
                </li>
              ))}
            </ul>
            <div style={{ marginTop: '2.5mm' }}>
              <div style={microLabel}>Notiere, was du mit der KI gemacht hast</div>
              <p style={{ fontSize: '8.6pt', color: '#5b6470', margin: '0 0 1mm', lineHeight: 1.32 }}>
                Welchen Prompt hast du genutzt, was hat die KI geantwortet, was hast du geprüft oder geändert?
              </p>
              <Schreibfeld heightMm={31} value={edits[`${key}_notiz`] || ''} onChange={(v) => onEdit(`${key}_notiz`, v)} />
            </div>
          </section>
        ) : null}
      </PageShell>

      {/* ---------------- Page 3 — Reflexion ---------------- */}
      <PageShell code="REFLEXION" n={3}>
        {a.reflexion?.length ? (
          <section>
            <SectionHead num="05 · Reflexion">Denk darüber nach</SectionHead>
            {a.reflexion.map((r, i) => (
              <div key={i} style={{ marginBottom: '2.5mm' }}>
                <p style={{ ...bodyText, margin: '0 0 1.2mm' }}>
                  <strong style={{ color: KI_AKZENT, fontFamily: "'IBM Plex Mono', Consolas, monospace" }}>R{i + 1}</strong> {r}
                </p>
                <Schreibfeld heightMm={32} value={edits[`${key}_refl_${i}`] || ''} onChange={(v) => onEdit(`${key}_refl_${i}`, v)} />
              </div>
            ))}
          </section>
        ) : null}
      </PageShell>
    </div>
  )
}
