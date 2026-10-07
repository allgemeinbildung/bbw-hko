# Gegenleser — feste Besetzung, Zeitpunkt, Aufträge

Die Skripte des Tors prüfen Längen und Struktur, nicht Sinn. Was Lernende beim
Bearbeiten stolpern lässt, findet nur, wer das Dokument bearbeitet. Darum gehört
zu jeder Einheit eine feste Besetzung von Gegenlesern. Sie berichten nur; sie
ändern nichts.

Herkunft: `docs/upgrade-v4.2/REVIEW-lernende-t2.md` (neun Lesende an 2.3.1 und
2.1.1, Abschnitt 8: woher die Fehler kamen).

**Was Gegenleser nicht leisten.** Es sind Modelle in einer Rolle: Sie lesen
Text, sehen kein Seitenbild und hören kein Audio. Zeitmarken und Verständlichkeit
der Audios hört ein Mensch gegen; Überlauf und Feldgrössen prüft `messen-v42`
und ein Blick aufs Papier; Zeiten sind Schätzungen. Der Bericht sagt das.

## 1. Besetzung

| Gegenleser | Anzahl | Bekommt | Fängt |
|---|---|---|---|
| **Lernende/r, Profil a** (stark, schnell, liest genau) | je Heft und vorhandener Spur | Seitentext des Hefts; Spur mit Medien: QR-Seite und Quelle; die genannten Lehrmittelseiten | Widersprüche zwischen Seiten, Aufträge, die das Material nicht trägt, vorweggenommene Entscheide |
| **Lernende/r am Auftragsbogen**, Profil a | 1 je Einheit | Seitentext des Auftragsbogens, dazu S. 4 und 8 beider Hefte | Schritte ohne Abgabe, Kriterien ohne Auftrag, Fall passt nicht zu den Heften |
| **Sweep** | 1 je Einheit | alle Dateien der Einheit | «ß», Platzhalter, Fall-Begriffe, Anrede |

Modell: Sonnet. Jede/r Lernende — auch am Auftragsbogen — gibt neben dem
Lesebericht **das eigene Produkt als Datei** ab (Abschnitt 4.1); daran hängt
die Lösbarkeitsprobe. Nicht zur festen Besetzung gehören das Profil «Deutsch
als Zweitsprache, B1» (Entscheid E31: Befunde zu Sprachlast und Zeitbedarf für
B1 werden nicht bearbeitet) und das Profil «wenig Lust, macht das Minimum»;
dieses lohnt sich für eine Stichprobe, wenn die Frage ist, was übersprungen
wird.

**Nicht Gegenleser, aber Teil jedes Laufs: die drei Audits**
(`references/audits.md`). Die Gegenleser finden Bearbeitbarkeit, nicht
Wahrheit; die Audits geben je eine Datei ab, die ein Skript prüft:

| Audit | Modell | Anzahl | Prüft | Gibt ab |
|---|---|---|---|---|
| **Lösungs-Audit** | Opus | je Heft und vorhandener Spur, dazu 1 für den Auftrag | jede Lösung gegen Quelle und Lehrmittel — **blind gelöst, dann verglichen** | `belege.json` |
| **Fakten-Audit** | Opus, mit Netz | 1 je Einheit | jede Rechts- und Sachaussage gegen Gesetz und Amt | `fakten.json` |
| **Lösbarkeitsprobe** | Sonnet | je Produkt eines Lernenden-Gegenlesers | ob ein sorgfältiges Produkt die höchste Stufe erreichen kann, der Form des Lösungsbilds entspricht und LF4 eine echte Wahl lässt | `probe.json` |

**Zahl der Agenten je Lauf**, bei zwei Heften mit je zwei Spuren: vier Lernende,
ein Bogen-Leser, ein Sweep (sechs, Sonnet) · fünf Lösungs-Audits (Opus) · ein
Fakten-Audit (Opus) · fünf Lösbarkeitsproben (Sonnet) — **siebzehn**. Bis
07.10.2026 waren es elf: Das Lösungs-Audit lief mit vier Agenten auf Sonnet,
las die Lösung zuerst und gab Prosa ab; die Lösbarkeitsprobe gab es nicht. Wer
wann läuft und was gleichzeitig laufen darf: `references/lauf.md` §4–§5.
(Herkunft: Rückblick `docs/upgrade-v4.2/RUECKBLICK-produktion-2026-10-06.md`
§4, §5.2, §5.3; ENTSCHEIDE E38, Stufe C.)

## 2. Zeitpunkt

**Nach der letzten Reparatur- oder Kürzungsrunde, nicht nach dem ersten grünen
Tor.** Reihenfolge im Lauf:

1. Tor grün im ersten Durchgang (`references/phase-9-tor.md` §1), Messung ohne
   Überlauf.
2. Gegenleser, alle parallel — daneben Lösungs-Audit und Fakten-Audit; die
   Lösbarkeitsprobe, sobald ein Produkt vorliegt (`references/audits.md` §1.3).
3. Befunde nachprüfen (Abschnitt 5) — auch jedes Urteil der Audits, das nicht
   «stimmt» bzw. «belegt» heisst, und jeden Befund der Probe —, Aufträge an die
   Executors, Tor neu.
4. Hat Schritt 3 sichtbaren Text geändert — auch nur durch Kürzen wegen
   Überlauf —, lesen die Lernenden-Gegenleser der betroffenen Dokumente die
   **geänderten Seiten** noch einmal. Erst wenn eine Runde nichts Sichtbares mehr
   ändert, ist das Gegenlesen abgeschlossen.

Höchstens drei Runden (wie `phase-9-tor.md` §2). Was danach offen ist, steht im
Bericht unter «Offen». Ändert Phase 10 noch Text oder eine Lösung, wird dort
erneut gelesen (`references/phase-10-abschluss.md` §4) — die Runden zählen
zusammen.

## 3. Paket für die Lernenden-Gegenleser

Der Orchestrator bereitet je Gegenleser **eine** Datei vor; der Gegenleser liest
nichts sonst.

```
node scripts/export-v42.mjs <ordner> --out <tmp>
node .claude/skills/bbw-hko-heft-v42/scripts/seitentext.mjs <tmp>
```

`seitentext.mjs` schreibt je Heft und für den Auftragsbogen den sichtbaren Text
mit Seitenmarken nach `<tmp>/text/`. Dazu ins Paket:

- **Spur mit Medien:** der Text der QR-Seite (`/m/<ordner>`, Abschnitt des
  Hefts) und der Ausschnitt aus `gewaehlt\quelle.md` im Archiv — **nur** Titel,
  Herausgeber, Datum, Typ, «Wer spricht» und der Text des Ausschnitts. Nicht:
  Prüfnachweis, Bauplan-Verweise, URLs, Hinweise an die Redaktion. Dazu der
  Satz, dass der Text als das Gehörte, Gesehene oder Gelesene gilt.
- **Lehrmittel:** nur die Seiten, die das Heft ausdrücklich nennt (Marker der
  Kapiteldatei), nicht das ganze Kapitel.
- **Auftragsbogen:** S. 4 und 8 beider Hefte als das, was die Person mitbringt.
- **Nie:** Begleiter, Lösungen, Bauplan, Prinzip, KN.

**Paket ansehen, bevor es hinausgeht.** Die Dateien `quelle.md` im Archiv haben
nicht alle dieselbe Form (mit oder ohne Abschnitt «Text des Ausschnitts», Text
nach der ersten Trennlinie, Absätze mit oder ohne Zwischentitel gezählt, eine
Grafik statt Text) und tragen Windows-Zeilenenden. Ein Paket, das nur den Kopf
der Quelle enthält, liefert eine wertlose Lesung: Steht der Text des
Ausschnitts wirklich darin? (Herkunft: Berichte `2026-10-04-321` §10,
`2026-10-04-411` §10, `2026-10-06-4.3.1_vielfalt_untersuchen` §10.)

## 4. Aufträge

### 4.1 Lernende (Heft und Auftragsbogen)

Rolle voranstellen: Lernende/r EFZ **im Lehrjahr der Einheit**, mit dem Profil
aus Abschnitt 1; die Person weiss nur, was im Paket steht. Das Lehrjahr steht
im Bauplan §1 (Zeile «Thema», für den kanonischen Lehrgang) und wird am
Datensatz des Lehrgangs nachgesehen — nie fest «1. Lehrjahr». Alter: 16 im
1. Lehrjahr, je Lehrjahr ein Jahr mehr. Gilt die Einheit für zwei Lehrgänge
mit verschiedenem Lehrjahr, zählt der kanonische. (Herkunft: Berichte
`2026-10-04-411` §10 — für Thema 4 falsch — und
`2026-10-06-5.2.1_gesetze_veraendern` §11; Rückblick §5.4.) Dann wörtlich:

> Arbeite das Dokument von Seite 1 bis zum Schluss durch, in der Rolle. Halte je
> Seite fest: (1) was ich hier tun soll, in meinen Worten — oder dass ich es
> nicht verstehe; (2) meine Antwort bzw. mein Produkt, so wie ich es wirklich
> schreiben würde; (3) wo ich hängen bleibe: Wort, Satz, Auftrag, fehlende
> Angabe, Widerspruch zu einer anderen Seite — mit Seite und exaktem Wortlaut in
> «…»; (4) geschätzte Zeit. Dann kritisch, aus meiner Sicht: Trägt die Quelle
> die Frage von Seite 3? Weiss ich bei jedem der fünf Schritte, was ich abgebe?
> Kann ich das Produkt mit dem, was auf den Seiten steht, wirklich herstellen?
> Hilft mir das Beispiel auf Seite 6 oder führt es mich in die Irre? Verstehe
> ich die Kriterien und kann ich mich einschätzen? Was würde ich überspringen?
> Beim Auftragsbogen zusätzlich: Brauche ich die Hefte wirklich? Weiss ich, was
> auf welche Seite gehört? Nenne am Schluss die drei Stellen, die mich am
> meisten gestört haben, mit Seite und Wortlaut. Nichts beschönigen, nichts
> reparieren, keine Verbesserungsvorschläge, keine Subagenten.
>
> Gib dazu dein **Produkt als eigene Datei** ab, so sorgfältig, wie du es als
> starke Lernende abgeben würdest — ohne Kommentar, ohne Kritik: (1) alles, was
> «Das geben Sie ab» verlangt, vollständig und in der verlangten Form (Tabelle
> als Tabelle, jede Zeile, jeder Satz); (2) deine Antwort auf die Frage der
> Seite 4 (LF4) im Wortlaut, und darunter eine Zeile «Ebenso vertretbar wäre:
> …» — oder «Eine zweite vertretbare Antwort sehe ich nicht, weil …»; (3) deine
> Selbsteinschätzung: je Kriterium die Punkte 0 bis 3 und die Stelle im Produkt,
> auf die du dich stützt. Beim Auftragsbogen: beide Produkte, und statt LF4 die
> Frage des Auftrags.

«Durcharbeiten und die Antworten hinschreiben» ist der Kern: Dass ein
Lehrmittel-Abschnitt eine Frage nicht trägt, fällt erst auf, wenn jemand den
Befund schreiben muss. «Lies und beurteile» findet das nicht.

Rückgabe: **zwei Dateien** im Temp-Ordner des Laufs, ausserhalb des Repos —
der Lesebericht (Tabelle je Seite mit vier Spalten, die kritischen Antworten,
die drei Stellen, die Zeitsumme; höchstens 120 Zeilen) und das Produkt
`<tmp>/gegenleser/produkt.<heft>.<spur>.md` (beim Auftragsbogen
`produkt.auftrag.beide.md`). An den Orchestrator zurück: beide Pfade und die
drei Stellen. Das Produkt geht unverändert an die Lösbarkeitsprobe
(`references/audits.md` §4) — der Lesebericht nicht. (Herkunft: Rückblick
§5.2, Zeile «Aufgabe nicht lösbar, keine echte Wahl»; Auftrag 10, Stufe C
Nr. 3; ENTSCHEIDE E38.)

### 4.2 Lösungs-Audit — steht in `audits.md`

Das Lösungs-Audit ist kein Gegenleser mehr: Es löst jede Aufgabe **blind** an
Quelle und Lehrmittel, vergleicht erst dann mit der Lösung und gibt
`belege.json` ab, die `check-belege` prüft. Paket, Auftrag, Urteile und die
Prüfung nach jeder Änderung einer Lösung: `references/audits.md` §2. Das
frühere Verfahren dieses Abschnitts (Sonnet, las die Lösung zuerst, gab Prosa
ab) gilt nicht mehr. (Herkunft: Rückblick §5.1, §5.3; ENTSCHEIDE E38, Stufe C.)

### 4.3 Sweep

Über alle Dateien: «ß», Platzhalter, Transliterationen
(`references/umlaute.md`), Fall-Begriffe (`references/sprache.md` §7.1) und
Anrede (`references/sprache.md`).

## 5. Nachprüfung — jeder Befund, bevor er zum Auftrag wird

Der Orchestrator prüft **jeden** Befund am Dokument: Steht der Wortlaut auf
dieser Seite? Stimmt der behauptete Widerspruch? Was nicht stimmt, fällt weg,
mit Vermerk im Bericht (im Review T2 waren es sechs, vier davon Artefakte der
Textaufbereitung). Dann ordnen:

| Kürzel | Ursache | Geht an |
|---|---|---|
| E | Fehler dieser Einheit | Executor der Datei, als genauer Auftrag |
| S | Regel oder Lücke der Skill, Skript, Methodenkarte, Lehrmittel | Bericht, Abschnitt «Offen» (`assets/bericht-template.md`) — im Lauf nicht ändern |
| R | fester Text oder Layout des Renderers | Bericht, wie S |
| Q | Quelle | Bericht; die Quelle wechselt der Lauf nicht |
| V | so gewollt (Sie-Form, Ich-Situation, feste Seitenfolge) | nur zählen |

Zuerst die sechs Fragen der Sinnprobe (`phase-9-tor.md` §3 Nr. 9) beantworten —
sie sind die Stellen, an denen 2.3.1 und 2.1.1 gefehlt haben.

## 6. Im Bericht

Je Gegenleser: Zahl der Befunde, was übernommen wurde (mit Auftrag an wen), was
nicht und warum, was nach Nachprüfung wegfiel. Dazu: in welcher Runde zuletzt
gelesen wurde, die Zeitsumme je Heft der Lernenden-Gegenleser gegen den
Seitenplan, und was kein Gegenleser prüfen konnte (Audio, Seitenbild). Die
Audits stehen im selben Abschnitt des Berichts, in der Form aus
`references/audits.md` §5.
