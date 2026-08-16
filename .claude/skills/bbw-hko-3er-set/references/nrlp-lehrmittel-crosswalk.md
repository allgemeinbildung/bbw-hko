# nRLP → Lehrmittel-Crosswalk

**Warum es diese Datei gibt.** Die nRLP-Nummerierung und die Lehrmittel-Nummerierung
sind zwei voneinander unabhängige Systeme, die sich zufällig überschneiden. Aus
`nRLP 2.1.2` folgt **nicht** Lehrmittel-Kapitel `2.1`.

```
nRLP 2.1.2  = «Manipulation und Desinformation erkennen»
Lehrmittel 2.1 = «Lohnbestandteile»        ← komplett falsches Kapitel
richtig wäre  = 7.1 Medien, 20.7 Medienkompetenz, 20.8 Recherchieren
```

Nur bei T1 fällt die Kollision nicht auf (nRLP 1.1 «Ausbildung» ↔ Lehrmittel 1.1
«Schule und Betrieb»). Deshalb ist der Fehler lange unbemerkt geblieben — alle
bisherigen Einheiten liegen in T1.

**Regel: niemals den Dateinamen aus der nRLP-Nummer ableiten. Immer diese Tabelle.**

---

## Verwendung in Phase 0

1. `lebensbezug_nr` (`X.Y`) und Lehrgang bestimmen.
2. Zeile in der passenden Tabelle unten nachschlagen.
3. Die gelisteten Dateien aus `material/_lehrmittel/` laden.
4. Kapitel-Index aus den `[seite: XX]`-Markern bauen.

**Kernkapitel** tragen den Sachinhalt. **Methodenkapitel** (16.x–20.x) liefern das
sprachliche bzw. selbstorganisatorische Handwerkszeug und sind querschnittlich —
nur die aufführen, die zum Sprachmodus der Kompetenz passen.

Steht ein Lebensbezug nicht in der Tabelle: **nicht raten.** Über Kapiteltitel und
Inhalt suchen, Vorschlag der Lehrperson vorlegen, bestätigen lassen, danach diese
Datei ergänzen.

---

## Dateinamen-Konvention (LM-26)

`{kap}_{Titel_mit_Unterstrichen}.md`, z.B. `20.7_Medienkompetenz.md`,
`18.2_Werte,_Normen,_Moral_und_Ethik.md`, `16.4_Fachgespräch_-_Interview.md`.
Seitenmarker durchgehend kleingeschrieben: `[seite: 186]`.

---

## EFZ 3-jährig (`nrlp_3j.json`)

| LB | Lebensbezug | Kernkapitel | Methodenkapitel |
|---|---|---|---|
| **1.1** | Ausbildung zurechtfinden, konstruktiv kommunizieren | 1.1 Schule und Betrieb · 1.4 Der Lehrvertrag · 1.3 Rechtsgrundlagen | 20.8 Recherchieren · 17.2 Dokumentieren · 17.4 Korrespondenz · 20.7 Medienkompetenz · 19.2 Konflikte |
| **1.2** | Effektiv lernen, Ressourcen einsetzen | — | 20.5 Lernplanung · 20.6 Lern- und Prüfungsstrategien · 20.4 Arbeitsplanung und Lernjournal · 17.1 Lesetechnik · 20.3 Zielformulierung · 18.4 Motivation |
| **2.1** | Informationen hinterfragen, Quellen durchschauen | 7.1 Medien · 6.6 Interessengruppen | 20.7 Medienkompetenz · 20.8 Recherchieren |
| **2.2** | Ungleichbehandlung und Ausgrenzung diskutieren | 3.4 Migration, Integration und Rassismus · 12.1 Werte · 18.2 Werte, Normen, Moral und Ethik · 18.3 Perspektivenwechsel | 16.1 Diskussion · 17.3 Argumentieren |
| **2.3** | Mitreden, mitgestalten, ernst genommen werden | 3.2 Mitwirkungsrechte und Pflichten · 6.4 Referendum und Initiative · 6.5 Entstehung eines Gesetzes · 6.6 Interessengruppen · 6.2 Bundesstaat Schweiz · 6.7 Übersicht Kanton Zürich | 16.1 Diskussion · 16.2 Statement · 17.3 Argumentieren |
| **3.1** | Überlegte Konsumentscheidungen treffen | 2.1 Lohnbestandteile · 2.2 Budget · 2.3 Zahlungsarten · 8.2 Schulden und Betreibung · 2.6 Geldanlagemöglichkeiten | — |
| **3.2** | Konsum mit Folgen für Umwelt und Gesellschaft | 9.3 Nachhaltigkeit · 1.5 Ökologie im Umfeld · 2.7 Preisbildung · 9.4 Mobilität · 11.2 Globalisierung · 8.4 Stabile Preise, Inflation und Deflation · 8.3 Konjunktur | — |
| **3.3** | Pflichten und Rechte beim Einkaufen | 2.4 Kaufvertragsarten Teil 1 · 8.1 Kaufvertragsarten Teil 2 · 2.5 Vertragsarten · 1.3 Rechtsgrundlagen | 17.4 Korrespondenz |
| **4.1** | Körperliches und psychisches Wohlbefinden | 18.1 Identität · 18.2 Werte, Normen, Moral und Ethik · 4.3 Gesundheit und Sucht | 18.4 Motivation |
| **4.2** | Gesundheitliche und finanzielle Risiken | 4.1 Versicherungswesen allgemein · 4.2 Kranken- und Unfallversicherung · 5.1 Sachversicherungen · 5.2 Haftpflichtversicherungen · 5.3 Verantwortung | — |
| **4.3** | Vielfältige Gesellschaft, Respekt | 3.4 Migration, Integration und Rassismus · 12.2 Lebensformen · 12.1 Werte | 18.3 Perspektivenwechsel |
| **5.1** | Rechte und Pflichten in der Schweiz | 6.1 Die wichtigsten Aufgaben eines Staates · 6.2 Bundesstaat Schweiz · 3.2 Mitwirkungsrechte und Pflichten · 10.1 Steuern · **2.1 Lohnbestandteile** · **1.3 Rechtsgrundlagen** · 3.3 Strafrecht und Jugendstrafrecht · 3.1 Entwicklung der modernen Schweiz | — |
| **5.2** | Gesetze und politische Entscheidungen verändern | 6.3 Gewaltenteilung · 6.5 Entstehung eines Gesetzes · 6.4 Referendum und Initiative · 6.7 Übersicht Kanton Zürich · 1.3 Rechtsgrundlagen | 16.2 Statement · 17.3 Argumentieren |
| **5.3** | Globale gesellschaftliche Herausforderungen | 9.1 Klima · 9.2 Energie · 9.3 Nachhaltigkeit · 11.1 Schweiz – EU · 11.2 Globalisierung · 11.3 Entwicklungsländer | 7.1 Medien · 20.8 Recherchieren |
| **6.1** | Wohnung finden, Umzug planen | 14.1 Wohnen und Miete · 2.2 Budget | 20.2 Projektplanung |
| **6.2** | Mietvertrag und Versicherungen | 14.1 Wohnen und Miete · 2.5 Vertragsarten · 5.1 Sachversicherungen · 5.2 Haftpflichtversicherungen · 1.3 Rechtsgrundlagen | 17.4 Korrespondenz |
| **6.3** | Wohn- und Lebensformen | 12.2 Lebensformen · 14.1 Wohnen und Miete · 9.3 Nachhaltigkeit | — |
| **T7** | Schlussarbeit *(keine Lebensbezüge im nRLP)* | — | 20.2 Projektplanung · 20.8 Recherchieren · 17.2 Dokumentieren · 20.3 Zielformulierung · 20.1 Kreativitätstechniken · 16.3 Präsentation |
| **8.1** | Technologische Entwicklungen | 7.1 Medien · 1.2 Grundlagen BWL | 20.7 Medienkompetenz · 20.8 Recherchieren |
| **8.2** | Berufliche Zukunft planen | 15.2 Qualifizierung für den Arbeitsmarkt · 18.1 Identität | 20.3 Zielformulierung · 16.5 Vorstellungsgespräch · 17.4 Korrespondenz |
| **8.3** | Erste Stelle antreten | 15.1 Arbeitsrecht · 15.3 Arbeitslosigkeit | 19.2 Konflikte · 19.3 Teamfähigkeit · 19.1 Feedback |
| **8.4** | Finanzen heute und in Zukunft | 13.1 Die Altersvorsorge · 2.6 Geldanlagemöglichkeiten · 15.3 Arbeitslosigkeit · 8.2 Schulden und Betreibung · 2.2 Budget | — |
| **8.5** | Abschlussprüfung vorbereiten | — | 20.6 Lern- und Prüfungsstrategien · 20.5 Lernplanung · 17.1 Lesetechnik · 16.4 Fachgespräch - Interview |

---

## EFZ 4-jährig (`nrlp_4j.json`)

Der 4J-Lehrgang nummeriert anders. **`3.1` bedeutet hier nicht dasselbe wie im 3J** —
Konsumentscheidungen sind im 4J `1.3`, im 3J `3.1`. Immer den Lehrgang mitprüfen.

| LB | Lebensbezug | Kernkapitel | Methodenkapitel |
|---|---|---|---|
| **1.1** | Ausbildung zurechtfinden | *wie 3J 1.1* | *wie 3J 1.1* |
| **1.2** | Effektiv lernen | *wie 3J 1.2* | *wie 3J 1.2* |
| **1.3** | Überlegte Konsumentscheidungen | *wie 3J 3.1* | — |
| **2.1** | Informationen hinterfragen | *wie 3J 2.1* | *wie 3J 2.1* |
| **2.2** | Ungleichbehandlung und Ausgrenzung | *wie 3J 2.2* (ohne die künstlerische Kompetenz, die im 4J in 2.4 liegt) | 16.1 Diskussion · 17.3 Argumentieren |
| **2.3** | Mitreden und mitgestalten | *wie 3J 2.3* | *wie 3J 2.3* |
| **2.4** | Kunstformen, Meinungen, Rezension | 12.1 Werte · 18.3 Perspektivenwechsel · 7.1 Medien | 17.3 Argumentieren · 17.2 Dokumentieren |
| **2.5** | Umweltfragen diskutieren | 9.1 Klima · 9.3 Nachhaltigkeit · 9.4 Mobilität · 9.2 Energie | 16.1 Diskussion · 17.3 Argumentieren |
| **3.1** | Werbung und personalisierte Inhalte | 7.1 Medien · 2.7 Preisbildung · 1.2 Grundlagen BWL | 20.7 Medienkompetenz |
| **3.2** | Konsum mit Folgen | *wie 3J 3.2* | — |
| **3.3** | Rechte beim Einkaufen | *wie 3J 3.3* | 17.4 Korrespondenz |
| **4.1** | Wohlbefinden | *wie 3J 4.1* | 18.4 Motivation |
| **4.2** | Gesundheitliche und finanzielle Risiken | *wie 3J 4.2* | — |
| **4.3** | Vielfältige Gesellschaft | *wie 3J 4.3* | 18.3 Perspektivenwechsel |
| **4.4** | Verbesserungspotentiale, Geschäftsmodell | 1.2 Grundlagen BWL · 2.7 Preisbildung | 20.1 Kreativitätstechniken · 20.2 Projektplanung · 16.3 Präsentation |
| **5.1** | Rechte und Pflichten | *wie 3J 5.1* | — |
| **5.2** | Gesetze verändern | *wie 3J 5.2* | *wie 3J 5.2* |
| **5.3** | Globale Herausforderungen | *wie 3J 5.3* | *wie 3J 5.3* |
| **5.4** | Internationale Krisen und Konflikte | 11.1 Schweiz – EU · 11.2 Globalisierung · 11.3 Entwicklungsländer · 7.1 Medien | 20.8 Recherchieren |
| **6.1** | Wohnung finden | *wie 3J 6.1* | 20.2 Projektplanung |
| **6.2** | Mietvertrag und Versicherungen | *wie 3J 6.2* | 17.4 Korrespondenz |
| **6.3** | Wohn- und Lebensformen | *wie 3J 6.3* | — |
| **6.4** | Partnerschaft, Zusammenleben, Nachlass | 12.2 Lebensformen · 2.5 Vertragsarten · 1.3 Rechtsgrundlagen | — |
| **T7** | Schlussarbeit | — | *wie 3J T7* |
| **8.1 – 8.5** | Arbeiten in der Zukunft | *wie 3J 8.1 – 8.5* | *wie 3J 8.1 – 8.5* |

---

## EBA 2-jährig

EBA hat **kein Lehrmittel**. Die Skill `hko-2er-EBA-set-generator` erzeugt stattdessen
ein eigenes A2-Wissensdossier (`dossier.json`). Dieser Crosswalk gilt dort nicht.

---

## Pflege

Die Zuordnung ist **fachlich hergeleitet**, nicht aus einer offiziellen Konkordanz
übernommen — Lehrmittel und nRLP stammen aus verschiedenen Quellen. Bei Zweifeln
gilt das Urteil der Lehrperson; Korrekturen bitte direkt hier eintragen.

### Änderungsprotokoll

**2026-08-16 — LB 5.1 um `2.1 Lohnbestandteile` und `1.3 Rechtsgrundlagen` ergänzt.**
Gegenlesung des Eintrags mit dem NotebookLM-Notebook «Allgemeinbildung26» für den
Kompetenztext 5.1.2 (Steuern). Begründung: der **Lohnausweis** ist gemäss Lehrmittel
10.1 S. 250 zwingende Beilage zur Steuererklärung und wird nur in 2.1 eingeführt
(dort auch die Quellensteuer, S. 47); 1.3 verankert die Steuerpflicht als Rechtspflicht
(S. 21) und über die Rechtsfähigkeit ZGB 11 (S. 25). Ebenfalls von NotebookLM
vorgeschlagen, aber **verworfen**: 8.4 (Schuldenbremse), 12.2 (Besteuerung im
Konkubinat), 1.2 (Staat als Anspruchsgruppe), 11.1 (AIA) — Treffer auf das Wort
«Steuer» im Fliesstext ohne curricularen Anker für 5.1.

Dass NotebookLM 6.1, 6.2, 3.3 und 3.1 nicht nannte, ist **kein** Widerspruch: diese
Kapitel bedienen die Schwesterkompetenz 5.1.1 (Aspekt *Recht*), nach der nicht gefragt
war. Die Crosswalk-Zeile ist auf den ganzen Lebensbezug geschlüsselt, nicht auf eine
einzelne Kompetenz.

Ausgabe: **LM-26** (`material/_lehrmittel/`, 73 Kapitel). Die Vorgängerausgabe liegt
unter `material/_lehrmittel_2025/` und hat eine **abweichende Kapitel-17-Nummerierung**
(2026 wurde `17.1 Lesetechnik` eingeschoben, alles danach rutschte um eins). Kapitel
ab 18.1 sind gegenüber 2025 um **+2 Seiten** verschoben.
