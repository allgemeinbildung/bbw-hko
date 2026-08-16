# HKO-Framework — Quelle der Wahrheit fuer die Skill

Kanonische Listen, Mappings und didaktische Modelle fuer die ABU Reform 2030. Diese Datei ist die Quelle der Wahrheit fuer alle Skill-Operationen — wenn etwas hier steht, gilt es. Bei Konflikt mit Training oder Memory: **diese Datei gewinnt**.

Quelle: `nrlp.json`, `rahmenlehrplan-allgemeinbildung-9-april-25.txt`, `ABU_ASSESSMENT_QUICK_REFERENCE_v2.md`.

---

## 1. Die 12 Schluesselkompetenzen (SK)

Kanonische Kurznamen aus `nrlp.json.zirkularitaet.schluesselkompetenzen[].bezeichnung`. **SK9 ist „Nachhaltigkeit", nicht „Vernetzt denken"** — das war ein Fehler in der v1-Skill.

| Nr | Kurzname | Volltext-Stichwort |
|----|----------|-----|
| 1 | Quellen unterscheiden | relevante vs. irrelevante Quellen und Inhalte unterscheiden |
| 2 | Ziele setzen und anpassen | adaptiv Zielsetzung pruefen |
| 3 | Innovation und Problemloesung | antizipativ, unternehmerisch handeln |
| 4 | Teamarbeit | in unterschiedlichen Teams zielgerichtet und effizient arbeiten |
| 5 | Werthaltungen reflektieren | eigene Werthaltungen erkennen und reflektieren |
| 6 | Standpunkte begruenden | eigene Standpunkte begruenden, andere ueberzeugen |
| 7 | Verstaendnis foerdern | Standpunkte anderer nachvollziehen, Verstaendigung foerdern |
| 8 | Lebensphasen planen | Lebensphasen planen, mit Unwaegbarkeiten umgehen |
| 9 | **Nachhaltigkeit** | vernetzt + systemisch + oekologisch/sozial/oekonomisch |
| 10 | Anpassung | sich im veraenderten Umfeld zurechtfinden |
| 11 | Mehrdeutigkeit | mit Mehrdeutigkeiten und Komplexitaet umgehen |
| 12 | Partizipation | gesellschaftliche Prozesse mitgestalten |

### SK-Text-zu-Nummer-Mapping

Wenn aus `nrlp.themen[].schluesselkompetenzen[]` ein voller Text gelesen wird (statt einer Nummer), wird er nach diesem Mapping in die Nummer aufgeloest:

| NRLP-Volltext (Stichwort-Anker) | SK |
|---|----|
| „Zwischen relevanten und irrelevanten Quellen und Inhalten unterscheiden" | 1 |
| „Sich selbst Ziele setzen … adaptiv verhalten" | 2 |
| „antizipativ … unternehmerisch handeln" | 3 |
| „In unterschiedlichen Teams zielgerichtet und effizient arbeiten" | 4 |
| „Eigene Werthaltungen … reflektieren" | 5 |
| „Ihre eigenen Standpunkte begruenden und andere davon ueberzeugen" | 6 |
| „Die Standpunkte anderer nachvollziehen" | 7 |
| „Ihre Lebensphasen planen … Unwaegbarkeiten" | 8 |
| „Vernetzt und systemisch denken … Nachhaltigkeit" | 9 |
| „Sich im veraenderten Umfeld zurechtfinden" | 10 |
| „Mit Mehrdeutigkeiten und Komplexitaet umgehen" | 11 |
| „Gesellschaftliche Prozesse mitgestalten" | 12 |

---

## 2. Die 9 Sprachmodi

Aus `nrlp.json.zirkularitaet.sprachmodi[].bezeichnung`. **Es sind 9, nicht 4 oder 6.** „Produktion multimedial" und „Rezeption audiovisuell" sind explizit Teil des Sets.

| Achse | Rezeption | Produktion | Interaktion und Kollaboration |
|---|---|---|---|
| **muendlich** | Rezeption muendlich | Produktion muendlich | Interaktion und Kollaboration muendlich |
| **audiovisuell** | Rezeption audiovisuell | — | — |
| **schriftlich und bildlich** | Rezeption schriftlich und bildlich | Produktion schriftlich und bildlich | Interaktion und Kollaboration schriftlich |
| **multimedial** | — | Produktion multimedial | — |
| **digital** | — | — | Interaktion und Kollaboration digital |

### Vollstaendige Liste (kanonisch fuer JSON-Felder)

```
1. Rezeption mündlich
2. Rezeption audiovisuell
3. Rezeption schriftlich und bildlich
4. Produktion mündlich
5. Produktion schriftlich und bildlich
6. Produktion multimedial
7. Interaktion und Kollaboration mündlich
8. Interaktion und Kollaboration schriftlich
9. Interaktion und Kollaboration digital
```

**Hinweis:** Im JSON die kanonische Schreibweise mit Umlauten (`mündlich`) verwenden, nicht die Transliteration. Nur in Identifiern (slugs, IDs) wird transliteriert.

---

## 3. Die 8 Aspekte (gesellschaftliche Inhalte)

Aus `nrlp.json.zirkularitaet.gesellschaftsinhalte[].bezeichnung`.

```
1. Ethik
2. Identität & Sozialisation
3. Kultur
4. Ökologie
5. Politik
6. Recht
7. Technologie und digitale Transformation
8. Wirtschaft
```

**Hinweis:** Im NRLP-JSON erscheinen zwei Schreibweisen — `Identität und Sozialisation` (in `kompetenz.gesellschaftliche_inhalte[].aspekt`) und `Identität & Sozialisation` (in `zirkularitaet.gesellschaftsinhalte[].bezeichnung`). In den Skill-Outputs durchgaengig **„Identität und Sozialisation"** verwenden.

---

## 4. Die 8 Themen

**Alle acht Themen sind vollstaendig ausgearbeitet** (finaler Erlass Bildungsrat
2026-06, `meta.themen_vollstaendig: 8` in jedem Datensatz). Kompetenzen, Aspekte
und Sprachmodi werden **nachgeschlagen, nie hergeleitet.**

Lehrjahr und Lektionen unterscheiden sich je Lehrgang — dieselbe Themen-Nummer
liegt im 3J und im 4J in verschiedenen Lehrjahren:

| Nr | Titel | LJ (3J) | L. (3J) | LJ (4J) | L. (4J) | Lebensbezuege 3J / 4J |
|----|-------|---------|---------|---------|---------|---|
| 1 | Ins Berufsleben einsteigen | LJ1 | 21 | LJ1 | 33 | 2 / 3 |
| 2 | Meinungen bilden und mitgestalten | LJ1 | 33 | LJ1 | 54 | 3 / 5 |
| 3 | Bewusst konsumieren und handeln | LJ1 | 36 | LJ2 | 36 | 3 / 3 |
| 4 | Verantwortung fuer mich und andere uebernehmen | LJ2 | 30 | LJ2 | 51 | 3 / 4 |
| 5 | Mich im Staat orientieren | LJ2 | 36 | LJ3 | 48 | 3 / 4 |
| 6 | Mein eigenes Zuhause | LJ2 | 27 | LJ3 | 42 | 3 / 4 |
| 7 | **Schlussarbeit** | LJ3 | 33 | LJ4 | 33 | **0 / 0** |
| 8 | Arbeiten in der Zukunft | LJ3 | 57 | LJ4 | 57 | 5 / 5 |

**T7 Schlussarbeit hat keine Lebensbezuege** — es ist ein Projektthema, kein
Inhaltsthema. Es ist als einziges nicht in die Zirkularitaets-Spirale eingetragen
und listet stattdessen alle 12 SK. Das Fehlen der Lebensbezuege ist der
strukturelle Marker dafuer; Pruefungen, die die Spirale gegen die Themen-Liste
halten, muessen T7 darueber ausnehmen (siehe `scripts/check-nrlp-consistency.mjs`).

> **Aeltere Fassungen dieser Datei behaupteten, T4–T7 seien im „Skizze-Status" und
> Kompetenzen muessten „aus Spiralcurriculum-Logik abgeleitet" werden. Das war
> schon vor dem finalen Erlass ueberholt und ist heute schlicht falsch.** Wer so
> vorgeht, erfindet Kompetenzen, die im Lehrplan anders lauten. Immer den
> Datensatz lesen. Die alte Fassung zaehlte ausserdem nur 7 Themen und fuehrte
> „Arbeiten in der Zukunft" als T7 — das ist T8; T7 ist die Schlussarbeit.

### Pfad-Schema

```
Thema → SK + Sprachmodi (Themen-Ebene, verbindlich)
  └── Lebensbezug (Ich-Form)
      └── Kompetenz (z.B. 1.1.1)
          ├── Aspekte (gesellschaftliche_inhalte)
          └── Sprachmodi (Kompetenz-Ebene, konkret)
```

---

## 5. Die 8 Pruefungsmethoden

Aus `Methoden_Handeln_Real.md`, `Methoden_Fachwissen.md`, `Methoden_Anwendung.md`. **Gesprächsanalyse war in der v1-Skill nicht enthalten — sie ist die einzige Methode, die Rezeption audiovisuell systematisch prueft.**

| # | Methode | Typ | Format | Primaer-SK | Sprachmodi (typ.) | LJ-Eignung |
|---|---------|-----|--------|------------|-------|------|
| 1 | Projektarbeit | Handeln/Real | 20-50 pp schriftlich | SK2, SK3, SK4 | RezSchrBildl + ProdSchrBildl + IntMünd + IntDig | LJ2-3 |
| 2 | Praxisarbeit | Handeln/Real | 20-40 pp schriftlich | SK3, SK9, SK1 | RezSchrBildl + ProdSchrBildl | LJ2-3 |
| 3 | Werkschau | Handeln/Real | 3-5 Werke × 1-2 pp | SK5, SK10 | ProdSchrBildl / ProdMultimedial | LJ1+ |
| 4 | Fachgespraech | Fachwissen | 15-60 min muendlich | SK5, SK6, SK7 | RezMünd + ProdMünd + IntMünd | LJ1+ |
| 5 | Wissensfragen | Fachwissen | 45 min schriftlich | SK1 | RezSchrBildl + ProdSchrBildl | alle |
| 6 | **Mini Cases** | Anwendung | 5-15 min × 3-5 Faelle | SK5, SK11 | RezSchrBildl + ProdMünd + IntMünd | alle |
| 7 | **Critical Incident** | Anwendung | 5-10 min × 3-5 muendlich | SK2, SK3, SK11 | RezSchrBildl + ProdMünd | LJ2-3 (LJ1 eng) |
| 8 | **Gespraechsanalyse** | Anwendung | Video 10-20 min + Analyse 20-40 min + Besprechung 20 min | SK4, SK6, SK7 | RezAudiovis + ProdMünd + IntMünd | LJ1+ |

### Default-Vorgabe fuer Skill 1 → Skill 2

`methode_primary = "mini_cases"` (LJ1-tauglich, K3/K4, deckt SK5+SK11, 3 Faelle gut differenzierbar).
`methode_extension = "critical_incident"` (fuer 100%-Vertiefung, ab LJ2 voll geeignet).

### Mini-Cases-Spec (kanonisch)

- 3 Faelle (Pflicht-80%) + 3 CI-Erweiterungen (100%-Extension)
- 5-15 min pro Fall
- Persona aus `kn_anchor.persona_pool_kn_neu` — Unseen-Transfer
- Trade-off aus `kn_anchor.mehrdeutigkeits_trade_offs.trade_off_raum` aktiviert
- Bi-dimensionale Rubric (siehe §6)

---

## 6. Bi-dimensionale Rubric

Quelle: `rahmenlehrplan-allgemeinbildung-9-april-25.txt` Z.135 + VO §3 Abs. 2. Beispiel: `Bsp_Prüfungsaufgabe_CI.md`.

**Bi-dimensional ist Pflicht, nicht verhandelbar.** SuK und Ges separat bewerten, beide Noten gleichgewichtet.

```
| Kategorie       | Leitfrage                                | 0-3 | × | Total |
|-----------------|------------------------------------------|-----|---|-------|
| methodisch      | [methodische Frage]                      |     | 1 |       |
| fachlich SuK    | [SuK-Frage 1] (Konvention/Norm integriert)|    | 1 |       |
| fachlich SuK    | [SuK-Frage 2]                            |     | 1 |       |
| fachlich Ges    | [Ges-Frage 1] (Aspekt-Bezug nennen)      |     | 1 |       |
| fachlich Ges    | [Ges-Frage 2]                            |     | 1 |       |
| fachlich Ges    | [Ges-Frage 3]                            |     | 1 |       |

Aggregation:
  SuK-Note = Mittel aus "fachlich SuK" + ggf. methodisch-Anteil
  Ges-Note = Mittel aus "fachlich Ges" + ggf. methodisch-Anteil
  → Zwei Noten, separat, gleichgewichtet.
```

### 4-Level-Guetestufen (verbindlich)

| Stufe | Formulierung |
|-------|--------------|
| **3** | Zeigt vollstaendig … *(Kriterium pro Aufgabe konkret machen)* |
| **2** | Zeigt mit kleineren Abweichungen … |
| **1** | Zeigt groessere Abweichungen … |
| **0** | Nicht nachvollziehbar oder weicht vollstaendig ab. |

**Konvention/Norm/Sprachbewusstheit** nicht als drittes Kriterium nebenher — sondern **in SuK-Kriterien integrieren** („Verfasst Kommentar unter Einhaltung der Genre-Konventionen").

---

## 7. Bloom × Problemtypen (ABU)

| K | Verb | Problemtyp | ABU-Beispiel |
|---|------|------------|--------------|
| K1 | Wiedergeben | Reproduktion | „Beschreibe Grundrechte zu Social-Media." |
| K2 | Erklaeren | Erklaerproblem | „Erklaere, warum Datenschutz im Betrieb wichtig ist." |
| K3 | Positionieren, Entscheiden | Entscheidungsproblem | „Wie positionieren Sie sich zu privaten Social-Media-Posts am Lehrplatz?" |
| K4 | Analysieren | Analyseproblem | „Diskriminierung in der Klasse: Ursachen, Folgen, Handlungsmoeglichkeiten?" |
| K5 | Bewerten, Entwerfen | Strategieproblem | „Faire Diskussion zu kontroversen Themen vorbereiten und moderieren." |

**Ziel-Niveau fuer ABU-KN: K3-K4.** K1/K2 als alleiniger Anker = Fehler. K5 fuer 100%-Vertiefung.

### Auto-Korrektur in Phase 2

- LF auf K1 (pure Reproduktion) als Kern-Problem → automatisch hochstufen auf K3
- LF4 ist immer K3+ oder K4
- **LF4-Scoping (C4):** LF4 trainiert den Output-Sprachmodus (`nrlp.sprachmodus_ids`) als fokussierte Teil-/Sprachform-Aufgabe — EIN Baustein, der ins Handlungsprodukt einfliesst — nie das ganze Handlungsprodukt. Rezeption (SM3) bleibt bei LF1-3. Methode passend zum Output-Modus aus `references/sprachfoerderung-methoden.md`. (Coherence-Check 20.)
- Wenn die 4 Standard-LFs nicht zu einem K4 kommen → 5. LF ergaenzen, die das Analyseproblem traegt

---

## 8. Phasenmodelle — drei Schichten, nicht austauschbar

```
SCHICHT 1: Unterrichtseinheit (mehrere Wochen)  → BBW 4-Phasen
   Einstieg (Herausforderung) → Kompetenzaufbau → Wissensanwendung → KN
   [Fachschaft verbindlich fuer Einstieg + KN; LP gestaltet die Mitte]

SCHICHT 2: Einzelne Lernaufgabe (mehrere Lektionen)  → IPERKA + Transfer
   Informieren → Planen → Entscheiden → Realisieren → Kontrollieren → Auswerten
   → DEKONTEXTUALISIEREN (Wissen vom Kontext loesen; Concept Map; Fachsystematik)

SCHICHT 3: Eine Herausforderung (~3 Lektionen)  → AViVA-Bogen (Richtwert, keine feste Taktung)
   Ankommen → Vorwissen aktivieren → Informieren → Verarbeiten → Auswerten
```

**Diese drei nicht vermischen.** Eine 5er-Gruppe lebt auf Schicht 2 (Lernaufgabe), eine einzelne Herausforderung läuft als AViVA-Bogen über ~3 Lektionen (Schicht 3, Richtwert ohne feste Taktung; die IPERKA-Logik liegt darunter), die volle Einheit (Einstieg → Kompetenzaufbau → Wissensanwendung → KN) liegt auf Schicht 1.

### Transfer als eigene Phase

Quelle: `gestaldung-individ-lernsituationen.md` Z.297-327.

Transfer kommt **nach Auswerten**, vor dem naechsten Lernsituations-Zyklus. Sie ist der Mechanismus, durch den
- konkrete Lernerfahrung in **Fachsystematik** ueberfuehrt wird
- der Transfer auf neue Kontexte vorbereitet wird
- die Zirkularitaet in `nrlp.json` (T1:R1, T2:R2, T3:R3) ueberhaupt erst greifen kann

Ohne Transfer bleiben die 5 Herausforderungen ein loses Buendel — keine Kompetenz wird gefestigt.

---

## 9. Konventionen, Normen, Sprachbewusstheit

Quelle: `rahmenlehrplan-allgemeinbildung-9-april-25.txt` Z.702-703, 716, 726-727, 791-795.

| Bildung | Konventionen | Normen | Sprachbewusstheit |
|---------|-------------|--------|-------------------|
| EBA 2J | Pflicht | — | Pflicht |
| EFZ 3J | Pflicht | Pflicht | Pflicht |
| EFZ 4J | Pflicht | Pflicht | Pflicht |

Diese drei sind **in SuK-Kriterien integriert**, nicht als separates Kriterium gefuehrt — siehe §6.

---

## 10. Differenzierungsachsen

Drei Achsen, klar getrennt halten:

| Achse | Was steuert sie | Wer entscheidet |
|-------|-----------------|-----------------|
| **Niveau** (standard/erweitert) | Komplexitaet der Aufgabe pro Lebensbezug | Fachschaft |
| **90/100** | Erwartete Tiefe pro Lernende/r | LP + Lernende/r (Extension) |
| **tiefe** (basis/erweitert/vertieft) | Anspruchsniveau der Quellen | LP |

**80%** = alle mit Scaffolding · **100%** = selbstgesteuerte Vertiefung. Lehrjahr ist **keine** Differenzierungs-Achse — Lehrjahr bestimmt das Thema, nicht das Niveau.

---

## 11. Kanonische Lehrberufe und Schweizer Staedte (verbindlich fuer Persona-Pools)

Dies ist die Single-Source-of-Truth fuer Persona-Generierung. Phase 0.5 waehlt
`persona_pool_units` und `persona_pool_kn_neu` ausschliesslich aus diesen Listen.
Andere Schreibweisen sind Bugs (siehe v1-Audit: „Koeechin" statt „Koechin").

Kontext: Berufsbildungsschule Winterthur (BBW) — vier Abteilungen, ~40 Lehrberufe.
Verwandte Berufe (z.B. Informatiker-Fachrichtungen, Praktiker EBA + Voll-EFZ einer
Branche, Fahrrad-/Motorradmechaniker) sind zu einer ID gruppiert, um die Auswahl
handhabbar zu halten. In der Prosa darf weiter spezifisch differenziert werden
(„Informatikerin EFZ Applikationsentwicklung im 2. Lehrjahr").

### Lehrberufe — gruppiert nach BBW-Abteilung

#### Abteilung Bau

| ID | Schreibweise mit Umlauten | Umfasst (Sub-Berufe) |
|---|---|---|
| forstwart | Forstwart/in EFZ | Forstwart EFZ |
| kaminfeger | Kaminfeger/in EFZ | Kaminfeger EFZ |
| maler | Maler/in EFZ | Maler EFZ, Malerpraktiker EBA |
| maurer | Maurer/in EFZ | Maurer EFZ, Baupraktiker EBA |
| plattenleger | Plattenleger/in EFZ | Plattenleger EFZ, Plattenlegerpraktiker EBA |
| schreiner | Schreiner/in EFZ | Schreiner EFZ, Schreinerpraktiker EBA |
| spengler | Spengler/in EFZ | Spengler EFZ, Spenglerpraktiker EBA |

#### Abteilung Technik / Ernährung

| ID | Schreibweise mit Umlauten | Umfasst (Sub-Berufe) |
|---|---|---|
| automobilfachmann | Automobilfachmann/-frau EFZ | Automobilfachmann EFZ, Automobilmechatroniker EFZ, Automobilassistent EBA |
| baecker_konditor | Bäcker-Konditor-Confiseur/in EFZ | Bäcker-Konditor-Confiseur EFZ + EBA |
| elektroinstallateur | Elektroinstallateur/in EFZ | Elektroinstallateur EFZ, Montageelektriker EFZ |
| zweiradmechaniker | Zweiradmechaniker/in EFZ | Fahrradmechaniker EFZ, Kleinmotorrad-/Fahrradmechaniker EFZ, Motorradmechaniker EFZ |
| landmaschinenmechaniker | Land-/Baumaschinenmechaniker/in EFZ | Land-/Baumaschinen- und Motorgerätemechaniker EFZ |

#### Abteilung Maschinenbau

| ID | Schreibweise mit Umlauten | Umfasst (Sub-Berufe) |
|---|---|---|
| anlagen_apparatebauer | Anlagen- und Apparatebauer/in EFZ | Anlagen- und Apparatebauer EFZ |
| gusstechnologe | Gusstechnologe/in EFZ | Gusstechnologe EFZ, Gussformer EFZ |
| konstrukteur | Konstrukteur/in EFZ | Konstrukteur EFZ |
| polymechaniker | Polymechaniker/in EFZ | Polymechaniker EFZ, Mechanikpraktiker EBA |
| produktionsmechaniker | Produktionsmechaniker/in EFZ | Produktionsmechaniker EFZ |

#### Abteilung Informatik

| ID | Schreibweise mit Umlauten | Umfasst (Sub-Berufe) |
|---|---|---|
| entwickler_digitales_business | Entwickler/in Digitales Business EFZ | Entwickler Digitales Business EFZ |
| informatiker | Informatiker/in EFZ | Informatiker Applikationsentwicklung EFZ, Plattformentwicklung EFZ, Systemtechnik EFZ |
| laborant | Laborant/in EFZ | Laborant Biologie EFZ, Chemie EFZ, Farbe und Lack EFZ |

### Abteilungs-Zuordnung (fuer Mix-Validierung)

| Abteilung | IDs |
|---|---|
| bau | forstwart, kaminfeger, maler, maurer, plattenleger, schreiner, spengler |
| technik_ernährung | automobilfachmann, baecker_konditor, elektroinstallateur, zweiradmechaniker, landmaschinenmechaniker |
| maschinenbau | anlagen_apparatebauer, gusstechnologe, konstrukteur, polymechaniker, produktionsmechaniker |
| informatik | entwickler_digitales_business, informatiker, laborant |

### Abteilungs-Mix-Pflicht (verbindlich, v1.3)

Beim Befuellen von `persona_pool_units` (3 Berufe) und `persona_pool_kn_neu`
(2 Berufe) gilt:

- **persona_pool_units (3 Berufe):** MUESSEN aus **mindestens 3 verschiedenen
  Abteilungen** stammen — also je ein Beruf aus drei der vier Abteilungen.
  Doppelung derselben Abteilung in den 3 Units-Personas ist verboten.
- **persona_pool_kn_neu (2 Berufe):** beide Berufe MUESSEN aus Abteilungen
  stammen, die in `persona_pool_units` **nicht oder nur einmal** vertreten
  sind, mindestens eine davon aus einer in Units gar nicht vertretenen
  Abteilung. Ziel: Unseen-Transfer auf neue Berufsbranche.
- Die ID-Disjunktheit zwischen `persona_pool_units` und `persona_pool_kn_neu`
  bleibt unveraendert Pflicht (kein Beruf darf in beiden Pools auftauchen).

Validierung beim Pre-Write des Prinzips:

1. Lookup jeder ID → Abteilung
2. `count(unique_abteilungen(units)) >= 3` — sonst `ERR_PERSONA_ABTEILUNG_MONO`
3. `intersection(abteilungen(kn_neu), abteilungen_komplett_abwesend_in_units) >= 1`
   — sonst `WARN_PERSONA_KN_NEU_NO_NEW_ABTEILUNG`, User-Bestaetigung erforderlich

### Schreibweise-Regel

In Prosa (situation_text, persona.beruf) immer mit Umlauten.
In IDs/Slugs (sit_id, topic_slug) transliterieren: ä→ae, ö→oe, ü→ue, ß→ss.
NICHT „oee" oder „aae" — Verdoppelung ist ein generischer Halluzinations-Bug.

### Schweizer Staedte fuer Persona-Pools

| ID | Schreibweise mit Umlauten |
|---|---|
| aarau | Aarau |
| basel | Basel |
| bern | Bern |
| biel | Biel/Bienne |
| chur | Chur |
| genf | Genf |
| lausanne | Lausanne |
| luzern | Luzern |
| olten | Olten |
| sankt_gallen | St. Gallen |
| sion | Sion |
| thun | Thun |
| winterthur | Winterthur |
| zuerich | Zürich |

Andere Staedte sind moeglich, muessen aber plausibel Schweizer Berufsbildungs-Kontexte
abdecken (keine reinen Verwaltungsorte, keine Ferienorte). Erweiterungen in diese Tabelle
eintragen.

---

## 12. Die 8 Merkmale Lernsituation (Mueller 2010)

Quelle: `situation-ausbildungssituation.md` Z.215-244. Checkliste vor jeder Phase-1-Auswahl.

```
□ Authentizitaet — echt aus Lernenden-Sicht?
□ Verortung — Zeit/Raum/Personen identifizierbar?
□ Problem — erkennbar (nicht Reproduktion)?
□ Affektivitaet — Gefuehlswelt angesprochen?
□ Kognition — intellektuelle Herausforderung (K3/K4)?
□ Aktivitaet — aktives Handeln gefordert?
□ Kompetenz — Komplexitaet passend zum LJ?
□ Relevanz — in der Lebenswelt der Lernenden bedeutsam?
```

Die 5 Herausforderungen einer 5er-Gruppe (Phase 0.5) erben diese 8 Merkmale — jede Herausforderung muss alle 8 abdecken koennen.
