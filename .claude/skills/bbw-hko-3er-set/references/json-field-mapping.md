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
| `knoten_ref` | string | `"Kap. {X.Y} | S. {a}-{b}"` mit Pipe-Separator. **Richtwert 3 Seiten**, mehr nur nach Ruecksprache — siehe Praezisions-Regel unten |
| `text` | string | NICHT `frage` |
| `feld_hoehe_mm` | integer | `15` (konstant) |
| `loesung` | object | **C10, additiv** — Lehrpersonen-Loesung zu genau dieser Leitfrage. Speist die Deck-Folie «Loesung der Leitfragen». Details unten |

K-Stufe-zu-bloom-Mapping:
- K2 → `"Verstehen"`
- K3 (Entscheiden) → `"Entscheiden"` (bei "Waehle...", "Entscheide...")
- K3 (Anwenden) → `"Anwenden"` (sonst)
- K3+ (Formulieren) → `"Formulieren"` (bei "Formuliere...", "Verfasse...", "Schreibe...")
- K4 → `"Analysieren"`

Mindestens eine LF auf K3+/K4 — sonst 5. LF ergaenzen.

**LF4-Scoping (C4):** LF4 trainiert den Output-Sprachmodus (`nrlp.sprachmodus_ids`) als *fokussierte Teil-/Sprachform-Aufgabe* — EIN Baustein, der ins Handlungsprodukt einfliesst — und reproduziert NIE das ganze Handlungsprodukt. Methode passend zum Output-Modus aus `references/sprachfoerderung-methoden.md` waehlen. Beispiele: "Schreibe einen Block deines Spickzettels …", "Schreibe die Spalte «Rechtsfolge» als Wenn-dann-Mustersatz …", "Formuliere drei Ich-Botschaften …". Rezeption (SM3) bleibt bei LF1-3. Siehe Coherence-Check 20.

#### `leitfragen[].loesung` (C10)

Die **Antwort** auf die Leitfrage, formuliert fuer die Lehrperson. Sie speist die Unterfolie `{a|b|c}-leitfragen-loesung` im Unterrichtsdeck (`src/lib/einheiten/deck-builder.ts`) — dieselbe Akkordeon-Mechanik wie `handlungsprodukt.musterloesung`, eine Leitfrage pro Klick. **Sie wird nie im Schuelerbogen (`DocS`) gerendert** und darf deshalb den Massstab offen aussprechen.

**Nicht zusaetzlich in `begleiter.md` schreiben.** `loadEinheit` spiegelt die Loesungen beim Laden als `> [!loesung]`-Callouts in den Begleiter (`src/lib/einheiten/begleiter-loesungen.ts`) — pro Herausforderung ein Kapitel «Loesungen der Leitfragen» vor dem Tafelbild. Handgeschriebene Loesungen im Markdown waeren eine zweite Quelle fuer denselben Satz und wuerden irgendwann abweichen.

Abgrenzung zu den Nachbarfeldern — die drei sagen Verschiedenes und duerfen sich nicht doppeln:

| Feld | Antwortet auf |
|---|---|
| `leitfragen[].loesung` (C10) | «Was ist auf **diese** Frage eine tragfaehige Antwort?» — fachlicher Massstab pro LF |
| `handlungsprodukt.musterloesung` (C7) | «Wie sieht das **fertige Produkt** aus?» — ein ausgefuelltes Exemplar |
| `[!coaching]` / `[!warnung]` im Begleiter | «Wie **begleite** ich die Lernenden dorthin?» — Intervention, nicht Inhalt |

| Feld | Wert |
|---|---|
| `kern` | Kurzlabel, **max. ~55 Zeichen** — steht auf dem Aufklapp-Titel hinter `LF {nr} · {bloom} — `. Benennt die Sache, wiederholt nicht die Frage (`"Die zwei unzulässigen Punkte"`, nicht `"Antwort auf Leitfrage 2"`). |
| `zeilen[]` | 3–6 Objekte `{label?, text, quelle?}`. `text` ist Pflicht. |
| `zeilen[].label` | Optional, **max. ~24 Zeichen** — 190px-Spalte. Benennt die Rolle der Zeile: den Bauteil (`"Tatbestand"`, `"Behauptung"`, `"Sachinhalt"`), die Wertung (`"Erwartet"`, `"Ebenfalls tragfähig"`, `"Nicht tragfähig"`) oder die Formregel (`"Massstab"`, `"Häufiger Fehler"`). |
| `zeilen[].quelle` | Optional, **max. ~30 Zeichen**, Chip mit `white-space: nowrap`. Nur die Fundstelle (`"OR 321e"`, `"ArG 31"`, `"Kap. 19.2"`), keine Saetze. |

**Woher der Inhalt kommt — Datenhebung, nicht Neuerfinden.** Die Loesung wird aus den Quellen destilliert, die im Set ohnehin schon verankert sind, in dieser Reihenfolge:

1. **Lehrmittel-Abschnitt aus `knoten_ref`** — genau die Seiten, die die Leitfrage beantworten. Die Sachaussagen und die Artikel-/Kapitelverweise der `quelle`-Chips stammen von dort, **wortwoertlich verifiziert, nie aus dem Gedaechtnis**. Was auf diesen Seiten nicht steht, steht auch nicht in der Loesung.
2. **`mindmap_aeste`** — die Pflicht-Aeste sind bereits die fachliche Soll-Struktur; eine K2-Leitfrage ist meist deren Ausformulierung mit Quellen.
3. **`mehrdeutigkeit.hint`** — bei Entscheidungs-Leitfragen (K3 «Entscheiden») liefert der Zielkonflikt die Zeilen `"Erwartet"` / `"Ebenfalls tragfähig"` / `"Nicht tragfähig"`.
4. **`handlungsprodukt.scaffolding.struktur` + `musterloesung`** — bei der Formulier-Leitfrage (LF4) ist die Loesung der *eine* Baustein, den LF4 verlangt, nicht das ganze Produkt (C4).

**Invarianten:**

- **Eine Loesung pro Leitfrage**, also 4 pro Herausforderung — dieselbe `nr`-Zuordnung wie `leitfragen[]`. Lieber knapp als luecken­haft: eine LF ohne `loesung` laesst die Folie unvollstaendig wirken.
- **3–6 `zeilen`, zusammen max. ~900 Zeichen `text`.** Die Folie ist ein Akkordeon mit einem offenen Abschnitt; mehr passt nicht auf eine Folie (`hyperframes check` meldet sonst `canvas_overflow`). Gemessener Bestand: 646–881 Zeichen bei 5–6 Zeilen sitzen mit Rand.
- **Bloom-treu:** Die Loesung beantwortet die Frage auf **der Stufe, die `bloom` verlangt**. Bei `"Entscheiden"` ist die richtige Antwort nicht *eine* Option, sondern eine **begruendete** Wahl — deshalb dort verpflichtend eine Zeile `"Erwartet"` **und** mindestens eine Zeile `"Ebenfalls tragfähig"` oder `"Nicht tragfähig"`. Eine Entscheidungsfrage mit genau einer zulaessigen Antwort war keine Entscheidungsfrage.
- **Kein Widerspruch** zu `[!tafelbild]`, `[!warnung]` und `musterloesung` — die Loesung ist deren fachlicher Kern, nicht eine zweite Lehrmeinung.
- **Kein Skript zum Vorlesen.** Die Zeilen sind der Massstab, an dem die Lehrperson die Antworten der Lernenden misst; Formulierungen der Lernenden duerfen abweichen, solange Quelle und eigene Verdichtung erkennbar sind. Diesen Rahmen setzt das Deck bereits in den Referentennotizen — die Daten muessen ihn nur einhalten.
- **Sprachform:** neutraler Sachstil, keine Anrede. Woertliche Rede (Musterformulierungen der Lernenden) steht in «Guillemets». Prosa-Feld → echte Umlaute Pflicht, kein Eszett.

---

### Praezisions-Regel fuer `knoten_ref` (C9)

`knoten_ref` beantwortet **«wo steht die Antwort auf genau diese Leitfrage»** — nicht «welches Kapitel gehoert zum Thema». Das ist die Aufgabe von `quellen_anker[]`, das bewusst breiter bleiben darf.

**Richtwert 3 Seiten.** Die Seitenzahlen stammen aus echten `[seite: NN]`-Markern der Kapiteldatei; nie schaetzen, nie den ganzen Kapitelbereich einsetzen.

Mehr als 3 Seiten sind **erlaubt, wenn der Inhalt tatsaechlich verteilt steht** — aber nie stillschweigend: die Skill legt jeden solchen Fall Pietro einzeln vor und schreibt erst nach seinem Entscheid (Format und Quote in Check 31). Die Quote — hoechstens eine Ausnahme pro Herausforderung, zwei pro Einheit — ist der Mechanismus, der verhindert, dass aus der Ausnahme wieder die Regel wird.

Vorgehen beim Setzen:
1. Kapiteldatei oeffnen, Abschnittsgliederung lesen (`##`/`###`/`####`; `<!-- header: … -->` sind Kolumnentitel und irrelevant).
2. Den Abschnitt suchen, der die Leitfrage beantwortet — **ueber Ueberschriften, nicht ueber Worthaeufigkeit im Fliesstext**. Generische Woerter wie «schreiben», «Begruendung», «Beispiel» stehen in Methodenkapiteln auf jeder Seite und fuehren in die Irre.
3. Die Seiten dieses Abschnitts eintragen.

**Deckt die Leitfrage mehrere getrennte Abschnitte ab, ist meist die Leitfrage zu breit geschnitten** — pruefe zuerst, ob sie sich teilen laesst, bevor du die Spanne aufziehst. Wo eine Teilung den didaktischen Bogen zerstoert, ist eine breitere Spanne vertretbar; sie muss dann aber **alle** Teile der Frage abdecken. Eine Verengung, die die halbe Frage abschneidet, ist schlimmer als ein zu breiter Anker.

Erfahrungswert aus dem Bestand: Bei 4 Seiten liegt meist ein echter Lehrmittel-Sachverhalt vor (zwei benachbarte Abschnitte, die beide gebraucht werden — etwa Pflichten der Lernenden und der Berufsbildenden in Kap. 1.4). Ab 5 Seiten war bisher praktisch immer die Leitfrage zu breit, nicht das Lehrmittel zu verstreut.

**Reflexions- und Beurteilungsfragen haben oft gar keine Lehrmittelstelle** (z.B. «Was hat Ihnen die schriftliche Form ermoeglicht?»). Dann ist `knoten_ref` leer zu lassen, statt eine Fundstelle vorzutaeuschen, die es nicht gibt. Ein Anker, der auf eine Seite ohne Antwort zeigt, kostet die Lernenden mehr Zeit als gar keiner.

Gegenprobe vor dem Schreiben: Wuerde eine lernende Person, die genau diese Seiten aufschlaegt, die Frage beantworten koennen — ohne weiterzublaettern und ohne Fuellmaterial zu ueberspringen?

### `mindmap_zentrum` / `mindmap_aeste`

Flat top-level. NICHT genested unter `mindmap.zentrum`. `mindmap_aeste` hat 4 Items, Ast 4 mit `optional: true`. Jeder Ast ist ein Objekt `{titel, punkte, optional}` — NICHT `label`/`inhalte`.

### `handlungsprodukt`

Pflichtfelder: `format`, `titel`, `format_detail`, `beschreibung`, `schritte`, `schreib_label`, `schreib_note`. 
- `format` (NICHT `typ`): aus `prinzip.herausforderungen[LETTER].handlungsprodukt_typ`
- **Single-Format-Pflicht (NEU in v1.2):** `format_detail` beschreibt EIN Format mit moeglichen Medium-Variationen (alle Variationen muessen denselben sprachmodus aktivieren). Format-Alternativen mit Modus-Wechsel sind verboten — siehe Check 17.
- `schritte`: Array of 5 `{label, hint}` Objekte (NICHT Strings)
- `schreib_label`: GROSSBUCHSTABEN + "HIER ERARBEITEN" (z.B. "ROLLENPORTRAIT HIER ERARBEITEN")
- `schreib_note`: `"-> wissen/{node_id_primary}"`
- `abgaben` (Cluster 6, additiv): Array von 1-3 Klartext-Strings, je eine konkrete Abgabe — z.B. `["Kanalbegründung (80–120 Wörter)", "Schreiben im gewählten Kanal (200–250 Wörter)"]`. Speist den "Das liefern Sie ab"-Block (DocS-Callout + DOCX). Bei mehrteiligem Produkt jede Teil-Abgabe einzeln auffuehren.
- `scaffolding` (C6, additiv): Object `{satzanfaenge[], strategien[], struktur[]}` — je >=1 Eintrag, ausgerichtet am HP-Format + Output-Sprachmodus (`sprachmodus_ids`). Speist den Scaffolding-Block der Handlungsprodukt-Anleitung (Seite 6a). Beispiel rechte_C: `satzanfaenge: ["«Sehr geehrte/r …»", "«Gemäss OR Art. … gilt …»"]`, `strategien: ["Erst Stichworte sammeln, dann ausformulieren"]`, `struktur: ["Anlass – Absicht – Begründung – Schluss"]`.
- `musterloesung` (C7, additiv): Object `{hinweis, abschnitte[]}` — **ein vollstaendig ausgefuelltes Handlungsprodukt auf 2–3 Punkten**, nicht eine Vorlage und nicht eine Beschreibung. Speist die Musterloesungs-Folie im Unterrichtsdeck (`src/lib/einheiten/deck-builder.ts`). Details und Invarianten: siehe unten.

#### `handlungsprodukt.musterloesung` (C7)

| Feld | Wert |
|---|---|
| `hinweis` | Ein Satz an die **Lehrperson**: Niveau des Beispiels + was daran exemplarisch ist. Erscheint NUR in den Referentennotizen, nie auf der Folie. |
| `abschnitte[]` | 3–5 Objekte `{titel, zeilen[]}`. Die Abschnitte folgen der `scaffolding.struktur` des Produkts (z.B. Anlass / Absicht / Begruendung / Schluss). |
| `abschnitte[].titel` | Kurz, benennt den Bauteil (`"Begründung nach 3B"`, `"Fall 1 — Samstagsfahrt"`). |
| `abschnitte[].zeilen[]` | Objekte `{label?, text, quelle?}`. `text` ist Pflicht. |
| `zeilen[].label` | Optional, **max. ~24 Zeichen** — steht in einer 190px-Spalte. Fuer Bauteile (`"Behauptung"`, `"Tatbestand"`, `"Ich sage"`). |
| `zeilen[].quelle` | Optional, **max. ~30 Zeichen** — wird als Chip mit `white-space: nowrap` gerendert. Nur die Fundstelle (`"OR 321e"`, `"Kap. 17.3, S. 396"`), keine Saetze. |

**Invarianten:**

- Die Musterloesung erfuellt `format_detail` wirklich: geforderte Wortzahl, geforderte Bauteile, geforderte Quellenzahl. Wenn `format_detail` „200–300 Wörter" sagt, hat der Text auch ungefaehr so viele — `hinweis` nennt die Zahl.
- **Ein Abschnitt darf ~900 Zeichen `text` nicht ueberschreiten.** Das Deck rendert die Abschnitte als Akkordeon (immer nur einer offen); ein einzelner Abschnitt muss auf eine Folie passen. `hyperframes check` meldet sonst `canvas_overflow`.
- Kein Widerspruch zum `[!tafelbild]`-Callout in `begleiter.md` — die Musterloesung ist dessen ausformulierte Fassung.
- Fachlich nur das behaupten, was `quellen_anker` und Lehrmittel hergeben. Wo die Rechtslage offen ist, macht die Musterloesung das **explizit** (das ist der Stufe-4-Anteil, siehe `mehrdeutigkeit.hint`).
- Prosa-Feld → echte Umlaute Pflicht, kein Eszett.

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
- `lehrgang` — einwertig und kanonisch (steuert Datensatz-Aufloesung + EBA-Rendering)
- `lehrgaenge[]` — **optional**, alle gueltigen Lehrgaenge (nur Katalog-Filter + Anzeige). Nur setzen, wenn JEDE abgedeckte Kompetenz im zweiten Datensatz unter DERSELBEN Nummer mit DEMSELBEN Text steht. Identisch in `nrlp_3j`/`nrlp_4j` sind u. a. die Lebensbezuege 1.1, 1.2, 2.1, 2.3, 3.2, 3.3; **nicht** identisch ist 3.1 (3J = Budget, 4J = Werbung) und 2.2.3 (nur 3J). Weglassen = `[lehrgang]`. Geprueft von `scripts/sync-einheiten-nrlp.mjs`.
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
- `rubrik_shared` mit 4 Kriterien (2 SuK + 2 Ges), je 4 Punktbaender (Skala 0–3), 3 Niveaubaender

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
