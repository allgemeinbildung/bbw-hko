# Bericht — Generator-Skill `bbw-hko-heft-v42`

Gebaut am 02.10.2026 auf dem Branch `v42-skill` (von `v42-gold-1.3.1`,
`bd80e89`). **Nichts ist gepusht, nichts deployt, `main` ist unberührt.**
Auftrag: `docs/ORCHESTRATION-skill-v42.md` · Entscheide: `ENTSCHEIDE.md` E20–E27.

---

## 1. Was zuerst zu wissen ist

1. **Die Probe-Einheiten sind noch nicht erzeugt.** Auf Pietros Vorgabe
   (E22) läuft die Erzeugung je Bauplan in einer eigenen Cloud-Session. Diese
   Session liefert die Skill, die Rückwärtsprobe und zwei freigegebene
   Baupläne mit Quellen. Der Vergleich Gold gegen Probe (Leitprinzip, Punkt 5)
   kann darum erst nach dem Cloud-Lauf ausgefüllt werden; das Raster dafür
   steht in §6.
2. **`check-v42.mjs` sperrt sechs Wörter des Piloten für jede Einheit**
   (Leasing, Konsumkredit, Kleinkredit, E-Bike, ebike, Mobilität — fest im
   Code, Zeilen 768–771). Nicht angefasst (E24). Folge: 4J 2.5 (Klima) und
   8.4.2 (Finanzierungsarten) sind erst nach einer Korrektur erzeugbar. Die
   Korrektur ist eine Zeile; die Gold-Einheit bleibt grün.
3. **Kein Audio und kein Video ist gegengehört.** Alle Quellen der zwei
   Baupläne stützen sich auf Transkripte (Swissdox) und Untertitel (SRG). Die
   Zeitmarken der vier Audios sind berechnet oder geschätzt.

## 2. Was gebaut ist

**Skill** `.claude/skills/bbw-hko-heft-v42/` — rund 7700 Zeilen:

| Teil | Inhalt |
|---|---|
| `SKILL.md` | Leitprinzip, Vorrang der Vorgaben, zwei Betriebsarten (ein Bauplan-Stopp / Auto), Phasen 0–9, zwölf Regeln, Verhalten bei fehlender Voraussetzung |
| `references/kohaerenz.md` | was in jeder Einheit fest ist (F1–F13), was hergeleitet wird (H1–H9), die Abdeckungstabelle A1–A14, der Vergleich mit Gold |
| `references/datenvertrag.md` | jedes Feld der fünf JSON-Dateien und der Quellenkarte mit Herkunft, Budget und Fehlercode |
| `references/phase-0 … phase-9`, `phase-q` | je Phase eine Arbeitsanweisung |
| `references/auto-modus.md`, `ableitungsregeln.md` | Regel für jeden früheren Stopp; Ordner, IDs, Kurzlink, Quellen-IDs (E21) |
| `references/sprache.md`, `umlaute.md`, `nrlp-lehrmittel-crosswalk.md`, `sprachmodus-ids.md` | aus der alten Skill kopiert und bereinigt (nie verlinkt) |
| `assets/` | Skelette für Heft, Set, KN, Prinzip, Quellenkarte, Begleiter — Schlüsselmenge gleich der Gold-Einheit, kein Inhalt daraus |
| `scripts/begleiter-marker.mjs` | füllt und prüft die rund 250 Marker des Begleiters aus den fertigen JSON-Dateien |

**Renderer, an den zwei geöffneten Stellen** (E25, E26; Commit `53c9fc5`):
der Auftragsbogen richtet A2 und A3 nach `gemeinsamer_auftrag.produkte`
(Form `flaeche` oder `spur`); das Produktbild kennt zusätzlich Fliesstext
(`text`) und Wechselrede (`wechsel`). Ohne die neuen Felder rendert alles wie
vorher.

**Anschluss:** `docs/cloud-run/RUN.md` ruft die neue Skill im Auto-Modus;
`docs/cloud-run/bauplaene/_VORLAGE.md` ist auf v4.2 umgeschrieben; `CLAUDE.md`
nennt beide Skills und welche Standard ist (die Datei ist im öffentlichen Repo
nicht versioniert, sie geht über den Spiegel mit).

**Zwei Baupläne, beide von Pietro freigegeben am 02.10.2026:**

| Bauplan | Lehrgang | Hefte | Quellenkarten |
|---|---|---|---|
| `2.3.1_anliegen_vertreten` | EFZ 3J (+ 4J) | A: Factsheet zum eigenen Anliegen · B: Gruppendiskussion | 6 (`q-231…`) |
| `2.1.1_informationen_hinterfragen` | EFZ 4J (+ 3J) | A: Übersicht der Beteiligten, **nur Medien-Spur** · B: Mediennutzungs-Protokoll mit Reflexion | 8 (`q-211…`) |

## 3. Gates (Stand am Schluss)

| Gate | Ergebnis |
|---|---|
| `node scripts/check-all.mjs 1.3.1_konsum_verantworten_v42` | GRUEN |
| `node scripts/bestand-v42.mjs --pruefen` | «26 Dokumente unverändert» |
| Gold-Export vor und nach dem Renderer-Eingriff | 9 von 9 HTML bytegleich; `word/document.xml` der Hefte, Lösungen und des Auftragsbogens gleich |
| `npm run build` | Exit 0 (nach dem Renderer-Eingriff) |
| `git diff v42-gold-1.3.1 -- .claude/skills/bbw-hko-3er-set` (und EBA, KI-Komplement) | leer |
| Tote Verweise in der Skill | keine |
| Vorlagen-Abgleich Skelette gegen Gold | Differenz 0 (ausser `produkte`, bewusst zusätzlich) |

**Rückwärtsprobe (Schritt 7 des Briefs).** Ein Executor hat aus einem Bauplan
für 1.3.1 die Einheit `1.3.1_rueckprobe_tmp` erzeugt — nur mit Skill, Bauplan,
Lehrmittel und den vorhandenen Karten, ohne die Gold-Einheit zu lesen.
Ergebnis: `check-all` im ersten Durchgang grün, **keine Reparaturrunde**;
keine Seite läuft über; Bestand unverändert. Schlüsselmengen gegen Gold: Heft A
312 von 312, Prinzip 98 von 98, KN gleich; im Set kommt `produkte` dazu, in
Heft B fehlt `nrlp.kompetenzen` (wird beim Laden gefüllt, die Skill schreibt es
nicht). Der Ordner ist entfernt und nicht committet.

**Ein-Spur-Fall.** Mit einer Kopie der Gold-Einheit, deren Heft A nur die
Medien-Spur trägt, laufen `check-v42`, Export und Messung durch (Heft A einmal,
Heft B in beiden Spuren). Das ist der Fall von 2.1.1.

**Trigger-Probe.** Zwölf Formulierungen, zehn auf Anhieb richtig; die zwei
unklaren («create the new HKO Einheit», «Lehrmittelkapitel → Lernsituationen
für ABU Reform 2030») trafen den Wortlaut der alten Beschreibung. Die neue
Beschreibung nennt diese Fälle jetzt ausdrücklich; die alte ist unverändert.

## 4. Was die Skill kann — und was nicht

**Kann:** aus Lehrgang und Kompetenz einen Bauplan schreiben (Phasen 0 und 1),
lokal Quellen suchen und Karten anlegen (Phase Q), nach einer Freigabe ohne
Rückfrage die Einheit erzeugen und durchs Tor bringen (Phasen 2–9), Hefte mit
einer oder zwei Spuren, Aufträge mit beliebigen Sprachmodi, vier Arten von
Produktbild.

**Kann nicht:**

- **EBA**, **KI-Toolbox**, **Präsentation und Werkstatt** für v4.2 (zurückgestellt).
- **T7** und Lebensbezüge ohne Kernkapitel im Crosswalk.
- **In der Cloud recherchieren.** Dort gilt nur, was als Karte und Archivtext
  vorliegt.
- **Audio ohne Transkript** als Quelle mit Raster verwenden.
- **Mündliche Produkte im Heft gleich gut tragen wie schriftliche.** Der
  Heft-Renderer hat feste Texte, die bei einem Gespräch schief klingen: «Das
  geben Sie ab», «Woran sehe ich das in meinem Produkt?», «Kreuzen Sie vor der
  Abgabe an»; Seite 7 ist eine freie Fläche ohne Stationen
  (`seiten-5-8.tsx:97, 121, 176, 231–247`). Diese Stellen liegen ausserhalb
  der zwei geöffneten; die Skill schneidet den Inhalt hinein (Schritte 01–04
  auf Papier, Schritt 05 die Durchführung, `abgaben` nennt nur Abgebbares).
  Ob das genügt, zeigt Heft B von 2.3.1.

## 5. Entscheide dieser Session (alle in `ENTSCHEIDE.md`, mit Rückweg)

| | Entscheid |
|---|---|
| E20 | Name `bbw-hko-heft-v42`, Standard für neue EFZ-Einheiten; alte Skill nur auf ausdrückliche Nennung |
| E21 | Ableitungsregeln für Ordner, IDs, Kurzlink, Quellen-IDs — **nach dem ersten Druck fest** |
| E22 | Probe = zwei T2-Baupläne, lokal vorbereitet, je in einer Cloud-Session erzeugt |
| E23 | Verhalten bei fehlender Voraussetzung |
| E24 | fest eingebaute Fall-Wörter in `check-v42.mjs` — nicht geändert, **Empfehlung: streichen** |
| E25, E26 | Renderer an zwei Stellen verallgemeinert |
| E27 | «geführte» und «geübte» Sprachmodi; `modi_kn` gehört zum Gerüst; SK aus dem Thema |

**Was Pietro noch entscheiden oder prüfen sollte**

1. **E24** — die sechs festen Wörter in `check-v42.mjs` streichen?
2. **SK-Regel.** Die Skill nimmt die SK aus dem nRLP-Thema. Die Gold-Einheit
   tut das nicht (T1 im 4J führt SK 2, 4, 6, 8; Gold trägt 5, 11, 1 und
   2, 6, 11). Die neue Regel erzeugt also bewusst andere Werte.
3. **KN-Formen sind fest**, damit auch `modi_kn` (Rezeption schriftlich,
   Interaktion mündlich, Produktion mündlich, Produktion schriftlich). Ein
   Heft-Modus wie «Rezeption mündlich» kommt im KN nicht vor. Soll der KN je
   Einheit andere Formen tragen können, ist das ein eigener Entscheid.
4. **Mündliche Produkte im Heft** (§4): die festen Texte des Heft-Renderers
   nach dem Cloud-Lauf an Heft B von 2.3.1 ansehen.
5. **Vor dem Druck gegenhören:** die vier Audios (Zeitmarken, Mundart bei den
   zwei Regionaljournalen) und die Videos. Der Link auf die Erläuterungen des
   Bundesrates antwortet auf automatischen Abruf mit 403; im Browser lud das
   PDF am 02.10.2026.
6. **Crosswalk nachführen:** Zeile 3J 2.3 führt die Kapitel 18.2 und 18.3
   nicht, obwohl 2.3.2 den Aspekt Ethik trägt; Zeile 4J 1.3 nennt 2.7 und 17.2
   nicht, die die Gold-Einheit braucht.

## 6. Leitprinzip — der Vergleich Gold gegen Probe

**Gerüst (muss nach dem Cloud-Lauf Zeile für Zeile gleich sein):** F1–F13 in
`references/kohaerenz.md` §1. Belegt ist das bisher an der Rückwärtsprobe
(gleiche Schlüsselmengen, gleiches Tor).

**Hergeleitet — Stand der Baupläne:**

| | Gold 1.3.1 (4J) | 2.3.1 (3J) | 2.1.1 (4J) |
|---|---|---|---|
| Geführte Modi Heft A | Rezeption schriftlich und bildlich | Produktion schriftlich und bildlich | Rezeption mündlich, Rezeption audiovisuell |
| Geführte Modi Heft B | Rezeption schriftlich und bildlich, Interaktion mündlich | Interaktion und Kollaboration mündlich | Rezeption und Produktion schriftlich und bildlich |
| **Modi des Auftrags** | Produktion mündlich + Produktion schriftlich und bildlich | Rezeption schriftlich und bildlich + Produktion mündlich | Produktion mündlich + Interaktion mündlich |
| Bogen A2 / A3 | Fläche / Spur | Fläche / Spur | Spur / Spur |
| **Produkt A** | kommentierte Karte (Liste) | Factsheet (Liste) | Übersicht der Beteiligten (Liste) |
| **Produkt B** | Budgettabelle mit Regeln + Gespräch (Tabelle) | Gruppendiskussion mit Karte und Notiz (Wechselrede) | Protokoll mit Reflexion (Tabelle + Fliesstext) |
| Produkte des Auftrags | Entscheidungsblatt + Sprachnachricht | Auswertung eines Schreibens + Statement | Statement + Diskussion |
| **SK** A · B · KN | 5, 11, 1 · 2, 6, 11 · 5, 11, 6 | 1, 12, 6 · 7, 5, 6 · 6, 12, 7 | 7, 6, 5 · 1, 5, 12 · 5, 6, 1 |
| Spuren | beide in A und B | beide in A und B | A nur mit Medien, B beide |
| Quellentyp A / B | Artikel / Grafik | Audio / Audio | Audio / Grafik |

Beide Proben unterscheiden sich von Gold in allen drei verlangten Punkten
(Modi des Auftrags, Produkttypen, SK). Gleich bleibt `modi_kn`, weil die drei
KN-Formen fest sind (E27 Punkt 5).

## 7. Übergabe an die Cloud

Ablauf nach `docs/cloud-run/START.md`, Abschnitt B und C. Für diesen Test:

1. Alles ist auf `v42-skill` committet (Skill, Renderer, Baupläne, 14 Karten).
   Die Volltexte liegen unter `D:\OS\_lab\quellen-archiv\bbw-hko\q-211…` und
   `q-231…`; `scripts/cloud-spiegel.mjs` nimmt sie in den privaten Spiegel.
2. `docs/cloud-run/auftragsliste.md` trägt die zwei Zeilen.
3. `node scripts/cloud-spiegel.mjs --push` (das pusht nur in den privaten
   Spiegel `bbw-hko-produktion`, Branch `cloud` — von dieser Session **nicht**
   ausgeführt).
4. Je Bauplan eine Session mit dem Block aus `docs/cloud-run/HANDOFF.md`,
   ergänzt um: «Bearbeite nur die Zeile `<ordner>` der Auftragsliste.»
5. Nach dem Lauf lokal: Messung nachholen, falls die Cloud «nicht gemessen»
   meldet (`messen-v42` braucht einen Browser), Word-Seiten zählen, Vergleich
   aus §6 ausfüllen, Blindleser und Lösungs-Audit (Schritt 10 des Briefs).

## 8. Nicht belegt oder nicht geprüft

- **Die Probe-Einheiten selbst** — siehe §1.
- **Word:** Aussehen der neuen Blockarten und der Spur-Seiten nicht in Word
  angesehen, nur Seiten gezählt; `mit_medien` nur im HTML gemessen.
- **Gemischte Produktbilder** (Tabelle neben Fliesstext, wie in Heft B von
  2.1.1) sind nicht abgetastet; die Budgets gelten für Blätter aus gleichen
  Blöcken. Dort entscheidet `messen-v42`.
- **Arbeitsansicht im Browser** mit den neuen Eingabefeldern des
  Auftragsbogens.
- **Alte Einheit angesehen:** über `bestand-v42` (26 Fingerabdrücke von zwei
  3er-Einheiten) geprüft, nicht im Browser geöffnet; eine EBA-Einheit ist nicht
  eigens gerendert worden.
- **Lehrmittel:** In `2.7_Preisbildung.md` fehlt auf S. 75 die Güter-Übersicht
  (bei der Texterkennung verloren); in `6.6_Interessengruppen.md` passen
  Bildbeschreibungen nicht zu den Abbildungen. Die Baupläne lassen dort nur
  Fliesstext als Fundstelle zu.
- **Sachlage der Quellen:** Stand Luzern seit 2023, Ausgang Graubünden
  (27.09.2026: Nein) und der Ja-Anteil zur Individualbesteuerung sind nicht an
  einer amtlichen Quelle nachgeschlagen; die Baupläne vermerken es.

## 9. Vorkommnisse

- **Nutzungslimit:** Sechs Agenten sind einmal abgebrochen und wurden an ihrem
  Stand wieder aufgenommen; nichts ging verloren.
- **SRG-API:** Ein Such-Worker hat die Quote kurz ausgeschöpft; danach
  sequentiell. Die `mcp__srgssr__*`-Werkzeuge waren fehlerhaft, gearbeitet
  wurde mit den Skripten der Skill `srgssr-api`.
- **Swissdox:** Sitzung war angemeldet; es wurde nichts eingegeben.
- **Geteiltes Scratchpad:** Ein Agent hat einmal einen Abschnitt der falschen
  Einheit in den Bauplan 2.1.1 gesetzt und es sofort behoben (per Textsuche
  nachgeprüft).
- **Unversioniert geblieben** wie zuvor: `docs/ORCHESTRATION*.md`,
  `docs/pipeline-review-2026-10-01.md`, `docs/upgrade-v4.1/`.
