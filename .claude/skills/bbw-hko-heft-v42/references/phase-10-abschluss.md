# Phase 10 — Abschluss vor der Freigabe

Das Tor prüft Form. Die Gegenleser finden, ob sich ein Heft bearbeiten lässt —
nicht, ob stimmt, was darin steht. In der Serie vom 02.–05.10.2026 kamen die
meisten inhaltlichen Fehler erst in einer nachträglichen Abschlussrunde zum
Vorschein: rund 35–40 falsche oder überzogene Rechts- und Sachaussagen in
mindestens neun Einheiten, dazu Rechenfehler und Lösungen, die nach dem Audit
geändert und nicht mehr geprüft worden waren. Diese Runde ist darum eine Phase
jedes Laufs und kein Nachtrag mehr.

Herkunft: ENTSCHEIDE E32 («Abschlussrunde je Einheit») und E34; Rückblick
(`docs/upgrade-v4.2/RUECKBLICK-produktion-2026-10-06.md`) §1 Schritt 9, §4,
§5.2–§5.4; die Dateien `NACHTRAG.md` der Läufe vom 03.–05.10.2026; die Prompts
`docs/cloud-run/prompts/archiv/abschluss-2.1.1.md`, `abschluss-2.3.1.md` und
`docs/cloud-run/prompts/sofort/1a-abschluss-5.2.1.md`; die Berichte
`docs/cloud-run/laeufe/2026-10-06-*/BERICHT.md` als erste Läufe in dieser Form.
Kürzel in eckigen Klammern wie in `references/lauf.md`.

**Wann:** nach Phase 9 (Tor grün, Gegenlesen abgeschlossen), in jedem Lauf —
Einzelstart, Schleife, Abschluss. **Ergebnis:** derselbe Bericht, weitergeführt
(`assets/bericht-template.md`, Abschnitte 6 bis 11) — keine eigene Datei.

**Was sich ändert und was nicht.** Phase 10 ändert nur Dateien der eigenen
Einheit und ihre eigenen Quellenkarten — dort nur Zeitmarken, Wortzahl bzw.
Dauer, Prüfdatum und `kurzbeschrieb` (`references/lauf.md` §10). Kein Entscheid des Bauplans wird
geändert; `status` bleibt `"entwurf"` bis Schritt 8.

| # | Schritt | Wer | Ergebnis im Bericht |
|---|---|---|---|
| 1 | Offene Befunde abarbeiten | Orchestrator, Executor der Datei | Abschnitt «Offen»: je Punkt ein Stand |
| 2 | Fakten-Audit an Primärquellen | Fakten-Audit (Opus, mit Netz) | Fakten-Tabelle |
| 3 | Zahlen nachrechnen | Orchestrator | Zeile je Rechnung |
| 4 | Erneutes Lesen nach der letzten Änderung | Gegenleser (Sonnet) | Runde und Datum der letzten Lesung |
| 5 | Tor und Messung nach der letzten Änderung | Orchestrator | `check-all.txt`, `messung.txt` |
| 6 | Gegenhör-Liste für Pietro | Orchestrator | Abschnitt «Vor der Freigabe gegenhören und gegensehen» |
| 7 | Vorlage zur Freigabe — **Stopp** | Orchestrator | letzte Nachricht |
| 8 | Freigabe | Orchestrator, nur auf Pietros «ok» | datierter Abschnitt im selben Bericht, Eintrag in ENTSCHEIDE |

Zwischen Schritt 6 und 7 liegen Bericht und Commit (`references/lauf.md` §4
Schritte 10–11).

## 1. Offene Befunde abarbeiten

Quelle der Befunde: was die Gegenleser-Runden offen liessen, was unter
«Unbelegt, nicht geprüft» steht, und jeder Punkt der Art E unter «Offen». Jeder
Befund wird **am heutigen Text nachgeprüft** — er kann durch eine spätere
Korrektur schon erledigt sein. Dann genau einer von drei Ständen
[P-abschluss «Abgabe» Nr. 1]:

- **behoben** — mit Datei und Feld; es korrigiert, wer die Datei schreibt: am
  Heft der Executor A bzw. B, an `set.json` und `begleiter.md` der Executor der
  Datei, an `prinzip.json`, `kn.json` und einer in diesem Lauf neu angelegten
  Methodenkarte der Orchestrator (`references/lauf.md` §4 Schritt 8);
- **stehen gelassen** — mit dem Grund in einem Satz;
- **braucht Entscheid** — für Pietro, mit einer Empfehlung. Nicht selbst
  entscheiden, was der Bauplan festlegt oder was eine geteilte Datei betrifft.

Ausdrücklich nachsehen — an diesen Stellen fehlten die Läufe:

1. **Der Kurzbeschrieb einer Quellenkarte verrät die Lösung nicht.** Er nennt
   Thema und Form der Quelle, nicht die Aussagen, die das Raster sucht — er
   steht auf der QR-Seite. Eine eigene Karte dieser Einheit wird gekürzt; eine
   bestehende Karte gehört in den Bericht (eigen und bestehend:
   `references/lauf.md` §10). [Rb §4 «Quellenkarte verrät die
   Lösung», rund elf Karten; N `2026-10-04-311` §6]
2. **Auftrag über dem Raster, Rezeptionskarte auf S. 6 und Checkliste auf S. 8
   sagen dasselbe** über den Begriff der letzten Spalte, in beiden Heften und
   beiden Spuren. [P-abschluss Auftrag Nr. 1; `phase-9-tor.md` §3 Nr. 9]
3. **Was als Lehrmittel- oder Quellenaussage dasteht, steht dort.** Was das
   Heft selbst folgert, ist als Fallüberlegung gekennzeichnet. [Rb §4
   «Ableitung steht als Quellenaussage da», rund 15 Stellen]
4. **Zeiger:** jede Seite, jeder Absatz, jede Zeitmarke, jede URL, jede
   Wortzahl, die ein Heft, eine Lösung oder eine Karte nennt — am Kapitel bzw.
   am Archivtext in voller Auflösung nachgeschlagen. `node
   scripts/check-zeiger.mjs <ordner>` (sobald vorhanden) übernimmt den
   mechanischen Teil. [Rb §4 «Falscher Zeiger», rund 25 Stellen; §5.2]
5. **Abgeleitete Einheit:** Ist die Einheit aus einer anderen entstanden
   (Anpassungsplan), gilt sie als neue Einheit — volle Audits, kein Beleg wird
   übernommen. [Rb §5.4 «Einheit aus Einheit»: 3.1.1 hat Fehler der
   Gold-Einheit geerbt]

## 2. Fakten-Audit an Primärquellen

**Wer:** ein eigener Subagent, Opus, mit Netz. Er ändert nichts. [P-1a
Schritt 4; B `2026-10-06-5.2.1_gesetze_veraendern` §6]

**Was:** jede Rechts- und Sachaussage über die Welt in `prinzip.json`,
`kn.json`, beiden Heften, `set.json`, `begleiter.md` und den Quellenkarten der
Einheit: Artikelnummern, Fristen, Beträge, Prozente, Daten,
Unterschriftenzahlen, Abstimmungsergebnisse, jedes «Stand …». Nicht: die
erfundenen Fallzahlen einer Situation (die prüft Schritt 3).

**Woran:** an der Primärquelle — Gesetz und Amt (fedlex.admin.ch, admin.ch,
bfs.admin.ch, ch.ch, die Seiten der Kantone und Gerichte), frei zugänglich,
ohne Konto. Nicht am Lehrmittel, nicht an einem Medienbericht: Das Lösungs-Audit
prüft gegen Quelle und Lehrmittel, das Fakten-Audit gegen Gesetz und Amt.
[Rb §5.3 Nr. 6]

**Ausgangspunkt:** Bauplan §10 «Fakten» (`references/phase-1-bauplan.md` §3.14).
Jede Zeile von dort wird am fertigen Text erneut geprüft; dazu jede Aussage,
die beim Schreiben hinzukam. Trägt der Bauplan keinen §10, beginnt das Audit
bei null. [Rb §5.2 «Fakten im Bauplan **und** Fakten-Audit nach dem Schreiben»]

**Ergebnis — eine Tabelle**, im Bericht (Abschnitt 6) oder, wenn sie dafür zu
lang ist, als `fakten-tabelle.md` im Laufordner:

| Nr. | Aussage (in eigenen Worten) | Datei › Feld | Primärquelle (Kurzname, URL) | Abruf | Urteil |
|---|---|---|---|---|---|

Urteil ist genau eines von: **stimmt** (heute an der genannten Stelle gelesen)
· **vertretbar vereinfacht** (stimmt in der Sache; was weggelassen ist, steht
in einem Halbsatz) · **stimmt nicht** · **nicht belegbar** (nicht abrufbar oder
nirgends amtlich zu finden). [P-1a Schritt 4; B `2026-10-06-5.2.1_…` §6;
`fakten-tabelle.md` des Laufs `2026-10-06-4.3.1_vielfalt_untersuchen`]

**Kein Wortlaut.** Die Tabelle nennt die Aussage in eigenen Worten und die
Fundstelle — keinen Satz aus Gesetz, Lehrmittel, Artikel oder Transkript, keine
Namen von Personen aus den Quellen. Sie liegt im öffentlichen Repo.

**Was daraus folgt** [P-1a Schritt 4]:

- **stimmt nicht** → Korrektur im Feld (Executor der Datei), danach Schritt 4.
- **nicht belegbar** → als Fallüberlegung kennzeichnen oder streichen; was
  stehen bleibt, kommt in die Vorlage zur Freigabe.
- Die Schlüsselstellen — alles, woran eine Lösung oder eine Rasterzeile hängt —
  liest der Orchestrator selbst an der Quelle nach, bevor er korrigieren lässt.
- Widerspricht das **Lehrmittel** dem Gesetz, wird das nicht still entschieden:
  Die Stelle kommt in den Bericht (Kürzel S, «betrifft jede Einheit mit
  Kapitel …») und in die Vorlage zur Freigabe.
  [B `2026-10-06-4.3.1_vielfalt_untersuchen` §10]

**Kein Netz** (Cloud-Lauf): Das Audit entfällt nicht — es steht als «nicht
geprüft» im Bericht, und die Einheit ist nicht freigabereif, bis es lokal
nachgeholt ist. [E32: Freigabe erst nach «Fakten an amtlichen Quellen»]

`fakten.json` und `node scripts/check-fakten.mjs <ordner>` (sobald vorhanden):
Dann gibt das Audit sein Ergebnis zusätzlich als Datei ab, ausserhalb des Repos
im Quellenarchiv unter `_pruefung/<ordnername>/fakten.json`; im Laufordner
liegt nur das Prüfprotokoll. Handweg bis dahin: die Tabelle. [Rb §5.1;
Entscheid Pietro 07.10.2026]

## 3. Zahlen nachrechnen

Von Hand, jede einzeln [P-1a Schritt 6; Rb §4 «Rechenfehler, Zahlen
uneinheitlich», rund zwölf Stellen]:

- jede Rechnung in Situation, Zahlentabelle, Beispielbild, Lösungsbild,
  Lösungen und Begleiter (Summe, Differenz, Prozent, jedes «x von y»);
- die Fallzahlen der Situation stehen **überall gleich**: Situation ↔
  Beispiel S. 6 ↔ Lösung ↔ Checkliste ↔ Begleiter; ebenso Wochentage und Daten;
- Dauer und Länge einer Quelle: Karte, Heft und Archivkopf nennen dieselbe Zahl.

Im Bericht: je Rechnung eine Zeile (Feld, Rechnung, stimmt oder korrigiert).

## 4. Erneutes Lesen nach der letzten Änderung

Die Schritte 1 bis 3 ändern Text. Was danach niemand mehr gelesen hat, ist
nicht geprüft — in vier Läufen wurden Lösungen nach dem Audit geändert und nie
wieder angesehen. [Rb §4 letzte Zeile; `gegenleser.md` §2]

- Hat ein Schritt **sichtbaren Text** geändert, auch nur gekürzt: Die
  Lernenden-Gegenleser der betroffenen Dokumente lesen die geänderten Seiten
  noch einmal.
- Hat ein Schritt eine **Lösung** geändert (LF1 bis LF4, Raster, Befund,
  Erwartung, Lösungsbild, Abschluss): Das Lösungs-Audit prüft dieses Feld noch
  einmal, mit dem Material in voller Auflösung (`gegenleser.md` §4.2).
- Höchstens drei Runden, über Phase 9 und Phase 10 zusammen gezählt. Was dann
  offen ist, steht unter «Offen». [P-1a Schritt 5, P-abschluss Auftrag Nr. 3]

Der Bericht nennt, in welcher Runde und nach welcher Änderung zuletzt gelesen
wurde. Eine Datei, die danach noch geändert wurde, nennt er als «nicht
gegengelesen».

## 5. Tor und Messung nach der letzten Änderung

Vollständig nach `references/phase-9-tor.md` §1, einschliesslich Marker-Skript,
Export, Messung, Bestand und Build. Die Ausgaben von `check-all` und
`messen-v42` gehen ganz nach `check-all.txt` und `messung.txt` im Laufordner.
[P-abschluss Auftrag Nr. 4; P-1a Schritt 7]

## 6. Gegenhör-Liste für Pietro

Kein Modell hört ein Audio oder sieht ein Video; gelesen sind Untertitel und
Transkripte. Was daran hängt, hört ein Mensch gegen — einmal, mit Kopfhörer, in
einem Durchgang. Die Liste ist so geschrieben, dass er nur abhaken muss.
[P-abschluss «Abgabe»; B `2026-10-06-5.2.1_…` §9; Rb §5.2 letzte Zeile]

Je Audio und Video der Einheit (Quelle, Ersatzquelle, Vertiefungen):

- Quellen-ID · Titel · Sendung · Datum · Adresse der QR-Seite
- **Ausschnitt von–bis**, und woran das Ende zu erkennen ist (läuft der Player
  in den nächsten Beitrag?)
- **jede Zeitmarke, die Heft oder Lösung nennt** — dahinter in eigenen Worten
  auf Hochdeutsch, was dort zu hören sein soll, und wer spricht (Rolle, kein
  Name)
- welche Rasterzeile, Frage oder Lösung an dieser Stelle hängt
- worauf sonst zu achten ist: Mundart, Namen im Ausschnitt, Zahlen, die das
  Heft bewusst weglässt

Dazu **gegensehen** (kein Ton): Webseiten und Grafiken am Handy — finden
Lernende die Stelle so, wie die Erwartung sie zählt? · am Papier die Seiten mit
0 px Reserve (meist S. 6) und die Arbeitsfläche S. 7 · die QR-Seite
`/m/<ordner>` mit Player, Startpunkt und Kurztexten.

Hat die Einheit weder Audio noch Video, heisst der Abschnitt «gegensehen» und
enthält nur den zweiten Teil.

## 7. Vorlage zur Freigabe — der zweite Stopp

Nach Bericht und Commit legt der Orchestrator vor [P-1a «EINZIGER STOPP»]:

1. grün oder nicht (Tor, Messung, letzte Lesung);
2. die Gegenhör-Liste (Schritt 6);
3. die offenen Punkte, zuerst die, die einen Entscheid brauchen — je mit
   Empfehlung;
4. die Fakten mit Urteil «nicht belegbar» und was mit ihnen geschah;
5. ein Satz: freigabereif nach dem Gegenhören — ja oder nein («nein» immer,
   wenn ein Überlauf über 2 px offen ist oder das Fakten-Audit fehlt);
6. der Hash des Commits «Einheit …» (er steht nicht im Bericht).

Dieselben Punkte stehen in `references/lauf.md` §9 und, ohne den Hash, im
Bericht (Abschnitt 11).

**Einzelstart und Abschluss:** warten auf Pietros «ok». **Schleife:** nicht
warten; die Vorlage steht im Bericht (Abschnitt 11), der nächste Durchgang
beginnt (`references/lauf.md` §9). Eine Einheit aus der Schleife bleibt
`"entwurf"`, bis Pietro sie über den Start «Abschluss» oder selbst freigibt.

Entscheidet Pietro am Stopp etwas, das Daten ändert: umsetzen, Schritte 4 und 5
für die geänderten Stellen, und im **selben Bericht** einen datierten Abschnitt
anfügen («Nachtrag vom JJJJ-MM-TT — Entscheide Pietro»), der sagt, was
entschieden, was geändert und was davon nicht mehr gegengelesen ist. Ändert ein
solcher Entscheid einen Entscheid des Bauplans, steht das dort ausdrücklich.
[B `2026-10-06-5.2.1_…` §13, B `2026-10-06-4.3.1_…` §9a]

## 8. Freigabe — nur auf Pietros «ok»

Nie von sich aus, nie in der Schleife. [E32, E33; P-1a «NACH DEM OK»]

```
(set.json: "status": "publiziert")
npm run build:einheiten-index
node scripts/check-all.mjs <ordner>
node scripts/bestand-v42.mjs --pruefen
npm run build
```

1. In `set.json` `"status": "publiziert"` setzen — das Feld bleibt stehen;
   `check-all` lässt nur `"entwurf"`, `"publiziert"` oder ein fehlendes Feld
   zu. [E32]
2. Die vier Befehle: Index neu, `check-all` GRUEN, Bestand unverändert, Build
   Exit 0.
3. Commit «Freigabe: `<ordner>`» mit `set.json`, den zwei Index-Dateien und dem
   Bericht — darin jetzt nachgetragen: der Hash des Commits «Einheit …». Vorher `node scripts/check-leck.mjs --staged`.
4. Eintrag in `docs/upgrade-v4.2/ENTSCHEIDE.md`, nächste freie Nummer: welche
   Einheit, was vorher lief, was bei der Freigabe geprüft wurde, wo die offenen
   Punkte stehen, wie es rückgängig geht. Der Eintrag hält eine Freigabe fest,
   keine Regel. Die Pflicht aus `SKILL.md` §1 — einen Entscheid in derselben
   Session in die Skill einarbeiten — trifft die Session, die eine Regel
   **entscheidet**, nicht den Lauf: Ein Lauf fasst die Skill nicht an und
   meldet Regel-Lücken mit Kürzel S im Bericht (`references/lauf.md` §10).
5. **Merge nach `main`, Push und Deploy nur, wenn Pietro es in diesem «ok»
   ausdrücklich verlangt** — sonst endet die Skill beim Commit. [`SKILL.md` §5
   Nr. 1; P-1a]

Rückgängig: `status` in `set.json` zurück auf `"entwurf"`, Index bauen,
ausliefern. [E32]
