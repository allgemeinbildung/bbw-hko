# Phase 9 — Tor und Bericht

Das Tor führt nur der Orchestrator aus, nie zwei Tore gleichzeitig im selben
Arbeitsbaum (`references/lauf.md` §5). Auf Phase 9 folgt in jedem Lauf
Phase 10 (`references/phase-10-abschluss.md`).

Eine Einheit ist erst fertig, wenn alles hier durchgelaufen ist. Befunde werden
**in den Daten** behoben — nie im Skript, nie über `--baseline`, nie durch
Weglassen eines Gates.

## 1. Reihenfolge

Aus dem Repo-Root, `<ordner>` = Ordnername der Einheit, `<tmp>` = ein
Temp-Ordner ausserhalb des Repos, `<laufordner>` =
`docs/cloud-run/laeufe/<JJJJ-MM-TT>-<ordnername>[-<k>]`:

```
 1  npm run build:einheiten-index
 2  node .claude/skills/bbw-hko-heft-v42/scripts/begleiter-marker.mjs <ordner> --check
 3  node scripts/audit-paket.mjs <ordner> --zusammenfuehren
 4  node scripts/check-all.mjs <ordner>
 5  node scripts/export-v42.mjs <ordner> --out <tmp>
 6  node scripts/messen-v42.mjs <tmp>
 7  node scripts/check-zeiger.mjs    <ordner> --export <tmp> --protokoll <laufordner>/zeiger-check.txt
    node scripts/check-kohaerenz.mjs <ordner> --export <tmp> --protokoll <laufordner>/kohaerenz-check.txt
    node scripts/check-belege.mjs    <ordner> --protokoll <laufordner>/belege-check.txt
    node scripts/check-fakten.mjs    <ordner> --protokoll <laufordner>/fakten-check.txt
    node scripts/check-zahlen.mjs    <ordner> --protokoll <laufordner>/zahlen-check.txt
 8  node scripts/bestand-v42.mjs --pruefen
 9  npm run build
10  git status --short
```

(Herkunft der Reihenfolge: ENTSCHEIDE E38, Stufen B und C; Auftrag 10,
Abschluss. Die Schritte 3 und 7 sind neu; die Zeilen «Namen» und «Karten» in
Schritt 4 stammen aus E35 und E36.)

**Das Tor läuft in jedem Lauf zweimal, mit zwei Massstäben** — die Audits
beginnen erst nach dem ersten Durchgang (`references/lauf.md` §4, §4.1):

| | Wann | Grün heisst |
|---|---|---|
| **Erster Durchgang** | nach Phase 8, vor Gegenlesern und Audits | Schritt 4 endet «ROT», und die **einzigen** Fehler sind `ERR_BELEGE_FEHLT` (Zeile «Belege») und `ERR_FAKTEN_FEHLT` (Zeile «Fakten») — beide Dateien schreiben erst die Audits. Jede andere Zeile ist `ok`; `fall.json` steht (kein `ERR_FALL_FEHLT`). Alle übrigen Schritte wie in der Tabelle |
| **Zweiter Durchgang** | nach der letzten Korrektur und dem letzten Audit (Phase 10 Schritt 5) | Schritt 4 endet «GRUEN — keine Fehler.» — mit Belegen, Fakten und Probe |

Ein Schalter, der den ersten Durchgang mit Exit 0 enden liesse, fehlt in
`check-all` noch: Der Orchestrator liest die Ausgabe. Im Bericht steht die
Ausgabe des zweiten Durchgangs.

Erst **nach dem Bericht** und vor `git add` läuft dazu
`node scripts/check-leck.mjs docs/cloud-run/bauplaene/<ordner>.md <laufordner>`
(Tabellenzeile unten; `references/lauf.md` §4 Schritt 11, §8) — vorher gibt es
den Bericht nicht, den sie prüfen soll.

Lokale Läufe — Einzelstart, Schleife, Abschluss — rufen `check-all <ordner>`
**ohne** `--cloud`. Das Lehrmittel muss trotzdem lokal da sein; das stellt die
Vorprüfung fest (`references/lauf.md` §3 Zeile 7), denn ohne `--cloud` meldet
`check-all` ein fehlendes Lehrmittel nur als Hinweis. `--cloud` gilt allein für
den Cloud-Weg über `docs/cloud-run/RUN.md`: Dort heisst Schritt 4
`node scripts/check-all.mjs <ordner> --cloud` (das Lehrmittel **muss** dann da
sein, `status` **muss** `"entwurf"` sein). (Herkunft: ENTSCHEIDE E34, Entscheid
des Orchestrators nach dem Trockenlauf.)

| Befehl | Soll | Wenn nicht |
|---|---|---|
| `build:einheiten-index` | läuft durch; schreibt `src/data/einheiten.index.json` und die Kopie unter `public/nrlp/` | JSON-Fehler in der Einheit beheben. Den Index nie von Hand ändern. |
| `begleiter-marker --check` | «0 abweichend · 0 unaufloesbar», Exit 0 | ohne `--check` laufen lassen (füllt die Marker); bei `UNAUFLOESBAR` den Pfad im Begleiter korrigieren (`references/phase-8-begleiter.md` §3.1) |
| `audit-paket --zusammenfuehren` | je Datei eine Zeile: `fall.json` aus `fall.A.json`, `fall.B.json` (und `fall.auftrag.json`); nach den Audits `belege.json` mit **allen** Lösungsfeldern und 0 «mit altem Hash», `probe.json` mit den Läufen. Exit 0 | Exit 1: eine Teildatei ist ungültig — an ihren Schreiber zurück (`references/audits.md` §1.4). Exit 2 «kein Ordner»: Kein Executor hat `fall.<…>.json` abgegeben (`references/belege.md` §6). «NICHT geschrieben: Es fehlt der Block …»: derselbe Fall für ein Heft |
| `check-all` | zweiter Durchgang: letzte Zeile «GRUEN — keine Fehler.», Exit 0 (erster Durchgang: Tabelle oben). Zeilen je Einheit: «Struktur · Status · Methoden · Sprache · Leck», «nRLP-Abgleich», «Kopplung · Autarkie · Begleiter-Marker», «Leitfragen-Loesungen», «Heft v4.x», dazu die fünf Beleg-Prüfungen «Belege», «Fakten», «Zeiger», «Zahlen», «Kohaerenz» (Codes im Kopf jedes Skripts, `references/belege.md` §11); einmal je Aufruf «Namen» und «Karten». **«Namen»:** `check-namen.mjs <ordner>` prüft Ordner, IDs, Verweise, Quellenkarten, `archiv_ref` und Laufordner (`references/ableitungsregeln.md` §10). **«Karten»:** `karten.mjs geaendert` — keine bestehende Karte berührt (`references/karten.md`). Warnungen an publizierten Einheiten stehen darunter und sind nur zu melden. «UNVOLLSTAENDIG» bzw. ein Hinweis «nicht geprueft — Quellenarchiv oder Lehrmittel fehlt lokal» heisst: Diese Prüfung ist **nicht gelaufen** — im Bericht als «nicht geprüft» führen, nie als grün; die Einheit ist dann nicht freigabereif | Abschnitt 2. `ERR_AUDIT_VERALTET`, `ERR_FAKT_ZEILE_VERWAIST`, `ERR_FAKT_OHNE_ZEILE` nach einer Korrektur: nicht die Daten ändern, sondern die betroffenen Felder neu auditieren (`references/lauf.md` §4.1). `ERR_PROBE_OFFEN`: den Befund entscheiden (`references/audits.md` §4.3) |
| `export-v42` | schreibt je vorhandener Spur und Heft `heft-<a\|b>-<spur>.html/.docx`, `loesungen-<a\|b>-<spur>.html/.docx`, dazu `auftragsbogen.*` und `begleiter.docx` | Fehlermeldung lesen: meist ein Feld, das der Renderer erwartet und das fehlt. Kein Workaround im Skript. |
| `messen-v42` | Exit 0: keine Seite läuft über. Erwartet: 8 Seiten je Heft, 4 im Auftragsbogen, 5 je Dokument «Lösungen» | Exit 1: das Feld kürzen, das auf der gemeldeten Seite steht, auch wenn das Zeichenbudget eingehalten ist (die Budgets sind an einer Einheit gemessen). Exit 2: kein Browser — im Bericht als «nicht gemessen» führen; die Messung holt die lokale Abnahme nach. |
| die fünf mit `--protokoll` (Schritt 7) | dieselben Prüfungen wie in `check-all`, dazu: `check-zeiger` und `check-kohaerenz` lesen mit `--export <tmp>` den **gedruckten** Seitentext (trägt die genannte Seite das genannte Element? steht ein Lösungssatz oder ein gesperrtes Wort im gedruckten Heft?). Jedes schreibt sein Protokoll in den Laufordner — Feld, Code, Fundstelle, **ohne Anker und ohne Textauszug**. Exit wie in Schritt 4 | wie `check-all`. `HINWEIS_EXPORT_UNPASSEND`: `<tmp>` ist nicht der Export dieser Einheit |
| `node scripts/check-leck.mjs docs/cloud-run/bauplaene/<ordner>.md <laufordner>` — **nach dem Bericht, vor `git add`** (Bauplan und Bericht — `check-all` liest nur den Ordner der Einheit) | letzte Zeile «GRUEN — keine woertliche Uebernahme ab 14 Woertern.», Exit 0 | Exit 1: die gemeldete Stelle im Dokument umformulieren (eigene Worte plus Kapitel/Seite bzw. Karten-ID), auch bei einer Warnung. Exit 2: Lehrmittel oder Archiv fehlt — nicht geprüft, Bauplan und Bericht nicht committen. |
| `bestand-v42 --pruefen` | «OK — … Dokumente unverändert.» | Die Skill hat etwas ausserhalb ihres Ordners verändert. Rückgängig machen (`git checkout -- <datei>`), Ursache in den Bericht. |
| `npm run build` | Exit 0 | wie oben; die Warnung «chunks larger than 500 kB» ist bekannt und kein Befund |
| `git status --short` | neu oder geändert **durch diesen Lauf** nur: der Ordner der Einheit, neue Karten in `src/data/quellen/` (und allenfalls `src/data/methoden/`), der Bauplan, der Laufordner, die zwei Index-Dateien | was dieser Lauf sonst geändert hat, zurücksetzen; Fremdes nicht anfassen und nie mitcommitten |

**Messung.** Die Executor haben ihr Heft schon in der Schreibphase gemessen
(`references/lauf.md` §6); das Tor misst **alle** Dokumente, auch S. 8 der
Hefte und den Auftragsbogen. Die Messung läuft lokal mit der Schreibschrift
Segoe Print; sie gilt, vor allem für Seite 6. Ein Überlauf bis 2 px auf Seite 6
ist hingenommen und wird nur gemeldet; alles darüber wird in den Daten
behoben. (Herkunft: ENTSCHEIDE E28 Nr. 2; Prompt
`einheit-aus-bauplan-lokal.md`, Fassung bis 07.10.2026.)

**Bestand der anderen.** Einmal je Lauf:
`node scripts/check-all.mjs 1.3.1_konsum_verantworten_v42 2.3.1_anliegen_vertreten 2.1.1_informationen_hinterfragen`
— bleibt grün. (Herkunft: derselbe Prompt.)

**Nach jeder Korrektur an Heft, Set oder KN** läuft das Marker-Skript ohne
`--check` neu, dann das Tor von vorn (`references/lauf.md` §4).

`node scripts/lauf.mjs <ordner>` (sobald vorhanden) führt diese Folge in einem
Befehl aus und schreibt die Ausgaben in den Laufordner. Bis dahin: die Befehle
einzeln, die Ausgaben von `check-all` und `messen-v42` ganz nach
`check-all.txt` und `messung.txt` (`references/lauf.md` §8); die fünf
Protokolle schreibt Schritt 7 selbst.

**Nicht im Tor:** `node scripts/check-links.mjs <ordner>` bzw. `--alle` (mit
Netz — Status und Weiterleitung jeder URL der Karten und Hefte; Protokoll nach
`docs/cloud-run/laeufe/links-<datum>.txt`). Gedacht für einen wöchentlichen
Lauf über den Bestand; eingeplant ist nichts. (Herkunft: Rückblick §5.2, Zeile
«URL tot oder umgeleitet»; Auftrag 10, Stufe B Nr. 6; E38.)

`npm run build` führt im `prebuild` `sync:einheiten-nrlp` aus: Das Skript
schreibt Kompetenz- und Lebensbezugstexte aus dem Datensatz in die Einheiten.
Ändert es dabei eine Datei der neuen Einheit, war ein Text nicht wörtlich
übernommen — die Änderung ist richtig und bleibt. Ändert es eine **andere**
Einheit, ist das nicht dein Befund: zurücksetzen und im Bericht nennen.

## 2. Reparaturrunden

Eine Runde = `check-all` **und** Messung laufen lassen, alle Befunde lesen —
ein Überlauf ist ein Befund der Runde —, in den Daten beheben, neu prüfen.
Höchstens **drei** Runden.

Nach der dritten Runde: Ist `check-all` rot → Abbruch (unten). Ist `check-all`
grün und bleibt nur ein Überlauf über 2 px → **kein** Abbruch: Die Einheit
bleibt `"entwurf"`, der Überlauf steht im Bericht unter «Offen» (Kürzel E, mit
Seite und Pixeln), und die Vorlage zur Freigabe sagt «freigabereif: nein». Bis
2 px auf Seite 6 ist hingenommen und wird nur gemeldet. (Herkunft: ENTSCHEIDE
E28 Nr. 2; Rückblick §4 Zeile 1; Entscheid des Orchestrators, E34.)

- Ein Befund wird an der **Quelle** behoben: Ist eine Leitfrage zu lang, wird
  die Frage neu formuliert und danach geprüft, ob Lösung, Satzanfänge und der
  Schritt, der auf sie verweist, noch stimmen. Kürzen durch Abschneiden ist
  keine Reparatur.
- `ERR_V42_R6` (Wortlaut der Kriterien): immer aus `kn.json` neu kopieren, nie
  den KN an das Heft angleichen.
- `ERR_V42_R9_FALL` (Fall-Ausschluss): das Wort im Heft, Auftrag oder Glossar
  ersetzen. Trifft es einen Kernbegriff der Hefte, ist der Fall-Begriff im
  Prinzip falsch gewählt — das ist ein Entscheid des Bauplans: im Auto-Modus
  nicht ändern, sondern melden.
- `ERR_LEHRMITTEL_WOERTLICH` und `WARN_LEHRMITTEL_NAH` (Leck): umformulieren,
  bis keine Wortfolge ab 14 Wörtern mit Lehrmittel oder Archivtext
  übereinstimmt. Auch die Warnung wird behoben.
- Warnungen von `check-einheiten` zählen als Fehler (Exit 1).

Ist `check-all` nach der dritten Runde rot: Ordner der Einheit und die in diesem
Lauf neu angelegten Karten nach
`docs/cloud-run/laeufe/<datum>-<ordnername>[-<k>]/abgebrochen/` **verschieben, nicht
löschen**, Index neu bauen, Grund und letzte Tor-Ausgabe in den Bericht
(`references/lauf.md` §7). Eine halbe Einheit bleibt nie unter
`src/data/einheiten/` liegen.

## 3. Was kein Befehl prüft — vor dem Bericht von Hand

Die Nummern bleiben, wie sie waren: Andere Stellen der Skill und die Berichte
verweisen darauf. **Nr. 2 bis 5 sind seit E38 keine Handprüfung mehr** — sie
laufen im Tor (`check-kohaerenz`, in Schritt 7 auch am gedruckten Text):

| Früher von Hand | Heute | Code |
|---|---|---|
| Nr. 2 — Prinzip, Hefte und Set tragen dieselben Werte | `check-kohaerenz`, WERTE | `ERR_KOH_KRITERIEN`, `ERR_KOH_POLTYP`, `ERR_KOH_ZENTRUM`, `ERR_KOH_LEBENSBEREICH`, `ERR_KOH_MODI` |
| Nr. 3 — Lösungen nirgends bei den Lernenden | `check-kohaerenz`, LÖSUNG (acht Wörter am Stück; mit `--export` im gedruckten Heft und Bogen) | `ERR_KOH_LOESUNG_SICHTBAR` |
| Nr. 4 — «Spur», «Pflichtquelle», «Lektion», «Woche», «Minute»; Du-Anrede | `check-kohaerenz`, WÖRTER | `ERR_KOH_GESPERRT`, `ERR_KOH_ANREDE_DU`; `WARN_KOH_WOCHE_MINUTE` — **die Warnung ansehen**: Unterrichtszeit oder Inhalt? |
| Nr. 5 — Umlaute | `check-kohaerenz`, UMLAUTE | `ERR_KOH_TRANSLIT` |

Ebenfalls im Tor und darum nicht mehr von Hand: Zeiger (Seite, Absatz,
Zeitmarke, Wortzahl — `check-zeiger`), Rechnungen und Fallzahlen
(`check-zahlen`), Anzahl und Bezeichner des Produkts (`check-kohaerenz`,
ANZAHL und BEZEICHNER). Was die Skripte als `WARN_…` melden, entscheidet ein
Mensch: `WARN_KOH_ANZAHL`, `WARN_KOH_KURZBESCHRIEB` (verrät der Kurzbeschrieb
die Lösung?) — ansehen, im Bericht nennen. (Herkunft: Rückblick §5.2, Zeile
«Handprüfungen `phase-9` §3 Nr. 2–5»; Auftrag 10, Stufe B Nr. 5 und Abschluss;
E38.)

Von Hand bleibt, was Sinn verlangt:

1. **Abdeckung und Kohärenz:** Tabellen aus `references/kohaerenz.md`
   (Abschnitt 3 und 4) ausfüllen.
6. **Der Fall des KN** kommt in Heften, Auftrag, Glossar und im genannten
   Ausschnitt der Quellen nicht vor (über die Fall-Begriffe hinaus: gleicher
   Gegenstand unter anderem Wort).
7. **Es liest sich wie eine Einheit:** LF1 → LF2 → LF3 → LF4 → Produkt ist in
   jedem Heft und jeder Spur ein Weg; A und B führen zum selben Zentrum; der
   Auftrag braucht beide Hefte wirklich.
8. **Kein hergeleiteter Wert stammt aus einem Skelett oder aus
   `references/kohaerenz.md` §4.** Einzige Vergleichsgrundlage ist die
   Gold-Kurzliste dort (Modi A und B, Modi des Auftrags, SK, Produkte): Jeden
   dieser Werte der neuen Einheit daneben stellen und die Herleitung nennen.
   Die Gold-Dateien werden dafür nicht gelesen.

9. **Sinnprobe am exportierten Text, nach der letzten Änderung.** Die Skripte
   prüfen Längen und Struktur, nicht Sinn. Darum wird der exportierte Text jedes
   Hefts und jeder Spur **nach der letzten Reparatur- oder Kürzungsrunde** noch
   einmal als Lernende/r gelesen — Besetzung, Paket und Aufträge stehen in
   `references/gegenleser.md`. Ein Gegenlesen **vor** den Korrekturen ersetzt
   das nicht. Sechs Fragen, je mit Ja oder mit Seite und Wortlaut:
   1. LF2 verlangt nichts, was erst die Quelle auf S. 3 zeigt (phase-4 §5).
   2. Jeder Teil von LF3 ist aus Quelle bzw. Lehrmittel-Abschnitt beantwortbar
      (phase-5 §3).
   3. Der Auftrag über dem Raster nennt nur Spaltenköpfe; Auftrag, Karte auf
      S. 6 und Checkliste auf S. 8 sagen dasselbe über den Begriff (phase-5 §8).
   4. LF4 lässt zwei Möglichkeiten offen und verrät keine davon (phase-5 §6).
   5. Das Beispiel auf S. 6 stimmt mit sich selbst, mit den Definitionen des
      Hefts und mit «Das geben Sie ab» überein (phase-6 §5).
   6. Jede Quer-Check-Frage hat eine Stelle im Heft, an der ihre Antwort
      entsteht (phase-6, Quer-Check).
   Herkunft: `docs/upgrade-v4.2/REVIEW-lernende-t2.md`, Abschnitt 8.

## 4. Bericht

Immer als Datei: `docs/cloud-run/laeufe/<JJJJ-MM-TT>-<ordnername>[-<k>]/BERICHT.md`
nach dem Gerüst `assets/bericht-template.md` (`references/lauf.md` §8) — bei
jedem Start, auch im Gespräch mit Pietro. Die Antwort im Gespräch fasst ihn
zusammen, ersetzt ihn nicht. Was der Bericht enthält:

- Ordner, Lehrgang, Kompetenzen je Heft, Kapitel und Seiten
- letzte Ausgabe von `check-all`; Ergebnis von Messung, Bestand, Build
- vorhandene Spuren je Heft, und warum eine fehlt
- jede Quelle: ID, Titel, Herausgeber, Datum, Ausschnitt, Prüfdatum, Zugeständnis
- die Abdeckungstabelle und der Vergleich mit Gold (`references/kohaerenz.md`)
- alle Entscheide, die sonst ein Mensch getroffen hätte, mit Grund und
  verworfener Alternative
- die Gegenleser (`references/gegenleser.md` §6): Befunde je Leser, was
  übernommen wurde, was wegfiel, in welcher Runde zuletzt gelesen wurde
- die Audits (`references/audits.md` §5): je Rolle Modell, Zahl der Agenten,
  Zahl der Felder bzw. Aussagen je Urteil, jede Zeile mit einem Urteil ausser
  «stimmt» bzw. «belegt», jeder Befund der Lösbarkeitsprobe mit seinem Stand
- was nicht belegt, nicht geprüft oder nicht erzeugbar war
- Fehler in Skill, Skripten oder Renderer, die aufgefallen sind (nicht
  repariert) — als Zeilen der Liste «Offen», Kürzel S oder R

Nach Phase 9 ist der Bericht nicht fertig: Phase 10 schreibt in derselben
Datei weiter (Stand der Audits, Gegenhör-Liste, Vorlage zur Freigabe). Eine Datei
`NACHTRAG.md` gibt es nicht mehr.

**Commit erst nach Phase 10 Schritt 6**, einer je Einheit, Umfang und
Leck-Prüfung nach `references/lauf.md` §8 — der Bauplan gehört dazu. **Kein
Push.**
