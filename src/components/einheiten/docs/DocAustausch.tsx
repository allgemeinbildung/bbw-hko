import { A4Page, Schreibfeld, SectionHead, sitColors } from './chrome'
import type { SituationJson, SetJson } from '../../../lib/einheiten/types'

// C8 — Standalone set-level "Austausch & Transfer" document (two pages).
//   Page 1 — Austausch: vergleicht die drei Lösungen; drei Sozialformen (EA/GA/PL) mit Notizfeldern.
//   Page 2 — Transfer: Einzel-Transfer mit Schreibhilfe + Selbstcheck.

export interface DocAustauschProps {
  set: SetJson | null
  sits: (SituationJson | null)[]
  abteilung?: string
  edits: Record<string, string>
  onEdit: (key: string, value: string) => void
}

// Transfer is a template-constant set task → generic writing scaffold + self-check.
const TRANSFER_SATZANFAENGE = [
  '«Das gemeinsame Prinzip meiner drei Herausforderungen ist …»',
  '«Ein neuer Kontext, in dem dasselbe Prinzip gilt, ist …»',
  '«Dort zeigt es sich konkret so: …»',
  '«Wie in Herausforderung … muss ich auch hier …»',
]
const TRANSFER_CHECKLISTE = [
  'Kernprinzip in eigenen Worten benannt',
  'Neuer, selbst gewählter Kontext (nicht aus dem Unterricht)',
  '5–7 Sätze geschrieben',
  'Mindestens zwei Lehrmittelbegriffe verwendet',
  'Bezug zu mindestens einer der drei Herausforderungen erkennbar',
]

const microLabel = {
  fontSize: '7.5pt', fontWeight: 600, letterSpacing: '0.06em',
  textTransform: 'uppercase', color: 'var(--sit-akzent)', margin: '3mm 0 1mm',
} as const

function konzeptFor(set: SetJson | null, sit: SituationJson | null): string | undefined {
  if (!set?.konzept_progression || !sit?.id) return undefined
  return set.konzept_progression.find((k) => k.situation === sit.id)?.konzept
}

export function DocAustausch({ set, sits, abteilung, edits, onEdit }: DocAustauschProps) {
  const ap = set?.austausch_phase
  const da = set?.dekontextualisierungs_aufgabe
  const validSits = sits.filter((s): s is SituationJson => Boolean(s))

  // Back-compat: prefer the new structured closure keys, fall back to the legacy names.
  const gruppe = ap?.gruppenpuzzle ?? ap?.gruppenarbeit_jigsaw
  const plenum = ap?.plenum ?? ap?.einzelarbeit_plenum
  const einzel = ap?.einzelauftrag

  return (
    <div style={sitColors(null)}>
      {/* ---------------- Page 1 — Austausch ---------------- */}
      <A4Page
        sit={null}
        abteilung={abteilung}
        docCode="DOC-AUSTAUSCH · AUSTAUSCH"
        docTitel="Austausch & Transfer"
        sitLetter={null}
        pageNum={1}
        pageTotal={2}
      >
        <div className="a4-page-body austausch-page">
          <SectionHead num="01 · Austausch">Eure drei Lösungen im Vergleich</SectionHead>
          <p className="sit-text" style={{ marginBottom: '3mm' }}>
            Ihr habt drei Herausforderungen bearbeitet und je ein Handlungsprodukt erstellt. Vergleicht jetzt eure
            Lösungen und arbeitet das gemeinsame Prinzip heraus. Wählt eine Sozialform und haltet eure Ergebnisse im
            Notizfeld fest:
          </p>
          {validSits.length > 0 && (
            <ul className="transfer-beispiele" style={{ marginBottom: '3mm' }}>
              {validSits.map((s, i) => {
                const k = konzeptFor(set, s)
                return (
                  <li key={i}>
                    <span className="bsp-sit">HF {s.situation}:</span> {s.handlungsprodukt?.format || s.titel}
                    {k && <> — {k}</>}
                  </li>
                )
              })}
            </ul>
          )}

          <div className="austausch-optionen">
            {einzel && (
              <div className="austausch-option">
                <div className="austausch-option-head">
                  <span className="check-box">☐</span>
                  <span className="ao-kuerzel">EA</span>
                  <span className="ao-label">Einzelauftrag</span>
                </div>
                <div className="ao-body">
                  {einzel}
                  {gruppe?.runde_3 && (
                    <p style={{ margin: '1.5mm 0 0' }}>
                      <strong style={{ color: 'var(--sit-akzent)' }}>Und:</strong> {gruppe.runde_3}
                    </p>
                  )}
                </div>
                <Schreibfeld heightMm={8} value={edits.austausch_ea || ''} onChange={(v) => onEdit('austausch_ea', v)} />
              </div>
            )}
            {gruppe && (gruppe.runde_1 || gruppe.runde_2 || gruppe.runde_3) && (
              <div className="austausch-option">
                <div className="austausch-option-head">
                  <span className="check-box">☐</span>
                  <span className="ao-kuerzel">GA</span>
                  <span className="ao-label">Gruppenpuzzle</span>
                </div>
                <div className="ao-body">
                  <div className="runden">
                    {gruppe.runde_1 && (
                      <div className="runden-item"><span className="nr">Runde 1</span><span>{gruppe.runde_1}</span></div>
                    )}
                    {gruppe.runde_2 && (
                      <div className="runden-item"><span className="nr">Runde 2</span><span>{gruppe.runde_2}</span></div>
                    )}
                    {gruppe.runde_3 && (
                      <div className="runden-item"><span className="nr">Runde 3</span><span>{gruppe.runde_3}</span></div>
                    )}
                  </div>
                </div>
                <Schreibfeld heightMm={8} value={edits.austausch_ga || ''} onChange={(v) => onEdit('austausch_ga', v)} />
              </div>
            )}
            {plenum && (
              <div className="austausch-option">
                <div className="austausch-option-head">
                  <span className="check-box">☐</span>
                  <span className="ao-kuerzel">PL</span>
                  <span className="ao-label">Plenum</span>
                </div>
                <div className="ao-body">{plenum}</div>
                <Schreibfeld heightMm={8} value={edits.austausch_pl || ''} onChange={(v) => onEdit('austausch_pl', v)} />
              </div>
            )}
          </div>
        </div>
      </A4Page>

      {/* ---------------- Page 2 — Transfer ---------------- */}
      <A4Page
        sit={null}
        abteilung={abteilung}
        docCode="DOC-AUSTAUSCH · TRANSFER"
        docTitel="Austausch & Transfer"
        sitLetter={null}
        pageNum={2}
        pageTotal={2}
      >
        <div className="a4-page-body">
          <SectionHead num="02 · Transfer">Transfer (Einzelarbeit)</SectionHead>
          {da && (
            <>
              <p className="sit-text" style={{ marginBottom: '2mm' }}>{da.auftrag}</p>
              <p style={{ fontSize: '8.5pt', color: 'var(--ink-soft)', margin: '0 0 2mm' }}>
                {da.format && <><strong>Format:</strong> {da.format}</>}
                {da.abgabe && <> · <strong>Abgabe:</strong> {da.abgabe}</>}
              </p>
              {validSits.some((s) => s.dekontextualisierung?.frage) && (
                <>
                  <div style={microLabel}>Beispiele aus euren Herausforderungen</div>
                  <ul className="transfer-beispiele">
                    {validSits.map((s, i) => s.dekontextualisierung?.frage && (
                      <li key={i}><span className="bsp-sit">HF {s.situation}:</span> {s.dekontextualisierung.frage}</li>
                    ))}
                  </ul>
                </>
              )}
            </>
          )}

          <div style={microLabel}>Schreibhilfe — Satzanfänge</div>
          <ul className="transfer-scaffold">
            {TRANSFER_SATZANFAENGE.map((s, i) => <li key={i}>{s}</li>)}
          </ul>

          <p style={{
            fontSize: '8.5pt', color: 'var(--ink-mute)', margin: '3mm 0 1mm',
            textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600,
          }}>
            Dein Transfer (5–7 Sätze)
          </p>
          <Schreibfeld heightMm={50} value={edits.transfer || ''} onChange={(v) => onEdit('transfer', v)} />

          <section style={{ marginTop: '3mm' }}>
            <div style={microLabel}>Selbstcheck — habe ich den Transfer richtig gemacht?</div>
            <ul className="guete-list">
              {TRANSFER_CHECKLISTE.map((c, i) => (
                <li key={i}><span className="check-box">☐</span><span>{c}</span></li>
              ))}
            </ul>
          </section>
        </div>
      </A4Page>
    </div>
  )
}
