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

**«dominant» wird gezählt, nicht geschätzt.** Alle Leitfragen der Einheit zählen:
je Herausforderung `leitfragen[]`, bei v4.2 dazu die `leitfrage` des Hefts.
Entscheidungsfrage ist eine Frage, die einen eigenen Entscheid oder eine Wahl
zwischen Möglichkeiten verlangt (entscheiden, wählen, abwägen, «soll ich …»).
Dominant = **mindestens die Hälfte** aller Leitfragen. Zähler und Nenner stehen in
der Rückmeldung («3 von 8»). Im Lauf vom 07.10.2026 kippte der Basis-Auftrag in
beiden Sonden an diesem einen Urteil.

Der Entscheidungscoach braucht zudem einen **Entscheid, den die Lernenden in der
Einheit wirklich treffen** und so nennen. Heissen die Produkte «Standort», «Regel»
oder «Drehbuch», ist `ai_lernassistent` das passende Basis-Muster.

**`ai_prompt_duell`** (Prompt-Varianten vergleichen, K4)
- +20 wenn sk_targets SK 11 enthält
- +15 wenn Aspekte `Technologische und digitale Transformation` enthalten

**`ai_zeitkapsel`** (Zukunftsprojektion, K4)
- +20 wenn `zirkularitaet.r2/r3_voraussicht` einen klaren Zukunftsbezug hat
- +10 wenn Aspekte `Politik` oder `Ökologie` enthalten

## Auswahl

Genau **2** Patterns — eines Basis, eines Plus (`basis-plus.md`):

- **`ki_1` (Basis)** kommt aus dem **Basis-Pool**: `ai_lernassistent` oder
  `ai_entscheidungscoach` — das besser bewertete; bei Gleichstand
  `ai_lernassistent`. In beiden stellt die KI **Fragen zur Arbeit der Lernenden**
  (zum eigenen Produkt bzw. zur eigenen Entscheidung im Spannungsfeld) und schreibt
  selbst nichts. Der Basis-Auftrag wird immer erzeugt, auch wenn sein Score unter
  30 liegt — er ist der Einstieg, nicht die Kür.
- **`ki_2` (Plus)** ist das bestbewertete der übrigen fünf (`ai_gegenpositionen`,
  `ai_redaktion`, `ai_ethik_tribunal`, `ai_prompt_duell`, `ai_zeitkapsel`).
  Minimum-Score 30; liegen alle darunter: trotzdem das beste + flaggen.
- Warum getrennt: In den fünf Plus-Mustern bearbeiten die Lernenden einen Inhalt
  **und** beurteilen zugleich die KI (K4-K5). Die Hefte zielen auf K2-K4.
- Quellen-/Rechts-Verifikation ist KEIN eigenes Pattern, sondern Pflicht-
  Gütekriterium in beiden Aufträgen (bei Recht besonders streng).

## Teacher-Preview (vor Generierung)

```
KI-Toolbox für: {slug}
Basis  {pattern_1}  (Score {s1}) — {grund, max 80 Zeichen}
Plus   {pattern_2}  (Score {s2}) — {grund}
Bestätigen? [j / ändern]
```

> Referenz-Scoring (1.1.1_konflikt): Aspekte Recht+Ethik, sk_targets [6,7,11],
> Produkt B = E-Mail/Schreiben → `ai_gegenpositionen` (80), `ai_redaktion` (75).
> Basis-Pool: `ai_lernassistent` 35 (methodenlastig 25 + universell 10),
> `ai_entscheidungscoach` 15 (nur «X vs. Y»; eine von vier Leitfragen je
> Herausforderung ist eine Entscheidungsfrage → nicht dominant). Ergebnis seit
> 07.10.2026: Basis `ai_lernassistent`, Plus `ai_gegenpositionen`.
