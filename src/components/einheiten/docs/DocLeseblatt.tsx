import type { ReactNode } from 'react'
import { A4Page, SectionHead } from './chrome'
import type { DossierJson } from './DocEbaDossier'

/* ---------------------------------------------------------------------------
   DocLeseblatt — EBA-only Lese-Arbeitsblatt (Renderer B, A4/Print).
   Additiv & optional: zieht den durchgehenden Lesetext automatisch aus den
   vorhandenen Dossier-Info-Karten (nuggets[].inhalt, Reihenfolge A -> B) und
   ergaenzt ihn um autorierte Leseverstaendnis-Aufgaben (richtig/falsch,
   W-Fragen) sowie eine Vokabelbox aus dem Glossar. Stoert den bestehenden
   Karten-Flow nicht — die Lehrperson entscheidet, ob sie das Blatt austeilt.
   Wird nur fuer lehrgang === "EBA_2J" mit vorhandenem dossier.leseblatt genutzt.
--------------------------------------------------------------------------- */

export interface DocLeseblattProps {
  dossier: DossierJson
  abteilung?: string
  kompetenzNr?: string
}

function chunk<T>(arr: T[], n: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n))
  return out
}

export function DocLeseblatt({ dossier, abteilung, kompetenzNr }: DocLeseblattProps) {
  const lese = dossier.leseblatt
  const komp = kompetenzNr || dossier.kompetenz_nr || dossier.kopf?.kompetenz_nr
  if (!lese) {
    return <div className="a4-page"><p style={{ padding: '40mm 0' }}>Kein Lese-Arbeitsblatt vorhanden.</p></div>
  }

  const nuggets = dossier.nuggets || []
  const ordered = [...nuggets.filter((n) => n.tag === 'A'), ...nuggets.filter((n) => n.tag === 'B')]
  const absaetze = ordered.map((n) => n.inhalt).filter(Boolean) as string[]
  const glossar = dossier.glossar || []
  const vok = (lese.vokabeln || [])
    .map((id) => glossar.find((g) => g.id === id))
    .filter(Boolean) as NonNullable<(typeof glossar)[number]>[]
  const rf = lese.richtig_falsch || []
  const wf = lese.w_fragen || []
  const titel = lese.titel || 'Lesen und Verstehen'

  const pages: { code: string; titel: string; body: ReactNode }[] = []

  // ---- Lesetext (durchnummeriert), 3 Absaetze pro Seite; Titel auf Seite 1 ----
  let para = 0
  const textPages = chunk(absaetze, 3)
  ;(textPages.length ? textPages : [[]]).forEach((grp, i) => {
    pages.push({
      code: 'LESEBLATT · EBA',
      titel,
      body: (
        <>
          {i === 0 && (
            <div className="eba-titel-head">
              <div className="eba-titel-kicker">Lese-Arbeitsblatt · EBA</div>
              <h1 className="eba-titel-h1">{titel}</h1>
              {lese.einleitung && <p className="eba-lese-intro">{lese.einleitung}</p>}
            </div>
          )}
          <SectionHead num={i === 0 ? 'L1' : 'L1 ·'}>{i === 0 ? 'Lesetext' : 'Lesetext (Fortsetzung)'}</SectionHead>
          <div className="eba-lese-text">
            {grp.map((t) => {
              para += 1
              const num = para
              return <p key={num}><span className="eba-lese-num">{num}</span>{t}</p>
            })}
          </div>
        </>
      ),
    })
  })

  // ---- Aufgaben: richtig/falsch + W-Fragen ----
  if (rf.length || wf.length) {
    pages.push({
      code: 'LESEBLATT · EBA',
      titel: 'Aufgaben zum Text',
      body: (
        <>
          <SectionHead num="L2">Aufgaben zum Text</SectionHead>
          {rf.length > 0 && (
            <>
              <div className="eba-lese-aufgabe-titel">1. Richtig oder falsch? Kreuzen Sie an.</div>
              <div className="eba-lese-rf">
                {rf.map((r, i) => (
                  <div className="eba-lese-rf-row" key={i}>
                    <span className="eba-lese-rf-text">{r.text}</span>
                    <span className="eba-lese-rf-opt">☐ richtig&nbsp;&nbsp;☐ falsch</span>
                  </div>
                ))}
              </div>
            </>
          )}
          {wf.length > 0 && (
            <>
              <div className="eba-lese-aufgabe-titel">2. Beantworten Sie die Fragen in ganzen Sätzen.</div>
              {wf.map((q, i) => (
                <div className="eba-lese-frage" key={i}>
                  <p className="eba-lese-frage-q">{i + 1}) {q}</p>
                  <div className="eba-lese-lines" aria-hidden="true" />
                </div>
              ))}
            </>
          )}
        </>
      ),
    })
  }

  // ---- Vokabelbox (aus Glossar) ----
  if (vok.length) {
    pages.push({
      code: 'LESEBLATT · EBA',
      titel: 'Wichtige Wörter',
      body: (
        <>
          <SectionHead num="L3">Wichtige Wörter</SectionHead>
          <p className="eba-lese-intro">Diese Wörter helfen Ihnen beim Lesen.</p>
          <div className="eba-lese-vokabel">
            {vok.map((g) => (
              <div className="eba-lese-vok" key={g.id}>
                <span className="eba-lese-vok-b">{g.begriff}</span> — <span>{g.erklaerung_a2}</span>
              </div>
            ))}
          </div>
        </>
      ),
    })
  }

  const total = pages.length
  return (
    <div className="doc-eba-root">
      {pages.map((p, i) => (
        <A4Page key={i} docCode={p.code} docTitel={p.titel} pageNum={i + 1} pageTotal={total} kompetenzNr={komp} abteilung={abteilung}>
          <div className="a4-page-body doc-eba">{p.body}</div>
        </A4Page>
      ))}
    </div>
  )
}
