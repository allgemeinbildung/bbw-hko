# Orchestration brief — Generator-Skill für v4.2-Einheiten (zwei Hefte, zwei Spuren, Lösungen)

Füge dies als Eröffnungsanweisung der Claude-Code-Session ein, die die neue
Generator-Skill baut. Arbeitsverzeichnis: `D:\OS\dev\bbw-hko`.

---

## Mission

Die Gold-Einheit `1.3.1_konsum_verantworten_v42` ist von Hand orchestriert
entstanden. Du baust jetzt die **Skill, die solche Einheiten erzeugt**: zwei
Hefte A/B, je in den Spuren `ohne_medien` und `mit_medien`, gemeinsamer
Auftrag, KN, Begleiter, Glossar mit Begriffsnetz, Beispielbild auf Seite 6 und
die Lösungen für alle Felder (Dokument «Lösungen»).

Das ist **Skill-Authoring gegen einen fertigen Datenvertrag**, kein
Renderer-Bau und kein Redesign. Renderer, Typen, Prüfskripte und die
Gold-Einheit stehen. Die Skill schreibt Daten, die das bestehende Tor grün
durchlaufen — sie ändert weder das Format noch das Layout.

Zwei Auflagen des Auftraggebers, die über allem stehen:

- **Die alte Skill geht nicht verloren.** `.claude/skills/bbw-hko-3er-set/`
  bleibt Datei für Datei, wie sie ist, und bleibt aufrufbar. Die neue Skill
  steht daneben. Der Rückweg zur alten Methode ist jederzeit: alte Skill
  aufrufen.
- **Alte Einheiten bleiben zugänglich, auch wenn ihre Daten alt sind.** Jede
  Einheit rendert in dem Layout, in dem sie geschrieben wurde. Es wird keine
  bestehende Einheit migriert, umgeschrieben oder neu generiert.

Fertig ist die Arbeit, wenn die neue Skill aus einem freigegebenen Bauplan
**ohne Handkorrektur** eine zweite Einheit erzeugt, die alle Gates besteht
(Abschnitt «Verification gates»). Ein Datum gibt es nicht.

Bewusst zurückgestellt: EBA, KI-Toolbox, Präsentation und Werkstatt für v4.2,
Migration alter Einheiten, Feedback-Formular, Katalogkarte (Liste am Schluss).

**Offen — Pietro bestätigt oder du entscheidest nach diesen Regeln und hältst
es fest:**

- *Probe-Einheit.* Sie muss sich nach dem Leitprinzip von 1.3.1 unterscheiden
  (Modi des Auftrags, Produkttyp, SK — mindestens zwei von drei). Erfüllt ein
  freigegebener Bauplan unter `docs/cloud-run/bauplaene/` das, nimm ihn. Sonst
  wählst du aus `docs/cloud-run/abdeckung.md` eine offene EFZ-Kompetenz mit
  Kernkapitel (kein ⚠, nicht T7), die das erfüllt — etwa aus einem Thema mit
  mündlichem oder audiovisuellem Rezeptionsmodus —, schreibst den Bauplan
  selbst und lässt «Freigabe: offen» stehen. Die Probe-Einheit bleibt
  in jedem Fall Entwurf.
- *Name der neuen Skill.* Vorschlag `bbw-hko-heft-v42` (wie die Vorlage
  `heft_8page_v42`). Der Name steht danach in `docs/cloud-run/RUN.md`.
- *Welche Skill ist Standard.* Vorschlag: die neue. Die alte reagiert nur noch
  auf ausdrückliche Nennung («3er-Set», «alte Methode»).

## Leitprinzip — einheitlich im Gerüst, frei in Modus, Kompetenz und Produkt

Vorgabe von Pietro (02.10.2026), sie steht über jeder Einzelregel dieses Briefs:
Die Einheiten sollen **untereinander kohärent** sein und zugleich die
**HKO-Flexibilität bei Sprachmodi, Schlüsselkompetenzen und Handlungsprodukten**
behalten. Die Gold-Einheit ist die Referenz für das Gerüst, nicht für den
Inhalt. Eine Skill, die jede Einheit auf «Landkarte, Budget, Entscheidungsblatt
und Sprachnachricht» zuschneidet, hat den Auftrag verfehlt.

| In jeder Einheit gleich (Kohärenz) | Je Einheit aus Lehrplan und Prinzip abgeleitet (Flexibilität) |
|---|---|
| Aufbau: zwei Hefte, acht Seiten in fester Folge, gemeinsamer Auftrag, KN, Begleiter, Lösungen | **Sprachmodi** je Heft und des Auftrags (Regel Leitfaden §7.2) — auch Interaktion, auch mündlich und audiovisuell |
| Kern einmal, Spuren nur das Abweichende; Spur fehlt, wenn der Modus sie nicht trägt (§4.4) | **Schlüsselkompetenzen** aus dem nRLP-Thema und ihre Verteilung auf A, B und KN |
| Vier Leitfragen mit fester Funktion (verstehen, anwenden, analysieren, beurteilen) | **Handlungsprodukt**: Typ und Format frei — Karte, Budget, Brief, Gespräch, Plakat, Statement … |
| Feedback-Kriterien im Wortlaut des KN, 0–3 Punkte | Pol-Typ von LF4, Typ der Quelle, Spalten des Rasters |
| Begriffsnetz aus dem Glossar des Hefts, gleiches Zentrum in A und B | Lebensbereich und Produkt des gemeinsamen Auftrags, Sozialform |
| Benennung, IDs, Kurzlink, Sprache, ein Akzent | Fall, Zahlen, Methodenkarten |

Folgen für die Arbeit:

- **Die Skill leitet die rechte Spalte her**, sie kopiert sie nicht aus 1.3.1.
  Jede Phase nennt, woraus sie Modus, SK und Produkt ableitet (nRLP-Datensatz,
  `prinzip.json`), und prüft die Abdeckung: Die Modi des KN sind über Hefte und
  Auftrag verteilt, die SK des Themas kommen vor.
- **Wo der Renderer die rechte Spalte einengt, wird der Renderer
  verallgemeinert — nicht der Inhalt verbogen.** Dafür ist der Zaun an genau
  zwei Stellen bereits geöffnet (siehe «Bekannte Stellen»): Auftragsbogen A2/A3
  und Produktbild. Bedingung: datengesteuert, additiv, die Gold-Einheit und
  alle Bestandseinheiten rendern danach unverändert.
- **Die Probe-Einheit prüft die Flexibilität.** Sie unterscheidet sich von
  1.3.1 in mindestens zwei von drei Punkten: Sprachmodi des Auftrags, Typ des
  Handlungsprodukts, Schlüsselkompetenzen. Eine zweite Einheit, die wieder
  Liste, Tabelle und Sprachnachricht braucht, beweist nichts.
- **Kohärenz wird gemessen, nicht behauptet:** Am Schluss liegen Gold- und
  Probe-Einheit nebeneinander, und die linke Spalte stimmt Zeile für Zeile.

## State of the repo

Branch `v42-gold-1.3.1`, HEAD `bd80e89`, nur lokal, nichts gepusht. `main` ist
Produktion (`4ed2bee`, ein Commit vor `origin/main`). Lege für diese Arbeit den
Branch `v42-skill` von `v42-gold-1.3.1` an.

Already done — do not redo:

- **Datenvertrag v4.2** in `src/lib/einheiten/types.ts` (Spuren, Quellen,
  Glossar je Heft, `ProduktBild`, Lösungsfelder, `heft_bezug`). Auflösung beim
  Laden in `src/lib/einheiten/index.ts`, `spuren.ts`, `quellen.ts`.
- **Renderer** für Heft (8 Seiten), Auftragsbogen (4), Dokument «Lösungen» (5),
  Begleiter, QR-Seite `/m/<Ordner>`, Arbeitsansicht mit Spur-Umschalter und ZIP
  — HTML und Word. Alles hinter `template === "heft_8page_v42"`.
- **Tor und Werkzeuge:** `scripts/check-all.mjs` (bündelt nRLP, Kopplung,
  Leitfragen-Lösungen, `check-v42`, Struktur, Status, Methoden, Sprache, Leck),
  `scripts/check-v42.mjs` (Budgets §3.1, Regeln §11.5, Glossar, Produktbild,
  Lösungen), `scripts/export-v42.mjs`, `scripts/messen-v42.mjs`,
  `scripts/bestand-v42.mjs`. Stand 02.10.2026: `check-all` auf der Gold-Einheit
  grün, `bestand-v42 --pruefen` «26 Dokumente unverändert», `npm run build`
  Exit 0.
- **Gold-Einheit** `src/data/einheiten/1.3.1_konsum_verantworten_v42/` mit acht
  Quellenkarten (`src/data/quellen/q-131*.json`) und zwei neuen Methodenkarten.
- **Cloud-Lauf-Gerüst** einer Parallelsession: `docs/cloud-run/` (RUN,
  Handoff, Bauplan-Vorlage, Abdeckung), `scripts/cloud-*.mjs`. Der Lauf ruft
  heute noch die alte Skill auf.
- **Alte Skills:** `.claude/skills/bbw-hko-3er-set/` (1362 Zeilen `SKILL.md`,
  13 References, 4 Templates), `hko-2er-EBA-set-generator/`,
  `hko-ki-komplement/`. Alle im Repo versioniert.

Bekannte Stellen, an denen der Renderer auf die Gold-Einheit zugeschnitten ist.
Für die ersten zwei ist der Zaun nach dem Leitprinzip **bereits geöffnet**
(verallgemeinern, datengesteuert und additiv); bei den übrigen gilt
Invariante 12:

- **Auftragsbogen A2/A3** (`src/components/einheiten/docs/DocAuftragsbogen.tsx`,
  `src/lib/einheiten/docx-auftragsbogen-v42.ts`): Schritt 04 des gemeinsamen
  Auftrags gilt als das schriftliche Produkt (Arbeitsfläche A2), Schritt 05 als
  das mündliche (Sprechspur A3). Die drei Stationen der Sprechspur
  (`SPRECHSPUR_STATIONEN`) und der Satz zur «Sprachnachricht» sind fest im Code.
  Ein Auftrag mit anderen Sprachmodi (Leitfaden §7.2) passt nicht hinein.
  **Zaun offen:** A2 und A3 richten sich nach den Produkten und Modi des
  Auftrags aus den Daten; die heutige Form ist der Fall «schriftlich und
  bildlich + mündlich».
- **Produktbild** (`src/components/einheiten/docs/heft-v42/produkt-bild.tsx`,
  `src/lib/einheiten/docx-produkt-bild-v42.ts`): zwei oder drei Blöcke, je
  Liste oder Tabelle. **Zaun offen:** weitere Blockarten, wenn ein
  Handlungsprodukt sie braucht (Fliesstext für Brief oder Statement,
  Wechselrede für ein Gespräch). Neue Blockart = neues optionales Feld in
  `ProduktBildBlock`, Eintrag in `ENTSCHEIDE.md`, Regel in `check-v42.mjs`.
- **Word-Höhen** (`ZUSCHLAG_MM` in `src/lib/einheiten/docx-heft-v42-1-4.ts`):
  feste Zuschläge, an 1.3.1 gemessen. Längere Texte können eine neunte Seite
  auslösen.
- **Vier Leitfragen, vier Äste, vier Methodenkarten** sind fest. Die EBA-
  Variante mit drei Leitfragen (Leitfaden §10) gibt es im Renderer nicht.
- **Begriffsnetz:** für 1–5 Knoten je Ast durchgerechnet, gerendert nur mit den
  Daten von 1.3.1.

Authoritative inputs, in order of precedence:

| Path | What it is |
|---|---|
| `docs/upgrade-v4.2/ENTSCHEIDE.md` | E1–E19. **Entschieden, geht dem Leitfaden vor.** Vor allem E16–E19 (Pietros Rückmeldungen): QR nur S. 3, «Quelle» statt «Pflichtquelle», keine Woche und keine Zeit im Heft, Begriffsnetz und Glossar je Heft, Beispielbild, neutraler Auftragsbogen, Lösungen in Grün. |
| `src/data/einheiten/1.3.1_konsum_verantworten_v42/` | Die Referenz. Was die Skill erzeugt, hat diese Form — Feld für Feld. |
| `scripts/check-v42.mjs`, `scripts/check-all.mjs` | Die maschinelle Fassung der Regeln. Bei Widerspruch zwischen Prosa und Skript gilt das Skript; ist das Skript falsch, eskalieren (Zaun). |
| `src/lib/einheiten/types.ts` | Feldnamen und Bedeutung. Nicht erweitern. |
| `docs/upgrade-v4.2/01_Leitfaden_v4.2.md` | Didaktisches Konzept (Seitenplan, Spuren, Pol-Typen, Auftrag, Sprachmodus-Regel §7.2). Gilt, soweit ENTSCHEIDE nichts anderes sagt. |
| `docs/upgrade-v4.2/BERICHT.md` | §8 «Was für die Serienproduktion folgt» — elf Lehren, die in die Skill gehören. §5–§7a: was offen und bewusst nicht gebaut ist. |
| `docs/pipeline-review-2026-10-01.md` | Abschnitt C: warum die alte Skill nicht autonom läuft (Stopps, Template-Fehler, tote Verweise). Nicht nachbauen, was dort als Fehler steht. |
| `docs/cloud-run/RUN.md`, `docs/cloud-run/bauplaene/_VORLAGE.md` | Wie die Skill unbeaufsichtigt aufgerufen wird und welche Entscheide der Bauplan vorwegnimmt. |
| `.claude/skills/bbw-hko-3er-set/` | Vorlage für Aufbau und für alles, was unverändert gilt (nRLP-Lookup, Crosswalk, Sprachregeln, KN-Architektur). **Nur lesen.** |
| `CLAUDE.md` | Architektur, Befehle, Konventionen. |

## Non-negotiable invariants

Bei jeder Übernahme in den Arbeitsbaum durchsetzen. Ein Verstoss ist ein Defekt,
egal wie gut die Arbeit ist.

1. **Kein Push, kein Deploy, kein Merge nach `main`.** `main` ist Produktion;
   ein Push veröffentlicht sofort für alle Lehrpersonen. Arbeite auf
   `v42-skill`, committe dort, pushe nichts.
2. **Das Repo ist öffentlich (`allgemeinbildung/bbw-hko`).** Keine
   Lehrmittelpassagen, Transkripte oder Artikeltexte ins Repo — nicht in
   Einheiten, nicht in Skill-Beispielen, nicht in Templates oder Tests. Die
   Skill ist selbst Repo-Inhalt: ein Lehrmittelzitat als «Beispiel» in einer
   Reference ist ein Leck. Einmal committet, ist ein Text in der Historie und
   nicht mehr zurückzuholen.
3. **Die alte Skill bleibt bytegleich.** `git diff v42-gold-1.3.1 --
   .claude/skills/bbw-hko-3er-set` ist am Ende leer. Braucht die neue Skill
   eine Reference der alten, wird sie **kopiert**, nicht verlinkt und nicht
   verschoben — sonst ändert ein späterer Eingriff in die neue Skill
   stillschweigend die alte, und der Rückweg ist kaputt.
4. **Keine bestehende Einheit wird angefasst, und jede rendert weiter wie
   bisher.** Unter `src/data/einheiten/` entsteht nur der Ordner der
   Probe-Einheit. Renderer-Verhalten hängt allein an `template` — nie an
   `status`, am Datum oder an «fehlt ein Feld». `node scripts/bestand-v42.mjs
   --pruefen` meldet am Ende «unverändert». Eine alte Einheit, die nach dieser
   Arbeit anders aussieht oder nicht mehr öffnet, ist der eine Fehler, den der
   Auftraggeber ausdrücklich ausgeschlossen hat.
5. **Der Datenvertrag ist eingefroren.** Die Skill erzeugt nur Felder, die
   `types.ts` kennt, in der Form der Gold-Einheit. Kein umbenanntes Feld, kein
   neuer `template`-Wert, und neue Felder nur an den zwei nach dem Leitprinzip
   geöffneten Stellen (optional, additiv, mit Entscheid). Jede Einheit, die die Skill in
   Serie schreibt, trägt das Format weiter; ein Formatfehler in der Skill wird
   mit jeder erzeugten Einheit teurer.
6. **Ordnername, Kurzlink und Quellen-IDs sind nach dem ersten Druck fest.**
   Kurzlink `/m/<Ordnername>` mit Ankern `#a`/`#b`, Quellen-IDs nach dem Muster
   `q-<nr><heft>-pflicht | -pflicht-ersatz | -vertiefung-1 | -vertiefung-2`.
   Die Skill leitet sie nach einer festen Regel ab und fragt nicht. Ein
   gedruckter QR-Code lässt sich nicht korrigieren.
7. **Jede erzeugte Einheit trägt `status: "entwurf"`, exakt so.** Jeder andere
   Wert gilt im Index-Builder als veröffentlicht.
8. **Kern einmal, Spuren nur das Abweichende.** Situation, LF1, LF2, Produkt,
   Kriterien, Mindmap-Äste und Abschluss stehen genau einmal; `spuren.*` trägt
   LF3, LF4, Quellen, Kasten S. 4, Rezeptionskarte, `scaffold_90`. Feedback-
   Kriterien wörtlich aus `kn.rubrik_shared`.
9. **Keine erfundenen Quellen, Zahlen, Seiten, Zitate.** Fachaussagen nur aus
   dem Lehrmittelkapitel des Crosswalks; Medien-Spur nur mit vorhandener
   Quellenkarte **und** Volltext im Archiv. Fehlt eines davon, erzeugt die
   Skill nur die Spur ohne Medien und meldet es — sie erfindet keine Quelle.
10. **Lösungen entstehen an der Quelle, nicht danach.** LF3-Raster, Befund und
    die Erwartung zu jeder Vertiefung tragen eine Fundstelle (Absatz,
    Zeitmarke, Seite). Lässt sich zu einer Leitfrage kein Erwartungshorizont
    mit Fundstelle schreiben, ist die Frage falsch gestellt und wird
    umformuliert (BERICHT §8, Punkte 1, 2 und 8).
11. **Budgets gelten hart.** `.a4-page` hat `overflow: hidden`; was zu lang
    ist, wird still abgeschnitten. Die Skill prüft mit `check-v42` während des
    Schreibens, nicht am Ende.
12. **Scope-Zaun** — nicht verändern, ausser eine Aufgabe sagt es ausdrücklich:
    `src/lib/`, `src/components/`, `src/styles/`, `src/pages/`, `scripts/`,
    `src/data/einheiten/` ausser dem Ordner der Probe-Einheit,
    `src/data/methoden/` und `src/data/quellen/` ausser neuen Karten der
    Probe-Einheit, `.claude/skills/bbw-hko-3er-set/`,
    `.claude/skills/hko-2er-EBA-set-generator/`,
    `.claude/skills/hko-ki-komplement/`, `supabase/`, `public/`, `renderer/`,
    `begleiter/`, `docs/upgrade-v4.2/` ausser `ENTSCHEIDE.md` (neue Einträge ab
    E20). Zeigt die Probe-Einheit einen Fehler in Renderer oder Prüfskript:
    anhalten, Befund mit Datei und Zeile melden; du entscheidest, dokumentierst
    und öffnest den Zaun für genau diese Korrektur.
13. **Sprache:** Schweizer Hochdeutsch, kein «ß», echte Umlaute, Situationen in
    Ich-Form, Aufträge in Sie-Form, Begleiter in Du-Form, neutrale Persona.
    Im Heft keine Woche, keine Lektion, keine Minuten; auf dem Auftragsbogen
    keine Vorgabe, was die Lehrperson mit dem Auftrag macht (E17, E18).

## Verification gates

Nichts ist «fertig», bevor das aus dem Repo-Root durchläuft:

```
node scripts/check-all.mjs <ordner-der-probe-einheit>
node scripts/check-all.mjs 1.3.1_konsum_verantworten_v42
node scripts/export-v42.mjs <ordner-der-probe-einheit> --out <tmp>
node scripts/messen-v42.mjs <tmp>
node scripts/bestand-v42.mjs --pruefen
npm run build
git diff --stat v42-gold-1.3.1 -- .claude/skills/bbw-hko-3er-set
```

- `check-all` muss «GRUEN» melden, Exit 0. Befunde werden in den Daten und in
  der Skill behoben, nie im Skript und nie über `--baseline`.
- `messen-v42` Exit 0: keine Seite läuft über, in keinem Dokument
  (4 Hefte × 8, Auftragsbogen 4, 4 Lösungen × 5).
- `bestand-v42 --pruefen` meldet «unverändert»; der letzte Befehl gibt nichts
  aus.
- Wird der Renderer an einer geöffneten Stelle verallgemeinert: Export der
  Gold-Einheit vor und nach dem Eingriff vergleichen — die HTML-Dateien sind
  bytegleich, die Word-Dateien haben dieselbe Seitenzahl.
- `src/data/einheiten.index.json` wird vom Build geschrieben, nie von Hand.

Was kein Befehl abdeckt — von dir geprüft, bevor du abschliesst:

- **Ohne Handkorrektur.** Die Probe-Einheit ist so committet, wie die Skill sie
  geschrieben hat. Jede nachträgliche Korrektur an den Daten ist ein Fehler der
  Skill und wird dort behoben; danach läuft die Skill für die betroffene Datei
  neu.
- **Vorlagen-Abgleich.** Jedes Feld der Gold-Einheit kommt in den Templates
  oder im Feld-Mapping der neuen Skill vor, und umgekehrt (Schlüsselmengen
  vergleichen, nicht lesen).
- **Word:** alle vier Hefte 8 Seiten, Auftragsbogen 4. Die Word-Höhen sind an
  der Gold-Einheit gemessen (BERICHT §7); bei längeren Texten kann eine neunte
  Seite entstehen.
- **Lösungen nirgends bei den Lernenden:** kein Lösungsfeld im Heft-HTML, im
  Auftragsbogen oder auf `/m/<Ordner>`.
- **Alte Einheit geöffnet:** mindestens eine publizierte 3er-Einheit und eine
  EBA-Einheit über Export oder Dev-Server gerendert und angesehen.
- **Beide Skills aufrufbar:** die Beschreibungen (`description`) der zwei
  Skills überlappen nicht so, dass die falsche anspringt.

---

# Role policy

## FABLE 5 — orchestrator, main session, high effort

"Fable owns the main session, requirements, judgment, integration, and final
verification."

"Fable does not inline-execute large builds. For a bounded, difficult
implementation, Fable writes the spec, dispatches an Opus 5 executor subagent,
and verifies the result. Fable stays at requirements, judgment, and
integration; an executor converging fast on an approved spec is the desired
behavior, not a defect."

"Brief only the exact delta, scope, output, stopping condition, and exclusions."

Fable personally owns, and does not delegate:

- **Den Bauplan der neuen Skill:** Phasenfolge, welche Entscheide der Bauplan
  der Einheit vorwegnimmt und welche die Skill nach fester Regel selbst trifft,
  und was sie tut, wenn eine Voraussetzung fehlt (Quelle, Kapitel, Modus).
- **Name, Beschreibung und Trigger beider Skills** — und damit, welche Standard
  ist (Invariante 3 und Gate «beide aufrufbar»).
- **Die Ableitungsregeln für alles Unumkehrbare:** Ordnername, Kurzlink,
  Quellen-IDs, `status` (Invarianten 6 und 7).
- **Jede Öffnung des Scope-Zauns** und jeden Eintrag in `ENTSCHEIDE.md`.
- **Das Kohärenz-Raster** (Leitprinzip): was in jeder Einheit gleich ist und
  was die Skill je Einheit herleitet — und das Urteil, ob eine Verallgemeinerung
  des Renderers die Flexibilität wirklich öffnet oder nur einen zweiten
  Sonderfall einbaut.
- **Das Urteil über die Probe-Einheit:** Trägt die Quelle den Auftrag, ist der
  Fall des KN aus Heften und Auftrag herausgehalten, liest sich das Ganze wie
  eine Einheit und nicht wie sechs Aufträge.
- Die Schlussprüfung vor der Übergabe.

Fable eskaliert an Pietro, statt allein zu entscheiden, wenn: ENTSCHEIDE und
Leitfaden sich bei etwas Unumkehrbarem widersprechen oder schweigen; die
Probe-Einheit nur grün wird, indem Renderer oder Prüfskript geändert werden;
für die Probe-Einheit keine Quelle den Regeln genügt und auch die Spur ohne
Medien am Lehrmittel scheitert; eine Regel der alten Skill und eine der neuen
sich so widersprechen, dass die alte geändert werden müsste. Ist Pietro nicht
erreichbar: konservativ entscheiden, in `ENTSCHEIDE.md` mit Rückweg festhalten,
im Schlussbericht an erster Stelle nennen.

## OPUS 5 — executor

Inject into every executor prompt:

"Deliver the requested scope and stop before unasked work."

"Correct an immaterial slip silently. Call it out only when it changes a
number, conclusion, or decision."

"Do not replace grounding or fresh retrieval with confidence or self-review."
Zulässige Grundlagen sind allein: die Gold-Einheit, `types.ts`,
`check-v42.mjs`, `ENTSCHEIDE.md`, der Leitfaden und die im Auftrag genannten
Dateien der alten Skill. Für Inhalte einer Einheit zusätzlich nur das
Lehrmittelkapitel des Crosswalks (`material/_lehrmittel/`), der nRLP-Datensatz
des Lehrgangs und der Archivtext einer Quelle, deren Karte vorliegt. Feldnamen,
Budgets, Seitenzahlen, Rechtsstände und Zahlen nie aus dem Gedächtnis; ein Feld,
das in der Gold-Einheit nicht vorkommt, gibt es nicht.

Dispatch one Opus executor per bounded, difficult unit of work:

- **Eine Phase der neuen Skill** — ein zusammenhängender Abschnitt von
  `SKILL.md` samt den References und Templates, die nur diese Phase braucht.
  Richtgrösse: 150–300 Zeilen Skill-Text plus ein Template. Beispiele: «Heft-
  Kern (Situation, LF1, LF2, Produkt, Kriterien)», «Spuren (LF3, LF4, Kasten
  S. 4, Quellenbindung)», «Abschluss (Glossar, Begriffsnetz, Beispielbild)»,
  «Lösungen für alle Felder», «Set mit gemeinsamem Auftrag», «Begleiter».
- **Der Auto-Modus:** Lesen des Bauplans, Auswahlregeln für jeden früheren
  Stopp, Verhalten bei fehlender Voraussetzung.
- **Die Bauplan-Vorlage v4.2** (`docs/cloud-run/bauplaene/_VORLAGE.md`): die
  Entscheide, die v4.2 neu verlangt — KN-Kriterien je Heft, Pol-Typen je Spur,
  Lebensbereich des Auftrags, Mindmap-Zentrum, Quellen-Slots.
- **Die Probe-Einheit**, erzeugt durch die fertige Skill: ein Executor, eine
  Einheit, kein Eingriff von Hand.

Executor brief template:

```
Schreibe <Abschnitt> der Skill .claude/skills/<neue-skill>/ — oder: Erzeuge mit
der Skill <neue-skill> die Einheit <ordner> aus docs/cloud-run/bauplaene/<ordner>.md.

Spec:      ENTSCHEIDE.md <E-Nummern> · Leitfaden <§> · check-v42.mjs <Funktion>
Sources:   src/data/einheiten/1.3.1_konsum_verantworten_v42/<datei> (Form) ·
           .claude/skills/bbw-hko-3er-set/<datei> (nur lesen) · <weitere, genau benannt>
Pattern:   die entsprechende Phase der alten Skill bzw. die Gold-Einheit
Budget:    <Zeilen Skill-Text | genau eine Einheit>

Must hold: Datenvertrag eingefroren — nur Felder aus types.ts, Form wie Gold.
           Kein Lehrmittel-, Transkript- oder Artikeltext im Repo, auch nicht als Beispiel.
           Alte Skill und bestehende Einheiten unverändert.
           <die eine oder zwei Invarianten, die diese Phase besonders trifft>

Out of scope: src/lib, src/components, src/styles, scripts, alle anderen Skills,
           alle Einheiten ausser <ordner>, CLAUDE.md, docs ausser <genannte Datei>.
           Kein Commit, kein Push.

Done when: <beobachtbar — z. B. «node scripts/check-all.mjs <ordner> meldet GRUEN»
           oder «die Phase erzeugt aus dem Bauplan von 1.3.1 Dateien, deren
           Schlüsselmenge der Gold-Einheit entspricht»>
Return:    geänderte Dateien · Ausgabe des Done-when-Befehls · jede Stelle, an der
           die Skill eine Regel braucht, die in keiner Quelle steht · alles, was
           du nicht belegen oder nicht prüfen konntest.
```

## SONNET 5 — fan-out worker

"Dispatch it freely for fan-out that needs per-item judgment: blind reader
panels, audits, workspace sweeps. Give it an exact brief, defined output, and a
stopping condition."

"Complete the exact requested deliverable and stop. Do not audit the
surrounding system, surface adjacent issues, or recommend extra improvements."

"Diagnose or report does not authorize a fix. A one-file request does not
authorize related changes."

"Do not create or delegate to subagents."

Natural fan-out for this build — one worker per Gegenstand, parallel:

- **Regel-Inventar der alten Skill.** Ein Worker je Reference und je
  Hauptabschnitt von `bbw-hko-3er-set/SKILL.md`: Welche Regel gilt in v4.2
  unverändert, welche ist ersetzt (mit E-Nummer), welche entfällt? Ausgabe als
  Tabelle. No fixes.
- **Feld-Abgleich.** Ein Worker je Datei der Gold-Einheit: jedes Feld gegen
  Templates und Feld-Mapping der neuen Skill — fehlt, überzählig, anders
  benannt. No fixes.
- **Quellensuche für die Probe-Einheit** (nur lokal, mit Netz): ein Worker je
  Slot (Quelle und Ersatz je Heft, zwei Vertiefungen je Heft), zwei bis vier
  Kandidaten, abgerufen und gemessen, Volltext ins Archiv
  `D:\OS\_lab\quellen-archiv\bbw-hko\<id>\`, nie ins Repo.
- **Blindleser der Probe-Einheit.** Je Heft und Spur ein Worker, der das Heft
  als Lernende/r im 1. Lehrjahr liest (nur das exportierte HTML, ohne
  Begleiter und Lösungen): Wo bleibe ich hängen, was fehlt mir, trägt die
  Quelle die Frage? No fixes.
- **Lösungs-Audit.** Ein Worker je Heft und Spur: jede Lösung im Dokument
  «Lösungen» gegen Lehrmittelkapitel bzw. Archivtext, mit Fundstelle. No fixes.
- **Trigger-Probe.** Ein Worker bekommt zehn Formulierungen («mach eine Einheit
  zu 2.1.2», «3er-Set wie früher», «Heft mit Medien-Spur» …) und sagt je
  Formulierung, welche der beiden Skill-Beschreibungen passt. No fixes.

## HAIKU — mechanical worker

"Haiku agents handle bounded mechanical reads and transforms. Exact brief,
compact return, no recursive delegation."

"Subagent returns come back as extracted key numbers and paths, never raw dumps."

Suitable work here:

- Schlüsselmengen zweier JSON-Dateien vergleichen (Gold gegen Probe, Gold gegen
  Template) und die Differenz liefern.
- Tote Verweise in der neuen Skill finden: jede genannte Datei, jedes Skript,
  jeder Skill-Name existiert.
- `grep` auf «ß», Platzhalter, «Woche», «Lektion», «Pflichtquelle», «Mindmap»
  in den erzeugten Daten und in der Skill.
- Zeichen je Feld zählen, wenn ein Budget-Befund zu belegen ist.
- Liste aller Quellen-URLs der Probe-Einheit mit HTTP-Status.

Haiku meldet bei grossen Schreibmengen gelegentlich Erfolg, ohne fertig zu
sein: nur Lesen und Zählen, und das Ergebnis mit einer messbaren Bedingung
gegenprüfen.

---

## Suggested build order

Abhängigkeiten, kein Zeitplan:

1. **Branch und Nullmessung.** `v42-skill` anlegen; alle Gates einmal auf dem
   Ausgangsstand laufen lassen und die Ausgabe festhalten. Was vorher rot war,
   ist nicht dein Befund.
2. **Die unumkehrbaren Entscheide** (du): Name und Trigger beider Skills,
   Ableitungsregeln für Ordnername, Kurzlink und Quellen-IDs, Probe-Einheit.
   Als E20 ff. in `ENTSCHEIDE.md`. Vorher schreibt niemand Skill-Text.
3. **Regel-Inventar der alten Skill** (Sonnet-Fan-out) und daraus der Bauplan
   der neuen: Phasen, Stopps, Auto-Regeln. Der Pipeline-Review Abschnitt C
   nennt, was nicht mitkommen darf.
4. **Gerüst der neuen Skill:** `SKILL.md` mit Phasenfolge und Schema-Regeln,
   kopierte References, Templates aus der Gold-Einheit abgeleitet. Danach der
   Feld-Abgleich — er muss leer sein, bevor Phasen geschrieben werden.
5. **Phasen in Abhängigkeitsfolge**, je ein Executor: Prinzip mit Verteilung
   (KN-Kriterien, Pol-Typen, Modi des Auftrags) → KN → Heft-Kern → Quellenwahl
   und Spuren → Abschluss mit Glossar, Begriffsnetz, Beispielbild → Lösungen
   für alle Felder → Set mit gemeinsamem Auftrag und `heft_bezug` → Begleiter.
   Quellenwahl **vor** LF3 und den Vertiefungsfragen, Lösungen **mit** der
   Frage, nicht danach.
6. **Auto-Modus und Bauplan-Vorlage v4.2** — hängen davon ab, dass die Phasen
   stehen und ihre Entscheide benannt sind.
7. **Rückwärtsprobe:** Die Skill erzeugt aus einem Bauplan für 1.3.1 in einen
   Wegwerf-Ordner; Schlüsselmengen gegen die Gold-Einheit, `check-all` grün.
   Der Wegwerf-Ordner wird nicht committet.
8. **Probe-Einheit:** Bauplan, lokale Quellensuche, Erzeugung durch einen
   Executor, Gates. Braucht sie eine der zwei geöffneten Renderer-Stellen:
   erst die Verallgemeinerung (ein eigener Executor, Gold-Vergleich vorher und
   nachher), dann die Einheit. Jeder Befund geht zurück in die Skill (Schritt 5 oder 6),
   dann neu erzeugen — bis ohne Handkorrektur grün.
9. **Anschluss:** `docs/cloud-run/RUN.md` ruft die neue Skill; `CLAUDE.md`
   nennt beide Skills und welche Standard ist. Erst jetzt, weil der Name und
   das Verhalten vorher noch wandern.
10. Ganze Skill von dir am Stück gelesen, dann Blindleser und Lösungs-Audit auf
    der Probe-Einheit, Trigger-Probe, alle Gates, Schlussbericht
    `docs/upgrade-v4.2/BERICHT-skill.md`: was die Skill kann, was sie nicht
    kann, welche Entscheide Pietro noch treffen muss.

## Explicitly out of scope

Nicht anfassen; gehört in eine spätere Phase oder eine andere Session:

- **Alte Skills:** `.claude/skills/bbw-hko-3er-set/` (bytegleich),
  `.claude/skills/hko-2er-EBA-set-generator/`, `.claude/skills/hko-ki-komplement/`.
  EBA in v4.2 und die KI-Toolbox für v4.2-Einheiten sind eigene Vorhaben.
- **Renderer, Typen, Skripte:** `src/lib/einheiten/`, `src/components/einheiten/`,
  `src/styles/v42/`, `scripts/`. Auch keine «kleinen» Verbesserungen an
  `check-v42.mjs`.
- **Bestehende Einheiten** unter `src/data/einheiten/` — keine Migration auf
  v4.2, keine Korrektur, auch nicht an der Gold-Einheit.
- **Präsentation und Werkstatt für v4.2** (`src/lib/einheiten/deck-builder.ts`,
  `src/lib/werkstatt/`), Feedback-Formular
  (`src/pages/einheiten/[setKey]/feedback.astro`), Katalogkarte
  (`src/components/einheiten/EinheitCard.astro`).
- **Cloud-Lauf-Gerüst** ausser den zwei genannten Dateien:
  `scripts/cloud-*.mjs`, `docs/cloud-run/README.md`, `START.md`, `HANDOFF.md`,
  `auftragsliste.md`. Kein Cloud-Lauf, kein Spiegel-Push.
- **Publizieren:** kein `status`-Wechsel, kein Merge, kein Deploy. Die
  Probe-Einheit und die Gold-Einheit bleiben Entwurf.
- **Offene Punkte der Gold-Einheit** aus `BERICHT.md` §5–§7 (Freigabe der
  Quellen, Audio A1, Druckprobe, QR mit Handy) — Pietros Abnahme, nicht dein
  Auftrag.
- `supabase/`, `public/nrlp_*.json`, `src/pages/admin/`, `renderer/`,
  `begleiter/`, `docs/medien-plus/`, `docs/ORCHESTRATION.md` (der Brief der
  Gold-Phase, bleibt als Beleg stehen).
- Alles ausserhalb von `D:\OS\dev\bbw-hko` ausser dem Schreiben ins
  Quellenarchiv `D:\OS\_lab\quellen-archiv\bbw-hko\`. Die OneDrive-Kopie der
  Skill und `D:\OS\pendenzen.yaml` macht Pietro bzw. die Wurzel-Session.
