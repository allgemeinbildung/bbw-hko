import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import { A4Page, HandlungsFlaeche, Schreibfeld, SectionHead } from './chrome'
import { Kasten } from './heft-v42/gemeinsam'
import type { GemeinsamerAuftrag, GlossarEintrag, SetJson } from '../../../lib/einheiten/types'

/**
 * Auftragsbogen des gemeinsamen Auftrags v4.2 — Leitfaden docs/upgrade-v4.2 §7.5.
 *
 * Vier Seiten in fester Folge: A1 Situation und Auftrag · A2 Arbeitsfläche ·
 * A3 Sprechspur (das Glossar steht seit E17 in den Heften, S. 8) · A4 Selbsteinschätzung. Der Auftrag ist in beiden
 * Spuren identisch (§7.4) und braucht kein Medium — darum hängt hier nichts an `spur`.
 *
 * Muster DocAustausch.tsx: ein Set-Dokument mit eigener Hülle und eigenem
 * Namensraum für Eingaben (`auftrag_…`). Nie gedruckt (nur Lehrperson):
 * `erwartungshorizont`, `kontext_ausschluss`, `aktivierte_trade_offs`,
 * `lebensbereich`, `bogen`.
 */

export interface DocAuftragsbogenProps {
  set: SetJson | null
  abteilung?: string
  edits: Record<string, string>
  onEdit: (key: string, value: string) => void
}

const SEITEN_TOTAL = 4
const DOC_CODE = 'AUFTRAG · GEMEINSAM'

/**
 * Akzent: der Auftrag gehört keinem Heft, also Plattform-Grün statt Heft-Farbe.
 * Gleicher Weg wie sitColors(null) bei DocAustausch — die Variablen sitzen auf der
 * Hülle. `--brand` gibt es nur in der App (Base.astro); im Standalone-HTML greift
 * der Rückfallwert, derselbe Ton wie BBW_GRUEN im Word.
 */
const FARBEN = {
  '--sit-akzent': 'var(--brand, #0E6E3A)',
  '--sit-light': 'var(--brand-tint, #E8F3EC)',
  '--sit-mid': 'var(--brand, #0E6E3A)',
} as CSSProperties

/** Die drei Stationen der Sprechspur — aus dem Hint von Schritt 05 (Leitfaden §9.2), in Ich-Form. */
export const SPRECHSPUR_STATIONEN = [
  'Mein Entscheid',
  'Ein Grund, der für mich zählt',
  'Ein Satz, der zeigt, dass ich die Gruppe verstehe',
] as const

/** «01 Bedürfnis klären» → ['01', 'Bedürfnis klären']; ohne Nummer zählt die Position. */
export function schrittTeile(label: string, i: number): [string, string] {
  const m = /^(\d{1,2})\s+(.*)$/.exec(label.trim())
  return m ? [m[1].padStart(2, '0'), m[2]] : [String(i + 1).padStart(2, '0'), label]
}

/** `sozialform.zulaessig` → «Einzel-, Partner- oder Gruppenarbeit» (Leitfaden §7.3). */
export function sozialformZeile(zulaessig: string[] | undefined): string {
  const STAMM: Record<string, string> = { einzel: 'Einzel', partner: 'Partner', gruppe: 'Gruppen' }
  const z = zulaessig || []
  // Bekannte Werte als Wortstamm mit Ergänzungsstrich, der letzte mit «arbeit»; Unbekanntes wörtlich.
  const woerter = z.map((w, i) => (STAMM[w] ? `${STAMM[w]}${i < z.length - 1 ? '-' : 'arbeit'}` : w))
  if (woerter.length < 2) return woerter[0] ?? ''
  return `${woerter.slice(0, -1).join(', ')} oder ${woerter[woerter.length - 1]}`
}

/** Dauer der Sprachnachricht aus dem Hint («60–90 Sekunden …»); Leitfaden-Wert als Rückfall. */
export function sprechDauer(hint: string | undefined): string {
  const m = /(\d+)\s*[–-]\s*(\d+)\s*Sek/.exec(hint || '')
  return m ? `${m[1]}–${m[2]} Sekunden` : '60–90 Sekunden'
}

/** Schreibzeilen je Station der Sprechspur (A3), HTML und Word gleich. */
export const SPRECHSPUR_ZEILEN = 6

/**
 * Fusszeile von A3: das Glossar steht seit E17 in den Heften (je S. 8), nicht mehr hier.
 * Hefte aus `set.glossar` in der Reihenfolge des ersten Auftretens; ohne Glossar keine Zeile.
 */
export function glossarVerweis(glossar: GlossarEintrag[] | undefined): string | null {
  const hefte = [...new Set((glossar || []).map((g) => g.heft).filter(Boolean))] as string[]
  if (!hefte.length) return null
  const namen = hefte.map((h) => `Heft ${h}`)
  const liste = namen.length < 2 ? namen[0] : `${namen.slice(0, -1).join(', ')} und ${namen[namen.length - 1]}`
  return `Begriffe nachschlagen: Glossar in ${liste}, je Seite 8.`
}

/**
 * Schreibzeile mit frei gewählter Zeilenzahl — Schreibfeld rechnet mindestens drei.
 * Dieselbe Klasse `.feld`, also Raster, Protokoll und Einfügesperre wie dort.
 */
function Zeilen({ zeilen, value, onChange }: { zeilen: number; value: string; onChange: (v: string) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (ref.current && ref.current.innerText !== value) ref.current.innerText = value || ''
  }, [value])
  return (
    <div
      ref={ref}
      className="feld v42-auftrag-zeilen"
      style={{ minHeight: `calc(8.5mm * ${zeilen})` }}
      contentEditable
      suppressContentEditableWarning
      onInput={(e) => onChange((e.currentTarget as HTMLDivElement).innerText)}
      spellCheck={false}
    />
  )
}

/** Seitenrahmen — auf Modulebene wie HeftPage, nie im Render-Body erzeugt. */
function BogenPage({ nr, titel, abteilung, children }: { nr: number; titel: string; abteilung?: string; children: ReactNode }) {
  return (
    <A4Page sit={null} abteilung={abteilung} docCode={DOC_CODE} docTitel={titel} sitLetter={null} pageNum={nr} pageTotal={SEITEN_TOTAL}>
      <div className={`a4-page-body v42-auftrag-seite v42-auftrag-a${nr}`}>{children}</div>
    </A4Page>
  )
}

type SeiteProps = { ga: GemeinsamerAuftrag; set: SetJson; edits: Record<string, string>; onEdit: (k: string, v: string) => void }

// ---------------- A1 — Situation und Auftrag ----------------
function SeiteA1({ ga }: SeiteProps) {
  const persona = [ga.persona?.beruf, ga.persona?.betrieb, ga.persona?.ort].filter(Boolean).join(' · ')
  const moeglich = sozialformZeile(ga.sozialform?.zulaessig)
  return (
    <>
      <SectionHead num="A1">{ga.titel}</SectionHead>
      {persona && <div className="v42-auftrag-persona"><span className="v42-auftrag-mikro">Persona</span>{persona}</div>}
      {ga.situation_text && <p className="v42-auftrag-situation">{ga.situation_text}</p>}

      <div className="v42-auftrag-zweier">
        {(ga.zahlen_tabelle?.length ?? 0) > 0 && (
          <table className="zahlen-tabelle v42-auftrag-zahlen">
            <thead><tr><th>Zahlen</th><th style={{ textAlign: 'right' }}>Betrag</th></tr></thead>
            <tbody>
              {ga.zahlen_tabelle!.map((z, i) => (
                <tr key={i}><td>{z.label}</td><td className="wert">{z.wert}</td></tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="v42-auftrag-fragen">
          {ga.leitfrage && (
            <div className="v42-auftrag-leitfrage"><div className="v42-auftrag-mikro">Leitfrage</div>{ga.leitfrage}</div>
          )}
          {ga.mehrdeutigkeit?.trade_off && (
            <div className="v42-auftrag-spannung">
              <div className="v42-auftrag-mikro">Spannungsfeld</div>
              <strong>{ga.mehrdeutigkeit.trade_off}</strong>
              {ga.mehrdeutigkeit.hint && <div className="v42-auftrag-hint">{ga.mehrdeutigkeit.hint}</div>}
            </div>
          )}
        </div>
      </div>

      <Kasten label="Ihr Auftrag" className="v42-auftrag-kasten">
        {ga.auftrag && <p className="v42-auftrag-auftrag">{ga.auftrag}</p>}
        {(ga.schritte?.length ?? 0) > 0 && (
          <ol className="v42-auftrag-schritte">
            {ga.schritte!.map((s, i) => {
              const [nr, label] = schrittTeile(s.label, i)
              return (
                <li key={i}>
                  <span className="v42-auftrag-nr">{nr}</span>
                  <span><strong>{label}</strong> — {s.hint}</span>
                </li>
              )
            })}
          </ol>
        )}
      </Kasten>

      <div className="v42-auftrag-zweier">
        {(ga.abgaben?.length ?? 0) > 0 && (
          <Kasten label="Das geben Sie ab" className="v42-auftrag-kasten">
            <ul className="v42-auftrag-liste">
              {ga.abgaben!.map((a, i) => <li key={i}><span className="check-box">☐</span><span>{a}</span></li>)}
            </ul>
          </Kasten>
        )}
        {(moeglich || ga.sozialform?.empfehlung) && (
          <Kasten label="Sozialform" className="v42-auftrag-kasten">
            {moeglich && <p className="v42-auftrag-klein"><strong>Möglich:</strong> {moeglich}</p>}
            {ga.sozialform?.empfehlung && <p className="v42-auftrag-klein"><strong>Empfehlung:</strong> {ga.sozialform.empfehlung}</p>}
          </Kasten>
        )}
      </div>

      {/* Bezug auf die Hefte: der Auftrag sagt, was er braucht — das Heft nennt keine Woche. */}
      {(ga.heft_bezug?.length ?? 0) > 0 ? (
        <Kasten label="Das brauchen Sie aus Ihren Heften" className="v42-auftrag-kasten">
          <div className="v42-auftrag-bezug">
            {ga.heft_bezug!.map((h, i) => (
              <div key={i}>
                <div className="v42-auftrag-bezug-kopf"><strong>Heft {h.heft}</strong>{h.titel ? ` · ${h.titel}` : ''}</div>
                <ul className="v42-auftrag-bezug-liste">
                  {(h.inhalte || []).map((t, j) => <li key={j}>{t}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </Kasten>
      ) : (
        <p className="v42-auftrag-hefte">Ihre Hefte A und B dürfen Sie benutzen.</p>
      )}
    </>
  )
}

// ---------------- A2 — Arbeitsfläche (Schritt 04) ----------------
function SeiteA2({ ga, edits, onEdit }: SeiteProps) {
  const s = ga.schritte?.[3]
  const [nr, label] = s ? schrittTeile(s.label, 3) : ['04', 'Entscheidungsblatt']
  return (
    <>
      <SectionHead num="A2">{label}</SectionHead>
      {s?.hint && <p className="v42-auftrag-klein v42-auftrag-fest"><strong>Schritt {nr}:</strong> {s.hint}</p>}
      <div className="v42-auftrag-flaeche">
        <HandlungsFlaeche
          label={`Schritt ${nr} · ${label} · schriftlich und bildlich`}
          value={edits.auftrag_entscheidungsblatt || ''}
          onChange={(v) => onEdit('auftrag_entscheidungsblatt', v)}
        />
      </div>
    </>
  )
}

// ---------------- A3 — Sprechspur, am Fuss der Verweis aufs Glossar der Hefte ----------------
function SeiteA3({ ga, set, edits, onEdit }: SeiteProps) {
  const s = ga.schritte?.[4]
  const [nr, label] = s ? schrittTeile(s.label, 4) : ['05', 'Sprachnachricht']
  const dauer = sprechDauer(s?.hint)
  const verweis = glossarVerweis(set.glossar)
  return (
    <>
      <SectionHead num="A3">{label} planen</SectionHead>
      {s?.hint && <p className="v42-auftrag-klein v42-auftrag-fest"><strong>Schritt {nr}:</strong> {s.hint}</p>}
      <p className="v42-auftrag-klein v42-auftrag-fest">
        Notieren Sie Stichworte, keinen ganzen Text. Sprechen Sie frei und stoppen Sie die Zeit. Ihre Sprachnachricht
        geben Sie der Lehrperson direkt ab: live oder als Aufnahme.
      </p>
      <div className="v42-auftrag-spur">
        {SPRECHSPUR_STATIONEN.map((station, i) => (
          <div className="v42-auftrag-station" key={i}>
            <div className="v42-auftrag-station-kopf">
              <span className="v42-auftrag-nr">{i + 1}</span>
              <strong>{station}</strong>
            </div>
            <Zeilen zeilen={SPRECHSPUR_ZEILEN} value={edits[`auftrag_sprechspur_${i + 1}`] || ''} onChange={(v) => onEdit(`auftrag_sprechspur_${i + 1}`, v)} />
          </div>
        ))}
        <div className="v42-auftrag-station-ende">
          <span className="v42-auftrag-nr">Ende</span>
          <span>
            Ziel {dauer} · Probelauf: <span className="check-box">☐</span> zu kurz{' '}
            <span className="check-box">☐</span> passt <span className="check-box">☐</span> zu lang
          </span>
        </div>
      </div>

      {verweis && <p className="v42-auftrag-klein v42-auftrag-verweis">{verweis}</p>}
    </>
  )
}

// ---------------- A4 — Selbsteinschätzung ----------------
// Bewusst neutral (ENTSCHEIDE E18): der Bogen sagt nicht, wer Rückmeldung gibt und ob der Auftrag zählt.
function SeiteA4({ ga, edits, onEdit }: SeiteProps) {
  const kriterien = ga.feedback_kriterien || []
  return (
    <>
      <SectionHead num="A4">Selbsteinschätzung</SectionHead>
      <p className="v42-auftrag-klein v42-auftrag-fest">
        Schätzen Sie Ihre Arbeit selbst ein: Kreuzen Sie je Kriterium die Stufe an, die zutrifft (Spalte «Selbst»).
        Die Spalte «Fremd» ist frei für eine Rückmeldung von aussen.
      </p>
      <table className="v42-auftrag-raster">
        <colgroup>
          <col style={{ width: '12mm' }} />
          <col />
          <col style={{ width: '13mm' }} />
          <col style={{ width: '13mm' }} />
        </colgroup>
        <thead>
          <tr><th>Stufe</th><th>Kriterium</th><th>Selbst</th><th>Fremd</th></tr>
        </thead>
        {kriterien.map((k, ki) => (
          <tbody key={ki}>
            <tr className="v42-auftrag-krit">
              <td colSpan={4}>
                <strong>{k.kn_kriterium}</strong> <span className="v42-auftrag-dim">{k.dimension}</span>
                {k.indikator_produkt && <span className="v42-auftrag-indikator">Woran ich es sehe: {k.indikator_produkt}</span>}
              </td>
            </tr>
            {k.stufen.map((st, si) => (
              <tr key={si}>
                <td className="v42-auftrag-pkt">{si}</td>
                <td className="v42-auftrag-stufe">{st}</td>
                <td className="v42-auftrag-box">☐</td>
                <td className="v42-auftrag-box">☐</td>
              </tr>
            ))}
          </tbody>
        ))}
      </table>

      <div className="v42-auftrag-fest">
        <div className="v42-auftrag-mikro v42-auftrag-feldlabel">Das verbessere ich …</div>
        <Schreibfeld heightMm={17} value={edits.auftrag_verbessern || ''} onChange={(v) => onEdit('auftrag_verbessern', v)} />
      </div>
      <div className="v42-auftrag-fest">
        <div className="v42-auftrag-mikro v42-auftrag-feldlabel">Rückmeldung, die ich erhalten habe</div>
        <Zeilen zeilen={1} value={edits.auftrag_partner || ''} onChange={(v) => onEdit('auftrag_partner', v)} />
      </div>
    </>
  )
}

const SEITEN = [SeiteA1, SeiteA2, SeiteA3, SeiteA4]

export function DocAuftragsbogen({ set, abteilung, edits, onEdit }: DocAuftragsbogenProps) {
  const ga = set?.gemeinsamer_auftrag
  if (!set || !ga) return null
  const titel = `Auftragsbogen · ${ga.titel ?? ''}`.trim()
  const seite: SeiteProps = { ga, set, edits, onEdit }
  return (
    <div className="v42-auftragsbogen" style={FARBEN}>
      {SEITEN.map((Seite, i) => (
        <BogenPage nr={i + 1} titel={titel} abteilung={abteilung} key={i}>
          <Seite {...seite} />
        </BogenPage>
      ))}
    </div>
  )
}
