# Abschluss und Freigabe: 4.3.1_vielfalt_untersuchen

Eigene Session in `D:\OS\dev\bbw-hko`, Branch `v42-skill`, Modell Opus 5.5.
Erst starten, wenn `1a-abschluss-5.2.1.md` committet ist — nie zwei Tore
gleichzeitig im selben Arbeitsbaum.

```
Du bringst die Einheit src/data/einheiten/4.3.1_vielfalt_untersuchen/ vom
abgebrochenen Stand bis zur Freigabe für alle Lehrpersonen. KT1 macht kein
Review — was du nicht findest, findet vor dem Unterricht niemand.

AUSGANGSLAGE (Stand 06.10.2026, zuerst selbst nachprüfen)
- Der Lauf ist am 05.10.2026 nach dem Set abgebrochen. Vorhanden und
  uncommittet: prinzip.json, kn.json, herausforderung_A.json,
  herausforderung_B.json, set.json. ES FEHLT begleiter.md.
- node scripts/check-all.mjs 4.3.1_vielfalt_untersuchen ist ROT
  (ERR_DATEI_FEHLT begleiter.md); die übrigen Prüfungen waren grün.
- Karten src/data/quellen/q-431*.json und Volltexte unter
  D:\OS\_lab\quellen-archiv\bbw-hko\q-431* liegen vor.
- Kein Laufordner, kein Bericht, kein Gegenlesen.
- Bauplan: docs/cloud-run/bauplaene/4.3.1_vielfalt_untersuchen.md
  (freigegeben am 2026-10-04). Er gilt.

ZUERST LESEN
SKILL.md der Skill bbw-hko-heft-v42, references/auto-modus.md,
phase-7-set.md, phase-8-begleiter.md, phase-9-tor.md, gegenleser.md,
kohaerenz.md, datenvertrag.md; ENTSCHEIDE.md E28–E32 (E30 geht vor dem Text
der Skill); docs/upgrade-v4.2/RUECKBLICK-produktion-2026-10-06.md §4; den
Bauplan ganz.

ABLAUF
1. Bestand aufnehmen: Die fünf Dateien sind von einem abgebrochenen Lauf —
   nicht als fertig annehmen. Jede gegen Bauplan und Datenvertrag lesen; ob
   Phase 5 und 6 je Heft und Spur vollständig sind (LF3/LF4 mit Lösung,
   Begriffsnetz, Abschluss, Beispielbild, Lösungsbild), ob set.json Glossar,
   gemeinsamen Auftrag mit heft_bezug und Wochenplan trägt. Lücken zuerst
   schliessen (Executor je Datei, Opus; A und B dürfen parallel).
2. Begleiter (Phase 8): Executor schreibt begleiter.md; die Marker füllt
   ausschliesslich scripts/begleiter-marker.mjs der Skill.
3. Ab hier wie Schritt 2–8 in docs/cloud-run/prompts/sofort/
   1a-abschluss-5.2.1.md: Tor mit Export und Messung · Gegenleser mit
   Untertiteln in voller Auflösung · Fakten-Audit an Primärquellen (hier vor
   allem: Zahlen des BFS, Rechtsgrundlagen zu Diskriminierung und
   Gleichstellung, «Stand …») · Korrekturrunden mit erneutem Lesen · Zahlen
   nachrechnen · Bericht nach
   docs/cloud-run/laeufe/2026-10-06-4.3.1_vielfalt_untersuchen/ mit
   check-all.txt, messung.txt und Fakten-Tabelle · Commit «Einheit
   4.3.1_vielfalt_untersuchen (bbw-hko-heft-v42)» mit Einheit, Karten q-431*,
   Bauplan, Laufordner, Index. Status "entwurf". Kein Push.
4. Besonders achten (Lebensbezug 4.3, Vielfalt): Beispiele und Fälle
   stellen keine Gruppe bloss; ein Videoausschnitt darf direkt vor oder nach
   den Zeitmarken nichts enthalten, was in der Klasse nicht gezeigt werden
   soll — den Archivtext 60 Sekunden vor und nach dem Ausschnitt mitlesen und
   Auffälliges in die Gegenseh-Liste schreiben.

EINZIGER STOPP — vor der Freigabe
Wie in 1a: Stand, Gegenhör- und Gegenseh-Liste, offene Punkte, nicht
belegbare Fakten. Warte auf mein «ok».

NACH DEM OK
Wie in 1a: status "publiziert", Index, check-all, Bestand, Build, Commit
«Freigabe: 4.3.1_vielfalt_untersuchen», Eintrag in ENTSCHEIDE.md, Merge nach
main und Push, Kontrolle im Katalog auf bbw-hko.ch.

WAS IMMER GILT
Wie in 1a (Quellen der Fachaussagen, Zaun, Methodenkarten nicht ändern,
kein worktree). Ist das Tor nach drei Runden rot: nichts löschen, Stand und
Grund melden.
```
