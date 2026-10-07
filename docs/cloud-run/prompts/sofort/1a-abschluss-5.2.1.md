# Abschluss und Freigabe: 5.2.1_gesetze_veraendern

Eigene Session in `D:\OS\dev\bbw-hko`, Branch `v42-skill`, Modell Opus 5.5.
**Nicht gleichzeitig** mit einer anderen Session im selben Arbeitsbaum (auch
nicht mit `1b-abschluss-4.3.1.md`): zuerst diese, dann die andere.

```
Du bringst die Einheit src/data/einheiten/5.2.1_gesetze_veraendern/ vom
liegengebliebenen Stand bis zur Freigabe für alle Lehrpersonen. KT1 macht kein
Review — was du nicht findest, findet vor dem Unterricht niemand.

AUSGANGSLAGE (Stand 06.10.2026, zuerst selbst nachprüfen)
- Alle sechs Dateien liegen uncommittet im Arbeitsbaum (letzte Änderung
  05.10.2026 10:55), dazu die Karten src/data/quellen/q-521*.json und die
  Volltexte unter D:\OS\_lab\quellen-archiv\bbw-hko\q-521*.
- node scripts/check-all.mjs 5.2.1_gesetze_veraendern war am 06.10. GRUEN.
- Es gibt KEINEN Laufordner und KEINEN Bericht. Ob Messung, Gegenleser und
  Lösungs-Audits gelaufen sind, ist nicht belegt — gehe davon aus: nein.
- Bauplan: docs/cloud-run/bauplaene/5.2.1_gesetze_veraendern.md (freigegeben
  am 2026-10-04). Er gilt; du änderst keinen Entscheid.

ZUERST LESEN
SKILL.md der Skill bbw-hko-heft-v42, references/auto-modus.md,
phase-9-tor.md, gegenleser.md, kohaerenz.md, datenvertrag.md;
docs/upgrade-v4.2/ENTSCHEIDE.md E28–E32 (E30 geht vor dem Text der Skill);
docs/upgrade-v4.2/RUECKBLICK-produktion-2026-10-06.md §4 (welche Fehler das
Tor nicht sieht); den Bauplan ganz.

ABLAUF
1. Bestand aufnehmen: jede Datei gegen den Bauplan lesen. Was fehlt oder
   abweicht, zuerst nachziehen (Executor je Datei, Opus).
2. Tor nach references/phase-9-tor.md §1, vollständig, inklusive Export und
   Messung. Überlauf wird in den Daten behoben.
3. Gegenleser nach references/gegenleser.md (Sonnet, parallel): je Heft und
   Spur Lernende Profil a und Lösungs-Audit, ein Bogen-Leser, ein Sweep.
   Die Lösungs-Audits bekommen die Untertitel bzw. das Transkript in voller
   Auflösung (jede Zeile mit Zeitmarke), nicht in Blöcken.
4. Fakten-Audit (neu, eigener Subagent, Opus, mit Netz): jede Rechts- und
   Sachaussage der Einheit — Artikelnummern, Fristen, Zahlen, Unterschriften-
   zahlen, Abstimmungsergebnisse, «Stand …» — an der Primärquelle prüfen
   (fedlex.admin.ch, admin.ch, bfs.admin.ch, ch.ch, Kantonsseiten). Ergebnis
   als Tabelle: Aussage · Datei/Feld · Primärquelle mit URL · Abrufdatum ·
   stimmt / stimmt nicht / nicht belegbar. Was nicht belegbar ist, wird als
   Fallüberlegung gekennzeichnet oder gestrichen.
5. Jeden Befund am Dokument nachprüfen, dann korrigieren; Tor und Messung
   neu. Hat eine Runde sichtbaren Text oder eine Lösung geändert, lesen
   Lernende und Lösungs-Audit die geänderten Stellen noch einmal. Höchstens
   drei Runden.
6. Zahlen von Hand nachrechnen (jede Rechnung, jedes «x von y»), und prüfen,
   dass die Fallzahlen der Situation überall gleich stehen.
7. Bericht nach docs/cloud-run/laeufe/2026-10-06-5.2.1_gesetze_veraendern/
   BERICHT.md im Gerüst der bisherigen Berichte; dazu check-all.txt und
   messung.txt (vollständige Ausgabe). Die Fakten-Tabelle aus Schritt 4 gehört
   in den Bericht. Abschnitt «offen» als Liste.
8. Commit «Einheit 5.2.1_gesetze_veraendern (bbw-hko-heft-v42)» mit Einheit,
   Karten q-521*, Bauplan, Laufordner, den zwei Index-Dateien. Status bleibt
   "entwurf". Kein Push.

EINZIGER STOPP — vor der Freigabe
Lege mir vor: grün oder nicht; die Liste, was ich gegenhören und gegensehen
muss (je Quelle: Titel, Ausschnitt von–bis, worauf ich achten soll); die
offenen Punkte; die Fakten, die nicht belegbar waren. Warte auf mein «ok».

NACH DEM OK
set.json › status auf "publiziert", npm run build:einheiten-index,
node scripts/check-all.mjs 5.2.1_gesetze_veraendern,
node scripts/bestand-v42.mjs --pruefen, npm run build. Commit «Freigabe:
5.2.1_gesetze_veraendern». Eintrag in ENTSCHEIDE.md (nächste freie Nummer).
Dann nach main mergen und pushen wie bei E32 (Merge-Commit, kein Rebase).
Danach die Adresse auf bbw-hko.ch nennen und prüfen, dass die Einheit im
Katalog erscheint.

WAS IMMER GILT
- Fachaussagen nur aus material/_lehrmittel/, dem nRLP-Datensatz, den
  Archivtexten der Karten und den Primärquellen aus Schritt 4. Kein Lehrmittel-
  und kein Quellentext im Repo.
- Nicht anfassen: src/lib, src/components, src/pages, scripts/, die Skill,
  andere Einheiten, fremde Quellenkarten. Methodenkarten: nicht ändern; passt
  eine Karte nicht, überschreibt die Einheit (`fuer`, ausnahmsweise
  `beispiel`) — Fehler in der Karte selbst gehören in den Bericht.
- Der Ordner 4.3.1_vielfalt_untersuchen ist unfertig und gehört einer
  späteren Session: nicht anfassen, nicht committen. Steht er im Index,
  ist das in Ordnung, solange er "entwurf" trägt.
- Kein git worktree, kein npm ci, kein Branchwechsel ausser für den Merge.
```
