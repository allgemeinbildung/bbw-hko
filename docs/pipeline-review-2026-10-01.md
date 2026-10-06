# Review der Einheiten-Produktionspipeline

Stand 01.10.2026 · HEAD `4ed2bee` · erfasst von vier Subagenten (3er-Skill · Neben-Skills und Orchestrierung · Medien-Plus-MVP · Build-/Check-/Publish-Kette), zusammengeführt und bewertet in der Hauptsession. Reine Analyse, nichts am Code geändert.

**Nachgeprüft in der Hauptsession** (Stichprobe): Status-Logik im Index-Builder, fehlendes `status` im EBA-Set-Template, `prebuild` ohne `check:einheiten`, `methoden` weder im Template noch im Check-Skript, `.gitignore` für `material/_lehrmittel*/`, Fallback in `verify_urns.py`. Alles Übrige stammt aus den Agentenberichten und ist dort mit Datei:Zeile belegt, von mir aber nicht einzeln gegengelesen.

**Nicht geprüft:** die Live-Seite `bbw-hko.ch/admin/medien-plus` (KT1-Login) — beurteilt ist der Quelltext. Vercel-Git-Integration ist lokal nicht belegbar.

---

## 1. Die Pipeline, wie sie heute wirklich ist

| # | Schritt | Wer | Automatisch? | Menschliche Stopps |
|---|---|---|---|---|
| 1 | Kompetenz `X.Y.Z` + Lehrgang wählen | Pietro | nein | 1 |
| 2 | Phase 0: nRLP-Lookup, Crosswalk → Lehrmittelkapitel | `bbw-hko-3er-set` | ja | 0 |
| 3 | Phase 0.5: Prinzip | Skill | ja | **2** (1 aus 3 Versprechen · Prinzip-Review) |
| 4 | Phase 1: 6 Ideen | Skill | ja | **1** (3 aus 6) |
| 5 | Phase 2: Herausforderungen A/B/C inkl. Scaffolding (2g), Lösungen (2b), Methoden (2c) | Skill | ja | bedingt (`knoten_ref` > 3 Seiten, Sekundär-Kompetenzen, ~20 «wartet auf OK»-Fixes) |
| 6 | Phase 3: `set.json` mit `status: entwurf` | Skill | ja | 0 |
| 7 | Phase 4: KN | Skill | ja | **1** (Hybrid-Freigabe) |
| 8 | Phase 5: `begleiter.md` | Skill | ja | 0 |
| 9 | KI-Toolbox | `hko-ki-komplement`, von Hand gestartet | nein | 2 |
| 10 | `check:einheiten`, `check-lf-loesung`, `sync --check` | von Hand | nein | — |
| 11 | `build:einheiten-index` | von Hand (und im `prebuild`) | halb | — |
| 12 | Deck | entsteht zur Laufzeit; CLI `build:deck` ist defekt | ja | — |
| 13 | commit · push · Vercel | von Hand | nein | — |
| 14 | KT1-Abstimmung → `status` umstellen → Index → commit | von Hand | nein | 1 |
| — | **Medienangebot** (Recherche, Auswahl, Teaser, Mindmap, Glossar, QR, Handyseite) | **kein Schritt vorhanden** | — | — |

Pro Einheit also **mindestens 7 Unterbrechungen plus bedingte**, drei von Hand gestartete Skills/Skripte, und für das Medienangebot gar keinen Weg.

---

## 2. Befunde, nach Wirkung geordnet

### A. Das Zielprodukt liegt ausserhalb der Pipeline

1. **`/admin/medien-plus` ist ein handgeschriebenes HTML-Mockup für genau eine Herausforderung (1.3.1 A).** `src/pages/admin/medien-plus.astro` bindet `docs/medien-plus/mock/1.3.1_A_mock.html` als Rohtext ein; kein Byte kommt aus `loadEinheit`, das CSS ist nicht das des Renderers. `docs/medien-plus/KONZEPT.md:3` sagt selbst: «Konzept, nichts umgesetzt».
2. **Von den drei «neuen Teilen» sind zwei schon da, einer fehlt ganz.**
   - Scaffolding: implementiert (Leitfragen-Rail + Block am Handlungsprodukt), wird von der 3er-Skill erzeugt, von keinem Skript geprüft.
   - Methodenkarte: implementiert, wird erzeugt (Schritt 2c) — steht aber nur in der SKILL-Prosa, nicht im Template, nicht im Field-Mapping, nicht in der Checkliste, in keinem Skript.
   - Medienangebot: kein Schema in `types.ts`, kein Loader, kein Renderer, kein Word/ZIP, kein Check, keine Skill-Phase. Die 3er-Skill schliesst Medien sogar ausdrücklich aus (`references/sprachfoerderung-methoden.md:53`).
3. **Das Mockup zeigt eine Einheit, die es so nicht gibt.** Es enthält Glossar, *eine* Reflexionsfrage, zwei Zusatzkriterien, Medien-Mindmap — nichts davon steht in den Daten; die Skill verlangt weiter drei Reflexionsfragen. «Drei neue Teile» sind in Wahrheit fünf bis sechs.
4. **Das Mockup ändert die Seitenfolge** (Auftrag ↔ Methoden; in Plus die Methoden hinter die Arbeitsfläche). Das trifft alle bestehenden Bogen und den Regressions-Guard — im Konzept nicht erwähnt.
5. **NotebookLM kommt in der Produktion nirgends vor.** Einzige Rolle heute: Gegenlesen des Lehrmittel-Crosswalks. Im Medien-Plus-Material kein Treffer. Welche Rolle es haben soll, ist offen (Interview).
6. **Zwei Datenmodelle für dieselbe Sache:** bbw-hko skizziert `medien_plus` als Feld in `herausforderung_*.json`; `hko-deploy/docs/medien-kompetenzen/KONZEPT.md` (uncommittet) plant eine Layer-Datei `{slug}_medien.json`.

### B. Das Medienangebot skaliert so nicht

7. **Dreifache Pflege** derselben Mediendaten (Handyseite `m/131-a.astro`, A4-Seite im Mock, Handy-Vorschau im Mock) plus Pilot-Markdown als Quelle.
8. **Ausgelieferte Links sind andere als die geprüften.** Die «Direkt»-Links auf `/m/131-a` sind von Hand gebaute URLs, nicht die verifizierten URNs. Haltbarkeitsklasse und Prüfdatum fehlen auf der Seite.
9. **`verify_urns.py` meldet OK, auch wenn die URN nicht gefunden wurde** (`hit = chapters[0]`, Z. 26) — genau der Fehler, den der Pilot als Stolperstein beschreibt. Artikel-Links prüft es gar nicht. Kein Zeitplan, kein Empfänger.
10. **Ersatzmedien verletzen die eigenen Regeln** (Kinderformat, 2800 statt ≤ 1500 Wörter, Haltbarkeit C; Favorit von 2017 ohne Altershinweis).
11. **Das Auswahl-Gate wurde im Pilot übersprungen** — im Mock stehen 1:1 die Agent-Favoriten. Bei 30 Herausforderungen wären es ~90 Einzelentscheide und ~180 Medieneinträge.
12. **Kurzlink-Schema ist nicht entschieden** (`/m/131-a` vs. `/m/<setKey>/<A|B|C>` vs. `/m/[code]`). `131-a` ist mehrdeutig, sobald es zwei Einheiten zur selben Kompetenz gibt (heute schon bei 1.1.1 und 3.2.1). Ein gedruckter QR-Code ist nicht mehr änderbar.
13. **Handyseite ohne Tracking** (umgeht `Base.astro`), obwohl das Konzept `page_events` als ersten Messwert nennt. QR kommt zur Laufzeit aus einem CDN — in Word/ZIP gibt es dafür nichts.
14. **Artikel sind der schwächste Teil** (Politik-Pilot: 2 von 6 brauchbar). Kürzen von Zeitungstext ist urheberrechtlich ungeklärt; SRF-Embed auf Schul-Domain ungeprüft.

### C. Die Skill ist für Dialog gebaut, nicht für Autonomie

15. **Kein Auto-Modus.** 4 harte Stopps + bedingte + ~20 «wartet auf OK». Für die meisten Stopps liefert die Skill ihre Empfehlung gleich mit, hat aber keine Auswahlregel und keinen Default.
16. **Lehrgang wird in Phase 2 erfragt, aber in Phase 0 gebraucht.**
17. **Trigger und Input sind Altlast:** «whenever Pietro uploads textbook chapters» / «Pfad oder Inline-Paste» — real läuft es über Crosswalk + lokale Datei.
18. **Persona-Regel 2026-09 nur halb nachgezogen:** ~15 Stellen (SKILL, Templates, kn-/prinzip-architecture, field-mapping) verlangen noch Beruf/Betrieb/Ort oder Pools; Fehlercodes dazu stehen noch in der Tabelle.
19. **Das Template «gewinnt bei Konflikt» — und verletzt die Regeln:** Du-Form und Transliteration in «template-konstanten» Texten, `gewicht_prozent: 15` und 5-Zeilen-Raster gegen «4 Zeilen ohne Gewicht». Ein autonomer Lauf erbt diese Fehler deterministisch.
20. **Felder, die die Skill verlangt, fehlen im Template** (`methoden`, `handlungsprodukt.abgaben`, `nrlp.sprachmodus_ids`, `kompetenz_text` …) und umgekehrt (`emotion_tag`, `kn.template`).
21. **Aspektnamen der Skill stimmen nicht mit dem Datensatz überein** («Technologie und …» vs. «Technologische und …») — Stringvergleiche in Check 4 greifen ins Leere.
22. **Check-Systematik zerfasert:** «32 Checks» gesagt, 35 + 24b vorhanden, Check 35 keiner Phase zugeordnet, Phase 2 verlangt nur «1–9».
23. **Reihenfolgefehler:** 2g verlangt, dass `methoden[].tun` die Kopplung erzählt; erzeugt werden die Methoden aber erst in 2c, nach Validierung und Spellcheck.
24. **Tote Verweise:** `hko-ki-vertiefung-generator`, `hko-scaffolding-generator` (nur in hko-deploy), `error-codes.md`, `docs/auftrag-redesign-handoff.md`, `nrlp.json`. Der echte Nachfolger `hko-ki-komplement` wird in der 3er-Skill nie genannt.

### D. Nichts erzwingt Qualität

25. **Kein Tor.** Kein CI, keine Hooks. `prebuild` prüft nur den Lehrplan selbst. `check:einheiten`, `check-lf-loesung`, `sync --check` laufen nur, wenn jemand sie tippt.
26. **Zwei Checks sind strukturell dauerrot:** `sync-einheiten-nrlp --check` (EBA-Datensatz fehlt in `datasetFile`, Z. 30) und `check-bogen-v2-regression` (seit dem Publish von 1.2.2/1.3.1 — jede künftig publizierte Einheit verletzt ihn).
27. **Publizieren schaltet die Prüfung ab.** Alles ohne `status: entwurf` gilt als «eingefroren»; Befunde zählen nie mehr. `--baseline` kann jeden Befund wegschreiben, «darf nur schrumpfen» prüft niemand.
28. **Kein JSON-Schema.** `kn.json`, `prinzip.json`, `set.json` werden inhaltlich von keinem Skript geprüft. Fehlendes `kn.json` → grauer Chip, publizierbar.
29. **Stille Fehlerpfade im Index-Builder:** kaputtes JSON → `null`; fehlende Herausforderung A → Default `EFZ_3J`; **jeder `status`-Wert ausser exakt `"entwurf"` gilt als live** (Z. 125) — auch ein Tippfehler.
30. **`prebuild` schreibt Quelldateien** (`sync:einheiten-nrlp` ohne `--check`) im Vercel-Container: Produktion zeigt dann anderen Text als das Repo.
31. **Methoden:** unbekannte Refs nur `console.warn` zur Laufzeit; Vier-/Zwei-Regel ungeprüft (bei Verstoss schneidet `.a4-page` still ab).

### E. EBA und KI-Toolbox publizieren ungefragt

32. **Die EBA-Skill stempelt kein `status: entwurf`** (Template ohne Feld) → eine neue EBA-Einheit ist nach dem Index-Rebuild sofort für alle live.
33. **`hko-ki-komplement` setzt kein `entwurf_komponenten`** → nachträglich erzeugte KI-Toolbox einer Live-Einheit ist sofort live.
34. **Die EBA-Skill steht auf dem Stand vom 18.08.2026:** Bogen v2 ohne Kopplung (`liefert`, Rail), Rubrik «Stufe 1–4» statt Punkte, Du-Form-Reste in den References trotz blockierendem `ERR_ANREDE_DU`, Persona-Pools, «5. Leitfrage ergänzen», Fork-Reste («A → B → C», «8 Dateien» bei 7). Eine heute erzeugte EBA-Einheit fiele hinter die zwei publizierten zurück.

### F. Rohstoff und Orchestrierung

35. **Kein Orchestrator.** `hko-orchestrate` und `generate-unit` gehören zu fremden Projekten und haben mit bbw-hko nichts zu tun; sie stehen nur zufällig in der Skill-Liste. Vorbild für Batch-Betrieb: `hko-deploy/.claude/skills/hko-3er-batch-orchestrator` (Wellen zu drei) — anderes Schema, aber das Muster passt.
36. **Lehrmittel ist gitignored.** In einem Worktree oder einer Cloud-Session fehlt der gesamte Quelltext; die Skill kennt den Fall «Datei fehlt» nicht. Parallele Subagenten müssen also im Hauptcheckout laufen.
37. **Crosswalk-Zeilen sind teils zu schmal.** 1.3.1 nutzt fünf Kapitel ausserhalb seiner Zeile — laut Check 31 ein «harter Fehler», den niemand gemeldet hat.
38. **Ohne Sach-Quelltext:** LB 1.2 und 8.5 (nur Methodenkapitel); T7 ist mit der Skill nicht generierbar; EBA hat gar kein Lehrmittel.
39. **`npm run build:deck` ist defekt** (`deck-builder.ts:18`, Import ohne `.ts`) — die Laufzeit-Route ist vermutlich nicht betroffen.
40. **Duplikate ausserhalb des Repos** (Plugin-Skills `hko-einheits-begleiter`, `hko-3er-set-compiler` …) laden in jeder bbw-hko-Session mit und können fälschlich triggern.

### G. Bestand und Menge

- 11 Einheiten; **keine** ist rundum auf neuestem Stand (v3 + Methoden + KI-Toolbox + Marker + Deck).
- Lücke nach Lebensbezügen: **EFZ 3J 19 von 22 · EFZ 4J 24 von 28 · EBA 15 von 16** ohne Einheit. Nach Kompetenzen abgedeckt: 5/50 · 8/63 · 2/32.
- Dokumentation hinkt: `CLAUDE.md` sagt «EBA not yet published / `getNrlp('EBA')` returns null» und nennt `1.1.1_konflikt` als `entwurf_komponenten`-Beispiel — beides überholt.

---

## 3. Zielbild: was Pietro noch entscheidet

Ziel ist nicht «null Stopps», sondern **Stopps gebündelt an zwei Stellen**, mit Vorschlag und Begründung:

| Entscheid | Wann | Form |
|---|---|---|
| **E1 · Auftragsliste** | einmal pro Batch | Liste `(Lehrgang, X.Y.Z, optional Fokus)`; Vorschlag kommt aus der Abdeckungslücke |
| **E2 · Bauplan** | einmal pro Einheit, *vor* dem teuren Teil | eine Seite: empfohlenes Versprechen (+ 2 Alternativen), empfohlene 3 aus 6, Hybrid-Skizze, Ausnahmen. Antwort: «ok» oder Korrektur |
| **E3 · Medien** | einmal pro Einheit | vorsortierte Kandidaten mit Empfehlung; nur Abweichungen anklicken |
| **E4 · Freigabe** | nach KT1 | `entwurf` → `publiziert` über einen Befehl mit Tor |

Alles dazwischen läuft durch: Generierung → Schema- und Regelcheck → automatische Reparatur → KI-Toolbox → Medienrecherche → Linkcheck → Index → Vorschau.

## 4. Was dafür gebaut werden muss (Reihenfolge)

1. **Entscheid Medien-Plus-Umfang und Datenmodell** (Interview) — vorher ist alles andere Spekulation.
2. **Maschinelles Tor:** JSON-Schema für alle Dateien; `check:einheiten` um Methoden (Refs, 4/2-Regel), Pflichtdateien, `status`-Werte, Scaffolding-Budgets erweitern; die zwei dauerroten Checks reparieren oder entfernen; ein `npm run check:all`, das in `prebuild` hängt und für Entwürfe hart ist.
3. **Skill bereinigen:** Templates an die Regeln angleichen (Sie-Form, Umlaute, Raster), Persona-Reste entfernen, `methoden` in Template/Mapping/Checkliste, tote Verweise raus, Lehrgang nach Phase 0, Auto-Modus mit Auswahlregeln und Bauplan-Stopp.
4. **Medien-Schicht:** Schema `medien_plus` in `types.ts`, Route `/m/[code]` aus Daten, Recherche-Skill mit echtem Verifikationsschritt, Linkcheck mit Zeitplan, Renderer + Word.
5. **Orchestrator-Skill** für bbw-hko (Auftragsliste → Wellen → Bauplan-Sammelfreigabe → Lauf → Bericht), inkl. KI-Komplement und `entwurf`-Stempel überall.
6. **EBA-Skill nachziehen** oder ausdrücklich zurückstellen.

## 5. Interview — offene Fragen an Pietro

Siehe Chat vom 01.10.2026.
