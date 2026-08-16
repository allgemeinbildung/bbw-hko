# KI-Architektur — 2 Set-Level-KI-Aufträge (Phase 2)

Adaptiert die 7 Mission-KI-Patterns auf die **ganze Einheit**: EIN Auftrag spannt
sich über alle Herausforderungen + das Transfer-Prinzip (die KN-Hybrid-Situation),
nicht über eine einzelne Aufgabe.

## 1. Zweck: AI-Fluency, nicht Produktions-Abkürzung

Jeder Auftrag trainiert eine messbare KI-Kompetenz:
- **Prompt-Handwerk** (Rolle, Kontext, Format, Quellenforderung)
- **Kritisches Verifizieren** (Halluzinationen finden, Rechtssätze prüfen)
- **Eigenständigkeit sichern** (`ki_frei_vorher`: eigene Position VOR dem ersten Prompt)

Die KI darf nie das Handlungsprodukt der Unit ersetzen — sie prüft, challengt oder
spiegelt es.

## 2. Pflichtfelder pro Auftrag (Schema: assets/ki-template.json)

| Feld | Regel |
|---|---|
| `pattern` | eines der 7 Patterns; Auswahl via `ki-scoring.md` |
| `titel` / `ziel` | Ziel = 1 Satz AI-Fluency-Lernziel |
| `bezug` | MUSS alle vorhandenen Herausforderungen UND das Transfer-Prinzip nennen (Check P6). Das Transfer-Prinzip = `prinzip.dekontextualisierungs_anker.anker_statement`, verankert an `kn.hybrid_situation`. |
| `auftrag` | konkret, mit dem Material der Unit (Fälle, Produkte, Quellen/Dossier) |
| `prompt_strategie[]` | 3-4 umsetzbare Hinweise; mind. einer ist ein Zweit-Prompt («Nenne die schwächste Stelle …») |
| `ki_frei_vorher` | was OHNE KI festgehalten wird — immer zuerst |
| `schritte[]` | 5 Schritte; der letzte verarbeitet das KI-Ergebnis kritisch (übernehmen/zurückweisen mit Begründung) |
| `guetekriterien[]` | 3-4 `{kriterium, indikator}`, formativ, beobachtbar — eines prüft IMMER die Verifikation |
| `reflexion[3]` | R1 inhaltlich, R2 KI-kritisch, R3 Transfer aufs künftige Verhalten |

Set-Level (einmal): `nrlp_anker` (`thema_text`, `gesellschaft_details[]`,
`schluesselkompetenzen_texte[]`) + `ki_leitfragen` (`offen/kritisch/vergleichend/urteilend`).

## 3. KN-Brücke (Pietro-Erweiterung — verbindlich)

Da bbw-hko einen summativen KN hat, soll die KI-Schicht auch auf ihn vorbereiten.
**Mindestens einer** der zwei Aufträge rahmt **`reflexion[2]` (R3)** explizit als
Brücke zu einem konkreten KN-Typ aus `kn.kn_typen` — z. B. «Im Fachgespräch müssen
Sie beide Pole bewerten (Frage 3) …». Der formative Charakter der Aufträge bleibt;
es ist nur die Reflexions-Rahmung. → Check `KN_BRIDGE`.

## 4. Timing + Status

`timing: "nach Austausch & Transfer, zur Vorbereitung auf den Kompetenznachweis"`.
Formativ (Gütekriterien, keine Note).

## 5. Anti-Patterns

- `bezug` nennt nur eine Herausforderung → ERR_KI_BEZUG
- Auftrag = «lass die KI dein Produkt schreiben» (Produktions-Abkürzung)
- generische Warnungen («KI kann sich irren»)
- Prompts ohne Unit-Material (austauschbar mit jeder anderen Unit)
- fehlendes `ki_frei_vorher`
- rohe SM-/SK-Codes in sichtbarer Prosa
