# Bericht — Gold-Version 1.3.1 «Konsum verantworten» v4.2

Gebaut am 01./02.10.2026 auf dem Branch `v42-gold-1.3.1` (Ausgang `4ed2bee`).
**Nichts ist gepusht, nichts deployt, `main` ist unberührt.**

Auftrag: `docs/ORCHESTRATION.md` · Entscheide im Einzelnen: `ENTSCHEIDE.md` (E1–E15).

---

## 1. Ergebnis

Die Einheit 1.3.1 (EFZ 4J) liegt in zwei vollständigen Fassungen vor: Spur
**ohne Medien** (traditionell: Lehrmittel, Methoden, Scaffolding) und Spur
**mit Medien** (Pflichtquelle über QR-Code, zwei Vertiefungen je Heft).
Beide sind als Entwurf unter `/einheiten/1.3.1_konsum_verantworten_v42`
umschaltbar, als HTML und Word exportierbar und ohne Platzhalter.

**Nachtrag 02.10.2026 — Pietros Rückmeldung (E16) ist eingearbeitet:** QR-Code nur noch auf Seite 3; «Quelle» statt «Pflichtquelle»; die Schreibfelder füllen die Seiten 2–4 (die Höhen des Leitfadens gelten als Minimum); die Vertiefungskarten auf Seite 4 haben Hinweis, Kurzbeschrieb und ein Feld «Meine Antwort». Gates, Messung, Word-Seitenzahl und Bestandsvergleich sind danach erneut gelaufen.

**Gates am Schluss (02.10.2026):**

| Gate | Ergebnis |
|---|---|
| `npm run build` | Exit 0 |
| `node scripts/check-einheiten.mjs 1.3.1_konsum_verantworten_v42` | Exit 0, 0 offene Befunde; Baseline unverändert (172), neue Einheit nicht in der Baseline |
| `node scripts/check-lf-loesung.mjs 1.3.1_konsum_verantworten_v42` | Exit 0, 16 Leitfragen, keine Befunde |
| `node scripts/check-v42.mjs 1.3.1_konsum_verantworten_v42` | Exit 0, 0 Befunde (Budget / Regeln §11.5 / Platzhalter) |

**Was kein Befehl abdeckt — geprüft:**

| Prüfung | Wie | Ergebnis |
|---|---|---|
| Überlauf | `scripts/messen-v42.mjs` im Headless-Browser über alle 36 Seiten (4 Hefte × 8, Auftragsbogen 4); dazu die Arbeitsansicht im Browser (Heft A und B mit Medien, Auftragsbogen: `scrollHeight ≤ clientHeight`) und Seitenbilder angesehen | keine Seite läuft über |
| Platzhalter | `grep` gemäss Brief über den neuen Ordner und `src/data/quellen/` | nichts |
| Volltext-Leck | Wortfolgen-Abgleich (ab 8 Wörtern) aller Datenfelder, Karten und des Begleiters gegen Archivtexte und neun Lehrmittelkapitel | Treffer nur bei URLs, URNs und Titeln; Fachprüfung am Lehrmittel: längste Übereinstimmung 6 Wörter |
| Bestand unverändert (Invariante 4) | `scripts/bestand-v42.mjs --pruefen`: 26 Fingerabdrücke (HTML, Word, CSS) von `1.3.1_konsum_verantworten` und `1.1.1_konflikt_kommunizieren`, aufgenommen vor dem ersten Renderer-Eingriff; dazu ZIP der Bestandseinheit mit alter und neuer Workbench verglichen | 26 von 26 gleich; ZIP: gleiche 34 Dateinamen, alle Dokument-HTML bytegleich; `loadEinheit`, Begleiter und Übersicht zeichengleich |
| Word | alle sechs `.docx` in Word geöffnet und gezählt | Hefte je 8 Seiten / 8 Abschnitte, Auftragsbogen 4, Begleiter 43; QR als eingebettetes PNG in beiden Medien-Heften (S. 3) |

---

## 2. Was gebaut ist

**Inhalt** (`src/data/einheiten/1.3.1_konsum_verantworten_v42/`, `status: "entwurf"`)

- Heft A «Marke oder echtes Bedürfnis?» und Heft B «Am 20. ist das Konto leer»:
  Kern (Situation, LF1, LF2, Produkt, Feedback-Kriterien, Mindmap, Abschluss)
  je einmal, LF3 und LF4 je Spur.
- Gemeinsamer Auftrag «Alle kommen ans Openair», Glossar, Wochenplan (`set.json`).
- KN (Fall unverändert, Verweise auf zwei Herausforderungen angepasst — E2),
  Prinzip mit Delta, `begleiter.md` (acht Kapitel, rund 10 000 Wörter).
- Acht Quellenkarten in `src/data/quellen/` (nur Metadaten und eigener
  Kurzbeschrieb), zwei neue Methodenkarten.

**Plattform** (alles hinter `template === "heft_8page_v42"` bzw.
`spur_varianten`)

| Baustein | Dateien |
|---|---|
| Datenvertrag, Spur-Auflösung, Quellenkartei | `types.ts`, `spuren.ts`, `quellen.ts`, `index.ts` (`loadEinheit(slug, { spur })` liefert `spur`, `spur_varianten`) |
| Heft, 8 Seiten, HTML und Word | `DocHeftV42.tsx`, `heft-v42/*`, `docx-heft-v42*.ts`, `src/styles/v42/*` |
| Auftragsbogen, 4 Seiten | `DocAuftragsbogen.tsx`, `docx-auftragsbogen-v42.ts` |
| QR (SVG und PNG, ohne Canvas, gebündelt) | `qr.ts`, `QrCode.tsx`, npm `qrcode` 1.5.4 |
| Landing-Seite | `src/pages/m/[setKey].astro` — ohne Login, `noindex`, liest aus den Karten; `/m/131-a` unberührt |
| Arbeitsansicht | `EinheitWorkbench.tsx`: Umschalter «Ohne Medien / Mit Medien», Auftragsbogen als Dokument, ZIP mit beiden Spuren; `uebersicht.ts` führt die neuen Dateien |
| Begleiter | Lösungen je Spur beim Laden gespiegelt, Quellen-Stand aus der Kartei (`begleiter-loesungen.ts`, `begleiter-felder.ts`) |
| Prüfen und Exportieren | `scripts/check-v42.mjs`, `export-v42.mjs`, `messen-v42.mjs`, `bestand-v42.mjs`, `v42-ssr.mjs`; `check-einheiten` und `check-lf-loesung` prüfen v4.2-Hefte je Spur |

**Exporte** in `docs/upgrade-v4.2/gold/`: je Heft und Spur `.html` und `.docx`,
`auftragsbogen.html/.docx`, `begleiter.docx`.

---

## 3. So siehst du es an

1. `git switch v42-gold-1.3.1`, `npm run dev`, als KT1 anmelden →
   `/einheiten/1.3.1_konsum_verantworten_v42` (gelber «Entwurf»-Badge).
   Oben im Dokumentkopf der Umschalter; links Heft A, Heft B, Auftragsbogen, KN.
2. QR-Seite: `/m/1.3.1_konsum_verantworten_v42` (ohne Login).
3. Ohne Server: die Dateien in `docs/upgrade-v4.2/gold/` öffnen.

Ich konnte die eingeloggte KT1-Ansicht nicht selbst öffnen (dafür braucht es
ein echtes Passwort). Die Arbeitsansicht ist über eine vorübergehende Dev-Seite
ohne Login geprüft worden; die Seite ist wieder entfernt.

---

## 4. Quellen (Prüfdatum 01.10.2026)

Jede Quelle wurde in dieser Session abgerufen, danach noch einmal mechanisch
(Status, Titel, Datum). Volltexte liegen in
`D:\OS\_lab\quellen-archiv\bbw-hko\<id>\gewaehlt\`, verworfene Kandidaten unter
`_kandidaten\`.

| Karte | Quelle | Ausschnitt | Geprüft |
|---|---|---|---|
| `q-131a-pflicht` | nau.ch / Keystone-SDA, 15.06.2026, «Influencer treiben Online-Käufe bei Jugendlichen in die Höhe» | ganzer Artikel, 421 Wörter | HTTP 200, Titel, Datum; Text gelesen |
| `q-131a-pflicht-ersatz` | watson.ch, 17.12.2025, «Influencer-Marketing gefährdet junge Leute – die Politik sollte handeln» | ab «Was wurde untersucht?», 10 Absätze, 287 Wörter | HTTP 200, Titel im Browser bestätigt |
| `q-131a-vertiefung-1` | SRF Ratgeber, 23.08.2023, «So erkennt man Influencer-Werbung» | 00:00–05:54 | URN, Titel, Datum, Dauer; **Audio nicht gegengehört** |
| `q-131a-vertiefung-2` | SRF Impact, 10.01.2024, «Designer-Fälschungen – So funktioniert das illegale Business mit Fakes» | 00:35–06:29 | URN, Titel, Datum; Untertitel-Transkript gelesen |
| `q-131b-pflicht` | Schuldenberatung Schweiz, Statistik 2025 (September 2026), Seite 7 | Darstellung 4 und 5 mit Text, 114 Wörter | PDF HTTP 200; Werte am Seitenbild geprüft |
| `q-131b-pflicht-ersatz` | BFS, «Steuerrückstand 2024» (SILC 2024, 16.02.2026), Direktlink auf die Grafik | Zeilen Gesamt, Alter, Bildung, Erwerb | im Browser geöffnet, Werte gelesen |
| `q-131b-vertiefung-1` | SRF Regionaljournal Aargau Solothurn, 06.02.2025, «Neuer Aargauer Verein hilft jungen Leuten mit Schulden» | 00:04–03:10 | URN, Titel, Datum; Swissdox-Transkript gelesen |
| `q-131b-vertiefung-2` | ch.ch, «Betreibung: Zahlungsbefehl, Rechtsvorschlag, Pfändung» | Abschnitt «Werden Sie betrieben?», 384 Wörter | im Browser geöffnet; Fristen am SchKG (fedlex, Stand 01.01.2026) |

Swissdox-Login war gültig; es wurde nichts eingegeben.

---

## 5. Was du entscheiden oder freigeben solltest

Der Leitfaden (§13) behält dir Quellen, Prinzip und Auftrag vor. Ich habe
entschieden, damit der Bau fertig wird — jede Stelle ist umkehrbar
(`ENTSCHEIDE.md` nennt wie).

1. **Pflichtquelle Heft A beruht auf einer Erhebung in Deutschland**
   (10–17 Jahre) und hat **keine Grafik**. Eine Schweizer Quelle mit Grafik zu
   Kaufwegen Jugendlicher gibt es frei zugänglich nicht (E11).
2. **Pflichtquelle Heft B** ist die Statistik der Schuldenberatung («Gründe der
   Überschuldung»), nicht eine Grafik zu Schuldenarten: Die BFS-Grafiken zu
   Schuldenarten führen alle einen Balken «Kredit» (Gegenstand des KN). Die
   zuerst gewählte BFS-Grafik «Steuerrückstand» trug den Auftrag nicht und ist
   jetzt Ersatz (E11, E14). Zugeständnis: ein PDF, Ratsuchende meist 30–49.
3. **Zwei Vertiefungs-Leitfragen sind umformuliert**, weil kein Beitrag die
   ursprüngliche trägt: A2 («Welches Bedürfnis steckt hinter gefälschten
   Markenartikeln — und was riskiert, wer sie bestellt?») und B1 («Warum
   rutschen junge Leute laut Beitrag in Schulden — und wo finden sie früh
   Hilfe?»).
4. **LF3 ohne Medien, Heft A:** Das Lehrmittel hat keinen Abschnitt
   «Einflüsse auf Bedürfnisse». LF3 fragt nach Einflüssen auf Kaufwünsche und
   Nachfrage, Kap. 2.7 S. 73–77 (E7).
5. **Texte des Pakets geändert** — 17 Kürzungen wegen Zeichenbudget (E10),
   Sachkorrekturen am Lehrmittel (E9), Korrekturen nach den Lese-Panels (E15),
   Methodenkarte 4 von Heft A (E13). `git diff 7d5abd4 -- src/data/einheiten/1.3.1_konsum_verantworten_v42`
   zeigt alles.
6. **KN und Prinzip** sprechen von zwei statt drei Herausforderungen (E2).
7. **Ordnername und Kurzlink** `…_v42` sind nach dem ersten Druck fest (E5).
   Soll die Einheit die publizierte ersetzen, vorher umbenennen.

---

## 6. Nicht belegt oder nicht geprüft

- **Vertiefung A1 (Audio) ist nicht gegengehört.** SRG-Audio hat keine
  Untertitel, Swissdox führt den Beitrag nicht; ein Download für Whisper
  braucht deine Freigabe. Der Kurzbeschrieb stützt sich auf den von SRF
  veröffentlichten Begleittext.
- **Die eingeloggte KT1-Ansicht** und die Gast-/`readOnly`-Ansicht mit der
  neuen Einheit.
- **QR-Code mit einer Handykamera** — dekodiert ist er (OpenCV), gescannt nicht.
- **Druck auf Papier, Schwarz-Weiss-Kopie.**
- **Die Links aus dem Schulnetz** und auf Schülerhandys; der PDF-Link mit
  `#page=7` öffnet auf manchen Handys Seite 1.
- **Word auf einem anderen Rechner:** Hier fehlt die Schrift IBM Plex, Word
  ersetzt sie. Seite 8 hat in Word nur rund 1 mm Reserve, Heft B mit Medien
  Seite 1 und 3 rund 3 mm — mit der richtigen Schrift kann das anders ausfallen.
- **Rechtsstand zur Kennzeichnung von Influencer-Werbung** (Vertiefung A1 sagt
  Stand 2023, «klare Regeln fehlen»).
- **Der Verein «Finanz fit»** (Vertiefung B1): ob er heute noch so besteht.
- **Übersicht_LP im ZIP** ist per Skript geprüft, nicht im Browser angesehen.

---

## 7. Bekannte Schwächen, bewusst stehen gelassen

- **Lektion 3 ist überfüllt:** Seite 5, 7 und 8 ergeben 60 Minuten. Der
  Begleiter sagt es und schlägt vor, den Abschluss in die nächste Lektion zu
  nehmen.
- **Feedback-Kriterien im KN-Wortlaut** nennen im Heft Begriffe, die dort
  nicht vorkommen («Leasing/Kredit», «Transfer»). Der Wortlaut ist Vorgabe;
  der Begleiter erklärt es.
- **Sprache der Pflichtquelle A** ist anspruchsvoll («algorithmisch»,
  indirekte Rede).
- **Word-Schreibfelder:** Auf den Seiten 1–4 zeichnet das Heft jetzt jede Linie selbst. Auf den
  Seiten 5–8, im Auftragsbogen und in allen Bestandseinheiten zeigt der bestehende Baustein
   in  weiterhin nur die unterste Linie. Nicht angefasst.
- **Word-Höhen sind an dieser Einheit gemessen:** Die Zuschläge der Schreibflächen in Word sind
  feste Werte; am knappsten ist Seite 3 ohne Medien (rund 4 mm). Längere Texte in einer anderen
  Einheit können eine neunte Seite auslösen — nach jedem Export die Seiten zählen.
- **Zwei bestehende Methodenkarten** sind ungenau (`lm-17-3-3b-schema`: Seite
  394 statt 394–395; `lm-16-2-statement`: Merksatz nicht im Kapitel).
  Ausserhalb des Zauns.
- **`uebersicht.ts`:** Der Hinweis zum Schreibprotokoll spricht bei v4.2 noch
  von «Herausforderungs-Aufträgen».
- **404 der Landing-Seite** hängt an einem internen Astro-Header
  (`X-Astro-Reroute`); nach einem Astro-Upgrade prüfen.
- **Build-Warnung** «chunks larger than 500 kB» (Workbench 794 kB).

---

## 8. Was für die Serienproduktion folgt

1. **Die Quelle bestimmt den Auftrag, nicht umgekehrt.** Zweimal passte eine
   geprüfte Quelle nicht zur vorgeschriebenen Frage. Der Generator sollte LF3
   und Vertiefungs-Leitfragen erst nach der Quellenwahl formulieren.
2. **Ein Kohärenz-Audit nach der Quellenwahl ist Pflicht.** Die
   Steuerrückstand-Grafik bestand alle formalen Checks und trug das Heft doch
   nicht; erst Audit und Blindleser haben es gezeigt.
3. **Der Fall-Ausschluss ist bei Schuldenquellen eng.** Fast jede Statistik
   nennt Kredit oder Leasing. Die Lesart «massgebend ist die Verortung» (E11)
   gehört in den Leitfaden — oder der KN-Fall wird so gewählt, dass er keine
   ganze Quellengattung sperrt.
4. **Das Lehrmittel trägt nicht jede Kompetenz wörtlich.** Vor dem Schreiben
   von LF3 ohne Medien am Text prüfen, was auf den Seiten steht (E7, E9).
5. **Budget-Prüfung früh:** 17 von rund 150 Feldern des Pakets lagen über dem
   Budget. `check-v42.mjs` gehört in den Generator, nicht ans Ende.
6. **Regeln aus dem 3er-Set gelten nicht alle** (Kontrollschritt, E12) —
   `check-einheiten` braucht für v4.2 eine eigene Regelliste.
7. **Audio braucht einen Transkriptweg.** Ohne Whisper-Freigabe bleiben
   SRF-Audiobeiträge ungeprüft.
8. **Werkzeuge stehen:** `export-v42.mjs`, `messen-v42.mjs` und
   `bestand-v42.mjs` laufen für jede v4.2-Einheit; `v42-dokumente.tsx` ist die
   eine Liste der Dokumente.
9. **Rollen:** Bewährt haben sich getrennte Dateien je Executor und ein
   Gerüst-Auftrag vor den Seiten-Aufträgen; kurze gemeinsame CSS-Klassennamen
   über verkettete Dateien haben einmal kollidiert.

---

## 9. Vorkommnisse

- **Parallelsession:** Eine zweite Session («Produktionspipeline») hat am
  01.10. kurz denselben Bau begonnen und übergeben. Ihre Fachkorrekturen sind
  übernommen, ihr Datenvertrag verworfen (E9). Übergabe:
  `UEBERGABE-parallelsession.md`.
- **Nutzungslimit:** In der Nacht sind drei Aufträge am Limit abgebrochen und
  um 05:00 fortgesetzt worden; nichts ging verloren.
- **Word:** Ein Executor hat bei der Seitenzählung eine Word-Instanz ohne
  offene Dokumente beendet und kann nicht ausschliessen, dass es eine fremde
  war. Ein verstecktes `WINWORD.EXE` (PID 84212, gestartet 01.10., 23:29) lief
  danach weiter — bitte im Task-Manager prüfen.
- **Unversioniert geblieben:** `docs/ORCHESTRATION.md`,
  `docs/pipeline-review-2026-10-01.md`, `docs/upgrade-v4.1/` (E1).
- **Defekte Skripte** aus dem Brief (`build:deck`, `sync-einheiten-nrlp --check`,
  `check-bogen-v2-regression`) sind nicht angefasst.
