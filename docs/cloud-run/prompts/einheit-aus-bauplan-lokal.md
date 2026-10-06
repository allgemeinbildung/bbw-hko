# Prompt — eine Einheit aus einem freigegebenen Bauplan, lokal, ohne Stopp

Lokal in einer Chat-Session im Ordner `D:\OS\dev\bbw-hko` (Branch `v42-skill`,
Modell Opus 5.5) einfügen. Nur die Zeile unter «BAUPLAN» anpassen. Kein
Cloud-Lauf: Alles geschieht im lokalen Arbeitsbaum.

Voraussetzung: Der Bauplan trägt «**Freigabe:** freigegeben am JJJJ-MM-TT»
und §7 ist gefüllt (Karten unter `src/data/quellen/`, Archivtexte unter
`D:\OS\_lab\quellen-archiv\bbw-hko\`). Mehrere Einheiten: je Einheit eine
eigene Session, nacheinander — nie zwei Tore gleichzeitig im selben
Arbeitsbaum.

```
Du bist der Orchestrator (Opus 5.5) und erzeugst lokal EINE Einheit mit der
Skill .claude/skills/bbw-hko-heft-v42/ im AUTO-MODUS — vom Bauplan bis zum
grünen Tor, ohne Rückfrage. Subagenten: Opus für begrenzte Schreibaufträge,
Sonnet für Gegenlesen.

BAUPLAN
docs/cloud-run/bauplaene/<ordnername>.md

ZUERST LESEN
Den Bauplan ganz. SKILL.md der Skill ganz, references/auto-modus.md,
kohaerenz.md, datenvertrag.md, sprache.md; docs/upgrade-v4.2/ENTSCHEIDE.md
E20–E29; die Berichte unter docs/cloud-run/laeufe/ (dort je der Abschnitt
«Fehler in Skill, Skript, Renderer»: bekannt — nicht neu melden, nicht
reparieren).

VORPRÜFUNG (du selbst, vor jedem Schreiben)
- Freigabe-Zeile trägt ein Datum. Steht dort «offen»: abbrechen und nur das
  melden.
- Jede Quelle aus §7 mit Stand «geprüft»: Karte unter src/data/quellen/ UND
  Archivtext vorhanden. Fehlt etwas: Regel aus auto-modus.md (Spur entfällt
  oder «nicht erzeugbar»), Entscheid in den Bericht.
- §9 des Bauplans: Steht dort eine Blockade («nicht erzeugbar bis …»),
  abbrechen und nur das melden.
- Der Bauplan gilt. Du änderst keinen Entscheid; die Phasen 0, 1 und Q
  laufen nicht, es wird nicht recherchiert.

ERZEUGUNG
- Du schreibst prinzip.json und kn.json selbst (Phasen 2–3) und prüfst sie.
- Executor A und Executor B (Opus, parallel): je ein Heft vollständig
  (Phasen 4, 5, 6). Dann Executor Set (Phase 7), dann Executor Begleiter
  (Phase 8, Marker nur mit scripts/begleiter-marker.mjs der Skill).
- Gegenleser (Sonnet, nur berichten) nach references/gegenleser.md der
  Skill: je Heft und vorhandener Spur ein/e Lernende/r Profil a und ein
  Lösungs-Audit; ein/e Lernende/r am Auftragsbogen; ein Sweep. Die
  Lernenden bearbeiten das Dokument wirklich (Paket mit seitentext.mjs,
  Auftrag wörtlich aus §4.1). Du prüfst jeden Befund am Dokument nach,
  bevor er als genauer Auftrag an den Executor der Datei geht; danach das
  Tor neu. Hat eine Runde sichtbaren Text geändert — auch nur gekürzt —,
  lesen die Lernenden die geänderten Seiten noch einmal. Höchstens drei
  Runden.

TOR (du selbst, nacheinander)
   npm run build:einheiten-index
   node .claude/skills/bbw-hko-heft-v42/scripts/begleiter-marker.mjs <ordner> --check
   node scripts/check-all.mjs <ordner>
   node scripts/export-v42.mjs <ordner> --out <tmp>
   node scripts/messen-v42.mjs <tmp>
   node scripts/bestand-v42.mjs --pruefen
   npm run build
   Die Messung läuft hier mit der Schreibschrift Segoe Print; sie gilt, vor
   allem für Seite 6. Ein Überlauf bis 2 px auf Seite 6 ist hingenommen (E28)
   und wird nur gemeldet; alles darüber wird in den Daten behoben.
   Dazu einmal: node scripts/check-all.mjs 1.3.1_konsum_verantworten_v42
   2.3.1_anliegen_vertreten 2.1.1_informationen_hinterfragen — bleibt grün.

WAS IMMER GILT
- Kein Push, kein Deploy, kein Merge. Branch bleibt v42-skill. Ein Commit,
  erst nach grünem Tor: «Einheit <ordner> (bbw-hko-heft-v42)».
- Ein Arbeitsbaum: KEIN git worktree (das Lehrmittel ist gitignored und
  fehlt dort), KEIN npm ci, kein Branchwechsel. Jeder Executor schreibt nur
  in seine eine Datei; Index und Build laufen nur bei dir.
- Fachaussagen nur aus material/_lehrmittel/, dem nRLP-Datensatz des
  Lehrgangs und den Archivtexten der Quellen aus §7. Kein Lehrmittel- und
  kein Quellentext im Repo. status exakt "entwurf".
- Nicht anfassen: src/lib, src/components, src/styles, src/pages, scripts/,
  bestehende Einheiten und Karten, andere Skills, die Skill selbst, den
  Bauplan. Fehler in Skill, Skript oder Renderer: in den Bericht, nicht
  reparieren.
- Keine Rückfrage. Fehlt eine Voraussetzung: references/auto-modus.md.

ABSCHLUSS
Bericht docs/cloud-run/laeufe/<datum>-<ordnernummer>/BERICHT.md wie bei den
bisherigen Läufen (Tor-Ausgaben, Kapitel und Seiten, Quellen mit Prüfdatum,
Abdeckungstabelle, Vergleich mit Gold Zeile für Zeile, Entscheide, Befunde
der Gegenleser, Unbelegtes, Fehler in Skill und Renderer). Starte den
Dev-Server (astro) und nenne mir die zwei Adressen: Arbeitsansicht und
QR-Seite. Letzte Nachricht: grün oder nicht erzeugbar, was ich vor dem Druck
gegenhören muss, und die drei wichtigsten Punkte.
```
