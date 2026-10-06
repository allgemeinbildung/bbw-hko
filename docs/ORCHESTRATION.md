# Orchestration brief — Gold-Version 1.3.1 «Konsum verantworten» v4.2

Füge dies als Eröffnungsanweisung der Claude-Code-Session ein, die die
Gold-Version baut. Arbeitsverzeichnis: `D:\OS\dev\bbw-hko`.

Stand des Briefs: 01.10.2026, HEAD `4ed2bee`.

---

## Ziel

**Am Ende existiert die Einheit 1.3.1 (EFZ 4J) in zwei vollständigen Fassungen:
eine traditionelle (Spur «ohne Medien»: Methoden + Scaffolding) und eine mit
integrierten Medien (Spur «mit Medien»).** Beide sind auf der Plattform als
Entwurf sichtbar, als HTML und Word exportierbar und ohne offene Platzhalter.

Du arbeitest **ohne Rückfrage**. Pietro ist vom 02. bis 18.10.2026 abwesend.
Wo der Leitfaden schweigt, entscheidest du nach den Regeln unten und hältst den
Entscheid in `docs/upgrade-v4.2/ENTSCHEIDE.md` fest (Entscheid, Grund,
Alternative, wie rückgängig zu machen).

## Mission

Gebaut wird eine **Referenz-Einheit samt der Plattform-Teile, die sie braucht**
— zu gleichen Teilen Inhaltsarbeit und Renderer-Arbeit. Es ist **kein**
Generator, **keine** Migration des Bestands und **kein** Redesign der Plattform.
Jeder Code, der entsteht, ist additiv: Er wird nur aktiv, wenn eine
Herausforderung `template: "heft_8page_v42"` trägt. Der Inhalt der Einheit ist
zu etwa 90 % geschrieben (Paket v4.2); offen sind die Quellen und alles, was von
ihnen abhängt.

Die Subagenten bauen die neuen Komponenten (Spur-Auflösung, Raster-Antwortfeld,
Quellenkartei, QR, Landing-Seite, Feedback-Kriterien, Abschluss, Auftragsbogen,
Prüfskript). Du hältst Vertrag, Urteil, Integration und Schlussprüfung.

Release-Ziel: **lokaler Branch, fertig bei Pietros Rückkehr am 19.10.2026.**
Bewusst später: Generator-Skill, Orchestrator für die Serienproduktion,
Migration der übrigen zehn Einheiten, EBA, KI-Toolbox für die neue Einheit,
periodische Link-Prüfung, Deploy.

## State of the repo

Bereits vorhanden — nicht neu bauen:

- Die Plattform läuft produktiv (`bbw-hko.ch`, Vercel, Deploy bei Push auf
  `main`). Elf Einheiten unter `src/data/einheiten/`, davon sechs publiziert.
- `src/data/einheiten/1.3.1_konsum_verantworten/` ist die **publizierte**
  3er-Einheit. Sie bleibt, wie sie ist.
- Eine EFZ-Einheit mit nur A und B rendert bereits (`1.1.1_einstieg_interview`).
  Alle A/B/C-Schleifen überspringen fehlende Herausforderungen. Die Anzahl ist
  ein Datenfall, kein Umbau.
- Methodenkartei mit zweistufiger Auflösung (`src/lib/einheiten/methoden.ts`,
  `withMethoden` in `src/lib/einheiten/index.ts`) — **das Muster für die
  Quellenkartei und die Spur-Auflösung.**
- Tabellen- und Schreibfeld-Bausteine für Word in
  `src/lib/einheiten/docx-primitives.ts`.
- Recherche-Vorräte, bereits geprüft: `docs/medien-plus/pilot/1.3.1_konsum_verantworten.md`
  (18 Einträge mit URN) und `D:\OS\_lab\themendossiers\schulden\` (52 Quellen
  mit Transkript, Facetten «Budget und erster Lohn», «Kaufen auf Pump»).
- Swissdox-Login war am 01.10.2026 gültig.

Im Arbeitsbaum liegen **uncommittete Änderungen unbekannter Herkunft**
(01.10.2026, 17:01): `methoden` in `1.2.2_*` und `1.3.1_*`, elf neue Karten in
`src/data/methoden/`, `src/pages/admin/katalog.astro`, beide Indexe. Das
Paket v4.2 verweist auf Karten aus diesem Stand (`hko-bedarf-oder-wunsch`,
`lm-2-2-budget`). Behandle ihn als Ausgangslage: erster Commit auf dem
Arbeitsbranch, unverändert, Nachricht «Vorbestand 01.10.2026 (ungeprüft
übernommen)». Nicht nachbessern.

Defekt und bekannt: `npm run build:deck` (Import ohne `.ts` in
`deck-builder.ts:18`), `node scripts/sync-einheiten-nrlp.mjs --check` (rot wegen
EBA), `node scripts/check-bogen-v2-regression.mjs` (rot seit `4ed2bee`). Nicht
dein Auftrag; nicht als Gate verwenden.

Massgebliche Vorgaben, in dieser Rangfolge:

| Pfad | Was es ist |
|---|---|
| `docs/upgrade-v4.2/01_Leitfaden_v4.2.md` | **Entschieden. Befolgen.** Seitenplan §3 mit Minuten- und Zeichenbudget, Spuren §4, Quellen §5, gemeinsamer Auftrag §7, Datenmodell §11, Prüfregeln §11.5. |
| `docs/upgrade-v4.2/daten/einheit_EFZ_1.3.1/` | **Referenzdaten.** `herausforderung_A.json`, `herausforderung_B.json`, `set.json` vollständig; `prinzip.delta.json` ist auf das bestehende `prinzip.json` zu legen. Texte gelten; ändern nur bei Budget-Überlauf, Sachfehler oder Regelverstoss. |
| `docs/upgrade-v4.2/daten/quellen/` und `/methoden/` | Quellenkarten (nur Platzhalter, zu füllen) und zwei neue Methodenkarten (freigegeben). |
| `src/lib/einheiten/types.ts` | Verbindliche Feldnamen. Neue Felder nur gemäss Leitfaden §11, alle optional. |
| `src/data/einheiten/1.3.1_konsum_verantworten/kn.json` | KN, **unverändert übernehmen.** Quelle für Wortlaut und Stufen der Feedback-Kriterien. |
| `docs/pipeline-review-2026-10-01.md` | Bekannte Lücken der Pipeline. Nachschlagen, nicht abarbeiten. |
| `docs/methodenkartei.md` | Regeln der Methodenseite (vier Karten, genau zwei mit Beispiel). |
| `CLAUDE.md` | Architektur, Befehle, Konventionen, Design-Regeln. |

Entscheide von Pietro zu den offenen Punkten in Leitfaden §14 (stehen nicht in
der Datei):

1. Dritte Kategorie «geweckt, aber berechtigt» in Heft A: **bleibt.**
2. Lehrmittel-Seite für LF3 ohne Medien in Heft A: **du entscheidest** — am
   lokalen Text `material/_lehrmittel/2.7_Preisbildung.md` (Marker
   `[seite: NN]`) verifizieren. Trägt 2.7 den Abschnitt nicht, nimm das
   passendste Kapitel aus der Crosswalk-Zeile und halte es in `ENTSCHEIDE.md` fest.
3. Methodenkarten `hko-quelle-raster` und `hko-grafik-lesen`: **freigegeben.**
4. Sprachnachricht im gemeinsamen Auftrag: **Audiodatei direkt an die
   Lehrperson.** Kein Upload, keine Ablage auf der Plattform.

## Non-negotiable invariants

Bei jeder Übernahme in den Arbeitsbaum durchsetzen. Ein Verstoss ist ein Defekt,
egal wie gut die Arbeit ist.

1. **Kein Push, kein Deploy, kein Merge nach `main`.** `main` ist Produktion;
   ein Push veröffentlicht sofort für alle Lehrpersonen. Arbeite auf dem Branch
   `v42-gold-1.3.1`, committe dort, pushe nichts.
2. **Das Repo ist öffentlich (`allgemeinbildung/bbw-hko`).** Keine Transkripte,
   keine Artikeltexte, keine Lehrmittelpassagen ins Repo — auch nicht in
   Lösungen, Kommentare oder Testdateien. In die Daten gehören Titel, Link,
   Verortung, eigener Kurzbeschrieb und eigene Stichwort-Lösungen. Volltexte
   liegen in `D:\OS\_lab\quellen-archiv\bbw-hko\<quellen-id>\`. Einmal
   committet, ist ein Text in der Historie und nicht mehr zurückzuholen.
3. **Keine erfundenen Quellen.** Jede Quellenkarte verweist auf einen Beitrag,
   der in dieser Session abgerufen und geprüft wurde (SRF: URN über
   `media_composition` bestätigt, Titel und Datum stimmen; Web: Seite geladen,
   frei zugänglich, Länge gemessen). Titel, Datum, Zahlen und Zitate nie aus dem
   Gedächtnis.
4. **Die publizierte Einheit `1.3.1_konsum_verantworten` und alle anderen
   Einheiten bleiben unangetastet**, und ihr Rendering bleibt gleich. Neuer
   Renderer-Code hängt an `template === "heft_8page_v42"`. Prüfe das am Ende
   mit einem Vorher-Nachher-Vergleich des HTML von zwei Bestandseinheiten.
5. **Die neue Einheit trägt `status: "entwurf"`** und bleibt es. Jeder andere
   Wert gilt im Index-Builder als publiziert.
6. **Kurzlink und IDs sind nach dem ersten Druck nicht mehr änderbar.** Die
   Landing-Seite liegt unter `/m/<Ordnername der Einheit>` mit Ankern `#a` und
   `#b`. Keine Kurzformen wie `131-a` (mehrdeutig, weil mehrere Einheiten
   dieselbe Kompetenz tragen). Quellen-IDs wie im Paket (`q-131a-pflicht` …).
7. **Kern identisch in beiden Spuren.** Situation, LF1, LF2, Produkt, Schritte,
   Abgaben, Feedback-Kriterien, Mindmap, Abschluss existieren genau einmal in
   den Daten. Nur `spuren.*` weicht ab. Wer einen Kerntext pro Spur dupliziert,
   hat die Zweispurigkeit zerstört.
8. **Feedback-Kriterien im Wortlaut des KN.** Name und vier Stufen wörtlich aus
   `kn.rubrik_shared`. Heft A und B je zwei (1 SuK + 1 Ges), zusammen alle vier;
   gemeinsamer Auftrag alle vier.
9. **Fall-Ausschluss:** kein Leasing, kein Konsumkredit, kein E-Bike, keine
   Mobilität in Heft A, Heft B, gemeinsamem Auftrag oder einer Quelle. Diese
   Gegenstände gehören dem KN.
10. **Zeichenbudgets aus Leitfaden §3.1 gelten hart.** `.a4-page` hat
    `overflow: hidden`: Überlauf wird still abgeschnitten. Keine Seite darf
    überlaufen, in keiner Spur.
11. **Scope-Zaun** — nicht verändern, ausser eine Aufgabe sagt es ausdrücklich:
    `src/data/einheiten/` ausser dem neuen Ordner, `src/data/methoden/` ausser
    den zwei neuen Karten, `.claude/skills/`, `supabase/`, `public/nrlp_*.json`,
    `src/pages/admin/`, `renderer/`, `begleiter/`,
    `src/pages/m/131-a.astro`, `docs/medien-plus/`. Geht eine Aufgabe innerhalb
    des Zauns wirklich nicht, hält der Executor an und meldet es dir; du
    entscheidest, dokumentierst und erweiterst den Zaun für genau diese Aufgabe.
12. **Sprache:** Schweizer Hochdeutsch, kein «ß», echte Umlaute, Situationen in
    Ich-Form, Aufträge in Sie-Form, Persona neutral («Lernende/r EFZ,
    1. Lehrjahr»). Design: ein Grün plus Schwarz/Weiss, keine neue Farbe
    (`CLAUDE.md`, Abschnitt Design system).

## Verification gates

Nichts ist «fertig», bevor dies vom Repo-Root grün läuft:

```
npm run build
node scripts/check-einheiten.mjs 1.3.1_konsum_verantworten_v42
node scripts/check-lf-loesung.mjs 1.3.1_konsum_verantworten_v42
node scripts/check-v42.mjs 1.3.1_konsum_verantworten_v42
```

`npm run build` führt über `prebuild` den Index-Bau aus und schreibt
`src/data/einheiten.index.json` und `public/nrlp/einheiten.index.json` — beide
nie von Hand editieren. `check-v42.mjs` existiert noch nicht; es entsteht in
diesem Auftrag und setzt die zehn Prüfregeln aus Leitfaden §11.5 sowie die
Zeichenbudgets aus §3.1 um. `check-einheiten` und `check-lf-loesung` arbeiten
auf den Rohdateien; passe sie so an, dass sie bei v4.2-Heften die Leitfragen aus
Kern und beiden Spuren prüfen. Die Einheit darf **nicht** in
`scripts/check-einheiten.baseline.json` landen.

Was kein Befehl abdeckt und du selbst prüfst:

- **Überlauf:** jede der 8 Seiten von Heft A und B in beiden Spuren und die
  4 Seiten des Auftragsbogens im Browser rendern (`preview_start`), pro Seite
  `scrollHeight <= clientHeight` messen und ein Bildschirmfoto ansehen.
- **Platzhalter:** `grep -rn "\[QUELLE SUCHEN\|\[URL\|\[JJJJ\|\[HERAUSGEBER\|verifizieren\]\|\[Beispiel aus"`
  über den neuen Ordner und `src/data/quellen/` liefert nichts.
- **Volltext-Leck:** kein Feld in den Daten enthält mehr als zwei
  zusammenhängende Sätze aus einer Quelle oder dem Lehrmittel.
- **Bestand unverändert:** Invariante 4.
- **Word:** jede erzeugte `.docx` öffnet sich, hat dieselbe Seitenfolge wie das
  HTML und enthält den QR-Code als eingebettetes Bild.

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

Fable entscheidet selbst und delegiert nicht:

- **Den Datenvertrag:** die Typ-Erweiterungen in `types.ts` gemäss Leitfaden
  §11 und die Semantik der Spur-Auflösung in `loadEinheit` (nach der Auflösung
  sieht jeder Renderer ein Heft mit vier `leitfragen`). Alles andere baut darauf.
- **Ordnername, IDs und Kurzlink** (Invariante 6). Der Ordner heisst
  `1.3.1_konsum_verantworten_v42`; die IDs in den Dateien entsprechend.
- **Die Quellenwahl.** Subagenten liefern pro Slot zwei bis drei geprüfte
  Kandidaten; du wählst Pflichtquelle, Ersatz und zwei Vertiefungen pro Heft
  und begründest die Wahl in `ENTSCHEIDE.md`.
- **Was ins öffentliche Repo darf** (Invariante 2) — jede Lösung zu LF3 und
  jede Quellenkarte liest du vor der Übernahme selbst.
- **Das Urteil über die Hefte:** Trägt jede Seite ihr Gewicht, passt ein Heft
  in 135 Minuten, liest sich die Medien-Spur als dieselbe Einheit wie die
  traditionelle und nicht als zweites Heft.
- Die Schlussprüfung vor der Übergabe.

Weil ohne Rückfrage gearbeitet wird, **entscheidet Fable auch dort, wo sonst
eskaliert würde**, nach diesen Regeln:

- *Leitfaden schweigt oder widerspricht sich:* die Lösung wählen, die den Kern
  identisch lässt und am wenigsten neue Felder braucht. Dokumentieren.
- *Keine Quelle erfüllt alle Vorgaben* (Typ, Länge, Sachlage, frei zugänglich):
  Reihenfolge der Zugeständnisse — erst Ausschnitt statt ganzer Beitrag, dann
  anderer Typ im selben Rezeptionsmodus, dann amtliche oder Fachstellen-Quelle
  (BFS, Schuldenberatung Schweiz, Budgetberatung, Konsumentenschutz), zuletzt
  ein älterer Beitrag mit geprüfter Sachlage. Nie erfinden, nie ein Fallmaterial
  als echte Quelle ausgeben.
- *Swissdox-Login abgelaufen:* nicht einloggen (braucht Pietro). Mit SRG-API,
  Websuche und den vorhandenen Vorräten weiterarbeiten; im Bericht vermerken.
- *Budget-Überlauf eines Referenztexts:* kürzen, Sinn halten, Änderung
  dokumentieren.

Fable **hält an und schreibt es in den Bericht**, statt zu handeln, nur wenn
ein Schritt einen Push, ein Löschen bestehender Dateien, eine Änderung an der
Datenbank oder an einer publizierten Einheit verlangen würde.

## OPUS 5 — executor

In jeden Executor-Prompt einfügen:

"Deliver the requested scope and stop before unasked work."

"Correct an immaterial slip silently. Call it out only when it changes a
number, conclusion, or decision."

"Do not replace grounding or fresh retrieval with confidence or self-review."
Zulässige Grundlagen für Inhalte sind ausschliesslich: die Referenzdaten in
`docs/upgrade-v4.2/daten/`, die Lehrmittelkapitel in `material/_lehrmittel/`
(nur lesen, nie zitieren über Stichworte hinaus), `public/nrlp_4j.json` für
Lehrplantexte, `kn.json` für Kriterien, und für quellenabhängige Lösungen der
Archivtext der freigegebenen Quelle unter `D:\OS\_lab\quellen-archiv\bbw-hko\`.
Fachaussagen, Zahlen, Seitenangaben und Rechtsstände nie aus Hintergrundwissen
schreiben. Was sich nicht belegen lässt, wird im Return als «nicht belegt»
gemeldet, nicht geglättet.

Ein Opus-Executor pro abgegrenzter, schwieriger Arbeit:

- **Ein Renderer-Baustein samt Word-Gegenstück**, Grösse «eine Komponente plus
  ihr Abschnitt in `docx-builder.ts`»:
  - Spur-Auflösung in `loadEinheit` + Quellenkartei-Resolver (Muster `methoden.ts`)
  - Heft v4.2, Seiten 1–4 (inkl. Raster als Antwortfeld, Quellenkarte, Kasten S. 4)
  - Heft v4.2, Seiten 5–8 (Feedback-Kriterien mit Spalte «Selbst», Methoden mit
    spurabhängiger Karte, Mindmap, Abschluss, Checkliste)
  - Auftragsbogen (neues Dokument, 4 Seiten, inkl. Glossar und Rückmeldung)
  - QR-Erzeugung (als npm-Abhängigkeit gebündelt, kein CDN; PNG für Word) +
    Landing-Seite `src/pages/m/[setKey].astro` (ohne Login, `noindex`, liest aus
    Daten, zeigt Pflicht, Ersatz und Vertiefungen pro Heft)
  - Spur-Umschalter in `EinheitWorkbench.tsx` + ZIP mit beiden Spuren
  - `scripts/check-v42.mjs` + Anpassung der zwei bestehenden Checks
- **Quellenabhängige Inhalte**, je Heft ein Auftrag: LF3-Lösung und
  Beispielwerte der Medien-Spur aus dem Archivtext; LF3 ohne Medien aus dem
  verifizierten Lehrmittel-Abschnitt.
- **`begleiter.md` der neuen Einheit**: aus dem bestehenden Begleiter abgeleitet,
  mit Lösungen pro Spur, Erwartungshorizont zu LF4, Einsatz der Spuren,
  Wochenplan 12 Lektionen, Quellen-Stand. Feldmarker `<!--hko:…-->` wie im Bestand.

Executor-Brief-Vorlage:

```
<Ein Satz im Imperativ, z. B.: Baue die Seiten 1–4 des Hefts v4.2 in DocS.tsx
und docx-builder.ts.>

Spec:      docs/upgrade-v4.2/01_Leitfaden_v4.2.md § <Abschnitt>; Typen in
           src/lib/einheiten/types.ts (Stand Commit <hash>)
Sources:   <genau die Dateien, die diese Aufgabe lesen darf>
Pattern:   <nächstes bestehendes Beispiel, z. B. MethodenGrid in DocS.tsx,
           withMethoden in index.ts, schreibfeld in docx-primitives.ts>
Budget:    <Obergrenze: Dateien, die angefasst werden dürfen; Zeichenbudgets
           §3.1 für Inhalte>

Must hold: <die 3–5 Invarianten, die hier greifen — z. B. 4 (nur bei
           template v42), 7 (Kern einmal), 10 (kein Überlauf), 12 (Sprache)>

Out of scope: <benannte Dateien und Anliegen, die tabu sind>

Done when: <beobachtbar: `npm run build` grün UND die Seiten rendern für
           Heft A in beiden Spuren ohne Überlauf / Skript liefert Exit 0>
Return:    geänderte Dateien; neue Felder oder Abweichungen vom Leitfaden;
           was NICHT belegt oder NICHT geprüft werden konnte; offene Risiken
           in höchstens fünf Zeilen.
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

Natürliches Fan-out für diesen Bau:

- **Quellensuche, ein Worker pro Slot** (8 Slots: je Heft Pflicht, Ersatz,
  zwei Vertiefungen). Vorgaben aus der Platzhalter-Karte in
  `docs/upgrade-v4.2/daten/quellen/` und Leitfaden §5 (Typ, Höchstlänge,
  Sachlage). Zuerst die Vorräte durchsehen (State of the repo), dann suchen mit
  den Skills `srgssr-api` und `swissdox-research` (Skripte unter
  `C:\Users\lp4prossi\.claude\skills\`), dann Websuche. Rückgabe: zwei bis drei
  Kandidaten mit URN oder URL, Datum, gemessener Länge, Verortung des
  Ausschnitts, Prüfnachweis, Ausschluss-Check (Invariante 9), Archivpfad des
  Volltexts ausserhalb des Repos. Swissdox **nacheinander**, nicht parallel
  (bekannte Ausfälle bei mehreren Browsern). Keine Karte schreiben.
- **Blindleser-Panel, ein Worker pro Heft und Spur** (4): liest das gerenderte
  Heft als Lernende/r im 1. Lehrjahr. Meldet, wo ein Auftrag unklar ist, ein
  Begriff unerklärt vorkommt, eine Seite auf eine andere angewiesen ist, die
  Zeit je Seite nicht reicht. Keine Korrekturen.
- **Kohärenz-Audit, ein Worker pro Heft** (2): Jedes Feedback-Kriterium hat
  einen Beleg im Produkt; jedes `liefert` taucht in einem Schritt auf; die
  Mitnahme-Zeilen werden im gemeinsamen Auftrag gebraucht; LF4 lässt beide Pole
  zu. Keine Korrekturen.
- **Fachprüfung gegen das Lehrmittel, ein Worker pro Heft** (2): Jede
  Fachaussage, Seitenangabe und Musterlösung gegen `material/_lehrmittel/`
  prüfen. Meldet Abweichungen mit Fundstelle. Keine Korrekturen.
- **Abgrenzungs-Audit** (1): Heft A, Heft B, gemeinsamer Auftrag, KN und alle
  Quellen auf Überschneidung von Lebensbereich und Gegenstand. Keine Korrekturen.

## HAIKU — mechanical worker

"Haiku agents handle bounded mechanical reads and transforms. Exact brief,
compact return, no recursive delegation."

"Subagent returns come back as extracted key numbers and paths, never raw dumps."

Passende Arbeit hier:

- Zeichen zählen je Feld gegen die Budgets in §3.1, bevor `check-v42.mjs` steht.
- Jede `ref` in `methoden`, `quellen`, `ersatz_ref` auf Existenz der Karte prüfen.
- Platzhalter- und «ß»-Suche über den neuen Ordner und die Quellenkarten.
- Wortlaut der Feedback-Kriterien zeichengenau gegen `kn.rubrik_shared` vergleichen.
- Jede URN und URL der freigegebenen Quellen noch einmal abrufen und Status,
  Titel, Datum zurückgeben.

---

## Suggested build order

Abhängigkeiten, kein Zeitplan:

1. **Branch und Ausgangslage:** `v42-gold-1.3.1` anlegen, Vorbestand committen.
   Ordner `src/data/einheiten/1.3.1_konsum_verantworten_v42/` anlegen:
   Referenzdaten kopieren, IDs setzen, `prinzip.delta.json` auf das bestehende
   `prinzip.json` legen, `kn.json` unverändert kopieren (nur ID und Verweise),
   die zwei Methodenkarten nach `src/data/methoden/`.
2. **Datenvertrag (Fable):** Typen, Spur-Auflösung, Ordnername, Kurzlink,
   Quellen-IDs. Danach bewegt sich das nicht mehr.
3. Parallel, weil unabhängig:
   - Quellensuche (Sonnet-Fan-out) → Fable wählt → Quellenkarten in
     `src/data/quellen/`, Volltexte ins Archiv.
   - Spur-Auflösung und Quellen-Resolver.
   - `check-v42.mjs`.
   - Lehrmittel-Seite für LF3 ohne Medien in Heft A verifizieren.
4. Heft-Renderer Seiten 1–4 und 5–8 (HTML und Word zusammen, weil sie sich
   spiegeln). Braucht Schritt 2 und den Resolver.
5. Quellenabhängige Inhalte (LF3-Lösungen, Beispielwerte, `quelle_stand`).
   Braucht die freigegebenen Quellen.
6. Auftragsbogen; Landing-Seite und QR; Spur-Umschalter und ZIP.
7. `begleiter.md`. Braucht alles Inhaltliche in endgültiger Form.
8. Gates grün; Überlauf-Messung; Bestandsvergleich (Invariante 4).
9. Sonnet-Panels und Audits über das Ganze, Befunde von Fable gewichtet,
   Korrekturen als Executor-Aufträge, Gates erneut.
10. **Übergabe:** Exporte nach `docs/upgrade-v4.2/gold/` (je Heft und Spur HTML
    und `.docx`, Auftragsbogen, Begleiter) und `docs/upgrade-v4.2/BERICHT.md`:
    was gebaut ist, Quellenliste mit Prüfdatum, alle Entscheide, was nicht
    belegt oder nicht geprüft werden konnte, was für die Serienproduktion
    daraus folgt. Letzter Commit auf dem Branch. Kein Push.

Fertig heisst: Beide Fassungen sind unter
`/einheiten/1.3.1_konsum_verantworten_v42` als Entwurf umschaltbar, alle Gates
grün, keine Platzhalter, die Exporte liegen in `docs/upgrade-v4.2/gold/`.

## Explicitly out of scope

Nicht anfassen; gehört in eine spätere Phase oder eine andere Session:

- `.claude/skills/bbw-hko-3er-set/`, `hko-2er-EBA-set-generator/`,
  `hko-ki-komplement/` — der Generator wird erst nach der Gold-Version neu
  geschrieben.
- Die zehn übrigen Einheiten unter `src/data/einheiten/` und ihre Migration
  (Leitfaden §12).
- EBA (Leitfaden §10) und `DocEbaDossier.tsx`, `DocLeseblatt.tsx`.
- KI-Toolbox der neuen Einheit (`ki.json`, `lernprompt.json`,
  `lernbegleiter.json`, `ki-liesmich.md`) und `DocKi*.tsx`.
- `src/lib/einheiten/deck-builder.ts` und `scripts/build-deck.mjs`: Die
  Präsentation darf mit der neuen Einheit nicht abstürzen; mehr nicht.
- `src/lib/werkstatt/`: darf nicht abstürzen; kein Ausbau.
- Die drei bekannten defekten Skripte (State of the repo) und die
  172 Baseline-Befunde.
- `src/pages/admin/medien-plus.astro`, `src/pages/m/131-a.astro`,
  `docs/medien-plus/` — das alte Mockup bleibt stehen.
- `supabase/`, Migrationen, Tracking (`src/lib/tracking.ts`), Feedback-Formulare.
- CI, Hooks, periodische Link-Prüfung, `vercel.json`.
- `CLAUDE.md` — erst nach Pietros Abnahme nachführen.
- `D:\OS\pendenzen.yaml` und alles ausserhalb von `D:\OS\dev\bbw-hko`, ausser
  dem Schreiben ins Quellenarchiv `D:\OS\_lab\quellen-archiv\bbw-hko\`.
