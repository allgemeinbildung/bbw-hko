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
Datei ergänzen. Das dafür beste Werkzeug ist die Gegenlesung mit NotebookLM (unten).

---

## Gegenlesung mit NotebookLM

Das Notebook **«Allgemeinbildung26»** (`ad3b8ab1-4720-42fa-b3c4-42058bca3649`) enthält
dieselben 73 Kapitel wie `material/_lehrmittel/`, aber semantisch durchsuchbar. Es ist
kein Inhaltsspeicher — die Texte liegen lokal — sondern ein **Findewerkzeug für die
Kapitelauswahl**.

### Wann — und wann nicht

**Der Notebook füttert diese Tabelle, er ersetzt sie nicht.** Abfragen, wenn eine Zeile
neu ist oder Zweifel bestehen; das Ergebnis hier eintragen. Danach liest die Generierung
nur noch die Tabelle.

**Nicht bei jeder Generierung abfragen.** Der Notebook antwortet nie zweimal gleich —
live abgefragt würden Einheiten nicht reproduzierbar, und jede Generierung würde ohne
Gewinn langsamer. Der Nutzen liegt ausschliesslich in Phase 0 bei der Kapitelauswahl,
wo Trefferquote zählt. Für Seitenanker (`knoten_ref`) ist lokales Lesen strikt besser:
deterministisch, seitengenau, gratis.

### Wie fragen

Fünf Dinge machen den Unterschied — ohne sie übersieht der Notebook belegbar Kapitel:

1. **nRLP-Kompetenztext wörtlich einsetzen**, nicht das Themenwort. «Nachhaltigkeit»
   liefert weniger als der volle Satz «Ich kann die Konsumgewohnheiten … beurteilen».
2. **Ausdrücklich nach Kapiteln fragen, die das Stichwort *nicht* verwenden.** Das ist
   der stärkste Hebel: er fördert genau die Kapitel zutage, die thematisch passen, aber
   kein gemeinsames Vokabular haben.
3. **Exaktes Zeilenformat vorgeben** — `Kap. X.Y | S. aa-bb | Beitrag (max. 12 Wörter)`.
4. **Relevanztrennung verlangen**, z.B. eine Zeile `RANDBEZUG:` vor den Kapiteln mit
   blosser Erwähnung. Er hält sich zuverlässig daran.
5. **«Keine Einleitung, keine Rückfrage am Schluss»** — sonst hängt er einen
   Gesprächsvorschlag an.

Pro Abfrage eine **frische Konversation**: eine Folgefrage in derselben Konversation
wird von der vorherigen geprägt.

Vorlage:

```
Ich plane eine ABU-Unterrichtseinheit zu diesem Kompetenzziel: «{Kompetenztext}»

Nenne mir ALLE Kapitel, die dafür Sachinhalt liefern — auch solche, die das Wort
«{Themenwort}» gar nicht verwenden. Für jedes Kapitel genau eine Zeile im Format:

Kap. X.Y | S. aa-bb | was es zur Kompetenz beiträgt (max. 12 Wörter)

Sortiere nach Relevanz, wichtigste zuerst. Trenne am Schluss mit einer Zeile
«RANDBEZUG:» jene Kapitel ab, die den Begriff nur beiläufig erwähnen.
Keine Einleitung, keine Rückfrage am Schluss.
```

### Wie die Antwort lesen

Die **Seitenzahlen stehen in `references[].cited_text`**, nicht im Antworttext — dort
sind sie als `[Seite: NNN]` eingebettet. Die genannten Bereiche enden typisch **1–2
Seiten früher** als das Kapitel, weil Übungsteil und Glossar wegfallen. Stichprobe über
12 Kapitel: 6 exakt, 6 knapp darunter, keiner falsch. Für `quellen_anker` ist das
brauchbar; für `knoten_ref` trotzdem lokal nachschlagen.

### Wie filtern — in beide Richtungen

**Was er zu viel nennt:** Kapitel, in denen das Stichwort nur im Fliesstext vorkommt,
ohne curricularen Anker. Beispiel aus der 5.1.2-Gegenlesung: `8.4` (Schuldenbremse),
`12.2` (Besteuerung im Konkubinat), `11.1` (AIA) — alles Treffer auf «Steuer», keines
trägt zur Kompetenz bei. Verwerfen.

**Was er zu wenig nennt, ist nicht automatisch falsch.** Die Tabellenzeile ist auf den
ganzen **Lebensbezug** geschlüsselt, die Abfrage meist auf **eine Kompetenz**. Dass er
bei 5.1.2 die Kapitel `6.1`, `6.2`, `3.3`, `3.1` nicht nannte, ist korrekt — die bedienen
die Schwesterkompetenz 5.1.1.

Jede Ergänzung oder Streichung ins **Änderungsprotokoll** unten, mit Begründung. Das
Protokoll ist die Qualitätssicherung der Tabelle.

---

## Dateinamen-Konvention (LM-26)

`{kap}_{Titel_mit_Unterstrichen}.md`, z.B. `20.7_Medienkompetenz.md`,
`18.2_Werte,_Normen,_Moral_und_Ethik.md`, `16.4_Fachgespräch_-_Interview.md`.
Seitenmarker durchgehend kleingeschrieben: `[seite: 186]`.

---

## EFZ 3-jährig (`nrlp_3j.json`)

| LB | Lebensbezug | Kernkapitel | Methodenkapitel |
|---|---|---|---|
| **1.1** | Ausbildung zurechtfinden, konstruktiv kommunizieren | 1.1 Schule und Betrieb · 1.4 Der Lehrvertrag · 1.3 Rechtsgrundlagen · **18.1 Identität** · **18.2 Werte, Normen, Moral und Ethik** | 20.8 Recherchieren · 17.2 Dokumentieren · 17.4 Korrespondenz · 20.7 Medienkompetenz · 19.2 Konflikte · **19.1 Feedback** · **20.1 Kreativitätstechniken** · **17.1 Lesetechnik** · **16.2 Statement** |
| **1.2** | Effektiv lernen, Ressourcen einsetzen | — | 20.5 Lernplanung · 20.6 Lern- und Prüfungsstrategien · 20.4 Arbeitsplanung und Lernjournal · 17.1 Lesetechnik · 20.3 Zielformulierung · 18.4 Motivation |
| **2.1** | Informationen hinterfragen, Quellen durchschauen | 7.1 Medien · 6.6 Interessengruppen | 20.7 Medienkompetenz · 20.8 Recherchieren |
| **2.2** | Ungleichbehandlung und Ausgrenzung diskutieren | 3.4 Migration, Integration und Rassismus · 12.1 Werte · 18.2 Werte, Normen, Moral und Ethik · 18.3 Perspektivenwechsel | 16.1 Diskussion · 17.3 Argumentieren |
| **2.3** | Mitreden, mitgestalten, ernst genommen werden | 3.2 Mitwirkungsrechte und Pflichten · 6.4 Referendum und Initiative · 6.5 Entstehung eines Gesetzes · 6.6 Interessengruppen · 6.2 Bundesstaat Schweiz · 6.7 Übersicht Kanton Zürich | 16.1 Diskussion · 16.2 Statement · 17.3 Argumentieren |
| **3.1** | Überlegte Konsumentscheidungen treffen | 2.1 Lohnbestandteile · 2.2 Budget · 2.3 Zahlungsarten · 8.2 Schulden und Betreibung · 2.6 Geldanlagemöglichkeiten | — |
| **3.2** | Konsum mit Folgen für Umwelt und Gesellschaft | 9.3 Nachhaltigkeit · 1.5 Ökologie im Umfeld · **9.2 Energie** · **9.1 Klima** · 2.7 Preisbildung · 9.4 Mobilität · 11.2 Globalisierung · 8.4 Stabile Preise, Inflation und Deflation · 8.3 Konjunktur | **16.3 Präsentation** |
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
| **5.4** | Internationale Krisen und Konflikte | 11.1 Schweiz – EU · 11.2 Globalisierung · 11.3 Entwicklungsländer · 7.1 Medien · **6.6 Interessengruppen** | 20.8 Recherchieren · **16.2 Statement** |
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

**2026-08-20 (2) — LB 1.1 zusätzlich um `19.1 Feedback` und `16.2 Statement` (Methodenkapitel) ergänzt; zugleich eine **Warnung** zu `17.4 Korrespondenz` protokolliert.** Zweite Gegenlesung mit «Allgemeinbildung26», diesmal nicht auf Kapitelsuche, sondern gegen eine konkrete geplante Aufgabe (adressatengerechte Selbstvorstellung im 1. Lehrjahr). Befund: Das eigentliche Sachkapitel für «was gebe ich von mir zu erkennen» ist **19.2 S. 427** (Kommunikationsquadrat, Teilbotschaft *Selbstkundgabe*) — nicht 17.4. **17.4 S. 398–407 zieht eine Selbstvorstellungs-Aufgabe aktiv in die falsche Richtung**: die Vorlagen zielen auf Bewerbungsschreiben, tabellarischen Lebenslauf und formelle Geschäftskorrespondenz; Lernende liefern dann eine steife Leistungspräsentation statt einer Vorstellung. 17.4 bleibt für LB 1.1 gelistet (Korrespondenz mit dem Betrieb ist ein echter Anwendungsfall), taugt aber nicht als Muster für persönliche Texte. 19.1 S. 425 liefert die Feedbackregeln für Peer-Rückmeldungen, 16.2 S. 368 den schlanken Aufbau Einleitung/Hauptteil/Schluss für ein Kurz-Statement. **Dokumentierte Lücke:** Zur Frage, wo im schulischen Rahmen die Grenze zwischen Offenheit und unangebrachter Preisgabe verläuft, enthält das Lehrmittel nichts — dafür braucht es ein eigenes Scaffold.

**2026-08-20 — LB 1.1 (3J, vom 4J via *wie 3J 1.1* geerbt) um `18.1 Identität`, `18.2 Werte, Normen, Moral und Ethik` (Kernkapitel) und `20.1 Kreativitätstechniken`, `17.1 Lesetechnik` (Methodenkapitel) ergänzt.** Befund aus der Gegenlesung mit dem Notebook «Allgemeinbildung26» für eine Einstiegs-Einheit im 1. Lehrjahr (Selbstvorstellung + eigene Grundbildung erfassen): Der nRLP-Aspekt von 1.1.1 nennt ausdrücklich «Soziale Rollen, Rollenkonflikte» — der Sachtext dazu steht in 18.1 (S. 412: Selbstbild/Fremdbild, Identität als «die Person, für die einen die anderen halten») und 18.2 (S. 413–417: Wertewandel der Jugend), nicht in den bisher gelisteten Kapiteln; beide lagen bisher nur unter LB 4.1 bzw. 8.2. 20.1 liefert auf S. 436 ausgerechnet eine Mindmap «Gesellschaft – Ich beginne meine Lehre», 17.1 die SQ3R-Lesetechnik für Lehrvertrag und Bildungsplan.

**2026-08-16 — LB 3.2 (3J, vom 4J via *wie 3J 3.2* geerbt) um `9.2 Energie`, `9.1 Klima`
(Kernkapitel) und `16.3 Präsentation` (Methodenkapitel) ergänzt.** Befund aus der
Generierung `3.2.1_ernaehrung_nachhaltig_gestalten`: Die inhaltlichen Kernbegriffe der
Kompetenz — graue Energie, Ökobilanz, virtuelles Wasser — stehen in 9.2 (S. 229–230),
nicht in den bisher gelisteten Kapiteln; der nRLP-Aspekt Ökologie nennt ausdrücklich
«Klimawandel» (9.1 S. 220–223); der einzige Sprachmodus der Kompetenz 3.2.1 ist
«Produktion multimedial», wofür 16.3 (S. 369–371, Aufbau + Visualisierung einer
Präsentation) das einschlägige Methodenkapitel ist.

**2026-08-16 — LB 5.4 (4J) um `6.6 Interessengruppen` (Kernkapitel) und `16.2 Statement`
(Methodenkapitel) ergänzt.** Befund aus der Generierung
`5.4.2_internationale_entscheide_wirken_4j`: Der gesellschaftliche Inhalt «Politik:
Interessen verschiedener Akteure» der Kompetenz 5.4.2 wird im Lehrmittel nur in 6.6
(S. 172–179, Verbände/Vernehmlassung/Lobby) getragen; der einzige Sprachmodus der
Kompetenz ist «Produktion mündlich», wofür 16.2 (S. 368, Statement-Aufbau) besser
passt als das bisher einzige Methodenkapitel 20.8 Recherchieren (bleibt bestehen).

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
