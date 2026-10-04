# Bericht — 4.2.1_risiken_absichern (bbw-hko-heft-v42, Auto-Modus, lokal)

Lauf vom 2026-10-04, Branch `v42-skill`, Modell Opus 5.5 als Orchestrator.
Bauplan: `docs/cloud-run/bauplaene/4.2.1_risiken_absichern.md` (freigegeben am
2026-10-04). Ergebnis: **grün**. Kein Lehrmittel-, Gesetzes- oder Quellentext in
diesem Bericht.

## 1. Einheit

| | |
|---|---|
| Ordner | `src/data/einheiten/4.2.1_risiken_absichern/` (sechs Dateien) |
| Titel | «Risiken absichern» · Modul 4.2 |
| Lehrgang | kanonisch EFZ_3J; `lehrgaenge` EFZ_3J und EFZ_4J (Lebensbezug 4.2 in beiden Datensätzen nummern- und textgleich, im Lauf am Datensatz nachgeprüft) |
| Heft A | 4.2.1 · «Meine erste eigene Police – welche Franchise wähle ich?» · beide Spuren |
| Heft B | 4.2.2 · «Ich bin doch versichert – wofür hafte ich trotzdem?» · beide Spuren |
| Auftrag | «Neu im Betrieb – was müssen die Neuen wissen?» (Merkblatt + Kurzerklärung) |
| KN | «Zwischen Lehre und neuer Stelle – was sichere ich ab?» |
| Karten | sieben `q-421a-*` / `q-421b-*` (aus Phase Q, im Lauf nicht geändert); A Vertiefung 2 offen |
| `status` | `entwurf` |

## 2. Tor (letzte Ausgaben, nach der letzten Änderung)

Reihenfolge wie im Prompt, alles nach Korrekturrunde 3:

- `npm run build:einheiten-index` → 24 Sets geschrieben (src + public/nrlp).
- `begleiter-marker.mjs … --check` → 279 Marker · 0 abweichend · 0 unauflösbar.
- `node scripts/check-all.mjs 4.2.1_risiken_absichern` → GRUEN, 0 Fehler,
  0 Warnungen (Ausgabe: `check-all.txt`).
- `export-v42` + `messen-v42` (Schreibschrift Segoe Print) → kein Überlauf auf
  keiner Seite (Ausgabe: `messung.txt`). Reserve 0 px: Heft A und B je S. 1,
  S. 7 (und Heft A S. 6), Auftragsbogen A2 und A3; A1 4 px, Heft B S. 8 4,2 px.
- `bestand-v42 --pruefen` → OK, 26 Dokumente unverändert.
- `npm run build` → Exit 0.
- `check-all` für 1.3.1_konsum_verantworten_v42, 2.3.1_anliegen_vertreten,
  2.1.1_informationen_hinterfragen → GRUEN.

Reparaturrunden am Tor: eine (Überlauf Seite 6, siehe §6 Nr. 4). `check-all`
war bei jedem Lauf grün.

## 3. Kapitel, Seiten, Quellen

Lehrmittel (alle Seiten am Marker der Kapiteldatei gelesen):

| Heft | Kapitel | Seiten | Wofür |
|---|---|---|---|
| A | 4.2 Kranken- und Unfallversicherung | 128–131 | LF1, LF2 (Schema S. 129), LF3 ohne Medien (S. 130–131), LF4 |
| A | 4.1 Versicherungswesen allgemein | 122, 126 | Solidaritätsprinzip, Plus (drei Ebenen) |
| B | 5.2 Haftpflichtversicherungen | 150–152 | LF1, LF2, LF3 und LF4 ohne Medien |
| B | 5.3 Verantwortung | 154–155 | Schritt 04, Glossar |
| B | 4.1 Versicherungswesen allgemein | 122, 126–127 | drei Ebenen, Übersicht der Versicherungsarten |
| Auftrag, KN | 4.2 | 129, 131–132 | Franchisestufen, Unfalldeckung über den Betrieb, Abrede |

Quellen (Karte und Archivtext vorhanden, alle mit Prüfdatum 2026-10-04):

| ID | Typ | Herausgeber · Datum | Ausschnitt (Archiv) |
|---|---|---|---|
| `q-421a-pflicht` | grafik | SRF Kassensturz Espresso · 2024-11-11 | Abs. 1–3 (Zahlen 2023, Herkunft Branchenverband) |
| `q-421a-pflicht-ersatz` | grafik | BAG · 2024-06 | Grafik G 7e (Zahlen 2022) |
| `q-421a-vertiefung-1` | webseite | BAG · o. D. | Abs. 7–20 |
| `q-421b-pflicht` | artikel | BFU · o. D. | Abs. 2–23 |
| `q-421b-pflicht-ersatz` | artikel | BFU · o. D. | Abs. 20–33 |
| `q-421b-vertiefung-1` | artikel | AXA · 2024-11-29 | Abs. 17–29 |
| `q-421b-vertiefung-2` | rechtstext | Fedlex · Stand SVG 2025-04-01 | Abs. 1–8 |

`q-421a-vertiefung-2` fehlt (Slot offen laut Bauplan §7): Heft A mit Medien
hat eine Vertiefung.

## 4. Abdeckung (kohaerenz.md §3)

| # | Befund | Lücke |
|---|---|---|
| A1 | Rezeption schriftlich und bildlich → A und B, S. 3 · Produktion schriftlich und bildlich → Auftrag A2 · Produktion mündlich → Auftrag A3 | Interaktion und Kollaboration mündlich nicht geführt (Sonderfall «mehr als zwei»); geübt in der Probe der Kurzerklärung |
| A2 | A und B führen Rezeption schriftlich und bildlich auf S. 3 | keine |
| A3 | entfällt (beide Hefte führen, was S. 3 übt) | keine |
| A4 | Merkblatt (`flaeche`, Schritt 4) · Kurzerklärung (`spur`, Schritt 5) | keine |
| A5 | 4.2.1 → Heft A · 4.2.2 → Heft B | ohne Medien liest Heft A keine Grafik (Tabelle S. 129 in LF2 trägt das Lesen einer Darstellung) |
| A6 | SK 5 → A, B, KN · 7 → B · 10 → A, KN · 11 → A, B, KN | für EFZ 4J bleiben SK 2, 3, 6 von T4 ohne Stelle |
| A7 | A: 10 → LF3, 11 → LF4/Schritt 04, 5 → Produkt · B: 7 → LF3, 11 → LF4, 5 → Produkt (`sk_anker`) | keine |
| A8 | A Vergleichstabelle mit Entscheid (Tabelle) · B Haftungs-Übersicht mit Massnahmen (Liste) · Auftrag Merkblatt + Kurzerklärung | keine |
| A9 | Persönliche Finanzen · Strassenverkehr · Lehrbetrieb · Übergang nach der Lehre | keine |
| A10 | A: Fachkorrektheit + Position / Werthaltung · B: Argumentation + Ethisches Prinzip · Auftrag alle vier (`regel6` grün) | keine |
| A11 | ohne Medien A `modell_eigener_fall` ≠ B `recht_praxis` · mit Medien A `lehrmittel_quelle` ≠ B `recht_praxis` | keine |
| A12 | beide Hefte beide Spuren; Quelle und Ersatzquelle je mit Karte und Archivtext | A Vertiefung 2 offen |
| A13 | «Interrail», «Stellenantritt», «Überbrückung» nur in Prinzip, KN, `kontext_ausschluss` und Begleiter §7 (`check-all` Fall-Ausschluss grün; von Hand nachgezählt) | keine |
| A14 | Modi des Auftrags gleich wie Gold (Ergebnis der Formel mit Sonderfall) · Produkttypen und SK anders | keine |

Selbstprüfung nach Phase 3 (phase-2-3 §3.7), alle dreizehn Zeilen bestanden:
Schlüsselmengen von `prinzip.json` und `kn.json` gleich den Skeletten ·
Szene 105 Wörter, endet mit der Leitfrage · Stufentexte 35–82 Zeichen ·
`modi_kn` = Vereinigung der drei Formen · `aktivierte_trade_offs` drei, alle
wörtlich aus dem Raum · kein Fall-Begriff in Rubrik, Konzepten oder Karten.
Stufe 3 von «Ethisches Prinzip» heisst «übertragen»: Beleg ist der
Transfer-Ast des Begriffsnetzes (S. 8).

## 5. Vergleich mit Gold (nur Kurzliste aus kohaerenz.md §4)

Fest (F1–F13): gleich — sechs Dateien, Template `heft_8page_v42`, vier
Leitfragen mit fester Funktion, fünf Schritte, Kriterien im KN-Wortlaut,
Begriffsnetz mit gleichem Zentrum in A und B, vier Seiten Auftragsbogen, drei
KN-Formen mit ihren Modi (`modi_kn` gleich wie Gold — Gerüst), Lösung zu jedem
Feld. Belege: `check-all` STRUKTUR, `regel1`–`regel9`, `messen-v42`.

| Hergeleitet | Gold 1.3.1 | 4.2.1 | Herleitung |
|---|---|---|---|
| H1 Modi A | Rezeption schriftlich und bildlich | Rezeption schriftlich und bildlich | Kompetenz 4.2.1 nennt nur diesen Modus |
| H1 Modi B | dasselbe + Interaktion mündlich | Rezeption schriftlich und bildlich | Kompetenz 4.2.2 nennt nur diesen Modus |
| H2 Auftrag | Produktion mündlich + schriftlich | Produktion schriftlich + mündlich | Formel ergibt drei, Regel wählt diese zwei; Lücke Interaktion |
| H3 SK | A 5·11·1 · B 2·6·11 · KN 5·11·6 | A 10·11·5 · B 7·11·5 · KN 5·11·10 | die vier SK von T4 (3J) |
| H4 Produkt A | kommentierte Karte (Liste) | Vergleichstabelle mit Entscheid (Tabelle) | Verb «ableiten», Schema S. 129 |
| H4 Produkt B | Tabelle mit Regeln + Gespräch | kommentierte Haftungs-Übersicht mit drei Massnahmen (Liste) | «Situationen erkennen», «Massnahmen ergreifen» |
| H5 Auftrag | Blatt + Sprachnachricht | Merkblatt + Kurzerklärung vor den Neuen | Produktion schriftlich / mündlich |
| H6 Quelle | — | A Grafik · B Artikel | Detail des Sprachmodus auf die Hefte verteilt |
| H7 Pol-Typ | — | A `modell_eigener_fall` / `lehrmittel_quelle` · B `recht_praxis` | Spannung der Hefte |
| H8 Aspekt | Wirtschaft | Ethik (R4), dazu Recht (R3) → «Ethisches Prinzip» | Datensatz, Regel «erste Kompetenz von A» |

Gleich mit Gold sind nur die Modi des Auftrags (begründet im Bauplan §8).

## 6. Entscheide im Lauf (auto-modus §4)

1. **Sperre wegen paralleler Sessions.** Index, `check-all`, Export, Messung,
   Bestand, Build und Commit waren gesperrt, bis 3.3.1 und 4.1.1 committet
   sind. 3.3.1 kam während der Schreibphase (`298fcc8`). Auf Pietros Nachfrage
   («muss du wirklich auf dem commit warten?») habe ich Index, `check-all`,
   Export, Messung und die Gegenleser vorgezogen; `npm run build`,
   `bestand-v42` und der Commit liefen erst nach dem Commit von 4.1.1
   (`e28208d`).
2. **Heft B, Abgaben:** Der Executor hatte eine dritte Abgabe ergänzt; der
   Bauplan legt zwei fest. Zurückgenommen (Belege und Satz an den Kollegen sind
   Teil der zwei Abgaben).
3. **Schritt-Labels gekürzt (Budget 30 Zeichen):** Heft A «02 Franchisen
   durchrechnen», «05 Tabelle prüfen»; Heft B «05 Übersicht prüfen». Der
   Bauplan-Wortlaut sprengt das Budget. Vertiefungsfrage 2 von Heft B gekürzt
   (Bauplan 101 > 100).
4. **Seite 6, Überlauf 49 px (A) und 66 px (B):** Ursache waren die langen
   Musterbeispiele der zwei angereicherten Karten (`hko-verzichten-abwaegen`,
   `hko-wirkungskette`), nicht das Beispielbild. Im Heft mit einer kürzeren
   Fassung überschrieben (`methoden[2].beispiel`, gleicher neutraler
   Gegenstand); die Karten sind unverändert. Diese und die letzte kleine Runde
   (§7, Runde 3) habe ich als Orchestrator selbst geschrieben, weil die
   Executors zweimal ohne Fortschritt abbrachen.
5. **Heft A:** Unfalldeckung im Kern entscheidbar gemacht (Aussage der
   Berufsbildnerin in der Situation; «in beiden Prämien enthalten» in Schritt
   02). Die Kostenfälle CHF 1'500 und CHF 5'000 stehen in der Situation (Rat
   der Mutter). Knoten «Reserve» heft-eigen. Lösungsbild entscheidet für
   CHF 300, der Hinweis nennt CHF 2'500 als ebenso gültig. `quellen_anker`
   Kap. 4.1 «Seite 122, 126» (S. 127 braucht Heft A nicht).
6. **Heft B:** Der Einwand für «Argumentation» ist ein Zitat eines Kollegen in
   der Situation. Marken-Regel: «zahle ich selbst» gilt auch, wenn nur ein Teil
   zurückkommt. LF4-Entscheid «worauf zuerst: absichern oder anders fahren» wird
   die erste Massnahme. Knoten «Motorfahrzeughaftpflicht» statt
   «Fahrlässigkeit». LF2 nennt als Anstösse «Velo, Sport, Geliehenes» — die
   Arbeit bewusst nicht (Haftung gegenüber dem Lehrbetrieb ist nicht belegt).
7. **Set:** Pensum als Fallzahl «rund 32 Stunden pro Woche». «Selbstbehalt» mit
   zwei Glossar-Einträgen (Krankenkasse in A, Motorfahrzeug in B). Leitfrage des
   Auftrags selbst formuliert (der Bauplan nennt keine). `heft_bezug` je zwei
   Einträge.
8. **Begleiter:** SK des Auftrags 7 · 11 · 5 (der Bauplan nennt keine); Block
   «Vor dem Druck gegenprüfen» in §5, technische Voraussetzungen in §2.
9. **`zirkularitaet`:** Ethik steht nach T4 in keinem weiteren Thema →
   `r2_voraussicht` und `r3_voraussicht` «—».
10. **KN:** Die Leitfrage sagt «für diese Zeit» statt einer Dauer; Mini Case
    Aufgabe 4 verlangt zwei Regeln.

## 7. Gegenleser (gegenleser.md §6)

Besetzung, gleichzeitig: Lernende/r Profil a an Heft A ohne, Heft A mit, Heft B
ohne, Heft B mit, Auftragsbogen; Profil b an Heft A mit und Heft B mit;
Lösungs-Audit Heft A und Heft B (je beide Spuren in einem Audit, wie in Lauf
331 — die Besetzung sieht vier vor); Sweep. Pakete mit `seitentext.mjs`, dazu
die genannten Lehrmittelseiten und der Archivausschnitt; nie Begleiter,
Lösungen, Bauplan.

**Paketfehler des Orchestrators:** In den vier Medien-Paketen der ersten
Runde fehlte der Text der Quellen (Zeilenenden der Archivdateien). Die vier
Lernenden an den Medien-Heften haben deshalb zweimal gelesen; aus dem ersten
Durchgang zählen nur Befunde, die nicht an der Quelle hängen.

| Gegenleser | Runde 1 | übernommen | nicht übernommen |
|---|---|---|---|
| Lernende a, Heft A ohne | 3 Stellen + 35 Hänger | Schritte 01/02, Unfalldeckung in der Prämie, Schritt 04 Satz für Satz, Belege aus dem Raster, Checkliste, Beispielbild in Ich-Form, Denkhilfe | Karten 1, 2, 4 (S), SuK/Ges und «Wortlaut Kompetenznachweis» (R), Glossar erst S. 8 (V), eine Fläche auf S. 7 (R) |
| Lernende a, Heft A mit | 3 Stellen + 27 Hänger | wie oben; erste Rasterspalte, Schwelle 2'000 gegen 1'500, Frage zur Offerte | «18 geworden» (V, Bauplan), Karte «Achsen» beim Kreisdiagramm (S), Grafik summiert auf 101 (Q) |
| Lernende b, Heft A mit | 3 Stellen, Wortliste | wie oben; «10 % der Kosten darüber», Formel der Kostenbeteiligung | unerklärte Wörter der Quelle und des Gerüsts (Q, R) |
| Lernende a, Heft B ohne | 3 Stellen + 30 Hänger | «Meine Versicherung …» in der Situation, drei Marken erklärt, Feldnamen, Satz an den Kollegen, LF3 auf die Motorfahrzeughaftpflicht begrenzt, LF4 mit Massstab, Beispielbild ohne Regress bei der Privathaftpflicht | Lehrmittel S. 150 gegen S. 151 (Stolperstein laut Bauplan), Karten (S) |
| Lernende a, Heft B mit | 3 Stellen + 38 Hänger | Leseauftrag «bis zum Ende des Abschnitts», LF3 «wer erhält trotzdem alles», LF4 mit genauen Absätzen, Plus und Karte «Wirkungskette» | QR-Adresse mit 4.2.1 (V, E21), doppelte Absatznummern zwischen Quellen (Artefakt des Pakets) |
| Lernende b, Heft B mit | 3 Stellen, Wortliste | wie oben | Sprache der Gesetzesartikel (Q), Stufentexte (V) |
| Lernende a, Auftragsbogen | 3 Stellen + 29 Hänger | «Eigenes Blatt (nicht abgeben)», Werkzeug in Schritt 02, Station 4 vorbereitet, A2 in drei Abschnitte, drei Indikatoren | Abgaben des Bogens gegen «Abgabe» der Hefte, kein Feld für die Schritte 01–03, «Zahlen \| Betrag» (R) |
| Audit Heft A | 9 Befunde, keiner «falsch» | alle 9 (Zwischenstufen genau, Transport nur bei Krankheit, Spitalbeitrag, Kennzeichnungen) | — |
| Audit Heft B | 12 Befunde, keiner «falsch» | alle (Ansprüche «einfordern können» statt «erhalten in jedem Fall», Glossar «Leistungskürzung» und «grobe Fahrlässigkeit», Kennzeichnungen, Fallzahl getrennt von der Fundstelle) | Herkunft «heft» für «Ablenkung» und «Selbstbehalt» (die Form kennt die Kennzeichnung nicht) |
| Sweep | 1 Hinweis | — | «Stufentexte» im Begleiter (Feldname) |

Beide Audits haben alle Rechnungen und Fundstellen bestätigt. Rechtlich
heikle Stellen sind sauber: Regress überall «darf/kann», die 20 Prozent als
Fallzahl, nichts aus Absätzen ausserhalb der Ausschnitte.

Weggefallen nach Nachprüfung: «Überbrückung steht nirgends» (Sweep — das Wort
steht in Prinzip, KN, `kontext_ausschluss` und Begleiter, also nur an
erlaubten Stellen); «✔ … ☐ doppelt» (Artefakt der Textaufbereitung);
«Kap. 17.1/17.3 fehlen im Paket» (so gewollt: nur die Karte); «Persona 17
gegen 18 geworden» (mein Rollenauftrag, nicht das Heft); alle Befunde «Quelle
leer» (Paketfehler).

**Runde 2** (alle sieben Lernenden an den geänderten Seiten, mit vollständigen
Paketen): Keine der sieben nennt eine Stelle, die am Arbeiten hindert. Je
Dokument sind vier bis sechs der geprüften Punkte behoben, der Rest
«teilweise». Neu aus den Änderungen: Beispiel S. 6 von Heft A sagte «ab 60»
bei Gleichstand in der Tabelle; «schulde ich ihr den Selbstbehalt» wieder
zweideutig; «was zuerst» ohne Ort im Produkt; Satz an den Kollegen in Schritt
und Abgabe verschieden benannt.
**Runde 3** (vierzehn Einzelzeilen in Heft A, Heft B und Set, vom
Orchestrator geschrieben; eine Leserin an den geänderten Zeilen statt aller
sieben): Von den vierzehn Zeilen sind neun «in Ordnung» (Beispiel «über 60»,
Indikator Fachkorrektheit, Situation von Heft B, Marken, Schritt 04 von
Heft B, Absatzangabe zur Höhe, Beispielzeile der Grafik-Karte, Schritt 03 von
Heft A ohne Medien, Satzanfang zur Quelle), fünf bleiben Hänger — sie stehen
unten als offen. Danach wurde nichts mehr geändert. Zuletzt gelesen: Runde 3.

**Offen nach drei Runden** (nicht mehr geändert):

- **Heft A mit Medien, S. 5 Schritt 03:** «Die Beispielzeile zählt nicht» —
  das Raster auf S. 3 hat in dieser Fassung keine Beispielzeile (der Schritt
  gilt für beide Fassungen). Der Zusatz läuft dort ins Leere; welche Zeilen
  Belege werden, steht richtig auf S. 3. **Eine Zeile, vor dem Druck
  anpassen.**
- **Heft A mit Medien, S. 4:** «Quelle: Schwelle rund 2'000, bei Ihnen 1'500.
  Beides stimmt: andere Prämien.» sagt nicht, Schwelle wovon
  (Behandlungskosten im Jahr).
- **Heft B mit Medien, S. 4:** «Wo «grob fahrlässig» beginnt, zeigt der Fall»
  — «der Fall» ist mehrdeutig (der eigene Unfall oder ein Fall der Quelle).
- **Heft B S. 5 Schritt 04:** Die Klammer «(vermeiden, vermindern, absichern)»
  liest sich als feste Reihenfolge, «die wichtigste zuerst» als Rangfolge.
- **Auftragsbogen A1, Schritt 03:** «dort» und «je ein Ding» sind vage; woher
  das dritte kommt, steht nicht da. **Schritt 05:** «Schluss: ein Satz in
  Ich-Form» nennt weder das Wichtigste noch den Grund, die A4 verlangt, und A3
  hat kein Feld dafür.

- **Heft B, «absichern»:** Der Pflichtteil gibt keine Idee, wie man sich gegen
  Regress oder Selbstbehalt absichert, wenn man schon versichert ist; das
  Lehrmittel nennt nur Privathaftpflicht und Bonusschutz, die Vertiefung 1
  (freiwillig, Versicherer) einen Zusatzbaustein.
- **Heft B ohne Medien, LF4:** «grob» fahrlässig ist im Lehrmittel nur mit
  Beispielen belegt, die Ablenkung durch das Handy ist keines. Die Lernenden
  messen den Fall an den Beispielen von S. 150 und an S. 155; mit Medien trägt
  die Quelle es.
- **Heft B S. 6:** Das Beispiel nennt einen Selbstbehalt bei der
  Privathaftpflicht als Fallangabe («laut Police»); das Lehrmittel kennt
  Selbstbehalte nur beim Motorfahrzeug, das Glossar ebenso.
- **Heft B S. 5/S. 7:** Wie die Marke gesetzt wird (Wort davor schreiben), sagt
  nur die Beschreibung oben auf S. 5; S. 7 ist eine leere Fläche.
- **Heft B S. 8:** «Meine Prüffragen: haftbar, gedeckt, Lücke?» (Bauplan) —
  die dritte Marke «zahle ich selbst» fehlt im Dreiklang.
- **Heft A S. 3 mit Medien:** Der Spaltenkopf «Was gemessen» (Bauplan) passt
  nicht zu einer Zeile, die einen Absatz zitiert; ob die Grafik mehrere Zeilen
  füllen darf, steht nicht da. Die Quelle sagt nur für die zwei Randstufen, für
  wen sie sich rechnen.
- **Heft A S. 6:** Karte `hko-verzichten-abwaegen` (Posten, Saldo) passt nur
  lose zu einem Entscheid zwischen zwei Franchisen; Karte `hko-gezielt-suchen`
  spricht von der Police, die Lernenden haben eine Offerte.
- **Heft A S. 4/S. 5:** Der Entscheid wird in LF4 und unter der Tabelle
  geschrieben (zweimal).
- **Beide Hefte S. 8:** Was ins Feld «gilt auch bei …» gehört, bleibt für
  Lernende offen (fester Text).
- **Auftragsbogen:** Die Schritte 01–03 haben kein Feld; «gedeckt» bei Material
  der Kundschaft lässt sich mit den Heften nicht ganz klären (belegt ist nur
  die Haftung des Arbeitgebers gegenüber Dritten).

Zeitsummen der Lernenden gegen den Seitenplan (Schätzungen): Heft A Profil a
115 Min. (ohne Medien) und 128 Min. (mit), Profil b 193 Min. in Runde 1 und
rund 93 Min. in Runde 2; Heft B Profil a 128 Min. (ohne) und 120 Min. (mit),
Profil b 175 Min.; Auftragsbogen 85 Min. in Runde 1, 41 Min. in Runde 2.

Kein Gegenleser konnte prüfen: das Bild der zwei Grafiken von Heft A (gelesen
wurden die Werte aus dem Archivtext), Seitenbild und Feldgrössen (die Messung
prüft nur Überlauf), die QR-Seite, die Absatzzählung auf dem Handy.

## 8. Vor dem Druck gegenprüfen

- **Franchise 300–2500, Selbstbehalt 10 %, höchstens CHF 700 («Stand 2026»):**
  Ob eine Erhöhung der Mindestfranchise beschlossen ist und ab wann sie gilt,
  ist nicht recherchiert.
- **KN:** Nachdeckung der Unfallversicherung und Abrede (Kap. 4.2, S. 131–132)
  sind nicht an einer amtlichen Quelle gegengelesen.
- **`q-421b-pflicht` und `-ersatz` (BFU):** Absatzzählung auf dem Handy (das
  Archiv zählt Titel, Zwischentitel und Aufzählungspunkte mit); ob die Seiten
  im Schulnetz ohne Cookie-Hinweis laden.
- **`q-421a-pflicht` und `-ersatz`:** Lesbarkeit der zwei Grafiken auf dem
  Handy; das PDF der Ersatzquelle hat rund 6,5 MB.
- **`q-421b-vertiefung-1`:** Text eines Versicherers mit Verkaufsabsicht
  (absichtlich gewählt); der Satz «kann bzw. muss» dort ist nicht die
  Rechtslage.
- **`q-421b-vertiefung-2`:** neuere Fassungen von SVG und VVG nicht geprüft.
- **Zeitplan:** `set.wochenplan` summiert zwölf Lektionen, der Lehrplan gibt
  dem Lebensbezug 4.2 neun (Begleiter §0 und §1 sagen es).

## 9. Unbelegt, nicht geprüft

- Mitversicherung über die Privathaftpflicht der Eltern; Haftung mit fremden
  oder gemieteten Fahrzeugen; Haftung Lernender gegenüber dem Lehrbetrieb;
  Stichtag für die Erwachsenenprämie: nicht im Lehrmittel. Das Heft sagt nur
  «in der eigenen Police nachsehen» bzw. «für das neue Jahr».
- Die drei Kostenfälle und der Gleichstand bei CHF 1'500 sind die Rechnung des
  Hefts (Fallzahlen); das Lehrmittel rechnet nur das «maximale Risiko».
- Dass die Unfalldeckung der Krankenkasse wegfallen kann, solange der Betrieb
  versichert, sagt S. 131 nicht ausdrücklich (als Fallüberlegung
  gekennzeichnet).
- Die 20 Prozent der Rückforderung sind die Zahl des erfundenen Schreibens.
- «Selbstbehalt» ist in Kap. 5.2 nicht definiert; «Regress = Rückgriff» setzt
  das Heft.
- Übertragung des Regresses auf Sport und Verein: als Deutung gekennzeichnet;
  S. 151 liest sich dazu anders als S. 150 (Bauplan §9).
- Vier Glossar-Begriffe mit Herkunft «quelle» stützen sich auf die Lösungen der
  Hefte; das Audit hat sie gegen den Archivtext gelesen.
- Nicht geprüft: Aussehen in Word (nur erzeugt), Arbeitsansicht und QR-Seite im
  Browser (kein Dev-Server in diesem Lauf), Seitenangaben der Karten
  `lm-17-1-sq3r` und `lm-17-3-3b-schema` am Kapitel.

## 10. Fehler in Skill, Skript, Renderer, Bestand (nicht repariert)

Neu in diesem Lauf:

- **Seite 6 hängt an den Musterbeispielen der angereicherten Karten:** Zwei
  angereicherte Karten mit fünfzeiligem `beispiel` in der unteren Reihe laufen
  über, gleich wie knapp das Beispielbild ist (hier 49 und 66 px). Kein Budget
  und keine Reference sagen das; der Bauplan wählt die Karten, ohne es zu
  wissen. Ausweg im Lauf: `beispiel` im Heft überschreiben.
- **Bauplan-Vorlage:** Schritt-Labels («02 Zwei Franchisen durchrechnen»,
  «05 … mit den zwei Kriterien prüfen») und eine Vertiefungsfrage überschreiten
  ihre Budgets; die Vorlage zählt sie nicht.
- **`set.wochenplan` ist eine Konstante (zwölf Lektionen)**, der Datensatz gibt
  dem Lebensbezug neun; kein Skript vergleicht.
- **Datenvertrag:** keine Regel für einen Glossarbegriff mit zwei Bedeutungen
  in A und B («Selbstbehalt»); `herkunft` kennt keine Kennzeichnung für eine
  heft-eigene Umschreibung eines Lehrmittelbegriffs.
- **`phase-7-set.md` §4.1** verlangt Stationen in Ich-Form; der Bauplan setzt
  zitierte Rede in Du-Plural. Kein Skript prüft die Form.
- **Karte `hko-verzichten-abwaegen`:** Schritte und Beispiel (Posten, kürzen,
  Saldo) passen nur zu einem Budget, nicht zu «was muss versichert sein».
- **Karte `hko-wirkungskette`:** Schritt 4 verlangt «Beleg mit Kapitel und
  Seite» — mit Medien sind es Absätze.
- **Karte `hko-grafik-lesen`:** spricht von Achsen; die Quelle ist ein
  Kreisdiagramm.
- **`check-einheiten`** endet ohne `set.json` mit «0 Befunde» und gibt bis
  Phase 7 kein Signal.
- **Archiv `q-421b-pflicht`:** Die Zählung schliesst Aufzählungspunkte ein und
  ist auf der Webseite kaum nachzuzählen.
- **Lehrmittel:** S. 150 nennt den Strassenverkehr als Kausalhaftung, die
  Tabelle S. 151 führt ihn nicht; S. 150 und S. 151 lesen sich zur groben
  Fahrlässigkeit verschieden.
- **Executors:** Fünf Opus-Subagenten brachen nach zehn Minuten ohne
  Fortschritt ab (zweimal beim Kürzen von Seite 6, dreimal zu Beginn der
  Korrekturrunde), drei weitere an einem Nutzungslimit. Fortsetzen mit
  kleinen Edit-Schritten und ohne eigene Messung lief durch.

Bekannt aus früheren Läufen, hier wieder berührt: E30 in der Skill nicht
nachgeführt; `tun` wird für `hko-`Karten nicht gedruckt; `hko-quelle-raster`
spricht ohne Medien von «sehen, hören» und «Zeitmarke»; `hko-gezielt-suchen`
druckt «nach zwanzig Minuten» und ein Beispiel mit Probezeit; Merksatz von
`lm-17-3-3b-schema`; kein Budget für `erwartung` und `beispiel_pol_*`;
`set-template.json` zeigt `produkte[].schritt` als String; Checkliste «Begriff
aus LF1» im Skelett gegen phase-5 §8; Begleiter-Skelett ohne Ort für «vor dem
Druck gegenprüfen», für technische Voraussetzungen und für «SK des Auftrags»;
jede Änderung an Heft oder Set nach Phase 8 verlangt einen neuen Lauf des
Marker-Skripts (hier viermal: 23, 0, 30, 6 Marker neu gefüllt); der Bogen hat
für Schritte ohne Produkt kein Feld; Renderer druckt «Zahlen | Betrag»,
«SuK/Ges» und «Wortlaut Kompetenznachweis» ohne Erklärung, «Ende Ziel …
Probelauf» bei Form `spur`; die Leck-Prüfung läuft nur in `check-all`.

Bestand und Arbeitsbaum: Im Arbeitsbaum liegen fremde, uncommittete Änderungen
(Skill, `scripts/check-v42.mjs`, Renderer, die Einheiten 2.1.1 und 2.3.1,
`hko-quelle-raster.json`, weitere Baupläne). Sie sind nicht angefasst und
nicht im Commit; Messung und Build liefen mit ihnen. Der Index wurde in diesem
Lauf dreimal neu gebaut, während eine andere Session an 4.1.1 schrieb; der
letzte Lauf liegt nach deren Commit.

## 11. Commit

Ein Commit «Einheit 4.2.1_risiken_absichern (bbw-hko-heft-v42)»: Ordner der
Einheit, die sieben Karten `q-421a-*`/`q-421b-*`, dieser Bericht mit
`check-all.txt` und `messung.txt`. Die zwei Index-Dateien sind gestagt, aber
gegenüber dem Commit von 4.1.1 unverändert: Jener Commit enthielt den Eintrag
dieser Einheit bereits. Der Bauplan bleibt wie bei den früheren Läufen
ausserhalb des Commits. Kein Push.
