# Language Rules — Swiss Standard German + ICH-Perspektive

Sprachregeln für Skill 2. Gilt für alle generierten Strings in `kn.json`, `kn_rubric.json` und `kn_teacher.html`.

---

## 1. Eszett — niemals

**Regel:** Kein Eszett-Zeichen (`ß`) in den Outputs. Immer Doppel-s („ss").

| Schweizerisch (richtig, im JSON/HTML) | Deutsche Variante (verboten) |
|---|---|
| Strasse | Straße |
| muss | muß (alt) / muss (neu — auch CH-konform) |
| gross | groß |
| heisst | heißt |
| ausser | außer |
| Spass | Spaß |
| Massnahme | Maßnahme |
| Schluss | Schluß (alt) / Schluss (neu — auch CH-konform) |
| weiss | weiß |
| Begründung | Begründung (keine ß-Buchstaben — unverändert) |

**Auto-Korrektur:** Wenn Eszett im Output gefunden wird, transliteriert Skill 2 automatisch zu „ss" und loggt `ERR_ESZETT_FOUND` mit Position.

**Edge case Eigennamen:** Auch in Eigennamen Eszett ersetzen — Pietro's Kontext ist Schweizer Schul-Material, keine Zitate aus deutschen Quellen.

---

## 2. Umlaute — Pflicht in Prosa, transliteriert in IDs

**Regel (verbindlich, v1.4):** Echte Umlaute `ä/ö/ü/Ä/Ö/Ü` sind in allen
Prosa-Feldern PFLICHT. Transliteration (`ae/oe/ue/Ae/Oe/Ue`) in Prosa ist ein
Bug, kein zulässiger Stil. Auto-Fix gemäss
`_common_misspellings.md` Section „Pauschal-Transliterations-Fixes".

| Kontext | Umlauten | Beispiel |
|---|---|---|
| Prosa-Text (situation_text, leitfragen, etc.) | **JA, Pflicht nativ** | „Ich überlege, ob ich den Schuh kaufe." (NICHT „ueberlege") |
| `persona.beruf`, `persona.ort` | **JA, aus kanonischer Tabelle** | „Bäcker-Konditor-Confiseur/in EFZ", „Zürich" |
| Enum-Werte / kontrollierte Werte | ja, wenn semantisch bedeutsam | `"mündlich_mit_kurznotiz"` |
| HTML sichtbarer Text | **JA, Pflicht nativ** | `<h2>Prüfungsablauf</h2>` (NICHT „Pruefungsablauf") |
| IDs (id, topic_slug, kn_anchor_ref) | NEIN, transliteriert | `werbewirkung_analyse`, `pruefungsablauf_kurz` |
| Filenames | NEIN, transliteriert | `1.1.1_identitaet_lernorte_sit_A.json` |
| HTML-Class-Names | NEIN, transliteriert | `class="kn-bewertungs-hinweis"` |
| Keys in JSON | NEIN, transliteriert | `"konkretisierungsfragen_pool"` |

**Transliterations-Tabelle für IDs:**

| Umlaut | Transliteriert |
|---|---|
| ä | ae |
| ö | oe |
| ü | ue |
| Ä | Ae |
| Ö | Oe |
| Ü | Ue |

Aber: In **Werten** wie `pruefling_modus: "mündlich_mit_kurznotiz"` bleibt der Umlaut, weil der Wert prosa-nah ist (kein Filename, keine Cross-Referenz).

---

## 2b. Gendern — Schrägstrich-Form (Reform 2026-06)

**Regel:** Generische Rollennomen im sichtbaren Prosa-Text werden mit **Schrägstrich gegendert, beide Endungen in einem Wort**. **Kein Schrägstrich-Bindestrich** (`Lehrer/-in` ist falsch).

| Generisch (Quelle) | Schrägstrich-Form (Ziel) |
|---|---|
| Berufsbildner / Berufsbildners | Berufsbildner/in |
| Lehrer | Lehrer/in |
| Mitarbeiter | Mitarbeiter/in |
| Arbeitnehmer / Arbeitgeber | Arbeitnehmer/in · Arbeitgeber/in |
| Lernender (Einzahl, mask.) | Lernende/r |
| Mitlernender (Einzahl, mask.) | Mitlernende/r |
| Vorgesetzter | Vorgesetzte/r |
| Schüler | Schüler/in |
| Chef / Chefs | Chef/in |

**Nur die generische Einzahl gendern.** Neutrale Partizip-Plurale sind bereits geschlechtsneutral und bleiben unverändert: `die Lernenden`, `die Mitarbeitenden`, `die Vorgesetzten`.

**Nicht anfassen (sonst wird Korrektes kaputtgemacht):**

- `persona.beruf` — steht bereits als offizielle Slash-Form (`Schreiner/in EFZ`, `Polymechaniker/in EFZ`).
- Bereits explizit gepaarte Formen — `mit einer Kollegin/einem Kollegen`, `einer Partnerin/einem Partner`.
- Feste Methoden-/Fachbegriffe — `Expertengruppe`, `Expertenrunde`, `Partnerarbeit`, `Partnerperson`.
- Komposita, in denen das Rollennomen nicht der Kopf ist — `Kunden-WhatsApp`, `Kundengespräch`, `Mitarbeitergespräch`.
- `X/Y`-Paarungen wie `Berufsbildner/Werkstattleitung` (kein doppeltes `/in` einsetzen).
- Keys, IDs, Dateinamen.

**Artikel/Pronomen bleiben unverändert** — gegendert wird nur das Substantiv. `mein Berufsbildner/in`, `Ihr Berufsbildner/in`, `als Lernende/r`. Das Gendern von Artikeln/Pronomen (`der/die`, `sie/er`) ist bewusst nicht Teil dieser Regel (sonst Satzumbau statt Wort-Ersetzung).

**Compound-Suffix:** In `Beruf-Lernender`-Komposita nur das Suffix gendern: `Schreiner-Lernender` → `Schreiner-Lernende/r` (der Berufs-Modifikator bleibt).

---

## 3. ICH-Perspektive — verbindlich

Alle Aufgaben-Texte sind in der **ICH-Perspektive** aus der konkreten Lernenden-Rolle. Nicht „die Lernenden sollen…", nicht „der/die Kandidat/in muss…".

### Korrekt vs. Falsch — Beispiele

**situation_text:**

| Falsch (Distanz) | Richtig (ICH, 1. Person Singular) |
|---|---|
| „Die Lernenden sehen einen Werbeclip." | „Ich schaue mit meiner Klasse einen Werbeclip." |
| „Der Kandidat soll das Bedürfnis analysieren." | „Ich analysiere das Bedürfnis, das der Clip in mir auslöst." |
| „Es ist wichtig zu erkennen, dass…" | „Ich merke, dass…" |

> **Grammatische Ich-Form (Reform 2026-06):** `situation_text` und `handlungsprodukt.beschreibung` sind in der **1. Person Singular** geschrieben („Ich bin…", „ich verdiene…") — konsistent mit der KN-`hybrid_situation.text`, dem Lebensbezug und `kern_kompetenzversprechen`. Aufträge/Leitfragen bleiben im Imperativ; zitierte Rede anderer Personen bleibt unverändert.

**fragestellung:**

| Falsch | Richtig |
|---|---|
| „Die Lernenden sollen folgende Optionen abwägen:" | „Sie haben zwei Optionen: … . Welche wählen Sie und warum?" |
| „Wie sollte der Lernende reagieren?" | „Wie reagieren Sie?" |
| „Es muss begründet werden, warum…" | „Begründen Sie, warum Sie …." |

**bewertungs_hinweis (PEX-Notiz):**

- ICH-Perspektive gilt NICHT — der Hinweis spricht die PEX an, nicht die Lernende.
- Form: 2. Person Singular (du) ODER unpersönlich.
- Beispiel: „Honoriere die Differenzierung zwischen den Lesarten." oder „Beobachten: nennt die Lernende beide Pole?"

**konkretisierungsfragen_pool:**

- Fragen werden VON der PEX an die Lernende gestellt.
- Sie-Form (höflich, distanziert) oder Du-Form (egalitär) — Pietro-Präferenz: **Sie-Form** (Prüfungsregister).
- Beispiel: „Können Sie das genauer begründen?" — NICHT „Kannst du das genauer begründen?"

**leitfragen im Rubric (Bewertungs-Fragen):**

- Form: 3. Person Singular präsens, prüft die Lernende von aussen.
- Beispiel: „Benennt die Lernende beide Lesarten des Spannungsfelds sprachlich präzise?"
- NICHT in ICH-Form, NICHT in Sie-Form an die Lernende.

---

## 4. Du-Form vs. Sie-Form — Kontext-Regel

| Wer spricht | An wen | Form | Kontext |
|---|---|---|---|
| Situation (Narrativ) | Lernende | **Ich** (1. Ps. Sg.) | situation_text, handlungsprodukt.beschreibung, dekontextualisierung.frage |
| Auftrag / Leitfrage | Lernende | **Sie** (Höflichkeits-Imperativ) | leitfragen[], handlungsprodukt.schritte, KN-Aufgaben |
| PEX | Lernende | **Sie** | konkretisierungsfragen_pool, ci_variante.fragestellung wenn als PEX-Frage formuliert |
| Anleitung | LP | **Sie** | Teacher-HTML Setup-Anleitung |
| Rubric | LP | unpersönlich / 3. Person | Leitfragen im Rubric |
| Beobachter | LP über Lernende | 3. Person | bewertungs_hinweis (kann auch Du-Form sein als interne LP-Notiz) |

**Anrede-Grundsatz (Reform 2026-06):** Die Lernenden werden mit **Sie** angesprochen (Höflichkeitsform). **Kein `du/dein/dich/dir`** in Aufträgen, Leitfragen, Hinweisen, KN-Aufgaben oder SuS-gerichteten Begleiter-Texten. Ausgenommen und unverändert: (a) narrative ICH-Texte (`situation_text`, `handlungsprodukt.beschreibung`, `hybrid_situation.text`) — 1. Person Singular; (b) **zitierte Rede** anderer Personen (z. B. eine WhatsApp des Berufsbildner/in) — bleibt wörtlich; (c) Meta-Erwähnungen über die Du-Form selbst (z. B. „Du-Form vermeiden"). Beim Umstellen die **Verbformen** mitanpassen, nicht nur das Pronomen.

**Wichtig:** Die narrative Prosa (`situation_text`, `handlungsprodukt.beschreibung`) steht grammatisch in der **1. Person Singular (Ich)** — wie die KN-`hybrid_situation.text`, der Lebensbezug und `kern_kompetenzversprechen`. Aufträge (`leitfragen[]`, `handlungsprodukt.schritte`) bleiben im **Imperativ**. Zitierte Rede anderer Personen (z. B. eine WhatsApp des Berufsbildners) bleibt unverändert in ihrer Originalform.

---

## 5. Verbotene Phrasen

### 5.1 Distanzierende Formulierungen

```
„Es ist wichtig zu …"
„Es ist notwendig, dass …"
„Die Lernenden sollten …"
„Der/die Kandidat/in muss …"
„Man sollte beachten …"
```

→ Ersetze durch ICH-Form-Konstruktionen.

### 5.2 Servile/Filler-Phrasen

```
„Tolle Frage!"
„Hervorragend gewählt!"
„Eine spannende Herausforderung!"
„Ich freue mich, dir zu helfen."
```

→ Im KN-Material niemals. PEX und Lernende erwarten neutral-präzisen Ton.

### 5.3 Über-Abstrahierende Formulierungen

```
„im Allgemeinen ist es so, dass …"
„grundsätzlich kann man sagen, dass …"
„es lässt sich festhalten, dass …"
```

→ Wenn der Inhalt allgemein ist, direkt formulieren. Wenn er konkret sein muss, KEINE Allgemein-Floskel vorschalten.

### 5.4 Anglizismen / Lehnwort-Probleme

```
"das Setting" → besser: „die Herausforderung", „der Kontext"
"das Mindset"  → besser: „die Haltung", „die Einstellung"
"der Trade-off" → in Prosa NICHT verwenden → „der Zielkonflikt" oder „das Spannungsfeld"
"der Case" → ABU-Standard ist „Fall" oder „Praxisfall"
"die Story" → besser: „die Geschichte", „der Verlauf"
"das Feedback" → besser: „die Rückmeldung"
```

**Trade-off → Zielkonflikt / Spannungsfeld (verbindlich, NEU).** Der Anglizismus
„Trade-off" ist für Lernende schwer nachvollziehbar und darf in **sichtbarer Prosa
nicht mehr** vorkommen. Er ist die englische Operationalisierung der Schlüssel-
kompetenz **SK11 „Mehrdeutigkeit"** (nRLP: „Mit Mehrdeutigkeiten und Komplexität
umgehen"). In jeder gerenderten Prosa wird er durch einen der beiden deutschen
Begriffe ersetzt:

- **Spannungsfeld** — wenn die Spannung / der Raum selbst gemeint ist („das
  Spannungsfeld zwischen X und Y", „beide Pole des Spannungsfelds"). Deckt sich mit
  dem bestehenden Renderer-Callout **SPANNUNGSFELD** (DocS / docx-builder) und ist
  der Default für das `mehrdeutigkeit.trade_off`-Feld auf Seite 1.
- **Zielkonflikt** — wenn der Konflikt als benenn-/entscheidbares Ding gemeint ist
  („den Zielkonflikt benennen", „drei Zielkonflikte spannen das Set auf", „der
  zentrale Zielkonflikt"). Bevorzugt dort, wo gezählt, benannt oder begründet
  entschieden wird.

**Code-vs-Prosa-Trennung (zwingend):** Diese Regel betrifft **nur sichtbaren Text**.
JSON-Keys (`trade_off_raum`, `mehrdeutigkeit.trade_off`, `aktivierte_trade_offs`,
`must_activate_trade_offs_min`, `additional_trade_offs`), Fehler-/Warncodes
(`ERR_HYBRID_NO_TRADE_OFF`, `WARN_TRADE_OFF_UNUSED`, `ERR_TRADE_OFF_MAPPING_INCONSISTENT`
…) und die Coherence-Check-Mechanik behalten den internen Bezeichner `trade_off` —
diese werden **niemals** umbenannt, sonst bricht Renderer / Index-Build / Validierung.
Die **Werte** des Feldes `mehrdeutigkeit.trade_off` (Form „X vs. Y") bleiben ebenfalls
unverändert; ersetzt wird nur das Wort „Trade-off", wo es als Begriff im Fliesstext steht.

Andere Anglizismen ebenfalls vermeiden.

### 5.5 Wertende Sprache in der Bewertung

```
„Falsch."        → besser: „Weicht von der Musterlösung ab."
„Schlecht."      → besser: konkrete Beobachtung was fehlt
„Sehr gut!"      → besser: konkrete Beobachtung was gelungen ist
„Nicht genügend" → in Schul-Notenkontext OK, aber im Rubric-Level-Text vermeiden
```

---

## 6. Schweizer Konventionen — Begriffe

| Schweiz | Deutschland (vermeiden) |
|---|---|
| Lehre / Berufslehre | Ausbildung |
| Lehrling / Lernende | Auszubildende/r, Azubi |
| Lehrbetrieb | Ausbildungsbetrieb |
| Lehrvertrag | Berufsausbildungsvertrag |
| Lehrmeister/in | Ausbilder/in (selten in CH) |
| ABU (Allgemeinbildender Unterricht) | (kein Pendant in DE) |
| EFZ (Eidg. Fähigkeitszeugnis) | (Schweizer Spezifikum) |
| EBA (Eidg. Berufsattest) | (Schweizer Spezifikum) |
| Berufsschule / Berufsfachschule | Berufsschule (gleich, aber Kontext beachten) |
| Velo | Fahrrad |
| Tram | Strassenbahn |
| Quartier | Stadtviertel |
| Coiffeur | Friseur |
| parkieren | parken |
| Trottoir | Bürgersteig |
| Billett | Fahrkarte |
| Couvert | Briefumschlag |
| Spital | Krankenhaus |

Skill 2 verwendet Schweizer Begriffe — auch wenn die LLM-Trainingsdaten deutsch lasten. Bei Unsicherheit: Schweizer Variante.

---

## 7. CHF-Formate (Wiederholung aus hko-framework.md)

| Format | Beispiel | Verwendung |
|---|---|---|
| Ganzzahl | `CHF 850` | Lohn, runder Preis |
| Mit Rappen | `CHF 179.90` | Preis mit Rappen |
| Range | `CHF 700–1200` | Bereich (en-dash, kein Hyphen) |
| Tausender | `CHF 12'500` | Apostroph als Tausenderzeichen |

**Auto-Korrektur:** Skill 2 erkennt `CHF 12,500` (Komma) und `CHF 12.500` (Punkt als Tausender) und korrigiert zu Schweizer Format mit Apostroph.

---

## 8. Konkretisierungsfragen — Stil-Regeln

Pflicht-Fokus: **Argumentationstiefe**, nicht Faktenwiedergabe.

### Gute Konkretisierungsfragen (Argumentationstiefe)

```
„Können Sie das genauer begründen?"
„Was wäre das stärkste Gegenargument zu Ihrer Position?"
„Welche Lesart der Herausforderung haben Sie nicht gewählt — und warum nicht?"
„Was würden Sie der anderen Lesart entgegenhalten?"
„Wo liegt die Grenze Ihrer Position?"
„Wenn die Herausforderung X anders wäre, würde Ihre Antwort gleich bleiben?"
„Welches Argument trägt Sie zu welcher Lesart?"
```

### Schlechte Konkretisierungsfragen (Faktenwiedergabe)

```
„Was sind die fünf Bedürfnisstufen nach Maslow?"          ← Reproduktion
„Wie heisst die Methode noch?"                            ← Begriffsabfrage
„Können Sie den Begriff X definieren?"                    ← K1-Frage
„Welche Quellen haben Sie verwendet?"                     ← banal
„Was steht im Lehrmittel zu diesem Thema?"                ← Schul-Wiedergabe
```

**Heuristik:** Gute Konkretisierungsfragen führen die Lernende zu einer **vertieften Begründung** ihrer bestehenden Antwort. Schlechte holen Faktenwissen nach.

---

## 9. Spannungsfeld-Hint (`mehrdeutigkeit.hint`) — Stil-Regeln

Der `trade_off_hint` pro Fall macht beide Pole sichtbar. Form: 1-2 Sätze, ICH-Form oder Sie-Form, konkret.

### Gute Spannungsfeld-Hints

```
„Der Clip wirkt — aber das macht das Bedürfnis nicht automatisch unecht.
 Halten Sie beide Lesarten sichtbar."

„Eine schnelle Antwort kann gut sein, aber sie kann auch ein wichtiges 
 Argument übersehen. Beide Positionen sind vertretbar."

„Sponsored Content ist nicht zwangsläufig Manipulation, aber er ist auch 
 nicht neutrale Information. Wo liegt Ihre Grenze?"
```

### Schlechte Spannungsfeld-Hints

```
„Sei dir bewusst, dass es zwei Sichtweisen gibt."          ← banal
„Beide Optionen können richtig sein."                      ← inhaltsleer
„Argumentiere abgewogen."                                  ← Anweisung, kein Hint
```

**Heuristik:** Ein guter Spannungsfeld-Hint benennt beide Pole **konkret und kurz**, ohne der Lernenden die Wahl abzunehmen.

---

## 10. Bewertungs-Hinweis — Stil-Regeln

Max 150 Zeichen, 1-2 Sätze. Adresse: PEX (intern, neutrale Form OK).

### Gute Bewertungs-Hinweise (≤150 Zeichen)

```
„Honoriere die Differenzierung zwischen den zwei Lesarten, nicht die Wahl."
                                                        (76 Zeichen)

„Quellen-Mobilisierung honorieren, auch wenn Schluss knapp."
                                                        (61 Zeichen)

„Rechen-Fehler im Detail dulden, wenn Zielkonflikt erkannt wurde."
                                                        (70 Zeichen)

„Berufs-Transfer-Versuch honorieren, auch wenn fachsystematisch noch unscharf."
                                                        (80 Zeichen)
```

### Schlechte Bewertungs-Hinweise

```
„Es ist wichtig, dass die Lernende beide Pole des Spannungsfelds sieht und sie 
 fachlich präzise benennt, weil sonst SK11 nicht demonstriert wird."        ← zu lang, distanzierend

„Gut bewerten, wenn alles stimmt."                                          ← inhaltsleer
```

**Heuristik:** Ein guter Hinweis benennt EINE spezifische Bias-Gefahr und sagt der PEX, wie sie zu reagieren ist.

---

## 11. Standard-Einleitungstext (PHZH-Wortlaut)

Wörtlich in Teacher-HTML:

> „Wir führen heute einen Kompetenznachweis durch. Sie ziehen drei Karteikarten, lesen die Herausforderung und die Fragestellung, haben 2 Minuten zur Vorbereitung mit Kurznotizen und schildern dann mündlich Ihre Analyse und Ihr Vorgehen. Die Prüfungszeit pro Fall ist 10 bis 15 Minuten. Ich kann Konkretisierungsfragen stellen, wenn etwas unklar bleibt."

**Anpassungs-Regel:** Wenn `pruefung_setup.modus == "schriftlich"`, wird der Text angepasst:

> „Wir führen heute einen Kompetenznachweis durch. Sie ziehen drei Karteikarten, lesen die Herausforderung und die Fragestellung und bearbeiten jede Aufgabe schriftlich. Die Prüfungszeit pro Fall ist 10 bis 15 Minuten."

Konkretisierungsfragen-Satz fällt bei schriftlich-Variante weg.

---

## 12. Auto-Korrektur-Whitelist (sprachlich)

Skill 2 darf still korrigieren bei:

1. Eszett → ss
2. CHF-Format-Normalisierung
3. Tippfehler in Persona-Namen wenn eindeutig (z.B. `Polmechaniker` → `Polymechaniker`)
4. Bindestrich vs. en-dash bei Zahl-Ranges
5. Schweizer Begriffe wenn deutsche Variante erkannt (z.B. `Auszubildende` → `Lernende`)
6. **Umlaut-Restitution in Prosa-Feldern** (v1.4): `ae/oe/ue` → `ä/ö/ü` gemäss Pauschal-Tabelle in `_common_misspellings.md`. Whitelist Eigennamen (Aarau, Olten, etc.) wird respektiert.

Skill 2 korrigiert NICHT still bei:

- ICH-Perspektive-Verletzungen (WARN, kein Auto-Fix)
- Verbotene Filler-Phrasen (WARN, kein Auto-Fix)
- Konkretisierungsfragen-Stil (WARN_KONKRETISIERUNG_GENERIC)
- Bewertungs-Hinweis-Länge über 150 (WARN, kein Auto-Cut)

Bei WARN: Skill 2 zeigt im Output-Report, Pietro reviewt.

---

## 13. Quick-Check vor Output-Schreibe

```
□ Kein Eszett (auto-fix erlaubt)
□ Umlaute Pflicht in Prosa/Werten (ä/ö/ü nativ — kein ae/oe/ue)
□ persona.beruf + persona.ort exakt aus kanonischer Tabelle (mit Umlauten)
□ IDs / topic_slug / Filenames bleiben transliteriert
□ situation_text in ICH-Form; Aufträge/Leitfragen/Hinweise in Sie-Form (kein du/dein)
□ konkretisierungsfragen_pool in Sie-Form
□ Rubric-leitfragen in 3. Person Singular
□ Keine Filler-Phrasen ('tolle Frage', 'hervorragend')
□ Keine Distanzierungs-Phrasen ('die Lernenden sollten')
□ Schweizer Begriffe (Lehre, Lernende, Lehrbetrieb)
□ Generische Rollennomen gegendert (Schrägstrich: Berufsbildner/in, Lernende/r) — Plurale & persona.beruf unverändert
□ CHF-Format: Apostroph + en-dash
□ Spannungsfeld-Hint benennt beide Pole konkret
□ bewertungs_hinweis ≤ 150 Zeichen
□ Standard-Einleitungstext wörtlich übernommen
```

Diese Checks sind Pflicht. Bei Verletzung: ERR oder WARN je nach Schwere — siehe `error-codes.md`.
