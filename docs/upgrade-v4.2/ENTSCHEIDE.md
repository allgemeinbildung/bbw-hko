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
