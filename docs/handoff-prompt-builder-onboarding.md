# Handoff — Onboarding-Guide für den Prompt-Builder (web-onboarding-builder)

**Ziel.** Mit der Skill `web-onboarding-builder` einen Schritt-für-Schritt-Onboarding-Guide für den **Prompt-Builder** erzeugen — als `guide.html` (Dokument- + Folien-Ansicht, druckt 1 Schritt pro A4-Seite), `guide.md` und `guide.pdf`. Zielgruppe: **Lehrpersonen (Rolle `lp`)**, Sprache **Deutsch**.

**Warum dieser Handoff.** Die Screenshot-Capture der Skill fährt die *Live-Site* mit Playwright an. In der Cowork-Sandbox ist `bbw-hko.ch` (und `abu-hko.ch` / `*.vercel.app`) durch den Proxy gesperrt — nur npm/github sind erreichbar. Darum wird die Capture **lokal in Claude Code** auf Pietros Rechner ausgeführt, wo der Browser die Seite erreicht.

---

## 0. Was der Prompt-Builder tut (Kontext für gute Captions)

Unter-App des nRLP-Graphen, eingebettet in BBW-Chrome (`src/pages/prompt-builder.astro` → iframe auf `/nrlp/prompt-builder/index.html?role=<role>`). Ablauf für die Lehrperson:

1. **Modus wählen:** A *Lehrplankonform* · B *Freie Auswahl* · C *Combo*.
2. **Thema → Lebensbezug → Kompetenz(en)** aus der nRLP wählen (Dataset 2j/3j/4j).
3. Das Tool zieht automatisch je Kompetenz die **Gesellschaftsinhalte** + **Sprachmodi** (mit `detail`) und die **Schlüsselkompetenzen** des Themas und baut daraus einen ausgefeilten LLM-Prompt.
4. **Output-Typ** wählen — 6 Typen: *Lernsituation, Aufgabe, Raster, Prüfung, Arbeitsblatt, Reflexion* + eine **6-Schritt-Combo-Kette**.
5. Prompt **kopieren / herunterladen**, in ein LLM einfügen.

Der Guide soll genau diesen Weg abbilden: vom Einstieg über die Auswahl bis zum fertigen, kopierbaren Prompt.

---

## 1. Skill-Speicherort & Setup

Die Skill liegt unter:
`.claude/skills/web-onboarding-builder/` (SKILL.md, `scripts/`, `assets/`).

Arbeitskopie anlegen (Skill-Dateien bleiben read-only):

```bash
cd .claude/skills/web-onboarding-builder
mkdir -p onboarding
cp -r scripts assets onboarding/
cd onboarding/scripts && npm install      # installiert Playwright + Chromium (nur beim 1. Mal)
```

Danach lebt alles unter `.claude/skills/web-onboarding-builder/onboarding/` (`flows/`, `output/`). Den `onboarding/`-Ordner kannst du ins Repo committen; **`auth.json` aber NICHT** (→ `.gitignore`).

---

## 2. Zieladresse & Wichtiges zum iframe

**Empfohlenes Capture-Ziel: die innere App direkt**, nicht die BBW-Hülle:

```
https://bbw-hko.ch/nrlp/prompt-builder/index.html?role=lp
```

Grund: `/prompt-builder` rendert nur die BBW-Chrome + ein **iframe** mit der eigentlichen App. Playwright-Selektoren müssten sonst durch `frameLocator(...)` ins iframe greifen — fehleranfällig und die Screenshots zeigen unnötig viel Rahmen. Wenn du die **innere URL** direkt anfährst, sind alle Selektoren top-level und die Screenshots zeigen sauber das Werkzeug.

**Ausnahme — 1 Kontext-Screenshot:** Für den allerersten Schritt («Wo finde ich den Prompt-Builder?») lohnt ein Screenshot der Hülle `https://bbw-hko.ch/prompt-builder` (zeigt die BBW-Kopfzeile + Rück-Link «← nRLP-Netzwerk»). Danach auf die innere URL wechseln.

> **Fallback ohne Login:** Falls die alte Deployment-Version noch online ist, ist sie evtl. ohne Anmeldung erreichbar: `https://abu-hko.ch/nrlp/prompt-builder/`. Dann entfällt Abschnitt 3 (Auth) ganz. Prüfe kurz, ob UI/Labels identisch sind.

---

## 3. Auth — zwei Wege

Die Route hinter `bbw-hko.ch` braucht eine Session. Zwei Optionen:

**a) Gast-Login als Flow-Schritte (kein `auth.json`, empfohlen — codelos).**
Der Gast-Zugang ist codelos: `/welcome` → Button «Als Gast ansehen» → `POST /api/auth/guest` → Session. Die Rolle `gast` ist eine gültige Session, die `getAccess` passieren lässt; die Prompt-Builder-Seite rendert das iframe (Rolle wird durchgereicht). Lege darum als **erste Flow-Schritte** den Gast-Login an, danach `goto` auf die innere URL:

```jsonc
{ "action": "goto",  "value": "https://bbw-hko.ch/welcome",            "caption": "..." },
{ "action": "click", "selector": "text=Als Gast ansehen",             "caption": "..." },
{ "action": "waitForSelector", "selector": "text=Prompt-Builder", "state": "visible" },
```

> Hinweis: Mit Gast-Rolle sind Entwurf-Inhalte ausgeblendet (wie bei `lp`) — für einen LP-Guide korrekt. Wenn du den Builder als echte `lp`/`kt1` zeigen willst, nutze stattdessen Variante (b).

**b) Echte Anmeldung einmalig aufzeichnen (`auth.json`).**
```bash
cd .claude/skills/web-onboarding-builder/onboarding/scripts
node capture.mjs auth https://bbw-hko.ch/login --out ../auth.json
```
Ein sichtbarer Browser öffnet sich, du meldest dich von Hand an (E-Mail/PW oder Microsoft-SSO), Enter drücken → Session in `auth.json`. Im Flow `"auth": "../auth.json"` setzen und die `/welcome`-Schritte weglassen. **`auth.json` nie committen.** (Supabase-JWT laufen nach ~1 h ab — bei plötzlichen Timeouts Auth neu aufnehmen.)

---

## 4. Selektoren aus dem Quellcode holen (Repo-Modus)

**Bevor du den Flow finalisierst:** Lies die echte App, um stabile Selektoren statt geratener Texte zu verwenden. Die statischen App-Dateien liegen nach dem Graph-Import (`scripts/import-nrlp-graph.ps1`) unter:

```
public/nrlp/prompt-builder/index.html      # Aufbau, Buttons, data-/id-Attribute
public/nrlp/prompt-builder/render.js       # wie Thema/LB/Kompetenz/Chips gerendert werden
public/nrlp/prompt-builder/app.js          # selectThema / selectLB / toggleKomp, init(), Query-Parameter
public/nrlp/prompt-builder/prompts.js      # Output-Typen, Combo-Kette
public/nrlp/prompt-builder/style.css       # Klassennamen
```

Falls dieser Ordner **noch nicht existiert** (Import nicht gelaufen), zuerst `scripts/import-nrlp-graph.ps1` ausführen (siehe `docs/handoff-nrlp-prompt-builder.md`) **oder** gegen `abu-hko.ch` capturen und die Selektoren dort per DevTools verifizieren.

**Suche gezielt nach:** `id=`, `data-*`, `aria-label`, Button-Beschriftungen für: Modus-Umschalter (A/B/C), Thema-Liste, Lebensbezug-Liste, Kompetenz-Checkboxen/-Chips, «Empfohlene Taxonomie»-Bereich, die 6 Output-Typ-Buttons, den **Generieren**-Button, sowie **Kopieren** / **Download**. Ersetze die Platzhalter-Selektoren in Abschnitt 5 durch die echten.

> **Tipp Deep-Link:** `app.js init()` liest laut `docs/handoff-nrlp-prompt-builder.md` Query-Parameter `?thema=<n>&lb=<nr>&komp=<nr>`. Falls implementiert, kannst du Thema/LB/Kompetenz **per URL vorwählen** statt zu klicken — robuster als Klick-Selektoren. Dann brauchst du nur noch je 1 Screenshot des vorbefüllten Zustands. Vorher im Quellcode prüfen, ob die Parameter wirklich gelesen werden.

---

## 5. Flow-Datei

Lege `onboarding/flows/prompt-builder.json` an. Unten ein vollständiger Entwurf mit **deutschen Captions** und **Platzhalter-Selektoren** (die `TODO`-Selektoren in Abschnitt 4 gegen echte tauschen). Reihenfolge: Einstieg → Modus → Thema → Lebensbezug → Kompetenz → Auto-Taxonomie → Output-Typ → Generieren → Kopieren. Ein zweiter `section`-Block zeigt die Combo-Kette.

```jsonc
{
  "name": "Prompt-Builder — vom Lehrplan zum fertigen LLM-Prompt",
  "description": "Schritt für Schritt: aus Thema, Lebensbezug und Kompetenz der nRLP einen ausgefeilten Prompt für Lernsituationen, Aufgaben, Raster, Prüfungen, Arbeitsblätter und Reflexionen erzeugen.",
  "baseUrl": "https://bbw-hko.ch",
  "auth": null,
  "lang": "de",
  "viewport": { "width": 1280, "height": 860 },

  // Optional: fertige Dateien automatisch ins Repo kopieren.
  "deploy": {
    "html": "../../../../public/guides/prompt-builder.html",
    "pdf":  "../../../../public/guides/prompt-builder.pdf"
  },

  "steps": [
    // --- Einstieg (Gast-Login, codelos) ---
    { "action": "goto",  "value": "/welcome", "section": "Einstieg",
      "caption": "Öffne die Plattform und klicke unten auf «Als Gast ansehen» (kein Code nötig). Mit einem BBW-Login kannst du dich stattdessen anmelden." },
    { "action": "click", "selector": "text=Als Gast ansehen", "section": "Einstieg",
      "caption": "Klicke auf «Als Gast ansehen», um die Kataloge und Werkzeuge zu öffnen." },

    // --- Kontext: wo liegt der Prompt-Builder ---
    { "action": "goto", "value": "/prompt-builder", "section": "Einstieg",
      "caption": "Öffne den Prompt-Builder. Über «← nRLP-Netzwerk» gelangst du jederzeit zurück zum Lehrplan-Graphen." },

    // --- Ab hier die innere App direkt (saubere Screenshots ohne iframe-Rahmen) ---
    { "action": "goto", "value": "/nrlp/prompt-builder/index.html?role=lp", "section": "Auswahl",
      "caption": "Der Prompt-Builder. Oben wählst du das Dataset (EFZ 3-jährig / 4-jährig / EBA) und den Modus." },

    { "action": "click", "selector": "TODO_MODE_A",  "section": "Auswahl",
      "highlight": true,
      "caption": "Wähle den Modus «Lehrplankonform» (A) — er führt dich entlang Thema → Lebensbezug → Kompetenz." },

    { "action": "click", "selector": "TODO_THEMA_1", "section": "Auswahl",
      "caption": "Wähle ein Thema aus dem Lehrplan (z. B. Thema 1)." },

    { "action": "click", "selector": "TODO_LEBENSBEZUG_1_1", "section": "Auswahl",
      "caption": "Wähle einen Lebensbezug innerhalb des Themas (z. B. 1.1)." },

    { "action": "click", "selector": "TODO_KOMPETENZ_1_1_1", "section": "Auswahl",
      "caption": "Wähle eine oder mehrere Kompetenzen (z. B. 1.1.1). Mehrfachauswahl ist möglich." },

    // --- Auto-Taxonomie ---
    { "action": "waitForSelector", "selector": "TODO_TAXONOMIE_PANEL", "state": "visible", "timeout": 10000,
      "section": "Taxonomie",
      "caption": "Der Builder zieht automatisch Gesellschaftsinhalte, Sprachmodi und Schlüsselkompetenzen zur gewählten Kompetenz." },
    { "action": "scrollTo", "selector": "TODO_TAXONOMIE_PANEL", "section": "Taxonomie",
      "caption": "Prüfe die übernommene Taxonomie — sie fliesst direkt in den Prompt ein." },

    // --- Output-Typ + Generieren ---
    { "action": "click", "selector": "TODO_OUTPUT_LERNSITUATION", "section": "Prompt erzeugen",
      "caption": "Wähle den gewünschten Output-Typ — hier «Lernsituation». Verfügbar sind auch Aufgabe, Raster, Prüfung, Arbeitsblatt und Reflexion." },
    { "action": "click", "selector": "TODO_GENERATE_BTN", "section": "Prompt erzeugen",
      "caption": "Klicke auf «Prompt generieren». Der fertige Prompt erscheint im Ausgabefeld." },
    { "action": "waitForSelector", "selector": "TODO_OUTPUT_AREA", "state": "visible", "timeout": 10000,
      "section": "Prompt erzeugen",
      "caption": "Der generierte Prompt — bereit zum Kopieren in dein LLM (z. B. Claude oder ChatGPT)." },
    { "action": "click", "selector": "TODO_COPY_BTN", "section": "Prompt erzeugen",
      "caption": "Mit «Kopieren» übernimmst du den Prompt in die Zwischenablage; «Herunterladen» speichert ihn als Datei." },

    // --- Combo-Kette (optional, eigener Tab im Guide) ---
    { "action": "click", "selector": "TODO_MODE_C", "section": "Combo-Kette",
      "caption": "Im Modus «Combo» erzeugt der Builder eine 6-Schritt-Kette, die alle Output-Typen aufeinander aufbaut." },
    { "action": "waitForSelector", "selector": "TODO_COMBO_OUTPUT", "state": "visible", "timeout": 10000,
      "section": "Combo-Kette",
      "caption": "Die Combo-Kette: von der Lernsituation bis zur Reflexion — als zusammenhängender Arbeitsauftrag." }
  ]
}
```

**Schema-Hinweise** (siehe SKILL.md für Details):
- **Aktionen:** `goto`, `click`, `fill`, `type`, `press`, `hover`, `select`, `waitForSelector`, `waitForTimeout`, `scrollTo`, `screenshot`.
- **Pro Schritt optional:** `caption`, `screenshot` (true/false), `fullPage`, `highlight`, `section` (gruppiert Schritte zu Tabs), `timeout`, `state`.
- **Selektoren** in Playwright-Syntax: `text=`, `#id`, `role=button[name=...]`, `:has-text()`, CSS, `>> nth=N`.
- **Deferred-Render (Alpine.js!):** Die App nutzt Alpine.js — Inhalte sind bis zur JS-Initialisierung `display:none`. **Nie `waitForTimeout`** für Inhalte. Stattdessen `waitForSelector` mit `state:"visible"` auf das Element, das erscheint, sobald die Daten da sind (so bei `TODO_TAXONOMIE_PANEL`, `TODO_OUTPUT_AREA`, `TODO_COMBO_OUTPUT` gemacht).

---

## 6. Capturen

```bash
cd .claude/skills/web-onboarding-builder/onboarding/scripts
node capture.mjs run flows/prompt-builder.json
# Optionen: --auth ../auth.json   --headed   --slowmo 400   --video   --no-pdf
```

Ergebnis in `onboarding/scripts/output/<slug>/`: `screenshots/`, `guide.html`, `guide.md`, `guide.pdf`. Bei gesetztem `deploy` werden HTML/PDF zusätzlich nach `public/guides/` kopiert.

---

## 7. Review & Feinschliff (hier entsteht die Qualität)

**Lies die PNGs** in `output/<slug>/screenshots/`. Pro Bild prüfen:
- Richtige Seite/Zustand getroffen? Highlight auf dem richtigen Element?
- Kein Banner/Tooltip verdeckt etwas? (Ggf. frühen `click`/`waitForSelector` ergänzen.)
- Bei nicht-hervorgehobenem Screenshot war der Selektor falsch → in `flows/prompt-builder.json` korrigieren, neu laufen lassen.

Captions zu einer sauberen, nummerierten **deutschen** Anleitung verbessern (Instruktionen, nicht Beschreibungen: «Klicke …», «Wähle …»). Iterieren, bis die Screenshots die Geschichte allein erzählen.

Regenerieren ist danach nur: `node capture.mjs run flows/prompt-builder.json`.

---

## 8. Verifizieren (Checkliste)

- [ ] Setup ok: `npm install` lief, Chromium installiert.
- [ ] Einstieg klappt: Gast-Login (oder `auth.json`) führt ohne Redirect zum Prompt-Builder.
- [ ] Innere URL `…/nrlp/prompt-builder/index.html?role=lp` lädt das Werkzeug ohne iframe-Rahmen.
- [ ] Alle `TODO_*`-Selektoren durch echte aus dem Quellcode ersetzt; jeder Klick-Screenshot ist hervorgehoben.
- [ ] Auto-Taxonomie-Schritt zeigt tatsächlich übernommene Gesellschaftsinhalte/Sprachmodi/SK.
- [ ] Generierter Prompt sichtbar; Kopieren/Download dokumentiert.
- [ ] Combo-Kette als eigener Abschnitt sichtbar.
- [ ] `guide.html` öffnet, Umschalter **Dokument ⇄ Folien** funktioniert, Druck = 1 Schritt/A4.
- [ ] `guide.md` und `guide.pdf` erzeugt; bei `deploy` liegen die Dateien in `public/guides/`.
- [ ] Captions durchgehend Deutsch, an Lehrpersonen gerichtet.

---

## 9. Liefern

`guide.html` ist das Hauptartefakt (Dokument- + Folien-Ansicht, A4-Druck), dazu `guide.md` (versionierbar) und `guide.pdf`. Optional via `deploy` unter `public/guides/prompt-builder.html` ausliefern und im Hub/nRLP-Header verlinken.

**Durabel:** die Flow-Datei `onboarding/flows/prompt-builder.json` ins Repo committen — jede Neuerzeugung nach UI-Änderungen ist dann ein einziger Befehl.
