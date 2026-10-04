# Bericht — 3.2.1_konsumfolgen_beurteilen (bbw-hko-heft-v42, Auto-Modus, lokal)

Lauf vom 2026-10-04, lokal, Branch `v42-skill`, aus dem Prompt
`docs/cloud-run/prompts/alle-bauplaene-seriell.md` (ein Durchgang). Bauplan:
`docs/cloud-run/bauplaene/3.2.1_konsumfolgen_beurteilen.md`, freigegeben am
2026-10-04. Kein Lehrmittel-, Transkript- oder Artikeltext in dieser Datei.

**Ergebnis: grün.**

Ablauf: bis zum Begleiter streng nacheinander; ab den Gegenlesern liefen
Agenten gleichzeitig, wo sie sich nicht störten (Pietro, 04.10.2026, im
Lauf; die Prompt-Datei ist entsprechend angepasst). Die Session wurde einmal
unterbrochen, als der Executor von Heft B lief; er wurde fortgesetzt, es ging
nichts verloren.

## 1. Einheit

| | |
|---|---|
| Ordner | `src/data/einheiten/3.2.1_konsumfolgen_beurteilen/` (sechs Dateien) |
| Lehrgang | EFZ_3J kanonisch, `lehrgaenge` `["EFZ_3J", "EFZ_4J"]` (Lebensbezug 3.2 in beiden Datensätzen zeichengleich — im Lauf am Datensatz nachgeprüft) |
| Heft A | 3.2.1 · «Billig bestellt – was hängt an meinem Kauf?» · Bildfolge mit Sprechtext (sechs Bilder, 60–90 Sekunden), geplant als Storyboard · beide Spuren |
| Heft B | 3.2.2 · «Rosen für die Klassenkasse – welcher Preis ist richtig?» · Preisbeurteilung zu zweit mit schriftlicher Rückmeldung und Antwort · beide Spuren |
| Auftrag | «Herbstferien – fliegen oder Zug fahren?» · Familie · A2 Auswertung der Angebotsübersicht (`flaeche`), A3 Empfehlung (`flaeche`) |
| KN | «Neue Bälle für den Verein – billig wie immer?» · Verein · Kriterien Fachkorrektheit, Argumentation, Wirtschaftliches Prinzip, Position / Werthaltung |
| Status | `entwurf` |
| Quellenkarten | acht, `q-321a-*` und `q-321b-*` — in Phase Q angelegt, im Lauf nicht verändert, mit diesem Commit erstmals eingecheckt |

## 2. Tor (letzte Ausgaben, nach der letzten Änderung)

```
build:einheiten-index    läuft durch (im Arbeitsbaum 22 Sets, davon zwei fremde, siehe §11)
begleiter-marker --check 281 Marker · 0 abweichend · 0 unaufloesbar · nichts geschrieben
check-all 3.2.1_konsumfolgen_beurteilen
  ok  Struktur · Status · Methoden · Sprache · Leck  0 Fehler, 0 Warnungen
  ok  nRLP-Abgleich (Kompetenz-/Lebensbezugstexte, Lehrgaenge)
  ok  Kopplung · Autarkie · Begleiter-Marker
  ok  Leitfragen-Loesungen
  ok  Heft v4.x (Budgets, Spuren, Quellen)
  GRUEN — keine Fehler.
export-v42 + messen-v42  Exit 0 — 56 Seiten ok, kein Überlauf
                         (Auftragsbogen 4 · vier Hefte je 8 · vier Lösungen je 5)
bestand-v42 --pruefen    OK — 26 Dokumente unverändert.
npm run build            Exit 0 (prebuild hat keine Datei der Einheit verändert)
check-all 1.3.1_konsum_verantworten_v42 2.3.1_anliegen_vertreten
          2.1.1_informationen_hinterfragen   GRUEN — keine Fehler.
```

Reserve 0 px (voll, kein Überlauf): je Heft S. 1, 6, 7; Auftragsbogen A2, A3.
Knapp: Lösungen A mit Medien S. 3 (8,7 px), Lösungen B mit Medien S. 2
(14,9 px).

**Reparatur vor dem Gegenlesen (Messung):** Nach Phase 7 liefen in der
Medien-Fassung fünf Seiten über — Heft A und Heft B je S. 3 (8 px), Lösungen A
S. 3 (65,9 px), Lösungen B S. 2 (3,8 px) und S. 3 (47,2 px). Die Executor der
Hefte haben LF3 und die Erwartungshorizonte gekürzt (keine Fundstelle
gestrichen; in Vertiefung 2 von Heft A entfiel der Punkt 02:15–02:26, in den
Vertiefungen von Heft B je ein Nebenpunkt). Der Auftragsbogen lief diesmal
nicht über: `set.json` wurde von Anfang an knapp geschrieben und vom Executor
selbst gemessen.

## 3. Kapitel, Seiten, Quellen

| Heft | Leitfrage | Fundstelle |
|---|---|---|
| A | LF1 | Kap. 9.3 S. 231 (Nachhaltigkeit, drei Aspekte) · Kap. 9.2 S. 230 (graue Energie) |
| A | LF2 | Kap. 9.2 S. 230 (fünf Stationen) · eigener Fall |
| A | LF3 ohne Medien | Kap. 1.5 S. 39–41, nur Fliesstext |
| A | LF3 mit Medien | `q-321a-pflicht` |
| A | LF4 | ohne Medien `position_gegenposition`: Kap. 2.7 S. 74 ↔ Kap. 1.5 S. 41 · mit Medien `lehrmittel_quelle`: Kap. 1.5 S. 37, 41 ↔ Quelle |
| B | LF1 | Kap. 2.7 S. 74–76 |
| B | LF2 | Kap. 2.7 S. 77 (erster der vier Fälle) · Fallangabe |
| B | LF3 ohne Medien | Kap. 11.2 S. 272–274 |
| B | LF3 mit Medien | `q-321b-pflicht` |
| B | LF4 | `modell_eigener_fall` in beiden Spuren: Kap. 2.7 S. 76–77 ↔ eigener Fall; Kap. 1.2 S. 16–17, Kap. 1.5 S. 38 |
| Auftrag | Erwartungshorizont | Kap. 9.4 S. 236–237 (Verkehr insgesamt) |

Kap. 1.2 S. 16–17 liegt ausserhalb der Crosswalk-Zeile; der Bauplan nennt es
in §2 und §9 als Ausnahme. Der Crosswalk ist nicht nachgeführt.

| Slot | ID | Typ · Titel · Herausgeber · Datum | Ausschnitt | geprüft am | Zugeständnis |
|---|---|---|---|---|---|
| A Quelle | `q-321a-pflicht` | Video · «Studie: Scham beim Einkauf auf chinesischen Billigplattformen» · SRF Tagesschau · 2025-10-21 | 00:00–03:00 | Phase Q 2026-10-04; Lösung am Archivtext im Lauf | Spalte «Bild» nur aus dem Ton erschlossen; Zahlen Stand Oktober 2025; Folgen sind Aussagen von Befragten und Erwartungen |
| A Ersatz | `q-321a-pflicht-ersatz` | Video · Titel nennt ein Unternehmen (Karte) · SRF Tagesschau · 2024-04-23 | 00:00–02:46 | wie oben | Stand April 2024; keine ökologische Folge, kein Ausweg; Verbreitung nur über den Umsatz |
| A Vertiefung 1 | `q-321a-vertiefung-1` | Artikel · «Shoppen und schämen: Wege aus der Billig-Kaufwut» · SRF News · 2025-10-22 | Abs. 3–10 | wie oben | gleiche Umfrage wie die Quelle |
| A Vertiefung 2 | `q-321a-vertiefung-2` | Video · «Schweizer Detailhandelsverband fordert Gebühr für Kleinpakete» · SRF Tagesschau · 2026-03-30 | 00:00–02:37 | wie oben | Ausgang offen, Bild nicht gesichtet |
| B Quelle | `q-321b-pflicht` | Video · «Vier Millionen Rosen für den Valentinstag» · SRF Einstein · 2014-02-13 | 03:24–07:22 | wie oben | von 2014, Ausschnitt; Mengen, Anteile, Namen nicht im Heft; Sprecher bei 06:50 erschlossen |
| B Ersatz | `q-321b-pflicht-ersatz` | Video · «Vier Millionen Rosen zum Valentinstag» · SRF Tagesschau · 2024-02-14 | 00:00–02:45 | wie oben | erklärt den Preis nicht ausdrücklich |
| B Vertiefung 1 | `q-321b-vertiefung-1` | Artikel · «Kann man mit gutem Gewissen Rosen aus Kenia kaufen?» · SRF News · 2024-02-13 | Abs. 1–7 | wie oben | gibt Berichte wieder; Studie mit Auftraggebern mit eigenem Interesse |
| B Vertiefung 2 | `q-321b-vertiefung-2` | Artikel · «Valentinstag: Blumengeschäft unter Preisdruck» · SRF News · 2017-02-08 | Abs. 1–3 | wie oben | von 2017 |

## 4. Abdeckung (kohaerenz.md §3)

| # | Befund | Lücke |
|---|---|---|
| A1 | Rezeption schriftlich und bildlich → Auftrag A2 · Produktion schriftlich und bildlich → Auftrag A3 | **Produktion mündlich** und **Interaktion und Kollaboration mündlich** stehen in keinem Heft und nicht im Auftrag (Sonderfall «mehr als zwei», Bauplan §6); der Begleiter schlägt eine mündliche Probe vor |
| A2 | A: Produktion multimedial → Storyboard und Bildfolge · B: Interaktion und Kollaboration schriftlich → Text zu zweit, Rückmeldung, Antwort | keine |
| A3 | S. 3 in beiden Heften geübt, nicht geführt: ohne Medien Rezeption schriftlich, mit Medien Rezeption audiovisuell | keine |
| A4 | beide Modi des Auftrags je ein Produkt (`flaeche`) | keine |
| A5 | 3.2.1 in A, 3.2.2 in B geführt | Heft A braucht ein Gerät; ohne Gerät bleibt es beim Storyboard mit gesprochenem Text |
| A6 | SK 1 → A · 3 → B, KN · 5 → A, B, KN · 9 → A, B, KN | keine |
| A7 | A: 1 → LF3 · 5 → LF4 · 9 → Produkt — B: 9 → LF3 · 3 → LF4 und Schritt 04 · 5 → Produkt | keine |
| A8 | Bildfolge (Liste) · Text mit Rückmeldung (Wechselrede + Liste) · Auswertungstabelle · Empfehlung als Nachricht | keine |
| A9 | Freundeskreis · Berufsfachschule · Familie · Verein | keine |
| A10 | A: Fachkorrektheit + Position / Werthaltung · B: Argumentation + Wirtschaftliches Prinzip · Auftrag: alle vier | keine |
| A11 | ohne Medien: A `position_gegenposition` ≠ B `modell_eigener_fall` · mit Medien: A `lehrmittel_quelle` ≠ B `modell_eigener_fall` | keine |
| A12 | beide Hefte beide Spuren; je Quelle, Ersatzquelle, zwei Vertiefungen mit Karte und Archivtext | keine |
| A13 | Fall-Begriffe («Volleyball», «Bälle», «Materialwart»): kein Treffer in Heften, Set (ausser `kontext_ausschluss`), Karten; im Begleiter nur im Marker und in §7 (Sweep) | keine |
| A14 | siehe §5 | keine |

Prinzip, Hefte und Set tragen dieselben Werte (`kn_kriterien_verteilung`,
`pol_typ_verteilung`, `mindmap_zentrum_kurz`, `auftrag_lebensbereich`,
`modi_pro_heft` = `nrlp.sprachmodi`; Sweep Punkt 10 und `check-all` Kopplung).

## 5. Vergleich mit Gold (nur Kurzliste aus kohaerenz.md §4)

**Fest (F1–F13):** gleich — sechs Dateien; `heft_8page_v42`, acht Seiten je
Heft; Kern einmal, zwei Spuren je Heft; vier Leitfragen K2/K3/K4/K4; fünf
Schritte; Kriterien im Wortlaut des KN; Begriffsnetz mit gleichem Zentrum
(«Günstiger Preis oder faire Folgen») und Transfer-Ast; Abschluss; Auftrag mit
fünf Schritten und zwei Produkten; KN mit drei Formen (`modi_kn` gleich wie
Gold — Gerüst); Lösung zu jedem Feld (`check-lf-loesung`: 16 Leitfragen, kein
Befund); Benennung nach E21; Sprache (Sweep).

**Hergeleitet (H1–H9):**

| | Gold 1.3.1 | 3.2.1 | Herleitung |
|---|---|---|---|
| Modi A | Rezeption schriftlich | Produktion multimedial | Kompetenz-Ebene 3.2.1 |
| Modi B | Rezeption schriftlich · Interaktion mündlich | Interaktion und Kollaboration schriftlich | Kompetenz-Ebene 3.2.2 |
| Modi Auftrag | Produktion mündlich · Produktion schriftlich | Rezeption schriftlich · Produktion schriftlich | Formel, Sonderfall «mehr als zwei» |
| SK A / B / KN | 5·11·1 / 2·6·11 / 5·11·6 | 1·5·9 / 9·3·5 / 5·9·3 | SK von T3 |
| Produkt A | kommentierte Karte | Bildfolge mit Storyboard | `detail` «Multimedia-Präsentation» |
| Produkt B | Tabelle mit Regeln + Gespräch | Text zu zweit mit Rückmeldung und Antwort | `detail` «kooperativ erarbeiten, schriftliche Rückmeldung» |
| Auftrag | Blatt + Sprachnachricht | Auswertungstabelle + Empfehlung (Nachricht) | Rezeptionsmodus → Auswertung eines Dokuments in der Situation |
| Quelle A / B | — | Video / Video | Modus des Themas T3; gleicher Typ als Zugeständnis |
| drittes Kriterium | Wirtschaftliches Prinzip | Wirtschaftliches Prinzip | dominanter Aspekt dieses Lebensbezugs; Stufentexte eigene |

Gleich wie Gold ist ein Modus des Auftrags (Produktion schriftlich — Ergebnis
der Formel) und der Name des dritten Kriteriums; alles andere ist verschieden.

## 6. Entscheide im Lauf (auto-modus §4)

1. **Heft B, Kern der Korrektur nach dem Gegenlesen:** Der Bauplan verlangt
   «je ein Grund aus Herstellung, Transport und Nachfrage». Weder Kap. 11.2
   noch die Quelle belegen, dass Herstellung und Transport den Preis der Rosen
   erklären (das Kapitel sagt, Transport sei billiger und schneller geworden;
   die Quelle sagt, die Nachfrage bestimme den Preis). Das Heft trennt jetzt:
   **Den Preissprung erklärt die Nachfrage (LF2); zu Herstellung und Transport
   belegen die Lernenden je eine Aussage und sagen, was sie daraus für ihr
   Urteil folgern.** LF3 fragt in beiden Spuren, was davon den Sprung erklärt
   und was nicht. Das bleibt innerhalb des Entscheids (die Kompetenz sagt
   «anhand von … beurteilen»); `konzept_progression` heisst entsprechend
   «anhand von … beurteilen» statt «erklären». **Für Pietro zum Ansehen.**
2. **Heft A, Bilder 3 und 4:** Der Bauplan sagt «3–4 die Folgen in den drei
   Dimensionen». Das Heft verlangt jetzt je Bild genau eine Folge mit
   Dimension und Beleg — Bild 3 die ökologische, Bild 4 die ökonomische oder
   soziale —, weil der Lehrmittel-Abschnitt (Kap. 1.5 S. 39–41) und die
   Ersatzquelle eine soziale Folge kaum tragen und die Karte «ein Bild, ein
   Gedanke» verlangt. Die Mitnahme-Zeile («in drei Dimensionen») ist Bauplan
   und blieb.
3. **Heft A, Produktbild mit drei Blöcken** (Storyboard 1–3, Storyboard 4–6,
   Faktenliste) statt zwei: `check-v42` erlaubt im Beispielbild fünf Einträge
   je Block, der Bauplan nennt sechs in einem. Sprechsatz steht im Eintrag,
   Bildidee in der Notiz (Bauplan umgekehrt; die Notiz fasst 60 Zeichen).
4. **Heft A, Knoten «ökologische / ökonomische / soziale Dimension»** statt
   «… Nachhaltigkeit» (Knoten-Budget 25 Zeichen).
5. **Heft A:** drei Abgaben statt zwei (Faktenliste eigens); Schritt-Label
   «05 Bildfolge aufnehmen» (Budget 30).
6. **Heft B:** «Rückfrage» statt «Nachfrage» in den Regeln der Rückmeldung
   (Fachbegriff im selben Heft); ein Heft je Tandem, S. 7 mit drei Teilen;
   zwei zusätzliche Fallangaben in der Situation (Zitat des Grosshändlers,
   Luftfracht aus Übersee); Gewinnformel «verkaufte Rosen × Preis − 120
   bezahlte × Einkauf», gerechnet mit 120 und mit 80 verkauften Rosen;
   die Wechselrede zeigt nur Schluss des Entwurfs, Rückmeldung und Antwort
   (Budget).
7. **Set:** Die drei Spalten der Tabelle auf A2 («Angabe · hinter dem Preis ·
   Folge») tragen die Schritte 01–03, Schritt 04 steht darunter; `heft_bezug`
   verweist für Heft A auf S. 2 und S. 3 (der Bauplan nannte S. 7 — dort steht
   nur die leere Arbeitsfläche). Glossar: «Lebensweg» mit Herkunft `heft`
   (Lehrmittel: «Lebenszyklus»); «Gewinn» an die Formel von Heft B angepasst.
8. **Prinzip:** `zirkularitaet` und `aspekte` nach dem kanonischen Datensatz
   3J (Wirtschaft R1, Voraussicht T5 und T6); für 4J gilt R2 und T4/T5 — der
   Begleiter sagt es. `quellen_anker` führt Kap. 9.4 (Auftrag) und Kap. 1.2.
9. **Begleiter:** SK des Auftrags 9 · 5 · 1 (der Bauplan nennt keine);
   H2 von §3 leicht gekürzt («prüfen, Alternativen zeigen»), weil das Label
   mit 47 Zeichen die Kopie-Prüfung auslösen könnte (nicht getestet);
   Zahlentabelle in §6; Vorschlag für die sechs Lektionen, die der Plan nicht
   verplant.
10. **Was ich als Orchestrator selbst geändert habe:** in `set.json` die
    Schritt-Hinweise 01–04, `heft_bezug`, drei Indikatoren,
    `konzept_progression`, zwei Glossardefinitionen; in beiden Heften
    `prinzip_handoff.kernkonzept`; im Begleiter vier Prosa-Stellen nach der
    letzten Korrektur. Alles andere ging an die Executor der Datei.

## 7. Gegenleser (gegenleser.md §6)

Besetzung: Lernende/r Profil a an allen vier Heft-Fassungen und am
Auftragsbogen, Profil b an Heft A und Heft B (je mit Medien), vier
Lösungs-Audits, ein Sweep — zwölf. Die ersten sieben nacheinander, Audits und
Sweep gleichzeitig; Runde 2 und 3 gleichzeitig.

**Paketfehler in Runde 1:** Im ersten Paket für Heft A mit Medien fehlte der
Text der Quelle (die Archivdateien dieser Einheit sind anders aufgebaut als
die der vorigen). Bemerkt vom ersten Leser, Paket korrigiert, S. 3 und 4 mit
Quellentext nachgelesen; alle späteren Pakete waren vollständig.

| Gegenleser | Runde 1 | übernommen | nicht übernommen |
|---|---|---|---|
| Lernende a und b, Heft A mit | je 3 Stellen, viele Hänger | Beispielbild Bild 4 (Dimensionen falsch, zwei Gedanken), Ort und Form des Storyboards (S. 7 ist das Blatt, Markieren, was ein Bild ist, womit aufnehmen), fünf Stationen beim Namen, LF3 «nennt oder erwartet – und für wen», Zeitmarke in der Spalte «Bild» | Karten-Merksätze von `hko-storyboard` (S); unerklärte Wörter der Quelle (Q); SuK/Ges (R); Frist «bis heute Abend» gegen «einen Tag warten» (V, Bauplan) |
| Lernende a, Heft A ohne | 3 Stellen | Bild 3 und 4 je eine Folge, LF4 mit zwei Spalten und «Einwand der Gegenseite», Beispielzeile zählt mit | soziale Folge im Abschnitt dünn (Bauplan/Lehrmittel — die Lösung sagt es) |
| Lernende a, Heft B ohne und mit; b mit | je 3 Stellen | **Herstellung und Transport erklären den Preis nicht** (Entscheid 1), Annahme der 120 verkauften Rosen und zweite Rechnung, «Einkauf» eindeutig, Tandem und Tausch, Anspruchsgruppen an LF4, Beispielbild mit Belegen und Gesamtgewinn | Persona-Zeile (R); ein Feld auf S. 7 (R); Karte `hko-gemeinsam-schreiben` setzt ein gemeinsames Dokument voraus (S) |
| Lernende a, Auftragsbogen | 3 Stellen | Spaltennamen, Zeilenzahl, `heft_bezug`, Indikatoren | Stufentexte des KN (V); kein Feld unter der Tabelle (R); Wortzählung (V) |
| Audit A ohne | 15 | Beispielbild, Lösungsbild ohne unbelegte soziale Folge, Hinweis trennt die Spuren, Fundstellen, Kennzeichnung von Deutung | — |
| Audit A mit | 10 + 1 Hinweis | Zeitmarken (47 % bei 01:20; «trotzdem» 00:33; «einen Tag warten» 02:14, vom Beitrag, nicht von der Forscherin), Kennzeichnung von Ableitung und Erwartung, Ersatzquelle Stand April 2024, «giftige Weichmacher» | Firmenname im Titel der Ersatzkarte in den Lösungen (kommt aus der Karte; im Heft steht keiner) |
| Audit B ohne | 12 | Befund und Lösungsbild offen als Fallüberlegung, Annahme der Menge, Lieferant ≠ Produzierende, Beispielbild, `transfer` | — |
| Audit B mit | 13 | einheitliche Zeitmarken (03:39 · 03:42 · 05:28 · 06:50), Aussagen von 2014 gekennzeichnet, «Bild» ganz erschlossen, Ersatzquelle 01:23, Vertiefung 1 als Berichte | — |
| Sweep | Kleinigkeiten | «CHF 1'280» im Begleiter | «Fr.» in Zitaten aus Lehrmittel und Quelle; Minuten in den festen KN-Formaten |

**Runde 2** (alle sieben Lernenden, gleichzeitig, an den geänderten Seiten):
Kernkorrekturen bestätigt. Neu: Beispielbild von Heft A (Bild 3 ein Sparrat,
Bild 4 nicht ökonomisch), Schritt 03 von Heft A (graue Energie kommt aus LF1),
Markieren je Bild; in Heft B Schritt 02 (Bezug unklar), «begründen Rose und
Urteil» zu stark, Menge bei CHF 5, Zuordnung Zielkonflikt / fairer Handel,
Glossar «Gewinn» gegen die Formel. Alles in einer letzten kleinen Runde
behoben. **Runde 3** (sechs Heft-Leser, nur die geänderten Stellen): bestätigt;
danach nichts Sichtbares mehr geändert. Zuletzt gelesen: Runde 3.

**Offen nach drei Runden** (nicht mehr geändert):

- **Heft A, Beispielbild S. 6:** Bild 3 und 4 hängen nur über «So» und «Damit»
  am Standby; die Zahl 6500 statt 2000 Watt gilt pro Kopf für alles, nicht für
  Standby. Bild 4 («leben von der Substanz») ist ein Schluss aus Kap. 9.3
  S. 231, kein wörtlicher Beleg; Profil b versteht «Substanz» nicht. Ein
  sauberes Beispiel bräuchte einen anderen Gegenstand als den im Bauplan
  empfohlenen (Geräte im Standby).
- **Heft A, Schritt 03:** «graue Energie» ist ein Begriff, keine Folge — ob
  ein Bild 3 nur damit genügt, bleibt unscharf; bei Bild 4 fehlt der Hinweis,
  woher die Folge kommt.
- **Heft A und B, Markieren und Legende:** ein Zeichen je Bild; ein Satz mit
  Fakt und eigener Aussage bleibt uneindeutig. (Der Renderer zeichnet die
  Legende als gefüllten und leeren Kreis; im Textpaket der Gegenleser war das
  nicht sichtbar.)
- **Heft B, S. 4:** «mit 120 und mit 80» — warum 80 und ob für beide Preise,
  steht nicht da. **S. 5:** «gewichtet» im Indikator wird nicht erklärt.
  **S. 6:** Das Beispiel (Flohmarkt) belegt mit Kassenzettel und eigener
  Angabe, nicht mit Seite oder Zeitmarke, und rechnet nur mit allen 40 Karten.
- **Heft B ohne Medien, Schritt 02:** «Eine Rasterzeile zur Nachfrage darf
  dazukommen» läuft leer — Kap. 11.2 sagt nichts zur Nachfrage.
- **Auftragsbogen:** warum der Flug teurer wurde und der Zug nicht, ist ein
  Schluss mit dem Modell aus Heft B; für die Umweltfolge gibt die
  Angebotsübersicht keinen Beleg; die Stufentexte «neuer Fall», «Kosten»,
  «Grenzen» haben im Bogen keinen Schritt.
- **Beide Hefte:** Stufe 3 Punkte («auf einen neuen Fall übertragen») ist mit
  dem Heft-Produkt allein nicht erreichbar — gedeckt über den Transfer-Ast
  auf S. 8, den die Lernenden als unerklärt melden («gilt auch bei …»).

Zeitsummen der Lernenden (Schätzungen): Heft A mit Medien 138 Min. (a) und
247 Min. (b); Heft A ohne 175 Min.; Heft B ohne rund 200 Min.; Heft B mit
130 Min. (a) und rund 180 Min. (b); Auftragsbogen rund 50 Min. Heft A S. 7
(Storyboard und Aufnahme) und Heft B S. 7 (Text, Tausch, Antwort) sind die
teuersten Seiten.

Kein Gegenleser konnte prüfen: Bild der Videos, Seitenbild, Zeichen der
Legende.

## 8. Vor dem Druck gegensehen / prüfen

- **Alle vier Quellen-Videos:** die Spalte «Bild» jeder Rasterzeile (nur aus
  den Untertiteln erschlossen).
- **`q-321a-pflicht`:** Zeitmarken 00:12, 00:33, 01:11, 01:20, 01:35, 02:14,
  02:25, 02:49; wer bei 01:40 spricht.
- **`q-321a-pflicht-ersatz`:** 00:12, 00:42, 00:50–01:21, 01:38–02:01,
  02:03–02:21.
- **`q-321b-pflicht`:** ob 03:24 und 07:22 im Player des Segments stimmen;
  03:30, 03:39, 03:42, 04:09, 04:22, 05:00, 05:28, 06:50, 06:58; wer bei
  06:50 spricht (als «Händler» erschlossen).
- **`q-321b-pflicht-ersatz`:** 00:59, 01:23, 01:33–02:00, 02:15.
- **`q-321a-vertiefung-2`:** gegensehen; politischer Ausgang seit 30.03.2026.
- **Buch:** Kap. 11.2 S. 273 (ob der dritte Absatz der zur günstigen
  Produktion ist) und die Zwischentitel von Kap. 1.5 S. 39–41.
- **Papier:** S. 1, 6, 7 jedes Hefts (0 px Reserve); Legende auf S. 6.
- **Heft A S. 6:** das Beispielbild (siehe §7, offen).

## 9. Unbelegt, nicht geprüft

- Onlinehandel, Herstellung und Transport der bestellten Dinge (Heft A):
  keine Lehrmittelaussage; in den Lösungen als Fallüberlegung.
- Rosen, ihre Herkunft, Luftfracht, Preisrechnung (Heft B): Fallangaben und
  «Rechnung zum Fall»; dass die Rose für CHF 2.30 den Produzierenden einen
  fairen Preis sichert, ist eine gekennzeichnete Annahme.
- Dass der Zug weniger Folgen hat als der Flug, steht in keinem Kapitel und
  darum nicht im Auftrag; belegt ist nur Kap. 9.4 S. 236–237 zum Verkehr
  insgesamt. Warum der Flugpreis stieg: Fallüberlegung mit Kap. 2.7 S. 77.
- Die Zuordnung von Folgen zu den Dimensionen ist in beiden Spuren von Heft A
  Deutung der Lernenden (S. 40 nennt «ökologisch» und «ökonomisch», «sozial»
  nicht).
- Nicht geprüft: Bild der Videos, Play-Adressen auf dem Handy, Aussehen in
  Word, Workbench im Browser (kein Dev-Server in diesem Lauf), Inhalt der
  `lm-…`-Karten gegen die Kapitel.

## 10. Fehler in Skill, Skript, Renderer, Bestand (nicht repariert)

Neu in diesem Lauf:

- **`export-v42.mjs` setzt den Index voraus** («Einheit … nicht im Index»).
  Ein Executor kann vor `build:einheiten-index` nicht messen; die Meldung
  sagt nicht, was zu tun ist.
- **Karte `hko-storyboard`:** «6 bis 8 Bilder auf 1 bis 2 Minuten», «jedes
  Kästchen streichen, dessen Satz nichts Neues sagt», «auf ein A4-Blatt»,
  Beispiel mit vier Bildern — steht gegen die feste Vorgabe «sechs Bilder,
  60 bis 90 Sekunden, auf S. 7».
- **Karte `hko-gemeinsam-schreiben`:** setzt ein gemeinsames Dokument voraus
  («beide schreiben gleichzeitig», «kommentieren»); das Heft ist Papier.
- **Bauplan-Vorlage / Phase 1:** Ein Storyboard mit sechs Einträgen in einem
  Block passt nicht in das Budget des Beispielbilds (fünf); Begriffe über 25
  Zeichen passen nicht als Knoten.
- **Phase 5 / Bauplan §7 (Audit):** Das Kohärenz-Audit hat geprüft, ob das
  Raster füllbar ist, nicht, ob die Quelle trägt, **was das Produkt aus dem
  Raster machen soll** (hier: Herstellung und Transport als Grund des
  Preises). Genau das fanden erst die Gegenleser.
- **Archiv:** Die `quelle.md` dieser Einheit haben keinen Abschnitt «Text des
  Ausschnitts» (Text nach der ersten Trennlinie); mein Paket-Skript für die
  Gegenleser nahm das zuerst nicht auf. `gegenleser.md` §3 beschreibt nur die
  eine Form.
- **Skelett-Konstante «(Beispielwert)» / «→ hier ein Begriff aus LF1»** im
  Kartenbeispiel der Rezeptionskarte: beide Hefte schreiben «(erfundenes
  Beispiel)», weil frühere Leser die Konstante für einen Platzhalter hielten.
- **`check-v42`** meldet keinen der fünf Überläufe der Medien-Fassung (kein
  Budget für `erwartung`, `beispiel_pol_*`, LF3-Lösung als Ganzes).

Bekannt, hier wieder berührt: E30 in der Skill nicht nachgeführt; «zwei leere
Knoten» bei drei Feldern; `hko-quelle-raster` spricht ohne Medien von «sehen,
hören» und Zeitmarke; Merksätze von `lm-17-3-stellungnahme` («Titel als
Frage») und `lm-17-3-3b-schema`; `set-template.json` mit `produkte[].schritt`
als String; `bogen[2]` heisst `sprechspur`, obwohl A3 eine Fläche ist (der
Renderer setzt die Seite richtig); Bauplan-Vorlage ohne Feld «SK des
Auftrags»; Begleiter-Skelett ohne Ort für Lehrgänge, Geräte und «vor dem
Druck»; `check-lf-loesung` zählt UTF-16.

## 11. Arbeitsbaum und Commit

Während des Laufs kamen fremde Änderungen in den Arbeitsbaum, die nicht zu
dieser Einheit gehören und nicht im Commit sind: Renderer und Seiten
(`seiten-1-4.tsx`, `docx-heft-v42-1-4.ts`, `EinheitWorkbench.tsx`,
`[setKey].astro`, `index.astro`, `tracking.ts`, `neues-format.astro`,
`.gitignore`), zwei neue Methodenkarten, die Ordner
`3.1.1_konsum_verantworten_3j` und `3.3.1_kaufvertrag_beurteilen` (andere
Sessions). Das Schlusstor lief **mit** den geänderten Renderer-Dateien und
ist grün.

Der Index-Build im Arbeitsbaum enthält auch die zwei fremden, noch nicht
committeten Einheiten. In den Commit geht darum ein Index, der gegenüber dem
letzten Commit **nur** den Eintrag dieser Einheit ergänzt; danach ist der
Index im Arbeitsbaum wieder der volle.

Ein Commit «Einheit 3.2.1_konsumfolgen_beurteilen (bbw-hko-heft-v42)»: Ordner
der Einheit, die acht Karten `q-321a-*`/`q-321b-*`, dieser Bericht, die zwei
Index-Dateien. Kein Push, kein Deploy, kein Dev-Server. Die geänderte
Prompt-Datei `alle-bauplaene-seriell.md` ist nicht im Commit (sie ist im Repo
noch nicht eingecheckt).
