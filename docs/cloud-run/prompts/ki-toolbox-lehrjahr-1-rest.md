# KI-Toolbox 1. Lehrjahr — die letzten drei Einheiten

> Prompt für eine frische lokale Sitzung in `D:\OS\dev\bbw-hko`. Fortsetzung des Laufs vom
> 07.10.2026 (`docs/cloud-run/laeufe/2026-10-07-ki-toolbox-lehrjahr-1/BERICHT.md`, E44).

Erzeuge mit der Skill `hko-ki-komplement` die KI-Toolbox (Dateistand `2.0.0`) für diese drei
Einheiten. Du orchestrierst: Du schreibst selbst keinen Toolbox-Text, du verteilst, prüfst
und berichtest.

| Einheit | Format | Lehrgang (kanonisch) | Status | Lage |
|---|---|---|---|---|
| `3.2.1_konsumfolgen_beurteilen` | v4.2 | EFZ_3J (+4J) | publiziert | noch keine Toolbox |
| `3.3.1_kaufvertrag_beurteilen` | v4.2 | EFZ_3J (+4J) | publiziert | noch keine Toolbox |
| `3.2.1_wahre_kosten` | 3er-Set | EFZ_3J (+4J) | Entwurf | hat Toolbox 1.0.0 — wird ganz ersetzt |

Prüfe die Tabelle zuerst gegen `src/data/einheiten.index.json` und die `set.json` der drei
Ordner. Weicht etwas ab: melden, dann mit dem weiterfahren, was auf der Platte steht.

## 1. Zuerst lesen

- `docs/cloud-run/laeufe/2026-10-07-ki-toolbox-lehrjahr-1/BERICHT.md` — §4b (was an der Skill
  geändert wurde, vor allem H10–H14: Diese drei sind die ersten Einheiten, die damit erzeugt
  werden), §6 (Zwischenfälle), §3.14 (ein Beispiel für zwei Runden).
- `.claude/skills/hko-ki-komplement/SKILL.md` und `references/basis-plus.md` — nur damit du die
  Briefe schreiben und die Rückmeldungen einordnen kannst.
- `docs/upgrade-v4.2/ENTSCHEIDE.md`, E44.

## 2. Modelle und Ablauf

- **Opus erzeugt.** Ein Agent je Einheit (`subagent_type: general-purpose`, `model: opus`),
  alle drei gleichzeitig, im Hintergrund.
- **Sonnet macht alles andere:** erste Lesung des Gegenlesers, Kürzungsrunden,
  Korrekturrunden, zweite Lesung (`model: sonnet`). Dafür **frische** Agenten mit vollem Brief
  — nicht den Opus-Erzeuger weiterführen.
- **Die Prüfungen aus §4 fährst du selbst, nacheinander** (der Export belegt einen festen Port).
  Kein Agent startet `export-ki-toolbox` oder `messen-v42`.
- Jeder Agent legt Hilfsskripte nur in einem **eigenen Unterordner** des Scratchpads ab.
- Führe eine Arbeitsnotiz im Scratchpad (je Einheit: Muster und Punkte, Techniken, Fehler im
  Beispiel, Meldungen, Urteile, Offenes mit Wortlaut). Aus ihr entsteht der Bericht.

Je Einheit: Erzeuger (Opus) → §4 → bei Überlauf Kürzungsrunde (Sonnet) → §4 → erste Lesung
(Sonnet) → bei «zurück» oder benannten Reststellen Korrekturrunde (Sonnet) → §4 → bei «zurück»
zweite Lesung der geänderten Felder (Sonnet). **Höchstens zwei Korrekturrunden**; was dann offen
ist, kommt mit Datei › Feld und Wortlaut in den Bericht. Lautet die erste Lesung «in Ordnung»
mit Reststellen: eine Glättungsrunde, danach nur noch §4.

## 3. Auftrag an den Erzeuger (wörtlich, `<ordner>` einsetzen)

```
Erzeuge mit der Skill hko-ki-komplement die KI-Toolbox für die Einheit <ordner>
(D:\OS\dev\bbw-hko). Rufe die Skill auf und folge ihr vollständig; lies jede Referenz,
die sie für deine Phase nennt.

- Schreibe nur diese vier Dateien in src/data/einheiten/<ordner>/: ki.json,
  lernprompt.json, lernbegleiter.json, ki-liesmich.md. Bestehende Fassungen dieser vier
  Dateien ersetzt du ganz (neuer Zuschnitt, "version": "2.0.0"). Keine andere Datei
  anfassen — nicht set.json, nicht den Index, nicht die Skill, kein Skript.
- Der Stopp in Phase 1 («Bestätigen?») entfällt: Wähle Basis- und Plus-Muster nach der
  Skill und nenne die Wahl in deiner Rückmeldung (Basis mit Grund, Plus mit Punktzahlen).
- Führe am Schluss `node scripts/check-ki-toolbox.mjs <ordner>` aus und behebe jeden
  Fehler in deinen vier Dateien, bis es GRUEN ist. Bei v4.2 zusätzlich
  `node scripts/check-all.mjs <ordner>`: Befunde in deinen Dateien beheben, Befunde in
  anderen Dateien nur melden.
- Starte weder `export-ki-toolbox` noch `messen-v42` (fester Port, das macht der
  Orchestrator). Hilfsskripte nur in einem eigenen Unterordner des Scratchpads.
- Kein Index-Bau, kein Commit.
- Hältst du eine Regel der Skill für falsch oder für diese Einheit unerfüllbar: nicht
  dehnen, nicht umgehen — melden, mit Feld und Grund.

Rückmeldung: Format und Lehrgang · Basis-Muster mit Grund · Plus-Muster mit Punktzahl · die zwei
Plus-Techniken · der Fehler im beispiel_dialog in einem Satz · letzte Zeile von
check-ki-toolbox · was du nicht lösen konntest.
```

## 4. Prüfen — nach jedem Erzeuger und nach jeder Änderung

Zieh **vor dem ersten Erzeuger** `git status --short` als Vergleichsstand.

1. `git status --short src/data/einheiten/<ordner>` — genau die vier Dateien; ausserhalb des
   Ordners nichts Neues gegenüber dem Vergleichsstand.
2. `node scripts/check-ki-toolbox.mjs <ordner>` — GRUEN, 0 Warnungen.
3. `node scripts/export-ki-toolbox.mjs <ordner>`, dann
   `node scripts/messen-v42.mjs "$TEMP/bbw-hko-ki/<ordner>"` — Seiten 2 · 3 · 3 · 3
   (Basis-Auftrag · Plus-Auftrag · Lernprompt · Lernbegleiter), kein «ÜBERLAUF». Notiere die
   Reserven. Die Messung listet in dieser Reihenfolge: `doc-ki-1` S. 1–2 · `doc-ki-2` S. 1–3 ·
   `doc-lernbegleiter` S. 1–3 · `doc-lernprompt` S. 1–3. Die meisten Seiten haben 0 px Reserve
   (Schreibfelder füllen den Platz); Reserve haben meist nur Lernbegleiter S. 1 und S. 3 und
   Lernprompt S. 2. **Gib jedem Korrektur-Agenten die gemessenen Reserven mit der richtigen
   Seite mit.**
4. Nur v4.2: `node scripts/check-all.mjs <ordner>` — kein Treffer in den vier Toolbox-Dateien.
   (`check-all` endet auch mit `ERR_`-Zeilen aus anderen Dateien «GRUEN»; die nur melden.)

## 5. Gegenleser (Sonnet, frischer Agent)

Er bekommt die **Dateien**, nicht den Bericht des Erzeugers. Brief:

```
Arbeitsverzeichnis: D:\OS\dev\bbw-hko. Ändere keine Datei.

Lies die KI-Toolbox der Einheit <ordner> so, wie eine lernende Person im 1. Lehrjahr sie
liest: src/data/einheiten/<ordner>/{ki,lernprompt,lernbegleiter}.json und ki-liesmich.md.
Lies dazu die Einheit selbst (prinzip.json, kn.json, set.json, herausforderung_*.json) und
.claude/skills/hko-ki-komplement/references/{basis-plus,b1-language-rules}.md. Prüfe, was
kein Skript prüfen kann.

1. Wörter: Steht ein Fachwort da, das die Einheit nicht erklärt (Glossar, Hefte) und das
   Blatt selbst auch nicht?
2. Andocken: Dockt jeder Basis-Prompt an Begriffe, am eigenen Produkt oder an Kriterien an?
   Sagt jede Lücke, was hineinkommt — und steht das so auf dem Blatt der Lernenden?
3. Beispiel-Verlauf (lernprompt.json › beispiel_dialog): genau ein Fehler in der Antwort,
   höchstens zwei Angaben; die Prüfung nennt, was stimmt und was nicht. Rechne und schlage nach.
4. Kompetenznachweis: Verrät ein Feld den Fall (kn.json › hybrid_situation;
   prinzip.json › hybrid_situation_spec)? Suche die Fall-Wörter. Ist jede Aussage über den
   Kompetenznachweis für JEDE Form in kn.json › kn_typen wahr?
5. Nur v4.2 — Spur: Braucht ein Feld etwas, das nur in einer Spur steht (Glossarbegriffe mit
   `spur`, Medien, Seiten)?
6. Sachlich: Ist eine Aussage falsch (Recht, Zahl, Begriff, Kapitel, Seite)? Fundstellen prüfen.
7. Liesmich: Stimmt jede Aussage mit den drei JSON-Dateien überein?

SO GEHST DU GRÜNDLICH VOR
- ki.json › ki_1 ist der Basis-Auftrag, ki_2 der Plus-Auftrag; im Lernprompt sind die ersten
  zwei Techniken Basis, im Lernbegleiter die ersten zwei Karten.
- Lies jedes Feld ganz und wörtlich. Prüfe je Seite, ob Ziel, Prompts, Schritte, Kriterien
  und Reflexion dasselbe sagen und dieselbe Sache gleich nennen.
- Bestellt jeder Übungsfall-Prompt, was sein uebungsfokus verspricht? Kommt ein vorgegebener
  Gegenstand eines Übungsfalls in einer Datei der Einheit vor?
- Du darfst die Renderer lesen (src/components/einheiten/docs/Doc{Ki,Lernprompt,Lernbegleiter}.tsx),
  wenn du wissen musst, was gedruckt wird.
- Führe `node scripts/check-ki-toolbox.mjs <ordner>` aus und nenne die letzte Zeile.
  KEIN export, KEIN messen.

NICHT ALS BEFUND FÜHREN: den Zeitpunkt des Basis-Auftrags im Liesmich gegen `ki.timing`;
wörtlich übernommene Kriteriennamen und `kompetenzversprechen`; die Liste `begriffe`.

Trenne: Fehler (muss zurück) · Ungenauigkeit · Geschmack.
Rückmeldung: je Befund Datei › Feld, der Wortlaut, was daran nicht stimmt. Am Schluss ein
Urteil: «in Ordnung» oder «zurück», und die drei Stellen, die einer lernenden Person am
schwersten fallen dürften.
```

Bei der zweiten Lesung: dieselbe Einleitung, dann **nur die geänderten Felder** als Liste, je
mit der Frage, die daran zu prüfen ist.

## 6. Korrektur- und Kürzungsrunden (Sonnet, frischer Agent)

Der Brief hat immer diese Teile: Lage (Einheit, Format, was geprüft ist) · die vier Dateien, die
er ändern darf · zuerst lesen (`basis-plus.md` ganz, `b1-language-rules.md` §1–§4, die Einheit) ·
Sprache (echte Umlaute, kein ß, Sie-Form, Du im Prompt, Sprachzeile, 45 / 70 Wörter, eine Lücke
in der Basis) · **die Befunde wörtlich** · was nicht zu ändern ist (`kompetenzversprechen`,
Kriteriennamen, `begriffe`, Muster, Techniken, Titel, Beispiel-Verlauf) · Grenzen (gemessene
Reserven je Seite; «kein Feld in `ki.json` und `lernprompt.json` wird länger als vorher —
wo etwas dazukommt, im selben Feld kürzen») · am Schluss beide Skripte GRUEN, keine
Seitenmessung · Rückmeldung je Feld alt/neu mit Zeichenzahl.

Zwei Fallen des Skripts, die jeder Brief nennt: Es zählt «…, den Sie …» und «oder wogegen Sie»
als zweiten Auftrag; bei v4.2 ist das Wort «Stufe» gesperrt.

## 7. Grenzen

- Keine Änderung an Renderer, Skripten, `set.json`, Index, anderen Dateien der Einheiten.
- **Die Skill darfst du nachschärfen**, wenn derselbe Mangel in zwei der drei Einheiten
  auftritt oder ein Beispiel der Skill falsch ist — und nur dann. Jede Änderung in den Bericht.
- Kein `npm run build:einheiten-index`, kein Commit, kein Push — das macht Pietro oder sagt es
  ausdrücklich. `entwurf_komponenten` setzt du nicht: Nach E44 gehen die Toolboxen ohne
  Entwurfs-Schranke live; `3.2.1_wahre_kosten` ist als ganze Einheit Entwurf.

## 8. Bericht

`docs/cloud-run/laeufe/<Datum>-ki-toolbox-lehrjahr-1-rest/BERICHT.md`, Aufbau wie der Bericht
vom 07.10.2026: Tabelle je Einheit (Format · Lehrgang · Status · Basis-Muster · Plus-Muster ·
check-ki-toolbox · Seiten/Überlauf · check-all · Urteil Gegenleser · Runden · offen) · Offenes
je Einheit mit Datei › Feld und Wortlaut · Änderungen an der Skill · Befunde ausserhalb der
Toolbox · `git status --short`, getrennt nach «von diesem Lauf» und «war schon da».

Trag den Laufordner in `docs/cloud-run/laeufe/INDEX.md` ein (Einheit `—`, «kein Einheiten-Lauf»),
sonst meldet `node scripts/check-namen.mjs` `NAME_LAUF_OHNE_INDEX`.

Sag am Ende in drei Sätzen, was fertig ist, was nicht, und was Pietro entscheiden muss.
