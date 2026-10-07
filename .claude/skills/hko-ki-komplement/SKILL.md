---
name: hko-ki-komplement
description: "Native bbw-hko skill: erzeugt KOMPLEMENTÄR zu einer bereits fertigen /einheiten-Unit die KI-Toolbox-Dokumente (2+1+1) plus den didaktischen KI-Liesmich — 2 KI-Aufträge (ki.json), 1 KI-Lernprompt (lernprompt.json), 1 KI-Lernbegleiter (lernbegleiter.json) und 1 KI-Toolbox-Liesmich für die Lehrperson (ki-liesmich.md) — und schreibt sie in denselben src/data/einheiten/{X.Y.Z}_{slug}/ Ordner. Versteht alle drei Einheitsformate: v4.2 (zwei Hefte A/B, Template heft_8page_v42 — Standard), das alte 3er-Set (A/B/C) und EBA (A/B + Dossier). Sie LIEST die bestehenden prinzip.json + kn.json + set.json + herausforderung_A/B(/C).json und ändert sie nie. Schreibt seit Oktober 2026 die kleine Fassung als Vorgabe (Basis: fertige Prompts, einfache Sprache, B1-Gate für EFZ) und das Anspruchsvolle als Plus. Use whenever Pietro nach einer fertigen Einheit die KI-Schicht will: 'generiere die KI-Aufträge', 'ki-komplement für 1.1.1', 'KI-Toolbox für diese Einheit', 'mach den Lernbegleiter', 'KI-Liesmich', 'KI-Dokumente zur Unit'. Triggert auf KI/AI-Fluency/Lernprompt/Lernbegleiter/Liesmich + ein bestehender Einheiten-Slug. bbw-hko ONLY — schreibt nur ki/lernprompt/lernbegleiter/ki-liesmich, nie nach hko-deploy. Form der Dateien: assets/*.json."
---

# hko-ki-komplement — KI-Toolbox (2+1+1) komplementär zu einer fertigen Einheit

Diese Skill ist die **Per-Unit-Ergänzung** zum KI-Toolbox-Renderer (Teil A, bereits
in bbw-hko verbaut). Sie läuft **nachdem** eine Einheit erzeugt wurde (durch
`bbw-hko-heft-v42` — Standard seit Oktober 2026 —, `bbw-hko-3er-set` oder
`hko-2er-EBA-set-generator`) und produziert die drei learner-facing KI-Dokumente,
die der `EinheitWorkbench` unter «KI-Toolbox» rendert und ins ZIP packt.

**Drei Formate, ein Output-Vertrag.** Was die Skill schreibt, hat in jedem Format
dieselbe Form (`assets/*.json`) — der Renderer kennt keinen Unterschied. Was sie
**liest**, hängt vom Format ab; das entscheidet Phase 0 an
`herausforderung_A.template` und `prinzip.lehrgang`:

| Format | Erkennung | Lesen | Eigene Regeln |
|---|---|---|---|
| **v4.2** (Standard) | `template: "heft_8page_v42"` | zwei Hefte A/B (nur der Kern), `set.gemeinsamer_auftrag`, `set.glossar` | Abschnitt «v4.2-Regeln» |
| 3er-Set | anderes Template, `lehrgang` EFZ | drei Herausforderungen A/B/C | — (wie bisher) |
| EBA | `lehrgang: "EBA_2J"` | A/B + `dossier.json` | Abschnitt «EBA-A2-Pre-Write-Gate» |

Portiert von hko-deploys `hko-3er-to-praxis` (Phase 5 KI-Set + Phase 8 Lernprompt),
mit einem **bbw-hko-Input-Adapter**, einem **4. Dokument (Lernbegleiter)** und einem
**5. Dokument: dem KI-Liesmich** (`ki-liesmich.md`) — ein teacher-facing didaktischer
Kompass, den die Skill **am Schluss aus dem, was sie selbst erzeugt hat**, ableitet.

---

## Scope (hart)

- **Schreibt ausschliesslich** nach `bbw-hko/src/data/einheiten/{X.Y.Z}_{slug}/`:
  `ki.json`, `lernprompt.json`, `lernbegleiter.json`, `ki-liesmich.md`.
- **Liest** (nie verändern!) im selben Ordner: `prinzip.json`, `kn.json`,
  `set.json`, `herausforderung_A.json`, `herausforderung_B.json` und — nur im
  3er-Format — `herausforderung_C.json`. v4.2 und EBA haben **zwei**
  Herausforderungen; ein fehlendes C ist dort kein Fehler (siehe Adapter). Bei
  EBA dazu ggf. `dossier.json`.
- **Niemals** nach hko-deploy, nie an die Renderer-Komponenten, nie an bestehende
  Unit-Dateien — auch nicht an `set.json` (Sichtbarkeit setzt Pietro, siehe
  Phase 5), nicht an Quellenkarten, nicht ans Quellenarchiv.

## Output-Vertrag (= was der Renderer frisst)

Die drei **JSON**-Dateien müssen **exakt** den Shapes in `assets/*.json` entsprechen
— das ist der bestätigte Renderer-Vertrag (`DocKi`/`DocLernprompt`/`DocLernbegleiter`,
`loadEinheit`, `build-einheiten-index`). **Für die Form gelten `assets/*.json`**,
nicht eine einzelne Einheit. Jede Toolbox wird aus den Regeln und aus der eigenen
Einheit geschrieben — **kein Wortlaut aus einer anderen Toolbox** (auch nicht aus
dem Pilot `1.3.1_konsum_verantworten_v42`; er kennt die Regeln vom 07.10.2026 noch
nicht, `basis-plus.md` §7).

**Vertragsfeld `lehrgang` (verbindlich, alle drei JSON-Dateien).** `ki.json`,
`lernprompt.json` und `lernbegleiter.json` tragen **immer** ein **Top-Level**-Feld
`"lehrgang"`; der Wert wird unverändert aus `prinzip.lehrgang` übernommen
(`"EFZ_3J"`, `"EFZ_4J"`, `"EBA_2J"`). Die Renderer `DocKi`, `DocLernprompt` und
`DocLernbegleiter` leiten daraus die **EBA-Typografie** ab (`lehrgang === "EBA_2J"`
→ Klasse `doc-eba`). Fehlt das Feld, rendert eine EBA-Unit stillschweigend im
EFZ-Satzbild — der Fehler ist unsichtbar, darum ist das Feld Pflicht, nicht
optional. Es steht bei den übrigen Meta-Feldern (`version`, `erstellt_am`), siehe
`assets/*.json`.

Die vierte Datei `ki-liesmich.md` ist **kein** Renderer-JSON, sondern **Markdown
mit YAML-Frontmatter** — sie läuft durch dieselbe «Lies mich!»-Pipeline wie
`begleiter.md` (Route `einheiten/[setKey]/ki-liesmich.astro`, Word-Export
`api/einheit-ki-liesmich-docx`, ZIP via `buildBegleiterDocx`). Erlaubte Callouts =
exakt die acht der Begleiter-Pipeline: `lernziel, hinweis, beispiel, warnung,
reflexion, coaching, mehrdeutigkeit, differenzieren` (KEINE anderen, sonst werden
sie nicht gerendert). **Gerüst:** `assets/ki-liesmich-template.md`.

## Basis und Plus (alle Formate) — die kleine Fassung ist die Vorgabe

Rückmeldung der Lehrpersonen (Oktober 2026): Die Toolbox ist für die Lernenden zu
schwer — in der Sprache und in der Menge je Dokument. Darum gilt für **jede** neu
erzeugte Toolbox `references/basis-plus.md`:

1. **Fertige Prompts statt Prompts bauen** — höchstens eine Lücke für den eigenen Text.
2. **Jeder Prompt endet mit einer Sprachzeile**, die der KI einfache, kurze Antworten
   und eine Frage aufs Mal vorschreibt.
3. **Andocken:** Die Basis arbeitet nur mit den Begriffen, dem eigenen Produkt und
   den Kriterien der Einheit — kein neuer Fall, kein neues Kriterium.
4. **Basis zuerst, Plus daneben:** `ki_1` ist der Basis-Auftrag (zwei Seiten), `ki_2`
   der Plus-Auftrag; im Lernprompt sind Technik 1 + 2 Basis (Seite 1), im
   Lernbegleiter Karte 1 + 2 und die KN-Seite (Seiten 1-2). Alle drei JSON-Dateien
   tragen `"version": "2.0.0"`. Anzahl, Reihenfolge und Länge je
   Feld stehen in `basis-plus.md` §3-§5 → Checks **BP1-BP7**.
5. **Die KI kennt die Einheit nicht** (`basis-plus.md` §1 Nr. 5): Thema im Prompt,
   wo die KI abfragt, beurteilt oder einen Fall erfindet; die Karte sagt, womit die
   Lernenden die Antwort der KI vergleichen (Glossar, Lehrmittel, Dossier) — das
   Heft gilt, nicht die KI; kein Kriterium nur als Name; die KI liefert keinen
   Stoff. → Check **BP8**.
6. **Der Basis-Auftrag passt zusammen** (`basis-plus.md` §3 «Aufbau»): Prompt 1
   stellt drei Fragen, Prompt 2 («nach der dritten Frage») zeigt auf die schwächste
   Antwort und liefert keinen Inhalt, Schritt 2 und 3 nennen die Prompts, das
   Kriterium «Nachgeschlagen» ist auch erfüllbar, wenn die KI nur gefragt hat.
   → Check **BP9**.

Punkt 5 und 6 und die feste Sprachzeile stammen aus dem Sondenlauf vom 07.10.2026
(`docs/cloud-run/laeufe/2026-10-07-ki-toolbox-lehrjahr-1/BERICHT.md` §4): Drei
Gegenleser fanden unabhängig dieselben Mängel in drei Toolboxen.

Dazu das **B1-Sprach-Gate für EFZ** (`references/b1-language-rules.md`): gezählte
Regeln wie beim A2-Gate — längster Satz 22 Wörter, ein Auftrag je Satz, ein Schritt
ein Satz, Fachbegriffe nur mit Deckung, Sperrwörter der Didaktik. Es läuft vor
jedem Write eines Felds für Lernende in Phase 2, 3 und 4. EBA behält das strengere
A2-Gate.

## Namen der KN-Formen — nie in einem Text für Lernende

**«Mini Case», «Mini Case schriftlich», «Werkschau», «Werkschau +
Transfer-Reflexion» und «Transfer-Reflexion» stehen in keinem Feld, das Lernende
lesen.** Es sind Begriffe der Lehrperson. Das gilt für `ki.json`,
`lernprompt.json` und `lernbegleiter.json` — für jeden Auftrag, jede
Reflexionsfrage, jeden Prompt, jede Karte, jeden `uebungsfokus`.

| Statt | Schreiben |
|---|---|
| «Im Mini Case schriftlich …» | «Im schriftlichen Kompetenznachweis …», «Wenn Sie einen neuen Fall schriftlich lösen …» |
| «In der Werkschau …», «in der Transfer-Reflexion …» | «Wenn Sie Ihre Arbeiten zeigen und erklären …», «Wenn Sie Ihr Prinzip auf einen neuen Fall übertragen …» |
| «Im Fachgespräch …» | bleibt — das Wort kennen Lernende aus der Lehre (EBA: «Kurzgespräch») |

Zwei Stellen tragen die Namen trotzdem, und das ist richtig so:
`lernbegleiter.kn_typ_tracks[].label` steht wörtlich wie in `kn.json` (Vertrag,
Check L1) — der Renderer druckt es nicht, sondern «Schriftliche Aufgabe zu einem
neuen Fall» bzw. «Eigene Arbeiten zeigen und erklären». Und `ki-liesmich.md`
spricht zur Lehrperson und darf die Formen beim Namen nennen.

→ Check `KN_NAME`; `scripts/check-ki-toolbox.mjs` meldet jeden Treffer als
`ERR_B1_SPERRWORT`.

## Verbindliche Sprachregeln

Echte Umlaute `ä/ö/ü` in sichtbarer Prosa; `ae/oe/ue` nur in IDs/Keys/Filenames;
**kein `ß`** (→ `ss`). Gendern in Schrägstrich-Ein-Wort-Form
(`Berufsbildner/in`, `Lernende/r`). Details: `references/language-rules.md`.
Pre-Write-Scan auf `ß` und Transliteration in Prosa.

---

## Phasen-Workflow

```
PHASE 0   Input laden + Adapter        → Scoring-Inputs + KN-Transfer-Prinzip   [Confirm]
PHASE 1   KI-Pattern-Scoring 7 → 2     → 1 Basis + 1 Plus, Teacher-Preview      [STOP kurz]
PHASE 2   ki.json (Basis + Plus)       → KN-Brücke in der letzten Reflexion (>=1 Auftrag)
PHASE 3   lernprompt.json (4 von 6)    → Technik 1+2 Basis, 3+4 Plus
PHASE 4   lernbegleiter.json           → Karte 1+2 Basis, 3-5 Plus; L1-L3 + Integritäts-Leitplanke
PHASE 4b  ki-liesmich.md (NEU)         → Selbst-Review der 4 Docs → Lehrer-Liesmich
PHASE 5   Validierung + Index          → Checks, dann build:einheiten-index-Hinweis
```

> **Sprach-Gate (global):** Bei `EFZ_3J` / `EFZ_4J` läuft vor JEDEM Write eines
> SuS-gerichteten Prosa-Felds in Phase 2, 3 und 4 der B1-Scan gegen
> `references/b1-language-rules.md`; die `ERR_B1_*`-Codes blockieren den Write. Bei
> EBA tritt an seine Stelle das A2-Gate. In allen Formaten laufen dazu die Checks
> BP1-BP9 (`references/basis-plus.md`). Phase 4b ist von beidem ausgenommen.
>
> **EBA-A2-Gate (global, nur bei `lehrgang: "EBA_2J"`):** Vor JEDEM Write eines
> SuS-gerichteten Prosa-Felds in Phase 2, 3 und 4 läuft der A2-Pre-Write-Scan gegen
> `.claude/skills/hko-2er-EBA-set-generator/references/a2-language-rules.md` (analog
> zum Umlaut/Eszett-Scan). `ERR_A2_SATZ_ZU_LANG` und `ERR_A2_BEGRIFF_OHNE_GLOSSAR`
> blockieren den Write, bis behoben. **Phase 4b (`ki-liesmich.md`) ist ausgenommen**
> — der Liesmich ist teacher-facing. Details: Abschnitt «EBA-A2-Pre-Write-Gate».

### PHASE 0 — Input laden + Adapter

Read `references/input-adapter.md`. Slug `{X.Y.Z}_{slug}` bestimmen, **Format
bestimmen** (v4.2 / 3er-Set / EBA, Adapter §0), die 5-6 Unit-Dateien laden, daraus
die Generierungs-Inputs ableiten. Bei v4.2 zusätzlich Adapter §2b lesen (Kern statt
Spur, Glossar, gemeinsamer Auftrag, Fall-Ausschluss) und
`.claude/skills/bbw-hko-heft-v42/references/sprache.md` §1-§8.

| Input | Quelle in bbw-hko |
|---|---|
| `sk_targets` | `prinzip.sk_schnittmenge_kn.primary` |
| `aspekte` | Keys von `prinzip.aspekte` |
| Handlungsprodukt-Typen | `herausforderung_{A,B[,C]}.handlungsprodukt` (+ `prinzip.herausforderungen[X].handlungsprodukt_typ`) — nur vorhandene Buchstaben |
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

Confirm-Block ausgeben (Slug, **Format**, sk_targets, aspekte, KN-Typen,
Transfer-Prinzip in 1 Satz; bei v4.2 dazu die Liste des Fall-Ausschlusses). Bei
fehlenden Inputs `ERR_INPUTS` + auflisten, was fehlt.

### PHASE 1 — KI-Pattern-Scoring (7 → 2)

Read `references/ki-scoring.md`. **Genau 2** Muster wählen: `ki_1` (Basis) ist
**fest** `ai_lernassistent` — `ai_entscheidungscoach` nur, wenn ein Handlungsprodukt
wörtlich ein Entscheid ist (Probe in `ki-scoring.md`); gescort werden nur die fünf
Plus-Muster, `ki_2` = das bestbewertete (Minimum 30 sonst flaggen;
«schriftlich-formell» nach der Liste dort). Teacher-Preview:

```
KI-Toolbox für: {slug}
Basis  {pattern_1}  (fest) — {grund}
Plus   {pattern_2}  (Score {s2}) — {grund}
Bestätigen? [j / ändern]
```

### PHASE 2 — ki.json (1 Basis-Auftrag + 1 Plus-Auftrag)

Read `references/ki-architecture.md` + `references/basis-plus.md` §3 +
`assets/ki-template.json`. Pro Auftrag: `pattern, titel, ziel, bezug, auftrag,
prompt_strategie, ki_frei_vorher, schritte, guetekriterien[{kriterium,indikator}],
reflexion`. Anzahl je Feld: `ki_1` (Basis) 3 Prompt-Zeilen · 3 Schritte ·
3 Kriterien · 2 Reflexionen; `ki_2` (Plus) 3-4 · 4-5 · 3-4 · 3. Set-Level:
`nrlp_anker` + `ki_leitfragen` + `lehrgang` (Top-Level, verbatim aus
`prinzip.lehrgang`) aus dem Adapter.

- **EBA-A2-Gate (nur `lehrgang: "EBA_2J"`, blockierend):** `ziel`, `auftrag`,
  `schritte[]`, `reflexion[]` und `guetekriterien[]` sind SuS-gerichtet und laufen
  vor dem Write durch den A2-Scan (siehe Abschnitt «EBA-A2-Pre-Write-Gate»).
- **Check P6:** `bezug` jedes Auftrags nennt **alle** vorhandenen Herausforderungen
  (A/B/C im 3er-Set, A/B bei v4.2 und EBA) **und** das Transfer-Prinzip. Bei v4.2
  heissen sie im Text «Heft A» und «Heft B».
- **`anchored_situations`** = `kn.anchored_situations` verbatim (bei v4.2 und EBA
  zwei IDs — der `_hf_C`-Eintrag des Templates entfällt). **`timing`** nach Format:
  Adapter §2c.
- **Check P5:** je >=3 `guetekriterien`, eines prüft IMMER die **Verifikation**
  (jede KI-Quelle/jeder Rechtssatz nachgeschlagen).
- **KN-Brücke (Pietro-Erweiterung, verbindlich):** Bei **mindestens einem** der
  zwei Aufträge rahmt die **letzte** Reflexionsfrage den Transfer explizit als
  Brücke zum **KN** — **ohne eine KN-Form zu nennen**: «Im Kompetenznachweis
  begründen Sie … ohne KI. Was aus dieser Übung nehmen Sie mit?» Welche Form die
  Klasse bekommt, wählt die Lehrperson; «Im Fachgespräch …» steht nur, wenn
  `kn.kn_typen` genau eine Form hat. Der Name einer KN-Form steht nie da: «Mini
  Case schriftlich» und «Werkschau + Transfer-Reflexion» sind Begriffe der
  Lehrperson und Sperrwörter (`b1-language-rules.md` §4). Die Frage greift auf, was
  der Auftrag geübt hat. → Check `KN_BRIDGE`.
- **AI-Fluency, keine Produktions-Abkürzung:** die KI prüft/challengt/spiegelt das
  Unit-Produkt, ersetzt es nie. `ki_frei_vorher` ist Pflicht.
- **Basis-Auftrag (`ki_1`):** Die KI stellt Fragen zum **eigenen** Produkt bzw. zur
  eigenen Entscheidung der Lernenden; die Lernenden beurteilen in diesem Auftrag
  nicht die KI. Beide Prompts sind fertig (Sprachzeile, höchstens eine Lücke).
  Aufbau nach `basis-plus.md` §3 «Aufbau» (drei Fragen · «Prompt 2, nach der
  dritten Frage:» · Schritte nennen die Prompts · «Prüfen» bedingt und mit Ort)
  → Check **BP9**.
- **Ein Gegenstand, ein Wort; «jede» und «mindestens eine» nie gemischt.** `ziel`,
  Prompts, Schritte, Kriterien und Reflexion eines Auftrags reden vom selben
  Gegenstand mit demselben Wort, und sie nennen dieselbe Menge beim Nachschlagen.
  Kein Prompt lässt die KI liefern, was ein Kriterium den Lernenden zuschreibt.
- **`nrlp_anker.thema_text` ohne Code** («T1 —»): Der Word-Export druckt das Feld.

### PHASE 3 — lernprompt.json (4 von 6 Techniken)

Read `references/lernprompt-techniken.md` + `references/basis-plus.md` §4 +
`assets/lernprompt-template.json`.
Dazu **`beispiel_dialog`** (`frage` · `antwort` · `pruefung`): ein kurzer Verlauf mit
genau einem prüfbaren Fehler der KI — `basis-plus.md` §4.
`titel` jeder Technik wörtlich aus der Titelliste in `lernprompt-techniken.md`
(«Der KI eine Rolle geben», «Kontext geben», …) — in jeder Einheit gleich.
Immer `rollen_prompting` + `kontextualisieren` an erster und zweiter Stelle
(**Basis**: ohne `beispiel_fortgeschritten`, ohne `baukasten`); +2 nach den
Signalregeln (SK/Aspekt/Produkt) als **Plus** mit vollem Block.
`stacking_seite_1` (Technik 1+2) +
`stacking_seite_2` (Technik 3+4; `prompt_2` baut explizit auf `prompt_1` auf) +
`prompt_vorlage`. `erklaerung` ohne Beispiele; `thema_bezug`/`warnung`
unit-spezifisch. Top-Level `lehrgang` (verbatim aus `prinzip.lehrgang`) setzen.
Seite 1 ist eng: die **Richtwerte** in `basis-plus.md` §4 einhalten, nicht nur die
Grenzen. Im Beispiel-Verlauf stehen Zahlen wie im Heft, und die `pruefung` nennt
jede Angabe der `antwort`.

- **EBA-A2-Gate (nur `lehrgang: "EBA_2J"`, blockierend):** sämtliche Prompts
  (`beispiel_basis`, `beispiel_fortgeschritten`, `baukasten.*`, `stacking_seite_1/2.
  prompt_1/prompt_2`, `prompt_vorlage`) **und** jede `erklaerung` laufen vor dem
  Write durch den A2-Scan (siehe Abschnitt «EBA-A2-Pre-Write-Gate»).

### PHASE 4 — lernbegleiter.json (learner-facing KN-Vorbereitung)

Read `references/lernbegleiter-architecture.md` + `references/basis-plus.md` §5 +
`assets/lernbegleiter-template.json`.
Blöcke: `titel, ziel, kompetenzversprechen` (verbatim), `ki_frei_zuerst`
(`selbsteinschaetzung[]` aus den Teilen des Kompetenzversprechens), **`begriffe[]`**
(die Begriffe der Einheit zum Abhaken — bei v4.2 alle Glossarbegriffe ohne `spur`),
`strategie_karten[5]` in dieser Reihenfolge: `retrieval`, `feynman` (**Basis**:
`prompt_basis` + `warnung`, kein `prompt_fortgeschritten`), dann
`uebungs_feedback`, `mock_transfer`, `repetitionsplan` (**Plus**: beide Prompts) —
`references/basis-plus.md` §5,
`kn_typ_tracks[]` (einer pro `kn.kn_typen`), `rubrik_fokus[]` (pro Dimension
SuK/Ges, `kriterien` = Teilmenge von `kn.rubrik_shared`), `integritaet_warnung`,
`selbstcheck[]`. Top-Level `lehrgang` (verbatim aus `prinzip.lehrgang`) setzen.

- **EBA-A2-Gate (nur `lehrgang: "EBA_2J"`, blockierend):** der Lernbegleiter ist
  durchgehend learner-facing — alle Karten und Texte (`ziel`, `ki_frei_zuerst.*`,
  `strategie_karten[].*`, `kn_typ_tracks[].*`, `rubrik_fokus[].so_uebst_du`,
  `integritaet_warnung`, `selbstcheck[]`) laufen vor dem Write durch den A2-Scan
  (siehe Abschnitt «EBA-A2-Pre-Write-Gate»). Ausnahme: `kompetenzversprechen` wird
  **verbatim** aus `prinzip.kern_kompetenzversprechen` übernommen und nicht
  umformuliert.
- **Die KI kennt die Einheit nicht (BP8):** `warnung` von `retrieval` und
  `feynman` sagt, womit verglichen wird und was gilt; jeder Prompt mit Abfrage,
  Urteil oder neuem Fall nennt das Thema; Kriterien nie nur als Name; Lernkarten
  nur mit Fragen; kein «[mein Prinzip]»; `selbstcheck` ohne «andere als mein
  Kompetenznachweis» — Wortlaute in `basis-plus.md` §5.
- **Leitplanke (zwingend):** bereitet auf die **Kompetenz** vor, NIE auf die
  konkrete KN-Abgabe. → Checks **L1-L3**:
  - **L1:** referenziert `kompetenzversprechen` + `kn.kn_typen[]` + die
    `rubrik_shared`-Dimensionen.
  - **L2:** `mock_transfer` fordert einen **NEUEN** Fall, disjunkt von
    `kn.hybrid_situation`; keine Karte erzeugt das KN-Produkt/eine Musterlösung;
    `mock_transfer.warnung` verbietet die KN-Musterlösung explizit. **Bei v4.2**
    ist der Übungsfall zusätzlich disjunkt von Heft A, Heft B und dem gemeinsamen
    Auftrag (`set.gemeinsamer_auftrag.kontext_ausschluss`), und kein Begriff des
    Fall-Ausschlusses steht in irgendeinem Feld (Check `V42_FALL`).
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
| Strategie-Karten-Namen (Basis/Plus-Tabelle in §3) | `lernbegleiter.strategie_karten[].technik` (alle fünf, in der Reihenfolge der Datei) |
| KN-Typen (Timing/Brücke) | `kn.kn_typen[].label` |
| Grundregel + Integrität | `ki.assignments[].ki_frei_vorher` + `lernbegleiter.integritaet_warnung` |
| Rechts-/Quellen-Warnung (nur wenn zutreffend) | vorhanden, wenn ein `guetekriterium` Verifikation prüft / Aspekt «Recht» |

Pflicht-Abschnitte (siehe Template):
1. **Intro-Blockquote** — «für die Lehrperson», KI-Toolbox = optionales Zusatzangebot,
   kein Pflichtteil. **Kein Satz darüber, was «verbindlich» bleibt** (Pietro,
   07.10.2026: gestrichen, auch im Hinweis der Arbeitsansicht) — der Liesmich
   sagt, was die Toolbox ist, nicht, was die Lehrperson sonst unterrichten muss.
2. **§1 Was in der Toolbox steckt** — Tabelle der 4 Dokumente mit den **echten**
   Auftrags-Titeln + `[!hinweis]` mit den **vier** Technik-Namen dieser Unit.
3. **§2 Grundregel** — KI prüft, ersetzt nicht (`ki_frei_vorher`); plus
   `[!warnung]` Integrität (kein KN-Stoff in die KI) und — **nur wenn die Unit
   rechts-/quellenlastig ist** — `[!warnung]` Gegenprüfung von Quellen/Recht.
4. **§3 Basis und Plus** — eine Tabelle «was ist Basis, was ist Plus, welche
   Seiten» (echte Titel, Technik- und Karten-Namen) + **zwei**
   `[!differenzieren]`-Rezepte: noch kleiner (ein Dokument, eine Karte) · grösser
   (Plus dazulegen, für wen).
5. **§4 Didaktische Einsatz-Ideen** — `[!coaching]`/`[!differenzieren]`: Staffeln,
   Plenum-Demo, Gruppenpuzzle, Stationen, Vertiefung.
6. **§5 Kurz-Checkliste** — `[!lernziel]` mit der «ohne KI zuerst»- und
   «kein KN-Stoff»-Leitplanke.
7. **Anhang** — Quellen (`ki/lernprompt/lernbegleiter.json`) + Skill-Name.

- **Check LM1:** die echten Auftrags-Titel UND die vier Technik-Namen dieser Unit
  stehen im Liesmich (nicht generisch «KI-Auftrag 1/2»).
- **Check LM2:** §3 enthält die Basis/Plus-Tabelle mit den echten Titeln und den
  Seiten aus `basis-plus.md` §2 und **genau zwei** `[!differenzieren]`-Rezepte
  (kleiner · grösser).
- **Check LM3:** nur erlaubte Callouts (`lernziel/hinweis/beispiel/warnung/reflexion/
  coaching/mehrdeutigkeit/differenzieren`); Frontmatter trägt `titel` + `untertitel`.
- **Check LM4 (Rücklesen):** Der Liesmich sagt nur, was die Daten tun — wer benennt,
  prüft, baut; wie viel nachgeschlagen wird; **ein** Zeitpunkt je Auftrag in §1 und
  §4; Titel der Einheit wie `set.einheit_titel`; Hinweis auf den absichtlichen
  Fehler im Beispiel-Verlauf. Nach jeder Korrektur an einer JSON-Datei neu lesen
  (`ki-liesmich-architecture.md`).
- **Leitplanke gespiegelt:** §2/§5 wiederholen die Lernbegleiter-Integrität (kein
  KN-Produkt, üben an anderen Fällen) — der Liesmich darf der Toolbox NICHT
  widersprechen.
- **Kein A2-Gate:** `ki-liesmich.md` ist teacher-facing und vom EBA-A2-Gate
  **ausdrücklich ausgenommen** — auch bei einer EBA-Unit. Wörtlich zitierte
  Lernenden-Sätze stammen aus den bereits A2-geprüften JSONs und werden nicht
  umgeschrieben.

### PHASE 5 — Validierung + Index

Pre-Write-Spellcheck (ß/Transliteration) **und — bei `lehrgang: "EBA_2J"` — der
A2-Scan nach «EBA-A2-Pre-Write-Gate»**, dann schreiben. Danach Checks (unten)
laufen lassen; bei grün den Hinweis ausgeben: **`npm run build:einheiten-index`**
auf Windows laufen lassen (setzt `hat_ki`/`hat_lernprompt`/`hat_lernbegleiter`),
dann `/einheiten/{slug}` im Workbench prüfen (Nav-Gruppe «KI-Toolbox»: oben der
Link «📖 KI-Toolbox — Lies mich!», dann 4 Docs; A4-Overflow — v. a. DocKi Seite 1;
Liesmich-Route `/einheiten/{slug}/ki-liesmich` rendert + Word-Export geht).
Final-Summary mit Datei-Liste (vier Dateien: drei JSON + `ki-liesmich.md`). Dazu
gehört, was eine Auswahl entschieden hat: das Basis-Muster mit einem Satz Grund,
die Punkte der fünf Plus-Muster (bei `ai_redaktion` das Produkt und ob es nach der
Liste in `ki-scoring.md` schriftlich-formell ist), Signale der
Plus-Techniken, weggelassene `begriffe` (3er-Set), ein Sperrwort in einem
wörtlichen Feld (`kompetenzversprechen`).

**Zuerst das eigene Skript:** `node scripts/check-ki-toolbox.mjs <ordner>` — prüft
Form, Basis und Plus, die gezählten B1-Regeln und bei v4.2 Fall-Ausschluss, Spur
und Wörter (alle Formate; eine Toolbox ohne `"version": "2.0.0"` überspringt es).
Muss GRUEN sein. Was es nicht sehen kann (Deckung von Fachbegriffen, ob ein
Übungsfall neu ist, ob ein Basis-Prompt andockt), bleibt Sache der Checks unten.

**Seiten messen.** A4-Seiten haben `overflow: hidden`, ein Überlauf wird also
lautlos abgeschnitten. `node scripts/export-ki-toolbox.mjs <ordner>` schreibt die
vier Dokumente als HTML, `node scripts/messen-v42.mjs <ausgabeordner>` misst jede
Seite (nicht parallel starten — fester Port). In einem Lauf mit mehreren Agenten
misst der Orchestrator, nicht der Erzeuger. Erwartet: Basis-
Auftrag 2 Seiten, Plus-Auftrag 3, Lernprompt 3, Lernbegleiter 3. Seite 1 des
Lernbegleiters ist die engste (Selbsteinschätzung, Begriffe, zwei Karten mit
Notizfeldern) — dort zuerst nachsehen.

**Bei v4.2 zusätzlich — das Tor.** `node scripts/check-all.mjs <ordner>` liest
**jede** `.json` und `.md` im Ordner, also auch die vier Toolbox-Dateien: Eszett,
Platzhalter und die Leck-Prüfung gegen Lehrmittel und Quellenarchiv (ab 14 Wörtern
am Stück Warnung, ab 25 Fehler). Nach dem Schreiben laufen lassen; ein roter Befund
in einer Toolbox-Datei wird hier behoben, ein Befund in einer Unit-Datei nur
gemeldet (Scope). `--baseline` ist verboten.

**Sichtbarkeit (nur melden, nie selbst setzen).** Trägt `set.json`
`status: "entwurf"`, ist die Toolbox mit der Einheit nur für KT1 sichtbar — nichts
zu tun. Ist die Einheit `publiziert`, wird die Toolbox mit dem nächsten Index-Bau
für alle sichtbar: im Final-Summary darauf hinweisen, dass Pietro sie mit
`"entwurf_komponenten": ["ki-fluency"]` in `set.json` zurückhalten kann.

---

## v4.2-Regeln (nur `template: "heft_8page_v42"`)

> Gilt ausschliesslich für Einheiten im Format v4.2. Im 3er-Set und bei EBA greift
> dieser Abschnitt nicht.

Die Toolbox ist Material derselben Einheit: Sie spricht dieselbe Sprache wie die
Hefte, verrät den KN-Fall nicht und stimmt in beiden Spuren. **Regelquelle
(referenzieren, NICHT hineinkopieren):**
`.claude/skills/bbw-hko-heft-v42/references/sprache.md` und
`…/references/datenvertrag.md`.

**1. Nur den Kern lesen, nie eine Spur.** Die Lehrperson wählt die Spur
(`ohne_medien` / `mit_medien`); die Toolbox gibt es nur einmal. Sie stützt sich
darum auf das, was in beiden Spuren gilt: `situation_text`, `leitfrage`,
`leitfragen` (LF1, LF2), `handlungsprodukt`, `feedback_kriterien`,
`mehrdeutigkeit` und die Glossarbegriffe ohne `spur`. Aus `spuren.*` wandert
nichts in die Toolbox — keine Quelle, kein Raster, kein Befund, keine Zahl aus
einem Artikel. Vom Material darf sie allgemein reden («Ihr Raster zur Quelle»),
nie von seinem Inhalt. → Check `V42_SPUR`.

**2. Der Fall des KN ist tabu.** Jeder Begriff aus
`prinzip.hybrid_situation_spec.fall_ausschluss_hefte_und_auftrag` ist in allen vier
Toolbox-Dateien verboten — als Teilwort, ohne Rücksicht auf Gross- und
Kleinschreibung, auch in Prompts, Beispielen und Baukasten-Chips. Kein Skript
prüft die Toolbox darauf; der Scan vor dem Schreiben ist Sache der Skill. Ein
getroffener Begriff wird **nicht** durch ein Synonym ersetzt (derselbe Gegenstand
unter anderem Wort bleibt der Fall des KN), sondern das Beispiel wechselt den
Gegenstand. Übungsfälle sind zudem disjunkt von Heft A, Heft B und dem gemeinsamen
Auftrag (`set.gemeinsamer_auftrag.kontext_ausschluss`). → Check `V42_FALL`.

**3. Wörter der Hefte, nicht der alten Einheiten.** → Check `V42_WORT`.

| Nicht | Sondern |
|---|---|
| «Herausforderung A/B», «die drei Herausforderungen» | «Heft A», «Heft B», «Ihre zwei Hefte» |
| «Austausch & Transfer» | «gemeinsamer Auftrag» |
| «Trade-off» | «Spannungsfeld» / «Zielkonflikt» (Schlüssel und Werte der Unit-Dateien bleiben) |
| «Stufe 1-4», «Niveau» | «0 bis 3 Punkte» je Kriterium |
| «Spur», «Pflichtquelle» | kein «Spur» in Texten für Lernende; «Quelle» |
| «Woche 2», «Lektion», Minutenangaben | keine Unterrichtszeit (im Liesmich als Vorschlag erlaubt) |
| erfundene Person mit Namen, Betrieb, Ort | «mein Lehrbetrieb», «eine Kollegin» — neutrale Persona wie im Heft |

**4. Die Begriffe kommen aus dem Glossar.** Fachbegriffe in Aufträgen, Prompts
und Karten sind `set.glossar[].begriff` (Einträge ohne `spur`), in derselben
Schreibweise. `retrieval` und `repetitionsplan` nennen die Begriffe, die abgefragt
werden, aus dieser Liste — nicht aus dem Gedächtnis.

**5. Die Kriterien im Wortlaut des KN.** `rubrik_fokus[].kriterien` und jedes
Kriterium, das ein Prompt nennt, steht zeichengenau wie
`kn.rubrik_shared.kriterien[].name` — dieselben vier Namen, die die Lernenden aus
den `feedback_kriterien` ihrer Hefte kennen.

**6. Eckige Klammern in Prompts.** `[mein Text]`, `[meine Antwort]` sind
gewollte Lücken für die Lernenden und bleiben. Das Tor liest aber einzelne Muster
als vergessenen Platzhalter: keine Lücke beginnt mit «nach », «abhängig», «Datum»,
«Vier », «URL», «JJJJ»; keine geschweiften Klammern in den JSON-Dateien und im
fertigen Liesmich.

---

## EBA-A2-Pre-Write-Gate (nur `lehrgang: "EBA_2J"`)

> **Gilt ausschliesslich**, wenn `prinzip.lehrgang` den Wert `"EBA_2J"` hat. Bei
> `EFZ_3J`/`EFZ_4J` greift dieser Abschnitt nicht und wird übersprungen.

Bei EBA ist A2-Sprache **kein «nice to have», sondern ein hartes Gate** — genau wie
im EBA-Set-Generator, der die Unit selbst erzeugt hat. Die KI-Toolbox darf das
Sprachniveau der Unit nicht wieder anheben: die Lernenden, die das Dossier auf A2
lesen, lesen auch die KI-Aufträge.

**Regelquelle (referenzieren, NICHT hineinkopieren):**
`.claude/skills/hko-2er-EBA-set-generator/references/a2-language-rules.md` — dort
stehen die zählbaren Regeln A1-A8, die Mess-Konvention (was als Satz, Wort,
Nebensatz, Fachbegriff zählt) und die Positiv/Negativ-Paare zum Kalibrieren. Diese
Skill hält **keine** eigene Kopie der Regeln; bei Änderungen an den Regeln gilt
automatisch die Fassung des Set-Generators.

**Ablauf:** Der Scan läuft **vor** jedem Write eines SuS-gerichteten Prosa-Felds —
also in Phase 2, 3 und 4 —, analog zum bestehenden Umlaut/Eszett-Scan. Erst alle
ERR beheben (neu formulieren, bis bestanden), dann WARN melden und nach Möglichkeit
beheben.

**Betroffene Felder (erschöpfend):**

| Datei | Felder |
|---|---|
| `ki.json` | `assignments[].ziel`, `assignments[].auftrag`, `assignments[].schritte[]`, `assignments[].reflexion[]`, `assignments[].guetekriterien[].{kriterium,indikator}` |
| `lernprompt.json` | alle Prompts (`techniken[].beispiel_basis`, `…beispiel_fortgeschritten`, `techniken[].baukasten.*`, `stacking_seite_1/2.prompt_1`, `…prompt_2`, `prompt_vorlage`) **und** jede `techniken[].erklaerung` |
| `lernbegleiter.json` | alle Karten und Texte: `ziel`, `ki_frei_zuerst.*`, `strategie_karten[].*`, `kn_typ_tracks[].*`, `rubrik_fokus[].so_uebst_du`, `integritaet_warnung`, `selbstcheck[]` (Ausnahme: `kompetenzversprechen` bleibt verbatim) |
| `ki-liesmich.md` | **AUSGENOMMEN** — teacher-facing |

**Die zwei blockierenden Codes:**

| Code | Auslöser | Reaktion |
|---|---|---|
| `ERR_A2_SATZ_ZU_LANG` | Ein Satz im Feld hat mehr als 18 Wörter (Regel A2 der Regelliste) | Pre-Write-Block: Satz aufteilen, Feld erneut schreiben |
| `ERR_A2_BEGRIFF_OHNE_GLOSSAR` | Ein Fachbegriff ohne Deckung im Glossar/Dossier der Unit (`dossier.json`: `glossar[].begriff`, `nuggets[].titel`) — Regel A5 | Pre-Write-Block: Begriff durch einen gedeckten ersetzen oder in A2 erklären; das Dossier wird **nicht** verändert (Scope) |

**Nicht blockierend, aber melden:** die `WARN_A2_*`-Codes der Regelliste
(Satzlängen-Schnitt, Nebensatzkette, Passiv, Nominalstil, Konjunktiv II) — im
Final-Summary listen.

**Was A2 NICHT ändert:** Die **Sie-Form** in Aufträgen und Prompts bleibt, die
**ICH-Form** in narrativen Passagen bleibt. A2 senkt Komplexität, nicht Höflichkeit.

**Scope-Grenze:** Die Skill fixt A2-Verstösse ausschliesslich in den von ihr selbst
erzeugten Dateien. Findet der Scan einen ungedeckten Fachbegriff, wird der Begriff
hier umformuliert — `dossier.json` und die übrigen Unit-Dateien bleiben
unangetastet (siehe «Scope (hart)»).

---

## Checks (vor dem Abschluss, alle ERR ausser markiert)

| # | Check |
|---|---|
| P5 | Jeder KI-Auftrag hat >=3 `guetekriterien`; eines prüft Verifikation |
| P6 | Jeder `bezug` nennt alle vorhandenen Herausforderungen + das Transfer-Prinzip |
| KN_NAME | Kein «Mini Case», «Werkschau», «Transfer-Reflexion» in einem Feld für Lernende (alle Formate, auch EBA). Ausnahmen: `kn_typ_tracks[].label`, `ki-liesmich.md` |
| KN_BRIDGE | Mindestens ein Auftrag rahmt die letzte Reflexionsfrage als Brücke zum Kompetenznachweis — «Im Kompetenznachweis …», ohne eine KN-Form (Ausnahme: `kn.kn_typen` hat genau eine) und nie mit dem Namen einer Form («Mini Case …», «Werkschau …») |
| LP1 | `lernprompt.techniken` = genau 4, die ersten zwei `rollen_prompting` + `kontextualisieren` (Basis-Block ohne `beispiel_fortgeschritten` und `baukasten`), die zwei weiteren mit vollem Block + `baukasten{rolle,kontext,aufgabe,format}`; `erklaerung` ohne Beispiel |
| LP2 | `stacking_seite_1/2` mit `prompt_1` + `prompt_2`; `prompt_2` baut auf `prompt_1` auf |
| L1 | Lernbegleiter referenziert Kompetenzversprechen + `kn.kn_typen` + Rubrik-Dimensionen |
| L2 | `mock_transfer` fordert NEUEN, von `kn.hybrid_situation` disjunkten Fall; keine Musterlösung; Warnung verbietet KN-Lösung |
| L3 | Jede `strategie_karten`-Karte hat `prompt_basis` + technik-spezifische `warnung` (Karte 3-5 dazu `prompt_fortgeschritten`) |
| LM1 | `ki-liesmich.md` nennt die echten `ki.assignments[].titel` UND die vier `lernprompt.techniken[].titel` (nicht generisch) |
| LM2 | §3 hat die Basis/Plus-Tabelle (echte Titel, Seiten) und genau zwei `[!differenzieren]`-Rezepte (kleiner · grösser) |
| BP1-BP7 | Basis und Plus nach `references/basis-plus.md` §7: Reihenfolge · Anzahl · kein Plus-Feld in der Basis · Sprachzeile in jedem fertigen Prompt (feste Form, ein Auftrag je Satz) · Basis-Prompt dockt an (eine Lücke, kein neuer Fall) · Feldlängen · `beispiel_dialog` und `begriffe` vorhanden |
| BP8 | Die KI kennt die Einheit nicht (`basis-plus.md` §1 Nr. 5): Thema im Prompt · `warnung` von `retrieval`/`feynman` nennt, womit verglichen wird · kein Kriterium nur als Name · die KI liefert keinen Stoff; in der Basis liefert auch Prompt 2 keinen Inhalt |
| BP9 | Aufbau des Basis-Auftrags (`basis-plus.md` §3): drei Fragen · «Prompt 2, nach der dritten Frage:» · Schritt 2/3 nennen Prompt 1/2 · «Nachgeschlagen» erfüllbar · «jede»/«mindestens eine» nicht gemischt · ein Gegenstand, ein Wort |
| B1 (nur EFZ) | Bei `EFZ_3J` / `EFZ_4J`: jedes SuS-gerichtete Prosa-Feld hat den Scan gegen `references/b1-language-rules.md` bestanden — kein Satz > 22 Wörter, ein Auftrag je Satz, ein Schritt ein Satz, kein ungedeckter Fachbegriff, kein Sperrwort. `ki-liesmich.md` ist ausgenommen |
| LM3 | Nur erlaubte Callouts; Frontmatter mit `titel`+`untertitel`; spiegelt die Lernbegleiter-Integrität (kein KN-Stoff) |
| LM4 | Liesmich gegen die Daten zurückgelesen: wer tut was · wie viel nachgeschlagen wird · ein Zeitpunkt je Auftrag in §1 und §4 · Titel wie `set.einheit_titel` · Hinweis auf den absichtlichen Fehler im Beispiel-Verlauf |
| V42_SPUR (nur v4.2) | Kein Inhalt aus `spuren.*` (Quelle, Raster, Befund, Zahl) in einer Toolbox-Datei; jeder Satz stimmt in beiden Spuren |
| V42_FALL (nur v4.2) | Kein Begriff aus `prinzip.hybrid_situation_spec.fall_ausschluss_hefte_und_auftrag` (Teilwort, ohne Gross/Klein) in `ki.json`, `lernprompt.json`, `lernbegleiter.json`, `ki-liesmich.md`; Übungsfälle disjunkt von `set.gemeinsamer_auftrag.kontext_ausschluss` |
| V42_WORT (nur v4.2) | «Heft A/B» statt «Herausforderung A/B»; «gemeinsamer Auftrag» statt «Austausch & Transfer»; kein «Trade-off», «Stufe», «Spur», «Pflichtquelle», keine Unterrichtszeit in Texten für Lernende; Fachbegriffe aus `set.glossar`; Kriterien-Namen zeichengenau aus `kn.rubrik_shared` |
| SKRIPT | `node scripts/check-ki-toolbox.mjs <ordner>` ist GRUEN; alle drei JSON-Dateien tragen `"version": "2.0.0"` |
| TOR (nur v4.2) | `node scripts/check-all.mjs <ordner>` meldet keinen Befund in einer der vier Toolbox-Dateien |
| A2 (nur EBA) | Bei `lehrgang: "EBA_2J"`: jedes SuS-gerichtete Prosa-Feld in `ki.json`, `lernprompt.json` und `lernbegleiter.json` hat den Pre-Write-Scan gegen `a2-language-rules.md` bestanden — kein Satz > 18 Wörter (`ERR_A2_SATZ_ZU_LANG`), kein Fachbegriff ohne Deckung im Glossar/Dossier der Unit (`ERR_A2_BEGRIFF_OHNE_GLOSSAR`). `ki-liesmich.md` ist ausgenommen (teacher-facing) |
| SPRACHE | Kein `ß`; Umlaute echt; Gendern Schrägstrich-Form; sichtbar keine rohen SM-/SK-Codes |
| SHAPE | Alle drei JSON-Dateien validieren gegen `assets/*.json` (Feldnamen exakt), inkl. Top-Level `lehrgang` aus `prinzip.lehrgang`; `ki-liesmich.md` gegen `assets/ki-liesmich-template.md` |

Fehlercodes: `ERR_INPUTS`, `ERR_KI_BEZUG` (P6), `ERR_GUETE` (P5),
`ERR_KN_BRIDGE`, `ERR_LP_SHAPE` (LP1/LP2), `ERR_LB_INTEGRITAET` (L2),
`ERR_LB_SHAPE` (L1/L3), `ERR_LIESMICH` (LM1/LM2/LM3), `ERR_SPRACHE`, `ERR_SHAPE`,
`ERR_BP_*` (BP1-BP9, alle blockierend), — nur EFZ — `ERR_B1_*` (blockierend;
`WARN_B1_*` im Final-Summary listen),
— nur bei v4.2 — `ERR_V42_SPUR`, `ERR_V42_FALL`, `ERR_V42_WORT` (alle drei
blockieren den Write: Stelle neu schreiben, nicht umetikettieren),
sowie — nur bei `lehrgang: "EBA_2J"`, beide blockieren den Write —
`ERR_A2_SATZ_ZU_LANG` (Satz > 18 Wörter in SuS-Prosa; Satz aufteilen und erneut
schreiben) und `ERR_A2_BEGRIFF_OHNE_GLOSSAR` (Fachbegriff ohne Deckung im
Glossar/Dossier der Unit; Begriff ersetzen oder in A2 erklären — das Dossier wird
nicht verändert).

---

## References & Assets

- `references/input-adapter.md` — bbw-hko-Unit-JSONs → Generierungs-Inputs (Format-Erkennung, Adapter-Tabelle, v4.2-Zusatz, EBA-Sonderfall)
- `.claude/skills/bbw-hko-heft-v42/references/sprache.md` + `datenvertrag.md` — **fremde Regelquelle, nur lesen:** Sprache und Feldbedeutung der v4.2-Einheiten (nicht kopieren, referenzieren)
- `references/basis-plus.md` — **zuerst lesen:** Basis und Plus, fertige Prompts, Sprachzeile, Andocken, «die KI kennt die Einheit nicht», Aufbau des Basis-Auftrags, Anzahl und Länge je Feld, BP1-BP9
- `references/b1-language-rules.md` — B1-Sprach-Gate für EFZ: gezählte Regeln, Deckung von Fachbegriffen, Sperrwörter
- `references/ki-architecture.md` — Zweck (AI-Fluency), Pflichtfelder, Anti-Patterns
- `references/ki-scoring.md` — 7 Patterns scoren → 2
- `references/lernprompt-techniken.md` — 6 Techniken, 4er-Auswahl (2 Basis + 2 Plus), zwei Prompts nacheinander
- `references/lernbegleiter-architecture.md` — das 4. Dokument, L1-L3, Integritäts-Leitplanke
- `references/ki-liesmich-architecture.md` — das 5. Dokument (Markdown-Liesmich), Selbst-Review, LM1-LM3
- `references/language-rules.md` — Umlaut/Gendern/kein-ß
- `.claude/skills/hko-2er-EBA-set-generator/references/a2-language-rules.md` — **fremde Regelquelle, nur lesen:** die A2-Regelliste A1-A8 + Mess-Konvention für das EBA-A2-Pre-Write-Gate (nicht kopieren, referenzieren)
- `assets/ki-template.json`, `assets/lernprompt-template.json`, `assets/lernbegleiter-template.json` — Renderer-Vertrag
- `assets/ki-liesmich-template.md` — Markdown-Gerüst (Frontmatter + Abschnitte + Callouts) für den Liesmich
- **Keine Gold-Einheit.** `1.1.1_konflikt_kommunizieren` war bis 07.10.2026 die Gold-Referenz in voller Dichte (1.x) und ist seither neu geschrieben (2.0.0). Für die Form gelten `assets/*.json`; für den Wortlaut gilt die eigene Einheit — kein Text aus einer anderen Toolbox.
