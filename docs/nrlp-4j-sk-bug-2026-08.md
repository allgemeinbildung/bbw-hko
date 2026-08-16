# nRLP 4J — unvollständige Thema-Schlüsselkompetenzen (T4/T5/T6)

*Analyse vom 2026-08-16. Betrifft `public/nrlp_4j.json` (Schullehrplan ABU EFZ 4-jährig, Bildungsrat 2026-06).*

---

## Was war falsch

Die Schlüsselkompetenzen (SK) eines Themas stehen in den nRLP-Datensätzen redundant an zwei Stellen:

| Ort | Form | Zustand |
|---|---|---|
| `themen[].schluesselkompetenzen` | Array von SK-**Langtexten** | **kaputt** (T4/T5/T6) |
| `zirkularitaet.schluesselkompetenzen[].wiederholungen` | Map SK → `{T1:"R1", T3:"R2", …}` | korrekt |

Ist-Zustand vor dem Fix vs. Soll:

| Thema (4J) | Lehrjahr | vorher | nachher | ergänzt |
|---|---|---|---|---|
| T4 «Verantwortung für mich und andere übernehmen» | LJ 2 | 5 SK | 7 SK | SK2 Ziele setzen, SK3 Innovation/Problemlösungen |
| T5 «Mich im Staat orientieren» | LJ 3 | **1 SK** (nur SK6 «Standpunkte begründen») | 6 SK | SK2 Ziele setzen, SK5 Werthaltungen reflektieren, SK9 Nachhaltig/vernetzt denken, SK11 Mit Mehrdeutigkeiten umgehen, SK12 Partizipation |
| T6 «Mein eigenes Zuhause» | LJ 3 | 4 SK | 5 SK | SK9 Nachhaltig/vernetzt denken |

**Zweiter, separater Defekt in T4:** der Langtext für SK10 lautete
`"Sich in einem ständig verändernden Umfeld …"` statt kanonisch
`"Sich in einem sich ständig verändernden Umfeld …"` (fehlendes «sich»).
Dieser String war in **keiner** der beiden Label-Maps enthalten (siehe Auswirkung im Abschnitt IntakeForm). Der Fix hat ihn mitkorrigiert.

`public/nrlp_3j.json` und `public/nrlp_2j.json` sind nicht betroffen.

---

## Wie es verifiziert wurde

Zwei unabhängige Quellen:

1. **Interne Zirkularitäts-Tabelle** (`zirkularitaet.schluesselkompetenzen[].wiederholungen`) im selben File. Gegenprobe über alle drei Datensätze, aktueller Working Tree:

   | Datensatz | Themen mit `array.length === zirkularität.length` |
   |---|---|
   | `nrlp_2j.json` | 8/8 ✓ |
   | `nrlp_3j.json` | 7/8 ✓ (Abweichung nur T7 Schlussarbeit) |
   | `nrlp_4j.json` | 7/8 ✓ (Abweichung nur T7 Schlussarbeit) |

   Die T7-Abweichung ist **kein Bug**: «Schlussarbeit» listet alle 12 SK-Langtexte und steht per Definition ausserhalb der Spirale (`zirkularität` = 0 Treffer). Genau diese Eigenschaft nutzt `scripts/build-sk-labels.mjs` (Z. 33–34), um das Thema zu finden, aus dem die kanonischen Langsätze stammen.

   Vor dem Fix (Commit `69e6282`) ergab die Zirkularitäts-Tabelle für 4J:
   - T4 → SK 2, 3, 5, 6, 7, 10, 11 (7 Stück; Array hatte 5)
   - T5 → SK 2, 5, 6, 9, 11, 12 (6 Stück; Array hatte 1)
   - T6 → SK 3, 4, 7, 8, 9 (5 Stück; Array hatte 4)

2. **SLP-PDF** `public/slp/efz-4j.pdf` (495 KB, im Repo vorhanden), SK-Spirale S. 5 — externe Prüfung durch den Auftraggeber; im Repo nicht automatisiert nachprüfbar.

Beide Quellen ergeben dieselben Sollwerte 7 / 6 / 5.

---

## Betroffene Lesestellen

### Betroffen (liest 4J-Thema-SK, Ergebnis war falsch)

| Datei : Zeile | Was gelesen wird | Begründung |
|---|---|---|
| `src/pages/jahresplanung/thema/[nr].astro` : 32 | `theme.schluesselkompetenzen` → `themeSK`, gerendert im Block «Thema-Taxonomie: SK + Sprachmodi» (Z. 114 ff.) | Dataset via `getNrlp(lehrgang) ?? nrlp` (Z. 18) mit `lehrgang` aus `?lehrgang=` (`parseLehrgang`, `calendar.ts` : 323–325 akzeptiert `EFZ-4J`). Erreichbar über `/jahresplanung/uebersicht?lehrgang=EFZ-4J` → Themen-Karte (`uebersicht.astro` : 167) bzw. `jahresplanung.astro` : 573. Die T5-Seite zeigte 1 statt 6 SK. |
| `src/components/IntakeForm.astro` : 754 (`get vorschlag`, via `this.nrlp.themen.find(...)` Z. 739–741) | `t?.schluesselkompetenzen` → `vorschlag.sk`, angewendet von `applyVorschlag()` (Z. 760–764) hinter dem Button «Empfohlene Taxonomie übernehmen» | `loadNrlp()` (Z. 619) fetcht `nrlpFileFor('EFZ-4J') = '/nrlp_4j.json'` (Z. 614). Bei Lehrdauer EFZ-4J + Thema 4/5/6 wurden zu wenige SK vorgeschlagen. **Zusätzlich** griff bei T4 `skShortFor()` (Z. 728–736) für den Tippfehler-String nicht: `skFullName` (aus 3J generiert) kennt ihn nicht, die Schleife findet kein full→short-Match und gibt den **Langsatz unverändert** zurück. `applyVorschlag()` (Z. 763) hätte diesen Langsatz in `form.schluesselkompetenzen` gepusht — ein Wert, der keiner Checkbox (`bezeichnung`, Z. 207–209) entspricht und so in `materials.schluesselkompetenzen` gelandet wäre. |
| `public/nrlp/modules/ui/details.js` : 41–47 | `t.schluesselkompetenzen` im Thema-Detail-Panel des Standalone-Explorers | Dataset-Picker `public/nrlp/index.html` : 23 bietet `/nrlp_4j.json`; `modules/app/controller.js` : 290–296 / 416 lädt ihn. |
| `public/nrlp/prompt-builder/render.js` : 226–237 (via `state.js` : 35 `S.thema = nrlp.themen.find(...)`) | `S.thema.schluesselkompetenzen` als SK-Chip-Auswahlpool + `bulkToggles` | Dataset-Picker `prompt-builder/index.html` : 22 bietet `/nrlp_4j.json`; `app.js` : 19–25 / 39–45 lädt ihn. Der Pool war zu klein; generierte Prompts konnten fehlende SK gar nicht enthalten. |
| `.claude/skills/bbw-hko-3er-set/SKILL.md` : 184, 201 (+ `references/hko-framework.md` : 30) | Phase 0 «NRLP-Lookup» extrahiert explizit `Thema → schluesselkompetenzen[]` und gibt `SK (Thema-Ebene)` aus; `hko-framework.md` : 30 löst Langtexte auf SK-Nummern auf | `SKILL.md` : 1146 (Addendum §B) schaltet die Quelle nach `lehrgang`: `EFZ_4J → public/nrlp_4j.json`. Die Skill nutzt `zirkularitaet` **nur** für Gesellschaftsinhalte-R-Stufen, nicht als SK-Rückfallpfad — es gab also keine korrigierende Redundanz. Ein für `EFZ_4J`/T4–T6 generiertes Set hätte einen zu schmalen SK-Kandidatenpool gehabt. |

### Nicht betroffen

| Datei : Zeile | Was gelesen wird | Begründung |
|---|---|---|
| `src/pages/jahresplanung.astro` : 123, 132–138, 155–161 | `zirkularitaet.schluesselkompetenzen[].wiederholungen` → `skMatrix`, `themaSK`, `themaSKAll` | Liest die **korrekte** Quelle, nicht `themen[]`. Deckt SK-Abdeckungsmatrix (Feature 1), Excel-Export (Z. 1355, 1387), Abdeckungs-Checkliste (`recSk`, Z. 1209) ab — alle waren korrekt, auch für 4J. |
| `src/lib/jahresplanung/calendar.ts` : 367, 370 (`buildKnPlan` → `skOfThema`) | `zirkularitaet…wiederholungen['T'+nr]` | Gleiche korrekte Quelle; `themen[]` wird hier nur für Sprachmodi/Aspekte/Lebensbezüge gelesen (Z. 371–378). |
| `src/pages/jahresplanung/uebersicht.astro` : 62–64 | `zirkularitaet.schluesselkompetenzen` + `sk.wiederholungen[colKey]` (SK-Spirale) | Korrekte Quelle. Keine Thema-SK-Lesestelle in der Datei. |
| `src/pages/admin/jahresplanung.astro` : 18 | `nrlp.zirkularitaet.schluesselkompetenzen` | Doppelt sicher: korrekte Quelle **und** `nrlp` = 3J-Default (`src/lib/nrlp.ts` : 51/57). |
| `src/pages/admin/dashboard.astro` : 22, `src/components/CoverageBars.astro` : 58, `src/components/FilterBar.astro` : 55, `src/components/SituationenFilterBar.astro` | `zirkularitaet` bzw. DB-Spalte `materials.schluesselkompetenzen` | Keine Thema-SK-Lesestelle; zudem 3J-Default. |
| `src/components/MaterialCard.astro` : 75, `src/pages/admin/index.astro` : 40/123, `src/pages/api/materials/*.ts`, `src/pages/meine-materialien/[id]/feedback.astro` : 40 | DB-Spalte `materials.schluesselkompetenzen` | Liest gespeicherte Material-Werte, nicht den Lehrplan. |
| `src/lib/umsetzungsbeispiele.ts` : 42–46 | `getNrlp(lehrgang).themen[].titel` | Erreicht 4J, liest aber nur `titel` — kein SK-Zugriff. |
| `src/lib/einheiten/kompetenz-text.ts` : 38, `src/lib/einheiten/sprachfoerderung.ts` : 171 | `getNrlp(...)` → Kompetenz-Texte / Sprachmodi | Erreichen 4J, greifen aber nie auf `schluesselkompetenzen` zu (kein Vorkommen im File). |
| `scripts/build-sk-labels.mjs` : 22, 27, 33–34 | `zirkularitaet.schluesselkompetenzen` **und** `themen[].schluesselkompetenzen` (T7, 12 Einträge) | Hart auf `public/nrlp_3j.json` gepinnt (Z. 22). `src/lib/sk-labels.generated.ts` wurde also nie mit 4J-Daten befüllt. |
| `scripts/sync-einheiten-nrlp.mjs` : 30, 38–46 | lädt 4J, liest aber nur `themen[].lebensbezuege[].text` und `…kompetenzen[].nr/.text` | Kein SK-Zugriff. |
| `scripts/build-einheiten-index.mjs` : 88; `scripts/sync-situationen.mjs` : 49 | `s?.nrlp.sk` aus den Unit-/Situations-JSONs selbst | Lesen den Master-Datensatz gar nicht. |
| `scripts/build-umsetzungsbeispiele-nrlp.mjs` : 24, 62–64 | Parst und **überschreibt** `public/nrlp_4j.json` (nur `data.umsetzungsbeispiele`) | Reine Round-Trip-Serialisierung: kann SK weder lesen noch beschädigen — reformatiert aber die Datei bei jedem `prebuild`. |
| `scripts/fix-mojibake.py` : 47, `scripts/import-nrlp-graph.ps1` | zeichenbasierte Ersetzung bzw. Pfad-Rewrites | Kein feldbezogener SK-Zugriff. |
| `public/nrlp/modules/data/buildGraph.js` : 57, 118–138; `modules/ui/zirkularitaet.js` : 369; `ext/visualizations.js` : 8–12; `prompt-builder/prompts.js` : 22–27, 41–50 | `zirkularitaet.schluesselkompetenzen` (+ `wiederholungen`) bzw. die bereits getroffene Nutzerauswahl | Korrekte Quelle bzw. nachgelagert. |
| `.claude/skills/hko-ki-komplement/` | `prinzip.json` / `kn.json` / `herausforderung_*.json` der fertigen Einheit | Kein Vorkommen von `nrlp_2j/3j/4j.json` in der Skill. Nur transitiv betroffen, falls eine 4J-Einheit aus einem verkürzten Pool entstanden wäre (siehe «Betroffene Artefakte»: keine). |

### Unklar

| Datei : Zeile | Was gelesen wird | Offen |
|---|---|---|
| `.claude/skills/hko-2er-EBA-set-generator/SKILL.md` : 299 vs. 1457 | Phase 0 (Z. 299) bindet hart auf `public/nrlp_2j.json`; das aus der 3er-Skill übernommene Addendum §B (Z. 1457) sagt aber weiterhin `EFZ_4J → public/nrlp_4j.json` | Die beiden Anweisungen widersprechen sich. Ob ein Agent je auf 4J landet, hängt von der Lesereihenfolge zur Laufzeit ab und ist statisch nicht belegbar. Es fehlt eine explizite Präzedenzregel zwischen Phase 0 und Addendum §B. |
| `public/nrlp/modules/data/buildGraph.js` : 232–237 (`kompetenz_sk`-Kanten) | `t.schluesselkompetenzen` (Langtexte) gegen `skNodeMap`, die auf `bezeichnung` (Kurznamen, Z. 141–147) keyed ist | Die Lesestelle greift auf das kaputte Feld zu, aber die Zuordnung schlägt in **allen** Datensätzen fehl (`normalizeConceptLabel` normalisiert nur Diakritika/Whitespace/Case, nicht Lang↔Kurz). Der Pfad war also bereits vorher inert — es lässt sich nicht belegen, dass der 4J-Fehler hier je sichtbar wurde. Vorbestehender, vom SK-Bug unabhängiger Defekt. |

---

## Betroffene Artefakte

**Keine gefunden.** Belege:

**Einheiten** — `src/data/einheiten/` enthält 8 Einheiten. Keine liegt in T4/T5/T6:

| Slug | `lehrgang` | `lehrgaenge` | `thema_nr` |
|---|---|---|---|
| `1.1.1_einstieg_interview` | EFZ_3J | — | 1 |
| `1.1.1_konflikt_kommunizieren` | EFZ_3J | EFZ_3J, EFZ_4J | 1 |
| `1.1.1_lehrvertrag_orientieren` | EBA_2J | — | 1 |
| `1.1.1_rechte_verstehen_nutzen` | EFZ_3J | EFZ_3J, EFZ_4J | 1 |
| `1.1.2_unterlagen_ordnen` | EBA_2J | — | 1 |
| `1.2.2_ki_kompetenznachweis_vorbereiten` | EFZ_3J | — | 1 |
| `1.3.1_konsum_verantworten` | **EFZ_4J** | — | 1 |
| `3.2.1_wahre_kosten` | EFZ_3J | EFZ_3J, EFZ_4J | 3 |

Die einzige rein-4J-Einheit (`1.3.1_konsum_verantworten`) und alle drei doppelt getaggten Einheiten liegen in T1 bzw. T3 — beides unbeschädigte Themen. Identisch in `src/data/einheiten.index.json`.

Zusätzlicher struktureller Schutz: `nrlp.sk` in Einheiten *und* Situationen ist eine **numerische** Liste (z. B. `[1,4,6,7,11]`), also ein Index in `zirkularitaet.schluesselkompetenzen` — nicht in das kaputte Langtext-Array.

**Situationen** — `src/data/situationen.index.json` (60 Einträge) hat kein `lehrgang`/`lehrdauer`-Feld; die Lebensbezüge sind `1.1`, `2.1`, `2.2`, `3.1`, `3.2`, `6.1`. Fünf Einträge (`6.1_sit_A…E`) tragen ein redaktionelles `themen`-Tag mit `T5`/`T6`, aber `thema_nr: null` und numerische `sk`-Werte. Kein Beleg für eine Ableitung aus `nrlp_4j.themen[].schluesselkompetenzen`.

**Datenbank** (Supabase-Projekt `mbslkjxkleiudzsbjqau`, Read-only-Abfragen):
- `select lehrdauer, thema_nr, count(*) from materials group by 1,2` → EFZ-4J existiert nur mit `thema_nr` **1** (3 Zeilen) und **3** (1 Zeile). **Keine** EFZ-4J-Materialien in T4/T5/T6 → die IntakeForm-Fehlempfehlung ist nie in gespeicherte Daten geflossen.
- Gegenprobe auf den T4-Tippfehler-Pfad: `select distinct sk from materials, unnest(schluesselkompetenzen) sk where length(sk) > 40` → **0 Zeilen**, d. h. keine Zeile enthält einen SK-Langsatz statt eines Kurznamens.
- `supabase/seed.sql` : 254–262 enthält genau ein EFZ-4J-Material, T3 — nicht betroffen.

**Generierte Artefakte im Build** — `src/lib/sk-labels.generated.ts` stammt ausschliesslich aus `nrlp_3j.json` (`scripts/build-sk-labels.mjs` : 22) und war nie kontaminiert.

---

## Historie

`public/nrlp_4j.json` hat drei Commits (kein Rename-Vorgänger, `git log --follow`):

| Commit | Datum | Message | T4 / T5 / T6 SK-Array |
|---|---|---|---|
| `a27ce09` | 2026-05-23 | `ci cd` | Datei angelegt, enthält **nur T1 und T2** (`meta.anzahl_themen: 2`, Version «Bildungsrat 2026-01») → T4–T6 existieren noch nicht |
| `69e6282` | 2026-06-14 | `update nrlp` | **5 / 1 / 4** — der Fehler wird hier eingeführt |
| `8cd836c` | 2026-07-01 | `updates sitzung 30.6` | 5 / 1 / 4 — unverändert |
| *(Working Tree)* | 2026-08-16 | *(noch nicht committet)* | 7 / 6 / 5 — Fix |

**Einführender Commit: `69e6282` (2026-06-14, «update nrlp»)** — derselbe Commit, der T3–T8 überhaupt erst hinzufügte. Die Datei war also seit der ersten Existenz von T4/T5/T6 fehlerhaft; es gab keine korrekte Vorversion. Bereits in `69e6282` war `zirkularitaet` korrekt, d. h. die Inkonsistenz bestand von Anfang an innerhalb desselben Files.

**Fehlerfenster: 2026-06-14 bis 2026-08-16 (~2 Monate).**

Der Fix liegt aktuell **uncommitted** im Working Tree (`git status`: ` M public/nrlp_4j.json`, 11 Insertions / 3 Deletions).

---

## Was nach dem Fix zu tun bleibt

Belegbar erforderlich:

1. **Fix committen.** Er ist noch nicht in Git.
2. **Keine Index-Rebuilds nötig.** Belegt: kein Build-Script liest `themen[].schluesselkompetenzen` aus einem 4J-Datensatz (`build-sk-labels.mjs` ist auf 3J gepinnt; `sync-einheiten-nrlp.mjs`, `build-einheiten-index.mjs`, `sync-situationen.mjs` lesen SK gar nicht bzw. nur unit-lokal). `src/lib/sk-labels.generated.ts`, `einheiten.index.json` und `situationen.index.json` sind unverändert korrekt.
3. **Formatierung prüfen.** `scripts/build-umsetzungsbeispiele-nrlp.mjs` (Z. 62–64) läuft im `prebuild` und schreibt `nrlp_4j.json` mit `JSON.stringify(data, null, 2) + '\n'` zurück. Weicht die Handkorrektur davon ab, erzeugt der nächste Build einen zusätzlichen Reformat-Diff. Einmal `npm run build:umsetzungsbeispiele-nrlp` laufen zu lassen und den Diff mitzucommitten vermeidet das.
4. **`public/nrlp/ext/sk-labels.js` ist ein handgepflegter Spiegel** von `src/lib/sk-labels.generated.ts` (Kommentar Z. 1–2: bei nRLP-Änderungen nachziehen). Geprüft: alle 12 Thema-SK-Langtexte, die jetzt in `nrlp_4j.json` stehen, matchen Keys in dieser Datei — nach dem Fix aktuell **kein** Handlungsbedarf. Der T4-Tippfehler war genau der Fall, der hier durchgefallen wäre.

Manuell nachzuprüfende Inhalte:

5. **Keine.** Es existieren keine 4J-Artefakte in T4/T5/T6 (Einheiten, Situationen, Material-Zeilen) — siehe «Betroffene Artefakte». Es gibt nichts nachzugenerieren.

---

## Offene Fragen

1. **EBA-Skill, widersprüchliche Datensatz-Bindung.** `.claude/skills/hko-2er-EBA-set-generator/SKILL.md` bindet in Phase 0 (Z. 299) hart auf `public/nrlp_2j.json`, trägt aber im aus der 3er-Skill kopierten Addendum §B (Z. 1455–1457) weiterhin die Regel `EFZ_4J → public/nrlp_4j.json`. Ob das je zu einem 4J-Read führt, ist statisch nicht entscheidbar. Nicht Teil dieses Bugs, aber derselbe Codepfad.
2. **Vorbestehender Defekt in `public/nrlp/modules/data/buildGraph.js` : 232–237.** Die `kompetenz_sk`-Kanten vergleichen SK-Langtexte gegen eine auf Kurznamen keyed Map und matchen daher in keinem Datensatz. Unabhängig vom SK-Bug, aber beim Tracing aufgefallen. `prompt-builder/render.js` : 229 macht es über `skShort()` korrekt.
3. **Wurden zwischen 2026-06-14 und 2026-08-16 4J-Sets für T4/T5/T6 ausserhalb dieses Repos generiert** (z. B. in `hko-deploy` oder in einer Session, deren Output nie eingecheckt wurde)? Im Repo ist nichts davon nachweisbar; ausserhalb kann ich es nicht prüfen.
4. **Die SLP-PDF-Verifikation (S. 5)** wurde extern durchgeführt und hier nur referenziert, nicht reproduziert. Die repo-interne Zirkularitäts-Gegenprobe stützt dieselben Zahlen unabhängig.
