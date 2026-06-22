---
titel: "Struktur-Spezifikation — HKO Begleit-Dokumente (3er-Set)"
zweck: "Verbindliche Soll-Struktur, Tabellen- und Callout-Konventionen für alle Lehrpersonen-Begleitdokumente"
autor: "Kernteam 1 — BBW Winterthur"
stand: "2026-06-22"
status: "v2.1 — v2 + Implementierungs-Entscheide & As-built-Stand (TEIL 8, 2026-06-22)"
quellgrundlage:
  - "begleiter.md (1.1.1 Rechte verstehen und nutzen)"
  - "begleiter.md (1.1.1 Konflikte kennen, kommunizieren, klären)"
  - "JSON-Set 1.1.1 Konflikt (set/prinzip/hf_A/B/C/kn) — Datenmodell-Abgleich für TEIL 6"
changelog:
  - "v2: TEIL 6 (5 LP-Support-Erweiterungen) ergänzt; 4 neue Callouts ins Inventar (TEIL 3); Kapitelgerüst um neue Pflicht-/Empfehlungsbausteine erweitert"
  - "v2.1 (2026-06-22): TEIL 8 (As-built) ergänzt. Kanonische Terminologie «Herausforderung» statt «Situation»; TEIL-4-Punkte K1/K2/K3 entschieden; Kapitel «Anhang — Quellen» entfällt; Callout-Farbpalette + beide Render-Pfade (Word + HTML) implementiert; Word-Export-Bugfix (ImageRun type:png). Umgesetzt in den 3 EFZ-3J-Begleitern 1.1.1 Konflikt, 1.1.1 Rechte verstehen, 1.2.2 KI-KN-Vorbereitung"
gilt_fuer: "hko-einheits-begleiter Skill-Output; alle 3er-Set-Begleiter EFZ 3J/4J; EBA analog mit 2er-Anpassung"
---

# Struktur-Spezifikation — HKO Begleit-Dokumente

Diese Spezifikation legt fest, **wie ein Begleit-Dokument aufgebaut ist** — Kapitel, Subkapitel, Tabellen-Konventionen, Callout-Inventar. Sie ist aus zwei strukturell verwandten, im Detail divergierenden Referenzdokumenten distilliert. Bei Konflikt zwischen den Quellen wurde nach **Vollständigkeit** und **Referenzierbarkeit** entschieden; die Begründung steht jeweils dabei.

Ein Begleiter richtet sich **immer an die Lehrperson**, nie an die Lernenden. Er macht eine fertige 3er-Set-Einheit unterrichtbar, ohne dass die LP anderswo nachschlagen muss.

---

## TEIL 1 — Kapitelgerüst (verbindlich)

Reihenfolge und Nummerierung sind fix. Kapitel werden **nummeriert** (`## 0.` … `## 8.`) — das macht Querverweise innerhalb des Dokuments und über Dokumente hinweg eindeutig (Doc B-Konvention; Doc A war unnummeriert und dadurch nicht referenzierbar).

| # | Kapitel | Pflicht | Inhalt in einem Satz |
|---|---|---|---|
| — | **YAML-Frontmatter** | ✓ | Metadaten (siehe §1.0) |
| — | **H1-Titel + Adressaten-Intro** | ✓ | „Dieses Dokument richtet sich an die Lehrperson …" als Fliesstext **oder** `[!hinweis]`-Block |
| 0 | **So funktioniert diese Einheit** | ✓ | 5 Orientierungspunkte für LP aus klassischem Unterricht |
| 1 | **Kompetenz, Ressourcen, Architektur** | ✓ | Versprechen, Ressourcenanalyse, Verbindungsformel, Bloom, Mehrdeutigkeit, Zirkularität, Lehrmittel-Anker |
| **1.6** | **KI-Einsatz — Nutzungsideen für diese Einheit** | ✓ (v2) | Übersicht sinnvoller KI-Anwendungen; Ob/Wie bleibt LP-Entscheid (Empfehlung, keine Regel) — TEIL 6 §E5 |
| 2 | **Durchführungs-Varianten** | ✓ | A / B / C mit Lektionen, Kompetenz-Konsequenz, KN-Konsequenz |
| 3 | **Situation A** | ✓ | Steckbrief, Fahrplan, Leitfragen, Scaffolds, **Tafelbild (v2)**, **Vollständigkeits-Check (v2)**, **Troubleshooting (v2)**, **KI-Einsatz (v2)**, Mehrdeutigkeit, SK-Nachweis |
| 4 | **Situation B** | ✓ | analog Kap. 3 |
| 5 | **Situation C** | ✓ | analog Kap. 3 |
| 6 | **Austausch & Transfer (Abschluss-Arbeitsblatt)** | ✓ | eigenständiges Set-Dokument, verzweigt nach Variante |
| 7 | **Transfer — vom Fall zum Prinzip** | ✓ | Dekontextualisierung, Anker-Satz, Transferfeld |
| 8 | **Der Kompetenznachweis (KN)** | ✓ | Hybrid-Situation, Alignment-Tabelle, Methodenwahl, Fragenpool, **Erwartungshorizont je Frage (v2)**, bi-dim Bewertung |
| — | ~~Anhang — Quellen~~ | ✗ | **Entfällt (v2.1)** — siehe TEIL 8.3; Quellen sind über das Frontmatter (`quellen_json`) und die Lehrmittel-Anker (Kap. 1) abgedeckt |

> **Hinweis zur Reihenfolge Kap. 6 vs. 7:** Austausch & Transfer ist ein gemeinsames physisches Arbeitsblatt (zweiseitig). Kap. 6 beschreibt das Blatt und die Austausch-Seite (Sozialform-Varianten), Kap. 7 vertieft die Transfer-Seite (Dekontextualisierungs-Logik). Diese Aufteilung beibehalten — nicht zusammenlegen.

> **v2-Bausteine (TEIL 6):** Kap. 1.6 ist neu. In Kap. 3/4/5 kommen pro Situation drei neue Pflicht-Subkapitel (Vollständigkeits-Check, Tafelbild, KI-Einsatz) plus ein Troubleshooting-Callout dazu; in Kap. 8 ein Erwartungshorizont je Prüffrage. Detailspezifikation und Datenquelle je Baustein in **TEIL 6**.

---

## §1.0 — YAML-Frontmatter (Pflichtfelder)

```yaml
---
titel: "Begleit-Dokument — {Sprechtitel} ({Kompetenz-Nr})"
kompetenz: "{Nr} — {Kompetenzformulierung in ICH-Form}"
autor: "Kernteam 1 — BBW Winterthur"
stand: "YYYY-MM-DD"
lehrgang: "EFZ 3J | EFZ 4J | EBA 2J"
thema: "T{n} — {Themen-Titel}"
lebensbezug: "{n.n}"
quellen_json:
  - "{kompetenz}_set.json"
  - "{kompetenz}_prinzip.json"
  - "{kompetenz}_sit_A.json"
  - "{kompetenz}_sit_B.json"
  - "{kompetenz}_sit_C.json"
  - "{kompetenz}_kn.json"
---
```

**Entscheid:** `lehrgang`, `thema`, `lebensbezug` sind **Pflicht** (Doc B hatte sie, Doc A nicht). Begründung: Quick-Ref-Regel „Lehrgangs-Variante zuerst klären" — die Lehrgangs-Angabe im Frontmatter macht die Quelldatei (`nrlp_3j` vs. `nrlp_4j` vs. `nrlp_2j`) unmittelbar nachvollziehbar. Schlüssel `quellen_json` (nicht `quellen`) als kanonischer Name.

---

## §1.1 — H1-Titel + Adressaten-Intro

- **H1** = exakt der `titel` aus dem Frontmatter, ohne `Begleit-Dokument —` doppelt zu setzen.
- **Direkt darunter:** ein Absatz, der vier Dinge klärt: (1) Adressat = Lehrperson, (2) was die Lernenden separat erhalten (Situationsblätter A/B/C, «Austausch & Transfer», KN-Blatt), (3) was hier drinsteht (Ablauf, Scaffolds, Coaching, Bewertung), (4) das Versprechen „ohne anderswo nachschlagen zu müssen".
- **Form:** als `[!hinweis]`-Callout (Doc-B-Variante) **oder** als Fliesstext (Doc-A-Variante). **Empfehlung: Fliesstext**, weil das Intro vor dem ersten `##` steht und ein Callout dort optisch wie ein Subkapitel wirkt.

---

## §1.2 — Kapitel 0: So funktioniert diese Einheit

Genau **fünf** nummerierte Fettpunkte, in dieser Reihenfolge (Doc B; Doc A hatte nur vier — der fehlende war Mehrdeutigkeit):

| # | Punkt | Kern |
|---|---|---|
| 1 | **Backward Design** | KN zuerst definiert, Situationen danach abgeleitet |
| 2 | **Eine Kompetenz, drei Herausforderungen** | A/B/C als Steigerung, nicht Nebeneinander; je ein Stichwort, was A/B/C beiträgt |
| 3 | **Phasen-Schichten, nicht vermischen** | BBW 4-Phasen (Einheit) / AViVA (Herausforderung) / IPERKA (darunter) — als **Tabelle** |
| 4 | **Bewertet wird das Produkt, bi-dimensional** | SuK + Ges, zwei getrennte Noten; Prozess = Übung, nicht benotet |
| 5 | **Mehrdeutigkeit ist gewollt** | echter Zielkonflikt je Situation; nicht auflösen, sondern benennen |

Danach **zwei** `[!hinweis]`-Blöcke:
- `[!hinweis] Lektionentotal` — Spannweite 3–7 Lektionen je nach Variante, plus KN; „45 min = 1 Lektion".
- `[!hinweis] Diese Unterlagen sind Starthilfe, nicht Vollprogramm` — Zielanspruch ~80 %; fachliche Grundlagen vorab; ergänzen aus eigenem Fundus.

**Phasen-Schichten-Tabelle (verbindliches Format):**

| Schicht | Modell | Reichweite |
|---|---|---|
| Ganze Einheit | **BBW 4-Phasen** | Einstieg → Kompetenzaufbau → Wissensanwendung → KN |
| Eine Herausforderung (~3 Lektionen) | **AViVA-Bogen** | Ankommen → Vorwissen → Informieren → Verarbeiten → Auswerten |

> Die drei Phasenmodelle nie konflieren (Quick Ref §6). IPERKA liegt **unter** AViVA, nicht daneben.

---

## §1.3 — Kapitel 1: Kompetenz, Ressourcen, Architektur

Sieben Subkapitel, feste Reihenfolge (Doc-B-Struktur, vollständiger als Doc A):

| Subkapitel | Inhalt | Format |
|---|---|---|
| **Das Kompetenzversprechen** | ein ICH-Satz, der die ganze Kompetenz bündelt | Blockquote `>` |
| **Ressourcenanalyse** | was Lernende können müssen, getrennt GES / SuK | **2-Spalten-Tabelle** GES \| SuK |
| **Verbindungsformel (GES → SuK)** | wie Fachwissen und Sprachhandlung zusammenhängen | Blockquote mit *(Kursiv-Markern)* für die drei Rollen |
| **Bloom-Zielprofil pro Leitfrage** | LF1–LF4 mit K-Stufe + Problemtyp | Tabelle |
| **Mehrdeutigkeits-Architektur** | die 3 Zielkonflikte (einer pro Situation) | nummerierte Liste + `[!mehrdeutigkeit] Der Grundsatz` |
| **Zirkularität** | R1 (jetzt) → R2 → R3 mit Themen-Verortung | Tabelle |
| **Lehrmittel-Anker** | Kap.-Nr / Titel / Seiten, gültig für ganze Einheit | Tabelle |

**Ressourcenanalyse — kanonisches Format (2 Spalten, GES links, SuK rechts):**

| GES — Gesellschaftswissen (was wissen) | SuK — Sprache und Kommunikation (was können) |
|---|---|
| {Wissensknoten 1} | {Sprachtechnik 1} |
| … | … |

**Entscheid Reihenfolge GES vor SuK:** GES liefert den Inhalt, SuK die Form — die Verbindungsformel liest sich „GES → SuK", also steht GES links. (Doc A hatte SK-Nachweis und Sprachmodi separat verstreut; Doc B bündelt sauber — B gewinnt.)

**Verbindungsformel — Schema:**

> Die Lernende **{SuK-Sprachhandlung}** *(SuK)*, indem sie **{GES-Wissen}** *(GES)* nutzt, um **{Handlungsziel}** zu erreichen.

---

## §1.4 — Kapitel 2: Durchführungs-Varianten

Immer **drei** Varianten, immer in dieser Zuordnung:

| Variante | Modus | Lektionen (ohne KN) | Kompetenz-Erwerb |
|---|---|---|---|
| **A** | Einzelarbeit, alle drei | ~7 (3×2 + 1 Set-Schluss) | voll, aus erster Hand |
| **B** | Einzelarbeit, Auswahl 1–2 | ~3–5 | teilweise — nur Gewähltes |
| **C** | Gruppenarbeit / Jigsaw | ~3–4 | 1/3 selbst, 2/3 stellvertretend |

**Pflicht-Callouts in diesem Kapitel:**
- `[!warnung]` bei **B** → KN muss mitgekürzt werden (nur prüfen, was geübt wurde; konkrete Frage/Aufgabe nennen, die entfällt).
- `[!warnung]` bei **C** → zwei Drittel nur stellvertretend; zwei Gegenmittel (Austausch eng moderieren + Produkte nachholen).
- `[!coaching]` → Variante der Klasse offen ansagen.

**Pflicht-Absatz (vor den Varianten):** Reihenfolge A→B→C ist **frei**, Situationen können weggelassen/umgestellt werden; im KN wird nur geprüft, was geübt wurde.

**Darstellungs-Wahl:** Doc A nutzte **eine Vergleichstabelle** für alle drei Varianten, Doc B **drei Subkapitel** mit Fliesstext + Callouts. **Empfehlung: Subkapitel-Form (B)** — die Warnungen pro Variante brauchen Callout-Raum, der in einer Tabellenzelle nicht funktioniert. Eine kompakte Übersichtstabelle (wie oben) **zusätzlich** an den Kapitelanfang setzen.

---

## §1.5 — Kapitel 3/4/5: Die Situationen (identisches Subkapitel-Schema)

Jede Situation hat **exakt dieselbe** innere Struktur. Reihenfolge fix:

| Subkapitel | Pflicht | Inhalt | Format |
|---|---|---|---|
| **Steckbrief** | ✓ | Titel, Herausforderung, Persona, Aspekte, Sprachmodi, SK, Handlungsprodukt, Wissensknoten, Spannungsfeld | 2-Spalten-Tabelle `Feld \| Inhalt` |
| **(Situationstext)** | ✓ | die Situation, wie sie im Schülermaterial steht | Blockquote `>` |
| `[!hinweis]` 8 Merkmale | ✓ | Qualitätsnachweis Lernsituation (Müller 2010, Quick Ref §10) | Callout |
| **Unterrichtsfahrplan** | ✓ | AViVA-Bogen, 5 Phasen | Tabelle `AViVA-Phase \| Was passiert \| Sozialform` |
| **Leitfragen mit Coaching-Hinweisen** | ✓ | LF1–LF4 mit K-Stufe, je nach Bedarf `[!coaching]`/`[!warnung]`/`[!troubleshooting]` (v2) | Fettpunkt + Callout |
| **Tafelbild — fachliche Soll-Lösung** (v2) | ✓ | Mindmap als Erwartungsbild: Pflicht-Äste vs. optionale Vertiefung | `[!tafelbild]` (TEIL 6 §E4) |
| **Scaffold-Werkstatt (zum Abgeben)** | ✓ | fertige Vorlagen, eine Beispielzeile ausgefüllt | Tabellen / Code-Blöcke + `[!differenzieren]` |
| **Wann ist das Produkt fertig?** (v2) | ✓ | Haken-Liste je Teilprodukt (Leitfragen/Mindmap/Handlungsprodukt/Reflexion), **ohne Gewichte** | Checkliste (TEIL 6 §E2) |
| **KI-Einsatz in dieser Situation** (v2) | ✓ | 2–3 konkrete Nutzungsideen, an die Sprachhandlung gekoppelt; LP entscheidet Ob/Wie | `[!ki_einsatz]` (TEIL 6 §E5) |
| **Coaching & Scaffolds — auf einen Blick** | ✓ | „Die drei Moves" + „Zum Abgeben bereit" + Perspektivenwechsel | 2× `[!coaching]` |
| **Mehrdeutigkeit halten** | ✓ | das Spannungsfeld dieser Situation | `[!mehrdeutigkeit]` |
| **Wo welche SK geübt wird** | ✓ | SK → Demonstration (nicht Deklaration!) | Tabelle `SK \| Demonstration` |
| **Reflexion** | ✓ | R1/R2/R3 Fragen (Abgabe mit Set) | Fliesstext `R1 … · R2 … · R3 …` |

> **Position der v2-Subkapitel:** Tafelbild steht **vor** der Scaffold-Werkstatt (das Soll-Bild rahmt die Vorlagen). „Wann ist das Produkt fertig?" steht **nach** den Scaffolds (Selbstcheck gegen das, was erarbeitet wurde). KI-Einsatz steht nach dem Vollständigkeits-Check, vor dem Coaching-Block. Der `[!troubleshooting]`-Callout sitzt **im** Leitfragen-Block bei der Leitfrage, an der erfahrungsgemäss die Blockade auftritt (meist LF3 oder LF4).

**Steckbrief — kanonisches Format (mit Header-Zeile, Doc-B-Konvention):**

| Feld | Inhalt |
|---|---|
| Titel | {Sprechtitel der Situation} |
| Herausforderung | {1 Satz} |
| Persona | {Beruf, LJ, Betrieb, Ort — konkrete Zahlen: Lohn, Std/Woche} |
| Aspekte (Ges) | {Aspekt 1 (R{n}), Aspekt 2 (R{n})} |
| Sprachmodi | {Modus 1 · Modus 2} |
| Schlüsselkompetenzen | {SK{n} Kurzname · SK{n} Kurzname · SK11 Mehrdeutigkeit} |
| Handlungsprodukt | {Produkt, Format, Umfang} |
| Wissensknoten | {snake_case_knoten} |
| Spannungsfeld | {Pol A vs. Pol B} |

> **BUG-FIX (Pflicht):** In beiden Quelldokumenten ist der Steckbrief-Markdown defekt — Persona und Handlungsprodukt kleben in einer Zelle zusammen (`…Basel || **Handlungsprodukt**`). Ursache: fehlender Zeilenumbruch nach der Persona-Zeile. In der Skill-Generierung sicherstellen, dass **jedes Feld eine eigene Tabellenzeile** ist.

**Leitfragen — Konvention:**
- Immer **vier** Leitfragen LF1–LF4.
- K-Stufen-Progression fix: **LF1 = K2** (Verstehen) · **LF2 = K3** (Anwenden) · **LF3 = K3** (Entscheiden) · **LF4 = K3+/K4** (Formulieren).
- LF3 ist immer die **Entscheidungs-Leitfrage** → erhält fast immer ein `[!coaching]` „Entscheidung vor Begründung" (erst still entscheiden, dann begründen).
- LF4 produziert das **Handlungsprodukt**.

**Scaffolds — Konvention:**
- Jede ausfüllbare Vorlage hat **eine Beispielzeile ausgefüllt** (kursiv markiert), damit das Niveau klar ist.
- Tabellen-Scaffolds als Markdown-Tabelle; Schreib-Scaffolds (Brief, 3B) als ```Code-Block``` mit Unterstrich-Lücken.
- Jeder Scaffold-Block schliesst mit `[!differenzieren]` (80 % / 100 %).

---

## §1.6 — Kapitel 6: Austausch & Transfer

- Eröffnungs-Absatz: «Austausch & Transfer» ist seit Redesign **ein eigenständiges, zweiseitiges Set-Dokument** (kein Anhang im Situationsheft). Seite 1 = Austausch (3 Lösungen im Vergleich), Seite 2 = Transfer.
- `[!hinweis] Das Arbeitsblatt — Aufbau und Wahl der Sozialform`: beschreibt das A4-Blatt; **drei Sozialformen zum Ankreuzen** (EA / GA / PL) mit Variante-Zuordnung (C→GA, A→PL/EA, B→gemischt).
- **Drei Verzweigungs-Subkapitel:** „Bei Variante C (Jigsaw)" (3-Runden-Tabelle + Moderationsspalte), „Bei Variante A" (verkürzter Plenums-Austausch), „Bei Variante B" (gemischt).
- Jigsaw-Tabelle: `Runde \| Auftrag \| Zeit \| Deine Moderation` — Runde 1 Expertise teilen (90 Sek/Person), Runde 2 Gemeinsamkeit abstrahieren, Runde 3 Transfer.
- Pflicht-`[!warnung]`: Jigsaw-Qualität entscheidet über den KN.

---

## §1.7 — Kapitel 7: Transfer

- Einordnung: IPERKA-Schritt **Dekontextualisieren**; für Lernende heisst der Auftrag **Transfer** (Quick Ref §6).
- **Auftrag (Set):** 5–7 Sätze, neuer selbstgewählter Kontext, Lehrmittelbegriffe; Abgabe vor dem KN auf Seite 2 des «Austausch & Transfer»-Blatts.
- **Anker-Satz** als Blockquote — gehört an die Tafel, **nachdem** die Klasse ihn selbst erarbeitet hat, nicht vorgegeben.
- `[!lernziel] So sieht guter Transfer aus` — Positiv-Beispiel in fremder Domäne (Miete, Verein, WG …).
- `[!warnung] Typischer Stolperstein` — schwacher Transfer wiederholt nur den Lehrbetriebs-Fall; Kontext ausserhalb Lehrbetrieb verlangen.

---

## §1.8 — Kapitel 8: Der Kompetenznachweis (KN)

Feste Subkapitel-Reihenfolge:

| Subkapitel | Inhalt | Format |
|---|---|---|
| **Hybrid-Situation** | neue Persona (in keiner Sit vorkommend!), 1 zugespitzte Szene | Blockquote |
| **Alignment-Tabelle** | wo A/B/C im Hybrid-Fall stecken | Tabelle `Aus \| zeigt sich im KN als` |
| `[!hinweis] Neue Dimension` | was der KN schärft, das keine Einzelsituation hatte | Callout (optional, wenn zutreffend) |
| **Methodenwahl** | Fachgespräch / Mini Case / Werkschau, alle mit derselben Rubrik | Tabelle `Methode \| Format \| prüft \| Sprachmodi \| Wähle wenn` |
| `[!coaching]` Methodenwahl an Variante koppeln | C→Werkschau, A→Mini Case/Fachgespräch | Callout |
| `[!hinweis] Ausblick` | CI / Produkt-mit-Präsentation als nicht-ausgearbeitete Optionen | Callout |
| **Fragenpool / Aufgabenfolge** | Fachgespräch (5 Fragen K2→K4), Mini Case (4 Aufgaben), Werkschau (Wahl+Reflexion) | Tabelle / Liste |
| **Bi-dimensionale Bewertung** | 4 Kriterien × 2 Dimensionen, 4 Stufen, Aggregation, Niveaubänder | Tabellen + `[!warnung]` + `[!coaching]` + `[!mehrdeutigkeit]` |

**Bi-dim Rubrik — kanonisches Format:** vier Kriterien, zwei je Dimension.

| Kriterium | Dimension | Stufe 1 | Stufe 2 | Stufe 3 | Stufe 4 |
|---|---|---|---|---|---|
| Fachkorrektheit | **SuK** | … | … | … | … |
| Argumentation | **SuK** | … | … | … | … |
| {Ges-Prinzip, fachabhängig} | **Ges** | … | … | … | … |
| Position / Werthaltung | **Ges** | … | … | … | … |

**Stufenskala-Hinweis:** Die Begleiter nutzen eine **1–4**-Darstellung der Rubrik-Stufen (1 = tiefste). Das ist die Rubrik-interne Kriteriumsskala. **Nicht verwechseln** mit der nRLP-**Gütestufen-Skala 0–3** (userMemories / Framework). → **Offener Klärungspunkt, siehe TEIL 4.**

**Aggregation (immer als Code-Block):**
```
SuK-Note = Mittel aus {SuK-Kriterium 1} + {SuK-Kriterium 2}
Ges-Note = Mittel aus {Ges-Kriterium 1} + {Ges-Kriterium 2}
→ zwei getrennte Noten, gleichgewichtet. Nicht zu einer Zahl verrechnen.
```

**Niveaubänder (kanonisch, in beiden Docs identisch):**

| Band | Definition |
|---|---|
| unter 60 % | Stufen 1–2 dominant |
| 80 % | mehrheitlich Stufe 3 |
| 100 % | Stufe 4 in mindestens 3 Kriterien |

**Pflicht-Callouts:** `[!warnung]` SuK+Ges nicht zu einer Note verrechnen · `[!mehrdeutigkeit]` häufigster Bewertungsfehler (wer Zielkonflikt auflöst, verfehlt das Versprechen).

---

## TEIL 2 — Tabellen-Konventionen

| Tabellentyp | Spalten (kanonisch) | Vorkommen |
|---|---|---|
| **Steckbrief** | `Feld \| Inhalt` (mit Header) | Kap. 3/4/5, je 1× |
| **Ressourcenanalyse** | `GES … \| SuK …` (2 Spalten, GES links) | Kap. 1 |
| **Bloom-Zielprofil** | `Leitfrage \| K-Stufe \| Problemtyp` | Kap. 1 |
| **Zirkularität** | `Iteration \| Verortung` | Kap. 1 |
| **Lehrmittel-Anker** | `Kap. \| Titel \| Seiten` | Kap. 1 |
| **Varianten-Übersicht** | `Variante \| Modus \| Lektionen \| Kompetenz` | Kap. 2 |
| **AViVA-Fahrplan** | `AViVA-Phase \| Was passiert \| Sozialform` | Kap. 3/4/5 |
| **SK-Nachweis** | `SK \| Demonstration` | Kap. 3/4/5 |
| **Scaffold (Tabellen-Typ)** | fachabhängig, **1 Beispielzeile kursiv** | Kap. 3/4/5 |
| **Alignment** | `Aus \| zeigt sich im KN als` | Kap. 8 |
| **Methodenwahl** | `Methode \| Format \| prüft \| Sprachmodi \| Wähle wenn` | Kap. 8 |
| **Fragenpool** | `# \| Typ \| K \| Fokus` | Kap. 8 |
| **Bi-dim Rubrik** | `Kriterium \| Dimension \| Stufe 1–4` | Kap. 8 |
| **Niveaubänder** | `Band \| Definition` | Kap. 8 |

**Allgemeine Regeln:**
- Header-Zeile immer vorhanden (auch beim Steckbrief — `Feld | Inhalt`).
- Fett (`**…**`) nur für Schlüsselbegriffe in Zellen (Phasennamen, SK-Nummern, Dimensionen), nicht flächig.
- Kursiv für Beispielzeilen in Scaffolds und für die *(Rollen-Marker)* in der Verbindungsformel.
- Kein Eszett, durchgehend „ss".
- Jedes Feld = eigene Zeile (Steckbrief-Bug nicht reproduzieren).

---

## TEIL 3 — Callout-Inventar (verbindlich)

**Zehn** Callout-Typen — sechs Basis-Typen (v1) plus vier LP-Support-Typen (v2, eingeführt in TEIL 6). Jeder hat **eine** Funktion, einen festen Inhaltstyp und definierte Einsatzorte. Callouts mit Titel (`> [!typ] Titel`) sind klarer als ohne — **Titel ist Pflicht**, ausser bei reinen Einzeiler-Hinweisen.

**Basis-Typen (v1):**

| Callout | Funktion | Inhalt | Einsatzorte (Kapitel) | Titel-Pflicht |
|---|---|---|---|---|
| `[!hinweis]` | neutrale Orientierung / Rahmensetzung | Fakten, Aufbau-Erklärungen, Lektionen-Logik, 8-Merkmale-Nachweis, Ausblick | Intro, 0, 3/4/5 (8 Merkmale), 6, 8 | empfohlen |
| `[!coaching]` | LP-Handlungsanweisung | konkrete Moderations-Moves, Perspektivenwechsel, „Die drei Moves", Methodenwahl-Kopplung | 0 (Rolle), 2, 3/4/5 (mehrfach), 6, 8 | bei thematischen Blöcken Pflicht |
| `[!warnung]` | Fehler-/Risiko-Prävention | typische Stolpersteine, Bewertungsfehler, Varianten-Risiken | 2 (B+C), 3/4/5 (Stolpersteine), 6 (Jigsaw), 7, 8 (Verrechnungs-Fehler) | empfohlen |
| `[!mehrdeutigkeit]` | SK11 sichtbar halten | das Spannungsfeld; „nicht auflösen, sondern benennen" | 1 (Grundsatz), 3/4/5 (je Situation), 8 (Bewertungs-Mehrdeutigkeit) | empfohlen |
| `[!differenzieren]` | 80/100-Achse | Standard-Erreichung (80 %, alle) vs. Vertiefung (100 %, selbstgesteuert) | 3/4/5 (jeder Scaffold-Block) | Pflicht (Format „80 vs. 100 — Situation X") |
| `[!lernziel]` | Soll-Bild „gutes Produkt" | wie ein gutes Produkt / guter Transfer konkret aussieht | 3/4/5 (nach Scaffold), 7 (guter Transfer) | empfohlen |

**LP-Support-Typen (v2 — Detailspezifikation in TEIL 6):**

| Callout | Funktion | Inhalt | Einsatzorte (Kapitel) | Titel-Pflicht |
|---|---|---|---|---|
| `[!erwartungshorizont]` | Benotungssicherheit ohne Musterlösung | je Prüffrage: was Stufe 3 zeigt vs. Stufe 4 zusätzlich + „nicht Stufe 4"-Gegenbeispiel | 8 (je KN-Frage/-Aufgabe) | Pflicht (Frage-Nr + K-Stufe) |
| `[!troubleshooting]` | Reaktion im Moment des Stockens | konkrete Interventionssätze für die häufigste Blockade je Situation | 3/4/5 (je 1×) | Pflicht (Situation + Blockade) |
| `[!tafelbild]` | fachliche Soll-Lösung sichtbar | Mindmap als Erwartungsbild: Pflicht-Äste vs. optionale Vertiefung | 3/4/5 (Scaffold-Bereich) | empfohlen |
| `[!ki_einsatz]` | sinnvolle KI-Nutzungsideen | situationsspezifische Vorschläge; Ob/Wie bleibt LP-Entscheid (Empfehlung, keine Regel) | 1.6 (Übersicht) + 3/4/5 (je Situation) | Pflicht |

**Einsatz-Matrix — welcher Callout wo mindestens einmal vorkommt:**

| Kapitel | hinweis | coaching | warnung | mehrdeut. | differ. | lernziel | erwart.horiz. | troublesh. | tafelbild | ki_einsatz |
|---|---|---|---|---|---|---|---|---|---|---|
| Intro | ○ | | | | | | | | | |
| 0 | ✓✓ | ✓ | | | | | | | | |
| 1 | | | | ✓ | | | | | | |
| 1.6 | | | | | | | | | | ✓ |
| 2 | | ✓ | ✓✓ | | | | | | | |
| 3/4/5 (je) | ✓ | ✓✓✓ | ✓ | ✓ | ✓ | ✓ | | ✓ | ✓ | ✓ |
| 6 | ✓ | ✓ | ✓ | | | | | | | |
| 7 | | | ✓ | | | ✓ | | | | |
| 8 | ✓✓ | ✓ | ✓ | ✓ | | | ✓ (je Frage) | | | |

(✓ = mind. einmal Pflicht · ○ = optional · Mehrfach-✓ = typische Anzahl)

**Konventionen für `[!coaching]`-Blöcke in den Situationen:**
- Pro Situation gibt es zwei feste Coaching-Blöcke mit Titel: **„Die drei Moves dieser Herausforderung"** (3 nummerierte Moves + Zeile „Zum Abgeben bereit: …") und **„Perspektivenwechsel"** (Adressaten-/Gegenseiten-Perspektive, oft an eine SK gekoppelt).
- Zusätzlich inline-Coaching direkt unter einzelnen Leitfragen (ohne Titel zulässig).

**Konventionen für `[!differenzieren]`:**
- Format immer: `**80 % (alle):** … **100 % (selbstgesteuert/Vertiefung):** …`.
- 100 % ist nie zusätzliches Pflichtpensum, sondern Vertiefung für Schnellere (Quick Ref §9: 90/100-Achse; „selbstgesteuerte Vertiefung ausserhalb Pflicht").

> **Namens-Klärung:** Quick Ref §9 nennt die Achse **„90/100"** (90 % = alle mit Scaffolding, 100 % = Vertiefung). Beide Begleiter schreiben **„80 %"** statt 90 %. → **Offener Klärungspunkt, siehe TEIL 4.**

---

## TEIL 4 — Offene Klärungspunkte (Pietro entscheidet)

Drei Inkonsistenzen zwischen den Begleitern und der kanonischen Quick Reference. Keine ist trivial — alle drei betreffen Compliance-relevante Skalen/Bänder. Entscheid liegt bei dir; ich setze nichts unilateral.

| # | Konflikt | Begleiter sagen | Quick Ref / Memory sagt | Tragweite |
|---|---|---|---|---|
| **K1** | **Zielanspruchs-Band** | „80 %" (Standard-Erreichung) | §9: Achse heisst **„90/100"**; 90 % = alle mit Scaffolding | Beide Begleiter UND §1.2-Intro nutzen 80 %. Entweder Quick Ref §9 anpassen oder Begleiter auf 90 % umstellen. **Konsistenz-Pflicht.** |
| **K2** | **Rubrik-Stufenskala** | „1–4" (1 = tiefste) | Gütestufen **0–3** (Memory: „Gütestufen scale 0–3, not 1–4") | Die Begleiter-Rubrik läuft 1→4. Die nRLP-Gütestufe läuft 0→3. Sind das zwei verschiedene Dinge (Rubrik-intern vs. nRLP-Gütestufe) oder ein Widerspruch? Muss geklärt werden, bevor der Skill skaliert. |
| **K3** | **Niveauband „unter 60 %"** | Tabelle listet „unter 60 %" | §9: „Kein 70%-Band … 4 Bänder entfernt" | Die 3-Band-Tabelle (unter 60 / 80 / 100) — ist das legitim oder ein Wiedergänger der entfernten Prozentbänder? |

**Empfehlung zur Reihenfolge:** K2 zuerst (Skala ist fundamentaler als Bänder), dann K1, dann K3. Sobald entschieden, fliesst das Ergebnis als Korrektur in diese Spec **und** in den `hko-einheits-begleiter` Skill.

> **ENTSCHIEDEN (Pietro, 2026-06-22):**
> - **K1** → Zielanspruchs-Band **80 %** (nicht 90 %). Niveaubänder bleiben **unter 60 % / 80 % / 100 %**.
> - **K2** → Rubrik-Stufenskala **1–4** (1 = tiefste) als rubrik-interne Kriteriumsskala.
> - **K3** → Das Band **«unter 60 %» bleibt**; die 3-Band-Tabelle ist gültig.
>
> Die `kn.json`-Dateien (`rubrik_shared.niveaubaender` + `kriterien[].stufen[]`) tragen diese Werte bereits; Begleiter und JSON sind konsistent. Details und Umsetzung: **TEIL 8.2**.

---

## TEIL 5 — Konsens vs. Divergenz (Audit-Trail)

Was beide Referenzdokumente **gleich** machen (= harter Konsens, unverändert übernommen):

- 3er-Set-Logik, Backward Design, A/B/C als Steigerung
- Drei Durchführungs-Varianten A/B/C mit identischer Semantik
- AViVA-Fahrplan als 5-Phasen-Tabelle pro Situation
- Vier Leitfragen LF1–LF4 mit K2→K4-Progression
- Scaffolds mit Beispielzeile + `[!differenzieren]`
- «Austausch & Transfer» als eigenständiges zweiseitiges Blatt
- Transfer = Dekontextualisierung, Anker-Satz selbst erarbeiten lassen
- KN mit neuer Hybrid-Persona, drei Methoden auf einer Rubrik
- Bi-dim Bewertung, zwei getrennte Noten, „nie verrechnen"
- Niveaubänder unter 60 / 80 / 100
- Mehrdeutigkeit als durchgehendes Prinzip
- Sechs Callout-Typen

Wo sie **divergierten** und wie entschieden wurde:

| Achse | Doc A | Doc B | Entscheid | Grund |
|---|---|---|---|---|
| Kapitel-Nummerierung | keine | 0–8 | **nummeriert** | Referenzierbarkeit |
| Intro-Punkte | 4 | 5 | **5** | Mehrdeutigkeit gehört rein |
| Kompetenz-Kapitel | verstreut | gebündelt Kap. 1 | **gebündelt** | Vollständigkeit |
| Steckbrief-Header | ohne | `Feld\|Inhalt` | **mit Header** | Lesbarkeit |
| SK-Nachweis | nur global | global + pro Sit | **pro Situation** | Granularität, Demonstrationsprinzip |
| 8-Merkmale-Check | nur erwähnt | `[!hinweis]` pro Sit | **pro Situation** | Qualitätsnachweis sichtbar |
| Bloom | im Steckbrief | eigene Tabelle | **eigene Tabelle** Kap. 1 | Übersicht |
| Varianten-Darstellung | 1 Tabelle | 3 Subkapitel | **Subkapitel + Übersichtstabelle** | Callout-Raum |
| Frontmatter | minimal | + lehrgang/thema/lebensbezug | **erweitert** | Lehrgangs-Klärung |

---

---

## TEIL 6 — LP-Support-Erweiterungen (v2)

Fünf Standard-Erweiterungen, die in **jedem** Begleiter erscheinen. Leitprinzip: **kein Neuerfinden, sondern Datenhebung** — vier der fünf sind fast vollständig aus Feldern generierbar, die das JSON-Set bereits trägt, der Begleiter sie aber bisher nicht für die LP sichtbar macht. Zielgruppe ist die HKO-unerfahrene LP; die Erweiterungen adressieren die drei häufigsten Startunsicherheiten: *Wann ist etwas genug? Was sage ich beim Stocken? Wie benote ich ohne Musterlösung?*

**Datenhebungs-Übersicht:**

| § | Erweiterung | Form | Primäre JSON-Quelle | Adressierter LP-Schmerz |
|---|---|---|---|---|
| E1 | Erwartungshorizont je Prüffrage | `[!erwartungshorizont]` in Kap. 8 | `kn.json` `kn_typen[].fragestruktur` × `rubrik_shared.kriterien[].stufen[]` | „Wie benote ich ohne Musterlösung?" |
| E2 | Vollständigkeits-Check (Haken-Liste) | Subkap. „Wann ist das Produkt fertig?" Kap. 3/4/5 | `hf_*.json` `bewertungsraster[].vollstaendig_wenn[]` | „Wann ist es genug?" |
| E3 | „Wenn ein Lernender feststeckt" | `[!troubleshooting]` Kap. 3/4/5 | `mehrdeutigkeit.hint` + `scaffolding.strategien` + vorhandene `[!warnung]`-Stolpersteine | „Was sage ich im Moment?" |
| E4 | Tafelbild — fachliche Soll-Lösung | `[!tafelbild]` Kap. 3/4/5 | `mindmap_zentrum` + `mindmap_aeste[]` (inkl. `optional`-Flag) | „Was ist die Soll-Lösung?" |
| E5 | KI-Einsatz — Nutzungsideen | Kap. 1.6 + `[!ki_einsatz]` Kap. 3/4/5 | redaktionell, an Sprachhandlung gekoppelt | KI-Unsicherheit; LP-Hoheit wahren |

**Priorisierung:** E5 und E1 zuerst (Benotungssicherheit + KI-Orientierung haben den grössten Effekt auf das Sicherheitsgefühl). E2 und E4 sind reine Datenhebung (niedrigster Aufwand, da JSON alles trägt). E3 braucht am meisten Redaktion (Interventionssätze müssen formuliert werden) und sollte in der Pilot-Phase manuell geprüft werden, bevor der Skill ihn generiert.

---

### §E1 — Erwartungshorizont je Prüffrage

**Wo:** Kap. 8, direkt nach jeder Frage/Aufgabe im Fragenpool. **Callout:** `[!erwartungshorizont]`. **Titel-Pflicht:** Frage-Nr + K-Stufe.

Grösste Lücke der v1-Begleiter: Der KN listet Fragen mit K-Stufe, aber keine Musterantwort. Quick Ref §4 verlangt für das Fachgespräch explizit „vorbereitete Fragen **mit Musterantworten**" — ohne Erwartungshorizont kann eine HKO-unerfahrene LP nicht fair und konsistent benoten.

**Inhalt je Frage (drei Zeilen):**
- **Stufe 3 zeigt:** was eine situationsangemessene, korrekte Antwort enthält (aus dem `frage`-Text + Stufe-3-Deskriptor des einschlägigen Rubrik-Kriteriums).
- **Stufe 4 zeigt zusätzlich:** Differenzierung, Zielkonflikt explizit, Transfer (aus Stufe-4-Deskriptor).
- **Nicht Stufe 4:** ein konkretes Gegenbeispiel, das souverän klingt, aber den Zielkonflikt **auflöst** — der häufigste Bewertungsfehler.

**Generierungsregel:** Frage `k_stufe` bestimmt das Ziel-Niveau; das thematisch passende `rubrik_shared`-Kriterium liefert die Stufenformulierungen. K2-Fragen (Erklären) brauchen keinen „Stufe 4 vs. auflösen"-Kontrast, sondern nur „vollständig vs. lückenhaft".

**Beispiel (aus `kn.json`, Fachgespräch Frage 3):**

> [!erwartungshorizont] Frage 3 (Beurteilen, K3) — beide Pole gleich gewichten?
> **Stufe 3:** benennt beide Interessen (Recht auf korrekte Lerndoku · Beziehung erhalten) und entscheidet begründet.
> **Stufe 4:** hält den Zielkonflikt offen aus, zeigt, warum keine Seite eliminiert werden darf, und bezieht die Rechtsverstoss-Schärfung ein.
> **Nicht Stufe 4:** „Ich meld's einfach dem Ausbildungsleiter, fertig." — souverän, aber löst den Konflikt auf → verfehlt das Kompetenzversprechen.

---

### §E2 — Vollständigkeits-Check (Haken-Liste, ohne Gewichte)

**Wo:** Kap. 3/4/5, nach der Scaffold-Werkstatt. **Form:** Checkliste (keine Tabelle mit Prozenten).

Jede `hf_*.json` trägt `bewertungsraster[].vollstaendig_wenn[]` — fertige Vollständigkeits-Kriterien je Teilprodukt (Leitfragen, Mindmap, Handlungsprodukt, Reflexion), die der v1-Begleiter nicht zeigt. Das ist die direkte Antwort auf „Was muss drin sein, damit ich abhaken kann?".

**Abgrenzung (wichtig):** Das ist **formative Selbstkontrolle der Lernaufgaben-Phase**, nicht der benotete KN. Doc B benennt das selbst. → Als **reine Haken-Liste** rendern.

> **Entscheid Pietro (2026-06-22):** Die `lernfortschritt.kriterien[].gewicht_prozent`-Werte (4×25 %) werden **nicht** angezeigt. Begründung: Gewichte suggerieren Benotung; der Vollständigkeits-Check ist formativ. Nur Haken-Liste, keine Prozente — auch nicht LP-intern im Begleiter.

**Format:**

```
**Wann ist das Produkt fertig?** (Selbstcheck — formativ, nicht benotet)

Leitfragen
☐ alle vier schriftlich beantwortet
☐ {vollstaendig_wenn[1]}
☐ {vollstaendig_wenn[2]}

Handlungsprodukt
☐ {vollstaendig_wenn[…]}
…
```

**Generierungsregel:** 1:1 aus `bewertungsraster[].produkt` (Überschrift) + `vollstaendig_wenn[]` (Haken-Punkte). Reihenfolge: Leitfragen → Mindmap → Handlungsprodukt → Reflexion. Keine Umformulierung nötig, die JSON-Strings sind bereits checklisten-tauglich.

---

### §E3 — „Wenn ein Lernender feststeckt"

**Wo:** Kap. 3/4/5, im Leitfragen-Block bei der erfahrungsgemäss kritischen Leitfrage (meist LF3 Entscheiden oder LF4 Formulieren). **Callout:** `[!troubleshooting]`. **Titel-Pflicht:** Situation + Blockade.

Der v1-Begleiter sagt, was Lernende tun **sollen** (`[!coaching]`) und warnt vor Stolpersteinen (`[!warnung]`) — aber gibt keine **Reaktion** für den Moment, in dem es im Raum hakt. Für die coachende Rolle (laut beiden Docs der grösste Bruch zum Frontalunterricht) ist das die akut fehlende Stütze.

**Inhalt:** die häufigste konkrete Blockade + ein **Interventionssatz** (was die LP sagt/fragt, nicht erklärt) + die Weiterführung. Abgeleitet aus `mehrdeutigkeit.hint` (der Zielkonflikt, an dem Lernende hängenbleiben) + `scaffolding.strategien` (der Ausweg) + dem vorhandenen `[!warnung]`-Stolperstein.

**Unterschied zu `[!warnung]`:** Warnung = Prävention vor dem Unterricht („das passiert oft"). Troubleshooting = Reaktion im Unterricht („das passiert **jetzt**, sag dies"). Die Warnung beschreibt den Fehler, das Troubleshooting gibt den Satz.

**Beispiel (aus `hf_B.json`):**

> [!troubleshooting] Sit B — Lernende/r tippt sofort eine knappe WhatsApp zurück
> Nicht korrigieren. Fragen lassen: „Lies deine Antwort in einem halben Jahr nochmal — was beweist sie dann?" Sitzt der Beweismittel-Charakter, entscheidet er die Kanalfrage selbst. **Erst dann** die Kanal-Vergleichstabelle austeilen — nicht davor.

**Generierungsregel:** Eine Troubleshooting-Box pro Situation, verortet an der Leitfrage mit dem schärfsten `trade_off`. Der Interventionssatz ist immer eine **Rückfrage** oder ein **Spiegeln**, nie eine Erklärung (sonst kippt die coachende Rolle zurück in Frontal).

---

### §E4 — Tafelbild — fachliche Soll-Lösung

**Wo:** Kap. 3/4/5, vor der Scaffold-Werkstatt. **Callout:** `[!tafelbild]`.

`mindmap_zentrum` + `mindmap_aeste[]` enthalten eine vollständige fachliche Soll-Struktur (Äste, Detailpunkte, OR-/Kapitel-Bezüge) — der v1-Begleiter nennt die Mindmap nur als Arbeitsschritt, zeigt sie aber nicht. Für eine LP, die den Stoff (Vier Ohren, Konfliktwege OR 345a/ArG 31) nicht aus dem Effeff hat, ist das fertige Erwartungsbild die zentrale fachliche Absicherung: was an die Tafel kommt, was Lernende mindestens finden müssen.

**Pflicht/Kür-Differenzierung:** Die JSONs markieren Äste mit `"optional": true` (z. B. Konfliktwege-Ast in hf_A, Ethik-Ast in hf_B). → Optionale Äste als **Vertiefung** kennzeichnen, nicht als Pflicht-Erwartung. Das speist zugleich die 100 %-Differenzierung.

**Format:**

> [!tafelbild] Erwartungsbild — {mindmap_zentrum}
> **Pflicht-Äste** (Lernende sollen alle finden):
> - **{Ast-Titel}** — {Detailpunkte komma-separiert}
> - …
> **Optionale Vertiefung** (für 100 %): **{optionaler Ast-Titel}** — {Punkte}

**Generierungsregel:** `optional: false` → Pflicht-Block; `optional: true` → Vertiefungs-Block. `mindmap_zentrum` als Callout-Titel. Detailpunkte aus `mindmap_aeste[].punkte[]`.

---

### §E5 — KI-Einsatz — Nutzungsideen

**Wo:** Kap. 1.6 (Übersicht für die ganze Einheit) + `[!ki_einsatz]` je Situation in Kap. 3/4/5. **Callout:** `[!ki_einsatz]`.

> **Rahmung Pietro (2026-06-22):** Der Begleiter macht **keine** KI-Regel (kein Verbot/Gebot, keine Compliance-Regelung) — das überschneidet sich mit den separaten **KI-Fluency-Zusatzmaterialien**, die ihre eigenen Begleiter haben und die Schlüsselkompetenzen zur KI-Nutzung abdecken. Der Einheits-Begleiter **empfiehlt** stattdessen sinnvolle Nutzungsideen; **ob und wie** KI eingesetzt wird, bleibt vollständig LP-Entscheid. Die KI-Fluency-Materialien sind fertig, aber noch nicht veröffentlicht — im Begleiter **nicht** darauf verweisen, bis sie publiziert sind.

**Abgrenzung zu früherem Entwurf:** Die in der Vorabbesprechung erwogene `[!ki_regel]` mit RLP-Z.749-Compliance-Frame **entfällt**. Die Z.749-Hilfsmittelregelung ist Schullehrplan-Ebene (Kernteam-1/ABU-Kodex), nicht Begleiter-Ebene. Der Begleiter operiert auf Empfehlungs-, nicht auf Regelungsebene.

**Inhalt Kap. 1.6 (Einheits-Übersicht):** ein kurzer Rahmen-Absatz (LP entscheidet Ob/Wie) + 2–4 Nutzungsideen, die zur Kompetenz passen. Generell für diese Einheit, z. B. „KI als Sparringpartner beim Argumentieren", „Register-/Tonprüfung eines Entwurfs".

**Inhalt je Situation (`[!ki_einsatz]`):** 2–3 **situationsspezifische** Ideen, an die jeweilige Sprachhandlung gekoppelt:

> [!ki_einsatz] KI-Nutzungsideen — Sit A (Positionspapier)
> Ob und wie KI zum Einsatz kommt, entscheiden Sie. Sinnvoll wären hier:
> - **Entwurf prüfen lassen:** das fertige Positionspapier auf Sachlichkeit und 3B-Struktur gegenlesen lassen — bleibt es Klärung statt Anklage?
> - **Gegenposition simulieren:** KI die Rolle des Berufsbildner/in übernehmen lassen und Gegenargumente liefern, um die eigene Begründung zu härten.
> - **Nicht:** das Papier generieren lassen — die Eigenleistung (SK6 Standpunkte begründen) muss erkennbar bleiben.

**Generierungsregel:** Die Nutzungsideen leiten sich aus dem `handlungsprodukt.format` und der dominanten Sprachhandlung ab. Zwei produktive Muster, die in fast jeder Situation tragen: (1) **Entwurf korrigieren/prüfen lassen** (bei Schreibprodukten), (2) **Rolle einer Gegenpartei übernehmen** (bei Argumentations-/Gesprächsprodukten). Immer mit einem „Nicht"-Hinweis, der die zu zeigende SK schützt. Formulierung durchgehend als **Empfehlung** („wäre sinnvoll", „könnten"), nie als Vorschrift.

---

## TEIL 7 — Datenmodell-Lücken (für `hko-einheits-begleiter` Skill)

Beim JSON-Abgleich für TEIL 6 sind Felder aufgefallen, die der Generator nutzen kann, sowie eine Inkonsistenz, die in die Skill-Iteration gehört:

| Beobachtung | Fundort | Konsequenz |
|---|---|---|
| `emotion_tag` (Verunsicherung/Unter Druck/Anspannung) ungenutzt | `hf_*.json` | Optional: als Einstiegs-Dramaturgie im AViVA-„Ankommen" nutzbar; nicht Pflicht |
| `schritte[].label/.hint` nur teilweise im Begleiter | `hf_*.handlungsprodukt.schritte[]` | Bereits weitgehend in Scaffolds; auf Vollständigkeit prüfen |
| `dekontextualisierung.frage` pro Situation ungenutzt | `hf_*.json` | Drei situationsspezifische Transferbrücken — Kandidat für künftige Erweiterung (nicht in v2) |
| `nr_primary` in hf_B enthält `1.1.3` (Mehrfachzuordnung) | `hf_B.json` `nrlp.nr_primary` | Begleiter zeigt nur 1.1.1 — prüfen, ob Zweitzuordnung relevant ist |
| Aspekt-Schreibweise inkonsistent | `prinzip.json` „Technologische und digitale Transformation" vs. Quick Ref „Technologie und digitale Transformation" | **Kanonische Schreibweise prüfen** (Quick Ref §2 ist Referenz); Skill normalisieren |
| `austausch_phase` / `dekontextualisierungs_aufgabe.gewicht_prozent: 15` | `set.json` | Set-Transfer trägt ein Gewicht (15 %) — Verhältnis zu „Transfer benotet ja/nein" klären (hängt an TEIL-4-Entscheidungen) |

Diese Punkte sind **nicht** Teil der v2-Spezifikation, sondern Input für die Skill-Iteration — hier dokumentiert, damit sie nicht verloren gehen.

---

## TEIL 8 — Implementierung & Entscheide (As-built, 2026-06-22)

Dieser Teil hält fest, was beim Umsetzen von v2 in die drei EFZ-3J-Begleiter (1.1.1 Konflikte, 1.1.1 Rechte verstehen, 1.2.2 KI-KN-Vorbereitung) entschieden und tatsächlich umgesetzt wurde. Er ist der **As-built-Stand** und hat bei Konflikt **Vorrang** vor älteren Formulierungen in TEIL 1–7 (die teils noch «Situation» schreiben oder den Anhang als Pflicht führen).

### 8.1 Terminologie — «Herausforderung» statt «Situation»

Die drei A/B/C-Lerneinheiten heissen durchgehend **Herausforderung A/B/C** (nicht «Situation»). Einheitlich angewendet auf: Kapiteltitel 3/4/5, «alle (drei) Herausforderungen» (Lehrmittel-Anker, Variante A), «Hybrid-Herausforderung» (Kap. 8), das Subkapitel «KI-Einsatz in dieser Herausforderung», die Callout-Titel (`[!mehrdeutigkeit]`, `[!ki_einsatz]`, `[!troubleshooting]`, `[!differenzieren]`) und die AViVA-Phase «Ankommen» («Herausforderung lesen»). **Unverändert** bleibt der didaktische Fachbegriff **«Lernsituation»** (z. B. «8 Merkmale Lernsituation», «Qualität der Lernsituation») sowie die Eigennamen der Schüler-Druckunterlagen («Situationsblätter»). → In TEIL 1/§1.5 weiterhin «Situation»: gilt als überholt, lies «Herausforderung».

### 8.2 TEIL-4-Klärungspunkte — entschieden

- **K1 Zielanspruchs-Band:** **80 %** (nicht 90 %). Niveaubänder: **unter 60 % / 80 % / 100 %**.
- **K2 Rubrik-Stufenskala:** **1–4** (1 = tiefste) — rubrik-interne Kriteriumsskala.
- **K3 Band «unter 60 %»:** **bleibt**; die 3-Band-Tabelle ist gültig.

Diese Werte stehen bereits so in den `kn.json`-Dateien (`rubrik_shared.niveaubaender` + `kriterien[].stufen[]`); Begleiter und JSON sind konsistent.

### 8.3 Kapitel «Anhang — Quellen» — entfällt

Das Kapitel **«Anhang — Quellen dieses Dokuments» wurde in allen Begleitern entfernt** und ist in TEIL 1 nicht mehr Pflicht. Die Quellenangabe ist über das Frontmatter (`quellen_json`) und die Lehrmittel-Anker (Kap. 1) abgedeckt; eine Doppelung am Dokumentende ist unnötig.

### 8.4 Callout-Rendering & Farbpalette

Alle zehn Callout-Typen sind in **beiden** Render-Pfaden implementiert: dem Word-Export (`src/lib/einheiten/begleiter-builder.ts`, `CALLOUT_LABELS` + `CALLOUT_COLORS`) **und** der HTML-Ansicht (`src/pages/einheiten/[setKey]/begleiter.astro` + `src/styles/einheiten-begleiter.css`). Vorher kannte nur der Word-Pfad die vier v2-Callouts — in der HTML-Ansicht erschienen sie als rohe `[!typ]`-Blockquotes ohne Farbe. Die vier v2-Callouts haben jetzt eigene, klar unterscheidbare Farben (identisch in Word und HTML):

| Callout | Rahmen (bd) | Hintergrund (bg) | Farbfamilie |
|---|---|---|---|
| `erwartungshorizont` | `#A12061` | `#FBE7F1` | Magenta/Rosé |
| `troubleshooting` | `#C2611A` | `#FCE9D8` | Orange |
| `tafelbild` | `#1E5E45` | `#E4EDE8` | Tafel-Grün |
| `ki_einsatz` | `#5B3FD6` | `#ECEAFA` | Indigo |

(Die `erwartungshorizont`-Farbe wurde bewusst von einem zu hinweis-ähnlichen Marineblau auf Magenta geändert, damit sich die zehn Typen optisch sauber unterscheiden.)

### 8.5 Word-Export-Bugfix

Im `begleiter-builder.ts` fehlte beim Logo-`ImageRun` das Feld `type: 'png'`. Dadurch wurde das eingebettete Bild als `…​.undefined` abgelegt, für das es keinen Content-Type gibt — Word meldete beim Öffnen «nicht lesbarer Inhalt» und liess die Datei nur im Wiederherstellen-Modus öffnen (als unbenanntes «Dokument1»). Behoben: Die Begleiter-Word-Dateien öffnen wieder regulär unter ihrem Namen.

### 8.6 Struktur-Parität der drei Begleiter

Alle drei EFZ-3J-Begleiter haben jetzt **dasselbe Kapitel- und Subkapitel-Gerüst** (Kap. 0–8 gemäss TEIL 1, mit den v2-Bausteinen aus TEIL 6 pro Herausforderung). Verbleibende Unterschiede sind rein inhaltlich (Kapitel-Untertitel, Anzahl `[!erwartungshorizont]`-Callouts je nach Zahl der KN-Prüffragen der Einheit).

---

**Ende Spezifikation v2.1.**

Die drei Klärungspunkte aus **TEIL 4** sind entschieden (siehe TEIL 8.2) und in die Begleiter eingearbeitet. Nächster Schritt: Einarbeitung der gesamten Spec (TEIL 1–8, mit TEIL 8 als verbindlichem As-built-Stand) in den `hko-einheits-begleiter` Skill als Template-Contract.
