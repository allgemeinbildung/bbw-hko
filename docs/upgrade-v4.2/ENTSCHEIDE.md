# Entscheide — Gold-Version 1.3.1 v4.2

Entscheide, die während des Baus ohne Rückfrage gefallen sind (Auftrag:
`docs/ORCHESTRATION.md`). Je Eintrag: Entscheid, Grund, Alternative, wie
rückgängig zu machen.

---

## E1 — Ausgangslage: Branch und Ordner waren schon angelegt

**Befund (01.10.2026, 23 Uhr):** Der Branch `v42-gold-1.3.1` existierte bereits
ohne eigenen Commit. `src/data/einheiten/1.3.1_konsum_verantworten_v42/` (fünf
Dateien, 22:42) und die zwei neuen Methodenkarten lagen uncommittet im
Arbeitsbaum, neben dem Vorbestand von 17:01.

**Entscheid:** Der Vorbestand von 17:01 ist als eigener erster Commit übernommen
(`19585fe`, «Vorbestand 01.10.2026 (ungeprüft übernommen)»), unverändert. Der
bereits angelegte Ordner wurde gegen das Paket geprüft (identisch bis auf IDs
und Verweise) und als Ausgangspunkt weiterverwendet.

**Nicht committet:** `docs/ORCHESTRATION.md`, `docs/pipeline-review-2026-10-01.md`
und `docs/upgrade-v4.1/` bleiben unversioniert. Das Repo ist öffentlich; der
Brief nennt Abwesenheitsdaten, und v4.1 ist abgelöst.
**Rückgängig:** `git add` der drei Pfade.

## E2 — KN und Prinzip: Verweise auf «drei Herausforderungen» angepasst

**Entscheid:** `kn.json` und `prinzip.json` der neuen Einheit sprechen von zwei
statt drei Herausforderungen. Geändert sind ausschliesslich Zähl- und
Verweiswörter; Fall, Fragen, KN-Formen und `rubrik_shared` sind wörtlich gleich.

| Datei | vorher | nachher |
|---|---|---|
| kn `definition_kurz` | alle drei Lernaufgaben | beide Lernaufgaben |
| kn `definition_lang` | keiner der drei Herausforderungen … In A, B und C … eine der drei Aufgaben | keiner der beiden Herausforderungen … In A und B … eine der beiden Aufgaben |
| kn Fachgespräch Frage 4 | einer Ihrer drei Herausforderungen | einer Ihrer beiden Herausforderungen |
| kn Werkschau, Ablauf 1 | eines ihrer drei Handlungsprodukte (Bedürfnis-Landkarte, Budget, Schuldenpräventions-Ratgeber) | eines ihrer beiden Handlungsprodukte (Bedürfnis-Landkarte, Budget mit Schutzregeln) |
| kn Werkschau, Frage 3 | durch die drei Herausforderungen | durch die beiden Herausforderungen |
| kn `herausforderungen_mapping` | A, B, C einzeln | A; B trägt den Text von B und C (so vorgefunden) |
| prinzip `qualitaetskriterien` | drei separate … aller drei … A, B und C | zwei separate … beider … A und B |

**Grund:** Der Brief verlangt «unverändert (nur ID und Verweise)». Ein KN, der
Lernende ein Produkt wählen lässt, das es in der Einheit nicht gibt
(Schuldenpräventions-Ratgeber), ist ein Sachfehler, kein Wortlaut.
**Alternative:** KN wörtlich lassen und die Abweichung im Begleiter erklären.
**Rückgängig:** `kn.json` aus `1.3.1_konsum_verantworten/` neu kopieren, nur
`id`, `set_ref`, `prinzip_ref`, `herausforderungen` anpassen.

## E3 — Datenvertrag: Spur-Auflösung

**Entscheid.** Typen in `src/lib/einheiten/types.ts` (Abschnitt «Heft v4.2»).
Auflösung in drei Schritten, alle in `loadEinheit`, alle nur bei
`template === "heft_8page_v42"`:

1. **`resolveSpur(sit, spur)`** — reine Funktion auf den Rohdaten, in
   `src/lib/einheiten/spuren.ts`:
   - `leitfragen` = Kern (LF1, LF2) + `spuren[spur].leitfragen` (LF3, LF4), nach `nr` sortiert
   - `quellen` = `spuren[spur].quellen` (nur Medien-Spur, sonst kein Feld)
   - `kasten_s4` = `spuren[spur].kasten_s4`
   - in `methoden` wird der Eintrag `{ ref: "__spur__" }` durch
     `spuren[spur].methoden_ref_rezeption` ersetzt, Position bleibt
   - `lernfortschritt.scaffold_90` = `spuren[spur].scaffold_90`, falls gesetzt
   - `spur` und `spuren_verfuegbar` werden gesetzt, **`spuren` wird entfernt**
   - fehlt die verlangte Spur (Leitfaden §4.4), gilt die erste vorhandene
   - ohne `spuren` oder ohne v4.2-Template: Rückgabe **desselben Objekts**
2. **Karteien auflösen** wie bisher: `withMethoden` (bestehend) und neu
   `withQuellen` (`src/lib/einheiten/quellen.ts`, Muster `methoden.ts`):
   `QuelleRef` → `Quelle` (Karte + Einsatz), `ersatz_ref` → `ersatz`.
3. **`loadEinheit(slug, opts?)`** liefert `hf_A`/`hf_B` in der wirksamen Spur
   (`opts.spur` → sonst `set.spur`, wenn nicht `wahl` → sonst `DEFAULT_SPUR`),
   dazu `spur` und `spur_varianten` mit allen verfügbaren Spuren fertig aufgelöst.

**Folge:** Jeder Renderer, das Deck, die Werkstatt und der Begleiter sehen wie
heute ein Heft mit vier Leitfragen. Die Workbench schaltet um, indem sie aus
`spur_varianten` wählt — ohne eigene Auflösungslogik im Client.
**Grund:** Leitfaden §11.1 («Auflösung wie bei `methoden`»); wenigste neue
Felder; der Kern steht in den Daten genau einmal (Invariante 7). Die Verdopplung
in `spur_varianten` entsteht erst beim Laden, nicht auf der Platte.
**Alternative:** Auflösung im Client (`resolveSpur` in der Workbench). Verworfen:
zwei Orte, an denen die Kartei bekannt sein müsste.
**Rückgängig:** nicht ohne Umbau der Renderer — das ist der Vertrag.

## E4 — Default-Spur ist `ohne_medien`

**Entscheid:** Bei `set.spur: "wahl"` zeigt die Plattform zuerst die
traditionelle Spur; exportiert werden beide.
**Grund:** Sie hängt an keinem externen Link und ist in jedem Zimmer einsetzbar.
**Alternative:** `mit_medien` zuerst. **Rückgängig:** `DEFAULT_SPUR` in
`spuren.ts` (eine Zeile).

## E5 — Ordnername, IDs, Kurzlink

- Ordner: `src/data/einheiten/1.3.1_konsum_verantworten_v42/`
- IDs: `1.3.1_konsum_verantworten_v42_{hf_A,hf_B,set,kn,prinzip}`
- Katalogtitel: `einheit_titel: "Konsum verantworten (v4.2)"` (sonst stünden
  zwei gleichnamige Karten im KT1-Katalog)
- Landing-Seite: `/m/1.3.1_konsum_verantworten_v42`, Anker `#a` und `#b`
- QR-Inhalt: `https://bbw-hko.ch/m/1.3.1_konsum_verantworten_v42#a` bzw. `#b`
- Quellen-IDs wie im Paket: `q-131a-pflicht`, `q-131a-pflicht-ersatz`,
  `q-131a-vertiefung-1`, `q-131a-vertiefung-2`, dasselbe mit `q-131b-…`

**Nach dem ersten Druck nicht mehr änderbar** (Invariante 6). Solange nichts
gedruckt ist: Ordner umbenennen, IDs ersetzen, Index neu bauen.

## E6 — Quellensuche: sechs Worker statt acht

**Entscheid:** Pflicht- und Ersatzquelle eines Hefts sucht derselbe Worker
(vier Kandidaten), die vier Vertiefungen je ein eigener.
**Grund:** Die Ersatzquelle gilt nur mit gleichem Auftrag und gleichem Raster
(Leitfaden §5) — sie stammt aus demselben Kandidatenfeld wie die Pflichtquelle.
Swissdox läuft in keinem der parallelen Worker (bekannte Ausfälle); fehlt ein
Volltext, holt ihn ein einzelner Nachlauf.
**Alternative:** acht Worker wie im Brief skizziert.

## E7 — Heft A, LF3 ohne Medien: Lehrmittel-Abschnitt ist Kap. 2.7, S. 73–77

**Befund (am lokalen Text `material/_lehrmittel/2.7_Preisbildung.md`, Marker
`[seite: NN]`):** Einen Abschnitt «Einflüsse auf Bedürfnisse» gibt es im
Lehrmittel nicht — weder in 2.7 noch in den Kapiteln der Crosswalk-Zeile
(4J 1.3 = 3J 3.1: 2.1, 2.2, 2.3, 8.2, 2.6) noch in 7.1 oder 1.2. Belegt ist in
2.7: Werbung weckt neue Bedürfnisse (S. 73), das begrenzte Einkommen zwingt zur
Auswahl und ein tieferer Preis erhöht die nachgefragte Menge (S. 74), mehr
verfügbares Geld dehnt die Nachfrage aus (S. 76), ein Trendprodukt steigert die
Nachfrage, eine Krise senkt sie (S. 77).

**Entscheid:** `knoten_ref` = `Kap. 2.7 | S. 73–77`. LF3 fragt, wodurch
**Kaufwünsche und Nachfrage** beeinflusst werden, statt nach «Einflüssen auf
Bedürfnisse». Die Beispielzeile belegt die Werbung (S. 73). Umfeld, Kollegen
und Spontankauf gelten in der Lösung als eigene Beobachtung der Lernenden,
nicht als Lehrmittelwissen. Formulierung übernommen aus der Fachprüfung der
Parallelsession (E9), von mir am Text nachgeprüft (S. 73, 74, 75, 76, 77).
**Grund:** Dasselbe Kapitel wie LF1 und LF2; vier belegbare Aussagen.
**Alternative:** nur S. 73–74 (kürzer zu lesen, aber nur drei sichere Belege);
Kap. 8.2 S. 199 — verworfen, weil das der Abschnitt von Heft B ist.
**Offen für das Blindleser-Panel:** ob fünf Seiten in den zehn Leseminuten von
Seite 3 tragen; der Strategiehinweis nennt die drei Fundseiten.
**Rückgängig:** `spuren.ohne_medien.leitfragen[0]` in `herausforderung_A.json`.

## E8 — Feedback-Kriterien: KN-Wortlaut geht vor Fall-Ausschluss

**Befund:** Die Stufe 1 des KN-Kriteriums «Fachkorrektheit» lautet «Begriffe
(Bedürfnis, Budget, Leasing/Kredit) fehlen …». Invariante 8 verlangt den
Wortlaut des KN im Heft, Invariante 9 verbietet «Leasing» in Heft A.
**Entscheid:** Der Wortlaut bleibt (Invariante 8). `check-v42.mjs` nimmt
`feedback_kriterien[].stufen` vom Fall-Ausschluss aus.
**Grund:** Der Ausschluss schützt den Fall des KN (E-Bike-Leasing), nicht das
Wort im Raster; das Raster ist dasselbe, das die Lernenden im KN sehen.
**Alternative:** Kriterientext im Heft kürzen — verletzt Invariante 8.

## E9 — Vorarbeit der Parallelsession: was übernommen, was verworfen ist

Eine zweite Session («Produktionspipeline») hat am 01.10.2026 kurz denselben Bau
begonnen und dann übergeben (`UEBERGABE-parallelsession.md`).

| Vorarbeit | Entscheid |
|---|---|
| `VERTRAG.md` (eigener Datenvertrag: `spuren` bleibt im Heft, Umschalten im Browser) | **verworfen**, aus dem Repo entfernt. Es gilt E3. |
| `types.ts`: Felder `leitfragen_kern`, `methoden_kern`, `spur_aktiv`, `Quelle.karte`, `Quelle.ref`, `Spur.methode_rezeption`, Alias `Raster` | **verworfen** (gehören zum verworfenen Vertrag) |
| `types.ts`: `Abschluss`, `Wochenplan`, `kompetenzen` pro Heft, `hat_spuren`, `hat_medien` | **übernommen** (vertragsneutral) |
| `spur.ts`, `quellen.ts`, Änderungen in `index.ts`, Index-Flags | dem Resolver-Executor als Vorarbeit übergeben; Ergebnis muss E3 erfüllen, eine Implementierung in `spuren.ts` |
| `check-v42.mjs`, angepasste Checks, `check:v42` in package.json | dem Prüfskript-Executor als Ausgangsstand übergeben |
| Fachkorrekturen in `herausforderung_A.json` / `_B.json` (Kern und `spuren.ohne_medien`) | **übernommen** — es sind Sachfehler-Korrekturen am Lehrmittel: Seitenbereiche (2.7 → 73–75, 17.2 → 381–383, 8.2 → 199–200), Buchbenennungen (Dazugehörigkeit, Lebenswichtiges), Beispiele für Existenz-/Wahlbedürfnis und variable Kosten wie im Buch, Sozialabzüge erst ab dem Jahr des 18. Geburtstags, «Schuldenspirale» steht in Kap. 2.2 S. 48, «Mahnung» in Kap. 2.4 S. 62; Heft B LF3 fragt nach «Ursachen und Folgen von Verschuldung». |

**Grund für die Übernahme der Daten:** Der Brief erlaubt Textänderungen bei
Sachfehlern; jede Seitenangabe ist am Lehrmitteltext bestätigt, Stichproben
von mir nachgeprüft (2.7 S. 73–77, 17.2 S. 381–383).
**Rückgängig:** `git diff 7d5abd4 -- src/data/einheiten/1.3.1_konsum_verantworten_v42/`.

## E10 — Kürzungen wegen Zeichenbudget (§3.1) und Restpunkte der Fachprüfung

`check-v42.mjs` meldete 17 Budget-Abweichungen in den Referenztexten. Alle sind
behoben; der Sinn ist gehalten. Vollständiger Wortlaut vorher/nachher:
`git show 49519ac`.

| Heft | Feld | Änderung |
|---|---|---|
| A | `situation_text` (629, Soll 650–900) | ein Satz ergänzt: «Das Geld fehlt mir seither.» |
| A | `mehrdeutigkeit.hint` (186 → 154) | gestrafft |
| A | `quellen_anker` (100, 95 → 89, 89) | Untertitel «Maslow und Bedürfnisarten»; Titel «Dokumentieren — Notizen und Markieren» |
| A | LF1 `text` (225 → 213) | «zwischen Bedürfnis und Gut» |
| A | LF4 mit Medien `text` (256 → 219) | gestrafft, Frage und Entscheid bleiben |
| A | Denkhilfe, Spaltenköpfe (44, 38 → 24, 26) | «Dafür (Bedürfnis, Stufe)», «Dagegen (Einfluss, Kosten)» |
| B | `mehrdeutigkeit.hint` (171 → 159) | gestrafft |
| B | `quellen_anker` (120, 114, 129 → 75, 82, 81) | Titel und Untertitel gekürzt |
| B | LF2 `text` (225 → 216) | «mit realistischen Zahlen» |
| B | LF4 `text`, beide Spuren (226 → 218) | «etwa» statt «zum Beispiel» |
| B | `indikator_produkt` (91, 98 → 89, 86) | gestrafft |

Dazu, aus der Übergabe der Fachprüfung (kein Budget, sondern Sachlage):

- **B LF1** fragt neu nach dem **Begriff** Schuldenspirale und lässt den Anfang
  einer Spirale an der offenen Rechnung zeigen. Vorher verlangte die Frage einen
  Ablauf «laut Lehrmittel», den Kap. 2.2 nicht liefert.
- **B LF4 mit Medien:** Beispiel an die Buchbeispiele angeglichen (Kleider und
  Schuhe statt Take-away), `knoten_ref` auf S. 199-200.
- **B `prinzip_handoff.lehrmittel_anker`:** Kap. 8.2 S. 199-200.
- **A LF2, Lösung:** «Dazugehörigkeit» (Benennung der Stufe 3 im Buch).
- `knoten_ref` und `quelle_ref` einheitlich mit Bindestrich («S. 73-77»), wie im
  Bestand; `quelle_stand` ist ein reines Datum.
- `loesung.kern` von vier Leitfragen auf höchstens 55 Zeichen gekürzt
  (Vorgabe von `check-lf-loesung`).

**Rückgängig:** `git revert 49519ac`.

## E11 — Quellenwahl (Spur mit Medien)

Sechs Such-Worker (plus zwei der Parallelsession) haben am 01.10.2026 je Slot
zwei bis vier Kandidaten abgerufen und geprüft. Volltexte und Transkripte
liegen unter `D:\OS\_lab\quellen-archiv\bbw-hko\<quellen-id>\gewaehlt\`, die
nicht gewählten Kandidaten unter `_kandidaten\`. Jede gewählte URL und URN
wurde danach noch einmal mechanisch abgerufen (Status, Titel, Datum).

| Karte | Gewählt | Warum diese | Zugeständnis |
|---|---|---|---|
| `q-131a-pflicht` | nau.ch / Keystone-SDA, 15.06.2026, «Influencer treiben Online-Käufe bei Jugendlichen in die Höhe», ganzer Artikel (421 Wörter) | trifft die Frage «über welche Wege entstehen Kaufwünsche» am direktesten, mit Zahlen in fast jedem Absatz; Agenturtext über eine Studie einer Universitätsklinik | Erhebung aus **Deutschland** (10–17 Jahre); **keine Grafik** im Artikel — der Auftrag nennt darum keine Grafik mehr |
| `q-131a-pflicht-ersatz` | watson.ch, 17.12.2025, «Influencer-Marketing gefährdet junge Leute – die Politik sollte handeln», ab «Was wurde untersucht?», 10 Absätze (287 Wörter) | Schweizer Konsumentenorganisation, gleiche Frage, gleiches Raster; anderer Host als die Pflichtquelle | wenige Zahlen; Sprache stellenweise sperrig |
| `q-131a-vertiefung-1` | SRF Ratgeber, 23.08.2023, «So erkennt man Influencer-Werbung» (5:54) | beantwortet die Leitfrage direkt; URN bestätigt | **kein Transkript** (nicht in Swissdox, SRG-Audio hat keine Untertitel) — Kurzbeschrieb stützt sich auf den von SRF veröffentlichten Begleittext; das Audio ist nicht gegengehört |
| `q-131a-vertiefung-2` | SRF Impact, 10.01.2024, «Designer-Fälschungen – …», Ausschnitt 00:35–06:29 (5:54) | zeigt, wie sehr junge Leute mit dem Trend mitgehen wollen, und was es kostet; Transkript (VTT) gelesen | **Leitfrage geändert**: Kein SRF-Video trägt die These «Dazugehören ist ein echtes Bedürfnis» als Kontrast-Stimme. Neu: «Welches Bedürfnis steckt hinter dem Kauf gefälschter Markenartikel — und was riskiert, wer sie bestellt?» |
| `q-131b-pflicht` | BFS, Grafik «Steuerrückstand 2024» (SILC 2024, publiziert 16.02.2026), Datawrapper-Direktlink, Zeilen Gesamt/Alter/Bildung/Erwerb | amtlich, aktuell, eigene Zeile 18–24 Jahre, Zahlen an den Balken, auf dem Handy lesbar; **frei von Kredit und Leasing** | zeigt, **wer** im Rückstand ist, nicht **wie** man hineingerät — LF3 und Auftrag sind entsprechend umformuliert; Bezug: Gesamtbevölkerung |
| `q-131b-pflicht-ersatz` | Schuldenberatung Schweiz, Statistik 2025 (September 2026), Seite 7 «Gründe» und «Dauer» | Fachstelle, gleicher Typ, gleiches Raster; Seite 7 ist frei von Kredit und Leasing | PDF; Ratsuchende sind meist 30–49 Jahre alt; Seiten 8–9 desselben PDF nennen Kredite (ausserhalb der Verortung) |
| `q-131b-vertiefung-1` | SRF Regionaljournal Aargau Solothurn, 06.02.2025, «Neuer Aargauer Verein hilft jungen Leuten mit Schulden», 00:04–03:10 | einziger Kandidat mit Transkript (Swissdox), jugendbezogen, frei von Kredit | **Leitfrage geändert**: Kein Audio bis sechs Minuten lässt eine Schuldenberatung «erste Schritte» nennen. Neu: «Warum rutschen junge Leute laut Beitrag in Schulden — und wo finden sie früh Hilfe?» Mundart; nennt eine Zahl von 2021 |
| `q-131b-vertiefung-2` | ch.ch, «Betreibung: Zahlungsbefehl, Rechtsvorschlag, Pfändung», Abschnitt «Werden Sie betrieben?» (384 Wörter) | amtlich; Fristen am SchKG geprüft (fedlex, Stand 01.01.2026) | Seite ohne Datum; Inhalt lädt nur im Browser (kein einfacher Textabruf) |

**Verworfen, obwohl naheliegend**

- *BFS «Zahlungsrückstände nach Art», 2024 und 2022:* je ein Balken
  «Kreditrückzahlungen …», 2024 sogar an dritter Stelle. Das BFS zählt dazu
  Fahrzeug-Leasing und Konsumkredit — der Gegenstand des KN (Invariante 9).
- *cmm360.ch zum DPD-Barometer (Schweizer Daten, mit Grafik):*
  Medienmitteilung eines Paketdienstes, Fachjargon, 18–27 Jahre. Archiviert
  als Reserve (`q-131a-pflicht-ersatz\kandidat-cmm360`).
- *SRF Impact «Swifties» (Zugehörigkeit ausdrücklich):* Konzertbesuch als
  Gegenstand überschneidet sich mit dem gemeinsamen Auftrag (Openair).
- *feel-ok.ch «Von der Mahnung zur Betreibung» (jugendnah, mit Grafik):* nennt
  im Abschnitt zum Verlustschein «Kredit»; Reserve für Vertiefung 2 von Heft B.
- *SRF Espresso «Schuldenfalle Corona-Pandemie» (30.12.2020):* nennt laut
  Begleittext erste Schritte, aber kein Transkript und Corona-Rahmung.

**Lesart von Invariante 9 bei Quellen:** Massgebend ist die **Verortung** — der
Ausschnitt, den die Karte nennt. Er darf weder Leasing noch Konsumkredit,
E-Bike oder Mobilität enthalten. Dass dasselbe PDF oder dieselbe Website an
anderer Stelle Kredite erwähnt, lässt sich bei Schuldenstatistiken nicht
vermeiden und ist toleriert; wo möglich, zeigt der Link direkt auf den
Ausschnitt (BFS: Direktlink auf die eine Grafik statt auf die Themenseite).

**Was Pietro prüfen sollte (Leitfaden §13: Quellen gibt Pietro frei):** die
deutsche Erhebung als Pflichtquelle von Heft A; die zwei geänderten
Vertiefungs-Leitfragen; die Steuerrückstand-Grafik statt einer Grafik zu
Schuldenarten in Heft B.
**Rückgängig:** Karte in `src/data/quellen/` ersetzen; LF3-Lösung der
Medien-Spur aus dem Archivtext der neuen Quelle neu schreiben.

## E12 — `check-einheiten`: Kontrollschritt-Regel gilt bei v4.2 nicht

**Befund:** `check-einheiten` verlangt aus dem 3er-Set, dass Schritt 05 ein
Kontrollschritt ist und nicht in den Abgaben vorkommt. Heft B macht Schritt 05
gemäss Leitfaden §9.1 zum Budgetgespräch — das ist ein Produkt und steht in den
Abgaben. Das Skript endete deshalb mit Exit 1 (sechs Warnungen).
**Entscheid:** Trägt ein Heft `template: "heft_8page_v42"` und
`feedback_kriterien`, entfallen die drei Kontrollschritt-Regeln: Die Kontrolle
vor der Abgabe leisten die Feedback-Kriterien mit der Spalte «Selbst»
(Leitfaden §2). Alle übrigen Regeln gelten weiter und sind erfüllt — dafür
nennen vier Schritt-Hinweise jetzt ihre Leitfrage (A 02, A 03, B 01, B 02), und
LF4 von Heft B trägt zwei statt drei Aufträge («Hält Ihre wichtigste Anpassung
dem stärksten Einwand stand … — und warum?»).
**Alternative:** Schritt 05 von Heft B in einen Prüfschritt umschreiben und das
Gespräch in Schritt 04 ziehen — widerspricht der Verben-Tabelle §9.1.
**Rückgängig:** die vier Zeilen `kontrolleUeberKriterien` in
`scripts/check-einheiten.mjs`. Bestandseinheiten sind nicht betroffen
(Ausgabe unverändert: 0 offene Befunde, 172 in der Baseline).
