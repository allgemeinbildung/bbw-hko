---
name: hko-2er-EBA-set-generator
description: "Native bbw-hko skill for the EBA system (2-jaehrige Grundbildung): transforms Swiss ABU content into a coherent 2er-EBA-Set Einheit and writes it into src/data/einheiten/{X.Y.Z}_{slug}/ (differentiated by lehrgang=EBA_2J). Produces a Prinzip-Dokument, 2 validated Herausforderung JSONs (A/B), a Set-Dokument with Austausch-Phase and Transfer-Aufgabe, a KN-Dokument with one Hybrid-Herausforderung (Fachgespraech as primary form, Mini Case schriftlich + Werkschau simplified) and a bi-dimensional rubric (SuK = Konventionen + Sprachbewusstheit, no Normen), a Lehrperson-Begleitdokument (begleiter.md), and — because EBA has no Lehrmittel — a self-generated A2-level Wissens-Dossier (dossier.json). Use this skill whenever Pietro wants to generate an HKO EBA Einheit, an EBA 2er-Set, or Lernsituationen fuer EBA / 2-jaehrige Grundbildung, or says 'generate an EBA set', 'mach eine EBA-Einheit', 'EBA 2er-set'. Triggers on EBA + HKO/ABU keywords together. Prinzip-first AND KN-backwards; additionally the Dossier is generated last (Phase 7) by Backward Design from the finished Herausforderungen + KN, and all SuS-facing prose is hard-enforced to A2 (GER)."
---

# bbw-hko 2er-EBA-Set Generator — Prinzip-First + KN-Backwards + Dossier-Last

Transforms Swiss ABU content into HKO **2er-EBA-Set** Einheiten for bbw-hko — a Prinzip-Dokument plus **2** validated Herausforderung JSONs (A/B) plus a Set-Dokument plus an inline Kompetenznachweis plus a Lehrperson-Begleitdokument plus a self-generated **Wissens-Dossier** — written directly into `src/data/einheiten/{X.Y.Z}_{slug}/` and differentiated from EFZ only by `lehrgang: "EBA_2J"`.

**The architecture is Prinzip-first AND KN-backwards:** before any Herausforderungen are generated, a `prinzip.json` defines the shared red thread for the 2er-Gruppe — Kern-Versprechen, 2 Herausforderungen, SK-Schnittmenge, Mehrdeutigkeits-Architektur, Hybrid-Herausforderung-Spec. Both Herausforderungen carry an anchor back to this Prinzip. The KN is generated **inline** as Phase 4 — no downstream skill, no handoff. It consists of one Hybrid-Herausforderung that combines **both** Lernaufgaben-Prinzipien plus three KN-Typen (Fachgespraech as primary/oral form, Mini Case schriftlich + Werkschau + Transfer-Reflexion simplified) plus one bi-dimensional rubric.

**EBA-Besonderheit — kein Lehrmittel:** EBA hat kein Lehrmittel. Das gesamte fachliche Wissen liefert ein separat generiertes **A2-Dossier** (`dossier.json`), das in **Phase 7 zuletzt** per Backward Design aus den fertigen Herausforderungen + KN abgeleitet wird. Alle SuS-gerichtete Prosa ist hart auf **A2 (GER)** durchgesetzt.

---

## EBA-2er-OVERRIDE (verbindlich — VOR allen Phasen lesen)

> Dieses Dokument ist aus dem `bbw-hko-3er-set`-Skill geforkt. **Wo unten noch „3", „A/B/C",
> „drei", „6 Optionen", „K4", „Lehrmittel" oder „7 Dateien" steht, gelten die folgenden
> EBA-Werte** — sie ueberschreiben jede gegenteilige 3er-Formulierung im Fliesstext. Die
> kalibrierten Templates (`assets/*.json`) und References tragen die Deltas bereits vollstaendig;
> bei Konflikt: **Template + Override gewinnen.**

> **⚠ ECHTE UMLAUTE — Pflicht in ALLER front-facing Prosa.** In jedem gerenderten Prosa-Feld
> (Herausforderungen, Set, KN, **Dossier**, Begleiter) stehen **`ä` `ö` `ü` `Ä` `Ö` `Ü`** —
> **niemals** `ae/oe/ue`. Transliteration `ae/oe/ue` ist **nur** in IDs, `topic_slug`, Dateinamen
> und JSON-Keys erlaubt. Eszett `ß` bleibt verboten (immer `ss`) — **aber `ss` heisst NICHT, dass
> Umlaute transliteriert werden.** „kein Eszett" und „echte Umlaute" sind zwei getrennte Regeln.
> Pre-Write-Scan (Check 18) blockiert `ae/oe/ue` in Prosa.

| Stellschraube | 3er (Fliesstext unten) | **EBA-2er (gilt)** |
|---|---|---|
| Set-Groesse | A/B/C (3) | **A/B (2)** — C entfaellt, sit_farbe nur rot/blau |
| `lehrgang` | EFZ_3J | **EBA_2J** (Default) |
| nRLP-Quelle | nrlp_3j/4j.json | **public/nrlp_2j.json** — ausnahmslos, kein Lehrgang-Switch (Phase 0 + §B) |
| Phase-1-Optionen | 6 (2×3) | **4 (2×2)** |
| Bloom-Zielprofil | LF1 K2 / LF2-3 K3 / LF4 K3+-K4 | **LF1-2 K2 / LF3-4 K3** (K4 nur 100%-Extension) |
| Quoten (RLP Z.791) | 3 SK / 3 Aspekte / 3 Modi | **2 SK / 2 Aspekte / 1 Modus** |
| SK-primary | SK in >=2/3 | **SK in beiden (2/2)** |
| Mehrdeutigkeit | 3/3 | **2/2, gefuehrt** (Dossier macht Trade-off sichtbar) |
| Persona-Pools | units 3+3 (>=3 Abt.) | **units 2+2 (>=2 Abt.)**, EBA-Berufe bevorzugt, LJ1-2; kn_neu 2+2 |
| KN-Kombi | Hybrid A+B+C | **Hybrid A+B**, `must_combine [A,B]` |
| KN-Primaerform | gleichrangig | **Fachgespraech (muendlich)**; Mini Case + Werkschau vereinfacht |
| KN K-Decke | bis K4 | **K3** (Fachgespraech-Fragen K2/K2/K3/K3/K3; Mini Case K2/K2/K3/K3; Werkschau Reflexion 120-150 W.) |
| SuK-Rubrik-Kriterien | Fachkorrektheit + Argumentation | **Namen bleiben** Fachkorrektheit + Argumentation; Konventionen + Sprachbewusstheit **integriert**, KEINE Normen |
| `wochen` | Fixwert 3 + wochen_plan(3) | **entfernt** — EBA heterogen, LP legt Rhythmus fest, `wochen_plan: []` |
| Wissensquelle / Anker | Lehrmittel „Kap. X.Y \| S. NN" | **Dossier** „Dossier \| Info-Karte A-01"; `prinzip_handoff.dossier_anker` |

> **Nomenklatur «Info-Karte» vs. «Nugget»:** Das **sichtbare** Anker-Wort (in `knoten_ref`, `nugget_ref`, `dossier_anker`, Dossier-Titeln, Begleiter) ist **«Info-Karte»** — «Nugget» versteht ein EBA-Lernender nicht (Feedback Matthi). Die **internen IDs bleiben** `nugget_A_01` und der **Code** «A-01» wird daraus abgeleitet (Renderer `nuggetCode()` / `dossierNuggetCode()` ändern sich nicht). Strukturbegriffe im Skill (`nuggets[]`, „Nugget-Bedarfsliste") dürfen intern «Nugget» heissen; nur learner-/LP-sichtbare Strings sagen «Info-Karte».
| Phasen | 0–5 | **+ Phase 3.5 (Wissensbedarf) + Phase 7 (Dossier + Web-Validierung + A2 + Wissen↔KN)** |
| Output-Dateien | 7 | **8** (+ `dossier.json`) |
| Schlussarbeit/-pruefung | EFZ hat SA/SP | **keine** — KN pro Einheit traegt alles |

**Drei neue Pflicht-Checks (Details: `references/coherence-checklist.md`):**

- **A2-Enforcement** — ERR-Gate vor JEDEM SuS-Prosa-Write (Herausforderungen, Set, KN, Dossier),
  scannt gegen `references/a2-language-rules.md`. Sie-Form in Auftraegen + ICH-Form im Narrativ
  bleiben (A2 senkt Komplexitaet, nicht Hoeflichkeit).
- **Wissen↔KN-Alignment** — jede Leitfrage + jeder KN-Anspruch hat Dossier-Deckung, sonst
  `ERR_DOSSIER_GAP` (Phase 7).
- **Fakten-Validierung** — jeder `fakten_anker` ist `validiert:true` ODER `lp_pruefen:true`, sonst
  `WARN_FAKT_UNGEPRUEFT` (Phase 7, Web-Validierung durch Claude).

**Spiralen-Regel (verbindlich beim 2er):** Bei nur zwei Herausforderungen tragen A und B
**denselben Trade-off** in **maximal kontrastreichen** Kontexten (verschiedene Abteilungen,
verschiedene Konfliktarten). Zwei Datenpunkte sind das Minimum, um ein uebertragbares Muster
sichtbar zu machen.

**Neue Assets/References (EBA-only):** `assets/dossier-template.json`,
`references/dossier-architecture.md`, `references/a2-language-rules.md`.

---

## FEEDBACK-OVERRIDE 2026-07-02 (verbindlich — Sitzung «Austausch EBA Material»)

> Beschlossen im Kernteam-Austausch vom 2. Juli 2026 (Däniker/Glaus/Rusch/Beck/Huber/Rossi;
> Protokoll: `docs/eba/EBA-Material-Updates_2026-07-02.md`). Diese Sektion ueberschreibt
> gegenteilige Formulierungen im Fliesstext unten — gleiches Prinzip wie der EBA-2er-OVERRIDE.

### F1 — Quelle der Herausforderungen: kantonale Umsetzungsvarianten (statt EFZ-Basis)

**Phase 0 erhaelt einen neuen Pflicht-Step (ersetzt das bisherige «Step 4 entfaellt»):** Lies
`material/_lehrmittel/Umsetzungsbeispiele/Umsetzungsvarianten_EBA_20260630_final.md` und extrahiere
alle Umsetzungsvarianten des Lebensbezugs `X.Y.*` (nicht nur `X.Y.Z`): pro Variante die Bloecke
**Herausforderung** (ICH-Text), **Sprachmodus**, **Produkt**, **Scaffolds**, **Bewertungspositionen**
(SuK + Ges). Diese Bloecke sind das **primaere Rohmaterial** fuer Phase 0.5 (Kern-Versprechen) und
Phase 1 (Herausforderung-Ideation). Die frueheren EFZ-Herausforderungen sind KEINE Quelle mehr.

- Die 2 Herausforderungen A/B duerfen aus **zwei verschiedenen Umsetzungsvarianten** desselben
  Lebensbezugs gespeist werden (z. B. UV 1.1.1 + UV 1.1.2). Dann listet `nrlp.nr_primary` **beide**
  Kompetenz-Nummern (bestehende B1-Regel: welche Sekundaer-Kompetenzen gelten, bestaetigt Pietro).
- Die UV-Herausforderung wird nicht woertlich kopiert, sondern in die Skill-Struktur uebersetzt
  (Persona, A2, Trade-off, Handlungsprodukt) — der **Problemkern und die Sprachebene der UV bleiben
  erhalten**.

### F2 — Begriffs-Test (ERR `ERR_HF_BEGRIFFSANKER`, blockierend — Phasen 0.5, 1, 2)

Die Herausforderung setzt auf der **Problem- und Sprachebene** an, nicht am Lehrmittel-/Wissensinhalt
(Christof-Regel). Pruefe jede Kandidaten-Herausforderung und jeden `situation_text`:

> **Test-Frage: «Ist die Aufgabe faktisch geloest, sobald die lernende Person EINEN Begriff
> nachgeschlagen hat?»** Wenn ja → zu geschlossen → umformulieren.

- Negativ-Beispiel (v1, 1.1.1): Die Situation haengt komplett am Rechtsbegriff «Probezeit» — Begriff
  nachschlagen = Aufgabe geloest.
- Positiv-Muster (Christof-Beispiele): «Mein Lehrvertrag ist ein Formular mit vielen Feldern,
  Verweisen und Fachbegriffen und wirkt komplex» → Komplexitaet reduzieren, Dokument in Sektionen
  gliedern, Standard vs. betriebsspezifisch vs. fuer-mich-relevant unterscheiden. Oder: «Seit
  Lehrbeginn habe ich viele Unterlagen» → ordnen anhand kategorisierter Checkliste.
- Einzelne Rechtsbegriffe (Probezeit, Kuendigungsfrist …) duerfen als **Dossier-Ressource**
  vorkommen — nie als Aufgabenkern der Herausforderung.
- Der Trade-off liegt entsprechend auf der Handlungs-/Sprachebene (z. B. «alles genau lesen vs.
  gezielt das Relevante herausfiltern»), nicht auf einer Begriffsfrage.

### F3 — Leitfragen-Anwendungsregel (WARN `WARN_LF_WISSENSABFRAGE` — Phase 2)

Jede Leitfrage ist eine **Taetigkeit mit Material**, keine Wissenswiedergabe. Das Bloom-Zielprofil
(LF1-2 K2 / LF3-4 K3) bleibt — aber K2 heisst «Tun mit Material» (gliedern, zuordnen, markieren,
Tabelle ausfuellen, vergleichen), nicht «Wiedergeben».

- **Verbotene Muster** (Pre-Write-Scan, WARN + umformulieren): `Was ist …?`, `Nennen Sie die
  Regel/…`, `Erklaeren Sie in zwei Saetzen: Was …` und analoge reine Definitions-/Reproduktionsfragen.
- **Ziel-Muster:** «Gliedern Sie … in die drei Bereiche …», «Ordnen Sie … zu (Tabelle)»,
  «Markieren Sie im … die Stellen, die …», «Fuellen Sie die Tabelle aus: …», «Vergleichen Sie …
  und waehlen Sie … Begruenden Sie kurz», «Schreiben Sie eine kurze Nachricht …».
- Tabellen-Antwortformate werden **im LF-Text** formuliert (das zugehoerige Tabellen-Scaffold liegt
  im Dossier bzw. in `handlungsprodukt.scaffolding`) — **kein neues JSON-Feld**, Schema bleibt
  unveraendert.
- Definitionswissen wandert vollstaendig ins Dossier (Info-Karten + Glossar) — die LF wendet es an.

### F4 — Explizit NICHT geaendert (Scope-Guard)

Grundstruktur (2 HF + Austausch + 1 KN), KN-rueckwaerts, A2-Niveau, Dossier/«Glossar Plus»-Umfang,
die 3 KN-Typen inkl. Bewertungskriterien und die Nomenklatur «Info-Karte» bleiben wie beschlossen
unveraendert. Keine Lesestrategien/Methoden fest einbauen (LP ergaenzt individuell). Das
Infokarten-Template (leeres Word, Matthias-Idee) ist ein **separates Deliverable** ausserhalb
dieser Skill.

---

## Schema-Compliance (zwingend, nicht verhandelbar)

Die generierten JSONs landen pro Einheit in `src/data/einheiten/{X.Y.Z}_{slug}/` und werden vom Einheiten-Loader (`src/lib/einheiten/index.ts`) sowie dem Index-Build (`scripts/build-einheiten-index.mjs`) gelesen. Sie behalten `template: "default_4page_v2"` als Fixwert (die DocS-Komponenten erwarten diesen Wert).

**Wahrheits-Quellen (in dieser Reihenfolge):**

1. **`assets/mission-template.json`** — vollstaendige Skelett-Struktur fuer eine Herausforderung (mit allen 3er-Anpassungen: 4-Zeilen-bewertungsraster mit `vollstaendig_wenn`, `handlungsprodukt.scaffolding`, neue 3er-Felder, ohne gruppenpuzzle/vorgespraech, ohne emotion_tag).
2. **`assets/prinzip-template.json`** — Prinzip-Struktur (**2 Herausforderungen A/B**, hybrid_situation_spec, kein kn_vorgabe).
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
| `herausforderung_{A,B}.json` | `titel`, `situation_text`, `leitfrage`, `leitfragen_intro`, `leitfragen[].text`, `mindmap_zentrum`, `mindmap_aeste[].text`, `handlungsprodukt.{titel, format_detail, beschreibung, schreib_label, schreib_note}`, `handlungsprodukt.schritte[].{label, hint}`, `reflexion_fragen[].text`, `mehrdeutigkeit.{trade_off, hint}`, `dekontextualisierung.{frage, ziel}`, `prinzip_handoff.{kernkonzept, dossier_anker, kn_aktivierung, transfer_check}`, `sk_anker[].wo`, `persona.{beruf, betrieb, ort}`, `zahlen_tabelle[].label`, `bewertungsraster[].kriterium`, `quellen_anker.{unterueberschrift, konzepte[]}`, `lernfortschritt.*` |
| `prinzip.json` | `kern_kompetenzversprechen`, `herausforderungen[].{herausforderung, konfliktart, handlungsprodukt_typ}`, `mehrdeutigkeits_architektur.{trade_off_raum[], verbindlich}`, `dekontextualisierungs_anker.{anker_statement, transferfeld}`, `aspekte` Werte-Strings, `persona_pool_units.{berufe[], orte[]}`, `persona_pool_kn_neu.{berufe[], orte[]}`, `quellen_anker.{dossier_nuggets[], konzepte[]}` |
| `dossier.json` | `kopf.{einheit_titel, kompetenz_text, lebensbezug_text, thema_titel}` (aus nrlp_2j), `einleitung.{was_ist_das, so_benutzt_du_es[]}`, `nuggets[].{titel, inhalt, beispiel}`, `nuggets[].recherche.{suchbegriffe[], ki_beispiel.{so_fragst_du, prompt, tipp}, ki_lernen[].{strategie, prompt}, selbst_pruefen}`, `sprachmodi_scaffolds[].*`, `transfer_wissensblatt.*`, `glossar[].{erklaerung_a2, beispiel}` |
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
- `reflexion_fragen[].feld_hoehe_mm`: 10, `sub: null`
- `mindmap_aeste`: 4 Items, Ast 4 mit `optional: true`
- `handlungsprodukt.schritte`: 5 Items, je `{label, hint}` Objekt

**Downstream-Felder (NICHT in dieser Skill erzeugen):**
- `ki_vertiefung` → wird von `.claude/skills/hko-ki-vertiefung-generator/` (oder einem 3er-Pendant) nachtraeglich geschrieben
- `scaffolding` (top-level KI-Scaffolds) → wird von `.claude/skills/hko-scaffolding-generator/` (oder einem 3er-Pendant) nachtraeglich geschrieben. **NICHT zu verwechseln mit `handlungsprodukt.scaffolding` (satzanfaenge/strategien/struktur), das seit dem Auftrag/Dossier-Redesign (C6) DIREKT in Phase 2 erzeugt wird.**

Diese Skill produziert das Kern-Set-JSON ohne `ki_vertiefung` und ohne top-level `scaffolding` (aber MIT `handlungsprodukt.scaffolding`).

**Output** — alle Dateien in `src/data/einheiten/{X.Y.Z}_{topic_slug}/`, **unpraefixierte** Namen (EBA: **8 Dateien**):
- `prinzip.json` — roter Faden
- `herausforderung_A.json`, `herausforderung_B.json` — **2** Herausforderung-JSONs (kein C)
- `set.json` — Set-Dokument (Austausch + Transfer)
- `kn.json` — Kompetenznachweis (Hybrid A+B + 3 Typen, Fachgespraech primaer + Rubrik)
- `begleiter.md` — Lehrperson-Begleitdokument (vollstaendiges Markdown-Kompendium)
- `dossier.json` — **NEU (EBA-only):** A2-Wissens-Dossier, Phase 7, Backward Design (ersetzt das fehlende Lehrmittel)

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
- `prinzip-architecture.md` — Phase 0.5 Design-Regeln (inkl. §10 EBA-2er-Override)
- `kn-architecture.md` — Phase 4 Design-Regeln (Hybrid, 3 KN-Typen, Rubrik; inkl. §10 EBA-Override)
- `json-field-mapping.md` — Feld-fuer-Feld Mapping (inkl. §6 EBA + §7 Dossier-JSON)
- `coherence-checklist.md` — Checks + EBA-Kalibrierung + 3 neue Checks (A2 / Wissen↔KN / Fakten)
- `dossier-architecture.md` — **NEU:** Dossier-Generierung, Backward Design, Web-Validierung, A2
- `a2-language-rules.md` — **NEU:** A2-Regelliste + Beispiele (ERR-Gate)
- `_common_misspellings.md` — Bekannte Spell-Halluzinationen, Pre-Write-Check-Liste
- `hko-framework.md` — 12 SK, 9 Sprachmodi, 8 Aspekte, Bloom, bi-dim Rubric (inkl. §13 EBA-Spezifika)
- `language-rules.md` — Swiss Standard German, ICH-Perspektive, verbotene Phrasen
- `_migration_notes.md` — 5er → 3er → 2er-EBA Delta-Doku

---

## Input Format

Der User gibt:

1. **NRLP-Subkapitel-Referenz** — String in `X.Y.Z`-Format aus `nrlp_2j.json` (z.B. `1.1.1`)
2. **Lehrgang** — fuer diese Skill faktisch fix **`EBA_2J`** (Default; die Enum-Werte EFZ_3J/EFZ_4J existieren nur aus Schema-Kompatibilitaet)
3. **Fokus-Hinweis (optional)** — kurze Phrase, die die Linse des Sets signalisiert (z.B. „Lehrbeginn", „Konflikt", „Vertrag")

**EBA hat KEIN Lehrmittel** — der User gibt **keine** Textbook-Kapitel. Das fachliche Wissen wird von
der Skill selbst generiert und in Phase 7 als A2-Dossier mitgeliefert. Wenn der User keinen Fokus
angibt: Skill schlaegt in Phase 0.5 drei Kandidaten vor.

### Keine Lehrmittel-Quelle (EBA-Unterschied)
Anders als der EFZ-3er liest diese Skill **keine** `material/_lehrmittel/`-Kapitel und baut **keinen**
Kapitel-Index. Alle Lehrmittel-/Seiten-Anker im Fliesstext unten sind durch **Dossier-Nugget-Anker**
ersetzt (siehe Override-Tabelle).

---

## Workflow (8 Phasen — EBA mit Phase 3.5 + Phase 7)

```
PHASE 0     NRLP-Lookup (nrlp_2j.json)      → nrlp Extraktion (kein Kapitel-Index — kein Lehrmittel)
PHASE 0.5   Prinzip-Formulierung            → prinzip.json (roter Faden, 2 Herausforderungen, EBA-Bloom)
PHASE 1     Herausforderung-Ideation (2 facets)   → 4 Optionen anchored an 2 Herausforderungen A/B
PHASE 2     JSON-Generation (2 Herausforderungen) → 2 herausforderung_*.json + A2-Check
PHASE 3     Set-Dokument                    → set.json (Austausch + Transfer, A/B)
PHASE 3.5   NEU: Wissensbedarf-Analyse      → interne Nugget-Bedarfsliste (Backward Design aus A/B + KN-Spec)
PHASE 4     KN-Generierung (INLINE)         → kn.json (Hybrid A+B + 3 Typen, Fachgespraech primaer)
PHASE 5     Begleiter-Dokument              → begleiter.md (vollst. Lektion-fuer-Lektion Kompendium)
PHASE 7     NEU: Dossier-Generierung        → dossier.json (A2, Web-Validierung, Wissen↔KN-Check, A2-Gate)
PHASE 7.5   NEU: Material-Bedarfs-Analyse   → LP-Material-Liste → Begleiter-Sektion «Von der Lehrperson bereitzustellen»
DEPLOY      Index-Rebuild                   → npm run build:einheiten-index
```

Jede Phase finished bevor die naechste startet. Nach Phase 0.5 (Step 3), nach Phase 1 (Selektion) und in Phase 4 Step 2 (Hybrid-Herausforderung-Approval) stoppt die Skill und wartet auf User-Input. Phasen 2, 3, 3.5, 5, 7, 7.5 laufen sequentiell ohne Confirmation (Phase 7 stoppt nur bei `ERR_DOSSIER_GAP` / offenen Fakten). Phase 4 darf isoliert nachgezogen werden, wenn Phasen 0-3.5 bereits gelaufen sind. Phase 5 + Phase 7 duerfen ebenfalls isoliert nachgezogen werden, wenn die Phasen davor abgeschlossen sind. **Phase 3.5 ist die Bedarfsanalyse fuer das Dossier; Phase 7 baut es zuletzt — nie vorab. Phase 7.5 laeuft NACH Phase 7 (sie braucht das fertige Dossier) und schreibt die LP-Material-Liste in die Begleiter-Sektion «Von der Lehrperson bereitzustellen».**

> **A2-Gate (global):** Vor JEDEM Write eines SuS-gerichteten Prosa-Felds in Phase 2, 3, 4, 5, 7
> laeuft der A2-Pre-Write-Scan gegen `references/a2-language-rules.md` (analog zum Umlaut/Eszett-Scan).
> ERR-Codes (`ERR_A2_SATZ_ZU_LANG`, `ERR_A2_BEGRIFF_OHNE_GLOSSAR`) blockieren den Write bis behoben.

---

### PHASE 0 — NRLP-Lookup

NRLP `X.Y.Z` parsen, **`public/nrlp_2j.json`** lesen (EBA-Schullehrplan, lehrgang=EBA_2J), hierarchisch extrahieren (Thema → Lebensbezug → Kompetenz). **Kein Kapitel-Index** — EBA hat kein Lehrmittel; die Wissensquelle ist das in Phase 7 generierte Dossier.

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
- `zirkularitaet.schluesselkompetenzen[].wiederholungen` — Map SK → `{"T5": "R2", …}`; spiegelt die SK-Spirale des Bildungsrats-SLP

`nrlp_2j.json` war davon bisher **nicht** betroffen (alle acht Themen stimmen ueberein), aber `nrlp_4j.json` war es von 2026-06-14 bis 2026-08-16: T5 fuehrte eine SK statt sechs. Der Fehler faellt nicht auf — das Set wirkt bloss duenn. Die Regel gilt hier praeventiv und damit beide Skills dasselbe tun.

**Regel:** Die Thema-SK-Liste **immer** aus `zirkularitaet.schluesselkompetenzen[].wiederholungen['T{X}']` ableiten. `themen[].schluesselkompetenzen` dient nur als Gegenprobe und liefert die Langtexte.

- Beide Listen deckungsgleich → weiter.
- Abweichung → `WARN_SK_DRIFT` ausgeben (beide Listen zeigen), **die Zirkularitaets-Liste verwenden** und Pietro informieren, damit der Datensatz repariert wird. Nicht stillschweigend weiterarbeiten und nicht selbst am Datensatz herumschreiben.

Repo-seitiger Waechter: `npm run check:nrlp` (`scripts/check-nrlp-consistency.mjs`) laeuft als erster Prebuild-Schritt und prueft alle drei Datensaetze. Hintergrund: `docs/nrlp-4j-sk-bug-2026-08.md`.

**Step 3 — Derive `nrlp`-Felder:** siehe `references/json-field-mapping.md` Paragraph 1.

**Step 4 — Umsetzungsvarianten-Lookup (F1, ersetzt den frueheren Kapitel-Index):** Lies
`material/_lehrmittel/Umsetzungsbeispiele/Umsetzungsvarianten_EBA_20260630_final.md` und extrahiere
alle Umsetzungsvarianten des Lebensbezugs `X.Y.*` (Herausforderung, Sprachmodus, Produkt, Scaffolds,
Bewertungspositionen). Sie sind das primaere Rohmaterial fuer Phase 0.5 + 1. Wissens-Anker zeigen
weiterhin auf Dossier-Info-Karten (sichtbar `"Dossier | Info-Karte A-01"`, interne ID `nugget_A_01`),
die in Phase 7 entstehen.

**Step 5 — Confirm + proceed zu Phase 0.5:**

```
NRLP X.Y.Z geladen:
Thema: T{X} — {titel}
Lebensbezug: {X.Y} — {text}
Kompetenz: {kompetenz.text}
Gesellschaft: {aspekte mit iterationen}
Sprachmodi: {liste}
SK (Thema-Ebene): {nummern + namen}
Umsetzungsvarianten {X.Y}.*: {liste mit je 1-Zeilen-Herausforderungs-Kern + Produkt}
(Kein Kapitel-Index — EBA hat kein Lehrmittel; Wissen kommt aus dem Dossier, Phase 7.
 Herausforderungs-Rohmaterial = Umsetzungsvarianten, F1.)
```

---

### PHASE 0.5 — Prinzip-Formulierung

**Read** `references/prinzip-architecture.md` fuer Design-Regeln. **Read** `assets/prinzip-template.json` fuer Zielstruktur.

#### Step 1 — Drei Kandidaten-Kern-Versprechen vorschlagen

Aus der NRLP-Kompetenz **und den Umsetzungsvarianten-Herausforderungen (F1)** drei Kandidaten
ableiten. Jeder Kandidat besteht den **Begriffs-Test (F2)** — kein Kern-Versprechen, das an einem
einzelnen (Rechts-)Begriff haengt. Jeder Kandidat:
- Ein Satz, ICH-Perspektive
- Endet auf **K2- oder K3-Verb** (EBA-Decke K3; kein K4 im Pflicht-Versprechen)
- Paraphrasiert mindestens ein Aktionsverb der Kompetenz
- Impliziert eigenen SK-Schwerpunkt (unterscheidbar von den anderen Kandidaten)
- Ermoeglicht Mehrdeutigkeit (Trade-off-Raum, der ueber **beide** Herausforderungen traegt)

Praesentiere als kompakten Block:

```
Drei moegliche Kern-Versprechen fuer das 3er-Set X.Y.Z:

1) {KANDIDAT 1 IN GROSSBUCHSTABEN}
   "{Ich-Satz, K2/K3-Verb}"
   SK-Kern: {2 Nummern}, Modi: {schriftlich/muendlich/audiovisuell}, Mehrdeutigkeit: {trade-off}
   2 Herausforderungen (A/B) leicht differenzierbar / mittel / schwer (gleicher Trade-off, maximal kontrastreich)

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
| `kern_kompetenzversprechen` | gewaehlter **K2/K3**-Satz in ICH-Form (EBA: kein K4 im Pflicht-Versprechen) |
| `bloom_zielprofil` | **EBA: LF1=K2, LF2=K2, LF3=K3, LF4=K3** (K4 nur 100%-Extension; verbindlich fuer Phase 2) |
| `herausforderungen` | **GENAU 2 Eintraege A/B**, je `{herausforderung, konfliktart, handlungsprodukt_typ, transferrable: true}`. **Spiralen-Regel:** A und B tragen denselben Trade-off in maximal kontrastreichen Kontexten |
| `sk_pro_situation` | provisorisch je 2-3 SK pro A/B |
| `sk_schnittmenge_kn.primary` | **SK in beiden (2/2)**; Minimum 2 SK gesamt (RLP Z.791); kein secondary |

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
| `quellen_anker.dossier_nuggets[]` / `.konzepte[]` | **Dossier-Nugget-Bereiche pro Herausforderung** + Vokabular (Glossar-Seed); EBA hat KEIN Lehrmittel |
| `persona_pool_units` | **2 berufe + 2 orte** aus >=2 Abteilungen, EBA-Berufe bevorzugt, LJ1-2 |
| `persona_pool_kn_neu` | 2 berufe + 2 orte, disjunkt von _units, LJ1-2 |
| `hybrid_situation_spec` | Constraints fuer Phase 4 (max 120 Woerter, ICH, A2, must_activate_trade_offs_min: 1, `must_combine_herausforderungen: ["A","B"]`) |

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

Mehrdeutigkeit (Trade-off-Raum):
  - {trade_off_1}
  - {trade_off_2}
  ...

Transfer-Anker:
  "{generisches Prinzip}"

Hybrid-Herausforderung-Spec:
  max 120 Woerter, ICH, mind. 1 Trade-off, Persona aus persona_pool_kn_neu

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

#### Step 1 — 4 Optionen (2 pro Herausforderung A/B)

Pro Herausforderung (A, B) zwei Kandidaten-Herausforderungen, **gespeist aus den
Umsetzungsvarianten-Bloecken Herausforderung + Produkt (F1)**. Jeder Kandidat:
- Matched die Konfliktart + Handlungsprodukt-Typ der Herausforderung
- ICH-Perspektive
- **Besteht den Begriffs-Test (F2):** Problemkern auf der Problem-/Sprachebene (Komplexitaet
  reduzieren, ordnen, klaeren, sich orientieren) — kein einzelner (Rechts-)Begriff als Aufgabenkern
- **K2/K3** (EBA-Decke K3, kein purer K1, kein K4-Pflichtanker)
- Beruf + Betrieb + Ort aus `persona_pool_units` (EBA-Berufe bevorzugt, LJ1-2)
- Den **gemeinsamen** Trade-off aus `trade_off_raum` (Spiralen-Regel: A und B maximal kontrastreich, gleicher Trade-off)
- **Kein Kapitel/Seite** — das Wissen kommt aus dem Dossier (Phase 7), hier nur thematischer Anker

#### Step 2 — Tabelle praesentieren

```
| # | Herausforderung | Titel | Kern-Problem (ICH) | Handlungsprodukt | Trade-off |
| 1 | A: {herausforderung} | "..." | Ich ... | {format} | {gemeinsamer Trade-off} |
| 2 | A: {herausforderung} | "..." | ... | ... | ... |
| 3 | B: {herausforderung} | "..." | ... | ... | ... |
| 4 | B: {herausforderung} | "..." | ... | ... | ... |
```

Below:
> Waehle eine Variante pro Herausforderung (z.B. „1, 3" oder „2, 4"). Bei Bedarf zwei neue Varianten fuer eine Herausforderung anfordern.

**Stop. Wait for user selection.**

Bei <2 Selektionen: abort mit Hinweis „Genau 2 Herausforderungen (A/B) gewaehlt — zwei maximal kontrastreiche Datenpunkte sind das Minimum fuer ein uebertragbares Muster; sonst ist der Set-Austausch nicht durchfuehrbar und die Hybrid-KN nicht entwickelbar." (kein `emotion_tag` mehr generieren — C1.)

---

### PHASE 2 — JSON-Generation

Read `assets/mission-template.json` + `references/json-field-mapping.md`.

**Schritt 1 — Lehrgang bestaetigen.** Fuer diese Skill fix **`EBA_2J`**.

**Schritt 2 — Pro Herausforderung (A, B in Selektions-Reihenfolge) fuellen** (`lehrgang: "EBA_2J"`, `leitfragen[].knoten_ref` → Dossier-Nugget, `leitfragen_intro` Sie-Form + Dossier, kein `wochen`, A2-Pre-Write-Scan):

| Feld | Quelle |
|---|---|
| `id` | `{X.Y.Z}_{topic_slug}_hf_{LETTER}` |
| `modul` / `modul_titel` | NRLP |
| `lehrgang` | User-Input |
| `buchstabe` | A/B |
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
| `leitfragen[]` | 4 Items, **EBA-Bloom K2/K2/K3/K3** (knoten_ref → „Dossier \| Info-Karte {LETTER}-NN", kein Kapitel/Seite); **jede LF ist eine Taetigkeit mit Material (F3 — gliedern/zuordnen/markieren/Tabelle fuellen), keine Wissenswiedergabe (`WARN_LF_WISSENSABFRAGE`)**; **LF4 = fokussierte Output-Sprachmodus-Teilaufgabe (ein Baustein), nicht das ganze Handlungsprodukt (C4)** |
| `mindmap_zentrum` / `mindmap_aeste` | flat top-level; genau 4 Aeste, Ast 4 `optional: true` (radial/Quadrant) |
| `handlungsprodukt.*` | aus prinzip.herausforderungen[LETTER].handlungsprodukt_typ; inkl. `scaffolding` {satzanfaenge/strategien/struktur} (C6) |
| `reflexion_fragen` | Template-Defaults, situationsspezifisch anpassbar |
| `bewertungsraster` | 4 Eintraege, je mit `vollstaendig_wenn` (2-4 Bullets); keine Transfer-Zeile (C1) |
| `wochen_plan` | **leer `[]`** (EBA: kein wochen-Fixwert, LP legt Rhythmus fest) |
| Prinzip-First additiv | prinzip_ref, herausforderung, mehrdeutigkeit, dekontextualisierung, zirkularitaet_anker, quellen_anker, lernfortschritt |
| NEU (additiv) | `prinzip_handoff` (kernkonzept, **dossier_anker**, kn_aktivierung, transfer_check), `sk_anker` (Laenge == nrlp.sk.length) |

**Validation pro Herausforderung** (vor dem Schreiben):
- **A2-GATE (ERR, blockierend — Check NEU A):** Scanne JEDES SuS-Prosa-Feld (situation_text, leitfrage, leitfragen[].text, handlungsprodukt.*, reflexion_fragen, mehrdeutigkeit.*, dekontextualisierung.*) gegen `references/a2-language-rules.md`. `ERR_A2_SATZ_ZU_LANG` (Satz > 18 W.) und `ERR_A2_BEGRIFF_OHNE_GLOSSAR` **stoppen den Write**, bis behoben. WARN-A2-Codes melden + umformulieren. Sie-Form in Auftraegen + ICH-Form im Narrativ bleiben.
- **Anrede-Scan (ERR `ERR_ANREDE_DU`, blockierend):** kein `du/dein/dir/dich`, kein informelles `ihr` als Anrede und keine Du-Imperative ohne «Sie» (z. B. «Sag…», «Lass…», «Spiel…», «Tu…», «Schau…», «Frag…», «Stell…») in Auftrags-/Anweisungsfeldern. Treffer **stoppt den Write**, bis auf Sie-Form umgestellt; die ICH-Stimme des Narrativs (`situation_text`) bleibt. (JSON-Keys wie `so_fragst_du` sind ausgenommen.)
- **Begriffs-Test (ERR `ERR_HF_BEGRIFFSANKER`, blockierend — F2):** `situation_text` + `leitfrage`
  duerfen nicht an einem einzelnen (Rechts-)Begriff haengen — «loest ein Begriff-Lookup die
  Aufgabe?» → umformulieren, Write blockiert.
- **LF-Anwendungsformat (WARN `WARN_LF_WISSENSABFRAGE` — F3):** Scanne `leitfragen[].text` auf
  reine Reproduktionsmuster (`Was ist …?`, `Nennen Sie …`, `Erklaeren Sie in zwei Saetzen: Was …`) —
  bei Treffer in Taetigkeitsformat umformulieren (gliedern/zuordnen/markieren/Tabelle/vergleichen).
- Alle Renderer-Pflichtfelder gesetzt
- `id`, `prinzip_ref`, `herausforderung.label` passen
- `nrlp.sk` und `sk_anker` haben gleiche Laenge (Check 8)
- **Mindestens eine LF auf K3** (Check 7, EBA-Decke K3; LF3/LF4 = K3, K4 NICHT Pflicht)
- `mehrdeutigkeit.trade_off` ∈ `prinzip.mehrdeutigkeits_architektur.trade_off_raum` (Check 6 — **beide (2/2)** Pflicht)
- Keine Eszett, keine `gruppenpuzzle_fragen` / `vorgespraech_fragen`, kein neu generiertes `emotion_tag`
- `bewertungsraster.length === 4`, jede Zeile mit 2-4 `vollstaendig_wenn`; keine Transfer-Zeile (Check 19)
- `handlungsprodukt.scaffolding` mit je **>=2** Eintraegen in satzanfaenge/strategien/struktur (Check 23, EBA verschaerft)
- `nrlp.sprachmodus_ids.length === nrlp.sprachmodi.length` (Check 21)
- LF4 ist fokussierte Output-Sprachmodus-Teilaufgabe, nicht das ganze Handlungsprodukt (Check 20)
- `mindmap_aeste.length === 4`, Ast 4 `optional: true` (Check 22)

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

**Schritt 3 — Coherence-Audit** ueber **beide** Herausforderungen (Checks 1-9 in `coherence-checklist.md`, EBA-Kalibrierung) + A2-Check. Bei Fehler stoppen.

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
- `herausforderungen[]` = **2 IDs (A/B)**
- `konzept_progression[]` = **2 Eintraege**, je `{position, herausforderung, konzept}` (konzept aus `sit_*.prinzip_handoff.kernkonzept`)
- `austausch_phase` = template-konstant; generiere ALLE drei Sozialform-Schluss-Varianten fuer das set-level "Austausch & Transfer"-Dokument (C8): `einzelauftrag` (EA — Einzel-Synthese, **3-4 kurze Saetze (A2)** + je ein Beispiel), `gruppenarbeit_jigsaw` (GA — 3 Runden; optional Alias `gruppenpuzzle`), `einzelarbeit_plenum` (PL — Plenum-Synthese; optional Alias `plenum`). **Sie-Form, A2; verweist auf die Austausch-Scaffolds im Dossier.**
- `dekontextualisierungs_aufgabe` = template-konstant + `ziel` aus `prinzip.dekontextualisierungs_anker.anker_statement`. Bildet zusammen mit den **zwei** `sit.dekontextualisierung.frage` (als Beispiele) die Transfer-Haelfte des Austausch-Dokuments. „Begriffe aus dem Dossier" statt Lehrmittelbegriffe.

Output: `src/data/einheiten/{X.Y.Z}_{topic_slug}/set.json`.

Proceed zu Phase 3.5.

---

### PHASE 3.5 — Wissensbedarf-Analyse (NEU, EBA-only)

**Read** `references/dossier-architecture.md`. Diese Phase erzeugt **keine Datei** — sie produziert
eine **interne Nugget-Bedarfsliste**, die Phase 7 (Dossier) befuellt. Sie ist der Backward-Design-
Scharnierpunkt: Welches Wissen + welche Sprachmodi-Strategien setzen die Herausforderungen A/B und
der (in Phase 4 folgende) KN voraus?

**Vorgehen:**

1. Sammle aus `herausforderung_A/B.json`: jede `leitfragen[].text` (+ `knoten_ref` → erwarteter
   Nugget) und jeden `quellen_anker[].konzept`/`prinzip.quellen_anker.konzepte`.
2. Sammle aus dem geplanten KN (prinzip `hybrid_situation_spec` + `kern_kompetenzversprechen`):
   welches Transferwissen die Hybrid-Herausforderung + die KN-Typen verlangen.
3. Leite ab:
   - **Nugget-Bedarf pro Herausforderung** (A/B): pro Leitfrage mindestens ein Nugget,
     A/B-getaggt, mit `fuer_leitfrage`-Kopplung.
   - **Sprachmodi-Scaffold-Bedarf**: je Herausforderung der Output-`sm_id` (→ `so_gehst_du_vor`).
   - **Transfer-Wissensblatt-Bedarf**: das Prinzip in A2 (`dekontextualisierungs_anker`) +
     Austausch-Scaffolds.
   - **Glossar-Bedarf**: jeder Fachbegriff, der in den Herausforderungen/KN vorkommt.
   - **Fakten-Bedarf**: alle konkreten Betraege/Fristen/Zahlen → spaeter `fakten_anker`
     (web-validierungspflichtig).
4. Halte die Liste intern bereit (oder als kurze Markdown-Notiz an Pietro). Kein File-Write.

> Diese Analyse stellt sicher, dass das Dossier in Phase 7 **genau** das deckt, was Auftraege +
> KN brauchen — Check Wissen↔KN-Alignment (`ERR_DOSSIER_GAP`) prueft das spaeter hart.

Proceed zu Phase 4.

---

### PHASE 4 — KN-Generierung (INLINE)

Read `assets/kn-template.json` + `references/kn-architecture.md`.

#### Step 1 — Prerequisites laden
- `prinzip.json`, `herausforderung_A/B.json`, `set.json`
- Cross-Ref-Check: `prinzip_ref` matched ueber alle vier Files
- Bei Fehler: `ERR_KN_INPUTS`, Phase stoppt, schreibt nichts

#### Step 2 — Hybrid-Herausforderung generieren

Read `kn-architecture.md` Paragraph 2 + §10. Konstruiere eine **eine** Szene:
- Persona aus `prinzip.persona_pool_kn_neu[0]` (Default; `[1]` Reserve), LJ1-2
- max. 120 Woerter, ICH-Perspektive, **A2**
- Aktiviert **beide** `herausforderung.konfliktart`-Aspekte (A+B) gleichzeitig (sichtbar, nicht explizit benannt)
- Aktiviert mindestens einen Trade-off aus `prinzip.mehrdeutigkeits_architektur.trade_off_raum`
- Endet mit genau einer Leitfrage, die die Spannung benennt
- `alignment_note.herausforderungen_mapping`: **2 Eintraege (A/B)**, je ein Szenenelement

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

#### Step 3 — KN-Typ 1 (Fachgespraech) — PRIMAERFORM (EBA-Schwerpunkt muendlich)

Aus `kn-template.json` `fragestruktur`-Skelett. **EBA-K-Decke K3.** Fuelle 5 Fragen (K2 → K2 → K3 → K3 → K3), stark gefuehrt:
- Frage 1 (Erklaeren, K2): bezieht sich auf zentrales Hybrid-Element
- Frage 2 (Anwenden, K2): Konzept-Logik aus herausforderung_B
- Frage 3 (Beurteilen, K3): "beide Aspekte gleich bewerten? warum?"
- Frage 4 (Transfer, K3): Vergleich mit einer der **beiden** Lernaufgaben
- Frage 5 (Werthaltung, K3): Akteur + Begruendung, weshalb nicht nur Marktfrage (oder topic-spezifische Analogform)

Format **25-30 Min.** (10-15 Min. Vorbereitung). Ablauf: **„Dossier erlaubt, kein Internet"** (nicht Lehrmittel). `sk` = Union der **2** sit_*.nrlp.sk dedupliziert, max 3 (Prioritaet: SK6 > SK11 > situativ). K4 nur als optionale 100%-Vertiefung.
`aspekte` = Union der 3 sit_*.nrlp.gesellschaft.
`sprachmodi` = konstant (Rezeption schriftlich+bildlich, Produktion muendlich, Interaktion muendlich).

#### Step 4 — KN-Typ 2 (Mini Case schriftlich) — vereinfacht

Aus `kn-template.json` `aufgaben`-Skelett. **EBA: kuerzer (30-40 Min.), K-Decke K3, mehr Scaffold im Blatt.** Fuelle 4 kurze Aufgaben (K2 → K2 → K3 → K3):
- Aufgabe 1 (Erklaeren, K2): Fakten/Diagramm
- Aufgabe 2 (Unterscheiden, K2): forciert Mehrdeutigkeit ("Beide ... entstehen durch ... Warum ist X anders zu beurteilen als Y?")
- Aufgabe 3 (Entscheiden, K3): konkrete Entscheidung im Hybrid-Kontext
- Aufgabe 4 (Forderung, K3): Policy/Intervention in Ich-Form

Ablauf: **„Dossier erlaubt, kein Internet"**; Satzanfaenge/Struktur aus dem Dossier ins Pruefungsblatt eindrucken. `sk`/`aspekte` analog zu Typ 1. `sprachmodi` = konstant (Rezeption + Produktion schriftlich+bildlich).

#### Step 5 — KN-Typ 3 (Werkschau + Transfer-Reflexion) — vereinfacht

Template-konstant: `format`, `ablauf`, `reflexionsfragen`, `sprachmodi`. **EBA: weniger schreiblastig** — Lernende waehlen eines ihrer **beiden** Handlungsprodukte; Transfer-Reflexion **120-150 Woerter** (statt 200-250), stark gefuehrt mit Satzanfaengen aus dem Dossier; Reflexionsfragen referenzieren „beide Herausforderungen".

**SK adaptiv (NEU in v1.1):**
1. Basis-Kandidaten = `[5, 6, 10]` (Werthaltungen, Standpunkte, Anpassung)
2. Filter: nur SK, die in `Union(herausforderung_A.nrlp.sk, herausforderung_B.nrlp.sk)` vorkommen, bleiben
3. Wenn nach Filter weniger als 2 SK uebrig: aus `prinzip.sk_schnittmenge_kn.primary` ergaenzen, bis 2-3 SK erreicht
4. Maximal 3 SK im Endergebnis

Beispiel 3.2.2: Union sit-SK = {1, 5, 6, 9, 11}. Basis [5, 6, 10] ∩ Union = [5, 6]. Ergaenzung aus primary [9, 11]: nimm SK11 (naeher zur Werkschau-Reflexion). Endergebnis: [5, 6, 11].

> **Rename-Touchpoint (D4):** Label «Werkschau + Transfer-Reflexion» und Key `werkschau_transfer` sind ein kuenftiger Rename-Touchpoint (Kanton-Begriff Werkschau/Portfolio noch ausstehend). Der Key bleibt stabil; bei einem Rename nur das sichtbare Label in `assets/kn-template.json` (`label`) + die Vorkommen in SKILL.md/References aendern — jetzt **nicht** umbenennen.

#### Step 6 — Rubrik-Anpassung

Lies `kn-architecture.md` Paragraph 6. Bestimme `dominanter_aspekt`:
- aus `sit_*.nrlp.gesellschaft[].aspekt`: jener, der in **beiden** Herausforderungen (2/2) vorkommt
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
lehrgang: "EBA 2J"
thema: "T{X} — {thema_titel}"
lebensbezug: "{X.Y}"
quellen_json:
  - "set.json"
  - "prinzip.json"
  - "herausforderung_A.json"
  - "herausforderung_B.json"
  - "kn.json"
  - "dossier.json"
---
```

> **EBA-Begleiter:** durchgaengig **2 Herausforderungen (A/B)**; Sektionen 3-4 statt 3-5 (kein C).
> Eigene Kurzsektion **„Wissens-Dossier (A2)"** ergaenzen: erklaert der LP, dass das Dossier das
> Lehrmittel ersetzt, A2-konform ist, und welche Fakten `lp_pruefen`-markiert sind. Alle Begleiter-
> Prosa ebenfalls A2-nah (LP-Dokument, aber Lernenden-Zitate bleiben A2). „Lehrmittel-Anker"-Tabelle
> in Sektion 1 wird zur **„Dossier-Anker"-Tabelle** (Nugget statt Kapitel/Seite).

#### Aufbau (Sektionen 0–8 + EBA-Sektion 8.5 + Wissens-Dossier; kein Anhang)

> **v2-Bausteine (Struktur-Spec v2.1 TEIL 6/8 — EBA-Anpassung):** Sektion 1 erhaelt neu **Kapitel 1.6 KI-Einsatz** (§E5). Jede Herausforderung (Sektionen 3–4 — **nur A/B**, EBA hat kein C) erhaelt vier neue Pflicht-Bausteine: `[!tafelbild]` (E4, vor der Scaffold-Werkstatt), «Wann ist das Produkt fertig?»-Haken-Liste (E2, nach den Scaffolds, **ohne** Prozente/Gewichte), `[!ki_einsatz]` (E5, A2-nah formuliert), `[!troubleshooting]` (E3, im Leitfragen-Block an der kritischen LF). Sektion 8 (KN) erhaelt je Prueffrage einen `[!erwartungshorizont]` (E1; **EBA-Decke K3** — die meisten Fragen sind K2/K3, der «Stufe 4 vs. aufloesen»-Kontrast greift nur, wenn eine Frage K3+ aufgespannt ist). Leitprinzip: **Datenhebung, nicht Neuerfinden**. Die EBA-Sektion 8.5 («Von der Lehrperson bereitzustellen»), die «Wissens-Dossier (A2)»-Kurzsektion und die Dossier-Anker-Tabelle **bleiben** — sie sind EBA-Pflicht, nicht der gestrichene Quellen-Anhang.

**Praeambel-Callout** (direkt nach Frontmatter, vor Sektion 0):

```markdown
> Dieses Dokument richtet sich an die **Lehrperson**, nicht an die Lernenden.
> Die Unterlagen fuer die Lernenden (Herausforderungsblaetter A/B, KN-Blatt, A2-Dossier) liegen
> separat als gerenderte A4-Broschueren vor. Hier steht, **wie** du die Einheit
> fuehrst: Phasenablauf, fertige Scaffolds zum Abgeben, Coaching-Bewegungen,
> bi-dimensionale Bewertung.
```

**Sektion 0 — So funktioniert diese Einheit**

5 nummerierte Punkte (immer in dieser Form):
1. Von hinten gedacht (Backward Design) — erklaert, dass KN zuerst definiert wurde
2. Eine Kompetenz, zwei Herausforderungen — benennt A/B mit ihren Sub-Herausforderungs-Kurzformen (Spiralen-Regel: gleicher Trade-off, maximal kontrastreiche Kontexte)
3. Drei Phasen-Schichten — BBW 4-Phasen (ganze Einheit) / IPERKA (Lernaufgabe) / **AViVA-Bogen (eine Herausforderung, ~3 Lektionen, Richtwert ohne feste Taktung)** als Tabelle (3 Zeilen). Reichweite-Spalte: „Ganze Einheit" / „Eine Lernaufgabe" / „Eine Herausforderung (~3 Lektionen)". Für AViVA NIE „eine einzelne Lektion" schreiben.
4. Bewertet wird das Produkt, bi-dimensional — SuK und Ges als getrennte Noten; die situationsinternen Bewertungsraster (5 Zeilen: LF 20 / Mindmap 15 / HP 35 / Refl 15 / Dekontext 15) sind formative Erfahrungsnoten
5. Mehrdeutigkeit ist gewollt — benennt den zentralen Trade-off des Sets

Schliesst mit `[!hinweis] Lektionentotal` callout. **EBA: kein fixer wochen-Wert** — die LP legt den Rhythmus je nach Klasse fest. Lektionen als Richtwert-Spanne angeben (z.B. „Variante A, beide Herausforderungen einzeln: Richtwert je 2-3 Lektionen + KN", „Variante C, Jigsaw: kompakter"), nicht als feste Taktung.

**Sektion 1 — Kompetenz, Ressourcen, Architektur**

- **Das Kompetenzversprechen** — `kern_kompetenzversprechen` als Blockzitat (> "...")
- **Ressourcenanalyse** — Tabelle 2-spaltig: `GES — Gesellschaftswissen` | `SuK — Sprache und Kommunikation`. Je 4-6 Eintraege, abgeleitet aus den NRLP-Aspekten und Sprachmodi des Sets.
- **Verbindungsformel** — ein Satz: "Die Lernende {SuK-Sprachhandlung}, indem sie {GES-Wissen} nutzt, um {Handlungsziel}." Als Blockzitat.
- **Bloom-Zielprofil pro Leitfrage** — Tabelle (EBA): LF1=K2 (Erklaerproblem), LF2=K2 (Verstehen/Anwenden), LF3=K3 (Anwenden), LF4=K3 (Entscheiden). Aus `prinzip.bloom_zielprofil`. K4 nur als optionale 100%-Extension. **LF4 trainiert dabei den Output-Sprachmodus als fokussierte Sprachform-Teilaufgabe (ein Baustein, der ins Handlungsprodukt einfliesst) — nicht das ganze Produkt (C4).**
- **Mehrdeutigkeits-Architektur** — die `trade_off_raum`-Eintraege als nummerierte Liste mit Herausforderungs-Zuordnung. Dann `[!mehrdeutigkeit] Der Grundsatz` callout mit `mehrdeutigkeits_architektur.verbindlich`.
- **Zirkularitaet** — Tabelle R1/R2/R3 aus `zirkularitaet`-Feld des Prinzips. Erklaert warum R1 „legt, nicht abschliesst".
- **Dossier-Anker** (EBA, ersetzt Lehrmittel-Anker) — Tabelle Herausforderung | Nugget(s) | Titel, aus `prinzip.quellen_anker.dossier_nuggets[]` und den `sit_*.prinzip_handoff.dossier_anker`-Feldern. Verweist auf `dossier.json`. Maximal 10 Zeilen.

**Kapitel 1.6 — KI-Einsatz: Nutzungsideen fuer diese Einheit (v2, §E5)**

Eigenes Sub-Kapitel `### 1.6 KI-Einsatz — Nutzungsideen fuer diese Einheit` am Ende von Sektion 1 (Einheits-Uebersicht; situationsspezifische Ideen kommen zusaetzlich pro Herausforderung in Sektionen 3–4).

- **Rahmung (Pflicht-Satz):** Der Begleiter macht **keine** KI-Regel (kein Verbot/Gebot, keine Compliance/Hilfsmittel-Regelung). Ob und wie KI eingesetzt wird, bleibt **vollstaendig LP-Entscheid**. Formulierung durchgaengig als **Empfehlung**, nie Vorschrift.
- **NICHT** auf die separaten KI-Fluency-Zusatzmaterialien verweisen (noch nicht veroeffentlicht).
- **EBA-Anpassung:** Die Nutzungsideen muessen **A2-niedrigschwellig** sein (einfache, konkrete Schritte — z.B. „einen kurzen Text vorlesen und einfacher machen lassen", „nach einem schwierigen Wort fragen"), passend zum dominanten Sprachmodus + den `handlungsprodukt`-Formaten des Sets. Als `[!ki_einsatz]`-Callout, 2–4 Ideen.

**Sektion 2 — Durchfuhrungs-Varianten**

Drei Varianten (immer alle drei dokumentieren). **EBA: 2 Herausforderungen (A/B)**, Lektionen als Richtwert (kein fixer wochen-Wert):

- **Variante A** (Einzelarbeit, beide Herausforderungen): Kompetenz voll. KN ungekuerzt. Richtwert je Herausforderung 2-3 Lektionen + KN.
- **Variante B** (Einzelarbeit, Auswahl einer Herausforderung): `[!warnung] KN muss mitgekuerzt werden`: Hinweis auf Constructive Alignment.
- **Variante C** (Jigsaw, A+B im Austausch): kompakter. `[!warnung] Die Haelfte wird nur stellvertretend erworben` + Gegenmittel. `[!coaching] Variante offen ansagen`.

**Sektionen 3-4 — Eine Sektion pro Herausforderung (A, B)**

Jede Herausforderung bekommt dieselbe Unterstruktur:

1. **Steckbrief-Tabelle** (Felder: Titel, Sub-Herausforderung, Persona, Aspekte, Sprachmodi, Schluesselkompetenzen, Handlungsprodukt, Wissensknoten — **kein Emotion-Feld mehr**, C1) — aus `sit_*.json`-Feldern.
2. **Herausforderungs-Zitat** — `situation_text` als Blockzitat.
3. `[!hinweis] Qualitaet der Herausforderung` callout — 8 Merkmale kurz pruefen (Authentizitaet, Verortung, Problem, Affektivitaet, Kognition, Aktivitaet, LJ-Passung, Relevanz).
4. **Unterrichtsfahrplan** — Einleitungssatz „AViVA-Bogen über ~3 Lektionen — Richtwerte, keine feste Taktung. Die Lernenden arbeiten selbstständig; Sie begleiten coachend und bestimmen Tempo und Dauer der Phasen selbst." Danach Tabelle **AViVA-Phase | Was passiert | Sozialform** (NICHT „Lektion | … | 2 Lektionen à 45'"), Phasen aus `leitfragen`- und `handlungsprodukt`-Feldern.
5. **Leitfragen mit Coaching-Hinweisen** — Fuer jede LF (1-4):
   - LF-Text in Fettschrift
   - `[!coaching] LF{n}` callout mit konkretem Unterrichts-Move (kein allgemeines Lob, sondern Was-genau-tun)
   - Bei heiklen LF: zusaetzlich `[!warnung] Typischer Stolperstein` callout
   - **`[!troubleshooting]` — «Wenn ein Lernender feststeckt» (v2, §E3):** GENAU EIN Troubleshooting-Callout pro Herausforderung, verortet **im** Leitfragen-Block an der LF mit dem schaerfsten Zielkonflikt (bei EBA meist LF3 Anwenden oder LF4 Entscheiden). Titel-Pflicht: `Herausforderung {X} — {konkrete Blockade}`. Inhalt: die haeufigste konkrete Blockade + **ein Interventionssatz** (was die LP sagt/fragt) + die Weiterfuehrung. **Der Interventionssatz ist immer eine Rueckfrage oder ein Spiegeln, nie eine Erklaerung** (sonst kippt die coachende Rolle zurueck in Frontal). **EBA: der Interventionssatz selbst A2-einfach halten.** Datenhebung: `mehrdeutigkeit.hint` + `scaffolding.strategien` + der vorhandene `[!warnung]`-Stolperstein. Abgrenzung zu `[!warnung]`: Warnung = Praevention vorher; Troubleshooting = Reaktion im Moment jetzt.
6. **`[!tafelbild]` — fachliche Soll-Loesung (v2, §E4)** — **vor** der Scaffold-Werkstatt (das Soll-Bild rahmt die Vorlagen). Callout `[!tafelbild]`, Titel `Erwartungsbild — {mindmap_zentrum}`. Mindmap als Erwartungsbild, getrennt nach **Pflicht-Aesten** (alle finden) und **optionaler Vertiefung** (fuer 100%). Datenhebung 1:1: `mindmap_zentrum` → Callout-Titel; `mindmap_aeste[]` `optional: false` → Pflicht-Block, `optional: true` → Vertiefungs-Block; Detailpunkte aus `mindmap_aeste[].punkte[]` (bzw. `.text`). **EBA: das Erwartungsbild bleibt fachlich vollstaendig (LP-Dokument), die Soll-Punkte aber knapp/konkret.**
7. **Scaffold-Werkstatt** — mind. ein fertig ausgefuellter Template (Lueckentext, Tabelle, Drehbuch, oder Vergleichstabelle), abgeleitet aus `handlungsprodukt.schritte`, `handlungsprodukt.scaffolding` (Satzanfaenge/Strategien/Struktur, C6) und dem Sprachmodus. Als Code-Block oder Markdown-Tabelle. Die **Gütekriterien** der Handlungsprodukt-Seite stammen aus `lernfortschritt.kriterien` (kriterium + indikator).
   - `[!differenzieren] 80 vs. 100` callout: beschreibt, was alle bekommen (80%) vs. schnellere Lernende (100%). **Prozent-Regel:** Die Zahlen 80 %/100 % erscheinen **nur im Begleiter (LP)** und im LP-Bewertungsraster — **nie in SuS-Renders** (DocS, DocKnS-SuS). Die SuS-Ansicht der Niveaubänder zeigt Wort-Labels («Grundanforderung erfüllt» / «Vollständig & selbstständig»), keine Prozentzahlen.
8. **«Wann ist das Produkt fertig?» — Vollstaendigkeits-Check (v2, §E2)** — **nach** der Scaffold-Werkstatt. **Reine Haken-Liste (Checkliste), KEINE Tabelle mit Prozenten/Gewichten** — formative Selbstkontrolle der Lernaufgaben-Phase, nicht der benotete KN. Ueberschrift-Zeile: `**Wann ist das Produkt fertig?** (Selbstcheck — formativ, nicht benotet)`. Datenhebung 1:1 aus `bewertungsraster[]`: pro Eintrag `.produkt` (bzw. `.kriterium`) als Teilprodukt-Ueberschrift + `vollstaendig_wenn[]` als `☐`-Punkte. Reihenfolge: Leitfragen → Mindmap → Handlungsprodukt → Reflexion. **`gewicht_prozent`-Werte werden NICHT angezeigt.** **EBA: die Haken-Punkte A2-einfach formulieren** (die `vollstaendig_wenn`-Strings sind bereits A2 — nicht verkomplizieren).
9. **`[!ki_einsatz]` — KI-Einsatz in dieser Herausforderung (v2, §E5)** — **nach** dem Vollstaendigkeits-Check, **vor** dem Coaching-Block. Callout `[!ki_einsatz]`, Titel-Pflicht. 2–3 **situationsspezifische**, **A2-niedrigschwellige** Ideen, an die jeweilige Sprachhandlung gekoppelt, plus immer ein **«Nicht:»**-Hinweis, der die zu zeigende SK schuetzt. Zwei tragende Muster: (1) Entwurf vorlesen/pruefen/vereinfachen lassen (bei Schreibprodukten), (2) Rolle der Gegenpartei uebernehmen (bei Gespraechsprodukten). Ableitung aus `handlungsprodukt.format` + dominanter Sprachhandlung. Durchgaengig **Empfehlung**, nie Vorschrift; Ob/Wie = LP-Entscheid. **Keine KI-Regel, kein Verweis auf die unveroeffentlichten KI-Fluency-Materialien.**
10. **Mehrdeutigkeit halten** — `[!mehrdeutigkeit] Herausforderung {X}` callout mit dem situationsspezifischen `trade_off` und konkretem Eingriff-Satz.
11. **Wo welche SK geuebt wird** — Tabelle SK | Demonstration (ein konkreter Satz pro SK, wo genau im Arbeitsauftrag). Aus `sk_anker[].wo`.
12. **Coaching & Scaffolds — auf einen Blick** (Cluster 5, gebuendelt) — Abschnitt am Ende der Herausforderung, der die schon vorhandenen Inhalte als Schnell-Referenz sammelt (Inhalt NICHT neu erfinden): ein `[!coaching]`-Callout „Die drei Moves dieser Herausforderung" (die LF-Coaching-Moves als nummerierte Kurzliste) + eine Zeile „Zum Abgeben bereit:" mit den Scaffold-Namen. Direkt danach ein `[!coaching] Perspektivenwechsel`-Callout (**LP-only, nie SuS**): ein konkreter, auf den situationsspezifischen Konflikt bezogener Perspektivenuebernahme-Move (Sicht der Gegenseite zuerst einnehmen), begruendet ueber den Trade-off der Herausforderung bzw. die aktivierte SK (oft SK7 Verstaendnis foerdern). Render: `coaching`/`differenzieren` erhalten im `begleiter-builder.ts` extra Gewicht (farbiges Header-Band + Box).

> **Positions-Regel (Spec §1.5):** Tafelbild VOR den Scaffolds · Vollstaendigkeits-Check NACH den Scaffolds · KI-Einsatz nach dem Check und vor dem Coaching-Block · Troubleshooting IM Leitfragen-Block an der kritischen LF. Diese vier Bausteine sind pro Herausforderung (A/B) **Pflicht**.

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
- **`[!erwartungshorizont]` je Prueffrage/Aufgabe (v2, §E1)** — direkt **nach jeder Frage/Aufgabe** im Fragenpool ein eigener Callout. Titel-Pflicht: `Frage {n} ({Bloom-Verb}, K{n}) — {Kurzfokus}`. **EBA-Decke K3:** Die meisten Fragen sind K2/K3.
  - **K2-Fragen (Erklaeren/Verstehen):** zwei Zeilen — **«vollstaendig zeigt»** vs. **«lueckenhaft»** (kein «Stufe 4 vs. aufloesen»-Kontrast).
  - **K3-Fragen (Anwenden/Entscheiden):** drei Zeilen — **Stufe 3 zeigt** (situationsangemessene, korrekte Antwort) / **Stufe 4 zeigt zusaetzlich** (Zielkonflikt offen gehalten, Transfer — nur wo die Frage das ueberhaupt zulaesst) / **Nicht Stufe 4** (souveraen klingendes Gegenbeispiel, das den Zielkonflikt aufloest).
  - Datenhebung: `kn_typen[].fragestruktur[].frage` × `.k_stufe` × thematisch passendes `rubrik_shared.kriterien[].stufen[]`. Anzahl == Zahl der Prueffragen. **A2: die Erwartungshorizont-Prosa ist LP-gerichtet, darf fachlich praezise sein; die zitierten Beispiel-Antworten aber auf A2-Niveau.**
- **Bi-dimensionale Bewertung** — Tabelle: Kriterium | Dimension (4 Zeilen, 2 SuK + 2 Ges). Vier Stufen (**Skala 1–4, 1 = tiefste** — rubrik-interne Kriteriumsskala, NICHT die nRLP-Guetestufe 0–3; Spec K2/TEIL 8.2) als kompakte Tabelle. Niveaubaender **unter 60 % / 80 % / 100 %** (Spec K1/K3/TEIL 8.2; Prozente nur LP-seitig, vgl. Prozent-Regel Punkt 7). SuK- und Ges-Note getrennt, nie verrechnen.
  - `[!coaching] Bi-dim sauber halten` callout.
  - `[!mehrdeutigkeit] Der haeufigste Bewertungsfehler` callout: erklaert, warum „klarste Loesung = hoechste Note" falsch ist.

**Sektion 8.5 — Von der Lehrperson bereitzustellen (NEU, befuellt in Phase 7.5)**

- Konsolidierte Liste aller Materialien, die die Auftraege voraussetzen, aber **nicht** als SuS-Blatt oder Dossier-Info-Karte vorliegen (Ergebnis der Phase-7.5-Material-Bedarfs-Analyse).
- Format: Tabelle **Material | Fuer welche Herausforderung | Quelle/Vorlage**.
- Items, die bereits im Dossier liegen (z. B. eine Kontaktstellen-Liste als Info-Karte), **nicht duplizieren** — nur die LP-Konkretisierung auflisten (z. B. kanton-spezifische Namen/Kontaktdaten, `lp_pruefen`-Fakten, Zugang zu einem KI-Tool).
- `[!hinweis] Bereits im Dossier` callout, der auf die betreffende Info-Karte verweist, statt zu duplizieren.
- Findet die Analyse nichts: Sektion mit einem Satz «Keine zusaetzlichen LP-Materialien noetig.»

> **Kein «Anhang — Quellen» (Spec TEIL 8.3):** Das frueher vorhandene Schluss-Kapitel
> «Anhang — Quellen dieses Dokuments» **entfaellt**. Die Quellenangabe ist ueber das
> Frontmatter (`quellen_json`) und die Dossier-Anker (Sektion 1) abgedeckt. **EBA-Hinweis:**
> Das Dokument endet mit der «Wissens-Dossier (A2)»-Kurzsektion bzw. Sektion 8.5 («Von der
> Lehrperson bereitzustellen») — diese EBA-Pflichtsektionen sind NICHT der gestrichene Anhang
> und bleiben erhalten.

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

Confirm und **Proceed zu Phase 7** (Dossier — der EBA-Pflichtschritt, der das Set vollstaendig macht).

---

### PHASE 7 — Dossier-Generierung (NEU, EBA-only) + Web-Validierung + A2-Gate

**Read** `references/dossier-architecture.md` + `assets/dossier-template.json`. Dies ist der
**letzte** Generierungsschritt — das Dossier wird per **Backward Design** aus den fertigen
Herausforderungen A/B + KN abgeleitet (nie vorab). Output:
`src/data/einheiten/{X.Y.Z}_{topic_slug}/dossier.json`.

#### Step 1 — Prerequisites + Bedarfsliste
- Lade `herausforderung_A/B.json`, `kn.json`, `prinzip.json`, `set.json` + die Nugget-Bedarfsliste
  aus Phase 3.5.
- Cross-Ref-Check: `set_ref`/`prinzip_ref` konsistent. Bei Fehler `ERR_KN_INPUTS`, Stop.

#### Step 2 — Geschichtete Bausteine fuellen (alle A2)
- **`kopf`** (Titelseite) — Kerndaten DIREKT aus `public/nrlp_2j.json` per `kompetenz_nr`:
  `thema_nr/titel`, `lebensbezug_nr/text`, `kompetenz_nr/text` (verbatim nRLP), `lehrjahr`;
  `einheit_titel` aus `set.einheit_titel`/`topic_slug`; `lehrgang/sprachniveau` konstant. Siehe §9.
- **`einleitung`** — `was_ist_das` (1-2 Saetze) + `so_benutzt_du_es[]` (4-5 Schritte), A2. Siehe §9.
- **`nuggets[]`** — pro Herausforderung A/B mindestens 2-3, jede Leitfrage gedeckt (`fuer_leitfrage`),
  `tag` A|B|AB, kurze A2-Prosa + konkretes Schweizer Beispiel.
- **`sprachmodi_scaffolds[]`** — je Herausforderung ein Eintrag am Output-`sm_id`, mit
  `so_gehst_du_vor` (Schritt-fuer-Schritt).
- **`transfer_wissensblatt`** — `fachsystematik` + `prinzip_in_einfach` (A2-Fassung von
  `prinzip.dekontextualisierungs_anker.anker_statement`) + `austausch_scaffolds`.
- **`glossar[]`** — jeder in einem `nugget.inhalt` verwendete Fachbegriff, mit `erklaerung_a2` +
  Beispiel; in `nugget.glossar_refs` verlinkt.
- **`leseblatt`** (OPTIONALES Lese-Arbeitsblatt, Lesefoerderung) — `einleitung` (A2) + **5** `richtig_falsch`
  (aus Nugget-Inhalten, je klar richtig/falsch; `loesung` bleibt intern, wird nicht gedruckt) + **3**
  `w_fragen` (offene Verstaendnisfragen) + `vokabeln` (**6** `glossar`-IDs zentraler Begriffe). Der
  **Gesamttext wird vom Renderer automatisch aus `nuggets[].inhalt`** (A->B) gezogen — NICHT duplizieren.
  Rendert als eigenes optionales SuS-Dokument (DocLeseblatt) unter «Zusatzmaterialien», nicht als
  Glossar+-Seite. Siehe `references/dossier-architecture.md` §10.
- **`nuggets[].recherche`** (reich, **ein Nugget pro Seite**) — `suchbegriffe` (2-3 Plain-Keyword-
  Suchen, **kein** Gesetzesartikel) + `ki_beispiel` (`so_fragst_du` + `prompt`, Move nach Nugget-Typ,
  am Nugget-Inhalt geerdet, `tipp` optional) + `ki_lernen` (**2 verschiedene** Moves aus dem
  Strategie-Menu — NICHT immer retrieval+feynman — passend zum Nugget-Typ, geerdet) + `selbst_pruefen`.
  **Prompt-Qualitaet**: Strategie-Menu + Grounding + Anti-Sameness (`WARN_PROMPT_EINTOENIG`) — keine
  Variationen desselben Satzes. Siehe `dossier-architecture.md` §8 (Prompt-Qualitaet).

#### Step 3 — Web-Validierung der Faktenanker (durch Claude)
Fuer jeden `fakten_anker` (Betrag, Frist, Rechtsstand, Zahl, Datum):
1. Web-Suche auf serioeser, aktueller Quelle (admin.ch, berufsbildung.ch, seco, kantonale Stelle,
   Berufsverband). Quelle in `quelle` notieren.
2. Bestaetigt → `validiert: true`. Nicht sicher web-pruefbar / veraenderlich / lokal →
   `lp_pruefen: true`.
3. **Kein Fakt bleibt ungeflaggt** — sonst `WARN_FAKT_UNGEPRUEFT`. Nie einen unbestaetigten Wert als
   gesichert ausgeben; im Zweifel `lp_pruefen: true`.
4. **Recherche-Scaffolds ableiten** (learner-facing; ersetzt die fruehere Fakten-Anzeige): pro Nugget
   `recherche.suchbegriffe` (2-3) + `recherche.ki_beispiel` (`so_fragst_du` + `prompt` + opt. `tipp`)
   + `recherche.selbst_pruefen`. Bei **lokal/persoenlich** variierenden Fakten ist `selbst_pruefen`
   konkret („Schau in deinen Lehrvertrag …"), sonst ein Anwendungs-/Retrieval-Auftrag. Fachlich
   unsichere `lp_pruefen`-Fakten werden **nicht** zum Schuelerauftrag (bleiben interne QA).
   `fakten_anker` wird nicht mehr gerendert. Siehe `dossier-architecture.md` §8.

#### Step 4 — Checks vor dem Write
- **A2-Enforcement** (ERR-Gate) auf jedem Prosa-Feld: `ERR_A2_SATZ_ZU_LANG` (>18 W.),
  `ERR_A2_BEGRIFF_OHNE_GLOSSAR` (Fachbegriff ohne Glossar). WARN-Codes melden + beheben.
- **Anrede-Scan (ERR `ERR_ANREDE_DU`, blockierend, NEU):** scanne ALLE Dossier-Prosa-Felder —
  `einleitung.was_ist_das/so_benutzt_du_es[]`, `nuggets[].inhalt/beispiel`,
  `nuggets[].recherche.ki_beispiel.so_fragst_du/prompt/tipp`, `nuggets[].recherche.selbst_pruefen`,
  `nuggets[].recherche.ki_lernen[].strategie/prompt`, `sprachmodi_scaffolds[].strategien/so_gehst_du_vor`,
  `transfer_wissensblatt.fachsystematik/prinzip_in_einfach` + `austausch_scaffolds.so_tauschst_du_aus[]`,
  `glossar[].erklaerung_a2/beispiel`, `leseblatt.einleitung/.richtig_falsch[].text/.w_fragen[]` — auf Du-Anrede (`du/dein/dir/dich`), informelles `ihr` als Anrede
  und Du-Imperative ohne «Sie» («Sag…», «Lass…», «Spiel…», «Tu…», «Schau…», «Frag…», «Stell…»). Jeder
  Treffer **stoppt den Write**, bis auf Sie-Form umgestellt. Prompts, die die Lernende an die KI richtet,
  siezen die KI ebenfalls. JSON-**Keys** (`so_fragst_du`, `so_gehst_du_vor`, `so_tauschst_du_aus`) sind
  ausgenommen. Das A2-Gate (Phase 4) deckt die Dossier-Anrede NICHT ab — dieser Scan ist Pflicht.
- **Recherche-Scaffolds**: jedes Nugget hat `recherche.suchbegriffe` (>=2) + `recherche.ki_beispiel`
  (`so_fragst_du` + `prompt`) + `recherche.ki_lernen` (2) + `recherche.selbst_pruefen`
  (`WARN_RECHERCHE_FEHLT`); `suchbegriffe` ohne Gesetzesartikel.
- **Prompt-Qualitaet**: Prompts am Nugget-Inhalt geerdet, Moves nach Typ gewaehlt und ueber das
  Dossier variiert — keine Variationen desselben Satzes (`WARN_PROMPT_EINTOENIG`). §8.
- **Wissen↔KN-Alignment**: jede `mission.leitfragen[]` + jeder KN-Anspruch
  (`kn.kn_typen[].fragestruktur/aufgaben/reflexionsfragen` + Kernprinzip) hat Dossier-Deckung,
  sonst `ERR_DOSSIER_GAP` (Nugget ergaenzen, erneut pruefen).
- **Fakten-Validierung**: jeder `fakten_anker` `validiert:true` ODER `lp_pruefen:true`.
- Eszett/Umlaut-Scan wie sonst.

#### Step 5 — File schreiben
```
src/data/einheiten/{X.Y.Z}_{topic_slug}/dossier.json
```
Confirm: `✓ {X.Y.Z}_{topic_slug}/dossier.json gespeichert`. Bei offenen `lp_pruefen`-Flags: Liste der
zu pruefenden Fakten an Pietro ausgeben.

Dann Final-Summary:

```
2er-EBA-Set {X.Y.Z}_{topic_slug} vollstaendig:
  ✓ prinzip.json
  ✓ herausforderung_A.json, herausforderung_B.json
  ✓ set.json
  ✓ kn.json (Hybrid A+B + 3 Typen, Fachgespraech primaer + bi-dim Rubrik)
  ✓ begleiter.md
  ✓ dossier.json (A2; {n} Nuggets je mit Recherche-Hinweis, {m} Glossar; {v} Fakten validiert, {p} zu pruefen)
  ✓ dossier.json → leseblatt (optionales Lese-Arbeitsblatt: 5 R/F, 3 W-Fragen, 6 Vokabeln; Gesamttext auto)

Naechster Schritt: Material-Bedarfs-Analyse (Phase 7.5), dann Index-Rebuild (siehe unten).
```

---

### PHASE 7.5 — Material-Bedarfs-Analyse (NEU)

Laeuft **nach** Phase 7 (das Dossier muss fertig sein) und schliesst die Luecke «Auftrag verspricht ein Material, das nirgends vorliegt» (Feedback Matthi P3: «Kontaktstellen-Liste stehen bereit», aber keine Liste).

**Step 1 — Scan aller SuS-Artefakte:** Gehe `herausforderung_A/B.json` (`handlungsprodukt.*`, `scaffolding`, `schritte`, `leitfragen[].text`, `lernfortschritt.scaffold_90/100`) + `set.json` (Austausch-/Transfer-Auftrag) durch und sammle jedes **referenzierte Material** (Liste, Vorlage, Formular, Tabelle, Dokument, Werkzeug/Tool), das ein Auftrag voraussetzt.

**Step 2 — Gegen Dossier abgleichen:** Fuer jedes referenzierte Material pruefen, ob es im `dossier.json` als Info-Karte / Scaffold / Glossar **tatsaechlich vorliegt**.
- **Vorhanden** → keine Aktion (der Anspruch ist gedeckt).
- **Kanton-/lokal-variierende Angaben** (z. B. genauer Name + Kontaktdaten der zustaendigen Stelle) → **NICHT** auf die LP-Liste, sondern per **Selbstrecherche** im Dossier abdecken: `recherche.suchbegriffe` mit einem gezielten Tipp («Berufsbildungsamt [Ihr Kanton]») + `selbst_pruefen` + KI-Prompt mit «[Ihr Kanton]». EBA-Prinzip: das Glossar+ lehrt, *wie* man es findet. Im Begleiter dann nur als **Fallback** vermerken, nicht als Pflicht-Vorbereitung.
- **Nicht vorhanden + nicht selbst recherchierbar** → auf die Liste «Von der LP bereitzustellen». Das sind echte LP-Materialien (z. B. eigene Vertragskopien der Lernenden, Zugang zu einem KI-Tool).

**Step 3 — Coherence-Check (optional, empfohlen):** Jedes Scaffold, das ein Artefakt verspricht («… stehen bereit», «… liegt vor»), muss entweder **Dossier-Deckung** haben **oder** in der LP-Material-Liste stehen — sonst `WARN_MATERIAL_UNGEDECKT` melden und entweder das Dossier ergaenzen oder das Scaffold umformulieren («… stellt die Lehrperson zur Verfuegung»).

**Step 4 — In den Begleiter schreiben:** Ergebnis als Tabelle in die Begleiter-Sektion **«Von der Lehrperson bereitzustellen»** (Sektion 8.5) schreiben. Bereits im Dossier vorhandene Artefakte nur referenzieren, nicht duplizieren (`[!hinweis] Bereits im Dossier`). Findet die Analyse nichts: ein Satz «Keine zusaetzlichen LP-Materialien noetig.»

Confirm: `✓ Phase 7.5: {k} LP-Materialien identifiziert → Begleiter-Sektion 8.5 geschrieben`.

---

### DEPLOYMENT — Index-Rebuild

Die **8** Dateien (`herausforderung_A/B.json`, `prinzip.json`, `set.json`, `kn.json`, `begleiter.md`, `dossier.json`) liegen bereits am finalen Ort `src/data/einheiten/{X.Y.Z}_{slug}/`. Es ist kein Kopieren zwischen Repos noetig. **Hinweis:** Der Einheiten-Loader (`src/lib/einheiten/index.ts`) liest `dossier.json` noch nicht — wie alle Renderer-Belange wird das erst nach Pietros Gold-Review verdrahtet. Die Einheit erscheint trotzdem korrekt im Katalog (2er = `hf_C` ist `null`, vom Loader toleriert), nur das Dossier wird vorerst nicht gerendert.

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
- Mix-Pflicht (EBA): pro 2er-Set **2 verschiedene Abteilungen** in `persona_pool_units` (EBA-Berufe bevorzugt)

### ICH-Perspektive Formula
```
Ich bin [Beruf]-Lernende/r (EBA) im [1. oder 2.] Lehrjahr bei [Betrieb] in [Stadt].
[Konkrete Ausgangslage mit Zahlen oder Fakten].
[Was ich noch nicht weiss oder was ueberraschend ist].
[Die Entscheidung oder das Problem mit Trade-off (aus Prinzip)].
```

**Würde-Regel (emotionale Unsicherheit):** Emotionale Unsicherheit in der Lernenden-Stimme wird
**würdevoll** formuliert — als legitimes Gefühl, nicht als Selbstabwertung. Schreibe «Ich habe Angst,
eine dumme Frage zu stellen.» statt «Ich will nicht dumm wirken.»; «Ich bin unsicher.» statt «Ich bin
zu blöd dafür.». Die Person darf zweifeln, ohne sich abzuwerten.

### K-Level Auto-Correction
- K1 als Kern-Problem → automatisch hochstufen auf K2/K3
- K2 = Verstehen/Erklaeren · K3 = Entscheiden/Anwenden (zwei Optionen mit Begruendung)
- **EBA-Decke K3** — K4 (Analysieren) nur als optionale 100%-Extension, nicht Pflicht
- LF3/LF4 sind K3 (EBA); kein K4-Pflichtanker
- **LF4-Scoping (C4):** LF4 trainiert den Output-Sprachmodus (`nrlp.sprachmodus_ids`) als fokussierte Teil-/Sprachform-Aufgabe — EIN Baustein, der ins Handlungsprodukt einfliesst — nie das ganze Handlungsprodukt. Rezeption (SM3) bleibt bei LF1-3. Methode aus `references/sprachfoerderung-methoden.md` passend zum Output-Modus.

### Constructive Alignment
Kompetenzziel-Verb ↔ Lernaktivitaet ↔ Handlungsprodukt muessen matchen. LF4 spiegelt den Output-Sprachmodus als geuebte Sprachform-Teilaufgabe (nicht das volle Produkt) — Coherence-Check 20.

**Fall-Treffer-Regel (Anwenden-Leitfrage ↔ situation_text):** Eine **K3-Anwenden-Leitfrage** («Prüfen
Sie Ihren Fall …») muss genau den im `situation_text` geschilderten **konkreten** Fall treffen — nicht
einen anderen Default-Fall, den nur das Dossier erklärt. Wenn die Situation eine *Abweichung* schildert,
fragt die LF nach der *Abweichung*; wenn die Situation den Standardfall schildert, fragt sie nach dem
Standardfall. Das Dossier-Nugget zur LF muss den geschilderten Fall **decken** (sonst `ERR_DOSSIER_GAP`).
> Negativ-Beispiel (Feedback Matthi, 1.1.1): `situation_text` = «Im Vertrag steht eine *andere* Dauer,
> als ich dachte», aber LF3 = «Was gilt, wenn im Vertrag *nichts anderes* steht?» → Widerspruch. Korrekt:
> «Was gilt, wenn im Lehrvertrag eine *andere* Dauer steht als abgemacht?» (+ Nugget deckt den Abweichungs-Fall).

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
| `WARN_BLOOM_TOO_LOW` | keine K3-LF (EBA: K3 statt K3+/K4) | Auto-Fix: LF auf K3 anheben, User bestaetigen |
| `WARN_MEHRDEUTIGKEIT_NEAR_MISS` | trade_off fast aus trade_off_raum | Auto-Fix: naechster Vorschlag, User-OK |
| `ERR_A2_SATZ_ZU_LANG` | Satz > 18 Woerter in SuS-Prosa (EBA, Check NEU A) | Pre-Write-Block: Satz aufteilen, erneut schreiben |
| `ERR_A2_BEGRIFF_OHNE_GLOSSAR` | Fachbegriff ohne Dossier-Glossar-Eintrag (Check NEU A) | Pre-Write-Block: Glossar-Eintrag ergaenzen |
| `WARN_A2_*` | A2-Soft-Verstoss (Satzlaenge-Schnitt, Nebensatzkette, Passiv, Nominalstil, Konjunktiv) | A2-konform umformulieren, weiterlaufen |
| `ERR_DOSSIER_GAP` | Leitfrage/KN-Anspruch ohne Dossier-Deckung (Check NEU B, Phase 7) | Pre-Write-Block: Nugget/Scaffold ergaenzen, erneut pruefen |
| `WARN_FAKT_UNGEPRUEFT` | `fakten_anker` weder `validiert` noch `lp_pruefen` (Check NEU C, Phase 7) | Web-Validierung; sonst `lp_pruefen:true` setzen |
| `ERR_PERSONA_ABTEILUNG_MONO` (EBA) | `persona_pool_units` deckt < **2** Abteilungen ab | Stop, Pool neu ziehen (EBA-Schwelle 2) |
| `ERR_HF_BEGRIFFSANKER` | Herausforderung haengt an einem einzelnen Begriff — Begriff-Lookup loest die Aufgabe (F2) | Stop, Herausforderung problemorientiert umformulieren |
| `WARN_LF_WISSENSABFRAGE` | Leitfrage ist reine Wissenswiedergabe («Was ist …?», «Nennen Sie …») (F3) | In Taetigkeitsformat umformulieren, weiterlaufen |

---

## File Naming Convention

```
src/data/einheiten/{X.Y.Z}_{topic_slug}/
├── prinzip.json
├── herausforderung_A.json
├── herausforderung_B.json
├── set.json
├── kn.json
├── begleiter.md
└── dossier.json          (NEU, EBA-only — A2-Wissens-Dossier)
```

- `X.Y.Z` — vollstaendige NRLP-Subkapitel-Referenz
- `topic_slug` — 2-4 Worte, snake_case, ohne Umlaute, aus Phase 0.5
- `LETTER` — A / B (kein C im 2er)

**Identifier-Depth-Regel:** immer die tiefste verfuegbare NRLP-Referenz; `X.Y.Z` nicht auf `X.Y` reduzieren.

**Mehrere Sets unter gleichem X.Y.Z:** verschiedene `topic_slug`-Werte koexistieren.

---

## Final Validation Checklist (vor Reporting)

### Prinzip:
- [ ] `id` Format `{X.Y.Z}_{topic_slug}_prinzip`, `lehrgang: "EBA_2J"`
- [ ] `kern_kompetenzversprechen` endet auf **K2/K3**-Verb, ICH-Form
- [ ] **Genau 2 Herausforderungen A/B** (Spiralen-Regel: gleicher Trade-off, maximal kontrastreich)
- [ ] `bloom_zielprofil` LF1-2 K2 / LF3-4 K3 (kein K4-Pflicht)
- [ ] `sk_schnittmenge_kn.primary` >= 2 SK (SK in beiden, 2/2)
- [ ] `mehrdeutigkeits_architektur.trade_off_raum` >= 2 Eintraege
- [ ] `persona_pool_units` **2+2 (>=2 Abteilungen, EBA-Berufe, LJ1-2)**, `persona_pool_kn_neu` 2+2, disjunkt
- [ ] `hybrid_situation_spec` ausgefuellt, `must_combine_herausforderungen: ["A","B"]`
- [ ] `quellen_anker.dossier_nuggets` statt chapters; keine Eszett

### Jede Herausforderung (Renderer-Compliance):
- [ ] `template == "default_4page_v2"`, **kein `wochen`-Feld** (`wochen_plan: []`), `legacy/source_refs/registry_tags == {}`
- [ ] `lehrgang: "EBA_2J"`, `buchstabe` ∈ {A, B}, `sit_farbe` rot/blau
- [ ] `modul_titel`, `wissensknoten[0]`, `zahlen_tabelle`, `leitfrage`, `leitfragen_intro` (Sie-Form + Dossier) gesetzt
- [ ] `nrlp.gesellschaft` als Array of `{aspekt, iteration}`
- [ ] `nrlp.nr_primary` enthält alle real abgedeckten Kompetenzen (Default Primär; Sekundär nur nach Pietro-Bestätigung) — B1
- [ ] `leitfragen[]` 4 Items, bloom Verstehen/Verstehen/Anwenden/Entscheiden, `knoten_ref` = „Dossier | Info-Karte {LETTER}-NN", `feld_hoehe_mm: 15`
- [ ] **Begriffs-Test bestanden (F2):** kein einzelner Begriff loest die Herausforderung; Herausforderung sitzt auf der Problem-/Sprachebene
- [ ] **Alle LF sind Taetigkeiten (F3):** keine reine Wissenswiedergabe; K2 = «Tun mit Material»
- [ ] `mindmap_zentrum` / `mindmap_aeste` flat; `mindmap_aeste` 4 Items, Ast 4 `optional: true`
- [ ] `handlungsprodukt.{format, titel, format_detail, beschreibung, schritte (5 Objekte), schreib_label, schreib_note}`
- [ ] `reflexion_fragen` 3 Items, je `{nr (str), text, sub: null, feld_hoehe_mm: 10}`
- [ ] `bewertungsraster` 4 Items, je mit `vollstaendig_wenn` (2-4 Bullets), keine Transfer-Zeile (C1)
- [ ] `handlungsprodukt.scaffolding` {satzanfaenge, strategien, struktur} je **>=2** Eintraege (EBA, Check 23); `nrlp.sprachmodus_ids`-Paritaet zu `sprachmodi`
- [ ] **A2-Check bestanden** (jeder Satz <= 18 W., Fachbegriffe nur mit Dossier-Glossar)
- [ ] **Keine** `gruppenpuzzle_fragen` / `vorgespraech_fragen`, kein neu generiertes `emotion_tag`

### Jede Herausforderung (Prinzip-First + additiv):
- [ ] `prinzip_ref` matched
- [ ] `herausforderung.label === prinzip.herausforderungen[buchstabe].herausforderung`
- [ ] `mehrdeutigkeit.trade_off ∈ prinzip.mehrdeutigkeits_architektur.trade_off_raum`
- [ ] `dekontextualisierung.ziel` ∈ Bezug zu prinzip.dekontextualisierungs_anker
- [ ] `prinzip_handoff.{kernkonzept, dossier_anker, kn_aktivierung, transfer_check}` ausgefuellt
- [ ] `sk_anker.length === nrlp.sk.length`, jeder mit `wo` befuellt
- [ ] `lehrgang == "EBA_2J"`
- [ ] Mind. eine LF auf K3 (LF3/LF4)

### Set-Dokument:
- [ ] `id`, `prinzip_ref`, `kn_ref`, `herausforderungen[]` (**2**) gesetzt, `lehrgang: "EBA_2J"`
- [ ] `konzept_progression[]` **2 Eintraege** mit konkreten konzept-Werten aus prinzip_handoff
- [ ] `austausch_phase` template-konstant, **Sie-Form/A2**, drei Schluss-Varianten (`einzelauftrag` / `gruppenarbeit_jigsaw` / `einzelarbeit_plenum`), `dekontextualisierungs_aufgabe.ziel` aus prinzip-Anker, „Begriffe aus dem Dossier"

### KN-Dokument:
- [ ] `id`, `set_ref`, `prinzip_ref`, `anchored_situations[]` (**2**), `lehrgang: "EBA_2J"`
- [ ] `dominanter_aspekt` bestimmt, Kriterium-3-Wording angepasst
- [ ] `hybrid_situation.text` <= 120 Woerter, ICH, **A2**, Persona disjunkt von sit_*.persona (LJ1-2)
- [ ] `hybrid_situation.aktivierte_trade_offs.length >= 1`, alle ∈ trade_off_raum
- [ ] `hybrid_situation.alignment_note.herausforderungen_mapping` **2 Eintraege (A/B)**
- [ ] `kn_typen[]` GENAU 3 (fachgespraech [Primaerform], mini_case_schriftlich, werkschau_transfer)
- [ ] **Fachgespraech 5 Fragen K2→K2→K3→K3→K3** (K-Decke K3)
- [ ] **Mini Case 4 Aufgaben K2→K2→K3→K3** (30-40 Min., Scaffold im Blatt)
- [ ] **Werkschau Reflexion 120-150 W.**, 3 Reflexionsfragen, eines von **beiden** Handlungsprodukten
- [ ] `rubrik_shared.kriterien.length === 4`: SuK = **Fachkorrektheit + Argumentation** (Konventionen + Sprachbewusstheit integriert, keine Normen), Ges = aspekt-Prinzip + Position/Werthaltung
- [ ] Niveaubaender unter 60 / 80 / 100 % (Daten in kn.json; in SuS-Renders als Wort-Labels, Prozente nur im LP-Material)
- [ ] Checks 10-13 alle gruen; KN-Ablauf sagt „Dossier erlaubt, kein Internet"

### Dossier-Dokument (NEU, EBA-only):
- [ ] `id`, `set_ref`, `lehrgang: "EBA_2J"`, `sprachniveau: "A2"`, `template: "dossier_eba_v1"`
- [ ] Pro Herausforderung A/B >=2-3 Nuggets, jede Leitfrage gedeckt (`fuer_leitfrage`)
- [ ] `sprachmodi_scaffolds` je Herausforderung am Output-`sm_id` mit `so_gehst_du_vor`
- [ ] `transfer_wissensblatt` (fachsystematik + prinzip_in_einfach + austausch_scaffolds)
- [ ] Glossar deckt jeden in Nuggets verwendeten Fachbegriff
- [ ] **Wissen↔KN-Alignment**: jede Leitfrage + jeder KN-Anspruch gedeckt (kein `ERR_DOSSIER_GAP`)
- [ ] **Fakten-Validierung**: jeder `fakten_anker` `validiert:true` ODER `lp_pruefen:true`
- [ ] A2-Check bestanden auf allen Prosa-Feldern

### Begleiter-Dokument:
- [ ] Frontmatter vollstaendig (titel, kompetenz, autor, stand, lehrgang, thema, lebensbezug, quellen_json inkl. `dossier.json`, **kein** herausforderung_C)
- [ ] Sektionen 0–8 + Sektion 8.5 + Kurzsektion „Wissens-Dossier (A2)" vorhanden; **kein Anhang-Kapitel** (Spec TEIL 8.3 — entfaellt; EBA-Pflichtsektionen bleiben)
- [ ] Sektion 1 enthaelt **Kapitel 1.6 KI-Einsatz** (Einheits-Uebersicht, `[!ki_einsatz]`, A2-niedrigschwellig, Empfehlung-Rahmung, kein KI-Fluency-Verweis; §E5)
- [ ] Pro Herausforderung (A/B): Steckbrief, Herausforderungs-Zitat, Unterrichtsfahrplan, 4 LF-Coaching-Blöcke, Scaffold, Mehrdeutigkeit-Callout, SK-Tabelle
- [ ] Pro Herausforderung (A/B) die **4 v2-Bausteine** an korrekter Position: `[!tafelbild]` (vor Scaffold, §E4) · «Wann ist das Produkt fertig?»-Haken-Liste **ohne Prozente** (nach Scaffold, §E2) · `[!ki_einsatz]` A2-nah (nach Check, §E5) · genau ein `[!troubleshooting]` im Leitfragen-Block (§E3)
- [ ] Mind. 1 fertiger Scaffold (Lueckentext, Tabelle oder Drehbuch) pro Herausforderung
- [ ] KN-Sektion: Alignment-Tabelle, alle 3 Methoden-Karten, bi-dim Rubrik, **`[!erwartungshorizont]` je Prueffrage** (§E1; EBA-Decke K3: K2-Fragen «vollstaendig vs. lueckenhaft», K3-Fragen Dreizeiler)
- [ ] KN-Rubrik: Stufenskala **1–4** (1 = tiefste), Niveaubaender **unter 60 / 80 / 100 %** (Spec TEIL 8.2; Prozente nur LP-seitig)
- [ ] Pro Herausforderung: gebuendelter „Coaching & Scaffolds — auf einen Blick"-Abschnitt + `[!coaching] Perspektivenwechsel`-Callout (Cluster 5, LP-only)
- [ ] KN-Sektion: `[!hinweis] Ausblick`-Methodenvielfalt vorhanden (Critical Incident / Produkt mit Praesentation; Cluster 5)
- [ ] Alle Callouts typisiert; 10 erlaubte Typen (Basis: lernziel/hinweis/beispiel/warnung/reflexion/coaching/mehrdeutigkeit/differenzieren · v2: erwartungshorizont/troubleshooting/tafelbild/ki_einsatz)
- [ ] Echte Umlaute in allen Prosa-Abschnitten (kein ae/oe/ue in sichtbarem Markdown)

### Frontend-Prosa (Umlaut-Regel + A2 — Pflicht ueber alle 8 Dateien):
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

### B) Phase 0 — nRLP-Quelle: immer `nrlp_2j.json`

**Diese Skill hat keinen Lehrgang-Switch.** Sie erzeugt ausschliesslich EBA-Sets
(`lehrgang: "EBA_2J"`), und die nRLP-Quelle ist deshalb immer und ohne Ausnahme
**`public/nrlp_2j.json`** — genau wie in Phase 0 Step 0 beschrieben.

> Frueher stand hier die Lehrgang-Switch-Regel der 3er-Skill (`EFZ_3J` →
> `nrlp_3j.json`, `EFZ_4J` → `nrlp_4j.json`, `EBA_2J` → `nrlp_2j.json`), aus der
> das Reform-Addendum uebernommen wurde. Sie war fuer diese Skill falsch und
> widersprach Phase 0: EBA nummeriert eigenstaendig, und ein `X.Y.Z` aus dem
> EBA-Lehrplan bedeutet in `nrlp_3j.json`/`nrlp_4j.json` etwas anderes. Ein
> EFZ-Set gehoert in die Skill `bbw-hko-3er-set`, nicht hierher.

Alle drei Datensaetze liegen nativ im bbw-hko-Repo unter `public/`; fuer diese
Skill ist nur `nrlp_2j.json` relevant.

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
- Artikel/Pronomen bleiben unveraendert (Gendern nur auf Substantiv-Ebene), z.B. `dein Berufsbildner/in`, `des Berufsbildner/in`.
- Kuratierte Mapping-Liste + Anwendungsregeln: `references/language-rules.md` §2b.

### I) Cluster 6 — Handlungsprodukt-Klarheit

**`handlungsprodukt.abgaben[]` (additiv):** Pro Herausforderung 1-3 Klartext-Strings, je eine konkrete Abgabe — z.B. `["Kanalbegründung (80–120 Wörter)", "Schreiben im gewählten Kanal (200–250 Wörter)"]`. DocS rendert daraus den deutlich abgesetzten **"Das lieferst du ab"-Block** (Callout am Anfang des Handlungsprodukt-Abschnitts; in der DOCX gespiegelt). Bei mehrteiligem Produkt jede Teil-Abgabe einzeln. Native Umlaute, en-dash fuer Ranges. Siehe `references/json-field-mapping.md`.

**Begleiter (Phase 5) — zwei LP-Hinweise:**
- **Reihenfolge frei** (Sektion Durchfuehrungs-Varianten + DocKnLp-Konzeptbogen): Ein Satz, dass der Konzeptbogen A → B → C den inhaltlichen Aufbau zeigt, nicht eine zwingende Unterrichtssequenz — Herausforderungen koennen weggelassen oder umgestellt werden; im KN wird nur geprueft, was geuebt wurde.
- **Uebe-Hinweis** (Sektion 0 „So funktioniert diese Einheit"): Das Material ist Starthilfe (~80 %), nicht Vollprogramm; die fachlichen Grundlagen uebt die LP **vorab im Unterricht**, die Herausforderungsblaetter setzen das Vorwissen voraus.

### J) Cluster 5 — Didaktik-Hinweise, Coaching & Scaffolds, Methoden-Ausblick (LP-only)

Gute Inhalte sind vorhanden, gehen aber unter — vor allem im Begleiter. **Sichtbarkeit erhoehen, Inhalt nicht neu erfinden.** Alle Punkte sind LP-only (Begleitdokument + DocKnLp), nie SuS.

**Render (`begleiter-builder.ts`):** Die Callout-Typen `coaching` und `differenzieren` bekommen extra visuelles Gewicht — farbiges Header-Band (Label weiss auf Rahmenfarbe) + Box-Rahmen statt des leichteren Links-Rand-Stils der uebrigen Callouts (`EMPHASIS_CALLOUTS`). Gilt automatisch fuer alle Einheiten.

**Begleiter (Phase 5) — drei Ergaenzungen:**
- **Coaching & Scaffolds — gebuendelt** (pro Herausforderung, Sektionen 3-5 Punkt 9): Am Ende jeder Herausforderung ein Abschnitt `### Coaching & Scaffolds — auf einen Blick`, der die schon vorhandenen Coaching-Moves + Scaffolds als Schnell-Referenz sammelt: `[!coaching] Die drei Moves dieser Herausforderung` (LF-Moves als nummerierte Kurzliste) + Zeile „Zum Abgeben bereit:" mit den Scaffold-Namen. Buendelt nur, erfindet nichts.
- **Perspektivenwechsel** (pro Herausforderung): direkt danach ein `[!coaching] Perspektivenwechsel`-Callout mit einem konkreten, auf den Konflikt der Herausforderung bezogenen Perspektivenuebernahme-Move (Sicht der Gegenseite zuerst einnehmen), begruendet ueber den situationsspezifischen Trade-off bzw. die aktivierte SK (oft SK7).
- **Methodenvielfalt-Ausblick** (Sektion 8, KN): nach der Methodenwahl-Tabelle ein `[!hinweis] Ausblick — weitere Pruefformen moeglich`: die 3 KN-Typen (Fachgespraech / Mini Case schriftlich / Werkschau + Transfer) sind ein Startset; weitere Formen (Critical Incident, Produkt mit Praesentation) tragen dieselbe Hybrid-Herausforderung und dieselbe Rubrik, sind aber noch nicht ausgearbeitet. Reiner Text, keine Funktion.

**WhatsApp-Beispiel bleibt** (Herausforderung B, Kanalwahl): legitime Kanalwahl-Uebung, kein Eingriff — bewusst dokumentiert, damit es niemand „bereinigt".

## References

- `references/prinzip-architecture.md` — Phase 0.5 Design-Regeln (+ §10 EBA-Override)
- `references/kn-architecture.md` — Phase 4 Design-Regeln (Hybrid + 3 KN-Typen + Rubrik; + §10 EBA-Override)
- `references/json-field-mapping.md` — Feld-fuer-Feld Mapping (+ §6 EBA + §7 Dossier)
- `references/coherence-checklist.md` — Checks + EBA-Kalibrierung + 3 neue Checks (A2 / Wissen↔KN / Fakten)
- `references/dossier-architecture.md` — **NEU:** Dossier-Generierung + Web-Validierung + Alignment (EBA-only)
- `references/a2-language-rules.md` — **NEU:** A2-Regelliste + Beispiele, ERR-Gate (EBA-only)
- `references/_common_misspellings.md` — Bekannte Spell-Halluzinationen, Pre-Write-Check-Liste
- `references/hko-framework.md` — 12 SK, 9 Sprachmodi, 8 Aspekte, Bloom, bi-dim Rubric (+ §13 EBA-Spezifika)
- `references/language-rules.md` — Swiss German, ICH-Perspektive, verbotene Phrasen
- `references/_migration_notes.md` — 5er → 3er → 2er-EBA Delta-Doku
- `references/sprachmodus-ids.md` — kanonische SM1-SM9 Nummerierung (Cluster 1)
- `references/sprachfoerderung-methoden.md` — Methoden je Sprachmodus, LP-Abschnitt (Cluster 3, ENTWURF)
- `references/system-overview.md`, `references/system-data.md` — Cross-Repo System-Doku + Render-Felder
- `assets/prinzip-template.json`, `assets/mission-template.json`, `assets/set-template.json`, `assets/kn-template.json`, `assets/dossier-template.json` — Schema-Wahrheit
