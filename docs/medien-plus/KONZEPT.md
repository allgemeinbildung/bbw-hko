# Medien-Plus — Einheiten mit SRF-Medien erweitern

> Stand: 27.09.2026 · Status: **Konzept, nichts umgesetzt** · Umsetzung geplant: Herbstferien 2026
> Pilot-Ergebnisse: [`pilot/`](pilot/) · Register: `D:\OS\pendenzen.yaml` → `bbw-hko-medien-plus`

## 1. Idee in einem Absatz

Die Einheiten stehen heute auf Lehrmittel und Papier. Mit `srgssr-api`, `swissdox-research` und
`quellen-recherche-erfassen` gibt es inzwischen ein erprobtes System, um die Schweizer Medien nach
passenden Beiträgen zu durchsuchen. Jede Herausforderung bekommt darum **optional** eine
**Plus-Version**: drei Medien (Video, Audio, Webartikel), die zur Situation passen. Die Mindmap
**kaut dann nicht mehr die Leitfragen wieder**, sondern verknüpft die Medien mit den Kernbegriffen
der Einheit. Neuer Inhalt, nicht Wiederholung. Die Lehrperson entscheidet, ob sie Basis oder Plus
einsetzt. Übernehmen oder anpassen darf sie beides.

## 2. Entscheide (Pietro, 27.09.2026)

| # | Frage | Entscheid |
|---|---|---|
| 1 | Pflicht oder Angebot? | **Angebot.** Basis bleibt vollständig und autark. Plus ist ein Zusatz, die Lehrperson wählt. Die Autarkie-Regel (Check 34) bleibt damit für die Basis unberührt. |
| 2 | Mindmap | Basis: **bleibt wie heute**. Plus: **ersetzt** durch die Medien-Mindmap. |
| 3 | Auftrag und Methodenkarte | In **beiden** Versionen steht der Auftrag direkt vor der Arbeitsfläche (gegenüberliegend). Der Auftrag verweist auf die Methodenkarte **ohne Seitenzahl**, damit derselbe Text in Basis und Plus funktioniert. |
| 4 | Medien im Handlungsprodukt | Nur in Plus: Hinweis, wie die Medien ins Produkt einfliessen oder es inspirieren, plus **Zusatzkriterien**, die die Basiskriterien nicht verändern. |
| 5 | Glossar | Kommt in **beide** Versionen, **pro Herausforderung**. Neu zu planen: Skill-Erweiterung und eigene Seite im Renderer. |
| 6 | Reflexion | In **beiden** Versionen **eine** Frage statt drei: Wo begegnen mir diese Inhalte im Alltag oder in Zukunft wieder? Steht auf derselben Seite wie das Glossar. |
| 7 | Medien pro …? | **Pro Herausforderung**, also 3 × 3 = 9 Medien pro Einheit. |
| 8 | Zugang auf Papier | **QR-Code** auf eine Medienseite mit Links oder direkt eingebetteten Beiträgen, nach dem Muster von `hko-deploy` (siehe §5). |
| 9 | Link-Risiko (Beiträge verschwinden) | **Wird in Kauf genommen.** Abgefedert durch Ersatzmedien und einen Linkcheck. |
| 10 | Swissdox | Viele Schulen haben Zugang, aber **Artikel für Lernende nur aus frei zugänglichen Medien**. Swissdox höchstens zum Finden. |
| 11 | Wer recherchiert? | Die Einheiten-Skill wird befähigt, **Subagenten** mit der Recherche zu beauftragen, die **Kandidaten** vorschlagen. Pietro wählt aus. |

## 3. Seitenaufbau

Heute haben alle 30 Herausforderungen 4 Leitfragen und 3 Reflexionsfragen; 14 davon führen eine
Methodenseite (8 Seiten), 16 nicht (7 Seiten):
Cockpit · LF 1–2 · LF 3–4 · Mindmap · Anleitung · [Methoden] · Arbeitsfläche · Selbstcheck + 3 Reflexionsfragen.
Für die 16 ohne Methoden müsste die Skill die Methodenkarte nachliefern, sonst fällt die Seite in Basis und Plus weg.

| Seite | **Basis (neu)** | **Plus** |
|---|---|---|
| 1 | Cockpit + Situation | = |
| 2–3 | Leitfragen | = |
| 4 | Mindmap (wie heute) | **Medien**: Video · Audio · Artikel, je 2–3 Sätze + QR-Code |
| 5 | Methodenkarte | **Medien-Mindmap**: Medien ↔ Kernbegriffe |
| 6 | Auftrag Handlungsprodukt (Verweis «Methodenkarte») | Auftrag + **Kasten «Mit den Medien arbeiten»** + Zusatzkriterien |
| 7 | Arbeitsfläche | Arbeitsfläche + Vermerk «Rückseite: Methodenkarte» |
| 8 | Glossar + 1 Reflexionsfrage | Methodenkarte |
| 9 | — | Glossar + 1 Reflexionsfrage |

**Doppelseitiger Druck:** Die geraden Seiten liegen links, die ungeraden rechts.
- Basis: 4|5 Mindmap neben Methoden, 6|7 Auftrag neben Fläche.
- Plus: 4|5 **Medien neben Medien-Mindmap** (die Seite, die verknüpft, liegt neben dem, was verknüpft wird), 6|7 Auftrag neben Fläche, 8 ist die Rückseite der Fläche.
- Plus hat 9 Seiten, also bleibt eine Rückseite leer. Sie kann Notizen oder Transkript-Stichworte aufnehmen, oder frei bleiben.

**Verschoben** werden Auftrag und Methoden. **Ersetzt** werden Mindmap → Medien-Mindmap und Seite 4 → Medien. **Immer neu** sind Glossar und die einzelne Reflexionsfrage.

## 4. Datenmodell (Skizze, rein additiv)

Wie `methoden` heute: Die Plus-Seiten entstehen nur, wenn die Felder existieren. Die Seitenzahl
wird berechnet (`DocS.tsx`), nirgends festgeschrieben. Bestehende Einheiten bleiben gültig.

```jsonc
// herausforderung_X.json — neue optionale Felder
"glossar": [ { "begriff": "…", "erklaerung": "…", "beispiel": "…" } ],   // beide Versionen
"reflexion_frage": { "text": "…" },                                     // ersetzt reflexion_fragen[3]
"medien_plus": {
  "video":   { "urn": "urn:srf:video:…", "titel": "…", "sendung": "…", "datum": "YYYY-MM-DD",
               "dauer_s": 0, "haltbarkeit": "A|B|C", "teaser": "…", "verifiziert_am": "…",
               "ersatz": { /* gleiches Schema */ } },
  "audio":   { /* wie video, urn:srf:audio:… */ },
  "artikel": { "url": "…", "titel": "…", "medium": "…", "datum": "…", "woerter": 0,
               "frei_geprueft_am": "…", "haltbarkeit": "A|B|C", "teaser": "…", "ersatz": {} },
  "mindmap": { "zentrum": "…", "aeste": [ { "medium": "video|audio|artikel", "begriff": "…", "impuls": "…" } ] },
  "hp_integration": { "hinweis": "…", "zusatzkriterien": [ "…" ] }
}
```

Die Workbench braucht einen Schalter **Basis | Plus**. HTML, Word und ZIP folgen ihm. Im Word-Export
(`docx-builder.ts`) muss dasselbe nachgebaut werden, ebenso im Dossier-Modus (`DocSInfo`).

## 5. Zugang auf Papier: QR und Medienseite

Vorbild ist `hko-deploy`. Dort liegt auf dem Blatt **ein** QR-Code zu einer Player-Seite fürs
Handy, dazu ein Kurzlink (`abu-hko.ch/texte/<slug>`). Die Weiterleitungen erzeugt
`scripts/build-shortlinks.mjs` bei jedem Build aus dem Index (`--check` im CI).
QR-Baustein: `public/missions-renderer/src/…/QRCodeBlock`.

Für bbw-hko (Astro/Vercel statt Firebase):
- Route, zum Beispiel `bbw-hko.ch/m/<setKey>/<A|B|C>`, **ohne Login**. Lernende haben keine
  Konten. Die Seite enthält nur öffentliche Medienlinks und keine Personendaten.
- Inhalt: die drei Medien eingebettet (SRF-Embed `srf.ch/play/embed?urn=…`), der Artikel als Link,
  die Ersatzmedien, falls ein Favorit ausfällt.
- QR-Code auf Seite 4 (Plus), erzeugt beim Rendern. Heute gibt es in bbw-hko noch keine QR-Bibliothek.
- `page_events` zählt, ob die Seite aufgerufen wird. Das ist der erste Messwert, ob Plus genutzt wird.

## 6. Skill-Erweiterung `bbw-hko-3er-set`

Neue Phase **nach** Phase 2, wenn das Handlungsprodukt feststeht. Ohne Produkt lässt sich die
Medienwahl nicht begründen.

1. **Brief pro Herausforderung** aus den JSON-Feldern: Situation, Leitfrage, Leitfragen, Produkt,
   Mindmap-Äste und die Kernbegriffe aus `prinzip.quellen_anker.konzepte`. Vorlage: `pilot/BRIEF.md`.
2. **3 Sonnet-Subagenten parallel**, einer pro Herausforderung, mit den Skills `srgssr-api`,
   `quellen-recherche-erfassen` und bei Bedarf `swissdox-research`.
3. **Pflichtprüfung, bevor Pietro etwas sieht:**
   - jede URN gegen den Integration Layer prüfen (`pilot/verify_urns.py`),
   - jeden Artikel per WebFetch auf Paywall und Länge prüfen.
   - Im Pilot hat ein Agent diesen Schritt ausgelassen und nur Suchtreffer übernommen.
4. **Vorsortieren nach Regeln:**
   - Video 2–8 min, Audio 3–15 min, Artikel 400–1500 Wörter,
   - kein Kinderformat,
   - Hinweis bei Beiträgen, die älter als 5 Jahre sind,
   - Haltbarkeitsklasse A/B bevorzugt,
   - keine Wikipedia und keine Fachblogs als «Artikel».
5. **Gate:** Pietro wählt pro Medium aus 2–3 Kandidaten. Jeder Kandidat zeigt die Mindmap-Verbindung
   und die **Verbindung zum Handlungsprodukt**.
6. Danach schreibt die Skill `medien_plus`: Teaser, Medien-Mindmap, `hp_integration`.

**Glossar** wird eine eigene Phase, auch für die Basis-Version. Quellen:
- `prinzip.quellen_anker.konzepte[]` gibt es schon als «Vokabular-Anker», er wird aber nicht gedruckt.
- Das EBA-«Glossar+» (`DocEbaDossier.tsx`, `{begriff, erklaerung_a2, beispiel}`) dient als
  Vorbild für Renderer und Schema.

Die Skill schliesst heute Medien ausdrücklich aus (`references/sprachfoerderung-methoden.md:53`,
«es wird kein Audio-/Videomaterial generiert») und recherchiert nie extern. Beides muss für
Plus angepasst werden, für die Basis bleibt es.

## 7. Machbarkeitstest (27.09.2026)

Zwei Entwurf-Einheiten, je ein Sonnet-Agent, Auftrag in `pilot/BRIEF.md`.

| | 1.3.1 Konsum verantworten | 5.4.2 Internationale Entscheide |
|---|---|---|
| Plätze belegt (3 HF × 3 Medien, je Favorit + Ersatz) | 9/9 | 9/9 |
| SRF-URNs gegen den Server geprüft | 12/12 abspielbar | 9/9 abspielbar |
| Artikel frei geprüft | 6/6 | 2/6 |
| Laufzeit | ~14 min | ~5 min |

Befunde:
- **Das Finden funktioniert, auch ohne Swissdox.** Am ergiebigsten waren eine gezielte Websuche auf srf.ch mit Prüfung am Server und die Audio-Suche der SRG-API.
- **Alltagswörter statt Systemwörter:** «Sackgeld», «Kostgeld» und «Jugendlohn» treffen. «Budget» und «Lohn» liefern fast nur Staatshaushalt.
- **SRF archiviert lange.** Beiträge von 2010 bis 2019 laufen noch, keiner hat ein Ablaufdatum. Das Risiko ist weniger der tote Link als der **veraltete Inhalt**: Bilder und Zahlen wirken alt.
- **Artikel sind der schwächste Teil.** Für 5.4.2 wurden ein Kanzleiblog, Wikipedia und eine Verbandsseite gewählt. Die Grenze bei Gratismedien ist machbar, bei Politikthemen aber dünn.
- **Fallstrick in `srgssr-api`:** Bei Audio zeigt die Abfrage die ganze Sendung. Wer den ersten Eintrag nimmt, bekommt einen falschen Titel; es muss die ganze Kapitelliste durchsucht werden. Gehört in die Skill.
- Die Favoriten tragen jetzt je eine Mindmap-Skizze **und** eine Verbindung zum Handlungsprodukt. Diese Paare sind die Rohform von `medien_plus.mindmap` und `hp_integration`.

## 8. Offene Fragen

- **Platz auf der Glossar-Seite:** Die v3-Checkliste steht heute auf der Selbstcheck-Seite. Kommt sie zu Glossar und Reflexion, oder zum Auftrag?
- **Plus mit 9 Seiten:** die leere Rückseite nutzen oder bewusst frei lassen?
- **Zusatzkriterien und Kompetenznachweis:** Fliessen die Plus-Kriterien in `lernfortschritt` ein, oder nur in einen eigenen Kasten? Basisraster und KN dürfen sich nicht ändern.
- **Interessenquellen:** Sind Seiten von Verbänden oder Gewerkschaften als Medium zulässig (5.4.2 B, Akteursanalyse)?
- **Alte Beiträge:** Wie alt darf ein Beitrag höchstens sein, oder reicht ein Hinweis mit Jahreszahl?
- **Nachrüsten:** Bekommen die 30 bestehenden Herausforderungen zuerst Basis-neu (Umbau, Glossar, eine Reflexionsfrage), und Plus erst später?
- **Linkcheck:** Wie oft, und wer bekommt die Meldung (Admin-Hinweis, Problem-melden-Ticket)?

## 9. Nächste Schritte (Herbstferien)

1. Offene Fragen aus §8 entscheiden.
2. **Renderer Basis-neu:** Auftrag und Methoden tauschen, Verweis ohne Seitenzahl, Seite Glossar + Reflexion, `reflexion_frage` (HTML + Word).
3. **Renderer Plus:** Medienseite, Medien-Mindmap, Kasten im Auftrag, Vermerk Rückseite, Schalter in der Workbench, ZIP.
4. **Medienseite + QR:** Route ohne Login, QR-Bibliothek, Tracking.
5. **Skill:** Glossar-Phase, Medien-Phase mit Subagenten, Prüfskript, Gate; Fallstrick in `srgssr-api` korrigieren.
6. **Erste Plus-Einheiten:** 1.3.1 und 5.4.2 mit den Pilotfunden. Vorher die schwachen Artikel von 5.4.2 ersetzen und die drei ungeprüften Audios prüfen.

## Dateien

- `pilot/BRIEF.md`: Rechercheauftrag an die Subagenten, Vorlage für die Skill
- `pilot/1.3.1_konsum_verantworten.md`: Funde, Prüfung, Mindmap- und Produkt-Verbindung, Protokoll
- `pilot/5.4.2_internationale_entscheide_wirken_4j.md`: dasselbe, mit Nachprüfung durch die Hauptsession
- `pilot/verify_urns.py`: prüft SRF-URNs gegen den Integration Layer (ohne Login)
