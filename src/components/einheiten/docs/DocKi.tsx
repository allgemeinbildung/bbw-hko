import type { CSSProperties, ReactNode } from 'react'
import { A4Page, Schreibfeld, SectionHead } from './chrome'
import type { KiJson, KiAssignment } from '../../../lib/einheiten/types'
import { istBasisAuftrag, istNeueFassung, leitfragenListe, promptZeile, skName } from '../../../lib/einheiten/ki-toolbox'

// KI-Toolbox · Auftrag — renders ONE KI-Auftrag (chosen via `which`). Used twice
// in the workbench (ki_1, ki_2).
//
// Seitenfolge, aus den Daten abgeleitet (`istBasisAuftrag`):
//  - volle Dichte (Bestand, Plus-Auftrag): drei Seiten — Überblick / Prompts,
//    Schritte, Kontrolle / Reflexion
//  - Basis-Form (≤ 3 Schritte, ≤ 2 Reflexionsfragen): zwei Seiten — Auftrag mit
//    Prompts und Schritten / Kontrolle, Reflexion, Leitfragen
// Schreibfelder nehmen den freien Platz der Seite auf (`grow`); ihre bisherige
// Höhe bleibt Mindesthöhe, auf einer vollen Seite ändert sich also nichts.
//
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

// Wie die Prompt-Kästen in DocLernprompt / DocLernbegleiter.
const promptBox = {
  background: '#f5f7fa', border: '1px solid #d8dde4', borderRadius: '1mm',
  padding: '1.8mm 2.5mm', margin: '0.6mm 0 2mm', fontFamily: "'IBM Plex Mono', ui-monospace, Menlo, Consolas, monospace",
  fontSize: '9pt', lineHeight: 1.36, color: '#2a2f36', whiteSpace: 'pre-wrap',
} as const

const bodyText = { fontSize: '10pt', lineHeight: 1.42, margin: 0 } as const
const listStyle = { margin: 0, paddingLeft: '5mm' } as const
const listItem = { marginBottom: '1.6mm', fontSize: '10pt', lineHeight: 1.4 } as const
// Abschnitt, dessen Schreibfeld den freien Platz der Seite aufnimmt.
const growSectionNeu = { display: 'flex', flexDirection: 'column', flex: '1 0 auto' } as const

function Header({ num, titel }: { num: string; titel: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '3mm', marginBottom: '1.5mm' }}>
      <span style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: '9mm', height: '9mm', borderRadius: '50%', background: KI_AKZENT,
        color: '#fff', fontWeight: 700, fontSize: '14pt', flexShrink: 0,
      }}>{num}</span>
      <div>
        <div style={{ fontSize: '8pt', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: KI_MID }}>
          KI-Toolbox · Auftrag
        </div>
        <div style={{ fontSize: '16pt', fontWeight: 700, color: 'var(--ink, #1d2026)', lineHeight: 1.12 }}>
          {titel}
        </div>
      </div>
    </div>
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
  const skTexte = ki.nrlp_anker?.schluesselkompetenzen_texte || []
  const leitfragen = leitfragenListe(ki.ki_leitfragen)
  const titel = a?.titel || `KI-Auftrag ${num}`
  const ebaClass = ki.lehrgang === 'EBA_2J' ? 'doc-eba' : undefined

  if (!a) {
    return (
      <div className="a4-page"><p style={{ padding: '40mm 0' }}>KI-Auftrag {num} fehlt.</p></div>
    )
  }

  // Kasten um die Prompts und wachsende Schreibfelder nur im neuen Zuschnitt (2.x):
  // eine Toolbox mit Dateistand 1.x behält ihren Umbruch (E42).
  const neu = istNeueFassung(ki)
  const basis = neu && istBasisAuftrag(a)
  const growSection = neu ? growSectionNeu : {}
  const pageTotal = basis ? 2 : 3

  const PageShell = ({ code, n, children }: { code: string; n: number; children: ReactNode }) => (
    <A4Page
      sit={null}
      abteilung={abteilung}
      docCode={`DOC-KI-${num} · ${code}`}
      docTitel={titel}
      sitLetter={null}
      pageNum={n}
      pageTotal={pageTotal}
    >
      <div className="a4-page-body">{children}</div>
    </A4Page>
  )

  const zielBezug = (a.ziel || a.bezug) ? (
    <div style={{ ...calloutBox, marginTop: '3mm' }}>
      {a.ziel && <p style={{ margin: '0 0 1.5mm' }}><strong>Ziel:</strong> {a.ziel}</p>}
      {a.bezug && <p style={{ margin: 0, fontSize: '9pt', color: '#3a4049' }}><strong>Bezug:</strong> {a.bezug}</p>}
    </div>
  ) : null

  const kompetenzen = skTexte.length > 0 ? (
    <section style={{ marginTop: '2mm' }}>
      <SectionHead num="Kompetenzen">Das üben Sie</SectionHead>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5mm', marginTop: '0.5mm' }}>
        {skTexte.map((s, i) => (
          <span key={i} style={{
            background: KI_LIGHT, borderRadius: '3mm', padding: '0.8mm 2.5mm',
            fontSize: '9pt', lineHeight: 1.3, color: '#3a4049',
          }}>{skName(s)}</span>
        ))}
      </div>
    </section>
  ) : null

  const leitfragenBlock = leitfragen.length > 0 ? (
    <section style={{ marginTop: '2.5mm' }}>
      <SectionHead num="Leitfragen">Behalten Sie diese Fragen im Kopf</SectionHead>
      <ul style={{ ...listStyle, background: KI_LIGHT, borderRadius: '1mm', padding: '2.5mm 3mm 1mm 7mm', fontSize: '9.3pt', lineHeight: 1.4 }}>
        {leitfragen.map((f, i) => <li key={i} style={{ marginBottom: '1mm' }}>{f}</li>)}
      </ul>
    </section>
  ) : null

  const auftrag = a.auftrag ? (
    <section style={{ marginTop: '2.5mm' }}>
      <SectionHead num="01 · Auftrag">Das ist Ihre Aufgabe</SectionHead>
      <p style={bodyText}>{a.auftrag}</p>
    </section>
  ) : null

  const ohneKi = a.ki_frei_vorher ? (
    <section style={{ ...growSection, marginTop: '2.5mm' }}>
      <div style={microLabel}>Ohne KI zuerst</div>
      <p style={{ ...bodyText, margin: '0 0 1.5mm' }}>{a.ki_frei_vorher}</p>
      <Schreibfeld grow={neu} heightMm={17} value={edits[`${key}_frei`] || ''} onChange={(v) => onEdit(`${key}_frei`, v)} />
    </section>
  ) : null

  const prompts = a.prompt_strategie?.length ? (
    <section style={{ marginTop: basis ? '3mm' : 0 }}>
      <SectionHead num="02 · Prompts">So sprechen Sie mit der KI</SectionHead>
      {neu ? a.prompt_strategie.map((s, i) => {
        const z = promptZeile(s)
        return z ? (
          <div key={i} style={{ breakInside: 'avoid' }}>
            <p style={{ ...bodyText, fontWeight: 600, margin: '0 0 0.4mm' }}>{z.vor}</p>
            <div style={promptBox}>{z.prompt}</div>
          </div>
        ) : (
          <p key={i} style={{ ...bodyText, margin: '0 0 1.6mm' }}>{s}</p>
        )
      }) : (
        <ol style={listStyle}>
          {a.prompt_strategie.map((s, i) => <li key={i} style={listItem}>{s}</li>)}
        </ol>
      )}
    </section>
  ) : null

  const schritte = a.schritte?.length ? (
    <section style={{ marginTop: '3mm' }}>
      <SectionHead num="03 · Schritte">Schritt für Schritt</SectionHead>
      <ol style={listStyle}>
        {a.schritte.map((s, i) => <li key={i} style={listItem}>{s}</li>)}
      </ol>
    </section>
  ) : null

  const kontrolle = a.guetekriterien?.length ? (
    <section style={{ ...growSection, marginTop: basis ? 0 : '3mm' }}>
      <SectionHead num="04 · Kontrolle">Daran erkennen Sie gute Arbeit</SectionHead>
      <ul className="guete-list" style={{ fontSize: '9.6pt' }}>
        {a.guetekriterien.map((g, i) => (
          <li key={i}>
            <span className="check-box">☐</span>
            <span><strong>{g.kriterium}</strong> — {g.indikator}</span>
          </li>
        ))}
      </ul>
      <div style={{ ...growSection, marginTop: '2.5mm' }}>
        <div style={microLabel}>Notieren Sie, was Sie mit der KI gemacht haben</div>
        <p style={{ fontSize: '8.6pt', color: '#5b6470', margin: '0 0 1mm', lineHeight: 1.32 }}>
          Welchen Prompt haben Sie genutzt, was hat die KI geantwortet, was haben Sie geprüft oder geändert?
        </p>
        <Schreibfeld grow={neu} heightMm={31} value={edits[`${key}_notiz`] || ''} onChange={(v) => onEdit(`${key}_notiz`, v)} />
      </div>
    </section>
  ) : null

  const reflexion = a.reflexion?.length ? (
    <section style={{ ...growSection, marginTop: basis ? '3mm' : 0 }}>
      <SectionHead num="05 · Reflexion">Denken Sie darüber nach</SectionHead>
      {a.reflexion.map((r, i) => (
        <div key={i} style={{ ...growSection, marginBottom: '2.5mm' }}>
          <p style={{ ...bodyText, margin: '0 0 1.2mm' }}>
            <strong style={{ color: KI_AKZENT }}>{i + 1}.</strong> {r}
          </p>
          <Schreibfeld grow={neu} heightMm={basis ? 12 : 32} value={edits[`${key}_refl_${i}`] || ''} onChange={(v) => onEdit(`${key}_refl_${i}`, v)} />
        </div>
      ))}
    </section>
  ) : null

  if (basis) {
    return (
      <div className={ebaClass} style={kiVars}>
        {/* Seite 1 — der Auftrag ganz: Ziel, Aufgabe, ohne KI, Prompts, Schritte */}
        <PageShell code="AUFTRAG" n={1}>
          <Header num={num} titel={titel} />
          {zielBezug}
          {auftrag}
          {ohneKi}
          {prompts}
          {schritte}
        </PageShell>
        {/* Seite 2 — Kontrolle, Reflexion, Leitfragen */}
        <PageShell code="KONTROLLE" n={2}>
          {kontrolle}
          {reflexion}
          {leitfragenBlock}
          {kompetenzen}
        </PageShell>
      </div>
    )
  }

  return (
    <div className={ebaClass} style={kiVars}>
      {/* ---------------- Page 1 — Überblick (Ziel + Kompetenzen + Leitfragen + Auftrag) ---------------- */}
      <PageShell code="ÜBERBLICK" n={1}>
        <Header num={num} titel={titel} />
        {zielBezug}
        {kompetenzen}
        {leitfragenBlock}
        {auftrag}
        {ohneKi}
      </PageShell>

      {/* ---------------- Page 2 — Prompts, Schritte & Kontrolle ---------------- */}
      <PageShell code="PROMPTS" n={2}>
        {prompts}
        {schritte}
        {kontrolle}
      </PageShell>

      {/* ---------------- Page 3 — Reflexion ---------------- */}
      <PageShell code="REFLEXION" n={3}>
        {reflexion}
      </PageShell>
    </div>
  )
}
