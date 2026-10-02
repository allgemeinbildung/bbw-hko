import { useEffect, useRef } from 'react'
import { HandlungsFlaeche } from '../chrome'
import { ChecklisteVollstaendigkeit, MethodenGrid } from '../DocS'
import { RUBRIK_PUNKTE_LABELS } from '../../../../lib/einheiten/rubrik-skala'
import type { SituationJson } from '../../../../lib/einheiten/types'
import { Kasten, SeitenKopf, type HeftSeiteProps } from './gemeinsam'

/**
 * Heft v4.2, Seiten 5–8 (Leitfaden §3): Auftrag · Methoden · Arbeitsfläche ·
 * Abschluss. Spiegel in src/lib/einheiten/docx-heft-v42-5-8.ts, Stil in
 * src/styles/v42/heft-5-8.css.
 *
 * Alle vier Seiten sind Kern (Leitfaden §4.1): bis auf Methodenkarte 2 und die
 * Texte, die loadEinheit je Spur einsetzt, in beiden Spuren gleich. Darum teilen
 * sich auch die Eingaben die Spuren — Schlüssel ohne Spur-Teil, siehe {@link kernNs}.
 *
 * Nie gedruckt (nur Lehrperson): `loesung`, `prinzip_handoff`, `sk_anker`,
 * `dekontextualisierung`; ersetzt und darum ebenfalls nicht gedruckt:
 * `lernfortschritt.kriterien`, `lernfortschritt.scaffold_90`, `reflexion_fragen`.
 */

/**
 * Namensraum der Kern-Eingaben: `hfA_`, `hfB_` — ohne Spur-Teil, anders als
 * heftNs(). Wer in der Spur «ohne Medien» die Arbeitsfläche füllt und dann die
 * Spur wechselt, findet sein Produkt dort wieder.
 */
function kernNs(sit: SituationJson): string {
  return `hf${sit.buchstabe || '?'}_`
}

/** Fill-Modus: Wert lesen und schreiben; Info-Modus: nur lesen (kein Setter). */
function eingabe(props: HeftSeiteProps, key: string): [string, ((v: string) => void) | undefined] {
  const k = kernNs(props.sit) + key
  return [props.edits[k] || '', props.mode === 'fill' ? (v) => props.onEdit(k, v) : undefined]
}

/**
 * Ankreuzkästchen. Ohne `onToggle` (Info-Modus, Druck) ein reines ☐; im Fill-Modus
 * ein Knopf, der zwischen ☐ und ☒ wechselt. Im eigenständigen HTML bleibt es ein
 * ☐ zum Ankreuzen auf Papier — die Shell speichert nur Schreibfelder.
 */
function Kaestchen({ an, onToggle, label }: { an: boolean; onToggle?: () => void; label: string }) {
  if (!onToggle) return <span className="v42-box" aria-hidden="true">☐</span>
  return (
    <button type="button" className={an ? 'v42-box an' : 'v42-box'} role="checkbox" aria-checked={an} aria-label={label} onClick={onToggle}>
      {an ? '☒' : '☐'}
    </button>
  )
}

/**
 * Eine Schreibzeile (Mitnahme, S. 8). Trägt die Klasse `.feld`, damit die
 * Standalone-Shell sie wie jedes Schreibfeld speichert; heft-5-8.css macht aus dem
 * Karokasten eine einzelne Linie. Muster: Schreibfeld in chrome.tsx.
 */
function Zeile({ value, onChange }: { value: string; onChange?: (v: string) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (ref.current && ref.current.innerText !== value) ref.current.innerText = value || ''
  }, [value])
  return (
    <div
      ref={ref}
      className="feld v42-zeile"
      contentEditable={!!onChange}
      suppressContentEditableWarning
      onInput={(e) => onChange && onChange((e.currentTarget as HTMLDivElement).innerText)}
      spellCheck={false}
    />
  )
}

/** «01 Karte einteilen» → Nummer und Text getrennt; ohne Nummer im Label zählt der Index. */
function schrittTeile(label: string, i: number): { nr: string; text: string } {
  const m = /^\s*(\d{1,2})\s+(.+)$/.exec(label || '')
  return m ? { nr: m[1].padStart(2, '0'), text: m[2] } : { nr: String(i + 1).padStart(2, '0'), text: label || '' }
}

// ---------------------------------------------------------------------------
// Seite 5 — Auftrag
// ---------------------------------------------------------------------------

/**
 * Feedback-Kriterien (Leitfaden §2): je Kriterium Name und Dimension, darunter die
 * vier Stufen untereinander mit der Spalte «Selbst». Name und Stufen stehen
 * zeichengenau wie in den Daten (Invariante 8) — nie kürzen, nie umformulieren.
 * Stufenbeschriftung aus rubrik-skala.ts: dieselbe 0–3-Skala wie im KN.
 */
function FeedbackKriterien(props: HeftSeiteProps) {
  const kriterien = (props.sit.feedback_kriterien || []).filter((k) => k && k.kn_kriterium)
  if (!kriterien.length) return null
  return (
    <section className="v42-kriterien">
      <div className="v42-kasten-label">Feedback-Kriterien</div>
      <p className="v42-arbeitsanweisung">Kreuzen Sie vor der Abgabe in der Spalte «Selbst» Ihre Stufe an.</p>
      <table className="v42-krit-tabelle">
        <colgroup>
          <col className="v42-krit-punkte" />
          <col />
          <col className="v42-krit-selbst" />
        </colgroup>
        <thead>
          <tr>
            <th>Stufe</th>
            <th>Beschreibung (Wortlaut Kompetenznachweis)</th>
            <th>Selbst</th>
          </tr>
        </thead>
        {kriterien.map((k, ki) => {
          const [wahl, setze] = eingabe(props, `selbst_${ki}`)
          return (
            <tbody key={ki}>
              <tr className="v42-krit-kopf">
                <th colSpan={3}>
                  <span className="v42-krit-name">{k.kn_kriterium}</span>
                  {k.dimension && <span className="v42-krit-dim">{k.dimension}</span>}
                  {k.indikator_produkt && (
                    <span className="v42-krit-indikator">
                      <span className="v42-krit-frage">Woran sehe ich das in meinem Produkt?</span> {k.indikator_produkt}
                    </span>
                  )}
                </th>
              </tr>
              {k.stufen.map((s, si) => (
                <tr key={si} className={wahl === String(si) ? 'v42-krit-stufe gewaehlt' : 'v42-krit-stufe'}>
                  <td className="v42-krit-nr">{RUBRIK_PUNKTE_LABELS[si] ?? `${si} Punkte`}</td>
                  <td className="v42-krit-text">{s}</td>
                  <td className="v42-krit-box">
                    <Kaestchen
                      an={wahl === String(si)}
                      onToggle={setze && (() => setze(wahl === String(si) ? '' : String(si)))}
                      label={`${k.kn_kriterium}: ${RUBRIK_PUNKTE_LABELS[si] ?? si}`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          )
        })}
      </table>
    </section>
  )
}

export function Seite5(props: HeftSeiteProps) {
  const { sit } = props
  const hp = sit.handlungsprodukt
  const schritte = (hp?.schritte || []).filter((s) => s && (s.label || s.hint))
  const abgaben = (hp?.abgaben || []).filter(Boolean)
  const plus = sit.lernfortschritt?.scaffold_100
  return (
    <>
      <SeitenKopf nr={5} titel="Auftrag" />
      <Kasten label="Ihr Produkt" className="v42-produkt">
        {hp?.titel && <div className="v42-produkt-titel">{hp.titel}</div>}
        {hp?.beschreibung && <p className="v42-produkt-text">{hp.beschreibung}</p>}
      </Kasten>
      {schritte.length > 0 && (
        <ol className="v42-schritte">
          {schritte.map((s, i) => {
            const { nr, text } = schrittTeile(s.label, i)
            return (
              <li key={i}>
                <span className="v42-schritt-nr">{nr}</span>
                <span className="v42-schritt-label">{text}</span>
                <span className="v42-schritt-hint">{s.hint}</span>
              </li>
            )
          })}
        </ol>
      )}
      {hp?.hilfe_verweis && <p className="v42-hilfe">→ {hp.hilfe_verweis}</p>}
      {abgaben.length > 0 && (
        <Kasten label="Das geben Sie ab" className="v42-abgaben">
          <ul>
            {abgaben.map((a, i) => <li key={i}>{a}</li>)}
          </ul>
        </Kasten>
      )}
      <FeedbackKriterien {...props} />
      {plus && (
        <Kasten label="Plus" className="v42-plus">
          <p>{plus}</p>
        </Kasten>
      )}
    </>
  )
}

// ---------------------------------------------------------------------------
// Seite 6 — Methoden
// ---------------------------------------------------------------------------

/**
 * Bestehende Methodenseite, unverändert (docs/methodenkartei.md): vier Karten,
 * Gewichtssortierung und Kontur macht MethodenGrid. Karte 2 ist bereits die
 * Rezeptionskarte der Spur (loadEinheit → resolveSpur).
 */
export function Seite6({ sit }: HeftSeiteProps) {
  return (
    <>
      <SeitenKopf nr={6} titel="Methoden" />
      <p className="methoden-intro">
        Vier Werkzeuge, vier Felder. Wo ein Kapitel steht, schlagen Sie im Lehrmittel nach —
        hier steht, was Sie damit für diese Abgabe machen. Die übrigen Felder stehen für sich.
      </p>
      <MethodenGrid sit={sit} />
    </>
  )
}

// ---------------------------------------------------------------------------
// Seite 7 — Arbeitsfläche
// ---------------------------------------------------------------------------

/** Freie Fläche über den ganzen Rest der Seite; Beschriftung = Produkttitel. */
export function Seite7(props: HeftSeiteProps) {
  const label = props.sit.handlungsprodukt?.titel || 'Hier erarbeiten'
  const [wert, setze] = eingabe(props, 'produkt')
  return (
    <>
      <SeitenKopf nr={7} titel="Arbeitsfläche" />
      {setze ? (
        <HandlungsFlaeche label={label} value={wert} onChange={setze} />
      ) : (
        // Info-Modus: gleiche Fläche, nicht editierbar (HandlungsFlaeche ist es immer).
        <div className="hp-flaeche-wrap" style={{ position: 'relative' }}>
          <div className="hp-flaeche" />
          <div className="hp-flaeche-label">{label}</div>
        </div>
      )}
    </>
  )
}

// ---------------------------------------------------------------------------
// Seite 8 — Abschluss
// ---------------------------------------------------------------------------

type Ast = NonNullable<SituationJson['mindmap_aeste']>[number]

/**
 * Mindmap (Leitfaden §6.2) — eigenes Layout statt MindmapRadial: der Ast
 * «gilt auch bei …» (`transfer: true`) ist offen, mit leeren Zeilen zum Selberfüllen,
 * und gestrichelt umrandet (Kontur statt Farbe). Gleiches 3×3-Raster wie im Bestand:
 * Äste in den Eckzellen, an die zur Mitte zeigende Zellecke geheftet, damit die
 * Linien bei 1/3 und 2/3 enden und die Kästen in jeder Grösse treffen.
 */
function Mindmap({ sit }: { sit: SituationJson }) {
  const aeste = (sit.mindmap_aeste || []).slice(0, 4)
  const ecken = ['v42-mm-b1', 'v42-mm-b2', 'v42-mm-b3', 'v42-mm-b4']
  const enden = [[100 / 3, 100 / 3], [200 / 3, 100 / 3], [100 / 3, 200 / 3], [200 / 3, 200 / 3]]
  return (
    <div className="v42-mm">
      <svg className="v42-mm-linien" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {aeste.map((ast, i) => (
          <line key={i} x1="50" y1="50" x2={enden[i][0]} y2={enden[i][1]} className={ast.transfer ? 'offen' : ''} />
        ))}
      </svg>
      <div className="v42-mm-zentrum">{sit.mindmap_zentrum}</div>
      {aeste.map((ast: Ast, i) => (
        <div className={`v42-mm-ast ${ecken[i]}${ast.transfer ? ' offen' : ''}`} key={i}>
          <div className="v42-mm-titel">{ast.titel}</div>
          {ast.transfer || !ast.punkte?.length ? (
            <div className="v42-mm-leer" aria-hidden="true"><span /><span /><span /></div>
          ) : (
            <ul>{ast.punkte.map((pt, j) => <li key={j}>{pt}</li>)}</ul>
          )}
        </div>
      ))}
    </div>
  )
}

export function Seite8(props: HeftSeiteProps) {
  const { sit } = props
  const transferTitel = sit.mindmap_aeste?.find((a) => a.transfer)?.titel || 'gilt auch bei …'
  const quercheck = (sit.abschluss?.quercheck || []).filter(Boolean)
  const mitnahme = (sit.abschluss?.mitnahme || []).filter(Boolean)
  return (
    <>
      <SeitenKopf nr={8} titel="Abschluss" />
      {(sit.mindmap_aeste?.length ?? 0) > 0 && (
        <>
          <p className="v42-arbeitsanweisung">
            Verbinden Sie die Begriffe mit Linien und schreiben Sie an jede Linie, wie die zwei
            Begriffe zusammenhängen — mindestens fünf Verbindungen. Ergänzen Sie mindestens zwei
            Begriffe aus Ihrem Raster (S. 3). Tragen Sie im Feld «{transferTitel}» ein, wo dasselbe
            sonst noch gilt, und führen Sie eine Verbindung dorthin.
          </p>
          <Mindmap sit={sit} />
        </>
      )}
      {quercheck.length > 0 && (
        <section className="v42-quercheck">
          <div className="v42-kasten-label">Quer-Check — die offenen Fragen der Situation</div>
          <ul>
            {quercheck.map((q, i) => {
              const [wert, setze] = eingabe(props, `quercheck_${i}`)
              return (
                <li key={i}>
                  <Kaestchen an={!!wert} onToggle={setze && (() => setze(wert ? '' : 'x'))} label={q} />
                  <span>{q}</span>
                </li>
              )
            })}
          </ul>
        </section>
      )}
      {mitnahme.length > 0 && (
        <section className="v42-mitnahme">
          <div className="v42-kasten-label">Mitnahme in den gemeinsamen Auftrag (Woche 3)</div>
          <p className="v42-arbeitsanweisung">Diese drei Zeilen brauchen Sie in Woche 3 wieder.</p>
          {mitnahme.map((m, i) => {
            const [wert, setze] = eingabe(props, `mitnahme_${i}`)
            return (
              <div className="v42-mitnahme-zeile" key={i}>
                <span className="v42-mitnahme-label">{m}</span>
                <Zeile value={wert} onChange={setze} />
              </div>
            )
          })}
        </section>
      )}
      <div className="v42-checkliste">
        <ChecklisteVollstaendigkeit sit={sit} />
      </div>
    </>
  )
}
