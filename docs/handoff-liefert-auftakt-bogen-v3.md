# Orchestration-Brief — Bogen-Kopplung: `liefert` · `template`-v3 · `auftakt`

Diesen Text als **Eröffnungsanweisung** einer Claude-Code-Session einfügen.
Arbeitsverzeichnis: `D:\OneDrive - bbw.ch\+GIT\+ORGs\bbw-hko`

Die Rollen-Policy weiter unten enthält wörtlich fixierte englische Zeilen. Die
sind Vertrag und werden **nicht** übersetzt oder umformuliert. Alles drum herum
ist projektspezifisch und deutsch.

---

## Mission

Der Herausforderungs-Bogen (`DocS`) hat zwei Anweisungsflächen, die nichts
voneinander wissen: Seite 2 sagt «beantworte vier Leitfragen mit dem
Lehrmittel», Seite 4 sagt «baue dieses Produkt in fünf Schritten». Die
Verbindung dazwischen steht nirgends — die Lernenden erfahren auf Seite 4, was
sie auf Seite 2 hätten wissen müssen. Wir koppeln die beiden Flächen über zwei
additive Datenfelder und einen Layoutschalter.

**Das ist Renderer- und Datenarbeit, kein Redesign.** Es wird kein Bogen neu
gestaltet, keine Didaktik geändert, kein Inhalt neu geschrieben. Drei Felder,
zwei Renderer, eine Einheit.

Erprobt wird ausschliesslich an **`5.4.2_internationale_entscheide_wirken_4j`**
(steht bereits auf `status: "entwurf"`, also KT1-only). Die 27 publizierten
Herausforderungs-Dateien müssen **byte-identisch** rendern wie heute.

Release-Ziel: **heute, 2026-08-31**, als vorzeigbarer KT1-Entwurf. Bewusst
danach: die Migration publizierter Einheiten auf v3,
`handlungsprodukt.schritte[].nutzt_lf` (Rückrichtung LF←Schritt), und das Deck
(`deck-builder.ts`).

## Stand des Repos

Fertig — nicht neu machen:

- **5.4.2 ist im Index und für KT1 sichtbar.** `set.json` trägt
  `status: "entwurf"`; `einheiten.index.json` hat 11 Einträge,
  `5.4.2_internationale_entscheide_wirken_4j` ist einer davon. Der
  Entwurfs-Mechanismus (`visibleEinheiten`, gelbes Badge) läuft, daran ist
  nichts zu bauen. Der Ordner ist in git **untracked** (`??`).
- **`leitfragen_intro` ist in allen drei 5.4.2-Herausforderungen ausgeschrieben**
  (A 406 · B 381 · C 456 Zeichen, alle Sie-Form, Lehrmittel-Schlusssatz
  erhalten). A ist eine Vorbereitungs-Anweisung, B eine Abhängigkeitskette, C
  eine Kontextsetzung. Nicht anfassen, ausser der `auftakt`-Schritt verlangt es.
- **`docx-builder.ts` rendert `leitfragen_intro` bereits** (Zeilen 753 und 777,
  zwei Grössenvarianten). Der Word-Pfad ist an dieser Stelle nicht defekt.
- **`template` ist ein totes Feld.** Alle 30 `herausforderung_*.json` schreiben
  `"default_4page_v2"`; ein `grep` über `src/components/einheiten/docs/` und
  `src/lib/einheiten/` findet **keinen einzigen Leser**. Das ist der Schalter,
  den wir benutzen — er muss nicht erfunden werden.

Massgebliche Eingaben, in dieser Rangfolge:

| Pfad | Was es ist |
|---|---|
| Dieser Brief | Entschieden. Gilt. |
| `src/data/einheiten/5.4.2_internationale_entscheide_wirken_4j/` | Die einzige Einheit, an der Daten geändert werden dürfen. |
| `src/data/einheiten/3.2.1_ernaehrung_nachhaltig_gestalten/` | **Nur lesen.** Referenz für Ton und Länge von `leitfragen_intro`. |
| `src/components/einheiten/docs/DocS.tsx` | Der Schülerbogen. Seitenfolge in `DocSFill` (Z. 662–719), `lf-meta` in `LeitfrageItem` (Z. 181–184), Seite 1 in `CockpitPageBody` (Z. 573). |
| `src/lib/einheiten/docx-builder.ts` | Der Word-Pfad. Muss `DocS` spiegeln. |
| `.claude/skills/bbw-hko-3er-set/` | Der Generator. Wird **zuletzt** angefasst. |
| `CLAUDE.md` | Architektur, Befehle, Konventionen. |

## Nicht verhandelbare Invarianten

Bei jeder Übernahme in den Arbeitsbaum durchsetzen. Ein Verstoss ist ein Defekt,
unabhängig davon, wie gut die Arbeit sonst ist.

1. **Die 27 publizierten Herausforderungs-Dateien rendern unverändert.**
   Sie behalten `template: "default_4page_v2"`, bekommen weder `liefert` noch
   `auftakt`, und der v2-Renderpfad bleibt im Code, bis die letzte Einheit
   migriert ist. Lehrpersonen haben ZIP-Bundles heruntergeladen und Hefte
   gedruckt; ändert sich das Layout mitten im Schuljahr, stimmt das Heft im
   Klassenzimmer nicht mehr mit der Plattform überein. Das ist nicht rückholbar.

2. **Feldnamen und der v3-Token sind einmal zu vergeben.** `liefert`,
   `auftakt` bzw. `auftakt_typ`, `"default_4page_v3"`. Sobald sie in Daten,
   Renderer **und** Skill stehen, ist Umbenennen eine Migration über jede
   Einheit und jede künftig generierte dazu. Fable entscheidet die Namen, bevor
   die erste Zeile geschrieben wird — siehe «Fable besitzt persönlich».

3. **Sichtbarkeit und Layoutversion bleiben getrennte Achsen.**
   `status: "entwurf"` (in `set.json`) steuert **wer** eine Einheit sieht,
   `template` (in `herausforderung_*.json`) steuert **wie** sie rendert. Das
   Layout darf **nie** an `status` gekoppelt werden — sonst kippt der Bogen bei
   der Freigabe zurück auf v2 und wir liefern etwas anderes aus, als wir
   geprüft haben.

4. **Was `DocS` rendert, rendert `docx-builder` auch.** Beide Pfade lesen
   denselben `template`-Wert und zeigen dieselben Felder. Die Word-Datei ist
   die, die im ZIP landet und gedruckt wird; eine Abweichung fällt erst im
   Klassenzimmer auf.

5. **Seite 2 hat ein hartes Zeichenlimit.** `.a4-page` trägt
   `overflow: hidden` — zu viel Text wird **still abgeschnitten**, ohne Fehler.
   `leitfragen_intro` bei 510 Zeichen liess ~34 px Reserve. Jede Ergänzung auf
   Seite 2 wird am gerenderten Bogen gegengeprüft, nicht geschätzt.

6. **Scope-Zaun.** Nichts unter `src/data/einheiten/` ausser
   `5.4.2_internationale_entscheide_wirken_4j/` ändern, und keine Datei aus der
   Out-of-Scope-Liste am Ende. Lässt sich eine Aufgabe innerhalb des Zauns
   ehrlich nicht lösen: **anhalten und eskalieren**, nicht den Zaun erweitern.

7. **Sprache und Register.** Deutsch, Schweizer Hochdeutsch, **kein ß**.
   Schülertexte in Sie-Form (`leitfragen_intro`, `leitfragen[].text`,
   `handlungsprodukt.schritte[].hint`); `liefert`-Strings sind knapp und
   nominal, 3–7 Wörter, ohne Verb («die Spalte «Ich höre»», nicht «Sie
   erarbeiten die Spalte «Ich höre»»). Generische Rollennomen in
   Schrägstrich-Form (`Berufsbildner/in`). Details in
   `.claude/skills/bbw-hko-3er-set/references/language-rules.md`.

## Verifikationsschranken

Nichts ist «fertig», bevor das vom Repo-Root durchläuft:

```
npm run build
```

`prebuild` hängt daran und ist die eigentliche Schranke: `check:nrlp` →
`build:sk-labels` → `sync:einheiten-nrlp` → `build:einheiten-index` →
`build:umsetzungsbeispiele-nrlp` → `sync:nrlp-indexes`. `sync:einheiten-nrlp`
prüft unter anderem die Lehrgang-Zulässigkeit und bricht ab, wenn eine Einheit
unter einer Nummer läuft, die im zweiten Datensatz etwas anderes bedeutet.

`src/data/einheiten.index.json` ist **generiert** — nie von Hand editieren.
Weder `template` noch `liefert` noch `auftakt` stehen im Index; ein Rebuild ist
für diese Arbeit nicht nötig, schadet aber nicht.

Dazu die Regressionsprüfung, die kein Befehl abdeckt — die 27 publizierten
Dateien müssen unberührt sein. Als Skript nach
`scripts/check-bogen-v2-regression.mjs` legen und mit `node` laufen lassen:

```js
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = 'src/data/einheiten'
const files = readdirSync(ROOT, { withFileTypes: true })
  .filter(d => d.isDirectory() && !d.name.startsWith('5.4.2_internationale'))
  .flatMap(d => readdirSync(join(ROOT, d.name))
    .filter(f => /^herausforderung_.*\.json$/.test(f))
    .map(f => join(ROOT, d.name, f)))

const bad = files.filter(f => {
  const raw = readFileSync(f, 'utf8')
  return JSON.parse(raw).template !== 'default_4page_v2'
    || raw.includes('"liefert"') || raw.includes('"auftakt')
})

console.log(bad.length ? `VERLETZT: ${bad.join(', ')}`
  : `OK — ${files.length} publizierte Dateien unberuehrt`)
```

(Kein `globSync` — das gibt es in `node:fs` erst ab Node 22, dieses Repo läuft
auf Node 20.)

Erwartete Ausgabe: `OK — 27 publizierte Dateien unberuehrt`. Weicht die Zahl ab,
ist eine Einheit dazugekommen oder verschwunden — das ist selbst ein Befund.
(Wird stattdessen `python` benutzt: auf dieser Maschine heisst der Befehl
`python`, nicht `python3`.)

---

# Rollen-Policy

## FABLE 5 — Orchestrator, Hauptsession, hoher Effort

"Fable owns the main session, requirements, judgment, integration, and final
verification."

"Fable does not inline-execute large builds. For a bounded, difficult
implementation, Fable writes the spec, dispatches an Opus 5 executor subagent,
and verifies the result. Fable stays at requirements, judgment, and
integration; an executor converging fast on an approved spec is the desired
behavior, not a defect."

"Brief only the exact delta, scope, output, stopping condition, and exclusions."

Fable besitzt persönlich und delegiert nicht:

- **Die endgültigen Feldnamen** (`liefert`, `auftakt` vs. `auftakt_typ`) und den
  Token `"default_4page_v3"`. Ein delegierter Fehlgriff ist dauerhaft
  (Invariante 2).
- **Die Form von `auftakt` — noch offen.** Zwei Varianten stehen zur Wahl:
  (a) ein typisiertes Objekt `{typ, vorlauf, text, lf_bezug}`, das
  `leitfragen_intro` ergänzt; (b) sparsamer, ein Geschwisterfeld
  `auftakt_typ: "vorbereitung" | "kontext" | "pfad"` neben dem bestehenden
  String, das nur die Kastenbeschriftung steuert und die fünf bereits
  ausgeschriebenen Intros unverändert lässt. Fable entscheidet das **erst,
  nachdem der Nutzer den gerenderten 5.4.2-Bogen gesehen hat**.
- **Die Vorlage der Checklisten-Frage an den Nutzer.** Die Verschiebung der
  «Checkliste Vollständigkeit» von Seite 1 auf die Selbstcheck-Seite wird hinter
  dem v3-Schalter **gebaut**, ist aber **nicht entschieden**. Der Nutzer hat
  ausdrücklich gesagt: erst nach Ansicht des gerenderten Bogens. Fable zeigt
  beide Varianten und fragt — und stellt keine publizierte Einheit auf v3.
- **Das Skill-Amendment** in `.claude/skills/bbw-hko-3er-set/`. Was dort
  hineingeht, gilt für jede künftig generierte Einheit.
- Der abschliessende Verifikationsdurchgang vor der Übergabe.

Fable eskaliert an den Nutzer statt allein zu entscheiden, wenn: eine Aufgabe
sich nur durch Anfassen einer publizierten Einheit lösen lässt; ein `liefert`
für einen Produktschritt keinen Absender in den vier Leitfragen findet (das ist
eine didaktische Lücke, keine Formulierungsfrage); der Bogen auf Seite 2
überläuft; oder `npm run build` an einer Stelle bricht, die nicht zu dieser
Arbeit gehört.

## OPUS 5 — Executor

In jeden Executor-Prompt einspeisen:

"Deliver the requested scope and stop before unasked work."

"Correct an immaterial slip silently. Call it out only when it changes a
number, conclusion, or decision."

"Do not replace grounding or fresh retrieval with confidence or self-review."
Zulässige Quellen sind ausschliesslich die Dateien unter
`src/data/einheiten/5.4.2_internationale_entscheide_wirken_4j/`, die beiden
Renderer, und `3.2.1_ernaehrung_nachhaltig_gestalten/` als Lesereferenz. Kein
`liefert`-String, keine Bogenzeile und keine Kapitelangabe wird aus
Allgemeinwissen über ABU, den nRLP oder das Lehrmittel geschrieben — jede
Aussage steht in einer dieser Dateien oder sie wird nicht geschrieben.

Ein Opus-Executor pro abgegrenzter, schwieriger Arbeitseinheit:

- **E1 — `liefert` rendern.** `lf-meta` in `DocS.tsx` um ein drittes Element
  neben Bloom-Badge und `knoten_ref` erweitern, plus die Entsprechung in
  `docx-builder.ts`. Zwei Dateien, die einander spiegeln müssen, ein Feld,
  bedingungslos additiv.
- **E2 — `template`-Schalter.** Den toten `template`-Wert zum Leser machen
  (`const v3 = sit.template === 'default_4page_v3'`), die Checkliste unter v3
  auf die Selbstcheck-Seite verschieben, v2 unverändert lassen; in beiden
  Renderern. Eine Migrationsstufe, die den Baum grün lässt.
- **E3 — `auftakt` rendern**, nach Fables Formentscheid. Kasten auf Seite 1 nur
  bei `typ: "vorbereitung"`, sonst nichts auf Seite 1.
- **E4 — Skill-Amendment.** `leitfragen_intro` in `json-field-mapping.md` aus
  §5 «Default-Werte zum Auffüllen» herauslösen, `liefert` als Pflichtfeld in
  `SKILL.md` Phase 2 verankern, den Kopplungs-Check in `coherence-checklist.md`
  ergänzen, `assets/mission-template.json` nachziehen.

Executor-Brief-Vorlage:

```
[Ein-Zeilen-Imperativ, z. B. «Erweitere lf-meta in DocS.tsx um das Feld liefert.»]

Spec:      docs/handoff-liefert-auftakt-bogen-v3.md § [Abschnitt]
Sources:   [die exakten Dateien, die diese Aufgabe lesen darf]
Pattern:   [nächstliegendes Vorbild im Repo — für additive Optional-Felder:
           wie `methoden` und `handlungsprodukt.abgaben[]` behandelt werden]
Budget:    [Grössendeckel — z. B. «eine Zeile in lf-meta, keine neue Komponente»]

Must hold: Invarianten 1, 4, 6 [+ die weiteren, die wirklich greifen —
           nie die ganze Liste].

Out of scope: [namentlich die Dateien und Themen, die unangetastet bleiben]

Done when: `npm run build` läuft durch UND die Regressionsprüfung meldet
           «OK — 27 publizierte Dateien unberuehrt».
Return:    Geänderte Dateien mit Zeilennummern · was NICHT belegt werden konnte ·
           jede Stelle, an der du den Zaun berühren wolltest.
```

## SONNET 5 — Fan-out-Worker

"Dispatch it freely for fan-out that needs per-item judgment: blind reader
panels, audits, workspace sweeps. Give it an exact brief, defined output, and a
stopping condition."

"Complete the exact requested deliverable and stop. Do not audit the
surrounding system, surface adjacent issues, or recommend extra improvements."

"Diagnose or report does not authorize a fix. A one-file request does not
authorize related changes."

"Do not create or delegate to subagents."

Natürlicher Fan-out — ein Worker pro Herausforderung, parallel:

- **Kopplungs-Audit (nur lesen, keine Änderungen).** Ein Worker liest **eine**
  `herausforderung_*.json` und legt `leitfragen[]` gegen
  `handlungsprodukt.schritte[]` und `abgaben[]`. Rückgabe: pro LF ein
  `liefert`-Vorschlag (3–7 Wörter, nominal) plus die Schritt-Nummern, die er
  speist; **plus** die Liste der Produktschritte, die von **keiner** LF bedient
  werden. Keine Fixes. Der zweite Teil ist der wertvollere: er findet
  Konstruktionslücken, keine Formulierungsmängel.
- **Regressions-Sichtprüfung.** Ein Worker pro publizierter Stichprobeneinheit:
  HTML des Bogens vor und nach der Änderung erzeugen und vergleichen. Erwartung
  ist Identität. Meldet Abweichung, behebt sie nicht.
- **Register-Durchsicht** der neuen `liefert`-Strings gegen
  `references/language-rules.md`: Sie-Form-Kontext, kein ß, nominale Kürze,
  Schrägstrich-Rollennomen. Nur melden.

Vorarbeit, die schon existiert: für 5.4.2 A/B/C und
`1.1.1_konflikt_kommunizieren` A/B/C liegen 24 `liefert`-Entwürfe aus der
Vorsession bereit. Der Audit bestätigt oder korrigiert sie, er beginnt nicht bei
null. Bekannte Funde: 5.4.2 A ist unbalanciert (LF3 trägt S2+S3+S4 allein),
5.4.2 B lässt LF2 in der Luft hängen, 5.4.2 C ist eine saubere 1:1-Kopplung und
dient als Vorbild.

## HAIKU — mechanischer Worker

"Haiku agents handle bounded mechanical reads and transforms. Exact brief,
compact return, no recursive delegation."

"Subagent returns come back as extracted key numbers and paths, never raw dumps."

Passende Arbeit hier:

- Zählen: welche `herausforderung_*.json` welchen `template`-Wert tragen, welche
  `methoden` führen, wie viele `schritte` und `abgaben` je Datei.
- Zeichenlängen von `leitfragen_intro` über alle Einheiten (Limit 510).
- Nach Rückständen greppen: `liefert` oder `auftakt` in einer Datei ausserhalb
  von 5.4.2; ein `template`-Wert ausserhalb der zwei erlaubten.
- Auflisten, was in `DocS.tsx` gerendert wird, aber in `docx-builder.ts` fehlt.

---

## Baureihenfolge

Der Abhängigkeitsgraph, kein Terminplan:

1. **Feldnamen und v3-Token festlegen** (Fable, Invariante 2). Blockiert alles
   Übrige.
2. **E1 — `liefert` rendern** (DocS + docx). Unabhängig von 3.
3. **Kopplungs-Audit für 5.4.2 A/B/C** (Sonnet ×3, parallel) → die 12
   `liefert`-Strings. Braucht 1, nicht 2. Läuft neben E1.
4. **E2 — `template`-Schalter + Checkliste dahinter.** Braucht 1.
5. **5.4.2 auf v3 stellen, Bogen rendern, dem Nutzer vorlegen.** Braucht 2, 3, 4.
   Hier stellt Fable die Checklisten-Frage — mit beiden gerenderten Varianten
   nebeneinander, nicht als Beschreibung.
6. **`auftakt`-Form entscheiden (Fable), dann E3.** Braucht 5: der Nutzer soll
   den Bogen gesehen haben, bevor die Form festgelegt wird.
7. **E4 — Skill-Amendment.** Braucht 1 und 6, weil erst dann alle Namen stehen.
8. **Regression + `npm run build`**, dann Fables Durchsicht des ganzen Bogens von
   Seite 1 bis Selbstcheck, dann Übergabe.

## Ausdrücklich ausserhalb des Zauns

Nicht anfassen — spätere Phase oder andere Session:

- `src/data/einheiten/` **ausser** `5.4.2_internationale_entscheide_wirken_4j/`.
  Namentlich auch `3.2.1_ernaehrung_nachhaltig_gestalten/`, das nur gelesen wird.
- `src/lib/einheiten/deck-builder.ts` — das LP-Deck bekommt `liefert` später.
- `scripts/build-einheiten-index.mjs` und `src/data/einheiten.index.json` —
  keines der neuen Felder steht im Index.
- `src/components/einheiten/docs/DocKnS.tsx`, `DocKnLp.tsx`, `DocKi.tsx`,
  `DocLernprompt.tsx`, `DocLernbegleiter.tsx`, `DocAustausch.tsx`,
  `DocEbaDossier.tsx` — nur `DocS` ist betroffen.
- `src/components/einheiten/EinheitWorkbench.tsx` und der ZIP-Export.
- Das Methoden-System (`src/data/methoden/`, `docs/methodenkartei.md`) und die
  Werkzeugseite «05 · Methoden». `handlungsprodukt.schritte[].nutzt_lf`
  (Rückrichtung) ist bewusst zurückgestellt.
- `renderer/` und `begleiter/` — Alt-Ordner, vom Astro-App nicht bedient.
- Die Skills `hko-2er-EBA-set-generator` und `hko-ki-komplement`.
- Situationen- und Materialien-Workflow vollständig, `public/nrlp*`, alles unter
  `src/pages/admin/`.
