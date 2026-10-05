# Migration auf Astro 5 und den aktuellen Vercel-Adapter

Stand: 05.10.2026 · Status: **offen, nicht dringend** · Register: `D:\OS\pendenzen.yaml`,
Eintrag `bbw-hko-astro5-migration`

## Warum

Vercel hat Node.js 20 per 01.10.2026 eingestellt. Das Deploy vom 05.10.2026 (Freigabe der
v4.2-Einheiten, Commit `5e0cc70`) scheiterte daran. Behoben mit einer Übergangslösung
(Commit `d071169`):

- `package.json`: `engines.node` von `20.x` auf `24.x`.
- `scripts/patch-vercel-runtime.mjs`, als `postbuild`: Der Adapter `@astrojs/vercel` 7.x
  (Astro 4) kennt nur Node 18 und 20. Bei jeder anderen Build-Version schreibt er
  `"runtime": "nodejs18.x"` in `.vercel/output/functions/_render.func/.vc-config.json`
  (`getRuntime()` in `node_modules/@astrojs/vercel/dist/serverless/adapter.js`). Das Skript
  trägt nach dem Build die Version aus `engines.node` ein.

Die Produktion läuft seither auf Node 24. Der Patch ist eine Krücke: Er hängt an einem
internen Dateiformat von Vercel und an einem Adapter, der nicht mehr gepflegt wird. Die
Migration macht ihn überflüssig.

## Ausgangslage (05.10.2026)

| Paket | Heute | Ziel |
|---|---|---|
| `astro` | ^4.16.8 | 5.x |
| `@astrojs/vercel` | ^7.8.1 (installiert 7.8.2) | ≥ 8 |
| `@astrojs/react` | ^3.6.3 | 4.x |
| `@astrojs/tailwind` | ^5.1.3 | bleibt (Tailwind 3) |
| `react`, `react-dom` | ^18.3.1 | bleibt |
| `tailwindcss` | ^3.4.14 | bleibt |

`astro.config.mjs`: `output: 'server'`, `adapter: vercel()` aus
`@astrojs/vercel/serverless`, Integrationen `tailwind()` und
`react({ include: ['**/einheiten/**'] })`.

Umfang: 52 Seiten (`.astro`), 31 API-Routen. Keine automatischen Tests.

## Einschätzung

Routine, kein Umbau: ein halber bis ein ganzer Tag samt Durchklicken. Die grossen
Umbrüche von Astro 5 treffen dieses Projekt nicht — per Suche im Code am 05.10.2026:

- keine Content Collections (`astro:content`: 0 Treffer),
- kein `Astro.glob` (0 Treffer),
- keine View Transitions (0 Treffer),
- kein `output: 'hybrid'`.

Die Einschätzung stützt sich auf die Abhängigkeiten und diese Suche, **nicht auf einen
Probelauf**. Was tatsächlich bricht, zeigt erst der Upgrade auf einem Branch.

## Schritte

1. Eigener Branch ab `main`.
2. `npx @astrojs/upgrade` (hebt `astro` und die offiziellen Integrationen zusammen) —
   oder von Hand: `astro@5`, `@astrojs/vercel@latest`, `@astrojs/react@4`.
3. `astro.config.mjs`: Import `@astrojs/vercel/serverless` → `@astrojs/vercel`.
4. `src/env.d.ts`: Typ-Referenz an Astro 5 anpassen (`.astro/types.d.ts`).
5. `scripts/patch-vercel-runtime.mjs` löschen und die Zeile `"postbuild"` aus
   `package.json` entfernen. Danach prüfen, dass `.vc-config.json` von selbst
   `nodejs24.x` (oder die dann aktuelle Version) trägt.
6. `npm run build` lokal; `node scripts/bestand-v42.mjs --pruefen` (Bestandseinheiten
   rendern gleich) und `node scripts/check-all.mjs --entwurf`.
7. Branch pushen → Vorschau-Deploy bei Vercel abwarten. Die Vorschau liegt hinter dem
   Vercel-Login; durchklicken muss Pietro oder eine angemeldete Browser-Sitzung.
8. Erst nach dem Durchklicken nach `main`.

**Nicht Teil dieser Migration:** Tailwind 4, React 19, `@supabase/ssr`. Jedes davon ist
ein eigenes Thema.

## Was geprüft werden muss

Der Aufwand steckt hier, nicht im Upgrade selbst.

- **Inline-Skripte.** Astro 5 behandelt `<script>`-Tags anders (sie werden nicht mehr
  automatisch in den `<head>` gehoben). 23 `.astro`-Dateien nutzen `is:inline` oder
  `define:vars`. Besonders `/vorlagen`: Dort ist die Reihenfolge Absicht — die
  Bedienlogik steht `is:inline`, das gebündelte Modul reicht seine Bausteine über
  `window.__hkoVorlagen` nach (siehe `CLAUDE.md`, Abschnitt «Word-Vorlagen»). Ebenso
  der Tracking-Beacon in `src/layouts/Base.astro`, `QuickFeedback.astro`
  («Problem melden») und `jahresplanung.astro` (sieben JSON-Skripte + Alpine).
- **React-Inseln unter `/einheiten/**`.** Arbeitsansicht (`EinheitWorkbench.tsx`):
  Spur-Schalter, Vorschau, Einzeldownload, ZIP-Bundle, Word-Export. Dazu
  `/einheiten/[setKey]/deck` und `/werkstatt`. Je eine Einheit im alten Format und eine
  im Format v4.2 öffnen und herunterladen.
- **Anmeldung.** `src/middleware.ts` (Supabase-Cookies, `realtime: { transport: ws }`),
  E-Mail-Login, Microsoft-Login mit `/auth/callback`, Gastzugang, Abmelden, `/passwort`.
- **Formulare und API.** `/einreichen` samt Datei-Upload, Feedback zu Situation und
  Einheit, «Problem melden» mit Screenshot, Jahresplanung speichern.
- **QR-Seiten** `/m/<ordner>` ohne Anmeldung, mit eingebettetem SRF-Player.
- **Admin.** `/admin`, `/admin/katalog`, `/admin/statistik`, `/admin/meldungen`.
- **Prompt-Builder** (`/prompt-builder`, Sub-App im iframe unter `public/nrlp/`) — statisch,
  sollte unberührt bleiben; einmal öffnen.

## Wann

Nicht in derselben Woche wie die Freigabe der v4.2-Einheiten: Ein Fehler aus der
Migration soll nicht mit Rückmeldungen zu den neuen Einheiten zusammenfallen. Eine harte
Frist gibt es nicht, solange Vercel Node 24 unterstützt.

## Rückweg

Vercel behält die vorherigen Deployments: «Instant Rollback» im Dashboard stellt die
letzte funktionierende Version in Sekunden wieder her. Im Repo: `git revert` des
Migrations-Commits bringt Astro 4 samt Patch zurück.
