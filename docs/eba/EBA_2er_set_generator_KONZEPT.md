# Konzept-Handoff: `hko-2er-EBA-set-generator`

**Stand:** 2026-06-17
**Autor der Methode:** Pietro (BBW, Kernteam 1) · Architektur-Partner: Claude
**Zweck:** Vollstaendige Spezifikation fuer einen EBA-Ableger des `hko-3er-set-generator`.
Diese Datei ist die Vorlage, gegen die der neue Skill gebaut wird. Es wird hier **nichts generiert** —
nur spezifiziert.
**Sprache:** Swiss Standard German, kein Eszett (immer ss).

---

## 0. Ausgangslage und kanonische Fakten

Das EFZ-System (`hko-3er-set-generator`) erzeugt pro Kompetenz ein 3er-Set
(Prinzip + 3 Herausforderungen + Set + KN + Teacher-HTML + Begleiter) und setzt ein
**vorhandenes Lehrmittel** voraus. Fuer EBA gibt es kein Lehrmittel — der neue Skill
muss die Wissensinhalte **selbst generieren und als separates Dossier mitliefern**.

### Kanonische Quellen (Reihenfolge bei Konflikt)

1. `rahmenlehrplan-allgemeinbildung-9-april-25.txt` — rechtliche Quoten, Konventionen
2. `nrlp_2j.json` — kantonaler EBA-Schullehrplan, finaler Erlass `2026.06-bildungsrat`
3. `ABU_ASSESSMENT_QUICK_REFERENCE_v2.md` / `_FRAMEWORK_v2.md` — BBW-Synthese

### EBA-Fakten, die das Design tragen

| Fakt | Quelle | Konsequenz |
|---|---|---|
| EBA = 2 Jahre, praktisch ausgerichtet, niederschwellig | RLP, Berufsbildung.ch | tieferes K-Fenster, mehr Scaffold |
| Pro Thema: min. 2 SK / 2 Aspekte / 1 Modus | RLP Z.791 | Quoten-Untergrenze fuer das Set |
| Schwerpunkt-Modi: Rez muendl/schriftl, Prod + Int muendlich | RLP Z.791 | Fachgespraech als KN-Default |
| Konventionen + Sprachbewusstheit (KEINE Normen) | RLP Z.791, Framework Paragraph 9 | SuK-Kriterien anders als EFZ |
| Kumulativ bis Abschluss: alle SK + alle 8 Aspekte | RLP Z.791 | Coverage liegt voll auf den 8 Themen |
| **Keine Schlussarbeit, keine Schlusspruefung** | RLP Paragraph 6.2/6.3 (nur 3J/4J) | kein SA-Sammelbecken; KN pro Einheit traegt alles |
| 8 Themen, je 22 Lektionen, je 2 Lebensbezuege | `nrlp_2j.json` | flache, gleichgewichtete Struktur |
| Sprachniveau der Lernenden | EBA-Profil | Dossier + Auftraege max. A2 GER |

### nRLP-2J-Themen (Referenz)

| Nr | Titel | LJ |
|---|---|---|
| 1 | Ins Berufsleben einsteigen | 1 |
| 2 | Bewusst konsumieren und handeln | 1 |
| 3 | Sicherheit und Gesundheit | 1 |
| 4 | Medien und digitale Welt | 1 |
| 5 | Meinung bilden und mitgestalten | 2 |
| 6 | Vertraege verstehen – fair handeln | 2 |
| 7 | Arbeit und Zukunft | 2 |
| 8 | Kultur und Kunst | 2 |

Anders als 3J/4J: kein dediziertes Schlussarbeit-Thema. Die SA-Zeile fuer EBA in
Quick Ref Paragraph 3 (2/2/3) betrifft nur QV-Wiederholer/Externe (RLP Z.716), nicht
regulaere EBA-Lernende — sie ist **keine** Designgrundlage hier.

---

## 1. Designentscheidungen (festgelegt mit Pietro)

| # | Weiche | Entscheidung |
|---|---|---|
| 1 | Set-Groesse | **2er-Set**: 2 Herausforderungen (A/B) + Transfer + KN |
| 2 | K-Fenster | **K2-K3**, K3 als Decke, K4 nur als 100%-Extension |
| 3 | Dichte | weniger dicht, deutlich mehr Scaffolding |
| 4 | Mehrdeutigkeit | bleibt, aber stark gefuehrt (Trade-off im Dossier sichtbar gemacht, nicht selbst herausgearbeitet) |
| 5 | Wissens-Layer | **geschichtet**: situationsnahe Nuggets (A/B-getaggt) + erweiterte Sprachmodi-Scaffolds + Transfer-Wissensblatt (+ Austausch-Scaffolds) + Glossar |
| 6 | Auslieferung | **separates Dossier** (Glossar+), nicht ins Modell integriert |
| 7 | Generierungs-Zeitpunkt | Dossier **zuletzt**, per Backward Design aus fertigen Herausforderungen + KN |
| 8 | Faktenvalidierung | einfache **Web-Validierung durch Claude** (Inhalte niederschwellig) |
| 9 | Sprachniveau | **max. A2 GER**, hart durchgesetzt als Pflicht-Check |
| 10 | KN-Typen | alle drei bleiben: Fachgespraech (Default/Primaer, muendlich) · Mini Case schriftlich (kuerzer, vereinfacht) · Werkschau (weniger schreiblastig). Vereinfachung = kuerzere Schreibmengen, K-Decke K3, mehr Scaffold im Pruefungsblatt selbst |
| 11 | Leitfragen | Anzahl bleibt **4** (Renderer-Invarianten unangetastet), Bloom-Profil auf EBA-Niveau abgesenkt |
| 12 | Skill-Basis | Fork von `hko-3er-set-generator`, eigener Strang `hko-2er-EBA-set-generator` |

---

## 2. Was bleibt / kalibrieren / streichen / neu

### 2.1 BLEIBT (strukturell, unveraendert uebernehmen)

- Backward Design (KN-Performance zuerst), Prinzip-First (roter Faden vor Aufgaben)
- Drei-Schichten-Phasenmodell (BBW 4-Phasen / IPERKA / AViVA) — nicht vermischen
- Ich-Perspektive in narrativer Prosa; Sie-Form in Auftraegen/Leitfragen (Reform 2026-06)
- 8 Merkmale Lernsituation (Mueller) als Pflicht-Checkliste
- Bi-dimensionale Bewertung: 4 Kriterien (2 SuK + 2 Ges), gleichgewichtet, Guetestufen 0-3, Niveaubaender unter 90 / 90 / 100
- Konsistenz-Trias / Constructive Alignment (Ziel ↔ Aktivitaet ↔ Pruefung)
- Persona-Kanon (`hko-framework.md` Paragraph 11), Umlaut/Eszett-Regeln, Sprachmodus-IDs SM1-SM9
- Zwei-Schichten-Sprachfoerderung (Methoden-Kern + nRLP-`detail`-Injektion)
- "Demonstrieren statt deklarieren" (`sk_anker`)
- Die Check-Maschinerie als Mechanismus (nur Schwellenwerte aendern)
- Gendern in Schraegstrich-Form; Schweizer Begriffe; CHF-Formate

### 2.2 KALIBRIEREN (Werte aendern, Struktur bleibt)

| Stellschraube | EFZ-Wert | EBA-Wert | betroffene Stellen |
|---|---|---|---|
| Set-Groesse 3 → 2 | A/B/C | **A/B** | alle Templates, Checks 1/2/3/6/14, Personas, KN-Kombi |
| `lehrgang` Default | `EFZ_3J` | **`EBA_2J`** | alle Templates, Phase 0 Lehrgang-Switch (SKILL.md Zeile 1149 aktivieren) |
| nRLP-Quelle | `nrlp_3j/4j.json` | **`nrlp_2j.json`** | Phase 0 |
| `bloom_zielprofil` | LF1 K2 / LF2-3 K3 / LF4 K3+-K4 | **LF1 K2 / LF2 K2 / LF3 K3 / LF4 K3** (K4 nur 100%-Extension) | Prinzip-Feld, Phase 2 |
| Quoten | 3 SK / 3 Asp / 3 Modi | **2 SK / 2 Asp / 1 Modus** (RLP-Minimum) | Checks 3/4, Prinzip |
| SK-primary-Threshold | SK in >=2 von 3 | **SK in beiden (2 von 2)** | Check 3, prinzip-architecture |
| Mehrdeutigkeit-Pflicht | 3 von 3 | **2 von 2**, aber gefuehrt (Dossier macht Trade-off sichtbar) | Check 6 |
| Persona-Pools | units 3+3 (>=3 Abt.), kn_neu 2+2 | **units 2+2 (>=2 Abt.), kn_neu 2+2** | Prinzip, Checks 9/14, hko-framework Paragraph 11 |
| KN-Kombi | A+B+C, `must_combine` [A,B,C] | **A+B**, `must_combine` [A,B] | KN-Template, kn-architecture |
| Konventionen-Set | Konv + Normen + Sprachbewusstheit | **Konv + Sprachbewusstheit** (keine Normen) | SuK-Kriterien der Rubrik |
| KN Mini Case | 45-60 Min., K2-K4, 4 Aufgaben | **kuerzer, K-Decke K3, mehr Scaffold im Blatt** | kn-architecture Paragraph 4 |
| KN Werkschau | 200-250 Woerter Reflexion | **weniger schreiblastig** (kuerzere Reflexion, gefuehrt) | kn-architecture Paragraph 5 |
| KN Fachgespraech | gleichrangig | **Default/Primaerform** (muendlich = EBA-Staerke) | kn-architecture Paragraph 3, Teacher/Begleiter |
| Persona Lehrjahr | 1.-3. LJ | **1.-2. LJ** (EBA hat 2) | ICH-Formel, hybrid_situation_spec |

### 2.3 STREICHEN / ANPASSEN

- Lehrmittel-Referenzen: alle harten `"Kap. {X.Y} | S. {NN}"` in `leitfragen[].knoten_ref`,
  `leitfragen_intro`, `quellen_anker[].ref`, `prinzip_handoff.lehrmittel_anker`, KN-Ablauf
  ("Lehrmittel erlaubt") werden auf **Dossier-Anker** umverdrahtet (siehe Paragraph 4.4).
- KN-Ablauf "Lehrmittel erlaubt, kein Internet" → "**Dossier erlaubt, kein Internet**".
- Sekundaer-SK-Tier: existiert im 3er schon nicht — bleibt weg.
- Farb-Triple: nur A/B verwenden (rot/blau); C (gruen) entfaellt.

### 2.4 NEU (Wissens-Dossier + A2-Enforcement)

1. **Neue Phase 3.5 — Wissensbedarf-Analyse** (nach Set, vor KN): extrahiert aus
   Herausforderungen A/B + KN-Spec, welches Wissen + welche Sprachmodi-Strategien noetig sind.
2. **Neue Phase 7 — Dossier-Generierung** (nach KN, ggf. nach Begleiter): produziert das
   geschichtete Glossar+ (Schema Paragraph 4).
3. **Neuer Schritt — Web-Validierung** der Faktenanker durch Claude.
4. **Neuer Check — Wissen↔KN-Alignment**: deckt das Dossier ab, was KN + Leitfragen verlangen?
5. **Neuer Check — A2-Enforcement**: zaehlbare Regelliste als ERR-Gate (Paragraph 5).
6. **Neue Assets:** `dossier-template.json`; neue References `dossier-architecture.md`,
   `a2-language-rules.md`.

---

## 3. Ziel-Pipeline `hko-2er-EBA-set-generator`

```
PHASE 0     NRLP-Lookup (nrlp_2j.json, lehrgang=EBA_2J)
PHASE 0.5   Prinzip-Formulierung (2 Herausforderungen A/B, EBA-Bloom-Profil)
PHASE 1     Herausforderung-Ideation (4 Optionen, 2 pro Herausforderung A/B)
PHASE 2     JSON-Generation (2 Herausforderungen) + A2-Check
PHASE 3     Set-Dokument (Austausch + Transfer, A/B)
PHASE 3.5   NEU: Wissensbedarf-Analyse (Backward Design aus A/B + KN-Spec)
PHASE 4     KN-Generierung inline (Hybrid A+B + 3 KN-Typen, Fachgespraech primaer)
PHASE 5     Teacher-Guide (HTML)
PHASE 6     Begleiter-Dokument (Lektion-fuer-Lektion)
PHASE 7     NEU: Dossier-Generierung + Web-Validierung + Wissen↔KN-Check + A2-Check
DEPLOY      bbw-hko
```

**Spiralen-Regel beim 2er (verbindlich):** Bei nur zwei Herausforderungen muessen die
Kontexte **maximal kontrastreich** gewaehlt werden (verschiedene Abteilungen, verschiedene
Konfliktarten), aber **denselben Trade-off** tragen. Zwei Datenpunkte sind die
Mindestbedingung, um ein uebertragbares Muster sichtbar zu machen. Ohne Kontrast sieht die
lernende Person zwei Einzelfaelle statt ein Prinzip.

---

## 4. Wissens-Dossier — Schema und Architektur

### 4.1 Grundprinzip

Das Dossier ist ein **separates Glossar+**, kein integrierter Modell-Teil. Lernende greifen
waehrend des Auftrags darauf zu; die LP kann es im Unterricht vertiefen. Es wird **zuletzt**
generiert (Phase 7), per Backward Design aus den fertigen Herausforderungen + KN — so wird
genau das Wissen geliefert, das die Auftraege und der KN voraussetzen, nichts Beliebiges.

### 4.2 Geschichtete Bausteine

| Baustein | Funktion | Kopplung | A/B-Tag |
|---|---|---|---|
| **Wissens-Nuggets** | kurze, situationsnahe Wissenseinheiten, schnell auffindbar | an Leitfragen + Handlungsprodukt der jeweiligen Herausforderung | primaer A/B getaggt |
| **Sprachmodi-Scaffolds (erweitert)** | Strategien + Satzbausteine + "so kannst du es machen", komplementaer zum Handlungsprodukt | an Output-Modus jeder Herausforderung | A/B getaggt |
| **Transfer-Wissensblatt** | hebt die zwei Einzelfaelle in Fachsystematik; sitzt in der Dekontextualisierungs-Phase | an Set-Transfer + KN-Prinzip | set-weit |
| **Austausch-Scaffolds** | zusaetzliche Hilfen, um Austausch + Transfer zu meistern | an Set-Austausch-Phase | set-weit |
| **Glossar** | Fachbegriffe A2-konform erklaert, mit konkretem Beispiel | quer ueber alles | quer |

**Ordnung:** primaer nach Herausforderung (A/B-Tag), Wissensart sekundaer. Lernende sollen
"schnell je nach Herausforderung finden" koennen.

### 4.3 Vorgeschlagenes JSON-Schema `dossier-template.json` (zur Bestaetigung)

```jsonc
{
  "id": "{X.Y.Z}_{topic_slug}_dossier",
  "lehrgang": "EBA_2J",
  "set_ref": "{X.Y.Z}_{topic_slug}_set",
  "sprachniveau": "A2",
  "nuggets": [
    {
      "id": "nugget_01",
      "tag": "A",                          // A | B | AB (beide) | transfer
      "titel": "",                         // A2, kurz
      "inhalt": "",                        // A2-Prosa, kurze Saetze
      "beispiel": "",                      // konkretes Schweizer Beispiel
      "fuer_leitfrage": [1, 2],            // Kopplung an Leitfragen-Nummern
      "fakten_anker": [                    // web-validierungspflichtig
        {"behauptung": "", "wert": "", "validiert": false, "lp_pruefen": false}
      ],
      "glossar_refs": ["begriff_01"]
    }
  ],
  "sprachmodi_scaffolds": [
    {
      "tag": "A",
      "sm_id": "SM5",                      // korrespondiert zu Output-Modus der Herausforderung
      "satzanfaenge": [""],
      "strategien": [""],
      "struktur": [""],
      "so_gehst_du_vor": [""]              // EBA-spezifisch: Schritt-fuer-Schritt
    }
  ],
  "transfer_wissensblatt": {
    "fachsystematik": "",                  // hebt A+B ins Allgemeine, A2
    "prinzip_in_einfach": "",              // dekontextualisierungs_anker, A2-Fassung
    "austausch_scaffolds": {
      "satzanfaenge": [""],
      "so_tauschst_du_aus": [""]
    }
  },
  "glossar": [
    {"id": "begriff_01", "begriff": "", "erklaerung_a2": "", "beispiel": ""}
  ],
  "template": "dossier_eba_v1",
  "legacy": {}, "source_refs": {}, "registry_tags": {}
}
```

### 4.4 Umverdrahtung der Lehrmittel-Anker

Im EFZ-System zeigen `knoten_ref`, `quellen_anker`, `prinzip_handoff.lehrmittel_anker` auf
externe Lehrmittel-Kapitel. Fuer EBA zeigen sie stattdessen auf **Dossier-Eintraege**:

| EFZ-Feld | EFZ-Wert | EBA-Wert |
|---|---|---|
| `leitfragen[].knoten_ref` | `"Kap. 2.7 | S. 73"` | `"Dossier | Nugget A-01"` |
| `leitfragen_intro` | "Nutze das Lehrmittel Kap. X.Y" | "Nutze das Dossier zu Herausforderung A" |
| `quellen_anker[].ref` | `"Kap. X.Y"` | `"Dossier"` mit `unterueberschrift` = Nugget-Titel |
| `prinzip_handoff.lehrmittel_anker` | `"S. 73-77"` | `"Dossier Nuggets A-01..A-03"` |
| KN-Ablauf | "Lehrmittel erlaubt, kein Internet" | "Dossier erlaubt, kein Internet" |

---

## 5. A2-Enforcement (hart, als ERR-Gate)

A2 wird **erzwungen, nicht erhofft**. Ein eigener Pre-Write-Check (analog zum Umlaut/Eszett-Scan)
prueft jedes SuS-gerichtete Prosa-Feld in Dossier, Herausforderungen, KN-Auftraegen.
Spezifikation in neuer Reference `a2-language-rules.md`.

### Zaehlbare Regeln (Vorschlag, in `a2-language-rules.md` final)

| Regel | Schwelle | Code bei Verstoss |
|---|---|---|
| Mittlere Satzlaenge | <= 12 Woerter | `WARN_A2_SATZLAENGE` |
| Max. Satzlaenge | <= 18 Woerter | `ERR_A2_SATZ_ZU_LANG` |
| Nebensatzketten | max. 1 Nebensatz pro Satz | `WARN_A2_NEBENSATZKETTE` |
| Passiv-Konstruktionen | vermeiden, aktiv bevorzugen | `WARN_A2_PASSIV` |
| Fachbegriff ohne Glossar-Eintrag | jeder Fachbegriff muss im Glossar stehen | `ERR_A2_BEGRIFF_OHNE_GLOSSAR` |
| Nominalstil / Funktionsverbgefuege | vermeiden | `WARN_A2_NOMINALSTIL` |
| Konjunktiv II ausserhalb Hoeflichkeit | vermeiden | `WARN_A2_KONJUNKTIV` |

**Wichtig — Konflikt mit bestehenden Sprachregeln:** Die Sie-Form (Reform 2026-06) bleibt auch
auf A2 erhalten — Hoeflichkeits-Imperativ ist A2-vertraeglich ("Lesen Sie...", "Schreiben Sie...").
Die Ich-Form in narrativer Prosa bleibt. A2 senkt **Komplexitaet**, nicht Hoeflichkeit.

**Offen (Pietro entscheidet in `a2-language-rules.md`-Bau):** A2 als reine Regelliste, als
Beispiel-Referenz (Positiv/Negativ-Paare), oder beides. Empfehlung: beides — zaehlbare Gates
fangen Drift, Beispiele kalibrieren den Ton.

---

## 6. Neue / geaenderte Checks

| Check | Status | Aenderung fuer EBA |
|---|---|---|
| 1 Herausforderung-Existenz | kalibrieren | Menge {A,B} statt {A,B,C} |
| 2 keine Duplikate | kalibrieren | {A,B} |
| 3 SK-Schnittmenge | kalibrieren | primary = SK in beiden (2/2); Minimum 2 SK gesamt (RLP) |
| 4 Aspekte | kalibrieren | Minimum 2 Aspekte (RLP) |
| 6 Mehrdeutigkeit | kalibrieren | 2 von 2, gefuehrt |
| 7 Bloom-Tiefe | kalibrieren | Pflicht-K4 entfaellt; LF4 = K3, K4 nur Extension |
| 9 Persona-Pools disjunkt | bleibt | — |
| 14 Persona-Pool-Verbrauch | kalibrieren | 2 statt 3 |
| 19 bewertungsraster-Shape | bleibt | 4 Zeilen |
| 20 LF4 != Handlungsprodukt | bleibt | greift staerker (kleinere Bausteine) |
| 21 Sprachmodus-ID-Paritaet | bleibt | — |
| 22 Mindmap-Anzahl | bleibt | 4 Aeste (Renderer-Invariante) |
| 23 Scaffolding vollstaendig | verschaerfen | mehr Eintraege Pflicht (EBA = mehr Scaffold) |
| 24 Ich-Form Prosa | bleibt | — |
| **NEU A** A2-Enforcement | neu | Paragraph 5; ERR-Gate vor jedem SuS-Prosa-Write |
| **NEU B** Wissen↔KN-Alignment | neu | jeder KN-Anspruch + jede Leitfrage hat Dossier-Deckung; sonst `ERR_DOSSIER_GAP` |
| **NEU C** Fakten-Validierung | neu | jeder `fakten_anker` ist `validiert: true` ODER `lp_pruefen: true`; sonst `WARN_FAKT_UNGEPRUEFT` |

---

## 7. Asset- und Reference-Inventar (Soll-Zustand)

```
hko-2er-EBA-set-generator/
├── SKILL.md                          (Fork, 7 Phasen + 3.5 + Dossier)
├── assets/
│   ├── prinzip-template.json         (2 Herausforderungen, EBA-Bloom)
│   ├── mission-template.json         (lehrgang EBA_2J, Dossier-Anker statt Kap.)
│   ├── set-template.json             (A/B, 2 konzept_progression)
│   ├── kn-template.json              (Hybrid A+B, Fachgespraech primaer)
│   └── dossier-template.json         (NEU — Paragraph 4.3)
└── references/
    ├── hko-framework.md              (EBA-Quoten ergaenzt, Persona-Mix >=2)
    ├── prinzip-architecture.md       (2er-Logik)
    ├── kn-architecture.md            (Fachgespraech primaer, Mini/Werkschau vereinfacht)
    ├── coherence-checklist.md        (Schwellen + 3 neue Checks)
    ├── json-field-mapping.md         (Dossier-Felder, EBA-Defaults)
    ├── language-rules.md             (unveraendert uebernehmen)
    ├── a2-language-rules.md          (NEU — Paragraph 5)
    ├── dossier-architecture.md       (NEU — Generierungs- + Validierungsregeln)
    ├── sprachfoerderung-methoden.md  (unveraendert; Dossier-Scaffolds docken an SM-IDs an)
    ├── sprachmodus-ids.md            (unveraendert)
    ├── _common_misspellings.md       (unveraendert)
    └── _migration_notes.md           (NEU-Eintrag: 3er → 2er-EBA Delta)
```

---

## 8. Offene Punkte vor dem Skill-Bau

1. **A2-Reference-Form** (Paragraph 5): Regelliste, Beispiele, oder beides? Empfehlung: beides.
2. **Dossier-Schema** (Paragraph 4.3): bestaetigen oder anpassen, bevor `dossier-template.json` gebaut wird.
3. **Wochen-Raster**: 3er nutzt fix 3 Wochen. Beim 2er-Set mit 2 Herausforderungen — 3 Wochen
   beibehalten oder kuerzen? (Renderer-Invariante `wochen: 3` betroffen.)
4. **KN-Kombi-Sprachmodi**: Da EBA-Schwerpunkt muendlich ist und Fachgespraech primaer —
   sollen Mini Case + Werkschau als gleichwertige Alternativen bleiben oder als
   "optional / fuer schriftstarke Klassen" markiert werden?
5. **Renderer**: wie beim 3er — der Renderer kennt das neue `template`/Dossier nicht. Erst
   Skill + Outputs, Renderer-Anpassung nach Pietros Gold-Version-Review.

---

## 9. Konstruktionslogik in einem Satz

> Ein EBA-2er-Set entsteht, indem aus `nrlp_2j.json` ein Kompetenzversprechen und sein KN
> (Fachgespraech-primaer) definiert werden, daraus ein roter Faden mit einem gefuehrten
> Trade-off gespannt wird, der sich in zwei maximal kontrastreichen Ich-Situationen entfaltet,
> ueber Austausch und Transfer in Fachsystematik ueberfuehrt und bi-dimensional geprueft wird —
> getragen von einem zuletzt generierten, A2-konformen Wissens-Dossier, das jede Leitfrage und
> jeden KN-Anspruch deckt, weil es ruckwaerts aus ihnen abgeleitet wurde.
