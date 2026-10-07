# Beweis — was Skripte und drei Audit-Rollen an den Altständen finden

Stand 07.10.2026. Gemessen an drei Einheiten (3.3.1, 4.2.1, 1.2.1) am Altstand `ba2732c`, gegen 138 bekannte Fehler der Abschlussrunde vom 05.10.2026 (Messlatte, IDs `M-331-…`, `M-421-…`, `M-121-…`). **Was lief:** die Prüfskripte über die ganze Einheit; das Lösungs-Audit nur am Paket Heft B · mit_medien (18–19 von rund 135 Lösungsfeldern je Einheit; an 3.3.1 mit Opus und mit Sonnet); das Fakten-Audit (Opus, mit Netz) begrenzt auf höchstens 45 Aussagen; die Lösbarkeitsprobe (Sonnet) nur an Heft B mit Medien. `check-v42` und `check-links` liefen am Altstand nicht.

**Zählregeln:** *gefunden* = dasselbe Feld und derselbe Sachverhalt, als Urteil der Rolle oder als Skriptmeldung ohne Zusatzdatei. *Nur bemerkt* = eigene Kategorie, kein «gefunden»: Sachverhalt steht nur in `bemerkung` (Urteil «stimmt» / «belegt»), nur in der Rückgabe der Lernenden (nicht in probe.json), nur als nachgelieferter Beleg oder nur an einem Nachbarfeld. *In Reichweite* = das Feld lag im Material mindestens einer gelaufenen Rolle.

## 1. Tabelle 1 — Art der Messlatte × Ergebnis

**Summe der drei Einheiten**

| Art | Fehler | in Reichweite | Skript | Rolle | nur bemerkt | in Reichweite nicht gefunden |
| --- | --- | --- | --- | --- | --- | --- |
| Zeiger | 10 | 5 | 1 | 0 | 0 | 4 |
| Zeitmarke | 6 | 5 | 1 | 0 | 0 | 4 |
| Zahl/Rechnung | 4 | 1 | 0 | 0 | 0 | 1 |
| Recht/Sache | 25 | 19 | 0 | 7 | 7 | 5 |
| Widerspruch zwischen Seiten | 24 | 8 | 0 | 0 | 0 | 8 |
| Lösbarkeit | 35 | 15 | 0 | 0 | 6 | 9 |
| Ableitung als Quellenaussage | 20 | 10 | 0 | 0 | 1 | 9 |
| Überlauf/Budget | 1 | 0 | 0 | 0 | 0 | 0 |
| Sprache/Form | 8 | 3 | 0 | 0 | 0 | 3 |
| Sonstiges | 5 | 3 | 0 | 0 | 0 | 3 |
| **Summe** | **138** | **69** | **2** | **7** | **14** | **46** |

Von den 46 in Reichweite nicht gefundenen: 24 übersehen · 8 gesehen und anders beurteilt · 14 von keiner Rolle in dieser Form geprüft. 69 Zeilen lagen ausserhalb jedes Laufs (anderes Heft, andere Spur, Auftragsbogen, Kern-Lösungen, ausserhalb der 45 Aussagen); darunter eine, die ein Skript nur mit einer nachträglichen fall.json trifft (M-121-06). Alle 7 Funde einer Rolle stammen vom Fakten-Audit (M-331-02, -05, -06; M-421-05, -15, -17, -30). Lösungs-Audit (Opus und Sonnet) und probe.json: 0. Die 14 nur bemerkten: Fakten-Audit 7, Lösungs-Audit Opus 3, Lernende 4.

Je Einheit, in dieser Reihenfolge: 3.3.1_kaufvertrag_beurteilen · 4.2.1_risiken_absichern · 1.2.1_lernzeit_planen.

| Art (3.3.1) | Fehler | in Reichweite | Skript | Rolle | nur bemerkt | in Reichweite nicht gefunden |
| --- | --- | --- | --- | --- | --- | --- |
| Zeiger | 3 | 1 | 1 | 0 | 0 | 0 |
| Zeitmarke | 2 | 2 | 1 | 0 | 0 | 1 |
| Recht/Sache | 12 | 8 | 0 | 3 | 2 | 3 |
| Widerspruch zwischen Seiten | 9 | 5 | 0 | 0 | 0 | 5 |
| Lösbarkeit | 14 | 6 | 0 | 0 | 3 | 3 |
| Ableitung als Quellenaussage | 3 | 2 | 0 | 0 | 1 | 1 |
| Sprache/Form | 2 | 1 | 0 | 0 | 0 | 1 |
| Sonstiges | 2 | 1 | 0 | 0 | 0 | 1 |
| **Summe** | **47** | **26** | **2** | **3** | **6** | **15** |

| Art (4.2.1) | Fehler | in Reichweite | Skript | Rolle | nur bemerkt | in Reichweite nicht gefunden |
| --- | --- | --- | --- | --- | --- | --- |
| Zeiger | 2 | 2 | 0 | 0 | 0 | 2 |
| Zahl/Rechnung | 4 | 1 | 0 | 0 | 0 | 1 |
| Recht/Sache | 13 | 11 | 0 | 4 | 5 | 2 |
| Widerspruch zwischen Seiten | 9 | 3 | 0 | 0 | 0 | 3 |
| Lösbarkeit | 13 | 5 | 0 | 0 | 1 | 4 |
| Ableitung als Quellenaussage | 5 | 2 | 0 | 0 | 0 | 2 |
| Überlauf/Budget | 1 | 0 | 0 | 0 | 0 | 0 |
| Sprache/Form | 2 | 1 | 0 | 0 | 0 | 1 |
| Sonstiges | 1 | 0 | 0 | 0 | 0 | 0 |
| **Summe** | **50** | **25** | **0** | **4** | **6** | **15** |

| Art (1.2.1) | Fehler | in Reichweite | Skript | Rolle | nur bemerkt | in Reichweite nicht gefunden |
| --- | --- | --- | --- | --- | --- | --- |
| Zeiger | 5 | 2 | 0 | 0 | 0 | 2 |
| Zeitmarke | 4 | 3 | 0 | 0 | 0 | 3 |
| Widerspruch zwischen Seiten | 6 | 0 | 0 | 0 | 0 | 0 |
| Lösbarkeit | 8 | 4 | 0 | 0 | 2 | 2 |
| Ableitung als Quellenaussage | 12 | 6 | 0 | 0 | 0 | 6 |
| Sprache/Form | 4 | 1 | 0 | 0 | 0 | 1 |
| Sonstiges | 2 | 2 | 0 | 0 | 0 | 2 |
| **Summe** | **41** | **18** | **0** | **0** | **2** | **16** |

## 2. Die Ziele

| Ziel | Urteil | Zahl |
|---|---|---|
| Jeder Zeiger-, Zahlen- und Zeitmarkenfehler vom Skript | **nein** | 2 von 20 (Zeiger 1/10, Zeitmarke 1/6, Zahl/Rechnung 0/4); von 11 in Reichweite der Rollen blieben 9 ungefunden |
| Jeder Rechts- und Sachfehler vom Fakten-Audit | **teilweise** | 7 von 25 als Urteil; 7 nur bemerkt (3 davon: Beleg nachgeliefert); 5 in Reichweite nicht gefunden; 6 ausserhalb der 45 Aussagen |
| «Keine echte Wahl» / «Stufe 3 unerreichbar» von der Lösbarkeitsprobe | **nein** | Messlatte führt keine Zeile genau dieser Art. Von 50 Zeilen mit erwartetem Finder «Probe» lagen 22 in Reichweite: probe.json 0, Lernende 4 (nur Rückgabe), 16 übersehen. Neu: 2 × Stufe 3 unerreichbar, 3 × Form weicht ab, 0 × keine echte Wahl |

## 3. Tabelle 2 — neue Befunde ausserhalb der Messlatte (Auswahl 25 von 41; heute am Repo geprüft)

| Rolle | Einheit | Feld | Kurzbezeichnung | Heute |
|---|---|---|---|---|
| Fakten | 3.3.1 | herausforderung_A.json › leitfragen[LF1].loesung.zeilen[1].text | Faustregel zur Lohnhöhe ohne amtliche Stelle (nicht_belegbar) | ja |
| Fakten | 3.3.1 | herausforderung_B.json › leitfragen[LF1].loesung.zeilen[1].text | Aufbewahrungspflicht im Gesetz nicht zu finden (nicht_belegbar) | ja |
| Fakten | 3.3.1 | set.json › gemeinsamer_auftrag.erwartungshorizont.tragfaehig | Fristrechnung ab Zusage auch im Musterentscheid (OR 40e Abs. 2) | ja |
| Fakten | 3.3.1 | begleiter.md › Absatz 171 | Fristbeginn als offene Annahme (Spiegelung M-331-06) | nein |
| Fakten | 4.2.1 | set.json › glossar[13].definition | Abgrenzung der Drittperson ohne gesetzliche Grundlage (SVG 63, OR 41) | ja |
| Fakten | 4.2.1 | herausforderung_B.json › leitfragen[LF1].loesung.zeilen[1].text | dieselbe Abgrenzung in der Lösung | ja |
| Fakten | 4.2.1 | herausforderung_A.json › spuren.ohne_medien.leitfragen[LF3].loesung.raster_zeilen[3][1] | Transportkosten als ungedeckt geführt (KLV 26; Sachverhalt M-421-05) | ja |
| Fakten | 4.2.1 | herausforderung_B.json › leitfragen[LF1].loesung.zeilen[5].text | Selbstbehalt für Junge ist Vertragspraxis (nicht_belegbar) | ja |
| Fakten | 4.2.1 | set.json › glossar[22].definition | Altersgrenze für Junglenker ohne amtliche Stelle (nicht_belegbar) | ja |
| Fakten | 4.2.1 | begleiter.md › Absatz 129 | Fassungsdaten überholt (Spiegelung M-421-30) | nein |
| Fakten | 1.2.1 | begleiter.md › Absatz 135, 152, 154; quellen/q-121b-vertiefung-1.json › datum | Seite als undatiert geführt, trägt ein Aktualisierungsdatum | ja |
| Fakten | 1.2.1 | begleiter.md › Absatz 152; quellen/q-121b-pflicht-ersatz.json › datum | Sendedatum statt Artikeldatum | ja |
| Fakten | 1.2.1 | herausforderung_A.json › leitfragen[LF2].loesung.zeilen[1].text; methoden/lm-20-5-lernplanung.json › merk | Planungsrichtwert ohne prüfbare Primärstelle (3 × nicht_belegbar) | ja |
| Lösungs-Audit Opus | 3.3.1 | herausforderung_B.json › spuren.mit_medien.leitfragen[LF3].loesung.raster_zeilen[0..3] | Bildeintrag der Rasterlösung vom Archivtext nicht getragen (4 × ableitung) | ja |
| Lösungs-Audit Opus, Sonnet | 3.3.1 | … leitfragen[LF3].loesung.zeilen[0] | Marke 02:31 liegt 7 s vor der Aussage | ja |
| Lösungs-Audit Opus | 3.3.1 | … leitfragen[LF3].loesung.zeilen[1] | Marke 00:26 liegt 4–7 s vor der Aussage | ja |
| Lösungs-Audit Opus | 3.3.1 | … leitfragen[LF4].loesung.erwartungshorizont.beispiel_pol_2 | Lehrmittelaussage (S. 62) als eigene Deutung bezeichnet | ja |
| Lösungs-Audit Opus | 4.2.1 | herausforderung_B.json › spuren.mit_medien.leitfragen[LF3].loesung.zeilen[4] | Zählregel der Absätze gilt nur für zwei von vier Quellen (falsch) | ja |
| Lösungs-Audit Opus | 4.2.1 | … leitfragen[LF3].loesung.raster_zeilen[1], [2] | genannter Zwischentitel steht einen Absatz vor der Spanne | ja |
| Lösungs-Audit Opus | 1.2.1 | herausforderung_B.json › spuren.mit_medien.leitfragen[LF3].loesung.raster_zeilen[3][2] | Funktion des Sprechers steht nur ausserhalb des Ausschnitts | ja |
| Probe | 3.3.1 | herausforderung_B.json › handlungsprodukt.loesungsbild.bloecke[1] | Lösungsbild zeigt einen Block, den die Abgabe nicht verlangt | ja |
| Probe | 4.2.1 | herausforderung_B.json › feedback_kriterien[1].stufen[3] | Stufe 3 verlangt Übertragung ohne Auftrag und Platz | ja |
| Probe | 4.2.1 | herausforderung_B.json › handlungsprodukt.loesungsbild.bloecke[2] | drei Zeilen mit Seiten statt zwei Rasterzeilen | ja |
| Probe | 1.2.1 | herausforderung_B.json › feedback_kriterien[1].stufen[3] | Stufe 3 verlangt einen neuen Fall ohne Auftrag | ja |
| Lernende (nur Rückgabe) | 4.2.1 | herausforderung_B.json › lernfortschritt.scaffold_100 | kein Ort für die verlangte Wirkungskette | ja |

Von den 26 Zeilen «abweichend» (19) und «nicht_belegbar» (7) der drei Fakten-Audits liegen 9 an Messlatten-Zeilen (heute behoben oder entschärft). 17 sind neu; davon stehen 15 heute noch im publizierten Stand, 2 sind behoben (beide im Begleiter).

## 4. Opus gegen Sonnet beim Blindlösen (3.3.1, dieselben 18 Felder)

- Urteile: Opus 14 stimmt, 4 ableitung; Sonnet 18 stimmt. Unterschied nur an den vier Rasterzeilen (Bildspalte).
- Treffer an den 4 Messlatten-Zeilen des Pakets: Opus 0, Sonnet 0. Nur bemerkt: Opus 1 ganz (M-331-36), Sonnet dieselbe zur Hälfte. Die Zeitmarken-Zeile M-331-35 fanden beide nicht: Marke 00:50 und Anker liegen am Satzanfang, die Aussage fällt bei 00:58.
- `check-belege` misst die Marke gegen den Anker (Toleranz 3 s), nicht gegen die Aussage. Wer den Anker an den Satzanfang setzt, hält die Prüfung stumm: 0 Meldungen ERR_ZEITMARKE_DANEBEN bei beiden Modellen. Sonnet hat das nach eigener Angabe gezielt getan; Opus setzte daneben einen zweiten Anker auf die Aussage, der in der Spanne der Lösung liegt und ebenfalls nichts auslöst.
- Der Vergleich trennt die Modelle nicht nach Trefferquote, sondern nach Urteilen ungleich «stimmt» (4 gegen 0) und nach der Dichte der Bemerkungen. Für die Frage «genügt Sonnet» reicht ein Paket mit 4 Messlatten-Zeilen nicht.

## 5. Kosten

| Rolle | Modell | Agenten im Lauf | Umfang | Dauer (Angabe der Rückgabe) |
|---|---|---|---|---|
| Lösungs-Audit | Opus | 1 | ein Paket, 18–19 Felder | rund 3–4 min |
| Fakten-Audit | Opus, mit Netz | 1 | höchstens 45 Aussagen | 6–10 min |
| Lösbarkeitsprobe | Sonnet | 2 (Lernende, Bewerter) | ein Heft, eine Spur | nicht angegeben |

Rechnung für eine ganze Einheit, **keine Messung** (`audit-paket.mjs --plan` an 3.3.1: 137 Felder in fünf Paketen zu 47, 20, 49, 18, 3): Lösungs-Audit 5 Agenten, linear nach Feldern rund 23–30 Agenten-Minuten, parallel rund 8–11 Minuten für das grösste Paket. Fakten-Audit ohne Grenze: die Liste nennt 208 · 374 · 180 Stellen, die 45 decken 22 % · 12 % · 18 %; linear rund 28–46, 51–85 und 34–56 Minuten. Probe: 4 Bewerter zusätzlich zu den 4 Lernenden, die es schon gab. Zusammen 10 Agenten für die drei Rollen. Alt (Stand `f314ec1`, gegenleser.md §1): vier Lösungs-Audits je Einheit, Modell Sonnet. Die Dauer des alten Audits ist nirgends gemessen; ein Zeitvergleich ist nicht möglich. Vergleichbar ist nur: 4 Sonnet-Agenten alt, 5 Opus-Agenten neu.

## 6. Mängel des Verfahrens aus dem Probelauf

1. `check-belege` liest «Abs. N» eines Gesetzesartikels als Archiv-Absatz.
2. Zusätzliche Belege neben einer Marke gelten als Fehler; Auditoren liessen Belege weg oder setzten den Anker passend.
3. ERR_ZEITMARKE_DANEBEN misst Marke gegen Anker, nicht Marke gegen Aussage (Abschnitt 4).
4. Das Blind-Paket nennt die Ersatzquelle nicht als Aufgabe und markiert «ausserhalb des Ausschnitts» nicht; Kopfdaten der Quellen (Abruf, Fassung) sind darin nicht prüfbar.
5. `auch_in` verlangt gleichen Wortlaut.
6. Ohne fall.json gehen Sachbefunde in hunderten ERR_FAKT_OHNE_ZEILE unter; mit fall.json fallen gleich grosse Rechtszahlen aus der Liste.
7. Fedlex und ch.ch sind nur mit Browser lesbar.
8. Das Urteil «abweichend» mischt überholten Stand und Sachfehler; `--streng` macht WARN-Codes nicht zu Fehlern.
9. `check-kohaerenz` ANZAHL: 0 von 11 erwarteten Zeilen, 7 falsche Warnungen. ERR_ZEIGER_WOERTER: wahrscheinlich falsche Treffer.
10. `bemerkung` liest kein Skript: 10 Messlatten-Zeilen stehen nur dort.
11. probe.json kennt drei Befundarten; 4 Treffer der Lernenden haben dort keinen Ort.
12. Urteil «ableitung» an einer Rasterzeile löst ERR_ABLEITUNG_UNGEKENNZEICHNET aus; die Zelle kann keine Kennzeichnung tragen.
13. Die Grenze von 45 Aussagen liess 6 von 25 Rechts- und Sachfehlern aus; 15 von 25 haben kein Schriftbild, das die Liste erkennt.
14. Kartenfehler (12 Zeilen) fand keine gelaufene Rolle; der Kartenbeleg lief nicht.
