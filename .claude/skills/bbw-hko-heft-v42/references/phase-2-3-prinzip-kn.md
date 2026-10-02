# Phase 2 und 3 — `prinzip.json` und `kn.json`

Eingang: der freigegebene Bauplan `docs/cloud-run/bauplaene/<ordner>.md`, der nRLP-Datensatz des Lehrgangs (`public/nrlp_3j.json` bzw. `public/nrlp_4j.json`) und die Kapiteldateien unter `material/_lehrmittel/`. Ausgang: zwei Dateien im Ordner der Einheit. Skelette: `assets/prinzip-template.json`, `assets/kn-template.json`. **In diesen Phasen wird nicht gefragt.** Was der Bauplan offen lässt, entscheidet `references/auto-modus.md`; der Entscheid steht im Bericht.

Form beider Dateien ist die der Gold-Einheit: dieselben Schlüssel, kein weiterer, keiner weniger. Diese Datei nennt jeden Schlüssel. Ein Feld, das hier nicht steht, gibt es nicht (auch nicht `additional_trade_offs`, `persona_pool_*`, `gewicht_prozent`, `kn_vorgabe`).

## 0. Leitprinzip: herleiten, nicht kopieren

Fest in jeder Einheit sind Schlüssel, Reihenfolge der Bausteine, Konstanten der Skelette. **Je Einheit hergeleitet** werden fünf Dinge. Für jedes gilt die Quelle rechts, nie der Wert der Gold-Einheit:

| Hergeleitet | Woraus | Feld |
|---|---|---|
| Sprachmodi je Heft | `sprachmodi[].modus` der Kompetenz(en) des Hefts im Datensatz, eingeschränkt auf das, was Quelle und Handlungsprodukt wirklich üben | `modi_pro_heft` |
| Sprachmodi des Auftrags | Formel Leitfaden §7.2 aus `modi_kn` und `modi_pro_heft` | `modi_auftrag` |
| Schlüsselkompetenzen | `schluesselkompetenzen` des Themas im Datensatz; Verteilung nach dem, was das Produkt des Hefts verlangt | `sk_pro_situation`, `sk_schnittmenge_kn` |
| Typ des Handlungsprodukts | Verb der Kompetenz und Produktionsmodus des Hefts (Bauplan §4) | `handlungsprodukt_typ` |
| Inhalt der Kriterien | Prinzip der Einheit (`anker_statement`), dominanter Aspekt | `rubrik_shared` |

Beispiele in dieser Datei sind erfunden und stammen aus drei Feldern (Politik und Meinung, Wohnen, Arbeit). Sie zeigen die Rechnung, nicht den Inhalt.

## Phase 2 — `prinzip.json`

### 2.1 Kopf

| Feld | Wert |
|---|---|
| `id` | `<ordner>_prinzip` (`references/ableitungsregeln.md`) |
| `modul` | Nummer des Lebensbezugs `X.Y` |
| `kompetenz_nr` | erste Kompetenz von Heft A im kanonischen Lehrgang (wie im Ordnernamen) |
| `topic_slug` | slug des Ordners ohne Nummer und ohne Lehrgang-Suffix |
| `lehrgang` | `EFZ_3J` oder `EFZ_4J` — einwertig; entscheidet, welcher Datensatz gilt. Eine Nummer wird nie ohne Lehrgang aufgelöst |
| `version` | wie im Skelett |
| `erstellt_am` | heutiges Datum `JJJJ-MM-TT` |
| `kern_kompetenzversprechen` | Bauplan §3, wörtlich: ein Satz, Ich-Form, Verb auf K3/K4, enthält das Spannungsfeld |
| `bloom_zielprofil` | fest: `LF1` = `"K2"`, `LF2` = `"K3"`, `LF3` = `"K4"`, `LF4` = `"K4"` (E17). Kein anderer Wert |

### 2.2 `herausforderungen`

Genau zwei Einträge, `A` und `B`. Je Eintrag fünf Felder:

- `herausforderung` — Titel aus Bauplan §4, eine Tätigkeit («Anliegen vertreten»), kein Thema.
- `konfliktart` — «X vs. Y» aus Bauplan §4. A und B tragen verschiedene Konflikte. Aspekte, die nicht in der Kompetenz stehen, gelten nur als aktiviert, wenn das Signal in diesem String steht (2.5).
- `handlungsprodukt_typ` — Typ und Format aus Bauplan §4. **Herleitung:** Das Produkt ist die Form, in der das Verb der Kompetenz sichtbar wird, im Produktions- oder Interaktionsmodus des Hefts (2.4). Verlangt die Kompetenz «sich mündlich einbringen», ist das Produkt ein Gesprächsbeitrag, kein Blatt. Ein Format, kein «oder».
- `kompetenzen` — Liste der Kompetenznummern des Hefts. Jede Nummer existiert im Datensatz des Lehrgangs; A und B überschneiden sich nicht.
- `transferrable` — `true`.

### 2.3 Schlüsselkompetenzen: `sk_pro_situation`, `sk_schnittmenge_kn`

Nummern 1–12 = Position in `zirkularitaet.schluesselkompetenzen[]` des Datensatzes. Das Thema führt seine SK als ganze Sätze (`themen[].schluesselkompetenzen`); die Nummer zu einem Satz steht in `src/lib/sk-labels.generated.ts` (`skFullName` → `skShortByNr`). Nie aus dem Gedächtnis nummerieren.

- `sk_pro_situation.A` und `.B`: je **drei** Nummern, alle aus den SK des Themas. Gewählt wird, was das Heft wirklich verlangt: eine SK für das, was LF3 an der Quelle tut, eine für das, was LF4 entscheidet, eine für das Produkt. Steht im Bauplan §3 eine Verteilung, gilt sie, sofern sie diese Bedingungen erfüllt.
- `sk_schnittmenge_kn.primary`: drei Nummern. **Regel für zwei Hefte:** zuerst die SK, die in beiden Heften stehen; dann ergänzt auf drei mit je der SK von A und von B, die der Hybrid-Fall am stärksten verlangt. Stehen schon drei in beiden, sind es diese drei. Kein `secondary`.

Beispiel (Arbeit, erfunden): A = [2, 6, 8], B = [4, 6, 2]. In beiden: 2, 6. Fehlt eine dritte: der Hybrid-Fall (ein Gespräch im Team über einen Einsatzplan) verlangt aus B die 4 stärker als aus A die 8 → `primary` = [2, 6, 4].

**Abdeckung SK:** Jede SK des Themas steht in A oder B, soweit die Zahl es zulässt (sechs Plätze, bei Überschneidung weniger). Was offen bleibt, steht im Bericht mit Nummer.

### 2.4 Sprachmodi: `modi_pro_heft`, `modi_units`, `modi_kn`, `modi_auftrag`

Bezeichnungen wörtlich wie in `references/sprachmodus-ids.md` (SM1–SM9).

**`modi_pro_heft.A` / `.B`** — die Modi, die das Heft wirklich übt, als Teilmenge der Modi seiner Kompetenz(en) auf Kompetenz-Ebene (`kompetenzen[].sprachmodi[].modus`; nicht die Liste des Themas):

- Rezeptionsmodus = Modus der Quelle (Spur mit Medien) bzw. des Lehrmittel-Abschnitts (Spur ohne Medien): Text und Grafik → «Rezeption schriftlich und bildlich», Audio → «Rezeption mündlich», Video → «Rezeption audiovisuell».
- Produktions- oder Interaktionsmodus = Modus des Handlungsprodukts: Brief, Plakat, Tabelle → «Produktion schriftlich und bildlich»; Statement, Vortrag → «Produktion mündlich»; Gespräch, Diskussion → «Interaktion und Kollaboration mündlich»; analog schriftlich, digital, multimedial.
- Ein Modus der Kompetenz, den weder Quelle noch Produkt trägt, wird nicht geführt. Ein Modus, der nicht in der Kompetenz steht, auch nicht.

`modi_pro_heft[L]` ist **identisch** mit `nrlp.sprachmodi` des Hefts (Phase 4): `regel4` in `check-v42.mjs` liest beide vereint. **Folge:** Führt ein Heft «Rezeption mündlich» oder «Rezeption audiovisuell», darf es keine Spur `ohne_medien` haben (`ERR_V42_R4`) — das muss zu den zulässigen Spuren aus Phase 0 passen. Passt es nicht, ist der Modus falsch hergeleitet oder die Spur unzulässig; nie den Modus weglassen, um die Spur zu retten.

**`modi_units`** = `modi_pro_heft.A` ∪ `modi_pro_heft.B`, ohne Doppel.

**`modi_kn`** = Vereinigung der `sprachmodi` der drei KN-Typen (3.4). Das Feld wird in Phase 2 vorläufig aus den Formen der drei Typen gesetzt und nach Phase 3 gegen `kn.json` geprüft (3.7).

**`modi_auftrag`** nach Leitfaden §7.2:

```
modi_auftrag = modi_kn − (modi_pro_heft.A ∪ modi_pro_heft.B)
```

- **Differenz leer:** Der Auftrag trägt den einen KN-Modus, der in den Heften am wenigsten Gewicht hatte — der in weniger Heften steht; bei Gleichstand der, den mehr KN-Typen führen; dann Reihenfolge SM1–SM9.
- **Mehr als zwei:** Der Auftrag trägt zwei — die, die mehr KN-Typen führen; bei Gleichstand Produktion vor Interaktion vor Rezeption. Die übrigen sind eine Lücke.

`modi_auftrag_herleitung` — ein String: die Formel, und bei einem Sonderfall dahinter, was gewählt wurde und welche Modi als Lücke bleiben. Ohne Sonderfall steht nur die Formel.

`gemeinsamer_auftrag.sprachmodi` in `set.json` muss später dieselbe Menge tragen (`regel8`, `ERR_V42_R8`); enthält sie einen Interaktionsmodus, schliesst das Einzelarbeit aus. Ein Auftrag mit nur einem Modus: siehe `references/phase-7-set.md` zum Feld `produkte`.

*Beispiel 1 — leere Differenz (Wohnen, erfunden).* Heft A übt an einem Abrechnungsblatt eine mündliche Stellungnahme: [Rezeption schriftlich und bildlich, Produktion mündlich]. Heft B verfasst eine Mängelmeldung und handelt sie in der Wohngemeinschaft aus: [Rezeption schriftlich und bildlich, Produktion schriftlich und bildlich, Interaktion und Kollaboration mündlich]. `modi_kn` = dieselben vier. Differenz leer. Gewicht: Rezeption schriftlich steht in zwei Heften, die drei anderen in je einem. Gleichstand → KN-Typen: «Produktion schriftlich und bildlich» führen zwei Typen, die beiden anderen je einer → `modi_auftrag` = [Produktion schriftlich und bildlich]; Herleitung: «modi_kn − (modi_pro_heft.A ∪ modi_pro_heft.B) = leer → KN-Modus mit dem geringsten Gewicht in den Heften».

*Beispiel 2 — Interaktionsmodus (Politik und Meinung, erfunden).* Heft A arbeitet an einem Videobeitrag und endet in einem Statement: [Rezeption audiovisuell, Produktion mündlich] — nur Spur `mit_medien`. Heft B vergleicht zwei Zeitungstexte in einer Tabelle für sich: [Rezeption schriftlich und bildlich]. `modi_kn` = [Rezeption schriftlich und bildlich, Produktion mündlich, Interaktion und Kollaboration mündlich, Produktion schriftlich und bildlich]. Differenz = [Interaktion und Kollaboration mündlich, Produktion schriftlich und bildlich] → das ist `modi_auftrag`; der Auftrag ist damit Partner- oder Gruppenarbeit (eine Diskussionsrunde und ein gemeinsames Positionsblatt). «Rezeption audiovisuell» steht in `modi_units`, nicht in `modi_kn` — das ist zulässig.

### 2.5 `aspekte`

Objekt Aspektname → Iteration (`"R1"` …). Namen **exakt** wie `zirkularitaet.gesellschaftsinhalte[].bezeichnung`: `Ethik`, `Identität und Sozialisation`, `Kultur`, `Ökologie`, `Politik`, `Recht`, `Technologische und digitale Transformation`, `Wirtschaft`. Iteration = `wiederholungen["T<Thema>"]` desselben Eintrags; fehlt das Thema dort, wird der Aspekt nicht geführt und der Fall gemeldet.

Aufgenommen wird: jeder Aspekt aus `gesellschaftliche_inhalte[].aspekt` der Kompetenzen von A und B; dazu ein weiterer nur, wenn sein Signalwort in einer `konfliktart` steht (nicht bloss in einer Situation) und der Bauplan §3 ihn nennt. Signale: fair/gerecht/Verantwortung → Ethik · Regel/Pflicht/Vertrag → Recht · Rolle/Zugehörigkeit → Identität und Sozialisation · Ressource/Nachhaltigkeit → Ökologie · Markt/Preis/Wertschöpfung → Wirtschaft · Macht/Staat → Politik · digital/Automatisierung → Technologische und digitale Transformation · Tradition/Norm → Kultur.

### 2.6 Vier Felder wörtlich aus dem Bauplan

Kein Skript prüft sie gegen Hefte und Set. Die Skill sichert selbst, dass überall derselbe Wert steht (Prüfung in Phase 4, 5 und 7 wiederholen).

| Feld | Form | Muss gleich sein mit |
|---|---|---|
| `kn_kriterien_verteilung` | `A` und `B`: je zwei Kriteriennamen, 1 SuK + 1 Ges, zusammen alle vier | `feedback_kriterien[].kn_kriterium` der Hefte; Namen = `kn.rubrik_shared.kriterien[].name` |
| `pol_typ_verteilung` | `A` und `B`: je `ohne_medien` und `mit_medien` mit einem Pol-Typ (`lehrmittel_quelle`, `position_gegenposition`, `modell_eigener_fall`, `recht_praxis`, `quelle_quelle`); nur für Spuren, die das Heft hat | `pol_typ` von LF4 der Spur. A ≠ B je Spur; `lehrmittel_quelle` und `quelle_quelle` nur unter `mit_medien` |
| `mindmap_zentrum_kurz` | das Prinzip als Begriffspaar, höchstens 40 Zeichen | `mindmap_zentrum` in Heft A **und** B, zeichengenau |
| `auftrag_lebensbereich` | ein Lebensbereich, anders als der von A, von B und vom KN-Fall | `gemeinsamer_auftrag.lebensbereich` in `set.json` |

Die Verteilung der Kriterien folgt dem Produkt: Das SuK-Kriterium liegt in dem Heft, dessen Produkt es am deutlichsten zeigt (Begriffe ordnen → Fachkorrektheit; einen Einwand beantworten → Argumentation), das Ges-Kriterium ebenso. Nennt der Bauplan einen der vier Werte nicht: `references/auto-modus.md`.

### 2.7 `mehrdeutigkeits_architektur`, `dekontextualisierungs_anker`, `zirkularitaet`

- `trade_off_raum` — drei bis vier Einträge «X vs. Y» aus Bauplan §3. Jedes Heft aktiviert später mindestens einen wörtlich, Auftrag und KN mindestens zwei. In sichtbarer Prosa heisst es «Spannungsfeld» oder «Zielkonflikt».
- `verbindlich` — ein Satz, der die Spannung offen hält (beide Seiten bleiben begründbar). Er wird `mehrdeutigkeits_pflicht` im KN.
- `anker_statement` — das Prinzip in einem Satz, ohne Fall, ohne Gegenstand eines Hefts (Bauplan §3 «Transfer-Anker»). Aus ihm ist `mindmap_zentrum_kurz` gekürzt.
- `transferfeld` — ein Satz: auf welche Art von Situation das Prinzip übertragbar ist, mit zwei bis drei Beispielen, die weder A, B, Auftrag noch KN vorwegnehmen.
- `r1_aktuell` — die Iteration des dominanten Aspekts im Thema (wie in `aspekte`). `r2_voraussicht`, `r3_voraussicht` — Thema und Stichwort der nächsten zwei Themen, in denen `wiederholungen` denselben Aspekt führt; gibt es keines, steht «—».

### 2.8 `quellen_anker`

- `chapters` — je Kapitel `ref` («Kap. N.N»), `titel`, `seiten` («Seite NN-NN»). Nur Kapitel aus Bauplan §2, und nur mit Seiten, die in Phase 0 am Text der Kapiteldatei geprüft sind. Kein Kapitel aus einem Inhaltsverzeichnis oder aus dem Gedächtnis.
- `konzepte` — Fachbegriffe, die in diesen Kapiteln stehen, in der Schreibweise des Lehrmittels. Was dort nicht steht, ist kein Konzept der Einheit. Kein Satz aus dem Lehrmittel — nur Begriffe.

### 2.9 `hybrid_situation_spec`

Konstanten wie im Skelett: `max_woerter` 120 · `perspektive` `"ICH"` · `must_activate_trade_offs_min` 1 · `must_combine_herausforderungen` `["A","B"]` · `persona_neutral` (wörtlich) · `endet_mit_leitfrage` `true` · `lehrjahr_constraint` `"match_units"` · `qualitaetskriterien` (fünf Sätze, wörtlich). Die Zahl 1 ist die Konstante der Form; die Arbeitsregel verlangt zwei (3.2).

Je Einheit hergeleitet wird nur `fall_ausschluss_hefte_und_auftrag`: die Begriffe, die den KN-Fall ausmachen (Bauplan §5 «Dem KN vorbehalten»). `fallAusschluss` in `check-v42.mjs` sucht jeden Begriff **als Teilzeichenkette, in Kleinbuchstaben**, in allen Strings der Hefte, des gemeinsamen Auftrags, des Glossars und der Quellenkarten. Ausgenommen sind nur `feedback_kriterien[].stufen`, `kontext_ausschluss` und `prinzip_handoff.kn_aktivierung` (`FALL_AUSNAHME`); für Quellenkarten gibt es keine Ausnahme. Darum:

1. Jeder Begriff hat mindestens fünf Zeichen.
2. Er ist nicht Teil gängiger Wörter. Probe: Kommt die Zeichenfolge in einem Wort vor, das ein Heft brauchen wird? «Miete» steckt in «Vermieterin», «Lohn» in «lohnt» — unbrauchbar. «Kündigungsschreiben» ist brauchbar.
3. Er ist kein Kernbegriff der Hefte: nicht in `konzepte`, nicht in einem Glossarbegriff, nicht in der Karte einer gewählten Quelle (Titel, Kurzbeschrieb).
4. Zwei bis fünf Begriffe: der Gegenstand, das Dokument oder Angebot, eine Beteiligte oder ein Ort, wenn sie den Fall tragen.

Fest gesperrt in jeder Einheit (E24, im Skript verdrahtet): «Leasing», «Konsumkredit», «Kleinkredit», «E-Bike», «Ebike», «Mobilität». Kein Heft, kein Auftrag, kein Glossar, keine Quellenkarte darf sie enthalten. Braucht der Gegenstand der Einheit eines davon, ist sie nicht erzeugbar (SKILL.md §6).

Leere Liste = `ERR_V42_R9`.

## Phase 3 — `kn.json`

Vor den Heften, weil `rubrik_shared` den Wortlaut der Feedback-Kriterien liefert. Eingang: `prinzip.json` und Bauplan §5.

### 3.1 Kopf

`id` = `<ordner>_kn` · `modul`, `kompetenz_nr`, `topic_slug`, `lehrgang` wie im Prinzip · `version` wie im Skelett · `erstellt_am` heute · `set_ref` = `<ordner>_set` · `prinzip_ref` = `<ordner>_prinzip` · `anchored_situations` = `[<ordner>_hf_A, <ordner>_hf_B]` · `kern_kompetenzversprechen` = zeichengleich mit dem Prinzip · `mehrdeutigkeits_pflicht` = `verbindlich` aus dem Prinzip · `template`, `legacy`, `source_refs`, `registry_tags` wie im Skelett (Konstanten, nicht umbenennen).

`dominanter_aspekt` — der Aspekt, der in beiden Heften aktiviert ist (in den `gesellschaftliche_inhalte` der Kompetenzen von A **und** von B, oder über die `konfliktart` beider). Bei mehreren: der in der ersten Kompetenz von Heft A zuerst genannte. Gibt es keinen gemeinsamen: der erste Aspekt der ersten Kompetenz von Heft A; Meldung im Bericht. Name wie in `aspekte`.

### 3.2 `hybrid_situation`

- `titel` — kurz, nennt den Fall, nicht die Lösung.
- `persona` — `beruf`, `betrieb`, `ort` wörtlich wie im Skelett; die Zahl des Lehrjahrs ist `themen[].lehrjahr` des Themas im Datensatz und gleich wie in den Heften.
- `emotion_tag` — leerer String (Konstante).
- `text` — höchstens 120 Wörter (zählen: Leerzeichen-getrennt, Leitfrage inbegriffen); Ich-Form; eine Szene, nicht zwei Teile hintereinander; die Konfliktart von A und von B ist sichtbar, ohne benannt zu werden; konkret macht den Fall das Äussere (ein Schreiben, ein Angebot, Zahlen, eine Frist), nicht ein Beruf. Erfundene Fallzahlen sind erlaubt, Aussagen über die Welt nur belegt. Letzter Satz = `leitfrage`.
- **Neu:** anderer Gegenstand, andere Beteiligte, andere Zahlen als in A, B und im gemeinsamen Auftrag; anderer Lebensbereich als alle drei (`auftrag_lebensbereich`, Bauplan §6). Die Begriffe des Falls stehen in `fall_ausschluss_hefte_und_auftrag`.
- `leitfrage` — genau eine Frage, benennt die Spannung, gibt keine Antwort vor.
- `aktivierte_trade_offs` — mindestens **zwei** Einträge, jeder wörtlich aus `trade_off_raum`, darunter die Spannung von A und die von B.
- `definition_kurz` — wie im Skelett («beide Lernaufgaben»).
- `definition_lang` — für die Lehrperson: was die Szene bündelt, was am Fall neu ist, was übertragen werden muss. Zählwörter «beide», «zwei», «A und B» (E2) — nie «drei», nie «C».
- `alignment_note` — zwei Schlüssel. `herausforderungen_mapping`: genau zwei Einträge, `hf_letter` `"A"` und `"B"`, je ein `scene_element`: der Satzteil der Szene, der das Prinzip dieses Hefts aktiviert. Je Heft ein eigenes Element.
- `new_dimensions` — leere Liste. Bringt die Szene eine Spannung, die weder A noch B trägt, wird die Szene umgeschrieben.

### 3.3 `kn_typen` — drei Einträge, feste Struktur

Jeder Eintrag: `typ`, `label`, `format`, `ablauf`, der Fragenblock, `sk`, `aspekte`, `sprachmodi`, `rubrik_ref` (`"#rubrik_shared"`). `typ`, `label`, `format` und der Rahmen von `ablauf` sind Konstanten des Skeletts. Fragen und Aufgaben in Sie-Form, auf den Fall bezogen, ohne die Lösung zu nennen.

| `typ` | Fragenblock | Folge (`typ` · `k_stufe`) |
|---|---|---|
| `fachgespraech` | `fragestruktur`: fünf Einträge `nr`, `typ`, `frage`, `k_stufe` | Erklären 2 · Anwenden 3 · Beurteilen 3 · Transfer 4 · Werthaltung 4. Frage 4 vergleicht mit «einer Ihrer beiden Herausforderungen» |
| `mini_case_schriftlich` | `aufgaben`: vier Einträge `nr`, `typ`, `aufgabe`, `k_stufe` | Erklären 2 · Unterscheiden 3 · Entscheiden 3 · Forderung 4 |
| `werkschau_transfer` | `reflexionsfragen`: drei Strings; dazu `optional_praesentation` | Prinzip in einem Satz · Prinzip im Hybrid-Fall (gleich/anders) · wann das Prinzip versagt, «durch die beiden Herausforderungen» |

Werkschau, `ablauf`: «eines ihrer beiden Handlungsprodukte (…)» — in der Klammer die zwei Produkte der Hefte mit den Namen aus dem Bauplan §4, nie aus dem Skelett.

`sk` — je Typ höchstens drei, alle aus `sk_pro_situation.A` ∪ `.B`. Fachgespräch und Mini Case: die drei aus `primary`. Werkschau: [5, 6, 10] geschnitten mit A ∪ B, aufgefüllt aus `primary` bis drei. `aspekte` — je Typ die Schlüssel von `aspekte` im Prinzip.

### 3.4 `sprachmodi` je KN-Typ — aus der Form

Abgeleitet aus dem, was die Form verlangt, nicht übernommen:

- Was wird vorgelegt? Der Fall liegt als Blatt vor → «Rezeption schriftlich und bildlich» (Fachgespräch, Mini Case). Die Werkschau legt nichts Neues vor.
- Was wird geleistet? Antworten im Gespräch → «Produktion mündlich» und «Interaktion und Kollaboration mündlich». Schriftliche Aufgaben oder Reflexion → «Produktion schriftlich und bildlich».
- Die Kurzpräsentation der Werkschau ist freiwillig und zählt nicht als Modus.

`modi_kn` im Prinzip ist die Vereinigung dieser drei Listen (3.7).

### 3.5 `rubrik_shared`

`dimensionen` = `["SuK","Ges"]`. `kriterien`: **genau vier**, je `name`, `dimension`, `stufen`; 2 SuK + 2 Ges; je vier `stufen` (Index 0–3 = Punkte); jede Stufe **höchstens 120 Zeichen** (sie wird ins Heft kopiert, `budgetKern` misst dort).

| Nr | `name` | `dimension` | Progression der vier Stufen |
|---|---|---|---|
| 1 | «Fachkorrektheit» (fest) | SuK | fehlt/falsch → teilweise → korrekt und passend → differenziert und eigenständig |
| 2 | «Argumentation» (fest) | SuK | keine Begründung → ansatzweise → nachvollziehbar → schlüssig, Gegenargument und Folgen |
| 3 | Prinzip des dominanten Aspekts | Ges | nicht angewendet → teilweise → korrekt angewendet → übertragen |
| 4 | «Position / Werthaltung» (fest) | Ges | keine Position → angedeutet → klar in Ich-Form → begründet, Spannungsfeld anerkannt |

Name von Kriterium 3, Muster «<Adjektiv zum Aspekt>es Prinzip»: Wirtschaft → Wirtschaftliches · Recht → Rechtliches · Ethik → Ethisches · Kultur → Kulturelles · Ökologie → Ökologisches · Politik → Politisches · Technologische und digitale Transformation → Technologisches Prinzip · Identität und Sozialisation → «Identitätskonstrukt».

**Regel für die Stufentexte.** Sie werden zeichengenau in beide Hefte und in den Auftrag kopiert (`wortlaut` in `regel6`, `ERR_V42_R6`) und müssen auf Heft-Produkt, Auftrag und KN gleichermassen passen. Darum nennt kein Stufentext

- einen Gegenstand des KN-Falls,
- einen Begriff aus `fall_ausschluss_hefte_und_auftrag` oder ein fest gesperrtes Wort (2.9),
- ein Fachwort, das nur in einem der zwei Hefte vorkommt.

Die Stufen beschreiben die Leistung, nicht den Stoff: «Fachbegriffe der Einheit korrekt und zur Situation passend verwendet», nicht eine Liste von Begriffen in Klammern. Den Stoff trägt im Heft `indikator_produkt`. Stufe 3 von Kriterium 3 heisst «übertragen» nur, wenn auch die Hefte eine Übertragung verlangen (das tun sie über den Ast «gilt auch bei …»); sonst bleibt sie bei «verbindet … eigenständig». Die Ausnahme des Skripts für `stufen` (E8) ist ein Notbehelf der Gold-Einheit, keine Erlaubnis.

**Anderes SuK-Kriterium.** Nur wenn der Bauplan es nennt — mit dem neuen Namen **und** dem der beiden festen SuK-Namen, den es ersetzt — und wenn alle drei Bedingungen gelten: (1) es bleibt bei 2 SuK + 2 Ges; (2) das Kriterium ist in jedem der drei KN-Typen beobachtbar, auch im schriftlichen (also «Adressatenbezug» oder «Verständlichkeit», nicht «Gesprächsführung»); (3) es ist im Produkt des Hefts beobachtbar, dem `kn_kriterien_verteilung` es zuteilt. Fehlt eine Bedingung oder die Angabe, was ersetzt wird: feste Namen, Meldung im Bericht. «Position / Werthaltung» und Kriterium 3 werden nie ersetzt.

`niveaubaender` — drei Einträge `label` / `definition`, wörtlich wie im Skelett (unter 60 % · 80 % · 100 %). Überall heisst es **«Punkte»** (0–3), nie «Stufe 1–4» (E17); `stufen` ist nur der Schlüssel. Kein Gewicht, keine Prozente je Kriterium.

### 3.6 Reihenfolge beim Schreiben

Szene → Mapping → Rubrik → drei Typen → Kopf. Dann `modi_kn` und `kn_kriterien_verteilung` im Prinzip gegen das Geschriebene prüfen und, wenn nötig, `modi_kn`, `modi_auftrag` und `modi_auftrag_herleitung` neu rechnen — vor Phase 4, nie danach.

### 3.7 Selbstprüfung nach Phase 3 (kein Skript prüft das)

Jede Zeile wird ausgeführt und mit Ergebnis in den Bericht übernommen.

1. **Fall neu.** Gegenstand, Beteiligte, Zahlen und Dokument der Szene kommen in Bauplan §4 (A, B) und §6 (Auftrag) nicht vor.
2. **Lebensbereiche paarweise verschieden:** A, B, `auftrag_lebensbereich`, KN-Fall — sechs Paare, jedes einzeln.
3. **Fall-Ausschluss tragfähig:** jeder Begriff ≥ 5 Zeichen, in keinem `konzepte`-Eintrag, in keiner Karte der gewählten Quellen, in keinem Stufentext; kein fest gesperrtes Wort in Titeln und Produkten des Bauplans.
4. **`modi_kn`** = Vereinigung der `sprachmodi` der drei `kn_typen`, als Menge.
5. **Abdeckung Modi:** Jeder Modus aus `modi_kn` steht in `modi_pro_heft.A`, `modi_pro_heft.B` oder `modi_auftrag`. Ausnahme nur der Sonderfall «mehr als zwei», und dann steht die Lücke in `modi_auftrag_herleitung` und im Bericht.
6. **Modi der Hefte:** jedes Element von `modi_pro_heft[L]` steht in den `sprachmodi` einer Kompetenz dieses Hefts; kein Rezeptionsmodus mündlich oder audiovisuell bei einem Heft mit Spur `ohne_medien`.
7. **Abdeckung SK:** Jede SK aus `primary` steht im `sk` mindestens eines KN-Typs; jedes `sk` eines Typs ⊆ A ∪ B; jede Nummer in `sk_pro_situation` gehört zu den SK des Themas.
8. **Spannungen:** `aktivierte_trade_offs` ≥ 2, jeder Eintrag zeichengleich in `trade_off_raum`; `mehrdeutigkeits_pflicht` = `verbindlich`.
9. **Rubrik:** vier Kriterien, 2 + 2, je vier Stufen ≤ 120 Zeichen; die Namen sind genau die vier aus `kn_kriterien_verteilung`; je Heft 1 SuK + 1 Ges.
10. **Zählwörter:** Suche in `kn.json` und `prinzip.json` nach «drei», «dritt», «A, B und C», «hf_C», «Stufe 1», «Stufe 4» — kein Treffer ausser den drei KN-Typen, den drei Reflexionsfragen und «3 Punkte».
11. **Wortzahl** der Szene ≤ 120, letzter Satz = `leitfrage`, Ich-Form, kein «du», kein Eszett, echte Umlaute.
12. **Gold-Probe:** Kein Satz, kein Beispiel, keine Zahl, kein Produktname der Gold-Einheit steht in einer der zwei Dateien; gleich sein dürfen nur Schlüssel und Konstanten der Skelette.
13. **Schlüsselmenge:** beide Dateien haben genau die Schlüssel ihres Skeletts.

Schlägt eine Zeile fehl, wird die Datei korrigiert und die ganze Liste erneut durchlaufen. Erst danach beginnt Phase 4.
