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
| Basis/Plus-Tabelle, Zeile Lernbegleiter | alle fünf `lernbegleiter.strategie_karten[].technik` in der Reihenfolge der Datei (1+2 Basis, 3-5 Plus) |
| Timing / KN-Brücke | `kn.kn_typen[].label` |
| Grundregel + Integrität | `ki.assignments[].ki_frei_vorher` + `lernbegleiter.integritaet_warnung` |
| Quellen-/Rechts-Warnung (bedingt) | nur wenn ein `guetekriterium` Verifikation prüft ODER Aspekt «Recht» in `prinzip.aspekte` |

## Pflicht-Abschnitte

1. **Intro-Blockquote** (`>`): «für die **Lehrperson**»; KI-Toolbox =
   **optionales Zusatzangebot**, kein Pflichtteil. Kein Satz darüber, was
   «verbindlich» bleibt (gestrichen 07.10.2026).
2. **§1 Was in der Toolbox steckt** — Tabelle mit vier Zeilen (Basis-Auftrag und
   Plus-Auftrag mit echten Titeln, Lernprompt, Lernbegleiter) + Spalten
   Funktion/Timing; danach ein `[!hinweis]`, der die **vier** Technik-Namen dieser
   Unit auflistet — zwei als Basis, zwei als Plus.
3. **§2 Die eine Grundregel** — «KI prüft, ersetzt nicht» (aus `ki_frei_vorher`);
   `[!warnung]` Integrität (kein KN-Stoff in die KI, an anderen Fällen üben);
   `[!warnung]` Quellen/Recht-Gegenprüfung **nur wenn zutreffend**.
4. **§3 Basis und Plus** — die kleine Fassung ist die Vorgabe (`basis-plus.md`):
   - eine Tabelle Dokument · Basis · Plus mit den echten Titeln, Technik- und
     Karten-Namen und den **Seiten**, die die Lehrperson druckt (`basis-plus.md` §2);
   - **genau zwei** `[!differenzieren]`-Rezepte: «Noch kleiner» (ein Dokument,
     eine Karte; «ohne KI zuerst» bleibt) und «Grösser» (Plus dazulegen, für wen,
     was es verlangt).
   Der Liesmich fordert nie mehr dazu auf, die Word-Datei zu kürzen.
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
- **LM2:** §3 hat die Basis/Plus-Tabelle (echte Titel, Seiten nach `basis-plus.md`
  §2) und **genau zwei** `[!differenzieren]`-Rezepte (kleiner · grösser).
- **LM3:** nur erlaubte Callouts; Frontmatter trägt `titel` + `untertitel`; §2/§5
  spiegeln die Lernbegleiter-Integrität (kein KN-Produkt, an anderen Fällen üben) —
  der Liesmich darf der Toolbox NIE widersprechen.
- **LM4 (Rücklesen gegen die Daten):** Der Liesmich wird **zuletzt** geschrieben
  und nach jeder Korrektur an einer JSON-Datei neu gelesen. Vier Proben:
  1. *Wer tut was.* Jede Aussage «die Lernenden prüfen / benennen / bauen …» stimmt
     mit Prompt und Schritt überein. Eigene Prompts bauen die Lernenden nur im Plus
     des Lernprompts (Baukasten), nicht im Plus-Auftrag.
  2. *Wie viel nachgeschlagen wird.* «jede» / «mindestens eine» wörtlich wie in den
     Kriterien beider Aufträge.
  3. *Wann.* §1 und §4 nennen für Basis- und Plus-Auftrag je **denselben**
     Zeitpunkt (`{{WANN_BASIS}}`, `{{WANN_PLUS}}`). `ki.timing` nennt den spätesten
     Zeitpunkt für beide und wird nicht gedruckt; der Plus-Auftrag steht im Liesmich
     nie früher als dort.
  4. *Titel der Einheit* wie `set.einheit_titel` (Frontmatter und Anhang).
  5. *Namen der KN-Formen.* Nennt der Liesmich eine KN-Form beim Namen der
     Lehrperson («Mini Case schriftlich»), steht daneben, was auf dem Blatt der
     Lernenden steht («Schriftliche Aufgabe zu einem neuen Fall», «Eigene Arbeiten
     zeigen und erklären») — sonst findet die Lehrperson die Stelle nicht.
  6. *Notizfelder* mit ihrem echten Wortlaut: Basis-Karten «Das hat die KI gesagt ·
     Das stimmt · Das stimmt nicht», KN-Seite «Mein Übungsfall · Das konnte ich ·
     Das übe ich noch».
  Dazu der Hinweis auf den absichtlichen Fehler im Beispiel-Verlauf.

## v4.2-Hinweis (`template: "heft_8page_v42"`)

- §1, Spalte «Wann»: Basis-Auftrag «sobald Heft A und Heft B fertig sind»,
  Plus-Auftrag «nach dem gemeinsamen Auftrag»; nie «nach Herausforderung A-C». §4
  wiederholt dieselben zwei Zeitpunkte (LM4).
- Der Liesmich darf «Spur» sagen (Wort der Lehrperson) und soll es einmal tun:
  die Toolbox gilt für beide Spuren und setzt kein Medium voraus.
- Kein Begriff des Fall-Ausschlusses — der Liesmich liegt im ZIP und im selben
  Ordner wie die Hefte.
- Anrede bleibt Sie (der Liesmich ist nicht `begleiter.md`).

## EBA-Hinweis

Bei `lehrgang: "EBA_2J"`: nur **zwei** Herausforderungen (A/B) in §1; «im Lehrmittel»
→ «im Dossier»; Sätze einfach halten. Die Basis/Plus-Tabelle bleibt gleich, bezieht
sich aber auf die tatsächlich erzeugten Dokumente (ggf. weniger Techniken).
