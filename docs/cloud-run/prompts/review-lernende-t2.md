# Prompt — Lernenden-Review der zwei T2-Einheiten

Lokal in einer Chat-Session im Ordner `D:\OS\dev\bbw-hko` (Branch `v42-skill`)
einfügen. Nichts wird geändert; Ergebnis ist ein Befundbericht.

```
Lernenden-Review der zwei Probe-Einheiten. Du orchestrierst, Sonnet-Subagenten
lesen. Es wird NICHTS geändert — keine Einheit, keine Skill, kein Skript.

GEGENSTAND
2 Einheiten × 2 Hefte (in jeder vorhandenen Spur) und je der Auftragsbogen:
- 2.3.1_anliegen_vertreten: Heft A und B, je ohne und mit Medien; Auftragsbogen
- 2.1.1_informationen_hinterfragen: Heft A (nur mit Medien), Heft B ohne und
  mit Medien; Auftragsbogen

VORBEREITUNG (du)
1. Exporte frisch erzeugen:
   node scripts/export-v42.mjs <ordner> --out docs/upgrade-v4.2/probe/<ordner>
2. Je Heft-HTML und Auftragsbogen-HTML den sichtbaren Text Seite für Seite in
   eine Textdatei im Scratchpad legen (Tags entfernen, Seitenumbrüche
   markieren). Die Lernenden bekommen nur das.
3. Für die Spur mit Medien: Der Text des Ausschnitts aus
   D:\OS\_lab\quellen-archiv\bbw-hko\<quellen-id>\gewaehlt\quelle.md gilt als
   das, was die Person hört, sieht oder liest (ein Subagent kann nichts
   abspielen). Dazu der Text der QR-Seite http://localhost:4321/m/<ordner>
   (Dev-Server «astro» starten).

FAN-OUT (Sonnet, model: sonnet, parallel, je ein Dokument)
Neun Subagenten: sieben Hefte, zwei Auftragsbogen. Jeder spielt EINE Person im
1. Lehrjahr EFZ, 16 Jahre, und bearbeitet das Dokument wirklich — schreibt also
die Antworten hin, die diese Person geben würde. Verteile drei Profile über die
neun (jedes mindestens zweimal):
 (a) stark, schnell, liest genau;
 (b) Deutsch als Zweitsprache, Niveau B1, liest langsam, schlägt nichts nach;
 (c) wenig Lust, liest quer, macht das Minimum.
Jeder bekommt: nur sein Dokument als Text; bei Medien-Heften Quelle und
QR-Seite; bei den Auftragsbogen zusätzlich die Seiten 4 und 8 der zwei Hefte
(das, was die Person aus den Heften mitbringt). KEIN Begleiter, KEINE Lösungen,
KEIN Bauplan, KEIN Lehrmittel ausser den Seiten, die das Heft ausdrücklich
nennt (dann die Kapiteldatei unter material/_lehrmittel/, nur diese Seiten).

Auftrag an jeden Subagenten (wörtlich mitgeben):
«Arbeite das Dokument von Seite 1 bis zum Schluss durch, in der Rolle. Halte
je Seite fest: (1) was ich hier tun soll, in meinen Worten — oder dass ich es
nicht verstehe; (2) meine Antwort bzw. mein Produkt, so wie ich es wirklich
schreiben würde; (3) wo ich hängen bleibe: Wort, Satz, Auftrag, fehlende
Angabe, Widerspruch zu einer anderen Seite; (4) geschätzte Zeit. Dann
kritisch, aus meiner Sicht: Trägt die Quelle die Frage von Seite 3? Weiss ich
bei jedem der fünf Schritte, was ich abgebe? Kann ich das Produkt mit dem, was
auf den Seiten steht, wirklich herstellen? Hilft mir das Beispiel auf Seite 6
oder führt es mich in die Irre? Verstehe ich die zwei Kriterien und kann ich
mich einschätzen? Was würde ich überspringen? Was ist langweilig, was ist zu
viel, was ist kindisch? Beim Auftragsbogen zusätzlich: Brauche ich die Hefte
wirklich? Weiss ich, was auf A2 und was auf A3 gehört? Nenne am Schluss die
drei Stellen, die mich am meisten gestört haben, mit Seite und Wortlaut.
Nichts beschönigen, nichts reparieren, keine Verbesserungsvorschläge für das
System, keine Subagenten.»
Rückgabe je Subagent: Tabelle je Seite (vier Spalten wie oben), die kritischen
Antworten, die drei Stellen. Höchstens 120 Zeilen, als Datei im Scratchpad;
an dich zurück nur der Pfad und die drei Stellen.

AUSWERTUNG (du)
1. Jeden Befund am Dokument nachprüfen (Seite, Wortlaut). Was nicht stimmt,
   fällt weg — mit Vermerk.
2. Ordnen nach Ursache: (E) Fehler dieser Einheit · (S) Regel oder Lücke der
   Skill bbw-hko-heft-v42 (trifft jede künftige Einheit) · (R) fester Text
   oder Layout des Renderers · (Q) Quelle · (V) Vorgabe, die so gewollt ist
   (Sie-Form, Ich-Situation, feste Seitenfolge — nur zählen).
3. Bekannte Befunde nicht neu melden, nur bestätigen: je Abschnitt «Fehler in
   Skill, Skript, Renderer» in docs/cloud-run/laeufe/2026-10-03-231/BERICHT.md
   und docs/cloud-run/laeufe/2026-10-03-211/BERICHT.md.
4. Bericht docs/upgrade-v4.2/REVIEW-lernende-t2.md: je Dokument die drei
   schwersten Befunde; Tabelle aller Befunde (Dokument, Seite, Wortlaut,
   Profil, Ursache E/S/R/Q/V, wie viele Lesende es traf); was alle drei Profile
   trifft; was nur Profil (b) trifft; Zeitsumme je Heft gegen die 135 Minuten
   des Seitenplans; und eine Rangliste: die zehn Änderungen mit der grössten
   Wirkung, je mit dem Ort, an dem sie zu machen wären (Einheit,
   Skill-Reference, Renderer-Datei).
   Keine Änderung ausführen. Kein Commit ausser diesem Bericht.
```
