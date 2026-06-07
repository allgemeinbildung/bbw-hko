# Handoff — Onboarding-Screenshots auf die neue Einheiten-Seitenleiste umstellen

**Für:** Claude Code (mit Browser-Tool + Schreibzugriff auf das Repo)
**Auftraggeber:** Pietro
**Ziel:** Im geführten Rundgang (`public/onboarding/index.html`, **Schritt 4 «Werkbank»**) zeigen die Bilder noch die **alte horizontale Werkzeugleiste oben**. Der Einheiten-Renderer hat jetzt eine **linke Seitenleiste**. Bilder neu aufnehmen **und** den Text/die Marker von Schritt 4 anpassen.

> **Warum dieser Handoff?** Die Screenshots wurden bereits per Browser-Tool geprüft (neue Seitenleiste rendert korrekt), aber in jener Session liessen sich Screenshots **nicht auf die Festplatte speichern**. Claude Code kann Screenshots speichern → bitte hier übernehmen.

---

## 0. TL;DR

1. Dev-Server starten, als **LP** einloggen, `http://localhost:4321/einheiten/1.1.1_konflikt_kommunizieren` öffnen (Fensterbreite ≥ 1200 px).
2. Zwei Element-Screenshots aufnehmen und als JPG speichern (gleiche Dateinamen, damit nichts bricht):
   - `.wb-nav` (Seitenleiste) → `public/onboarding/wb-toolbar.jpg`
   - `.wb-dochead` (dunkle Vorschau-Kopfzeile mit *Auftrag/Dossier*) → `public/onboarding/wb-toolbar-kn.jpg`
3. In `public/onboarding/index.html` die **ganze** `<section id="werkbank">…</section>` durch den Block in **Abschnitt 4** unten ersetzen.
4. `/onboarding/` laden und die 7 Marker auf der Seitenleiste **feinjustieren** (Abschnitt 5).

---

## 1. Was sich geändert hat

| | **Alt** (aktuell in den Bildern) | **Neu** (jetzt im Code) |
|---|---|---|
| Form | Horizontale **Werkzeugleiste oben**, 8 Werkzeuge in einer Reihe | **Linke Seitenleiste** `.wb-nav` (288 px), Dokument-Baum |
| Dokumentwahl | «Doc»-Umschalter in der Leiste | Baum in der Seitenleiste (Herausforderungen A/B/C, Austausch & Transfer, Kompetenznachweis) |
| Sit A/B/C | eigene Gruppe in der Leiste | Einträge im Baum unter «Herausforderungen» (Farbbadges A rot · B blau · C grün) |
| Auftrag/Dossier | in der Leiste | jetzt **rechts in der dunklen Dokument-Kopfzeile** `.wb-dochead` → `.wb-mode` (nur beim Situationsheft) |
| Begleiter | «Begleiter ↗» Knopf in der Leiste | grüner Knopf **«📖 Lies mich!»** oben in der Seitenleiste |
| ZIP | «Alle als ZIP» in der Leiste | schwebender Knopf **«⬇ Download»** unten rechts `.download-fab` |
| Drucken | eigener «Drucken»-Knopf | **entfällt** — Einzeldruck via `Strg/Cmd + P`, Gesamtpaket via Download |

Die neue Reihenfolge in der Seitenleiste (oben → unten): **1** Abteilung · **2** 📖 Lies mich! · **3** Herausforderungen A/B/C · **4** Austausch & Transfer · **5** Kompetenznachweis (Schüler/in: Fachgespräch / Mini Case schriftlich / Werkschau + Transfer-Reflexion) · **6** 📋 Lehrperson + Bewertung · **7** ✍ Feedback nach Unterricht.

---

## 2. Voraussetzungen

```bash
npm run dev      # http://localhost:4321
```

Die Werkbank ist **auth-geschützt** (`src/pages/einheiten/[setKey].astro`: `if (!user) return Astro.redirect('/login')`). Also vorher als **LP** anmelden (z. B. das in der Test-Session genutzte Konto `lehrer@hko.ch`, oder ein Seed-LP wie `anna.bauer@bbw.ch` / `demo1234`, falls in der angebundenen Supabase-DB vorhanden). Am einfachsten: im bereits eingeloggten Browser-Profil arbeiten.

Gültige Einheiten-Slugs (`setKey`): `1.1.1_konflikt_kommunizieren` (empfohlen, weil als Referenz geprüft) und `1.1.1_rechte_verstehen_nutzen`.

---

## 3. Screenshots neu aufnehmen

**Fenster/Viewport:** Breite **≥ 1200 px** (sonst greift ab < 880 px der mobile Hamburger `.wb-nav-toggle` und die Seitenleiste ist eingeklappt!). Empfohlen **1510 × 820** — damit war die ganze Seitenleiste von «Abteilung» bis «Feedback» ohne Scrollen sichtbar. Für scharfen Text `deviceScaleFactor: 2`.

**Zustand:** Standard nach dem Laden = **Situationsheft A** aktiv. So ist in der Kopfzeile der **Auftrag/Dossier**-Umschalter sichtbar (er erscheint nur beim Situationsheft).

### Variante A — Browser-Tool (Element-/Bereichs-Screenshot)
1. Navigieren zu `http://localhost:4321/einheiten/1.1.1_konflikt_kommunizieren` (ggf. einloggen).
2. **Seitenleiste:** das Element **`.wb-nav`** abfotografieren → speichern als `public/onboarding/wb-toolbar.jpg`.
   *Fallback ohne Element-Capture:* linke Spalte zuschneiden — ca. `x ∈ [0, 288]`, von der Oberkante der Seitenleiste bis knapp unter den Knopf «✍ Feedback nach Unterricht». Möglichst **wenig Leerraum unten**.
3. **Vorschau-Kopfzeile:** das Element **`.wb-dochead`** abfotografieren (dunkler Streifen mit Dokumentname links + *Auftrag/Dossier* rechts) → speichern als `public/onboarding/wb-toolbar-kn.jpg`.
4. *(optional)* Ganzes Fenster als `public/onboarding/wb-overview.jpg` für einen Establishing-Shot.

### Variante B — Playwright (präzise, reproduzierbar)
```js
// scripts/_shots.mjs  (temporär; nach Gebrauch löschen)
import { chromium } from 'playwright';
const BASE = 'http://localhost:4321';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1510, height: 820 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();

// --- Login als LP (Selektoren auf /login prüfen!) ---
await page.goto(BASE + '/login');
await page.fill('input[type="email"]', 'lehrer@hko.ch');
await page.fill('input[type="password"]', 'DEIN_PASSWORT');
await page.click('button[type="submit"]');
await page.waitForLoadState('networkidle');

// --- Werkbank ---
await page.goto(BASE + '/einheiten/1.1.1_konflikt_kommunizieren');
await page.waitForSelector('.wb-nav');

await page.locator('.wb-nav').screenshot({ path: 'public/onboarding/wb-toolbar.jpg', type: 'jpeg', quality: 88 });
await page.locator('.wb-dochead').screenshot({ path: 'public/onboarding/wb-toolbar-kn.jpg', type: 'jpeg', quality: 88 });

await browser.close();
```
> Playwright installieren falls nötig: `npm i -D playwright && npx playwright install chromium`. **Skript nach Gebrauch wieder entfernen** (Pietros Regel: nichts ohne Rückfrage dauerhaft löschen — das Skript ist eigens dafür angelegt, das Entfernen ist also vorgesehen).

**Format:** JPG, Qualität ~85–90. Dateinamen **exakt** beibehalten (`wb-toolbar.jpg`, `wb-toolbar-kn.jpg`) — sie werden in `index.html` referenziert.

---

## 4. Schritt 4 im Onboarding ersetzen

In `public/onboarding/index.html` den **kompletten** Block von `<section id="werkbank">` bis zu seinem schließenden `</section>` (steht zwischen dem Kommentar `<!-- ── 4. WERKBANK ── -->` und dem darauffolgenden `<hr class="divider">`) durch Folgendes ersetzen. Es nutzt nur bereits vorhandene CSS-Klassen der Seite (`.annot`, `.hot`, `.legend`, `.leg`, `.split`, `.framed`, `.note`, `.steps` …).

```html
  <!-- ── 4. WERKBANK ── -->
  <section id="werkbank">
    <div class="kicker">Schritt 4 — das Herzstück</div>
    <h2>Die Werkbank &amp; ihre Seitenleiste</h2>
    <p class="intro">Beim Öffnen einer Einheit landet ihr in der <b>Werkbank</b>. <b>Links</b> sitzt die <b>Seitenleiste</b> — euer Dokument-Navigator. Hier sind alle Dokumente der Einheit als übersichtlicher Baum aufgelistet; ein Klick zeigt das gewählte Dokument sofort in der grossen Vorschau rechts.</p>

    <!-- Annotierte Seitenleiste -->
    <div class="split" style="grid-template-columns: 300px 1fr;">
      <div class="annot" style="margin-bottom:0;">
        <img src="/onboarding/wb-toolbar.jpg" alt="Seitenleiste der Werkbank mit nummerierten Markierungen">
        <span class="hot" style="left:8%; top:7%">1</span>
        <span class="hot" style="left:8%; top:16%">2</span>
        <span class="hot" style="left:8%; top:33%">3</span>
        <span class="hot" style="left:8%; top:50%">4</span>
        <span class="hot" style="left:8%; top:71%">5</span>
        <span class="hot" style="left:8%; top:84%">6</span>
        <span class="hot" style="left:8%; top:95%">7</span>
      </div>
      <div class="legend" style="grid-template-columns:1fr; align-content:start;">
        <div class="leg"><div class="ln">1</div><div class="lt"><b>Abteilung wählen</b><span>Deine Abteilung auswählen — sie wird auf alle erzeugten Dokumente gedruckt. Am besten zuerst setzen.</span></div></div>
        <div class="leg"><div class="ln">2</div><div class="lt"><b>📖 Lies mich!</b><span>Öffnet das Lehrpersonen-<b>Begleitdokument</b> in einem neuen Tab (Hintergrund, Didaktik, Coaching-Hinweise).</span></div></div>
        <div class="leg"><div class="ln">3</div><div class="lt"><b>Herausforderungen A · B · C</b><span>Die drei <b>Situationshefte</b>. Ein Klick zeigt das Heft rechts an (A rot · B blau · C grün).</span></div></div>
        <div class="leg"><div class="ln">4</div><div class="lt"><b>Austausch &amp; Transfer</b><span>Das Set-Abschlussdokument für die gemeinsame Auswertung und den Transfer.</span></div></div>
        <div class="leg"><div class="ln">5</div><div class="lt"><b>Kompetenznachweis · Schüler/in</b><span>Die Prüfungsformate der Einheit — z.&nbsp;B. <b>Fachgespräch</b>, <b>Mini&nbsp;Case schriftlich</b>, <b>Werkschau + Transfer-Reflexion</b>.</span></div></div>
        <div class="leg"><div class="ln">6</div><div class="lt"><b>📋 Lehrperson + Bewertung</b><span>Die Lehrpersonen-Fassung des Kompetenznachweises inkl. Bewertungsraster.</span></div></div>
        <div class="leg"><div class="ln">7</div><div class="lt"><b>✍ Feedback nach Unterricht</b><span>Das Rückmeldeformular — nach dem Unterricht ausfüllen. Es fliesst direkt ins Kernteam-1-Review.</span></div></div>
      </div>
    </div>

    <div class="note tip">
      <span class="ic">💡</span>
      <span><b>Live-Vorschau:</b> Was ihr links anklickt, erscheint sofort rechts in der grossen Vorschau. Das aktive Dokument ist in der Leiste grün hinterlegt.</span>
    </div>

    <h3 style="font-size:18px;font-weight:800;margin:34px 0 14px;">Zwei Steuerungen sitzen direkt im Vorschau-Bereich</h3>
    <p class="intro" style="margin-bottom:18px;">Nicht alles steckt in der Seitenleiste: Zwei Bedienelemente liegen direkt bei der Dokument-Vorschau rechts.</p>

    <figure class="framed">
      <img src="/onboarding/wb-toolbar-kn.jpg" alt="Dunkle Dokument-Kopfzeile der Vorschau mit Umschalter Auftrag / Dossier">
      <figcaption>Die <b>Dokument-Kopfzeile</b> (dunkel) zeigt links den Dokumentnamen. Rechts der Umschalter <b>Auftrag / Dossier</b> — er erscheint nur beim <b>Situationsheft</b>: <b>Auftrag</b> = leere Vorlage für die Lernenden, <b>Dossier</b> = dieselbe Situation mit ausgearbeiteter Lösung.</figcaption>
    </figure>

    <div class="note plain">
      <span class="ic">⬇</span>
      <span>Unten rechts schwebt der grüne Knopf <b>«Download»</b>: er lädt die <b>gesamte</b> Einheit als ein ZIP-Paket herunter (alle Dokumente als HTML <i>und</i> Word, plus Begleiter und README). Einzelne Dokumente druckt ihr direkt aus der Vorschau mit <span class="inline-code">Strg/Cmd + P</span>.</span>
    </div>

    <h3 style="font-size:18px;font-weight:800;margin:34px 0 14px;">Der typische Ablauf in der Werkbank</h3>
    <div class="steps">
      <div class="step"><div class="sn">1</div><div><h3>Abteilung wählen</h3><p>Oben in der Seitenleiste — damit sie auf den Dokumenten erscheint.</p></div></div>
      <div class="step"><div class="sn">2</div><div><h3>Dokument anklicken</h3><p>In der Seitenleiste eine Herausforderung (A/B/C), Austausch &amp; Transfer oder einen Kompetenznachweis wählen.</p></div></div>
      <div class="step"><div class="sn">3</div><div><h3>Feinschliff</h3><p>Beim Situationsheft rechts oben in der Kopfzeile zwischen <b>Auftrag</b> und <b>Dossier</b> umschalten.</p></div></div>
      <div class="step"><div class="sn">4</div><div><h3>Ausgeben</h3><p>Einzeln per <b>Strg/Cmd + P</b> drucken — oder die ganze Einheit mit <b>Download</b> als ZIP holen.</p></div></div>
      <div class="step"><div class="sn">5</div><div><h3>Vorbereiten</h3><p>Mit <b>📖 Lies mich!</b> die didaktischen Hintergründe nachlesen, bevor es in den Unterricht geht.</p></div></div>
    </div>

    <h3 style="font-size:18px;font-weight:800;margin:34px 0 14px;">So sieht ein fertiges Dokument aus</h3>
    <div class="split">
      <figure>
        <img src="/onboarding/wb-doc-preview.jpg" alt="Vorschau eines Situationshefts (DOC-S) als A4-Seite">
      </figure>
      <div>
        <p class="intro" style="margin-bottom:16px;">Die Vorschau zeigt jederzeit live, was herauskommt. Ein <b>Situationsheft (DOC-S)</b> ist eine druckfertige A4-Lernsituation mit allem, was die Lernenden brauchen:</p>
        <div class="steps">
          <div class="step"><div class="sn">·</div><div><p>Herausforderung, Titel und <b>Persona</b> mit echtem Berufsbezug</p></div></div>
          <div class="step"><div class="sn">·</div><div><p><b>Leitfrage</b>, Spannungsfeld und der Situationstext</p></div></div>
          <div class="step"><div class="sn">·</div><div><p><b>Checkliste Vollständigkeit</b> mit Beurteilungskriterien und Ressourcen-Verweisen</p></div></div>
        </div>
      </div>
    </div>
  </section>
```

**Kleine Zusatz-Edits (optional, aber empfohlen) im selben File:**
- TOC-Link oben: `<a href="#werkbank">… Werkbank &amp; Leiste</a>` → **`Werkbank &amp; Seitenleiste`**.
- Sonst nichts: Schritt 1–3 und 5 stimmen weiterhin (Katalog-Karte hat weiterhin «Bundle: 22 Dateien →» und «Begleiter ↗»).

---

## 5. Marker feinjustieren

Die `top`-Werte der sieben `.hot`-Marker (7 %, 16 %, 33 %, 50 %, 71 %, 84 %, 95 %) sind **Startwerte**, berechnet aus dem Referenz-Screenshot. Sie hängen vom genauen Zuschnitt von `wb-toolbar.jpg` ab.

1. `http://localhost:4321/onboarding/` öffnen, zu Schritt 4 scrollen.
2. Prüfen, ob jede Zahl auf «ihrer» Zeile sitzt (1 = Abteilung … 7 = Feedback).
3. `top`-(ggf. `left`-)Prozente nachziehen, bis es passt. Bei viel Leerraum unten im Bild lieber **das JPG enger zuschneiden** und neu speichern, statt die % zu verbiegen.

---

## 6. Abnahme-Checkliste

- [ ] `wb-toolbar.jpg` zeigt die **linke Seitenleiste** (nicht die alte Topbar), von «Abteilung» bis «Feedback», wenig Leerraum.
- [ ] `wb-toolbar-kn.jpg` zeigt die **dunkle Vorschau-Kopfzeile** mit dem **Auftrag/Dossier**-Umschalter.
- [ ] Beide Bilder laden auf `/onboarding/` (kein 404).
- [ ] Die 7 Marker sitzen passgenau auf den Zeilen der Seitenleiste.
- [ ] Im Text kommt **kein** «oben/Topbar/Werkzeugleiste/Drucken-Knopf» mehr vor, das nicht mehr existiert.
- [ ] Mobile (< 880 px) bricht nichts (das Onboarding-Layout ist responsiv; die Screenshots sind nur Bilder).

---

## Anhang — Selektoren & Farben (Referenz)

| Element | Selektor | Hinweis |
|---|---|---|
| Seitenleiste | `.wb-nav` | sticky, **288 px** breit, voller Höhe; ab < 880 px Off-Canvas |
| Abteilung | `.wb-field` / `.wb-select` | oberste Zeile |
| Begleiter-Knopf | `.wb-action.lies` | grün, «📖 Lies mich!» |
| Baum-Gruppe | `.wb-tree-group` / `.wb-tree-head` | «Herausforderungen», «Kompetenznachweis» |
| Eintrag | `.wb-item` (`.active` = aktiv) | aktiv: hellgrün + grüner Balken links |
| Sit-Badge | `.wb-letter-A/B/C` | A `#e11d48` · B `#0284c7` · C `#059669` |
| Feedback-Knopf | `.wb-action` (letzter) | «✍ Feedback nach Unterricht» |
| Vorschau-Kopfzeile | `.wb-dochead` | dunkel, sticky |
| Auftrag/Dossier | `.wb-mode` (Buttons `.on`) | nur bei `doc-s` (Situationsheft) |
| Download | `.download-fab` | schwebt unten rechts, grün |

Quell-Dateien: Komponente `src/components/einheiten/EinheitWorkbench.tsx`, Styles `src/styles/einheiten-renderer.css`, Seite `src/pages/einheiten/[setKey].astro`, Onboarding `public/onboarding/index.html`.
