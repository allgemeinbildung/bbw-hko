# Bericht — 2.2.1_ausgrenzung_analysieren (bbw-hko-heft-v42, Auto-Modus, lokal)

Lauf vom 2026-10-04, lokal, Branch `v42-skill`, aus dem Prompt
`docs/cloud-run/prompts/alle-bauplaene-seriell.md` (ein Durchgang, streng
seriell: nie mehr als ein Subagent gleichzeitig). Bauplan:
`docs/cloud-run/bauplaene/2.2.1_ausgrenzung_analysieren.md`, freigegeben am
2026-10-04. Kein Lehrmittel-, Transkript- oder Artikeltext in dieser Datei.

**Ergebnis: grün.**

## 1. Einheit

| | |
|---|---|
| Ordner | `src/data/einheiten/2.2.1_ausgrenzung_analysieren/` (sechs Dateien) |
| Lehrgang | EFZ_3J (kein zweiter Lehrgang: 2.2.3 fehlt in 4J 2.2) |
| Heft A | 2.2.1 · «Nur ein Spruch – oder schon Ausgrenzung?» · Prüfbericht (Tabelle + drei Sätze) · **nur Spur mit Medien** (2.2.1 führt Rezeption mündlich und audiovisuell) |
| Heft B | 2.2.2 + 2.2.3 · «Das Plakat im Gang – soll es hängen bleiben?» · Kommentar (100–120 Wörter) mit Redebeitrag von einer Minute · beide Spuren |
| Auftrag | «Regeln für unseren Team-Chat» · Verein und Freizeit · A2 kommentierte Übersicht (`flaeche`), A3 Aushandlungsgespräch (`spur`) |
| KN | «Der Film vom Jahresessen soll online gehen» · Lehrbetrieb · Kriterien Fachkorrektheit, Argumentation, Ethisches Prinzip, Position / Werthaltung |
| Status | `entwurf` |
| Quellenkarten | acht, `q-221a-*` und `q-221b-*` — in Phase Q angelegt, in diesem Lauf nicht verändert, mit diesem Commit erstmals eingecheckt |

Hinweis: Im Katalog steht bereits `2.2.1_meinungsfreiheit_reflektieren` (EFZ 4J,
Karten `q-221.2…`). Die zwei Einheiten teilen die Nummer, nicht den Ordner und
nicht die Karten.

## 2. Tor (letzte Ausgaben, nach der letzten Änderung)

```
build:einheiten-index   einheiten.index.json: 19 sets written (src + public/nrlp)
begleiter-marker --check 282 Marker · 0 abweichend · 0 unaufloesbar · nichts geschrieben
check-all 2.2.1_ausgrenzung_analysieren
  ok  Struktur · Status · Methoden · Sprache · Leck  0 Fehler, 0 Warnungen
  ok  nRLP-Abgleich (Kompetenz-/Lebensbezugstexte, Lehrgaenge)
  ok  Kopplung · Autarkie · Begleiter-Marker
  ok  Leitfragen-Loesungen
  ok  Heft v4.x (Budgets, Spuren, Quellen)
  GRUEN — keine Fehler.
export-v42 + messen-v42  Exit 0 — 43 Seiten ok, kein Überlauf
                         (Auftragsbogen 4 · Heft A mit 8 · Heft B mit 8 · Heft B ohne 8 ·
                          Lösungen 3 × 5); Schreibschrift Segoe Print
bestand-v42 --pruefen    OK — 26 Dokumente unverändert.
npm run build            Exit 0 (prebuild hat keine Datei verändert)
check-all 1.3.1_konsum_verantworten_v42 2.3.1_anliegen_vertreten
          2.1.1_informationen_hinterfragen   GRUEN — keine Fehler.
```

Reserve 0 px (voll, kein Überlauf): je Heft S. 1, 6, 7; Auftragsbogen A2, A3.
Knapp: Heft B ohne Medien S. 8 (0,8 px).

**Reparaturrunden vor dem Gegenlesen (Messung):** Das erste Tor war in
`check-all` grün, die Messung meldete drei Überläufe — Auftragsbogen A1
(57 px), A4 (20,5 px), Heft A S. 8 (7,8 px). Behoben in den Daten in zwei
Schritten: `situation_text`, `leitfrage`, Hinweis und drei Schritt-Hinweise des
Auftrags gekürzt; fünf Glossardefinitionen und ein Quer-Check von Heft A
gekürzt; die Stufen 0–2 von «Ethisches Prinzip» in `kn.json` gekürzt (87, 89,
87 Zeichen) und neu in Heft A und Set kopiert. Die Stufe 3 blieb.

## 3. Kapitel, Seiten, Quellen

| Heft | Leitfrage | Fundstelle |
|---|---|---|
| A | LF1 | Kap. 3.4 S. 116 (Kette, Rassismus) · Kap. 18.3 S. 418 (Vorurteil, Ausgrenzung) |
| A | LF2 | Kap. 3.4 S. 117–119 (Zweck und Schwelle der Strafnorm, keine Straftat im Familien- und Freundeskreis, Grundrechte im Glossar) · eigener Fall |
| A | LF3, LF4 | Quelle `q-221a-pflicht`; LF4 `recht_praxis`, Kap. 3.4 S. 117–118 ↔ Quelle |
| B | LF1 | Kap. 18.2 S. 413–415 (Wert, Norm, Wertewandel, Dilemma — nur der Begriffsabsatz) |
| B | LF2 | Kap. 18.3 S. 418 (fünf Leitfragen) und S. 419 (Empathie) · eigener Fall |
| B | LF3 ohne Medien | Kap. 12.1 S. 293–294, nur Fliesstext |
| B | LF3 mit Medien | Quelle `q-221b-pflicht`, Abs. 3, 8, 4, 5 |
| B | LF4 | `position_gegenposition`, «Kap. 18.2 · hängen lassen ↔ abhängen» |
| B | Form des Produkts | Kap. 17.3 S. 394 (nur das 3B-Schema) und S. 396 (Aufbau Kommentar) |

Nicht verwendet: Kap. 7.1 (siehe §6, Entscheid 2).

| Slot | ID | Typ · Titel (gedruckt) · Herausgeber · Datum | Ausschnitt | geprüft am | Zugeständnis |
|---|---|---|---|---|---|
| A Quelle | `q-221a-pflicht` | Audio · «Jenische und Sinti: Streit um eine Bezeichnung» · SRF Echo der Zeit · 2025-05-16 | 00:00–03:51 | 2026-10-03 (Phase Q), Lösung am Archivtext 2026-10-04 | Ausschnitt; handelt von einem Wort, nicht von mehreren Sprüchen; die umstrittene Bezeichnung fällt oft, ein Schimpfwort wird zitiert; Zeitmarken berechnet (±10 Sek.) |
| A Ersatz | `q-221a-pflicht-ersatz` | Audio · «Musliminnen in der Schweiz: zwischen Vorurteilen und Rassismus» · SRF Echo der Zeit · 2026-04-22 | 00:00–03:45 | wie oben | anderes Thema als die Quelle; keine Gegenstimme |
| A Vertiefung 1 | `q-221a-vertiefung-1` | Video · «Schwarzsein in der Schweiz – Rassismus im Alltag» · SRF DOK · 2023-03-16 | 00:03–05:00 | wie oben | Ausschnitt ohne eigene URN, Ende selbst setzen; Bild nicht gesichtet |
| A Vertiefung 2 | `q-221a-vertiefung-2` | Webseite · «Menschenwürde vs. Meinungsäusserungsfreiheit» · Kommission gegen Rassismus EKR · 2023-06-20 | Abs. 1–10 | wie oben | Sicht einer Bundeskommission |
| B Quelle | `q-221b-pflicht` | Artikel · «Gomringers Gedicht «Avenidas» muss weg» · SRF Kultur · 2018-01-24 | Abs. 1–10 | wie oben | Artikel statt Ton; Fall in Berlin; Stand Januar 2018 |
| B Ersatz | `q-221b-pflicht-ersatz` | Artikel · «Umstrittene Wandmalerei wandert vom Schulhaus ins Museum» · SRF News · 2023-04-11 | Abs. 1–6 | wie oben | Ausschnitt; die Seite «soll bleiben» spricht nicht selbst |
| B Vertiefung 1 | `q-221b-vertiefung-1` | Artikel (Analyse) · «Das Strafrecht ist immer nur das letzte Mittel» · SRF News · 2020-02-09 | Abs. 1–16 | wie oben | Zählung der Karte mit Zwischentiteln |
| B Vertiefung 2 | `q-221b-vertiefung-2` | Video · «Jenny Holzer zeigt Louise Bourgeois» · SRF Kulturplatz · 2022-03-16 | 00:19–01:51 | wie oben | Bild nicht gesichtet |

## 4. Abdeckung (kohaerenz.md §3)

| # | Befund | Lücke |
|---|---|---|
| A1 | Rezeption schriftlich und bildlich: Auftrag A2 (dazu Heft B S. 3, geübt) · Produktion mündlich: Heft B, Redebeitrag · Produktion schriftlich und bildlich: Heft B, Kommentar · Interaktion und Kollaboration mündlich: Auftrag A3 | keine |
| A2 | A: Rezeption mündlich → S. 3 (Audio) · B: Produktion schriftlich → Kommentar; Produktion mündlich → Redebeitrag | A: Rezeption audiovisuell nur freiwillig (Vertiefung 1) — wie im Bauplan |
| A3 | B S. 3 in beiden Spuren Rezeption schriftlich: geübt · A Vertiefung 1 (Video): freiwillig geübt | keine |
| A4 | Rezeption schriftlich → A2 · Interaktion mündlich → A3 | keine |
| A5 | 2.2.1 in A, 2.2.2 und 2.2.3 in B geführt | wie A2 |
| A6 | SK 1: A · 5: A, KN · 6: B, KN · 7: A, B, KN · 12: B | keine |
| A7 | A: 1 → LF3 · 5 → LF4 (zweite Strategie) · 7 → Spalte «wie es ankommt» — B: 7 → LF2 und LF3 · 6 → LF4 · 12 → Kommentar und Redebeitrag | keine |
| A8 | Prüfbericht (Tabelle) · Kommentar mit Redebeitrag (Fliesstext) · kommentierte Übersicht (`flaeche`) · Aushandlungsgespräch (`spur`) | keine |
| A9 | Freundeskreis · Berufsfachschule · Verein und Freizeit · Lehrbetrieb | keine |
| A10 | A: Fachkorrektheit + Ethisches Prinzip · B: Argumentation + Position / Werthaltung · Auftrag: alle vier | keine |
| A11 | mit Medien: A `recht_praxis` ≠ B `position_gegenposition` · ohne Medien: nur B | keine |
| A12 | A nur mit Medien: Quelle und Ersatzquelle je mit Karte und Archivtext · B beide Spuren | keine |
| A13 | Fall-Begriffe: kein Treffer in Heften, Set (ausser `kontext_ausschluss`), Karten; im Begleiter nur im Marker `kontext_ausschluss` und in §7 (Sweep, 2026-10-04) | keine |
| A14 | siehe §5 | keine |

Prinzip, Hefte und Set tragen dieselben Werte: `kn_kriterien_verteilung`,
`pol_typ_verteilung`, `mindmap_zentrum_kurz` («Sagen dürfen oder ausgrenzen»),
`auftrag_lebensbereich`, `modi_pro_heft` = `nrlp.sprachmodi` (Sweep Punkt 10 und
`check-all` Kopplung).

## 5. Vergleich mit Gold (nur Kurzliste aus kohaerenz.md §4)

**Fest (F1–F13):** gleich — sechs Dateien; Template `heft_8page_v42`, acht
Seiten je Heft (Messung); Kern einmal, Spuren nur das Abweichende (`regel1`,
`regel4`: Heft A ohne `ohne_medien`); vier Leitfragen K2/K3/K4/K4; fünf
Schritte mit `liefert`; Kriterien im Wortlaut des KN (`regel6`, nach der
Kürzung neu kopiert); Begriffsnetz mit gleichem Zentrum und Transfer-Ast
(`regel7`, `regelGlossar`: 26 Einträge); Abschluss 2 + 3 + 4; Auftrag mit fünf
Schritten, zwei Produkten, vier Seiten; KN mit drei Formen und ihren Modi
(`modi_kn` gleich wie Gold — Gerüst, kein Befund); Lösung zu jedem Feld
(`check-lf-loesung`: 12 Leitfragen, kein Befund); Benennung nach E21; Sprache
(Sweep ohne Befund).

**Hergeleitet (H1–H9):**

| | Gold 1.3.1 | 2.2.1 Ausgrenzung | Herleitung |
|---|---|---|---|
| Modi A | Rezeption schriftlich | Rezeption mündlich · audiovisuell | Kompetenz-Ebene 2.2.1 |
| Modi B | Rezeption schriftlich · Interaktion mündlich | Produktion mündlich · Produktion schriftlich | Kompetenz-Ebene 2.2.2, 2.2.3 |
| Modi Auftrag | Produktion mündlich · Produktion schriftlich | Rezeption schriftlich · Interaktion mündlich | `modi_kn − (A ∪ B)`, kein Sonderfall |
| SK A / B / KN | 5·11·1 / 2·6·11 / 5·11·6 | 1·5·7 / 7·6·12 / 7·5·6 | SK von T2, gemeinsame SK 7 |
| Produkt A | kommentierte Karte (Liste) | Prüfbericht (Tabelle + Fliesstext) | Verb «analysieren» + Rezeptionsmodi |
| Produkt B | Tabelle mit Regeln + Gespräch | Kommentar (Fliesstext + Liste) mit Redebeitrag | `detail` «Kommentar», «in Gesprächen … Argumentationsstruktur» |
| Auftrag | Blatt + Sprachnachricht | kommentierte Übersicht + Aushandlungsgespräch | Rezeptionsmodus → Auswertung eines Dokuments in der Situation; Interaktion → Gespräch mit Träger |
| Quelle A / B | — | Audio / Artikel | erster Rezeptionsmodus von 2.2.1 / Ausweichfolge ausgeschöpft |
| Pol-Typ | — | A `recht_praxis` · B `position_gegenposition` | Strafnorm ↔ Praxis / zwei Haltungen in der Situation |
| Aspekte, drittes Kriterium | — | Ethik R2 · Politik R1 · Kultur R1; «Ethisches Prinzip» | Datensatz 3J, Thema T2 |

Modi des Auftrags, Produkttypen und SK sind alle verschieden von Gold.

## 6. Entscheide im Lauf (auto-modus §4)

1. **Bauplan §9, Entscheid 1 (Quelle und Ersatzquelle von Heft A tauschen —
   «empfohlen»): nicht ausgeführt.** §7 des freigegebenen Bauplans und die
   Karten führen den Beitrag zu Jenischen und Sinti als Quelle; der Tausch
   hätte Karten und Archivordner umbenannt, und bestehende Karten fasst der
   Lauf nicht an. Es gilt damit die Alternative (1) aus §9: Der Begleiter
   rahmt die umstrittene Bezeichnung (§2, §3, §5 dort). Verworfen: Tausch der
   IDs im Lauf. **Für Pietro offen** — der Tausch ist nach dem Lauf weiter
   möglich (zwei Karten, zwei Archivordner, in Heft A die Rasterlösung, die
   Zeile «Mit Ersatzquelle», Lösungsbild und Glossar-Einträge der Spur).
2. **Bauplan §9, Entscheid 4 (Kap. 7.1 S. 186):** Der Crosswalk war nicht
   nachgeführt → Alternative aus §2: Meinungsfreiheit nur über Kap. 3.4
   S. 117–119 und über Vertiefung 2. Kap. 7.1 steht in keiner Datei.
3. **`prinzip.quellen_anker`** führt Kap. 17.3 S. 394–396, weil Heft B den
   Aufbau des Kommentars daraus bezieht (nicht nur eine Methodenkarte);
   Kap. 16.1 nicht (nur Karte).
4. **`zirkularitaet`:** dominanter Aspekt Ethik, T2 = R2; Voraussicht T3 und
   T4 (Datensatz 3J).
5. **Heft A:** Annahme zum Spruch («drückt ein Vorurteil aus, spricht aber
   niemandem das gleichberechtigte Dasein ab») steht als Strategie bei LF2,
   nicht in der Situation. Zahlentabelle mit vier Fallangaben. Beispielbild:
   Radiogespräch über Jugendliche am Familientisch (Merkmal Alter). Karte
   `hko-woertlich-zitieren` mit eigenem `fuer` und überschriebenem `beispiel`
   im Kern (der Datenvertrag sieht `beispiel` dort nicht vor; Loader und
   Skripte nehmen es an).
6. **Heft B:** Knoten «Wertekonflikt» (Lehrmittel: «Dilemma», LF1 nennt
   beides); «Wirkung» ist Knoten in A und B mit gleicher Definition;
   Beispielbild «Veloberg auf dem Quartierplatz»; Lösungsbild entscheidet
   «hängen lassen und erklären» (119 Wörter); Fundstellen ohne Medien nach
   Zwischentitel statt Absatznummer; Anforderungen an den Kommentar so
   gefasst, dass sie in 100–120 Wörter passen (Einleitung ein bis zwei Sätze;
   je Argument Behauptung und Begründung in einem Satz, Beispiel in einem
   zweiten; das zweite Argument beantwortet den Einwand; ein Schlusssatz).
7. **LF3 mit Medien in Heft B** weicht von der Arbeitsfassung des Bauplans ab
   («… das Werk **oder den Entscheid darüber** …»): Die Quelle hat nur eine
   Stimme, die über das Werk urteilt; die übrigen urteilen über den Entscheid.
8. **Set:** Regeln 1, 3 und 4 des Entwurfs und die drei Sprüche sind eigene
   Formulierungen (der Bauplan legt nur die vage und die ausschliessende Regel
   fest); `zahlen_tabelle` leer; Glossar «Menschenwürde» mit Herkunft
   `lehrmittel` (Wort in Kap. 3.4 S. 119), Definition ohne Aussage der
   Kommission.
9. **Begleiter:** SK des Auftrags 7 · 6 · 12 (der Bauplan nennt keine); Zeile
   «Spuren» im Steckbrief; Block «vor dem Druck gegenhören» in §5.
10. **Kürzungen nach der Messung** (siehe §2) habe ich als Orchestrator selbst
    in `set.json`, `kn.json` und an zwei Stellen von Heft A vorgenommen; ebenso
    die letzte kleine Runde (§7, Runde 3). Alle anderen Änderungen gingen an
    die Executor der Datei.

## 7. Gegenleser (gegenleser.md §6)

Besetzung, einzeln nacheinander: Lernende/r Profil a an Heft A mit Medien,
Heft B ohne Medien, Heft B mit Medien, Auftragsbogen; Profil b an Heft A und
Heft B (je mit Medien); Lösungs-Audit Heft A, Heft B ohne Medien, Heft B mit
Medien; Sweep. Pakete mit `seitentext.mjs`; Archivausschnitt und die genannten
Lehrmittelseiten dabei, nie Begleiter, Lösungen oder Bauplan.

| Gegenleser | Runde 1 | übernommen | nicht übernommen |
|---|---|---|---|
| Lernende a, Heft A | 3 Stellen + 30 Hänger | Raster → Prüfbericht (S. 3, S. 5), Tabelle auf S. 7 zeichnen, Merkwort, LF4-Strategie, Karte 3 `fuer` und Beispiel, Beispielbild Satz 1 | Wortlaut des Spruchs fehlt (V, Bauplan); Spalte «Absicht» (V, Bauplan); Karten 1, 2, 4 (S); SuK/Ges (R); «Stufe 3 übertragen» (V, Transfer-Ast) |
| Lernende b, Heft A | 3 Stellen, Wortliste | wie oben | unerklärte Wörter der Quelle und des Lehrmittels (Q); Abgabe «3 Sätze» (V, Bauplan wörtlich) |
| Lernende a, Heft B ohne | 3 Stellen + 20 Hänger | Wortzahl erfüllbar, Beispiel mit Begründung, Rückfrage durch das Gegenüber, «Dilemma» in LF1, Quer-Check 1 | LF3 vor LF4 (V, feste Folge); 12.1 trägt nur die Sachlage (S/Bauplan — die Lösung sagt es jetzt); Merksätze der Karten (S) |
| Lernende a, Heft B mit | 3 Stellen + 20 Hänger | LF3 und Auftrag der Quelle neu («Werk oder Entscheid»), Lösung nachgezogen, «letzte Spalte» | QR-Adresse mit 2.2.1 (V, E21); Vertiefung 1 thematisch entfernt (Q) |
| Lernende b, Heft B mit | 3 Stellen, Wortliste | wie oben; Schritt 05 als Satz | Kriterien 2 gegen 3 Punkte schwer zu unterscheiden (V, Wortlaut KN) |
| Lernende a, Auftragsbogen | 3 Stellen + 12 Hänger | Indikatoren Fachkorrektheit und Ethisches Prinzip | Schritt 01/02 ohne Feld und ohne Abgabe (V, Bauplan: Abgaben wörtlich); «Ende Ziel … Probelauf», «planen» im Titel A3, Persona-Zeile (R) |
| Audit Heft A | 12 Befunde, kein falsches Zitat | alle 12 (Deutungen gekennzeichnet, «nach der Anti-Rassismus-Strafnorm», Fundstellen, eine Annahme zum Spruch) | — |
| Audit Heft B ohne | 8 Befunde | alle (Lösungsbild mit zwei vollständigen 3B-Argumenten, Befund drei Sätze, Kennzeichnungen, Fundstellen) | — |
| Audit Heft B mit | 10 Befunde, 3 «falsch» | alle (Auftrag und Quelle passen jetzt; Ersatzzeile; Stand je Quelle; Erwartungen der Vertiefungen mit Zählweise und Sprecher) | — |
| Sweep | kein Treffer | — | — |

Weggefallen nach Nachprüfung: «Kürzung von A1 nicht sichtbar» (der Leser hatte
schon die gekürzte Fassung); «✔ und ☐ doppelt» (Artefakt der
Textaufbereitung); «Kap. 17.2/19.2 fehlen im Paket» (so gewollt: nur die
Karte).

**Runde 2** (alle sechs Lernenden an den geänderten Seiten): Kernbefunde
behoben; neu «Begriff → Stufe» (Heft A S. 3), Zeitmarke vorn/hinten im
Kartenbeispiel, Quer-Check 1 von Heft B gegen Schritt 02 (drei Leser),
Indikator «Ethisches Prinzip» im Auftrag gegen die Stufentexte.
**Runde 3** (dieselben sechs, nur die geänderten Zeilen): die vier Punkte
bestätigt als behoben; die Runde hat danach nichts Sichtbares mehr geändert.
Zuletzt gelesen: Runde 3.

**Offen nach drei Runden** (nicht mehr geändert):

- Heft A S. 3: welche drei der vier Rasterzeilen übernommen werden, sagt das
  Heft nicht; wozu die Spalte «→ Begriff» dient, wenn die Stufe «nach LF1»
  bestimmt wird, bleibt unscharf.
- Heft A S. 6: Die Schritte der Karte `hko-woertlich-zitieren`
  (Anführungszeichen, Wortwahl lassen, vorlesen und nachfragen) passen nicht
  zum Hören einer Aufnahme und zum Notieren in Stichworten; nur `fuer` und
  Beispiel sind angepasst.
- Heft B S. 8: Mitnahme-Zeile und Checkliste («Absicht und Wirkung getrennt»)
  verlangen, was Schritt 02 nicht verlangt (die Mitnahme-Zeile ist Bauplan).
- Heft B S. 5: «das zweite, stärkere beantwortet den Einwand» — ob die
  Antwort das Argument ist oder dazukommt, bleibt für Lernende knapp.
- Auftragsbogen A4: Stufentexte von «Ethisches Prinzip» sprechen von Aussage,
  Erlaubtem und Gemeintem, der Auftrag von Regeln.

Zeitsummen der Lernenden gegen den Seitenplan (Schätzungen): Heft A Profil a
ca. 113 Min., Profil b ca. 146 Min.; Heft B ohne Medien ca. 121 Min., mit
Medien Profil a ca. 115 Min., Profil b ca. 247 Min.; Auftragsbogen ca. 43 Min.
Profil b braucht für Heft B gut das Doppelte — die Sprachlast von Kap. 18.2
und des Artikels ist hoch.

Kein Gegenleser konnte prüfen: Ton der Audios, Bild der Videos, Seitenbild
(Feldgrössen; die Messung prüft nur Überlauf).

## 8. Vor dem Druck gegenhören / gegensehen

- **`q-221a-pflicht`:** alle Zeitmarken (berechnet, ±10 Sek.): 00:00, 01:12,
  01:17, 01:59, 02:28, 02:47, 03:31, Ende 03:51. Sinn der Mundart-O-Töne bei
  01:12 und 02:28 — an 02:28 hängen Rasterzeile 3, LF4 und das Lösungsbild.
  Ob bei 03:31 «bis in die 1970er-Jahre» stimmt (Transkript dort entstellt).
- **`q-221a-pflicht-ersatz`:** 01:05, 01:25, 02:20–02:31, 02:50, Ende 03:45;
  wer jeweils spricht.
- **`q-221a-vertiefung-1`:** Bild sichten; Wortlaut 02:34–02:56 und
  04:44–04:57; ob sich der Player bei 05:00 stoppen lässt.
- **`q-221b-vertiefung-2`:** Bild sichten; sauberes Ende bei 01:51; wer bei
  00:26 spricht.
- **`q-221b-pflicht`:** Sachlage nach Januar 2018; Absatzzählung auf dem Handy
  (Vorspann = Absatz 1, Zwischentitel ohne Nummer); ob die Fassade im Bild ist.
- **`q-221b-pflicht-ersatz`:** ob der Teil nach Abs. 6 klar abgesetzt ist.
- **Buch Kap. 12.1 S. 293–294:** ob die Zwischentitel, die die Lösung als
  Fundstelle nennt, im gedruckten Buch so stehen.
- **Alle vier Play-Adressen** auf einem Handy ohne Konto.
- **Auftrag, zweiter Spruch** («… das kennt man ja von dort»): ob er als
  entschärft gilt.

## 9. Unbelegt, nicht geprüft

- Meinungsfreiheit ist im Lehrmittel der Zeile nur in der Aufzählung der
  Grundrechte belegt (Kap. 3.4 S. 119); dass die Strafnorm ihr eine Grenze
  setzt, steht in den Lösungen als Ableitung. Mehr nur in Vertiefung 2 (Sicht
  der Kommission).
- Menschenwürde: nur als Wort in derselben Aufzählung; im Heft ist sie eine
  Setzung (Kriterium «Ethisches Prinzip»).
- Kunst, Haltung eines Werks, Wirkung: kein Lehrmittelbeleg; in Heft B als
  Fallüberlegung gekennzeichnet.
- «Stereotyp» und «Vorurteil» sind in der Quelle von Heft A nur über Deutung
  zuzuordnen (die Lösung sagt es); direkt belegt in der Ersatzquelle.
- Kap. 12.1 liefert für LF4 ohne Medien die Sachlage, nicht den Wertentscheid.
- Nicht geprüft: Ton, Bild, Play-Adressen auf dem Handy, Aussehen in Word
  (nur Seiten gezählt), Workbench im Browser (kein Dev-Server in diesem Lauf).

## 10. Fehler in Skill, Skript, Renderer, Bestand (nicht repariert)

Neu in diesem Lauf:

- **Karte `hko-woertlich-zitieren`:** Ihre Schritte setzen ein Gespräch
  voraus (mitschreiben, vorlesen und nachfragen, Anführungszeichen); für eine
  Aufnahme und für abwertende Aussagen, die nur als Stichwort notiert werden
  sollen, passt sie schlecht. `tun` wird für `hko-`Karten nicht gedruckt.
- **Karte `lm-16-1-diskussion`:** kündigt «acht Diskussionsregeln» an und
  nennt fünf; das Beispiel spricht vom «dritten Argument».
- **Auftragsbogen A4:** Die Budgets von `check-v42` lassen Stufentexte bis
  120 Zeichen zu; mit mehr als etwa fünf zweizeiligen Stufen läuft A4 über
  (hier 20,5 px bei sieben). Das Skript meldet es nicht.
- **Auftragsbogen A1:** `situation_text` im Budget (874 von 900) lief mit fünf
  zweizeiligen Schritten 57 px über — wie schon in Lauf 251.
- **`begleiter-marker`/`check-einheiten`:** Jede Änderung an einem Heft nach
  Phase 8 verlangt einen neuen Lauf des Marker-Skripts; die Skill sagt das
  nur für Phase 8.
- **Archiv:** Die `quelle.md` der Slots zählen Absätze uneinheitlich
  (`q-221b-pflicht` ohne, `q-221b-vertiefung-1` mit Zwischentiteln).
- **Paket der Gegenleser:** Der Archivausschnitt der Quelle von Heft A enthält
  naturgemäss die umstrittene Bezeichnung; die Gegenleser haben sie in ihren
  Notizen zitiert (nur im Scratchpad, nicht im Repo).

Bekannt aus früheren Läufen, hier wieder berührt: E30 in der Skill nicht
nachgeführt; Renderer hängt bei `form: "spur"` «planen» an das Schritt-Label
(A3 «Regeln aushandeln planen») und druckt «Ende Ziel … Probelauf»; «zwei
leere Knoten» bei drei Feldern auf S. 8; Merksätze von `lm-17-3-stellungnahme`
und `lm-17-3-3b-schema` gegen den Kommentar; `hko-quelle-raster` spricht ohne
Medien von «sehen, hören» und trägt «(Beispielwert)» und «→ hier ein Begriff
aus LF1»; gemischte Produktbilder ohne Budget; kein Budget für `erwartung`
und `beispiel_pol_*`; `check-lf-loesung` zählt UTF-16, `check-v42` Codepoints;
`set-template.json` zeigt `produkte[].schritt` als String; Bauplan-Vorlage
ohne Feld «SK des Auftrags»; Begleiter-Skelett ohne Ort für «vor dem Druck
gegenhören» und für die technische Voraussetzung eines Hefts.

Bestand: Im Arbeitsbaum liegen fremde, nicht zu diesem Lauf gehörende
Änderungen (Skill, `scripts/check-v42.mjs`, Renderer, die Einheiten 2.1.1 und
2.3.1, `hko-quelle-raster.json`, weitere Karten `q-…` der anderen Baupläne).
Sie sind nicht angefasst und nicht im Commit.

## 11. Commit

Ein Commit «Einheit 2.2.1_ausgrenzung_analysieren (bbw-hko-heft-v42)»:
Ordner der Einheit, die acht Karten `q-221a-*`/`q-221b-*`, dieser Bericht,
`src/data/einheiten.index.json`, `public/nrlp/einheiten.index.json`. Kein
Push, kein Deploy, kein Dev-Server.
