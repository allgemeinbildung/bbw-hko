import type { CSSProperties } from 'react'
import type { ProduktBild, ProduktBildBlock } from '../../../../lib/einheiten/types'

/**
 * Heft v4.2 — das Handlungsprodukt als «Bild»: ein von Hand ausgefülltes Blatt, aus den
 * Daten gezeichnet (kein Pixelbild). Zwei Verwendungen am Handlungsprodukt:
 *  - `beispielbild` → Heft S. 6 unter den Methodenkarten, Grösse `klein` ({@link BeispielBand}),
 *  - `loesungsbild` → Lösungsblatt der Lehrperson, Grösse `gross` (DocLoesungsblattV42.tsx).
 * Spiegel in src/lib/einheiten/docx-produkt-bild-v42.ts, Stil in src/styles/v42/produkt-bild.css.
 *
 * Schreibschrift-Anmutung über lokal vorhandene Schriften (kein Webfont). Markierungen sind
 * Konturen, keine Farben — die Hefte werden schwarz-weiss kopiert. `hinweis` wird hier nie
 * gedruckt; das Lösungsblatt setzt ihn selbst in den Lehrpersonen-Kasten.
 */

/** Zeichen einer Markierung, bestimmt durch die Position in `legende`. */
export type MarkeForm = 'voll' | 'leer' | 'halb'
const FORMEN: MarkeForm[] = ['voll', 'leer', 'halb']

/** 1. Legendeneintrag → gefüllter, 2. → leerer, 3. → halb gefüllter Kreis; sonst keins. */
export function markeForm(bild: ProduktBild, key: string | undefined): MarkeForm | null {
  if (!key) return null
  const i = (bild.legende || []).findIndex((l) => l.key === key)
  return i >= 0 && i < FORMEN.length ? FORMEN[i] : null
}

/** Legendentext zu einem Schlüssel (für Screenreader-Beschriftung). */
function markeText(bild: ProduktBild, key: string | undefined): string {
  return (bild.legende || []).find((l) => l.key === key)?.text || ''
}

/** Zahl in einer Tabellenzelle («950», «−52», «+28», «1 200.–») → rechtsbündig. */
export function istZahl(s: string): boolean {
  return /^[−+\-]?\s*[\d'’ .,]+[–-]?$/.test((s || '').trim())
}

function blockZeichen(b: ProduktBildBlock): number {
  const liste = (b.eintraege || []).reduce((n, e) => n + (e.text || '').length + (e.notiz || '').length * 0.8, 0)
  const tabelle = (b.zeilen || []).reduce((n, z) => n + z.zellen.join('  ').length, 0)
  return liste + tabelle + (b.titel || '').length
}

/**
 * Relative Spaltenbreiten der Blöcke: nach Textmenge, eine Tabelle etwas breiter
 * (sie bricht nicht so gut um wie eine Liste). Gleiche Menge → gleiche Breite.
 * `tabellenBonus`: im grossen Blatt braucht die Tabelle mehr, weil die Zahlenspalten
 * mit der Schrift wachsen, der Text daneben aber umbrechen kann.
 */
export function blockGewichte(bloecke: ProduktBildBlock[], tabellenBonus = 0.3): number[] {
  const n = bloecke.length
  if (!n) return []
  const zeichen = bloecke.map(blockZeichen)
  const summe = zeichen.reduce((a, b) => a + b, 0) || 1
  return bloecke.map((b, i) => {
    const w = 0.6 + (0.4 * n * zeichen[i]) / summe + (b.kopf?.length || b.zeilen?.length ? tabellenBonus : 0)
    return Math.round(Math.min(1.9, Math.max(0.75, w)) * 100) / 100
  })
}

/** Zuschlag für Tabellen-Blöcke je Grösse — HTML und Word teilen ihn. */
export function tabellenBonus(groesse: 'klein' | 'gross'): number {
  return groesse === 'gross' ? 0.8 : 0.3
}

/** Kreis als kleines Inline-SVG — Kontur in Tintenfarbe, Füllung nach Form. */
export function MarkeSvg({ form, label }: { form: MarkeForm; label?: string }) {
  return (
    <svg
      className="v42-pb-marke"
      viewBox="0 0 10 10"
      role={label ? 'img' : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : true}
    >
      {form === 'halb' && <path d="M5 1 A4 4 0 0 0 5 9 Z" fill="currentColor" />}
      <circle cx="5" cy="5" r="4" fill={form === 'voll' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.1" />
    </svg>
  )
}

function Liste({ bild, block }: { bild: ProduktBild; block: ProduktBildBlock }) {
  const eintraege = (block.eintraege || []).filter((e) => e && e.text)
  return (
    <ul className="v42-pb-liste">
      {eintraege.map((e, i) => {
        const form = markeForm(bild, e.marke)
        return (
          <li key={i} className={form ? 'mit-marke' : undefined}>
            {form && <MarkeSvg form={form} label={markeText(bild, e.marke)} />}
            <span className="v42-pb-text">
              {e.text}
              {e.notiz && <span className="v42-pb-notiz">{e.notiz}</span>}
            </span>
          </li>
        )
      })}
    </ul>
  )
}

function Tabelle({ bild, block }: { bild: ProduktBild; block: ProduktBildBlock }) {
  const zeilen = (block.zeilen || []).filter((z) => z && z.zellen?.length)
  const spalten = Math.max(block.kopf?.length || 0, ...zeilen.map((z) => z.zellen.length))
  const mitMarke = zeilen.some((z) => markeForm(bild, z.marke))
  return (
    <table className="v42-pb-tabelle">
      {block.kopf?.length ? (
        <thead>
          <tr>
            {mitMarke && <th className="v42-pb-mspalte" aria-label="Markierung" />}
            {Array.from({ length: spalten }, (_, i) => (
              <th key={i} className={i > 0 ? 'zahl' : undefined}>{block.kopf![i] ?? ''}</th>
            ))}
          </tr>
        </thead>
      ) : null}
      <tbody>
        {zeilen.map((z, zi) => {
          const form = markeForm(bild, z.marke)
          return (
            <tr key={zi} className={z.stark ? 'stark' : undefined}>
              {mitMarke && <td className="v42-pb-mspalte">{form && <MarkeSvg form={form} label={markeText(bild, z.marke)} />}</td>}
              {Array.from({ length: spalten }, (_, i) => {
                const t = z.zellen[i] ?? ''
                return <td key={i} className={i > 0 && istZahl(t) ? 'zahl' : undefined}>{t}</td>
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

/**
 * Das Blatt: Kopfzeile (Titel + Legende), darunter die Blöcke nebeneinander.
 * `klein` für die Heftseite, `gross` für das Lösungsblatt.
 */
export function ProduktBildBlatt({ bild, groesse }: { bild: ProduktBild; groesse: 'klein' | 'gross' }) {
  const bloecke = (bild.bloecke || []).filter(Boolean)
  const legende = (bild.legende || []).slice(0, FORMEN.length)
  const gewichte = blockGewichte(bloecke, tabellenBonus(groesse))
  // Höchstens drei Spalten; mehr Blöcke brechen in die nächste Zeile um.
  const spalten = bloecke.length > 3 ? '1fr 1fr 1fr' : gewichte.map((g) => `${g}fr`).join(' ')
  return (
    <div className={`v42-pb-blatt v42-pb-${groesse}`}>
      <div className="v42-pb-kopf">
        <div className="v42-pb-titel">{bild.titel}</div>
        {legende.length > 0 && (
          <ul className="v42-pb-legende" aria-label="Legende">
            {legende.map((l, i) => (
              <li key={l.key}>
                <MarkeSvg form={FORMEN[i]} />
                <span>{l.text}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="v42-pb-bloecke" style={{ gridTemplateColumns: spalten } as CSSProperties}>
        {bloecke.map((b, i) => (
          <section className="v42-pb-block" key={i}>
            <div className="v42-pb-blocktitel">{b.titel}</div>
            {b.kopf?.length || b.zeilen?.length ? <Tabelle bild={bild} block={b} /> : <Liste bild={bild} block={b} />}
          </section>
        ))}
      </div>
    </div>
  )
}

/** Heft S. 6: Band unter den Methodenkarten mit dem Beispielblatt (`klein`). */
export function BeispielBand({ bild }: { bild: ProduktBild }) {
  return (
    <section className="v42-pb-band">
      <div className="v42-pb-bandkopf">
        <span className="v42-kasten-label v42-pb-label">So kann Ihr Produkt aussehen</span>
        <span className="v42-pb-unterzeile">Beispiel an einem anderen Fall — bei Ihnen zählt die Form, nicht der Inhalt.</span>
      </div>
      <ProduktBildBlatt bild={bild} groesse="klein" />
    </section>
  )
}
