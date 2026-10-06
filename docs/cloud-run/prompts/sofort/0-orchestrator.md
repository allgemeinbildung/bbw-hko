# Orchestrator — die Prompts 2 bis 10 der Reihe nach, delegiert

Neue Session in `D:\OS\dev\bbw-hko`, Branch `v42-skill`, Modell **Opus 5.5**.
Den Block unten als erste Nachricht einfügen. Vorher die drei Zeilen unter
«ENTSCHEIDE VORAB» prüfen und bei Bedarf ändern.

Die Prompts 1a und 1b sind erledigt: `4.3.1_vielfalt_untersuchen` und
`5.2.1_gesetze_veraendern` sind seit 07.10.2026 publiziert (ENTSCHEIDE E33).

```
Du bist der Orchestrator (Opus 5.5). Du arbeitest acht vorbereitete Aufträge
der Reihe nach ab, indem du jeden an EINEN Subagenten delegierst, sein
Ergebnis selbst nachprüfst und erst dann den nächsten startest. Du schreibst
selbst keinen Code und keine Skill-Texte, ausser kleine Korrekturen nach
einer Nachprüfung.

ENTSCHEIDE VORAB (Pietro, gelten für alle Aufträge)
- QR-Seite /m/<ordner> einer archivierten Einheit funktioniert weiter: JA.
- Beleg-Dateien liegen ausserhalb des Repos, im Quellenarchiv unter
  _pruefung/<ordnername>/.
- Kein Push, kein Merge, kein Deploy in dieser Session. Alles bleibt als
  Commits auf v42-skill; am Schluss nennst du, was auf einen Push wartet.

ZUERST LESEN (du selbst, ganz)
- CLAUDE.md (Projekt)
- docs/upgrade-v4.2/RUECKBLICK-produktion-2026-10-06.md — der Grund für alles
- docs/upgrade-v4.2/ENTSCHEIDE.md, E20–E33
- .claude/skills/bbw-hko-heft-v42/SKILL.md und die Liste der Dateien unter
  references/, assets/, scripts/ der Skill
- docs/cloud-run/prompts/sofort/ — alle Dateien (2 bis 10); das sind die
  Aufträge
- scripts/check-all.mjs (das Tor) und package.json (Skripte)
Die Aufträge sind am 06./07.10.2026 geschrieben. Prüfe bei jedem die
«Ausgangslage» am heutigen Stand (git log, git status), bevor du ihn
vergibst, und gib dem Subagenten die Abweichungen mit. Schon bekannt:
4.3.1 und 5.2.1 sind committet und publiziert — die Sätze dazu in Auftrag 2
(«Einheiten-Ordner nicht committen») sind überholt.

DATEIEN, DIE IN DIESER ARBEIT ZÄHLEN
Skill          .claude/skills/bbw-hko-heft-v42/SKILL.md
               …/references/{auto-modus,ableitungsregeln,datenvertrag,
               gegenleser,kohaerenz,sprache,phase-0-verortung,phase-1-bauplan,
               phase-2-3-prinzip-kn,phase-4-heft-kern,phase-5-spuren,
               phase-6-abschluss,phase-7-set,phase-8-begleiter,phase-9-tor,
               phase-q-quellen}.md
               …/assets/*-template.*  ·  …/scripts/{begleiter-marker,
               seitentext}.mjs
Tor            scripts/check-all.mjs · check-v42.mjs · check-einheiten.mjs ·
               check-lf-loesung.mjs · check-nrlp-consistency.mjs ·
               sync-einheiten-nrlp.mjs · export-v42.mjs · messen-v42.mjs ·
               bestand-v42.mjs · build-einheiten-index.mjs
               docs/upgrade-v4.2/bestand-vorher.json (Fingerabdruck)
Daten          src/data/einheiten/<ordner>/ (27 Ordner, 16 im Format v4.2)
               src/data/einheiten.index.json + public/nrlp/einheiten.index.json
               src/data/methoden/*.json (geteilt) · src/data/quellen/*.json
Plattform      src/lib/einheiten/index.ts · src/lib/einheiten/types.ts ·
               src/components/einheiten/EinheitCard.astro ·
               src/pages/einheiten/index.astro · [setKey].astro (+ deck,
               werkstatt, feedback) · src/pages/m/[setKey].astro ·
               src/pages/jahresplanung.astro · src/pages/admin/index.astro ·
               public/nrlp/prompt-builder/einheiten.js
Produktion     docs/cloud-run/bauplaene/*.md (+ _VORLAGE.md) ·
               docs/cloud-run/laeufe/*/ (BERICHT, NACHTRAG, ENTSCHEIDE,
               check-all.txt, messung.txt, fakten-tabelle.md) ·
               docs/cloud-run/prompts/*.md · docs/cloud-run/abdeckung.md
Entscheide     docs/upgrade-v4.2/ENTSCHEIDE.md · REVIEW-lernende-t2.md ·
               BERICHT-skill.md · docs/methodenkartei.md ·
               docs/pipeline-review-2026-10-01.md
NICHT im Repo  material/_lehrmittel/ (gitignored, Verlagstext)
               D:\OS\_lab\quellen-archiv\bbw-hko\ (Volltexte q-…/gewaehlt/
               quelle.md, _pruefung/, _kandidaten/, _briefs/)
Register       D:\OS\pendenzen.yaml — nur lesen; schreiben nie aus dieser
               Session (Aufruf von register_cli.py nur vorschlagen)

REIHENFOLGE UND BESETZUNG
Streng nacheinander. Ein Auftrag beginnt erst, wenn der vorige nachgeprüft
und committet ist.

 # | Auftrag (docs/cloud-run/prompts/sofort/)   | Subagent | Warum
---|--------------------------------------------|----------|------------------
 1 | 2-versionierung-und-leckpruefung.md        | Opus     | öffentliches Repo, Leck-Urteil
 2 | 3-skill-auf-neusten-stand.md               | Opus     | Regeln widerspruchsfrei zusammenführen
 3 | 8-namen-eindeutig.md                       | Sonnet   | klar umrissenes Skript + eine Regel
 4 | 4-karten-aendern-oder-neu.md               | Opus     | Regel mit Folgen für publizierte Hefte
 5 | 7-status-archiviert.md                     | Opus     | Sichtbarkeit über viele Seiten, Rollen
 6 | 5-quellenkarten-221a-entwirren.md          | Sonnet   | mechanisch, Schritte vorgegeben
 7 | 10-belege-und-pruefskripte.md              | Opus     | vier Stufen, je Stufe EIN Subagent
 8 | 6-sammelliste-offen.md                     | Sonnet sammelt, du prüfst nach

Besonderheiten:
- Subagenten können keine eigenen Subagenten starten. Wo ein Auftrag das
  verlangt, übernimmst du diesen Teil:
  · Auftrag 3, «Beweis/Trockenlauf»: Du startest die zwei Trockenlauf-
    Agenten (Opus, nur lesen) selbst, nachdem der Schreib-Agent fertig ist,
    und legst ihre Abläufe nebeneinander.
  · Auftrag 10: Stufe A, B, C, D je ein Opus-Subagent nacheinander, je mit
    Commit. Den «Beweis» führst du: Stand vor der Abschlussrunde in einen
    Temp-Ordner ausserhalb des Repos, dann je Einheit ein Lösungs-Audit
    (Opus, zum Vergleich einmal Sonnet), ein Fakten-Audit (Opus, mit Netz),
    eine Lösbarkeitsprobe (Sonnet). Die Beweis-Tabelle schreibst du.
  · Auftrag 6: drei bis vier Sonnet-Sammler parallel (nur lesen, je
    3–4 Laufordner bzw. die Dokumente unter docs/upgrade-v4.2/). Das
    Nachprüfen am Repo und OFFEN.md machst du; scripts/offen.mjs ein
    Sonnet-Subagent.
- Parallel laufen dürfen nur Agenten, die NICHTS schreiben. Nie zwei
  schreibende Agenten gleichzeitig, kein git worktree (das Lehrmittel fehlt
  dort), kein npm ci, kein Branchwechsel.
- Auftrag 8 (Namen) und 4 (Karten) bauen auf der Skill von Auftrag 3 auf;
  Auftrag 10 schliesst an karten.mjs, check-namen.mjs und references/lauf.md
  an. Gib jedem Subagenten die Dateien mit, die der vorige angelegt hat.
- Auftrag 6 läuft zuletzt und nimmt die Befundlisten der Aufträge 4, 8 und
  10 mit auf.

SO VERGIBST DU EINEN AUFTRAG
Der Subagent kennt nur, was du ihm schreibst. Jeder Brief enthält:
1. den Pfad des Auftrags mit der Anweisung, den Block darin ganz zu lesen
   und auszuführen;
2. die Abweichungen von der Ausgangslage, die du gefunden hast;
3. die Entscheide vorab (oben);
4. die Pflichtlektüre für diesen Auftrag (CLAUDE.md, SKILL.md, die im
   Auftrag genannten Dateien, RUECKBLICK §3–§5);
5. den Zaun: welche Pfade er ändern darf — und dass er sonst nichts anfasst;
6. kein Push; Commits mit der Zeile
   «Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>»;
7. die Rückgabe: geänderte Dateien, ausgeführte Befehle mit letzter
   Ausgabezeile, was NICHT gelang, offene Fragen — höchstens 60 Zeilen.

SO PRÜFST DU NACH (nach jedem Auftrag, du selbst)
Der Bericht eines Subagenten ist eine Behauptung. Du prüfst am Repo:
- git status --short und git log: nur die erlaubten Pfade, Commits vorhanden
- den «Beweis» des Auftrags selbst ausführen (nicht den Bericht lesen)
- node scripts/check-all.mjs für alle publizierten v4.2-Einheiten
  (set.json › template "heft_8page_v42" und status "publiziert") → GRUEN;
  neue Checks dürfen dort Warnungen bringen, keine Fehler
- node scripts/bestand-v42.mjs --pruefen → unverändert (ausser der Auftrag
  ändert bewusst sichtbaren Text; dann nennt er es)
- npm run build → Exit 0
- Leck: kein Lehrmittel- und kein Quellentext in den neuen Commits
  (scripts/check-leck.mjs --staged bzw. über die geänderten Dateien, sobald
  Auftrag 2 es gebaut hat)
- keine Einheit unter src/data/einheiten/ und keine Karte ist verändert,
  ausser der Auftrag verlangt es ausdrücklich (5: q-221a-Karten und 2.2.1;
  7: status der alten 1.3.1)
Stimmt etwas nicht: denselben Subagenten mit dem genauen Befund weiter-
arbeiten lassen. Nach zwei erfolglosen Runden: Auftrag anhalten, Stand
committen oder zurücksetzen (nur die Dateien dieses Auftrags, nie
git reset --hard, nie fremde Änderungen), und mit dem nächsten Auftrag nur
weitermachen, wenn er nicht davon abhängt.

WANN DU MICH FRAGST
Nur in drei Fällen, sonst nie:
- Auftrag 2 findet Lehrmittel- oder Quellentext in einer Datei, die schon
  auf GitHub liegt.
- Ein Auftrag würde ein publiziertes Heft sichtbar ändern, ohne dass der
  Auftrag das vorsieht.
- Zwei Vorgaben widersprechen sich so, dass jede Wahl ein Entscheid über
  Didaktik oder Sichtbarkeit wäre.
Alles andere entscheidest du nach CLAUDE.md, ENTSCHEIDE und RUECKBLICK und
hältst es fest.

PROTOKOLL
Führe docs/cloud-run/laeufe/2026-10-07-umbau/PROTOKOLL.md: je Auftrag
Beginn, Ende, Modell des Subagenten, Commits, Ergebnis der Nachprüfung
(jede Zeile oben mit ja/nein), eigene Entscheide, was offen blieb. Neue
E-Nummern in ENTSCHEIDE.md vergeben die Aufträge selbst; du prüfst, dass
keine doppelt ist.

SCHLUSSMELDUNG
Tabelle der acht Aufträge (erledigt · teilweise · angehalten) mit Commits;
die Beweis-Tabelle aus Auftrag 10 in Kurzform; die drei Kurzlisten aus
OFFEN.md (hören/sehen, entscheiden, betrifft publizierte Hefte); die
vorgeschlagenen Registerzeilen; was auf einen Push wartet und was davon
die Plattform sichtbar ändert (Auftrag 5: Status «archiviert»; Auftrag 6:
Zeitmarken 2.2.1).
```
