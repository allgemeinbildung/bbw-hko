---
name: hko-ki-komplement
description: "Native bbw-hko skill: erzeugt KOMPLEMENTÄR zu einer bereits fertigen /einheiten-Unit die KI-Toolbox-Dokumente (2+1+1) plus den didaktischen KI-Liesmich — 2 KI-Aufträge (ki.json), 1 KI-Lernprompt (lernprompt.json), 1 KI-Lernbegleiter (lernbegleiter.json) und 1 KI-Toolbox-Liesmich für die Lehrperson (ki-liesmich.md) — und schreibt sie in denselben src/data/einheiten/{X.Y.Z}_{slug}/ Ordner. Sie LIEST die bestehenden prinzip.json + kn.json + herausforderung_A/B/C.json und ändert sie nie. Use whenever Pietro nach einer fertigen Einheit die KI-Schicht will: 'generiere die KI-Aufträge', 'ki-komplement für 1.1.1', 'KI-Toolbox für diese Einheit', 'mach den Lernbegleiter', 'KI-Liesmich', 'KI-Dokumente zur Unit'. Triggert auf KI/AI-Fluency/Lernprompt/Lernbegleiter/Liesmich + ein bestehender Einheiten-Slug. bbw-hko ONLY — schreibt nur ki/lernprompt/lernbegleiter/ki-liesmich, nie nach hko-deploy. Gold-Referenz: 1.1.1_konflikt_kommunizieren."
---

# hko-ki-komplement — KI-Toolbox (2+1+1) komplementär zu einer fertigen Einheit

Diese Skill ist die **Per-Unit-Ergänzung** zum KI-Toolbox-Renderer (Teil A, bereits
in bbw-hko verbaut). Sie läuft **nachdem** eine Einheit erzeugt wurde (durch
`bbw-hko-3er-set` oder `hko-2er-EBA-set-generator`) und produziert die drei
learner-facing KI-Dokumente, die der `EinheitWorkbench` unter «KI-Toolbox» rendert
und ins ZIP packt.

Portiert von hko-deploys `hko-3er-to-praxis` (Phase 5 KI-Set + Phase 8 Lernprompt),
mit einem **bbw-hko-Input-Adapter**, einem **4. Dokument (Lernbegleiter)** und einem
**5. Dokument: dem KI-Liesmich** (`ki-liesmich.md`) — ein teacher-facing didaktischer
Kompass, den die Skill **am Schluss aus dem, was sie selbst erzeugt hat**, ableitet.

---

## Scope (hart)

- **Schreibt ausschliesslich** nach `bbw-hko/src/data/einheiten/{X.Y.Z}_{slug}/`:
  `ki.json`, `lernprompt.json`, `lernbegleiter.json`, `ki-liesmich.md`.
- **Liest** (nie verändern!) im selben Ordner: `prinzip.json`, `kn.json`,
  `herausforderung_A.json`, `herausforderung_B.json`, `herausforderung_C.json`,
  `set.json`. Bei EBA-Units (`lehrgang: "EBA_2J"`) gibt es nur A/B + ggf.
  `dossier.json` — die Skill verträgt 2 Herausforderungen (siehe Adapter).
- **Niemals** nach hko-deploy, nie an die Renderer-Komponenten, nie an bestehende
  Unit-Dateien.

## Output-Vertrag (= was der Renderer frisst)

Die drei **JSON**-Dateien müssen **exakt** den Shapes in `assets/*.json` entsprechen
— das ist der bestätigte Renderer-Vertrag (`DocKi`/`DocLernprompt`/`DocLernbegleiter`,
`loadEinheit`, `build-einheiten-index`). **Gold-Referenz** (komplette, geprüfte
Beispiel-Unit): `src/data/einheiten/1.1.1_konflikt_kommunizieren/{ki,lernprompt,lernbegleiter}.json`.
Im Zweifel: an der Gold-Unit spiegeln, nicht frei erfinden.

Die vierte Datei `ki-liesmich.md` ist **kein** Renderer-JSON, sondern **Markdown
mit YAML-Frontmatter** — sie läuft durch dieselbe «Lies mich!»-Pipeline wie
`begleiter.md` (Route `einheiten/[setKey]/ki-liesmich.astro`, Word-Export
`api/einheit-ki-liesmich-docx`, ZIP via `buildBegleiterDocx`). Erlaubte Callouts =
exakt die acht der Begleiter-Pipeline: `lernziel, hinweis, beispiel, warnung,
reflexion, coaching, mehrdeutigkeit, differenzieren` (KEINE anderen, sonst werden
sie nicht gerendert). **Gold-Referenz:**
`src/data/einheiten/1.1.1_konflikt_kommunizieren/ki-liesmich.md`.

## Verbindliche Sprachregeln

Echte Umlaute `ä/ö/ü` in sichtbarer Prosa; `ae/oe/ue` nur in IDs/Keys/Filenames;
**kein `ß`** (→ `ss`). Gendern in Schrägstrich-Ein-Wort-Form
(`Berufsbildner/in`, `Lernende/r`). Details: `references/language-rules.md`.
Pre-Write-Scan auf `ß` und Transliteration in Prosa.

---

## Phasen-Workflow

```
PHASE 0   Input laden + Adapter        → Scoring-Inputs + KN-Transfer-Prinzip   [Confirm]
PHASE 1   KI-Pattern-Scoring 7 → 2     → Teacher-Preview                        [STOP kurz]
PHASE 2   ki.json (2 Aufträge)         → mit KN-Brücke in R3 (>=1 Auftrag)
PHASE 3   lernprompt.json (4 von 6)
PHASE 4   lernbegleiter.json (NEU)     → L1-L3 + Integritäts-Leitplanke
PHASE 4b  ki-liesmich.md (NEU)         → Selbst-Review der 4 Docs → Lehrer-Liesmich
PHASE 5   Validierung + Index          → Checks, dann build:einheiten-index-Hinweis
```

### PHASE 0 — Input laden + Adapter

Read `references/input-adapter.md`. Slug `{X.Y.Z}_{slug}` bestimmen, die 5-6
Unit-Dateien laden, daraus die Generierungs-Inputs ableiten:

| Input | Quelle in bbw-hko |
|---|---|
| `sk_targets` | `prinzip.sk_schnittmenge_kn.primary` |
| `aspekte` | Keys von `prinzip.aspekte` |
| Handlungsprodukt-Typen | `herausforderung_{A,B,C}.handlungsprodukt` (+ `prinzip.herausforderungen[X].handlungsprodukt_typ`) |
| Trade-offs | `prinzip.mehrdeutigkeits_architektur.trade_off_raum` |
| Zukunftsbezug | `prinzip.zirkularitaet.r2_voraussicht` / `r3_voraussicht` |
| **Transfer-Prinzip** (für `bezug`) | `prinzip.dekontextualisierungs_anker.anker_statement` + `kn.hybrid_situation` (Szene, an die `bezug` koppelt) |
| Kompetenzversprechen | `prinzip.kern_kompetenzversprechen` (== `kn.kern_kompetenzversprechen`) |
| KN-Typen | `kn.kn_typen[].{typ,label}` |
| KN-Rubrik | `kn.rubrik_shared.kriterien` (gruppiert nach `dimension` SuK/Ges) |
| `anchored_situations` | `kn.anchored_situations` |
| modul/thema/lehrgang | `herausforderung_A.modul` / `…modul_titel` / `prinzip.lehrgang` |

**Wichtig (der einzige strukturelle Unterschied zu hko-deploy):** hko-deploy hat
`praxis_spec`; bbw-hko hat keinen Praxisauftrag, sondern den **summativen KN**. Das
«Transfer-Prinzip», das beide KI-`bezug` nennen müssen, ist hier die
**KN-Hybrid-Situation** (`kn.hybrid_situation`) plus der `anker_statement`.

Confirm-Block ausgeben (Slug, sk_targets, aspekte, KN-Typen, Transfer-Prinzip in 1
Satz). Bei fehlenden Inputs `ERR_INPUTS` + auflisten, was fehlt.

### PHASE 1 — KI-Pattern-Scoring (7 → 2)

Read `references/ki-scoring.md`. Alle 7 Patterns scoren, **genau 2** wählen (Top-2,
verschiedene KI-Kompetenzen; Minimum 30 sonst flaggen). Teacher-Preview:

```
KI-Toolbox für: {slug}
1. {pattern_1}  (Score {s1}) — {grund}
2. {pattern_2}  (Score {s2}) — {grund}
Bestätigen? [j / ändern]
```

### PHASE 2 — ki.json (2 KI-Aufträge)

Read `references/ki-architecture.md` + `assets/ki-template.json`. Pro Auftrag:
`pattern, titel, ziel, bezug, auftrag, prompt_strategie[3-4], ki_frei_vorher,
schritte[5], guetekriterien[3-4 {kriterium,indikator}], reflexion[3]`. Set-Level:
`nrlp_anker` + `ki_leitfragen` aus dem Adapter.

- **Check P6:** `bezug` jedes Auftrags nennt **alle** vorhandenen Herausforderungen
  (A/B/C bzw. A/B bei EBA) **und** das Transfer-Prinzip.
- **Check P5:** je >=3 `guetekriterien`, eines prüft IMMER die **Verifikation**
  (jede KI-Quelle/jeder Rechtssatz nachgeschlagen).
- **KN-Brücke (Pietro-Erweiterung, verbindlich):** Bei **mindestens einem** der
  zwei Aufträge rahmt `reflexion[2]` (R3) den Transfer explizit als Brücke zu einem
  möglichen **KN** (z. B. «Im Fachgespräch müssen Sie …»). Konkrete KN-Typen/-Aufgaben
  aus `kn.kn_typen` namentlich referenzieren. → Check `KN_BRIDGE`.
- **AI-Fluency, keine Produktions-Abkürzung:** die KI prüft/challengt/spiegelt das
  Unit-Produkt, ersetzt es nie. `ki_frei_vorher` ist Pflicht.

### PHASE 3 — lernprompt.json (4 von 6 Techniken)

Read `references/lernprompt-techniken.md` + `assets/lernprompt-template.json`.
Immer `rollen_prompting` + `kontextualisieren`; +2 nach den Signalregeln
(SK/Aspekt/Produkt). Volle Technik-Blöcke + `stacking_seite_1` (Technik 1+2) +
`stacking_seite_2` (Technik 3+4; `prompt_2` baut explizit auf `prompt_1` auf) +
`prompt_vorlage`. `erklaerung` ohne Beispiele; `thema_bezug`/`warnung`
unit-spezifisch.

### PHASE 4 — lernbegleiter.json (NEU — learner-facing KN-Vorbereitung)

Read `references/lernbegleiter-architecture.md` + `assets/lernbegleiter-template.json`.
Blöcke: `titel, ziel, kompetenzversprechen` (verbatim), `ki_frei_zuerst`
(`selbsteinschaetzung[]` aus den Teilen des Kompetenzversprechens),
`strategie_karten[5]` (retrieval, feynman, mock_transfer, uebungs_feedback,
repetitionsplan — je `prompt_basis`+`prompt_fortgeschritten`+`warnung`),
`kn_typ_tracks[]` (einer pro `kn.kn_typen`), `rubrik_fokus[]` (pro Dimension
SuK/Ges, `kriterien` = Teilmenge von `kn.rubrik_shared`), `integritaet_warnung`,
`selbstcheck[]`.

- **Leitplanke (zwingend):** bereitet auf die **Kompetenz** vor, NIE auf die
  konkrete KN-Abgabe. → Checks **L1-L3**:
  - **L1:** referenziert `kompetenzversprechen` + `kn.kn_typen[]` + die
    `rubrik_shared`-Dimensionen.
  - **L2:** `mock_transfer` fordert einen **NEUEN** Fall, disjunkt von
    `kn.hybrid_situation`; keine Karte erzeugt das KN-Produkt/eine Musterlösung;
    `mock_transfer.warnung` verbietet die KN-Musterlösung explizit.
  - **L3:** jede Strategie-Karte hat `prompt_basis` **und** eine
    technik-spezifische `warnung` (nicht generisch).

### PHASE 4b — ki-liesmich.md (NEU — teacher-facing didaktischer Kompass)

Read `references/ki-liesmich-architecture.md` + `assets/ki-liesmich-template.md`.

Diese Phase **erfindet nichts neu**, sondern **liest zurück, was die Skill in
Phase 2-4 erzeugt hat**, und destilliert daraus einen kurzen Lehrer-Liesmich (ca.
2-3 A4-Seiten). Quellen (alle aus dieser Unit):

| Liesmich-Element | Quelle |
|---|---|
| Frontmatter `kompetenz/thema/lehrgang/lebensbezug` | `herausforderung_A.modul*` + `prinzip.lehrgang` (wie Begleiter-Frontmatter) |
| Tabelle «4 Dokumente» — Auftrags-Titel | `ki.assignments[].titel` (die zwei tatsächlich gewählten) |
| Liste der Prompt-Techniken | `lernprompt.techniken[].titel` (die vier tatsächlich gewählten) |
| Strategie-Karten-Namen (Reduktions-Rezept 3) | `lernbegleiter.strategie_karten[].technik` |
| KN-Typen (Timing/Brücke) | `kn.kn_typen[].label` |
| Grundregel + Integrität | `ki.assignments[].ki_frei_vorher` + `lernbegleiter.integritaet_warnung` |
| Rechts-/Quellen-Warnung (nur wenn zutreffend) | vorhanden, wenn ein `guetekriterium` Verifikation prüft / Aspekt «Recht» |

Pflicht-Abschnitte (siehe Template):
1. **Intro-Blockquote** — «für die Lehrperson», KI-Toolbox = optionales Zusatzangebot.
2. **§1 Was in der Toolbox steckt** — Tabelle der 4 Dokumente mit den **echten**
   Auftrags-Titeln + `[!hinweis]` mit den **vier** Technik-Namen dieser Unit.
3. **§2 Grundregel** — KI prüft, ersetzt nicht (`ki_frei_vorher`); plus
   `[!warnung]` Integrität (kein KN-Stoff in die KI) und — **nur wenn die Unit
   rechts-/quellenlastig ist** — `[!warnung]` Gegenprüfung von Quellen/Recht.
4. **§3 Dichte reduzieren** — die **vier** `[!differenzieren]`-Rezepte: eine Technik
   statt vier (Technik-Namen einsetzen) · nur ein KI-Auftrag (echte Titel) ·
   Lernbegleiter auf eine Karte (Karten-Name) · nur der Baukasten.
5. **§4 Didaktische Einsatz-Ideen** — `[!coaching]`/`[!differenzieren]`: Staffeln,
   Plenum-Demo, Gruppenpuzzle, Stationen, Vertiefung.
6. **§5 Kurz-Checkliste** — `[!lernziel]` mit der «ohne KI zuerst»- und
   «kein KN-Stoff»-Leitplanke.
7. **Anhang** — Quellen (`ki/lernprompt/lernbegleiter.json`) + Skill-Name.

- **Check LM1:** die echten Auftrags-Titel UND die vier Technik-Namen dieser Unit
  stehen im Liesmich (nicht generisch «KI-Auftrag 1/2»).
- **Check LM2:** §3 enthält **genau vier** `[!differenzieren]`-Rezepte; Rezept «eine
  Technik» nennt eine konkrete Technik dieser Unit; Rezept «ein Auftrag» nennt die
  echten Titel.
- **Check LM3:** nur erlaubte Callouts (`lernziel/hinweis/beispiel/warnung/reflexion/
  coaching/mehrdeutigkeit/differenzieren`); Frontmatter trägt `titel` + `untertitel`.
- **Leitplanke gespiegelt:** §2/§5 wiederholen die Lernbegleiter-Integrität (kein
  KN-Produkt, üben an anderen Fällen) — der Liesmich darf der Toolbox NICHT
  widersprechen.

### PHASE 5 — Validierung + Index

Pre-Write-Spellcheck (ß/Transliteration), dann schreiben. Danach Checks (unten)
laufen lassen; bei grün den Hinweis ausgeben: **`npm run build:einheiten-index`**
auf Windows laufen lassen (setzt `hat_ki`/`hat_lernprompt`/`hat_lernbegleiter`),
dann `/einheiten/{slug}` im Workbench prüfen (Nav-Gruppe «KI-Toolbox»: oben der
Link «📖 KI-Toolbox — Lies mich!», dann 4 Docs; A4-Overflow — v. a. DocKi Seite 1;
Liesmich-Route `/einheiten/{slug}/ki-liesmich` rendert + Word-Export geht).
Final-Summary mit Datei-Liste (jetzt **5** Dateien inkl. `ki-liesmich.md`).

---

## Checks (vor dem Abschluss, alle ERR ausser markiert)

| # | Check |
|---|---|
| P5 | Jeder KI-Auftrag hat >=3 `guetekriterien`; eines prüft Verifikation |
| P6 | Jeder `bezug` nennt alle vorhandenen Herausforderungen + das Transfer-Prinzip |
| KN_BRIDGE | Mindestens ein Auftrag rahmt R3 als Brücke zu einem KN-Typ (namentlich) |
| LP1 | `lernprompt.techniken` = genau 4, davon `rollen_prompting` + `kontextualisieren`; je voller Block + `baukasten{rolle,kontext,aufgabe,format}`; `erklaerung` ohne Beispiel |
| LP2 | `stacking_seite_1/2` mit `prompt_1` + `prompt_2`; `prompt_2` baut auf `prompt_1` auf |
| L1 | Lernbegleiter referenziert Kompetenzversprechen + `kn.kn_typen` + Rubrik-Dimensionen |
| L2 | `mock_transfer` fordert NEUEN, von `kn.hybrid_situation` disjunkten Fall; keine Musterlösung; Warnung verbietet KN-Lösung |
| L3 | Jede `strategie_karten`-Karte hat `prompt_basis` + technik-spezifische `warnung` |
| LM1 | `ki-liesmich.md` nennt die echten `ki.assignments[].titel` UND die vier `lernprompt.techniken[].titel` (nicht generisch) |
| LM2 | §3 hat genau vier `[!differenzieren]`-Rezepte; «eine Technik» nennt eine echte Technik, «ein Auftrag» die echten Titel |
| LM3 | Nur erlaubte Callouts; Frontmatter mit `titel`+`untertitel`; spiegelt die Lernbegleiter-Integrität (kein KN-Stoff) |
| SPRACHE | Kein `ß`; Umlaute echt; Gendern Schrägstrich-Form; sichtbar keine rohen SM-/SK-Codes |
| SHAPE | Alle drei JSON-Dateien validieren gegen `assets/*.json` (Feldnamen exakt); `ki-liesmich.md` gegen `assets/ki-liesmich-template.md` |

Fehlercodes: `ERR_INPUTS`, `ERR_KI_BEZUG` (P6), `ERR_GUETE` (P5),
`ERR_KN_BRIDGE`, `ERR_LP_SHAPE` (LP1/LP2), `ERR_LB_INTEGRITAET` (L2),
`ERR_LB_SHAPE` (L1/L3), `ERR_LIESMICH` (LM1/LM2/LM3), `ERR_SPRACHE`, `ERR_SHAPE`.

---

## References & Assets

- `references/input-adapter.md` — bbw-hko-Unit-JSONs → Generierungs-Inputs (Adapter-Tabelle, EBA-Sonderfall)
- `references/ki-architecture.md` — Zweck (AI-Fluency), Pflichtfelder, Anti-Patterns
- `references/ki-scoring.md` — 7 Patterns scoren → 2
- `references/lernprompt-techniken.md` — 6 Techniken, 4er-Auswahl, Stacking
- `references/lernbegleiter-architecture.md` — das 4. Dokument, L1-L3, Integritäts-Leitplanke
- `references/ki-liesmich-architecture.md` — das 5. Dokument (Markdown-Liesmich), Selbst-Review, LM1-LM3
- `references/language-rules.md` — Umlaut/Gendern/kein-ß
- `assets/ki-template.json`, `assets/lernprompt-template.json`, `assets/lernbegleiter-template.json` — Renderer-Vertrag
- `assets/ki-liesmich-template.md` — Markdown-Gerüst (Frontmatter + Abschnitte + Callouts) für den Liesmich
- **Gold-Referenz:** `src/data/einheiten/1.1.1_konflikt_kommunizieren/{ki,lernprompt,lernbegleiter}.json` + `ki-liesmich.md`
