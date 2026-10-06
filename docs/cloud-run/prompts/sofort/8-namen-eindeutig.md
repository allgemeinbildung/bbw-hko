# Namen eindeutig — Regel und Prüfung

Session in `D:\OS\dev\bbw-hko`, Branch `v42-skill`. Darf `scripts/` und
`references/ableitungsregeln.md` der Skill ändern.

```
Mehrere Einheiten können dieselbe Kompetenznummer tragen (heute: zweimal
2.2.1, dreimal 3.2.1, fünfmal 1.1.1). Alles, was nur aus der Nummer
abgeleitet ist, kann kollidieren. Stand:
- Quellen-IDs: geregelt (ableitungsregeln.md: q-<n>.<k><h>-… für die zweite
  Einheit), aber von keinem Skript geprüft.
- Laufordner docs/cloud-run/laeufe/<datum>-<nummer>: NICHT eindeutig —
  2026-10-03-221 und 2026-10-04-221 sind zwei verschiedene Einheiten und
  unterscheiden sich nur durchs Datum.
- Kurzlink /m/<…>, Heft-IDs, Archivordner, Bauplan-Dateiname: prüfen.

1. ERHEBEN (Tabelle): jede Art von Name, die die Skill ableitet — Ordner,
   herausforderung.id, Kurzlink, Quellen-ID, Archivordner, Bauplan,
   Laufordner, Export-Dateinamen, Karten-IDs neuer Methodenkarten — mit
   Regel, Fundstelle der Regel und der Frage: eindeutig bei zwei Einheiten
   gleicher Nummer? bei zwei Läufen derselben Einheit am selben Tag?

2. REGEL (references/ableitungsregeln.md)
   - Laufordner neu: <datum>-<ordnername>[-<k>] (voller Ordnername; -2, -3
     bei weiteren Läufen am selben Tag). Bestehende Laufordner werden NICHT
     umbenannt (Berichte und Commits verweisen darauf); eine Datei
     docs/cloud-run/laeufe/INDEX.md ordnet jeden vorhandenen Ordner seiner
     Einheit zu.
   - Für jede weitere Lücke aus 1 eine Regel nach demselben Muster:
     ableiten, vor dem Schreiben prüfen, nie überschreiben. Was gedruckt
     ist (Kurzlink, Quellen-ID), bleibt (E21).

3. PRÜFUNG scripts/check-namen.mjs, als Zeile in check-all:
   - jede id in src/data/quellen/ und src/data/methoden/ einmalig; Dateiname
     = id
   - jede Quellenkarte gehört genau einer Einheit (Ausnahme: ausdrücklich
     geteilte Karten wie q-131* in 3.1.1 — als Liste im Skript bzw. Feld
     `geteilt_mit`, Vorschlag machen)
   - archiv_ref zeigt auf einen vorhandenen Ordner GLEICHEN Namens wie die
     id (bekannter Verstoss: q-221a-pflicht / -ersatz, eigener Auftrag)
   - Kurzlinks aller Einheiten paarweise verschieden; herausforderung.id
     beginnt mit dem Ordnernamen (besteht schon)
   - Laufordner neuer Form verweist auf einen vorhandenen Einheiten-Ordner
   - verwaiste Karten (keine Einheit führt sie, kein freigegebener Bauplan
     nennt sie) als Warnung
   Läuft das Archiv lokal nicht: archiv_ref-Prüfung als HINWEIS, nicht grün.

4. BESTAND: check-namen über alles laufen lassen, Befunde als Liste. Nichts
   umbenennen, was gedruckt oder publiziert ist — nur melden.

Skill: phase-0 und auto-modus rufen check-namen vor dem ersten Schreiben.
Loop-Prompt und phase-9: neue Laufordner-Form. Commit ohne Push.
```
