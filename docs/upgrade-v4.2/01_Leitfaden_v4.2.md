# HKO-Einheit v4.2 — Leitfaden (Gold-Version, Rev. 2)

**Stand:** 01.10.2026 · ersetzt v4.1 und v4.2 Rev. 1
**Entscheide:** Pietro Rossi (Kernteam 1, BBW) · erarbeitet mit Claude
**Bezug:** Kontextpaket bbw-hko (Ist-Zustand), `schema/types.ts`
**Sprache der Einheiten:** Schweizer Hochdeutsch, kein Eszett, Situationen in Ich-Form, Aufträge in Sie-Form.

> **Für Claude Code:** Lies §0–§2, dann §3 (Seitenplan), §4 (Spuren), §7 (gemeinsamer Auftrag) und §11 (Datenmodell). Die Datenbeispiele `herausforderung_A.json`, `herausforderung_B.json` und `set.json` sind die Referenz. Felder aus `types.ts` behalten ihren Namen; neue Felder sind in §11 markiert. Alles ist additiv.

---

## 0. Entscheide und Änderungen

| Thema | v4.1 | v4.2 (gilt) |
|---|---|---|
| Einheit | 1 Heft = «Einheit» | Prinzip + **Heft A + Heft B** + **gemeinsamer Auftrag** + KN + Begleiter |
| Herausforderungen | 3, Gruppenpuzzle | **2**, alle Lernenden machen **beide nacheinander** |
| Spuren | Medien abschaltbar (Variante B) | **Zwei Spuren pro Heft:** *ohne Medien* (Methoden + Scaffolding) und *mit Medien*. Gemeinsamer Kern; nur **LF3, LF4** und die davon abhängigen Felder weichen ab. |
| Nach den Heften | Gruppenpuzzle / Tandem | **Ein gemeinsamer Auftrag:** neue Situation, spezifischer Auftrag, Produkt, verknüpft mit den Sprachmodi. Sozialform wählt die Lehrperson (Regel §7.3). |
| Zeit | offen | **12 Lektionen:** Heft A 3 · Heft B 3 · Auftrag 3 (inkl. Rückmeldung) · KN 2 · Puffer 1 |
| Umfang | 12 Seiten pro Heft | **8 Seiten pro Heft + 4 Seiten Auftragsbogen** = 20 Seiten pro Lernende/r |
| Quellen (Spur mit Medien) | 3 Slots mit Raster | **1 Pflichtquelle mit Raster + 2 Vertiefungsquellen als Karte ohne Raster** |
| Bewertung | Heft-Raster mit 4–6 Kriterien | Hefte formativ, je **2 KN-Kriterien**. Auftrag formativ mit **allen 4 KN-Kriterien**. Note nur im KN. |
| Transfer | Transferfall im Heft | Mindmap im Heft (gemeinsames Zentrum) · **gemeinsamer Auftrag** · KN |
| Datenmodell | nach Seiten benannt | fachliche Felder, angelehnt an `types.ts` |

---

## 1. Die Einheit im Überblick

```
Prinzip (prinzip.json)       Kompetenzversprechen, Trade-off-Raum, Anker,
                             Verteilung A/B, Modi für Hefte, Auftrag und KN
   │
   ├── Heft A  (W1, 3 L., 8 S.)    Kern + Spur (ohne / mit Medien) · 2 KN-Kriterien
   ├── Heft B  (W2, 3 L., 8 S.)    Kern + Spur (ohne / mit Medien) · 2 KN-Kriterien
   ├── Gemeinsamer Auftrag (W3, 3 L., 4 S.)   neue Situation · Produkt · 4 KN-Kriterien · Rückmeldung
   ├── KN (W4, 2 L. + 1 L. Puffer)            Hybrid-Situation A+B · 3 Formen · Raster 4 Kriterien
   └── Begleiter (LP)                          Musterlösungen pro Spur, Erwartungshorizonte, Quellen-Stand
```

**Grundsätze (das Warum)**
1. **Backward Design über die Einheit:** Das KN-Raster ist der Ausgangspunkt. Die Hefte üben je zwei Kriterien, der Auftrag alle vier, der KN weist sie nach.
2. **Gemeinsamer Kern, zwei Wege zur Realität:** Lehrmittel (Fachsystematik) + entweder Medium (Spur mit Medien) oder Lehrmittel-Fall mit verstärktem Scaffolding (Spur ohne Medien).
3. **Feste Struktur, variable Daten:** Jedes Heft hat dieselben 8 Seiten, in beiden Spuren.
4. **Ausgang über Dekontextualisierung:** Mindmap mit gemeinsamem Zentrum in A und B → gemeinsamer Auftrag in neuem Lebensbereich → KN in einem weiteren Lebensbereich.
5. **Geschlossen:** Lehrmittel (+ QR in der Medien-Spur) genügen. Keine Datenerhebung durch Lernende.

---

## 2. Bewertung

| Baustein | Funktion | Kriterien | Note |
|---|---|---|---|
| Heft A | Übung | 2 KN-Kriterien (1 SuK + 1 Ges) | nein |
| Heft B | Übung | die anderen 2 KN-Kriterien | nein |
| Gemeinsamer Auftrag | Generalprobe mit Rückmeldung | **alle 4 KN-Kriterien** | nein |
| KN | Nachweis | alle 4 KN-Kriterien | **ja** |

- Kriterien immer **im Wortlaut des KN**, mit den vier Stufen aus `kn.rubrik_shared`.
- Pro Kriterium ein **Indikator am Produkt** («Woran sehe ich das in meinem Produkt?»).
- Lernende kreuzen vor der Abgabe ihre Stufe an (Spalte «Selbst»); die Lehrperson gibt Rückmeldung auf derselben Skala.
- Die Kriterien sind **in beiden Spuren identisch**.

**Pilot 1.3.1 (4J)**

| KN-Kriterium | Dim. | Heft | Warum dort |
|---|---|---|---|
| Fachkorrektheit | SuK | **A** | Landkarte steht und fällt mit korrekten Begriffen (Bedürfnisarten, Maslow, Gut). |
| Position / Werthaltung | Ges | **A** | Massstab-Satz und Entscheid zum Handy sind eine Ich-Position. |
| Argumentation | SuK | **B** | Das Budgetgespräch verlangt begründete Anpassungen gegen einen Einwand. |
| Wirtschaftliches Prinzip | Ges | **B** | Budget, Engpass und Schuldenrisiko werden im eigenen Budget verbunden. |

---

## 3. Seitenplan pro Heft (8 Seiten, 135 Minuten, beide Spuren)

**Format:** 2 Bogen A3 = 8 Seiten A4. Doppelseiten 2–3, 4–5, **6–7 (Methoden gegenüber Arbeitsfläche)**; Umschlag 1 und 8.

| S. | Titel | Kern (gleich in beiden Spuren) | Spur-abhängig | Lernende tun | Min. |
|---|---|---|---|---|---|
| 1 | Herausforderung | Kopf, Persona, Situation, Zahlen, Leitfrage, Spannungsfeld, Lehrmittel-Ressourcen, Wochenplan | Medien: Kurzeintrag Pflichtquelle + QR | Situation lesen, offene Fragen markieren | 8 |
| 2 | Wissensecke I | LF1 (Verstehen) · LF2 (Anwenden), Scaffold-Spalte, Schreibfelder | — | LF1, LF2 schriftlich | 27 |
| 3 | Quelle | Raster als Antwortfeld + Befund | **LF3**: Medien = Pflichtquelle mit Karte · ohne = Lehrmittel-Abschnitt + Beispielzeile im Raster | lesen/sehen/hören, Raster füllen, Befund | 25 |
| 4 | Wissensecke II | Schreibfeld | **LF4** (Pol-Typ) + Kasten: Medien = **Vertiefung** (2 Karten) · ohne = **Denkhilfe** (Tabelle) | LF4 schriftlich | 15 |
| 5 | Auftrag | Produkt, Schritte 01–05, Hilfe-Verweis, Abgaben, Feedback-Kriterien (2), Plus | — | Auftrag lesen; vor Abgabe Stufe ankreuzen | 5 |
| 6 | Methoden | 4 Karten aus der Kartei | 1 Karte spur-abhängig (Rezeptionswerkzeug) | nachschlagen | — |
| 7 | Arbeitsfläche | freie Fläche | — | Produkt herstellen | 40 |
| 8 | Abschluss | Mindmap (gemeinsames Zentrum) · Quer-Check · Mitnahme · Checkliste | — | verbinden, abhaken, Mitnahme notieren | 15 |
| | | | | **Summe** | **135** |

### 3.1 Zeichenbudgets (A4, Grundschrift 10 pt)

| Seite | Feld | Budget |
|---|---|---|
| 1 | `titel` | ≤ 60 |
| 1 | `situation_text` | 650–900 |
| 1 | `zahlen_tabelle` | ≤ 4 Zeilen · Label ≤ 45 · Wert ≤ 15 |
| 1 | `leitfrage` | ≤ 140 |
| 1 | `mehrdeutigkeit.trade_off` / `.hint` | ≤ 70 / ≤ 160 |
| 1 | `quellen_anker[]` | ≤ 3 × ≤ 90 |
| 1 | Pflichtquelle (nur Medien-Spur) | ≤ 100 + QR |
| 1 | `wochen_plan[]` | 3 × ≤ 80 |
| 2 | `leitfragen_intro` | ≤ 300 |
| 2–4 | `leitfragen[].text` | ≤ 220 |
| 2–4 | `leitfragen[].liefert` | 3–7 Wörter, ≤ 50 |
| 2–4 | `scaffolding.strategien` / `.satzanfaenge` / `.produkt` | 2 × ≤ 90 / 2–3 × ≤ 60 / ≤ 110 |
| 2 | `feld_hoehe_mm` LF1 / LF2 | 35 / 45 |
| 3 | Quellenkarte: Titel / Herausgeber+Datum / Kurzbeschrieb / Verortung | ≤ 80 / ≤ 40 / ≤ 180 / ≤ 40 |
| 3 | `quellen[].auftrag` bzw. `raster.auftrag` | ≤ 220 |
| 3 | `raster.spalten` / `.zeilen` / `.beispielzeile` | 4 × ≤ 18 / 4 / 4 × ≤ 25 |
| 3 | Befund-Schreibfeld | 25 mm |
| 4 | `feld_hoehe_mm` LF4 | 60 (Medien) / 45 (ohne, wegen Denkhilfe) |
| 4 | Vertiefung (Medien): Titel / Leitfrage | 2 × (≤ 70 / ≤ 100) |
| 4 | Denkhilfe (ohne): Spaltenköpfe / Hinweis | 2–3 × ≤ 30 / ≤ 140 |
| 5 | `handlungsprodukt.titel` / `.beschreibung` | ≤ 60 / ≤ 200 |
| 5 | `handlungsprodukt.schritte[]` | 5 × (Label ≤ 30, Hint ≤ 140) |
| 5 | Hilfe-Verweis / `abgaben[]` | ≤ 70 / ≤ 3 × 80 |
| 5 | `feedback_kriterien[]` | 2 × (Name, 4 Stufen aus KN je ≤ 120, Indikator ≤ 90) |
| 5 | Plus (`lernfortschritt.scaffold_100`) | ≤ 150 |
| 8 | `mindmap_zentrum` / `mindmap_aeste[]` | ≤ 40 / 4 × (Titel ≤ 30, 3 × ≤ 25) |
| 8 | `abschluss.quercheck[]` / `.mitnahme[]` | 2 × ≤ 110 / 3 × ≤ 50 |
| 8 | `bewertungsraster[]` | 4 Zeilen × ≤ 3 Punkte × ≤ 70 |

---

## 4. Zwei Spuren

### 4.1 Was gleich ist, was abweicht

| Gleich in beiden Spuren (Kern) | Spur-abhängig |
|---|---|
| Situation, Leitfrage, Spannungsfeld, Persona, Zahlen | **LF3** (Quelle, Text, Raster, Lösung) |
| LF1, LF2 mit Scaffolds und Lösungen | **LF4** (Pol-Typ, Text, Scaffold, Lösung) |
| Produkt, Schritte, Abgaben, Feedback-Kriterien | `quellen[]` (Medien-Spur) |
| Methoden-Karten 1, 3, 4 | Methoden-Karte 2 (Rezeptionswerkzeug) |
| Mindmap, Abschluss, Checkliste | Kasten S. 4: Vertiefung bzw. Denkhilfe |
| Gemeinsamer Auftrag, KN | `lernfortschritt.scaffold_90` |

### 4.2 Spur «ohne Medien» (Methoden + Scaffolding)
- **LF3:** Quelle ist ein **Lehrmittel-Abschnitt** (Kapitel + Seite, am Buch verifiziert). Gleiches Raster wie in der Medien-Spur, aber mit **vorausgefüllter Beispielzeile**.
- **LF4:** Pol-Typ ohne Medium (z. B. `modell_eigener_fall`, `position_gegenposition`). Dazu auf S. 4 eine **Denkhilfe** (2–3-spaltige Tabelle, z. B. «dafür · dagegen · mein Entscheid»).
- **Methoden:** Rezeptionskarte = `hko-quelle-raster` (funktioniert für Lehrmitteltexte).
- **Warum:** Die Spur ist kein Notbehelf, sondern eine Differenzierung: mehr Struktur, weniger Material. Sie eignet sich für Klassen ohne Geräte und für Lernende, die mehr Gerüst brauchen.

### 4.3 Spur «mit Medien»
- **LF3:** Pflichtquelle mit Karte (QR, Verortung, Auftrag) und Raster, **ohne** Beispielzeile.
- **LF4:** Pol-Typ darf die Quelle einbeziehen (z. B. `lehrmittel_quelle`).
- **S. 4:** Kasten **Vertiefung** mit 2 Quellenkarten (ohne Raster; Raster-PDF auf der Landing-Seite).

### 4.4 Wahl der Spur
- Die Lehrperson wählt **pro Klasse oder pro Lernende/r** (Differenzierung). Weil Kern, Produkt, Kriterien und Auftrag gleich sind, können beide Spuren im selben Raum laufen.
- **Prüfregel:** Verlangt die Kompetenz eines Hefts Rezeption **mündlich** oder **audiovisuell**, gibt es für dieses Heft **nur die Medien-Spur** (sonst ist der Modus nicht abgedeckt).

---

## 5. Quellen (Spur mit Medien)

| | Pflichtquelle | Vertiefungsquellen (2) |
|---|---|---|
| Ort | S. 1 (Kurzeintrag), **S. 3 (Karte + Raster)** | **S. 4, Kasten «Vertiefung»**: Karte + 1 Leitfrage, kein Raster |
| Bearbeitung | Pflicht | freiwillig (Plus, Hausaufgabe) |
| Raster | gedruckt | PDF auf der Landing-Seite |

**Höchstlänge der Pflichtquelle** (S. 3 hat 25 Min.: Rezeption ≤ 10 · Raster 12 · Befund 3)

| Typ | Höchstlänge |
|---|---|
| Video / Audio | Ausschnitt **≤ 4 Min.** |
| Artikel | **≤ 450 Wörter** |
| Grafik / Datensatz | 1 Grafik + Begleittext **≤ 250 Wörter** |
| Rechtstext | ≤ 3 Artikel |

**Typ der Pflichtquelle:** Rezeptionsmodus der Kompetenz, sonst des Themas (T1/T4/T8 schriftlich · T2/T6 mündlich · T3/T5 audiovisuell). In A und B möglichst verschiedene Typen.

**Raster-Spalten** (letzte Spalte immer «→ Begriff»): Video: Bild · Ton · Aussage — Audio: Wer spricht · Kernaussage · Absicht — Artikel: Absatz · Kernaussage · Beleg/Zahl — Grafik: Was gemessen · auffälliger Wert · Aussage — Rechtstext: Art./Abs. · Voraussetzung · Folge.

**Quellenkartei** `src/data/quellen/<id>.json`, zweistufig aufgelöst wie `methoden`. **Repo öffentlich: nur Metadaten, keine Transkripte, keine Volltexte** (`archiv_ref` zeigt ins private Archiv). Ersatzquelle über `ersatz_ref`, nur gültig mit **gleichem Auftrag und Raster**. `sachlage_geprueft` statt Altersregel; Link-Prüfung in der CI. LF3-Lösung trägt `quelle_ref` + `quelle_stand`.

---

## 6. Leitfragen, Abschluss, Mindmap

### 6.1 Leitfragen

| LF | Funktion | K-Stufe | Quelle | Antwortform |
|---|---|---|---|---|
| LF1 | Begriffe, Kategorien | K2 | Lehrmittel | Schreibfeld |
| LF2 | Auf den eigenen Fall anwenden | K3 | Lehrmittel + eigener Fall | Schreibfeld |
| LF3 | Realität analysieren | K4 | Pflichtquelle **oder** Lehrmittel-Abschnitt (Spur) | Raster + Befund |
| LF4 | Spannung beurteilen und entscheiden | K4 | zwei Pole (Pol-Typ) | Schreibfeld (+ Denkhilfe) |

Pol-Typen: `lehrmittel_quelle` · `position_gegenposition` · `modell_eigener_fall` · `recht_praxis` · `quelle_quelle`.
**Regeln:** A ≠ B innerhalb einer Spur; `lehrmittel_quelle` und `quelle_quelle` nur in der Medien-Spur; Satzanfänge für beide Pole.

**Pilot 1.3.1**

| | Spur mit Medien | Spur ohne Medien |
|---|---|---|
| Heft A · LF4 | `lehrmittel_quelle` | `modell_eigener_fall` |
| Heft B · LF4 | `position_gegenposition` | `position_gegenposition` |

### 6.2 Mindmap (Heft S. 8, oben)
- **Zentrum** = Kurzform des `dekontextualisierungs_anker`, gleich in A und B. Pilot: **«Wunsch jetzt oder Sicherheit später»**.
- 3 heftspezifische Äste + 1 Ast **«gilt auch bei …»** (`transfer: true`).
- Mindestens 5 beschriftete Verbindungen, eine zum Ast «gilt auch bei …», mindestens zwei Begriffe aus dem Raster.

### 6.3 Abschluss (Heft S. 8, unten)
- **Quer-Check:** die offenen Fragen der Situation abhaken.
- **Mitnahme in den gemeinsamen Auftrag:** drei feste Zeilen. Heft A: *Mein Massstab · Mein Entscheid · Mir noch unklar.* Heft B: *Meine wichtigste Anpassung · Meine Schutzregel · Mir noch unklar.* Das ist genau das Werkzeug, das der Auftrag in W3 braucht.
- **Checkliste Vollständigkeit** (`bewertungsraster`).
- Ersetzt `reflexion_fragen` R1–R3.

---

## 7. Gemeinsamer Auftrag

### 7.1 Funktion und Abgrenzung zum KN (a)

| | Gemeinsamer Auftrag | KN |
|---|---|---|
| Zweck | **Übung mit Rückmeldung** (Generalprobe) | **Nachweis** |
| Kriterien | **dieselben 4 KN-Kriterien**, gleicher Wortlaut, gleiche Stufen | 4 KN-Kriterien |
| Situation | neu, Hybrid A + B, **anderer Lebensbereich als KN und als A/B** | neu, Hybrid A + B |
| Produkt | trägt die **Sprachmodi, die die Hefte nicht abdecken** (§7.2) | eine der drei KN-Formen |
| Rückmeldung | LP + Selbsteinschätzung, **vor dem KN** | Note |
| Material | Hefte A und B erlaubt und erwünscht | gemäss KN-Form |

**Regeln**
1. **Lebensbereich:** Der Auftrag spielt in einem anderen Lebensbereich als die KN-Situation, und keiner der Gegenstände aus A, B oder KN kommt vor (`kontext_ausschluss`). Er aktiviert mindestens zwei Spannungen aus dem Trade-off-Raum, wie die Hybrid-Situation des KN.
2. **Gleiche Anforderung, anderer Fall:** Der Auftrag kombiniert die Konzepte von A und B auf demselben K-Niveau wie der KN (K3–K4). Er ist kein vereinfachter KN und kein vorweggenommener KN.
3. **Rückmeldung vor dem KN:** Zwischen Abgabe des Auftrags und KN liegt mindestens eine Lektion mit Rückmeldung.
4. **Keine Note.** Der Auftrag zählt nicht. Eine Gewichtung wäre ein eigener Entscheid in `set.json`.

### 7.2 Sprachmodi des Auftrags (c)
**Regel:** Der Auftrag trägt die Sprachmodi aus `prinzip.modi_kn`, die **weder Heft A noch Heft B** abdeckt:

`modi_auftrag = modi_kn − (modi_heft_A ∪ modi_heft_B)`

- Ist die Differenz leer, trägt der Auftrag den KN-Modus, der in den Heften am wenigsten Gewicht hatte.
- Sind es mehr als zwei Modi, trägt der Auftrag zwei; die übrigen werden im Prinzip-Dokument als Lücke markiert.

**Pilot 1.3.1:**
- `modi_kn`: Rezeption schriftlich und bildlich · Interaktion mündlich · Produktion mündlich · Produktion schriftlich und bildlich.
- Heft A: Rezeption schriftlich und bildlich. Heft B: Rezeption schriftlich und bildlich + Interaktion mündlich.
- → **Auftrag: Produktion mündlich + Produktion schriftlich und bildlich.**

### 7.3 Sozialform (b)
Die Lehrperson wählt die Sozialform. **Regel:**

| Sprachmodus des Auftrags | Zulässige Sozialform |
|---|---|
| enthält einen **Interaktionsmodus** (mündlich, schriftlich oder digital) | **Partner- oder Gruppenarbeit (2–4)**, nie reine Einzelarbeit. Jede Person hat einen ausgewiesenen Anteil am Produkt (z. B. eigene Rolle, eigener Gesprächsbeitrag, eigener Abschnitt), damit die Rückmeldung individuell bleibt. |
| nur Rezeptions- und Produktionsmodi | Einzel-, Partner- oder Gruppenarbeit frei; das Produkt bleibt individuell. Empfohlen: Peer-Rückmeldung auf das KN-Raster. |

Datenfeld: `gemeinsamer_auftrag.sozialform.zulaessig` wird aus den Modi abgeleitet; `.empfehlung` ist ein Vorschlag.

### 7.4 Spuren (e)
**Der Auftrag ist in beiden Spuren identisch.** Er ist der Punkt, an dem die Spuren zusammenlaufen, und die Rückmeldung muss vergleichbar sein. Darum gilt: Der Auftrag braucht **kein Medium**. Alle nötigen Angaben stehen in der Situation selbst (Zahlen, Angebot, Fristen).

### 7.5 Auftragsbogen (4 Seiten)

| S. | Inhalt | Min. |
|---|---|---|
| A1 | Situation, Zahlen, Leitfrage, Spannungsfeld, Auftrag, Schritte, Abgaben, Sozialform | — |
| A2 | Arbeitsfläche (Produkt schriftlich und bildlich) | — |
| A3 | Planung des mündlichen Produkts (Sprechspur) + **Glossar der Einheit** | — |
| A4 | **Rückmeldung:** 4 KN-Kriterien mit Stufen, Spalten «Selbst» und «LP», «Bis zum KN verbessere ich …» | — |

Zeit: Lektion 1 Situation + schriftliches Produkt · Lektion 2 mündliches Produkt + Selbsteinschätzung · Lektion 3 Rückmeldung (LP und Peer), Verbesserung.

---

## 8. Zeit (d)

**12 Lektionen = 4 Wochen à 3 Lektionen, mit Puffer:**

| Woche | Lektionen | Inhalt |
|---|---|---|
| W1 | 3 | Heft A |
| W2 | 3 | Heft B |
| W3 | 3 | Gemeinsamer Auftrag (2) + Rückmeldung (1) |
| W4 | 2 + **1 Puffer** | KN (2) · Puffer (1) |

- **Warum mit Puffer:** Ohne Puffer kippt der Plan bei der ersten Absenz, und die Rückmeldung zum Auftrag (die den Sinn des Auftrags ausmacht) wird gestrichen.
- **Achtung KN-Form Fachgespräch:** 30–35 Min. pro Person passen nicht in 2 Lektionen für eine ganze Klasse. Wählt die LP das Fachgespräch, führt sie die Gespräche gestaffelt in W3 (Lektion 3) und W4 (inkl. Puffer), während die übrigen Lernenden am Auftrag oder an der Verbesserung arbeiten. Mini Case schriftlich und Werkschau passen in die 2 Lektionen.

---

## 9. Pilot 1.3.1 (4J) — Einheit «Konsum verantworten»

| | Heft A | Heft B |
|---|---|---|
| Kompetenz | 4J 1.3.1 Bedürfnisse | 4J 1.3.2 Budget + 4J 1.3.3 Schulden |
| Fall | Kopfhörer-Impulskauf, Handy des Kollegen (Zusage bis Freitag) | Konto leer am 20., Abos, Sneakers auf Rechnung mit Mahnung, Budgetgespräch |
| LF3 mit Medien | Artikel mit Grafik zu Kaufwegen Jugendlicher | Grafik zu Schulden junger Erwachsener |
| LF3 ohne Medien | Lehrmittel-Abschnitt zu Einflüssen auf Bedürfnisse (Seite verifizieren) | Kap. 8.2 S. 199–202 Schuldenspirale |
| KN-Kriterien | Fachkorrektheit · Position / Werthaltung | Argumentation · Wirtschaftliches Prinzip |
| Produkt | Bedürfnis-Landkarte mit Massstab und Entscheid | Budget mit Anpassungen, Schutzregeln + Budgetgespräch |

**KN unverändert** (E-Bike-Leasing, Mobilität). Kein Leasing, kein Konsumkredit, kein E-Bike in A, B oder im Auftrag.

### 9.1 Heft B: Verben

| Verb | Rolle |
|---|---|
| Budget **planen** (1.3.2) | Zentrum (LF2, Schritte 01–02) |
| Abweichungen/Risiken **identifizieren** (1.3.2) + Verschuldungsrisiken **erkennen** (1.3.3) | Zentrum, zusammengeführt (LF3, Schritt 03) |
| **Anpassungen vornehmen** (1.3.2) + **Wege zur Vermeidung entwickeln** (1.3.3) | Zentrum, zusammengeführt (LF4, Schritt 04) |
| **austauschen** (1.3.2) + **diskutieren** (1.3.3) | mitlaufend über das Budgetgespräch (Schritt 05) |
| Konsumverhalten **kritisch reflektieren** (1.3.3) | mitlaufend (LF2, Abschluss) |

### 9.2 Gemeinsamer Auftrag 1.3.1 (f)

**Lebensbereich:** Freizeit und Freundeskreis (KN: Mobilität/Arbeitsweg · A: Elektronik · B: Monatsbudget).

**Titel:** «Alle kommen ans Openair»

**Situation (Ich-Form):**
> Ich bin im 1. Lehrjahr. In unserem Gruppenchat steht seit gestern: «Openair im Juli — alle kommen, Frühbucherpreis nur bis Sonntag!» Der 3-Tages-Pass kostet 260 Franken, dazu kommen Camping, Essen und Zug, zusammen rund 180 Franken. Ein Tagespass kostet 110 Franken. Auf meinem Sparkonto liegen 300 Franken; die habe ich für die Zahnarztrechnung im Herbst zurückgelegt. Mein Lohn reicht seit den Anpassungen knapp bis Monatsende. Zwei Kollegen haben schon gebucht und schreiben: «Ohne dich ist es nur halb so lustig.» Ich will bis Sonntag entscheiden — ganz, einen Tag oder gar nicht — und meinen Entscheid der Gruppe so erklären, dass ich dazu stehen kann.

**Zahlen:** 3-Tages-Pass CHF 260 · Camping, Essen, Zug ca. CHF 180 · Tagespass CHF 110 · Sparkonto CHF 300 (Rückstellung Zahnarzt) · Frist: Sonntag.

**Leitfrage:** «Gehe ich ans Openair — ganz, einen Tag oder gar nicht — und wie begründe ich meinen Entscheid vor mir und vor der Gruppe?»

**Spannungsfeld:** Dazugehören jetzt vs. Rückstellung für später.

**Aktivierte Spannungen (Trade-off-Raum):** Eigener Massstab vs. sozialer Konsumdruck · Momentaner Wunsch vs. langfristige finanzielle Sicherheit.

**Auftrag:** Treffen Sie Ihren Entscheid mit den Werkzeugen aus Heft A und Heft B und erklären Sie ihn der Gruppe.

**Schritte**
1. **Bedürfnis klären** (Heft A): Welches Bedürfnis steckt hinter dem Wunsch, welcher Einfluss wirkt von aussen? Wenden Sie Ihren Massstab aus Heft A an.
2. **Durchrechnen** (Heft B): Rechnen Sie die drei Varianten (ganz, Tagespass, gar nicht) gegen Ihr Budget und Ihre Rückstellung. Was passiert, wenn im Herbst die Zahnarztrechnung kommt?
3. **Entscheiden:** Wählen Sie eine Variante und eine Schutzregel aus Heft B, die dazu passt.
4. **Entscheidungsblatt** (schriftlich und bildlich, A4): Bedürfnis-Check · Rechnung der drei Varianten · Entscheid mit Begründung · Schutzregel.
5. **Sprachnachricht an die Gruppe** (mündlich, 60–90 Sek.): Entscheid, ein Grund, der für Sie zählt, und ein Satz, der zeigt, dass Sie die Gruppe verstehen. Kein Vortrag, keine Rechtfertigung.

**Produkt / Abgaben**
- Entscheidungsblatt A4 (Produktion schriftlich und bildlich)
- Sprachnachricht 60–90 Sek., als Aufnahme oder live vorgetragen (Produktion mündlich)
- Selbsteinschätzung auf den 4 KN-Kriterien (A4)

**Sozialform:** Nur Produktionsmodi → frei. Empfehlung: Einzelarbeit für das Produkt, danach Partner-Rückmeldung: Die Partnerin hört die Sprachnachricht und schätzt sie auf «Argumentation» und «Position / Werthaltung» ein.

**Feedback-Kriterien:** alle 4 KN-Kriterien (Wortlaut und Stufen aus `kn.json`) mit Indikatoren am Produkt:

| Kriterium | Indikator im Auftrag |
|---|---|
| Fachkorrektheit (SuK) | Bedürfnis, Wahlbedürfnis, Rückstellung, Saldo korrekt verwendet |
| Argumentation (SuK) | Entscheid mit Grund; die Gegenseite (Gruppe) wird ernst genommen |
| Wirtschaftliches Prinzip (Ges) | Drei Varianten gegen Budget und Rückstellung gerechnet; Folge für den Herbst benannt |
| Position / Werthaltung (Ges) | Entscheid in Ich-Form, Spannung Dazugehören ↔ Sicherheit anerkannt |

**Abgrenzung zum KN:** anderer Lebensbereich (Freizeit statt Mobilität), kein Kredit- oder Leasingprodukt, andere Produktform (Entscheidungsblatt + Sprachnachricht statt Fachgespräch, Mini Case oder Werkschau), gleiche Kriterien.

**Erwartungshorizont (für den Begleiter):** Alle drei Varianten sind vertretbar, wenn sie gerechnet und begründet sind. Tragfähig ist zum Beispiel der Tagespass ohne Griff auf die Rückstellung. Nicht tragfähig ist die Rückstellung «auszuleihen» ohne Plan, wie sie bis zum Herbst wieder aufgefüllt wird.

---

## 10. EBA

- Gleiche Struktur mit A und B; das **Dossier ersetzt das Lehrmittel**.
- Standard ist die **Spur ohne Medien**; die Medien-Spur ist optional (A2, Ausschnitt ≤ 3 Min.).
- **3 Leitfragen** statt 4 (LF2 und LF3 zusammengelegt), grössere Scaffolds, Raster mit 3 Zeilen.
- Gemeinsamer Auftrag auf A2-Niveau; Sprachmodus-Regel §7.2 gilt unverändert.

---

## 11. Datenmodell (Delta zu `types.ts`)

Alle neuen Felder sind optional. Bestehende Felder behalten Namen und Bedeutung.

### 11.1 `SituationJson` (Heft)

| Feld | Status | Bedeutung |
|---|---|---|
| `template` | Wert neu: `heft_8page_v42` | Seitenfolge §3 |
| `nrlp.nr_primary` | bestehend | darf zwei Kompetenzen tragen |
| `leitfragen[]` | bestehend | **nur LF1, LF2** (Kern) |
| `spuren` | **neu** | `{ ohne_medien: Spur, mit_medien: Spur }`; eine Spur fehlt, wenn sie nicht zulässig ist (§4.4) |
| `Spur.leitfragen[]` | **neu** | LF3 und LF4 dieser Spur, mit allen Feldern von `leitfragen[]` |
| `Spur.quellen[]` | **neu** | nur Medien-Spur: `{ ref, rolle, fuer_leitfrage, auftrag, raster?, leitfrage_vertiefung? }` |
| `Spur.kasten_s4` | **neu** | `{ typ: 'vertiefung'\|'denkhilfe', titel, spalten?, hinweis? }` |
| `Spur.methoden_ref_rezeption` | **neu** | ersetzt Karte 2 von `methoden` |
| `Spur.scaffold_90` | **neu** | überschreibt `lernfortschritt.scaffold_90` |
| `leitfragen[].antwortform` | **neu** | `'schreibfeld'` \| `'raster'` |
| `leitfragen[].raster` | **neu** | `{ quelle_ref?, knoten_ref?, auftrag?, spalten[], zeilen, beispielzeile? }` |
| `leitfragen[].pol_typ` | **neu** | nur LF4 |
| `leitfragen[].loesung.quelle_ref` / `.quelle_stand` / `.erwartungshorizont` | **neu** | Bindung an die Quelle; Erwartungshorizont für LF4 |
| `feedback_kriterien[]` | **neu** | `{ kn_kriterium, dimension, stufen[4], indikator_produkt }`; ersetzt `lernfortschritt.kriterien` im Rendering |
| `mindmap_aeste[].transfer` | **neu** | Ast «gilt auch bei …» |
| `abschluss` | **neu** | `{ quercheck[], mitnahme[] }`; ersetzt `reflexion_fragen` im Rendering |

**Auflösung (wie bei `methoden`):** `loadEinheit` setzt die gewählte Spur ein. Danach sehen alle Renderer wie heute ein Heft mit vier `leitfragen`, `quellen`, `methoden` und `lernfortschritt`. Der Spur-Schalter kommt aus `set.spur` oder aus der Auswahl der Lehrperson beim Export.

### 11.2 `SetJson`

| Feld | Status | Bedeutung |
|---|---|---|
| `herausforderungen` | bestehend | 2 Einträge |
| `spur` | **neu** | `'ohne_medien'` \| `'mit_medien'` \| `'wahl'` (Default `'wahl'`: beide werden exportiert) |
| `wochenplan[]` | **neu** | `{ woche, lektionen, inhalt }` |
| `gemeinsamer_auftrag` | **neu**, ersetzt `austausch_phase` und `dekontextualisierungs_aufgabe` im Rendering | siehe unten |
| `glossar[]` | **neu** | `{ begriff, definition, herkunft, heft }` |

`gemeinsamer_auftrag`:
`{ titel, lebensbereich, situation_text, zahlen_tabelle[], leitfrage, mehrdeutigkeit{trade_off}, aktivierte_trade_offs[], sprachmodi[], sozialform{ zulaessig[], empfehlung }, auftrag, schritte[{label,hint}], abgaben[], feedback_kriterien[4], kontext_ausschluss[], erwartungshorizont }`

### 11.3 `PrinzipJson`
- `herausforderungen` mit `A`, `B` und `kompetenzen[]` pro Heft
- **neu:** `modi_pro_heft { A, B }` · `modi_auftrag` (berechnet nach §7.2) · `kn_kriterien_verteilung { A, B }` · `pol_typ_verteilung { A: {ohne_medien, mit_medien}, B: {…} }` · `mindmap_zentrum_kurz`

### 11.4 Quellenkarte `src/data/quellen/<id>.json` (neu)
`{ id, typ, titel, herausgeber, datum, url, sprachmodus, verortung, dauer_sek?, woerter?, kurzbeschrieb, sachlage_geprueft, archiv_ref?, ersatz_ref?, lizenz_hinweis?, konstruiert }`

### 11.5 Prüfregeln
1. `leitfragen` hat 2 Einträge; jede Spur hat genau LF3 (`antwortform: 'raster'`) und LF4 (`pol_typ` gesetzt).
2. Medien-Spur: genau 1 `pflicht`, höchstens 2 `vertiefung`; Länge §5.
3. Ohne-Medien-Spur: `raster.knoten_ref` gesetzt, `raster.beispielzeile` gesetzt, keine `quellen`.
4. Spur `ohne_medien` fehlt, wenn die Kompetenz Rezeption mündlich oder audiovisuell verlangt.
5. Pol-Typ A ≠ B innerhalb derselben Spur; `lehrmittel_quelle` / `quelle_quelle` nur in der Medien-Spur.
6. `feedback_kriterien` im Heft: genau 2 (1 SuK + 1 Ges); A ∪ B = alle KN-Kriterien; im Auftrag: alle 4. Wortlaut = `kn.rubrik_shared`.
7. `mindmap_zentrum` identisch in A und B; genau ein Ast mit `transfer: true`.
8. `gemeinsamer_auftrag.sprachmodi` = `prinzip.modi_auftrag`; enthält er einen Interaktionsmodus, darf `sozialform.zulaessig` keine Einzelarbeit enthalten.
9. Lebensbereich und Gegenstände von A, B, Auftrag und KN sind paarweise verschieden (`kontext_ausschluss`).
10. Kein «ß». Keine Transkripte oder Volltexte im Repo.

---

## 12. Migration bestehender 3er-Einheiten

1. Zwei Herausforderungen behalten, die dritte in die nähere integrieren (wie B + C im Pilot, nach Verben §9.1).
2. LF1, LF2 in den Kern; LF3, LF4 in beide Spuren schreiben (ohne Medien: Lehrmittel-Abschnitt + Beispielzeile + Denkhilfe; mit Medien: Pflichtquelle + Vertiefung).
3. Feedback-Kriterien verteilen (§2), `prinzip.kn_kriterien_verteilung` eintragen.
4. `modi_auftrag` berechnen (§7.2) und den gemeinsamen Auftrag schreiben (§7); Lebensbereich ≠ KN prüfen.
5. `austausch_phase` und `dekontextualisierungs_aufgabe` bleiben in alten Dateien stehen, werden aber nicht mehr gerendert, wenn `gemeinsamer_auftrag` vorhanden ist.
6. Mindmap-Zentrum auf den Anker; R1–R3 → `abschluss`.
7. Prüfregeln §11.5 laufen lassen.

---

## 13. Wer entscheidet was

| Entscheid | Wer |
|---|---|
| Prinzip-Dokument, KN-Kriterien-Verteilung, Pol-Typen | **Pietro** |
| Pflicht- und Vertiefungsquellen | Pipeline schlägt vor, **Pietro gibt frei** |
| Lebensbereich des gemeinsamen Auftrags, KN-Situation | **Pietro** |
| Leitfragen, Scaffolds, Denkhilfen, Lösungen, Glossar, Raster | Pipeline, Stichproben-QA |
| Spur pro Klasse oder Lernende/r, Sozialform des Auftrags | **Lehrperson** |

---

## 14. Offene Punkte

1. **Dritte Kategorie in Heft A** («geweckt, aber berechtigt», SK11): im Datenbeispiel enthalten; streichen, falls für LJ1 zu viel.
2. **Lehrmittel-Seite** für LF3 ohne Medien in Heft A (Einflüsse auf Bedürfnisse) am Buch verifizieren.
3. **Neue Methodenkarten** `hko-quelle-raster` und `hko-grafik-lesen` (Entwürfe im Paket) freigeben.
4. **Sprachnachricht im Auftrag:** Aufnahme über die Plattform oder live vortragen — Datenschutz und Ablage mit der Schule klären.
