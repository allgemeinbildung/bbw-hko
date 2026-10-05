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
| **Lernende/r, Profil b** (Deutsch als Zweitsprache, B1, liest langsam, schlägt nichts nach) | je Heft einmal, in der Spur mit Medien (fehlt sie: ohne Medien) | wie oben | Sprachlast, unerklärte Wörter, Zeitbedarf |
| **Lernende/r am Auftragsbogen**, Profil a | 1 je Einheit | Seitentext des Auftragsbogens, dazu S. 4 und 8 beider Hefte | Schritte ohne Abgabe, Kriterien ohne Auftrag, Fall passt nicht zu den Heften |
| **Lösungs-Audit** | je Heft und vorhandener Spur | Dokument «Lösungen», Kapiteldatei bzw. Archivtext | falsche Fundstellen, Zeitmarken, Fakten |
| **Sweep** | 1 je Einheit | alle Dateien der Einheit | «ß», Platzhalter, gesperrte Wörter, Anrede |

Bei zwei Heften mit je zwei Spuren sind das vier Lernende a, zwei Lernende b,
ein Bogen-Leser, vier Audits und ein Sweep: zwölf. Modell: Sonnet. Das Profil
«wenig Lust, macht das Minimum» gehört nicht zur festen Besetzung; es lohnt sich
für eine Stichprobe, wenn die Frage ist, was übersprungen wird.

## 2. Zeitpunkt

**Nach der letzten Reparatur- oder Kürzungsrunde, nicht nach dem ersten grünen
Tor.** Reihenfolge im Lauf:

1. Tor grün (`references/phase-9-tor.md` §1), Messung ohne Überlauf.
2. Gegenleser, alle parallel.
3. Befunde nachprüfen (Abschnitt 5), Aufträge an die Executors, Tor neu.
4. Hat Schritt 3 sichtbaren Text geändert — auch nur durch Kürzen wegen
   Überlauf —, lesen die Lernenden-Gegenleser der betroffenen Dokumente die
   **geänderten Seiten** noch einmal. Erst wenn eine Runde nichts Sichtbares mehr
   ändert, ist das Gegenlesen abgeschlossen.

Höchstens drei Runden (wie `phase-9-tor.md` §2). Was danach offen ist, steht im
Bericht.

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

## 4. Aufträge

### 4.1 Lernende (Heft und Auftragsbogen)

Rolle voranstellen: Lernende/r im 1. Lehrjahr EFZ, 16 Jahre, mit dem Profil aus
Abschnitt 1; die Person weiss nur, was im Paket steht. Dann wörtlich:

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

«Durcharbeiten und die Antworten hinschreiben» ist der Kern: Dass ein
Lehrmittel-Abschnitt eine Frage nicht trägt, fällt erst auf, wenn jemand den
Befund schreiben muss. «Lies und beurteile» findet das nicht.

Rückgabe: eine Datei mit Tabelle je Seite (vier Spalten), den kritischen
Antworten, den drei Stellen und der Zeitsumme; höchstens 120 Zeilen. An den
Orchestrator zurück: Pfad und die drei Stellen.

### 4.2 Lösungs-Audit

Jede Lösung (LF1 bis LF4, Raster, Befund, Denkhilfe, Erwartungen der
Vertiefung, Lösungsbild, Abschluss) gegen Kapiteldatei bzw. Archivtext prüfen:
Fundstelle stimmt, Zeitmarke stimmt, nichts steht als Lehrmittelaussage da, was
Fallüberlegung ist. Je Befund: Feld, Wortlaut, was die Grundlage wirklich sagt.

### 4.3 Sweep

Über alle Dateien: «ß», Platzhalter, Transliterationen
(`references/umlaute.md`), gesperrte Wörter und Anrede
(`references/sprache.md`).

## 5. Nachprüfung — jeder Befund, bevor er zum Auftrag wird

Der Orchestrator prüft **jeden** Befund am Dokument: Steht der Wortlaut auf
dieser Seite? Stimmt der behauptete Widerspruch? Was nicht stimmt, fällt weg,
mit Vermerk im Bericht (im Review T2 waren es sechs, vier davon Artefakte der
Textaufbereitung). Dann ordnen:

| Kürzel | Ursache | Geht an |
|---|---|---|
| E | Fehler dieser Einheit | Executor der Datei, als genauer Auftrag |
| S | Regel oder Lücke der Skill, Methodenkarte | Bericht, Abschnitt «Fehler in Skill, Skript, Renderer» — im Lauf nicht ändern |
| R | fester Text oder Layout des Renderers | Bericht, wie S |
| Q | Quelle | Bericht; die Quelle wechselt der Lauf nicht |
| V | so gewollt (Sie-Form, Ich-Situation, feste Seitenfolge) | nur zählen |

Zuerst die sechs Fragen der Sinnprobe (`phase-9-tor.md` §3 Nr. 9) beantworten —
sie sind die Stellen, an denen 2.3.1 und 2.1.1 gefehlt haben.

## 6. Im Bericht

Je Gegenleser: Zahl der Befunde, was übernommen wurde (mit Auftrag an wen), was
nicht und warum, was nach Nachprüfung wegfiel. Dazu: in welcher Runde zuletzt
gelesen wurde, die Zeitsumme je Heft der Lernenden-Gegenleser gegen den
Seitenplan, und was kein Gegenleser prüfen konnte (Audio, Seitenbild).
