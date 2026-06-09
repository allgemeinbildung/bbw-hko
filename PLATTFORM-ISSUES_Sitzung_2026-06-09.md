# Plattform-Issues — Kernteam-1 Sitzung 5 (09.06.2026)

Extrahiert aus der Sitzungsaufzeichnung. Alle Punkte mit Plattform-Bezug, gruppiert nach Kategorie.
Spalten: **Prio** (🔴 hoch / 🟠 mittel / 🟢 später) · **Owner** · **Status laut Sitzung**.

> Kontext-Rahmen aus der Sitzung: Ziel ist «etwas Lauffähiges bis zu den Herbstferien». Schulungen ab **22. Juni**, Pietro danach im DAG. Konsens: auf das Wesentliche fokussieren (2 Einheiten + Material einreichen + Feedback + Jahresplanung), Rest nachliefern.

---

## A. Technische Bugs / nicht getestete Seiten

| # | Issue | Prio | Owner | Status |
|---|---|---|---|---|
| A1 | **Datei-Upload im «Feedback nach dem Unterricht» funktioniert nicht.** Lehrperson soll angepasste Herausforderung hochladen können — Upload «funktioniert noch nicht». Das ist laut Pascal/Matthias *die* Kernneuerung (jede LP muss am Schluss hochladen/kommentieren/bewerten) → muss zwingend in die Schulung. | 🔴 | Pietro | Auf To-do; «wird bis DAG (22.6.) möglich sein» |
| A2 | **Feedback-Seite generell nicht richtig getestet.** «Die Seite ist noch nicht so getestet worden, vielleicht muss ich es nochmal schauen.» Voller Fragebogen nie durchgespielt. | 🔴 | Pietro | Offen |
| A3 | **«Material einreichen» / Einreichen-Seite nicht getestet.** Beim Absenden unsicher, ob alles greift. | 🟠 | Pietro | Offen |
| A4 | **Eingereichtes Material lässt sich nicht öffnen.** Tamara konnte Pietros Beispiel-Einreichung nicht öffnen; Zugang nur über Umweg «Details → Feedback». Navigations-/Detailansicht-Problem. | 🟠 | Pietro | Reproduziert in Sitzung |
| A5 | **Jahresplanung zeigt «Gastansicht» trotz Lehrer-Login.** «Ich bin in Gastansicht — wieso? Als Lehrer sollte das nicht sein.» Rollen-/Render-Bug. Folge: PDF-Druck war blockiert (Gast hat keinen Druck). | 🟠 | Pietro | Live aufgefallen |

---

## B. Nummerierung & Kompetenzebene (grösste Diskussion)

| # | Issue | Prio | Owner | Status |
|---|---|---|---|---|
| B1 | **Einheiten-Kachel zeigt nur «1.1.1», deckt aber faktisch 1.1.1 + 1.1.3 ab.** Christof: 1.1 ist *individueller Lebensbezug* (keine Kompetenz), 1.1.1 ist Kompetenzebene — nicht vermischen. Sarah: «Wenn dort 1.1 steht, muss es 1.1 abbilden.» Konsens: Titel oben lassen, **darunter Tags 1.1.1 + 1.1.3** anzeigen, damit klar ist was abgedeckt ist. | 🔴 | Pietro | Entscheid gefällt, Umsetzung offen («schnell modifizierbar») |
| B2 | **Kompetenznummer fehlt im Dokument selbst** (nur auf der Kachel). Christof: beim Ausdrucken «geht das verloren» → Nummer auch ins Auftrags-/Dossier-Dokument aufnehmen. | 🟠 | Pietro | Offen |
| B3 | **Übersicht «Was deckt diese Einheit ab?» fehlt.** LP muss erkennen, welche Sprach-/Gesellschaftsmodi & wie viel Zeit (15 Lekt. für 1.1) abgedeckt sind. Wunsch nach Abdeckungs-/Orientierungsanzeige auf Kompetenzebene. | 🟠 | Pietro/Team | Diskutiert |

---

## C. Onboarding (1.1.2) — Abgrenzung & Platzierung

| # | Issue | Prio | Owner | Status |
|---|---|---|---|---|
| C1 | **1.1.2 (Onboarding/IT einrichten) ist nicht abgedeckt** und in den 2 Einheiten ausgeklammert. Entscheid: vorerst **nicht** als kuratierte Einheit, sondern Verweis über Abschnitt «Weitere Angebote» (Links zu bestehenden Onboarding-/Nutzungsrichtlinien-PDFs). | 🟠 | Pietro/Christof | Entscheid: vorerst Verweis |
| C2 | **Verwechslungsgefahr kuratierte Einheit ↔ Schul-Onboarding.** Pascal/Matthias: LP könnten Onboarding-Kacheln fälschlich als bewertbare Einheiten wählen. → klare Trennung nötig (ggf. vorgelagerte Übersichtsseite: links «kuratierte Einheiten», rechts «schon vorhandenes Onboarding-Material»). | 🟠 | Team | Offen |
| C3 | **Onboarding-Einheit als «Goodie» nachliefern** bis Schulstart, falls Zeit (Pietro/Christof verantwortlich). **Nicht** vorab versprechen (Erwartungsdruck). Material ist bereits digitalisiert/als PDF vorhanden. | 🟢 | Pietro/Christof | Optional, später |
| C4 | **Erwartung «Material hinter Kachel».** Matthias: leere Kachel ohne Material wirkt wie Versprechen → eher als Hinweis/Link lösen, nicht als Kachel. | 🟢 | Team | Offen |

---

## D. Terminologie / Begriffsklärung (Christofs Traktandum, Kanton-Abgleich)

| # | Issue | Prio | Owner | Status |
|---|---|---|---|---|
| D1 | **Restliche «Situationen» → «Herausforderungen» umbenennen.** Grossteil erledigt, aber v.a. **Admin-Seite** noch ungepflegt; vereinzelt taucht «Situation» noch auf. | 🟠 | Pietro | Teilweise |
| D2 | **«Einheit» → «Unterrichtseinheit»** im Katalog (eindeutiger). | 🟢 | Pietro | Offen |
| D3 | **«Handlungsprodukt» vs. Kanton «Produkte».** An Kanton-Terminologie angleichen, sobald bekannt. | 🟠 | Pascal/Christof liefern Begriffe → Pietro passt an | Wartet auf Kanton |
| D4 | **«Werkschau» vs. «Portfolio».** Begriff unklar; wenn es ein Portfolio ist, so nennen (Kanton/Degen-Bezug). Pietro: ist eher Präsentation über Produkte, nicht klassisches Portfolio → Begriff final klären. | 🟠 | Pietro/Christof | Offen |
| D5 | **«Wissensnuggets/Wissensecken» vs. «Ressourcen».** Widersprüchlich: 1. Seite nennt «Ressourcen» (Lehrmittel-Kapitel), später «Wissensecken» (Leitfragen). Vereinheitlichen, evtl. beides «Ressourcen». | 🟢 | Pietro | Offen |
| D6 | **«du» vs. «Sie» inkonsistent.** Beschluss: «Sie», ausser in ICH-Situationen (Kompetenznachweis). Aber z.B. «entscheide begründet» noch in «du». | 🟠 | Pietro | Korrektur offen |
| D7 | **Glossar fehlt.** Christof wünscht aufklappbares Glossar mit ~10 Kernbegriffen — «wer Begriffe nicht versteht, hat keine Orientierung». (Matthias: nicht oberste Prio.) | 🟢 | Pietro/Christof | Idee |
| D8 | **QV-Verweise fehlen in der Anleitung.** Kein Bezug zum QV; Hinweis, dass bei Sprachmodus «Produktion mündlich» mündlich geprüft werden *muss*, und dass Sprach-/Gesellschaftspositionen mehrheitlich zusammen getestet werden. Für spätere Überarbeitung. | 🟢 | Pietro/Pascal | Gemerkt für später |

---

## E. Inhaltliche / Dokument-Fehler

| # | Issue | Prio | Owner | Status |
|---|---|---|---|---|
| E1 | **AViVA falsch ausgewiesen im Begleiter-/Lehrer-Dokument.** Steht «1 Lektion pro AViVA», richtig ist **3-Lektionen-Einheit (Wocheneinheit) pro AViVA**. Tamara: im Lehrer-Dokument falsch. Pietro: Label auf «eine Wocheneinheit» ändern. | 🟠 | Pietro/Tamara | Klärung offen |
| E2 | **Bewertungskriterien (2–3) im «Material einreichen»** evtl. herausnehmen — «sollten wir noch schauen». | 🟢 | Pietro/Team | Zu prüfen |
| E3 | **Lehrbewertung LP (8 Seiten) «nicht so durchdacht».** Wenig Anleitung, wie LP z.B. ein Fachgespräch als Prüfung führt. Kaum Änderungen gemacht. | 🟢 | Pietro/Team | Offen |
| E4 | **Feedback-Seite (Einreichen) inhaltlich nie richtig besprochen** — jemand soll drüberschauen und Feedback geben (Felder: Handlungssituation, KN-Format, Bewertungskriterien, Produkt). | 🟠 | Team (Review) | Offen |

---

## F. Rundgänge / Onboarding-Touren

| # | Issue | Prio | Owner | Status |
|---|---|---|---|---|
| F1 | **Doppelter Screenshot in Rundgang «Einheiten-Katalog»** (gleiches Bild für Schritt 1 & 2) — verwirrt. | 🟢 | Pietro | Bekannt |
| F2 | **Veraltetes «1.1.1» in Rundgang-Screenshots** — muss nach Umbau (B1) aktualisiert werden. | 🟢 | Pietro | Folgt aus B1 |

---

## G. Infrastruktur & Risiko

| # | Issue | Prio | Owner | Status |
|---|---|---|---|---|
| G1 | **Eigene Domain statt Vercel/Wurzel-App.** `bbw-hko.ch` wurde **in der Sitzung gekauft** (Pietro). Einrichtung bis Ende Woche; muss vor Sticker-Druck stehen (Adresse kommt auf Sticker). | 🔴 | Pietro | Gekauft, Einrichtung offen |
| G2 | **Klumpenrisiko: Pietro = Single Point of Failure.** «Im Moment absolutes Klumpenrisiko.» Plattform muss dokumentiert werden (für Reddy Kaidi / Vertretung), damit sie bei Ausfall nicht untergeht. | 🔴 | Pietro | Dokumentation geplant |
| G3 | **Lücken-Dashboard (Admin) aktuell wenig aussagekräftig** — nur Fake-Daten / 2 Einheiten. Wird relevant, sobald LP eigene Einheiten hochladen. Kein Bug, nur Reife. | 🟢 | — | Beobachten |

---

## Schnellüberblick — was vor dem 22. Juni zwingend ist

- **A1** Upload Feedback-Seite zum Laufen bringen (Kernneuerung, muss in Schulung)
- **A2/A3** Feedback- & Einreichen-Seite end-to-end testen
- **B1** Kachel-Tags 1.1.1 + 1.1.3 korrigieren (Glaubwürdigkeit gegenüber LP)
- **G1** Domain `bbw-hko.ch` einrichten (vor Sticker-Druck)
- **D6** du/Sie-Korrektur
- **A5** Gastansicht-Bug Jahresplanung

**Mittel/später:** B2, B3, C1–C4, D1/D3/D4, E1, E4
**Backlog/nach Herbstferien:** D2, D5, D7, D8, E2, E3, F1, F2, G2 (Doku), G3

---
*Quelle: Kernteam-1 Sitzung 5, 09.06.2026 (Aufzeichnung, 1:38:13).*
