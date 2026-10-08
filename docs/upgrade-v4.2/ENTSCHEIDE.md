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

> **Stand 02.10.2026:** Für Heft B gilt E14 (Statistik der Schuldenberatung
> statt BFS-Grafik «Steuerrückstand»); die Zeilen zu Heft B in der Tabelle
> unten und der Prüfhinweis «Steuerrückstand-Grafik» am Schluss sind damit
> überholt. Die Leitfragen der Vertiefungen B1 und B2 sind in E17 nochmals
> angepasst.

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

## E13 — Heft A, Methodenseite: «3B-Schema» statt «Ein Ziel SMART formulieren»

**Befund:** `docs/methodenkartei.md` verlangt genau zwei Karten mit Beispiel.
Heft A trug drei (Rezeptionskarte der Spur, «Echt oder geweckt prüfen»,
«SMART»); Seite 6 passte nur noch mit 2,5 mm Reserve.
**Entscheid:** Karte 4 ist neu `lm-17-3-3b-schema` (Lehrmittel Kap. 17.3,
ohne Beispiel), mit der Übertragung «Massstab als Behauptung, Begründung,
Prüfung am Beispiel Handy». Die Rezeptionskarte ist von Pietro freigegeben,
«Echt oder geweckt prüfen» ist das Kernwerkzeug des Hefts — beide bleiben.
**Alternative:** drei Beispielkarten mit gestauchten Abständen stehen lassen.
**Rückgängig:** `methoden[3]` in `herausforderung_A.json` (vorher
`lm-20-3-smart`, `fuer`: «für den Massstab-Satz»).

## E14 — Nach den Lese-Panels: Pflicht- und Ersatzquelle von Heft B getauscht

**Gilt anstelle der zwei Zeilen `q-131b-pflicht` und `q-131b-pflicht-ersatz`
in E11.**

**Befund (Kohärenz-Audit und Blindleser Heft B mit Medien, übereinstimmend):**
Die BFS-Grafik «Steuerrückstand 2024» zeigt, **wer** im Rückstand ist, nicht
**wie** man in Schulden gerät. Schritt 03 («Posten markieren, die zu Schulden
führen können») und der Indikator («Schutzregeln setzen bei den Schuldenwegen
aus LF3 an») hatten in der Medien-Spur keine Grundlage. Dazu ist die Grafik für
16-Jährige schwer zu lesen: Die Balken reichen bis ans Ende des
Vertrauensbereichs, «18–24 Jahre» sieht länger aus als «25–49 Jahre», obwohl
der Wert kleiner ist; Bildung und Erwerb gelten erst ab 18.

**Entscheid:**

| Karte | Neu | Vorher |
|---|---|---|
| `q-131b-pflicht` | Schuldenberatung Schweiz, Statistik 2025, Seite 7: «Gründe für die Überschuldung» und «Dauer der Verschuldung» (114 Wörter, am PDF gezählt) | BFS, «Steuerrückstand 2024» |
| `q-131b-pflicht-ersatz` | BFS, «Steuerrückstand 2024», Zeilen Gesamt, Alter, Bildung, Erwerb | Schuldenberatung Schweiz, Seite 7 |

Die IDs bleiben, die Inhalte der Karten und der Archivordner sind getauscht.
LF3 der Medien-Spur fragt neu nach den **Gründen** und führt zum eigenen Budget.
**Zugeständnisse der neuen Pflichtquelle:** ein PDF (der Link zeigt auf Seite 7,
manche Handys öffnen trotzdem Seite 1); Ratsuchende sind meist 30–49 Jahre alt;
die Seiten 8–9 desselben PDF nennen Kredite — ausserhalb der Verortung
(Lesart E11). Die Tabelle ist eine Mehrfachnennung; die Prozente lassen sich
nicht zusammenzählen.
**Alternative:** BFS behalten und Schritt 03 samt Indikator umschreiben —
das hätte den Kern von Heft B für eine einzige Spur verbogen (Invariante 7).
**Rückgängig:** die zwei Karten und die zwei Archivordner zurücktauschen,
LF3 der Medien-Spur aus `git show 7651a4e` übernehmen.

## E15 — Befunde der Panels: was geändert ist, was bewusst bleibt

Neun Sonnet-Worker (vier Blindleser, zwei Kohärenz-Audits, zwei Fachprüfungen
am Lehrmittel, ein Abgrenzungs-Audit) haben am 02.10.2026 die gerenderten
Hefte und die Daten geprüft. Keine Seitenangabe und keine Fachaussage war
falsch; die Befunde betrafen Verständlichkeit, Kohärenz und Abgrenzung.

**Geändert (Commit 53d4954 und folgende)**

- *Raster ohne Medien:* Der Auftrag verlangte «vier Aussagen», das Raster hat
  mit der Beispielzeile nur drei leere Zeilen. Neu: «drei weitere Aussagen …
  Die erste Zeile ist ein Beispiel» (A und B). Die Spalte «Begründung», die
  Heft A verlangte, gab es nicht — gestrichen.
- *Heft B, LF2:* «Ab welchem Tag wird es knapp?» war aus einem Monatsbudget
  nicht zu beantworten. Neu sammelt LF2 die Zahlen und fragt «Bei welchen
  Posten wird es knapp?»; das saubere Budget entsteht auf Seite 7.
- *Heft B, Schritt 04 und Abgaben:* Anpassungen «je mit Grund», die Regeln
  «setzen bei den Posten aus Schritt 03 an», eine Anpassung gilt der offenen
  Rechnung — damit haben beide Feedback-Kriterien und der Quer-Check einen
  Beleg im Produkt.
- *LF4-Beispiele (nur Lehrperson):* Heft A — beide Pole anerkennen jetzt die
  Spannung «Wunsch jetzt, Sicherheit später», die die höchste Stufe des
  Kriteriums verlangt; die Zusage steht unter der genannten Annahme, dass das
  eigene Handy ersetzt werden muss; der Satzanfang «Die Quelle zeigt aber …»
  kippte die Antwort und heisst neu «Die Quelle zeigt, dass … — bei mir heisst
  das …». Heft B — beide Beispiele nennen zwei Schutzregeln und die offene
  Rechnung.
- *Markieren:* «Farbe oder Symbol» einheitlich; «Einfluss» statt des
  dreideutigen «Quelle» in Schritt 03 von Heft A.
- *Abgrenzung:* Das Plus-Szenario von Heft B («Zahnarztrechnung CHF 300») war
  der Fall des gemeinsamen Auftrags — neu «Optikerrechnung CHF 250».
  «Arbeitsweg» in der Situation von Heft A (Gegenstand des KN) heisst neu
  «unterwegs». «Leben auf Pump» ist aus der Beispielzeile von Heft B
  verschwunden.
- *Methodenkarte der Rezeption:* Das Kartenbeispiel («Mehrheit kauft nach
  Video-Empfehlung · 6 von 10 · Influencer-Marketing») sah in Heft A aus wie ein
  Befund aus der Pflichtquelle und nannte einen Begriff, der nicht aus LF1
  stammt. Die Hefte überschreiben das Beispiel jetzt mit einem neutralen
  (Vereinssport), die Karte selbst ist unverändert.
- *Lehrmittel-Zeilen, Glossar, Anker:* Titel und Untertitel nennen, was im
  Buch steht («Bedürfnis, Bedürfnisarten, Nachfrage»; «Notiztechniken,
  Markierungen»); Kap. 2.2 nur S. 48; Glossar «Nettolohn», «Rückstellung»,
  «Schuldenspirale» ohne Zusätze, die nicht im Buch stehen.
- *«Spur» in Lernenden-Texten* (Wochenplan, Plus) ist ersetzt — das Wort
  gehört der Lehrperson.

**Bewusst nicht geändert**

- *Schreibfelder* LF1 35 mm, LF2 45 mm, Befund 25 mm: mehrere Blindleser finden
  sie knapp. Die Höhen sind im Leitfaden §3.1 hart vorgegeben. → Bericht.
- *Zeit:* Lektion 3 trägt nach den Seitenminuten 60 statt 45 Minuten
  (Seite 5: 5, Seite 7: 40, Seite 8: 15). Das ist die Rechnung des Leitfadens
  (135 Minuten über drei Lektionen, Produkt beginnt in Lektion 2). → Bericht.
- *Feedback-Kriterien im KN-Wortlaut:* «Fachkorrektheit» nennt «Budget,
  Leasing/Kredit», «Wirtschaftliches Prinzip» verlangt auf Stufe 3 «Transfer» —
  beides kommt im einzelnen Heft nicht vor. Invariante 8 (Wortlaut) geht vor;
  der Indikator darunter sagt, woran es im Heft zu sehen ist. → Begleiter.
- *Mitnahme-Zeilen* «Mein Entscheid», «Meine wichtigste Anpassung», «Mir noch
  unklar»: Der gemeinsame Auftrag braucht sie nicht wörtlich. Sie sind im
  Leitfaden §6.3 fest vorgegeben.
- *Kategorie «geweckt, aber berechtigt»:* bleibt (Pietros Entscheid 1).
- *«Zug» im gemeinsamen Auftrag* («Camping, Essen und Zug»): Wortlaut des
  Leitfadens §9.2; ein Kostenposten, nicht der Gegenstand des KN.
- *KN übernimmt Szenenelemente aus A und B* (zwei aus dem Team, Konto vor dem
  20. eng): so angelegt (`alignment_note`), KN unverändert.
- *Sprache der Pflichtquelle von Heft A:* «algorithmisch», «Kaufimpulse»,
  indirekte Rede. Kein besserer geprüfter Kandidat; der Begleiter weist darauf
  hin.
- *Bestehende Methodenkarten* (`lm-17-3-3b-schema`: Seite 394 statt 394–395;
  `lm-16-2-statement`: Merksatz nicht im Kapitel): ausserhalb des Zauns
  (Invariante 11). → Bericht.

**An den Renderer gegeben** (eigener Auftrag): fehlende Schreiblinie bei der
ersten Mitnahme-Zeile (Seite 8); Anweisung zur Mindmap sagt nicht, was beim
Ast «gilt auch bei …» einzutragen ist und woher die Raster-Begriffe kommen;
die Arbeitsanweisung auf Seite 1 («Markieren Sie die Fragen …») meint Stellen,
nicht Fragen; «gemeinsamer Auftrag» wird auf Seite 8 nicht verortet.

## E16 — Rückmeldung Pietro vom 02.10.2026 (nach der ersten Durchsicht der Gold-Hefte)

Diese vier Punkte hat Pietro selbst entschieden; sie gehen dem Leitfaden vor.

1. **QR-Code nur einmal.** Er steht auf Seite 3 in der Quellenkarte, wo die
   Quelle gebraucht wird, nicht mehr zusätzlich auf Seite 1 (Leitfaden §3 sah
   beide vor). Seite 1 nennt die Quelle nur noch in einer Zeile mit Verweis auf
   Seite 3.
2. **«Pflichtquelle» heisst «Quelle».** Alles ist Pflicht, ausser es ist als
   freiwillig bezeichnet. Im Heft, auf der QR-Seite, in der Übersicht und im
   Begleiter steht «Quelle», daneben «Ersatzquelle» und «Vertiefung
   (freiwillig)». Intern bleiben `rolle: "pflicht"` und die IDs
   `q-131a-pflicht` … (nach dem ersten Druck ohnehin fest, E5).
3. **Schreibfelder füllen die Seite.** Die Höhen aus Leitfaden §3.1
   (`feld_hoehe_mm`: 35 / 45 / 25 / 60 bzw. 45) gelten als Mindesthöhe; der
   freie Platz der Seiten 2, 3 und 4 geht an die Schreibflächen und an höhere
   Rasterzeilen. Damit ist der Befund aller vier Blindleser («Felder zu klein»,
   E15) erledigt.
4. **Vertiefungen zum Arbeiten.** Die zwei Vertiefungskarten auf Seite 4
   bekommen je einen Hinweis, was genau zu lesen, hören oder sehen ist, den
   Kurzbeschrieb und ein Schreibfeld für die Antwort auf die Leitfrage.

**Folge für `check-v42.mjs`:** `feld_hoehe_mm` bleibt als Mindesthöhe in den
Daten und wird weiter geprüft. **Rückgängig:** `git revert` des Commits zu E16.

---

## E17 — Zweite Rückmeldung Pietro vom 02.10.2026 und Lückenprüfung

Die Punkte 1–4 hat Pietro entschieden; sie gehen dem Leitfaden vor. Punkt 5
ist das Ergebnis einer Lückenprüfung gegen Leitfaden, Brief und Bestand.

1. **Keine Woche, keine Zeit im Heft.** Seite 1 zeigt statt «Ihre Woche»
   (Lektion 1 · 45 min …) eine «Übersicht» in drei Teilen. Das Feld heisst
   weiter `wochen_plan`, die Labels sind «Teil 1–3». Der Zeitplan im Begleiter
   ist als Vorschlag bezeichnet (Leitfaden §3 und §8 sahen feste Wochen vor).
2. **Kein Verweis vom Heft auf den Auftrag.** Seite 8 heisst «Das nehme ich
   mit» statt «Mitnahme in den gemeinsamen Auftrag (Woche 3)»; die
   Anweisungszeile darunter ist entfallen (Platz). Dafür nennt der
   Auftragsbogen auf A1 im Kasten «Das brauchen Sie aus Ihren Heften» je Heft,
   was er braucht, mit Seitenzahl (`gemeinsamer_auftrag.heft_bezug`). Ob und
   wann der Auftrag folgt, entscheidet die Lehrperson.
3. **Produkt als Bild.** Jedes Handlungsprodukt hat zwei gezeichnete Blätter
   (Typ `ProduktBild`): `beispielbild` — ein neutrales Beispiel an einem
   anderen Fall, im Heft auf Seite 6 unter den vier Methodenkarten, in beiden
   Spuren — und `loesungsbild` — eine mögliche Lösung zum Fall des Hefts, nur
   für die Lehrperson als «Lösungsblatt» (Arbeitsansicht, ZIP unter
   `Material_LP/`, Export). «Bild» heisst: aus den Daten gezeichnet, in HTML
   und Word, mit Schreibschrift aus lokal vorhandenen Schriften (Segoe Print);
   kein Pixelbild und kein Bildgenerator, damit es in der Serie ohne
   Zusatzwerkzeug entsteht und in Word bearbeitbar bleibt. Die Methodenkarten
   bleiben zu viert; die untere Seitenhälfte war vorher leer.
4. **Begriffsnetz und Glossar je Heft.** Seite 8 zeigt statt der Mindmap mit
   vier Kästen ein Begriffsnetz: jeder Begriff ein eigener Knoten um das
   Zentrum, zwei leere Knoten «aus meinem Raster», das offene Feld «gilt auch
   bei …», keine vorgezeichneten Linien. Die Knoten sind die Glossarbegriffe
   des Hefts (`mindmap_aeste[].punkte`, bis fünf je Ast, zehn im Ganzen);
   darunter steht das Glossar des Hefts (zehn Begriffe plus ein bis zwei aus
   der Quelle der Spur). Quelle bleibt `set.glossar` mit `heft` und neu `spur`;
   `loadEinheit` setzt `sit.glossar` ein. Das Glossar auf dem Auftragsbogen
   (A3, Leitfaden §7.5) entfällt; A3 hat dafür mehr Schreibzeilen. Die
   Checkliste auf Seite 8 ist zweispaltig. Budget §3.1 für die Mindmap
   (3 Punkte je Ast) ist damit ersetzt.
5. **Lückenprüfung — behoben:**
   - Begleiter sprach von «Stufe 1–4», Heft, Auftragsbogen und KN von
     «0–3 Punkten»: der Begleiter ist auf Punkte umgestellt.
   - Die vier Vertiefungsfragen (Seite 4, Feld «Meine Antwort» seit E16) hatten
     keinen Erwartungshorizont: steht jetzt im Begleiter, belegt aus den
     Archivtexten. Vertiefung A1 stützt sich nur auf den Begleittext von SRF
     (Audio nicht gehört).
   - Zwei Vertiefungsfragen von Heft B waren vom Ausschnitt nur halb getragen
     (der Radiobeitrag nennt keine Anlaufstelle, die ch.ch-Seite keine Frist ab
     Rechnung). Neu: «… und wie will der Verein früh helfen?» und «… und was
     können Sie tun, wenn ein Zahlungsbefehl kommt?».
   - Der Begleiter und `scaffold_90` nannten Stützen, die es nicht gab
     («Karten-Raster», «Budgetvorlage», vorausgefüllte Denkhilfe): sie nennen
     jetzt das Beispiel auf Seite 6 und die Beispielzeile im Raster.
   - «in dieser Woche» in `leitfragen_intro`; QR-Hinweis zu Heft B, Seite 1;
     `prinzip.bloom_zielprofil` (LF3 und LF4 = K4 wie Leitfaden §6.1); KN-Seite
     der Lehrperson («zwei» statt «drei Herausforderungen», nur bei v4.2).
   - Präsentation und Werkstatt kennen das neue Modell nicht (laut Brief
     ausserhalb des Umfangs) und hätten Folien bzw. einen Prompt im alten
     3er-Format erzeugt: beide sind bei v4.2-Einheiten ausgeblendet, bis sie
     nachgezogen sind.

**Folgen für `check-v42.mjs`:** neue Regeln `ERR_V42_GLOSSAR` (jeder Knoten ist
ein Glossarbegriff des Hefts und umgekehrt) und `ERR_V42_PRODUKTBILD` (beide
Blätter vorhanden, Markierungen in der Legende), Budgets für `heft_bezug`,
Glossar und Produktbild.
**Rückgängig:** `git revert` des Commits zu E17; die Datenfelder sind additiv.

---

## E18 — Auftragsbogen A4: «Selbsteinschätzung» statt «Rückmeldung» (Pietro, 02.10.2026)

Die Seite A4 schreibt der Lehrperson nicht mehr vor, was sie mit dem Auftrag
macht. Sie heisst «Selbsteinschätzung»; der Satz darunter nennt weder die
Lehrperson noch den KN noch die Note. Die zweite Ankreuzspalte heisst «Fremd»
statt «LP», die Schreibfelder «Das verbessere ich …» und «Rückmeldung, die ich
erhalten habe» (vorher «Bis zum KN verbessere ich …» und «Rückmeldung meiner
Partnerin / meines Partners»). Kriterien, Stufen und Wortlaut bleiben die des
KN (Invariante 8). Der Begleiter beschreibt die Rückmeldung durch die
Lehrperson weiter als Vorschlag. Leitfaden §7.5 (A4 «Rückmeldung», Spalten
«Selbst» und «LP») ist damit ersetzt. **Rückgängig:** `git revert` des Commits.

---

## E19 — Lösungen für alle Felder des Hefts (Pietro, 02.10.2026)

Zu jedem Heft gibt es je Spur ein Dokument **«Lösungen»** für die Lehrperson
(`loesungen-<a|b>-<spur>`, HTML und Word, je fünf Seiten). Es zeigt zu jedem
Feld des Hefts eine mögliche Lösung: LF1 und LF2, das ausgefüllte Raster von
LF3 mit Befund, LF4 mit beiden Beispielantworten, die Denkhilfe (ohne Medien)
bzw. die Erwartungen zu den Vertiefungen (mit Medien), das Produkt, das
Begriffsnetz als Liste beschrifteter Verbindungen, Quer-Check und «Das nehme
ich mit».

- **Farbe statt Layout:** Lösungen stehen in Grün, Aufgaben und Hinweise in
  Schwarz und Grau. Das Layout folgt nicht dem Heft der Lernenden, und in Word
  gibt es keine Schreiblinien (so von Pietro vorgegeben).
- **Ersetzt das Lösungsblatt** aus E17: Das Produktblatt ist ein Teil des
  neuen Dokuments.
- **Neue Datenfelder** (nur Lehrperson, nie im Heft und nie auf der QR-Seite):
  `leitfragen[LF3].loesung.raster_zeilen` und `.befund`,
  `kasten_s4.loesung_zeilen`, `quellen[].erwartung`, `abschluss.loesung`
  (`verbindungen`, `transfer`, `eigene_knoten` je Spur, `quercheck`,
  `mitnahme`). `check-v42.mjs` verlangt sie mit `ERR_V42_LOESUNG`.
- **Herkunft:** Raster und Befund sind aus den am 01.10. geprüften Lösungen
  von LF3 umgeformt, nicht neu recherchiert. Wo Lernende mit eigenen
  Beispielen arbeiten (LF2, LF4, Produkt, «Das nehme ich mit»), ist die Lösung
  eine von vielen; das Dokument sagt es im Kopf.

**Rückgängig:** `git revert` des Commits zu E19; die Datenfelder sind additiv.

---

# Entscheide — Generator-Skill v4.2 (Auftrag: `docs/ORCHESTRATION-skill-v42.md`)

Ab hier: Entscheide der Skill-Session vom 02.10.2026 (Branch `v42-skill`).

## E20 — Name und Standard: `bbw-hko-heft-v42` ist die Skill für neue EFZ-Einheiten

**Entscheid:** Die neue Skill heisst `bbw-hko-heft-v42` (wie das Template
`heft_8page_v42`) und liegt unter `.claude/skills/bbw-hko-heft-v42/`. Sie ist
der Standard für jede neue EFZ-Einheit («mach eine Einheit zu 2.1.2», «neue
Einheit», «Heft», «Spur mit Medien»). Die alte Skill `bbw-hko-3er-set` bleibt
bytegleich und ist für ausdrückliche Nennung da («3er-Set», «alte Methode»,
«drei Herausforderungen A/B/C»).

**Wie die Trennung entsteht:** Die Beschreibung der alten Skill darf nicht
angefasst werden (Invariante 3). Die Abgrenzung steht darum allein in der
Beschreibung der neuen Skill (sie nennt, wofür sie **nicht** da ist: 3er-Set,
EBA, KI-Toolbox) und in `CLAUDE.md`.
**Alternative:** alte Skill als Standard lassen, neue nur auf «v4.2» — verworfen,
weil neue Einheiten nicht mehr im 3er-Format entstehen sollen.
**Rückgängig:** Ordner `.claude/skills/bbw-hko-heft-v42/` löschen, die zwei
Absätze in `CLAUDE.md` und die Zeile in `docs/cloud-run/RUN.md` zurücknehmen.

## E21 — Ableitungsregeln für alles, was nach dem ersten Druck fest ist

Die Skill leitet ab und fragt nicht (Invariante 6). Im Auto-Modus stehen die
Werte schon im Bauplan; sie müssen dieser Regel entsprechen.

| Was | Regel |
|---|---|
| Ordner | `<X.Y.Z>_<slug>` unter `src/data/einheiten/`. `X.Y.Z` = erste Kompetenz von Heft A im kanonischen Lehrgang. `slug` = zwei bis drei Wörter aus dem Fokus (Gegenstand + Verb in der Grundform, wie `konsum_verantworten`), Kleinbuchstaben, `ä→ae ö→oe ü→ue`, nur `[a-z0-9_]`. |
| Lehrgang-Suffix | `_3j` bzw. `_4j` genau dann, wenn die Einheit nur für einen Lehrgang gilt **und** dieselbe Nummer im anderen EFZ-Lehrgang mit anderem Text existiert. Sonst kein Suffix. Kein `_v42` (das trug nur die Gold-Einheit, weil der Name vergeben war). |
| Ordner existiert schon | Nie überschreiben. Der slug wird um das nächste Kernwort des Fokus verlängert; existiert auch dieser Ordner, gilt die Einheit als nicht erzeugbar (Meldung, kein Schreiben). |
| IDs | `<ordner>_hf_A`, `<ordner>_hf_B`, `<ordner>_set`, `<ordner>_kn`, `<ordner>_prinzip` |
| Kurzlink / QR | `/m/<ordner>`, Anker `#a` und `#b`; QR-Inhalt `https://bbw-hko.ch/m/<ordner>#a` bzw. `#b` |
| Quellen-IDs | `q-<n><h>-pflicht`, `-pflicht-ersatz`, `-vertiefung-1`, `-vertiefung-2`. `<n>` = Ziffern der Ordnernummer ohne Punkte (`2.1.2` → `212`), auch für Heft B, das andere Kompetenzen trägt (Gold: `q-131b-…`). `<h>` = `a` oder `b`. |
| Quellen-ID vergeben | Gehört `q-<n><h>-pflicht` (Karte **oder** Archivordner) schon einer anderen Einheit, heisst der ganze Satz `q-<n>.<k><h>-…` mit der kleinsten freien Zahl `k ≥ 2` (`q-212.2a-pflicht`). Ein Satz, ein Muster — nie gemischt. |
| Archiv | `D:\OS\_lab\quellen-archiv\bbw-hko\<quellen-id>\gewaehlt\quelle.md`, verworfene Kandidaten daneben unter `kandidat-N\`. Nie im Repo. |
| `status` | exakt `"entwurf"` in `set.json` |
| `einheit_titel` | der Fokus als Titel, ohne Versionszusatz; nur wenn im Katalog schon eine gleichnamige Einheit steht, mit Zusatz in Klammern |

**Grund:** Eine Regel, die ohne Rückfrage dasselbe Ergebnis liefert, ist die
einzige, die in der Serie hält. Nichts im Code liest das Muster der
Quellen-IDs (geprüft: kein Treffer in `src/`), die Regel ist also frei wählbar.
**Rückgängig (solange nichts gedruckt ist):** Ordner umbenennen, IDs ersetzen,
Karten und Archivordner umbenennen, Index neu bauen.

## E22 — Probe: zwei T2-Baupläne, lokal vorbereitet, erzeugt je in einer Cloud-Session

**Vorgabe Pietro (02.10.2026, im Gespräch):** Getestet wird die Skill an zwei
Bauplänen aus Thema 2, je in einer eigenen Cloud-Session. Die Recherche über
SRG-API und Swissdox geschieht lokal in der Vorbereitung, vor der Übergabe.

| Probe | Lehrgang | Lebensbezug | Warum |
|---|---|---|---|
| 1 | EFZ 3J | 2.3 (2.3.1 Anliegen formulieren, 2.3.2 Meinung in Diskussionen) | andere Produkte (Statement, Diskussion), Interaktion mündlich, andere SK — prüft die Flexibilität nach dem Leitprinzip |
| 2 | EFZ 4J | 2.1 (2.1.1 mündliche Beiträge, 2.1.2 Desinformation) | 2.1.1 verlangt Rezeption mündlich und audiovisuell: Heft A hat nur die Medien-Spur (§4.4) — ein Fall, den der Renderer noch nie gesehen hat |

**Diese Session liefert:** die Skill, die Rückwärtsprobe an 1.3.1 (Wegwerf-Ordner),
die zwei geöffneten Renderer-Stellen verallgemeinert (E25, E26), und für beide
Proben die Phasen 0, 1 und Q lokal: Bauplan mit «Freigabe: offen», Quellenkarten
im Repo, Volltexte im Archiv. Erzeugt werden die Einheiten in der Cloud
(Auto-Modus), nach Pietros Freigabe der Baupläne. Der Vergleich Gold gegen Probe
(Leitprinzip, Punkt 5) folgt nach dem Cloud-Lauf; der Bericht dieser Session
enthält das Raster dafür und die Spalte Gold.
**Rückgängig:** nichts zu tun; ein anderer Bauplan genügt.

## E23 — Was die Skill tut, wenn eine Voraussetzung fehlt

| Es fehlt | Die Skill |
|---|---|
| ein Kapitel aus dem Bauplan bzw. der Crosswalk-Zeile unter `material/_lehrmittel/` | schreibt nichts; Einheit «nicht erzeugbar», Grund im Bericht |
| Quellenkarte **oder** Archiv-Volltext für einen Slot der Medien-Spur | erzeugt für dieses Heft nur `ohne_medien` und meldet es; erfindet keine Quelle, keine Karte, keinen Kurzbeschrieb |
| nur eine Vertiefung | Medien-Spur mit der Quelle und den vorhandenen Vertiefungen (0–2 sind zulässig); Meldung |
| die Spur `ohne_medien` ist nach §4.4 unzulässig (Heft verlangt Rezeption mündlich oder audiovisuell) **und** die Quelle fehlt | lokal: zuerst die Quellensuche (Phase Q); unbeaufsichtigt: Einheit «nicht erzeugbar» — ein Heft ohne Spur gibt es nicht |
| Transkript eines Audio- oder Videobeitrags | der Beitrag ist als Quelle mit Raster nicht zulässig (keine Lösung mit Fundstelle möglich, Invariante 10); als Vertiefung nur, wenn ein vom Herausgeber veröffentlichter Begleittext im Archiv liegt, und dann mit dem Vermerk «nicht gegengehört» in `erwartung` |
| ein Erwartungshorizont mit Fundstelle zu einer Leitfrage | Frage wird umformuliert, bis einer zu schreiben ist; nie umgekehrt |
| ein Entscheid, den weder Bauplan noch Regel deckt | die Variante mit dem engsten Bezug zum Wortlaut der nRLP-Kompetenz; Entscheid, Grund und Alternativen in den Bericht |

**Grund:** Invarianten 9 und 10; BERICHT §8 Punkte 1, 2, 7, 8.

## E24 — `check-v42.mjs` führt die Fall-Begriffe des Piloten fest im Code (nicht geändert)

**Befund:** `scripts/check-v42.mjs`, Zeilen 768–771: Zum Fall-Ausschluss aus
`prinzip.hybrid_situation_spec.fall_ausschluss_hefte_und_auftrag` kommen fest
sechs Wörter des Piloten 1.3.1 hinzu — `leasing`, `konsumkredit`,
`kleinkredit`, `e-bike`, `ebike`, `mobilität`. Sie gelten damit für **jede**
v4.2-Einheit: Ein Heft zum Klima (4J 2.5) darf «Mobilität» nicht nennen, eine
Einheit zu Finanzierungsarten (8.4.2) weder «Leasing» noch «Konsumkredit».
**Entscheid:** Das Skript bleibt unverändert (Scope-Zaun; der Brief verlangt
bei Skriptfehlern die Eskalation). Die Skill kennt die sechs Wörter als
«gesperrt, bis das Skript korrigiert ist» und meldet eine Einheit, deren
Gegenstand eines davon braucht, als nicht erzeugbar.
**Empfehlung an Pietro:** die sechs festen Wörter streichen; die Gold-Einheit
führt vier davon ohnehin in ihrer eigenen Liste und bleibt grün.
**Folge für den T2-Test:** 2.1–2.4 sind nicht betroffen; 4J 2.5 (Klima) erst
nach der Korrektur.

## E25 — Auftragsbogen A2/A3 richten sich nach den Produkten des Auftrags (Zaun geöffnet durch das Leitprinzip)

**Befund:** `DocAuftragsbogen.tsx` und `docx-auftragsbogen-v42.ts` nehmen
Schritt 04 fest als schriftliches Produkt (A2, Arbeitsfläche «schriftlich und
bildlich») und Schritt 05 fest als Sprachnachricht (A3, drei Stationen im Code,
Satz zur Abgabe der Sprachnachricht). Ein Auftrag mit anderen Sprachmodi
(Leitfaden §7.2) passt nicht hinein.

**Entscheid:** neues optionales Feld `gemeinsamer_auftrag.produkte` — genau
zwei Einträge, der erste belegt A2, der zweite A3:

| Feld | Bedeutung |
|---|---|
| `schritt` | Nummer des Schritts (1–5), dessen Produkt die Seite trägt; Titel und Hint kommen von dort |
| `form` | `"flaeche"` (freie Arbeitsfläche: alles Schriftliche und Bildliche) oder `"spur"` (Stationen mit Schreibzeilen: Planung eines mündlichen Beitrags, Gesprächs oder einer Diskussion) |
| `modus` | der Sprachmodus dieses Produkts, wörtlich einer aus `gemeinsamer_auftrag.sprachmodi`; zwei Einträge dürfen denselben tragen |
| `stationen` | nur `spur`: zwei bis vier Stationen in Ich-Form |
| `hinweis` | nur `spur`: der Satz über den Stationen (wie vorgehen, wie abgeben) |
| `dauer` | nur `spur`, optional: Zieldauer («3–4 Minuten»); ohne Angabe entfällt die Zeile «Ziel … · Probelauf» |

**Fehlt das Feld, rendert der Bogen genau wie bisher** (Gold: Schritt 04 Fläche,
Schritt 05 Sprechspur mit den drei festen Stationen). Regel für die Skill und
für `check-v42.mjs` (`ERR_V42_AUFTRAG_PRODUKTE`): genau zwei Einträge;
`schritt` 1–5 und verschieden; `form` einer der zwei Werte; jeder Modus aus
`sprachmodi` ist `modus` mindestens eines Eintrags, und jeder `modus` steht in
`sprachmodi` (Abdeckung; trägt der Auftrag nur einen Modus, haben beide
Einträge denselben — etwa Entwurf und Reinschrift, Planung und Durchführung); `spur` verlangt
`stationen` (2–4, je ≤ 60 Zeichen) und `hinweis` (≤ 260 Zeichen).
**Warum zwei Formen und nicht je Modus eine:** Was sich unterscheidet, ist die
Arbeitsweise auf dem Papier — frei gestalten oder einen Ablauf planen. Ein
Gespräch, ein Statement und eine Sprachnachricht planen sich alle über
Stationen; ein Brief, ein Plakat und ein Entscheidungsblatt brauchen eine
Fläche. Eine dritte Form wäre ein zweiter Sonderfall.
**Bedingung erfüllt, wenn:** Export der Gold-Einheit vor und nach dem Eingriff
— HTML bytegleich, Word gleiche Seitenzahl; `bestand-v42 --pruefen` unverändert.
**Rückgängig:** `git revert` des Commits; das Feld ist additiv.

## E26 — Produktbild: zwei weitere Blockarten (Zaun geöffnet durch das Leitprinzip)

**Befund:** `ProduktBildBlock` kennt Liste (`eintraege`) und Tabelle (`kopf`,
`zeilen`). Ein Brief, ein Statement oder ein Gespräch lässt sich damit nicht
zeigen, ohne es als Stichwortliste zu verbiegen.

**Entscheid:** zwei neue optionale Felder an `ProduktBildBlock`:

| Feld | Form | Wofür |
|---|---|---|
| `text` | `string[]` — Absätze in Schreibschrift | Fliesstext: Brief, Statement, Kommentar, Leserbrief |
| `wechsel` | `{ wer: string; text: string; marke?: string }[]` | Wechselrede: Gespräch, Diskussion, Interview — Sprecher links, Beitrag rechts |

Ein Block trägt genau eine der vier Arten (`eintraege` · `kopf`/`zeilen` ·
`text` · `wechsel`). Liste und Tabelle bleiben unverändert; ein Blatt hat
weiter zwei oder drei Blöcke, Titel und Legende wie bisher. Budgets für die
neuen Arten werden am gerenderten Blatt gemessen (S. 6 des Hefts ist eng) und
stehen danach in `check-v42.mjs` (`ERR_V42_PRODUKTBILD`).
**Gemessen (02.10.2026, an einer Wegwerf-Kopie der Gold-Einheit; in `check-v42.mjs` als `PB_E26`), Zeichen je Block über alle Absätze bzw. Beiträge:**

| Blockart | Blatt | bei 2 Blöcken | bei 3 Blöcken |
|---|---|---|---|
| `text` | Beispiel im Heft (S. 6) | ≤ 4 Absätze, ≤ 520 Zeichen | ≤ 3 Absätze, ≤ 320 Zeichen |
| `wechsel` | Beispiel im Heft (S. 6) | ≤ 5 Beiträge, ≤ 360 Zeichen | ≤ 5 Beiträge, ≤ 180 Zeichen |
| `text` | Lösungsbild | ≤ 5 Absätze, ≤ 1100 Zeichen | ≤ 5 Absätze, ≤ 750 Zeichen |
| `wechsel` | Lösungsbild | ≤ 8 Beiträge, ≤ 550 Zeichen | ≤ 6 Beiträge, ≤ 240 Zeichen |

`wechsel[].wer` ≤ 12 Zeichen. Gemischte Blätter (Text neben Tabelle oder Liste)
sind nicht abgetastet — dort entscheidet `messen-v42.mjs`. Zu E25 kam dazu:
`dauer` ≤ 30 Zeichen.
**Ergebnis der Bedingung (E25 und E26):** Gold-Export vorher und nachher — neun
von neun HTML-Dateien bytegleich, `word/document.xml` der Hefte, Lösungen und
des Auftragsbogens gleich; `bestand-v42 --pruefen` «26 Dokumente unverändert»;
`check-all` auf Gold grün; Build Exit 0. Das Stylesheet ist nicht angefasst
(es steckt in jedem exportierten HTML); die neuen Arten tragen Inline-Stile.
**Nicht geprüft:** Aussehen in Word (nur Seiten gezählt), Workbench im Browser.
**Rückgängig:** `git revert` des Commits; die Felder sind additiv.

## E27 — Befunde der zwei T2-Bauplan-Entwürfe: «geführt» und «geübt», und sieben kleine Regeln

Die Entwürfe für `2.3.1_anliegen_vertreten` (EFZ 3J) und
`2.1.1_informationen_hinterfragen` (EFZ 4J) haben Stellen gezeigt, an denen
die References der Skill sich widersprachen oder schwiegen. Entschieden:

1. **Geführt.** Ein Heft führt (`nrlp.sprachmodi` = `prinzip.modi_pro_heft`)
   die Sprachmodi seiner Kompetenz(en) von der Kompetenz-Ebene des Datensatzes
   — nichts von der Themen-Ebene (`regel4` würde sonst jede Spur ohne Medien
   sperren). Nur geführte Modi gehen in die Formel des Auftrags (§7.2).
2. **Geübt.** Seite 3 übt in jedem Heft Rezeption — das gehört zum Gerüst
   (LF3 analysiert eine Quelle). Nennt die Kompetenz keinen Rezeptionsmodus,
   ist diese Rezeption «geübt, nicht geführt»: Der Typ der Quelle folgt dann
   dem Modus des Themas (Leitfaden §5) mit der Ausweichfolge Audio → Video mit
   Untertiteln → Artikel, und die Karte muss keinen geführten Modus tragen.
   Die Abdeckungstabelle weist das als «geübt» aus, nicht als Lücke.
3. **Zwei Rezeptionsmodi in einer Kompetenz** (2.1.1: mündlich und
   audiovisuell): beide werden geführt. Die Quelle trägt den zuerst genannten;
   der andere bekommt seine Stelle über eine Vertiefung des anderen Typs und
   steht in der Abdeckung als «freiwillig geübt».
4. **Rezeptionsmodus im Auftrag** (ergibt die Formel, wenn kein Heft ihn
   führt): Das Produkt ist die sichtbare Auswertung eines Dokuments, das
   vollständig in der Situation des Auftrags steht (§7.4: kein Medium); Form
   `flaeche`.
5. **`modi_kn` gehört zum Gerüst.** Die drei KN-Formen sind fest, also auch
   ihre Modi. Im Vergleich mit Gold ist Gleichheit hier kein Befund.
6. **SK:** Die SK des Themas werden auf A und B verteilt (je drei, so viele
   verschiedene wie möglich, mindestens eine gemeinsam); der KN trägt die
   gemeinsame(n), ergänzt auf drei aus A und B. Eine SK des Themas, die
   nirgends Platz hat, nennt der Bauplan als Lücke.
7. **Methodenkarten** dürfen aus den Methodenkapiteln 16–20 stammen, auch wenn
   die Crosswalk-Zeile des Lebensbezugs sie nicht nennt: Die Karte ist die
   Fundstelle. Fachaussagen der Hefte kommen weiter nur aus den Kapiteln der
   Zeile.
8. **Heft mit nur einer Spur:** Die Ersatzquelle ist dort Pflicht (kein
   Rückfall auf die Spur ohne Medien), und sie hat denselben Typ oder
   Sprachmodus. Die Situation bleibt im Entwurf themenneutral; das Thema trägt
   die Quellensuche nach, bevor der Bauplan vorgelegt wird.
9. **Kleines:** Die dritte Zeile «Das nehme ich mit» lautet immer «Mir noch
   unklar». Die Dauer eines Produkts («Statement von zwei Minuten») darf im
   Heft stehen — verboten ist Unterrichtszeit (E17). Die Bauplan-Vorlage
   bekommt Felder für Titel (Einheit, Modul, Auftrag, KN-Fall), Leitfrage und
   Schritte je Heft, Schritte und Abgaben des Auftrags, Rasterspalten, und in
   §7 den Entwurfsstand mit Suchauftrag. «Stufe 1 oder 2» entfällt.

**Grund:** Leitprinzip (herleiten statt kopieren) und `regel4`; Leitfaden §5
und §7.2. **Rückgängig:** die betroffenen Absätze in den References
(`phase-0`, `phase-1`, `phase-2-3`, `phase-5`, `phase-7`, `phase-q`,
`kohaerenz.md`) und in `_VORLAGE.md`.

## E28 — Nach dem Cloud-Lauf: Player auf der QR-Seite, Überlauf hingenommen (Pietro, 03.10.2026)

1. **Audio und Video spielen direkt auf der QR-Seite** `/m/<Ordner>`. Für
   SRF-Beiträge mit URN bettet `src/pages/m/[setKey].astro` den Player von SRF
   ein (Start bei `verortung.von`), für Quelle, Ersatzquelle und Vertiefungen.
   Der Knopf darunter heisst dann «Bei SRF öffnen» und bleibt als Ausweg.
   Artikel, Grafiken, Webseiten und Medien anderer Anbieter bleiben ein Link.
   Kein neues Datenfeld; die Seite liest `typ`, `urn` bzw. `url` und
   `verortung.von` der Karte. Gilt auch für die Gold-Einheit.
   **Nicht geprüft:** der Player auf der Produktions-Domain und im Schulnetz
   (geprüft ist localhost, Desktop- und Handybreite); ob der Player bei `bis`
   stoppt (er tut es nicht — das Heft nennt die Zeitmarken).
   **Rückgängig:** `git revert` des Commits.
2. **Der Überlauf von 1,8 px auf Seite 6 von Heft A (`2.3.1_anliegen_vertreten`)
   ist hingenommen.** Er entsteht nur lokal (Schreibschrift Segoe Print); im
   Linux-Container der Cloud misst dieselbe Seite ohne Überlauf. Die Einheit
   bleibt, wie der Lauf sie geschrieben hat.
3. **Arbeitsansicht sagt, wenn ein Heft nur eine Spur hat.** Bei einem Heft mit
   nur einer Spur (2.1.1 Heft A: nur mit Medien, Leitfaden §4.4) zeigte der
   Umschalter «Ohne Medien» als gewählt und darunter trotzdem die Medien-Spur.
   Neu ist die fehlende Stellung durchgestrichen und gesperrt, die vorhandene
   ist markiert, und daneben steht «Heft A gibt es nur mit Medien»
   (`EinheitWorkbench.tsx`, gelesen aus `spuren_verfuegbar`; Inline-Stile, das
   Stylesheet ist nicht angefasst). Hefte mit beiden Spuren und alle
   Bestandseinheiten sind unverändert.

## E29 — Präsentation und Werkstatt für v4.2-Einheiten (Pietro, 03.10.2026)

**Auftrag Pietro:** Präsentation (mit Lösungen) und Werkstatt sollen auch für
v4.2-Einheiten da sein; die KI-Toolbox bleibt vorerst zurückgestellt. Damit ist
der Zaun für `src/lib/einheiten/deck-builder.ts`, `src/lib/werkstatt/`, die
zwei Unterseiten `deck.astro` und `werkstatt.astro` und die zwei Schalter in
`EinheitWorkbench.tsx` geöffnet.

**Regeln:**

- Beides rechnet zur Laufzeit aus den vorhandenen Daten der Einheit. **Kein
  neues Datenfeld**, keine Änderung an einer Einheit oder an der Skill.
- Alles Neue hängt am v4.2-Format (`spur_varianten` bzw. `heft_8page_v42`).
  Für jede alte Einheit bleiben Präsentation und Werkstatt-Prompts
  **zeichengleich** — vorher und nachher verglichen, wie bei E25/E26.
- **Präsentation:** je Spur eine Fassung (wie die Hefte), auch für ein Heft
  mit nur einer Spur. Sie zeigt je Heft Situation, Leitfragen, Quelle und
  Raster, Produkt mit Schritten und Kriterien, das Beispielbild, das
  Begriffsnetz — und die Lösungen, die seit E19 in den Daten liegen
  (LF1/LF2, gelöstes Raster mit Befund, Erwartungshorizont zu LF4,
  Lösungsbild, Verbindungen). Anstelle von «Austausch» und «Transfer» steht
  der gemeinsame Auftrag. Die Präsentation ist Material der Lehrperson; die
  Schranken von `deck.astro` (kein Gast, Entwurf nur KT1) gelten unverändert.
- **Werkstatt:** Der Konsistenz-Vertrag liest bei v4.2 zwei Hefte in der
  gewählten Spur, den Fall-Ausschluss des KN (statt der Persona-Pools), den
  gemeinsamen Auftrag mit `kontext_ausschluss` und die Quellen der Spur.
  Die Aufträge Differenzierung, Sprachniveau und KN-Übungsfall bleiben.
  **«Vierte Herausforderung D» heisst bei v4.2 «Weiteres Heft C»** — ein
  drittes Heft im selben Gerüst zum selben Prinzip, in der Spur ohne Medien
  (ein erzeugtes Heft kann keine geprüfte Quelle mitbringen). Von mir
  entschieden, weil Pietro die Frage offen liess; Alternative wäre «eine
  weitere Quelle mit Raster».
**Rückgängig:** `git revert` des Commits; die zwei Schalter in der
Arbeitsansicht blenden beides bei v4.2 wieder aus.

## E30 — Die sechs fest gesperrten Wörter aus E24 sind aufgehoben (Pietro, 04.10.2026)

**Entscheid Pietro:** Gesperrte Wörter sollen eine neue Einheit nicht
verhindern, die sich grundsätzlich von den bestehenden unterscheidet — etwa
weil derselbe Gegenstand für einen anderen Lehrgang gebraucht wird (3J 3.1
neben 4J 1.3) oder weil ein anderes Thema dasselbe Wort trägt (Klima,
Finanzierungsarten).
**Umsetzung:** `scripts/check-v42.mjs` führt `leasing`, `konsumkredit`,
`kleinkredit`, `e-bike`, `ebike`, `mobilität` nicht mehr fest im Code — die
Empfehlung aus E24. Der Fall-Ausschluss kommt nur noch aus
`prinzip.hybrid_situation_spec.fall_ausschluss_hefte_und_auftrag` der
jeweiligen Einheit. Die Prüfung wird damit nur weiter, nie enger: Keine
bestehende Einheit kann dadurch rot werden.
**Skill: noch nicht nachgeführt.** `SKILL.md`, `references/auto-modus.md`,
`references/sprache.md` §7.2, `references/phase-0-verortung.md` §9 und die
Phasen 2–3, 4, 6, 7, Q und Gegenleser nennen die sechs Wörter weiter als
gesperrt. Bis das nachgeführt ist, gilt dieser Entscheid vor dem Text der
Skill; Baupläne halten es in §9 als Ausnahme fest.
**Folge:** 4J 2.5, 3J 3.1 und 8.4 sind nicht mehr «nicht erzeugbar».
Der Bauplan `2.5.1_klimaveraenderung_diskutieren` hat den Verkehr wegen E24
ausgespart; er bleibt, wie er freigegeben ist.
**Rückgängig:** die sechs Wörter in `FALL_BEGRIFFE` wieder eintragen.

## E31 — Abschlussrunden vor der Freigabe: Karten, `tun`, Gegenleser, alte 1.3.1 (Pietro, 05.10.2026)

1. **Gegenleser ohne Profil b.** Lernende mit Deutsch als Zweitsprache (Profil b)
   gehören nicht mehr zur Besetzung; Befunde, die nur Sprachlast oder Zeitbedarf
   für B1 betreffen, werden nicht bearbeitet. In `references/gegenleser.md` §1
   und in den Lauf-Prompts nachgeführt (05.10.2026).
2. **`tun` wird bei `hko-`Karten nicht gedruckt** — es bleibt beim Renderer, wie
   er ist. Seite 6 hat in fast allen Einheiten 0 px Reserve. Die Übertragung
   einer eigenen Karte auf die Abgabe läuft über `fuer` und ausnahmsweise über
   `beispiel` in der Methoden-Referenz (`docs/methodenkartei.md`).
3. **Methodenkarten, zwei Gruppen.** *Fehler* werden in der Karte behoben, auch
   wenn eine publizierte Einheit sie verwendet: `lm-20-6-lernstrategien` (Satz
   stand nicht auf S. 444; Seite), `lm-2-2-budget` (Beispiel mit Saldo null über
   dem Hinweis, Saldo null sei verdächtig). *Passungsfragen* bleiben in der
   Karte, die Einheit überschreibt: `lm-16-2-statement`, `hko-gezielt-suchen`,
   `hko-verzichten-abwaegen`, `hko-bedarf-oder-wunsch`.
   `lm-17-2-stichwortnotizen` ist nicht geändert: «S. 381–382» stimmt (S. 383
   sind die Markierungen); abweichend ist der `quellen_anker` der Hefte.
   **Folge:** `bestand-vorher.json` ist am 05.10.2026 neu geschrieben. Vorher
   wichen vier Dokumente von `1.3.1_konsum_verantworten` ab (HF B und C, je
   HTML und Word, nur Modus `fill`) — alle durch Kartentexte
   (`lm-2-2-budget`; `lm-16-1-diskussion`, `lm-16-3-gestaltung` aus der
   Korrektur von 2.3.1), keine durch den Renderer.
4. **Die alte `1.3.1_konsum_verantworten` wird archiviert, sobald
   `1.3.1_konsum_verantworten_v42` freigegeben ist.** Bis dahin bleibt sie
   publiziert. Offen: was «archiviert» technisch heisst — `set.status` kennt
   nur `entwurf` und `publiziert`; jeder andere Wert gilt im Index-Builder als
   live.
**Rückgängig:** Karten per `git revert` des Commits; danach
`bestand-v42.mjs --schreiben`.

## E32 — Freigabe der v4.2-Einheiten für Lehrpersonen (Pietro, 05.10.2026)

**Entscheid Pietro:** Vierzehn Einheiten im Format v4.2 werden für alle
Lehrpersonen freigegeben; KT1 macht kein Review. Vorher liefen je Einheit eine
Abschlussrunde (Befunde aus den Laufberichten, Fakten an amtlichen Quellen,
Gegenleser Profil a, Tor, Messung — `docs/cloud-run/laeufe/*/NACHTRAG.md`) und
das Gegenhören der Audios und Videos durch Pietro.
**Freigegeben:** `1.1.1_ausbildung_kommunizieren`, `1.2.1_lernzeit_planen`,
`1.3.1_konsum_verantworten_v42`, `2.1.1_informationen_hinterfragen`,
`2.2.1_ausgrenzung_analysieren`, `2.2.1_meinungsfreiheit_reflektieren`,
`2.3.1_anliegen_vertreten`, `2.4.1_haltung_zeigen`,
`2.5.1_klimaveraenderung_diskutieren`, `3.1.1_konsum_verantworten_3j`,
`3.2.1_konsumfolgen_beurteilen`, `3.3.1_kaufvertrag_beurteilen`,
`4.1.1_wohlbefinden_staerken`, `4.2.1_risiken_absichern`.
**Archiviert:** `1.3.1_konsum_verantworten` (altes Format) steht wieder auf
`entwurf` — nur noch für KT1 sichtbar (E31 Punkt 4).
**Skript:** `check-v42.mjs` verlangte `status: "entwurf"` (Pilot-Regel). Neu
sind `entwurf` und `publiziert` zulässig; dass ein frisch erzeugter Ordner
`entwurf` trägt, erzwingt weiterhin `check-all` unter `--neu` und `--cloud`.
**Nicht im Index:** `4.3.1_vielfalt_untersuchen` und `5.2.1_gesetze_veraendern`
entstehen noch und sind nicht committet; der Index dieses Commits führt sie
nicht. Der nächste `build:einheiten-index` nimmt sie wieder auf.
**Offen je Einheit:** steht im jeweiligen NACHTRAG unter «offen» bzw.
«Entscheide».
**Rückgängig:** `status` in `set.json` zurück auf `entwurf`, Index bauen, deployen.

## E33 — Freigabe von 4.3.1 und 5.2.1 (Pietro, 07.10.2026)

**Entscheid Pietro:** `4.3.1_vielfalt_untersuchen` und `5.2.1_gesetze_veraendern`
werden für alle Lehrpersonen freigegeben; KT1 macht kein Review. Damit sind
sechzehn Einheiten im Format v4.2 publiziert.
**Vorher:** je Einheit Abschluss mit Tor, Messung, Gegenlesern und Fakten-Audit
(`docs/cloud-run/laeufe/2026-10-06-<ordner>/BERICHT.md`).
**Bei der Freigabe geprüft:** `check-all` für beide GRUEN, `bestand-v42
--pruefen` unverändert (26 Dokumente), `npm run build` Exit 0.
**Offen je Einheit:** steht im jeweiligen Bericht (4.3.1: §8 «gegenhören und
gegensehen» und §9 — darunter die Video-Vertiefung von Heft A, 22:49–26:52).
**Rückgängig:** `status` in `set.json` zurück auf `entwurf`, Index bauen, deployen.

## E34 — Die Skill allein beschreibt den Ablauf; Prompts tragen keine Regeln mehr (07.10.2026)

**Ausgangslage:** Für einen Lauf galt eine Dreifach-Schichtung: Skill ← Prompt
`einheit-aus-bauplan-lokal` ← Prompt `alle-bauplaene-seriell` («diese
Abweichungen gehen vor») ← E30 («gilt vor dem Text der Skill»). Wer ohne den
Schleifen-Prompt startete, arbeitete nach altem Stand (Rückblick
`RUECKBLICK-produktion-2026-10-06.md` §3 Nr. 3).

**Entscheid:**

1. **Ein Ablauf für jeden Start.** Einzelstart, Schleife und Abschluss rufen
   dieselbe Skill und bekommen denselben Ablauf: `references/lauf.md` (neu) —
   Rollen und Modelle (Orchestrator Opus, Executor Opus, Gegenleser Sonnet,
   Fakten-Audit Opus), Vorprüfung, Reihenfolge, was gleichzeitig laufen darf,
   Messung, Abbruch, Laufordner, Commit-Umfang inklusive Bauplan.
2. **Vorrang neu gefasst** (`SKILL.md` §1): ENTSCHEIDE bleibt oben, aber jede
   neue E-Nummer, die eine Regel der Skill ändert, wird **in derselben
   Session** in die Skill eingearbeitet und nennt die geänderten Dateien. «Gilt
   vor dem Text der Skill, noch nicht nachgeführt» ist kein zulässiger Zustand
   mehr. Ein Prompt trägt keine Regeln; widerspricht er der Skill, gilt die
   Skill.
3. **E30 ist nachgeführt.** Die sechs Wörter stehen in `SKILL.md` und elf
   References nicht mehr als gesperrt; verblieben sind zwei historische
   Verweise (`phase-0-verortung.md` §9, `sprache.md` §7.2). Auch
   `docs/cloud-run/bauplaene/_VORLAGE.md` führt die Zeile «Gesperrte Wörter
   (E24)» in §1 und den Zusatz in §7 «Suchaufträge» nicht mehr (nach dem
   Trockenlauf bereinigt).
4. **Messung in der Schreibphase.** Executor A und B messen ihr Heft und ihr
   Dokument «Lösungen» selbst, in einem eigenen Temp-Ordner, bevor sie abgeben
   (`lauf.md` §6; `phase-4`, `phase-5`, `phase-6` §7). Der Orchestrator baut den
   Index dafür einmal nach `prinzip.json` und `kn.json`.
5. **Phase 10 «Abschluss vor der Freigabe»** (`references/phase-10-abschluss.md`,
   neu) gehört zu jedem Lauf: offene Befunde, Fakten-Audit an Primärquellen mit
   Tabelle, Zahlen nachrechnen, erneutes Lesen nach der letzten Änderung, Tor
   und Messung, Gegenhör-Liste, Vorlage zur Freigabe (zweiter Stopp), Freigabe
   nur auf Pietros «ok». In der Schleife wird am zweiten Stopp nicht gewartet;
   die Einheit bleibt `"entwurf"`.
6. **Fakten im Bauplan.** Neuer Abschnitt «10. Fakten» in `_VORLAGE.md` und
   `phase-1-bauplan.md` §3.14: jede Rechts- und Sachaussage mit Primärquelle,
   URL, Abrufdatum; die Erzeugung zitiert nur daraus. **Übergang:** Ein Bauplan,
   der vor dem 07.10.2026 freigegeben wurde und keinen §10 trägt, bleibt
   erzeugbar; das Fakten-Audit prüft dann alles (`lauf.md` §3).
7. **Ein Bericht je Lauf** nach `assets/bericht-template.md` (neu), immer als
   Datei im Laufordner `docs/cloud-run/laeufe/<JJJJ-MM-TT>-<ordnername>/`, mit
   Kopf (Ordner, Modelle, Beginn, Ende, Runden) und der Liste «Offen» (Kürzel
   E/S/R/Q, Stand). `NACHTRAG.md` entfällt als eigene Form: Phase 10 und spätere
   Entscheide schreiben im selben Bericht weiter.
8. **Abbruch heisst verschieben, nicht löschen:** nach
   `laeufe/…/abgebrochen/` (`lauf.md` §7; angeglichen in `SKILL.md` §6,
   `phase-9-tor.md` §2, `auto-modus.md` §5 und §8, die «entfernen» sagten).
9. **Eine Session je Arbeitsbaum.** Die Ausnahme «zweite Session nebeneinander»
   aus dem Schleifen-Prompt entfällt.
10. **Commit gehört zum Ablauf:** einer je Einheit nach Phase 10 Schritt 6, mit
    Einheit, Karten, Bauplan, Laufordner, zwei Index-Dateien, nach
    `check-leck --staged`. Bisher sagte die Skill «kein Commit, ausser der
    Aufruf verlangt ihn».
11. **Gegenleser:** Das Lehrjahr der Rolle wird aus der Einheit hergeleitet
    (nie fest «1. Lehrjahr»); das Lösungs-Audit bekommt Untertitel Zeile für
    Zeile mit Einsatzzeit (`gegenleser.md` §4.1, §4.2).
12. **Prompts:** `einheit-aus-bauplan-lokal.md` ist ein Satz;
    `alle-bauplaene-seriell.md` führt nur noch Warteschlange und Schleife (die
    feste Reihenfolge der ersten vier Baupläne ist gestrichen — alle vier sind
    publiziert). Sieben überholte Prompts liegen unter `prompts/archiv/`.
13. **Skripte, die es noch nicht gibt** (`lauf.mjs`, `check-zeiger.mjs`,
    `check-namen.mjs`, `karten.mjs`, `check-belege.mjs`, `check-fakten.mjs`,
    `offen.mjs`, dazu `docs/cloud-run/OFFEN.md`): Die Skill nennt sie mit
    «sobald vorhanden» und dem Handweg (`lauf.md` §11). Beleg-Dateien liegen
    ausserhalb des Repos im Quellenarchiv unter `_pruefung/<ordnername>/`.

**Von mir entschieden, weil keine Vorgabe es deckte** (bitte bestätigen oder
ändern): Punkt 5 «Schleife wartet nicht»; Punkt 6 «Übergang»; Punkt 4 «Index
einmal vor den Executorn» (am Code des Index-Builders gelesen, nicht im Lauf
erprobt); im Abbruchfall bleiben Bericht und `abgebrochen/` uncommittet im
Arbeitsbaum; höchstens drei Leserunden über Phase 9 und 10 zusammen.

**Nicht geprüft:** der Trockenlauf mit zwei Subagenten (Einzelstart gegen
Schleife) — er folgt nach diesem Eintrag durch den Orchestrator.

### Inventar — was nur ausserhalb der Skill stand, und wohin es gekommen ist

Zeilennummern der Spalte «widerspricht» beziehen sich auf den Stand vor dem
Umbau (Git `ad54734`). «—» heisst: Die Skill schwieg.

| # | Regel | stand in | widerspricht der Skill in | kommt nach |
|---|---|---|---|---|
| 1 | Die sechs Wörter des Piloten sind nicht mehr gesperrt | E30 | `SKILL.md`:197 · `auto-modus`:103 · `datenvertrag`:526–529 · `phase-0`:222–231, 257, 267 · `phase-1`:80 · `phase-2-3`:135, 203, 226 · `phase-4`:288–291 · `phase-6`:14, 62–63, 118, 244, 303 · `phase-7`:97, 269 · `phase-q`:13, 133, 198 · `sprache`:111–133, 360, 375 · `gegenleser`:23, 111 | an allen Stellen entfernt |
| 2 | Überlauf bis 2 px auf Seite 6 hingenommen, nur gemeldet | E28 Nr. 2; Einzel-Prompt | — | `phase-9-tor` §1 · `lauf` §6 |
| 3 | Player auf der QR-Seite; Umschalter bei nur einer Spur | E28 Nr. 1, 3 | — | keine Regel der Skill; QR-Seite steht auf der Gegenhör-Liste (`phase-10` §6) |
| 4 | Präsentation und Werkstatt für v4.2 | E29 | — | keine Regel der Skill (rechnet zur Laufzeit) |
| 5 | Gegenleser ohne Profil b | E31 Nr. 1 | — (am 05.10. nachgeführt) | `gegenleser` §1, unverändert |
| 6 | `tun` wird bei `hko-`Karten nicht gedruckt; Übertragung über `fuer`, ausnahmsweise `beispiel` | E31 Nr. 2 | `phase-4`:255–257 · `datenvertrag`:628 | `phase-4` §8 · `datenvertrag` §11.3 · `lauf` §10 |
| 7 | Karten: Fehler in der Karte, Passung in der Einheit | E31 Nr. 3 | `phase-4`:259–262 («nie geändert», ohne Weg) | `phase-4` §8 · `lauf` §10 (Skript `karten.mjs` sobald vorhanden) |
| 8 | Abschlussrunde je Einheit vor der Freigabe | E32; Prompts `abschluss-*`, `1a` | `SKILL.md`:200–206 (fertig nach Phase 9) | `phase-10` · `SKILL.md` §4, §7 |
| 9 | Freigabe: `status` → `publiziert`, Index, Prüfungen, Commit, Eintrag | E32, E33; Prompt `1a` | `SKILL.md`:131–132 («kein `status`-Wechsel», ohne Ausnahme) | `phase-10` §8 · `SKILL.md` §5 Nr. 1 |
| 10 | Archivierte Einheit steht auf `entwurf` | E31 Nr. 4, E32 | — | nicht eingearbeitet — eigener Auftrag («archiviert») |
| 11 | Rollen und Modelle | Einzel-Prompt, Schleifen-Prompt, `zwei-einheiten` | — | `lauf` §2 · `SKILL.md` §4 |
| 12 | Vorprüfung: Freigabe, Karten und Archivtext, Blockade in §9 | Einzel-Prompt | — | `lauf` §3 |
| 13 | Fertig, nicht erzeugbar, Ordner ohne Commit → überspringen | Schleifen-Prompt §1 | — | `lauf` §3 (Zeilen 3–5) |
| 14 | Gleichzeitig: Executor A und B, alle Gegenleser; nacheinander: Set, Begleiter | Schleifen-Prompt §3 | `SKILL.md`:97 («A, dann B») | `lauf` §5 · `SKILL.md` §4 |
| 15 | Index, Tor, Build, Commit nur beim Orchestrator; nie zwei Tore | Einzel-Prompt | — | `lauf` §5 · `phase-9-tor` |
| 16 | Kein worktree, kein `npm ci`, kein Branchwechsel | beide Prompts | — | `lauf` §5 · `SKILL.md` §4 |
| 17 | Zweite Session nebeneinander (Ausnahme) | Schleifen-Prompt §1 | — | **entfällt** — `lauf` §3 Zeile 1 |
| 18 | Zwei Einheiten dürfen parallel laufen | `zwei-einheiten` | — | **entfällt** — `lauf` §5 |
| 19 | Abbruch: Bericht «nicht erzeugbar», Ordner verschieben, Index neu | Schleifen-Prompt §3 | `SKILL.md`:198 · `phase-9-tor`:64–66 · `auto-modus`:105, 168–171 («entfernen») | `lauf` §7, an den vier Stellen angeglichen |
| 20 | Ein Commit je Einheit mit Bauplan, Bericht, Index; `check-leck --staged` | Schleifen-Prompt §4 | `SKILL.md`:206 · `phase-9-tor`:134 · `auto-modus`:190 («kein Commit, ausser …») | `lauf` §8 · `SKILL.md` §7 |
| 21 | Bericht als Datei im Laufordner | beide Prompts | `phase-9-tor`:120 · `auto-modus`:182 («lokal: in der Antwort») | `lauf` §8 · `assets/bericht-template.md` |
| 22 | Dev-Server nur beim Einzelstart | Einzel-Prompt; Schleifen-Prompt §3 | — | `lauf` §9 |
| 23 | Bestandsprobe (Gold, 2.3.1, 2.1.1 bleiben grün); Messung mit Segoe Print | Einzel-Prompt «TOR» | — | `phase-9-tor` §1 |
| 24 | Bekannte Fehler lesen: nicht neu melden, nicht reparieren | Einzel-Prompt | — | `lauf` §3 |
| 25 | Keine Rückfrage, kein Swissdox, keine Zugangsdaten | beide Prompts | — | `lauf` §10 (`auto-modus` §6 hatte es zum Teil) |
| 26 | Executor misst selbst, eigener Temp-Ordner | Schleifen-Prompt §3; Rückblick §4, §5.2 | — | `lauf` §6 · `phase-4` §13 · `phase-5` §14 · `phase-6` §7 · `SKILL.md` §4 |
| 27 | Offene Befunde: behoben / stehen gelassen / braucht Entscheid | Prompts `abschluss-*` | — | `phase-10` §1 |
| 28 | Fakten-Audit an Primärquellen, Tabelle, eigener Subagent Opus | Prompt `1a`; E32; Rückblick §4, §5.2 | `SKILL.md`:137–142 (Belege nur aus Lehrmittel, Datensatz, Archiv) | `phase-10` §2 · `SKILL.md` §5 Nr. 3 |
| 29 | Fakten schon im Bauplan | Rückblick §5.2, §5.4 | — | `_VORLAGE.md` §10 · `phase-1` §3.14 · `auto-modus` §6 |
| 30 | Zahlen von Hand nachrechnen, Fallzahlen überall gleich | Prompt `1a`; Rückblick §4 | — | `phase-10` §3 |
| 31 | Nach jeder Änderung von Text oder Lösung erneut lesen | Prompts `abschluss-*`, `1a`; Rückblick §4 | — | `phase-10` §4 · `gegenleser` §2, §4.2 |
| 32 | Gegenhör-Liste für Pietro | Prompts `abschluss-*`; Nachträge; Rückblick §5.2 | — | `phase-10` §6 · Bericht-Gerüst §9 |
| 33 | Stopp vor der Freigabe; Entscheide Pietros im selben Bericht | Prompt `1a`; Berichte vom 06.10. | — | `phase-10` §7 |
| 34 | Lösungs-Audit mit Untertiteln in voller Auflösung | Prompt `1a`; Nachtrag `2026-10-03-221` §7; Rückblick §5.3 | `gegenleser`:22, 103–106 (nur «Archivtext») | `gegenleser` §1, §4.2 |
| 35 | «1. Lehrjahr» aus der Einheit herleiten | Berichte `2026-10-04-411` §10, `…5.2.1…` §11; Rückblick §5.4 | `gegenleser`:75 | `gegenleser` §4.1 |
| 36 | Marker-Skript nach jeder Änderung an Heft, Set, KN | Berichte 221, 331, 411, 421, 241 | — (nur in Phase 8 gesagt) | `lauf` §4 · `phase-9-tor` §1 |
| 37 | `export-v42` setzt den Index voraus | Bericht `2026-10-04-321` §10 | — | `lauf` §4 Schritt 3, §6 |
| 38 | Seite 8 vor Phase 7 nicht messbar | Bericht `2026-10-05-241` §10 | — | `lauf` §6 · `phase-6` §7 |
| 39 | Dokument «Lösungen»: LF3 auf S. 2, LF4 und Vertiefungen auf S. 3 | Bericht `2026-10-03-221` §13 | — | `lauf` §6 · `phase-5` §14 |
| 40 | Wo kein Budget besteht, entscheidet die Messung (`erwartung`, `beispiel_pol_*`, `hinweis`, Zellen, Karten S. 6) | Berichte 121, 221, 331, 421, 4.3.1 | — | `lauf` §6 · `phase-4` §13 · `phase-5` §14 (Budgets im Skript: späterer Auftrag) |
| 41 | Paket der Gegenleser: Archivdateien haben mehrere Formen, Windows-Zeilenenden | Berichte 321, 411, 4.3.1 | — | `gegenleser` §3 |
| 42 | Kurzbeschrieb einer Quellenkarte verrät die Lösung nicht | Nachtrag `2026-10-04-311` §6; Rückblick §4 | — | `phase-q` §8 · `phase-10` §1 |
| 43 | `verortung.absaetze` einer Webseite in auffindbaren Worten | Nachtrag `2026-10-04-411` §7; Bericht `2026-10-04-421` §10 | — | `phase-q` §8 |
| 44 | Executor ohne Fortschritt: in kleinen Schritten fortsetzen; Scratchpad je Lauf | Berichte `2026-10-04-421`, `2026-10-05-241` §10 | — | `lauf` §5 |
| 45 | Leck-Prüfung auch für Bauplan und Bericht | Bericht `…4.3.1…` §10; Rückblick §3 Nr. 2 | — | `phase-9-tor` §1 (seit `d8e74d6`) · `lauf` §8 |
| 46 | Lehrmittel widerspricht dem Gesetz | Bericht `…4.3.1…` §10 | — | `phase-10` §2 · `phase-1` §3.14 (kein stiller Entscheid) |
| 47 | Laufordner mit vollem Ordnernamen | Rückblick §3 Nr. 8; Läufe vom 06.10. | — | `lauf` §8 (Prüfskript: späterer Auftrag) |
| 48 | Offene Punkte als Liste mit Kürzel und Stand | Rückblick §3 Nr. 6 | `gegenleser`:124 (Abschnitt «Fehler in Skill, Skript, Renderer») | Bericht-Gerüst §10 · `gegenleser` §5 |
| 49 | Kein Start mit offenen S-Punkten, die Fehler erzeugen | Rückblick §5.4 | — | `lauf` §3 Zeile 9 (greift, sobald `OFFEN.md` vorhanden) |
| 50 | Fehler aus Regel, Skelett, Karte, Renderer: gleiche Stelle in allen Einheiten suchen | Rückblick §5.4 «Rückweg» | — | `lauf` §10 · Bericht-Gerüst §10 |
| 51 | Abgeleitete Einheit gilt als neue Einheit, kein Beleg wird übernommen | Rückblick §5.4; Prompt `anpassung-3.1.1` | — | `phase-10` §1 Nr. 5 (Feld `abgeleitet_von`: späterer Auftrag) |
| 52 | Belege als Daten, blind lösen, vier Urteile, Hash | Rückblick §5.1, §5.3 | — | nur als «sobald vorhanden» (`lauf` §11, `gegenleser` §4.2, `phase-10` §2) — späterer Auftrag |
| 53 | Cloud-Weg über `RUN.md` | Cloud-Prompts 2.1.1, 2.3.1; Rückblick §1, §5.5 | — | `auto-modus` §9: seit 03.10. nicht benutzt, Entscheid offen |

**Regel-Lücken aus den Laufberichten, die dieser Eintrag nicht einarbeitet**
(inhaltliche Regeln, Skelette oder Skripte — sie gehören in die Sammelliste):
Seiten im Paket des Bogen-Lesers (Bericht `2026-10-04-111` §9 Nr. 9) · Skelett
`herausforderung-template.json` «Begriff aus LF1» gegen `phase-5` §8 · «(Beispielwert)»
im Beispiel der Rezeptionskarte (`phase-5` §9) · Rasterspalten als Konstante
gegen Bauplan §7 · Stationen in Ich-Form gegen Bauplan §6 (`phase-7` §4.1) ·
«Minuten» in `phase-5` §13 gegen `sprache` §2 · Budgets und Kartenhöhe schon im
Bauplan zählen · Stufe 3 der Kriterien teils unerreichbar · `set.wochenplan`
mit zwölf Lektionen · `set-template.json` ohne `lehrgaenge` · Begleiter-Skelett
ohne Ort für Geräte, Lehrgänge, «vor dem Druck» · Persona «1. Lehrjahr» bei
zwei Lehrgängen · fehlende Rezeptionskarte für Video.

### Nach dem Trockenlauf behoben (07.10.2026)

Zwei Subagenten — einer mit dem Einzelstart, einer über den Schleifen-Prompt —
lasen aus der Skill denselben Ablauf: Rollen, Messung, Fakten-Audit, Phase 10,
Commit-Umfang. Der gewollte Unterschied (Dev-Server, Warten am Freigabe-Stopp)
bleibt. Sieben Widersprüche und Lücken sind behoben:

1. **Marker-Skript** (vom Orchestrator entschieden): Der Executor Begleiter
   führt es einmal aus, am Ende von Phase 8, an seiner eigenen Datei; jeder
   spätere Lauf liegt beim Orchestrator. `lauf.md` §2, §4, §5 ·
   `phase-8-begleiter.md` §3 · `SKILL.md` §4.
2. **Eigene und bestehende Karten** (vom Orchestrator entschieden): Eigen ist
   die Quellenkarte, die nur diese noch nicht publizierte Einheit führt;
   korrigierbar sind Zeitmarken, Wortzahl bzw. Dauer, Prüfdatum,
   `kurzbeschrieb` — nie Titel, URL/URN, Ausschnitt. Alle anderen Karten sind
   bestehend und werden nicht angefasst. `lauf.md` §10 · `phase-10` Kopf und
   §1 Nr. 1 · `SKILL.md` §5 Nr. 12. Herkunft: Rückblick §3 Nr. 4–5, E31 Nr. 3.
3. **Neue Methodenkarte** (vom Orchestrator entschieden): Der Orchestrator
   legt eine vom Bauplan §9 verlangte Karte an, bevor die Executor starten.
   `lauf.md` §2, §4, §5 · `phase-4-heft-kern.md` §8; im Commit-Umfang genannt in
   `SKILL.md` §7 und `assets/bericht-template.md` §12.
4. **`check-all --cloud`** (vom Orchestrator entschieden): nur für den
   Cloud-Weg über `RUN.md`; lokale Läufe rufen `check-all <ordner>` ohne die
   Option, das Lehrmittel prüft die Vorprüfung. `phase-9-tor.md` §1.
5. **Phase 0 im Auto-Modus:** läuft nicht als Erzeugung; die Prüfung des
   Bauplans gegen Datensatz, Kapiteldateien und Ableitungsregeln ist Zeile 7
   der Vorprüfung. `auto-modus.md` §2 · `lauf.md` §3.
6. **Bericht und Commit-Hash:** Der Bericht nennt den Titel des Commits, die
   Schlussmeldung den Hash; beim Freigabe-Commit wird er nachgetragen.
   `lauf.md` §8 · `assets/bericht-template.md` §12 · `phase-10` §8.
7. **Abbruch gegen ältere Baupläne:** Sagt ein Bauplan «der Lauf entfernt die
   Karte», gilt die Skill — verschieben nach `abgebrochen/`. `lauf.md` §7.

### Zweite Leserunde (07.10.2026) — vom Orchestrator entschieden

Zehn kleinere Widersprüche, behoben in einem Commit:

1. **Fakten ohne §10:** Die Übergangsregel steht jetzt auch in `SKILL.md` §5
   Nr. 3 und `phase-1-bauplan.md` §3.14.
2. **Bauplan:** nicht anfassen, ausser um eine Leck-Stelle umzuformulieren
   (`lauf.md` §10).
3. **Ordner liegt schon ohne Commit da:** nicht anfassen, melden, weiter über
   den Start «Abschluss» — kein «nicht erzeugbar», kein Verschieben. «Nicht
   erzeugbar» nur, wenn der Name einer anderen Einheit gehört und kein slug
   frei ist (`lauf.md` §7; `auto-modus.md` §5, §7).
4. **Schlussnachricht:** `lauf.md` §9, `phase-10` §7 und Bericht-Gerüst §11
   tragen dieselben Punkte, mit «freigabereif ja/nein» und Commit-Hash.
5. **`check-leck`** läuft nach dem Bericht, vor `git add` (`lauf.md` §4
   Schritt 11; `phase-9-tor.md` §1; Bericht-Gerüst §2).
6. **Reparaturrunde** = `check-all` und Messung. `check-all` nach drei Runden
   rot → Abbruch. Nur ein Überlauf über 2 px → kein Abbruch: Einheit bleibt
   `entwurf`, Punkt unter «Offen» (E), «freigabereif: nein»; bis 2 px auf S. 6
   hingenommen (`phase-9-tor.md` §2; `SKILL.md` §7 Nr. 1; `lauf.md` §4).
   Herkunft: E28, Rückblick §4 Zeile 1.
7. **Wer korrigiert:** Heft → Executor A/B; `set.json`, `begleiter.md` →
   Executor der Datei; `prinzip.json`, `kn.json` und eine in diesem Lauf neu
   angelegte Methodenkarte (bis zum Commit) → Orchestrator (`lauf.md` §4
   Schritt 8, §10; `phase-10` §1).
8. **«Skill nicht anfassen»** gilt für den Erzeugungslauf; die Pflicht aus
   `SKILL.md` §1 trifft die Session, die einen Entscheid fällt (`lauf.md` §10;
   `phase-10` §8 Nr. 4).
9. **Bestandsprobe** über die drei Einheiten auch in `lauf.md` §4 Schritt 6
   und Bericht-Gerüst §2.
10. **Phase 0 im Auto-Modus:** `phase-0-verortung.md` §10 angeglichen;
    `auto-modus.md` §7 prüft Vorhandensein der Kapiteldateien und Seitenmarken,
    nicht den Inhalt; `phase-8-begleiter.md` §8 ohne `check-all` für den
    Executor; `SKILL.md` §5 Nr. 10 und `auto-modus.md` §3 verträglich mit
    «eigene Karte korrigierbar».

Nicht ergänzt: ein Satz im Schleifen-Prompt, wie ohne ScheduleWakeup (unter
`/goal`) fortgesetzt wird — die archivierten Prompts belegen dazu nichts.

**Rückgängig:** `git revert` der Commits dieses Eintrags (Skill, Prompts); die
archivierten Prompts liegen unverändert bis auf ihre Kopfzeile unter
`docs/cloud-run/prompts/archiv/`.

## E35 — Namen eindeutig: Laufordner mit vollem Ordnernamen, `check-namen.mjs` im Tor (07.10.2026)

**Ausgangslage:** Mehrere Einheiten tragen dieselbe Kompetenznummer (1.1.1
fünfmal, 3.2.1 dreimal, 2.2.1 zweimal). Der Laufordner hiess
`<datum>-<nummer>` und war damit nicht eindeutig: `2026-10-03-221` und
`2026-10-04-221` sind zwei verschiedene Einheiten. Die Regel für Quellen-IDs
(`q-<n>.<k><h>-…`, E21) stand in der Skill, aber kein Skript prüfte sie
(Rückblick `RUECKBLICK-produktion-2026-10-06.md` §3 Nr. 8).

**Entscheid:**

1. **Laufordner neu:** `docs/cloud-run/laeufe/<JJJJ-MM-TT>-<ordnername>[-<k>]/`
   — der volle Ordnername; ein weiterer Lauf derselben Einheit am selben Tag
   trägt `-2`, `-3`. Bestehende Laufordner werden **nicht umbenannt**; die
   neue Datei `docs/cloud-run/laeufe/INDEX.md` ordnet jeden Ordner alter Form
   seiner Einheit zu und führt `2026-10-07-umbau` als «kein Einheiten-Lauf».
2. **`scripts/check-namen.mjs`** (neu, nur lesend) prüft: jede ID einmalig und
   gleich dem Dateinamen; die fünf IDs einer Einheit und ihre Verweise aus dem
   Ordnernamen; Kurzlinks paarweise verschieden (auch gegen die festen Seiten
   unter `src/pages/m/`); jede Quellenkarte gehört genau einer Einheit,
   `archiv_ref` ist `<id>/gewaehlt` und der Ordner existiert; ein Satz Quellen-IDs,
   ein Muster; Laufordner neuer Form verweist auf eine Einheit; verwaiste Karten
   (Warnung). `--vor <ordner>` rechnet vor dem ersten Schreiben Laufordner und
   Quellen-Muster. In `check-all` steht es als Zeile «Namen».
3. **Schwere:** Verstoss an einer publizierten Einheit = Warnung (der Name ist
   gedruckt oder im Netz, E21), am Entwurf = Fehler; globale Befunde immer
   Fehler. Fehlt das Archiv lokal, meldet das Skript einen Hinweis und nie
   «GRUEN»; mit `--cloud` ist es ein Fehler.
4. **Geteilte Quellenkarten** stehen als Liste `GETEILT` im Skript, nicht als
   Feld `geteilt_mit` an der Karte: Der Datenvertrag und alle Karten bleiben,
   wie sie sind. Vorschlag für später: ein Feld `geteilt_mit: [<ordner>…]` an
   der Karte, damit die Liste nicht im Skript wächst.

**Von mir entschieden, weil keine Vorgabe es deckte** (bitte bestätigen oder
ändern): Ein Ordner ohne `BERICHT.md` ist kein Lauf einer Einheit und braucht
keine Zeile in `INDEX.md`; ein Laufordner mit `abgebrochen/<ordnername>/` oder
mit Bericht «nicht erzeugbar» und Bauplan gilt als Verweis auf eine Einheit,
auch wenn kein Ordner unter `src/data/einheiten/` besteht.

**Geänderte Dateien:** `ableitungsregeln.md` (§10 neu, Kopf, §2, §4, §5, §9),
`lauf.md` (§3 Zeile 10, §8, §11), `phase-0-verortung.md` (§8),
`auto-modus.md` (§7), `phase-9-tor.md` (Tor-Tabelle); `scripts/check-all.mjs`
(Zeile «Namen»).

**Rückgängig:** `git revert`; `INDEX.md` löschen. Kein Datensatz ändert sich.

## E36 — Karten: ändern oder neu anlegen; `karten.mjs` im Tor, Vermerk-Dateien (07.10.2026)

**Ausgangslage:** Methoden- und Quellenkarten sind Produktionsdaten:
`lm-17-3-3b-schema` führen 18 Einheiten (14 publiziert), `hko-quelle-raster`
alle 16 publizierten v4.2-Einheiten. Am 05.10.2026 wurden 17 Methodenkarten
korrigiert, als die Einheiten noch Entwurf waren; kein Skript nannte die
Verbraucher einer Karte, und keine Regel sagte, wann eine Karte geändert
werden darf und wann es eine neue braucht (Rückblick
`RUECKBLICK-produktion-2026-10-06.md` §3 Nr. 4, §4, §5.4). E31 Nr. 3 kannte
die Unterscheidung Fehler gegen Passung nur für sechs genannte Karten.

**Entscheid:**

1. **Regel «ändern oder neu»** (`docs/methodenkartei.md` §9 und
   `references/karten.md` der Skill, gleichlautend):
   a) kein publizierter und kein archivierter Verbraucher → ändern erlaubt;
   b) **Fehler** in der Karte → ändern auch bei publizierten Verbrauchern,
      aber nur mit Vermerk, danach je Verbraucher `check-all`, Export, Messung;
   c) **Passung** → Karte nicht ändern: die Einheit überschreibt (`fuer`,
      ausnahmsweise `beispiel`), sonst neue Karte mit eigener ID;
   d) **Quellenkarte:** Titel, URL/URN und Ausschnitt werden nach der ersten
      Freigabe nie getauscht — eine andere Quelle ist eine neue Karte;
      korrigierbar bleiben Zeitmarken, Wortzahl bzw. Dauer, Prüfdatum,
      `kurzbeschrieb` (bei gebundener Karte mit Vermerk);
   e) keine festen Zahlen und Formate in `merk` und `schritte` — Warnung.
2. **`scripts/karten.mjs`** (neu, nur lesend): `verbraucher <id>`, `darf <id>`
   (Exit 0/1), `geaendert [--gegen origin/main]`, `warnungen`; `--wurzel` wie
   `check-namen`. Fehlt der Vergleichsstand: Exit 2, nie grün. In `check-all`
   steht `geaendert` als Zeile «Karten».
3. **Vermerk** `{karte, datum, art: "fehler", beleg, verbraucher[]}` in
   `src/data/methoden/_aenderungen.json` bzw.
   `src/data/quellen/_aenderungen.json`; beide sind leer (`[]`) angelegt.
4. **Skill:** vor jeder Kartenänderung `karten.mjs darf <id>`, Ergebnis im
   Bericht. **Im Auto-Modus wird nie eine bestehende Karte geändert** — ein
   Fehler geht in den Bericht («Offen», Kürzel S) und in die Sammelliste.

**Ort der Vermerk-Dateien — geprüft, keine Abweichung vom Auftrag:** Die zwei
Loader (`src/lib/einheiten/methoden.ts`, `quellen.ts`) lesen den Ordner per
`import.meta.glob` und verwerfen jeden Eintrag ohne `id`; `check-v42.mjs`
liest Karten nur über ihre ID; `build-einheiten-index.mjs`, `export-v42.mjs`
und `bestand-v42.mjs` listen die Ordner nicht (`bestand-v42 --pruefen` nach
dem Anlegen: 26 Dokumente unverändert). Gestört hätten die Dateien nur
`check-namen.mjs` («Dateiname = id») und die Kartenliste von `check-all.mjs`;
beide überspringen jetzt Dateien mit führendem `_`. `src/lib` und `src/pages`
sind nicht angefasst.

**Von mir entschieden, weil keine Vorgabe es deckte** (bitte bestätigen oder
ändern):

- **«Gebunden»** ist eine Karte durch jede Einheit, die nicht `"entwurf"`
  trägt: `publiziert`, fehlendes oder unbekanntes Feld (gilt im Index-Builder
  als live) und `archiviert`. Den Status `archiviert` gibt es noch nicht; das
  Skript kennt ihn schon, weist ihn getrennt aus und behandelt ihn in `darf`
  und `geaendert` wie publiziert — die Hefte sind gedruckt im Umlauf, die
  QR-Seite einer archivierten Einheit funktioniert weiter (Entscheid Pietro,
  07.10.2026).
- **Die Zeile «Karten» gilt für den ganzen Baum**, nicht nur für die geprüften
  Einheiten: Eine geänderte Karte ändert auch Hefte ausserhalb des Umfangs.
- **Ein Vermerk zählt nur, solange er im Vergleichsstand noch nicht steht** —
  sonst deckte ein alter Vermerk jede spätere Änderung derselben Karte.
  `verbraucher` muss jeden gebundenen Ordner nennen (sonst rot); fehlende
  Entwürfe sind eine Warnung.
- **Quellenkarten:** `id`, `titel`, `url`, `urn` einer gebundenen Karte bleiben
  auch mit Vermerk rot (Regel d). Eine Änderung an `verortung` ist mit Vermerk
  zulässig, dazu eine Warnung: Ob Marken korrigiert sind oder der Ausschnitt
  ein anderer ist, entscheidet kein Skript. Alle übrigen Felder: mit Vermerk.
  «Erste Freigabe» ist die Freigabe des Bauplans, der die Quelle nennt.
- **Regel e** sucht Ziffern, Zahlwörter (zwei bis zwölf) und Formatwörter
  (A3–A6, Hoch- und Querformat …); Seiten-, Kapitel- und Artikelverweise
  zählen nicht. Im Tor erscheint sie nur für geänderte und neue
  Methodenkarten, der Bestand steht unter `karten.mjs warnungen` (07.10.2026:
  25 Warnungen in 17 von 42 Karten).
- **Rückwirkend ist kein Vermerk eingetragen.** Die Korrekturen vom 05.10.2026
  und die Änderung an `lm-17-3-3b-schema` vom 07.10.2026 (`seiten`, Commit
  `a5fa3eb`, nach der Freigabe von 14 Verbrauchern) stehen in `origin/main`;
  der Vergleich beginnt dort.

**Offen (kein stiller Entscheid):** `datenvertrag.md` §11.3 erlaubt
`methoden[].beispiel` im Kern nur als Ausnahme für `hko-`Karten (E31 Nr. 2);
die Regel c oben und `docs/methodenkartei.md` §4 nennen `beispiel` ohne diese
Einschränkung, und in den publizierten Einheiten überschreiben 14 Hefte, drei
davon an `lm-`Karten. Vorschlag in der Rückgabe zu diesem Auftrag; der
Datenvertrag ist nicht geändert. Noch nicht nachgeführt, weil ausserhalb des
Auftrags: `phase-9-tor.md` (Tor-Tabelle) und `assets/bericht-template.md`
nennen die Zeile «Karten» nicht.

**Geänderte Dateien:** `scripts/karten.mjs` (neu), `scripts/check-all.mjs`
(Zeile «Karten», Kartenliste ohne `_`-Dateien), `scripts/check-namen.mjs`
(`_`-Dateien überspringen), `src/data/methoden/_aenderungen.json`,
`src/data/quellen/_aenderungen.json` (neu, `[]`), `docs/methodenkartei.md`
(§6, §8, §9 neu); Skill: `references/karten.md` (neu), `SKILL.md` (§4, §5
Nr. 12), `lauf.md` (Kopf, §10, §11), `auto-modus.md` (§4),
`phase-4-heft-kern.md` (§8), `phase-6-abschluss.md` (§7),
`phase-q-quellen.md` (§2, §8).

**Rückgängig:** `git revert` der drei Commits; die zwei `_aenderungen.json`
entfallen dabei. Kein Datensatz und keine Karte ändert sich.

## E37 — Dritter Status «archiviert»: abgelöste Einheit nur für KT1, QR-Seite bleibt (Pietro, 07.10.2026)

**Anlass.** `set.json › status` kannte «entwurf» und «publiziert»; der
Index-Builder behandelte jeden anderen Wert — auch einen Tippfehler — als
live. Die abgelöste `1.3.1_konsum_verantworten` stand darum auf «entwurf» und
erschien für KT1 zwischen echten Entwürfen und im Entwurf-Zähler auf `/admin`
(E31 Nr. 4, E32; Rückblick 06.10.2026 §3 Nr. 7; Inventar E34 Nr. 10).

**Entscheid.**

1. `status` ist `entwurf` | `publiziert` | `archiviert` (oder fehlt = live).
   `scripts/build-einheiten-index.mjs` bricht bei jedem anderen Wert mit
   Fehlermeldung ab, bevor eine der zwei Index-Dateien geschrieben wird.
2. **Archiviert ist nur für KT1 sichtbar** — überall dort, wo ein Entwurf es
   ist: Katalog, Jahresplanung, Feedback-Auswahl, Prompt-Builder-Panel,
   Graph-Overlay, Direkt-URL der Detailseite samt Deck, «Lies mich!» und
   Werkstatt (Umleitung auf `/einheiten`). Eine Schranke: `istNurKt1()` in
   `src/lib/einheiten/index.ts` (= Entwurf oder archiviert); `visibleEinheiten`
   filtert damit.
3. **Die QR-Seite `/m/<ordner>` funktioniert weiter, für alle wie bisher**
   (Pietro, 07.10.2026): Gedruckte Hefte sind im Umlauf. Die Seite fragt den
   Status nicht — weder bei Entwurf noch bei archiviert.
4. **KT1** sieht archivierte Einheiten im Katalog in einem eigenen,
   eingeklappten Abschnitt «Archiv» unter der Landkarte, mit grauem
   Zustands-Badge «Archiviert · nur KT1» — nicht in der Landkarte, in keinem
   Zähler des Katalogs, nicht im Entwurf-Zähler auf `/admin`. Die Detailseite
   trägt einen grauen Hinweisbalken.
5. **`ersetzt_durch: "<ordner>"`** (optional, nur bei `archiviert`): Karte und
   Detailseite zeigen KT1 den Link zur Nachfolgerin. Der Builder prüft, dass
   der Ordner existiert; der Schlüssel steht nur im Index, wenn er gesetzt ist.
6. **Für die Prüfskripte gilt archiviert wie publiziert:** `check-namen`
   meldet Befunde als Warnung, `karten.mjs` zählt die Einheit als «gebunden»
   und weist sie getrennt aus (E36), `check-einheiten` und
   `check-bogen-v2-regression` halten sie eingefroren. `check-all`
   (`STATUS_OK`) und `check-v42` (`ERR_V42_STATUS`) lassen den Wert zu.
7. **Daten:** nur `1.3.1_konsum_verantworten` → `archiviert`,
   `ersetzt_durch: "1.3.1_konsum_verantworten_v42"`. Ihre Dokumente ändern
   sich nicht (`bestand-v42 --pruefen` unverändert). Feedback-Bögen und
   Statistik bestehender Einträge bleiben lesbar — sie hängen an der
   Einheiten-ID, nicht am Status.

**Was sich für lp und gast ändert:** nichts. Die alte 1.3.1 war für sie als
Entwurf schon unsichtbar.

**Nicht Teil dieses Entscheids, beim Erheben gefunden (kein stiller
Entscheid):**

- `public/nrlp/einheiten.index.json` ist eine öffentlich ausgelieferte
  statische Datei und führt **alle** Einheiten mit vollen Metadaten (Titel,
  Kompetenzen, Hefttitel, Status) — Entwürfe wie die archivierte. Ausgeblendet
  wird erst im Browser; die Rolle des Prompt-Builders kommt aus dem
  URL-Parameter `?role=`. Das war vor E37 so und ist unverändert.
- Keine Entwurf-Schranke haben heute `/jahresplanung/thema/[nr]` (listet alle
  Einheiten eines Lebensbezugs, auch Entwürfe, für jede Rolle),
  `/einheiten/<ordner>/feedback`, `/einheiten/<ordner>/ki-liesmich` und die
  zwei Word-Routen `/api/einheit-begleiter-docx` und
  `/api/einheit-ki-liesmich-docx`. Für die archivierte 1.3.1 heisst das: Sie
  ist dort so erreichbar wie zuvor als Entwurf.
- Auf den Astro-Seiten gilt die Rolle `reviewer` als `lp` (sieht weder
  Entwürfe noch Archiv); nur die statische Sub-App unter `public/nrlp/`
  behandelt `reviewer` wie `kt1`. Unverändert übernommen.
- `scripts/abdeckung.mjs` kennzeichnet jede Einheit, die nicht «entwurf» ist,
  mit «P» — auch die archivierte.

**Geänderte Dateien:** `scripts/build-einheiten-index.mjs`,
`scripts/check-all.mjs`, `scripts/check-v42.mjs`;
`src/lib/einheiten/index.ts`, `types.ts`;
`src/components/einheiten/EinheitCard.astro`; `src/pages/einheiten/index.astro`,
`[setKey].astro`, `[setKey]/deck.astro`, `begleiter.astro`, `werkstatt.astro`;
`src/pages/admin/katalog.astro`; `public/nrlp/prompt-builder/einheiten.js`,
`public/nrlp/ext/units-overlay.js`; Daten: `1.3.1_konsum_verantworten/set.json`
und die zwei Index-Dateien; Skill: `datenvertrag.md`, `phase-7-set.md`,
`phase-10-abschluss.md` (je ein Satz).

**Rückgängig:** `git revert` der Commits, danach `npm run build:einheiten-index`.

## E38 — Belege ausserhalb des Repos: Ort, Format, Lösungsfelder (Pietro, 07.10.2026)

**Ausgangslage:** Das Tor prüft Form. Was nach grünem Tor korrigiert wurde, war
fast nur Inhalt: falsche Zeiger, Ableitungen, die als Quellenaussage dastanden,
Rechts- und Sachfehler, Lösungen, die nach dem Audit geändert und nicht mehr
geprüft wurden (Rückblick `RUECKBLICK-produktion-2026-10-06.md` §4). Die Audits
gaben Prosa ab; daran prüft kein Skript etwas. Rückblick §5.1 schlägt vor, dass
jede prüfende Rolle eine **Beleg-Datei** abgibt, und liess offen, wo sie liegt
(§5.6, letzter Punkt).

**Entscheid Pietro (07.10.2026): Die Beleg-Dateien liegen ausserhalb des
Repos**, im Quellenarchiv — sie tragen wörtliche Anker aus Quelle und
Lehrmittel, und das Repo ist öffentlich.

**Stufe A — Ort und Format** (dieser Eintrag wird von den folgenden Stufen
desselben Auftrags ergänzt: Skripte im Tor, Rollen der Skill, Riegel gegen
Vererbung):

1. **Ort:** `<Quellenarchiv>/_pruefung/<ordnername>/` — ein Ordner je Einheit,
   nicht je Lauf; für geteilte Karten `<Quellenarchiv>/_pruefung/_karten/<id>.json`.
   Das Archiv wird aufgelöst wie in `check-namen.mjs` (`QUELLEN_ARCHIV`
   gewinnt). Die losen Dateien einer früheren Prüfung unter `_pruefung/`
   bleiben unberührt.
2. **Dateien:** `belege.json` (Lösungs-Audit: je Lösungsfeld Herkunft, Anker,
   Fundstelle, Urteil, Hash) · `fakten.json` (Fakten-Audit: je Aussage über die
   Welt Primärquelle, Abruf, Urteil) · `fall.json` (Executor des Hefts: die
   erfundenen Fallzahlen und was die Situation ausschliesst) · `probe.json`
   (Lösbarkeitsprobe: Befund, Beleg, Stand) · `herkunft.json`
   (`{abgeleitet_von, stand_commit}` bei einer Anpassung — `set.json` bekommt
   dafür kein Feld). Schemas im Repo unter `scripts/schema/`, je mit einem
   Beispiel aus erfundenem Platzhaltertext.
3. **Lösungsfelder** stehen an genau einer Stelle: `MUSTER` in
   `scripts/lib/loesungsfelder.mjs`, hergeleitet aus `types.ts`, dem
   Datenvertrag und der Gold-Einheit. Die 16 Einheiten im Format v4.2 führen
   zusammen 2062 Lösungsfelder (89 bis 142 je Einheit).
4. **Hash:** SHA-256 über den normalisierten Text des Felds (NFC, Zeilenenden,
   Leerraum zu einem Leerzeichen, Rand weg — sonst nichts). Jede sichtbare
   Änderung einer Lösung macht ihre Belegzeile ungültig.
5. **«stelle» je Form des Archivtexts**, erhoben an allen 158 Archivordnern:
   Zeitzeilen → `mm:ss` der Zeile; Absatz mit Zeit → `mm:ss` des Blocks;
   Absatz → `Abs. N`; Lehrmittel → `S. N` (Marke `[seite: N]`). Wo ein Audio
   oder Video keinen Text mit Zeitmarken hat, ist die Zeitmarken-Prüfung nicht
   möglich — das wird je Karte als HINWEIS ausgegeben, nie still bestanden;
   bei Blocktranskripten gilt nur das Fenster des Blocks.
6. **Beschreibung** für die Skill: `references/belege.md` (Ort, jede Datei,
   jedes Feld, die Urteile, wer schreibt).

**Folgen:**

- **Das Tor braucht das Archiv.** Fehlt es lokal, ist nichts geprüft: Exit 2
  bzw. HINWEIS, nie «grün». Ein Lauf ohne Archiv (Cloud) kann die Belege nicht
  prüfen.
- **`_pruefung/` gehört ins Backup des Archivs.** Geht der Ordner verloren,
  sind alle Audits zu wiederholen. (Nur genannt — das Backup selbst ist nicht
  Teil dieses Entscheids.)
- Für die 16 publizierten Einheiten gibt es noch keine Beleg-Dateien. Ihr
  Fehlen ist im Tor eine Warnung, kein Fehler; bei einem Entwurf ein Fehler.
- Im Repo steht nie ein Anker: Protokolle im Laufordner nennen Feld, Urteil
  und Fundstelle.

**Von mir entschieden, weil keine Vorgabe es deckte** (bitte bestätigen oder
ändern):

- **Körnung der Lösungsfelder:** jede Lösungszeile (`loesung.zeilen[i]`, sie
  trägt ihre eigene Fundstelle), jede Rasterzeile, jede Zeile der Denkhilfe,
  jede Verbindung des Begriffsnetzes und jeder Block des Lösungsbilds ist ein
  Feld; `gut_wenn`, `mitnahme` und `eigene_knoten` sind je ein Feld. Auch
  `loesung.kern` ist ein Feld. Feiner als «LF1 bis LF4» im Auftrag — dafür
  lässt sich die Fundstelle jeder Zeile mit ihrem Beleg vergleichen.
- **`spur`** kennt neben `ohne_medien` und `mit_medien` den Wert `beide` (Kern
  des Hefts, gemeinsamer Auftrag).
- **`weitere_belege`** (optional) in `belege.json`: Ein Feld bleibt eine
  Zeile, auch wenn es zwei Seiten oder zwei Zeitmarken nennt.
- **Urteil und Herkunft:** Bei `fallueberlegung` sind Anker, `wo` und `stelle`
  leer, und das Urteil ist `stimmt`, `ableitung` oder `falsch`; bei `quelle`,
  `lehrmittel`, `nrlp` ist es `stimmt`, `fundstelle_falsch` oder `falsch`.
- **`fakten.json`:** dazu `auch_in` (dieselbe Aussage in weiteren Feldern),
  `art`, `fundstelle`, `von`. Die vier Urteile der Fakten-Tabelle
  (`phase-10-abschluss.md` §2) fallen auf drei: «stimmt» und «vertretbar
  vereinfacht» → `belegt`.
- **`probe.json`** führt `laeufe[]`, damit «keine Befunde» nicht dasselbe ist
  wie «nicht gelaufen», und je Befund eine `art`.
- **Quellentext und Notiz** in einer Archivdatei trennt eine Regel am
  Schriftbild (`zerlegeArchivtext()`): Quellentext ist jede Zeile mit einer
  Marke in eckigen Klammern, dazu Tabellenzeilen; Abschnitte mit einer
  Überschrift wie «Audit-Notiz» und Listenzeilen nach dem Kopf sind Notiz. Ein
  Anker, der nur im Kopf oder in einer Notiz steht, ist kein Beleg.
- **Block oder Zeile:** Ein Text gilt als Blocktranskript, wenn der Median des
  Abstands zweier Einsatzzeiten über 6 Sekunden liegt (gemessen: Untertitel
  2,7 bis 4 s, Blöcke 8 bis 35 s).
- **Lehrmittel bei `--wurzel`:** Eine Temp-Kopie des Repos hat kein
  `material/`; die Bibliothek sucht das Lehrmittel dann im Repo selbst oder
  unter `LEHRMITTEL`.

**Beim Erheben gefunden (kein stiller Entscheid, nichts geändert):**

- Im Archiv fehlt der Ordner `q-221.2b-vertiefung-2/gewaehlt/`.
- 16 der 158 Archivtexte sind Blocktranskripte, 5 Audio- oder Videokarten
  haben keinen Text mit Zeitmarken (nur Begleittext oder Absätze). Von den 118
  Karten der 16 Einheiten bekommen 19 einen HINWEIS zur Zeitmarken-Prüfung.
- In mehreren Köpfen steht, die Zeitmarken seien berechnet, geschätzt oder
  nicht gegengehört; die Bibliothek gibt das als Stichwort weiter.
- Drei Kapiteldateien führen Seitenmarken nicht aufsteigend, zwei haben Text
  vor der ersten Marke.

**Noch nicht nachgeführt, weil ausserhalb dieser Stufe:** `SKILL.md` (Liste der
References), `gegenleser.md` §4.2, `phase-9-tor.md`, `ableitungsregeln.md`
§10 («noch kein Skript») — das tun die folgenden Stufen.

**Geänderte Dateien (Stufe A):** `scripts/schema/belege.schema.json`,
`fakten.schema.json`, `fall.schema.json`, `probe.schema.json`,
`herkunft.schema.json`, `karte-belege.schema.json` (neu);
`scripts/lib/loesungsfelder.mjs`, `scripts/lib/archiv.mjs` (neu, nur lesend);
Skill: `references/belege.md` (neu), `lauf.md` (Kopf, §8, §11),
`phase-10-abschluss.md` (§2, ein Verweis). `check-all.mjs` ist in dieser Stufe
nicht geändert; im Archiv ist nichts angelegt.

**Rückgängig:** `git revert` des Commits. Keine Einheit, keine Karte und kein
Skript des Tors ändert sich; im Archiv ist nichts zu entfernen.

### E38, Stufe B — Skripte im Tor (07.10.2026)

**Was dazukommt:** fünf Prüfskripte, je eine Zeile in `check-all` für jede
Einheit im Format v4.2, dazu `check-links` ausserhalb des Tors.

| Skript | Prüft |
|---|---|
| `scripts/check-belege.mjs` | `belege.json`: jedes Lösungsfeld eine Zeile, Hash (`ERR_AUDIT_VERALTET`), Anker im Archivtext bzw. auf der Lehrmittelseite, Zeile des Ankers im Ausschnitt der Karte, Zeitmarke höchstens 3 s neben dem Fenster des Ankers, Urteil, Ableitung gekennzeichnet, keine Fundstelle ohne Belegzeile; `probe.json` (offener Befund) |
| `scripts/check-fakten.mjs` | jede Aussage über die Welt (Artikel, «Stand …», Datum, Betrag, Prozent, Frist, Menge, Abstimmung) hat eine Zeile `belegt` in `fakten.json`; Fallzahlen aus `fall.json` ausgenommen |
| `scripts/check-zeiger.mjs` | `archiv_ref`, Wortzahl ± 5 %, Absatz, `von`/`bis`/`dauer_sek`; Zeitmarken und Absätze des Hefts im Ausschnitt; «S. n» trägt das genannte Element; jeder Schritt-Hinweis nennt eine Seite; Lehrmittelseite liegt im Kapitel |
| `scripts/check-zahlen.mjs` | Rechnungen im Text, Summenzeile einer Tabelle, Fallzahlen überall gleich, Ausschlüsse der Situation |
| `scripts/check-kohaerenz.mjs` | Handprüfungen `phase-9-tor.md` §3 Nr. 2–5 (gleiche Werte in Prinzip, Heft, Set · kein Lösungssatz bei den Lernenden · gesperrte Wörter · Umlaute), dazu Anzahl und Bezeichner, Kurzbeschrieb gegen Lösung, «Punkte» statt «Stufe» |
| `scripts/check-links.mjs` | mit Netz, **nicht im Tor**: Status und Weiterleitung jeder URL der Karten und Hefte. Wöchentlich: `node scripts/check-links.mjs --alle` (nichts ist eingeplant) |

**Regeln für alle fünf:**

1. **Schwere nach Status.** Gebundene Einheit (`publiziert`, `archiviert`,
   kein Feld): jeder Befund ist eine Warnung. Entwurf: Fehler. `--streng`
   behandelt jede Einheit wie einen Entwurf — für Gegenproben und für das
   Prüfen eines Altstands in einer Temp-Kopie.
2. **Fehlende Beleg-Datei:** eine Zeile je Datei («nicht auditiert») —
   `ERR_BELEGE_FEHLT`, `ERR_FAKTEN_FEHLT`, `ERR_FALL_FEHLT`; an den 16
   publizierten Einheiten also je drei Warnungen, kein Fehler.
3. **Exit** 0 ohne Fehler · 1 mit Fehlern · 2 bei falschem Aufruf oder wenn
   Archiv bzw. Lehrmittel lokal fehlt. In `check-all` heisst Exit 2 «nicht
   geprueft»; die Schlusszeile lautet dann «UNVOLLSTAENDIG», nie «GRUEN», und
   unter `--cloud` ist es ein Fehler.
4. **Ausgabe:** Code · Datei › Feld · Kurzbefund. Die Konsole darf Anker
   zeigen; `--protokoll <datei>` schreibt dieselbe Liste ohne Anker und ohne
   Textauszug — nur diese Fassung gehört in den Laufordner.
5. **`check-all`** zeigt Warnungen und Hinweise der fünf als Zählung je Code,
   nicht im Wortlaut (bei 16 Einheiten wäre das Tor sonst unlesbar), und
   reicht `--streng` durch.

**Gemessen am 07.10.2026 (16 publizierte Einheiten, heutiger Stand):**

- `check-all` für die 16: **GRUEN**, Laufzeit 6.4 s → 16.4 s (80 zusätzliche
  Skriptstarts).
- Gegenproben in einer Temp-Kopie (zwei Einheiten, eigene Archivkopie,
  Test-Belege mit aus dem Archivtext gezogenen Ankern): Grundlinie von
  `check-belege`, `check-fakten`, `check-zahlen` ohne Fehler; **83 von 83**
  einzeln eingebauten Fehlern lösen ihren Code aus.
- Befunde an den 16 unter `--streng` (nichts behoben — das ist die Liste für
  die publizierten Hefte): `check-belege` 16 × `ERR_BELEGE_FEHLT` ·
  `check-fakten` 16 × `ERR_FAKTEN_FEHLT` · `check-zahlen` 16 ×
  `ERR_FALL_FEHLT`, keine falsche Rechnung · `check-zeiger` 127 ×
  `ERR_ZEIGER_SCHRITT_OHNE_SEITE` (von 240 Schritt-Hinweisen), 7 ×
  `ERR_ZEIGER_WOERTER`, 45 Hinweise (Zeitmarken nur blockgenau, nicht prüfbar,
  im Kopf als berechnet vermerkt; Wortzahl nicht abgrenzbar) ·
  `check-kohaerenz` 4 × `ERR_KOH_LOESUNG_SICHTBAR`, 3 × `ERR_KOH_ANZAHL`,
  3 × `ERR_KOH_STUFE_PUNKTE`, 43 Warnungen.

**Nachgetragene Budgets in `check-v42.mjs`** (Rückblick §4, Zeile 1). Gemessen,
nicht geschätzt: alle 16 Einheiten exportiert und in Chrome gemessen
(`messen-v42`; 15 ohne Überlauf, 2.3.1 Heft A S. 6 mit 1.8 px — bis 2 px auf
S. 6 ist nach E28 hingenommen); ein Budget ist der Höchstwert, der in diesen
16 vorkommt, also der grösste Wert, von dem gemessen ist, dass er passt.

| Budget | Wert | Wo der Höchstwert steht · Reserve der Seite | hart |
|---|---|---|---|
| Erwartung einer Vertiefung (`quellen[i].erwartung`) | 730 Zeichen | 2.2.1_meinungsfreiheit, Heft B · Lösungen S. 4: 8.7 px | ja |
| Lösungen S. 4 je Spur (Erwartungshorizont LF4 + Erwartungen + Denkhilfe) | 3026 Zeichen | 5.2.1, Heft A mit Medien · 8.7 px | ja |
| Lösungen S. 3 mit Medien (LF3: kern + Zeilen + Rasterzeilen + Befund) | 2151 Zeichen | 3.2.1, Heft A · 87.1 px (Heft B derselben Einheit: 2138 Zeichen, 14.9 px) | nein |
| Kartentexte des Hefts: `fuer` · `tun` · `beispiel` | 106 · 267 Zeichen · 5 Zeilen zu 116 | 4.1.1 B · 4.3.1 A · 3.1.1 A, 3.3.1 A · S. 6 misst immer 0 px | nein |
| Rezeptionskarte der Spur: `fuer` · `beispiel` | 80 · 178 Zeichen | 4.2.1 A · 2.1.1 B | nein |
| Stufentexte in `kn.json` und im Auftrag | 120 Zeichen | Budget des Hefts; längster: 112 (3.3.1) | ja |
| Zahlentabelle des Auftrags: `label` · `wert` | 45 · 30 Zeichen | 2.1.1 (44; Bogen A1: 15.8 px) · 4.2.1 (30; A1: 4 px) | nein |

«Hart» heisst: Die Seite war beim Höchstwert voll — an einem Entwurf ist die
Überschreitung ein Befund (`ERR_V42_BUDGET`). Sonst, und an jeder gebundenen
Einheit, ist sie eine Warnung (`WARN_V42_BUDGET`, Exit unverändert): Die
Messung entscheidet. Keine der 16 Einheiten überschreitet ein nachgetragenes
Budget. Die Summe der Zeichen sagt eine Seite nur grob voraus (Lösungen S. 4
hatte auch bei 2157 und 2596 Zeichen nur 8.7 px Reserve) — das Budget ist eine
notwendige Grenze, keine hinreichende; `messen-v42` bleibt das Mass.

**Bekannte Skriptfehler (Rückblick §5.5):**

| Fehler | Reproduziert | Ergebnis |
|---|---|---|
| `check-einheiten` schweigt ohne `set.json` | ja: Einheit ohne `set.json` mit eingebautem Verstoss → «0 offene Befunde», Exit 0, alle Befunde «EINGEFROREN: live (kein status-Feld)» | behoben: Ohne `set.json` gilt die Einheit als im Bau, ihre Befunde zählen (62 offene Befunde, Exit 1). Ausgabe über alle 27 Einheiten unverändert |
| `ERR_V42_AUFTRAG_SPALTEN`, falscher Treffer | ja: Auftrag «…: Bild, Ton, Aussage, Begriff (Glossar, Heft S. 8).» → Befund, weil der Punkt in der Klammer den Satz zerschnitt | behoben: Klammern zuerst entfernen, dann am Satzende schneiden (Abkürzungen ausgenommen). Ein echter Verstoss wird weiter gefunden; die 16 Einheiten bleiben bei 0 Befunden |
| «UTF-16-Zählung» | — | liegt nicht in `check-v42` (zählt Codepunkte), sondern in `check-lf-loesung.mjs` (`String.length`). Nicht angefasst (ausserhalb des Umfangs dieser Stufe); in den 16 Einheiten ohne Wirkung, solange kein Zeichen ausserhalb der Grundebene vorkommt |
| `begleiter-marker.mjs` braucht mehrere Durchgänge | **nein**: an Kopien aller 16 Einheiten jedes Textfeld geändert (auch mehrzeilig, mit «\|») — ein Lauf füllt alles (178 bis 209 Marker), der zweite füllt 0, `--check` meldet 0 abweichend | nicht geändert. Die Berichte meinen: Nach jeder späteren Änderung an Heft oder Set muss das Skript erneut laufen — das ist eine Regel des Ablaufs, kein Fehler des Skripts |
| `seitentext.mjs` verliert den Quellentext | **nein**: Das Skript liest nur den Export, nie das Archiv; mit Windows-Zeilenenden in der Eingabe ist die Ausgabe zeichengleich. Verloren ging der Text in handgeschriebenen Paket-Skripten (Bericht 2026-10-03-121) | nicht «behoben». Die Umwandlung steht neu in `scripts/lib/seitentext.mjs` (geteilt mit `check-zeiger`, `check-kohaerenz`); die Ausgabe für alle 16 Einheiten ist vorher und nachher zeichengleich (75 Dateien). Für den Ausschnitt der Quelle gibt es `ladeArchivtext()` in `scripts/lib/archiv.mjs` |

**Von mir entschieden, weil keine Vorgabe es deckte** (bitte bestätigen oder
ändern):

- **Zuordnung Feld → Heftseite ohne Rendern.** Die Seitenfolge ist im Renderer
  fest (`DocHeftV42.tsx`: Seite 1 bis 8; `DocAuftragsbogen.tsx`: A1 bis A4),
  und jede Seite liest feste Felder — die Zuordnung steht als Tabelle in
  `scripts/lib/pruefung.mjs` (`seiteVonFeld`, `ELEMENT_SEITEN`). `--export`
  liest zusätzlich den gedruckten Seitentext (Wort in Guillemets vor einem
  Verweis; feste Texte des Renderers). Ohne Export gibt es dafür keinen
  Hinweis: Die statische Prüfung läuft vollständig.
- **Was ein Seitenzeiger ist:** nur ein Verweis, der das Element unmittelbar
  vor der Seite nennt («Checkliste (S. 8)»). «Übertragen Sie LF3 auf S. 7» ist
  keiner. Im Bogen und im Begleiter gilt «S. n» nur als Heftseite, wenn «Heft»
  dabeisteht.
- **«Jeder Schritt-Hinweis nennt eine Seite»** wörtlich genommen: «S. n» im
  Heft; im Bogen A1–A4, ein Heft oder ein eigenes Blatt. Das trifft 127 von
  240 Hinweisen der publizierten Einheiten.
- **Wortliste «Fallüberlegung/Deutung»** steht in `scripts/lib/pruefung.mjs`
  (`RE_FALLKENNZEICHEN`), erhoben an den Lösungen der 16 Einheiten;
  `references/sprache.md` führt bisher keine. Stufe C trägt sie dort nach.
- **`check-fakten` liest auch `kn.json` und die Karten der Einheit**, nicht nur
  Hefte, Lösungen, Auftrag, Begleiter und Glossar. Die Art `frist` umfasst jede
  Zahl mit Tag, Woche, Monat, Jahr, Stunde — auch ein Alter.
- **`check-zahlen` ohne `fall.json`:** Die Zeilen der `zahlen_tabelle` gelten
  als Fallzahlen (Name = Label). Eine Summenzeile wird nur geprüft, wenn die
  Tabelle genau eine hat und sie die letzte ist.
- **`check-kohaerenz`:** Zahl gleicher Dinge an zwei Stellen des Produkts ist
  nur eine Warnung (`WARN_KOH_ANZAHL`), weil dasselbe Wort zwei Sachen meinen
  kann; ein Fehler ist nur der Widerspruch zu den Daten (Stationen, Zeilen und
  Spalten des Lösungsbilds, Rasterzeilen). «Woche» und «Minute» sind eine
  Warnung und nur als Unterrichtszeit gesucht («in dieser Woche», «20
  Minuten» ausserhalb von Situation, Zahlen, Beispiel und Produktdauer).
  Schwelle Kurzbeschrieb: 55 % (gemessen an 122 Paaren: Median 29 %, 90 % unter
  54 %).
- **Zeitmarke einer Spanne:** «00:26–02:43» in einer Lösung gilt als belegt,
  wenn ein Anker in der Spanne beginnt.

**Geänderte Dateien (Stufe B):** neu `scripts/check-belege.mjs`,
`check-fakten.mjs`, `check-zeiger.mjs`, `check-zahlen.mjs`,
`check-kohaerenz.mjs`, `check-links.mjs`, `scripts/lib/pruefung.mjs`,
`aussagen.mjs`, `schema.mjs`, `seitentext.mjs`; geändert
`scripts/check-all.mjs` (fünf Zeilen je v4.2-Einheit, `--streng`, Zählung),
`scripts/check-v42.mjs` (nachgetragene Budgets, `auftragSpalten`),
`scripts/check-einheiten.mjs` (ohne `set.json`), `package.json` (sechs Zeilen
`check:*`), Skill `scripts/seitentext.mjs` (nutzt die Bibliothek),
`references/belege.md` (Abschnitt 11). Keine Einheit, keine Karte, kein
Renderer; im Archiv ist nichts angelegt.

**Rückgängig:** `git revert` der zwei Commits der Stufe B. Das Tor läuft dann
wie nach Stufe A.

### E38, Stufe C — Rollen der Skill (07.10.2026)

**Was sich ändert:** Das Lösungs-Audit der Skill ist neu gebaut, zwei Rollen
kommen dazu, und jede gibt eine Datei ab, die ein Skript aus Stufe B prüft
(Rückblick §5.1–§5.3; Auftrag 10, Stufe C).

| Rolle | Modell | Je | Verfahren | Gibt ab |
|---|---|---|---|---|
| Lösungs-Audit | Opus | Heft und Spur, dazu der Auftrag | **blind lösen** (Paket ohne Lösung) → erst dann vergleichen → je Lösungsfeld Herkunft, Anker, Stelle, Urteil | `belege.json` |
| Fakten-Audit | Opus, mit Netz | Einheit | Arbeitsliste aus `check-fakten --liste` **und** eigenes Lesen nach Aussagen ohne Zahl und Artikel; nur amtliche Primärquellen; Bauplan §10 wird nachgeprüft, nicht übernommen | `fakten.json` |
| Lösbarkeitsprobe | Sonnet | Produkt eines Lernenden-Gegenlesers | sieht nur Produkt, «Das geben Sie ab», Kriterien mit Stufen, Lösungsbild (und die Frage LF4); drei Befundarten | `probe.json` |

Die drei stehen als **Auftragsvorlagen** in der neuen Reference
`references/audits.md` (Platzhalter `<ordner>`, `<heft>`, `<spur>`, `<wurzel>`,
`<archiv>` — sie gelten auch für einen Altstand in einer Temp-Kopie). Das
frühere Lösungs-Audit (Sonnet, las die Lösung zuerst, gab Prosa ab,
`gegenleser.md` §4.2) gilt nicht mehr.

**Regeln, die dazukommen:**

1. **Die Audits beginnen nach dem ersten grünen Tor** und laufen neben den
   Gegenlesern. Das Tor läuft darum zweimal: im ersten Durchgang sind die
   einzigen zulässigen Fehler `ERR_BELEGE_FEHLT` und `ERR_FAKTEN_FEHLT`, im
   zweiten endet `check-all` «GRUEN» (`phase-9-tor.md` §1, `lauf.md` §4).
2. **Nach jeder Änderung einer Lösung** werden nur die Felder mit
   `ERR_AUDIT_VERALTET` neu auditiert (Paket mit `--nur-veraltet`); für Fakten
   entsprechend `ERR_FAKT_ZEILE_VERWAIST` und `ERR_FAKT_OHNE_ZEILE`
   (`lauf.md` §4.1, `audits.md` §2.5, §3.5).
3. **Die Lernenden-Gegenleser geben ihr Produkt als Datei ab** (ausserhalb des
   Repos); daran hängt die Lösbarkeitsprobe (`gegenleser.md` §4.1).
4. **Neue Tor-Reihenfolge** (`phase-9-tor.md` §1): Index · Marker `--check` ·
   Teildateien zusammenführen · `check-all` · Export · Messung · die fünf
   Beleg-Prüfungen mit `--protokoll` in den Laufordner (`check-zeiger` und
   `check-kohaerenz` dabei mit `--export`) · Bestand · Build · `git status`;
   nach dem Bericht `check-leck`. Die Handprüfungen §3 Nr. 2–5 entfallen (sie
   laufen in `check-kohaerenz`); von Hand bleiben Nr. 1, 6, 7, 8, 9. Die
   Nummern sind nicht neu vergeben, weil Skill und Berichte darauf verweisen.
5. **Die Gegenhör-Liste wird erzeugt** (`scripts/gegenhoeren.mjs`) — aus Karten
   und Feldnamen, ohne Anker; sie nennt je Karte, wie genau die Zeitmarken am
   Archivtext geprüft sind (nur Block, nicht prüfbar, Vermerk im Kopf).
6. **Die Wortliste «Fallüberlegung/Deutung»** steht in `sprache.md` §7.4 als
   Abschrift von `RE_FALLKENNZEICHEN`; massgebend bleibt das Skript.

**Zwei neue Skripte** (reines Node, ohne Netz; `--wurzel`):

| Skript | Tut |
|---|---|
| `scripts/audit-paket.mjs` | `--plan` (Pakete einer Einheit) · Blind-Paket · Vergleichs-Paket mit Gerüst der Teildatei (nur, wenn die Antworten-Datei des Auditors jede Aufgabe trägt) · Paket der Lösbarkeitsprobe · `--zusammenfuehren` (Teildateien → `belege.json`, `probe.json`, `fall.json`) · `--pruefen` (zusammenführen, `check-belege --streng`, nur die Felder des Pakets). Verweigert jede Ausgabe in dieses Repo, unter `--wurzel` und in jedes Git-Repo |
| `scripts/gegenhoeren.mjs` | Gegenhör-Liste als Markdown (Konsole oder `--out`) |

**Gemessen am 07.10.2026:**

- `gegenhoeren`: `2.2.1_ausgrenzung_analysieren` 4 Audio/Video, 26 Stellen mit
  Zeitmarke, 4 Text- und Bildquellen (zwei Karten nur auf den Block genau);
  `3.3.1_kaufvertrag_beurteilen` 2 Audio/Video, 18 Stellen, 6 Text- und
  Bildquellen. Kein Stück eines Lösungsfelds ab sechs Wörtern und kein Treffer
  von `check-leck` in den Listen.
- `audit-paket` an `3.3.1_kaufvertrag_beurteilen`: fünf Pakete decken die 137
  Lösungsfelder genau einmal (47 · 20 · 49 · 18 · 3). Die Blind-Pakete von
  Heft A enthalten von 142 Stücken der Lösungsfelder ab sechs Wörtern 2
  (ohne Medien) bzw. 1 (mit Medien) — beide stehen im Heft selbst (eine
  Seitenangabe, die auch der Auftrag über dem Raster nennt; eine Prüffrage,
  die auch die Produktbeschreibung nennt). Das Vergleichs-Paket derselben Spur
  enthält 43. Ein `--out` im Repo endet mit «VERWEIGERT», Exit 2.
- Ausgangswerte unverändert: `check-all` über die 16 «GRUEN», `check-namen`
  grün, `karten.mjs geaendert` grün, Bestand unverändert, Build Exit 0.

**Von mir entschieden, weil keine Vorgabe es deckte** (bitte bestätigen oder
ändern):

- **Teildatei je Schreiber.** `check-belege`, `check-zahlen` lesen je eine
  Datei; Auditoren und Executor arbeiten gleichzeitig. Jeder schreibt darum
  eine Teildatei (`belege.<heft>.<spur>.json`, `probe.<heft>.<spur>.json`,
  `fall.<A|B|auftrag>.json`), und `audit-paket.mjs --zusammenfuehren` baut die
  Datei. Je Feld gewinnt die Zeile mit heutigem Hash, dann die jüngere. Damit
  schreibt `fall.json` weiter der Executor des Hefts — als `fall.<A|B>.json`.
- **Fünf Lösungs-Audits je Einheit** (bei zwei Heften mit je zwei Spuren): vier
  Pakete Heft × Spur und eines für den Auftrag. Der Kern eines Hefts (LF1, LF2,
  Lösungsbild, Abschluss) liegt im Paket der ersten vorhandenen Spur. Mit fünf
  Lösbarkeitsproben, einem Fakten-Audit und sechs Gegenlesern sind es siebzehn
  Agenten je Lauf statt elf.
- **Blind wird erzwungen, soweit ein Skript das kann:** Das Vergleichs-Paket
  gibt es erst, wenn die Antworten-Datei jede Aufgabe trägt; es hält Hash und
  Zeit dieser Datei fest. Dass der Auditor die Einheit nicht selbst öffnet,
  bleibt eine Regel des Auftrags.
- **Was «blind» ausschliesst:** jedes Lösungsfeld, den Kurzbeschrieb der
  Quellenkarte (er kann die Lösung verraten), Kopf und Notizen der Archivdatei,
  Begleiter, KN, Prinzip. Das Blind-Paket trägt die ganzen Kapitel, die das
  Heft nennt — nicht nur die genannten Seiten —, damit eine falsche Seite
  auffallen kann.
- **Die Frage LF4 steht im Paket der Lösbarkeitsprobe** — der Auftrag nennt nur
  Produkt, Abgaben, Kriterien und Lösungsbild; ohne die Frage ist «LF4 lässt
  nur eine Antwort zu» nicht zu beurteilen.
- **Die Fakten-Tabelle im Bericht entfällt**, mit ihr `fakten-tabelle.md`.
  `fakten.json` ist die eine Fassung; der Bericht nennt die Zahlen je Urteil
  und jede Zeile, die nicht «belegt» heisst. Eine Tabelle von Hand daneben
  wäre eine zweite Fassung, die kein Skript prüft.
- **Mischfeld:** Trägt ein Feld eine belegte und eine abgeleitete Aussage, gilt
  das schwerste Urteil; die belegten Teile stehen in `weitere_belege`.
- **Was nicht nachgeführt ist:** Der Sweep (ein Gegenleser) prüft heute fast
  nur noch, was `check-all` und `check-kohaerenz` prüfen. Er ist geblieben,
  weil kein Beleg vorliegt, dass er nichts mehr findet.

**Offen für Pietro:**

1. **`ERR_ZEIGER_SCHRITT_OHNE_SEITE` wörtlich?** «Jeder Schritt-Hinweis nennt
   eine Seite» trifft im Bestand 127 von 240 Hinweisen. Bleibt die Regel
   wörtlich, ist das an jedem Entwurf ein Fehler in etwa jedem zweiten
   Schritt — oder gilt sie nur für Schritte, die auf eine andere Seite führen?
2. **Nicht harte Budgets am Entwurf.** Vier der sieben nachgetragenen Budgets
   (Lösungen S. 3 mit Medien, Kartentexte, Rezeptionskarte, Zahlentabelle) sind
   am Entwurf Warnungen. Sollen sie Fehler werden?
3. **Lösungs-Audit dauerhaft auf Opus?** Der Beweis zu Auftrag 10 misst Opus
   gegen Sonnet beim Blindlösen an denselben Feldern. Bis zu einem Entscheid
   nennt die Skill Opus.
4. **Erster Durchgang des Tors ohne Exit 0.** `check-all` endet vor den Audits
   «ROT» (zwei erwartete Fehler); der Orchestrator liest die Ausgabe. Ein
   Schalter dafür (etwa `--vor-audit`) wäre eine Änderung an `check-all` und
   lag ausserhalb dieser Stufe. → Erledigt in Stufe D: Schalter
   `--vor-audit`, entschieden vom Orchestrator des Auftrags 10.
5. **`check-all` kennt kein `--wurzel`.** Die fünf Beleg-Prüfungen und
   `audit-paket` laufen an einer Temp-Kopie, das Tor als Ganzes nicht.
6. **Siebzehn Agenten je Lauf.** Wenn das zu viel ist: Der Auftrag (drei
   Felder) kann ins Paket eines Hefts, und eine Lösbarkeitsprobe kann mehrere
   Produkte nacheinander bewerten.

**Geänderte Dateien (Stufe C):** neu `scripts/audit-paket.mjs`,
`scripts/gegenhoeren.mjs`, `references/audits.md`; geändert `SKILL.md` (§2, §4,
§5 Nr. 5, §7), `references/gegenleser.md` (§1, §2, §4.1, §4.2, §6), `lauf.md`
(§1, §2, §4, §4.1, §5, §6, §8, §11), `phase-9-tor.md` (§1, §3, §4),
`phase-10-abschluss.md` (Tabelle, §1 bis §7), `belege.md` (Kopf, §2, §5 bis §7,
§11, §12), `sprache.md` (§7.4), `ableitungsregeln.md` (§10, §10.3),
`phase-4-heft-kern.md`, `phase-5-spuren.md`, `phase-6-abschluss.md`,
`phase-7-set.md` (je der Absatz, wer `fall.json` schreibt),
`assets/bericht-template.md` (Kopf, Abschnitte 2, 6, 8, 9, 11), `package.json`
(zwei Zeilen). Keine Einheit, keine Karte, kein Renderer, keines der fünf
Prüfskripte, nicht `check-all`; im Archiv ist nichts angelegt.

**Rückgängig:** `git revert` des Commits der Stufe C. Die Skripte der Stufe B
laufen unverändert; die Skill beschreibt dann wieder das frühere Lösungs-Audit.

### E38, Stufe D — Keine Vererbung (07.10.2026)

**Was sich ändert:** Die vier Wege, auf denen sich ein Fehler vervielfacht hat
(Rückblick §5.4), bekommen je einen Riegel, den ein Skript hält; dazu der
Schalter für den ersten Durchgang des Tors (Auftrag 10, Stufe D).

| Weg | Riegel | Skript |
|---|---|---|
| Einheit aus Einheit | `<Quellenarchiv>/_pruefung/<ordner>/herkunft.json` `{abgeleitet_von, stand_commit}`; eigene `belege.json` und `fakten.json`; übernommene Zeile → Fehler; Vorlage nach `stand_commit` in einem Lösungs- oder Faktenfeld geändert → «neu zu prüfen» | `check-belege.mjs`, `check-fakten.mjs`, neu `lib/herkunft.mjs` |
| geteilte Karte | Kartenbelege `<Quellenarchiv>/_pruefung/_karten/<id>.json`: Text der Karte wie ein Lösungsfeld belegt, mit Hash — eine geänderte Karte macht ihre Belege ungültig | `karten.mjs belege [<id>]`; `karten.mjs geaendert` liest mit |
| Skelett, Skill | Die Vorlagen unter `assets/` und die wörtlichen Auftragsvorlagen laufen selbst durchs Tor (Zeile «Skelette»); Start-Riegel über `docs/cloud-run/OFFEN.md` | neu `check-skelette.mjs` |
| Fehler bleibt in den anderen Einheiten | Rückweg: Fehlerform in allen Einheiten und Karten suchen, bevor der Lauf endet; Ergebnis in Bericht und `OFFEN.md` | neu `gleiche-stelle.mjs <feldpfad> <muster>` |

**Regeln, die dazukommen:**

1. **`--vor-audit`** (`check-all`, durchgereicht an `check-belege` und
   `check-fakten`): Fehlt `belege.json` bzw. `fakten.json` noch, ist das
   `HINWEIS_AUDIT_STEHT_AUS` statt eines Fehlers; alles andere bleibt. Die
   Schlusszeile heisst dann «VOR AUDIT — keine Fehler, aber n Beleg-Datei(en)
   stehen aus», Exit 0 — nie «GRUEN». Erster Durchgang des Tors mit dem
   Schalter, zweiter ohne (`phase-9-tor.md` §1). **Damit ist Stufe C «Offen für
   Pietro» Nr. 4 entschieden — vom Orchestrator des Auftrags 10, nicht von
   Pietro.**
2. **Abgeleitete Einheit:** Der Orchestrator legt `herkunft.json` vor dem
   ersten Schreiben an. «Neu zu prüfen» endet, wenn er nach der Prüfung den
   neuen `stand_commit` einträgt (`belege.md` §8).
3. **Kartenbelege:** belegpflichtig sind `lesen` und `merk` einer
   Lehrmittelkarte (Anker im Kapitel `kap`, auf einer Seite aus `seiten`) und
   jede Aussage über die Welt in einer Methodenkarte. Eine fehlende Datei ist
   ein Hinweis, kein Fehler. Wer sie schreibt: das Karten-Audit, eine eigene
   Session (`audits.md` §6, `karten.md` §5).
4. **Rückweg:** Für jeden Punkt mit Kürzel S oder R läuft `gleiche-stelle`,
   bevor der Lauf endet; im Bericht (Abschnitt 10) stehen Feldpfad, Muster und
   Treffer je Einheit (`phase-9-tor.md` §5).
5. **Start-Riegel, genaue Form** (`lauf.md` §3 Zeile 9): Ein Lauf beginnt nicht,
   solange `OFFEN.md` eine Zeile führt mit `Art` = `S` oder `P`, `Stand`
   passend auf `^(offen|braucht Entscheid)\b` und dem Vermerk
   `[erzeugt Fehler]` (mit eckigen Klammern) in der Spalte «Punkt». Ebenso,
   wenn die Zeile «Skelette» rot ist. Die Liste und `offen.mjs` entstehen im
   letzten Auftrag der Reihe.
6. **Feste Angaben in Auftragsvorlagen:** Der Rollensatz der
   Lernenden-Gegenleser hat Platzhalter mit Herleitung (`<lehrgang>`,
   `<lehrjahr>`, `<alter>`, `<profil>` — `gegenleser.md` §4.1); `audits.md`
   nennt keinen Pfad dieses Rechners mehr (`<repo>`). `check-skelette` prüft
   die wörtlichen Auftragszeilen beider Dateien darauf.

**Gemessen am 07.10.2026:**

- **Ausgangswerte unverändert:** `check-all` über die 16 «GRUEN — keine
  Fehler.» (15.5 s; keine neue Warnung: Zeile «Skelette» ok, Kartenbelege
  0 Dateien), `check-namen` grün, `karten.mjs geaendert` grün, Bestand
  unverändert, Build Exit 0.
- **`check-skelette`:** 7 Vorlagen, 485 Feldpfade in fünf JSON-Skeletten (478
  in der Gold-Einheit bzw. den Quellenkarten, 7 nur im Datenvertrag —
  `gemeinsamer_auftrag.produkte…`, das Gold nicht führt), 216 Marker des
  Begleiter-Skeletts, 261 Zeilen Auftragsvorlage: **kein Befund**. Gegenprobe
  in einer Temp-Kopie: zehn eingebaute Verstösse lösen zehn verschiedene Codes
  aus (15 Befunde).
- **Herkunft** (Temp-Kopie, eigenes Archiv, Test-Belege ohne Quellentext):
  `3.1.1_konsum_verantworten_3j` als abgeleitet von
  `1.3.1_konsum_verantworten_v42`. Fünf Zeilen mit dem Hash der Vorlage bei
  anderem Text → 5 × `ERR_BELEG_KOPIERT` (ohne `herkunft.json`: 5 ×
  `ERR_AUDIT_VERALTET`). Mit `stand_commit` `bd80e89` (letzter Stand der
  Vorlage vor der Anpassung `ed55049`): `ERR_VORLAGE_GEAENDERT` — 13
  Lösungsfelder der Vorlage seither geändert (Commits `1902384`, `348fb55`),
  0 Faktenfelder; keines der 13 steht in 3.1.1 noch im alten Wortlaut.
  Unbekannter Commit → `HINWEIS_HERKUNFT_NICHT_PRUEFBAR`, Exit 2. Kopierte
  Faktenzeile → `ERR_FAKT_KOPIERT`.
- **Kartenbelege** (Temp-Kopie): zwei gültige Zeilen für `lm-17-3-3b-schema`
  → grün; falsche Seite → `KARTE_STELLE_FALSCH`; Karte nach dem Audit geändert
  → `KARTE_BELEGE_VERALTET` (Fehler in `belege`, Warnung in `geaendert`). Am
  Bestand: 42 Methodenkarten, keine belegt; 23 haben belegpflichtige Felder
  (21 Lehrmittelkarten, 2 eigene), 19 keine.
- **`--vor-audit`** (Temp-Einheit mit `status: "entwurf"`): `check-belege` und
  `check-fakten` enden ohne Schalter «ROT» (`ERR_BELEGE_FEHLT`,
  `ERR_FAKTEN_FEHLT`), mit Schalter Exit 0 mit je einem Hinweis; liegt
  `belege.json` vor, bleibt eine veraltete Zeile ein Fehler.
- **`gleiche-stelle`** an zwei Fehlerformen aus den Nachträgen: Karte
  `lm-1-3-rechtsfall` und Widerruf am Marktstand (Lauf `2026-10-04-331`) —
  Muster `Marktstand|Messestand`: 20 Treffer in 3 von 27 Einheiten (3.3.1: 7,
  4.1.1: 8, 4.2.1: 5), 1 in Karten. Skelett `set-template.json`, fester
  Wochenplan 4 × 3 Lektionen (Lauf `2026-10-04-421`) — Feld
  `wochenplan[*].lektionen`, Muster `^3$`: 64 Treffer, je 4 in allen 16
  v4.2-Einheiten.

**Von mir entschieden, weil keine Vorgabe es deckte** (bitte bestätigen oder
ändern):

- **Kopierter Beleg:** Verglichen wird der `hash` einer Belegzeile der
  Abgeleiteten, der nicht zum heutigen Text ihres Felds passt, mit den Hashes
  der Lösungsfelder der Vorlage — heute im Baum, am `stand_commit` und in der
  `belege.json` der Vorlage. Trägt die Abgeleitete in einem Feld wörtlich den
  Text der Vorlage, ist der Hash derselbe: Ob die Zeile neu auditiert oder
  abgeschrieben ist, sieht kein Skript.
- **Faktenfeld:** ein Textfeld von Heft, `set.json`, `kn.json` (der Begleiter
  als Ganzes), in dem `lib/aussagen.mjs` eine Aussage über die Welt findet;
  «geändert» heisst, die Aussagen des Felds sind nicht mehr dieselben. Eine
  Umformulierung ohne Zahl, Artikel oder Datum zählt nicht als Änderung eines
  Faktenfelds.
- **«Heute» ist der Baum, nicht `HEAD`:** Verglichen wird der Stand der
  Vorlage am Commit mit ihren Dateien im Arbeitsbaum (auch unter `--wurzel`).
- **Schwere:** wie in Stufe B — an einer gebundenen Einheit Warnungen, am
  Entwurf Fehler. Je geändertes Feld der Vorlage eine Zeile, davor eine mit
  den Zahlen.
- **Kartenbelege veraltet** ist in `karten.mjs geaendert` (Tor) eine Warnung,
  in `karten.mjs belege` ein Fehler. `geaendert` liest jede vorhandene Datei,
  unabhängig vom Vergleich mit `origin/main` — der Hash gilt gegen heute.
- **`check-skelette`, Felder:** Pfad gegen die Gold-Einheit und den
  Datenvertrag (dort auch relativ notierte Pfade); gegen `types.ts` nur der
  Feldname — die Datei wird statisch gelesen, ein Pfad lässt sich ohne
  Compiler nicht sicher auflösen. 31 Feldpfade der Skelette tragen einen Namen, der in
  `types.ts` nicht vorkommt; alle stehen im Datenvertrag («nur Gold») und sind kein
  Befund. Die Liste `HINGENOMMEN` im Skript ist leer.
- **`check-skelette` fehlt die Skill im Baum** (Exit 2): in `check-all` ein
  Hinweis, kein Fehler.
- **`gleiche-stelle`:** durchsucht jede JSON-Datei jeder Einheit (auch
  Herausforderung C und KI-Dateien), Zahlen als Text, den Begleiter je Absatz
  und einmal alle Karten; Exit 1 heisst «Treffer». Der Ausschnitt ist eigener
  Text der Einheit, höchstens acht Wörter.
- **Kürzel K** (Karte) ist im Bericht nicht eingeführt: Ein Kartenfehler steht
  dort weiter unter S; die Skill nennt K nur als Art der künftigen `OFFEN.md`.
- **«Fünf Schritte»** im Auftrag der Lernenden-Gegenleser heisst jetzt «jeder
  Schritt»; die Seitenzahlen 3, 4 und 6 bleiben — sie sind im Renderer fest.

**Offen für Pietro** (Fortsetzung der Liste aus Stufe C; dort ist Nr. 4
erledigt):

7. **`herkunft.json` für `3.1.1_konsum_verantworten_3j` eintragen?** Heute
   trägt keine Einheit eine. Vorschlag: `{"format": "bbw-hko/herkunft@1",
   "einheit": "3.1.1_konsum_verantworten_3j", "abgeleitet_von":
   "1.3.1_konsum_verantworten_v42", "stand_commit": "bd80e89"}` — der letzte
   Commit der Vorlage vor der Anpassung. Folge: an 3.1.1 (publiziert) 14
   Warnungen `ERR_VORLAGE_GEAENDERT`, bis die 13 Felder geprüft sind und der
   Commit nachgeführt ist.
8. **Karten-Audit des Bestands:** 23 Methodenkarten haben belegpflichtige
   Felder, keine ist belegt. Wann, und in welcher Reihenfolge (nach Zahl der
   Verbraucher)?
9. **Kürzel K im Bericht** — soll der Abschnitt «Offen» die Karte als eigene
   Art führen, wie die künftige `OFFEN.md`?
10. **Fester Wochenplan im Skelett** (`set-template.json`: 4 × 3 Lektionen,
    Bericht `2026-10-04-421`): steht in allen 16 Einheiten. `check-skelette`
    prüft keinen Festwert gegen den Datensatz; soll es?

**Geänderte Dateien (Stufe D):** neu `scripts/check-skelette.mjs`,
`scripts/gleiche-stelle.mjs`, `scripts/lib/herkunft.mjs`; geändert
`scripts/check-belege.mjs` (`--vor-audit`, Herkunft), `scripts/check-fakten.mjs`
(`--vor-audit`, kopierte Zeile), `scripts/check-all.mjs` (Zeile «Skelette»,
`--vor-audit`, Schlusszeile «VOR AUDIT»), `scripts/karten.mjs` (`belege`,
Kartenbelege in `geaendert`), `package.json` (zwei Zeilen); Skill: `SKILL.md`
(§4), `references/phase-9-tor.md` (§1, §4, §5 neu), `lauf.md` (§3, §4, §10,
§11), `auto-modus.md` (§5), `belege.md` (Kopf, §8, §9, §11, §13 neu),
`karten.md` (§1, §5 neu, §6), `audits.md` (§1.1, §1.3, §5, §6 neu),
`gegenleser.md` (§4.1, §5), `phase-10-abschluss.md` (§1),
`assets/bericht-template.md` (Abschnitte 2 und 10). Kein Skelett ist geändert
(kein Befund). Keine Einheit, keine Karte, kein Renderer; im Archiv ist nichts
angelegt.

**Rückgängig:** `git revert` des Commits der Stufe D. Das Tor läuft dann wie
nach Stufe C (erster Durchgang wieder «ROT» mit zwei erwarteten Fehlern).

## E39 — KI-Toolbox für v4.2-Einheiten: `hko-ki-komplement` liest das neue Format (Pietro, 07.10.2026)

**Ausgangslage:** E29 hatte die KI-Toolbox für v4.2 zurückgestellt. Die Skill
`hko-ki-komplement` kannte nur das 3er-Set (A/B/C) und EBA; auf einer
v4.2-Einheit hätte sie eine dritte Herausforderung verlangt, von «Austausch &
Transfer» gesprochen und weder den Fall-Ausschluss des KN noch die Spuren
gekannt. Keine der 16 v4.2-Einheiten trägt eine Toolbox.

**Entscheid Pietro:** Die Skill wird auf v4.2 nachgeführt.

**Umsetzung — nur die Skill, nur die Leseseite:**

- **Der Output-Vertrag bleibt.** `ki.json`, `lernprompt.json`,
  `lernbegleiter.json` und `ki-liesmich.md` haben in jedem Format dieselbe Form.
  Kein Renderer, kein Typ, kein Skript ist angefasst: `loadEinheit` und die
  Arbeitsansicht führen die Toolbox schon heute unabhängig vom Format (Gruppe
  «KI-Toolbox», ZIP).
- **Format-Erkennung** in Phase 0 an `herausforderung_A.template` und
  `prinzip.lehrgang` (`references/input-adapter.md` §0).
- **v4.2-Regeln** (`SKILL.md`): nur der Kern der Hefte, nichts aus `spuren.*`
  und aus keinem Lösungsfeld · kein Begriff aus
  `fall_ausschluss_hefte_und_auftrag` in einer der vier Dateien · Übungsfälle
  disjunkt von Heft A, Heft B, Auftrag und KN · Wörter der Hefte («Heft A/B»,
  «gemeinsamer Auftrag», «Spannungsfeld», «0 bis 3 Punkte») · Fachbegriffe aus
  `set.glossar` · Kriterien im Wortlaut des KN. Drei neue Checks der Skill
  (`V42_SPUR`, `V42_FALL`, `V42_WORT`) und das Tor `check-all` über den Ordner.
- **Sichtbarkeit setzt die Skill nicht.** Bei einer publizierten Einheit meldet
  sie, dass `"entwurf_komponenten": ["ki-fluency"]` die Toolbox zurückhält.

**Offen:** (1) `V42_FALL` prüft kein Skript — `check-v42` wendet den
Fall-Ausschluss nur auf Hefte, Auftrag, Glossar und Quellenkarten an. (2) Es gibt
keine v4.2-Gold-Toolbox; die Skill ist an keiner v4.2-Einheit gelaufen. (3) Das
Niveau der Toolbox (Rückmeldung der Lehrpersonen: zu hoch) ist mit diesem
Entscheid nicht berührt.

**Rückgängig:** `git revert` des Commits; betroffen sind nur
`.claude/skills/hko-ki-komplement/`, eine Zeile in `CLAUDE.md` und dieser Eintrag.

## E40 — KI-Toolbox: kleine Fassung als Vorgabe (Basis/Plus) und B1-Sprach-Gate für EFZ (Pietro, 07.10.2026)

**Ausgangslage:** Rückmeldung mehrerer Lehrpersonen an Pietro: Das Niveau der
KI-Toolbox ist für die Lernenden zu hoch. Pietro: Es liegt an der Wortwahl und an
zu viel Inhalt je Dokument. Befund an der Gold-Toolbox
`1.1.1_konflikt_kommunizieren`: (1) EBA hat ein A2-Gate, EFZ keines — Aufträge mit
über hundert Wörtern in einem Absatz, Wörter wie «Retrieval», «Verifikation»,
«Stacking»; (2) jeder Auftrag verlangt Inhalt bearbeiten **und** die KI beurteilen
(K4–K5, die Hefte zielen auf K2–K4); (3) vier Techniken mit je sechs Feldern, fünf
Karten mit je zwei Prompts; (4) Prompts müssen aus einem Baukasten selbst gebaut
werden. Der Liesmich bat die Lehrperson, die Word-Datei selbst zu kürzen.

**Entscheid Pietro:** Alle vier Vorschläge umsetzen.

**Umsetzung — nur die Skill `hko-ki-komplement`, für alle drei Formate:**

1. **B1-Sprach-Gate für EFZ** (`references/b1-language-rules.md`), gebaut wie das
   A2-Gate: längster Satz 22 Wörter, ein Auftrag je Satz, ein Schritt ein Satz,
   Fachbegriffe nur mit Deckung (v4.2: `set.glossar`), Sperrwörter der Didaktik.
2. **Fertige Prompts** mit höchstens einer Lücke; jeder endet mit einer
   **Sprachzeile**, die der KI kurze, einfache Antworten und eine Frage aufs Mal
   vorschreibt.
3. **Andocken:** Die Basis arbeitet nur mit Begriffen, eigenem Produkt und
   Kriterien der Einheit — kein neuer Fall, kein neues Kriterium.
4. **Basis ist die Vorgabe, Plus liegt daneben** (`references/basis-plus.md`):
   `ki_1` = Basis-Auftrag aus `ai_lernassistent` / `ai_entscheidungscoach`
   (3 Schritte, 2 fertige Prompts, 2 Reflexionsfragen), `ki_2` = Plus-Auftrag;
   Lernprompt Seiten 1–2 Basis, 3–4 Plus; Lernbegleiter Seite 1 und KN-Seite
   Basis, Seite 2 Plus. Neue Checks BP1–BP6. Der Liesmich nennt die Seiten, statt
   zum Kürzen aufzufordern.

**Kein Renderer, kein Typ, kein Skript angefasst.** Die drei Doc-Komponenten
zeichnen jedes Feld nur, wenn es da ist, und setzen die Seiten aus der Reihenfolge
der Daten; Basis und Plus entstehen allein aus Reihenfolge und Weglassen. Der
Output-Vertrag bleibt.

**Nicht erreicht:** «Eine Seite je Dokument». Ein KI-Auftrag hat im Renderer fest
drei Seiten (jetzt mit wenig Text und viel Schreibfläche), die Basis des
Lernprompts zwei, die des Lernbegleiters zwei (Seite 1 und KN-Seite, dazwischen
die Plus-Seite). Weniger braucht eine Änderung an den Doc-Komponenten.

**Offen:** (1) Kein Skript prüft B1 und BP1–BP6 — es sind Scans der Skill.
(2) Einige feste Überschriften des Renderers tragen noch Fachwörter
(«Gütekriterien», «Rubrik-Fokus», «KN-Typen», «Prompts stapeln»), und der Kopf des
KI-Auftrags zeigt den rohen Muster-Schlüssel. (3) Die zehn Toolboxen der
Bestandseinheiten sind unverändert in der alten Fassung. (4) Die Skill ist im
neuen Zuschnitt an keiner Einheit gelaufen; die Wirkung bei Lernenden ist nicht
erprobt.

**Rückgängig:** `git revert` des Commits; betroffen sind nur
`.claude/skills/hko-ki-komplement/` und dieser Eintrag.

## E41 — KI-Toolbox: Pilot, Renderer ohne Fachwörter und mit weniger Leerraum, `check-ki-toolbox.mjs` (Pietro, 07.10.2026)

**Pilot.** Die Skill ist im neuen Zuschnitt (E39, E40) an
`1.3.1_konsum_verantworten_v42` gelaufen: `ki.json`, `lernprompt.json`,
`lernbegleiter.json`, `ki-liesmich.md`. Basis-Auftrag `ai_entscheidungscoach`,
Plus-Auftrag `ai_gegenpositionen`. Befund an den gerenderten Seiten: Der Text war
klein, die Seiten nicht — jede Basis-Seite halb leer, und das Lauteste auf dem
Blatt waren Fachwörter des Renderers.

**Auftrag Pietro:** Renderer nachziehen, Leerraum beheben, Prüfskript schreiben.

**Renderer** (`src/components/einheiten/docs/Doc{Ki,Lernprompt,Lernbegleiter}.tsx`,
die drei Builder in `docx-builder.ts`, neu `src/lib/einheiten/ki-toolbox.ts`):

- **Wörter:** «KI-Toolbox · formativ» → «KI-Toolbox · Auftrag»; das Etikett mit
  dem rohen Muster-Schlüssel entfällt; «Lehrplan-Bezug / Schlüsselkompetenzen
  dieser Einheit» → «Das üben Sie» (Namen ohne SK-Code); Leitfragen ohne
  «Offen/Kritisch/…»; «Prompt-Strategie» → «Prompts»; «Gütekriterien» →
  «Kontrolle»; «R1» → «1.»; «Prompts stapeln» → «Nachfragen — Zwei Prompts
  nacheinander» (Technik-Schlüssel werden als Titel gedruckt); «KN-Typen» →
  «Kompetenznachweis»; «Rubrik-Fokus / im KN» → «Kriterien / im
  Kompetenznachweis»; «SuK», «Ges» ausgeschrieben; «Fairness & Integrität» →
  «Fairness»; ein Prompt ohne schwierigere Variante heisst «Fertiger Prompt».
- **Prompts im KI-Auftrag** stehen in einem Kasten wie in den zwei anderen
  Dokumenten, wenn die Zeile mit einem zitierten Prompt endet.
- **Seiten aus den Daten:** Basis-Auftrag zwei statt drei Seiten; Basis-Techniken
  und ihr «Nachfragen» auf einer Seite; im Lernbegleiter folgt die KN-Seite auf
  Seite 1, die übrigen Karten stehen als «Plus» am Schluss. Erkannt wird die
  Basis-Form daran, was fehlt — kein neues Datenfeld.
- **Schreibfelder nehmen den freien Platz auf** (`Schreibfeld grow`; die bisherige
  Höhe ist Mindesthöhe).

**Wirkung auf den Bestand.** Die zehn Toolboxen in voller Dichte erfüllen keine
der Basis-Bedingungen: gleiche Seitenzahl, gleiche Reihenfolge. Geändert sind bei
ihnen die Überschriften oben, der Prompt-Kasten und die Höhe der Schreibfelder,
wo eine Seite Platz hatte. Gemessen an `1.1.1_konflikt_kommunizieren`
(13 Seiten) und am Piloten (11 Seiten) mit `messen-v42.mjs`: kein Überlauf.
Die Word-Dateien beider Einheiten werden erzeugt; ihr Satzbild ist nicht
angesehen.

**Prüfskript** `scripts/check-ki-toolbox.mjs <ordner>`: Form der drei Dateien,
BP1–BP4 und BP6, die gezählten B1-Regeln (Satzlänge, ein Auftrag je Teilsatz,
Schritt, Sperrwörter), bei v4.2 Fall-Ausschluss, Spur-Begriffe und Wörter, der
Liesmich (Callouts, Titel, Karten). Geprüft wird nur eine Toolbox mit
`ki.json › version` ab 2.0.0; der Bestand wird genannt und übersprungen. Nicht
in `check-all` eingehängt.

**Offen:** (1) Der Pilot liegt in einer **publizierten** Einheit; Index nicht
gebaut, nichts committet — vor dem Index-Bau entscheidet Pietro über
`entwurf_komponenten`. (2) Leerraum bleibt im Lernbegleiter (Seite 1 und KN-Seite)
und auf der ersten Plus-Seite des Lernprompts; Vorschläge dazu liegen bei Pietro.
(3) Das Skript prüft weder die Deckung von Fachbegriffen noch A2 bei EBA.

**Rückgängig:** `git revert` des Commits; die vier Pilot-Dateien löschen.

## E42 — KI-Toolbox: KN-Formen ohne Fachnamen, drei Zusätze gegen den Leerraum, alles am Dateistand 2.x (Pietro, 07.10.2026)

**1. Namen der KN-Formen (Pietro).** «Mini Case schriftlich» stand in einer
Reflexionsfrage des Plus-Auftrags und als Kartentitel im Lernbegleiter. Es ist
ein Begriff der Lehrperson. Neu: «Mini Case», «Werkschau» und
«Transfer-Reflexion» stehen in keinem Feld, das Lernende lesen (eigener Abschnitt
in `SKILL.md`, Sperrwörter in `b1-language-rules.md`, Check `KN_NAME`,
`check-ki-toolbox.mjs`). `kn_typ_tracks[].label` bleibt wörtlich wie in `kn.json`;
der Renderer druckt «Fachgespräch» · «Schriftliche Aufgabe zu einem neuen Fall» ·
«Eigene Arbeiten zeigen und erklären» (`knTypFuerLernende`). «Fachgespräch»
bleibt — von mir entschieden, Pietro hat nur den Mini Case genannt.

**2. Drei Zusätze (Pietro: Ideen 1, 2, 3), gebaut an `1.3.1_konsum_verantworten_v42`:**

- **Notizfelder** unter jedem Prompt der zwei Basis-Karten («Das hat die KI
  gesagt · Das stimmt · Das stimmt nicht») und am Schluss der KN-Seite («Mein
  Übungsfall · Das konnte ich · Das übe ich noch»). Kein Datenfeld.
- **«Meine Begriffe — Kann ich das erklären?»**: neues Feld
  `lernbegleiter.begriffe[]`, bei v4.2 alle Glossarbegriffe ohne `spur`.
- **Beispiel-Verlauf** auf Seite 1 des Lernprompts: neues Feld
  `lernprompt.beispiel_dialog` (`frage`, `antwort`, `pruefung`). Die Antwort der
  KI trägt genau einen prüfbaren Fehler, damit die Lernenden einmal sehen, wie
  Prüfen aussieht.

**3. Andere Einheiten bleiben, wie sie sind (Pietro).** Umbruch der Basis-Form
(E41) und alle Zusätze hängen jetzt am Dateistand: `istNeueFassung` verlangt
`version` ab 2.x. Die zehn Toolboxen mit 1.x sind in keiner Datei angefasst und
behalten Seitenfolge und Inhalt; sie werden neu erzeugt, wenn die Skill fertig
ist. Für sie bleiben aus E41 die geänderten Überschriften und aus Punkt 1 die
Kartentitel im Klartext.

**Berichtigung zu E41.** Dort steht, auch der Bestand erhalte den Prompt-Kasten
und wachsende Schreibfelder. Die Messung aller zehn Bestands-Toolboxen zeigte in
`5.4.2_internationale_entscheide_wirken_4j` dadurch zwei neue Überläufe (Seite 2
beider KI-Aufträge). Kasten und wachsende Felder gelten darum ebenfalls nur ab
Dateistand 2.x. Nachgemessen: Der Bestand hat keinen Überlauf, den der
eingecheckte Renderer nicht auch hat. **Vorbestehend** und nicht behoben: je eine
überlaufende Seite 1 im Lernprompt von `5.4.2_…` (54 px) und von
`1.1.1_ausbildung_erfassen_zeigen` (6 px) sowie Seite 1 des Lernbegleiters
derselben Einheit (17 px).

**Gemessen:** Pilot 11 Seiten ohne Überlauf; Seite 1 des Lernbegleiters hat noch
rund 11 mm Reserve und ist damit die engste Seite. Check BP7 im Skript.

**Offen:** Leerraum bleibt auf der ersten Plus-Seite des Lernprompts und auf der
Plus-Seite des Lernbegleiters. Der Pilot liegt weiter in einer publizierten
Einheit, uncommittet.

**Rückgängig:** `git revert` des Commits; die zwei Felder aus den Pilot-Dateien
entfernen.

## E43 — Präsentation: je Spur ein Knopf, Audio und Video spielen im Deck (Pietro, 07.10.2026)

**Anlass:** In der Präsentation von `1.3.1_konsum_verantworten_v42` schienen die
Lösungen zu LF3 der Spur mit Medien zu fehlen. Daten und Deck waren vollständig;
der eine Knopf «Präsentation» öffnete die Spur, auf der die Vorschau gerade
stand (zuerst «ohne Medien», `set.spur: "wahl"`), ohne sie zu nennen.

**1. Je Spur ein Knopf (ergänzt E29).** Hat eine v4.2-Einheit zwei Spuren, zeigt
die Arbeitsansicht «Präsentation · Ohne Medien» und «Präsentation · Mit Medien»,
je mit eigenem Zusatz «mit Lösungen». Die Titelfolie sagt, in welcher Spur
Quelle, LF3, LF4 und ihre Lösungen stehen, und verlinkt die andere Fassung — auf
der Plattform `?spur=…`, im ZIP die Nachbardatei. Im Beamer-Fenster ist die
Zeile ausgeblendet. Es bleibt bei **einer Fassung je Spur**; ein Deck mit beiden
Spuren ist nicht gebaut. Einheiten mit einer Spur und 3er-Sets behalten den
einen Knopf.

**2. Audio und Video spielen im Deck (dehnt E28 von der QR-Seite auf die
Präsentation aus).** Auf der Folie «Quelle» und auf jeder Karte der Folie
«Vertiefung» steht bei SRF-Beiträgen mit URN «▶ Video/Audio hier abspielen». Der
Player von SRF öffnet als Überlagerung über der Folie, Start bei
`verortung.von`; «Bei SRF öffnen ↗» bleibt als Ausweg. Artikel, Grafiken,
Webseiten und Rechtstexte bekommen «Quelle öffnen ↗» (neuer Tab). Die
Ersatzquelle hat einen eigenen, leiseren Knopf. Geladen wird erst beim Klick;
Esc, «Schliessen», ein Klick neben den Player oder ein Folienwechsel räumen ihn
ab. Solange er offen ist, blättert keine Taste. Das Beamer-Fenster öffnet und
schliesst mit; gestartet wird dort, wo das Bild laufen soll.

**Kein neues Datenfeld.** Die Regel, was eingebettet wird, steht einmal in
`src/lib/einheiten/quelle-embed.ts` und gilt für QR-Seite und Deck
(`typ`, `urn` bzw. `url`, `verortung.von`).

**Abweichung von E29:** Die Überlagerung liegt in der gemeinsamen Shell
(`renderStandaloneDeckHtml`). Das HTML der Präsentation alter Einheiten ist
darum nicht mehr zeichengleich — es trägt Markup, CSS und Skript der
Überlagerung, aber keinen Knopf, der sie öffnet.

**Geprüft (lokal, Decks direkt aus den Daten gebaut):** `1.3.1_konsum_verantworten_v42`
beide Spuren, `2.2.1_meinungsfreiheit_reflektieren` (Video als Pflichtquelle mit
Ersatz): Knöpfe innerhalb der Folie, Player lädt, bleibt 16:9 über der
Steuerleiste, Esc räumt ab, Beamer-Fenster folgt. QR-Seite von 1.3.1 mit
denselben drei Player-Adressen wie zuvor.

**Nicht geprüft:** die angemeldeten Routen (`/einheiten/…/deck`, Arbeitsansicht —
die zwei Knöpfe nur als Attrappe mit dem echten Stylesheet); das Deck aus dem
ZIP per Doppelklick (`file://`, ob der Player von SRF dort lädt); Wiedergabe mit
Ton; Produktions-Domain und Schulnetz.

**Rückgängig:** `git revert` des Commits.

## E44 — KI-Toolbox: 14 Einheiten des 1. Lehrjahrs im Stand 2.0.0, Skill nachgeschärft, live ohne Entwurfs-Schranke (Pietro, 07.10.2026)

**Anlass.** Lauf `docs/cloud-run/prompts/ki-toolbox-lehrjahr-1.md`: Die Skill
`hko-ki-komplement` sollte die Toolbox für alle Einheiten des 1. Lehrjahrs
schreiben. Nach Pilot und zwei Sonden zeigten sich dieselben Mängel in allen drei
(Bericht §4, M1–M15).

**Entschieden.**

1. **Die Skill wird angepasst, nicht die Einheiten von Hand.** Was geändert wurde,
   steht vollständig im Bericht §4b (M1–M15, N1–N13, H1–H14) — u. a. Aufbau des
   Basis-Auftrags (Prompt 1 stellt drei Fragen, Prompt 2 zeigt auf die schwächste
   Antwort), Grundsatz «Die KI kennt die Einheit nicht», feste Sprachzeile, feste
   Technik-Titel, KN-Brücke nur mit dem, was jede KN-Form verlangt, «ohne KI» nur,
   wenn `kn.json` es für jede Form sagt, Richtwerte für die engen Seiten.
2. **Modelle.** Opus erzeugt; Sonnet liest gegen (auch die erste Lesung), kürzt und
   korrigiert.
3. **Sperrwort-Ausnahme nur für die Einheit über KI.** `check-ki-toolbox.mjs`
   lässt «Halluzination» in `1.2.2_ki_kompetenznachweis_vorbereiten` zu
   (`SPERRWORT_AUSNAHMEN`). «Absender», «Stufe», «Ich-Form» bleiben gesperrt und
   werden in den Toolboxen umschrieben.
4. **Sichtbarkeit.** Kein `entwurf_komponenten` — die Toolbox der zwölf
   publizierten Einheiten und des Pilots geht mit diesem Stand live. Bei
   `1.1.1_konflikt_kommunizieren`, `1.1.1_rechte_verstehen_nutzen` und
   `1.2.2_ki_kompetenznachweis_vorbereiten` ersetzt sie die Fassung 1.x.
5. **Nicht behoben, bewusst:** der KN-Fall in der Musterlösung von
   `1.1.1_rechte_verstehen_nutzen › herausforderung_C.json` — die 3er-Sets werden
   später neu erzeugt.

**Stand.** 2.0.0 tragen 15 Einheiten (Pilot + 14). 1.x tragen noch
`1.1.1_lehrvertrag_orientieren`, `1.1.2_unterlagen_ordnen`,
`1.3.1_konsum_verantworten` (archiviert), `3.2.1_ernaehrung_nachhaltig_gestalten`,
`3.2.1_wahre_kosten`, `5.4.2_internationale_entscheide_wirken_4j`. Ohne Toolbox:
`3.2.1_konsumfolgen_beurteilen`, `3.3.1_kaufvertrag_beurteilen`. Offen sind
`3.2.1_konsumfolgen_beurteilen`, `3.2.1_wahre_kosten`, `3.3.1_kaufvertrag_beurteilen`
(Prompt: `docs/cloud-run/prompts/ki-toolbox-lehrjahr-1-rest.md`) und die
Überarbeitung des Pilots (Gegenleser «zurück», Bericht §3.1).

**Geprüft.** Je Einheit `check-ki-toolbox` GRUEN, Export 2 · 3 · 3 · 3 Seiten,
`messen-v42` ohne Überlauf, bei v4.2 `check-all` ohne Treffer in den vier Dateien;
Gegenleser am Schluss bei allen 14 «in Ordnung». Lokaler Produktions-Build
(`npm run build`) läuft durch.

**Nicht geprüft:** die angemeldeten Routen im Browser (KI-Tab der Arbeitsansicht,
ZIP mit den Word-Dateien der Toolbox).

**Bericht:** `docs/cloud-run/laeufe/2026-10-07-ki-toolbox-lehrjahr-1/BERICHT.md`
(Reststellen je Einheit in §3).

**Rückgängig:** `git revert` des Commits; einzelne Toolbox verbergen mit
`"entwurf_komponenten": ["ki-fluency"]` in `set.json` und Index-Bau.

### E44, Nachtrag — Technik-Titel im Baukasten, Basis-Muster fest (Pietro, 07.10.2026)

Die drei Setzungen der Skill aus dem Bericht §4b sind bestätigt; zwei davon haben eine Folge.

1. **Zeitpunkt:** bleibt. `ki.timing` ist der späteste Zeitpunkt und wird nicht gedruckt; der
   Liesmich setzt den Basis-Auftrag «sobald die Hefte fertig sind».
2. **Technik-Titel:** bleiben fest. Dazu trägt die vierte Zeile des Baukastens im Lernprompt
   jetzt dasselbe Wort wie die `prompt_vorlage` desselben Blatts: «Form der Antwort», wenn die
   Vorlage so heisst, sonst «Format» (`baukastenFormatLabel` in `src/lib/einheiten/ki-toolbox.ts`;
   `DocLernprompt.tsx`, `docx-builder.ts`). 13 Toolboxen drucken damit «Form der Antwort»;
   der Pilot, `1.2.2_ki_kompetenznachweis_vorbereiten` (eigene Formel) und der Bestand 1.x
   behalten «Format». Kein neues Datenfeld.
3. **Basis-Muster fest.** `ki_1` ist `ai_lernassistent`; `ai_entscheidungscoach` nur, wenn ein
   Handlungsprodukt wörtlich ein Entscheid ist (Probe in `ki-scoring.md`). Punkte gibt es nur
   noch für die fünf Plus-Muster. «schriftlich-formell» (+30 für `ai_redaktion`) ist eine Liste
   mit Probe (Empfänger **und** feste Form); die Aufgaben des KN zählen nicht mit.

**Folge für den Pilot:** `1.3.1_konsum_verantworten_v42` trägt als Basis `ai_entscheidungscoach`.
Nach der neuen Probe ist keines seiner Handlungsprodukte ein Entscheid («Meine
Bedürfnis-Landkarte», «Mein Budget, meine Regeln, mein Budgetgespräch») — bei der Überarbeitung
fällt er auf `ai_lernassistent`, wie seine Schwester `3.1.1_konsum_verantworten_3j`. Die 14
Einheiten des Laufs ändern sich nicht (alle `ai_lernassistent`). An den drei Stellen, an denen
die Plus-Wahl an «schriftlich-formell» oder am KN hing (`2.1.1`, `2.4.1`, `1.2.1`), entscheidet
die Liste wie die Erzeuger; neu durchgerechnet ist das Scoring der 14 nicht.

**Geprüft:** alle 15 Toolboxen neu exportiert und gemessen, kein Überlauf (Lernprompt S. 2 von
`2.2.1_ausgrenzung_analysieren` hat noch 2.9 px Reserve, vorher 23.2). `tsc` meldet in den drei
geänderten Dateien nichts. **Nicht geprüft:** das Word-Dokument des Lernprompts (nur der Code
gelesen), die angemeldeten Routen.

**Rückgängig:** `baukastenFormatLabel` gibt wieder fest «Format» zurück; die Regeln der Skill
über `git revert`.

## E45 — KI-Toolbox: 1. Lehrjahr vollständig, «Dimension» und «graue Energie» freigegeben (Pietro, 08.10.2026)

Die letzten drei Einheiten des 1. Lehrjahrs tragen die Toolbox 2.0.0:
`3.2.1_konsumfolgen_beurteilen`, `3.3.1_kaufvertrag_beurteilen`, `3.2.1_wahre_kosten` (Entwurf;
ersetzt 1.0.0). Lauf und Reststellen: `docs/cloud-run/laeufe/2026-10-08-ki-toolbox-lehrjahr-1-rest/BERICHT.md`.
Vier Entscheide nach dem Bericht:

1. **Sperrwörter.** `scripts/check-ki-toolbox.mjs` lässt «Dimension» in
   `3.2.1_konsumfolgen_beurteilen` zu (`SPERRWORT_AUSNAHMEN`) — das Glossar führt «ökologische /
   ökonomische / soziale Dimension» als Kernbegriffe von Heft A. Und `nurSpur` nimmt einen
   Begriff nicht mehr, den das Glossar auch ohne `spur` führt («graue Energie»: Heft A ohne,
   Heft B `mit_medien`) — das war ein Fehler des Skripts. Die Karte «Abfragen lassen» der Einheit
   fragt seither drei Begriffe aus Heft A ab (Nachhaltigkeit, ökologische Dimension, graue
   Energie) und drei aus Heft B. `3.2.1_wahre_kosten` («drei Dimensionen der Nachhaltigkeit»)
   hat keine Ausnahme bekommen.
2. **Basis-Muster.** `ai_entscheidungscoach` gilt in `3.3.1_kaufvertrag_beurteilen` und
   `3.2.1_wahre_kosten`: Ein Handlungsprodukt, das wörtlich einen Entscheid als Abgabe verlangt
   (Prüfbericht mit Entscheid; Preisschild mit gesprochener Kaufbegründung), besteht die Probe
   aus `ki-scoring.md`.
3. **Zwei Regeln in der Skill** (`basis-plus.md` §5): `so_uebst_du` verspricht nur, was ein
   Übungsfall-Prompt der KN-Seite wirklich bestellt, und sagt nie «am Übungsfall unten»; der
   `uebungsfokus` sagt nicht «mündlich».
4. **Sichtbarkeit.** Wie E44: kein `entwurf_komponenten`; Index gebaut und deployt.

**Rückgängig:** die zwei Zeilen im Skript und die Sätze in `basis-plus.md` /
`b1-language-rules.md` §4 über `git revert`.
