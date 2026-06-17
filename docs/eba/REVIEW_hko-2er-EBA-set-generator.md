# Review-Dokument: Skill `hko-2er-EBA-set-generator`

**Erstellt:** 2026-06-17 · **Stand:** 2026-06-17, Rev. 2 (Boss-Feedback eingearbeitet) · **Zweck:** Nachvollziehbare Kontrolle aller Änderungen durch die Reviewperson (KT1/Boss).

> ## Nachtrag Rev. 2 — Antworten auf das Boss-Feedback
>
> **1. Leeres `hf_C`?** Nein. Der Skill schreibt **nur 2 Dateien** (`herausforderung_A.json` + `_B.json`),
> **kein** `herausforderung_C.json`. Der Loader (`src/lib/einheiten/index.ts`) ist null-sicher: er ruft
> `pickJson(slug, 'herausforderung_C')` auf, das bei fehlender Datei `null` liefert — `hf_C` ist also nur
> *im Arbeitsspeicher* `null`, **nichts wird auf die Platte geschrieben**. → Nichts zurückzubauen. Die
> missverständliche Formulierung in §7 wurde korrigiert (siehe unten); §4 und §7 stimmen jetzt überein.
>
> **2. SuK-Kriterien.** Umgesetzt wie entschieden: Kriterien-Namen **„Fachkorrektheit" + „Argumentation"
> bleiben**; Konventionen + Sprachbewusstheit sind **darin integriert** (z. B. „Fachkorrektheit inkl.
> sprachlicher Konventionen"), **keine Normen** (EBA). Geändert in `kn-template.json` + 5 Regeldateien.
>
> **3a. A2 als hartes ERR-Gate (nicht nur dokumentiert).** Ja — jetzt explizit als **blockierender
> Pre-Write-Schritt** in der Pipeline: in der Phase-2-Validierungsliste steht das A2-Gate als erster
> Punkt („`ERR_A2_SATZ_ZU_LANG` / `ERR_A2_BEGRIFF_OHNE_GLOSSAR` **stoppen den Write**"), zusätzlich als
> globaler Pipeline-Hinweis vor den Phasen und in Phase 7 Step 4. `a2-language-rules.md` ist das
> Regelwerk dahinter; die Durchsetzung steht in `SKILL.md` + `coherence-checklist.md` (Check NEU A).
>
> **3b. `ERR_DOSSIER_GAP`.** Ja, harter ERR mit definierter Prüflogik: `coherence-checklist.md`
> Check NEU B + `dossier-architecture.md` §6 + `SKILL.md` Phase 7 Step 4 + Fehlertabelle.
>
> **3c. Override-Tabelle vs. 3er-Reste.** Ich habe nach dem Feedback die entscheidungsrelevanten
> 3er-Reste im Fliesstext **direkt entfernt** (C, K4-Pflicht, Kapitel-/Lehrmittel-Anker, „3 von 3",
> Persona 3+3) — eine gezielte Suche findet keine entscheidungsrelevanten Reste mehr. Die
> Override-Tabelle bleibt als Sicherheitsnetz. **Im Piloten wird gezielt geprüft**, ob trotzdem ein C,
> eine K4-Pflichtfrage oder ein Kapitel-Anker durchschlägt (Boss-Vorgabe).

---

**Zweck:** Nachvollziehbare Kontrolle aller Änderungen durch die Reviewperson (KT1/Boss).
**Auftragsgrundlage:** `docs/eba/COWORK_AUFTRAG_eba_2er_skill.md` + `docs/eba/EBA_2er_set_generator_KONZEPT.md` (bei Konflikt gewinnt das Konzept).

Alle Dateien liegen unter:
`.claude/skills/hko-2er-EBA-set-generator/`

> **Was diese Skill tut:** Sie erzeugt aus einer EBA-Kompetenz (`nrlp_2j.json`) eine komplette
> handlungskompetenzorientierte Unterrichtseinheit für die **2-jährige Grundbildung (EBA)** —
> 2 Herausforderungen (A/B), ein Set-Dokument, einen Kompetenznachweis, ein Lehrpersonen-
> Begleitdokument und — weil EBA kein Lehrmittel hat — ein selbst generiertes, A2-konformes
> **Wissens-Dossier**. Sie ist ein Fork des bestehenden `bbw-hko-3er-set` (EFZ).

---

## 1. Wie kontrollieren? (3 schnelle Checks)

1. **Ordner vorhanden:** `.claude/skills/hko-2er-EBA-set-generator/` mit `SKILL.md`, 5 Dateien in `assets/`, 14 in `references/`.
2. **JSON gültig:** alle 5 Templates in `assets/` sind valides JSON und tragen `"lehrgang": "EBA_2J"` (programmatisch geprüft, bestanden).
3. **Kein Lehrmittel mehr, kein ß:** im Skill stehen keine Lehrmittel-/Kapitel-Anker mehr (durch „Dossier"-Anker ersetzt); kein Eszett im Inhalt (nur in Regel-Dokumentation).

---

## 2. Was ist NEU vs. aus dem 3er übernommen

| Datei | Status | Kurzbeschreibung |
|---|---|---|
| `SKILL.md` | **stark umgeschrieben** | Workflow-Steuerung, jetzt EBA/2er, 8 Phasen |
| `assets/prinzip-template.json` | umgebaut (war Vorarbeit) | roter Faden, 2 Herausforderungen |
| `assets/mission-template.json` | **umgebaut** | eine Herausforderung A oder B |
| `assets/set-template.json` | **umgebaut** | Set-Dokument, 2 Herausforderungen |
| `assets/kn-template.json` | **umgebaut** | Kompetenznachweis, Fachgespräch primär |
| `assets/dossier-template.json` | **NEU** | A2-Wissens-Dossier (ersetzt Lehrmittel) |
| `references/a2-language-rules.md` | **NEU** | A2-Sprachregeln (hartes Prüf-Gate) |
| `references/dossier-architecture.md` | **NEU** | Bauregeln + Fakten-Web-Validierung fürs Dossier |
| `references/coherence-checklist.md` | erweitert | EBA-Schwellen + 3 neue Prüfungen |
| `references/hko-framework.md` | erweitert | EBA-Quoten, Persona-Mix, 8 EBA-Themen |
| `references/prinzip-architecture.md` | erweitert | EBA-Override-Abschnitt |
| `references/kn-architecture.md` | erweitert | EBA-Override-Abschnitt |
| `references/json-field-mapping.md` | erweitert | EBA-Felder + Dossier-Felder |
| `references/_migration_notes.md` | erweitert | Delta-Tabelle 3er → 2er-EBA |
| `references/language-rules.md` | **unverändert** | stufenneutral übernommen |
| `references/sprachfoerderung-methoden.md` | **unverändert** | stufenneutral |
| `references/sprachmodus-ids.md` | **unverändert** | stufenneutral |
| `references/_common_misspellings.md` | **unverändert** | stufenneutral |
| `references/system-overview.md`, `system-data.md` | unverändert | System-Doku |

---

## 3. Die inhaltlichen Kern-Entscheidungen (das Wichtigste zum Prüfen)

Diese Werte sind der eigentliche fachliche Unterschied EBA ↔ EFZ. Sie stehen im Konzept §1/§2.2
und sind jetzt in den Templates + Regeln umgesetzt:

| Stellschraube | EFZ-3er | **EBA-2er (umgesetzt)** | Quelle |
|---|---|---|---|
| Anzahl Herausforderungen | 3 (A/B/C) | **2 (A/B)** | Konzept §1 |
| Niveau (Bloom) | bis K4 | **K2–K3, K3 als Decke** (K4 nur Vertiefung) | Konzept §1, RLP |
| Quoten pro Thema | 3 SK / 3 Aspekte / 3 Modi | **2 SK / 2 Aspekte / 1 Modus** | RLP Z.791 |
| Kompetenznachweis-Primärform | gleichrangig | **Fachgespräch (mündlich)** | RLP Z.791 (mündlicher EBA-Schwerpunkt) |
| Mini Case / Werkschau | normal | **vereinfacht** (kürzer, K3, mehr Hilfen) | Konzept §1 #10 |
| Bewertungsraster Sprache (SuK) | Fachkorrektheit + Argumentation (Konv/Normen/Sprachbew. integriert) | **Namen bleiben** Fachkorrektheit + Argumentation; Konventionen + Sprachbewusstheit **integriert**, **KEINE Normen** | RLP Z.791, hko-framework §6/§9 |
| Wissensquelle | externes Lehrmittel | **selbst generiertes A2-Dossier** | Konzept §0/§4 |
| Sprachniveau Schüler-Texte | — | **max. A2, hart erzwungen** | Konzept §5 |
| Wochen-Raster | fix 3 Wochen | **kein fixer Wert** (Lehrperson entscheidet) | Entscheid Pietro |
| Schlussarbeit/-prüfung | ja (EFZ) | **keine** — KN pro Einheit trägt alles | RLP §6.2/6.3 |

**Spiralen-Regel (verbindlich):** Bei nur 2 Herausforderungen müssen A und B **denselben Trade-off**
in **maximal unterschiedlichen** Kontexten zeigen — sonst sieht die lernende Person zwei Einzelfälle
statt ein übertragbares Prinzip.

---

## 4. Datei-für-Datei: was genau geändert wurde

### `SKILL.md` (Steuerungsdokument der Skill)
- Titel/Beschreibung auf EBA umgestellt (Auslöser-Stichworte: „EBA-Einheit", „EBA 2er-set" …).
- **Override-Tabelle ganz oben** („EBA-2er-OVERRIDE, verbindlich"): listet alle EBA-Werte und legt
  fest, dass diese gegenüber jeder verbliebenen 3er-Formulierung im Text gelten. Das ist der
  bewusste Ansatz, statt eine 1148-Zeilen-Datei Wort für Wort umzuschreiben (weniger Fehlerrisiko).
- **Zwei neue Arbeitsphasen:** Phase 3.5 „Wissensbedarf-Analyse" und Phase 7 „Dossier-Generierung
  inkl. Web-Faktencheck und A2-Prüfung".
- Phasen 0–5 inhaltlich auf 2 Herausforderungen, EBA-Niveau, Dossier-Anker und Sie-Form angepasst.
- Output jetzt **8 Dateien** (inkl. `dossier.json`); Fehlertabelle + Abschluss-Checkliste auf EBA
  kalibriert.

### `assets/*.json` (die Bau-Vorlagen)
- `prinzip / mission / set / kn`: durchgehend `EBA_2J`, nur A/B, EBA-Niveau, Bewertungsraster mit den
  EBA-Sprachkriterien, alle Lehrmittel-Verweise → Dossier-Verweise, `wochen`-Fixwert entfernt.
- `dossier-template.json` (**neu**): Aufbau des Wissens-Dossiers — kurze Wissens-Nuggets pro
  Herausforderung, Sprachhilfen, Transfer-Wissensblatt, Glossar, sowie pro Fakt ein Feld
  „validiert / von Lehrperson zu prüfen".

### `references/*.md` (die Regelwerke)
- `a2-language-rules.md` (**neu**): zählbare Sprachregeln (z. B. max. 18 Wörter pro Satz, jeder
  Fachbegriff braucht einen Glossar-Eintrag) **plus** Positiv/Negativ-Beispiele.
- `dossier-architecture.md` (**neu**): wie das Dossier rückwärts aus den fertigen Aufgaben + KN
  abgeleitet wird, plus der **Fakten-Web-Validierungs-Ablauf** (Beträge/Fristen werden geprüft;
  unklare Fakten werden für die Lehrperson markiert).
- `coherence-checklist.md`: EBA-Schwellen-Tabelle + 3 neue Pflichtprüfungen
  (A2-Einhaltung · Wissen-deckt-KN · Fakten-geprüft).
- `hko-framework.md`, `prinzip-architecture.md`, `kn-architecture.md`, `json-field-mapping.md`,
  `_migration_notes.md`: je ein klar markierter EBA-Abschnitt mit den geänderten Werten.

---

## 5. Punkte, die die Reviewperson / Pietro freigeben sollte

1. ~~Sprach-Bewertungskriterien~~ **ERLEDIGT (Rev. 2):** Namen „Fachkorrektheit" + „Argumentation"
   bleiben; Konventionen + Sprachbewusstheit integriert, keine Normen. (Boss-Entscheid umgesetzt.)
2. **Mini Case + Werkschau** sind als „vereinfachte Alternativen" zum Fachgespräch markiert — **nicht**
   als „nur für schreibstarke Klassen". Offen, ob das so bleibt (Konzept §8 #4).
3. **Renderer-Anbindung steht aus (bewusst):** Die Web-Plattform zeigt das Dossier noch nicht an; die
   Einheit erscheint trotzdem korrekt im Katalog. Renderer-Anpassung erst nach Gold-Review — wie beim
   3er-Vorgehen.

---

## 6. Was bewusst NICHT gemacht wurde

- **Keine** Änderungen an der Web-Plattform / am Renderer.
- **Keine** Migration bestehender 3er/5er-Einheiten.
- **Keine** Schema-Verschärfung (kommt nach Gold-Review).
- **Pilot noch offen:** Eine echte Beispiel-Einheit (Vorschlag: T1 „Ins Berufsleben einsteigen")
  wird als Nächstes generiert und zur Gold-Review nach `docs/eba/_pilot_output/` gelegt — erst dann
  wird live geschaltet.

---

## 7. Technischer Hinweis (für die IT-Kontrolle)

- Alle Dateien sind UTF-8, echte Umlaute, **kein Eszett (ß)** im Inhalt.
- Die 5 JSON-Vorlagen wurden programmatisch als gültiges JSON verifiziert.
- Unterscheidung EBA ↔ EFZ erfolgt ausschließlich über das Feld `lehrgang: "EBA_2J"`; beide Systeme
  schreiben in denselben Ordner `src/data/einheiten/`.
- **Zwei vs. drei Dateien (Klarstellung, konsistent mit §4):** Der Skill schreibt **nur**
  `herausforderung_A.json` + `herausforderung_B.json` — **kein** `herausforderung_C.json`. Der Loader
  (`src/lib/einheiten/index.ts`) ruft `pickJson(slug, 'herausforderung_C')` auf, das bei fehlender
  Datei `null` zurückgibt. `hf_C` ist also nur ein `null`-Wert im Arbeitsspeicher — **auf der Platte
  liegen 8 Dateien, keine leere C-Datei.** Es gibt nichts zurückzubauen.
