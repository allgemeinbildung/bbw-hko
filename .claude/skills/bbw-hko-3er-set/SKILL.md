---
name: bbw-hko-3er-set
description: "Native bbw-hko skill: transforms Swiss ABU vocational textbook content into a coherent 3er-Set Einheit and writes it directly into src/data/einheiten/{X.Y.Z}_{slug}/. Produces a Prinzip-Dokument, 3 validated Herausforderung JSONs (A/B/C), a Set-Dokument with Austausch-Phase and Transfer-Aufgabe, a KN-Dokument with one Hybrid-Herausforderung, three KN-Typen (Fachgespraech / Mini Case schriftlich / Werkschau + Transfer-Reflexion) and a bi-dimensional rubric, plus a Lehrperson-Begleitdokument (begleiter.md). Use this skill whenever Pietro uploads textbook chapters and wants to generate HKO 3er-Set Einheiten for bbw-hko, when the user requests Lernsituationen-Sets fuer ABU Reform 2030, or when the user says 'generate a 3er-set', 'create the new HKO Einheit', 'make Lernsituationen 3er'. Triggers on textbook content + HKO/ABU/3er keywords together. The skill is Prinzip-first AND KN-backwards: a shared red thread is formulated before situations are generated, and the KN is designed with the situations as Lernaufgaben leading to a single Hybrid-Herausforderung."
---

# bbw-hko 3er-Set Generator — Prinzip-First + KN-Backwards

Transforms Swiss ABU Lehrmittel content into HKO 3er-Set Einheiten for bbw-hko — a Prinzip-Dokument plus 3 validated Herausforderung JSONs plus a Set-Dokument plus an inline Kompetenznachweis plus a Lehrperson-Begleitdokument — written directly into `src/data/einheiten/{X.Y.Z}_{slug}/`.

**The architecture is Prinzip-first AND KN-backwards:** before any Herausforderungen are generated, a `prinzip.json` defines the shared red thread for the 3er-Gruppe — Kern-Versprechen, Herausforderungen, SK-Schnittmenge, Mehrdeutigkeits-Architektur, Hybrid-Herausforderung-Spec. All 3 Herausforderungen carry an anchor back to this Prinzip. The KN is generated **inline** as Phase 4 — no downstream skill, no handoff. It consists of one Hybrid-Herausforderung that combines the three Lernaufgaben-Prinzipien plus three KN-Typen (Fachgespraech, Mini Case schriftlich, Werkschau + Transfer-Reflexion) plus one bi-dimensional rubric.

---

## Schema-Compliance (zwingend, nicht verhandelbar)

Die generierten JSONs landen pro Einheit in `src/data/einheiten/{X.Y.Z}_{slug}/` und werden vom Einheiten-Loader (`src/lib/einheiten/index.ts`) sowie dem Index-Build (`scripts/build-einheiten-index.mjs`) gelesen. Sie behalten `template: "default_4page_v2"` als Fixwert (die DocS-Komponenten erwarten diesen Wert). **Zwei Konsumenten, zwei Sichtbarkeiten:** `DocS` rendert den Schuelerbogen, `src/lib/einheiten/deck-builder.ts` das Unterrichtsdeck fuer die Lehrperson. Die LP-Felder `leitfragen[].loesung` (C10) und `handlungsprodukt.musterloesung` (C7) speisen **ausschliesslich** das Deck und duerfen nie im Schuelerbogen landen.

**Wahrheits-Quellen (in dieser Reihenfolge):**

1. **`assets/mission-template.json`** — vollstaendige Skelett-Struktur fuer eine Herausforderung (mit allen 3er-Anpassungen: 4-Zeilen-bewertungsraster mit `vollstaendig_wenn`, `handlungsprodukt.scaffolding`, neue 3er-Felder, ohne gruppenpuzzle/vorgespraech, ohne emotion_tag).
2. **`assets/prinzip-template.json`** — Prinzip-Struktur (3 Herausforderungen, hybrid_situation_spec, kein kn_vorgabe).
3. **`assets/set-template.json`** — Set-Dokument-Struktur (austausch_phase, dekontextualisierungs_aufgabe).
4. **`assets/kn-template.json`** — KN-Dokument-Struktur (Hybrid + 3 Typen + bi-dim Rubrik).
5. **`references/json-field-mapping.md`** — Feld-fuer-Feld-Vorgaben mit Datentyp, Quelle, Beispiel.
6. **`src/data/einheiten/1.1.1_konflikt_kommunizieren/herausforderung_A.json`** — kanonische 5er-Referenz fuer renderer-konforme Strukturen (Felder, die zwischen 5er und 3er gleich sind).

**Verbotene Aenderungen am JSON-Schema:**

- Felder umbenennen (`text` vs. `frage`, `bloom` vs. `k_stufe`, `titel` vs. `label`, `punkte` vs. `inhalte`, `mindmap_zentrum` flat vs. nested `mindmap.zentrum`)
- `nrlp.gesellschaft` als Object statt Array
- `handlungsprodukt.schritte` als Strings statt `{label, hint}`-Objekten
- `template` aendern (muss `"default_4page_v2"` sein — Fixwert, von den DocS-Komponenten erwartet)
- `gruppenpuzzle_fragen` oder `vorgespraech_fragen` in `sit_*.json` einfuegen (wandern auf Set-Ebene)
- `bewertungsraster` mit Transfer-Zeile oder ohne `vollstaendig_wenn` (C1: genau 4 Zeilen — Leitfragen/Mindmap/Handlungsprodukt/Reflexion — je mit 2-4 `vollstaendig_wenn`-Bullets; der Transfer lebt im set-level Austausch-&-Transfer-Dokument)
- `emotion_tag` neu generieren (C1: deprecated, wird nicht mehr gerendert; bestehende Werte bleiben stehen)

**Verbotene Aenderungen am Frontend-Text (Umlaut-Regel, NEU in v1.4 — verbindlich):**

Alle Prosa-Felder, die im Frontend gerendert werden, MUESSEN echte Umlaute
`ä`/`ö`/`ü`/`Ä`/`Ö`/`Ü` verwenden. **Transliteration (ae/oe/ue/Ae/Oe/Ue) in
Prosa ist ein Bug**, kein Stil. Eszett `ß` bleibt verboten — immer `ss`.

Prosa-Felder (vollstaendige Liste, Pre-Write-Scan Pflicht):

| Datei | Felder |
|---|---|
| `sit_*.json` | `titel`, `situation_text`, `leitfrage`, `leitfragen_intro`, `leitfragen[].text`, `mindmap_zentrum`, `mindmap_aeste[].text`, `handlungsprodukt.{titel, format_detail, beschreibung, schreib_label, schreib_note}`, `handlungsprodukt.schritte[].{label, hint}`, `reflexion_fragen[].text`, `mehrdeutigkeit.{trade_off, hint}`, `dekontextualisierung.{frage, ziel}`, `prinzip_handoff.{kernkonzept, lehrmittel_anker, kn_aktivierung, transfer_check}`, `sk_anker[].wo`, `persona.{beruf, betrieb, ort}`, `zahlen_tabelle[].label`, `bewertungsraster[].kriterium`, `wochen_plan[].text`, `quellen_anker.chapters[]`, `quellen_anker.konzepte[]`, `lernfortschritt.*` |
| `prinzip.json` | `kern_kompetenzversprechen`, `herausforderungen[].{herausforderung, konfliktart, handlungsprodukt_typ}`, `mehrdeutigkeits_architektur.{trade_off_raum[], verbindlich}`, `dekontextualisierungs_anker.{anker_statement, transferfeld}`, `aspekte` Werte-Strings, `persona_pool_units.{berufe[], orte[]}`, `persona_pool_kn_neu.{berufe[], orte[]}`, `quellen_anker.{chapters[], konzepte[]}` |
| `set.json` | `austausch_phase.*`, `dekontextualisierungs_aufgabe.*`, `konzept_progression[].konzept` |
| `kn.json` | `hybrid_situation.{titel, text, leitfrage, alignment_note.*}`, `kn_typen[].fragestruktur[].frage`, `kn_typen[].aufgaben[].aufgabe`, `kn_typen[].reflexionsfragen[]`, `rubrik_shared.kriterien[].{name, stufen[].text, niveaubaender[].text}` |
| `begleiter.md` | Alle sichtbaren Prosa-Abschnitte, Tabellen-Zellen, Callouts, Headings |

NICHT betroffen (Transliteration bleibt zwingend):
- `id`, `prinzip_ref`, `kn_ref`, `set_ref`, `anchored_situations[]`, `herausforderungen[]`
- `topic_slug`, alle Filenames, Pfade
- JSON-Object-Keys, HTML-Class-Names
- `nrlp.modul`, `modul_titel` (NRLP-Kuerzel)
- Interne Lookup-IDs (z.B. `abteilung`, `beruf_id`, `ort_id`, `node_id`)
- `wissensknoten[]` (Slug-Form)

Validierung (verschaerfte Form von Phase 2 Pre-Write-Spellcheck):
1. Vor jedem JSON-Write: regex-Scan jedes Prosa-Feldes nach Pattern `/(ae|oe|ue|Ae|Oe|Ue)/` ausserhalb von Eigennamen-Whitelists (z.B. `Aarau`, `Olten` — Whitelist in `_common_misspellings.md`)
2. Bei Match: Pauschal-Transliterations-Tabelle aus `references/_common_misspellings.md` Section „Pauschal-Transliterations-Fixes" anwenden
3. Wenn nach Auto-Fix noch verdaechtige Sequenzen bleiben: `WARN_UMLAUT_RESIDUE` + Stelle ausgeben, User reviewt
4. Bei Fund von `ß`: `ERR_ESZETT_FOUND` — Auto-Fix zu `ss`

**Prosa-Begriff Trade-off → Zielkonflikt / Spannungsfeld (verbindlich, NEU):**

In allen gerenderten Prosa-Feldern (Liste oben + `begleiter.md`) ist der Anglizismus
„Trade-off" verboten — er ist fuer Lernende schwer nachvollziehbar. Er ist die
Operationalisierung der Schluesselkompetenz SK11 „Mehrdeutigkeit" und wird im Text
durch **Zielkonflikt** (wenn benannt/entschieden wird) oder **Spannungsfeld** (wenn
die Spannung/der Raum gemeint ist; deckt sich mit dem Renderer-Callout SPANNUNGSFELD)
ersetzt. Vollstaendige Regel + Wann-welcher-Begriff: `references/language-rules.md`
§5.4. JSON-Keys (`trade_off_raum`, `mehrdeutigkeit.trade_off`, `aktivierte_trade_offs`
…), Fehler-/Warncodes (`ERR_*` / `WARN_*`) und die Feld-Werte (Form „X vs. Y") bleiben
unveraendert — nur das sichtbare Wort wird ersetzt.

**Erlaubte additive Ergaenzungen:**
- `prinzip_ref`, `herausforderung`, `mehrdeutigkeit`, `dekontextualisierung`, `zirkularitaet_anker`, `quellen_anker`, `lernfortschritt` (Prinzip-First-Felder, additiv)
- `prinzip_handoff`, `sk_anker`, `lehrgang` (NEU im 3er-Set)

**Fixwerte:**
- `template`: `"default_4page_v2"`
- `wochen`: `3`
- `legacy` / `source_refs` / `registry_tags`: `{}`
- `bewertungsraster`: 4 Eintraege (siehe `assets/mission-template.json`), je mit `vollstaendig_wenn` (2-4 Bullets); keine Transfer-Zeile; `gewicht`/`abgabe` optional und unrendered
- `handlungsprodukt.scaffolding`: `{satzanfaenge, strategien, struktur}`, je >=1 Eintrag (ausgerichtet am HP-Format + Output-Sprachmodus)
- `leitfragen[].nr`: Integer 1-4
- `leitfragen[].feld_hoehe_mm`: 15
- `leitfragen[].loesung`: `{kern, zeilen[{label?, text, quelle?}]}` — 3-6 Zeilen, zusammen max. ~900 Zeichen (C10)
- `reflexion_fragen[].feld_hoehe_mm`: 10, `sub: null`
- `mindmap_aeste`: 4 Items, Ast 4 mit `optional: true`
- `handlungsprodukt.schritte`: 5 Items, je `{label, hint}` Objekt

**Downstream-Felder (NICHT in dieser Skill erzeugen):**
- `ki_vertiefung` → wird von `.claude/skills/hko-ki-vertiefung-generator/` (oder einem 3er-Pendant) nachtraeglich geschrieben
- `scaffolding` (top-level KI-Scaffolds) → wird von `.claude/skills/hko-scaffolding-generator/` (oder einem 3er-Pendant) nachtraeglich geschrieben. **NICHT zu verwechseln mit `handlungsprodukt.scaffolding` (satzanfaenge/strategien/struktur), das seit dem Auftrag/Dossier-Redesign (C6) DIREKT in Phase 2 erzeugt wird.**

Diese Skill produziert das Kern-Set-JSON ohne `ki_vertiefung` und ohne top-level `scaffolding` (aber MIT `handlungsprodukt.scaffolding`).

**Output** — alle Dateien in `src/data/einheiten/{X.Y.Z}_{topic_slug}/`, **unpraefixierte** Namen:
- `prinzip.json` — roter Faden
- `herausforderung_A.json`, `herausforderung_B.json`, `herausforderung_C.json` — 3 Herausforderung-JSONs
- `set.json` — Set-Dokument (Austausch + Transfer)
- `kn.json` — Kompetenznachweis (Hybrid + 3 Typen + Rubrik)
- `begleiter.md` — Lehrperson-Begleitdokument (vollstaendiges Markdown-Kompendium)

> **KANONISCHE NAMEN (Stand 2026-06, verbindlich):** Dateien `herausforderung_{A|B|C}.json`,
> `id: {X.Y.Z}_{topic_slug}_hf_{LETTER}`, Buchstaben-Feld `buchstabe`, Set-Array
> `herausforderungen[]`, KN-Array `anchored_situations[]`. Jede `sit_*`/`_sit_{LETTER}`-Kurzform
> in diesem Skill **und** in den References meint diese Herausforderung-Dateien. `bbw-hko`
> (`scripts/build-einheiten-index.mjs` + `src/lib/einheiten/index.ts`) lädt **ausschliesslich**
> `herausforderung_A/B/C.json` — ein `sit_A.json`-Deployment würde stillschweigend NICHT geladen.

Alle Outputs landen in `src/data/einheiten/{X.Y.Z}_{topic_slug}/`. Danach nur noch Index-Rebuild (siehe DEPLOYMENT am Ende).

**Templates** (in `assets/`)
- `mission-template.json` — Struktur fuer eine Herausforderung
- `prinzip-template.json` — Prinzip-Dokument
- `set-template.json` — Set-Dokument
- `kn-template.json` — KN-Dokument

**References** (in `references/`)
- `prinzip-architecture.md` — Phase 0.5 Design-Regeln
- `kn-architecture.md` — Phase 4 Design-Regeln (Hybrid-Herausforderung, 3 KN-Typen, Rubrik)
- `json-field-mapping.md` — Feld-fuer-Feld Mapping
- `coherence-checklist.md` — 32 Checks v2.4 (Phase 2: 1-9+14+17-WARN+18-Sit+19-24+30+31+32, Phase 4: 10-13+15-16-WARN+18-KN, Phase 5/Begleiter: 25-29)
- `references/_common_misspellings.md` — Bekannte Spell-Halluzinationen, Pre-Write-Check-Liste
- `hko-framework.md` — 12 SK, 9 Sprachmodi, 8 Aspekte, 8 Themen, Bloom, IPERKA, AViVA, bi-dim Rubric
- `language-rules.md` — Swiss Standard German, ICH-Perspektive, verbotene Phrasen
- `_migration_notes.md` — 5er-zu-3er Delta-Doku

---

## Input Format

Der User gibt drei Dinge:

1. **NRLP-Subkapitel-Referenz** — String in `X.Y.Z`-Format (z.B. `2.1.2` fuer «Manipulation und Desinformation erkennen»)
2. **Lehrgang** — eines von `EBA_2J` / `EFZ_3J` / `EFZ_4J` (default `EFZ_3J`, wird in Phase 2 erfragt falls nicht im Input)
3. **Textbook chapter texts** — als Pfad oder Inline-Paste
4. **Fokus-Hinweis (optional)** — kurze Phrase, die die Linse des Sets signalisiert (z.B. „Kommunikation", „Marktlogik", „Identitaet")

Wenn der User keinen Fokus angibt: Skill schlaegt in Phase 0.5 drei Kandidaten vor.

### Lehrmittel Source Files
Textbook chapters liegen unter `material/_lehrmittel/` (Ausgabe **LM-26**, 73 Kapitel) mit Page-Markers `[seite: XX]`. Dateinamen: `{kap}_{Titel_mit_Unterstrichen}.md`.

**Lookup: ausschliesslich ueber `references/nrlp-lehrmittel-crosswalk.md`.**

nRLP-Nummerierung und Lehrmittel-Nummerierung sind zwei unabhaengige Systeme. Aus `nRLP X.Y.Z` folgt **nicht** Lehrmittel-Kapitel `X.Y` — `nRLP 2.1.2` (Desinformation) wuerde sonst `2.1 Lohnbestandteile` ziehen statt `7.1 Medien` / `20.7 Medienkompetenz`. Nur in T1 faellt die Kollision zufaellig nicht auf. Niemals den Dateinamen aus der nRLP-Nummer ableiten.

Der Crosswalk ist nach **Lehrgang und Lebensbezug** geschluesselt — 3J und 4J nummerieren unterschiedlich (Konsum ist `3.1` im 3J, aber `1.3` im 4J). Fehlt ein Lebensbezug in der Tabelle: nicht raten, sondern ueber Kapiteltitel suchen, der Lehrperson vorlegen und den Crosswalk danach ergaenzen.

---

## Six-Phase Workflow

```
PHASE 0     NRLP-Lookup                     → nrlp Extraktion, Kapitel-Index
PHASE 0.5   Prinzip-Formulierung            → prinzip.json (roter Faden)
PHASE 1     Herausforderung-Ideation (3 facets)   → 6 Optionen anchored an 3 Herausforderungen
PHASE 2     JSON-Generation (3 Herausforderungen) → 3 sit_*.json mit prinzip_ref
PHASE 3     Set-Dokument                    → set.json (Austausch + Transfer)
PHASE 4     KN-Generierung (INLINE)         → kn.json (Hybrid + 3 Typen + Rubrik)
PHASE 5     Begleiter-Dokument              → begleiter.md (vollst. Lektion-fuer-Lektion Kompendium)
DEPLOY      Index-Rebuild                   → npm run build:einheiten-index
```

Jede Phase finished bevor die naechste startet. Nach Phase 0.5 (Step 3), nach Phase 1 (Selektion), in Phase 4 Step 2 (Hybrid-Herausforderung-Approval) und in Phase 2 bei jeder `knoten_ref`-Ausnahme ueber 3 Seiten (Check 31) stoppt die Skill und wartet auf User-Input. Phasen 3 und 5 laufen sequentiell ohne Confirmation; Phase 2 ebenfalls, ausser es faellt eine `knoten_ref`-Ausnahme an. Phase 4 darf isoliert nachgezogen werden, wenn Phasen 0-3 bereits gelaufen sind. Phase 5 darf ebenfalls isoliert nachgezogen werden, wenn Phasen 0-4 bereits abgeschlossen sind.

---

### PHASE 0 — NRLP-Lookup

NRLP `X.Y.Z` parsen, den **zum Lehrgang passenden** Datensatz lesen (`EFZ_3J` → `public/nrlp_3j.json`, `EFZ_4J` → `public/nrlp_4j.json`, `EBA_2J` → `public/nrlp_2j.json` — siehe Addendum §B; es gibt keine Datei `nrlp.json`), hierarchisch extrahieren (Thema → Lebensbezug → Kompetenz), Kapitel-Index aus `[seite: XX]`-Markers bauen.

**Step 1 — Parse:** `thema_nr = X`, `lebensbezug_nr = "X.Y"`, `kompetenz_nr = "X.Y.Z"`, `modul = "X.Y"`.

**Step 2 — Extract:**

| Level | Felder |
|---|---|
| Thema | `titel`, `leitidee`, Schluesselkompetenzen → **Step 2a** |
| Lebensbezug | `text`, `lektionen` |
| Kompetenz | `text`, `gesellschaftliche_inhalte[]`, `sprachmodi[]` |

**Step 2a — Thema-SK aus der Zirkularitaet ableiten, nicht aus `themen[]` (verbindlich, NEU):**

Die SK eines Themas stehen im Datensatz **zweimal**:

- `themen[].schluesselkompetenzen` — Array von SK-Langtexten
- `zirkularitaet.schluesselkompetenzen[].wiederholungen` — Map SK → `{"T5": "R2", …}`; spiegelt die SK-Spirale auf S. 5 des Bildungsrats-SLP

Die beiden sind schon einmal auseinandergedriftet: von 2026-06-14 bis 2026-08-16 fuehrte `nrlp_4j.json` fuer T5 **eine** SK, wo die Spirale sechs nennt (T4: 5 statt 7, T6: 4 statt 5). Wer nur `themen[]` liest, baut die Einheit auf einer zu schmalen SK-Basis auf — und nichts schlaegt fehl, das Set wirkt bloss duenn. Genau so ist der Fehler im August 2026 aufgefallen.

**Regel:** Die Thema-SK-Liste **immer** aus `zirkularitaet.schluesselkompetenzen[].wiederholungen['T{X}']` ableiten. `themen[].schluesselkompetenzen` dient nur als Gegenprobe und liefert die Langtexte.

- Beide Listen gleich lang und deckungsgleich → weiter.
- Abweichung → `WARN_SK_DRIFT` ausgeben (beide Listen zeigen, R-Stufen mitliefern), **die Zirkularitaets-Liste verwenden** und Pietro informieren, damit der Datensatz repariert wird. Nicht stillschweigend weiterarbeiten und nicht selbst am Datensatz herumschreiben.

Repo-seitiger Waechter: `npm run check:nrlp` (`scripts/check-nrlp-consistency.mjs`) laeuft als erster Prebuild-Schritt und bricht ab, wenn die beiden Seiten sich widersprechen oder ein SK-Langtext nicht exakt einem der zwoelf kanonischen Strings entspricht. Bei Zweifeln am Datensatz einmal laufen lassen. Hintergrund: `docs/nrlp-4j-sk-bug-2026-08.md`.

**Step 3 — Derive `nrlp`-Felder:** siehe `references/json-field-mapping.md` Paragraph 1.

**Step 4 — Kapitel bestimmen + Index bauen.** Zuerst `references/nrlp-lehrmittel-crosswalk.md` fuer `(lehrgang, lebensbezug_nr)` nachschlagen — **nie** die Datei aus der nRLP-Nummer raten. Dann Kapitel-Index aus `[seite: XX]`-Markers bauen. Bei fehlenden Markers: Fallback-Modus mit `"Kap. X.Y"` ueberall.

**Fehlt die Zeile oder bestehen Zweifel:** Gegenlesung mit dem NotebookLM-Notebook «Allgemeinbildung26» — Vorgehen, Query-Vorlage und Filterregeln im Abschnitt *«Gegenlesung mit NotebookLM»* desselben Crosswalks. Der Notebook fuettert die Tabelle, er ersetzt sie nicht: Ergebnis eintragen, Aenderungsprotokoll nachfuehren, danach mit der Tabelle weiterarbeiten. **Nicht** bei jeder Generierung live abfragen — das macht Einheiten unreproduzierbar.

**Step 5 — Confirm + proceed zu Phase 0.5:**

```
NRLP X.Y.Z geladen:
Thema: T{X} — {titel}
Lebensbezug: {X.Y} — {text}
Kompetenz: {kompetenz.text}
Gesellschaft: {aspekte mit iterationen}
Sprachmodi: {liste}
SK (Thema-Ebene, aus Zirkularitaet): {nummern + namen + R-Stufe}
  Gegenprobe themen[]: {deckungsgleich | WARN_SK_DRIFT — Abweichung benennen}
Kapitel-Index: {Liste}
```

---

### PHASE 0.5 — Prinzip-Formulierung

**Read** `references/prinzip-architecture.md` fuer Design-Regeln. **Read** `assets/prinzip-template.json` fuer Zielstruktur.

#### Step 1 — Drei Kandidaten-Kern-Versprechen vorschlagen

Aus Chapter-Content + NRLP-Kompetenz-Text drei Kandidaten ableiten. Jeder Kandidat:
- Ein Satz, ICH-Perspektive
- Endet auf K3- oder K4-Verb
- Paraphrasiert mindestens ein Aktionsverb der Kompetenz
- Impliziert eigenen SK-Schwerpunkt (unterscheidbar von den anderen Kandidaten)
- Ermoeglicht Mehrdeutigkeit (Spannungsfeld-Raum, der ueber 3 Herausforderungen traegt)

Praesentiere als kompakten Block:

```
Drei moegliche Kern-Versprechen fuer das 3er-Set X.Y.Z:

1) {KANDIDAT 1 IN GROSSBUCHSTABEN}
   "{Ich-Satz, K3/K4-Verb}"
   SK-Kern: {2 Nummern}, Modi: {schriftlich/muendlich/audiovisuell}, Mehrdeutigkeit: {zielkonflikt}
   3 Herausforderungen leicht differenzierbar / mittel / schwer

2) {KANDIDAT 2}
   ...

3) {KANDIDAT 3}
   ...

Welcher Kern soll der rote Faden werden? (1, 2 oder 3)
Wenn keiner passt, beschreib in einem Satz, was du suchst.
```

**Stop. Wait for user selection.**

#### Step 2 — Selektion zu Prinzip expandieren

Vollstaendiges `prinzip.json` gemaess `assets/prinzip-template.json`. Felder:

| Feld | Inhalt |
|---|---|
| `id` | `"{X.Y.Z}_{topic_slug}_prinzip"` |
| `modul` / `kompetenz_nr` / `lehrgang` | aus NRLP / User-Input |
| `topic_slug` | abgeleitet aus Chapter + Fokus, snake_case, ohne Umlaute, 2-4 Worte |
| `kern_kompetenzversprechen` | gewaehlter K3/K4-Satz in ICH-Form |
| `bloom_zielprofil` | LF1=K2, LF2=K3, LF3=K3, LF4=K3+/K4 (verbindlich fuer Phase 2) |
| `herausforderungen` | 3 Eintraege A/B/C, je `{herausforderung, konfliktart, handlungsprodukt_typ, transferrable: true}` |
| `sk_pro_situation` | provisorisch je 2-3 SK pro A/B/C |
| `sk_schnittmenge_kn.primary` | SK in >=2 der 3 Herausforderungen (kein secondary) |

#### Step 2a — Aspekt-Antizipation aus Konfliktarten

NACH Definition der drei `herausforderungen[*].konfliktart`, VOR Befuellung von `aspekte`. Pruefe jede Konfliktart gegen folgende Heuristik:

| Konfliktart-Signalwort | Aktivierter Aspekt |
|---|---|
| fair / gerecht / ethisch / Verantwortung / Werthaltung | Ethik |
| Recht / Regel / Vorschrift / Pflicht / Vertrag | Recht |
| Identitaet / Rolle / Zugehoerigkeit / Sozialisation | Identitaet und Sozialisation |
| Umwelt / Ressource / Bilanz / CO2 / Nachhaltigkeit | Oekologie |
| Markt / Preis / Wert / Konsum / Wertschoepfung | Wirtschaft |
| Macht / Politik / Regulation / Staat | Politik |
| Digital / Technologie / Automatisierung | Technologie und digitale Transformation |
| Kultur / Tradition / Norm-Konflikt | Kultur |

**Strikte Anwendung (NEU in v1.2):** Die Heuristik greift NUR, wenn das Signalwort in der
`herausforderungen[*].konfliktart`-String selbst auftaucht — nicht in
`situation_text`, nicht in `reflexion_fragen`, nicht in irgendeinem anderen
Sit-Inhalt.

Wenn ein Aspekt didaktisch wichtig ist, aber das Signal NICHT in der
konfliktart liegt: die konfliktart umformulieren, sodass das Signal explizit
wird. Beispiel: `"Marktlogik vs. knappe Ressourcen + Ich-Konsumreflexion"`
aktiviert `Identitaet und Sozialisation` legitim.

Reine narrative Praesenz (z.B. Ich-Form in situation_text) ist KEIN
Aspekt-Aktivator.

`prinzip.aspekte` wird befuellt mit:
- NRLP-Aspekten aus `nrlp.kompetenz.gesellschaftliche_inhalte[]`
- PLUS allen Aspekten, die durch mindestens eine `konfliktart` aktiviert werden (Signalwort muss im konfliktart-String enthalten sein)

Bei Review (Step 3) explizit ausgewiesen (mit Begruendung):

```
Aspekte (mit Begruendung):
  - Wirtschaft (NRLP-Kompetenz, R1)
  - Oekologie (NRLP-Kompetenz, R1)
  - Ethik (antizipiert: Herausforderung B konfliktart 'fair/Verantwortung'
     → Signal 'Verantwortung')
  - Identitaet und Sozialisation (NICHT antizipiert — kein Signal in
     konfliktart_A/B/C)

Pietro kann jeden antizipierten Aspekt einzeln entfernen, oder die
konfliktart-Formulierung anpassen, damit ein neuer Aspekt legitim
aktiviert wird.
```

User kann widersprechen und das Set anpassen.

| `aspekte` | Object aspekt → R-Stufe |
| `modi_units` / `modi_kn` | siehe Template |

**modi_units-Befuellung (gefiltert, v1.1):**

1. Kandidaten = `nrlp.kompetenz.sprachmodi[].modus`
2. Filter: nur Modi, die durch mindestens ein `herausforderungen[*].handlungsprodukt_typ` aktiv trainiert werden (Heuristik siehe coherence-checklist.md Check 5a)
3. modi_units = gefilterte Liste

**modi_kn-Befuellung:**

modi_kn = modi_units (Pflicht-Obermenge)
         ∪ {Produktion muendlich, Interaktion und Kollaboration muendlich} (fuer Fachgespraech-KN-Typ)
         ∪ {Produktion schriftlich und bildlich, Rezeption schriftlich und bildlich} (fuer Mini Case schriftlich)
| `mehrdeutigkeits_architektur` | `trade_off_raum[]` (>=2), `verbindlich` (Regel) |
| `dekontextualisierungs_anker` | generisches Prinzip-Statement + Transferfeld |
| `zirkularitaet` | r1_aktuell, r2_voraussicht, r3_voraussicht |
| `quellen_anker.chapters[]` / `.konzepte[]` | Lehrmittel-Anker + Vokabular |
| `persona_pool_units` | 3 berufe + 3 orte |
| `persona_pool_kn_neu` | 2 berufe + 2 orte, disjunkt von _units |
| `hybrid_situation_spec` | Constraints fuer Phase 4 (max 120 Woerter, ICH, must_activate_trade_offs_min: 1, ...) |

**persona_pool_units (verbindlich kanonisch, v1.3, Umlaut-clarification v1.4):**

`berufe` und `orte` werden ausschliesslich aus `references/hko-framework.md` §11
(Kanonische Lehrberufe + Schweizer Staedte) gewaehlt. Die Lehrberufe-Tabelle ist
nach den vier BBW-Abteilungen gruppiert (Bau, Technik/Ernährung, Maschinenbau,
Informatik); verwandte Berufe sind zu IDs zusammengefasst (z.B. `informatiker`
deckt alle drei Fachrichtungen ab).

**Wichtig — Schreibweise:** In `persona_pool_units.berufe[]` und
`persona_pool_kn_neu.berufe[]` wird der **String aus Spalte „Schreibweise mit
Umlauten"** uebernommen (z.B. `"Bäcker-Konditor-Confiseur/in EFZ"`,
`"Land-/Baumaschinenmechaniker/in EFZ"`) — nicht die ID aus Spalte 1. IDs sind
nur die interne Lookup-Form fuer Abteilungs-Mix-Validierung. Analog `orte[]`:
`"Zürich"`, `"St. Gallen"` — nicht `zuerich`, `sankt_gallen`.

Pre-Write-Validierung:
- Jeder beruf-Eintrag muss string-identisch mit der **Umlauten-Spalte** der Kanonischen-Lehrberufe-Tabelle sein (kein Fuzzy-Matching, keine Transliteration)
- Jeder ort-Eintrag muss string-identisch mit der **Umlauten-Spalte** der Staedte-Tabelle sein
- Bei Mismatch: `ERR_PERSONA_NOT_CANONICAL` — Skill stoppt, Pietro waehlt aus der Liste
- Hinweis: ae/oe/ue-Schreibweise eines Berufs in persona.beruf ist automatisch ein Bug — entweder kanonisch (mit Umlauten) oder gar nicht

**Abteilungs-Mix-Pflicht (NEU in v1.3):**

Die 3 Berufe in `persona_pool_units` MUESSEN aus mindestens 3 verschiedenen
BBW-Abteilungen stammen. Lookup jeder ID → Abteilung via Tabelle in
`hko-framework.md` §11.
- `count(unique_abteilungen(units)) >= 3` — sonst `ERR_PERSONA_ABTEILUNG_MONO`,
  Skill stoppt, Pool muss neu gezogen werden
- Standardmuster: je ein Beruf aus drei der vier Abteilungen (z.B. Bau +
  Informatik + Technik/Ernaehrung)
- Auswahl per Generation aktiv durchmischen: nicht zweimal hintereinander
  dieselbe Drei-Abteilungs-Kombi vorschlagen

`persona_pool_kn_neu` analog, plus:
- Check 9 (disjunkt von _units) bleibt
- Mindestens einer der 2 KN-neu-Berufe MUSS aus einer Abteilung stammen, die
  in `persona_pool_units` gar nicht vertreten ist — sonst
  `WARN_PERSONA_KN_NEU_NO_NEW_ABTEILUNG`, User-Bestaetigung erforderlich.
  Ziel: Unseen-Transfer auf eine neue Berufsbranche.

#### Step 3 — User Review (Markdown, nicht raw JSON)

```
PRINZIP {X.Y.Z}_{topic_slug}

Kern: "{kern_kompetenzversprechen}"

Herausforderungen:
  A: {herausforderung} — {konfliktart} → {handlungsprodukt_typ}
  B: ...
  C: ...

SK-Architektur:
  Pro Unit: A={sk}, B={sk}, C={sk}
  KN-Schnittmenge (primary, SK in >=2/3): {sk}

Aspekte (mit Begruendung):
  {fuer jeden NRLP-Aspekt: "- {aspekt} (NRLP-Kompetenz, R{stufe})"}
  {fuer jeden antizipierten Aspekt: "- {aspekt} (antizipiert: Herausforderung {X} konfliktart '{signal}' → Signal '{wort}')"}
  {wenn kein Signal: "- {aspekt} (NICHT antizipiert — kein Signal in konfliktart_A/B/C)"}

Pietro kann jeden antizipierten Aspekt einzeln entfernen, oder die
konfliktart-Formulierung anpassen, damit ein neuer Aspekt legitim
aktiviert wird.

Mehrdeutigkeit (Spannungsfelder):
  - {trade_off_1}
  - {trade_off_2}
  ...

Transfer-Anker:
  "{generisches Prinzip}"

Hybrid-Herausforderung-Spec:
  max 120 Woerter, ICH, mind. 1 Spannungsfeld, Persona aus persona_pool_kn_neu

Personas:
  Units (3): {berufe + orte}
  KN-neu (2): {berufe + orte}

Passt das? (ja / Aenderungen)
```

**Stop. Wait for user approval.**

#### Step 4 — Save Prinzip

Schreibe `src/data/einheiten/{X.Y.Z}_{topic_slug}/prinzip.json`. Confirm: `✓ {X.Y.Z}_{topic_slug}/prinzip.json gespeichert`. Proceed zu Phase 1.

---

### PHASE 1 — Herausforderung-Ideation

**Niemals JSON oder HTML in Phase 1 generieren.**

#### Step 1 — 6 Optionen (2 pro Herausforderung A/B/C)

Pro Herausforderung zwei Kandidaten-Herausforderungen. Jeder Kandidat:
- Matched die Konfliktart + Handlungsprodukt-Typ der Herausforderung
- ICH-Perspektive
- K3/K4 (kein purer K1)
- Beruf + Betrieb + Ort aus `persona_pool_units`
- Mindestens ein Trade-off aus `trade_off_raum`
- Konkrete Kapitel + Seite aus Kapitel-Index

#### Step 2 — Tabelle praesentieren

```
| # | Herausforderung | Titel | Emotion-Tag | Kern-Problem (ICH) | Handlungsprodukt | Quellen |
| 1 | A: {herausforderung} | "..." | Ueberraschung | Ich ... | {format} | Kap. X.Y S. NN |
| 2 | A: {herausforderung} | "..." | ... | ... | ... | ... |
| 3 | B: {herausforderung} | "..." | ... | ... | ... | ... |
| 4 | B: {herausforderung} | "..." | ... | ... | ... | ... |
| 5 | C: {herausforderung} | "..." | ... | ... | ... | ... |
| 6 | C: {herausforderung} | "..." | ... | ... | ... | ... |
```

Below:
> Waehle eine Variante pro Herausforderung (z.B. „1, 3, 5" oder „2, 4, 6"). Bei Bedarf zwei neue Varianten fuer eine Herausforderung anfordern.

**Stop. Wait for user selection.**

Bei <3 Selektionen: abort mit Hinweis „Mindestens 3 Herausforderungen gewaehlt — sonst ist der Set-Austausch nicht durchfuehrbar und die Hybrid-KN ist nicht entwickelbar."

---

### PHASE 2 — JSON-Generation

Read `assets/mission-template.json` + `references/json-field-mapping.md`.

**Schritt 1 — Lehrgang bestaetigen.** Falls noch nicht im User-Input: kurz erfragen (Default `EFZ_3J`).

**Schritt 2 — Pro Herausforderung (A, B, C in Selektions-Reihenfolge) fuellen:**

| Feld | Quelle |
|---|---|
| `id` | `{X.Y.Z}_{topic_slug}_hf_{LETTER}` |
| `modul` / `modul_titel` | NRLP |
| `lehrgang` | User-Input |
| `buchstabe` | A/B/C |
| `sit_farbe`/`_light`/`_mid` | Farb-Triple-Tabelle (`json-field-mapping.md`) |
| `titel` | aus Phase 1 (kein `emotion_tag` mehr generieren — C1) |
| `wissensknoten` | mind. 1 node_id-Slug |
| `nrlp.*` | aus Phase 0 (sk situationsspezifisch!) |
| `persona` | aus `prinzip.persona_pool_units` |

**Mehrfachabdeckung (B1):** `nrlp.nr_primary` listet die Kompetenz-Nummern, die diese Herausforderung **tatsächlich** übt/prüft. Default = nur die Primär-Kompetenz `["{X.Y.Z}"]`. Deckt die Herausforderung nachweislich eine weitere nRLP-Kompetenz mit ab, deren Nummer ergänzen (z. B. `["1.1.1","1.1.3"]`). **Welche Sekundär-Kompetenzen gelten, entscheidet Pietro — nicht raten; im Zweifel nur Primär.**

**Persona-Verbrauchstracking (NEU in v1.1):**

Beim Befuellen von `herausforderung_{LETTER}.persona`:
- Tracke verwendete `beruf`- und `ort`-Werte in einer internen Liste `used_berufe[]` / `used_orte[]`
- Jeder Beruf aus `persona_pool_units.berufe` darf in genau einer Herausforderung verwendet werden
- Jeder Ort aus `persona_pool_units.orte` analog
- Bei Konflikt (Beruf bereits verbraucht): `ERR_PERSONA_DUPLICATE_USE` — Skill stoppt, schreibt nicht
- Nach allen 3 Sits: Coherence Check 14 erzwingt vollstaendigen Pool-Verbrauch

| `situation_text` | 4-6 Saetze, Ich-Form (1. Person Singular), mit CHF/Fakten |
| `zahlen_tabelle` | `[]` oder `[{label, wert}]` |
| `leitfrage` (singular) | kondensierte Haupt-Frage |
| `leitfragen[]` | 4 Items, K2/K3/K3/K3+ oder K4; **LF4 = fokussierte Output-Sprachmodus-Teilaufgabe (ein Baustein), nicht das ganze Handlungsprodukt (C4)**. `knoten_ref` **Richtwert 3 Seiten**, Seitenzahlen aus echten `[seite: NN]`-Markern, Abschnitt ueber Ueberschriften bestimmen — nie den ganzen Kapitelbereich einsetzen. Mehr als 3 Seiten sind erlaubt, wenn der Inhalt wirklich verteilt steht, aber **nur nach Ruecksprache** (C9, Check 31). Je LF eine `loesung` {kern, zeilen[]} — Lehrpersonen-Antwort auf **der Bloom-Stufe der Frage**, aus dem `knoten_ref`-Abschnitt gehoben (C10, Check 32) |
| `mindmap_zentrum` / `mindmap_aeste` | flat top-level; genau 4 Aeste, Ast 4 `optional: true` (radial/Quadrant) |
| `handlungsprodukt.*` | aus prinzip.herausforderungen[LETTER].handlungsprodukt_typ; inkl. `scaffolding` {satzanfaenge/strategien/struktur} (C6) und `musterloesung` {hinweis, abschnitte[]} (C7) |
| `reflexion_fragen` | Template-Defaults, situationsspezifisch anpassbar |
| `bewertungsraster` | 4 Eintraege, je mit `vollstaendig_wenn` (2-4 Bullets); keine Transfer-Zeile (C1) |
| `wochen_plan` | 3 Eintraege Template-Default |
| Prinzip-First additiv | prinzip_ref, herausforderung, mehrdeutigkeit, dekontextualisierung, zirkularitaet_anker, quellen_anker, lernfortschritt |
| NEU 3er | `prinzip_handoff` (kernkonzept, lehrmittel_anker, kn_aktivierung, transfer_check), `sk_anker` (Laenge == nrlp.sk.length) |

**Validation pro Herausforderung** (vor dem Schreiben):
- Alle Renderer-Pflichtfelder gesetzt
- `id`, `prinzip_ref`, `herausforderung.label` passen
- `nrlp.sk` und `sk_anker` haben gleiche Laenge (Check 8)
- Mindestens eine LF auf K3+/K4 (Check 7)
- `mehrdeutigkeit.trade_off` ∈ `prinzip.mehrdeutigkeits_architektur.trade_off_raum` (Check 6 — alle 3 Pflicht)
- Keine Eszett, keine `gruppenpuzzle_fragen` / `vorgespraech_fragen`, kein neu generiertes `emotion_tag`
- `bewertungsraster.length === 4`, jede Zeile mit 2-4 `vollstaendig_wenn`; keine Transfer-Zeile (Check 19)
- `handlungsprodukt.scaffolding` mit je >=1 Eintrag in satzanfaenge/strategien/struktur (Check 23)
- `handlungsprodukt.musterloesung` mit 3-5 `abschnitte`, je `{titel, zeilen[]}`; pro Abschnitt max. ~900 Zeichen `text` (Check 30)
- Jede `leitfragen[]` mit `loesung` (3-6 Zeilen, ~900 Zeichen); Sachaussagen durch den `knoten_ref`-Abschnitt gedeckt; Entscheiden-LF mit Alternativ-/Ausschluss-Zeile (Check 32)
- `nrlp.sprachmodus_ids.length === nrlp.sprachmodi.length` (Check 21)
- LF4 ist fokussierte Output-Sprachmodus-Teilaufgabe, nicht das ganze Handlungsprodukt (Check 20)
- `mindmap_aeste.length === 4`, Ast 4 `optional: true` (Check 22)

**Schritt 2b — Leitfragen-Loesungen aus dem Lehrmittel heben (C10, NEU in v2.4):**

Die Loesungen werden **nicht formuliert, sondern gehoben** — Quelle ist derselbe Abschnitt, den `knoten_ref` der jeweiligen Leitfrage benennt. Pro Leitfrage:

1. **Abschnitt oeffnen.** `knoten_ref` → Kapiteldatei in `material/_lehrmittel/` (Kapitelnummer via `references/nrlp-lehrmittel-crosswalk.md`), zu den `[seite: NN]`-Markern springen. Steht die Antwort dort nicht, ist `knoten_ref` falsch — erst den Anker korrigieren (Check 31), dann die Loesung schreiben.
2. **Sachaussagen extrahieren**, je eine pro Zeile, in eigenen Worten verdichtet — keine abgeschriebenen Gesetzes- oder Lehrbuchsaetze. Die Fundstelle wandert als `quelle`-Chip mit (`"OR 321e"`, `"ArG 31"`, `"Kap. 19.2"`); **nur Artikel und Kapitel, die im gelesenen Abschnitt wirklich stehen.**
3. **Nach Bloom-Stufe formen** — die Loesung muss die Frage auf ihrer eigenen Stufe beantworten:

| `bloom` | Zeilen-Muster |
|---|---|
| `Verstehen` (LF1) | 4-6 Sachzeilen mit `label` = Begriff (`"Treuepflicht"`, `"Sachinhalt"`), je ein `quelle`-Chip. Deckungsgleich mit den Pflicht-Aesten von `mindmap_aeste`. |
| `Anwenden` (LF2) | Pro Fallbestandteil eine Zeile mit Urteil im `label` (`"Unzulässig 1"`, `"Zulässig bleibt"`), plus eine Zeile `"Häufiger Fehler"` aus dem `[!warnung]`-Stolperstein derselben Sektion. |
| `Entscheiden` (LF3) | **Pflicht:** eine Zeile `"Erwartet"` (die auf Stufe 3 erwartete Wahl **mit** Begruendung) **und** mindestens eine Zeile `"Ebenfalls tragfähig"` oder `"Nicht tragfähig"`. Beide Pole stammen aus `mehrdeutigkeit.hint` — eine Entscheidungsfrage mit nur einer zulaessigen Antwort war keine. |
| `Formulieren` (LF4) | Der **eine** Baustein, den LF4 verlangt, ausformuliert (Satz/Absatz/Zeilen), `label` = Bauteil aus `handlungsprodukt.scaffolding.struktur`, plus eine Zeile `"Massstab"`. Nie das ganze Handlungsprodukt (C4) — das steht in `musterloesung`. |

4. **Kuerzen auf 3-6 Zeilen / ~900 Zeichen.** Die Deck-Folie ist ein Akkordeon mit genau einer offenen Leitfrage; laenger passt nicht auf die Folie.
5. **Gegenprobe:** Wuerde eine Lehrperson, die nur diese Zeilen sieht, die Antwort einer lernenden Person fair beurteilen koennen — ohne im Lehrmittel nachzuschlagen und ohne den `[!tafelbild]`-Callout zu widerlegen?

Kein Vorlese-Skript: Die Zeilen sind der **Massstab**, nicht die eine richtige Formulierung. Diesen Rahmen setzt das Deck bereits in den Referentennotizen; die Daten muessen ihn nur einhalten. Feldspezifikation: `references/json-field-mapping.md` §`leitfragen[].loesung`. Pruefung: Check 32.

**Nur ins JSON schreiben, nie in `begleiter.md`.** Der Begleiter bekommt die Loesungen automatisch: `loadEinheit` spiegelt sie beim Laden als `> [!loesung]`-Callouts je Herausforderung ein (`src/lib/einheiten/begleiter-loesungen.ts`), Word-Export und HTML-Ansicht inklusive. Wer sie zusaetzlich ins Markdown schreibt, erzeugt eine zweite Quelle, die driftet.

**Single-Format-Pflicht (NEU in v1.2):**

`handlungsprodukt.format_detail` darf KEINE Format-Alternativen enthalten,
die einen anderen Sprachmodus implizieren. Verbotene Muster:
- "... Alternativ: ..." (wenn die Alternative einen anderen Modus traegt)
- "... oder ..." (analog)
- "... auch moeglich: ..."

Erlaubt sind Modus-konsistente Variationen:
- "Video-Statement 1-2 Min., entweder mit Smartphone oder Stativ-Kamera"
- "Praesentation 5-7 Folien, Canva oder PowerPoint"

Pre-Write-Check: regex-Suche in format_detail nach `/(Alternativ(es)?|oder als|moeglich)/i`.
Bei Match: `WARN_MULTI_FORMAT_AMBIGUITY` — Skill bietet User-Entscheidung an:
  (a) Singularisieren auf primaeres Format (Modus bleibt)
  (b) Beide Formate beibehalten, modi_units um beide Modi erweitern
      (mit Konsequenz fuer Check 5b)

**Pre-Write-Spellcheck (NEU in v1.2, verschaerft in v1.4):**

Vor jedem `_herausforderung_{LETTER}.json`-Write:
1. Lade `references/_common_misspellings.md`
2. Iteriere durch die text-relevanten Felder (Liste siehe Section „Verbotene Aenderungen am Frontend-Text" oben sowie Liste in `_common_misspellings.md`)
3. **Umlaut-Restitution (NEU v1.4):** Wende die Section „Pauschal-Transliterations-Fixes" aus `_common_misspellings.md` auf jedes Prosa-Feld an. ae/oe/ue/Ae/Oe/Ue → ä/ö/ü/Ä/Ö/Ü, ausser in Eigennamen-Whitelist (z.B. `Aarau`, `Olten`, `Goethe`-Zitate). Persona.beruf wird aus der kanonischen Tabelle in `hko-framework.md` §11 mit Umlauten uebernommen — kein Re-Transliterieren.
4. Spell-Tabelle anwenden, logge `SPELLCHECK_FIX: {falsch} → {korrekt} in {feld}`
5. Nach allen Fixes: zweiter Scan auf Residual-Pattern `/(ae|oe|ue|Ae|Oe|Ue)/` in Prosa-Feldern. Bei Fund ausserhalb Whitelist: `WARN_UMLAUT_RESIDUE: {wort} in {feld}` — User reviewt
6. Eszett-Scan: `/ß/` → Auto-Fix zu `ss`, logge `ERR_ESZETT_FOUND` (wird automatisch gefixt, aber gemeldet)
7. Bei mehr als 5 Fixes in einem File: `WARN_SPELLCHECK_HEAVY` — User-Review empfohlen

**Schritt 2c — Werkzeugseite (`methoden`) fuellen — pro Herausforderung genau 4 Eintraege.**

Volle Referenz: `docs/methodenkartei.md`. Das Handlungsprodukt bekommt eine eigene Seite,
die benennt, **womit** es hergestellt wird. Ohne dieses Feld entfaellt die Seite —
die Einheit haette dann 7 statt 8 Seiten und die Luecke, die das Feature schliessen soll.

1. **Abgaben zerlegen.** Jede Zeile aus `handlungsprodukt.abgaben[]` fragt: Womit macht
   man das? Typisch 3–5 Werkzeuge, auf **genau vier** verdichten.
2. **Zuerst die Kartei fragen:** `ls src/data/methoden/`. Passt eine Karte, referenzieren —
   nicht neu schreiben.
3. **Dann das Lehrmittel fragen.** Die Methodenkapitel-Spalte in
   `references/nrlp-lehrmittel-crosswalk.md` ist der Einstieg. Neue Lehrmittel-Karte
   anlegen als `src/data/methoden/lm-{kap-mit-bindestrich}-{slug}.json` mit `quelle:
   "lehrmittel"`, `kap`, `lesen` (zwei Saetze — die Karte ersetzt das Kapitel nicht),
   `merk`. **`seiten` nur, wenn die Zahl am Buch verifiziert ist** — sonst weglassen.
   Eine geratene Seitenzahl im Schuelerheft ist schlimmer als keine.
4. **Erst wenn beides nichts hergibt:** eigene Karte `hko-{slug}.json` mit `quelle: "hko"`,
   `schritte` (4 nummerierte), `ankommt`, `merk`. Sie muss vollstaendig sein, dahinter
   kommt kein Kapitel. Die vier bekannten Luecken des Lehrmittels: mediale Produktion,
   gestaltete Kurzformate, digitale Zusammenarbeit, KI.
5. **Referenz schreiben** in `herausforderung_{LETTER}.json`:
   `{ "ref": "<id>", "fuer": "<wofuer in dieser Abgabe>", "tun": "<Uebertragung>" }`.
   `tun` nur bei Lehrmittel-Karten — es ist der Grund, warum die Karte existiert; ein
   blosser Kapitelverweis steht schon auf Seite 5. `tun` und `fuer` sind
   einheitenspezifisch und gehoeren **nie** auf die Karte.
6. **Musterbeispiel + Fehler** (`beispiel`, `fehler`) auf **genau zwei** der vier
   Karten — sie landen im Layout automatisch in der unteren, doppelt hohen Reihe.
   Bei dreien wird die Seite still abgeschnitten; bei nur einer steht unten eine kurze
   Karte neben einer langen und wird gestreckt. Zwei ist der ausbalancierte Fall. `beispiel` braucht ein **neutrales
   Sujet**, das mit dieser Einheit nichts zu tun hat (wie die Musterbriefe im Lehrmittel).
   `fehler` nennt ein *beobachtbares Symptom plus Abhilfe*, nicht die Verneinung von
   `ankommt`.

Nicht nach Herkunft sortieren — das macht der Renderer. Kein Index-Rebuild noetig.

**Schritt 3 — Coherence-Audit** ueber alle 3 Herausforderungen (Checks 1-9 in `coherence-checklist.md`). Bei Fehler stoppen.

**Schritt 4 — Files schreiben**, A → B → C:

```
src/data/einheiten/{X.Y.Z}_{topic_slug}/herausforderung_{LETTER}.json
```

Confirm jedes: `✓ {filename} gespeichert`.

Proceed zu Phase 3.

---

### PHASE 3 — Set-Dokument

Read `assets/set-template.json`. Generiere `set.json` mit:

- `id`, `prinzip_ref`, `kn_ref` (kn_ref zeigt auf zukuenftige Phase-4-Datei — das ist OK)
- `herausforderungen[]` = 3 IDs
- `konzept_progression[]` = 3 Eintraege, je `{position, situation, konzept}` (konzept aus `sit_*.prinzip_handoff.kernkonzept`)
- `austausch_phase` = template-konstant; generiere ALLE drei Sozialform-Schluss-Varianten fuer das set-level "Austausch & Transfer"-Dokument (C8): `einzelauftrag` (EA — Einzel-Synthese, ~5 Saetze + je ein Beispiel), `gruppenarbeit_jigsaw` (GA — 3 Runden; optional Alias `gruppenpuzzle`), `einzelarbeit_plenum` (PL — Plenum-Synthese; optional Alias `plenum`)
- `dekontextualisierungs_aufgabe` = template-konstant + `ziel` aus `prinzip.dekontextualisierungs_anker.anker_statement`. Bildet zusammen mit den drei `sit.dekontextualisierung.frage` (als Beispiele) die Transfer-Haelfte des Austausch-Dokuments.
- `status: "entwurf"` (aus dem Template uebernehmen) — JEDE neu generierte Einheit startet als Entwurf und ist damit nur fuer KT1 sichtbar. Erst nach interner Abstimmung wird sie publiziert: `status` auf `"publiziert"` setzen (oder Feld entfernen) -> `npm run build:einheiten-index` -> deploy. Fuer selektives Publizieren einzelner Bausteine einer sonst live Einheit dient `entwurf_komponenten` (z. B. `["ki-fluency"]`).

Output: `src/data/einheiten/{X.Y.Z}_{topic_slug}/set.json`.

Proceed zu Phase 4.

---

### PHASE 4 — KN-Generierung (INLINE)

Read `assets/kn-template.json` + `references/kn-architecture.md`.

#### Step 1 — Prerequisites laden
- `prinzip.json`, `herausforderung_A/B/C.json`, `set.json`
- Cross-Ref-Check: `prinzip_ref` matched ueber alle vier Files
- Bei Fehler: `ERR_KN_INPUTS`, Phase stoppt, schreibt nichts

#### Step 2 — Hybrid-Herausforderung generieren

Read `kn-architecture.md` Paragraph 2. Konstruiere eine **eine** Szene:
- Persona aus `prinzip.persona_pool_kn_neu[0]` (Default; `[1]` Reserve)
- max. 120 Woerter, ICH-Perspektive
- Aktiviert alle drei `herausforderung.konfliktart`-Aspekte gleichzeitig (sichtbar, nicht explizit benannt)
- Aktiviert mindestens einen Trade-off aus `prinzip.mehrdeutigkeits_architektur.trade_off_raum`
- Endet mit genau einer Leitfrage, die die Spannung benennt
- `alignment_note`: 1-2 Saetze Mapping (welcher Trade-off, welche Herausforderung aus welcher Herausforderung aktiviert)

User-Review (Markdown, kompakt):

```
HYBRID-SITUATION fuer KN {X.Y.Z}_{topic_slug}

Persona: {beruf} bei {betrieb} in {ort}
Emotion-Tag: {emotion}
Titel: "{titel}"

Szene ({woerter}/{max_woerter} Woerter, im text-Feld):
> {hybrid_situation.text}

(Persona, Titel, Leitfrage und alignment_note werden separat gezeigt und zaehlen nicht zur Wort-Quote.)

Leitfrage: "{leitfrage}"

Aktiviert: {trade_offs}
Alignment:
  A: {alignment_note.herausforderungen_mapping[A].scene_element}
  B: {alignment_note.herausforderungen_mapping[B].scene_element}
  C: {alignment_note.herausforderungen_mapping[C].scene_element}
{wenn new_dimensions nicht leer: "⚠ WARN_HYBRID_NEW_DIMENSION: Neue Dimension(en): {new_dimensions}"}

{wenn Lehrjahr-Sprung und lehrjahr_constraint == 'match_units': "⚠ WARN_HYBRID_LJ_MISMATCH: Hybrid-Persona ist im LJ{X}, Sit-Personas alle im LJ{Y}. Beabsichtigt?"}

Passt das? (ja / Aenderungen)
```

**Stop. Wait for user approval.**

Nach Hybrid-Generierung, vor User-Review:

1. **Lehrjahr-Check:** Vergleiche Lehrjahr der Hybrid-Persona gegen Lehrjahre der Sit-Personas. Bei Sprung und `lehrjahr_constraint == "match_units"`: `WARN_HYBRID_LJ_MISMATCH` ausgeben. User-Bestaetigung erforderlich.

2. **New-Dimension-Check:** Pruefe ob die Hybrid-Szene Konfliktdimensionen enthaelt, die in keiner `sit_*.herausforderung.konfliktart` vorkommen. Wenn ja: in `alignment_note.new_dimensions[]` aufnehmen, `WARN_HYBRID_NEW_DIMENSION` ausgeben. User-Bestaetigung: "Ist diese neue Dimension fuer den KN didaktisch erwuenscht?"

3. **Trade-off-Konsolidierung (NEU in v1.2):**

   Nach User-Approval der Hybrid-Szene, mechanisch aus `herausforderungen_mapping[]` ableiten:

   1. Sammle fuer jede gemappte Herausforderung den `sit_X.mehrdeutigkeit.trade_off`
   2. Dedupliziere die Liste (Set-Logik)
   3. Schreibe in `hybrid_situation.aktivierte_trade_offs`

   Beispiel: herausforderungen_mapping enthaelt A, B, C — dann werden A.trade_off,
   B.trade_off, C.trade_off gesammelt und dedupliziert. Wenn zwei Herausforderungen
   denselben trade_off aktivieren, erscheint er nur einmal.

   Manuelle Erweiterung ueber herausforderungen_mapping hinaus ist moeglich (Hybrid-Szene
   aktiviert einen weiteren Trade-off, der in keiner Herausforderung zentral ist), aber
   ungewoehnlich — sollte in `alignment_note.additional_trade_offs[]` separat
   begruendet werden.

#### Step 3 — KN-Typ 1 (Fachgespraech)

Aus `kn-template.json` `fragestruktur`-Skelett. Fuelle 5 Fragen (K2 → K3 → K3 → K4 → K4):
- Frage 1 (Erklaeren, K2): bezieht sich auf zentrales Hybrid-Element
- Frage 2 (Anwenden, K3): Konzept-Logik aus herausforderung_B (mittlere Herausforderung)
- Frage 3 (Beurteilen, K3): "beide Aspekte gleich bewerten? warum?"
- Frage 4 (Transfer, K4): Vergleich mit einer der drei Lernaufgaben
- Frage 5 (Werthaltung, K4): Akteur + Begruendung, weshalb nicht nur Marktfrage (oder topic-spezifische Analogform)

`sk` = Union der 3 sit_*.nrlp.sk dedupliziert, max 3 (Prioritaet: SK6 > SK11 > situativ).
`aspekte` = Union der 3 sit_*.nrlp.gesellschaft.
`sprachmodi` = konstant (Rezeption schriftlich+bildlich, Produktion muendlich, Interaktion muendlich).

#### Step 4 — KN-Typ 2 (Mini Case schriftlich)

Aus `kn-template.json` `aufgaben`-Skelett. Fuelle 4 Aufgaben (K2 → K3 → K3 → K4):
- Aufgabe 1 (Erklaeren): Fakten/Diagramm
- Aufgabe 2 (Unterscheiden): forciert Mehrdeutigkeit ("Beide ... entstehen durch ... Warum ist X ethisch anders zu beurteilen als Y?")
- Aufgabe 3 (Entscheiden): konkrete Entscheidung im Hybrid-Kontext
- Aufgabe 4 (Forderung): Policy/Intervention in Ich-Form

`sk`/`aspekte` analog zu Typ 1. `sprachmodi` = konstant (Rezeption + Produktion schriftlich+bildlich).

#### Step 5 — KN-Typ 3 (Werkschau + Transfer-Reflexion)

Template-konstant: `format`, `ablauf`, `reflexionsfragen`, `sprachmodi`.

**SK adaptiv (NEU in v1.1):**
1. Basis-Kandidaten = `[5, 6, 10]` (Werthaltungen, Standpunkte, Anpassung)
2. Filter: nur SK, die in `Union(herausforderung_A.nrlp.sk, herausforderung_B.nrlp.sk, herausforderung_C.nrlp.sk)` vorkommen, bleiben
3. Wenn nach Filter weniger als 2 SK uebrig: aus `prinzip.sk_schnittmenge_kn.primary` ergaenzen, bis 2-3 SK erreicht
4. Maximal 3 SK im Endergebnis

Beispiel 3.2.2: Union sit-SK = {1, 5, 6, 9, 11}. Basis [5, 6, 10] ∩ Union = [5, 6]. Ergaenzung aus primary [9, 11]: nimm SK11 (naeher zur Werkschau-Reflexion). Endergebnis: [5, 6, 11].

> **Rename-Touchpoint (D4):** Label «Werkschau + Transfer-Reflexion» und Key `werkschau_transfer` sind ein kuenftiger Rename-Touchpoint (Kanton-Begriff Werkschau/Portfolio noch ausstehend). Der Key bleibt stabil; bei einem Rename nur das sichtbare Label in `assets/kn-template.json` (`label`) + die Vorkommen in SKILL.md/References aendern — jetzt **nicht** umbenennen.

#### Step 6 — Rubrik-Anpassung

Lies `kn-architecture.md` Paragraph 6. Bestimme `dominanter_aspekt`:
- aus `sit_*.nrlp.gesellschaft[].aspekt`: jener, der in >=2 von 3 Herausforderungen vorkommt
- bei Gleichstand: erster Eintrag der NRLP-Kompetenz `gesellschaftliche_inhalte[]`

Passe `rubrik_shared.kriterien[2].name` an:

| Dominanter Aspekt | Kriterium-3-Name |
|---|---|
| Wirtschaft | Wirtschaftliches Prinzip |
| Recht | Rechtliches Prinzip |
| Ethik | Ethisches Prinzip |
| Identitaet und Sozialisation | Identitaetskonstrukt |
| Kultur | Kulturelles Prinzip |
| Oekologie | Oekologisches Prinzip |
| Politik | Politisches Prinzip |
| Technologie und digitale Transformation | Technologisches Prinzip |
| Gleichstand | `"Fachliches Prinzip aus {Aspekt}"` |

Stufen-Beschreibungen + Niveaubaender bleiben konstant.

#### Step 7 — Coherence-Audit (Checks 10-13, 16)

Aus `coherence-checklist.md`:
- Check 10: Hybrid aktiviert mind. 1 Trade-off, alignment_note benennt Mapping
- Check 11: Hybrid-Persona disjunkt von allen 3 sit_*.persona (beruf + ort)
- Check 12: KN-Typ 1 + 2 sk ⊆ Union(sit_*.nrlp.sk)
- Check 13: Rubrik-Shape (4 Kriterien, 2 SuK + 2 Ges, je 4 Stufen, 3 Niveaubaender)
- Check 16: aktivierte_trade_offs enthaelt alle trade_offs der gemappten Herausforderungen

Bei Fehler stoppen, kein File schreiben, Pietro reviewen lassen.

#### Step 8 — File schreiben

**Pre-Write-Spellcheck:** analog Phase 2 Step 2. Felder siehe
`references/_common_misspellings.md`.

```
src/data/einheiten/{X.Y.Z}_{topic_slug}/kn.json
```

Confirm: `✓ {X.Y.Z}_{topic_slug}/kn.json gespeichert`. Proceed zu Phase 5.

---

### PHASE 5 — Begleiter-Dokument (begleiter.md)

Generiere das Lehrperson-Begleitdokument als strukturiertes Markdown mit YAML-Frontmatter.
**Output:** `src/data/einheiten/{X.Y.Z}_{topic_slug}/begleiter.md`.

Das `begleiter.md` ist das vollstaendige Unterrichts-Kompendium — Lektion fuer Lektion, mit fertigen Scaffolds, Coaching-Moves und bi-dim Bewertungsbeispiel. Es wird vom `begleiter-builder.ts` zu einem gestalteten `.docx` umgewandelt und liegt in jedem ZIP-Bundle (EinheitWorkbench).

#### Frontmatter

```yaml
---
titel: "Begleit-Dokument — {modul_titel} ({X.Y.Z})"
kompetenz: "{X.Y.Z} — {kern_kompetenzversprechen}"
autor: "Kernteam 1 — BBW Winterthur"
stand: "{YYYY-MM-DD}"
lehrgang: "{EFZ 3J | EFZ 4J | EBA 2J}"
thema: "T{X} — {thema_titel}"
lebensbezug: "{X.Y}"
quellen_json:
  - "set.json"
  - "prinzip.json"
  - "herausforderung_A.json"
  - "herausforderung_B.json"
  - "herausforderung_C.json"
  - "kn.json"
---
```

#### Aufbau (Sektionen 0–8, zwingend in dieser Reihenfolge)

> **v2-Bausteine (Struktur-Spec TEIL 6, verbindlich):** Sektion 1 erhaelt neu **Kapitel 1.6 KI-Einsatz** (§E5). Jede Herausforderung (Sektionen 3–5) erhaelt vier neue Pflicht-Bausteine: `[!tafelbild]` (E4, vor der Scaffold-Werkstatt), «Wann ist das Produkt fertig?»-Haken-Liste (E2, nach den Scaffolds, **ohne** Prozente/Gewichte), `[!ki_einsatz]` (E5), `[!troubleshooting]` (E3, im Leitfragen-Block an der kritischen LF). Sektion 8 (KN) erhaelt je Prueffrage einen `[!erwartungshorizont]` (E1). Leitprinzip: **Datenhebung, nicht Neuerfinden** — E1/E2/E4 sind fast vollstaendig aus bereits vorhandenen JSON-Feldern generierbar; nur E5 und E3 brauchen Redaktion (E3 in der Pilot-Phase manuell pruefen, bevor der Skill ihn voll automatisch generiert).

**Praeambel-Callout** (direkt nach Frontmatter, vor Sektion 0):

```markdown
> Dieses Dokument richtet sich an die **Lehrperson**, nicht an die Lernenden.
> Die Unterlagen fuer die Lernenden (Herausforderungsblaetter A/B/C, KN-Blatt) liegen
> separat als gerenderte A4-Broschueren vor. Hier steht, **wie** du die Einheit
> fuehrst: Phasenablauf, fertige Scaffolds zum Abgeben, Coaching-Bewegungen,
> bi-dimensionale Bewertung.
```

**Sektion 0 — So funktioniert diese Einheit**

5 nummerierte Punkte (immer in dieser Form):
1. Von hinten gedacht (Backward Design) — erklaert, dass KN zuerst definiert wurde
2. Eine Kompetenz, drei Herausforderungen — benennt A/B/C mit ihren Sub-Herausforderungs-Kurzformen
3. Drei Phasen-Schichten — BBW 4-Phasen (ganze Einheit) / IPERKA (Lernaufgabe) / **AViVA-Bogen (eine Herausforderung, ~3 Lektionen, Richtwert ohne feste Taktung)** als Tabelle (3 Zeilen). Reichweite-Spalte: „Ganze Einheit" / „Eine Lernaufgabe" / „Eine Herausforderung (~3 Lektionen)". Für AViVA NIE „eine einzelne Lektion" schreiben.
4. Bewertet wird das Produkt, bi-dimensional — SuK und Ges als getrennte Noten; die situationsinternen Bewertungsraster (5 Zeilen: LF 20 / Mindmap 15 / HP 35 / Refl 15 / Dekontext 15) sind formative Erfahrungsnoten
5. Mehrdeutigkeit ist gewollt — benennt den zentralen Zielkonflikt des Sets

Schliesst mit `[!hinweis] Lektionentotal` callout: Variante A = {3×2+1}+KN Lektionen, Variante C = {2+1}+KN Lektionen.

**Sektion 1 — Kompetenz, Ressourcen, Architektur**

- **Das Kompetenzversprechen** — `kern_kompetenzversprechen` als Blockzitat (> "...")
- **Ressourcenanalyse** — Tabelle 2-spaltig: `GES — Gesellschaftswissen` | `SuK — Sprache und Kommunikation`. Je 4-6 Eintraege, abgeleitet aus den NRLP-Aspekten und Sprachmodi des Sets.
- **Verbindungsformel** — ein Satz: "Die Lernende {SuK-Sprachhandlung}, indem sie {GES-Wissen} nutzt, um {Handlungsziel}." Als Blockzitat.
- **Bloom-Zielprofil pro Leitfrage** — Tabelle: LF1=K2 (Erklaerproblem), LF2=K3 (Anwenden), LF3=K3 (Entscheiden), LF4=K3+/K4 (Strategie/Analyse). Aus `prinzip.bloom_zielprofil`. **LF4 trainiert dabei den Output-Sprachmodus als fokussierte Sprachform-Teilaufgabe (ein Baustein, der ins Handlungsprodukt einfliesst) — nicht das ganze Produkt (C4).**
- **Mehrdeutigkeits-Architektur** — die `trade_off_raum`-Eintraege als nummerierte Liste mit Herausforderungs-Zuordnung; im Fliesstext als **Zielkonflikte** bzw. **Spannungsfelder** benennen (nie „Trade-offs"). Dann `[!mehrdeutigkeit] Der Grundsatz` callout mit `mehrdeutigkeits_architektur.verbindlich`.
- **Zirkularitaet** — Tabelle R1/R2/R3 aus `zirkularitaet`-Feld des Prinzips. Erklaert warum R1 „legt, nicht abschliesst".
- **Lehrmittel-Anker** — Tabelle Kap. | Titel | Seiten, aus `prinzip.quellen_anker.chapters[]` und den `sit_*.prinzip_handoff.lehrmittel_anker`-Feldern. Maximal 10 Zeilen.

**Kapitel 1.6 — KI-Einsatz: Nutzungsideen fuer diese Einheit (v2, §E5)**

Eigenes Sub-Kapitel `### 1.6 KI-Einsatz — Nutzungsideen fuer diese Einheit` am Ende von Sektion 1. Es gibt die **Einheits-Uebersicht** der KI-Nutzung (die situationsspezifischen Ideen kommen zusaetzlich pro Herausforderung in Sektionen 3–5).

- **Rahmung (Pflicht-Satz):** Der Begleiter macht **keine** KI-Regel (kein Verbot/Gebot, keine Compliance/Hilfsmittel-Regelung — die liegt auf Schullehrplan-Ebene). Ob und wie KI eingesetzt wird, bleibt **vollstaendig LP-Entscheid**. Formulierung durchgaengig als **Empfehlung** („waere sinnvoll", „koennten"), nie als Vorschrift.
- **NICHT** auf die separaten KI-Fluency-Zusatzmaterialien verweisen — die sind noch nicht veroeffentlicht (Spec §E5).
- **Inhalt:** ein kurzer Rahmen-Absatz + 2–4 Nutzungsideen, die zur Kompetenz dieser Einheit passen (generell, nicht situationsspezifisch), als `[!ki_einsatz]`-Callout. Beispiele: „KI als Sparringpartner beim Argumentieren", „Register-/Tonpruefung eines Entwurfs". Ableitung aus dem dominanten Sprachmodus + den `handlungsprodukt`-Formaten des Sets.

**Sektion 2 — Durchfuhrungs-Varianten**

Drei Varianten (immer alle drei dokumentieren):

- **Variante A** (Einzelarbeit, alle drei): Lektionenzahl = {3×2+1}+KN. Kompetenz voll. KN ungekuerzt.
- **Variante B** (Einzelarbeit, Auswahl): Lektionenzahl variabel. `[!warnung] KN muss mitgekuerzt werden`: Hinweis auf Constructive Alignment.
- **Variante C** (Jigsaw): Lektionenzahl = {2+1}+KN. `[!warnung] Zwei Drittel werden nur stellvertretend erworben` + Gegenmittel. `[!coaching] Variante offen ansagen`.

**Sektionen 3-5 — Eine Sektion pro Herausforderung (A, B, C)**

Jede Herausforderung bekommt dieselbe Unterstruktur:

1. **Steckbrief-Tabelle** (Felder: Titel, Sub-Herausforderung, Persona, Aspekte, Sprachmodi, Schluesselkompetenzen, Handlungsprodukt, Wissensknoten — **kein Emotion-Feld mehr**, C1) — aus `sit_*.json`-Feldern.
2. **Herausforderungs-Zitat** — `situation_text` als Blockzitat.
3. `[!hinweis] Qualitaet der Herausforderung` callout — 8 Merkmale kurz pruefen (Authentizitaet, Verortung, Problem, Affektivitaet, Kognition, Aktivitaet, LJ-Passung, Relevanz).
4. **Unterrichtsfahrplan** — Einleitungssatz „AViVA-Bogen über ~3 Lektionen — Richtwerte, keine feste Taktung. Die Lernenden arbeiten selbstständig; Sie begleiten coachend und bestimmen Tempo und Dauer der Phasen selbst." Danach Tabelle **AViVA-Phase | Was passiert | Sozialform** (NICHT „Lektion | … | 2 Lektionen à 45'"), Phasen aus `leitfragen`- und `handlungsprodukt`-Feldern.
5. **Leitfragen mit Coaching-Hinweisen** — Fuer jede LF (1-4):
   - LF-Text in Fettschrift
   - `[!coaching] LF{n}` callout mit konkretem Unterrichts-Move (kein allgemeines Lob, sondern Was-genau-tun)
   - Bei heiklen LF: zusaetzlich `[!warnung] Typischer Stolperstein` callout
   - **`[!troubleshooting]` — «Wenn ein Lernender feststeckt» (v2, §E3):** GENAU EIN Troubleshooting-Callout pro Herausforderung, verortet **im** Leitfragen-Block an der LF mit dem schaerfsten Zielkonflikt (meist LF3 Entscheiden oder LF4 Formulieren). Titel-Pflicht: `Herausforderung {X} — {konkrete Blockade}`. Inhalt: die haeufigste konkrete Blockade + **ein Interventionssatz** (was die LP sagt/fragt) + die Weiterfuehrung. **Der Interventionssatz ist immer eine Rueckfrage oder ein Spiegeln, nie eine Erklaerung** (sonst kippt die coachende Rolle zurueck in Frontal). Datenhebung: `mehrdeutigkeit.hint` (Zielkonflikt, an dem Lernende haengen) + `scaffolding.strategien` (Ausweg) + der vorhandene `[!warnung]`-Stolperstein. Abgrenzung zu `[!warnung]`: Warnung = Praevention vorher; Troubleshooting = Reaktion im Moment jetzt.
6. **`[!tafelbild]` — fachliche Soll-Loesung (v2, §E4)** — **vor** der Scaffold-Werkstatt (das Soll-Bild rahmt die Vorlagen). Callout `[!tafelbild]`, Titel `Erwartungsbild — {mindmap_zentrum}`. Mindmap als Erwartungsbild, getrennt nach **Pflicht-Aesten** (Lernende sollen alle finden) und **optionaler Vertiefung** (fuer 100%). Datenhebung 1:1: `mindmap_zentrum` → Callout-Titel; `mindmap_aeste[]` mit `optional: false` → Pflicht-Block, `optional: true` → Vertiefungs-Block; Detailpunkte aus `mindmap_aeste[].punkte[]` (bzw. `.text`). Das speist zugleich die 100%-Differenzierung.
7. **Scaffold-Werkstatt** — mind. ein fertig ausgefuellter Template (Lueckentext, Tabelle, Drehbuch, oder Vergleichstabelle), abgeleitet aus `handlungsprodukt.schritte`, `handlungsprodukt.scaffolding` (Satzanfaenge/Strategien/Struktur, C6) und dem Sprachmodus. Als Code-Block oder Markdown-Tabelle. Die **Gütekriterien** der Handlungsprodukt-Seite stammen aus `lernfortschritt.kriterien` (kriterium + indikator).
   - `[!differenzieren] 80 vs. 100` callout: beschreibt, was alle bekommen (80%) vs. schnellere Lernende (100%).
8. **«Wann ist das Produkt fertig?» — Vollstaendigkeits-Check (v2, §E2)** — **nach** der Scaffold-Werkstatt. **Reine Haken-Liste (Checkliste), KEINE Tabelle mit Prozenten/Gewichten** — der Check ist formative Selbstkontrolle der Lernaufgaben-Phase, nicht der benotete KN. Ueberschrift-Zeile: `**Wann ist das Produkt fertig?** (Selbstcheck — formativ, nicht benotet)`. Datenhebung 1:1 aus `bewertungsraster[]`: pro Eintrag `.produkt` (bzw. `.kriterium`) als Teilprodukt-Ueberschrift + `vollstaendig_wenn[]` als `☐`-Punkte. Reihenfolge: Leitfragen → Mindmap → Handlungsprodukt → Reflexion. **Die `lernfortschritt.kriterien[].gewicht_prozent`-Werte werden NICHT angezeigt** (Entscheid Pietro 2026-06-22: Gewichte suggerieren Benotung — auch nicht LP-intern).
9. **`[!ki_einsatz]` — KI-Einsatz in dieser Herausforderung (v2, §E5)** — **nach** dem Vollstaendigkeits-Check, **vor** dem Coaching-Block. Callout `[!ki_einsatz]`, Titel-Pflicht (z.B. `KI-Nutzungsideen — Herausforderung A ({Produkt})`). 2–3 **situationsspezifische** Ideen, an die jeweilige Sprachhandlung gekoppelt, plus immer ein **«Nicht:»**-Hinweis, der die zu zeigende SK schuetzt. Zwei tragende Muster: (1) Entwurf korrigieren/pruefen lassen (bei Schreibprodukten), (2) Rolle einer Gegenpartei uebernehmen (bei Argumentations-/Gespraechsprodukten). Ableitung aus `handlungsprodukt.format` + dominanter Sprachhandlung. Formulierung durchgaengig **Empfehlung** („waere sinnvoll", „koennten"), nie Vorschrift; Ob/Wie bleibt LP-Entscheid. **Keine KI-Regel, kein Verweis auf die unveroeffentlichten KI-Fluency-Materialien.**
10. **Mehrdeutigkeit halten** — `[!mehrdeutigkeit] Herausforderung {X}` callout mit dem situationsspezifischen `trade_off`-Wert (im Fliesstext als **Spannungsfeld** benennen) und konkretem Eingriff-Satz.
11. **Wo welche SK geuebt wird** — Tabelle SK | Demonstration (ein konkreter Satz pro SK, wo genau im Arbeitsauftrag). Aus `sk_anker[].wo`.
12. **Coaching & Scaffolds — auf einen Blick** (Cluster 5, gebuendelt) — Abschnitt am Ende der Herausforderung, der die schon vorhandenen Inhalte als Schnell-Referenz sammelt (Inhalt NICHT neu erfinden): ein `[!coaching]`-Callout „Die drei Moves dieser Herausforderung" (die LF-Coaching-Moves als nummerierte Kurzliste) + eine Zeile „Zum Abgeben bereit:" mit den Scaffold-Namen. Direkt danach ein `[!coaching] Perspektivenwechsel`-Callout (**LP-only, nie SuS**): ein konkreter, auf den situationsspezifischen Konflikt bezogener Perspektivenuebernahme-Move (Sicht der Gegenseite zuerst einnehmen), begruendet ueber das Spannungsfeld der Herausforderung bzw. die aktivierte SK (oft SK7 Verstaendnis foerdern). Render: `coaching`/`differenzieren` erhalten im `begleiter-builder.ts` extra Gewicht (farbiges Header-Band + Box).

> **Positions-Regel (Spec §1.5):** Tafelbild VOR den Scaffolds (Soll-Bild rahmt die Vorlagen) · Vollstaendigkeits-Check NACH den Scaffolds (Selbstcheck gegen das Erarbeitete) · KI-Einsatz nach dem Check und vor dem Coaching-Block · Troubleshooting IM Leitfragen-Block an der kritischen LF. Diese vier Bausteine sind pro Herausforderung **Pflicht**.

**Sektion 6 — Austausch & Transfer (eigenstaendiges Set-Dokument, C8)**

Der Austausch + Transfer ist seit dem Redesign ein **eigenstaendiges Set-Dokument** (`DocAustausch` / `buildAustausch`), nicht mehr Teil des Situationshefts. Es bietet drei waehlbare Sozialformen: **EA** (`einzelauftrag`), **GA** (Gruppenpuzzle = `gruppenarbeit_jigsaw`, 3 Runden), **PL** (Plenum = `einzelarbeit_plenum`). Die Transfer-Haelfte nutzt `dekontextualisierungs_aufgabe` + die drei `sit.dekontextualisierung.frage` als Beispiele. Aus `set.austausch_phase.gruppenarbeit_jigsaw`:
- **Bei Variante C (Jigsaw)**: Tabelle Runde | Auftrag | Zeit | Deine Moderation. Fuer jede Runde einen konkreten Moderations-Move.
  - `[!warnung] Jigsaw-Qualitaet entscheidet ueber den KN` callout.
  - `[!coaching] Plenum-Abschluss` callout.
- **Bei Variante A**: Verkuerzte Plenum-Variante (~15 Min.).
- **Bei Variante B**: Gemischte Variante.

**Sektion 7 — Transfer**

- Auftrag und Ziel aus `set.dekontextualisierungs_aufgabe`.
- Der **Anker-Satz** als Blockzitat (aus `prinzip.dekontextualisierungs_anker.anker_statement`).
- `[!lernziel] So sieht guter Transfer aus` callout: konkret ausgefuelltes Beispiel mit neuem Kontext (ausserhalb Lehrbetrieb).
- `[!warnung] Typischer Stolperstein` callout: schwache Transfers wiederholen den Original-Fall.

**Sektion 8 — Der Kompetenznachweis (KN)**

- **Hybrid-Herausforderung** — Persona + Herausforderungs-Zusammenfassung als Blockzitat. Dann Alignment-Tabelle (Aus Sit X | zeigt sich im KN als).
  - `[!hinweis] Neue Dimension` callout: falls `alignment_note.new_dimensions[]` nicht leer.
- **Methodenwahl** — Tabelle: Methode | Format | Primaer prueft | Sprachmodi | Waehle wenn. Fuer alle 3 KN-Typen.
  - `[!coaching] Methodenwahl an Klasse + Variante koppeln` callout.
  - `[!hinweis] Ausblick — weitere Pruefformen moeglich` callout (Cluster 5): die 3 KN-Typen sind ein Startset; weitere Formen (Critical Incident, Produkt mit Praesentation) tragen dieselbe Hybrid-Herausforderung und dieselbe Rubrik, sind aber noch nicht ausgearbeitet. Reiner Text, keine Funktion.
- **Pro KN-Typ**: Fragenbogen-Tabelle (# | Typ | K | Fokus) fuer Fachgespraech; Aufgaben-Tabelle fuer Mini Case; Reflexionsfragen-Liste fuer Werkschau.
- **`[!erwartungshorizont]` je Prueffrage/Aufgabe (v2, §E1)** — direkt **nach jeder Frage/Aufgabe** im Fragenpool ein eigener Callout. Titel-Pflicht: `Frage {n} ({Bloom-Verb}, K{n}) — {Kurzfokus}`. Inhalt drei Zeilen:
  - **Stufe 3 zeigt:** was eine situationsangemessene, korrekte Antwort enthaelt (aus dem `frage`-Text + Stufe-3-Deskriptor des einschlaegigen Rubrik-Kriteriums).
  - **Stufe 4 zeigt zusaetzlich:** Differenzierung, Zielkonflikt explizit offen gehalten, Transfer (aus Stufe-4-Deskriptor).
  - **Nicht Stufe 4:** ein konkretes Gegenbeispiel, das souveraen klingt, aber den Zielkonflikt **aufloest** — der haeufigste Bewertungsfehler.
  - Datenhebung: `kn_typen[].fragestruktur[].frage` × `kn_typen[].fragestruktur[].k_stufe` × thematisch passendes `rubrik_shared.kriterien[].stufen[]`. **Generierungsregel:** die `k_stufe` bestimmt das Ziel-Niveau; **K2-Fragen (Erklaeren) brauchen keinen «Stufe 4 vs. aufloesen»-Kontrast, sondern nur «vollstaendig vs. lueckenhaft».** Anzahl der Erwartungshorizont-Callouts richtet sich nach der Zahl der Prueffragen der Einheit.
- **Bi-dimensionale Bewertung** — Tabelle: Kriterium | Dimension (4 Zeilen, 2 SuK + 2 Ges). Vier Stufen (**Skala 1–4, 1 = tiefste** — rubrik-interne Kriteriumsskala, NICHT die nRLP-Guetestufe 0–3; Spec K2/TEIL 8.2) als kompakte Tabelle. Niveaubaender **unter 60 % / 80 % / 100 %** (Spec K1/K3/TEIL 8.2). Aggregation als Code-Block, SuK- und Ges-Note getrennt, nie zu einer Zahl verrechnen. Werte stammen aus `kn.json` (`rubrik_shared.niveaubaender` + `kriterien[].stufen[]`) — Begleiter und JSON sind konsistent.
  - `[!coaching] Bi-dim sauber halten` callout.
  - `[!mehrdeutigkeit] Der haeufigste Bewertungsfehler` callout: erklaert, warum „klarste Loesung = hoechste Note" falsch ist.

> **Kein «Anhang — Quellen» (Spec TEIL 8.3):** Das frueher vorhandene Schluss-Kapitel
> «Anhang — Quellen dieses Dokuments» **entfaellt**. Die Quellenangabe ist ueber das
> Frontmatter (`quellen_json`) und die Lehrmittel-Anker (Sektion 1) abgedeckt; eine
> Doppelung am Dokumentende ist unnoetig. Das Dokument endet mit Sektion 8.

#### Callout-Syntax

```markdown
> [!type] Optionaler Titel
> Text des Callouts.
> Mehrzeilig: Jede Zeile mit > beginnen.
```

Erlaubte Typen (10) — sechs Basis-Typen (v1) plus vier LP-Support-Typen (v2, Struktur-Spec TEIL 6):

- Basis (v1): `lernziel` · `hinweis` · `beispiel` · `warnung` · `reflexion` · `coaching` · `mehrdeutigkeit` · `differenzieren`
- LP-Support (v2): `erwartungshorizont` · `troubleshooting` · `tafelbild` · `ki_einsatz`

Alle zehn Typen sind in beiden Render-Pfaden implementiert (`begleiter-builder.ts` `CALLOUT_LABELS`/`CALLOUT_COLORS` fuer das Word-Bundle, `einheiten-begleiter.css` fuer die HTML-Ansicht); die vier v2-Typen tragen eigene Farben (Spec TEIL 8.4). Titel-Pflicht: `erwartungshorizont` (Frage-Nr + K-Stufe), `troubleshooting` (Herausforderung + Blockade), `differenzieren` (Format „80 vs. 100 — Herausforderung X"), `ki_einsatz`. Andere Typen: Titel empfohlen.

#### Umlaut-Regel (identisch zu Prosa-Felder in Phase 2)

Alle Prosa-Abschnitte des Begleiters verwenden echte Umlaute `ä/ö/ü/Ä/Ö/Ü`. Keine Transliteration in sichtbarem Markdown. IDs, JSON-Schluessel, Pfade: transliteriert. Pre-Write-Scan wie in Phase 2 Step 2.

#### Vokabular-Regel (sichtbare Prosa, Reform 2026-06)

Sichtbare Begleiter-Prosa nutzt durchgaengig **«Herausforderung A/B/C»** — niemals «Situation», «Sit A», «die drei Situationen» oder «## 3. Situation A». Das gilt fuer alle Headings, Tabellen und Fliesstext (vgl. Reform-Update §A). Erhalten bleiben nur der didaktische Fachbegriff **Lernsituation** (8 Merkmale einer Lernsituation) und **«Einstieg»** (BBW-Phasenname).

#### Save

```
1. src/data/einheiten/{X.Y.Z}_{topic_slug}/begleiter.md
```

Confirm: `✓ {X.Y.Z}_{topic_slug}/begleiter.md gespeichert`.

Dann Final-Summary updaten:

```
3er-Set {X.Y.Z}_{topic_slug} vollstaendig:
  ✓ prinzip.json
  ✓ herausforderung_A.json, herausforderung_B.json, herausforderung_C.json
  ✓ set.json
  ✓ kn.json (Hybrid + 3 Typen + bi-dim Rubrik)
  ✓ begleiter.md

Naechster Schritt: Index-Rebuild (siehe unten).
```

---

### DEPLOYMENT — Index-Rebuild

Die 7 Dateien (`herausforderung_A/B/C.json`, `prinzip.json`, `set.json`, `kn.json`, `begleiter.md`) liegen bereits am finalen Ort `src/data/einheiten/{X.Y.Z}_{slug}/`. Es ist kein Kopieren zwischen Repos noetig.

**Schritt 1 — Einheiten-Index rebuilden:**
```bash
npm run build:einheiten-index
```
Danach erscheint die neue Einheit im Katalog unter `/einheiten`. (Der `prebuild`-Hook laeuft ohnehin `sync:einheiten-nrlp` -> `build:einheiten-index`; ein manueller Lauf macht die Einheit sofort sichtbar.)

**Schritt 2 — pruefen:** `/einheiten` oeffnen, neue Einheit waehlen, Preview + ZIP-Bundle (EinheitWorkbench) kontrollieren.

---

## Content Generation Rules (kondensiert)

### Authentizitaet
- Reale CHF-Betraege (Lehrlingslohn LJ1: CHF 700-1200 je nach Branche)
- Schweizer Firmen: Migros, Coop, SBB, Helvetia, Noser, SUVA, AHV, OR
- Schweizer Staedte: Zuerich, Bern, Basel, Winterthur, St. Gallen, Luzern, Aarau, Olten
- Reale Lehrberufe (BBW Winterthur, gruppiert nach Abteilung — vollstaendige Liste in `hko-framework.md` §11):
  - **Bau:** Forstwart/in, Kaminfeger/in, Maler/in, Maurer/in, Plattenleger/in, Schreiner/in, Spengler/in
  - **Technik/Ernaehrung:** Automobilfachmann/-frau, Baecker-Konditor-Confiseur/in, Elektroinstallateur/in, Zweiradmechaniker/in, Land-/Baumaschinenmechaniker/in
  - **Maschinenbau:** Anlagen- und Apparatebauer/in, Gusstechnologe/in, Konstrukteur/in, Polymechaniker/in, Produktionsmechaniker/in
  - **Informatik:** Entwickler/in Digitales Business, Informatiker/in (alle Fachrichtungen), Laborant/in (alle Fachrichtungen)
- Mix-Pflicht: pro 3er-Set drei verschiedene Abteilungen in `persona_pool_units`

### ICH-Perspektive Formula
```
Ich bin [Beruf]-Lernende/r im [x.] Lehrjahr bei [Betrieb] in [Stadt].
[Konkrete Ausgangslage mit Zahlen oder Fakten].
[Was ich noch nicht weiss oder was ueberraschend ist].
[Die Entscheidung oder das Problem mit Zielkonflikt (aus Prinzip)].
```

### Anrede-Gate (verbindlich — vor jedem Schreiben pruefen)

Zwei Register, nie vermischen (Vollregel: `references/language-rules.md` §4):

| Feld | Register | Beispiel |
|---|---|---|
| `situation_text`, `handlungsprodukt.beschreibung`, `leitfrage`, `hybrid_situation.text`, `reflexion_fragen`, `dekontextualisierung.frage` | **Ich** (1. Ps. Sg.) | „Ich ueberlege, ob ich das Leasing unterschreibe." |
| `leitfragen_intro`, `leitfragen[].text`, `handlungsprodukt.schritte[].hint`, `handlungsprodukt.format_detail`, `mehrdeutigkeit.hint`, `set.einzelauftrag`, `set.dekontextualisierungs_aufgabe.auftrag`, alle KN-`frage`/`aufgabe` | **Sie** (Hoeflichkeits-Imperativ) | „Erklaeren Sie …", „Entscheiden Sie …", „Ihr Budget" |

**Drittes, kleineres Register — LP-Felder.** `leitfragen[].loesung.zeilen[].text`, `handlungsprodukt.musterloesung.hinweis` und die Begleiter-Callouts richten sich an die Lehrperson und stehen im **neutralen Sachstil ohne Anrede** («Unzulaessig ist die Grundreinigung …»). Sie erscheinen nie im Schuelerbogen. Woertliche Musterformulierungen der Lernenden stehen darin in «Guillemets» und behalten ihr eigenes Register (die Ich-Form des Produkts). `musterloesung.abschnitte` selbst ist das Produkt und bleibt deshalb in der **Ich**-Form.

**Kein `du/dein/dich/dir` in SuS-gerichteten Feldern.** Beim Umstellen die Verbform mitaendern — `Erklaere` → `Erklaeren Sie`, nicht nur das Pronomen tauschen.

Ausgenommen (bleibt `du`):
- **Zitierte Rede** anderer Personen im Narrativ — «Du bist halt noch nicht so weit», eine WhatsApp des Berufsbildner/in.
- **Fachbegriffe** — „Du-Botschaft" vs. „Ich-Botschaft".
- **Prompt-Texte, die die Lernende an eine KI richtet** (`ki.json`, `lernprompt.json`, `lernbegleiter.json`) — „Du bist ein neutraler Budget-Coach.", „Ich erklaere dir …". Die KI wird geduzt, die Lernende nicht.
- **LP-gerichtete Passagen in `begleiter.md`** — Moderations-Hinweise, „so benotest du", „Deine Moderation". Aber: jeder aus den JSONs **zitierte** SuS-Text im Begleiter steht in Sie-Form.

### K-Level Auto-Correction
- K1 als Kern-Problem → automatisch hochstufen auf K3
- K3 = Entscheiden (zwei Optionen mit Begruendung)
- K4 = Analysieren (Ursache-Wirkung, Vergleich, Bewertung)
- LF4 ist immer K3+ oder K4 — sonst 5. LF ergaenzen
- **LF4-Scoping (C4):** LF4 trainiert den Output-Sprachmodus (`nrlp.sprachmodus_ids`) als fokussierte Teil-/Sprachform-Aufgabe — EIN Baustein, der ins Handlungsprodukt einfliesst — nie das ganze Handlungsprodukt. Rezeption (SM3) bleibt bei LF1-3. Methode aus `references/sprachfoerderung-methoden.md` passend zum Output-Modus.

### Constructive Alignment
Kompetenzziel-Verb ↔ Lernaktivitaet ↔ Handlungsprodukt muessen matchen. LF4 spiegelt den Output-Sprachmodus als geuebte Sprachform-Teilaufgabe (nicht das volle Produkt) — Coherence-Check 20.

### Mehrdeutigkeit (SK11) deliberat einbauen
- `situation_text` enthaelt zwei legitime Lesarten
- `mehrdeutigkeit.trade_off` benennt den Spannungspol explizit
- `mehrdeutigkeit.hint` macht beide Optionen begruendbar
- Bewertung honoriert Qualitaet der Begruendung, nicht die Wahl

### SK-Attribution: demonstrieren, nicht deklarieren
- `nrlp.sk` ist pro Herausforderung unterschiedlich, nicht template-default
- Jede SK in `nrlp.sk` braucht einen Eintrag in `sk_anker` mit konkreter Verortung
- Kanonische Kurznamen aus `references/hko-framework.md`

---

## Error Handling

| Code | Bedingung | Verhalten |
|---|---|---|
| `ERR_KN_INPUTS` | sit_*.json oder prinzip.json fehlt fuer Phase 4 | Stop, keine kn.json |
| `ERR_HYBRID_NO_TRADE_OFF` | Hybrid aktiviert keinen Trade-off | Stop, Pietro reviewen |
| `ERR_HYBRID_PERSONA_OVERLAP` | Hybrid-Persona ∈ sit_*.persona | Stop, persona_pool_kn_neu fixen |
| `ERR_KN_SK_OUT_OF_SCOPE` | KN-Typ-SK ∉ Union(sit_*.nrlp.sk) | Stop |
| `ERR_RUBRIK_SHAPE` | Rubrik nicht 4×4 oder Dimensionen falsch | Stop |
| `ERR_HERAUSFORDERUNG_MISSING` | sit_*.herausforderung nicht in prinzip | Stop |
| `ERR_DUPLICATE_HERAUSFORDERUNG` | zwei sit_* mit gleicher herausforderung | Stop |
| `ERR_SK_OUT_OF_BOUNDS` | sk_schnittmenge_kn.primary nicht in Union(sit_*.sk) | Stop |
| `ERR_SK_ANKER_MISMATCH` | sk_anker.length != nrlp.sk.length | Stop |
| `ERR_MEHRDEUTIGKEIT_MISSING` | Herausforderung ohne trade_off | Stop nach Auto-Fix-Versuch |
| `ERR_PERSONA_OVERLAP` | persona_pool_units ∩ persona_pool_kn_neu != ∅ | Stop |
| `ERR_PERSONA_NOT_CANONICAL` | Beruf oder Ort nicht in kanonischer Liste (hko-framework.md §11) | Stop, Pietro waehlt aus Liste |
| `ERR_PERSONA_DUPLICATE_USE` | Beruf oder Ort bereits in einer frueheren Herausforderung verwendet | Stop, schreibt nicht |
| `ERR_PERSONA_POOL_MISUSE` | Beruf/Ort doppelt oder ungenutzt nach 3 Sits (Check 14) | Stop |
| `ERR_PERSONA_ABTEILUNG_MONO` | `persona_pool_units` deckt weniger als 3 BBW-Abteilungen ab | Stop, Pool neu ziehen mit Abteilungs-Mix |
| `WARN_PERSONA_KN_NEU_NO_NEW_ABTEILUNG` | `persona_pool_kn_neu` enthaelt keinen Beruf aus einer in Units abwesenden Abteilung | User-Bestaetigung: Unseen-Transfer schwaecher — beabsichtigt? |
| `ERR_MODI_KN_SUBSET` | modi_units ⊄ modi_kn (Check 5b) | Stop vor Phase 4 |
| `WARN_MODE_UNTRAINED` | Modus in modi_units ohne Trainings-Footprint (Check 5a) | User fragt: entfernen oder Schritt ergaenzen? |
| `WARN_HYBRID_LJ_MISMATCH` | Hybrid-Persona Lehrjahr ≠ Sit-Personas Lehrjahr | User-Bestaetigung: beabsichtigt? |
| `WARN_HYBRID_NEW_DIMENSION` | Hybrid-Szene aktiviert Konfliktdimension ohne Sit-Vorbereitung | User-Bestaetigung: didaktisch erwuenscht? |
| `WARN_TRADE_OFF_UNUSED` | Trade-off im trade_off_raum in 0 Herausforderungen aktiviert (Check 15) | User kann bestaetigen oder Sits neu zuweisen |
| `ERR_TRADE_OFF_MAPPING_INCONSISTENT` | aktivierte_trade_offs fehlt trade_off einer gemappten Herausforderung (Check 16) | Stop, Trade-off-Konsolidierung (Step 2.3) erneut laufen lassen |
| `WARN_MULTI_FORMAT_AMBIGUITY` | format_detail enthaelt Format-Alternative mit Modus-Wechsel (Check 17) | User-Entscheidung: (a) singularisieren oder (b) modi_units erweitern |
| `WARN_SPELLCHECK_HEAVY` | mehr als 5 SPELLCHECK_FIX in einem File | User-Review empfohlen — moegliche Qualitaetsprobleme |
| `WARN_UMLAUT_RESIDUE` | nach Auto-Fix bleibt ae/oe/ue-Pattern in Prosa-Feld (ausserhalb Whitelist) | User-Review: Eigenname oder vergessenen Umlaut? |
| `ERR_ESZETT_FOUND` | `ß` in irgendeinem Feld gefunden | Auto-Fix zu `ss`, Stelle gemeldet |
| `WARN_SK_DRIFT` | Phase 0 Step 2a: `themen[].schluesselkompetenzen` weicht von `zirkularitaet…wiederholungen` ab | Zirkularitaets-Liste verwenden, beide Listen zeigen, Pietro informieren (Datensatz reparieren, nicht die Skill umgehen) |
| `WARN_BLOOM_TOO_LOW` | keine K3+/K4-LF | Auto-Fix: 5. LF ergaenzen, User bestaetigen |
| `WARN_MEHRDEUTIGKEIT_NEAR_MISS` | trade_off fast aus trade_off_raum | Auto-Fix: naechster Vorschlag, User-OK |

---

## File Naming Convention

```
src/data/einheiten/{X.Y.Z}_{topic_slug}/
├── prinzip.json
├── herausforderung_A.json
├── herausforderung_B.json
├── herausforderung_C.json
├── set.json
├── kn.json
└── begleiter.md
```

- `X.Y.Z` — vollstaendige NRLP-Subkapitel-Referenz
- `topic_slug` — 2-4 Worte, snake_case, ohne Umlaute, aus Phase 0.5
- `LETTER` — A / B / C

**Identifier-Depth-Regel:** immer die tiefste verfuegbare NRLP-Referenz; `X.Y.Z` nicht auf `X.Y` reduzieren.

**Mehrere Sets unter gleichem X.Y.Z:** verschiedene `topic_slug`-Werte koexistieren.

---

## Final Validation Checklist (vor Reporting)

### Prinzip:
- [ ] `id` Format `{X.Y.Z}_{topic_slug}_prinzip`
- [ ] `kern_kompetenzversprechen` endet auf K3/K4-Verb, ICH-Form
- [ ] Genau 3 Herausforderungen A/B/C
- [ ] `sk_schnittmenge_kn.primary` >= 2 SK
- [ ] `mehrdeutigkeits_architektur.trade_off_raum` >= 2 Eintraege
- [ ] `persona_pool_units` 3+3, `persona_pool_kn_neu` 2+2, disjunkt
- [ ] `hybrid_situation_spec` ausgefuellt
- [ ] Keine Eszett

### Jede Herausforderung (Renderer-Compliance):
- [ ] `template == "default_4page_v2"`, `wochen == 3`, `legacy/source_refs/registry_tags == {}`
- [ ] `modul_titel`, `wissensknoten[0]`, `zahlen_tabelle`, `leitfrage`, `leitfragen_intro` gesetzt
- [ ] `nrlp.gesellschaft` als Array of `{aspekt, iteration}`
- [ ] `nrlp.nr_primary` enthält alle real abgedeckten Kompetenzen (Default Primär; Sekundär nur nach Pietro-Bestätigung) — B1
- [ ] `leitfragen[]` 4 Items, je `nr` Integer, `bloom` String, `knoten_ref`, `text`, `feld_hoehe_mm: 15`
- [ ] `leitfragen[].loesung` bei allen 4: `kern` + 3-6 `zeilen`, zusammen ≤ ~900 Zeichen, Quellen aus dem `knoten_ref`-Abschnitt (C10, Check 32)
- [ ] `mindmap_zentrum` / `mindmap_aeste` flat top-level; `mindmap_aeste` 4 Items, Ast 4 `optional: true`
- [ ] `handlungsprodukt.{format, titel, format_detail, beschreibung, schritte (5 Objekte), schreib_label, schreib_note}`
- [ ] `reflexion_fragen` 3 Items, je `{nr (str), text, sub: null, feld_hoehe_mm: 10}`
- [ ] `bewertungsraster` 4 Items, je mit `vollstaendig_wenn` (2-4 Bullets), keine Transfer-Zeile (C1)
- [ ] `handlungsprodukt.scaffolding` {satzanfaenge, strategien, struktur} je >=1 Eintrag (C6); `nrlp.sprachmodus_ids`-Paritaet zu `sprachmodi` (C4)
- [ ] `wochen_plan` 3 Items `{label, text, aktiv}`
- [ ] **Keine** `gruppenpuzzle_fragen` / `vorgespraech_fragen`, kein neu generiertes `emotion_tag`

### Jede Herausforderung (Prinzip-First + 3er-additiv):
- [ ] `prinzip_ref` matched
- [ ] `herausforderung.label === prinzip.herausforderungen[buchstabe].herausforderung`
- [ ] `mehrdeutigkeit.trade_off ∈ prinzip.mehrdeutigkeits_architektur.trade_off_raum`
- [ ] `dekontextualisierung.ziel` ∈ Bezug zu prinzip.dekontextualisierungs_anker
- [ ] `prinzip_handoff.{kernkonzept, lehrmittel_anker, kn_aktivierung, transfer_check}` ausgefuellt
- [ ] `sk_anker.length === nrlp.sk.length`, jeder mit `wo` befuellt
- [ ] `lehrgang` ∈ `{EBA_2J, EFZ_3J, EFZ_4J}`
- [ ] Mind. eine LF auf K3+/K4

### Set-Dokument:
- [ ] `id`, `prinzip_ref`, `kn_ref`, `herausforderungen[]` (3) gesetzt
- [ ] `lehrgaenge[]` nur gesetzt, wenn jede abgedeckte Kompetenz im zweiten Datensatz nummern- UND textgleich ist (danach `npm run sync:einheiten-nrlp -- --check` muss `0 invalid lehrgaenge claim(s)` melden)
- [ ] `konzept_progression[]` 3 Eintraege mit konkreten konzept-Werten aus prinzip_handoff
- [ ] `austausch_phase` template-konstant mit drei Schluss-Varianten (`einzelauftrag` / `gruppenarbeit_jigsaw` / `einzelarbeit_plenum`, C8), `dekontextualisierungs_aufgabe.ziel` aus prinzip-Anker

### KN-Dokument:
- [ ] `id`, `set_ref`, `prinzip_ref`, `anchored_situations[]` (3)
- [ ] `dominanter_aspekt` bestimmt, Kriterium-3-Wording angepasst
- [ ] `hybrid_situation.text` <= 120 Woerter, ICH, Persona disjunkt von sit_*.persona
- [ ] `hybrid_situation.aktivierte_trade_offs.length >= 1`, alle ∈ trade_off_raum
- [ ] `hybrid_situation.alignment_note` benennt Mapping
- [ ] `kn_typen[]` GENAU 3 (fachgespraech, mini_case_schriftlich, werkschau_transfer)
- [ ] Fachgespraech 5 Fragen K2→K3→K3→K4→K4
- [ ] Mini Case 4 Aufgaben K2→K3→K3→K4
- [ ] Werkschau 3 Reflexionsfragen (template-konstant)
- [ ] `rubrik_shared.kriterien.length === 4` (2 SuK + 2 Ges)
- [ ] Niveaubaender unter 60 / 80 / 100 %
- [ ] Checks 10-13 alle gruen

### Begleiter-Dokument:
- [ ] Frontmatter vollstaendig (titel, kompetenz, autor, stand, lehrgang, thema, lebensbezug, quellen_json)
- [ ] Sektionen 0–8 vorhanden; **kein Anhang-Kapitel** (Spec TEIL 8.3 — entfaellt)
- [ ] Sektion 1 enthaelt **Kapitel 1.6 KI-Einsatz** (Einheits-Uebersicht, `[!ki_einsatz]`, Empfehlung-Rahmung, kein KI-Fluency-Verweis; §E5)
- [ ] Pro Herausforderung: Steckbrief, Herausforderungs-Zitat, Unterrichtsfahrplan, 4 LF-Coaching-Blöcke, Scaffold, Mehrdeutigkeit-Callout, SK-Tabelle
- [ ] Pro Herausforderung die **4 v2-Bausteine** an korrekter Position: `[!tafelbild]` (vor Scaffold, §E4) · «Wann ist das Produkt fertig?»-Haken-Liste **ohne Prozente** (nach Scaffold, §E2) · `[!ki_einsatz]` (nach Check, §E5) · genau ein `[!troubleshooting]` im Leitfragen-Block an der kritischen LF (§E3)
- [ ] Mind. 1 fertiger Scaffold (Lueckentext, Tabelle oder Drehbuch) pro Herausforderung
- [ ] KN-Sektion: Alignment-Tabelle, alle 3 Methoden-Karten, bi-dim Rubrik, **`[!erwartungshorizont]` je Prueffrage** (§E1; K2-Fragen: «vollstaendig vs. lueckenhaft» statt «Stufe 4 vs. aufloesen»)
- [ ] KN-Rubrik: Stufenskala **1–4** (1 = tiefste), Niveaubaender **unter 60 / 80 / 100 %** (Spec TEIL 8.2)
- [ ] Pro Herausforderung: gebuendelter „Coaching & Scaffolds — auf einen Blick"-Abschnitt + `[!coaching] Perspektivenwechsel`-Callout (Cluster 5, LP-only)
- [ ] KN-Sektion: `[!hinweis] Ausblick`-Methodenvielfalt vorhanden (Critical Incident / Produkt mit Praesentation; Cluster 5)
- [ ] Alle Callouts typisiert; 10 erlaubte Typen (Basis: lernziel/hinweis/beispiel/warnung/reflexion/coaching/mehrdeutigkeit/differenzieren · v2: erwartungshorizont/troubleshooting/tafelbild/ki_einsatz)
- [ ] Echte Umlaute in allen Prosa-Abschnitten (kein ae/oe/ue in sichtbarem Markdown)

### Frontend-Prosa (Umlaut-Regel, v1.4 — Pflicht ueber alle 6 Dateien):
- [ ] Alle Prosa-Felder verwenden echte Umlaute `ä/ö/ü/Ä/Ö/Ü` (kein ae/oe/ue in Prosa)
- [ ] `persona.beruf` exakt wie kanonische Tabelle `hko-framework.md` §11 (mit Umlauten — z.B. „Bäcker-Konditor-Confiseur/in EFZ", nicht „Baecker-…")
- [ ] `persona.ort` exakt wie kanonische Staedte-Tabelle (z.B. „Zürich", nicht „Zuerich")
- [ ] IDs / topic_slug / Filenames bleiben transliteriert (ae/oe/ue) — Trennung Prosa vs. ID konsequent
- [ ] Kein `ß` irgendwo (Eszett auto-fix zu `ss`)
- [ ] Pre-Write-Scan lieferte 0 `WARN_UMLAUT_RESIDUE` oder User-Approval pro Stelle

---

## Reform-Update 2026-06 — Cluster 1-4 (Lehrplan-Konformitaet, Sprache, BIBOX)

> Diese Sektion ergaenzt die Phasen. Sie ist beim Generieren ZWINGEND zu beachten.

### A) Vokabular: Herausforderung — Prosa und Keys

Alle sichtbaren Begriffe UND die JSON-Keys/Feldnamen sind nun vereinheitlicht auf **Herausforderung**. Die Tabelle zeigt die kanonischen Bezeichnungen:

| Begriff in Prosa & Display | JSON-Key / ID / Dateiname |
|---|---|
| Herausforderung A/B/C | `buchstabe`, `herausforderungen[]`, `hf_A/B/C`, `hf_letter`, `{X.Y.Z}_{slug}_herausforderung_A.json` |
| Herausforderung (Teilkompetenz) | `herausforderung`, `herausforderungen`, `herausforderungen_mapping` |
| Hybrid-Herausforderung | `hybrid_situation`, `hybrid_situation_spec`, `anchored_situations` |
| Transfer | `dekontextualisierung`, `dekontextualisierungs_aufgabe`, `dekontextualisierungs_anker` |

Regel: Schreibe in **sichtbaren Text niemals** "Situation", "Sit A", "Subfacette" oder "Dekontextualisierung" — immer **Herausforderung A/B/C**, **Hybrid-Herausforderung**, **Transfer**. Ausnahme: der didaktische Fachbegriff **Lernsituation** (8 Merkmale einer Lernsituation) bleibt erhalten.

### B) Phase 0 — Lehrgang-Switch fuer nRLP

NRLP-Quelle nach `lehrgang` waehlen: `EFZ_3J` -> `public/nrlp_3j.json`, `EFZ_4J` -> `public/nrlp_4j.json`, `EBA_2J` -> `public/nrlp_2j.json`. Alle drei liegen nativ im bbw-hko-Repo unter `public/`.

### C) Cluster 1 — maschinenlesbare Lehrplan-Bezuege (additiv im `nrlp`-Block jeder sit_*.json)

- `kompetenz_id` (= `nr`, z.B. "1.1.1"), `lebensbezug_id` (= `lebensbezug`, z.B. "1.1")
- `kompetenz_text`, `lebensbezug_text` — Klartext-Saetze VERBATIM aus dem nRLP (nicht umformulieren, nicht umbenennen)
- `sprachmodus_ids` — parallel zu `sprachmodi[]`, IDs SM1-SM9 nach `references/sprachmodus-ids.md`

LP-Dokument rendert daraus den vollstaendigen Metadaten-Block; SuS sehen nur Ich-Form + kleine Modus-Marker (SM-ID + Kompetenz) an den Auftragsschritten.

### D) Cluster 3 — Sprachfoerderung

Pro Einheit den LP-Abschnitt "Sprachfoerderung" speisen aus `sprachmodus_ids` + `references/sprachfoerderung-methoden.md` (Rezeption/Leseverstaendnis zuerst). **Zwei-Schichten-Modell:** generischer Methoden-Kern je SM-ID (Bibliothek) + `kompetenz.sprachmodi[].detail` aus nrlp als "In dieser Einheit konkret:"-Injektion. Format je Eintrag: Ziel / Vorgehen (3 Schritte) / Material / Detail. SuS sehen schlichtes Label (z.B. "Lesen"), nicht die SM-ID. Fixer Hinweis: kein Hoerverstaendnis generiert -> LP erstellt selbst. Schluesselkompetenzen im LP-Dokument explizit benennen (Name, nicht nur Nummer).

### E) Cluster 2 — Hybrid-Herausforderung erklaeren

`kn.hybrid_situation.definition_kurz` (SuS, 1 Satz) + `definition_lang` (LP) bei Erstverwendung ausgeben. Weitere Begriffsvereinfachungen (Kanal-Logik, Kontextualisierung, Metabegruendung): kommen spaeter in einem Durchgang (Christof) — jetzt nicht einzeln ersetzen.

### F) Cluster 4 — BIBOX-Referenzen

`quellen_anker[]` zusaetzlich `unterueberschrift` (Zwischentitel auf der Seite). Renderer fuehrt mit **Kapitel-Titel** (statt Nummer); `ref`/`seiten` nur noch gedaempft. Werte (Titel/Seite/Zwischentitel) nach dem Offline-Abgleich Matthias+Pietro einpflegen.

### G) Umlaut-Regel (Pflicht, siehe `references/_common_misspellings.md`)

Sichtbare Prosa IMMER mit echten Umlauten (ae/oe/ue nur in IDs/Keys/Filenames). Ausnahme: `kompetenz_text`/`lebensbezug_text` sind nRLP-verbatim (bereits korrekt). Kein Eszett.

### H) Cluster 8 — Gendern (Schraegstrich-Form)

Generische Rollennomen im sichtbaren Prosa-Text (situation_text, leitfragen, kn, begleiter.md) in **Schraegstrich-Form mit beiden Endungen in einem Wort**: `Berufsbildner/in`, `Lehrer/in`, `Mitarbeiter/in`, `Arbeitnehmer/in`, `Arbeitgeber/in`, `Lernende/r`, `Mitlernende/r`, `Vorgesetzte/r`, `Schueler/in`, `Chef/in`. **Kein Schraegstrich-Bindestrich** (nicht `Lehrer/-in`).

- Nur die generische **Einzahl** gendern. Neutrale Partizip-Plurale (`die Lernenden`, `die Mitarbeitenden`) bleiben unveraendert — sie sind bereits geschlechtsneutral.
- **Nicht anfassen:** `persona.beruf` (steht schon als offizielle Slash-Form, z.B. `Schreiner/in EFZ`), bereits gepaarte Formen (`einer Kollegin/einem Kollegen`), feste Methoden-Begriffe (`Expertengruppe`, `Partnerarbeit`, `Partnerperson`), Komposita (`Kunden-WhatsApp`, `Mitarbeitergespraech`), sowie Keys/IDs/Filenames.
- Artikel/Pronomen bleiben unveraendert (Gendern nur auf Substantiv-Ebene), z.B. `mein Berufsbildner/in`, `Ihr Berufsbildner/in`.
- Kuratierte Mapping-Liste + Anwendungsregeln: `references/language-rules.md` §2b.

### I) Cluster 6 — Handlungsprodukt-Klarheit

**`handlungsprodukt.abgaben[]` (additiv):** Pro Herausforderung 1-3 Klartext-Strings, je eine konkrete Abgabe — z.B. `["Kanalbegründung (80–120 Wörter)", "Schreiben im gewählten Kanal (200–250 Wörter)"]`. DocS rendert daraus den deutlich abgesetzten **"Das liefern Sie ab"-Block** (Callout am Anfang des Handlungsprodukt-Abschnitts; in der DOCX gespiegelt). Bei mehrteiligem Produkt jede Teil-Abgabe einzeln. Native Umlaute, en-dash fuer Ranges. Siehe `references/json-field-mapping.md`.

**Begleiter (Phase 5) — zwei LP-Hinweise:**
- **Reihenfolge frei** (Sektion Durchfuehrungs-Varianten + DocKnLp-Konzeptbogen): Ein Satz, dass der Konzeptbogen A → B → C den inhaltlichen Aufbau zeigt, nicht eine zwingende Unterrichtssequenz — Herausforderungen koennen weggelassen oder umgestellt werden; im KN wird nur geprueft, was geuebt wurde.
- **Uebe-Hinweis** (Sektion 0 „So funktioniert diese Einheit"): Das Material ist Starthilfe (~80 %), nicht Vollprogramm; die fachlichen Grundlagen uebt die LP **vorab im Unterricht**, die Herausforderungsblaetter setzen das Vorwissen voraus.

### J) Cluster 5 — Didaktik-Hinweise, Coaching & Scaffolds, Methoden-Ausblick (LP-only)

Gute Inhalte sind vorhanden, gehen aber unter — vor allem im Begleiter. **Sichtbarkeit erhoehen, Inhalt nicht neu erfinden.** Alle Punkte sind LP-only (Begleitdokument + DocKnLp), nie SuS.

**Render (`begleiter-builder.ts`):** Die Callout-Typen `coaching` und `differenzieren` bekommen extra visuelles Gewicht — farbiges Header-Band (Label weiss auf Rahmenfarbe) + Box-Rahmen statt des leichteren Links-Rand-Stils der uebrigen Callouts (`EMPHASIS_CALLOUTS`). Gilt automatisch fuer alle Einheiten.

**Begleiter (Phase 5) — drei Ergaenzungen:**
- **Coaching & Scaffolds — gebuendelt** (pro Herausforderung, Sektionen 3-5 Punkt 9): Am Ende jeder Herausforderung ein Abschnitt `### Coaching & Scaffolds — auf einen Blick`, der die schon vorhandenen Coaching-Moves + Scaffolds als Schnell-Referenz sammelt: `[!coaching] Die drei Moves dieser Herausforderung` (LF-Moves als nummerierte Kurzliste) + Zeile „Zum Abgeben bereit:" mit den Scaffold-Namen. Buendelt nur, erfindet nichts.
- **Perspektivenwechsel** (pro Herausforderung): direkt danach ein `[!coaching] Perspektivenwechsel`-Callout mit einem konkreten, auf den Konflikt der Herausforderung bezogenen Perspektivenuebernahme-Move (Sicht der Gegenseite zuerst einnehmen), begruendet ueber das situationsspezifische Spannungsfeld bzw. die aktivierte SK (oft SK7).
- **Methodenvielfalt-Ausblick** (Sektion 8, KN): nach der Methodenwahl-Tabelle ein `[!hinweis] Ausblick — weitere Pruefformen moeglich`: die 3 KN-Typen (Fachgespraech / Mini Case schriftlich / Werkschau + Transfer) sind ein Startset; weitere Formen (Critical Incident, Produkt mit Praesentation) tragen dieselbe Hybrid-Herausforderung und dieselbe Rubrik, sind aber noch nicht ausgearbeitet. Reiner Text, keine Funktion.

**WhatsApp-Beispiel bleibt** (Herausforderung B, Kanalwahl): legitime Kanalwahl-Uebung, kein Eingriff — bewusst dokumentiert, damit es niemand „bereinigt".

## References

- `references/nrlp-lehrmittel-crosswalk.md` — **Phase 0 Pflicht-Lookup:** welche Lehrmittel-Kapitel zu welchem nRLP-Lebensbezug gehoeren (nach Lehrgang). Nummerierungen sind NICHT deckungsgleich. Enthaelt zusaetzlich die Anleitung zur Gegenlesung mit NotebookLM (Query-Vorlage, Filterregeln) und das Aenderungsprotokoll der Tabelle.
- `references/prinzip-architecture.md` — Phase 0.5 Design-Regeln
- `references/kn-architecture.md` — Phase 4 Design-Regeln (Hybrid + 3 KN-Typen + Rubrik)
- `references/json-field-mapping.md` — Feld-fuer-Feld Mapping
- `references/coherence-checklist.md` — 32 Checks v2.4 (1-9+14+17-WARN+18-Sit+19-24+30+31+32: Phase 2, 10-13+15-16-WARN+18-KN: Phase 4, 25-29: Phase 5/Begleiter)
- `references/_common_misspellings.md` — Bekannte Spell-Halluzinationen, Pre-Write-Check-Liste
- `references/hko-framework.md` — 12 SK, 9 Sprachmodi, 8 Aspekte, Bloom, bi-dim Rubric
- `references/language-rules.md` — Swiss German, ICH-Perspektive, verbotene Phrasen
- `references/_migration_notes.md` — 5er-zu-3er Delta-Doku
- `references/sprachmodus-ids.md` — kanonische SM1-SM9 Nummerierung (Cluster 1)
- `references/sprachfoerderung-methoden.md` — Methoden je Sprachmodus, LP-Abschnitt (Cluster 3, ENTWURF)
- `references/system-overview.md`, `references/system-data.md` — Cross-Repo System-Doku + Render-Felder
- `assets/prinzip-template.json`, `assets/mission-template.json`, `assets/set-template.json`, `assets/kn-template.json` — Schema-Wahrheit
