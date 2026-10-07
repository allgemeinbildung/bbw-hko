# Methodenkartei und Werkzeugseite

Wie die Seite «05 · Methoden» entsteht, was auf eine Methodenkarte gehört und was
stattdessen in die Herausforderung.

---

## 1. Warum es sie gibt

Eine Durchsicht aller 22 Handlungsprodukte der ersten acht Einheiten hat zwei Dinge
gezeigt. Wo es um **Wissen** geht, greift das Lehrmittel durchgehend — jede Leitfrage
nennt ihr Kapitel mitsamt Seitenzahl. Wo die Lernenden etwas **herstellen**, verschwindet
es: In sieben von 22 Handlungsprodukten stand überhaupt kein Verweis, in der jüngsten
Einheit nur Sachkapitel und kein einziges Methodenkapitel.

Die Kapitel, die tragen würden, sind vorhanden — sie werden nur an der falschen Stelle
nicht genannt. Kap. 16.2 passt exakt auf eine 45-Sekunden-Begründung, Kap. 17.3 auf eine
Stellungnahme, Kap. 20.1 auf eine Bedürfnis-Landkarte. Es fehlte schlicht der Ort im Heft,
an dem eine Methode benannt wird.

Vier Felder des Lehrmittelkanons decken die Reform allerdings nicht ab, weil sie
Produktarten betreffen, die erst mit der Handlungsorientierung Gewicht bekamen: **mediale
Produktion** (Vertonung, Storyboard, Sprechtext), **gestaltete Kurzformate** (Plakat,
Preisschild, Merkblatt, Checkliste), **digitale Zusammenarbeit** (geteiltes Dokument,
schriftliches Peer-Feedback, Dateiablage) und **Umgang mit KI**. Dafür gibt es eigene
Karten.

---

## 2. Wo die Seite im Heft sitzt

Der Bogen einer Herausforderung wächst von sieben auf acht Seiten:

| 1 | 2 | 3 | 4 | 5 | **6** | 7 | 8 |
|---|---|---|---|---|---|---|---|
| Situation | Leitfragen | Leitfragen | Mindmap | Auftrag | **Methoden** | Arbeitsfläche | Rückschau |

Die Position ist nicht beliebig. Im gehefteten Heft liegen die Seiten 6 und 7
nebeneinander — wer am Handlungsprodukt arbeitet, hat die Werkzeuge offen daneben und muss
nicht blättern. Acht Seiten sind ausserdem genau zwei Blatt duplex; sieben waren für eine
Broschüre immer eine unmögliche Zahl.

Auf Seite 5 bleibt alles, was dort schon stand — Auftrag, Schritte, Abgabe, Gütekriterien
und die Formulierungshilfen. Dazu kommt am Fuss eine Zeile: «Methoden — Sie finden sie auf
der Rückseite.»

**Die Seite entsteht nur aus Daten.** Fehlt `methoden` in der Herausforderung, wird sie
nicht gerendert, der Bogen bleibt bei sieben Seiten und der Selbstcheck bei `05`. Stand: fünf Einheiten haben die Seite — `3.2.1_wahre_kosten`, `1.1.1_einstieg_interview`, `3.2.1_ernaehrung_nachhaltig_gestalten`, `5.4.2_internationale_entscheide_wirken_4j` und `1.1.1_ausbildung_erfassen_zeigen`. In `1.1.1_einstieg_interview` führen nur zwei der drei Herausforderungen ein `methoden`-Array, in den übrigen vier alle drei. Alle anderen Einheiten sind unverändert.

---

## 3. Die zwei Stadien

**Auf der Platte** steht in `herausforderung_*.json` nur eine Referenzliste:

```json
"methoden": [
  { "ref": "lm-16-2-statement",
    "fuer": "für die gesprochene Kaufbegründung, 45 bis 60 Sekunden",
    "tun": "Sprechen Sie Ihre 45 bis 60 Sekunden in genau diesen drei Zügen: …" },
  { "ref": "hko-sprechspur", "fuer": "für die Kaufbegründung von 45 bis 60 Sekunden" }
]
```

**Die Karte** liegt einmal unter `src/data/methoden/<id>.json` und kennt die Einheit nicht:

```json
{
  "id": "hko-sprechspur",
  "name": "Sprechspur aufnehmen",
  "quelle": "hko",
  "fuer": "für gesprochene Beiträge von 30 bis 90 Sekunden",
  "schritte": ["Text zuerst schreiben, laut lesen, Zeit stoppen.", "…"],
  "ankommt": "Nicht auswendig lernen, sondern den geschriebenen Text frei nachsprechen …",
  "beispiel": ["0:00 — «Ich habe mich für das gebrauchte Velo entschieden.»", "…"],
  "fehler": "Zu leise aufgenommen. Näher ans Mikrofon gehen, nicht lauter sprechen …",
  "merk": "45–60 Sekunden sind 110–150 gesprochene Wörter."
}
```

`loadEinheit` (in `src/lib/einheiten/index.ts`) löst die Referenzen über
`resolveMethoden` auf, **bevor** irgendein Renderer die Daten sieht. HTML, Word und ZIP
bekommen dieselbe fertige Form; nur der Loader kennt die Kartei. Eine unbekannte Referenz
wird übersprungen und auf der Konsole gemeldet — ein Tippfehler soll kein Heft
unrenderbar machen.

---

## 4. Was auf die Karte gehört und was nicht

| | gehört auf die **Karte** | gehört in die **Herausforderung** |
|---|---|---|
| Name, Kapitel, Seiten | ✓ | |
| `lesen` — was im Kapitel steht | ✓ | |
| `schritte`, `ankommt` | ✓ | |
| `beispiel` — Musterbeispiel | ✓ | (Ausnahme: Override) |
| `fehler`, `merk` | ✓ | |
| `fuer` — wofür generisch | ✓ (Fallback) | ✓ (überschreibt) |
| `tun` — Übertragung auf diese Abgabe | | ✓ **nur hier** |

Das Kapitel ist überall dasselbe, die Übertragung nie. «Aufbau eines Statements» heisst
bei einer Kaufbegründung etwas anderes als bei einer Budgetverhandlung.

### Das Musterbeispiel hat ein neutrales Sujet

Die Karte weiss nicht, in welcher Einheit sie landet — also darf ihr Beispiel nicht auf
eine Einheit zeigen. Das ist kein Kompromiss, sondern das Verfahren des Lehrmittels
selbst: Dessen Muster-Leserbrief handelt immer von Alkohol am Steuer, die Muster-E-Mail
immer von einer Interviewanfrage, und beide taugen trotzdem als Vorlage für jedes Thema.
Lernende übernehmen die **Form**, nicht den Inhalt.

Bestehende Sujets: Sprechspur → gebrauchtes Velo · Storyboard → Wocheneinkauf ·
Wörtlich zitieren → Mundart-Satz · Methoden-Notiz → Recherche-Reihenfolge ·
Stille aushalten → erster Arbeitstag · Preisschild → T-Shirt ·
Gemeinsam schreiben → Handy-Regel · Wirkungskette → Trockenheit und Brotpreis ·
Akteurskarte → Mietverhältnis · Erhebungsbogen → Weg zur Arbeit ·
Befund-Kachel → Einwegbecher · Quellenangaben → Probezeit.

Braucht eine Einheit wirklich ein eigenes, kann sie `beispiel` beim Verweis
überschreiben. Ausnahme, nicht Regel.

### «Worauf es ankommt» ist nicht «Typischer Fehler»

Die beiden rutschen beim Schreiben leicht ineinander. Die Trennung, die trägt:

- **`ankommt`** — die Entscheidung im Verfahren. *«Nicht auswendig lernen, sondern den
  geschriebenen Text frei nachsprechen.»*
- **`fehler`** — ein **beobachtbares Symptom plus Abhilfe**. *«Zu leise aufgenommen. Näher
  ans Mikrofon gehen, nicht lauter sprechen — sonst übersteuert es.»*

Wer `fehler` nur als Verneinung von `ankommt` schreibt, hat den Block verschenkt.

### Seitenzahlen nur, wenn verifiziert

`seiten` bleibt leer, solange die Zahl nicht am Buch geprüft ist — ein erfundener Verweis
kostet Vertrauen für alle echten. Die Zahlen stammen aus `quellen_anker` und `knoten_ref`
bestehender Einheiten; wer eine neue Karte anlegt, sucht dort zuerst.

Verifiziert: 16.1 (S. 366–367) · 16.2 (S. 368) · 16.3 (S. 369–370) · 16.4 (S. 372–373) ·
17.2 (S. 381–392) · 17.3 (S. 393–397, 3B-Schema S. 394–395) · 17.4 (S. 398–407) ·
19.1 (S. 424–425) · 19.2 (S. 426–429) · 20.7 (S. 446–447) · 20.8 (S. 448–451).

Die Zahlen für 16.2 und 16.3 fehlten zunächst und tauchten später in den Quellenankern
von `5.4.2_internationale_entscheide_wirken_4j` und `3.2.1_ernaehrung_nachhaltig_gestalten`
auf — ein Grund mehr, die bestehenden Einheiten abzusuchen, bevor eine Karte ohne
Seitenzahl bleibt.

---

## 5. Layoutregeln (nicht kosmetisch)

Die Seite ist ein 2×2-Raster mit `grid-template-rows: min-content 1fr` — obere Reihe so
hoch wie nötig, untere bekommt den Rest. Daraus folgen drei harte Regeln:

1. **Genau vier Einträge.** Vier Felder, immer besetzt. Das ist zugleich der didaktische
   Zweck: Es stellt beim Schreiben einer Einheit viermal die Frage «womit eigentlich?».
2. **Genau zwei angereicherte Karten** — angereichert heisst: trägt `beispiel` und/oder
   `fehler`. Bei dreien rutscht eine in die obere Reihe, `min-content` wächst mit und
   drückt die untere Reihe zusammen; `.a4-page` steht auf `overflow: hidden`, es würde
   still abgeschnitten. Bei nur einer steht in der unteren Reihe eine kurze Karte neben
   einer langen und wird auf deren Höhe gestreckt — technisch harmlos, optisch unfertig.
   Zwei ist deshalb nicht bloss die Obergrenze, sondern der ausbalancierte Fall.
3. **Die Sortierung macht der Renderer, nicht die Datei.** `MethodenGrid` sortiert stabil
   nach Gewicht: leichte Karten zuerst, angereicherte zuletzt. Die Reihenfolge in der JSON
   spielt fürs Layout keine Rolle.

Angereichert ist **nicht** dasselbe wie «eigene Karte». Auch eine Lehrmittel-Karte gehört
nach unten, wenn das Kapitel die Aufgabe nur halb abdeckt — `lm-19-1-feedback` etwa regelt
das mündliche Gespräch, verlangt ist schriftliches Feedback.

Herkunft trägt die **Kontur, nicht die Farbe**: durchgezogener Rahmen = Lehrmittel,
gestrichelt = eigene Karte. Die Hefte kommen schwarz-weiss aus dem Schulkopierer, eine
farbcodierte Unterscheidung wäre genau dort weg, wo sie zählt.

---

## 6. Eine neue Karte anlegen

1. Prüfen, ob es sie schon gibt: `ls src/data/methoden/`. Gibt es eine, die fast passt:
   nicht ändern, sondern §9 lesen — meist überschreibt die Einheit.
2. Datei `src/data/methoden/<id>.json` anlegen. ID-Konvention: `lm-<kap-mit-bindestrich>-<slug>`
   für Lehrmittel-Karten, `hko-<slug>` für eigene.
3. Bei `quelle: "lehrmittel"` das Kapitel im Lehrmittel nachlesen und `lesen` in zwei
   Sätzen fassen — die Karte ersetzt das Kapitel nicht, sie findet es. Seitenzahl nur,
   wenn verifiziert.
4. Bei `quelle: "hko"` muss die Karte vollständig sein: `schritte` (nummeriert, vier
   genügen), `ankommt`, `merk`. Dahinter kommt kein Kapitel.
5. In der Herausforderung referenzieren, mit `fuer` und — bei Lehrmittel-Karten — `tun`.
   Bei `hko-`Karten wird `tun` **nicht gedruckt** (Entscheid E31): Die Übertragung
   auf die Abgabe steht dort in `fuer`, ausnahmsweise in einem überschriebenen `beispiel`.
6. Rendern prüfen (Workbench, Reiter «Auftrag», Seite 6): keine Box darf abgeschnitten sein.

Kein Index-Rebuild nötig — `methoden` ist kein Index-Feld.

---

## 7. Nebenprodukt: die Lückenliste

Jede Karte mit `quelle: "hko"` ist ein dokumentierter Beleg dafür, dass die Reform ein
Werkzeug verlangt, für das es im Lehrmittel keinen Ort gibt. Die Liste dieser Karten ist
damit brauchbar für die Fachschaft und gegenüber dem Verlag — und der beste Ausgang wäre,
dass sie schrumpft: Jede Methode, die eine kommende Auflage aufnimmt, lässt sich durch
einen Kapitelverweis ersetzen. Die Karten sind als Übergang gedacht, nicht als
Parallelwerk.

Umgekehrt gilt: Solange eine Methode nicht im Lehrmittel steht, wird das gegenüber den
Lernenden nicht verschleiert. Auf der Karte steht ausgeschrieben «nicht im Lehrmittel».

---

## 8. Wo der Code steht

| Datei | Rolle |
|---|---|
| `src/data/methoden/*.json` | die Kartei |
| `src/data/methoden/_aenderungen.json` · `src/data/quellen/_aenderungen.json` | Vermerke zu Korrekturen an gebundenen Karten (§9); keine Karten — Dateien mit führendem `_` überspringen Loader und Checks |
| `scripts/karten.mjs` | Verbraucher einer Karte, Entscheid «ändern oder neu», geänderte Karten gegen `origin/main` (im Tor: `check-all`, Zeile «Karten») |
| `src/lib/einheiten/methoden.ts` | Laden (`import.meta.glob`) + `resolveMethoden` |
| `src/lib/einheiten/types.ts` | `MethodeKarte` · `MethodeRef` · `Methode` |
| `src/lib/einheiten/index.ts` | `withMethoden` — die eine Auflösungsstelle |
| `src/components/einheiten/docs/DocS.tsx` | `MethodenGrid` + bedingte Seite + Gewichtssortierung |
| `src/lib/einheiten/docx-builder.ts` | `methodenBlock` / `methodeZelle` — Word, 2×2-Tabelle |
| `src/styles/einheiten-renderer.css` | `.methoden-grid` · `.methode-box` · `.methode-beispiel` |

Ein Vorschlagspapier für Kernteam 1 liegt unter `/admin/methodenseite`
(Quelle: `src/data/dokumente/methodenseite-kernteam.html`).

---

## 9. Eine Karte ändern — oder eine neue anlegen

Eine Karte wird von vielen Einheiten geführt, die meisten sind publiziert
(Stand 07.10.2026: `lm-17-3-3b-schema` in 18 Einheiten, `hko-quelle-raster` in 16).
Wer sie ändert, ändert gedruckte Hefte. Dasselbe gilt für Quellenkarten
(`src/data/quellen/`): Sie erscheinen im Heft, im Begleiter und auf der QR-Seite.
Darum vor **jeder** Kartenänderung:

```
node scripts/karten.mjs verbraucher <karten-id>   # wer führt sie, mit welchem Status, was wird überschrieben
node scripts/karten.mjs darf <karten-id>          # Entscheid nach der Regel, Exit 0 = erlaubt, 1 = gebunden
node scripts/karten.mjs geaendert                 # was ist gegenüber origin/main geändert (läuft im Tor mit)
node scripts/karten.mjs warnungen                 # Regel e über die ganze Kartei
```

**Gebunden** ist eine Karte, die mindestens eine Einheit mit `status: "publiziert"`
(auch ohne Feld — das gilt als live) oder `"archiviert"` führt. Archivierte Einheiten
binden wie publizierte: Ihre Hefte sind gedruckt im Umlauf, und die QR-Seite
`/m/<ordner>` funktioniert weiter (Entscheid Pietro, 07.10.2026).

| Fall | Lage | Was gilt |
|---|---|---|
| **a** | Die Karte hat **keinen** publizierten und keinen archivierten Verbraucher | Ändern erlaubt. Entwürfe, die die Karte führen, werden danach neu geprüft und gemessen. Für Quellenkarten gilt zusätzlich Fall d |
| **b** | **Fehler** in der Karte: Die Aussage steht nicht auf der genannten Seite, die Seite ist falsch, ein Rechenfehler, ein Widerspruch in sich | Ändern, auch bei publizierten Verbrauchern — aber nur mit **Vermerk** und danach für **jeden** Verbraucher: `check-all`, Export, Messung; bei sichtbarer Änderung an einer Bestandseinheit `bestand-v42.mjs --schreiben`. Ohne Vermerk ist `geaendert` rot |
| **c** | **Passung:** Die Karte stimmt, passt aber nicht zu dieser Einheit — Anzahl, Format, Beispiel, Begriff | Karte **nicht** ändern. Reihenfolge: 1. Die Einheit überschreibt in der Methoden-Referenz (`fuer`, ausnahmsweise `beispiel`). 2. Reicht das nicht: **neue Karte** mit eigener ID (§6); die alte bleibt unverändert |
| **d** | **Quellenkarte** | Der Inhalt einer Karte — Titel, URL bzw. URN, Ausschnitt — wird nach der ersten Freigabe (Freigabe des Bauplans, der die Quelle nennt) **nie** mehr ausgetauscht: Eine andere Quelle ist eine neue Karte mit neuer ID. Korrigierbar bleiben Zeitmarken, Wortzahl bzw. Dauer, Prüfdatum und `kurzbeschrieb` — bei gebundener Karte mit Vermerk wie in Fall b |
| **e** | **Karten für alle** | In `merk` und `schritte` stehen keine festen Zahlen und Formate («6 bis 8 Bilder», «A4», «drei Argumente») — die nennt die Einheit in `fuer`. Das Skript warnt bei Ziffern, Zahlwörtern und Formatwörtern; eine Warnung ist nie ein Fehler. Seiten-, Kapitel- und Artikelverweise zählen nicht |

**Fehler oder Passung?** Probe: Wäre die Karte auch falsch, wenn es diese Einheit
nicht gäbe? Ja → Fehler (b). Nein → Passung (c). Das entscheidet ein Mensch, nicht
das Skript — ebenso, ob eine geänderte Zeitmarke eine Korrektur ist oder ein anderer
Ausschnitt (dann: neue Karte).

**Der Vermerk** ist ein Eintrag im Array von `src/data/methoden/_aenderungen.json`
bzw. `src/data/quellen/_aenderungen.json`:

```json
{ "karte": "<id>", "datum": "JJJJ-MM-TT", "art": "fehler",
  "beleg": "<Fundstelle in eigenen Worten: Kapitel und Seite, Bericht, Primärquelle>",
  "verbraucher": ["<ordner>", "…"] }
```

`art` ist immer `"fehler"`; `verbraucher` nennt jeden Ordner aus
`karten.mjs verbraucher`; `beleg` ist nie ein Zitat (das Repo ist öffentlich). Ein
Vermerk zählt nur, solange er in `origin/main` noch nicht steht — ein alter Vermerk
deckt keine neue Änderung. Titel, URL und URN einer gebundenen Quellenkarte bleiben
auch mit Vermerk rot (Fall d).

**In einem Lauf der Skill** wird nie eine bestehende Karte geändert; ein Fehler geht
in den Bericht («Offen», Kürzel S) und in die Sammelliste. Einzelheiten:
`.claude/skills/bbw-hko-heft-v42/references/karten.md`. Herkunft der Regel:
`docs/upgrade-v4.2/ENTSCHEIDE.md` E31 Nr. 3 und E36.
