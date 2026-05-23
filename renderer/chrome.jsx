/* chrome.jsx — shared page chrome (header, footer, helpers) */
/* globals React */

const { useState, useEffect, useRef, useMemo, Fragment } = React;

const ABTEILUNGEN = [
  "",
  "Abteilung Bau",
  "Abteilung Technik | Ernaehrung",
  "Abteilung Maschinenbau",
  "Abteilung Informatik | Naturwissenschaften",
];

const DOC_LABELS = {
  "doc-s": "DOC-S Situationsheft",
  "doc-kn-s": "DOC-KN-S Schueler",
  "doc-kn-lp": "DOC-KN-LP Lehrperson",
};

// ContentEditable wrapper that doesn't reset cursor on every render
function CE({ tag = 'span', className, value, onChange, multiline = false, ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current && ref.current.innerText !== value) {
      ref.current.innerText = value || '';
    }
  }, [value]);
  const Tag = tag;
  const handleInput = (e) => {
    if (onChange) onChange(e.currentTarget.innerText);
  };
  const handleKey = (e) => {
    if (!multiline && e.key === 'Enter') { e.preventDefault(); e.currentTarget.blur(); }
  };
  return (
    <Tag
      ref={ref}
      className={className}
      contentEditable
      suppressContentEditableWarning
      onInput={handleInput}
      onKeyDown={handleKey}
      spellCheck={false}
      {...rest}
    />
  );
}

// Page wrapper with header + footer
function A4Page({ children, sit, abteilung, docCode, docTitel, sitLetter, pageNum, pageTotal, kompetenzNr }) {
  const sitClass = sit ? `sit-${sit}` : 'sit-neutral';
  return (
    <article className={`a4-page ${sitClass}`}>
      <div className="sit-strip" />
      <header className="page-head">
        <div className="page-head-left">
          <img className="page-head-logo" src="assets/logo-bbw.png" alt="" />
          {abteilung && (
            <div className="page-head-meta">
              <div className="abt">{abteilung}</div>
            </div>
          )}
        </div>
        <div className="page-head-right">
          {kompetenzNr && <div className="doc-kompetenz">KOMP {kompetenzNr}</div>}
          <div className="doc-code">{docCode}</div>
        </div>
      </header>
      {children}
      <footer className="page-foot">
        <div className="foot-titel">{docTitel}</div>
        <div>
          {sitLetter && <span className="foot-sit">SIT {sitLetter} · </span>}
          <span>{pageNum} / {pageTotal}</span>
        </div>
      </footer>
    </article>
  );
}

// Apply situation colors as inline CSS vars on a page
function sitColors(situation) {
  if (!situation) {
    return {
      '--sit-akzent': '#2C3E50',
      '--sit-light':  '#ECF0F1',
      '--sit-mid':    '#7F8C8D',
    };
  }
  return {
    '--sit-akzent': situation.sit_farbe,
    '--sit-light':  situation.sit_farbe_light,
    '--sit-mid':    situation.sit_farbe_mid,
  };
}

function Badge({ children, variant = '', ...rest }) {
  return <span className={`badge ${variant}`} {...rest}>{children}</span>;
}

function SectionHead({ num, children }) {
  return (
    <div className="section-head">
      <div className="section-num">{num}</div>
      <h2 className="section-title">{children}</h2>
      <div className="section-rule" />
    </div>
  );
}

// Schreibfeld: dual-mode editable field with writing lines
function Schreibfeld({ heightMm = 15, value = '', onChange, placeholder = '' }) {
  // compute min rows from height in mm
  const minRows = Math.max(3, Math.ceil(heightMm / 8.5) + 2);
  const minHeight = `calc(8.5mm * ${minRows})`;
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current && ref.current.innerText !== value) {
      ref.current.innerText = value || '';
    }
  }, [value]);
  return (
    <div
      ref={ref}
      className="feld"
      style={{ minHeight }}
      contentEditable
      suppressContentEditableWarning
      data-placeholder={placeholder}
      onInput={(e) => onChange && onChange(e.currentTarget.innerText)}
      spellCheck={false}
    />
  );
}

// Skizzen-Flaeche (Handlungsprodukt schreib-flaeche)
function HandlungsFlaeche({ label, value, onChange }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current && ref.current.innerText !== value) {
      ref.current.innerText = value || '';
    }
  }, [value]);
  return (
    <div className="hp-flaeche-wrap" style={{ position: 'relative' }}>
      <div
        ref={ref}
        className="hp-flaeche"
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => onChange && onChange(e.currentTarget.innerText)}
        spellCheck={false}
      />
      <div className="hp-flaeche-label">{label}</div>
    </div>
  );
}

Object.assign(window, {
  CE, A4Page, sitColors, Badge, SectionHead, Schreibfeld, HandlungsFlaeche,
  ABTEILUNGEN, DOC_LABELS,
});
