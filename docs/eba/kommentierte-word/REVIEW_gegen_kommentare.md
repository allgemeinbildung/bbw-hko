# Review: 20 Kommentare (alte Einheit) ↔ zwei neue Units

**Geprüft am:** 3. Juli 2026
**Kommentar-Quelle:** `KOMMENTARE_ÜBERSICHT.md` (20 Kommentare, exportiert aus der **alten** 1.1.1-Word-Fassung, 29.06.–02.07.)
**Geprüfte neue Units:**

- `1.1.1_lehrvertrag_orientieren` — **v2.0.0**, EBA_2J, Status `entwurf` (Neugenerierung nach der Feedback-Sitzung)
- `1.1.2_unterlagen_ordnen` — **v1.0.0**, EBA_2J, Status `entwurf` (neue Schwester-Unit, gleiches Template)

Die Kommentare betreffen alle die **alte** Lehrvertrag-Einheit. Viele wurden durch die v2-Neugenerierung schon adressiert (die `prinzip.json` nennt die Sitzungs-Beschlüsse F1/F2 explizit). Unten steht pro Kommentar, was **erledigt**, was **offen**, und was **zu klären** ist. Das Schwester-Unit teilt Template und Struktur, darum gelten die Sprache-/Design-Punkte für beide.

---

## Ampel-Überblick

| # | Kommentar | Status |
|---|---|---|
| 1.1 / 1.4 | Lehrplan-Verortung in Auftrag HF-A/B | 🟢 in Daten erledigt · Rendering prüfen |
| 1.2 | Kompetenzversprechen im Begleiter ausweisen | 🟢 erledigt |
| 1.3 | KN-LP „nicht gemäss SLP" | 🟡 gegen SLP verifizieren |
| 2.1 | Begleiter leeres Feld | ⚪ unklar — welches Feld? |
| 2.2 | Info-Karten im Download | 🟡 ZIP-Bundle prüfen |
| 2.3 | Austausch Platzhalter-Texte | 🟢 erledigt |
| 3.1 | Englische Ausdrücke im Begleiter | 🔴 offen (beide Units) |
| 3.2 | „Vertragsfrage" definieren | 🟡 teilweise — Glossar-Eintrag fehlt |
| 4.1 / 4.2 | Herausforderung zu konstruiert (Probezeit-Feld) | 🟢 erledigt (Kern-Redesign) |
| 4.3 | Idee „Vorbereitung aufs Probezeitgespräch" | ⚪ nicht aufgenommen (optional) |
| 4.4 | Mehrere Probleme in einer Herausforderung | 🟢 erledigt |
| 4.5 | Fachgespräch 25–30 Min. zu lang / überhaupt Fachgespräch? | 🟡 Entscheid offen |
| 4.6 | Pädagogischer Inhalt unklar | 🟢 wohl erledigt · Stelle unklar |
| 4.7 | „Wo ist die dritte Herausforderung?" | 🟢 per Design (2er) · Konsens bestätigen |
| 5.1 | EFZ-Layout als Vorbild | ⚪ Design-Entscheid |
| 5.2 | Layout-Lösung | 🟢 entschieden — keine Aktion |
| 5.3 | Info-Karten-Texte gesammelt auf einer Leseseite | 🔴 nicht umgesetzt (gute Idee) |

🟢 erledigt · 🟡 fast / verifizieren · 🔴 offen · ⚪ Entscheid/Klärung

---

## 1. Curriculum-Verortung

**1.1 + 1.4 — Kompetenz inkl. Nummerierung im Auftrag (Pascal).** In den Daten **erledigt**: `herausforderung_A/B.json` tragen jetzt `nrlp.nr = "1.1.1"`, `lebensbezug = "1.1"`, `themen = ["T1"]`, Aspekte und SK. → **Zu prüfen:** ob das Herausforderungs-/Auftragsblatt (Template `default_4page_v2`) die Kompetenz-Nr sichtbar **im Kopf rendert**. Die Daten sind da; ob sie oben auf dem SuS-Blatt erscheinen, ist eine Rendering-Frage, die man an einem Test-Export verifizieren sollte.

**1.2 — Kompetenzversprechen im Begleiter (unbekannt).** **Erledigt.** Der neue Begleiter nennt die Kompetenz im Frontmatter (`1.1.1 — Ich kann …`) und in Sektion 1 („Das Kompetenzversprechen"). Zusätzlich steht der **volle offizielle nRLP-Text** in `dossier.json → kopf.kompetenz_text`. Optional: den verbatim-SLP-Satz auch im Begleiter-Kopf zeigen (aktuell steht dort das interne Kern-Versprechen).

**1.3 — KN-LP „nicht genau gemäss SLP" (unbekannt).** `dossier.json → kopf.kompetenz_text` verwendet jetzt den ausformulierten 1.1.1-Text. → **Verifizieren:** Wortlaut 1:1 gegen den EBA-Schullehrplan abgleichen (`public/slp/` bzw. `nrlp_*`), damit die Formulierung exakt SLP-konform ist.

---

## 2. Content-Lücken

**2.1 — Begleiter leeres Feld (Pascal).** ⚪ **Unklar.** Der neue Begleiter-Frontmatter ist vollständig ausgefüllt; das leere Feld stammte vermutlich aus dem alten Export. → **Klärung nötig:** Welches Feld meinte Pascal? Ohne Anker im alten Doc lässt sich das nicht zuordnen.

**2.2 — Info-Karten im Download (Pascal).** In v2 liegen alle Info-Karten strukturiert in `dossier.json` (6 Nuggets A-01…B-03). → **Zu prüfen:** Ob das kombinierte ZIP-Bundle (EinheitWorkbench) das Dossier tatsächlich mit-exportiert. Der ursprüngliche Kommentar deutet darauf hin, dass sie im alten Download fehlten — an einem echten Download gegenprüfen.

**2.3 — Austausch-Texte nur Platzhalter (Pascal).** **Erledigt.** `set.json → austausch_phase` enthält jetzt Volltext: Jigsaw Runde 1–3, Plenums-Variante und Einzelauftrag — Sie-Form, A2. Gilt für beide Units.

---

## 3. Sprache & Terminologie

**3.1 — Englische Ausdrücke ersetzen (Matthias, Begleiter).** 🔴 **Offen — in beiden Units.** Der neue Begleiter nutzt weiter englische/Fachjargon-Begriffe:

- **Nur LP-Dokument (vertretbar, aber Matthias störte sich daran):** Backward Design, Constructive Alignment, IPERKA, AViVA, Jigsaw, Moves, Troubleshooting, Scaffold(s), Set-Dokument.
- **Auch SuS-sichtbar (klar problematisch bei A2/EBA):** „Mindmap" (Herausforderungsblatt), „Feedback" (in KI-Lern-Prompts des Dossiers), „KI-Tool" (immerhin im Glossar erklärt).

→ **Entscheid nötig:** Welche Begriffe eindeutschen? Vorschlag: SuS-sichtbare zuerst (Mindmap → „Gedankenkarte", Feedback → „Rückmeldung"), im LP-Doc mindestens Jigsaw → „Gruppenpuzzle", Moves → „Schritte", Troubleshooting → „Wenn es klemmt".

**3.2 — „Vertragsfrage" definieren (Christof, KN-LP).** 🟡 **Teilweise.** Der Begriff kommt im KN (Mini-Case, Aufgabe 2: „Was ist hier Vertragsfrage, was Konflikt?") vor und wird im Begleiter-Erwartungshorizont erklärt — steht aber **nicht im A2-Glossar** (dort nur „Konflikt", „Unstimmigkeit"). → **Aktion:** Glossar-Eintrag „Vertragsfrage" ergänzen **oder** die Aufgabe umformulieren („Was ist eine Frage zum Vertrag, was ein Konflikt?").

---

## 4. Pädagogik & Auftragsformulierung

**4.1 + 4.2 — Herausforderung zu konstruiert, Probezeit-Feld (Christof/Matthias).** 🟢 **Erledigt — das war der Kern des Redesigns.** Beschluss F2 (in `prinzip.json`): kein einzelner Rechtsbegriff ist mehr Aufgabenkern. HF-A ist jetzt „Das komplexe Formular" (gliedern & filtern) mit offener Leitfrage „Wie verschaffe ich mir einen Überblick?" — kein Ausfüll-Feld „1–3 Monate" mehr. Probezeit ist nur noch Glossar-Ressource. Das adressiert Christofs „zu konstruiert" und Matthias' Ruf nach einer Alternative direkt.

**4.3 — „Spannend wäre die Vorbereitung aufs Probezeitgespräch" (Christof).** ⚪ **Nicht aufgenommen.** Die neue Unit dreht sich um Orientierung im Vertrag + Konfliktfall, nicht ums Probezeitgespräch. Christofs konkrete Idee ist eine gute Kandidatin für eine **eigene Herausforderungs-Variante oder Folge-Unit** — bewusst entscheiden, ob rein oder bewusst weggelassen.

**4.4 — Mehrere Probleme in einer Herausforderung (Christof).** 🟢 **Erledigt.** Jede Herausforderung trägt jetzt **eine** Konfliktart (A = Formular gliedern, B = Konfliktfall klären). Der gemeinsame Trade-off „Selbst klären vs. Hilfe holen" verbindet sie (Spiralen-Regel), ohne mehrere Probleme in einem Auftrag zu vermischen.

**4.5 — Fachgespräch 25–30 Min. zu lang / „überhaupt ein Fachgespräch?" (Christof).** 🟡 **Entscheid offen.** Das KN-Format steht in beiden Units weiter auf „**mündlich, 25–30 Min. total**" (15 Min. Vorbereitung + 10–15 Min. Gespräch). Das reine Gespräch ist also 10–15 Min. — das entschärft „zu lang" teilweise, aber das Label sagt weiter 25–30. Christofs zweite Frage — ob man bei EBA/A2 überhaupt von „Fachgespräch" sprechen soll — ist **nicht entschieden**. → **Team-Entscheid:** Label/Dauer bestätigen oder Format umbenennen (z. B. „Kurzgespräch / mündliche Prüfung").

**4.6 — Pädagogischer Inhalt unklar: „Sprache? Inhalt? Was ist die Idee?" (Christof).** 🟢 **Wohl erledigt.** Der neue KN hat je Frage/Aufgabe klaren Typ, K-Stufe und Erwartungshorizont (Stufe 3 / Stufe 4 / nicht Stufe 4). → Ohne genauen Anker im alten Doc unklar, welche Stelle gemeint war — beim nächsten Durchgang gegenlesen.

**4.7 — „Wo ist hier die dritte Herausforderung?" (Christof).** 🟢 **Per Design gelöst — Konsens bestätigen.** Die EBA-Units sind bewusst **2er-Sets** (`template: kn_2er_eba_default`, `set.json` mit nur HF A + B). Grund: EBA = 2 Lehrjahre. Die „fehlende" dritte Herausforderung ist **Absicht, keine Lücke**. → **Aktion:** Im Team kurz bestätigen, dass 2er der EBA-Standard ist, damit der Kommentar nicht wieder auftaucht.

---

## 5. Positive Rückmeldungen / Ideen

**5.1 — EFZ-Layout als Vorbild (Pascal).** ⚪ Design-Entscheid — prüfen, ob EFZ-Layout-Elemente ins EBA-Template übernommen werden sollen.

**5.2 — Layout-Lösung (Matthias).** 🟢 Am Dienstag entschieden, Abweichungen erlaubt. Keine Aktion.

**5.3 — Info-Karten-Texte gesammelt auf einer Leseseite (Pascal).** 🔴 **Nicht umgesetzt — gute Idee.** Pascal wünscht sich für das Leseverständnis-Training der EBA-Lernenden einen **Gesamttext**, der die vier (jetzt sechs) Info-Karten auf **einer** Seite bündelt. Das Dossier hat die Karten einzeln plus ein „Transfer-Wissensblatt" (Kurz-Zusammenfassung), aber keinen zusammenhängenden Lesetext aller Karten. → **Enhancement:** Eine „Gesamttext / Lesetext"-Seite ins Dossier-Template aufnehmen — kleiner Aufwand, hoher Nutzen fürs Lesetraining, gilt für beide Units.

---

## Empfohlene nächste Schritte

1. **Verifizieren (schnell):** Test-Export einer Unit ziehen und prüfen — (a) zeigt das Auftragsblatt die Kompetenz-Nr im Kopf (1.1/1.4)? (b) ist das Dossier im ZIP (2.2)? (c) Wortlaut Kompetenz-Text = SLP (1.3)?
2. **Offene Sprach-Punkte (beide Units):** Eindeutschungs-Liste beschliessen (3.1) + Glossar-Eintrag „Vertragsfrage" (3.2).
3. **Ein Team-Entscheid:** Fachgespräch-Dauer/-Label (4.5) und 2er-Konsens für EBA (4.7).
4. **Klärung von Pietro:** Welches leere Feld meinte 2.1? Soll die Probezeitgespräch-Idee (4.3) rein?
5. **Optionales Enhancement:** Gesamt-Lesetext im Dossier (5.3).

Kein Kommentar verlangt einen erneuten Kern-Umbau — die grossen didaktischen Punkte (4.1/4.2/4.4) sind durch v2 bereits gelöst. Offen sind primär Sprach-Feinschliff, drei Verifizierungen und zwei Team-Entscheide.
