# Migration Notes — 5er to 3er

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
