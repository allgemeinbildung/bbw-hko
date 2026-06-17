import type { ReactNode } from 'react'
import { A4Page, Badge, HandlungsFlaeche, Schreibfeld, SectionHead, sitColors } from './chrome'
import type { SituationJson, SetJson } from '../../../lib/einheiten/types'

export interface DocSProps {
  sit: SituationJson
  set: SetJson | null
  abteilung?: string
  mode: 'info' | 'fill'
  edits: Record<string, string>
  onEdit: (key: string, value: string) => void
  // B2 — Kompetenznummer(n) für die Fusszeile; fallen auf die nrlp-Werte der Herausforderung zurück.
  kompetenzNr?: string
  abgedeckteKompetenzen?: string[]
}

// C1 — Cockpit head: no Kompetenz badge, no emotion on the HF badge, herausforderung label only.
function CockpitHead({ sit }: { sit: SituationJson }) {
  return (
    <>
      <div className="badge-row" style={{ marginBottom: '2.5mm' }}>
        <Badge>Herausforderung {sit.buchstabe}</Badge>
      </div>
      <h1 className="cockpit-title">{sit.titel}</h1>
      <p className="cockpit-sub">{sit.modul_titel}</p>
      {sit.herausforderung?.label && (
        <div className="badge-row" style={{ marginBottom: '3mm' }}>
          <span className="herausforderung">{sit.herausforderung.label}</span>
        </div>
      )}
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

// C1 — Bewertungsraster → "Checkliste Vollständigkeit": Produkt · Kriterien · ☐ (no Abgabe/Gewicht/Total).
// Kriterien cell shows vollstaendig_wenn[] as bullets (fallback to kriterium). Final column is an empty box.
function ChecklisteVollstaendigkeit({ sit }: { sit: SituationJson }) {
  if (!sit.bewertungsraster) return null
  return (
    <section style={{ marginTop: '3mm' }}>
      <MiniTableLabel>Checkliste Vollständigkeit</MiniTableLabel>
      <table className="cockpit-table checkliste-table">
        <thead>
          <tr>
            <th style={{ width: '34mm' }}>Produkt</th>
            <th>Kriterien</th>
            <th style={{ width: '10mm', textAlign: 'center' }}>☐</th>
          </tr>
        </thead>
        <tbody>
          {sit.bewertungsraster.map((b, i) => {
            const bullets = b.vollstaendig_wenn?.filter(Boolean) || []
            return (
              <tr key={i}>
                <td><strong>{b.produkt}</strong></td>
                <td>
                  {bullets.length > 0 ? (
                    <ul className="checkliste-krit">
                      {bullets.map((v, j) => <li key={j}>{v}</li>)}
                    </ul>
                  ) : (
                    b.kriterium
                  )}
                </td>
                <td style={{ textAlign: 'center' }}><span className="check-box">☐</span></td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </section>
  )
}

// C1 — "Quellen" → "Ressourcen". No enrichment.
function RessourcenList({ sit }: { sit: SituationJson }) {
  if (!sit.quellen_anker) return null
  return (
    <section style={{ marginTop: '3mm' }}>
      <MiniTableLabel>Ressourcen</MiniTableLabel>
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

// C2 — Situation block: situation_text + Leitfrage (+ Spannungsfeld). sit-meta + zahlen_tabelle removed.
function SituationBlock({ sit }: { sit: SituationJson }) {
  return (
    <>
      <p className="sit-text">{sit.situation_text}</p>
      <div className="leitfrage-callout">{sit.leitfrage}</div>
      {sit.mehrdeutigkeit?.trade_off && (
        <div className="tradeoff-callout" style={{ marginTop: '3mm' }}>
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

// C5 — Radial mindmap: central node + 4 branch lines to 4 labelled sub-nodes. 4th branch (optional) dashed/lighter.
// Optimized for exactly 4 branches; degrades to a simple grid for N≠4.
function MindmapRadial({ sit, full }: { sit: SituationJson; full: boolean }) {
  const aeste = sit.mindmap_aeste || []

  if (aeste.length !== 4) {
    return (
      <div className="mindmap">
        <div className="mindmap-zentrum">{sit.mindmap_zentrum}</div>
        <div className="mindmap-voll">
          {aeste.map((ast, i) => (
            <div className="mindmap-ast" key={i}>
              <h4>{ast.titel}{ast.optional && <span className="opt"> · optional</span>}</h4>
              {full && ast.punkte && <ul>{ast.punkte.map((p, j) => <li key={j}>{p}</li>)}</ul>}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const cornerClass = ['mm-b1', 'mm-b2', 'mm-b3', 'mm-b4']
  const lineEnds = [
    { x2: 24, y2: 22 },
    { x2: 76, y2: 22 },
    { x2: 24, y2: 78 },
    { x2: 76, y2: 78 },
  ]
  return (
    <div className={`mindmap-radial ${full ? 'voll' : 'skelett'}`}>
      <svg className="mindmap-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {lineEnds.map((l, i) => (
          <line
            key={i}
            x1="50" y1="50" x2={l.x2} y2={l.y2}
            className={aeste[i].optional ? 'optional' : ''}
          />
        ))}
      </svg>
      <div className="mm-node mm-center">{sit.mindmap_zentrum}</div>
      {aeste.map((ast, i) => (
        <div className={`mm-node mm-branch ${cornerClass[i]} ${ast.optional ? 'optional' : ''}`} key={i}>
          <h5>{ast.titel}{ast.optional && <span className="opt"> · optional</span>}</h5>
          {full
            ? (ast.punkte && <ul>{ast.punkte.map((p, j) => <li key={j}>{p}</li>)}</ul>)
            : <div className="mm-space" />}
        </div>
      ))}
    </div>
  )
}

// C5/AS-2 — skeleton intro hint refined to point at Leitfragen-Antworten + Ressourcen.
function MindmapSkelett({ sit }: { sit: SituationJson }) {
  return (
    <div className="mindmap">
      <p className="mindmap-hint">
        Bauen Sie Ihre Mindmap aus Ihren Leitfragen-Antworten und den Ressourcen auf dieser Seite. Zentrum und die vier Ast-Titel sind gesetzt — ergänzen Sie die Detail-Punkte selbst.
      </p>
      <MindmapRadial sit={sit} full={false} />
    </div>
  )
}

// Dossier — the mindmap is NOT drawn here (it's done on paper or another device).
// Just hint at the parts to generate: the four Ast-Titel. Keeps the Dossier one page shorter.
function MindmapHinweis({ sit }: { sit: SituationJson }) {
  const aeste = sit.mindmap_aeste || []
  if (!aeste.length) return null
  return (
    <div className="mindmap-hinweis">
      <p className="mm-hinweis-intro">
        Die Mindmap erstellen Sie selbst — auf Papier oder einem Gerät. Bauen Sie sie aus dem Zentrum und diesen vier Ästen auf:
      </p>
      <ol className="mm-hinweis-aeste">
        {aeste.map((ast, i) => (
          <li key={i}>{ast.titel}{ast.optional && <span className="opt"> · optional</span>}</li>
        ))}
      </ol>
    </div>
  )
}

// Kompetenz-Sätze (verbatim aus nRLP): bevorzugt das SSR-aufgelöste `nrlp.kompetenzen`
// (alle nr_primary), Fallback auf den primären `kompetenz_text` — so erscheint die
// Kompetenz auch bei un-angereicherten Daten.
function kompetenzList(sit: SituationJson): { nr: string; text: string }[] {
  const resolved = sit.nrlp?.kompetenzen?.filter((k) => k && k.text)
  if (resolved && resolved.length) return resolved
  const text = sit.nrlp?.kompetenz_text
  return text ? [{ nr: sit.nrlp?.nr || '', text }] : []
}

// C6 — replaces SusMarker: Kompetenz(en) + Lebensbezug + Sprachmodi (full labels) metadata.
function HandlungsproduktMeta({ sit }: { sit: SituationJson }) {
  const kompetenzen = kompetenzList(sit)
  const lebensbezug = sit.nrlp?.lebensbezug_text
  const sprachmodi = (sit.nrlp?.sprachmodi || []).filter(Boolean)
  if (!kompetenzen.length && !lebensbezug && !sprachmodi.length) return null
  return (
    <div className="hp-meta">
      {kompetenzen.map((k, i) => (
        <div className="hp-meta-item hp-meta-komp" key={`k-${i}`}>
          <span className="hp-meta-label">{i === 0 ? (kompetenzen.length > 1 ? 'Kompetenzen' : 'Kompetenz') : ''}</span>
          <span>{k.nr && <span className="komp-nr">{k.nr}</span>} {k.text}</span>
        </div>
      ))}
      {lebensbezug && (
        <div className="hp-meta-item">
          <span className="hp-meta-label">Lebensbezug</span>
          <span>{lebensbezug}</span>
        </div>
      )}
      {sprachmodi.length > 0 && (
        <div className="hp-meta-item">
          <span className="hp-meta-label">Sprachmodi</span>
          <span>{sprachmodi.join(' · ')}</span>
        </div>
      )}
    </div>
  )
}

// C6 — Gütekriterien checklist from lernfortschritt.kriterien (☐ + kriterium + indikator; gewicht ignored).
function GuetekriterienListe({ sit }: { sit: SituationJson }) {
  const kriterien = sit.lernfortschritt?.kriterien?.filter((k) => k && (k.kriterium || k.indikator)) || []
  if (!kriterien.length) return null
  return (
    <section style={{ marginTop: '2mm' }}>
      <MiniTableLabel>Gütekriterien</MiniTableLabel>
      <ul className="guete-list">
        {kriterien.map((k, i) => (
          <li key={i}>
            <span className="check-box">☐</span>
            <span><strong>{k.kriterium}</strong>{k.indikator && <> — {k.indikator}</>}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

// C6 — Scaffolding: three labelled bullet groups (Satzanfänge · Strategien · Struktur).
function ScaffoldingBlock({ sit }: { sit: SituationJson }) {
  const sc = sit.handlungsprodukt?.scaffolding
  if (!sc) return null
  const groups: { label: string; items?: string[] }[] = [
    { label: 'Satzanfänge', items: sc.satzanfaenge },
    { label: 'Strategien', items: sc.strategien },
    { label: 'Struktur', items: sc.struktur },
  ].filter((g) => (g.items?.filter(Boolean).length || 0) > 0)
  if (!groups.length) return null
  return (
    <section style={{ marginTop: '1.5mm' }} className="scaffolding">
      <MiniTableLabel>Wie geht das?</MiniTableLabel>
      <div className="scaffolding-groups">
        {groups.map((g, i) => (
          <div className="scaffolding-group" key={i}>
            <div className="scaffolding-label">{g.label}</div>
            <ul>
              {g.items!.filter(Boolean).map((it, j) => <li key={j}>{it}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

function AbgabeCallout({ hp }: { hp: NonNullable<SituationJson['handlungsprodukt']> }) {
  const abgaben = hp.abgaben?.filter(Boolean) || []
  if (!hp.format && !abgaben.length) return null
  return (
    <div className="abgabe-callout">
      <div className="abgabe-label">Das liefern Sie ab</div>
      {hp.format && <div className="abgabe-format">{hp.format}</div>}
      {abgaben.length > 0 && (
        <ul className="abgabe-list">
          {abgaben.map((a, i) => <li key={i}>{a}</li>)}
        </ul>
      )}
    </div>
  )
}

// C6 — 6a Anleitung: metadata → beschreibung → Schritte → Abgabe → Gütekriterien → Scaffolding. No write area.
function HandlungsproduktAnleitung({ sit }: { sit: SituationJson }) {
  const hp = sit.handlungsprodukt
  if (!hp) return null
  return (
    <>
      <HandlungsproduktMeta sit={sit} />
      {hp.beschreibung && <p className="hp-intro">{hp.beschreibung}</p>}
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
      <AbgabeCallout hp={hp} />
      <GuetekriterienListe sit={sit} />
      <ScaffoldingBlock sit={sit} />
    </>
  )
}

function makePage(common: { sit: SituationJson; abteilung?: string; mode: 'info' | 'fill'; kompetenzNr?: string; abgedeckteKompetenzen?: string[] }) {
  const kompetenzNr = common.kompetenzNr || common.sit.nrlp?.nr
  const abgedeckteKompetenzen = common.abgedeckteKompetenzen || common.sit.nrlp?.nr_primary
  return ({ pageNum, pageTotal, children, bodyClass }: { pageNum: number; pageTotal: number; children: ReactNode; bodyClass?: string }) => (
    <A4Page
      sit={common.sit.buchstabe}
      abteilung={common.abteilung}
      docCode={`DOC-S · HF ${common.sit.buchstabe} · ${common.mode === 'info' ? 'DOSSIER' : 'AUFTRAG'}`}
      docTitel={common.sit.titel}
      sitLetter={common.sit.buchstabe}
      pageNum={pageNum}
      pageTotal={pageTotal}
      kompetenzNr={kompetenzNr}
      abgedeckteKompetenzen={abgedeckteKompetenzen}
    >
      <div className={bodyClass ? `a4-page-body ${bodyClass}` : 'a4-page-body'}>{children}</div>
    </A4Page>
  )
}

// Shared page-1 content: cockpit + merged situation + Checkliste + Ressourcen (C1/C2).
function CockpitPageBody({ sit }: { sit: SituationJson }) {
  return (
    <>
      <CockpitHead sit={sit} />
      <CockpitCards sit={sit} />
      <HandlungsproduktMeta sit={sit} />
      <div style={{ marginTop: '2mm' }}>
        <SituationBlock sit={sit} />
      </div>
      <ChecklisteVollstaendigkeit sit={sit} />
      <RessourcenList sit={sit} />
    </>
  )
}

function ebaRootClass(sit: SituationJson): string | undefined {
  return sit.lehrgang === 'EBA_2J' ? 'doc-eba' : undefined
}

function DocSInfo({ sit, abteilung, mode, kompetenzNr, abgedeckteKompetenzen }: DocSProps) {
  const Page = makePage({ sit, abteilung, mode, kompetenzNr, abgedeckteKompetenzen })
  let pageIdx = 0
  const nextPage = () => ++pageIdx
  const total = 4
  return (
    <div className={ebaRootClass(sit)} style={sitColors(sit)}>
      <Page pageNum={nextPage()} pageTotal={total} bodyClass="cockpit-page">
        <CockpitPageBody sit={sit} />
      </Page>
      <Page pageNum={nextPage()} pageTotal={total}>
        <SectionHead num="02 · Wissensecke">Leitfragen</SectionHead>
        {sit.leitfragen_intro && (
          <p style={{ fontSize: '9pt', color: 'var(--ink-soft)', maxWidth: '160mm', marginBottom: '3mm' }}>
            {sit.leitfragen_intro}
          </p>
        )}
        {sit.leitfragen?.map((lf, i) => (
          <LeitfrageItem key={i} lf={lf} withField={false} />
        ))}
        <SectionHead num="03 · Mindmap">{sit.mindmap_zentrum}</SectionHead>
        <MindmapHinweis sit={sit} />
      </Page>
      <Page pageNum={nextPage()} pageTotal={total} bodyClass="hp-anleitung-page">
        <SectionHead num="04 · Handlungsprodukt">{sit.handlungsprodukt?.titel}</SectionHead>
        <HandlungsproduktAnleitung sit={sit} />
      </Page>
      <Page pageNum={nextPage()} pageTotal={total}>
        <SectionHead num="05 · Selbstcheck">Reflexion</SectionHead>
        {sit.reflexion_fragen?.map((rf, i) => (
          <ReflexionItem key={i} rf={rf} withField={false} />
        ))}
      </Page>
    </div>
  )
}

function DocSFill({ sit, abteilung, mode, edits, onEdit, kompetenzNr, abgedeckteKompetenzen }: DocSProps) {
  const Page = makePage({ sit, abteilung, mode, kompetenzNr, abgedeckteKompetenzen })
  const lf = sit.leitfragen || []
  const eba = sit.lehrgang === 'EBA_2J'
  // Zwei Leitfragen pro Seite (EBA wie EFZ); EBA bekommt kleinere Schreibfelder,
  // damit beide Bloecke trotz groesserer Schrift auf eine A4-Seite passen.
  const lfFieldMm = eba ? 34 : 55
  const lfPairs: typeof lf[] = []
  for (let i = 0; i < lf.length; i += 2) lfPairs.push(lf.slice(i, i + 2))

  let pageIdx = 0
  const nextPage = () => ++pageIdx
  // C2/C6/C8: cockpit+situation (1) + Leitfragen pairs + Mindmap (1) + HP Anleitung (1) + HP Arbeitsfläche (1) + Reflexion (1)
  const actualTotal = 5 + lfPairs.length

  return (
    <div className={ebaRootClass(sit)} style={sitColors(sit)}>
      <Page pageNum={nextPage()} pageTotal={actualTotal} bodyClass="cockpit-page">
        <CockpitPageBody sit={sit} />
      </Page>
      {lfPairs.map((pair, pi) => (
        <Page key={`lfp-${pi}`} pageNum={nextPage()} pageTotal={actualTotal}>
          {pi === 0 ? (
            <>
              <SectionHead num="02 · Wissensecke">Leitfragen</SectionHead>
              {sit.leitfragen_intro && (
                <p style={{ fontSize: '10pt', color: 'var(--ink-soft)', maxWidth: '160mm', marginBottom: '5mm' }}>
                  {sit.leitfragen_intro}
                </p>
              )}
            </>
          ) : (
            <SectionHead num={`02 · Wissensecke (${pi + 1})`}>Leitfragen (Fortsetzung)</SectionHead>
          )}
          {pair.map((q, i) => (
            <LeitfrageItem key={i} lf={q} withField={true} edits={edits} onEdit={onEdit} fieldHeightMm={lfFieldMm} />
          ))}
        </Page>
      ))}
      <Page pageNum={nextPage()} pageTotal={actualTotal}>
        <SectionHead num="03 · Mindmap">{sit.mindmap_zentrum}</SectionHead>
        <MindmapSkelett sit={sit} />
      </Page>
      <Page pageNum={nextPage()} pageTotal={actualTotal} bodyClass="hp-anleitung-page">
        <SectionHead num="04 · Handlungsprodukt">{sit.handlungsprodukt?.titel}</SectionHead>
        <HandlungsproduktAnleitung sit={sit} />
      </Page>
      <Page pageNum={nextPage()} pageTotal={actualTotal} bodyClass="hp-arbeitsflaeche-page">
        <HandlungsFlaeche
          label={sit.handlungsprodukt?.schreib_label || 'HIER ERARBEITEN'}
          value={edits.handlungsprodukt || ''}
          onChange={(v) => onEdit('handlungsprodukt', v)}
        />
      </Page>
      <Page pageNum={nextPage()} pageTotal={actualTotal}>
        <SectionHead num="05 · Selbstcheck">Reflexion</SectionHead>
        {sit.reflexion_fragen?.map((rf, i) => (
          <ReflexionItem key={i} rf={rf} withField={true} edits={edits} onEdit={onEdit} fieldHeightMm={35} />
        ))}
      </Page>
    </div>
  )
}

export function DocS(props: DocSProps) {
  if (props.mode === 'info') return <DocSInfo {...props} />
  return <DocSFill {...props} />
}
