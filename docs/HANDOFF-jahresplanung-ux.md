# Handoff — UX-Reorganisation `/jahresplanung/*`

**Für:** Claude Code (Umsetzung im Astro/Alpine-Codebase)
**Ziel:** Die Jahresplanungs-Seiten für **nicht-technische Lehrpersonen** beruhigen.
Leitsatz der Lehrperson: *„zu viele Buttons"*.

**Prinzip (alle drei Seiten):** **Progressive Disclosure.**
Was täglich gebraucht wird, ist immer sichtbar und ruhig. Alles andere (Power-Features,
dichte Analysen, tiefe Taxonomie) ist **einen Klick entfernt** statt dauernd präsent.

**Visuelle Quelle der Wahrheit:** drei interaktive Mockups in diesem Projekt
(in jedem Mockup „UX-Notizen" einschalten — die grünen Karten erklären die Entscheidung):

| Seite | Datei (Codebase) | Mockup |
|---|---|---|
| Wochenplanung | `src/pages/jahresplanung.astro` | `Jahresplanung Redesign.dc.html` |
| Gesamtübersicht | `src/pages/jahresplanung/uebersicht.astro` | `Jahresplanung Übersicht Redesign.dc.html` |
| Thema-Detail | `src/pages/jahresplanung/thema/[nr].astro` | `Jahresplanung Thema-Detail Redesign.dc.html` |

> Die Mockups sind in einem anderen Framework gebaut. **Nicht 1:1 portieren** —
> die *Informationsarchitektur und Interaktion* übernehmen, im bestehenden
> Astro + Alpine + Tailwind-Setup umsetzen, bestehende `jp-*`-Klassen weiterverwenden.

**Design-Tokens (unverändert, aus `src/layouts/Base.astro`):**
`--brand:#0E6E3A` · `--brand-dark:#094d28` · `--brand-tint:#e8f3ec` · `--brand-ring:rgba(14,110,58,.18)` ·
Font `DM Sans` · Flächen `#f8fafc` / Karten `#fff` / Rahmen `#e2e8f0` / Slate-Text.
Keine neuen Farben, keine neuen Schriften.

---

## 1) Wochenplanung — `src/pages/jahresplanung.astro`

### Problem
Die `.jp-toolbar` zeigt **8 gleichwertige Buttons** nebeneinander:
Klassen-Select · `＋ Klasse` · `✏️ Bearbeiten` · `★ KN-Planung` · `▣ Abdeckung` ·
`⬇ Excel` · `🖨 PDF` · Speicher-Status. Dazu darunter dauerhaft offene `<details>`
(SK-Abdeckung, Feiertage) und die Panels. Lesen und Planen sind visuell nicht getrennt.

### Lösung — 3 Tiers

**Tier 1 — immer sichtbar (ruhige Primärleiste).** Nur drei Dinge:
- **Klasse** als Dropdown-Button (Avatar-Initiale + Label). `＋ Neue Klasse` wandert **in das Dropdown** (letzter Eintrag), nicht mehr als eigener Button.
- **Ein** Primär-Button **`✎ Planen`** (grün gefüllt). Toggelt den Planen-Modus.
- **`⋯`**-Icon-Button → Overflow-Menü (Tier 3).
- Speicherstatus als **leise** Textzeile (`✓ Automatisch gespeichert`), nicht als Button.

**Tier 2 — erscheint nur im Planen-Modus (kontextuelle Leiste).**
Eine **grün gefüllte** Leiste (klar abgesetzt = „jetzt bearbeite ich"), darin ein Segmented-Control:
- `✎ Wochen anpassen` (= bisheriges `editMode`)
- `★ Kompetenznachweise` (= bisheriges `showKn`)
- `▣ Abdeckung prüfen` (= bisheriges `showCoverage`)
- rechts **`Fertig`** → zurück zur Leseansicht.
Das jeweils gewählte Panel rendert darunter (genau die bestehenden Panels).

**Tier 3 — `⋯`-Overflow-Menü** (Popover), Gruppen *Export* / *Referenz*:
- `⬇ Excel exportieren` (`exportExcel()`)
- `🖨 Drucken / PDF` (`window.print()`)
- `▦ SK-Abdeckung anzeigen` (öffnet das bisherige SK-`<details>` als Panel/Modal)
- `☼ Feiertage & Brückentage` (dito)

### Alpine-Änderungen (`jahresplanung()` Komponente)
- **Neu:** `planMode: false`. `✎ Planen` setzt `planMode = !planMode` und beim Verlassen die Tabs/Panels zu.
- Bestehende `editMode` / `showKn` / `showCoverage` werden zu **einem** `planTab: 'wochen'|'kn'|'abdeckung'`, nur wirksam wenn `planMode`. (Migration: `editMode → planTab==='wochen'`, `showKn → 'kn'`, `showCoverage → 'abdeckung'`.)
- **Neu:** `moreOpen` und `classMenuOpen` für die Popovers (mit Klick-ausserhalb / `@click.outside` schliessen, `Esc` schliessen).
- **Neu:** `refPanel: null|'sk'|'feiertage'` für die Referenz-Inhalte aus `⋯`. Die zwei `<details>`-Blöcke werden zu bedingten Panels (`x-show`), Default zu.
- Klassen-Dropdown ersetzt das nackte `<select>` (gleiche Daten `plans` / `activePlanId` / `switchPlan()` / `newPlan()`).

### Bleibt unverändert / weiterhin sichtbar
Slice-Switcher (`.jp-switch`: Lehrgang × Lehrjahr × Schuljahr) — das ist **Navigation**, kein Toolbar-Lärm, bleibt oben. Stats-Karten, Legende (vereinfacht auf eine Zeile), der Wochenkalender und die Themen-Karten. Hover-Detail einer Woche bleibt; im Mockup zusätzlich als rechtsstehende **Detail-Spalte** umgesetzt (optionales Upgrade, robuster als Tooltip).

### Akzeptanzkriterien
- [ ] Leseansicht zeigt **maximal 3** interaktive Steuerelemente in der Primärleiste.
- [ ] Bearbeiten/KN/Abdeckung sind **nicht** sichtbar, bis `✎ Planen` aktiv ist.
- [ ] Excel/Drucken/SK/Feiertage nur über `⋯` erreichbar.
- [ ] Gast (`isGuest`) sieht weiterhin keine Planen-Leiste; `⋯` zeigt nur Drucken.

---

## 2) Gesamtübersicht — `src/pages/jahresplanung/uebersicht.astro`

### Problem
Kein Button-Lärm, sondern **Inhalts-Überladung**: **vier dichte Analyse-Sektionen**
sind dauerhaft und gleichzeitig offen (Mehrjahres-Übersicht, SK-Spirale, KN-Progression,
Beispiel-KN-Planung). Sehr langes Scrollen, hohe kognitive Last.

### Lösung — Karte immer, Analysen auf Abruf
**Tier 1 — immer sichtbar:** die **Curriculum-Landkarte** (bestehende „Mehrjahres-Übersicht /
Bird's-eye", `.ueb-grid`). Das ist der eigentliche Zweck der Seite: welche Themen, welches Jahr,
Klick → Wochenplanung. Bleibt unverändert oben.

**Tier 2 — „Vertiefen"-Umschalter:** eine ruhige Leiste mit drei Toggle-Chips:
- `◷ SK-Spirale` (bisherige Spiral-Tabelle)
- `★ Kompetenznachweis-Bogen` (bisherige `.kn-arc`)
- `▣ KN-Beispielplanung` (bisherige `.knex-*`)

Regeln: **höchstens eine** Analyse gleichzeitig sichtbar; Default **keine** (stattdessen ein
dezenter Hinweis „Wähle eine Analyse…"); erneuter Klick auf den aktiven Chip schliesst.

**`⋯`-Menü** (rechts in der Slice-Zeile): `🖨 Curriculum drucken (A4 quer)`, `⬇ Als Bild exportieren`.
(Die `@media print`-Regeln bleiben; alle Analysen für den Druck sichtbar schalten.)

### Umsetzung
- Reine **Client-Komponente** nötig (die Seite ist aktuell statisch). Kleines Alpine-`x-data`
  mit `analysis: null|'spirale'|'arc'|'beispiel'` + `moreOpen`. Sektionen via `x-show`/`x-cloak`.
- Inhalte/Daten **nicht** neu bauen — die bestehenden gerenderten Blöcke nur in Toggle-Container hängen.
- Für den Druck: vor `window.print()` alle drei Analysen einblenden (oder `@media print { [x-show] { display:block !important } }`).

### Akzeptanzkriterien
- [ ] Beim Laden ist **nur** die Curriculum-Landkarte (+ leerer Vertiefen-Hinweis) zu sehen.
- [ ] Es kann **immer nur eine** Analyse offen sein.
- [ ] Drucken zeigt das volle Curriculum inkl. aller Analysen.

---

## 3) Thema-Detail — `src/pages/jahresplanung/thema/[nr].astro`

### Problem
Lange **Lese-Wand**: jeder Lebensbezug (`.thd-lb`) ist komplett ausgebreitet — alle Kompetenzen,
je Kompetenz die *gesellschaftlichen Inhalte* und *Sprachmodi*, plus verknüpftes Material —
alles gleichzeitig. Das nützlichste (fertiges Material) geht in der Taxonomie unter.

### Lösung — Orientierung oben, Tiefe gefaltet, Material nach vorn
**Immer sichtbar (Orientierung):** Hero (Titel, Umfang-Chips, CTA), **Leitidee** (Langtext hinter
„Ausführliche Leitidee"), Übersicht **Schlüsselkompetenzen** + **Sprachmodi**.

**Lebensbezüge als Akkordeon (`.thd-lb` → aufklappbar):**
- **Eingeklappt** zeigt jede Zeile: Nr-Badge, Kurztext, Meta-Chips
  (`{lektionen} Lektionen` · `{n} Kompetenzen` · `{x} Einheiten · {y} Situationen`) + Chevron.
- **Erster** Lebensbezug per Default offen, Rest zu.
- **Aufgeklappt**, in dieser Reihenfolge:
  1. **Fertiges Material** zuerst, **farbig hervorgehoben** (grün getönte Box): Herausforderungen/Einheiten
     (`hfByLb`) mit `KN`/`Begleiter`-Badges, dann Situationen-Chips (`sitByLb`) + „Alle … durchsuchen →".
  2. **Kompetenzen**: je Kompetenz nur **Nr + Text** prominent. Die nRLP-Feingliederung
     (*gesellschaftliche Inhalte* + *Sprachmodi*) liegt hinter einem dezenten Toggle
     **„▸ nRLP-Details"** pro Kompetenz (Default zu).

> Begründung: Lehrpersonen suchen hier zuerst „was kann ich direkt einsetzen?". Die nRLP-Taxonomie
> ist Referenz — wichtig, aber nicht das, was die Seite dominieren soll.

### Umsetzung
- Alpine-`x-data` pro Seite: `openLb` (Set/Map der offenen LB-Nummern, erstes vorbelegt),
  `openKomp` (Map je Kompetenz-Nr), `leitidee:false`.
- Markup/Daten der bestehenden `.thd-lb` / `.thd-komp` / `.thd-material` bleiben — nur in
  Toggle-Header + `x-show`-Body umstrukturieren und die Material-Box vor die Kompetenzen ziehen.
- Schlussarbeit-Fall (`isSA`): kein Akkordeon nötig, bestehende Anforderungs-Karte behalten.

### Akzeptanzkriterien
- [ ] Beim Laden ist höchstens **ein** Lebensbezug offen; nRLP-Details aller Kompetenzen **zu**.
- [ ] Im offenen Lebensbezug steht **Material vor** der Kompetenz-Taxonomie.
- [ ] Kein Inhalt geht verloren — alles bleibt **einen Klick** entfernt erreichbar.

---

## Querschnitt (alle Seiten)

- **Konsistente Sprache:** ein Primär-Verb (`Planen`), `⋯` für Selten-Genutztes, `Fertig`/`Schliessen`
  zum Zurück. Gleiche Chip-/Toggle-/Popover-Optik auf allen drei Seiten.
- **Zugänglichkeit:** Popovers & Akkordeons als echte `<button>` mit `aria-expanded`/`aria-controls`,
  `Esc` schliesst, Fokus sichtbar (`--brand-ring`), Klick ausserhalb schliesst (`@click.outside`).
  Trefferflächen ≥ 40 px.
- **Mobil:** Primärleiste/Leisten umbrechen lassen (`flex-wrap`); Detail-Spalte der Wochenplanung
  unter den Kalender stapeln.
- **Nicht ändern:** Slice-Switcher-Logik, Datenquellen (`nrlp`, `einheitenIndex`, `situationenIndex`,
  `buildKnPlan`, `plans`/Supabase), `@media print`-Verhalten, URL-Parameter (`lehrgang`/`lj`/`sj`).
- **Keine** neuen Farben/Fonts; bestehende `jp-*`-Klassen wiederverwenden, neue nur ergänzen.

### Vorgeschlagene Reihenfolge
1. Wochenplanung (grösster Effekt — direkt der „zu viele Buttons"-Schmerz).
2. Thema-Detail (Akkordeon, gut isoliert).
3. Übersicht (braucht eine kleine Client-Komponente).
