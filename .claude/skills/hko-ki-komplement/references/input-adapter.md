# Input-Adapter — bbw-hko-Unit-JSONs → Generierungs-Inputs

Diese Skill erzeugt KEINE Unit; sie liest eine fertige und destilliert daraus die
Inputs für Scoring + die drei KI-Dokumente. Quelle der Wahrheit ist die
**bestehende** Unit im Ordner `src/data/einheiten/{X.Y.Z}_{slug}/`.

## 1. Welche Dateien lesen

| Datei | Pflicht | Wofür |
|---|---|---|
| `prinzip.json` | ja | sk_targets, aspekte, trade_offs, zirkularitaet, dekontextualisierungs_anker, kern_kompetenzversprechen, lehrgang, modul |
| `kn.json` | ja | hybrid_situation (= Transfer-Szene), kn_typen, rubrik_shared, anchored_situations, dominanter_aspekt |
| `herausforderung_A/B/C.json` | A/B Pflicht, C bei EFZ | Handlungsprodukt-Typen, modul_titel, nrlp |
| `set.json` | optional | einheit_titel |

## 2. Mapping-Tabelle (verbindlich)

| Generierungs-Input | bbw-hko-Pfad |
|---|---|
| `sk_targets` (Quote-SK) | `prinzip.sk_schnittmenge_kn.primary` (Array von Nummern) |
| SK-Klartext für `nrlp_anker` | `sk_targets` → kanonische Kurznamen (siehe `src/lib/sk-labels.generated.ts`: 4=In Teams arbeiten, 6=Standpunkte begründen, 7=Verständnis fördern, 11=Mit Mehrdeutigkeiten umgehen, …) |
| `aspekte` | Keys von `prinzip.aspekte` (z. B. Recht, Ethik, «Identität und Sozialisation», «Technologische und digitale Transformation») |
| Handlungsprodukt-Typen | `prinzip.herausforderungen[A/B/C].handlungsprodukt_typ` (Kurzform) + ggf. `herausforderung_X.handlungsprodukt.{format,titel,beschreibung}` |
| Trade-off-Raum | `prinzip.mehrdeutigkeits_architektur.trade_off_raum[]` |
| Zukunftsbezug (für `ai_zeitkapsel`) | `prinzip.zirkularitaet.r2_voraussicht` / `r3_voraussicht` |
| **Transfer-Prinzip** | `prinzip.dekontextualisierungs_anker.anker_statement` (das destillierte Prinzip) |
| **Transfer-Szene** (für `bezug` + Lernbegleiter-Disjunktheit) | `kn.hybrid_situation` (`titel`, `text`, `aktivierte_trade_offs`, `alignment_note.herausforderungen_mapping`) |
| Kompetenzversprechen | `prinzip.kern_kompetenzversprechen` (identisch `kn.kern_kompetenzversprechen`) |
| KN-Typen | `kn.kn_typen[].{typ,label}` (z. B. fachgespraech, mini_case_schriftlich, werkschau_transfer) |
| KN-Rubrik | `kn.rubrik_shared.kriterien[]` (`{name, dimension}`), gruppiert nach `dimension` (SuK/Ges) |
| `anchored_situations` | `kn.anchored_situations` (Liste der hf-IDs) |
| modul / modul_titel / thema / lehrgang | `herausforderung_A.modul` / `…modul_titel` / `nrlp.themen[0]` / `prinzip.lehrgang` |

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
- Sprache: A2-nah halten (kürzere Sätze) — nicht verpflichtend hart, aber der
  Lernbegleiter ist learner-facing und sollte für EBA einfach bleiben.

## 5. Fehler

Fehlt `prinzip.json` oder `kn.json` → `ERR_INPUTS` und konkret nennen, was fehlt
(die Skill erzeugt keine Unit-Teile, sie ergänzt nur).
