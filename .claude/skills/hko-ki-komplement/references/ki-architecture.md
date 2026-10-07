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
| `prompt_strategie[]` | `ki_1`: genau 3 — zwei **fertige** Prompts mit Sprachzeile + eine Zeile «Prüfen»; Prompt 1 stellt drei Fragen, Prompt 2 («nach der dritten Frage») zeigt auf die schwächste Antwort und liefert keinen Inhalt (`basis-plus.md` §3 «Aufbau»). `ki_2`: 3-4 Hinweise; mind. einer ist ein fertiger Zweit-Prompt |
| `ki_frei_vorher` | was OHNE KI festgehalten wird — immer zuerst |
| `schritte[]` | `ki_1`: genau 3 (ohne KI · Prompt 1 · Prompt 2 und entscheiden — Schritt 2 und 3 nennen den Prompt). `ki_2`: 4-5; nachschlagen vor dem Urteilen; der letzte verarbeitet das KI-Ergebnis kritisch (übernehmen/zurückweisen mit Begründung) |
| `guetekriterien[]` | `ki_1`: genau 3, `ki_2`: 3-4 `{kriterium, indikator}`, formativ, beobachtbar — eines prüft IMMER das Nachschlagen; im Basis-Auftrag ist es auch erfüllbar, wenn die KI nur gefragt hat. Kein Prompt lässt die KI liefern, was ein Kriterium den Lernenden zuschreibt (nicht: Prompt «Sag mir, wessen Interesse dahintersteht» + Kriterium «Interesse erkannt») |
| `reflexion[]` | `ki_1`: 2 (inhaltlich · Transfer). `ki_2`: 3 (inhaltlich · KI-kritisch · Transfer). Die letzte trägt die KN-Brücke |

Anzahl, Länge und der Unterschied Basis/Plus: `basis-plus.md` §3. Sprache:
`b1-language-rules.md` (EFZ) bzw. A2-Gate (EBA).

Set-Level (einmal): `nrlp_anker` (`thema_text` — ein Satz **ohne Code** «T1 —», der
Word-Export druckt ihn für Lernende; `gesellschaft_details[]` — jeder
`kompetenz_anker` ist die Kompetenz, zu der das Detail im nRLP gehört;
`schluesselkompetenzen_texte[]`, höchstens 3) + `ki_leitfragen` (nur `offen` und
`kritisch`; die zwei weiteren Schlüssel fehlen).

## 3. KN-Brücke (Pietro-Erweiterung — verbindlich)

Da bbw-hko einen summativen KN hat, soll die KI-Schicht auch auf ihn vorbereiten.
**Mindestens einer** der zwei Aufträge rahmt die **letzte Reflexionsfrage** explizit als
Brücke zum Kompetenznachweis — **ohne eine KN-Form zu nennen**: «Im
Kompetenznachweis begründen Sie … ohne KI. Was aus dieser Übung nehmen Sie mit?»
Welche Form die Klasse bekommt, wählt die Lehrperson; ein Satz «Im Fachgespräch …»
ist für jede Klasse mit schriftlichem KN falsch. Eine Form nur, wenn `kn.kn_typen`
genau eine hat — und auch dann in Worten für Lernende, nie mit dem Namen der Form
(«Mini Case schriftlich», «Werkschau + Transfer-Reflexion» sind Sperrwörter). Die
Frage greift auf, was der Auftrag geübt hat. Der formative Charakter der Aufträge
bleibt; es ist nur die Reflexions-Rahmung. → Check `KN_BRIDGE`.

## 4. Timing + Status

`timing` nach Format (`input-adapter.md` §2c): im 3er-Set und bei EBA
`"nach Austausch & Transfer, zur Vorbereitung auf den Kompetenznachweis"`, bei v4.2
`"nach dem gemeinsamen Auftrag, zur Vorbereitung auf den Kompetenznachweis"`.
Formativ (Gütekriterien, keine Note).

## 4b. v4.2: woran ein Auftrag andockt

Ein Auftrag spannt sich über **beide Hefte** und das Transfer-Prinzip. Er arbeitet
mit dem, was die Lernenden selbst hergestellt haben — den zwei Handlungsprodukten
und ihren Antworten auf die Leitfragen — und misst es an den `feedback_kriterien`,
die sie aus den Heften kennen. Er nennt keinen Inhalt einer Spur und keinen Begriff
des KN-Falls (SKILL.md, «v4.2-Regeln»).

## 5. Anti-Patterns

- `bezug` nennt nur eine Herausforderung → ERR_KI_BEZUG
- Auftrag = «lass die KI dein Produkt schreiben» (Produktions-Abkürzung)
- generische Warnungen («KI kann sich irren»)
- Prompts ohne Unit-Material (austauschbar mit jeder anderen Unit)
- fehlendes `ki_frei_vorher`
- rohe SM-/SK-Codes in sichtbarer Prosa
- Basis-Auftrag, in dem Prompt 1 kein Ende hat oder Prompt 2 in keinem Schritt vorkommt
- Basis-Prompt 2, der Inhalt bestellt («Nenne mir eine Folge …») statt nachzufragen
- Hinweis ohne Funktion («Verraten Sie der KI nicht, welche Antwort Sie wünschen»
  neben einem fertigen Prompt)
- Zweit-Prompt, der der KI das Urteil überlässt, das der `auftrag` den Lernenden
  gibt («Welches deiner Argumente ist das stärkste?»)
- Wortlaut aus einer anderen Toolbox übernommen (`basis-plus.md` §7)
