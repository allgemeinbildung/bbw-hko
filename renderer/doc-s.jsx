/* doc-s.jsx — Schueler-Situationsheft */
/* info mode = 4 compact pages (no input affordances) */
/* fill mode = 8 generous pages (writing fields with lines) */
/* globals React, A4Page, sitColors, Badge, SectionHead, Schreibfeld, HandlungsFlaeche */

// ─────────────────────────────────────────────────────────────────────────────
//  REUSABLE CONTENT BLOCKS
// ─────────────────────────────────────────────────────────────────────────────

function CockpitHead({ sit }) {
  return (
    <>
      <div className="badge-row" style={{ marginBottom: '2.5mm' }}>
        <Badge variant="outline">Kompetenz {sit.nrlp?.nr}</Badge>
        <Badge>Situation {sit.situation} · {sit.emotion_tag}</Badge>
      </div>
      <h1 className="cockpit-title">{sit.titel}</h1>
      <p className="cockpit-sub">{sit.modul_titel}</p>
      <div className="badge-row" style={{ marginBottom: '3mm' }}>
        <span className="subfacette">Subfacette {sit.sub_facette?.buchstabe} — {sit.sub_facette?.label}</span>
      </div>
    </>
  );
}

function CockpitCards({ sit }) {
  return (
    <div className="cockpit-grid">
      <div className="cockpit-card">
        <h4>Persona</h4>
        <div className="big">{sit.persona?.beruf}</div>
        <p style={{ margin: '1mm 0 0', fontSize: '9pt', color: 'var(--ink-soft)' }}>
          {sit.persona?.betrieb}, {sit.persona?.ort}
        </p>
      </div>
      <div className="cockpit-card">
        <h4>Handlungsprodukt</h4>
        <div className="big">{sit.handlungsprodukt?.format}</div>
        <p style={{ margin: '1mm 0 0', fontSize: '9pt', color: 'var(--ink-soft)' }}>
          {sit.handlungsprodukt?.titel}
        </p>
      </div>
    </div>
  );
}

function MiniTableLabel({ children }) {
  return (
    <h4 style={{
      fontSize: '8pt', fontWeight: 600,
      letterSpacing: '0.06em', textTransform: 'uppercase',
      color: 'var(--sit-akzent)', marginBottom: '2mm'
    }}>{children}</h4>
  );
}

function WochenPlanTable({ sit }) {
  if (!sit.wochen_plan) return null;
  const cleanLabel = (l) => (l || '').replace(/^Woche\s+\d+\s*[-\u2013\u2014]\s*/i, '').trim();
  return (
    <section style={{ marginTop: '4mm' }}>
      <MiniTableLabel>Wochenplan</MiniTableLabel>
      <table className="cockpit-table">
        <thead><tr><th style={{ width: '26mm' }}>Dauer</th><th>Inhalt</th></tr></thead>
        <tbody>
          {sit.wochen_plan.map((w, i) => (
            <tr key={i}><td className="num">{cleanLabel(w.label) || w.label}</td><td>{w.text}</td></tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function BewertungsRasterTable({ sit }) {
  if (!sit.bewertungsraster) return null;
  const total = sit.bewertungsraster.reduce((s, r) => s + (r.gewicht || 0), 0);
  return (
    <section style={{ marginTop: '3mm' }}>
      <MiniTableLabel>Bewertungsraster · Total {total}%</MiniTableLabel>
      <table className="cockpit-table">
        <thead>
          <tr>
            <th style={{ width: '34mm' }}>Produkt</th>
            <th style={{ width: '46mm' }}>Abgabe</th>
            <th style={{ width: '14mm' }}>Gewicht</th>
            <th>Kriterium</th>
          </tr>
        </thead>
        <tbody>
          {sit.bewertungsraster.map((b, i) => (
            <tr key={i}>
              <td><strong>{b.produkt}</strong></td>
              <td>{b.abgabe}</td>
              <td className="num">{b.gewicht}%</td>
              <td>{b.kriterium}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function QuellenList({ sit }) {
  if (!sit.quellen_anker) return null;
  return (
    <section style={{ marginTop: '3mm' }}>
      <MiniTableLabel>Quellen</MiniTableLabel>
      <ul style={{ margin: 0, paddingLeft: '4mm', fontSize: '8.5pt', lineHeight: 1.45 }}>
        {sit.quellen_anker.map((q, i) => (
          <li key={i} style={{ marginBottom: '0.5mm' }}>
            <span className="source-ref"><strong>{q.ref}</strong></span> · {q.titel}{' '}
            <span style={{ color: 'var(--ink-mute)' }}>· {q.seiten}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function SituationBlock({ sit }) {
  return (
    <>
      <div className="sit-meta">
        <div className="item"><strong>Beruf</strong>{sit.persona?.beruf}</div>
        <div className="item"><strong>Betrieb</strong>{sit.persona?.betrieb}</div>
        <div className="item"><strong>Ort</strong>{sit.persona?.ort}</div>
        <div className="item"><strong>Emotion</strong>{sit.emotion_tag}</div>
      </div>
      <p className="sit-text">{sit.situation_text}</p>
      {sit.zahlen_tabelle && (
        <table className="zahlen-tabelle">
          <tbody>
            {sit.zahlen_tabelle.map((z, i) => (
              <tr key={i}>
                <td>{z.label}</td>
                <td className="wert">{z.wert}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="leitfrage-callout">{sit.leitfrage}</div>
      {sit.mehrdeutigkeit?.explizit && sit.mehrdeutigkeit.trade_off && (
        <div className="tradeoff-callout">{sit.mehrdeutigkeit.trade_off}</div>
      )}
    </>
  );
}

function LeitfrageItem({ lf, withField, edits, onEdit, fieldHeightMm }) {
  return (
    <div className="lf-item">
      <div className="lf-head">
        <div className="lf-nr">LF{lf.nr}</div>
        <div className="lf-text">
          <p>{lf.text}</p>
          <div className="lf-meta">
            <Badge variant="outline">{lf.bloom}</Badge>
            <span className="source-ref">{lf.knoten_ref}</span>
          </div>
        </div>
      </div>
      {withField && (
        <Schreibfeld
          heightMm={fieldHeightMm || lf.feld_hoehe_mm || 15}
          value={edits[`lf_${lf.nr}`] || ''}
          onChange={(v) => onEdit(`lf_${lf.nr}`, v)}
        />
      )}
    </div>
  );
}

function ReflexionItem({ rf, withField, edits, onEdit, fieldHeightMm }) {
  return (
    <div className="rf-item">
      <div className="lf-head">
        <div className="lf-nr">{rf.nr}</div>
        <div className="lf-text">
          <p>{rf.text}</p>
          {rf.sub && <p style={{ color: 'var(--ink-mute)', fontSize: '9.5pt' }}>{rf.sub}</p>}
        </div>
      </div>
      {withField && (
        <Schreibfeld
          heightMm={fieldHeightMm || rf.feld_hoehe_mm || 10}
          value={edits[`rf_${rf.nr}`] || ''}
          onChange={(v) => onEdit(`rf_${rf.nr}`, v)}
        />
      )}
    </div>
  );
}

function MindmapFull({ sit }) {
  return (
    <div className="mindmap">
      <div className="mindmap-zentrum">{sit.mindmap_zentrum}</div>
      <div className="mindmap-voll">
        {sit.mindmap_aeste?.map((ast, i) => (
          <div className="mindmap-ast" key={i}>
            <h4>
              {ast.titel}
              {ast.optional && <span className="opt"> · optional</span>}
            </h4>
            <ul>
              {ast.punkte?.map((p, j) => <li key={j}>{p}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function MindmapSkelett({ sit }) {
  return (
    <div className="mindmap">
      <p style={{ fontSize: '8pt', color: 'var(--ink-mute)', marginBottom: '3mm', fontStyle: 'italic' }}>
        Skizziere deine Mindmap auf der Flaeche. Zentrum und Ast-Titel sind als Anker gesetzt; die Detail-Punkte arbeitest du selbst aus.
      </p>
      <div className="mindmap-skelett" style={{ minHeight: '180mm' }}>
        <div className="zentrum-skelett">
          <div className="mindmap-zentrum">{sit.mindmap_zentrum}</div>
        </div>
        <div className="aeste-skelett">
          {sit.mindmap_aeste?.map((ast, i) => (
            <div className={`ast-skelett ${ast.optional ? 'optional' : ''}`} key={i}>
              {ast.titel}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HandlungsproduktIntro({ sit }) {
  const hp = sit.handlungsprodukt;
  return (
    <>
      <div className="badge-row" style={{ marginBottom: '4mm' }}>
        <Badge variant="outline">{hp.format}</Badge>
      </div>
      <p className="hp-intro">{hp.beschreibung}</p>
      {hp.schritte && (
        <ol className="hp-schritte">
          {hp.schritte.map((s, i) => (
            <li key={i}>
              <div className="hp-schritt-label">{s.label}</div>
              <div className="hp-schritt-hint">{s.hint}</div>
            </li>
          ))}
        </ol>
      )}
    </>
  );
}

function AustauschBlock({ set, sit }) {
  const ap = set?.austausch_phase;
  const da = set?.dekontextualisierungs_aufgabe;
  if (!ap && !da) return null;
  return (
    <div className="austausch-grid">
      {ap && (
        <>
          <div className="austausch-label">Austausch · {ap.format} · {ap.dauer_min} min</div>
          <div className="austausch-text">
            <div className="runden">
              {ap.gruppenarbeit_jigsaw?.runde_1 && (
                <div className="runden-item"><span className="nr">Runde 1</span><span>{ap.gruppenarbeit_jigsaw.runde_1}</span></div>
              )}
              {ap.gruppenarbeit_jigsaw?.runde_2 && (
                <div className="runden-item"><span className="nr">Runde 2</span><span>{ap.gruppenarbeit_jigsaw.runde_2}</span></div>
              )}
              {ap.gruppenarbeit_jigsaw?.runde_3 && (
                <div className="runden-item"><span className="nr">Runde 3</span><span>{ap.gruppenarbeit_jigsaw.runde_3}</span></div>
              )}
            </div>
          </div>
          <div className="austausch-label">Plenum</div>
          <div className="austausch-text">{ap.einzelarbeit_plenum}</div>
        </>
      )}
      {da && (
        <>
          <div className="austausch-label">Dekontextualisierung</div>
          <div className="austausch-text">
            <p style={{ fontWeight: 500, margin: '0 0 1mm' }}>{da.auftrag}</p>
            <p style={{ fontSize: '8.5pt', color: 'var(--ink-soft)', margin: 0 }}>
              <strong>Format:</strong> {da.format} · <strong>Gewicht:</strong> {da.gewicht_prozent}% · <strong>Abgabe:</strong> {da.abgabe}
            </p>
            {sit.dekontextualisierung?.frage && (
              <p style={{ marginTop: '2mm', margin: '2mm 0 0' }}>
                <strong style={{ color: 'var(--sit-akzent)' }}>Leitend:</strong> {sit.dekontextualisierung.frage}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  PAGE WRAPPER (closure over common props)
// ─────────────────────────────────────────────────────────────────────────────

function makePage(common) {
  return ({ pageNum, pageTotal, children }) => (
    <A4Page
      sit={common.sit.situation}
      abteilung={common.abteilung}
      docCode={`DOC-S · SIT ${common.sit.situation} · ${common.mode === 'info' ? 'DOSSIER' : 'AUFTRAG'}`}
      docTitel={common.sit.titel}
      sitLetter={common.sit.situation}
      pageNum={pageNum}
      pageTotal={pageTotal}
      kompetenzNr={common.sit.nrlp?.nr}
    >
      <div className="a4-page-body">{children}</div>
    </A4Page>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  INFO MODE — 4 compact pages
// ─────────────────────────────────────────────────────────────────────────────

function DocSInfo({ sit, set, abteilung, mode }) {
  const Page = makePage({ sit, abteilung, mode });
  const total = 4;
  return (
    <div style={sitColors(sit)}>
      {/* Page 1 — Cockpit */}
      <Page pageNum={1} pageTotal={total}>
        <CockpitHead sit={sit} />
        <CockpitCards sit={sit} />
        <WochenPlanTable sit={sit} />
        <BewertungsRasterTable sit={sit} />
        <QuellenList sit={sit} />
      </Page>

      {/* Page 2 — Situation + Leitfragen */}
      <Page pageNum={2} pageTotal={total}>
        <SectionHead num="02 · Situation">{sit.titel}</SectionHead>
        <SituationBlock sit={sit} />

        <SectionHead num="03 · Wissensecke">Leitfragen</SectionHead>
        {sit.leitfragen_intro && (
          <p style={{ fontSize: '9pt', color: 'var(--ink-soft)', maxWidth: '160mm', marginBottom: '3mm' }}>
            {sit.leitfragen_intro}
          </p>
        )}
        {sit.leitfragen?.map((lf, i) => (
          <LeitfrageItem key={i} lf={lf} withField={false} />
        ))}
      </Page>

      {/* Page 3 — Mindmap + Handlungsprodukt */}
      <Page pageNum={3} pageTotal={total}>
        <SectionHead num="04 · Mindmap">{sit.mindmap_zentrum}</SectionHead>
        <MindmapFull sit={sit} />

        <SectionHead num="05 · Handlungsprodukt">{sit.handlungsprodukt?.titel}</SectionHead>
        <HandlungsproduktIntro sit={sit} />
      </Page>

      {/* Page 4 — Reflexion + Austausch */}
      <Page pageNum={4} pageTotal={total}>
        <SectionHead num="06 · Selbstcheck">Reflexion</SectionHead>
        {sit.reflexion_fragen?.map((rf, i) => (
          <ReflexionItem key={i} rf={rf} withField={false} />
        ))}

        <SectionHead num="07 · Austausch &amp; Transfer">Austausch &amp; Dekontextualisierung</SectionHead>
        <AustauschBlock set={set} sit={sit} />
      </Page>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  FILL MODE — 8 generous pages
// ─────────────────────────────────────────────────────────────────────────────

function DocSFill({ sit, set, abteilung, mode, edits, onEdit }) {
  const Page = makePage({ sit, abteilung, mode });
  const total = 8;
  const lf = sit.leitfragen || [];

  // Split leitfragen into pairs (handles 3-6 questions)
  const lfPairs = [];
  for (let i = 0; i < lf.length; i += 2) lfPairs.push(lf.slice(i, i + 2));

  let pageIdx = 0;
  const nextPage = () => ++pageIdx;
  // We claim: cockpit + situation + N LF-pages + mindmap + hp + reflexion + austausch
  // For default 4 LF -> 2 LF pages -> 8 total. If more LF, pages auto-expand.
  const actualTotal = 6 + lfPairs.length;

  return (
    <div style={sitColors(sit)}>
      {/* Page 1 — Cockpit */}
      <Page pageNum={nextPage()} pageTotal={actualTotal}>
        <CockpitHead sit={sit} />
        <CockpitCards sit={sit} />
        <WochenPlanTable sit={sit} />
        <BewertungsRasterTable sit={sit} />
        <QuellenList sit={sit} />
      </Page>

      {/* Page 2 — Situation */}
      <Page pageNum={nextPage()} pageTotal={actualTotal}>
        <SectionHead num="02 · Situation">{sit.titel}</SectionHead>
        <SituationBlock sit={sit} />
      </Page>

      {/* Pages 3..N — Leitfragen (2 per page with big fields) */}
      {lfPairs.map((pair, pi) => (
        <Page key={`lfp-${pi}`} pageNum={nextPage()} pageTotal={actualTotal}>
          {pi === 0 ? (
            <>
              <SectionHead num="03 · Wissensecke">Leitfragen</SectionHead>
              {sit.leitfragen_intro && (
                <p style={{ fontSize: '10pt', color: 'var(--ink-soft)', maxWidth: '160mm', marginBottom: '5mm' }}>
                  {sit.leitfragen_intro}
                </p>
              )}
            </>
          ) : (
            <SectionHead num={`03 · Wissensecke (${pi + 1})`}>Leitfragen (Fortsetzung)</SectionHead>
          )}
          {pair.map((q, i) => (
            <LeitfrageItem
              key={i}
              lf={q}
              withField={true}
              edits={edits}
              onEdit={onEdit}
              fieldHeightMm={55}
            />
          ))}
        </Page>
      ))}

      {/* Page — Mindmap (skelett, full canvas) */}
      <Page pageNum={nextPage()} pageTotal={actualTotal}>
        <SectionHead num="04 · Mindmap">{sit.mindmap_zentrum}</SectionHead>
        <MindmapSkelett sit={sit} />
      </Page>

      {/* Page — Handlungsprodukt */}
      <Page pageNum={nextPage()} pageTotal={actualTotal}>
        <SectionHead num="05 · Handlungsprodukt">{sit.handlungsprodukt?.titel}</SectionHead>
        <HandlungsproduktIntro sit={sit} />
        <HandlungsFlaeche
          label={sit.handlungsprodukt?.schreib_label || 'HIER ERARBEITEN'}
          value={edits.handlungsprodukt || ''}
          onChange={(v) => onEdit('handlungsprodukt', v)}
        />
      </Page>

      {/* Page — Reflexion */}
      <Page pageNum={nextPage()} pageTotal={actualTotal}>
        <SectionHead num="06 · Selbstcheck">Reflexion</SectionHead>
        {sit.reflexion_fragen?.map((rf, i) => (
          <ReflexionItem
            key={i}
            rf={rf}
            withField={true}
            edits={edits}
            onEdit={onEdit}
            fieldHeightMm={35}
          />
        ))}
      </Page>

      {/* Page — Austausch + Dekontextualisierung */}
      <Page pageNum={nextPage()} pageTotal={actualTotal}>
        <SectionHead num="07 · Austausch &amp; Transfer">Austausch &amp; Dekontextualisierung</SectionHead>
        <AustauschBlock set={set} sit={sit} />
        <p style={{
          fontSize: '8.5pt', color: 'var(--ink-mute)',
          marginTop: '4mm', marginBottom: '2mm',
          textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600,
        }}>
          Dein Transfer (5–7 Saetze)
        </p>
        <Schreibfeld
          heightMm={55}
          value={edits.dekontext || ''}
          onChange={(v) => onEdit('dekontext', v)}
        />
      </Page>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function DocS(props) {
  if (props.mode === 'info') return <DocSInfo {...props} />;
  return <DocSFill {...props} />;
}

Object.assign(window, { DocS });
