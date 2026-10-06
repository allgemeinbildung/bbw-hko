# Prompt — alle freigegebenen Baupläne, streng nacheinander

Für `/loop` ohne Intervall (Claude Code, Ordner `D:\OS\dev\bbw-hko`, Branch
`v42-skill`, Modell Opus 5.5). Ein Durchgang = genau eine Einheit. Aufruf:

```
/loop Lies docs/cloud-run/prompts/alle-bauplaene-seriell.md und führe genau einen Durchgang aus.
```

Mit `/goal` geht derselbe Text: «Lies docs/cloud-run/prompts/alle-bauplaene-seriell.md
und arbeite Durchgang für Durchgang, bis die Warteschlange leer ist.»

---

## Ein Durchgang

Du erzeugst **genau eine** Einheit und hörst dann auf. Nie zwei Einheiten
gleichzeitig in derselben Session. Subagenten dürfen gleichzeitig laufen, wo
sie sich nicht stören (Abschnitt 3).

### 1. Warteschlange bestimmen (nur lesen)

Für jede Datei `docs/cloud-run/bauplaene/<ordner>.md` (ohne `_VORLAGE.md`), in
dieser festen Reihenfolge:

1. `2.5.1_klimaveraenderung_diskutieren`
2. `1.1.1_ausbildung_kommunizieren`
3. `1.2.1_lernzeit_planen`
4. `2.2.1_meinungsfreiheit_reflektieren`
5. alle übrigen, aufsteigend nach Dateiname

Ein Bauplan ist **an der Reihe**, wenn alle vier Bedingungen gelten:

- Die Zeile `**Freigabe:**` trägt «freigegeben am JJJJ-MM-TT». («offen» →
  überspringen, nicht selbst freigeben.)
- `git log --oneline --grep="Einheit <ordner> "` findet keinen Commit.
  (Gefunden → fertig, überspringen.)
- Unter `docs/cloud-run/laeufe/` gibt es keinen Bericht zu diesem Ordner, der
  «nicht erzeugbar» meldet. (Gefunden → überspringen, nicht erneut versuchen.)
- `src/data/einheiten/<ordner>/` existiert nicht. (Existiert ohne Commit →
  eine andere Session arbeitet daran oder ein Lauf ist abgebrochen: **nicht
  anfassen**, überspringen und am Schluss melden.)

Der Bauplan `3.1.1_konsum_verantworten_3j.md` ist ein **Anpassungsplan**, kein
Bauplan für die Erzeugung: immer überspringen.

Vor dem Start ausserdem prüfen: `git status --short src/data/einheiten/` zeigt
keine fremden, halbfertigen Ordner eines laufenden Tors. Läuft sichtbar ein
anderes Tor (frische Dateien in einem Einheiten-Ordner ohne Commit): diesen
Durchgang ohne Arbeit beenden und das melden.

**Ausnahme — zweite Session nebeneinander.** Nennt der Aufruf den fremden
Ordner ausdrücklich («Session X arbeitet an `<ordner>`»), darf der Durchgang
trotzdem beginnen. Dann gilt:

- Den fremden Ordner, seine Karten und seinen Bericht nie anfassen.
- Schreiben (Prinzip, KN, Hefte, Set, Begleiter) und die Prüfskripte, die
  nur den eigenen Ordner lesen (`check-v42`, `check-lf-loesung`,
  `check-einheiten <ordner> --strict`), sind erlaubt.
- **Gesperrt, bis der fremde Ordner committet ist**
  (`git log --oneline --grep="Einheit <fremder ordner> "` findet den Commit):
  `npm run build:einheiten-index`, `check-all`, `export-v42` aus dem Repo,
  `bestand-v42`, `npm run build`, `git add`, `git commit`. Bis dahin misst
  niemand; die Executor schreiben knapp und warten nicht.
- Ist die Schreibphase fertig und der fremde Commit noch nicht da: alle
  zehn Minuten nachsehen (ScheduleWakeup), sonst nichts tun.
- Beim eigenen Commit nur die eigenen Pfade stagen. Enthält der Index dann
  einen Eintrag der fremden Einheit, ist das in Ordnung, wenn sie committet
  ist.

### 2. Ist nichts an der Reihe

Schleife beenden (bei `/loop`: ScheduleWakeup mit `stop: true`). Letzte
Nachricht: Tabelle aller Baupläne mit Stand (fertig · nicht erzeugbar · offen ·
fremder Ordner) und je fertiger Einheit die Adresse der Arbeitsansicht.

### 3. Sonst: den ersten Bauplan der Schlange ausführen

Führe `docs/cloud-run/prompts/einheit-aus-bauplan-lokal.md` (den Prompt im
Codeblock) für diesen einen Bauplan aus — mit diesen Abweichungen, die
vorgehen:

- **Eine Einheit je Durchgang; Agenten gleichzeitig, wo sie sich nicht
  stören** (Pietro, 04.10.2026). Reihenfolge der Abhängigkeiten:
  prinzip.json und kn.json (du) → Heft A und Heft B → Set → Begleiter →
  Tor → Gegenleser → Korrekturen → Tor. Gleichzeitig laufen dürfen Agenten,
  die **verschiedene Dateien** schreiben und einander nicht brauchen oder
  beeinflussen:
  - Executor Heft A und Executor Heft B (je nur die eigene Datei). B bekommt
    dann Fall, Lebensbereich, Produkt und Begriffe von A aus dem Bauplan,
    nicht aus der fertigen Datei; gleiche Glossarbegriffe gleicht der
    Executor Set ab.
  - alle Gegenleser (Lernende, Lösungs-Audits, Sweep): Sie lesen nur, jede
    Person ihr eigenes Paket.
  - Korrekturrunden an Heft A und Heft B.
  Nacheinander bleiben: Set (braucht beide Hefte), Begleiter (braucht alle
  fünf Dateien), und alles, was nur du tust — Index, Marker, Tor, Messung,
  Build, Commit. Ein Executor, der selbst misst (`export-v42` in einen
  eigenen Temp-Ordner), darf das neben einem anderen tun; meldet ein Skript
  kurz einen JSON-Fehler in der Datei des anderen, läuft es nochmals.
- **Gesperrte Wörter:** ENTSCHEIDE E30 geht vor dem Text der Skill. Die sechs
  Wörter aus E24 sind kein Grund für «nicht erzeugbar».
- **Kein Dev-Server** am Ende des Durchgangs (er würde den nächsten Durchgang
  stören). Nenne statt der Adressen nur den Ordnernamen.
- **Abbruchfälle** (Freigabe fehlt, Blockade in §9, Pflichtquelle fehlt und
  Spur ohne Medien unzulässig, Tor nach drei Runden nicht grün): Bericht nach
  `docs/cloud-run/laeufe/<datum>-<ordnernummer>/BERICHT.md` mit der Zeile
  «nicht erzeugbar: <Grund>», **kein Commit der Einheit**, halbfertigen
  Ordner `src/data/einheiten/<ordner>/` nach
  `docs/cloud-run/laeufe/<datum>-<ordnernummer>/abgebrochen/` verschieben
  (nicht löschen), `npm run build:einheiten-index` neu, damit der Index
  wieder stimmt. Dann Durchgang beenden — der nächste nimmt den nächsten
  Bauplan.

### 4. Abschluss des Durchgangs

- Grün: ein Commit «Einheit <ordner> (bbw-hko-heft-v42)» mit Einheit,
  Quellenkarten dieser Einheit, Bericht und den zwei Index-Dateien. Kein Push.
- Eine kurze Nachricht: Ordner · grün oder nicht erzeugbar · was vor dem
  Druck gegengehört werden muss · wie viele Baupläne noch in der Schlange sind.
- Bei `/loop`: nächsten Durchgang sofort einplanen (kürzeste Wartezeit), es
  gibt nichts abzuwarten.

## Was in jedem Durchgang gilt

- Kein Push, kein Deploy, kein Merge, kein Branchwechsel, kein git worktree,
  kein npm ci.
- Nicht anfassen: Baupläne (auch die Freigabe-Zeile), die Skill, `scripts/`,
  `src/lib`, `src/components`, `src/pages`, bestehende Einheiten und Karten.
  Fehler dort gehören in den Bericht.
- Keine Rückfrage an Pietro. Fehlt eine Voraussetzung:
  `references/auto-modus.md` der Skill.
- Swissdox nicht benutzen, keine Zugangsdaten eingeben. Es wird nicht
  recherchiert; es gilt, was §7 des Bauplans nennt.
