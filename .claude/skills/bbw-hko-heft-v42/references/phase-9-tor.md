# Phase 9 — Tor und Bericht

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

Im unbeaufsichtigten Lauf heisst der dritte Befehl
`node scripts/check-all.mjs <ordner> --cloud` (das Lehrmittel **muss** dann da
sein, `status` **muss** `"entwurf"` sein).

| Befehl | Soll | Wenn nicht |
|---|---|---|
| `build:einheiten-index` | läuft durch; schreibt `src/data/einheiten.index.json` und die Kopie unter `public/nrlp/` | JSON-Fehler in der Einheit beheben. Den Index nie von Hand ändern. |
| `begleiter-marker --check` | «0 abweichend · 0 unaufloesbar», Exit 0 | ohne `--check` laufen lassen (füllt die Marker); bei `UNAUFLOESBAR` den Pfad im Begleiter korrigieren (`references/phase-8-begleiter.md` §3.1) |
| `check-all` | letzte Zeile «GRUEN — keine Fehler.», Exit 0 | Abschnitt 2 |
| `export-v42` | schreibt je vorhandener Spur und Heft `heft-<a\|b>-<spur>.html/.docx`, `loesungen-<a\|b>-<spur>.html/.docx`, dazu `auftragsbogen.*` und `begleiter.docx` | Fehlermeldung lesen: meist ein Feld, das der Renderer erwartet und das fehlt. Kein Workaround im Skript. |
| `messen-v42` | Exit 0: keine Seite läuft über. Erwartet: 8 Seiten je Heft, 4 im Auftragsbogen, 5 je Dokument «Lösungen» | Exit 1: das Feld kürzen, das auf der gemeldeten Seite steht, auch wenn das Zeichenbudget eingehalten ist (die Budgets sind an einer Einheit gemessen). Exit 2: kein Browser — im Bericht als «nicht gemessen» führen; die Messung holt die lokale Abnahme nach. |
| `bestand-v42 --pruefen` | «OK — … Dokumente unverändert.» | Die Skill hat etwas ausserhalb ihres Ordners verändert. Rückgängig machen (`git checkout -- <datei>`), Ursache in den Bericht. |
| `npm run build` | Exit 0 | wie oben; die Warnung «chunks larger than 500 kB» ist bekannt und kein Befund |
| `git status --short` | neu oder geändert nur: der Ordner der Einheit, neue Karten in `src/data/quellen/` (und allenfalls `src/data/methoden/`), der Bauplan, die zwei Index-Dateien | alles andere zurücksetzen |

`npm run build` führt im `prebuild` `sync:einheiten-nrlp` aus: Das Skript
schreibt Kompetenz- und Lebensbezugstexte aus dem Datensatz in die Einheiten.
Ändert es dabei eine Datei der neuen Einheit, war ein Text nicht wörtlich
übernommen — die Änderung ist richtig und bleibt. Ändert es eine **andere**
Einheit, ist das nicht dein Befund: zurücksetzen und im Bericht nennen.

## 2. Reparaturrunden

Eine Runde = alle Befunde von `check-all` lesen, in den Daten beheben, neu
prüfen. Höchstens **drei** Runden.

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

Ist das Tor nach der dritten Runde rot: Ordner der Einheit und die in diesem
Lauf neu angelegten Karten entfernen, Index neu bauen, Grund und letzte
Tor-Ausgabe in den Bericht. Eine halbe Einheit bleibt nie liegen.

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

## 4. Bericht

Lokal: als Antwort. Im Produktionslauf: gemäss `docs/cloud-run/RUN.md`.

- Ordner, Lehrgang, Kompetenzen je Heft, Kapitel und Seiten
- letzte Ausgabe von `check-all`; Ergebnis von Messung, Bestand, Build
- vorhandene Spuren je Heft, und warum eine fehlt
- jede Quelle: ID, Titel, Herausgeber, Datum, Ausschnitt, Prüfdatum, Zugeständnis
- die Abdeckungstabelle und der Vergleich mit Gold (`references/kohaerenz.md`)
- alle Entscheide, die sonst ein Mensch getroffen hätte, mit Grund und
  verworfener Alternative
- was nicht belegt, nicht geprüft oder nicht erzeugbar war
- Fehler in Skill, Skripten oder Renderer, die aufgefallen sind (nicht repariert)

**Kein Commit, kein Push**, ausser der Aufruf verlangt es (der Produktionslauf
verlangt einen Commit je Einheit auf dem Lauf-Branch).
