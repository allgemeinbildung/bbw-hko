# Phase 7 — Set (`set.json`)

Ergebnis: `src/data/einheiten/<ordner>/set.json` mit Kopf, Glossar und gemeinsamem
Auftrag. Skelett: `assets/set-template.json`. Voraussetzung: `prinzip.json`,
`kn.json` und beide Hefte liegen vor und sind in `check-v42` ohne Befund.

**Form aus Gold, Inhalt nie.** Die Felder und ihre Reihenfolge sind die der
Gold-Datei `1.3.1_konsum_verantworten_v42/set.json`, dazu `produkte` (E25).
Kein weiteres Feld. Fest in jeder Einheit: ein gemeinsamer Auftrag mit fünf
Schritten, vier KN-Kriterien im Wortlaut, Auftragsbogen mit vier Seiten, Glossar
je Heft. **Herzuleiten je Einheit:** Sprachmodi des Auftrags, daraus die zwei
Produkte und ihre Form auf dem Bogen, die Sozialform, Lebensbereich und Fall.

Leitfaden §7.5 ist an zwei Stellen ersetzt: kein Glossar auf A3 (E17), A4 heisst
«Selbsteinschätzung» (E18).

## 1. Herleitung vor dem Schreiben

Reihenfolge einhalten; jeder Schritt liest eine Datei, keiner das Gedächtnis.

1. **Sprachmodi** = `prinzip.modi_auftrag` (dort nach Leitfaden §7.2 berechnet:
   Modi des KN, die weder Heft A noch Heft B trägt; leer → der KN-Modus mit dem
   geringsten Gewicht in den Heften; mehr als zwei → zwei, der Rest ist im
   Prinzip als Lücke markiert). Bezeichnungen wörtlich wie in
   `references/sprachmodus-ids.md` — auch «Interaktion und Kollaboration …».
2. **Abdeckung prüfen:** `prinzip.modi_kn` ⊆ `modi_pro_heft.A` ∪ `modi_pro_heft.B`
   ∪ `modi_auftrag`. Fehlt ein Modus und ist er im Prinzip nicht als Lücke
   markiert: Fehler in Phase 2, dort beheben, nicht hier.
3. **Zwei Produkte** aus den Modi, nach der Tabelle in §4.
4. **Sozialform** aus den Modi (Leitfaden §7.3): Enthält `sprachmodi` einen
   Interaktionsmodus, ist `einzel` unzulässig (`regel8`, `ERR_V42_R8`).
5. **Lebensbereich** = `prinzip.auftrag_lebensbereich`; paarweise verschieden von
   Heft A, Heft B und KN (Leitfaden §7.1, §11.5 Nr. 9).
6. **Fall:** neu, kombiniert die Konzepte von A und B auf dem K-Niveau des KN
   (K3–K4), aktiviert mindestens zwei Spannungen aus dem Trade-off-Raum — und
   ist weder ein vereinfachter noch ein vorweggenommener KN (§7.1).

## 2. Kopf

| Feld | Wert |
|---|---|
| `id` | `<ordner>_set` (E21) |
| `modul`, `modul_titel` | wie in den Heften (der Index liest beide aus Heft A, nicht aus dem Set) |
| `einheit_titel` | aus Bauplan §1: der Fokus als Titel, ohne Versionszusatz; Zusatz in Klammern nur, wenn im Index (`src/data/einheiten.index.json`, Feld `einheit_titel`) schon eine gleichnamige Einheit steht (E21, `references/ableitungsregeln.md` §7) |
| `lehrgang` | kanonisch, einwertig, wie in den Heften |
| `thema` | `T<n>` wie `nrlp.themen[0]` der Hefte |
| `version` | `"2.1.0"` (Konstante des Skeletts) |
| `status` | **exakt `"entwurf"`** — `ERR_V42_STATUS`; `check-all` lässt nur `entwurf`, `publiziert` oder kein Feld zu, und der Index-Builder behandelt jeden anderen Wert als veröffentlicht |
| `prinzip_ref`, `kn_ref` | `<ordner>_prinzip`, `<ordner>_kn` |
| `herausforderungen` | genau 2: `<ordner>_hf_A`, `<ordner>_hf_B` |
| `wochenplan` | 4 Einträge `{ woche, lektionen, inhalt }`, `woche` 1–4, `lektionen` je 3; `inhalt` wie im Skelett (Leitfaden §8): Heft A · Heft B · Gemeinsamer Auftrag (2) + Rückmeldung (1) · KN (2) + Puffer (1). Steht nur im Set; das Heft nennt keine Woche (E17) |
| `konzept_progression` | 2 Einträge `{ position, herausforderung, konzept }`: `position` 1 und 2, `herausforderung` = ID des Hefts, `konzept` = Kernkonzept des Hefts in einem Satz (aus dessen `prinzip_handoff.kernkonzept`) |
| `spur` | `"wahl"` — immer |

**`spur` bei einem Heft mit nur einer Spur:** bleibt `"wahl"`. Belegt in
`src/lib/einheiten/spuren.ts` und `index.ts`: `effektiveSpur` liefert bei `wahl`
die Standardspur `ohne_medien`; `loadEinheit` löst jede Spur auf, die mindestens
ein Heft führt; `resolveSpur` setzt für ein Heft ohne die verlangte Spur die
erste vorhandene ein. Führt kein Heft `ohne_medien`, gilt die erste vorhandene
Spur. Ein fester Wert in `set.json` ist darum nie nötig.

**`lehrgaenge` (optional, nicht in Gold):** nur setzen, wenn der Bauplan einen
zweiten Lehrgang nennt; Platz direkt nach `lehrgang`. `build-einheiten-index.mjs`
liest die Liste für Katalog-Filter und Anzeige und nimmt den kanonischen Lehrgang
(aus Heft A) immer dazu. `sync-einheiten-nrlp.mjs` prüft jeden zusätzlichen
Lehrgang: Datensatz vorhanden, jede Nummer aus `nrlp.nr_primary` beider Hefte
dort vorhanden, Text der Hauptkompetenz und des Lebensbezugs gleich — sonst
«LEHRGANG … ist unzulaessig», unter `--check` Abbruch. Im Zweifel weglassen.

## 3. `glossar`

Eine Liste für beide Hefte; `loadEinheit` setzt je Heft und Spur die passenden
Einträge ein (Begriffsnetz und Glossar auf S. 8). Reihenfolge wie in Gold: Kern
Heft A in der Reihenfolge der Äste, Spur-Einträge Heft A, dann dasselbe für B.

| Feld | Regel |
|---|---|
| `begriff` | ≤ 25 Zeichen; zeichengleich mit dem Knoten |
| `definition` | ≤ 90 Zeichen, eigene Formulierung — nie der Satz aus Lehrmittel oder Quelle |
| `herkunft` | `lehrmittel` nur, wenn der Begriff im Lehrmittel steht (am Text geprüft) — das gilt auch, wenn er in einem Lehrmittelkapitel ausserhalb der Heft-Kapitel belegt ist; Kapitel und Seite stehen dann im Bericht · `heft` für Begriffe, die das Heft selbst einführt · `quelle` für Begriffe aus der Quelle der Medien-Spur |
| `heft` | `A` oder `B` |
| `spur` | nur bei Spur-Einträgen: `ohne_medien` oder `mit_medien`; fehlt das Feld, gilt der Eintrag in beiden Spuren |

- **Kern (ohne `spur`):** genau die Knoten des Begriffsnetzes aus Phase 6 — alle
  `mindmap_aeste[].punkte` des Hefts ausser dem Transfer-Ast, höchstens zehn.
  `regelGlossar` prüft beide Richtungen (`ERR_V42_GLOSSAR`): jeder Knoten ist ein
  Glossarbegriff, jeder Glossarbegriff ohne `spur` ein Knoten. Wer hier einen
  Begriff ändert, ändert ihn im Heft mit.
- **Spur-Einträge:** je Heft und **vorhandener** Spur ein bis zwei, aus
  `abschluss.loesung.eigene_knoten.<spur>` des Hefts. Das Skript erlaubt 0–2;
  E17 sieht «ein bis zwei aus der Quelle der Spur» vor, Gold führt je Heft und
  Spur mindestens einen. Ohne Medien: `herkunft: "lehrmittel"`; mit Medien:
  `"quelle"`. Für eine Spur, die das Heft nicht hat, gibt es keinen Eintrag.
- **Fall-Ausschluss gilt auch hier:** kein Begriff aus
  `prinzip.hybrid_situation_spec.fall_ausschluss_hefte_und_auftrag` in `begriff`
  oder `definition` (`ERR_V42_R9_FALL`, Teilzeichenkette, Kleinschreibung).

## 4. `gemeinsamer_auftrag`

### 4.1 Produkte und ihre Form (E25)

`produkte` hat **genau zwei Einträge**; der erste belegt Seite A2, der zweite A3.
**Die Skill setzt das Feld immer.** Fehlt es, rendert der Bogen den Sonderfall
der Gold-Einheit (Schritt 04 Fläche, Schritt 05 Sprachnachricht mit drei festen
Stationen) — für jede andere Einheit falsch.

| Modus des Produkts | Produktbeispiele | `form` |
|---|---|---|
| Produktion schriftlich und bildlich | Brief, Plakat, Entscheidungsblatt, Flyer | `flaeche` |
| Produktion mündlich | Statement, Kurzvortrag, Sprachnachricht | `spur` — Stationen = Aufbau des Beitrags |
| Interaktion und Kollaboration mündlich | Gespräch, Diskussion, Verhandlung | `spur` — Stationen = eigene Position, erwarteter Einwand, Antwort, Abschluss; eigener Anteil je Person ausgewiesen |
| Interaktion und Kollaboration schriftlich / digital | Chatverlauf, Mailwechsel | `flaeche` |
| ein Rezeptionsmodus (ergibt die Formel, wenn kein Heft ihn führt — E27) | sichtbare Auswertung eines Dokuments, das **vollständig in der Situation steht**: kommentierte Tabelle, Prüfnotiz mit Markierungen | `flaeche` |

| Feld | Regel |
|---|---|
| `schritt` | Nummer 1–5 des Schritts, der das Produkt trägt; die zwei Werte sind verschieden. **Frei wählbar — nicht immer 4 und 5.** Titel und Hint der Seite kommen aus diesem Schritt |
| `form` | `"flaeche"` oder `"spur"` |
| `modus` | wörtlich einer aus `sprachmodi`; jeder Modus aus `sprachmodi` ist `modus` mindestens eines Eintrags (Abdeckung) |
| `stationen` | nur `spur`, Pflicht: 2–4, je ≤ 60 Zeichen, Ich-Form |
| `hinweis` | nur `spur`, Pflicht: ≤ 260 Zeichen, Sie-Form — wie vorgehen, wie abgeben |
| `dauer` | nur `spur`, optional, ≤ 30 Zeichen («3–4 Minuten»); ohne Angabe entfällt die Zeile «Ziel … · Probelauf» |

Was gedruckt wird (`DocAuftragsbogen.tsx`): Die Seite trägt als Titel das Label
des Schritts, bei `spur` mit dem Zusatz «planen» — das Label ist darum ein Nomen
für das Produkt («Gespräch», nicht «Gespräch führen»). Unter dem Titel steht der
Hint des Schritts; bei `flaeche` steht `modus` in der Beschriftung der Fläche.
Geprüft wird das Feld von `regelAuftragProdukte` in `scripts/check-v42.mjs`
(`ERR_V42_AUFTRAG_PRODUKTE`) — vor dem Schreiben dort nachlesen. Weicht das
Skript von E25 ab, gilt E25; die Abweichung kommt in den Bericht.

**Nur ein Sprachmodus** (Leitfaden §7.2, leere Differenz): Beide Einträge tragen
denselben `modus`. Die zwei Seiten tragen dann zwei Arbeitsschritte desselben
Produkts — Entwurf und Reinschrift, Planung und Durchführung —, weiterhin in
zwei verschiedenen Schritten.

**Fünf erfundene Beispiele** (nur die Form zeigen; nie übernehmen):

```json
"produkte": [
  { "schritt": 3, "form": "spur", "modus": "Interaktion und Kollaboration mündlich",
    "stationen": ["Meine Position", "Der Einwand, den ich erwarte", "Meine Antwort darauf", "Worauf wir uns einigen könnten"],
    "hinweis": "Planen Sie Ihren Anteil am Gespräch in Stichworten. Führen Sie das Gespräch zu zweit; jede Person vertritt ihre eigene Position.",
    "dauer": "4–5 Minuten" },
  { "schritt": 5, "form": "flaeche", "modus": "Produktion schriftlich und bildlich" }
]
```
Verein, Streit um Trainingszeiten: Gespräch in Schritt 03, Aushang in Schritt 05.

```json
"produkte": [
  { "schritt": 4, "form": "flaeche", "modus": "Interaktion und Kollaboration schriftlich" },
  { "schritt": 5, "form": "spur", "modus": "Produktion mündlich",
    "stationen": ["Worum es geht", "Was ich vorschlage", "Was das für die anderen heisst"],
    "hinweis": "Notieren Sie Stichworte, keinen ganzen Text. Sprechen Sie frei und stoppen Sie die Zeit.",
    "dauer": "2 Minuten" }
]
```
Wohngemeinschaft, Ämtliplan: Chatverlauf zu zweit, danach Kurzstatement am WG-Abend.

```json
"produkte": [
  { "schritt": 2, "form": "flaeche", "modus": "Produktion schriftlich und bildlich" },
  { "schritt": 4, "form": "spur", "modus": "Interaktion und Kollaboration mündlich",
    "stationen": ["Mein Standpunkt", "Ein Gegenargument aus der Runde", "Was ich dazu sage"],
    "hinweis": "Bereiten Sie Ihren Beitrag vor. In der Runde spricht jede Person mindestens einmal zu ihrem Standpunkt." }
]
```
Quartier, Umnutzung eines Platzes: Plakat früh im Ablauf, Diskussionsrunde danach — ohne `dauer`.

```json
"produkte": [
  { "schritt": 4, "form": "flaeche", "modus": "Produktion schriftlich und bildlich" },
  { "schritt": 5, "form": "flaeche", "modus": "Produktion schriftlich und bildlich" }
]
```
Nur ein Modus — Einsprache gegen eine Parkbusse: Schritt 04 «Entwurf» (Argumente
ordnen), Schritt 05 «Brief» (Reinschrift). `sprachmodi` hat einen Eintrag.

```json
"produkte": [
  { "schritt": 3, "form": "spur", "modus": "Produktion mündlich",
    "stationen": ["Worum es mir geht", "Mein wichtigster Grund", "Was ich von der Runde möchte"],
    "hinweis": "Planen Sie Ihr Statement in Stichworten. Sprechen Sie es einer Person aus der Klasse vor und stoppen Sie die Zeit.",
    "dauer": "1 Minute" },
  { "schritt": 5, "form": "spur", "modus": "Interaktion und Kollaboration mündlich",
    "stationen": ["Der Vorschlag der anderen Seite", "Meine Rückfrage dazu", "Worauf wir uns einigen", "Wer was übernimmt"],
    "hinweis": "Bereiten Sie die Runde zu dritt vor. Jede Person bringt ihren Vorschlag ein und stellt mindestens eine Rückfrage." }
]
```
Zweimal `spur` — Jugendtreff, neue Öffnungszeiten: Kurzstatement in Schritt 03,
Aushandlung zu dritt in Schritt 05. Zwei mündliche Modi, keine Fläche.

### 4.2 Felder

| Feld | Regel |
|---|---|
| `titel` | Titel des Falls; steht auf A1 und im Kopf jeder Seite |
| `lebensbereich` | = `prinzip.auftrag_lebensbereich`; Pflicht (`ERR_V42_R9`); nicht gedruckt |
| `persona` | Konstante wie in den Heften: `beruf` «Lernende/r EFZ, N. Lehrjahr» (N wie in den Heften), `betrieb` «eigener Lehrbetrieb», `ort` «eigener Wohnort» |
| `situation_text` | ≤ 900 Zeichen, Ich-Form, neuer Fall. Enthält **alle** nötigen Angaben (Zahlen, Angebot, Fristen): Der Auftrag braucht kein Medium und ist in beiden Spuren gleich (§7.4). Macht mindestens zwei Spannungen spürbar |
| `zahlen_tabelle` | höchstens 4 Zeilen `{ label, wert }`; nur Zahlen, die auch im Text stehen. Erfundene Fallzahlen sind erlaubt, Zahlen über die Welt nicht |
| `leitfrage` | Ich-Form, benennt die Spannung, gibt keine Antwort vor |
| `mehrdeutigkeit` | `trade_off`: die Spannung dieses Falls in der Form «X vs. Y» · `hint`: ein Satz in Sie-Form, dass mehrere Wege vertretbar sind |
| `aktivierte_trade_offs` | mindestens zwei, **wörtlich** aus `prinzip.mehrdeutigkeits_architektur.trade_off_raum`; nicht gedruckt |
| `sprachmodi` | = `prinzip.modi_auftrag`, als Menge gleich (`regel8`) |
| `sozialform` | `zulaessig`: Teilmenge von `einzel`, `partner`, `gruppe`. Mit Interaktionsmodus nur `partner` und/oder `gruppe` (2–4 Personen); sonst alle drei. `empfehlung`: ein bis zwei Sätze. **Wird auf A1 gedruckt** — darum als Vorschlag an die Lernenden lesbar, ohne Anweisung an die Lehrperson. Mit Interaktionsmodus nennt sie den ausgewiesenen eigenen Anteil je Person (eigene Rolle, eigener Beitrag, eigener Abschnitt) |
| `auftrag` | ein Satz, Sie-Form; nennt beide Hefte als Werkzeug |
| `schritte` | genau 5 `{ label, hint }`. `label` ≤ 30 Zeichen, beginnt mit «01» bis «05»; `hint` ≤ 140, Sie-Form. Die ersten Schritte wenden je ein Werkzeug aus Heft A und aus Heft B an und nennen das Heft. Zwei Schritte tragen die Produkte (§4.1) |
| `abgaben` | höchstens 3, je ≤ 80 Zeichen: die zwei Produkte (mit Form der Abgabe) und die Selbsteinschätzung |
| `produkte` | §4.1 |
| `heft_bezug` | genau 2 Einträge `{ heft, titel, inhalte }`: `heft` «A» bzw. «B»; `titel` = `titel` des Hefts, zeichengleich (≤ 60); `inhalte` 1–3, je ≤ 60 Zeichen, **mit Seitenzahl**. Gedruckt auf A1 unter «Das brauchen Sie aus Ihren Heften» |
| `feedback_kriterien` | alle vier KN-Kriterien, §4.3 |
| `kontext_ausschluss` | drei Einträge, §4.4; nicht gedruckt |
| `erwartungshorizont` | nur Lehrperson: `gut_wenn` (drei Merkmale einer guten Lösung, bezogen auf beide Produkte), `tragfaehig` (ein Beispiel einer vertretbaren Lösung), `nicht_tragfaehig` (was nicht genügt). Mehrere Lösungen bleiben vertretbar |
| `bogen` | Konstante wie Gold, informativ: `["situation_auftrag", "arbeitsflaeche", "sprechspur", "selbsteinschaetzung"]` — auch wenn `produkte` die Seiten anders belegt |

**Seiten für `heft_bezug`** (fester Seitenplan): LF1 und LF2 S. 2 · LF3 mit
Raster S. 3 · LF4 S. 4 · Produkt S. 7 · Begriffe und «Das nehme ich mit» S. 8.
Genannt wird, was der Auftrag wirklich braucht — das Werkzeug, das die Schritte
anwenden, nicht eine Inhaltsangabe des Hefts.

**Sprache des Bogens (E18):** keine Vorgabe an die Lehrperson, kein Wort zur
Note, kein Verweis auf den KN, keine Woche, keine Lektion. Das gilt für alles,
was gedruckt wird — auch für `abgaben` («Selbsteinschätzung auf den vier
Kriterien», nicht «KN-Kriterien») und `sozialform.empfehlung`.

**Abgrenzung zum KN (§7.1):** anderer Lebensbereich als KN und als A/B, dieselben
vier Kriterien, andere Produktform als die gewählte KN-Form, keine Note. Hefte A
und B sind als Material erlaubt und erwünscht.

### 4.3 `feedback_kriterien`

Vier Einträge `{ kn_kriterium, dimension, stufen, indikator_produkt }`, in der
Reihenfolge von `kn.rubrik_shared.kriterien`. `kn_kriterium` = `name`,
`dimension` und die vier `stufen` **zeichengenau** aus dem KN (kopieren, nicht
abtippen; `regel6`, `ERR_V42_R6`). Eigener Text ist nur `indikator_produkt`:
≤ 90 Zeichen, woran das Kriterium an den **Produkten dieses Auftrags** zu sehen
ist — gedruckt auf A4 als «Woran ich es sehe». Die Indikatoren der Hefte werden
nicht übernommen. In den `stufen` darf ein Begriff des KN-Falls stehen
(Ausnahme im Skript), im `indikator_produkt` nicht.

### 4.4 `kontext_ausschluss` und Fall-Ausschluss

Form: drei Einträge, Begriffe durch Komma getrennt, Herkunft in Klammern am Ende —
«Gegenstände (Heft A)», «Gegenstände (Heft B)», «Begriffe des KN-Falls (KN)».
So liest `regel9Kontext` das Feld: Klammer am Ende streichen, an Kommas trennen,
Begriffe unter vier Zeichen fallen weg, ebenso Begriffe, die einen Fall-Begriff
des KN enthalten (die prüft der Fall-Ausschluss). Jeder verbleibende Begriff wird
als **Teilzeichenkette, ohne Gross-/Kleinschreibung** gesucht in: `titel`,
`situation_text`, `zahlen_tabelle`, `leitfrage`, `mehrdeutigkeit`, `auftrag`,
`schritte`, `abgaben`. Folgen für die Wortwahl:

- **Gegenstände des Falls nennen, nicht Werkzeuge und Fachbegriffe.** Die
  Schritte müssen die Werkzeuge aus A und B nennen; steht ein Werkzeug im
  Ausschluss, wird der eigene Schritt zum Befund.
- **Kein Begriff, der in gängigen Wörtern steckt.** Ein kurzes Wort trifft jedes
  längere, das es enthält. Lieber das genaue Kompositum oder eine Wortgruppe —
  eine Wortgruppe trifft nur als Ganzes.
- **Trotzdem treffend:** Der Eintrag soll verhindern, dass der Fall von A oder B
  im Auftrag wiederkehrt. Ein Begriff, der nie treffen kann, schützt nicht.

Der **Fall-Ausschluss** (`fallAusschluss`, `ERR_V42_R9_FALL`) läuft zusätzlich über
**alle** Texte von `gemeinsamer_auftrag` — auch `produkte`, `heft_bezug`,
`indikator_produkt`, `erwartungshorizont`, `sozialform` — und über `glossar`.
Ausgenommen sind nur `feedback_kriterien[].stufen[]` und `kontext_ausschluss`.
Gesucht wird jeder Begriff aus `fall_ausschluss_hefte_und_auftrag` — nur diese
Liste (E30).

## 5. Prüfungen, die kein Skript macht

1. `heft_bezug[].titel` = `titel` des jeweiligen Hefts, zeichengleich; jede
   genannte Seite trägt im Heft wirklich diesen Inhalt.
2. `produkte` decken `sprachmodi` (jeder Modus mindestens einmal), `form` passt zum
   Modus (§4.1), und die zwei genannten Schritte beschreiben genau diese Produkte.
   `sprachmodi` = `prinzip.modi_auftrag` prüft `regel8`.
3. `modi_kn` ⊆ Modi Heft A ∪ Heft B ∪ Auftrag (oder Lücke im Prinzip vermerkt).
4. Lebensbereiche von A, B, Auftrag und KN paarweise verschieden — das Skript
   prüft nur, dass `lebensbereich` gesetzt ist.
5. `aktivierte_trade_offs`: mindestens zwei, jeder wörtlich im Trade-off-Raum,
   und der Fall macht beide wirklich spürbar.
6. `feedback_kriterien` in der Reihenfolge des KN; jeder `indikator_produkt`
   bezieht sich auf ein Produkt des Auftrags.
7. Mit Interaktionsmodus: `empfehlung` und der Hint des Produktschritts weisen
   den eigenen Anteil je Person aus.
8. Jede Zahl in `zahlen_tabelle` steht auch in `situation_text`; die Situation
   ist ohne Quelle und ohne Heft verständlich.
9. Gedruckte Texte ohne Lehrperson-Vorgabe, Note, KN-Verweis, Woche (E18, E17).
10. Kein Satz, kein Beispiel, keine Zahl aus der Gold-Einheit; kein Lehrmittel-,
    Transkript- oder Artikeltext; Definitionen in eigener Formulierung.
11. Glossar: jede `herkunft: "lehrmittel"` am Kapiteltext geprüft; je Heft und
    vorhandener Spur ein bis zwei Spur-Einträge.
12. `status` ist `"entwurf"`; `id`, `prinzip_ref`, `kn_ref`, `herausforderungen`
    tragen den Ordnernamen.

Kein Skript-Budget haben `leitfrage`, `mehrdeutigkeit`, `auftrag`,
`sozialform.empfehlung`, die Zellen von `zahlen_tabelle` und der Indikator des
Auftrags. A1 ist dicht belegt: knapp schreiben, als Richtwert die Budgets der
Heftseite 1 (Leitfaden §3.1); ob A1 hält, zeigt die Messung in Phase 9.

## 6. Danach

```
node scripts/check-v42.mjs <ordner>
npm run build:einheiten-index
```

`check-v42` darf zu `set.json` keinen Befund mehr melden; jeder Befund wird
sofort behoben. `build:einheiten-index` schreibt beide Index-Kopien (`src/data/`
und `public/nrlp/`) — nie von Hand. Der Index führt auch, ob ein Begleiter
vorliegt: nach Phase 8 wird er erneut gebaut. `check-all` läuft erst im Tor
(Phase 9), weil es `begleiter.md` als Pflichtdatei verlangt.
