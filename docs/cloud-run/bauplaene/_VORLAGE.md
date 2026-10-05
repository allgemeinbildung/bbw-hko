# Bauplan — <ordnername>

Format v4.2 (zwei Hefte A/B, gemeinsamer Auftrag, KN). Alle Entscheide, die
sonst ein Mensch während der Generierung trifft. Lokal vorbereitet mit der
Skill `bbw-hko-heft-v42` (Phasen 0, 1, Q) und von Pietro freigegeben; der
unbeaufsichtigte Lauf führt ihn aus und ändert keinen Entscheid. Kopieren
nach `docs/cloud-run/bauplaene/<ordnername>.md`.

**Kein Lehrmitteltext, kein Transkript, kein Artikeltext in dieser Datei** —
nur Kapitel, Seite, Fundstelle und eigene Formulierungen. Sie liegt im
öffentlichen Repo.

**Je Entscheid:** «empfohlen» (gilt), ein Satz «Herleitung» (woraus: Feld im
nRLP-Datensatz, Verb der Kompetenz, Seite, Regel) und «Alternativen»
(höchstens zwei, oder «keine»). Kein Wert stammt aus einer anderen Einheit.

**Freigabe:** offen

<!-- Bei Freigabe ersetzt die Skill das Wort «offen» durch «freigegeben am»
und das Datum in Ziffern, Form JJJJ-MM-TT. Die Zeile beginnt genau wie oben;
scripts/cloud-preflight.mjs liest sie. -->

## 1. Verortung

| | |
|---|---|
| Ordnername | `X.Y.Z_slug` — X.Y.Z = erste Kompetenz von Heft A; nach dem ersten Druck fest |
| IDs | `<ordner>_hf_A` · `_hf_B` · `_set` · `_kn` · `_prinzip` |
| `topic_slug` | slug des Ordners ohne Nummer und ohne Lehrgang-Suffix |
| `einheit_titel` | der Fokus als Titel, ohne Versionszusatz — gleichnamige Einheit im Index (`src/data/einheiten.index.json`, Feld `einheit_titel`): nein / ja → Zusatz in Klammern |
| `modul` / `modul_titel` | `X.Y` / «<Titel des Themas> — <Fokus in zwei bis vier Wörtern, Kleinschreibung nach dem Gedankenstrich>» |
| Lehrgang (kanonisch) | EFZ_3J / EFZ_4J — Datensatz `public/nrlp_….json` |
| Weitere Lehrgänge | — (nur wenn jede Kompetenz dort nummern- und textgleich ist; geprüft am JJJJ-MM-TT) |
| Thema | T… — Titel · Lehrjahr |
| Lebensbezug | X.Y — Wortlaut aus dem Datensatz |
| Heft A: Kompetenz | X.Y.Z — Wortlaut aus dem Datensatz |
| Heft B: Kompetenz(en) | X.Y.Z (+ X.Y.Z) — Wortlaut aus dem Datensatz |
| Nicht abgedeckte Kompetenzen des Lebensbezugs | — |
| Sprachmodi je Kompetenz | X.Y.Z: … · X.Y.Z: … (Kompetenz-Ebene, wörtlich) |
| SK des Themas | Nr. Bezeichnung (Iteration) · … |
| Aspekte | Name wie im Datensatz (Iteration) · … |
| Fokus | ein Satz |
| Gesperrte Wörter (E24) | kein Treffer |

## 2. Lehrmittel

Kapitel aus der Crosswalk-Zeile (Lehrgang + Lebensbezug), Datei über den
exakten Namen. Je Zeile: was auf den Seiten steht, in eigenen Stichworten.

| Heft | Kapitel (Datei) | Seiten | Wofür (LF1 · LF2 · LF3 ohne Medien · Methode) | Am Text geprüft am |
|---|---|---|---|---|
| A | `<kap>_<Titel>.md` | aa–bb | | JJJJ-MM-TT |
| B | | | | |

- **Nicht belegt** (verlangt die Kompetenz, trägt das Lehrmittel nicht): …
- **Kapitel ausserhalb der Crosswalk-Zeile:** — (mit Begründung; Crosswalk
  vor dem Lauf nachführen)

## 3. Roter Faden

- **Kern-Kompetenzversprechen** — empfohlen: «Ich kann …»
  Herleitung: … · Alternativen: (1) … (2) …
- **Trade-off-Raum** (3–4, Form «X vs. Y») — empfohlen: … · … · …
  Herleitung: … · Alternativen: …
- **Anker** (Transfer-Anker: das Prinzip in einem Satz, ohne Fall) — empfohlen: …
- **`verbindlich`** (Satz der Mehrdeutigkeit: hält die Spannung offen, beide
  Seiten bleiben begründbar; wird `mehrdeutigkeits_pflicht` im KN) — empfohlen: …
- **Mindmap-Zentrum** (`mindmap_zentrum_kurz`, ≤ 40 Zeichen, gezählt: __) —
  empfohlen: … · Alternativen: …
- **SK Heft A** (drei) — empfohlen: Nr. · Nr. · Nr. — je SK die Stelle im Heft
- **SK Heft B** (drei) — empfohlen: Nr. · Nr. · Nr. — je SK die Stelle im Heft
- **SK KN-Schnittmenge** (drei) — empfohlen: Nr. · Nr. · Nr.
  Herleitung: gemeinsam in A und B: … · ergänzt um … (A) und … (B), weil der
  Hybrid-Fall … verlangt
- **Aspekte der Einheit** — Name (Iteration) · … · zusätzlich über eine
  Konfliktart: — (welcher, warum)

## 4. Hefte

Pro Heft genau eine Variante — die empfohlene. Alternativen stehen dahinter.

### Heft A — <Titel, ≤ 60 Zeichen>

- **Kompetenz:** X.Y.Z · Verben, die das Heft trägt: …
- **`herausforderung.label`** (eine Tätigkeit: Gegenstand + Verb in der
  Grundform): …
- **Konfliktart** («X vs. Y») — empfohlen: … · Alternativen: …
- **`mehrdeutigkeit.trade_off` des Hefts** — der **eine** Eintrag aus dem
  Trade-off-Raum (§3), den das Heft trägt, **wörtlich**: «…»
- **Lebensbereich des Hefts:** …
- **Handlungsprodukt** — empfohlen: `handlungsprodukt_typ` (Typ und Format in
  einer Zeile, kein «oder») … · Format (Umfang, Adressat, Dauer des Produkts) …
  Herleitung: Modus … + Verb «…» (+ `detail` der Kompetenz) · Alternativen: …
- **Produktbild-Art** (Hauptblock): Liste / Tabelle / Fliesstext / Wechselrede
  · weitere Blöcke: …
- **Legende des Produktbilds** (nur wenn das Produkt Markierungen verlangt;
  höchstens drei, je `key` in Kleinbuchstaben und Text ≤ 28 Zeichen): — / …
- **Situation in zwei Sätzen** (Ich-Form, neutrale Persona): …
- **Fallzahlen** (nur bei einem Fall mit Zahlen; erfunden, nachgerechnet,
  höchstens vier Zeilen Label · Wert): — / …
- **Leitfrage der Situation** (Ich-Form, benennt die Spannung, gibt keine
  Antwort vor): …
- **Schritte 01–05** (Stichworte; Schritt 03 nimmt auf, was LF3 liefert,
  Schritt 04, was LF4 liefert): 01 … · 02 … · 03 … · 04 … · 05 …
- **Abgaben** (Stichworte, mit Zahl und Menge): … · …
- **Sprachmodi, die das Heft führt** (Kompetenz-Ebene): … — je Modus die
  Stelle (S. 3 oder Produkt) · gestrichen: — (Grund) · auf S. 3 **geübt, nicht
  geführt:** — / Rezeption … (Modus des Themas)
- **Zulässige Spuren:** `ohne_medien` / `mit_medien` — Grund: …
- **Pol-Typ LF4:** ohne Medien … · mit Medien … — Herleitung: … ·
  Alternativen: …
- **KN-Kriterien** (1 SuK + 1 Ges): … (SuK) · … (Ges) — je Kriterium der Grund
- **Methodenkarten** (vier; genau zwei angereichert, die Rezeptionskarte
  zählt mit):

  | # | Ref (`src/data/methoden/`) | wofür | angereichert |
  |---|---|---|---|
  | 1 | | | |
  | 2 | Rezeptionskarte: ohne Medien `…` · mit Medien `…` | | |
  | 3 | | | |
  | 4 | | | |

- **«Das nehme ich mit»** (drei Zeilen, je ≤ 50 Zeichen): … · … · «Mir noch
  unklar» (dritte Zeile fest)

### Heft B — <Titel, ≤ 60 Zeichen>

Dieselben Punkte wie Heft A. Zusätzlich prüfen: Produkttyp ≠ A ·
Lebensbereich ≠ A · Pol-Typ ≠ A in derselben Spur · die zwei anderen
KN-Kriterien.

## 5. Kompetenznachweis

| # | Kriterium | Dimension | Heft | Herleitung des Namens |
|---|---|---|---|---|
| 1 | | SuK | | |
| 2 | | SuK | | |
| 3 | | Ges | | |
| 4 | | Ges | | |

- **Titel des KN-Falls** (`hybrid_situation.titel`; nennt den Fall, nicht die
  Lösung): …
- **Hybrid-Fall in drei Sätzen** (neu: anderer Gegenstand, andere Beteiligte,
  anderer Lebensbereich als A, B und Auftrag) — empfohlen: …
  Herleitung: verbindet Konfliktart A (…) und B (…), aktiviert … ·
  Alternativen: …
- **Lebensbereich des KN:** …
- **Fall-Begriffe — dem KN vorbehalten** (`fall_ausschluss_hefte_und_auftrag`; zwei bis fünf, je
  ab fünf Zeichen, nicht Teil gängiger Wörter, kein Kernbegriff der Hefte,
  sperren keine ganze Quellengattung): … · …
  **Dieser Abschnitt (§5) ist vom Fall-Ausschluss ausgenommen** — hier steht
  der Fall. In §4, §6 und §7 kommt keiner der Begriffe vor.
- **`modi_kn`:** … — Vereinigung der Modi der drei KN-Formen (Gerüst: in jeder
  Einheit gleich hergeleitet; Gleichheit mit anderen Einheiten ist kein Befund)

## 6. Gemeinsamer Auftrag

- **Titel des Auftrags** (`gemeinsamer_auftrag.titel`): …
- **Lebensbereich** (≠ A, ≠ B, ≠ KN) — empfohlen: … · Alternativen: …
- **Fall in zwei Sätzen** (Ich-Form; alles Nötige steht in der Situation, kein
  Medium; kein Gegenstand aus A, B oder KN): …
- **Aktivierte Spannungsfelder** (mindestens zwei, wörtlich aus §3): … · …
- **`mehrdeutigkeit.trade_off` des Auftrags** (die Spannung dieses Falls,
  Form «X vs. Y»): …
- **`modi_auftrag`:** … · …
  Herleitung: `modi_kn` […] − (A geführt […] ∪ B geführt […]) = […] ·
  Sonderfall: keiner / Differenz leer → … / mehr als zwei → … (Rest in §8 als
  Lücke)
- **Die fünf Schritte** (Stichworte; die ersten wenden je ein Werkzeug aus
  Heft A und aus Heft B an, zwei tragen die Produkte): 01 … · 02 … · 03 … ·
  04 … · 05 …
- **Abgaben** (höchstens drei: die zwei Produkte mit Form der Abgabe, die
  Selbsteinschätzung): … · … · …
- **Zwei Produkte** (`gemeinsamer_auftrag.produkte`):

  | Seite | Produkt (Typ und Format) | `modus` | `schritt` | `form` | bei `spur`: Stationen · Hinweis · Dauer |
  |---|---|---|---|---|---|
  | A2 | | | | `flaeche` / `spur` | |
  | A3 | | | | `flaeche` / `spur` | |

  Ein Rezeptionsmodus als `modus`: Das Produkt ist die sichtbare Auswertung
  eines Dokuments, das vollständig in der Situation steht; `form` `flaeche`.

- **Sozialform:** zulässig … — Grund: enthält (k)einen Interaktionsmodus ·
  Empfehlung (wird auf A1 gedruckt, an die Lernenden formuliert): …
- **`kontext_ausschluss`** (drei Einträge, Gegenstände der Fälle — keine
  Werkzeuge, keine Fachbegriffe): «… (Heft A)» · «… (Heft B)» · «… (KN)»

## 7. Quellen (nur Hefte mit Medien-Spur)

Lokal recherchiert und geprüft (Phase Q); Karten liegen vor dem Lauf unter
`src/data/quellen/`, Volltexte im Archiv ausserhalb des Repos. Der
unbeaufsichtigte Lauf recherchiert nicht.

| Slot | Quellen-ID | Typ (gesucht) | Titel · Herausgeber · Datum | Ausschnitt | Länge | Karte | Archivtext | Zugeständnis | Stand |
|---|---|---|---|---|---|---|---|---|---|
| A Quelle | `q-…a-pflicht` | | | | | ja / nein | ja / nein | | offen / geprüft am JJJJ-MM-TT |
| A Ersatz | `q-…a-pflicht-ersatz` | | | | | | | | |
| A Vertiefung 1 | `q-…a-vertiefung-1` | | | | | | | | |
| A Vertiefung 2 | `q-…a-vertiefung-2` | | | | | | | | |
| B Quelle | `q-…b-pflicht` | | | | | | | | |
| B Ersatz | `q-…b-pflicht-ersatz` | | | | | | | | |
| B Vertiefung 1 | `q-…b-vertiefung-1` | | | | | | | | |
| B Vertiefung 2 | `q-…b-vertiefung-2` | | | | | | | | |

- **Rasterspalten je Heft und Spur** (vier, je ≤ 18 Zeichen, die letzte
  «→ Begriff»; nach Typ der Grundlage): A ohne Medien … · A mit Medien … ·
  B ohne Medien … · B mit Medien … (hat das Heft die Spur nicht: «entfällt»)
- Typ = Rezeptionsmodus der Heft-Kompetenz; nennt sie keinen, der Modus des
  Themas mit der Ausweichfolge Audio → Video mit Untertiteln → Artikel. A und
  B möglichst verschieden.
- Fehlt bei «Quelle» Karte **oder** Archivtext, entsteht für dieses Heft nur
  die Spur ohne Medien. Ist die Spur ohne Medien für das Heft unzulässig
  (§4), ist die Einheit ohne diese Quelle nicht erzeugbar — dort ist auch die
  Ersatzquelle Pflicht (gleicher Typ oder gleicher Sprachmodus).
- Kein Ausschnitt enthält einen Fall-Begriff aus §5.

### Suchaufträge (nur im Entwurfsstand, vor Phase Q)

Solange ein Slot «offen» ist, steht hier je Slot, was die Quelle zeigen muss:
Fall in einem Satz · was Schritt 03 des Produkts von ihr braucht · Typ und
Höchstlänge · Ausschlüsse (Fall-Begriffe aus §5, gesperrte Wörter). Bei einem
Heft mit nur einer Spur bleibt die Situation in §4 themenneutral, bis die
Quelle gewählt ist; das Thema trägt Phase Q nach. Ist §7 gefüllt, entfällt
dieser Unterabschnitt.

## 8. Abdeckung

Dieselben Zeilen wie `references/kohaerenz.md` §3 der Skill (dort das Soll).

| # | Prüfung | Befund (wo geübt / erfüllt) | Lücke |
|---|---|---|---|
| A1 | jeder Modus aus `modi_kn` → Heft A, Heft B oder Auftrag | | |
| A2 | jeder geführte Modus eines Hefts → S. 3 (Rezeption) oder Produkt | | |
| A3 | Rezeption auf S. 3, die das Heft nicht führt → «geübt»; zweiter Rezeptionsmodus einer Kompetenz → «freiwillig geübt» | | |
| A4 | jeder Modus des Auftrags → mindestens ein Produkt | | |
| A5 | jeder Kompetenz-Modus des Lebensbezugs → geführt | | |
| A6 | jede SK des Themas → A, B oder KN | | |
| A7 | jede SK eines Hefts → Stelle im Heft | | |
| A8 | Produkttyp A ≠ B; jedes Produkt des Auftrags ≠ A, ≠ B | | |
| A9 | Lebensbereiche A, B, Auftrag, KN paarweise verschieden | | |
| A10 | KN-Kriterien: je Heft 1 SuK + 1 Ges, zusammen alle vier; Auftrag alle vier | | |
| A11 | Pol-Typ A ≠ B je Spur; Medien-Typen nur mit Medien | | |
| A12 | je Heft mindestens eine Spur; nur Medien-Spur → Quelle und Ersatzquelle vorhanden | | |
| A13 | Fall-Begriffe: kein Treffer in §4, §6, §7 | | |
| A14 | Vergleich mit 1.3.1: Modi des Auftrags, Produkttypen, SK nicht alle gleich (`modi_kn` zählt nicht) | | |

Eine Lücke ist erlaubt, wenn sie hier steht. Eine leere Zeile ist ein Befund.

## 9. Ausnahmen und Hinweise

Alles, wofür die Skill sonst anhalten würde: Lehrmittel-Abschnitt für LF3
über mehr als drei Seiten · neue Methodenkarte nötig (mit Grund) · Modus
gestrichen · Abweichung von einer Regel · bekannte Stolpersteine im Kapitel ·
was nicht belegt oder nicht geprüft ist.

**Ausnahmen von einer Ableitungsregel** stehen hier ausdrücklich, je mit der
Regel, dem abweichenden Wert und dem Grund — etwa: abweichender Ordnername ·
Quellen-IDs einer anderen Einheit · SK ausserhalb des Themas · Kapitel
ausserhalb der Crosswalk-Zeile. Was hier steht, gilt im unbeaufsichtigten
Lauf; was hier fehlt, macht den Bauplan dort «nicht erzeugbar».
