import type { ReactNode } from 'react'
import { A4Page, SectionHead } from './chrome'

/* ---------------------------------------------------------------------------
   DocEbaDossier — EBA-only Wissens-Dossier renderer (Renderer B, A4/Print).
   Additiv: nutzt das bestehende A4-Grundraster (A4Page) und legt die EBA-
   Prinzipien P1-P3 darueber. Wird nur fuer lehrgang === "EBA_2J" verwendet
   (Weiche in EinheitWorkbench). EFZ-Doc-Komponenten bleiben unberuehrt.

   Styling: Klassen mit Praefix `eba-` (Block in einheiten-renderer.css,
   siehe docs/eba/EBA_RENDER_HANDOFF.md). Das Wurzel-<div> traegt `doc-eba`,
   damit die EBA-Typografie (groesser, kurze Zeilen, linksbuendig) greift.

   Datenmodell: dossier.json (assets/dossier-template.json). Der Typ ist hier
   bewusst lokal + tolerant gehalten, damit die Komponente unabhaengig von
   einer types.ts-Aenderung kompiliert; beim Wiring kann auf einen zentralen
   DossierJson-Typ umgestellt werden.
--------------------------------------------------------------------------- */

export interface DossierNuggetFakt {
  behauptung?: string; wert?: string; quelle?: string
  validiert?: boolean; lp_pruefen?: boolean
}
export interface DossierNugget {
  id: string; tag: 'A' | 'B' | 'AB' | 'transfer' | string
  titel?: string; inhalt?: string; beispiel?: string
  fuer_leitfrage?: number[]; fakten_anker?: DossierNuggetFakt[]; glossar_refs?: string[]
}
export interface DossierScaffold {
  tag?: string; sm_id?: string; modus_label?: string
  satzanfaenge?: string[]; strategien?: string[]; struktur?: string[]; so_gehst_du_vor?: string[]
}
export interface DossierTransfer {
  fachsystematik?: string; prinzip_in_einfach?: string
  austausch_scaffolds?: { satzanfaenge?: string[]; so_tauschst_du_aus?: string[] }
}
export interface DossierGlossarEntry { id: string; begriff?: string; erklaerung_a2?: string; beispiel?: string }
export interface DossierJson {
  id: string; kompetenz_nr?: string; sprachniveau?: string
  nuggets?: DossierNugget[]
  sprachmodi_scaffolds?: DossierScaffold[]
  transfer_wissensblatt?: DossierTransfer
  glossar?: DossierGlossarEntry[]
}

export interface DocEbaDossierProps {
  dossier: DossierJson
  abteilung?: string
  kompetenzNr?: string
}

function nuggetCode(id: string): string {
  // nugget_A_01 -> A-01 ; nugget_B_03 -> B-03 ; fallback: id
  const m = id.match(/_([AB])_?0*?(\d+)$/i)
  return m ? `${m[1].toUpperCase()}-${m[2].padStart(2, '0')}` : id
}

function FaktLine({ fa }: { fa: DossierNuggetFakt }) {
  if (fa.validiert) return <span className="eba-fakt-ok">✓ geprueft{fa.quelle ? ` · ${fa.quelle}` : ''}</span>
  if (fa.lp_pruefen) return <span className="eba-fakt-pruef">⚠ LP pruefen{fa.wert ? `: ${fa.wert}` : ''}</span>
  return null
}

function NuggetCard({ n }: { n: DossierNugget }) {
  const tag = n.tag === 'A' || n.tag === 'B' ? n.tag : 'ab'
  const fakten = (n.fakten_anker || []).filter((f) => f.validiert || f.lp_pruefen)
  return (
    <div className={`eba-nugget tag-${String(tag).toLowerCase()}`}>
      <div className="eba-nugget-top">
        <span className="eba-ncode">{nuggetCode(n.id)}</span>
        <h3>{n.titel}</h3>
      </div>
      {n.inhalt && <p>{n.inhalt}</p>}
      {n.beispiel && <div className="eba-bsp"><b>Beispiel:</b> {n.beispiel}</div>}
      {fakten.length > 0 && (
        <div className="eba-fakt">{fakten.map((fa, i) => <FaktLine key={i} fa={fa} />)}</div>
      )}
    </div>
  )
}

function ScaffoldCard({ sc }: { sc: DossierScaffold }) {
  return (
    <div className={`eba-scaffold-card tag-${String(sc.tag || '').toLowerCase()}`}>
      <h3>Herausforderung {sc.tag} — {sc.modus_label || sc.sm_id}</h3>
      {sc.satzanfaenge?.filter(Boolean).length ? (
        <>
          <div className="eba-scaffold-label">Satzanfaenge</div>
          <ul>{sc.satzanfaenge!.filter(Boolean).map((s, i) => <li key={i}>{s}</li>)}</ul>
        </>
      ) : null}
      {sc.so_gehst_du_vor?.filter(Boolean).length ? (
        <ol className="eba-schritte">
          {sc.so_gehst_du_vor!.filter(Boolean).map((s, i) => (
            <li key={i}><span className="eba-schritt-n">{i + 1}</span><span>{s.replace(/^\d+\.\s*/, '')}<em className="eba-of">Schritt {i + 1} von {sc.so_gehst_du_vor!.length}</em></span></li>
          ))}
        </ol>
      ) : null}
    </div>
  )
}

function Section({ children }: { children: ReactNode }) {
  return <div className="a4-page-body doc-eba">{children}</div>
}

export function DocEbaDossier({ dossier, abteilung, kompetenzNr }: DocEbaDossierProps) {
  const nuggets = dossier.nuggets || []
  const aN = nuggets.filter((n) => n.tag === 'A')
  const bN = nuggets.filter((n) => n.tag === 'B')
  const rest = nuggets.filter((n) => n.tag !== 'A' && n.tag !== 'B')
  const scaffolds = dossier.sprachmodi_scaffolds || []
  const tw = dossier.transfer_wissensblatt
  const glossar = dossier.glossar || []
  const komp = kompetenzNr || dossier.kompetenz_nr
  const total = 3

  const page = (n: number, code: string, titel: string, children: ReactNode) => (
    <A4Page docCode={code} docTitel={titel} pageNum={n} pageTotal={total} kompetenzNr={komp} abteilung={abteilung}>
      <Section>{children}</Section>
    </A4Page>
  )

  return (
    <div className="doc-eba-root">
      {page(1, 'DOSSIER · Wissen', 'Wissens-Dossier', (
        <>
          <SectionHead num="D1">Dein Wissens-Dossier</SectionHead>
          <div className="eba-dossier-intro">
            <p><strong>So benutzt du das Dossier:</strong> Du musst es nicht von vorne lesen. Wenn du bei einer Frage haengst, schau bei dem Anker nach, der dort steht — zum Beispiel «Nugget A-02». Fachbegriffe findest du im Glossar.</p>
          </div>
          {aN.map((n) => <NuggetCard key={n.id} n={n} />)}
          {bN.map((n) => <NuggetCard key={n.id} n={n} />)}
          {rest.map((n) => <NuggetCard key={n.id} n={n} />)}
        </>
      ))}

      {page(2, 'DOSSIER · Sprachhilfe', 'So schreibst du', (
        <>
          <SectionHead num="D2">So schreibst du Schritt fuer Schritt</SectionHead>
          {scaffolds.map((sc, i) => <ScaffoldCard key={i} sc={sc} />)}
          {tw && (
            <div className="eba-transfer">
              <h3>Das Grundprinzip</h3>
              {tw.prinzip_in_einfach && <p className="eba-lead">{tw.prinzip_in_einfach}</p>}
              {tw.fachsystematik && <p>{tw.fachsystematik}</p>}
              {tw.austausch_scaffolds?.satzanfaenge?.filter(Boolean).length ? (
                <>
                  <div className="eba-scaffold-label">Austausch — Satzanfaenge</div>
                  <ul>{tw.austausch_scaffolds.satzanfaenge!.filter(Boolean).map((s, i) => <li key={i}>{s}</li>)}</ul>
                </>
              ) : null}
            </div>
          )}
        </>
      ))}

      {page(3, 'DOSSIER · Glossar', 'Glossar', (
        <>
          <SectionHead num="D3">Glossar — schwierige Woerter einfach erklaert</SectionHead>
          <div className="eba-glossar">
            {glossar.map((g) => (
              <div className="eba-gloss" key={g.id}>
                <span className="eba-gloss-b">{g.begriff}</span> — <span className="eba-gloss-e">{g.erklaerung_a2}</span>
                {g.beispiel && <span className="eba-gloss-x"> Bsp.: {g.beispiel}</span>}
              </div>
            ))}
          </div>
        </>
      ))}
    </div>
  )
}
