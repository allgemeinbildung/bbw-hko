# A2-Sprachregeln (EBA) — hartes ERR-Gate

**Geltung:** Alle SuS-gerichteten Prosa-Felder eines 2er-EBA-Sets — in den Herausforderungen
(`situation_text`, `leitfrage`, `leitfragen[].text`, `handlungsprodukt.*`, `reflexion_fragen`,
`mehrdeutigkeit.*`, `dekontextualisierung.*`), im Set (`austausch_phase.*`,
`dekontextualisierungs_aufgabe.*`), im KN (`hybrid_situation.text/leitfrage`,
`fragestruktur[].frage`, `aufgaben[].aufgabe`, `reflexionsfragen[]`, `rubrik_shared`-Stufen) und im
gesamten Dossier (`nuggets[].{titel,inhalt,beispiel}`, `sprachmodi_scaffolds[].*`,
`transfer_wissensblatt.*`, `glossar[].{erklaerung_a2,beispiel}`).

**Prinzip:** A2 wird **erzwungen, nicht erhofft.** Ein Pre-Write-Check laeuft analog zum
Umlaut/Eszett-Scan VOR jedem Schreiben eines SuS-Prosa-Felds. `ERR_*`-Codes blockieren den Write
(Auto-Fix oder Neuformulierung), `WARN_*`-Codes werden gemeldet und nach Moeglichkeit behoben.

**Kein Widerspruch zur Reform 2026-06:** Die **Sie-Form** in Auftraegen/Leitfragen bleibt — der
Hoeflichkeits-Imperativ ist A2-vertraeglich („Lesen Sie …", „Schreiben Sie …"). Die **ICH-Form** in
narrativer Prosa (`situation_text`, `hybrid_situation.text`, `reflexion_fragen`) bleibt. **A2 senkt
Komplexitaet, nicht Hoeflichkeit.**

---

## 1. Zaehlbare Regeln (die Gates)

| # | Regel | Schwelle | Code bei Verstoss | Typ |
|---|---|---|---|---|
| A1 | Mittlere Satzlaenge (Woerter/Satz, Feld-Durchschnitt) | <= 12 | `WARN_A2_SATZLAENGE` | WARN |
| A2 | Maximale Satzlaenge (laengster Satz im Feld) | <= 18 | `ERR_A2_SATZ_ZU_LANG` | ERR |
| A3 | Nebensaetze pro Satz | max. 1 | `WARN_A2_NEBENSATZKETTE` | WARN |
| A4 | Passiv-Konstruktionen | aktiv bevorzugen | `WARN_A2_PASSIV` | WARN |
| A5 | Fachbegriff ohne Glossar-Eintrag | jeder Fachbegriff steht im Dossier-Glossar | `ERR_A2_BEGRIFF_OHNE_GLOSSAR` | ERR |
| A6 | Nominalstil / Funktionsverbgefuege | vermeiden, Verben statt Nomen | `WARN_A2_NOMINALSTIL` | WARN |
| A7 | Konjunktiv II ausserhalb Hoeflichkeit | vermeiden | `WARN_A2_KONJUNKTIV` | WARN |
| A8 | Du-Anrede / Du-Imperativ in Auftrags-/Anweisungsfeldern | nur Sie-Form (ICH bleibt im Narrativ) | `ERR_ANREDE_DU` | ERR |

**Mess-Konvention (deterministisch, damit der Check reproduzierbar ist):**

- *Satz* = Sequenz bis `.`, `!`, `?` oder `:` als Listen-Einleiter. Abkuerzungen (z. B., usw., CHF) zaehlen nicht als Satzende.
- *Wort* = whitespace-getrennt; Bindestrich-Komposita und Zahlen je 1 Wort.
- *Nebensatz* = Teilsatz mit finitem Verb am Ende, eingeleitet durch Subjunktion (weil, dass, wenn, obwohl, damit, …) oder Relativpronomen (der/die/das/welche).
- *Fachbegriff* = inhaltstragendes Substantiv ausserhalb des A2-Grundwortschatzes bzw. jeder im Glossar gelistete Begriff; im Zweifel: aufnehmen.
- *Passiv* = „werden" + Partizip II. *Funktionsverbgefuege* = blasses Verb + Nomen (z. B. „zur Anwendung bringen" statt „anwenden").
- *Du-Anrede* = `du`, `dein/deine/deinen/deiner/deinem`, `dir`, `dich`, informelles `ihr/euch` als Anrede, sowie Du-Imperative ohne „Sie" (z. B. „Sag…", „Lass…", „Spiel…", „Tu…", „Schau…", „Frag…", „Stell…", „Lies…"). Greift in allen Auftrags-/Anweisungs-/Erklaerungsfeldern, **inkl. Dossier** (`einleitung.*`, `nuggets[].inhalt/beispiel`, `recherche.ki_beispiel.*`, `recherche.ki_lernen[].*`, `sprachmodi_scaffolds[].*`, `transfer_wissensblatt.*`, `glossar[].*`). KI-Prompts, die die Lernende an die KI richtet, siezen die KI ebenfalls. **JSON-Keys** (`so_fragst_du`, `so_gehst_du_vor`, `so_tauschst_du_aus`) sind ausgenommen — nur Werte zaehlen. Die ICH-Stimme im Narrativ (`situation_text` etc.) bleibt und ist **kein** Verstoss.

**Gate-Logik im Skill-Lauf:** Erst alle ERR fixen (Neuformulierung, bis bestanden), dann WARN
melden + nach Moeglichkeit beheben. Ein Feld gilt als A2-konform, wenn 0 ERR und (Soll) 0 WARN.
Resthaftes WARN wird im Phase-7-Report gelistet.

---

## 2. Beispiele (Positiv / Negativ-Paare) — zum Kalibrieren des Tons

Die Gates fangen Drift; die Paare kalibrieren das Sprachgefuehl. Pro Regel ein typisches Paar.

**A2 Satzlaenge (ein Gedanke pro Satz):**
- NEIN (24 W., 2 Nebensaetze): „Da der Lehrvertrag, den du am ersten Tag unterschreibst, viele Rechte und Pflichten regelt, solltest du ihn genau lesen, bevor du ihn unterzeichnest."
- JA (3 kurze Saetze): „Am ersten Tag unterschreiben Sie den Lehrvertrag. Er regelt Ihre Rechte und Pflichten. Lesen Sie ihn vorher genau."

**A3 Nebensatzketten (Ketten aufloesen):**
- NEIN: „Wenn du krank bist, musst du anrufen, weil der Betrieb wissen muss, dass du fehlst."
- JA: „Sind Sie krank? Rufen Sie im Betrieb an. So weiss der Betrieb Bescheid."

**A4 Passiv (aktiv + handelnde Person):**
- NEIN: „Die Probezeit kann verlaengert werden."
- JA: „Der Betrieb kann die Probezeit verlaengern."

**A5 Fachbegriff (immer mit Glossar + Beispiel):**
- NEIN: „Die Kuendigungsfrist betraegt sieben Tage." (Begriff ohne Erklaerung)
- JA: „Die Kuendigungsfrist ist die Zeit bis zum letzten Arbeitstag. Hier sind das sieben Tage." (+ Glossar-Eintrag „Kuendigungsfrist")

**A6 Nominalstil (Verben statt Nomen):**
- NEIN: „Zur Durchfuehrung der Anmeldung ist das Formular zu verwenden."
- JA: „Melden Sie sich mit dem Formular an."

**A7 Konjunktiv II (Indikativ ausserhalb Hoeflichkeit):**
- NEIN: „Es waere gut, wenn du den Vertrag pruefen wuerdest."
- JA: „Pruefen Sie den Vertrag." (Hoeflichkeits-„Sie" bleibt — das ist erlaubt.)

**Sie/ICH-Trennung (bleibt auf A2):**
- Auftrag/Leitfrage (Sie): „Vergleichen Sie die beiden Angebote."
- Narrativ/Reflexion (ICH): „Ich bin unsicher, welches Angebot besser ist."

**A8 Du-Anrede (Sie statt du — auch im Dossier):**
- NEIN: „Hast du eine Frage? Schau beim Anker nach." / „Sag, wer du bist." / „Lass dich abfragen." / „Tu so, als waere ich …"
- JA: „Haben Sie eine Frage? Schauen Sie beim Anker nach." / „Sagen Sie, wer Sie sind." / „Lassen Sie sich abfragen." / „Tun Sie so, als waere ich …"
- ICH bleibt: „Ich bin in der Lehre und habe meinen Vertrag vor mir." (kein Verstoss)

---

## 3. Kurz-Checkliste fuer den Generator (vor jedem SuS-Prosa-Write)

1. Jeden Satz zaehlen: keiner > 18 W. (ERR), Schnitt <= 12 W. (WARN).
2. Max. 1 Nebensatz pro Satz.
3. Aktiv statt Passiv; Verben statt Nominalstil.
4. Jeder Fachbegriff hat einen Glossar-Eintrag + Beispiel.
5. Kein Konjunktiv II ausser Hoeflichkeit.
6. Sie in Auftraegen, ICH im Narrativ — beides bleibt.
7. **Kein du/dein/dir/dich und keine Du-Imperative** in Auftrags-/Anweisungs-/Erklaerungsfeldern (ERR `ERR_ANREDE_DU`) — gilt auch fuer das ganze Dossier; JSON-Keys ausgenommen.
8. Echte Umlaute, kein ß.
