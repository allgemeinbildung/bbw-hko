/**
 * Gemeinsamer HTML-Shell für alle eigenständigen Einheiten-Dokumente — sowohl für
 * den Einzeldownload als auch für die Dateien im ZIP-Bundle. Vorher war dieser
 * Shell in EinheitWorkbench.tsx zweimal wörtlich dupliziert.
 *
 * Der Shell liefert drei Dinge, die eine heruntergeladene Datei offline
 * arbeitsfähig machen:
 *
 *   A  «Speichern» serialisiert das komplette Dokument (die Antworten stehen als
 *      contenteditable-Inhalt real im DOM) und lädt es als neue HTML-Datei
 *      herunter. Beim Öffnen dieser Datei ist alles wieder da und weiter
 *      editierbar. Funktioniert unter file://, offline, in jedem Browser.
 *   B  Wo die File System Access API existiert (Chrome/Edge Desktop), wird
 *      derselbe Knopf zum echten Überschreiben derselben Datei — kein
 *      «Dokument (1).html»-Stapel. Ctrl+S/Cmd+S ist verdrahtet. Schlägt das
 *      fehl oder fehlt die API, fällt es still auf A zurück.
 *   —  Einfügen ist in den Schreibfeldern deaktiviert (Zwischenablage,
 *      Drag-and-Drop, beforeinput). Bewusst eine Hürde, keine Sperre.
 *   C  Autosave in localStorage als Absturznetz — bewusst NICHT der
 *      Primärspeicher: es hängt am Browserprofil, wandert nicht mit der Datei
 *      mit und ist unter file:// unzuverlässig (Safari blockt, Chrome teilt
 *      einen Topf über alle file://-Dokumente — daher der dokument-eigene Key).
 *      Beim Öffnen erscheint bei Abweichung ein Wiederherstellen-Banner.
 */

/** Platzhalter, den buildStandaloneHtml() durch den JSON-kodierten Dokument-Key ersetzt. */
const DOC_KEY_TOKEN = '__HKO_DOC_KEY__'

/**
 * Client-Runtime der heruntergeladenen Datei.
 *
 * Bewusst ohne Template-Literals und ohne Backticks geschrieben: der String wird
 * seinerseits in ein Template-Literal eingesetzt, jedes `${` müsste sonst
 * escaped werden.
 */
const SAVE_RUNTIME = `
(function () {
  'use strict';

  var DOC_KEY = ${DOC_KEY_TOKEN};
  var LS_KEY = 'hko-doc:' + DOC_KEY;
  var FIELD_SEL = '.feld, .hp-flaeche';

  var fields = [];
  var dirty = false;
  var fileHandle = null;
  var lsTimer = null;
  var hintTimer = null;
  var hintPrev = null;
  var bar, statusEl, saveBtn, banner;

  // ---------- Feldwerte ----------

  function values() {
    return fields.map(function (el) { return el.innerHTML; });
  }

  function hasContent(vals) {
    return (vals || []).some(function (v) {
      return String(v || '').replace(/<[^>]*>|&nbsp;|\\s/g, '').length > 0;
    });
  }

  // Eingaben stammen zwar vom Nutzer selbst, können aber Eingefügtes aus dem Web
  // enthalten. Beim Zurückschreiben aus dem Speicher deshalb Skripte und
  // on*-Attribute entfernen.
  function sanitize(html) {
    var tpl = document.createElement('template');
    tpl.innerHTML = String(html == null ? '' : html);
    var all = tpl.content.querySelectorAll('*');
    for (var i = 0; i < all.length; i++) {
      var el = all[i];
      if (/^(script|style|iframe|object|embed|link)$/i.test(el.tagName)) {
        el.parentNode.removeChild(el);
        continue;
      }
      for (var j = el.attributes.length - 1; j >= 0; j--) {
        var name = el.attributes[j].name;
        if (/^on/i.test(name) || /^(src|href)$/i.test(name)) el.removeAttribute(name);
      }
    }
    return tpl.innerHTML;
  }

  function applyValues(vals) {
    if (!vals || vals.length !== fields.length) return false;
    for (var i = 0; i < fields.length; i++) fields[i].innerHTML = sanitize(vals[i]);
    return true;
  }

  // ---------- Dateiname ----------

  function targetName() {
    var name = '';
    try {
      name = decodeURIComponent(String(location.pathname || '').split('/').pop() || '');
    } catch (e) { name = ''; }
    name = name.replace(/\\.x?html?$/i, '');
    if (!name) name = DOC_KEY;
    if (!/_ausgefuellt$/.test(name)) name += '_ausgefuellt';
    return name + '.html';
  }

  // ---------- Serialisierung (A) ----------

  function serialize() {
    var clone = document.documentElement.cloneNode(true);
    var transient = clone.querySelectorAll('[data-hko-transient]');
    for (var i = 0; i < transient.length; i++) {
      transient[i].parentNode.removeChild(transient[i]);
    }
    var st = clone.querySelector('[data-hko-status]');
    if (st) st.textContent = '';
    return '<!DOCTYPE html>\\n' + clone.outerHTML;
  }

  function downloadHtml(html, name) {
    var blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
  }

  // ---------- In-place-Speichern (B) ----------

  function saveViaHandle(html) {
    if (!window.showSaveFilePicker) return Promise.resolve(false);
    return (async function () {
      try {
        if (fileHandle && fileHandle.queryPermission) {
          var perm = await fileHandle.queryPermission({ mode: 'readwrite' });
          if (perm !== 'granted' && fileHandle.requestPermission) {
            perm = await fileHandle.requestPermission({ mode: 'readwrite' });
          }
          if (perm !== 'granted') fileHandle = null;
        }
        if (!fileHandle) {
          fileHandle = await window.showSaveFilePicker({
            suggestedName: targetName(),
            types: [{ description: 'HTML-Dokument', accept: { 'text/html': ['.html'] } }],
          });
        }
        var w = await fileHandle.createWritable();
        await w.write(new Blob([html], { type: 'text/html;charset=utf-8' }));
        await w.close();
        return true;
      } catch (err) {
        if (err && err.name === 'AbortError') return 'abort';
        fileHandle = null;
        return false;
      }
    })();
  }

  // ---------- Absturznetz (C) ----------

  function lsWrite() {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({ ts: Date.now(), v: values() }));
    } catch (e) {
      // Quota voll oder file://-Storage gesperrt (Safari). Kein Fehlerfall:
      // A bleibt der eigentliche Speicherweg.
    }
  }

  function lsRead() {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || 'null'); } catch (e) { return null; }
  }

  function scheduleLsWrite() {
    if (lsTimer) clearTimeout(lsTimer);
    lsTimer = setTimeout(lsWrite, 800);
  }

  // ---------- Statusanzeige ----------

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function setStatus(text, tone) {
    if (!statusEl) return;
    if (hintTimer) { clearTimeout(hintTimer); hintTimer = null; hintPrev = null; }
    statusEl.textContent = text;
    statusEl.className = 'sb-status' + (tone ? ' sb-' + tone : '');
  }

  // Kurzer Hinweis in der Statuszeile, danach zurück zum vorherigen Zustand.
  // Ohne Rückmeldung wirkt ein blockiertes Ctrl+V wie eine kaputte Tastatur.
  function flashHint(text) {
    if (!statusEl) return;
    if (hintTimer) clearTimeout(hintTimer);
    else hintPrev = { text: statusEl.textContent, cls: statusEl.className };
    statusEl.textContent = text;
    statusEl.className = 'sb-status sb-warn';
    hintTimer = setTimeout(function () {
      statusEl.textContent = hintPrev.text;
      statusEl.className = hintPrev.cls;
      hintTimer = null;
      hintPrev = null;
    }, 2600);
  }

  function markDirty() {
    dirty = true;
    setStatus('Nicht gespeichert', 'warn');
    scheduleLsWrite();
  }

  function markSaved(viaHandle) {
    dirty = false;
    lsWrite();
    var now = new Date();
    setStatus(
      (viaHandle ? 'In Datei gespeichert ' : 'Gespeichert ') + pad(now.getHours()) + ':' + pad(now.getMinutes()),
      'ok'
    );
  }

  // ---------- Banner ----------

  function syncBarHeight() {
    document.documentElement.style.setProperty('--hko-bar-h', (bar ? bar.offsetHeight : 44) + 'px');
  }

  function closeBanner() {
    if (banner && banner.parentNode) banner.parentNode.removeChild(banner);
    banner = null;
    syncBarHeight();
  }

  function showRestoreBanner(stored) {
    var when = new Date(stored.ts);
    banner = document.createElement('div');
    banner.className = 'sb-banner';
    banner.setAttribute('data-hko-transient', '');

    var txt = document.createElement('span');
    txt.textContent =
      'Auf diesem Gerät liegen Eingaben vom ' + pad(when.getDate()) + '.' + pad(when.getMonth() + 1) + '. ' +
      pad(when.getHours()) + ':' + pad(when.getMinutes()) +
      ', die nicht in dieser Datei stehen.';

    var restore = document.createElement('button');
    restore.type = 'button';
    restore.className = 'primary';
    restore.textContent = 'Wiederherstellen';
    restore.onclick = function () {
      if (applyValues(stored.v)) markDirty();
      closeBanner();
    };

    var discard = document.createElement('button');
    discard.type = 'button';
    discard.textContent = 'Verwerfen';
    discard.onclick = function () {
      try { localStorage.removeItem(LS_KEY); } catch (e) {}
      closeBanner();
    };

    banner.appendChild(txt);
    banner.appendChild(restore);
    banner.appendChild(discard);
    bar.appendChild(banner);
    syncBarHeight();
  }

  // ---------- Start ----------

  function blockInsert(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    flashHint('Einfügen ist in diesem Dokument deaktiviert');
    return false;
  }

  function save() {
    var html = serialize();
    return saveViaHandle(html).then(function (res) {
      if (res === 'abort') { setStatus('Speichern abgebrochen', 'warn'); return; }
      if (res !== true) downloadHtml(html, targetName());
      markSaved(res === true);
    });
  }

  function init() {
    bar = document.getElementById('hko-bar');
    statusEl = bar ? bar.querySelector('[data-hko-status]') : null;
    saveBtn = document.getElementById('hko-save');
    fields = Array.prototype.slice.call(document.querySelectorAll(FIELD_SEL));

    fields.forEach(function (el) {
      el.setAttribute('contenteditable', 'true');
      el.addEventListener('input', markDirty);

      // Einfügen ist in den Schreibfeldern deaktiviert: die Lernenden sollen
      // selbst formulieren. Drei Wege müssen zu — Zwischenablage, Drag-and-Drop
      // und beforeinput (fängt Kontextmenü-/IME-Pfade ab, die kein paste-Event
      // auslösen). Das ist eine Hürde, keine Sperre: wer will, kommt daran
      // vorbei. Als Signal im Unterricht reicht es.
      el.addEventListener('paste', blockInsert);
      el.addEventListener('drop', blockInsert);
      el.addEventListener('beforeinput', function (ev) {
        var t = ev.inputType || '';
        if (t === 'insertFromPaste' || t === 'insertFromDrop' ||
            t === 'insertFromPasteAsQuotation' || t === 'insertReplacementText') {
          blockInsert(ev);
        }
      });
    });

    syncBarHeight();
    window.addEventListener('resize', syncBarHeight);

    // Reine Lesedokumente (Dossier, Lehrpersonen-Ansichten) haben keine Felder —
    // dort wäre ein Speichern-Knopf nur Rauschen.
    if (!fields.length) {
      if (saveBtn) saveBtn.style.display = 'none';
      var hint = bar ? bar.querySelector('.hint') : null;
      if (hint) hint.textContent = 'Leseversion — zum Ausfüllen die Auftragsversion verwenden.';
      return;
    }

    if (saveBtn) saveBtn.addEventListener('click', function () { save(); });

    document.addEventListener('keydown', function (ev) {
      if ((ev.ctrlKey || ev.metaKey) && !ev.shiftKey && !ev.altKey && (ev.key === 's' || ev.key === 'S')) {
        ev.preventDefault();
        save();
      }
    });

    window.addEventListener('beforeunload', function (ev) {
      if (!dirty) return;
      ev.preventDefault();
      ev.returnValue = '';
    });

    var stored = lsRead();
    if (stored && stored.v && stored.v.length === fields.length && hasContent(stored.v)) {
      if (JSON.stringify(stored.v) !== JSON.stringify(values())) showRestoreBanner(stored);
    }

    setStatus(hasContent(values()) ? 'Geöffnet' : '', '');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
`

/** Chrome-CSS des Shells (Leiste, Banner, Seitenabstand). */
const SHELL_CSS = `
.standalone-bar{position:fixed;top:0;left:0;right:0;z-index:50;background:#1d2026;color:#e8eaee;font-family:'IBM Plex Sans',system-ui,sans-serif;font-size:13px;}
.standalone-bar .sb-row{display:flex;align-items:center;gap:14px;padding:10px 18px;}
.standalone-bar .name{font-weight:600}
.standalone-bar .spacer{flex:1}
.standalone-bar button{font-family:inherit;background:#3a3f49;color:#e8eaee;border:0;padding:6px 14px;border-radius:4px;cursor:pointer;font-size:12px;font-weight:500;letter-spacing:.02em}
.standalone-bar button:hover{background:#4a505c}
.standalone-bar button.primary{background:#e8eaee;color:#1d2026}
.standalone-bar button.primary:hover{background:#fff}
.standalone-bar .hint{color:#a3a8b2;font-size:11px}
.standalone-bar .sb-status{font-size:11px;color:#a3a8b2;min-width:0;white-space:nowrap}
.standalone-bar .sb-status.sb-ok{color:#7ddba3}
.standalone-bar .sb-status.sb-warn{color:#f0c674}
.standalone-bar .sb-banner{display:flex;align-items:center;gap:12px;padding:9px 18px;background:#2a2f38;border-top:1px solid #3a3f49;font-size:12px;color:#e8eaee;flex-wrap:wrap}
.pages{padding:calc(var(--hko-bar-h, 44px) + 18px) 24px 64px}
@media print { .standalone-bar { display:none !important } .pages { padding: 0 } }
`

export interface StandaloneHtmlOptions {
  /** Vollständiges Renderer-CSS (src/styles/einheiten-renderer.css). */
  cssRenderer: string
  /** Titel in <title> und in der Leiste. */
  title: string
  /** Von renderToStaticMarkup erzeugtes Dokument-Markup. */
  bodyMarkup: string
  /** Logo als data:-URI — im entpackten ZIP gibt es keinen Server für /logo-bbw-doc.png. */
  pngDataUrl: string
  /**
   * Stabiler, dokument-eigener Schlüssel für den localStorage-Eintrag (üblicherweise
   * der Dateiname ohne Endung). Muss über Einheiten hinweg eindeutig sein: Chrome
   * teilt einen einzigen Storage-Topf über alle file://-Dokumente.
   */
  docKey: string
  /** @font-face-Regeln mit base64-Data-URIs; null ⇒ Google-Fonts-<link> als Fallback. */
  fontsCss?: string | null
  compact?: boolean
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export function buildStandaloneHtml({
  cssRenderer,
  title,
  bodyMarkup,
  pngDataUrl,
  docKey,
  fontsCss = null,
  compact = false,
}: StandaloneHtmlOptions): string {
  const cls = ['aesthetic-modern']
  if (compact) cls.push('density-compact')

  const markup = bodyMarkup
    .replaceAll('assets/logo-bbw.png', pngDataUrl)
    .replaceAll('/einheiten-assets/logo-bbw.png', pngDataUrl)
    .replaceAll('/logo-bbw-doc.png', pngDataUrl)

  // Eingebettet, wenn vorhanden — sonst der bisherige CDN-Link, damit online
  // niemand schlechter dasteht als vorher.
  const fonts = fontsCss
    ? `  <style>\n${fontsCss}\n  </style>`
    : `  <link rel="preconnect" href="https://fonts.googleapis.com" />\n` +
      `  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />\n` +
      `  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap" />`

  const runtime = SAVE_RUNTIME.replace(DOC_KEY_TOKEN, JSON.stringify(docKey))

  return `<!DOCTYPE html>
<html lang="de-CH">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
${fonts}
  <style>
${cssRenderer}
${SHELL_CSS}
  </style>
</head>
<body class="${cls.join(' ')}">
  <div class="standalone-bar" id="hko-bar">
    <div class="sb-row">
      <span class="name">${escapeHtml(title)}</span>
      <span class="hint">Tippe in die Felder — «Speichern» sichert deine Eingaben in der Datei.</span>
      <span class="spacer"></span>
      <span class="sb-status" data-hko-status></span>
      <button type="button" id="hko-save" class="primary">Speichern</button>
      <button type="button" onclick="window.print()">Drucken</button>
    </div>
  </div>
  <main class="pages">${markup}</main>
  <script>${runtime}</script>
</body>
</html>`
}
