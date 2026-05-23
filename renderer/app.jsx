/* app.jsx — Main HKO renderer app */
/* globals React, ReactDOM, DocS, DocKnS, DocKnLp, ABTEILUNGEN, DOC_LABELS,
   TweaksPanel, useTweaks, TweakSection, TweakRadio, TweakSelect */

const { useState, useEffect, useCallback } = React;

const ROLE_RE = /^(.+?)_(sit_[ABC]|kn|prinzip|set)\.json$/;

// Discover all JSON sets in the data/ folder.
// Strategy 1: parse the HTTP directory listing (works with `python -m http.server`).
// Strategy 2: fall back to a known manifest at data/index.json.
// Strategy 3: fall back to the bundled reference set.
async function discoverSets() {
  const FALLBACK = ['1.1.1_konflikt_kommunizieren'];
  let filenames = [];
  try {
    const r = await fetch('data/');
    if (r.ok) {
      const html = await r.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      filenames = Array.from(doc.querySelectorAll('a[href$=".json"]'))
        .map(a => decodeURIComponent(a.getAttribute('href') || ''))
        .filter(Boolean);
    }
  } catch { /* fall through */ }
  if (!filenames.length) {
    try {
      const r = await fetch('data/index.json');
      if (r.ok) {
        const j = await r.json();
        if (Array.isArray(j)) filenames = j;
      }
    } catch { /* fall through */ }
  }
  if (!filenames.length) {
    for (const slug of FALLBACK) {
      for (const role of ['sit_A', 'sit_B', 'sit_C', 'kn', 'prinzip', 'set']) {
        filenames.push(`${slug}_${role}.json`);
      }
    }
  }

  const groups = new Map();
  for (const name of filenames) {
    const m = name.match(ROLE_RE);
    if (!m) continue;
    const [, prefix, role] = m;
    if (!groups.has(prefix)) groups.set(prefix, { key: prefix, files: {} });
    groups.get(prefix).files[role] = `data/${name}`;
  }
  return Array.from(groups.values()).sort((a, b) => a.key.localeCompare(b.key));
}

function prettifySetKey(key) {
  // "1.1.1_konflikt_kommunizieren" → "1.1.1 · konflikt kommunizieren"
  const m = key.match(/^([\d.]+)_(.+)$/);
  if (!m) return key.replace(/_/g, ' ');
  return `${m[1]} · ${m[2].replace(/_/g, ' ')}`;
}

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "document": "doc-s",
  "situation": "A",
  "modus": "fill",
  "knTyp": "fachgespraech",
  "abteilung": "",
  "setKey": ""
}/*EDITMODE-END*/;

function classifyFile(json) {
  if (!json || typeof json !== 'object') return null;
  const id = json.id || '';
  if (id.endsWith('_prinzip')) return 'prinzip';
  if (id.endsWith('_kn')) return 'kn';
  if (id.endsWith('_set')) return 'set';
  if (id.endsWith('_sit_A')) return 'sit_A';
  if (id.endsWith('_sit_B')) return 'sit_B';
  if (id.endsWith('_sit_C')) return 'sit_C';
  // Fallbacks
  if (json.sub_facetten) return 'prinzip';
  if (json.kn_typen) return 'kn';
  if (json.konzept_progression) return 'set';
  if (json.situation === 'A') return 'sit_A';
  if (json.situation === 'B') return 'sit_B';
  if (json.situation === 'C') return 'sit_C';
  return null;
}

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  const [data, setData] = useState({
    sit_A: null, sit_B: null, sit_C: null,
    kn: null, prinzip: null, set: null,
  });
  const [sets, setSets] = useState([]);     // discovered sets in data/
  const [edits, setEdits] = useState({});
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  // Pure fetch: returns the loaded files for a set without touching React state.
  const fetchSetFiles = useCallback(async (setEntry) => {
    const loaded = { sit_A: null, sit_B: null, sit_C: null, kn: null, prinzip: null, set: null };
    if (!setEntry) return loaded;
    for (const [role, path] of Object.entries(setEntry.files)) {
      try {
        const r = await fetch(path);
        if (!r.ok) continue;
        const j = await r.json();
        const kind = classifyFile(j) || role;
        loaded[kind] = j;
      } catch (e) {
        console.warn('Failed to load', path, e);
      }
    }
    return loaded;
  }, []);

  const loadSet = useCallback(async (setEntry) => {
    if (!setEntry) return;
    const loaded = await fetchSetFiles(setEntry);
    setData(loaded);
    setEdits({});
  }, [fetchSetFiles]);

  // Rescan data/ for sets. Returns the new list.
  const rescanSets = useCallback(async () => {
    try {
      const discovered = await discoverSets();
      setSets(prev => {
        // shallow-equality check on keys to avoid needless re-renders
        const prevKeys = prev.map(s => s.key).join('|');
        const newKeys = discovered.map(s => s.key).join('|');
        return prevKeys === newKeys ? prev : discovered;
      });
      return discovered;
    } catch (e) {
      console.warn('Could not discover sets', e);
      return [];
    }
  }, []);

  // Initial discovery + load
  useEffect(() => {
    (async () => {
      const discovered = await rescanSets();
      const wanted = tweaks.setKey && discovered.find(s => s.key === tweaks.setKey);
      const target = wanted || discovered[0];
      if (target) {
        if (target.key !== tweaks.setKey) setTweak('setKey', target.key);
        await loadSet(target);
      }
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-scan when the window regains focus (catches files added at runtime).
  useEffect(() => {
    const onFocus = () => { rescanSets(); };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [rescanSets]);

  // React to user-driven set switches
  useEffect(() => {
    if (!sets.length || !tweaks.setKey) return;
    const target = sets.find(s => s.key === tweaks.setKey);
    if (!target) return;
    // Skip if already loaded (kn id matches the prefix)
    const currentKey = data.kn?.id?.replace(/_kn$/, '')
      || data.prinzip?.id?.replace(/_prinzip$/, '')
      || data.set?.id?.replace(/_set$/, '');
    if (currentKey === tweaks.setKey) return;
    loadSet(target);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tweaks.setKey, sets]);

  // Apply density-compact when DOC-S info mode is active
  useEffect(() => {
    document.body.classList.remove('aesthetic-modern', 'aesthetic-editorial');
    document.body.classList.add('aesthetic-modern');
    const compact = tweaks.document === 'doc-s' && tweaks.modus === 'info';
    document.body.classList.toggle('density-compact', compact);
  }, [tweaks.document, tweaks.modus]);

  const onEdit = useCallback((key, value) => {
    setEdits(prev => ({ ...prev, [key]: value }));
  }, []);

  // Resolve active document
  const doc = tweaks.document;
  const situation = tweaks.situation;
  const modus = tweaks.modus;
  const knTyp = tweaks.knTyp;
  const abteilung = tweaks.abteilung;

  let docNode = null;
  let docMissing = null;
  if (doc === 'doc-s') {
    const sit = data[`sit_${situation}`];
    if (!sit) docMissing = `Situation ${situation} fehlt`;
    else if (!data.set) docMissing = 'set-Datei fehlt';
    else docNode = <DocS sit={sit} set={data.set} abteilung={abteilung} mode={modus} edits={edits} onEdit={onEdit} />;
  } else if (doc === 'doc-kn-s') {
    if (!data.kn) docMissing = 'kn-Datei fehlt';
    else docNode = <DocKnS kn={data.kn} knTyp={knTyp} abteilung={abteilung} edits={edits} onEdit={onEdit} />;
  } else if (doc === 'doc-kn-lp') {
    if (!data.kn || !data.prinzip) docMissing = 'kn- oder prinzip-Datei fehlt';
    else docNode = <DocKnLp kn={data.kn} prinzip={data.prinzip} set={data.set} abteilung={abteilung} />;
  }

  const handlePrint = () => {
    window.print();
  };

  // Bundle all renderings as standalone HTML files in a zip
  const [bundling, setBundling] = useState(false);
  const handleBundle = async () => {
    if (bundling) return;
    if (!window.ReactDOMServer || !window.JSZip) {
      setToast({ msg: 'Bundling-Bibliotheken noch nicht geladen.', kind: 'error' });
      setTimeout(() => setToast(null), 3000);
      return;
    }
    // Only bundle the currently rendered set.
    if (!data.sit_A && !data.kn && !data.prinzip && !data.set) {
      setToast({ msg: 'Kein aktives Set zum Bundeln.', kind: 'error' });
      setTimeout(() => setToast(null), 3000);
      return;
    }
    setBundling(true);
    try {
      const [cssText, pngArrayBuffer] = await Promise.all([
        fetch('styles.css').then(r => r.text()),
        fetch('assets/logo-bbw.png').then(r => r.arrayBuffer()),
      ]);
      // Base64 the PNG once for inline use across all standalone HTML files
      const pngBytes = new Uint8Array(pngArrayBuffer);
      let bin = '';
      for (let i = 0; i < pngBytes.length; i++) bin += String.fromCharCode(pngBytes[i]);
      const pngDataUrl = 'data:image/png;base64,' + btoa(bin);

      const wrap = (title, bodyMarkup, opts = {}) => {
        const cls = ['aesthetic-modern'];
        if (opts.compact) cls.push('density-compact');
        const markup = bodyMarkup.replaceAll('assets/logo-bbw.png', pngDataUrl);
        return `<!DOCTYPE html>
<html lang="de-CH">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap" />
  <style>
${cssText}

.standalone-bar{position:fixed;top:0;left:0;right:0;z-index:50;background:#1d2026;color:#e8eaee;padding:10px 18px;display:flex;align-items:center;gap:14px;font-family:'IBM Plex Sans',system-ui,sans-serif;font-size:13px;}
.standalone-bar .name{font-weight:600}
.standalone-bar .spacer{flex:1}
.standalone-bar button{font-family:inherit;background:#e8eaee;color:#1d2026;border:0;padding:6px 14px;border-radius:4px;cursor:pointer;font-size:12px;font-weight:500;letter-spacing:.02em}
.standalone-bar button:hover{background:#fff}
.standalone-bar .hint{color:#a3a8b2;font-size:11px}
.pages{padding:60px 24px 64px}
@media print { .standalone-bar { display:none !important } .pages { padding: 0 } }
  </style>
</head>
<body class="${cls.join(' ')}">
  <div class="standalone-bar">
    <span class="name">${title}</span>
    <span class="hint">Tippe oder klicke in die Felder, dann auf Drucken.</span>
    <span class="spacer"></span>
    <button onclick="window.print()">Drucken</button>
  </div>
  <main class="pages">${markup}</main>
  <script>
    // Make all rendered content editable so the LP can adjust pre-print
    document.addEventListener('DOMContentLoaded', () => {
      document.querySelectorAll('.feld, .hp-flaeche').forEach(el => el.setAttribute('contenteditable', 'true'));
    });
  </script>
</body>
</html>`;
      };

      const renderStatic = (element) => window.ReactDOMServer.renderToStaticMarkup(element);

      const zip = new window.JSZip();
      const log = [];

      const d = data;
      const kompetenz = d.kn?.kompetenz_nr || d.prinzip?.kompetenz_nr || d.sit_A?.nrlp?.nr || 'kompetenz';
      const slug = d.kn?.topic_slug || tweaks.setKey?.replace(/^[\d.]+_/, '') || 'set';
      const prefix = `${kompetenz}_${slug}`;
      const bundlePrefix = prefix;

      // DOC-S info + fill for A / B / C
      for (const letter of ['A', 'B', 'C']) {
        const sit = d[`sit_${letter}`];
        if (!sit || !d.set) continue;
        for (const mode of ['info', 'fill']) {
          const markup = renderStatic(
            <DocS sit={sit} set={d.set} abteilung={tweaks.abteilung} mode={mode} edits={{}} onEdit={()=>{}} />
          );
          const filename = `${prefix}_doc-s_sit-${letter}_${mode}.html`;
          const title = `DOC-S Sit ${letter} (${mode}) · ${sit.titel}`;
          zip.file(filename, wrap(title, markup, { compact: mode === 'info' }));
          log.push(filename);

          if (window.HkoDocx) {
            try {
              const doc = window.HkoDocx.buildDocS({ sit, set: d.set, abteilung: tweaks.abteilung, mode, logoPng: pngArrayBuffer });
              const blob = await window.HkoDocx.toBlob(doc);
              const docxName = filename.replace(/\.html$/, '.docx');
              zip.file(docxName, blob);
              log.push(docxName);
            } catch (e) { console.warn('docx build failed for', filename, e); }
          }
        }
      }

      // DOC-KN-S — one build per kn_typ
      if (d.kn) {
        for (const typ of (d.kn.kn_typen || [])) {
          const markup = renderStatic(
            <DocKnS kn={d.kn} knTyp={typ.typ} abteilung={tweaks.abteilung} edits={{}} onEdit={()=>{}} />
          );
          const filename = `${prefix}_doc-kn-s_${typ.typ}.html`;
          const title = `DOC-KN-S ${typ.label}`;
          zip.file(filename, wrap(title, markup));
          log.push(filename);

          if (window.HkoDocx) {
            try {
              const doc = window.HkoDocx.buildKnS({ kn: d.kn, knTyp: typ.typ, abteilung: tweaks.abteilung, logoPng: pngArrayBuffer });
              const blob = await window.HkoDocx.toBlob(doc);
              const docxName = filename.replace(/\.html$/, '.docx');
              zip.file(docxName, blob);
              log.push(docxName);
            } catch (e) { console.warn('docx build failed for', filename, e); }
          }
        }
      }

      // DOC-KN-LP — single rendering
      if (d.kn && d.prinzip) {
        const markup = renderStatic(
          <DocKnLp kn={d.kn} prinzip={d.prinzip} set={d.set} abteilung={tweaks.abteilung} />
        );
        const filename = `${prefix}_doc-kn-lp.html`;
        const title = `DOC-KN-LP Lehrperson + Bewertung`;
        zip.file(filename, wrap(title, markup));
        log.push(filename);

        if (window.HkoDocx) {
          try {
            const doc = window.HkoDocx.buildKnLp({ kn: d.kn, prinzip: d.prinzip, set: d.set, abteilung: tweaks.abteilung, logoPng: pngArrayBuffer });
            const blob = await window.HkoDocx.toBlob(doc);
            const docxName = filename.replace(/\.html$/, '.docx');
            zip.file(docxName, blob);
            log.push(docxName);
          } catch (e) { console.warn('docx build failed for', filename, e); }
        }
      }

      const readme = `# HKO ${prefix} — Inhalt des Bundles

**Kompetenz:** ${kompetenz} · **Thema:** ${slug.replace(/_/g, ' ')}
**Generiert:** ${new Date().toLocaleString('de-CH')}
**Dateien:** ${log.length}

---

## Was ist drin?

Dieses Bundle enthält ${log.length} Dokumente in zwei Formaten: druckfertige
**HTML-Dateien** (A4, zum Direkt-Drucken im Browser) und **Word-Dateien (.docx)**
(zum Anpassen / Kommentieren in Word). Beide Formate enthalten die gleichen
Inhalte; HTML druckt 1:1 wie geplant, Word lässt sich weiterbearbeiten.

Schreibfelder im fill-Modus: in HTML sind sie editierbar, in Word sind sie als
Linien-Paragraphen vorhanden — entweder anklicken und tippen, oder die ganze
Datei ausdrucken und von Hand ausfüllen.

Eingaben werden NICHT gespeichert (HTML); ein Reload setzt sie zurück. Die
Word-Datei speicherst du wie gewohnt mit Cmd/Ctrl+S.

---

## Dokumente im Bundle

**\`_doc-s_sit-{A,B,C}_{info|fill}.html\`/\`.docx\`** — Schüler-Situationsheft, je 6 Varianten pro Set:
- **\`_info\`** — kompakt 4 Seiten, vollständige Muster-Mindmap und Anleitungen, keine Schreibfelder. Zweck: Projektion / Lösungsblatt.
- **\`_fill\`** — großzügig 8 Seiten, Mindmap als leeres Skelett, überall dort Schreiblinien-Felder, wo Lernende produzieren. Zweck: Schüler-Arbeitsheft.

**\`_doc-kn-s_{fachgespraech|mini_case_schriftlich|werkschau_transfer}.html\`/\`.docx\`** — KN-Durchführung Schüler, je 3 Varianten pro Set: Mündliches Fachgespräch (30–35 Min), Schriftliche Prüfung (45–60 Min), oder Werkschau + Transfer-Reflexion (schriftlich + optional 5-Min-Präsentation). Enthält Hybrid-Situation, Ablauf, typ-spezifische Aufgaben mit Schreibfeldern und gestrippte Rubrik (ohne 4-Stufen-Diagnostik).

**\`_doc-kn-lp.html\`/\`.docx\`** — KN-Durchführung + Bewertung Lehrperson, 1 Datei pro Set, 6 Seiten:
1. Kontext (Kern-Kompetenzversprechen, Subfacetten A/B/C, Zirkularität, Konzeptbogen)
2. Hybrid-Situation + Alignment (Szenen-Element → Subfacette, aktivierte Trade-offs)
3. Fachgespräch durchführen (inkl. K-Stufen)
4. Mini Case durchführen (inkl. K-Stufen)
5. Werkschau durchführen (inkl. K-Stufen)
6. Bewertungs-Grid: Bi-dimensional (SuK + Ges), 4 Kriterien × 4 Stufen, ankreuzbar, getrennte SuK- + Ges-Note

---

## Set-Übersicht

| Komponente | Titel |
|---|---|
| Situation A (rot) | ${d.sit_A?.titel || '—'} |
| Situation B (blau) | ${d.sit_B?.titel || '—'} |
| Situation C (grün) | ${d.sit_C?.titel || '—'} |
| KN Hybrid-Situation | ${d.kn?.hybrid_situation?.titel || '—'} |

---

## Bedienung pro Datei

1. **Doppelklick** auf die HTML-Datei öffnet sie im Browser (Chrome / Edge / Firefox / Safari).
2. **Schreibfelder ausfüllen:** Klicke in eine Linienfläche und tippe. Funktioniert auch
   auf Tablets mit Tastatur.
3. **Drucken:** Knopf oben rechts oder \`Cmd/Ctrl+P\`. Wähle im Druck-Dialog
   «A4 Hochformat». Für PDF: Ziel = «Als PDF speichern».
4. **Vorsicht:** Bei Reload sind Eingaben weg. Wenn du eine ausgefüllte Version
   behalten willst, drucke vorher (oder speichere als PDF).

---

## Farbcode

- Situation **A** = rot · **B** = blau · **C** = grün (aus der JSON-Quelle)
- KN/LP-Dokumente neutral graphit

Sprache: Swiss Standard German, kein Eszett.

---

## Dateiliste

${log.map(f => '- ' + f).join('\n')}
`;
      zip.file('README.md', readme);

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${bundlePrefix}_hko_bundle.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setToast({ msg: `${log.length} Dateien als Zip exportiert.`, kind: 'ok' });
    } catch (e) {
      console.error(e);
      setToast({ msg: 'Fehler beim Bundling: ' + e.message, kind: 'error' });
    } finally {
      setBundling(false);
      setTimeout(() => setToast(null), 3500);
    }
  };

  return (
    <>
      <header className="app-chrome">
        <div className="chrome-brand">
          <img className="chrome-logo" src="assets/logo-bbw.png" alt="" />
        </div>
        <select
          className="chrome-abt"
          value={abteilung}
          onChange={(e) => setTweak('abteilung', e.target.value)}
        >
          {ABTEILUNGEN.map(a => (
            <option key={a} value={a}>{a || '— Abteilung wählen —'}</option>
          ))}
        </select>

        {sets.length > 0 && (
          <>
            <div className="chrome-group-divider" />
            <div className="chrome-group">
              <span className="chrome-group-label" title="Klicke ein Set, um es in der Vorschau anzuzeigen. «Alle als ZIP» exportiert das aktuell angezeigte Set.">
                Sets ({sets.length})
              </span>
              <div className="chrome-set-list">
                {sets.map(s => {
                  const active = tweaks.setKey === s.key;
                  return (
                    <button
                      key={s.key}
                      className={`set-chip-name ${active ? 'active' : ''}`}
                      title="Klick zum Anzeigen in der Vorschau"
                      onClick={() => setTweak('setKey', s.key)}
                    >{prettifySetKey(s.key)}</button>
                  );
                })}
                <button
                  className="set-chip-refresh"
                  title="Datenordner erneut nach Sets durchsuchen"
                  onClick={() => rescanSets()}
                >↻</button>
              </div>
            </div>
          </>
        )}

        <div className="chrome-group-divider" />
        <div className="chrome-group">
          <span className="chrome-group-label">Doc</span>
          <div className="chrome-seg">
            <button className={doc === 'doc-s' ? 'on' : ''} onClick={() => setTweak('document', 'doc-s')}>Situationsheft</button>
            <button className={doc === 'doc-kn-s' ? 'on' : ''} onClick={() => setTweak('document', 'doc-kn-s')}>KN&nbsp;Schüler</button>
            <button className={doc === 'doc-kn-lp' ? 'on' : ''} onClick={() => setTweak('document', 'doc-kn-lp')}>KN&nbsp;Lehrperson</button>
          </div>
        </div>

        {doc === 'doc-s' && (
          <>
            <div className="chrome-group-divider" />
            <div className="chrome-group">
              <span className="chrome-group-label">Sit</span>
              <div className="chrome-seg">
                {['A', 'B', 'C'].map(s => (
                  <button
                    key={s}
                    className={situation === s ? 'on' : ''}
                    onClick={() => setTweak('situation', s)}
                  >{s}</button>
                ))}
              </div>
            </div>
            <div className="chrome-group">
              <span className="chrome-group-label">Modus</span>
              <div className="chrome-seg">
                <button className={modus === 'info' ? 'on' : ''} onClick={() => setTweak('modus', 'info')}>Dossier</button>
                <button className={modus === 'fill' ? 'on' : ''} onClick={() => setTweak('modus', 'fill')}>Auftrag</button>
              </div>
            </div>
          </>
        )}

        {doc === 'doc-kn-s' && (
          <>
            <div className="chrome-group-divider" />
            <div className="chrome-group">
              <span className="chrome-group-label">KN-Typ</span>
              <div className="chrome-seg">
                <button className={knTyp === 'fachgespraech' ? 'on' : ''} onClick={() => setTweak('knTyp', 'fachgespraech')}>Fachgespräch</button>
                <button className={knTyp === 'mini_case_schriftlich' ? 'on' : ''} onClick={() => setTweak('knTyp', 'mini_case_schriftlich')}>Mini&nbsp;Case</button>
                <button className={knTyp === 'werkschau_transfer' ? 'on' : ''} onClick={() => setTweak('knTyp', 'werkschau_transfer')}>Werkschau</button>
              </div>
            </div>
          </>
        )}

        <div className="chrome-spacer" />

        <button className="chrome-btn" onClick={handleBundle} disabled={bundling}>
          {bundling ? 'Bundle läuft…' : 'Alle als ZIP'}
        </button>
        <button className="chrome-btn primary" onClick={handlePrint}>Drucken</button>
      </header>

      <main className="pages">
        {loading ? (
          <div style={{ color: '#fff', padding: '40px', fontSize: '14px' }}>Lade Standard-Set …</div>
        ) : docMissing ? (
          <div className="a4-page">
            <div style={{ padding: '40mm 0', textAlign: 'center' }}>
              <h2 style={{ fontSize: '14pt', marginBottom: '4mm' }}>Datei fehlt</h2>
              <p style={{ color: 'var(--ink-soft)' }}>{docMissing}. Lege die fehlenden JSON-Dateien in den Ordner <code>data/</code> und klicke ↻ in der Set-Liste oben.</p>
            </div>
          </div>
        ) : (
          docNode
        )}
      </main>

      {toast && (
        <div className={`toast ${toast.kind === 'error' ? 'error' : ''}`}>{toast.msg}</div>
      )}

      <TweaksPanel title="Tweaks">
        {sets.length > 0 && (
          <>
            <TweakSection label="Datenset" />
            <TweakSelect
              label="Set"
              value={tweaks.setKey || ''}
              onChange={(v) => setTweak('setKey', v)}
              options={sets.map(s => ({ value: s.key, label: prettifySetKey(s.key) }))}
            />
          </>
        )}

        <TweakSection label="Dokument" />
        <TweakSelect
          label="Typ"
          value={doc}
          onChange={(v) => setTweak('document', v)}
          options={[
            { value: 'doc-s', label: 'DOC-S Situationsheft' },
            { value: 'doc-kn-s', label: 'DOC-KN-S KN Schueler' },
            { value: 'doc-kn-lp', label: 'DOC-KN-LP KN Lehrperson' },
          ]}
        />

        {doc === 'doc-s' && (
          <>
            <TweakSection label="Situationsheft" />
            <TweakRadio
              label="Situation"
              value={situation}
              onChange={(v) => setTweak('situation', v)}
              options={[
                { value: 'A', label: 'A' },
                { value: 'B', label: 'B' },
                { value: 'C', label: 'C' },
              ]}
            />
            <TweakRadio
              label="Modus"
              value={modus}
              onChange={(v) => setTweak('modus', v)}
              options={[
                { value: 'info', label: 'Dossier' },
                { value: 'fill', label: 'Auftrag' },
              ]}
            />
          </>
        )}

        {doc === 'doc-kn-s' && (
          <>
            <TweakSection label="KN-Typ" />
            <TweakSelect
              label="Typ"
              value={knTyp}
              onChange={(v) => setTweak('knTyp', v)}
              options={[
                { value: 'fachgespraech', label: 'Fachgespraech' },
                { value: 'mini_case_schriftlich', label: 'Mini Case' },
                { value: 'werkschau_transfer', label: 'Werkschau' },
              ]}
            />
          </>
        )}

        <TweakSection label="Aesthetik" />
        <div style={{ fontSize: '10px', color: 'rgba(41,38,27,.5)', padding: '0 2px' }}>
          Modern (fest) — Editorial-Variante ausgeblendet.
        </div>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
