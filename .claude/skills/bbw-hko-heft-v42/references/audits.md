# Audits — drei Rollen, die eine Datei abgeben

Das Tor prüft Form, die Lernenden-Gegenleser finden Bearbeitbarkeit. Ob stimmt,
was in einer Lösung steht, ob eine Rechtsaussage stimmt und ob sich das Produkt
mit den Kriterien überhaupt auf die höchste Stufe bringen lässt, prüfen drei
Rollen. Jede gibt **eine Datei** ab, die ein Skript prüft — keinen Bericht.

| Rolle | Modell | Je | Gibt ab | Prüft danach |
|---|---|---|---|---|
| **Lösungs-Audit** (Abschnitt 2) | Opus | Heft und Spur, dazu der Auftrag | `belege.<heft>.<spur>.json` → `belege.json` | `check-belege` |
| **Fakten-Audit** (Abschnitt 3) | Opus, mit Netz | Einheit | `fakten.json` | `check-fakten` |
| **Lösbarkeitsprobe** (Abschnitt 4) | Sonnet | Produkt eines Lernenden-Gegenlesers | `probe.<heft>.<spur>.json` → `probe.json` | `check-belege` (liest `probe.json` mit) |

Herkunft: Rückblick `docs/upgrade-v4.2/RUECKBLICK-produktion-2026-10-06.md` §4
(wo die Fehler durchgingen), §5.1 (Belege als Daten), §5.2 (Fehlerart → Lösung),
§5.3 (Lösungs-Audit, neu); Auftrag 10
(`docs/cloud-run/prompts/sofort/10-belege-und-pruefskripte.md`, Stufe C);
ENTSCHEIDE E38. Form jeder Datei: `references/belege.md`. Wann die Rollen im
Lauf stehen: `references/lauf.md` §2, §4, §5. Kürzel in eckigen Klammern (Rb,
P-1a, B `<lauf>`, E-Nummern) wie in `references/lauf.md`.

Die Abschnitte 2 bis 4 sind **Auftragsvorlagen**: Der Orchestrator ersetzt die
Platzhalter und gibt den Text unter «Auftrag» fast wörtlich an einen Subagenten.
Die Vorlage genügt allein — der Subagent liest diese Skill nicht.

## 1. Was für alle drei gilt

### 1.1 Platzhalter

| Platzhalter | Bedeutung |
|---|---|
| `<ordner>` | Ordnername der Einheit, etwa `3.3.1_kaufvertrag_beurteilen` |
| `<heft>` | `A`, `B` oder `auftrag` |
| `<spur>` | `ohne_medien` oder `mit_medien`; beim Auftrag `beide` |
| `<teil>` | `<heft>.<spur>` — Name des Pakets und der Teildatei: `A.mit_medien`, `auftrag.beide` |
| `<wurzel>` | Wurzel des Baums, in dem die Einheit liegt: dieses Repo oder eine Temp-Kopie eines Altstands (mit `src/data/einheiten/`, `src/data/quellen/`, `src/data/methoden/`, `public/nrlp_*.json`) |
| `<archiv>` | das Quellenarchiv: lokal `D:\OS\_lab\quellen-archiv\bbw-hko`, bei einer Gegenprobe eine Kopie mit den Ordnern `q-…` der Einheit |
| `<pruef>` | `<archiv>/_pruefung/<ordner>` — dorthin schreibt jede Rolle ihre Datei |
| `<tmp>` | ein Ordner je Lauf **ausserhalb jedes Repos** (unter `%TEMP%`) |
| `<modell>` | das Modell, das den Auftrag ausführt — steht in jeder Zeile unter `von.modell` |

Jeder Befehl läuft im Repo (`D:\OS\dev\bbw-hko`) und wirkt auf `<wurzel>` und
`<archiv>`:

```
PowerShell:  $env:QUELLEN_ARCHIV = '<archiv>'; node scripts/<skript>.mjs <ordner> … --wurzel "<wurzel>"
Bash:        QUELLEN_ARCHIV='<archiv>' node scripts/<skript>.mjs <ordner> … --wurzel "<wurzel>"
```

Im normalen Lauf (dieses Repo, lokales Archiv) entfallen `QUELLEN_ARCHIV` und
`--wurzel`. Das Lehrmittel sucht jedes Skript unter
`<wurzel>/material/_lehrmittel`, sonst in diesem Repo; `LEHRMITTEL` setzt es
ausdrücklich. [E38 Stufe A: «Lehrmittel bei `--wurzel`»]

### 1.2 Was keine Rolle tut

- **Nichts an der Einheit ändern** — keine Datei unter `src/`, keine Karte,
  nichts im Archiv der Quellen (`q-…/`). Geschrieben wird nur nach `<pruef>` und
  `<tmp>`. [Auftrag 10, Stufe C Nr. 1; `gegenleser.md`: Gegenleser berichten nur]
- **Kein Wortlaut ins Repo.** Pakete, Antworten und Beleg-Dateien tragen Anker
  aus Quelle und Lehrmittel; sie liegen nie in einem Repo.
  `scripts/audit-paket.mjs` verweigert jede Ausgabe dorthin. Die Rückgabe an den
  Orchestrator nennt Feld, Urteil und Fundstelle — **keinen Anker**, keinen Satz
  aus Quelle, Lehrmittel oder Gesetz. [E38: «Im Repo steht nie ein Anker»]
- **Keinen Bericht schreiben.** Die Datei ist das Ergebnis; die Rückgabe ist
  eine Kurzliste. [Rb §5.1, §5.3 Nr. 3]
- **Keine Subagenten starten, keine andere Einheit lesen.**

### 1.3 Wann — und was eine Änderung auslöst

Die Audits beginnen **nach dem ersten grünen Tor** (`phase-9-tor.md` §1, erster
Durchgang) und laufen neben den Lernenden-Gegenlesern; sie lesen nur. Die
Lösbarkeitsprobe beginnt, sobald das Produkt eines Lernenden-Gegenlesers
vorliegt. [`lauf.md` §4–§5]

| Geändert wird | Das Tor meldet | Neu geprüft wird |
|---|---|---|
| ein Lösungsfeld | `ERR_AUDIT_VERALTET` an diesem Feld (Hash) | nur dieses Feld: Paket mit `--nur-veraltet` (Abschnitt 2.5) |
| ein Feld mit einer Aussage über die Welt | `ERR_FAKT_ZEILE_VERWAIST`, `ERR_FAKT_OHNE_ZEILE` | nur diese Aussagen: Abschnitt 3.5 |
| «Das geben Sie ab», ein Indikator, die Form des Lösungsbilds, LF4 | nichts von selbst | die Probe dieses Hefts und dieser Spur, nachdem der Lernenden-Gegenleser die geänderten Seiten neu gelesen und sein Produkt neu abgegeben hat (Abschnitt 4.5) |

[Rb §4 letzte Zeile: Lösungen wurden in vier Läufen nach dem Audit geändert und
nicht neu geprüft; Rb §5.3 Nr. 5; Auftrag 10, Stufe C Nr. 1]

### 1.4 Mehrere schreiben, eine Datei entsteht

`check-belege` liest genau eine `belege.json` und eine `probe.json` je Einheit,
`check-zahlen` eine `fall.json`. Mehrere Rollen arbeiten gleichzeitig; darum
schreibt jede eine **Teildatei** in `<pruef>`, und ein Befehl führt zusammen:

```
node scripts/audit-paket.mjs <ordner> --zusammenfuehren
```

| Teildatei | Schreibt | Wird zu |
|---|---|---|
| `belege.<heft>.<spur>.json`, Nachprüfung `belege.<heft>.<spur>.r2.json`, `.r3.json` | Lösungs-Audit des Pakets | `belege.json` |
| `probe.<heft>.<spur>.json` | Lösbarkeitsprobe | `probe.json` |
| `fall.A.json`, `fall.B.json`, `fall.auftrag.json` | Executor A, B, Set (`belege.md` §6) | `fall.json` |

Je Lösungsfeld gewinnt die Zeile, deren Hash zum heutigen Text passt; unter
mehreren die jüngere. Zeilen ohne Urteil und Zeilen ohne Feld fallen weg und
werden gezählt. In `probe.json` bleibt eine vorhandene Zeile stehen — ihren
Stand (`offen` → `erledigt`) führt der Orchestrator dort nach, nie in der
Teildatei. Das Zusammenführen darf jede Rolle jederzeit auslösen; massgebend ist
der Lauf des Orchestrators im Tor. `fakten.json` schreibt ein Agent allein —
keine Teildatei. [Entscheid Executor Stufe C, E38: ein Schreiber je Datei]

## 2. Lösungs-Audit — blind lösen, vergleichen, abgeben

**Modell:** Opus. (Ob Sonnet genügt, misst der Beweis zu Auftrag 10; bis zu
einem Entscheid Opus — Rb §5.3 Nr. 6, E38 «offen für Pietro».)

**Warum blind.** Das frühere Audit las die Lösung zuerst und bestätigte sie.
Wer die Frage selbst an der Quelle löst, merkt, wo die Lösung etwas sagt, das
dort nicht steht, wo die Fundstelle daneben liegt und wo nur eine Antwort
möglich ist. [Rb §5.3 Nr. 1; Rb §4: rund 15 Ableitungen als Quellenaussage, rund
25 falsche Zeiger]

### 2.1 Pakete — wer wie viele

```
node scripts/audit-paket.mjs <ordner> --plan
```

nennt die Pakete der Einheit und ihre Befehle. Bei zwei Heften mit je zwei
Spuren sind es **fünf**: `A.ohne_medien`, `A.mit_medien`, `B.ohne_medien`,
`B.mit_medien`, `auftrag.beide` — je ein Auditor. Die Felder des Kerns (LF1,
LF2, Lösungsbild, Abschluss; Spur `beide`) liegen im Paket der ersten
vorhandenen Spur des Hefts; `--kern nur` macht daraus ein eigenes Paket
`<heft>.kern`, wenn eines zu gross wird. Jedes Lösungsfeld liegt in genau einem
Paket (`--plan` rechnet es nach).

### 2.2 Was der Orchestrator baut

Vor dem Start, je Paket:

```
node scripts/audit-paket.mjs <ordner> --heft <heft> --spur <spur> --out <tmp>/audit/blind.<teil>.md
```

(beim Auftrag `--heft auftrag --spur beide`). Das **Blind-Paket** enthält: die Aufgaben mit
ihren Namen · alles, was die Lernenden im Heft dieser Spur sehen, nach Seiten
(Fragen, Raster mit Spalten und leeren Zeilen, Auftrag, Kriterien, Beispielbild,
Methodenkarten, Glossar) · die Quellen des Hefts **in voller Auflösung**, jede
Zeile mit ihrer Stelle (`[mm:ss]`, `[Abs. N]`), Zeilen ausserhalb des
Ausschnitts gekennzeichnet · die Kapitel des Lehrmittels, die das Heft nennt,
jede Zeile mit `[S. N]`. Es enthält **nicht**: irgendein Lösungsfeld, den
Kurzbeschrieb der Quellenkarte, Kopf und Notizen der Archivdatei, Begleiter, KN,
Prinzip. [Rb §5.3 Nr. 1–2: Material in voller Auflösung — die Zeitmarken-Fehler
von 8 bis 25 Sekunden kamen von Blöcken um 20 Sekunden]

**Paket ansehen, bevor es hinausgeht:** Die letzte Zeile des Befehls nennt
Aufgaben, Felder, Quellen mit Zeilenzahl und Kapitel. Eine Quelle mit 0 Zeilen
oder ein Heft ohne Kapitel heisst: Das Material fehlt, das Audit wäre wertlos.
[`gegenleser.md` §3; B `2026-10-04-321` §10]

Das **Vergleichs-Paket** baut der Auditor selbst, mit dem Befehl aus dem Auftrag
— das Skript gibt es erst heraus, wenn seine Antworten-Datei jede Aufgabe trägt.
Der Orchestrator gibt dem Auditor **nur** den Pfad des Blind-Pakets und den
Auftrag unten; nie einen Pfad in die Einheit.

### 2.3 Auftrag (Vorlage)

> **Lösungs-Audit — `<ordner>`, Paket `<teil>`.** Du prüfst die Musterlösungen
> eines Lernhefts gegen Quelle und Lehrmittel. Du arbeitest in drei Schritten
> und hältst die Reihenfolge ein. Dein Modell: `<modell>`.
>
> **Du bekommst** eine Datei: `<tmp>/audit/blind.<teil>.md` (Blind-Paket). Sie
> enthält die Aufgaben, alles, was die Lernenden sehen, die Quellen Zeile für
> Zeile mit ihrer Stelle und das Lehrmittel Zeile für Zeile mit Seite — **keine
> Lösung**.
>
> **Du öffnest nicht:** irgendeine Datei unter `<wurzel>/src/`, das Archiv
> `<archiv>` (ausser deiner eigenen Datei unter `<pruef>`), Begleiter, Lösungen,
> Bauplan, Berichte, Dateien anderer Auditoren, eine vorhandene `belege.json`.
> Du änderst nichts an der Einheit. Du schreibst nur nach `<tmp>/audit/` und
> nach `<pruef>/`. Kein Text aus Quelle oder Lehrmittel in eine Datei innerhalb
> eines Repos.
>
> **Schritt a — blind lösen.** Lies das Blind-Paket ganz. Schreibe
> `<tmp>/audit/antworten.<teil>.md`. Je Aufgabe aus Teil A des Pakets eine
> Überschrift, die mit `## ` beginnt und den Namen der Aufgabe zeichengleich
> enthält (kopieren). Darunter deine Antwort, so wie die Aufgabe sie verlangt
> (Raster ausfüllen, Befund schreiben, Produkt herstellen, beide Seiten einer
> Abwägung ausführen). Zu **jeder Aussage** deiner Antwort:
> woher sie stammt (`quelle`, `lehrmittel` oder `fallueberlegung` — eigene
> Überlegung am Fall), bei Quelle und Lehrmittel ein **Anker**: 5 bis 12 Wörter
> am Stück, wörtlich aus Teil C bzw. D kopiert, nicht aus einer Zeile mit
> «(ausserhalb)»; dazu wo (Karten-ID `q-…` bzw. Dateiname des Kapitels) und die
> Stelle der Zeile, in der der Anker beginnt (`mm:ss`, `Abs. N`, `S. N`).
> Bei einer Abwägung (LF4): Sind wirklich zwei Antworten vertretbar? Schreibe es
> hin, auch wenn nicht.
>
> **Schritt b — vergleichen.** Erst jetzt:
>
> ```
> $env:QUELLEN_ARCHIV = '<archiv>'; node scripts/audit-paket.mjs <ordner> --wurzel "<wurzel>" --heft <heft> --spur <spur> --mit-loesung --antworten "<tmp>/audit/antworten.<teil>.md" --out "<tmp>/audit/vergleich.<teil>.md" --geruest "<pruef>/belege.<teil>.json"
> ```
>
> Der Befehl verweigert sich, solange eine Aufgabe in deiner Antworten-Datei
> fehlt. Er schreibt das Vergleichs-Paket (je Lösungsfeld: Text, Hash, worauf es
> sich laut Heft stützt) und das Gerüst deiner Teildatei (je Feld eine Zeile mit
> `feld`, `spur`, `hash`, Datum — **diese vier Werte änderst du nie**).
> Vergleiche je Feld die Lösung mit deiner Antwort und mit dem Material, und
> fülle seine Zeile:
>
> | Wert | Was du einträgst |
> |---|---|
> | `herkunft` | woher die Aussage des Felds **nach deinem Befund** stammt: `quelle` · `lehrmittel` · `nrlp` · `fallueberlegung` (das Feld überlegt am Fall, oder seine Aussage steht in keiner Grundlage) |
> | `urteil` | `stimmt` — die Aussage steht an der Stelle, die das Feld nennt; oder das Feld überlegt nur am Fall und behauptet nichts über Quelle, Lehrmittel oder die Sache, das dort nicht steht · `fundstelle_falsch` — die Aussage steht in der Grundlage, aber nicht dort, wo das Feld sagt (Karte, Seite, Absatz, Zeitmarke) · `ableitung` — das Feld sagt etwas über die Sache, das weder Quelle noch Lehrmittel trägt (nur mit `herkunft: fallueberlegung`) · `falsch` — die Grundlage sagt etwas anderes, die Aussage widerspricht dem Fall, eine Rechnung geht nicht auf, oder bei einer Abwägung ist nur eine Seite vertretbar |
> | `anker` | bei `quelle`, `lehrmittel`, `nrlp`: 5 bis 12 Wörter am Stück, **kopiert** aus Teil C bzw. D, im Ausschnitt; bei `fallueberlegung` leer `""`; bei `falsch` darf er fehlen |
> | `wo` | Karten-ID (`q-…`) · Dateiname des Kapitels (`2.4_….md`) · `nrlp_3j.json` bzw. `nrlp_4j.json` · bei `fallueberlegung` leer |
> | `stelle` | die Stelle der Zeile, in der der Anker beginnt, ohne Klammern: `01:12` (Sekunden abgerundet) · `Abs. 7` · `S. 4, Abs. 2` · bei Lehrmittel `S. 63` · bei `fallueberlegung` leer. Bei `fundstelle_falsch` die **richtige** Stelle |
> | `weitere_belege` | eine Liste weiterer Fundstellen desselben Felds, je `{ "herkunft", "anker", "wo", "stelle" }` — **für jede Zeitmarke, Spanne, Seite und jeden Absatz, den der Lösungstext nennt, braucht es einen Beleg dort** (die Hauptzeile oder ein Eintrag hier). Auch bei `herkunft: fallueberlegung` erlaubt, wenn ein Teil des Felds belegt ist |
> | `bemerkung` | in eigenen Worten, ein Satz: was die Grundlage wirklich sagt, bzw. worin deine blinde Antwort abweicht. Pflicht bei jedem Urteil ausser `stimmt`. Kein Zitat |
> | `von.modell` | `<modell>` |
>
> Trifft ein Feld mehrere Aussagen, gilt das schwerste Urteil (`falsch` vor
> `fundstelle_falsch` vor `ableitung` vor `stimmt`). Ob das Heft eine Ableitung
> als Fallüberlegung kennzeichnet, beurteilst du nicht — das prüft das Skript.
> Wo deine blinde Antwort von der Lösung abweicht, entscheidet das Material, wer
> recht hat; ist beides vertretbar, ist das Urteil `stimmt` und die Abweichung
> steht in `bemerkung`. Trägt eine Quelle im Paket den Vermerk «nur auf den
> Block genau» oder «Kein Archivtext», schreibe das in die `bemerkung` jedes
> Felds mit einer Zeitmarke dieser Quelle.
>
> **Schritt c — abgeben.** Prüfe deine Teildatei, bis sie besteht:
>
> ```
> $env:QUELLEN_ARCHIV = '<archiv>'; node scripts/audit-paket.mjs <ordner> --wurzel "<wurzel>" --heft <heft> --spur <spur> --pruefen
> ```
>
> Der Befehl führt die Teildateien zusammen, lässt `check-belege` laufen und
> zeigt nur die Befunde deiner Felder, je mit einer Sorte davor:
>
> - **`ZEILE`** — deine Belegzeile stimmt nicht; beheben, bis keine mehr
>   dasteht: `ERR_BELEG_FEHLT` (Zeile ohne Urteil), `ERR_BELEGE_SCHEMA`,
>   `ERR_ANKER_NICHT_IM_TEXT` und `ERR_ANKER_NUR_KOPF` (Anker nicht kopiert),
>   `ERR_STELLE_FALSCH`, `ERR_ANKER_AUSSERHALB_AUSSCHNITT`,
>   `ERR_BELEG_KARTE_FREMD`, `ERR_BELEG_ARCHIV_FEHLT`, `ERR_BELEG_SPUR`. Steht
>   `ERR_ZEITMARKE_DANEBEN`, `ERR_SEITE_DANEBEN`, `ERR_ABSATZ_DANEBEN` oder
>   `ERR_FUNDSTELLE_OHNE_BELEG` als `ZEILE` da, fehlt ein Beleg in
>   `weitere_belege` — oder das Urteil ist in Wahrheit `fundstelle_falsch`.
> - **`BEFUND`** — du hast an der Einheit etwas gefunden; das bleibt stehen:
>   `ERR_URTEIL_FALSCH`, `ERR_URTEIL_FUNDSTELLE`,
>   `ERR_ABLEITUNG_UNGEKENNZEICHNET`, und die vier «daneben»-Codes an einem Feld
>   mit Urteil `fundstelle_falsch`.
>
> Fertig bist du, wenn die letzte Zeile **«ABGABE IN ORDNUNG»** lautet (Exit 0).
> Zeilen mit `ERR_BELEG_FEHLT` zu Feldern anderer Pakete siehst du nicht.
>
> **Rückgabe** (kein Bericht): Pfad der Teildatei · die Zeile «Urteile: …» und
> die letzte Zeile von `--pruefen` · eine Kurzliste **nur** der Felder mit
> Urteil ≠ `stimmt`: Feld · Urteil · ein Satz in eigenen Worten · richtige
> Fundstelle (Karte bzw. Kapitel und Stelle). Keinen Anker, keinen Satz aus
> Quelle oder Lehrmittel.

### 2.4 Was der Orchestrator danach tut

1. `node scripts/audit-paket.mjs <ordner> --zusammenfuehren`, dann
   `node scripts/check-belege.mjs <ordner>` — an einem Entwurf sind Befunde
   Fehler; an einem Altstand in einer Temp-Kopie `--streng` dazu.
2. Jedes Urteil ≠ `stimmt` **am Dokument nachprüfen** (`gegenleser.md` §5),
   dann als Auftrag an den Executor der Datei: `falsch` und
   `fundstelle_falsch` werden in der Lösung korrigiert; `ableitung` wird im
   Feld als Fallüberlegung gekennzeichnet (`sprache.md` §7.4) oder gestrichen.
3. Der Lauf geht erst weiter, wenn `check-belege` ohne Fehler endet.
   [Auftrag 10, Stufe C Nr. 1 c]

### 2.5 Nach einer Änderung — nur die betroffenen Felder

`check-belege` meldet `ERR_AUDIT_VERALTET` an jedem Feld, dessen Text sich seit
dem Audit geändert hat. Dann, je betroffenes Paket:

```
node scripts/audit-paket.mjs <ordner> --heft <heft> --spur <spur> --nur-veraltet --out <tmp>/audit/blind.<teil>.r2.md
```

Das Paket führt nur die veralteten Felder (das Material bleibt ganz). Der
Auftrag ist derselbe, mit `--nur-veraltet` im Befehl von Schritt b (nicht in
Schritt c: `--pruefen` zeigt immer alle Felder des Pakets),
`antworten.<teil>.r2.md`, `vergleich.<teil>.r2.md` und dem Gerüst
`<pruef>/belege.<teil>.r2.json` — eine Teildatei wird nie überschrieben.
[Rb §5.3 Nr. 5; Auftrag 10, Stufe C Nr. 1]

## 3. Fakten-Audit — jede Aussage über die Welt an der Primärquelle

**Modell:** Opus, mit Netz. Ein Agent je Einheit. [P-1a Schritt 4;
B `2026-10-06-5.2.1_gesetze_veraendern` §6; Rb §5.3 Nr. 6]

**Warum.** Rund 35 bis 40 falsche oder überzogene Rechts- und Sachaussagen in
mindestens neun Einheiten fand erst der Abgleich mit Gesetz und Amt; die
Gegenleser finden Bearbeitbarkeit, nicht Wahrheit. [Rb §4]

### 3.1 Was der Orchestrator bereitstellt

- **`fall.json` muss stehen** (`check-fakten --liste` sagt sonst in der ersten
  Zeile «ohne fall.json»): Ohne sie verlangt das Skript für jede erfundene
  Fallzahl eine Zeile. Fehlt sie — etwa an einem Altstand —, schreibt der
  Orchestrator vorher `fall.A.json` und `fall.B.json` aus
  `node scripts/check-zahlen.mjs <ordner> --liste` (`belege.md` §6) und führt
  zusammen. Das Fakten-Audit schreibt keine Fallzahlen.
- der Bauplan `docs/cloud-run/bauplaene/<ordner>.md`, falls er einen Abschnitt
  «10. Fakten» trägt.
- kein Paket: Das Fakten-Audit liest die Einheit selbst — es gibt nichts zu
  verbergen.

### 3.2 Auftrag (Vorlage)

> **Fakten-Audit — `<ordner>`.** Du prüfst jede Rechts- und Sachaussage über
> die Welt in einer Unterrichtseinheit an der amtlichen Primärquelle. Dein
> Modell: `<modell>`. Heute: `<JJJJ-MM-TT>`.
>
> **Du liest:** `<wurzel>/src/data/einheiten/<ordner>/` (`herausforderung_A.json`,
> `herausforderung_B.json`, `set.json`, `kn.json`, `prinzip.json`,
> `begleiter.md`), die Karten der Einheit unter `<wurzel>/src/data/quellen/`
> und `<wurzel>/src/data/methoden/` (welche: die Zeile «je Datei» der
> Arbeitsliste), und — falls vorhanden — `<bauplan>`, Abschnitt «10. Fakten».
> **Du liest nicht als Beleg:** das Lehrmittel, die Archivtexte der Quellen,
> Medien, Wikipedia, Ratgeber- und Vergleichsportale.
> Du änderst nichts an der Einheit. Du schreibst genau eine Datei:
> `<pruef>/fakten.json`. Kein Gesetzestext und kein Satz einer Webseite in eine
> Datei innerhalb eines Repos — und auch in `fakten.json` nur eigene Worte.
>
> **Schritt 1 — Arbeitsliste.**
>
> ```
> $env:QUELLEN_ARCHIV = '<archiv>'; node scripts/check-fakten.mjs <ordner> --wurzel "<wurzel>" --liste
> ```
>
> Die Liste nennt jede Aussage, die am Schriftbild erkennbar ist: Gesetzeskürzel
> mit Artikel, «Stand …», Datum, Betrag, Prozent, Frist, Menge, Abstimmung —
> je mit Feld und Umfeld. Sagt die erste Zeile «ohne fall.json», melde das und
> arbeite weiter; erfundene Zahlen des Falls (Lohn, Preis, Alter der Person)
> bekommen von dir **keine** Zeile, du nennst sie in der Rückgabe.
>
> **Schritt 2 — selbst lesen.** Die Liste findet keine Aussage ohne Zahl und
> ohne Artikel. Lies darum jeden sichtbaren Text ganz — beide Hefte samt
> Lösungen, Auftrag und Glossar in `set.json`, `kn.json`, `begleiter.md`,
> Kurzbeschrieb und Titel der Karten — und nimm jede weitere Aussage auf, die
> sagt, **was rechtlich gilt oder was in der Welt der Fall ist**: wer etwas darf
> oder muss, was ein Vertrag oder ein Amt bewirkt, wer zuständig ist, was die
> Regel und was die Ausnahme ist. Solche Zeilen tragen `"art": "sonst"`.
>
> **Schritt 3 — an der Primärquelle prüfen.** Je Aussage die amtliche Stelle
> **heute abrufen** — aus dem Gedächtnis gilt nichts:
> fedlex.admin.ch (Gesetz und Verordnung, mit Artikel und Stand der Fassung) ·
> admin.ch (Bundesämter) · bfs.admin.ch · bag.admin.ch · ch.ch · die Seiten der
> Kantone und Gemeinden · Gerichte (bger.ch). Keine Medien, kein Wikipedia als
> Beleg. Was der Bauplan in «10. Fakten» vorgibt, wird **nachgeprüft, nicht
> übernommen**; seine URL ist ein Startpunkt.
>
> | `urteil` | Wann |
> |---|---|
> | `belegt` | Die Aussage steht heute so an der genannten Stelle. Auch: Sie stimmt in der Sache und vereinfacht vertretbar — was weggelassen ist, steht in `bemerkung` |
> | `abweichend` | Die Primärquelle sagt etwas anderes (anderer Artikel, andere Frist, anderer Betrag, Ausnahme verschwiegen, die das Ergebnis im Fall ändert, Stand überholt). `bemerkung`: was sie sagt, in eigenen Worten |
> | `nicht_belegbar` | Keine amtliche Stelle abrufbar oder auffindbar. `primaerquelle` leer, `bemerkung`: wo gesucht |
>
> **Schritt 4 — `fakten.json` schreiben** (`<pruef>/fakten.json`):
>
> ```json
> { "format": "bbw-hko/fakten@1", "einheit": "<ordner>", "zeilen": [
>   { "wortlaut_im_heft": "…", "feld": "herausforderung_A.json › situation_text",
>     "auch_in": ["begleiter.md › Absatz 12"], "art": "frist",
>     "primaerquelle": "https://www.fedlex.admin.ch/…", "fundstelle": "Art. … Abs. …",
>     "abgerufen_am": "<JJJJ-MM-TT>", "urteil": "belegt", "bemerkung": "",
>     "von": { "rolle": "Fakten-Audit", "modell": "<modell>" } } ] }
> ```
>
> - `wortlaut_im_heft`: ein Stück **aus dem Feld kopiert**, am Stück, so lang,
>   dass der Treffer der Liste ganz darin steht (Kürzel mit Artikel, Zahl mit
>   Einheit). Das Skript sucht es im Feld.
> - `feld`: wie in der Arbeitsliste (`Datei › Pfad`); Karten als
>   `quellen/<id>.json › …`, `methoden/<id>.json › …`; Begleiter als
>   `begleiter.md › Absatz N`. `auch_in`: weitere Felder mit **demselben
>   Wortlaut**. Eine Zeile deckt jeden Treffer, den ihr Wortlaut enthält.
> - `art`: `artikel` · `frist` · `betrag` · `prozent` · `datum` · `stand` ·
>   `abstimmung` · `zahl` · `sonst`. `fundstelle` (Artikel, Absatz, Tabelle) und
>   `bemerkung` in eigenen Worten; `bemerkung` ist Pflicht bei `abweichend` und
>   `nicht_belegbar`, sonst `""`. Keine weiteren Schlüssel.
>
> **Schritt 5 — prüfen.**
>
> ```
> $env:QUELLEN_ARCHIV = '<archiv>'; node scripts/check-fakten.mjs <ordner> --wurzel "<wurzel>" --streng
> ```
>
> **Deine Fehler** — beheben: `ERR_FAKTEN_SCHEMA`, `ERR_FAKTEN_UNLESBAR`,
> `ERR_FAKT_ZEILE_VERWAIST` (Wortlaut nicht aus dem Feld kopiert, Feld falsch
> geschrieben), `ERR_FAKT_OHNE_ZEILE` (Aussage ohne Zeile — ausser es ist eine
> erfundene Fallzahl, die in `fall.json` fehlt), `WARN_FAKT_QUELLE_NICHT_AMTLICH`.
> **Befunde an der Einheit** — bleiben stehen: `ERR_FAKT_ABWEICHEND`,
> `ERR_FAKT_NICHT_BELEGBAR`.
>
> **Rückgabe** (kein Bericht): Zahl der Zeilen je Urteil und wie viele davon aus
> Schritt 2 stammen · die letzte Zeile von Schritt 5 · je Zeile `abweichend`
> oder `nicht_belegbar`: Feld · was die Einheit sagt und was die Quelle sagt, in
> eigenen Worten · URL · erfundene Fallzahlen, die in `fall.json` fehlen (Feld,
> Zahl) · jede Stelle, an der das **Lehrmittel** dem Gesetz widerspricht.

### 3.3 Was der Orchestrator danach tut

1. `node scripts/check-fakten.mjs <ordner>` — und die Schlüsselstellen (alles,
   woran eine Lösung oder eine Rasterzeile hängt) **selbst an der Quelle
   nachlesen**, bevor er korrigieren lässt. [P-1a Schritt 4]
2. `abweichend` → Korrektur im Feld (Executor der Datei). `nicht_belegbar` →
   als Fallüberlegung kennzeichnen (`sprache.md` §7.4) oder streichen; was
   stehen bleibt, kommt in die Vorlage zur Freigabe.
3. Widerspricht das Lehrmittel dem Gesetz: in den Bericht (Kürzel S) und in die
   Vorlage zur Freigabe — nie still entscheiden.
   [B `2026-10-06-4.3.1_vielfalt_untersuchen` §10]
4. Fehlende Fallzahlen: in `fall.<A|B|auftrag>.json` nachtragen lassen (wer die
   Situation schreibt), zusammenführen.

### 3.4 Kein Netz

Das Audit entfällt nicht: Es steht als «nicht geprüft» im Bericht, `check-fakten`
bleibt rot (`ERR_FAKTEN_FEHLT`), und die Einheit ist nicht freigabereif, bis es
lokal nachgeholt ist. [E32]

### 3.5 Nach einer Änderung

`check-fakten` meldet `ERR_FAKT_ZEILE_VERWAIST` (der Wortlaut einer Zeile steht
nicht mehr im Feld) und `ERR_FAKT_OHNE_ZEILE` (neue Aussage). Derselbe Auftrag,
eingeschränkt: «Prüfe nur die Aussagen, die Schritt 5 heute meldet; ersetze die
verwaisten Zeilen, lass alle anderen stehen.» Ein Abruf, der älter als zwölf
Monate ist, wird als Warnung gemeldet (`WARN_FAKT_ABRUF_ALT`) und beim nächsten
Lauf erneuert.

## 4. Lösbarkeitsprobe — lässt sich die höchste Stufe erreichen?

**Modell:** Sonnet. Je Produkt eines Lernenden-Gegenlesers ein Agent: bei zwei
Heften mit je zwei Spuren vier, dazu einer für den Auftragsbogen. Sie ersetzt
keinen Gegenleser. [Rb §5.2, Zeile «Aufgabe nicht lösbar, keine echte Wahl»;
Auftrag 10, Stufe C Nr. 3]

**Warum.** Rund 30 Befunde der Art «nicht lösbar, keine echte Wahl, Stufe 3
nicht erreichbar» fanden die Gegenleser nur, wenn sie zufällig darauf stiessen.
Wer ein sorgfältiges Produkt mit Kriterien und Lösungsbild bewertet, sieht, ob
die Aufgabe der Fehler ist. [Rb §4]

### 4.1 Was der Orchestrator baut

1. Jeder Lernenden-Gegenleser gibt neben seinem Lesebericht sein **Produkt als
   Datei** ab: `<tmp>/gegenleser/produkt.<teil>.md` (`gegenleser.md` §4.1).
2. Je Produkt das Paket:

   ```
   node scripts/audit-paket.mjs <ordner> --probe --heft <heft> --spur <spur> --out <tmp>/probe/paket.<teil>.md
   ```

   (beim Auftrag `--heft auftrag --spur beide`). Es enthält: «Das geben Sie ab» · die Kriterien
   mit ihren vier Stufen (0 bis 3 Punkte) und dem Indikator am Produkt · das
   Lösungsbild (beim Auftrag: den Erwartungshorizont) · die Frage LF4 (beim
   Auftrag: die Leitfrage) · je Abschnitt den Feldnamen für `probe.json`.

Die Probe bekommt **nur** diese zwei Dateien — nicht das Heft, nicht die
Quelle, nicht die Lösungen der Leitfragen, nicht den Lesebericht. Die Frage LF4
steht im Paket, weil der dritte Befund sie braucht. [Auftrag 10, Stufe C Nr. 3;
LF4 im Paket: Entscheid Executor Stufe C, E38]

### 4.2 Auftrag (Vorlage)

> **Lösbarkeitsprobe — `<ordner>`, `<teil>`.** Du bewertest das Produkt einer
> sorgfältigen Lernenden und suchst dabei Fehler **der Aufgabe**, nicht der
> Lernenden. Dein Modell: `<modell>`. Heute: `<JJJJ-MM-TT>`.
>
> **Du bekommst zwei Dateien:** `<tmp>/gegenleser/produkt.<teil>.md` (das
> Produkt, die Antwort auf LF4 und die Selbsteinschätzung einer starken,
> genauen Lernenden) und `<tmp>/probe/paket.<teil>.md` («Das geben Sie ab»,
> Kriterien mit Stufen, Lösungsbild, die Frage LF4). **Sonst öffnest du
> nichts** — keine Datei der Einheit, kein Heft, keine Quelle. Du änderst
> nichts. Du schreibst genau eine Datei: `<pruef>/probe.<teil>.json`.
>
> **Schritt 1 — bewerten.** Gib dem Produkt je Kriterium Punkte (0 bis 3),
> streng nach dem Wortlaut der Stufen und dem Indikator.
>
> **Schritt 2 — drei Fragen an die Aufgabe.** Ein Befund ist nur, was an der
> Aufgabe liegt. Fehlt dem Produkt etwas, das «Das geben Sie ab» ausdrücklich
> verlangt, ist das eine Schwäche des Produkts — kein Befund; nenne sie in der
> Rückgabe.
>
> | `art` | Befund, wenn |
> |---|---|
> | `stufe3_unerreichbar` | ein Produkt, das alles liefert, was «Das geben Sie ab» verlangt, in einem Kriterium 3 Punkte **nicht erreichen kann**: Die Stufe verlangt etwas, wonach die Aufgabe nicht fragt, wofür die Form keinen Platz lässt, oder was sich am Produkt nicht zeigen kann. `feld`: der Feldname beim Kriterium |
> | `form_weicht_ab` | das Produkt der Aufgabe folgt und trotzdem **in der Form** vom Lösungsbild abweicht: andere Teile, andere Zahl von Zeilen, Spalten oder Blöcken, andere Art von Einträgen — die Aufgabe und das Lösungsbild beschreiben nicht dasselbe. `feld`: der Feldname beim Lösungsbild bzw. bei «Das geben Sie ab» |
> | `keine_echte_wahl` | die Frage LF4 **nur eine vertretbare Antwort** zulässt: Die Lernende sah keine zweite, und auch du kannst aus Frage und Produkt keine begründen; oder die Frage nimmt den Entscheid vorweg. `feld`: der Feldname bei der Frage |
> | `sonst` | ein anderer Fehler der Aufgabe, der dir beim Bewerten auffällt (Kriterium und Indikator widersprechen sich, «Das geben Sie ab» nennt etwas, das kein Kriterium trifft) |
>
> **Schritt 3 — `probe.<teil>.json` schreiben:**
>
> ```json
> { "format": "bbw-hko/probe@1", "einheit": "<ordner>",
>   "laeufe": [ { "heft": "<heft>", "spur": "<spur>", "geprueft_am": "<JJJJ-MM-TT>",
>                 "von": { "rolle": "Lösbarkeitsprobe", "modell": "<modell>" } } ],
>   "zeilen": [ { "feld": "…", "heft": "<heft>", "spur": "<spur>", "art": "stufe3_unerreichbar",
>                 "befund": "ein Satz", "beleg": "Stelle im Produkt und Stelle in Kriterium, Auftrag oder Lösungsbild",
>                 "stand": "offen" } ] }
> ```
>
> `feld`, `heft` und `spur` stehen im Paket («Feld für probe.json», «In
> probe.json»). Ohne Befund ist `"zeilen": []` — der Eintrag in `laeufe` bleibt:
> Er sagt, dass geprobt wurde. `stand` ist immer `offen`.
>
> **Schritt 4 — prüfen.**
>
> ```
> $env:QUELLEN_ARCHIV = '<archiv>'; node scripts/audit-paket.mjs <ordner> --wurzel "<wurzel>" --zusammenfuehren
> ```
>
> Die Zeile `probe.json` nennt Läufe und Befunde; eine Zeile `FEHLER
> probe.<teil>.json` heisst: Deine Datei verletzt das Schema — beheben.
>
> **Rückgabe:** Punkte je Kriterium · Zahl der Befunde je Art, je Befund ein
> Satz · Schwächen des Produkts, die kein Befund sind · Pfad der Datei.

### 4.3 Was der Orchestrator danach tut

`check-belege` meldet jeden Befund mit Stand `offen` als `ERR_PROBE_OFFEN` —
das Tor bleibt rot, bis jeder Befund entschieden ist. Je Befund: **am Dokument
nachprüfen** (`gegenleser.md` §5), dann in `<pruef>/probe.json` (nicht in der
Teildatei) `"stand": "erledigt"` setzen, mit `erledigt_am` und `erledigt_wie`:
«behoben in `<Feld>`» · «stehen gelassen: `<Grund>`» · «fällt weg nach
Nachprüfung: `<Grund>`» · «Entscheid Pietro vom …». Was der Bauplan festlegt
(Produkt, Kriterien des KN), ändert der Lauf nicht: Der Befund kommt mit
Empfehlung in die Vorlage zur Freigabe und bleibt bis zum Entscheid `offen`.
[`belege.md` §7; `phase-10-abschluss.md` §1]

### 4.4 Was die Probe nicht leistet

Sie sieht ein Produkt, nicht drei: Ein Befund ist ein Hinweis, den der
Orchestrator nachprüft, kein Urteil. Und sie prüft nicht, ob das Lösungsbild
inhaltlich stimmt — das tut das Lösungs-Audit.

### 4.5 Nach einer Änderung

Ändert eine Korrektur «Das geben Sie ab», einen Indikator, die Form des
Lösungsbilds oder LF4, liest der Lernenden-Gegenleser die geänderten Seiten neu
(`gegenleser.md` §2) und gibt sein Produkt neu ab; die Probe läuft für dieses
Heft und diese Spur noch einmal und überschreibt **ihre eigene** Teildatei.
Erledigte Befunde in `probe.json` bleiben stehen.

## 5. Im Bericht und im Laufordner

Im Laufordner liegen nur die Protokolle der Skripte (`phase-9-tor.md` §1:
`belege-check.txt`, `fakten-check.txt`, …) — ohne Anker. Der Bericht nennt je
Rolle: Modell, Zahl der Agenten, Zahl der Felder bzw. Aussagen je Urteil, und
**nur die Zeilen mit einem Urteil ≠ `stimmt` bzw. ≠ `belegt` und die Befunde
der Probe**, je mit dem, was geschah (`assets/bericht-template.md`, Abschnitte
6 und 8). Die Beleg-Dateien selbst bleiben im Archiv; `_pruefung/` gehört in
dessen Backup. [E38]
