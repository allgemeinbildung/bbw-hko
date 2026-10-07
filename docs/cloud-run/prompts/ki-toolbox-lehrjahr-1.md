# Prompt — KI-Toolbox für alle Einheiten des 1. Lehrjahrs (EFZ 3J und EFZ 4J)

In eine neue Chat-Session im Ordner `D:\OS\dev\bbw-hko` (Branch `v42-skill`, lokal, Modell Opus) einfügen. Die Regeln für den Inhalt stehen in der Skill `hko-ki-komplement`, nicht hier — dieser Prompt sagt nur, **welche** Einheiten, **wer** was tut und **woran** geprüft wird.

Stand der Liste: 07.10.2026 (`src/data/einheiten.index.json`). 1. Lehrjahr heisst: EFZ 3J Themen 1–3, EFZ 4J Themen 1–2.

```
Erzeuge die KI-Toolbox für alle Einheiten des 1. Lehrjahrs (EFZ 3J: T1–T3, EFZ 4J: T1–T2)
mit der Skill hko-ki-komplement. Du orchestrierst: Du schreibst selbst keinen Toolbox-Text,
du verteilst, prüfst und berichtest.

## 1. Bevor du anfängst

1. Lies `.claude/skills/hko-ki-komplement/SKILL.md` und `references/basis-plus.md` — damit du
   beurteilen kannst, was die Agenten abliefern. Lies die Pilot-Toolbox
   `src/data/einheiten/1.3.1_konsum_verantworten_v42/{ki,lernprompt,lernbegleiter}.json` als
   Beispiel für den neuen Zuschnitt (Dateistand 2.0.0).
2. Prüfe, dass der Arbeitsbaum die Werkzeuge trägt: `scripts/check-ki-toolbox.mjs`,
   `scripts/export-ki-toolbox.mjs`, `src/lib/einheiten/ki-toolbox.ts`. Fehlt eines: stopp und melde es.
3. `git status --short` festhalten. Im Arbeitsbaum liegen fremde, nicht eingecheckte Änderungen —
   sie gehören nicht dir. Arbeite im Hauptverzeichnis, **ohne Worktrees** (die Skill ist
   möglicherweise noch nicht eingecheckt).

## 2. Die Einheiten (17 erzeugen, 1 nur prüfen)

Thema 1
- 1.1.1_ausbildung_erfassen_zeigen        3er-Set · 3J+4J · Entwurf     · Toolbox 1.x → neu erzeugen
- 1.1.1_ausbildung_kommunizieren          v4.2    · 3J+4J · publiziert  · keine Toolbox
- 1.1.1_einstieg_interview                3er-Set · 3J    · Entwurf     · keine Toolbox
- 1.1.1_konflikt_kommunizieren            3er-Set · 3J+4J · publiziert  · Toolbox 1.x → neu erzeugen
- 1.1.1_rechte_verstehen_nutzen           3er-Set · 3J+4J · publiziert  · Toolbox 1.x → neu erzeugen
- 1.2.1_lernzeit_planen                   v4.2    · 3J+4J · publiziert  · keine Toolbox
- 1.2.2_ki_kompetenznachweis_vorbereiten  3er-Set · 3J    · publiziert  · Toolbox 1.x → neu erzeugen
- 1.3.1_konsum_verantworten_v42           v4.2    · 4J    · publiziert  · Toolbox 2.0.0 (Pilot) → NUR PRÜFEN

Thema 2
- 2.1.1_informationen_hinterfragen        v4.2 · 3J+4J · publiziert
- 2.2.1_ausgrenzung_analysieren           v4.2 · 3J    · publiziert
- 2.2.1_meinungsfreiheit_reflektieren     v4.2 · 4J    · publiziert
- 2.3.1_anliegen_vertreten                v4.2 · 3J+4J · publiziert
- 2.4.1_haltung_zeigen                    v4.2 · 4J    · publiziert
- 2.5.1_klimaveraenderung_diskutieren     v4.2 · 4J    · publiziert

Thema 3 (nur 3J — bei 4J ist T3 das 2. Lehrjahr)
- 3.1.1_konsum_verantworten_3j            v4.2    · 3J    · publiziert
- 3.2.1_konsumfolgen_beurteilen           v4.2    · 3J+4J · publiziert
- 3.2.1_wahre_kosten                      3er-Set · 3J+4J · Entwurf     · Toolbox 1.x → neu erzeugen
- 3.3.1_kaufvertrag_beurteilen            v4.2    · 3J+4J · publiziert

Nicht dabei, nicht anfassen: EBA (1.1.1_lehrvertrag_orientieren, 1.1.2_unterlagen_ordnen),
die archivierte 1.3.1_konsum_verantworten, 3.2.1_ernaehrung_nachhaltig_gestalten (nur 4J, T3),
alles ab Thema 4.

Gleiche die Liste zuerst mit `src/data/einheiten.index.json` ab. Weicht sie ab (Einheit neu,
weg, anderer Lehrgang oder Status): nimm den Index, und nenne die Abweichung im Bericht.

## 3. Ablauf

**Zuerst zwei Sonden, einzeln:** 1.1.1_konflikt_kommunizieren (3er-Set — in diesem Format ist die
Skill im neuen Zuschnitt noch nie gelaufen) und 2.1.1_informationen_hinterfragen (v4.2). Erzeugen,
alle Prüfungen aus §5 und §6, Seiten ansehen. Erst wenn beide durch sind, den Rest.

**Dann der Rest**, höchstens vier Erzeuger gleichzeitig. Jeder schreibt nur in den Ordner seiner
Einheit, sie stören sich nicht. Die Prüfungen aus §5 fährst du selbst und **nacheinander**
(`export-ki-toolbox.mjs` belegt einen festen Port).

## 4. Auftrag an einen Erzeuger (ein Agent je Einheit, Modell opus)

Gib jedem Erzeuger genau das mit — Ordnername eingesetzt, sonst nichts Eigenes:

    Erzeuge mit der Skill hko-ki-komplement die KI-Toolbox für die Einheit <ordner>
    (D:\OS\dev\bbw-hko). Rufe die Skill auf und folge ihr vollständig; lies jede Referenz,
    die sie für deine Phase nennt.

    - Schreibe nur diese vier Dateien in src/data/einheiten/<ordner>/: ki.json,
      lernprompt.json, lernbegleiter.json, ki-liesmich.md. Bestehende Fassungen dieser vier
      Dateien ersetzt du ganz (neuer Zuschnitt, "version": "2.0.0"). Keine andere Datei
      anfassen — nicht set.json, nicht den Index, nicht die Skill, kein Skript.
    - Der Stopp in Phase 1 («Bestätigen?») entfällt: Wähle Basis- und Plus-Muster nach der
      Skill und nenne Wahl und Punktzahlen in deiner Rückmeldung.
    - Führe am Schluss `node scripts/check-ki-toolbox.mjs <ordner>` aus und behebe jeden
      Fehler in deinen vier Dateien, bis es GRUEN ist. Bei v4.2 zusätzlich
      `node scripts/check-all.mjs <ordner>`: Befunde in deinen Dateien beheben, Befunde in
      anderen Dateien nur melden.
    - Kein Index-Bau, kein Commit.
    - Hältst du eine Regel der Skill für falsch oder für diese Einheit unerfüllbar: nicht
      dehnen, nicht umgehen — melden, mit Feld und Grund.

    Rückmeldung: Format und Lehrgang · Basis- und Plus-Muster mit Punktzahl · die zwei
    Plus-Techniken · der Fehler im beispiel_dialog in einem Satz · letzte Zeile von
    check-ki-toolbox · was du nicht lösen konntest.

## 5. Was du nach jedem Erzeuger selbst prüfst (in dieser Reihenfolge)

1. `git status --short src/data/einheiten/<ordner>` — genau die vier Dateien, nichts sonst;
   und ausserhalb des Ordners nichts Neues.
2. `node scripts/check-ki-toolbox.mjs <ordner>` → GRUEN, 0 Fehler. Warnungen in den Bericht.
3. `node scripts/export-ki-toolbox.mjs <ordner>`, dann `node scripts/messen-v42.mjs <ausgabeordner>`
   → kein «ÜBERLAUF». Erwartete Seiten: Basis-Auftrag 2 · Plus-Auftrag 3 · Lernprompt 3 ·
   Lernbegleiter 3. Andere Seitenzahl oder Überlauf = zurück an den Erzeuger (Text kürzen,
   nie eine Grenze der Skill überschreiten). Seite 1 des Lernbegleiters ist die engste.
4. Nur v4.2: `node scripts/check-all.mjs <ordner>` → kein Befund in einer der vier Dateien.

Traue der Rückmeldung des Erzeugers nicht für diese vier Punkte — fahr sie selbst.

## 6. Gegenleser (ein frischer Agent je Einheit, Modell opus)

Erst wenn §5 grün ist. Der Gegenleser bekommt **die Dateien, nicht den Bericht des Erzeugers**
und nicht deine Einschätzung. Er ändert nichts. Auftrag:

    Lies die KI-Toolbox der Einheit <ordner> so, wie eine lernende Person im 1. Lehrjahr sie
    liest: src/data/einheiten/<ordner>/{ki,lernprompt,lernbegleiter}.json. Lies dazu die
    Einheit selbst (prinzip.json, kn.json, set.json, herausforderung_*.json) und
    .claude/skills/hko-ki-komplement/references/{basis-plus,b1-language-rules}.md.
    Prüfe, was kein Skript prüfen kann. Ändere keine Datei.

    1. Wörter: Steht in einem Text für Lernende ein Fachwort, das weder im Glossar der Einheit
       steht noch im selben Feld erklärt ist? Ein Wort der Didaktik oder der KI-Fachsprache?
    2. Andocken: Arbeitet jeder Basis-Prompt nur mit Begriffen, eigenem Produkt und Kriterien
       der Einheit — ohne neuen Fall?
    3. Beispiel-Verlauf: Hat die Antwort der KI genau einen Fehler, den man nachprüfen kann,
       und findet `pruefung` genau diesen? Stimmen alle anderen Angaben?
    4. Kompetenznachweis: Verrät ein Feld den Fall des KN (kn.hybrid_situation) — auch unter
       anderem Wort? Führt ein Übungsfall-Prompt die KI zum KN-Fall hin?
    5. Nur v4.2: Steht irgendwo Inhalt, der nur in einer Spur vorkommt (Quelle, Raster, Zahl)?
    6. Sachlich: Ist eine Aussage über Recht, Geld oder die Welt falsch oder nicht aus der
       Einheit gedeckt?
    7. Liesmich (ki-liesmich.md): Stimmt er mit den drei Dateien überein (Titel, Techniken,
       Karten, Seiten)?

    Rückmeldung: je Befund Datei › Feld, der Wortlaut, was daran nicht stimmt. Am Schluss ein
    Urteil: «in Ordnung» oder «zurück», und die drei Stellen, die einer lernenden Person am
    schwersten fallen dürften.

**Zurück:** Befunde gehen wörtlich an den Erzeuger derselben Einheit (Agent weiterführen, nicht
neu starten). Danach §5 neu, dann derselbe Gegenleser nur auf die geänderten Felder. Höchstens
zwei Runden; was dann offen ist, kommt mit Wortlaut in den Bericht — nicht schönreden.

Der Pilot 1.3.1_konsum_verantworten_v42 durchläuft nur §5 und §6. Befunde dort: melden, nicht
beheben.

## 7. Grenzen

- Keine Änderung an Skill, Renderer, Skripten, `set.json`, Index, anderen Einheiten.
- Kein `npm run build:einheiten-index`, kein Commit, kein Push.
- Die meisten Einheiten sind **publiziert**. Sobald jemand den Index baut und ausliefert, sehen
  alle Lehrpersonen die Toolbox. Ob sie vorher mit `"entwurf_komponenten": ["ki-fluency"]`
  zurückgehalten wird, entscheidet Pietro — du setzt das Feld nicht, du listest die
  betroffenen Einheiten.
- Zeigt sich in mehreren Einheiten derselbe Mangel, liegt er an der Skill. Dann nicht in jeder
  Einheit von Hand flicken: einmal beschreiben (Regel, Beispiel, Vorschlag) und Pietro fragen,
  bevor du weitermachst.

## 8. Bericht

Schreibe `docs/cloud-run/laeufe/<JJJJ-MM-TT>-ki-toolbox-lehrjahr-1/BERICHT.md`:

- Tabelle, eine Zeile je Einheit: Format · Lehrgang · Status · Basis-Muster · Plus-Muster ·
  check-ki-toolbox · Seiten/Überlauf · check-all (v4.2) · Urteil Gegenleser · Runden · offen.
- Abweichungen von der Liste in §2.
- Was offen blieb, je Einheit mit Datei › Feld und Wortlaut.
- Was an der Skill zu ändern wäre (Mängel, die sich wiederholt haben; Regeln, die ein Erzeuger
  für unerfüllbar hielt).
- Die publizierten Einheiten, für die Pietro über die Sichtbarkeit entscheiden muss.
- `git status --short` am Schluss, getrennt nach «von diesem Lauf» und «war schon da».

Sag am Ende in drei Sätzen, was fertig ist, was nicht, und was Pietro entscheiden muss.
```

## Hinweise für Pietro (nicht Teil des Prompts)

- **Vorher einchecken lohnt sich.** Skill, Renderer und die zwei Skripte dieser Arbeit liegen uneingecheckt im Arbeitsbaum. Der Lauf funktioniert auch so (darum «ohne Worktrees»), aber nach einem Commit ist klar, was der Lauf verändert hat.
- **Zwei Einheiten der Liste sind Ermessenssache:** `1.1.1_einstieg_interview` (Entwurf, hatte nie eine Toolbox) und `1.2.2_ki_kompetenznachweis_vorbereiten` (die Einheit handelt selbst von KI und KN-Vorbereitung — eine Toolbox darüber verdoppelt sie teilweise). Wer sie nicht will, streicht die Zeile in §2.
- **Umfang:** 17 Erzeuger und 18 Gegenleser, dazu Korrekturrunden.
- **3er-Set:** Dort gibt es kein Glossar; `begriffe` kommt aus `prinzip.quellen_anker.konzepte`. Die erste Sonde zeigt, ob das trägt.
