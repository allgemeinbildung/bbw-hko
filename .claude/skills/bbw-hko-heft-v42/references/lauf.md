# Lauf — ein Ablauf für jeden Start

Diese Datei sagt, **wer was in welcher Reihenfolge tut**, sobald ein
freigegebener Bauplan vorliegt. Sie gilt für jeden Start gleich: einzelne
Einheit, Schleife über alle Baupläne, Abschluss einer vorhandenen Einheit. Ein
Prompt wählt nur, **welcher** Bauplan an der Reihe ist — nie, **wie** gearbeitet
wird. Steht in einem Prompt etwas anderes als hier, gilt diese Datei
(ENTSCHEIDE E34).

Was die einzelnen Phasen schreiben, steht in ihren References; hier steht nur
der Ablauf darum herum.

**Herkunft.** Jede Regel nennt in eckigen Klammern, woher sie stammt:

| Kürzel | Quelle |
|---|---|
| E28 … E38 | `docs/upgrade-v4.2/ENTSCHEIDE.md` |
| Rb §n | `docs/upgrade-v4.2/RUECKBLICK-produktion-2026-10-06.md` |
| P-einzel | `docs/cloud-run/prompts/einheit-aus-bauplan-lokal.md`, Fassung bis 07.10.2026 (Git `ad54734`) |
| P-loop | `docs/cloud-run/prompts/alle-bauplaene-seriell.md`, Fassung bis 07.10.2026 (Git `ad54734`) |
| P-abschluss | `docs/cloud-run/prompts/archiv/abschluss-2.1.1.md`, `abschluss-2.3.1.md` |
| P-1a | `docs/cloud-run/prompts/sofort/1a-abschluss-5.2.1.md` |
| B `<lauf>` §n | `docs/cloud-run/laeufe/<lauf>/BERICHT.md`, N = `NACHTRAG.md` |

## 1. Start — drei Wege, ein Ablauf

| Start | Auslöser | Beginnt bei | Besonderes |
|---|---|---|---|
| **Einzelstart** | ein Satz im Gespräch: «Erzeuge mit der Skill die Einheit aus Bauplan `<ordner>`» — oder Lehrgang und Kompetenz ohne Bauplan | mit freigegebenem Bauplan: Abschnitt 3. Ohne: Phasen 0, 1, Q und der eine Stopp (`SKILL.md` §3), danach Abschnitt 3 | am Schluss Dev-Server und der Stopp vor der Freigabe (Abschnitt 9) |
| **Schleife** | `docs/cloud-run/prompts/alle-bauplaene-seriell.md` (`/loop` oder `/goal`) | der Prompt bestimmt den nächsten Bauplan; dann Abschnitt 3 | genau eine Einheit je Durchgang; kein Dev-Server, kein Warten auf Pietro |
| **Abschluss** | der Aufruf nennt einen **vorhandenen** Ordner unter `src/data/einheiten/`, der noch `"entwurf"` trägt («bring `<ordner>` bis zur Freigabe») | Bestand aufnehmen: jede Datei gegen den Bauplan lesen, Fehlendes nachziehen (Executor je Datei); dann Abschnitt 4 ab Schritt 6 | nie von sich aus — nur, wenn der Aufruf den Ordner nennt |

[Einzelstart, Schleife: P-einzel, P-loop. Abschluss: E32, P-abschluss, P-1a;
Rb §1 Schritt 9 und §3 Nr. 1 — die Schleife überspringt einen Ordner ohne
Commit für immer, darum der eigene Start.]

Alle drei Wege durchlaufen dieselben Schritte aus Abschnitt 4 mit denselben
Rollen. Ein Lauf ohne Messung in der Schreibphase, ohne die drei Audits
(Lösungs-Audit, Fakten-Audit, Lösbarkeitsprobe — `references/audits.md`) oder
ohne Phase 10 ist kein gültiger Lauf, gleich wie er gestartet wurde. [Rb §3
Nr. 3, §4, §5.2; E32, E38]

## 2. Rollen und Modelle

| Rolle | Modell | Tut | Schreibt in |
|---|---|---|---|
| **Orchestrator** | Opus | Vorprüfung; `prinzip.json` und `kn.json` (Phasen 2–3); eine vom Bauplan §9 verlangte **neue Methodenkarte**, bevor die Executor starten; Aufträge an alle anderen; Index, Marker-Skript bei jedem Lauf **nach** Phase 8, Tor, Messung des Ganzen, Build; jeden Befund am Dokument nachprüfen; Bericht; Commit | `prinzip.json`, `kn.json`, neue Methodenkarte, Laufordner, Index (nur über das Skript) |
| **Executor A**, **Executor B** | Opus | je ein Heft vollständig: Phasen 4, 5, 6 — **misst das eigene Heft**, bevor er abgibt (Abschnitt 6), und schreibt die erfundenen Fallzahlen seines Hefts als `fall.<A\|B>.json` (`belege.md` §6); später die Korrekturen am eigenen Heft | nur die eigene `herausforderung_<A\|B>.json`, einen eigenen Temp-Ordner und die eigene Teildatei `fall.<A\|B>.json` im Quellenarchiv unter `_pruefung/<ordnername>/` |
| **Executor Set** | Opus | Phase 7, nach beiden Heften; schreibt die Fallzahlen des Auftrags als `fall.auftrag.json` | nur `set.json` und die eigene Teildatei `fall.auftrag.json` |
| **Executor Begleiter** | Opus | Phase 8, nach allen fünf Dateien; füllt die Marker **einmal**, am Ende von Phase 8, mit `scripts/begleiter-marker.mjs` der Skill an seiner eigenen Datei — nie von Hand | nur `begleiter.md` |
| **Gegenleser** (Lernende, Bogen-Leser, Sweep) | Sonnet | lesen und berichten nach `references/gegenleser.md`; die Lernenden und der Bogen-Leser geben dazu ihr **Produkt als Datei** ab; ändern nichts | nur die eigenen Rückgabedateien im Temp |
| **Lösungs-Audit** | Opus | je Heft und Spur, dazu der Auftrag: löst **blind** an Quelle und Lehrmittel, vergleicht dann mit der Lösung, gibt je Lösungsfeld Herkunft, Anker, Stelle und Urteil ab (`references/audits.md` §2); ändert nichts | nur die eigenen Dateien im Temp und die eigene Teildatei `belege.<heft>.<spur>.json` unter `_pruefung/<ordnername>/` |
| **Fakten-Audit** | Opus, mit Netz | jede Rechts- und Sachaussage an der Primärquelle (`references/audits.md` §3); ändert nichts | nur `fakten.json` unter `_pruefung/<ordnername>/` |
| **Lösbarkeitsprobe** | Sonnet | bewertet das Produkt eines Lernenden-Gegenlesers mit Kriterien und Lösungsbild und meldet, was an der **Aufgabe** liegt (`references/audits.md` §4); ändert nichts | nur die eigene Teildatei `probe.<heft>.<spur>.json` |

[Orchestrator, Executor, Gegenleser: P-einzel «Subagenten: Opus für begrenzte
Schreibaufträge, Sonnet für Gegenlesen». Fakten-Audit Opus: P-1a Schritt 4,
B `2026-10-06-5.2.1_gesetze_veraendern` §6. Lösungs-Audit Opus und blind,
Lösbarkeitsprobe Sonnet, Fallzahlen beim Executor: Rb §5.2, §5.3; Auftrag 10
(`docs/cloud-run/prompts/sofort/10-belege-und-pruefskripte.md`), Stufen A und
C; E38. Ob das Lösungs-Audit dauerhaft Opus braucht, misst der Beweis zu
Auftrag 10 — bis zu einem Entscheid Opus (E38, «offen für Pietro»). Teildatei
je Schreiber statt einer gemeinsamen Datei: Entscheid Executor Stufe C, E38.
Marker-Skript einmal beim Executor
Begleiter, danach beim Orchestrator, und neue Methodenkarte beim Orchestrator
(geteilte Daten, ein Schreiber): Entscheide des Orchestrators nach dem
Trockenlauf, E34.]

## 3. Vorprüfung — der Orchestrator, vor jedem Schreiben

**Zuerst lesen:** den Bauplan ganz; `SKILL.md`; diese Datei;
`references/auto-modus.md`, `kohaerenz.md`, `datenvertrag.md`, `sprache.md`;
je Phase ihre Reference. Bekannte Fehler in Skill, Skript und Renderer:
`docs/cloud-run/OFFEN.md` (sobald vorhanden; bis dahin je Laufbericht der
Abschnitt «Fehler in Skill, Skript, Renderer») — bekannt heisst: nicht neu
melden, nicht reparieren. [P-einzel «ZUERST LESEN»]

Dann, in dieser Reihenfolge; die erste Zeile, die zutrifft, entscheidet:

| # | Prüfung | Trifft zu → |
|---|---|---|
| 1 | Im Arbeitsbaum arbeitet schon eine Session an einer Einheit: `git status --short src/data/einheiten/` zeigt einen fremden Ordner ohne Commit mit frischen Dateien | **nicht beginnen**, nur melden. Eine Session je Arbeitsbaum — ohne Ausnahme. [P-loop §1; die frühere Ausnahme «zweite Session nebeneinander» entfällt: Rb §5.5, B `2026-10-04-311` §6, B `2026-10-04-331` §10 — fremde Index-Einträge im Commit, Messung gegen fremden Renderer-Stand] |
| 2 | Die Zeile `**Freigabe:**` des Bauplans trägt kein Datum | abbrechen, nur das melden; nie selbst freigeben [P-einzel, P-loop §1] |
| 3 | `git log --oneline --grep="Einheit <ordner> "` findet einen Commit | fertig — nichts tun (Schleife: überspringen) [P-loop §1] |
| 4 | Unter `docs/cloud-run/laeufe/` meldet ein Bericht zu diesem Ordner «nicht erzeugbar» | nicht erneut versuchen [P-loop §1] |
| 5 | `src/data/einheiten/<ordner>/` existiert, ohne Commit | **nicht anfassen**; melden. Weiter nur über den Start «Abschluss» (Abschnitt 1) [P-loop §1; Rb §3 Nr. 1] |
| 6 | Bauplan §9 nennt eine Blockade («nicht erzeugbar bis …») | Abbruchfall (Abschnitt 7) [P-einzel] |
| 7 | Der Bauplan besteht die Prüfung gegen Datensatz, Kapiteldateien und Ableitungsregeln nicht (`references/auto-modus.md` §7) und §9 nennt die Abweichung nicht; oder eine Kapiteldatei fehlt | Abbruchfall [E21, E23] |
| 8 | Eine Quelle aus Bauplan §7 mit Stand «geprüft» hat keine Karte unter `src/data/quellen/` **oder** keinen Archivtext | Regel aus `references/auto-modus.md` §5: Spur entfällt oder Abbruchfall; Entscheid in den Bericht [P-einzel, E23] |
| 9 | **Start-Riegel.** `docs/cloud-run/OFFEN.md` (sobald vorhanden) führt eine Zeile, auf die alle drei zutreffen: Spalte «Art» ist `S` oder `P` · Spalte «Stand» beginnt mit `offen` oder `braucht Entscheid` · Spalte «Punkt» enthält den Vermerk `[erzeugt Fehler]` (genau so, in eckigen Klammern) | **nicht beginnen**, nur melden: die ID der Zeile und ihren Punkt. Der Riegel fällt, wenn der Punkt behoben oder ausdrücklich hingenommen ist — dann steht in «Stand» `behoben …`, `hingenommen …` oder `entschieden am …`. Ein Lauf setzt oder entfernt den Vermerk nie selbst. Bis die Liste besteht: kein Riegel, aber die bekannten Fehler aus «Zuerst lesen» gelten. Genaue Form: unter dieser Tabelle [Rb §5.4, Zeile «Skelett, Skill, Renderer»; Auftrag 10, Stufe D Nr. 5; E38 Stufe D] |
| 10 | `node scripts/check-namen.mjs --vor <ordner>` (für jede neue Methodenkarte aus Bauplan §9 dazu `--karte <id>`) meldet «BELEGT» (Exit 1): der Ordner gehört einer anderen Einheit, oder die Methodenkarte gibt es schon | Abbruchfall. Das Skript nennt auch den Laufordner (Abschnitt 8) und das Quellen-Muster; weicht dieses vom Bauplan ab und Bauplan §9 nennt es nicht als Ausnahme, gilt Zeile 7. Dasselbe Skript läuft im Tor mit (`check-all`, Zeile «Namen») [Rb §3 Nr. 8; ableitungsregeln.md §10] |

**Der Start-Riegel, genau** (Zeile 9). `docs/cloud-run/OFFEN.md` ist eine
Tabelle mit den Spalten `ID · Einheit oder Bereich · Art · Punkt · Fundstelle ·
wer · Stand · seit`. Ein Punkt sperrt den Start, wenn

1. `Art` genau `S` oder `P` ist (die Arten erklärt der Kopf der Liste),
2. `Stand` auf `^(offen|braucht Entscheid)\b` passt, und
3. `Punkt` die Zeichenfolge `[erzeugt Fehler]` enthält — mit den eckigen
   Klammern, Gross- und Kleinschreibung wie hier. «erzeugt Fehler» ohne
   Klammern im Fliesstext eines Punkts sperrt nicht.

Den Vermerk setzt, wer den Punkt in die Liste einträgt, wenn die Lücke in
jeder neuen Einheit denselben Fehler **erzeugt** (ein Skelett mit falschem
Festwert, eine Auftragsvorlage mit festem Lehrjahr, eine Regel, die einen
Widerspruch vorschreibt) — nicht bei einem Punkt, der nur stört. Entfernt wird
er nie; der Riegel fällt über die Spalte «Stand». `node scripts/offen.mjs`
(sobald vorhanden) prüft diese drei Bedingungen; bis dahin liest der
Orchestrator die Liste. Dazu läuft im Tor die Zeile «Skelette»
(`scripts/check-skelette.mjs`): Ein Fehler dort ist derselbe Fall, vom Skript
gefunden — nicht beginnen, melden. [Rb §5.4: «ein Lauf startet nicht mit
offenen S-Punkten, die Fehler erzeugen. Skelette laufen selbst durchs Tor»;
E38 Stufe D]

Der Bauplan gilt. Kein Entscheid wird geändert; die Phasen 0, 1 und Q laufen
nicht als Erzeugung — nichts wird hergeleitet, kein Bauplan geschrieben, keine
Quelle gesucht (`references/auto-modus.md` §3, §6). Was von Phase 0 bleibt, ist
Zeile 7: die Prüfung des Bauplans gegen Datensatz, Kapiteldateien (das
Lehrmittel muss lokal unter `material/_lehrmittel/` liegen) und
Ableitungsregeln nach `references/auto-modus.md` §7.
Trägt der Bauplan noch keinen Abschnitt «10. Fakten» (freigegeben vor dem
07.10.2026), ist das kein Abbruchfall: Geschrieben wird dann wie bisher nur aus
Lehrmittel, Datensatz und Archivtext (`SKILL.md` §5 Nr. 3), und das Fakten-Audit
in Phase 10 prüft jede Aussage. [E34; Rb §6 Nr. 5 — Probe an den wartenden
Bauplänen]

## 4. Reihenfolge

Die Reihenfolge ist eine Abhängigkeitsfolge. [P-loop §3: «prinzip.json und
kn.json → Heft A und Heft B → Set → Begleiter → Tor → Gegenleser → Korrekturen
→ Tor»; Phase 10: E32, E34; Audits nach dem ersten grünen Tor und zweiter
Durchgang des Tors: Auftrag 10, Stufe C; E38]

| # | Schritt | Wer | Reference |
|---|---|---|---|
| 1 | Vorprüfung | Orchestrator | Abschnitt 3 |
| 2 | `prinzip.json`, dann `kn.json`; prüfen. Verlangt Bauplan §9 eine neue Methodenkarte: jetzt anlegen, bevor ein Executor startet | Orchestrator | `phase-2-3-prinzip-kn.md`, `phase-4-heft-kern.md` §8 |
| 3 | `npm run build:einheiten-index` — einmal, damit die Executor exportieren können | Orchestrator | Abschnitt 6 |
| 4 | Heft A und Heft B — Phasen 4, 5, 6 je Heft, **mit eigener Messung vor der Abgabe**; jeder Executor gibt mit dem Heft `fall.<A\|B>.json` ab | Executor A ∥ Executor B | `phase-4-…`, `phase-5-…`, `phase-6-…`, Abschnitt 6, `belege.md` §6 |
| 5 | `set.json` (mit `fall.auftrag.json`), danach `begleiter.md` (der Executor Begleiter füllt am Schluss einmal die Marker) | Executor Set → Executor Begleiter | `phase-7-set.md`, `phase-8-begleiter.md` |
| 6 | **Tor, erster Durchgang:** Teildateien zusammenführen (`fall.json`), `check-all <ordner> --vor-audit`, Export und Messung aller Dokumente, dazu einmal `check-all` über die drei Bestandseinheiten. Grün heisst hier: letzte Zeile «VOR AUDIT — keine Fehler …», Exit 0 — `belege.json` und `fakten.json` stehen noch aus, sonst ist nichts offen. Höchstens drei Reparaturrunden — eine Runde umfasst `check-all` **und** Messung | Orchestrator | `phase-9-tor.md` §1–§2 |
| 7 | Gegenleser und Audits, **gleichzeitig**: je Heft und Spur ein/e Lernende/r, ein Bogen-Leser, ein Sweep · je Heft und Spur und für den Auftrag ein Lösungs-Audit · ein Fakten-Audit. Die Pakete baut der Orchestrator vorher | Gegenleser, Lösungs-Audit, Fakten-Audit | `gegenleser.md`, `audits.md` §2–§3 |
| 7a | Lösbarkeitsprobe, sobald das Produkt eines Lernenden-Gegenlesers vorliegt — je Produkt eine, gleichzeitig | Lösbarkeitsprobe | `audits.md` §4 |
| 8 | Teildateien zusammenführen. Jeden Befund am Dokument nachprüfen — die der Gegenleser, jedes Urteil der Audits, das nicht «stimmt» bzw. «belegt» heisst, jeden Befund der Probe → genaue Aufträge → Korrekturen → Marker-Skript neu → Tor neu → geänderte Seiten noch einmal lesen, **geänderte Lösungsfelder und Aussagen neu auditieren** (Abschnitt 4.1); höchstens drei Runden. Wer korrigiert: am Heft der Executor A bzw. B, an `set.json` und `begleiter.md` der Executor der Datei, an `prinzip.json`, `kn.json` und an einer in diesem Lauf neu angelegten Methodenkarte der Orchestrator | Orchestrator, Executor der Datei | `gegenleser.md` §2, §5; `audits.md` §2.4–§2.5, §3.3, §4.3 |
| 9 | **Phase 10, Schritte 1–6:** offene Befunde, Stand des Fakten-Audits, Zahlen, erneutes Lesen und erneutes Audit nach der letzten Änderung, **Tor, zweiter Durchgang** (`check-all <ordner>` **ohne** `--vor-audit`: GRUEN — mit Belegen, Fakten und Probe) und Messung, Gegenhör-Liste; für jeden Punkt mit Kürzel S oder R die Suche nach derselben Stelle (`phase-9-tor.md` §5) | Orchestrator, Audits, Gegenleser | `phase-10-abschluss.md` |
| 10 | Bericht im Laufordner, dazu `check-all.txt`, `messung.txt` und die fünf Protokolle `*-check.txt` | Orchestrator | `assets/bericht-template.md`, Abschnitt 8 |
| 11 | Leck-Prüfung über Bauplan und Bericht — **nach** dem Bericht, **vor** `git add`; ihr Ergebnis wird im Bericht nachgetragen —, dann gezieltes `git add`, `check-leck --staged`, **ein** Commit | Orchestrator | Abschnitt 8 |
| 12 | Schluss: Vorlage zur Freigabe | Orchestrator | Abschnitt 9 |
| 13 | **Phase 10, Schritt 8: Freigabe** — nur auf Pietros «ok» | Orchestrator | `phase-10-abschluss.md` §8 |

Die Audits lesen nur. Sie laufen neben den Gegenlesern von Schritt 7; ihre
Befunde werden mit denen der Gegenleser zusammen korrigiert, und gelesen wird
einmal nach allen Korrekturen. [P-1a Schritte 3–5; Auftrag 10, Stufe C]

### 4.1 Audit vor und nach einer Änderung

- **Kein Audit vor dem ersten grünen Tor.** Ein Audit an einem Heft, das noch
  gekürzt wird, ist nach der Kürzung veraltet. [`gegenleser.md` §2: «nach der
  letzten Reparatur- oder Kürzungsrunde»; Auftrag 10, Stufe C]
- **Jede Änderung einer Lösung macht ihre Belegzeile ungültig** — der Hash des
  Felds stimmt nicht mehr, `check-belege` meldet `ERR_AUDIT_VERALTET`, das Tor
  ist rot. Neu geprüft werden **nur diese Felder** (`node
  scripts/audit-paket.mjs <ordner> --heft <heft> --spur <spur> --nur-veraltet
  …`, `audits.md` §2.5), nicht das ganze Heft. [Rb §4 letzte Zeile: vier Läufe
  mit Lösungen, die nach dem Audit geändert und nie mehr geprüft wurden;
  Rb §5.3 Nr. 5]
- **Jede geänderte Aussage über die Welt** verwaist ihre Zeile in `fakten.json`
  (`ERR_FAKT_ZEILE_VERWAIST`, `ERR_FAKT_OHNE_ZEILE`): Das Fakten-Audit prüft
  nur diese (`audits.md` §3.5).
- **Die Lösbarkeitsprobe** läuft für ein Heft und eine Spur neu, wenn «Das
  geben Sie ab», ein Indikator, die Form des Lösungsbilds oder LF4 geändert
  wurde (`audits.md` §4.5).
- **Der Lauf geht erst weiter, wenn `check-belege` und `check-fakten` ohne
  Fehler enden.** Ein offener Befund der Probe (`ERR_PROBE_OFFEN`) hält ihn
  ebenso an, bis der Orchestrator ihn entschieden hat (`audits.md` §4.3).
  [Auftrag 10, Stufe C Nr. 1 c und Nr. 3]

Nach **jeder** Änderung an Heft, Set oder KN, die auf Phase 8 folgt, lässt der
**Orchestrator**
`node .claude/skills/bbw-hko-heft-v42/scripts/begleiter-marker.mjs <ordner>`
neu laufen und die Prosa des Begleiters an der geänderten Stelle
ansehen. [B `2026-10-04-221` §10, B `2026-10-04-331` §10, B `2026-10-05-241` §10]

## 5. Was gleichzeitig laufen darf — und was nur der Orchestrator tut

Gleichzeitig laufen dürfen Agenten, die **verschiedene Dateien** schreiben und
einander nicht brauchen [P-loop §3, Pietro 04.10.2026]:

- Executor A und Executor B. B bekommt Fall, Lebensbereich, Produkt und
  Begriffe von A **aus dem Bauplan**, nicht aus der fertigen Datei; gleiche
  Glossarbegriffe gleicht der Executor Set ab.
- alle Gegenleser, alle Lösungs-Audits und das Fakten-Audit: Sie lesen nur,
  jede Rolle ihr Paket, und jede schreibt **ihre eigene Teildatei** — nie zwei
  Agenten dieselbe Datei (`audits.md` §1.4).
- die Lösbarkeitsproben untereinander — jede erst, wenn ihr Produkt vorliegt.
- die Korrekturrunden an Heft A und Heft B.

Nacheinander bleiben: Set (braucht beide Hefte), Begleiter (braucht alle fünf
Dateien).

**Nur der Orchestrator:** `npm run build:einheiten-index`, das Marker-Skript
bei jedem Lauf nach Phase 8 (nach Korrekturen und im Tor — nur das eine Mal am
Ende von Phase 8 führt es der Executor Begleiter an seiner eigenen Datei aus),
das Anlegen einer neuen Methodenkarte, das Bauen der Audit-Pakete
(`audit-paket.mjs`), das massgebende Zusammenführen der Teildateien im Tor,
der Stand eines Befunds in `probe.json`, `check-all`, `bestand-v42`,
`npm run build`, `git add`, `git commit`, der Bericht. Nie zwei Tore gleichzeitig im selben Arbeitsbaum. [P-einzel «Index und
Build laufen nur bei dir»; P-loop §3]

**Nie:** zwei Einheiten gleichzeitig in einer Session; eine zweite Session im
selben Arbeitsbaum; `git worktree` (das Lehrmittel ist gitignored und fehlt
dort); `npm ci`; Branchwechsel. [P-einzel, P-loop; Rb §5.5]

Bricht ein Executor ohne Fortschritt ab (in den Läufen nach rund zehn Minuten,
meist beim Kürzen von Seite 6): mit kleinen, einzelnen Änderungsaufträgen
fortsetzen. Ein gemeinsamer Scratchpad wird je Lauf in einem eigenen
Unterordner geführt; Hilfsskripte früherer Läufe werden nicht ausgeführt.
[B `2026-10-04-421` §10, B `2026-10-05-241` §10]

## 6. Messung in der Schreibphase

`check-v42` prüft Zeichen, nicht Pixel. In 11 von 13 Läufen lief eine Seite
über, obwohl jedes Budget eingehalten war — bis 178 px, in einem Lauf 458 px.
Gefunden wurde es erst im Tor, also nach dem Schreiben. Darum misst, wer
schreibt. [Rb §4 Zeile 1, §5.2 Zeile 1; B `2026-10-04-331` §10,
B `2026-10-06-4.3.1_vielfalt_untersuchen` §10]

**Executor A und B, vor der Abgabe ihres Hefts** (nach Phase 6 und nach jeder
späteren Korrektur):

```
node scripts/export-v42.mjs <ordner> --out <eigener-temp-ordner>
node scripts/messen-v42.mjs <eigener-temp-ordner>
```

- **Eigener Temp-Ordner** je Executor — nie der des anderen, nie ein Ordner im
  Repo. [P-loop §3]
- Es zählen die Seiten des **eigenen** Hefts in jeder vorhandenen Spur
  (`heft-<a|b>-<spur>.html`) und des eigenen Dokuments «Lösungen»
  (`loesungen-<a|b>-<spur>.html`). Im Dokument «Lösungen» steht LF3 auf S. 2,
  LF4 und die Vertiefungen auf S. 3 — ein Überlauf auf «Lösungen S. 3» wird an
  `erwartungshorizont` bzw. `erwartung` behoben, nicht an LF3.
  [B `2026-10-03-221` §13 Nr. 1]
- **Seite 8 des Hefts und der Auftragsbogen zählen noch nicht:** Ohne
  `set.json` zeichnet der Renderer S. 8 ohne Glossar. Beides misst der
  Orchestrator im Tor. [B `2026-10-05-241` §10]
- Ein Überlauf wird **im Feld der gemeldeten Seite** behoben, auch wenn das
  Zeichenbudget eingehalten ist (`phase-9-tor.md` §1). Seit E38 (Stufe B)
  führt `check-v42` gemessene Budgets für `erwartung` der Vertiefungen, die
  Lösungsseiten 3 und 4, die Kartentexte auf S. 6, die Stufentexte und die
  Zahlentabelle des Auftrags; sie sind eine notwendige Grenze, keine
  hinreichende. Kein Budget kennt das Skript für `loesungsbild.hinweis` und
  für Tabellenzellen ausser der ersten Spalte — dort, und überall im Zweifel,
  entscheidet die Messung. [Rb §4; B `2026-10-03-221` §13 Nr. 2,
  B `2026-10-04-421` §10; E38 Stufe B]
- Hingenommen ist ein Überlauf bis 2 px auf Seite 6; er wird nur gemeldet.
  [E28 Nr. 2, P-einzel]
- Meldet ein Skript kurz einen JSON-Fehler in der Datei des **anderen**
  Executors, läuft es nochmals. [P-loop §3]
- Der Executor gibt mit seinem Heft ab: die letzte Zeile je gemessenem
  Dokument und die knappste Seite. Der Orchestrator trägt sie in den Bericht.

**Voraussetzung.** `export-v42` bricht mit «nicht im Index» ab, solange der
Ordner nicht im Index steht. Den Index baut nur der Orchestrator (Schritt 3 —
der Index-Builder liest einen Ordner auch, wenn erst `prinzip.json` und
`kn.json` darin liegen; dieser Zwischenstand des Index wird nie committet, das
Tor baut ihn neu). Meldet der Export trotzdem «nicht im Index» oder
findet `messen-v42` keinen Browser (Exit 2), gibt der Executor **ohne**
Messung ab und sagt das ausdrücklich; der Orchestrator misst dann sofort nach
der Abgabe, noch vor Set und Begleiter. [B `2026-10-04-321` §10]

`node scripts/lauf.mjs <ordner>` (sobald vorhanden) fasst Tor, Export und
Messung in einem Befehl und schreibt die Ausgaben in den Laufordner. Handweg
bis dahin: die Befehle aus `phase-9-tor.md` §1, Ausgaben von Hand nach
`check-all.txt` und `messung.txt`. [Rb §5.5]

## 7. Abbruchfälle

Ein Lauf bricht ab, wenn: die Freigabe fehlt · Bauplan §9 eine Blockade nennt ·
der Bauplan den Ableitungsregeln nicht entspricht · eine Kapiteldatei fehlt ·
die Quelle fehlt und die Spur ohne Medien für das Heft unzulässig ist · das Tor
nach drei Reparaturrunden rot ist (`references/auto-modus.md` §5, §8).
[P-loop §3, E23]

Dann, in dieser Reihenfolge [P-loop §3]:

1. Bericht nach `docs/cloud-run/laeufe/<datum>-<ordnername>[-<k>]/BERICHT.md` mit der
   Zeile «nicht erzeugbar: <Grund>» und der letzten Tor-Ausgabe.
2. **Verschieben, nicht löschen:** den halbfertigen Ordner
   `src/data/einheiten/<ordner>/` und die Karten, die **dieser Lauf neu
   angelegt** hat, nach `docs/cloud-run/laeufe/<datum>-<ordnername>[-<k>]/abgebrochen/`.
   Karten aus Phase Q und alle bestehenden Karten bleiben, wo sie sind.
3. `npm run build:einheiten-index`, damit der Index wieder stimmt.
4. **Kein Commit der Einheit.** Bericht und `abgebrochen/` bleiben im
   Arbeitsbaum; die Schlussmeldung nennt sie.
5. Schleife: Durchgang beenden — der nächste nimmt den nächsten Bauplan.

Eine halbe Einheit bleibt nie unter `src/data/einheiten/` liegen.

**Kein Abbruchfall** ist ein Ordner, der schon ohne Commit unter
`src/data/einheiten/` liegt (Abschnitt 3 Zeile 5): nicht anfassen, melden,
weiter nur über den Start «Abschluss» — kein Bericht «nicht erzeugbar», kein
Verschieben, keine Dauersperre. «Nicht erzeugbar» wegen des Ordnernamens gibt
es nur nach der Ableitungsregel: Der Name gehört einer **anderen** Einheit und
kein verlängerter slug ist frei (`references/ableitungsregeln.md` §1.4). [E34]

Sagt ein älterer Bauplan für den Abbruch «der Lauf entfernt die Karte» oder
«Ordner löschen», gilt die Skill: verschieben nach `abgebrochen/`. [E34]

## 8. Laufordner, Bericht, Commit

**Laufordner:** `docs/cloud-run/laeufe/<JJJJ-MM-TT>-<ordnername>[-<k>]/` — der
volle Ordnername, nicht nur die Nummer (zwei Einheiten `2.2.1_…` unterscheiden
sich sonst nur durchs Datum); ein weiterer Lauf am selben Tag bekommt `-2`, `-3`
(`<k>`, das nächste freie). Den Namen liefert
`node scripts/check-namen.mjs --vor <ordner>`; ein vorhandener Laufordner wird
nie beschrieben. Bestehende Laufordner werden nicht umbenannt;
`docs/cloud-run/laeufe/INDEX.md` ordnet die der alten Form (`<datum>-<Ziffern>`)
ihren Einheiten zu. Regel und Prüfung: `references/ableitungsregeln.md` §10.
[Rb §3 Nr. 8; Form der Läufe vom 06.10.2026; ENTSCHEIDE E35]

| Datei | Inhalt |
|---|---|
| `BERICHT.md` | nach `assets/bericht-template.md` — **ein** Bericht je Lauf; Phase 10 und spätere Entscheide schreiben darin weiter, eine Datei `NACHTRAG.md` gibt es nicht mehr [E34; Form der Läufe vom 06.10.2026] |
| `check-all.txt`, `messung.txt` | die vollständigen Ausgaben nach der letzten Änderung [P-1a Schritt 7] |
| `belege-check.txt`, `fakten-check.txt`, `zeiger-check.txt`, `zahlen-check.txt`, `kohaerenz-check.txt` | die Protokolle der fünf Beleg-Prüfungen nach der letzten Änderung, geschrieben mit `--protokoll` — Feld, Code, Fundstelle, **nie ein Anker** (`phase-9-tor.md` §1) [Rb §5.1; E38] |
| `abgebrochen/` | nur im Abbruchfall (Abschnitt 7) |

Eine Datei `fakten-tabelle.md` gibt es nicht mehr: Was das Fakten-Audit fand,
steht in `fakten.json` im Archiv; der Bericht nennt die Zahlen je Urteil und
jede Zeile, die nicht «belegt» heisst (`phase-10-abschluss.md` §2). [E38,
Stufe C]

Beleg-Dateien mit Wortlaut der Quellen (`belege.json`, `fakten.json`, dazu
`fall.json`, `probe.json`, `herkunft.json`) liegen **nie** im Laufordner,
sondern ausserhalb des Repos im Quellenarchiv unter `_pruefung/<ordnername>/`.
Ort, Form jeder Datei, die Urteile und was «stelle» je Archivform heisst:
`references/belege.md`. [Rb §5.1; Entscheid Pietro 07.10.2026; E38]

**Commit — einer je Einheit, erst nach grünem Tor und nach Phase 10 Schritt 6:**
«Einheit `<ordner>` (bbw-hko-heft-v42)». Er enthält [P-loop §4, P-1a Schritt 8]:

- `src/data/einheiten/<ordner>/` (sechs Dateien)
- die Quellenkarten dieser Einheit unter `src/data/quellen/`, und eine neue
  Methodenkarte, falls der Bauplan §9 sie verlangt hat
- **den Bauplan** `docs/cloud-run/bauplaene/<ordner>.md` — sonst ist die
  Einheit versioniert und ihr Bauplan liegt lose im Arbeitsbaum (so geschehen
  bei 13 Bauplänen bis 07.10.2026) [Rb §3 Nr. 2]
- den Laufordner
- die zwei Index-Dateien `src/data/einheiten.index.json` und
  `public/nrlp/einheiten.index.json`

Vorher, in dieser Reihenfolge [P-loop §4; `phase-9-tor.md` §1]:

```
node scripts/check-leck.mjs docs/cloud-run/bauplaene/<ordner>.md docs/cloud-run/laeufe/<datum>-<ordnername>[-<k>]
git add <jeden Pfad einzeln>
node scripts/check-leck.mjs --staged
```

Kein Fehler, keine Warnung. Ein Treffer wird an der gemeldeten Stelle
umformuliert (eigene Worte plus Kapitel und Seite bzw. Karten-ID) — im Bauplan
nur diese Stelle, sonst bleibt er, wie er freigegeben ist. Exit 2 (Lehrmittel
oder Archiv fehlt): nicht geprüft, nicht committen.

Der Bericht liegt im selben Commit und kann dessen Hash nicht tragen: Er nennt
den **Titel** des Commits; den Hash nennt die Schlussmeldung. Beim späteren
Freigabe-Commit wird der Hash des Einheit-Commits im Bericht nachgetragen.
[E34]

Nie `git add -A` und nie `git add .`: Im Arbeitsbaum können fremde Dateien
liegen. `status` bleibt `"entwurf"`. Kein Push.

`node scripts/offen.mjs` (sobald vorhanden) meldet, ob die offenen Punkte des
Berichts in `docs/cloud-run/OFFEN.md` stehen. Handweg bis dahin: Der Abschnitt
«Offen» des Berichts ist die Liste. [Rb §3 Nr. 6]

## 9. Schluss des Laufs

| | Einzelstart, Abschluss | Schleife |
|---|---|---|
| Dev-Server | starten (`npm run dev`) und zwei Adressen nennen: Arbeitsansicht `/einheiten/<ordner>` und QR-Seite `/m/<ordner>` [P-einzel] | **nicht** starten — er stört den nächsten Durchgang; nur den Ordnernamen nennen [P-loop §3] |
| Letzte Nachricht | die Vorlage zur Freigabe (`phase-10-abschluss.md` §7): grün oder nicht · Gegenhör-Liste · offene Punkte, zuerst die mit Entscheid · nicht belegbare Fakten · freigabereif nach dem Gegenhören: ja oder nein · Hash des Commits — dann **warten** auf Pietros «ok» [P-1a «EINZIGER STOPP»] | eine kurze Nachricht: Ordner · grün oder nicht erzeugbar · was gegengehört werden muss · freigabereif nach dem Gegenhören: ja oder nein · Hash des Commits · wie viele Baupläne noch warten. Die ganze Vorlage steht im Bericht (Abschnitt 11); **nicht warten**, nächster Durchgang [P-loop §4] |
| Freigabe | nach dem «ok»: `phase-10-abschluss.md` §8 | nie in der Schleife — später über den Start «Abschluss» oder durch Pietro |

## 10. Was in jedem Lauf gilt

- Kein Push, kein Deploy, kein Merge, kein Branchwechsel — ausser Pietro
  verlangt es beim Freigabeschritt ausdrücklich. [P-einzel, P-loop, P-1a]
- Nicht anfassen: den Bauplan (auch die Freigabe-Zeile) — ausser um eine
  Stelle umzuformulieren, die die Leck-Prüfung meldet (Abschnitt 8) —, die
  Skill (ein Erzeugungslauf meldet Regel-Lücken mit Kürzel S im Bericht; die
  Pflicht aus `SKILL.md` §1, einen Entscheid einzuarbeiten, trifft die
  Session, die ihn fällt, nicht den Lauf),
  `scripts/`, `src/lib`, `src/components`, `src/styles`, `src/pages`,
  bestehende Einheiten, bestehende Karten (was «bestehend» heisst: nächster
  Punkt). Fehler dort
  gehören in den Bericht, Abschnitt «Offen», mit Kürzel S, R oder Q.
  [P-einzel, P-loop; `SKILL.md` §5 Nr. 12]
- **Karten — eigene und bestehende.** *Eigen* ist eine Quellenkarte, die nur
  diese noch nicht publizierte Einheit führt (aus ihrer Phase Q). An ihr
  korrigierbar sind Zeitmarken, Wortzahl bzw. Dauer, Prüfdatum und
  `kurzbeschrieb` — nie Titel, URL oder URN, nie der Ausschnitt: Eine andere
  Quelle ist eine neue Karte, und die wählt der Lauf nicht. Eine Methodenkarte,
  die der Orchestrator in diesem Lauf neu angelegt hat, darf er bis zum Commit
  der Einheit korrigieren (sie hat keinen anderen Verbraucher); danach ist sie
  bestehend. *Bestehend* sind
  alle anderen Karten: jede Methodenkarte und jede Quellenkarte, die eine
  andere Einheit führt. Sie werden nicht angefasst. [Rb §3 Nr. 4–5; E31 Nr. 3;
  Entscheid Orchestrator nach dem Trockenlauf, E34]
  Passt eine Methodenkarte nicht zur Abgabe, überschreibt die
  Einheit (`fuer`, ausnahmsweise `beispiel`); `tun` wird bei `hko-`Karten nicht
  gedruckt. Ein **Fehler** in einer bestehenden Karte (falsche Seite, Aussage
  steht nicht auf der Seite, Rechenfehler, Widerspruch in sich) gehört in den
  Bericht, Abschnitt «Offen», Kürzel S — die Karte hängt an publizierten
  Heften. [E31 Nr. 2–3; Rb §3 Nr. 4, §5.4]
  **Die Regel dazu steht in `references/karten.md`** (Fälle a bis e): Die
  eigene Karte ist dort Fall a, der Fehler Fall b, die Passung Fall c, die
  Quellenkarte Fall d. Vor jeder Kartenänderung läuft
  `node scripts/karten.mjs darf <karten-id>` (Exit 0 = erlaubt, 1 = gebunden);
  Entscheid und Fall stehen im Bericht, Abschnitt 7. **Der Lauf ändert keine
  bestehende Karte** — auch dann nicht, wenn `darf` Fall b nennt: Die
  Korrektur mit Vermerk misst jeden Verbraucher neu und ist eine eigene
  Session. Das Tor meldet eine berührte Karte in der Zeile «Karten»
  (`karten.mjs geaendert`, Vergleich mit `origin/main`); neue Karten sind kein
  Befund. [E36]
- Keine Rückfrage an Pietro ausser an den zwei Stopps (Bauplan, Freigabe).
  Fehlt eine Voraussetzung: `references/auto-modus.md`. [P-einzel, P-loop]
- Keine Quellensuche, kein Swissdox, keine Zugangsdaten. Das Fakten-Audit ist
  keine Quellensuche: Es liest frei zugängliche amtliche Seiten und wählt keine
  neue Quelle für ein Heft. [P-loop «Was in jedem Durchgang gilt»; P-1a Schritt 4]
- **Rückweg.** Stammt ein Fehler aus einer Regel der Skill, einem Skelett,
  einer Karte oder dem Renderer (Kürzel S oder R; in `OFFEN.md` die Arten S, K,
  R), läuft `node scripts/gleiche-stelle.mjs "<feldpfad>" "<muster>" --ohne
  <ordner>`, **bevor der Lauf endet**; die Trefferzahl je Einheit steht im
  Bericht (Abschnitt 10) und in `docs/cloud-run/OFFEN.md` (sobald vorhanden).
  Geändert wird dort nichts. Regel und Form: `phase-9-tor.md` §5. [Rb §5.4
  «Rückweg»; Auftrag 10, Stufe D Nr. 4; E38 Stufe D]
- **Abgeleitete Einheit.** Entsteht eine Einheit aus einer anderen
  (Anpassung), legt der Orchestrator **vor dem ersten Schreiben**
  `herkunft.json` im Quellenarchiv an (`belege.md` §8) — `set.json` bekommt
  dafür kein Feld. Die Abgeleitete ist eine neue Einheit: volle Audits, kein
  Beleg und keine Faktenzeile wird aus der Vorlage übernommen; `check-belege`
  und `check-fakten` erkennen eine übernommene Zeile und melden, wenn die
  Vorlage später korrigiert wurde. [Rb §5.4 «Einheit aus Einheit»; Auftrag
  10, Stufe D Nr. 1; E38 Stufe D]

## 11. Skripte, die es noch nicht gibt

Die Skill nennt sie mit «sobald vorhanden». Fehlt die Datei unter `scripts/`,
gilt der Handweg — das Fehlen ist kein Abbruchfall und kein Befund.

| Skript | Wofür | Handweg bis dahin | Herkunft |
|---|---|---|---|
| `scripts/lauf.mjs` | Tor, Export, Messung in einem Befehl; Logs und Kopf in den Laufordner | Befehle aus `phase-9-tor.md` §1 einzeln | Rb §5.5 |
| `scripts/offen.mjs` | gleicht den Abschnitt «Offen» der Berichte mit `docs/cloud-run/OFFEN.md` ab | der Abschnitt «Offen» des Berichts | Rb §3 Nr. 6 |

Vorhanden seit 07.10.2026: `scripts/check-namen.mjs` (E35) und
`scripts/karten.mjs` (E36 — Verbraucher einer Karte, ändern oder neu,
`references/karten.md`); beide laufen im Tor mit. Ebenfalls vorhanden (E38):
Ort und Form der Beleg-Dateien (`references/belege.md`, Schemas unter
`scripts/schema/`) und die zwei Bibliotheken, auf denen die Prüfskripte
aufbauen — `scripts/lib/loesungsfelder.mjs` (welche Felder Lösungsfelder sind,
Hash; `node scripts/lib/loesungsfelder.mjs <ordner>` zählt sie) und
`scripts/lib/archiv.mjs` (Archivtext zerlegen, Anker suchen;
`node scripts/lib/archiv.mjs --formen` zeigt je Karte Form und Stufe der
Zeitmarken-Prüfung). Sie prüfen selbst nichts und laufen nicht im Tor.

Vorhanden seit E38, Stufe B: `scripts/check-belege.mjs`, `check-fakten.mjs`,
`check-zeiger.mjs`, `check-zahlen.mjs`, `check-kohaerenz.mjs` — alle fünf im
Tor (`phase-9-tor.md` §1, `belege.md` §11) — und `scripts/check-links.mjs`
(mit Netz, nicht im Tor: `node scripts/check-links.mjs --alle`, wöchentlich von
Hand). Seit Stufe C: `scripts/audit-paket.mjs` (Pakete der Audits, Teildateien
zusammenführen — `audits.md`) und `scripts/gegenhoeren.mjs` (Gegenhör-Liste —
`phase-10-abschluss.md` §6). Seit Stufe D: `scripts/check-skelette.mjs` (im
Tor, Zeile «Skelette» — die Vorlagen der Skill verletzen selbst keine Regel),
`scripts/gleiche-stelle.mjs` (Rückweg, `phase-9-tor.md` §5 — nicht im Tor),
`node scripts/karten.mjs belege [<id>]` (Kartenbelege, `karten.md` §5) und der
Schalter `--vor-audit` von `check-all`, `check-belege` und `check-fakten`
(erster Durchgang des Tors).
