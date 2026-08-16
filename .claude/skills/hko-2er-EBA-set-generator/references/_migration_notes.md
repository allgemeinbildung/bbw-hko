# Migration Notes — 5er → 3er → 2er-EBA

Diese Skill ist abgeleitet von `missionen-skill-hko`. Die zwei Skills entwickeln sich unabhaengig — Aenderungen in der einen werden NICHT automatisch in der anderen reflektiert. Diese Tabelle dokumentiert die Deltas, damit zukuenftige Wartung kohaerent bleibt.

| Konzept | 5er (`missionen-skill-hko`) | 3er (`hko-3er-set-generator`) |
|---|---|---|
| Herausforderungen | A-E (5) | A, B, C (3) |
| Phase-1-Optionen | 10 (2 pro Herausforderung × 5) | 6 (2 pro Herausforderung × 3) |
| `persona_pool_units` | 5 berufe + 5 orte | 3 berufe + 3 orte |
| `persona_pool_kn_neu` | 3 berufe + 3 orte | 2 berufe + 2 orte |
| Check-3 primary-Threshold | SK in >=3 Units | SK in >=2 Units |
| Check-3 secondary-Tier | SK in 2 Units → secondary | entfaellt — kein secondary |
| Check-6 Mehrdeutigkeit | >=4/5 Units | =3/3 Units (Pflicht) |
| KN-Architektur | downstream Skill via `kn_anchor.json` | inline in Phase 4 |
| KN-Format | 3 Mini-Cases + 3 CI-Erweiterungen | 1 Hybrid-Herausforderung + 3 KN-Typen |
| KN-Wahl | fixiert: mini_cases + critical_incident | LP-Wahl: Fachgespraech \| Mini Case schriftlich \| Werkschau |
| KN-Rubrik | 6 Kriterien (3 SuK + 3 Ges) × 4 Stufen | 4 Kriterien (2 SuK + 2 Ges) × 4 Stufen |
| `kn_vorgabe` im Prinzip | vorhanden | entfernt — Generation-time nicht konfigurierbar |
| `hybrid_situation_spec` im Prinzip | n/a | neu — Phase-4-Constraints |
| Mission Page 4 Inhalt | gruppenpuzzle + reflexion + vorgespraech | nur reflexion |
| Set-Level Austausch | dupliziert in jeder sit_*.gruppenpuzzle_fragen | zentral in `set.austausch_phase` |
| Set-Level Transfer | n/a (Begriff fehlt, nur per-Herausforderung) | `set.dekontextualisierungs_aufgabe`, bewertet 15 % |
| `bewertungsraster` | 6 Eintraege inkl. unbewertete Vorbereitungsfragen | 5 Eintraege inkl. bewertete Transfer |
| Niveaubaender | 50 / 70 / 90 / 100 % | unter 60 / 80 / 100 % |
| Renderer-Template | `"default_4page"` | `"default_4page_v2"` (reserviert, Renderer kennt es nicht) |
| Files pro Set | 5 sit + 1 prinzip + 1 teacher + 1 kn_anchor = 8 | 3 sit + 1 prinzip + 1 set + 1 kn + 1 teacher = 7 |
| File-Namen | sit_A...sit_E | herausforderung_A, herausforderung_B, herausforderung_C |
| Output-Pfad | `src/data/einheiten/` | `src/data/einheiten/` |
| `lehrgang`-Feld | n/a | EBA_2J \| EFZ_3J \| EFZ_4J |
| `prinzip_handoff`-Feld | implizit als Narrativ | explizit als Daten (kernkonzept, lehrmittel_anker, kn_aktivierung, transfer_check) |
| `sk_anker`-Feld | n/a | Pflicht, Laenge == nrlp.sk.length |

---

## Delta 3er → 2er-EBA (`hko-2er-EBA-set-generator`)

Diese Skill ist ein Fork des `hko-3er-set-generator` fuer das **EBA-System** (2-jaehrige
Grundbildung). Unterschied zum 3er ist NUR ueber `lehrgang: "EBA_2J"` markiert; beide schreiben nach
`src/data/einheiten/{X.Y.Z}_{slug}/`. Der einzige strukturelle Zusatz ist die siebte Datei
`dossier.json` (EBA hat kein Lehrmittel).

| Konzept | 3er (EFZ) | 2er-EBA |
|---|---|---|
| Herausforderungen | A, B, C (3) | **A, B (2)** — C/gruen entfaellt |
| Phase-1-Optionen | 6 (2 × 3) | **4 (2 × 2)** |
| `lehrgang`-Default | `EFZ_3J` | **`EBA_2J`** |
| nRLP-Quelle | `nrlp_3j/4j.json` | **`nrlp_2j.json`** |
| Bloom-Profil | LF1 K2 / LF2-3 K3 / LF4 K3+-K4 | **LF1-2 K2 / LF3-4 K3** (K4 nur 100%-Extension) |
| Quoten (RLP-Minimum) | 3 SK / 3 Aspekte / 3 Modi | **2 SK / 2 Aspekte / 1 Modus** (RLP Z.791) |
| SK-primary-Threshold | SK in >=2 von 3 | **SK in beiden (2 von 2)** |
| Mehrdeutigkeit | 3/3 Units (Pflicht) | **2/2 Units, aber gefuehrt** (Dossier macht Trade-off sichtbar) |
| `persona_pool_units` | 3 berufe + 3 orte (>=3 Abt.) | **2 + 2 (>=2 Abt.)** |
| `persona_pool_kn_neu` | 2 + 2 | 2 + 2 (unveraendert) |
| Persona-Lehrjahr | 1.-3. LJ | **1.-2. LJ** (EBA hat 2) |
| KN-Kombi | Hybrid A+B+C, `must_combine [A,B,C]` | **Hybrid A+B, `must_combine [A,B]`** |
| KN-Primaerform | gleichrangig | **Fachgespraech (muendlich = EBA-Schwerpunkt)** |
| KN Mini Case | 45-60 Min., K2-K4, 4 Aufgaben | **30-40 Min., K-Decke K3, mehr Scaffold im Blatt** |
| KN Werkschau | Reflexion 200-250 W. | **120-150 W., stark gefuehrt** |
| KN-Ablauf-Quelle | „Lehrmittel erlaubt, kein Internet" | **„Dossier erlaubt, kein Internet"** |
| SuK-Rubrik-Kriterien | Fachkorrektheit + Argumentation (Konv + Normen + Sprachbewusstheit integriert) | **Namen bleiben** Fachkorrektheit + Argumentation; Konventionen + Sprachbewusstheit integriert, **KEINE Normen** (RLP Z.791) |
| `wochen`-Feld | Fixwert 3 + `wochen_plan(3)` | **entfernt** (EBA heterogen — LP legt Rhythmus fest) |
| Lehrmittel-Anker | `"Kap. X.Y \| S. NN"` | **Dossier-Anker** (`"Dossier \| Nugget A-01"`) |
| Wissensquelle | externes Lehrmittel | **separates `dossier.json`** (Phase 7, A2, Backward Design) |
| Phasen | 0–6 | **+ Phase 3.5 (Wissensbedarf) + Phase 7 (Dossier + Web-Validierung)** |
| Neue Checks | — | **A2-Enforcement · Wissen↔KN-Alignment · Fakten-Validierung** |
| Neue Assets | — | `dossier-template.json` |
| Neue References | — | `dossier-architecture.md`, `a2-language-rules.md` |
| Files pro Set | 7 (3 sit + prinzip + set + kn + begleiter) | **8** (2 hf + prinzip + set + kn + begleiter + **dossier**) |
| Schlussarbeit/Schlusspruefung | EFZ hat SA/SP | **keine** (RLP §6.2/6.3 nur 3J/4J) — KN pro Einheit traegt alles |
| Renderer-Template | `default_4page_v2` (reserviert) | unveraendert + `dossier_eba_v1` (reserviert) |

**Niveaubaender bleiben** (unter 60 / 80 / 100 %), bi-dimensionale Rubrik bleibt (4 Kriterien,
2 SuK + 2 Ges), Renderer-Invarianten bleiben (4 Leitfragen, 4 Mindmap-Aeste, 5 Schritte,
3 Reflexion, 4-Zeilen-bewertungsraster).

---

## Welche Skill ist die kanonische Zukunft?

Pietros Plan: nach Gold-Version-Review von 2.7 Preisbildung wird die 3er-Skill die kanonische. Bestehende 5er-Sets bleiben aus Backward-Compat-Gruenden liegen — sie werden nicht migriert.

Die 5er-Skill bleibt operational, damit Pietro bei Bedarf weiter 5er-Sets erzeugen kann (z.B. fuer Module, die didaktisch breiter angelegt sein muessen). Solange beide Skills koexistieren, gilt:

- Bug-Fixes in der 5er-Skill werden NICHT automatisch in die 3er-Skill portiert
- Generelle Verbesserungen (z.B. neue NRLP-Mappings) werden in beide Skills gepflegt
- Architektur-Aenderungen (z.B. neue Page-5-Felder) gelten nur fuer die 3er-Skill

---

## Was passiert nach Step 3

Pietro generiert mit der neuen Skill eine Gold-Version (ein Modul, z.B. 2.7 Preisbildung) und prueft die JSONs gegen die Architektur-Spec. Erst danach werden geplant:

- Renderer-Updates fuer `default_4page_v2`, `set_overview`, `kn_auftrag`
- Schema-Tightening (JSON-Schemas fuer mission_v2.schema.json, set.schema.json, kn.schema.json)
- Migration der 5er-Bestaende (optional — wahrscheinlich bleiben sie)

Diese drei Steps liefern **nur die Skill und ihre Outputs** — keine Renderer-Aenderungen.
