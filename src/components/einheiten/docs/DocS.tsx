import type { ReactNode } from 'react'
import { A4Page, Badge, HandlungsFlaeche, Schreibfeld, SectionHead, sitColors } from './chrome'
import type { SituationJson, SetJson } from '../../../lib/einheiten/types'
import { resolveSprachmodusIds, sprachmodusKurz } from '../../../lib/einheiten/sprachfoerderung'

export interface DocSProps {
  sit: SituationJson
  set: SetJson | null
  abteilung?: string
  mode: 'info' | 'fill'
  edits: Record<string, string>
  onEdit: (key: string, value: string) => void
}

function CockpitHead({ sit }: { sit: SituationJson }) {
  return (
    <>
      <div className="badge-row" style={{ marginBottom: '2.5mm' }}>
        <Badge variant="outline">Kompetenz {sit.nrlp?.nr}</Badge>
        <Badge>Herausforderung {sit.situation} · {sit.emotion_tag}</Badge>
      </div>
      <h1 className="cockpit-title">{sit.titel}</h1>
      <p className="cockpit-sub">{sit.modul_titel}</p>
      <div className="badge-row" style={{ marginBottom: '3mm' }}>
        <span className="subfacette">Herausforderung {sit.sub_facette?.buchstabe}: {sit.sub_facette?.label}</span>
      </div>
    </>
  )
}

function CockpitCards({ sit }: { sit: SituationJson }) {
  return (
    <div className="cockpit-grid">
      <div className="cockpit-card">
        <h4>Persona</h4>
        <div className="big">{sit.persona?.beruf}</div>
        <p style={{ margin: '1mm 0 0', fontSize: '9pt', color: 'var(--ink-soft)' }}>
          {sit.persona?.betrieb}, {sit.persona?.ort}
        </p>
      </div>
      <div className="cockpit-card">
        <h4>Handlungsprodukt</h4>
        <div className="big">{sit.handlungsprodukt?.format}</div>
        <p style={{ margin: '1mm 0 0', fontSize: '9pt', color: 'var(--ink-soft)' }}>
          {sit.handlungsprodukt?.titel}
        </p>
      </div>
    </div>
  )
}

function MiniTableLabel({ children }: { children: ReactNode }) {
  return (
    <h4 style={{
      fontSize: '8pt', fontWeight: 600,
      letterSpacing: '0.06em', textTransform: 'uppercase',
      color: 'var(--sit-akzent)', marginBottom: '2mm'
    }}>{children}</h4>
  )
}

function WochenPlanTable({ sit }: { sit: SituationJson }) {
  if (!sit.wochen_plan) return null
  const cleanLabel = (l: string) => (l || '').replace(/^Woche\s+\d+\s*[-–—]\s*/i, '').trim()
  return (
    <section style={{ marginTop: '4mm' }}>
      <MiniTableLabel>Wochenplan</MiniTableLabel>
      <table className="cockpit-table">
        <thead><tr><th style={{ width: '26mm' }}>Dauer</th><th>Inhalt</th></tr></thead>
        <tbody>
          {sit.wochen_plan.map((w, i) => (
            <tr key={i}><td className="num">{cleanLabel(w.label) || w.label}</td><td>{w.text}</td></tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

function BewertungsRasterTable({ sit }: { sit: SituationJson }) {
  if (!sit.bewertungsraster) return null
  const total = sit.bewertungsraster.reduce((s, r) => s + (r.gewicht || 0), 0)
  return (
    <section style={{ marginTop: '3mm' }}>
      <MiniTableLabel>Bewertungsraster · Total {total}%</MiniTableLabel>
      <table className="cockpit-table">
        <thead>
          <tr>
            <th style={{ width: '34mm' }}>Produkt</th>
            <th style={{ width: '46mm' }}>Abgabe</th>
            <th style={{ width: '14mm' }}>Gewicht</th>
            <th>Kriterium</th>
          </tr>
        </thead>
        <tbody>
          {sit.bewertungsraster.map((b, i) => (
            <tr key={i}>
              <td><strong>{b.produkt}</strong></td>
              <td>{b.abgabe}</td>
              <td className="num">{b.gewicht}%</td>
              <td>{b.kriterium}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

function QuellenList({ sit }: { sit: SituationJson }) {
  if (!sit.quellen_anker) return null
  return (
    <section style={{ marginTop: '3mm' }}>
      <MiniTableLabel>Quellen</MiniTableLabel>
      <ul style={{ margin: 0, paddingLeft: '4mm', fontSize: '8.5pt', lineHeight: 1.45 }}>
        {sit.quellen_anker.map((q, i) => (
          <li key={i} style={{ marginBottom: '0.5mm' }}>
            <strong>{q.titel}</strong>
            {q.unterueberschrift && <> · {q.unterueberschrift}</>}
            {(q.ref || q.seiten) && (
              <span style={{ color: 'var(--ink-mute)' }}> · {[q.ref, q.seiten].filter(Boolean).join(' · ')}</span>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}

function SituationBlock({ sit }: { sit: SituationJson }) {
  return (
    <>
      <div className="sit-meta">
        <div className="item"><strong>Beruf</strong>{sit.persona?.beruf}</div>
        <div className="item"><strong>Betrieb</strong>{sit.persona?.betrieb}</div>
        <div className="item"><strong>Ort</strong>{sit.persona?.ort}</div>
        <div className="item"><strong>Emotion</strong>{sit.emotion_tag}</div>
      </div>
      <p className="sit-text">{sit.situation_text}</p>
      {sit.zahlen_tabelle && (
        <table className="zahlen-tabelle">
          <tbody>
            {sit.zahlen_tabelle.map((z, i) => (
              <tr key={i}>
                <td>{z.label}</td>
                <td className="wert">{z.wert}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="leitfrage-callout">{sit.leitfrage}</div>
      {sit.mehrdeutigkeit?.trade_off && (
        <div
          className="spannungsfeld-callout"
          style={{
            marginTop: '3mm', padding: '2.5mm 3mm',
            borderLeft: '3px solid var(--sit-akzent)',
            background: 'var(--sit-light, rgba(0,0,0,0.03))',
            fontSize: '9.5pt', lineHeight: 1.45,
          }}
        >
          <span style={{
            display: 'block', fontSize: '7.5pt', fontWeight: 600,
            letterSpacing: '0.06em', textTransform: 'uppercase',
            color: 'var(--sit-akzent)', marginBottom: '1mm',
          }}>Spannungsfeld</span>
          {sit.mehrdeutigkeit.trade_off}
        </div>
      )}
    </>
  )
}

interface LeitfrageItemProps {
  lf: NonNullable<SituationJson['leitfragen']>[number]
  withField: boolean
  edits?: Record<string, string>
  onEdit?: (k: string, v: string) => void
  fieldHeightMm?: number
}

function LeitfrageItem({ lf, withField, edits = {}, onEdit = () => {}, fieldHeightMm }: LeitfrageItemProps) {
  return (
    <div className="lf-item">
      <div className="lf-head">
        <div className="lf-nr">LF{lf.nr}</div>
        <div className="lf-text">
          <p>{lf.text}</p>
          <div className="lf-meta">
            <Badge variant="outline">{lf.bloom}</Badge>
            <span className="source-ref">{lf.knoten_ref}</span>
          </div>
        </div>
      </div>
      {withField && (
        <Schreibfeld
          heightMm={fieldHeightMm || lf.feld_hoehe_mm || 15}
          value={edits[`lf_${lf.nr}`] || ''}
          onChange={(v) => onEdit(`lf_${lf.nr}`, v)}
        />
      )}
    </div>
  )
}

interface ReflexionItemProps {
  rf: NonNullable<SituationJson['reflexion_fragen']>[number]
  withField: boolean
  edits?: Record<string, string>
  onEdit?: (k: string, v: string) => void
  fieldHeightMm?: number
}

function ReflexionItem({ rf, withField, edits = {}, onEdit = () => {}, fieldHeightMm }: ReflexionItemProps) {
  return (
    <div className="rf-item">
      <div className="lf-head">
        <div className="lf-nr">{rf.nr}</div>
        <div className="lf-text">
          <p>{rf.text}</p>
          {rf.sub && <p style={{ color: 'var(--ink-mute)', fontSize: '9.5pt' }}>{rf.sub}</p>}
        </div>
      </div>
      {withField && (
        <Schreibfeld
          heightMm={fieldHeightMm || rf.feld_hoehe_mm || 10}
          value={edits[`rf_${rf.nr}`] || ''}
          onChange={(v) => onEdit(`rf_${rf.nr}`, v)}
        />
      )}
    </div>
  )
}

function MindmapFull({ sit }: { sit: SituationJson }) {
  return (
    <div className="mindmap">
      <div className="mindmap-zentrum">{sit.mindmap_zentrum}</div>
      <div className="mindmap-voll">
        {sit.mindmap_aeste?.map((ast, i) => (
          <div className="mindmap-ast" key={i}>
            <h4>
              {ast.titel}
              {ast.optional && <span className="opt"> · optional</span>}
            </h4>
            <ul>
              {ast.punkte?.map((p, j) => <li key={j}>{p}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

function MindmapSkelett({ sit }: { sit: SituationJson }) {
  return (
    <div className="mindmap">
      <p style={{ fontSize: '8pt', color: 'var(--ink-mute)', marginBottom: '3mm', fontStyle: 'italic' }}>
        Skizziere deine Mindmap auf der Fläche. Zentrum und Ast-Titel sind als Anker gesetzt; die Detail-Punkte arbeitest du selbst aus.
      </p>
      <div className="mindmap-skelett" style={{ minHeight: '180mm' }}>
        <div className="zentrum-skelett">
          <div className="mindmap-zentrum">{sit.mindmap_zentrum}</div>
        </div>
        <div className="aeste-skelett">
          {sit.mindmap_aeste?.map((ast, i) => (
            <div className={`ast-skelett ${ast.optional ? 'optional' : ''}`} key={i}>
              {ast.titel}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function SusMarker({ sit }: { sit: SituationJson }) {
  // Small student-facing markers: which Sprachmodus / Kompetenz is being practiced.
  const ids = resolveSprachmodusIds(sit.nrlp || {})
  const komp = sit.nrlp?.kompetenz_id || sit.nrlp?.nr
  if (!ids.length && !komp) return null
  return (
    <div className="sus-marker" style={{
      display: 'flex', flexWrap: 'wrap', gap: '1.5mm', alignItems: 'center',
      margin: '0 0 3mm', fontSize: '7.5pt',
    }}>
      <span style={{ color: 'var(--ink-mute)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Du übst:</span>
      {ids.map((id) => (
        <span key={id} style={{
          fontWeight: 600, color: 'var(--sit-akzent)',
          border: '1px solid var(--sit-akzent)', borderRadius: '2mm', padding: '0.3mm 1.5mm',
        }}>{sprachmodusKurz(id)}</span>
      ))}
      {komp && (
        <span style={{ color: 'var(--ink-mute)' }}>· Kompetenz {komp}</span>
      )}
    </div>
  )
}

function AbgabeCallout({ hp }: { hp: NonNullable<SituationJson['handlungsprodukt']> }) {
  const abgaben = hp.abgaben?.filter(Boolean) || []
  if (!hp.format && !abgaben.length) return null
  return (
    <div className="abgabe-callout">
      <div className="abgabe-label">Das lieferst du ab</div>
      {hp.format && <div className="abgabe-format">{hp.format}</div>}
      {abgaben.length > 0 && (
        <ul className="abgabe-list">
          {abgaben.map((a, i) => <li key={i}>{a}</li>)}
        </ul>
      )}
    </div>
  )
}

function HandlungsproduktIntro({ sit }: { sit: SituationJson }) {
  const hp = sit.handlungsprodukt
  if (!hp) return null
  return (
    <>
      <SusMarker sit={sit} />
      <AbgabeCallout hp={hp} />
      <p className="hp-intro">{hp.beschreibung}</p>
      {hp.schritte && (
        <ol className="hp-schritte">
          {hp.schritte.map((s, i) => (
            <li key={i}>
              <div className="hp-schritt-label">{s.label}</div>
              <div className="hp-schritt-hint">{s.hint}</div>
            </li>
          ))}
        </ol>
      )}
    </>
  )
}

function AustauschBlock({ set, sit }: { set: SetJson | null; sit: SituationJson }) {
  const ap = set?.austausch_phase
  const da = set?.dekontextualisierungs_aufgabe
  if (!ap && !da) return null
  return (
    <div className="austausch-grid">
      {ap && (
        <>
          <div className="austausch-label">Austausch · {ap.format} · {ap.dauer_min} min</div>
          <div className="austausch-text">
            <div className="runden">
              {ap.gruppenarbeit_jigsaw?.runde_1 && (
                <div className="runden-item"><span className="nr">Runde 1</span><span>{ap.gruppenarbeit_jigsaw.runde_1}</span></div>
              )}
              {ap.gruppenarbeit_jigsaw?.runde_2 && (
                <div className="runden-item"><span className="nr">Runde 2</span><span>{ap.gruppenarbeit_jigsaw.runde_2}</span></div>
              )}
              {ap.gruppenarbeit_jigsaw?.runde_3 && (
                <div className="runden-item"><span className="nr">Runde 3</span><span>{ap.gruppenarbeit_jigsaw.runde_3}</span></div>
              )}
            </div>
          </div>
          <div className="austausch-label">Plenum</div>
          <div className="austausch-text">{ap.einzelarbeit_plenum}</div>
        </>
      )}
      {da && (
        <>
          <div className="austausch-label">Transfer</div>
          <div className="austausch-text">
            <p style={{ fontWeight: 500, margin: '0 0 1mm' }}>{da.auftrag}</p>
            <p style={{ fontSize: '8.5pt', color: 'var(--ink-soft)', margin: 0 }}>
              <strong>Format:</strong> {da.format} · <strong>Gewicht:</strong> {da.gewicht_prozent}% · <strong>Abgabe:</strong> {da.abgabe}
            </p>
            {sit.dekontextualisierung?.frage && (
              <p style={{ marginTop: '2mm', margin: '2mm 0 0' }}>
                <strong style={{ color: 'var(--sit-akzent)' }}>Leitend:</strong> {sit.dekontextualisierung.frage}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  )
}

function makePage(common: { sit: SituationJson; abteilung?: string; mode: 'info' | 'fill' }) {
  return ({ pageNum, pageTotal, children }: { pageNum: number; pageTotal: number; children: ReactNode }) => (
    <A4Page
      sit={common.sit.situation}
      abteilung={common.abteilung}
      docCode={`DOC-S · HF ${common.sit.situation} · ${common.mode === 'info' ? 'DOSSIER' : 'AUFTRAG'}`}
      docTitel={common.sit.titel}
      sitLetter={common.sit.situation}
      pageNum={pageNum}
      pageTotal={pageTotal}
      kompetenzNr={common.sit.nrlp?.nr}
    >
      <div className="a4-page-body">{children}</div>
    </A4Page>
  )
}

function DocSInfo({ sit, set, abteilung, mode }: DocSProps) {
  const Page = makePage({ sit, abteilung, mode })
  const total = 4
  return (
    <div style={sitColors(sit)}>
      <Page pageNum={1} pageTotal={total}>
        <CockpitHead sit={sit} />
        <CockpitCards sit={sit} />
        <WochenPlanTable sit={sit} />
        <BewertungsRasterTable sit={sit} />
        <QuellenList sit={sit} />
      </Page>
      <Page pageNum={2} pageTotal={total}>
        <SectionHead num="02 · Herausforderung">{sit.titel}</SectionHead>
        <SituationBlock sit={sit} />
        <SectionHead num="03 · Wissensecke">Leitfragen</SectionHead>
        {sit.leitfragen_intro && (
          <p style={{ fontSize: '9pt', color: 'var(--ink-soft)', maxWidth: '160mm', marginBottom: '3mm' }}>
            {sit.leitfragen_intro}
          </p>
        )}
        {sit.leitfragen?.map((lf, i) => (
          <LeitfrageItem key={i} lf={lf} withField={false} />
        ))}
      </Page>
      <Page pageNum={3} pageTotal={total}>
        <SectionHead num="04 · Mindmap">{sit.mindmap_zentrum}</SectionHead>
        <MindmapFull sit={sit} />
        <SectionHead num="05 · Handlungsprodukt">{sit.handlungsprodukt?.titel}</SectionHead>
        <HandlungsproduktIntro sit={sit} />
      </Page>
      <Page pageNum={4} pageTotal={total}>
        <SectionHead num="06 · Selbstcheck">Reflexion</SectionHead>
        {sit.reflexion_fragen?.map((rf, i) => (
          <ReflexionItem key={i} rf={rf} withField={false} />
        ))}
        <SectionHead num="07 · Austausch &amp; Transfer">Austausch &amp; Transfer</SectionHead>
        <AustauschBlock set={set} sit={sit} />
      </Page>
    </div>
  )
}

function DocSFill({ sit, set, abteilung, mode, edits, onEdit }: DocSProps) {
  const Page = makePage({ sit, abteilung, mode })
  const lf = sit.leitfragen || []
  const lfPairs: typeof lf[] = []
  for (let i = 0; i < lf.length; i += 2) lfPairs.push(lf.slice(i, i + 2))

  let pageIdx = 0
  const nextPage = () => ++pageIdx
  const actualTotal = 6 + lfPairs.length

  return (
    <div style={sitColors(sit)}>
      <Page pageNum={nextPage()} pageTotal={actualTotal}>
        <CockpitHead sit={sit} />
        <CockpitCards sit={sit} />
        <WochenPlanTable sit={sit} />
        <BewertungsRasterTable sit={sit} />
        <QuellenList sit={sit} />
      </Page>
      <Page pageNum={nextPage()} pageTotal={actualTotal}>
        <SectionHead num="02 · Herausforderung">{sit.titel}</SectionHead>
        <SituationBlock sit={sit} />
      </Page>
      {lfPairs.map((pair, pi) => (
        <Page key={`lfp-${pi}`} pageNum={nextPage()} pageTotal={actualTotal}>
          {pi === 0 ? (
            <>
              <SectionHead num="03 · Wissensecke">Leitfragen</SectionHead>
              {sit.leitfragen_intro && (
                <p style={{ fontSize: '10pt', color: 'var(--ink-soft)', maxWidth: '160mm', marginBottom: '5mm' }}>
                  {sit.leitfragen_intro}
                </p>
              )}
            </>
          ) : (
            <SectionHead num={`03 · Wissensecke (${pi + 1})`}>Leitfragen (Fortsetzung)</SectionHead>
          )}
          {pair.map((q, i) => (
            <LeitfrageItem key={i} lf={q} withField={true} edits={edits} onEdit={onEdit} fieldHeightMm={55} />
          ))}
        </Page>
      ))}
      <Page pageNum={nextPage()} pageTotal={actualTotal}>
        <SectionHead num="04 · Mindmap">{sit.mindmap_zentrum}</SectionHead>
        <MindmapSkelett sit={sit} />
      </Page>
      <Page pageNum={nextPage()} pageTotal={actualTotal}>
        <SectionHead num="05 · Handlungsprodukt">{sit.handlungsprodukt?.titel}</SectionHead>
        <HandlungsproduktIntro sit={sit} />
        <HandlungsFlaeche
          label={sit.handlungsprodukt?.schreib_label || 'HIER ERARBEITEN'}
          value={edits.handlungsprodukt || ''}
          onChange={(v) => onEdit('handlungsprodukt', v)}
        />
      </Page>
      <Page pageNum={nextPage()} pageTotal={actualTotal}>
        <SectionHead num="06 · Selbstcheck">Reflexion</SectionHead>
        {sit.reflexion_fragen?.map((rf, i) => (
          <ReflexionItem key={i} rf={rf} withField={true} edits={edits} onEdit={onEdit} fieldHeightMm={35} />
        ))}
      </Page>
      <Page pageNum={nextPage()} pageTotal={actualTotal}>
        <SectionHead num="07 · Austausch &amp; Transfer">Austausch &amp; Transfer</SectionHead>
        <AustauschBlock set={set} sit={sit} />
        <p style={{
          fontSize: '8.5pt', color: 'var(--ink-mute)',
          marginTop: '4mm', marginBottom: '2mm',
          textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600,
        }}>
          Dein Transfer (5–7 Sätze)
        </p>
        <Schreibfeld
          heightMm={55}
          value={edits.dekontext || ''}
          onChange={(v) => onEdit('dekontext', v)}
        />
      </Page>
    </div>
  )
}

export function DocS(props: DocSProps) {
  if (props.mode === 'info') return <DocSInfo {...props} />
  return <DocSFill {...props} />
}
