import type { ReactNode } from 'react'
import { A4Page, Badge, SectionHead, sitColors } from './chrome'
import type { KnJson, KnTyp, PrinzipJson, SetJson } from '../../../lib/einheiten/types'

export interface DocKnLpProps {
  kn: KnJson
  prinzip: PrinzipJson | null
  set: SetJson | null
  abteilung?: string
}

function LpPage({ kn, abteilung, docCode, pageNum, pageTotal, docTitel, children }: { kn: KnJson; abteilung?: string; docCode: string; pageNum: number; pageTotal: number; docTitel?: string; children: ReactNode }) {
  return (
    <A4Page
      sit={null}
      abteilung={abteilung}
      docCode={docCode}
      docTitel={docTitel}
      pageNum={pageNum}
      pageTotal={pageTotal}
      kompetenzNr={kn.kompetenz_nr}
    >
      <div className="a4-page-body">{children}</div>
    </A4Page>
  )
}

function DocKnLpKontext({ kn, prinzip, set, abteilung, pageNum, pageTotal }: { kn: KnJson; prinzip: PrinzipJson | null; set: SetJson | null; abteilung?: string; pageNum: number; pageTotal: number }) {
  return (
    <LpPage kn={kn} abteilung={abteilung} docCode="DOC-KN-LP · KONTEXT"
            docTitel={`KN ${kn.kompetenz_nr} ${kn.topic_slug}`}
            pageNum={pageNum} pageTotal={pageTotal}>
      <div className="badge-row" style={{ marginBottom: '4mm' }}>
        <Badge variant="outline">Lehrperson</Badge>
        <Badge>Kompetenznachweis {kn.kompetenz_nr}</Badge>
        <Badge variant="k-stufe">Dominanter Aspekt · {kn.dominanter_aspekt}</Badge>
      </div>
      <h1 className="cockpit-title" style={{ fontSize: '17pt' }}>
        {prinzip?.kern_kompetenzversprechen || kn.kern_kompetenzversprechen}
      </h1>
      <p className="cockpit-sub" style={{ fontStyle: 'italic', fontSize: '10pt', marginBottom: '5mm' }}>
        {kn.mehrdeutigkeits_pflicht}
      </p>
      <SectionHead num="01 · Subfacetten A · B · C">Was die drei Situationen versprechen</SectionHead>
      {prinzip?.sub_facetten && (
        <div className="cockpit-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr', gap: '4mm 5mm' }}>
          {['A', 'B', 'C'].map((letter) => {
            const sf = prinzip.sub_facetten![letter]
            if (!sf) return null
            return (
              <div className="cockpit-card" key={letter} style={{ padding: '3mm 4mm' }}>
                <h4>Subfacette {letter}</h4>
                <div className="big" style={{ fontSize: '10pt', marginBottom: '1.5mm', lineHeight: 1.2 }}>{sf.facette}</div>
                <p style={{ fontSize: '8pt', color: 'var(--ink-soft)', margin: 0, lineHeight: 1.35 }}>
                  <strong>Konfliktart:</strong> {sf.konfliktart}
                </p>
              </div>
            )
          })}
        </div>
      )}
      {prinzip?.zirkularitaet && (
        <>
          <SectionHead num="02 · Zirkularitaet">R1 jetzt — Ausblick T4 / T7</SectionHead>
          <div className="cockpit-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr', gap: '4mm 5mm' }}>
            <div className="cockpit-card" style={{ padding: '3mm 4mm' }}>
              <h4>R1 · Aktuell</h4>
              <div style={{ fontSize: '9pt', lineHeight: 1.4 }}>{prinzip.zirkularitaet.r1_aktuell}</div>
            </div>
            <div className="cockpit-card" style={{ padding: '3mm 4mm' }}>
              <h4>R2 · Voraussicht</h4>
              <div style={{ fontSize: '9pt', lineHeight: 1.4 }}>{prinzip.zirkularitaet.r2_voraussicht}</div>
            </div>
            <div className="cockpit-card" style={{ padding: '3mm 4mm' }}>
              <h4>R3 · Voraussicht</h4>
              <div style={{ fontSize: '9pt', lineHeight: 1.4 }}>{prinzip.zirkularitaet.r3_voraussicht}</div>
            </div>
          </div>
        </>
      )}
      {set?.konzept_progression && (
        <>
          <SectionHead num="03 · Konzeptbogen">Progression A → B → C</SectionHead>
          <table className="alignment-table">
            <thead>
              <tr>
                <th style={{ width: '10mm' }}>#</th>
                <th>Konzept</th>
              </tr>
            </thead>
            <tbody>
              {set.konzept_progression.map((kp, i) => (
                <tr key={i}>
                  <td className="letter">{kp.position}</td>
                  <td>{kp.konzept}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </LpPage>
  )
}

function DocKnLpHybrid({ kn, abteilung, pageNum, pageTotal }: { kn: KnJson; abteilung?: string; pageNum: number; pageTotal: number }) {
  const hs = kn.hybrid_situation
  return (
    <LpPage kn={kn} abteilung={abteilung} docCode="DOC-KN-LP · HYBRID"
            docTitel={hs?.titel}
            pageNum={pageNum} pageTotal={pageTotal}>
      <SectionHead num="04 · Hybrid-Situation">{hs?.titel}</SectionHead>
      <div className="sit-meta">
        <div className="item"><strong>Beruf</strong>{hs?.persona?.beruf}</div>
        <div className="item"><strong>Betrieb</strong>{hs?.persona?.betrieb}</div>
        <div className="item"><strong>Ort</strong>{hs?.persona?.ort}</div>
        <div className="item"><strong>Emotion</strong>{hs?.emotion_tag}</div>
      </div>
      <p className="sit-text">{hs?.text}</p>
      <div className="leitfrage-callout">{hs?.leitfrage}</div>
      {hs?.aktivierte_trade_offs && (
        <>
          <h4 style={{ fontSize: '8pt', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--sit-akzent)', marginTop: '5mm', marginBottom: '2mm' }}>
            Aktivierte Trade-offs
          </h4>
          <ul style={{ margin: 0, paddingLeft: '4mm', fontSize: '9.5pt', lineHeight: 1.45 }}>
            {hs.aktivierte_trade_offs.map((t, i) => <li key={i} style={{ marginBottom: '0.8mm' }}>{t}</li>)}
          </ul>
        </>
      )}
      <SectionHead num="05 · Alignment">Welche Subfacette welches Szenen-Element aktiviert</SectionHead>
      <table className="alignment-table">
        <thead>
          <tr>
            <th style={{ width: '14mm' }}>Subfacette</th>
            <th>Szenen-Element</th>
          </tr>
        </thead>
        <tbody>
          {hs?.alignment_note?.subfacetten_mapping?.map((m, i) => (
            <tr key={i}>
              <td className="letter">{m.sit_letter}</td>
              <td>{m.scene_element}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </LpPage>
  )
}

function KnTypCardLP({ knTyp }: { knTyp: KnTyp }) {
  return (
    <div className="kn-typ-card" style={{ marginTop: '4mm' }}>
      <div className="typ-head">
        <div className="typ-label">{knTyp.label}</div>
        <div className="typ-format">{knTyp.format}</div>
      </div>
      {knTyp.ablauf && (
        <ol className="ablauf">
          {knTyp.ablauf.map((a, i) => <li key={i}>{a}</li>)}
        </ol>
      )}
      {knTyp.fragestruktur && (
        <div style={{ marginTop: '3mm' }}>
          <h4 style={{ fontSize: '7.5pt', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--sit-akzent)', marginBottom: '2mm' }}>
            Fragestruktur
          </h4>
          {knTyp.fragestruktur.map((f, i) => (
            <div className="kn-q-item" key={i} style={{ marginTop: '2mm' }}>
              <div className="kn-q-head">
                <div className="kn-q-nr">F{f.nr}</div>
                <div className="kn-q-text">
                  <p style={{ margin: 0 }}>{f.frage}</p>
                  <div className="lf-meta">
                    <Badge variant="outline">{f.typ}</Badge>
                    <Badge variant="k-stufe">K{f.k_stufe}</Badge>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {knTyp.aufgaben && (
        <div style={{ marginTop: '3mm' }}>
          <h4 style={{ fontSize: '7.5pt', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--sit-akzent)', marginBottom: '2mm' }}>
            Aufgaben
          </h4>
          {knTyp.aufgaben.map((a, i) => (
            <div className="kn-q-item" key={i} style={{ marginTop: '2mm' }}>
              <div className="kn-q-head">
                <div className="kn-q-nr">A{a.nr}</div>
                <div className="kn-q-text">
                  <p style={{ margin: 0 }}>{a.aufgabe}</p>
                  <div className="lf-meta">
                    <Badge variant="outline">{a.typ}</Badge>
                    <Badge variant="k-stufe">K{a.k_stufe}</Badge>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {knTyp.reflexionsfragen && (
        <div style={{ marginTop: '3mm' }}>
          <h4 style={{ fontSize: '7.5pt', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--sit-akzent)', marginBottom: '2mm' }}>
            Reflexionsfragen
          </h4>
          <ol style={{ paddingLeft: '5mm', margin: 0, fontSize: '9.5pt', lineHeight: 1.5 }}>
            {knTyp.reflexionsfragen.map((f, i) => <li key={i} style={{ marginBottom: '1mm' }}>{f}</li>)}
          </ol>
        </div>
      )}
      {knTyp.optional_praesentation && (
        <p style={{ fontSize: '8.5pt', color: 'var(--ink-mute)', marginTop: '3mm', fontStyle: 'italic' }}>
          <strong>Optional:</strong> {knTyp.optional_praesentation}
        </p>
      )}
      <div className="tags" style={{ marginTop: '3mm' }}>
        {knTyp.sk && knTyp.sk.map((s, i) => <Badge key={`sk-${i}`} variant="outline">SK {s}</Badge>)}
        {knTyp.aspekte && knTyp.aspekte.map((a, i) => <Badge key={`a-${i}`}>{a}</Badge>)}
      </div>
    </div>
  )
}

function DocKnLpDurchfuehrungIntro({ kn, abteilung, pageNum, pageTotal }: { kn: KnJson; abteilung?: string; pageNum: number; pageTotal: number }) {
  return (
    <LpPage kn={kn} abteilung={abteilung} docCode="DOC-KN-LP · DURCHFUEHRUNG"
            docTitel={kn.hybrid_situation?.titel}
            pageNum={pageNum} pageTotal={pageTotal}>
      <SectionHead num="06 · Durchfuehrung">Drei KN-Typen zur Auswahl</SectionHead>
      <p style={{ fontSize: '10pt', color: 'var(--ink-soft)', marginBottom: '3mm', maxWidth: '160mm' }}>
        Alle drei Typen pruefen denselben Kompetenznachweis auf der gleichen Hybrid-Situation. Du waehlst pro Klasse oder pro Lernende/r, welcher Typ zum Einsatz kommt. K-Stufen-Hinweise sind nur fuer dich, nicht fuer Lernende sichtbar.
      </p>
      {kn.kn_typen?.[0] && <KnTypCardLP knTyp={kn.kn_typen[0]} />}
    </LpPage>
  )
}

function DocKnLpKnTyp({ kn, abteilung, knTyp, sectionNr, pageNum, pageTotal }: { kn: KnJson; abteilung?: string; knTyp: KnTyp; sectionNr: string; pageNum: number; pageTotal: number }) {
  return (
    <LpPage kn={kn} abteilung={abteilung} docCode="DOC-KN-LP · DURCHFUEHRUNG"
            docTitel={kn.hybrid_situation?.titel}
            pageNum={pageNum} pageTotal={pageTotal}>
      <SectionHead num={sectionNr}>{knTyp.label}</SectionHead>
      <KnTypCardLP knTyp={knTyp} />
    </LpPage>
  )
}

function DocKnLpBewertung({ kn, abteilung, pageNum, pageTotal }: { kn: KnJson; abteilung?: string; pageNum: number; pageTotal: number }) {
  const rs = kn.rubrik_shared
  if (!rs) return null
  const stufenLabels = ['Stufe 1', 'Stufe 2', 'Stufe 3', 'Stufe 4']
  return (
    <LpPage kn={kn} abteilung={abteilung} docCode="DOC-KN-LP · BEWERTUNG"
            docTitel={kn.hybrid_situation?.titel}
            pageNum={pageNum} pageTotal={pageTotal}>
      <SectionHead num="09 · Bewertung">Bi-dimensionaler Rubrik-Grid</SectionHead>
      <p style={{ fontSize: '9.5pt', color: 'var(--ink-soft)', marginBottom: '3mm', maxWidth: '160mm' }}>
        Pro Kriterium die zutreffende Stufe ankreuzen. SuK und Ges werden getrennt aggregiert — am Schluss zwei separate Noten, niemals zu einer verschmolzen.
      </p>
      <table className="rubrik-grid">
        <thead>
          <tr>
            <th style={{ width: '34mm' }}>Kriterium</th>
            <th className="dim-cell">Dim.</th>
            {stufenLabels.map((label, i) => (
              <th key={i} className="stufe-th">{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rs.kriterien?.map((k, i) => (
            <tr key={i}>
              <td className="kriterium-name">{k.name}</td>
              <td className="dim-cell">
                <Badge variant={k.dimension === 'SuK' ? 'dim-suk' : 'dim-ges'}>{k.dimension}</Badge>
              </td>
              {k.stufen?.map((s, j) => (
                <td key={j} className="stufe-cell">
                  <div className="checkbox" />
                  {s}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <h4 style={{ fontSize: '8pt', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--sit-akzent)', marginTop: '5mm', marginBottom: '2mm' }}>
        Niveaubaender
      </h4>
      <div className="niveau-legende">
        {rs.niveaubaender?.map((n, i) => (
          <div className="niv" key={i}>
            <div className="label">{n.label}</div>
            <div className="def">{n.definition}</div>
          </div>
        ))}
      </div>
      <h4 style={{ fontSize: '8pt', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--sit-akzent)', marginTop: '6mm', marginBottom: '3mm' }}>
        Note pro Dimension (separat)
      </h4>
      <div className="noten-block">
        <div className="noten-cell">
          <div className="label">SuK · Sach- und Kommunikationskompetenz</div>
          <div className="input"></div>
        </div>
        <div className="noten-cell">
          <div className="label">Ges · Gesellschaft</div>
          <div className="input"></div>
        </div>
      </div>
      <p style={{ fontSize: '8pt', color: 'var(--ink-mute)', marginTop: '3mm' }}>
        Aggregation: SuK-Note = Mittel der SuK-Kriterien · Ges-Note = Mittel der Ges-Kriterien. Beide Noten werden gleichgewichtet kommuniziert, aber nie zu einer Gesamtnote verschmolzen.
      </p>
    </LpPage>
  )
}

export function DocKnLp({ kn, prinzip, set, abteilung }: DocKnLpProps) {
  const style = sitColors(null)
  const kt = kn.kn_typen || []
  const total = 3 + kt.length + 1
  return (
    <div style={style}>
      <DocKnLpKontext kn={kn} prinzip={prinzip} set={set} abteilung={abteilung} pageNum={1} pageTotal={total} />
      <DocKnLpHybrid kn={kn} abteilung={abteilung} pageNum={2} pageTotal={total} />
      <DocKnLpDurchfuehrungIntro kn={kn} abteilung={abteilung} pageNum={3} pageTotal={total} />
      {kt.slice(1).map((t, i) => (
        <DocKnLpKnTyp
          key={i}
          kn={kn}
          knTyp={t}
          sectionNr={`07 · ${t.label}`}
          abteilung={abteilung}
          pageNum={4 + i}
          pageTotal={total}
        />
      ))}
      <DocKnLpBewertung kn={kn} abteilung={abteilung} pageNum={total} pageTotal={total} />
    </div>
  )
}
