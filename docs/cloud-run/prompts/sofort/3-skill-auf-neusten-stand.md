# Skill auf den neusten Stand — ein Ablauf, mit oder ohne Loop

Session in `D:\OS\dev\bbw-hko`, Branch `v42-skill`. Darf die Skill
`bbw-hko-heft-v42` und die Prompts ändern; **keine** Einheit, kein Skript.

```
Heute gilt für einen Lauf eine Dreifach-Schichtung: Skill ← Prompt
«einheit-aus-bauplan-lokal» ← Prompt «alle-bauplaene-seriell» («diese
Abweichungen gehen vor») ← ENTSCHEIDE E30 («geht vor dem Text der Skill»).
Wer ohne Loop startet, arbeitet nach altem Stand. Ziel: Die Skill allein
beschreibt den geltenden Ablauf. Jeder Start — einzelne Einheit, Loop,
Abschluss — ruft dieselbe Skill und bekommt denselben Ablauf.

1. INVENTAR (zuerst, als Tabelle in deiner Antwort)
   Jede Regel, die heute NUR ausserhalb der Skill steht:
   - docs/upgrade-v4.2/ENTSCHEIDE.md E28–E32
   - docs/cloud-run/prompts/*.md (alle Abschnitte «Abweichungen», «Was immer
     gilt», Vorprüfung, Rollen und Modelle, Parallelität, Abbruchfälle)
   - docs/cloud-run/laeufe/*/BERICHT.md und NACHTRAG.md, je der Abschnitt
     «Fehler in Skill, Skript, Renderer» (nur Regel-Lücken der Skill)
   - docs/upgrade-v4.2/RUECKBLICK-produktion-2026-10-06.md §3–§5
   Spalten: Regel · steht in · widerspricht der Skill in (Datei, Zeile) ·
   kommt nach.

2. EINARBEITEN
   a) E30: die sechs gesperrten Wörter an allen Stellen entfernen (SKILL.md
      §6, auto-modus, sprache §7.2, phase-0 §9, phase-2-3, phase-4, phase-6,
      phase-7, phase-q, datenvertrag). Danach findet
      grep -rn "E24\|Leasing" .claude/skills/bbw-hko-heft-v42 nur noch
      historische Verweise.
   b) Neue Reference references/lauf.md: Rollen und Modelle (Orchestrator
      Opus, Executor Opus, Gegenleser Sonnet, Fakten-Audit Opus), was
      parallel laufen darf, was nur der Orchestrator tut, EINE Session je
      Arbeitsbaum (die Ausnahme «zweite Session» entfällt), Vorprüfung,
      Abbruchfälle (verschieben nach laeufe/…/abgebrochen/, nicht löschen —
      phase-9 §2 sagt heute «entfernen»: angleichen), Commit-Umfang inkl.
      Bauplan, Dev-Server nur bei Einzelstart.
   c) Messung in die Schreibphase: Executor A und B messen ihr Heft selbst
      (export-v42 in einen eigenen Temp-Ordner, messen-v42), bevor sie
      abgeben. In phase-4/5/6 und in lauf.md.
   d) Neue Phase 10 «Abschluss vor der Freigabe» (references/
      phase-10-abschluss.md): Fakten-Audit an Primärquellen mit Tabelle,
      Zahlen nachrechnen, offene Befunde des Berichts abarbeiten, erneutes
      Lesen nach der letzten Änderung, Gegenhör-Liste für Pietro,
      Freigabeschritt. Herkunft: E32 und die NACHTRAG-Dateien.
   e) Bauplan-Vorlage (docs/cloud-run/bauplaene/_VORLAGE.md und phase-1):
      neuer Abschnitt «Fakten» — jede Rechts- und Sachaussage, die die
      Einheit tragen soll, mit Primärquelle, URL, Abrufdatum. Die Erzeugung
      zitiert nur daraus.
   f) Bericht-Gerüst als assets/bericht-template.md: Kopf (Ordner, Modelle,
      Beginn, Ende, Runden), feste Abschnitte, «offen» als Liste mit
      Kürzel E/S/R/Q und Stand. NACHTRAG entfällt als eigene Form: Phase 10
      schreibt in denselben Bericht weiter.
   g) gegenleser.md: «1. Lehrjahr» aus dem Lehrjahr der Einheit herleiten;
      Lösungs-Audit bekommt Untertitel in voller Auflösung.
   h) SKILL.md: Phasentabelle um 10 erweitern, §3 Betriebsarten um «Start»
      ergänzen (siehe 3), §1 Vorrang: ENTSCHEIDE bleibt oben, aber jede neue
      E-Nummer wird in derselben Session in die Skill eingearbeitet —
      «gilt vor dem Text der Skill, noch nicht nachgeführt» ist kein
      zulässiger Zustand mehr.

3. PROMPTS SCHRUMPFEN
   - einheit-aus-bauplan-lokal.md → höchstens zehn Zeilen: Skill im
     Auto-Modus für <ordner>, sonst nichts Eigenes.
   - alle-bauplaene-seriell.md → nur noch Warteschlange und Schleife; alles
     Übrige verweist auf references/lauf.md.
   - abschluss-*.md, anpassung-*, zwei-einheiten-lokal.md,
     review-lernende-t2.md, die zwei Cloud-Prompts: nach
     docs/cloud-run/prompts/archiv/ verschieben (git mv), mit einer Zeile
     «historisch, Stand vom …».
   - Kein Prompt nennt mehr E-Nummern oder «geht vor».

4. BEWEIS
   - Trockenlauf: Ein Subagent (Opus) bekommt NUR «Erzeuge mit der Skill
     bbw-hko-heft-v42 die Einheit aus Bauplan 5.1.1_rechte_pflichten_
     verstehen — nenne mir zuerst deinen Ablauf Schritt für Schritt, mit
     Rollen, Reihenfolge und allem, was du nicht tun darfst. Schreibe
     nichts.» Ein zweiter bekommt dasselbe über den Loop-Prompt. Beide
     Abläufe nebeneinanderlegen: sie müssen gleich sein und Messung in der
     Schreibphase, Fakten-Audit, Phase 10 und den Commit-Umfang enthalten.
     Abweichungen in der Skill beheben, nochmals.
   - Tote Verweise in der Skill: keine.
   - Eintrag in ENTSCHEIDE.md (nächste Nummer): was eingearbeitet ist.

GRENZEN
Keine inhaltliche Regel erfinden, die nirgends belegt ist — jede neue Zeile
der Skill nennt ihre Herkunft (E-Nummer, Bericht, Rückblick). Skripte nicht
ändern: wo die Skill ein Skript verlangt, das es noch nicht gibt (lauf.mjs,
check-zeiger, karten-verbraucher), steht «sobald vorhanden» und der Handweg.
Commit(s) ohne Push.
```
