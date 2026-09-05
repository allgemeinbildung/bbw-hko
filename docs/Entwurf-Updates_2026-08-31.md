# Entwurf-Updates zur Sichtung — Stand 2026-08-31

Drei Neuerungen an der Plattform, die aktuell nur für KT1 sichtbar sind (gelber
**Entwurf**-Badge). Alles andere rendert unverändert.

---

## 1. Herausforderungs-Bogen v3 (Layout)

**Pilotiert an:** 5.4.2 «Internationale Entscheide wirken» (EFZ 4-jährig) —
ganze Einheit auf `status: "entwurf"`.
**Ansehen:** `bbw-hko.ch/einheiten/5.4.2_internationale_entscheide_wirken_4j`,
Dokumenttyp «DOC-S · Auftrag».

1. **Statement-Block & Situations-Karte (Seite 1).** Die Herausforderung
   selbst (bisher schmale Versalien-Zeile) steht jetzt als grosser, farbig
   hinterlegter Block über die volle Breite; die Situation steht in einer
   gerahmten Karte statt in Fliesstext. Zweck: Auftrag und Ausgangslage sind
   das erste, was eine Lernperson begreifen muss — jetzt auch optisch die
   Hauptsache.
2. **Auftakt bekommt einen Typ.** Jedes Leitfragen-Intro ist neu als
   *Vorbereitung*, *Pfad* oder *Kontext* beschriftet. Nur *Vorbereitung* hat
   echte zeitliche Dringlichkeit (Handlung vor der ersten Lektion) und wandert
   deshalb als eigener Kasten auf Seite 1; *Pfad* und *Kontext* bleiben bei
   den Leitfragen, nur beschriftet.
3. **«liefert»-Zeile an jeder Leitfrage.** Kurzer kursiver Hinweis, welcher
   Teil des Handlungsprodukts aus der Antwort entsteht (z. B. *«→ liefert: das
   eigene Betriebsbeispiel für die Kette»*). Bisher erfuhren Lernende erst auf
   der Produktseite, wofür ihre Antworten gebraucht wurden.
4. **Scaffolding-Spalte neben jeder Leitfrage.** Schmale Spalte mit
   Arbeitshinweisen, Satzanfängen und einem Satz «Ins Produkt» — direkt am
   Arbeitsort statt in einem separaten Dokument. Dafür Schreibfeld um eine
   Linie gekürzt (8 statt 9).
5. **Selbstcheck-Seite.** Die Checkliste Vollständigkeit stand bisher auf
   Seite 1 (unpassend fürs Abschliessen); jetzt steht sie direkt vor den drei
   Reflexionsfragen auf der letzten Seite — Haken setzen vor Nachdenken.

**Gold-Version:** Beim Eintragen der «liefert»-Angaben kamen drei
Konstruktionslücken zum Vorschein und wurden geschlossen — je eine
zusätzliche Leitfrage-Leistung bei den Herausforderungen A, B und C, damit
jeder Produktschritt einen Leitfragen-Absender hat.

---

## 2. KI-Toolbox (Baustein `ki-fluency`)

**Entwurf auf:** `1.1.1_konflikt_kommunizieren`, `1.1.1_rechte_verstehen_nutzen`
(Rest der jeweiligen Einheit ist live; nur dieser Baustein ist Entwurf —
selektives Publizieren über `entwurf_komponenten`).

Vier neue Dokumente in der Workbench, komplementär zur Einheit:

- **KI-Auftrag 1 & 2** (`ki.json`) — je ein begründeter Prompting-Auftrag mit
  eigener Position **vor** dem KI-Einsatz, Prompt-Strategie und
  Gütekriterien. Beispiel: *«Die KI als Gegenseite im Konflikt»* — Lernende
  formulieren zuerst ihre eigene Position mit Rechtsbezug, lassen die KI dann
  als Berufsbildner/in die Gegenposition vertreten und prüfen jede
  Rechtsbehauptung im Lehrmittel.
- **KI-Lernprompt** (`lernprompt.json`) — Katalog von Prompting-Techniken mit
  Basis-/Fortgeschritten-Beispiel je Technik, plus zwei Prompt-Stacking-Ketten.
- **KI-Lernbegleiter** (`lernbegleiter.json`) — Lerncoach-Modus zur
  Repetition vor dem Kompetenznachweis: Selbsteinschätzung zuerst, danach
  Strategie-Karten (Abfragen/Retrieval, Selbst-erklären/Feynman,
  Übungsfall-Transfer, Feedback auf eigenen Text, Repetitionsplan) — jede mit
  Warnhinweis, wie man die KI nicht die Arbeit machen lässt.

**Didaktischer Zweck:** Die KI wird zum geprüften Sparringspartner statt zur
Antwortmaschine. Durchgängiges Prinzip: eigene Position/Einschätzung **zuerst
ohne KI**, dann KI-Einsatz mit klarer Rolle, dann Rückprüfung gegen
Lehrmittel/Recht.

---

## 3. Methoden-Karten (Werkzeugseite «05 · Methoden»)

**Live auf 5 Einheiten** (additiv, nicht Entwurf-gated):
`3.2.1_wahre_kosten` · `1.1.1_einstieg_interview` ·
`3.2.1_ernaehrung_nachhaltig_gestalten` ·
`5.4.2_internationale_entscheide_wirken_4j` ·
`1.1.1_ausbildung_erfassen_zeigen`.

**Was es ist.** Eine achte Bogenseite zwischen Auftrag (5) und Arbeitsfläche
(7) mit genau vier Werkzeug-Karten im 2×2-Raster — was gebraucht wird, um das
Handlungsprodukt herzustellen (Name, Schritte, Musterbeispiel mit neutralem
Sujet, typischer Fehler). Entsteht nur, wenn eine Herausforderung ein
`methoden`-Array führt; sonst bleibt der Bogen bei 7 Seiten.

**Didaktischer Zweck.** Eine Durchsicht aller 22 Handlungsprodukte der ersten
acht Einheiten zeigte: Wo es um Wissen geht, nennt jede Leitfrage ihr Kapitel
— wo Lernende etwas *herstellen* sollen, fehlte in 7 von 22 Fällen jeder
Verweis. Die Karten schliessen diese Lücke, teils mit Lehrmittel-Kapiteln
(durchgezogene Kontur), teils mit eigenen HKO-Karten für Produktarten, die das
Lehrmittel nicht abdeckt — mediale Produktion, gestaltete Kurzformate,
digitale Zusammenarbeit, Umgang mit KI (gestrichelte Kontur).

Volle Referenz: [`docs/methodenkartei.md`](methodenkartei.md).
