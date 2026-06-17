import type { ReactNode } from 'react'
import { A4Page, SectionHead } from './chrome'

/* ---------------------------------------------------------------------------
   DocEbaDossier — EBA-only Wissens-Dossier renderer (Renderer B, A4/Print).
   Additiv: nutzt das bestehende A4-Grundraster (A4Page) und legt die EBA-
   Prinzipien P1-P3 darueber. Wird nur fuer lehrgang === "EBA_2J" verwendet
   (Weiche in EinheitWorkbench). EFZ-Doc-Komponenten bleiben unberuehrt.

   Pagination: A4Page ist fix 210x297mm mit overflow:hidden — Inhalt der ueber
   den Rand laeuft wird abgeschnitten. Darum werden die Bloecke (Nuggets,
   Sprachhilfe, Transfer, Glossar) dynamisch auf mehrere A4-Seiten verteilt.

   Styling: Klassen mit Praefix `eba-` (Block in einheiten-renderer.css,
   siehe docs/eba/EBA_RENDER_HANDOFF.md). Das Wurzel-<div> traegt `doc-eba`,
   damit die EBA-Typografie (groesser, kurze Zeilen, linksbuendig) greift.
--------------------------------------------------------------------------- */

export interface DossierNuggetFakt {
  behauptung?: string; wert?: string; quelle?: string
  validiert?: boolean; lp_pruefen?: boolean
}
export interface DossierKiBeispiel {
  so_fragst_du?: string   // vereinfachte Anleitung: wie man fragt
  prompt?: string         // ausgearbeiteter A2-Prompt aus Unit-Material
  tipp?: string           // Nachfrage-Move
}
export interface DossierKiLernen {
  strategie?: string   // kurzer Name der Lernstrategie (z. B. "Lass dich abfragen")
  prompt?: string      // fertiger A2-Lern-Prompt (Retrieval / Selbst-Erklaeren)
}
export interface DossierRecherche {
  suchbegriffe?: string | string[]   // mehrere Plain-Keyword-Suchen (keine Gesetzesartikel)
  ki_beispiel?: DossierKiBeispiel     // "so fragst du die KI" pro Nugget
  ki_lernen?: DossierKiLernen[]       // "so lernst du mit KI" — ein paar Lern-Prompts
  ki_prompt?: string                  // abwaertskompatibel: einzelner Prompt ohne Anleitung
  selbst_pruefen?: string             // Selbst-/Anwendungsauftrag je Nugget
}
export interface DossierNugget {
  id: string; tag: 'A' | 'B' | 'AB' | 'transfer' | string
  titel?: string; inhalt?: string; beispiel?: string
  fuer_leitfrage?: number[]; fakten_anker?: DossierNuggetFakt[]; glossar_refs?: string[]
  recherche?: DossierRecherche
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
export interface DossierKopf {
  einheit_titel?: string
  kompetenz_nr?: string; kompetenz_text?: string
  lebensbezug_nr?: string; lebensbezug_text?: string
  thema_nr?: string; thema_titel?: string
  lehrjahr?: number | string
  lehrgang?: string; sprachniveau?: string
}
export interface DossierEinleitung {
  was_ist_das?: string
  so_benutzt_du_es?: string[]
}
export interface DossierJson {
  id: string; kompetenz_nr?: string; sprachniveau?: string
  kopf?: DossierKopf
  einleitung?: DossierEinleitung
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

function chunk<T>(arr: T[], n: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n))
  return out
}

function nuggetCode(id: string): string {
  // nugget_A_01 -> A-01 ; nugget_B_03 -> B-03 ; fallback: id
  const m = id.match(/_([AB])_?0*?(\d+)$/i)
  return m ? `${m[1].toUpperCase()}-${m[2].padStart(2, '0')}` : id
}

// Recherche-Strip: aus dem internen Fakten-QA (validiert/lp_pruefen, bleibt im JSON)
// werden hier learner-facing Hinweise — Suche, KI-Prompt, Selbst-Pruefauftrag.
function RechercheBlock({ r }: { r: DossierRecherche }) {
  const queries = Array.isArray(r.suchbegriffe)
    ? r.suchbegriffe.filter(Boolean)
    : (r.suchbegriffe ? [r.suchbegriffe] : [])
  const ki = r.ki_beispiel || (r.ki_prompt ? { prompt: r.ki_prompt } : undefined)
  const hasKi = !!(ki && (ki.prompt || ki.so_fragst_du))
  const lernen = (r.ki_lernen || []).filter((l) => l && l.prompt)
  if (!queries.length && !hasKi && !lernen.length && !r.selbst_pruefen) return null
  return (
    <div className="eba-recherche">
      {queries.length > 0 && (
        <div className="eba-rh eba-rh-suche">
          <span className="eba-rh-ic" aria-hidden="true">🔎</span>
          <div>
            <b>Suchen Sie online:</b>
            <ul className="eba-suchliste">
              {queries.map((q, i) => <li key={i}>«{q}»</li>)}
            </ul>
          </div>
        </div>
      )}
      {hasKi && (
        <div className="eba-rh eba-rh-ki">
          <span className="eba-rh-ic" aria-hidden="true">🤖</span>
          <div className="eba-ki-beispiel">
            <b>So fragen Sie die KI:</b>
            {ki!.so_fragst_du && <p className="eba-ki-howto">{ki!.so_fragst_du}</p>}
            {ki!.prompt && <div className="eba-ki-prompt">{ki!.prompt}</div>}
            {ki!.tipp && <p className="eba-ki-tipp">{ki!.tipp}</p>}
            <p className="eba-rh-note">Pruefen Sie die Antwort an einer sicheren Quelle.</p>
          </div>
        </div>
      )}
      {lernen.length > 0 && (
        <div className="eba-rh eba-rh-lernen">
          <span className="eba-rh-ic" aria-hidden="true">📚</span>
          <div className="eba-ki-beispiel">
            <b>So lernen Sie mit KI:</b>
            <ul className="eba-lernliste">
              {lernen.map((l, i) => (
                <li key={i}>{l.strategie && <b>{l.strategie}: </b>}«{l.prompt}»</li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {r.selbst_pruefen && (
        <div className="eba-rh eba-rh-pruef">
          <span className="eba-rh-ic" aria-hidden="true">✏</span>
          <div className="eba-pruef-body">
            <span><b>Selbst pruefen:</b> {r.selbst_pruefen}</span>
            <div className="eba-pruef-lines" aria-hidden="true" />
          </div>
        </div>
      )}
    </div>
  )
}

function NuggetCard({ n }: { n: DossierNugget }) {
  const tag = n.tag === 'A' || n.tag === 'B' ? n.tag : 'ab'
  return (
    <div className={`eba-nugget tag-${String(tag).toLowerCase()}`}>
      <div className="eba-nugget-top">
        <span className="eba-ncode">{nuggetCode(n.id)}</span>
        <h3>{n.titel}</h3>
      </div>
      {n.inhalt && <p>{n.inhalt}</p>}
      {n.beispiel && <div className="eba-bsp"><b>Beispiel:</b> {n.beispiel}</div>}
      {n.recherche && <RechercheBlock r={n.recherche} />}
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

// Titelseite — Kerndaten aus dem nRLP (EBA, nrlp_2j) + Einleitung/Gebrauchsanleitung.
function TitelSeite({ kopf, einleitung }: { kopf?: DossierKopf; einleitung?: DossierEinleitung }) {
  const niveau = kopf?.sprachniveau || 'A2'
  return (
    <>
      <div className="eba-titel-head">
        <div className="eba-titel-kicker">Glossar+ · EBA</div>
        <h1 className="eba-titel-h1">{kopf?.einheit_titel || 'Glossar+'}</h1>
        {kopf?.kompetenz_text && <p className="eba-titel-komp">{kopf.kompetenz_text}</p>}
      </div>
      {kopf && (
        <div className="eba-titel-meta">
          {kopf.thema_nr && <div><span>Thema</span>{kopf.thema_nr}{kopf.thema_titel ? ` · ${kopf.thema_titel}` : ''}</div>}
          {kopf.lebensbezug_nr && <div><span>Lebensbezug</span>{kopf.lebensbezug_nr}{kopf.lebensbezug_text ? ` · ${kopf.lebensbezug_text}` : ''}</div>}
          {kopf.kompetenz_nr && <div><span>Kompetenz</span>{kopf.kompetenz_nr}</div>}
          <div><span>Lehrgang</span>EBA (2 Jahre) · Niveau {niveau}</div>
        </div>
      )}
      {einleitung && (einleitung.was_ist_das || (einleitung.so_benutzt_du_es?.length || 0) > 0) && (
        <div className="eba-einleitung">
          <h2>Was ist das Glossar+?</h2>
          {einleitung.was_ist_das && <p>{einleitung.was_ist_das}</p>}
          {(einleitung.so_benutzt_du_es?.length || 0) > 0 && (
            <>
              <h3>So benutzt du es</h3>
              <ul className="eba-einleitung-liste">
                {einleitung.so_benutzt_du_es!.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </>
          )}
        </div>
      )}
    </>
  )
}

export function DocEbaDossier({ dossier, abteilung, kompetenzNr }: DocEbaDossierProps) {
  const nuggets = dossier.nuggets || []
  const aN = nuggets.filter((n) => n.tag === 'A')
  const bN = nuggets.filter((n) => n.tag === 'B')
  const rest = nuggets.filter((n) => n.tag !== 'A' && n.tag !== 'B')
  const ordered = [...aN, ...bN, ...rest]
  const scaffolds = dossier.sprachmodi_scaffolds || []
  const tw = dossier.transfer_wissensblatt
  const glossar = dossier.glossar || []
  const komp = kompetenzNr || dossier.kompetenz_nr
  const kopf = dossier.kopf
  const einleitung = dossier.einleitung

  // Seiten dynamisch sammeln — A4Page ist overflow:hidden, also klein portionieren.
  const pages: { code: string; titel: string; body: ReactNode }[] = []

  // Titelseite zuerst (Kerndaten aus nRLP + Einleitung), falls vorhanden.
  if (kopf || einleitung) {
    pages.push({
      code: 'GLOSSAR+ · Titel',
      titel: kopf?.einheit_titel || 'Glossar+',
      body: <TitelSeite kopf={kopf} einleitung={einleitung} />,
    })
  }

  // Wissen: EIN Nugget pro Seite — jedes Nugget traegt jetzt reiche Recherche-
  // Scaffolds (mehrere Suchen + KI-Beispiel + Selbst-Pruefen).
  const nugChunks = chunk(ordered, 1)
  ;(nugChunks.length ? nugChunks : [[]]).forEach((grp, i) => {
    pages.push({
      code: 'GLOSSAR+ · Wissen',
      titel: 'Glossar+',
      body: (
        <>
          <SectionHead num="D1">{i === 0 ? 'Dein Glossar+' : 'Glossar+ (Fortsetzung)'}</SectionHead>
          {grp.map((n) => <NuggetCard key={n.id} n={n} />)}
        </>
      ),
    })
  })

  // Sprachhilfe: ein Scaffold pro Seite (Schritt-Listen sind hoch).
  scaffolds.forEach((sc, i) => {
    pages.push({
      code: 'GLOSSAR+ · Sprachhilfe',
      titel: 'So schreibst du',
      body: (
        <>
          <SectionHead num="D2">{i === 0 ? 'So schreibst du Schritt fuer Schritt' : 'So schreibst du (Fortsetzung)'}</SectionHead>
          <ScaffoldCard sc={sc} />
        </>
      ),
    })
  })

  // Transfer-Wissensblatt auf eigener Seite.
  if (tw) {
    pages.push({
      code: 'GLOSSAR+ · Grundprinzip',
      titel: 'Das Grundprinzip',
      body: (
        <>
          <SectionHead num="D2">Das Grundprinzip</SectionHead>
          <div className="eba-transfer">
            {tw.prinzip_in_einfach && <p className="eba-lead">{tw.prinzip_in_einfach}</p>}
            {tw.fachsystematik && <p>{tw.fachsystematik}</p>}
            {tw.austausch_scaffolds?.satzanfaenge?.filter(Boolean).length ? (
              <>
                <div className="eba-scaffold-label">Austausch — Satzanfaenge</div>
                <ul>{tw.austausch_scaffolds.satzanfaenge!.filter(Boolean).map((s, i) => <li key={i}>{s}</li>)}</ul>
              </>
            ) : null}
          </div>
        </>
      ),
    })
  }

  // Glossar: alles auf eine Seite (zweispaltig); hoher Cap, nur sehr grosse
  // Glossare (>24) wuerden ueberhaupt umbrechen.
  chunk(glossar, 24).forEach((grp, i) => {
    pages.push({
      code: 'GLOSSAR+ · Glossar',
      titel: 'Glossar',
      body: (
        <>
          <SectionHead num="D3">{i === 0 ? 'Glossar — schwierige Woerter einfach erklaert' : 'Glossar (Fortsetzung)'}</SectionHead>
          <div className="eba-glossar">
            {grp.map((g) => (
              <div className="eba-gloss" key={g.id}>
                <span className="eba-gloss-b">{g.begriff}</span> — <span className="eba-gloss-e">{g.erklaerung_a2}</span>
                {g.beispiel && <span className="eba-gloss-x"> Bsp.: {g.beispiel}</span>}
              </div>
            ))}
          </div>
        </>
      ),
    })
  })

  // Notizen-Seite zuletzt: linierte Flaeche zum Selber-Schreiben.
  pages.push({
    code: 'GLOSSAR+ · Notizen',
    titel: 'Meine Notizen',
    body: (
      <>
        <SectionHead num="N">Meine Notizen</SectionHead>
        <p className="eba-notizen-hint">Hier kannst du schreiben: Antworten, Fragen oder wichtige Woerter.</p>
        <div className="eba-notizen" aria-hidden="true" />
      </>
    ),
  })

  const total = pages.length
  return (
    <div className="doc-eba-root">
      {pages.map((p, i) => (
        <A4Page key={i} docCode={p.code} docTitel={p.titel} pageNum={i + 1} pageTotal={total} kompetenzNr={komp} abteilung={abteilung}>
          <Section>{p.body}</Section>
        </A4Page>
      ))}
    </div>
  )
}
