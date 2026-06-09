import { useEffect, useRef, type ReactNode, type CSSProperties } from 'react'
import type { SituationJson } from '../../../lib/einheiten/types'

interface A4PageProps {
  children: ReactNode
  sit?: string | null
  abteilung?: string
  docCode?: string
  docTitel?: string
  sitLetter?: string | null
  pageNum: number
  pageTotal: number
  kompetenzNr?: string
  /** B2 — alle abgedeckten Kompetenzen; Zusatzwerte erscheinen als «(+1.1.3)» in der Fusszeile. */
  abgedeckteKompetenzen?: string[]
  logoUrl?: string
}

export function A4Page({ children, sit, abteilung, docCode, docTitel, sitLetter, pageNum, pageTotal, kompetenzNr, abgedeckteKompetenzen, logoUrl = '/logo-bbw-doc.png' }: A4PageProps) {
  const sitClass = sit ? `sit-${sit}` : 'sit-neutral'
  // B2 — Kompetenznummer(n) für den Druck. Primärnummer + ggf. zusätzlich abgedeckte.
  const kompExtras = (abgedeckteKompetenzen || []).filter((k) => k && k !== kompetenzNr)
  return (
    <article className={`a4-page ${sitClass}`}>
      <div className="sit-strip" />
      <header className="page-head">
        <div className="page-head-left">
          <img className="page-head-logo" src={logoUrl} alt="" />
          {abteilung && (
            <div className="page-head-meta">
              <div className="abt">{abteilung}</div>
            </div>
          )}
        </div>
        <div className="page-head-right">
          {/* C1 — KOMP pill removed from the page header (kompetenzNr kept in signature for back-compat) */}
          <div className="doc-code">{docCode}</div>
        </div>
      </header>
      {children}
      <footer className="page-foot">
        <div className="foot-titel">{docTitel}</div>
        <div>
          {kompetenzNr && (
            <span className="foot-komp">Kompetenz {kompetenzNr}{kompExtras.length ? ` (+${kompExtras.join(', ')})` : ''} · </span>
          )}
          {sitLetter && <span className="foot-sit">HF {sitLetter} · </span>}
          <span>{pageNum} / {pageTotal}</span>
        </div>
      </footer>
    </article>
  )
}

export function sitColors(situation: SituationJson | null | undefined): CSSProperties {
  if (!situation) {
    return {
      '--sit-akzent': '#2C3E50',
      '--sit-light': '#ECF0F1',
      '--sit-mid': '#7F8C8D',
    } as CSSProperties
  }
  return {
    '--sit-akzent': situation.sit_farbe,
    '--sit-light': situation.sit_farbe_light,
    '--sit-mid': situation.sit_farbe_mid,
  } as CSSProperties
}

export function Badge({ children, variant = '', ...rest }: { children: ReactNode; variant?: string } & React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={`badge ${variant}`} {...rest}>{children}</span>
}

export function SectionHead({ num, children }: { num: string; children: ReactNode }) {
  return (
    <div className="section-head">
      <div className="section-num">{num}</div>
      <h2 className="section-title">{children}</h2>
      <div className="section-rule" />
    </div>
  )
}

interface SchreibfeldProps {
  heightMm?: number
  value?: string
  onChange?: (v: string) => void
  placeholder?: string
}

export function Schreibfeld({ heightMm = 15, value = '', onChange, placeholder = '' }: SchreibfeldProps) {
  const minRows = Math.max(3, Math.ceil(heightMm / 8.5) + 2)
  const minHeight = `calc(8.5mm * ${minRows})`
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (ref.current && ref.current.innerText !== value) {
      ref.current.innerText = value || ''
    }
  }, [value])
  return (
    <div
      ref={ref}
      className="feld"
      style={{ minHeight }}
      contentEditable
      suppressContentEditableWarning
      data-placeholder={placeholder}
      onInput={(e) => onChange && onChange((e.currentTarget as HTMLDivElement).innerText)}
      spellCheck={false}
    />
  )
}

export function HandlungsFlaeche({ label, value, onChange }: { label: string; value: string; onChange?: (v: string) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (ref.current && ref.current.innerText !== value) {
      ref.current.innerText = value || ''
    }
  }, [value])
  return (
    <div className="hp-flaeche-wrap" style={{ position: 'relative' }}>
      <div
        ref={ref}
        className="hp-flaeche"
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => onChange && onChange((e.currentTarget as HTMLDivElement).innerText)}
        spellCheck={false}
      />
      <div className="hp-flaeche-label">{label}</div>
    </div>
  )
}
