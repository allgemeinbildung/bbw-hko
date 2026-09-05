# Testplan — uncommitted Änderungen in `dev/bbw-hko`

Stand 2026-09-05 · Branch `main`, letzter Commit `83f6d50` · 65 geänderte/neue Dateien

Dieses Dokument ist zum Abhaken vor dem Commit. Die Reihenfolge ist Absicht:
erst die Skripte (kostenlos, eine Minute), dann die **globalen**
Layout-Änderungen — die sind das eigentliche Risiko, weil sie auch die vier
**publizierten** Einheiten treffen —, erst danach die Entwurfsinhalte.

---

## 0 · Reichweite auf einen Blick

**Keine einzige publizierte Einheit hat Inhaltsänderungen.** Alle sieben
inhaltlich geänderten Einheiten stehen auf `status: "entwurf"` — sichtbar nur
für KT1. Aber: **drei Code-Änderungen rendern in jeder Einheit**, auch in den
publizierten. Das ist die Grenze, auf die es beim Testen ankommt.

| Änderung | Reichweite | Wer sieht es |
|---|---|---|
| Karo-Raster statt Linien (CSS, alle Schreibfelder) | **alle 11 Einheiten** | **öffentlich** |
| Scaffolding unter der Leitfrage im Dossier (`DocS.tsx`) | **alle 11 Einheiten** | **öffentlich** |
| Mindmap-Hinweis nebeneinander, `.lf-head` enger (CSS) | **alle 11 Einheiten** | **öffentlich** |
| Bogen-v3-Felder (`liefert`, `auftakt_typ`, `scaffolding`, `bereitet_vor`) | 7 Entwurf-Einheiten | nur KT1 |
| Persona-Neutralisierung + «oder dort, wo Sie zuletzt gearbeitet haben» | 7 Entwurf-Einheiten | nur KT1 |
| Begleiter-Feldmarker (`<!--hko:…-->`) | Mechanismus global, Daten nur in Entwürfen | nur KT1 |
| `einheiten.index.json` (3 Titel-Drifts) | 3 Entwurf-Einheiten | nur KT1 |
| `scripts/check-einheiten.mjs`, Baseline, `package.json` | Werkzeug | niemand |
| `.claude/skills/bbw-hko-3er-set/**` | Generierung künftiger Einheiten | niemand |

**Entwurf (nur KT1):** `1.1.1_ausbildung_erfassen_zeigen` ·
`1.1.1_einstieg_interview` · `1.2.2_ki_kompetenznachweis_vorbereiten` ·
`1.3.1_konsum_verantworten` · `3.2.1_ernaehrung_nachhaltig_gestalten` ·
`3.2.1_wahre_kosten` · `5.4.2_internationale_entscheide_wirken_4j`

**Publiziert / eingefroren (öffentlich, inhaltlich unverändert):**
`1.1.1_konflikt_kommunizieren` · `1.1.1_lehrvertrag_orientieren` ·
`1.1.1_rechte_verstehen_nutzen` · `1.1.2_unterlagen_ordnen`

---

## Vorbereitung

```bash
npm run dev
```

Dann `http://localhost:4321` öffnen und **als KT1 einloggen** — ohne Login
leitet jede `/einheiten`-URL auf `/login` um, und als `lp`/`gast` sind die
sieben Entwurfs-Einheiten unsichtbar (genau so soll es sein, siehe Block 6).

Der Astro-Dev-Server braucht beim ersten Start rund eine Minute, bis er
antwortet. Das ist normal, kein Fehler.

---

## Block 1 · Skripte (~1 Minute, muss grün sein)

- [ ] **1.1** `npm run check:einheiten`
      Erwartet: `11 Einheiten geprueft — 0 offene Befunde (0 Fehler), 172 in der Baseline.`
      Exit 0. Schlägt es an, steht ein *neuer* Befund drin, den die Baseline
      noch nicht kennt.
- [ ] **1.2** `node scripts/check-bogen-v2-regression.mjs`
      Erwartet: `OK — 4 eingefrorene Einheiten unberuehrt:` mit genau den vier
      publizierten Einheiten. **Taucht hier eine Entwurfs-Einheit auf oder fehlt
      eine der vier, ist ein `status`-Feld verrutscht** — der Guard leitet die
      geschützte Menge neu aus `set.json` ab statt aus einer Namensliste.
- [ ] **1.3** `npm run build:einheiten-index`, danach `git status src/data/einheiten.index.json`
      Erwartet: **keine** weitere Änderung. Ich habe den Index bereits einmal neu
      gebaut; er war stale (drei Titel, siehe 7.3).
- [ ] **1.4** `npm run build` läuft durch.
      *Hinweis:* `npx tsc --noEmit` meldet 6 Fehler in `EinheitWorkbench.tsx`,
      `middleware.ts` und zwei API-Routen. Die sind **vorbestehend** und
      betreffen keine geänderte Datei — nicht als Regression lesen.

---

## Block 2 · Karo-Raster — die riskanteste Änderung ⚠ öffentlich

Alle Schreibflächen sind von Linien auf ein 4.25-mm-Karoraster umgestellt
(`.feld`, `.hp-flaeche`, EBA-Notizen/Prüf-/Lesefelder). Mitgeändert: `.feld`
bekommt **2.6 mm Innenabstand oben** (vorher 0), damit getippter Text auf einer
Rasterlinie sitzt statt durchgestrichen auszusehen. Jedes Schreibfeld ist damit
2.6 mm höher als vorher — und das kann eine Seite über die A4-Kante schieben.
`.a4-page` hat `overflow: hidden`, das Abschneiden passiert also **still**.

- [ ] **2.1 Bildschirm, Entwurf.** `5.4.2_internationale_entscheide_wirken_4j`,
      Dokumenttyp **DOC-S · Auftrag**, alle drei Herausforderungen durchklicken.
      Raster sichtbar, gleichmässig, keine verklumpten Balken.
- [ ] **2.2 Getippter Text sitzt auf der Linie.** In ein Dual-Mode-Schreibfeld
      tippen. Die Grundlinie muss auf einer Rasterlinie liegen, nicht auf halber
      x-Höhe.
- [ ] **2.3 Druck-PDF, Entwurf.** Ctrl+P → «Als PDF speichern» derselben Ansicht.
      **Das ist der eigentliche Test.** Der alte `repeating-linear-gradient` kam
      in Chrome als PDF-Shading heraus und verkachelte falsch (fehlende Linien,
      verklumpte Balken, gesehen am 2026-09-04). Die Kachel-Variante soll sauber
      drucken. Wenn nicht: **nicht «vereinfachen»**, der Kommentar in der CSS
      erklärt warum.
- [ ] **2.4 Druck-PDF, KN-S.** Dokumenttyp **DOC-KN-S** einer Entwurfs-Einheit,
      dasselbe. Das war der ursprüngliche Fundort des Bugs.
- [ ] **2.5 ⚠ Regression auf publizierten Einheiten.** Für jede der vier —
      `1.1.1_konflikt_kommunizieren` · `1.1.1_lehrvertrag_orientieren` ·
      `1.1.1_rechte_verstehen_nutzen` · `1.1.2_unterlagen_ordnen` —
      DOC-S drucken und **die Seitenzahl gegen die bisherige Fassung zählen**.
      Kein Inhalt darf am Seitenfuss abgeschnitten sein, keine Seite darf
      dazugekommen sein. Diese vier haben keine Inhaltsänderung — verschiebt
      sich hier etwas, kommt es allein von den 2.6 mm.
- [ ] **2.6 Arbeitsflächen-Seite.** `.hp-flaeche` hat 8 mm → 6.8 mm oben. Auf der
      Handlungsprodukt-Seite prüfen, dass die Fläche nicht am oberen Rand klebt
      und unten nicht überläuft.

---

## Block 3 · Dossier: Scaffolding unter der Frage ⚠ öffentlich

Im **Dossier** (`DocSInfo`, alle vier Leitfragen auf einer Seite) steht das
Scaffolding neu **unter** der Frage in bis zu drei Spalten statt in der schmalen
22-%-Rail daneben. Grund: mit Rail lief die Seite ab LF4 über die A4-Kante — LF4
und die Mindmap-Sektion fielen ersatzlos weg. Im **Füll-Dokument** (DOC-S, zwei
Leitfragen pro Seite) bleibt die Rail.

- [ ] **3.1** Dossier einer Entwurfs-Einheit öffnen: **alle vier Leitfragen
      sichtbar**, darunter die Mindmap-Sektion. Nichts fehlt am Seitenfuss.
- [ ] **3.2** Die drei Spalten «So gehen Sie vor» · «Satzanfänge» · «Ins Produkt»
      stehen nebeneinander und sind lesbar (7.5 pt).
- [ ] **3.3** DOC-S derselben Einheit: dort steht das Scaffolding **weiterhin
      rechts in der Rail**. Steht es auch dort untendrunter, greift das
      `scaffoldUnten`-Flag zu breit.
- [ ] **3.4 ⚠ Regression.** Dossier der vier publizierten Einheiten. Die haben
      alle Scaffolding (2–3 Herausforderungen), **die Umstellung trifft sie also
      ebenfalls**. Vier Leitfragen + Mindmap müssen dort ebenso vollständig sein.
- [ ] **3.5** Mindmap-Hinweis: die Äste stehen jetzt nebeneinander (flex-wrap),
      ohne Nummern. Bei `1.3.1_konsum_verantworten` steht die Reihenfolge im Titel
      selbst («Ast 1 — Bedürfnisarten») — das muss weiterhin stimmen.
- [ ] **3.6** `.lf-head` ist 0.5 mm enger. Sichtprüfung: Nummer und Fragetext
      stehen nicht aufeinander.

---

## Block 4 · Bogen-v3-Felder (nur Entwurf, KT1)

Die v3-Kopplungsfelder sind von der Pilot-Einheit 5.4.2 auf **alle sieben
Entwurfs-Einheiten** ausgerollt: `liefert` an jeder Leitfrage, `auftakt_typ`,
`scaffolding`, neu `bereitet_vor`. Zwei Einheiten stehen auf
`template: "default_4page_v3"` (`3.2.1_ernaehrung_nachhaltig_gestalten`,
`5.4.2_…_4j`), die übrigen fünf tragen die Felder auf v2.

- [ ] **4.1** Pro Entwurfs-Einheit, DOC-S: **jede** Leitfrage hat eine
      «→ liefert: …»-Zeile. Kursiv, nominal, ohne «Sie».
- [ ] **4.2** `auftakt_typ`: Ein Auftakt vom Typ **`vorbereitung`** wandert als
      eigener Kasten auf Seite 1 und **entfernt den Absatz über LF1**. `pfad` und
      `kontext` bleiben bei den Leitfragen, nur beschriftet. Prüfen, dass keine
      Einheit auf der Leitfragen-Seite ohne Anleitung dasteht — das fällt laut
      Skill erst am gedruckten Bogen auf.
- [ ] **4.3** Statement-Block + Situations-Karte auf Seite 1: der Auftrag steht
      als grosser farbiger Block über die volle Breite, die Situation in einer
      gerahmten Karte.
- [ ] **4.4** Selbstcheck-Seite: die Checkliste Vollständigkeit steht **vor** den
      drei Reflexionsfragen auf der letzten Seite, nicht mehr auf Seite 1.
- [ ] **4.5** 4+1-Kopplung stichprobenweise nachlesen: Schritt 1 ← LF1 … Schritt
      4 ← LF4, und **Schritt 5 ist der Kontrollschritt ohne Absender** (prüft,
      liefert nicht; steht nicht in `abgaben[]`). `check:einheiten` prüft das
      maschinell (Check 33) — hier geht es nur darum, ob es sich auf dem Papier
      auch so liest.
- [ ] **4.6** `bereitet_vor` wird **noch nicht gerendert** (Typ-Kommentar in
      `types.ts`). Taucht irgendwo im Bogen etwas davon auf, ist das ein Bug.

---

## Block 5 · Begleiter-Feldmarker (nur Entwurf, KT1)

Neu: `src/lib/einheiten/begleiter-felder.ts`. Der Begleiter zitiert Persona,
Situationstext, KN-Szene und KN-Fragen jetzt über `<!--hko:pfad|format-->`-Marker
aus den JSONs, statt sie zu kopieren. Der Text *zwischen* den Markern ist
Rückfall — wer die `.md` roh öffnet, liest weiterhin Inhalt. Aufgelöst wird beim
Laden, **vor** `withLeitfragenLoesungen`.

Markerzahlen: 5.4.2 = 52 · `ausbildung_erfassen` = 46 · `ki_kompetenznachweis` = 26 ·
`ernaehrung` = 26 · `wahre_kosten` = 23 · `konsum_verantworten` = 8 ·
`einstieg_interview` = 1. Die vier publizierten Einheiten haben **null** Marker,
sind hier also nicht betroffen.

- [ ] **5.1** Begleitdokument jeder Entwurfs-Einheit im Browser öffnen: **nirgends
      ein sichtbarer `<!--hko:…-->`-Kommentar** und keine leere Stelle, wo
      Persona/Situation/KN stehen müsste.
- [ ] **5.2** Persona-Zeile im Begleiter lesen — muss «Lernende/r EFZ, N. Lehrjahr
      — eigener Lehrbetrieb, eigener Wohnort» ergeben, zusammengesetzt aus
      `beruf`/`betrieb`/`ort`.
- [ ] **5.3** Ein zitierter Situationstext steht als Blockquote (`>`), nicht als
      Fliesstext-Absatz.
- [ ] **5.4** Vollständigkeits-Checkliste im Begleiter (Format `checkliste`): eine
      `☐`-Zeile pro Rasterkriterium, **vollständig** — das war der eigentliche
      Anlass, es gab lückenhafte Listen.
- [ ] **5.5** Begleiter-DOCX herunterladen (`/einheit-begleiter-docx/…`) und
      öffnen: dieselben aufgelösten Werte wie im Browser, keine Marker.
- [ ] **5.6** Begleiter im ZIP-Bundle: nochmals dasselbe. HTML, Word und ZIP
      müssen identisch sein — dafür wird beim Laden aufgelöst, nicht beim Rendern.
- [ ] **5.7** Robustheitsprobe (optional, danach zurücksetzen): einen Markerpfad in
      einer `.md` verfälschen. Erwartet: der **Rückfalltext bleibt stehen**, die
      Seite rendert weiter — und `check:einheiten` meldet
      `ERR_BEGLEITER_MARKER_UNAUFLOESBAR`.

---

## Block 6 · Sichtbarkeit / Rollen ⚠ entscheidet über alles andere

Der ganze Rest ist nur harmlos, wenn die Entwurfs-Gate greift.

- [ ] **6.1** Als **KT1**: `/einheiten` zeigt alle 11, die sieben Entwürfe mit
      gelbem **Entwurf**-Badge und Bausteine-Chips.
- [ ] **6.2** Als **lp** (oder abmelden und «Als Gast ansehen»): der Katalog zeigt
      **nur die vier publizierten**. Kein Entwurf, auch nicht in der Jahresplanung.
- [ ] **6.3** Als lp/gast eine Entwurfs-URL direkt aufrufen, z. B.
      `/einheiten/3.2.1_wahre_kosten` → muss auf `/einheiten` umleiten.
- [ ] **6.4** Als lp/gast eine publizierte Einheit mit `entwurf_komponenten` öffnen
      (`1.1.1_konflikt_kommunizieren`, `1.1.1_rechte_verstehen_nutzen`): **kein
      KI-Tab**, keine KI-Dateien im ZIP, keine KI-Badges. Als KT1 alles da.
- [ ] **6.5** `/admin`: der schlanke «Entwürfe»-Hinweis oben zählt **7**.

---

## Block 7 · Inhaltliche Stichproben (nur Entwurf, KT1)

**Persona-Neutralisierung.** Erfundene Berufe, Firmen und Städte sind raus:
«Bäcker-Konditor-Confiseur/in EFZ» / «Noser Engineering AG» /
«Präzisionsmechanik Halter AG» → «Lernende/r EFZ, N. Lehrjahr» / «eigener
Lehrbetrieb» / «eigener Wohnort». Begründung in der Skill (Check 14): unter
Jigsaw sieht eine lernende Person genau **eine** Herausforderung — eine
Berufspersona trifft dort in gemischten Klassen fast immer den falschen Beruf.

- [ ] **7.1** Kein Bogen und kein Begleiter nennt mehr einen konkreten Lehrberuf,
      Firmennamen oder eine Stadt. (`check:einheiten` deckt das ab —
      `ERR_PERSONA_SPEZIFISCH` —, aber ein Blick auf 5.4.2 und
      `3.2.1_ernaehrung_nachhaltig_gestalten` lohnt, dort ist am meisten geändert.)
- [ ] **7.2** Formel **«oder dort, wo Sie zuletzt gearbeitet haben»** — neu an
      vielen Stellen, für Lernende ohne aktuellen Lehrbetrieb. Liest sich das im
      Fliesstext noch, oder stolpert man? Betroffen u. a. 5.4.2 Situationstext,
      `3.2.1_ernaehrung…` Situationstext, `1.3.1` und `3.2.1_wahre_kosten`
      Einzelauftrag in `set.json`.
- [ ] **7.3** **Drei Titel im Index waren stale** und sind jetzt korrigiert — bitte
      gegenlesen, ob die neuen die gewollten sind:
      - `1.2.2_ki_kompetenznachweis_vorbereiten`: «Drei Tage vor dem KN — wie weit
        lasse ich die KI ran?» → **«… — die fertige Zusammenfassung im Klassenchat»**
      - `3.2.1_wahre_kosten`: «Zwei Messschieber und eine Entsorgungsrechnung»
        → **«Zwei Jacken und eine Gemeinderechnung»**
      - `5.4.2_…_4j`, Herausforderung B: «Zwei Berufsbildende, zwei Rechnungen»
        → **«Zwei Mitarbeitende, zwei Rechnungen»**
- [ ] **7.4** Methoden-Seite «05 · Methoden» auf den fünf Einheiten mit
      `methoden`-Array (`1.1.1_ausbildung_erfassen_zeigen`,
      `1.1.1_einstieg_interview`, `3.2.1_ernaehrung_nachhaltig_gestalten`,
      `3.2.1_wahre_kosten`, `5.4.2_…_4j`): **genau vier Karten**, **genau zwei** mit
      Beispiel/Fehler, 2×2-Raster nicht gequetscht. Die Regel ist nirgends
      erzwungen — nur das Auge fängt sie.
- [ ] **7.5** ZIP-Bundle einer Entwurfs-Einheit einmal ganz herunterladen und
      öffnen: Dateizahl plausibel, README da, DOCX öffnen sich.

---

## Block 8 · Werkzeug und Skill (keine Laufzeitwirkung)

Diese Änderungen ändern nichts, was eine Lehrperson sieht — sie ändern, was beim
nächsten Generieren herauskommt.

- [ ] **8.1** `scripts/check-einheiten.mjs` (neu, 400 Zeilen) + Baseline +
      `npm run check:einheiten` in `package.json`. Prüft Check 33 (LF↔Produkt-
      Kopplung 4+1), Check 34 (Autarkie), Persona-Neutralität und Begleiter-Drift.
      Zur Kenntnis: `--strict` zeigt **172 Befunde**, davon 134 in eingefrorenen
      Einheiten. Die Baseline friert sie ein, damit nur *neue* Befunde brechen.
      Kein Handlungsbedarf jetzt — aber es heisst, dass die publizierten Einheiten
      die neuen Regeln nicht erfüllen und das bewusst so bleibt.
- [ ] **8.2** `.claude/skills/bbw-hko-3er-set/**`: Check 9 entfällt, Check 14 ist
      auf Persona-Neutralität umgestellt, Check 33 auf die Index-Regel, Check 34
      (Autarkie) und Check 35 (Begleiter zitiert) sind neu; Schritt 2f und 2g sind
      in der Erzeugungsreihenfolge verankert. Kein Test möglich ausser Lesen —
      wirkt sich erst bei der nächsten generierten Einheit aus.
- [ ] **8.3** `src/lib/einheiten/types.ts`: `bereitet_vor` ergänzt, `verbindlich`
      ist per Typ auf `false` festgelegt.

---

## Vor dem Commit

- [ ] Block 1 komplett grün
- [ ] Block 2.5 und 3.4 (Regression auf den vier publizierten Einheiten) geprüft
- [ ] `git status` enthält `src/data/einheiten.index.json` — der Index gehört in
      denselben Commit wie die Daten, sonst zeigt der Katalog wieder alte Titel
- [ ] Die losen Debug-Dateien im Repo-Root (`_repro.mjs`, `_t.mjs`, `_t2.mjs`,
      `_t3.mjs`, `_test-cal.mjs`, `_test_callouts.mjs`, `err.tmp`, `debug.log`,
      `build_check.log`) sind **nicht** Teil dieser Änderungen — separat
      entscheiden, ob sie ins Repo sollen


---

# Nachtrag 2026-09-05 — maschinell abgeschlossen

Nach dem Browser-Testbericht wurden die verbleibenden Punkte offline geprueft:
die Komponenten wurden ausserhalb der App gerendert (esbuild + renderToStaticMarkup),
mit dem echten Renderer-CSS und geladenen IBM-Plex-Schriften in Chrome geoeffnet,
als PDF gedruckt und der PDF-Textlayer gegen die Quell-JSONs verglichen.
60 Dokumente, 344 Seiten, alle 11 Einheiten x A/B/C x Auftrag/Dossier.

## Erledigt — kein Handlungsbedarf

| Punkt | Ergebnis |
|---|---|
| 1.1-1.4 | Alle Skripte gruen; `tsc` nur die 6 vorbestehenden Fehler |
| 2.3 / 2.4 | Karo-Raster druckt sauber. Keine fehlenden Linien, keine Balken |
| 2.5 | **Seitenzahlen vor/nach der Aenderung identisch** in allen 60 Dokumenten. Die +2.6 mm schieben nichts ueber die Kante |
| 3.1 / 3.4 | siehe unten — die Umstellung behebt einen echten Fehler |
| 4.1 | `liefert` maschinell fuer alle 7 Entwuerfe bestaetigt |
| 4.2 | Kein Testfall vorhanden: kein `auftakt_typ: "vorbereitung"` im Korpus (19x `pfad`, 1x `kontext`) |
| 4.6 | `bereitet_vor` nur in 1.2.2 A und 1.3.1 A, beide `verbindlich: false`, nirgends gerendert |
| 5.1-5.4 (maschinell) | Alle 7 Entwuerfe: 0 unaufloesbare Marker, 0 echte Drift. Die 12 scheinbaren Drifts in 5.4.2 sind CRLF-Artefakte, die `norm()` korrekt abfaengt |
| 7.4 | Alle 14 Methoden-Seiten erfuellen die 4/2-Regel; keine unbekannte Karten-Referenz |

## Befund: die Dossier-Umstellung behebt einen echten Datenverlust

A/B-Vergleich derselben Datei, einmal mit HEAD, einmal mit dem Arbeitsstand,
gemessen am PDF-Textlayer von Seite 2:

| Dossier Seite 2 | HEAD (Rail) | Arbeitsstand (Scaffolding unten) |
|---|---|---|
| `5.4.2_…_4j` A | 2535 Zeichen, **Mindmap fehlt** | 3676 Zeichen, vollstaendig |
| `1.1.1_ausbildung_erfassen_zeigen` A | 2253 Zeichen, **Mindmap fehlt** | 3103 Zeichen, vollstaendig |
| `1.1.1_konflikt_kommunizieren` A (publiziert) | 1714 Zeichen, vollstaendig | 1702 Zeichen, vollstaendig |

Ohne die Aenderung fallen im Dossier der Entwurfs-Einheiten LF4 und die ganze
Mindmap-Sektion still ueber die A4-Kante — genau das, was der Code-Kommentar
beschreibt. Mit der Aenderung ist jede Dossier-Seite 2 aller 30 Kombinationen
vollstaendig.

## Korrektur zur Reichweiten-Tabelle in Block 0

**Die `DocS.tsx`-Aenderung ist fuer die publizierten Einheiten wirkungslos.**
`LeitfrageItem` erreicht den `scaffoldUnten`-Zweig nur, wenn
`hatRailInhalt(lf.scaffolding)` wahr ist. Gezaehlt ueber alle Leitfragen:

- 7 Entwurfs-Einheiten: 80 von 80 Leitfragen mit Rail-Inhalt
- 4 publizierte Einheiten: **0 von 40**

Oben stand "alle 11 Einheiten / oeffentlich" — das kam aus einem Treffer auf das
blosse Wort `scaffolding` in den Dateien. Oeffentlich wirksam bleiben nur die
CSS-Aenderungen (Karo-Raster, `.lf-head`), und die kosten keine Seite.

## Was weiterhin von Hand geprueft werden muss

1. **5.1-5.6 optisch** — dass die Marker aufloesen, ist bewiesen; wie der
   aufgeloeste Begleiter *aussieht* (Blockquote, vollstaendige Checkliste,
   DOCX- und ZIP-Parität), ist es nicht.
2. **ZIP-Standalone-HTML** — `[setKey].astro` inlined die komplette
   Renderer-CSS per `?raw`, das Karo faehrt also mit ins ZIP. Diese
   `file://`-Datei drucken die Lehrpersonen tatsaechlich aus; sie hat einen
   eigenen `@media print`-Block in `standalone-shell.ts` und wurde nie geprueft.
3. **Word weicht ab** — `docx-builder.ts` zeichnet weiterhin Schreib**linien**,
   kein Karo. Dieselbe Herausforderung sieht als PDF anders aus als im
   Word-Dokument. Entscheidung, keine Selbstverstaendlichkeit.
4. **6.5** (Entwurfs-Zaehler im Admin) und **7.5** (ZIP-Bundle oeffnen) —
   brauchen einen KT1-Login.
5. **4.3-4.5** inhaltlich lesen — Statement-Block, Selbstcheck-Reihenfolge und
   die 4+1-Kopplung auf dem Papier.

## Zum Karo-Befund aus dem Browser-Bericht

Ein computed `background-image: none` kann aus diesem Repo nicht kommen: es gibt
7 `background-image`-Deklarationen, keine setzt `none`, und der
`@media print`-Block fasst nur Rahmen und `background-color` an. Beim naechsten
Auftreten ist **`background-size`** der aussagekraeftigere Wert — faellt er auf
`auto`, ist `--kaestchen` im Subtree nicht angekommen, und die zwei Gradienten
werden zu einem einzigen Winkel gestreckt. Am Bildschirm sieht das exakt wie
eine einfarbige Flaeche aus, waere aber ein echter Fehler und keine
Chromium-Kachelmacke. Im Druck ist das Raster ueber alle geprueften Seiten
sauber.
