# Kohaerenz-Checkliste — 2er-EBA-Set (Fork von 3er)

29 nummerierte Checks (v2.1) + 9 EBA-Checks (A–I): Phase 2 (Checks 1-9, 14, 17, 18-Sit-Teil, 19-24), Phase 4 (Checks 10-13, 15-16, 18-KN-Teil), **Phase 5 / Begleiter (Checks 25-29, NEU v2.1 — Struktur-Spec v2.1 TEIL 6/8, EBA-adaptiert)**, sowie die EBA-Checks A–I (A2, Wissen↔KN, Fakten, Recherche, Anrede, LF-Fall, Material, Begriffs-Test, LF-Anwendungsformat). Bei ERR in 1-9/14/19/21/22/23: keine Mission-JSONs schreiben. Bei ERR in 10-13+16: keine `kn.json` schreiben. Bei ERR in 25-29: `begleiter.md` nicht final speichern, fehlenden Baustein ergaenzen. Check 15, 17 und 20 sind WARN-only. Check 18 ist WARN fuer Residual-Patterns, ERR fuer Persona-Felder und Eszett. Checks 19-24 sind aus dem Auftrag/Dossier-Redesign (v2.0); Checks 25-29 sind die Begleiter-v2-Checks (v2.1, EBA-adaptiert).

**Diese Datei ist die EBA-Fassung.** Die Check-Mechanik ist identisch zum 3er; **nur Schwellenwerte
sind kalibriert** und es kommen **neun EBA-Checks** (A–I) dazu. Lies die Kalibrierungs-Tabelle
unten als verbindlichen Override ueber die Prosa der Einzel-Checks: ueberall, wo ein Einzel-Check
„3 von 3", „A/B/C" oder „K3+/K4" sagt, gilt fuer `lehrgang=EBA_2J` der EBA-Wert.

---

## EBA-2er-Kalibrierung (verbindlicher Override, `lehrgang=EBA_2J`)

Set-Groesse ist **{A, B}** (2 Herausforderungen, C entfaellt). Quoten-Untergrenze RLP Z.791:
**2 SK / 2 Aspekte / 1 Modus**.

| Check | 3er-Wert | EBA-2er-Wert |
|---|---|---|
| 1 Herausforderung-Existenz | buchstabe ∈ {A,B,C} | **∈ {A,B}** |
| 2 keine Duplikate | Menge == {A,B,C} | **== {A,B}** |
| 3 SK-Schnittmenge | primary = SK in >=2 von 3; Union ueber A/B/C | **primary = SK in beiden (2 von 2)**; Union ueber A/B; Minimum 2 SK gesamt |
| 4 Aspekte | Subset von prinzip.aspekte | unveraendert; **Minimum 2 Aspekte** (RLP) |
| 5a/5b/5c Modi | wie 3er | unveraendert; **Minimum 1 Modus** (RLP); Union ueber A/B |
| 6 Mehrdeutigkeit | 3 von 3 Units | **2 von 2 Units, aber gefuehrt** (Dossier-Transfer-Blatt macht Trade-off sichtbar) |
| 7 Bloom-Tiefe | mind. 1 LF auf K3+/K4 | **K-Decke K3**: LF3+LF4 auf K3; K4 NICHT Pflicht (nur 100%-Extension). `WARN_BLOOM_TOO_LOW` greift erst, wenn keine LF K3 erreicht |
| 9 Persona-Pools disjunkt | — | **unveraendert** |
| 12 SK ueber KN-Typen | Union A/B/C | **Union A/B** |
| 13 Rubrik-Shape | 4 Krit (2 SuK + 2 Ges) | **unveraendert**; SuK-Kriterien-Namen bleiben „Fachkorrektheit" + „Argumentation", mit integrierten Konventionen + Sprachbewusstheit (keine Normen) |
| 14 Persona-Pool-Verbrauch | 3 berufe + 3 orte voll verbraucht | **2 + 2 voll verbraucht** |
| 16 Trade-off-Mapping | mapping A/B/C | **mapping A/B** |
| 19 bewertungsraster-Shape | 4 Zeilen | **unveraendert** |
| 20 LF4 != Handlungsprodukt | WARN | **unveraendert** (greift staerker — kleinere Bausteine bei EBA) |
| 21 Sprachmodus-ID-Paritaet | — | **unveraendert** |
| 22 Mindmap-Anzahl | 4 Aeste | **unveraendert** (Renderer-Invariante) |
| 23 Scaffolding vollstaendig | >=1 pro Gruppe | **verschaerft: >=2 pro Gruppe** (EBA = mehr Scaffold), gekoppelt an Dossier-Sprachmodi-Scaffolds |
| 24 Ich-Form Prosa | — | **unveraendert** |

Alle uebrigen Checks (5a/5b/5c, 8, 10, 11, 15, 17, 18) gelten unveraendert, nur mit Set ueber {A,B}
statt {A,B,C}.

---

## Drei neue EBA-Checks (A · B · C)

### Check NEU A — A2-Enforcement (ERR-Gate, vor JEDEM SuS-Prosa-Write)
Jedes SuS-gerichtete Prosa-Feld (Herausforderungen, Set, KN, Dossier) durchlaeuft den Pre-Write-Scan
aus `a2-language-rules.md`. ERR-Codes blockieren den Write bis behoben: `ERR_A2_SATZ_ZU_LANG`
(Satz > 18 W.), `ERR_A2_BEGRIFF_OHNE_GLOSSAR` (Fachbegriff ohne Dossier-Glossar-Eintrag). WARN-Codes
(`WARN_A2_SATZLAENGE`, `WARN_A2_NEBENSATZKETTE`, `WARN_A2_PASSIV`, `WARN_A2_NOMINALSTIL`,
`WARN_A2_KONJUNKTIV`) werden gemeldet und moeglichst behoben. Sie-Form in Auftraegen + ICH-Form im
Narrativ bleiben erhalten (A2 senkt Komplexitaet, nicht Hoeflichkeit).

### Check NEU B — Wissen↔KN-Alignment (ERR, Phase 7)
Jede `mission.leitfragen[]` und jeder KN-Anspruch (`kn.kn_typen[].fragestruktur/aufgaben/
reflexionsfragen` + KN-Kernprinzip) hat mindestens ein deckendes Dossier-Element (Nugget, Scaffold,
Transfer-Blatt). Fehlt Deckung: `ERR_DOSSIER_GAP` mit Angabe der unbedeckten Leitfrage / des
KN-Anspruchs. Siehe `dossier-architecture.md` §6.

### Check NEU C — Fakten-Validierung (WARN, Phase 7)
Jeder `dossier.nuggets[].fakten_anker` (und im transfer_wissensblatt) ist nach der Web-Validierung
`validiert: true` ODER `lp_pruefen: true` — nie beides false. Sonst `WARN_FAKT_UNGEPRUEFT` mit
Angabe der ungeflaggten Behauptung. Siehe `dossier-architecture.md` §5. `fakten_anker` ist reine
interne QA und wird **nicht** an Lernende gerendert.

### Check NEU D — Recherche-Scaffolds pro Nugget (WARN, Phase 7)
Jedes `dossier.nuggets[]` hat `recherche.suchbegriffe` (>=2, A2, **kein** Gesetzesartikel wie
„OR Art. 346") + `recherche.ki_beispiel` (`so_fragst_du` + `prompt`) + `recherche.ki_lernen`
(2 **verschiedene** Moves aus dem Strategie-Menu, passend zum Nugget-Typ) + `recherche.selbst_pruefen`.
`ki_beispiel.tipp` optional. Fehlt ein Pflichtfeld: `WARN_RECHERCHE_FEHLT` mit Nugget-ID.

**Prompt-Qualitaet (`WARN_PROMPT_EINTOENIG`):** Prompts sind am konkreten Nugget-Inhalt geerdet (Zahl/
Frist/Beispiel/Situation, nicht nur der Titel) und die Moves variieren ueber das Dossier — keine
Variationen desselben Satzes, kein zweites Nugget mit gleicher Schablone. Siehe `dossier-architecture.md`
§8 (Prompt-Qualitaet).

### Check NEU E — Anrede-Scan (ERR `ERR_ANREDE_DU`, vor JEDEM SuS-Prosa-Write, Pflicht in Phase 7)
Kein `du/dein/dir/dich`, kein informelles `ihr/euch` als Anrede und keine Du-Imperative ohne „Sie"
(„Sag…", „Lass…", „Spiel…", „Tu…", „Schau…", „Frag…", „Stell…", „Lies…") in Auftrags-/Anweisungs-/
Erklaerungsfeldern — ueber **alle** Output-Dateien, **insbesondere das ganze Dossier** (`einleitung.*`,
`nuggets[].inhalt/beispiel`, `recherche.ki_beispiel.*`, `recherche.ki_lernen[].*`,
`sprachmodi_scaffolds[].*`, `transfer_wissensblatt.*`, `glossar[].*`). KI-Prompts, die die Lernende an
die KI richtet, siezen die KI ebenfalls. JSON-**Keys** sind ausgenommen, die ICH-Stimme im Narrativ
bleibt. Treffer **blockiert den Write**. Siehe `a2-language-rules.md` Regel A8. **Lücke aus Feedback
Matthi P5:** Das A2-Gate (Phase 4) deckte die Dossier-Anrede bisher nicht ab — dieser Scan ist Pflicht.

### Check NEU F — Anwenden-Leitfrage trifft den Situations-Fall (ERR `ERR_LF_FALL_MISMATCH`, Phase 2)
Jede **K3-Anwenden-Leitfrage** („Prüfen Sie Ihren Fall …") muss den im `situation_text` geschilderten
**konkreten** Fall treffen — nicht einen anderen Default-Fall, den nur das Dossier erklaert. Schildert
die Situation eine *Abweichung*, fragt die LF nach der *Abweichung*. Das gekoppelte Dossier-Nugget muss
genau diesen Fall **decken** (sonst zusaetzlich `ERR_DOSSIER_GAP`).
Anti-Pattern (Feedback Matthi 1.1.1): `situation_text` = „andere Dauer, als ich dachte" vs. LF3 = „was
gilt, wenn nichts anderes steht?" → Widerspruch. Korrekt: „… wenn eine andere Dauer steht als abgemacht?"

### Check NEU G — Material-Bedarf gedeckt (WARN `WARN_MATERIAL_UNGEDECKT`, Phase 7.5)
Jedes Scaffold/jeder Schritt, das/der ein Material verspricht („… stehen bereit", „… liegt vor"), hat
entweder **Dossier-Deckung** (Info-Karte/Scaffold/Glossar) **oder** steht in der Begleiter-Liste
„Von der Lehrperson bereitzustellen". Sonst Dossier ergaenzen **oder** Scaffold umformulieren
(„… stellt die Lehrperson zur Verfuegung"). Anti-Pattern (Matthi P3): `scaffold_90` „Kontaktstellen-Liste
stehen bereit", aber keine Liste im Dossier.

### Check NEU H — Begriffs-Test (ERR `ERR_HF_BEGRIFFSANKER`, Phasen 0.5/1/2 — Feedback 2026-07-02, F2)
Keine Herausforderung darf an einem **einzelnen (Rechts-)Begriff** haengen. Test-Frage: «Ist die
Aufgabe faktisch geloest, sobald die lernende Person EINEN Begriff nachgeschlagen hat?» Wenn ja →
Write blockiert, umformulieren. Der Problemkern sitzt auf der **Problem- und Sprachebene**
(Komplexitaet reduzieren, ordnen, gliedern, sich orientieren); Begriffe sind Dossier-Ressourcen,
nie Aufgabenkern. Anti-Pattern (v1 1.1.1): Situation haengt komplett an «Probezeit». Positiv-Muster
(Christof): «Lehrvertrag als komplexes Formular → in Sektionen gliedern, Standard vs.
betriebsspezifisch vs. fuer-mich-relevant unterscheiden».

### Check NEU I — LF-Anwendungsformat (WARN `WARN_LF_WISSENSABFRAGE`, Phase 2 — Feedback 2026-07-02, F3)
Jede Leitfrage ist eine **Taetigkeit mit Material**, keine Wissenswiedergabe. Scan auf
Reproduktionsmuster: `Was ist …?`, `Nennen Sie …`, `Erklaeren Sie in zwei Saetzen: Was …` →
umformulieren in Taetigkeitsformat (gliedern, zuordnen, markieren, Tabelle ausfuellen, vergleichen,
waehlen + begruenden, kurze Nachricht schreiben). Bloom-Profil bleibt K2/K2/K3/K3 — K2 heisst
«Tun mit Material», nicht «Wiedergeben». Definitionswissen lebt im Dossier (Info-Karten + Glossar).

---

## Phase-2-Checks (1-9, 14)

### Check 1 — Jede Unit hat eine herausforderung aus dem Prinzip
Fuer jede der 3 Herausforderungen: `sit_*.herausforderung.buchstabe` ∈ `{A, B, C}` UND `sit_*.herausforderung.label === prinzip.herausforderungen[buchstabe].herausforderung`.

Fehlerfall: `ERR_HERAUSFORDERUNG_MISSING` — Skill stoppt, listet die fehlende Herausforderung.

### Check 2 — Keine zwei Units haben dieselbe herausforderung
Verifikationsmenge: `{sit_A.herausforderung.buchstabe, sit_B.herausforderung.buchstabe, sit_C.herausforderung.buchstabe} === {"A", "B", "C"}`.

Fehlerfall: `ERR_DUPLICATE_HERAUSFORDERUNG`.

### Check 3 — SK-Schnittmenge konsistent
`prinzip.sk_schnittmenge_kn.primary ⊆ Union(sit_A.nrlp.sk ∪ sit_B.nrlp.sk ∪ sit_C.nrlp.sk)`.

**Threshold (3er-spezifisch):** SK gehoert in `primary`, wenn sie in mindestens **2 von 3** Herausforderungen vorkommt (im 5er-Set war es 3 von 5). Mit 3 Units gibt es keinen `secondary`-Tier — SK in 1 Unit ist nicht testbar.

Fehlerfall: `ERR_SK_OUT_OF_BOUNDS` mit Liste der SK, die im primary stehen aber in <2 Herausforderungen vorkommen.

### Check 4 — Aspekte konsistent
Fuer jede Herausforderung: `sit_*.nrlp.gesellschaft[].aspekt ⊆ keys(prinzip.aspekte)`.

### Check 5a — Modi-Realismus (modi_units trainierbar)
Jeder Modus in `prinzip.modi_units` muss durch mindestens ein Handlungsprodukt der drei
Lernaufgaben aktiv trainiert werden. Heuristik:

| Handlungsprodukt-Typ | trainierter Modus |
|---|---|
| Tabelle / Diagramm / Skizze | Produktion schriftlich und bildlich |
| Stellungnahme / Brief / Memo | Produktion schriftlich und bildlich |
| Vergleichstabelle / Analyse | Produktion schriftlich und bildlich |
| Praesentation | Produktion muendlich |
| Rollenspiel / Gespraech | Interaktion und Kollaboration muendlich |
| Wiki / kollaboratives Doc | Interaktion und Kollaboration schriftlich |
| Audio / Podcast | Produktion multimedial |
| Video / Screencast | Produktion multimedial |
| Chat-Protokoll / E-Mail-Sequenz | Interaktion und Kollaboration schriftlich |

Wenn ein Modus in `modi_units` keinen Trainings-Footprint ueber die drei Handlungsprodukt-Typen
hat: `WARN_MODE_UNTRAINED`. Skill fragt User: Modus entfernen oder Trainings-Schritt ergaenzen?

### Check 5b — modi_units ⊆ modi_kn
Jeder Modus in `prinzip.modi_units` muss auch in `prinzip.modi_kn` enthalten sein. Der KN
darf nicht weniger Modi pruefen, als die Lernaufgaben trainiert haben.

Fehlerfall: `ERR_MODI_KN_SUBSET`. Skill stoppt vor Phase 4.

### Check 5c — Sit-Modi-Subset (umbenannt von Check 5)
`Union(sit_*.nrlp.sprachmodi) ⊆ prinzip.modi_units`. Sit-Inhalte duerfen keine Modi
einfuehren, die nicht im Prinzip stehen.

### Check 6 — Mehrdeutigkeit in 3 von 3 Units
**Threshold (3er-spezifisch):** ALLE 3 Herausforderungen muessen einen `mehrdeutigkeit.trade_off` aus `prinzip.mehrdeutigkeits_architektur.trade_off_raum` aktivieren. Mit nur 3 Units waere ein Ausfall = ein Drittel des SK11-Belegs weg.

Auto-Fix: wenn `sit_*.mehrdeutigkeit.trade_off` leer ist, schlaegt die Skill den naechstgelegenen Trade-off aus `trade_off_raum` vor und wartet auf User-Bestaetigung vor dem Schreiben.

Fehlerfall: `ERR_MEHRDEUTIGKEIT_MISSING` (nach Auto-Fix-Versuch).

### Check 7 — Bloom-Tiefe
Jede Herausforderung hat mindestens eine Leitfrage auf K3+/K4 (`bloom` ∈ `{"Entscheiden", "Analysieren", "Formulieren"}`).

Fehlerfall: `WARN_BLOOM_TOO_LOW` — Skill versucht 5. LF zu ergaenzen, sonst stoppt.

### Check 8 — sk_anker-Invariante
Fuer jede Herausforderung: `sit_*.sk_anker.length === sit_*.nrlp.sk.length`. Jeder Eintrag in `sk_anker` hat `sk` (number) und `wo` (nicht-leer).

Fehlerfall: `ERR_SK_ANKER_MISMATCH`.

### Check 9 — Persona-Pools disjunkt
`prinzip.persona_pool_kn_neu.berufe ∩ prinzip.persona_pool_units.berufe === ∅` UND `... .orte ∩ ... .orte === ∅`.

Fehlerfall: `ERR_PERSONA_OVERLAP` — Skill stoppt, Pietro muss persona_pool_kn_neu aendern.

### Check 14 — Persona-Pool-Verbrauch (NEU in v1.1)

Pool-Vollverbrauchs-Invariante:
- Jeder `prinzip.persona_pool_units.berufe[i]` kommt in genau einem `sit_*.persona.beruf` vor
- Jeder `prinzip.persona_pool_units.orte[i]` kommt in genau einem `sit_*.persona.ort` vor

Wenn Beruf oder Ort doppelt verwendet wird oder ein Eintrag ungenutzt bleibt:
`ERR_PERSONA_POOL_MISUSE` — listet Duplikate und unverwendete Eintraege.

Beispiel-Fehler (3.2.2 v1):
  Duplikate: berufe[0] „Detailhandelsfachfrau/-mann" in sit_A UND sit_C
  Unverwendet: berufe[1] „Koch / Koechin"

---

## Phase-4-Checks (10-13, 15)

### Check 10 — Hybrid-Herausforderung aktiviert Trade-offs
`hybrid_situation.aktivierte_trade_offs.length >= 1` UND jeder Eintrag ∈ `prinzip.mehrdeutigkeits_architektur.trade_off_raum`. `hybrid_situation.alignment_note` benennt explizit, welcher Trade-off durch welches Szenenelement aktiviert wird.

Fehlerfall: `ERR_HYBRID_NO_TRADE_OFF`.

### Check 11 — Hybrid-Persona disjunkt
`hybrid_situation.persona.beruf` kommt in keinem `sit_*.persona.beruf` vor. Gleiches fuer `ort`. Beide Bedingungen muessen halten.

Fehlerfall: `ERR_HYBRID_PERSONA_OVERLAP`.

### Check 12 — SK-Konsistenz ueber KN-Typen
Fuer ALLE drei KN-Typen (Fachgespraech, Mini Case schriftlich, Werkschau):
ihre `sk[]` ⊆ `Union(sit_A.nrlp.sk ∪ sit_B.nrlp.sk ∪ sit_C.nrlp.sk)`.

Werkschau hat KEINE Ausnahme mehr (war v1-Bug). SK-Liste wird in Phase 4 Step 5 adaptiv gegen
die Union gefiltert — sie enthaelt garantiert nur trainierte SK.

Fehlerfall: `ERR_KN_SK_OUT_OF_SCOPE` — listet welche SK in welchem KN-Typ das Set nicht trainiert hat.

### Check 13 — Rubrik-Shape
- `rubrik_shared.kriterien.length === 4`
- Genau 2 Kriterien mit `dimension: "SuK"`, genau 2 mit `dimension: "Ges"`
- Jedes Kriterium hat genau 4 Stufen
- `rubrik_shared.niveaubaender.length === 3`

Fehlerfall: `ERR_RUBRIK_SHAPE`.

---

### Check 15 — Trade-off-Verteilung (WARN, NEU in v1.1)

Wenn `prinzip.mehrdeutigkeits_architektur.trade_off_raum.length >= 2`:
jeder Trade-off im Raum sollte in mindestens einer Herausforderung als `mehrdeutigkeit.trade_off`
aktiviert sein.

Wenn ein Trade-off in 0 Herausforderungen aktiviert ist: `WARN_TRADE_OFF_UNUSED`. Pietro kann
bestaetigen (intentional — eine Spannungs-Vertiefung ist gewollt) oder Sit-Trade-offs neu
zuweisen.

---

### Check 16 — Trade-off-Mapping-Konsistenz (NEU in v1.2)

`hybrid_situation.aktivierte_trade_offs` muss alle dominanten Trade-offs
der gemappten Herausforderungen enthalten.

Fuer jeden Eintrag in `herausforderungen_mapping[]` mit `hf_letter == X`:
die `sit_X.mehrdeutigkeit.trade_off` muss in `aktivierte_trade_offs` vorkommen.

Fehlerfall: `ERR_TRADE_OFF_MAPPING_INCONSISTENT` — listet welche
Sit-Trade-offs im Mapping referenziert, aber im Array fehlen.

Anti-Pattern: 3.2.1 v1.1 — mapping enthielt A/B/C, aber
aktivierte_trade_offs listete nur B und C. Sit_A's trade_off fehlte.

### Check 17 — Single-Format-Handlungsprodukt (WARN, NEU in v1.2)

`sit_*.handlungsprodukt.format_detail` enthaelt keine Format-Alternativen
mit Modus-Wechsel-Potenzial.

Heuristik: regex `/(Alternativ(es)?|oder als|moeglich)/i` in format_detail.
Bei Match: `WARN_MULTI_FORMAT_AMBIGUITY` — User-Klarstellung erforderlich
vor JSON-Write:
  (a) Singularisieren auf primaeres Format (Modus bleibt unveraendert)
  (b) Beide Formate beibehalten, modi_units um beide Modi erweitern
      (Check 5b muss danach erneut geprueft werden)

Anti-Pattern: 3.2.1 sit_B v1.1 — Video-Statement mit "Alternativ:
schriftlicher Kommentar" liess offen, ob 'Produktion multimedial' oder
'Produktion schriftlich und bildlich' aktiviert wird.

### Check 18 — Frontend-Prosa-Umlaute (NEU in v1.4, Pflicht)

Alle Prosa-Felder ueber alle Output-Dateien (prinzip.json, herausforderung_A/B.json,
set.json, kn.json, begleiter.md, **dossier.json**) verwenden echte Umlaute `ä/ö/ü/Ä/Ö/Ü`.
**Wichtig (EBA):** `ae/oe/ue` in Prosa ist ein Bug — auch wenn `ss` (kein Eszett) korrekt ist. Die
zwei Regeln sind getrennt. Vorsicht bei Nicht-Umlaut-Woertern mit Digraph: `quellen`, `neue`,
`Dauer`, `zuerst`, `Sequenz`, `Steuer` bleiben unveraendert.
Transliteration `ae/oe/ue/Ae/Oe/Ue` in Prosa ist ein Bug.

Algorithmus:
1. Sammle alle Prosa-Feld-Strings (Liste siehe SKILL.md Section „Verbotene
   Aenderungen am Frontend-Text" sowie language-rules.md §2 und
   `_common_misspellings.md` Section „Pauschal-Transliterations-Fixes").
2. Regex-Scan jeder String nach `/\b\w*(ae|oe|ue|Ae|Oe|Ue)\w*\b/`.
3. Match-Tokens gegen Eigennamen-Whitelist abgleichen:
   - `Aarau`, `Olten`, `Goethe`, `Boeing`, `Aerogel`, `Aero*`-Komposita
   - Englische Lehnwoerter: `Queue`, `Manager`, `Layout`, `User` (kein ae/oe/ue im fraglichen Sinn)
   - Persona-Namen aus kanonischer Tabelle (z.B. „Polymechaniker" — kein Umlaut)
4. Falls Token NICHT auf Whitelist und KEIN passender Eintrag in
   `_common_misspellings.md` Pauschal-Tabelle existiert:
   `WARN_UMLAUT_RESIDUE: {wort} in {feld} ({datei})`.
5. Persona-Spezial-Check (**lehrgangs-abhaengig**): `persona.beruf` und `persona.ort` MUESSEN
   string-identisch mit der kanonischen Tabelle sein (kein Fuzzy-Matching). Geprueft wird je nach `lehrgang`:
   - `EFZ_3J` / `EFZ_4J` → gegen die **EFZ-Spalte** „Schreibweise mit Umlauten" (hko-framework §11).
   - `EBA_2J` → gegen die **EBA-Spalte** „EBA-Schreibweise (mit Umlauten)" (hko-framework §11, Abschnitt
     „Kanonische EBA-Lehrberufe"). EBA-Personas dürfen NICHT gegen die EFZ-Spalte geprueft werden.
   - `orte` (stufenneutral) → gegen die gemeinsame Staedte-Tabelle.
   Bei Abweichung (insb. ae/oe/ue in der Prosa statt Umlaut): `ERR_PERSONA_NOT_CANONICAL`.
5b. Aspekt-Spezial-Check (**ERR, nicht WARN**): `nrlp.gesellschaft[].aspekt` (in jeder
   herausforderung_*.json) UND der **Objekt-Key** im `aspekte`-Objekt der prinzip.json sind
   **kanonische Aspekt-Strings mit Umlaut** — keine Identifier. Sie fallen sonst durch beide Raster:
   zu „Daten" fuer den Prosa-Fix (Schritt 2-4), zu „Prosa" fuer die ID-Transliteration. Darum hier
   explizit pruefen. Jeder Aspekt-Wert MUSS string-identisch einer der 8 kanonischen Schreibweisen
   sein (Framework §3):
   **Ethik · Identität und Sozialisation · Kultur · Ökologie · Politik · Recht · Technologie und
   digitale Transformation · Wirtschaft.**
   Bei `...aet/oe/ue...` in einem Aspekt-Wert oder -Key (z. B. „Identitaet…", „Oekologie"):
   `ERR_ASPEKT_NOT_CANONICAL` — blockiert den Write. Grund: ein String-Abgleich zaehlt „…aet…" und
   „…ät…" als zwei verschiedene Aspekte → die 2-Aspekte-Quote (RLP Z.791) und jeder Coverage-Tracker
   brechen still.

6. Eszett-Scan: regex `/ß/` in allen Feldern. Bei Fund: Auto-Fix zu `ss`,
   `ERR_ESZETT_FOUND` als Meldung (nicht-blockierend nach Fix).

Severity: Check 18 ist WARN-only fuer Residual-Patterns (Pietro reviewt
Eigennamen), aber ERR fuer Persona-Felder und Eszett.

Anti-Pattern: 3.2.2 v1 — persona.beruf = „Baecker" statt „Bäcker", Prosa
durchgaengig mit „fuer", „moeglich", „naeher" anstatt „für", „möglich",
„näher". Frontend wirkte technisch transliteriert statt natuerlich Schweizer.

---

## v2.0-Redesign-Checks (19-23, Phase 2) — Auftrag/Dossier-Redesign

### Check 19 — bewertungsraster-Shape (NEU v2.0)
`sit_*.bewertungsraster.length === 4` (Leitfragen, Mindmap, Handlungsprodukt, Reflexion — KEINE Transfer-Zeile). Jede Zeile hat `vollstaendig_wenn` mit 2-4 nicht-leeren Bullets (treibt die "Checkliste Vollständigkeit" auf Seite 1).

Der fruehere "5 Zeilen / Summe gewicht == 100"-Check entfaellt: `gewicht`/`abgabe` sind optional und werden nicht mehr gerendert, der Transfer lebt im set-level Austausch-&-Transfer-Dokument.

Fehlerfall: `ERR_RASTER_SHAPE` — listet fehlende Zeilen oder Zeilen ohne `vollstaendig_wenn`.

### Check 20 — LF4 ≠ Handlungsprodukt 1:1 (WARN, NEU v2.0)
`leitfragen[3]` (LF4) trainiert den Output-Sprachmodus (`nrlp.sprachmodus_ids`) als fokussierte Teil-/Sprachform-Aufgabe — EIN Baustein, der ins Handlungsprodukt einfliesst — und reproduziert NICHT das ganze Handlungsprodukt.

Heuristik: LF4-Text darf nicht das volle HP-Format/-Titel-Scope umfassen. Gut: "Schreibe einen Block …", "Schreibe die Spalte «Rechtsfolge» …", "Formuliere drei Ich-Botschaften …". Schlecht: "Formuliere dein <ganzes Handlungsprodukt> …".

Fehlerfall: `WARN_LF4_EQUALS_HP` — Pietro bestaetigt oder LF4 wird auf einen Baustein verengt.

### Check 21 — Sprachmodus-ID-Paritaet (NEU v2.0)
`sit_*.nrlp.sprachmodus_ids.length === sit_*.nrlp.sprachmodi.length`. Jede Modus-Bezeichnung hat ihre SM-ID.

Fehlerfall: `ERR_SPRACHMODUS_ID_PARITY`. Anti-Pattern: konflikt sit_C hatte `sprachmodi`=2, `sprachmodus_ids`=["SM3"] → korrigiert zu ["SM3","SM7"].

### Check 22 — Mindmap-Anzahl (NEU v2.0)
`sit_*.mindmap_aeste.length === 4 && mindmap_aeste[3].optional === true`. Der radiale (HTML) bzw. Quadranten (DOCX) Renderer ist auf genau 4 Aeste optimiert; der 4. ist optional (gestrichelt/leichter).

Fehlerfall: `ERR_MINDMAP_COUNT`.

### Check 23 — Scaffolding vollstaendig (NEU v2.0)
`sit_*.handlungsprodukt.scaffolding` hat >=1 nicht-leeren Eintrag in JEDER der drei Gruppen `satzanfaenge`, `strategien`, `struktur` — ausgerichtet am HP-Format + Output-Sprachmodus.

Fehlerfall: `ERR_SCAFFOLDING_INCOMPLETE`.

### Check 24 — Ich-Form der Situations-Prosa (NEU v2.0)
`sit_*.situation_text` und `sit_*.handlungsprodukt.beschreibung` stehen grammatisch in der 1. Person Singular (Ich). Aufträge (`leitfragen[]`, `handlungsprodukt.schritte`) bleiben im Imperativ; zitierte Rede anderer Personen bleibt unverändert.

Heuristik: situation_text/beschreibung beginnen mit „Ich " und enthalten ausserhalb von Anführungszeichen kein „du/dein/dir/dich/Du".

Fehlerfall: `WARN_DU_FORM_NARRATIVE` — Skill formuliert die Narrativ-Prosa in Ich-Form um, wartet auf OK.

---

## Phase-5-Checks (25-29, Begleiter) — Struktur-Spec v2.1 TEIL 6/8, EBA-adaptiert

Laufen NACH der Generierung von `begleiter.md`, vor dem finalen Speichern. EBA-Override: das Set hat **nur A/B** (kein C), die KN-Decke ist **K3**, die Begleiter-Prosa bleibt LP-gerichtet (A2 gilt fuer SuS-Renders, nicht zwingend fuer LP-Text — aber zitierte SuS-Beispiele A2). Die EBA-Pflichtsektionen (Wissens-Dossier (A2), Sektion 8.5) bleiben.

### Check 25 — Kapitel 1.6 KI-Einsatz (§E5, A2-nah)
Sektion 1 enthaelt `1.6 KI-Einsatz — Nutzungsideen fuer diese Einheit` mit genau einem `[!ki_einsatz]`-Callout. Pflicht: Empfehlungs-Rahmung, KEINE KI-Regel/Verbot/Gebot, KEIN KI-Fluency-Verweis. **EBA:** die Ideen sind A2-niedrigschwellig (einfache, konkrete Schritte).

Fehlerfall: `ERR_BEGLEITER_NO_KI_OVERVIEW` · `WARN_KI_RULE_LANGUAGE` (regex `/verboten|nicht erlaubt|Pflicht|musst|darfst nicht|Hilfsmittel(regel|ung)|Z\.?\s?749|KI-Fluency/i`).

### Check 26 — Vier v2-Bausteine je Herausforderung A/B (§E2-E5)
Fuer JEDE der **zwei** Herausforderungs-Sektionen (3/4) existieren alle vier Bausteine in der Spec-§1.5-Reihenfolge: `[!troubleshooting]` (genau einer, im Leitfragen-Block, §E3) · `[!tafelbild]` (vor Scaffold, §E4) · «Wann ist das Produkt fertig?»-Haken-Liste (nach Scaffold, §E2) · `[!ki_einsatz]` (nach Check, vor Coaching-Block, §E5).

Fehlerfall: `ERR_BEGLEITER_V2_BLOCK_MISSING` — listet Herausforderung + fehlenden/fehlplatzierten Baustein. `WARN_TROUBLESHOOTING_COUNT` wenn ≠ 1 Troubleshooting-Callout pro Herausforderung.

### Check 27 — Vollstaendigkeits-Check ist reine Haken-Liste ohne Gewichte (§E2)
Die «Wann ist das Produkt fertig?»-Liste rendert als `☐`-Checkliste, NICHT als Tabelle mit Prozenten — KEIN `gewicht_prozent`/`%`-Wert. Inhalt 1:1 aus `bewertungsraster[].produkt` + `vollstaendig_wenn[]`, Reihenfolge Leitfragen → Mindmap → Handlungsprodukt → Reflexion.

Fehlerfall: `ERR_VOLLSTAENDIGKEIT_HAS_WEIGHTS` · `WARN_VOLLSTAENDIGKEIT_SOURCE_DRIFT`.

### Check 28 — Erwartungshorizont je Prueffrage (§E1, EBA-Decke K3)
Sektion 8 enthaelt pro Frage/Aufgabe einen `[!erwartungshorizont]`-Callout direkt nach der Frage. Titel = Frage-Nr + K-Stufe. **EBA:** K2-Fragen «vollstaendig vs. lueckenhaft» (zwei Zeilen); K3-Fragen Dreizeiler (Stufe 3 / Stufe 4 zusaetzlich / Nicht Stufe 4). Anzahl == Zahl der Prueffragen.

Fehlerfall: `ERR_ERWARTUNGSHORIZONT_MISSING` · `WARN_ERWARTUNGSHORIZONT_K2_FORMAT` (K2-Frage nutzt den K3-Dreizeiler).

### Check 29 — As-built-Invarianten (TEIL 8, EBA)
- **Kein Quellen-Anhang** (TEIL 8.3). Das Dokument endet mit den EBA-Pflichtsektionen (Wissens-Dossier (A2) / Sektion 8.5) — diese bleiben, sie sind NICHT der gestrichene Anhang.
- **Rubrik-Skala/Baender:** Stufenskala **1–4** (1 = tiefste), Niveaubaender **unter 60 % / 80 % / 100 %**, konsistent mit `kn.rubrik_shared` (Prozente nur LP-seitig).
- **Callout-Typen ⊆ 10:** jeder `[!typ]` ∈ {lernziel, hinweis, beispiel, warnung, reflexion, coaching, mehrdeutigkeit, differenzieren, erwartungshorizont, troubleshooting, tafelbild, ki_einsatz}.
- **Terminologie:** «Herausforderung A/B», nie «Situation X» (Ausnahmen: Fachbegriff «Lernsituation», Eigenname «Situationsblaetter»).

Fehlerfall: `ERR_BEGLEITER_ANHANG_PRESENT` · `ERR_BEGLEITER_RUBRIK_SCALE` · `ERR_CALLOUT_TYPE_UNKNOWN` · `WARN_BEGLEITER_TERMINOLOGY`.

---

## Auto-Fix-Verhalten

| Code | Aktion |
|---|---|
| `WARN_BLOOM_TOO_LOW` | Skill ergaenzt 5. Leitfrage auf K4, fragt User zur Bestaetigung |
| `WARN_MEHRDEUTIGKEIT_NEAR_MISS` | Skill schlaegt naechstgelegenen Trade-off vor, wartet auf OK |
| `WARN_LF4_EQUALS_HP` | Skill verengt LF4 auf einen Sprachform-Baustein (ein Block / eine Spalte / drei Saetze), wartet auf OK |
| `WARN_DU_FORM_NARRATIVE` | Skill schreibt situation_text + handlungsprodukt.beschreibung in 1. Person Singular um (Zitate bleiben), wartet auf OK |
| `WARN_A2_*` | Skill formuliert das Feld A2-konform um (kuerzere Saetze, aktiv, Verben statt Nomen), laeuft weiter |
| `WARN_FAKT_UNGEPRUEFT` | Skill setzt nach Web-Validierung `validiert:true` oder markiert `lp_pruefen:true`; nie beides false |
| `WARN_RECHERCHE_FEHLT` | Skill ergaenzt pro Nugget `recherche.suchbegriffe` + `recherche.ki_beispiel` + `recherche.ki_lernen` (2) + `recherche.selbst_pruefen`, laeuft weiter |
| `WARN_PROMPT_EINTOENIG` | Skill erdet die Prompts am Nugget-Inhalt + waehlt verschiedene Moves aus dem Strategie-Menu (Anti-Sameness), laeuft weiter |
| `ERR_A2_SATZ_ZU_LANG` / `ERR_A2_BEGRIFF_OHNE_GLOSSAR` | Pre-Write-Block: Satz aufteilen bzw. Glossar-Eintrag ergaenzen, dann erneut schreiben |
| `ERR_DOSSIER_GAP` | Pre-Write-Block: fehlendes Nugget/Scaffold ergaenzen, bis jede Leitfrage + jeder KN-Anspruch gedeckt ist |
| `ERR_ANREDE_DU` | Pre-Write-Block: alle du/dein/dir/dich + Du-Imperative auf Sie-Form umstellen (ICH-Narrativ bleibt), dann erneut schreiben |
| `ERR_LF_FALL_MISMATCH` | Pre-Write-Block: Anwenden-LF an den `situation_text`-Fall angleichen (oder Situation angleichen) + Dossier-Deckung sicherstellen |
| `WARN_MATERIAL_UNGEDECKT` | Skill ergaenzt das Dossier ODER formuliert das Scaffold um ODER nimmt das Material in die Begleiter-Liste „Von der Lehrperson bereitzustellen" auf, laeuft weiter |
| `WARN_KI_RULE_LANGUAGE` | Skill formuliert KI-Text von Regel- auf Empfehlungs-Sprache um, entfernt KI-Fluency-Verweis, wartet auf OK |
| `WARN_TROUBLESHOOTING_COUNT` | Skill reduziert auf genau einen Troubleshooting-Callout an der kritischsten LF, wartet auf OK |
| `WARN_ERWARTUNGSHORIZONT_K2_FORMAT` | Skill stellt K2-Frage auf «vollstaendig vs. lueckenhaft» um, wartet auf OK |
| `WARN_BEGLEITER_TERMINOLOGY` | Skill ersetzt «Situation X» → «Herausforderung X» ausserhalb der Whitelist, wartet auf OK |
| `ERR_*` | Keine Auto-Fix, Skill stoppt, schreibt nichts (bei Begleiter-ERR: Baustein ergaenzen, nicht final speichern) |

Bei `WARN_*`-Codes laeuft die Skill weiter, nachdem die Korrektur angewendet ist; bei `ERR_*` muss Pietro die zugrundeliegende Inkonsistenz manuell aufloesen.
