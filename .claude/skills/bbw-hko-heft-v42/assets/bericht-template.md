# Bericht — <ordnername> (bbw-hko-heft-v42)

<!--
Gerüst für docs/cloud-run/laeufe/<JJJJ-MM-TT>-<ordnername>/BERICHT.md
(references/lauf.md §8). Ein Bericht je Lauf: Phase 10 und spätere Entscheide
schreiben in dieser Datei weiter — es gibt keinen NACHTRAG.md.
Herkunft des Gerüsts: die Berichte der Läufe 2026-10-04-421 und
2026-10-06-5.2.1_gesetze_veraendern; Kopf und Liste «Offen»: Rückblick §3 Nr. 6
und §5.5, ENTSCHEIDE E34.

Regeln:
- Die Überschriften und ihre Reihenfolge sind fest. Ein Abschnitt ohne Inhalt
  bleibt stehen und sagt «keine» oder «entfällt, weil …».
- Kein Lehrmittel-, Transkript- oder Artikeltext, kein Satz aus einem Gesetz,
  keine Namen von Personen aus den Quellen. Eigene Worte plus Fundstelle. Der
  Bericht liegt im öffentlichen Repo und läuft vor dem Commit durch
  scripts/check-leck.mjs.
- Dieser Kommentar und alle Hinweise in spitzen Klammern werden entfernt.
-->

| | |
|---|---|
| Ordner | `src/data/einheiten/<ordnername>/` |
| Bauplan | `docs/cloud-run/bauplaene/<ordnername>.md` · freigegeben am JJJJ-MM-TT |
| Start | Einzelstart / Schleife / Abschluss |
| Modelle | Orchestrator … · Executor … · Gegenleser … · Fakten-Audit … |
| Beginn | JJJJ-MM-TT hh:mm |
| Ende | JJJJ-MM-TT hh:mm |
| Runden | Reparaturrunden am Tor: n · Leserunden: n · zuletzt gelesen in Runde n, nach <Änderung> |
| Ergebnis | **grün** / **nicht erzeugbar: <Grund>** |
| Status | `"entwurf"` |

<Zwei bis vier Sätze: was dieser Lauf getan hat und was nicht. Kein Entscheid
des Bauplans ist geändert — oder welcher, mit wessen Freigabe.>

## 1. Einheit

| | |
|---|---|
| Lehrgang | <kanonisch, Lehrjahr> · `lehrgaenge`: … |
| Heft A | <Kompetenz> · «<Titel>» · <Produkt> · Spuren … |
| Heft B | <Kompetenz(en)> · «<Titel>» · <Produkt> · Spuren … |
| Auftrag | «<Titel>» · <zwei Produkte mit Form> · Lebensbereich … |
| KN | «<Titel des Falls>» · Lebensbereich … |
| Neue Methodenkarten | keine / … |
| Quellenkarten | `q-…` (Anzahl je Heft); in diesem Lauf geändert: … |

## 2. Tor und Messung (letzte Ausgaben, nach der letzten Änderung)

- `npm run build:einheiten-index`: …
- `begleiter-marker --check`: … Marker · 0 abweichend · 0 unauflösbar
- `check-all <ordnername>`: … (Datei `check-all.txt`)
- `check-all` über die drei Bestandseinheiten (`references/phase-9-tor.md` §1): …
- `export-v42` + `messen-v42`: Exit … (Datei `messung.txt`); knappste Seiten: …
- `bestand-v42 --pruefen`: …
- `npm run build`: Exit …
- `git status --short`: …
- `check-leck` über Bauplan und Bericht (läuft nach dem Bericht, vor `git add`;
  diese Zeile wird danach nachgetragen): …

**Messung in der Schreibphase** (`references/lauf.md` §6):

| Executor | gemessen | letzte Zeile | knappste Seite | Überlauf behoben an |
|---|---|---|---|---|
| A | ja / nein — Grund | | | |
| B | ja / nein — Grund | | | |

**Was das Tor nicht zeigte:** <Überläufe bei grünem `check-all`, mit Seite,
Pixel und dem Feld, an dem sie behoben wurden — oder «nichts».>

## 3. Kapitel, Seiten, Quellen

| Heft | Kapitel (Datei) | Seiten | wofür | am Text geprüft |
|---|---|---|---|---|

| Quellen-ID | Titel · Herausgeber · Datum | Ausschnitt | Prüfdatum | Zugeständnis |
|---|---|---|---|---|

Vorhandene Spuren je Heft, und warum eine fehlt: …

## 4. Abdeckung (`references/kohaerenz.md` §3)

<Tabelle A1–A14 mit Befund und Lücke.>

## 5. Vergleich mit Gold (nur die Kurzliste aus `references/kohaerenz.md` §4)

<Je Wert: Gold · diese Einheit · Herleitung.>

## 6. Fakten-Audit und nachgerechnete Zahlen (`references/phase-10-abschluss.md` §2–§3)

Fakten-Audit: <Modell>, Abruf JJJJ-MM-TT. **n Aussagen: n stimmen · n vertretbar
vereinfacht · n stimmen nicht · n nicht belegbar.** Selbst nachgelesen: …

| Nr. | Aussage (in eigenen Worten) | Datei › Feld | Primärquelle (Kurzname, URL) | Abruf | Urteil | Was geschah |
|---|---|---|---|---|---|---|

<Oder: «Tabelle in `fakten-tabelle.md`», hier nur die Zeilen mit «stimmt nicht»
und «nicht belegbar».>

Nachgerechnet:

| Datei › Feld | Rechnung | stimmt / korrigiert |
|---|---|---|

Fallzahlen überall gleich (Situation, Beispiel S. 6, Lösung, Checkliste,
Begleiter): ja / Abweichung behoben an …

## 7. Entscheide im Lauf (`references/auto-modus.md` §4)

<Je Entscheid: was · warum (Wort der Kompetenz oder Regel) · verworfene
Alternativen. Ausnahmen aus Bauplan §9, die gegriffen haben.>

## 8. Gegenleser und Lösungs-Audits (`references/gegenleser.md` §6)

| Gegenleser | Runde | Befunde | übernommen (an wen) | weggefallen nach Nachprüfung | nicht übernommen (warum) |
|---|---|---|---|---|---|

- Zuletzt gelesen: Runde n, nach <Änderung>. Danach noch geändert und **nicht
  gegengelesen:** … / nichts.
- Material der Lösungs-Audits: <Untertitel zeilenweise mit Zeitmarke /
  Transkript / Lehrmittel mit Seitenmarken>.
- Zeitsumme je Heft der Lernenden-Gegenleser gegen den Seitenplan: …
- Was kein Gegenleser prüfen konnte: …

## 9. Vor der Freigabe gegenhören und gegensehen (`references/phase-10-abschluss.md` §6)

<Je Audio und Video: Quellen-ID · Titel · von–bis · jede im Heft genannte
Zeitmarke mit dem, was dort zu hören sein soll, und wer spricht (Rolle) ·
woran es hängt · worauf achten. Danach «gegensehen»: Webseiten am Handy,
Papier, QR-Seite.>

## 10. Offen

Eine Zeile je Punkt. Kürzel nach `references/gegenleser.md` §5: **E** Fehler
dieser Einheit · **S** Skill, Skelett, Methodenkarte, Skript, Lehrmittel ·
**R** fester Text oder Layout des Renderers · **Q** Quelle. Stand: offen ·
behoben (wo) · stehen gelassen (warum) · braucht Entscheid · entschieden am
JJJJ-MM-TT. Bekanntes aus `docs/cloud-run/OFFEN.md` (sobald vorhanden) wird
nicht neu gemeldet, nur mit seiner ID genannt, wenn es diese Einheit berührt.
Auch «nicht belegt» und «nicht geprüft» stehen hier.

| # | Kürzel | Punkt (ein Satz) | Fundstelle (Datei › Feld oder Seite) | wer | Stand |
|---|---|---|---|---|---|
| 1 | E | | | Session / Pietro | offen |

Gleiche Stelle in anderen Einheiten gesucht (für jeden Punkt S oder R, der
einen Fehler erzeugt hat): <Muster · Treffer in … · nichts geändert>.

## 11. Vorlage zur Freigabe (`references/phase-10-abschluss.md` §7)

1. Grün: ja / nein — …
2. Gegenhören und gegensehen: Abschnitt 9 (n Audios, n Videos, n Seiten).
3. Braucht einen Entscheid von Pietro: <Punkte aus Abschnitt 10, je mit
   Empfehlung> / nichts.
4. Nicht belegbare Fakten: <Nr. aus Abschnitt 6 und was mit ihnen geschah> /
   keine.
5. Freigabereif nach dem Gegenhören: ja / nein — … («nein», solange ein
   Überlauf über 2 px offen ist oder das Fakten-Audit fehlt)
6. Hash des Commits: steht in der Schlussmeldung, nicht hier (Abschnitt 12).

## 12. Commit

«Einheit <ordnername> (bbw-hko-heft-v42)» · enthält: Ordner der Einheit, Karten
`q-…`, neue Methodenkarte (falls Bauplan §9 sie verlangt hat), Bauplan, diesen
Laufordner, die zwei Index-Dateien. Der Hash steht nicht hier — der Bericht
liegt im selben Commit; ihn nennt die Schlussmeldung, und er wird beim
Freigabe-Commit nachgetragen: <Hash, erst dann>.
`check-leck --staged`: … Kein Push.

<!--
Später angefügt, nie in einer eigenen Datei, je mit Datum in der Überschrift:

## 13. Nachtrag vom JJJJ-MM-TT — Entscheide Pietro
Was entschieden ist · was geändert ist · Tor und Messung danach · was davon
nicht mehr gegengelesen ist. Die Zeilen in Abschnitt 10 bekommen den neuen
Stand.

## 14. Freigabe vom JJJJ-MM-TT
`status` → "publiziert" · check-all, Bestand, Build · Commit «Freigabe:
<ordnername>» (Titel; sein Hash steht in der Schlussmeldung) · Eintrag
ENTSCHEIDE E<nn>.
-->
