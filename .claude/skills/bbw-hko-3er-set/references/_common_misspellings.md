# Common Misspellings — Pre-Write-Check

Diese Datei listet bekannte Skill-Halluzinationen mit korrekter Schreibweise.
Phase 2 (Sit-Write) und Phase 4 (KN-Write) prüfen jeden generierten Textstring
gegen diese Tabelle. Bei Match: automatische Korrektur ohne User-Eingriff.

**WICHTIG — Frontend-Prosa nutzt echte Umlaute ä/ö/ü.** Die rechte Spalte
("Korrekt") enthält die finale Form, wie sie ins JSON geschrieben wird. Bei
Prosa-Feldern (situation_text, leitfrage, leitfragen[].text, persona.beruf,
handlungsprodukt.*, reflexion_fragen, mehrdeutigkeit.hint,
dekontextualisierung.*, prinzip_handoff.*, sk_anker[].wo, hybrid_situation.*,
fragestruktur[].frage, aufgaben[].aufgabe) heisst das: **ä/ö/ü nativ, kein
ae/oe/ue**. Transliteration bleibt nur in IDs, slugs, filenames, JSON-keys.

Erweiterung: nach jedem Audit-Run neue Halluzinationen in diese Liste
aufnehmen. Datei wächst monoton.

## Adjektive / Partizipien
| Falsch        | Korrekt       | Kontext / Skill-Version |
|---------------|---------------|--------------------------|
| berechtig     | berechtigt    | sit_C 3.2.1, v1.1        |
| verfuegbar    | verfügbar     | Prosa: ue → ü |
| ueberlegt     | überlegt      | Prosa: ue → ü |
| Bedduerfnis   | Bedürfnis     | typischer Tippfehler + Umlaut-Wiederherstellung |

## Berufsbilder (Transliterations-Bugs)
| Falsch        | Korrekt       | Kontext |
|---------------|---------------|---------|
| Koeechin      | Köchin        | 3.2.2 v1 — doppelte "e", Prosa-Umlaut |
| Koechin       | Köchin        | Prosa: oe → ö |
| Koeche        | Köche         | Prosa: oe → ö |
| Aerztin       | Ärztin        | Prosa: Ae → Ä |
| Baecker       | Bäcker        | Prosa: ae → ä (canonical Lehrberuf-Tabelle) |

## Häufige Tippfehler in Fachbegriffen
| Falsch                 | Korrekt              |
|------------------------|----------------------|
| Massssstab             | Massstab             |
| sssss                  | (nie 5x s — meistens ss) |
| Oekobilanze            | Ökobilanz            |
| Oekobilanz             | Ökobilanz            |
| Wertschoepfung-kette   | Wertschöpfungskette  |
| Wertschoepfungskette   | Wertschöpfungskette  |

## Pauschal-Transliterations-Fixes (Prosa-Felder)

Diese Patterns NUR in Prosa-Feldern anwenden (siehe Liste oben). NICHT in
IDs, slugs, filenames, JSON-keys, oder topic_slug-Werten.

| Pattern (Wortteil)     | Ersatz       | Beispiel falsch → richtig |
|------------------------|--------------|---------------------------|
| `fuer`                 | `für`        | „fuer dich" → „für dich" |
| `ueber`                | `über`       | „ueberlegen" → „überlegen" |
| `muess`                | `müss`       | „muessen" → „müssen" |
| `moeg`                 | `mög`        | „moeglich" → „möglich" |
| `Aend`                 | `Änd`        | „Aenderung" → „Änderung" |
| `naeh`                 | `näh`        | „naeher" → „näher" |
| `haeu`                 | `häu`        | „haeufig" → „häufig" |
| `Pruef`                | `Prüf`       | „Pruefung" → „Prüfung" |
| `Befuel`               | `Befül`      | „Befuellung" → „Befüllung" |
| `Werte`                | `Werte`      | (ok — keine Änderung, hier nur Erinnerung) |
| `gemaess`              | `gemäss`     | „gemaess Vorgabe" → „gemäss Vorgabe" |
| `staedte`              | `städte`     | „Schweizer Staedte" → „Schweizer Städte" |
| `oekolog`              | `ökolog`     | „oekologisch" → „ökologisch" |
| `Beduerfn`             | `Bedürfn`    | „Beduerfnis" → „Bedürfnis" |
| `verfueg`              | `verfüg`     | „verfuegbar" → „verfügbar" |
| `auswael`              | `auswähl`    | „auswaehlen" → „auswählen" |
| `unguen`               | `ungün`      | „unguenstig" → „ungünstig" |
| `guen`                 | `gün`        | „guenstig" → „günstig" |
| `Loes`                 | `Lös`        | „Loesung" → „Lösung" |
| `Foerd`                | `Förd`       | „Foerderung" → „Förderung" |
| `Stoer`                | `Stör`       | „Stoerung" → „Störung" |
| `Erklaer`              | `Erklär`     | „Erklaerung" → „Erklärung" |
| `Erfaehr`              | `Erfähr`     | „erfaehrst" → „erfährst" |
| `waehl`                | `wähl`       | „waehlst" → „wählst" |
| `Maerk`                | `Märk`       | „Maerkte" → „Märkte" |
| `Geschae`              | `Geschä`     | „Geschaeft" → „Geschäft" |

**Achtung — Eszett bleibt verboten.** ß wird NIE produziert. Auch in
Eigennamen (siehe language-rules.md §1). „Strasse", „muss", „gross",
„heisst" — alle mit ss.

## Anwendung

Bei JSON-Write iteriere durch die Strings aller text-relevanten Felder:
- `titel`, `situation_text`, `leitfrage`, `leitfragen_intro`
- `leitfragen[].text`, `handlungsprodukt.{titel, format_detail, beschreibung}`
- `handlungsprodukt.schritte[].{label, hint}`
- `reflexion_fragen[].text`
- `mehrdeutigkeit.hint`, `dekontextualisierung.{frage, ziel}`
- `prinzip_handoff.*`, `sk_anker[].wo`
- KN: `hybrid_situation.{text, leitfrage}`, alle `fragestruktur[].frage`,
  alle `aufgaben[].aufgabe`, `alignment_note.herausforderungen_mapping[].scene_element`

Bei jedem Match: korrigieren, im Output-Log notieren als
`SPELLCHECK_FIX: {falsch} → {korrekt} in {feld}`.

Bei mehr als 5 Fixes in einem File: `WARN_SPELLCHECK_HEAVY` — Skill koennte
qualitativ schlecht generiert haben, User-Review empfohlen.
