// Übersicht einer Einheit: die Startseite des Download-Bundles (`Übersicht_LP.html`)
// und — mit `mode: 'vorschau'` — die Startseite der Online-Vorschau.
//
// Aufbau: links ein Inhaltsverzeichnis in Unterrichtsreihenfolge, rechts ein Reader,
// der das gewählte Dokument anzeigt. Ohne JavaScript bleiben die Einträge normale
// Links. Rein (kein Server-Code): läuft im Browser für das ZIP und auf dem Server
// für die Vorschau.

import type { EinheitFullSet } from './types'
import { knTypLabel } from './kn-typ-labels'
import { BEWERTUNGEN, vorschauFeatures, type VorschauFeedbackInput } from '../vorschau'

export interface UebersichtOptions {
  prefix: string
  /** Pfade aller Dateien im Bundle — nur was hier steht, wird verlinkt. */
  log: string[]
  d: EinheitFullSet
  when: Date
  abgedeckteKompetenzen?: string[]
  mode?: 'zip' | 'vorschau'
  /** Nur Vorschau: Ziel des Feedback-Formulars und eine bereits abgegebene Rückmeldung. */
  feedbackEndpoint?: string
  bisherigesFeedback?: VorschauFeedbackInput | null
  /** Nur Vorschau: Link zurück auf die Plattform. */
  zurueckUrl?: string
}

/** Dateipräfix eines Bundles, z. B. `3.2.1_wahre_kosten`. */
export function einheitPrefix(d: EinheitFullSet): string {
  const kompetenz = d.kn?.kompetenz_nr || d.prinzip?.kern_kompetenzversprechen || (d.id.match(/^([\d.]+)/)?.[1]) || 'kompetenz'
  return `${kompetenz}_${d.id.replace(/^[\d.]+_/, '')}`
}

interface Entry {
  key: string
  label: string
  html?: string
  word?: string
  /** Auftrag mit Speichern-Funktion — zum Ausfüllen besser im eigenen Tab. */
  fill?: boolean
}

interface Group {
  key: string
  title: string
  accent: string
  /** Für wen die Dokumente sind. */
  fuer: 'Lernende' | 'Lehrperson' | 'gemischt'
  optional?: boolean
  note?: string
  entries: Entry[]
}

const esc = (v: unknown) =>
  String(v ?? '—')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

/** JSON, das gefahrlos in einem <script> steht. */
const jsonForScript = (v: unknown) => JSON.stringify(v).replace(/</g, '\\u003c')

export function buildUebersicht(o: UebersichtOptions): string {
  const { prefix, log, d, when } = o
  const mode = o.mode ?? 'zip'
  const vorschau = mode === 'vorschau'
  const kompetenz = d.kn?.kompetenz_nr || (d.id.match(/^([\d.]+)/)?.[1]) || ''
  const kompetenzList = o.abgedeckteKompetenzen?.length ? o.abgedeckteKompetenzen.join(', ') : kompetenz
  const thema = d.id.replace(/^[\d.]+_/, '').replace(/_/g, ' ')
  const einheitTitel = (d as any).set?.einheit_titel || (d as any).set?.titel || thema
  const has = new Set(log)

  // Ein Eintrag erscheint nur, wenn mindestens eine seiner Dateien im Bundle liegt
  // (einzelne .docx-Builds können im Browser scheitern).
  const entry = (key: string, label: string, opts: { htmlBase?: string; htmlPath?: string; wordPath?: string; fill?: boolean }): Entry | null => {
    const html = opts.htmlPath ?? (opts.htmlBase ? `html/${opts.htmlBase}` : undefined)
    const word = opts.wordPath ?? (opts.htmlBase ? `word/${opts.htmlBase.replace(/\.html$/, '.docx')}` : undefined)
    const e: Entry = { key, label, fill: opts.fill }
    if (html && has.has(html)) e.html = html
    if (word && has.has(word)) e.word = word
    return e.html || e.word ? e : null
  }
  const groups: Group[] = []
  const push = (g: Omit<Group, 'entries'>, entries: (Entry | null)[]) => {
    const list = entries.filter((e): e is Entry => !!e)
    if (list.length) groups.push({ ...g, entries: list })
  }

  // ── 1 Vorbereitung (Lehrperson) ────────────────────────────────────────────
  const mitLoesungen = [d.hf_A, d.hf_B, d.hf_C].some((hf: any) =>
    (hf?.leitfragen ?? []).some((lf: any) => lf.loesung?.zeilen?.length),
  )
  push({ key: 'vorbereitung', title: 'Vorbereitung', accent: '#0E6E3A', fuer: 'Lehrperson' }, [
    entry('begleiter', d.begleiter?.meta?.titel || 'Begleitdokument', { wordPath: `Material_LP/${prefix}_begleiter.docx` }),
    entry('deck', mitLoesungen ? 'Unterrichtsdeck (mit Lösungen)' : 'Unterrichtsdeck', { htmlPath: `Material_LP/${prefix}_unterrichtsdeck.html` }),
  ])

  // ── 2 Herausforderungen A/B/C ──────────────────────────────────────────────
  const hfAccent: Record<string, string> = { A: '#e11d48', B: '#0284c7', C: '#059669' }
  for (const letter of ['A', 'B', 'C'] as const) {
    const s = d[`hf_${letter}`]
    if (!s) continue
    push({ key: `hf-${letter}`, title: `Herausforderung ${letter}${s.titel ? ` — ${s.titel}` : ''}`, accent: hfAccent[letter], fuer: 'Lernende' }, [
      entry(`hf-${letter}-auftrag`, 'Auftrag (zum Ausfüllen)', { htmlBase: `${prefix}_doc-s_hf-${letter}_auftrag.html`, fill: true }),
      entry(`hf-${letter}-dossier`, 'Dossier (nur Inhalte)', { htmlBase: `${prefix}_doc-s_hf-${letter}_dossier.html` }),
    ])
  }

  // ── 3 Abschluss ────────────────────────────────────────────────────────────
  push({ key: 'abschluss', title: 'Austausch & Transfer', accent: '#7c3aed', fuer: 'Lernende' }, [
    entry('austausch', 'Set-Abschluss', { htmlBase: `${prefix}_doc-austausch.html` }),
    d.dossier ? entry('dossier-eba', 'Glossar+ (EBA)', { htmlBase: `${prefix}_doc-dossier.html` }) : null,
    d.dossier?.leseblatt ? entry('leseblatt', 'Lese-Arbeitsblatt (EBA)', { htmlBase: `${prefix}_doc-leseblatt.html` }) : null,
  ])

  // ── 4 Kompetenznachweis ────────────────────────────────────────────────────
  if (d.kn) {
    push({ key: 'kn', title: 'Kompetenznachweis', accent: '#b45309', fuer: 'gemischt', note: 'Eine Variante auswählen. Die LP-Fassung enthält Auswertung und Bewertungsraster.' }, [
      ...(d.kn.kn_typen || []).map((typ) =>
        entry(`kn-${typ.typ}`, knTypLabel(typ.typ, typ.label, d.kn?.lehrgang), { htmlBase: `${prefix}_doc-kn-s_${typ.typ}.html` }),
      ),
      entry('kn-lp', 'Lehrperson: Auswertung & Raster', { htmlBase: `${prefix}_doc-kn-lp.html` }),
    ])
  }

  // ── 5 KI-Toolbox (optional) ────────────────────────────────────────────────
  const kiTitel = (k: string, fallback: string) => d.ki?.assignments?.find((a) => a.key === k)?.titel || fallback
  push({ key: 'ki', title: 'KI-Toolbox', accent: '#475569', fuer: 'gemischt', optional: true, note: 'Komplementär zur Einheit, formativ — über den Einsatz entscheidet die Lehrperson.' }, [
    d.kiLiesmich?.raw ? entry('ki-liesmich', 'Lies mich! (Lehrperson)', { wordPath: `Material_LP/${prefix}_ki-liesmich.docx` }) : null,
    d.ki?.assignments?.some((a) => a.key === 'ki_1') ? entry('ki-1', kiTitel('ki_1', 'KI-Auftrag 1'), { htmlBase: `${prefix}_doc-ki-1.html` }) : null,
    d.ki?.assignments?.some((a) => a.key === 'ki_2') ? entry('ki-2', kiTitel('ki_2', 'KI-Auftrag 2'), { htmlBase: `${prefix}_doc-ki-2.html` }) : null,
    d.lernprompt ? entry('lernprompt', 'KI-Lernprompt', { htmlBase: `${prefix}_doc-lernprompt.html` }) : null,
    d.lernbegleiter ? entry('lernbegleiter', d.lernbegleiter.lernbegleiter?.titel || 'KI-Lernbegleiter', { htmlBase: `${prefix}_doc-lernbegleiter.html` }) : null,
  ])

  const entries = groups.flatMap((g) => g.entries.map((e) => ({ ...e, group: g.title, accent: g.accent })))
  const features = vorschau ? vorschauFeatures(d) : []

  // ── Seitenleiste ───────────────────────────────────────────────────────────
  const fuerBadge = (g: Group) =>
    g.fuer === 'Lehrperson' ? '<span class="tag tag-lp">LP</span>' : g.fuer === 'Lernende' ? '<span class="tag">Lernende</span>' : ''
  const navGroups = groups
    .map((g, i) => {
      const items = g.entries
        .map((e) => {
          const href = e.html ?? e.word!
          const fmt = [e.html ? 'HTML' : '', e.word ? 'Word' : ''].filter(Boolean).join(' · ')
          return `        <li><a class="nav-item" data-key="${esc(e.key)}" href="${esc(href)}" target="_blank" rel="noopener"><span class="nav-label">${esc(e.label)}</span><span class="nav-fmt">${fmt}</span></a></li>`
        })
        .join('\n')
      return `    <details class="nav-group" data-group="${esc(g.key)}" style="--accent:${g.accent}"${i < 2 ? ' open' : ''}>
      <summary${g.note ? ` title="${esc(g.note)}"` : ''}><span class="nav-num">${i + 1}</span><span class="nav-title">${esc(g.title)}</span>${g.optional ? '<span class="tag tag-opt">optional</span>' : ''}${fuerBadge(g)}</summary>
      <ul>
${items}
      </ul>
    </details>`
    })
    .join('\n')

  // ── Startseite im Reader ───────────────────────────────────────────────────
  const startCards = groups
    .map((g, i) => `      <a class="start-card" href="#/doc/${esc(g.entries[0].key)}" style="--accent:${g.accent}">
        <span class="start-num">${i + 1}</span>
        <span class="start-title">${esc(g.title)}</span>
        <span class="start-sub">${g.entries.length} ${g.entries.length === 1 ? 'Dokument' : 'Dokumente'}${g.fuer === 'Lehrperson' ? ' · für die LP' : g.fuer === 'Lernende' ? ' · für Lernende' : ''}${g.optional ? ' · optional' : ''}</span>
      </a>`)
    .join('\n')

  const vorschauBanner = vorschau
    ? `    <div class="banner">
      <strong>Vorschau — noch nicht freigegeben.</strong>
      So sieht die Einheit im Download aus. Schau dir die neuen Bausteine an und sag uns, ob du sie einsetzen würdest.
      <a class="btn btn-primary" href="#/feedback">Rückmeldung geben</a>
    </div>\n`
    : ''

  // «Was ist neu?» — nur in der Vorschau, eine Karte pro neuem Baustein dieser Einheit.
  const entryKeysNeu = new Set(entries.map((e) => e.key))
  const neuSection = vorschau && features.length
    ? `      <section class="neu">
        <h2>Was ist neu?</h2>
        <p class="muted">Die Einheit folgt dem bekannten Aufbau — drei Herausforderungen, Kompetenznachweis, Begleitdokument. Neu dazu kommen:</p>
        <div class="neu-grid">
${features.map((f) => `          <article class="neu-card">
            <h3>${esc(f.label)}</h3>
            <p>${esc(f.was)}</p>
            <p class="neu-wo"><strong>Wo:</strong> ${esc(f.wo)}</p>
${f.beispiel ? `            <p class="neu-bsp"><strong>Beispiel:</strong> ${esc(f.beispiel)}</p>\n` : ''}            <div class="neu-actions">${entryKeysNeu.has(f.ansehen) ? `<a class="btn" href="#/doc/${esc(f.ansehen)}">Ansehen →</a>` : ''}<a class="btn btn-primary" href="#/feedback">Einschätzen</a></div>
          </article>`).join('\n')}
        </div>
      </section>\n`
    : ''

  const wordHinweis = vorschau
    ? `<p><strong>Word-Dateien</strong> werden heruntergeladen und lassen sich danach in Word anpassen.
    Der vollständige Download mit allen Dateien steht nach der Freigabe im Katalog.</p>`
    : `<p><strong>HTML</strong> öffnet ein Dokument druckfertig im Browser, <strong>Word</strong> öffnet die
    <code>.docx</code>-Version direkt in Microsoft Word zum Anpassen (Word muss installiert sein; beim
    ersten Mal fragt der Browser, ob Word geöffnet werden darf — bestätigen). Beide Formate enthalten
    die gleichen Inhalte. Damit die Links funktionieren, muss der ZIP-Ordner <em>vollständig
    entpackt</em> sein (Ordner <code>html/</code>, <code>word/</code> und <code>Material_LP/</code> daneben).</p>`

  const hinweise = `      <h2>Hinweise zur Arbeit mit den Dokumenten</h2>
    ${wordHinweis}
    <h3>Ausfüllen und speichern</h3>
    <p>Die Auftragsdokumente sind ausfüllbar und speichern sich selbst: Die Lernenden tippen in die
    Felder und klicken auf <strong>Speichern</strong> (oder <code>Ctrl+S</code>). In Chrome und Edge wird
    dieselbe Datei überschrieben; in Firefox und Safari entsteht eine Kopie <code>…_ausgefuellt.html</code>.
    Diese Datei wieder öffnen — alle Eingaben sind da und weiter bearbeitbar. Schriften und Logo stecken
    in der Datei, es braucht also weder Internet noch den entpackten Ordner. Zusätzlich sichert der Browser
    Eingaben lokal zwischen; nach einem Absturz bietet die Datei beim Öffnen an, sie wiederherzustellen.
    Zum Ausfüllen ein Dokument <strong>im eigenen Tab</strong> öffnen, nicht im Reader.</p>
    <h3>Schreibprotokoll</h3>
    <p>Nur in den Herausforderungs-Aufträgen ist Einfügen in den Schreibfeldern deaktiviert, und das
    Dokument führt ein <strong>Schreibprotokoll</strong> — getippte Zeichen, blockierte Einfügeversuche und
    Feldänderungen, zu denen es keine Tastatureingabe gab. Der Knopf «Schreibprotokoll» in der Leiste zeigt
    es; er ist für die Lernenden sichtbar, das ist Absicht. Erfasst werden ausschliesslich Zähler und
    Zeitstempel, nie Tasteninhalte, und nichts davon erscheint im Ausdruck oder in einer PDF-Fassung.
    <strong>Es ist ein Gesprächsanlass, kein Beweis:</strong> wer Entwicklertools bedienen kann, kann das
    Protokoll auch fälschen. Austausch, Kompetenznachweis und KI-Toolbox sind bewusst ausgenommen.</p>
${vorschau ? '' : `    <h3>Nach dem Unterricht</h3>
    <p>Wenn du die Einheit umgesetzt hast, gib uns Feedback über das Online-Formular, das du im Workbench
    unter «Feedback nach Unterricht» findest. Das Feedback fliesst direkt ins Kernteam-1 Reviewing.</p>
`}    <details class="files">
      <summary>Vollständige Dateiliste (${log.length})</summary>
      <ul>
${log.map((f) => `        <li>${esc(f)}</li>`).join('\n')}
      </ul>
    </details>`

  // ── Feedback (nur Vorschau) ────────────────────────────────────────────────
  const entryKeys = new Set(entries.map((e) => e.key))
  const feedbackPanel = vorschau
    ? `    <section class="panel prose" id="panel-feedback" hidden>
      <h2>Rückmeldung zu den neuen Bausteinen</h2>
      <p class="muted">Ein Klick pro Baustein genügt. Du kannst deine Antwort später ändern.</p>
      <form id="fb-form">
${features.length ? features
  .map((f) => `        <fieldset class="fb-feature" data-key="${esc(f.key)}">
          <legend>${esc(f.label)}</legend>
          <p class="muted">${esc(f.frage)}${entryKeys.has(f.ansehen) ? ` <a href="#/doc/${esc(f.ansehen)}">Ansehen →</a>` : ''}</p>
          <div class="fb-choices">
${BEWERTUNGEN.map((b) => `            <label><input type="radio" name="wert-${esc(f.key)}" value="${b.key}" /> <span>${esc(b.label)}</span></label>`).join('\n')}
          </div>
        </fieldset>`)
  .join('\n') : '        <p class="muted">Diese Einheit enthält keine neuen Bausteine.</p>'}
        <fieldset class="fb-feature">
          <legend>Kommentar <span class="muted">(optional)</span></legend>
          <textarea name="kommentar" rows="3" maxlength="2000" placeholder="Was müsste anders sein, damit du es einsetzt?"></textarea>
        </fieldset>
        <div class="fb-actions">
          <button type="submit" class="btn btn-primary" id="fb-submit">Senden</button>
          <span id="fb-status" role="status"></span>
        </div>
      </form>
    </section>\n`
    : ''

  const data = {
    mode,
    entries: Object.fromEntries(entries.map((e) => [e.key, e])),
    feedbackEndpoint: o.feedbackEndpoint ?? null,
    einheitId: d.id,
    bisher: o.bisherigesFeedback ?? null,
  }

  return `<!DOCTYPE html>
<html lang="de-CH">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
${vorschau ? '<meta name="robots" content="noindex, nofollow" />\n' : ''}<title>${vorschau ? 'Vorschau · ' : ''}HKO ${esc(prefix)} — Übersicht der Einheit</title>
<style>
  :root { --brand:#0E6E3A; --brand-dark:#094d28; --brand-tint:#e8f3ec; --ink:#1d2026; --muted:#5b6470;
    --line:#e2e6ea; --bg:#f3f4f5; --side:280px; }
  * { box-sizing:border-box; }
  html, body { height:100%; }
  body { margin:0; background:var(--bg); color:var(--ink); line-height:1.5;
    font-family:'IBM Plex Sans',system-ui,-apple-system,Segoe UI,Roboto,sans-serif; }
  a { color:inherit; }
  .app { display:grid; grid-template-columns:var(--side) minmax(0, 1fr); height:100vh; }

  /* Seitenleiste */
  .side { background:#fff; border-right:1px solid var(--line); display:flex; flex-direction:column; min-height:0; }
  .side-head { padding:16px 16px 12px; border-bottom:1px solid var(--line); border-top:4px solid var(--brand); }
  .side-head a.home { text-decoration:none; display:block; }
  .kicker { font-size:.7rem; font-weight:700; letter-spacing:.06em; text-transform:uppercase; color:var(--brand); }
  .side-title { font-size:1rem; font-weight:600; color:var(--brand-dark); margin:2px 0 0; line-height:1.3; }
  .side-body { overflow:auto; padding:8px 8px 16px; flex:1; }
  .nav-group { border-radius:8px; margin:0 0 2px; }
  .nav-group > summary { list-style:none; cursor:pointer; display:flex; align-items:center; gap:8px;
    padding:8px; border-radius:8px; font-size:.88rem; font-weight:600; }
  .nav-group > summary::-webkit-details-marker { display:none; }
  .nav-group > summary:hover { background:var(--bg); }
  .nav-num { flex:none; width:20px; height:20px; border-radius:50%; background:var(--accent); color:#fff;
    font-size:.7rem; display:grid; place-items:center; }
  .nav-title { flex:1; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .nav-group[open] .nav-title { white-space:normal; }
  .tag { flex:none; font-size:.62rem; font-weight:700; text-transform:uppercase; letter-spacing:.04em;
    color:var(--muted); border:1px solid var(--line); border-radius:999px; padding:0 6px; }
  .tag-lp { color:#8a4b00; border-color:#f0c98a; background:#fff7ea; }
  .tag-opt { color:var(--brand-dark); border-color:var(--brand); }
  .nav-group ul { list-style:none; margin:0 0 6px; padding:0 0 0 28px; }
  .nav-item { display:flex; align-items:baseline; gap:8px; text-decoration:none; padding:6px 8px;
    border-radius:6px; font-size:.86rem; border-left:3px solid transparent; }
  .nav-item:hover { background:var(--bg); }
  .nav-item.active { background:var(--brand-tint); border-left-color:var(--accent, var(--brand)); font-weight:600; }
  .nav-label { flex:1; }
  .nav-fmt { font-size:.68rem; color:var(--muted); white-space:nowrap; }
  .side-foot { border-top:1px solid var(--line); padding:8px; display:grid; gap:2px; }
  .side-link { display:block; text-decoration:none; padding:7px 8px; border-radius:6px; font-size:.86rem; color:var(--muted); }
  .side-link:hover, .side-link.active { background:var(--bg); color:var(--ink); }
  .side-link.primary { color:var(--brand-dark); font-weight:600; }

  /* Reader */
  .main { display:flex; flex-direction:column; min-width:0; min-height:0; }
  .panel { overflow:auto; flex:1; padding:32px clamp(16px, 4vw, 48px); }
  .panel[hidden], .doc[hidden] { display:none; }
  .prose { max-width:820px; }
  .prose h2 { font-size:1.35rem; color:var(--brand-dark); margin:0 0 8px; }
  .prose h3 { font-size:1rem; margin:22px 0 4px; }
  .prose p { margin:0 0 10px; }
  .muted { color:var(--muted); font-size:.9rem; }
  code { background:var(--brand-tint); color:var(--brand-dark); padding:1px 6px; border-radius:4px;
    font-family:'IBM Plex Mono',ui-monospace,Menlo,Consolas,monospace; font-size:.85em; }
  h1 { font-size:1.6rem; color:var(--brand-dark); margin:0 0 6px; line-height:1.25; }
  .meta { color:var(--muted); font-size:.9rem; margin:0 0 2px; }
  .meta strong { color:var(--ink); }
  .banner { background:#fff7ea; border:1px solid #f0c98a; border-radius:10px; padding:14px 16px; margin:0 0 20px;
    display:flex; flex-wrap:wrap; align-items:center; gap:6px 12px; font-size:.92rem; }
  .banner .btn { margin-left:auto; }
  .steps { display:grid; grid-template-columns:repeat(3, 1fr); gap:12px; margin:22px 0; padding:0; list-style:none; counter-reset:s; }
  .steps li { background:#fff; border:1px solid var(--line); border-radius:10px; padding:12px 14px; font-size:.88rem; }
  .steps li strong { display:block; color:var(--brand-dark); margin-bottom:2px; }
  .neu { margin:26px 0 8px; }
  .neu h2 { font-size:1.2rem; color:var(--brand-dark); margin:0 0 4px; }
  .neu-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:12px; margin-top:12px; }
  .neu-card { background:#fff; border:1px solid var(--line); border-top:3px solid var(--brand); border-radius:10px;
    padding:14px 16px; display:flex; flex-direction:column; gap:6px; font-size:.88rem; }
  .neu-card h3 { margin:0; font-size:1rem; }
  .neu-card p { margin:0; }
  .neu-wo, .neu-bsp { color:var(--muted); font-size:.82rem; }
  .neu-bsp { background:var(--bg); border-radius:6px; padding:6px 8px; }
  .neu-actions { display:flex; flex-wrap:wrap; gap:6px; margin-top:auto; padding-top:6px; }
  .start-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(220px, 1fr)); gap:10px; margin:10px 0 24px; }
  .start-card { display:grid; grid-template-columns:auto 1fr; gap:2px 10px; text-decoration:none; background:#fff;
    border:1px solid var(--line); border-top:3px solid var(--accent); border-radius:10px; padding:12px 14px; }
  .start-card:hover { box-shadow:0 2px 10px rgba(0,0,0,.06); }
  .start-num { grid-row:span 2; width:24px; height:24px; border-radius:50%; background:var(--accent); color:#fff;
    font-size:.75rem; font-weight:700; display:grid; place-items:center; }
  .start-title { font-weight:600; font-size:.92rem; }
  .start-sub { font-size:.78rem; color:var(--muted); }

  .doc { display:flex; flex-direction:column; flex:1; min-height:0; }
  .doc-bar { display:flex; flex-wrap:wrap; align-items:center; gap:8px 12px; background:#fff;
    border-bottom:1px solid var(--line); padding:10px 16px; }
  .doc-where { flex:1; min-width:200px; }
  .doc-group { font-size:.72rem; font-weight:700; letter-spacing:.05em; text-transform:uppercase; color:var(--muted); }
  .doc-title { font-size:1rem; font-weight:600; }
  .doc-actions { display:flex; flex-wrap:wrap; gap:6px; }
  .doc-note { width:100%; font-size:.8rem; color:#8a4b00; }
  .doc-note[hidden] { display:none; }
  .doc-frame { flex:1; width:100%; border:0; background:#fff; }
  .doc-word { flex:1; overflow:auto; padding:48px 24px; text-align:center; }
  .doc-word p { max-width:460px; margin:0 auto 16px; color:var(--muted); }
  .doc-nav { display:flex; justify-content:space-between; gap:8px; padding:8px 16px; background:#fff; border-top:1px solid var(--line); }
  .doc-nav a { font-size:.82rem; text-decoration:none; color:var(--brand-dark); max-width:48%; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .doc-nav a[hidden] { visibility:hidden; display:block; }

  .btn { display:inline-flex; align-items:center; gap:6px; text-decoration:none; font:inherit; font-size:.82rem;
    font-weight:600; padding:6px 12px; border-radius:6px; white-space:nowrap; line-height:1.2; cursor:pointer;
    background:#fff; color:var(--brand-dark); border:1px solid var(--brand); }
  .btn:hover { background:var(--brand-tint); }
  .btn-primary { background:var(--brand); color:#fff; }
  .btn-primary:hover { background:var(--brand-dark); }
  .btn[hidden] { display:none; }
  .btn.side-toggle { display:none; }

  details.files { margin-top:24px; }
  details.files summary { cursor:pointer; font-weight:600; color:var(--brand-dark); font-size:.92rem; }
  details.files ul { columns:2; column-gap:28px; padding-left:18px; font-size:.82rem; color:var(--muted); }

  .fb-feature { border:1px solid var(--line); background:#fff; border-radius:10px; padding:12px 16px; margin:0 0 10px; }
  .fb-feature legend { font-weight:600; padding:0 4px; }
  .fb-feature .muted { margin:0 0 8px; }
  .fb-choices { display:flex; flex-wrap:wrap; gap:6px; margin:0 0 8px; }
  .fb-choices label { cursor:pointer; }
  .fb-choices input { position:absolute; opacity:0; }
  .fb-choices span { display:inline-block; font-size:.84rem; padding:5px 12px; border:1px solid var(--line); border-radius:999px; }
  .fb-choices input:checked + span { background:var(--brand); border-color:var(--brand); color:#fff; }
  .fb-choices input:focus-visible + span { outline:2px solid var(--brand); outline-offset:2px; }
  .fb-feature textarea { width:100%; font:inherit; font-size:.88rem; border:1px solid var(--line); border-radius:6px; padding:8px; resize:vertical; }
  .fb-actions { display:flex; align-items:center; gap:12px; margin:14px 0 40px; }
  #fb-status.ok { color:var(--brand-dark); font-weight:600; }
  #fb-status.err { color:#b91c1c; }

  @media (max-width: 860px) {
    .app { grid-template-columns:minmax(0, 1fr); grid-template-rows:auto 1fr; height:auto; min-height:100vh; }
    .side { border-right:0; border-bottom:1px solid var(--line); }
    .side-head { display:flex; align-items:center; gap:10px; }
    .side-head a.home { flex:1; min-width:0; }
    .btn.side-toggle { display:inline-flex; }
    .app:not(.nav-open) .side-body, .app:not(.nav-open) .side-foot { display:none; }
    .doc-frame { min-height:80vh; }
    .steps { grid-template-columns:1fr; }
    details.files ul { columns:1; }
  }
  @media print { .side, .doc-bar, .doc-nav { display:none; } }
</style>
</head>
<body>
<div class="app" id="app">
  <aside class="side">
    <div class="side-head">
      <a class="home" href="#/start">
        <div class="kicker">${vorschau ? 'Vorschau · ' : ''}Einheit ${esc(kompetenz)}</div>
        <div class="side-title">${esc(einheitTitel)}</div>
      </a>
      <button type="button" class="btn side-toggle" id="side-toggle" aria-expanded="false">Inhalt</button>
    </div>
    <nav class="side-body" aria-label="Dokumente der Einheit">
${navGroups}
    </nav>
    <div class="side-foot">
${vorschau ? '      <a class="side-link primary" href="#/feedback" data-view="feedback">Rückmeldung geben</a>\n' : ''}      <a class="side-link" href="#/hinweise" data-view="hinweise">Hinweise &amp; Dateiliste</a>
${vorschau && o.zurueckUrl ? `      <a class="side-link" href="${esc(o.zurueckUrl)}">← Zur Plattform</a>\n` : ''}    </div>
  </aside>

  <main class="main">
    <section class="panel" id="panel-start">
      <div class="prose">
${vorschauBanner}      <h1>${esc(einheitTitel)}</h1>
      <p class="meta"><strong>Abgedeckte Kompetenzen:</strong> ${esc(kompetenzList)} · <strong>Thema:</strong> ${esc(thema)}</p>
      <p class="meta"><strong>${vorschau ? 'Stand' : 'Generiert'}:</strong> ${esc(when.toLocaleString('de-CH'))} · <strong>Dateien:</strong> ${log.length}</p>
${neuSection}      <ol class="steps">
        <li><strong>Auswählen</strong>Links die Dokumente in Unterrichtsreihenfolge.</li>
        <li><strong>Ansehen</strong>Das Dokument erscheint hier im Reader.</li>
        <li><strong>Weiterarbeiten</strong>Im neuen Tab öffnen, drucken oder als Word ${vorschau ? 'herunterladen' : 'öffnen'}.</li>
      </ol>
      </div>
      <div class="start-grid">
${startCards}
      </div>
    </section>

    <section class="doc" id="panel-doc" hidden>
      <div class="doc-bar">
        <div class="doc-where"><div class="doc-group" id="doc-group"></div><div class="doc-title" id="doc-title"></div></div>
        <div class="doc-actions">
          <a class="btn" id="act-tab" target="_blank" rel="noopener">Neuer Tab ↗</a>
          <button type="button" class="btn" id="act-print">Drucken</button>
          <a class="btn" id="act-word">Word</a>
        </div>
        <div class="doc-note" id="doc-note" hidden>Zum Ausfüllen und Speichern das Dokument im neuen Tab öffnen.</div>
      </div>
      <iframe class="doc-frame" id="doc-frame" title="Dokument"></iframe>
      <div class="doc-word" id="doc-word" hidden>
        <p>Dieses Dokument gibt es nur als Word-Datei.</p>
        <a class="btn btn-primary" id="act-word-big">Word ${vorschau ? 'herunterladen' : 'öffnen'}</a>
      </div>
      <div class="doc-nav"><a id="doc-prev" href="#"></a><a id="doc-next" href="#"></a></div>
    </section>

    <section class="panel prose" id="panel-hinweise" hidden>
${hinweise}
    </section>
${feedbackPanel}  </main>
</div>
<script>
(function(){
  var DATA = ${jsonForScript(data)};
  var keys = Object.keys(DATA.entries);
  var $ = function(id){ return document.getElementById(id); };
  var app = $('app');
  var panels = { start: $('panel-start'), doc: $('panel-doc'), hinweise: $('panel-hinweise'), feedback: $('panel-feedback') };
  var frame = $('doc-frame');
  var currentKey = null;

  function wordHref(a, path){
    if (DATA.mode === 'vorschau') { a.href = path; a.setAttribute('download', path.split('/').pop()); a.onclick = null; return; }
    a.href = path;
    // ms-word:-Protokoll mit absoluter file://-URL: öffnet die .docx direkt in Word,
    // egal wohin das ZIP entpackt wurde.
    a.onclick = function(e){ e.preventDefault(); window.location.href = 'ms-word:ofe|u|' + new URL(path, location.href).href; };
  }

  function show(view){
    Object.keys(panels).forEach(function(k){ if (panels[k]) panels[k].hidden = k !== view; });
    document.querySelectorAll('.side-link[data-view]').forEach(function(a){ a.classList.toggle('active', a.getAttribute('data-view') === view); });
    if (view !== 'doc') { document.querySelectorAll('.nav-item.active').forEach(function(a){ a.classList.remove('active'); }); currentKey = null; frame.removeAttribute('src'); }
  }

  function openDoc(key){
    var e = DATA.entries[key];
    if (!e) return show('start');
    show('doc');
    $('doc-group').textContent = e.group;
    $('doc-title').textContent = e.label;
    if (currentKey !== key) {
      if (e.html) { frame.hidden = false; $('doc-word').hidden = true; frame.src = e.html; }
      else { frame.hidden = true; frame.removeAttribute('src'); $('doc-word').hidden = false; }
    }
    currentKey = key;
    $('act-tab').hidden = !e.html; if (e.html) $('act-tab').href = e.html;
    $('act-print').hidden = !e.html;
    $('act-word').hidden = !e.word; if (e.word) { wordHref($('act-word'), e.word); wordHref($('act-word-big'), e.word); }
    $('doc-note').hidden = !e.fill;
    var i = keys.indexOf(key), prev = DATA.entries[keys[i-1]], next = DATA.entries[keys[i+1]];
    $('doc-prev').hidden = !prev; if (prev) { $('doc-prev').href = '#/doc/' + prev.key; $('doc-prev').textContent = '← ' + prev.label; }
    $('doc-next').hidden = !next; if (next) { $('doc-next').href = '#/doc/' + next.key; $('doc-next').textContent = next.label + ' →'; }
    document.querySelectorAll('.nav-item').forEach(function(a){
      var on = a.getAttribute('data-key') === key;
      a.classList.toggle('active', on);
      if (on) { var g = a.closest('details'); if (g) g.open = true; a.style.setProperty('--accent', e.accent); }
    });
    app.classList.remove('nav-open'); $('side-toggle').setAttribute('aria-expanded', 'false');
  }

  function route(){
    var h = location.hash.replace(/^#\\/?/, '');
    if (h.indexOf('doc/') === 0) return openDoc(decodeURIComponent(h.slice(4)));
    if (h === 'hinweise') return show('hinweise');
    if (h === 'feedback' && panels.feedback) return show('feedback');
    show('start');
  }

  // Mit JavaScript öffnen die Einträge im Reader statt im neuen Tab.
  document.querySelectorAll('.nav-item').forEach(function(a){
    a.removeAttribute('target');
    a.addEventListener('click', function(ev){
      if (ev.ctrlKey || ev.metaKey || ev.shiftKey || ev.button === 1) return;
      ev.preventDefault();
      location.hash = '#/doc/' + a.getAttribute('data-key');
    });
  });

  $('act-print').addEventListener('click', function(){
    try { frame.contentWindow.focus(); frame.contentWindow.print(); }
    catch (err) { window.open(frame.src, '_blank', 'noopener'); }
  });

  $('side-toggle').addEventListener('click', function(){
    var open = app.classList.toggle('nav-open');
    this.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  document.addEventListener('keydown', function(ev){
    if (!currentKey || /input|textarea/i.test((ev.target && ev.target.tagName) || '')) return;
    var i = keys.indexOf(currentKey);
    if (ev.altKey && ev.key === 'ArrowDown' && keys[i+1]) { ev.preventDefault(); location.hash = '#/doc/' + keys[i+1]; }
    if (ev.altKey && ev.key === 'ArrowUp' && keys[i-1]) { ev.preventDefault(); location.hash = '#/doc/' + keys[i-1]; }
  });

  window.addEventListener('hashchange', route);
  route();

  // ── Feedback (nur Vorschau) ──
  var form = $('fb-form');
  if (form && DATA.feedbackEndpoint) {
    var status = $('fb-status');
    if (DATA.bisher) {
      var b = DATA.bisher.bewertungen || {};
      Object.keys(b).forEach(function(k){
        if (b[k].wert) { var r = form.querySelector('input[name="wert-' + k + '"][value="' + b[k].wert + '"]'); if (r) r.checked = true; }
      });
      if (DATA.bisher.kommentar) form.querySelector('textarea[name="kommentar"]').value = DATA.bisher.kommentar;
      $('fb-submit').textContent = 'Aktualisieren';
    }
    form.addEventListener('submit', function(ev){
      ev.preventDefault();
      var bewertungen = {};
      form.querySelectorAll('fieldset[data-key]').forEach(function(fs){
        var k = fs.getAttribute('data-key');
        var r = fs.querySelector('input[type=radio]:checked');
        if (r) bewertungen[k] = { wert: r.value };
      });
      var body = { einheit_id: DATA.einheitId, bewertungen: bewertungen, kommentar: form.querySelector('textarea[name="kommentar"]').value };
      var btn = $('fb-submit'); btn.disabled = true;
      status.className = ''; status.textContent = 'Wird gesendet …';
      fetch(DATA.feedbackEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), credentials: 'same-origin' })
        .then(function(res){ return res.json().catch(function(){ return {}; }).then(function(j){ if (!res.ok) throw new Error(j.error || ('Fehler ' + res.status)); return j; }); })
        .then(function(){ status.className = 'ok'; status.textContent = 'Danke! Deine Rückmeldung ist gespeichert.'; btn.textContent = 'Aktualisieren'; })
        .catch(function(err){ status.className = 'err'; status.textContent = err.message; })
        .then(function(){ btn.disabled = false; });
    });
  }
})();
</script>
</body>
</html>`
}
