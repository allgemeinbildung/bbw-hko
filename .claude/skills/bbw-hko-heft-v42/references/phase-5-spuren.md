# Phase 5 — Spuren je Heft

Ergebnis: `spuren.ohne_medien` und/oder `spuren.mit_medien` in
`herausforderung_A.json` und `herausforderung_B.json` — LF3 und LF4 je Spur
**mit** Lösung, Kasten S. 4, Quellenbindung, Rezeptionskarte, `scaffold_90`.

Voraussetzung: Phase 4 ist für das Heft abgeschlossen; für die Medien-Spur
liegen Karte **und** Archivtext vor (`references/phase-q-quellen.md`). Form:
die Gold-Hefte — Form übernehmen, Inhalt nie. Ein Feld, das hier nicht genannt
ist, gibt es unter `spuren` nicht. Beispiele in dieser Datei sind erfunden.
Grundlagen: `docs/upgrade-v4.2/ENTSCHEIDE.md` (E3, E7, E14–E17, E19, E23),
`docs/upgrade-v4.2/01_Leitfaden_v4.2.md` (§4, §5, §6.1, §11.5) und die vier
Prüfskripte `scripts/check-v42.mjs`, `scripts/check-einheiten.mjs`,
`scripts/check-lf-loesung.mjs`, `scripts/check-all.mjs`.

## 1. Was je Heft herzuleiten ist

| Was | Woraus | Abdeckung prüfen |
|---|---|---|
| welche Spuren das Heft hat | Phase 0: Rezeptionsmodi des Hefts (`nrlp.sprachmodi`, `prinzip.modi_pro_heft`) | verlangt das Heft «Rezeption mündlich» oder «Rezeption audiovisuell», gibt es `ohne_medien` nicht (`ERR_V42_R4`) |
| Typ der Quelle | `typ` und `sprachmodus` der Karte (in Phase Q hergeleitet: Rezeptionsmodus der Kompetenz, sonst des Themas) | **nur wenn das Heft einen Rezeptionsmodus führt:** der `sprachmodus` der Karte ist dieser geführte Modus. Führt das Heft keinen (die Rezeption auf S. 3 ist «geübt, nicht geführt», ENTSCHEIDE E27), muss die Karte keinen geführten Modus tragen |
| Lehrmittel-Abschnitt (ohne Medien) | Kapitel des Bauplans, am Text der Kapiteldatei geprüft | der Abschnitt trägt vier belegbare Aussagen zur Frage; `ohne_medien` deckt nur «Rezeption schriftlich und bildlich» |
| Spalten des Rasters | Tabelle in Abschnitt 4, nach Typ der Quelle | letzte Spalte «→ Begriff»; jeder Begriff dort stammt aus LF1 |
| Pol-Typ von LF4 | `prinzip.pol_typ_verteilung` (je Heft und Spur) | Abschnitt 6 |
| Rezeptionskarte | Abschnitt 9, nach Typ der Quelle | Karte existiert in `src/data/methoden/` |

## 2. Form einer Spur

| Schlüssel unter `spuren` | Felder |
|---|---|
| `ohne_medien` | `leitfragen` (LF3, LF4), `kasten_s4` (Denkhilfe), `methoden_ref_rezeption`, `scaffold_90` |
| `mit_medien` | `leitfragen` (LF3, LF4), `quellen` (1 Quelle, 0–2 Vertiefungen), `kasten_s4` (Vertiefung), `methoden_ref_rezeption`, `scaffold_90` |

Jede Leitfrage einer Spur: `nr`, `bloom`, `knoten_ref`, `text`, `liefert`,
`antwortform`, `feld_hoehe_mm`, `scaffolding` (`strategien`, `satzanfaenge`,
`produkt`), `loesung`; LF3 zusätzlich `raster`, LF4 zusätzlich `pol_typ`.

## 3. Reihenfolge je Spur — Lösung vor Frage

1. **Lesen.** Medien: `gewaehlt\quelle.md` im Archivordner der Karte (Pfade in
   `references/phase-q-quellen.md`, Abschnitte 9 und 12), nur den Ausschnitt
   der `verortung`. Ohne Medien: die Kapiteldatei unter `material/_lehrmittel/`,
   Seiten über die Marker `[seite: NN]`; am Text prüfen, was auf den Seiten
   wirklich steht — das Lehrmittel trägt nicht jede Kompetenz wörtlich (E7).
2. **Raster als Lösung schreiben** (Abschnitt 4): vier Zeilen mit Fundstelle,
   dann Befund, dann die Lösungszeilen.
3. **Erst daraus** `text` von LF3, `raster`, `scaffolding`, `liefert`
   (Abschnitt 5).
4. **LF4** mit Erwartungshorizont (Abschnitt 6).
5. **Kasten S. 4** (Abschnitt 7).
6. **`quellen[]`** der Medien-Spur (Abschnitt 8).
7. **`methoden_ref_rezeption`** (Abschnitt 9), **`scaffold_90`** (Abschnitt 10).
8. Prüfbefehl (Abschnitt 14).

Lässt sich in Schritt 2 kein Raster mit vier Fundstellen füllen, ist die Frage
falsch gestellt: Frage anpassen, nie die Fundstelle (E23).

## 4. LF3 — die Lösung

### Spalten nach Typ (Leitfaden §5)

| Grundlage | `raster.spalten` (genau 4, je ≤ 18 Zeichen) | Fundstelle |
|---|---|---|
| Video | Bild · Ton · Aussage · → Begriff | Zeitmarke |
| Audio | Wer spricht · Kernaussage · Absicht · → Begriff | Zeitmarke |
| Artikel | Absatz · Kernaussage · Beleg / Zahl · → Begriff | Absatz |
| Grafik, Datensatz | Was gemessen · auffälliger Wert · Aussage · → Begriff | Reihe, Darstellung oder Seite |
| Rechtstext | Art./Abs. · Voraussetzung · Folge · → Begriff | Artikel und Absatz |
| Lehrmittel-Abschnitt (ohne Medien) | Absatz · Kernaussage · Beleg / Beispiel · → Begriff | Seite, wo nötig mit Absatz |

Die Ersatzquelle trägt dieselben Spalten (gleicher Auftrag, gleiches Raster).

### `loesung` von LF3

| Feld | Inhalt | Regel |
|---|---|---|
| `raster_zeilen` | 4 Zeilen × 4 Zellen, Stichworte. **Spalte 1 trägt die Fundstelle**; bei Audio und Video steht die Zeitmarke vorn in der ersten Zelle | `ERR_V42_LOESUNG`: so viele Zeilen wie `raster.zeilen`, je so viele Zellen wie Spalten |
| `befund` | ein möglicher Befund in zwei bis drei Sätzen, der die Frage von LF3 beantwortet und zum eigenen Fall führt | `ERR_V42_LOESUNG`: nicht leer |
| `kern` | Überschrift der Lösung | ≤ 55 |
| `quelle_ref` | Medien: ID der Karte · ohne Medien: derselbe Text wie `raster.knoten_ref` | Medien: Karte muss existieren |
| `quelle_stand` | Medien: Tag, an dem die Lösung am Archivtext geschrieben wurde (heute, `JJJJ-MM-TT`) — nicht `sachlage_geprueft` der Karte · ohne Medien: Tag, an dem die Lösung am Kapiteltext geprüft wurde | — |
| `zeilen[]` | je `label`, `text`, wo belegt `quelle` | 3–6 Zeilen; `text` zusammen ≤ 900; `label` ≤ 24; `quelle` ≤ 30 (`check-lf-loesung`) |

Labels von `zeilen[]`, in dieser Folge:

| `label` | `text` | `quelle` |
|---|---|---|
| Erwartet | die tragenden Aussagen mit Fundstelle in Klammern | Medien: «Quelle, Abs. …» bzw. Zeitmarken · ohne: Kapitel |
| Auch gültig | weitere Aussagen des Ausschnitts, die als Zeile gelten | wie oben |
| Begriffe | welche Zuordnung in der Spalte «→ Begriff» gilt und was davon Deutung der Lernenden ist | — oder Kapitel und Seite des Begriffs |
| Befund | was ein tragfähiger Befund mindestens verbindet | — |
| Mit Ersatzquelle | nur Medien, nur wenn die Karte ein `ersatz_ref` führt: die Zeilen, die die Ersatzquelle liefert | «Ersatzquelle, …» |

Eine weitere Zeile ist frei für einen Hinweis an die Lehrperson (Lesehilfe,
Einordnung der Quelle); im Ganzen bleiben es höchstens sechs.

**Längen.** Die Lösungszeilen von LF3 (`zeilen[].text`) sind **zusammen**
≤ 900 Zeichen, sonst `WARN_LF_LOESUNG_ZU_LANG` (`scripts/check-lf-loesung.mjs`,
Konstante `LIMITS`: `textMax` 900, `kern` 55, `label` 24, `quelle` 30, drei
bis sechs Zeilen) — bei fünf Zeilen also rund 170 Zeichen je Zeile; `kern`
≤ 55. Für die Zellen von `raster_zeilen` der Medien-Spur gibt es kein
Skript-Budget; Richtwert wie bei der Beispielzeile: ≤ 25 Zeichen in den
kurzen Spalten (Fundstelle, «→ Begriff»), die Kernaussage-Spalte kurz halten.
Ob das Raster im Dokument «Lösungen» hält, zeigt die Messung
(`messen-v42`, `references/phase-9-tor.md`).

Erfundenes Beispiel einer Lösungszeile zu einem Audio-Ausschnitt (Lärm an einem Quartierfest):
`["01:10 · Anwohnerin", "Musik bis nach Mitternacht", "will Ruhezeiten erreichen", "Interesse"]`.

Fundstellen sind Verweise, kein Text der Quelle. Keine Wortfolge ab 14 Wörtern
aus Archiv oder Lehrmittel (`check-all`: ab 14 Warnung, ab 25 Fehler).
Eigene Beobachtungen der Lernenden, die nicht im Abschnitt stehen, heissen in
der Lösung so — sie gelten nicht als Lehrmittel- oder Quellenwissen (E7).

## 5. LF3 — Frage, Raster, Scaffold

| Feld | Ohne Medien | Mit Medien |
|---|---|---|
| `nr` | `3` | `3` |
| `bloom` | `Analysieren` | `Analysieren` |
| `antwortform` | `raster` (`ERR_V42_R1`) | `raster` |
| `knoten_ref` | Kapitel und Seiten, Form «Kap. X.Y \| S. a-b» | «Quelle · Raster» |
| `text` | Auswertungsfrage an das gefüllte Raster, ≤ 220; nennt das Lehrmittel | dasselbe; nennt «die Quelle» |
| `liefert` | 3–7 Wörter, ≤ 50, nominal, ohne Anrede — **gleich in beiden Spuren** | gleich |
| `raster.knoten_ref` | = `knoten_ref` (`ERR_V42_R3`) | fehlt |
| `raster.quelle_ref` | fehlt | ID der Quelle (`ERR_V42_KARTE_FEHLT_QUELLE`) |
| `raster.auftrag` | Suchauftrag, ≤ 220: Kapitel und Seiten, «drei weitere Aussagen», Hinweis, dass die erste Zeile ein Beispiel ist (E15) | fehlt — der Auftrag steht in `quellen[0].auftrag` |
| `raster.spalten` | Abschnitt 4 | Abschnitt 4; identisch mit `quellen[0].raster.spalten` |
| `raster.zeilen` | `4` | `4` |
| `raster.beispielzeile` | 4 Zellen, je ≤ 25, alle gefüllt — **zeichengleich mit `loesung.raster_zeilen[0]`** (`ERR_V42_LOESUNG`, `ERR_V42_R3`) | fehlt (Leitfaden §4.3) |
| `feld_hoehe_mm` | `25` | `25` |
| `scaffolding.strategien` | genau 2, je ≤ 90; eine verweist auf die Beispielzeile, eine nennt die Fundseiten | genau 2; Reihenfolge Raster vor Befund, Stichworte statt Sätze |
| `scaffolding.satzanfaenge` | 2–3, je ≤ 60; einer zum Lehrmittel, einer zum eigenen Fall | einer zur Quelle, einer zum eigenen Fall |
| `scaffolding.produkt` | ≤ 110; wie der Befund ins Produkt geht (Schritt 03) | dasselbe; Belegart der Quelle (Absatz, Zeitmarke, Wert) |

Ohne Medien sind drei der vier Zeilen leer; die erste Lösungszeile muss in
vier Zellen zu je 25 Zeichen passen. Der `text` trägt höchstens zwei Aufträge
der Form «Verb Sie» (`WARN_LF_MEHRFACHAUFTRAG`).

## 6. LF4 — Pol-Typ, Frage, Erwartungshorizont

`pol_typ` steht in `prinzip.pol_typ_verteilung` (je Heft und Spur) und wird
hier nicht neu gewählt. `ERR_V42_R5`: einer der fünf Werte; A ≠ B je Spur;
`lehrmittel_quelle` und `quelle_quelle` nur in `mit_medien`.

| `pol_typ` | Pol 1 ↔ Pol 2 | Bauanleitung | Spur |
|---|---|---|---|
| `lehrmittel_quelle` | was das Lehrmittel ordnet ↔ was die Quelle zeigt | Frage stellt Modell oder Regel aus LF1 neben den Befund aus LF3 und verlangt einen Entscheid im eigenen Fall | nur Medien |
| `position_gegenposition` | eigene Position ↔ stärkster Einwand | Frage verlangt Position, Einwand und eine Antwort darauf (bleiben oder ändern) | beide |
| `modell_eigener_fall` | was das Modell sagt ↔ wo es im eigenen Fall nicht ganz passt | Frage verlangt Anwendung, eine Grenze des Modells und einen Entscheid | beide |
| `recht_praxis` | was die Regel vorsieht ↔ wie es im Fall tatsächlich läuft | Frage verlangt die Regel mit Fundstelle, die Abweichung im Fall und einen begründeten Umgang damit | beide |
| `quelle_quelle` | Aussage der Quelle ↔ Aussage einer zweiten Quelle | Frage stellt zwei Quellen des Hefts gegeneinander; die zweite ist die Ersatzquelle oder eine Vertiefung und muss dann für LF4 gelesen werden | nur Medien |

Passt der Pol-Typ nicht zur gelesenen Grundlage (etwa `recht_praxis` ohne
Regel im Abschnitt), ist das ein Entscheid des Bauplans: zurück in den
Bauplan; im Auto-Modus nach `references/auto-modus.md`.

| Feld | Inhalt | Regel |
|---|---|---|
| `nr` | `4` | `ERR_V42_R1` |
| `bloom` | `Beurteilen` | — |
| `knoten_ref` | die zwei Pole, je Pol-Typ eine Form: `lehrmittel_quelle` «Kap. X.Y ↔ Quelle» · `position_gegenposition` «Kap. X.Y · <Position> ↔ <Gegenposition>» · `modell_eigener_fall` «Kap. X.Y ↔ eigener Fall» · `recht_praxis` «Kap. X.Y · Regel ↔ Praxis im Fall» · `quelle_quelle` «Quelle ↔ Ersatzquelle» bzw. «Quelle ↔ Vertiefung N» | — |
| `pol_typ` | aus dem Prinzip | `ERR_V42_R1`, `ERR_V42_R5` |
| `text` | nennt beide Pole und verlangt einen Entscheid | ≤ 220; höchstens zwei «Verb Sie» |
| `liefert` | 3–7 Wörter, ≤ 50 — **gleich in beiden Spuren** | `ERR_V42_BUDGET` |
| `antwortform` | `schreibfeld` | — |
| `feld_hoehe_mm` | ohne Medien `45`, mit Medien `60` | `ERR_V42_BUDGET` |
| `scaffolding.strategien` | genau 2, je ≤ 90; ohne Medien verweist eine auf die Denkhilfe | — |
| `scaffolding.satzanfaenge` | 2–3, je ≤ 60 — **mindestens einer je Pol** (Leitfaden §6.1), der dritte für den Entscheid | ein Satzanfang darf die Antwort nicht auf einen Pol kippen (E15) |
| `scaffolding.produkt` | ≤ 110; wohin der Entscheid im Produkt kommt (Schritt 04) | — |
| `loesung.kern` | «Erwartungshorizont: Pol 1 ↔ Pol 2, Entscheid» | ≤ 55 |
| `loesung.erwartungshorizont.gut_wenn` | drei bis vier prüfbare Merkmale einer guten Antwort | — |
| `loesung.erwartungshorizont.beispiel_pol_1` | ausformulierte Beispielantwort, die zu Pol 1 entscheidet | siehe unten |
| `loesung.erwartungshorizont.beispiel_pol_2` | dasselbe für Pol 2; eine Annahme, unter der der Entscheid gilt, wird genannt | siehe unten |
| `loesung.erwartungshorizont.nicht_tragfaehig` | ein Satz: welche Antwort nicht genügt | — |

LF4 trägt **kein** `loesung.zeilen`; der Erwartungshorizont ist die Lösung
(`check-lf-loesung` lässt das bei LF4 zu). Jede Leitfrage braucht ein
`loesung`-Objekt, sonst bricht `check-lf-loesung` ab.

**Beide Beispiele erreichen die höchste Stufe des Ges-Kriteriums des Hefts**
(E15): die höchste Stufe aus `feedback_kriterien` lesen und in beiden
Beispielen erfüllen. Sie verwenden nur Zahlen und Gegenstände aus der
Situation des Hefts.

## 7. Kasten S. 4

| Feld | `ohne_medien` | `mit_medien` |
|---|---|---|
| `kasten_s4.typ` | `denkhilfe` | `vertiefung` |
| `kasten_s4.titel` | «Denkhilfe zu LF4» | «Vertiefung (freiwillig)» |
| `kasten_s4.spalten` | 2–3 Spaltenköpfe, je ≤ 30: die zwei Pole, dazu wo sinnvoll der Entscheid | fehlt |
| `kasten_s4.hinweis` | ≤ 140; wie viele Einträge genügen und was aus den Spalten folgen muss | fehlt |
| `kasten_s4.loesung_zeilen` | mindestens eine Zeile, je so viele Zellen wie `spalten` (`ERR_V42_LOESUNG`); zwei bis drei Zeilen zum Fall des Hefts | fehlt |

Die Spaltenköpfe folgen dem Pol-Typ, nicht der Gold-Einheit. Die Denkhilfe ist
im Heft leer; `loesung_zeilen` sieht nur die Lehrperson. Die Karten des Kastens
«Vertiefung» entstehen aus `quellen[]` (Abschnitt 8).

## 8. `quellen[]` der Medien-Spur

Genau eine Quelle mit `rolle: "pflicht"`, höchstens zwei mit
`rolle: "vertiefung"`, keine andere Rolle (`ERR_V42_R2`). Jeder `ref` ist eine
vorhandene Karte. Die Ersatzquelle steht **nicht** in `quellen[]`; sie hängt
über `ersatz_ref` an der Karte der Quelle.

| Feld | Quelle (`quellen[0]`) | Vertiefung |
|---|---|---|
| `ref` | `q-<n><h>-pflicht` | `q-<n><h>-vertiefung-1` / `-2` |
| `rolle` | `pflicht` | `vertiefung` |
| `fuer_leitfrage` | `[3, 4]`, wenn LF4 die Quelle einbezieht, sonst `[3]` | fehlt |
| `auftrag` | ≤ 220; Lese-, Hör- oder Sehauftrag, nennt die **QR-Seite**, die Zahl der Zeilen, wonach gesucht wird und welcher Beleg in welche Spalte gehört | fehlt |
| `raster` | `{ spalten, zeilen }` — Spiegel von LF3 (`spalten` identisch, `zeilen: 4`) | fehlt |
| `leitfrage_vertiefung` | fehlt | eine Frage, ≤ 100, vom Ausschnitt ganz getragen |
| `erwartung` | fehlt | Pflicht (`ERR_V42_LOESUNG`): was eine tragfähige Antwort enthält, mit Fundstelle (Absatz, Zeitmarke, Abschnitt); eigene Formulierung |

Verb im `auftrag` nach Typ: lesen (Artikel, Grafik, Rechtstext), hören (Audio),
ansehen (Video).

**Vertiefung ohne Transkript** (nur Begleittext des Herausgebers im Archiv,
E23): Die `erwartung` stützt sich auf den Begleittext und endet mit dem Vermerk
«(Stand: Begleittext des Herausgebers, Audio nicht gegengehört.)» bzw. «Video
nicht gegengesehen». Trägt der Ausschnitt die Frage nur halb, wird die Frage
umformuliert (E17).

## 9. `methoden_ref_rezeption`

Ersetzt beim Laden den Eintrag `{ "ref": "__spur__" }` in `methoden` (E3).

| Feld | Inhalt |
|---|---|
| `ref` | Karte aus `src/data/methoden/`, passend zum Typ der Grundlage (`ERR_V42_KARTE_FEHLT_METHODE`) |
| `fuer` | wofür in diesem Heft, mit Seite: «für das Raster zur Quelle (S. 3)» bzw. «… zu Kap. X.Y (S. 3)» |
| `beispiel` | ein Eintrag: eine Rasterzeile in den **Spalten dieser Spur**, an einem neutralen, erfundenen Gegenstand, Werte als «(Beispielwert)» gekennzeichnet |

Auswahlregel (Stand der Kartei; vor dem Schreiben im Ordner nachsehen):

| Grundlage | `ref` |
|---|---|
| Grafik, Datensatz | `hko-grafik-lesen` |
| Artikel, Rechtstext, Lehrmittel-Abschnitt | `hko-quelle-raster` |
| Audio, Video | `hko-quelle-raster` — die Karte nennt Video und Audio ausdrücklich und führt die Zeitmarke als Beleg; eine eigene Hör- oder Sehkarte gibt es in der Kartei nicht |

`beispiel` wird **immer** überschrieben (E15): Das Kartenbeispiel darf nicht
wie ein Befund aus der Quelle des Hefts aussehen. Weder Gegenstand noch Zahlen
des Hefts, der Quelle oder des KN. Erfunden, für Audio: «Wer spricht:
Trainerin · Kernaussage: Training fällt oft aus · Absicht: will mehr
Hallenzeit · → hier ein Begriff aus LF1».

Beide Karten führen Beispiel und Fehlerhinweis: Die Rezeptionskarte zählt zu
den zwei angereicherten Karten der Seite 6 (Bauplan §4). Bestehende Karten
werden nicht geändert; der Bericht nennt die fehlende Hör- und Sehkarte.

## 10. `scaffold_90`

Ein Satz je Spur; überschreibt `lernfortschritt.scaffold_90` des Kerns. Er
nennt **nur Stützen, die es im Heft gibt** (E17): das Beispielbild auf S. 6,
ohne Medien die ausgefüllte Beispielzeile im Raster (S. 3), mit Medien eine
gemeinsam erarbeitete erste Rasterzeile.

## 11. Prüfregeln §11.5 Nr. 1–5

| Nr. | Regel | Code |
|---|---|---|
| 1 | Kern hat genau LF1 und LF2; jede Spur genau LF3 (`antwortform: "raster"`) und LF4 (`pol_typ` gesetzt) | `ERR_V42_R1` |
| 2 | Medien-Spur: genau 1 `pflicht`, höchstens 2 `vertiefung`; Länge aus der Karte | `ERR_V42_R2`, `ERR_V42_R2_LAENGE` |
| 3 | Spur ohne Medien: `raster.knoten_ref` gesetzt, `raster.beispielzeile` mit vier gefüllten Zellen, **kein** `quellen` | `ERR_V42_R3` |
| 4 | mindestens eine Spur; keine Spur `ohne_medien`, wenn das Heft Rezeption mündlich oder audiovisuell verlangt | `ERR_V42_R4` |
| 5 | Pol-Typ A ≠ B je Spur; `lehrmittel_quelle` / `quelle_quelle` nur mit Medien | `ERR_V42_R5` |

Dazu `ERR_V42_LOESUNG` (E19; Abschnitte 4, 7, 8), `ERR_V42_BUDGET` (alle
Zeichen- und Höhenangaben oben) und für jede eingebundene Karte die Regeln aus
`references/phase-q-quellen.md`, Abschnitte 6 und 8.

## 12. Heft mit nur einer Spur

`spuren` trägt dann **nur den einen Schlüssel** (E3; `regel4` verlangt
mindestens eine Spur). Kein leeres Objekt, kein `null` für die fehlende Spur.

- Fehlt `ohne_medien` (Heft verlangt Rezeption mündlich oder audiovisuell):
  Ohne Quelle gibt es das Heft nicht.
- Fehlt `mit_medien` (Karte oder Archivtext fehlt, E23): Meldung im Bericht.
- `prinzip.pol_typ_verteilung.<A|B>` führt nur den Schlüssel der vorhandenen
  Spur. Die Regel «A ≠ B» gilt nur, wo beide Hefte dieselbe Spur haben.
- `abschluss.loesung.eigene_knoten` (Phase 6) führt nur die Schlüssel der
  vorhandenen Spuren, je zwei Begriffe (`regelLoesungen` läuft über `spuren`).
- Glossar-Einträge mit `spur` (Phase 7) nur für vorhandene Spuren.
- `methoden` behält den Eintrag `{ "ref": "__spur__" }`.

## 13. Kopplung an den Kern und Sprache

`check-einheiten` und `check-lf-loesung` setzen Kern und Spur zusammen und
prüfen **jede Spur für sich**. Jede vorhandene Spur muss allein bestehen.

| Regel | Code |
|---|---|
| nach dem Zusammensetzen genau 4 Leitfragen und 5 Schritte | `ERR_KOPPLUNG_NICHT_1ZU1` |
| jede Leitfrage hat `liefert`, 3–7 Wörter, ohne «Sie» / «Ihr» | `ERR_LF_LIEFERT_MISSING`, `WARN_LIEFERT_LAENGE`, `WARN_LIEFERT_VERBFORM` |
| Schritt 03 nennt «LF3», Schritt 04 «LF4» wörtlich im `hint` | `WARN_HINT_OHNE_ABSENDER` |
| kein Vorlauf («im Voraus», «bringen Sie … mit») und kein Querverweis auf das andere Heft in irgendeinem Text der Spur | `ERR_VORAUSSETZUNG_VOR_START`, `ERR_QUERVERWEIS_ALS_BEDINGUNG`, `WARN_QUERVERWEIS` |
| jede Leitfrage hat eine Lösung in den Grenzen von Abschnitt 4 und 6 | `ERR_LF_LOESUNG_MISSING`, `WARN_LF_LOESUNG_ZU_LANG` |

Auch `WARN_*` aus `check-einheiten` lassen das Tor rot. Folgen für das Schreiben:

- Schritt 03 und 04 stehen im Kern und gelten für beide Spuren. Was LF3 und
  LF4 **liefern**, ist darum in beiden Spuren dasselbe (`liefert` gleich), und
  die Schritte nennen nichts, was nur eine Spur hat (kein «Absatz der Quelle»
  im Schritt; die Belegart steht in `scaffolding.produkt` der Spur).
- Verlangt die Spur etwas, das Schritt 03, Schritt 04 oder ein
  `indikator_produkt` nicht aufnimmt — oder umgekehrt —, wird die Spur
  angepasst, nicht der Kern (E14, `SKILL.md` Regel 7).
- Der Fall-Ausschluss (`ERR_V42_R9_FALL`) gilt in jedem Text der Spur.

**Wörter, die in Texten für Lernende nicht stehen** (alles ausser `loesung`,
`loesung_zeilen`, `erwartung`): «Spur», «Pflichtquelle» (heisst «Quelle»; dazu
«Ersatzquelle», «Vertiefung (freiwillig)»), Woche, Lektion, Minuten. Kein
Verweis auf den gemeinsamen Auftrag. Sie-Form. Gemeint ist Unterrichtszeit: Die Dauer
eines Produkts oder eines Ausschnitts («Statement von zwei Minuten») darf stehen
(`references/sprache.md` §2). Mehr: `references/sprache.md`.

## 14. Prüfen nach jeder Datei

```
node scripts/check-v42.mjs <ordner>
node scripts/check-lf-loesung.mjs <ordner>
```

`ERR_V42_DATEI` für noch fehlende Dateien ist erwartet; `ERR_V42_GLOSSAR` und
die Befunde zu `abschluss.loesung` lösen sich in Phase 6 und 7. Jeder andere
Befund zu `spuren.*` oder zu einer eingebundenen Karte wird sofort behoben.
`check-einheiten` und die Leck-Prüfung laufen im Tor
(`references/phase-9-tor.md`).
