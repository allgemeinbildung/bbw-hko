# Phase 6 — Abschluss und Bilder (je Heft)

Ergebnis: Begriffsnetz, Abschluss mit Lösung, Checkliste, Übersicht, Beispielbild
und Lösungsbild in `herausforderung_A.json` und `herausforderung_B.json`. Alles
gehört zum **Kern** (einmal je Heft, nicht unter `spuren`); nur
`abschluss.loesung.eigene_knoten` trägt je Spur einen Eintrag. Voraussetzung:
Phasen 2–5 sind für das Heft abgeschlossen. Phase 6 erfindet nichts dazu, sie
verdichtet, was da ist.

Bei Zweifel nachlesen, nie aus dem Gedächtnis schreiben: `scripts/check-v42.mjs`
(`budgetKern` ab `mindmap_zentrum`, `budgetProduktBild`, `regelGlossar`,
`regelLoesungen`, `regel7`), `scripts/check-einheiten.mjs`,
`src/lib/einheiten/types.ts` (`ProduktBild`, `ProduktBildBlock`, `Abschluss`,
`AbschlussLoesung`), `docs/upgrade-v4.2/ENTSCHEIDE.md` (E15, E17, E19, E26, E30).

## Fest und herzuleiten

| In jedem Heft gleich (Gerüst) | Je Einheit hergeleitet |
|---|---|
| vier Äste, der vierte ist das Transfer-Feld; gleiches Zentrum in A und B | Titel und Knoten der drei Äste — aus den Fachbegriffen des Hefts |
| zwei Quer-Check-Fragen, drei Zeilen «Das nehme ich mit», dritte Zeile «Mir noch unklar» | Wortlaut der Fragen (aus der Situation) und der ersten zwei Zeilen (aus dem, was der gemeinsame Auftrag braucht) |
| vier Checklisten-Zeilen: Leitfragen · Quelle · Produkt · Abschluss | Name des Produkts und die zählbaren Bedingungen |
| Übersicht in drei Teilen | was in welchem Teil geschieht |
| zwei Bilder mit gleichem Aufbau, 2–3 Blöcke, Legende als Kontur | **Blockart(en) — aus dem Typ des Handlungsprodukts** (§5) |

Gold zeigt eine Karte (Listen) und ein Budget (Tabelle + Listen). Das ist ihr
Inhalt, nicht die Vorgabe: Ein Brief ist Fliesstext, ein Gespräch Wechselrede.

## 1. Begriffsnetz — `mindmap_zentrum`, `mindmap_aeste`

Seite 8 druckt das Zentrum, die Knoten der drei Äste als einzelne Pillen (Titel
in der Ecke), zwei leere Knoten «aus meinem Raster» und das offene Feld mit dem
Titel des Transfer-Asts; darunter das Glossar. Linien zeichnen die Lernenden.

| Feld | Regel | Prüfung |
|---|---|---|
| `mindmap_zentrum` | wörtlich `prinzip.mindmap_zentrum_kurz`; ≤ 40; in A und B zeichengleich | `ERR_V42_R7`, Budget |
| `mindmap_aeste` | genau 4 | Budget |
| `mindmap_aeste[].titel` | ≤ 30; Äste 1–3 heftspezifisch, Ast 4 wörtlich «gilt auch bei …» | Budget |
| `mindmap_aeste[].punkte` | `punkte` sind die Knoten: je Ast ≤ 5, je Knoten ≤ 25 Zeichen, **in allen Ästen zusammen ≤ 10**; Ast 4: `[]` | Budget |
| `mindmap_aeste[].optional` | `optional` ist in allen vier Ästen `false` | — |
| `mindmap_aeste[].transfer` | `transfer` steht nur an Ast 4 (`true`); genau ein Ast je Heft trägt es | `ERR_V42_R7` |

Ast 4 lautet immer `{ "titel": "gilt auch bei …", "punkte": [], "optional": false, "transfer": true }`.

**Knoten wählen.** Ein Knoten ist ein Fachbegriff, den LF1–LF4 oder das Produkt
wirklich benutzen (Leitfrage, ihre Lösung, ein Schritt, die `abgaben`).

1. Begriffe aus LF1 und LF2 sammeln, dann die aus dem Produkt. Sind es mehr als
   zehn, fällt weg, was nur einmal vorkommt. **Bei genau zehn Knoten ist das
   Netz voll:** Jeder weitere Fachbegriff kommt nur als Spur-Eintrag ins
   Glossar (über `abschluss.loesung.eigene_knoten`, zwei je Spur) oder gar
   nicht — ein Glossarbegriff ohne `spur`, der kein Knoten ist, ist
   `ERR_V42_GLOSSAR`.
2. Auf drei Äste verteilen. Ein Ast ist eine Frage des Hefts (Was ist es? Was
   wirkt darauf? Was tue ich damit?), kein Kapiteltitel. Jeder der drei Äste
   hat mindestens einen Knoten — ein leerer Ast wird nicht gedruckt.
3. Schreibweise festlegen (Nominativ Singular, ohne Artikel). Dieselbe
   Zeichenfolge steht später im Glossar und in `verbindungen`.
4. Ausschliessen: jeden Begriff aus
   `prinzip.hybrid_situation_spec.fall_ausschluss_hefte_und_auftrag`.

**Übergabe an Phase 7.** `regelGlossar` verlangt beide Richtungen: Jeder Knoten
ist ein Glossarbegriff des Hefts ohne `spur`, und umgekehrt. Phase 6 hält darum
eine Begriffsliste fest — als Arbeitsnotiz im Kontext und im Bericht, **nicht
als Datei im Repo**; sie nennt Fundstellen, keinen Text aus Lehrmittel oder Quelle:

| Begriff (zeichengenau) | Heft | Herkunft | Beleg |
|---|---|---|---|
| Knoten 1 … n | A oder B | Lehrmittel · heft-eigen | Kapitel und Seite · «eigene Setzung des Hefts» |
| die Begriffe aus `eigene_knoten` | A oder B, mit Spur | Lehrmittel · Quelle | Seite · Absatz oder Zeitmarke |

## 2. Abschluss — `abschluss`

Seite 8 druckt `quercheck` als zwei Zeilen zum Abhaken und `mitnahme` als drei
Beschriftungen mit Schreiblinie unter «Das nehme ich mit». `loesung` erscheint
nie im Heft, nur im Dokument «Lösungen» (E19).

| Feld | Regel | Prüfung |
|---|---|---|
| `abschluss.quercheck` | genau 2, je ≤ 110; Ich-Form, mit Ja oder Nein zu beantworten | Budget |
| `abschluss.mitnahme` | genau 3, je ≤ 50; Beschriftung, kein Satz | Budget |
| `abschluss.loesung.verbindungen` | mindestens 5 Einträge mit `von`, `nach`, `text` | `ERR_V42_LOESUNG` |
| `…verbindungen[].von` / `.nach` | ein Knoten aus `mindmap_aeste[].punkte` oder der Titel des Transfer-Asts, zeichengenau; mindestens eine Verbindung führt zum Transfer-Ast | `ERR_V42_LOESUNG` |
| `…verbindungen[].text` | die Beschriftung der Linie: ein Verb oder eine kurze Wendung («führt zu», «schützt vor») | — |
| `abschluss.loesung.transfer` | `transfer` ist nicht leer: zwei bis drei Lebensbereiche, in denen dasselbe Prinzip gilt | `ERR_V42_LOESUNG` |
| `abschluss.loesung.eigene_knoten` | je **vorhandener** Spur (`ohne_medien`, `mit_medien`) genau 2 Begriffe | `ERR_V42_LOESUNG` |
| `abschluss.loesung.quercheck` | gleich viele Einträge wie `abschluss.quercheck`, gleiche Reihenfolge | `ERR_V42_LOESUNG` |
| `abschluss.loesung.mitnahme` | gleich viele Einträge wie `abschluss.mitnahme`, gleiche Reihenfolge | `ERR_V42_LOESUNG` |

**Quer-Check.** Jede Frage nimmt eine der offenen Fragen der Situation auf und
lässt sich nach der Arbeit am Heft abhaken. **Abhaken kann man nur, was ein
Auftrag verlangt hat:** Zu jeder Quer-Check-Frage gibt es eine Stelle im Heft
(Leitfrage, Schritt oder Spalte des Produkts), an der die Antwort entsteht, und
die Frage nennt diese Stelle, wo sie nicht offensichtlich ist («Steht beim Clip
in «Was ich tue», ob ich ihn weiterleite …?»). Verlangt das Heft die Antwort auf
die Leitfrage der Situation nirgends, wird der Schritt ergänzt, nicht der
Quer-Check gestrichen (Fall 2.1.1 B). Die Antwort in `loesung.quercheck`
ist kurz und nennt den Grund aus dem Lösungsbild oder aus LF4.

**«Das nehme ich mit».** Zeilen 1 und 2 nennen je ein Werkzeug oder Ergebnis
dieses Hefts, das der gemeinsame Auftrag braucht — hergeleitet aus dem Bauplan
und `prinzip.json`, nicht aus Gold. Meist ist es das, was LF4 liefert, und das,
was das Produkt festhält. Zeile 3 lautet immer «Mir noch unklar». Der Wortlaut
nennt den Auftrag nicht (E17). Die Zeilen gehen als Notiz an Phase 7
(`gemeinsamer_auftrag.heft_bezug`). `loesung.mitnahme` passt zum Lösungsbild.

**Verbindungen.** Die Begriffe aus `eigene_knoten` sind **keine** zulässigen
Enden — `regelLoesungen` kennt nur die Knoten aus `mindmap_aeste` und den Transfer-Titel.

**Eigene Knoten.** Zwei Begriffe je Spur, die im gelösten Raster dieser Spur
vorkommen und noch kein Knoten sind, je ≤ 25 Zeichen — Phase 7 nimmt aus ihnen
die ein bis zwei Glossareinträge der Spur. **Nur eine Spur:** `eigene_knoten`
trägt nur deren Schlüssel; das Skript geht die vorhandenen Schlüssel von
`spuren` durch. Alle übrigen Felder von `loesung` gelten unverändert.
`loesung.transfer` nennt den Fall des KN nicht (kein Begriff aus dem Fall-Ausschluss).

## 3. Checkliste — `bewertungsraster`

Seite 8 druckt vier Gruppen im 2×2-Raster: `produkt` als Gruppentitel, jeden
Punkt aus `vollstaendig_wenn` als Zeile mit Kästchen.

| Feld | Regel | Prüfung |
|---|---|---|
| `bewertungsraster` | genau 4 Zeilen in dieser Folge | Budget |
| `bewertungsraster[].produkt` | 1 «Leitfragen» · 2 «Quelle» · 3 Kurzname des Handlungsprodukts · 4 «Abschluss» | — |
| `bewertungsraster[].vollstaendig_wenn` | 2–3 Punkte (das Skript erlaubt höchstens 3), je ≤ 70 | Budget |

Kein Gewicht, keine Punkte, keine Note. Jede Bedingung ist zählbar oder sichtbar
(«Raster mit vier Zeilen», «zwei Regeln»), nie ein Urteil («gut begründet»).

- Zeile 1: Bedingungen zu den Leitfragen, die das Produkt tragen (`liefert`).
- Zeile 2: Raster vollständig (Zahl aus `raster.zeilen`), Begriff je Zeile,
  Befund — so formuliert, dass es für jede vorhandene Spur stimmt.
- Zeile 3: deckt die `abgaben`, mit denselben Zahlen und Mengen.
- Zeile 4: die drei festen Teile der Seite 8 — Begriffsnetz mit mindestens fünf
  beschrifteten Verbindungen, Quer-Check abgehakt, «Das nehme ich mit» ausgefüllt.

Ein Verweis auf das andere Heft («aus Herausforderung A») ist hier
`ERR_QUERVERWEIS_ALS_BEDINGUNG` (`scripts/check-einheiten.mjs`).

## 4. Übersicht Seite 1 — `wochen_plan`

Seite 1 druckt unter «Übersicht» je Eintrag `label` und `text`.

| Feld | Regel | Prüfung |
|---|---|---|
| `wochen_plan` | genau 3 | Budget |
| `wochen_plan[].label` | «Teil 1», «Teil 2», «Teil 3» | — |
| `wochen_plan[].text` | ≤ 80; Stichworte, was in diesem Teil geschieht | Budget |
| `wochen_plan[].aktiv` | `aktiv` ist bei Teil 1 `true`, bei Teil 2 und 3 `false` | — |

Keine Woche, keine Lektion, keine Minuten, kein Wort «Spur» (E15, E17).
Aufteilung: Teil 1 Situation, LF1 und LF2 · Teil 2 LF3 mit Raster, LF4, Produkt
beginnen · Teil 3 Produkt fertigstellen, Feedback-Kriterien, Abschluss.

## 5. Produktbilder — `handlungsprodukt.beispielbild`, `handlungsprodukt.loesungsbild`

Zwei gezeichnete Blätter vom Typ `ProduktBild` (E17); fehlt eines: `ERR_V42_PRODUKTBILD`.

| | `beispielbild` | `loesungsbild` |
|---|---|---|
| Wo | Heft S. 6 unter den Methodenkarten, beide Spuren, Unterzeile «Beispiel an einem anderen Fall» | Dokument «Lösungen», nur Lehrperson, in Grün |
| Fall | ein **anderer** Lebensbereich als Heft, Auftrag und KN | der Fall des Hefts, mit den Zahlen der Situation |
| `hinweis` | fehlt | Pflicht: wann zeigen, worauf achten; sagt, dass es eine von vielen Lösungen ist |
| Grenze | eng: `{ eintraege: 5, text: 105 }` | weiter: `{ eintraege: 7, text: 130 }` |

**Ein Produktbild stimmt mit sich selbst und mit dem Heft überein.** Nach jeder
Änderung — auch nach dem Kürzen wegen Überlauf — neu lesen: (1) Jede Zahl und
jede Aussage im Fliesstext lässt sich an der Tabelle oder Liste desselben Bilds
nachzählen («zwei von fünf» heisst zwei Zeilen). (2) Jeder Eintrag folgt den
Definitionen, die das Heft selbst gibt (S. 2 «Fakt: lässt sich nachprüfen» →
ein Versprechen im Video ist «Fakt, ungeprüft», nicht «Meinung»). (3) Das Bild
zeigt **jeden** Teil, den «Das geben Sie ab» nennt, mit denselben Überschriften
und in derselben Zahl wie die Checkliste («Alle vier Teile»).

### 5.1 Felder (für beide Bilder gleich)

| Feld | Regel |
|---|---|
| `titel` | ≤ 90; nennt den Fall |
| `hinweis` | nur `loesungsbild`; wird im Heft nie gedruckt |
| `legende` | 0–3 Einträge; nur wenn das Produkt Markierungen verlangt |
| `legende[].key` | frei wählbares kurzes Kennwort in Kleinbuchstaben (etwa «fest», «offen»); es wird nicht gedruckt und verbindet nur `marke` und Legende |
| `legende[].text` | ≤ 28 |
| `bloecke` | 2–3 |
| `bloecke[].titel` | ≤ 32 |
| `bloecke[].eintraege` | Liste: höchstens so viele wie die Grenze `eintraege` |
| `bloecke[].eintraege[].text` | ≤ Grenze `text` |
| `bloecke[].eintraege[].notiz` | `notiz` ist optional, ≤ 60; kleine Zeile unter dem Eintrag |
| `bloecke[].eintraege[].marke` | optional; ein `key` der Legende |
| `bloecke[].kopf` | Tabelle: Spaltenköpfe; die erste Spalte ist Text, die weiteren stehen rechtsbündig, wenn die Zelle eine Zahl ist |
| `bloecke[].zeilen` | Tabelle: ≤ 12 Zeilen, in beiden Bildern |
| `bloecke[].zeilen[].zellen` | `zellen`: so viele wie `kopf`; die erste Zelle ≤ 30 |
| `bloecke[].zeilen[].marke` | optional; ein `key` der Legende |
| `bloecke[].zeilen[].stark` | optional `true`: Zeile fett (Ausgangswert, Summe, Ergebnis) |
| `bloecke[].text` | Fliesstext (E26): Absätze als `string[]` — Budget: Konstante `PB_E26` in `scripts/check-v42.mjs`, vor dem Schreiben dort nachlesen |
| `bloecke[].wechsel` | Wechselrede (E26): Einträge `{ wer, text, marke? }` — Budget: Konstante `PB_E26` in `scripts/check-v42.mjs`, vor dem Schreiben dort nachlesen |

- **Je Block genau eine Blockart.** Der Renderer zeichnet eine Tabelle, sobald
  `kopf` oder `zeilen` steht, und ignoriert dann `eintraege`.
- **Markierungen sind Konturen, keine Farben.** Die Position in `legende`
  bestimmt das Zeichen: 1. voller, 2. leerer, 3. halb gefüllter Kreis. Jede
  `marke` ist ein `key` der Legende, sonst `ERR_V42_PRODUKTBILD`.
- **Beide Bilder haben denselben Aufbau:** gleiche Blocktitel, Legende,
  Spaltenköpfe und Blockarten. Nur der Fall ist ein anderer.
- **`text` und `wechsel` sind verwendbar** (ENTSCHEIDE E26): Renderer und
  `check-v42.mjs` kennen beide Blockarten; die Budgets stehen in der Konstante
  `PB_E26` (`klein` für das Beispielbild, `gross` für das Lösungsbild, je für
  zwei und drei Blöcke) — dort vor dem Schreiben nachlesen, nicht abschreiben.
- **Doppelprodukt** (etwa Tabelle + Gespräch): Das Bild zeigt den
  schriftlichen Träger im Hauptblock und das Gespräch als Wechselrede-Block,
  wenn der Platz reicht — sonst als Liste «Gesprächsnotiz». Gemischte Blätter
  (Text oder Wechselrede neben Tabelle oder Liste) sind nicht abgetastet:
  **immer mit `messen-v42` prüfen** (`references/phase-9-tor.md`).

### 5.2 Blockart aus dem Produkttyp herleiten

Ausgangspunkt sind `prinzip.herausforderungen.<A|B>.handlungsprodukt_typ`,
`handlungsprodukt.format` und die Schritte 01–04.

| Das Produkt ist … | Blockart | Das Bild zeigt |
|---|---|---|
| Karte, Übersicht, Plan, Checkliste, Plakat mit Stichworten | Liste (`eintraege`) | die Felder des Produkts als Blöcke, Einträge mit Markierung und Notiz |
| Budget, Vergleich, Zeitplan, Kosten- oder Entscheidungstabelle | Tabelle (`kopf` + `zeilen`) | Posten oder Optionen in Zeilen, Vorher/Nachher oder Kriterien in Spalten, Ergebniszeile `stark` |
| Brief, E-Mail, Statement, Kommentar, Stellungnahme, Leserbrief | Fliesstext (`text`) | den ganzen Text in Absätzen; Blöcke nach dem Aufbau der Textsorte |
| Gespräch, Diskussion, Interview, Rollenspiel | Wechselrede (`wechsel`) | einen Ausschnitt mit den Stellen, die die Kriterien verlangen (Argument, Rückfrage, Antwort auf einen Einwand) |
| Mischform: Tabelle mit Begründung, Plan mit Anschreiben | je Teil ein Block seiner Art | z. B. Tabelle + Fliesstext-Block für die Begründung |
| mündlicher Einzelbeitrag (Kurzvortrag, Sprachnachricht) | Liste für die Planung, bei Bedarf ein Fliesstext-Block für den Einstiegssatz | die Stationen des Beitrags mit Stichworten |

Faustregel: Der Block bildet ab, was auf dem Blatt der Lernenden stehen wird —
ganze Sätze: Fliesstext; zwei sprechen: Wechselrede; Zahlen in Spalten: Tabelle.
Mündliche und interaktive Produkte zeigen die Planung oder einen Ausschnitt.

### 5.3 Inhalt

Beispielbild:

1. Es zeigt die **Form vollständig**: jeden Teil, den die Schritte 01–04 und
   die `abgaben` verlangen — auch Legende, Entscheid, Begründung.
2. Der Fall kommt aus einem anderen Lebensbereich als Heft, Auftrag und KN,
   ohne Begriff des KN-Falls.
3. Zahlen sind erfundene Fallzahlen und **nachgerechnet** (jede Summe, jede
   Differenz), nicht geschätzt.
4. Fasst die enge Grenze nicht alle verlangten Einträge, zeigt es je Block die
   typischen.

Lösungsbild:

1. Es erfüllt alle `abgaben` und beide `feedback_kriterien` auf der höchsten
   Stufe (Wortlaut der Stufe lesen, nicht nur `indikator_produkt`).
2. Es stimmt mit den Lösungen von LF1–LF4 und mit `abschluss.loesung` überein:
   gleiche Begriffe, gleiche Zahlen (`situation_text`, `zahlen_tabelle`),
   gleicher Entscheid wie einer der Pole im `erwartungshorizont`.
3. `hinweis`: zwei bis drei Sätze für die Lehrperson. Nennt das Lösungsbild
   Posten oder Zahlen, die die Situation nicht nennt, kennzeichnet der
   `hinweis` sie als Annahme («Annahme: …»).

### 5.4 Vier Blöcke als Formbeispiele

Erfunden, je ein Block je Blockart; kein vollständiges Bild, keine Inhaltsvorlage.

```json
[
 { "titel": "Aufgaben am Quartierfest", "eintraege": [
   { "marke": "fest", "text": "Getränkestand → Ana und Luis", "notiz": "ab 16 Uhr, braucht Kühlbox" },
   { "marke": "offen", "text": "Abfall trennen → noch niemand" } ] },
 { "titel": "Probenplan (Minuten)", "kopf": ["Teil", "Plan", "neu"], "zeilen": [
   { "zellen": ["Aufbau", "20", "15"] }, { "zellen": ["Einspielen", "15", "15"] },
   { "zellen": ["Stück 1", "30", "25"], "marke": "offen" }, { "zellen": ["Stück 2", "30", "25"] },
   { "zellen": ["Pause", "10", "10"] }, { "zellen": ["Abbau", "15", "10"] },
   { "zellen": ["Total", "120", "100"], "stark": true } ] },
 { "titel": "Leserbrief: mein Anliegen", "text": [
   "Die Bibliothek schliesst um 17 Uhr. Wer eine Lehre macht, kommt nie rechtzeitig hin.",
   "Ich schlage einen Abend pro Woche bis 20 Uhr vor. Das kostet zwei Stunden Personal und bringt neue Nutzer." ] },
 { "titel": "Gespräch mit der Trainerin", "wechsel": [
   { "wer": "Ich", "text": "Am Dienstag schaffe ich es erst um halb sieben. Kann ich später einsteigen?" },
   { "wer": "Trainerin", "text": "Dann verpasst du das Aufwärmen. Wie stellst du dir das vor?" },
   { "wer": "Ich", "text": "Ich wärme mich selbst auf und bleibe dafür zum Abbau.", "marke": "fest" } ] }
]
```

### 5.5 `ERR_VORAUSSETZUNG_VOR_START` gilt auch für Bilder und Lösungen

`scripts/check-einheiten.mjs` geht **jeden** String des Hefts durch (Kern plus
je Spur), also auch `beispielbild`, `loesungsbild`, `abschluss.loesung` und
`bewertungsraster`. Trifft ein Muster aus `VORLAUF`, ist es ein Fehler, gleich
in welchem Feld: «vor der ersten Lektion» · «bringen Sie … mit» · «erfragen Sie
vorab / vorher / im Voraus» · «im Voraus» · «schon vorher / vorab». Die Regel
schützt den voraussetzungsfreien Start; das Skript unterscheidet nicht, ob der
Satz ein Auftrag ist oder im Brief eines Beispiels steht. In Beispielen und
Lösungen darum umformulieren («vor dem Termin» statt «im Voraus»). Die Liste
vor dem Schreiben im Skript nachlesen.

## 6. Selbstprüfung und Prüfbefehl

Vor dem Prüfbefehl, je Heft:

- [ ] `mindmap_zentrum` zeichengleich mit `prinzip.mindmap_zentrum_kurz` und dem anderen Heft
- [ ] vier Äste, Ast 4 wie in §1; Äste 1–3 je ≥ 1 Knoten; ≤ 5 je Ast, ≤ 10 im Ganzen, je ≤ 25 Zeichen
- [ ] jeder Knoten kommt in LF1–LF4 oder im Produkt vor; kein Begriff des KN-Falls
- [ ] Begriffsliste für Phase 7 notiert (Begriff, Heft, Herkunft, Fundstelle)
- [ ] zwei Quer-Check-Fragen aus der Situation; drei Mitnahme-Zeilen, die dritte «Mir noch unklar», ohne Wort über den Auftrag; Lösung je Frage und Zeile
- [ ] ≥ 5 Verbindungen, alle Enden zeichengenau Knoten oder Transfer-Titel, eine zum Transfer-Feld
- [ ] `eigene_knoten`: je vorhandener Spur zwei Begriffe aus deren Raster-Lösung
- [ ] Checkliste: vier Zeilen in fester Folge, zählbar, Zeile 3 deckt die `abgaben`; Übersicht: drei Teile, keine Zeitangabe
- [ ] beide Bilder vorhanden, gleicher Aufbau, jede `marke` ein `key` der Legende; Blockart aus dem Produkttyp begründet (ein Satz im Bericht)
- [ ] Beispiel: anderer Lebensbereich, Form vollständig, Zahlen nachgerechnet
- [ ] Lösung: `abgaben` erfüllt, höchste Stufe beider Kriterien, deckungsgleich mit LF1–LF4 und `abschluss.loesung`, `hinweis` gesetzt
- [ ] Zeichen gezählt, nicht geschätzt; kein Eszett; kein Satz aus Lehrmittel, Quelle oder Gold

Dann, nach jeder geänderten Datei:

```
node scripts/check-v42.mjs <ordner>
node scripts/check-einheiten.mjs <ordner>
```

Solange `set.json` fehlt, meldet `check-v42.mjs` die fehlende Datei
(`ERR_V42_DATEI`); die Glossar-Regel (`ERR_V42_GLOSSAR`) kann erst nach Phase 7
grün werden. Jeder andere Befund zu den Feldern dieser Phase — `ERR_V42_BUDGET`,
`ERR_V42_R7`, `ERR_V42_LOESUNG`, `ERR_V42_PRODUKTBILD` — wird sofort behoben.
