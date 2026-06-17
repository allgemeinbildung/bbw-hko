# Feedback Matthi — Mapping & Entscheidungen

**Einheit:** `1.1.1_lehrvertrag_orientieren` (EBA, *Mein Lehrvertrag — und wer mir hilft*)
**Skill:** `.claude/skills/hko-2er-EBA-set-generator/SKILL.md`
**Datum:** 2026-06-17 · Status: zur Entscheidung

Fix-Typ: **D** = nur Daten (diese Einheit) · **R** = Renderer/Label · **S** = Skill-Regel (damit künftige EBA-Einheiten es richtig machen)

---

## 1 — Prozentangaben (90 % / 100 %) sind für Lernende unklar

**Was Matthi meint:** Beim Handlungsprodukt steht «Mit Hilfe (90 %)» / «Selbstständig (100 %)». Unklar, was die Prozente bedeuten.

**In der Einheit:**
- `herausforderung_A.json` L296–297 `lernfortschritt.scaffold_90` / `scaffold_100`
- `herausforderung_B.json` L295–296 (das ist genau der Text im Screenshot: «Satzanfänge und Kontaktstellen-Liste stehen bereit.»)
- `lernfortschritt.kriterien[].gewicht_prozent` (je 25 %), `set.json` `dekontextualisierungs_aufgabe.gewicht_prozent` 15
- `kn.json` Niveaubänder «unter 90 % / 90 % / 100 %» (L239/243/247)
- `begleiter.md` L139–140 + L200–201 `[!differenzieren] 90 vs. 100`

**Im Skill:**
- Z. 895 — `[!differenzieren] 90 vs. 100`-Callout: «was alle bekommen (90 %) vs. schnellere Lernende (100 %)»
- Z. 1222 — Checklist «Niveaubänder unter 90 / 90 / 100 %»

**Diagnose:** Die 90/100-Logik ist eine **LP-Differenzierungs-Konvention** (gehört in den Begleiter), die in die SuS-Ansicht durchsickert. Im Lehrer-Dokument ist sie korrekt; auf dem Schülerblatt ohne Legende ist sie kryptisch.

**Optionen:** (a) % in der SuS-Ansicht ausblenden, Label → «Mit Hilfe» / «Selbstständig» ohne Zahl · (b) kurze Legende ergänzen · (c) so lassen. → Wenn (a): **R + S** (Renderer-Label + Skill-Regel, dass % nur im Begleiter erscheint).

**Entscheidung:** _______________

---

## 2 — KI-Tool wird nicht benannt

**Was Matthi meint:** Es steht nicht, *welches* KI-Tool genutzt werden soll. Vorschläge wären gut.

**In der Einheit:**
- `herausforderung_A.json` L124 `beschreibung` («mit einem KI-Tool»), L131–132 Schritt «Begriff nachschlagen → Dossier und KI-Tool nutzen»
- `dossier.json` `nuggets[].recherche.ki_beispiel` + `ki_lernen` (generische Prompts, kein Tool genannt)

**Im Skill:**
- `references/dossier-architecture.md` L111–131 — lehrt *wie* man die KI fragt, **nennt bewusst kein konkretes Tool**
- SKILL Z. 988 / 1003 / 1012 — `ki_beispiel` = `so_fragst_du` + `prompt`, keine Tool-Nennung

**Diagnose:** Tool-Neutralität ist im Skill **so gewollt**, war aber nie eine bewusste didaktische Entscheidung für EBA-Anfänger. Matthi hat recht, dass 1.-Lehrjahr-EBA konkrete Starthilfe braucht.

**Optionen:** (a) 2–3 Tools in `dossier.json einleitung` nennen (z. B. ein neues Feld «empfohlene Tools») · (b) als Begleiter-Hinweis für die LP · (c) so lassen. → (a)/(b) = **D + S**.

**Entscheidung:** _______________

---

## 3 — «Kontaktstellen-Liste stehen bereit», aber keine Liste im Dossier

**Was Matthi meint:** Herausforderung B verspricht eine Kontaktstellen-Liste, die es im Dossier nicht gibt. Falls die LP sie stellt → «stellt die Lehrperson zur Verfügung».

**In der Einheit:**
- `herausforderung_B.json` L295 `scaffold_90`: «Satzanfänge und **Kontaktstellen-Liste** stehen bereit.»
- Dossier-Deckung: `dossier.json` Nugget B-02 «Wer hilft mir? Die Kontaktstellen» — enthält Stellen im Fliesstext, aber **keine abgesetzte Liste**

**Im Skill:**
- EBA-OVERRIDE — **Wissen↔KN-Alignment** / `ERR_DOSSIER_GAP` (Z. 60–62): jede Leitfrage/jeder Anspruch braucht Dossier-Deckung. Hier verspricht das Scaffold ein Artefakt, das das Dossier nicht klar liefert.

**Optionen:** (a) Nugget B-02 um eine echte, abgesetzte Kontaktstellen-Liste ergänzen · (b) `scaffold_90` umformulieren zu «… stellt die Lehrperson zur Verfügung» · (c) beides. → **D**; ggf. **S** (Scaffold darf nur auf vorhandene Dossier-Artefakte verweisen).

**Entscheidung:** _______________

---

## 4 — Begriff «Nuggets» wird von Lernenden nicht verstanden

**Was Matthi meint:** Bei den Dossier-Verweisen steht «Nugget». Braucht einen verständlicheren Begriff.

**In der Einheit (durchgängig):**
- `herausforderung_A/B.json` `leitfragen[].knoten_ref` «Dossier | Nugget A-01» (hf_A L61/68/75/82) + `quellen_anker[].nugget_ref`
- `dossier.json` `nuggets[].id` + Renderer-Label · `kn.json`, `prinzip.json` `dossier_anker`, `begleiter.md`

**Im Skill (Kern-Nomenklatur):**
- Z. 47 — Anker-Format «Dossier | Nugget A-01» · Z. 199 / 243 / 377 / 540 / 625 · Renderer `DocEbaDossier.tsx` betitelt sie «Nugget»

**Diagnose:** «Nugget» ist tief im Skill, in den Daten **und** im Renderer verankert. Umbenennen ist der grösste Eingriff (betrifft alle 8 Dateien + Renderer-Label + Skill-Konvention + Anker-Format).

**Offene Frage an dich:** Zielbegriff? Vorschläge: «Wissensbaustein», «Info-Karte», «Abschnitt», «Wissen A-01». Sichtbares Label vs. interner Key (Key kann «nugget» bleiben, nur Anzeige ändern → kleinerer Eingriff).

**Optionen:** (a) nur sichtbares Label ändern (Renderer + Anker-Anzeige) — **R**, Daten-Keys bleiben · (b) alles umbenennen — **D + R + S**.

**Entscheidung:** _______________

---

## 5 — Du-Form an einigen Stellen ⚠ (Regelverstoss)

**Was Matthi meint:** An einigen Stellen wird noch die Du-Form verwendet.

**In der Einheit:**
- `dossier.json` `einleitung` L24–30: «deine Hilfe», «findest du», «Du musst …», «Hast du eine Frage?»
- Nugget-`inhalt`/`beispiel`: «regelt **deine** Lehre», «**Du** findest **deinen** Lohn …» (L38–39), «**Du** verstehst einen Punkt nicht?» (L140)
- `recherche.ki_beispiel.so_fragst_du` «**Sag**, wer **du** bist …» (L64/119), `ki_lernen.strategie` «**Lass dich** abfragen», «**Spiel** es durch» (L126/130)
- **Inkonsistent:** `selbst_pruefen` nutzt korrekt Sie («Schauen Sie …», L123)

**Im Skill — eindeutige Regel, hier verletzt:**
- SKILL Z. 55 + 550 (A2-Gate) — «**Sie-Form in Aufträgen** + ICH-Form im Narrativ»
- `references/a2-language-rules.md` L15–16, L54, L73–77, L89 (Beispiel: «du lesen» → «Lesen Sie»)
- `references/dossier-architecture.md` L55 / L117 / L131 — «**Sie-Form in Anweisungen**»

**Diagnose:** Das **Dossier** wurde grossteils in Du-Form generiert — das widerspricht der Skill-Regel. Das A2-Gate (Phase 7) hätte das erkennen müssen, scannt aber offenbar die Dossier-Prosa nicht auf Anrede-Form.

**Optionen:** (a) Dossier auf Sie umstellen (Daten) · (b) **zusätzlich** A2-Gate im Skill um einen Du-Form-Scan über Dossier-Felder erweitern. → **D + S** (S empfohlen, sonst wiederholt sich's).

**Entscheidung:** _______________

---

## 6 — Satz «Ich will nicht dumm wirken» unpassend

**Was Matthi meint:** Besser z. B. «Ich habe Angst, eine dumme Frage zu stellen.»

**In der Einheit:**
- `herausforderung_A.json` L53 `situation_text`: «… Ich will nicht dumm wirken. Aber ich will es richtig verstehen.»

**Im Skill:**
- ICH-Perspektive-Formel (Z. 1073–1080) + «Authentizität» (Z. 1062) — keine Regel dagegen, reine Ton-/Authentizitätsfrage
- A2-Regeln erlauben den Satz (kurz, einfach)

**Optionen:** (a) `situation_text` umformulieren (Matthis Vorschlag) · (b) so lassen. → **D**; optional **S** (Hinweis im Skill zu emotional authentischem, würdevollem Framing für EBA-Personae).

**Entscheidung:** _______________

---

## 7 — Leitfrage 3 passt nicht zur Situation (unlogisch)

**Was Matthi meint:** Situation sagt «Im Vertrag steht eine *andere* Dauer, als ich dachte», Frage 3 fragt aber «Was gilt, wenn im Vertrag *nichts anderes* steht?». Widerspruch. Frage anpassen oder Situation angleichen.

**In der Einheit:**
- `herausforderung_A.json` L76 `leitfragen[3].text`: «Prüfen Sie Ihren Fall. Was gilt, wenn im Vertrag nichts anderes steht?» (Anker: Nugget A-02)
- vs. L53 `situation_text`: «Im Vertrag steht eine andere Dauer, als ich dachte.»
- Dossier A-02 lehrt die **Default-Regel** (3 Mon., wenn nichts vereinbart) — daher die Frage-Formulierung; sie passt aber nicht zum geschilderten Fall (abweichende Klausel).

**Im Skill:**
- **Constructive Alignment** (Z. 1088–1090) + Coherence-Check 20 — Leitfrage muss auf die reale Situation anwendbar sein
- K-Level (Z. 1082–1086): LF3 = K3 «Anwenden / eigenen Fall prüfen»

**Diagnose:** Echte Alignment-Lücke: K3-Anwendungsfrage prüft den *Default-Fall*, die Situation beschreibt den *Abweichungs-Fall*.

**Optionen:** (a) Frage 3 → «Was gilt, wenn im Lehrvertrag eine andere Dauer steht als abgemacht?» (+ ggf. Nugget A-02 um diesen Fall ergänzen) · (b) `situation_text` an die Default-Frage angleichen. → **D**; ggf. **S** (Alignment-Check schärfen: Anwenden-LF muss den im `situation_text` geschilderten Fall treffen).

**Entscheidung:** _______________

---

## Zusammenfassung — Fix-Typ pro Punkt

| # | Thema | Fix-Typ | Aufwand |
|---|---|---|---|
| 1 | Prozentangaben unklar | R (+S) | klein |
| 2 | KI-Tool nicht benannt | D (+S) | klein |
| 3 | Kontaktstellen-Liste fehlt | D (+S) | klein |
| 4 | Begriff «Nuggets» | R *oder* D+R+S | klein–gross |
| 5 | Du-Form ⚠ Regelverstoss | D (+S) | mittel |
| 6 | «dumm wirken»-Satz | D | klein |
| 7 | Leitfrage 3 unlogisch | D (+S) | klein |

**Reines Daten-Fix der Einheit:** 2, 3, 5, 6, 7 (und 1/4 je nach Entscheid).
**Skill-Regel-Kandidaten (gegen Wiederholung):** 1 (% nur im Begleiter), 4 (Anker-Label), 5 (A2-Gate Du-Scan), 7 (Alignment-Check). Punkt 5 ist der einzige klare Bug.
