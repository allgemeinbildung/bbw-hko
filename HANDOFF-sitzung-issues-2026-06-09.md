# Claude Code Handoff — Plattform-Issues aus Sitzung 09.06.2026

Adressat: Claude Code (im Repo `bbw-hko`). Quelle: Kernteam-1 Sitzung 5 + Code-Recherche.
Umfang: **A1, B1, B2, B3, D1, D2, D4, D6, D7, E1**. Jeder Punkt enthält **Ursprung** (verifiziert im Code), **Änderung**, **Acceptance** und **Risiko/Confidence**.

## Grundregeln für diesen Auftrag

- Stack: Astro 4 SSR + Supabase + Tailwind + Alpine; `/einheiten/**` nutzt React-Islands. Single-green Designsystem (siehe `CLAUDE.md` → keine neuen Workflow-Farben).
- Nach jeder Änderung an `src/data/einheiten/<slug>/*`: **`npm run build:einheiten-index`** ausführen (regeneriert `src/data/einheiten.index.json`). Danach `npm run build` als Smoke-Test.
- **Den eigenständigen `/situationen`-Katalog (60 Einzel-Situationen) NICHT umbenennen** — die heissen bewusst weiterhin «Situationen». «Herausforderung» gilt nur *innerhalb einer Einheit* (die 3 Teile A/B/C).
- **DB-Spaltennamen NICHT ändern** (`genutzt_sit_a`, `qualitaet_situation`, `situation_id` …). Nur sichtbare UI-Labels. Keine neue Migration nötig ausser wo unten explizit erwähnt (keine ist nötig).
- **Keine Dateien löschen** ohne Pietros Freigabe (Projektregel). Hinweis: `src/components/einheiten/docs/.fuse_hidden0000000f00000001` ist eine verwaiste Editor-Temp-Datei — **nicht** anfassen/committen, nur ignorieren.
- Trenne sauber **Code-Changes** (du erledigst sie) von **Inhaltsentscheiden** (mit ⚠️ markiert — Pietro muss Werte/Wording liefern).

---

## A1 — Upload im «Feedback nach Unterricht» funktioniert (angeblich) nicht 🔴

**Ursprung (verifiziert):** Die Infrastruktur ist vollständig vorhanden und korrekt verdrahtet:
- Form + JS: `src/pages/einheiten/[setKey]/feedback.astro` (Upload-Logik `uploadIdeeDateien()` Z. 354-364, ruft `POST /api/einheit-feedbacks/{id}/files`).
- Endpoint: `src/pages/api/einheit-feedbacks/[id]/files.ts` → delegiert an `src/lib/feedback-uploads.ts` (`handleUpload/Delete/Get`, Bucket `feedback-uploads`, Spalte `idee_dateien`).
- Migration `012` legt Bucket + `idee_dateien jsonb` an.

Es gibt **keinen offensichtlichen Codefehler** — Pietro hat «nur nicht getestet». Aber zwei **echte Schwachstellen** im Flow:
1. **Upload ist an die Checkbox «neue Idee» gekoppelt.** In `send()` (Z. 422) wird `uploadIdeeDateien()` nur aufgerufen wenn `payload.neue_idee` true ist. Wählt eine LP Dateien, ohne die Checkbox zu setzen, passiert nichts — wirkt wie «Upload kaputt».
2. **Race/UX:** Dateien lassen sich erst nach dem ersten Speichern hochladen (es braucht `savedFeedbackId`). Der Hinweis dazu ist da (`idee-upload-hint`), aber wenn jemand direkt «Feedback einreichen» klickt, wird in *einem* Schritt gespeichert **und** hochgeladen — wenn der Upload fehlschlägt (z.B. Bucket fehlt in dieser Supabase-Umgebung), bricht der ganze Submit ab.

**Änderung:**
1. **Verifizieren statt vermuten:** Prüfe, dass der Bucket `feedback-uploads` in der aktiven Supabase-Instanz wirklich existiert (Migration `012` angewandt). Wenn nicht → das ist die wahre Ursache; Migration anwenden. Dokumentiere das Ergebnis im PR.
2. Upload **entkoppeln** vom `neue_idee`-Flag: wenn Dateien im `#idee-files`-Input liegen, sollen sie nach dem Speichern hochgeladen werden, unabhängig von der Checkbox (oder: Checkbox automatisch setzen, sobald eine Datei gewählt wird).
3. Upload-Fehler **nicht fatal** für den Submit machen: Bei `eingereicht` zuerst die Feedback-Zeile sicher speichern, dann Upload versuchen; schlägt nur der Upload fehl, Zeile bleibt gespeichert und es erscheint eine klare Teil-Fehlermeldung statt Totalabbruch.
4. Smoke-Test mit echter Datei (PDF + Bild), inkl. Entfernen (DELETE) und Download (GET-Redirect 302).

**Acceptance:** Als LP kann ich (a) Entwurf speichern, (b) Datei hochladen, (c) sie in der Liste sehen + entfernen, (d) final einreichen — ohne dass ein Upload-Fehler das gespeicherte Feedback verwirft. Funktioniert auch ohne gesetzte «neue Idee»-Checkbox.

**Risiko/Confidence:** Mittel. Code ist gesund; höchste Wahrscheinlichkeit ist eine fehlende Bucket-/Migration-Anwendung in der Zielumgebung — zuerst das prüfen.

---

## B1 — Einheiten-Kachel zeigt nur «1.1.1», soll abgedeckte Kompetenzen zeigen (z.B. 1.1.1 + 1.1.3) 🔴

**Ursprung (verifiziert):**
- Kachel rendert in `src/pages/einheiten/index.astro` Z. 78-104 nur `prettifyId(e.id)` (→ «1.1.1 · konflikt kommunizieren») + `e.titel`. **Keine Kompetenz-Tags.**
- Datenquelle: `kompetenz_nr` wird im Build aus dem Slug-Präfix abgeleitet (`scripts/build-einheiten-index.mjs`), ist immer ein Einzelwert.
- Es **gibt bereits** ein plural-fähiges Feld in den Rohdaten: `herausforderung_A.json → nrlp.nr_primary[]`. **Aktuell steht dort aber nur `["1.1.1"]`** in beiden Einheiten — die im Meeting genannte Doppelabdeckung (1.1.1 + 1.1.3) ist **noch nicht in den Daten**.

**Änderung (Code):**
1. `scripts/build-einheiten-index.mjs`: neues Feld **`abgedeckte_kompetenzen: string[]`** pro Einheit = Union aus `nrlp.nr_primary` der drei Herausforderungen A/B/C, Fallback `[kompetenz_nr]`. Sortiert, dedupliziert.
2. `src/lib/einheiten/types.ts`: `abgedeckte_kompetenzen: string[]` zu `EinheitIndexEntry` hinzufügen.
3. `src/pages/einheiten/index.astro`: unter dem Titel (Z. ~83) eine Chip-Reihe rendern — pro Eintrag ein `chip chip-blue` (brand-tint, vorhandene Klasse). Wenn nur ein Wert vorhanden, trotzdem als Chip zeigen.
4. `applyEinheitenFilters` (`src/lib/einheiten/index.ts`): Volltext-`hay` um `abgedeckte_kompetenzen.join(' ')` ergänzen, damit Suche nach «1.1.3» trifft.
5. `npm run build:einheiten-index` ausführen, Output committen.

**Änderung (Inhalt ⚠️ — Pietro):** Damit die Kachel «1.1.1 + 1.1.3» zeigt, muss `nrlp.nr_primary` in den betroffenen `herausforderung_*.json` auf `["1.1.1","1.1.3"]` erweitert werden. **Welche Einheit welche Kompetenzen real abdeckt, entscheidet Pietro** — nicht raten. Lege im PR eine kurze Notiz an, wo der Wert gepflegt werden muss, und setze ihn erst nach seiner Bestätigung. (Pietro im Meeting: beide 1.1-Einheiten decken 1.1.1 **und** 1.1.3 ab, nicht aber 1.1.2/Onboarding.)

**Acceptance:** Kachel zeigt Titel + Tag-Chips aller `abgedeckte_kompetenzen`. Suche nach einer Sekundär-Kompetenz findet die Einheit. Mechanik funktioniert datengetrieben (kein hartkodiertes «1.1.3»).

**Risiko/Confidence:** Code hoch. Daten-Teil bewusst offen gelassen (Inhaltsentscheid).

---

## B2 — Kompetenznummer fehlt im ausgedruckten Dokument 🟠

**Ursprung (verifiziert):** Auf den Seiten steht die Nummer im Header (`[setKey].astro` Z. 35, feedback Z. 32), aber die **druckbaren Dokumente** (DocS / DocKnS / DocKnLp unter `src/components/einheiten/docs/`, gerendert via `renderToStaticMarkup` ins Bundle-ZIP) tragen die Kompetenznummer nicht im Seitenkopf/-fuss. Christof: beim Ausdrucken «geht das verloren».

**Änderung:**
1. In den Dokument-Headern/-Footern von `DocS.tsx`, `DocKnS.tsx`, `DocKnLp.tsx` (und ggf. `chrome.tsx`, das gemeinsame Kopf-/Fusszeilen-Gerüst) die **`kompetenz_nr`** (plus `abgedeckte_kompetenzen` aus B1, falls verfügbar) einblenden — dezent, z.B. in der Fusszeile «ABU 2030 · Kompetenz 1.1.1 (+1.1.3)».
2. Quelle der Nummer: `kn.json.kompetenz_nr` / `prinzip.json.kompetenz_nr` bzw. via Props aus der Workbench durchreichen.
3. Auch die Bundle-`README` (in `EinheitWorkbench.tsx` generiert) um die Kompetenznummer(n) ergänzen.

**Acceptance:** Jedes Schüler-/LP-Dokument zeigt auf jeder Seite (Kopf oder Fuss) die Kompetenznummer; im PDF/Druck sichtbar.

**Risiko/Confidence:** Mittel. Vor Edit `DocS.tsx`/`chrome.tsx` lesen, um den bestehenden Kopf-/Fuss-Mechanismus zu treffen (nicht neu erfinden).

---

## B3 — «Was deckt diese Einheit ab?»-Übersicht fehlt 🟠

**Ursprung (verifiziert):** Weder Kachel (`index.astro`) noch Detailseite (`[setKey].astro`, Z. 31-43 zeigt nur Lehrgang/Thema/2 Aspekt-Chips) bieten eine kompakte Abdeckungs-Übersicht. Alle nötigen Daten liegen aber bereits im Index: `abgedeckte_kompetenzen` (B1), `sprachmodi[]`, `aspekte[]`, `sk[]`, `herausforderungen[]`, `kn_typen[]`, `thema_nr`.

**Änderung:** Auf der **Detailseite** `[setKey].astro` (oberhalb der Workbench) ein kompaktes Panel «Was deckt diese Einheit ab?» rendern:
- Kompetenz(en): `abgedeckte_kompetenzen`
- Sprachmodi: `meta.sprachmodi` (mit Hinweis primär/sekundär falls verfügbar)
- Aspekte: `meta.aspekte`
- Schlüsselkompetenzen: `meta.sk` → via `skNameByNr()` (schon importiert in feedback.astro) als Chips
- 3 Herausforderungen (`hf_titel`) + verfügbare KN-Typen (`kn_typen`)
- Richtwert Lektionen: aus Begleiter (ca. 3-7 L. + KN) — als statischer Hinweistext, **nicht** hart pro Einheit erfinden.

Optional kleine Kurzfassung (nur Kompetenz + Aspekte) zusätzlich auf der Kachel.

**Acceptance:** Auf der Einheit-Detailseite sieht die LP auf einen Blick, welche Kompetenzen/Sprachmodi/SK/Aspekte abgedeckt sind, ohne das Begleitdokument öffnen zu müssen.

**Risiko/Confidence:** Hoch — rein additive UI aus vorhandenen Index-Feldern, single-green Chips.

---

## D1 — Restliche «Situation(en)» → «Herausforderung(en)» *innerhalb der Einheiten* 🟠

**Ursprung (verifiziert):** Im Einheiten-Kontext heissen die 3 Teile teils noch «Situation»:
- `src/pages/index.astro` Z. 19: Blurb «3 Situationen A/B/C …» → «3 Herausforderungen A/B/C».
- `src/pages/einheiten/[setKey]/feedback.astro`: Checkbox-Labels «Situation A/B/C» (Z. 75-77) und «Qualität der Situationen» (Z. 98) → «Herausforderung A/B/C» / «Qualität der Herausforderungen». **Achtung:** nur die *Labels*, die `name`-Attribute (`genutzt_sit_a`, `qualitaet_situation`) bleiben.
- `CLAUDE.md` (Doku) beschreibt Einheit als «3 Situationen» — zur Konsistenz ebenfalls auf «Herausforderungen» anpassen.

**NICHT anfassen:** `src/pages/situationen/**` (eigenständiger 60er-Katalog) und alle DB-Spalten/`SituationJson`-Typen/`hybrid_situation`-Felder.

**Vorgehen:** `grep -rn "Situation" src/pages/einheiten src/components/einheiten src/pages/index.astro` und nur **sichtbare deutsche Labels** im Einheiten-Kontext ersetzen. Vorhandenes `handoff_terminology_rename.md` im Repo-Root vorher konsultieren (evtl. Teil schon spezifiziert).

**Acceptance:** Innerhalb einer Einheit (Home-Blurb, Feedback-Form, Doku) steht durchgängig «Herausforderung». Der 60er-Situationen-Katalog bleibt «Situationen». Build grün, Formular-POST unverändert funktionsfähig.

**Risiko/Confidence:** Hoch, aber sorgfältig: nur Labels, keine `name`/Feld-/Typ-Namen.

---

## D2 — «Einheit» → «Unterrichtseinheit» im Katalog 🟢

**Ursprung (verifiziert):** «Einheit(en)» als Label u.a. in `einheiten/index.astro` (Z. 36 «Einheiten-Katalog», Z. 38 «X von Y Einheiten», Z. 42), `layouts/Einheiten.astro` (Z. 30 «Katalog Einheiten», Z. 62 «Einheiten-Katalog · Pilot»), `pages/index.astro` (Z. 18 «Katalog Einheiten»).

**Änderung:** Christofs Punkt: «Unterrichtseinheit» ist eindeutiger. Sichtbare Überschriften/Tab-Labels auf **«Unterrichtseinheiten»** bzw. «Katalog Unterrichtseinheiten» anpassen. ⚠️ **Konsistenz-Entscheid:** entweder überall «Unterrichtseinheit» **oder** bewusst kurz «Einheit» lassen — Pietro/Team bestätigen, ob durchgängig umbenannt wird (Routen `/einheiten` bleiben technisch gleich). Default-Vorschlag: Überschriften + Tabs auf «Unterrichtseinheiten», Fliesstext-Erwähnungen optional.

**Acceptance:** Katalog-Titel und Navigations-Tab lesen «Unterrichtseinheiten»; URLs unverändert.

**Risiko/Confidence:** Hoch (reine Labels). Inhaltlich nur die Ja/Nein-Bestätigung der Durchgängigkeit offen.

---

## D4 — «Werkschau» vs. «Portfolio» 🟠 (Begriff NICHT blind umbenennen)

**Ursprung (verifiziert):** «Werkschau» als KN-Typ ist an mehreren Stellen hart hinterlegt:
- Daten: `kn.json → kn_typen[].label` «Werkschau + Transfer-Reflexion» (beide Einheiten), gespiegelt in `einheiten.index.json`.
- UI/Logik: `src/components/einheiten/docs/DocKnS.tsx` Funktion `WerkschauPages` + Branch `knTyp==='werkschau_transfer'`.
- Jahresplanung: `jahresplanung.astro` Z. 526 `<option value="werkschau_transfer">Werkschau / Transfer</option>` und Z. 185 «Portfolio-Review».
- Begleiter-MD-Tabellen («Werkschau + Transfer …»).

**Wichtig:** Das Meeting hat **nicht entschieden**, ob es «Werkschau» oder «Portfolio» heisst — man wartet auf die **Kantons-Terminologie**. Also **jetzt nicht umbenennen.**

**Änderung (jetzt):**
1. **Zentralisieren statt verstreuen:** Den Anzeige-Label des KN-Typs aus *einer* Quelle beziehen (z.B. Map `{ werkschau_transfer: 'Werkschau + Transfer-Reflexion', … }` in `src/lib/einheiten/`), damit ein späterer Rename ein Einzeiler ist. Den internen Key `werkschau_transfer` **unverändert** lassen (stabiler Identifier).
2. Glossar-Eintrag für «Werkschau» anlegen (siehe D7), inkl. Platzhalter «Kanton-Begriff: noch offen».
3. Im PR die vollständige Fundstellen-Liste dokumentieren, damit der spätere Rename ein gezielter Commit wird.

**Acceptance:** Kein funktionaler Rename; aber Label kommt aus einer Quelle und ist im Glossar erklärt. Späterer 1-Zeilen-Rename möglich.

**Risiko/Confidence:** Mittel — bewusst konservativ (Kanton-Begriff abwarten).

---

## D6 — «du» vs. «Sie» inkonsistent 🟠 (heikel, Review nötig)

**Ursprung (verifiziert):** Beschluss: **«Sie»**, ausser in ICH-Perspektive-Texten (Situationstext/Persona). In den Daten dominiert aber «du»: ~113 Treffer in 8 `herausforderung_*.json`/`kn.json` (plus Begleiter-MD). Beispiel `herausforderung_B.json` Z. 86 «… wenn dein Berufsbildner/in …», Z. 283 «… ob du die Kanal-Konsequenzen …».

**Falle (verifiziert):** Manche Treffer sind **kein** Anrede-«du», sondern Inhalt über die du-Form, z.B. `herausforderung_B.json` Z. 169/188 «**Du-Form vermeiden**; Ich-Botschaften verwenden». Ein blinder Find/Replace zerstört diese Stellen und ggf. ICH-Sätze.

**Änderung:**
1. **Kein globaler sed.** Skriptgestützt **Kandidaten extrahieren** (Datei + Zeile + Kontext) und als Review-Liste ausgeben.
2. Regeln: Anrede-«du/dein/dich/dir» in **Aufträgen, Leitfragen, Schritten, Hinweisen, KN-Aufgaben** → «Sie/Ihr/Ihnen» + Verbformen anpassen (nicht nur Pronomen!). **Ausnehmen:** (a) Situationstext/Persona in ICH-Form, (b) Meta-Erwähnungen wie «Du-Form», (c) wörtliche Zitate.
3. Felder, die klar Anrede sind, gezielt transformieren; alles Unklare in der Review-Liste an Pietro.
4. Nach Daten-Edits: `npm run build:einheiten-index`.
5. Separat: das in der Triage genannte «entscheide begründet» (Imperativ-Duzen) auf «Entscheiden Sie begründet» — als Teil derselben Regel.

**Acceptance:** In Aufträgen/Anweisungen durchgängig «Sie»; ICH-Situationstexte und «Du-Form»-Meta-Stellen unverändert; eine Review-Liste der unsicheren Fälle liegt dem PR bei.

**Risiko/Confidence:** **Niedrig-mittel** — sprachlich heikel, erfordert menschliche Endkontrolle. Lieber halbautomatisch + Reviewliste als aggressiv.

---

## D7 — Glossar fehlt 🟢

**Ursprung (verifiziert):** Keinerlei Glossar im Code. Christof: ~10 Kernbegriffe, aufklappbar; ohne Begriffsklärung «keine Orientierung».

**Änderung:**
1. **Single source:** `src/data/glossar.json` — Array `{ begriff, kurz, lang?, kanton_alias? }`. Startbegriffe: Unterrichtseinheit, Herausforderung, Handlungsprodukt, Kompetenznachweis, Hybrid-Herausforderung, Werkschau, Austausch & Transfer, Ressourcen, Sprachmodus, Schlüsselkompetenz, AViVA, IPERKA.
2. Komponente `src/components/Glossar.astro` — aufklappbares `<details>` im single-green Stil.
3. Einbinden: ausklappbar unten/oben im **Einheiten-Katalog** (`einheiten/index.astro`) und optional als eigene Route `/glossar`, verlinkt in `layouts/Einheiten.astro`-Topbar.
4. ⚠️ **Inhalt der Definitionen** kommt von Pietro/Christof — du legst Gerüst + Platzhaltertexte an, markierst `kanton_alias` als «offen» wo der Kanton-Begriff aussteht (Bezug zu D4).

**Acceptance:** Aufklappbares Glossar mit den Kernbegriffen, eine Datenquelle, single-green; Definitionen als befüllbare Platzhalter.

**Risiko/Confidence:** Hoch (Gerüst). Texte = Inhaltsarbeit.

---

## E1 — AViVA im Begleiter: «eine Lektion pro AViVA» vs. Wocheneinheit 🟠 (Inhaltsentscheid)

**Ursprung (verifiziert):** In `1.1.1_konflikt_kommunizieren/begleiter.md` Z. 38 «| Eine einzelne Lektion | **AVIVA** | …» und `1.1.1_rechte_verstehen_nutzen/begleiter.md` Z. 48 «**Eine einzelne Lektion** → AVIVA». Tamara: im Lehrer-Dokument soll AViVA als **3-Lektionen-/Wocheneinheit** hinterlegt sein, nicht als Einzellektion. Der `begleiter-builder.ts` erzeugt dazu **kein** Label selbst — die Aussage steht rein im **Markdown-Inhalt**.

**Spannung (zur Info):** AViVA ist didaktisch eigentlich ein *Innerhalb-einer-Lektion*-Bogen (Ankommen→Vorwissen→Informieren→Verarbeiten→Auswerten). Tamaras Wunsch (AViVA = Wocheneinheit) ist daher ein **didaktischer Entscheid**, kein reiner Tippfehler.

**Änderung:**
1. ⚠️ **Vor dem Edit Wording mit Pietro/Tamara bestätigen.** Sobald bestätigt: in beiden `begleiter.md` die betroffenen Zeilen so umformulieren, dass AViVA pro **Wocheneinheit (3 Lektionen)** ausgewiesen wird (statt «eine einzelne Lektion»), und die Fahrplan-Tabellen-Überschriften entsprechend anpassen.
2. Nach Edit: `npm run build:einheiten-index` (Begleiter-Meta) + Begleiter-DOCX-Export gegenprüfen (`/api/einheit-begleiter-docx/[setKey]`).

**Acceptance:** Begleiter-Dokumente beschreiben AViVA konsistent als Wocheneinheit (nach Tamaras/Pietros bestätigtem Wording); Word-Export stimmt.

**Risiko/Confidence:** Mittel — reiner Content-Edit, aber **erst nach inhaltlicher Bestätigung**.

---

## Reihenfolge-Vorschlag

1. **A1** (Bucket prüfen → Upload entkoppeln/härten) — blockt die Schulung.
2. **B1 + B2 + B3** zusammen (gleiche Dateien: Index-Build, Types, Kachel, Detailseite, Doc-Header).
3. **D1 + D2** (Label-Renames, eine Runde, Build-Check).
4. **D7** Glossar-Gerüst, dann **D4** (Label zentralisieren + Glossar-Eintrag).
5. **E1** und **D6** zuletzt — beide brauchen **Pietros/Tamaras inhaltliche Freigabe**, bevor Daten geändert werden.

## Was Claude Code NICHT allein entscheidet (⚠️ an Pietro)

- B1: welche `nr_primary`-Werte (1.1.3?) je Einheit real gelten.
- D2: ob durchgängig «Unterrichtseinheit».
- D4: finaler KN-Typ-Begriff (Kanton).
- D6: Endkontrolle der du→Sie-Reviewliste.
- E1: exaktes AViVA-/Wocheneinheit-Wording.
- D7: Definitionstexte + Kanton-Aliase.

*Erstellt aus Code-Recherche im Repo (Stand 2026-06-09) + Sitzungstranskript.*
