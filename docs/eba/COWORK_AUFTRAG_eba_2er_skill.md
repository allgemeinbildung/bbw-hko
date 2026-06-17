# Cowork-Auftrag: `hko-2er-EBA-set-generator` bauen

**Repo:** `bbw-hko` (hier arbeitet Cowork — Renderer + `nrlp_*.json` liegen hier)
**Begleit-Dokument:** `EBA_2er_set_generator_KONZEPT.md` (Pietro gibt es mit — es ist die fachliche Wahrheit; bei Konflikt zwischen diesem Auftrag und dem Konzept gewinnt das Konzept)
**Stand:** 2026-06-17
**Sprache aller Outputs:** Swiss Standard German, kein Eszett (immer ss)

---

## 0. Was gebaut wird — und was nicht

Cowork baut einen **neuen, eigenstaendigen Skill** `hko-2er-EBA-set-generator` als Fork des
bestehenden `hko-3er-set-generator` (in `bbw-hko/.claude/skills/`, voraussichtlich unter
`bbw-hko-3er-set`). Der EBA-Skill ist ein **Schwester-Ordner**, kein In-Place-Umbau des 3er.

**Cowork baut:** den Skill-Ordner (SKILL.md + assets/ + references/). Plus eine **Pilot-Generierung**
fuer eine EBA-Kompetenz zur Validierung.

**Cowork baut NICHT:**
- keine Renderer-Aenderungen (genau wie beim 3er-Gold-Review — Skill + Outputs zuerst)
- keine Migration bestehender 3er/5er-Sets
- keine JSON-Schemas / Schema-Tightening (kommt nach Pietros Gold-Review)

**Arbeitsweise:** schema-first, ein Schritt nach dem anderen, Pilot vor Skalierung. Nach jedem
Meilenstein kurz an Pietro zurueck, nicht alles in einem Durchlauf.

---

## 1. Vorbedingungen pruefen (Schritt 0, bevor irgendetwas gebaut wird)

Cowork verifiziert im Repo:

1. **3er-Skill vorhanden:** `bbw-hko/.claude/skills/bbw-hko-3er-set/SKILL.md` (oder analoger
   Pfad) existiert und ist lesbar. Falls nicht: bei Pietro melden, nicht raten.
2. **nRLP-Quelle vorhanden:** `nrlp_2j.json` ist im Repo erreichbar (vermutlich unter
   `public/nrlp/nrlp_2j.json` oder dem Pfad, den der 3er-Skill fuer `nrlp_3j/4j.json` nutzt).
   Pfad notieren — der EBA-Skill liest aus genau diesem Pfad.
3. **Output-Pfad-Entscheidung holen (BLOCKER):** Der 3er schreibt nach
   `public/missions-renderer/public/data/3er/`. Der EBA-Skill braucht einen **eigenen Pfad**,
   sonst kollidieren Dateinamen-Konventionen. Vorschlag an Pietro:
   `public/missions-renderer/public/data/2er-eba/`. **Nicht selbst entscheiden — Pietro fragen.**
4. **Encoding:** Beim Lesen der 3er-Dateien ist im Original ein cp1252-Problem aufgetreten.
   Cowork stellt sicher, dass alle neuen Dateien als **UTF-8** geschrieben werden (echte
   Umlaute, kein Mojibake).

Erst wenn 1-3 geklaert sind, weiter zu Phase A.

---

## 2. Build-Plan in Meilensteinen

### Meilenstein A — Skelett forken (mechanisch)

Kopiere den 3er-Skill-Ordner nach `hko-2er-EBA-set-generator/` und uebernimm zunaechst
**unveraendert**:

- `references/language-rules.md`
- `references/sprachfoerderung-methoden.md`
- `references/sprachmodus-ids.md`
- `references/_common_misspellings.md`

Diese vier sind stufenneutral und bleiben wie sie sind.

Lege die Asset-Templates erstmal als Kopien ab (werden in Meilenstein B kalibriert):
`prinzip-template.json`, `mission-template.json`, `set-template.json`, `kn-template.json`.

> Rueckmeldung an Pietro: "Skelett geforkt, 4 References uebernommen, Templates als Kopie abgelegt."

### Meilenstein B — Templates kalibrieren (3 → 2, EFZ → EBA)

Wende auf die vier kopierten Templates die Kalibrierungs-Tabelle aus **Konzept Paragraph 2.2** an.
Die wichtigsten konkreten Aenderungen:

**`prinzip-template.json`:**
- `lehrgang`-Default → `"EBA_2J"`
- `herausforderungen`: genau **2 Eintraege A/B** (C-Block loeschen)
- `bloom_zielprofil` → `{"LF1":"K2","LF2":"K2","LF3":"K3","LF4":"K3"}` (K4 nur als 100%-Extension-Kommentar)
- `sk_pro_situation`: nur A/B
- `sk_schnittmenge_kn.primary`-Kommentar: SK in **beiden** Herausforderungen (2 von 2)
- `persona_pool_units`: **2 berufe + 2 orte** (Kommentar: >=2 Abteilungen statt >=3)
- `persona_pool_kn_neu`: bleibt 2+2
- `hybrid_situation_spec.must_combine_herausforderungen` → `["A","B"]`
- `hybrid_situation_spec.lehrjahr_constraint`-Kommentar: EBA hat nur LJ1-2

**`mission-template.json`:**
- `lehrgang`-Default → `"EBA_2J"`
- Farb-Triple: nur A (rot) + B (blau) dokumentieren; C (gruen) entfaellt
- **Lehrmittel-Anker umverdrahten** (Konzept Paragraph 4.4):
  - `leitfragen[].knoten_ref` → `"Dossier | Nugget {A/B}-NN"`
  - `leitfragen_intro` → "Nutzen Sie das Dossier zu Herausforderung {A/B}." (Sie-Form!)
  - `quellen_anker[].ref` → `"Dossier"`, `unterueberschrift` = Nugget-Titel
  - `prinzip_handoff.lehrmittel_anker` → `"Dossier Nuggets {A/B}-NN..NN"`
- `bloom`-Reihenfolge der `leitfragen[]` an EBA-Profil anpassen (Verstehen/Verstehen/Anwenden/Entscheiden o.ae., K-Decke K3)
- **`wochen`-Wert:** offener Punkt — siehe Meilenstein-F-Frage. Vorlaeufig `3` lassen, mit TODO-Kommentar.
- Renderer-Invarianten NICHT anfassen: `mindmap_aeste.length==4` (Ast 4 optional), `schritte.length==5`,
  `reflexion_fragen.length==3`, `bewertungsraster.length==4`, `template`-Fixwert.

**`set-template.json`:**
- `lehrgang` → `"EBA_2J"`
- `herausforderungen[]` → 2 Eintraege; `konzept_progression` → 2 Eintraege
- `anchored_situations` analog
- austausch_phase bleibt strukturell (EA/GA/PL); nur die Verweise sind set-spezifisch

**`kn-template.json`:**
- `lehrgang` → `"EBA_2J"`
- `anchored_situations` → 2 Eintraege (`_hf_A`, `_hf_B`)
- `hybrid_situation`: kombiniert A+B; `alignment_note.herausforderungen_mapping` → 2 Eintraege
- **3 KN-Typen bleiben**, aber:
  - Fachgespraech = **Default/Primaerform** (im Kommentar + Reihenfolge markieren; muendlich = EBA-Staerke)
  - Mini Case schriftlich: **kuerzer + vereinfacht** — K-Decke K3 (Aufgabe 4 von K4 auf K3),
    kuerzere Schreibmengen, mehr Scaffold direkt im Pruefungsblatt
  - Werkschau: **weniger schreiblastig** — Reflexion kuerzer als 200-250 Woerter, staerker gefuehrt
- Rubrik: 4 Kriterien (2 SuK + 2 Ges) bleibt; SuK-Kriterien auf **Konventionen + Sprachbewusstheit**
  (KEINE Normen — EBA-Unterschied, RLP Z.791)
- KN-Ablauf-Texte: "Lehrmittel erlaubt" → **"Dossier erlaubt, kein Internet"**

> Rueckmeldung an Pietro: Markdown-Diff der vier Templates zeigen (nicht raw JSON), OK abwarten.

### Meilenstein C — Neue Assets + References schreiben

**`assets/dossier-template.json`** — nach Konzept Paragraph 4.3. Vollstaendiges Skelett mit
`nuggets[]` (A/B/AB/transfer-Tag), `sprachmodi_scaffolds[]`, `transfer_wissensblatt`
(inkl. `austausch_scaffolds`), `glossar[]`, `sprachniveau: "A2"`, `fakten_anker[]` mit
`validiert`/`lp_pruefen`-Flags.

**`references/dossier-architecture.md`** (NEU) — Generierungs- und Validierungsregeln:
- geschichtete Bausteine + Funktion + Kopplung (Konzept Paragraph 4.2)
- A/B-Tagging als primaere Ordnung
- Backward-Design-Pflicht: Dossier wird aus fertigen Herausforderungen + KN abgeleitet, nie vorab
- Fakten-Validierungs-Workflow (siehe Meilenstein E)
- Kopplungsregeln: jedes Nugget `fuer_leitfrage`; jeder Scaffold an `sm_id` des Output-Modus

**`references/a2-language-rules.md`** (NEU) — nach Konzept Paragraph 5:
- zaehlbare Regelliste (Satzlaenge, Nebensatzketten, Passiv, Glossar-Pflicht, Nominalstil, Konjunktiv)
- die Konflikt-Klarstellung: **Sie-Form + Ich-Narrativ bleiben** — A2 senkt Komplexitaet, nicht Hoeflichkeit
- **Form-Entscheidung von Pietro einholen:** Regelliste / Beispiele / beides (Empfehlung: beides —
  Gates + Positiv-Negativ-Paare). Bis dahin beide Teile anlegen.

**`references/_migration_notes.md`** — neuen Abschnitt "3er → 2er-EBA" mit der Delta-Tabelle
(Set-Groesse, Quoten, KN-Vereinfachung, Dossier, A2, Output-Pfad).

**`references/hko-framework.md`** — EBA ergaenzen: Quoten 2/2/1 (RLP Z.791), Konventions-Set
ohne Normen, keine SA/SP, Persona-Mix >=2 Abteilungen fuer den 2er.

**`references/coherence-checklist.md`** — Schwellen kalibrieren (Konzept Paragraph 6) + drei neue Checks:
- **A2-Enforcement** (ERR-Gate vor jedem SuS-Prosa-Write)
- **Wissen↔KN-Alignment** (`ERR_DOSSIER_GAP`, falls ein KN-Anspruch/eine Leitfrage keine Dossier-Deckung hat)
- **Fakten-Validierung** (`WARN_FAKT_UNGEPRUEFT`, falls `fakten_anker` weder `validiert` noch `lp_pruefen`)

**`references/kn-architecture.md`** + **`references/prinzip-architecture.md`** +
**`references/json-field-mapping.md`** — 2er-Logik, EBA-Defaults, Dossier-Felder, Fachgespraech-primaer.

> Rueckmeldung an Pietro: neue Assets + References zur Review, besonders `dossier-template.json`
> und `a2-language-rules.md` (das sind die einzigen echt neuen Artefakte).

### Meilenstein D — SKILL.md anpassen

Fork der 3er-SKILL.md zur 2er-EBA-Fassung:
- Frontmatter `name` + `description` auf EBA/2er
- Phasen-Workflow um **Phase 3.5 (Wissensbedarf-Analyse)** und **Phase 7 (Dossier-Generierung)** erweitern
  (Konzept Paragraph 3)
- Phase 0: nRLP-Quelle = `nrlp_2j.json`, `lehrgang=EBA_2J` (die "noch nicht publiziert"-Zeile aus
  dem 3er aktivieren)
- Phase 1: **4 Optionen** (2 pro Herausforderung A/B) statt 6
- Phase 0.5: 2 Herausforderungen, EBA-Bloom-Profil, **Spiralen-Regel** dokumentieren (maximaler
  Kontrast, gleicher Trade-off — Konzept Paragraph 3)
- Phase 4: Fachgespraech primaer, Mini/Werkschau vereinfacht
- Output-Liste + Dateinamen auf neuen Pfad + `_dossier.json` ergaenzen
- A2-Check in die Pre-Write-Validierung jeder SuS-Prosa-Phase einhaengen
- alle "Lehrmittel"-Erwaehnungen auf "Dossier" umstellen

### Meilenstein E — Fakten-Validierungs-Workflow definieren

Im `dossier-architecture.md` festhalten und in Phase 7 verdrahten:
1. Jeder `fakten_anker` (Betrag, Frist, Rechtsstand, Zahl) wird beim Dossier-Bau markiert.
2. **Claude (im Skill-Lauf) validiert** kritische Fakten per Web-Suche — Inhalte sind
   niederschwellig genug (Loehne, Fristen, einfache Rechtsbegriffe).
3. Validiert → `validiert: true`. Nicht sicher web-pruefbar → `lp_pruefen: true` (LP-Review-Markierung).
4. Kein Fakt bleibt ungeflaggt (Check Fakten-Validierung).

### Meilenstein F — Pilot generieren + offene Punkte klaeren

Vor dem Pilot die **5 offenen Punkte aus Konzept Paragraph 8** mit Pietro klaeren:
1. A2-Reference-Form (Regelliste/Beispiele/beides)
2. Dossier-Schema final bestaetigen
3. `wochen`-Raster: 3 behalten oder kuerzen (Renderer-Invariante)
4. Mini/Werkschau als gleichwertig oder "fuer schriftstarke Klassen"
5. Output-Pfad bestaetigt

Dann **eine EBA-Kompetenz pilotieren** (Pietro nennt welche — Vorschlag: aus T1 "Ins Berufsleben
einsteigen" oder T6 "Vertraege verstehen – fair handeln"). Vollstaendiger Durchlauf inkl. Dossier.
Outputs gegen Konzept + Checks pruefen. Erst nach Pietros Gold-Review skalieren.

---

## 3. Akzeptanzkriterien (woran ein gelungener Build erkennbar ist)

- [ ] Skill-Ordner `hko-2er-EBA-set-generator` existiert, unabhaengig vom 3er
- [ ] Alle Templates: `lehrgang: "EBA_2J"`, 2 Herausforderungen A/B, EBA-Bloom-Profil
- [ ] Lehrmittel-Anker durchgaengig auf Dossier umverdrahtet — kein "Kap. X.Y | S. NN" mehr
- [ ] `dossier-template.json` + `dossier-architecture.md` + `a2-language-rules.md` vorhanden
- [ ] 3 neue Checks in der Checkliste (A2-Gate, Wissen↔KN, Fakten)
- [ ] Renderer-Invarianten unangetastet (4 Mindmap-Aeste, 5 Schritte, 3 Reflexion, 4 bewertungsraster)
- [ ] Sie-Form in Auftraegen, Ich-Form im Narrativ — auch nach A2-Vereinfachung
- [ ] kein Eszett, echte Umlaute, UTF-8
- [ ] Pilot-Set generiert, KN Fachgespraech-primaer, Dossier deckt jede Leitfrage + jeden KN-Anspruch
- [ ] keine Renderer-Aenderungen vorgenommen

---

## 4. Was Cowork NICHT selbst entscheiden darf (an Pietro zurueck)

1. **Output-Pfad** fuer EBA-Outputs (Meilenstein-0 Blocker)
2. **A2-Reference-Form** (Regelliste / Beispiele / beides)
3. **Dossier-Schema-Bestaetigung** vor `dossier-template.json`-Finalisierung
4. **`wochen`-Raster** (3 vs. kuerzer)
5. **Pilot-Kompetenz** (welche EBA-Kompetenz zuerst)
6. Jede **Sekundaer-Kompetenz-Mehrfachabdeckung** (`nrlp.nr_primary`) — wie im 3er: Pietro entscheidet, nicht raten

Bei allem anderen: dem Konzept folgen, schema-first arbeiten, nach jedem Meilenstein kurz zurueckmelden.
