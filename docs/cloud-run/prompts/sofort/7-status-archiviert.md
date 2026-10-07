# Status «archiviert» — neben «Entwurf», nur für KT1

Session in `D:\OS\dev\bbw-hko`, Branch `v42-skill`. Ändert Code der Plattform.

```
set.json › status kennt heute "entwurf" und "publiziert"; der Index-Builder
behandelt JEDEN anderen Wert als live (scripts/build-einheiten-index.mjs
Z. 125). Die abgelöste Einheit 1.3.1_konsum_verantworten steht darum auf
"entwurf" und erscheint für KT1 zwischen echten Entwürfen (ENTSCHEIDE E31
Punkt 4, E32). Es braucht einen dritten Status.

VERHALTEN
- "archiviert": sichtbar nur für kt1/reviewer, nie für lp und gast — im
  Katalog, in der Jahresplanung, im Prompt-Builder-Panel, in der Werkstatt,
  per Direkt-URL (Umleitung auf /einheiten wie bei Entwurf), auf /m/<ordner>.
  Ausnahme zu klären und mir als Frage vorlegen, BEVOR du es baust:
  Soll die QR-Seite /m/<ordner> einer archivierten Einheit weiter
  funktionieren (gedruckte Hefte sind im Umlauf)? Vorschlag: ja.
- KT1 sieht archivierte Einheiten im Katalog in einem eigenen, eingeklappten
  Abschnitt «Archiv» unter den Einheiten, mit grauem Badge «Archiviert» —
  nicht gemischt mit Entwürfen, nicht im Entwurf-Zähler auf /admin.
- Optionales Feld set.json › ersetzt_durch: "<ordner>" → Karte und
  Detailseite zeigen KT1 den Link zur Nachfolgerin.
- Feedback-Bögen und Statistik bestehender Einträge bleiben lesbar.

UMSETZUNG
- scripts/build-einheiten-index.mjs: status ∈ entwurf | publiziert |
  archiviert; unbekannter Wert → Abbruch mit Fehlermeldung statt «live».
  Beide Index-Kopien.
- src/lib/einheiten/index.ts: Typ, isArchiviert, visibleEinheiten und alle
  Stellen, die heute isEntwurf fragen (einheiten/index.astro, [setKey].astro
  samt Unterseiten deck/werkstatt/feedback, jahresplanung.astro,
  admin/index.astro, m/[setKey].astro, public/nrlp/prompt-builder/
  einheiten.js). Liste der Stellen zuerst per Suche erheben und nennen.
- src/components/einheiten/EinheitCard.astro: Badge.
- scripts/check-all.mjs STATUS_OK und scripts/check-v42.mjs.
- CLAUDE.md, Abschnitt «Einheiten-Sichtbarkeit»; ENTSCHEIDE.md neue Nummer.
- Daten: 1.3.1_konsum_verantworten → status "archiviert",
  ersetzt_durch "1.3.1_konsum_verantworten_v42". Sonst keine Einheit.

BEWEIS
- npm run build:einheiten-index; check-all --alle wie vorher (keine neue
  rote Einheit); npm run build.
- Im Dev-Server als kt1, als lp und als gast: Katalog, Direkt-URL der alten
  1.3.1, Jahresplanung, /m/…; je ein Bildschirmfoto bzw. der gelesene
  Seitentext als Beleg. Ein Tippfehler-Status in einer Temp-Kopie bricht
  den Index-Bau ab.
- bestand-v42 --pruefen unverändert.

Commit ohne Push; Deploy erst auf mein «ok».
```
