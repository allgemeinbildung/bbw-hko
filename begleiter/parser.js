/* parser.jsx — frontmatter + marked extensions for HKO callouts.
 * Exposes:
 *   window.parseDocument(rawMarkdown) => { meta, tokens, html }
 *   window.CALLOUT_LABELS — { [type]: "Label" }
 *   window.CALLOUT_COLORS — { [type]: { bg, bd } } (for docx)
 */

(function () {
  const CALLOUT_LABELS = {
    lernziel: "Lernziel",
    hinweis: "Hinweis",
    beispiel: "Beispiel",
    warnung: "Warnung",
    reflexion: "Reflexion",
    coaching: "Coaching-Move",
    mehrdeutigkeit: "Mehrdeutigkeit halten",
    differenzieren: "Differenzieren",
  };

  // Hex colors (no #) for docx
  const CALLOUT_COLORS = {
    lernziel:       { bg: "E9F3EC", bd: "2F7A4A" },
    hinweis:        { bg: "E8EEF7", bd: "2A548C" },
    beispiel:       { bg: "F1EDE4", bd: "7A6135" },
    warnung:        { bg: "FAECE9", bd: "B8232B" },
    reflexion:      { bg: "EFEAF5", bd: "5E3F8A" },
    coaching:       { bg: "FDF5E1", bd: "A07A14" },
    mehrdeutigkeit: { bg: "E6F1F1", bd: "2F7373" },
    differenzieren: { bg: "EDEDED", bd: "4A4A4A" },
  };

  // ---- frontmatter (small bespoke YAML — flat key: value only) ----
  function parseFrontmatter(src) {
    const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(src);
    if (!m) return { meta: {}, body: src };
    const yaml = m[1];
    const meta = {};
    yaml.split(/\r?\n/).forEach((line) => {
      if (!line.trim() || line.trim().startsWith("#")) return;
      const km = /^([A-Za-z0-9_\-]+)\s*:\s*(.*)$/.exec(line);
      if (!km) return;
      let v = km[2].trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1);
      }
      meta[km[1]] = v;
    });
    return { meta, body: src.slice(m[0].length) };
  }

  // ---- marked extension: callouts ----
  // Captures a blockquote whose first non-empty content line is "[!type] optional title".
  const calloutExtension = {
    name: "callout",
    level: "block",
    start(src) {
      const i = src.search(/^>\s*\[!/m);
      return i < 0 ? undefined : i;
    },
    tokenizer(src) {
      const rule = /^(?:>[ \t]*\[!([A-Za-z_]+)\][ \t]*(.*?)\r?\n)((?:>.*(?:\r?\n|$))*)/;
      const m = rule.exec(src);
      if (!m) return;
      const type = m[1].toLowerCase();
      // Only treat as callout if type is one we know — otherwise let marked handle it as normal blockquote.
      if (!(type in CALLOUT_LABELS)) return;
      const title = (m[2] || "").trim();
      const bodyText = m[3]
        .split(/\r?\n/)
        .map((ln) => ln.replace(/^>[ \t]?/, ""))
        .join("\n")
        .replace(/\n+$/, "");
      const token = {
        type: "callout",
        raw: m[0],
        calloutType: type,
        title,
        tokens: [],
      };
      this.lexer.blockTokens(bodyText, token.tokens);
      return token;
    },
    renderer(token) {
      const inner = this.parser.parse(token.tokens);
      const label = CALLOUT_LABELS[token.calloutType] || token.calloutType;
      const titleHtml = token.title
        ? ` · <span class="callout__title">${escapeHtml(token.title)}</span>`
        : "";
      return (
        `<aside class="callout callout--${token.calloutType}">` +
          `<div class="callout__label">${label}${titleHtml}</div>` +
          `<div class="callout__body">${inner}</div>` +
        `</aside>`
      );
    },
  };

  // ---- marked extension: GFM task list items (renderer add-on) ----
  // marked supports GFM tasks natively (gfm: true). We just style them in CSS via .task-list-item.
  // Default renderer doesn't add a class; override listitem to add one.
  const taskListRendererPatch = {
    listitem(item) {
      // marked v12 passes object {text, task, checked, loose, tokens}
      const content =
        item && typeof item === "object" && item.tokens
          ? this.parser.parseInline(item.tokens)
          : (typeof item === "string" ? item : item?.text || "");
      if (item && item.task) {
        const cls = "task-list-item" + (item.checked ? " is-checked" : "");
        return `<li class="${cls}">${content}</li>\n`;
      }
      return `<li>${content}</li>\n`;
    },
  };

  // ---- marked extension: tag steckbrief tables ----
  // After parsing, we'll post-process the HTML to mark 2-col tables whose first row's first cell is "&nbsp;" or empty as `.steckbrief`.
  function tagSteckbriefTables(html) {
    return html.replace(/<table>([\s\S]*?)<\/table>/g, (full, inner) => {
      // Count th cells in header
      const headMatch = /<thead>([\s\S]*?)<\/thead>/.exec(inner);
      if (!headMatch) return full;
      const ths = [...headMatch[1].matchAll(/<th[^>]*>([\s\S]*?)<\/th>/g)].map((mm) =>
        mm[1].replace(/\s+/g, "").trim()
      );
      if (ths.length === 2 && ths.every((t) => t === "" || t === "&nbsp;")) {
        return full.replace("<table>", '<table class="steckbrief">');
      }
      return full;
    });
  }

  // Insert a "Seitenumbruch" separator BEFORE each <h2> in the rendered HTML.
  // (Skips the first h2 so the indicator doesn't appear right after the title block;
  // in the Word export the page break IS applied before every h2.)
  function insertPageBreaksBeforeH2(html) {
    let first = true;
    return html.replace(/<h2(\b[^>]*)>/g, (match) => {
      if (first) { first = false; return match; }
      return '<div class="page__break"></div>' + match;
    });
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );
  }

  // ---- main entry ----
  function parseDocument(raw) {
    const { meta, body } = parseFrontmatter(raw || "");

    // Configure a fresh marked instance per call to avoid global state issues.
    const m = window.marked;
    m.setOptions({ gfm: true, breaks: false, headerIds: false, mangle: false });
    m.use({ extensions: [calloutExtension], renderer: taskListRendererPatch });

    const tokens = m.lexer(body);
    let html = m.parser(tokens);
    html = tagSteckbriefTables(html);
    html = insertPageBreaksBeforeH2(html);

    return { meta, tokens, body, html };
  }

  window.parseDocument = parseDocument;
  window.CALLOUT_LABELS = CALLOUT_LABELS;
  window.CALLOUT_COLORS = CALLOUT_COLORS;
})();
