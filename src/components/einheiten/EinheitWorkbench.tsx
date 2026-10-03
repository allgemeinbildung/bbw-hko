import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import JSZip from 'jszip'

import { DocS } from './docs/DocS'
import { DocAustausch } from './docs/DocAustausch'
import { DocKnS } from './docs/DocKnS'
import { DocKnLp } from './docs/DocKnLp'
import { DocKi } from './docs/DocKi'
import { DocLernprompt } from './docs/DocLernprompt'
import { DocLernbegleiter } from './docs/DocLernbegleiter'
import { DocEbaDossier } from './docs/DocEbaDossier'
import { DocLeseblatt } from './docs/DocLeseblatt'
import { ABTEILUNGEN } from '../../lib/einheiten'
import { knTypLabel } from '../../lib/einheiten/kn-typ-labels'
import type { EinheitFullSet } from '../../lib/einheiten/types'

import { buildDocS, buildAustausch, buildKnS, buildKnLp, buildKi, buildLernprompt, buildLernbegleiter, buildDossier, buildLeseblatt, buildInfokartenTemplate, buildInfokartenTemplatePrefilled, docToBlob } from '../../lib/einheiten/docx-builder'
import { buildBegleiterDocx } from '../../lib/einheiten/begleiter-builder'
import { buildStandaloneDeckHtml, deckSourceFromFullSet } from '../../lib/einheiten/deck-builder'
import { buildUebersicht, einheitPrefix } from '../../lib/einheiten/uebersicht'
import { buildStandaloneHtml } from '../../lib/einheiten/standalone-shell'
import { DocAuftragsbogen } from './docs/DocAuftragsbogen'
import { DocLoesungenV42 } from './docs/DocLoesungenV42'
import { heftDatei, loesungenDatei, v42Dokumente } from '../../lib/einheiten/v42-dokumente'
import { loesungenModell } from '../../lib/einheiten/loesungen-v42'
import { DEFAULT_SPUR, SPUR_KEYS, isV42 } from '../../lib/einheiten/spuren'
import type { SpurKey } from '../../lib/einheiten/types'

/** v4.2 — Beschriftung des Spur-Umschalters (Leitfaden §4). */
const SPUR_LABEL: Record<SpurKey, string> = { ohne_medien: 'Ohne Medien', mit_medien: 'Mit Medien' }

/** Eingebettete IBM-Plex-Schnitte; erst beim ersten Download geladen (≈180 KB). */
const FONTS_EMBED_URL = '/einheiten-assets/fonts-embed.css'

/**
 * Eingaben der Lehrperson im Online-Renderer, pro Einheit im Browser gesichert,
 * damit sie ein Schliessen der Seite überleben.
 *
 * Bewusst localStorage und nicht die Datenbank: kein Serverweg, keine Migration,
 * sofort wirksam. Der Preis ist, dass die Notizen am Browserprofil hängen und
 * nicht auf ein anderes Gerät mitwandern.
 */
const WB_STORAGE_PREFIX = 'hko-wb:'

/**
 * Zustand der Seitenleiste (offen/eingeklappt), bewusst **einheitenübergreifend**:
 * wer die Leiste einmal einklappt, will beim nächsten Dokument nicht wieder von
 * vorn anfangen. Standard ist offen — eingeklappt ist eine Entscheidung der
 * Lehrperson, nicht die Voreinstellung.
 */
const WB_NAV_KEY = 'hko-wb-nav-collapsed'

function loadNavCollapsed(): boolean {
  try {
    return localStorage.getItem(WB_NAV_KEY) === '1'
  } catch {
    return false
  }
}

/**
 * Zoomstufe der Vorschau — ebenfalls einheitenübergreifend gemerkt. Gespeichert
 * wird entweder `fit` (Breite füllen, passt sich jeder Fensterbreite an) oder
 * eine feste Prozentzahl. Ein A4-Blatt ist 210mm breit; CSS definiert 1mm als
 * 96/25.4 px, die Umrechnung ist also exakt und muss nicht gemessen werden.
 */
const WB_ZOOM_KEY = 'hko-wb-zoom'
const A4_WIDTH_PX = (210 * 96) / 25.4
const ZOOM_MIN = 0.4
const ZOOM_MAX = 2
const clampZoom = (z: number) => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, z))

function loadZoomPref(): { fit: boolean; zoom: number } {
  try {
    const raw = localStorage.getItem(WB_ZOOM_KEY)
    if (raw === 'fit') return { fit: true, zoom: 1 }
    const n = Number(raw)
    if (Number.isFinite(n) && n > 0) return { fit: false, zoom: clampZoom(n) }
  } catch { /* privater Modus — dann eben ohne Gedächtnis */ }
  // Ohne gespeicherte Wahl: auf schmalen Fenstern passt das Blatt ohnehin nicht
  // in die Spalte — dort ist «Breite» die brauchbarere Voreinstellung.
  return { fit: typeof window !== 'undefined' && window.innerWidth < 1200, zoom: 1 }
}

/** Icon je KN-Typ — im eingeklappten Zustand ist es die einzige Beschriftung. */
const KN_TYP_ICON: Record<string, string> = {
  fachgespraech: '🗣️',
  mini_case_schriftlich: '🗒️',
  werkschau_transfer: '🖼️',
}

function loadEdits(unitId: string): Record<string, string> {
  try {
    const raw = localStorage.getItem(WB_STORAGE_PREFIX + unitId)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed.edits === 'object' && parsed.edits) return parsed.edits
  } catch {
    // Privater Modus oder volles Kontingent — dann eben ohne Gedächtnis.
  }
  return {}
}

interface Props {
  set: EinheitFullSet
  cssRenderer: string
  cssBegleiter: string
  logoUrl: string
  feedbackUrl: string
  /** B1/B2 — alle abgedeckten Kompetenzen der Einheit (Union über A/B/C; für die README-Übersicht). */
  abgedeckteKompetenzen?: string[]
  /** Vorbelegung des Abteilungs-Dropdowns aus dem LP-Profil (auf eine ABTEILUNGEN-Option gemappt). */
  defaultAbteilung?: string
  /** Read-only guest view: hides the bundle download and the feedback link. */
  readOnly?: boolean
}

type DocSel = 'doc-s' | 'doc-austausch' | 'doc-kn-s' | 'doc-kn-lp' | 'doc-ki-1' | 'doc-ki-2' | 'doc-lernprompt' | 'doc-lernbegleiter' | 'doc-dossier' | 'doc-leseblatt' | 'doc-auftragsbogen' | 'doc-loesungen'
type SitLetter = 'A' | 'B' | 'C'

function classifySit(d: EinheitFullSet, letter: SitLetter) {
  return d[`hf_${letter}`]
}

// Dokumente, die ein Gast sehen darf. Alles andere (Kompetenznachweise, Lies-mich,
// KI-Toolbox) wird gelistet, aber beim Anklicken durch das Gate-Panel ersetzt.
// Der Auftragsbogen (v4.2) tritt an die Stelle von Austausch & Transfer und ist darum gleich offen.
const GUEST_ALLOWED: DocSel[] = ['doc-s', 'doc-austausch', 'doc-dossier', 'doc-leseblatt', 'doc-auftragsbogen']
const GATE_MAIL = 'pietro.rossi@bbw.ch'

/**
 * Nutzungs-Tracking (Beacon aus `Base.astro`). Downloads werden hier gemeldet,
 * weil sie vollständig im Browser entstehen — serverseitig ist von einem
 * Bundle-Export nichts zu sehen. Fehlt der Beacon, passiert schlicht nichts.
 */
function trackDownload(meta: Record<string, unknown>) {
  try {
    ;(window as any).hkoTrack?.('download', meta)
  } catch {}
}

function triggerDownload(blob: Blob, filename: string, meta?: Record<string, unknown>) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
  trackDownload({ art: 'einzeldokument', datei: filename.slice(0, 120), ...meta })
}

// Gast-Sperre: statt des Dokuments erscheint ein Hinweis mit mailto-Kontakt.
function GatePanel({ kind }: { kind: 'kn' | 'begleiter' | 'ki' | 'loesung' }) {
  const titles: Record<string, string> = {
    kn: 'Kompetenznachweis — nur für Lehrpersonen',
    begleiter: 'Begleitdokument «Lies mich!» — nur für Lehrpersonen',
    ki: 'KI-Toolbox — nur für Lehrpersonen',
    loesung: 'Lösungen — nur für Lehrpersonen',
  }
  const subject = encodeURIComponent('Lehrpersonen-Zugang zur ABU-Materialplattform BBW')
  const body = encodeURIComponent(
    'Guten Tag Pietro\n\nIch möchte als Lehrperson vollen Zugang zur ABU-Materialplattform (bbw-hko.ch) erhalten.\n\nName:\nSchule / Abteilung:\nLehrpersonen-E-Mail:\n\nBesten Dank und freundliche Grüsse',
  )
  return (
    <div className="a4-page wb-gate">
      <div className="wb-gate-inner">
        <div className="wb-gate-lock" aria-hidden="true">🔒</div>
        <h2>{titles[kind]}</h2>
        <p>
          Dieser Bereich ist angemeldeten Lehrpersonen vorbehalten. In der Gast-Ansicht siehst du
          die <strong>Herausforderungen</strong> sowie <strong>Austausch &amp; Transfer</strong>.
          Kompetenznachweise und das Begleitdokument sind nicht öffentlich.
        </p>
        <p>
          Wer vollen Zugriff möchte, schreibt eine E-Mail von einer{' '}
          <strong>Lehrpersonen-Adresse</strong> an <a href={`mailto:${GATE_MAIL}`}>{GATE_MAIL}</a>.
        </p>
        <a className="wb-gate-cta" href={`mailto:${GATE_MAIL}?subject=${subject}&body=${body}`}>
          ✉ Zugang anfragen
        </a>
      </div>
    </div>
  )
}

export default function EinheitWorkbench({ set: dRoh, cssRenderer, logoUrl, feedbackUrl, abgedeckteKompetenzen, defaultAbteilung = '', readOnly = false }: Props) {
  // v4.2 — Einheit mit Spuren (ENTSCHEIDE E3). Einziger Schalter für alles Spur-
  // Abhängige in dieser Datei. Ohne `spur_varianten` ist `d` dasselbe Objekt wie
  // `dRoh`, und jede Zeile unten läuft wie bisher (Invariante 4).
  const istV42 = !!dRoh.spur_varianten
  const spurenDa = istV42 ? SPUR_KEYS.filter((k) => !!dRoh.spur_varianten![k]) : []
  // Startwert ist die Spur, in der loadEinheit die Hefte aufgelöst hat (E4: zuerst
  // `ohne_medien`). Nur im Zustand — wie Auftrag/Dossier und die Dokumentwahl.
  const [spur, setSpur] = useState<SpurKey>(() => dRoh.spur ?? DEFAULT_SPUR)
  // Umschalten heisst: Heft A und B aus `spur_varianten` nehmen — keine eigene
  // Auflösung im Client. Alles, was unten `d.hf_A`/`d.hf_B` liest (Vorschau,
  // Einzeldownload, KN-LP, Deck), sieht damit die gewählte Spur.
  const d = useMemo(() => {
    const v = istV42 ? dRoh.spur_varianten![spur] : undefined
    return v ? { ...dRoh, hf_A: v.hf_A, hf_B: v.hf_B, spur } : dRoh
  }, [dRoh, istV42, spur])
  // v4.2: der Auftragsbogen ersetzt das Set-Dokument «Austausch» (Leitfaden §11.2).
  const ersetztAustausch = istV42 && !!d.set?.gemeinsamer_auftrag

  // B1/B2 — Union aller abgedeckten Kompetenzen der Einheit (für die README-Übersicht).
  // Die DocS-Fusszeilen verwenden bewusst die PRO-Herausforderung-Werte (sit.nrlp.nr_primary),
  // damit z.B. nur die Kanal-Herausforderung «(+1.1.3)» trägt, nicht jede Seite der Einheit.
  const docAbgedeckte = abgedeckteKompetenzen && abgedeckteKompetenzen.length
    ? abgedeckteKompetenzen
    : Array.from(new Set([d.hf_A, d.hf_B, d.hf_C].flatMap((s) => s?.nrlp?.nr_primary || []).filter(Boolean)))
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  const [doc, setDoc] = useState<DocSel>('doc-s')
  const [situation, setSituation] = useState<SitLetter>('A')
  // v4.2: Spuren, die das gerade gezeigte Heft wirklich hat (`spuren_verfuegbar` setzt
  // resolveSpur). Fehlt die Angabe, gelten alle Spuren der Einheit — wie bisher.
  const heftSpuren: SpurKey[] = (() => {
    if (!istV42 || (situation !== 'A' && situation !== 'B')) return spurenDa
    const heft = situation === 'A' ? d.hf_A : d.hf_B
    const da = heft?.spuren_verfuegbar?.filter((k) => spurenDa.includes(k))
    return da && da.length ? da : spurenDa
  })()
  const heftNurEineSpur = istV42 && spurenDa.length > 1 && heftSpuren.length === 1
  const [mode, setMode] = useState<'info' | 'fill'>('fill')
  const [abteilung, setAbteilung] = useState(defaultAbteilung || '')
  // client:only — kein SSR, localStorage steht beim ersten Render bereits zur
  // Verfügung. Gäste bekommen keine Persistenz (dokumentierte «kein Speichern»-Regel).
  const [edits, setEdits] = useState<Record<string, string>>(() => (readOnly ? {} : loadEdits(d.id)))
  const [knTyp, setKnTyp] = useState<string>(d.kn?.kn_typen?.[0]?.typ || 'fachgespraech')
  const [bundling, setBundling] = useState(false)
  const [toast, setToast] = useState<{ kind: 'ok' | 'error'; msg: string } | null>(null)
  const [navOpen, setNavOpen] = useState(false)
  const [navCollapsed, setNavCollapsed] = useState(loadNavCollapsed)
  const [kiOpen, setKiOpen] = useState(false)
  const [zusatzOpen, setZusatzOpen] = useState(false)
  const [wbTop, setWbTop] = useState(80)
  const [zoomPref] = useState(loadZoomPref)
  const [zoom, setZoom] = useState(zoomPref.zoom)
  const [fitWidth, setFitWidth] = useState(zoomPref.fit)
  const pagesRef = useRef<HTMLElement | null>(null)
  // Gast-Gate für die Lies-mich-Buttons (KN/KI-Sperre läuft über die doc-Auswahl selbst).
  const [guestGate, setGuestGate] = useState<null | 'kn' | 'begleiter' | 'ki' | 'loesung'>(null)
  const [dling, setDling] = useState(false)
  const [templateDling, setTemplateDling] = useState(false)
  const [templatePrefilledDling, setTemplatePrefilledDling] = useState(false)
  const logoCache = useRef<{ buf: ArrayBuffer; dataUrl: string } | null>(null)
  const fontsCache = useRef<string | null>(null)

  const prefix = useMemo(() => einheitPrefix(d), [d])

  // Unterrichtsdeck wird vollständig aus den JSONs + begleiter.md generiert.
  // Aktuell nur EFZ — EBA hat eine eigene Logik und folgt separat.
  // v4.2: Präsentation und Werkstatt kennen das neue Modell noch nicht (zwei Hefte,
  // gemeinsamer Auftrag statt Austausch und Transfer) — sie würden Folien bzw. einen
  // Prompt im alten 3er-Format erzeugen. Bis sie nachgezogen sind, gibt es beides bei
  // v4.2-Einheiten nicht (ENTSCHEIDE E17).
  const deckSource = useMemo(() => (istV42 ? null : deckSourceFromFullSet(d)), [d, istV42])
  const deckAvailable = !!deckSource
  // Das Deck führt die Lösungen der Leitfragen nur, wo sie gepflegt sind (C10) —
  // der Knopf sagt es deshalb datengesteuert, statt es pauschal zu behaupten.
  const deckHasLoesungen = useMemo(
    () =>
      !!deckSource?.herausforderungen.some((hf: any) =>
        (hf.leitfragen ?? []).some((lf: any) => lf.loesung?.zeilen?.length)
      ),
    [deckSource]
  )

  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = '@media print { .wb-nav, .wb-dochead, .wb-ki-banner, .toast { display: none !important; } .wb-canvas .pages { padding: 0; gap: 0; margin: 0; } .pages-zoom { zoom: 1 !important; } body { margin: 0; padding: 0; } }'
    document.head.appendChild(style)
    return () => document.head.removeChild(style)
  }, [])

  // Dock the sidebar / doc-header right beneath the page's sticky top bar.
  useEffect(() => {
    const measure = () => {
      const h = document.querySelector('header')?.getBoundingClientRect().height
      if (h) setWbTop(Math.round(h))
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  // Einklapp-Zustand überlebt Seitenwechsel und Neuladen.
  useEffect(() => {
    try {
      if (navCollapsed) localStorage.setItem(WB_NAV_KEY, '1')
      else localStorage.removeItem(WB_NAV_KEY)
    } catch { /* privater Modus — dann eben ohne Gedächtnis */ }
  }, [navCollapsed])

  // «Breite füllen» rechnet die Stufe aus der tatsächlich freien Spaltenbreite.
  // Gemessen wird die **ungezoomte** Hülle (.pages) — der Zoom sitzt eine Ebene
  // tiefer, sonst wäre die Messung zirkulär. Der ResizeObserver fängt neben dem
  // Fenster auch das Ein-/Ausklappen der Seitenleiste ab.
  useEffect(() => {
    if (!fitWidth) return
    const el = pagesRef.current
    if (!el) return
    const measure = () => {
      const cs = getComputedStyle(el)
      const avail = el.clientWidth - parseFloat(cs.paddingLeft || '0') - parseFloat(cs.paddingRight || '0')
      // 2px Sicherheitsabstand: träfe die Breite exakt, könnte ein aufblitzender
      // Querbalken die Messung im ResizeObserver aufschaukeln.
      if (avail > 0) setZoom(clampZoom((avail - 2) / A4_WIDTH_PX))
    }
    measure()
    window.addEventListener('resize', measure)
    // Der ResizeObserver ist die Feinabstimmung (Seitenleiste, Schriftgrad-Zoom
    // des Browsers); das resize-Ereignis ist der verlässliche Grundfall.
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null
    ro?.observe(el)
    return () => {
      window.removeEventListener('resize', measure)
      ro?.disconnect()
    }
  }, [fitWidth, navCollapsed, navOpen])

  // Zoomwahl überlebt Seitenwechsel und Neuladen (wie der Leisten-Zustand).
  useEffect(() => {
    try {
      if (fitWidth) localStorage.setItem(WB_ZOOM_KEY, 'fit')
      else localStorage.setItem(WB_ZOOM_KEY, String(Math.round(zoom * 100) / 100))
    } catch { /* privater Modus — dann eben ohne Gedächtnis */ }
  }, [fitWidth, zoom])

  const setZoomManual = useCallback((z: number) => {
    setFitWidth(false)
    setZoom(clampZoom(Math.round(z * 100) / 100))
  }, [])

  // Anzahl tatsächlich befüllter Felder — Grundlage für Anzeige und Aufräumen.
  const notizCount = useMemo(
    () => Object.values(edits).filter((v) => v && v.trim()).length,
    [edits],
  )

  // Entprellt sichern. Ist nichts mehr drin, den Eintrag entfernen statt ein
  // leeres Objekt zu hinterlassen.
  useEffect(() => {
    if (readOnly) return
    const key = WB_STORAGE_PREFIX + d.id
    const t = setTimeout(() => {
      try {
        if (notizCount > 0) localStorage.setItem(key, JSON.stringify({ ts: Date.now(), edits }))
        else localStorage.removeItem(key)
      } catch {
        // Kontingent voll oder Speicher gesperrt — die Eingaben bleiben in der
        // Sitzung nutzbar, nur eben ohne Gedächtnis über das Schliessen hinaus.
      }
    }, 700)
    return () => clearTimeout(t)
  }, [edits, notizCount, readOnly, d.id])

  const clearNotizen = useCallback(() => {
    if (!window.confirm('Alle eigenen Eingaben in dieser Einheit verwerfen? Das lässt sich nicht rückgängig machen.')) return
    setEdits({})
    try { localStorage.removeItem(WB_STORAGE_PREFIX + d.id) } catch { /* s.o. */ }
    showToast('Eingaben verworfen.')
  }, [d.id])

  const onEdit = useCallback((k: string, v: string) => {
    setEdits((prev) => ({ ...prev, [k]: v }))
  }, [])

  const sit = classifySit(d, situation)

  const docNode = useMemo(() => {
    if (doc === 'doc-s') {
      if (!sit) return <div className="a4-page"><p style={{ padding: '40mm 0' }}>Herausforderung {situation} fehlt.</p></div>
      return <DocS sit={sit} set={d.set} abteilung={abteilung} mode={mode} edits={edits} onEdit={onEdit} />
    }
    if (doc === 'doc-auftragsbogen') {
      return <DocAuftragsbogen set={d.set} abteilung={abteilung} edits={edits} onEdit={onEdit} />
    }
    if (doc === 'doc-loesungen') {
      // v4.2, nur Lehrperson (E19): je Heft und Spur — `sit` folgt dem Spur-Umschalter wie das Heft.
      if (!sit || !isV42(sit) || !loesungenModell(sit)) return <div className="a4-page"><p style={{ padding: '40mm 0' }}>Keine Lösungen für Heft {situation}.</p></div>
      return <DocLoesungenV42 sit={sit} abteilung={abteilung} />
    }
    if (doc === 'doc-austausch') {
      if (!d.set) return <div className="a4-page"><p style={{ padding: '40mm 0' }}>Set fehlt.</p></div>
      return <DocAustausch set={d.set} sits={[d.hf_A, d.hf_B, d.hf_C]} abteilung={abteilung} edits={edits} onEdit={onEdit} />
    }
    if (doc === 'doc-kn-s') {
      if (!d.kn) return <div className="a4-page"><p style={{ padding: '40mm 0' }}>KN fehlt.</p></div>
      return <DocKnS kn={d.kn} knTyp={knTyp} abteilung={abteilung} edits={edits} onEdit={onEdit} />
    }
    if (doc === 'doc-ki-1') {
      if (!d.ki) return <div className="a4-page"><p style={{ padding: '40mm 0' }}>KI-Auftrag 1 fehlt.</p></div>
      return <DocKi ki={d.ki} which="ki_1" abteilung={abteilung} edits={edits} onEdit={onEdit} />
    }
    if (doc === 'doc-ki-2') {
      if (!d.ki) return <div className="a4-page"><p style={{ padding: '40mm 0' }}>KI-Auftrag 2 fehlt.</p></div>
      return <DocKi ki={d.ki} which="ki_2" abteilung={abteilung} edits={edits} onEdit={onEdit} />
    }
    if (doc === 'doc-lernprompt') {
      if (!d.lernprompt) return <div className="a4-page"><p style={{ padding: '40mm 0' }}>Lernprompt fehlt.</p></div>
      return <DocLernprompt lernprompt={d.lernprompt} abteilung={abteilung} edits={edits} onEdit={onEdit} />
    }
    if (doc === 'doc-lernbegleiter') {
      if (!d.lernbegleiter) return <div className="a4-page"><p style={{ padding: '40mm 0' }}>Lernbegleiter fehlt.</p></div>
      return <DocLernbegleiter lernbegleiter={d.lernbegleiter} abteilung={abteilung} edits={edits} onEdit={onEdit} />
    }
    if (doc === 'doc-dossier') {
      if (!d.dossier) return <div className="a4-page"><p style={{ padding: '40mm 0' }}>Dossier fehlt.</p></div>
      return <DocEbaDossier dossier={d.dossier} abteilung={abteilung} kompetenzNr={d.kn?.kompetenz_nr} />
    }
    if (doc === 'doc-leseblatt') {
      if (!d.dossier?.leseblatt) return <div className="a4-page"><p style={{ padding: '40mm 0' }}>Kein Lese-Arbeitsblatt.</p></div>
      return <DocLeseblatt dossier={d.dossier} abteilung={abteilung} kompetenzNr={d.kn?.kompetenz_nr} />
    }
    if (!d.kn) return <div className="a4-page"><p style={{ padding: '40mm 0' }}>KN fehlt.</p></div>
    return <DocKnLp kn={d.kn} prinzip={d.prinzip} set={d.set} abteilung={abteilung} sits={[d.hf_A, d.hf_B, d.hf_C]} />
  }, [doc, situation, mode, abteilung, edits, knTyp, sit, d, onEdit])

  const showToast = (msg: string, kind: 'ok' | 'error' = 'ok') => {
    setToast({ msg, kind })
    setTimeout(() => setToast(null), 3500)
  }

  // Logo einmal laden (ArrayBuffer für docx, DataURL fürs HTML) und cachen.
  const ensureLogo = useCallback(async () => {
    if (logoCache.current) return logoCache.current
    const buf = await fetch(logoUrl).then((r) => r.arrayBuffer())
    const bytes = new Uint8Array(buf)
    let bin = ''
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i])
    const dataUrl = 'data:image/png;base64,' + btoa(bin)
    logoCache.current = { buf, dataUrl }
    return logoCache.current
  }, [logoUrl])

  // Eingebettete Schriften einmal laden und cachen. Bewusst lazy: die ~180 KB
  // belasten nur den Download, nicht den Seitenaufbau der Workbench. Schlägt es
  // fehl, fällt der Shell auf den Google-Fonts-<link> zurück.
  const ensureFonts = useCallback(async () => {
    if (fontsCache.current !== null) return fontsCache.current
    try {
      const res = await fetch(FONTS_EMBED_URL)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      fontsCache.current = await res.text()
    } catch (e) {
      console.warn('fonts-embed.css nicht ladbar — Fallback auf Google Fonts', e)
      fontsCache.current = ''
    }
    return fontsCache.current
  }, [])

  // Baut Markup + docx-Factory + Dateiname für das aktuell angezeigte Dokument.
  const currentArtifact = (
    pngBuf: ArrayBuffer,
  ): { baseName: string; title: string; compact?: boolean; markup: string; docx: () => any } | null => {
    const p = prefix
    // v4.2: Heft und Auftragsbogen kommen aus derselben Liste wie im ZIP — immer die
    // auszufüllende Fassung (`fill`), Dateiname der Spur, die das Heft tatsächlich trägt.
    if (istV42 && (doc === 'doc-s' || doc === 'doc-auftragsbogen' || doc === 'doc-loesungen')) {
      const datei = doc === 'doc-auftragsbogen' ? 'auftragsbogen'
        : !sit || !isV42(sit) ? null
        : doc === 'doc-loesungen' ? loesungenDatei(situation, sit.spur ?? spur)
        : heftDatei(situation, sit.spur ?? spur)
      const dok = datei ? v42Dokumente(d, { abteilung, logoPng: pngBuf }).find((x) => x.datei === datei) : undefined
      if (dok) return { baseName: `${p}_${dok.datei}`, title: dok.titel, markup: dok.markup(), docx: dok.docx }
    }
    if (doc === 'doc-s') {
      if (!sit || !d.set) return null
      const suffix = mode === 'fill' ? 'auftrag' : 'dossier'
      return {
        baseName: `${p}_doc-s_hf-${situation}_${suffix}`,
        title: `DOC-S HF ${situation} (${suffix})`,
        compact: mode === 'info',
        markup: renderToStaticMarkup(<DocS sit={sit} set={d.set} abteilung={abteilung} mode={mode} edits={{}} onEdit={() => {}} />),
        docx: () => buildDocS({ sit, set: d.set!, abteilung, mode, logoPng: pngBuf }),
      }
    }
    if (doc === 'doc-austausch') {
      if (!d.set) return null
      return {
        baseName: `${p}_doc-austausch`,
        title: 'DOC-AUSTAUSCH · Set-Abschluss',
        markup: renderToStaticMarkup(<DocAustausch set={d.set} sits={[d.hf_A, d.hf_B, d.hf_C]} abteilung={abteilung} edits={{}} onEdit={() => {}} />),
        docx: () => buildAustausch({ set: d.set!, sits: [d.hf_A, d.hf_B, d.hf_C], abteilung, logoPng: pngBuf }),
      }
    }
    if (doc === 'doc-dossier') {
      if (!d.dossier) return null
      return {
        baseName: `${p}_doc-dossier`,
        title: 'Glossar+ (EBA)',
        markup: renderToStaticMarkup(<DocEbaDossier dossier={d.dossier} abteilung={abteilung} kompetenzNr={d.kn?.kompetenz_nr} />),
        docx: () => buildDossier({ dossier: d.dossier!, abteilung, kompetenzNr: d.kn?.kompetenz_nr, logoPng: pngBuf }),
      }
    }
    if (doc === 'doc-leseblatt') {
      if (!d.dossier?.leseblatt) return null
      return {
        baseName: `${p}_doc-leseblatt`,
        title: 'Lese-Arbeitsblatt (EBA)',
        markup: renderToStaticMarkup(<DocLeseblatt dossier={d.dossier} abteilung={abteilung} kompetenzNr={d.kn?.kompetenz_nr} />),
        docx: () => buildLeseblatt({ dossier: d.dossier!, abteilung, kompetenzNr: d.kn?.kompetenz_nr, logoPng: pngBuf }),
      }
    }
    if (doc === 'doc-kn-s') {
      if (!d.kn) return null
      return {
        baseName: `${p}_doc-kn-s_${knTyp}`,
        title: `DOC-KN-S ${knTyp}`,
        markup: renderToStaticMarkup(<DocKnS kn={d.kn} knTyp={knTyp} abteilung={abteilung} edits={{}} onEdit={() => {}} />),
        docx: () => buildKnS({ kn: d.kn!, knTyp, abteilung, logoPng: pngBuf }),
      }
    }
    if (doc === 'doc-kn-lp') {
      if (!d.kn) return null
      return {
        baseName: `${p}_doc-kn-lp`,
        title: 'DOC-KN-LP Lehrperson + Bewertung',
        markup: renderToStaticMarkup(<DocKnLp kn={d.kn} prinzip={d.prinzip} set={d.set} abteilung={abteilung} sits={[d.hf_A, d.hf_B, d.hf_C]} />),
        docx: () => buildKnLp({ kn: d.kn!, prinzip: d.prinzip, set: d.set, abteilung, logoPng: pngBuf, sits: [d.hf_A, d.hf_B, d.hf_C] }),
      }
    }
    if (doc === 'doc-ki-1' || doc === 'doc-ki-2') {
      if (!d.ki) return null
      const which = doc === 'doc-ki-1' ? 'ki_1' : 'ki_2'
      const num = which === 'ki_1' ? '1' : '2'
      return {
        baseName: `${p}_doc-ki-${num}`,
        title: `DOC-KI-${num} · KI-Toolbox`,
        markup: renderToStaticMarkup(<DocKi ki={d.ki} which={which} abteilung={abteilung} edits={{}} onEdit={() => {}} />),
        docx: () => buildKi({ ki: d.ki!, which, abteilung, logoPng: pngBuf }),
      }
    }
    if (doc === 'doc-lernprompt') {
      if (!d.lernprompt) return null
      return {
        baseName: `${p}_doc-lernprompt`,
        title: 'DOC-LERNPROMPT · KI-Toolbox',
        markup: renderToStaticMarkup(<DocLernprompt lernprompt={d.lernprompt} abteilung={abteilung} edits={{}} onEdit={() => {}} />),
        docx: () => buildLernprompt({ lernprompt: d.lernprompt!, abteilung, logoPng: pngBuf }),
      }
    }
    if (doc === 'doc-lernbegleiter') {
      if (!d.lernbegleiter) return null
      return {
        baseName: `${p}_doc-lernbegleiter`,
        title: 'DOC-LERNBEGLEITER · KI-Toolbox',
        markup: renderToStaticMarkup(<DocLernbegleiter lernbegleiter={d.lernbegleiter} abteilung={abteilung} edits={{}} onEdit={() => {}} />),
        docx: () => buildLernbegleiter({ lernbegleiter: d.lernbegleiter!, abteilung, logoPng: pngBuf }),
      }
    }
    return null
  }

  // v4.2: die Download-Zählung trägt die gewählte Spur mit; sonst bleibt das Meta-Objekt wie bisher.
  const spurMeta = istV42 ? { spur } : undefined

  // Einzeldownload des aktuell angezeigten Dokuments als HTML oder Word.
  const downloadCurrent = async (kind: 'html' | 'word') => {
    if (dling) return
    setDling(true)
    try {
      const { buf, dataUrl } = await ensureLogo()
      const art = currentArtifact(buf)
      if (!art) { showToast('Für dieses Dokument ist kein Download verfügbar.', 'error'); return }
      if (kind === 'html') {
        const html = buildStandaloneHtml({
          cssRenderer,
          title: art.title,
          bodyMarkup: art.markup,
          pngDataUrl: dataUrl,
          docKey: art.baseName,
          fontsCss: (await ensureFonts()) || null,
          compact: art.compact,
          // Einfüge-Sperre + Schreibprotokoll: vorerst nur die Herausforderungen,
          // und dort nur die auszufüllende Auftragsversion.
          protokoll: doc === 'doc-s' && mode === 'fill',
        })
        triggerDownload(new Blob([html], { type: 'text/html;charset=utf-8' }), `${art.baseName}.html`, spurMeta)
      } else {
        const docx = art.docx()
        if (!docx) { showToast('Word-Version für dieses Dokument nicht verfügbar.', 'error'); return }
        const blob = await docToBlob(docx)
        triggerDownload(blob, `${art.baseName}.docx`, spurMeta)
      }
    } catch (e: any) {
      console.error(e)
      showToast('Download fehlgeschlagen: ' + (e?.message || e), 'error')
    } finally {
      setDling(false)
    }
  }

  // Leeres, anpassbares Infokarten-Word-Template (EBA) — unabhängig von der aktuellen
  // doc-Auswahl herunterladbar (siehe docs/eba/EBA-Material-Updates_2026-07-02.md, Punkt 5).
  const downloadInfokartenTemplate = async () => {
    if (templateDling) return
    setTemplateDling(true)
    try {
      const { buf } = await ensureLogo()
      const docx = buildInfokartenTemplate({ abteilung, logoPng: buf })
      const blob = await docToBlob(docx)
      triggerDownload(blob, `${prefix}_infokarten-vorlage.docx`)
    } catch (e: any) {
      console.error(e)
      showToast('Download fehlgeschlagen: ' + (e?.message || e), 'error')
    } finally {
      setTemplateDling(false)
    }
  }

  // Zweite Variante: "voll" — mit kopierbarem KI-Prompt + denselben Feldern wie ein echtes
  // Nugget, aber leer/[ ]. Gleiches Download-Pattern wie downloadInfokartenTemplate oben.
  const downloadInfokartenTemplatePrefilled = async () => {
    if (templatePrefilledDling) return
    setTemplatePrefilledDling(true)
    try {
      const { buf } = await ensureLogo()
      const docx = buildInfokartenTemplatePrefilled({ abteilung, logoPng: buf })
      const blob = await docToBlob(docx)
      triggerDownload(blob, `${prefix}_infokarte-vorlage-voll.docx`)
    } catch (e: any) {
      console.error(e)
      showToast('Download fehlgeschlagen: ' + (e?.message || e), 'error')
    } finally {
      setTemplatePrefilledDling(false)
    }
  }

  const handleBundle = async () => {
    if (bundling) return
    setBundling(true)
    try {
      const [pngArrayBuffer, fontsCss] = await Promise.all([
        fetch(logoUrl).then((r) => r.arrayBuffer()),
        ensureFonts(),
      ])
      const pngBytes = new Uint8Array(pngArrayBuffer)
      let bin = ''
      for (let i = 0; i < pngBytes.length; i++) bin += String.fromCharCode(pngBytes[i])
      const pngDataUrl = 'data:image/png;base64,' + btoa(bin)

      // Der Dateiname ist zugleich der localStorage-Key des Dokuments — er ist über
      // Einheiten hinweg eindeutig (prefix enthält Kompetenznummer + Slug).
      const wrap = (filename: string, title: string, bodyMarkup: string, opts: { compact?: boolean; protokoll?: boolean } = {}) =>
        buildStandaloneHtml({
          cssRenderer,
          title,
          bodyMarkup,
          pngDataUrl,
          docKey: filename.replace(/\.html$/, ''),
          fontsCss: fontsCss || null,
          compact: opts.compact,
          protokoll: opts.protokoll,
        })

      const zip = new JSZip()
      const log: string[] = []
      // `prefix` stammt aus dem Component-Scope (useMemo).

      // v4.2: beide Spuren, unabhängig vom Umschalter — welche Dateien es gibt, sagt
      // allein v42Dokumente (vier Hefte + Auftragsbogen + Lösungen je Heft und Spur). Schreibprotokoll
      // nur in den Heften (dok.protokoll), wie bei den Herausforderungs-Aufträgen. Was nur
      // der Lehrperson gehört (Lösungen), liegt wie der Begleiter unter Material_LP/,
      // nicht zwischen den Heften. docKey mit Präfix, damit er über Einheiten eindeutig bleibt.
      if (istV42) {
        for (const dok of v42Dokumente(dRoh, { abteilung, logoPng: pngArrayBuffer })) {
          const filename = `${dok.datei}.html`
          const htmlPfad = dok.lehrperson ? `Material_LP/${filename}` : `html/${filename}`
          const wordPfad = dok.lehrperson ? `Material_LP/${dok.datei}.docx` : `word/${dok.datei}.docx`
          zip.file(htmlPfad, buildStandaloneHtml({
            cssRenderer,
            title: dok.titel,
            bodyMarkup: dok.markup(),
            pngDataUrl,
            docKey: `${prefix}_${dok.datei}`,
            fontsCss: fontsCss || null,
            protokoll: dok.protokoll,
          }))
          log.push(htmlPfad)
          try {
            const docx = dok.docx()
            if (docx) {
              zip.file(wordPfad, await docToBlob(docx))
              log.push(wordPfad)
            }
          } catch (e) { console.warn('docx v4.2 failed', dok.datei, e) }
        }
      }

      for (const letter of ['A', 'B', 'C'] as SitLetter[]) {
        const s = classifySit(d, letter)
        if (!s || !d.set) continue
        // v4.2-Hefte stehen schon oben (beide Spuren); hier nur Bestandshefte.
        if (istV42 && isV42(s)) continue
        for (const m of ['info', 'fill'] as const) {
          const markup = renderToStaticMarkup(<DocS sit={s} set={d.set} abteilung={abteilung} mode={m} edits={{}} onEdit={() => {}} />)
          const suffix = m === 'fill' ? 'auftrag' : 'dossier'
          const filename = `${prefix}_doc-s_hf-${letter}_${suffix}.html`
          const title = `DOC-S HF ${letter} (${suffix}) · ${s.titel}`
          // Nur die Herausforderungen tragen Einfüge-Sperre + Schreibprotokoll,
          // und dort nur die auszufüllende Auftragsversion.
          zip.file(`html/${filename}`, wrap(filename, title, markup, { compact: m === 'info', protokoll: m === 'fill' }))
          log.push(`html/${filename}`)
          try {
            const docx = buildDocS({ sit: s, set: d.set, abteilung, mode: m, logoPng: pngArrayBuffer })
            zip.file(`word/${filename.replace(/\.html$/, '.docx')}`, await docToBlob(docx))
            log.push(`word/${filename.replace(/\.html$/, '.docx')}`)
          } catch (e) { console.warn('docx DocS failed', filename, e) }
        }
      }

      // C8 — set-level Austausch & Transfer doc (once per set; no longer embedded in the 6 DocS)
      if (d.set && !ersetztAustausch) {
        const markup = renderToStaticMarkup(<DocAustausch set={d.set} sits={[d.hf_A, d.hf_B, d.hf_C]} abteilung={abteilung} edits={{}} onEdit={() => {}} />)
        const filename = `${prefix}_doc-austausch.html`
        zip.file(`html/${filename}`, wrap(filename, 'DOC-AUSTAUSCH · Set-Abschluss', markup))
        log.push(`html/${filename}`)
        try {
          const docx = buildAustausch({ set: d.set, sits: [d.hf_A, d.hf_B, d.hf_C], abteilung, logoPng: pngArrayBuffer })
          zip.file(`word/${filename.replace(/\.html$/, '.docx')}`, await docToBlob(docx))
          log.push(`word/${filename.replace(/\.html$/, '.docx')}`)
        } catch (e) { console.warn('docx Austausch failed', filename, e) }
      }

      if (d.dossier) {
        const markup = renderToStaticMarkup(<DocEbaDossier dossier={d.dossier} abteilung={abteilung} kompetenzNr={d.kn?.kompetenz_nr} />)
        const filename = `${prefix}_doc-dossier.html`
        zip.file(`html/${filename}`, wrap(filename, 'Glossar+ (EBA) · Nachschlagen & Lernen', markup))
        log.push(`html/${filename}`)
        try {
          const docx = buildDossier({ dossier: d.dossier, abteilung, kompetenzNr: d.kn?.kompetenz_nr, logoPng: pngArrayBuffer })
          if (docx) {
            zip.file(`word/${filename.replace(/\.html$/, '.docx')}`, await docToBlob(docx))
            log.push(`word/${filename.replace(/\.html$/, '.docx')}`)
          }
        } catch (e) { console.warn('docx Dossier failed', filename, e) }
      }

      if (d.dossier?.leseblatt) {
        const markup = renderToStaticMarkup(<DocLeseblatt dossier={d.dossier} abteilung={abteilung} kompetenzNr={d.kn?.kompetenz_nr} />)
        const filename = `${prefix}_doc-leseblatt.html`
        zip.file(`html/${filename}`, wrap(filename, 'Lese-Arbeitsblatt (EBA) · Lesen & Verstehen', markup))
        log.push(`html/${filename}`)
        try {
          const docx = buildLeseblatt({ dossier: d.dossier, abteilung, kompetenzNr: d.kn?.kompetenz_nr, logoPng: pngArrayBuffer })
          if (docx) {
            zip.file(`word/${filename.replace(/\.html$/, '.docx')}`, await docToBlob(docx))
            log.push(`word/${filename.replace(/\.html$/, '.docx')}`)
          }
        } catch (e) { console.warn('docx Leseblatt failed', filename, e) }
      }

      if (d.kn) {
        for (const typ of d.kn.kn_typen || []) {
          const markup = renderToStaticMarkup(<DocKnS kn={d.kn} knTyp={typ.typ} abteilung={abteilung} edits={{}} onEdit={() => {}} />)
          const filename = `${prefix}_doc-kn-s_${typ.typ}.html`
          zip.file(`html/${filename}`, wrap(filename, `DOC-KN-S ${typ.label}`, markup))
          log.push(`html/${filename}`)
          try {
            const docx = buildKnS({ kn: d.kn, knTyp: typ.typ, abteilung, logoPng: pngArrayBuffer })
            if (docx) {
              zip.file(`word/${filename.replace(/\.html$/, '.docx')}`, await docToBlob(docx))
              log.push(`word/${filename.replace(/\.html$/, '.docx')}`)
            }
          } catch (e) { console.warn('docx KnS failed', filename, e) }
        }
      }

      if (d.kn && d.prinzip) {
        const markup = renderToStaticMarkup(<DocKnLp kn={d.kn} prinzip={d.prinzip} set={d.set} abteilung={abteilung} sits={[d.hf_A, d.hf_B, d.hf_C]} />)
        const filename = `${prefix}_doc-kn-lp.html`
        zip.file(`html/${filename}`, wrap(filename, 'DOC-KN-LP Lehrperson + Bewertung', markup))
        log.push(`html/${filename}`)
        try {
          const docx = buildKnLp({ kn: d.kn, prinzip: d.prinzip, set: d.set, abteilung, logoPng: pngArrayBuffer, sits: [d.hf_A, d.hf_B, d.hf_C] })
          zip.file(`word/${filename.replace(/\.html$/, '.docx')}`, await docToBlob(docx))
          log.push(`word/${filename.replace(/\.html$/, '.docx')}`)
        } catch (e) { console.warn('docx KnLp failed', filename, e) }
      }

      if (d.begleiter?.raw) {
        try {
          const blob = await buildBegleiterDocx(d.begleiter.raw, pngArrayBuffer)
          const path = `Material_LP/${prefix}_begleiter.docx`
          zip.file(path, blob)
          log.push(path)
        } catch (e) { console.warn('begleiter docx failed', e) }
      }

      // Unterrichtsdeck — eine eigenständige HTML-Datei (kein iframe, keine externen
      // Skripte), damit sie aus dem entpackten ZIP per Doppelklick läuft.
      if (deckSource) {
        try {
          const path = `Material_LP/${prefix}_unterrichtsdeck.html`
          // Logo und Löwen-Wasserzeichen als Data-URI einbetten — im entpackten ZIP
          // gibt es keinen Server, der /logo-bbw-doc.png bzw. /lion-only.svg liefert.
          const lionSvg = await fetch('/lion-only.svg').then((r) => r.text()).catch(() => '')
          const lionSrc = lionSvg ? 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(lionSvg))) : undefined
          zip.file(path, buildStandaloneDeckHtml(deckSource, d.id, { logoSrc: pngDataUrl, lionSrc }))
          log.push(path)
        } catch (e) { console.warn('deck failed', e) }
      }

      // KI-Toolbox-Dokumente (additiv) — nur wenn die jeweilige Datei existiert.
      if (d.ki) {
        for (const which of ['ki_1', 'ki_2'] as const) {
          if (!d.ki.assignments?.some((a) => a.key === which)) continue
          const num = which === 'ki_1' ? '1' : '2'
          const markup = renderToStaticMarkup(<DocKi ki={d.ki} which={which} abteilung={abteilung} edits={{}} onEdit={() => {}} />)
          const filename = `${prefix}_doc-ki-${num}.html`
          zip.file(`html/${filename}`, wrap(filename, `DOC-KI-${num} · KI-Toolbox`, markup))
          log.push(`html/${filename}`)
          try {
            const docx = buildKi({ ki: d.ki, which, abteilung, logoPng: pngArrayBuffer })
            if (docx) {
              zip.file(`word/${filename.replace(/\.html$/, '.docx')}`, await docToBlob(docx))
              log.push(`word/${filename.replace(/\.html$/, '.docx')}`)
            }
          } catch (e) { console.warn('docx Ki failed', filename, e) }
        }
      }

      if (d.lernprompt) {
        const markup = renderToStaticMarkup(<DocLernprompt lernprompt={d.lernprompt} abteilung={abteilung} edits={{}} onEdit={() => {}} />)
        const filename = `${prefix}_doc-lernprompt.html`
        zip.file(`html/${filename}`, wrap(filename, 'DOC-LERNPROMPT · KI-Toolbox', markup))
        log.push(`html/${filename}`)
        try {
          const docx = buildLernprompt({ lernprompt: d.lernprompt, abteilung, logoPng: pngArrayBuffer })
          if (docx) {
            zip.file(`word/${filename.replace(/\.html$/, '.docx')}`, await docToBlob(docx))
            log.push(`word/${filename.replace(/\.html$/, '.docx')}`)
          }
        } catch (e) { console.warn('docx Lernprompt failed', filename, e) }
      }

      if (d.lernbegleiter) {
        const markup = renderToStaticMarkup(<DocLernbegleiter lernbegleiter={d.lernbegleiter} abteilung={abteilung} edits={{}} onEdit={() => {}} />)
        const filename = `${prefix}_doc-lernbegleiter.html`
        zip.file(`html/${filename}`, wrap(filename, 'DOC-LERNBEGLEITER · KI-Toolbox', markup))
        log.push(`html/${filename}`)
        try {
          const docx = buildLernbegleiter({ lernbegleiter: d.lernbegleiter, abteilung, logoPng: pngArrayBuffer })
          if (docx) {
            zip.file(`word/${filename.replace(/\.html$/, '.docx')}`, await docToBlob(docx))
            log.push(`word/${filename.replace(/\.html$/, '.docx')}`)
          }
        } catch (e) { console.warn('docx Lernbegleiter failed', filename, e) }
      }

      if (d.kiLiesmich?.raw) {
        try {
          const blob = await buildBegleiterDocx(d.kiLiesmich.raw, pngArrayBuffer)
          const path = `Material_LP/${prefix}_ki-liesmich.docx`
          zip.file(path, blob)
          log.push(path)
        } catch (e) { console.warn('ki-liesmich docx failed', e) }
      }

      const readme = buildUebersicht({ prefix, log, d, when: new Date(), abgedeckteKompetenzen: docAbgedeckte })
      zip.file('Übersicht_LP.html', readme)

      const blob = await zip.generateAsync({ type: 'blob' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${prefix}_hko_bundle.zip`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      setTimeout(() => URL.revokeObjectURL(url), 1000)
      // Der ZIP enthält immer beide Spuren; `spur` ist die beim Download gewählte.
      trackDownload({ art: 'bundle', dateien: log.length, kn_typ: knTyp, abteilung: abteilung || null, ...spurMeta })
      showToast(`${log.length} Dateien als Zip exportiert.`)
    } catch (e: any) {
      console.error(e)
      showToast('Fehler beim Bundling: ' + e.message, 'error')
    } finally {
      setBundling(false)
    }
  }

  const knTypen = d.kn?.kn_typen || []
  let docKicker = ''
  let docName = ''
  if (doc === 'doc-s') {
    docKicker = `Herausforderung ${situation}`
    docName = sit?.titel || `Herausforderung ${situation}`
  } else if (doc === 'doc-auftragsbogen') {
    docKicker = 'Gemeinsamer Auftrag'
    docName = d.set?.gemeinsamer_auftrag?.titel || 'Auftragsbogen'
  } else if (doc === 'doc-loesungen') {
    docKicker = `Lösungen Heft ${situation} · Lehrperson`
    docName = sit?.titel || `Heft ${situation}`
  } else if (doc === 'doc-austausch') {
    docKicker = 'Set-Abschluss'
    docName = 'Austausch & Transfer'
  } else if (doc === 'doc-kn-s') {
    docKicker = 'Kompetenznachweis · Schüler/in'
    docName = knTypLabel(knTyp, knTypen.find((t) => t.typ === knTyp)?.label, d.kn?.lehrgang) || 'Kompetenznachweis'
  } else if (doc === 'doc-ki-1' || doc === 'doc-ki-2') {
    const which = doc === 'doc-ki-1' ? 'ki_1' : 'ki_2'
    const a = d.ki?.assignments?.find((x) => x.key === which)
    docKicker = 'KI-Toolbox · formativ'
    docName = a?.titel || (doc === 'doc-ki-1' ? 'KI-Auftrag 1' : 'KI-Auftrag 2')
  } else if (doc === 'doc-lernprompt') {
    docKicker = 'KI-Toolbox · Prompting'
    docName = 'KI-Lernprompt'
  } else if (doc === 'doc-lernbegleiter') {
    docKicker = 'KI-Toolbox · Lernen'
    docName = 'KI-Lernbegleiter'
  } else if (doc === 'doc-dossier') {
    docKicker = 'EBA · Nachschlagen & Lernen'
    docName = 'Glossar+'
  } else if (doc === 'doc-leseblatt') {
    docKicker = 'EBA · Lesen & Verstehen'
    docName = 'Lese-Arbeitsblatt'
  } else {
    docKicker = 'Kompetenznachweis'
    docName = 'Lehrperson + Bewertung'
  }

  const selectSit = (s: SitLetter) => { setGuestGate(null); setDoc('doc-s'); setSituation(s); setNavOpen(false) }
  const selectLoesung = (s: SitLetter) => { setGuestGate(null); setDoc('doc-loesungen'); setSituation(s); setNavOpen(false) }
  const selectKnTyp = (t: string) => { setGuestGate(null); setDoc('doc-kn-s'); setKnTyp(t); setNavOpen(false) }
  const pick = (target: DocSel) => { setGuestGate(null); setDoc(target); setNavOpen(false) }

  const isKiDoc = doc === 'doc-ki-1' || doc === 'doc-ki-2' || doc === 'doc-lernprompt' || doc === 'doc-lernbegleiter'

  // Gast-Gate: gesperrte doc-Auswahl → Gate; zusätzlich die Lies-mich-Buttons via guestGate.
  const docLocked = readOnly && !GUEST_ALLOWED.includes(doc)
  const gateKind: null | 'kn' | 'begleiter' | 'ki' | 'loesung' = guestGate ?? (docLocked ? (isKiDoc ? 'ki' : doc === 'doc-loesungen' ? 'loesung' : 'kn') : null)
  // v4.2: Hefte mit Lösungen (E19) in der gewählten Spur — nur Lehrperson.
  const loesungsHefte = istV42 ? (['A', 'B'] as SitLetter[]).filter((s) => {
    const x = classifySit(d, s)
    return !!x && isV42(x) && !!loesungenModell(x)
  }) : []
  const lockBadge = readOnly ? <span className="wb-lock" title="Nur für Lehrpersonen" aria-hidden="true">🔒</span> : null

  return (
    <div className="aesthetic-modern wb-root" style={{ '--wb-top': `${wbTop}px` } as any}>
      <button className="wb-nav-toggle" onClick={() => setNavOpen((v) => !v)}>☰ Dokumente</button>

      <aside className={`wb-nav${navOpen ? ' open' : ''}${navCollapsed ? ' collapsed' : ''}`}>
        {/* Einklappen gibt dem Dokument die Breite zurück; die Seiten-Knöpfe
            bleiben als Schmalspur stehen, damit ohne Aufklappen gewechselt
            werden kann. Nur Desktop — mobil regelt das die Schublade. */}
        <button
          type="button"
          className="wb-collapse"
          onClick={() => setNavCollapsed((v) => !v)}
          aria-expanded={!navCollapsed}
          title={navCollapsed ? 'Seitenleiste ausklappen' : 'Seitenleiste einklappen'}
        >
          <span className="wb-collapse-icon" aria-hidden="true">{navCollapsed ? '»' : '«'}</span>
          <span className="wb-collapse-label">Leiste einklappen</span>
        </button>

        <div className="wb-field">
          <label htmlFor="wb-abt">Abteilung</label>
          <select
            id="wb-abt"
            className="wb-select"
            value={abteilung}
            onChange={(e) => setAbteilung(e.target.value)}
          >
            {ABTEILUNGEN.map((a) => (
              <option key={a} value={a}>{a || '— Abteilung wählen —'}</option>
            ))}
          </select>
        </div>

        {d.begleiter?.raw && (
          readOnly ? (
            <button type="button" className="wb-action lies locked" title="Lies mich!" onClick={() => { setGuestGate('begleiter'); setNavOpen(false) }}>
              <span className="wb-action-icon" aria-hidden="true">📖</span>
              <span className="wb-action-label">Lies mich!</span> {lockBadge}
            </button>
          ) : (
            <a
              className="wb-action lies"
              href={`/einheiten/${d.id}/begleiter`}
              target="_blank"
              rel="noopener noreferrer"
              title="Lies mich!"
            >
              <span className="wb-action-icon" aria-hidden="true">📖</span>
              <span className="wb-action-label">Lies mich!</span>
            </a>
          )
        )}

        {deckAvailable && (
          readOnly ? (
            <button type="button" className="wb-action deck locked" title="Präsentation" onClick={() => { setGuestGate('begleiter'); setNavOpen(false) }}>
              <span className="wb-action-icon" aria-hidden="true">🖥️</span>
              <span className="wb-action-label">Präsentation</span>
              {deckHasLoesungen && <span className="wb-action-note">mit Lösungen</span>} {lockBadge}
            </button>
          ) : (
            <a
              className="wb-action deck"
              href={`/einheiten/${d.id}/deck`}
              target="_blank"
              rel="noopener noreferrer"
              title="Präsentation"
            >
              <span className="wb-action-icon" aria-hidden="true">🖥️</span>
              <span className="wb-action-label">Präsentation</span>
              {deckHasLoesungen && <span className="wb-action-note">mit Lösungen</span>}
            </a>
          )
        )}

        {/* Werkstatt steht bei den Lehrpersonen-Werkzeugen, nicht unten beim Feedback:
            sie gehoert vor den Unterricht, nicht danach. Gaeste sehen sie nie. */}
        {!readOnly && !istV42 && (
          <a
            className="wb-action"
            href={`/einheiten/${d.id}/werkstatt`}
            title="Prompt für Zusatzmaterial zu dieser Einheit — für die Lehrperson, nicht für die Lernenden"
          >
            <span className="wb-action-icon" aria-hidden="true">🛠</span>
            <span className="wb-action-label">Werkstatt</span>
            <span className="wb-action-note">Zusatzmaterial</span>
          </a>
        )}

        <nav className="wb-tree">
          <div className="wb-tree-group">
            <div className="wb-tree-head">Herausforderungen</div>
            {(['A', 'B', 'C'] as SitLetter[]).map((s) =>
              classifySit(d, s) ? (
                <button
                  key={s}
                  className={`wb-item${doc === 'doc-s' && situation === s ? ' active' : ''}`}
                  onClick={() => selectSit(s)}
                  title={classifySit(d, s)?.titel || `Herausforderung ${s}`}
                >
                  <span className={`wb-letter wb-letter-${s}`}>{s}</span>
                  <span className="wb-item-title">{classifySit(d, s)?.titel || `Herausforderung ${s}`}</span>
                </button>
              ) : null,
            )}
          </div>

          {ersetztAustausch ? (
            <button
              className={`wb-item solo${doc === 'doc-auftragsbogen' ? ' active' : ''}`}
              onClick={() => pick('doc-auftragsbogen')}
              title="Auftragsbogen · gemeinsamer Auftrag"
            >
              <span className="wb-dot">🤝</span>
              <span className="wb-item-title">Auftragsbogen</span>
            </button>
          ) : (
          <button
            className={`wb-item solo${doc === 'doc-austausch' ? ' active' : ''}`}
            onClick={() => pick('doc-austausch')}
            title="Austausch & Transfer"
          >
            <span className="wb-dot">🔄</span>
            <span className="wb-item-title">Austausch &amp; Transfer</span>
          </button>
          )}

          {d.dossier && (
            <button
              className={`wb-item solo${doc === 'doc-dossier' ? ' active' : ''}`}
              onClick={() => pick('doc-dossier')}
              title="Glossar+"
            >
              <span className="wb-dot">📖</span>
              <span className="wb-item-title">Glossar+</span>
            </button>
          )}
          {(d.dossier?.leseblatt || (d.dossier && !readOnly)) && (
            <div className="wb-tree-group">
              <button
                type="button"
                className={`wb-tree-head wb-tree-head-toggle${zusatzOpen ? ' open' : ''}`}
                onClick={() => setZusatzOpen((v) => !v)}
                aria-expanded={zusatzOpen}
              >
                <span className="wb-ki-label">Zusatzmaterialien</span>
                <span className="wb-chevron" aria-hidden="true">▾</span>
              </button>
              {/* Eingeklappt gibt es keinen Gruppenkopf zum Aufklappen — dann muss
                  jede Seite als Knopf in der Schmalspur stehen. */}
              {(zusatzOpen || navCollapsed) && (
                <>
          {d.dossier?.leseblatt && (
            <button
              className={`wb-item nested${doc === 'doc-leseblatt' ? ' active' : ''}`}
              onClick={() => pick('doc-leseblatt')}
              title="Lese-Arbeitsblatt"
            >
              <span className="wb-dot">📝</span>
              <span className="wb-item-title">Lese-Arbeitsblatt</span>
            </button>
          )}

          {d.dossier && !readOnly && (
            <button
              type="button"
              className="wb-item nested"
              onClick={downloadInfokartenTemplate}
              disabled={templateDling}
              title="Leeres, anpassbares Word-Template für eigene Infokarten"
            >
              <span className="wb-dot">🗂️</span>
              <span className="wb-item-title">{templateDling ? 'Vorlage wird erstellt…' : 'Infokarten-Vorlage (leer)'}</span>
            </button>
          )}

          {d.dossier && !readOnly && (
            <button
              type="button"
              className="wb-item nested"
              onClick={downloadInfokartenTemplatePrefilled}
              disabled={templatePrefilledDling}
              title="Vorlage mit kopierbarem KI-Prompt, um die Karte mit einer KI (z. B. Copilot) auszufüllen"
            >
              <span className="wb-dot">🤖</span>
              <span className="wb-item-title">{templatePrefilledDling ? 'Vorlage wird erstellt…' : 'Infokarte-Vorlage (voll)'}</span>
            </button>
          )}
                </>
              )}
            </div>
          )}

          {d.kn && (
            <div className="wb-tree-group">
              <div className="wb-tree-head">Kompetenznachweis</div>
              <div className="wb-tree-sub">Schüler/in</div>
              {knTypen.map((t) => (
                <button
                  key={t.typ}
                  className={`wb-item nested${doc === 'doc-kn-s' && knTyp === t.typ ? ' active' : ''}${readOnly ? ' locked' : ''}`}
                  onClick={() => selectKnTyp(t.typ)}
                  title={knTypLabel(t.typ, t.label, d.kn?.lehrgang)}
                >
                  <span className="wb-dot wb-rail-only" aria-hidden="true">{KN_TYP_ICON[t.typ] || '📄'}</span>
                  <span className="wb-item-title">{knTypLabel(t.typ, t.label, d.kn?.lehrgang)}</span>
                  {lockBadge}
                </button>
              ))}
              <button
                className={`wb-item${doc === 'doc-kn-lp' ? ' active' : ''}${readOnly ? ' locked' : ''}`}
                onClick={() => pick('doc-kn-lp')}
                title="Lehrperson + Bewertung"
              >
                <span className="wb-dot">📋</span>
                <span className="wb-item-title">Lehrperson + Bewertung</span>
                {lockBadge}
              </button>
            </div>
          )}

          {/* v4.2: Lösungen je Heft (E19) — folgen dem Spur-Umschalter, nur Lehrperson, für Gäste gesperrt. */}
          {loesungsHefte.length > 0 && (
            <div className="wb-tree-group">
              <div className="wb-tree-head">Lösungen · Lehrperson</div>
              {loesungsHefte.map((s) => (
                <button
                  key={s}
                  className={`wb-item nested${doc === 'doc-loesungen' && situation === s ? ' active' : ''}${readOnly ? ' locked' : ''}`}
                  onClick={() => selectLoesung(s)}
                  title={`Lösungen Heft ${s} · ${SPUR_LABEL[spur]} · ${classifySit(d, s)?.titel || ''}`}
                >
                  <span className={`wb-letter wb-letter-${s}`}>{s}</span>
                  <span className="wb-item-title">Lösungen · {classifySit(d, s)?.titel || `Heft ${s}`}</span>
                  {lockBadge}
                </button>
              ))}
            </div>
          )}

          {(d.ki || d.lernprompt || d.lernbegleiter || d.kiLiesmich) && (
            <div className="wb-tree-group wb-tree-ki">
              <button
                type="button"
                className={`wb-tree-head wb-tree-head-toggle${kiOpen ? ' open' : ''}`}
                onClick={() => setKiOpen((v) => !v)}
                aria-expanded={kiOpen}
              >
                <span className="wb-ki-badge">KI</span>
                <span className="wb-ki-label">KI-Toolbox</span>
                <span className="wb-chevron" aria-hidden="true">▾</span>
              </button>
              {(kiOpen || navCollapsed) && (
              <>
              <p className="wb-ki-hint">Optionales Zusatzangebot — die Lehrperson entscheidet über den Einsatz.</p>
              {d.kiLiesmich?.raw && (
                readOnly ? (
                  <button type="button" className="wb-action lies wb-ki-lies locked" title="KI-Toolbox — Lies mich!" onClick={() => { setGuestGate('ki'); setNavOpen(false) }}>
                    <span className="wb-action-icon" aria-hidden="true">📖</span>
                    <span className="wb-action-label">KI-Toolbox — Lies mich!</span> {lockBadge}
                  </button>
                ) : (
                  <a
                    className="wb-action lies wb-ki-lies"
                    href={`/einheiten/${d.id}/ki-liesmich`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="KI-Toolbox — Lies mich!"
                  >
                    <span className="wb-action-icon" aria-hidden="true">📖</span>
                    <span className="wb-action-label">KI-Toolbox — Lies mich!</span>
                  </a>
                )
              )}
              {d.ki?.assignments?.some((a) => a.key === 'ki_1') && (
                <button
                  className={`wb-item${doc === 'doc-ki-1' ? ' active' : ''}${readOnly ? ' locked' : ''}`}
                  onClick={() => pick('doc-ki-1')}
                  title={d.ki?.assignments?.find((a) => a.key === 'ki_1')?.titel || 'KI-Auftrag 1'}
                >
                  <span className="wb-letter wb-letter-ki">1</span>
                  <span className="wb-item-title">{d.ki?.assignments?.find((a) => a.key === 'ki_1')?.titel || 'KI-Auftrag 1'}</span>
                  {lockBadge}
                </button>
              )}
              {d.ki?.assignments?.some((a) => a.key === 'ki_2') && (
                <button
                  className={`wb-item${doc === 'doc-ki-2' ? ' active' : ''}${readOnly ? ' locked' : ''}`}
                  onClick={() => pick('doc-ki-2')}
                  title={d.ki?.assignments?.find((a) => a.key === 'ki_2')?.titel || 'KI-Auftrag 2'}
                >
                  <span className="wb-letter wb-letter-ki">2</span>
                  <span className="wb-item-title">{d.ki?.assignments?.find((a) => a.key === 'ki_2')?.titel || 'KI-Auftrag 2'}</span>
                  {lockBadge}
                </button>
              )}
              {d.lernprompt && (
                <button
                  className={`wb-item${doc === 'doc-lernprompt' ? ' active' : ''}${readOnly ? ' locked' : ''}`}
                  onClick={() => pick('doc-lernprompt')}
                  title="KI-Lernprompt"
                >
                  <span className="wb-letter wb-letter-ki">P</span>
                  <span className="wb-item-title">KI-Lernprompt</span>
                  {lockBadge}
                </button>
              )}
              {d.lernbegleiter && (
                <button
                  className={`wb-item${doc === 'doc-lernbegleiter' ? ' active' : ''}${readOnly ? ' locked' : ''}`}
                  onClick={() => pick('doc-lernbegleiter')}
                  title="KI-Lernbegleiter"
                >
                  <span className="wb-letter wb-letter-ki">L</span>
                  <span className="wb-item-title">KI-Lernbegleiter</span>
                  {lockBadge}
                </button>
              )}
              </>
              )}
            </div>
          )}
        </nav>

        {/* Herunterladen gehört zu den Dokumenten und steht darum bei ihnen — nicht
            im Dokumentkopf und nicht als schwebender Knopf über dem Blatt. Zwei
            Ebenen, absteigend: das gerade offene Dokument (HTML/Word) und die
            ganze Einheit als ZIP. */}
        {readOnly ? (
          <p className="wb-dlbox-gast">👁 Gast-Ansicht · Download nur für angemeldete Lehrpersonen</p>
        ) : (
          <div className="wb-dlbox">
            <div className="wb-dlbox-row">
              <span className="wb-dlbox-label">Dieses Dokument</span>
              <span className="wb-dlbox-btns">
                <button
                  type="button"
                  onClick={() => downloadCurrent('html')}
                  disabled={dling || !!gateKind}
                  title="Das offene Dokument als HTML herunterladen"
                >HTML</button>
                <button
                  type="button"
                  onClick={() => downloadCurrent('word')}
                  disabled={dling || !!gateKind}
                  title="Das offene Dokument als Word-Datei herunterladen"
                >Word</button>
              </span>
            </div>
            <button
              type="button"
              className="wb-dlbox-zip"
              onClick={handleBundle}
              disabled={bundling}
              title="Alle Dokumente der Einheit als ZIP herunterladen"
            >
              <span className="wb-dlbox-zip-icon" aria-hidden="true">⬇</span>
              <span className="wb-dlbox-zip-label">
                {bundling ? 'Download läuft…' : 'Ganze Einheit · ZIP'}
              </span>
            </button>
          </div>
        )}

        {!readOnly && (
          <a className="wb-action" href={feedbackUrl} title="Feedback nach Unterricht">
            <span className="wb-action-icon" aria-hidden="true">✍</span>
            <span className="wb-action-label">Feedback nach Unterricht</span>
          </a>
        )}
      </aside>

      <div className="wb-canvas">
        <div className="wb-dochead">
          <div className="wb-dochead-title">
            <span className="wb-dochead-kicker">{gateKind ? 'Nur für Lehrpersonen' : docKicker}</span>
            <span className="wb-dochead-name">{gateKind ? 'Zugriff eingeschränkt' : docName}</span>
          </div>
          <div className="wb-dochead-actions">
            {/* v4.2: Auftrag/Dossier entfällt — das Heft hat in beiden Modi dieselben
                8 Seiten, `mode` bleibt darum beim Startwert `fill`. An seiner Stelle
                steht der Spur-Umschalter, sofern es mehr als eine Spur gibt. */}
            {(doc === 'doc-s' || doc === 'doc-loesungen') && !gateKind && istV42 && spurenDa.length > 1 && (
              <>
                {/* Ein Heft kann nur eine Spur haben (Leitfaden §4.4: die Kompetenz verlangt
                    Rezeption mündlich oder audiovisuell). Dann zeigt der Schalter die Spur, die
                    es gibt, und sagt es — sonst sähe «Ohne Medien» aus wie ein Fehler.
                    Inline-Stile, weil das Stylesheet in jedem exportierten HTML steckt. */}
                {heftNurEineSpur && (
                  <span style={{ fontSize: 12, color: '#d5d9e0', marginRight: 8, whiteSpace: 'nowrap' }}>
                    Heft {situation} gibt es nur {heftSpuren[0] === 'mit_medien' ? 'mit Medien' : 'ohne Medien'}
                  </span>
                )}
                <div className="wb-mode" role="group" aria-label="Spur">
                  {spurenDa.map((k) => {
                    const gibtEs = heftSpuren.includes(k)
                    return (
                      <button
                        key={k}
                        className={(heftNurEineSpur ? gibtEs : spur === k) ? 'on' : ''}
                        disabled={!gibtEs}
                        style={gibtEs ? undefined : { opacity: 0.45, cursor: 'not-allowed', textDecoration: 'line-through' }}
                        title={gibtEs ? undefined : `Heft ${situation} gibt es nur in der Spur «${SPUR_LABEL[heftSpuren[0]]}»`}
                        onClick={() => setSpur(k)}
                      >{SPUR_LABEL[k]}</button>
                    )
                  })}
                </div>
              </>
            )}
            {doc === 'doc-s' && !gateKind && !istV42 && (
              <div className="wb-mode">
                <button className={mode === 'fill' ? 'on' : ''} onClick={() => setMode('fill')}>Auftrag</button>
                <button className={mode === 'info' ? 'on' : ''} onClick={() => setMode('info')}>Dossier</button>
              </div>
            )}
            {!gateKind && (
              <div className="wb-zoom" role="group" aria-label="Vorschau zoomen">
                <button
                  type="button"
                  className="wb-zoom-step"
                  onClick={() => setZoomManual(zoom - 0.1)}
                  disabled={zoom <= ZOOM_MIN + 0.001}
                  title="Verkleinern"
                  aria-label="Verkleinern"
                >−</button>
                <input
                  className="wb-zoom-range"
                  type="range"
                  min={ZOOM_MIN * 100}
                  max={ZOOM_MAX * 100}
                  step={5}
                  value={Math.round(zoom * 100)}
                  onChange={(e) => setZoomManual(Number(e.target.value) / 100)}
                  aria-label="Zoomstufe"
                />
                <button
                  type="button"
                  className="wb-zoom-step"
                  onClick={() => setZoomManual(zoom + 0.1)}
                  disabled={zoom >= ZOOM_MAX - 0.001}
                  title="Vergrössern"
                  aria-label="Vergrössern"
                >+</button>
                <button
                  type="button"
                  className="wb-zoom-val"
                  onClick={() => setZoomManual(1)}
                  title="Auf 100 % zurücksetzen"
                >{Math.round(zoom * 100)}%</button>
                <button
                  type="button"
                  className={`wb-zoom-fit${fitWidth ? ' on' : ''}`}
                  onClick={() => setFitWidth((v) => !v)}
                  aria-pressed={fitWidth}
                  title="Blattbreite an das Fenster anpassen"
                >↔ Breite</button>
              </div>
            )}
            {!readOnly && notizCount > 0 && (
              <div className="wb-notiz" role="status">
                <span className="wb-notiz-text">
                  {notizCount === 1 ? '1 Feld' : `${notizCount} Felder`} in diesem Browser gesichert
                </span>
                <button type="button" onClick={clearNotizen}>verwerfen</button>
              </div>
            )}
          </div>
        </div>

        {isKiDoc && !gateKind && (
          <div className="wb-ki-banner" role="note">
            <p>
              <strong>KI-Toolbox — optionales Zusatzangebot.</strong> Der Einsatz dieser Materialien
              entscheidet die Lehrperson; sie sind <strong>kein Pflichtteil</strong> der Einheit.
              Verbindlich sind die drei Herausforderungen, der Kompetenznachweis und der
              Lehrpersonen-/Bewertungsteil.
            </p>
            <p>
              Jedes Dokument ist als <strong>Word-Datei</strong> herunterladbar und
              <strong> nach Bedarf anpassbar</strong>. Tipps zur Reduktion der Dichte:
              in <strong>Gruppenarbeit</strong> einsetzen · als <strong>Vertiefung für starke
              Lernende</strong> · zum <strong>Üben vor dem Kompetenznachweis</strong>.
            </p>
          </div>
        )}
        <main className="pages" ref={pagesRef}>
          <div className="pages-zoom" style={{ zoom }}>
            {gateKind ? <GatePanel kind={gateKind} /> : docNode}
          </div>
        </main>
      </div>

      {navOpen && <div className="wb-scrim" onClick={() => setNavOpen(false)} />}
      {toast && <div className={`toast ${toast.kind === 'error' ? 'error' : ''}`}>{toast.msg}</div>}
    </div>
  )
}
