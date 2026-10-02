import { Fragment, type CSSProperties } from 'react'
import type { ProduktBild, ProduktBildBlock } from '../../../../lib/einheiten/types'

/**
 * Heft v4.2 — das Handlungsprodukt als «Bild»: ein von Hand ausgefülltes Blatt, aus den
 * Daten gezeichnet (kein Pixelbild). Zwei Verwendungen am Handlungsprodukt:
 *  - `beispielbild` → Heft S. 6 unter den Methodenkarten, Grösse `klein` ({@link BeispielBand}),
 *  - `loesungsbild` → Dokument «Lösungen» der Lehrperson, Grösse `gross`, Einträge grün
 *    (`loesung`, DocLoesungenV42.tsx).
 * Spiegel in src/lib/einheiten/docx-produkt-bild-v42.ts, Stil in src/styles/v42/produkt-bild.css.
 *
 * Schreibschrift-Anmutung über lokal vorhandene Schriften (kein Webfont). Markierungen sind
 * Konturen, keine Farben — die Hefte werden schwarz-weiss kopiert. `hinweis` wird hier nie
 * gedruckt; das Dokument «Lösungen» setzt ihn selbst über das Blatt.
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
  // E26: Fliesstext und Wechselrede zählen wie Listentext. Ohne diese Felder bleibt die Summe, wie sie war.
  const text = (b.text || []).reduce((n, t) => n + (t || '').length, 0)
  const wechsel = (b.wechsel || []).reduce((n, w) => n + (w?.wer || '').length + (w?.text || '').length, 0)
  return liste + tabelle + text + wechsel + (b.titel || '').length
}

/** Die vier Blockarten (E26). Tabelle vor Wechselrede vor Fliesstext; sonst Liste — wie bisher. */
export type BlockArt = 'tabelle' | 'wechsel' | 'text' | 'liste'
export function blockArt(b: ProduktBildBlock): BlockArt {
  if (b.kopf?.length || b.zeilen?.length) return 'tabelle'
  if (b.wechsel?.length) return 'wechsel'
  if (b.text?.length) return 'text'
  return 'liste'
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
export function MarkeSvg({ form, label, style }: { form: MarkeForm; label?: string; style?: CSSProperties }) {
  return (
    <svg
      className="v42-pb-marke"
      style={style}
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

/**
 * Abstände der Blockarten `text` und `wechsel` (E26) je Grösse. Inline statt in
 * produkt-bild.css: das Stylesheet ist in jedes exportierte HTML eingebettet — eine neue
 * Regel dort änderte die Datei jeder bestehenden Einheit. Klassen (`v42-pb-text`,
 * `v42-pb-notiz`) sind die der Liste: gleiche Schrift, im Dokument «Lösungen» grün.
 */
const E26_ABSTAND: Record<'klein' | 'gross', { absatz: string; beitrag: string; spalte: string }> = {
  klein: { absatz: '0.7mm', beitrag: '0.35mm', spalte: '1.2mm' },
  gross: { absatz: '1.8mm', beitrag: '1.6mm', spalte: '2.5mm' },
}

/** Fliesstext: Absätze in derselben Schreibschrift wie die Listen. */
function Fliesstext({ block, groesse }: { block: ProduktBildBlock; groesse: 'klein' | 'gross' }) {
  const absaetze = (block.text || []).filter(Boolean)
  return (
    <div>
      {absaetze.map((t, i) => (
        <p key={i} className="v42-pb-text" style={{ margin: i < absaetze.length - 1 ? `0 0 ${E26_ABSTAND[groesse].absatz}` : 0 }}>{t}</p>
      ))}
    </div>
  )
}

/** Wechselrede: je Beitrag der Sprecher links (fett, klein), der Beitrag rechts; Markierung wie bei Listen. */
function Wechsel({ bild, block, groesse }: { bild: ProduktBild; block: ProduktBildBlock; groesse: 'klein' | 'gross' }) {
  const beitraege = (block.wechsel || []).filter((w) => w && w.text)
  const mitMarke = beitraege.some((w) => markeForm(bild, w.marke))
  const a = E26_ABSTAND[groesse]
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `${mitMarke ? '0.95em ' : ''}max-content 1fr`, columnGap: a.spalte, rowGap: a.beitrag, alignItems: 'start' }}>
      {beitraege.map((w, i) => {
        const form = markeForm(bild, w.marke)
        return (
          <Fragment key={i}>
            {mitMarke && <span>{form && <MarkeSvg form={form} label={markeText(bild, w.marke)} style={{ marginTop: '0.22em' }} />}</span>}
            <span className="v42-pb-notiz" style={{ fontWeight: 700 }}>{w.wer}</span>
            <span className="v42-pb-text">{w.text}</span>
          </Fragment>
        )
      })}
    </div>
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
 * `klein` für die Heftseite, `gross` für das Dokument «Lösungen». `loesung`: die
 * Einträge (Text, Notizen, Zellen, Markierungen) in Lösungsgrün — Titel, Legende und
 * Spaltenköpfe bleiben, wie sie sind. Das Beispielblatt im Heft (S. 6) setzt es nie.
 */
export function ProduktBildBlatt({ bild, groesse, loesung = false }: { bild: ProduktBild; groesse: 'klein' | 'gross'; loesung?: boolean }) {
  const bloecke = (bild.bloecke || []).filter(Boolean)
  const legende = (bild.legende || []).slice(0, FORMEN.length)
  const gewichte = blockGewichte(bloecke, tabellenBonus(groesse))
  // Höchstens drei Spalten; mehr Blöcke brechen in die nächste Zeile um.
  const spalten = bloecke.length > 3 ? '1fr 1fr 1fr' : gewichte.map((g) => `${g}fr`).join(' ')
  return (
    <div className={`v42-pb-blatt v42-pb-${groesse}${loesung ? ' v42-pb-loesung' : ''}`}>
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
            {(() => {
              const art = blockArt(b)
              if (art === 'tabelle') return <Tabelle bild={bild} block={b} />
              if (art === 'wechsel') return <Wechsel bild={bild} block={b} groesse={groesse} />
              if (art === 'text') return <Fliesstext block={b} groesse={groesse} />
              return <Liste bild={bild} block={b} />
            })()}
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
