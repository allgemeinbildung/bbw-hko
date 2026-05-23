# Handoff — HKO Renderer für 3er-Set 1.1.1 «konflikt_kommunizieren»

**An:** Design-/Frontend-Team
**Von:** ABU-2030-Kernteam (HKO-Architektur)
**Stand:** 2026-05-22
**Zweck:** Bau eines eigenständigen A4-Print-HTML-Renderers, der aus einem fertigen HKO-3er-Set vier druckbare Schüler-/Lehrpersonen-Dokumente erzeugt.

> Ihr bekommt **dieselben JSON-Dateien**, die der Architektur-Partner hat. Dieses Dokument ist die vollständige, eigenständige Spezifikation — kein zusätzliches Briefing nötig.

---

## 0. Auftrag in einem Satz

Aus einem 3er-Set (1 prinzip + 3 Situationen A/B/C + 1 KN + 1 set) erzeugt der Renderer **vier HTML-Dokumente**, jedes als druckbare A4-Seitenfolge mit interaktiven Schreibfeldern am Bildschirm und Schreiblinien im Druck.

**Wichtige Rahmenbedingungen:**
- **Frisches Standalone-Layout.** Kein Match zu einem bestehenden Template. Eigenes Design.
- **A4, druckoptimiert.** Bildschirm-Interaktivität ist sekundär, sauberer Druck ist primär.
- **Self-contained HTML.** Jede Ausgabe ist eine einzelne HTML-Datei (Inline-CSS/JS erlaubt), ohne externe Laufzeit-Abhängigkeiten. Ein „Drucken"-Button gehört rein.
- **Sprache:** Swiss Standard German, **kein Eszett (immer „ss")**. Alle UI-Labels deutsch.

---

## 1. Was ihr bekommt (Input)

Sechs JSON-Dateien pro Set, Namensschema `{kompetenz}_{slug}_{rolle}.json`:

| Datei | Rolle im Set |
|---|---|
| `1.1.1_konflikt_kommunizieren_prinzip.json` | Architektur-Map der ganzen Einheit (überwiegend LP-Kontext) |
| `1.1.1_konflikt_kommunizieren_sit_A.json` | Lernsituation A (rot) — vollständiges Schüler-Material |
| `1.1.1_konflikt_kommunizieren_sit_B.json` | Lernsituation B (blau) |
| `1.1.1_konflikt_kommunizieren_sit_C.json` | Lernsituation C (grün) |
| `1.1.1_konflikt_kommunizieren_kn.json` | Kompetenznachweis: Hybrid-Situation, 3 KN-Typen, geteilte Rubrik |
| `1.1.1_konflikt_kommunizieren_set.json` | Klammer: Austausch-Phase (Jigsaw), Dekontextualisierungs-Aufgabe |

Der Renderer muss **datengetrieben** sein: Feldnamen, Anzahl Leitfragen, Anzahl Mindmap-Äste, Anzahl KN-Typen etc. variieren von Set zu Set. Nichts hartkodieren, was aus der JSON kommt. Dieses Set ist die Referenz, aber das Schema gilt für alle künftigen Sets gleicher Struktur.

---

## 2. Was ihr baut (Output — 4 HTML-Dokumente)

| Code | Dokument | Audience | Quelle | Varianten / Builds |
|---|---|---|---|---|
| **DOC-S** | Situationsheft | Schüler | `sit_X` + `set` | 1 Template, **2 Modi** (`info` / `fill`) × **3 Farb-Builds** (A/B/C) = 6 Renderings |
| **DOC-KN-S** | KN-Durchführung Schüler | Schüler | `kn` | **3 Builds** (ein KN-Typ je Build: Fachgespräch / Mini Case / Werkschau) |
| **DOC-KN-LP** | KN-Durchführung + Bewertung | Lehrperson | `kn` + `prinzip` + `set` | 1 Rendering (enthält alle 3 KN-Typen + volle Rubrik) |

**DOC-S** ist ein einziges Template mit einem `mode`-Parameter (`info` oder `fill`) und einer Quell-Situation (`A`, `B` oder `C`). Beide Modi rendern dieselben Sektionen in derselben Reihenfolge; sie unterscheiden sich nur in der Darstellung pro Block (siehe §4.1).

---

## 3. Globales Design-System

### 3.1 A4-Print-Grundlage

```css
@page { size: A4; margin: 0; }
.a4-page {
  width: 210mm;
  min-height: 297mm;
  padding: 16mm 18mm;        /* grosszügiger Rand */
  box-sizing: border-box;
  page-break-after: always;  /* harte Seite je .a4-page */
  position: relative;
}
.a4-page:last-child { page-break-after: auto; }
* { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
```

- **Logische Sektionen statt fixe Seitenzahlen.** Jede Sektion (§4) ist mindestens eine `.a4-page`; bei viel Schreibplatz darf sie auf zwei Seiten umbrechen. **Grosszügig vor kompakt** — lieber eine Seite mehr als gequetschte Felder.
- **Kein Block darf am Seitenende zerrissen werden:** `break-inside: avoid;` auf Leitfrage+Feld-Paaren, Tabellenzeilen, Mindmap, Rubrik-Zeilen.
- **Fusszeile pro Seite:** Kompetenz-Nr + Titel + Seitenzahl + (bei DOC-S) Situations-Buchstabe.

### 3.2 Farbsystem

Die Situationen tragen ihre Farben **in der JSON** (`sit_farbe`, `sit_farbe_light`, `sit_farbe_mid`). Renderer liest sie aus, nicht hartkodieren.

| Situation | `sit_farbe` (Akzent) | `sit_farbe_light` (Flächen) | `sit_farbe_mid` (Sekundär) |
|---|---|---|---|
| A | `#C0392B` rot | `#FADBD8` | `#E74C3C` |
| B | `#1A5276` blau | `#D6EAF8` | `#2E86C1` |
| C | `#1E8449` grün | `#D5F5E3` | `#27AE60` |

Verwendung in DOC-S: Header-Strip, Sektions-Titel, Badges, Tabellen-Kopf, Feld-Rahmen-Akzent.

**KN/LP-Dokumente tragen keinen `sit_farbe`.** Default: **Graphit-neutral** (`#2C3E50` Akzent, `#ECF0F1` Flächen, `#7F8C8D` Sekundär) — Assessment soll sachlich wirken, nicht als vierte Farbe. (Falls je gewünscht, liesse sich D=orange `#E67E22` setzen; aktuell nicht.)

### 3.3 Dual-Mode-Schreibfeld — DER zentrale Mechanismus

Jedes Antwortfeld ist **am Bildschirm editierbar** und wird **im Druck zu Schreiblinien**.

**Bildschirm (`screen`):**
- Mehrzeilig → `<textarea>`; einzeilig → `<input type="text">`.
- Editierbar, leicht eingerahmt in Situationsfarbe.
- Höhe = aus `feld_hoehe_mm` **abgeleitetes Minimum, aufgerundet + Reserve**. `feld_hoehe_mm` ist die Untergrenze, nicht das Ziel — gib spürbar mehr Platz.
- Faustregel: Anzahl Zeilen = `ceil(feld_hoehe_mm / 8.5) + 2`, mindestens 3 Zeilen.

**Druck (`@media print`):**
- Feld wird zu einem Block aus **horizontalen Schreiblinien**, Zeilenabstand **8–9 mm** (komfortabel für Handschrift).
- Eingetippter Text (falls vorhanden) druckt **auf den Linien**; leeres Feld druckt **leere Linien**.
- Rahmen/Hintergrund der Eingabe werden im Druck entfernt, nur die Linien bleiben.

Robuste Umsetzung (Empfehlung, nicht Vorschrift):
```css
.feld {                                   /* Wrapper */
  --zeile: 8.5mm;
  background-image: repeating-linear-gradient(
    to bottom, transparent 0,
    transparent calc(var(--zeile) - 1px),
    #BDC3C7 calc(var(--zeile) - 1px), #BDC3C7 var(--zeile));
}
.feld textarea {                          /* Bildschirm: editierbar, deckt Linien */
  line-height: var(--zeile);
  background: #fff; border: 1px solid var(--akzent); resize: vertical;
}
@media print {
  .feld textarea {
    border: none; background: transparent;  /* Linien werden sichtbar */
    line-height: var(--zeile);
  }
}
```

**Zwei Spezialflächen im `fill`-Modus** (keine Linien, sondern Fläche zum Zeichnen):
- **Mindmap-Canvas:** grosse leere Fläche mit Zentrum-Knoten und Ast-Beschriftungen als Anker (Details §4.1, Sektion 4).
- **Skizzen-/Handlungsprodukt-Fläche:** je nach `handlungsprodukt.format` entweder Schreiblinien (Textprodukt) oder leere Fläche (Skizze/Tabelle). v1: grosse Linien-Fläche generisch; format-spezifische Scaffolds optional als v2.

### 3.4 Typografie & Lesbarkeit

- Body: klare humanistische Sans, Grundgrösse **11–12 pt** im Druck, Zeilenhöhe ≥ 1.45.
- Situations-/Sektions-Titel klar abgesetzt, Akzentfarbe.
- **Bloom-Badge** und **K-Stufe-Badge** als kleine Pills (z. B. „Anwenden · K3").
- Quellen-Referenzen (`knoten_ref`, `quellen_anker`) als dezente Monospace- oder Kapitälchen-Marke.

---

## 4. Dokument-Spezifikationen

### 4.1 DOC-S — Schüler-Situationsheft (1 Template, 2 Modi)

Quelle: eine `sit_X.json` + `set.json` (letzte Sektion). Sektionsreihenfolge identisch in beiden Modi. Pro Block ist unten angegeben, was `info` vs. `fill` rendert.

| # | Sektion | JSON-Felder | `info`-Modus | `fill`-Modus |
|---|---|---|---|---|
| 1 | **Deckblatt / Cockpit** | `modul_titel`, `nrlp.nr`, `titel`, `sub_facette.label`, `emotion_tag`, `wochen_plan[]`, `bewertungsraster[]`, `quellen_anker[]` | volle Übersicht | identisch (keine Felder) |
| 2 | **Situation** | `titel`, `persona{beruf,betrieb,ort}`, `emotion_tag`, `situation_text`, `zahlen_tabelle[]`, `leitfrage`, optional `mehrdeutigkeit.trade_off` | volltext + Spannungsfeld-Callout | identisch (Lesetext, keine Felder) |
| 3 | **Leitfragen** | `leitfragen_intro`, `leitfragen[]{nr,bloom,knoten_ref,text,feld_hoehe_mm}` | Frage + Bloom-Badge + Quelle, **kein Feld** | Frage + Badge + Quelle + **Dual-Mode-Feld** (Höhe aus `feld_hoehe_mm`) |
| 4 | **Mindmap** | `mindmap_zentrum`, `mindmap_aeste[]{titel,punkte[],optional}` | **vollständige Muster-Mindmap** (Zentrum + Äste + alle `punkte`) | **Skelett:** Zentrum + Ast-`titel` als Anker, `punkte` weggelassen, grosser leerer Canvas zum Zeichnen |
| 5 | **Handlungsprodukt** | `handlungsprodukt{titel,format,beschreibung,schritte[]{label,hint},schreib_label}` | Beschreibung + Schritte als Anleitung | Beschreibung + Schritte (Checkliste) + **grosse Schreib-/Skizzen-Fläche** (Label = `schreib_label`) |
| 6 | **Reflexion** | `reflexion_fragen[]{nr,text,feld_hoehe_mm}` | Fragen sichtbar, kein Feld | Fragen + Dual-Mode-Felder |
| 7 | **Austausch & Dekontextualisierung** | aus `set`: `austausch_phase{format,dauer_min,gruppenarbeit_jigsaw{runde_1,2,3},einzelarbeit_plenum}`, `dekontextualisierungs_aufgabe{auftrag,format,gewicht_prozent,abgabe}` + aus `sit`: `dekontextualisierung{frage,ziel}` | Jigsaw-Runden + Auftrag als Anleitung | Anleitung + Dual-Mode-Feld für den Transfer (5–7 Sätze) |

**Markierung „optional"** bei Mindmap-Ästen: `mindmap_aeste[].optional === true` → im `info`-Modus dezent als „optional/Vertiefung" kennzeichnen; im `fill`-Modus trotzdem als Anker zeigen.

**Zusammenfassung der Modus-Logik:** `info` = ausgefülltes Muster zum Lesen/Projizieren/Nachschlagen, **null Eingabe-Affordances**. `fill` = identische Struktur, aber Mindmap als Skelett und überall dort Schreib-/Zeichenflächen, wo Schüler produzieren.

### 4.2 DOC-KN-S — KN-Durchführung Schüler

Quelle: `kn.json`. **Ein Build pro KN-Typ** (`kn_typen[]` hat 3 Einträge: `fachgespraech`, `mini_case_schriftlich`, `werkschau_transfer`). Build per `typ`-Parameter wählbar. Immer mit Schreibfeldern (dual-mode).

Gemeinsamer Kopf (alle 3 Builds):
| Block | JSON-Felder |
|---|---|
| Hybrid-Situation | `hybrid_situation{titel,persona,emotion_tag,text,leitfrage}` |
| Rahmen | `kn_typen[i].label`, `kn_typen[i].format`, `kn_typen[i].ablauf[]` |

Typ-spezifischer Aufgabenteil:
| `typ` | Feld | Rendering |
|---|---|---|
| `fachgespraech` | `kn_typen[i].fragestruktur[]{nr,typ,frage}` | **Vorbereitungsblatt**: 5 Fragen, je Notiz-Feld. (`k_stufe` **nicht** zeigen — LP-only.) |
| `mini_case_schriftlich` | `kn_typen[i].aufgaben[]{nr,typ,aufgabe}` | **Prüfungsblatt**: 4 Aufgaben + grosszügige Dual-Mode-Felder. |
| `werkschau_transfer` | `kn_typen[i].ablauf[]`, `kn_typen[i].reflexionsfragen[]` | Werkwahl-Begründung (Feld) + 3 Reflexionsfragen (Felder). |

Abschluss-Block **gestrippte Rubrik** (Q1 = sichtbar für Schüler, aber **ohne** 4-Stufen-Diagnostik):
| Block | JSON-Felder | Rendering |
|---|---|---|
| Bewertungskriterien | `rubrik_shared.kriterien[]{name,dimension}` | nur **Name + Dimension (SuK/Ges)**, je 4 Kriterien — **`stufen[]` weglassen** |
| Niveau | `rubrik_shared.niveaubaender[]{label,definition}` | „was 90 % / 100 % heisst" als kurze Legende |

### 4.3 DOC-KN-LP — KN-Durchführung + Bewertung (Lehrperson)

Quelle: `kn.json` (voll) + `prinzip.json` (Kontext-Kopf) + `set.json` (Konzept-Progression). Graphit-neutral. Instruktiv + ein ankreuzbarer Bewertungs-Grid. Ein Rendering, enthält **alle 3 KN-Typen**.

| # | Sektion | JSON-Felder | Rendering |
|---|---|---|---|
| 1 | **Einheits-Kontext** | aus `prinzip`: `kern_kompetenzversprechen`, `sub_facetten{A,B,C}.facette`, `zirkularitaet{r1_aktuell,r2_voraussicht,r3_voraussicht}`; aus `kn`: `dominanter_aspekt`, `mehrdeutigkeits_pflicht` | Kurzer Frame: was die Einheit verspricht, A/B/C-Subfacetten, R1→T4→T7-Ausblick |
| 2 | **Hybrid-Situation + Alignment** | `kn.hybrid_situation{titel,persona,emotion_tag,text,leitfrage,aktivierte_trade_offs[]}`, `kn.hybrid_situation.alignment_note.subfacetten_mapping[]{sit_letter,scene_element}`, `set.konzept_progression[]` | Hybrid-Text + Tabelle „welches Szenen-Element aktiviert Subfacette A/B/C" + aktivierte Trade-offs + A→B→C-Konzeptbogen |
| 3 | **Durchführung** | `kn.kn_typen[]` voll: `label,format,ablauf[]`, `fragestruktur[]`/`aufgaben[]`/`reflexionsfragen[]` **mit `k_stufe`/`typ`**, `sk[]`, `aspekte[]`, `sprachmodi[]` | Alle 3 Typen als Durchführungs-Karten. K-Stufen-Badges hier sichtbar. SK/Aspekte/Modi je Typ als Tags |
| 4 | **Bewertung (bi-dimensional)** | `kn.rubrik_shared{dimensionen[],kriterien[]{name,dimension,stufen[]},niveaubaender[]}` | **Ankreuzbarer Korrektur-Grid** (siehe unten) |

**Bewertungs-Grid (Sektion 4) — Pflicht bi-dimensional:**
- Vier Kriterien-Zeilen, je mit den **vier `stufen[]`-Texten** als Spalten (Stufe 1 = `stufen[0]` = tiefste … Stufe 4 = `stufen[3]` = höchste; siehe Anhang B-Hinweis zur Zählung).
- Pro Kriterium ankreuzbar (Bildschirm: Radiogroup; Druck: Ankreuz-Kästchen).
- **Dimension-Spalte sichtbar**: jedes Kriterium ist `SuK` oder `Ges` markiert.
- **Zwei getrennte Notenfelder** am Ende: **SuK-Note** und **Ges-Note**, separat, gleichgewichtet. (Aggregation: SuK-Note = Mittel der SuK-Kriterien, Ges-Note = Mittel der Ges-Kriterien — zwei Noten, nie zu einer verschmolzen.)
- `niveaubaender[]` als Legende daneben (unter 90 % / 90 % / 100 %).

In diesem Set: 2 Kriterien `SuK` (Fachkorrektheit, Argumentation), 2 Kriterien `Ges` (Ethisches Prinzip, Position/Werthaltung). Der Renderer **liest die Dimension pro Kriterium aus** — nicht nach Position annehmen.

---

## 5. Daten-Kontrakt (JSON-Feld → Block, kompakt)

Vollständige Strukturen liegen euch als JSON vor. Hier nur die Render-relevanten Pfade und Besonderheiten:

**`sit_X.json`**
- `sit_farbe` / `sit_farbe_light` / `sit_farbe_mid` → Farbsystem (§3.2).
- `leitfragen[].feld_hoehe_mm`, `reflexion_fragen[].feld_hoehe_mm` → Feldhöhe-Minimum (§3.3).
- `mindmap_aeste[].optional` (bool) → Kennzeichnung optionaler Ast.
- `bewertungsraster[]` → Cockpit-Tabelle (Schüler-Transparenz: Produkt/Abgabe/Gewicht/Kriterium).
- **NICHT rendern in DOC-S** (LP-only, §6): `lernfortschritt`, `sk_anker`, `prinzip_handoff`, `zirkularitaet_anker`, `mehrdeutigkeit.hint`, `quellen_anker[].fuer_leitfrage` (Mapping-Detail; Kapitel-Titel ja, internes Mapping nein).

**`kn.json`**
- `kn_typen[]` variabel lang → Build je Eintrag (DOC-KN-S) bzw. alle Einträge (DOC-KN-LP).
- Aufgaben-Array heisst je Typ anders: `fragestruktur` (FG) / `aufgaben` (MC) / `reflexionsfragen` (WS). Renderer muss alle drei Schlüssel kennen.
- `k_stufe` → **nur DOC-KN-LP**, nie DOC-KN-S.
- `rubrik_shared.kriterien[].dimension` → SuK/Ges-Zuordnung, treibt die bi-dim Aggregation.

**`set.json`**
- `austausch_phase.gruppenarbeit_jigsaw.runde_1/2/3` → DOC-S Sektion 7.
- `dekontextualisierungs_aufgabe` → DOC-S Sektion 7 (Feld im `fill`).
- `konzept_progression[]` → **nur DOC-KN-LP** (LP-Kontext).

**`prinzip.json`**
- Nur DOC-KN-LP Kontext-Kopf: `kern_kompetenzversprechen`, `sub_facetten`, `zirkularitaet`. Rest ungenutzt für diese vier Dokumente.

**Leere Container** `legacy{}`, `source_refs{}`, `registry_tags{}` → ignorieren (Reserve-Felder, kommen leer).

---

## 6. Sichtbarkeitsregeln (was Schüler NIE sehen)

Hartstopp für DOC-S und DOC-KN-S:
- Volle 4-Stufen-Rubrik-Diagnostik (`rubrik_shared.kriterien[].stufen[]`) → nur LP.
- `k_stufe` der KN-Fragen → nur LP.
- `lernfortschritt.scaffold_90` / `scaffold_100`, `lernfortschritt.kriterien[].gewicht_prozent` → nur LP.
- `sk_anker`, `prinzip_handoff`, `alignment_note` → nur LP.
- `konzept_progression` → nur LP.

Erlaubt für Schüler (Transparenz): `bewertungsraster` (Produkt/Abgabe/Gewicht/Kriterium), gestrippte KN-Rubrik (Name + Dimension + Niveaubänder), `mehrdeutigkeit.trade_off` als Spannungsfeld-Framing.

---

## 7. Edge Cases & Robustheit

- **Variable Längen:** Anzahl `leitfragen`, `mindmap_aeste`, `kn_typen`, `kriterien`, `zahlen_tabelle`-Zeilen ist datengetrieben. Layout muss 3–6 Leitfragen, 3–5 Mindmap-Äste, 1–3 KN-Typen, 4–6 Rubrik-Kriterien sauber tragen.
- **Fehlende optionale Felder:** `mehrdeutigkeit`, `dekontextualisierung`, `optional_praesentation` (WS) können fehlen → Block weglassen, nicht crashen, kein leerer Rahmen.
- **`sub` in `reflexion_fragen` ist meist `null`** → nur rendern, wenn gesetzt.
- **Lange `situation_text`** (bis ~120 Wörter) → muss auf einer Seite Platz haben, nicht abgeschnitten.
- **Druck-Robustheit:** in Chrome/Edge/Firefox „Hintergrundgrafiken drucken" muss nicht manuell nötig sein → `print-color-adjust: exact`. Linien und Farbflächen müssen ohne Nutzer-Einstellung drucken.
- **Seitenumbruch in langen Feldern:** ein `fill`-Feld, das über eine Seite hinausreicht, soll mit Schreiblinien auf der Folgeseite weiterlaufen, nicht abrupt enden.

---

## 8. Non-Goals (nicht bauen)

- Kein Einheits-Cockpit / Konformitäts-Blatt (separates Tooling).
- Kein Backend, keine Persistenz, kein Login. Eingaben müssen **nicht** gespeichert werden — Bildschirm-Eingabe dient nur dem Vorab-Ausfüllen vor dem Druck.
- Keine PDF-Generierung serverseitig — Druck läuft über den Browser-Druckdialog.
- Kein Matching an ein bestehendes Renderer-Template.
- Keine echte Mindmap-Zeichen-Engine — im `fill`-Modus genügt eine leere Canvas-Fläche mit Ankern (Schüler zeichnen von Hand auf Papier).

---

## 9. Abnahme-Checkliste

DOC-S (`fill`, je A/B/C):
- [ ] Header/Akzente in korrekter `sit_farbe`, im Druck farbig.
- [ ] Mindmap im `fill` = Skelett (Zentrum + Ast-Titel), keine `punkte` vorab.
- [ ] Jedes Leitfrage-/Reflexions-Feld druckt Schreiblinien, Höhe ≥ aus `feld_hoehe_mm` abgeleitet + Reserve.
- [ ] Handlungsprodukt-Fläche grosszügig (mind. halbe Seite).
- [ ] Austausch + Dekontext (aus `set`) als letzte Sektion vorhanden.

DOC-S (`info`, je A/B/C):
- [ ] Mindmap vollständig ausgefüllt (alle `punkte`).
- [ ] Null Eingabe-Affordances, sonst inhaltsgleich zu `fill`.

DOC-KN-S (je Typ):
- [ ] Hybrid-Situation + Leitfrage im Kopf.
- [ ] Typ-korrekter Aufgabenteil (FG=Fragen, MC=Aufgaben+Felder, WS=Werkwahl+Reflexion).
- [ ] Gestrippte Rubrik (Name+Dimension+Niveaubänder), **keine** `stufen`-Texte, **keine** `k_stufe`.

DOC-KN-LP:
- [ ] Alle 3 KN-Typen mit `k_stufe`-Badges.
- [ ] Alignment-Tabelle (Hybrid-Szene → Subfacette A/B/C).
- [ ] Bewertungs-Grid: 4 Kriterien × 4 Stufen, Dimension-Spalte sichtbar, **getrennte SuK-Note + Ges-Note**, ankreuzbar im Druck.

Global:
- [ ] Druck = saubere A4-Seiten, keine zerrissenen Blöcke, Farben drucken ohne Nutzer-Einstellung.
- [ ] Kein Eszett irgendwo im UI.
- [ ] Eine self-contained HTML-Datei pro Rendering, „Drucken"-Button vorhanden.

---

## Anhang A — Farbwerte (Kopiervorlage)

```
Situation A  Akzent #C0392B  Fläche #FADBD8  Sekundär #E74C3C
Situation B  Akzent #1A5276  Fläche #D6EAF8  Sekundär #2E86C1
Situation C  Akzent #1E8449  Fläche #D5F5E3  Sekundär #27AE60
KN / LP      Akzent #2C3E50  Fläche #ECF0F1  Sekundär #7F8C8D
Schreiblinie #BDC3C7   Zeilenabstand 8.5mm
```

## Anhang B — Hinweise (für Pietro, nicht fürs Design-Team)

1. **Stufen-Zählung inkonsistent in `kn.json`:** `rubrik_shared.kriterien[].stufen[]` hat 4 Einträge (Index 0 = tiefste). Die `niveaubaender` referenzieren sie 1-basiert als „Stufe 1–4" und „Stufe 4 in mind. 3 Kriterien". Quick Ref §5 nutzt dagegen 0–3 (3 = best). Der Renderer rendert die 4 Einträge in Reihenfolge — die Zählweise ist ein **Content-Thema**, kein Render-Thema. Vor breitem Rollout angleichen (entweder JSON auf 0–3 oder Quick Ref auf 1–4).
2. **DOC-KN-S vs. Werkklassen:** der KN läuft über **eine** Hybrid-Situation für alle, unabhängig von A/B/C. Darum standalone, klassenweit — kein Build pro Situationsfarbe. Falls du je farbcodierte KN-Blätter willst, ist das ein neuer Fork.
3. **`info`-Variante Doppelnutzen:** das ausgefüllte `info`-DOC-S ist faktisch eine Muster-/Projektionskopie und kann LP zusätzlich als Lösungsorientierung dienen — auch wenn es formal Schüler-Material ist.
