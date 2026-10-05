# Nachtrag — Einheit 1.2.1_lernzeit_planen · 05.10.2026

Abschlussdurchgang nach `BERICHT.md`. Kein Lehrmittel-, Artikel- oder Untertiteltext in diesem
Dokument, nur Fundstellen und eigene Formulierungen. Kein Commit, kein Index-Build.

**Urteil: freigabereif nach Gegenhören — unter der Voraussetzung, dass Pietro den Entscheid zu Heft B (Abschnitt 3) trifft.** Tor und Messung sind grün; die Lösungs-Audits melden keinen Sachfehler. Heft A, Auftrag und KN sind ohne Vorbehalt bereit. In Heft B bleibt LF4 «je Kapitel» ohne eigene Annahme nicht entscheidbar (von drei Gegenlesern bestätigt).

## 1. Stand Tor und Messung (nach der letzten Änderung)

- `node scripts/check-all.mjs 1.2.1_lernzeit_planen` → «GRUEN — keine Fehler.»
- `node scripts/export-v42.mjs … --out <scratchpad>/1.2.1_lernzeit_planen` + `messen-v42.mjs` → Exit 0,
  56 Seiten ok, kein Überlauf (Auftragsbogen S. 1 weiterhin 4 px Reserve).
- `begleiter-marker.mjs` ohne `--check` gelaufen (Marker neu gefüllt, 0 unauflösbar).
- Nicht gelaufen: `build:einheiten-index`, `bestand-v42`, `npm run build` (Auftrag: macht der Orchestrator).

## 2. Befunde aus dem Bericht

| # | Befund | Ergebnis |
|---|---|---|
| 1 | Heft B: Lernziel (zwei Kapitel ohne Inhalt) und Probelauf (acht Punkte) prüfen verschiedenen Stoff; LF4 «je Kapitel» freihändig | **braucht Entscheid** (Abschnitt 3). Bestätigt von beiden Lernenden-Gegenlesern zu Heft B. Geändert nur: Schritt 04 setzt keine Aufteilung mehr voraus («was Sie mit jedem der zwei Kapitel tun und wofür Sie das KI-Werkzeug nehmen»); Erwartungshorizont LF4 entsprechend («sagt für jedes der zwei Kapitel …»). Ein Versuch, die Situation zu schärfen («erstes Kapitel sass, zweites nicht»), wurde **zurückgenommen**: Beide Gegenleser stuften ihn als «verrät die Antwort» ein. Situation steht wieder im Wortlaut des Bauplans. |
| 2 | Heft A: 15 Stunden «vor oder nach dem Wegfall» | **behoben**: Schritt 04 «… alle 15 Abendstunden neu, als wäre wieder Sonntag. Probe danach: Hält der Plan, wenn Mi und Fr je 2 Stunden wegfallen?» (auch `format_detail`, Begleiter S. 7). Beide Gegenleser: 15 Stunden jetzt eindeutig. Rest: «hält» ist nicht definiert, und die Probe hat kein eigenes Feld (nur Quer-Check S. 8) — stehen gelassen, Gerüst. |
| 3 | Heft A, Beispiel S. 6: Reserve auf Mittwoch/Freitag | **behoben**: fester Termin Mi, Aufgaben Mo und Fr, Reserve Di und Do; Notiz und Gesprächsausschnitt nachgeführt. Rechnung unverändert (6 von 10 verplant). Neu von Gegenlesern: die Nachfrage im Beispiel ist eine geschlossene Frage (gegen Karte «Arten von Fragen») — nicht bearbeitet, siehe 4. |
| 4 | Auftrag: «ein Reserveabend» neben Richtwert 40 % | **behoben**: «mind. ein Reserveabend» (Wortlaut Bauplan); Begleiter sagt, dass der Richtwert im Auftrag keine Vorgabe ist. «Meilensteine» war für die Fassung mit Medien unerklärt → «zwei Meilensteine (Zwischenziele)». Schritt 02 sprachlich gerichtet und Seitenverweis eindeutig («Heft B, S. 2 und 4»). |
| 5 | «Technologisches Prinzip» im Auftrag | **stehen gelassen**, strukturell (Wortlaut KN, nicht änderbar). Bogen-Leser bestätigt: «wofür nicht», «Ergebnis geprüft», «neuer Fall» haben keinen Auftrag. Ergänzt: Erwartungshorizont des Auftrags nennt jetzt das Werkzeug; Begleiter Kap. 6 hat einen Hinweis, dass für die Rückmeldung die Indikator-Zeile zählt. |
| 6 | Heft A ohne Medien: Kap. 20.4 trägt LF3 dünn | **gemildert**: Rasterauftrag sagt, wo die drei weiteren Aussagen stehen (eine zur Grafik S. 440, zwei S. 441). Gegenleser: füllbar, zweite Rückblick-Zeile dünn. Mehr gibt das Kapitel nicht her. |
| 7 | Richtwert 60/40, SMART, KI: Kennzeichnung | Lösung LF2 genauer: Richtwert gilt im Lehrmittel der **täglichen Arbeitszeit**, das Heft überträgt auf freie Abendstunden einer Woche. SMART und Kap. 20.4 waren gekennzeichnet; KI in der Fassung ohne Medien als Fallüberlegung gekennzeichnet (eigene Durchsicht). **Offen:** Im Heft selbst (Lernenden-Seite) steht die Übertragung Tag → Woche nicht ausdrücklich; beide A-Gegenleser stolpern darüber (S. 2, S. 6). |
| 8 | Lösungen nach den Audits geändert, nicht neu auditiert | **erledigt**: zwei Sonnet-Audits (je Heft beide Fassungen) nach den Änderungen: 0 «falsch», 11 «ungenau», 21 Hinweise; alle Fundstellen, Zeitmarken und Rechnungen bestätigt. Behoben: Befund LF3 Heft B mit Medien (drei Sätze, mit Einschränkung «Vorschlag eines Dozenten, Stand 2024»); «bei Kindern und Jugendlichen»; Lösungsbild B «falsch» statt «ungenau»; Quer-Check B als Fallüberlegung gekennzeichnet; Heft A: vierte Prüffrage im Raster, Ersatzquellen-Befund als Annahme, Folgerung im Befund ohne Medien entfernt. Stehen gelassen: A = hoch/B = mittel/C = niedrig als Lesart des Lehrmittels; Beispielantworten zu LF4 nennen den Richtwert teils ohne Seite; Lösungsbild B zeigt in beiden Fassungen die Zeilen zu Kap. 18.4 (im Hinweis gesagt). |
| 9 | Karte `q-121a-vertiefung-2`: Ablenkung als Strategie | **behoben** (Kurzbeschrieb: Ablenkung fördert das Aufschieben). Begleiter Kap. 3 nachgeführt (Ablenkung = Ursache). Zeitmarke «gemeinsam anpacken» 08:28–08:42. |
| 10 | Drei Quellen ohne Datum | geprüft: feel-ok.ch (2) und jugendundmedien.ch tragen auch im Quelltext kein Datum. «o. D.» bleibt. |
| 11 | Karte `lm-20-6-lernstrategien` | nur gemeldet (Abschnitt 6); `lesen` lässt sich in der Einheit nicht überschreiben. |
| 12 | Videos nur als Untertitel gelesen | Untertitel heute neu geholt (SRG, TTML); Gegenhör-Liste in Abschnitt 5. Zeitmarken in Heft B, Vertiefung 2 gerichtet (21:31–21:49, 22:25–22:33). Kurzbeschrieb `q-121b-vertiefung-2` schreibt die Aussage zum Auslagern nicht mehr «einer Forscherin» zu (aus den Untertiteln nicht belegbar, wer bei 22:02 spricht). |

Weitere Änderungen: URL der Ersatzquelle B auf die heutige Zieladresse; `sachlage_geprueft`
2026-10-05 für sieben Karten (nicht für das PDF); Begleiter `stand`, «einen Einwand» statt
«stärksten Einwand».

## 3. Entscheid für Pietro: Heft B, Lernziel und Probelauf

Lage: LF2 verlangt ein Lernziel für den Kompetenznachweis der Situation (zwei Kapitel ohne
Inhalt), die Abfragerunde läuft über acht Punkte des Hefts, LF4 verlangt einen Entscheid «je
Kapitel», ohne dass die Situation die Kapitel unterscheidet. Das Beispiel auf S. 6 zeigt Ziel
und Protokoll am selben Stoff und verdeckt den Bruch.

- **Variante A (klein, empfohlen):** Das Lernziel gilt dem Probelauf. LF2: Lernziel nach SMART
  für die acht Punkte, dazu ein Satz, wie es auf den Kompetenznachweis übertragen wird; LF4:
  «Entscheiden Sie für Ihre Vorbereitung» statt «je Kapitel», mit genannter Annahme. Betrifft
  LF2, LF4, Schritt 02/04, Lösungen, Begleiter Kap. 4. Ein Executor-Lauf an Heft B, eine Leserunde.
- **Variante B (gross):** Der Fall wird an den Stoff gebunden: Der Kompetenznachweis der
  Situation handelt von den Kapiteln, die das Heft liest. Situation, LF2, LF4, Lösungen,
  Begleiter neu; weicht vom Bauplan §4 ab.
- **Variante C:** lassen. Der Bruch ist benannt («Probelauf»), stört aber beide Gegenleser.

## 4. Gegenleser (Sonnet), eine Runde

Gestartet: vier Lernende Profil a (je Heft und Fassung, ganzes Heft), Bogen-Leser, zwei
Lösungs-Audits (je Heft beide Fassungen), Sweep. Profil b entfällt. Pakete mit vollständigem
Quellentext (geprüft). Alle acht zurück, dazu eine Nachlese (Lernende/r a) über die zwei nach der Runde geänderten Stellen.
Sweep: ein klarer Verstoss (gerade Apostrophe in `prinzip.json`, behoben), fünf Grenzfälle (u. a. Bindestrich statt Halbgeviertstrich in den Zeitangaben von `kn.json`, nicht geändert). Der Sweep hat den Begleiter nur per Mustersuche geprüft.

Nach dem Lesen noch geändert (Abweichung von «gelesen wird zuletzt»): Rücknahme der
Situation B (Folge der Befunde) und der Seitenverweis in Schritt 02 des Auftrags. Beide
Stellen sind in der Nachlese gelesen: Schritt 02 ist im Verweis klar; LF4 «je Kapitel» bleibt ohne Annahme unlösbar (Abschnitt 3), dazu ein milder Widerspruch zwischen Satzanfang S. 4 («Das eine Kapitel …, das andere …») und Karte 1 auf S. 6 («eine Strategie» für beide). Nach der Nachlese wurden nur noch Lösungen (Lehrpersonen-Dokument) und `prinzip.json` geändert, kein Lernenden-Text.

| Leser | Zeit | übernommen | stehen gelassen |
|---|---|---|---|
| A ohne | 121 min | — | «Probe»/«hält» ohne Feld; Übertragung Tag → Woche; geschlossene Frage im Beispiel; «Zwei Zeilen genügen» bei drei Zeilen der Denkhilfe (Renderer/Daten, nicht geprüft) |
| A mit | 129 min | — | Spalte «Beleg / Zahl» bei Quelle ohne Zahl; wie A ohne |
| B ohne | 168 min | Rücknahme Situation | Lernziel ≠ Probelauf; Schritte 01/03/04 ohne Abgabe (Gerüst); Beispielzeile «→ Eingangskanal» nicht herleitbar; «vier Kernaussagen» bei Beispielzeile + drei eigenen |
| B mit | 160 min | Rücknahme Situation | Lernziel ≠ Probelauf; S. 1 nennt Kap. 18.4 (in dieser Fassung ungenutzt), nicht Kap. 20.3; Karte 2 «Schritt fünf ist der Probelauf» gegen S. 380 |
| Bogen | 131 min | Seitenverweis Schritt 02 | Technologisches Prinzip ohne Auftrag; Reserve in Abenden gegen Stunden in Heft A |

Weggefallen: «Quer-Check Heft A S. 8 widerspricht dem Bogen» (Paket-Artefakt: Heftseiten als
Teil des Bogens gelesen). Heft B liegt mit 160–168 min über drei Lektionen (135 min).

## 5. Gegenhör-Liste für Pietro

**Video 1 — Heft A, mit Medien, S. 4 (Vertiefung 2, freiwillig)**
SRF Einstein², «Prokrastination: Warum wir Dinge aufschieben – und was dagegen hilft», 06.06.2023, 10:09.
`https://www.srf.ch/play/embed?urn=urn:srf:video:9ff7436b-8649-4112-a043-65df1f286aee&subdivisions=false`
Sprechende: zwei Personen im Gespräch (aus den Untertiteln erschlossen, Namen nicht belegt).

- [ ] 07:43 Start: laut Untertitel beginnt die Frage schon bei 07:39 — setzt der Ausschnitt mitten im Satz ein?
- [ ] 07:46–07:54 Therapieform für schwere Fälle (nicht Auftrag; zumutbar?)
- [ ] 08:05–08:23 grosse Aufgaben in kleine Pakete teilen → Lösung, Strategie 1
- [ ] 08:28–08:42 in Gruppen anpacken → Strategie 2
- [ ] 08:42–09:04 ständige Ablenkung (Handy, Lärm, E-Mails) als **Ursache** → Lösung und Kurzbeschrieb S. 4
- [ ] 09:09–09:23 früh planen, wann man sich hinsetzt → Strategie 3
- [ ] 09:43–09:47 Listen, abhaken → Strategie 4
- [ ] 09:57 Ende: letzter Satz läuft laut Untertitel bis 10:01

**Video 2 — Heft B, mit Medien, S. 4 (Vertiefung 2, freiwillig)**
SRF Einstein, «KI im Kopf – Machen uns ChatGPT und Co. dumm?», 04.12.2025, 37:12.
`https://www.srf.ch/play/embed?urn=urn:srf:video:c4db64a2-67cf-4bec-93bd-4a6747a077b7&subdivisions=false`

- [ ] 21:10 Start: Off-Stimme stellt eine Forscherin zu KI an Schulen vor
- [ ] 21:31–21:49 O-Ton: Studie mit Klassen, Ausgabe der KI oft ungeprüft übernommen → Lösung, Kurzbeschrieb S. 4
- [ ] 21:49–21:56 Altersempfehlung (nicht Auftrag)
- [ ] 21:56–22:12 Off-Stimme, dann O-Ton: Lernen lässt sich nicht auslagern → Leitfrage der Vertiefung. **Wer spricht ab 22:02 — dieselbe Forscherin oder eine andere Person?**
- [ ] 22:25–22:33 Off-Stimme: erst danach Resultate kritisch hinterfragen → Lösung
- [ ] 23:00 Ende: Satz läuft laut Untertitel bis 23:03
- [ ] Beide: Spielt der Player der QR-Seite `bbw-hko.ch/m/1.2.1_lernzeit_planen` (#a, #b) und lässt sich zur Zeitmarke springen?

Die zwei Quellen von S. 3 sind Texte; es gibt nichts zu hören.

## 6. Vorschläge für geteilte Dateien (nicht geändert)

1. `src/data/methoden/lm-20-6-lernstrategien.json` · `lesen`, letzter Satz · alt: «Mit eigenen Worten wiederholen und jemandem erklären wirkt besser als nochmals lesen.» · neu: «Mit eigenen Worten wiederholen und jemandem erklären nutzt mehrere Eingangskanäle; der Stoff lässt sich so auf mehreren Wegen abrufen.» · Beleg: Kap. 20.6, S. 444, Zeile zu den Eingangskanälen; ein Vergleich mit dem Durchlesen steht dort nicht. `seiten`: alt «S. 444–445» · neu «S. 444» (S. 445 sind Prüfungsstrategien). Gegenleser B ohne hat beides bemerkt.
2. `src/data/methoden/lm-16-4-fragearten.json` · `merk` · alt: «Eine geschlossene Frage bringt ein Ja. Eine offene bringt eine Geschichte.» · neu: «Eine geschlossene Frage bringt eine kurze Antwort. Eine offene bringt eine Geschichte.» · Beleg: Kap. 16.4, S. 373 — Ja/Nein gehört dort zur Entscheidungsfrage.
3. `src/components/einheiten/docs/heft-v42/seiten-1-4.tsx`, Zeile 39 (Typ-Etiketten) · es fehlt `datensatz: 'Datensatz'` · Heft A S. 4 druckt «datensatz · 202 Wörter» klein.
4. `src/data/methoden/hko-uebe-prompt-bauen.json` · «die KI» → «das KI-Werkzeug» (Wortwahl der Hefte); Beispiel-Prompt ohne Rolle im Heftbeispiel S. 6 fällt Lesenden auf.
5. `src/data/methoden/lm-19-1-feedback.json` · Beispiele handeln von einem Gruppentext, nicht von einem Plan (drei Gegenleser).

## 7. Geprüfte Fakten

| Was | Quelle | Abruf |
|---|---|---|
| Alle acht Links erreichbar (HTTP 200); Ersatzquelle B leitet auf neue Adresse um | Aufruf der Adressen | 05.10.2026 |
| Ausschnitte der fünf Textquellen stimmen Absatz für Absatz mit der Live-Seite überein (64 Absätze, 0 Abweichungen) | Live-Seiten gegen Quellenarchiv | 05.10.2026 |
| Titel, Datum, Länge beider Videos; Zeitmarken aller Fundstellen | SRG Integration Layer, Untertitel | 05.10.2026 |
| PDF WorkMed: erreichbar, zuletzt geändert 16.06.2025 | HTTP-Kopf | 05.10.2026 |
| Lehrmittel-Fundstellen (Kap. 16.4, 17.1, 18.4, 19.1, 20.3–20.6) | Kapiteldateien | 05.10.2026 |

Rechtsangaben, Beträge oder Abstimmungsresultate enthält die Einheit nicht.

## 8. Nicht geprüft

- Bild und Ton beider Videos; Player der QR-Seite; Word-Dokumente (nur exportiert).
- Inhalt der PDF-Seite 14 heute (nur Erreichbarkeit; Text stammt aus dem Archiv vom 03.10.).
- Die nach den Audits geänderten Lösungszeilen (sieben Stellen) sind nicht noch einmal auditiert.
- Begleiter: vom Sweep nur per Mustersuche geprüft; von mir ganz gelesen.
- Ob die Denkhilfe auf S. 4 wirklich drei Zeilen druckt, wo der Hinweis «zwei Zeilen genügen» sagt (kein Seitenbild angesehen).
