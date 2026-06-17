# Handoff — EBA-Renderer in `bbw-hko` aufbauen

**Für:** die nächste Claude-Code-Session (Dev-Env mit Terminal + Build).
**Repo:** `bbw-hko` · **Stand:** 2026-06-17 · **Sprache aller Outputs:** Swiss Standard German, **kein Eszett (ss)**, **echte Umlaute ä/ö/ü** (ae/oe/ue NUR in IDs/Slugs/Keys), UTF-8.

---

## 0. Ziel in einem Satz

Auf `bbw-hko` sollen **EBA-Einheiten genau wie EFZ-Einheiten gerendert** werden (gleiche
Plattform, gleicher Workbench, gleicher ZIP-/Print-Flow) — **nur mit anderem CSS und ein paar
EBA-spezifischen Abweichungen**. Eine Lehrperson, die EFZ **und** EBA unterrichtet, nutzt **denselben
Renderer ohne Mehraufwand**; der Unterschied wird automatisch über `lehrgang === "EBA_2J"` gezogen.

**Designziel:** ein guter Mix aus **BBW-Grunddesign** (Tiefgrün `#0E6E3A`, IBM Plex Sans, A4-Raster,
DocS/DocKn-Seitenstruktur) **und den fünf EBA-Prinzipien** (kognitive Last raus, nicht
infantilisieren).

---

## 1. Was schon existiert (nutzen, nicht neu erfinden)

| Artefakt | Pfad | Zweck |
|---|---|---|
| **Generator (Referenz-Spec)** | `docs/eba/_pilot_output/build_eba_print.py` + `_eba_print.css` | Liest die 6 JSONs, emittiert das **data-complete** Print-HTML. **Feld-für-Feld-Vorlage** für die React-Komponenten. |
| **Print-Vollausgabe** | `docs/eba/_pilot_output/1.1.1_PRINT_full.html` | 18 A4-Seiten, jedes JSON-Feld gerendert. **Visuelle Soll-Vorlage.** |
| **MVP-Prototyp** | `docs/eba/_pilot_output/1.1.1_PRINT_PROTOTYP.html` | Erste, schlankere Design-Studie (nicht data-complete). Nur als Stil-Referenz. |
| **Dossier-Komponente (Entwurf)** | `src/components/einheiten/docs/DocEbaDossier.tsx` | Bereits geschrieben, additiv, noch nicht verdrahtet. |
| **Früherer Render-Handoff** | `docs/eba/EBA_RENDER_HANDOFF.md` | Enthält die konkreten Diffs (Loader, types, CSS-Block, Workbench-Wiring) — **hier referenziert, dort die Details.** |
| **Rendering-Prinzipien** | (in diesem Doc, §4) | Die fünf EBA-Prinzipien als Render-Regeln. |
| **Pilot-Daten** | `docs/eba/_pilot_output/1.1.1_lehrvertrag_orientieren_*.json` (6 Dateien) | Echte EBA-Einheit zum Testen. |

> **Wichtigster Hinweis:** `build_eba_print.py` ist die **verbindliche Feld-Mapping-Spec**. Jede
> React-Komponente muss genau die Felder rendern, die die entsprechende Funktion im Generator rendert
> (`doc_s`, `doc_austausch`, `doc_kn`, `doc_dossier`). Wenn der Generator ein Feld zeigt, muss die
> Komponente es auch zeigen. Bei Abweichung gewinnt der Generator.

---

## 2. Bestehende Render-Architektur (Ist-Stand, gelesen)

**Render-Pfad (Renderer B, A4/Print, TypeScript React):** `src/components/einheiten/docs/`
- `chrome.tsx` — gemeinsames Gerüst: `A4Page` (210×297mm, padding 12/16mm, Header/Footer, sit-strip),
  `SectionHead`, `Badge`, `Schreibfeld`, `HandlungsFlaeche`, `sitColors()` (setzt `--sit-akzent/-light/-mid`
  aus `sit.sit_farbe*`).
- `DocS.tsx` — pro Herausforderung, zwei Modi: `info` (Dossier/Lese-Variante, 4 Seiten) und `fill`
  (Auftrag mit Schreibfeldern, 5+ Seiten). Konsumiert `sit.*`. **Liest aktuell KEIN `lehrgang`.**
- `DocAustausch.tsx` — Set-Abschluss (austausch_phase 3 Sozialformen + dekontextualisierung). **Null-safe**
  (`sits.filter(Boolean)`).
- `DocKnS.tsx` (KN für Lernende) · `DocKnLp.tsx` (KN für LP). **Null-safe** (`real = sits.filter(Boolean)`).
- `docx-builder.ts` + `begleiter-builder.ts` — bauen `.docx` (DocS/KnS/KnLp + Begleiter) via `docx`-Lib.

**Styling:** `src/styles/einheiten-renderer.css` — ALLE Klassen (`a4-page`, `sit-text`, `lf-item`,
`scaffolding`, `cockpit-*`, `mindmap-*`, …). BBW-Design: IBM Plex Sans (per @import + im ZIP-`wrap()` per
`<link>`), Basis 10.5pt/1.4, Brand-Grün, semantische Statusfarben.

**Daten-Loader:** `src/lib/einheiten/index.ts` → `loadEinheit(slug)` lädt `hf_A/B/C`, `kn`, `prinzip`,
`set`, `begleiter`, `ki`, `lernprompt`, `lernbegleiter` via `pickJson` (**null-safe** — fehlende Datei = null).
**Lädt `dossier.json` NOCH NICHT.** Typen in `src/lib/einheiten/types.ts`.

**Workbench:** `src/components/einheiten/EinheitWorkbench.tsx` — React-Island, Doc-Selector + ZIP-Export.
- Iteriert `['A','B','C']` **null-safe**: `classifySit(d,letter) ? <button/> : null` und im ZIP
  `for (letter of ['A','B','C']) { const s = classifySit(d,letter); if (!s || !d.set) continue; … }`.
- ZIP enthält pro Herausforderung DocS info+fill (HTML + DOCX), dazu DocAustausch, DocKnS, DocKnLp + Begleiter.
- **`template`-Feld wird NIRGENDS gematcht** → der Renderer rendert unabhängig vom `template`-Wert
  (`default_4page_v2` / `kn_2er_eba_default` / `dossier_eba_v1` sind harmlose Tags).
- Eine fest verdrahtete Übersichts-Zeile „Herausforderung C (grün): —" (kosmetisch, bei 2er = „—").

**Konsequenz:** Ein 2er-EBA-Set rendert **heute schon ohne Crash** (hf_C = null wird überall toleriert).
Was fehlt: (a) EBA-CSS/-Design, (b) das Dossier (Daten nicht geladen, keine Komponente verdrahtet),
(c) ein paar EBA-Markup-Abweichungen (Segmentierung).

---

## 3. Gewählter Ansatz: **eine Weiche, kein Fork**

**Entscheidung (begründet):** EFZ und EBA teilen Datenmodell, A4-Raster, Feldanbindung, Doc-Builder und
ZIP-Flow. Darum:

1. **Lehrgangs-Weiche** `lehrgang === "EBA_2J"` setzt auf dem Wurzel-Element jedes Docs die Klasse
   **`doc-eba`**. Daran hängt ein **EBA-CSS-Layer** (scoped `.doc-eba …`) → trägt P3/P4/P5 (Typografie,
   Scaffolding-Prominenz, Affekt). **Kein zweiter Render-Stack.**
2. **Leichte konditionale Markup-Abweichungen** in den bestehenden Komponenten nur dort, wo P1/P2 echte
   Struktur brauchen (eine Leitfrage pro Block, `so_gehst_du_vor` als Einzelschritte, sichtbare Nugget-
   Anker). Über `if (eba) …` in DocS/DocKnS, minimal.
3. **Eine neue Komponente** `DocEbaDossier.tsx` (existiert als Entwurf) für das Dossier — das ist das
   einzige Dokument, das EFZ nicht hat.

So bleibt EFZ **vollständig unberührt** (kein Pfad, kein Verhalten geändert), und eine Lehrperson, die
beides unterrichtet, klickt im selben Workbench — der Renderer entscheidet automatisch.

**Warum nicht reines CSS?** P3/P4/P5 sind CSS. Aber P1 (Segmentierung: 1 Leitfrage/Seite,
Einzelschritte) und P2 (Nugget-Sprungmechanik) brauchen kleine Markup-/Pagination-Unterschiede →
konditional in den Komponenten, nicht per CSS allein.

**Warum nicht reiner Fork?** Würde DocS/DocAustausch/DocKn duplizieren → zwei Stränge pflegen, Drift-Gefahr.

---

## 4. Die fünf EBA-Prinzipien als Render-Regeln (verbindlich)

Zielgruppe: EBA-Lernende, schulisch schwächer, Lese-/Konzentrationsschwierigkeiten, frustrieren schnell —
aber **Jugendliche, nicht infantilisieren**. Layout nimmt kognitive Last raus, die nichts mit dem Inhalt
zu tun hat.

| # | Prinzip | Konkret im Renderer |
|---|---|---|
| **P1** | Eine Sache pro Sichtfeld | EBA: **eine Leitfrage pro Block/Seite**; `dossier.sprachmodi_scaffolds[].so_gehst_du_vor` als **einzelne** Schritte mit „Schritt n von m" (nicht als Absatz); keine Leitfragen-+-Mindmap-Bündelung. Lieber mehr kurze Seiten. |
| **P2** | Dossier nachschlagbar, nicht durchlesbar | Leitfrage→Nugget-**Anker** sichtbar (aus `leitfragen[].knoten_ref` / `quellen_anker[].nugget_ref`); Nugget-Codes A-01…B-03 als Anker; Glossar als eigener, schnell auffindbarer Block; Fachbegriff→Glossar markiert. Nachschlagen < 5 Sek. |
| **P3** | Sprachlast aus dem Layout | **grössere Grundschrift** (~12.5pt statt 10.5), **kurze Zeilen** (~60-64 Zeichen, `max-width`), **mehr Zeilenabstand** (1.6), **linksbündig — KEIN Blocksatz**, Fachbegriffe visuell markiert. |
| **P4** | Scaffolding sichtbar/greifbar, 90/100 wählbar | `handlungsprodukt.scaffolding.{satzanfaenge,strategien,struktur}` **prominent NEBEN der Schreibfläche** (nicht versteckt/optional); `lernfortschritt.scaffold_90/100` als sichtbare Wahl. |
| **P5** | Affekt + Selbstwirksamkeit | sichtbarer Fortschritt (Schritt-Chips, ☐); Übung ≠ Prüfungs-Optik; ICH-Ton warm; `mehrdeutigkeit.hint` **einladend** rendern, nicht bedrohlich. |

**BBW-Grunddesign bleibt** (der „Mix"): Brand-Grün `#0E6E3A` als einzige Chrome-Farbe, A=rot/B=blau nur
als Herausforderungs-Akzent, IBM Plex Sans, A4Page-Gerüst (Header/Footer/sit-strip), bestehende
Section-Struktur. EBA ändert **Typografie + Dichte + Segmentierung**, nicht die Marke.

**Drei offene Fragen NICHT im Code härten** (konservative Defaults): Print = Default (vor digital);
sparsame funktionale Piktogramme (Schritt-Symbole, Nugget-Marker), keine Deko; Fortschrittsanzeige ja,
**Punkte/Badges nein** — bis an einer Klasse getestet.

---

## 5. Dokument-Set (Soll, gleich wie EFZ-Flow)

Pro EBA-Einheit rendert der Workbench (Reihenfolge wie EFZ, EBA-CSS):

1. **DOC-S Herausforderung A** — Cockpit + nRLP-Metadaten + Situation/Trade-off + 4 Leitfragen (Bloom +
   Nugget-Anker + Schreibfeld) + Mindmap (Zentrum + 4 Äste) + Handlungsprodukt (Beschreibung, Schritte,
   Scaffolding, Schreibfläche, 90/100, Gütekriterien) + Checkliste Vollständigkeit + Reflexion +
   Ressourcen + Transfer-Frage. (info- und fill-Modus wie EFZ.)
2. **DOC-S Herausforderung B** — identische Struktur.
3. **DOC Austausch & Transfer** — konzept_progression + austausch_phase (EA/Jigsaw-3-Runden/Plenum) +
   dekontextualisierungs_aufgabe.
4. **DOC-KN** — Hybrid-Situation + Alignment-Mapping + 3 Prüfformen (Fachgespräch 5 / Mini Case 4 /
   Werkschau 3) + bi-dimensionale Rubrik (4 Kriterien × 4 Stufen + Niveaubänder). (KnS + KnLp wie EFZ.)
5. **DOC Dossier (NEU, EBA-only)** — Nuggets A/B (mit Anker + Fakten-Flags), Sprachmodi-Scaffolds
   (so_gehst_du_vor), Transfer-Wissensblatt, Glossar.
6. **Begleiter** (LP) — wie EFZ aus `begleiter.md`.

**Feld-für-Feld:** siehe `build_eba_print.py` Funktionen `doc_s` / `doc_austausch` / `doc_kn` /
`doc_dossier` — das ist die exakte Mapping-Liste. Visuelles Soll: `1.1.1_PRINT_full.html`.

---

## 6. Build-Plan (schrittweise; nach jedem Schritt `npm run build`)

> Die konkreten Code-Diffs für A–E stehen in `docs/eba/EBA_RENDER_HANDOFF.md` (Abschnitt
> „Anzuwenden im Dev-Env"). Hier die Reihenfolge + Akzeptanz.

**Schritt 1 — Daten-Layer.** `DossierJson`-Typ in `types.ts`; `EinheitFullSet.dossier`; im Loader
`dossier: pickJson<DossierJson>(slug,'dossier')`. EFZ ohne `dossier.json` → `null`. → build grün.

**Schritt 2 — Lehrgangs-Weiche + EBA-CSS.** In DocS (und DocKnS/DocAustausch) Wurzel-`className`
`doc-eba` wenn `lehrgang === "EBA_2J"`. EBA-CSS-Block (scoped `.doc-eba`) ans Ende von
`einheiten-renderer.css` (Vorlage: `EBA_RENDER_HANDOFF.md` §E + `_eba_print.css`). EFZ unverändert.

**Schritt 3 — DocEbaDossier verdrahten.** `DocEbaDossier.tsx` (Entwurf vorhanden) in
EinheitWorkbench-Selector + ZIP einhängen (nur wenn `d.dossier`). HTML zuerst; DOCX optional (siehe §8).

**Schritt 4 — P1/P2-Markup-Feinschliff.** In DocS (EBA-Pfad): eine Leitfrage pro Block, Nugget-Anker
sichtbar; `so_gehst_du_vor` als Einzelschritte. Gegen `1.1.1_PRINT_full.html` abgleichen.

**Schritt 5 — Kosmetik.** Übersichts-Zeile „Herausforderung C (grün): —" in EinheitWorkbench bei `null`
ausblenden.

**Schritt 6 — Pilot deployen + visuell prüfen.** Die 6 Pilot-JSONs nach
`src/data/einheiten/1.1.1_lehrvertrag_orientieren/` kopieren (Dateinamen ohne Slug-Präfix:
`prinzip.json`, `herausforderung_A.json`, `herausforderung_B.json`, `set.json`, `kn.json`,
`dossier.json`, `begleiter.md`), `set.json` mit `"status":"entwurf"` (nur KT1 sichtbar),
`npm run build:einheiten-index`, im Workbench öffnen, Print/PDF gegen `1.1.1_PRINT_full.html` abgleichen.

---

## 7. Renderer-Invarianten & Fallstricke (nicht verletzen)

- **Null-safe bleiben:** hf_C = null muss überall toleriert werden (ist es schon). Nichts hart auf 3
  Herausforderungen annehmen.
- **`template`-Wert nicht matchen** — der Renderer ist datengetrieben, nicht template-getrieben.
- **Mindmap:** genau 4 Äste, Ast 4 `optional:true` (Renderer-Invariante des bestehenden DocS).
- **Bewertungsraster:** genau 4 Zeilen mit `vollstaendig_wenn`.
- **Echte Umlaute** in aller gerenderten Prosa; **ae/oe/ue nur in IDs/Slugs**; **kein ß**. Gilt auch für
  neu generierte UI-Strings im Renderer.
- **EFZ nicht anfassen:** kein bestehender Doc-Pfad, kein EFZ-CSS-Selektor verändern (nur additiv unter
  `.doc-eba`). EFZ-Regression ist Akzeptanzkriterium.
- **Kein `hko-deploy`-Web-Viewer** (Renderer A) anfassen — out of scope.

---

## 8. Offene Entscheidungen (mit Pietro klären, nicht raten)

1. **DOCX für EBA?** EFZ liefert pro Doc auch `.docx`. EBA-DOCX braucht EBA-Stile im `docx-builder.ts`
   (separate Funktionen oder Stil-Weiche). **Vorschlag:** Phase 1 nur HTML/Print (Default = Print);
   DOCX später, falls gewünscht.
2. **Dossier als eigenes Doc vs. Teil von DocS-info?** Vorschlag: **eigenes Doc** (DocEbaDossier),
   weil es set-weit ist und nachgeschlagen wird (P2).
3. **Print vs. digital Default**, Piktogramm-Menge, Gamification — Teil-2-Defaults beibehalten, an einer
   Klasse testen.
4. **Pilot live?** `status:"entwurf"` (nur KT1) zum Testen, oder rein lokal bis Komponenten stehen.

---

## 9. Akzeptanzkriterien

- [ ] `npm run build` grün.
- [ ] **EFZ-Regression:** `1.1.1_konflikt_kommunizieren` (EFZ) rendert **identisch wie vorher** — kein
  `doc-eba`, keine Dossier-Option, kein veränderter Stil.
- [ ] EBA-Pilot rendert das volle Dokument-Set (A, B, Austausch & Transfer, KN, Dossier) — **jedes Feld
  aus den JSONs** sichtbar (Abgleich gegen `build_eba_print.py` + `1.1.1_PRINT_full.html`).
- [ ] EBA-Typografie greift (grösser, kurze Zeilen, linksbündig); Scaffolding prominent; Fortschritt/
  Anker sichtbar; Mehrdeutigkeit einladend.
- [ ] BBW-Grunddesign erkennbar (Grün, IBM Plex, A4Page-Gerüst) — EBA wirkt als Variante, nicht als
  Fremdkörper, und nicht infantil.
- [ ] ZIP enthält die EBA-Docs inkl. Dossier; Workbench-Selector zeigt sie.
- [ ] Echte Umlaute, kein ß, in allen gerenderten Strings.
- [ ] Eine Lehrperson kann im selben Workbench EFZ- und EBA-Einheiten ohne Zusatzschritte rendern.

---

## 10. Startpunkt für die nächste Session

1. Lies `build_eba_print.py` (Feld-Spec) + öffne `1.1.1_PRINT_full.html` im Browser (visuelles Soll).
2. Lies `docs/eba/EBA_RENDER_HANDOFF.md` (konkrete Diffs A–E) + `DocEbaDossier.tsx` (Dossier-Entwurf).
3. Lies `DocS.tsx`, `chrome.tsx`, `EinheitWorkbench.tsx`, `einheiten-renderer.css`, `index.ts` (Ist-Stand).
4. Arbeite §6 Schritt 1→6 ab, nach jedem Schritt `npm run build` + EFZ-Regression.
5. Bei Unklarheit über den Render-Pfad oder eine offene Entscheidung (§8): bei Pietro melden, nicht raten.
