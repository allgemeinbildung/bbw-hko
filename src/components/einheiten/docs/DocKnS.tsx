import type { ReactNode } from 'react'
import { A4Page, Badge, Schreibfeld, SectionHead, sitColors } from './chrome'
import { knTypLabel } from '../../../lib/einheiten/kn-typ-labels'
import type { KnJson, KnTyp } from '../../../lib/einheiten/types'
import { knPersonaFelder, knTexte, werkschauTexte, type KnAufgabe } from '../../../lib/einheiten/kn-lernende'
import { RUBRIK_PUNKTE_LABELS } from '../../../lib/einheiten/rubrik-skala'

export interface DocKnSProps {
  kn: KnJson
  knTyp: string
  abteilung?: string
  edits: Record<string, string>
  onEdit: (key: string, value: string) => void
}

function findKnTyp(kn: KnJson, typ: string): KnTyp | undefined {
  return kn.kn_typen?.find((t) => t.typ === typ) || kn.kn_typen?.[0]
}

// SuS-Ansicht: Prozentzahlen (80 % / 100 %) sind ohne Legende kryptisch und gehoeren
// nur ins LP-Material (Begleiter / DocKnLp). Hier zeigen wir Wort-Labels statt Prozente.
// Die Daten (kn.json niveaubaender) bleiben unveraendert; nur diese SuS-Anzeige uebersetzt.
// Reihenfolge: zuerst '100', dann 'unter' (faengt "unter 60 %"), dann das Mittelband
// ('80' neu / '90' altbestand) — so kollidieren Teilstring-Treffer nicht.
function susNiveauLabel(label: string): string {
  const l = (label || '').toLowerCase()
  if (l.includes('100')) return 'Vollständig & selbstständig'
  if (l.includes('unter')) return 'Grundanforderung noch nicht erfüllt'
  if (l.includes('80') || l.includes('90')) return 'Grundanforderung erfüllt'
  return label.replace(/\s*\d+\s*%/g, '').trim() || label
}

function KnSPage({ kn, knTyp, abteilung, pageNum, pageTotal, children }: { kn: KnJson; knTyp: KnTyp; abteilung?: string; pageNum: number; pageTotal: number; children: ReactNode }) {
  return (
    <A4Page
      sit={null}
      abteilung={abteilung}
      docCode={`DOC-KN-S · ${knTyp.typ.toUpperCase().slice(0, 14)}`}
      docTitel={kn.hybrid_situation?.titel}
      pageNum={pageNum}
      pageTotal={pageTotal}
      kompetenzNr={kn.kompetenz_nr}
    >
      <div className="a4-page-body">{children}</div>
    </A4Page>
  )
}

function HeaderPage({ kn, knTyp, abteilung, pageNum, pageTotal }: { kn: KnJson; knTyp: KnTyp; abteilung?: string; pageNum: number; pageTotal: number }) {
  const tx = knTexte(kn)
  const persona = knPersonaFelder(kn)
  return (
    <KnSPage kn={kn} knTyp={knTyp} abteilung={abteilung} pageNum={pageNum} pageTotal={pageTotal}>
      <div className="badge-row" style={{ marginBottom: '4mm' }}>
        <Badge variant="outline">Kompetenznachweis {kn.kompetenz_nr}</Badge>
        <Badge>{knTypLabel(knTyp.typ, knTyp.label, kn.lehrgang)}</Badge>
      </div>
      <h1 className="cockpit-title">{kn.hybrid_situation?.titel}</h1>
      <SectionHead num={tx.fallKicker}>{tx.fallTitel}</SectionHead>
      <p className="kn-definition" style={{ fontSize: '9pt', color: 'var(--ink-soft)', fontStyle: 'italic', margin: '0 0 3mm', maxWidth: '160mm' }}>
        {tx.definition}
      </p>
      {persona.length > 0 && (
        <div className="sit-meta">
          {persona.map((f) => <div className="item" key={f.label}><strong>{f.label}</strong>{f.wert}</div>)}
        </div>
      )}
      <p className="sit-text">{kn.hybrid_situation?.text}</p>
      <div className="leitfrage-callout">{kn.hybrid_situation?.leitfrage}</div>
      <SectionHead num="02 · Rahmen">Format &amp; Ablauf</SectionHead>
      <p className="kn-format" style={{ fontSize: '10pt', color: 'var(--ink-soft)', marginBottom: '3mm' }}>
        <strong style={{ color: 'var(--sit-akzent)' }}>Format:</strong> {knTyp.format}
      </p>
      {knTyp.ablauf && (
        <ol className="kn-ablauf" style={{ paddingLeft: '5mm', fontSize: '10pt', lineHeight: 1.5, margin: 0 }}>
          {knTyp.ablauf.map((a, i) => <li key={i} style={{ marginBottom: '1mm' }}>{a}</li>)}
        </ol>
      )}
    </KnSPage>
  )
}

function QItem({ nr, type, text, fieldKey, fieldHeightMm, edits, onEdit, tabelle }: { nr: string; type?: string; text: string; fieldKey: string; fieldHeightMm: number; edits: Record<string, string>; onEdit: (k: string, v: string) => void; tabelle?: KnAufgabe['tabelle'] }) {
  return (
    <div className="kn-q-item">
      <div className="kn-q-head">
        <div className="kn-q-nr">{nr}</div>
        <div className="kn-q-text">
          <p>{text}</p>
          {type && <div className="lf-meta"><Badge variant="outline">{type}</Badge></div>}
        </div>
      </div>
      {tabelle && tabelle.spalten?.length > 0 && <KnTabelle tabelle={tabelle} />}
      <Schreibfeld
        heightMm={fieldHeightMm}
        value={edits[fieldKey] || ''}
        onChange={(v) => onEdit(fieldKey, v)}
      />
    </div>
  )
}

/** Leere Tabelle zum Ausfüllen (`aufgaben[].tabelle`) — wie das Raster im Heft. */
function KnTabelle({ tabelle }: { tabelle: NonNullable<KnAufgabe['tabelle']> }) {
  const zeilen = Math.max(1, tabelle.zeilen ?? 3)
  return (
    <table className="kn-tabelle">
      <thead><tr>{tabelle.spalten.map((s, i) => <th key={i}>{s}</th>)}</tr></thead>
      <tbody>
        {Array.from({ length: zeilen }, (_, z) => (
          <tr key={z}>{tabelle.spalten.map((_, i) => <td key={i} />)}</tr>
        ))}
      </tbody>
    </table>
  )
}

function FachgespraechPages({ kn, knTyp, abteilung, edits, onEdit, pageStart, pageTotal }: { kn: KnJson; knTyp: KnTyp; abteilung?: string; edits: Record<string, string>; onEdit: (k: string, v: string) => void; pageStart: number; pageTotal: number }) {
  const fs = knTyp.fragestruktur || []
  const part1 = fs.slice(0, 3)
  const part2 = fs.slice(3)
  return (
    <>
      <KnSPage kn={kn} knTyp={knTyp} abteilung={abteilung} pageNum={pageStart} pageTotal={pageTotal}>
        <SectionHead num="03 · Vorbereitung">Notizen zu den Fragen (1/2)</SectionHead>
        <p className="kn-intro" style={{ fontSize: '9.5pt', color: 'var(--ink-soft)', marginBottom: '4mm', maxWidth: '160mm' }}>
          {knTexte(kn).notizenIntro}
        </p>
        {part1.map((f, i) => (
          <QItem
            key={i}
            nr={`F${f.nr}`}
            type={knTexte(kn).typAbzeichen ? f.typ : undefined}
            text={f.frage}
            fieldKey={`fg_${f.nr}`}
            fieldHeightMm={22}
            edits={edits} onEdit={onEdit}
          />
        ))}
      </KnSPage>
      <KnSPage kn={kn} knTyp={knTyp} abteilung={abteilung} pageNum={pageStart + 1} pageTotal={pageTotal}>
        <SectionHead num="03 · Vorbereitung">Notizen zu den Fragen (2/2)</SectionHead>
        {part2.map((f, i) => (
          <QItem
            key={i}
            nr={`F${f.nr}`}
            type={knTexte(kn).typAbzeichen ? f.typ : undefined}
            text={f.frage}
            fieldKey={`fg_${f.nr}`}
            fieldHeightMm={30}
            edits={edits} onEdit={onEdit}
          />
        ))}
      </KnSPage>
    </>
  )
}

function MiniCasePages({ kn, knTyp, abteilung, edits, onEdit, pageStart, pageTotal }: { kn: KnJson; knTyp: KnTyp; abteilung?: string; edits: Record<string, string>; onEdit: (k: string, v: string) => void; pageStart: number; pageTotal: number }) {
  const af = knTyp.aufgaben || []
  const part1 = af.slice(0, 2)
  const part2 = af.slice(2)
  return (
    <>
      <KnSPage kn={kn} knTyp={knTyp} abteilung={abteilung} pageNum={pageStart} pageTotal={pageTotal}>
        <SectionHead num="03 · Aufgaben">{knTexte(kn).aufgabenTitel} (1/2)</SectionHead>
        <p className="kn-intro" style={{ fontSize: '9.5pt', color: 'var(--ink-soft)', marginBottom: '4mm', maxWidth: '160mm' }}>
          {knTexte(kn).aufgabenIntro}
        </p>
        {part1.map((a, i) => (
          <QItem
            key={i}
            nr={`A${a.nr}`}
            type={knTexte(kn).typAbzeichen ? a.typ : undefined}
            text={a.aufgabe}
            fieldKey={`mc_${a.nr}`}
            tabelle={a.tabelle}
            fieldHeightMm={a.tabelle ? 22 : 55}
            edits={edits} onEdit={onEdit}
          />
        ))}
      </KnSPage>
      <KnSPage kn={kn} knTyp={knTyp} abteilung={abteilung} pageNum={pageStart + 1} pageTotal={pageTotal}>
        <SectionHead num="03 · Aufgaben">{knTexte(kn).aufgabenTitel} (2/2)</SectionHead>
        {part2.map((a, i) => (
          <QItem
            key={i}
            nr={`A${a.nr}`}
            type={knTexte(kn).typAbzeichen ? a.typ : undefined}
            text={a.aufgabe}
            fieldKey={`mc_${a.nr}`}
            tabelle={a.tabelle}
            fieldHeightMm={a.tabelle ? 22 : 55}
            edits={edits} onEdit={onEdit}
          />
        ))}
      </KnSPage>
    </>
  )
}

function WerkschauPages({ kn, knTyp, abteilung, edits, onEdit, pageStart, pageTotal }: { kn: KnJson; knTyp: KnTyp; abteilung?: string; edits: Record<string, string>; onEdit: (k: string, v: string) => void; pageStart: number; pageTotal: number }) {
  const reflex = knTyp.reflexionsfragen || []
  const pageBFragen = reflex.slice(1)
  return (
    <>
      <KnSPage kn={kn} knTyp={knTyp} abteilung={abteilung} pageNum={pageStart} pageTotal={pageTotal}>
        <SectionHead num="03 · Werkwahl">{knTexte(kn).werkwahlTitel}</SectionHead>
        <p className="kn-intro" style={{ fontSize: '9.5pt', color: 'var(--ink-soft)', marginBottom: '3mm', maxWidth: '160mm' }}>
          {werkschauTexte(kn, knTyp).werkwahl}
        </p>
        <Schreibfeld
          heightMm={28}
          value={edits.ws_wahl || ''}
          onChange={(v) => onEdit('ws_wahl', v)}
        />
        <SectionHead num="04 · Transfer-Reflexion">Reflexion (1/2)</SectionHead>
        <p className="kn-intro" style={{ fontSize: '9pt', color: 'var(--ink-soft)', marginBottom: '3mm' }}>
          {werkschauTexte(kn, knTyp).reflexionIntro}
        </p>
        {reflex.slice(0, 1).map((f, i) => (
          <QItem
            key={i}
            nr={`R${i + 1}`}
            text={f}
            fieldKey={`ws_r${i + 1}`}
            fieldHeightMm={55}
            edits={edits} onEdit={onEdit}
          />
        ))}
      </KnSPage>
      <KnSPage kn={kn} knTyp={knTyp} abteilung={abteilung} pageNum={pageStart + 1} pageTotal={pageTotal}>
        <SectionHead num="04 · Transfer-Reflexion">Reflexion (2/2)</SectionHead>
        {pageBFragen.map((f, i) => (
          <QItem
            key={i}
            nr={`R${i + 2}`}
            text={f}
            fieldKey={`ws_r${i + 2}`}
            fieldHeightMm={45}
            edits={edits} onEdit={onEdit}
          />
        ))}
      </KnSPage>
    </>
  )
}

function RubrikPage({ kn, knTyp, abteilung, pageNum, pageTotal }: { kn: KnJson; knTyp: KnTyp; abteilung?: string; pageNum: number; pageTotal: number }) {
  const rs = kn.rubrik_shared
  if (!rs) return null
  const tx = knTexte(kn)
  return (
    <KnSPage kn={kn} knTyp={knTyp} abteilung={abteilung} pageNum={pageNum} pageTotal={pageTotal}>
      <SectionHead num="05 · Bewertungskriterien">Worauf geachtet wird</SectionHead>
      <p className="kn-rubrik-intro" style={{ fontSize: '10pt', color: 'var(--ink-soft)', marginBottom: '4mm', maxWidth: '160mm' }}>
        {tx.rubrikIntro}
      </p>
      {tx.stufenZeigen ? (
        // EBA: wie Heft S. 7 — je Kriterium Name, Bereich und die vier Stufen für Lernende.
        <table className="kn-stufen">
          {rs.kriterien?.map((k, i) => {
            const { name, stufen } = tx.kriterium(k)
            return (
              <tbody key={i}>
                <tr className="kn-stufen-kopf">
                  <th colSpan={2}>{name} <span className="kn-stufen-dim">{tx.dimension(k.dimension)}</span></th>
                </tr>
                {stufen.map((st, si) => (
                  <tr key={si}>
                    <td className="kn-stufen-nr">{RUBRIK_PUNKTE_LABELS[si] ?? `${si} Punkte`}</td>
                    <td>{st}</td>
                  </tr>
                ))}
              </tbody>
            )
          })}
        </table>
      ) : (
      <table className="rubrik-grid">
        <thead>
          <tr>
            <th>Kriterium</th>
            <th className="dim-cell">Dimension</th>
          </tr>
        </thead>
        <tbody>
          {rs.kriterien?.map((k, i) => (
            <tr key={i}>
              <td className="kriterium-name">{k.name}</td>
              <td className="dim-cell">
                <Badge variant={k.dimension === 'SuK' ? 'dim-suk' : 'dim-ges'}>{k.dimension}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      )}
      <h4 className="kn-niveau-titel" style={{ fontSize: '8pt', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--sit-akzent)', marginTop: '7mm', marginBottom: '2mm' }}>
        {tx.niveauTitel}
      </h4>
      <div className="niveau-legende">
        {rs.niveaubaender?.map((n, i) => (
          <div className="niv" key={i}>
            <div className="label">{susNiveauLabel(n.label)}</div>
            <div className="def">{tx.niveau(n)}</div>
          </div>
        ))}
      </div>
    </KnSPage>
  )
}

export function DocKnS({ kn, knTyp, abteilung, edits, onEdit }: DocKnSProps) {
  const t = findKnTyp(kn, knTyp)
  if (!t) return <div className="a4-page"><p style={{ padding: '40mm 0' }}>KN-Typ nicht gefunden.</p></div>
  const style = sitColors(null)
  const ebaClass = kn.lehrgang === 'EBA_2J' ? 'doc-eba' : undefined
  const totalPages = 4
  let body: ReactNode
  if (t.typ === 'fachgespraech') {
    body = <FachgespraechPages kn={kn} knTyp={t} abteilung={abteilung} edits={edits} onEdit={onEdit} pageStart={2} pageTotal={totalPages} />
  } else if (t.typ === 'mini_case_schriftlich') {
    body = <MiniCasePages kn={kn} knTyp={t} abteilung={abteilung} edits={edits} onEdit={onEdit} pageStart={2} pageTotal={totalPages} />
  } else {
    body = <WerkschauPages kn={kn} knTyp={t} abteilung={abteilung} edits={edits} onEdit={onEdit} pageStart={2} pageTotal={totalPages} />
  }
  return (
    <div className={ebaClass} style={style}>
      <HeaderPage kn={kn} knTyp={t} abteilung={abteilung} pageNum={1} pageTotal={totalPages} />
      {body}
      <RubrikPage kn={kn} knTyp={t} abteilung={abteilung} pageNum={totalPages} pageTotal={totalPages} />
    </div>
  )
}
