# JSON Field Mapping — 3er-Set

Feld-fuer-Feld-Vorgaben fuer Phase 2 (`sit_*.json`), Phase 3 (`set.json`), Phase 4 (`kn.json`). Bei Unsicherheit ueber Feldname, Datentyp, Quelle: hier nachschlagen. Bei Konflikt mit `assets/*-template.json`: das Template gewinnt.

---

## 1. Mission JSON (herausforderung_A.json, herausforderung_B.json, herausforderung_C.json)

### Top-Level

| Feld | Datentyp | Quelle | Pflicht | Anmerkung |
|---|---|---|---|---|
| `id` | string | gebildet | ja | Format `{X.Y.Z}_{topic_slug}_hf_{LETTER}` |
| `modul` | string | NRLP | ja | `{X.Y}` |
| `modul_titel` | string | NRLP themen[X].titel oder Lehrmittel-Titel | ja | Renderer-Pflicht |
| `lehrgang` | enum | Phase 2 User-Input | ja | `EBA_2J` \| `EFZ_3J` \| `EFZ_4J`, Default `EFZ_3J` |
| `situation` | string | Phase 1 Selektion | ja | `A` \| `B` \| `C` |
| `sit_farbe` / `_light` / `_mid` | string (hex) | Farb-Triple-Tabelle | ja | Renderer-Pflicht |
| `titel` | string | Phase 1 | ja | aus Phase-1-Tabelle |
| `emotion_tag` | string | — | nein | Optional/deprecated (C1): wird im Renderer NICHT mehr angezeigt. Nicht mehr generieren; bestehende Werte bleiben fuer Rueckwaertskompatibilitaet stehen. |
| `wissensknoten` | array of strings | Phase 2 | ja | mind. 1 Eintrag (Renderer greift auf [0] zu) |
| `template` | string | konstant | ja | `"default_4page_v2"` (reserviert) |
| `wochen` | number | konstant | ja | `3` |
| `legacy`/`source_refs`/`registry_tags` | object | konstant | ja | `{}` |

### Farb-Triple je Buchstabe

| LETTER | sit_farbe | sit_farbe_light | sit_farbe_mid |
|---|---|---|---|
| A | `#C0392B` | `#FADBD8` | `#E74C3C` |
| B | `#1A5276` | `#D6EAF8` | `#2E86C1` |
| C | `#1E8449` | `#D5F5E3` | `#27AE60` |

Im 3er-Set werden nur A/B/C verwendet. Die D/E-Triples aus dem 5er-Set sind ungebraucht.

### `nrlp`-Block

| Feld | Datentyp | Anmerkung |
|---|---|---|
| `nrlp.nr` | string | `{X.Y.Z}` |
| `nrlp.nr_primary` | array | Kompetenz-Nummern, die DIESE Herausforderung real abdeckt. Default `["{X.Y.Z}"]`; bei echter Mehrfachabdeckung mehrere, z. B. `["1.1.1","1.1.3"]` (B1). `bbw-hko build:einheiten-index` → `abgedeckte_kompetenzen` = Union über A/B/C (Kachel-Chips). |
| `nrlp.lebensbezug` | string | `{X.Y}` |
| `nrlp.themen` | array | `["T{X}"]` |
| `nrlp.gesellschaft` | **array of `{aspekt, iteration}` objects** | NICHT Object — Renderer crasht bei `.map` ueber Object |
| `nrlp.sprachmodi` | array of strings | aus prinzip.modi_units |
| `nrlp.sk` | array of integers | situationsspezifisch, 2-3 SK, NICHT template-default |

### `leitfragen[]` (4 Items)

| Feld | Datentyp | Werte |
|---|---|---|
| `nr` | **integer** 1-4 | NICHT String "LF1" |
| `bloom` | string | `"Verstehen"` / `"Anwenden"` / `"Entscheiden"` / `"Analysieren"` / `"Formulieren"` |
| `knoten_ref` | string | `"Dossier | Info-Karte {LETTER}-NN"` mit Pipe-Separator (EBA hat kein Lehrmittel — nie `"Kap. … | S. …"`) |
| `text` | string | NICHT `frage` |
| `feld_hoehe_mm` | integer | `15` (konstant) |
| `loesung` | Object | `{kern, zeilen[{label?, text, quelle?}]}` (C10, additiv) — siehe unten |

K-Stufe-zu-bloom-Mapping:
- K2 → `"Verstehen"`
- K3 (Entscheiden) → `"Entscheiden"` (bei "Waehle...", "Entscheide...")
- K3 (Anwenden) → `"Anwenden"` (sonst)
- K3+ (Formulieren) → `"Formulieren"` (bei "Formuliere...", "Verfasse...", "Schreibe...")
- K4 → `"Analysieren"`

Mindestens eine LF auf K3+/K4 — sonst 5. LF ergaenzen.

**LF4-Scoping (C4):** LF4 trainiert den Output-Sprachmodus (`nrlp.sprachmodus_ids`) als *fokussierte Teil-/Sprachform-Aufgabe* — EIN Baustein, der ins Handlungsprodukt einfliesst — und reproduziert NIE das ganze Handlungsprodukt. Methode passend zum Output-Modus aus `references/sprachfoerderung-methoden.md` waehlen. Beispiele: "Schreibe einen Block deines Spickzettels …", "Schreibe die Spalte «Rechtsfolge» als Wenn-dann-Mustersatz …", "Formuliere drei Ich-Botschaften …". Rezeption (SM3) bleibt bei LF1-3. Siehe Coherence-Check 20.

#### `leitfragen[].loesung` (C10)

Die **Antwort** auf die Leitfrage, formuliert fuer die Lehrperson. Sie speist die Unterfolie `{a|b}-leitfragen-loesung` im Unterrichtsdeck (`src/lib/einheiten/deck-builder.ts`) — dieselbe Akkordeon-Mechanik wie `handlungsprodukt.musterloesung`, eine Leitfrage pro Klick. **Sie wird nie im Schuelerbogen (`DocS`) gerendert** und darf deshalb den Massstab offen aussprechen.

**Nicht zusaetzlich in `begleiter.md` schreiben.** `loadEinheit` spiegelt die Loesungen beim Laden als `> [!loesung]`-Callouts in den Begleiter (`src/lib/einheiten/begleiter-loesungen.ts`) — pro Herausforderung ein Kapitel «Loesungen der Leitfragen» vor dem Tafelbild. Handgeschriebene Loesungen im Markdown waeren eine zweite Quelle fuer denselben Satz und wuerden irgendwann abweichen.

Abgrenzung zu den Nachbarfeldern — die drei sagen Verschiedenes und duerfen sich nicht doppeln:

| Feld | Antwortet auf |
|---|---|
| `leitfragen[].loesung` (C10) | «Was ist auf **diese** Frage eine tragfaehige Antwort?» — fachlicher Massstab pro LF |
| `handlungsprodukt.musterloesung` (C7) | «Wie sieht das **fertige Produkt** aus?» — ein ausgefuelltes Exemplar |
| `[!coaching]` / `[!warnung]` im Begleiter | «Wie **begleite** ich die Lernenden dorthin?» — Intervention, nicht Inhalt |

| Feld | Wert |
|---|---|
| `kern` | Kurzlabel, **max. ~55 Zeichen** — steht auf dem Aufklapp-Titel hinter `LF {nr} · {bloom} — `. Benennt die Sache, wiederholt nicht die Frage (`"Die drei Kategorien und was hineingehoert"`, nicht `"Antwort auf Leitfrage 1"`). |
| `zeilen[]` | 3–6 Objekte `{label?, text, quelle?}`. `text` ist Pflicht. |
| `zeilen[].label` | Optional, **max. ~24 Zeichen** — 190px-Spalte. Benennt die Rolle der Zeile: den Bauteil (`"Fakt"`, `"Weg 1"`, `"Vorgaben"`), die Wertung (`"Erwartet"`, `"Ebenfalls tragfaehig"`, `"Nicht tragfaehig"`) oder die Formregel (`"Massstab"`, `"Haeufiger Fehler"`). |
| `zeilen[].quelle` | Optional, **max. ~30 Zeichen**, Chip mit `white-space: nowrap`. Bei EBA die Dossier-Fundstelle (`"Info-Karte B-03"`), **nie** ein Lehrmittel-Kapitel. |

**Woher der Inhalt kommt — Datenhebung, nicht Neuerfinden.** Bei EFZ ist die erste Quelle der Lehrmittel-Abschnitt; **bei EBA tritt das Dossier an diese Stelle**, weil es die einzige Wissensquelle ist. Reihenfolge:

1. **Die Info-Karte aus `knoten_ref`** — genau das Nugget, das die Leitfrage beantwortet. `nuggets[].inhalt` liefert die Sachaussagen, `nuggets[].beispiel` die Beispielzeile, `nuggets[].fakten_anker` die belegten Werte. Was in der Karte nicht steht, steht auch nicht in der Loesung. Ein `fakten_anker` mit `lp_pruefen: true` (regional variabel) gehoert **nicht** als feste Aussage in die Loesung.
2. **`mindmap_aeste`** — die Pflicht-Aeste sind bereits die fachliche Soll-Struktur; eine K2-Leitfrage ist meist deren Ausformulierung.
3. **`mehrdeutigkeit.hint`** — bei Entscheidungs-Leitfragen liefert der Zielkonflikt die Zeilen `"Erwartet"` / `"Ebenfalls tragfaehig"` / `"Nicht tragfaehig"`.
4. **`dossier.sprachmodi_scaffolds[]` + `handlungsprodukt.musterloesung`** — bei LF4 ist die Loesung der *eine* Baustein, den LF4 verlangt, nicht das ganze Produkt (C4).

**Invarianten:**

- **Eine Loesung pro Leitfrage**, also 4 pro Herausforderung — dieselbe `nr`-Zuordnung wie `leitfragen[]`. Eine LF ohne `loesung` laesst die Folie unvollstaendig wirken.
- **3–6 `zeilen`, zusammen max. ~900 Zeichen `text`.** Akkordeon mit einem offenen Abschnitt; mehr passt nicht auf eine Folie (`hyperframes check` meldet sonst `canvas_overflow`). Gemessener EBA-Bestand: 266–482 Zeichen bei 5 Zeilen — die kurzen A2-Saetze lassen viel Rand.
- **Bloom-treu:** Bei `"Entscheiden"` ist die richtige Antwort nicht *eine* Option, sondern eine **begruendete** Wahl — dort verpflichtend eine Zeile `"Erwartet"` **und** mindestens eine Zeile `"Ebenfalls tragfaehig"` / `"Nicht tragfaehig"` / `"Beide tragfaehig"`. Bei EBA liegt die Decke auf K3, LF3/LF4 tragen die Entscheidung.
- **Register: LP-Text, nicht A2.** Die Loesung richtet sich an die Lehrperson und steht im neutralen Sachstil **ohne Anrede** — kein «Sie»-Imperativ, keine Possessiva `Ihre/Ihren/Ihrem`. Das Pronomen «sie» in dritter Person ist davon unberuehrt («Sie fuehren meist zur zentralen Aussage» = die Signalwoerter). **Ausnahme:** woertliche Musterformulierungen der Lernenden stehen in «Guillemets» und sind **dort A2-pflichtig** — sie sind das, was eine EBA-Klasse tatsaechlich schreiben koennen muss.
- **Kein Widerspruch** zu `[!tafelbild]`, `[!warnung]` und `musterloesung` — die Loesung ist deren fachlicher Kern, nicht eine zweite Lehrmeinung.
- **Kein Skript zum Vorlesen.** Die Zeilen sind der Massstab, an dem die Lehrperson die Antworten misst; Formulierungen der Lernenden duerfen abweichen, solange Quelle und eigene Verdichtung erkennbar sind. Diesen Rahmen setzt das Deck bereits in den Referentennotizen.
- Prosa-Feld → echte Umlaute Pflicht, kein Eszett (Schweizer ss).

### `mindmap_zentrum` / `mindmap_aeste`

Flat top-level. NICHT genested unter `mindmap.zentrum`. `mindmap_aeste` hat 4 Items, Ast 4 mit `optional: true`. Jeder Ast ist ein Objekt `{titel, punkte, optional}` — NICHT `label`/`inhalte`.

### `handlungsprodukt`

Pflichtfelder: `format`, `titel`, `format_detail`, `beschreibung`, `schritte`, `schreib_label`, `schreib_note`. 
- `format` (NICHT `typ`): aus `prinzip.herausforderungen[LETTER].handlungsprodukt_typ`
- **Single-Format-Pflicht (NEU in v1.2):** `format_detail` beschreibt EIN Format mit moeglichen Medium-Variationen (alle Variationen muessen denselben sprachmodus aktivieren). Format-Alternativen mit Modus-Wechsel sind verboten — siehe Check 17.
- `schritte`: Array of 5 `{label, hint}` Objekte (NICHT Strings)
- `schreib_label`: GROSSBUCHSTABEN + "HIER ERARBEITEN" (z.B. "ROLLENPORTRAIT HIER ERARBEITEN")
- `schreib_note`: `"-> wissen/{node_id_primary}"`
- `abgaben` (Cluster 6, additiv): Array von 1-3 Klartext-Strings, je eine konkrete Abgabe — z.B. `["Kanalbegründung (80–120 Wörter)", "Schreiben im gewählten Kanal (200–250 Wörter)"]`. Speist den "Das lieferst du ab"-Block (DocS-Callout + DOCX). Bei mehrteiligem Produkt jede Teil-Abgabe einzeln auffuehren.
- `scaffolding` (C6, additiv): Object `{satzanfaenge[], strategien[], struktur[]}` — je >=1 Eintrag, ausgerichtet am HP-Format + Output-Sprachmodus (`sprachmodus_ids`). Speist den Scaffolding-Block der Handlungsprodukt-Anleitung (Seite 6a). Beispiel rechte_C: `satzanfaenge: ["«Sehr geehrte/r …»", "«Gemäss OR Art. … gilt …»"]`, `strategien: ["Erst Stichworte sammeln, dann ausformulieren"]`, `struktur: ["Anlass – Absicht – Begründung – Schluss"]`.
- `musterloesung` (C7, additiv): Object `{hinweis, abschnitte[]}` — **ein vollstaendig ausgefuelltes Handlungsprodukt auf Stufe 3–4**, nicht eine Vorlage und nicht eine Beschreibung. Speist die Musterloesungs-Folie im Unterrichtsdeck (`src/lib/einheiten/deck-builder.ts`). Details und Invarianten: siehe unten.

#### `handlungsprodukt.musterloesung` (C7)

| Feld | Wert |
|---|---|
| `hinweis` | An die **Lehrperson**: Stufe des Beispiels + was daran exemplarisch ist. Erscheint NUR in den Referentennotizen, nie auf der Folie. Neutraler Sachstil, **nicht** A2-pflichtig. |
| `abschnitte[]` | 3–5 Objekte `{titel, zeilen[]}`. Die Abschnitte folgen der `scaffolding.struktur` des Produkts. |
| `abschnitte[].titel` | Kurz, benennt den Bauteil (`"Kategorie 1: Vorgaben"`, `"Meine Nachricht — sechs Sätze"`). |
| `abschnitte[].zeilen[]` | Objekte `{label?, text, quelle?}`. `text` ist Pflicht. |
| `zeilen[].label` | Optional, **max. ~24 Zeichen** — steht in einer 190px-Spalte. |
| `zeilen[].quelle` | Optional, **max. ~30 Zeichen** — Chip mit `white-space: nowrap`. Bei EBA die Dossier-Fundstelle (`"Info-Karte A-01"`), **nie** ein Lehrmittel-Kapitel: EBA hat kein Lehrmittel. |

**Invarianten (zusaetzlich zu den EFZ-Regeln):**

- **`abschnitte[].zeilen[].text` ist SuS-Prosa und faellt unter das A2-Gate** (`a2-language-rules.md`): max. 18 Woerter/Satz (ERR), Ø <= 12, aktiv, ein Gedanke pro Satz, kein Fachbegriff ohne Glossar-Eintrag. `hinweis` ist LP-Text und ausgenommen.
- **ICH-Form.** Die Musterloesung *ist* das Produkt der lernenden Person, nicht eine Anweisung an sie — also `"Ich ordne meine Unterlagen …"`, nie `"Ordnen Sie …"`. Die Sie-Form bleibt den Auftragsfeldern vorbehalten.
- **Jede Sachaussage haengt an einer Info-Karte.** `quelle` verweist auf `dossier.nuggets[]`; was im Dossier nicht steht, steht auch nicht in der Musterloesung. Das ist bei EBA schaerfer als bei EFZ, weil das Dossier die einzige Wissensquelle ist.
- **Tabellen-Produkte** (Checkliste, Uebersicht, Orientierungszettel — bei EBA die Mehrheit): ein `abschnitt` je Tabellen-Gruppe, eine `zeile` je Tabellenzeile, `label` = erste Spalte, `text` = restliche Spalten in ganzen Saetzen. Der letzte Abschnitt haelt die begruendete Auswahl bzw. die selbst gesetzte Regel (das ist der Stufe-4-Anteil).
- **Werte, die im echten Produkt variieren** (Loehne, Dokumentnamen, Ferienwochen), sind Beispielwerte. Der `hinweis` sagt das explizit und nennt, was stattdessen bewertet wird — sonst korrigiert die Lehrperson gegen eine erfundene Zahl.
- **Ein Abschnitt darf ~900 Zeichen `text` nicht ueberschreiten.** Das Deck rendert die Abschnitte als Akkordeon (immer nur einer offen); ein einzelner Abschnitt muss auf eine Folie passen. Als Richtwert traegt ein Abschnitt bis ~7 `zeilen`. `hyperframes check` meldet sonst `canvas_overflow`.
- Kein Widerspruch zum `[!tafelbild]`-Callout in `begleiter.md`.
- Prosa-Feld → echte Umlaute Pflicht, kein Eszett (Schweizer ss).

### `reflexion_fragen[]` (3 Items)

| Feld | Wert |
|---|---|
| `nr` | string `"R1"` / `"R2"` / `"R3"` |
| `text` | situationsspezifisch oder Template-Standard |
| `sub` | `null` |
| `feld_hoehe_mm` | `10` |

### `bewertungsraster[]` (4 Items — treibt die "Checkliste Vollständigkeit", C1)

Keine Transfer-Zeile mehr (der Transfer lebt im set-level Austausch-&-Transfer-Dokument). Jede Zeile hat `produkt`, optional `kriterium` (Renderer-Fallback) und `vollstaendig_wenn` (2-4 kurze Vollstaendigkeits-Bullets, abgeleitet aus dem Zweck des jeweiligen Produkts). `abgabe`/`gewicht` sind optional und werden NICHT mehr gerendert (duerfen entfallen).

| Produkt | vollstaendig_wenn (Beispiel-Bullets) |
|---|---|
| Leitfragen | "Alle 4 Leitfragen beantwortet", "Pro Antwort eine Quelle genannt" |
| Mindmap | "Zentrum und 4 Ast-Titel übernommen", "Pro Ast eigene Detail-Punkte ergänzt" |
| Handlungsprodukt | "Format/Umfang erfüllt", "Kernmerkmale des Produkts erfüllt" |
| Reflexion | "Alle 3 Reflexionsfragen beantwortet", "Transfer in den Lehralltag benannt" |

### `wochen_plan[]` (3 Items)

Jedes Item `{label, text, aktiv}`. Default-Texte:
- Woche 1: "Herausforderung lesen, LF1-LF2, Mindmap" (aktiv: true)
- Woche 2: "LF3-LF4, Handlungsprodukt" (aktiv: false)
- Woche 3: "Austausch (Set), Reflexion, Transfer" (aktiv: false)

### Prinzip-First-additive Felder

| Feld | Datentyp | Quelle |
|---|---|---|
| `prinzip_ref` | string | `{X.Y.Z}_{topic_slug}_prinzip` |
| `herausforderung` | object `{buchstabe, label}` | aus prinzip.herausforderungen[LETTER].herausforderung |
| `mehrdeutigkeit` | object `{explizit, trade_off, hint}` | trade_off ∈ prinzip.mehrdeutigkeits_architektur.trade_off_raum |
| `dekontextualisierung` | object `{frage, ziel}` | ziel verweist auf prinzip.dekontextualisierungs_anker |
| `zirkularitaet_anker` | object | aus prinzip.zirkularitaet |
| `quellen_anker` | array | aus prinzip.quellen_anker.chapters |
| `lernfortschritt` | object `{kriterien[], scaffold_90, scaffold_100}` | formativ; `kriterien[]` (kriterium + indikator) treibt die **Gütekriterien**-Checkliste auf der Handlungsprodukt-Seite (C6); `scaffold_90/100` = Differenzierung (bleibt unter lernfortschritt) |

### Neue 3er-Felder

#### `prinzip_handoff` (NEU)

```json
{
  "kernkonzept": "{3-7 Woerter — Beitrag dieser Herausforderung zum roten Faden}",
  "lehrmittel_anker": "{Seitenreferenz, z.B. 'S. 73-77'}",
  "kn_aktivierung": "{Satz, wie das Prinzip in der KN-Hybrid-Herausforderung wieder auftaucht}",
  "transfer_check": "{Satz: was muss Lernende erkennen fuer KN-Transfer?}"
}
```

#### `sk_anker` (NEU, Pflicht-Invariante)

```json
[
  {"sk": 6, "wo": "leitfragen[3] (fokussierte Sprachform-Teilaufgabe zum Output-Modus) + handlungsprodukt.scaffolding"},
  {"sk": 11, "wo": "leitfragen[2].entscheiden — genuiner Konflikt zwischen A und B"}
]
```

**Invariante: `sk_anker.length === nrlp.sk.length`**. Wer keine konkrete Verortung formulieren kann, traegt die SK nicht in `nrlp.sk` ein. Das eliminiert SK9-Drift bei der Generierung.

### Felder, die NICHT mehr existieren

- `gruppenpuzzle_fragen[]` — wandert in `set.austausch_phase`
- `vorgespraech_fragen[]` — wandert vollstaendig weg (im 3er-Set durch KN ersetzt)

---

## 2. Prinzip JSON

Siehe `assets/prinzip-template.json` und `references/prinzip-architecture.md`. Zentrale Pflichtfelder:

- `id`, `modul`, `kompetenz_nr`, `topic_slug`, `lehrgang`
- `kern_kompetenzversprechen` (ICH-Satz, K3/K4-Verb)
- `herausforderungen` mit GENAU 3 Eintraegen A/B/C, je `{herausforderung, konfliktart, handlungsprodukt_typ, transferrable}`
- `sk_pro_situation` mit Eintraegen A/B/C
- `sk_schnittmenge_kn.primary` (kein secondary mehr)
- `aspekte` (Object aspekt → R-Stufe)
- `modi_units`, `modi_kn`
- `mehrdeutigkeits_architektur.trade_off_raum` (>=2 Eintraege) und `.verbindlich`
- `dekontextualisierungs_anker` mit `anker_statement` + `transferfeld`
- `zirkularitaet`
- `quellen_anker.chapters[]`
- `persona_pool_units` (3 berufe + 3 orte)
- `persona_pool_kn_neu` (2 berufe + 2 orte, disjunkt von _units)
- `hybrid_situation_spec` (NEU)

---

## 3. Set JSON

Siehe `assets/set-template.json`. Zentrale Felder:

- `id` = `{X.Y.Z}_{topic_slug}_set`
- `prinzip_ref`, `kn_ref` (kn_ref zeigt auf zukuenftige Phase-4-Datei)
- `herausforderungen[]` (3 Eintraege)
- `konzept_progression[]` (3 Eintraege — was bringt jede Herausforderung bei in der Lesereihenfolge)
- `austausch_phase` — template-konstant; drei waehlbare Sozialformen im set-level "Austausch & Transfer"-Dokument (C8): `einzelauftrag` (EA, NEU), `gruppenpuzzle` ?? `gruppenarbeit_jigsaw` (GA, 3 Runden), `plenum` ?? `einzelarbeit_plenum` (PL). Renderer liest die neuen Aliasse bevorzugt, faellt auf die Altnamen zurueck.
- `dekontextualisierungs_aufgabe` — template-konstant Auftrag + Format, set-spezifisch `ziel`; bildet zusammen mit den drei `sit.dekontextualisierung.frage` (als Beispiele) die Transfer-Haelfte des Austausch-Dokuments

---

## 4. KN JSON

Siehe `assets/kn-template.json` und `references/kn-architecture.md`. Zentrale Pflichtfelder:

- `id`, `set_ref`, `prinzip_ref`, `anchored_situations[]` (3 Eintraege)
- `dominanter_aspekt` — bestimmt Kriterium-3-Wording in der Rubrik
- `hybrid_situation` — eine Szene mit Persona aus persona_pool_kn_neu, max 120 Woerter, mind. 1 Trade-off aktiviert
- `kn_typen[]` mit GENAU 3 Eintraegen in dieser Reihenfolge: `fachgespraech`, `mini_case_schriftlich`, `werkschau_transfer`
- `rubrik_shared` mit 4 Kriterien (2 SuK + 2 Ges), je 4 Stufen, 3 Niveaubaender

---

## 5. Default-Werte zum Auffuellen

### `leitfragen_intro`

> `"Bearbeite die vier Leitfragen schriftlich. Nutze das Lehrmittel Kap. {X.Y} als Grundlage."`

### `reflexion_fragen`-Default-Texte

| nr | text |
|---|---|
| R1 | "Was hat mich in dieser Einheit ueberrascht?" |
| R2 | "Wo in meinem Lehralltag ist dieses Wissen relevant?" |
| R3 | "Was aendere ich konkret — oder was pruefe ich beim naechsten Mal?" |

Diese sind Template-konstant. Pro Herausforderung duerfen die Texte angepasst werden, aber die nr-Reihenfolge bleibt.

---

## Reform-Update 2026-06 — neue Felder (additiv)

### `nrlp`-Block (Cluster 1)
| Feld | Datentyp | Quelle | Anmerkung |
|---|---|---|---|
| `kompetenz_id` | string | = `nr` | maschinenlesbar, z.B. "1.1.1" |
| `lebensbezug_id` | string | = `lebensbezug` | z.B. "1.1" |
| `kompetenz_text` | string | nRLP verbatim | Klartext, NICHT umformulieren/umbenennen |
| `lebensbezug_text` | string | nRLP verbatim | Klartext |
| `sprachmodus_ids` | array<string> | `references/sprachmodus-ids.md` | parallel zu `sprachmodi[]`, SM1-SM9 |

### `quellen_anker[]` (Cluster 4)
| Feld | Datentyp | Anmerkung |
|---|---|---|
| `unterueberschrift` | string | Zwischentitel auf der Buchseite; Renderer fuehrt mit Kapitel-Titel |

### `kn.hybrid_situation` (Cluster 2)
| Feld | Datentyp | Anmerkung |
|---|---|---|
| `definition_kurz` | string | SuS, 1 Satz, bei Erstverwendung "Hybrid-Herausforderung" |
| `definition_lang` | string | LP, ausfuehrlicher |

---

## 6. EBA-2er-Kalibrierung (`lehrgang=EBA_2J`) — verbindlicher Override

Diese Datei ist die EBA-Fassung. Feldnamen + Datentypen identisch; nur die folgenden Werte aendern
sich. Ueberall, wo oben „A/B/C", „Lehrmittel", „wochen: 3" oder „K4" steht, gilt fuer EBA:

**Mission JSON (§1):**

- `lehrgang` Default **`EBA_2J`**.
- `situation` / `buchstabe` ∈ **{A, B}** (C entfaellt). Farb-Triple nur **A=rot, B=blau**.
- `wochen`-Feld **entfaellt** (kein Fixwert — EBA heterogen). `wochen_plan` ist **optional/leer** (`[]`),
  von der LP befuellbar.
- `leitfragen[].knoten_ref` → **`"Dossier | Info-Karte {LETTER}-NN"`** (statt `"Kap. … | S. …"`).
- `leitfragen[].bloom`-Reihenfolge: **Verstehen / Verstehen / Anwenden / Entscheiden** (K-Decke K3).
  K-Stufe-Mapping unveraendert, aber **K4 (Analysieren) ist NICHT Pflicht** — `WARN_BLOOM_TOO_LOW`
  greift erst, wenn keine LF K3 erreicht. K4 nur als 100%-Extension.
- `quellen_anker[]` → `{ref:"Dossier", titel, unterueberschrift, nugget_ref:"Info-Karte {LETTER}-01",
  fuer_leitfrage[]}` (kein `seiten`).
- `prinzip_handoff.lehrmittel_anker` → umbenannt in **`dossier_anker`** („Dossier Nuggets
  {LETTER}-01..0N").
- `handlungsprodukt.scaffolding`: je Gruppe **>=2** Eintraege (Check 23 verschaerft), gekoppelt an die
  Dossier-Sprachmodi-Scaffolds.

**Prinzip JSON (§2):** `herausforderungen` GENAU **2** (A/B); `sk_pro_situation` 2 Eintraege;
`sk_schnittmenge_kn.primary` = SK in beiden; `persona_pool_units` **2+2**; `persona_pool_kn_neu` 2+2;
`hybrid_situation_spec.must_combine_herausforderungen` = `["A","B"]`. Bloom-Zielprofil LF1-2 K2 /
LF3-4 K3. `quellen_anker.dossier_nuggets` statt `chapters`.

**Set JSON (§3):** `herausforderungen[]` **2**; `konzept_progression[]` **2**; Auftraege in
**Sie-Form**; „Begriffe aus dem Dossier" statt Lehrmittelbegriffe.

**KN JSON (§4):** `anchored_situations[]` **2**; `kn_typen[]` 3 Eintraege (Fachgespraech = Primaerform,
Mini/Werkschau vereinfacht, K-Decke K3); `rubrik_shared` SuK-Kriterien behalten die Namen
**„Fachkorrektheit" + „Argumentation"**, mit **integrierten** Konventionen + Sprachbewusstheit (keine
Normen); Ges = aspektabhaengiges „…-Prinzip" + „Position/Werthaltung".

**Default `leitfragen_intro` (§5):**
> `"Bearbeiten Sie die vier Leitfragen schriftlich. Nutzen Sie das Dossier zu Herausforderung {LETTER} als Grundlage."`

**Default `reflexion_fragen` (§5):** R2 „Wo in meinem Lehralltag ist dieses Wissen wichtig?",
R3 „Was mache ich beim naechsten Mal konkret anders?" (A2-vereinfacht).

---

## 7. Dossier JSON (NEU, EBA-only)

Siehe `assets/dossier-template.json` und `references/dossier-architecture.md`. Datei:
`src/data/einheiten/{X.Y.Z}_{topic_slug}/dossier.json`. Zentrale Pflichtfelder:

- `id` = `{X.Y.Z}_{topic_slug}_dossier`, `set_ref`, `lehrgang: "EBA_2J"`, `sprachniveau: "A2"`
- `nuggets[]` — je `{id, tag(A|B|AB|transfer), titel, inhalt, beispiel, fuer_leitfrage[],
  fakten_anker[], glossar_refs[]}`; >=2-3 pro Herausforderung, jede Leitfrage gedeckt
- `nuggets[].fakten_anker[]` — `{behauptung, wert, quelle, validiert:bool, lp_pruefen:bool}`;
  nach Phase-7-Web-Validierung nie beides false (`WARN_FAKT_UNGEPRUEFT`)
- `sprachmodi_scaffolds[]` — je `{tag, sm_id, modus_label, satzanfaenge[], strategien[], struktur[],
  so_gehst_du_vor[]}`; `sm_id` == Output-Modus der Herausforderung gleichen Tags
- `transfer_wissensblatt` — `{fachsystematik, prinzip_in_einfach, austausch_scaffolds:{satzanfaenge[],
  so_tauschst_du_aus[]}}` (set-weit)
- `glossar[]` — `{id, begriff, erklaerung_a2, beispiel}`; jeder in einem `nugget.inhalt` verwendete
  Fachbegriff steht hier (`ERR_A2_BEGRIFF_OHNE_GLOSSAR`)
- `template: "dossier_eba_v1"` (reserviert — Renderer kennt es noch nicht)

**Alle Prosa-Felder A2** (Pre-Write gegen `a2-language-rules.md`). **Backward Design:** jede Leitfrage +
jeder KN-Anspruch ist gedeckt (`ERR_DOSSIER_GAP`, siehe `dossier-architecture.md` §6).
