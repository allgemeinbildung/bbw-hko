# EBA-Profil v4.2 — verbindlich für EBA_2J

Stand 03.11.2026. Ersetzt die entsprechenden EFZ-Regeln aller Phasen,
Audits, des Datenvertrags und der allgemeinen Templates. Bauplan-Stopp,
Produktionsablauf, Entwurf und Freigabeschritt bleiben. Grundlagen: E46/E47,
`docs/eba/aufnahme-2026-10-23_eba-gold-punkte.md`, aktuelle Gold-Daten und
`src/lib/einheiten/v42-profil.ts`. Historische Zwischenstände der Punkte-Liste
nicht als aktuelle Regel lesen; Seitenfolge folgt `worte().pruefSeite`.

## 1. Start und Bauplan (Phasen 0–3)

- Überall `EBA_2J`; nur `public/nrlp_2j.json` für Kompetenz, Lebensbezug,
  Lehrjahr, SK und Modi. Passendes offizielles EBA-Umsetzungsbeispiel lesen,
  soweit vorhanden; Problemkern bewahren.
- Kein Lehrmittel voraussetzen: Crosswalk, Kapiteldatei-Pflicht und Recherche
  von Lehrmittelquellen entfallen. Im Bauplan §2 je Leitfrage Wissensbedarf und
  geplante Info-Karte nennen. Rechts-/Sachaussagen in §10 weiterhin an aktuelle
  amtliche Primärquellen binden, mit URL und Abrufdatum.
- Neutrale Persona: `Lernende/r EBA, N. Lehrjahr`, `eigener Lehrbetrieb`,
  `eigener Wohnort`; keine Berufs-/Orts-Pools oder Abteilungsquote.
- A/B entwickeln das Prinzip; unterschiedliche Trade-offs sind zulässig.
  Produkte/Modi aus Kompetenz und Prinzip, niemals Inhalte der Gold-Einheit
  kopieren. Normale neue Ordnernamen ohne Gold-Suffix `_v42`.
- Drei Leitfragen, Bloom-Zielprofil LF1 K2 / LF2 K3 / LF3 K3. Pol-Typen und
  Kriterienverteilung entsprechend ableiten; keine vierte Pflichtfrage.
- Spur `ohne_medien` immer (Dossier), `set.spur: "ohne_medien"`. **Zusätzlich
  `mit_medien` genau dann, wenn eine Kompetenz des Lebensbezugs audiovisuelle
  Rezeption verlangt** (Sprachmodus «Rezeption audiovisuell», SM2; Entscheid Pietro
  03.11.2026) — dann `set.spur: "wahl"`, die Lehrperson wählt. Keine Ersetzung des
  Videos durch das Dossier, wenn ein passendes Video gefunden wird. Regeln siehe §2a.
- KN vor Heften: zwei SuK-/zwei Ges-Kriterien mit je vier einfachen vollständigen
  Stufensätzen. Kurzgespräch primär: 5–10 Minuten plus etwa 15 Minuten Vorbereitung;
  schriftliche/Werkschau-Alternativen geführt. Übungen bereiten Prüfungsform vor.

## 2. Heft-Kern und Spur (Phasen 4–5)

Vorlage `assets/eba-herausforderung-template.json`, Template `heft_8page_v42`.
Kern `leitfragen` enthält genau Nr. 1; `spuren.ohne_medien.leitfragen` enthält
Nr. 2 (`antwortform: "raster"`) und Nr. 3 (`pol_typ`). `mit_medien` nur nach §2a;
dann dieselbe Struktur (Nr. 2 Raster zur Pflichtquelle, Nr. 3 mit Denkhilfe).
Raster/Abwägung über ihre Rolle finden, nicht pauschal LF3/LF4 nennen.

| Seite | EBA-Inhalt und Daten |
|---|---|
| 1 | Situation 350–700 Zeichen; Renderer setzt «So starten Sie» nach oben; drei `wochen_plan`-Einträge Teil 1/2/3 |
| 2 | Leitfrage 1, Schreibfeld 60 mm, Wichtige Wörter aus Set-Glossar |
| 3 | Leitfrage 2, Info-Karte, Raster mit drei Zeilen inklusive ausgefüllter Beispielzeile; vier Spalten; Befundfeld 30 mm |
| 4 | Leitfrage 3, Denkhilfe zuerst, dann Entscheid mit Grund; Schreibfeld 45 mm |
| 5 | Auftrag, fünf Schritte, Abgaben, Beispiel darunter; Produkt auf eigenem Papier oder am Laptop |
| 6 | vier passende A2-Methodenkarten; `__spur__` und `methoden_ref_rezeption` wie im gemeinsamen Vertrag |
| 7 | Prüfen: zwei Kriterien und freiwilliges Plus; keine Arbeitsfläche |
| 8 | Quer-Check mit Antwortzeilen, drei Mitnahmezeilen, Checkliste; kein Netz und keine Mindmap |

### Anker, Hilfen, Beschriftungen

`quellen_anker[].ref: "Dossier"`, `seiten: "Info-Karte A-01"` usw.,
`knoten_ref: "Dossier | Info-Karte A-01"`. Interne IDs bleiben `nugget_A_01`.
In der Regel drei Karten je Heft, jede Leitfrage mit tragfähiger Grundlage.
Je Leitfrage drei kurze Strategien, drei Satzanfänge und `scaffolding.produkt`,
für genau diese Denkhandlung gebaut (§6.4), kein Satzanfang zweimal.
Vorhandene `hko-eba-*`-Methoden auf Passung prüfen; nicht automatisch kopieren.
Rasterauftrag ausdrücklich: «Im Raster ist die erste Zeile schon ausgefüllt,
als Beispiel.» Danach **zwei** weitere Zeilen bearbeiten lassen.
`kasten_s4.titel: "Denkhilfe – zuerst hier Stichworte, dann schreiben"`.

Lernendentexte schreiben immer «Leitfrage 1» usw., nie LF-Kürzel. Lies
[a2-language-rules.md](a2-language-rules.md) vor jedem Lernendentext.
Sie in Anweisungen, Ich in Situation/Produktbeschreibung. `worte()` liefert
funktionale Etiketten («Das brauchen Sie später», «Das kommt in Ihr Produkt»,
«Ich kreuze an», «Sprache/Gesellschaft», freiwilliges Plus, Quer-Check).
Nicht durch abweichende Datentexte ersetzen. Bloom-Abzeichen entfallen.

### Schritte, Kriterien und Produktbilder

Fünf Schritte, keine indexgetreue Vierer-Kopplung. Alle drei Leitfragen liefern
wirklich verwendete Produktbausteine. **Jeder** `handlungsprodukt.schritte[].hint`
nennt eine Heftseite: Beispiel S. 5, Methoden S. 6, Kriterien S. 7. Keine
Arbeitsfläche S. 7 bestellen. Kontrollschritt verweist auf Kriterien S. 7.
Nach dem letzten Umbau auch `scaffold_90` und weitere Zeiger nachprüfen.
LP legt Papier/Laptop fest; der Renderer druckt den Hinweis auf S. 5.

Zwei `feedback_kriterien`: `kn_kriterium`, `dimension`, `stufen` zeichengenau
wie KN (R6). Zusätzlich Pflicht: `name_lernende` und vier `stufen_lernende`
in einfachen Ich-Sätzen. Derselbe Massstab, keine veränderte Bewertung.
`indikator_produkt` konkret für die neue Abgabe. Erreichbarkeit der höchsten
Stufe prüfen; Einschränkungen im Begleiter offen nennen.
`beispielbild` und `loesungsbild` wie v4.2, keine alte `musterloesung`-Struktur.
Beispiel vorerst erklärter anderer Fall; P12 (themennäher/freiwilliger Transfer)
ist offen. Die Unterzeile liefert `worte()`.

## 2a. Medien-Spur bei EBA (nur wenn die Kompetenz SM2 verlangt)

- **Quelle suchen:** zuerst SRG (Skill `srgssr-api`: SRF-Beiträge mit Embed-Link,
  Untertiteln/Transkript), sonst ein deutschsprachiges YouTube-Video einer Fachstelle
  oder Behörde (z. B. Budgetberatung Schweiz, Schuldenberatung, Pro Juventute, SUVA,
  Kanton) — keine Influencer, keine Werbung als Inhalt. Jede Quelle wird wirklich
  angeschaut/gelesen (Transkript im Archiv `D:/OS/_lab/quellen-archiv/bbw-hko`),
  nie nur nach Titel gewählt. Keine URL erfinden.
- **Zuschnitt A2:** höchstens 3–5 Minuten oder ein Ausschnitt mit Zeitmarken; mit
  Untertiteln bevorzugt. Vor dem Video «Wichtige Wörter» (wie im Leseblatt); der
  Auftrag auf S. 3 nennt die Zeitmarken und genau, worauf zu achten ist.
- **Daten:** `spuren.mit_medien.quellen[]` mit genau einer `rolle: "pflicht"`
  (Quellenkarte unter `src/data/quellen/`, Phase Q), `leitfragen` Nr. 2 (Raster zur
  Quelle, keine Beispielzeile) und Nr. 3, `kasten_s4` wie ohne Medien,
  `methoden_ref_rezeption` auf eine Hör-/Seh-Karte. Fundstelle `knoten_ref` beginnt
  mit «Quelle», z. B. `Quelle · Raster` — das Heft druckt «Schauen Sie: Video auf S. 3
  (QR-Code)» (`worte()` in `v42-profil.ts`). S. 3 heisst «Video und Raster».
- **Prüfen:** `check-eba` verlangt bei `mit_medien` genau eine Pflichtquelle,
  Leitfragen 2 und 3, den Denkhilfe-Titel und `set.spur: "wahl"`. Messung beider
  Spuren mit `export-v42` + `messen-v42` (S. 1 und S. 3 mit QR-Code).

## 3. Abschluss und Set (Phasen 6–7)

- Netz-Felder `mindmap_zentrum`, `mindmap_aeste`, Netz-Lösung bleiben technisch
  für Glossarkopplung und Prüfer; Zentrum A/B gleich. Kein Lernendenauftrag
  daraus, kein Netz als Abgabe oder Vollständigkeitsmerkmal.
- Zwei Ich-Fragen im Quer-Check zur Anfangssituation mit je LP-Antwort in
  `abschluss.loesung.quercheck`; Renderer ergänzt Antwortzeilen. Drei
  Mitnahmezeilen mit Lösung, letzte «Mir noch unklar».
- Vier Checklisten-Zeilen: Leitfragen, Raster, eigener Produktname, Abschluss.
  Abschluss: «Quer-Check: jede Frage abgehakt und beantwortet» und
  ««Das nehme ich mit» ausgefüllt»; keine Netz-Zeile.
- `wochen_plan` im Heft nicht leer, sondern Teil 1/2/3 ohne Zeitangaben.
  Teil 3 nennt Produkt, Kriterien, Abschluss mit Quer-Check. LP-Wochenplan
  bleibt Vorschlag im Set/Begleiter.
- Set-Glossar wie v4.2 konsistent zu technischen Knoten,
  `herkunft: "dossier"` wie in der Gold-EBA. Gemeinsamer Auftrag
  statt `austausch_phase`/Gruppenpuzzle, ausschliesslich
  `sozialform.zulaessig: ["partner"]`. Erst individuell planen, zu zweit
  arbeiten; bei Gesprächen Rollen wechseln. Zwei Produkte aus eigenen Modi
  herleiten. `heft_bezug` anhand EBA-Seitenplan prüfen; Produkt nicht S. 7.


### EBA-Ausnahme: Auftragsbogen A1–A4

Für EBA gilt `assets/eba-set-template.json`. Die EFZ-Regel «kein weiteres
Feld» gilt hier nicht: `gemeinsamer_auftrag.woerter` ist Pflicht, eine
nichtleere Liste mit je `{begriff, definition}`, beide nichtleer und auf
A2-Sprachniveau. «Wichtige Wörter» steht vor der Situation auf A1.
`heft_bezug` steht auf **A2**, nicht A1; Wörter immer mit
**«Wichtige Wörter (S. 2)»** referenzieren, nie «Glossar (S. 8)».
A4: **«Punkte · Kriterium · Ich · Partner/in»**, Bereiche «Sprache/Gesellschaft».
Alle vier Kriterien brauchen `name_lernende` und `stufen_lernende`: vier
nichtleere Ich-Sätze, Anzahl gleich `stufen`, gleiche Bedeutung und gleicher
Massstab wie der KN-Wortlaut. An den Produktmodus anpassen (etwa «beim
Sprechen», «im Reglement»). `kn_kriterium`, `dimension` und `stufen` bleiben
zeichengenau aus dem KN (R6); die Lernendenfassung ändert keine Bewertung.


### EBA-Ausnahme: Kompetenznachweis für Lernende

Vorlage `assets/eba-kn-template.json`. `definition_kurz` lautet:
«Dieser Fall ist neu. Sie brauchen dafür beide Hefte.» Dossier und Hefte
sind erlaubt, kein Internet; kein LP-Entscheid über das Lehrmittel.
Vorbereitung: «Stichworte auf den Seiten 2 und 3». Mini Case: «Vier kurze
Aufgaben. Sie werden Schritt für Schritt schwieriger.» Alle gedruckten
Lernendentexte auf A2: kein «Hybrid», keine K-Stufen/K-Decke, LF-Kürzel
oder Bloom-Wörter. `definition_lang`, `typ`, `k_stufe`, Mapping und andere
LP-/Technikfelder sind ausgenommen.

Alle vier `rubrik_shared.kriterien` brauchen zusätzlich `name_lernende`
und vier nichtleere `stufen_lernende` in Ich-Form: Anzahl gleich `stufen`,
gleiche Bedeutung je Punktzahl; passend zum Produktmodus. `name`,
`dimension` und `stufen` bleiben Bewertungswortlaut (R6).
Jedes `niveaubaender[]` braucht eine nichtleere `definition_lernende` auf A2
mit derselben Punkteschwelle wie `definition` (80 %: drei oder mehr Kriterien
auf mindestens 2 Punkten). Niveaus sprechen Lernende mit Sie an; die
Ich-Form gilt für Kriterien.

Verlangt eine Aufgabe eine auszufüllende Tabelle, ist
`kn_typen[].aufgaben[].tabelle: {spalten, zeilen}` Pflicht: nichtleere Liste
nichtleerer A2-Spaltentitel, positive ganze Zeilenzahl. Ohne Tabellenauftrag
weglassen; keine fehlende Tabelle bloss im Text bestellen.

Werkschau: zwei Produkte, Werkwahl **2 Sätze**, Reflexion **120–150 Wörter**.
Für das Auslesen durch den Renderer diese Muster in `ablauf` beibehalten:
«Lernende wählen eines ihrer zwei Produkte aus den Heften (A; B).»
(A/B durch die tatsächlichen Produktnamen ersetzen),
«Werkwahl-Begründung (2 Sätze): …»,
«Transfer-Reflexion (120-150 Wörter): …» (Bindestrich in den Daten).
Die EFZ-Werte 2–3 Sätze und 200–250 Wörter gelten hier nicht.

## 4. Dossier und Begleiter

Nach Heftentwurf Wissen rückwärts ableiten und Dossier **vor endgültigen
Lösungen/Audits** fertigstellen. Lies [eba-dossier.md](eba-dossier.md), nutze
`assets/eba-dossier-template.json`. Nach sachlicher Änderung Lösungen neu prüfen.
`dossier.json` gehört zu Export, Messung und Commit: sieben Kerndateien.
KI-Toolbox nur bei Auftrag mit `hko-ki-komplement`; keine KI-Prompts und keine
Austausch-Scaffolds im Dossier zurückbringen.

Begleiter mit `assets/eba-begleiter-template.md`, Marker weiterhin per
`scripts/begleiter-marker.mjs`. Drei Leitfragen führen. Seitenplantabelle und
beide S.-Beschreibungen müssen obiger Folge entsprechen. Papier/Laptop vor
Produktion ansagen; Tafelbilder nur freiwillig für LP, nicht als Heft-Abgabe.
In §6 Hinweis **«Freiwillig für dich»**: Gemeinsamer Auftrag ist Angebot für
LP; ohne ihn KN nach Heft B, Woche 3 Übung/Puffer. Zweierarbeit, kein Puzzle.
Optionales Leseblatt als Einstieg nennen.

## 5. Tor, Audits und erster Testlauf

1. Während Schreiben `node scripts/check-v42.mjs <ordner>`; nach Dossier/Set
   zusätzlich `node scripts/check-eba.mjs <ordner>`.
2. Finale Daten, Index und Begleiter-Marker; `node scripts/check-all.mjs
   <ordner> --vor-audit`. Ausstehende Audits bleiben ausdrücklich offen.
3. Vollständige Audits wie EFZ mit `audit-paket.mjs`: blind lösen, vergleichen,
   Fakten, Lösbarkeitsprobe. EBA-Lernendenlesung A2. Allgemeines «LF4» im
   Reviewauftrag bedeutet hier **Abwägungsfrage Leitfrage 3**. Dossier statt
   Lehrmittel mitgeben. Beleg: `herkunft: "dossier"`, `wo: "dossier.json"`,
   `stelle: "nugget_A_01"`, wörtlicher Anker 5–12 Wörter aus dieser Karte.
   Dossierbeleg sichert Lösungsgrundlage; Fakten zusätzlich an Primärquellen
   prüfen, keine zirkuläre Begründung durch selbst erzeugtes Wissen.
4. Export ausserhalb Repo: `node scripts/export-v42.mjs <ordner> --out <tmp>`,
   `node scripts/messen-v42.mjs <tmp>`. Beide achtseitigen Hefte, Auftragsbogen,
   Lösungen und Leseblatt messen. Alle Seiten zählen, besonders S. 1–5.
   Grössere EBA-Schrift nicht verkleinern, um Text passend zu machen.
   Eingebettete Produktionsschriften IBM Plex/HKO Hand/HKO Symbole verwenden;
   Segoe Print ist kein Messmassstab. Zeichenbudgets garantieren keinen Platz.
5. Nach letzter Änderung vollständiges `check-all` ohne `--vor-audit`;
   Zeiger/Kohärenz zusätzlich mit `--export <tmp>` wie Phase 9.
6. Schlusslesung am fertigen Export nach §6: jeder Auftrag, jede Info-Karte, Methode,
   Beispielzeile, Abgabe und Seitenangabe stimmt (§6.1), keine Lösung ist
   vorweggenommen (§6.2), jeder Satzanfang führt zur Musterlösung (§6.4). A2-Verständlichkeit,
   Fachbegriffsdeckung und Kriteriengleichheit bleiben menschliche Urteile.

## 6. Qualitätsregeln aus der Gegenlesung (03.11.2026)

Herkunft: Argon-Gegenlesungen von `2.1.1_budget_planen` (GPT) und
`1.2.1_regeln_schule_betrieb` (Gemini Flash), Berichte im jeweiligen Laufordner
unter `GEGENLESUNG-argon.md`. Beide Einheiten waren in `check-all` grün und
trotzdem nicht einsetzbar. Die Regeln hier gelten **vor** dem Tor, beim Schreiben.
Was zählbar ist, prüft `check-eba` (Tabelle am Schluss); der Rest ist Pflicht der
Schlusslesung (§5 Nr. 6) und des Fachlektorats (`gegenleser.md` §4.4).

### 6.1 Jeder Verweis zeigt auf etwas, das gedruckt existiert

Ein Verweis ist jede Stelle, die Lernende woandershin schickt: Seite, Tabelle,
Raster, Info-Karte, Leitfrage, Methode, Feld, Regel, «wie im Beispiel». Für
jeden gilt: **Das Ziel ist gedruckt, und es enthält genau das, was der Verweis
verspricht.** Geprüft wird am Export, nicht an der JSON.

- **Keine Tabelle auf S. 1 nennen, wenn `zahlen_tabelle` leer ist.** «Ordnen Sie
  zwei Pflichten aus der Tabelle auf Seite 1 zu» war ein Gold-Rest (1.2.1).
- **Kein Raster bestellen, wo ein Schreibfeld steht.** Der Auftragsbogen kennt auf
  A2/A3 `form: "spur"` (Stationen) und `"flaeche"` (leeres Feld). «Füllen Sie das
  Auswertungsraster auf A2 aus» über einer `flaeche` ist unlösbar. Entweder
  Stationen setzen oder sagen, *was* ins Feld kommt.
- **Wo wird geschrieben?** Verlangt ein Schritt Notizen («Notieren Sie für beide
  Wege …»), nennt er den Ort: ein Feld auf der Seite oder «auf einem eigenen
  Blatt». Ohne Ort weiss die Lernende nicht, was sie abgibt.
- **Verweis auf Inhalt, nicht auf einen Ort, an dem nichts steht.** «Prüfen Sie die
  Vorgaben im Dossier» ist falsch, wenn keine Info-Karte die Vorgabe enthält.
  Jede Regel, auf die ein Auftrag, eine Lösung oder ein Erwartungshorizont baut,
  steht auf einer genannten Info-Karte. Der Bauplan behauptet das nur — nachsehen.
- **Leitfrage-Zeiger stimmen inhaltlich.** «Notieren Sie die Fakten aus Leitfrage 1»
  geht nur, wenn Leitfrage 1 nach Fakten fragt. Nach jedem Umbau einer Leitfrage
  alle Zeiger auf sie nachlesen (Schritte S. 5, Methoden S. 6, `scaffold_90`).
- **Jede Zahl einer Lösung steht im Heft oder ist daraus berechenbar.** Rechnet die
  Lösung mit «3 × 40», steht der Sparplan im Fall — sonst sind auch andere Wege
  richtig und die Lösung lässt sie zu.
- **Legende nur mit Zeichen.** `beispielbild.legende`/`loesungsbild.legende` nur,
  wenn jede `key` als `marke` in den Blöcken vorkommt; sonst `legende: []`.
- **Methodenkarte passt zum Produkt.** Mündliches Produkt → keine Karte, die Anrede
  und Gruss einer Nachricht lehrt. Der Bauplan nennt die Karten; abweichen nur
  mit Grund im Bericht.
- **Was der KN fragt, ist geübt und gedeckt.** Kein KN-Fall mit Rollen, Orten oder
  Regeln (z. B. üK, Kursleitung), zu denen Hefte und Dossier nichts sagen.

### 6.2 Die Lösung wird nicht verraten

- **Info-Karten erklären das Verfahren an eigenen Zahlen und einem eigenen Fall.**
  Nie die Fallzahlen des Hefts (2.1.1: Info-Karte A-02 rechnete «780 − 245 − 360
  − 100 = 75» vor, also Leitfrage 2 wörtlich). Gleiches gilt für Rechtsfälle:
  die Karte nennt die Regel, nicht die Anwendung auf den Heftfall.
- **Beispielbild S. 5** zeigt einen anderen Fall, aber **dieselbe Bauform** wie das
  verlangte Produkt (verlangt das Produkt Einzelposten, zeigt das Beispiel
  Einzelposten).
- **Folgeaufgaben setzen keinen Entscheid voraus.** Ist A3 offen («Miete oder
  Kauf»), verrät A4 die erwartete Wahl nicht («… bei der Miete»).

### 6.3 Fragen: ein Auftrag, eindeutig, und die Lösung antwortet genau darauf

- Je Leitfrage ein Operator mit klarem Ergebnis (erklären mit zwei Beispielen ·
  zuordnen und rechnen · zwischen zwei Wegen entscheiden).
- Abwägung eindeutig formulieren: «Prüfen Sie zwei Wege. Wählen Sie einen und
  begründen Sie.» — nicht «Wählen Sie zwei Haltungen aus».
- `loesung` enthält nur, wonach gefragt ist. Was die Lehrperson zusätzlich wissen
  soll, steht als eigene Zeile mit Label «Hinweis für LP» oder «Häufiger Fehler».
- Lösungen und Erwartungshorizont benutzen die Regel **dieses** Falls (1.2.1: die
  4-Wochen-Regel für nachträgliche Absenzen stand im Erwartungshorizont eines
  vorhersehbaren Gesuchs).

### 6.4 Hilfen (Scaffolds) sind für genau diese Leitfrage gebaut

Die drei Satzanfänge sind die wichtigste Sprachstütze im EBA. Sie müssen sich zu
einer **richtigen Antwort auf diese Leitfrage** vervollständigen lassen. Probe:
den Satzanfang mit der Musterlösung fertig schreiben — passt er nicht, ist er falsch.

| Denkhandlung | Satzanfänge (Muster, mit Wörtern des Falls füllen) | Strategie 2 (konkreter Denkschritt) |
|---|---|---|
| Erklären (LF1) | «X bedeutet …» · «Ein Beispiel dafür ist …» · «Der Unterschied ist …» | den Begriff im Fall suchen und markieren |
| Zuordnen / Rechnen (LF2, Raster) | «In die Zeile … gehört …, weil …» · «Nach allen Posten bleiben …» · «Es fehlen …» | Beispielzeile lesen, dann die zwei Fallangaben in die Zeilen bringen |
| Entscheiden (LF3) | «Ich wähle …, weil …» · «Ein Nachteil ist …» · «Darum mache ich zuerst …» | in der Denkhilfe je Weg ein Für und ein Gegen |
| Mündlich (Produkt) | «Ich schlage vor, …» · «Mein wichtigster Grund ist …» · «Wenn Sie einverstanden sind, …» | Stichworte, laut üben, Zeit stoppen |

- **Kein Satzanfang zweimal in einer Einheit.** «Ich finde … / Mein Grund ist …»
  unter jeder Leitfrage ist der häufigste Fehler (2.1.1, alle sechs Seiten).
- **Strategien:** 1 = Quelle (welche Info-Karte, welche Stelle), 2 = der Denkschritt
  dieser Leitfrage mit Wörtern des Falls, 3 = Übertragung ins Produkt. Nicht drei
  allgemeine Sätze, die unter jede Leitfrage passen. Vorgegeben bleibt nur
  «Lesen Sie zuerst die Beispielzeile im Raster.» auf S. 3.
- **Denkhilfe-Spalten S. 4** aus den zwei Wegen von Leitfrage 3 dieses Hefts
  ableiten («Sofort widersprechen | Sachlich klären | Mein nächster Schritt»), nie
  aus einer anderen Einheit übernehmen.
- **Dossier-Hilfen je Karte und je Modus:** `recherche.selbst_pruefen` ist eine
  konkrete Prüfhandlung zu genau dieser Karte; `so_gehst_du_vor` folgt dem
  Sprachmodus (mündlich: Stichworte, laut üben, Zeit stoppen, Rückmeldung holen).
- **Kriterien in der Lernendenfassung** sprechen den Modus des Produkts an («beim
  Sprechen» im Gespräch, «beim Schreiben» in der Notiz). Indikatoren nennen nur
  Wörter, die auf A1/S. 2 als «Wichtige Wörter» stehen.

### 6.5 Sprache und Sachrichtigkeit im Lernendentext

- A2 zählbar: kein Satz über 18 Wörter, keine Paragraphen (§, Abs., lit., Art.) im
  Fall, in Leitfragen, Strategien und Info-Karten. Paragraphen gehören in
  `fakten_anker[].quelle`, LP-Lösungen und Begleiter.
- Info-Karten in Sie-Form; Ich-Form nur im `beispiel`.
- Kein Prüferhinweis im Lernendentext («Erfundener Fall.»); Fallwerte deklariert
  `fall.json › faelle`.
- **Rechtsaussagen wörtlich am Erlass prüfen**: Wer ist zuständig (Schulleitung,
  Lehrperson «wenn vorgesehen»)? Wessen Einwilligung (der betroffenen Person, nicht
  der Lehrperson)? Unter welcher Bedingung (Busse nur bei schriftlichem Verweis)?
  Geltungsbereich (gilt der Erlass für den Ort des Falls)? Rollen mit ihrem Namen
  («Berufsbildner/in», nicht «Chef»).

### 6.6 Nichts aus Gold übernehmen

Gold ist Massstab für **Form und Tiefe**, nicht Inhaltsquelle. Kopierreste, die die
Gegenlesung fand: Denkhilfe-Spalten, «Tabelle auf Seite 1», die 4-Wochen-Regel,
Schrittlabels mit angehängtem Renderer-Wort, KN-Fragen im Gold-Wortlaut. Nach dem
Schreiben `check-eba` lesen: `WARN_EBA_GOLD_KOPIE` nennt jeden wörtlich gleichen
Inhaltssatz; jeder bleibt nur, wenn er zum eigenen Fall passt.

### 6.7 Begleiter: Tiefe wie Gold

Mindestens: Richtzeit je Heftseite und je Auftragsseite; je Leitfrage ein
Stolperstein mit Coaching-Satz; Gesprächsimpulse für den Einwand im Partnergespräch;
im KN je Frage/Aufgabe ein Anker «2 Punkte, wenn … · 3 Punkte, wenn …»;
Einschränkungen der höchsten Stufe offen. Ein Begleiter, der nur die Marker
erfüllt, ist nicht fertig.

### 6.8 Was `check-eba` seit 03.11.2026 zählt

| Code | Prüft |
|---|---|
| `ERR_A2_SATZ_ZU_LANG` | Satz über 18 Wörter in gedruckter Lernendenprosa (Hefte, Auftrag, Dossier, KN) |
| `ERR_EBA_PARAGRAPH` | §, Abs., lit., Art. im Lernendentext |
| `ERR_EBA_META` | «Erfundener Fall» im Lernendentext |
| `ERR_EBA_HILFEN_KOPIE` | gleicher Satzanfang in zwei Leitfragen; dieselben drei Strategien; gleiches `selbst_pruefen`; gleiche `so_gehst_du_vor` |
| `WARN_EBA_HILFEN_KOPIE` | einzelne gleiche Strategie (ausser der Template-Zeile) |
| `ERR_EBA_DOSSIER_FORM` | Ich-Form im `inhalt` einer Info-Karte |
| `ERR_EBA_VORWEG` | zwei oder mehr Fallzahlen des Hefts auf dessen Info-Karte |
| `ERR_EBA_VERWEIS` | Tabelle auf S. 1 ohne `zahlen_tabelle`; unbekannte Info-Karte im Text; Raster/Tabelle auf einer `flaeche` des Auftragsbogens |
| `ERR_EBA_LEGENDE` | Legendenzeichen ohne `marke` im Bild |
| `ERR_EBA_PLUS` | `lernfortschritt` nicht als Objekt mit `scaffold_90`/`scaffold_100` |
| `ERR_EBA_KN_TYP` | KN-Typ ausserhalb `fachgespraech`, `mini_case_schriftlich`, `werkschau_transfer` |
| `ERR_EBA_GOLD_KOPIE` | Denkhilfe-Spalten wortgleich mit Gold |
| `WARN_EBA_GOLD_KOPIE` | Inhaltssatz (≥ 6 Wörter) wortgleich mit Gold |
| `WARN_EBA_STUFEN_MODUS` | `stufen_lernende` in Heften und Auftrag wortgleich |

Nicht zählbar und darum Pflicht der Lesung: ob ein Verweis *inhaltlich* stimmt
(6.1), ob ein Satzanfang zur Lösung führt (6.4), Sachrichtigkeit (6.5).

Ersten Lauf als **Testlauf EBA-Profil** berichten: Daten-, Skill- und
Layoutbefunde unterscheiden. Keine EBA-Ausnahme oder Baseline als Ersatz für
bestandene Prüfung. Kein Commit/Publizieren bei fehlenden Pflichtaudits.
Normale Freigabe gilt; die Skill-Anpassung erzeugt selbst keine Einheit.
