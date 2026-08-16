# KI-Pattern-Scoring — 7 Patterns → genau 2 (Phase 1)

Inputs (aus dem Adapter): `aspekte`, `sk_targets` (= `sk_schnittmenge_kn.primary`),
Handlungsprodukt-Typen, `trade_off_raum`, `zirkularitaet`.

## Die 7 Patterns

`ai_gegenpositionen`, `ai_redaktion`, `ai_lernassistent`, `ai_ethik_tribunal`,
`ai_entscheidungscoach`, `ai_prompt_duell`, `ai_zeitkapsel`.

## Scoring-Regeln

**`ai_gegenpositionen`** (Gegenposition fordern, K4/K5)
- +30 wenn Aspekte `Ethik` ODER `Recht` enthalten
- +25 wenn sk_targets SK 5 oder 6 enthält
- +15 wenn ein Trade-off zwei Akteurs-Seiten hat
- +10 universell

**`ai_redaktion`** (KI-Entwurf redigieren, K4)
- +30 wenn ein Handlungsprodukt schriftlich-formell ist (Brief, E-Mail, Bericht, Dossier, Schreiben)
- +20 wenn sk_targets SK 6 enthält
- +15 wenn ein Output-Sprachmodus schriftlich-produktiv ist (Produktion schriftlich)
- +10 universell

**`ai_lernassistent`** (sokratischer Coach, K2-K3)
- +25 wenn die Unit methodenlastig ist (Schema, Verfahren, Modell — z. B. Vier Ohren, 3B)
- +20 wenn sk_targets SK 2 enthält
- +10 universell

**`ai_ethik_tribunal`** (Dilemma verhandeln, K5)
- +30 wenn Aspekte `Ethik` enthalten UND >=2 Akteursgruppen im Stoff
- +15 wenn sk_targets SK 12 enthält

**`ai_entscheidungscoach`** (Optionen abwägen, K3)
- +25 wenn die Herausforderungen Entscheidungs-Leitfragen (K3 «Entscheide») dominant haben
- +15 wenn ein Trade-off explizit «X vs. Y» strukturiert ist

**`ai_prompt_duell`** (Prompt-Varianten vergleichen, K4)
- +20 wenn sk_targets SK 11 enthält
- +15 wenn Aspekte `Technologische und digitale Transformation` enthalten

**`ai_zeitkapsel`** (Zukunftsprojektion, K4)
- +20 wenn `zirkularitaet.r2/r3_voraussicht` einen klaren Zukunftsbezug hat
- +10 wenn Aspekte `Politik` oder `Ökologie` enthalten

## Auswahl

- Genau **2** Patterns: die zwei höchsten Scores.
- Minimum-Score 30; liegen alle darunter: trotzdem Top-2 + flaggen.
- Die zwei müssen **verschiedene KI-Kompetenzen** trainieren (nicht zweimal
  «Gegenposition»): bei inhaltlicher Nähe das drittplatzierte nachziehen.
- Quellen-/Rechts-Verifikation ist KEIN eigenes Pattern, sondern Pflicht-
  Gütekriterium in beiden Aufträgen (bei Recht besonders streng).

## Teacher-Preview (vor Generierung)

```
KI-Toolbox für: {slug}
1. {pattern_1}  (Score {s1}) — {grund, max 80 Zeichen}
2. {pattern_2}  (Score {s2}) — {grund}
Bestätigen? [j / ändern]
```

> Referenz-Scoring (Gold-Unit 1.1.1_konflikt): Aspekte Recht+Ethik, sk_targets
> [6,7,11], Produkt B = E-Mail/Schreiben → `ai_gegenpositionen` (80) +
> `ai_redaktion` (75). Diese beiden bilden die Gold-`ki.json`.
