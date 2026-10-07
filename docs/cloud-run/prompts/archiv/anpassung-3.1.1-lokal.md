# Prompt — Gold 1.3.1 für EFZ 3J anpassen (3.1.1), lokal, ohne Stopp

> **Historisch, Stand vom 04.10.2026** — archiviert am 07.10.2026, nicht mehr ausführen. Der geltende Ablauf steht in der Skill `bbw-hko-heft-v42` (`SKILL.md`, `references/lauf.md`).

Lokal in einer neuen Session im Ordner `D:\OS\dev\bbw-hko` (Branch
`v42-skill`, Modell Opus 5.5) einfügen. Erst starten, wenn der Plan
«**Freigabe:** freigegeben am JJJJ-MM-TT» trägt und keine andere Session
gerade eine Einheit erzeugt (ein Tor zur Zeit im selben Arbeitsbaum).

```
Du stellst die Einheit 3.1.1_konsum_verantworten_3j her — als ANPASSUNG der
Gold-Einheit src/data/einheiten/1.3.1_konsum_verantworten_v42/, nicht als
Neuerzeugung. Der Plan dafür ist
docs/cloud-run/bauplaene/3.1.1_konsum_verantworten_3j.md. Er gilt; du änderst
keinen Entscheid.

ZUERST LESEN
Den Plan ganz (besonders Teil M, Teil S, §7, §9 und §11 «Ausführung»).
Von der Skill .claude/skills/bbw-hko-heft-v42/: SKILL.md, references/
datenvertrag.md, phase-5-spuren.md, phase-6-abschluss.md, phase-8-begleiter.md,
sprache.md. docs/upgrade-v4.2/ENTSCHEIDE.md E20–E30 (E30 geht vor dem Text der
Skill: die sechs Wörter aus E24 sind nicht gesperrt). Die vier Archivtexte
D:\OS\_lab\quellen-archiv\bbw-hko\q-311*\gewaehlt\quelle.md.

VORPRÜFUNG
- Freigabe-Zeile des Plans trägt ein Datum; sonst abbrechen und nur das melden.
- src/data/einheiten/3.1.1_konsum_verantworten_3j/ existiert nicht.
- Die vier Karten src/data/quellen/q-311*.json und ihre Archivtexte liegen vor.

AUSFÜHRUNG
Genau die Schritte aus §11 des Plans, in dieser Reihenfolge, streng seriell
(höchstens ein Subagent gleichzeitig): Gold-Ordner kopieren → Teil M
(mechanisch, jede Zeile des Plans) → Teil S je Heft (LF3 mit Raster und
Lösung an der neuen Quelle, Glossar, Begleiter-Stellen) → Index → Tor.
Gold selbst bleibt unverändert. Wo der Plan Stichworte mit Zeichengrenze gibt,
formulierst du aus und zählst nach. Fachaussagen nur aus Lehrmittel,
nRLP-Datensatz 3J und den Archivtexten.

Danach Gegenleser nach references/gegenleser.md der Skill, einzeln
nacheinander, nur für die geänderten Seiten (S. 3 und die Lösung je Heft,
Glossar, Begleiter): je Heft ein/e Lernende/r Profil a, ein Lösungs-Audit,
ein Sweep über die ganze Einheit. Befunde am Dokument nachprüfen, beheben,
Tor neu. Höchstens drei Runden.

TOR (nacheinander)
   npm run build:einheiten-index
   node .claude/skills/bbw-hko-heft-v42/scripts/begleiter-marker.mjs 3.1.1_konsum_verantworten_3j --check
   node scripts/check-all.mjs 3.1.1_konsum_verantworten_3j
   node scripts/export-v42.mjs 3.1.1_konsum_verantworten_3j --out <tmp>
   node scripts/messen-v42.mjs <tmp>
   node scripts/bestand-v42.mjs --pruefen
   node scripts/check-all.mjs 1.3.1_konsum_verantworten_v42     (Gold bleibt grün)
   npm run build
Dazu die Prüftabelle aus §11 zum Risiko «beide Hefte nur mit Medien»
(Arbeitsansicht, Export, Lösungen, QR-Seite, Präsentation, Werkstatt, Index,
Messung): jede Zeile ausführen und das Ergebnis in den Bericht.

WAS GILT
- Kein Push, kein Deploy, kein Merge, kein Branchwechsel, kein git worktree,
  kein npm ci. Ein Commit nach grünem Tor:
  «Einheit 3.1.1_konsum_verantworten_3j (Anpassung von 1.3.1, bbw-hko-heft-v42)».
- Nicht anfassen: Gold, andere Einheiten und Karten, die Skill, scripts/,
  src/lib, src/components, src/pages, den Plan. Fehler dort — auch ein
  Renderer, der eine Einheit ohne Spur «ohne Medien» nicht verträgt — gehören
  in den Bericht, nicht repariert. Ist das Tor deswegen nicht grün zu
  bekommen: kein Commit, Ordner stehen lassen, genau melden, woran es hängt.
- Keine Rückfrage. Kein Swissdox, keine Zugangsdaten, kein Mediendownload.

ABSCHLUSS
Bericht docs/cloud-run/laeufe/<datum>-3.1.1/BERICHT.md: Tor-Ausgaben, jede
Abweichung vom Plan mit Grund, Prüftabelle §11, Befunde der Gegenleser, was
vor dem Druck gegengesehen werden muss (Videos sind nur über Untertitel
geprüft). Letzte Nachricht: grün oder nicht, und die drei wichtigsten Punkte.
```
