# Bericht — 4.1.1_wohlbefinden_staerken (bbw-hko-heft-v42, Auto-Modus, lokal)

Lauf vom 2026-10-04, lokal, Branch `v42-skill`, aus dem Prompt
`docs/cloud-run/prompts/einheit-aus-bauplan-lokal.md` mit den Abweichungen aus
`alle-bauplaene-seriell.md` §3 und §4 (eine Einheit, kein Loop; Agenten
gleichzeitig, wo sie sich nicht stören). Bauplan:
`docs/cloud-run/bauplaene/4.1.1_wohlbefinden_staerken.md`, freigegeben am
2026-10-04. Kein Lehrmittel-, Untertitel- oder Artikeltext in dieser Datei.

Im selben Arbeitsbaum liefen zwei weitere Sessions (`3.3.1_kaufvertrag_beurteilen`,
`4.2.1_risiken_absichern`). Ihre Ordner, Karten, Berichte und Methodenkarten
sind nicht angefasst. Bis zum Commit von 3.3.1 liefen hier weder Index noch
Messung noch Build; die Hefte wurden in dieser Zeit knapp geschrieben (Richtwert
85 % der Budgets) und erst danach gemessen.

**Ergebnis: grün.**

## 1. Einheit

| | |
|---|---|
| Ordner | `src/data/einheiten/4.1.1_wohlbefinden_staerken/` (sechs Dateien) |
| Lehrgang | EFZ_3J kanonisch; `lehrgaenge` EFZ_3J und EFZ_4J (Lebensbezug 4.1 in beiden Datensätzen nummern- und textgleich; `check-all` nRLP-Abgleich ok) |
| Heft A | 4.1.1 · «Alle zeigen sich perfekt – und wer bin ich?» · strukturierte Notiz nach einem Gespräch zu zweit über Erwartungen · beide Spuren |
| Heft B | 4.1.2 · «Was die Umfrage zeigt – und was ich daraus mache» · Auswertung einer Umfrage als Tabelle mit Balken und zwei begründeten Massnahmen · beide Spuren |
| Auftrag | «30 Tage ohne Ruhetag – mache ich mit?» · Verein und Freizeit · A2 kommentierter Aushang (`flaeche`), A3 Statement vor der Gruppe (`spur`) |
| KN | «Samstag am Marktstand – und wann erhole ich mich?» · Familie · Kriterien Fachkorrektheit, Argumentation, Identitätskonstrukt, Position / Werthaltung |
| Status | `entwurf` |
| Quellenkarten | acht, `q-411a-*` und `q-411b-*` — in Phase Q angelegt, in diesem Lauf nicht verändert, mit diesem Commit erstmals eingecheckt |

## 2. Tor (letzte Ausgaben, nach der letzten Änderung)

```
build:einheiten-index    einheiten.index.json: 24 sets written (src + public/nrlp)
begleiter-marker --check 283 Marker · 0 abweichend · 0 unaufloesbar · nichts geschrieben
check-all 4.1.1_wohlbefinden_staerken
  ok  Struktur · Status · Methoden · Sprache · Leck  0 Fehler, 0 Warnungen
  ok  nRLP-Abgleich (Kompetenz-/Lebensbezugstexte, Lehrgaenge)
  ok  Kopplung · Autarkie · Begleiter-Marker
  ok  Leitfragen-Loesungen
  ok  Heft v4.x (Budgets, Spuren, Quellen)
  GRUEN — keine Fehler.
export-v42 + messen-v42  Exit 0 — 56 Seiten ok, kein Überlauf
                         (Auftragsbogen 4 · vier Hefte je 8 · vier Lösungen je 5);
                         Schreibschrift Segoe Print
bestand-v42 --pruefen    OK — 26 Dokumente unverändert.
npm run build            Exit 0
check-all 1.3.1_konsum_verantworten_v42 2.3.1_anliegen_vertreten
          2.1.1_informationen_hinterfragen   GRUEN — keine Fehler.
```

Reserve 0 px (voll, kein Überlauf): je Heft S. 1, 6, 7; Auftragsbogen A2, A3.
Knapp: Lösungen Heft B mit Medien S. 3 (8.7 px).

**Reparatur vor dem Gegenlesen (Messung):** Die erste Messung meldete einen
Überlauf — Lösungen Heft B mit Medien S. 3 (28.6 px). Behoben in den Daten in
zwei Schritten (zwei `erwartung`-Texte der Vertiefungen und zwei Halbsätze der
Beispielantworten zu LF4 gekürzt; vom Orchestrator selbst). Hefte und
Auftragsbogen waren von Anfang an ohne Überlauf.

Index: `build:einheiten-index` schreibt 24 Sets, darunter die noch nicht
committete Einheit `4.2.1_risiken_absichern` der anderen Session. Die zwei
Index-Dateien dieses Commits enthalten darum deren Eintrag; das heilt der
Commit jener Session.

## 3. Kapitel, Seiten, Quellen

| Heft | Leitfrage | Fundstelle |
|---|---|---|
| A | LF1 | Kap. 18.1 S. 412 (zwei Teile der Identität, Rolle, Selbstwert) · Kap. 18.2 S. 413–414 (Wert, Norm, Sanktion) |
| A | LF2 | Kap. 18.2 S. 417 (Schaubild, nur die Kette Wert → Norm → Verhalten) und S. 414 · eigener Fall |
| A | LF3 ohne Medien | Kap. 18.2 S. 413–414 (bis vor «Moral»; Absätze je Seite an der Kapiteldatei gezählt) |
| A | LF3 mit Medien | Quelle `q-411a-pflicht`, Antworten 1–4 (Abs. 6–16) |
| A | LF4 | ohne Medien `modell_eigener_fall` (Kap. 18.1 S. 412 ↔ Fall) · mit Medien `lehrmittel_quelle` (Kap. 18.2 S. 414 ↔ Quelle) |
| B | LF1 | Kap. 4.3 S. 133–136 (drei Bereiche; Merkmale eines gesunden Lebensstils als Ableitung gekennzeichnet) |
| B | LF2 | Kap. 4.3 S. 136 (Tabelle Belastungen und Reaktionen) · Fallzahlen |
| B | LF3 ohne Medien | Kap. 4.3 S. 136–137 |
| B | LF3 mit Medien | Quelle `q-411b-pflicht`, PDF-S. 16–17 (zwei Absätze, Fussnote 1, Grafik G14) |
| B | LF4 | beide Spuren `position_gegenposition` (zwei Haltungen im Fall; Kap. 4.3 S. 133, 136–137) |
| B | Stütze Schritt 05 | Kap. 18.4 S. 421 (kleine Teilziele; als Übertragung gekennzeichnet) |

| Slot | ID | Typ · Titel (gedruckt) · Herausgeber · Datum | Ausschnitt | geprüft am | Zugeständnis |
|---|---|---|---|---|---|
| A Quelle | `q-411a-pflicht` | Artikel · «Schönheitsdruck durch Social Media: Mädchen stärker betroffen» · SRF News · 2025-12-05 | Abs. 6–16 | 2026-10-04 (Phase Q), Lösung am Archivtext 2026-10-04 | Ausschnitt; Thema Aussehen; stellt Mädchen und Jungen gegenüber; Befragung von 12- bis 19-Jährigen |
| A Ersatz | `q-411a-pflicht-ersatz` | Artikel · «JAMESfocus-Bericht: Schönheitsideale auf sozialen Netzwerken» · Swisscom / ZHAW · 2025-12-05 | Abs. 1–5 | wie oben | dieselbe Studie wie die Quelle; Medienmitteilung; Fachwörter |
| A Vertiefung 1 | `q-411a-vertiefung-1` | Artikel · «Schönheit auf Social Media: Wenn Perfektion zur Norm wird» · SRF Wissen · 2025-04-25 | Abs. 1–5, 11, 18–20 | wie oben | nicht zusammenhängende Teile; der Mittelteil der Seite liegt ausserhalb und ist heikel |
| A Vertiefung 2 | `q-411a-vertiefung-2` | Video · «Schönheitsideale auf Social Media» · SRF 10 vor 10 · 2024-05-09 | 05:05–06:10 | wie oben | nur Untertitel gelesen; der Teil davor ist heikel; Player stoppt nicht |
| B Quelle | `q-411b-pflicht` | Grafik · «Gesundheitsbefragung 2022: Körperliche Aktivität und Sitzdauer» · BFS · 2023 | PDF-S. 16–17 | wie oben | Erhebung 2022; PDF; trägt nur Bewegung und Sitzen |
| B Ersatz | `q-411b-pflicht-ersatz` | Artikel · «Studie: Grossteil der Schweizer Bevölkerung hat Schlafprobleme» · SRF News / SDA · 2025-09-04 | Abs. 1–13 | wie oben | anderer Typ, anderes Merkmal; Auftrag einer Krankenkasse; 18–35 Jahre |
| B Vertiefung 1 | `q-411b-vertiefung-1` | Artikel · «Was Jugendlichen bei Stress und Belastung hilft» · SRF News · 2026-05-08 | Abs. 18–24, 33–42 | wie oben | zwei Teile; Kasten am Schluss ausserhalb |
| B Vertiefung 2 | `q-411b-vertiefung-2` | Video · «Puls kompakt: Vier Tipps für einen besseren Schlaf» · SRF Puls · 2022-03-28 | 00:00–02:07 | wie oben | nur Untertitel gelesen; Titel der Tipps nur im Bild |

## 4. Abdeckung (kohaerenz.md §3)

| # | Befund | Lücke |
|---|---|---|
| A1 | Rezeption schriftlich und bildlich: Auftrag A2 (dazu S. 3 beider Hefte, geübt) · Produktion mündlich: Auftrag A3 · Interaktion und Kollaboration mündlich: Heft A, Gespräch · Produktion schriftlich und bildlich: Heft A Notiz, Heft B Auswertung | keine |
| A2 | A: Interaktion mündlich → Gespräch zu zweit (Abgabe «Aussage des Gegenübers»); Produktion schriftlich → Notiz S. 7 · B: Produktion schriftlich und bildlich → Tabelle mit Balken und Massnahmen | keine |
| A3 | S. 3 beider Hefte, beide Spuren: Rezeption schriftlich und bildlich geübt, nicht geführt · Vertiefung 2 je Heft (Video): freiwillig geübt | keine |
| A4 | Rezeption schriftlich und bildlich → Produkt 1 (`flaeche`, Schritt 3) · Produktion mündlich → Produkt 2 (`spur`, Schritt 5) | keine |
| A5 | 4.1.1 in A, 4.1.2 in B geführt | keine |
| A6 | SK 5: A, B, KN · 7: A, KN · 10: B · 11: A, B, KN | 3J keine; 4J: SK 2, 3, 6 trägt die Einheit nicht (Begleiter §0 sagt es) |
| A7 | A: 11 → LF3 · 5 → LF4 und Schritt 04 · 7 → Produkt — B: 10 → LF3 · 11 → LF4 und Schritt 04 · 5 → Produkt | SK 10 in Heft B hängt an einer Deutung von LF3 (Bauplan §8) |
| A8 | Notiz nach Gespräch (Liste + Wechselrede) · Auswertung (Tabelle + Liste) · kommentierter Aushang (`flaeche`) · Statement (`spur`) | keine |
| A9 | Freundeskreis und soziale Medien · Lehrbetrieb · Verein und Freizeit · Familie | keine |
| A10 | A: Fachkorrektheit + Identitätskonstrukt · B: Argumentation + Position / Werthaltung · Auftrag: alle vier | keine |
| A11 | ohne Medien: A `modell_eigener_fall` ≠ B `position_gegenposition` · mit Medien: A `lehrmittel_quelle` ≠ B `position_gegenposition` | keine |
| A12 | beide Hefte beide Spuren; Karte und Archivtext für alle acht Slots vorhanden | keine |
| A13 | Fall-Begriffe: `check-v42` ohne Befund (`ERR_V42_R9_FALL`); in den Paketen der Gegenleser kein Treffer | keine |
| A14 | siehe §5 | keine |

Ausserhalb der vierzehn Zeilen (Bauplan §8): «Sucht und Hilfsangebote,
Prävention» ist nicht Stoff der Hefte; «Prävention» steht entgegen dem
Vorschlag des Bauplans **nicht** im Glossar (kein Knoten in Heft B;
`regelGlossar` lässt Einträge ohne `spur` nur für Knoten zu). Der Begleiter
nennt die Lücke und die Fundstellen der Anlaufstellen.

Prinzip, Hefte und Set tragen dieselben Werte: `kn_kriterien_verteilung`,
`pol_typ_verteilung`, `mindmap_zentrum_kurz` («Eigene Wahl oder Einfluss des
Umfelds»), `auftrag_lebensbereich`, `modi_pro_heft` = `nrlp.sprachmodi`
(am Datensatz der Dateien nachgesehen und `check-all` Kopplung).

Selbstprüfung nach Phase 3 (phase-2-3 §3.7), alle dreizehn Zeilen bestanden:
Schlüsselmenge beider Dateien = Skelett; Szene 103 Wörter, endet mit der
Leitfrage; `modi_kn` = Vereinigung der drei Formen; drei aktivierte
Spannungsfelder wörtlich aus `trade_off_raum`; vier Kriterien 2 + 2, Stufen
32–83 Zeichen; kein Fall-Begriff in einem Stufentext; Zählwörter ohne Treffer
ausser den festen.

## 5. Vergleich mit Gold (nur Kurzliste aus kohaerenz.md §4)

**Fest (F1–F13):** gleich — sechs Dateien; Template `heft_8page_v42`, acht
Seiten je Heft (Messung); Kern einmal, Spuren nur das Abweichende (`regel1`,
`regel4`); vier Leitfragen K2/K3/K4/K4; fünf Schritte mit `liefert`; Kriterien
im Wortlaut des KN (`regel6`); Begriffsnetz mit gleichem Zentrum und
Transfer-Ast (`regel7`, `regelGlossar`: 28 Einträge); Abschluss 2 + 3 + 4;
Auftrag mit fünf Schritten, zwei Produkten, vier Seiten; KN mit drei Formen
und ihren Modi (`modi_kn` gleich wie Gold — Gerüst, kein Befund); Lösung zu
jedem Feld (`check-lf-loesung`: 16 Leitfragen, kein Befund); Benennung nach
E21; Sprache (Sweep, §7).

**Hergeleitet (H1–H9):**

| | Gold 1.3.1 | 4.1.1 Wohlbefinden | Herleitung |
|---|---|---|---|
| Modi A | Rezeption schriftlich | Interaktion mündlich · Produktion schriftlich | Kompetenz-Ebene 4.1.1 |
| Modi B | Rezeption schriftlich · Interaktion mündlich | Produktion schriftlich und bildlich | Kompetenz-Ebene 4.1.2 |
| Modi Auftrag | Produktion mündlich · Produktion schriftlich | Rezeption schriftlich · Produktion mündlich | `modi_kn − (A ∪ B)`, kein Sonderfall |
| SK A / B / KN | 5·11·1 / 2·6·11 / 5·11·6 | 11·5·7 / 10·11·5 / 5·11·7 | vier SK von T4 (3J), gemeinsame 5 und 11 |
| Produkt A | kommentierte Karte (Liste) | Notiz nach Gespräch (Liste + Wechselrede) | `detail` «Gespräche führen …», «strukturierte Notiz» |
| Produkt B | Tabelle mit Regeln + Gespräch | Auswertung einer Umfrage (Tabelle mit Balken + Liste) | `detail` «Umfrage auswerten»; Verben auswerten, ableiten |
| Auftrag | Blatt + Sprachnachricht | kommentierter Aushang + Statement | Rezeptionsmodus → Auswertung eines Dokuments in der Situation; Produktion mündlich → Statement |
| Quelle A / B | — | Artikel / Grafik mit Begleittext | Modus des Themas (geübt, nicht geführt); B: «Umfrage auswerten» |
| Pol-Typ | — | A `modell_eigener_fall` / `lehrmittel_quelle` · B `position_gegenposition` | Modell des Lehrmittels gegen Fall bzw. Quelle; zwei Haltungen im Fall |
| Aspekte, drittes Kriterium | — | Identität und Sozialisation R3 · Ethik R4; «Identitätskonstrukt» | Datensatz 3J, Thema T4 |

Modi des Auftrags, Produkttypen und SK-Verteilung sind verschieden von Gold;
SK 5 und 11 kommen in beiden vor, weil sie zu den vier SK von T4 gehören.

## 6. Entscheide im Lauf (auto-modus §4)

1. **Bericht 331 lag beim Start nicht vor.** Die Executors bekamen von Anfang
   an die Lehren aus den Berichten 221, 321 und 311; 331 erschien während der
   Schreibphase und ging in Set, Begleiter und die Korrekturrunden ein
   (Abgaben gegen Checkliste, Länge der `erwartung`-Texte, breite Tabelle im
   Beispielbild, Marker im Begleiter).
2. **Gegenleser vor dem vollständigen Tor gestartet.** Die Messung der Hefte
   und des Auftragsbogens war ohne Überlauf, der Begleiter (der den Hefttext
   nicht berührt) wurde gleichzeitig geschrieben. `check-all` lief, sobald er
   stand, und war grün, bevor ein Befund zum Auftrag wurde.
3. **Zwei Lösungs-Audits statt vier** (je Heft eines über beide Spuren und den
   Kern) — der Kern wäre sonst doppelt geprüft worden. **Runde 3 mit fünf
   statt sieben Lernenden** (jedes Dokument, beide Profile): Die Änderungen
   der Runde 2 waren in beiden Fassungen eines Hefts dieselben Zeilen.
4. **`prinzip.quellen_anker`** führt Kap. 18.4 S. 421, weil Heft B eine
   Aussage daraus bezieht (nicht nur eine Methodenkarte); Kap. 18.2 mit zwei
   Einträgen (S. 413–414 und S. 417). `zirkularitaet`: dominanter Aspekt
   Identität und Sozialisation, T4 = R3; Voraussicht T6 und T8.
5. **KN:** Leitfrage der Szene benennt beide Pole («Halte ich mich weiter an
   die Regel meiner Familie, oder sorge ich für meine Erholung – und was sage
   ich wem?»). Stufentexte bewusst kurz (höchstens 83 Zeichen), damit A4 des
   Auftragsbogens nicht überläuft (Lehre aus Lauf 221). Fragen und Aufgaben
   sprechen von «der Person» im Fall; `definition_lang` hält fest, dass die
   Analyse bewertet wird, nie Familie oder Lebensweise der Lernenden.
6. **Heft A:** sechs Einträge verteilt als drei · zwei · eine Erkenntnis,
   dazu der Entscheid; LF2 fragt zusätzlich, was die Person von sich selbst
   erwartet (sonst gäbe es keinen Eintrag `eigen`); die Notiz entsteht erst in
   Schritt 05; Situation ergänzt um «niemand hat je gesagt, dass man das
   muss», eine Frist (Samstag) und drei Angaben in `zahlen_tabelle`; mit
   Medien notieren Lernende «Antwort 1–4» in der Spalte «Absatz» (die Website
   zeigt keine Absatznummern); «→ Umfeld» aus dem Kohärenz-Audit des Bauplans
   ist durch Begriffe aus LF1 und Glossar ersetzt; `tun` auch bei
   `hko-stille-aushalten` (der Impuls gilt dem Fall); Schritt-Labels gekürzt.
7. **Heft B:** Balken «4 cm = 100 %, 2 mm je Person»; S. 7 in drei Teilen
   (Tabelle, zwei Massnahmen, Entscheid); der Verzicht steht einmal im
   Entscheid; **Abgabe 3 lautet «Entscheid in zwei Sätzen: Antwort auf den
   Einwand, Verzicht» statt «ein Satz, worauf ich dafür verzichte»** — das
   Kriterium Argumentation verlangt den Einwand im Produkt (Formulierung
   innerhalb des Entscheids, auto-modus §3); Rasterspalte 1 ohne Medien
   «Seite» (Bauplan §7; der Datenvertrag nennt «Absatz»); Vertiefungsfragen
   enden auf «zum Fall» statt «für mich» (keine Selbstauskunft);
   `quellen_anker` so gereiht, dass der Kopf von S. 3 ohne Medien die
   richtigen Stichworte zeigt (auf S. 1 steht darum S. 136–137 vor S. 133–135).
8. **Set:** `heft_bezug` Heft B, zweiter Eintrag «Belastungen und Reaktionen
   aus LF2 (S. 2)» statt des Vorschlags «Belastungen und Strategien (S. 3)»,
   der mit Medien nicht stimmt; «Prävention» nicht im Glossar (§4);
   `herkunft: "heft"` für Selbstbild, Fremdbild, Erwartung, Eigener Massstab,
   Befund, Massnahme; Schritt 04 ohne eigenes Feld (ein Satz unter dem Aushang
   auf A2); Schritt-Labels gekürzt; `situation_text` 581 Zeichen mit allen
   vier Regeln.
9. **Begleiter:** SK des Auftrags 5 · 11 · 7 (der Bauplan nennt keine);
   «Wenn es persönlich wird» mit allen neun Aussagen als Block am Ende von §0;
   Blöcke «Was die Einheit nicht abdeckt» und «Vor dem Druck gegenhören und
   gegensehen»; Überschrift von §3 gekürzt (das volle Label löste
   `WARN_BEGLEITER_KOPIE_OHNE_MARKER` aus).
10. **Klarstellung «Person im Fall»** (Korrekturrunde 1, in beiden Heften auf
    S. 2 und auf A1 des Auftragsbogens): «Im Fall spricht eine erfundene
    Person in Ich-Form. Sie antworten für diese Person» — nicht im Bauplan
    vorgesehen, aus dem Befund von sechs der sieben Lernenden.

## 7. Gegenleser (gegenleser.md §6)

Besetzung, gleichzeitig: Lernende/r Profil a an Heft A ohne, Heft A mit,
Heft B ohne, Heft B mit, Auftragsbogen; Profil b an Heft A mit und Heft B mit;
Lösungs-Audit Heft A und Heft B (je beide Spuren); Sweep. Pakete mit
`seitentext.mjs`, dazu die genannten Lehrmittelseiten und der Text der Quelle;
nie Begleiter, Lösungen, Bauplan. Rolle: 2. Lehrjahr (die Einheit liegt in T4).
Zusatzfrage wegen des Themas: jede Stelle, an der etwas über sich selbst
preiszugeben wäre.

**Paketfehler in Runde 1:** Im Paket für Heft B mit Medien fehlte der Text der
Quelle (das Paket-Skript fand in dieser Archivdatei den Textteil nicht).
Bemerkt von der ersten Leserin, Paket korrigiert; beide Lernenden haben S. 3
und S. 4 mit Quellentext nachgelesen.

| Gegenleser | Runde 1 | übernommen | nicht übernommen |
|---|---|---|---|
| Lernende a, Heft A ohne | 3 Stellen + Hänger | «Person im Fall» (S. 1, 2, 4, 8), Schritt 03 und «Ins Produkt» LF3 (Sprung vom Raster zur Wirkung auf das Selbstbild), Plus als allgemeines Beispiel | Markierung «nicht sichtbar» (Artefakt: im Heft ein Zeichen je Eintrag); «So starten Sie» gegen Quer-Check (S); ein Schreibfeld auf S. 7 (R); Gesamtzeit steht nirgends (V) |
| Lernende a, Heft A mit | 3 Stellen + Hänger | Spalte «Absatz» = Nummer der Antwort; Brücke «Körperbild» → Selbstbild; `tun` der Vier-Ohren-Karte (Wiedergabe erst am Schluss), Wechselrede in Beispiel- und Lösungsbild angepasst | Quelle spricht von Mädchen (Q, Zugeständnis im Bauplan); SuK/Ges (R) |
| Lernende b, Heft A mit | 3 Stellen, Wortliste | wie oben | Wörter der Quelle und des Lehrmittels (Q); Stufentexte (KN-Wortlaut) |
| Lernende a, Heft B ohne | 3 Stellen + Hänger | «Befund je Zeile» gegen «Ableitung zum Raster» eindeutig; «Person im Fall»; Kachel-Karte über `fuer` («kein Foto, Bild = Balken»); Kopf S. 3; vier Bereiche S. 137 gegen drei Bereiche; Zeile ohne Belastung erlaubt | «Das geben Sie ab» nennt Raster und LF1 nicht, die Checkliste schon (V, Abgaben sind Bauplan) |
| Lernende a und b, Heft B mit (mit Nachlese) | je 3 Stellen | Stellen der Quelle so beschrieben, wie sie im PDF stehen; Fundstelle bei «Was gemessen»; LF4-Strategie nennt, woher Belege für Schlaf, Essen, Druck kommen, und den Einwand; Vergleich Umfrage ↔ Quelle als ungleich gemessen gekennzeichnet; Merksätze der Karten im `tun` aufgelöst | Quelle trägt nur Bewegung und Sitzen (Q, Bauplan); Becher-Beispiel der Kachel rechnet nicht (S, Kartentext); QR-Adresse mit 4.1.1 (V, E21) |
| Lernende a, Auftragsbogen | 3 Stellen | Schritte 01/02 als Vorarbeit, Schritt 03 nennt den Inhalt des Randkommentars; «Erwartung» statt «Norm»; «Sie antworten für sie, nicht über sich»; Indikatoren an die Schritte angepasst | Stationen 2 und 3 setzen eine geänderte Regel voraus (V, Bauplan wörtlich; Begleiter gibt einen Vorschlag); «Folgen aufgenommen», «neue Situation» bei 3 Punkten (V) |
| Audit Heft A | 12 Befunde, keiner «falsch» | alle 12 (zwei Belege im Lösungsbild, «eigener Massstab», S. 413 Abs. 6, Ersatzquelle nur für eines der Ideale, Fallangaben gekennzeichnet, Vertiefung 2, fünf Deutungen gekennzeichnet) | — |
| Audit Heft B | 9 Befunde, keiner «falsch» | alle 9 (LF1, Begriffsnetz, erfundene Fundstelle der Karte, «über dem Schnitt», Erhebungsjahr, Alter ausserhalb des Ausschnitts, drei Deutungen gekennzeichnet) | — |
| Sweep (Endstand, nach Runde 2) | kein Regelverstoss | — | «Spur» in `methoden[1].fuer` beider Hefte ist der feste Wert des Platzhalters `__spur__`, den der Renderer ersetzt (V); «Woche» nur als Alltagszeit im Fall («unter der Woche», «pro Woche»), keine Unterrichtswoche (V); du-Formen nur in zitierter Rede und Wechselreden (V) |

Beide Audits bestätigen: alle Seiten-, Absatz- und Zeitangaben, alle Zahlen
und Rechnungen stimmen; nichts liegt ausserhalb der Ausschnitte; ohne Medien
steht in Heft A keine Fachaussage über soziale Medien und in Heft B keine Zahl
dazu, wie viel Schlaf oder Bewegung gesund ist; keine Stolperstein-Stelle der
Kapitel kommt vor.

**Runde 2** (alle sieben Lernenden an den geänderten Seiten): Fünf nennen
keine Stelle mehr, die am Arbeiten hindert; alle sieben sagen, es sei jetzt
klar, dass sie für die Person im Fall antworten und nichts über sich
preisgeben müssen. Neu aus den Änderungen: Schritt 03 von Heft A gegen die
Rasterspalten, «Ich» im Produktabsatz, Beginn des Gesprächs; in Heft B
«zwei Zeilen zum Ansetzen», «Befund je Zeile» doppelt, restliche
Absatznummern, «Lernziele» statt «Teilziele», Übersicht Teil 2, Beispiel der
Grafik-Karte ohne Fundstelle; im Auftragsbogen «Wirkung» gegen «Bereich» und
der Indikator Identitätskonstrukt. Alles in einer letzten kleinen Runde
behoben (vier, acht und zwei Punkte).
**Runde 3** (fünf Lernende, nur die geänderten Zeilen): keine der geänderten
Stellen hindert am Arbeiten; danach wurde nichts mehr geändert. Zuletzt
gelesen: Runde 3.

**Offen nach drei Runden** (nicht mehr geändert):

- **Heft A S. 5, Schritt 03:** «Begriff, Fundstelle (1. Spalte)» — das Raster
  führt die Fundstelle vorn («Seite» bzw. «Absatz») und den Begriff hinten;
  das Wort «Beleg» meint im Schritt die Rasterzeile, im Raster eine Spalte.
- **Heft A S. 5/6, Beginn des Gesprächs:** Schritt 05 verweist auf Karte 4;
  dort steht der Impuls zum Fall im «Damit tun Sie», das Kartenbeispiel
  handelt aber vom ersten Arbeitstag. Zwei Lesende formulieren den Impuls
  selbst.
- **Heft A S. 3 ohne Medien:** Die Quelle (Kap. 18.2) sagt nichts zum
  Selbstbild; die Brücke zum Fall leisten die Lernenden («Für den Fall leite
  ich ab»). Mit Medien: Die Quelle spricht vom Körperbild und von Mädchen.
- **Heft B S. 5, Schritt 04:** «zwei Zeilen der Umfrage, bei denen die Person
  im Fall etwas ändert» — wo sie festgehalten werden und ob sie die zwei
  Massnahmen sind, steht nicht da; LF4 (S. 4) und Checkliste nennen sie nicht.
  Schritt 04 sagt «Einwand», S. 4 und Abgabe «Antwort auf den Einwand».
- **Heft B S. 3 mit Medien:** der Hinweis «QR-Seite zählt so: Abs. 2, 4, 8
  (= Fussnote 1)» und der Kopf aus der Karte nennen Nummern, die das PDF nicht
  zeigt; «(erster Absatz / G14)» — im Auftrag gibt es zwei «erste» Absätze.
  Die Sitzdauer hat in der Umfrage keine Zeile.
- **Heft B S. 4:** «Massnahmen klein wie Teilziele (Kap. 18.4, S. 421)» steht
  bei LF4, gehört inhaltlich zu Schritt 05.
- **Heft B S. 6:** Kopf der Kachel-Karte «kein Foto», fester Kartentext
  «eigenes Bild», «eigenes Foto»; das Beispiel der Grafik-Karte nennt
  «Wert: 240» ohne Einheit.
- **Beide Hefte S. 5 gegen S. 8:** «Das geben Sie ab» nennt nur das Produkt
  (Bauplan), die Checkliste hakt auch LF1, Raster und Ableitung ab. Zwei
  Lesende von Heft B nennen das hinderlich.
- **Beide Hefte S. 8:** «gilt auch bei …» bleibt unerklärt (fester Titel);
  «So starten Sie» (S. 1) verspricht einen Quer-Check der eigenen
  Markierungen, den S. 8 nicht leistet.
- **Auftragsbogen A4, Identitätskonstrukt:** «Rand zu Regel 3 und Entscheid
  zeigen, wie Erwartungen das Bild von sich prägen» — Schritt 03 und 04
  verlangen das Bild von sich nicht ausdrücklich. A3: Stationen 2 und 3 gehen
  von einer geänderten Regel aus; der Einwand (Schritt 05) hat auf A3 kein
  eigenes Feld.

Zeitsummen der Lernenden gegen den Seitenplan (Schätzungen, Runde 1): Heft A
ohne Medien ca. 127 Min., mit Medien Profil a ca. 105 Min., Profil b ca.
187 Min.; Heft B ohne Medien ca. 130 Min., mit Medien Profil a ca. 90–105 Min.,
Profil b ca. 155 Min. (in Runde 2: rund 150); Auftragsbogen ca. 56 Min.
Profil b braucht für Heft A fast das Doppelte — die Sprachlast von Kap. 18.1
und 18.2 und der Quelle ist hoch.

Kein Gegenleser konnte prüfen: Bild und Ton der zwei Videos, das PDF auf dem
Handy, die QR-Seite, das Seitenbild (Feldgrössen, Zeichen der Legende; die
Messung prüft nur Überlauf).

## 8. Vor dem Druck gegenhören / gegensehen

- **Heikles Thema zuerst:** Quelle und beide Vertiefungen von Heft A lesen
  bzw. ansehen, bevor die Medien-Spur gewählt wird (Thema Aussehen; Teile
  ausserhalb der Ausschnitte nennen Erkrankungen und Eingriffe). Die Spur ohne
  Medien kommt ohne das Thema aus.
- **`q-411a-vertiefung-2`:** Bild und Ton sichten; Sprung zu 05:05; wer bei
  05:24–05:33 spricht (aus den Untertiteln erschlossen); der Player stoppt
  bei 06:10 nicht.
- **`q-411b-vertiefung-2`:** Bild sichten (die Titel der vier Tipps stehen nur
  im Bild); Zeitmarken 00:16, 00:47, 01:18, 01:44.
- **`q-411b-pflicht`:** PDF auf einem Handy öffnen (S. 16–17 finden; ob die
  Adresse `dam-api.bfs.admin.ch` hält); ob die im Heft beschriebenen Stellen
  (erster Absatz unter dem Kapiteltitel, erster unter dem ersten Zwischentitel,
  Fussnote 1, G14 Reihe 15–24) so auffindbar sind.
- **`q-411a-pflicht`:** ob die vier Fragen mit Antworten auf der Website so
  abgesetzt sind, dass «Antwort 1–4» eindeutig ist (ein eingeschobenes Zitat
  wirkte auf eine Leserin wie eine fünfte Antwort).
- **Buch Kap. 18.2 S. 413–414:** Absatzzählung («S. 413, Abs. 4») am
  gedruckten Buch — im Heft an der Kapiteldatei gezählt.
- **Methodenkarten** aus Kap. 16.3, 17.2, 17.3, 19.2: Seitenangaben am Buch.
- **Alle Adressen der QR-Seite** auf einem Handy ohne Konto.

## 9. Unbelegt, nicht geprüft

- **Medieneinfluss auf das Selbstbild** ist im Lehrmittel der Zeile nicht
  belegt; Aussagen dazu stehen nur in der Medien-Spur von Heft A, mit
  Fundstelle im Archivtext.
- **«Selbstbild», «Fremdbild», «Eigener Massstab»** sind Wörter des Hefts
  (Lehrmittel S. 412: «die Person, für die man sich hält» bzw. «für die einen
  die anderen halten»; S. 413 nennt Werte einen Massstab).
- **Merkmale eines gesunden Lebensstils** führt das Lehrmittel nicht als
  Liste; LF1 von Heft B kennzeichnet sie als abgeleitet. «Rolle», «Lebensstil»
  und «Erholung» sind im Glossar aus den Seiten abgeleitet, nicht definiert
  übernommen; «Idealbild» steht in der Quelle nicht als Wort.
- **Regel der Gruppe und Wert dahinter** (Heft A), Zuordnungen Zeile → Bereich,
  Belastung, Begriff (Heft B) sind Deutungen und in den Lösungen so
  gekennzeichnet.
- **Vergleich Umfrage ↔ BFS** (Heft B mit Medien) misst nicht dasselbe; Heft
  und Lösung sagen es.
- **Kap. 18.4 S. 421** spricht von Lernzielen; die Übertragung auf Massnahmen
  ist als solche gekennzeichnet.
- **Anlaufstellen** nennt der Begleiter nur als Fundstelle (Kap. 4.3 S. 142,
  Vertiefung 1 von Heft B Abs. 41), nicht namentlich.
- Nicht geprüft: Ton, Bild, Play-Adressen und PDF auf dem Handy, Aussehen in
  Word (nur Seiten gezählt), Workbench im Browser (kein Dev-Server in diesem
  Lauf); der Satz im Begleiter, die Plattform zeige zuerst die Spur ohne
  Medien (Form aus einem früheren Begleiter, am Code nicht nachgesehen).

## 10. Fehler in Skill, Skript, Renderer, Bestand (nicht repariert)

Neu in diesem Lauf:

- **Karte `hko-befund-kachel`:** fester Text verlangt «eigene Zahl», «eigenes
  Bild», ein Foto; für die Auswertung einer vorgegebenen Umfrage passt das
  nur über `fuer`. Das Kartenbeispiel rechnet nicht auf («an zwei von drei
  Tagen» gegen «5 von 8» gegen «rund 230»). Bei einem heiklen Thema lädt
  «eigenes Foto» zur Selbstauskunft ein.
- **`tun` bei `hko-`Karten:** Der Bauplan sah die Übertragung der Kachel im
  `tun` vor; laut Executor B druckt der Renderer `tun` dort nicht, laut
  Executor A erscheint es bei `hko-stille-aushalten` im Export («Damit tun
  Sie» ist im Seitentext von Heft A bei den zwei Lehrmittel-Karten sichtbar).
  Datenvertrag Zeile 147 und Verhalten sind nachzuprüfen.
- **Karte `hko-stille-aushalten`:** Das Beispiel («Erzähl mir von deinem
  ersten Arbeitstag») fordert Persönliches; ein eigenes `beispiel` im Kern
  verbietet der Datenvertrag §11.3. Für heikle Themen fehlt ein Weg, das
  Kartenbeispiel zu ersetzen.
- **Konvention `knoten_ref` «· eigener Fall»** (LF2) und die feste
  Persona-Zeile («eigener Lehrbetrieb, eigener Wohnort») lesen sich bei diesem
  Thema wie eine Aufforderung, über sich zu schreiben — sechs von sieben
  Lernenden stolperten. Die Skill hat keinen Baustein «Sie antworten für die
  Person im Fall».
- **Kopf von S. 3 ohne Medien** nimmt die Stichworte des ersten
  `quellen_anker` mit passendem `ref`; bei zwei Ankern desselben Kapitels
  entscheidet die Reihenfolge — nirgends beschrieben.
- **Rasterspalten mit Medien:** Bauplan-Spalten ohne Fundstellen-Spalte (Heft
  B) bzw. «Absatz» für eine Website ohne Absatznummern (Heft A) — die
  Bauplan-Vorlage fragt nicht, wie Lernende die Stelle auf der echten Seite
  finden. Das Kohärenz-Audit zählt nach der Nummerierung des Archivs.
- **Datenvertrag** nennt die erste Rasterspalte ohne Medien konstant «Absatz»,
  der Bauplan «Seite»; Skelett-Checkliste «Begriff aus LF1» gegen phase-5
  «(LF1 oder Glossar)».
- **`regelGlossar`** lässt einen Glossareintrag ohne Knoten nicht zu; ein
  Begriff, den nur der Begleiter braucht (hier «Prävention»), hat keinen Ort.
- **Begleiter-Skelett:** verlangt in den H2 von §3/§4 das Label ohne Marker;
  `check-einheiten` meldet es ab 45 Zeichen als Kopie ohne Marker. Kein Ort
  für «Wenn es persönlich wird», Lücken und «vor dem Druck».
- **`gegenleser.md` §4.1** setzt «1. Lehrjahr, 16 Jahre» fest; für T4 falsch.
  §3 beschreibt nur eine Form der Archivdatei (hier brach das Paket für eine
  Grafik-Quelle).
- **Lehrmittelordner:** neben Kap. 18.2 liegt `18.2_8.2_polymarket_combo.md`
  (fremd wirkend, nicht gelesen, nicht verwendet).
- **Sweep-Agent** blieb im ersten Anlauf ohne Ergebnis hängen (zehn Minuten
  ohne Fortschritt); zweiter Anlauf mit Suchwerkzeug statt Ganzlesen.

Bekannt aus früheren Läufen, hier wieder berührt: E30 in der Skill nicht
nachgeführt; `hko-quelle-raster` spricht ohne Medien von «sehen, hören» und
«Zeitmarke» und trägt «(Beispielwert)»; Merksätze von `lm-17-3-3b-schema`
(«drei Argumente») und `lm-16-3-gestaltung` («ganzer Satz ist zu viel»);
kein Budget für `erwartung` und `beispiel_pol_*` (hier 28.6 px Überlauf auf
Lösungsseite 3); `export-v42` setzt den Index voraus; «zwei leere Knoten» und
«gilt auch bei …» ohne Erklärung; «So starten Sie» gegen Quer-Check; Renderer
druckt «… planen», «Ende Ziel … Probelauf», «Zahlen | Betrag», «SuK/Ges»,
«Wortlaut Kompetenznachweis»; `set-template.json` zeigt `produkte[].schritt`
als String und kennt `lehrgaenge` nicht; Bauplan-Vorlage ohne Feld «SK des
Auftrags»; jede Änderung an Heft oder Set nach Phase 8 verlangt einen neuen
Lauf des Marker-Skripts (hier zweimal: 28 und 7 Marker neu gefüllt); die
Leck-Prüfung läuft nur in `check-all`.

Bestand und Arbeitsbaum: Im Arbeitsbaum liegen fremde, uncommittete
Änderungen (Skill, `scripts/check-v42.mjs`, Renderer, `.gitignore`, die
Einheiten 2.1.1 und 2.3.1, `hko-quelle-raster.json`, Karten `q-…` anderer
Baupläne, der Ordner `4.2.1_risiken_absichern`). Sie sind nicht angefasst und
nicht im Commit; Messung und Build liefen mit ihnen.

## 11. Commit

Ein Commit «Einheit 4.1.1_wohlbefinden_staerken (bbw-hko-heft-v42)»: Ordner der
Einheit, die acht Karten `q-411a-*`/`q-411b-*`, dieser Bericht,
`src/data/einheiten.index.json`, `public/nrlp/einheiten.index.json`. Kein
Push, kein Deploy, kein Dev-Server.
