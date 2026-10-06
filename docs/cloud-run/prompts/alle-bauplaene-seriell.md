# Prompt — alle freigegebenen Baupläne, streng nacheinander

Für `/loop` ohne Intervall (Claude Code, Ordner `D:\OS\dev\bbw-hko`, Branch
`v42-skill`, Modell Opus). Ein Durchgang = genau eine Einheit. Aufruf:

```
/loop Lies docs/cloud-run/prompts/alle-bauplaene-seriell.md und führe genau einen Durchgang aus.
```

Mit `/goal` geht derselbe Text: «Lies docs/cloud-run/prompts/alle-bauplaene-seriell.md
und arbeite Durchgang für Durchgang, bis die Warteschlange leer ist.»

Dieser Prompt bestimmt nur, **welcher** Bauplan an der Reihe ist, und hält die
Schleife am Laufen. **Wie** eine Einheit entsteht — Rollen und Modelle,
Vorprüfung, was gleichzeitig laufen darf, Messung, Tor, Gegenleser,
Fakten-Audit, Abschluss, Abbruch, Bericht, Commit — steht in der Skill
`bbw-hko-heft-v42`: `.claude/skills/bbw-hko-heft-v42/SKILL.md` und
`references/lauf.md` (Start «Schleife»).

---

## Ein Durchgang

### 1. Warteschlange bestimmen (nur lesen)

Alle Dateien `docs/cloud-run/bauplaene/<ordner>.md` ohne `_VORLAGE.md`,
aufsteigend nach Dateiname. Immer überspringen: `3.1.1_konsum_verantworten_3j.md`
— das ist ein Anpassungsplan, kein Bauplan für die Erzeugung.

Ein Bauplan ist **an der Reihe**, wenn die Vorprüfung der Skill
(`references/lauf.md` §3, Zeilen 2 bis 5) ihn nicht ausschliesst: Freigabe mit
Datum, noch kein Commit der Einheit, kein Bericht «nicht erzeugbar», kein
vorhandener Ordner. Trifft Zeile 1 der Vorprüfung zu (eine andere Session
arbeitet im Arbeitsbaum), endet der Durchgang ohne Arbeit mit einer Meldung.

### 2. Ist nichts an der Reihe

Schleife beenden (bei `/loop`: ScheduleWakeup mit `stop: true`). Letzte
Nachricht: Tabelle aller Baupläne mit Stand — fertig · nicht erzeugbar ·
Freigabe offen · Ordner ohne Commit · wartet auf die Freigabe der Einheit.

### 3. Sonst: den ersten Bauplan der Schlange ausführen

```
Erzeuge mit der Skill bbw-hko-heft-v42 im Auto-Modus die Einheit aus Bauplan <ordner>.
```

Genau diese eine Einheit, nach `references/lauf.md`, Start «Schleife».

### 4. Nach der Einheit

Die kurze Schlussnachricht der Skill für die Schleife (`references/lauf.md`
§9), ergänzt um die Zahl der Baupläne, die noch warten. Bei `/loop`: den
nächsten Durchgang sofort einplanen (kürzeste Wartezeit) — es gibt nichts
abzuwarten.
