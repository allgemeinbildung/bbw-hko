# Unterrichtsdeck für EBA — Stand

**Erledigt.** EBA läuft durch denselben Generator wie EFZ, ohne Sonderpfad. Wie das
funktioniert und was das Dossier beisteuert, steht im Abschnitt «EBA» in
[`decks/README.md`](README.md) — dort und nicht hier. Diese Datei hält nur fest, was
noch **offen** ist.

Stand: beide EBA-Einheiten (`1.1.1_lehrvertrag_orientieren`, `1.1.2_unterlagen_ordnen`)
erzeugen je 23 Folien, `npx hyperframes check` meldet 0 Fehler, 0 Layout-Probleme,
WCAG AA 70/70 bzw. 66/66. Beide LP-Felder (`handlungsprodukt.musterloesung`,
`leitfragen[].loesung`) sind gepflegt und im Skill-Kontrakt verankert.

---

## Offen 1 — die Rahmensätze sind EFZ-Deutsch

Alles, was die Klasse **inhaltlich** sieht, kommt wörtlich aus den JSONs und ist damit
schon A2. Die vom Generator **erzeugten** Rahmensätze sind es nicht:

- «Bewertet wird auf zwei Spuren — Sprache und Kommunikation, Gesellschaft.»
- «Übertragen Sie das Prinzip auf einen neuen Kontext.»
- «Das Prinzip hinter beiden Herausforderungen.»
- «Der Nachweis läuft in einer von drei Formen.»

Für eine EBA-Klasse ist das zu dicht. Sie stehen alle in `buildDeck()` in
[`deck-builder.ts`](../src/lib/einheiten/deck-builder.ts) und sind über die
Folien-IDs schnell zu finden. Zu klären ist erst die Frage davor: **eine** Formulierung
für beide Lehrgänge, oder ein A2-Satz je Folie, der bei `lehrgang === 'EBA_2J'` greift?
Ein zweiter Satz pro Folie ist Pflegeaufwand, den es zu rechtfertigen gilt.

## Erledigt statt offen — die beiden LP-Felder

`handlungsprodukt.musterloesung` (C7) und `leitfragen[].loesung` (C10) sind in beiden
Einheiten für A und B gepflegt und in `hko-2er-EBA-set-generator` verankert:
Phase-2-Feldtabelle, Validierung (Check 30 / Check 32), JSON-Checkliste und
`references/json-field-mapping.md` mit den EBA-Zusatzregeln:

- **Quelle ist das Dossier, nicht ein Lehrmittel.** `zeilen[].quelle` verweist auf eine
  Info-Karte (`"Info-Karte B-03"`); die Lösung wird aus dem Nugget des `knoten_ref`
  gehoben. Ein `fakten_anker` mit `lp_pruefen: true` gehört nicht als feste Aussage hinein.
- **Zwei Register.** `musterloesung.abschnitte` ist das Produkt der lernenden Person und
  steht in ICH-Form unter dem A2-Gate. `leitfragen[].loesung` ist LP-Text im neutralen
  Sachstil ohne Anrede — mit der Ausnahme, dass wörtliche Lernenden-Formulierungen in
  «Guillemets» stehen und dort A2-pflichtig sind.

Damit greift auch die Spiegelung in den Begleiter (`begleiter-loesungen.ts`): je
Herausforderung ein Kapitel «Lösungen der Leitfragen» mit vier `[!loesung]`-Callouts.
Dessen Sektions-Regex kannte anfangs nur den EFZ-Dialekt `## 3. Herausforderung A`; seit
er auch `## Sektion 3 — Herausforderung A` trifft, landen die EBA-Lösungen in ihrer
eigenen Sektion statt in einem angehängten Sammelkapitel.

## Offen 3 — KN-Gewichtung

Bei EBA ist das Kurzgespräch die Leitform (`kn-typ-labels.ts` benennt es schon so), die
drei `kn_typen` liegen aber gleichwertig nebeneinander auf der Folie «KN-Formen».
Ob das Deck die Leitform hervorheben soll, ist eine didaktische Entscheidung, keine
technische.
