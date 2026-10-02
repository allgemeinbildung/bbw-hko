# Phase Q — Quellen (nur lokal)

Ergebnis: je Heft mit Medien-Spur bis zu vier Quellenkarten unter
`src/data/quellen/`, die Volltexte im Archiv ausserhalb des Repos, der
Quellen-Abschnitt des Bauplans gefüllt. Danach folgt der eine Stopp (Freigabe
des Bauplans). Phase Q fragt nicht nach; was offen bleibt, steht im Bauplan.

**Nur lokal.** Eine Cloud-Session hat weder die SRG-API noch Swissdox
(`docs/cloud-run/README.md`, «Was die Cloud nicht kann»). Im Auto-Modus läuft
Phase Q nie: Dort gilt, was als Karte **und** als Archivtext vorliegt.

Grundlagen dieser Datei: `docs/upgrade-v4.2/ENTSCHEIDE.md` (E6, E11, E14, E16,
E21, E23, E24), `docs/upgrade-v4.2/01_Leitfaden_v4.2.md` (§4.4, §5, §11.4, §13),
`docs/upgrade-v4.2/BERICHT.md` (§8), `scripts/check-v42.mjs`,
`scripts/check-all.mjs`. Bei Widerspruch gilt die Reihenfolge aus `SKILL.md` §1.

## 1. Wann Phase Q läuft

| Lage nach Phase 0 | Phase Q |
|---|---|
| Heft führt die Medien-Spur neben der Spur ohne Medien | läuft; scheitert sie, bleibt dem Heft die Spur ohne Medien (E23) |
| Spur `ohne_medien` ist unzulässig — das Heft verlangt «Rezeption mündlich» oder «Rezeption audiovisuell» (Leitfaden §4.4, `ERR_V42_R4`) | **Pflicht**; ohne Quelle gibt es das Heft nicht |
| Heft hat laut Phase 0 keine Medien-Spur | entfällt für dieses Heft |

Phase Q beginnt erst, wenn der Bauplan Fall, Leitfrage und Handlungsprodukt
jedes Hefts nennt (§4) und die Fall-Begriffe des KN führt (§5) — daraus
entstehen der Suchauftrag und der Fall-Ausschluss.

## 2. Slots und IDs

Je Heft vier Slots. IDs nach `references/ableitungsregeln.md` (ENTSCHEIDE E21):

| Slot | ID | Rolle im Heft | Pflicht für die Medien-Spur |
|---|---|---|---|
| Quelle | `q-<n><h>-pflicht` | `pflicht`, mit Raster (S. 3) | ja |
| Ersatzquelle | `q-<n><h>-pflicht-ersatz` | tritt an die Stelle der Quelle, wenn sie ausfällt | nein, aber gesucht |
| Vertiefung 1 | `q-<n><h>-vertiefung-1` | `vertiefung`, ohne Raster (S. 4) | nein (0–2 sind zulässig) |
| Vertiefung 2 | `q-<n><h>-vertiefung-2` | `vertiefung` | nein |

`<n>` = Ziffern der Ordnernummer ohne Punkte, `<h>` = `a` oder `b`. Gehört die
ID schon einer anderen Einheit (Karte **oder** Archivordner), gilt die
Ausweichregel aus E21 für den ganzen Satz. Nie eine vorhandene Karte
überschreiben. «Pflichtquelle» heisst gegenüber Lernenden und Lehrperson
«Quelle» (E16); intern bleiben `pflicht` und die IDs.

## 3. Was je Heft herzuleiten ist

Die Gold-Einheit liefert die Form der Karte, nicht den Typ der Quelle.

1. **Rezeptionsmodus des Hefts:** die Rezeptions-Einträge aus den Sprachmodi
   der Kompetenz(en) des Hefts im nRLP-Datensatz des Lehrgangs — dieselben, die
   später in `nrlp.sprachmodi` des Hefts und `prinzip.modi_pro_heft` stehen
   (aus beiden liest `regel4`). Nennt die Kompetenz keinen Rezeptionsmodus,
   gilt der des Themas (Leitfaden §5: T1/T4/T8 schriftlich, T2/T6 mündlich,
   T3/T5 audiovisuell).
2. **Typ der Quelle** aus dem Modus:

   | Rezeptionsmodus (`sprachmodus` der Karte) | `typ` der Quelle | Längenfeld |
   |---|---|---|
   | Rezeption schriftlich und bildlich | `artikel`, `grafik`, `datensatz`, `rechtstext` | `woerter` |
   | Rezeption mündlich | `audio` | `dauer_sek` |
   | Rezeption audiovisuell | `video` | `dauer_sek` |

   Die drei Wege sind gleichwertig; keiner ist der Normalfall. `webseite` ist
   nur für eine Vertiefung zulässig (`regel2Laenge` lehnt den Typ in der Rolle
   der Quelle ab).
3. **Abdeckung prüfen:** Der `sprachmodus` der gewählten Quelle ist ein
   Rezeptionsmodus, den das Heft führt. Verlangt das Heft mündlich **und**
   audiovisuell, trägt die Quelle den Modus, den die Kompetenz zuerst nennt;
   der andere steht im Bauplan als Lücke (§8 «Abdeckung»).
4. **A und B möglichst verschieden** im Typ (Leitfaden §5) — soweit die Modi
   beider Hefte es zulassen. Gleicher Typ ist ein Zugeständnis und steht im
   Bauplan.
5. **Vertiefungen** dürfen einen anderen Modus tragen als die Quelle; sie
   decken keinen Modus des Hefts ab (freiwillig).

## 4. Werkzeuge der lokalen Session

Vor dem ersten Aufruf die `SKILL.md` der genannten Skill lesen (sie liegen unter
`C:\Users\lp4prossi\.claude\skills\`).

| Skill | Wofür in Phase Q |
|---|---|
| `srgssr-api` | SRF-Beiträge finden, Segmente mit eigener URN, Embed-Link, Dauer; VTT-Untertitel als Transkript eines Videobeitrags |
| `swissdox-research` | Volltext-Transkripte von SRF-Audio und -Video, Artikel aus Schweizer Medien; Login-Check vor jeder Operation |
| `swissdox-automation` | ein einzelnes SRG-Audiosegment aus dem Transkript der ganzen Sendung ausschneiden |
| `quellen-recherche-erfassen` | Ablauf der Recherche, Dateikopf, Haltbarkeitsklasse, Liste der verworfenen Funde |
| Web-Suche | Behörden und Fachstellen zuerst, danach frei zugängliche Schweizer Medien |

Eine lokale Transkription (Whisper, beschrieben in `srgssr-api`) verlangt vor
jedem Download Pietros Freigabe. Phase Q fragt nicht: Der Beitrag gilt als
«ohne Transkript», und der Bauplan nennt ihn als Möglichkeit.

## 5. Fan-out (E6)

| Worker | Auftrag | Kandidaten |
|---|---|---|
| je Heft einer | Quelle **und** Ersatzquelle — dasselbe Kandidatenfeld, weil der Ersatz denselben Auftrag und dasselbe Raster tragen muss | vier |
| je Vertiefung einer | eine Vertiefung | zwei bis vier |

Höchstens sechs Worker für zwei Hefte. **Swissdox läuft in keinem parallelen
Worker**; fehlende Volltexte holt die Hauptsession in einem einzelnen Nachlauf.

### Vorlage für den Worker-Auftrag

```
Auftrag: Kandidaten für den Slot <Slot> von Heft <A|B> der Einheit <ordner>.

Wofür: <Fall in einem Satz> · Leitfrage des Hefts: <…> · Handlungsprodukt: <…>
Was die Quelle leisten muss: <der Schritt 03 des Produkts in einem Satz>
Rezeptionsmodus: <…> → Typ: <…> · Höchstlänge: <… Sek. | … Wörter>
Einsatz: Lernende im <N>. Lehrjahr, auf dem Handy, ohne Konto.

Harte Regeln
1. Nichts erfinden. Jeder Kandidat ist in dieser Session abgerufen.
2. Fall-Ausschluss: kein Kandidat mit <Fall-Begriffe aus Bauplan §5
   und die gesperrten Wörter aus E24>. Am Rand vorkommend: mit Fundstelle melden.
3. Frei zugänglich: Abruf ohne Cookies, keine Paywall, kein Login, keine App.
4. Nichts ins Repo schreiben. Keine Karte. Nur Kandidaten.
5. Kein Swissdox. Fehlt ein Volltext: «Volltext fehlt — Swissdox nötig».
6. Keine Subagenten. Keine Änderung an fremden Dateien.

Reihenfolge: SRG-API (URN bestätigen, Dauer messen, VTT holen) → Web
(Behörden, Fachstellen, dann Medien).
Zugeständnisse in dieser Folge: Ausschnitt statt ganzer Beitrag → anderer Typ
im selben Rezeptionsmodus → Behörde oder Fachstelle → älterer Beitrag, dessen
Sachlage heute stimmt.

Archiv je Kandidat: D:\OS\_lab\quellen-archiv\bbw-hko\<quellen-id>\kandidat-<N>\quelle.md
(Kopf und Volltext nach Abschnitt 9).

Rückgabe je Kandidat, bester zuerst, kein Rohtext:
Titel exakt · Herausgeber · Datum · Typ · URL/URN · Länge des Ausschnitts
(gezählt bzw. gemessen) · Verortung · Prüfnachweis (was, Status, wann) ·
Sachlage (Erhebungsjahr, Rechtsstand) · Ausschluss-Check · Passung in einem
Satz · Raster-Probe: vier Stichwort-Zeilen in den Spalten des Typs (nur
Quelle/Ersatz) · Zugeständnis · Archivpfad · Risiko.

Stopp: nach <vier | zwei bis vier> geprüften Kandidaten oder wenn die
Suchwege erschöpft sind. Dann melden, auch wenn nichts genügt.
```

## 6. Auswahlregeln

Jede Regel gilt für den **Ausschnitt**, den die Karte in `verortung` nennt.

| Regel | Mass | Prüft |
|---|---|---|
| Höchstlänge der Quelle | `audio`/`video`: `dauer_sek` ≤ 240 · `artikel`: `woerter` ≤ 450 · `grafik`/`datensatz`: `woerter` ≤ 250 (Grafik samt Begleittext) · `rechtstext`: höchstens drei Artikel, von Hand | `regel2Laenge` → `ERR_V42_R2_LAENGE` |
| Höchstlänge einer Vertiefung | `audio`/`video`: `dauer_sek` ≤ 360; andere Typen ohne Grenze im Skript | `regel2Laenge` |
| Längenfeld ist eine Zahl | gezählt (Wörter des Archivtexts im Ausschnitt) bzw. gemessen (Sekunden zwischen `von` und `bis`), nie geschätzt | `ERR_V42_R2_LAENGE` |
| Ersatzquelle | gleicher Auftrag, gleiches Raster (Leitfaden §5); gleicher `typ` **oder** gleicher `sprachmodus`; sie erbt Rolle und Grenzen der Quelle | `ERR_V42_ERSATZ`, `regel2Laenge` |
| Fall-Ausschluss | kein Begriff des KN-Falls im Ausschnitt und in keinem Feld der Karte | `ERR_V42_R9_FALL` |
| Transkriptpflicht | siehe unten | — (E23) |
| Sachlage | Datum, Erhebungsjahr, Rechtsstand und Beträge stimmen am Prüftag | `sachlage_geprueft` |
| Haltbarkeit | die Frage hängt nicht von einem Ausgang ab, der beim Einsatz offen oder überholt ist (Klassen A/B/C in `quellen-recherche-erfassen`) | — |
| Zugang | keine Paywall, kein Login, keine App; Abruf ohne Cookies geprüft | — |
| Handy | Text, Grafik und Player sind auf dem Handy lesbar bzw. bedienbar | — |

**Transkriptpflicht (E23).** Ohne Volltext oder Transkript im Archiv gibt es
keine Quelle mit Raster — eine Lösung mit Fundstelle wäre nicht zu schreiben.

| Typ | Als Quelle zulässig, wenn |
|---|---|
| Artikel, Grafik, Datensatz, Rechtstext | der Ausschnitt als Text im Archiv liegt (Grafik: Werte als Tabelle abgeschrieben) |
| SRG-Video | VTT-Untertitel des Ausschnitts im Archiv liegen |
| SRG-Audio | Swissdox ein Transkript führt (SRG-Audio hat keine Untertitel) |
| Audio/Video anderer Herausgeber | ein vom Herausgeber veröffentlichtes Transkript im Archiv liegt |

Als **Vertiefung** ist ein Beitrag ohne Transkript nur zulässig, wenn ein vom
Herausgeber veröffentlichter Begleittext im Archiv liegt; die Erwartung im Heft
trägt dann den Vermerk «nicht gegengehört» (`references/phase-5-spuren.md`).

**Fall-Ausschluss, Lesart E11.** Massgebend ist die Verortung: Der Ausschnitt
ist frei von den Begriffen des KN-Falls. Dass dasselbe Dokument an anderer
Stelle einen solchen Begriff nennt, ist toleriert und steht als Zugeständnis im
Bauplan; wo möglich, zeigt die `url` direkt auf den Ausschnitt. Das Skript
liest dagegen **jedes Feld der Karte** ohne Ausnahme (auch `titel`,
`titel_original`, `url`, `lizenz_hinweis`): Steht ein Begriff dort, scheidet
der Kandidat aus. Begriffe in Phase Q: die Fall-Begriffe aus §5 des
Bauplans (später `prinzip.hybrid_situation_spec.fall_ausschluss_hefte_und_auftrag`)
und die sechs fest gesperrten Wörter aus E24.

## 7. Kohärenz-Audit nach der Wahl

Eine Quelle kann alle formalen Regeln bestehen und das Heft doch nicht tragen
(E14; BERICHT §8, Punkte 1, 2 und 8). Darum vor dem Schreiben der Karte, am
Archivtext des Ausschnitts:

| Frage | Bestanden, wenn |
|---|---|
| Trägt der Ausschnitt LF3? | er beantwortet die Analysefrage, die der Bauplan für das Heft vorsieht — nicht eine benachbarte |
| Trägt er Schritt 03 des Produkts? | was Schritt 03 verlangt, lässt sich mit Belegen aus dem Ausschnitt tun |
| Trägt er den Indikator des Ges-Kriteriums? | der Indikator am Produkt hat im Ausschnitt eine Grundlage |
| Raster füllbar? | vier Zeilen in den Spalten des Typs, jede mit Fundstelle (Absatz, Seite, Zeitmarke, Reihe der Grafik) |
| Ersatzquelle: gleiches Raster? | dieselben Spalten und derselbe Auftrag liefern auch dort vier Zeilen |
| Je Vertiefung: Erwartung schreibbar? | eine Antwort auf die Leitfrage der Vertiefung mit Fundstelle im Ausschnitt |

Fällt eine Antwort negativ aus: **nächster Kandidat**. Genügt keiner, wird die
**Frage an die Quelle angepasst**, nie die Quelle an die Frage — die geänderte
Frage steht im Bauplan. Der Kern des Hefts (Schritt 03, Indikator) wird für
eine einzelne Spur nicht verbogen (E14). Die vier Raster-Stichwortzeilen und
die Erwartungen des Audits gehen als Arbeitsnotiz in den Archivordner; sie
sind der Ausgangspunkt von Phase 5.

## 8. Karte schreiben

Datei `src/data/quellen/<id>.json`, Skelett `assets/quelle-template.json`.
Es gibt genau die folgenden Felder; kein weiteres.

| Feld | Inhalt | Regel |
|---|---|---|
| `id` | = Dateiname ohne `.json` | Pflichtfeld |
| `typ` | `artikel` · `grafik` · `datensatz` · `rechtstext` · `audio` · `video`; `webseite` nur Vertiefung | Pflichtfeld |
| `titel` | Titel, wie er gedruckt wird | Pflichtfeld; ≤ 80, Vertiefung ≤ 70 |
| `titel_original` | wörtlicher Titel der Quelle — nur wenn `titel` gekürzt ist, sonst fehlt der Schlüssel | ≤ 400 |
| `herausgeber` | Herausgeber, bei Agenturtext mit Agentur | Pflichtfeld; mit `datum` zusammen ≤ 40 |
| `datum` | Publikationsdatum `JJJJ-MM-TT`; `JJJJ-MM` oder `JJJJ`, wenn die Quelle nicht mehr nennt; `o. D.`, wenn sie keines trägt | Pflichtfeld |
| `url` | Adresse, am Prüftag abgerufen; bei SRG der Embed-Link von SRF Play mit der URN | Pflichtfeld |
| `urn` | URN des Beitrags — nur SRG-Audio und -Video, sonst fehlt der Schlüssel | — |
| `sprachmodus` | einer der drei Rezeptionsmodi im Wortlaut von `references/sprachmodus-ids.md` | Abgleich bei der Ersatzquelle |
| `verortung` | Text, Grafik, Rechtstext: `{ "absaetze": "…" }` (Absätze, Abschnitt, Seite, Darstellung) · Audio, Video: `{ "von": "mm:ss", "bis": "mm:ss" }` | gedruckt ≤ 40 |
| `woerter` | Wörter des Ausschnitts als Zahl — nur Textquellen | Grenzen Abschnitt 6 |
| `dauer_sek` | Sekunden des Ausschnitts als Zahl — nur Audio und Video | Grenzen Abschnitt 6 |
| `kurzbeschrieb` | was die Quelle zeigt, **eigene Formulierung, kein Zitat** | Pflichtfeld; ≤ 180 |
| `sachlage_geprueft` | Prüftag `JJJJ-MM-TT` | Pflichtfeld |
| `archiv_ref` | `<id>/gewaehlt` | — |
| `ersatz_ref` | ID der Ersatzkarte; `null`, wenn es keine gibt (auch auf der Ersatzkarte selbst und auf Vertiefungen) | Karte muss existieren, Kette ohne Kreis |
| `lizenz_hinweis` | «Nur Link», dazu was zu Rechten, Transkript oder Prüfung gilt | — |
| `konstruiert` | `false` | Pflichtfeld, exakt `false` |

Pflichtfelder: `pflichtfelderKarte` → `ERR_V42_KARTE_PFLICHTFELD`. Budgets:
`budgetKarte` → `ERR_V42_BUDGET`. Dazu:

- **Kurzeintrag S. 1** (nur Quelle und Ersatzquelle): die Zeile
  «`titel` · `herausgeber`, `datum`» ist ≤ 100 Zeichen.
- **Kein Feld über 400 Zeichen** (`regel10Volltext` → `ERR_V42_R10_VOLLTEXT`).
- Kein Eszett, kein Platzhalter (`{{…}}` aus dem Skelett muss weg).

## 9. Archiv

```
D:\OS\_lab\quellen-archiv\bbw-hko\<quellen-id>\
  gewaehlt\quelle.md      Kopf + Volltext bzw. Transkript des gewählten Beitrags
  kandidat-1\quelle.md    geprüft, nicht gewählt
  kandidat-2\quelle.md
```

Kopf von `quelle.md`: Titel, Herausgeber, Datum, URL bzw. URN, **Abrufdatum**
und Werkzeug, Typ, Länge, **Ausschnitt** (Absätze bzw. Zeitmarken),
Prüfnachweis, bei Transkripten die Art (VTT, Swissdox, Begleittext). Darunter
der vollständige Text, Absätze nummeriert bzw. mit Zeitmarken; bei einer
Grafik die Werte als Tabelle.

**Nie im Repo** — weder Volltext noch Auszug, auch nicht im Bauplan.

`check-all` liest das Archiv für die Leck-Prüfung (Konstante `ARCHIV`: lokal
dieser Ordner, im Spiegel `material/_quellen-archiv/`; alle `.md` und `.txt`
unter den Ordnern `q-…`, auch die Kandidaten). Die Dateien der Einheit dürfen
darum keine Wortfolge ab 14 Wörtern aus einem Archivtext enthalten (ab 14
Warnung, ab 25 Fehler `ERR_LEHRMITTEL_WOERTLICH`). Lösungen, Befunde und
Erwartungen sind eigene Formulierungen mit Fundstelle, keine Abschrift.

## 10. Bauplan nachführen und Freigabe

Im Abschnitt «Quellen» des Bauplans (`docs/cloud-run/bauplaene/_VORLAGE.md`,
§7) je Slot eine Zeile: **Slot · Quellen-ID · Stand** (Typ, Titel ·
Herausgeber · Datum, Ausschnitt, Länge, Karte ja/nein, Archivtext ja/nein) ·
**Zugeständnis** (anderes Land, älterer Beitrag, Ausschnitt, gleicher Typ in A
und B, eine an die Quelle angepasste Frage). Ein nicht abgedeckter Modus
steht in §8, was nicht geprüft werden konnte in §9. Kein Text der Quelle im
Bauplan.

Quellen schlägt die Pipeline vor, **Pietro gibt sie frei** (Leitfaden §13) —
mit der Freigabe des Bauplans, nicht in einer eigenen Rückfrage. Wo es eine
gab, nennt §9 die beste verworfene Alternative mit Grund.

## 11. Wenn kein Kandidat genügt (E23)

| Lage | Folge |
|---|---|
| keine Quelle (Karte oder Archivtext fehlt) | Slot «offen»; das Heft bekommt nur `ohne_medien`; Meldung im Bauplan |
| dasselbe, und `ohne_medien` ist unzulässig | Bauplan meldet das Heft als «nicht erzeugbar» mit den geprüften Suchwegen — ein Heft ohne Spur gibt es nicht |
| keine Ersatzquelle | `ersatz_ref: null`; Meldung |
| nur eine oder keine Vertiefung | Medien-Spur mit den vorhandenen (0–2); Meldung |
| Audio oder Video ohne Transkript | als Quelle unzulässig; als Vertiefung nur mit Begleittext im Archiv |

Nie: eine Karte ohne Archivtext, ein Kurzbeschrieb aus dem Gedächtnis.

## 12. Übergabe an die Cloud

Nur lesen und beschreiben; `scripts/cloud-spiegel.mjs` wird nicht geändert.
Ablauf: `docs/cloud-run/README.md` und `docs/cloud-run/START.md`.

- **Karten:** liegen nach Phase Q im Arbeitsbaum. Der Spiegel entsteht aus dem
  **committeten** Stand; Uncommittetes gelangt nicht hinein. Den Commit
  verlangt der Aufruf oder macht Pietro (START.md, Abschnitt B).
- **Volltexte:** `cloud-spiegel.mjs` kopiert aus dem Archiv die Ordner `q-…`
  nach `material/_quellen-archiv/` im privaten Spiegel — nur `.md`, `.txt`
  und `.pdf`. Bilder und Arbeitsordner ohne `q-` gehen nicht mit. Was die
  Cloud lesen soll, steht darum als Text in `gewaehlt\quelle.md`.
- **Im Spiegel** findet die Skill den Archivtext unter
  `material/_quellen-archiv/<quellen-id>/gewaehlt/quelle.md`.
- **Slot «offen»:** Die Cloud erzeugt für dieses Heft nur `ohne_medien` und
  meldet es (`references/auto-modus.md`).

## 13. Fertig ist Phase Q, wenn

- [ ] je Slot entweder Karte **und** `gewaehlt\quelle.md` vorliegen oder der
      Slot im Bauplan «offen» ist — nie nur eines von beiden
- [ ] Typ und `sprachmodus` jeder Quelle aus dem Rezeptionsmodus des Hefts
      hergeleitet sind und der Bauplan die Herleitung nennt
- [ ] das Kohärenz-Audit (Abschnitt 7) für jede Quelle und Vertiefung
      bestanden ist
- [ ] jede Länge gezählt bzw. gemessen ist und unter der Grenze liegt
- [ ] jede Karte nur die Felder aus Abschnitt 8 trägt, ohne Platzhalter
- [ ] kein Text einer Quelle im Repo steht
- [ ] der Bauplan Slot, ID, Stand und Zugeständnis führt

`check-v42` prüft die Karten erst, wenn ein Heft sie einbindet (Phase 5).
