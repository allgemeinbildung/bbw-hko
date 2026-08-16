# KN-Architektur — 3er-Set Inline-Kompetenznachweis

Design-Regeln fuer die KN-Generierung in Phase 4 der `hko-3er-set-generator`-Skill. Dieses Dokument ist die Quelle der Wahrheit fuer Hybrid-Herausforderung, die drei KN-Typen und die bi-dimensionale Rubrik.

> **Prosa-Begriff:** In jeder gerenderten Prosa (Hybrid-Szene, Rubrik-Texte, KN-Reflexionsfragen) heisst die Spannung **Zielkonflikt** oder **Spannungsfeld** — nie „Trade-off". Die internen Bezeichner (`trade_off_raum`, `aktivierte_trade_offs`, Check-/Fehlercodes) bleiben unveraendert. Regel: `language-rules.md` §5.4.

---

## 1. Was ist eine Hybrid-Herausforderung — und was nicht

Die Hybrid-Herausforderung ist **eine** Szene, die alle drei Lernaufgaben-Prinzipien gleichzeitig aktiviert. Sie ist der pruefungsfaehige Bruecken-Stein zwischen Lernen (3 sit_*.json) und Pruefen (3 KN-Typen).

### Sie ist:
- Eine kontinuierliche Erzaehlsequenz von max. 120 Woertern
- In ICH-Perspektive, Persona aus `persona_pool_kn_neu` (Unseen-Transfer)
- Eine Szene, in der die Konfliktarten aller drei Herausforderungen sichtbar werden, ohne explizit benannt zu sein
- Ein Spannungsfeld-Aktivator — mind. ein Eintrag aus `prinzip.mehrdeutigkeits_architektur.trade_off_raum` spannt sich auf

### Sie ist NICHT:
- Drei separate Mini-Herausforderungen aneinandergereiht (das ist die alte Mini-Cases-Logik aus der 5er-Skill)
- Eine Wiederholung einer der drei Lernaufgaben (dann ist es kein Transfer)
- Pruefungsfragen-Liste (die kommen in den KN-Typen)
- Loesungsvorgabe (eine Leitfrage am Ende, keine Antwort)

---

## 2. Hybrid-Herausforderung — Generierungsregeln

### Kombinations-Logik
Lies die drei `sit_*.json` und extrahiere pro Herausforderung:
- `herausforderung.label` und die zugehoerige `konfliktart` aus `prinzip.herausforderungen[buchstabe].konfliktart`
- `prinzip_handoff.kernkonzept` (3-7 Woerter, was diese Herausforderung beitraegt)
- `mehrdeutigkeit.trade_off` (was diese Herausforderung am Trade-off-Raum sichtbar macht)

Konstruiere eine Szene, in der ein Lernender (Persona aus `persona_pool_kn_neu[0]`) eine einzige Entscheidungssituation erlebt, die alle drei `kernkonzept`-Schluesselbegriffe sichtbar macht — als gleichzeitig wirksame Faktoren in derselben Szene.

### Laengen- und Form-Limits (praezise in v1.1)

- max. 120 Woerter **im `text`-Feld** (die eigentliche Szene)
- NICHT mitgezaehlt: Persona-Zeile, Titel, emotion_tag, Leitfrage, alignment_note
- Bindestrich-Komposita („H&M-Filiale") = 1 Wort
- Zahlenangaben („CHF 19.90") = 1 Wort
- Akronyme in Klammern („AHV") = 1 Wort

Phase 4 Step 2 gibt die Wortzahl bei User-Review explizit aus:
  „Szene (108/120 Woerter, im text-Feld): ..."

Bei Ueberschreitung: Auto-Fix-Vorschlag (Kuerzung) vor User-Approval.
- ICH-Perspektive durchgehend
- Konkreter Schweizer Kontext: realer Beruf, plausibler Betrieb, schweizerische Stadt, plausibler Lehrlingslohn-Kontext
- Endet mit genau einer Leitfrage, die die Spannung benennt: "Wie gehe ich vor — und warum?" oder analog

### Mehrdeutigkeits-Aktivierung
Die Szene muss mind. einen Trade-off aus `trade_off_raum` aktivieren. Im `alignment_note`-Objekt dokumentierst du:
- `herausforderungen_mapping[].scene_element`: pro Sit-Letter ein konkreter Halbsatz zur szenischen Aktivierung (A → welches Szenenelement, B → welches, C → welches). Im Fliesstext die Einheit als Herausforderung A/B/C referenzieren, nie als Sit A.
- `new_dimensions[]`: Liste von Konfliktdimensionen, die in der Hybrid-Szene aktiv sind, aber in keiner `sit_*.herausforderung.konfliktart` vorkommen. Wenn nicht-leer: `WARN_HYBRID_NEW_DIMENSION`, Lernende sind nicht vorbereitet.

### alignment_note (strukturiert in v1.1)

```json
"alignment_note": {
  "herausforderungen_mapping": [
    {"hf_letter": "A", "scene_element": "..."},
    {"hf_letter": "B", "scene_element": "..."},
    {"hf_letter": "C", "scene_element": "..."}
  ],
  "new_dimensions": []
}
```

### Trade-off-Konsolidierung (NEU in v1.2)

`aktivierte_trade_offs` wird NICHT frei generiert, sondern mechanisch aus
`herausforderungen_mapping[]` abgeleitet (siehe SKILL.md Phase 4 Step 2). Das
verhindert Inkonsistenzen zwischen Mapping und Array.

Vorgehen:
1. Fuer jeden Eintrag in `herausforderungen_mapping[]` mit `hf_letter == X`: lies `sit_X.mehrdeutigkeit.trade_off`
2. Dedupliziere die resultierende Liste
3. Schreibe als `hybrid_situation.aktivierte_trade_offs`

Wenn die Hybrid-Szene zusaetzliche Trade-offs aktiviert, die nicht zu einer
gemappten Herausforderung gehoeren, werden diese in
`alignment_note.additional_trade_offs[]` notiert — getrennt vom
mapping-abgeleiteten Array.

### Persona-Disjunktheit
- `hybrid_situation.persona.beruf` darf in keinem `sit_*.persona.beruf` vorkommen
- `hybrid_situation.persona.ort` darf in keinem `sit_*.persona.ort` vorkommen
- Beides aus `persona_pool_kn_neu`. Index 0 ist Default; Index 1 ist Reserve, falls die Default-Wahl an einem inhaltlichen Konflikt scheitert.

---

## 3. KN-Typ 1 — Fachgespraech

### Format
- Muendlich, 30-35 Min. total pro Lernende/r
- 15 Min. Vorbereitungszeit (Hybrid-Herausforderung lesen, Notizen auf A4, Lehrmittel erlaubt, kein Internet)
- 15-20 Min. Gespraech mit Lehrperson (5 Fragen)

### Fragestruktur (verbindlich, K-Stufen-Progression)

| Nr | Typ | K-Stufe | Inhalt |
|---|---|---|---|
| 1 | Erklaeren | K2 | "Welcher Mechanismus liegt bei {Hybrid-Element} vor — und warum?" |
| 2 | Anwenden | K3 | Konkrete Anwendung der Konzept-Logik aus Sit-Mitte (sit_B) |
| 3 | Beurteilen | K3 | "Wuerden Sie {beide Aspekte} gleich bewerten — warum oder warum nicht?" |
| 4 | Transfer | K4 | "Vergleichen Sie mit einer der drei Lernaufgaben — wo ist das Prinzip gleich, wo unterschiedlich?" |
| 5 | Werthaltung | K4 | "Wer muesste in diesem Fall handeln — und weshalb ist das keine reine Marktfrage?" (oder analog je nach Topic) |

> **Anrede:** Alle fuenf Fragen stehen in der **Sie-Form** (Pruefungsregister, siehe `language-rules.md` §4). Kein `du/dein/dich/dir`.

### SK-Profil
- `sk` = Union der drei `sit_*.nrlp.sk`, dedupliziert, gekappt auf max. 3 zentralste SK
- Vorrang-Regel: SK6 (Standpunkte begruenden) > SK11 (Mehrdeutigkeit) > situative SK
- `aspekte` = Union der drei `sit_*.nrlp.gesellschaft.aspekt`

### Sprachmodi (konstant)
- Rezeption schriftlich und bildlich (Hybrid-Herausforderung lesen)
- Produktion muendlich (antworten)
- Interaktion und Kollaboration muendlich (PEX-Dialog)

---

## 4. KN-Typ 2 — Mini Case schriftlich

### Format
- Schriftlich, 45-60 Min.
- Hybrid-Herausforderung als Pruefungsblatt; Lehrmittel erlaubt nach LP-Entscheid; kein Internet
- 4 strukturierte Aufgaben steigender Komplexitaet

### Aufgaben-Struktur (verbindlich)

| Nr | Typ | K-Stufe | Pattern |
|---|---|---|---|
| 1 | Erklaeren | K2 | Faktendarstellung; bei Wirtschafts-Topic ggf. Diagramm/Kurve (Angebot-Nachfrage-Verschiebung) |
| 2 | Unterscheiden | K3 | Forciert Mehrdeutigkeit: "Beide [Elemente] entstehen durch [Mechanismus]. Warum ist [X] ethisch anders zu beurteilen als [Y]?" |
| 3 | Entscheiden | K3 | Konkrete Entscheidungssituation im Hybrid-Kontext, zwei begruendbare Optionen |
| 4 | Forderung | K4 | Policy / Intervention / persoenliche Handlungsaufforderung in Ich-Form |

### SK-Profil und Aspekte
Gleiche Logik wie Typ 1 (Union dedupliziert + gekappt).

### Sprachmodi (konstant)
- Rezeption schriftlich und bildlich
- Produktion schriftlich und bildlich

---

## 5. KN-Typ 3 — Werkschau + Transfer-Reflexion

### Format
- Schriftlich (+ optional Kurzpraesentation 5 Min.)
- Lernende waehlen eines ihrer drei Handlungsprodukte (aus sit_A/B/C)
- Werkwahl-Begruendung: 2-3 Saetze
- Transfer-Reflexion: 200-250 Woerter

### Werkwahl-Regel
Die Lernende waehlt frei aus den drei in den Lernaufgaben produzierten Handlungsprodukten. Begruendung muss zeigen, warum gerade dieses Werk fuer den Transfer auf die Hybrid-Herausforderung geeignet ist.

### Reflexionsfragen (template-konstant, 3 Pflichtfragen)
1. "Welches Grundprinzip haben Sie in Ihrer Herausforderung gelernt — formulieren Sie es in einem Satz."
2. "Erklaeren Sie, wie dieses Prinzip in der Hybrid-Herausforderung sichtbar wird. Was ist gleich, was ist anders?"
3. "Wann versagt das Prinzip — und was haben Sie durch die drei Herausforderungen insgesamt darueber gelernt?"

### SK-Profil (adaptiv in v1.1)

Basis-Kandidaten `[5, 6, 10]`. Gefiltert gegen Union der drei `sit_*.nrlp.sk`.
Wenn weniger als 2 SK uebrig: aus `prinzip.sk_schnittmenge_kn.primary` ergaenzen. Maximal 3 SK.

Begruendung: Werkschau-Lernende reflektieren ihr eigenes Werk — sie koennen nur SK demonstrieren,
die sie auch trainiert haben. SK10 (Anpassung) faellt heraus, wenn kein Set-Kontext sie trainiert.

### Optional: Kurzpraesentation
5 Min. muendlich. LP stellt eine Anschlussfrage aus dem Fachgespraech-Fragepool. Aktivierbar pro Lernende/r — kein Pflichtteil.

### Sprachmodi (konstant)
- Produktion schriftlich und bildlich

Wenn Praesentation aktiv: zusaetzlich Produktion muendlich + Interaktion und Kollaboration muendlich (wird im Teacher-Guide dokumentiert, nicht im sprachmodi-Array per Default).

---

## 6. Bi-dimensionale Rubrik

### Struktur
- 4 Kriterien
- 2 in Dimension SuK (Sprache und Kommunikation), 2 in Dimension Ges (Gesellschaft)
- 4 Stufen pro Kriterium
- Niveaubaender: unter 60 % / 80 % / 100 %
- Aggregation: gleichgewichtet (SuK und Ges traegen gleich viel zur Endnote bei)

### Die 4 Kriterien (Default-Wording)

| Nr | Name | Dimension | Inhalts-Fokus |
|---|---|---|---|
| 1 | Fachkorrektheit | SuK | Begriffe korrekt und situationsangemessen |
| 2 | Argumentation | SuK | Schluessig, differenziert, Gegenargumente |
| 3 | Wirtschaftliches Prinzip | Ges | Prinzip auf Herausforderung anwenden, Transfer |
| 4 | Position / Werthaltung | Ges | Ich-Form, Mehrdeutigkeit anerkennen |

### Kriterium-3-Wording je nach dominantem Aspekt

Das dritte Kriterium wird je nach dem dominanten Aspekt des Sets benannt. Der dominante Aspekt ist die `gesellschaft[].aspekt`-Auspraegung, die in mind. 2 von 3 Herausforderungen vorkommt; bei Gleichstand der erste Eintrag der NRLP-Kompetenz.

| Dominanter Aspekt | Kriterium-3-Name |
|---|---|
| Wirtschaft | Wirtschaftliches Prinzip |
| Recht | Rechtliches Prinzip |
| Ethik | Ethisches Prinzip |
| Identitaet und Sozialisation | Identitaetskonstrukt |
| Kultur | Kulturelles Prinzip |
| Oekologie | Oekologisches Prinzip |
| Politik | Politisches Prinzip |
| Technologie und digitale Transformation | Technologisches Prinzip |
| Mehrere gleichrangig | "Fachliches Prinzip aus {Aspekt}" als generische Form |

Die 4 Stufen-Beschreibungen bleiben strukturell konstant (Anwendung/Transfer-Progression), inhaltlich passt der Skill den Bezug auf den dominanten Aspekt automatisch an.

### Niveaubaender — Mapping auf Stufen

| Niveauband | Stufen-Verteilung |
|---|---|
| unter 60 % | Stufen 1-2 dominant (>= 2 Kriterien auf Stufe 1 oder 2) |
| 80 % | mehrheitlich Stufe 3 (>= 3 Kriterien auf Stufe 3) |
| 100 % | Stufe 4 in mind. 3 von 4 Kriterien |

---

## 7. Was passiert mit SK11 (Mehrdeutigkeit)

SK11 ist der haeufigste Default-Auslasser. Im 3er-Set ist Mehrdeutigkeit Pflicht in 3 von 3 Herausforderungen (Check 6). Im KN-Setting:
- Hybrid-Herausforderung aktiviert mind. 1 Trade-off (Check 10)
- Fachgespraech Frage 3 (Beurteilen) und Frage 5 (Werthaltung) sind die SK11-Anker
- Mini Case Aufgabe 2 (Unterscheiden) forciert SK11
- Werkschau Reflexionsfrage 3 ("Wann versagt das Prinzip?") ist der SK11-Anker
- Rubrik Kriterium 4 ("Position / Werthaltung") honoriert SK11 explizit auf Stufe 4 ("Mehrdeutigkeit anerkannt")

Wenn SK11 im `sk_schnittmenge_kn.primary` ist, muessen alle 3 KN-Typen ihn aktiv pruefen — nicht nur deklarieren.

---

## 8. Worked Example — Preisbildung Apotheke

Topic: 2.7 Preisbildung. Dominanter Aspekt: Wirtschaft (mit Ethik-Schatten).

### Hybrid-Herausforderung (Skizze, 95 Woerter)
> Ich bin Fachfrau Apotheke EFZ im 2. Lehrjahr in einer Filiale in Olten. Heute Morgen liefert der Grosshaendler ein neues Schmerzmittel: dieselbe Wirkstoffkombination wie das bisherige, aber Markenpraeparat statt Generikum, Preis CHF 24.80 statt CHF 8.20. Die Apothekerin sagt: "Wir empfehlen ab heute das Markenpraeparat — die Marge ist hoeher und die Kundschaft fragt es ohnehin." Eine Stammkundin im AHV-Alter fragt mich an der Kasse, was ihr Medikament heute kostet — und ob sich das gegen letzte Woche veraendert hat. Wie gehe ich vor — und warum?

### alignment_note (Skizze)
> Aktiviert Trade-off "Marktlogik (Marge) vs. Bedarfsorientierung (Kundeninteresse)". Sit_A (Preisbildung am Markt) wird durch Margenargument der Apothekerin sichtbar. Sit_B (Konsumentenethik) durch die AHV-Kundin. Sit_C (Empfehlungsverantwortung) durch die Frage an mich an der Kasse.

### Persona-Disjunktheit
- `persona_pool_units.berufe` = [Detailhandelsfachfrau, Logistiker, Kaufmann]
- `persona_pool_units.orte` = [Winterthur, Aarau, Zuerich]
- `persona_pool_kn_neu.berufe[0]` = "Fachfrau Apotheke EFZ"
- `persona_pool_kn_neu.orte[0]` = "Olten"

Disjunkt — Check 11 passt.

---

## 9. Wann Phase 4 isoliert laufen darf

Phase 4 (Inline-KN) ist deterministisch reproduzierbar, wenn:
- Die 3 sit_*.json existieren
- prinzip.json existiert mit ausgefuelltem `hybrid_situation_spec`, `trade_off_raum`, `persona_pool_kn_neu`
- set.json existiert (fuer `dominanter_aspekt`-Bestimmung — falls leer, leitet Phase 4 ihn selbst aus den 3 sit_*.nrlp.gesellschaft her)

In diesem Fall darf Phase 4 ohne erneuten Durchlauf von Phasen 0-3 + 5 ausgefuehrt werden. Sinnvoll, wenn Pietro nach einer Skill-1-Lieferung nur den KN-Teil ueberarbeiten will.
