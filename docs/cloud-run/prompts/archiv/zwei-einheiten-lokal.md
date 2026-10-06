# Prompt — zwei weitere Einheiten, lokal im Chat orchestriert

> **Historisch, Stand vom 05.10.2026** — archiviert am 07.10.2026, nicht mehr ausführen. Der geltende Ablauf steht in der Skill `bbw-hko-heft-v42` (`SKILL.md`, `references/lauf.md`).

Lokal in einer Chat-Session im Ordner `D:\OS\dev\bbw-hko` (Branch `v42-skill`,
Modell Opus 5.5) einfügen. Die zwei Zeilen unter «AUFTRAG» anpassen.

```
Du bist der Orchestrator (Opus 5.5) und erzeugst lokal zwei Einheiten mit der
Skill .claude/skills/bbw-hko-heft-v42/ — von der Verortung bis zum grünen Tor.
Subagenten: Opus für begrenzte Schreibaufträge, Sonnet für Suche und Gegenlesen.

AUFTRAG
Einheit 1: Lehrgang EFZ_3J, Lebensbezug 2.2
Einheit 2: Lehrgang EFZ_4J, Lebensbezug 2.4
(Nicht wählen: 4J 2.5 und 8.4 — ENTSCHEIDE E24; Lebensbezüge mit ⚠ in
docs/cloud-run/abdeckung.md; T7.)

ZUERST LESEN
SKILL.md der Skill ganz, references/kohaerenz.md, auto-modus.md,
datenvertrag.md; docs/upgrade-v4.2/ENTSCHEIDE.md E20–E28; als Muster die zwei
freigegebenen Baupläne unter docs/cloud-run/bauplaene/ und die Berichte unter
docs/cloud-run/laeufe/ (dort je der Abschnitt «Fehler in Skill, Skript,
Renderer»: bekannt — nicht neu melden, nicht reparieren).

ABLAUF
A. Vorbereitung, beide Einheiten parallel
   1. Phase 0 und 1 (je ein Opus-Executor): Verortung am Kapiteltext,
      Bauplan-Entwurf nach _VORLAGE.md mit Suchaufträgen in §7.
      «Freigabe: offen».
   2. Phase Q (Sonnet, je Slot-Gruppe ein Worker wie phase-q-quellen.md §5):
      Kandidaten über die Skill srgssr-api (deren Skripte, sequentiell — die
      API hat eine Quote) und Web. Swissdox nur als EIN Nachlauf-Worker für
      alle Audio-Kandidaten beider Einheiten, nie parallel, keine Zugangsdaten
      eingeben. Volltexte nach D:\OS\_lab\quellen-archiv\bbw-hko\<id>\ — nie
      ins Repo.
   3. Je Einheit ein Opus-Executor: Kohärenz-Audit am Archivtext, Karten unter
      src/data/quellen/, gewaehlt/quelle.md, Bauplan vollständig.
B. EIN Stopp für beide Baupläne zusammen. Lege mir je Bauplan vor: Zuschnitt
   und Produkte in fünf Zeilen; die Quellen als Tabelle mit Zugeständnis; die
   Abdeckungstabelle; den Unterschied zu Gold und zu 2.3.1 / 2.1.1 in Modi des
   Auftrags, Produkttypen und SK; und höchstens fünf Entscheide je Einheit mit
   deiner Empfehlung. Weiter erst auf mein «ok» oder meine Korrektur; dann
   trägst du die Entscheide ein und setzt die Freigabe-Zeile.
C. Erzeugung im Auto-Modus, je Einheit (die zwei Einheiten dürfen parallel
   laufen):
   - Du schreibst prinzip.json und kn.json selbst und prüfst sie.
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
D. Tor je Einheit (du selbst, nacheinander, nie zwei Tore gleichzeitig):
   npm run build:einheiten-index
   node .claude/skills/bbw-hko-heft-v42/scripts/begleiter-marker.mjs <ordner> --check
   node scripts/check-all.mjs <ordner>
   node scripts/export-v42.mjs <ordner> --out <tmp>
   node scripts/messen-v42.mjs <tmp>
   node scripts/bestand-v42.mjs --pruefen
   npm run build            (einmal am Schluss für beide)
   Die Messung läuft hier mit der Schreibschrift Segoe Print; sie gilt, vor
   allem für Seite 6. Ein Überlauf bis 2 px auf Seite 6 ist hingenommen (E28)
   und wird nur gemeldet; alles darüber wird in den Daten behoben.
   Dazu einmal: node scripts/check-all.mjs 1.3.1_konsum_verantworten_v42
   2.3.1_anliegen_vertreten 2.1.1_informationen_hinterfragen — bleibt grün.

WAS IMMER GILT
- Kein Push, kein Deploy, kein Merge. Branch bleibt v42-skill. Ein Commit je
  Einheit, erst nach grünem Tor: «Einheit <ordner> (bbw-hko-heft-v42)».
- Ein Arbeitsbaum für alle: KEIN git worktree (das Lehrmittel ist gitignored
  und fehlt dort), KEIN npm ci, kein Branchwechsel. Jeder Executor schreibt
  nur in seine eine Datei; Index und Build laufen nur bei dir.
- Sprachmodi, Schlüsselkompetenzen und Produkte werden aus nRLP-Datensatz und
  Prinzip hergeleitet — nicht aus Gold, nicht aus 2.3.1 oder 2.1.1, nicht aus
  einem Skelett. Die zwei neuen Einheiten sollen sich auch voneinander
  unterscheiden, soweit die Herleitung das ergibt.
- Fachaussagen nur aus material/_lehrmittel/, dem nRLP-Datensatz des Lehrgangs
  und den Archivtexten gewählter Quellen. Kein Lehrmittel- und kein
  Quellentext im Repo. status exakt "entwurf".
- Nicht anfassen: src/lib, src/components, src/styles, src/pages, scripts/,
  bestehende Einheiten und Karten, andere Skills, die Skill selbst. Fehler in
  Skill, Skript oder Renderer: in den Bericht, nicht reparieren.
- Keine Rückfrage ausser dem einen Stopp in B. Fehlt eine Voraussetzung:
  references/auto-modus.md.

ABSCHLUSS
Je Einheit ein Bericht docs/cloud-run/laeufe/<datum>-<ordnernummer>/BERICHT.md
wie bei den zwei Cloud-Läufen (Tor-Ausgaben, Kapitel und Seiten, Quellen mit
Prüfdatum, Abdeckungstabelle, Vergleich mit Gold Zeile für Zeile, Entscheide,
Befunde der Gegenleser, Unbelegtes, Fehler in Skill und Renderer). Starte den
Dev-Server (astro) und nenne mir die vier Adressen: Arbeitsansicht und
QR-Seite je Einheit. Letzte Nachricht: je Einheit grün oder nicht erzeugbar,
was ich vor dem Druck gegenhören muss, und die drei wichtigsten Punkte.
```
