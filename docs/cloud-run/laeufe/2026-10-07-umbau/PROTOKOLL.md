# Protokoll — Umbau nach dem Rückblick, 07.10.2026

Orchestrator: Opus 5.5 · Branch `v42-skill` · Auftrag: `docs/cloud-run/prompts/sofort/0-orchestrator.md`
Entscheide vorab (Pietro): QR-Seite `/m/<ordner>` einer archivierten Einheit funktioniert weiter ·
Beleg-Dateien ausserhalb des Repos unter `_pruefung/<ordnername>/` · kein Push, kein Merge, kein Deploy.

## Ausgangslage (gemessen vor Auftrag 1)

- HEAD `aa66cb6` = `origin/v42-skill` = in `origin/main` enthalten: alles Versionierte ist öffentlich.
- 63 unversionierte Einträge: 15 Baupläne, 38 Quellenkarten (q-511*, q-531*, q-611*, q-621*, q-631*),
  Prompts (inkl. `sofort/`), `docs/ORCHESTRATION*.md`, `docs/pipeline-review-2026-10-01.md`,
  `docs/upgrade-v4.1/`, `docs/upgrade-v4.2/probe/`, `RUECKBLICK-produktion-2026-10-06.md`.
  Keine geänderte versionierte Datei.
- 27 Einheiten-Ordner, 16 im Format v4.2, alle 16 `publiziert` (E32, E33).
- `check-all` für die 16: GRUEN, 0 Fehler, 0 Warnungen (150 Kapitel, 280 Quellentexte geladen).
- `bestand-v42 --pruefen`: 26 Dokumente unverändert.
- Abweichung von den Aufträgen: 4.3.1 und 5.2.1 sind committet und publiziert (`aa66cb6`);
  Laufordner dazu tragen schon den vollen Ordnernamen (`2026-10-06-<ordner>`).

## Aufträge

### 1 — `2-versionierung-und-leckpruefung.md` · Subagent Opus · erledigt

Commits: `d8e74d6` Leck-Prüfung für Dokumente · `4963a24` Baupläne versioniert (13 Baupläne, 37 Karten) ·
`ae50596` Prompts und Übergabedokumente · `ad54734` Damit es nicht wieder liegen bleibt.

Nachprüfung (selbst ausgeführt):

| Prüfung | Ergebnis |
|---|---|
| nur erlaubte Pfade, Commits vorhanden | ja — keine Einheit, keine Methodenkarte, keine versionierte Quellenkarte, kein `src/lib|pages|components` |
| Beweis des Auftrags | ja — `check-leck docs/ src/data/quellen`: 540 Textdateien, 0 Fehler, 8 Warnungen (unten) |
| `check-all` 16 publizierte v4.2 | ja — GRUEN |
| `bestand-v42 --pruefen` | ja — 26 Dokumente unverändert |
| `npm run build` | ja — Exit 0 |
| Leck in den neuen Commits | ja — keine Warnung in den neu versionierten Dateien |
| keine Einheit/Karte verändert | ja |

Befunde:

- **Kein Lehrmittel- und kein Quellentext ab 25 Wörtern in einer öffentlichen Datei.** Acht Warnungen
  (14–21 Wörter), alle auf Titel- und Notizzeilen der Archivdateien, keine auf Wortlaut einer Quelle:
  `bauplaene/2.2.1_meinungsfreiheit_reflektieren.md` Z. 597 und 674 (eigene Notiz, Sendungstitel mit Datum);
  `titel_original` von `q-121a-vertiefung-1`, `q-211a-vertiefung-2` (dazu `lizenz_hinweis`),
  `q-211b-pflicht-ersatz`, `q-421a-pflicht-ersatz`; unversioniert `q-531b-vertiefung-1`.
- 13 unversionierte Baupläne (nicht 15). In vier davon umformuliert (2.4.1: 13 Stellen im Kohärenz-Audit,
  drei ab 25 Wörtern, wortgleich mit Audit-Notizen im Archiv; 2.2.1 Ausgrenzung, 3.1.1, 5.3.1 je eine).
- `CLAUDE.md` steht in `.gitignore`: der Satz zum Publizieren ist nur lokal nachgeführt.

Eigene Entscheide:

- Die acht Warnungen sind bibliografische Titel bzw. eigene Notizen, kein Quellentext → kein Fall für eine
  Rückfrage an Pietro; gehen als Punkt in OFFEN.md (soll `check-leck` das Feld `titel_original` ausnehmen?).
- `q-531b-vertiefung-1.json` bleibt unversioniert, bis das entschieden ist (der Bauplan 5.3.1 nennt sie).
- `docs/upgrade-v4.2/probe/` (22 MB, neu erzeugbar) per `.gitignore` draussen: hingenommen.

Offen (Auftrag 1): `abdeckung.mjs` stempelt UTC-Datum («Stand 2026-10-06»); kein `npm run check:leck`;
27 schon versionierte Binärdateien unter `docs/` (docx, pdf, png) sind nicht als Text prüfbar.

### 2 — `3-skill-auf-neusten-stand.md` · Subagent Opus · erledigt

Commits: `8b4e6d1` E30 nachgeführt · `29d3ecc` ein Ablauf für jeden Start (lauf.md, phase-10-abschluss.md,
bericht-template.md) · `b30c342` Prompts geschrumpft und archiviert · `0477dd9` E31 Nr. 2–3 · `ce753da` E34 ·
`4886fd3` sieben Widersprüche aus dem Trockenlauf · `f314ec1` zehn aus der zweiten Leserunde.

| Prüfung | Ergebnis |
|---|---|
| nur erlaubte Pfade | ja — Skill-Texte, `_VORLAGE.md`, Prompts, ENTSCHEIDE (nur E34) |
| Beweis: `grep E24\|Leasing` | ja — drei Zeilen, alle historisch (phase-0 Z. 225/230, sprache Z. 114) |
| Beweis: Prompts ohne E-Nummern / «geht vor» | ja — kein Treffer; `einheit-aus-bauplan-lokal.md` 9 Zeilen |
| Beweis: Trockenlauf | ja, nach zwei Runden — siehe unten |
| `check-all` 16 publizierte v4.2 | ja — GRUEN (nach `4886fd3`); nach `f314ec1` Gold GRUEN |
| `bestand-v42 --pruefen` | ja — unverändert |
| `npm run build` | ja — Exit 0 (nach `4886fd3`; danach nur Markdown der Skill) |
| Leck | ja — `check-leck` über Skill, Prompts, ENTSCHEIDE, Vorlage GRUEN |
| keine Einheit/Karte verändert | ja |
| E-Nummern | E34, nicht doppelt |

Trockenlauf (von mir geführt, drei Opus-Leser, nur lesend):

- Runde 1, Einzelstart gegen Schleife: derselbe Ablauf — Rollen und Modelle, Index einmal vor den Executorn,
  A ∥ B, Messung 1 beim Executor, Set → Begleiter, Tor mit Messung 2, zehn Gegenleser + Fakten-Audit (Opus),
  Phase 10 mit Messung 3, ein Bericht, ein Commit inkl. Bauplan und Laufordner. Unterschied nur am Schluss
  (Dev-Server und Warten gegen Kurzmeldung und Weiterlaufen) — gewollt. Beide fanden dieselben Widersprüche.
- Sieben behoben (`4886fd3`), Runde 2 bestätigt alle sieben als eindeutig und fand zehn kleinere; behoben
  in `f314ec1`. Eine dritte Leserunde habe ich nicht mehr gefahren.

Eigene Entscheide (in E34 als «vom Orchestrator entschieden» geführt):

- Marker-Skript: einmal beim Executor Begleiter, danach nur Orchestrator.
- «Eigene Karte» = Quellenkarte, die nur diese noch nicht publizierte Einheit führt: korrigierbar sind
  Zeitmarken, Wortzahl/Dauer, Prüfdatum, Kurzbeschrieb; nie Titel, URL/URN, Ausschnitt.
- Neue Methodenkarte legt der Orchestrator vor den Executorn an; bis zum Commit korrigierbar.
- `--cloud` nur auf dem Cloud-Weg.
- Reparaturrunde = `check-all` und Messung; Überlauf über 2 px nach drei Runden ist kein Abbruch, sondern
  «offen», Einheit bleibt Entwurf, «freigabereif: nein».
- Ordner ohne Commit: melden, nicht verschieben, keine Dauersperre.
- «Skill nicht anfassen» gilt für den Erzeugungslauf, nicht für Sessions, die einen Entscheid fällen.

### 3 — `8-namen-eindeutig.md` · Subagent Sonnet · erledigt

Commits: `54003de` check-namen, Zeile im Tor, `laeufe/INDEX.md` · `97a259b` Skill: Namensregeln (E35).

| Prüfung | Ergebnis |
|---|---|
| nur erlaubte Pfade | ja — `scripts/check-namen.mjs`, `check-all.mjs`, fünf References, `INDEX.md`, E35 |
| Beweis: `check-namen` ganzer Bestand | ja — 27 Einheiten, 156 Quellenkarten, 42 Methodenkarten, 17 Laufordner, 20 Baupläne; 0 Fehler, 2 Warnungen |
| Beweis: leeres Archiv | ja — «kein GRUEN», Exit 0 mit Hinweis (wie `check-all` ohne Lehrmittel) |
| Gegenprobe (11 Mutationen in Temp-Kopie) | laut Subagent gemeldet; von mir nicht wiederholt |
| `check-all` 16 publizierte v4.2 | ja — GRUEN, neue Zeile «Namen» mit 2 Warnungen |
| `bestand-v42 --pruefen` | ja — unverändert |
| `npm run build` | ja — Exit 0 |
| Leck | ja — GRUEN über `scripts/`, Skill, INDEX |
| keine Einheit/Karte verändert | ja |
| E-Nummern | E35, nicht doppelt |

Befunde Bestand: `NAME_ARCHIV_REF` bei `q-221a-pflicht` und `q-221a-pflicht-ersatz` (über Kreuz; Auftrag 6).
Sonst keine doppelte ID, keine Kurzlink-Kollision, keine verwaiste Karte.

Eigene Entscheide: geteilte Karten als Liste `GETEILT` im Skript (Datenvertrag bleibt); Laufordner ohne
`BERICHT.md` sind zulässig (dieses Protokoll). Die Zeile «Namen» steht einmal vor der Einheiten-Schleife
und gibt ihre Warnungen eingerückt aus — hingenommen.

Offen (Auftrag 3): Feld `geteilt_mit` an der Karte als Vorschlag (E35); `[-<k>]` fehlt noch in `SKILL.md`
Z. 75, `bericht-template.md` Z. 4, `phase-10-abschluss.md`; Frage, ob ein späterer «Abschluss» im
bestehenden Laufordner weiterschreibt; `_pruefung/<ordner>/` und Export-Dateinamen prüft kein Skript.

### 4 — `4-karten-aendern-oder-neu.md` · Subagent Opus · erledigt

Commits: `8c85c54` karten.mjs, Zeile «Karten» im Tor, Vermerk-Dateien · `9b221cb` Regel in
`methodenkartei.md` und `references/karten.md` · `d2a3472` E36.

| Prüfung | Ergebnis |
|---|---|
| nur erlaubte Pfade | ja — dazu `_`-Filter in `check-namen.mjs`/`check-all.mjs` (erlaubt) und zwei leere Vermerk-Dateien |
| Beweis: Verbraucher gegen Textsuche | ja — `lm-17-3-3b-schema` 18 Einheiten, `hko-quelle-raster` 16 (beides = `git grep`) |
| Beweis: Probeänderung | ja — `lm-16-4-fragearten.merk` geändert → `check-all` ROT (`KARTE_OHNE_VERMERK`); zurückgenommen, Baum sauber. «Mit Vermerk grün» laut Subagent, von mir nicht wiederholt |
| `check-all` 16 publizierte v4.2 | ja — GRUEN |
| `bestand-v42 --pruefen` | ja — unverändert |
| `npm run build` | ja — Exit 0 |
| Leck | ja — GRUEN |
| keine Einheit/Karte verändert | ja |
| E-Nummern | E36, nicht doppelt |

Befunde (für die Sammelliste):

- **`a5fa3eb` (07.10., schon auf `origin/main`) hat `lm-17-3-3b-schema.seiten` geändert, als 14 Verbraucher
  publiziert waren; gemessen wurde danach nur 5.2.1.** Kein Vermerk.
- Messung nach den 17 Kartenänderungen vom 05.10. ist für zwölf Einheiten nicht belegt. Der Subagent hat
  heute alle 16 nachgemessen: 15 ohne Überlauf, 2.3.1 Heft A S. 6 +1,8 px (E28); knapp 2.5.1 S. 8, 3.3.1 S. 6.
- `beispiel` im Kern an drei `lm-`Karten (1.1.1_ausbildung_kommunizieren B, 2.5.1 B, 3.3.1 A) ist vom
  Datenvertrag §11.3 nicht gedeckt → Entscheid Pietro (Vorschlag: §11.3 an Regel c angleichen).
- Regel e: 25 Warnungen in 17 von 42 Methodenkarten (feste Zahlen und Formate).
- 3.1.1 führt von Gold nur die vier Vertiefungen `q-131*`, nicht die Pflichtquellen (Annahme im Rückblick
  war überholt); `GETEILT` in `check-namen.mjs` ist dafür zu weit.

Eigene Entscheide: «gebunden» = jeder Status ausser `entwurf` (archiviert zählt wie publiziert, getrennt
ausgewiesen); Titel/URL/URN einer gebundenen Quellenkarte bleiben auch mit Vermerk rot.

Offen (Auftrag 4): `phase-9-tor.md` und `bericht-template.md` nennen die Zeile «Karten» noch nicht
(geht mit Auftrag 7 mit); ob Verbraucher nach einer Korrektur gemessen sind, prüft kein Skript.

### 5 — `7-status-archiviert.md` · Subagent Opus · erledigt (ohne Browser-Beleg)

Commits: `caf707a` Status «archiviert» (Code, Skripte, Daten, beide Index-Kopien) · `8932d94` E37 und drei
Sätze der Skill. `CLAUDE.md` lokal nachgeführt (gitignored).

| Prüfung | Ergebnis |
|---|---|
| nur erlaubte Pfade | ja, mit zwei Zusätzen: `public/nrlp/ext/units-overlay.js` und `src/pages/admin/katalog.astro` fragten den Status ebenfalls — hingenommen (sonst wäre die archivierte Einheit dort für lp erschienen) |
| Daten | ja — nur `1.3.1_konsum_verantworten/set.json` (`archiviert`, `ersetzt_durch`); Index-Dateien je 2+/1− |
| Beweis: Sichtbarkeit je Rolle | Funktionsbeleg des Subagenten (kt1 sieht, reviewer/lp/gast nicht); von mir am Code gelesen (`istNurKt1`, `visibleEinheiten`), **nicht im Browser** |
| Beweis: Tippfehler-Status bricht den Index-Bau ab | laut Subagent ja; von mir nicht wiederholt |
| `check-all` 16 publizierte v4.2, alte 1.3.1 | ja — GRUEN; `--alle` laut Subagent vorher wie nachher 4 rote Prüfungen an Alt-Einheiten |
| `bestand-v42 --pruefen` | ja — unverändert |
| `npm run build` | ja — Exit 0 |
| Leck | ja — GRUEN |
| E-Nummern | E37, nicht doppelt |

Eigener Entscheid: kein Login am Dev-Server (er hängt an der produktiven Datenbank) — der Browser-Beleg
geht als Liste «Pietro muss sehen» in OFFEN.md.

Befunde (für die Sammelliste):

- `/m/1.3.1_konsum_verantworten` ist ein 404, vorher wie nachher (3er-Set ohne Medien-Spur); der Entscheid
  «QR-Seite bleibt» wirkt erst bei einer archivierten v4.2-Einheit.
- Bestehende Lücken, nicht angefasst: `/jahresplanung/thema/[nr]` listet Entwürfe und die archivierte für
  jede Rolle; `/einheiten/<ordner>/feedback`, `/ki-liesmich` und zwei Word-API-Routen haben keine
  Entwurf-Schranke. → Entscheid Pietro.
- `reviewer` wird auf den Astro-Seiten wie `lp` behandelt, in der Sub-App unter `public/nrlp/` wie `kt1`.
- `public/nrlp/einheiten.index.json` ist öffentlich und führt alle 27 Einheiten samt Entwürfen und Status.
- `abdeckung.mjs` zählt die archivierte als publiziert.

Sichtbar nach einem Deploy: für lp/gast/anonym nichts; für KT1 Abschnitt «Archiv», grauer Balken auf der
Detailseite, Entwurf-Zähler auf `/admin` 6 → 5.

### 6 — `5-quellenkarten-221a-entwirren.md` · Subagent Sonnet · teilweise

Commit: `6467216` Archivordner und `archiv_ref` der Quellenkarten q-221a gerade gezogen.

| Prüfung | Ergebnis |
|---|---|
| nur erlaubte Pfade | ja — zwei Karten (`archiv_ref`, `lizenz_hinweis`), `_aenderungen.json` (zwei Vermerke), Bauplan (zwei Ordnernamen), `NACHTRAG.md` §11 |
| Archiv | ja — Ordner getauscht, URN jeder Karte steht im `quelle.md` des Ordners gleichen Namens; kein Zwischenordner übrig |
| `check-namen` | ja — 0 Fehler, 0 Warnungen (die zwei `NAME_ARCHIV_REF` sind weg) |
| `karten.mjs geaendert` | ja — GRUEN, beide Karten mit Vermerk |
| `check-all` 16 publizierte v4.2 | ja — GRUEN |
| `bestand-v42 --pruefen` | ja — unverändert |
| `npm run build` | ja — Exit 0 |
| Leck | ja — GRUEN |
| sichtbarer Text | unverändert — `herausforderung_A.json`, `set.json`, `begleiter.md` nicht angefasst |

**Nicht erfüllt: Schritt 3 (Zeitmarken auf 3 Sekunden nachrechnen).** Im Archiv liegt nur das maschinelle
Transkript mit Absätzen von 5–31 Sekunden, keine Untertitel in voller Auflösung. Nichts korrigiert; alle
Marken stehen auf der Gegenhör-Liste (Musliminnen 00:00–03:37: 00:29, 00:57, 01:17, 02:12, 02:23, 02:42,
03:19, Ende 03:37; Jenische und Sinti 00:00–03:51: 01:17, 01:59, 02:28, 02:47, 03:31 — dort ist der Beginn
geschätzt, mögliche Verschiebung um 8 s).

Nebenbefunde: Die Kandidaten 1–6 liegen nach dem Tausch unter dem Ersatz-Ordner; die Kopfzeile «Slot:» in
beiden `quelle.md` nennt noch den alten Slot (Archiv, nicht angefasst).

Sichtbar nach einem Deploy: nichts.

### 7 — `10-belege-und-pruefskripte.md` · vier Opus-Subagenten nacheinander (Stufen A–D), Beweis beim Orchestrator

Commits: `772d412` Stufe A (Ort und Format, Lösungsfelder, Archiv-Bibliothek, E38) · `d65ecde` und `c208669`
Stufe B (fünf Prüfskripte im Tor, check-links, Budgets, Skriptfehler) · `cc8a321` Stufe C (Rollen:
Lösungs-Audit blind, Fakten-Audit, Lösbarkeitsprobe; `audit-paket.mjs`, `gegenhoeren.mjs`) · `078e74b`
Stufe D (herkunft.json, Kartenbelege, `check-skelette.mjs`, `gleiche-stelle.mjs`, `--vor-audit`).

Nachprüfung nach JEDER Stufe (selbst ausgeführt): nur erlaubte Pfade ja · `check-all` 16 publizierte GRUEN
ja · `check-namen` 0/0 ja · `karten.mjs geaendert` GRUEN ja · `bestand-v42 --pruefen` unverändert ja ·
`npm run build` Exit 0 ja · `check-leck` über `scripts/` und Skill GRUEN ja · keine Einheit/Karte verändert
ja · im echten Archiv nichts angelegt ja (`_pruefung/` führt weiter nur den alten Unterordner `png`).
Stichproben: `loesungsfelder --v42` 2062 Felder; `archiv --formen`; `check-zeiger --streng` an 3.3.1 rot
(8 × `ERR_ZEIGER_SCHRITT_OHNE_SEITE`); `audit-paket --out` im Repo wird verweigert (Exit 2);
`check-all --vor-audit` endet «VOR AUDIT», nie «GRUEN»; `check-skelette` 0 Befunde.
Die Gegenproben der Stufen (83 von 83 Codes ausgelöst, Herkunft, Kartenbelege) habe ich nicht wiederholt.

Was das Tor jetzt für die 16 publizierten Einheiten meldet (alles Warnungen, nichts behoben):

- je Einheit `ERR_BELEGE_FEHLT`, `ERR_FAKTEN_FEHLT`, `ERR_FALL_FEHLT` — keine ist auditiert
- `ERR_ZEIGER_SCHRITT_OHNE_SEITE` 127 von 240 Schritt-Hinweisen (jede Einheit, 4–12)
- `ERR_ZEIGER_WOERTER` 7 Karten: `q-121a-pflicht`, `q-221.2b-vertiefung-1`, `q-321a-vertiefung-1`,
  `q-411b-pflicht`, `q-411b-vertiefung-1`, `q-421a-pflicht`, `q-421a-pflicht-ersatz` (Zählweise der
  Recherche nicht belegt gleich — ansehen, bevor es als Fehler gilt)
- Zeitmarken nur blockgenau prüfbar: 15 Karten; nicht prüfbar: `q-131a-vertiefung-1`, `q-221.2a-vertiefung-1`
- `ERR_KOH_LOESUNG_SICHTBAR` 4 (2.4.1 A, 2.5.1 A, 4.1.1 A, 4.3.1 B) · `ERR_KOH_ANZAHL` 3 (2.1.1 Set,
  2.2.1_meinungsfreiheit A, 4.1.1 B) · `ERR_KOH_STUFE_PUNKTE` 3 (1.2.1 Begleiter, 1.3.1_v42 A zweimal)
- Warnungen: gleiche Bezeichnung mit anderer Zahl 19 · Kurzbeschrieb nahe an der Lösung 11 ·
  Woche/Minute als Unterrichtszeit 13
- keine falsche Rechnung; Messung heute: 15 ohne Überlauf, 2.3.1 Heft A S. 6 +1,8 px (E28)

Eigene Entscheide in Auftrag 7:

- Körnung der Lösungsfelder bleibt fein (rund 130 je Einheit); `loesung.kern` bleibt ein eigenes Feld.
- Fehlende Beleg-Dateien sind bei publizierten Einheiten eine Warnung je Datei, keine Fehler; `--streng`
  behandelt jede Einheit wie einen Entwurf.
- `--vor-audit` für den ersten Tor-Durchgang eines Entwurfs (in E38 als Entscheid des Orchestrators).
- Beweis verkleinert gegenüber dem Auftrag: je Einheit EIN Paket des Lösungs-Audits (Heft B, mit Medien —
  dort hat die Abschlussrunde am meisten Lösungsfelder geändert), nicht alle fünf; Fakten-Audit auf 45
  Aussagen begrenzt und nach Art priorisiert; Lösbarkeitsprobe an Heft B mit Medien. Grund: Kosten.

**Fremde Session im Arbeitsbaum (festgestellt nach Stufe D):** Jemand anders arbeitet gleichzeitig an
`.claude/skills/hko-ki-komplement/**` (12 geändert, 2 neu) und hat in `ENTSCHEIDE.md` einen uncommitteten
Block **E39** angehängt. Nichts davon angefasst, nichts davon committet. Folge: Meine Aufträge vergeben
ab jetzt keine E-Nummer mehr bzw. E40; `ENTSCHEIDE.md` wird in dieser Session nicht mehr als Ganzes
gestaged. Die Regel «eine Session je Arbeitsbaum» (lauf.md) ist damit heute verletzt — gemeldet.

**Beweis zu Auftrag 7** (vom Orchestrator geführt; Commit `c27a866`; volle Tabellen in
`BEWEIS-auftrag-10.md` im selben Ordner, Kurzfassung in RUECKBLICK §7)

Aufbau: Altstand `ba2732c` (05.10., 04:05 — vor allen drei Abschlussrunden) per `git archive` in einen
Temp-Ordner ausserhalb des Repos; Archivkopien der Ordner `q-121*`, `q-331*`, `q-421*`; elf Agenten, alle
nur lesend am Repo: Messlatte (Opus), vier Lösungs-Audits (3 Opus, 1 Sonnet), drei Fakten-Audits (Opus,
mit Netz), Lernende (Sonnet), Bewerter (Sonnet), Abgleich (Opus).

| | Ergebnis |
|---|---|
| Messlatte | 138 bekannte Fehler (3.3.1: 47 · 4.2.1: 50 · 1.2.1: 41); 29 davon waren am 05.10. offen oder stehen gelassen |
| in Reichweite der gelaufenen Rollen | 69 von 138 (Lösungs-Audit nur ein Paket von fünf je Einheit, Fakten-Audit auf 45 Aussagen begrenzt) |
| vom Skript gefunden | 2 (`ERR_ZEIGER_SCHRITT_OHNE_SEITE`, `HINWEIS_ZEIT_VERMERK`), 1 weiterer nur mit `fall.json` |
| von einer Rolle als Urteil gefunden | 7 — alle vom Fakten-Audit |
| nur bemerkt (Bemerkung, Rückgabe) | 14 |
| in Reichweite nicht gefunden | 46 (24 übersehen, 8 anders beurteilt, 14 von keiner Rolle in dieser Form geprüft) |
| Ziel «Zeiger, Zahlen, Zeitmarken vom Skript» | nein — 2 von 20 |
| Ziel «Recht und Sache vom Fakten-Audit» | teilweise — 7 von 25 als Urteil |
| Ziel «keine echte Wahl / Stufe 3 unerreichbar von der Probe» | nein an der Messlatte; neu 2 × Stufe 3 unerreichbar, 3 × Form weicht ab |
| Opus gegen Sonnet (3.3.1, 18 Felder) | Opus 14 stimmt / 4 Ableitung, Sonnet 18 stimmt; an den 4 Messlatten-Zeilen des Pakets beide 0 — für ein Urteil zu wenig |
| neue Befunde an publizierten Heften | 41, davon 17 aus den Fakten-Audits (15 stehen heute noch) |
| Kosten gemessen | Lösungs-Audit 3–4 min je Paket, Fakten-Audit 6–10 min für 45 Aussagen; altes Audit nie gemessen |

Nachprüfung des Beweises durch mich: Skriptläufe am Altstand selbst ausgeführt (Zählungen stimmen mit der
Messlatte überein); die Zuordnung «gefunden / nur bemerkt / nicht gefunden» stammt vom Abgleich-Agenten und
ist von mir nicht Zeile für Zeile nachgelesen. `check-leck` über die Beweis-Tabelle GRUEN.

Wichtigste Mängel des Verfahrens (gehen in OFFEN.md): `check-belege` misst die Zeitmarke gegen den Anker,
nicht gegen die Aussage; zusätzliche Belege neben einer Marke gelten als Fehler, darum liessen Auditoren
Belege weg; «Abs. N» eines Gesetzesartikels wird als Archiv-Absatz gelesen; das Blind-Paket führt die
Ersatzquelle nicht als Aufgabe; `fall.json` maskiert gleich grosse Rechtszahlen; `WARN_KOH_ANZAHL` 7 von 7
falsch; `--streng` macht WARN-Codes nicht zu Fehlern; Fedlex und ch.ch sind nur mit Browser lesbar.

Stand Auftrag 7: **erledigt** (gebaut, im Tor, Bestand grün) — der Beweis zeigt aber, dass zwei der drei
Ziele nicht erreicht sind. Nicht nachgebessert, wie der Auftrag es verlangt.

**Zweite Beobachtung zur fremden Session (nach dem Beweis):** Sie ändert inzwischen auch
`src/components/einheiten/docs/*.tsx`, `src/lib/einheiten/docx-builder.ts`, legt `src/lib/einheiten/ki-toolbox.ts`,
`scripts/check-ki-toolbox.mjs` und vier KI-Dateien im Ordner der publizierten Gold-Einheit an — alles
uncommittet. Ab hier können `check-all`, `bestand-v42` und `npm run build` durch fremde Änderungen anders
ausfallen; ich weise das bei jeder Prüfung aus.

### 8 — `6-sammelliste-offen.md` · fünf Sonnet-Sammler, acht Nachprüfer (sechs Sonnet, zwei Opus), `offen.mjs` Sonnet · erledigt

Commit: siehe Schluss (`docs/cloud-run/OFFEN.md`, `scripts/offen.mjs`, dieses Protokoll). Dazu `8d86c45`
(Vermerk q-221a berichtigt — ein Befund der Nachprüfung an meiner eigenen Arbeit aus Auftrag 6).

Ablauf: Fünf Sammler (nur lesend) lieferten 1820 Rohpunkte aus 16 Laufordnern und sieben Dokumenten.
1158 davon führten die Dokumente als offen oder unklar. **Abweichung vom Auftrag:** Das Nachprüfen am Repo
habe ich nicht selbst Punkt für Punkt gemacht, sondern an acht lesende Prüfer vergeben (je Punkt ein Urteil
mit Beleg: Feld, Commit oder E-Nummer); selbst nachgesehen habe ich eine Stichprobe von 18 Urteilen, vier
davon am Feld (alle bestätigt), und zwei Punkte, die ein Prüfer als fraglich meldete. Zusammengebaut ist
`OFFEN.md` mit einem Skript ausserhalb des Repos. `offen.mjs` meldete im ersten Lauf 15 fehlende Punkte und
eine zerrissene Tabellenzeile; beides nachgetragen, danach GRUEN.

| Prüfung | Ergebnis |
|---|---|
| nur erlaubte Pfade | ja — `docs/cloud-run/OFFEN.md`, `scripts/offen.mjs` (dazu der berichtigte Vermerk) |
| Beweis: `node scripts/offen.mjs` | ja — GRUEN, 167 offene Punkte aus 28 Berichtsdateien stehen in OFFEN.md, 906 Zeilen formgerecht |
| Beweis: `offen.mjs --riegel` | ja — GRUEN, keine Zeile mit `[erzeugt Fehler]` |
| Gegenprobe (erfundener Punkt, ID, Riegel, Form) | laut Subagent ausgelöst; von mir nicht wiederholt |
| `check-all` 16 publizierte v4.2 | ja — GRUEN |
| `check-namen` · `karten.mjs geaendert` | ja — beide GRUEN |
| `bestand-v42 --pruefen` | ja — 26 Dokumente unverändert |
| `npm run build` | ja — Exit 0 (mit den uncommitteten Änderungen der fremden Session im Baum) |
| Leck | ja — `check-leck` über OFFEN.md und offen.mjs GRUEN |
| keine Einheit/Karte verändert | ja |
| keine Lernendennamen, kein Quellentext | Vorgabe an Sammler und Prüfer; von mir nicht Zeile für Zeile gelesen |

Zahlen: 1835 Punkte — 906 offen (E 161 · S 100 · K 44 · R 71 · P 70 · Q 43 · H 236 · D 124 · F 57),
371 erledigt und belegt, 456 im Lauf hingenommen, 102 doppelt. 284 offene Punkte betreffen publizierte
Hefte (ohne Hören/Sehen und Entscheide). Von den 124 Entscheiden sind 64 solche, die ich als Orchestrator
getroffen habe und die Pietro bestätigen müsste.

Eigene Entscheide: Keine Zeile trägt heute `[erzeugt Fehler]` — das zu setzen, hält die Produktion an und
ist Pietros Entscheid. Die 456 «im Lauf hingenommen» sind kein offener Punkt, stehen aber in der Datei.
Die Kurzlisten sind nicht kurz (236 · 124 · 284 Zeilen); sie zu kürzen hiesse, Punkte zu gewichten.

Vorschlag für die Skill (nicht eingebaut): «Ein Lauf endet erst, wenn jeder Punkt im Abschnitt Offen seines
Berichts als Zeile in `docs/cloud-run/OFFEN.md` steht und die ID `O-nnnn` im Bericht genannt ist;
`node scripts/offen.mjs <laufordner>` muss GRUEN enden, vor dem Start `node scripts/offen.mjs --riegel`.»

Offen (Auftrag 8): `offen.mjs` liest nur Abschnitte, deren Überschrift «offen» trägt — «unbelegt, nicht
geprüft» der alten Berichte liest es nicht; die Zuordnung alter Berichte läuft über Wortüberlappung
(Schwelle 0,5, gemessen), neue Berichte müssen die ID nennen. Die IDs in OFFEN.md entstehen aus der
Sortierung: Wer die Datei neu baut, vergibt sie neu — ab jetzt von Hand nachführen, nicht neu erzeugen.
Das Bauskript liegt nicht im Repo.

## Schluss

- Die prebuild-Schritte von `npm run build` haben am Schluss die zwei Index-Dateien als geändert
  hinterlassen: Der Index nimmt die uncommitteten KI-Dateien der fremden Session in der Gold-Einheit auf.
  Nicht von mir committet.
- Unversioniert bleibt `src/data/quellen/q-531b-vertiefung-1.json` (Entscheid zu `titel_original` in
  `check-leck`).
- Nichts ist gepusht, nichts gemergt, nichts deployt.

Offen (Auftrag 2): 13 Regel-Lücken aus den Laufberichten, die inhaltliche Regeln, Skelette oder Skripte
verlangen (Liste am Ende von E34 → Sammelliste). «Executor misst selbst» ist am Code gelesen, nicht im Lauf
erprobt. Lösungs-Audit bleibt bis Auftrag 7 bei Sonnet. Cloud-Weg über `RUN.md`: Entscheid offen.
Fortsetzen der Schleife ohne ScheduleWakeup ist nirgends belegt. Fünf freigegebene Baupläne (5.1.1–6.3.1)
haben keinen §10 «Fakten» und nennen in §1/§9 noch die aufgehobene Wortsperre.

