# Auto-Modus — unbeaufsichtigt, ohne Stopp, ohne Rückfrage

Im Auto-Modus beantwortet niemand eine Frage. Die Skill führt einen
freigegebenen Bauplan aus, füllt Lücken nach einer festen Regel, hält jeden
solchen Entscheid fest und endet entweder mit grünem Tor, abgeschlossener
Phase 10 und einem Commit — oder mit der Meldung «nicht erzeugbar».

**Wer was in welcher Reihenfolge tut** (Rollen und Modelle, Vorprüfung,
Parallelität, Messung, Abbruch, Commit) steht in `references/lauf.md`. Diese
Datei sagt, **wie entschieden wird**, wenn niemand antwortet.

## 1. Woran der Auto-Modus erkannt wird

Eines von beiden genügt:

1. `docs/cloud-run/bauplaene/<ordner>.md` trägt die Zeile
   `**Freigabe:** freigegeben am JJJJ-MM-TT` mit einem Datum aus Ziffern
   (dasselbe Muster, das `scripts/cloud-preflight.mjs` prüft).
2. Der Aufruf kommt aus `docs/cloud-run/RUN.md` (Produktionslauf über die
   Auftragsliste).

Kommt der Aufruf aus `RUN.md`, der Bauplan fehlt aber oder trägt
`**Freigabe:** offen`, ist die Zeile **nicht erzeugbar** — der Auto-Modus
schreibt keinen Bauplan und gibt keinen frei.

Trägt der Bauplan die Freigabe und Pietro ist im Gespräch, gilt trotzdem der
Auto-Modus: Der eine Stopp hat stattgefunden.

## 2. Was im Auto-Modus anders ist

| | Mit Bauplan-Stopp | Auto |
|---|---|---|
| Phase 0 | leitet her | läuft nicht als Erzeugung; es bleibt die **Prüfung** der Angaben des Bauplans §1–§2 gegen Datensatz und Kapiteldateien (Abschnitt 7) — sie ist Zeile 7 der Vorprüfung in `references/lauf.md` §3 |
| Phase 1 | schreibt den Bauplan | entfällt — der Bauplan liegt vor |
| Phase Q | Quellensuche | **entfällt** (Abschnitt 6) |
| Stopp | einer | keiner |
| Phasen 2–10 | wie in der jeweiligen Reference | gleich; Werte kommen aus dem Bauplan. Phase 10 läuft bis zur Vorlage zur Freigabe; freigegeben wird nie ohne Pietros «ok» |

## 3. Kein Entscheid des Bauplans wird geändert

Ordnername, Zuschnitt, Kompetenzversprechen, Konfliktarten, Produkttypen,
Spuren, Pol-Typen, Kriterien-Verteilung, Sprachmodi, SK, Hybrid-Fall,
Fall-Begriffe, Lebensbereiche, Methodenkarten und Quellen (welche Quelle,
welcher Ausschnitt — einzelne Felder einer eigenen Quellenkarte bleiben
korrigierbar: `references/lauf.md` §10) werden **so
übernommen, wie sie dort stehen** — auch wenn der Skill beim Schreiben eine
bessere Variante einfällt. Eine bessere Variante gehört in den Bericht, nicht
in die Daten.

Stellt sich ein Entscheid als **unausführbar** heraus (er verletzt eine harte
Regel von `check-v42.mjs`, eine Seite trägt den genannten Inhalt nicht, eine
genannte Karte gibt es nicht), wird er nicht still ersetzt:

- Betrifft es nur die Medien-Spur eines Hefts → dieses Heft bekommt nur
  `ohne_medien` (sofern zulässig), Meldung.
- Betrifft es etwas Unumkehrbares (Ordner, IDs) oder den Kern eines Hefts →
  Einheit «nicht erzeugbar», Grund in den Bericht.
- Betrifft es eine einzelne Formulierung oder ein Budget → innerhalb des
  Entscheids umformulieren (das ist keine Änderung des Entscheids).

## 4. Regel für jede Lücke

Wo der Bauplan schweigt und keine Reference eine Regel nennt:

1. die Variante, die die Reference der Phase empfiehlt;
2. sonst die Variante mit dem **engsten Bezug zum Wortlaut der
   nRLP-Kompetenz** (`kompetenzen[].text` im Datensatz des kanonischen
   Lehrgangs): Sie nimmt die meisten Verben und Gegenstände der Kompetenz
   wörtlich auf;
3. bei Gleichstand die Variante, die weniger voraussetzt (kürzer, ohne
   zusätzliche Quelle, ohne neue Karte).

**Jeder solche Entscheid kommt in den Bericht** mit drei Angaben: was
entschieden wurde, warum (Verweis auf das Wort der Kompetenz oder die Regel),
welche Alternativen verworfen wurden.

Früher ein Stopp, jetzt eine Regel:

| Früherer Stopp | Im Auto-Modus |
|---|---|
| Versprechen wählen | steht im Bauplan §3 |
| Herausforderungen wählen | steht im Bauplan §4 |
| Hybrid-Fall freigeben | steht im Bauplan §5 |
| Lehrmittel-Abschnitt für LF3 ohne Medien länger als drei Seiten | zulässig, wenn der Bauplan §2 die Seiten nennt; sonst der kürzeste zusammenhängende Abschnitt, der vier belegbare Rasterzeilen trägt; Länge und Fundseiten in den Bericht |
| zweite Kompetenz eines Hefts | steht im Bauplan §1 (Zuschnitt); nichts hinzufügen |
| Kapitel ausserhalb der Crosswalk-Zeile (für Fachaussagen) | zulässig, wenn der Bauplan §2 es nennt («Kapitel ausserhalb der Crosswalk-Zeile»); sonst nicht verwenden |
| Methodenkarte aus den Kapiteln 16–20, die die Crosswalk-Zeile nicht nennt | zulässig ohne Eintrag: Die Karte ist die Fundstelle (E27) |
| neue Methodenkarte | nur, wenn der Bauplan §9 «neue Karte nötig» sagt; sonst die nächstpassende vorhandene |

## 5. Voraussetzung fehlt → Verhalten (ENTSCHEIDE E23)

| Es fehlt | Die Skill |
|---|---|
| ein Kapitel aus dem Bauplan bzw. der Crosswalk-Zeile unter `material/_lehrmittel/` | schreibt nichts; Einheit «nicht erzeugbar», Grund im Bericht |
| Quellenkarte **oder** Archiv-Volltext für einen Slot der Medien-Spur | erzeugt für dieses Heft nur `ohne_medien` und meldet es; erfindet keine Quelle, keine Karte, keinen Kurzbeschrieb |
| nur eine Vertiefung | Medien-Spur mit der Quelle und den vorhandenen Vertiefungen (0–2 sind zulässig); Meldung |
| die Spur `ohne_medien` ist unzulässig (Heft verlangt Rezeption mündlich oder audiovisuell, Leitfaden §4.4) **und** die Quelle fehlt | lokal: zuerst die Quellensuche (Phase Q); unbeaufsichtigt: Einheit «nicht erzeugbar» — ein Heft ohne Spur gibt es nicht |
| Transkript eines Audio- oder Videobeitrags | der Beitrag ist als Quelle mit Raster nicht zulässig (keine Lösung mit Fundstelle möglich); als Vertiefung nur, wenn ein vom Herausgeber veröffentlichter Begleittext im Archiv liegt, und dann mit dem Vermerk «nicht gegengehört» in `erwartung` |
| ein Erwartungshorizont mit Fundstelle zu einer Leitfrage | Frage wird umformuliert, bis einer zu schreiben ist; nie umgekehrt |
| ein Entscheid, den weder Bauplan noch Regel deckt | die Variante mit dem engsten Bezug zum Wortlaut der nRLP-Kompetenz; Entscheid, Grund und Alternativen in den Bericht |

Dazu, aus anderen Entscheiden und aus `docs/cloud-run/RUN.md`:

| Es fehlt oder trifft zu | Die Skill |
|---|---|
| Bauplan fehlt oder ist nicht freigegeben | «nicht erzeugbar» |
| Bauplan entspricht E21 nicht und Bauplan §9 nennt die Abweichung nicht als Ausnahme (Abschnitt 7) | «nicht erzeugbar», nichts schreiben |
| Ordner existiert bereits | nie überschreiben. Liegt er ohne Commit da: nicht anfassen, melden, weiter nur über den Start «Abschluss» (`references/lauf.md` §3 Zeile 5) — kein Bericht «nicht erzeugbar», kein Verschieben. «Nicht erzeugbar» nur, wenn der Name einer **anderen** Einheit gehört und kein verlängerter slug frei ist (`references/ableitungsregeln.md` §1.4) |
| Fehler in Renderer oder Skript | nicht reparieren, nicht umgehen (`--baseline` ist verboten); in den Bericht; «nicht erzeugbar», wenn das Tor sonst nicht grün wird |
| Tor nach drei Reparaturrunden rot (Abschnitt 8) | Ordner und neue Karten nach `laeufe/…/abgebrochen/` verschieben (`references/lauf.md` §7), Grund in den Bericht |

«Nicht erzeugbar» heisst immer: kein Ordner unter `src/data/einheiten/`, keine
halbe Einheit, ein Eintrag im Bericht mit dem Grund in einem Satz. Was schon
geschrieben war, wird verschoben, nicht gelöscht (`references/lauf.md` §7).

## 6. Keine Recherche

Im Auto-Modus und in der Cloud gibt es **keine Quellensuche**: kein Zugriff
auf die SRG-API, keiner auf Swissdox, keine Websuche nach Ersatz. Es gilt
nur, was **als Karte und als Archivtext vorliegt**:

| | lokal | im Cloud-Spiegel |
|---|---|---|
| Karte | `src/data/quellen/<quellen-id>.json` | gleich |
| Volltext | `D:\OS\_lab\quellen-archiv\bbw-hko\<quellen-id>\gewaehlt\` | `material/_quellen-archiv/<quellen-id>/gewaehlt/` |

`scripts/check-all.mjs` (Konstante `ARCHIV`) nimmt den ersten der zwei Orte,
den es gibt. Für jeden Slot aus Bauplan §7 vor Phase 5 prüfen: Karte da?
Archivordner mit Text da? Stimmt die ID? Erst dann die Medien-Spur schreiben.
Lösungen, Beispielwerte und Fundstellen der Medien-Spur stammen **nur** aus
dem Archivtext — nie aus dem Kurzbeschrieb der Karte, nie aus dem Gedächtnis.

Der Archivtext wird gelesen, nicht kopiert: Kein Satz daraus steht in einer
Datei des Repos, auch nicht im Bericht.

**Rechts- und Sachaussagen** (Artikelnummer, Frist, Betrag, Datum, «Stand …»)
schreibt die Erzeugung nur, wenn sie in Bauplan §10 «Fakten» mit Primärquelle
stehen (`references/phase-1-bauplan.md` §3.14). Trägt der Bauplan keinen §10
(freigegeben vor dem 07.10.2026): nur aus Lehrmittel, Datensatz und
Archivtext, wie `SKILL.md` §5 Nr. 3. In beiden Fällen prüft das Fakten-Audit
in Phase 10 jede Aussage an der Primärquelle. Das Audit ist keine
Quellensuche: Es liest frei zugängliche amtliche Seiten und wählt keine neue
Quelle für ein Heft (`references/phase-10-abschluss.md` §2). (Herkunft:
Rückblick §5.2; ENTSCHEIDE E34.)

## 7. Prüfung «Bauplan entspricht E21» — vor dem ersten Schreiben

Nach `references/ableitungsregeln.md`. Die Namen rechnet und prüft
`node scripts/check-namen.mjs --vor <ordner>` (Ordner, Laufordner, Quellen-
Muster; je neue Methodenkarte aus Bauplan §9 dazu `--karte <id>`) — vor dem
ersten Schreiben, als Teil der Vorprüfung (`references/lauf.md` §3 Zeile 10).
Der Bauplan besteht, wenn alles zutrifft:

- Ordnername hat die Form `<X.Y.Z>_<slug>`; `X.Y.Z` ist die erste Kompetenz
  von Heft A im kanonischen Lehrgang; `slug` nur aus `[a-z0-9_]`.
- Lehrgang-Suffix genau dann, wenn die Regel ihn verlangt; kein `_v42`.
- `src/data/einheiten/<ordner>/` gehört keiner anderen Einheit. (Liegt der
  Ordner dieser Einheit schon ohne Commit da, ist das kein Fall dieser
  Prüfung, sondern Zeile 5 der Vorprüfung: `references/lauf.md` §3.)
- Quellen-IDs folgen dem Muster der Regel; ein Satz, ein Muster; keine ID
  gehört einer anderen Einheit.
- Weitere Lehrgänge nur, wenn jede Kompetenz dort nummern- und textgleich ist
  (am Datensatz nachprüfen, nicht dem Bauplan glauben).
- Zuschnitt, Kompetenztexte, Modi je Kompetenz und Spuren stimmen mit dem
  Datensatz überein (`references/phase-0-verortung.md`).
- **Kapitel:** Jede Kapiteldatei aus Bauplan §2 liegt unter
  `material/_lehrmittel/`, und die dort genannten Seitenmarken stehen in der
  Datei. Geprüft wird das Vorhandensein, nicht der Inhalt — den hat Phase 0
  vor der Freigabe am Text geprüft.

**Ausnahme aus Bauplan §9.** Nennt Bauplan §9 eine Abweichung von einer
dieser Regeln **ausdrücklich** — mit der Regel, dem abweichenden Wert und dem
Grund —, gilt der Wert des Bauplans, und der Bauplan besteht. Beispiele:
abweichender Ordnername · Quellen-IDs, die einer anderen Einheit gehören
(deren Karten und Archivtexte werden dann verwendet, nicht überschrieben) ·
eine SK ausserhalb des Themas · ein Kapitel ausserhalb der Crosswalk-Zeile
(dieses steht in §2). Die Ausnahme ist ein freigegebener Entscheid wie jeder
andere (Abschnitt 3) und kommt mit ihrem Grund in den Bericht. Dem Datensatz
kann §9 nicht widersprechen: Kompetenztexte, Nummern und die Regel zu
weiteren Lehrgängen gelten immer. Auch ein vorhandener Ordner wird nie
überschrieben.

Besteht er nicht und steht die Abweichung nicht in §9: «nicht erzeugbar». Ein
Ordnername wird nicht «verbessert» — er ist ein freigegebener Entscheid und
nach dem Druck fest.

## 8. Reparaturrunden

Eine Runde = `check-all` laufen lassen, alle Befunde in den **Daten** beheben,
erneut laufen lassen. Die laufende Prüfung mit `check-v42` nach jeder Datei
zählt nicht als Runde.

- **Höchstens drei Runden.** Ist das Tor danach rot: den Ordner der Einheit
  und die Karten, die **dieser Lauf neu angelegt** hat, nach
  `docs/cloud-run/laeufe/<datum>-<ordnername>[-<k>]/abgebrochen/` verschieben —
  nicht löschen (`references/lauf.md` §7); bestehende Karten und alles
  andere bleiben. Grund und letzte Tor-Ausgabe in den Bericht.
- Nie im Skript reparieren, nie eine Regel abschalten, nie einen Befund
  wegdefinieren. Eine Warnung zu wörtlicher Übernahme ist zu beheben wie ein
  Fehler.
- Ein Befund, der sich nur beheben liesse, indem ein Entscheid des Bauplans
  geändert wird, zählt als nicht behebbar (Abschnitt 3).

## 9. Wohin der Bericht geht

Bei jedem lokalen Start — Einzelstart, Schleife, Abschluss, mit oder ohne
Pietro im Gespräch — nach
`docs/cloud-run/laeufe/<JJJJ-MM-TT>-<ordnername>[-<k>]/BERICHT.md`, im Gerüst
`assets/bericht-template.md`. Die Entscheide nach Abschnitt 4 stehen im selben
Bericht (Abschnitt 7 des Gerüsts); Phase 10 schreibt darin weiter
(`references/lauf.md` §8).

Inhalt je Einheit: Ordner; letzte Tor-Ausgabe; Kapitel und Seiten; jede
Quelle mit Prüfdatum; alle Entscheide nach Abschnitt 4; was nicht belegt,
nicht geprüft oder nicht erzeugbar war; aufgefallene Fehler in Skill, Skript
oder Daten. Kein Lehrmittel-, Transkript- oder Artikeltext.

**Commit:** einer je Einheit, nach `references/lauf.md` §8; kein Push.

Der Produktionslauf über `docs/cloud-run/RUN.md` (privater Spiegel) ist seit
dem 03.10.2026 nicht mehr benutzt worden; ob er bleibt, ist offen (Rückblick
§1, §5.5). Kommt ein Aufruf doch von dort, richten sich Ort des Berichts,
Branch und Push nach `RUN.md` — der Ablauf bleibt der aus
`references/lauf.md`.
