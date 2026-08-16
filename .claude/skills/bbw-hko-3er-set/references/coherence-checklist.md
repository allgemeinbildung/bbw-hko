# Kohaerenz-Checkliste — 3er-Set

31 Checks (v2.3): Phase 2 (Checks 1-9, 14, 17, 18-Sit-Teil, 19-24, 30, 31), Phase 4 (Checks 10-13, 15-16, 18-KN-Teil), **Phase 5 / Begleiter (Checks 25-29, v2.1 — Struktur-Spec v2.1 TEIL 6/8)**. Bei ERR in 1-9/14/19/21/22/23/31: keine Mission-JSONs schreiben. Bei ERR in 10-13+16: keine `kn.json` schreiben. Bei ERR in 25-29: `begleiter.md` nicht final speichern, fehlenden Baustein ergaenzen. Check 15, 17 und 20 sind WARN-only. Check 31 ist **gespraechspflichtig statt blockierend**: >3 Seiten sind erlaubt, aber nur nach Ruecksprache mit Pietro (Quote: max. 1 pro Herausforderung, 2 pro Einheit). Check 18 ist WARN fuer Residual-Patterns, ERR fuer Persona-Felder und Eszett. Checks 19-24 sind aus dem Auftrag/Dossier-Redesign (v2.0); Checks 25-29 sind die Begleiter-v2-Checks (v2.1); Check 30 (Musterloesung) ist v2.2, Check 31 (knoten_ref-Praezision, C9) ist v2.3.

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

Alle Prosa-Felder ueber alle Output-Dateien (prinzip.json, herausforderung_A/B/C.json,
set.json, kn.json, begleiter.md) verwenden echte Umlaute `ä/ö/ü/Ä/Ö/Ü`.
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
5. Persona-Spezial-Check: `sit_*.persona.beruf` und `sit_*.persona.ort` MUESSEN
   string-identisch mit kanonischer Tabelle (Spalte „Schreibweise mit
   Umlauten") sein. Bei Abweichung mit ae/oe/ue: `ERR_PERSONA_NOT_CANONICAL`.
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

### Check 24b — Sie-Form der Auftrags-Felder (NEU v2.2)
Alle SuS-gerichteten **Auftrags-** und **Hinweis**-Felder stehen in der Sie-Form (Höflichkeits-Imperativ), nicht in der Du-Form. Betroffen:

`sit_*.leitfragen_intro` · `sit_*.leitfragen[].text` · `sit_*.handlungsprodukt.format_detail` · `sit_*.handlungsprodukt.schritte[].hint` · `sit_*.mehrdeutigkeit.hint` · `set.austausch_phase.einzelauftrag` · `set.dekontextualisierungs_aufgabe.auftrag` · `kn.kn_typen[*].fragestruktur[].frage` · `kn.kn_typen[*].aufgaben[].aufgabe` · `kn.kn_typen[*].reflexionsfragen[]`

Heuristik: Diese Felder enthalten kein `du/dein/deine/deinen/deinem/deiner/deines/dich/dir/Du` ausserhalb von Anführungszeichen. Verbformen müssen mitgeprüft werden — `Erkläre …` ohne `Sie` ist ebenfalls ein Treffer, auch wenn kein Pronomen vorkommt.

Ausnahmen (kein Fehler): zitierte Rede anderer Personen; der Fachbegriff „Du-Botschaft"; Prompt-Texte in `ki.json` / `lernprompt.json` / `lernbegleiter.json`, in denen die Lernende eine KI anspricht.

Fehlerfall: `WARN_DU_FORM_AUFTRAG` — Skill stellt die betroffenen Felder auf Sie-Form um (Pronomen **und** Verbform), wartet auf OK.

---

## Phase-5-Checks (25-29, Begleiter) — Struktur-Spec v2.1 TEIL 6/8

Diese Checks laufen NACH der Generierung von `begleiter.md`, vor dem finalen Speichern. Sie sichern die fuenf LP-Support-Erweiterungen (§E1-E5) und die As-built-Entscheide (TEIL 8). Datenquelle ist das bereits geschriebene Set (`prinzip.json`, `herausforderung_A/B/C.json`, `set.json`, `kn.json`) — die Bausteine sind Datenhebung, kein Neuerfinden.

### Check 25 — Kapitel 1.6 KI-Einsatz (§E5)
Sektion 1 enthaelt ein Sub-Kapitel `1.6 KI-Einsatz — Nutzungsideen fuer diese Einheit` mit genau einem `[!ki_einsatz]`-Callout (Einheits-Uebersicht). Pflicht: Empfehlungs-Rahmung („Ob/Wie bleibt LP-Entscheid"), KEINE KI-Regel/Verbot/Gebot, KEIN Verweis auf die (unveroeffentlichten) KI-Fluency-Materialien.

Fehlerfall: `ERR_BEGLEITER_NO_KI_OVERVIEW` (Kapitel fehlt) · `WARN_KI_RULE_LANGUAGE` (regex `/verboten|nicht erlaubt|Pflicht|musst|darfst nicht|Hilfsmittel(regel|ung)|Z\.?\s?749|KI-Fluency/i` im 1.6- oder `[!ki_einsatz]`-Text → Pietro reviewt).

### Check 26 — Vier v2-Bausteine je Herausforderung an korrekter Position (§E2-E5)
Fuer JEDE der drei Herausforderungs-Sektionen (3/4/5) existieren alle vier Bausteine in der Spec-§1.5-Reihenfolge:
1. `[!troubleshooting]` — genau **einer** pro Herausforderung, IM Leitfragen-Block (§E3)
2. `[!tafelbild]` — **vor** der Scaffold-Werkstatt (§E4)
3. «Wann ist das Produkt fertig?»-Haken-Liste — **nach** der Scaffold-Werkstatt (§E2)
4. `[!ki_einsatz]` — **nach** dem Vollstaendigkeits-Check, **vor** dem Coaching-Block (§E5)

Fehlerfall: `ERR_BEGLEITER_V2_BLOCK_MISSING` — listet Herausforderung + fehlenden/fehlplatzierten Baustein. `WARN_TROUBLESHOOTING_COUNT` wenn ≠ 1 Troubleshooting-Callout pro Herausforderung.

### Check 27 — Vollstaendigkeits-Check ist reine Haken-Liste ohne Gewichte (§E2)
Die «Wann ist das Produkt fertig?»-Liste rendert als `☐`-Checkliste, NICHT als Tabelle mit Prozenten. Es darf KEIN `gewicht_prozent`/`%`-Wert erscheinen (Entscheid Pietro 2026-06-22: Gewichte suggerieren Benotung; der Check ist formativ). Inhalt 1:1 aus `bewertungsraster[].produkt` (Ueberschrift) + `vollstaendig_wenn[]` (Haken-Punkte), Reihenfolge Leitfragen → Mindmap → Handlungsprodukt → Reflexion.

Fehlerfall: `ERR_VOLLSTAENDIGKEIT_HAS_WEIGHTS` (Prozente/Gewichte im Check gefunden) · `WARN_VOLLSTAENDIGKEIT_SOURCE_DRIFT` (Haken-Punkte weichen von `vollstaendig_wenn[]` ab).

### Check 28 — Erwartungshorizont je Prueffrage (§E1)
Sektion 8 enthaelt pro Frage/Aufgabe im Fragenpool einen `[!erwartungshorizont]`-Callout direkt nach der Frage. Titel = Frage-Nr + K-Stufe. K3/K4-Fragen: drei Zeilen (Stufe 3 zeigt / Stufe 4 zeigt zusaetzlich / Nicht Stufe 4 = Zielkonflikt-Aufloesung). K2-Fragen: «vollstaendig vs. lueckenhaft» (kein «Stufe 4 vs. aufloesen»-Kontrast). Anzahl == Zahl der Prueffragen der gewaehlten KN-Typen.

Fehlerfall: `ERR_ERWARTUNGSHORIZONT_MISSING` — listet Fragen ohne Erwartungshorizont · `WARN_ERWARTUNGSHORIZONT_K2_FORMAT` (K2-Frage nutzt den K3/K4-Dreizeiler).

### Check 29 — As-built-Invarianten (TEIL 8)
- **Kein Anhang:** Es existiert KEIN Schluss-Kapitel «Anhang — Quellen» (TEIL 8.3). Dokument endet mit Sektion 8.
- **Rubrik-Skala/Baender:** Sektion 8 nutzt Stufenskala **1–4** (1 = tiefste) und Niveaubaender **unter 60 % / 80 % / 100 %**, konsistent mit `kn.rubrik_shared` (TEIL 8.2).
- **Callout-Typen ⊆ 10:** jeder `[!typ]` im Begleiter ∈ {lernziel, hinweis, beispiel, warnung, reflexion, coaching, mehrdeutigkeit, differenzieren, erwartungshorizont, troubleshooting, tafelbild, ki_einsatz}.
- **Terminologie:** sichtbare Prosa nutzt «Herausforderung A/B/C», nie «Situation X» (Ausnahmen: Fachbegriff «Lernsituation», Eigenname «Situationsblaetter»; TEIL 8.1).

Fehlerfall: `ERR_BEGLEITER_ANHANG_PRESENT` · `ERR_BEGLEITER_RUBRIK_SCALE` · `ERR_CALLOUT_TYPE_UNKNOWN` · `WARN_BEGLEITER_TERMINOLOGY` (Restvorkommen «Situation X» ausserhalb der Whitelist).

---

### Check 30 — Musterloesung tragfaehig (C7, NEU)

`sit_*.handlungsprodukt.musterloesung` existiert und ist ein **ausgefuelltes Produkt**, keine Vorlage:

- `abschnitte.length` zwischen 3 und 5; jeder Abschnitt `{titel, zeilen[]}` mit >=1 Zeile.
- **Pro Abschnitt max. ~900 Zeichen `text`.** Das Unterrichtsdeck rendert die Abschnitte als Akkordeon (immer nur einer offen) — ein zu langer Abschnitt laeuft aus der Folie, `hyperframes check` meldet `canvas_overflow`.
- `zeilen[].label` max. ~24 Zeichen, `zeilen[].quelle` max. ~30 Zeichen (Chip, `nowrap`).
- Die Musterloesung erfuellt `format_detail` messbar: geforderte Wortzahl (im `hinweis` beziffern), geforderte Bauteile, geforderte Quellenzahl.
- Kein Widerspruch zum `[!tafelbild]`-Callout derselben Sektion im `begleiter.md`.
- Offene Rechts- oder Sachlage wird **explizit benannt** statt geglaettet — das ist der Stufe-4-Anteil und spiegelt `mehrdeutigkeit.hint`.
- `hinweis` richtet sich an die Lehrperson (Stufe des Beispiels, was daran exemplarisch ist) und erscheint nur in den Referentennotizen.

Fehlerfall: `ERR_MUSTERLOESUNG_MISSING` (fehlt ganz) · `WARN_MUSTERLOESUNG_ABSCHNITT_ZU_LANG` (Skill teilt den Abschnitt, wartet auf OK) · `WARN_MUSTERLOESUNG_IST_VORLAGE` (enthaelt Platzhalter wie „…" oder Lueckenstriche statt ausformuliertem Inhalt).

---

### Check 31 — knoten_ref-Praezision (C9, NEU)

Jede `sit_*.leitfragen[].knoten_ref` mit Seitenangabe erfuellt:

- **Richtwert ≤ 3 Seiten.** Mehr ist erlaubt, aber nur nach Ruecksprache — siehe Ausnahme-Regel unten.
- **Seitenzahlen sind echte `[seite: NN]`-Marker** der referenzierten Kapiteldatei und liegen innerhalb deren Bereich. Nie geschaetzt. (Harter Fehler, nicht verhandelbar.)
- **Kapitelnummer stammt aus `references/nrlp-lehrmittel-crosswalk.md`**, nicht aus der nRLP-Nummer abgeleitet. (Harter Fehler.)
- Die Spanne deckt **alle** Teile der Leitfrage ab. Eine Verengung, die einen Frageteil abschneidet, ist schlimmer als eine zu breite Spanne — im Zweifel lieber breiter und Ruecksprache nehmen.
- Reine Reflexions-/Beurteilungsfragen ohne Lehrmittelentsprechung tragen **keinen** `knoten_ref` statt eines vorgetaeuschten.

Nicht geprueft wird `quellen_anker[].seiten` — das Feld benennt die Quelle der ganzen Herausforderung und darf bewusst den vollen Abschnitt umfassen.

Pruefverfahren: Kapiteldatei parsen (`[seite: NN]` + Ueberschriften `##`/`###`/`####`, `<!-- header: … -->` verwerfen), Abschnitt zur Leitfrage ueber die **Ueberschriften** bestimmen. Worthaeufigkeit im Fliesstext ist als Signal untauglich — in Methodenkapiteln (17.x, 20.x) stehen «schreiben», «Begruendung», «Beispiel» auf nahezu jeder Seite.

#### Ausnahme-Regel: mehr als 3 Seiten

Manche Inhalte stehen tatsaechlich verteilt — dann ist eine breitere Spanne richtig und keine Schlamperei. Solche Faelle sind **erlaubt, aber gespraechspflichtig**: die Skill schreibt sie nie stillschweigend, sondern **stoppt und legt sie Pietro kurz vor**.

**Vorlageformat — knapp halten, er soll in einem Blick entscheiden koennen:**

```
knoten_ref-Ausnahme — {Einheit} / Herausforderung {X} / LF{n}
Leitfrage:  {Text, gekuerzt}
Gefunden:   Kap. {X.Y} S. {a}-{b} ({n} Seiten) — {Ueberschrift je Seite}
Warum breit: {ein Satz — welche Teile der Frage wo stehen}
Optionen:   (1) so lassen  (2) Leitfrage teilen: {konkreter Schnittvorschlag}
            (3) auf {engere Spanne} kuerzen, {Frageteil} faellt weg
Empfehlung: {eine der drei, mit halbem Satz}
```

Erst nach Pietros Entscheid wird geschrieben. Ohne Entscheid: `ERR_KNOTEN_REF_OHNE_ENTSCHEID`, keine Mission-JSONs.

**Quote — damit die Ausnahme die Ausnahme bleibt:**

- **Hoechstens eine Ausnahme pro Herausforderung.** Faellt eine zweite an, ist das kein Lehrmittelproblem mehr, sondern ein Zuschnittsproblem: die Skill meldet `WARN_KNOTEN_REF_QUOTE` und schlaegt **zuerst** eine Teilung oder Neuformulierung der Leitfragen vor, bevor sie ueberhaupt zum Ausnahme-Dialog uebergeht.
- **Hoechstens zwei pro Einheit** (3 Herausforderungen). Daruber: die Skill sagt ausdruecklich, dass das Prinzip zu breit gefasst ist, und bietet an, Phase 0.5 nachzuschaerfen.
- Ausnahmen werden **einzeln** vorgelegt, nie gebuendelt am Schluss — sonst nickt man sie durch.

Faustregel fuer die Empfehlung: Bis 4 Seiten ist «so lassen» meist richtig, wenn die Frage zwei benachbarte Abschnitte braucht. Ab 5 Seiten ist die Leitfrage fast immer zu breit geschnitten — dann Teilung empfehlen, nicht die Spanne.

Fehlerfall: `ERR_KNOTEN_REF_SEITE_UNGUELTIG` (Seite existiert im Kapitel nicht) · `ERR_KNOTEN_REF_OHNE_ENTSCHEID` (>3 Seiten geschrieben, ohne Pietro gefragt zu haben) · `WARN_KNOTEN_REF_QUOTE` (zweite Ausnahme in derselben Herausforderung bzw. dritte in der Einheit) · `WARN_KNOTEN_REF_OHNE_DECKUNG` (Lehrmittel beantwortet die Frage nicht — Anker entfernen oder Leitfrage schaerfen).

---

## Auto-Fix-Verhalten

| Code | Aktion |
|---|---|
| `WARN_BLOOM_TOO_LOW` | Skill ergaenzt 5. Leitfrage auf K4, fragt User zur Bestaetigung |
| `WARN_MEHRDEUTIGKEIT_NEAR_MISS` | Skill schlaegt naechstgelegenen Trade-off vor, wartet auf OK |
| `WARN_LF4_EQUALS_HP` | Skill verengt LF4 auf einen Sprachform-Baustein (ein Block / eine Spalte / drei Saetze), wartet auf OK |
| `WARN_DU_FORM_NARRATIVE` | Skill schreibt situation_text + handlungsprodukt.beschreibung in 1. Person Singular um (Zitate bleiben), wartet auf OK |
| `WARN_KI_RULE_LANGUAGE` | Skill formuliert KI-Text von Regel- auf Empfehlungs-Sprache um, entfernt KI-Fluency-Verweis, wartet auf OK |
| `WARN_TROUBLESHOOTING_COUNT` | Skill reduziert auf genau einen Troubleshooting-Callout an der kritischsten LF, wartet auf OK |
| `WARN_ERWARTUNGSHORIZONT_K2_FORMAT` | Skill stellt K2-Frage auf «vollstaendig vs. lueckenhaft» um, wartet auf OK |
| `WARN_BEGLEITER_TERMINOLOGY` | Skill ersetzt «Situation X» → «Herausforderung X» ausserhalb der Whitelist, wartet auf OK |
| `>3 Seiten` (kein Fehlercode) | **Kein Auto-Fix.** Skill stoppt, legt den Fall im Ausnahme-Format vor (Leitfrage · gefundene Spanne mit Ueberschriften · warum breit · drei Optionen · Empfehlung), wartet auf Pietros Entscheid |
| `WARN_KNOTEN_REF_QUOTE` | Skill schlaegt **zuerst** Teilung/Neuformulierung der Leitfragen vor, statt eine zweite Ausnahme zu beantragen; ab der dritten in der Einheit zusaetzlich Angebot, Phase 0.5 nachzuschaerfen |
| `WARN_KNOTEN_REF_OHNE_DECKUNG` | Skill schlaegt vor, `knoten_ref` leer zu lassen, und nennt die Alternative (anderes Kapitel via Crosswalk), wartet auf OK |
| `ERR_*` | Keine Auto-Fix, Skill stoppt, schreibt nichts (bei Begleiter-ERR: Baustein ergaenzen, nicht final speichern) |

Bei `WARN_*`-Codes laeuft die Skill weiter, nachdem die Korrektur angewendet ist; bei `ERR_*` muss Pietro die zugrundeliegende Inkonsistenz manuell aufloesen.
