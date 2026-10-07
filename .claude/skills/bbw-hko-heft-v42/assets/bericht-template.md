# Bericht — <ordnername> (bbw-hko-heft-v42)

<!--
Gerüst für docs/cloud-run/laeufe/<JJJJ-MM-TT>-<ordnername>[-<k>]/BERICHT.md
(references/lauf.md §8; <k> = 2, 3 … für einen weiteren Lauf derselben Einheit
am selben Tag). Ein Bericht je Lauf: Phase 10 und spätere Entscheide
schreiben in dieser Datei weiter — es gibt keinen NACHTRAG.md.
Herkunft des Gerüsts: die Berichte der Läufe 2026-10-04-421 und
2026-10-06-5.2.1_gesetze_veraendern; Kopf und Liste «Offen»: Rückblick §3 Nr. 6
und §5.5, ENTSCHEIDE E34; Zeilen des Tors, Audits und erzeugte Gegenhör-Liste:
ENTSCHEIDE E35, E36, E38.

Regeln:
- Die Überschriften und ihre Reihenfolge sind fest. Ein Abschnitt ohne Inhalt
  bleibt stehen und sagt «keine» oder «entfällt, weil …».
- Kein Lehrmittel-, Transkript- oder Artikeltext, kein Satz aus einem Gesetz,
  keine Namen von Personen aus den Quellen. Eigene Worte plus Fundstelle. Der
  Bericht liegt im öffentlichen Repo und läuft vor dem Commit durch
  scripts/check-leck.mjs.
- Kein Anker aus belege.json, kein Satz aus einem Paket der Audits. Aus den
  Beleg-Dateien stehen hier nur Feld, Urteil und Fundstelle.
- Dieser Kommentar und alle Hinweise in spitzen Klammern werden entfernt.
-->

| | |
|---|---|
| Ordner | `src/data/einheiten/<ordnername>/` |
| Bauplan | `docs/cloud-run/bauplaene/<ordnername>.md` · freigegeben am JJJJ-MM-TT |
| Start | Einzelstart / Schleife / Abschluss |
| Laufordner | `docs/cloud-run/laeufe/<JJJJ-MM-TT>-<ordnername>[-<k>]/` |
| Modelle | Orchestrator … · Executor … · Gegenleser … · Lösungs-Audit … · Fakten-Audit … · Lösbarkeitsprobe … |
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

<Ausgaben des **zweiten Durchgangs** (`references/phase-9-tor.md` §1). Der erste
Durchgang — vor den Audits — steht in einem Satz: grün bis auf
`ERR_BELEGE_FEHLT` und `ERR_FAKTEN_FEHLT`, in Runde n.>

- `npm run build:einheiten-index`: …
- `begleiter-marker --check`: … Marker · 0 abweichend · 0 unauflösbar
- `audit-paket --zusammenfuehren`: `belege.json` n von n Feldern, 0 mit altem
  Hash · `probe.json` n Läufe, n Befunde, 0 offen · `fall.json` A, B, Auftrag
- `check-all <ordnername>`: letzte Zeile … (Datei `check-all.txt`). Darin:

  | Zeile | Ergebnis | Warnungen und Hinweise (Zählung je Code) |
  |---|---|---|
  | Namen (`check-namen`) | ok / FEHLER | |
  | Karten (`karten.mjs geaendert`) | ok / FEHLER | berührte Karten: keine / … |
  | Struktur · Status · Methoden · Sprache · Leck | | |
  | nRLP-Abgleich | | |
  | Kopplung · Autarkie · Begleiter-Marker | | |
  | Leitfragen-Loesungen | | |
  | Heft v4.x (Budgets, Spuren, Quellen) | | |
  | Belege (`check-belege`) | ok / FEHLER / nicht geprüft | Datei `belege-check.txt` |
  | Fakten (`check-fakten`) | | Datei `fakten-check.txt` |
  | Zeiger (`check-zeiger`, mit `--export`) | | Datei `zeiger-check.txt` |
  | Zahlen (`check-zahlen`) | | Datei `zahlen-check.txt` |
  | Kohaerenz (`check-kohaerenz`, mit `--export`) | | Datei `kohaerenz-check.txt` |

  «nicht geprüft» (Archiv oder Lehrmittel fehlte lokal) ist nie grün: Die
  Zeile steht dann auch unter «Offen».
- Warnungen, die ein Mensch entscheidet (`WARN_KOH_…`, `WARN_V42_BUDGET`): je
  Code, was angesehen wurde und mit welchem Ergebnis — oder «keine».
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

## 6. Fakten-Audit und Zahlen (`references/phase-10-abschluss.md` §2–§3, `references/audits.md` §3)

Fakten-Audit: <Modell>, Abruf JJJJ-MM-TT, Ergebnis `fakten.json` im
Quellenarchiv (nicht im Repo). **n Zeilen: n belegt · n abweichend · n nicht
belegbar**; davon n aus eigenem Lesen (Aussagen ohne Zahl und Artikel).
`check-fakten`: letzte Zeile … Selbst an der Quelle nachgelesen: …

Nur die Zeilen, die **nicht «belegt»** heissen — die ganze Liste steht in
`fakten.json`:

| Nr. | Was die Einheit sagte (in eigenen Worten) | Datei › Feld | Was die Primärquelle sagt (eigene Worte) · URL | Abruf | Urteil | Was geschah |
|---|---|---|---|---|---|---|

Lehrmittel widerspricht dem Gesetz: <Stelle, Kapitel und Seite> / nein.

Zahlen: `check-zahlen`: letzte Zeile … · `fall.json` geschrieben von … (n
Fallzahlen, n Ausschlüsse). Von Hand nachgerechnet (Rechnungen ohne «=»):

| Datei › Feld | Rechnung | stimmt / korrigiert |
|---|---|---|

## 7. Entscheide im Lauf (`references/auto-modus.md` §4)

<Je Entscheid: was · warum (Wort der Kompetenz oder Regel) · verworfene
Alternativen. Ausnahmen aus Bauplan §9, die gegriffen haben.>

## 8. Gegenleser und Audits (`references/gegenleser.md` §6, `references/audits.md` §5)

Agenten in diesem Lauf: n Gegenleser · n Lösungs-Audits · 1 Fakten-Audit · n
Lösbarkeitsproben.

| Gegenleser | Runde | Befunde | übernommen (an wen) | weggefallen nach Nachprüfung | nicht übernommen (warum) |
|---|---|---|---|---|---|

- Zuletzt gelesen: Runde n, nach <Änderung>. Danach noch geändert und **nicht
  gegengelesen:** … / nichts.
- Zeitsumme je Heft der Lernenden-Gegenleser gegen den Seitenplan: …
- Was kein Gegenleser prüfen konnte: …

**Lösungs-Audit** (<Modell>, blind gelöst, dann verglichen; Ergebnis
`belege.json` im Quellenarchiv):

| Paket | Felder | stimmt | fundstelle_falsch | ableitung | falsch | Nachprüfung nach Änderung (Runde, Felder) |
|---|---|---|---|---|---|---|
| A · ohne_medien | | | | | | |

`check-belege`: letzte Zeile … Jede Zeile mit einem Urteil ausser «stimmt» —
ohne Anker:

| Feld | Urteil | Befund in eigenen Worten | richtige Fundstelle | Was geschah |
|---|---|---|---|---|

Zeitmarken nur auf den Block genau oder nicht prüfbar (`HINWEIS_ZEIT_…`):
<Karten> / keine — sie stehen in Abschnitt 9.

**Lösbarkeitsprobe** (<Modell>; Ergebnis `probe.json`): n Produkte geprobt.

| Heft · Spur | Punkte je Kriterium | Art | Befund (ein Satz) | Feld | Stand: erledigt wie / offen bis Entscheid |
|---|---|---|---|---|---|

## 9. Vor der Freigabe gegenhören und gegensehen (`references/phase-10-abschluss.md` §6)

<Die Ausgabe von `node scripts/gegenhoeren.mjs <ordnername>`, unverändert: je
Audio und Video Quellen-ID · Titel · QR-Seite · von–bis · Genauigkeit der
Zeitmarken · je Zeitmarke die Frage und die Felder; danach «gegensehen». Von
Hand ergänzt, in eigenen Worten: wer an der Stelle spricht (Rolle, kein Name),
und worauf sonst zu achten ist.>

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

1. Grün: ja / nein — … (Tor im zweiten Durchgang; Belege n von n, Fakten n
   belegt, Probe 0 offen)
2. Gegenhören und gegensehen: Abschnitt 9 (n Audio/Video, n Stellen, n Text-
   und Bildquellen).
3. Braucht einen Entscheid von Pietro: <Punkte aus Abschnitt 10, je mit
   Empfehlung> / nichts.
4. Nicht belegbare Fakten: <Nr. aus Abschnitt 6 und was mit ihnen geschah> /
   keine.
5. Freigabereif nach dem Gegenhören: ja / nein — … («nein», solange ein
   Überlauf über 2 px offen ist oder `check-all` nicht «GRUEN» endet: ein Audit
   fehlt oder ist veraltet, ein Befund der Probe ist offen, eine Prüfung ist
   «nicht geprüft»)
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
