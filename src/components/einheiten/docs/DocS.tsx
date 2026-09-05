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
        isV3(sit) ? (
          /* v3: die Herausforderung ist die Ansage der Seite, nicht ein Badge daneben.
             Uppercase entfällt bewusst — bei 12.5pt liest sich der Originaltext besser. */
          <div style={{
            marginBottom: '3mm',
            width: '100%',
            background: 'var(--sit-light)',
            borderLeft: '1.5mm solid var(--sit-akzent)',
            padding: '3mm 4mm',
            fontSize: '12.5pt',
            fontWeight: 700,
            lineHeight: 1.35,
            color: 'var(--ink)',
          }}>{sit.herausforderung.label}</div>
        ) : (
          <div className="badge-row" style={{ marginBottom: '3mm' }}>
            <span className="herausforderung">{sit.herausforderung.label}</span>
          </div>
        )
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

/**
 * Layoutschalter. Einzige Quelle für die Seitenaufteilung ist `template` —
 * nie `status` oder ein anderes Feld. Fehlt das Feld oder trägt es einen
 * anderen Wert, gilt v2 (Checkliste auf Seite 1).
 */
function isV3(sit: SituationJson): boolean {
  return sit.template === 'default_4page_v3'
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
          </tr>
        </thead>
        <tbody>
          {sit.bewertungsraster.map((b, i) => {
            const bullets = b.vollstaendig_wenn?.filter(Boolean) || []
            const lines = bullets.length > 0 ? bullets : (b.kriterium ? [b.kriterium] : [])
            return (
              <tr key={i}>
                <td><strong>{b.produkt}</strong></td>
                <td>
                  <ul className="checkliste-krit">
                    {lines.map((v, j) => (
                      <li key={j}>
                        <span className="krit-check" aria-hidden="true">✔</span>
                        <span className="krit-text">{v}</span>
                        <span className="krit-box" aria-hidden="true">☐</span>
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </section>
  )
}

// E3 — Auftakt-Typ: benennt, wozu das leitfragen_intro dient. Feld-präsenz-gesteuert —
// ohne `auftakt_typ` bleibt alles wie bisher (nackter Intro-Absatz auf Seite 2).
const AUFTAKT_LABEL: Record<NonNullable<SituationJson['auftakt_typ']>, string> = {
  vorbereitung: 'Auftakt · Vorbereitung',
  kontext: 'Auftakt · Kontext',
  pfad: 'Auftakt · Pfad durch die Leitfragen',
}

// `vorbereitung` — das Intro gehört vor die Arbeit, also auf Seite 1. Schlank gehalten
// (Linksregel statt Rahmen, 2 mm Padding): dort sind unter v3 nur ~220 px Luft.
function AuftaktKasten({ sit }: { sit: SituationJson }) {
  if (sit.auftakt_typ !== 'vorbereitung' || !sit.leitfragen_intro) return null
  return (
    <section style={{
      marginTop: '3mm',
      borderLeft: '0.6mm solid var(--sit-akzent)',
      paddingLeft: '2mm',
    }}>
      <MiniTableLabel>{AUFTAKT_LABEL.vorbereitung}</MiniTableLabel>
      <p style={{ margin: 0, fontSize: '9pt', lineHeight: 1.45 }}>{sit.leitfragen_intro}</p>
    </section>
  )
}

// Intro auf Seite 2. Ohne `auftakt_typ` exakt der bisherige Absatz; `kontext`/`pfad`
// bekommen NUR eine Beschriftungszeile davor (kein Rahmen — Seite 2 hat kaum Luft);
// `vorbereitung` steht stattdessen als Kasten auf Seite 1 und entfällt hier.
function LeitfragenIntro({ sit, fontSize, marginBottom }: { sit: SituationJson; fontSize: string; marginBottom: string }) {
  if (!sit.leitfragen_intro || sit.auftakt_typ === 'vorbereitung') return null
  const label = sit.auftakt_typ ? AUFTAKT_LABEL[sit.auftakt_typ] : null
  return (
    <>
      {label && <MiniTableLabel>{label}</MiniTableLabel>}
      <p style={{ fontSize, color: 'var(--ink-soft)', maxWidth: '160mm', marginBottom }}>
        {sit.leitfragen_intro}
      </p>
    </>
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

// EBA-only — Infokarten-Brücke: zeigt auf der Herausforderung die zugehörigen Glossar+-
// Info-Karten mit demselben Badge-Stil wie im Glossar+ (optische Verbindung Auftrag ↔ Wissen).
// Quelle: quellen_anker[].nugget_ref (z. B. "Info-Karte A-01"); Fallback auf leitfragen[].knoten_ref.
function InfokartenAnker({ sit }: { sit: SituationJson }) {
  if (sit.lehrgang !== 'EBA_2J') return null
  const fromAnker = (sit.quellen_anker || []).map((q) => q.nugget_ref).filter(Boolean) as string[]
  const fromLf = (sit.leitfragen || [])
    .map((lf) => lf.knoten_ref?.split('|').pop()?.trim())
    .filter((s): s is string => !!s && /Info-Karte/i.test(s))
  const codes = Array.from(new Set([...fromAnker, ...fromLf]))
  if (!codes.length) return null
  return (
    <section className="eba-infokarten">
      <div className="eba-infokarten-label">Dazu passen diese Info-Karten im Glossar+</div>
      <div className="eba-infokarten-codes">
        {codes.map((c, i) => <span className="eba-ncode" key={i}>{c}</span>)}
      </div>
    </section>
  )
}

// C2 — Situation block: situation_text + Leitfrage (+ Spannungsfeld). sit-meta + zahlen_tabelle removed.
function SituationBlock({ sit }: { sit: SituationJson }) {
  // v3: Die Situation ist der narrative Kern der Seite und bekommt eine eigene
  // gerahmte Karte (weiss, Akzentrahmen, groessere Schrift) — sie steht damit
  // gleichwertig neben dem Statement-Block, statt als Fliesstext unterzugehen.
  const sitText = isV3(sit) ? (
    <div style={{
      position: 'relative',
      border: '0.4mm solid var(--sit-akzent)',
      borderRadius: '1mm',
      padding: '2.5mm 3mm',
      margin: '1.5mm 0 3mm',
    }}>
      {/* Fieldset-Label auf dem Rahmen — kostet keine eigene Zeile. */}
      <span style={{
        position: 'absolute', top: '-2.5mm', left: '3mm', background: '#fff',
        padding: '0 1.5mm', fontSize: '7pt', fontWeight: 700, letterSpacing: '0.08em',
        textTransform: 'uppercase', color: 'var(--sit-akzent)',
      }}>Situation</span>
      <p className="sit-text" style={{ fontSize: '10pt', lineHeight: 1.45, margin: 0 }}>{sit.situation_text}</p>
    </div>
  ) : (
    <p className="sit-text">{sit.situation_text}</p>
  )
  return (
    <>
      {sitText}
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
  /** Namensraum der Herausforderung, z. B. «hfA_» — siehe editNs(). */
  ns?: string
}

type LeitfrageScaffolding = NonNullable<NonNullable<SituationJson['leitfragen']>[number]['scaffolding']>

/** Guillemets nur setzen, wenn die Daten sie nicht schon mitbringen. */
function inGuillemets(s: string): string {
  return /^«.*»$/.test(s.trim()) ? s.trim() : `«${s.trim()}»`
}

function railGruppen(sc: LeitfrageScaffolding) {
  return {
    strategien: sc.strategien?.filter(Boolean) || [],
    satzanfaenge: sc.satzanfaenge?.filter(Boolean) || [],
    produkt: sc.produkt?.trim() || '',
  }
}

function hatRailInhalt(sc: LeitfrageScaffolding | undefined): sc is LeitfrageScaffolding {
  if (!sc) return false
  const g = railGruppen(sc)
  return !!(g.strategien.length || g.satzanfaenge.length || g.produkt)
}

/**
 * Schmale rechte Spalte neben einer Leitfrage — die Schreibhilfe für genau
 * diesen Denkschritt. Feld-präsenz-gesteuert: ohne `lf.scaffolding` existiert
 * die Spalte nicht und das LF-Item bleibt einspaltig wie bisher.
 */
function LeitfrageRail({ sc }: { sc: LeitfrageScaffolding }) {
  const { strategien, satzanfaenge, produkt } = railGruppen(sc)
  return (
    <aside style={{
      flex: '0 0 22%',
      display: 'flex',
      flexDirection: 'column',
      gap: '4mm',
      fontSize: '7.5pt',
      lineHeight: 1.35,
      color: 'var(--ink-mute)',
    }}>
      {strategien.length > 0 && (
        <div>
          <MiniTableLabel>So gehen Sie vor</MiniTableLabel>
          <ul style={{ margin: 0, paddingLeft: '3.5mm' }}>
            {strategien.map((s, i) => <li key={i} style={{ marginBottom: '0.8mm' }}>{s}</li>)}
          </ul>
        </div>
      )}
      {satzanfaenge.length > 0 && (
        <div>
          <MiniTableLabel>Satzanfänge</MiniTableLabel>
          <div style={{ fontStyle: 'italic' }}>
            {satzanfaenge.map((s, i) => (
              <div key={i} style={{ marginBottom: '0.8mm' }}>{inGuillemets(s)}</div>
            ))}
          </div>
        </div>
      )}
      {produkt && (
        <div>
          <MiniTableLabel>Ins Produkt</MiniTableLabel>
          <div>{produkt}</div>
        </div>
      )}
    </aside>
  )
}

/**
 * Dieselben Gruppen wie in der Rail, aber unter der Frage und ueber die volle
 * Breite in bis zu drei Spalten.
 *
 * Warum es die zweite Variante gibt: im Dossier stehen alle vier Leitfragen auf
 * EINER Seite. Neben der Frage macht die 22%-Rail jeden Block so hoch wie ihr
 * laengster Text — links bleibt die halbe Spalte leer, und ab LF4 lief die Seite
 * ueber die A4-Kante (LF4 und die Mindmap-Sektion fielen ersatzlos weg, gesehen
 * am 2026-09-04). Nebeneinander gelegt braucht dasselbe Material rund ein Drittel
 * der Hoehe. Im Fuell-Dokument bleibt die Rail, dort stehen nur zwei Leitfragen
 * pro Seite und darunter das Schreibfeld.
 */
function LeitfrageScaffoldUnten({ sc }: { sc: LeitfrageScaffolding }) {
  const { strategien, satzanfaenge, produkt } = railGruppen(sc)
  const spalten = [
    strategien.length > 0 && (
      <div key="strategien">
        <MiniTableLabel>So gehen Sie vor</MiniTableLabel>
        <ul style={{ margin: 0, paddingLeft: '3.5mm' }}>
          {strategien.map((t, i) => <li key={i} style={{ marginBottom: '0.8mm' }}>{t}</li>)}
        </ul>
      </div>
    ),
    satzanfaenge.length > 0 && (
      <div key="satzanfaenge">
        <MiniTableLabel>Satzanfänge</MiniTableLabel>
        <div style={{ fontStyle: 'italic' }}>
          {satzanfaenge.map((t, i) => <div key={i} style={{ marginBottom: '0.8mm' }}>{inGuillemets(t)}</div>)}
        </div>
      </div>
    ),
    produkt && (
      <div key="produkt">
        <MiniTableLabel>Ins Produkt</MiniTableLabel>
        <div>{produkt}</div>
      </div>
    ),
  ].filter(Boolean)
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${spalten.length}, 1fr)`,
      gap: '5mm',
      marginTop: '1.5mm',
      paddingTop: '1.2mm',
      borderTop: '0.3mm solid var(--rule)',
      fontSize: '7.5pt',
      lineHeight: 1.35,
      color: 'var(--ink-mute)',
    }}>
      {spalten}
    </div>
  )
}

function LeitfrageItem({ lf, withField, edits = {}, onEdit = () => {}, fieldHeightMm, ns = '', letzteImPaar = false, scaffoldUnten = false }: LeitfrageItemProps & { letzteImPaar?: boolean; scaffoldUnten?: boolean }) {
  const kern = (
    <>
      <div className="lf-head">
        <div className="lf-nr">LF{lf.nr}</div>
        <div className="lf-text">
          <p>{lf.text}</p>
          <div className="lf-meta">
            <Badge variant="outline">{lf.bloom}</Badge>
            <span className="source-ref">{lf.knoten_ref}</span>
            {/* Additiv: benennt den Baustein des Handlungsprodukts. Ohne `liefert` bleibt die Meta-Zeile unverändert. */}
            {lf.liefert && (
              <span style={{ fontSize: '7.5pt', color: 'var(--ink-mute)', fontStyle: 'italic' }}>
                → liefert: {lf.liefert}
              </span>
            )}
          </div>
        </div>
      </div>
      {withField && (
        <Schreibfeld
          heightMm={fieldHeightMm || lf.feld_hoehe_mm || 15}
          value={edits[`${ns}lf_${lf.nr}`] || ''}
          onChange={(v) => onEdit(`${ns}lf_${lf.nr}`, v)}
        />
      )}
    </>
  )
  if (!hatRailInhalt(lf.scaffolding)) return <div className="lf-item">{kern}</div>
  if (scaffoldUnten) {
    return (
      // 3mm statt der 6mm der Rail-Variante: hier stehen vier Bloecke auf einer Seite.
      <div className="lf-item" style={{ marginBottom: letzteImPaar ? 0 : '3mm' }}>
        {kern}
        <LeitfrageScaffoldUnten sc={lf.scaffolding} />
      </div>
    )
  }
  return (
    // 6mm Luft nur ZWISCHEN den LF-Bloecken — nach dem letzten wuerde sie nur die A4-Kante anschneiden.
    <div className="lf-item" style={{ display: 'flex', gap: '4mm', alignItems: 'flex-start', marginBottom: letzteImPaar ? 0 : '6mm' }}>
      <div style={{ flex: '1 1 78%', minWidth: 0 }}>{kern}</div>
      <LeitfrageRail sc={lf.scaffolding} />
    </div>
  )
}

interface ReflexionItemProps {
  rf: NonNullable<SituationJson['reflexion_fragen']>[number]
  withField: boolean
  edits?: Record<string, string>
  onEdit?: (k: string, v: string) => void
  fieldHeightMm?: number
  /** Namensraum der Herausforderung, z. B. «hfA_» — siehe editNs(). */
  ns?: string
}

function ReflexionItem({ rf, withField, edits = {}, onEdit = () => {}, fieldHeightMm, ns = '' }: ReflexionItemProps) {
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
          value={edits[`${ns}rf_${rf.nr}`] || ''}
          onChange={(v) => onEdit(`${ns}rf_${rf.nr}`, v)}
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
  // Die Aeste sitzen als 3x3-Grid-Items in den Eckzellen, jeweils an der zur Mitte
  // zeigenden Zellecke ausgerichtet. Diese Ecken liegen immer bei 1/3 bzw. 2/3 der
  // Flaeche — unabhaengig davon, wie gross der Text eine Box macht. Darum enden die
  // Linien hier auf denselben Werten und treffen die Box in jeder Groesse.
  const lineEnds = [
    { x2: 100 / 3, y2: 100 / 3 },
    { x2: 200 / 3, y2: 100 / 3 },
    { x2: 100 / 3, y2: 200 / 3 },
    { x2: 200 / 3, y2: 200 / 3 },
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
          {full && ast.punkte && <ul>{ast.punkte.map((p, j) => <li key={j}>{p}</li>)}</ul>}
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

// 05 · Methoden — Werkzeugseite: vier feste Felder im 2×2-Raster, gegenüber der
// Arbeitsfläche. Rendert ausschliesslich aus `sit.methoden`; ohne das Feld gibt es
// die Seite nicht (siehe hatMethoden in DocSFill).
// Angereichert = trägt Musterbeispiel und/oder Fehlerhinweis. Entscheidet über die
// Rasterzeile, nicht die Herkunft: Die untere Reihe bekommt den freien Platz (min-content
// oben, 1fr unten), also müssen die schweren Karten dort landen. Stabile Sortierung, damit
// die Reihenfolge innerhalb der beiden Gruppen so bleibt, wie sie in den Daten steht.
function istAngereichert(m: NonNullable<SituationJson['methoden']>[number]): boolean {
  return !!(m.beispiel?.length || m.fehler)
}

function MethodenGrid({ sit }: { sit: SituationJson }) {
  const items = (sit.methoden || []).filter(Boolean)
    .slice()
    .sort((a, b) => Number(istAngereichert(a)) - Number(istAngereichert(b)))
  if (!items.length) return null
  return (
    <div className="methoden-grid">
      {items.map((m, i) => (
        <div className={m.quelle === 'hko' ? 'methode-box hko' : 'methode-box'} key={i}>
          <div className="methode-head">
            <span className="methode-nr">{i + 1}</span>
            <span className="methode-name">{m.name}</span>
          </div>
          <div className="methode-src">
            {m.quelle === 'lehrmittel'
              ? `▣ Lehrmittel Kap. ${m.kap ?? ''}${m.seiten ? ` · ${m.seiten}` : ''}`
              : 'Methodenkarte · nicht im Lehrmittel'}
          </div>
          {m.fuer && <div className="methode-fuer">{m.fuer}</div>}
          {m.quelle === 'lehrmittel' ? (
            <>
              {m.lesen && (
                <div className="methode-block">
                  <div className="methode-lab">Lesen</div>
                  <div className="methode-txt">{m.lesen}</div>
                </div>
              )}
              {m.tun && (
                <div className="methode-block">
                  <div className="methode-lab">Damit tun Sie</div>
                  <div className="methode-txt">{m.tun}</div>
                </div>
              )}
            </>
          ) : (
            <>
              {!!m.schritte?.length && (
                <div className="methode-block">
                  <div className="methode-lab">So geht das</div>
                  <div className="methode-txt">
                    {m.schritte.filter(Boolean).map((s, j) => (
                      <span key={j}><strong>{j + 1}</strong>{' '}{s}{' '}</span>
                    ))}
                  </div>
                </div>
              )}
              {m.ankommt && (
                <div className="methode-block">
                  <div className="methode-lab">Worauf es ankommt</div>
                  <div className="methode-txt">{m.ankommt}</div>
                </div>
              )}
            </>
          )}
          {!!m.beispiel?.length && (
            <div className="methode-beispiel">
              <div className="methode-lab">So sieht das aus</div>
              {m.beispiel.filter(Boolean).map((z, j) => (
                <div className="methode-bsp-zeile" key={j}>{z}</div>
              ))}
            </div>
          )}
          {m.fehler && (
            <div className="methode-block methode-fehler">
              <div className="methode-lab">Typischer Fehler</div>
              <div className="methode-txt">{m.fehler}</div>
            </div>
          )}
          {m.merk && <div className="methode-merk">{m.merk}</div>}
        </div>
      ))}
    </div>
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

interface PageCommon {
  sit: SituationJson
  abteilung?: string
  mode: 'info' | 'fill'
  kompetenzNr?: string
  abgedeckteKompetenzen?: string[]
}

/**
 * Seitenrahmen für DOC-S.
 *
 * Bewusst eine Komponente auf Modulebene und KEINE Factory, die im Render-Body
 * eine neue Komponente erzeugt. React vergleicht Elementtypen per Referenz: eine
 * pro Render neu gebaute Funktion ist jedes Mal ein anderer Typ, worauf React
 * den gesamten Teilbaum aus- und wieder einhängt. In der Workbench hat das bei
 * jedem Tastenanschlag alle DOM-Knoten des Dokuments ersetzt — Cursor und
 * Scrollposition gingen verloren, die Ansicht sprang zurück auf Seite 1.
 * `common` als Prop durchzureichen kostet nur ein Re-Render, kein Remount.
 */
function DocSPage({
  common,
  pageNum,
  pageTotal,
  children,
  bodyClass,
}: { common: PageCommon; pageNum: number; pageTotal: number; children: ReactNode; bodyClass?: string }) {
  const kompetenzNr = common.kompetenzNr || common.sit.nrlp?.nr
  const abgedeckteKompetenzen = common.abgedeckteKompetenzen || common.sit.nrlp?.nr_primary
  return (
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
      <AuftaktKasten sit={sit} />
      {/* v3: Checkliste wandert auf die Selbstcheck-Seite (vor die Reflexion). */}
      {!isV3(sit) && <ChecklisteVollstaendigkeit sit={sit} />}
      <RessourcenList sit={sit} />
      <InfokartenAnker sit={sit} />
    </>
  )
}

function ebaRootClass(sit: SituationJson): string | undefined {
  return sit.lehrgang === 'EBA_2J' ? 'doc-eba' : undefined
}

/**
 * Namensraum für die Eingabe-Keys einer Herausforderung.
 *
 * Die Workbench hält EIN gemeinsames `edits`-Objekt über alle Dokumente. Ohne
 * diesen Präfix greifen HF A, B und C auf denselben Schlüssel `lf_1` zu — was in
 * A getippt wurde, erschien dann auch in B und C. Andere Dokumenttypen haben
 * eigene Präfixe (austausch_*, transfer, ws_wahl …) und kollidieren nicht.
 */
function editNs(sit: SituationJson): string {
  return `hf${sit.buchstabe || '?'}_`
}

function DocSInfo({ sit, abteilung, mode, kompetenzNr, abgedeckteKompetenzen }: DocSProps) {
  const common: PageCommon = { sit, abteilung, mode, kompetenzNr, abgedeckteKompetenzen }
  let pageIdx = 0
  const nextPage = () => ++pageIdx
  const total = 4
  return (
    <div className={ebaRootClass(sit)} style={sitColors(sit)}>
      <DocSPage common={common} pageNum={nextPage()} pageTotal={total} bodyClass="cockpit-page">
        <CockpitPageBody sit={sit} />
      </DocSPage>
      <DocSPage common={common} pageNum={nextPage()} pageTotal={total}>
        <SectionHead num="02 · Wissensecke">Leitfragen</SectionHead>
        <LeitfragenIntro sit={sit} fontSize="9pt" marginBottom="3mm" />
        {sit.leitfragen?.map((lf, i) => (
          <LeitfrageItem key={i} lf={lf} withField={false} scaffoldUnten />
        ))}
        <SectionHead num="03 · Mindmap">{sit.mindmap_zentrum}</SectionHead>
        <MindmapHinweis sit={sit} />
      </DocSPage>
      <DocSPage common={common} pageNum={nextPage()} pageTotal={total} bodyClass="hp-anleitung-page">
        <SectionHead num="04 · Handlungsprodukt">{sit.handlungsprodukt?.titel}</SectionHead>
        <HandlungsproduktAnleitung sit={sit} />
      </DocSPage>
      <DocSPage common={common} pageNum={nextPage()} pageTotal={total}>
        <SectionHead num="05 · Selbstcheck">Reflexion</SectionHead>
        {/* v3: erst Vollständigkeit prüfen, dann reflektieren. */}
        {isV3(sit) && <ChecklisteVollstaendigkeit sit={sit} />}
        {sit.reflexion_fragen?.map((rf, i) => (
          <ReflexionItem key={i} rf={rf} withField={false} />
        ))}
      </DocSPage>
    </div>
  )
}

function DocSFill({ sit, abteilung, mode, edits, onEdit, kompetenzNr, abgedeckteKompetenzen }: DocSProps) {
  const common: PageCommon = { sit, abteilung, mode, kompetenzNr, abgedeckteKompetenzen }
  const ns = editNs(sit)
  const lf = sit.leitfragen || []
  const eba = sit.lehrgang === 'EBA_2J'
  // Zwei Leitfragen pro Seite (EBA wie EFZ); EBA bekommt kleinere Schreibfelder,
  // damit beide Bloecke trotz groesserer Schrift auf eine A4-Seite passen.
  // v3: eine Schreiblinie weniger (51 → 8 statt 9 Linien) — die 82%-Hauptspalte
  // neben der Scaffolding-Rail bricht die Fragetexte eine Zeile mehr um, sonst
  // kippt die Seite mit langem leitfragen_intro über die A4-Kante.
  const lfFieldMm = eba ? 34 : isV3(sit) ? 51 : 55
  const lfPairs: typeof lf[] = []
  for (let i = 0; i < lf.length; i += 2) lfPairs.push(lf.slice(i, i + 2))

  let pageIdx = 0
  const nextPage = () => ++pageIdx
  // C2/C6/C8: cockpit+situation (1) + Leitfragen pairs + Mindmap (1) + HP Anleitung (1) + HP Arbeitsfläche (1) + Reflexion (1)
  // Werkzeugseite: nur wenn Methoden-Daten vorliegen. Ohne sie bleibt alles exakt wie bisher
  // (7 Seiten, Selbstcheck = 05); mit ihnen schiebt sich «05 · Methoden» zwischen Anleitung
  // und Arbeitsfläche, sodass die Werkzeuge im gehefteten Heft dem Schreibfeld gegenüberliegen.
  const hatMethoden = (sit.methoden?.length ?? 0) > 0
  const actualTotal = 5 + lfPairs.length + (hatMethoden ? 1 : 0)

  return (
    <div className={ebaRootClass(sit)} style={sitColors(sit)}>
      <DocSPage common={common} pageNum={nextPage()} pageTotal={actualTotal} bodyClass="cockpit-page">
        <CockpitPageBody sit={sit} />
      </DocSPage>
      {lfPairs.map((pair, pi) => (
        <DocSPage common={common} key={`lfp-${pi}`} pageNum={nextPage()} pageTotal={actualTotal}>
          {pi === 0 ? (
            <>
              <SectionHead num="02 · Wissensecke">Leitfragen</SectionHead>
              <LeitfragenIntro sit={sit} fontSize="10pt" marginBottom="5mm" />
            </>
          ) : (
            <SectionHead num={`02 · Wissensecke (${pi + 1})`}>Leitfragen (Fortsetzung)</SectionHead>
          )}
          {pair.map((q, i) => (
            <LeitfrageItem key={i} lf={q} withField={true} edits={edits} onEdit={onEdit} ns={ns} fieldHeightMm={lfFieldMm} letzteImPaar={i === pair.length - 1} />
          ))}
        </DocSPage>
      ))}
      <DocSPage common={common} pageNum={nextPage()} pageTotal={actualTotal} bodyClass="mindmap-page">
        <SectionHead num="03 · Mindmap">{sit.mindmap_zentrum}</SectionHead>
        <MindmapSkelett sit={sit} />
      </DocSPage>
      <DocSPage common={common} pageNum={nextPage()} pageTotal={actualTotal} bodyClass="hp-anleitung-page">
        <SectionHead num="04 · Handlungsprodukt">{sit.handlungsprodukt?.titel}</SectionHead>
        <HandlungsproduktAnleitung sit={sit} />
      </DocSPage>
      {hatMethoden && (
        <DocSPage common={common} pageNum={nextPage()} pageTotal={actualTotal} bodyClass="methoden-page">
          <SectionHead num="05 · Methoden">Womit Sie das herstellen</SectionHead>
          <p className="methoden-intro">
            Vier Werkzeuge, vier Felder. Wo ein Kapitel steht, schlagen Sie im Lehrmittel nach —
            hier steht, was Sie damit für diese Abgabe machen. Die übrigen Felder stehen für sich.
          </p>
          <MethodenGrid sit={sit} />
        </DocSPage>
      )}
      <DocSPage common={common} pageNum={nextPage()} pageTotal={actualTotal} bodyClass="hp-arbeitsflaeche-page">
        <HandlungsFlaeche
          label={sit.handlungsprodukt?.schreib_label || 'HIER ERARBEITEN'}
          value={edits[`${ns}handlungsprodukt`] || ''}
          onChange={(v) => onEdit(`${ns}handlungsprodukt`, v)}
        />
      </DocSPage>
      <DocSPage common={common} pageNum={nextPage()} pageTotal={actualTotal}>
        {/* Nummer rückt nach, wenn die Werkzeugseite 05 belegt — ohne Methoden bleibt es 05. */}
        <SectionHead num={hatMethoden ? '06 · Selbstcheck' : '05 · Selbstcheck'}>Reflexion</SectionHead>
        {/* v3: erst Vollständigkeit prüfen, dann reflektieren. */}
        {isV3(sit) && <ChecklisteVollstaendigkeit sit={sit} />}
        {/* Unter v3 teilt sich die Seite mit der Checkliste. Am gerenderten Bogen gemessen:
            nur 3 Schreiblinien bleiben überlauffrei. Schreibfeld (chrome.tsx) rechnet
            minRows = max(3, ceil(mm/8.5) + 2) — 8 mm ist der grösste Wert, der noch 3 ergibt. */}
        {sit.reflexion_fragen?.map((rf, i) => (
          <ReflexionItem key={i} rf={rf} withField={true} edits={edits} onEdit={onEdit} ns={ns} fieldHeightMm={isV3(sit) ? 8 : 35} />
        ))}
      </DocSPage>
    </div>
  )
}

export function DocS(props: DocSProps) {
  if (props.mode === 'info') return <DocSInfo {...props} />
  return <DocSFill {...props} />
}
