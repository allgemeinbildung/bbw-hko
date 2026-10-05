import type { ReactNode } from 'react'
import { A4Page, SectionHead, sitColors } from './chrome'
import { ProduktBildBlatt } from './heft-v42/produkt-bild'
import {
  LOESUNG_ERKLAERUNG, loesungenModell,
  type LoesungenModell, type LsAbschluss, type LsBeurteilen, type LsLeitfrage, type LsProdukt, type LsRaster, type LsZeile,
} from '../../../lib/einheiten/loesungen-v42'
import type { SituationJson } from '../../../lib/einheiten/types'

/**
 * Lösungen (v4.2, E19, nur Lehrperson): zu jedem Feld eines Hefts eine mögliche Lösung,
 * je Heft UND Spur ein Dokument. Lösungen grün, Aufgaben, Spaltenköpfe und Hinweise für die
 * Lehrperson schwarz bzw. grau. Layout frei, nicht das Heft der Lernenden.
 *
 * Was gezeigt wird, steht im Modell (src/lib/einheiten/loesungen-v42.ts), das auch der
 * Word-Builder liest (src/lib/einheiten/docx-loesungen-v42.ts). Stil: src/styles/v42/loesungen.css.
 *
 * `.a4-page-body` hat feste Höhe und `overflow: hidden` — nichts fliesst von selbst weiter.
 * Darum fest eine Seite je Abschnitt (S. 2 · S. 3 · S. 4 · Produkt · Abschluss), der Kopf auf
 * der ersten. Geprüft mit `node scripts/messen-v42.mjs`.
 */

/** Grüner Text = mögliche Lösung. */
function L({ children }: { children: ReactNode }) {
  return <span className="v42-ls-l">{children}</span>
}

function Frage({ nr, text }: { nr: number; text: string }) {
  return (
    <p className="v42-ls-frage">
      <span className="v42-ls-lf">LF{nr}</span>
      {text}
    </p>
  )
}

function Zeilen({ zeilen, hinweis }: { zeilen: LsZeile[]; hinweis?: boolean }) {
  return (
    <dl className={hinweis ? 'v42-ls-zeilen v42-ls-hinweise' : 'v42-ls-zeilen'}>
      {zeilen.map((z, i) => (
        <div className="v42-ls-zeile" key={i}>
          {z.label && <dt>{z.label}</dt>}
          <dd>
            {hinweis ? z.text : <L>{z.text}</L>}
            {z.quelle && <span className="v42-ls-quelle">{z.quelle}</span>}
          </dd>
        </div>
      ))}
    </dl>
  )
}

function Kopf({ m }: { m: LoesungenModell }) {
  return (
    <header className="v42-ls-kopf">
      <div className="v42-ls-kopf-zeile">
        <h1 className="v42-ls-titel">{m.titel}</h1>
        <span className="v42-ls-nurlp">Nur für die Lehrperson</span>
      </div>
      {m.heftTitel && <p className="v42-ls-hefttitel">{m.heftTitel}</p>}
      <p className="v42-ls-legende">
        <span className="v42-ls-muster" aria-hidden="true" />
        {LOESUNG_ERKLAERUNG}
      </p>
    </header>
  )
}

function Seite2({ lfs }: { lfs: LsLeitfrage[] }) {
  return (
    <>
      <div className="v42-seitenkopf"><SectionHead num="02">Wissensecke I · Leitfragen 1 und 2</SectionHead></div>
      {lfs.map((lf) => (
        <section className="v42-ls-block" key={lf.nr}>
          <Frage nr={lf.nr} text={lf.text} />
          <Zeilen zeilen={lf.zeilen} />
        </section>
      ))}
    </>
  )
}

function Tabelle({ spalten, zeilen, beispiel, breiten, className }: {
  spalten: string[]; zeilen: string[][]; beispiel?: string[]; breiten?: number[]; className?: string
}) {
  const n = Math.max(spalten.length, beispiel?.length ?? 0, ...zeilen.map((z) => z.length))
  return (
    <table className={className ? `v42-ls-tabelle ${className}` : 'v42-ls-tabelle'}>
      {breiten && (
        <colgroup>{breiten.map((b, i) => <col key={i} style={{ width: `${b}%` }} />)}</colgroup>
      )}
      <thead>
        <tr>{Array.from({ length: n }, (_, i) => <th key={i}>{spalten[i] ?? ''}</th>)}</tr>
      </thead>
      <tbody>
        {beispiel && (
          <tr className="v42-ls-beispiel">
            {Array.from({ length: n }, (_, i) => (
              <td key={i}>
                {beispiel[i] ?? ''}
                {i === 0 && <span className="v42-ls-bsp-marke">Beispiel im Heft</span>}
              </td>
            ))}
          </tr>
        )}
        {zeilen.map((z, zi) => (
          <tr key={zi}>{Array.from({ length: n }, (_, i) => <td key={i}><L>{z[i] ?? ''}</L></td>)}</tr>
        ))}
      </tbody>
    </table>
  )
}

function Seite3({ r }: { r: LsRaster }) {
  return (
    <>
      <div className="v42-seitenkopf"><SectionHead num="03">Quelle · Leitfrage {r.nr}</SectionHead></div>
      <Frage nr={r.nr} text={r.text} />
      {(r.quelle || r.stand) && (
        <p className="v42-ls-meta">
          {r.quelle}
          {r.stand && <>{r.quelle ? ' · ' : ''}Lösung geprüft am {r.stand}</>}
        </p>
      )}
      {r.spalten.length > 0 && (r.zeilen.length > 0 || r.beispiel) && (
        <section className="v42-ls-block">
          <div className="v42-ls-label">Raster</div>
          <Tabelle spalten={r.spalten} zeilen={r.zeilen} beispiel={r.beispiel} breiten={r.breiten} />
        </section>
      )}
      {r.befund && (
        <section className="v42-ls-block">
          <div className="v42-ls-label">Befund</div>
          <p className="v42-ls-text"><L>{r.befund}</L></p>
        </section>
      )}
      {r.hinweise.length > 0 && (
        <section className="v42-ls-block v42-ls-lpbox">
          <div className="v42-ls-label">Hinweise für die Lehrperson</div>
          <Zeilen zeilen={r.hinweise} hinweis />
        </section>
      )}
    </>
  )
}

function Seite4({ b }: { b: LsBeurteilen }) {
  return (
    <>
      <div className="v42-seitenkopf"><SectionHead num="04">Wissensecke II · Leitfrage {b.nr}</SectionHead></div>
      <Frage nr={b.nr} text={b.text} />
      {b.gutWenn.length > 0 && (
        <section className="v42-ls-block">
          <div className="v42-ls-label">Tragfähig, wenn …</div>
          <ul className="v42-ls-liste">{b.gutWenn.map((g, i) => <li key={i}>{g}</li>)}</ul>
          {b.tragfaehig && <p className="v42-ls-text">{b.tragfaehig}</p>}
        </section>
      )}
      {b.antworten.map((a, i) => (
        <section className="v42-ls-block" key={i}>
          <div className="v42-ls-label">Mögliche Antwort{b.antworten.length > 1 ? ` ${i + 1}` : ''}</div>
          <p className="v42-ls-text"><L>{a}</L></p>
        </section>
      ))}
      {b.nichtTragfaehig && (
        <section className="v42-ls-block">
          <div className="v42-ls-label">Nicht tragfähig</div>
          <p className="v42-ls-text">{b.nichtTragfaehig}</p>
        </section>
      )}
      {b.denkhilfe && (
        <section className="v42-ls-block">
          <div className="v42-ls-label">{b.denkhilfe.titel}</div>
          <Tabelle spalten={b.denkhilfe.spalten} zeilen={b.denkhilfe.zeilen} />
        </section>
      )}
      {b.vertiefungen.length > 0 && (
        <section className="v42-ls-block">
          <div className="v42-ls-label">{b.vertiefungTitel}</div>
          <div className="v42-ls-vertiefungen">
            {b.vertiefungen.map((v, i) => (
              <div className="v42-ls-vertiefung" key={i}>
                <p className="v42-ls-v-titel">{v.titel}</p>
                {v.herkunft && <p className="v42-ls-quelle-zeile">{v.herkunft}</p>}
                {v.frage && <p className="v42-ls-v-frage">{v.frage}</p>}
                <p className="v42-ls-text"><L>{v.erwartung}</L></p>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  )
}

function SeiteProdukt({ p }: { p: LsProdukt }) {
  return (
    <>
      <div className="v42-seitenkopf"><SectionHead num="07">Produkt{p.titel ? ` · ${p.titel}` : ''}</SectionHead></div>
      {p.hinweis && <p className="v42-ls-text v42-ls-produkt-hinweis">{p.hinweis}</p>}
      <ProduktBildBlatt bild={p.bild} groesse="gross" loesung />
    </>
  )
}

/** Das Transfer-Feld ist kein Begriff, sondern ein Feld — in Guillemets. */
const knoten = (k: string, a: LsAbschluss) => (k === a.transferTitel ? `«${k}»` : k)

function SeiteAbschluss({ a }: { a: LsAbschluss }) {
  return (
    <>
      <div className="v42-seitenkopf"><SectionHead num="08">Abschluss</SectionHead></div>
      {a.verbindungen.length > 0 && (
        <section className="v42-ls-block">
          <div className="v42-ls-label">Begriffsnetz · beschriftete Verbindungen</div>
          <ul className="v42-ls-liste v42-ls-netz">
            {a.verbindungen.map((v, i) => (
              <li key={i}>{knoten(v.von, a)} → {knoten(v.nach, a)}: <L>{v.text}</L></li>
            ))}
          </ul>
        </section>
      )}
      {a.eigeneKnoten.length > 0 && (
        <section className="v42-ls-block">
          <div className="v42-ls-label">Leere Knoten · aus dem Raster</div>
          <p className="v42-ls-text"><L>{a.eigeneKnoten.join(' · ')}</L></p>
        </section>
      )}
      {a.transfer && (
        <section className="v42-ls-block">
          <div className="v42-ls-label">Feld «{a.transferTitel}»</div>
          <p className="v42-ls-text"><L>{a.transfer}</L></p>
        </section>
      )}
      {a.quercheck.length > 0 && (
        <section className="v42-ls-block">
          <div className="v42-ls-label">Quer-Check</div>
          <dl className="v42-ls-paare">
            {a.quercheck.map((q, i) => (
              <div key={i}><dt>{q.frage}</dt><dd><L>{q.antwort}</L></dd></div>
            ))}
          </dl>
        </section>
      )}
      {a.mitnahme.length > 0 && (
        <section className="v42-ls-block">
          <div className="v42-ls-label">Das nehme ich mit</div>
          <dl className="v42-ls-zeilen">
            {a.mitnahme.map((x, i) => (
              <div className="v42-ls-zeile" key={i}><dt>{x.label}</dt><dd><L>{x.eintrag}</L></dd></div>
            ))}
          </dl>
        </section>
      )}
    </>
  )
}

/** Die Seiten in fester Folge; leere Abschnitte entfallen. */
function seitenVon(m: LoesungenModell): { key: string; inhalt: ReactNode }[] {
  const out: { key: string; inhalt: ReactNode }[] = []
  if (m.s2.length) out.push({ key: 's2', inhalt: <Seite2 lfs={m.s2} /> })
  if (m.s3) out.push({ key: 's3', inhalt: <Seite3 r={m.s3} /> })
  if (m.s4) out.push({ key: 's4', inhalt: <Seite4 b={m.s4} /> })
  if (m.produkt) out.push({ key: 'produkt', inhalt: <SeiteProdukt p={m.produkt} /> })
  if (m.abschluss) out.push({ key: 'abschluss', inhalt: <SeiteAbschluss a={m.abschluss} /> })
  return out
}

export function DocLoesungenV42({ sit, abteilung }: { sit: SituationJson; abteilung?: string }) {
  const m = loesungenModell(sit)
  if (!m) return null
  const seiten = seitenVon(m)
  return (
    <div className="v42-loesungen" style={sitColors(sit)}>
      {seiten.map((s, i) => (
        <A4Page
          key={s.key}
          sit={sit.buchstabe}
          abteilung={abteilung}
          docCode={m.docCode}
          docTitel={m.titel}
          sitLetter={sit.buchstabe}
          pageNum={i + 1}
          pageTotal={seiten.length}
          kompetenzNr={sit.nrlp?.nr}
          abgedeckteKompetenzen={sit.nrlp?.nr_primary}
        >
          <div className={`a4-page-body v42-seite v42-ls-seite v42-ls-${s.key}`}>
            {i === 0 && <Kopf m={m} />}
            {s.inhalt}
          </div>
        </A4Page>
      ))}
    </div>
  )
}
