# Medien-Pilot — Rechercheauftrag (Machbarkeitstest)

## Worum es geht
bbw-hko-Einheiten (ABU, Berufsfachschule, Lernende EFZ 16–20 J.) sollen optional eine «Plus»-Version
mit Medien bekommen: Pro Herausforderung (A, B, C) **drei Medien**:
1. **Video** — SRF-Einzelbeitrag (Segment mit eigener URN, nicht ganze Sendung), ideal 2–8 min
2. **Audio** — SRF-Radio-/Podcast-Beitrag (eigene URN), ideal 3–15 min
3. **Webartikel** — **frei zugänglich ohne Paywall/Login** (srf.ch, watson.ch, nau.ch, blick.ch ohne Blick+, swissinfo.ch u. ä.), lesbar für Lernende, ca. 400–1500 Wörter

Die Lernenden setzen die drei Medien später in einer Mindmap mit den Kernbegriffen der Einheit in
Verbindung und nutzen sie als Inspiration fürs Handlungsprodukt. Ein Medium ist also dann gut,
wenn es **die Situation der Herausforderung spiegelt** und **mindestens zwei Kernbegriffe** konkret
macht. Der Zugang erfolgt auf Papier über einen QR-Code auf eine Seite mit Links/Embeds.

Dies ist ein **Machbarkeitstest**. Wir wollen wissen: Findet ein Agent mit den bestehenden Skills
pro Herausforderung passende, haltbare, frei zugängliche Medien — mit welchem Aufwand, wo hakt es?

## Werkzeuge (Skills zuerst lesen!)
- `C:\Users\lp4prossi\.claude\skills\srgssr-api\SKILL.md` — SRG-API (scripts/srg.py, Python:
  `C:/Users/lp4prossi/AppData/Local/hermes/hermes-agent/venv/Scripts/python`). Segmente, URN,
  Embed-Link, media_composition, Audio-Suche, VTT. Achtung: einige MCP-Tools kaputt (steht in der Skill).
- `C:\Users\lp4prossi\.claude\skills\swissdox-research\SKILL.md` — Swissdox (Playwright, Python312).
  Login ist gültig (geprüft). Swissdox dient zum **Finden** (Sendung/Datum, freie Onlinemedien
  `doctype:WWE`), der Volltext geht **nie** an Lernende.
- `C:\Users\lp4prossi\.claude\skills\swissdox-automation\SKILL.md` — Cross-Media-Rezept (Swissdox → SRG-Segment).
- `C:\Users\lp4prossi\.claude\skills\quellen-recherche-erfassen\SKILL.md` — Haltbarkeitsklassen A/B/C
  und Regel «die Frage darf nicht vom Ausgang abhängen».
- WebSearch / WebFetch (Weg B der SRG-Skill: `site:srf.ch …`; Paywall-Prüfung des Artikels).

Skripte im Skill-Ordner ausführen (cd in den Skill-Ordner oder sys.path setzen). Temporäre
Skripte in deinen Arbeitsordner schreiben, **nicht** per Heredoc mit Windows-Pfaden (Backslashes
werden zerstört).

## Qualitätskriterien pro Medium
- Passung: Welche Situation/Leitfrage und welche Kernbegriffe (Liste unten) deckt es konkret ab?
- Zielgruppe: verständlich für 16–20-Jährige; Nähe zur Lebenswelt (Lehre, erstes Geld, Betrieb) ist ein Plus.
- **Haltbarkeit** (Klasse A/B/C nach quellen-recherche-erfassen) — A/B bevorzugt; die Einheit läuft mehrere Jahre.
- **Verfügbarkeit verifiziert**: SRF-Medium in `media_composition` prüfen (abspielbar? blockReason?
  Ablaufdatum `validTo` falls vorhanden? Geoblock?). Artikel per WebFetch prüfen: frei lesbar, kein Paywall.
- Kein Sprachdublett, kein SDA-Kurzstub (< 1500 Zeichen).
- Datum egal (Archiv ok), sofern noch verfügbar und nicht von einem offenen Ausgang abhängig.

## Ablieferung
Schreibe **eine** Datei `<Arbeitsordner>\<einheit-slug>.md` mit:

### Pro Herausforderung (A, B, C)
Für Video, Audio, Artikel je **1 Favorit + 1 Ersatz**, jeweils:
- Titel · Sendung/Medium · Datum · Dauer bzw. Wortzahl
- URN + Embed-Link (SRF) bzw. URL (Artikel)
- Verfügbarkeit: wie geprüft, Ergebnis (inkl. validTo/Paywall)
- Haltbarkeitsklasse A/B/C + 1 Satz Begründung
- Passung: welche Kernbegriffe, welche Leitfrage, 1–2 Sätze warum
- Skizze: eine mögliche Mindmap-Verbindung (Medium ↔ Begriff) in einem Satz
Wenn für eine Kategorie nichts Brauchbares gefunden wurde: ehrlich sagen, was versucht wurde.

### Machbarkeitsprotokoll (am Ende)
- Welche Suchwege liefen (SRG-Scan, Hybrid-Websuche, Swissdox, Audio-Index), welche brachten Treffer, welche nicht
- Grobe Anzahl Suchen/Calls und Zeitaufwand pro Herausforderung
- Stolpersteine (kaputte Tools, Paywalls, abgelaufene Medien, fehlende Segmente, Audio ohne eigene URN …)
- Einschätzung: Was sollte eine Skill-Erweiterung automatisieren, was braucht Pietros Entscheid?

**Nichts im Repo `D:\OS\dev\bbw-hko` ändern.** Nur in deinen Arbeitsordner schreiben.
Keine Volltexte ablegen (Pilot) — kurze eigene Zusammenfassung pro Medium (2–3 Sätze) genügt.
Messbare Erfolgsbedingung: Die Datei existiert und enthält für 3 Herausforderungen × 3 Medien je
einen Eintrag (Treffer oder begründetes «nicht gefunden») sowie das Protokoll.
