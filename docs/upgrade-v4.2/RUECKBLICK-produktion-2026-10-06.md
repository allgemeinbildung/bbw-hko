# Rückblick — Produktion der v4.2-Einheiten, 02.–05.10.2026

Stand 06.10.2026 · Branch `v42-skill` (`3a06c6f`) · reine Analyse, nichts an Skill,
Skripten oder Einheiten geändert.

**Grundlage.** Selbst gelesen: `SKILL.md`, `references/phase-9-tor.md`,
`references/gegenleser.md`, `scripts/check-all.mjs`, die Lauf-Prompts,
`ENTSCHEIDE.md` E28–E32, `BERICHT-skill.md`, `REVIEW-lernende-t2.md` §8,
`docs/pipeline-review-2026-10-01.md`, Git-Verlauf und Arbeitsbaum. Von zwei
Subagenten ausgewertet und von mir **nicht einzeln gegengelesen**: die 14 Ordner
unter `docs/cloud-run/laeufe/` und die Diffs der Korrektur-Commits vom 05.10.
(sechs von zehn Abschlussrunden und alle Methodenkarten-Commits am Diff, der Rest
nach Commit-Text). Zahlen aus diesen zwei Auswertungen sind Grössenordnungen.

---

## 1. Was tatsächlich gelaufen ist (Ist-Ablauf)

| # | Schritt | Wer | Ergebnis | Wo beschrieben |
|---|---|---|---|---|
| 1 | Kompetenz und Lehrgang wählen | Pietro | Zeile der Warteschlange | `abdeckung.md` (veraltet), Reihenfolge im Loop-Prompt |
| 2 | Phase 0, 1, Q: Verortung, Bauplan, Quellen (lokal, Swissdox/SRG) | Skill, lokal | `bauplaene/<ordner>.md`, Karten `q-…`, Volltexte im Archiv | Skill Phasen 0/1/Q |
| 3 | **Stopp: Freigabe des Bauplans** | Pietro | Zeile «Freigabe: freigegeben am …» | Skill §3 |
| 4 | Erzeugung im Auto-Modus: Prinzip + KN (Orchestrator), Heft A ∥ Heft B, Set, Begleiter | Opus-Orchestrator, Opus-Executor | sechs Dateien | `prompts/einheit-aus-bauplan-lokal.md` |
| 5 | Tor: Index, Marker, `check-all`, Export, Messung, Bestand, Build | Orchestrator | grün | `phase-9-tor.md` |
| 6 | Gegenleser (Sonnet): Lernende Profil a, Lösungs-Audits, Bogen, Sweep — bis drei Runden | Subagenten | Befunde → Korrekturen → Tor | `gegenleser.md` |
| 7 | Bericht + ein Commit je Einheit | Orchestrator | `laeufe/<datum>-<nr>/BERICHT.md` | Loop-Prompt §4 |
| 8 | Schleife über alle freigegebenen Baupläne | `/loop` | 11 Einheiten in rund 27 Stunden | `prompts/alle-bauplaene-seriell.md` |
| 9 | **Abschlussrunde** je Einheit: Befunde der Berichte, Fakten an amtlichen Quellen, Gegenleser, Tor | eigene Sessions, 05.10. | `NACHTRAG.md`, Korrektur-Commits | nur E32 und die zwei `abschluss-*.md` |
| 10 | Gegenhören Audio/Video | Pietro | — | E32 |
| 11 | Freigabe: `status` → `publiziert`, Index, Merge nach `main`, Deploy | Pietro / Session | 14 Einheiten live | E32 |

Zwei Dinge weichen vom geplanten Ablauf ab und stehen in keinem Dokument als
Ablauf: Der **Cloud-Weg** (privater Spiegel, `cloud-*.mjs`, `RUN.md`, `START.md`)
wurde für zwei Proben benutzt und dann durch den lokalen Loop ersetzt. Und die
**Abschlussrunde** (Schritt 9) ist nachträglich als eigener Durchgang entstanden;
sie hat den grössten Teil der inhaltlichen Fehler gefunden.

## 2. Was gut funktioniert hat

- **Ein Stopp statt sieben.** Der Bauplan bündelt alle Entscheide; danach lief
  jede Einheit ohne Rückfrage bis zum grünen Tor.
- **`check-all` war in jedem Lauf beim ersten Mal grün.** Struktur, Budgets,
  KN-Wortlaut, Leck-Prüfung, Umlaute sind kein Thema mehr (die Sweeps fanden
  nichts).
- **Regelkreis Review → Skill.** Der Lernenden-Review der zwei Proben hat sechs
  Regeln und einen Skript-Check (`ERR_V42_AUFTRAG_SPALTEN`) erzeugt, bevor die
  Serie lief.
- **Keine Einheit «nicht erzeugbar»**, keine halbe Einheit committet.

## 3. Was sofort Aufmerksamkeit braucht

1. **Zwei Einheiten liegen seit 05.10. unfertig und uncommittet im Arbeitsbaum.**
   `4.3.1_vielfalt_untersuchen` hat keinen Begleiter (`check-all` rot:
   `ERR_DATEI_FEHLT`), `5.2.1_gesetze_veraendern` ist im Tor grün, hat aber weder
   Bericht noch belegtes Gegenlesen. Der Loop-Prompt überspringt beide für immer
   («Ordner existiert ohne Commit → nicht anfassen»). Dazu warten fünf
   freigegebene Baupläne mit fertigen Karten: 5.1.1, 5.3.1, 6.1.1, 6.2.1, 6.3.1.
2. **15 von 20 Bauplänen sind nicht versioniert**, obwohl ihre Einheiten live
   sind — ebenso fünf Prompts, `ORCHESTRATION*.md` und der Pipeline-Review. Der
   Loop-Prompt nennt den Bauplan in der Commit-Liste nicht (§4), `phase-9-tor.md`
   erlaubt ihn. Vor dem Committen: Die Leck-Prüfung liest heute nur
   `src/data/einheiten/`, nicht `docs/` — Baupläne zuerst gegen Lehrmittel und
   Archiv prüfen.
3. **Die Skill widerspricht den geltenden Entscheiden.** E30 hat die sechs
   gesperrten Wörter aufgehoben; `SKILL.md` §6 und rund 15 Stellen in den
   References führen sie weiter (E30 sagt selbst «noch nicht nachgeführt»).
   Die Prompts verweisen auf «E20–E29»; es gibt E30–E32. Heute gilt eine
   Dreifach-Schichtung: Skill ← Einzel-Prompt ← Loop-Prompt («diese Abweichungen
   gehen vor»). Ein Lauf ohne den Loop-Prompt arbeitet nach altem Stand.
4. **Geteilte Karten sind jetzt Produktionsdaten.** `lm-17-3-3b-schema` hängt
   an 18 Einheiten, `hko-quelle-raster` an 16. Die 17 Kartenkorrekturen vom
   05.10. waren nur zulässig, weil die Einheiten noch Entwurf waren. Ab jetzt
   ändert jede Kartenkorrektur publizierte Hefte, und kein Check nennt die
   Verbraucher einer Karte. Gleiches bei Quellenkarten: `3.1.1` benutzt die
   Karten `q-131*` der Gold-Einheit.
5. **`q-221a-pflicht` und `-ersatz` tragen vertauschte Inhalte** (`e400163`):
   IDs blieben, `archiv_ref` zeigt über Kreuz, die Zeitmarken sind «neu
   gerechnet, nicht gehört». `archiv_ref` prüft kein Skript.
6. **Offene Punkte je Einheit liegen verstreut** in 11 Nachträgen («offen»,
   «Entscheide», Gegenhör-Listen). Es gibt keine Sammelliste; was E32 als
   erledigt nennt und was die Nachträge noch offen führen, ist nicht abgeglichen.
7. **«Archiviert» gibt es technisch nicht** (E31 Punkt 4): Die alte 1.3.1 steht
   auf `entwurf`, und KT1 sieht sie zwischen echten Entwürfen.
8. **Namens-Kollisionen.** Laufordner heissen `<datum>-<nummer>`: zwei
   Einheiten 2.2.1 unterscheiden sich nur durchs Datum. Für Quellen-IDs gibt
   es eine Regel (`ableitungsregeln.md`: `q-<n>.<k><h>-…` für die zweite
   Einheit, so bei `q-221.2a-…` angewendet), aber kein Skript prüft sie.
   *(Korrigiert am 06.10.: Die erste Fassung nannte das Muster zu Unrecht
   «ad hoc».)*
9. **Kleines:** `abdeckung.md` steht auf 02.10. («5 von 50»); `CLAUDE.md`
   beschreibt das Publizieren noch als «Flag entfernen»; die zwei Index-Dateien
   erscheinen nur wegen Zeilenenden als geändert (`.gitattributes` fehlt).

## 4. Wo die Fehler durchgingen

Das Tor prüft Form. Was nach grünem Tor korrigiert wurde, war fast nur Inhalt:

| Fehlerart | Umfang (Stichprobe) | Gefunden durch | Skriptbar? |
|---|---|---|---|
| Seitenüberlauf bei grünem `check-all` | 11 von 13 Läufen, bis 178 px | `messen-v42` nach dem Schreiben | **ja** — Messung in die Schreibphase; Budgets für `erwartung`, Kartentexte, Stufentexte fehlen |
| Rechts- und Sachaussagen falsch oder überzogen (OR 40e, SVG 58, Fedlex-Stand, Prämiengrenze) | rund 35–40 Stellen, mind. 9 Einheiten | erst Abschlussrunde, an Primärquellen | teilweise — Fakten-Liste je Einheit, siehe §5.2 |
| Widerspruch zwischen Seiten (Situation ↔ Beispiel S. 6 ↔ Lösung ↔ Checkliste ↔ Begleiter) | rund 40, alle Einheiten | Gegenleser | teilweise (gleiche Bezeichner, Zahlen, Wochentage) |
| Falscher Zeiger: Zeitmarke, Absatz, Seite, URL, Wortzahl | rund 25, 5 Einheiten + 3 Karten | Lösungs-Audit, Abschlussrunde | **ja** |
| Aufgabe nicht lösbar, keine echte Wahl, unklar wohin | rund 30 | Gegenleser | nein (nur: jeder Hinweis nennt eine Seite) |
| Ableitung steht als Quellenaussage da | rund 15 | Lösungs-Audit | nein |
| Rechenfehler, Zahlen uneinheitlich | rund 12 | Abschlussrunde | **ja** |
| Methodenkarte widerspricht dem Heft | 17 Kartenänderungen | Gegenleser | teilweise |
| Quellenkarte verrät die Lösung (`kurzbeschrieb`) | rund 11 Karten | Abschlussrunde | teilweise (Wortüberlappung) |
| Lösungen nach dem Audit geändert, nicht neu geprüft | 4 Läufe | Abschlussrunde | **ja** (Zeitstempel/Hash je Audit) |

Drei Folgerungen:

- **Die Gegenleser finden Bearbeitbarkeit, nicht Wahrheit.** Sachfehler fand
  erst der Abgleich mit Gesetz und Amt. Dieser Abgleich fehlt in der Skill.
- **Lösungs-Audits arbeiteten mit zu grobem Material** (Untertitelblöcke von
  rund 20 Sekunden) — daher die Zeitmarken-Fehler von 8–25 Sekunden.
- **Vererbung:** `3.1.1` hat Fehler der Gold-Einheit übernommen; ein Fehler in
  einer Vorlage oder Karte vervielfacht sich.

**Prompts zu den Punkten 1–9:** `docs/cloud-run/prompts/sofort/` (1a, 1b, 2–8;
Punkt 9 steckt in Prompt 2).

## 5. Vorschläge, nach Wirkung geordnet (Fassung 2, nach Rückmeldung Pietro 06.10.)

Vorgaben: Was skriptbar ist, läuft als Skript im Tor. Was nicht skriptbar ist,
bekommt eine feste Rolle in der Skill mit einem prüfbaren Ergebnis. Das
Lösungs-Audit wird besser. Kein Fehler wird vererbt.

### 5.1 Der Hebel: Belege als Daten

Die meisten «nicht skriptbaren» Fehler werden skriptbar, sobald die prüfende
Rolle ihr Ergebnis nicht als Prosa, sondern als **Beleg-Datei** abgibt. Zwei
Dateien je Einheit, beide **ausserhalb des Repos** im Archiv
(`quellen-archiv/bbw-hko/_pruefung/<ordner>/`), weil sie Wortlaut der Quellen
enthalten:

- `belege.json` — je Lösungsfeld: Herkunft (`quelle` · `lehrmittel` ·
  `fallueberlegung`), bei Quelle/Lehrmittel ein **wörtlicher Anker** von 5–12
  Wörtern, Karten-ID bzw. Kapitel, Zeitmarke oder Seite, dazu der Hash des
  geprüften Lösungstexts.
- `fakten.json` — je Rechts- oder Sachaussage: Wortlaut im Heft, Datei/Feld,
  Primärquelle (URL), Abrufdatum, Urteil.

Ein Skript prüft dann mechanisch: Der Anker steht im Archivtext bzw. in der
Kapiteldatei; die Zeitmarke des Ankers (aus dem VTT gerechnet) liegt im
genannten Bereich; der Hash stimmt noch — sonst ist das Audit veraltet; jedes
Lösungsfeld hat eine Zeile; jede Artikelnummer, jedes «Stand …», jede Zahl über
die Welt im Heft hat eine Zeile in `fakten.json`. Im Repo liegt nur das
Ergebnis (`laeufe/…/belege-check.txt`).

### 5.2 Fehlerart → Lösung

| Fehlerart | Lösung | Form |
|---|---|---|
| Seitenüberlauf | Executor messen selbst vor der Abgabe; fehlende Budgets (`erwartung`, Kartentexte, Stufentexte) in `check-v42` | Skript + Skill |
| Falscher Zeiger (Zeitmarke, Absatz, Seite, Wortzahl, `archiv_ref`) | `check-zeiger.mjs` im Tor; Zeitmarken aus Ankern gerechnet statt geschätzt | Skript |
| URL tot oder umgeleitet | `check-links.mjs`, zeitgesteuert, auch nach der Freigabe | Skript |
| Rechenfehler, Zahlen uneinheitlich | `check-zahlen.mjs`: Rechnungen nachrechnen; Fallzahlen der Situation als Menge, jedes Vorkommen dagegen | Skript |
| Lösung nach dem Audit geändert | Hash in `belege.json` | Skript |
| Ableitung steht als Quellenaussage da | Herkunft je Lösungsfeld Pflicht; `quelle` ohne auffindbaren Anker = Fehler | Rolle + Skript |
| Rechts- und Sachaussage falsch | Fakten im Bauplan (Primärquelle vor dem Schreiben) **und** Fakten-Audit nach dem Schreiben, mit `fakten.json` | Rolle + Skript |
| Widerspruch zwischen Seiten | skriptbarer Teil: gleiche Bezeichner in `format_detail`, Checkliste, Lösungsbild, Raster; Wochentage und Zahlen Beispiel ↔ Situation. Rest: Gegenleser | Skript + Rolle |
| Aufgabe nicht lösbar, keine echte Wahl | **Lösbarkeitsprobe**: Der Lernenden-Gegenleser gibt sein Produkt ab; ein zweiter Agent bewertet es mit Raster und Lösung. Erreicht ein sorgfältiges Produkt Stufe 3 nicht oder weicht es von der Lösung ab, ist die Aufgabe der Fehler | Rolle |
| Unklar, wohin geschrieben wird | jeder Schritt-Hinweis nennt eine Seite | Skript |
| Karte widerspricht dem Heft | `karten.mjs` (Verbraucher, Zahlen/Formate in geteilten Karten); Regel ändern-oder-neu | Skript + Skill |
| Quellenkarte verrät die Lösung | Wortüberlappung `kurzbeschrieb` ↔ Lösung als Warnung; Entscheid beim Gegenleser | Skript + Rolle |
| Handprüfungen `phase-9` §3 Nr. 2–5 | ins Tor | Skript |
| Audio/Video inhaltlich, Seitenbild, Word | bleibt bei Pietro — aber als erzeugte Liste (von–bis, worauf achten) | Liste |

### 5.3 Lösungs-Audit, neu

1. **Blind lösen, dann vergleichen.** Der Auditor bekommt Frage und Quelle,
   nicht die Lösung, schreibt seine Antwort mit Ankern und vergleicht erst dann.
   Heute liest er die Lösung zuerst und bestätigt sie.
2. **Material in voller Auflösung:** VTT bzw. Transkript zeilenweise mit
   Zeitmarken, Lehrmittel mit Seitenmarken. (Die Zeitmarken-Fehler von 8–25
   Sekunden kamen von 20-Sekunden-Blöcken.)
3. **Ergebnis ist `belege.json`**, nicht ein Bericht — siehe 5.1.
4. **Vier Urteile je Feld:** stimmt · stimmt, Fundstelle falsch · Ableitung
   (nicht in der Quelle) · falsch. «Ableitung» ist zulässig, wenn das Heft sie
   so kennzeichnet.
5. **Erneut nach jeder Änderung** einer Lösung — erzwungen durch den Hash.
6. **Getrennt vom Fakten-Audit:** Das Lösungs-Audit prüft gegen Quelle und
   Lehrmittel, das Fakten-Audit gegen Gesetz und Amt. Modell für beides: Opus
   (zu prüfen an zwei Einheiten gegen Sonnet, mit den bekannten Fehlern vom
   05.10. als Messlatte).

### 5.4 Keine Vererbung

Fehler vererbten sich auf vier Wegen; jeder bekommt einen Riegel:

| Weg | Beispiel | Riegel |
|---|---|---|
| Einheit aus Einheit | 3.1.1 aus Gold 1.3.1 | Eine Anpassung ist eine neue Einheit: volle Audits, keine übernommenen Belege. `set.json › abgeleitet_von`; wird die Vorlage korrigiert, meldet das Tor die Abgeleitete als «neu zu prüfen» |
| geteilte Karte | 17 Karten, bis 18 Verbraucher | `karten.mjs`: ändern nur bei Fehler, mit Vermerk und Prüfung aller Verbraucher; sonst überschreiben oder neue Karte (Prompt 4) |
| Skelett, Skill, Renderer | Du-Form im Renderer, «1. Lehrjahr» im Gegenleser-Auftrag | Jeder Befund der Art S/R/P geht in die Sammelliste und wird **vor** dem nächsten Lauf behoben oder ausdrücklich hingenommen — ein Lauf startet nicht mit offenen S-Punkten, die Fehler erzeugen. Skelette laufen selbst durchs Tor |
| Bauplan → Einheit | LF4 nimmt den Entscheid vorweg | Fakten und Kohärenz-Audit im Bauplan für beide Spuren; der Bauplan wird vor der Freigabe von einem Gegenleser gelesen |

Dazu der Rückweg: Wird in einer Einheit ein Fehler gefunden, der aus einer
Regel stammt, wird dieselbe Stelle in allen übrigen Einheiten gesucht — der
Bericht nennt das Ergebnis.

### 5.5 Ablauf und Aufräumen (unverändert aus Fassung 1)

`lauf.mjs` (Tor in einem Befehl, schreibt Logs und Kopf in den Laufordner) ·
`warteschlange.mjs` · `publizieren.mjs` und `check-all --publiziert` · eine
Session je Arbeitsbaum · Cloud-Weg entscheiden · `docs/cloud-run/` →
`docs/produktion/` · Prüfdaten nicht pauschal stempeln · bekannte Skriptfehler
(`seitentext.mjs`, Marker-Skript, `check-einheiten` ohne `set.json`).

### 5.6 Offen für einen Entscheid

- Zeitbedarf: zehn Läufe schätzen mehr als 135 Minuten je Heft.
- `set.wochenplan` nennt 12 Lektionen, der nRLP 6 oder 9.
- Kriterien Stufe 3 teils unerreichbar; «SuK»/«Ges» für Lernende.
- Renderer: Du-Form in `standalone-shell.ts`, feste Texte bei mündlichen
  Produkten, `quellen_anker` in beiden Spuren.
- Crosswalk nachführen (3J 2.3, 4J 1.3).
- Beleg-Dateien ausserhalb des Repos (5.1) oder als kurze Anker im Repo?
  Ausserhalb ist sicher, macht aber das Tor vom Archiv abhängig.

## 6. Reihenfolge

1. Prompt 2 (Versionierung, Leck-Prüfung) — macht den Arbeitsbaum sauber.
2. Prompt 3 (Skill auf Stand), dann 8 (Namen) und 4 (Karten) — sie ändern
   dieselben Dateien, darum nacheinander.
3. Prompt 1a, dann 1b (5.2.1 und 4.3.1 fertig und live) — nach 3, damit sie
   schon nach neuem Ablauf laufen; wenn es eilt, vorher: die Prompts tragen
   Fakten-Audit und volle Untertitel selbst.
4. Prompt 7 (archiviert), 5 (q-221a), 6 (Sammelliste — zuletzt, damit sie die
   Ergebnisse der übrigen schon enthält).
5. Danach, als eigener Auftrag: Belege als Daten (5.1–5.3), die Skripte aus
   5.2, die Riegel aus 5.4. Probe an den fünf wartenden Bauplänen
   (5.1.1 bis 6.3.1) mit gemessener Dauer.

## 7. Umgesetzt am 07.10.2026

Die Punkte aus §3 und §5 sind in acht Aufträgen umgesetzt (Protokoll:
`docs/cloud-run/laeufe/2026-10-07-umbau/PROTOKOLL.md`; Entscheide E34–E38).
Neu im Tor: Namen, Karten, Belege, Fakten, Zeiger, Zahlen, Kohärenz, Skelette.
Neu in der Skill: ein Ablauf für jeden Start (`references/lauf.md`), Phase 10,
die Rollen Lösungs-Audit (blind), Fakten-Audit und Lösbarkeitsprobe
(`references/audits.md`), Belege ausserhalb des Repos (`references/belege.md`).

**Beweis an den Fehlern vom 05.10.** Altstand `ba2732c` von
`3.3.1_kaufvertrag_beurteilen`, `4.2.1_risiken_absichern`,
`1.2.1_lernzeit_planen` in einer Temp-Kopie; Messlatte sind 138 Fehler, die
Nachträge und Korrektur-Commits nennen. Gelaufen sind die Skripte über die
ganzen Einheiten, das Lösungs-Audit je Einheit an EINEM von fünf Paketen
(Heft B, mit Medien; einmal zusätzlich mit Sonnet), das Fakten-Audit begrenzt
auf 45 Aussagen, die Lösbarkeitsprobe an Heft B mit Medien. 69 der 138 Zeilen
lagen damit ausserhalb jedes Laufs. Gezählt ist streng: gefunden heisst
gleiches Feld und gleicher Sachverhalt, als Urteil.

| Art | Fehler | in Reichweite | Skript | Rolle | nur bemerkt | in Reichweite nicht gefunden |
|---|---|---|---|---|---|---|
| Zeiger | 10 | 5 | 1 | 0 | 0 | 4 |
| Zeitmarke | 6 | 5 | 1 | 0 | 0 | 4 |
| Zahl, Rechnung | 4 | 1 | 0 | 0 | 0 | 1 |
| Recht, Sache | 25 | 19 | 0 | 7 | 7 | 5 |
| Widerspruch zwischen Seiten | 24 | 8 | 0 | 0 | 0 | 8 |
| Lösbarkeit | 35 | 15 | 0 | 0 | 6 | 9 |
| Ableitung als Quellenaussage | 20 | 10 | 0 | 0 | 1 | 9 |
| Überlauf, Sprache, Sonstiges | 14 | 6 | 0 | 0 | 0 | 6 |
| **Summe** | **138** | **69** | **2** | **7** | **14** | **46** |

Die drei Ziele des Auftrags:

1. Jeder Zeiger-, Zahlen- und Zeitmarkenfehler vom Skript: **nein** — 2 von 20.
2. Jeder Rechts- und Sachfehler vom Fakten-Audit: **teilweise** — 7 von 25 als
   Urteil, 7 weitere nur bemerkt, 5 in Reichweite nicht gefunden, 6 nicht unter
   den 45 geprüften Aussagen.
3. «Keine echte Wahl», «Stufe 3 unerreichbar» von der Lösbarkeitsprobe:
   **nein** an der Messlatte (0 von 22 in Reichweite; vier Punkte standen nur
   in der Rückgabe der Lernenden). Neu gefunden hat sie zweimal «Stufe 3
   unerreichbar» und dreimal «Form weicht vom Lösungsbild ab».

Was der Beweis sonst zeigt:

- Das **Fakten-Audit** ist die einzige Rolle, die bekannte Fehler als Urteil
  getroffen hat, und es hat 17 neue Befunde geliefert; 15 davon stehen in den
  publizierten Heften noch.
- Das **Lösungs-Audit** hat an den Messlatten-Zeilen seiner Pakete nichts
  getroffen (Opus und Sonnet je 0 von 4). `check-belege` misst die Zeitmarke
  gegen den Anker, nicht gegen die Aussage: Ein Anker am Satzanfang hält die
  Prüfung stumm, auch wenn die Aussage acht Sekunden später fällt.
- Die **Skripte** melden am Altstand 41 Befunde, drei davon treffen die
  Messlatte. `ERR_ZEIGER_SCHRITT_OHNE_SEITE` trifft echte, bisher nicht
  gezählte Stellen; `WARN_KOH_ANZAHL` war in allen sieben Fällen falsch;
  `ERR_ZEIGER_WOERTER` ist wahrscheinlich eine andere Zählweise.
- `fall.json` nimmt dem Fakten-Audit Zahlen weg: Eine Fallzahl maskiert eine
  gleich grosse Rechtszahl.
- Kosten, gemessen: Lösungs-Audit 3–4 Minuten je Paket und Agent, Fakten-Audit
  6–10 Minuten für 45 Aussagen. Für eine ganze Einheit gerechnet, nicht
  gemessen: fünf Opus-Agenten für das Lösungs-Audit, das Fakten-Audit ohne
  Grenze 28–85 Minuten. Das alte Audit ist nie gemessen worden.

Volle Tabellen, die neuen Befunde an den publizierten Heften und vierzehn
Mängel des Verfahrens: `docs/cloud-run/laeufe/2026-10-07-umbau/BEWEIS-auftrag-10.md`.
Die Messlatte und die Beleg-Dateien des Probelaufs liegen ausserhalb des Repos.
