---
name: bbw-hko-heft-v42
description: "Standard-Generator für neue EFZ-Einheiten in bbw-hko (Format v4.2, Template heft_8page_v42): erzeugt aus einer nRLP-Kompetenz und dem Lehrmittelkapitel eine Einheit mit zwei Heften A/B (je acht Seiten, je in den Spuren ohne Medien und mit Medien), gemeinsamem Auftrag, Kompetenznachweis, Begleiter, Glossar mit Begriffsnetz, Beispielbild und Lösungen für alle Felder — und schreibt sie nach src/data/einheiten/{X.Y.Z}_{slug}/ (dazu Quellenkarten nach src/data/quellen/). Nutze diese Skill immer, wenn Pietro eine neue Einheit will: 'mach eine Einheit zu 2.1.2', 'neue Einheit für EFZ 3J/4J', 'Heft generieren', 'Einheit mit Medien-Spur', 'v4.2-Einheit', 'Bauplan für X.Y.Z', 'Einheit aus dem Bauplan erzeugen', 'Produktionslauf'. Auch bei allgemeinen oder englischen Aufträgen wie 'create the new HKO Einheit for X.Y.Z', 'neue HKO-Einheit erstellen' oder 'Lehrmittelkapitel X.Y → Lernsituationen für ABU Reform 2030': Ein Lehrmittelkapitel plus HKO/ABU ohne das Wort '3er-Set' heisst immer v4.2, also diese Skill. Arbeitet mit einem Bauplan (ein gebündelter Stopp zur Freigabe) und läuft danach ohne Rückfrage durch Erzeugung, Tor, Gegenlesen, Fakten-Audit und Abschluss bis zur Vorlage für die Freigabe — bei jedem Start gleich: einzelne Einheit, Schleife über alle Baupläne, Abschluss einer vorhandenen Einheit ('Einheit abschliessen', 'bis zur Freigabe bringen', 'Einheit freigeben'). NICHT für: das alte 3er-Set mit drei Herausforderungen A/B/C ('3er-Set', 'alte Methode', 'wie früher' → bbw-hko-3er-set), EBA-Einheiten (→ hko-2er-EBA-set-generator), die KI-Toolbox einer fertigen Einheit (→ hko-ki-komplement)."
---

# bbw-hko Heft v4.2 — Generator

Erzeugt eine Einheit im Format v4.2: **Prinzip + Heft A + Heft B (je zwei Spuren) +
gemeinsamer Auftrag + KN + Begleiter**, dazu Quellenkarten. Die Skill schreibt
Daten für einen fertigen Renderer. Sie ändert weder Format noch Layout, noch ein
Skript, noch eine bestehende Einheit.

Referenz für die Form ist die Gold-Einheit
`src/data/einheiten/1.3.1_konsum_verantworten_v42/`. **Form übernehmen, Inhalt
nie.** Kein Satz, kein Beispiel, keine Zahl der Gold-Einheit wandert in eine
andere Einheit.

## 0. Leitprinzip — einheitlich im Gerüst, frei in Modus, Kompetenz und Produkt

Jede Einheit hat **dasselbe Gerüst** (zwei Hefte mit acht Seiten, Kern und
Spuren, vier Leitfragen mit fester Funktion, Kriterien im Wortlaut des KN,
Begriffsnetz aus dem Glossar, gemeinsamer Auftrag, KN, Begleiter, Lösungen,
Benennung, Sprache). **Hergeleitet** wird je Einheit aus Lehrplan und Prinzip:
die **Sprachmodi** je Heft und des Auftrags (auch Interaktion, mündlich,
audiovisuell), die **Schlüsselkompetenzen** und ihre Verteilung, **Typ und
Format der Handlungsprodukte** — dazu Quellentyp, Rasterspalten, Pol-Typ,
Lebensbereiche, Sozialform.

Was fest ist und was woraus hergeleitet wird, steht Zeile für Zeile in
`references/kohaerenz.md`. Kein hergeleiteter Wert kommt aus der Gold-Einheit
oder aus einem Skelett. Eine Einheit, die wieder Karte, Budget,
Entscheidungsblatt und Sprachnachricht liefert, obwohl ihre Kompetenzen etwas
anderes verlangen, ist falsch — auch wenn das Tor grün ist.

## 1. Was gilt, wenn zwei Vorgaben sich widersprechen

1. `docs/upgrade-v4.2/ENTSCHEIDE.md` (E1 ff.)
2. die Skripte `scripts/check-v42.mjs`, `scripts/check-all.mjs`,
   `scripts/check-einheiten.mjs`, `scripts/check-lf-loesung.mjs` — was sie
   verlangen, gilt, auch gegen Prosa
3. `src/lib/einheiten/types.ts` (Feldnamen) und die Form der Gold-Einheit
4. diese Skill und ihre References
5. `docs/upgrade-v4.2/01_Leitfaden_v4.2.md` (Didaktik; an mehreren Stellen von
   E16–E19 überholt — siehe `references/datenvertrag.md`)

Die Templates unter `assets/` sind **Skelette**, keine Wahrheit: Steht im
Template etwas anderes als im Datenvertrag, gilt der Datenvertrag.

**Jede neue E-Nummer wird in derselben Session in die Skill eingearbeitet.**
ENTSCHEIDE bleibt oben. Aber «gilt vor dem Text der Skill, noch nicht
nachgeführt» ist kein zulässiger Zustand mehr: Wer einen Entscheid einträgt,
der eine Regel der Skill ändert, ändert im selben Zug `SKILL.md` und die
betroffenen References und nennt sie im Eintrag. Findet ein Lauf trotzdem
einen Widerspruch zwischen ENTSCHEIDE und Skill, gilt ENTSCHEIDE, und der
Widerspruch steht im Bericht unter «Offen» (Kürzel S).

**Ein Prompt trägt keine Regeln.** Er nennt, welcher Bauplan an der Reihe ist;
wie gearbeitet wird, steht hier. Steht in einem Prompt etwas anderes als in
der Skill, gilt die Skill.

(Herkunft: E30 stand vom 04. bis 07.10.2026 «noch nicht nachgeführt» in
ENTSCHEIDE, und ein Lauf ohne den Schleifen-Prompt arbeitete nach altem Stand —
Rückblick `docs/upgrade-v4.2/RUECKBLICK-produktion-2026-10-06.md` §3 Nr. 3;
ENTSCHEIDE E34.)

## 2. Dateien, die entstehen

```
src/data/einheiten/<ordner>/
  prinzip.json  kn.json  herausforderung_A.json  herausforderung_B.json
  set.json      begleiter.md
src/data/quellen/q-<n><a|b>-{pflicht,pflicht-ersatz,vertiefung-1,vertiefung-2}.json   (nur Medien-Spur)
src/data/methoden/<id>.json            (nur wenn eine neue Karte nötig ist — selten)
docs/cloud-run/bauplaene/<ordner>.md   (der Bauplan)
docs/cloud-run/laeufe/<JJJJ-MM-TT>-<ordner>[-<k>]/   (BERICHT.md, check-all.txt, messung.txt, fünf Protokolle *-check.txt)
D:\OS\_lab\quellen-archiv\bbw-hko\<quellen-id>\   (Volltexte — NIE im Repo)
D:\OS\_lab\quellen-archiv\bbw-hko\_pruefung\<ordner>\   (Beleg-Dateien der Audits: belege.json, fakten.json, fall.json, probe.json — NIE im Repo)
```

Der Laufordner trägt den vollen Ordnernamen; ein weiterer Lauf derselben
Einheit am selben Tag bekommt `-2`, `-3` (`<k>`). Den Namen nennt
`node scripts/check-namen.mjs --vor <ordner>` (`references/ableitungsregeln.md`
§10.1; ENTSCHEIDE E35).

Sonst wird nichts geschrieben. `src/data/einheiten.index.json` schreibt
`npm run build:einheiten-index`, nie die Skill von Hand.

## 3. Start und Betriebsarten

### Drei Starts, ein Ablauf

| Start | Auslöser | |
|---|---|---|
| **Einzelstart** | ein Satz im Gespräch: «Erzeuge mit der Skill die Einheit aus Bauplan `<ordner>`» — oder Lehrgang und Kompetenz, wenn es noch keinen Bauplan gibt | am Schluss Dev-Server und Stopp vor der Freigabe |
| **Schleife** | `docs/cloud-run/prompts/alle-bauplaene-seriell.md` — wählt den nächsten freigegebenen Bauplan | eine Einheit je Durchgang; kein Dev-Server, kein Warten |
| **Abschluss** | der Aufruf nennt einen vorhandenen Ordner mit `"entwurf"`, der bis zur Freigabe gebracht werden soll | beginnt beim Bestand, dann ab dem Tor |

Jeder Start führt **denselben Ablauf mit denselben Rollen** aus:
`references/lauf.md`. Lies sie, sobald ein freigegebener Bauplan vorliegt —
vor Phase 2 und bevor ein Subagent startet. Kein Start lässt die Messung in
der Schreibphase, das Fakten-Audit oder Phase 10 aus, und jeder endet mit
demselben Commit-Umfang (der Bauplan gehört dazu). (Herkunft: Rückblick §3
Nr. 3; ENTSCHEIDE E34.)

### Zwei Betriebsarten

| | **Mit Bauplan-Stopp** (lokal mit Pietro, es gibt noch keinen freigegebenen Bauplan) | **Auto** (der Bauplan ist freigegeben) |
|---|---|---|
| Auslöser | Pietro nennt Lehrgang und Kompetenz, es gibt keinen freigegebenen Bauplan | `docs/cloud-run/bauplaene/<ordner>.md` trägt «Freigabe: freigegeben am …», oder der Aufruf kommt aus `docs/cloud-run/RUN.md` |
| Stopp vor der Erzeugung | **genau einer**: der fertige Bauplan (mit Quellen und Fakten) wird vorgelegt; weiter erst auf «ok» oder Korrektur | **keiner** |
| Quellensuche (Phase Q) | ja, lokal mit Netz | nein — es gilt, was der Bauplan in §7 nennt und was als Karte **und** Archivtext vorliegt |
| fehlt etwas | nachfragen ist erlaubt, aber nur gebündelt im Bauplan-Stopp | Regel aus `references/auto-modus.md`; Entscheid in den Bericht |
| Stopp vor der Freigabe (Phase 10) | ja | Einzelstart und Abschluss: ja · Schleife: die Vorlage steht im Bericht, es wird nicht gewartet |

Nach der Freigabe des Bauplans gilt immer der Auto-Modus, auch wenn Pietro im
Gespräch ist. Ausserhalb der zwei Stopps — Bauplan und Freigabe — wird nie
gefragt. Was früher ein Stopp war
(Versprechen wählen, Herausforderungen wählen, Hybrid-Fall freigeben,
`knoten_ref` über drei Seiten, Sekundär-Kompetenzen), ist ein Abschnitt des
Bauplans mit **einer** empfohlenen Variante und höchstens zwei genannten
Alternativen.

**Eingabe, bevor irgendetwas beginnt:** Lehrgang (`EFZ_3J` oder `EFZ_4J`) und
Kompetenznummer. Fehlt der Lehrgang, ist das die einzige Rückfrage vor Phase 0
— eine Nummer `X.Y.Z` bedeutet in 3J und 4J nicht dasselbe.

## 4. Phasen

Jede Phase hat eine Reference. **Lies die Reference der Phase, bevor du sie
ausführst, und `references/datenvertrag.md` vor der ersten Datei.** Die
Reihenfolge ist eine Abhängigkeitsfolge und wird nicht umgestellt.

| # | Phase | Ergebnis | Reference | Skelett |
|---|---|---|---|---|
| 0 | **Verortung** | Kompetenz, Lebensbezug, Kapitel am Text geprüft, zulässige Spuren je Heft, Ordnername und IDs | `references/phase-0-verortung.md` | — |
| 1 | **Bauplan** | `docs/cloud-run/bauplaene/<ordner>.md`, alle Entscheide mit Empfehlung; §10 «Fakten»: jede Rechts- und Sachaussage mit Primärquelle | `references/phase-1-bauplan.md` | `docs/cloud-run/bauplaene/_VORLAGE.md` |
| Q | **Quellen** (nur lokal, nur für Hefte mit Medien-Spur) | Karten in `src/data/quellen/`, Volltexte im Archiv, Bauplan §7 gefüllt | `references/phase-q-quellen.md` | `assets/quelle-template.json` |
| — | **STOPP: Freigabe des Bauplans** (entfällt im Auto-Modus) | | | |
| 2 | **Prinzip** | `prinzip.json` | `references/phase-2-3-prinzip-kn.md` | `assets/prinzip-template.json` |
| 3 | **KN** | `kn.json` — vor den Heften, weil `rubrik_shared` die Feedback-Kriterien liefert | `references/phase-2-3-prinzip-kn.md` | `assets/kn-template.json` |
| 4 | **Heft-Kern** je Heft | Situation, LF1, LF2 mit Lösung, Produkt, Schritte, Kriterien, Methoden | `references/phase-4-heft-kern.md` | `assets/herausforderung-template.json` |
| 5 | **Spuren** je Heft | LF3 und LF4 je Spur **mit** Lösung an der Quelle, Kasten S. 4, Quellenbindung | `references/phase-5-spuren.md` | (im Heft-Skelett) |
| 6 | **Abschluss und Bilder** je Heft | Begriffsnetz, Abschluss mit Lösung, Checkliste, Übersicht, Beispielbild, Lösungsbild | `references/phase-6-abschluss.md` | (im Heft-Skelett) |
| 7 | **Set** | `set.json`: Glossar, gemeinsamer Auftrag mit `heft_bezug`, Wochenplan, `status: "entwurf"` | `references/phase-7-set.md` | `assets/set-template.json` |
| 8 | **Begleiter** | `begleiter.md`; die Marker füllt `scripts/begleiter-marker.mjs` der Skill, nie die Hand | `references/phase-8-begleiter.md` | `assets/begleiter-template.md` |
| 9 | **Tor und Bericht** | Tor im ersten Durchgang grün, Messung aller Dokumente ohne Überlauf; danach Gegenleser und die drei Audits — Lösungs-Audit (blind, `belege.json`), Fakten-Audit (`fakten.json`), Lösbarkeitsprobe (`probe.json`); Bericht begonnen | `references/phase-9-tor.md`, `references/gegenleser.md`, `references/audits.md` | `assets/bericht-template.md` |
| 10 | **Abschluss vor der Freigabe** | offene Befunde abgearbeitet, Fakten-Audit abgeschlossen, Zahlen geprüft, erneut gelesen und erneut auditiert nach der letzten Änderung, Tor im zweiten Durchgang GRUEN (mit Belegen, Fakten, Probe), Gegenhör-Liste für Pietro erzeugt, **ein Commit** — dann **STOPP: Vorlage zur Freigabe**; freigegeben wird nur auf Pietros «ok» | `references/phase-10-abschluss.md` | (im Bericht-Gerüst) |

Querschnitt, für jede Phase: `references/kohaerenz.md` (fest gegen hergeleitet,
Abdeckungstabelle, Vergleich mit Gold), `references/datenvertrag.md` (jedes
Feld, Budget, Regel), `references/sprache.md` (Anrede, Umlaute, Fall-Begriffe),
`references/nrlp-lehrmittel-crosswalk.md`, `references/sprachmodus-ids.md`,
`references/ableitungsregeln.md` (Ordner, IDs, Kurzlink, Quellen-IDs — E21),
`references/auto-modus.md` (Regel für jeden früheren Stopp, Verhalten bei
fehlender Voraussetzung — E23), `references/lauf.md` (Start, Rollen und
Modelle, Vorprüfung, Reihenfolge, Messung, Abbruch, Commit — E34),
`references/karten.md` (Methoden- und Quellenkarten: ändern oder neu anlegen,
`scripts/karten.mjs`, Vermerk — E36), `references/belege.md` (Beleg-Dateien
ausserhalb des Repos: Ort, Form, Lösungsfelder und Hash, die Skripte, die sie
prüfen — E38), `references/audits.md` (Lösungs-Audit, Fakten-Audit,
Lösbarkeitsprobe als Auftragsvorlagen; `scripts/audit-paket.mjs` — E38).

### Wer was tut

Ab Phase 2 arbeitet die Skill mit Rollen; vollständig in
`references/lauf.md` §2–§5. In Kürze:

| Rolle | Modell | Aufgabe |
|---|---|---|
| Orchestrator | Opus | Vorprüfung, Phasen 2–3, eine vom Bauplan verlangte neue Methodenkarte, alle Aufträge, Index, Marker-Skript nach Phase 8, Tor, Bericht, Commit — nur er |
| Executor A ∥ Executor B | Opus | je ein Heft (Phasen 4–6), gleichzeitig; **jeder misst sein Heft selbst, bevor er abgibt**, und schreibt die erfundenen Fallzahlen seines Hefts als `fall.<A\|B>.json` |
| Executor Set → Executor Begleiter | Opus | Phase 7 (mit `fall.auftrag.json`), dann Phase 8, nacheinander; der Executor Begleiter füllt am Ende einmal die Marker mit dem Skript |
| Gegenleser | Sonnet | Lernende, Bogen-Leser, Sweep — alle gleichzeitig, nur lesend; die Lernenden geben ihr Produkt als Datei ab |
| Lösungs-Audit | Opus | je Heft und Spur und für den Auftrag: **blind lösen, dann vergleichen**, Ergebnis `belege.json` (`references/audits.md` §2) |
| Fakten-Audit | Opus, mit Netz | jede Rechts- und Sachaussage an Gesetz und Amt, Ergebnis `fakten.json` (`references/audits.md` §3) |
| Lösbarkeitsprobe | Sonnet | bewertet das Produkt eines Lernenden-Gegenlesers mit Kriterien und Lösungsbild, Ergebnis `probe.json` (`references/audits.md` §4) |

Die Audits beginnen nach dem ersten grünen Tor; jede Änderung einer Lösung
macht ihre Belegzeile ungültig (Hash), und nur dieses Feld wird neu geprüft.
Die Beleg-Dateien liegen ausserhalb des Repos; im Repo liegt nur das Protokoll
der Prüfskripte. (Herkunft: Rückblick §5.1–§5.3; ENTSCHEIDE E38.)

Eine Session je Arbeitsbaum, eine Einheit je Session-Durchgang, kein
`git worktree`, kein `npm ci`, kein Branchwechsel.

### Prüfen während des Schreibens

Budgets gelten hart: `.a4-page` schneidet still ab. Darum nach **jeder**
geschriebenen oder geänderten Datei ab Phase 4:

```
node scripts/check-v42.mjs <ordner>
```

Solange Dateien und spätere Phasen noch fehlen, meldet das Skript dafür
Befunde, die erwartet sind (`ERR_V42_DATEI`, und bis Phase 6 bzw. 7 die
Regeln zu Spuren, Begriffsnetz, Produktbild, Lösungen und Glossar — die Liste
steht in `references/phase-4-heft-kern.md`). Jeder Befund zu einem Feld, das
die laufende Phase schon geschrieben hat, wird sofort behoben, nicht gesammelt.
Bis `set.json` steht, zählt bei `check-einheiten` die Befundliste, nicht der
Exit-Code. Zeichen zählen, nicht schätzen.

**Zeichenbudget ist nicht Seitenhöhe.** In 11 von 13 Läufen lief eine Seite
über, obwohl `check-all` grün war. Darum misst jeder Executor sein Heft und
sein Dokument «Lösungen» selbst, bevor er abgibt, in einem eigenen
Temp-Ordner:

```
node scripts/export-v42.mjs <ordner> --out <eigener-temp-ordner>
node scripts/messen-v42.mjs <eigener-temp-ordner>
```

Einzelheiten und der Weg, wenn der Export nicht läuft:
`references/lauf.md` §6. (Herkunft: Rückblick §4 Zeile 1, §5.2.)

## 5. Regeln, die in jeder Phase gelten

1. **Kein Push, kein Deploy, kein Merge nach `main`.** Kein `status`-Wechsel.
   `set.json` trägt exakt `"status": "entwurf"` — bis zum Freigabeschritt
   (`references/phase-10-abschluss.md` §8), und der läuft nur auf Pietros
   ausdrückliches «ok» (E32).
2. **Das Repo ist öffentlich.** Kein Lehrmitteltext, kein Transkript, kein
   Artikeltext in irgendeiner Datei des Repos — auch nicht im Bauplan, im
   Bericht oder als Beispiel. Eigene Formulierung plus Kapitel und Seite als
   Verweis. Volltexte liegen nur im Archiv ausserhalb des Repos.
3. **Nur belegte Aussagen.** Fachaussagen, Zahlen, Seiten und Rechtsstände nur
   aus dem Lehrmittelkapitel (`material/_lehrmittel/`), dem nRLP-Datensatz des
   Lehrgangs und dem Archivtext einer Quelle, deren Karte vorliegt. Nichts aus
   dem Gedächtnis. Was sich nicht belegen lässt, entfällt und steht im Bericht.
   **Rechts- und Sachaussagen über die Welt** (Artikelnummer, Frist, Betrag,
   Datum, «Stand …») brauchen zusätzlich eine Primärquelle — Gesetz oder Amt —
   mit URL und Abrufdatum: vor dem Schreiben im Bauplan §10, nach dem Schreiben
   im Fakten-Audit (Phase 10). Die Erzeugung zitiert nur aus §10 (Rückblick
   §4, §5.2). Übergang: Trägt ein Bauplan keinen §10 (freigegeben vor dem
   07.10.2026), wird nur aus Lehrmittel, Datensatz und Archivtext geschrieben,
   und das Fakten-Audit beginnt bei null (`references/lauf.md` §3).
   Zahlen einer Situation (Lohn, Preis) sind erfundene Fallzahlen und als
   solche erlaubt; Zahlen über die Welt nicht.
4. **Keine erfundene Quelle.** Medien-Spur nur mit Karte **und** Volltext im
   Archiv. Fehlt eines: nur `ohne_medien` für dieses Heft, Meldung im Bericht.
5. **Lösung mit der Frage.** Jede Leitfrage, jede Rasterzeile, jeder Befund und
   jede Vertiefung bekommt ihre Lösung in derselben Phase, mit Fundstelle
   (Seite, Absatz, Zeitmarke). Lässt sich kein Erwartungshorizont mit
   Fundstelle schreiben, ist die Frage falsch gestellt und wird umformuliert.
   Was eine Lösung selbst folgert — was weder in der Quelle noch im Lehrmittel
   steht —, kennzeichnet sie im selben Feld als Fallüberlegung oder Deutung
   (Wortliste: `references/sprache.md` §7.4); das Lösungs-Audit und
   `check-belege` prüfen es (Rückblick §4, §5.3 Nr. 4; E38).
6. **Quelle vor Frage.** LF3, LF4 und die Vertiefungsfragen der Medien-Spur
   werden erst formuliert, wenn die Quelle gewählt und gelesen ist; LF3 ohne
   Medien erst, wenn am Kapiteltext geprüft ist, was auf den Seiten steht.
7. **Kern einmal, Spuren nur das Abweichende.** Situation, LF1, LF2, Produkt,
   Kriterien, Begriffsnetz und Abschluss stehen genau einmal. `spuren.*` trägt
   LF3, LF4, `quellen`, `kasten_s4`, `methoden_ref_rezeption`, `scaffold_90`.
   Der Kern darf nichts voraussetzen, was nur eine Spur liefert.
7a. **Herleiten und Abdeckung prüfen.** Jede Phase, die Sprachmodi, SK oder ein
   Produkt festlegt, nennt die Herleitung und füllt ihre Zeile der
   Abdeckungstabelle (`references/kohaerenz.md` §3). Der gemeinsame Auftrag
   trägt immer `produkte` (zwei Einträge, Form `flaeche` oder `spur` —
   ENTSCHEIDE E25); das Produktbild nimmt die Blockart, die zum Produkttyp
   passt: Liste, Tabelle, Fliesstext oder Wechselrede (E26).
8. **KN-Wortlaut.** `feedback_kriterien` (Hefte: je 2 = 1 SuK + 1 Ges; Auftrag:
   alle 4) tragen Name, Dimension und die vier Stufen zeichengenau aus
   `kn.rubrik_shared`. Eigener Text ist nur `indikator_produkt`.
9. **Der Fall des KN bleibt dem KN.** Gegenstand, Beteiligte und Lebensbereich
   der Hybrid-Situation kommen in keinem Heft, keiner Quelle (im genannten
   Ausschnitt), im Auftrag und im Glossar vor. Lebensbereiche von A, B,
   Auftrag und KN sind paarweise verschieden.
10. **Unumkehrbares nach Regel.** Ordnername, IDs, Kurzlink und Quellen-IDs
    nach `references/ableitungsregeln.md` — ableiten, nicht fragen, nie eine
    vorhandene Einheit oder bestehende Karte überschreiben (an einer eigenen
    Quellenkarte sind einzelne Felder korrigierbar: `references/lauf.md` §10).
11. **Sprache.** Schweizer Hochdeutsch, kein «ß», echte Umlaute. Situationen in
    Ich-Form, Aufträge an Lernende in Sie-Form, Begleiter in Du-Form, neutrale
    Persona (wörtlich wie im Skelett). Im Heft keine Woche, keine Lektion,
    keine Unterrichtszeit in Minuten (die Dauer eines Produkts — «Statement
    von zwei Minuten» — ist erlaubt), kein Wort «Spur», «Pflichtquelle»
    heisst «Quelle»; auf dem
    Auftragsbogen keine Vorgabe an die Lehrperson. Einzelheiten:
    `references/sprache.md`.
12. **Scope.** Nicht anfassen: `src/lib/`, `src/components/`, `src/styles/`,
    `src/pages/`, `scripts/`, jede bestehende Einheit, bestehende Methoden- und
    Quellenkarten (eigen ist nur die Quellenkarte, die allein diese noch nicht
    publizierte Einheit führt — `references/lauf.md` §10), andere Skills, `public/`, `supabase/`, `CLAUDE.md`. Zeigt
    sich ein Fehler in Renderer oder Skript: nicht reparieren, nicht umgehen
    (`--baseline` ist verboten) — in den Bericht, Einheit als nicht erzeugbar
    melden, wenn das Tor sonst nicht grün wird.
    **Karten — ändern oder neu:** Vor jeder Änderung an einer Methoden- oder
    Quellenkarte läuft `node scripts/karten.mjs darf <karten-id>`; Entscheid
    und Fall stehen im Bericht. Eine Karte, die eine publizierte oder
    archivierte Einheit führt, ändert gedruckte Hefte: Passt sie nicht,
    überschreibt die Einheit oder bekommt eine neue Karte; ein Fehler in der
    Karte wird nur mit Vermerk behoben — und nie im Auto-Modus, dort geht er
    in den Bericht («Offen», Kürzel S). Regel, Vermerk und Befehle:
    `references/karten.md` (ENTSCHEIDE E31 Nr. 3, E36). Das Tor prüft es mit
    (`check-all`, Zeile «Karten»).

## 6. Wenn eine Voraussetzung fehlt

Kurzfassung; vollständig in `references/auto-modus.md`.

| Es fehlt | Die Skill |
|---|---|
| Kapiteldatei unter `material/_lehrmittel/` | schreibt nichts, meldet «nicht erzeugbar» |
| Karte oder Archivtext für die Quelle eines Hefts | nur `ohne_medien` für dieses Heft |
| `ohne_medien` ist unzulässig (Kompetenz des Hefts verlangt Rezeption mündlich oder audiovisuell) **und** die Quelle fehlt | lokal: Phase Q zuerst; Auto: «nicht erzeugbar» |
| Transkript eines Audio- oder Videobeitrags | nicht als Quelle mit Raster verwendbar |
| Tor nach drei Reparaturrunden rot | Ordner und neue Karten nach `docs/cloud-run/laeufe/…/abgebrochen/` verschieben, nicht löschen (`references/lauf.md` §7); Grund in den Bericht |

## 7. Fertig ist die Einheit, wenn

1. `references/phase-9-tor.md` durchgelaufen ist: `check-all` im zweiten
   Durchgang GRUEN — darin `check-belege` (jedes Lösungsfeld mit gültiger
   Belegzeile, kein offener Befund der Lösbarkeitsprobe) und `check-fakten`
   (jede Aussage über die Welt belegt) —, Export und
   Messung ohne Überlauf (bis 2 px auf Seite 6 hingenommen und gemeldet — E28),
   Bestand unverändert, Build Exit 0, Gegenleser nach der
   letzten Änderung. Bleibt nach drei Reparaturrunden nur ein Überlauf über
   2 px, ist das kein Abbruch: Die Einheit bleibt `"entwurf"`, der Punkt steht
   unter «Offen» (Kürzel E), und die Vorlage sagt «freigabereif: nein»
   (`references/phase-9-tor.md` §2);
2. `references/phase-10-abschluss.md` Schritte 1 bis 6 durchgelaufen sind:
   offene Befunde abgearbeitet, Fakten-Audit abgeschlossen, Zahlen geprüft,
   erneut gelesen und erneut auditiert, Tor und Messung nach der letzten
   Änderung, Gegenhör-Liste (`scripts/gegenhoeren.mjs`);
3. der Bericht im Laufordner liegt (`assets/bericht-template.md`) und nennt:
   Ordner, Tor-Ausgabe, Kapitel und Seiten, jede Quelle mit Prüfdatum, alle
   Entscheide, die sonst ein Mensch getroffen hätte, den Stand der drei Audits
   mit jeder Zeile, die nicht «stimmt» bzw. «belegt» heisst, und
   unter «Offen» alles, was nicht belegt, nicht geprüft oder nicht entschieden
   ist;
4. **ein Commit** «Einheit `<ordner>` (bbw-hko-heft-v42)» steht, mit Einheit,
   Quellenkarten, neuer Methodenkarte (falls Bauplan §9 sie verlangt hat),
   **Bauplan**, Laufordner und den zwei Index-Dateien — nach
   `node scripts/check-leck.mjs --staged` ohne Fehler und ohne Warnung
   (`references/lauf.md` §8). Kein Push.

Fertig heisst nicht freigegeben: Die Einheit bleibt `"entwurf"`, bis Pietro
auf die Vorlage zur Freigabe «ok» sagt (`references/phase-10-abschluss.md`
§7–§8).
