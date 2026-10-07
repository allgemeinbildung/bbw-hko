# Versionierung nachholen — mit Leck-Prüfung der Dokumente

Session in `D:\OS\dev\bbw-hko`, Branch `v42-skill`. Darf `scripts/` ändern.
Deckt auch Punkt 9 des Rückblicks ab (Zeilenenden, veraltete Übersichten).

```
Im Arbeitsbaum liegen Dokumente der Produktion unversioniert, obwohl die
Einheiten dazu live sind. Das Repo ist ÖFFENTLICH; Lehrmittel und Quellentexte
dürfen nie hinein. Du machst die Leck-Prüfung für Dokumente möglich, prüfst
und committest dann.

1. LECK-PRÜFUNG FÜR BELIEBIGE PFADE
   scripts/check-all.mjs prüft heute nur src/data/einheiten/. Lagere die
   Funktionen ladeLehrmittel / laengsteUebernahme in ein Modul aus
   (scripts/lib/leck.mjs; check-all benutzt es unverändert weiter) und
   schreibe scripts/check-leck.mjs:
     node scripts/check-leck.mjs <pfad>…     # Dateien oder Ordner, .md .json .txt
     node scripts/check-leck.mjs --staged    # alles, was im Index zum Commit steht
     node scripts/check-leck.mjs --unversioniert
   Gleiche Schwellen (Warnung ab 14, Fehler ab 25 Wörtern am Stück), absatz-
   weise, Ausgabe Datei:Zeile mit Auszug. Fehlt das Lehrmittel lokal: Exit 2,
   nie «grün». Vergleichsbasis: material/_lehrmittel*/ und das Quellenarchiv
   (D:/OS/_lab/quellen-archiv/bbw-hko, auch _kandidaten).
   Beweis: Gold-Einheit bleibt in check-all GRUEN; ein Testabsatz aus einer
   Kapiteldatei (in einer Temp-Datei ausserhalb des Repos) wird gemeldet.

2. PRÜFEN (nur lesen)
   node scripts/check-leck.mjs --unversioniert
   Betrifft mindestens: docs/cloud-run/bauplaene/*.md (15 unversioniert),
   docs/cloud-run/prompts/, docs/cloud-run/laeufe/,
   docs/ORCHESTRATION*.md, docs/pipeline-review-2026-10-01.md,
   docs/upgrade-v4.2/probe/, docs/upgrade-v4.1/.
   Zusätzlich die fünf schon versionierten Baupläne und alle Laufberichte:
   node scripts/check-leck.mjs docs/
   Jeden Treffer ab 14 Wörtern im Dokument umformulieren (eigene Worte plus
   Kapitel/Seite bzw. Karten-ID). Ist ein Treffer in einer schon gepushten
   Datei: NICHT still korrigieren — melden (Historie ist öffentlich).

3. WAS NICHT INS REPO GEHÖRT
   docs/upgrade-v4.1/Kontextpaket-bbw-hko.zip und alles, was du nicht als
   Text prüfen kannst (zip, pdf, docx): nicht committen, in .gitignore
   eintragen, in der Schlussmeldung nennen. Inhalt des Zips auflisten.
   Ordner von unfertigen Einheiten (4.3.1, 5.2.1 samt Karten q-431*, q-521*)
   und Karten ohne Einheit (q-511*, q-531*, q-611*, q-621*, q-631*):
   Karten gehören zum freigegebenen Bauplan und dürfen committet werden;
   die zwei Einheiten-Ordner NICHT — sie haben eigene Sessions.

4. COMMITTEN (mehrere Commits, kein Push)
   a) «Leck-Prüfung für Dokumente» (Skripte)
   b) «Baupläne der v4.2-Einheiten versioniert» (+ Karten ohne Einheit)
   c) «Prompts und Übergabedokumente versioniert»
   Vor jedem Commit: node scripts/check-leck.mjs --staged → kein Fehler,
   keine Warnung.

5. DAMIT ES NICHT WIEDER LIEGEN BLEIBT
   - docs/cloud-run/prompts/alle-bauplaene-seriell.md §4: Commit einer
     Einheit umfasst auch den Bauplan.
   - references/phase-9-tor.md der Skill: check-leck über Bauplan und Bericht
     als Zeile des Tors.
   - .gitattributes: `*.json text eol=lf` und `*.md text eol=lf` (die zwei
     Index-Dateien erscheinen heute nur wegen Zeilenenden als geändert);
     danach `git add --renormalize .` prüfen — entsteht ein grosser Diff an
     Einheiten, NICHT committen, sondern melden.
   - npm run abdeckung neu laufen lassen (docs/cloud-run/abdeckung.md steht
     auf dem 02.10.) und committen.
   - CLAUDE.md, Abschnitt «Publizieren»: nennt noch «Flag entfernen»; heute
     gilt status "publiziert" (E32). Nachführen.

GRENZEN
Keine Einheit, keine Karte inhaltlich ändern. Kein Push, kein Merge. Die
Skill nur an der genannten Stelle. Schlussmeldung: was committet ist, was
bewusst draussen blieb, jeder Leck-Treffer mit Fundstelle.
```
