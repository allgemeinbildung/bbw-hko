# Lernprompt-Techniken — Set-Level Prompting-Guide (Phase 3)

Eine Datei `lernprompt.json` (Top-Level-Key `lernprompt`), gebunden an die ganze
Einheit. Renderer: `DocLernprompt` (verschränkt je 2 Technik-Karten mit einer
Stacking-Seite).

## Kanonische Technik-Bibliothek (6, unveränderlich)

`titel` steht **wörtlich** wie in dieser Liste — in jeder Einheit gleich, ohne
Wort der KI-Fachsprache. (Bis 07.10.2026 hiess die erste Technik «Rollen-Prompting»;
der Pilot schrieb freiere Titel, die Einheiten liefen auseinander.)

| Key | Titel (für Lernende, fest) | Wann |
|---|---|---|
| `rollen_prompting` | Der KI eine Rolle geben | universal |
| `kontextualisieren` | Kontext geben | universal |
| `chain_of_thought` | Schritt für Schritt denken | Argumentieren, Abwägen, Entscheiden |
| `format_vorgeben` | Form der Antwort vorgeben | Textproduktion, Strukturaufgaben |
| `gegenposition_fordern` | Gegenseite verlangen | Meinungsbildung, Ethik, SK 5/6 |
| `quellen_anfordern` | Quellen verlangen | Recherche, Faktencheck, SK 1, Recht |

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

Jede zutreffende Zeile ist ein Signal für ihre Technik; gewählt werden die zwei
Techniken mit den meisten Signalen. **Gleichstand** (auch zwischen drei oder vier):
in dieser Reihenfolge — `gegenposition_fordern`, `quellen_anfordern`,
`chain_of_thought`, `format_vorgeben`. Signale und Wahl stehen in der Rückmeldung.

> Beispiel 1.1.1_konflikt: Recht + Ethik + SK6 → `gegenposition_fordern` (2 Signale)
> + `quellen_anfordern` (1 Signal, vor `chain_of_thought` mit ebenfalls 1).

## Basis und Plus (`basis-plus.md` §4)

Technik 1 + 2 (`rollen_prompting`, `kontextualisieren`) und `stacking_seite_1`
sind die **Basis** und stehen zusammen auf Seite 1: kurze Erklärung, **ein** fertiger
Prompt mit Sprachzeile, eine Warnung — kein `beispiel_fortgeschritten`, kein
`baukasten`. Die zwei gewählten Techniken und `stacking_seite_2` sind **Plus**
(Seiten 2-3) und tragen den vollen Block. Die Feld-Regeln unten gelten für beide;
wo `basis-plus.md` kürzer ist, gilt `basis-plus.md`.

## Feld-Regeln (Schema: assets/lernprompt-template.json)

- `erklaerung`: Wie + Warum, 2-3 Sätze, **KEINE Beispiele**
- `thema_bezug` + `warnung`: unit-spezifisch, nie generisch
- `beispiel_basis` / `beispiel_fortgeschritten`: direkt kopierbare Prompts mit
  Unit-Material
- `baukasten`: pro Technik eigene, kurze Chip-Optionen in `rolle/kontext/aufgabe/format`
  (nicht 4× identisch)
- `stacking_seite_1` = Technik 1+2, `stacking_seite_2` = Technik 3+4;
  `prompt_2` baut EXPLIZIT auf `prompt_1` auf
- `stacking_seite_*.technik_keys`: die **Titel** der zwei Techniken, nicht die
  Schlüssel (der Renderer druckt das Feld wörtlich)
- `prompt_vorlage`: konstanter Merksatz «Ein guter Prompt nennt vier Dinge: Rolle,
  Kontext, Aufgabe, Form der Antwort.»
- **Die KI liefert keinen Stoff der Einheit** (`basis-plus.md` §1 Nr. 5). Auch im
  Plus arbeitet ein Beispiel-Prompt an einer Aussage, einer Liste oder einem
  Entscheid der Lernenden (als Lücke) — nicht «Mach mir eine Liste mit fünf Rechten
  und Pflichten», sondern «Hier sind fünf Rechte und Pflichten: [meine fünf
  Punkte]. Nenne je Punkt den Artikel im Gesetz.»
- `gegenposition_fordern`: Die KI nennt Einwände; **wessen** Interesse dahintersteht
  oder welcher Einwand zählt, sagen die Lernenden.
- `quellen_anfordern`: Der Prompt kündigt das Prüfen an («Ich prüfe jede Quelle
  nach.»); die `warnung` nennt das Prüfverfahren mit dem Wort der Einheit.
- Echte Umlaute, kein ß

## Anti-Patterns

Beispiele in `erklaerung` · generischer `thema_bezug` · identische Baukästen ·
«verbessere den Text»-Stacking ohne Aufbau · Fantasie-Techniken · Transliteration
in Prosa.
