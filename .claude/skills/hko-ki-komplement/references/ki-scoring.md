# KI-Muster wählen — Basis fest, Plus nach Punkten (Phase 1)

Inputs (aus dem Adapter): `aspekte`, `sk_targets` (= `sk_schnittmenge_kn.primary`),
Handlungsprodukt-Typen, `trade_off_raum`, `zirkularitaet`.

## Die 7 Patterns

`ai_gegenpositionen`, `ai_redaktion`, `ai_lernassistent`, `ai_ethik_tribunal`,
`ai_entscheidungscoach`, `ai_prompt_duell`, `ai_zeitkapsel`.

## Basis (`ki_1`) — fest, ohne Punkte (seit 07.10.2026, E44)

Das Basis-Muster wird **nicht mehr gescort**. Im Lauf vom 07.10.2026 kam bei allen
14 Einheiten `ai_lernassistent` heraus; die Punkte entschieden nichts, das Urteil
«dominant» kippte aber zweimal.

- **Vorgabe: `ai_lernassistent`.** Die KI stellt Fragen zum eigenen Produkt der
  Lernenden und schreibt selbst nichts.
- **`ai_entscheidungscoach` nur, wenn ein Handlungsprodukt selbst ein Entscheid
  ist.** Probe, am Wortlaut von `handlungsprodukt` (Titel, Beschreibung, Abgaben)
  in den Heften bzw. Herausforderungen: Verlangt eines **wörtlich** einen Entscheid
  oder eine Wahl zwischen benannten Möglichkeiten («Mein Entscheid», «Ich
  entscheide, ob …», «Ich wähle zwischen … und …»)? Dann Entscheidungscoach.
  Ein Massstab, eine Regel, ein Standort, ein Plan, ein Brief sind kein Entscheid —
  auch dann nicht, wenn Leitfragen nach einem Entscheid fragen. Die Aufgaben des
  Kompetenznachweises zählen nicht.
- Die Rückmeldung nennt das Basis-Muster mit **einem Satz Grund** (bei
  Entscheidungscoach: das Produkt und die Stelle, wörtlich), keine Punktzahl.

## Plus (`ki_2`) — Punkte

Gescort werden nur die fünf Plus-Muster. Es zählen die Handlungsprodukte der Hefte
bzw. Herausforderungen, **nicht** die Aufgaben des Kompetenznachweises.

**`ai_gegenpositionen`** (Gegenposition fordern, K4/K5)
- +30 wenn Aspekte `Ethik` ODER `Recht` enthalten
- +25 wenn sk_targets SK 5 oder 6 enthält
- +15 wenn ein Trade-off zwei Akteurs-Seiten hat
- +10 universell

**`ai_redaktion`** (KI-Entwurf redigieren, K4)
- +30 wenn ein Handlungsprodukt schriftlich-formell ist (Liste unten)
- +20 wenn sk_targets SK 6 enthält
- +15 wenn ein Output-Sprachmodus schriftlich-produktiv ist (Produktion schriftlich)
- +10 universell

**`ai_ethik_tribunal`** (Dilemma verhandeln, K5)
- +30 wenn Aspekte `Ethik` enthalten UND >=2 Akteursgruppen im Stoff
- +15 wenn sk_targets SK 12 enthält

**`ai_prompt_duell`** (Prompt-Varianten vergleichen, K4)
- +20 wenn sk_targets SK 11 enthält
- +15 wenn Aspekte `Technologische und digitale Transformation` enthalten

**`ai_zeitkapsel`** (Zukunftsprojektion, K4)
- +20 wenn `zirkularitaet.r2/r3_voraussicht` einen klaren Zukunftsbezug hat
- +10 wenn Aspekte `Politik` oder `Ökologie` enthalten

### «schriftlich-formell» — gezählt, nicht geschätzt

Schriftlich-formell ist ein Handlungsprodukt, wenn es **an eine bestimmte Person
oder Stelle geht und eine feste Form hat** (Anrede oder Betreff, Gruss oder
Unterschrift). Im Lauf vom 07.10.2026 hing die Plus-Wahl in drei Einheiten an
diesem Wort.

| zählt | zählt nicht |
|---|---|
| Brief, E-Mail, Gesuch, Antrag, Reklamation, Mängelrüge, Bewerbung, Kündigung, Einsprache, Beschwerde, Stellungnahme an eine Stelle, Petitionstext, Leserbrief | Protokoll, Notiz, Plan, Tabelle, Checkliste, Übersicht, Factsheet, Plakat, Rezension, Kommentar, Stichwort- oder Diskussionskarte, Drehbuch, Reflexion, Präsentation, Bericht oder Dossier ohne Empfängerin oder Empfänger |

Steht ein Produkt in keiner Spalte, entscheidet die Probe oben (Empfänger **und**
feste Form); die Rückmeldung nennt das Produkt und das Ergebnis der Probe.

## Auswahl

Genau **2** Muster — eines Basis, eines Plus (`basis-plus.md`):

- **`ki_1` (Basis)**: fest nach dem Abschnitt «Basis» oben — `ai_lernassistent`,
  ausser ein Handlungsprodukt ist selbst ein Entscheid. In beiden Mustern stellt
  die KI **Fragen zur Arbeit der Lernenden** und schreibt selbst nichts.
- **`ki_2` (Plus)** ist das bestbewertete der fünf Plus-Muster (`ai_gegenpositionen`,
  `ai_redaktion`, `ai_ethik_tribunal`, `ai_prompt_duell`, `ai_zeitkapsel`).
  Minimum-Score 30; liegen alle darunter: trotzdem das beste + flaggen.
- Warum getrennt: In den fünf Plus-Mustern bearbeiten die Lernenden einen Inhalt
  **und** beurteilen zugleich die KI (K4-K5). Die Hefte zielen auf K2-K4.
- Quellen-/Rechts-Verifikation ist KEIN eigenes Pattern, sondern Pflicht-
  Gütekriterium in beiden Aufträgen (bei Recht besonders streng).

## Teacher-Preview (vor Generierung)

```
KI-Toolbox für: {slug}
Basis  {pattern_1}  (fest) — {grund, max 80 Zeichen}
Plus   {pattern_2}  (Score {s2}) — {grund}
Bestätigen? [j / ändern]
```

> Beispiel (1.1.1_konflikt): Aspekte Recht+Ethik, sk_targets [6,7,11],
> Produkt B = E-Mail/Schreiben (schriftlich-formell) → Plus `ai_gegenpositionen`
> (80) vor `ai_redaktion` (75). Basis `ai_lernassistent` (fest; kein Produkt ist
> ein Entscheid).
