# Lernprompt-Techniken — Set-Level Prompting-Guide (Phase 3)

Eine Datei `lernprompt.json` (Top-Level-Key `lernprompt`), gebunden an die ganze
Einheit. Renderer: `DocLernprompt` (verschränkt je 2 Technik-Karten mit einer
Stacking-Seite).

## Kanonische Technik-Bibliothek (6, unveränderlich)

| Key | Titel | Wann |
|---|---|---|
| `rollen_prompting` | Rollen-Prompting | universal |
| `kontextualisieren` | Kontext geben | universal |
| `chain_of_thought` | Schritt-für-Schritt denken | Argumentieren, Abwägen, Entscheiden |
| `format_vorgeben` | Format vorgeben | Textproduktion, Strukturaufgaben |
| `gegenposition_fordern` | Gegenposition fordern | Meinungsbildung, Ethik, SK 5/6 |
| `quellen_anfordern` | Quellen und Belege anfordern | Recherche, Faktencheck, SK 1, Recht |

## Auswahl (immer 4 von 6; Signale aus dem PRINZIP)

Immer: `rollen_prompting` + `kontextualisieren`. Plus 2 nach:

| Signal | Bevorzuge |
|---|---|
| sk_targets enthält 1 | `quellen_anfordern` |
| sk_targets enthält 5 oder 6 | `gegenposition_fordern` |
| sk_targets enthält 6 | `chain_of_thought` |
| Aspekte enthalten Ethik | `gegenposition_fordern` |
| Aspekte enthalten Recht | `quellen_anfordern` |
| Handlungsprodukte mehrheitlich schriftlich | `format_vorgeben` |

Gleichstand: `chain_of_thought` vor `format_vorgeben`.

> Gold-Unit 1.1.1_konflikt: Recht + Ethik + SK6 dominant → `gegenposition_fordern`
> + `quellen_anfordern` als +2.

## Feld-Regeln (Schema: assets/lernprompt-template.json)

- `erklaerung`: Wie + Warum, 2-3 Sätze, **KEINE Beispiele**
- `thema_bezug` + `warnung`: unit-spezifisch, nie generisch
- `beispiel_basis` / `beispiel_fortgeschritten`: direkt kopierbare Prompts mit
  Unit-Material
- `baukasten`: pro Technik eigene, kurze Chip-Optionen in `rolle/kontext/aufgabe/format`
  (nicht 4× identisch)
- `stacking_seite_1` = Technik 1+2, `stacking_seite_2` = Technik 3+4;
  `prompt_2` baut EXPLIZIT auf `prompt_1` auf
- `prompt_vorlage`: konstanter Merksatz «[Rolle] + [Kontext] + [Aufgabe] + [Format]»
- Echte Umlaute, kein ß

## Anti-Patterns

Beispiele in `erklaerung` · generischer `thema_bezug` · identische Baukästen ·
«verbessere den Text»-Stacking ohne Aufbau · Fantasie-Techniken · Transliteration
in Prosa.
