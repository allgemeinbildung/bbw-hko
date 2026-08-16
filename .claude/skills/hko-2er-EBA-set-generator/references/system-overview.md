> **Hinweis (bbw-hko-native Variante):** Dieser Skill (`bbw-hko-3er-set`) generiert
> Einheiten **direkt im bbw-hko-Repo** nach `src/data/einheiten/{X.Y.Z}_{slug}/`.
> Das folgende Dokument beschreibt die urspruengliche Zwei-Repo-Topologie (hko-deploy als
> Generation-Hub + missions-renderer). Operativ gelten die Pfade aus `SKILL.md`, nicht die
> hier genannten hko-deploy/missions-renderer-Pfade.

# HKO 3er-Set — System Overview

**Scope:** Both repositories — `hko-deploy` (generation + web renderer) and `bbw-hko` (Astro platform + DOCX bundler).

> **v2.0 — Auftrag/Dossier-Redesign (2026-06):** Der bbw-hko-Renderer (`src/components/einheiten/docs/`) wurde umgebaut: Seite-1-Cockpit mit zusammengefuehrter Herausforderung; **Checkliste Vollständigkeit** (4 Zeilen, `vollstaendig_wenn`) statt Bewertungsraster; radiale/Quadranten-Mindmap; Handlungsprodukt-Split (Anleitung mit **Gütekriterien** + **Scaffolding** / Arbeitsflaeche); eigenstaendiges **"Austausch & Transfer"**-Set-Dokument (`DocAustausch.tsx` / `buildAustausch`). `emotion_tag` / Wochenplan / `zahlen_tabelle` / KOMP-Badge entfallen in der Anzeige; LF4 ist eine fokussierte Sprachmodus-Teilaufgabe. Neue JSON-Felder (additiv): `bewertungsraster[].vollstaendig_wenn`, `handlungsprodukt.scaffolding`, `set.austausch_phase.einzelauftrag`. Details: `docs/auftrag-redesign-handoff.md` und `references/system-data.md`. Einzelne Detailzeilen weiter unten koennen noch den Vor-Redesign-Stand zeigen.

---

## 1. Repository Roles

| Repo | Role | Key Paths |
|---|---|---|
| `hko-deploy` | Generation hub + web renderer | `.claude/skills/hko-3er-set-generator/` · `public/missions-renderer/` · `public/nrlp/` |
| `bbw-hko` | Astro platform — teacher-facing portal with ZIP download | `src/data/einheiten/` · `src/lib/einheiten/` · `src/components/einheiten/` · `renderer/` |

---

## 2. End-to-End Data Flow

```
Lehrmittel (PDF chapters)
        ↓  SKILL Phase 0 — NRLP Lookup
nrlp.json (material/_lehrmittel/)
        ↓  SKILL Phase 0.5–4 — Generation
6 JSON files + teacher.html + begleiter.md
  → src/data/einheiten/
        ↓  Manual DEPLOYMENT step
  → bbw-hko/renderer/data/          (flat, for legacy renderer)
  → bbw-hko/src/data/einheiten/{slug}/  (folder, for Astro app)
        ↓  npm run build:einheiten-index
src/data/einheiten.index.json
        ↓  Teacher visits /einheiten/{slug}
EinheitWorkbench.tsx (React island)
        ↓  Click "Alle als ZIP"
ZIP bundle (HTML + DOCX per doc type)
        ↓  Teacher downloads
Classroom use
```

---

## 3. Generated File Set (per competency)

All files share the naming prefix `{X.Y.Z}_{topic_slug}`.

| File | Phase | Purpose |
|---|---|---|
| `_prinzip.json` | 0.5 | Red thread: Kern-Versprechen, 3 Herausforderungen, SK-Schnittmenge, Persona-Pools |
| `_herausforderung_A.json` | 2 | Student situation A (Rezeption/Analyse) |
| `_herausforderung_B.json` | 2 | Student situation B (Entscheidung) |
| `_herausforderung_C.json` | 2 | Student situation C (Produktion/Handlung) |
| `_set.json` | 3 | Jigsaw Austausch + Transfer-Aufgabe |
| `_kn.json` | 4 | Kompetenznachweis: Hybrid-Herausforderung + 3 KN-Typen + Rubrik |
| `_teacher.html` | 5 | Teacher summary (HTML, not in ZIP) |
| `_begleiter.md` | 6 | Full lesson companion (Markdown → DOCX in ZIP) |

---

## 4. Schema: `prinzip.json`

The Prinzip is the **architectural backbone**. Herausforderungen and KN both reference it.
It is **never directly rendered** to students — it drives the DOC-KN-LP teacher doc and the `begleiter.md`.

```jsonc
{
  "id": "1.1.1_konflikt_kommunizieren_prinzip",  // {X.Y.Z}_{slug}_prinzip
  "modul": "1.1",
  "kompetenz_nr": "1.1.1",
  "lehrgang": "EFZ_3J",                          // EFZ_3J | EFZ_4J | EBA_2J
  "topic_slug": "konflikt_kommunizieren",

  // The one-sentence competency promise (ICH-form, K3/K4 verb)
  "kern_kompetenzversprechen": "Ich erkenne meine Rechte...",

  // One entry per situation letter
  "herausforderungen": {
    "A": {
      "herausforderung": "Rechte und Pflichten im Lehrvertrag klären...",
      "konfliktart": "Auftrag des Berufsbildners gegen Lehrvertrag-Recht",
      "handlungsprodukt_typ": "Konflikt-Landkarte und Positionspapier",
      "transferrable": true
    },
    "B": { ... },
    "C": { ... }
  },

  // Bloom target per Leitfrage (fixed across all situations)
  "bloom_zielprofil": {
    "LF1": "K2", "LF2": "K3", "LF3": "K3", "LF4": "K3+/K4"
  },

  // SK per situation (provisional in Phase 0.5, confirmed in Phase 2)
  "sk_pro_situation": {
    "A": [1, 6, 11],
    "B": [6, 7, 11],
    "C": [4, 7, 11]
  },

  // SK that appear in >=2 of 3 situations — used for KN
  "sk_schnittmenge_kn": {
    "primary": [6, 7, 11]     // NO secondary in 3er-Set
  },

  // Aspekte from NRLP + anticipated from konfliktart signals
  "aspekte": {
    "Recht": "R1",
    "Ethik": "R1",
    "Identität und Sozialisation": "R1",
    "Technologie und digitale Transformation": "R1"
  },

  // The tension space (>=2 poles)
  "mehrdeutigkeits_architektur": {
    "trade_off_raum": [
      "Eigene Rechte durchsetzen vs. Beziehung zum Berufsbildner erhalten",
      "Schnelle digitale Antwort vs. überlegtes persönliches Gespräch",
      "Klare Position vertreten vs. Lernenden-Rolle und Lernchance wahren"
    ],
    "verbindlich": "In jedem Konflikt trägt mehr als ein legitimes Interesse..."
  },

  // Generic transfer principle + field
  "dekontextualisierungs_anker": {
    "anker_statement": "Wer im Konflikt handlungsfähig ist, klärt zuerst die Sachlage...",
    "transferfeld": "Jede Herausforderung mit Rollenkonflikt und Kommunikationsentscheidung"
  },

  // Spiral iteration notes (for DOC-KN-LP section 02)
  "zirkularitaet": {
    "r1_aktuell": "T1 — Konflikt im Lehrverhältnis, Grundlagen klären",
    "r2_voraussicht": "T4 — Verantwortung im sozialen Zusammenleben",
    "r3_voraussicht": "T7 — Konflikte in der Arbeitswelt nach der Lehre"
  },

  // 3 berufe + 3 orte, each used EXACTLY ONCE across sit_A/B/C
  "persona_pool_units": {
    "berufe": ["Schreiner/in EFZ", "Automobilfachmann/-frau EFZ", "Informatiker/in EFZ"],
    "orte": ["Winterthur", "Aarau", "Luzern"]
  },

  // 2 berufe + 2 orte DISJOINT from units, for KN Hybrid-Herausforderung
  "persona_pool_kn_neu": {
    "berufe": ["Konstrukteur/in EFZ", "Polymechaniker/in EFZ"],
    "orte": ["Olten", "Bern"]
  },

  // Constraints passed to Phase 4 KN generator
  "hybrid_situation_spec": {
    "max_woerter": 120,
    "perspektive": "ICH",
    "must_activate_trade_offs_min": 1,
    "must_combine_herausforderungen": ["A", "B", "C"],
    "lehrjahr_constraint": "match_units"
  }
}
```

**Rendered in:** DOC-KN-LP (sections 01 Herausforderungen, 02 Zirkularität, 03 Konzeptbogen) · `begleiter.md` (sections 1 Ressourcenanalyse, 2 Varianten, 7 Transfer)

---

## 5. Schema: `herausforderung_{A|B|C}.json`

Each situation renders into **DOC-S** (Situationsheft) — a 4-page A4 document.

### Full field list with rendering targets

```jsonc
{
  // ── Identity ──────────────────────────────────────────────────────────────
  "id": "1.1.1_konflikt_kommunizieren_hf_A",
  "template": "default_4page_v2",    // RESERVED — renderer ignores this value
  "modul": "1.1",
  "modul_titel": "Ins Berufsleben einsteigen",  // Rendered: DOC-S cockpit italic
  "lehrgang": "EFZ_3J",
  "buchstabe": "A",                  // Rendered: DOC-S badge "Herausforderung A"

  // ── Colors (hex without #) ──────────────────────────────────────────────
  "sit_farbe": "#C0392B",            // Accent color for all section headers, badges, borders
  "sit_farbe_light": "#FADBD8",      // Shading background (cockpit cards, callouts)
  "sit_farbe_mid": "#E74C3C",        // Mid-tone (e.g. mindmap axis label)

  // ── Cockpit block (Page 1) ───────────────────────────────────────────────
  "titel": "Aufgabe gegen die Abmachung...",   // DOC-S: large title heading
  "emotion_tag": "Verunsicherung",             // DOC-S: badge next to "SIT A"
  "herausforderung": {
    "buchstabe": "A",                          // DOC-S: "Herausforderung A — {label}"
    "label": "Rechte und Pflichten im Lehrvertrag klären..."
  },
  "persona": {
    "beruf": "Schreiner/in EFZ",               // DOC-S: cockpit PERSONA card (bold)
    "betrieb": "Schreinerei Brunner",           // DOC-S: cockpit PERSONA card (muted)
    "ort": "Winterthur"                        // DOC-S: cockpit PERSONA card (muted)
  },
  "handlungsprodukt": {
    "format": "Positionspapier",               // DOC-S: cockpit HP card (bold) + badge
    "format_detail": "A4, 250-300 Wörter, 3B-Schema",  // not currently rendered in DOCX
    "titel": "Konflikt-Landkarte + Positionspapier",   // DOC-S: cockpit HP card (muted)
    "beschreibung": "Erstelle eine Konflikt-Landkarte...",  // DOC-S: HP section body text
    "schritte": [                              // DOC-S: HP section numbered steps
      { "label": "Fakten sichern", "hint": "Trage alle..." },  // label=bold, hint=muted
      { "label": "...", "hint": "..." },
      { "label": "...", "hint": "..." },
      { "label": "...", "hint": "..." },
      { "label": "...", "hint": "..." }        // FIXED: exactly 5 steps
    ],
    "schreib_label": "HIER ERARBEITEN",        // DOC-S fill mode: skizze-box label
    "schreib_note": "..."                      // not currently rendered
  },
  "wochen_plan": [                             // DOC-S: cockpit WOCHENPLAN table
    { "label": "Woche 1 — Informieren", "text": "Kap. 1.4 lesen...", "aktiv": true },
    { "label": "Woche 2 — Erarbeiten", "text": "Positionspapier verfassen...", "aktiv": true },
    { "label": "Woche 3 — Austausch", "text": "Jigsaw + Transfer", "aktiv": true }
  ],
  "bewertungsraster": [                        // DOC-S: cockpit BEWERTUNGSRASTER table
    { "produkt": "Leitfragen", "abgabe": "Ende Woche 1", "gewicht": 20, "kriterium": "..." },
    { "produkt": "Mindmap",    "abgabe": "Ende Woche 1", "gewicht": 15, "kriterium": "..." },
    { "produkt": "Handlungsprodukt", "abgabe": "Ende Woche 2", "gewicht": 35, "kriterium": "..." },
    { "produkt": "Reflexion",  "abgabe": "Ende Woche 2", "gewicht": 15, "kriterium": "..." },
    { "produkt": "Transfer", "abgabe": "Ende Set", "gewicht": 15, "kriterium": "..." }
    // FIXED: exactly 5 rows, sum of gewicht == 100
  ],
  "quellen_anker": [                           // DOC-S: cockpit QUELLEN list
    { "ref": "Kap. 1.4", "titel": "Lehrvertrag", "seiten": "28–37" }
  ],

  // ── Herausforderung block (Page 2) ─────────────────────────────────────────────
  "situation_text": "Du bist Schreiner-Lernende/r im 1. Lehrjahr...",  // DOC-S: main body (5-6 sentences)
  "zahlen_tabelle": [                          // DOC-S: data table below situation text (optional)
    { "label": "Wochenlohn", "wert": "CHF 600" }
  ],
  "leitfrage": "Darf dein Berufsbildner das?", // DOC-S: callout box "LEITFRAGE" (singular)
  "mehrdeutigkeit": {
    "explizit": true,
    "trade_off": "Eigene Rechte durchsetzen vs. Beziehung erhalten",  // DOC-S: callout "SPANNUNGSFELD"
    "hint": "Beide Pole sind legitim..."       // not currently rendered in DOCX
  },

  // ── Leitfragen section (Page 3) ──────────────────────────────────────────
  "leitfragen_intro": "Bearbeite die Leitfragen einzeln...",  // DOC-S: intro text before LF list
  "leitfragen": [                              // FIXED: exactly 4 items
    {
      "nr": 1,                                 // DOC-S: "LF1" prefix (Consolas bold, accent)
      "text": "Nenne fünf wichtigste Punkte...",  // DOC-S: question text
      "bloom": "K2 · Verstehen",               // DOC-S: [K2 · Verstehen] tag below question
      "knoten_ref": "lehrvertrag_rechte",      // DOC-S: source ref (Consolas, accent, fill mode only)
      "feld_hoehe_mm": 15                      // fill mode: writing field height
    },
    { "nr": 2, ... },
    { "nr": 3, ... },
    { "nr": 4, ... }
  ],

  // ── Mindmap section (Page 3) ─────────────────────────────────────────────
  "mindmap_zentrum": "Konflikt im Lehrverhältnis",  // DOC-S: center node (accent bg, white text)
  "mindmap_aeste": [                           // FIXED: exactly 4 items
    { "titel": "Rechtslage", "optional": false, "punkte": ["OR 345a", "ArG 31", "BiVo"] },
    { "titel": "Kommunikation", "optional": false, "punkte": ["Kanal", "Register"] },
    { "titel": "Konfliktweg", "optional": false, "punkte": ["direkt", "BBV", "Amt"] },
    { "titel": "Zirkularität", "optional": true, "punkte": [] }  // 4th always optional: true
    // info mode: renders all punkte as bullets
    // fill mode: renders only titel labels (skeleton for student to fill)
  ],

  // ── Handlungsprodukt section (Page 3, see handlungsprodukt above) ────────

  // ── Reflexion section (Page 4) ───────────────────────────────────────────
  "reflexion_fragen": [                        // FIXED: exactly 3 items
    {
      "nr": "R1",                              // DOC-S: "R1" prefix (Consolas bold, accent)
      "text": "Was habe ich gelernt?",         // question text
      "sub": null,                             // optional sub-question (muted italic) — null in 3er
      "feld_hoehe_mm": 10                      // fill mode: writing field height
    },
    { "nr": "R2", ... },
    { "nr": "R3", ... }
  ],

  // ── Transfer (Page 4, from set.json normally) ────────────────
  "dekontextualisierung": {
    "frage": "Wie überprüfe ich in einer anderen Vertragssituation...",  // DOC-S: "Leitend:" line
    "ziel": "Sachlage und eigene Rechte VOR der Reaktion klären..."       // not in DOCX, in begleiter
  },

  // ── Prinzip-First fields (generation metadata, not rendered in DOCX) ─────
  "prinzip_ref": "1.1.1_konflikt_kommunizieren_prinzip",  // cross-reference key
  "prinzip_handoff": {
    "kernkonzept": "Rechte und Pflichten aus dem Lehrvertrag...",  // → set.konzept_progression
    "lehrmittel_anker": "Kap. 1.4 S. 28-37",
    "kn_aktivierung": "Im KN erscheint diese Herausforderung als...",   // → begleiter KN section
    "transfer_check": "Bei jeder neuen Anweisung im Lehrbetrieb..." // → begleiter Dekontext
  },
  "sk_anker": [                                // one entry per SK in nrlp.sk
    { "sk": 1, "wo": "Lernende unterscheidet zwischen relevanten Quellen..." },
    { "sk": 6, "wo": "Im Positionspapier (LF4) begründet die Lernende..." },
    { "sk": 11, "wo": "Reflexion R3 verlangt, dass die Lernende den Trade-off..." }
  ],

  // ── NRLP taxonomy reference ───────────────────────────────────────────────
  "nrlp": {
    "nr": "1.1.1",
    "nr_primary": ["1.1"],
    "lebensbezug": "Ich finde mich in meiner Ausbildung zurecht...",
    "themen": ["T1 — Ins Berufsleben einsteigen"],
    "gesellschaft": [                          // used in DOC-KN-LP aspekte tags
      { "aspekt": "Recht", "iteration": "R1" },
      { "aspekt": "Identität und Sozialisation", "iteration": "R1" }
    ],
    "sprachmodi": ["Rezeption schriftlich und bildlich", "Interaktion und Kollaboration schriftlich"],
    "sk": [1, 6, 11]                           // must match sk_anker.length
  },

  // ── Fixed values ──────────────────────────────────────────────────────────
  "wochen": 3,
  "legacy": {},
  "source_refs": {},
  "registry_tags": {}
}
```

### DOC-S page structure

| Page | Section label | Fields consumed | Info mode | Fill mode |
|---|---|---|---|---|
| 1 | Cockpit | `titel`, `emotion_tag`, `nrlp.nr`, `herausforderung`, `persona`, `handlungsprodukt.format/titel`, `wochen_plan`, `bewertungsraster`, `quellen_anker` | Full cockpit | Full cockpit |
| 2 | Herausforderung | `persona`, `emotion_tag`, `situation_text`, `zahlen_tabelle`, `leitfrage`, `mehrdeutigkeit.trade_off` | Full text | Full text |
| 3 | Leitfragen | `leitfragen_intro`, `leitfragen[].nr/text/bloom/knoten_ref` | Questions only (no fields) | Questions + writing fields (feld_hoehe_mm) |
| 3 | Mindmap | `mindmap_zentrum`, `mindmap_aeste[].titel/optional/punkte` | Full with all `punkte` | Skeleton: zentrum + ast-titel only |
| 3 | Handlungsprodukt | `handlungsprodukt.format/beschreibung/schritte[].label/hint` | Steps + hints | Steps + hints + skizzeBox |
| 4 | Reflexion | `reflexion_fragen[].nr/text/sub` | Questions only | Questions + writing fields |
| 4 | Austausch & Transfer | `set.austausch_phase`, `set.dekontextualisierungs_aufgabe`, `sit.dekontextualisierung.frage` | Full text | Full text + "Dein Transfer" writing field |

---

## 6. Schema: `set.json`

The Set document links the three situations and defines the closing activities.

```jsonc
{
  "id": "1.1.1_konflikt_kommunizieren_set",
  "prinzip_ref": "1.1.1_konflikt_kommunizieren_prinzip",
  "kn_ref": "1.1.1_konflikt_kommunizieren_kn",     // forward reference (OK before Phase 4)
  "herausforderungen": [
    "1.1.1_konflikt_kommunizieren_hf_A",
    "1.1.1_konflikt_kommunizieren_hf_B",
    "1.1.1_konflikt_kommunizieren_hf_C"
  ],

  // 3 rows; konzept sourced from sit_*.prinzip_handoff.kernkonzept
  "konzept_progression": [
    {
      "position": 1,
      "herausforderung": "1.1.1_konflikt_kommunizieren_hf_A",
      "konzept": "Rechte und Pflichten aus dem Lehrvertrag als Sachgrundlage..."
    },
    { "position": 2, "herausforderung": "...hf_B", "konzept": "Bewusste Kanal- und Register-Wahl..." },
    { "position": 3, "herausforderung": "...hf_C", "konzept": "Konfliktgespräch als Zusammenspiel..." }
  ],

  // Fixed Jigsaw-3 template
  "austausch_phase": {
    "format": "gruppenpuzzle_jigsaw",
    "dauer_min": 30,
    "gruppenarbeit_jigsaw": {
      "runde_1": "Expertise teilen — 90 Sek. pro Person: Problem, Entscheid, stärkstes Argument.",
      "runde_2": "Gemeinsamkeit abstrahieren — Was haben alle drei Herausforderungen gemeinsam?",
      "runde_3": "Transfer — Welche Herausforderung wäre persönlich am schwierigsten und warum?"
    },
    "einzelarbeit_plenum": "Einen gemeinsamen Prinzipsatz an der Tafel sammeln."
  },

  // Fixed template; ziel is set-specific
  "dekontextualisierungs_aufgabe": {
    "auftrag": "Übertrage das Kernprinzip aus deinen drei Herausforderungen auf einen neuen, selbst gewählten Kontext.",
    "format": "schriftlich, 5–7 Sätze, Lehrmittelbegriffe verwenden",
    "ziel": "Wer im Konflikt handlungsfähig ist, klärt zuerst die Sachlage...",
    "gewicht_prozent": 15,
    "abgabe": "vor dem KN, als Einzelarbeit"
  }
}
```

**Rendered in:** DOC-S section 07 (Austausch & Transfer) · DOC-KN-LP section 03 (Konzeptbogen) · `begleiter.md` sections 6 + 7

### set.json → DOC-S rendering

| Field | DOC-S location |
|---|---|
| `austausch_phase.format` + `dauer_min` | Section 07 header: `AUSTAUSCH · GRUPPENPUZZLE_JIGSAW · 30 MIN` |
| `gruppenarbeit_jigsaw.runde_1/2/3` | Section 07: `Runde 1 / Runde 2 / Runde 3` lines |
| `einzelarbeit_plenum` | Section 07: `PLENUM` paragraph |
| `dekontextualisierungs_aufgabe.auftrag` | Section 07: `DEKONTEXTUALISIERUNG` bold text |
| `dekontextualisierungs_aufgabe.format` + `gewicht_prozent` + `abgabe` | Section 07: meta line |
| `sit.dekontextualisierung.frage` | Section 07: `Leitend:` callout (per situation) |

### set.json → DOC-KN-LP rendering

| Field | DOC-KN-LP location |
|---|---|
| `konzept_progression[].position` + `.konzept` | Section 03: two-column table `# | Konzept` |

---

## 7. Schema: `kn.json`

The Kompetenznachweis renders two documents: **DOC-KN-S** (student) and **DOC-KN-LP** (teacher).

```jsonc
{
  "id": "1.1.1_konflikt_kommunizieren_kn",
  "set_ref": "1.1.1_konflikt_kommunizieren_set",
  "prinzip_ref": "1.1.1_konflikt_kommunizieren_prinzip",
  "anchored_situations": [
    "1.1.1_konflikt_kommunizieren_hf_A",
    "1.1.1_konflikt_kommunizieren_hf_B",
    "1.1.1_konflikt_kommunizieren_hf_C"
  ],
  "kompetenz_nr": "1.1.1",
  "kern_kompetenzversprechen": "Ich erkenne meine Rechte im Konflikt...",  // fallback if no prinzip
  "dominanter_aspekt": "Recht",        // drives rubrik_shared.kriterien[2].name
  "mehrdeutigkeits_pflicht": "In jedem Konflikt trägt mehr als ein legitimes Interesse...",

  // ── Hybrid-Herausforderung ───────────────────────────────────────────────────────
  "hybrid_situation": {
    "titel": "Critical Incident: der Brief vom Lehrlings-Verantwortlichen",
    "persona": {
      "beruf": "Konstrukteur/in EFZ",           // NEW beruf from persona_pool_kn_neu
      "betrieb": "Konstruktionsbüro Berger",
      "ort": "Olten"
    },
    "emotion_tag": "Zwickmühle",
    "text": "Ich bin Konstrukteur-Lernender im 1. Lehrjahr...",  // MAX 120 words, ICH-form
    "leitfrage": "Wie gehe ich jetzt vor — und welcher Schritt ist der erste?",
    "aktivierte_trade_offs": [
      "Eigene Rechte durchsetzen vs. Beziehung zum Berufsbildner erhalten",
      "Schnelle digitale Antwort vs. überlegtes persönliches Gespräch",
      "Klare Position vertreten vs. Lernenden-Rolle und Lernchance wahren"
    ],
    "alignment_note": {
      "herausforderungen_mapping": [            // one entry per activated Herausforderung
        { "hf_letter": "A", "scene_element": "Bitte, die Lerndokumentation nicht zu führen..." },
        { "hf_letter": "B", "scene_element": "Die private WhatsApp mit Ultimatum bis 17 Uhr..." },
        { "hf_letter": "C", "scene_element": "Die Abwertung «Du bist halt noch nicht so weit»..." }
      ],
      "new_dimensions": []              // empty = hybrid activates no new conflict axes
    }
  },

  // ── KN-Typen (FIXED: exactly 3) ───────────────────────────────────────────
  "kn_typen": [

    // ── Typ 1: Fachgespräch ─────────────────────────────────────────────────
    {
      "typ": "fachgespraech",
      "label": "Fachgespräch",
      "format": "mündlich, 30–35 Min. (15 Min. Vorbereitung + 15–20 Min. Gespräch)",
      "ablauf": [
        "Lernende erhält Hybrid-Herausforderung + Frageblatt, bereitet 15 Min. still vor.",
        "Lehrperson stellt Fragen in der angegebenen Reihenfolge.",
        "Notizen erlaubt, aber: mündlich antworten, frei sprechen."
      ],
      "fragestruktur": [                  // FIXED: 5 items, K2→K3→K3→K4→K4
        { "nr": 1, "frage": "Erkläre mit eigenen Worten...", "typ": "Erklären",   "k_stufe": 2 },
        { "nr": 2, "frage": "Wende die Kanal-Logik an...",   "typ": "Anwenden",  "k_stufe": 3 },
        { "nr": 3, "frage": "Du musst dein Recht einfordern...", "typ": "Beurteilen", "k_stufe": 3 },
        { "nr": 4, "frage": "Vergleiche diesen Vorfall mit...", "typ": "Transfer", "k_stufe": 4 },
        { "nr": 5, "frage": "Welche ethische Werthaltung...", "typ": "Werthaltung","k_stufe": 4 }
      ],
      "sk": [6, 7, 11],
      "aspekte": ["Recht", "Ethik", "Identität und Sozialisation", "Technologie und digitale Transformation"],
      "sprachmodi": ["Rezeption schriftlich und bildlich", "Produktion mündlich", "Interaktion und Kollaboration mündlich"]
    },

    // ── Typ 2: Mini Case schriftlich ─────────────────────────────────────────
    {
      "typ": "mini_case_schriftlich",
      "label": "Mini Case schriftlich",
      "format": "schriftlich, 45–60 Min., Lehrmittel nach Anweisung, kein Internet",
      "ablauf": [
        "Alle Lernenden gleichzeitig.",
        "Lehrmittel: offen / geschlossen (Lehrperson entscheidet vor dem KN).",
        "Abgabe: Heft oder ausgedruckte Vorlage."
      ],
      "aufgaben": [                       // FIXED: 4 items, K2→K3→K3→K4
        { "nr": 1, "aufgabe": "Erkläre Fakten/Diagramm...", "typ": "Erklären",   "k_stufe": 2 },
        { "nr": 2, "aufgabe": "Unterscheide warum X ethisch anders...", "typ": "Unterscheiden", "k_stufe": 3 },
        { "nr": 3, "aufgabe": "Entscheide konkret im Hybrid-Kontext...", "typ": "Entscheiden", "k_stufe": 3 },
        { "nr": 4, "aufgabe": "Formuliere eine Policy in Ich-Form...", "typ": "Forderung",  "k_stufe": 4 }
      ],
      "sk": [6, 7, 11],
      "aspekte": ["Recht", "Ethik", "..."],
      "sprachmodi": ["Rezeption schriftlich und bildlich", "Produktion schriftlich und bildlich"]
    },

    // ── Typ 3: Werkschau + Transfer-Reflexion ────────────────────────────────
    {
      "typ": "werkschau_transfer",
      "label": "Werkschau + Transfer-Reflexion",
      "format": "schriftlich + optional 5 Min. Präsentation",
      "ablauf": [
        "Lernende wählt eines ihrer Handlungsprodukte aus den 3 Herausforderungen.",
        "Begründet Wahl in 2–3 Sätzen.",
        "Beantwortet 3 Transfer-Reflexionsfragen (insgesamt 200–250 Wörter)."
      ],
      "reflexionsfragen": [              // FIXED: 3 items (template-konstant)
        "Was habe ich durch dieses Produkt über [Kompetenz] gelernt?",
        "Wo habe ich das Spannungsfeld (Trade-off) gespürt — und wie habe ich entschieden?",
        "Wie würde ich das Prinzip in einem anderen Kontext einsetzen?"
      ],
      "optional_praesentation": "5 Min. Kurzpräsentation: Produkt zeigen + Wahl begründen",
      "sk": [5, 6, 11],                 // adaptive: from Union(sit_*.sk) ∩ [5,6,10]
      "aspekte": ["Recht", "Ethik", "..."],
      "sprachmodi": ["Produktion schriftlich und bildlich"]
    }
  ],

  // ── Shared Rubric (FIXED: 4 criteria × 4 levels, 3 Niveaubänder) ──────────
  "rubrik_shared": {
    "kriterien": [
      // 2 SuK criteria
      {
        "name": "Fachkorrektheit",
        "dimension": "SuK",
        "stufen": [
          "Begriffe fehlen oder falsch verwendet.",          // Stufe 1
          "Begriffe teilweise korrekt, Lücken vorhanden.",  // Stufe 2
          "Begriffe korrekt und situationsangemessen.",     // Stufe 3
          "Differenziert, kontextualisiert, eigenständig."  // Stufe 4
        ]
      },
      {
        "name": "Argumentation",
        "dimension": "SuK",
        "stufen": [
          "Keine Begründung oder reine Behauptung.",
          "Ansatz vorhanden, aber unvollständig.",
          "3B-Schema erkennbar, Trade-offs angedeutet.",
          "3B-Schema vollständig, Trade-offs explizit benannt."
        ]
      },
      // 2 Ges criteria (kriterien[2].name is driven by dominanter_aspekt)
      {
        "name": "Rechtliches Prinzip",   // example for dominanter_aspekt = "Recht"
        "dimension": "Ges",             // see mapping table in SKILL.md Phase 4 Step 6
        "stufen": [ "...", "...", "...", "..." ]
      },
      {
        "name": "Position / Werthaltung",
        "dimension": "Ges",
        "stufen": [
          "Keine eigene Position erkennbar.",
          "Position vorhanden, aber ohne Werthaltungs-Bezug.",
          "Ich-Form, Mehrdeutigkeit anerkannt.",
          "Mehrdeutigkeit klar benannt, Wunsch für Beziehung artikuliert."
        ]
      }
    ],
    "niveaubaender": [
      { "label": "unter 60 %", "definition": "Stufen 1–2 dominant" },
      { "label": "80 %",       "definition": "mehrheitlich Stufe 3" },
      { "label": "100 %",      "definition": "Stufe 4 in mindestens 3 Kriterien" }
    ]
  }
}
```

### kn.json → DOC-KN-S rendering (per KN-Typ)

| Field | DOC-KN-S section |
|---|---|
| `kompetenz_nr` | Badge `KN 1.1.1` (outline) |
| `kn_typen[i].label` | Badge (filled, accent) |
| `hybrid_situation.titel` | Title heading |
| `hybrid_situation.persona.beruf/betrieb/ort/emotion_tag` | Meta line below title |
| `hybrid_situation.text` | Body text (22pt) |
| `hybrid_situation.leitfrage` | Callout box `LEITFRAGE` |
| `kn_typen[i].format` | Section 02 `Format:` line |
| `kn_typen[i].ablauf[]` | Section 02 bullet list |
| `kn_typen[i].fragestruktur[].nr/frage/typ` | Section 03 (fachgespraech): `F1/F2...` with `[typ]` tag + writing field |
| `kn_typen[i].aufgaben[].nr/aufgabe/typ` | Section 03 (mini_case): `A1/A2...` with `[typ]` tag + writing field |
| `kn_typen[i].reflexionsfragen[]` | Section 03/04 (werkschau): `R1/R2/R3` + writing fields |
| `rubrik_shared.kriterien[].name/dimension` | Section 05: `Kriterium | Dimension` table |
| `rubrik_shared.niveaubaender[].label/definition` | Section 05: `NIVEAUBÄNDER` list |

### kn.json → DOC-KN-LP rendering

| Field | DOC-KN-LP section |
|---|---|
| `kern_kompetenzversprechen` (from prinzip or kn) | Title heading |
| `mehrdeutigkeits_pflicht` | Italic sub-heading |
| `dominanter_aspekt` | Badge `Dominanter Aspekt: {value}` |
| `prinzip.herausforderungen.A/B/C.herausforderung` | Section 01: per-letter `HERAUSFORDERUNG A` block |
| `prinzip.herausforderungen.A/B/C.konfliktart` | Section 01: `Konfliktart:` muted text |
| `prinzip.zirkularitaet.r1/r2/r3` | Section 02: `R1/R2/R3` lines |
| `set.konzept_progression[].position/konzept` | Section 03: `# | Konzept` table |
| `hybrid_situation.titel` | Section 04 heading |
| `hybrid_situation.persona.beruf/betrieb/ort` | Section 04 meta line |
| `hybrid_situation.text` | Section 04 body |
| `hybrid_situation.leitfrage` | Section 04 callout `LEITFRAGE` |
| `hybrid_situation.aktivierte_trade_offs[]` | Section 04 `AKTIVIERTE TRADE-OFFS` bullet list |
| `hybrid_situation.alignment_note.herausforderungen_mapping[]` | Section 05: `Herausforderung | Szenen-Element` table |
| `kn_typen[i].label/format/ablauf/fragestruktur-or-aufgaben[]` | Section 06.1–3: per typ |
| `kn_typen[i].sk[]` + `.aspekte[]` | Section 06: badge chips below questions |
| `rubrik_shared.kriterien[]` full 4×4 | Section 07: full rubric grid (Stufe 1–4 columns) |
| `rubrik_shared.niveaubaender[]` | Section 07: Niveaubänder list |
| SuK/Ges note boxes | Section 07: two empty boxes for teacher grading |

---

## 8. Schema: `begleiter.md`

The begleiter is authored in Markdown with YAML frontmatter and rendered to `.docx` via `begleiter-builder.ts`.

### Frontmatter

```yaml
---
titel: "Begleit-Dokument — {modul_titel} ({X.Y.Z})"
kompetenz: "{X.Y.Z} — {kern_kompetenzversprechen}"
autor: "Kernteam 1 — BBW Winterthur"
stand: "YYYY-MM-DD"
lehrgang: "EFZ 3J"
thema: "T{n} — {thema_titel}"
lebensbezug: "{X.Y}"
quellen_json:
  - "{X.Y.Z}_{slug}_set.json"
  - "{X.Y.Z}_{slug}_prinzip.json"
  - "{X.Y.Z}_{slug}_herausforderung_A.json"
  - "{X.Y.Z}_{slug}_herausforderung_B.json"
  - "{X.Y.Z}_{slug}_herausforderung_C.json"
  - "{X.Y.Z}_{slug}_kn.json"
---
```

### Callout syntax

```markdown
> [!type] Optional title
> Body text.
> Continue on next > line.
```

| Type | Visual in DOCX | Use for |
|---|---|---|
| `lernziel` | Green left border | Learning objectives, positive examples |
| `hinweis` | Blue left border | Organizational notes, time info |
| `beispiel` | Teal left border | Worked examples |
| `warnung` | Red/amber left border | Common pitfalls, mandatory constraints |
| `reflexion` | Purple left border | Reflective prompts for teacher |
| `coaching` | Orange left border | Specific classroom moves |
| `mehrdeutigkeit` | Yellow left border | Trade-off handling, ambiguity instruction |
| `differenzieren` | Cyan left border | 80% (all) vs. 100% (advanced) scaffolding |

### Document structure (8 sections)

| Section | Content | Sourced from |
|---|---|---|
| 0 | How this unit works (5 numbered principles) | All files |
| 1 | Kompetenz, Ressourcen, Architektur | `prinzip.json` + NRLP |
| 2 | Durchführungs-Varianten A/B/C | Unit design |
| 3 | Herausforderung A — full lesson guide | `herausforderung_A.json` + `prinzip.herausforderungen.A` |
| 4 | Herausforderung B — full lesson guide | `herausforderung_B.json` + `prinzip.herausforderungen.B` |
| 5 | Herausforderung C — full lesson guide | `herausforderung_C.json` + `prinzip.herausforderungen.C` |
| 6 | Austausch-Phase | `set.austausch_phase` |
| 7 | Transfer | `set.dekontextualisierungs_aufgabe` + `prinzip.dekontextualisierungs_anker` |
| 8 | Kompetenznachweis | `kn.json` (all fields) |
| Anhang | Source references | Quellen-Anker |

### Per-situation section structure (sections 3–5)

Each situation section contains:
1. **Steckbrief-Tabelle** — `sit_*.titel`, `herausforderung.label`, `persona`, `emotion_tag`, `nrlp.gesellschaft`, `nrlp.sprachmodi`, `nrlp.sk`, `handlungsprodukt.format/titel`
2. **Herausforderungs-Zitat** — `sit_*.situation_text` as blockquote
3. `[!hinweis] Qualität der Herausforderung` — 8-Merkmale check
4. **Unterrichtsfahrplan** — 2-Lektion table with AVIVA phases, from `leitfragen` + `handlungsprodukt`
5. **Leitfragen mit Coaching** — per LF: `leitfragen[].text` + `[!coaching]` + optional `[!warnung]`
6. **Scaffold-Werkstatt** — ready-to-print template derived from `handlungsprodukt.schritte` + `[!differenzieren]`
7. `[!mehrdeutigkeit]` — `mehrdeutigkeit.trade_off` + intervention instruction
8. **SK-Tabelle** — `sk_anker[].sk` + `.wo`

---

## 9. Render Targets in bbw-hko

The `EinheitWorkbench.tsx` React island produces three doc types and combines them into a ZIP.

### ZIP bundle structure

```
{kompetenz}_{slug}_hko_bundle.zip
├── html/
│   ├── {prefix}_doc-s_sit-A_info.html      ← DOC-S info mode (full mindmap + answers)
│   ├── {prefix}_doc-s_sit-A_fill.html      ← DOC-S fill mode (skeleton + writing fields)
│   ├── {prefix}_doc-s_sit-B_info.html
│   ├── {prefix}_doc-s_sit-B_fill.html
│   ├── {prefix}_doc-s_sit-C_info.html
│   ├── {prefix}_doc-s_sit-C_fill.html
│   ├── {prefix}_doc-kn-s_{typ1}.html       ← one per KN-Typ (3 files)
│   ├── {prefix}_doc-kn-s_{typ2}.html
│   ├── {prefix}_doc-kn-s_{typ3}.html
│   └── {prefix}_doc-kn-lp.html
├── word/
│   ├── {prefix}_doc-s_sit-A_info.docx
│   ├── {prefix}_doc-s_sit-A_fill.docx
│   ├── ... (same as html/, .docx extension)
│   ├── {prefix}_doc-kn-s_{typ1}.docx
│   ├── {prefix}_doc-kn-s_{typ2}.docx
│   ├── {prefix}_doc-kn-s_{typ3}.docx
│   └── {prefix}_doc-kn-lp.docx
├── {prefix}_begleiter.docx                 ← begleiter.md → DOCX
└── README.md
```

Total files: 6 DOC-S × 2 formats (HTML+DOCX) = 12 + 3 KN-S × 2 = 6 + 1 KN-LP × 2 = 2 + 1 begleiter + 1 README = **22 files** (when all 3 KN-Typen present and begleiter.md exists)

### DOCX builder functions

| Function | Input | Output |
|---|---|---|
| `buildDocS({sit, set, mode, abteilung, logoPng})` | `HerausforderungJson` + `SetJson` | `Document` (DOC-S) |
| `buildKnS({kn, knTyp, abteilung, logoPng})` | `KnJson` + typ string | `Document` (DOC-KN-S) |
| `buildKnLp({kn, prinzip, set, abteilung, logoPng})` | `KnJson` + `PrinzipJson` + `SetJson` | `Document` (DOC-KN-LP) |
| `buildBegleiterDocx(raw, logoPng)` | Raw markdown string | `Blob` (.docx) |
| `docToBlob(doc)` | `Document` | `Promise<Blob>` |

---

## 10. Deployment Checklist

After all 6 phases complete in `hko-deploy`:

```
src/data/einheiten/
  ✓ {X.Y.Z}_{slug}_prinzip.json
  ✓ {X.Y.Z}_{slug}_herausforderung_A.json
  ✓ {X.Y.Z}_{slug}_herausforderung_B.json
  ✓ {X.Y.Z}_{slug}_herausforderung_C.json
  ✓ {X.Y.Z}_{slug}_set.json
  ✓ {X.Y.Z}_{slug}_kn.json
  ✓ {X.Y.Z}_{slug}_teacher.html
  ✓ {X.Y.Z}_{slug}_begleiter.md
```

**Step 1** — Copy 6 JSONs flat to `bbw-hko/renderer/data/` (legacy viewer):
```
bbw-hko/renderer/data/
  {X.Y.Z}_{slug}_herausforderung_A.json
  {X.Y.Z}_{slug}_herausforderung_B.json
  {X.Y.Z}_{slug}_herausforderung_C.json
  {X.Y.Z}_{slug}_prinzip.json
  {X.Y.Z}_{slug}_set.json
  {X.Y.Z}_{slug}_kn.json
```

**Step 2** — Create slug folder and copy with flat names into `bbw-hko/src/data/einheiten/`:
```
bbw-hko/src/data/einheiten/{X.Y.Z}_{slug}/
  herausforderung_A.json   ← rename: drop {X.Y.Z}_{slug}_ prefix
  herausforderung_B.json
  herausforderung_C.json
  prinzip.json
  set.json
  kn.json
  begleiter.md      ← rename: drop prefix
```

**Step 3** — Rebuild Einheiten index (in bbw-hko):
```bash
npm run build:einheiten-index
```

**Step 4** — Verify in dev:
```bash
npm run dev
# → /einheiten should show new slug in catalog
# → /einheiten/{X.Y.Z}_{slug} should load the workbench
# → "Alle als ZIP" should produce a valid bundle
```

---

## 11. Umlaut Rule (cross-cutting)

The v1.4 rule applies to all prose fields across all files and all code:

| Context | Rule |
|---|---|
| JSON prose fields (all files) | Real umlauts `ä/ö/ü/Ä/Ö/Ü` required. No `ae/oe/ue` in visible text. |
| JSON IDs, filenames, slugs, JSON keys | Transliteration required (`ae/oe/ue`). No umlauts in paths. |
| `persona.beruf` | Exact canonical spelling from `hko-framework.md §11` — always with umlauts. |
| `persona.ort` | Exact canonical spelling — `Zürich`, `St. Gallen`, not `Zuerich`. |
| DOCX hardcoded strings (`docx-builder.ts`) | Real umlauts. Eszett `ß` forbidden — use `ss`. |
| `begleiter.md` prose | Real umlauts. YAML frontmatter values: real umlauts. |
| README in ZIP (`EinheitWorkbench.tsx`) | Real umlauts. |
| Eszett `ß` | Auto-fix to `ss` everywhere — never write `ß`. |

---

## 12. Key Constraints Summary

| Constraint | Value | Enforced by |
|---|---|---|
| `bewertungsraster` rows | Exactly 5, sum `gewicht == 100` | Skill Phase 2 Check |
| `leitfragen` count | Exactly 4 | Skill Phase 2 |
| `leitfragen[].feld_hoehe_mm` | 15 | Fixed value |
| `reflexion_fragen` count | Exactly 3 | Skill Phase 2 |
| `reflexion_fragen[].feld_hoehe_mm` | 10 | Fixed value |
| `mindmap_aeste` count | Exactly 4 (4th: `optional: true`) | Skill Phase 2 |
| `handlungsprodukt.schritte` count | Exactly 5 | Skill Phase 2 |
| `wochen` | 3 | Fixed value |
| `template` | `"default_4page_v2"` | Fixed value (reserved) |
| `hybrid_situation.text` word count | ≤ 120 | Phase 4 Check 10 |
| `kn_typen` count | Exactly 3 in order: fachgespraech, mini_case_schriftlich, werkschau_transfer | Phase 4 |
| `fragestruktur` count (fachgespraech) | 5, K2→K3→K3→K4→K4 | Phase 4 Step 3 |
| `aufgaben` count (mini_case) | 4, K2→K3→K3→K4 | Phase 4 Step 4 |
| `reflexionsfragen` count (werkschau) | 3 | Phase 4 Step 5 |
| `rubrik_shared.kriterien` | 4 rows: 2 SuK + 2 Ges, each 4 Stufen | Phase 4 Check 13 |
| `niveaubaender` | 3 bands (unter 60 / 80 / 100 %) | Fixed template |
| `persona_pool_units` | 3 berufe + 3 orte, each used exactly once in sit_A/B/C | Phase 2 Check 14 |
| `persona_pool_kn_neu` | 2 berufe + 2 orte, disjoint from units | Phase 4 Check 11 |
| Abteilungs-Mix | `persona_pool_units` must span ≥ 3 BBW Abteilungen | Phase 0.5 |
| `mehrdeutigkeit.trade_off` per sit | Must be an element of `prinzip.mehrdeutigkeits_architektur.trade_off_raum` | Phase 2 Check 6 |
| `sk_anker` length | Must equal `nrlp.sk.length` | Phase 2 Check 8 |
