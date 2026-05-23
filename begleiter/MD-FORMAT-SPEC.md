# HKO-Begleitdokument — Markdown-Format-Spezifikation

Diese Spezifikation beschreibt das Markdown-Format, das der HKO-Generator
ausgeben soll, damit die Datei mit dem Tool `index.html` 1:1 zu einem
Word-Dokument (`.docx`) mit Schul-Layout konvertiert werden kann.

---

## 1. YAML-Frontmatter (Pflicht, am Datei-Anfang)

```yaml
---
titel: "1.1 Ich finde mich in meiner Ausbildung zurecht und kommuniziere konstruktiv"
untertitel: "Begleit-Dokument für die Lehrperson"
kompetenz: "1.1.1"
kompetenz_slug: "konflikt_kommunizieren"
beruf: "EFZ 3J"
thema: "T1"
fach: "Gesellschaft + Sprache und Kommunikation"
autor: "Vorname Nachname"
stand: "2026-05-22"
version: "1.0"
dateiname: "1.1_konflikt_kommunizieren"   # ohne .docx — wird für Download verwendet
---
```

**Pflichtfelder:** `titel`, `kompetenz`, `autor`, `stand`.
**Optional, aber empfohlen:** alle anderen — sie erscheinen in Kopf-/Fusszeile
und auf der Titelseite.

Werte in Anführungszeichen, wenn sie `:`, `#` oder ähnliche Sonderzeichen
enthalten. Flache Struktur — keine Listen oder verschachtelten Objekte.

---

## 2. Dokumentstruktur (fix, in dieser Reihenfolge)

**Kein `# H1` im Body** — der Titel wird aus `titel:` im Frontmatter
gerendert (vom Tool als gestylter Titelblock mit Eyebrow + Metadaten-Strip
gesetzt). Direkt nach dem Frontmatter beginnt das Dokument mit dem
Einleitungs-Blockquote und der „Auf einen Blick"-Tabelle, dann die
Kapitel als `## H2` in fester Reihenfolge:

```markdown
---
…frontmatter…
---

> Dieses Dokument begleitet dich durch eine vollständige HKO-Einheit …

**Auf einen Blick**

| | |
|---|---|
| Kompetenzversprechen | … |
| Lernbereiche | … |
| Anzahl Einheiten | … |

## 0. So funktioniert diese Einheit
## 1. Das kompetente Endverhalten
## 2. Die drei Herausforderungen im Überblick
## 3A. Situation A — {Titel}
## 3B. Situation B — {Titel}
## 3C. Situation C — {Titel}
## 4. Austausch und Konsolidierung
## 5. Dekontextualisierung — das Prinzip lösen
## 6. Der Kompetenznachweis
## 7. Material-Anhang — alles zum Kopieren
```

Innerhalb von `3A/3B/3C` jeweils dieselben `### H3`-Unterabschnitte:
`Steckbrief`, `Unterrichtsfahrplan`, `Leitfragen mit Coaching-Hinweisen`,
`Material und Scaffolding`, `Reflexion`.

---

## 3. Callouts — strukturierte didaktische Hinweise

**Ersetze die bisherigen Emoji-präfixierten Blockquotes** (🎓 ⚠️ 🎯 🔀 🔧)
durch Obsidian-Style-Callouts mit explizitem Typ. Das Tool erkennt sie
und rendert farbige, beschriftete Boxen.

### Syntax

```markdown
> [!TYP] Optionaler Titel
> Inhalt der ersten Zeile
> Inhalt der zweiten Zeile
>
> Auch mehrere Absätze sind möglich.
```

* `[!typ]` muss in der ersten Zeile direkt nach `>` stehen.
* Typ kleingeschrieben (Liste unten).
* Optionaler Titel nach dem schliessenden `]`.
* Jede Folgezeile beginnt mit `>` (wie ein normaler Blockquote).
* Eine Leerzeile ohne `>` beendet den Callout.

### Erlaubte Typen

| Typ | Verwendung | Ersetzt bisher |
|---|---|---|
| `lernziel` | Lernziele, „So sieht ein gutes Produkt aus", Erfolgskriterien | 🎯 |
| `hinweis` | Neutrale Information für die Lehrperson | — |
| `beispiel` | Beispiel, Anker-Beispiel, guter Transfer | — |
| `warnung` | Stolperstein, Beurteilungsfehler, Kontrolle des Erwerbs | ⚠️ |
| `reflexion` | Reflexionsfragen, Selbstauswertung | — |
| `coaching` | Coaching-Move für die Lehrperson | 🎓 |
| `mehrdeutigkeit` | Mehrdeutigkeit halten (Trade-off offen lassen) | 🔀 |
| `differenzieren` | Differenzierung (scaffold_90 / scaffold_100) | 🔧 |

### Beispiele

```markdown
> [!coaching] Murmelrunde vor Begründung
> 2 Min. stille Entscheidung, dann Murmelrunde zu zweit, dann erst schriftliche
> Begründung. Frage in der Murmelrunde: „Was spricht gegen deine Wahl?"

> [!warnung] Stolperstein
> Lernende greifen reflexhaft zur stärksten Stufe und überspringen die
> Eskalationslogik. Erinnere an die Reihenfolge „1. Selbstkritik → 2. direktes
> Gespräch → …".

> [!lernziel] So sieht ein gutes Produkt aus
> Nennt mindestens drei Pflichten und drei Rechte, ordnet jede einem
> OR-/ArG-Artikel zu …

> [!mehrdeutigkeit]
> Beide Pole sind legitim — Rechte durchsetzen UND Beziehung erhalten.

> [!differenzieren]
> scaffold_90 = Vorlagen vorgegeben · scaffold_100 = ohne Vorlagen, zusätzlich
> Vergleich mit kantonaler Musterregelung.
```

### Generische Blockquotes bleiben erlaubt

`>` ohne `[!typ]` wird weiterhin als neutrales Zitat formatiert — z.B. für
die Situationsbeschreibung, wie sie die Lernenden erhalten:

```markdown
> Du bist Schreiner-Lernende im 1. Lehrjahr bei der Schreinerei Brunner …
>
> **Leitfrage:** Was sagt mein Lehrvertrag …?
```

---

## 4. Unterstützte Standard-Markdown-Elemente

| Element | Syntax | Status |
|---|---|---|
| Überschriften H1–H4 | `#` … `####` | ✅ |
| Bold / Italic | `**bold**` `*italic*` | ✅ |
| Inline-Code | `` `code` `` | ✅ |
| Code-Block (Mono) | ` ``` ` | ✅ (für Lückentexte, Mindmaps) |
| Listen ungeordnet | `- item` | ✅ (verschachtelt = 2 Spaces) |
| Listen geordnet | `1. item` | ✅ |
| Checkboxen | `- [ ]` / `- [x]` | ✅ |
| Tabellen | Pipe-Syntax | ✅ |
| Horizontale Trennlinie | `---` | ✅ (= dünne Trennlinie) |
| Links | `[text](url)` | ✅ (Fussnote im Word) |

---

## 5. Konventionen für Tabellen

* Tabellen mit **zwei** Spalten ohne Header (`| | |`) werden als
  **Steckbrief-Tabelle** gerendert (linke Spalte fett, schmaler).
* Tabellen mit Header-Zeile werden als reguläre Datentabellen gerendert
  (Header-Zeile farbig hinterlegt).
* Markiere Beispielzeilen in Scaffolds mit `*kursiv*` — sie werden im
  Word leicht grau dargestellt, damit Lernende sie als „Vorbild" erkennen.

---

## 6. Konventionen für Code-Blöcke (Lückentexte, Skelette, Mindmaps)

```markdown
\`\`\`
BEHAUPTUNG (1 Satz, Ich-Form)
  „Aus meiner Sicht ist ____________ nicht mit meinem Lehrvertrag vereinbar,
   weil ____________."

BEGRÜNDUNG (2-3 Sätze, mit Artikel-Verweis)
  …
\`\`\`
```

Keine Sprach-Annotation nötig (`\`\`\`text` ist unnötig).
Code-Blöcke werden im Word in Mono-Font mit grauem Hintergrund gerendert.

---

## 7. Seitenumbrüche

**Automatisch vor jedem `## H2`.** Im Word wird vor jedem Hauptkapitel
(Heading 2) ein Seitenumbruch gesetzt — manuelles `---` ist dafür **nicht
mehr nötig**. Wenn der Generator weiterhin `---` zwischen Kapiteln emittiert,
schadet das nicht (es wird zur dünnen Trennlinie und ist meist auf der vorigen
Seite kaum sichtbar). Lass es zur Lesbarkeit der Quelldatei aber gern stehen
oder entferne es.

---

## 8. Was (noch) nicht unterstützt wird

* Bilder (`![alt](pfad)`) — kommt, falls gewünscht
* Mathematische Formeln (`$…$`)
* Fussnoten (`[^1]`)
* HTML-Tags im Markdown

Wenn der Generator solche Elemente erzeugt, werden sie als Text dargestellt
(graceful degradation), aber das Layout passt nicht.

---

## 9. Migrations-Checkliste für den Generator-Skill

Damit das aktuelle Sample (vor der Anpassung) zum neuen Format wird,
muss der Skill folgende **drei** Änderungen vornehmen:

1. **YAML-Frontmatter** am Anfang einfügen (alle Metadaten, die heute
   in der „Kopfzeile" als Bold-Text stehen).
2. **Emoji-Blockquotes ersetzen** durch typisierte Callouts:
   * `> 🎓 **Coaching-Move:** …` → `> [!coaching]\n> …`
   * `> ⚠️ **Stolperstein:** …` → `> [!warnung]\n> …`
   * `> 🎯 **So sieht ein gutes Produkt aus:** …` → `> [!lernziel]\n> …`
   * `> 🔀 **Mehrdeutigkeit halten:** …` → `> [!mehrdeutigkeit]\n> …`
   * `> 🔧 **Differenzieren:** …` → `> [!differenzieren]\n> …`
3. **Header-Bold-Block entfernen** (steht jetzt im Frontmatter):
   * `**Kompetenz 1.1.1 · konflikt_kommunizieren · EFZ 3J · Thema T1**`
   * `**Für die Lehrperson · Stand 2026-05-22**`

Sonst bleibt alles wie bisher — die Tabellen, Listen, Codeblöcke und der
Aufbau in Kapitel 0–7 funktionieren ohne Änderung.
