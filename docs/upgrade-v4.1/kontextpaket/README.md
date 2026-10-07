# Kontextpaket bbw-hko — Ist-Zustand einer Einheit

Stand 01.10.2026. Zweck: Der Leitfaden v4.1/v4.2 soll gegen das geprüft werden, was auf der Plattform **heute wirklich** eine Einheit ist. Alles hier ist Bestand, nichts ist Zielbild.

## Was drin ist

| Ordner | Inhalt | Wozu |
|---|---|---|
| `einheit_EFZ_1.3.1/` | vollständige Einheit EFZ 4J «Konsum verantworten»: `prinzip.json`, `set.json`, `kn.json`, `herausforderung_A/B/C.json`, `begleiter.md` | Pilot-Einheit des Leitfadens. **Sonderfall:** A, B, C haben drei verschiedene Kompetenzen (1.3.1 / 1.3.2 / 1.3.3). |
| `einheit_EFZ_5.4.2/` | `prinzip.json`, `set.json`, `kn.json`, `herausforderung_A.json` | Gegenprobe und **Normalfall:** A, B, C haben dieselbe Kompetenz. Neuester Bogen-Stand, mit Methodenseite. |
| `einheit_EBA_1.1.1/` | `prinzip.json`, `set.json`, `kn.json`, `herausforderung_A.json`, `dossier.json` | EBA 2-jährig: nur A und B, kein Lehrmittel, Dossier als Wissensquelle. |
| `methoden/` | `methodenkartei.md` + zwei Beispielkarten | Wie die Methodenseite heute funktioniert. |
| `schema/types.ts` | TypeScript-Typen aller Dateien | Verbindliche Feldnamen. |

Nicht enthalten: Lehrmitteltexte (urheberrechtlich geschützt, nicht im Repo), KI-Toolbox-Dateien, Renderer-Code.

## Was eine Einheit heute ist

- **Prinzip-Dokument** (`prinzip.json`): gemeinsames Kompetenzversprechen, `dekontextualisierungs_anker`, `mehrdeutigkeits_architektur` (Trade-off-Raum), und die Verteilung pro Herausforderung: `sk_pro_situation`, `aspekte`, `modi_units` / `modi_kn`, `herausforderungen.{A,B,C}` (Konfliktart, Produkttyp). **Es verteilt keine Verben und keine Kriterien.**
- **Herausforderungen A/B/C**: je 4 Leitfragen und 5 Schritte, 1:1 gekoppelt (`leitfragen[].liefert`); Scaffolding an jeder Leitfrage und am Handlungsprodukt; Musterlösung pro Leitfrage; `mindmap_zentrum` + `mindmap_aeste` (fixe Äste); `bewertungsraster` (Vollständigkeit) und `lernfortschritt.kriterien`; 3 `reflexion_fragen`; eigene `dekontextualisierung.frage`; optional `methoden` (4 Karten-Verweise mit Übertragung `tun`).
- **Zeit:** `wochen: 3`, `wochen_plan` = 3 × 45 Minuten pro Herausforderung.
- **Einsatz:** Standard ist das **Gruppenpuzzle** (`set.austausch_phase.format = gruppenpuzzle_jigsaw`): Jede/r Lernende bearbeitet **eine** Herausforderung, danach Austausch in gemischten Gruppen (3 Runden, ca. 30 Min.), dann die gemeinsame Transfer-Aufgabe (`set.dekontextualisierungs_aufgabe`).
- **KN** (`kn.json`): eine neue Hybrid-Situation, drei Formen (`fachgespraech`, `mini_case_schriftlich`, `werkschau_transfer`), gemeinsames Raster `rubrik_shared` mit **4 generischen Kriterien** (in 1.3.1: Fachkorrektheit · Argumentation = SuK; Wirtschaftliches Prinzip · Position/Werthaltung = Ges), Skala 0–3. **Nicht** nach «ein Kriterium pro Verb» gebaut.
- **Kompetenzen von A/B/C:** In 10 von 11 Einheiten haben alle Herausforderungen dieselbe Hauptkompetenz (in zwei davon trägt eine Herausforderung zusätzlich eine Sekundärkompetenz). In 1.3.1 sind es drei verschiedene Kompetenzen desselben Lebensbezugs.

## Was der Leitfaden daran prüfen soll

1. Jede/r Lernende macht **eine** Herausforderung, der KN prüft alle. Was heisst das für «Heft-Raster = Teilmenge des KN-Rasters»?
2. Der Pilot 1.3.1 ist der Sonderfall mit drei Kompetenzen. Gilt die Ableitung «Kriterien aus den Verben der Kompetenz» pro Heft oder pro Einheit?
3. Die Zeit ist heute 3 × 45 Minuten pro Herausforderung, verteilt auf drei Wochen — nicht ein Block.
4. Transfer gibt es heute schon dreifach: `dekontextualisierung.frage` im Heft, Transfer-Aufgabe im Set, Hybrid-Situation im KN.
5. Welche bestehenden Felder werden ersetzt (Mindmap-Äste, 3 Reflexionsfragen, `lernfortschritt`), welche bleiben?
