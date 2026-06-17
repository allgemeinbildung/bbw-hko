import type { CSSProperties, ReactNode } from 'react'
import { A4Page, SectionHead } from './chrome'
import type { LernpromptJson, LernpromptTechnik, LernpromptStacking } from '../../../lib/einheiten/types'

// KI-Fluency · Prompting (mirrors hko-deploy `ki_lernprompt`).
// Pagination (paired): each block of 2 Technik-Karten is followed by its
// Stacking-Beispiele page (stacking_seite_1 after the first block,
// stacking_seite_2 after the second). Accent #3B6FD4 as a local constant only.
// renderToStaticMarkup-safe.

const LP_AKZENT = '#3B6FD4'
const LP_LIGHT = '#E8F0FE'
const LP_DARK = '#1E3A5F'

const lpVars = {
  '--sit-akzent': LP_AKZENT,
  '--sit-light': LP_LIGHT,
  '--sit-mid': LP_DARK,
} as CSSProperties

const microLabel = {
  fontSize: '7.5pt', fontWeight: 600, letterSpacing: '0.05em',
  textTransform: 'uppercase', color: LP_AKZENT, margin: '1.8mm 0 0.8mm',
} as const

const promptBox = {
  background: '#f5f7fa', border: '1px solid #d8dde4', borderRadius: '1mm',
  padding: '2mm 2.5mm', margin: '0.8mm 0', fontFamily: "'IBM Plex Mono', ui-monospace, Menlo, Consolas, monospace",
  fontSize: '8.6pt', lineHeight: 1.4, color: '#2a2f36', whiteSpace: 'pre-wrap',
} as const

const warnBox = {
  background: '#fff7ed', borderLeft: '3px solid #d97706',
  padding: '1.5mm 2.5mm', borderRadius: '1mm', margin: '1.2mm 0',
  fontSize: '8.3pt', lineHeight: 1.35, color: '#7c4a03',
} as const

const chip = {
  display: 'inline-block', fontSize: '7.5pt', background: LP_LIGHT, color: LP_DARK,
  padding: '0.5mm 2mm', borderRadius: '3mm', fontWeight: 500, margin: '0 1mm 1mm 0',
} as const

function TechnikKarte({ t, index }: { t: LernpromptTechnik; index: number }) {
  const bk = t.baukasten
  return (
    <div style={{
      border: '1px solid #d8dde4', borderRadius: '1.5mm', overflow: 'hidden', marginBottom: '2.5mm', breakInside: 'avoid',
    }}>
      <div style={{ background: LP_LIGHT, borderBottom: '1px solid #d8dde4', padding: '1.5mm 3mm', display: 'flex', alignItems: 'center', gap: '2.5mm' }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: '6mm', height: '6mm', borderRadius: '50%', background: LP_AKZENT,
          color: '#fff', fontWeight: 700, fontSize: '9pt', flexShrink: 0,
        }}>{index}</span>
        <span style={{ fontSize: '11pt', fontWeight: 700, color: LP_DARK, lineHeight: 1.1 }}>{t.titel}</span>
      </div>
      <div style={{ padding: '2.2mm 3mm' }}>
        {t.erklaerung && <p style={{ margin: '0 0 1.4mm', fontSize: '9.3pt', lineHeight: 1.4 }}>{t.erklaerung}</p>}
        {t.thema_bezug && (
          <p style={{ margin: '0 0 1.4mm', fontSize: '8.8pt', lineHeight: 1.36, color: '#3a4049', fontStyle: 'italic' }}>{t.thema_bezug}</p>
        )}
        {t.beispiel_basis && (
          <>
            <div style={microLabel}>Beispiel · Basis</div>
            <div style={promptBox}>{t.beispiel_basis}</div>
          </>
        )}
        {t.beispiel_fortgeschritten && (
          <>
            <div style={microLabel}>Beispiel · fortgeschritten</div>
            <div style={promptBox}>{t.beispiel_fortgeschritten}</div>
          </>
        )}
        {t.warnung && <div style={warnBox}>⚠ {t.warnung}</div>}
        {bk && (bk.rolle || bk.kontext || bk.aufgabe || bk.format) && (
          <div style={{ marginTop: '1.4mm', borderTop: '1px dashed #d8dde4', paddingTop: '1.4mm' }}>
            {([
              ['Rolle', bk.rolle], ['Kontext', bk.kontext], ['Aufgabe', bk.aufgabe], ['Format', bk.format],
            ] as Array<[string, string[] | undefined]>).map(([label, items]) =>
              items?.length ? (
                <div key={label} style={{ marginBottom: '0.6mm', lineHeight: 1.6 }}>
                  <span style={{ fontSize: '7.8pt', fontWeight: 700, color: LP_AKZENT, marginRight: '1.5mm' }}>{label}:</span>
                  {items.map((it, i) => <span key={i} style={chip}>{it}</span>)}
                </div>
              ) : null,
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function StackingPage({ s, vorlage }: { s: LernpromptStacking; vorlage?: string }) {
  return (
    <>
      <SectionHead num="Prompts stapeln">Zwei Prompts aufeinander aufbauen</SectionHead>
      {s.technik_keys?.length ? (
        <div style={{ margin: '0 0 1.5mm' }}>
          {s.technik_keys.map((k, i) => <span key={i} style={chip}>{k}</span>)}
        </div>
      ) : null}
      {s.logik_und_ziel && (
        <p style={{ margin: '0 0 2mm', fontSize: '9.5pt', lineHeight: 1.42, color: '#3a4049' }}>{s.logik_und_ziel}</p>
      )}
      {s.prompt_1 && (<><div style={microLabel}>Prompt 1 — Grundlage schaffen</div><div style={promptBox}>{s.prompt_1}</div></>)}
      {s.prompt_2 && (<><div style={microLabel}>Prompt 2 — darauf aufbauen</div><div style={promptBox}>{s.prompt_2}</div></>)}
      {vorlage && (
        <div style={{
          marginTop: '3mm', background: LP_DARK, color: '#fff', borderRadius: '1.5mm',
          padding: '2.5mm 3mm', fontSize: '9.5pt', textAlign: 'center', fontWeight: 600,
        }}>{vorlage}</div>
      )}
    </>
  )
}

function PageHeader({ titel, kontext }: { titel: string; kontext?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '3mm', marginBottom: '2.5mm' }}>
      <span style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: '9mm', height: '9mm', borderRadius: '50%', background: LP_AKZENT,
        color: '#fff', fontWeight: 700, fontSize: '14pt', flexShrink: 0,
      }}>P</span>
      <div>
        <div style={{ fontSize: '8pt', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: LP_DARK }}>
          KI-Fluency · Prompting
        </div>
        <div style={{ fontSize: '16pt', fontWeight: 700, color: 'var(--ink, #1d2026)', lineHeight: 1.12 }}>{titel}</div>
        {kontext && <p style={{ margin: '0.8mm 0 0', fontSize: '8.8pt', lineHeight: 1.36, color: '#3a4049' }}>{kontext}</p>}
      </div>
    </div>
  )
}

export interface DocLernpromptProps {
  lernprompt: LernpromptJson
  abteilung?: string
  edits: Record<string, string>
  onEdit: (key: string, value: string) => void
}

export function DocLernprompt({ lernprompt, abteilung }: DocLernpromptProps) {
  const lp = lernprompt.lernprompt
  if (!lp) {
    return <div className="a4-page"><p style={{ padding: '40mm 0' }}>Lernprompt fehlt.</p></div>
  }
  const techniken = lp.techniken || []
  const stackings = [lp.stacking_seite_1, lp.stacking_seite_2]

  // 2 Technik-Karten je Block; jedem Block folgt seine Stacking-Beispiele-Seite.
  const blocks: { cards: LernpromptTechnik[]; stacking?: LernpromptStacking }[] = []
  for (let i = 0, b = 0; i < techniken.length; i += 2, b++) {
    blocks.push({ cards: techniken.slice(i, i + 2), stacking: stackings[b] || undefined })
  }

  // Seitenliste vorab bauen, damit pageNum/pageTotal stimmen.
  const pages: { code: string; node: ReactNode }[] = []
  blocks.forEach((blk, bi) => {
    pages.push({
      code: `TECHNIKEN ${bi + 1}`,
      node: (
        <>
          {bi === 0
            ? <PageHeader titel="Prompting lernen" kontext={lp.thema_kontext} />
            : <PageHeader titel="Prompting — weitere Techniken" />}
          {blk.cards.map((t, i) => <TechnikKarte key={i} t={t} index={bi * 2 + i + 1} />)}
        </>
      ),
    })
    if (blk.stacking) {
      pages.push({
        code: `STACKING ${bi + 1}`,
        node: (
          <>
            <PageHeader titel="Prompts stapeln" />
            <StackingPage s={blk.stacking} vorlage={lp.prompt_vorlage} />
          </>
        ),
      })
    }
  })

  const pageTotal = pages.length || 1

  return (
    <div style={lpVars}>
      {pages.map((pg, i) => (
        <A4Page
          key={i}
          sit={null}
          abteilung={abteilung}
          docCode={`DOC-LERNPROMPT · ${pg.code}`}
          docTitel="KI-Lernprompt"
          sitLetter={null}
          pageNum={i + 1}
          pageTotal={pageTotal}
        >
          <div className="a4-page-body">{pg.node}</div>
        </A4Page>
      ))}
    </div>
  )
}
