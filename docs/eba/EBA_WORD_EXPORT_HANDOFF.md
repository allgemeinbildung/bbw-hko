# Handoff — EBA Word-Export (`.docx`) aufbauen

**Für:** die nächste Claude-Code-Session (Dev-Env mit Terminal + Build).
**Repo:** `bbw-hko` · **Stand:** 2026-06-17 · **Sprache aller sichtbaren Strings:** Swiss Standard German,
**kein ß** (→ ss), **echte Umlaute** ä/ö/ü, ae/oe/ue nur in IDs/Keys. UTF-8.

---

## 0. Ziel in einem Satz

Die **EBA-Glossar+-Einheit** (Dossier) soll im Workbench-ZIP zusätzlich als **Word-`.docx`** vorliegen —
genau wie die übrigen Dokumente — gerendert über eine neue Funktion `buildDossier()` in
`src/lib/einheiten/docx-builder.ts`, feldgleich zur React-Komponente `DocEbaDossier.tsx`.

---

## 1. Ausgangslage (gelesen, bestätigt)

Der Word-Export läuft **client-seitig** im React-Island `EinheitWorkbench.tsx`: pro Dokument wird HTML
(zum Drucken) **und** `.docx` (über `docx-builder.ts`) ins ZIP gelegt. `docToBlob(doc)` (Packer) macht
am Ende das Blob.

**Wichtig — was bereits funktioniert:** Die ZIP-Schleife ruft `buildDocS`, `buildAustausch`, `buildKnS`,
`buildKnLp` und den Begleiter-Builder **lehrgang-unabhängig** auf. Eine EBA-Einheit (`lehrgang:
"EBA_2J"`, nur hf_A/B) bekommt also **heute schon** `.docx` für DocS (A/B), Austausch, KN-S, KN-LP und
Begleiter — nur im **EFZ-Word-Stil** (keine EBA-Typografie; das ist akzeptiert, siehe §6).

**Was fehlt:** **nur das Glossar+ (`dossier.json`)** hat keinen Word-Builder. Im Workbench wird es aktuell
**HTML-only** ins ZIP gelegt:

```tsx
// src/components/einheiten/EinheitWorkbench.tsx — handleBundle(), nach dem Austausch-Block:
if (d.dossier) {
  const markup = renderToStaticMarkup(<DocEbaDossier dossier={d.dossier} abteilung={abteilung} kompetenzNr={d.kn?.kompetenz_nr} />)
  const filename = `${prefix}_doc-dossier.html`
  zip.file(`html/${filename}`, wrap('Glossar+ (EBA) · Nachschlagen & Lernen', markup))
  log.push(`html/${filename}`)
}
```

→ **Diese Session: `buildDossier()` schreiben und hier ein `word/…docx` daneben legen.**

---

## 2. Renderer-Vertrag = Soll-Inhalt (feldgleich zu `DocEbaDossier.tsx`)

Der `.docx` muss **dieselben Seiten in derselben Reihenfolge** zeigen wie die React-Komponente
(`src/components/einheiten/docs/DocEbaDossier.tsx` — das ist die verbindliche Soll-Vorlage):

1. **Titelseite** (`dossier.kopf` + `dossier.einleitung`)
   - Kicker „Glossar+ · EBA", grosser Titel `kopf.einheit_titel`, darunter `kopf.kompetenz_text`.
   - Meta-Block: Thema (`kopf.thema_nr`/`thema_titel`), Lebensbezug (`kopf.lebensbezug_nr`/`text`),
     Kompetenz (`kopf.kompetenz_nr`), „EBA (2 Jahre) · Niveau A2".
   - Einleitung: „Was ist das Glossar+?" (`einleitung.was_ist_das`) + „So benutzt du es"
     (`einleitung.so_benutzt_du_es[]` als Liste mit grünem Haken).
2. **Wissen — EIN Nugget pro Seite** (`dossier.nuggets[]`, sortiert A → B → rest). Pro Nugget:
   - Anker-Code (`nugget_A_01` → „A-01") + `titel`, dann `inhalt`, dann `beispiel` (Box).
   - **Recherche-Strip** (`nugget.recherche`):
     - 🔎 **Suchen Sie online:** `suchbegriffe[]` (Liste)
     - 🤖 **So fragen Sie die KI:** `ki_beispiel.so_fragst_du`, dann `ki_beispiel.prompt` (Prompt-Box),
       dann `ki_beispiel.tipp`, dann fix „Pruefen Sie die Antwort an einer sicheren Quelle."
     - 📚 **So lernen Sie mit KI:** `ki_lernen[]` je `{strategie}: «{prompt}»`
     - ✏ **Selbst pruefen:** `selbst_pruefen` + **Schreiblinien darunter** (3 Linien)
3. **Sprachhilfe** — je `sprachmodi_scaffolds[]` eine Seite (`satzanfaenge`, `so_gehst_du_vor` als
   nummerierte Schritte).
4. **Grundprinzip** — `transfer_wissensblatt` (`prinzip_in_einfach`, `fachsystematik`,
   `austausch_scaffolds.satzanfaenge`).
5. **Glossar** — `glossar[]` (`begriff` — `erklaerung_a2`; opt. `beispiel`), zweispaltig wenn möglich,
   sonst einfache Liste.
6. **Notizen** — leere Seite „Meine Notizen" mit Schreiblinien (kein Daten-Input).

Typdefinitionen: `DossierJson`, `DossierKopf`, `DossierEinleitung`, `DossierRecherche`,
`DossierKiBeispiel`, `DossierKiLernen`, `DossierNugget`, `DossierScaffold`, `DossierTransfer`,
`DossierGlossarEntry` — **alle in `DocEbaDossier.tsx` exportiert**. `buildDossier()` importiert sie von
dort (oder spiegelt sie lokal, tolerant mit `?`).

---

## 3. Wiederverwendbare Helfer in `docx-builder.ts` (nicht neu erfinden)

Die Datei hat bereits genau die Bausteine, die das Glossar+ braucht:

| Helfer | Zweck | Im Glossar+ für |
|---|---|---|
| `sectionProps(docCode, docTitel, abteilung, logoPng)` | A4-Section + Header/Footer/Logo | jede Seite |
| `h(text, 'title'|'section'|'sub'|'meta', color)` | Überschriften | Titel, Section-Köpfe |
| `sectionHead(num, title, akzent)` | nummerierter Section-Kopf (D1/D2/D3/N) | Seiten-Köpfe |
| `p(text, opts)` | Absatz mit Run/Spacing/Border | Fliesstext, Listen |
| `promptBox(text)` | grau hinterlegte Box | **KI-Prompt** (`ki_beispiel.prompt`) |
| `schreibfeld(heightMm, color)` | linierte Schreibfläche | **Selbst-pruefen-Linien** + **Notizen-Seite** |
| `dataTable(headers, rows, akzent, colWidths)` | Tabelle | Meta-Block / Glossar zweispaltig (optional) |
| `callout(label, text, akzent, light)` | farbiger Kasten | Beispiel-Box / Integritäts-Hinweis |
| `microLabel(text, akzent)` | kleines Label | „Suchen Sie online" etc. |
| `spacer()`, `pageBreak()` | Abstand / Seitenumbruch | zwischen Seiten |
| `docToBlob(doc)` | Document → Blob | im Workbench |

**Konstanten:** `COLOR.*` (Hex ohne `#`), `A4_W/A4_H`, `MM`. **BBW-Grün** als Akzent verwenden:
`0E6E3A` (dunkel `094D28`, Tint `E8F3EC`) — in `docx-builder` als lokale Konstante ergänzen (die
`COLOR`-Map hat aktuell nur neutrale/Status-Farben).

**Document-Muster** (wie `buildAustausch` am Ende):

```ts
return new Document({
  creator: 'HKO Renderer',
  title: docTitel,
  description: docCode,
  sections: [{ ...sectionProps(docCode, docTitel, abteilung, logoPng), children }],
})
```

Für eine **Seite pro Nugget** entweder mehrere `sections` (je eigene `sectionProps`) **oder** ein
`children`-Array mit `pageBreak()` zwischen den Blöcken — `buildKnS`/`buildKnLp` zeigen beide Muster.

---

## 4. Aufgaben (Schritt für Schritt; nach jedem Schritt `npm run build`)

**Schritt 1 — `buildDossier()` in `docx-builder.ts`.**
Signatur analog zu den anderen (nullbar wie `buildKnS`):

```ts
export interface BuildDossierOpts {
  dossier: DossierJson
  abteilung?: string
  kompetenzNr?: string
  logoPng?: ArrayBuffer | Uint8Array | null
}
export function buildDossier({ dossier, abteilung, kompetenzNr, logoPng = null }: BuildDossierOpts): Document | null
```

Reihenfolge/Felder exakt nach §2. Sichtbare Fix-Strings (Labels) in Swiss German, kein ß. Akzentfarbe
durchgehend BBW-Grün (Glossar+ ist set-weit, nicht an eine HF-Farbe gebunden). `docCode` z. B.
`'GLOSSAR+ · …'`, `docTitel` `kopf.einheit_titel || 'Glossar+'`.

**Schritt 2 — Workbench verdrahten.** In `EinheitWorkbench.tsx`:
- Import ergänzen: `buildDossier` aus `'../../lib/einheiten/docx-builder'`.
- Im `if (d.dossier) { … }`-Block (siehe §1) nach dem HTML-`zip.file` ein `word/…docx` ergänzen, im
  selben try/catch-Muster wie bei DocS/Austausch:

```tsx
try {
  const docx = buildDossier({ dossier: d.dossier, abteilung, kompetenzNr: d.kn?.kompetenz_nr, logoPng: pngArrayBuffer })
  if (docx) {
    zip.file(`word/${filename.replace(/\.html$/, '.docx')}`, await docToBlob(docx))
    log.push(`word/${filename.replace(/\.html$/, '.docx')}`)
  }
} catch (e) { console.warn('docx Dossier failed', filename, e) }
```

**Schritt 3 (optional, separat klären) — EBA-Typografie in den bestehenden `.docx`.**
DocS/Austausch/KN bekommen für EBA aktuell EFZ-Word-Stil. Wenn EBA-Anmutung (grössere Schrift, mehr
Abstand) auch in Word gewünscht ist, eine `eba`-Stilweiche in `p()`/`h()`/`sectionProps()` einziehen
(z. B. Basis 12.5pt statt 10.5pt bei `lehrgang === "EBA_2J"`). **Nicht Teil von Schritt 1/2** — erst mit
Pietro bestätigen, ob nötig.

**Schritt 4 — Build + Verifikation.** `npm run build`; Workbench `/einheiten/1.1.1_lehrvertrag_orientieren`
öffnen (KT1, Einheit ist `status:"entwurf"`), ZIP herunterladen, `word/…_doc-dossier.docx` in Word öffnen
und gegen die HTML-/Print-Version + `DocEbaDossier.tsx` abgleichen (alle 6 Seitentypen vorhanden, jedes
Feld gerendert).

Optional: `estimateBundleCount()` in `scripts/build-einheiten-index.mjs` um das Dossier (HTML+DOCX)
erweitern — kosmetisch (nur die Datei-Zahl im Katalog), nicht buildkritisch.

---

## 5. Invarianten / Fallstricke (nicht verletzen)

- **Nur additiv, EBA-scoped.** Keine bestehende `build*`-Funktion im Verhalten ändern (Schritt 3 nur als
  optionale, klar getrennte Weiche). EFZ-`.docx` müssen byte-stabil bleiben — **EFZ-Regression ist
  Akzeptanzkriterium.**
- **Null-safe.** Fehlende Felder tolerieren (`dossier.kopf?`, leeres `nuggets`, fehlendes
  `transfer_wissensblatt`). `buildDossier` darf `null` zurückgeben, wenn `dossier` leer ist (Workbench
  prüft `if (docx)`).
- **`fakten_anker` NICHT rendern** — das ist interne QA; learner-facing sind nur die `recherche`-Felder.
- **Swiss German, kein ß, echte Umlaute** in allen Fix-Labels. Suchbegriffe/Prompts kommen aus den Daten
  und bleiben unverändert (auch `[Ihr Kanton]`-Platzhalter nicht „reparieren").
- **`docx`-Lib-Importe** nur aus dem bestehenden Import-Block erweitern (alles schon vorhanden:
  `Table`, `ImageRun`, `PageBreak`, …).
- **Build-Umgebung:** Der OneDrive-Ordner synct in dieser Sandbox unzuverlässig; in einer echten
  Claude-Code-Dev-Session ist das kein Thema. `npm run build` ist die Wahrheit.

---

## 6. Entscheidungs-Historie (Kontext)

Phase 1 wurde bewusst **HTML/Print-only** ausgeliefert (Pietro), `.docx` zurückgestellt. Diese Session
holt den Word-Export nach. Da `docx-builder` **programmatisch** baut (liest **kein** CSS), trägt die
EBA-`einheiten-renderer.css` **nicht** in den `.docx` — die Struktur muss hier von Hand gebaut werden,
feldgleich zur React-Komponente.

---

## 7. Akzeptanzkriterien

- [ ] `npm run build` grün.
- [ ] EBA-ZIP enthält `word/{prefix}_doc-dossier.docx`; öffnet in Word fehlerfrei.
- [ ] Alle 6 Seitentypen (Titel, Wissen je Nugget, Sprachhilfe, Grundprinzip, Glossar, Notizen) sind
  da; **jedes Feld** aus `dossier.json` ist sichtbar (Abgleich gegen `DocEbaDossier.tsx`).
- [ ] KI-Prompts als Box, Selbst-pruefen mit Schreiblinien, Notizen-Seite liniert.
- [ ] BBW-Grün als Akzent; echte Umlaute, kein ß in den Fix-Labels.
- [ ] EFZ-Einheit (`1.1.1_konflikt_kommunizieren`) — `.docx` **unverändert** (kein neues Verhalten).

---

## 8. Startpunkt für die Session

1. Lies `src/components/einheiten/docs/DocEbaDossier.tsx` (Soll-Vorlage, exportierte Typen).
2. Lies `src/lib/einheiten/docx-builder.ts` — v. a. `buildAustausch` (einfachstes Muster),
   `buildKnS`/`buildKnLp` (Mehrseiten + Tabellen), die Helfer `p/h/sectionHead/promptBox/schreibfeld/
   callout/dataTable/sectionProps/docToBlob`.
3. Lies `src/components/einheiten/EinheitWorkbench.tsx` → `handleBundle()` (ZIP-Aufbau, der `d.dossier`-
   Block).
4. Schritt 1 → 4 abarbeiten, nach jedem Schritt `npm run build` + EFZ-Regression.
5. Bei Unklarheit (Schritt 3 EBA-Typografie? Glossar ein-/zweispaltig?) bei Pietro melden, nicht raten.

**Pilot-Daten zum Testen:** `src/data/einheiten/1.1.1_lehrvertrag_orientieren/dossier.json` (vollständig:
kopf, einleitung, 6 Nuggets mit recherche, 2 Scaffolds, transfer, 11 Glossar-Einträge).
