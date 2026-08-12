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
 *   C  Autosave in localStorage als Absturznetz — bewusst NICHT der
 *      Primärspeicher: es hängt am Browserprofil, wandert nicht mit der Datei
 *      mit und ist unter file:// unzuverlässig (Safari blockt, Chrome teilt
 *      einen Topf über alle file://-Dokumente — daher der dokument-eigene Key).
 *      Beim Öffnen erscheint bei Abweichung ein Wiederherstellen-Banner.
 *
 * Zusätzlich, nur wo `protokoll: true` gesetzt wird (aktuell die
 * Herausforderungen):
 *
 *   D  Einfügen ist in den Schreibfeldern deaktiviert — Zwischenablage,
 *      Drag-and-Drop und beforeinput.
 *   E  Ein Schreibprotokoll hält den Entstehungsprozess fest: getippte Zeichen,
 *      blockierte Einfügeversuche, sprunghafte Einfügungen und — der eigentliche
 *      Punkt — Feldänderungen, zu denen es gar kein Input-Event gab (das ist der
 *      Entwicklertools- und Erweiterungs-Fall, sichtbar über einen
 *      MutationObserver, ohne dass man Devtools erkennen müsste).
 *
 * WICHTIG zur Reichweite von D/E: Das ist tamper-EVIDENT, nicht tamper-PROOF.
 * Wer JavaScript in der Seite ausführen kann, kann das Protokoll auch fälschen —
 * der Schlüssel läge zwangsläufig in derselben Datei. Die Hash-Kette macht
 * nachträgliches Editieren einzelner Einträge sichtbar, mehr nicht. Der Wert
 * liegt im Gespräch mit den Lernenden, nicht im Automatismus.
 *
 * Datenschutz: Es werden ausschliesslich Aggregate erfasst (Zähler, Zeitstempel,
 * Längen) — nie Tasteninhalte. Das Protokoll ist offen deklariert (Hinweis in
 * der Leiste, Knopf «Schreibprotokoll» für alle sichtbar).
 *
 * Print/PDF: Leiste, Banner und Protokoll-Panel liegen hinter `@media print`,
 * das Protokoll selbst ist ein nicht gerendertes JSON-Script. Eine gedruckte
 * oder als PDF gesicherte Fassung enthält davon nichts.
 */

/** Platzhalter, die buildStandaloneHtml() vor dem Einsetzen ersetzt. */
const DOC_KEY_TOKEN = '__HKO_DOC_KEY__'
const PROTOKOLL_TOKEN = '__HKO_PROTOKOLL__'
const BASE_TOKEN = '__HKO_BASE__'

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
  var PROTOKOLL = ${PROTOKOLL_TOKEN};
  // Zeichen, die beim Erzeugen der Datei schon in den Feldern standen. Bewusst
  // zur Generierzeit eingebacken und nicht beim ersten Öffnen gemessen: sonst
  // koennte man das Protokoll-Script loeschen, und der volle Text gaelte beim
  // naechsten Oeffnen als Vorlagentext.
  var BASE0 = ${BASE_TOKEN};
  var LS_KEY = 'hko-doc:' + DOC_KEY;
  var FIELD_SEL = '.feld, .hp-flaeche';
  var LOG_ID = 'hko-protokoll';

  // Ab dieser Zuwachsrate in einem einzelnen input-Event gilt eine Eingabe als
  // Sprung. Tippen liefert 1, Wortergaenzung und IME bis ca. 20.
  var JUMP_MIN = 40;
  var MAX_EVENTS = 500;

  var fields = [];
  var dirty = false;
  var fileHandle = null;
  var lsTimer = null;
  var hintTimer = null;
  var hintPrev = null;
  var bar, statusEl, saveBtn, banner, panel;

  var logData = null;
  var lastText = [];
  var suppressMutations = false;
  var justBlocked = false;

  // ---------- Feldwerte ----------

  function values() {
    return fields.map(function (el) { return el.innerHTML; });
  }

  function textOf(el) { return (el.innerText || '').replace(/\\r/g, ''); }

  // Wortzähler. Bewusst als Attribut, das die Shell-CSS über ein ::after-Pseudo-
  // element ausgibt: so wird der Zähler nie Teil des editierbaren Inhalts, taucht
  // in innerText/innerHTML nicht auf und verfälscht damit weder das Gespeicherte
  // noch die Zeichenzahl im Schreibprotokoll. Im Druck blendet ihn die CSS aus.
  function woerter(s) {
    var t = String(s || '').trim();
    return t ? t.split(/\\s+/).length : 0;
  }

  function updateCount(el) {
    var n = woerter(textOf(el));
    // Bei leerem Feld kein Zähler — sonst pflastern «0 Wörter» das ganze Blatt zu.
    if (n > 0) el.setAttribute('data-hko-woerter', n === 1 ? '1 Wort' : n + ' Wörter');
    else el.removeAttribute('data-hko-woerter');
  }

  function updateAllCounts() {
    for (var i = 0; i < fields.length; i++) updateCount(fields[i]);
  }

  function totalChars() {
    return fields.reduce(function (n, el) { return n + textOf(el).trim().length; }, 0);
  }

  function hasContent(vals) {
    return (vals || []).some(function (v) {
      return String(v || '').replace(/<[^>]*>|&nbsp;|\\s/g, '').length > 0;
    });
  }

  // Eingaben stammen zwar vom Nutzer selbst, koennen aber Eingefuegtes aus dem Web
  // enthalten. Beim Zurueckschreiben aus dem Speicher deshalb Skripte und
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
    // Eigene Schreibvorgaenge duerfen nicht als Fremdeingriff im Protokoll landen.
    suppressMutations = true;
    for (var i = 0; i < fields.length; i++) fields[i].innerHTML = sanitize(vals[i]);
    syncBaseline();
    updateAllCounts();
    setTimeout(function () { suppressMutations = false; syncBaseline(); }, 0);
    return true;
  }

  // ---------- Schreibprotokoll ----------

  // FNV-1a. Bewusst keine Web-Crypto: der Schluessel laege ohnehin in derselben
  // Datei, echte Signaturen waeren hier Theater. Die Kette soll nachtraegliches
  // Editieren einzelner Eintraege sichtbar machen, nicht Faelschung verhindern.
  function hash32(str) {
    var h = 0x811c9dc5;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
    }
    return ('0000000' + h.toString(16)).slice(-8);
  }

  function seedHash() { return hash32('hko-protokoll-v1:' + DOC_KEY); }

  function chainOver(events) {
    var h = seedHash();
    for (var i = 0; i < events.length; i++) h = hash32(h + JSON.stringify(events[i]));
    return h;
  }

  function freshLog() {
    return {
      v: 1, doc: DOC_KEY,
      typed: 0, deleted: 0, blocked: 0, ghosts: 0, jumps: 0, synthetic: 0,
      // Vorlagentext der Ausgangsdatei. Ohne diese Basislinie wuerde vorbelegter
      // Text als «nicht getippt» gemeldet — ein Fehlalarm, der jemanden zu
      // Unrecht verdaechtigt.
      base: BASE0,
      dropped: 0, sessions: [], events: [], chain: seedHash()
    };
  }

  function readLog() {
    var el = document.getElementById(LOG_ID);
    if (!el) return null;
    try {
      var d = JSON.parse(el.textContent || 'null');
      if (d && d.v === 1 && Array.isArray(d.events)) return d;
    } catch (e) {}
    return null;
  }

  function addEvent(kind, detail) {
    if (!PROTOKOLL || !logData) return;
    var e = { t: new Date().toISOString(), k: kind };
    if (detail != null) e.d = detail;
    logData.chain = hash32(logData.chain + JSON.stringify(e));
    logData.events.push(e);
    if (logData.events.length > MAX_EVENTS) { logData.events.shift(); logData.dropped++; }
  }

  function counters() {
    return {
      typed: logData.typed, chars: totalChars(), del: logData.deleted,
      blocked: logData.blocked, ghosts: logData.ghosts, jumps: logData.jumps,
      synth: logData.synthetic || 0
    };
  }

  function writeLogToDom() {
    if (!PROTOKOLL || !logData) return;
    var el = document.getElementById(LOG_ID);
    if (el) el.textContent = JSON.stringify(logData);
  }

  function syncBaseline() {
    for (var i = 0; i < fields.length; i++) lastText[i] = textOf(fields[i]);
  }

  // Der eigentliche Entwicklertools-Detektor: eine Feldaenderung, zu der kein
  // input-Event kam. Reihenfolge im Browser ist DOM-Mutation, dann synchron das
  // input-Event (unser Handler zieht lastText nach), dann als Microtask dieser
  // Callback — beim Tippen stimmen die Texte hier also immer ueberein.
  function startObserver() {
    if (!window.MutationObserver) return;
    var mo = new MutationObserver(function () {
      if (suppressMutations) return;
      for (var i = 0; i < fields.length; i++) {
        var t = textOf(fields[i]);
        if (t !== lastText[i]) {
          var delta = t.length - (lastText[i] || '').length;
          logData.ghosts++;
          addEvent('ghost', { f: i, n: delta });
          lastText[i] = t;
          updateCount(fields[i]);
          markDirty();
        }
      }
    });
    fields.forEach(function (el) {
      mo.observe(el, { childList: true, subtree: true, characterData: true });
    });
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
    writeLogToDom();
    var clone = document.documentElement.cloneNode(true);
    var transient = clone.querySelectorAll('[data-hko-transient]');
    for (var i = 0; i < transient.length; i++) {
      transient[i].parentNode.removeChild(transient[i]);
    }
    var st = clone.querySelector('[data-hko-status]');
    if (st) st.textContent = '';
    // Zähler-Attribute nicht mitschreiben: sie werden beim Öffnen neu berechnet,
    // gespeichert wären sie nur veralteter Ballast.
    var counted = clone.querySelectorAll('[data-hko-woerter]');
    for (var j = 0; j < counted.length; j++) counted[j].removeAttribute('data-hko-woerter');
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

  function stamp(d) {
    return pad(d.getDate()) + '.' + pad(d.getMonth() + 1) + '. ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
  }

  function setStatus(text, tone) {
    if (!statusEl) return;
    if (hintTimer) { clearTimeout(hintTimer); hintTimer = null; hintPrev = null; }
    statusEl.textContent = text;
    statusEl.className = 'sb-status' + (tone ? ' sb-' + tone : '');
  }

  // Kurzer Hinweis in der Statuszeile, danach zurueck zum vorherigen Zustand.
  // Ohne Rueckmeldung wirkt ein blockiertes Ctrl+V wie eine kaputte Tastatur.
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
    banner = document.createElement('div');
    banner.className = 'sb-banner';
    banner.setAttribute('data-hko-transient', '');

    var txt = document.createElement('span');
    txt.textContent = 'Auf diesem Gerät liegen Eingaben vom ' + stamp(new Date(stored.ts)) +
      ', die nicht in dieser Datei stehen.';

    var restore = document.createElement('button');
    restore.type = 'button';
    restore.className = 'primary';
    restore.textContent = 'Wiederherstellen';
    restore.onclick = function () {
      if (applyValues(stored.v)) { addEvent('restore', { n: totalChars() }); markDirty(); }
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

  // ---------- Protokoll-Panel ----------

  function lastSaveSnapshot() {
    for (var i = logData.events.length - 1; i >= 0; i--) {
      if (logData.events[i].k === 'save') return logData.events[i];
    }
    return null;
  }

  function befund() {
    var snap = lastSaveSnapshot();
    var c = snap ? snap.d : counters();
    var chainOk = logData.dropped === 0 && chainOver(logData.events) === logData.chain;
    // «Auffällig» sagt genau eine Sache: In diesem Dokument steht Text, der nicht
    // über die Tastatur gekommen ist. Alles, was auch harmlos sein kann, gehört
    // in die Hinweise — ein Befund, den man einer Person vorhält, muss tragen.
    var punkte = [];
    var hinweise = [];
    if (!chainOk) punkte.push('Das Protokoll selbst wurde verändert oder ist unvollständig.');
    if (logData.events.some(function (e) { return e.k === 'reset'; })) {
      punkte.push('Beim Öffnen fehlte das Protokoll, obwohl das Dokument bereits Text enthielt — es wurde entfernt.');
    }
    if (c.ghosts > 0) punkte.push(c.ghosts + ' Feldänderung(en) ohne Tastatureingabe — typisch für Entwicklertools oder eine Erweiterung.');
    if ((c.synth || 0) > 0) punkte.push((c.synth || 0) + ' skriptgesteuerte Eingabe(n) — Text kam per JavaScript ins Feld, nicht über die Tastatur.');
    var base = logData.base || 0;
    if (c.chars > c.typed + base) {
      punkte.push('Weniger getippt (' + c.typed + (base ? ' plus ' + base + ' vorbelegte' : '') +
        ') als im Dokument steht (' + c.chars + ').');
    }

    // Bewusst nur Kontext: Ein Einfügeversuch wurde blockiert, es ist also nichts
    // hereingekommen. Und ein Sprung sieht bei einer Diktierfunktion genauso aus
    // wie bei einer Einfügung — das als Verdacht zu werten träfe ausgerechnet
    // Lernende mit Nachteilsausgleich.
    if (c.blocked > 0) hinweise.push(c.blocked + ' blockierte(r) Einfügeversuch(e) — abgewehrt, es kam nichts ins Feld.');
    if (c.jumps > 0) hinweise.push(c.jumps + ' Einfügung(en) von über ' + JUMP_MIN + ' Zeichen am Stück — kann Diktat oder Wortergänzung sein.');

    return { c: c, chainOk: chainOk, punkte: punkte, hinweise: hinweise, snap: snap };
  }

  function togglePanel() {
    if (panel) { panel.remove(); panel = null; return; }
    var b = befund();
    panel = document.createElement('div');
    panel.className = 'hko-panel';
    panel.setAttribute('data-hko-transient', '');

    var rows = [
      ['Getippte Zeichen', String(b.c.typed)],
      ['Vorbelegt beim Öffnen', String(logData.base || 0)],
      ['Zeichen im Dokument', String(b.c.chars)],
      ['Löschvorgänge', String(b.c.del)],
      ['Blockierte Einfügeversuche', String(b.c.blocked)],
      ['Änderungen ohne Tastatureingabe', String(b.c.ghosts)],
      ['Skriptgesteuerte Eingaben', String(b.c.synth || 0)],
      ['Sprunghafte Einfügungen', String(b.c.jumps)],
      ['Sitzungen', String(logData.sessions.length)],
      ['Zuletzt gespeichert', b.snap ? stamp(new Date(b.snap.t)) : '—'],
      ['Prüfkette', b.chainOk ? 'intakt' : 'gebrochen']
    ];

    var html = '<div class="hp-head"><strong>Schreibprotokoll</strong>' +
      '<button type="button" class="hp-close">Schliessen</button></div>' +
      '<div class="hp-verdict ' + (b.punkte.length ? 'bad' : 'good') + '">' +
      (b.punkte.length ? 'Auffällig' : 'Unauffällig') + '</div>';
    if (b.punkte.length) html += '<ul class="hp-list"></ul>';
    if (b.hinweise.length) html += '<ul class="hp-hints"></ul>';
    html += '<table class="hp-table"></table>';
    panel.innerHTML = html;

    var fill = function (sel, items) {
      var ul = panel.querySelector(sel);
      if (!ul) return;
      items.forEach(function (p) {
        var li = document.createElement('li');
        li.textContent = p;
        ul.appendChild(li);
      });
    };
    fill('.hp-list', b.punkte);
    fill('.hp-hints', b.hinweise);
    var table = panel.querySelector('.hp-table');
    rows.forEach(function (r) {
      var tr = document.createElement('tr');
      var td1 = document.createElement('td');
      td1.textContent = r[0];
      var td2 = document.createElement('td');
      td2.textContent = r[1];
      tr.appendChild(td1); tr.appendChild(td2); table.appendChild(tr);
    });
    panel.querySelector('.hp-close').onclick = function () { panel.remove(); panel = null; };
    document.body.appendChild(panel);
  }

  // ---------- Eingabesperre (D) ----------

  function blockInsert(ev, len) {
    ev.preventDefault();
    ev.stopPropagation();
    if (logData) { logData.blocked++; addEvent('block', { n: len || 0 }); }
    justBlocked = true;
    setTimeout(function () { justBlocked = false; }, 0);
    flashHint('Einfügen ist in diesem Dokument deaktiviert');
    return false;
  }

  // ---------- Start ----------

  function save() {
    if (PROTOKOLL && logData) {
      addEvent('save', counters());
      var s = logData.sessions[logData.sessions.length - 1];
      if (s) { s.end = new Date().toISOString(); s.saves = (s.saves || 0) + 1; }
    }
    var html = serialize();
    return saveViaHandle(html).then(function (res) {
      if (res === 'abort') { setStatus('Speichern abgebrochen', 'warn'); return; }
      if (res !== true) downloadHtml(html, targetName());
      markSaved(res === true);
    });
  }

  function wireField(el, i) {
    el.setAttribute('contenteditable', 'true');

    el.addEventListener('input', function () {
      var t = textOf(el);
      var delta = t.length - (lastText[i] || '').length;
      if (PROTOKOLL && logData && delta >= JUMP_MIN) {
        logData.jumps++;
        addEvent('jump', { f: i, n: delta });
      }
      lastText[i] = t;
      updateCount(el);
      markDirty();
    });

    if (!PROTOKOLL) {
      // Ohne Protokoll bleibt Einfuegen erlaubt, aber als Klartext: haelt das
      // mm-genaue A4-Layout stabil, wenn aus Word kopiert wird.
      el.addEventListener('paste', function (ev) {
        ev.preventDefault();
        var text = (ev.clipboardData || window.clipboardData).getData('text/plain');
        document.execCommand('insertText', false, text);
      });
      return;
    }

    // Drei Wege muessen zu — Zwischenablage, Drag-and-Drop und beforeinput
    // (faengt Kontextmenue-/IME-Pfade ab, die kein paste-Event ausloesen).
    el.addEventListener('paste', function (ev) {
      var cd = ev.clipboardData || window.clipboardData;
      var len = 0;
      try { len = (cd.getData('text/plain') || '').length; } catch (e) {}
      blockInsert(ev, len);
    });
    el.addEventListener('drop', function (ev) {
      var len = 0;
      try { len = (ev.dataTransfer.getData('text/plain') || '').length; } catch (e) {}
      blockInsert(ev, len);
    });
    el.addEventListener('beforeinput', function (ev) {
      var t = ev.inputType || '';
      // Vom Browser erzeugte Events tragen isTrusted=true; alles, was per Skript
      // dispatcht wird (Konsole, Erweiterung, Automatisierung), ist false. Das
      // faengt den Fall ab, bei dem jemand Tippen simuliert statt das DOM direkt
      // zu setzen — der MutationObserver sieht dort naemlich nichts Auffaelliges.
      if (ev.isTrusted === false) {
        logData.synthetic++;
        addEvent('synthetic', { it: t, n: (ev.data || '').length });
      }
      if (t === 'insertFromPaste' || t === 'insertFromDrop' ||
          t === 'insertFromPasteAsQuotation' || t === 'insertReplacementText') {
        if (justBlocked) { ev.preventDefault(); return; }
        blockInsert(ev, (ev.data || '').length);
        return;
      }
      if (t === 'insertText' || t === 'insertCompositionText') {
        logData.typed += (ev.data || '').length || 1;
      } else if (t.indexOf('delete') === 0) {
        logData.deleted++;
      }
    });
  }

  function init() {
    bar = document.getElementById('hko-bar');
    statusEl = bar ? bar.querySelector('[data-hko-status]') : null;
    saveBtn = document.getElementById('hko-save');
    fields = Array.prototype.slice.call(document.querySelectorAll(FIELD_SEL));

    syncBarHeight();
    window.addEventListener('resize', syncBarHeight);

    // Reine Lesedokumente (Dossier, Lehrpersonen-Ansichten) haben keine Felder —
    // dort waere ein Speichern-Knopf nur Rauschen.
    if (!fields.length) {
      if (saveBtn) saveBtn.style.display = 'none';
      var logBtn0 = document.getElementById('hko-log-btn');
      if (logBtn0) logBtn0.style.display = 'none';
      var hint = bar ? bar.querySelector('.hint') : null;
      if (hint) hint.textContent = 'Leseversion — zum Ausfüllen die Auftragsversion verwenden.';
      return;
    }

    if (PROTOKOLL) {
      logData = readLog();
      var fehlte = !logData;
      if (!logData) logData = freshLog();
      // Ein fehlendes Protokoll in einem Dokument, das schon Text enthaelt,
      // heisst: es wurde entfernt. Ein echter Erstoeffner hat leere Felder.
      if (fehlte && totalChars() > BASE0) addEvent('reset', { n: totalChars() });
      logData.sessions.push({ start: new Date().toISOString(), end: null, saves: 0 });
      addEvent('open', null);
      var logBtn = document.getElementById('hko-log-btn');
      if (logBtn) logBtn.addEventListener('click', togglePanel);
    }

    fields.forEach(wireField);
    syncBaseline();
    updateAllCounts();
    if (PROTOKOLL) startObserver();

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

/** Chrome-CSS des Shells (Leiste, Banner, Protokoll-Panel, Seitenabstand). */
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
.hko-panel{position:fixed;top:70px;right:20px;z-index:60;width:360px;max-width:calc(100vw - 40px);max-height:calc(100vh - 100px);overflow:auto;background:#fff;color:#1d2026;border:1px solid #d5dade;border-top:4px solid #0E6E3A;border-radius:8px;box-shadow:0 10px 34px rgba(0,0,0,.18);padding:16px 18px;font-family:'IBM Plex Sans',system-ui,sans-serif;font-size:13px}
.hko-panel .hp-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
.hko-panel .hp-close{background:#eef1f3;color:#1d2026;border:0;padding:4px 10px;border-radius:4px;cursor:pointer;font:inherit;font-size:11px}
.hko-panel .hp-verdict{display:inline-block;font-size:11px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;padding:3px 10px;border-radius:999px;margin-bottom:10px}
.hko-panel .hp-verdict.good{background:#e8f3ec;color:#094d28}
.hko-panel .hp-verdict.bad{background:#fdeaea;color:#8c2020}
.hko-panel .hp-list{margin:0 0 12px;padding-left:18px;color:#8c2020;font-size:12px}
.hko-panel .hp-list li{margin:0 0 4px}
.hko-panel .hp-hints{margin:0 0 12px;padding-left:18px;color:#5b6470;font-size:12px}
.hko-panel .hp-hints li{margin:0 0 4px}
.hko-panel .hp-table{width:100%;border-collapse:collapse;font-size:12px}
.hko-panel .hp-table td{padding:4px 0;border-bottom:1px dashed #e2e6ea}
.hko-panel .hp-table td:last-child{text-align:right;font-variant-numeric:tabular-nums;font-weight:600}
.hko-panel .hp-note{margin:12px 0 0;font-size:11px;line-height:1.5;color:#5b6470}
.pages{padding:calc(var(--hko-bar-h, 44px) + 18px) 24px 64px}

/* Wortzähler — nur am Bildschirm. Als ::after-Pseudoelement, damit er nicht Teil
   des contenteditable-Inhalts wird. .hp-flaeche ist bereits positioniert, .feld
   nicht; position:relative aendert dort nichts am Layout. */
.feld{position:relative}
.feld[data-hko-woerter]::after,
.hp-flaeche[data-hko-woerter]::after{
  content:attr(data-hko-woerter);
  position:absolute;right:1.5mm;bottom:0.6mm;
  font-family:'IBM Plex Sans',system-ui,sans-serif;font-size:7pt;line-height:1.3;
  letter-spacing:.02em;color:#8a939e;background:#fff;padding:0 1.2mm;border-radius:2px;
  pointer-events:none;user-select:none;
}
@media print {
  .standalone-bar, .hko-panel { display:none !important }
  .feld::after, .hp-flaeche::after { content:none !important }
  .pages { padding: 0 }
}
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
  /**
   * Einfüge-Sperre + Schreibprotokoll aktivieren. Aktuell nur für die
   * Herausforderungen gesetzt — nicht für Austausch, KN, KI-Toolbox oder die
   * EBA-Lesedokumente. Ohne das Flag bleibt Einfügen erlaubt (als Klartext).
   */
  protokoll?: boolean
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
  protokoll = false,
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

  // Vorlagentext der Ausgangsdatei, einmal zur Generierzeit gezählt. In den
  // echten Herausforderungen sind die Felder leer (0) — der Wert existiert, damit
  // ein Dokument mit vorbelegten Feldern keinen Fehlalarm auslöst, und damit das
  // Löschen des Protokoll-Scripts nicht den ganzen Text zu Vorlagentext macht.
  let base0 = 0
  if (protokoll && typeof DOMParser !== 'undefined') {
    try {
      const probe = new DOMParser().parseFromString(`<body>${markup}</body>`, 'text/html')
      probe.querySelectorAll('.feld, .hp-flaeche').forEach((el) => {
        base0 += (el.textContent || '').trim().length
      })
    } catch { base0 = 0 }
  }

  const runtime = SAVE_RUNTIME
    .replace(DOC_KEY_TOKEN, JSON.stringify(docKey))
    .replace(PROTOKOLL_TOKEN, protokoll ? 'true' : 'false')
    .replace(BASE_TOKEN, String(base0))

  // Offen deklariert — steht in der Leiste, die nie gedruckt wird.
  const hint = protokoll
    ? 'Einfügen ist deaktiviert · der Schreibprozess wird protokolliert'
    : 'Tippe in die Felder — «Speichern» sichert deine Eingaben in der Datei.'

  const logButton = protokoll
    ? `      <button type="button" id="hko-log-btn">Schreibprotokoll</button>\n`
    : ''
  const logStore = protokoll
    ? `  <script type="application/json" id="hko-protokoll">null</script>\n`
    : ''

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
      <span class="hint">${escapeHtml(hint)}</span>
      <span class="spacer"></span>
      <span class="sb-status" data-hko-status></span>
${logButton}      <button type="button" id="hko-save" class="primary">Speichern</button>
      <button type="button" onclick="window.print()">Drucken</button>
    </div>
  </div>
  <main class="pages">${markup}</main>
${logStore}  <script>${runtime}</script>
</body>
</html>`
}
