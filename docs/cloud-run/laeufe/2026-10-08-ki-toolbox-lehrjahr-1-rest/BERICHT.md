# KI-Toolbox 1. Lehrjahr, Rest — Bericht des Laufs vom 08.10.2026

> **Stand: Schlussbericht für 3 von 3 Einheiten.** Fortsetzung des Laufs vom 07.10.2026
> (`../2026-10-07-ki-toolbox-lehrjahr-1/BERICHT.md`, E44). Alle drei Toolboxen tragen `2.0.0`,
> bestehen die Skript-Prüfungen und haben am Schluss das Urteil «in Ordnung».

Auftrag: `docs/cloud-run/prompts/ki-toolbox-lehrjahr-1-rest.md` · Skill `hko-ki-komplement` ·
Branch `main` (Start bei `f7bf3de`, Arbeitsbaum sauber) · kein Worktree, kein Index-Bau, kein
Commit, kein Push.

Modelle: Erzeuger Opus (ein Agent je Einheit, alle drei gleichzeitig). Alle Lesungen,
Korrektur- und Glättungsrunden Sonnet, jeweils frische Agenten. Die Prüfungen aus §4 des
Auftrags fuhr der Orchestrator selbst, nacheinander.

## 1. Tabelle

Seiten = Basis-Auftrag · Plus-Auftrag · Lernprompt · Lernbegleiter (erwartet 2 · 3 · 3 · 3).

| Einheit | Format | Lehrgang | Status | Basis-Muster | Plus-Muster | check-ki-toolbox | Seiten / Überlauf | check-all | Gegenleser | Runden | offen |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 3.2.1_konsumfolgen_beurteilen | v4.2 | 3J (+4J) | publiziert | ai_lernassistent | ai_gegenpositionen (50) | GRUEN, 0 Warn. | 2·3·3·3, kein Überlauf (in jedem Durchgang) | kein Befund in Toolbox-Dateien | 1. zurück, 2. zurück, Schlusslesung **in Ordnung** | **2** | §3.1 |
| 3.3.1_kaufvertrag_beurteilen | v4.2 | 3J (+4J) | publiziert | ai_entscheidungscoach (Grenzfall) | ai_gegenpositionen (80) | GRUEN, 0 Warn. | 2·3·3·3, kein Überlauf (in jedem Durchgang) | kein Befund in Toolbox-Dateien | 1. zurück, 2. **in Ordnung** | 1 (+1 Glättung) | §3.2 |
| 3.2.1_wahre_kosten | 3er-Set | 3J (+4J) | **Entwurf** | ai_entscheidungscoach (Grenzfall) | ai_gegenpositionen (80) | GRUEN, 0 Warn. | 2·3·3·3, kein Überlauf (in jedem Durchgang) | — | 1. zurück, 2. **in Ordnung** | 1 | §3.3 |

Reserven beim letzten Durchgang (alle übrigen Seiten 0 px, Schreibfelder füllen den Platz):

| Einheit | Lernbegleiter S. 1 | Lernbegleiter S. 3 | Lernprompt S. 2 |
|---|---|---|---|
| 3.2.1_konsumfolgen_beurteilen | 3.5 px | 111.8 px | 149.2 px |
| 3.3.1_kaufvertrag_beurteilen | 3.5 px | 111.8 px | 75.6 px |
| 3.2.1_wahre_kosten | 30.7 px | 96.9 px | 225.1 px |

Keine Kürzungsrunde war nötig. Beide v4.2-Einheiten haben auf Seite 1 des Lernbegleiters nur
3.5 px: `begriffe` trägt 19 Einträge (258 bzw. 254 Zeichen, Richtwert 200) — bei v4.2 stehen alle
Glossarbegriffe ohne `spur` da, gekürzt wurde an den anderen Feldern.

## 2. Abweichungen von der Tabelle im Auftrag

Keine. `src/data/einheiten.index.json` und die drei `set.json` decken sich mit dem Auftrag
(Format, kanonischer Lehrgang `EFZ_3J`, `lehrgaenge` 3J + 4J, Status; `3.2.1_wahre_kosten` trug
`ki.json` 1.0.0 und ist ganz ersetzt).

## 3. Was offen blieb, je Einheit

### 3.1 `3.2.1_konsumfolgen_beurteilen`

Basis `ai_lernassistent` (Bildfolge und Preisbeurteilung sind kein Entscheid; «wie ich
entscheide» in Heft A als Satz in der Bildfolge gelesen). Plus `ai_gegenpositionen` 50
(`ai_redaktion` 10, `ai_zeitkapsel` 10, übrige 0). Plus-Techniken «Gegenseite verlangen»,
«Quellen verlangen» (zweite über die Gleichstand-Reihenfolge). Fehler im Beispiel-Verlauf: Die KI
erklärt eine richtige Erklärung von «Nachfrage» für falsch und gibt die Definition des Angebots.
Eigene Setzung des Erzeugers: Sammelwort «Schlusssatz» (Sprechsatz zu Bild 6 in Heft A, Urteil in
Heft B), Lücke `[mein Schlusssatz mit Grund]`.

1. Lesung «zurück» (Fehler: `beispiel_dialog.pruefung` sagte «Ihr zweiter Satz stimmt auch» — der
zweite Satz ist der falsche). 2. Lesung «zurück» (A: `so_uebst_du` deckte nach Runde 1 nur eines
von zwei Kriterien; B: «Dieselbe Frage stellen Sie hier der KI» ohne Bezug — beides von Runde 1
eingeführt). Nach Runde 2 Schlusslesung **«in Ordnung»**, Fehler: keine. **Zwei Runden — damit
ist Schluss; was bleibt, steht hier.**

Offen (Ungenauigkeit, Wortlaut der Schlusslesung):

- `lernbegleiter.json › kn_typ_tracks[mini_case_schriftlich].prompt`: «… Gib mir eine Aufgabe:
  Ich erkläre den Preis und begründe mein Urteil. Warte auf meine Lösung. …» — das
  Doppelpunkt-Muster kann die KI als Lösung der lernenden Person lesen statt als Beschreibung der
  Aufgabe. Dass der Fall einen Preis enthalten muss, steht nur in «Thema: Folgen und Preis eines
  Kaufs».
- `lernbegleiter.json › rubrik_fokus[Ges].so_uebst_du`: «Begründen Sie im Übungsfall Ihr Urteil
  mit der Erklärung des Preises.» — lässt «Folgen für Beteiligte» und «andere Seite anerkannt»
  weg; Befehlsform, die SuK-Zeile daneben ist eine Aussage («Sie üben mit …»). «Urteil» bestellt
  nur der Track Mini Case. (Zwei Verben im Satz lehnt das Skript als `ERR_B1_MEHRFACHAUFTRAG` ab.)
- `lernprompt.json › techniken[3]` (Quellen verlangen, Plus): die Lücke `[mein Fakt mit
  Fundstelle]` nennt nur den Fakt, nicht «oder Aussage»; «Fundstelle» ist nicht erklärt. Das Wort
  wechselt: `erklaerung` «Angabe», übrige Felder «Fakt oder Aussage». Thema in den Prompts «Folgen
  eines Kaufs», sonst überall «Folgen und Preis eines Kaufs». `warnung`: «… Sonst übernehmen Sie
  sie nicht.» — das zweite «sie» ist doppeldeutig.
- `lernprompt.json › techniken[2].baukasten.kontext[2]`: «meine Klasse hört oder liest» — als
  Baustein ein Satzbruch (Objekt fehlt); kein Beispiel-Prompt der Technik nutzt das Publikum.
- `lernprompt.json › beispiel_dialog.pruefung`: «Ich lese im Glossar nach: Das Nein ist falsch,
  sie erklärt das Angebot. Meine Erklärung und ihr Schluss stimmen.» — «ihr Schluss» ist unscharf
  (gemeint: der letzte Satz der KI). Das Feld darf höchstens 113 Zeichen haben (0 px Reserve).
- `lernbegleiter.json › kn_typ_tracks[werkschau_transfer].prompt`: 45 Wörter, genau an der Grenze.

Offen aus den früheren Lesungen (nicht gegeben oder nur gemildert):

- `lernprompt.json › techniken[2].thema_bezug`: «Ihr Text nennt auch, was für die andere Seite
  spricht: in Heft A im Schlusssatz, in Heft B vor dem Urteil. …» — die Prompts geben der KI nur
  den Schlusssatz; die Passage «vor dem Urteil» sieht sie in Heft B nie.
- `ki.json › ki_1/ki_2.ki_frei_vorher`: «Schreiben Sie Ihren Schlusssatz samt Grund ohne KI auf.»
  — der Satz steht schon im Heft; in Heft B (Tandem-Urteil «mit Preis, Rose und Gewinn») ist der
  Grund nicht Teil des letzten Satzes, es ist ein neues Schreiben.
- Das Wort «Schlusssatz» steht in keinem Heft (Heft A: «Schlussaussage», «Sprechsatz»; Heft B:
  «Urteil»); die Toolbox erklärt es auf jedem Blatt.
- `lernprompt.json › stacking_seite_1.prompt_2` und `ki_1`, Prompt 2: «Welche meiner … Antworten
  war schwächer? Stell mir dazu noch eine Frage.» — zwei Aufträge an die KI (Wortlaut der Skill).
- KN-Seite der Basis: Die Notizfelder «Das konnte ich · Das übe ich noch» verlangen eine
  Einschätzung, ein Rückmelde-Prompt steht erst auf der Plus-Seite.
- `ki.json › nrlp_anker.schluesselkompetenzen_texte`: SK 3 übt der Basis-Auftrag nicht (aus
  `kn.json`).
- `mock_transfer.prompt_fortgeschritten` («Ein Preis steigt plötzlich, und der Kauf hat Folgen für
  andere», Gegenstand «Arbeitsschuhe») ist dem Muster des KN-Falls nahe, nennt aber keinen
  Gegenstand daraus. Die Beispiele der Methodenkarte (Nachtbus-Fahrplan, Lehrstellen) stehen nicht
  in der Ausschlussliste.
- **Gesperrte Kernwörter (siehe §5):** «ökologische / ökonomische / soziale Dimension» und «graue
  Energie» stehen nur in `begriffe`. Die Karte «Abfragen lassen» fragt darum vier Begriffe aus
  Heft B ab und nur zwei aus Heft A.
- Zeile «Prüfen:» zeigt auf «Ihre Hefte (Glossar, S. 8; Tabelle zum Fall)» — die Zahlentabelle
  trägt im Heft keine Überschrift, eine Seitenzahl dafür ist nicht belegt.
- Liesmich-Frontmatter: `kompetenz` und Titel folgen dem Begleiter («3.2 …»), nicht «3.2.1».

### 3.2 `3.3.1_kaufvertrag_beurteilen`

Basis `ai_entscheidungscoach`: Das Handlungsprodukt von Heft A verlangt wörtlich einen Entscheid
(`format` «… und einem Entscheid», `abgaben[1]` «Entscheid in zwei Sätzen mit nächstem Schritt»).
**Grenzfall, vom Erzeuger so gemeldet** — das Produkt ist ein Prüfbericht, der einen Entscheid
enthält; bei engerer Lesung ändert sich nur das Feld `pattern`, die Prompts bleiben. Plus
`ai_gegenpositionen` 80 (`ai_redaktion` 40, übrige 0). Plus-Techniken «Gegenseite verlangen»,
«Quellen verlangen». Fehler im Beispiel-Verlauf: Widerruf 14 Tage «bei jedem Internetkauf» (laut
Glossar nur bei Haustür- und Telefonkauf).

1. Lesung «zurück» (Fehler: «Prüfen:» im Basis-Auftrag zeigte nur auf Kap. 2.4, S. 55-64; die
Altersregel — Prüffrage 2 von Heft A — steht in Kap. 1.3, S. 25-27, eine richtige Regel wäre nach
dem Ausweg verworfen worden). 2. Lesung **«in Ordnung»**, Fehler: keine. Danach eine
Glättungsrunde (fünf Stellen) und nur noch §4.

Offen (Ungenauigkeit, Wortlaut des Gegenlesers):

- `ki-liesmich.md` §2: «im Lehrmittel (Kap. 2.4; die Altersregel in Kap. 1.3, S. 25–27)
  nachgeschlagen — in beiden Aufträgen jede» — bei Kap. 2.4 fehlen die Seiten, §4 nennt gar keine;
  §2 legt die Altersregel für beide Aufträge nahe, `ki_2` verweist nur auf Kap. 2.4, S. 61-62.
- `lernprompt.json › techniken[2].warnung` und `techniken[3].warnung`: verweisen nur auf «Kap. 2.4,
  S. 55-64», nicht auf die Altersregel in Kap. 1.3 — ein Einwand zum Entscheid aus Heft A betrifft
  wahrscheinlich das Alter.
- `ki.json › ki_1 › prompt_strategie[2]`: «Prüfen: Nennt die KI eine Regel, schlagen Sie nach
  (Kap. 2.4, S. 55-64; Alter: Kap. 1.3, S. 25-27). Fehlt sie, übernehmen Sie sie nicht.» — das
  Wort «Lehrmittel» fehlt nur hier (136 Zeichen, die Seite hat 0 px Reserve). Die Seitenzahlen
  sind gegen die Hefte geprüft, im Lehrmittel-Markdown waren sie nicht prüfbar.
- `lernprompt.json › beispiel_dialog.pruefung`: «Die KI irrt: Laut Glossar gilt das Widerrufsrecht
  nur bei Haustür- und Telefonkauf. Gebunden bin ich aber.» — das Wort «stimmt» für die richtige
  Angabe steht nach der Glättung nicht mehr da (nach der zweiten Lesung geändert, nicht mehr
  gelesen). Heft-A-Lernende kennen die freiwillige 14-Tage-Frist des Shops; die Prüfung sagt
  dazu nichts.
- Das Glossar heisst dreifach: «Glossar Ihrer Hefte» (`techniken[0].warnung`, Karte «Abfragen
  lassen»), «Glossar» (Karte «Selbst erklären»), «Glossar in Ihren Heften» (Karte «Lernplan
  machen»).
- `lernbegleiter.json › rubrik_fokus[1].so_uebst_du`: «Sie üben am Übungsfall oben, die passende
  Regel anzuwenden und zu sagen, was Sie verlangen.» — «Regel anwenden» bestellen die
  KN-Prompts nur teilweise (Mini Case: «eine Forderung begründen»).
- `lernprompt.json › techniken[2]` (Plus): `[meine Forderung mit Frist]` ist nur auf der
  Basis-Seite erklärt. `lernbegleiter.json › strategie_karten[2].prompt_fortgeschritten`: «die
  andere Seite» ist im Lernbegleiter nicht eingeführt.
- `lernbegleiter.json › strategie_karten[3].prompt_fortgeschritten`: «Ein neues Zelt hat nach zwei
  Wochen einen Riss. Das Geschäft will nur flicken.» — neuer Gegenstand, aber die Konstellation
  von Heft B. `kn_typ_tracks[0].uebungsfokus` sagt «mündlich», im Chat wird getippt.
- `ki_1`, Prompt 1 («Ich habe online etwas bestellt und bereue den Kauf.») baut den Fall von Heft A
  fest ein. KN-Brücke von `ki_2` («… begründen Sie eine Forderung so, dass Ihr Gegenüber darauf
  eingeht») trifft die Werkschau nur schwach.
- Schwerste Stelle für Lernende: bei «Quellen verlangen» die Regel der KI mit Gesetz und Artikel
  im Lehrmittel finden — die Nummern stehen nur am Rand; fehlt eine, bleibt offen, ob die KI irrt
  oder das Lehrmittel knapp ist.

### 3.3 `3.2.1_wahre_kosten` (Entwurf, 3er-Set, ersetzt Toolbox 1.0.0)

Basis `ai_entscheidungscoach`: Handlungsprodukt C verlangt wörtlich einen Entscheid («… und
begründe gesprochen, wie ich mich entscheide»). **Grenzfall, vom Erzeuger so gemeldet** — der
Titel des Produkts ist ein Preisschild. Gegenstand in allen Dateien: «mein Entscheid mit Grund»
aus LF3 (heisst in A, B und C «Entscheiden»), darum geht der Auftrag auch mit nur einer
Herausforderung. Plus `ai_gegenpositionen` 80 (`ai_redaktion`, `ai_ethik_tribunal`,
`ai_zeitkapsel` je 30, `ai_prompt_duell` 20). Plus-Techniken «Gegenseite verlangen», «Schritt für
Schritt denken». Fehler im Beispiel-Verlauf: Vanillepreis 320 → 1250 Franken sei «etwa das
Doppelte» (fast das Vierfache; die Differenz 930 stimmt).

`begriffe`: 10 von 22 Konzepten. Weggelassen wegen Sperrwort: «drei Dimensionen der
Nachhaltigkeit». Weggelassen, weil in keiner Leitfrage und keinem Handlungsprodukt: externe
Kosten, CO2-Abgabe, LSVA, Marktgleichgewicht, erweiterter Wirtschaftskreislauf,
2000-Watt-Gesellschaft, Fairtrade, weltweite Arbeitsteilung, Transportkosten, Zielkonflikt,
Anspruchsgruppen. **Abweichung von der Skill, gemeldet:** Streng nach der dritten Weglass-Regel
blieben vier bis sechs Einträge; der Erzeuger behielt auch, was in Situationstext, Mindmap oder
Zahlentabelle steht.

1. Lesung «zurück» (Fehler: die KN-Brücke «Im Kompetenznachweis begründen Sie selbst, wer fehlende
Kosten trägt» war nur fürs Fachgespräch wahr). 2. Lesung **«in Ordnung»**, Fehler: keine.

Offen (Ungenauigkeit, Wortlaut des Gegenlesers):

- `lernprompt.json › techniken[chain_of_thought].thema_bezug`: «Hinter Ihrem Entscheid stehen drei
  Schritte: was im Preis fehlt, was Sie entscheiden und warum.» — passt zu LF3 von A; bei B und C
  steht «was im Preis fehlt» nicht in der Aufgabe selbst. Die Lücke `[meine drei Schritte]` ist
  unverändert.
- `lernbegleiter.json › strategie_karten[retrieval].wann`: «… Eine nicht bearbeitete
  Herausforderung schlagen Sie im Lehrmittel nach.» — sagt nicht, welcher Begriff in welches
  Kapitel gehört (die Kapitel stehen nur in der `warnung`). Das Feld hat jetzt zwei Sätze und 144
  Zeichen; die Skill sagt ein Satz, Richtwert 90 (die Seite hält, 30.7 px Reserve). Die Sätze der
  Selbsteinschätzung («… Angebot und Nachfrage … (Kap. 2.7)») sind für Lernende mit nur einer
  Herausforderung nur über diesen Hinweis gedeckt.
- `ki.json › ki_1.schritte`: «Beantworten Sie mit Prompt 1 die drei Fragen der KI.» — man
  beantwortet die Fragen nicht «mit Prompt 1»; Prompt 2 und das Nachschlagen kommen in den
  Schritten nur beiläufig vor. **Nicht gegeben: Wortlaut der Skill** (`basis-plus.md` §3), siehe §4.
- «LF3» ist auf dem KI-Blatt nicht erklärt (bekannt vom Blatt der Herausforderung); der Renderer
  druckt auf demselben Blatt einen Block «Leitfragen» mit anderen Fragen.
- Karte «Lernplan machen»: `prompt_fortgeschritten` bestellt Lernkarten, keinen Plan (Titel fest).
- Ausschlussliste «Vanille, Farbe oder Handy»: «Ein Lehrbetrieb kauft ein Material ein» kann die
  KI auf Lösungsmittel oder Sonderabfall führen (Welt von B). Den KN-Fall kann die Liste nicht
  ausschliessen, ohne ihn zu verraten.
- «externe Kosten» — das Kernkonzept — steht in keinem der genannten Lehrmittelkapitel als Begriff
  und in keiner Leitfrage; die Toolbox sagt «Kosten, die im Preis fehlen». `begriffe` schreibt
  «Umweltschutzgesetz» wie `prinzip.json`, das Lehrmittel «Umweltschutz-Gesetz».
- Zeile «Prüfen:» hat in beiden Aufträgen genau 28 Wörter (Grenze).

## 4. Änderungen an der Skill

**Keine.** Zwei Mängel traten in je zwei Einheiten auf und hätten nach §7 des Auftrags eine
Nachschärfung erlaubt. Der Orchestrator wollte zwei Sätze in
`.claude/skills/hko-ki-komplement/references/basis-plus.md` §5 ergänzen; **die Änderung wurde von
der Berechtigungsprüfung der Sitzung abgelehnt und nicht umgangen.** Vorschlag, wörtlich:

1. Zeile `rubrik_fokus[].so_uebst_du`, am Schluss: «**Der Satz verspricht nur, was dieser Prompt
   wirklich bestellt:** Nennt er den Übungsfall, steht «in Ich-Form sagen, was Sie verlangen» oder
   «einen Preis erklären» nur da, wenn ein Track-Prompt der KN-Seite genau das bestellt — nicht,
   weil das Kriterium es verlangt und erst die Plus-Karte `mock_transfer` es übt.»
   (Anlass: `3.3.1` U5, `3.2.1_konsumfolgen` U2 — dort hat die Stelle zwei Runden gekostet.)
2. Zeile `kn_typ_tracks[]`, am Schluss: «Der `uebungsfokus` sagt nicht «mündlich»: Im Chat wird
   getippt («Sie beantworten Fragen zu einem neuen Fall.»).»
   (Anlass: `3.3.1`, `3.2.1_wahre_kosten`.)

Drei weitere Beobachtungen zur Skill, nicht als Regel vorgeschlagen:

- **Der feste Wortlaut von Schritt 2** («Beantworten Sie mit Prompt 1 die drei Fragen der KI.»)
  wurde in zwei Lesungen als unlogisch gemeldet (`3.2.1_wahre_kosten`, `3.2.1_konsumfolgen`). Er
  steht so in 17 der 18 Toolboxen mit Stand 2.x (alle ausser dem Pilot) — eine Änderung wäre ein
  Entscheid über den Bestand.
- **Die Stelle «am Übungsfall unten»** in `so_uebst_du` (`3.3.1`, behoben): Die Übungsfälle stehen
  im Renderer oberhalb der Kriterien. Keine andere Toolbox trägt das Wort (geprüft per Suche).
- **Die Probe fürs Basis-Muster** («ein Handlungsprodukt ist wörtlich ein Entscheid») fiel in zwei
  von drei Einheiten auf einen Grenzfall, den die Erzeuger selbst so nannten.

Zwei Befunde aus Korrekturrunden, die für künftige Briefe zählen: Das Prüfskript verlangt, dass
`beispiel_dialog.pruefung` mit «Ich …» beginnt (`ERR_BP_ZUSATZ`), und eine Lücke mit mehr als vier
Wörtern lehnt es als `ERR_BP_LAENGE` ab.

## 5. Befunde ausserhalb der Toolbox — Entscheid Pietro

Nichts davon hat dieser Lauf angefasst.

1. **Das Prüfskript sperrt Kernwörter von `3.2.1_konsumfolgen_beurteilen`.**
   - «dimension» ist Sperrwort (`SPERRWOERTER` in `scripts/check-ki-toolbox.mjs`); das Glossar
     führt «ökologische Dimension», «ökonomische Dimension», «soziale Dimension» — die drei
     Kernbegriffe von Heft A. Dasselbe Sperrwort trifft in `3.2.1_wahre_kosten` das Konzept «drei
     Dimensionen der Nachhaltigkeit».
   - «graue Energie» löst `ERR_V42_SPUR` aus: Das Glossar führt den Begriff zweimal (Heft A ohne
     `spur`, Heft B mit `spur: "mit_medien"`), und `nurSpur` (Zeile 244) nimmt jeden Eintrag mit
     `spur`, ohne zu prüfen, ob derselbe Begriff auch ohne steht. Das ist ein Fehler des Skripts,
     nicht der Einheit.
   - Folge: Beide stehen nur in `begriffe`; kein Prompt fragt sie ab.
2. **`3.3.1_kaufvertrag_beurteilen › herausforderung_B.json › prinzip_handoff.kn_aktivierung`**
   nennt «gegenüber einer Privatperson, von der sie ein gebrauchtes Gerät gekauft hat» — den
   Gegenstand des KN-Falls. Ein Feld für die Lehrperson; ob es gedruckt wird, ist nicht geprüft.
3. **`modul_titel`** von `3.2.1_konsumfolgen_beurteilen` ist kleingeschrieben («folgen und preise
   beurteilen») in `herausforderung_A/B.json` und `set.json`; `ki.json` hat den Wert übernommen.
4. **`3.2.1_wahre_kosten`:** «externe Kosten» steht in keinem der genannten Lehrmittelkapitel als
   Begriff; «Umweltschutzgesetz» (`prinzip.json`) gegen «Umweltschutz-Gesetz» (Lehrmittel). Dem
   3er-Set fehlt eine Liste wie `fall_ausschluss_hefte_und_auftrag`.
5. **`check-all` meldet in anderen Dateien** (endet für beide GRUEN, kein Treffer in den vier
   Toolbox-Dateien):
   - `3.2.1_konsumfolgen_beurteilen`: `ERR_BELEGE_FEHLT` 1, `ERR_FAKTEN_FEHLT` 1, `ERR_FALL_FEHLT` 1,
     `ERR_ZEIGER_WOERTER` 1, `ERR_ZEIGER_SCHRITT_OHNE_SEITE` 7, `WARN_KOH_ANZAHL` 2,
     `WARN_KOH_KURZBESCHRIEB` 1.
   - `3.3.1_kaufvertrag_beurteilen`: `ERR_BELEGE_FEHLT` 1, `ERR_FAKTEN_FEHLT` 1, `ERR_FALL_FEHLT` 1,
     `ERR_ZEIGER_SCHRITT_OHNE_SEITE` 8, `WARN_KOH_ANZAHL` 3 (`herausforderung_A ›
     handlungsprodukt.beschreibung`, `herausforderung_B › feedback_kriterien[0].indikator_produkt`,
     `herausforderung_B › handlungsprodukt.schritte[0].hint`), `WARN_KOH_KURZBESCHRIEB` 3
     (`q-331a-pflicht`, `q-331b-vertiefung-1`, `q-331b-vertiefung-2`).

## 6. Sichtbarkeit

Kein `set.json` angefasst, kein Index gebaut, kein `entwurf_komponenten` gesetzt (E44).

| Einheit | Lage nach dem nächsten `npm run build:einheiten-index` + Deploy |
|---|---|
| `3.2.1_konsumfolgen_beurteilen` | publiziert, Toolbox neu → für alle Lehrpersonen sichtbar |
| `3.3.1_kaufvertrag_beurteilen` | publiziert, Toolbox neu → für alle Lehrpersonen sichtbar |
| `3.2.1_wahre_kosten` | ganze Einheit `status: "entwurf"` → nur KT1; dort wechselt 1.0.0 zu 2.0.0 |

Im Index steht für die zwei publizierten Einheiten noch `hat_ki: false`.

## 7. Zwischenfälle

- **Abgelehnte Skill-Änderung** (§4): einmal versucht, nicht umgangen.
- **Nebenwirkung einer Korrekturrunde:** Runde 1 von `3.2.1_konsumfolgen_beurteilen` benannte die
  Werkschau-Lücke ohne Auftrag in `[mein Satz]` um (Platz für die längere Ausschlussliste); Runde 2
  hat sie auf `[was ich gelernt habe]` zurückgestellt.
- Kein fremder Commit, kein Abbruch. Jeder Agent arbeitete in einem eigenen Unterordner des
  Scratchpads; kein Agent hat `export-ki-toolbox` oder `messen-v42` gestartet.

## 8. Schlusspass und `git status --short`

Nach der letzten Änderung ist §4 des Auftrags für jede Einheit ganz gelaufen: je genau vier
Toolbox-Dateien, `check-ki-toolbox` GRUEN mit 0 Warnungen, Export 2 · 3 · 3 · 3, `messen-v42`
ohne Überlauf, bei v4.2 `check-all` GRUEN ohne Treffer in den Toolbox-Dateien, ausserhalb der drei
Ordner nichts Neues ausser diesem Bericht und der Zeile in `INDEX.md`.

**Von diesem Lauf**

```
 M docs/cloud-run/laeufe/INDEX.md
 M src/data/einheiten/3.2.1_wahre_kosten/ki-liesmich.md
 M src/data/einheiten/3.2.1_wahre_kosten/ki.json
 M src/data/einheiten/3.2.1_wahre_kosten/lernbegleiter.json
 M src/data/einheiten/3.2.1_wahre_kosten/lernprompt.json
?? docs/cloud-run/laeufe/2026-10-08-ki-toolbox-lehrjahr-1-rest/
?? src/data/einheiten/3.2.1_konsumfolgen_beurteilen/ki-liesmich.md
?? src/data/einheiten/3.2.1_konsumfolgen_beurteilen/ki.json
?? src/data/einheiten/3.2.1_konsumfolgen_beurteilen/lernbegleiter.json
?? src/data/einheiten/3.2.1_konsumfolgen_beurteilen/lernprompt.json
?? src/data/einheiten/3.3.1_kaufvertrag_beurteilen/ki-liesmich.md
?? src/data/einheiten/3.3.1_kaufvertrag_beurteilen/ki.json
?? src/data/einheiten/3.3.1_kaufvertrag_beurteilen/lernbegleiter.json
?? src/data/einheiten/3.3.1_kaufvertrag_beurteilen/lernprompt.json
```

**War schon da:** nichts — der Arbeitsbaum war beim Start sauber.

## 9. In drei Sätzen

**Fertig** sind alle drei Toolboxen (2.0.0, `check-ki-toolbox` grün ohne Warnungen, Seiten
2 · 3 · 3 · 3 ohne Überlauf, letzte Lesung überall «in Ordnung», keine Fehler), womit das
1. Lehrjahr vollständig ist. **Nicht fertig** sind die Reststellen in §3 — am meisten bei
`3.2.1_konsumfolgen_beurteilen`, das beide Korrekturrunden gebraucht hat —, die zwei
vorgeschlagenen Skill-Regeln (abgelehnt, §4), dazu Index-Bau und Commit. **Zu entscheiden** hat
Pietro: (1) ob «Dimension» und «graue Energie» im Prüfskript freigegeben werden, damit die
Toolbox von `3.2.1_konsumfolgen_beurteilen` die Kernbegriffe von Heft A abfragen kann (§5), (2) ob
`ai_entscheidungscoach` in `3.3.1` und `3.2.1_wahre_kosten` gilt oder die Probe enger gelesen wird
(§3.2, §3.3), (3) ob die zwei Regeln in die Skill kommen und ob der feste Schritt 2 bleibt (§4) —
und wann Index-Bau, Commit und Deploy laufen, mit denen die zwei publizierten Toolboxen für alle
sichtbar werden.

## 10. Nachtrag — Entscheide Pietro nach dem Bericht (08.10.2026, E45)

1. **Sperrwörter freigegeben.** `scripts/check-ki-toolbox.mjs`: «Dimension» ist in
   `3.2.1_konsumfolgen_beurteilen` erlaubt (`SPERRWORT_AUSNAHMEN`); `nurSpur` wertet einen Begriff
   nicht mehr als Nur-Spur-Begriff, wenn das Glossar ihn auch ohne `spur` führt («graue Energie»).
   `b1-language-rules.md` §4 nennt den Entscheid. Danach, von einem Sonnet-Agenten, **ein Feld**
   geändert: `3.2.1_konsumfolgen_beurteilen › lernbegleiter.json › strategie_karten[retrieval].prompt_basis`
   fragt jetzt «Nachhaltigkeit, ökologische Dimension, graue Energie, Angebot, Nachfrage,
   Preisbildung» ab (vorher «Nachhaltigkeit, nachhaltiger Konsum, Angebot, Nachfrage,
   Marktgleichgewicht, Zielkonflikt»; 45 Wörter, 313 statt 316 Zeichen). Nachgemessen:
   2 · 3 · 3 · 3, kein Überlauf, Lernbegleiter S. 1 weiter 3.5 px; beide Skripte grün. Das Feld
   ist nach der Änderung nicht mehr gegengelesen. Alle 18 Toolboxen mit Stand 2.x mit dem
   geänderten Skript geprüft: GRUEN.
2. **`ai_entscheidungscoach` gilt** in `3.3.1_kaufvertrag_beurteilen` und `3.2.1_wahre_kosten`.
   Keine Datei geändert.
3. **Die zwei Regeln aus §4 stehen in der Skill** (`basis-plus.md` §5, Zeilen `kn_typ_tracks[]`
   und `rubrik_fokus[].so_uebst_du`; dazu der Satz «nie «am Übungsfall unten»»).
4. **Index gebaut, Stand committet und deployt** (Push auf `main`). `ENTSCHEIDE.md` E45 und zwei
   Sätze in `CLAUDE.md` nachgeführt.

