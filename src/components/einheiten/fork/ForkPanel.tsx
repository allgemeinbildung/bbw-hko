/**
 * Fork-Pilot «Meine Fassung» — Leiste über der Vorschau der Workbench (nur kt1 + v4.2).
 *
 * Markieren → Auftrag + Kommentar → Bündel je Heft → abschicken → Vorschau im Heft →
 * Block für Block übernehmen. Alles, was sie in der Vorschau zeigt (Hervorhebung,
 * Hover, Auswahl), setzt sie als `data-fk-*`-Attribute direkt im DOM der Vorschau;
 * die Downloads rendern getrennt (renderToStaticMarkup) und sehen davon nichts.
 * Mitgeschickt werden nur Auftrag, Rohpfad, Kommentar und der eigene Text (Invariante 9).
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { AUFTRAEGE } from '../../../lib/fork/positivliste'
import { HINWEIS_START, HINWEIS_UPLOAD, VERMERK } from '../../../lib/fork/typen'
import type { AuftragKey, BuendelHeft, BuendelSicht, Entscheid, FassungsDatei, ForkProp, KommentarEingabe } from '../../../lib/fork/typen'
import { HEFT_LABEL, VERMERK_CSS, auftraegeFuer, heftVon, lesbar, pruefeDatei } from './fork-hilfe'

interface Props {
  fork: ForkProp
  /** Hülle der Bildschirmvorschau (`main.pages`). */
  pagesRef: RefObject<HTMLElement | null>
  /** Ändert sich, wenn die Vorschau ein anderes Dokument zeigt. */
  renderKey: string
  /** Wechselt die Vorschau auf das Heft, in dem ein Block liegt. */
  zeige: (heft: BuendelHeft) => void
}

type Buendel = Partial<Record<BuendelHeft, KommentarEingabe[]>>
interface Auswahl { datei: FassungsDatei; pfad: string; x: number; y: number; auftraege: AuftragKey[] }

const KOMMENTAR_MAX = 2000
const HEFTE: BuendelHeft[] = ['A', 'B', 'auftrag']
const STATUS_LABEL: Record<BuendelSicht['status'], string> = {
  offen: 'in Arbeit', vorschlag: 'Vorschlag bereit', unvollstaendig: 'unvollständig', fehler: 'Fehler', abgeschlossen: 'entschieden',
}
const speicherKey = (id: string) => `hko-fork:${id}`

function ladeBuendel(id: string): Buendel {
  try { const s = localStorage.getItem(speicherKey(id)); return s ? (JSON.parse(s) as Buendel) : {} } catch { return {} }
}
function geheZu(param: string, wert: string) {
  const u = new URL(window.location.href)
  u.search = ''
  u.searchParams.set(param, wert)
  window.location.assign(u.toString())
}
async function fehlerAus(res: Response): Promise<string> {
  try { const b = await res.json(); if (b?.fehler) return String(b.fehler) } catch { /* keine JSON-Antwort */ }
  return `Das hat nicht geklappt (Status ${res.status}). Bitte nochmals versuchen.`
}
const alleFelder = (wurzel: HTMLElement | null) => Array.from(wurzel?.querySelectorAll<HTMLElement>('[data-feld]') ?? [])

export default function ForkPanel({ fork, pagesRef, renderKey, zeige }: Props) {
  const { einheitId, modus } = fork
  const api = `/api/fassungen/${encodeURIComponent(einheitId)}`
  const [offen, setOffen] = useState(true)
  const [markieren, setMarkieren] = useState(false)
  const [auswahl, setAuswahl] = useState<Auswahl | null>(null)
  const [auftrag, setAuftrag] = useState<AuftragKey | ''>('')
  const [kommentar, setKommentar] = useState('')
  const [buendel, setBuendel] = useState<Buendel>(() => ladeBuendel(einheitId))
  const [texte, setTexte] = useState<Partial<Record<BuendelHeft, { text: string; datei: File | null }>>>({})
  const [sende, setSende] = useState<{ heft: BuendelHeft; start: number } | null>(null)
  const [sekunden, setSekunden] = useState(0)
  const [fehler, setFehler] = useState<string | null>(null)
  const [ueberlauf, setUeberlauf] = useState<number[]>([])
  const abbruch = useRef<AbortController | null>(null)

  const vorschauB = useMemo(
    () => (modus === 'vorschau' ? fork.fassung?.buendel.find((b) => b.id === fork.vorschauBuendelId) ?? null : null),
    [fork, modus],
  )
  const [entscheide, setEntscheide] = useState<Record<string, Entscheid>>(() => ({ ...(vorschauB?.entscheide ?? {}) }))
  const hell = useMemo(() => new Set(modus === 'vorschau' ? fork.vorgeschlagen : modus === 'fassung' ? fork.geaendert : []), [fork, modus])
  const imBuendel = useMemo(
    () => new Set(Object.values(buendel).flatMap((l) => (l ?? []).map((k) => `${k.datei}:${k.pfad}`))),
    [buendel],
  )

  useEffect(() => {
    try {
      if (Object.values(buendel).some((l) => l?.length)) localStorage.setItem(speicherKey(einheitId), JSON.stringify(buendel))
      else localStorage.removeItem(speicherKey(einheitId))
    } catch { /* privater Modus — dann ohne Gedächtnis */ }
  }, [buendel, einheitId])

  // Hervorhebung + Überlauf: nach jedem Rendern der Vorschau neu setzen bzw. messen.
  useEffect(() => {
    const wurzel = pagesRef.current
    if (!wurzel) return
    let raf = 0
    const pruefe = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        for (const el of alleFelder(wurzel)) {
          const f = el.getAttribute('data-feld') ?? ''
          el.toggleAttribute('data-fk-hl', hell.has(f))
          el.toggleAttribute('data-fk-mark', imBuendel.has(f))
          el.toggleAttribute('data-fk-sel', !!auswahl && f === `${auswahl.datei}:${auswahl.pfad}`)
        }
        const voll: number[] = []
        wurzel.querySelectorAll<HTMLElement>('.a4-page').forEach((s, i) => { if (s.scrollHeight > s.clientHeight + 2) voll.push(i + 1) })
        setUeberlauf((alt) => (alt.join() === voll.join() ? alt : voll))
      })
    }
    pruefe()
    const mo = new MutationObserver(pruefe)
    mo.observe(wurzel, { childList: true, subtree: true })
    return () => { mo.disconnect(); cancelAnimationFrame(raf) }
  }, [pagesRef, renderKey, hell, imBuendel, auswahl])

  // Markieren: Hover-Kontur und Klick auf Blöcke mit passendem Auftrag.
  const zielVon = useCallback((start: EventTarget | null) => {
    let el = start instanceof HTMLElement ? start.closest<HTMLElement>('[data-feld]') : null
    while (el) {
      const attr = el.getAttribute('data-feld') ?? ''
      const i = attr.indexOf(':')
      const datei = attr.slice(0, i) as FassungsDatei
      const pfad = attr.slice(i + 1)
      const auftraege = i > 0 ? auftraegeFuer(datei, pfad, fork.zielMuster) : []
      if (auftraege.length) return { el, datei, pfad, auftraege }
      el = el.parentElement?.closest<HTMLElement>('[data-feld]') ?? null
    }
    return null
  }, [fork.zielMuster])

  useEffect(() => {
    const wurzel = pagesRef.current
    if (!wurzel || !markieren) return
    let hover: HTMLElement | null = null
    const ueber = (e: MouseEvent) => {
      const z = zielVon(e.target)
      if (hover && hover !== z?.el) hover.removeAttribute('data-fk-hover')
      hover = z?.el ?? null
      hover?.setAttribute('data-fk-hover', '')
    }
    const klick = (e: MouseEvent) => {
      const z = zielVon(e.target)
      if (!z) return
      e.preventDefault()
      e.stopPropagation()
      setAuswahl({ datei: z.datei, pfad: z.pfad, x: e.clientX, y: e.clientY, auftraege: z.auftraege })
      setAuftrag(z.auftraege.length === 1 ? z.auftraege[0] : '')
      setKommentar('')
    }
    wurzel.setAttribute('data-fk-markieren', '')
    wurzel.addEventListener('mouseover', ueber)
    wurzel.addEventListener('click', klick, true)
    return () => {
      wurzel.removeAttribute('data-fk-markieren')
      wurzel.removeEventListener('mouseover', ueber)
      wurzel.removeEventListener('click', klick, true)
      hover?.removeAttribute('data-fk-hover')
    }
  }, [pagesRef, markieren, zielVon])

  // Uhr für den Wartezustand.
  useEffect(() => {
    if (!sende) return
    const t = setInterval(() => setSekunden(Math.round((Date.now() - sende.start) / 1000)), 1000)
    return () => clearInterval(t)
  }, [sende])

  const zumBuendel = () => {
    if (!auswahl || !auftrag || !kommentar.trim()) return
    const heft = heftVon(auswahl.datei)
    if (!heft) return
    const eintrag: KommentarEingabe = { auftrag, datei: auswahl.datei, pfad: auswahl.pfad, kommentar: kommentar.trim().slice(0, KOMMENTAR_MAX) }
    setBuendel((b) => ({ ...b, [heft]: [...(b[heft] ?? []).filter((k) => !(k.pfad === eintrag.pfad && k.auftrag === eintrag.auftrag)), eintrag] }))
    setAuswahl(null)
  }
  const entferne = (heft: BuendelHeft, i: number) => setBuendel((b) => ({ ...b, [heft]: (b[heft] ?? []).filter((_, j) => j !== i) }))

  const zeigeBlock = (datei: string, pfad: string, versuch = 0) => {
    const ziel = `${datei}:${pfad}`
    const felder = alleFelder(pagesRef.current)
    const el = felder.find((x) => x.getAttribute('data-feld') === ziel)
      ?? felder.find((x) => { const f = x.getAttribute('data-feld') ?? ''; return f.startsWith(`${ziel}.`) || ziel.startsWith(`${f}.`) })
    if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); return }
    const heft = heftVon(datei)
    if (versuch === 0 && heft) zeige(heft)
    if (versuch < 3) setTimeout(() => zeigeBlock(datei, pfad, versuch + 1), 250)
    else setFehler(`Der Block «${lesbar(datei, pfad)}» ist in dieser Ansicht nicht zu sehen (andere Spur oder nicht gedruckt).`)
  }

  const abschicken = async (heft: BuendelHeft) => {
    const liste = buendel[heft] ?? []
    if (!liste.length || sende) return
    const eigen = liste.some((k) => k.auftrag === 'eigener_text')
    const t = texte[heft]
    if (eigen && !t?.datei && !t?.text.trim()) { setFehler('Für «Eigenen Text verwenden» braucht es eine Datei oder einen eingefügten Text.'); return }
    const fd = new FormData()
    fd.append('heft', heft)
    fd.append('kommentare', JSON.stringify(liste))
    if (eigen && t?.datei) fd.append('datei', t.datei)
    else if (eigen && t?.text.trim()) fd.append('text', t.text)
    const ctrl = new AbortController()
    abbruch.current = ctrl
    setFehler(null)
    setSekunden(0)
    setSende({ heft, start: Date.now() })
    try {
      const res = await fetch(`${api}/buendel`, { method: 'POST', body: fd, signal: ctrl.signal })
      if (!res.ok) { setFehler(await fehlerAus(res)); return }
      const body = (await res.json()) as { buendel?: BuendelSicht[] }
      const erstes = body.buendel?.[0]
      if (!erstes) { setFehler('Die Antwort enthielt keinen Vorschlag. Bitte nochmals versuchen.'); return }
      setBuendel((b) => ({ ...b, [heft]: [] }))
      geheZu('vorschau', erstes.id)
    } catch (e: any) {
      setFehler(e?.name === 'AbortError' ? 'Abgebrochen. Ihr Bündel ist noch da.' : 'Netzwerkfehler — bitte nochmals versuchen.')
    } finally {
      abbruch.current = null
      setSende(null)
    }
  }

  const speichereEntscheid = async () => {
    if (!vorschauB || !Object.keys(entscheide).length) return
    setFehler(null)
    try {
      const res = await fetch(`${api}/entscheid`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buendel_id: vorschauB.id, entscheide }),
      })
      if (!res.ok) { setFehler(await fehlerAus(res)); return }
      geheZu('ansicht', 'fassung')
    } catch { setFehler('Netzwerkfehler — bitte nochmals versuchen.') }
  }

  const loescheFassung = async () => {
    if (!window.confirm('Ihre Fassung dieser Einheit samt allen Bündeln löschen? Das lässt sich nicht rückgängig machen.')) return
    setFehler(null)
    try {
      const res = await fetch(api, { method: 'DELETE' })
      if (!res.ok) { setFehler(await fehlerAus(res)); return }
      geheZu('ansicht', 'original')
    } catch { setFehler('Netzwerkfehler — bitte nochmals versuchen.') }
  }

  const v = vorschauB?.vorschlag ?? null
  const anbieten = vorschauB?.status === 'vorschlag' && !!v?.vollstaendig
  const offeneZahl = v ? v.ersetzungen.filter((e) => !entscheide[`${e.datei}:${e.pfad}`]).length : 0
  const verlauf = [...(fork.fassung?.buendel ?? [])].sort((a, b) => b.created_at.localeCompare(a.created_at))
  const hatBuendel = HEFTE.some((h) => buendel[h]?.length)
  const kannMarkieren = modus !== 'vorschau'

  return (
    <section className="fk-leiste" aria-label="Meine Fassung">
      <style>{FK_CSS + (modus === 'original' ? '' : VERMERK_CSS)}</style>
      <div className="fk-kopf">
        <strong>Meine Fassung</strong>
        <span className="fk-modus">{modus === 'original' ? 'Original' : modus === 'fassung' ? `Ihre Fassung · ${VERMERK}` : 'Vorschau eines Vorschlags'}</span>
        {kannMarkieren && (
          <button type="button" className={`fk-knopf${markieren ? ' an' : ''}`} aria-pressed={markieren}
            onClick={() => { setMarkieren((m) => !m); setAuswahl(null) }}>
            {markieren ? 'Markieren beenden' : 'Markieren'}
          </button>
        )}
        <button type="button" className="fk-link" onClick={() => setOffen((o) => !o)} aria-expanded={offen}>{offen ? 'einklappen' : 'ausklappen'}</button>
      </div>

      {offen && (
        <div className="fk-inhalt">
          {kannMarkieren && <p className="fk-hinweis">{HINWEIS_START}</p>}
          {markieren && <p className="fk-klein">Klicken Sie in der Vorschau auf einen Block, den Sie anpassen möchten. Wählbare Blöcke erhalten beim Überfahren eine Kontur.</p>}
          {fehler && <p className="fk-fehler" role="alert">{fehler}</p>}

          {modus !== 'original' && fork.warnungen.length > 0 && (
            <ul className="fk-warn">{fork.warnungen.map((w) => <li key={w.code}>{w.text}</li>)}</ul>
          )}
          {!!fork.bericht?.veraltet.length && (
            <p className="fk-warn">Original hat sich geändert: {fork.bericht.veraltet.length} Anpassung(en) werden nicht mehr angewendet ({fork.bericht.veraltet.map((e) => lesbar(e.datei, e.pfad)).join('; ')}).</p>
          )}
          {modus !== 'original' && ueberlauf.length > 0 && (
            <ul className="fk-warn">{ueberlauf.map((n) => <li key={n}>Seite {n} läuft über.</li>)}</ul>
          )}

          {kannMarkieren && hatBuendel && HEFTE.filter((h) => buendel[h]?.length).map((heft) => {
            const liste = buendel[heft] ?? []
            const eigen = liste.some((k) => k.auftrag === 'eigener_text')
            const t = texte[heft] ?? { text: '', datei: null }
            const wartet = sende?.heft === heft
            return (
              <div key={heft} className="fk-buendel">
                <div className="fk-buendel-kopf"><strong>Bündel {HEFT_LABEL[heft]}</strong> · {liste.length} Kommentar{liste.length === 1 ? '' : 'e'}</div>
                <ul>
                  {liste.map((k, i) => (
                    <li key={`${k.pfad}-${k.auftrag}`}>
                      <button type="button" className="fk-link" onClick={() => zeigeBlock(k.datei, k.pfad)}>{lesbar(k.datei, k.pfad)}</button>
                      {' '}<span className="fk-chip">{AUFTRAEGE[k.auftrag].label}</span>
                      <div className="fk-klein">{k.kommentar}</div>
                      <button type="button" className="fk-link" disabled={!!sende} onClick={() => entferne(heft, i)}>entfernen</button>
                    </li>
                  ))}
                </ul>
                {eigen && (
                  <div className="fk-eigen">
                    <p className="fk-hinweis">{HINWEIS_UPLOAD} Die Fassung gilt dann nur für die Spur ohne Medien.</p>
                    <label className="fk-klein">Datei (.docx, .pdf, .txt, höchstens 5 MB){' '}
                      <input type="file" accept=".docx,.pdf,.txt" disabled={!!sende} onChange={(e) => {
                        const f = e.target.files?.[0] ?? null
                        const err = f ? pruefeDatei(f) : null
                        if (err) { setFehler(err); e.target.value = ''; return }
                        setFehler(null)
                        setTexte((x) => ({ ...x, [heft]: { ...t, datei: f } }))
                      }} />
                    </label>
                    <textarea rows={4} placeholder="… oder Text hier einfügen (höchstens 20 000 Zeichen werden verwendet)" value={t.text} disabled={!!sende || !!t.datei}
                      onChange={(e) => setTexte((x) => ({ ...x, [heft]: { ...t, text: e.target.value } }))} />
                  </div>
                )}
                {wartet ? (
                  <p className="fk-warten" role="status">Vorschlag wird erstellt … {sekunden} s (das kann 2–4 Minuten dauern){' '}
                    <button type="button" className="fk-link" onClick={() => abbruch.current?.abort()}>Abbrechen</button></p>
                ) : (
                  <button type="button" className="fk-knopf haupt" disabled={!!sende} onClick={() => abschicken(heft)}>Bündel {HEFT_LABEL[heft]} abschicken</button>
                )}
              </div>
            )
          })}

          {modus === 'vorschau' && !vorschauB && <p className="fk-fehler">Dieses Bündel gibt es nicht mehr.</p>}
          {vorschauB && (
            <div className="fk-vorschau">
              <div className="fk-buendel-kopf"><strong>Vorschlag {HEFT_LABEL[vorschauB.heft]}</strong> · {STATUS_LABEL[vorschauB.status]}</div>
              {vorschauB.status === 'fehler' && <p className="fk-fehler">{vorschauB.meldung ?? 'Der Vorschlag konnte nicht erstellt werden.'}</p>}
              {v?.hinweis && <p className="fk-klein">{v.hinweis}</p>}
              {vorschauB.status === 'unvollstaendig' && (
                <p className="fk-warn">Der Vorschlag ist unvollständig und kann nicht übernommen werden. Diese abhängigen Felder fehlen: {v?.fehlend.map((p) => lesbar(null, p)).join('; ') || '–'}</p>
              )}
              {v && v.ersetzungen.length > 0 && (
                <ul>
                  {v.ersetzungen.map((e) => {
                    const k = `${e.datei}:${e.pfad}`
                    return (
                      <li key={k} className={entscheide[k] ? `fk-${entscheide[k]}` : ''}>
                        <button type="button" className="fk-link" onClick={() => zeigeBlock(e.datei, e.pfad)}>{lesbar(e.datei, e.pfad)}</button>
                        <div className="fk-klein">{e.begruendung}</div>
                        {anbieten && (
                          <span className="fk-wahl">
                            <button type="button" className={`fk-knopf${entscheide[k] === 'angenommen' ? ' an' : ''}`} onClick={() => setEntscheide((x) => ({ ...x, [k]: 'angenommen' }))}>Übernehmen</button>
                            <button type="button" className={`fk-knopf${entscheide[k] === 'verworfen' ? ' an' : ''}`} onClick={() => setEntscheide((x) => ({ ...x, [k]: 'verworfen' }))}>Verwerfen</button>
                          </span>
                        )}
                      </li>
                    )
                  })}
                </ul>
              )}
              {v && v.verworfen.length > 0 && (
                <details><summary className="fk-klein">{v.verworfen.length} vom Server verworfen</summary>
                  <ul>{v.verworfen.map((x, i) => <li key={i} className="fk-klein">{lesbar(x.datei, x.pfad)}: {x.grund}</li>)}</ul>
                </details>
              )}
              {anbieten && (
                <div className="fk-zeile">
                  <button type="button" className="fk-knopf" onClick={() => setEntscheide(Object.fromEntries(v!.ersetzungen.map((e) => [`${e.datei}:${e.pfad}`, 'angenommen' as Entscheid])))}>Alle übernehmen</button>
                  <button type="button" className="fk-knopf haupt" disabled={!Object.keys(entscheide).length} onClick={speichereEntscheid}>Entscheid speichern</button>
                  {offeneZahl > 0 && <span className="fk-klein">{offeneZahl} noch ohne Entscheid</span>}
                </div>
              )}
            </div>
          )}

          {verlauf.length > 0 && (
            <details className="fk-verlauf"><summary className="fk-klein">Frühere Bündel ({verlauf.length})</summary>
              <ul>{verlauf.map((b) => (
                <li key={b.id} className="fk-klein">
                  {new Date(b.created_at).toLocaleString('de-CH', { dateStyle: 'short', timeStyle: 'short' })} · {HEFT_LABEL[b.heft]} · {STATUS_LABEL[b.status]} · {b.kommentare.length} Kommentar{b.kommentare.length === 1 ? '' : 'e'}
                  {(b.status === 'vorschlag' || b.status === 'unvollstaendig') && b.id !== vorschauB?.id && <> · <a href={`?vorschau=${encodeURIComponent(b.id)}`}>Vorschau</a></>}
                </li>
              ))}</ul>
            </details>
          )}

          {fork.fassung && <button type="button" className="fk-link fk-loeschen" onClick={loescheFassung}>Fassung löschen</button>}
        </div>
      )}

      {auswahl && (
        <div className="fk-pop" role="dialog" aria-label="Kommentar zum Block"
          style={{ left: Math.max(8, Math.min(auswahl.x, window.innerWidth - 340)), top: Math.max(8, Math.min(auswahl.y + 12, window.innerHeight - 330)) }}>
          <div className="fk-buendel-kopf"><strong>{lesbar(auswahl.datei, auswahl.pfad)}</strong></div>
          <label className="fk-klein">Auftrag
            <select value={auftrag} onChange={(e) => setAuftrag(e.target.value as AuftragKey)}>
              {auswahl.auftraege.length > 1 && <option value="">Bitte wählen …</option>}
              {auswahl.auftraege.map((a) => <option key={a} value={a}>{AUFTRAEGE[a].label}</option>)}
            </select>
          </label>
          {auftrag && <p className="fk-klein">{AUFTRAEGE[auftrag].beschreibung}</p>}
          <textarea rows={4} maxLength={KOMMENTAR_MAX} placeholder="Was soll anders werden? (Pflicht)" value={kommentar} onChange={(e) => setKommentar(e.target.value)} autoFocus />
          <div className="fk-zeile">
            <span className="fk-klein">{kommentar.length} / {KOMMENTAR_MAX}</span>
            <button type="button" className="fk-link" onClick={() => setAuswahl(null)}>Abbrechen</button>
            <button type="button" className="fk-knopf haupt" disabled={!auftrag || !kommentar.trim()} onClick={zumBuendel}>Zum Bündel</button>
          </div>
        </div>
      )}
    </section>
  )
}

// Nur Bildschirm: die Downloads rendern getrennt und tragen keine dieser Attribute.
const FK_CSS = `
.fk-leiste { margin: 0 16px 8px; border: 1px solid #d1d5db; border-top: 3px solid var(--brand); border-radius: 8px; background: #fff; font: 13px/1.45 system-ui, sans-serif; color: #1f2937; }
.fk-kopf { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; padding: 8px 12px; }
.fk-modus { color: #6b7280; flex: 1; }
.fk-inhalt { padding: 0 12px 10px; display: grid; gap: 8px; max-height: 45vh; overflow: auto; }
.fk-hinweis { margin: 0; padding: 6px 10px; background: var(--brand-tint); border-radius: 6px; color: var(--brand-dark); }
.fk-klein { font-size: 12px; color: #4b5563; }
.fk-fehler { margin: 0; padding: 6px 10px; border: 1px solid #9ca3af; border-left: 4px solid #374151; border-radius: 6px; background: #f3f4f6; }
.fk-warn { margin: 0; padding: 6px 10px 6px 24px; border-left: 4px solid #6b7280; background: #f9fafb; }
p.fk-warn { padding-left: 10px; }
.fk-buendel, .fk-vorschau { border: 1px solid #e5e7eb; border-radius: 6px; padding: 8px 10px; display: grid; gap: 6px; }
.fk-buendel ul, .fk-vorschau ul, .fk-verlauf ul { margin: 0; padding-left: 18px; display: grid; gap: 6px; }
.fk-chip { font-size: 11px; padding: 1px 6px; border-radius: 999px; background: var(--brand-tint); color: var(--brand-dark); }
.fk-knopf { border: 1px solid #d1d5db; background: #fff; border-radius: 6px; padding: 3px 10px; cursor: pointer; font: inherit; }
.fk-knopf.an { border-color: var(--brand); background: var(--brand-tint); color: var(--brand-dark); }
.fk-knopf.haupt { background: var(--brand); border-color: var(--brand); color: #fff; justify-self: start; }
.fk-knopf:disabled { opacity: .5; cursor: not-allowed; }
.fk-link { border: 0; background: none; padding: 0; color: var(--brand-dark); text-decoration: underline; cursor: pointer; font: inherit; text-align: left; }
.fk-loeschen { justify-self: start; color: #374151; }
.fk-wahl, .fk-zeile { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
.fk-angenommen > .fk-link { font-weight: 600; }
.fk-verworfen > .fk-link { color: #9ca3af; text-decoration: line-through; }
.fk-eigen { display: grid; gap: 6px; }
.fk-eigen textarea, .fk-pop textarea, .fk-pop select { width: 100%; box-sizing: border-box; border: 1px solid #d1d5db; border-radius: 6px; padding: 6px; font: inherit; }
.fk-warten { margin: 0; color: var(--brand-dark); }
.fk-pop { position: fixed; z-index: 60; width: 320px; background: #fff; border: 1px solid #d1d5db; border-top: 3px solid var(--brand); border-radius: 8px; box-shadow: 0 8px 24px rgba(0,0,0,.18); padding: 10px; display: grid; gap: 6px; font: 13px/1.45 system-ui, sans-serif; color: #1f2937; }
@media screen {
  [data-fk-markieren] [data-feld] { cursor: pointer; }
  [data-fk-hl] { outline: 2px solid var(--brand-tint); background-color: var(--brand-tint) !important; }
  [data-fk-mark] { outline: 2px dashed var(--brand); outline-offset: 1px; }
  [data-fk-hover] { outline: 2px solid var(--brand); outline-offset: 1px; }
  [data-fk-sel] { outline: 3px solid var(--brand-dark); outline-offset: 1px; }
}
@media print { .fk-leiste, .fk-pop { display: none !important; } }
`
