# Datenvertrag v4.2 (gilt für alle Executor-Aufträge)

Festgelegt vom Orchestrator, 01.10.2026. Ergänzt Leitfaden §11; bei Widerspruch gilt dieser Vertrag.

## Namen

- Einheit: `src/data/einheiten/1.3.1_konsum_verantworten_v42/` · `status: "entwurf"`
- Template-Wert der Hefte: `heft_8page_v42`. **Aller neue Renderer-Code hängt an diesem Wert.**
- Spuren: `'ohne_medien' | 'mit_medien'` (`SpurKey`)
- Quellenkartei: `src/data/quellen/<id>.json`, IDs `q-131a-pflicht`, `q-131a-pflicht-ersatz`, `q-131a-vertiefung-1|2`, analog `q-131b-…`
- Landing-Seite: `/m/<Ordnername>` mit Ankern `#a`, `#b` → `https://bbw-hko.ch/m/1.3.1_konsum_verantworten_v42#a`
- Volltexte und Transkripte: nur `D:\OS\_lab\quellen-archiv\bbw-hko\<quellen-id>\`. **Nie im Repo (öffentlich).**

## Zwei Stadien, wie bei `methoden`

**Auf der Platte** (`herausforderung_*.json`): `leitfragen` hat 2 Einträge (LF1, LF2). `spuren.{ohne_medien,mit_medien}` trägt je `leitfragen` (LF3, LF4), `kasten_s4`, `methoden_ref_rezeption`, `scaffold_90`; nur `mit_medien` hat `quellen[]` mit `ref`. In `methoden` steht an der Stelle der Rezeptionskarte `{ "ref": "__spur__", … }`.

**Nach `loadEinheit`** (was jeder Renderer sieht):

1. `spuren.mit_medien.quellen[i].karte` = aufgelöste Quellenkarte; `.ersatz` = aufgelöste Ersatzkarte, falls `ersatz_ref` gesetzt. Unbekannte Refs: überspringen + `console.warn`.
2. `spuren.<spur>.methode_rezeption` = aufgelöste Methodenkarte (aus `methoden_ref_rezeption`, mit `fuer`/`tun`).
3. `leitfragen_kern` = die zwei Kern-Leitfragen (roh).
4. Das Heft ist **auf die Standardspur aufgelöst**: `ohne_medien`, falls vorhanden, sonst `mit_medien`. Bestandscode (Präsentation, Werkstatt, Übersicht, Begleiter) sieht damit ein vollständiges Heft mit 4 Leitfragen.

**`resolveSpur(sit, spur)`** in `src/lib/einheiten/spur.ts` — reine Funktion, ohne Datenimporte, läuft auch im Browser, idempotent:

- `leitfragen` = `leitfragen_kern ?? leitfragen` + `spuren[spur].leitfragen`, nach `nr` sortiert
- `quellen` = `spuren[spur].quellen ?? []`
- `kasten_s4` = `spuren[spur].kasten_s4`
- in `methoden` wird der Platzhalter `__spur__` durch `spuren[spur].methode_rezeption` ersetzt (Position bleibt)
- `lernfortschritt.scaffold_90` = `spuren[spur].scaffold_90 ?? …`
- `spur_aktiv` = `spur`
- Heft ohne `spuren`: unverändert zurückgeben.

Dazu `verfuegbareSpuren(sit): SpurKey[]` und `istHeftV42(sit): boolean`.

Die Arbeitsansicht (`EinheitWorkbench.tsx`) hält die gewählte Spur als Zustand und ruft `resolveSpur` vor jedem Rendern und Export.

## Neue Dateien (damit parallele Aufträge sich nicht stören)

| Datei | Inhalt |
|---|---|
| `src/lib/einheiten/spur.ts` | `resolveSpur`, `verfuegbareSpuren`, `istHeftV42` |
| `src/lib/einheiten/quellen.ts` | Kartei-Resolver nach dem Muster `methoden.ts` |
| `src/components/einheiten/docs/DocHeftV42.tsx` | Heft, 8 Seiten (HTML) |
| `src/components/einheiten/docs/DocAuftragsbogen.tsx` | gemeinsamer Auftrag, 4 Seiten (HTML) |
| `src/styles/einheiten-v42.css` | Stile nur für v4.2-Seiten, Präfix `.v42-` |
| `src/lib/einheiten/docx-heft-v42.ts` | Word: Heft und Auftragsbogen |
| `src/lib/einheiten/qr.ts` | QR als SVG-String und PNG-Bytes, gebündelt, kein CDN |
| `src/pages/m/[setKey].astro` | Landing-Seite |
| `scripts/check-v42.mjs` | Prüfregeln §11.5 + Zeichenbudgets §3.1 |

`DocS.tsx` und `docx-builder.ts` bekommen nur eine Weiche am Anfang (`if (istHeftV42(sit)) return …`).

## Typen

Alle neuen Felder optional, Namen gemäss Leitfaden §11.1–§11.4. Zusätzlich die aufgelösten Felder oben (`leitfragen_kern`, `quellen`, `kasten_s4`, `spur_aktiv`, `karte`, `ersatz`, `methode_rezeption`).

## Sprache und Gestaltung

Schweizer Hochdeutsch, kein Eszett, echte Umlaute, Sie-Form in Aufträgen. Ein Grün plus Schwarz/Weiss (Tokens in `src/layouts/Base.astro`), keine neue Farbe. `.a4-page` hat `overflow: hidden` — nichts darf überlaufen.
