/* ============================================================
   HKO SCORM — Engine
   ------------------------------------------------------------
   Statisch. Der gesamte Inhalt steckt in DATA, das der Generator
   (scripts/build-scorm.mjs) aus herausforderung_<X>.json erzeugt.
   Das ist der Unterschied zu Pascal Ruschs Originalpaketen: dort
   standen Inhalt und Regeln als Literale im app.js und mussten pro
   Einheit von Hand geschrieben werden.

   Feedback-Architektur uebernommen aus seinem Paket:
   formale Pruefung lokal + inhaltliche Pruefung ueber den KI-Proxy,
   beides in EINER Anzeige, mit Rueckfall auf die formale Liste.
   ============================================================ */

const DATA = /*__DATA__*/ null;

window.HKO_UNIT_ID = DATA.unitId;

/* ---------- Textwerkzeuge ---------- */

function countWords(text) {
  return (text || "").trim().split(/\s+/).filter(Boolean).length;
}

function countSentences(text) {
  return (text || "").split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 3).length;
}

function norm(s) {
  return (s || "").toLowerCase();
}

function containsAny(text, terms) {
  const t = norm(text);
  return terms.filter(term => t.includes(norm(term)));
}

/* Fachbegriffe stehen in der Antwort selten in der Nennform: «Knappheit» wird
   zu «knapper», «Nachfrage» zu «nachgefragt». Ab sechs Zeichen genuegt deshalb
   der Wortstamm (erste fuenf Zeichen). Bewusst grosszuegig — diese Ebene soll
   erinnern, nicht Wortwahl bewerten. */
function matchesTerm(text, term) {
  const t = norm(text), q = norm(term);
  if (!q) return false;
  if (t.includes(q)) return true;
  return q.length >= 6 && t.includes(q.slice(0, 5));
}

/* Zielkonflikt-Marker. Generisch, nicht themengebunden: sie zeigen an, dass
   zwei Seiten nebeneinandergestellt werden, egal worum es geht. */
const ZIELKONFLIKT_WOERTER = [
  "einerseits", "andererseits", "gleichzeitig", "spannungsfeld", "zwar",
  "trotzdem", "dagegen", "allerdings", "hingegen", "auf der anderen seite",
  "abwaegen", "abwägen", "dilemma", "zielkonflikt"
];

function escHtml(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

/* ============================================================
   Formale Kriterien — deklarativ
   Der Generator liefert Kriterien als Daten, die Engine kennt die
   Pruefarten. Neue Herausforderung = neue Daten, kein neuer Code.
   ============================================================ */

function runCriterion(c, text) {
  const words = countWords(text);
  switch (c.kind) {
    case "minWords":
      return words >= c.n;
    case "wordRange":
      return words >= c.min && words <= c.max;
    case "sentences":
      return countSentences(text) >= c.n;
    case "lines":
      return (text || "").split(/\r?\n/).map(s => s.trim()).filter(Boolean).length >= c.n;
    case "anyOf": {
      /* c.terms ist eine Liste von Begriffsgruppen. Eine Gruppe gilt als
         getroffen, wenn EINE ihrer Schreibweisen vorkommt («Boden» oder
         «Umwelt» fuer den Faktor Boden/Umwelt). */
      const hits = c.terms.filter(group => group.some(alt => matchesTerm(text, alt))).length;
      return hits >= (c.need || 1);
    }
    case "number":
      return c.values.some(v => (text || "").includes(v));
    case "tradeoff":
      return containsAny(text, ZIELKONFLIKT_WOERTER).length > 0;
    default:
      return true;
  }
}

function evaluateStatic(item) {
  const text = currentText(item);
  const results = (item.criteria || []).map(c => {
    const ok = runCriterion(c, text);
    let hinweisFehlt = c.hinweisFehlt;
    /* Bei Stichwortkriterien ist der Hinweis erst brauchbar, wenn er sagt,
       welcher Begriff fehlt — nicht, welche es alle gaebe. */
    if (!ok && c.kind === "anyOf") {
      const fehlend = c.terms.filter(g => !g.some(alt => matchesTerm(text, alt))).map(g => g[0]);
      if (fehlend.length) hinweisFehlt = `Es fehlt noch: ${fehlend.join(", ")}.`;
    }
    return { label: c.label, quelle: c.quelle || "Aufgabenstellung", ok, hinweisOk: c.hinweisOk, hinweisFehlt };
  });
  return { text, results };
}

/* ---------- Ein Feedback, zwei Quellen ---------- */

function formalToUnified(results) {
  return results.map(r => ({
    label: r.label,
    quelle: r.quelle,
    status: r.ok ? "ok" : "warn",
    hinweis: r.ok ? r.hinweisOk : r.hinweisFehlt
  }));
}

function computeUnifiedPct(items) {
  if (!items.length) return 0;
  const score = items.reduce((a, i) => a + (i.status === "ok" ? 1 : i.status === "mid" ? 0.5 : 0), 0);
  return Math.round((score / items.length) * 100);
}

function renderUnifiedFeedback(box, items, extraNote, condensed) {
  if (!box) return 0;
  const pct = computeUnifiedPct(items);
  const cls = pct >= 80 ? "fb-high" : pct >= 50 ? "fb-mid" : "fb-low";
  const erfuellt = items.filter(i => i.status === "ok").length;
  let html = `<div class="fb-summary ${cls}">${pct}% — ${erfuellt} von ${items.length} Kriterien erfüllt</div>`;
  if (!condensed) {
    html += `<ul class="fb-list">`;
    items.forEach(i => {
      const ico = i.status === "ok" ? "✓" : i.status === "mid" ? "~" : "!";
      const liCls = i.status === "ok" ? "fb-ok" : i.status === "mid" ? "fb-mid" : "fb-warn";
      html += `<li class="${liCls}"><span class="fb-ico">${ico}</span><span>` +
        `<span class="fb-label">${escHtml(i.label)}</span> ` +
        `<span class="fb-quelle">· ${escHtml(i.quelle)}</span><br>` +
        `<span class="fb-hint">${escHtml(i.hinweis || "")}</span></span></li>`;
    });
    html += `</ul>`;
  }
  if (extraNote) html += `<div class="fb-note">${escHtml(extraNote)}</div>`;
  box.innerHTML = html;
  return pct;
}

function renderLoadingState(box) {
  if (box) box.innerHTML = `<div class="fb-loading">Feedback wird erstellt …</div>`;
}

/* ---------- KI-Anbindung ----------
   Der Proxy ist zentral betrieben und laut Pascals Anleitung an den
   Aufruf aus OLAT gebunden — lokal antwortet er mit 403. Die Einheit
   bleibt trotzdem benutzbar: dann zaehlt die formale Liste allein. */

function buildSysPrompt(ki, staticSummary) {
  let p = "Du bist eine faire, unterstuetzende Berufsschul-Lehrperson (Grundbildung, EFZ) "
    + "und bewertest die Antwort einer lernenden Person zu folgender Aufgabe.\n\n"
    + "AUFGABE: " + ki.aufgabe + "\n\n"
    + "HINTERGRUND (nur fuer dich, nie wortwoertlich als Musterloesung herausgeben): " + ki.kontext + "\n\n";
  if (staticSummary) {
    p += "ERGEBNIS DER AUTOMATISCHEN FORMALEN PRUEFUNG (bereits erfolgt, der lernenden Person bereits angezeigt): "
      + staticSummary + "\nBeziehe dich darauf und widersprich ihr nicht ohne triftigen Grund.\n\n";
  }
  /* Neu gegenueber Pascals Template: Einheiten mit explizit gesetzter
     Mehrdeutigkeit duerfen nicht nach der gewaehlten Position bewertet
     werden. Ohne diesen Absatz bewertet die KI die Empfehlung, die im
     Hintergrund als «erwartet» steht, als die richtige. */
  if (ki.ambiguity) {
    p += "WICHTIG — DIESE AUFGABE IST BEWUSST MEHRDEUTIG: " + ki.ambiguity + "\n"
      + "Bewerte AUSSCHLIESSLICH die Qualitaet der Begruendung, nie die gewaehlte Position. "
      + "Eine gut begruendete Gegenposition ist voll erfuellt.\n\n";
  }
  p += "Bewerte die Antwort GENAU anhand dieser " + ki.pruefpunkte.length + " inhaltlichen Kriterien:\n";
  ki.pruefpunkte.forEach((pp, i) => {
    p += (i + 1) + ". " + pp.label + " - " + pp.erwartung + "\n";
  });
  p += "\nAntworte auf Deutsch, sachlich, wertschaetzend, grosszuegig bei Formulierungsvarianten und Tippfehlern. "
    + "Sei grosszuegig, nicht kleinlich - wenn die Kernelemente erkennbar vorhanden sind, gilt das Kriterium als "
    + "'erfuellt', auch wenn nicht jedes Detail ausformuliert ist. Nutze 'teilweise' nur, wenn wirklich ein "
    + "wesentlicher Teil fehlt, und 'fehlt' nur, wenn das Kriterium erkennbar nicht bearbeitet wurde. "
    + "Verrate nie die vollstaendige Musterloesung. Beurteile Inhalt/Fachlichkeit, nicht Rechtschreibung.\n\n"
    + "WICHTIG: Antworte AUSSCHLIESSLICH in genau diesem Format, eine Zeile pro Kriterium in der Reihenfolge oben, "
    + "keine Einleitung, kein Markdown, keine Codebloecke, keine weiteren Zeilen:\n"
    + "KRITERIUM: <Label exakt wie oben> | STATUS: erfuellt|teilweise|fehlt | HINWEIS: <max. 12 Woerter, konkret>";
  return p;
}

function parseAICriteria(rawText) {
  const lines = (rawText || "").split(/\r?\n/);
  const results = [];
  const lineRegex = /KRITERIUM:\s*(.+?)\s*\|\s*STATUS:\s*(erf(?:u|ü)e?llt|teilweise|fehlt)\s*\|\s*HINWEIS:\s*(.+)/i;
  lines.forEach(line => {
    const m = line.match(lineRegex);
    if (m) {
      const s = m[2].toLowerCase();
      results.push({
        label: m[1].trim(),
        quelle: "KI-Einschätzung",
        status: s.startsWith("erf") ? "ok" : s.startsWith("teil") ? "mid" : "warn",
        hinweis: m[3].trim()
      });
    }
  });
  return results;
}

async function handleFeedbackClick(item, btn) {
  const { text, results: formalResults } = evaluateStatic(item);
  const box = document.getElementById("fb-" + item.id);
  const condensed = STATE.supportMode[item.id] === "fast";
  const unifiedFormal = formalToUnified(formalResults);

  if (!item.ki || countWords(text) < 8) {
    const note = item.ki ? "Für eine inhaltliche KI-Einschätzung bitte zuerst etwas mehr Text verfassen." : null;
    const pct = renderUnifiedFeedback(box, unifiedFormal, note, condensed);
    setItemScore(item.id, pct);
    persist();
    return;
  }

  renderLoadingState(box);
  if (btn) btn.disabled = true;

  try {
    const staticSummary = formalResults.map(r => (r.ok ? "OK" : "FEHLT") + ": " + r.label).join("; ");
    const sysPrompt = buildSysPrompt(item.ki, staticSummary);

    const response = await fetch(DATA.proxyUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          { role: "system", content: sysPrompt },
          { role: "user", content: text }
        ]
      })
    });
    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.error || ("Fehler " + response.status));
    }
    const data = await response.json();
    const antwort = data.choices[0].message.content;
    const aiResults = parseAICriteria(antwort);
    if (aiResults.length === 0) throw new Error("KI-Antwort konnte nicht ausgewertet werden");

    const pct = renderUnifiedFeedback(box, unifiedFormal.concat(aiResults), null, condensed);
    setItemScore(item.id, pct);
    persist();
  } catch (err) {
    console.error("Inhaltliche KI-Einschätzung nicht verfügbar:", err);
    const pct = renderUnifiedFeedback(box, unifiedFormal,
      "⚠️ Inhaltliche KI-Einschätzung aktuell nicht verfügbar (" + err.message + ") — angezeigt sind die formalen "
      + "Kriterien; der Punktestand basiert temporär nur darauf.", condensed);
    setItemScore(item.id, pct);
    persist();
  } finally {
    if (btn) btn.disabled = false;
  }
}

/* ============================================================
   Zustand
   ============================================================ */

let STATE = {};

function loadState() {
  STATE = ScormAPI.loadSuspendData();
  if (!STATE.answers) STATE.answers = {};
  if (!STATE.checks) STATE.checks = {};
  if (!STATE.itemScores) STATE.itemScores = {};
  if (!STATE.supportMode) STATE.supportMode = {};
}

function persist() {
  ScormAPI.saveSuspendData(STATE);
  updateOverallProgress();
}

function currentText(item) {
  return STATE.answers[item.id] || "";
}

function setItemScore(id, pct) {
  STATE.itemScores[id] = pct;
}

/* ---------- Gewichtung nach Aufwand ----------
   Uebernommen aus Pascals Paket: pro Kategorie gewichtet, nicht pro
   Einzelaufgabe, damit sich ein schwaches Handlungsprodukt nicht ueber
   viele kleine Posten wegkompensieren laesst. Die Gewichte liefert der
   Generator, weil nicht jede Herausforderung alle Kategorien hat. */

function itemsOfGroup(g) {
  return DATA.items.filter(i => i.group === g);
}

function computeWeightedOverallPct() {
  let total = 0, weightSum = 0;
  Object.keys(DATA.weights).forEach(g => {
    const ids = itemsOfGroup(g).map(i => i.id);
    if (!ids.length) return;
    const w = DATA.weights[g];
    weightSum += w;
    const avg = ids.reduce((a, id) => a + (STATE.itemScores[id] || 0), 0) / ids.length;
    total += (avg / 100) * w;
  });
  if (!weightSum) return 0;
  return Math.min(100, Math.round(total * (100 / weightSum)));
}

function updateOverallProgress() {
  const pct = computeWeightedOverallPct();
  const attempted = DATA.items.filter(i => i.id in STATE.itemScores).length;
  const bar = document.getElementById("overall-progress-bar");
  const label = document.getElementById("overall-progress-label");
  if (bar) bar.style.width = pct + "%";
  if (label) label.textContent = pct + "% bearbeitet (" + attempted + " von " + DATA.items.length + " Aufgaben angefangen)";
  ScormAPI.setScore(pct);
  ScormAPI.setStatus(pct >= 100 ? "completed" : "incomplete");
  renderAbschlussOverview();
}

/* ============================================================
   Rendering
   ============================================================ */

function scaffoldHtml(item) {
  const s = item.scaffold;
  if (!s) return "";
  /* s.produkt steht bereits als «Das liefert»-Zeile auf der Karte — die
     liefert-Kette gehoert vor die Antwort, nicht in die aufklappbare Hilfe. */
  let html = `<div class="scaffold" id="sc-${item.id}" hidden>`;
  if (s.strategien && s.strategien.length) {
    html += `<div class="scaffold-block"><div class="scaffold-lab">Vorgehen</div><ul>`
      + s.strategien.map(x => `<li>${escHtml(x)}</li>`).join("") + `</ul></div>`;
  }
  if (s.struktur && s.struktur.length) {
    html += `<div class="scaffold-block"><div class="scaffold-lab">Aufbau</div><ul>`
      + s.struktur.map(x => `<li>${escHtml(x)}</li>`).join("") + `</ul></div>`;
  }
  if (s.satzanfaenge && s.satzanfaenge.length) {
    html += `<div class="scaffold-block"><div class="scaffold-lab">Satzanfänge — anklicken zum Einsetzen</div><div class="chips">`
      + s.satzanfaenge.map((x, i) => `<button type="button" class="chip-insert" data-item="${item.id}" data-chip="${i}">${escHtml(x)}</button>`).join("")
      + `</div></div>`;
  }
  html += `</div>`;
  return html;
}

function textCardHtml(item) {
  const limitLabel = item.maxWords
    ? `${item.minWords}–${item.maxWords} Wörter`
    : item.minWords ? `mind. ${item.minWords} Wörter` : "";
  return `
    <div class="card" id="card-${item.id}">
      <div class="card-head">
        <span class="card-tag">${escHtml(item.tag)}</span>
        ${item.bloom ? `<span class="card-bloom">${escHtml(item.bloom)}</span>` : ""}
        ${item.quelle ? `<span class="card-quelle">${escHtml(item.quelle)}</span>` : ""}
      </div>
      <p class="card-prompt">${escHtml(item.prompt)}</p>
      ${item.liefert ? `<p class="card-liefert"><strong>Das liefert:</strong> ${escHtml(item.liefert)}</p>` : ""}
      ${item.scaffold ? `<div class="card-actions"><button type="button" class="btn-ghost" data-scaffold="${item.id}">🧭 Hilfe anzeigen</button></div>` : ""}
      ${scaffoldHtml(item)}
      <textarea id="ta-${item.id}" data-item="${item.id}" placeholder="Antwort hier schreiben …"></textarea>
      <div class="card-actions">
        <button type="button" class="btn-check" data-feedback="${item.id}">Feedback erhalten</button>
        <span class="word-count" id="wc-${item.id}">0 Wörter${limitLabel ? " · Ziel " + limitLabel : ""}</span>
      </div>
      <div class="fb-box" id="fb-${item.id}"></div>
    </div>`;
}

function declCardHtml(item) {
  return `
    <div class="card" id="card-${item.id}">
      <div class="card-head">
        <span class="card-tag">${escHtml(item.tag)}</span>
        ${item.quelle ? `<span class="card-quelle">${escHtml(item.quelle)}</span>` : ""}
      </div>
      <p class="card-prompt">${escHtml(item.prompt)}</p>
      <ul class="deklaration">
        ${item.checks.map((c, i) => `<li><input type="checkbox" id="ck-${item.id}-${i}" data-item="${item.id}" data-check="${i}"><label for="ck-${item.id}-${i}">${escHtml(c)}</label></li>`).join("")}
      </ul>
      <div class="fb-box" id="fb-${item.id}"></div>
    </div>`;
}

function renderItems() {
  const bySection = {};
  DATA.items.forEach(item => {
    (bySection[item.section] = bySection[item.section] || []).push(item);
  });
  Object.keys(bySection).forEach(sec => {
    const host = document.getElementById(sec + "-container");
    if (!host) return;
    host.innerHTML = bySection[sec]
      .map(i => (i.group === "decl" ? declCardHtml(i) : textCardHtml(i)))
      .join("");
  });
}

function renderMethoden() {
  const host = document.getElementById("methoden-container");
  if (!host || !DATA.methoden.length) return;
  host.innerHTML = DATA.methoden.map((m, i) => {
    let html = `<div class="methode-box${m.quelle === "hko" ? " hko" : ""}">`;
    html += `<div class="methode-head"><span class="methode-nr">${i + 1}</span><span class="methode-name">${escHtml(m.name)}</span></div>`;
    html += `<div class="methode-src">${m.quelle === "lehrmittel"
      ? "▣ Lehrmittel Kap. " + escHtml(m.kap || "") + (m.seiten ? " · " + escHtml(m.seiten) : "")
      : "Methodenkarte · nicht im Lehrmittel"}</div>`;
    if (m.fuer) html += `<div class="methode-fuer">${escHtml(m.fuer)}</div>`;
    if (m.quelle === "lehrmittel") {
      if (m.lesen) html += `<div class="methode-block"><div class="methode-lab">Lesen</div><div class="methode-txt">${escHtml(m.lesen)}</div></div>`;
      if (m.tun) html += `<div class="methode-block"><div class="methode-lab">Damit tun Sie</div><div class="methode-txt">${escHtml(m.tun)}</div></div>`;
    } else {
      if (m.schritte && m.schritte.length) {
        html += `<div class="methode-block"><div class="methode-lab">So geht das</div><div class="methode-txt">`
          + m.schritte.map((s, j) => `<strong>${j + 1}</strong> ${escHtml(s)} `).join("") + `</div></div>`;
      }
      if (m.ankommt) html += `<div class="methode-block"><div class="methode-lab">Worauf es ankommt</div><div class="methode-txt">${escHtml(m.ankommt)}</div></div>`;
      if (m.tun) html += `<div class="methode-block"><div class="methode-lab">Damit tun Sie</div><div class="methode-txt">${escHtml(m.tun)}</div></div>`;
    }
    if (m.beispiel && m.beispiel.length) {
      html += `<div class="methode-beispiel"><div class="methode-lab">So sieht das aus</div>`
        + m.beispiel.map(z => `<div class="methode-bsp-zeile">${escHtml(z)}</div>`).join("") + `</div>`;
    }
    if (m.fehler) html += `<div class="methode-fehler"><strong>Typischer Fehler:</strong> ${escHtml(m.fehler)}</div>`;
    if (m.merk) html += `<div class="methode-merk">${escHtml(m.merk)}</div>`;
    html += `</div>`;
    return html;
  }).join("");
}

function renderIntro() {
  const set = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };
  const intro = DATA.intro;

  set("intro-persona", `<strong>${escHtml(intro.persona.beruf)}</strong><br>${escHtml(intro.persona.betrieb)}${intro.persona.ort ? ", " + escHtml(intro.persona.ort) : ""}`);
  set("intro-produkt", `<strong>${escHtml(intro.produkt.format)}</strong><br>${escHtml(intro.produkt.titel)}`);
  set("intro-situation", escHtml(intro.situationText));
  set("intro-leitfrage", escHtml(intro.leitfrage));

  if (intro.tradeOff) {
    set("intro-tradeoff", `<strong>${escHtml(intro.tradeOff.trade_off)}</strong>`
      + (intro.tradeOff.hint ? `<br>${escHtml(intro.tradeOff.hint)}` : ""));
  } else {
    const el = document.getElementById("intro-tradeoff-wrap");
    if (el) el.remove();
  }

  if (intro.zahlen.length) {
    set("intro-zahlen", `<tr><th>Angabe</th><th>Wert</th></tr>`
      + intro.zahlen.map(z => `<tr><td>${escHtml(z.label)}</td><td>${escHtml(z.wert)}</td></tr>`).join(""));
  } else {
    document.getElementById("intro-zahlen-wrap")?.remove();
  }

  if (intro.quellen.length) {
    set("intro-quellen", `<tr><th>Ressource</th><th>Fundstelle</th></tr>`
      + intro.quellen.map(q => `<tr><td>${escHtml(q.titel)}</td><td>${escHtml(q.ref)}${q.seiten ? " · " + escHtml(q.seiten) : ""}</td></tr>`).join(""));
  } else {
    document.getElementById("intro-quellen-wrap")?.remove();
  }

  if (intro.fahrplan.length) {
    set("intro-fahrplan", intro.fahrplan.map(w =>
      `<div class="fahrplan-schritt${w.aktiv ? " aktiv" : ""}"><strong>${escHtml(w.label)}</strong>${escHtml(w.text)}</div>`).join(""));
  } else {
    document.getElementById("intro-fahrplan-wrap")?.remove();
  }
}

/* ---------- Abschluss ---------- */

function renderAbschlussOverview() {
  const el = document.getElementById("abschluss-overview");
  if (!el) return;
  let html = `<table class="checkliste"><tr><th>Aufgabe</th><th>Status</th></tr>`;
  DATA.items.forEach(it => {
    const pct = STATE.itemScores[it.id];
    const lowProdukt = it.group === "pos" && pct != null && pct < DATA.lernproduktSchwelle;
    const statusText = pct == null ? "nicht bearbeitet" : pct + "% bearbeitet" + (lowProdukt ? " ⚠ unter Erwartung" : "");
    const style = pct == null ? "" : lowProdukt ? 'style="color:var(--sit-akzent-dark);font-weight:bold"'
      : pct >= 80 ? 'style="color:var(--ok)"' : pct >= 50 ? 'style="color:var(--warn)"' : 'style="color:var(--sit-akzent)"';
    html += `<tr><td>${escHtml(it.tag)} — ${escHtml(it.label)}</td><td ${style}>${statusText}</td></tr>`;
  });
  html += `</table>`;
  el.innerHTML = html;
}

function completeUnit() {
  const pct = computeWeightedOverallPct();
  if (pct < 100) {
    if (!confirm(`Sie haben erst ${pct}% der Pflicht-Aufgaben vollständig bearbeitet. Trotzdem abschliessen?`)) return;
  }
  ScormAPI.setScore(pct);
  ScormAPI.setStatus("completed");
  ScormAPI.commit();
  const msg = document.getElementById("complete-msg");
  if (msg) {
    msg.style.display = "block";
    msg.textContent = `✅ Abgeschlossen — Ergebnis (${pct}%) wurde an das LMS übermittelt.`;
  }
}

function preparePrintDocument() {
  document.getElementById("printName").textContent =
    ScormAPI.getValue("cmi.core.student_name") || "_______________________";
  document.getElementById("printDate").textContent = new Date().toLocaleDateString("de-CH");
  document.getElementById("printScore").textContent = computeWeightedOverallPct() + "%";

  let tableHtml = "<tr><th>Aufgabe</th><th>Status</th></tr>";
  DATA.items.forEach(it => {
    const pct = STATE.itemScores[it.id];
    const low = it.group === "pos" && pct != null && pct < DATA.lernproduktSchwelle;
    tableHtml += `<tr><td>${escHtml(it.tag)} — ${escHtml(it.label)}</td>`
      + `<td${low ? ' style="color:#b00020;font-weight:bold"' : ""}>`
      + (pct == null ? "nicht bearbeitet" : pct + "% bearbeitet" + (low ? " ⚠ unter Erwartung" : ""))
      + `</td></tr>`;
  });
  document.getElementById("printOverviewTable").innerHTML = tableHtml;

  const container = document.getElementById("printAnswers");
  let html = "";
  let lastSection = null;
  DATA.items.forEach(it => {
    if (it.section !== lastSection) {
      html += `<div class="pd-section-label">${escHtml(DATA.sectionTitles[it.section] || it.section)}</div>`;
      lastSection = it.section;
    }
    const pct = STATE.itemScores[it.id];
    const low = it.group === "pos" && pct != null && pct < DATA.lernproduktSchwelle;
    html += `<div class="pd-item"><div class="pd-item-head">`
      + `<span class="pd-item-tag">${escHtml(it.tag)} — ${escHtml(it.label)}</span>`
      + (pct != null
        ? `<span class="pd-item-pct"${low ? ' style="color:#b00020;font-weight:bold"' : ""}>${pct}% bearbeitet${low ? " ⚠ unter Erwartung" : ""}</span>`
        : `<span class="pd-item-pct pd-item-empty">nicht bearbeitet</span>`)
      + `</div>`;
    if (it.prompt) html += `<p class="pd-item-prompt">${escHtml(it.prompt)}${it.quelle ? "  (" + escHtml(it.quelle) + ")" : ""}</p>`;
    if (it.group === "decl") {
      const checked = STATE.checks[it.id] || [];
      html += `<div class="pd-answer">` + it.checks.map((c, i) =>
        `${checked[i] ? "☑" : "☐"} ${escHtml(c)}`).join("\n") + `</div>`;
    } else {
      const t = currentText(it);
      html += t
        ? `<div class="pd-answer">${escHtml(t)}</div>`
        : `<div class="pd-answer leer">— nicht bearbeitet —</div>`;
    }
    html += `</div>`;
  });
  container.innerHTML = html;
}

function printLeistungsdokumentation() {
  preparePrintDocument();
  window.print();
}

/* ============================================================
   Start
   ============================================================ */

function itemById(id) {
  return DATA.items.find(i => i.id === id);
}

function updateWordCount(item) {
  const el = document.getElementById("wc-" + item.id);
  if (!el) return;
  const w = countWords(currentText(item));
  const limitLabel = item.maxWords ? `${item.minWords}–${item.maxWords} Wörter`
    : item.minWords ? `mind. ${item.minWords} Wörter` : "";
  el.textContent = `${w} Wörter` + (limitLabel ? ` · Ziel ${limitLabel}` : "");
}

function scoreDeclaration(item) {
  const checked = STATE.checks[item.id] || [];
  const n = item.checks.length;
  const hits = item.checks.filter((_, i) => checked[i]).length;
  const pct = n ? Math.round((hits / n) * 100) : 0;
  setItemScore(item.id, pct);
  const box = document.getElementById("fb-" + item.id);
  if (box) {
    box.innerHTML = `<div class="fb-summary ${pct >= 80 ? "fb-high" : pct >= 50 ? "fb-mid" : "fb-low"}">`
      + `${hits} von ${n} bestätigt</div>`
      + `<div class="fb-note">Diese Punkte kann die Lerneinheit nicht selbst prüfen — Sie bestätigen sie. `
      + `Sie erscheinen auf der Leistungsdokumentation und die Lehrperson prüft sie an der Abgabe.</div>`;
  }
}

function initApp() {
  ScormAPI.init();
  loadState();

  renderIntro();
  renderItems();
  renderMethoden();

  /* Textfelder und Zaehler aus dem Zustand fuellen */
  DATA.items.forEach(item => {
    if (item.group === "decl") {
      const checked = STATE.checks[item.id] || [];
      item.checks.forEach((_, i) => {
        const cb = document.getElementById(`ck-${item.id}-${i}`);
        if (cb) cb.checked = !!checked[i];
      });
      if (item.id in STATE.itemScores) scoreDeclaration(item);
      return;
    }
    const ta = document.getElementById("ta-" + item.id);
    if (ta) ta.value = currentText(item);
    updateWordCount(item);
  });

  document.addEventListener("input", (e) => {
    const id = e.target.dataset && e.target.dataset.item;
    if (!id || e.target.tagName !== "TEXTAREA") return;
    STATE.answers[id] = e.target.value;
    updateWordCount(itemById(id));
  });

  /* Erst beim Verlassen des Feldes speichern — nicht bei jedem Tastendruck,
     das waere ein LMSCommit pro Zeichen. */
  document.addEventListener("change", (e) => {
    const t = e.target;
    if (t.tagName === "TEXTAREA" && t.dataset.item) {
      STATE.answers[t.dataset.item] = t.value;
      persist();
    }
    if (t.type === "checkbox" && t.dataset.item) {
      const item = itemById(t.dataset.item);
      const arr = STATE.checks[item.id] || (STATE.checks[item.id] = []);
      arr[Number(t.dataset.check)] = t.checked;
      scoreDeclaration(item);
      persist();
    }
  });

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    if (btn.dataset.feedback) {
      handleFeedbackClick(itemById(btn.dataset.feedback), btn);
      return;
    }
    if (btn.dataset.scaffold) {
      const sc = document.getElementById("sc-" + btn.dataset.scaffold);
      if (sc) {
        sc.hidden = !sc.hidden;
        btn.classList.toggle("on", !sc.hidden);
        btn.textContent = sc.hidden ? "🧭 Hilfe anzeigen" : "🧭 Hilfe ausblenden";
        STATE.supportMode[btn.dataset.scaffold] = sc.hidden ? "" : "hilfe";
      }
      return;
    }
    if (btn.dataset.chip) {
      const item = itemById(btn.dataset.item);
      const ta = document.getElementById("ta-" + item.id);
      if (ta) {
        const chip = item.scaffold.satzanfaenge[Number(btn.dataset.chip)].replace(/^«|…»$|»$/g, "").trim();
        ta.value = (ta.value ? ta.value.replace(/\s*$/, "\n") : "") + chip + " ";
        STATE.answers[item.id] = ta.value;
        ta.focus();
        ta.setSelectionRange(ta.value.length, ta.value.length);
        updateWordCount(item);
        persist();
      }
      return;
    }
    if (btn.dataset.target) {
      document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
      document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
      document.getElementById(btn.dataset.target).classList.add("active");
      btn.classList.add("active");
      window.scrollTo(0, 0);
    }
  });

  /* suspend_data ist in SCORM 1.2 auf 4096 Zeichen begrenzt. Statt zu hoffen,
     messen wir und sagen es — auf dem Bildschirm, nicht nur in der Konsole. */
  ScormAPI.onSuspendOverflow((len, limit) => {
    const el = document.getElementById("suspend-warn");
    if (!el) return;
    el.style.display = "block";
    el.innerHTML = `<strong>Hinweis zur Speicherung:</strong> Ihre Antworten sind mit ${len} Zeichen `
      + `länger als die ${limit} Zeichen, die SCORM 1.2 dem LMS garantiert. Im Browser dieses Geräts ist `
      + `alles gesichert. Drucken Sie zur Sicherheit die Leistungsdokumentation, bevor Sie schliessen.`;
  });

  document.getElementById("btn-complete")?.addEventListener("click", completeUnit);
  document.getElementById("btn-print")?.addEventListener("click", printLeistungsdokumentation);

  updateOverallProgress();

  window.addEventListener("beforeunload", () => { ScormAPI.commit(); ScormAPI.finish(); });
  window.addEventListener("pagehide", () => { ScormAPI.commit(); });
}

document.addEventListener("DOMContentLoaded", initApp);
