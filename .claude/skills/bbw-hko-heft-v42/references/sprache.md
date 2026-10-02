# Sprache — Schweizer Hochdeutsch, Anrede, gesperrte Wörter

Gilt für jeden Text, den die Skill schreibt: die fünf Einheitsdateien, die
Quellenkarten, `begleiter.md`, den Bauplan und den Bericht. Übernommen und
angepasst aus `language-rules.md` der Skill `bbw-hko-3er-set` (dort unverändert);
die Abschnitte 1–8 sind v4.2-Regeln, die Abschnitte 9–14 das übernommene
Handwerk.

---

## 1. Wer wird wie angesprochen

| Text | Leserin, Leser | Form | Felder |
|---|---|---|---|
| Situation, Fall, eigene Haltung | Lernende | **Ich** (1. Person Singular) | `situation_text`, `leitfrage`, `handlungsprodukt.beschreibung`, `dekontextualisierung.frage`, `abschluss.quercheck`, `abschluss.mitnahme`, Satzanfänge, `gemeinsamer_auftrag.situation_text` und `.leitfrage`, `hybrid_situation.text`, `kern_kompetenzversprechen` |
| Auftrag, Leitfrage, Hinweis | Lernende | **Sie** (Höflichkeitsform, Imperativ) | `leitfragen[].text`, `scaffolding.strategien` und `.produkt`, `handlungsprodukt.schritte`, `.format_detail`, `raster.auftrag`, `quellen[].auftrag`, `mehrdeutigkeit.hint`, `kasten_s4.hinweis`, `methoden[].tun`, `lernfortschritt.scaffold_100`, `gemeinsamer_auftrag.auftrag` und `.schritte`, Fragen und Aufgaben des KN |
| Lösung, Erwartungshorizont | Lehrperson | sachlich, ohne Anrede; Beispielantworten der Lernenden in **Ich** | `loesung.*`, `erwartungshorizont.*`, `quellen[].erwartung`, `loesungsbild.hinweis`, `abschluss.loesung.*` |
| Begleiter | Lehrperson | **Du** | `begleiter.md` |
| Bauplan, Bericht | Pietro | sachlich, ohne Anrede | — |

**Anrede-Grundsatz.** Die Lernenden werden mit **Sie** angesprochen. Kein
`du/dein/dich/dir` in Aufträgen, Leitfragen, Hinweisen und Aufgaben des KN.
Ausgenommen: (a) Ich-Texte — 1. Person Singular; (b) **zitierte Rede** anderer
Personen im Fall (eine Nachricht im Gruppenchat, ein Satz der Berufsbildner/in)
— bleibt wörtlich, auch in Du-Form; (c) der Begleiter, der die Lehrperson duzt.
Beim Umstellen die **Verbformen** mitanpassen, nicht nur das Pronomen.

**Persona.** Keine erfundene Person mit Namen, Beruf, Betrieb und Ort. Das Feld
`persona` steht wörtlich wie im Skelett: «Lernende/r EFZ, N. Lehrjahr» ·
«eigener Lehrbetrieb» · «eigener Wohnort». Im Fall heisst es «mein Lehrbetrieb»,
«eine Kollegin», «zwei aus meiner Klasse» — nie ein Firmenname, nie ein Ortsname
als Wohnort der Person (`ERR_PERSONA_SPEZIFISCH`).

---

## 2. Im Heft keine Woche, keine Lektion, keine Minuten (E17)

Das Heft sagt nicht, wann und wie lange gearbeitet wird. Das entscheidet die
Lehrperson.

| Nicht im Heft | Stattdessen |
|---|---|
| «Ihre Woche», «in dieser Woche», «Woche 2» | «Übersicht»; `wochen_plan[].label` = «Teil 1», «Teil 2», «Teil 3» |
| «Lektion 1», «in der ersten Lektion» | «Teil 1», «zuerst», «danach» |
| «45 min», «in zehn Minuten», «15 Minuten Lesezeit» | keine Angabe |
| «Mitnahme in den gemeinsamen Auftrag (Woche 3)» | «Das nehme ich mit» — das Heft verweist nicht auf den Auftrag |

Gemeint sind Angaben zum **Unterricht** — verboten ist Unterrichtszeit, nicht
jede Zeitangabe. Zeit, die zum Fall oder zum Produkt gehört, bleibt: eine
Frist im Fall («bis Freitag»), **die Dauer eines Produkts** («ein Statement
von zwei Minuten», `produkte[].dauer`), die Länge eines Ausschnitts der Quelle
(ENTSCHEIDE E27). Der Zeitplan steht als Vorschlag im
Begleiter und in `set.wochenplan`, nie im Heft.

## 3. Kein Wort «Spur» in Texten für Lernende (E15)

«Spur» ist ein Wort der Lehrperson. Lernende haben ein Heft, nicht eine Spur.
Betroffen ist jeder Text, den Lernende lesen — besonders `wochen_plan[].text`,
`lernfortschritt.scaffold_100`, `leitfragen_intro`, Schritte und Abgaben.
Weil der Kern in beiden Spuren steht, schreibt er so, dass der Satz in beiden
stimmt: «Raster zur Quelle (S. 3)», «falls Ihr Heft eine Vertiefung nennt».

Erlaubt: im Begleiter, im Bauplan, im Bericht — und im festen Wert
`methoden[].fuer` des Platzhalters `__spur__`, den der Renderer ersetzt.

## 4. «Quelle», nicht «Pflichtquelle» (E16)

Alles ist Pflicht, ausser es ist als freiwillig bezeichnet.

| Intern (Daten, IDs) | Sichtbar (Heft, QR-Seite, Übersicht, Begleiter) |
|---|---|
| `rolle: "pflicht"`, `q-…-pflicht` | «Quelle» |
| `q-…-pflicht-ersatz`, `ersatz_ref` | «Ersatzquelle» |
| `rolle: "vertiefung"` | «Vertiefung (freiwillig)» |

In der Spur ohne Medien ist die «Quelle» der Lehrmittel-Abschnitt; die
Checkliste sagt in beiden Spuren «Raster zur Quelle».

## 5. «Punkte», nicht «Stufe» (E17)

Heft, Auftragsbogen, KN und Begleiter sprechen von **0 bis 3 Punkten** je
Kriterium. Nicht «Stufe 1–4», nicht «Niveau 2». Das Datenfeld heisst weiter
`stufen`; sein Index ist die Punktzahl.

## 6. Auftragsbogen: keine Vorgabe an die Lehrperson (E18)

Der Auftragsbogen spricht zu den Lernenden. Er schreibt der Lehrperson nicht
vor, was sie mit dem Auftrag tut.

- Kein Satz der Art «Die Lehrperson bewertet …», «Sie erhalten eine Note»,
  «Bis zum KN verbessern Sie …». Seite 4 heisst «Selbsteinschätzung»; die
  zweite Spalte heisst «Fremd», nicht «LP».
- Ob und wann der Auftrag folgt, wer rückmeldet und in welcher Sozialform
  gearbeitet wird, entscheidet die Lehrperson. Vorschläge dazu stehen in
  `gemeinsamer_auftrag.sozialform.empfehlung` und im Begleiter — als Vorschlag
  formuliert.
- Kriterien, Punkte und Wortlaut bleiben die des KN.

## 7. Gesperrte Wörter

### 7.1 Der Fall des KN

Jeder Begriff aus `prinzip.hybrid_situation_spec.fall_ausschluss_hefte_und_auftrag`
ist verboten in beiden Heften (auch in Lösungen und Bildern), im gemeinsamen
Auftrag, im Glossar und in jeder Quellenkarte der Einheit — als Teilwort, ohne
Rücksicht auf Gross- und Kleinschreibung (`ERR_V42_R9_FALL`). Ein Begriff
«Garantie» träfe auch «Garantieschein» und «garantiert». Ausnahmen:
`feedback_kriterien[].stufen[]` (Wortlaut des KN, E8),
`gemeinsamer_auftrag.kontext_ausschluss`, `prinzip_handoff.kn_aktivierung`.

### 7.2 Sechs Wörter, die für jede Einheit gesperrt sind (E24)

`scripts/check-v42.mjs` führt sechs Wörter des Piloten fest im Code. Sie gelten
für **jede** v4.2-Einheit, gleich welchen Themas, an denselben Orten wie 7.1:

| Gesperrt (als Teilwort, klein oder gross) | trifft zum Beispiel auch |
|---|---|
| `leasing` | Leasingvertrag, Autoleasing |
| `konsumkredit` | Konsumkreditgesetz |
| `kleinkredit` | Kleinkredite |
| `e-bike` | E-Bikes |
| `ebike` | — |
| `mobilität` | Elektromobilität, Mobilitätskosten |

Folgen:

- Kein Heft, kein Auftrag, kein Glossareintrag und keine Quellenkarte nennt
  eines dieser Wörter — auch nicht in `url`, `titel` oder `titel_original`
  einer Karte.
- Braucht der **Gegenstand** der Einheit eines davon, ist die Einheit nicht
  erzeugbar, bis das Skript korrigiert ist. Nicht umschreiben («Velo mit
  Motor»), nicht umgehen: melden.
- Kommt ein Wort nur am Rand vor, den Satz so schreiben, dass er es nicht
  braucht.

### 7.3 Wendungen, die ein Skript als Fehler liest

| Wendung | Warum | Stattdessen |
|---|---|---|
| «im Voraus», «vor der ersten Lektion», «schon vorher», «schon vorab», «erfragen Sie vorab», «bringen Sie … mit» | `ERR_VORAUSSETZUNG_VOR_START`: Das Heft beginnt ohne Vorarbeit. Gilt in jedem String, auch in Lösungen. | «früh», «rechtzeitig», «zuerst»; Material steht im Heft |
| «aus Herausforderung A», «wie in Herausforderung B», «aus A und B» | `ERR_QUERVERWEIS_ALS_BEDINGUNG` / `WARN_QUERVERWEIS` | «Heft A», «Heft B» — und nur dort, wo ein Heft das andere nicht voraussetzt |
| drei oder mehr Aufträge der Form «Verb Sie» in einer Leitfrage | `WARN_LF_MEHRFACHAUFTRAG` | höchstens zwei; den Rest in die Strategien |
| «Sie», «Ihr», «Ihre» in `liefert` | `WARN_LIEFERT_VERBFORM` | nominal: «drei Belege mit Fundstelle» |
| TODO, TBD; eine eckige Klammer vor «nach », «abhängig», «Datum», «Vier », «URL», «JJJJ»; geschweifte Klammern um Platzhalter | `ERR_PLATZHALTER`, `ERR_V42_PLATZHALTER` | ausschreiben; runde Klammern |
| ein Satz aus dem Lehrmittel oder aus einer Quelle | `WARN_LEHRMITTEL_NAH` ab 14, `ERR_LEHRMITTEL_WOERTLICH` ab 25 Wörtern am Stück | eigene Formulierung plus Kapitel und Seite |

## 8. Trade-off → Spannungsfeld oder Zielkonflikt

Der Anglizismus «Trade-off» steht in keinem sichtbaren Text.

- **Spannungsfeld** — wenn die Spannung selbst gemeint ist («das Spannungsfeld
  zwischen X und Y», «beide Pole des Spannungsfelds»). So heisst auch der
  Kasten auf Seite 1.
- **Zielkonflikt** — wenn der Konflikt als benenn- und entscheidbares Ding
  gemeint ist («den Zielkonflikt benennen»).

**Code und Prosa trennen.** Die Regel betrifft nur sichtbaren Text. Die
Schlüssel `trade_off_raum`, `mehrdeutigkeit.trade_off`, `aktivierte_trade_offs`
und `must_activate_trade_offs_min` behalten ihren Namen. Die **Werte** von
`mehrdeutigkeit.trade_off` (Form «X vs. Y») bleiben ebenfalls, wie sie sind.

---

## 9. Eszett — niemals

**Regel:** Kein Eszett-Zeichen (`ß`). Immer Doppel-s: Strasse, gross, heisst,
ausser, Spass, Massnahme, weiss, schliesslich, regelmässig.

Das gilt auch in Eigennamen und im Titel einer Quelle (`titel`,
`titel_original`): Die Skripte prüfen jede Zeichenkette, auch die der
Quellenkarten. Drei Skripte melden das Zeichen: `ERR_V42_R10_ESZETT`,
`ERR_ESZETT`, `ERR_ESZETT_FOUND`.

## 10. Umlaute — Pflicht in Prosa, transliteriert in IDs

**Regel:** Echte Umlaute `ä/ö/ü/Ä/Ö/Ü` sind in allen Prosa-Feldern Pflicht.
Transliteration (`ae/oe/ue`) in Prosa ist ein Fehler, kein zulässiger Stil.
Kein Skript prüft das — die Suche nach Transliterationen ist Sache der Skill
(`references/umlaute.md`).

| Kontext | Umlaute | Beispiel |
|---|---|---|
| Prosa (`situation_text`, Leitfragen, Lösungen, Glossar, Begleiter) | **ja, nativ** | «Ich überlege, ob ich zusage.» (nicht «ueberlege») |
| Namen aus dem Datensatz (Aspekte, Sprachmodi) | **ja, wörtlich wie im Datensatz** | «Identität und Sozialisation», «Produktion mündlich» |
| IDs und Verweise (`id`, `prinzip_ref`, `topic_slug`, Quellen-IDs, Methoden-Refs) | nein, transliteriert | `2.1.2_quellen_pruefen_hf_A` |
| Ordner- und Dateinamen | nein, transliteriert | `herausforderung_A.json` |
| Schlüssel im JSON | nein, transliteriert | `"loesung"`, `"satzanfaenge"`, `"vollstaendig_wenn"` |
| feste Werte, die Code liest (`typ`, `antwortform`, `pol_typ`, `bogen[]`) | nein | `"selbsteinschaetzung"`, `"denkhilfe"` |

| Umlaut | Transliteriert |
|---|---|
| ä / Ä | ae / Ae |
| ö / Ö | oe / Oe |
| ü / Ü | ue / Ue |

## 11. Gendern — Schrägstrich-Form

**Regel:** Generische Rollennomen im sichtbaren Text werden mit **Schrägstrich
gegendert, beide Endungen in einem Wort**. **Kein Schrägstrich-Bindestrich**
(`Lehrer/-in` ist falsch).

| Generisch | Schrägstrich-Form |
|---|---|
| Berufsbildner | Berufsbildner/in |
| Lehrer | Lehrer/in |
| Mitarbeiter | Mitarbeiter/in |
| Arbeitnehmer / Arbeitgeber | Arbeitnehmer/in · Arbeitgeber/in |
| Lernender (Einzahl, mask.) | Lernende/r |
| Vorgesetzter | Vorgesetzte/r |
| Chef | Chef/in |

**Nur die generische Einzahl gendern.** Neutrale Partizip-Plurale bleiben: `die
Lernenden`, `die Mitarbeitenden`, `die Vorgesetzten`.

**Nicht anfassen:**

- bereits gepaarte Formen — `mit einer Kollegin/einem Kollegen`;
- feste Methoden- und Fachbegriffe — `Expertengruppe`, `Partnerarbeit`;
- Komposita, in denen das Rollennomen nicht der Kopf ist — `Kundengespräch`,
  `Mitarbeitergespräch`;
- Schlüssel, IDs, Dateinamen; Namen aus dem Datensatz; der Wortlaut der
  KN-Kriterien in den Heften.

**Artikel und Pronomen bleiben unverändert** — gegendert wird nur das
Substantiv: `mein Berufsbildner/in`, `als Lernende/r`.

## 12. Ich-Perspektive

Der Fall und das Produkt sind aus der Sicht der Lernenden geschrieben. Nicht
«die Lernenden sollen …», nicht «der/die Kandidat/in muss …».

| Falsch (Distanz) | Richtig |
|---|---|
| «Die Lernenden sehen sich zwei Angebote an.» | «Vor mir liegen zwei Angebote.» |
| «Es ist wichtig zu erkennen, dass …» | «Ich merke, dass …» |
| «Die Lernenden sollen zwei Möglichkeiten abwägen.» | «Sie haben zwei Möglichkeiten: … . Welche wählen Sie, und warum?» |
| «Es muss begründet werden, warum …» | «Begründen Sie, warum Sie ….» |

### Verbotene Wendungen

Distanzierend — durch Ich- oder Sie-Form ersetzen:

```
„Es ist wichtig zu …"
„Es ist notwendig, dass …"
„Die Lernenden sollten …"
„Man sollte beachten …"
```

Füllsel — nie:

```
„Tolle Frage!"
„Eine spannende Herausforderung!"
„Hervorragend gewählt!"
```

Leerformeln — streichen und direkt sagen, was gilt:

```
„im Allgemeinen ist es so, dass …"
„grundsätzlich kann man sagen, dass …"
„es lässt sich festhalten, dass …"
```

Anglizismen:

```
"das Setting"  → „die Situation", „der Rahmen"
"das Mindset"  → „die Haltung", „die Einstellung"
"der Case"     → „der Fall"
"die Story"    → „die Geschichte", „der Verlauf"
"das Feedback" → „die Rückmeldung" (fester Begriff im Heft bleibt: «Feedback-Kriterien»)
```

Wertende Sprache in Lösungen und im Begleiter:

```
„Falsch."   → was abweicht und wovon
„Schlecht." → was fehlt
„Sehr gut!" → was gelungen ist
```

## 13. Schweizer Begriffe und Zahlen

| Schweiz | Deutschland (vermeiden) |
|---|---|
| Lehre / Berufslehre | Ausbildung |
| Lernende | Auszubildende/r, Azubi |
| Lehrbetrieb | Ausbildungsbetrieb |
| Lehrvertrag | Berufsausbildungsvertrag |
| Berufsfachschule | Berufsschule (Kontext beachten) |
| Velo | Fahrrad |
| Tram | Strassenbahn |
| Quartier | Stadtviertel |
| Coiffeur | Friseur |
| parkieren | parken |
| Trottoir | Bürgersteig |
| Billett | Fahrkarte |
| Couvert | Briefumschlag |
| Spital | Krankenhaus |

Bei Unsicherheit die Schweizer Variante.

| Format | Beispiel | Verwendung |
|---|---|---|
| Ganzzahl | `CHF 850` | Lohn, runder Preis |
| Mit Rappen | `CHF 179.90` | Preis mit Rappen |
| Bereich | `CHF 700–1200` | Halbgeviertstrich, kein Bindestrich |
| Tausender | `CHF 12'500` | Apostroph als Tausenderzeichen |

Zahlen eines Falls sind erfundene Fallzahlen und als solche erlaubt. Zahlen
über die Welt stehen nur, wenn sie im Lehrmittelkapitel oder im Archivtext
einer Quelle belegt sind.

Seitenangaben: in den Feldern `knoten_ref`, `quelle_ref` und
`quellen_anker[].seiten` mit Bindestrich («S. 12-14», «Seite 12-14»); im
Fliesstext für Lernende mit Halbgeviertstrich («S. 12–14»).

## 14. Der Hinweis zum Spannungsfeld (`mehrdeutigkeit.hint`)

Ein bis zwei Sätze, Sie-Form, höchstens 160 Zeichen. Er benennt beide Pole
**konkret** und nimmt den Lernenden die Wahl nicht ab.

Gut:

```
«Früh zusagen gibt Sicherheit, abwarten lässt Ihnen die Wahl. Beides lässt
 sich begründen.»

«Ein Rat aus dem Freundeskreis ist nicht falsch, weil er nicht neutral ist.
 Wo ziehen Sie die Grenze?»
```

Schlecht:

```
«Seien Sie sich bewusst, dass es zwei Sichtweisen gibt.»   ← banal
«Beide Möglichkeiten können richtig sein.»                 ← inhaltsleer
«Argumentieren Sie abgewogen.»                             ← Anweisung, kein Hinweis
```

---

## 15. Still korrigieren — und was nicht

Ohne Rückfrage korrigiert wird:

1. Eszett → ss
2. CHF-Format (Apostroph, Halbgeviertstrich)
3. Bindestrich statt Halbgeviertstrich bei Zahlbereichen im Fliesstext
4. deutsche Variante statt Schweizer Begriff («Auszubildende» → «Lernende»)
5. Transliteration in Prosa (`ae/oe/ue` → `ä/ö/ü`) gemäss
   `references/umlaute.md`; Eigennamen bleiben

Nicht still korrigiert, sondern neu geschrieben und im Bericht vermerkt:

- Verletzung der Ich- oder Sie-Form
- Füllsel und distanzierende Wendungen
- ein gesperrtes Wort (Abschnitt 7) — nie durch ein Synonym «retten», wenn es
  der Gegenstand ist

## 16. Kurzprüfung vor jedem Schreiben

```
□ Kein Eszett
□ Umlaute nativ in Prosa; IDs, Schlüssel, Dateinamen transliteriert
□ persona wörtlich wie im Skelett; keine erfundene Person, kein Betrieb, kein Ort
□ Situation in Ich-Form; Aufträge, Leitfragen, Hinweise in Sie-Form (kein du/dein)
□ Begleiter in Du-Form
□ Im Heft keine Woche, keine Lektion, keine Minuten Unterrichtszeit (die Dauer eines Produkts ist erlaubt)
□ Kein «Spur» in Texten für Lernende
□ «Quelle» statt «Pflichtquelle»; «Punkte» statt «Stufe»
□ Auftragsbogen ohne Vorgabe an die Lehrperson
□ Kein Begriff des KN-Falls und keines der sechs gesperrten Wörter in Heft, Auftrag, Glossar, Quellenkarte
□ Kein «im Voraus», kein «bringen Sie … mit», kein «aus Herausforderung A»
□ Höchstens zwei Aufträge je Leitfrage; `liefert` ohne Anrede
□ Kein «Trade-off» im sichtbaren Text
□ Keine Füllsel, keine distanzierenden Wendungen
□ Schweizer Begriffe; generische Rollennomen mit Schrägstrich
□ CHF-Format: Apostroph und Halbgeviertstrich
□ Kein Satz aus dem Lehrmittel oder aus einer Quelle
```
