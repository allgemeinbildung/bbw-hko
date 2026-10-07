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
| 2 | Fakten-Audit an Primärquellen — abschliessen | Fakten-Audit (Opus, mit Netz), Orchestrator | Zahlen je Urteil; jede Zeile, die nicht «belegt» heisst |
| 3 | Zahlen | Orchestrator | Stand von `check-zahlen`; was es nicht sieht, von Hand |
| 4 | Erneutes Lesen und erneutes Audit nach der letzten Änderung | Gegenleser (Sonnet), Lösungs-Audit (Opus), Fakten-Audit | Runde und Datum der letzten Lesung; `check-belege` ohne `ERR_AUDIT_VERALTET` |
| 5 | Tor (zweiter Durchgang) und Messung nach der letzten Änderung | Orchestrator | `check-all.txt`, `messung.txt`, die fünf Protokolle `*-check.txt` |
| 6 | Gegenhör-Liste für Pietro — erzeugt | Orchestrator (`scripts/gegenhoeren.mjs`) | Abschnitt «Vor der Freigabe gegenhören und gegensehen» |
| 7 | Vorlage zur Freigabe — **Stopp** | Orchestrator | letzte Nachricht |
| 8 | Freigabe | Orchestrator, nur auf Pietros «ok» | datierter Abschnitt im selben Bericht, Eintrag in ENTSCHEIDE |

Zwischen Schritt 6 und 7 liegen Bericht und Commit (`references/lauf.md` §4
Schritte 10–11).

## 1. Offene Befunde abarbeiten

Quelle der Befunde: was die Gegenleser-Runden offen liessen, was unter
«Unbelegt, nicht geprüft» steht, jeder Punkt der Art E unter «Offen», jede
Zeile in `belege.json` mit einem Urteil ausser `stimmt`, jeder Befund in
`probe.json` mit Stand `offen` (`references/audits.md` §2.4, §4.3) und jede
Warnung der Tor-Skripte, die ein Mensch entscheidet (`WARN_KOH_…`). Jeder
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
   Heft selbst folgert, ist als Fallüberlegung gekennzeichnet
   (`references/sprache.md` §7.4). Das stellt das Lösungs-Audit fest (Urteil
   `ableitung`) und `check-belege` prüft die Kennzeichnung
   (`ERR_ABLEITUNG_UNGEKENNZEICHNET`). [Rb §4 «Ableitung steht als
   Quellenaussage da», rund 15 Stellen; E38]
4. **Zeiger:** jede Seite, jeder Absatz, jede Zeitmarke, jede Wortzahl, die
   ein Heft, eine Lösung oder eine Karte nennt, prüft `check-zeiger` im Tor;
   dass an der Stelle steht, was die Lösung sagt, prüft das Lösungs-Audit mit
   seinem Anker. Von Hand bleibt, was das Skript als `HINWEIS_…` meldet
   (Zeitmarken nur auf den Block genau oder nicht prüfbar, Wortzahl nicht
   abgrenzbar) — diese Stellen kommen auf die Gegenhör-Liste (Schritt 6) —,
   und die URLs (`check-links`, mit Netz, nicht im Tor). [Rb §4 «Falscher
   Zeiger», rund 25 Stellen; §5.2; E38 Stufe B]
5. **Abgeleitete Einheit:** Ist die Einheit aus einer anderen entstanden
   (Anpassungsplan), gilt sie als neue Einheit — volle Audits, kein Beleg wird
   übernommen. [Rb §5.4 «Einheit aus Einheit»: 3.1.1 hat Fehler der
   Gold-Einheit geerbt]

## 2. Fakten-Audit an Primärquellen

**Wer:** ein eigener Subagent, Opus, mit Netz. Er ändert nichts. **Auftrag,
Schritte und Form der Abgabe: `references/audits.md` §3** — dieser Abschnitt
sagt nur, was das Audit ist und was im Bericht steht. Es läuft schon neben den
Gegenlesern (`references/lauf.md` §4 Schritt 7); in Phase 10 wird es
abgeschlossen. [P-1a Schritt 4; B `2026-10-06-5.2.1_gesetze_veraendern` §6;
E38 Stufe C]

**Was:** jede Rechts- und Sachaussage über die Welt in `prinzip.json`,
`kn.json`, beiden Heften, `set.json`, `begleiter.md` und den Karten der
Einheit: Artikelnummern, Fristen, Beträge, Prozente, Daten,
Unterschriftenzahlen, Abstimmungsergebnisse, jedes «Stand …» — das findet
`node scripts/check-fakten.mjs <ordner> --liste` am Schriftbild — **und jede
Rechtsaussage ohne Zahl und ohne Artikel**, die nur findet, wer liest. Nicht:
die erfundenen Fallzahlen einer Situation (sie stehen in `fall.json`; Schritt 3).

**Woran:** an der Primärquelle — Gesetz und Amt (fedlex.admin.ch, admin.ch,
bfs.admin.ch, bag.admin.ch, ch.ch, die Seiten der Kantone und Gerichte), frei zugänglich,
ohne Konto. Nicht am Lehrmittel, nicht an einem Medienbericht: Das Lösungs-Audit
prüft gegen Quelle und Lehrmittel, das Fakten-Audit gegen Gesetz und Amt.
[Rb §5.3 Nr. 6]

**Ausgangspunkt:** Bauplan §10 «Fakten» (`references/phase-1-bauplan.md` §3.14).
Jede Zeile von dort wird am fertigen Text erneut geprüft; dazu jede Aussage,
die beim Schreiben hinzukam. Trägt der Bauplan keinen §10, beginnt das Audit
bei null. [Rb §5.2 «Fakten im Bauplan **und** Fakten-Audit nach dem Schreiben»]

**Ergebnis — eine Datei, keine Tabelle:**
`<Quellenarchiv>/_pruefung/<ordnername>/fakten.json`, je Aussage eine Zeile
(Form: `references/belege.md` §5), geprüft von `check-fakten` im Tor. Urteil
ist genau eines von: `belegt` (heute an der genannten Stelle gelesen; auch
«vertretbar vereinfacht» — was weggelassen ist, steht in `bemerkung`) ·
`abweichend` (die Primärquelle sagt etwas anderes) · `nicht_belegbar` (nicht
abrufbar oder nirgends amtlich zu finden).

**Die Fakten-Tabelle im Bericht und die Datei `fakten-tabelle.md` entfallen.**
Im Bericht (Abschnitt 6) stehen: Modell und Abrufdatum · die Zahl der Zeilen
je Urteil · **jede Zeile mit `abweichend` oder `nicht_belegbar`** (Datei ›
Feld, in eigenen Worten, was die Einheit sagte und was die Quelle sagt, URL,
was geschah) · was der Orchestrator selbst nachgelesen hat. Im Laufordner
liegt `fakten-check.txt`. Grund: Eine Tabelle von Hand neben der Datei wäre
eine zweite Fassung derselben Aussagen, die kein Skript prüft und die nach der
ersten Korrektur von der Datei abweicht — genau der Zustand, den die
Beleg-Dateien beenden (die Zeilen der Tabelle waren an kein Feld gebunden;
eine spätere Änderung des Hefts liess sie stehen). Was für die Freigabe zählt, sind
die Ausnahmen; die stehen weiter im Bericht. Wer alle Zeilen sehen will, liest
`fakten.json` im Archiv — `_pruefung/` gehört in dessen Backup. [Rb §5.1;
Entscheid Pietro 07.10.2026 «Beleg-Dateien ausserhalb des Repos»; Entscheid
Executor Stufe C, E38 — bitte bestätigen]

**Kein Wortlaut.** Der Bericht nennt die Aussage in eigenen Worten und die
Fundstelle — keinen Satz aus Gesetz, Lehrmittel, Artikel oder Transkript, keine
Namen von Personen aus den Quellen. Er liegt im öffentlichen Repo.

**Was daraus folgt** [P-1a Schritt 4]:

- **`abweichend`** → Korrektur im Feld (Executor der Datei), danach Schritt 4.
- **`nicht_belegbar`** → als Fallüberlegung kennzeichnen
  (`references/sprache.md` §7.4) oder streichen; was stehen bleibt, kommt in
  die Vorlage zur Freigabe.
- Die Schlüsselstellen — alles, woran eine Lösung oder eine Rasterzeile hängt —
  liest der Orchestrator selbst an der Quelle nach, bevor er korrigieren lässt.
- Widerspricht das **Lehrmittel** dem Gesetz, wird das nicht still entschieden:
  Die Stelle kommt in den Bericht (Kürzel S, «betrifft jede Einheit mit
  Kapitel …») und in die Vorlage zur Freigabe.
  [B `2026-10-06-4.3.1_vielfalt_untersuchen` §10]

**Kein Netz** (Cloud-Lauf): Das Audit entfällt nicht — es steht als «nicht
geprüft» im Bericht, `check-fakten` bleibt rot, und die Einheit ist nicht
freigabereif, bis es lokal nachgeholt ist. [E32: Freigabe erst nach «Fakten an
amtlichen Quellen»]

## 3. Zahlen

`check-zahlen` rechnet im Tor nach, was als Rechnung geschrieben ist
(«a × b = c», Summenzeile einer Tabelle, «p % von a = c»), und prüft mit
`fall.json`, dass jede Fallzahl überall denselben Wert hat und dass Beispiel,
Lösungsbild und Lösungen nichts zeigen, was die Situation ausschliesst. Dauer
und Wortzahl einer Quelle prüft `check-zeiger` an Karte und Archivtext.
[Rb §4 «Rechenfehler, Zahlen uneinheitlich», rund zwölf Stellen; E38 Stufe B]

Von Hand bleibt [P-1a Schritt 6]:

- **`fall.json` stimmt mit der Situation überein** — die Datei schreibt, wer
  die Situation schreibt (`references/belege.md` §6); fehlt eine Zahl darin,
  prüft das Skript sie nicht. `node scripts/check-zahlen.mjs <ordner> --liste`
  zeigt jede Zahl mit Einheit, die im Text steht.
- **Rechnungen in Worten**, die kein «=» tragen («bleibt ihr die Hälfte»,
  «doppelt so viel wie»), und Wochentage oder Daten, die `fall.json` nicht als
  ausgeschlossen führt.

Im Bericht: die letzte Zeile von `check-zahlen`, und je von Hand nachgerechnete
Stelle eine Zeile (Feld, Rechnung, stimmt oder korrigiert).

## 4. Erneutes Lesen und erneutes Audit nach der letzten Änderung

Die Schritte 1 bis 3 ändern Text. Was danach niemand mehr gelesen hat, ist
nicht geprüft — in vier Läufen wurden Lösungen nach dem Audit geändert und nie
wieder angesehen. Für Lösungen und Fakten erzwingt das heute das Tor; für den
sichtbaren Text bleibt es eine Regel. [Rb §4 letzte Zeile; `gegenleser.md` §2;
E38]

- Hat ein Schritt **sichtbaren Text** geändert, auch nur gekürzt: Die
  Lernenden-Gegenleser der betroffenen Dokumente lesen die geänderten Seiten
  noch einmal.
- Hat ein Schritt eine **Lösung** geändert (jedes Lösungsfeld —
  `references/belege.md` §3): `check-belege` meldet `ERR_AUDIT_VERALTET`. Das
  Lösungs-Audit prüft **nur diese Felder** neu
  (`references/audits.md` §2.5, Paket mit `--nur-veraltet`).
- Hat ein Schritt eine **Aussage über die Welt** geändert oder hinzugefügt:
  `check-fakten` meldet `ERR_FAKT_ZEILE_VERWAIST` bzw. `ERR_FAKT_OHNE_ZEILE`.
  Das Fakten-Audit prüft nur diese (`references/audits.md` §3.5).
- Hat ein Schritt «Das geben Sie ab», einen Indikator, die Form des
  Lösungsbilds oder LF4 geändert: neue Lösbarkeitsprobe für dieses Heft und
  diese Spur (`references/audits.md` §4.5).
- Höchstens drei Runden, über Phase 9 und Phase 10 zusammen gezählt. Was dann
  offen ist, steht unter «Offen». [P-1a Schritt 5, P-abschluss Auftrag Nr. 3]

Der Bericht nennt, in welcher Runde und nach welcher Änderung zuletzt gelesen
wurde. Eine Datei, die danach noch geändert wurde, nennt er als «nicht
gegengelesen».

## 5. Tor und Messung nach der letzten Änderung

Vollständig nach `references/phase-9-tor.md` §1 — der **zweite Durchgang**:
einschliesslich Marker-Skript, Zusammenführen der Teildateien, Export, Messung,
der fünf Protokolle, Bestand und Build. `check-all` endet «GRUEN — keine
Fehler.»: Jedes Lösungsfeld hat eine gültige Belegzeile, jede Aussage über die
Welt eine Zeile `belegt`, kein Befund der Lösbarkeitsprobe ist offen. Die
Ausgaben von `check-all` und `messen-v42` gehen ganz nach `check-all.txt` und
`messung.txt` im Laufordner. Fehlt das Archiv oder das Netz und ist darum ein
Audit nicht gelaufen, sagt der Bericht «nicht geprüft», und die Vorlage sagt
«freigabereif: nein». [P-abschluss Auftrag Nr. 4; P-1a Schritt 7; E38]

## 6. Gegenhör-Liste für Pietro

Kein Modell hört ein Audio oder sieht ein Video; gelesen sind Untertitel und
Transkripte. Was daran hängt, hört ein Mensch gegen — einmal, mit Kopfhörer, in
einem Durchgang. Die Liste ist so geschrieben, dass er nur abhaken muss.
[P-abschluss «Abgabe»; B `2026-10-06-5.2.1_…` §9; Rb §5.2 letzte Zeile]

**Die Liste wird erzeugt, nicht geschrieben:**

```
node scripts/gegenhoeren.mjs <ordner> --out <tmp>/gegenhoeren.md
```

Je Audio und Video der Einheit (Quelle, Ersatzquelle, Vertiefungen) nennt sie:

- Quellen-ID · Rolle · Titel · Herausgeber · Datum · Adresse der QR-Seite
- **Ausschnitt von–bis**, mit der Frage nach Anfang und Ende (läuft der Player
  in den nächsten Beitrag?)
- **wie genau die Zeitmarken am Archivtext geprüft sind:** auf die Zeile ·
  `ZEIT_NUR_BLOCK` (nur auf den Block von 10 bis 30 Sekunden — hier besonders
  genau hinhören) · `ZEIT_NICHT_PRUEFBAR` (der Archivtext trägt keine Zeit) ·
  `ZEIT_VERMERK` (der Kopf der Archivdatei nennt die Marken berechnet,
  geschätzt oder nicht gegengehört) — dieselben Bedingungen wie die Hinweise
  von `check-zeiger` und `check-belege`
- **jede Zeitmarke, die Heft oder Lösung nennt**, eine Zeile je Marke: die
  Frage «Hört man hier, was dort angesetzt ist: …?» mit den Feldern, die an der
  Stelle hängen (Rasterzeile, Befund, Erwartung, Lösungsbild), und ihren Pfaden
- Marken, die in keinem Ausschnitt liegen (`ZEIT_AUSSERHALB`)

Dazu **gegensehen** (kein Ton): jede Text- und Bildquelle am Handy — finden
Lernende die Stelle so, wie die Erwartung sie zählt? · die QR-Seite
`/m/<ordner>` mit Player, Startpunkt und Kurztexten · am Papier die Seiten mit
0 px Reserve (meist S. 6) und die Arbeitsfläche S. 7.

Die Liste entsteht aus den **Feldnamen**, nicht aus dem Text: Sie enthält
keinen Anker und keinen Satz aus einer Quelle und geht darum unverändert in den
Bericht (Abschnitt 9). Was an einer Stelle zu hören sein soll, steht im
genannten Feld (Dokument «Lösungen»). Der Orchestrator ergänzt von Hand nur,
was das Skript nicht wissen kann: wer an der Stelle spricht (Rolle, kein Name),
und worauf sonst zu achten ist (Mundart, Namen im Ausschnitt, Zahlen, die das
Heft bewusst weglässt) — in eigenen Worten. Exit 2 heisst: Das Archiv fehlt
lokal, die Liste nennt die Genauigkeit nicht; dann gilt jede Marke als
ungeprüft. [Auftrag 10, Stufe C Nr. 4; Rb §5.2 letzte Zeile; E38]

Hat die Einheit weder Audio noch Video, enthält die Liste nur den Teil
«gegensehen».

## 7. Vorlage zur Freigabe — der zweite Stopp

Nach Bericht und Commit legt der Orchestrator vor [P-1a «EINZIGER STOPP»]:

1. grün oder nicht (Tor im zweiten Durchgang, Messung, letzte Lesung, Stand
   der drei Audits);
2. die Gegenhör-Liste (Schritt 6, erzeugt mit `scripts/gegenhoeren.mjs`);
3. die offenen Punkte, zuerst die, die einen Entscheid brauchen — je mit
   Empfehlung;
4. die Fakten mit Urteil «nicht belegbar» und was mit ihnen geschah;
5. ein Satz: freigabereif nach dem Gegenhören — ja oder nein («nein» immer,
   wenn ein Überlauf über 2 px offen ist oder der zweite Durchgang des Tors
   nicht «GRUEN» endet: ein Audit fehlt oder ist veraltet, ein Befund der
   Lösbarkeitsprobe ist offen, eine Prüfung ist «nicht geprüft»);
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
   `check-all` lässt nur `"entwurf"`, `"publiziert"`, `"archiviert"` oder ein
   fehlendes Feld zu. [E32, E37]
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
