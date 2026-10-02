import { useEffect, useRef, type FormEvent, type ReactNode } from 'react'
import { Badge } from '../chrome'
import { QrCode } from '../QrCode'
import { landingUrl } from '../../../../lib/einheiten/qr'
import type { KastenS4, Leitfrage, Quelle, SituationJson } from '../../../../lib/einheiten/types'
import { Kasten, SeitenKopf, type HeftSeiteProps } from './gemeinsam'

/**
 * Heft v4.2, Seiten 1–4 (Leitfaden §3): Herausforderung · Wissensecke I · Quelle ·
 * Wissensecke II. Spiegel in Word: src/lib/einheiten/docx-heft-v42-1-4.ts — wer hier
 * Reihenfolge oder Inhalt ändert, ändert dort mit. Stil: src/styles/v42/heft-1-4.css.
 *
 * Seiten 1 und 2 sind der Kern und in beiden Spuren gleich; einzige Ausnahme ist der
 * Kurzeintrag der Pflichtquelle auf S. 1 (nur Medien-Spur). Ab S. 3 entscheidet die Spur.
 *
 * Nie gedruckt, auch wenn es in `sit` steht: `loesung`, `erwartungshorizont`,
 * `prinzip_handoff`, `sk_anker`, `archiv_ref`, `lizenz_hinweis`, `sachlage_geprueft`,
 * `ersatz` und `quellen_anker[].fuer_leitfrage` (stimmt nicht in beiden Spuren).
 */

// ── Kleine Helfer (doppelt in docx-heft-v42-1-4.ts — die Word-Seite darf kein React ziehen) ──

/** Ordnername der Einheit aus der Heft-ID: `1.3.1_konsum_verantworten_v42_hf_A` → `1.3.1_konsum_verantworten_v42`. */
function einheitOrdner(sit: SituationJson): string {
  return (sit.id || '').replace(/_hf_[A-Za-z]$/, '')
}

/** QR-Inhalt der Medien-Spur: Landing-Seite der Einheit mit Anker des Hefts (ENTSCHEIDE E5). */
function qrInhalt(sit: SituationJson): string {
  return landingUrl(einheitOrdner(sit), sit.buchstabe)
}

/** Ausgeschriebene Kurzadresse unter dem QR — ohne Protokoll, zum Abtippen. */
function kurzadresse(url: string): string {
  return url.replace(/^https?:\/\//, '')
}

const TYP_ETIKETT: Record<string, string> = {
  artikel: 'Artikel', grafik: 'Grafik', video: 'Video', audio: 'Audio', rechtstext: 'Rechtstext', webseite: 'Webseite',
}

function typEtikett(q: Quelle): string {
  return TYP_ETIKETT[q.typ] || q.typ
}

const MONATE = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']

/** `2026-06-15` → `15.06.2026`, `2026-09` → `September 2026`; alles andere («o. D.», `2024`) unverändert. */
function datumCh(d?: string): string {
  if (!d) return ''
  const tag = /^(\d{4})-(\d{2})-(\d{2})$/.exec(d)
  if (tag) return `${tag[3]}.${tag[2]}.${tag[1]}`
  const monat = /^(\d{4})-(\d{2})$/.exec(d)
  if (monat) return `${MONATE[Number(monat[2]) - 1] ?? monat[2]} ${monat[1]}`
  return d
}

/** «421 Wörter» bzw. «5:54 min». */
function laenge(q: Quelle): string {
  if (q.dauer_sek) return `${Math.floor(q.dauer_sek / 60)}:${String(q.dauer_sek % 60).padStart(2, '0')} min`
  if (q.woerter) return `${q.woerter} Wörter`
  return ''
}

/**
 * Zeile «Länge» der Quellenkarte (S. 3). Eine Grafik hat keine Länge im Sinn von
 * «114 Wörter» — dort steht der Umfang: «1 Seite, rund 114 Wörter Text».
 */
function laengeZeile(q: Quelle): { etikett: string; wert: string } {
  if (q.typ === 'grafik') return { etikett: 'Umfang', wert: `1 Seite${q.woerter ? `, rund ${q.woerter} Wörter Text` : ''}` }
  return { etikett: 'Länge', wert: laenge(q) }
}

/** Absätze (Text) oder «mm:ss–mm:ss» (Audio/Video). */
function verortung(q: Quelle): string {
  const v = q.verortung
  if (!v) return ''
  if (v.absaetze) return v.absaetze
  return v.von && v.bis ? `${v.von}–${v.bis}` : ''
}

/** «05:54» → 354 Sekunden; unlesbar → NaN. */
function sekunden(t: string): number {
  const m = /^(\d{1,2}):(\d{2})$/.exec(t.trim())
  return m ? Number(m[1]) * 60 + Number(m[2]) : NaN
}

/**
 * Was genau zu hören, zu sehen oder zu lesen ist (Vertiefungskarte, S. 4), aus `verortung`:
 * «Hören Sie 00:04–03:10», «Schauen Sie 00:35–06:29», «Lesen Sie: Abschnitt …».
 * Beginnt der Ausschnitt bei 00:00 und deckt die ganze Länge: «… den ganzen Beitrag».
 */
function vertiefungHinweis(q: Quelle): string {
  const v = q.verortung
  if (!v) return ''
  if (v.absaetze) return `Lesen Sie: ${v.absaetze}`
  if (!v.von || !v.bis) return ''
  const verb = q.typ === 'video' ? 'Schauen Sie' : q.typ === 'audio' ? 'Hören Sie' : 'Lesen Sie'
  const ganz = sekunden(v.von) === 0 && (!q.dauer_sek || sekunden(v.bis) === q.dauer_sek)
  return ganz ? `${verb} den ganzen Beitrag` : `${verb} ${v.von}–${v.bis}`
}

function herausgeberDatum(q: Quelle): string {
  return [q.herausgeber, datumCh(q.datum)].filter(Boolean).join(', ')
}

/**
 * Spaltenbreiten des Rasters (S. 3) in %: die Spalte «Aussage»/«Kernaussage» breit (38),
 * die letzte («→ Begriff») 22, die übrigen 18 und 22 — Rückmeldung Pietro 02.10.2026.
 * Ohne Aussage-Spalte oder bei anderer Spaltenzahl: gleich breit.
 */
function rasterBreiten(spalten: string[]): number[] | undefined {
  const a = spalten.findIndex((s) => /aussage/i.test(s))
  if (spalten.length !== 4 || a < 0 || a === 3) return undefined
  const rest = [18, 22]
  return spalten.map((_, i) => (i === a ? 38 : i === 3 ? 22 : rest.shift()!))
}

function pflichtQuelle(sit: SituationJson): Quelle | undefined {
  return sit.spur === 'mit_medien' ? sit.quellen?.find((q) => q.rolle === 'pflicht') : undefined
}

function leitfrage(sit: SituationJson, nr: number): Leitfrage | undefined {
  return sit.leitfragen?.find((l) => l.nr === nr)
}

/** Kompetenz-Sätze: aufgelöstes `nrlp.kompetenzen`, sonst der primäre `kompetenz_text` (wie DocS). */
function kompetenzen(sit: SituationJson): { nr: string; text: string }[] {
  const resolved = sit.nrlp?.kompetenzen?.filter((k) => k && k.text)
  if (resolved && resolved.length) return resolved
  return sit.nrlp?.kompetenz_text ? [{ nr: sit.nrlp?.nr || '', text: sit.nrlp.kompetenz_text }] : []
}

/** Guillemets nur setzen, wenn die Daten sie nicht schon mitbringen (wie DocS). */
function inGuillemets(s: string): string {
  return /^«.*»$/.test(s.trim()) ? s.trim() : `«${s.trim()}»`
}

/** Lehrmittel-Abschnitt aus `quellen_anker`, dessen `ref` am Anfang von `knoten_ref` steht («Kap. 2.7 | …»). */
function ankerZu(sit: SituationJson, knotenRef?: string) {
  if (!knotenRef) return undefined
  return sit.quellen_anker?.find((a) => a.ref && knotenRef.startsWith(a.ref))
}

/** Zeilenhöhe des Rasters (S. 3): eine Aussage in Handschrift passt in die Zelle. */
const RASTER_ZEILE_MM = 18
/** Zeilenhöhe der Denkhilfe (S. 4, Spur ohne Medien). */
const DENKHILFE_ZEILE_MM = 17

// ── Bausteine ──────────────────────────────────────────────────────────────

function Mini({ children }: { children: ReactNode }) {
  return <div className="v42-mini">{children}</div>
}

/**
 * Schreibfeld mit genau der verlangten Höhe. Das Bestands-<Schreibfeld> (chrome.tsx)
 * rechnet die Höhe in Zeilen um und wird dadurch höher als `feld_hoehe_mm` — im Heft
 * zählt die Sollhöhe. Klasse `feld` bleibt, damit Speichern und Schreibprotokoll der
 * Standalone-Datei das Feld finden. Nur im Modus `fill` editierbar.
 */
function Feld({ hoeheMm, minMm, wert, onChange, editierbar, className }: {
  hoeheMm?: number
  /** Mindesthöhe; das Feld wächst in den freien Platz seines Blocks (`.v42-feld-waechst`). */
  minMm?: number
  wert: string
  onChange: (v: string) => void
  editierbar: boolean
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (ref.current && ref.current.innerText !== wert) ref.current.innerText = wert || ''
  }, [wert])
  const basis = className ? `feld ${className}` : 'feld v42-feld'
  return (
    <div
      ref={ref}
      className={minMm ? `${basis} v42-feld-waechst` : basis}
      style={minMm ? { minHeight: `${minMm}mm` } : hoeheMm ? { height: `${hoeheMm}mm` } : undefined}
      {...(editierbar
        ? {
            contentEditable: true,
            suppressContentEditableWarning: true,
            spellCheck: false,
            onInput: (e: FormEvent<HTMLDivElement>) => onChange((e.currentTarget as HTMLDivElement).innerText),
          }
        : {})}
    />
  )
}

/** Scaffold-Spalte rechts neben der Leitfrage: So gehen Sie vor · Satzanfänge · Ins Produkt. */
function ScaffoldSpalte({ sc }: { sc?: Leitfrage['scaffolding'] }) {
  const strategien = sc?.strategien?.filter(Boolean) ?? []
  const satzanfaenge = sc?.satzanfaenge?.filter(Boolean) ?? []
  const produkt = sc?.produkt?.trim() ?? ''
  if (!strategien.length && !satzanfaenge.length && !produkt) return null
  return (
    <aside className="v42-scaffold">
      {strategien.length > 0 && (
        <div>
          <Mini>So gehen Sie vor</Mini>
          <ul>{strategien.map((s, i) => <li key={i}>{s}</li>)}</ul>
        </div>
      )}
      {satzanfaenge.length > 0 && (
        <div>
          <Mini>Satzanfänge</Mini>
          {satzanfaenge.map((s, i) => <p key={i} className="v42-satz">{inGuillemets(s)}</p>)}
        </div>
      )}
      {produkt && (
        <div>
          <Mini>Ins Produkt</Mini>
          <p>{produkt}</p>
        </div>
      )}
    </aside>
  )
}

/**
 * Eine Leitfrage: links Frage, Meta-Zeile, optional ein Block vor dem Feld (Denkhilfe)
 * und das Schreibfeld; rechts die Scaffold-Spalte. Muster: LeitfrageItem in DocS.tsx.
 */
function LfBlock({ lf, feldKey, hoeheMm, props, vorFeld, wachsen }: {
  lf: Leitfrage
  feldKey: string
  /** Mindesthöhe des Schreibfelds (`feld_hoehe_mm`); das Feld wächst in den Block. */
  hoeheMm: number
  props: HeftSeiteProps
  vorFeld?: ReactNode
  /** Anteil am freien Platz der Seite (flex-grow des Blocks), z. B. 35 und 45 auf S. 2. */
  wachsen: number
}) {
  return (
    <section className="v42-lf v42-lf-waechst" style={{ flexGrow: wachsen }}>
      <div className="v42-lf-haupt">
        <div className="v42-lf-kopf">
          <span className="v42-lf-nr">LF{lf.nr}</span>
          <p className="v42-lf-text">{lf.text}</p>
        </div>
        <div className="v42-lf-meta">
          {lf.bloom && <Badge variant="outline">{lf.bloom}</Badge>}
          {lf.knoten_ref && <span className="v42-ref">{lf.knoten_ref}</span>}
          {lf.liefert && <span className="v42-liefert">→ liefert: {lf.liefert}</span>}
        </div>
        {vorFeld}
        <Feld
          minMm={hoeheMm}
          wert={props.edits[feldKey] || ''}
          onChange={(v) => props.onEdit(feldKey, v)}
          editierbar={props.mode === 'fill'}
        />
      </div>
      <ScaffoldSpalte sc={lf.scaffolding} />
    </section>
  )
}

/**
 * Leere Tabelle zum Ausfüllen (Raster S. 3, Denkhilfe S. 4). Feste Zeilenhöhe; jede
 * leere Zelle ist ein Feld, im Modus `fill` editierbar. `beispiel` füllt die erste
 * Zeile vor und kennzeichnet sie — gestrichelt und kursiv, weil das Heft
 * schwarz-weiss kopiert wird.
 */
function AusfuellTabelle({ spalten, leer, zeileMm, beispiel, keyPrefix, props, className, breiten }: {
  spalten: string[]
  leer: number
  zeileMm: number
  beispiel?: string[]
  keyPrefix: string
  props: HeftSeiteProps
  className: string
  /** Spaltenbreiten in %; ohne Angabe gleich breit. */
  breiten?: number[]
}) {
  const editierbar = props.mode === 'fill'
  return (
    <table className={`v42-tabelle ${className}`}>
      <colgroup>{spalten.map((_, i) => <col key={i} style={breiten ? { width: `${breiten[i]}%` } : undefined} />)}</colgroup>
      <thead>
        <tr>{spalten.map((s, i) => <th key={i}>{s}</th>)}</tr>
      </thead>
      <tbody>
        {beispiel && (
          <tr className="v42-beispiel" style={{ height: `${zeileMm}mm` }}>
            {spalten.map((_, c) => (
              <td key={c}>
                {c === 0 && <span className="v42-beispiel-tag">Beispiel</span>}
                {beispiel[c] ?? ''}
              </td>
            ))}
          </tr>
        )}
        {Array.from({ length: Math.max(0, leer) }, (_, r) => (
          <tr key={r} style={{ height: `${zeileMm}mm` }}>
            {spalten.map((_, c) => {
              const k = `${keyPrefix}${r + 1}_${c + 1}`
              return (
                <td key={c}>
                  <Feld
                    className="v42-zelle"
                    wert={props.edits[k] || ''}
                    onChange={(v) => props.onEdit(k, v)}
                    editierbar={editierbar}
                  />
                </td>
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

/**
 * Quellenkarte der Medien-Spur (S. 3): Etikett, Titel, Herausgeber + Datum, Kurzbeschrieb,
 * Verortung, Länge — und der einzige QR-Code des Hefts (25 mm) mit der Adresse darunter.
 */
function Quellenkarte({ q, sit }: { q: Quelle; sit: SituationJson }) {
  const ort = verortung(q)
  const { etikett, wert: lang } = laengeZeile(q)
  const url = qrInhalt(sit)
  return (
    <Kasten label={`Quelle · ${typEtikett(q)}`} className="v42-quellenkarte">
      <div className="v42-quellenkarte-zeile">
        <div className="v42-quellenkarte-text">
          <p className="v42-q-titel">{q.titel}</p>
          <p className="v42-q-herkunft">{herausgeberDatum(q)}</p>
          <p className="v42-q-beschrieb">{q.kurzbeschrieb}</p>
          <p className="v42-q-meta">
            {ort && <><strong>Ausschnitt:</strong> {ort}</>}
            {ort && lang && ' · '}
            {lang && <><strong>{etikett}:</strong> {lang}</>}
          </p>
        </div>
        <div className="v42-qr">
          <QrCode text={url} groesseMm={25} titel={`QR-Code zur Quelle: ${url}`} />
          <div className="v42-kurzadresse">{/* Umbruchstelle nach «/m/» (Nullbreite), damit die Adresse nicht mitten im Wort bricht. */}
            {kurzadresse(url).replace('/m/', '/m/​')}</div>
        </div>
      </div>
    </Kasten>
  )
}

/**
 * Karte einer Vertiefungsquelle (S. 4, Medien-Spur): Etikett, Titel, Herkunft, was genau
 * zu hören/sehen/lesen ist, Kurzbeschrieb, Leitfrage, Schreibfeld «Meine Antwort».
 * Die sieben Teile stehen immer (leer, wenn ein Wert fehlt): die Karten teilen sich über
 * `grid-template-rows: subgrid` dieselben Zeilen — gleich hoch, Felder auf gleicher Höhe.
 */
function VertiefungKarte({ q, feldKey, props }: { q: Quelle; feldKey: string; props: HeftSeiteProps }) {
  const lang = laenge(q)
  return (
    <div className="v42-vertiefung-karte">
      <div className="v42-etikett">{typEtikett(q)}{lang && ` · ${lang}`}</div>
      <div>
        <p className="v42-q-titel">{q.titel}</p>
        <p className="v42-q-herkunft">{herausgeberDatum(q)}</p>
      </div>
      <p className="v42-vertiefung-hinweis">{vertiefungHinweis(q)}</p>
      <p className="v42-vertiefung-kurz">{q.kurzbeschrieb}</p>
      <p className="v42-vertiefung-frage">{q.leitfrage_vertiefung}</p>
      <Mini>Meine Antwort</Mini>
      <Feld
        minMm={30}
        className="v42-feld"
        wert={props.edits[feldKey] || ''}
        onChange={(v) => props.onEdit(feldKey, v)}
        editierbar={props.mode === 'fill'}
      />
    </div>
  )
}

// ── Seite 1 · Herausforderung ──────────────────────────────────────────────

export function Seite1({ sit }: HeftSeiteProps) {
  const pflicht = pflichtQuelle(sit)
  // Der QR-Code steht nur auf S. 3 (Rückmeldung Pietro 02.10.2026); hier bleibt in der
  // Medien-Spur ein flacher Kurzeintrag. Situation und Wochenplan stehen in beiden Spuren
  // gleich gross, der Rest verteilt sich auf die Abstände (heft-1-4.css).
  const komp = kompetenzen(sit)
  const p = sit.persona
  const zahlen = sit.zahlen_tabelle ?? []
  const zahlenPaare: (typeof zahlen)[] = []
  for (let i = 0; i < zahlen.length; i += 2) zahlenPaare.push(zahlen.slice(i, i + 2))
  return (
    <>
      <header className="v42-s1-kopf">
        <SeitenKopf nr={1} titel="Herausforderung" />
        <h1 className="v42-titel">{sit.titel}</h1>
        {/* Zwei Zeilen mit Beschriftung links: Persona, dann Kompetenz(en) über die volle Breite. */}
        <div className="v42-s1-meta">
          <Mini>Persona</Mini>
          <p className="v42-persona">
            <strong>{p?.beruf}</strong>
            {(p?.betrieb || p?.ort) && <> · {[p?.betrieb, p?.ort].filter(Boolean).join(', ')}</>}
          </p>
          {komp.length > 0 && (
            <>
              <Mini>{komp.length > 1 ? 'Kompetenzen' : 'Kompetenz'}</Mini>
              <div>
                {komp.map((k, i) => (
                  <p key={i} className="v42-kompetenz">{k.nr && <strong>{k.nr} </strong>}{k.text}</p>
                ))}
              </div>
            </>
          )}
        </div>
      </header>

      <section className="v42-s1-situation">
        <p className="v42-situation-text">{sit.situation_text}</p>
        {zahlenPaare.length > 0 && (
          // Zwei Paare pro Zeile: halbiert die Höhe der Tabelle, Label ≤ 45 Zeichen passt.
          <table className="v42-zahlen">
            <tbody>
              {zahlenPaare.map((paar, i) => (
                <tr key={i}>
                  {paar.map((z, j) => [
                    <td key={`l${j}`} className="v42-zahlen-label">{z.label}</td>,
                    <td key={`w${j}`} className="v42-zahlen-wert">{z.wert}</td>,
                  ])}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <div className="v42-s1-fragen">
        <div className="leitfrage-callout v42-leitfrage">{sit.leitfrage}</div>
        {sit.mehrdeutigkeit?.trade_off && (
          <div className="v42-spannung">
            <Mini>Spannungsfeld</Mini>
            <p className="v42-spannung-titel">{sit.mehrdeutigkeit.trade_off}</p>
            {sit.mehrdeutigkeit.hint && <p className="v42-spannung-hint">{sit.mehrdeutigkeit.hint}</p>}
          </div>
        )}
      </div>

      {(sit.quellen_anker?.length ?? 0) > 0 && (
        <section className="v42-s1-ressourcen">
          <Mini>Im Lehrmittel</Mini>
          <ul>
            {sit.quellen_anker!.map((a, i) => (
              <li key={i}>
                <strong>{a.titel}</strong>
                {[a.unterueberschrift, a.ref, a.seiten].filter(Boolean).map((t, j) => <span key={j}> · {t}</span>)}
              </li>
            ))}
          </ul>
        </section>
      )}

      {pflicht && (
        // Flacher Kurzeintrag ohne QR: Titel, Herausgeber, Datum und der Verweis auf S. 3.
        <Kasten className="v42-s1-quelle">
          <Mini>{`Quelle für Seite 3 · ${typEtikett(pflicht)}`}</Mini>
          <div className="v42-s1-quelle-zeile">
            <p><strong>{pflicht.titel}</strong> · {herausgeberDatum(pflicht)}</p>
            <p className="v42-s1-quelle-verweis">→ QR-Code auf Seite 3</p>
          </div>
        </Kasten>
      )}

      {(sit.wochen_plan?.length ?? 0) > 0 && (
        <section className="v42-s1-woche">
          <Mini>Ihre Woche</Mini>
          <table className="v42-woche">
            <tbody>
              {sit.wochen_plan!.map((w, i) => (
                <tr key={i}><td className="v42-woche-label">{w.label}</td><td>{w.text}</td></tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      <p className="v42-anweisung">
        <strong>So starten Sie:</strong> Lesen Sie die Situation genau. Markieren Sie, was Sie noch
        nicht wissen oder können — am Ende des Hefts prüfen Sie es im Quer-Check (S. 8).
      </p>
    </>
  )
}

// ── Seite 2 · Wissensecke I ───────────────────────────────────────────────

export function Seite2(props: HeftSeiteProps) {
  const { sit } = props
  // LF1 und LF2 sind Kern: Eingaben teilen sich die Spuren — Schlüssel ohne Spur-Teil.
  const kern = `hf${sit.buchstabe || '?'}_`
  return (
    <>
      <SeitenKopf nr={2} titel="Wissensecke I" />
      {sit.leitfragen_intro && (
        <section className="v42-intro">
          <Mini>Ihr Weg durch die Leitfragen</Mini>
          <p>{sit.leitfragen_intro}</p>
        </section>
      )}
      {[1, 2].map((nr) => {
        const lf = leitfrage(sit, nr)
        if (!lf) return null
        // feld_hoehe_mm ist die Mindesthöhe; LF1 und LF2 teilen den freien Platz im
        // Verhältnis ihrer Mindesthöhen (35 : 45).
        const min = lf.feld_hoehe_mm || (nr === 1 ? 35 : 45)
        return <LfBlock key={nr} lf={lf} feldKey={`${kern}lf_${nr}`} hoeheMm={min} wachsen={min} props={props} />
      })}
    </>
  )
}

// ── Seite 3 · Quelle ───────────────────────────────────────────────────────

export function Seite3(props: HeftSeiteProps) {
  const { sit, ns } = props
  const lf = sit.leitfragen?.find((l) => l.antwortform === 'raster') ?? leitfrage(sit, 3)
  const raster = lf?.raster
  const pflicht = pflichtQuelle(sit)
  const auftrag = pflicht ? pflicht.auftrag : raster?.auftrag
  const anker = pflicht ? undefined : ankerZu(sit, raster?.knoten_ref)
  const spalten = raster?.spalten ?? []
  const zeilen = raster?.zeilen ?? 4
  // Medien-Spur: keine Beispielzeile (Leitfaden §4.3), auch wenn die Daten eine trügen.
  const beispiel = pflicht ? undefined : raster?.beispielzeile
  return (
    <>
      <SeitenKopf nr={3} titel="Quelle" />

      {pflicht ? (
        <Quellenkarte q={pflicht} sit={sit} />
      ) : raster?.knoten_ref ? (
        <Kasten label="Lehrmittel-Abschnitt" className="v42-quellenkarte">
          <p className="v42-q-titel">{raster.knoten_ref.replace(/\s*\|\s*/g, ' · ')}</p>
          {anker && <p className="v42-q-herkunft">{[anker.titel, anker.unterueberschrift].filter(Boolean).join(' · ')}</p>}
        </Kasten>
      ) : null}

      {auftrag && (
        <section className="v42-auftrag">
          <Mini>Auftrag</Mini>
          <p>{auftrag}</p>
          {spalten.length > 0 && <p className="v42-s3-hilfe">→ Hilfe: Methodenkarte zum Raster auf S. 6</p>}
        </section>
      )}

      {spalten.length > 0 && (
        <section className="v42-raster-block">
          <Mini>Raster{beispiel ? ' · die erste Zeile ist ein Beispiel' : ''}</Mini>
          <AusfuellTabelle
            spalten={spalten}
            leer={zeilen - (beispiel ? 1 : 0)}
            zeileMm={RASTER_ZEILE_MM}
            beispiel={beispiel}
            keyPrefix={`${ns}lf_3_raster_`}
            props={props}
            className="v42-raster"
            breiten={rasterBreiten(spalten)}
          />
        </section>
      )}

      {/* Befund: mindestens 25 mm, nimmt den Rest der Seite. */}
      {lf && <LfBlock lf={lf} feldKey={`${ns}lf_${lf.nr}`} hoeheMm={lf.feld_hoehe_mm || 25} wachsen={1} props={props} />}
    </>
  )
}

// ── Seite 4 · Wissensecke II ──────────────────────────────────────────────

function Denkhilfe({ k, props }: { k: KastenS4; props: HeftSeiteProps }) {
  const spalten = k.spalten?.filter(Boolean) ?? []
  return (
    <Kasten label={k.titel} className="v42-denkhilfe">
      {spalten.length > 0 && (
        <AusfuellTabelle
          spalten={spalten}
          leer={3}
          zeileMm={DENKHILFE_ZEILE_MM}
          keyPrefix={`${props.ns}denkhilfe_`}
          props={props}
          className="v42-denkhilfe-tabelle"
        />
      )}
      {k.hinweis && <p className="v42-hinweis">{k.hinweis}</p>}
    </Kasten>
  )
}

function Vertiefung({ k, props }: { k: KastenS4; props: HeftSeiteProps }) {
  const quellen = props.sit.quellen?.filter((q) => q.rolle === 'vertiefung').slice(0, 2) ?? []
  if (!quellen.length) return null
  return (
    <Kasten label={k.titel} className="v42-vertiefung">
      <div className="v42-vertiefung-raster">
        {quellen.map((q, i) => <VertiefungKarte key={q.id} q={q} feldKey={`${props.ns}vertiefung_${i}`} props={props} />)}
      </div>
      <p className="v42-hinweis">
        {k.hinweis || 'Die Links zu beiden Quellen stehen auf der QR-Seite (Code auf Seite 3).'}
      </p>
    </Kasten>
  )
}

export function Seite4(props: HeftSeiteProps) {
  const { sit, ns } = props
  const lf = sit.leitfragen?.find((l) => !!l.pol_typ) ?? leitfrage(sit, 4)
  const k = sit.kasten_s4
  const hoehe = lf?.feld_hoehe_mm || (sit.spur === 'mit_medien' ? 60 : 45)
  return (
    <>
      <SeitenKopf nr={4} titel="Wissensecke II" />
      {lf && (
        <LfBlock
          lf={lf}
          feldKey={`${ns}lf_${lf.nr}`}
          hoeheMm={hoehe}
          wachsen={1}
          props={props}
          // Denkhilfe VOR dem Schreibfeld: erst füllen, dann schreiben.
          vorFeld={k?.typ === 'denkhilfe' ? <Denkhilfe k={k} props={props} /> : undefined}
        />
      )}
      {/* Vertiefung NACH dem Schreibfeld — freiwillig. */}
      {k?.typ === 'vertiefung' && <Vertiefung k={k} props={props} />}
    </>
  )
}
