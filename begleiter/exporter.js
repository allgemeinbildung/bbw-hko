/* exporter.js — converts a parsed document into a Word .docx via docx.js.
 * Exposes: window.exportDocx({ meta, body, tokens }, logoBlobOrUrl) -> Promise<Blob>
 *
 * Strategy: re-tokenize the body via marked.lexer() to get a clean tree, then map
 * each block token to docx Paragraph / Table / etc. Uses STYLEREF field codes to
 * pull the current Heading 2 into the running header.
 */

(function () {
  const d = window.docx;
  if (!d) {
    console.error("docx library not loaded");
    return;
  }

  const {
    Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
    Header, Footer, PageNumber, Table, TableRow, TableCell, WidthType,
    BorderStyle, ShadingType, ImageRun, PageBreak, SimpleField,
    LevelFormat, convertInchesToTwip, ExternalHyperlink, TabStopType,
    UnderlineType,
  } = d;

  const POINT = (pt) => pt * 2;             // half-points for size
  const TWIP = (pt) => Math.round(pt * 20); // twips from points
  // 1 inch = 1440 twips; A4 = 11906 x 16838 twips

  // BBW palette
  const C = {
    brand: "80FF00",          // neon-lime — accents only
    brandDeep: "5A9D14",      // readable green
    brandSoft: "E8FCC6",
    primary: "1A1A1A",        // near-black for headings/primary
    primarySoft: "F1F1EE",
    accent: "5A9D14",         // alias for compatibility (eyebrow etc.)
    ink: "1A1A1A",
    ink2: "4A4A4A",
    muted: "7A7A7A",
    line: "DCDCDC",
    lineSoft: "ECECEC",
    panel: "F7F6F1",
    code: "F5F3ED",
    codeBd: "E6E2D4",
  };

  // ----- helpers: inline tokens -> TextRun[] -----
  function inlineRuns(tokens, style = {}) {
    const out = [];
    if (!tokens) return out;
    for (const t of tokens) {
      switch (t.type) {
        case "text":
          if (t.tokens && t.tokens.length) {
            out.push(...inlineRuns(t.tokens, style));
          } else {
            out.push(new TextRun({ text: decodeEntities(t.text), ...style }));
          }
          break;
        case "escape":
          out.push(new TextRun({ text: t.text, ...style }));
          break;
        case "strong":
          out.push(...inlineRuns(t.tokens, { ...style, bold: true }));
          break;
        case "em":
          out.push(...inlineRuns(t.tokens, { ...style, italics: true }));
          break;
        case "del":
          out.push(...inlineRuns(t.tokens, { ...style, strike: true }));
          break;
        case "codespan":
          out.push(
            new TextRun({
              text: decodeEntities(t.text),
              font: "JetBrains Mono",
              color: "6A3E00",
              shading: { type: ShadingType.CLEAR, fill: "F0EEE8", color: "auto" },
              ...style,
            })
          );
          break;
        case "br":
          out.push(new TextRun({ break: 1, ...style }));
          break;
        case "link": {
          const children = inlineRuns(t.tokens, {
            ...style,
            color: C.brandDeep,
            underline: { type: UnderlineType.SINGLE, color: C.brandDeep },
          });
          out.push(new ExternalHyperlink({ link: t.href, children }));
          break;
        }
        case "image":
          out.push(new TextRun({ text: `[Bild: ${t.text || t.href}]`, italics: true, color: C.muted, ...style }));
          break;
        case "html":
          // Pass through raw text minus tags
          out.push(new TextRun({ text: stripTags(t.text), ...style }));
          break;
        default:
          if (t.tokens) out.push(...inlineRuns(t.tokens, style));
          else if (t.text) out.push(new TextRun({ text: decodeEntities(t.text), ...style }));
      }
    }
    return out;
  }

  function decodeEntities(s) {
    return String(s)
      .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ");
  }
  function stripTags(s) { return String(s).replace(/<[^>]+>/g, ""); }

  // ----- helpers: block tokens -> docx blocks -----
  function blockToParagraphs(token, ctx) {
    switch (token.type) {
      case "heading":
        return [headingParagraph(token, ctx)];
      case "paragraph":
        return [new Paragraph({
          spacing: { before: 60, after: 100, line: 320 },
          children: inlineRuns(token.tokens),
        })];
      case "blockquote":
        return blockquoteParagraphs(token, ctx);
      case "callout":
        return calloutTable(token, ctx);
      case "list":
        return listParagraphs(token, ctx);
      case "code":
        return codeParagraphs(token);
      case "hr":
        // Horizontal rule — light divider only. (H2 already triggers a new page.)
        return [new Paragraph({
          spacing: { before: 60, after: 120 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: C.line, space: 1 } },
          children: [new TextRun({ text: "" })],
        })];
      case "table":
        return tableBlock(token, ctx);
      case "space":
        return [];
      case "html":
        // skip raw HTML — emit text content
        return [new Paragraph({ children: [new TextRun({ text: stripTags(token.text), color: C.muted, size: POINT(10) })] })];
      default:
        if (token.tokens) {
          // generic container — recurse
          const out = [];
          for (const c of token.tokens) out.push(...blockToParagraphs(c, ctx));
          return out;
        }
        return [];
    }
  }

  function headingParagraph(t, ctx) {
    const level = t.depth;
    const map = {
      1: { size: POINT(22), color: C.ink, bold: true, font: "Source Serif 4",
           spacing: { before: 0, after: 120 } },
      2: { size: POINT(18), color: C.ink, bold: true, font: "Source Serif 4",
           spacing: { before: 0, after: 160 }, border: {
              bottom: { style: BorderStyle.SINGLE, size: 18, color: C.brand, space: 6 } } },
      3: { size: POINT(13), color: C.ink, bold: true, font: "Source Serif 4",
           spacing: { before: 280, after: 80 } },
      4: { size: POINT(10), color: C.ink2, bold: true, font: "Source Sans 3",
           caps: true, spacing: { before: 200, after: 60 } },
    };
    const cfg = map[level] || map[4];
    const runs = inlineRuns(t.tokens, {
      bold: cfg.bold, color: cfg.color, font: cfg.font, size: cfg.size,
      allCaps: cfg.caps,
    });
    const headingStyle = {
      1: HeadingLevel.HEADING_1, 2: HeadingLevel.HEADING_2,
      3: HeadingLevel.HEADING_3, 4: HeadingLevel.HEADING_4,
    }[level];
    return new Paragraph({
      heading: headingStyle,
      spacing: cfg.spacing,
      border: cfg.border,
      children: runs,
      keepNext: true,
      pageBreakBefore: level === 2,   // new page on every H2
    });
  }

  function blockquoteParagraphs(t, ctx) {
    // Treat as a single-cell tinted table for visual fidelity
    const inner = [];
    for (const c of t.tokens) inner.push(...blockToParagraphs(c, ctx));
    if (!inner.length) inner.push(new Paragraph({ children: [] }));
    return [
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        layout: "fixed",
        borders: noBorders({ left: { style: BorderStyle.SINGLE, size: 18, color: C.ink2 } }),
        rows: [new TableRow({
          children: [new TableCell({
            margins: { top: 120, bottom: 120, left: 220, right: 180 },
            shading: { type: ShadingType.CLEAR, fill: C.panel, color: "auto" },
            children: inner,
          })],
        })],
      }),
      spacer(),
    ];
  }

  function calloutTable(t, ctx) {
    const colors = window.CALLOUT_COLORS[t.calloutType] || { bg: "EEEEEE", bd: "888888" };
    const label = window.CALLOUT_LABELS[t.calloutType] || t.calloutType;
    const labelText = label + (t.title ? "  ·  " + t.title : "");

    const inner = [
      new Paragraph({
        spacing: { before: 0, after: 80 },
        children: [
          new TextRun({
            text: labelText.toUpperCase(),
            bold: true, size: POINT(9), color: colors.bd, font: "Source Sans 3",
            characterSpacing: 12,
          }),
        ],
      }),
    ];
    for (const c of t.tokens) inner.push(...blockToParagraphs(c, ctx));

    return [
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        layout: "fixed",
        borders: noBorders({ left: { style: BorderStyle.SINGLE, size: 18, color: colors.bd } }),
        rows: [new TableRow({
          children: [new TableCell({
            margins: { top: 140, bottom: 140, left: 220, right: 180 },
            shading: { type: ShadingType.CLEAR, fill: colors.bg, color: "auto" },
            children: inner,
          })],
        })],
      }),
      spacer(),  // CRITICAL: prevents Word from gluing this to a preceding/following table
    ];
  }

  function noBorders(overrides = {}) {
    const none = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
    return {
      top: none, bottom: none, left: none, right: none,
      insideHorizontal: none, insideVertical: none,
      ...overrides,
    };
  }

  function spacer() {
    return new Paragraph({ spacing: { before: 0, after: 0 }, children: [new TextRun({ text: "", size: POINT(4) })] });
  }

  // ----- lists -----
  function listParagraphs(t, ctx, depth = 0) {
    const out = [];
    const ordered = t.ordered;
    for (const item of t.items) {
      // Marked v12 list item: {tokens, task, checked, loose, ...}
      const itemChildren = item.tokens || [];
      // Split into "main" content (text/paragraph) and nested lists
      let mainTextTokens = [];
      const nestedBlocks = [];
      for (const c of itemChildren) {
        if (c.type === "list") {
          nestedBlocks.push(c);
        } else if (c.type === "text" || c.type === "paragraph") {
          // Both carry inline tokens via .tokens
          mainTextTokens = mainTextTokens.concat(c.tokens || [{ type: "text", text: c.text || "" }]);
        } else {
          nestedBlocks.push(c);
        }
      }
      let firstLine = inlineRuns(mainTextTokens);
      if (item.task) {
        firstLine = [
          new TextRun({ text: item.checked ? "☒  " : "☐  ", size: POINT(11) }),
          ...firstLine,
        ];
      }
      out.push(
        new Paragraph({
          spacing: { before: 30, after: 30, line: 300 },
          indent: { left: TWIP(14 + depth * 18), hanging: TWIP(14) },
          numbering: item.task ? undefined : {
            reference: ordered ? "ordered" : "bullet",
            level: depth,
          },
          children: firstLine,
        })
      );
      for (const nb of nestedBlocks) {
        if (nb.type === "list") {
          out.push(...listParagraphs(nb, ctx, depth + 1));
        } else {
          for (const p of blockToParagraphs(nb, ctx)) out.push(p);
        }
      }
    }
    return out;
  }

  // ----- code blocks -----
  function codeParagraphs(t) {
    const lines = String(t.text || "").split(/\r?\n/);
    const innerParas = lines.map((line, i) =>
      new Paragraph({
        spacing: { before: 0, after: 0, line: 260 },
        children: [new TextRun({ text: line || " ", font: "JetBrains Mono", size: POINT(9.5), color: "2A2A2A" })],
      })
    );
    return [
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        layout: "fixed",
        borders: {
          top:    { style: BorderStyle.SINGLE, size: 4, color: C.codeBd },
          bottom: { style: BorderStyle.SINGLE, size: 4, color: C.codeBd },
          left:   { style: BorderStyle.SINGLE, size: 4, color: C.codeBd },
          right:  { style: BorderStyle.SINGLE, size: 4, color: C.codeBd },
          insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
          insideVertical:   { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
        },
        rows: [new TableRow({
          children: [new TableCell({
            margins: { top: 120, bottom: 120, left: 180, right: 180 },
            shading: { type: ShadingType.CLEAR, fill: C.code, color: "auto" },
            children: innerParas,
          })],
        })],
      }),
      spacer(),
    ];
  }

  // ----- tables -----
  function tableBlock(t, ctx) {
    // Detect steckbrief (header row entirely empty, exactly 2 columns)
    const isSteckbrief = (t.header || []).length === 2
      && t.header.every((cell) => {
        const text = (cell.tokens || [{ text: cell.text || "" }])
          .map(x => x.text || "").join("").replace(/\u00a0/g, "").trim();
        return text === "";
      });

    const hasHeader = !isSteckbrief && (t.header || []).some((cell) =>
      ((cell.tokens || [{ text: cell.text || "" }]).map(x => x.text || "").join("").trim() !== "")
    );

    const rows = [];
    const cellBorder = { style: BorderStyle.SINGLE, size: 4, color: C.line };
    const cellBorders = {
      top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder,
    };

    if (hasHeader) {
      rows.push(new TableRow({
        tableHeader: true,
        children: t.header.map((cell) =>
          new TableCell({
            shading: { type: ShadingType.CLEAR, fill: C.ink, color: "auto" },
            margins: { top: 80, bottom: 80, left: 120, right: 120 },
            children: [new Paragraph({
              spacing: { before: 0, after: 0 },
              children: inlineRuns(cell.tokens, { bold: true, color: "FFFFFF", size: POINT(9.5) }),
            })],
          })
        ),
      }));
    }

    for (let ri = 0; ri < t.rows.length; ri++) {
      const r = t.rows[ri];
      const stripe = !isSteckbrief && (ri % 2 === 1);
      rows.push(new TableRow({
        children: r.map((cell, ci) => {
          const isSteckLabel = isSteckbrief && ci === 0;
          const innerRuns = inlineRuns(cell.tokens, {
            bold: isSteckLabel,
            color: isSteckLabel ? C.brandDeep : undefined,
            size: POINT(10),
          });
          return new TableCell({
            shading: isSteckLabel
              ? { type: ShadingType.CLEAR, fill: C.brandSoft, color: "auto" }
              : stripe
              ? { type: ShadingType.CLEAR, fill: "FAFAF7", color: "auto" }
              : undefined,
            margins: { top: 70, bottom: 70, left: 120, right: 120 },
            width: isSteckbrief && ci === 0
              ? { size: 32, type: WidthType.PERCENTAGE }
              : undefined,
            children: [new Paragraph({
              spacing: { before: 0, after: 0 },
              children: innerRuns,
            })],
          });
        }),
      }));
    }

    return [
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        layout: "fixed",
        borders: {
          top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder,
          insideHorizontal: cellBorder, insideVertical: cellBorder,
        },
        rows,
      }),
      spacer(),
    ];
  }

  // ----- title block -----
  function titleBlock(meta) {
    const out = [];
    // Brand accent line + eyebrow
    out.push(new Paragraph({
      spacing: { before: 0, after: 80 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 22, color: C.brand, space: 2 } },
      children: [new TextRun({
        text: (meta.kompetenz ? "KOMPETENZ " + meta.kompetenz : "BEGLEITDOKUMENT").toUpperCase(),
        bold: true, color: C.brandDeep, size: POINT(9.5), characterSpacing: 30, font: "Source Sans 3",
      })],
    }));
    out.push(new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 120, after: 80 },
      children: [new TextRun({
        text: meta.titel || "Begleit-Dokument",
        bold: true, color: C.ink, size: POINT(22), font: "Source Serif 4",
      })],
    }));
    if (meta.untertitel) {
      out.push(new Paragraph({
        spacing: { before: 0, after: 140 },
        children: [new TextRun({
          text: meta.untertitel,
          italics: true, color: C.ink2, size: POINT(12), font: "Source Serif 4",
        })],
      }));
    }
    // Metadata strip
    const bits = [];
    if (meta.kompetenz_slug) bits.push(["Kompetenz-Slug", meta.kompetenz_slug]);
    if (meta.beruf) bits.push(["Beruf", meta.beruf]);
    if (meta.thema) bits.push(["Thema", meta.thema]);
    if (meta.fach) bits.push(["Lernbereiche", meta.fach]);
    if (meta.autor) bits.push(["Lehrperson", meta.autor]);
    if (meta.stand) bits.push(["Stand", meta.stand]);
    if (meta.version) bits.push(["Version", meta.version]);
    if (bits.length) {
      const runs = [];
      bits.forEach(([k, v], i) => {
        if (i > 0) runs.push(new TextRun({ text: "    ", size: POINT(9.5) }));
        runs.push(new TextRun({ text: k + ": ", bold: true, color: C.ink2, size: POINT(9.5) }));
        runs.push(new TextRun({ text: v, color: C.muted, size: POINT(9.5) }));
      });
      out.push(new Paragraph({
        spacing: { before: 60, after: 240 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: C.line, space: 8 } },
        children: runs,
      }));
    }
    return out;
  }

  // ----- header / footer -----
  function buildHeader(meta, logoBuffer) {
    // Header is ONLY the school logo. No title text, no STYLEREF chapter field.
    const logoPara = logoBuffer
      ? new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { before: 0, after: 0 },
          children: [new ImageRun({ data: logoBuffer, transformation: { width: 150, height: 53 } })],
        })
      : new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { before: 0, after: 0 },
          children: [new TextRun({
            text: "BBW · Berufsbildungsschule Winterthur",
            bold: true, color: C.brandDeep, size: POINT(10), font: "Source Sans 3",
          })],
        });
    return new Header({
      children: [
        logoPara,
        // small bottom spacer
        new Paragraph({ spacing: { before: 0, after: 0 }, children: [new TextRun({ text: "", size: POINT(2) })] }),
      ],
    });
  }

  function buildFooter(meta) {
    // Footer: document title (left, italic) + page X / Y (right). No autor, no date.
    return new Footer({
      children: [
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: noBorders({
            top: { style: BorderStyle.SINGLE, size: 6, color: C.line, space: 6 },
          }),
          rows: [new TableRow({ children: [
            new TableCell({
              width: { size: 72, type: WidthType.PERCENTAGE },
              borders: noBorders(),
              margins: { top: 80, bottom: 0, left: 0, right: 80 },
              children: [new Paragraph({
                alignment: AlignmentType.LEFT,
                spacing: { before: 0, after: 0 },
                children: [new TextRun({
                  text: meta.titel || "",
                  italics: true, color: C.ink2, size: POINT(8.5),
                  font: "Source Serif 4",
                })],
              })],
            }),
            new TableCell({
              width: { size: 28, type: WidthType.PERCENTAGE },
              borders: noBorders(),
              margins: { top: 80, bottom: 0, left: 80, right: 0 },
              children: [new Paragraph({
                alignment: AlignmentType.RIGHT,
                spacing: { before: 0, after: 0 },
                children: [
                  new TextRun({ text: "Seite ", color: C.muted, size: POINT(8.5), font: "Source Sans 3" }),
                  new TextRun({ children: [PageNumber.CURRENT], color: C.ink2, size: POINT(8.5), font: "Source Sans 3" }),
                  new TextRun({ text: " / ", color: C.muted, size: POINT(8.5), font: "Source Sans 3" }),
                  new TextRun({ children: [PageNumber.TOTAL_PAGES], color: C.ink2, size: POINT(8.5), font: "Source Sans 3" }),
                ],
              })],
            }),
          ] })],
        }),
      ],
    });
  }

  // ----- bullet/number scheme -----
  const numberingConfig = {
    config: [
      {
        reference: "bullet",
        levels: [0, 1, 2, 3, 4].map((lvl) => ({
          level: lvl,
          format: LevelFormat.BULLET,
          text: ["•", "◦", "▪", "•", "◦"][lvl] || "•",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: TWIP(18 * (lvl + 1)), hanging: TWIP(14) } } },
        })),
      },
      {
        reference: "ordered",
        levels: [0, 1, 2, 3].map((lvl) => ({
          level: lvl,
          format: LevelFormat.DECIMAL,
          text: `%${lvl + 1}.`,
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: TWIP(18 * (lvl + 1)), hanging: TWIP(18) } } },
        })),
      },
    ],
  };

  // ----- main export -----
  async function exportDocx(parsed, logoBuffer) {
    const { meta, body } = parsed;
    // Re-lex body so callouts are present as tokens
    const tokens = window.marked.lexer(body || "");

    const children = [];
    children.push(...titleBlock(meta));
    for (const t of tokens) {
      const blocks = blockToParagraphs(t, { meta });
      for (const b of blocks) children.push(b);
    }

    const doc = new Document({
      creator: meta.autor || "BBW",
      title: meta.titel || "Begleitdokument",
      description: meta.untertitel || "",
      styles: {
        default: {
          document: { run: { font: "Source Sans 3", size: POINT(11), color: C.ink } },
        },
      },
      numbering: numberingConfig,
      sections: [{
        properties: {
          page: {
            size: { width: 11906, height: 16838 },     // A4
            margin: { top: 1900, right: 1500, bottom: 1500, left: 1500,
                      header: 720, footer: 720 },
          },
        },
        headers: { default: buildHeader(meta, logoBuffer) },
        footers: { default: buildFooter(meta) },
        children,
      }],
    });

    const blob = await Packer.toBlob(doc);
    return blob;
  }

  window.exportDocx = exportDocx;
})();
