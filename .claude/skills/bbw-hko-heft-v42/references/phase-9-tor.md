# Phase 9 — Tor und Bericht

Das Tor führt nur der Orchestrator aus, nie zwei Tore gleichzeitig im selben
Arbeitsbaum (`references/lauf.md` §5). Auf Phase 9 folgt in jedem Lauf
Phase 10 (`references/phase-10-abschluss.md`).

Eine Einheit ist erst fertig, wenn alles hier durchgelaufen ist. Befunde werden
**in den Daten** behoben — nie im Skript, nie über `--baseline`, nie durch
Weglassen eines Gates.

## 1. Reihenfolge

Aus dem Repo-Root, `<ordner>` = Ordnername der Einheit:

```
npm run build:einheiten-index
node .claude/skills/bbw-hko-heft-v42/scripts/begleiter-marker.mjs <ordner> --check
node scripts/check-all.mjs <ordner>
node scripts/export-v42.mjs <ordner> --out <tmp>
node scripts/messen-v42.mjs <tmp>
node scripts/bestand-v42.mjs --pruefen
npm run build
git status --short
```

Erst **nach dem Bericht** und vor `git add` läuft dazu
`node scripts/check-leck.mjs docs/cloud-run/bauplaene/<ordner>.md <laufordner>`
(Tabellenzeile unten; `references/lauf.md` §4 Schritt 11, §8) — vorher gibt es
den Bericht nicht, den sie prüfen soll.

Lokale Läufe — Einzelstart, Schleife, Abschluss — rufen `check-all <ordner>`
**ohne** `--cloud`. Das Lehrmittel muss trotzdem lokal da sein; das stellt die
Vorprüfung fest (`references/lauf.md` §3 Zeile 7), denn ohne `--cloud` meldet
`check-all` ein fehlendes Lehrmittel nur als Hinweis. `--cloud` gilt allein für
den Cloud-Weg über `docs/cloud-run/RUN.md`: Dort heisst der dritte Befehl
`node scripts/check-all.mjs <ordner> --cloud` (das Lehrmittel **muss** dann da
sein, `status` **muss** `"entwurf"` sein). (Herkunft: ENTSCHEIDE E34, Entscheid
des Orchestrators nach dem Trockenlauf.)

| Befehl | Soll | Wenn nicht |
|---|---|---|
| `build:einheiten-index` | läuft durch; schreibt `src/data/einheiten.index.json` und die Kopie unter `public/nrlp/` | JSON-Fehler in der Einheit beheben. Den Index nie von Hand ändern. |
| `begleiter-marker --check` | «0 abweichend · 0 unaufloesbar», Exit 0 | ohne `--check` laufen lassen (füllt die Marker); bei `UNAUFLOESBAR` den Pfad im Begleiter korrigieren (`references/phase-8-begleiter.md` §3.1) |
| `check-all` | letzte Zeile «GRUEN — keine Fehler.», Exit 0. Darin die Zeile «Namen»: `check-namen.mjs <ordner>` prüft Ordner, IDs, Verweise, Quellenkarten, `archiv_ref` und Laufordner (`references/ableitungsregeln.md` §10). Warnungen an publizierten Einheiten stehen darunter und sind nur zu melden; ein Hinweis «Quellenarchiv fehlt lokal» heisst: `archiv_ref` nicht gegen die Ordner geprüft — im Bericht als «nicht geprüft» führen, nie als grün | Abschnitt 2 |
| `export-v42` | schreibt je vorhandener Spur und Heft `heft-<a\|b>-<spur>.html/.docx`, `loesungen-<a\|b>-<spur>.html/.docx`, dazu `auftragsbogen.*` und `begleiter.docx` | Fehlermeldung lesen: meist ein Feld, das der Renderer erwartet und das fehlt. Kein Workaround im Skript. |
| `messen-v42` | Exit 0: keine Seite läuft über. Erwartet: 8 Seiten je Heft, 4 im Auftragsbogen, 5 je Dokument «Lösungen» | Exit 1: das Feld kürzen, das auf der gemeldeten Seite steht, auch wenn das Zeichenbudget eingehalten ist (die Budgets sind an einer Einheit gemessen). Exit 2: kein Browser — im Bericht als «nicht gemessen» führen; die Messung holt die lokale Abnahme nach. |
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
`check-all.txt` und `messung.txt` (`references/lauf.md` §8).

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

1. **Abdeckung und Kohärenz:** Tabellen aus `references/kohaerenz.md`
   (Abschnitt 3 und 4) ausfüllen.
2. **Prinzip, Hefte und Set tragen dieselben Werte:** `kn_kriterien_verteilung`,
   `pol_typ_verteilung`, `mindmap_zentrum_kurz`, `auftrag_lebensbereich`,
   `modi_pro_heft` gegen `nrlp.sprachmodi`.
3. **Lösungen nirgends bei den Lernenden:** in `<tmp>/heft-*.html` und
   `<tmp>/auftragsbogen.html` nach einem markanten Satz aus `loesung.befund`,
   `erwartung` und `loesungsbild` suchen — kein Treffer.
4. **Anrede:** Situationen Ich-Form, Aufträge Sie-Form, Begleiter Du-Form;
   im **sichtbaren Text** der Heft-HTML (Tags, Stile und Skripte entfernt)
   kein «Spur», «Pflichtquelle», «Woche», «Lektion» und keine Unterrichtszeit
   in «Minuten» (die Dauer eines Produkts ist erlaubt). Einzeiler, je Datei
   die Treffer mit 40 Zeichen Umfeld:

   ```
   node -e "const fs=require('fs');for(const f of fs.readdirSync(process.argv[1]).filter(n=>/^heft-.*\.html$/.test(n))){const t=fs.readFileSync(process.argv[1]+'/'+f,'utf8').replace(/<(script|style)[\s\S]*?<\/\1>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/\s+/g,' ');for(const m of t.matchAll(/Spur|Pflichtquelle|Woche|Lektion|Minute/g))console.log(f,'…'+t.slice(Math.max(0,m.index-40),m.index+50)+'…')}" <tmp>
   ```
5. **Umlaute:** Suche nach Transliterationen (`references/umlaute.md`).
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
- was nicht belegt, nicht geprüft oder nicht erzeugbar war
- Fehler in Skill, Skripten oder Renderer, die aufgefallen sind (nicht
  repariert) — als Zeilen der Liste «Offen», Kürzel S oder R

Nach Phase 9 ist der Bericht nicht fertig: Phase 10 schreibt in derselben
Datei weiter (Fakten-Audit, Gegenhör-Liste, Vorlage zur Freigabe). Eine Datei
`NACHTRAG.md` gibt es nicht mehr.

**Commit erst nach Phase 10 Schritt 6**, einer je Einheit, Umfang und
Leck-Prüfung nach `references/lauf.md` §8 — der Bauplan gehört dazu. **Kein
Push.**
