# D6 — «du» → «Sie» · Review-Liste (Stand 2026-06-09)

**Beschluss (Sitzung):** Anrede der **Lernenden** durchgängig mit «Sie», **ausser** in ICH-Perspektive-Texten (Situationstext/Persona) und in wörtlichen Zitaten.

**Methode:** Alle 14 Dateien der beiden Einheiten (`1.1.1_konflikt_kommunizieren/` + `1.1.1_rechte_verstehen_nutzen/`) wurden vollständig gelesen — nicht nur per Pronomen-Grep, weil rund die Hälfte der Anrede-Treffer **Imperative ohne Pronomen** sind («Entscheide», «Bearbeite», «Erkläre» …), die ein reiner Find/Replace auf `du|dein|dich|dir` komplett übersieht.

**Wichtig — nicht im Scope:** Der eigenständige 60er-`/situationen`-Katalog (`src/data/situationen/**`) ist **nicht** Teil dieser Liste. Hier geht es nur um die beiden Einheiten.

---

## Wie diese Liste gegliedert ist

| Kategorie | Bedeutung | Aktion |
|---|---|---|
| **A — Konvertieren** | Klare Anrede an die Lernende in Aufträgen / Leitfragen / Schritten / Hinweisen / KN-Aufgaben | Pronomen **und** Verbformen auf «Sie» umstellen |
| **C — Ausnehmen** | ICH-Situationstexte / Persona · Meta-Stellen («Du-Form», «Du-Botschaft») · wörtliche Zitate | **Nicht** anfassen |
| **D — Unklar / Pietro entscheidet** | Heikle Fälle, die einen inhaltlichen Entscheid brauchen | Vor Umsetzung klären |

**Status: ✅ ERLEDIGT (2026-06-09).** Kategorie A wurde angewendet, `npm run build:einheiten-index` + `npm run build` laufen grün. Verbform-Änderungen sind unten **fett** markiert (Gegenkontrolle). Eine abschliessende Grep-Kontrolle bestätigt: in den JSONs verbleiben nur noch die Kategorie-C-Ausnahmen (ICH-Texte, Zitate, «Du-Form»/«Du-Botschaft», Peer-Brief).

**Entscheide aus der Endkontrolle:**
- **Kategorie A** (Lernenden-Anrede in den JSONs) → **angewendet** (74 Feld-Edits; bei der Umsetzung kam 1 zuvor übersehene Stelle dazu, `herausforderung_B.json` L348, siehe unten).
- **D-1 (Begleiter)** → **«du» bleibt.** Die LP-Anrede in beiden `begleiter.md` wird **nicht** gesiezt (Pietro-Entscheid). Beide Dateien unverändert.
- **D-2 (Peer-Brief rechte_C L189/L191)** → **«du» bleibt** (Peer-Anrede, konsistent mit dem Begleiter).
- **D-3 (`sk_anker` konflikt_C L360)** → **erledigt** → 3. Person («… bevor sie antwortet»).

**Umfang:** 74 Kategorie-A-Edits (Einheit 1: 40 · Einheit 2: 34) + 1 D-3-Edit = 75 Edits über **10** JSON-Dateien. Die beiden `prinzip.json` (nur Meta-Begriffe) und beide `begleiter.md` (D-1) bleiben unverändert.

---

# Kategorie A — Konvertieren (klare Anrede-Fälle)

## Einheit 1 — `1.1.1_konflikt_kommunizieren/`

### `herausforderung_A.json`

- **L77** · `leitfragen_intro`
  «**Bearbeite** die vier Leitfragen schriftlich. **Nutze** das Lehrmittel …»
  → «**Bearbeiten Sie** die vier Leitfragen schriftlich. **Nutzen Sie** das Lehrmittel …»
- **L83** · LF1 `text`
  «… **Notiere** die fünf wichtigsten Punkte mit Markier-Symbolen aus Kap. 17.1.»
  → «… **Notieren Sie** die fünf wichtigsten Punkte …»
- **L90** · LF2 `text`
  «**Wende** die Regeln … auf **deine** Situation an. Welche zwei Punkte in der Anweisung **deines** Berufsbildner/in sind … unzulässig?»
  → «**Wenden Sie** die Regeln … auf **Ihre** Situation an. Welche zwei Punkte in der Anweisung **Ihres** Berufsbildner/in sind … unzulässig?»
- **L97** · LF3 `text`
  «**Entscheide** begründet: **Sprichst du** den Konflikt direkt … an, **suchst du** zuerst das Gespräch mit **deiner** Berufsbildungsverantwortlichen, oder **wendest du dich** an das Kantonale Amt …? **Nutze** die Konfliktfallregelung …»
  → «**Entscheiden Sie** begründet: **Sprechen Sie** den Konflikt direkt … an, **suchen Sie** zuerst das Gespräch mit **Ihrer** Berufsbildungsverantwortlichen, oder **wenden Sie sich** an das Kantonale Amt …? **Nutzen Sie** die Konfliktfallregelung …»
- **L104** · LF4 `text`
  «**Schreibe deine** Kern-Behauptung und eine sachliche, adressatengerechte Begründung …»
  → «**Schreiben Sie Ihre** Kern-Behauptung und eine sachliche, adressatengerechte Begründung …»
- **L170** · `handlungsprodukt.schritte[2].hint`
  «Ein einzelner Satz in Ich-Form, der **deine** Hauptaussage trägt. …»
  → «… der **Ihre** Hauptaussage trägt. …»
- **L174** · `handlungsprodukt.schritte[3].hint`
  «… mindestens einen OR-/ArG-Artikel aus **deiner** Mindmap zitieren. …»
  → «… aus **Ihrer** Mindmap zitieren. …»
- **L178** · `handlungsprodukt.schritte[4].hint`
  «Konkretes Beispiel aus **deiner** Woche (Inventur am Samstag, Überzeit) …»
  → «Konkretes Beispiel aus **Ihrer** Woche …»
- **L288** · `mehrdeutigkeit.hint`
  «… **Du hast** vertraglich verankerte Rechte, und **du bist** … angewiesen. Bewertet wird nicht, ob **du nachgibst** oder **kämpfst**, sondern wie sauber **du** beides **ausweist** und begründet **entscheidest**.»
  → «… **Sie haben** vertraglich verankerte Rechte, und **Sie sind** … angewiesen. Bewertet wird nicht, ob **Sie nachgeben** oder **kämpfen**, sondern wie sauber **Sie** beides **ausweisen** und begründet **entscheiden**.»

### `herausforderung_B.json`

- **L74** · `leitfragen_intro`
  «**Bearbeite** die vier Leitfragen schriftlich. **Nutze** das Lehrmittel Kap. 17.3 …»
  → «**Bearbeiten Sie** … **Nutzen Sie** das Lehrmittel Kap. 17.3 …»
- **L80** · LF1 `text`
  «**Erkläre** mit eigenen Worten den Aufbau eines Geschäftsbriefes …»
  → «**Erklären Sie** mit eigenen Worten den Aufbau eines Geschäftsbriefes …»
- **L87** · LF2 `text`
  «**Prüfe** anhand der Kriterien …: Welche Probleme entstehen, wenn **dein** Berufsbildner/in geschäftliche Konflikte über **deine** private WhatsApp-Nummer austrägt? **Nenne** drei.»
  → «**Prüfen Sie** anhand der Kriterien …: Welche Probleme entstehen, wenn **Ihr** Berufsbildner/in geschäftliche Konflikte über **Ihre** private WhatsApp-Nummer austrägt? **Nennen Sie** drei.»
- **L94** · LF3 `text` — *(das Leitbeispiel aus dem Handoff)*
  «**Entscheide** begründet zwischen den drei Optionen: … (2) sachliche Geschäftsmail an **deinen** Berufsbildner/in, … **Begründe deine** Wahl mit zwei Argumenten …»
  → «**Entscheiden Sie** begründet zwischen den drei Optionen: … (2) sachliche Geschäftsmail an **Ihren** Berufsbildner/in, … **Begründen Sie Ihre** Wahl mit zwei Argumenten …»
- **L101** · LF4 `text`
  «**Schreibe** (1) **deine** Kanalbegründung (2–3 Sätze) und (2) einen deeskalierenden Eröffnungssatz.»
  → «**Schreiben Sie** (1) **Ihre** Kanalbegründung (2–3 Sätze) und (2) einen deeskalierenden Eröffnungssatz.»
- **L162** · `handlungsprodukt.schritte[1].hint`
  «Spricht das Schreiben an **deinen** Berufsbildner/in direkt oder an die Werkstattleitung? …»
  → «Spricht das Schreiben an **Ihren** Berufsbildner/in direkt oder an die Werkstattleitung? …»
- **L166** · `handlungsprodukt.schritte[2].hint`
  «Vier-Spalten-Skizze, bevor **du** den Fliesstext **schreibst** (Kap. 17.3 S. 396).»
  → «Vier-Spalten-Skizze, bevor **Sie** den Fliesstext **schreiben** (Kap. 17.3 S. 396).»
- **L284** · `mehrdeutigkeit.hint`
  «… Bewertet wird, ob **du** die Kanal-Konsequenzen sauber **abwägst**.»
  → «… Bewertet wird, ob **Sie** die Kanal-Konsequenzen sauber **abwägen**.»
- **L348** · `lernfortschritt.scaffold_100` — *(bei der Erstliste übersehen, bei der Umsetzung ergänzt)*
  «Zusätzlich: **Prüfe**, ob **deine** Wahl mit den Compliance-Regeln **deines** Betriebs (z. B. Datenschutz, Personalreglement) vereinbar ist.»
  → «Zusätzlich: **Prüfen Sie**, ob **Ihre** Wahl mit den Compliance-Regeln **Ihres** Betriebs (z. B. Datenschutz, Personalreglement) vereinbar ist.»

### `herausforderung_C.json`

- **L73** · `leitfragen_intro`
  «**Bearbeite** … **Nutze** das Lehrmittel Kap. 19.1 …» → «**Bearbeiten Sie** … **Nutzen Sie** das Lehrmittel Kap. 19.1 …»
- **L79** · LF1 `text` — ⚠️ **Zitat im Satz unverändert lassen**
  «**Erkläre** die vier Ebenen … Welche Botschaft sendet **dein** Berufsbildner/in mit dem Satz «Du hörst einfach nicht zu.» auf jeder der vier Ebenen?»
  → «**Erklären Sie** die vier Ebenen … Welche Botschaft sendet **Ihr** Berufsbildner/in mit dem Satz «Du hörst einfach nicht zu.» …?»
  *(Das Zitat «Du hörst einfach nicht zu.» bleibt — Kategorie C.)*
- **L86** · LF2 `text` — ⚠️ **Meta-Begriff + Beispiel-Zitat unverändert lassen**
  «**Wende** die Regel «Ich-Botschaften statt Du-Botschaften» … auf drei konkrete Sätze **deines** Vorwurfs an. **Formuliere** jede Du-Botschaft in eine Ich-Botschaft um (z. B. «Ich empfinde es als …» statt «Du tust …»).»
  → «**Wenden Sie** die Regel «Ich-Botschaften statt Du-Botschaften» … auf drei konkrete Sätze **Ihres** Vorwurfs an. **Formulieren Sie** jede Du-Botschaft in eine Ich-Botschaft um (z. B. «Ich empfinde es als …» statt «Du tust …»).»
  *(«Du-Botschaft(en)» = Fachbegriff, «Du tust …» = Beispielzitat — beide bleiben.)*
- **L93** · LF3 `text`
  «**Entscheide** begründet: **Beginnst du** die 15 Minuten mit dem Vorfall (**deine** Sicht), … oder mit dem gemeinsamen Ziel (Win-Win)? **Stütze deine** Wahl auf zwei Regeln …»
  → «**Entscheiden Sie** begründet: **Beginnen Sie** die 15 Minuten mit dem Vorfall (**Ihre** Sicht), … oder mit dem gemeinsamen Ziel (Win-Win)? **Stützen Sie Ihre** Wahl auf zwei Regeln …»
- **L100** · LF4 `text`
  «**Formuliere** drei Ich-Botschaften für heikle Gesprächsmomente …»
  → «**Formulieren Sie** drei Ich-Botschaften für heikle Gesprächsmomente …»
- **L155** · `handlungsprodukt.schritte[0].hint`
  «… für jede Aussage notieren, was **du** auf welchem Ohr **hörst** (Kap. 19.2 S. 425-426).»
  → «… für jede Aussage notieren, was **Sie** auf welchem Ohr **hören** (Kap. 19.2 S. 425-426).»
- **L281** · `mehrdeutigkeit.hint`
  «**Schweigst du**, **verlierst du dein** Anliegen; **eskalierst du**, **verlierst du** die Lernbeziehung. Bewertet wird, wie sauber **du** beide Pole im Gespräch **hältst**.»
  → «**Schweigen Sie**, **verlieren Sie Ihr** Anliegen; **eskalieren Sie**, **verlieren Sie** die Lernbeziehung. Bewertet wird, wie sauber **Sie** beide Pole im Gespräch **halten**.»
- **L345** · `lernfortschritt.scaffold_100`
  «… mit eskalierender Reaktion des Berufsbildner/in — wie **reagierst du**, wenn er emotional wird?»
  → «… wie **reagieren Sie**, wenn er emotional wird?»

### `kn.json`

- **L65** · `kn_typen[0].fragestruktur[0].frage` (Fachgespräch Q1)
  «**Erkläre** mit eigenen Worten, welche Hauptpflichten **du** als Lernende/r **hast** … in **deinem** Fall greift …»
  → «**Erklären Sie** mit eigenen Worten, welche Hauptpflichten **Sie** als Lernende/r **haben** … in **Ihrem** Fall greift …»
- **L71** · Q2
  «**Wende** die Kanal-Logik … an: … wie **begründest du** das gegenüber **deinem** Berufsbildner/in?»
  → «**Wenden Sie** die Kanal-Logik … an: … wie **begründen Sie** das gegenüber **Ihrem** Berufsbildner/in?»
- **L77** · Q3
  «**Du musst dein** Recht … einfordern und gleichzeitig die Beziehung erhalten. **Bewertest du** beide Pole gleich — und warum?»
  → «**Sie müssen Ihr** Recht … einfordern und gleichzeitig die Beziehung erhalten. **Bewerten Sie** beide Pole gleich — und warum?»
- **L83** · Q4
  «**Vergleiche** diesen Vorfall mit der Aussprache aus **deiner** Herausforderung C: Was **übernimmst du** an Methode … — und wo **musst du** anders vorgehen …?»
  → «**Vergleichen Sie** diesen Vorfall mit der Aussprache aus **Ihrer** Herausforderung C: Was **übernehmen Sie** an Methode … — und wo **müssen Sie** anders vorgehen …?»
- **L89** · Q5
  «Welche ethische Werthaltung leitet **dich**, wenn der Berufsbildner/in **dich** auffordert …? **Begründe**, weshalb das nicht nur eine Rechtsfrage ist.»
  → «Welche ethische Werthaltung leitet **Sie**, wenn der Berufsbildner/in **Sie** auffordert …? **Begründen Sie**, weshalb das nicht nur eine Rechtsfrage ist.»
- **L123** · `kn_typen[1].aufgaben[0].aufgabe` (Mini Case A1)
  «**Erkläre** kurz (3-5 Sätze), welche zwei Punkte in der Aufforderung **deines** Berufsbildner/in …»
  → «**Erklären Sie** kurz (3-5 Sätze), welche zwei Punkte in der Aufforderung **Ihres** Berufsbildner/in …»
- **L129** · A2
  «… **Nenne** mindestens drei Argumente.» → «… **Nennen Sie** mindestens drei Argumente.»
- **L135** · A3
  «**Entscheide** begründet, welchen Kanal **du** für **deine** Antwort **wählst** und welche Eröffnung **du** … **verwendest**. **Formuliere** die Eröffnung als Ich-Botschaft …»
  → «**Entscheiden Sie** begründet, welchen Kanal **Sie** für **Ihre** Antwort **wählen** und welche Eröffnung **Sie** … **verwenden**. **Formulieren Sie** die Eröffnung als Ich-Botschaft …»
- **L141** · A4
  «**Verfasse** eine kurze Forderung in Ich-Form (4-6 Sätze), wie **du dir** die zukünftige Zusammenarbeit konkret **vorstellst** … **Berücksichtige** dabei sowohl **deine** Rechte als auch die Lernbeziehung …»
  → «**Verfassen Sie** eine kurze Forderung in Ich-Form (4-6 Sätze), wie **Sie sich** die zukünftige Zusammenarbeit konkret **vorstellen** … **Berücksichtigen Sie** dabei sowohl **Ihre** Rechte als auch die Lernbeziehung …»
  *(«Forderung in Ich-Form» bleibt — bezieht sich auf das Produkt, nicht auf die Anrede.)*
- **L172** · `kn_typen[2].reflexionsfragen[0]` (Werkschau RF1)
  «Welches Grundprinzip **hast du** in **deiner** Herausforderung gelernt — **formuliere** es in einem Satz.»
  → «Welches Grundprinzip **haben Sie** in **Ihrer** Herausforderung gelernt — **formulieren Sie** es in einem Satz.»
- **L173** · RF2
  «**Erkläre**, wie dieses Prinzip in der Hybrid-Herausforderung des KN sichtbar wird. …»
  → «**Erklären Sie**, wie dieses Prinzip … sichtbar wird. …»
- **L174** · RF3
  «Wann versagt das Prinzip — und was **hast du** durch die drei Herausforderungen … insgesamt darüber gelernt?»
  → «Wann versagt das Prinzip — und was **haben Sie** durch die drei Herausforderungen … insgesamt darüber gelernt?»

### `set.json`

- **L42** · `austausch_phase.einzelauftrag`
  «**Fasse** das gemeinsame Prinzip **deiner** drei Herausforderungen … in 5 Sätzen zusammen und **nenne** je ein Beispiel aus **deinem** Lehralltag.»
  → «**Fassen Sie** das gemeinsame Prinzip **Ihrer** drei Herausforderungen … in 5 Sätzen zusammen und **nennen Sie** je ein Beispiel aus **Ihrem** Lehralltag.»
- **L45** · `dekontextualisierungs_aufgabe.auftrag`
  «**Übertrage** das Kernprinzip aus **deinen** drei Herausforderungen auf einen neuen, selbst gewählten Kontext.»
  → «**Übertragen Sie** das Kernprinzip aus **Ihren** drei Herausforderungen auf einen neuen, selbst gewählten Kontext.»

---

## Einheit 2 — `1.1.1_rechte_verstehen_nutzen/`

### `herausforderung_A.json`

- **L77** · `leitfragen_intro`
  «**Bearbeite** … **Nutze** das Lehrmittel Kap. 1.4 …» → «**Bearbeiten Sie** … **Nutzen Sie** das Lehrmittel Kap. 1.4 …»
- **L83** · LF1 `text`
  «… **Notiere** mindestens fünf Punkte mit Markier-Symbolen aus Kap. 17.1 …»
  → «… **Notieren Sie** mindestens fünf Punkte …»
- **L90** · LF2 `text`
  «**Wende** die Regeln … auf die drei Fragen **deines** Mitlernenden an. …»
  → «**Wenden Sie** die Regeln … auf die drei Fragen **Ihres** Mitlernenden an. …»
- **L97** · LF3 `text`
  «**Entscheide** begründet: Ist es im Sinne des Datenschutzes … zulässig …?»
  → «**Entscheiden Sie** begründet: Ist es im Sinne des Datenschutzes … zulässig …?»
- **L104** · LF4 `text`
  «**Schreibe** einen Block **deines** Spickzettels als Muster …»
  → «**Schreiben Sie** einen Block **Ihres** Spickzettels als Muster …»
- **L176** · `handlungsprodukt.schritte[4].hint`
  «**Prüfe**: Sind alle drei Fragen des Mitlernenden mit mindestens einer Spickzettel-Zeile abgedeckt? …»
  → «**Prüfen Sie**: Sind alle drei Fragen des Mitlernenden … abgedeckt? …»
- **L286** · `mehrdeutigkeit.hint`
  «… Bewertet wird nicht die Wahl, sondern wie sauber **du** Quelle und eigene Formulierung im Spickzettel **kennzeichnest**.»
  → «… Bewertet wird nicht die Wahl, sondern wie sauber **Sie** Quelle und eigene Formulierung im Spickzettel **kennzeichnen**.»

### `herausforderung_B.json`

- **L81** · `leitfragen_intro`
  «**Bearbeite** … **Nutze** das Lehrmittel Kap. 1.3 …» → «**Bearbeiten Sie** … **Nutzen Sie** das Lehrmittel Kap. 1.3 …»
- **L87** · LF1 `text`
  «**Erkläre** mit eigenen Worten die drei Schritte der Methode aus Kap. 1.3 …»
  → «**Erklären Sie** mit eigenen Worten die drei Schritte der Methode aus Kap. 1.3 …»
  *(«bearbeitet man sie?» bleibt — «man», keine Anrede.)*
- **L94** · LF2 `text`
  «**Wende** das Schema auf Fall 1 (Samstagsfahrt) an: …» → «**Wenden Sie** das Schema auf Fall 1 (Samstagsfahrt) an: …»
- **L101** · LF3 `text`
  «**Entscheide** begründet: **Beantwortest du** Fall 2 … wie ein Anwalt … oder als beratende Mitlernende …? Welcher Weg respektiert **deine** Identität als Lernende … besser?»
  → «**Entscheiden Sie** begründet: **Beantworten Sie** Fall 2 … wie ein Anwalt … oder als beratende Mitlernende …? Welcher Weg respektiert **Ihre** Identität als Lernende … besser?»
- **L108** · LF4 `text`
  «**Schreibe** für einen Fall die Spalte «Rechtsfolge» als Wenn-dann-Mustersatz …»
  → «**Schreiben Sie** für einen Fall die Spalte «Rechtsfolge» …»
- **L180** · `handlungsprodukt.schritte[4].hint`
  «1-2 Sätze: Was **kannst du** als Mitlernende verlässlich sagen, wo **verweist du** auf BB, BBV oder kantonales Amt? …»
  → «1-2 Sätze: Was **können Sie** als Mitlernende verlässlich sagen, wo **verweisen Sie** auf BB, BBV oder kantonales Amt? …»
- **L290** · `mehrdeutigkeit.hint`
  «… Bewertet wird, ob **du** klar **markierst**, wo **dein** Wissen sicher ist und wo **du** auf weiterführende Stellen **verweist**.»
  → «… Bewertet wird, ob **Sie** klar **markieren**, wo **Ihr** Wissen sicher ist und wo **Sie** auf weiterführende Stellen **verweisen**.»

### `herausforderung_C.json`

- **L82** · `leitfragen_intro`
  «**Bearbeite** … **Nutze** das Lehrmittel Kap. 17.3 …» → «**Bearbeiten Sie** … **Nutzen Sie** das Lehrmittel Kap. 17.3 …»
- **L95** · LF2 `text`
  «**Wende** die E-Mail-Regeln aus Kap. 17.3 an: … **Nenne** mindestens drei Unterschiede.»
  → «**Wenden Sie** die E-Mail-Regeln aus Kap. 17.3 an: … **Nennen Sie** mindestens drei Unterschiede.»
- **L102** · LF3 `text`
  «**Entscheide** begründet: **Antwortest du** auf demselben Kanal … oder **wählst du** einen formelleren Kanal …? Welche zwei Argumente … stützen **deine** Wahl?»
  → «**Entscheiden Sie** begründet: **Antworten Sie** auf demselben Kanal … oder **wählen Sie** einen formelleren Kanal …? Welche zwei Argumente … stützen **Ihre** Wahl?»
- **L109** · LF4 `text`
  «**Schreibe** den Begründungs-Absatz **deines** Schreibens nach dem 3B-Schema …»
  → «**Schreiben Sie** den Begründungs-Absatz **Ihres** Schreibens nach dem 3B-Schema …»
- **L291** · `mehrdeutigkeit.hint`
  «… Bewertet wird, ob **du** in **deinem** Schreiben die Kanal- und Tempo-Entscheidung explizit **begründest** — nicht ob **du** WhatsApp oder E-Mail **wählst**.»
  → «… Bewertet wird, ob **Sie** in **Ihrem** Schreiben die Kanal- und Tempo-Entscheidung explizit **begründen** — nicht ob **Sie** WhatsApp oder E-Mail **wählen**.»
- **L88** · LF1 `text` — **keine Änderung nötig** (kein «du», kein du-Imperativ; «Was gehört in jeden Baustein …»). Nur zur Sicherheit notiert.

> ⚠️ **L189 / L191** (`scaffolding.satzanfaenge`) — **nicht** hier, sondern in **Kategorie D** (Brief an einen Mitlernenden = Peer-Anrede).

### `kn.json`

- **L65** · Fachgespräch Q1
  «**Erkläre** mit eigenen Worten, welche Regel im OR den Lohnabzug … betrifft (OR 321e) …»
  → «**Erklären Sie** mit eigenen Worten, welche Regel im OR den Lohnabzug … betrifft (OR 321e) …»
- **L71** · Q2
  «**Wende** das Schema … an: … welche Rechtsfolge **leitest du** ab?»
  → «**Wenden Sie** das Schema … an: … welche Rechtsfolge **leiten Sie** ab?»
- **L77** · Q3
  «**Du hast** nur eine Stunde Zeit … **Bewertest du** Tempo und Sorgfalt … gleich …? **Begründe**.»
  → «**Sie haben** nur eine Stunde Zeit … **Bewerten Sie** Tempo und Sorgfalt … gleich …? **Begründen Sie**.»
- **L83** · Q4
  «**Vergleiche** diese Anfrage mit dem Datenschutz-Block aus **deinem** Spickzettel …: Was **übernimmst du** an Methode …, und wo **musst du** anders vorgehen …?»
  → «**Vergleichen Sie** diese Anfrage mit dem Datenschutz-Block aus **Ihrem** Spickzettel …: Was **übernehmen Sie** an Methode …, und wo **müssen Sie** anders vorgehen …?»
- **L89** · Q5
  «Welche Verantwortung **übernimmst du**, wenn **du** als Mitlernende eine rechtliche Auskunft **gibst** …? **Begründe**, weshalb …»
  → «Welche Verantwortung **übernehmen Sie**, wenn **Sie** als Mitlernende eine rechtliche Auskunft **geben** …? **Begründen Sie**, weshalb …»
- **L123** · Mini Case A1
  «**Erkläre** kurz (3-5 Sätze), welche Regel im OR den Lohnabzug für Schäden betrifft (OR 321e) …»
  → «**Erklären Sie** kurz (3-5 Sätze), welche Regel im OR den Lohnabzug für Schäden betrifft (OR 321e) …»
- **L129** · A2
  «… **Nenne** mindestens drei Argumente.» → «… **Nennen Sie** mindestens drei Argumente.»
- **L135** · A3
  «**Entscheide** begründet: Welchen Kanal **wählst du**, und in welcher Reihenfolge **bearbeitest du** die Frage …? **Skizziere deine** ersten drei Schritte …»
  → «**Entscheiden Sie** begründet: Welchen Kanal **wählen Sie**, und in welcher Reihenfolge **bearbeiten Sie** die Frage …? **Skizzieren Sie Ihre** ersten drei Schritte …»
- **L141** · A4
  «**Verfasse** eine kurze Antwort an **deinen** Mitlernenden … **Zitiere** mindestens einen OR-Artikel und **markiere** ehrlich, wo **deine** Auskunft nicht abschliessend ist.»
  → «**Verfassen Sie** eine kurze Antwort an **Ihren** Mitlernenden … **Zitieren Sie** mindestens einen OR-Artikel und **markieren Sie** ehrlich, wo **Ihre** Auskunft nicht abschliessend ist.»
- **L172** · Werkschau RF1
  «Welches Grundprinzip **hast du** in **deiner** Herausforderung gelernt — **formuliere** es in einem Satz.»
  → «Welches Grundprinzip **haben Sie** in **Ihrer** Herausforderung gelernt — **formulieren Sie** es in einem Satz.»
- **L173** · RF2
  «**Erkläre**, wie dieses Prinzip … sichtbar wird. …» → «**Erklären Sie**, wie dieses Prinzip … sichtbar wird. …»
- **L174** · RF3
  «Wann versagt das Prinzip — und was **hast du** durch die drei Herausforderungen … gelernt?»
  → «Wann versagt das Prinzip — und was **haben Sie** durch die drei Herausforderungen … gelernt?»

### `set.json`

- **L37** · `austausch_phase.gruppenarbeit_jigsaw.runde_1`
  «Expertise teilen — 90 Sek. pro Person: Welche Quelle **hast du** genutzt, welche Methode **hast du** angewandt, welcher Trade-off war für **dich** am schwierigsten?»
  → «Expertise teilen — 90 Sek. pro Person: Welche Quelle **haben Sie** genutzt, welche Methode **haben Sie** angewandt, welcher Trade-off war für **Sie** am schwierigsten?»
- **L42** · `austausch_phase.einzelauftrag`
  «**Fasse** das gemeinsame Prinzip **deiner** drei Herausforderungen … zusammen und **nenne** je ein Beispiel, wo es **dir** im Lehralltag begegnet.»
  → «**Fassen Sie** das gemeinsame Prinzip **Ihrer** drei Herausforderungen … zusammen und **nennen Sie** je ein Beispiel, wo es **Ihnen** im Lehralltag begegnet.»
- **L45** · `dekontextualisierungs_aufgabe.auftrag`
  «**Übertrage** das Kernprinzip aus **deinen** drei Herausforderungen auf einen neuen, selbst gewählten Kontext.»
  → «**Übertragen Sie** das Kernprinzip aus **Ihren** drei Herausforderungen auf einen neuen, selbst gewählten Kontext.»

---

# Kategorie C — Ausnehmen (nicht anfassen)

Diese Stellen enthalten zwar «du/dein/Du-…», dürfen aber **nicht** umgestellt werden. Zur Kontrolle aufgelistet.

### C-1 · ICH-Perspektive — Situationstexte, Persona, Leitfragen, Reflexion, Kompetenzversprechen
Alle in der ICH-Stimme der Lernenden und damit per Beschluss ausgenommen. Enthalten teils «mein/meine», kein Anrede-«du»:
- `situation_text` in allen 6 Herausforderungen + `hybrid_situation.text` in beiden `kn.json`
- `leitfrage` (ICH-Leitfrage) in allen 6 Herausforderungen + `hybrid_situation.leitfrage`
- `reflexion_fragen[].text` (durchgängig ICH-Form, z. B. «Was ändere **ich** konkret …»)
- `nrlp.kompetenz_text` / `nrlp.lebensbezug_text`, `kern_kompetenzversprechen`, `mehrdeutigkeits_pflicht`, `prinzip.*anker_statement` / `dekontextualisierungs_anker` (Wer-/3.-Person-Form)
- `handlungsprodukt.beschreibung` / `format_detail` (ICH-Form: «Ich liefere …», «Ich erarbeite …»)

### C-2 · Wörtliche Zitate (innerhalb von ICH-Texten)
- `konflikt/herausforderung_B.json` **L58** — WhatsApp-Zitat «… Brauche bis 18 Uhr **deine** Sicht der Sache. …»
- `konflikt/herausforderung_C.json` **L57** — Zitat «**Du** hörst einfach nicht zu.» (auch wörtlich in LF1 **L79** zitiert)
- `konflikt/kn.json` **L27 / L46** — Zitate «**Du** bist halt noch nicht so weit» und «Erwarte **deine** Antwort bis 17 Uhr …»
- `rechte/herausforderung_C.json` **L62** — Zitat «Kannst **du** mir das in 5 Minuten zusammenfassen?»
- `rechte/kn.json` **L27** — WhatsApp-Zitat des Mitlernenden (ICH-Stimme des Zitierten)

### C-3 · Meta-Stellen — «Du-Form» / «Du-Botschaft» als Fachbegriff
«Du-Botschaft»/«Du-Form» bezeichnet die *grammatische Form*, nicht die Anrede:
- `konflikt/herausforderung_B.json` **L170, L189** — «**Du-Form** vermeiden …»
- `konflikt/herausforderung_C.json` **L86** («Ich-Botschaften statt **Du-Botschaften**» + Beispiel «Du tust …»), **L117** (Mindmap-Titel), **L158** (Schritt-Label), **L171** (ICH-Reflexion «… welche **Du-Botschaft** ist mir noch rausgerutscht?»), **L185** (Strategie), **L209** (ICH-Reflexion R3), **L221** (Bewertungsraster), **L351** («**Du-Botschafts**-Satz»)
- `konflikt/prinzip.json` **L155** — Konzept-Liste «Du-Botschaft»

---

# Kategorie D — Unklar / Pietro entscheidet

### D-1 · Die Begleit-Dokumente (`begleiter.md`) — ✅ ENTSCHIEDEN: «du» bleibt

> **Entscheid:** Die LP-Anrede in beiden `begleiter.md` wird **nicht** auf «Sie» umgestellt. Beide Dateien bleiben **unverändert**. Der «Sie»-Beschluss gilt nur für die Lernenden-Anrede in den Schüler-Materialien (Kategorie A).

Beide `begleiter.md` sind **an die Lehrperson** gerichtet und duzen **die LP**, nicht die Lernende — z. B. `konflikt/begleiter.md` L20: «Hier steht, **wie du** die Einheit führst … **Du sollst** die Einheit unterrichten können». Das ist eine **andere** Anredebeziehung als die, über die in der Sitzung entschieden wurde (Plattform → Lernende).

**Meine Empfehlung:** Den «Sie»-Beschluss **nur auf die Lernenden-Anrede** anwenden (= Kategorie A oben) und die LP-Duz-Anrede im Begleiter **vorerst belassen** — kollegiales «du» ist in Lehrpersonen-Begleitmaterial üblich und gewollt. Falls BBW einheitlich auch die LP siezen will, ist das ein **separater, bewusster Pass** (ca. 57 Pronomen-Zeilen im Konflikt-Begleiter, 34 im Rechte-Begleiter, plus Imperative).

**Zusätzliche Komplikation, falls ihr den Begleiter doch umstellt:** Die Begleiter enthalten **eingebettete Schüler-Anreden**, die dann *anders* behandelt werden müssten als die LP-Anrede:
- Situations-Kurzfassungen in der ICH/du-Schülerstimme: `konflikt/begleiter.md` L182 («**Du** bist Schreiner-Lernende …»), L193 («Was würdest **du** tun?»), L296, L408
- Schüler-Scaffold-Templates: Brief-/Mail-Gerüst (L347-349 «Was willst **du**?»), Ich-Botschaft-Satzanfänge, `rechte/begleiter.md` Brief-Gerüst L353-355 («**Du** hast mich gefragt …», «Ich möchte **dir** …»)

→ **Entscheid nötig:** (a) Begleiter bleibt komplett «du» · (b) nur LP-Anrede → «Sie», Schüler-Zitate/Templates bleiben · (c) alles «Sie». Ich setze das gern um, sobald die Richtung steht.

### D-2 · Peer-Anrede in `rechte/herausforderung_C.json` (Brief an Mitlernende) — ✅ ENTSCHIEDEN: «du» bleibt
Das Handlungsprodukt von Sit C ist ein **Schreiben an eine/n Mitlernende/n** (Peer). Die Satzanfänge dafür duzen folglich den Peer, nicht die Lernende selbst:
- **L189** · `scaffolding.satzanfaenge` — «**Ich schreibe dir**, weil …» (Anlass)
- **L191** · `scaffolding.satzanfaenge` — «Konkret heisst das für **deinen** Fall …» (Beispiel)

**Meine Empfehlung:** **belassen** — unter Mitlernenden ist «du» korrekt. Würde man hier «Sie» erzwingen, schriebe die Lernende ihrem Schulkollegen plötzlich formell. *Aber:* In der Situation soll das Schreiben ggf. an den Berufsbildner **weiterleitbar** sein — falls ihr es bewusst formell-distanziert wollt, könnte «Sie» gewollt sein. Darum hier nicht automatisch.
*(Hinweis: Dieselben Peer-Anreden stehen als Template auch im `rechte/begleiter.md` Brief-Gerüst → siehe D-1.)*

### D-3 · Interne Taxonomie-Annotation mit «du» in `konflikt/herausforderung_C.json` — ✅ ERLEDIGT (→ 3. Person)
- **L360** · `sk_anker[sk7].wo` — «… seinen Standpunkt nachzuvollziehen, bevor **du** antwortest.»
Das `sk_anker`-Feld ist **LP-/Taxonomie-Dokumentation** (wird Schülern nicht angezeigt) und sonst durchgängig in der 3. Person formuliert («die Lernende …»). Das «du» ist hier ein Ausreisser.

**Meine Empfehlung:** zur Konsistenz auf 3. Person umschreiben → «… bevor **sie** antwortet.» (sauberer als «Sie», weil das Feld sonst von der Lernenden in 3. Person spricht). Minimal, unkritisch.

---

# Umsetzung (erledigt)

1. ✅ Kategorie A angewendet (74 Feld-Edits, 10 Dateien) — Pronomen **und** Verbformen.
2. ✅ D-3 erledigt (3. Person). D-1 (Begleiter) + D-2 (Peer-Brief): «du» bleibt — keine Änderung.
3. ✅ `npm run build:einheiten-index` (2 sets written).
4. ✅ `npm run build` grün.
5. ✅ Grep-Endkontrolle: in den JSONs verbleiben nur Kategorie-C-Ausnahmen.

*Erstellt durch vollständiges Lesen aller 14 Dateien beider Einheiten — nicht per Pronomen-Grep, da die Imperativ-Anreden («Entscheide», «Bearbeite» …) sonst durchrutschen.*
