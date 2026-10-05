# Phase 4 — Heft-Kern (`herausforderung_A.json`, dann `herausforderung_B.json`)

Der Kern ist alles, was in beiden Spuren gleich ist: Seite 1, Seite 2, Seite 5, drei der vier
Methodenkarten und die Felder, die nur die Lehrperson sieht. **Nicht in dieser Phase:** `spuren`
(Phase 5), `mindmap_aeste`, `abschluss`, `bewertungsraster`, `wochen_plan`,
`handlungsprodukt.beispielbild` und `handlungsprodukt.loesungsbild` (Phase 6). Skelett:
`assets/herausforderung-template.json`; Budgets vollständig in `references/datenvertrag.md`.

**Voraussetzung:** freigegebener Bauplan, `prinzip.json` und `kn.json` liegen im Ordner, die
Kapitel aus `prinzip.quellen_anker.chapters` sind **gelesen** (`material/_lehrmittel/`). Heft A
wird fertig geschrieben und geprüft, dann B.

## 1. Was fest ist, was hergeleitet wird

Gold 1.3.1 ist Referenz für das Gerüst, nie für den Inhalt. **Fest in jedem Heft:** acht Seiten, Kern und Spuren, vier Leitfragen mit fester Funktion (LF1
verstehen, LF2 anwenden, LF3 analysieren, LF4 beurteilen), fünf Schritte, Feedback-Kriterien im
Wortlaut des KN, Persona, Farben, `template`.

**Je Heft hergeleitet — nie aus Gold kopiert:**

| Feld | Woraus |
|---|---|
| Typ und Format des Produkts (`handlungsprodukt.format`, `titel`, `format_detail`, `schritte`, `abgaben`) | `prinzip.herausforderungen.<L>.handlungsprodukt_typ` (Bauplan). Geprüft an zwei Dingen: dem Produktions- oder Interaktionsmodus in `prinzip.modi_pro_heft.<L>` (er bestimmt den Kanal: schriftlich, mündlich, im Gespräch) und den Verben von `nrlp.kompetenz_text` und der weiteren Kompetenzen in `nr_primary` (sie bestimmen die Tätigkeit: ordnen, vergleichen, formulieren, sich austauschen, diskutieren). Trägt das Heft nur Rezeptionsmodi, ist das Produkt die Verarbeitung des Gelesenen oder Gehörten in der Form, die die Verben verlangen. |
| `nrlp.sprachmodi`, `nrlp.sprachmodus_ids` | exakt `prinzip.modi_pro_heft.<L>`; IDs nach `references/sprachmodus-ids.md` |
| `nrlp.sk`, `sk_anker` | exakt `prinzip.sk_pro_situation.<L>` — dort aus den SK des nRLP-Themas gewählt (Phase 2); hier bekommt jede die Stelle, an der sie im Heft wirklich geübt wird |
| `methoden` | Produkttyp und Modus → Karten aus `src/data/methoden/` (§8) |
| Fall, Zahlen, Fakten | erfunden, voraussetzungsfrei, ohne Begriff des KN-Falls (§10) |

Wo eine Herleitung nicht aufgeht (ein Modus oder eine SK hat im Heft keinen Ort), wird das
**Heft** ergänzt, bis sie einen hat. Geht das nicht, wird `prinzip.json` im selben Lauf
korrigiert und der Entscheid steht im Bericht — nie ein Anker, der nur behauptet.

## 2. Reihenfolge innerhalb der Phase

1. Kopf und `nrlp` (§3) — reine Ableitung, keine Prosa.
2. Produkt (§6): `format`, `titel`, `format_detail`, `beschreibung`; dann die fünf `schritte`
   rückwärts vom Produkt — daraus die vier Bausteine, die LF1–LF4 liefern (`liefert`).
3. LF1 und LF2 als Bestellung aus Schritt 01 und 02, je mit `scaffolding` **und** `loesung` (§5).
   Die Bausteine von LF3 und LF4 gehen in `leitfragen_intro` und in Phase 5.
4. Situation, `zahlen_tabelle`, `leitfrage`, `mehrdeutigkeit`, `quellen_anker` (§4).
5. `abgaben`, `feedback_kriterien`, `lernfortschritt` (§6, §7), `methoden` (§8), Felder der
   Lehrperson (§9).
6. Abdeckungsprüfung (§12), Prüfbefehl und Zeichen zählen (§13).

## 3. Kopf und `nrlp`

| Feld | Wert |
|---|---|
| `id` | `<ordner>_hf_A` bzw. `_hf_B` (`references/ableitungsregeln.md`). Der Renderer leitet den Ordner für den QR-Code aus der `id` ab. |
| `template` | `"heft_8page_v42"` |
| `modul` / `modul_titel` | Nummer des Lebensbezugs `X.Y` / `modul_titel` aus Bauplan §1: «<Titel des Themas> — <Fokus in zwei bis vier Wörtern, Kleinschreibung nach dem Gedankenstrich>». In A, B und `set.json` gleich. |
| `lehrgang` | `EFZ_3J` oder `EFZ_4J`, einwertig, in A und B gleich |
| `buchstabe` | `"A"` bzw. `"B"` — gleich wie der Buchstabe im Dateinamen |
| `sit_farbe` / `sit_farbe_light` / `sit_farbe_mid` | Heft A `#C0392B` / `#FADBD8` / `#E74C3C` · Heft B `#2471A3` / `#D6EAF8` / `#3498DB`. Fest je Buchstabe, nie je Thema. Beleg: Gold A und B. (Die alte Skill führt für B `#1A5276` / `#2E86C1`; es gilt die Form der Gold-Einheit.) |
| `titel` | Titel des Hefts aus dem Fall, ≤ 60 |
| `herausforderung` | `{ "buchstabe": <L>, "label": prinzip.herausforderungen.<L>.herausforderung }` |
| `prinzip_ref` | `<ordner>_prinzip` |

`nrlp` — alles aus dem Datensatz des Lehrgangs (`public/nrlp_3j.json` bzw. `nrlp_4j.json`),
Texte zeichengenau:

| Feld | Wert |
|---|---|
| `nr`, `kompetenz_id` | erste Kompetenz des Hefts `X.Y.Z` (beide gleich) |
| `nr_primary` | alle Kompetenzen des Hefts = `prinzip.herausforderungen.<L>.kompetenzen`, erste = `nr` |
| `lebensbezug`, `lebensbezug_id` | `X.Y` (beide gleich) |
| `themen` | `["T<Nummer>"]` |
| `gesellschaft` | je Eintrag `aspekt` (wörtlich aus `gesellschaftliche_inhalte[].aspekt` der Kompetenzen des Hefts, als Auswahl) und `iteration` (= `prinzip.aspekte.<Aspekt>`) |
| `sprachmodi` / `sprachmodus_ids` | siehe §1; gleiche Reihenfolge, gleiche Länge |
| `sk` | Zahlen 1–12, siehe §1 |
| `kompetenz_text` | Satz von `nr`, zeichengenau |
| `lebensbezug_text` | Satz des Lebensbezugs, zeichengenau |

`scripts/sync-einheiten-nrlp.mjs --check` (Teil von `check-all`) vergleicht `kompetenz_text` und
`lebensbezug_text` mit dem Datensatz (`DRIFT`) und meldet jede Nummer aus `nr_primary`, die es
im Lehrgang nicht gibt (`MISS`). **`nrlp.kompetenzen[]` (`kompetenzen`, je `nr` und `text`) wird nicht geschrieben.** Das Feld
füllt `enrichKompetenzen()` in `src/lib/einheiten/kompetenz-text.ts` beim Laden aus `nr_primary`
(Seite `einheiten/[setKey].astro`, `scripts/export-v42.mjs`); die Renderer lesen es und fallen
sonst auf `kompetenz_text` zurück. Eine Kopie auf der Platte wird beim Laden überschrieben, und
kein Skript gleicht sie ab (`sync-einheiten-nrlp.mjs` fasst sie nicht an). Gold B trägt eine
solche Kopie, Gold A nicht; es gilt die Form von A. `nr_primary` genügt, damit Seite 1 alle druckt.

## 4. Seite 1

**`persona`** — Konstante: `beruf` `"Lernende/r EFZ, N. Lehrjahr"`, `betrieb`
`"eigener Lehrbetrieb"`, `ort` `"eigener Wohnort"`. `N` ist `themen[].lehrjahr` des Themas im Datensatz
des Lehrgangs — dasselbe Thema liegt in 3J und 4J nicht im selben Jahr (Thema 3: 3J Lehrjahr 1,
4J Lehrjahr 2). Jede Abweichung ist `ERR_PERSONA_SPEZIFISCH`.

**`situation_text`** — 650–900 Zeichen (hart, auch nach unten). Ich-Form. **Ein** Fall mit
Entscheidungsdruck: Frist, Gegenüber oder Folge, die das Abwarten teuer macht. Das Lehrjahr im
Text stimmt mit `persona` überein. Der letzte Satz sagt, was ich klären will — er ist die Brücke
zur `leitfrage` und zum Produkt. Kein Fachbegriff, den erst LF1 einführt; kein Begriff des
KN-Falls (§10); kein Verweis auf Heft, Auftrag oder KN.

**`zahlen_tabelle`** — höchstens 4 Zeilen, `label` ≤ 45, `wert` ≤ 15. Nur Zahlen und Fakten, die
in `situation_text` vorkommen oder ihn präzisieren; Fallzahlen sind erfunden und plausibel, nie
Zahlen über die Welt. **Hat der Fall keine Zahlen, ist `[]` zulässig**: `check-v42` verlangt 0–4
Zeilen, HTML und Word lassen die Tabelle dann weg. Sinnvoller als eine leere Tabelle sind meist
die Fakten des Falls als Label und Wert — Frist, Dauer, Anzahl Beteiligte, Datum («Antwort an
die Gemeinde bis» / «30.11.», «Beteiligte am Gespräch» / «3 Personen»). `wert` wird
rechtsbündig, einzeilig und in Festbreitenschrift gesetzt: kurze Angabe, kein Satz.

**`leitfrage`** — Ich-Form, ≤ 140, eine Frage, die beide Pole des Spannungsfelds offen lässt und
die das Produkt beantwortet. **`mehrdeutigkeit`** — `explizit` ist `true`; `trade_off` ist **wörtlich** ein Eintrag aus
`prinzip.mehrdeutigkeits_architektur.trade_off_raum` (welcher: Bauplan), ≤ 70; `hint` in
Sie-Form, ≤ 160, nennt beide Pole konkret und gibt keine Antwort.

**`quellen_anker`** — höchstens 3 Einträge aus `prinzip.quellen_anker.chapters`, je `ref` («Kap.
X.Y»), `titel`, `unterueberschrift` (was auf den Seiten steht, eigene Worte), `seiten` («Seite
73-77», Bindestrich), `fuer_leitfrage` (Zahlen 1–4; nie gedruckt). Gedruckt und gemessen wird
die Zeile `titel · unterueberschrift · ref · seiten` — zusammen ≤ 90. **Nur Seiten, die am
Kapiteltext geprüft sind**; das Prinzip nennt das ganze Kapitel, der Anker den Abschnitt, den
das Heft braucht. `ref` muss so geschrieben sein, wie die `knoten_ref` der Leitfragen beginnen
(der Renderer sucht den Anker darüber).

## 5. Seite 2: `leitfragen_intro`, LF1, LF2 — mit Lösung

**`leitfragen_intro`** — ≤ 300, Sie-Form: ein Satz, was entsteht, dann je Leitfrage ihr Baustein
(«LF1 liefert …, LF2 …, LF3 …, LF4 …»). Keine Woche, keine Lektion, keine Minuten. Die Bausteine
von LF3 und LF4 stehen hier so, dass sie in **beiden** Spuren stimmen; Phase 5 übernimmt sie als
`liefert`. **`auftakt_typ`** ist `"pfad"` (sonst `WARN_AUFTAKT_VORBEREITUNG`).

`leitfragen` im Kern hat **genau zwei** Einträge (`ERR_V42_R1`):

| Feld | LF1 | LF2 |
|---|---|---|
| `nr` / `bloom` | `1` / `"Verstehen"` | `2` / `"Anwenden"` |
| Funktion | Begriffe und Kategorien aus dem Lehrmittel | diese auf den eigenen Fall anwenden |
| `knoten_ref` | «Kap. X.Y \| S. aa-bb» | «Kap. X.Y \| S. aa-bb · eigener Fall»; stützt sich LF2 auf zwei Kapitel: «Kap. X.Y \| S. NN · Kap. A.B \| S. NN · eigener Fall» (kein Skript erzwingt ein Muster; der Wert beginnt mit dem `ref` eines `quellen_anker`) |
| `antwortform` | `"schreibfeld"` | `"schreibfeld"` |
| `feld_hoehe_mm` | `35` | `45` |

- `text` ≤ 220, Sie-Form, höchstens zwei Aufträge (ab drei Mustern «Verb Sie»:
  `WARN_LF_MEHRFACHAUFTRAG`). LF1 fragt nur, was auf den genannten Seiten steht.
- `liefert` — 3–7 Wörter, ≤ 50, nominal, ohne «Sie», «Ihr», «Ihre»: Baustein für Schritt 01 bzw. 02.
- `scaffolding`: `strategien` genau 2 (je ≤ 90), `satzanfaenge` 2–3 (je ≤ 60, mit Guillemets),
  `produkt` ≤ 110 — wohin die Antwort im Produkt geht (gedruckt unter «Ins Produkt»).

**`leitfragen[].loesung` entsteht mit der Frage, nicht später.** Grenzen aus
`scripts/check-lf-loesung.mjs`: `kern` ≤ 55; `zeilen` 3–6 Einträge; je Zeile `label` ≤ 24,
`text` Pflicht, `quelle` ≤ 30; alle `text` zusammen ≤ 900.

- LF1: jede Zeile ein Begriff oder eine Kategorie, `text` in eigenen Worten, `quelle` = Kapitel
  und Seite («Kap. X.Y, S. aa»). Steht etwas nicht im Kapitel, sagt die Zeile das
  («Fallüberlegung, nicht aus dem Lehrmittel»).
- LF2: Die Antwort ist persönlich — die Zeilen beschreiben, was eine vollständige Antwort enthält,
  ein gutes Zeichen und den häufigen Fehler; `quelle` nur dort, wo eine Fundstelle gilt.
- Keine Lösung mit Fundstelle möglich: Frage umformulieren, nie die Lösung weglassen.
- **LF2 steht vor der Quelle** (S. 2 vor S. 3) und gehört zum Kern (§10). Sie verlangt darum
  nichts über Personen oder Stimmen, die die Lernenden erst auf S. 3 kennenlernen. Stützt sie sich
  auf einen Satz der Situation über solche Stimmen, dann als **Vermutung** («Welche Grundhaltung
  vermuten Sie dahinter?»), und ein Satzanfang von LF3 nimmt die Vermutung in **jeder** Spur wieder
  auf («Meine Vermutung aus LF2 trifft (nicht) zu, denn …»). Eine Zuordnung, die die Quelle später
  widerlegt, ist nur als Vermutung fair (Fall 2.1.1 A: beide Politikerinnen nennen sich «liberal»).

## 6. Seite 5: Produkt, Schritte, Abgaben

Felder von `handlungsprodukt`:

| Feld | Regel |
|---|---|
| `format` | eine Zeile: Produkttyp und Form, = `prinzip.herausforderungen.<L>.handlungsprodukt_typ` oder dessen Kurzform. Nicht im Heft gedruckt. |
| `titel` | ≤ 60. Steht auf Seite 5 **und** als Beschriftung der Arbeitsfläche auf Seite 7. |
| `format_detail` | Sie-Form: woraus das Produkt besteht, Umfang, bei mündlichen Produkten Dauer und Gegenüber. Nicht im Heft gedruckt, kein Budget. |
| `beschreibung` | Ich-Form, ≤ 200: was ich mit dem Produkt tue |
| `schritte` | genau 5, `label` «01 …» bis «05 …» (ganz ≤ 30), `hint` ≤ 140, Sie-Form |
| `hilfe_verweis` | `"Hilfe: Methoden auf der nächsten Seite"` (≤ 70) |
| `abgaben` | höchstens 3, je ≤ 80 — gedruckt unter «Das geben Sie ab» |

**Kopplung Leitfrage ↔ Schritt** (`scripts/check-einheiten.mjs`, geprüft am Heft Kern + Spur,
einmal je Spur; Warnungen zählen wie Fehler):

| Code | Regel |
|---|---|
| `ERR_KOPPLUNG_NICHT_1ZU1` | nach Auflösung genau 4 Leitfragen und genau 5 Schritte |
| `ERR_LF_LIEFERT_MISSING` · `WARN_LIEFERT_LAENGE` · `WARN_LIEFERT_VERBFORM` | jede LF hat `liefert`, 3–7 Wörter, ohne Anrede |
| `WARN_HINT_OHNE_ABSENDER` | `schritte[0..3].hint` nennt **wörtlich** «LF1», «LF2», «LF3», «LF4» (oder «Leitfrage N») — Schritt 01 ↔ LF1 … Schritt 04 ↔ LF4, index-treu |
| Schritt 05 (E12) | Trägt das Heft `template: "heft_8page_v42"` und `feedback_kriterien`, entfallen die drei Kontrollschritt-Regeln (`WARN_KONTROLLSCHRITT_PRODUZIERT`, `WARN_KONTROLLSCHRITT_OHNE_KRITERIEN`). Schritt 05 nennt keine LF und ist entweder ein Prüfschritt mit den zwei Feedback-Kriterien oder der letzte Produktschritt (die Durchführung). Er darf in `abgaben` stehen. |
| `abgaben` | unter v4.2 keine Kopplungsregel, nur das Budget aus `check-v42` |

**Verweis, der in beiden Spuren stimmt:** LF3 und LF4 entstehen erst in Phase 5, zweimal.
Schritt 03 und 04 nennen darum «LF3» und «LF4» und den **Baustein** (Raster, Befund, Entscheid),
nie das, was nur eine Spur hat: nicht «Artikel», «Video», «Absatz», «Lehrmittel-Abschnitt»,
«Denkhilfe», «Vertiefung». «Raster aus LF3» und «Quelle» gibt es in beiden Spuren.

**Mündliche und interaktive Produkte sind gleichwertig.** Das Heft bleibt Papier, das Produkt nicht:

- *Schritte:* 01–04 bauen auf Papier, was das Sprechen trägt (Begriffe, eigene Lage, Belege,
  Position oder Ziel); Schritt 05 ist die Durchführung («Gespräch führen», «Statement halten»,
  «Diskussion führen») mit Gegenüber, Dauer und dem, was mindestens vorkommen muss.
- *Arbeitsfläche Seite 7:* eine freie Fläche ohne Linien, beschriftet mit
  `handlungsprodukt.titel`. Bei mündlichen und interaktiven Produkten ist sie der Ort für
  **Planung und Notizen**: Stichwortkarte, Gesprächsleitfaden, Ablauf mit Einstieg und Schluss,
  erwartete Einwände. Weil die Fläche keine Struktur vorgibt, geben sie die Schritte und die
  Methodenkarte gegenüber (Seite 6) — der Hint sagt, was auf Seite 7 stehen soll.
- *`abgaben`:* nur, was sich abgeben lässt. Das Gespräch selbst ist keine Abgabe; seine Spur ist
  es: der Leitfaden von Seite 7, eine Notiz nach dem Gespräch (was gesagt, was gefragt, was
  vereinbart wurde), eine Rückmeldung des Gegenübers in einem Satz.

Erfundene Beispiele (Form, nicht Inhalt — keines davon in eine Einheit kopieren):

| Produkttyp · Modus | Fall | Schritte 01–05 | `abgaben` | Seite 7 trägt |
|---|---|---|---|---|
| Statement · Produktion mündlich | Vereinsversammlung: Trainingsabend verlegen? | Begriffe klären (LF1) · eigene Lage notieren (LF2) · Belege wählen (LF3) · Position festlegen (LF4) · Statement halten, 60 Sekunden | Stichwortkarte · Position in einem Satz · Rückmeldung einer Zuhörerin | Stichwortkarte in drei Teilen |
| Gespräch · Interaktion mündlich | Ferientausch mit der Berufsbildnerin aushandeln | Regeln klären (LF1) · eigene Lage ordnen (LF2) · Sicht des Gegenübers belegen (LF3) · Ziel und Spielraum festlegen (LF4) · Gespräch zu zweit führen | Gesprächsleitfaden · Notiz: Ergebnis, offene Punkte · eine Rückfrage des Gegenübers | Leitfaden: Einstieg, Anliegen, Angebot, Abschluss |
| Brief · Produktion schriftlich | Anfrage an die Gemeinde für einen Proberaum | Aufbau klären (LF1) · Anliegen sammeln (LF2) · Gründe belegen (LF3) · Forderung entscheiden (LF4) · mit den Kriterien prüfen | Brief, eine Seite · markierte Begründung | der Brief selbst |
| Vergleichstabelle · Produktion schriftlich und bildlich | zwei Weiterbildungsangebote nach der Lehre | Kriterien festlegen (LF1) · eigene Ziele eintragen (LF2) · Angaben belegen (LF3) · gewichten und entscheiden (LF4) · mit den Kriterien prüfen | Tabelle mit Gewichtung · Entscheid in zwei Sätzen | die Tabelle selbst |

## 7. `feedback_kriterien` und `lernfortschritt`

**`feedback_kriterien`** — genau 2 = 1 SuK + 1 Ges, und zwar die zwei aus
`prinzip.kn_kriterien_verteilung.<L>`. Je Eintrag `kn_kriterium` (= `name`), `dimension` und die
vier `stufen` **zeichengenau** aus `kn.rubrik_shared.kriterien` — kopieren, nie tippen, nie
kürzen, auch wenn eine Stufe etwas nennt, das im Heft nicht vorkommt (E8, E15). A und B zusammen
decken alle Kriterien des KN. Eigener Text ist nur `indikator_produkt` (≤ 90): woran man das
Kriterium **an diesem Produkt** sieht oder hört — bei einem Gespräch ein beobachtbares Verhalten
(«Der Einwand wird beantwortet, nicht übergangen»), kein Wort aus dem Kriteriennamen.

**`lernfortschritt`**, `scaffold_90` — nennt nur Stützen, die es im Heft wirklich gibt (E17):
das Beispielbild auf Seite 6, die Satzanfänge, die Methodenkarten. Im Kern nur, was beide Spuren
haben; jede Spur überschreibt den Wert in Phase 5. **`scaffold_100`** — gedruckt als «Plus», ≤
150, Sie-Form: eine Erweiterung am selben Produkt, die in beiden Spuren möglich ist, ohne das
Wort «Spur» und ohne den Fall des gemeinsamen Auftrags oder des KN (E15).

## 8. `methoden`

Genau 4 Einträge; **an zweiter Stelle** genau einer mit `ref` `"__spur__"` und
`fuer` `"Rezeptionswerkzeug der gewählten Spur"` (ohne `tun`) — ihn ersetzt die Spur durch ihre
Rezeptionskarte. Die drei übrigen: `ref` (Karten-ID), `fuer` («für …», bezogen auf diese
Abgabe), `tun`.

**Auswahl:** zuerst `src/data/methoden/` auflisten und die Karten lesen, dann wählen — nicht aus
dem Gedächtnis. `lm-…`-Karten der Methodenkapitel 16–20 sind zulässig, auch wenn die
Crosswalk-Zeile des Lebensbezugs das Kapitel nicht nennt (ENTSCHEIDE E27): Die Karte ist die
Fundstelle; Fachaussagen des Hefts kommen weiter nur aus den Kapiteln der Zeile. Im Auto-Modus
gelten die Karten aus Bauplan §4. Gewählt wird: (1) eine Karte für die **Form des Produkts** (Typ aus §1), (2) eine für den
**Modus der Durchführung** (zuhören, fragen, rückmelden, gemeinsam schreiben; bei rein
schriftlichen Produkten für die Darstellung), (3) eine für den **Denkschritt von LF4** (begründen,
abwägen, entscheiden).

Orientierung nach dem Feld `fuer` der Karten (Stand 02.10.2026, am Verzeichnis prüfen):
Statement `lm-16-2-statement`, `hko-sprechspur` · Gespräch und Diskussion `lm-16-1-diskussion`,
`lm-16-4-fragearten`, `lm-19-2-vier-ohren`, `lm-19-1-feedback`, `hko-stille-aushalten` ·
Stellungnahme, Brief `lm-17-3-stellungnahme`, `lm-17-3-3b-schema`, `hko-was-zeige-ich` · Plakat,
Kurzformat `lm-16-3-gestaltung`, `hko-befund-kachel` · Karte, Übersicht, Vergleich
`lm-20-1-cluster`, `lm-17-2-stichwortnotizen`, `hko-akteurskarte`, `hko-wirkungskette`.

**Genau zwei der vier aufgelösten Karten sind angereichert** (tragen `beispiel` und/oder
`fehler`; `docs/methodenkartei.md` §5, E13) — die Rezeptionskarte der Spur zählt mit. Die
Rezeptionskarten der Gold-Einheit (`hko-quelle-raster`, `hko-grafik-lesen`) sind angereichert:
Der Kern wählt dann **eine** angereicherte und **zwei** leichte Karten. Bei drei angereicherten
schneidet Seite 6 still ab. Für v4.2 prüft das kein Skript — von Hand zählen (§13).

**`tun`** ist die Übertragung auf genau diese Abgabe, Sie-Form: was die Karte für dieses Produkt
heisst. Pflicht bei Lehrmittel-Karten (`lm-…`); bei eigenen Karten (`hko-…`) nur, wenn die Karte
ohne Übertragung nicht verständlich ist. Kein Begriff des KN-Falls, kein Lehrmitteltext.

**Neue Karte** nur, wenn keine vorhandene passt — dann nach `docs/methodenkartei.md` §4 und §6:
ID `hko-<slug>` oder `lm-<kap>-<slug>`, Musterbeispiel mit **neutralem Sujet** (kein Fall dieser
Einheit), eigene Formulierung, Seitenzahl nur wenn am Buch geprüft. Bestehende Karten werden nie
geändert. Jede neue Karte steht im Bericht.

## 9. Felder, die nur die Lehrperson sieht

| Feld | Regel |
|---|---|
| `mindmap_zentrum` | = `prinzip.mindmap_zentrum_kurz`, ≤ 40, in A und B identisch (`ERR_V42_R7`). Die Äste folgen in Phase 6. |
| `wochen` | `1` |
| `dekontextualisierung` | `frage`: Ich-Form, wo dasselbe sonst noch gilt · `ziel`: `prinzip.dekontextualisierungs_anker.anker_statement`, wörtlich oder auf den Gegenstand des Hefts verengt |
| `prinzip_handoff` | `kernkonzept` (das Kernkonzept des Hefts in einer Zeile) · `lehrmittel_anker` (Kapitel und geprüfte Seiten dieses Hefts) · `kn_aktivierung` (was das Heft für den KN vorbereitet — **das einzige Feld, das den KN-Fall nennen darf**) · `transfer_check` (eine Ja-Nein-Frage an die Lehrperson) |
| `sk_anker` | je SK in `nrlp.sk` genau ein Eintrag mit `sk` (Zahl) und `wo` in der Form «<Feldpfad oder Seite> — <was dort geübt wird>», zum Beispiel «leitfragen[3] + Produkt — zwei Sichtweisen gegeneinander abwägen» oder «S. 7 — den eigenen Standpunkt begründen». Feldpfad: `leitfragen[i]` (nullbasiert im zusammengesetzten Heft: `leitfragen[2]` = LF3), `handlungsprodukt.schritte[i]`, «Produkt» oder ein anderes Feld; mehrere Stellen mit « + » verbunden. Liegt die Stelle in LF3 oder LF4, muss sie in beiden Spuren gelten. |

## 10. Der Kern setzt nichts voraus — und nennt den KN-Fall nicht

**Der Kern darf nichts voraussetzen, was nur eine Spur liefert.** Kein Kern-Text (Situation,
Intro, LF1, LF2, Schritte, Abgaben, Indikator, Plus, `tun`) nennt die Quelle der Medien-Spur,
ihren Typ, eine Zahl daraus, die Denkhilfe oder die Vertiefung. Prüffrage: Stimmt der Satz, wenn
die Klasse die andere Spur hat? **Voraussetzungsfreier Start:** nichts, was vor der ersten Lektion
vorliegen müsste, kein Verweis auf das andere Heft, den Auftrag oder den KN als Bedingung.

**Fall-Ausschluss** (`fallAusschluss` in `check-v42.mjs`, Code `ERR_V42_R9_FALL`): Kein String
des Hefts enthält einen Begriff aus
`prinzip.hybrid_situation_spec.fall_ausschluss_hefte_und_auftrag` — verglichen wird in
Kleinbuchstaben und als **Teilwort** (ein kurzer Begriff trifft auch Zusammensetzungen). Das
gilt für jedes Feld, auch `loesung`, `tun`, `sk_anker`, `dekontextualisierung`, `id`.
Ausgenommen sind nur `feedback_kriterien[].stufen[]` (KN-Wortlaut, E8) und
`prinzip_handoff.kn_aktivierung`. **Gesperrte Wörter (E24):** Zusätzlich sperrt das Skript für jede Einheit fest `leasing`,
`konsumkredit`, `kleinkredit`, `e-bike`, `ebike`, `mobilität`. Braucht der Gegenstand eines
davon, ist die Einheit nicht erzeugbar (`references/auto-modus.md`); umschreiben nur, wenn der
Sinn hält.

## 11. Regeln der Skripte, die den Kern treffen

| Code | Skript | Verlangt |
|---|---|---|
| `ERR_V42_TEMPLATE` | check-v42 | `template` = `heft_8page_v42` |
| `ERR_V42_BUDGET` | check-v42 `budgetKern`, `budgetLeitfrage` | alle Budgets aus §3–§9 |
| `ERR_V42_R1` | check-v42 `regel1` | Kern: genau LF1 und LF2 |
| `ERR_V42_R4` | check-v42 `regel4` | Nennt `nrlp.sprachmodi` oder `prinzip.modi_pro_heft.<L>` «Rezeption mündlich» oder «Rezeption audiovisuell», gibt es keine Spur `ohne_medien` — der Kern muss dann ohne Lehrmittel-Raster tragen |
| `ERR_V42_R6` | check-v42 `regel6` | 2 Kriterien (1 SuK + 1 Ges), Name, Dimension, 4 Stufen zeichengenau; A ∪ B = alle KN-Kriterien |
| `ERR_V42_METHODEN` · `ERR_V42_KARTE_FEHLT_METHODE` | check-v42 | genau 4 Einträge, genau ein `__spur__`, jede andere `ref` existiert als Karte |
| `ERR_V42_R7` | check-v42 | `mindmap_zentrum` in A und B identisch |
| `ERR_V42_R9_FALL` | check-v42 | §10 |
| `ERR_V42_PLATZHALTER` · `ERR_V42_R10_ESZETT` | check-v42 | kein Platzhalter des Skeletts, kein Eszett |
| `ERR_VORAUSSETZUNG_VOR_START` | check-einheiten | in keinem String: «vor der ersten Lektion», «bringen Sie … mit», «erfragen Sie vorab/vorher/im Voraus», «im Voraus», «schon vorher/vorab» — auch nicht in `loesung` oder `tun` |
| `ERR_QUERVERWEIS_ALS_BEDINGUNG` · `WARN_QUERVERWEIS` | check-einheiten | kein «aus/in/wie in Herausforderung A», «aus A und B» |
| `ERR_PERSONA_SPEZIFISCH` | check-einheiten | §4 |
| Kopplung | check-einheiten | Tabelle in §6, dazu `WARN_LF_MEHRFACHAUFTRAG`, `WARN_AUFTAKT_VORBEREITUNG` |
| `ERR_LF_LOESUNG_MISSING` · `WARN_LF_LOESUNG_ZU_LANG` · `ERR_ESZETT_FOUND` | check-lf-loesung | §5; sobald eine LF eine `loesung` hat, braucht sie jede |
| `ERR_ID` · `ERR_BUCHSTABE` · `ERR_TEMPLATE` · `ERR_LEHRGANG_UNEINIG` · `ERR_LEHRMITTEL_WOERTLICH` | check-all | `id` beginnt mit dem Ordnernamen, Buchstabe passt zur Datei, ein Lehrgang, keine wörtliche Passage aus Lehrmittel oder Archiv |
| `ERR_BEREITET_VOR_VERBINDLICH` | check-einheiten | Das Feld `bereitet_vor` kommt in den Gold-Heften nicht vor und wird nicht geschrieben |

## 12. Abdeckungsprüfung (vor dem Prüfbefehl, je Heft)

Schreibe die drei Listen hin, nicht nur das Ergebnis. Sie gehen in den Bericht, zusammen mit:
Produkttyp je Heft (Modus, Verben), gewählte und neue Methodenkarten, jede umformulierte
Leitfrage, jede entfallene Aussage, jede Korrektur an `prinzip.json`.

1. **Sprachmodi.** Für jeden Eintrag in `nrlp.sprachmodi`: die Stelle, an der er geübt wird.
   Rezeption → Seite 3 (LF3 mit Raster, Phase 5; im Kern stehen dafür der Platz `__spur__` und
   Schritt 03). Produktion → das Produkt und der Schritt, der es herstellt. Interaktion → ein
   Schritt mit Gegenüber und eine Abgabe, die das Ergebnis festhält.
2. **Schlüsselkompetenzen.** Für jede Zahl in `nrlp.sk` genau ein `sk_anker`; gleiche Länge,
   gleiche Zahlen. Die genannte Stelle verlangt die SK tatsächlich (wer SK «in Teams arbeiten»
   ankert, braucht einen Schritt zu zweit).
3. **Produkt.** Die fünf Schritte, nacheinander ausgeführt, ergeben genau den Typ aus
   `prinzip.herausforderungen.<L>.handlungsprodukt_typ`: `format`, `titel`, `format_detail`,
   `beschreibung`, Schritt 05 und `abgaben` nennen dasselbe Produkt; jede Abgabe entsteht in
   einem Schritt; jedes Verb der Kompetenzen in `nr_primary` hat eine Leitfrage oder einen
   Schritt.

Dazu zwischen A und B: verschiedene Fälle und Lebensbereiche, verschiedene Produkte, zusammen
alle KN-Kriterien, gleiches `mindmap_zentrum`, gleiche `persona`, gleicher `lehrgang`.

## 13. Prüfen nach jeder Datei

```
node scripts/check-v42.mjs <ordner>
node scripts/check-lf-loesung.mjs <ordner>
node scripts/check-einheiten.mjs <ordner>
```

**Nach Phase 4 erwartet** (verschwindet mit Phase 5–7, alles andere sofort beheben):
`ERR_V42_DATEI` für `set.json`; `ERR_V42_R4` «keine Spur»; `ERR_V42_BUDGET` für `wochen_plan`,
`mindmap_aeste`, `abschluss.quercheck`, `abschluss.mitnahme`, `bewertungsraster`;
`ERR_V42_PRODUKTBILD` (zweimal je Heft); `ERR_V42_R7` für `mindmap_aeste`; `ERR_V42_LOESUNG` für
`abschluss.loesung`; `ERR_V42_GLOSSAR`; in check-einheiten `ERR_KOPPLUNG_NICHT_1ZU1` «2
Leitfragen / 5 Schritte».

**Achtung bei check-einheiten:** Solange `set.json` mit `"status": "entwurf"` fehlt, gilt der
Ordner dem Skript als «eingefroren» — es zeigt die Befunde, zählt sie aber nicht und endet mit
Exit 0. Bis Phase 7 zählt darum die **Liste**, nicht der Exit-Code. Die Hints von Schritt 03 und
04 prüft das Skript erst, wenn die Spuren stehen: «LF3» und «LF4» jetzt schon setzen.

**Zeichen zählen, nicht schätzen** (gleiche Zählweise wie `check-v42`):

```
node -e "const h=require('./src/data/einheiten/<ordner>/herausforderung_A.json');const n=s=>[...String(s||'')].length;const z=(k,v)=>console.log(String(n(v)).padStart(4),k);z('titel',h.titel);z('situation_text',h.situation_text);z('leitfrage',h.leitfrage);z('trade_off',h.mehrdeutigkeit.trade_off);z('hint',h.mehrdeutigkeit.hint);h.quellen_anker.forEach((q,i)=>z('quellen_anker '+i,[q.titel,q.unterueberschrift,q.ref,q.seiten].filter(Boolean).join(String.fromCharCode(32,183,32))));z('leitfragen_intro',h.leitfragen_intro);h.leitfragen.forEach(l=>{z('LF'+l.nr+' text',l.text);z('LF'+l.nr+' liefert',l.liefert);z('LF'+l.nr+' loesung.kern',l.loesung.kern);z('LF'+l.nr+' loesung gesamt',l.loesung.zeilen.map(x=>x.text).join(''))});h.handlungsprodukt.schritte.forEach(s=>z(s.label,s.hint));h.handlungsprodukt.abgaben.forEach(a=>z('abgabe',a));h.feedback_kriterien.forEach(k=>z('indikator_produkt',k.indikator_produkt));z('scaffold_100',h.lernfortschritt.scaffold_100)"
```

Angereicherte Methodenkarten zählen (Soll: mit der Rezeptionskarte genau zwei):

```
node -e "const h=require('./src/data/einheiten/<ordner>/herausforderung_A.json');for(const m of h.methoden){if(m.ref==='__spur__'){console.log('__spur__  (Rezeptionskarte, Phase 5)');continue}const k=require('./src/data/methoden/'+m.ref+'.json');console.log(m.ref,(m.beispiel||k.beispiel||k.fehler)?'angereichert':'leicht')}"
```
