# Input-Adapter — bbw-hko-Unit-JSONs → Generierungs-Inputs

Diese Skill erzeugt KEINE Unit; sie liest eine fertige und destilliert daraus die
Inputs für Scoring + die drei KI-Dokumente. Quelle der Wahrheit ist die
**bestehende** Unit im Ordner `src/data/einheiten/{X.Y.Z}_{slug}/`.

## 0. Format erkennen (zuerst)

| Format | Erkennung | Herausforderungen |
|---|---|---|
| **v4.2** (Standard seit Oktober 2026) | `herausforderung_A.template === "heft_8page_v42"` | A, B — im Text «Heft A», «Heft B» |
| 3er-Set | jedes andere Template bei `lehrgang` `EFZ_3J` / `EFZ_4J` | A, B, C |
| EBA | `prinzip.lehrgang === "EBA_2J"` | A, B (+ `dossier.json`) |

Das Format steht im Confirm-Block von Phase 0. Es ändert **nicht**, was
geschrieben wird (Output-Vertrag = `assets/*.json`), sondern was gelesen wird und
welche Wörter gelten: v4.2 → §2b, EBA → §4.

## 1. Welche Dateien lesen

| Datei | Pflicht | Wofür |
|---|---|---|
| `prinzip.json` | ja | sk_targets, aspekte, trade_offs, zirkularitaet, dekontextualisierungs_anker, kern_kompetenzversprechen, lehrgang, modul; bei v4.2 dazu `hybrid_situation_spec.fall_ausschluss_hefte_und_auftrag`, `quellen_anker` |
| `kn.json` | ja | hybrid_situation (= Transfer-Szene), kn_typen, rubrik_shared, anchored_situations, dominanter_aspekt |
| `herausforderung_A/B.json` | ja | Handlungsprodukt-Typen, modul_titel, nrlp; bei v4.2 nur der **Kern** (§2b) |
| `herausforderung_C.json` | nur 3er-Set | wie A/B. Fehlt sie bei v4.2 oder EBA, ist das **kein** `ERR_INPUTS` |
| `set.json` | 3er/EBA optional · **v4.2 Pflicht** | einheit_titel; bei v4.2 `glossar`, `gemeinsamer_auftrag`, `status` |

## 2. Mapping-Tabelle (verbindlich)

| Generierungs-Input | bbw-hko-Pfad |
|---|---|
| `sk_targets` (Quote-SK) | `prinzip.sk_schnittmenge_kn.primary` (Array von Nummern) |
| SK-Klartext für `nrlp_anker` | `sk_targets` → kanonische Kurznamen (siehe `src/lib/sk-labels.generated.ts`: 4=In Teams arbeiten, 6=Standpunkte begründen, 7=Verständnis fördern, 11=Mit Mehrdeutigkeiten umgehen, …) |
| `aspekte` | Keys von `prinzip.aspekte` (z. B. Recht, Ethik, «Identität und Sozialisation», «Technologische und digitale Transformation») |
| Handlungsprodukt-Typen | `prinzip.herausforderungen[A/B(/C)].handlungsprodukt_typ` (Kurzform) + ggf. `herausforderung_X.handlungsprodukt.{format,titel,beschreibung}` — nur vorhandene Buchstaben |
| Trade-off-Raum | `prinzip.mehrdeutigkeits_architektur.trade_off_raum[]` |
| Zukunftsbezug (für `ai_zeitkapsel`) | `prinzip.zirkularitaet.r2_voraussicht` / `r3_voraussicht` |
| **Transfer-Prinzip** | `prinzip.dekontextualisierungs_anker.anker_statement` (das destillierte Prinzip) |
| **Transfer-Szene** (für `bezug` + Lernbegleiter-Disjunktheit) | `kn.hybrid_situation` (`titel`, `text`, `aktivierte_trade_offs`, `alignment_note.herausforderungen_mapping`) |
| Kompetenzversprechen | `prinzip.kern_kompetenzversprechen` (identisch `kn.kern_kompetenzversprechen`) |
| KN-Typen | `kn.kn_typen[].{typ,label}` (z. B. fachgespraech, mini_case_schriftlich, werkschau_transfer) |
| KN-Rubrik | `kn.rubrik_shared.kriterien[]` (`{name, dimension}`), gruppiert nach `dimension` (SuK/Ges) |
| `anchored_situations` | `kn.anchored_situations` (Liste der hf-IDs) |
| modul / modul_titel / thema / lehrgang | `herausforderung_A.modul` / `…modul_titel` / `nrlp.themen[0]` / `prinzip.lehrgang` |

### 2a. Vertragsfeld `lehrgang` (Pflicht in allen drei JSON-Dateien)

`ki.json`, `lernprompt.json` und `lernbegleiter.json` tragen **immer** ein
**Top-Level**-Feld `"lehrgang"` — Wert **verbatim** aus `prinzip.lehrgang`
(`"EFZ_3J"`, `"EFZ_4J"`, `"EBA_2J"`). Die Renderer (`DocKi`, `DocLernprompt`,
`DocLernbegleiter`) lesen genau dieses Feld und schalten bei `"EBA_2J"` die
EBA-Typografie zu (Klasse `doc-eba`: grössere Schrift, kürzere Zeilen, eigene
Callout-Formate). Fehlt das Feld, rendert eine EBA-Unit stillschweigend im
EFZ-Satzbild — es gibt keine Fehlermeldung, darum ist das Feld Pflicht und nicht
optional. Derselbe Wert entscheidet, ob das **EBA-A2-Gate** greift (siehe §4).

## 2b. v4.2-Zusatz (`template: "heft_8page_v42"`)

Die Tabelle in §2 gilt unverändert — `prinzip.json` und `kn.json` tragen bei v4.2
dieselben Pfade. Dazu kommt:

| Generierungs-Input | v4.2-Pfad | Wofür |
|---|---|---|
| Fall und Frage je Heft | `herausforderung_{A,B}.situation_text`, `.leitfrage` | Material für `auftrag`, `thema_bezug`, Beispiel-Prompts |
| Wissen und Anwendung | `herausforderung_{A,B}.leitfragen[]` (nur LF1, LF2 — so stehen sie auf der Platte) | was abgefragt und erklärt werden kann |
| Produkt je Heft | `herausforderung_{A,B}.handlungsprodukt.{format,titel,beschreibung,schritte}` | worauf die KI Rückmeldung gibt (`ai_redaktion`, `uebungs_feedback`) |
| Kriterien, die die Lernenden schon kennen | `herausforderung_{A,B}.feedback_kriterien[].{kn_kriterium,dimension,stufen}` (= Wortlaut von `kn.rubrik_shared`) | `rubrik_fokus`, Kriterien in Prompts — «0 bis 3 Punkte» |
| Spannungsfeld je Heft | `herausforderung_{A,B}.mehrdeutigkeit.trade_off` | Gegenposition, Entscheidungscoach — im Text «Spannungsfeld» |
| **Fachbegriffe** | `set.glossar[]` — nur Einträge **ohne** `spur`; `begriff` + `definition`, je `heft` | einziger Vorrat für Fachwörter in der Toolbox; Liste für `retrieval` und `repetitionsplan` |
| **Transfer vor dem KN** | `set.gemeinsamer_auftrag.{titel,auftrag,produkte}` | ersetzt «Austausch & Transfer» (§2c); Timing |
| **Übungsfall: was er nicht sein darf** | `set.gemeinsamer_auftrag.kontext_ausschluss[]` (Heft A, Heft B, KN) + `kn.hybrid_situation` | `mock_transfer`, `kn_typ_tracks` — neuer Fall, anderer Lebensbereich |
| **Fall-Ausschluss** | `prinzip.hybrid_situation_spec.fall_ausschluss_hefte_und_auftrag[]` | Verbotsliste für alle vier Toolbox-Dateien (Check `V42_FALL`) |
| Lehrmittel-Fundstellen | `prinzip.quellen_anker.chapters[]` bzw. `herausforderung_X.quellen_anker[]` (`ref`, `seiten`) | «im Lehrmittel nachschlagen (Kap. X.Y, S. aa-bb)» in Warnungen |
| Sichtbarkeit | `set.status` | nur für den Hinweis im Final-Summary (SKILL.md, Phase 5) |

**Nicht lesen: `herausforderung_X.spuren.*`.** LF3, LF4, Raster, Quelle,
Denkhilfe und Vertiefungen gehören je einer Spur. Die Toolbox gibt es einmal und
muss in beiden stimmen (Check `V42_SPUR`). Ebenfalls nicht in die Toolbox: alles
unter `loesung`, `loesungsbild`, `erwartungshorizont`, `abschluss.loesung` — das
ist Material der Lehrperson; ein Beispiel-Prompt, der eine Lösung zitiert, gibt
sie den Lernenden in die Hand.

**Persona.** v4.2 kennt keine erfundene Figur (`persona` = «Lernende/r EFZ,
N. Lehrjahr · eigener Lehrbetrieb · eigener Wohnort»). Beispiel-Prompts schreiben
«mein Lehrbetrieb», «eine Kollegin» — kein Name, kein Firmenname, kein Wohnort.

## 2c. Timing und Transfer-Benennung nach Format

| Format | `ki.timing` | So heisst die Transfer-Phase im Text |
|---|---|---|
| 3er-Set | `nach Austausch & Transfer, zur Vorbereitung auf den Kompetenznachweis` | «Austausch & Transfer» |
| **v4.2** | `nach dem gemeinsamen Auftrag, zur Vorbereitung auf den Kompetenznachweis` | «gemeinsamer Auftrag» |
| EBA | wie 3er-Set | «Austausch & Transfer» |

`ki.timing` gilt für die Datei, also für beide Aufträge, und nennt den
**spätesten** Zeitpunkt; das Feld wird nicht gedruckt. Der Liesmich setzt den
Plus-Auftrag auf denselben Zeitpunkt und darf den Basis-Auftrag früher ansetzen
(«sobald Heft A und Heft B fertig sind» / «sobald die Herausforderungen fertig
sind») — je **ein** Wortlaut in §1 und §4 (`ki-liesmich-architecture.md`, LM4).

`ki.anchored_situations` = `kn.anchored_situations` verbatim (zwei IDs bei v4.2
und EBA, drei im 3er-Set).

## 3. Der entscheidende Unterschied zu hko-deploy

hko-deploy (`hko-3er-to-praxis`) scort und referenziert gegen **`praxis_spec`**
(zwei Praxisaufträge, die den KN ersetzen). bbw-hko hat **keinen Praxisauftrag**,
sondern weiterhin den **summativen Kompetenznachweis**. Überall, wo das Quell-Skill
`praxis_spec` / `transfer_situation` sagt, gilt hier:

```
praxis_spec.transfer_situation   →   kn.hybrid_situation
"Transfer-Prinzip" (in bezug)    →   prinzip.dekontextualisierungs_anker.anker_statement
                                      (verankert an der kn.hybrid_situation-Szene)
```

Das ist der einzige strukturelle Umbau. Alles andere (Scoring, Felder, Stacking,
Strategie-Karten) ist deckungsgleich.

## 4. EBA-Sonderfall (`lehrgang: "EBA_2J"`)

- Nur **2** Herausforderungen (A/B); `herausforderung_C.json` fehlt → `bezug`
  nennt nur A + B (Check P6 zählt nur vorhandene Herausforderungen).
- Fachwissen kommt aus `dossier.json` statt Lehrmittel → in `warnung`/`prompt`
  «im Dossier nachschlagen» statt «im Lehrmittel».
- KN-Primärform ist `fachgespraech` (mündlich) → der Lernbegleiter-`fachgespraech`-
  Track ist hier besonders wichtig.
- **Sprache: A2 ist ein hartes Gate, keine Empfehlung.** Vor jedem Write eines
  SuS-gerichteten Prosa-Felds in `ki.json`, `lernprompt.json` und
  `lernbegleiter.json` läuft der A2-Pre-Write-Scan gegen die Regelliste des
  EBA-Set-Generators —
  `.claude/skills/hko-2er-EBA-set-generator/references/a2-language-rules.md`
  (referenzieren, nicht kopieren). Blockierend: `ERR_A2_SATZ_ZU_LANG` (ein Satz
  > 18 Wörter) und `ERR_A2_BEGRIFF_OHNE_GLOSSAR` (Fachbegriff ohne Deckung im
  Glossar/Dossier dieser Unit). `WARN_A2_*` melden und nach Möglichkeit beheben.
  Die Sie-Form in Aufträgen und die ICH-Form im Narrativ bleiben — A2 senkt
  Komplexität, nicht Höflichkeit. **`ki-liesmich.md` ist ausgenommen**
  (teacher-facing). Feldliste + Ablauf: SKILL.md, Abschnitt
  «EBA-A2-Pre-Write-Gate».

## 5. Fehler

Fehlt `prinzip.json` oder `kn.json` → `ERR_INPUTS` und konkret nennen, was fehlt
(die Skill erzeugt keine Unit-Teile, sie ergänzt nur). Bei v4.2 ebenfalls
`ERR_INPUTS`, wenn `set.json`, `set.glossar`, `set.gemeinsamer_auftrag` oder
`prinzip.hybrid_situation_spec.fall_ausschluss_hefte_und_auftrag` fehlt — ohne sie
lassen sich `V42_FALL` und `V42_WORT` nicht prüfen.
