# Handoff Teil A — KI-Fluency-Renderer in bbw-hko (Claude Code)

**Ziel:** Den `/einheiten`-Workbench um **vier KI-Dokumente** erweitern, komplementär
zur Unit: **KI-Auftrag 1**, **KI-Auftrag 2** (aus `ki.json`), **KI-Lernprompt**
(aus `lernprompt.json`) und **KI-Lernbegleiter** (aus `lernbegleiter.json`). Gleiche
Render-Idee wie hko-deploy, in die bbw-hko-Doc-Komponenten-Idiomatik übersetzt.

**Status:** Datenvertrag steht (3 Beispiel-JSONs liegen im Repo, siehe §1). Dies
ist der einmalige Renderer-Port. Die Per-Unit-Generierung kommt später als Skill
(Teil B).

**Vorbild zum Abschauen (Look + Feldverwendung):**
`hko-deploy/public/missions-renderer/src/components/app/SetWorkbench.jsx`
(Views `ki_1`, `ki_2`, `lernprompt`; KI-Palette `#1E3A5F` / `#E8F0FE` / `#3B6FD4`,
Lernprompt-Akzent `#3B6FD4`). Der Lernbegleiter ist **neu** und hat dort kein
Vorbild — Layout siehe §5.4.

**Nicht-Ziele / Leitplanken:**
- **Additiv, abwärtskompatibel.** Bestehende Docs (DocS, DocAustausch, DocKnS,
  DocKnLp), ZIP-Struktur und Routen bleiben unangetastet. Alle neuen Felder sind
  optional; fehlt eine KI-Datei, erscheint der Nav-Eintrag nicht und die Unit
  rendert wie bisher.
- Kein neues Routing — alles läuft im bestehenden `EinheitWorkbench`-Island.

---

## 1. Datenvertrag (bereits im Repo — als Fixture + Quelle der Wahrheit)

Für die Pilot-Unit liegen drei handgeschriebene Beispiele:

```
src/data/einheiten/1.1.1_konflikt_kommunizieren/ki.json
src/data/einheiten/1.1.1_konflikt_kommunizieren/lernprompt.json
src/data/einheiten/1.1.1_konflikt_kommunizieren/lernbegleiter.json
```

Die Komponenten müssen **exakt diese Shapes** rendern. Feldlisten in §3 (Typen)
und §5 (Section-Mapping). Beim Implementieren gegen diese drei Dateien testen.

---

## 2. `src/lib/einheiten/index.ts` — `loadEinheit()` lädt drei Dateien mehr

`pickJson` und der Glob (`'../../data/einheiten/*/*.json'`) decken die neuen
Dateien bereits ab. Nur die Rückgabe von `loadEinheit()` erweitern:

```ts
ki: pickJson<KiJson>(slug, 'ki'),
lernprompt: pickJson<LernpromptJson>(slug, 'lernprompt'),
lernbegleiter: pickJson<LernbegleiterJson>(slug, 'lernbegleiter'),
```

---

## 3. `src/lib/einheiten/types.ts` — drei Interfaces + `EinheitFullSet` erweitern

Permissiv halten (wie die übrigen Typen, alles optional). Ergänzen:

```ts
export interface KiAssignment {
  key: 'ki_1' | 'ki_2' | string
  pattern?: string
  titel?: string
  ziel?: string
  bezug?: string
  auftrag?: string
  prompt_strategie?: string[]
  ki_frei_vorher?: string
  schritte?: string[]
  guetekriterien?: { kriterium: string; indikator: string }[]
  reflexion?: string[]
}
export interface KiJson {
  id?: string
  modul_titel?: string
  thema?: string
  lehrgang?: string
  timing?: string
  nrlp_anker?: {
    thema_text?: string
    gesellschaft_details?: { aspekt: string; detail: string; kompetenz_anker?: string }[]
    schluesselkompetenzen_texte?: string[]
  }
  ki_leitfragen?: { offen?: string; kritisch?: string; vergleichend?: string; urteilend?: string }
  assignments?: KiAssignment[]
}

export interface LernpromptTechnik {
  key?: string
  titel?: string
  erklaerung?: string
  thema_bezug?: string
  beispiel_basis?: string
  beispiel_fortgeschritten?: string
  warnung?: string
  baukasten?: { rolle?: string[]; kontext?: string[]; aufgabe?: string[]; format?: string[] }
}
export interface LernpromptStacking {
  technik_keys?: string[]
  logik_und_ziel?: string
  prompt_1?: string
  prompt_2?: string
}
export interface LernpromptJson {
  id?: string
  lernprompt?: {
    version?: string
    thema_kontext?: string
    techniken?: LernpromptTechnik[]
    stacking_seite_1?: LernpromptStacking
    stacking_seite_2?: LernpromptStacking
    prompt_vorlage?: string
  }
}

export interface LernbegleiterStrategie {
  key?: string
  technik?: string
  wann?: string
  prompt_basis?: string
  prompt_fortgeschritten?: string
  warnung?: string
}
export interface LernbegleiterJson {
  id?: string
  lernbegleiter?: {
    version?: string
    titel?: string
    ziel?: string
    kompetenzversprechen?: string
    ki_frei_zuerst?: { auftrag?: string; selbsteinschaetzung?: string[] }
    strategie_karten?: LernbegleiterStrategie[]
    kn_typ_tracks?: { typ?: string; label?: string; uebungsfokus?: string; prompt?: string }[]
    rubrik_fokus?: { dimension?: string; kriterien?: string[]; so_uebst_du?: string }[]
    integritaet_warnung?: string
    selbstcheck?: string[]
  }
}
```

`EinheitFullSet` erweitern:

```ts
ki: KiJson | null
lernprompt: LernpromptJson | null
lernbegleiter: LernbegleiterJson | null
```

`EinheitIndexEntry` um Flags ergänzen (für Katalog-Badges, optional):
`hat_ki: boolean`, `hat_lernprompt: boolean`, `hat_lernbegleiter: boolean`.

---

## 4. Drei neue Doc-Komponenten

Neu unter `src/components/einheiten/docs/`, im selben Muster wie `DocAustausch`/
`DocKnLp`: Primitive aus `./chrome` (`A4Page`, `Badge`, `Schreibfeld`,
`SectionHead`, `sitColors`) verwenden, A4-Seiten, Preview **und**
`renderToStaticMarkup`-tauglich (keine Browser-only-APIs, keine `useState`).
KI-Akzentfarbe `#1E3A5F` (Aufträge), `#3B6FD4` (Lernprompt/Lernbegleiter) — als
lokale Konstante, nicht in die Brand-CSS-Variablen schreiben (die bleiben grün).

- **`DocKi.tsx`** — `props: { ki: KiJson; which: 'ki_1' | 'ki_2'; abteilung?; edits; onEdit }`.
  Rendert **einen** Auftrag (per `which` aus `ki.assignments` gewählt). Wird im
  Workbench zweimal genutzt (ki_1, ki_2). Section-Mapping §5.1.
- **`DocLernprompt.tsx`** — `props: { lernprompt: LernpromptJson; abteilung?; edits; onEdit }`.
  Section-Mapping §5.3.
- **`DocLernbegleiter.tsx`** — `props: { lernbegleiter: LernbegleiterJson; abteilung?; edits; onEdit }`.
  Section-Mapping §5.4.

Ausfüllbare Felder (`.feld` / `.hp-flaeche`) wie in den anderen Docs benutzen,
damit der bestehende `contenteditable`-Hook im ZIP-`wrap()` greift.

---

## 5. Section-Mapping pro Doc

### 5.1 DocKi (ein Auftrag) — ~2 A4-Seiten
1. **Kopf:** Badge `which === 'ki_1' ? '1' : '2'`, Kicker «KI-Fluency · formativ»,
   `assignment.titel`. Unter dem Titel `assignment.pattern` als kleine Chip.
2. **Ziel** (`ziel`) + **Bezug** (`bezug`) als Intro-Block.
3. **«Ohne KI zuerst»**-Callout: `ki_frei_vorher` + ausfüllbares `Schreibfeld`.
4. **Auftrag** (`auftrag`).
5. **Prompt-Strategie** (`prompt_strategie[]`, nummeriert).
6. **Schritte** (`schritte[]`, nummeriert).
7. **Gütekriterien** (`guetekriterien[]` → `{kriterium}` fett + `{indikator}`),
   als formative Checkliste.
8. **Reflexion** (`reflexion[3]`) mit je einem `Schreibfeld`.
   Set-Kopf (einmal, klein): `nrlp_anker.thema_text` + `ki_leitfragen` optional als
   Fussleiste.

### 5.2 Gemeinsamer KI-Set-Kopf
`ki.nrlp_anker` + `ki.ki_leitfragen` können als schmaler Kopf über beiden
KI-Auftragsseiten erscheinen (analog hko-deploy). Optional; nicht doppelt rendern.

### 5.3 DocLernprompt — 2 A4-Seiten (wie hko-deploy `ki_lernprompt`)
1. **Kopf:** Badge «P», Kicker «KI-Fluency · Prompting», `lernprompt.thema_kontext`.
2. **Technik-Karten** (`techniken[]`, i. d. R. 4): pro Karte `titel`, `erklaerung`,
   `thema_bezug`, `beispiel_basis` + `beispiel_fortgeschritten` (als kopierbare
   Prompt-Boxen), `warnung` (Callout), `baukasten` (Chips: rolle/kontext/aufgabe/format).
3. **Stacking Seite 1** (`stacking_seite_1`): `logik_und_ziel`, `prompt_1`, `prompt_2`.
4. **Stacking Seite 2** (`stacking_seite_2`): analog.
5. **Prompt-Vorlage** (`prompt_vorlage`) als Footer-Merksatz.

### 5.4 DocLernbegleiter (NEU) — 2 A4-Seiten
1. **Kopf:** Badge «L», Kicker «KI-Fluency · Lernen», `lernbegleiter.titel` + `ziel`.
2. **«Ohne KI zuerst»** (`ki_frei_zuerst`): `auftrag` + `selbsteinschaetzung[]` als
   1–5-Skala-Zeilen (Kompetenzversprechen-Teile).
3. **Strategie-Karten** (`strategie_karten[]`, 5): pro Karte `technik` (Titel),
   `wann`, `prompt_basis` + `prompt_fortgeschritten` (kopierbare Boxen), `warnung`.
4. **KN-Typ-Tracks** (`kn_typ_tracks[]`): pro Track `label`, `uebungsfokus`, `prompt`.
5. **Rubrik-Fokus** (`rubrik_fokus[]`): pro Dimension `dimension` + `kriterien[]` +
   `so_uebst_du`.
6. **Integritäts-Callout** (`integritaet_warnung`, betont) + **Selbstcheck**
   (`selbstcheck[]` als Checkliste).

---

## 6. `src/components/einheiten/EinheitWorkbench.tsx` — Nav, Preview, ZIP

1. **`DocSel`-Union** erweitern:
   `'doc-s' | 'doc-austausch' | 'doc-kn-s' | 'doc-kn-lp' | 'doc-ki-1' | 'doc-ki-2' | 'doc-lernprompt' | 'doc-lernbegleiter'`.
2. **`docNode`-Memo:** Branches ergänzen (Guard wie bei den anderen — fehlt die
   Datei, kurze «… fehlt»-Seite):
   ```tsx
   if (doc === 'doc-ki-1') return d.ki ? <DocKi ki={d.ki} which="ki_1" .../> : missing('KI-Auftrag 1')
   if (doc === 'doc-ki-2') return d.ki ? <DocKi ki={d.ki} which="ki_2" .../> : missing('KI-Auftrag 2')
   if (doc === 'doc-lernprompt') return d.lernprompt ? <DocLernprompt .../> : missing('Lernprompt')
   if (doc === 'doc-lernbegleiter') return d.lernbegleiter ? <DocLernbegleiter .../> : missing('Lernbegleiter')
   ```
3. **Nav-Gruppe «KI-Fluency»** nach dem KN-Block, nur rendern, wenn mindestens eine
   KI-Datei existiert:
   ```tsx
   {(d.ki || d.lernprompt || d.lernbegleiter) && (
     <div className="wb-tree-group">
       <div className="wb-tree-head">KI-Fluency</div>
       {d.ki?.assignments?.some(a => a.key==='ki_1') && <button …onClick={()=>pick('doc-ki-1')}>… KI-Auftrag 1</button>}
       {d.ki?.assignments?.some(a => a.key==='ki_2') && <button …onClick={()=>pick('doc-ki-2')}>… KI-Auftrag 2</button>}
       {d.lernprompt && <button …onClick={()=>pick('doc-lernprompt')}>… KI-Lernprompt</button>}
       {d.lernbegleiter && <button …onClick={()=>pick('doc-lernbegleiter')}>… KI-Lernbegleiter</button>}
     </div>
   )}
   ```
   Buchstaben-Badges: 1, 2, P, L. Titel von `ki.assignments[*].titel` ziehen.
4. **`docKicker` / `docName`** für die vier neuen Fälle setzen (Kicker «KI-Fluency»,
   Name = Auftragstitel bzw. «KI-Lernprompt» / «KI-Lernbegleiter»).
5. **ZIP (`handleBundle`)** — nach dem KnLp-Block analoge Blöcke einfügen
   (HTML via `wrap(...)` + DOCX via neue Builder, beide in `log` pushen):
   - `ki_1`/`ki_2`, wenn `d.ki` und der jeweilige Assignment-Key existiert
   - `lernprompt`, wenn `d.lernprompt`
   - `lernbegleiter`, wenn `d.lernbegleiter`
   Dateinamen im bestehenden Muster: `${prefix}_doc-ki-1.html`, `…_doc-ki-2.html`,
   `…_doc-lernprompt.html`, `…_doc-lernbegleiter.html` (+ `word/…docx`).
6. **README** (`buildReadme`): einen Absatz «KI-Fluency-Dokumente» + die neuen
   Zeilen in der Dateiliste ergänzen (rein kosmetisch; `log` trägt sie ohnehin).

---

## 7. `src/lib/einheiten/docx-builder.ts` — drei Builder

`buildKi({ ki, which, abteilung, logoPng })`, `buildLernprompt({ lernprompt, abteilung, logoPng })`,
`buildLernbegleiter({ lernbegleiter, abteilung, logoPng })` analog zu `buildKnLp`/
`buildAustausch` (gleiche `docx`-Bausteine, gleiche Kopf-/Logo-Logik). Inhalt
spiegelt das Section-Mapping §5. Wie die bestehenden Builder over `docToBlob()`
in die ZIP.

---

## 8. `scripts/build-einheiten-index.mjs` — Flags + Bundle-Count

- `readMaybe(join(dir,'ki.json'))` etc. lesen.
- Index-Eintrag: `hat_ki: !!ki`, `hat_lernprompt: !!lernprompt`,
  `hat_lernbegleiter: !!lernbegleiter`.
- `estimateBundleCount`: `+ (ki?.assignments?.length || 0)*2 + (lernprompt?2:0) + (lernbegleiter?2:0)`.

---

## 9. Verifikation (auf Windows — Build/Run gehört dorthin)

1. `npm run build:einheiten-index` → Flags erscheinen, kein Fehler.
2. `npm run dev` → `/einheiten/1.1.1_konflikt_kommunizieren`:
   - Nav-Gruppe «KI-Fluency» mit 4 Einträgen sichtbar.
   - Jeder der 4 Docs rendert ohne Konsolenfehler; **A4-Overflow prüfen**
     (gleicher Check wie DocKnS/DocKnLp — nichts läuft über den Seitenrand).
   - Inhalte stimmen mit den drei JSONs überein (Stichprobe: KI-Auftrag-1-Titel
     «Die KI als Gegenseite im Konflikt»; Lernbegleiter-Integritäts-Callout).
3. **Download** → ZIP enthält `…_doc-ki-1`, `…_doc-ki-2`, `…_doc-lernprompt`,
   `…_doc-lernbegleiter` je als HTML **und** DOCX; DOCX in Word öffnen, Layout ok.
4. Regression: eine Unit **ohne** KI-Dateien (`1.1.1_rechte_verstehen_nutzen`)
   rendert unverändert, keine KI-Nav-Gruppe, ZIP wie vorher.

---

## 10. Definition of Done

- 4 neue Views im Workbench, nur sichtbar wenn Daten vorhanden.
- ZIP enthält die 4 Docs (HTML+DOCX), README erwähnt sie.
- Index-Flags gesetzt, Bundle-Count korrekt.
- Keine Änderung an bestehenden Docs/Routen; Unit ohne KI-Dateien unverändert.
- Datenvertrag = die drei §1-JSONs; Skill (Teil B) wird später genau dieses
  Format erzeugen.
```
