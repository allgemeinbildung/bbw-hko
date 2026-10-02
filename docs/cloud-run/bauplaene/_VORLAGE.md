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
- **Konfliktart** («X vs. Y») — empfohlen: … · Alternativen: …
- **Lebensbereich:** …
- **Handlungsprodukt** — empfohlen: Typ … · Format (Umfang, Adressat, Dauer) …
  Herleitung: Modus … + Verb «…» (+ `detail` der Kompetenz) · Alternativen: …
- **Produktbild-Art** (Hauptblock): Liste / Tabelle / Fliesstext / Wechselrede
- **Situation in zwei Sätzen** (Ich-Form, neutrale Persona, Stufe 1 oder 2): …
- **Sprachmodi, die das Heft führt:** … — je Modus die Stelle (S. 3 oder
  Produkt) · gestrichen: — (Grund)
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

- **«Das nehme ich mit»** (drei Zeilen, je ≤ 50 Zeichen): … · … · …

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

- **Hybrid-Fall in drei Sätzen** (neu: anderer Gegenstand, andere Beteiligte,
  anderer Lebensbereich als A, B und Auftrag) — empfohlen: …
  Herleitung: verbindet Konfliktart A (…) und B (…), aktiviert … ·
  Alternativen: …
- **Lebensbereich des KN:** …
- **Fall-Begriffe — dem KN vorbehalten** (`fall_ausschluss_hefte_und_auftrag`; zwei bis fünf, je
  ab fünf Zeichen, nicht Teil gängiger Wörter, kein Kernbegriff der Hefte,
  sperren keine ganze Quellengattung): … · …
- **`modi_kn`:** … — Herleitung: Vereinigung der Modi der drei KN-Formen

## 6. Gemeinsamer Auftrag

- **Lebensbereich** (≠ A, ≠ B, ≠ KN) — empfohlen: … · Alternativen: …
- **Fall in zwei Sätzen** (Ich-Form; alles Nötige steht in der Situation, kein
  Medium; kein Gegenstand aus A, B oder KN): …
- **Aktivierte Spannungsfelder** (mindestens zwei aus §3): … · …
- **`modi_auftrag`:** … · …
  Herleitung: `modi_kn` […] − (A […] ∪ B […]) = […] · Sonderfall: keiner /
  Differenz leer → … / mehr als zwei → … (Rest in §8 als Lücke)
- **Zwei Produkte** (`gemeinsamer_auftrag.produkte`):

  | Seite | Produkt (Typ und Format) | `modus` | `schritt` | `form` | bei `spur`: Stationen · Hinweis · Dauer |
  |---|---|---|---|---|---|
  | A2 | | | | `flaeche` / `spur` | |
  | A3 | | | | `flaeche` / `spur` | |

- **Sozialform:** zulässig … — Grund: enthält (k)einen Interaktionsmodus ·
  Empfehlung: …

## 7. Quellen (nur Hefte mit Medien-Spur)

Lokal recherchiert und geprüft (Phase Q); Karten liegen vor dem Lauf unter
`src/data/quellen/`, Volltexte im Archiv ausserhalb des Repos. Der
unbeaufsichtigte Lauf recherchiert nicht.

| Slot | Quellen-ID | Typ | Titel · Herausgeber · Datum | Ausschnitt | Länge | Karte | Archivtext | Zugeständnis |
|---|---|---|---|---|---|---|---|---|
| A Quelle | `q-…a-pflicht` | | | | | ja / nein | ja / nein | |
| A Ersatz | `q-…a-pflicht-ersatz` | | | | | | | |
| A Vertiefung 1 | `q-…a-vertiefung-1` | | | | | | | |
| A Vertiefung 2 | `q-…a-vertiefung-2` | | | | | | | |
| B Quelle | `q-…b-pflicht` | | | | | | | |
| B Ersatz | `q-…b-pflicht-ersatz` | | | | | | | |
| B Vertiefung 1 | `q-…b-vertiefung-1` | | | | | | | |
| B Vertiefung 2 | `q-…b-vertiefung-2` | | | | | | | |

- Typ = Rezeptionsmodus der Heft-Kompetenz, sonst des Themas; A und B
  möglichst verschieden.
- Fehlt bei «Quelle» Karte **oder** Archivtext, entsteht für dieses Heft nur
  die Spur ohne Medien. Ist die Spur ohne Medien für das Heft unzulässig
  (§4), ist die Einheit ohne diese Quelle nicht erzeugbar.
- Kein Ausschnitt enthält einen Fall-Begriff aus §5.

## 8. Abdeckung

| Prüfung | Befund (wo geübt / erfüllt) | Lücke |
|---|---|---|
| jeder Modus aus `modi_kn` → Heft A, Heft B oder Auftrag | | |
| jeder Modus eines Hefts → S. 3 oder Produkt | | |
| jeder Modus des Auftrags → mindestens ein Produkt | | |
| jeder Kompetenz-Modus des Lebensbezugs → geführt | | |
| jede SK des Themas → A, B oder KN | | |
| Produkttyp A ≠ B; Produkte des Auftrags ≠ A, ≠ B | | |
| Lebensbereiche A, B, Auftrag, KN paarweise verschieden | | |
| KN-Kriterien: je Heft 1 SuK + 1 Ges, zusammen alle vier | | |
| Pol-Typ A ≠ B je Spur; Medien-Typen nur mit Medien | | |
| je Heft mindestens eine Spur; nur Medien-Spur → Quelle vorhanden | | |
| Fall-Begriffe: kein Treffer in §4, §6, §7 | | |
| Vergleich mit 1.3.1: Modi des Auftrags, Produkttypen, SK nicht alle gleich | | |

Eine Lücke ist erlaubt, wenn sie hier steht. Eine leere Zeile ist ein Befund.

## 9. Ausnahmen und Hinweise

Alles, wofür die Skill sonst anhalten würde: Lehrmittel-Abschnitt für LF3
über mehr als drei Seiten · neue Methodenkarte nötig (mit Grund) · Modus
gestrichen · Abweichung von einer Regel · bekannte Stolpersteine im Kapitel ·
was nicht belegt oder nicht geprüft ist.
