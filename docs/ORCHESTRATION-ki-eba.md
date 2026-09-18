# Orchestration brief — KI-Toolbox für die EBA-Einheiten (bbw-hko)

Paste this as the opening instruction of the Claude Code session that builds
the KI-Toolbox for the two existing EBA units. Working directory:
`D:\OS\dev\bbw-hko`.

---

## Mission

Die beiden EBA-Einheiten der Plattform bekommen die KI-Toolbox, die alle
EFZ-Einheiten bereits haben: pro Einheit vier Dateien (`ki.json`,
`lernprompt.json`, `lernbegleiter.json`, `ki-liesmich.md`) im bestehenden
Unit-Ordner. Das ist **Content-Autorenarbeit unter einem bestehenden
Renderer-Vertrag**, kein Feature-Bau: die Workbench rendert die KI-Tabs schon
heute rein datengesteuert (`if (d.ki)` in `EinheitWorkbench.tsx`), es gibt
**kein Lehrgang-Gate** — den EBA-Einheiten fehlen schlicht die Dateien.

Dazu kommen zwei klar begrenzte Code-Deltas, die erst *durch* EBA nötig werden:
die EBA-Typografie (`.doc-eba`) muss die drei KI-Renderer erreichen, und die
Skill `hko-ki-komplement` muss für EBA dasselbe A2-Gate ziehen, das der
EBA-Set-Generator schon hat. Alles andere bleibt, wie es ist.

Auslöser: Anfrage Matthias Däniker vom 18.09.2026 («KI Toolbox auch bei den EBA
Einheiten»). Release target: **offen** — Pietro setzt das Datum, sobald er
Matthias antwortet; die Arbeit ist auf ~1 Arbeitstag ausgelegt. Bewusst
aufgeschoben: NotebookLM (Matthias' zweiter Wunsch, eigener Entscheid), weitere
EBA-Einheiten, EBA-Typografie im Word-Export.

## State of the repo

Bereits erledigt — nicht neu bauen:

- **Der KI-Renderer ist fertig und produktiv.** `DocKi`, `DocLernprompt`,
  `DocLernbegleiter`, die Nav-Gruppe «KI-Toolbox», die Liesmich-Route
  `/einheiten/[setKey]/ki-liesmich`, der Word-Export
  `api/einheit-ki-liesmich-docx` und die ZIP-Aufnahme laufen. Sieben EFZ-Units
  nutzen sie.
- **Kein Lehrgang-Gate.** Die KI-Tabs hängen ausschliesslich an den Daten
  (`EinheitWorkbench.tsx`, Nav-Block `d.ki || d.lernprompt || …`), der
  Katalog-Chip an `hat_ki` aus `einheiten.index.json`. Es ist nichts
  freizuschalten.
- **Die Skill `hko-ki-komplement` kennt den EBA-Sonderfall** bereits nominell:
  `references/input-adapter.md` §4 (nur A/B, «im Dossier nachschlagen» statt
  «im Lehrmittel», Fachgespräch als KN-Primärform).
- **Beide EBA-Units sind vollständig und publiziert** (`set.json`
  `status: "publiziert"`): `herausforderung_A/B.json`, `kn.json`,
  `prinzip.json`, `set.json`, `dossier.json`, `begleiter.md`. Alle
  Adapter-Inputs der Skill sind vorhanden und geprüft —
  `prinzip.sk_schnittmenge_kn`, `mehrdeutigkeits_architektur`,
  `dekontextualisierungs_anker`, `zirkularitaet`, `kern_kompetenzversprechen`;
  `kn.hybrid_situation`, `kn.kn_typen` (3), `kn.rubrik_shared.kriterien` (4),
  `kn.anchored_situations`. Kein `ERR_INPUTS` zu erwarten.
- **Das selektive Publizieren existiert**: `entwurf_komponenten:
  ["ki-fluency"]` in `set.json` macht genau die KI-Schicht KT1-only, während
  die Einheit live bleibt (Vorbild: `1.1.1_konflikt_kommunizieren`).

Die zwei Zielordner:

| Slug | Lehrgang | Bestand |
|---|---|---|
| `src/data/einheiten/1.1.1_lehrvertrag_orientieren` | `EBA_2J` | 7 Dateien, publiziert, **keine** KI-Dateien |
| `src/data/einheiten/1.1.2_unterlagen_ordnen` | `EBA_2J` | 7 Dateien, publiziert, **keine** KI-Dateien |

Authoritative inputs, in order of precedence:

| Path | What it is |
|---|---|
| `.claude/skills/hko-ki-komplement/SKILL.md` | Der Generierungsvertrag: Phasen 0–5, Checks P5/P6/KN_BRIDGE/LP1/LP2/L1–L3/LM1–LM3/SPRACHE/SHAPE. Entschieden. Folgen, nicht neu erfinden. |
| `.claude/skills/hko-ki-komplement/assets/*.json` + `assets/ki-liesmich-template.md` | Der Renderer-Vertrag (Feldnamen exakt). Bindend. |
| `src/data/einheiten/1.1.1_konflikt_kommunizieren/{ki,lernprompt,lernbegleiter}.json` + `ki-liesmich.md` | Gold-Referenz. Im Zweifel spiegeln. **Nur lesen.** |
| `.claude/skills/hko-2er-EBA-set-generator/references/a2-language-rules.md` | Die A2-Regelliste inkl. ERR-Codes. Für EBA bindend — siehe Invariante 2. |
| `.claude/skills/hko-ki-komplement/references/input-adapter.md` §4 | Der EBA-Sonderfall. Bindend. |
| `src/data/einheiten/<slug>/dossier.json` | Das Fachwissen der EBA-Unit (EBA hat kein Lehrmittel). Einzige zulässige Wissensquelle für Sachaussagen. |
| `CLAUDE.md` | Architektur, Kommandos, Konventionen. |

## Non-negotiable invariants

Auf jedem Merge in den Arbeitsbaum durchsetzen. Eine Verletzung ist ein Defekt,
unabhängig davon, wie gut die Arbeit sonst ist.

1. **Die KI-Toolbox verrät den Kompetenznachweis nicht.** Kein learner-facing
   Dokument darf den KN-Fall (`kn.hybrid_situation`) selbst üben, eine
   Musterlösung dazu erzeugen oder die KN-Abgabe vorwegnehmen; `mock_transfer`
   fordert einen **neuen, davon disjunkten** Fall (Skill-Check L2). Konsequenz:
   Ein veröffentlichtes Dokument, das den KN-Fall durchspielt, verbrennt den KN
   für jede Klasse, die ihn noch vor sich hat — das lässt sich für diesen
   Jahrgang nicht zurücknehmen.
2. **A2 ist für EBA ein Gate, keine Empfehlung.** Jedes SuS-gerichtete
   Prosa-Feld (`ki.assignments[].{ziel,auftrag,schritte,reflexion,guetekriterien}`,
   alle `lernprompt`-Prompts und `erklaerung`, alle `lernbegleiter`-Karten) wird
   vor dem Write gegen `a2-language-rules.md` gescannt; Satz > 18 Wörter und
   Fachbegriff ohne Glossarbezug blockieren (`ERR_A2_SATZ_ZU_LANG`,
   `ERR_A2_BEGRIFF_OHNE_GLOSSAR`). `ki-liesmich.md` ist teacher-facing und
   ausgenommen. Konsequenz: EBA-Material über A2 ist für die Zielgruppe
   unbrauchbar und kostet den Vertrauensvorschuss der EBA-Lehrpersonen.
3. **Fachwissen kommt aus dem Dossier, nie aus dem Modellwissen und nie aus
   einem Lehrmittel.** EBA hat kein Lehrmittel; jede Sachaussage und jeder
   Nachschlage-Hinweis zeigt auf `dossier.json` (Nugget/Glossar/Info-Karte).
   Das Wort «Lehrmittel» erscheint in keinem EBA-KI-Dokument. Konsequenz:
   Ein Verweis ins Leere macht den Auftrag im Unterricht unausführbar.
4. **Der Renderer-Vertrag ist Feldname für Feldname bindend.** Abweichende oder
   fehlende Keys führen nicht zu einem Fehler, sondern zu einer stillen Lücke
   («KI-Auftrag 1 fehlt») bzw. zu `hat_ki: false` im Index. Gegen
   `assets/*.json` und die Gold-Unit validieren.
5. **Erst KT1-only, dann live.** Beide Units bekommen mit dem ersten Write
   `"entwurf_komponenten": ["ki-fluency"]` in ihre `set.json`. Das Entfernen
   dieses Flags ist die Freigabe und gehört Pietro (siehe Rollenpolitik).
6. **Scope-Zaun** — nicht anfassen, solange ein Task es nicht ausdrücklich
   verlangt: `herausforderung_*.json`, `kn.json`, `prinzip.json`, `dossier.json`,
   `begleiter.md` der beiden Units; `src/data/einheiten/1.1.1_konflikt_kommunizieren/**`;
   `src/lib/einheiten/docx-builder.ts`; `scripts/build-einheiten-index.mjs`.
   An `set.json` ist **ausschliesslich** das Feld `entwurf_komponenten` erlaubt.
   Wenn die Arbeit innerhalb des Zauns nachweislich nicht geht: stoppen und
   eskalieren, nicht den Zaun verschieben.
7. **Sprache:** Deutsch, Schweizer Hochdeutsch, **kein `ß`** (→ `ss`), echte
   Umlaute in Prosa (`ae/oe/ue` nur in IDs/Keys/Dateinamen), Gendern in
   Schrägstrich-Ein-Wort-Form (`Lernende/r`, `Berufsbildner/in`). Keine rohen
   SK-/Sprachmodus-Codes in sichtbarem Text.
8. **Generierte Dateien werden nie von Hand editiert:**
   `src/data/einheiten.index.json` und `public/nrlp/einheiten.index.json`
   entstehen aus `npm run build:einheiten-index`.

## Verification gates

Nichts ist «fertig», bevor das hier vom Repo-Root grün ist:

```
npm run build:einheiten-index
node scripts/check-einheiten.mjs
npm run build
```

Was das erzwingt: `build:einheiten-index` setzt `hat_ki`, `hat_lernprompt`,
`hat_lernbegleiter` und die `bundle_dateien`-Zahl und schreibt **beide**
Index-Kopien. `npm run build` zieht über `prebuild` zusätzlich
`check:nrlp`, `sync:einheiten-nrlp` (bricht bei unzulässigem Lehrgang-Tag ab)
und `build:umsetzungsbeispiele-nrlp` nach. `check-einheiten.mjs` prüft die
Herausforderungen — es prüft die KI-Dateien **nicht**; deren Checks (P5, P6,
KN_BRIDGE, LP1/LP2, L1–L3, LM1–LM3, SPRACHE, SHAPE) sind Skill-Checks und
müssen ausdrücklich gefahren und im Return berichtet werden.

Was kein Kommando abdeckt und darum von Hand geprüft wird (beide Slugs):

- `/einheiten/<slug>` → Nav-Gruppe «KI-Toolbox» zeigt «📖 Lies mich!» + 4 Docs;
  **kein A4-Overflow** (zuerst `DocKi` Seite 1 prüfen — `.a4-page` hat
  `overflow: hidden`, zu viel Text wird still abgeschnitten; A2-Prosa ist
  kürzer, dafür grösser gesetzt).
- `/einheiten/<slug>/ki-liesmich` rendert, Word-Export lädt.
- ZIP-Download: die KI-Dateien liegen drin, `bundle_dateien` stimmt.
- Rollenprobe: als `lp` aufgerufen ist die KI-Schicht **nicht** sichtbar,
  solange `entwurf_komponenten` steht; als `kt1` mit gelbem «Entwurf»-Badge.

---

# Role policy

## FABLE 5 — orchestrator, main session, high effort

"Fable owns the main session, requirements, judgment, integration, and final
verification."

"Fable does not inline-execute large builds. For a bounded, difficult
implementation, Fable writes the spec, dispatches an Opus 5 executor subagent,
and verifies the result. Fable stays at requirements, judgment, and
integration; an executor converging fast on an approved spec is the desired
behavior, not a defect."

"Brief only the exact delta, scope, output, stopping condition, and exclusions."

Fable personally owns, and does not delegate:

- **Die KN-Integrität (Invariante 1).** Fable liest jeden fertigen
  `lernbegleiter.json` und jeden `ki.json`-`reflexion`-Block selbst gegen
  `kn.hybrid_situation` — delegierte Fehlurteile sind hier dauerhaft.
- **Die Freigabe (Invariante 5).** Nur Fable/Pietro entfernt
  `entwurf_komponenten` aus `set.json`, und erst nach der KT1-Durchsicht.
- **Die Bestätigung des Pattern-Paars** (Skill-Phase 1, 7 → 2) pro Unit. Diese
  Wahl trägt alles Folgende: Lernprompt-Techniken, Lernbegleiter-Karten und der
  Liesmich spiegeln sie; eine spätere Korrektur heisst, alle vier Dateien neu
  zu erzeugen.
- **Der Entscheid, auf welchem Weg `EBA_2J` die drei KI-Renderer erreicht**
  (Prop vom Workbench vs. Feld im JSON). Das ist der Vertrag, an den sich jede
  künftige EBA-Unit hält — einmal entscheiden, dann referenzieren.
- Die finale Verifikation vor der Freigabe.

Fable eskaliert an Pietro statt selbst zu entscheiden, wenn: eine Unit die
Skill-Inputs doch nicht hergibt und es keinen Ersatz gibt; A2 und
fachliche Genauigkeit in einem konkreten Satz nicht beide zu haben sind; das
Pattern-Scoring beide Male unter Minimum 30 landet; der KN-Bezug nur um den
Preis von Invariante 1 herstellbar wäre.

## OPUS 5 — executor

Inject into every executor prompt:

"Deliver the requested scope and stop before unasked work."

"Correct an immaterial slip silently. Call it out only when it changes a
number, conclusion, or decision."

"Do not replace grounding or fresh retrieval with confidence or self-review."
Zulässige Quellen sind ausschliesslich: die sieben Dateien der bearbeiteten
Unit (insbesondere `dossier.json` für alles Fachliche), die Gold-Unit
`1.1.1_konflikt_kommunizieren` als Formvorbild, und die Skill-Dateien unter
`.claude/skills/hko-ki-komplement/`. Rechtliches, Zahlen, Fristen,
Dokumentnamen und Fachbegriffe werden **nicht** aus dem Modellwissen
geschrieben — steht es nicht im Dossier, steht es nicht im Dokument. Was nicht
gedeckt werden konnte, kommt in den Return, nicht in die Datei.

Dispatch one Opus executor per bounded, difficult unit of work:

- **Eine komplette KI-Toolbox für eine Unit** — vier Dateien, ein Spec
  (die Skill), ein Ordner. Das ist die natürliche Grösse; zwei Units sind zwei
  Tasks, **nacheinander**, nicht parallel (siehe Build order).
- **Das `.doc-eba`-Delta im Renderer** — `DocKi`, `DocLernprompt`,
  `DocLernbegleiter` bekommen denselben Wrapper wie `DocKnS.tsx:286`
  (`<div className={ebaClass}>`), gespeist aus dem von Fable entschiedenen Weg.
  Alle Aufrufstellen in `EinheitWorkbench.tsx` (Preview, Einzel-Export, ZIP)
  müssen dieselbe Quelle benutzen — Preview und ZIP dürfen nicht auseinander
  laufen.
- **Die A2-Härtung der Skill** — `hko-ki-komplement` bekommt ein
  EBA-A2-Pre-Write-Gate analog zum EBA-Set-Generator: Regelliste aus
  `a2-language-rules.md` referenzieren (nicht kopieren), Gate nur bei
  `lehrgang: "EBA_2J"`, `ki-liesmich.md` ausgenommen, neuer ERR-Code in der
  Checks-Tabelle. Änderung nur an `SKILL.md` + ggf. `references/input-adapter.md`.

Executor brief template:

```
<Imperativ in einer Zeile, z. B.: Erzeuge die KI-Toolbox für 1.1.1_lehrvertrag_orientieren.>

Spec:      .claude/skills/hko-ki-komplement/SKILL.md, Phasen 0–5 vollständig
Sources:   src/data/einheiten/<slug>/*.json (nur lesen) · dossier.json als
           einzige Wissensquelle · references/input-adapter.md §4 (EBA)
Pattern:   src/data/einheiten/1.1.1_konflikt_kommunizieren/{ki,lernprompt,
           lernbegleiter}.json + ki-liesmich.md (Form, nicht Inhalt)
Budget:    4 Dateien; ki-liesmich.md ca. 2–3 A4-Seiten; DocKi Seite 1 muss auf
           eine A4-Seite passen (A2 setzt grösser)

Must hold: KN-Integrität (L2, kein Üben am hybrid_situation-Fall) · A2-Gate auf
           jedem SuS-Prosa-Feld · Fachwissen nur aus dossier.json, Wort
           «Lehrmittel» kommt nicht vor · Feldnamen exakt nach assets/*.json ·
           kein ß, echte Umlaute, Schrägstrich-Gendern

Out of scope: herausforderung_*.json, kn.json, prinzip.json, dossier.json,
           begleiter.md, die Renderer-Komponenten, die Gold-Unit, jede andere
           Unit. An set.json nur entwurf_komponenten.

Done when: die 4 Dateien liegen im Unit-Ordner, die Skill-Checks P5/P6/
           KN_BRIDGE/LP1/LP2/L1–L3/LM1–LM3/SPRACHE/SHAPE sind grün,
           `npm run build:einheiten-index` setzt hat_ki/hat_lernprompt/
           hat_lernbegleiter auf true.
Return:    die zwei gewählten Patterns + Score · die vier Technik-Namen · ein
           Satz, wie die KN-Brücke formuliert ist · Check-Tabelle grün/rot ·
           jede Aussage, die im Dossier NICHT gedeckt war · jede Stelle, an der
           A2 und Fachgenauigkeit kollidiert sind.
```

## SONNET 5 — fan-out worker

"Dispatch it freely for fan-out that needs per-item judgment: blind reader
panels, audits, workspace sweeps. Give it an exact brief, defined output, and a
stopping condition."

"Complete the exact requested deliverable and stop. Do not audit the
surrounding system, surface adjacent issues, or recommend extra improvements."

"Diagnose or report does not authorize a fix. A one-file request does not
authorize related changes."

"Do not create or delegate to subagents."

Natural fan-out für diesen Build — ein Worker pro (Unit × Linse), parallel:

- **A2-Audit.** Liest alle SuS-gerichteten Felder der vier Dateien gegen
  `a2-language-rules.md` und meldet jede Fundstelle mit Satz, Wortzahl und
  Regel. Keine Korrekturen.
- **KN-Integritäts-Audit.** Liest `lernbegleiter.json` + `ki.json` gegen
  `kn.hybrid_situation` und `kn.kn_typen` durch die Linse: «Bereitet das auf die
  Kompetenz vor — oder auf genau diese Abgabe?» Meldet jede Stelle, die den
  KN-Fall selbst übt. Keine Korrekturen.
- **Dossier-Deckungs-Audit.** Für jede Sachaussage: steht sie in `dossier.json`
  (Nugget/Glossar/Transfer-Wissensblatt)? Meldet ungedeckte Aussagen und jeden
  Verweis, der ins Leere zeigt. Keine Korrekturen.
- **Blind-Reader-Panel (EBA-Lernende/r, 1. Lehrjahr).** Liest nur die
  learner-facing Dokumente, ohne Kontext: Was ist hier zu tun? Wo bleibe ich
  hängen? Meldet Verständnislücken. Keine Korrekturen.

## HAIKU — mechanical worker

"Haiku agents handle bounded mechanical reads and transforms. Exact brief,
compact return, no recursive delegation."

"Subagent returns come back as extracted key numbers and paths, never raw dumps."

Suitable work here:

- Feldnamen-Diff: Keys der neuen JSONs gegen `assets/*.json` und die Gold-Unit,
  Ausgabe nur «fehlt in X» / «zusätzlich in X».
- Grep auf `ß`, auf `ae/oe/ue` in sichtbarer Prosa, auf das Wort «Lehrmittel»,
  auf rohe SK-/SM-Codes.
- Nach dem Index-Build: `hat_ki`/`hat_lernprompt`/`hat_lernbegleiter`/
  `bundle_dateien` für beide Slugs aus `src/data/einheiten.index.json` und aus
  `public/nrlp/einheiten.index.json` ziehen und gegenüberstellen.
- Callout-Inventar von `ki-liesmich.md`: welche `[!...]` kommen vor, sind alle
  aus den acht erlaubten, wie viele `[!differenzieren]` stehen in §3.
- Auflisten, welche der fünf Dateien pro Unit existieren und wie gross sie sind.

---

## Suggested build order

Der Abhängigkeitsgraph, kein Zeitplan:

1. **Der EBA-Weg in die KI-Renderer** (Fable entscheidet, Opus baut). Er
   bestimmt, wie das erzeugte Material überhaupt aussieht — Seitenumbrüche und
   Overflow lassen sich vorher nicht beurteilen.
2. **Die A2-Härtung der Skill.** Vor der Generierung, sonst entsteht beides
   zweimal.
3. **Unit 1 — `1.1.1_lehrvertrag_orientieren` vollständig, inkl. Audits und
   Fable-Durchsicht.** Sie wird die EBA-Gold-Referenz. Erst wenn sie steht,
4. **Unit 2 — `1.1.2_unterlagen_ordnen`**, mit Unit 1 als zusätzlichem
   Formvorbild. Bewusst **nicht** parallel: parallel erzeugte EBA-Toolboxen
   driften auseinander, und der Preis dafür ist eine komplette Neugenerierung.
5. **Fan-out-Audits pro Unit** (die vier Linsen oben), danach die Befunde in
   einem Durchgang einarbeiten.
6. **Index-Build, `npm run build`, Workbench-Probe, Rollenprobe.**
7. Fable liest beide Toolboxen ganz, dann KT1-Durchsicht, dann Freigabe
   (Flag entfernen → Index-Build → commit → deploy) und Antwort an Matthias.

## Explicitly out of scope

Nicht anfassen; gehört in eine spätere Phase oder eine andere Session:

- `src/lib/einheiten/docx-builder.ts` — es gibt dort **für keinen** Dokumenttyp
  eine EBA-Typografie (auch `DocS`/`DocKnS` nicht). Die KI-Dokumente dürfen
  nicht die Ausnahme werden; entweder später für alle oder gar nicht.
- Die sieben bestehenden Dateien der beiden Units (ausser
  `set.json` → `entwurf_komponenten`).
- `src/data/einheiten/1.1.1_konflikt_kommunizieren/**` — Gold-Referenz, nur lesen.
- `EinheitWorkbench.tsx` über das Durchreichen der EBA-Information hinaus;
  `EinheitCard.astro`, `einheiten/index.astro`, `[setKey].astro` gar nicht
  (`hat_ki` erscheint dort automatisch).
- `.claude/skills/hko-2er-EBA-set-generator/**` — wird nur gelesen (A2-Regeln).
- Neue EBA-Einheiten, Situationen, Werkstatt, Vorlagen, Prompt-Builder.
- NotebookLM in jeder Form — eigener Entscheid, nicht Teil dieses Auftrags.
- `supabase/**` — dieser Auftrag fasst die Datenbank nicht an.
