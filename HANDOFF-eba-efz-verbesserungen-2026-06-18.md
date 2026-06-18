# Handoff — EBA-/EFZ-Verbesserungen (Feedback Däniker, 18.06.2026)

**Für:** neue Claude-Code-Session im Repo `bbw-hko`
**Quelle:** Besprechung Pietro × Matthias Däniker → `eba-besprechung-daeniker-2026-06-18.md`
**Stand Recherche:** Architektur unten ist verifiziert (Dateien + Zeilen geprüft am 18.06.2026).

> Vor dem Start: `CLAUDE.md` (Projekt) lesen, v. a. die Abschnitte *Einheiten-Subsystem*, *Einheiten-Sichtbarkeit / Entwürfe* und *Design system*. **Keine Dateien löschen ohne Rückfrage.** Default-Output: Markdown.

---

## Entscheide (von Pietro bereits getroffen — nicht erneut fragen)

| # | Thema | Entscheid |
|---|---|---|
| 1 | Infokarte | **Referenz-Code + eigenes Kartendesign.** «Nugget» → «Infokarte»; sichtbarer Code (z. B. «Infokarte A-01») erscheint auf der **Herausforderung** UND im **Glossar+**. EBA-only. |
| 3 | KI-Fluency-Name | Neuer Name **«KI-Toolbox»** (Display-Label). Gruppen-**Key** `ki-fluency` bleibt (sonst kaskadieren `entwurf_komponenten` etc.). |
| 3/4 | KI-Toolbox-Scope | **Nur EFZ 3j/4j.** EBA bekommt keinen KI-Tab — EBA-KI lebt im Glossar+. Renderer-Änderungen betreffen nur `EinheitWorkbench`. |
| 6 | Bewertungsskala | **«unter 60 %» / «80 %» / «100 %»** statt 90/90/100. Alle EFZ-`kn.json` + `DocKnS.tsx`-Logik + Generierungs-Skills. |

---

## Architektur-Kontext (verifiziert)

- **EBA** nutzt ein eigenes **Glossar+**-Modell: `src/components/einheiten/docs/DocEbaDossier.tsx` + `dossier.json` pro Einheit. Weiche in `EinheitWorkbench.tsx` (`d.dossier` → `doc-dossier`, Label «Glossar+», Zeile ~427). EBA-Einheit heute: `src/data/einheiten/1.1.1_lehrvertrag_orientieren/` (`dossier.json`, `herausforderung_A/B.json`, `prinzip.json`, `begleiter.md`).
- EBA-Karten heissen aktuell intern **`Nugget`** (`NuggetCard`, `nuggetCode()` erzeugt `A-01`/`B-01`). Begriff «Infokarte» kommt im `src/`-Code **nirgends** mehr vor (wurde entfernt). Nuggets tragen `tag: 'A'|'B'`, `glossar_refs`, `fuer_leitfrage`.
- **KI-Toolbox** (heute «KI-Fluency») = EFZ-Feature: `ki.json` / `lernprompt.json` / `lernbegleiter.json`; Renderer `DocKi.tsx` / `DocLernprompt.tsx` / `DocLernbegleiter.tsx`; Tree-Gruppe in `EinheitWorkbench.tsx` (Zeile ~460–500).
- **Bewertungsskala** «unter 90 % / 90 % / 100 %»: Labels in jeder EFZ-`kn.json` (z. B. `1.1.1_konflikt_kommunizieren/kn.json` Z. 242/246/250); interpretiert in `DocKnS.tsx` Z. 18–25 (`l.includes('100')` / `l.includes('90')`).
- **Skills**: `.claude/skills/bbw-hko-3er-set/` (EFZ), `.claude/skills/hko-2er-EBA-set-generator/` (EBA), `.claude/skills/hko-ki-komplement/` (KI-Toolbox).
- Nach Daten-Änderungen: `npm run build:einheiten-index`. Build-Check: `npm run build`. Visuell: `npm run dev`.

---

## Item 1 — «Infokarte» im EBA-Glossar+ (Referenz-Code + Design)

**Ziel:** Lernende sehen die Verbindung Herausforderung ↔ Glossar+. Jede Wissenskarte ist eine «Infokarte» mit sichtbarem Code; die Herausforderung verweist auf ihre Infokarten.

**Dateien:**
- `src/components/einheiten/docs/DocEbaDossier.tsx`
  - `NuggetCard` → learner-facing als **«Infokarte»** beschriften. `.eba-ncode` zeigt den Code prominent als Badge **«Infokarte A-01»** (nicht nur «A-01»).
  - Optional Interface-Kommentare/Namen aufräumen (intern `Nugget` darf bleiben, um Kaskaden zu vermeiden — nur UI-Text ändern).
- **Herausforderung-Seite:** prüfen, wie EBA-`herausforderung_A/B.json` gerendert wird (vermutlich via `DocS`, Zeile 87 — verifizieren!). Dort die zugehörigen Infokarten-Codes anzeigen (z. B. Box «Dazu passen: Infokarte A-01, A-02»). Mapping über `tag` (A/B) bzw. `glossar_refs`/`fuer_leitfrage`.
- `src/styles/einheiten-renderer.css`: `.eba-nugget` / `.eba-ncode` ein eigenes, wiedererkennbares Design geben (spezielle Schrift/Farbe/Rahmen) — **gleicher** Badge-Stil auf Herausforderung und Glossar+, damit die optische Brücke sichtbar ist. Single-green-Regel beachten (kein neues Workflow-Farbschema).
- `dossier.json` (`einleitung.was_ist_das` / `so_benutzt_du_es`): Begriff «Infokarte» einführen/erklären.
- **Skill** `hko-2er-EBA-set-generator`: Template so anpassen, dass neue Einheiten (a) Infokarten-Codes vergeben und (b) je Herausforderung die zugehörigen Infokarten referenzieren.

**Akzeptanz:** Im Glossar+ trägt jede Karte ein «Infokarte X-NN»-Badge; auf der Herausforderung stehen dieselben Codes; Badge-Design auf beiden Seiten identisch.

---

## Item 2 — KI-Prompt-Wortlaut (Copilot benennen)

**Ziel:** statt offenem «eine KI» ein konkretes Tool als Beispiel nennen.

**Wortlaut:**
- «So fragen Sie die KI:» → **«Fragen Sie eine KI Ihrer Wahl, z. B. Copilot:»**
- «So lernen Sie mit KI:» → **«So lernen Sie mit Copilot (oder einer KI Ihrer Wahl):»**

**Dateien:**
- `src/components/einheiten/docs/DocEbaDossier.tsx` Z. ~121 (`So fragen Sie die KI`) und ~133 (`So lernen Sie mit KI`).
- `dossier.json`: `einleitung` Z. ~29 nennt bereits «eine KI wie Microsoft Copilot» — Wortlaut angleichen.
- EFZ-KI-Toolbox-Docs (`DocKi`/`DocLernprompt`/`DocLernbegleiter`) prüfen: falls generische «eine KI»-Intros vorhanden, gleich angleichen.
- **Skills** `hko-2er-EBA-set-generator` + `hko-ki-komplement`: Prompt-Intro-Templates auf den neuen Wortlaut umstellen.

**Akzeptanz:** Alle KI-Hinweise nennen Copilot als Beispiel, lassen aber «… Ihrer Wahl» offen.

---

## Item 3 — Umbenennung «KI-Fluency» → «KI-Toolbox» (nur EFZ)

**Display-Label überall ändern, Gruppen-Key `ki-fluency` belassen.**

**Dateien:**
- `src/lib/einheiten/index.ts` Z. 27: `'ki-fluency': 'KI-Fluency'` → `'KI-Toolbox'`. (Key Z. 22 NICHT ändern.)
- `src/components/einheiten/EinheitWorkbench.tsx`: Tree-Head Z. 462; `docKicker` Z. 352/355/358 («KI-Fluency · …» → «KI-Toolbox · …»); ZIP-Labels/Dateinamen Z. 276/291/305; README-Text Z. 611.
- `src/lib/einheiten/docx-builder.ts` + `DocKi`/`DocLernprompt`/`DocLernbegleiter`: sichtbare Titel/Kicker.
- **Skill** `hko-ki-komplement`: Namensnennungen.
- `CLAUDE.md`: Erwähnungen aktualisieren (Doku-Hygiene; Key-Erklärung bleibt).

**Akzeptanz:** Kein learner-/LP-sichtbares «KI-Fluency» mehr; interner Key + `entwurf_komponenten`-Logik unverändert funktionsfähig.

---

## Item 4 — Renderer: geschlossenes Dropdown + KI-Badge + Info-Banner (EFZ)

**Ziel:** KI-Toolbox weniger prominent; klar als optionales Zusatzangebot markiert.

**Datei:** `src/components/einheiten/EinheitWorkbench.tsx` (Tree-Gruppe Z. ~460–500) + `src/styles/einheiten-renderer.css`.

**Änderungen:**
1. KI-Toolbox-`wb-tree-group` **standardmässig eingeklappt** (z. B. `<details>` ohne `open`, oder State-Toggle). Default zu, per Klick öffnen.
2. **Badge «KI»** am Gruppen-Kopf neben «KI-Toolbox».
3. **Info-Banner** (eingeblendet beim Öffnen / über dem aktiven KI-Dokument) mit Text:
   - Der Einsatz dieser Materialien entscheidet die **Lehrperson** (optionales Zusatzangebot, kein Pflichtteil der Einheit).
   - Hinweis: als **Word-Datei** herunterladbar und **nach Bedarf anpassbar**.
   - **Tipps zur Reduktion der Dichte:** in **Gruppenarbeit** einsetzen · als **Vertiefung für starke Lernende** · zum **Üben vor dem Kompetenznachweis**.

**Abgrenzung kommunizieren:** Einheit = 3 Herausforderungen + KN + Lehrperson/Bewertung (verbindlich); KI-Toolbox = optionales Add-on.

**Akzeptanz:** KI-Toolbox erscheint zu/collapsed mit «KI»-Badge; beim Öffnen erscheint der Info-Banner mit obigem Inhalt.

---

## Item 5 — «EBA – Coming Soon»-Hinweis veröffentlichen

**Ziel:** EBA-Lehrpersonen sehen, dass Material in Arbeit ist (vor offizieller Freigabe / Termin 02.07.).

**Dateien (empfohlen):**
- `src/pages/einheiten/index.astro` — Info-Banner im Katalog: «EBA – in Vorbereitung / demnächst verfügbar».
- `src/pages/index.astro` (Hauptplattform-Hub) — kurzer Hinweis auf der EBA-Gate/Karte.

Beachten: EBA-Einheiten können `status: "entwurf"` (KT1-only) sein — der Hinweis ersetzt für lp/gast die noch nicht sichtbaren Einheiten, damit klar ist «kommt», nicht «vergessen». Design dezent, single-green.

**Akzeptanz:** lp/gast sehen einen klaren «EBA kommt»-Hinweis; keine Entwurf-Einheit wird dadurch vorzeitig sichtbar.

---

## Item 6 — Bewertungsskala 90/90/100 → 60/80/100 (EFZ + Skills)

**Ziel:** Skala generell auf «unter 60 % / 80 % / 100 %» umstellen.

**Dateien:**
- Alle `src/data/einheiten/*/kn.json` mit Skala-Labels: `"unter 90 %"` → `"unter 60 %"`, `"90 %"` → `"80 %"`, `"100 %"` → `"100 %"`. (Erst alle Vorkommen greppen, dann ersetzen — pro Datei prüfen.)
- `src/components/einheiten/docs/DocKnS.tsx` Z. 18–25: Label-Interpreter anpassen. Reihenfolge der `includes`-Checks beachten (zuerst `'100'`, dann `'80'`, dann `'60'`), damit Teilstring-Treffer nicht kollidieren. Mapping-Texte («Grundanforderung erfüllt» / «Vollständig & selbstständig») an die neue 3-Stufen-Logik anpassen.
- **Skill** `bbw-hko-3er-set` (und EBA-/KI-Skill, falls sie eine KN-Skala emittieren): Template auf 60/80/100 umstellen, **damit neue Einheiten** direkt korrekt generieren.
- Danach `npm run build:einheiten-index`.

**Akzeptanz:** Kein «90 %»-Label mehr in EFZ-KN; `DocKnS` rendert die drei neuen Stufen korrekt mit Legende; neu generierte Einheiten nutzen 60/80/100.

---

## Reihenfolge & Abschluss

1. Item 3 (Rename) + Item 6 (Skala) — mechanisch, breit, zuerst.
2. Item 2 (Wortlaut) — schnell.
3. Item 4 (Renderer-Dropdown/Banner) — UI.
4. Item 1 (Infokarte) — grösstes Design-Stück; EBA-Herausforderung-Rendering zuerst verifizieren.
5. Item 5 (Coming-Soon) — zuletzt.
6. **Skills aktualisieren** (Items 1, 2, 3, 6), damit neue Generationen die Änderungen erben.
7. **Verifikation:** `npm run build:einheiten-index` → `npm run build` → `npm run dev`: je eine EFZ-Einheit (KN-Skala, KI-Toolbox zu/Badge/Banner) und die EBA-Einheit `1.1.1_lehrvertrag_orientieren` (Infokarte-Codes Herausforderung↔Glossar+, Copilot-Wortlaut) sichtprüfen.

**Offene Implementierungs-Detailfrage** (vom Umsetzer zu klären, nicht von Pietro): Wie genau werden EBA-`herausforderung_A/B.json` gerendert (eigene Komponente vs. `DocS`)? Davon hängt ab, wo die Infokarten-Referenz auf der Herausforderung platziert wird.
