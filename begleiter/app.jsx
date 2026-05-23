/* app.jsx — React app: drop zone, file list, metadata overrides, preview, exporters. */

const { useState, useEffect, useRef, useMemo, useCallback } = React;

// ---- helpers --------------------------------------------------------------
function uid() { return Math.random().toString(36).slice(2, 9); }

function safeFilename(name) {
  return String(name || "begleitdokument")
    .replace(/\.(md|markdown)$/i, "")
    .replace(/[^A-Za-z0-9._\-]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

// Convert SVG text → PNG ArrayBuffer for docx ImageRun.
async function svgToPngBuffer(svgUrl, targetWidth = 300) {
  const res = await fetch(svgUrl);
  const svgText = await res.text();
  const blob = new Blob([svgText], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  try {
    const img = await new Promise((resolve, reject) => {
      const im = new Image();
      im.onload = () => resolve(im);
      im.onerror = reject;
      im.src = url;
    });
    const aspect = img.naturalHeight / img.naturalWidth || 0.4;
    const w = targetWidth;
    const h = Math.round(w * aspect);
    const canvas = document.createElement("canvas");
    canvas.width = w * 3;
    canvas.height = h * 3;
    const ctx = canvas.getContext("2d");
    ctx.scale(3, 3);
    ctx.drawImage(img, 0, 0, w, h);
    const dataUrl = canvas.toDataURL("image/png");
    const b64 = dataUrl.split(",")[1];
    const bin = atob(b64);
    const u8 = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
    return u8;
  } finally {
    URL.revokeObjectURL(url);
  }
}

// ---- header/footer mock (preview) -----------------------------------------
function PreviewHeader({ logoUrl }) {
  return (
    <div className="page__header">
      <img src={logoUrl} alt="Berufsbildungsschule Winterthur" />
    </div>
  );
}

function PreviewFooter({ meta, pageNo = 1, pageTotal = "N" }) {
  return (
    <div className="page__footer">
      <span className="page__footer__title">{meta.titel || ""}</span>
      <span className="page__footer__pages">Seite {pageNo} / {pageTotal}</span>
    </div>
  );
}

// ---- title block (preview) ------------------------------------------------
function TitleBlock({ meta }) {
  const bits = [
    ["Kompetenz-Slug", meta.kompetenz_slug],
    ["Beruf", meta.beruf],
    ["Thema", meta.thema],
    ["Lernbereiche", meta.fach],
    ["Lehrperson", meta.autor],
    ["Stand", meta.stand],
    ["Version", meta.version],
  ].filter(([_, v]) => v);
  return (
    <div className="doc__title-block">
      <div className="eyebrow">
        {meta.kompetenz ? `Kompetenz ${meta.kompetenz}` : "Begleitdokument"}
      </div>
      <h1 style={{ margin: 0, marginBottom: 6 }}>{meta.titel || "Begleit-Dokument"}</h1>
      {meta.untertitel && (
        <div style={{ fontFamily: "var(--font-serif)", fontStyle: "italic",
                      color: "var(--bbw-ink-2)", fontSize: "12pt", marginBottom: 8 }}>
          {meta.untertitel}
        </div>
      )}
      {bits.length > 0 && (
        <div className="meta">
          {bits.map(([k, v]) => (
            <span key={k}><strong>{k}:</strong> {v}</span>
          ))}
        </div>
      )}
    </div>
  );
}

// ---- doc body --------------------------------------------------------------
function DocBody({ html }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) ref.current.innerHTML = html;
  }, [html]);
  return <div className="doc__html" ref={ref} />;
}

// ---- dropzone --------------------------------------------------------------
function Dropzone({ onFiles }) {
  const [over, setOver] = useState(false);
  const inputRef = useRef(null);
  return (
    <div
      className={"dropzone" + (over ? " is-over" : "")}
      onClick={() => inputRef.current && inputRef.current.click()}
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        const files = [...(e.dataTransfer.files || [])].filter(f => /\.(md|markdown|txt)$/i.test(f.name));
        if (files.length) onFiles(files);
      }}
    >
      <div className="dropzone__big">Markdown-Dateien ablegen</div>
      <div className="dropzone__small">.md oder .markdown · Mehrere möglich</div>
      <input
        ref={inputRef}
        type="file"
        accept=".md,.markdown,text/markdown,text/plain"
        multiple
        onChange={(e) => {
          const files = [...e.target.files].filter(f => /\.(md|markdown|txt)$/i.test(f.name));
          if (files.length) onFiles(files);
          e.target.value = "";
        }}
      />
    </div>
  );
}

// ---- main app --------------------------------------------------------------
function App() {
  const [docs, setDocs] = useState([]);          // [{id, name, raw, parsed}]
  const [activeId, setActiveId] = useState(null);
  const [override, setOverride] = useState({ autor: "", stand: "" });
  const [status, setStatus] = useState({ msg: "", kind: "" }); // kind: '', 'busy', 'error'
  const logoBufferRef = useRef(null);
  const logoUrl = "assets/bbw-logo.png";

  // Preload logo PNG for docx
  useEffect(() => {
    fetch(logoUrl)
      .then(r => r.arrayBuffer())
      .then(buf => { logoBufferRef.current = new Uint8Array(buf); })
      .catch(err => console.warn("logo preload failed:", err));
  }, []);

  // Load the markdowns/ library on first open (manifest = markdowns/index.json,
  // regenerated by `npm run md:index`).
  useEffect(() => {
    fetch("markdowns/index.json")
      .then(r => r.ok ? r.json() : null)
      .then(async (manifest) => {
        if (!manifest || !Array.isArray(manifest.files)) return;
        for (const entry of manifest.files) {
          try {
            const res = await fetch("markdowns/" + entry.file);
            if (!res.ok) continue;
            const raw = await res.text();
            addDoc(entry.file, raw);
          } catch (err) {
            console.warn("Failed to load", entry.file, err);
          }
        }
      })
      .catch(err => console.warn("markdowns/index.json not found — run `npm run md:index`", err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addDoc = useCallback((name, raw) => {
    const parsed = window.parseDocument(raw);
    const id = uid();
    setDocs(prev => [...prev, { id, name, raw, parsed }]);
    setActiveId(id);
  }, []);

  const handleFiles = useCallback(async (files) => {
    for (const file of files) {
      const raw = await file.text();
      addDoc(file.name, raw);
    }
  }, [addDoc]);

  const removeDoc = (id) => {
    setDocs(prev => prev.filter(d => d.id !== id));
    if (activeId === id) setActiveId(null);
  };

  const active = docs.find(d => d.id === activeId);

  // Merged metadata for the active doc (overrides win when non-empty)
  const mergedMeta = useMemo(() => {
    if (!active) return null;
    return {
      ...active.parsed.meta,
      autor: override.autor || active.parsed.meta.autor || "",
      stand: override.stand || active.parsed.meta.stand || "",
    };
  }, [active, override]);

  // Detect headings in the document for the "current chapter" hint
  const firstH2 = useMemo(() => {
    if (!active) return "";
    const tokens = active.parsed.tokens || [];
    const h = tokens.find(t => t.type === "heading" && t.depth === 2);
    return h ? (h.text || "").trim() : "";
  }, [active]);

  const downloadOne = async (doc) => {
    try {
      setStatus({ msg: `Erzeuge .docx für „${doc.name}" …`, kind: "busy" });
      const meta = {
        ...doc.parsed.meta,
        autor: override.autor || doc.parsed.meta.autor || "",
        stand: override.stand || doc.parsed.meta.stand || "",
      };
      const blob = await window.exportDocx(
        { meta, body: doc.parsed.body, tokens: doc.parsed.tokens },
        logoBufferRef.current
      );
      const fn = (meta.dateiname ? safeFilename(meta.dateiname) : safeFilename(doc.name)) + ".docx";
      window.saveAs(blob, fn);
      setStatus({ msg: `Heruntergeladen: ${fn}`, kind: "" });
    } catch (err) {
      console.error(err);
      setStatus({ msg: "Fehler beim Export: " + (err.message || err), kind: "error" });
    }
  };

  const downloadAll = async () => {
    if (!docs.length) return;
    try {
      setStatus({ msg: `Erzeuge ${docs.length} .docx-Dateien …`, kind: "busy" });
      const zip = new window.JSZip();
      for (const doc of docs) {
        const meta = {
          ...doc.parsed.meta,
          autor: override.autor || doc.parsed.meta.autor || "",
          stand: override.stand || doc.parsed.meta.stand || "",
        };
        const blob = await window.exportDocx(
          { meta, body: doc.parsed.body, tokens: doc.parsed.tokens },
          logoBufferRef.current
        );
        const fn = (meta.dateiname ? safeFilename(meta.dateiname) : safeFilename(doc.name)) + ".docx";
        zip.file(fn, blob);
      }
      const zipBlob = await zip.generateAsync({ type: "blob" });
      window.saveAs(zipBlob, "begleitdokumente.zip");
      setStatus({ msg: `Heruntergeladen: begleitdokumente.zip (${docs.length} Dateien)`, kind: "" });
    } catch (err) {
      console.error(err);
      setStatus({ msg: "Fehler beim Batch-Export: " + (err.message || err), kind: "error" });
    }
  };

  return (
    <>
      <div className="topbar">
        <div className="topbar__brand">
          <img src={logoUrl} alt="BBW" />
          <span><strong>HKO-Export</strong> <span className="topbar__sub">MD → Word</span></span>
        </div>
        <div className="topbar__meta">
          <span>Berufsbildungsschule Winterthur</span>
          <code>{docs.length} Datei{docs.length === 1 ? "" : "en"}</code>
        </div>
      </div>

      <div className="split">
        <div className="sidebar">
          <div className="sb-scroll">
            <div className="sb-section">
              <h3>Dateien</h3>
              <Dropzone onFiles={handleFiles} />
              {docs.length === 0 ? (
                <div className="file-empty">
                  Noch keine Datei.<br />
                  .md in <code>begleiter/markdowns/</code> ablegen und{" "}
                  <code>npm run md:index</code> ausführen — oder hier ablegen.
                </div>
              ) : (
                <div className="form-row" style={{ display: "flex", gap: 6, alignItems: "stretch", marginTop: 10 }}>
                  <select
                    value={activeId || ""}
                    onChange={(e) => setActiveId(e.target.value)}
                    style={{ flex: 1, minWidth: 0 }}
                  >
                    {!activeId && <option value="">— Datei wählen —</option>}
                    {docs.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="file-item__remove"
                    onClick={() => active && removeDoc(active.id)}
                    title="Aktive Datei aus Liste entfernen (Datei selbst bleibt im Ordner)"
                    disabled={!active}
                    style={{ flex: "0 0 auto", padding: "0 10px" }}
                  >×</button>
                </div>
              )}
            </div>

            <div className="sb-section">
              <h3>Metadaten überschreiben</h3>
              <div className="form-row">
                <label>Lehrperson (Autor:in)</label>
                <input
                  type="text"
                  placeholder={active?.parsed.meta.autor || "z.B. Maria Muster"}
                  value={override.autor}
                  onChange={(e) => setOverride({ ...override, autor: e.target.value })}
                />
              </div>
              <div className="form-row">
                <label>Stand (Datum)</label>
                <input
                  type="text"
                  placeholder={active?.parsed.meta.stand || "2026-05-22"}
                  value={override.stand}
                  onChange={(e) => setOverride({ ...override, stand: e.target.value })}
                />
              </div>
              <div className="form-hint">
                Leer lassen → Werte aus dem Frontmatter der MD werden verwendet.
                Überschreibungen gelten für alle Dateien im Stapel.
              </div>
            </div>

            <div className="sb-section">
              <h3>Erkannte Metadaten</h3>
              {active ? (
                <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
                  <tbody>
                    {Object.entries(active.parsed.meta).length === 0 && (
                      <tr><td style={{ color: "var(--bbw-muted)", fontStyle: "italic" }}>
                        Kein YAML-Frontmatter gefunden.
                      </td></tr>
                    )}
                    {Object.entries(active.parsed.meta).map(([k, v]) => (
                      <tr key={k}>
                        <td style={{ color: "var(--bbw-muted)", padding: "3px 6px 3px 0", verticalAlign: "top" }}>{k}</td>
                        <td style={{ color: "var(--bbw-ink)", padding: "3px 0", wordBreak: "break-word" }}>{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div style={{ fontSize: 12, color: "var(--bbw-muted)", fontStyle: "italic" }}>
                  Wähle eine Datei links.
                </div>
              )}
            </div>

            <div className="sb-section">
              <h3>Format-Spezifikation</h3>
              <div className="form-hint" style={{ marginBottom: 8 }}>
                Lade die Spec herunter und gib sie an deinen MD-Generator-Skill,
                damit die Ausgabe direkt zum Tool passt.
              </div>
              <a className="btn btn--block" href="MD-FORMAT-SPEC.md" download="MD-FORMAT-SPEC.md">
                📄 MD-FORMAT-SPEC.md
              </a>
            </div>
          </div>

          <div className="sb-section sb-fixed">
            <div className="button-stack">
              <button
                className="btn btn--primary btn--block"
                disabled={!active}
                onClick={() => active && downloadOne(active)}
              >
                ↓ Als .docx exportieren
              </button>
              <button
                className="btn btn--block"
                disabled={docs.length === 0}
                onClick={downloadAll}
              >
                ↓ Alle ({docs.length}) als ZIP
              </button>
              {status.msg && (
                <div className={"status" + (status.kind ? " is-" + status.kind : "")}>
                  {status.msg}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="preview-pane">
          <div className="preview-pane__inner">
          {!active && (
            <div className="preview-empty">
              <h2>Vorschau erscheint hier</h2>
              <p>Lege eine oder mehrere Markdown-Dateien links ab.</p>
              <p>Die Vorschau zeigt das Layout (A4, Kopf-/Fusszeile, Stil), wie es im Word-Export erscheint. Klicke <strong>„Als .docx"</strong>, um die Datei herunterzuladen.</p>
            </div>
          )}
          {active && mergedMeta && (
            <div className="page">
              <PreviewHeader logoUrl={logoUrl} />
              <div className="doc">
                <TitleBlock meta={mergedMeta} />
                <DocBody html={active.parsed.html} />
              </div>
              <PreviewFooter meta={mergedMeta} />
            </div>
          )}
          </div>
        </div>
      </div>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
