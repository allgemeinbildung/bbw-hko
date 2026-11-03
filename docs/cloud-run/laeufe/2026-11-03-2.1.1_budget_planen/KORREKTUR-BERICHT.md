# Korrektur nach unabhängiger Gegenlesung

Einheit: `2.1.1_budget_planen`, EBA v4.2 / A2. Stand: 03.11.2026.
Grundlage: `GEGENLESUNG-argon.md`, die vier beauftragten Profil-/Template-Dateien und Gold als Formvergleich.
Keine Commits, Pushes, Deployments, externen Dienste oder Änderungen an Renderer, Skripten und anderen Einheiten.

## Befunde

| Befund | Umsetzung / Begründung |
|---|---|
| A-01 | Beide Legenden geleert. Beschriftete Kostenposten und Summen sind ohne zusätzliche Symbolsprache verständlicher. |
| A-02 | A-02: Ausflugsbudget 550 − 150 − 200 − 50 = 150. A-03: Radio 80, zwei Raten zu 42, Aufpreis 4, Monatsrest 65; Sparplan viermal 20. B-02: Rucksackbudget 85, Angebote 20/55/95, Reste 65/30, Fehlbetrag 10. Keine der verbotenen Fallzahlen in diesen drei Beispielen. |
| B-01 | Alle sechs Leitfragen haben eigene Strategien und Satzanfänge. Beide Rasterseiten beginnen mit «Lesen Sie zuerst die Beispielzeile im Raster.» |
| B-02 | Beispiel und Lösung zeigen benannte Einzelposten und Gruppensummen im gleichen Tabellenformat. Schritt 02 nennt den Falltext S. 1 für Einzelposten und das Raster S. 3 für Kontrollsummen. Das Raster bleibt bewusst eine Gruppenübersicht. |
| B-03 | Drei Monate mit je 40 Franken ausdrücklich im Falltext ergänzt. Betrag war bereits im Prüfarchiv deklariert. |
| B-04 | Zusatzzeile bei Leitfrage 1 beider Hefte als «Hinweis für LP» gekennzeichnet; kein zusätzlicher Antwortanspruch. Belege erneut geprüft. |
| B-05 | Ich-Stufen an Budget, Sprechen, Notiz/Gespräch und KN-Fallbearbeitung angepasst. Fachliche Stufen unverändert; jeweils vier Lernendenstufen. Für das Layout kompakt formuliert. |
| B-06 | Schritte 01 und 02 nennen ausdrücklich ein eigenes Blatt für Rechnung und Vergleich. |
| B-07 | Begleiter ergänzt: 135-Minuten-Seitenplan je Heft, Lektionsvorschlag, Coaching pro Leitfrage, konkrete Fehlerhilfen, A3-Einwand und Rollenwechsel, neun getrennte 2-/3-Punkte-Anker F1–F5 und A1–A4. Grenzen der höchsten wirtschaftlichen Stufe erklärt. |
| C-01 | Sechs eigene Suchbegriffpaare und konkrete Selbstprüfaufträge zur jeweiligen Karte. |
| C-02 | Lesemodus: Titel, Wörter, Markieren, Raster und Kontrolle. Sprechmodus: Stichworte, laut üben, 60 Sekunden stoppen, Rückmeldung, zweiter Durchgang. Fester Renderer-Fusstext «So schreiben Sie» bleibt ausserhalb der erlaubten Änderungsfläche. |
| C-03 | «Erfundener Fall.» aus KN-Erzählung entfernt. Fallwerte weiterhin in fall.json deklariert. Gleichartigen Metahinweis aus Info-Karte A-01 entfernt. |
| C-04 | A4 prüft ausdrücklich die Wahl aus Aufgabe 3 bei neuen Kosten, ohne Miete vorzugeben. |
| C-05 | Word-Seitenzählung und visuelle Reserveprüfung durchgeführt: Hefte acht Seiten, Auftrag vier. Geprüfte Word-PDF-Seiten: A/B S. 1, A S. 5, Auftrag A2/A3. Abstand zum Fussbereich, grosse Arbeitsflächen und vollständige Beispieltabellen sichtbar. 0 px bei ausfüllenden HTML-Flächen bleibt ein Messwert, kein nachgewiesener Überlauf. |

Zusätzlich: langen Satz im A-Fall geteilt. Glossardefinitionen in Sie-Form gesetzt. Fallrechnungen aus Glossarbeispielen entfernt. Quer-Check A fragt den selbst errechneten Rest, statt 75 Franken vorzugeben. Auftragskriterium nennt die zu prüfenden Grössen ohne die fertigen Ergebnisse.

## Tore und Export

Die aktuellen Originalausgaben stehen in `*-nach-korrektur.txt` in diesem Laufordner.
Letzter Exportauftrag: `D:/OS/_lab/tmp/budget-korrektur-final`.
Vorheriger vollständig erzeugter Prüfexport: `D:/OS/_lab/tmp/budget-nach-korrektur`.
**Fortsetzung nach Prozessabschluss:** Finale Datenprüfungen und Export sind inzwischen erfolgreich abgeschlossen. Finale Word-Zählung bestätigt 8/8/4 Seiten. Layoutmessung und Schriftprüfung werden nach den vorübergehend hängenden lokalen Aufrufen separat abgeschlossen. Keine Systemprozesse anderer Arbeiten beendet und keine Skripte zur Umgehung geändert.

| Tor | Tatsächlich beobachteter Stand |
|---|---|
| check-all | Final GRUEN, keine Fehler. Sechs durch die Sie-Umstellung verwaiste Faktenwortlaute exakt nachgeführt und erneut geprüft. Zwei Zeitplanwarnungen siehe unten. |
| check-eba | Final GRUEN, 0 Fehler, 0 Warnungen, 0 Hinweise. |
| check-zeiger --export | Final GRUEN, 0 Fehler/Warnungen/Hinweise, mit `D:/OS/_lab/tmp/budget-korrektur-final`. |
| export-v42 | Final erfolgreich: elf HTML-Dokumente, elf zugehörige DOCX und Begleiter-DOCX vollständig erzeugt. |
| messen-v42 | Erster Lauf erkannte Überlauf auf A4 und drei KN-Kriterienseiten. KN durch Kürzung beseitigt. Zweiter Lauf zeigte nur noch A4 mit 63,5 px; A4 darauf nochmals deutlich gekürzt. Abschliessende Messung hängt. **0 Überlauf im letzten Datenstand noch nicht belegt.** |
| check-schriften | Vollständiger Zwischenlauf: alle elf HTML-Dokumente ausschliesslich mit eingebetteten Schriften. Abschliessender Lauf hängt. |
| Word-Seiten | Finale lokale Zählung: Heft A 8, Heft B 8, Auftrag 4. Weitere Dokumente: Dossier 13, Leseblatt 3, KN-LP 7, KN-S je 4, Lösungen je 5, Begleiter 24. Finale Word-PDFs ebenfalls erzeugt. |

Die noch offenen Mess-/Schriftprotokolle können während der laufenden Aufrufe leer oder unvollständig sein. Sie sind bis zum Abschluss ausdrücklich kein Beweis für ein bestandenes Tor. Die finale Glossar-/Quercheckfassung und die neutralen A4-Kriterien wurden zusätzlich im tatsächlich exportierten Seitentext kontrolliert. A4 ist die gezielt noch zu bestätigende Layoutstelle.

## Durchspielprobe am exportierten Seitentext

Keine Unterrichtserprobung mit echten Lernenden; schriftliche Autorenprobe und lokaler Word-PDF-Sichtcheck.

- Heft A: Handy/ÖV als feste Kosten, Freizeit/Kleider als veränderbare Kosten erklären. Im Raster die Gruppen 245, 360 und 100 zuordnen. Rest 780 − 245 − 360 − 100 = 75. Für sofortigen Kauf fehlen 45. Sparen: 3 × 40 = 120, monatlich 35 Rest. Raten: 3 × 44 = 132, monatlich 31 Rest. Neue Rate 20: Ratenweg 11, Sparweg 15. Alle neun Einzelposten stehen im Falltext S. 1; Raster und Produktbeispiel erfüllen verschiedene, ausdrücklich verbundene Aufgaben.
- Heft B: Reparatur und Secondhand erklären. Vergleich 90 − 35 = 55, 90 − 60 = 30; für neu fehlen 30. Reparatur braucht sieben Tage; Secondhand ist sofort nutzbar. Beide begründeten Wahlen bleiben möglich. Stichwortzettel enthält zwei Angaben, Gegenargument, Folge und nächsten Schritt. Sprechprobe und Rückmeldung sind auf S. 5/7 sowie im Dossier angeleitet.
- Auftrag: Einzelplanung auf eigenem Blatt. 100 − 45 = 55; Leihen lässt 25, beim Kauf fehlen 15. Beschluss in 4–5 Sätzen auf A2: Wahl, Kosten, Nachteil, Kaufbedingung und Aufgabenverteilung. A3 enthält drei echte Gesprächsstationen. Einwand zugunsten Besitz mit Finanzierung und ungesichertem Folgeanlass beantworten, Rollen wechseln. Zusatzkosten 10 lassen beim Leihen 15. Kriterien auf A4 beziehen sich auf beide Produkte.
- Dossier: Karten A-01 bis B-03 liefern die Verfahren und Begriffe. Die neuen Beispielrechnungen gehen auf und gehören anderen Fällen an. Leseblattfragen bleiben über die unveränderten fachlichen Kartenaussagen beantwortbar. Sprachhilfen unterscheiden Lesen und Sprechen. Glossar enthält Begriffe statt fertiger Fallrechnungen.
- KN: 180 − 60 = 120 verfügbar; nach Miete oder erster Rate 50. Kaufgesamtpreis 210, noch 140 offen. Miete für den bekannten Anlass tragfähig; Kauf nur unter ausdrücklich geklärter späterer Deckung. A4 mit 20 Zusatzkosten: 30 Rest nach aktueller Zahlung, beim Kauf weiterhin 140 offen. F4 überträgt das Verfahren aus den Heften. F5 benennt Priorität und Nachteil. Werkschau: zwei Sätze Werkwahl, 120–150 Wörter für die drei Reflexionsfragen.
- Verweise am Export geprüft: Heft S. 2 Wörter/LF1, S. 3 Raster, S. 4 Denkhilfe/Wahl, S. 5 Produktbeispiel, S. 6 Methoden, S. 7 Kriterien, S. 8 Abschluss. Auftrag A2 Beschlussnotiz und Heftbezug, A3 Gespräch, A4 Kriterien. Alle sechs Info-Karten existieren im Dossier. Kein zusätzliches Raster und keine nicht vorhandene Arbeitsfläche bestellt.

## Prüfarchiv und Grenzen der Werkzeuge

- `belege.json` sowie A-/B-Teilbelege nach den LP-Labels erneut geprüft und aktualisiert. Anker zur Sie-Form nachgeführt. Keine unabhängige Zweitprüfung behauptet.
- `fakten.json` zu den sprachlich geänderten Definitionen nachgeführt. Drei neue Anker im Begleiter sind ausdrücklich Fallüberlegungen: 180 − 60 − 70 = 50. Als eigene Rechnung, ohne erfundene amtliche Quelle dokumentiert.
- Lücke: Der Faktenscanner behandelt abgeleitete KN-Werte im Begleiter teilweise als Weltbehauptung. Eine Aufnahme als KN-Fallzahl wird dagegen vom Zahlenscanner abgewiesen, wenn der Wert nur im Begleiter und nicht im KN steht. Deshalb explizite Fallüberlegungsbelege in fakten.json; keine fingierten Quellen oder Lernenden-Lösungen ergänzt.
- `check-zeiger --export` braucht einen Ordnerwert. Der im Auftrag verkürzte Aufruf wurde mit dem tatsächlichen Exportpfad ausgeführt.
- Ein fester Dossier-Fusstext «So schreiben Sie» erscheint auch beim Sprechmodus. Die Datenschritte sind passend; die feste Beschriftung erfordert einen späteren Renderer-Fix durch den Auftraggeber.
- Der KN-Wortlaut F4 und die Werkschau verlangen keine zusätzliche Kostenprobe ausdrücklich. Für wirtschaftliche 3 Punkte braucht es die im Begleiter dokumentierte neutrale Nachfrage. Diese Beobachtungsgrenze ist transparent beschrieben.
- Die Kopierwarnung gegenüber Gold kann bei gemeinsamen institutionellen Pflichtformulierungen anschlagen; keine Gold-Inhalte in diese Einheit übernommen.
- Bestehende Meldungen der Gesamtprüfung ausserhalb der Einheit: Methodenkarte `hko-eba-fakt-oder-gefuehl` mit fester Zahl. Zwei Kohärenzwarnungen `WARN_KOH_WOCHE_MINUTE` betreffen die Zeitplanung. Der Begleiter nennt Richtzeiten ausdrücklich als Vorschläge; keine Skriptänderung vorgenommen.
- Physischer Papierdruck und echte 60-Sekunden-/Partnergespräche bleiben Unterrichtserprobung. Der lokale PDF-Sichtcheck ersetzt diese nicht.

## Endlauf (Orchestrator, 03.11.2026)

Messung und Schriftprüfung waren beim Agenten hängen geblieben. Nachgeholt am Export `D:/OS/_lab/eba-gold-2026-10-23/export-2.1.1-end` mit dem letzten Datenstand: `messen-v42` 0 Überlauf in allen 11 HTML-Dokumenten (A4 inklusive), `check-schriften` nur eingebettete Schriften, `check-all` und `check-zeiger --export` grün. Word-Seiten laut finaler Zählung des Agenten 8/8/4.
