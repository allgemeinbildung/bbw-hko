# KI-Liesmich-Architektur — das 5. Dokument (Phase 4b)

NEU. Eine Datei `ki-liesmich.md` — **Markdown mit YAML-Frontmatter**, NICHT
Renderer-JSON. **Teacher-facing** (nicht learner-facing): ein kurzer didaktischer
Kompass (ca. 2-3 A4-Seiten), der erklärt, **was** die vier KI-Dokumente leisten und
**wie** die Lehrperson sie einsetzt, ohne die Klasse zu überfrachten.

## Rendering-Pipeline (= warum es Markdown ist)

`ki-liesmich.md` läuft durch dieselbe «Lies mich!»-Maschinerie wie `begleiter.md`:

- geladen in `loadEinheit()` → `EinheitFullSet.kiLiesmich` (`src/lib/einheiten/index.ts`)
- gerendert unter `src/pages/einheiten/[setKey]/ki-liesmich.astro` (`marked` + Callout-Extension)
- Word-Export `src/pages/api/einheit-ki-liesmich-docx/[setKey].ts` (`buildBegleiterBuffer`)
- ZIP via `buildBegleiterDocx` im `EinheitWorkbench`
- im Workbench verlinkt oben in der Nav-Gruppe «KI-Toolbox» als «📖 KI-Toolbox — Lies mich!»

Daraus folgen zwei harte Regeln:

1. **Frontmatter** wie beim Begleiter: `titel`, `untertitel`, `kompetenz`, `autor`,
   `stand`, `lehrgang`, `thema`, `lebensbezug`, `quellen_json[]`. `titel` +
   `untertitel` werden im Kopf gerendert.
2. **Callouts** nur aus der erlaubten Menge der Begleiter-Pipeline:
   `lernziel, hinweis, beispiel, warnung, reflexion, coaching, mehrdeutigkeit,
   differenzieren`. Jeder andere `[!typ]` wird **nicht** als Callout gerendert.

## Zentrales Prinzip: Selbst-Review, nichts Neues erfinden

Phase 4b läuft **nach** Phase 2-4. Sie destilliert den Liesmich **aus dem, was die
Skill in dieser Unit selbst erzeugt hat** — die Inhalte sind also immer
unit-spezifisch und konsistent mit den vier Dokumenten:

| Liesmich-Element | Quelle (diese Unit) |
|---|---|
| Frontmatter `kompetenz/thema/lehrgang/lebensbezug` | wie Begleiter-Frontmatter (`herausforderung_A.modul*`, `prinzip.lehrgang`) |
| «4 Dokumente»-Tabelle: die zwei Auftrags-Titel | `ki.assignments[].titel` (verbatim) |
| Technik-Liste (`[!hinweis]`) | `lernprompt.techniken[].titel` (alle vier, verbatim) |
| Reduktions-Rezept «Lernbegleiter auf eine Karte» | ein `lernbegleiter.strategie_karten[].technik` (z. B. retrieval) |
| Timing / KN-Brücke | `kn.kn_typen[].label` |
| Grundregel + Integrität | `ki.assignments[].ki_frei_vorher` + `lernbegleiter.integritaet_warnung` |
| Quellen-/Rechts-Warnung (bedingt) | nur wenn ein `guetekriterium` Verifikation prüft ODER Aspekt «Recht» in `prinzip.aspekte` |

## Pflicht-Abschnitte

1. **Intro-Blockquote** (`>`): «für die **Lehrperson**»; KI-Toolbox =
   **optionales Zusatzangebot**, kein Pflichtteil; verbindlich bleiben
   Herausforderungen + KN + Lehrpersonen-/Bewertungsteil.
2. **§1 Was in der Toolbox steckt** — Tabelle mit vier Zeilen (2 KI-Aufträge mit
   echten Titeln, Lernprompt, Lernbegleiter) + Spalten Funktion/Timing; danach ein
   `[!hinweis]`, der die **vier** Technik-Namen dieser Unit auflistet + die Bauformel.
3. **§2 Die eine Grundregel** — «KI prüft, ersetzt nicht» (aus `ki_frei_vorher`);
   `[!warnung]` Integrität (kein KN-Stoff in die KI, an anderen Fällen üben);
   `[!warnung]` Quellen/Recht-Gegenprüfung **nur wenn zutreffend**.
4. **§3 Dichte reduzieren** — **genau vier** `[!differenzieren]`-Rezepte:
   - Eine Technik statt vier (eine echte Technik dieser Unit nennen; im Word die
     anderen Blöcke + Stacking löschen).
   - Nur ein KI-Auftrag (die zwei echten Titel nennen, Schwerpunkt erklären).
   - Lernbegleiter auf eine Karte (eine echte Karte als Exit-Ticket; Rest löschen).
   - Nur der Baukasten (`[Rolle]+[Kontext]+[Aufgabe]+[Format]`, Theorie weglassen).
5. **§4 Didaktische Einsatz-Ideen** — `[!coaching]`/`[!differenzieren]`: Staffeln
   statt stapeln · Plenum-Demo (Modeling) · Gruppenpuzzle über die Techniken ·
   Lernzirkel/Stationen · Vertiefung für Schnelle.
6. **§5 Kurz-Checkliste** — ein `[!lernziel]` mit 4-5 Punkten, inkl. der
   Leitplanken «ohne KI zuerst bleibt drin» und «kein KN-Stoff in die KI».
7. **Anhang** — Quellen (`ki/lernprompt/lernbegleiter.json`) + Skill-Hinweis
   (komplementär erzeugt, ändert verbindliche Dateien nie).

## Länge / Ton

Kurz halten («mini Liesmich»): ca. 2-3 A4-Seiten. Lehrer-Ton, knapp, handlungs-
leitend. Tabellen und Callouts statt Fliesstext-Wänden. Keine Wiederholung der
ganzen Begleiter-Didaktik — der Liesmich ergänzt nur die **KI-Schicht**.

## Checks LM1-LM3

- **LM1:** die echten `ki.assignments[].titel` UND alle vier
  `lernprompt.techniken[].titel` stehen drin (nicht generisch «KI-Auftrag 1/2»).
- **LM2:** §3 hat **genau vier** `[!differenzieren]`-Rezepte; «eine Technik» nennt
  eine konkrete Technik dieser Unit; «ein Auftrag» nennt die echten Titel.
- **LM3:** nur erlaubte Callouts; Frontmatter trägt `titel` + `untertitel`; §2/§5
  spiegeln die Lernbegleiter-Integrität (kein KN-Produkt, an anderen Fällen üben) —
  der Liesmich darf der Toolbox NIE widersprechen.

## EBA-Hinweis

Bei `lehrgang: "EBA_2J"`: nur **zwei** Herausforderungen (A/B) in §1; «im Lehrmittel»
→ «im Dossier»; Sätze einfach halten. Reduktions-Rezepte bleiben gleich, beziehen
sich aber auf die tatsächlich erzeugten Dokumente (ggf. weniger Techniken).
