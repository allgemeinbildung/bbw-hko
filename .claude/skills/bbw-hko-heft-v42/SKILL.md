---
name: bbw-hko-heft-v42
description: "Standard-Generator für neue EFZ-Einheiten in bbw-hko (Format v4.2, Template heft_8page_v42): erzeugt aus einer nRLP-Kompetenz und dem Lehrmittelkapitel eine Einheit mit zwei Heften A/B (je acht Seiten, je in den Spuren ohne Medien und mit Medien), gemeinsamem Auftrag, Kompetenznachweis, Begleiter, Glossar mit Begriffsnetz, Beispielbild und Lösungen für alle Felder — und schreibt sie nach src/data/einheiten/{X.Y.Z}_{slug}/ (dazu Quellenkarten nach src/data/quellen/). Nutze diese Skill immer, wenn Pietro eine neue Einheit will: 'mach eine Einheit zu 2.1.2', 'neue Einheit für EFZ 3J/4J', 'Heft generieren', 'Einheit mit Medien-Spur', 'v4.2-Einheit', 'Bauplan für X.Y.Z', 'Einheit aus dem Bauplan erzeugen', 'Produktionslauf'. Auch bei allgemeinen oder englischen Aufträgen wie 'create the new HKO Einheit for X.Y.Z', 'neue HKO-Einheit erstellen' oder 'Lehrmittelkapitel X.Y → Lernsituationen für ABU Reform 2030': Ein Lehrmittelkapitel plus HKO/ABU ohne das Wort '3er-Set' heisst immer v4.2, also diese Skill. Arbeitet mit einem Bauplan (ein gebündelter Stopp zur Freigabe) und läuft danach ohne Rückfrage bis zum grünen Tor. NICHT für: das alte 3er-Set mit drei Herausforderungen A/B/C ('3er-Set', 'alte Methode', 'wie früher' → bbw-hko-3er-set), EBA-Einheiten (→ hko-2er-EBA-set-generator), die KI-Toolbox einer fertigen Einheit (→ hko-ki-komplement)."
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

## 2. Dateien, die entstehen

```
src/data/einheiten/<ordner>/
  prinzip.json  kn.json  herausforderung_A.json  herausforderung_B.json
  set.json      begleiter.md
src/data/quellen/q-<n><a|b>-{pflicht,pflicht-ersatz,vertiefung-1,vertiefung-2}.json   (nur Medien-Spur)
src/data/methoden/<id>.json            (nur wenn eine neue Karte nötig ist — selten)
docs/cloud-run/bauplaene/<ordner>.md   (der Bauplan)
D:\OS\_lab\quellen-archiv\bbw-hko\<quellen-id>\   (Volltexte — NIE im Repo)
```

Sonst wird nichts geschrieben. `src/data/einheiten.index.json` schreibt
`npm run build:einheiten-index`, nie die Skill von Hand.

## 3. Zwei Betriebsarten

| | **Mit Bauplan-Stopp** (Standard, lokal mit Pietro) | **Auto** (unbeaufsichtigt) |
|---|---|---|
| Auslöser | Pietro nennt Lehrgang und Kompetenz, es gibt keinen freigegebenen Bauplan | `docs/cloud-run/bauplaene/<ordner>.md` trägt «Freigabe: freigegeben am …», oder der Aufruf kommt aus `docs/cloud-run/RUN.md` |
| Stopps | **genau einer**: der fertige Bauplan (mit Quellen) wird vorgelegt; weiter erst auf «ok» oder Korrektur | **keiner** |
| Quellensuche (Phase Q) | ja, lokal mit Netz | nein — es gilt, was der Bauplan in §7 nennt und was als Karte **und** Archivtext vorliegt |
| fehlt etwas | nachfragen ist erlaubt, aber nur gebündelt im Bauplan-Stopp | Regel aus `references/auto-modus.md`; Entscheid in den Bericht |

Ausserhalb des einen Stopps wird nie gefragt. Was früher ein Stopp war
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
| 1 | **Bauplan** | `docs/cloud-run/bauplaene/<ordner>.md`, alle Entscheide mit Empfehlung | `references/phase-1-bauplan.md` | `docs/cloud-run/bauplaene/_VORLAGE.md` |
| Q | **Quellen** (nur lokal, nur für Hefte mit Medien-Spur) | Karten in `src/data/quellen/`, Volltexte im Archiv, Bauplan §7 gefüllt | `references/phase-q-quellen.md` | `assets/quelle-template.json` |
| — | **STOPP: Freigabe des Bauplans** (entfällt im Auto-Modus) | | | |
| 2 | **Prinzip** | `prinzip.json` | `references/phase-2-3-prinzip-kn.md` | `assets/prinzip-template.json` |
| 3 | **KN** | `kn.json` — vor den Heften, weil `rubrik_shared` die Feedback-Kriterien liefert | `references/phase-2-3-prinzip-kn.md` | `assets/kn-template.json` |
| 4 | **Heft-Kern** A, dann B | Situation, LF1, LF2 mit Lösung, Produkt, Schritte, Kriterien, Methoden | `references/phase-4-heft-kern.md` | `assets/herausforderung-template.json` |
| 5 | **Spuren** je Heft | LF3 und LF4 je Spur **mit** Lösung an der Quelle, Kasten S. 4, Quellenbindung | `references/phase-5-spuren.md` | (im Heft-Skelett) |
| 6 | **Abschluss und Bilder** je Heft | Begriffsnetz, Abschluss mit Lösung, Checkliste, Übersicht, Beispielbild, Lösungsbild | `references/phase-6-abschluss.md` | (im Heft-Skelett) |
| 7 | **Set** | `set.json`: Glossar, gemeinsamer Auftrag mit `heft_bezug`, Wochenplan, `status: "entwurf"` | `references/phase-7-set.md` | `assets/set-template.json` |
| 8 | **Begleiter** | `begleiter.md`; die Marker füllt `scripts/begleiter-marker.mjs` der Skill, nie die Hand | `references/phase-8-begleiter.md` | `assets/begleiter-template.md` |
| 9 | **Tor und Bericht** | alle Gates grün, Bericht | `references/phase-9-tor.md` | — |

Querschnitt, für jede Phase: `references/kohaerenz.md` (fest gegen hergeleitet,
Abdeckungstabelle, Vergleich mit Gold), `references/datenvertrag.md` (jedes
Feld, Budget, Regel), `references/sprache.md` (Anrede, Umlaute, gesperrte Wörter),
`references/nrlp-lehrmittel-crosswalk.md`, `references/sprachmodus-ids.md`,
`references/ableitungsregeln.md` (Ordner, IDs, Kurzlink, Quellen-IDs — E21),
`references/auto-modus.md` (Regel für jeden früheren Stopp, Verhalten bei
fehlender Voraussetzung — E23).

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

## 5. Regeln, die in jeder Phase gelten

1. **Kein Push, kein Deploy, kein Merge nach `main`.** Kein `status`-Wechsel.
   `set.json` trägt exakt `"status": "entwurf"`.
2. **Das Repo ist öffentlich.** Kein Lehrmitteltext, kein Transkript, kein
   Artikeltext in irgendeiner Datei des Repos — auch nicht im Bauplan, im
   Bericht oder als Beispiel. Eigene Formulierung plus Kapitel und Seite als
   Verweis. Volltexte liegen nur im Archiv ausserhalb des Repos.
3. **Nur belegte Aussagen.** Fachaussagen, Zahlen, Seiten und Rechtsstände nur
   aus dem Lehrmittelkapitel (`material/_lehrmittel/`), dem nRLP-Datensatz des
   Lehrgangs und dem Archivtext einer Quelle, deren Karte vorliegt. Nichts aus
   dem Gedächtnis. Was sich nicht belegen lässt, entfällt und steht im Bericht.
   Zahlen einer Situation (Lohn, Preis) sind erfundene Fallzahlen und als
   solche erlaubt; Zahlen über die Welt nicht.
4. **Keine erfundene Quelle.** Medien-Spur nur mit Karte **und** Volltext im
   Archiv. Fehlt eines: nur `ohne_medien` für dieses Heft, Meldung im Bericht.
5. **Lösung mit der Frage.** Jede Leitfrage, jede Rasterzeile, jeder Befund und
   jede Vertiefung bekommt ihre Lösung in derselben Phase, mit Fundstelle
   (Seite, Absatz, Zeitmarke). Lässt sich kein Erwartungshorizont mit
   Fundstelle schreiben, ist die Frage falsch gestellt und wird umformuliert.
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
    vorhandene Einheit oder Karte überschreiben.
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
    Quellenkarten, andere Skills, `public/`, `supabase/`, `CLAUDE.md`. Zeigt
    sich ein Fehler in Renderer oder Skript: nicht reparieren, nicht umgehen
    (`--baseline` ist verboten) — in den Bericht, Einheit als nicht erzeugbar
    melden, wenn das Tor sonst nicht grün wird.

## 6. Wenn eine Voraussetzung fehlt

Kurzfassung; vollständig in `references/auto-modus.md`.

| Es fehlt | Die Skill |
|---|---|
| Kapiteldatei unter `material/_lehrmittel/` | schreibt nichts, meldet «nicht erzeugbar» |
| Karte oder Archivtext für die Quelle eines Hefts | nur `ohne_medien` für dieses Heft |
| `ohne_medien` ist unzulässig (Kompetenz des Hefts verlangt Rezeption mündlich oder audiovisuell) **und** die Quelle fehlt | lokal: Phase Q zuerst; Auto: «nicht erzeugbar» |
| Transkript eines Audio- oder Videobeitrags | nicht als Quelle mit Raster verwendbar |
| Gegenstand braucht eines der Wörter Leasing, Konsumkredit, Kleinkredit, E-Bike, Mobilität | «nicht erzeugbar», bis `check-v42.mjs` korrigiert ist (ENTSCHEIDE E24) |
| Tor nach drei Reparaturrunden rot | Ordner und neue Karten entfernen, Grund in den Bericht |

## 7. Fertig ist die Einheit, wenn

`references/phase-9-tor.md` durchgelaufen ist: `check-all` GRUEN, Export und
Messung ohne Überlauf, Bestand unverändert, Build Exit 0 — und der Bericht
nennt: Ordner, Tor-Ausgabe, Kapitel und Seiten, jede Quelle mit Prüfdatum, alle
Entscheide, die sonst ein Mensch getroffen hätte, und alles, was nicht belegt
oder nicht geprüft ist. **Kein Commit, ausser der Aufruf verlangt ihn.**
