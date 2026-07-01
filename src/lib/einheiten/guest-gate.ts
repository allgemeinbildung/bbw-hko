// Kleine, eigenständige HTML-Gate-Seite für die Gast-Rolle.
// Wird von den Direkt-Routen (begleiter, ki-liesmich) zurückgegeben, damit ein Gast,
// der die URL direkt aufruft, dieselbe Meldung sieht wie im Workbench: der Bereich ist
// nur für Lehrpersonen; Zugang gibt es per Mail an pietro.rossi@bbw.ch.

const GATE_MAIL = 'pietro.rossi@bbw.ch'

export function guestGateHtml(setKey: string, bereich: string): string {
  const subject = encodeURIComponent('Lehrpersonen-Zugang zur ABU-Materialplattform BBW')
  const body = encodeURIComponent(
    'Guten Tag Pietro\n\nIch möchte als Lehrperson vollen Zugang zur ABU-Materialplattform (bbw-hko.ch) erhalten.\n\nName:\nSchule / Abteilung:\nLehrpersonen-E-Mail:\n\nBesten Dank und freundliche Grüsse',
  )
  return `<!DOCTYPE html>
<html lang="de-CH">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${bereich} — nur für Lehrpersonen</title>
<style>
  :root { --brand:#0E6E3A; --brand-dark:#094d28; --ink:#0f172a; --muted:#475569; --line:#e2e8f0; }
  * { box-sizing: border-box; }
  body { margin:0; min-height:100vh; display:flex; align-items:center; justify-content:center;
    background:#f6f7f8; color:var(--ink); padding:24px;
    font-family:'IBM Plex Sans',system-ui,-apple-system,Segoe UI,Roboto,sans-serif; }
  .card { max-width:520px; width:100%; background:#fff; border:1px solid var(--line);
    border-top:4px solid var(--brand); border-radius:14px; padding:40px 36px; text-align:center;
    box-shadow:0 4px 20px rgba(0,0,0,0.06); }
  .lock { font-size:40px; line-height:1; margin-bottom:14px; }
  h1 { font-size:20px; margin:0 0 14px; color:var(--brand-dark); }
  p { font-size:14px; line-height:1.55; color:var(--muted); margin:0 0 12px; }
  a.mail { color:var(--brand); font-weight:600; }
  .cta { display:inline-block; margin-top:8px; background:var(--brand); color:#fff; text-decoration:none;
    padding:11px 22px; border-radius:10px; font-size:14px; font-weight:700; }
  .cta:hover { background:var(--brand-dark); }
  .back { display:block; margin-top:18px; font-size:13px; color:var(--muted); text-decoration:none; }
  .back:hover { color:var(--ink); }
</style>
</head>
<body>
  <main class="card">
    <div class="lock" aria-hidden="true">🔒</div>
    <h1>${bereich} — nur für Lehrpersonen</h1>
    <p>Dieser Bereich ist angemeldeten Lehrpersonen vorbehalten. In der Gast-Ansicht sind die
    Herausforderungen sowie Austausch &amp; Transfer zugänglich; Kompetenznachweise und das
    Begleitdokument sind nicht öffentlich.</p>
    <p>Wer vollen Zugriff möchte, schreibt eine E-Mail von einer <strong>Lehrpersonen-Adresse</strong>
    an <a class="mail" href="mailto:${GATE_MAIL}">${GATE_MAIL}</a>.</p>
    <a class="cta" href="mailto:${GATE_MAIL}?subject=${subject}&body=${body}">✉ Zugang anfragen</a>
    <a class="back" href="/einheiten/${setKey}">← Zurück zur Einheit</a>
  </main>
</body>
</html>`
}
