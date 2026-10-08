# Basis und Plus — wie viel in jedem Dokument steht

Gilt für **alle drei Formate** (v4.2, 3er-Set, EBA) und für jede neu erzeugte
Toolbox. Anlass: Rückmeldung der Lehrpersonen (Oktober 2026) — die Toolbox ist
für die Lernenden zu schwer, in der Sprache und in der Menge je Dokument.

Bisher stand alles in voller Dichte da, und der Liesmich bat die Lehrperson, die
Word-Datei selbst zu kürzen. Neu ist es umgekehrt: **Die kleine Fassung ist die
Vorgabe («Basis»). Was darüber hinausgeht, ist «Plus»** und steht auf eigenen
Seiten oder in einem eigenen Dokument — die Lehrperson legt es dazu, statt etwas
wegzuschneiden.

Die Form der Dateien bleibt (`assets/*.json`). Geändert sind Reihenfolge, Anzahl
und Länge — alles Dinge, die der Renderer aus den Daten liest.

---

## 1. Vier Grundsätze

**1. Fertige Prompts statt Prompts bauen.** In der Basis schreiben die Lernenden
keinen Prompt selbst. Sie bekommen einen fertigen Prompt mit **höchstens einer
Lücke** für ihren eigenen Text. Prompts selbst bauen (Baukasten) ist Plus.

**2. Der Prompt bestellt einfache Antworten.** Jeder fertige Prompt endet mit
einer **Sprachzeile**: Sie sagt der KI, wie sie antworten soll. Sonst ist das
Blatt einfach und die Antwort der KI trotzdem zu schwer. Pflichtteile:

- kurze, einfache Sätze;
- immer nur eine Frage, dann auf die Antwort warten (bei jedem Prompt, in dem die
  KI fragt oder abfragt) — oder eine feste Zahl Fragen, «eine nach der anderen»;
- «schreib meinen Text nicht neu» (bei jedem Prompt, der eine Rückmeldung auf
  einen eigenen Text verlangt).

Die Sprachzeile hat **eine feste Form** — in allen Einheiten gleich, jeder Auftrag
an die KI ein eigener Satz (B4 gilt auch im Prompt):

- KI fragt ohne feste Zahl (abfragen): «Antworte in kurzen, einfachen Sätzen. Stell
  immer nur eine Frage. Warte auf meine Antwort.»
- KI fragt mit fester Zahl: «Stell mir drei Fragen, eine nach der anderen. Antworte
  in kurzen, einfachen Sätzen.» Bei einer anderen Zahl als zwei oder drei (ein
  Übungs-Fachgespräch mit fünf Fragen) steht die Zahl im Auftrag und dahinter die
  Zeile ohne Zahl: «Stell mir fünf Fragen, von leicht zu schwer. Antworte in
  kurzen, einfachen Sätzen. Stell immer nur eine Frage. Warte auf meine Antwort.»
- KI fragt nicht: «Antworte in kurzen, einfachen Sätzen.»

Nicht mehr: «Stell immer nur eine Frage und warte auf meine Antwort.» (zwei
Aufträge in einem Satz).

Anrede an die KI nach `language-rules.md` (Du-Form); bei EBA entscheidet die
A2-Regelliste.

**3. Andocken an das, was schon da ist.** Ein Basis-Prompt arbeitet nur mit drei
Dingen, die die Lernenden aus der Einheit kennen:

| Andockpunkt | v4.2 | 3er-Set / EBA |
|---|---|---|
| die Begriffe | `set.glossar[].begriff` (ohne `spur`) | `prinzip.quellen_anker.konzepte` bzw. `dossier.glossar` |
| das eigene Produkt | Handlungsprodukt aus Heft A oder B (als Lücke) | Handlungsprodukt aus A/B/C (als Lücke) |
| die Kriterien | `feedback_kriterien[].kn_kriterium` | `kn.rubrik_shared.kriterien[].name` |

Die Basis führt **keinen neuen Fall** und **kein neues Kriterium** ein. Ein neuer
Fall kommt nur dort vor, wo er der Zweck ist: im Übungsfall für den KN
(`kn_typ_tracks`, Karte `mock_transfer`).

**4. Eine Aufgabe aufs Mal.** In der Basis prüft die KI die Arbeit der Lernenden
— nicht umgekehrt. Aufträge, in denen die Lernenden zugleich einen Inhalt
bearbeiten **und** die KI beurteilen (Gegenposition, Redaktion, Tribunal,
Prompt-Duell, Zeitkapsel), sind Plus. Das gilt für **jeden** Prompt der Basis, auch
für den zweiten: Die KI fragt oder zeigt auf eine Stelle der Arbeit — sie liefert
keinen Inhalt, den die Lernenden dann beurteilen müssten. Nicht: «Nenne mir eine
Folge meines Entscheids.» Sondern: «Welche meiner Antworten war am schwächsten?
Stell mir dazu eine Frage.»

**5. Die KI kennt die Einheit nicht.** Ein Wort aus dem Heft bedeutet für die KI
etwas anderes: «Rückstellung» ist für sie ein Bilanzposten, «Fakten-Check» und
«3B-Schema» kennt sie gar nicht, und was das Kriterium «Politisches Prinzip»
verlangt, erfindet sie. Vier Regeln, in Basis und Plus:

- **Thema mitgeben.** Jeder Prompt, in dem die KI Begriffe abfragt, eine Erklärung
  beurteilt oder einen Fall erfindet, nennt das Thema der Einheit in zwei bis fünf
  Wörtern («Thema: mein eigenes Budget.»).
- **Das Heft gilt, nicht die KI.** Wo die KI eine «Lösung» zu einem Begriff sagt
  (Karten `retrieval`, `feynman`, `repetitionsplan`), sagt die `warnung` der Karte,
  womit die Lernenden vergleichen — Glossar im Heft (v4.2), Lehrmittel mit Kapitel
  (3er-Set), Dossier (EBA) — und dass bei einem Unterschied das Heft gilt.
- **Kriterium nie nur als Name.** Nennt ein Prompt ein Kriterium, sagt er in
  höchstens acht Wörtern, was es verlangt (aus `kn.rubrik_shared.kriterien[].stufen`,
  dritte Stufe) — und höchstens zwei Kriterien je Prompt. Nicht: «Was fehlt beim
  Kriterium «Argumentation»?» Sondern: «Was fehlt bei der Argumentation: Entscheid,
  zwei Gründe, eine Folge?»
- **Die KI liefert keinen Stoff.** Sie schreibt keine Definitionen, keine Listen
  und keine Lernkarten-Antworten zum Stoff der Einheit. Sie fragt, zeigt Lücken und
  erfindet Übungsfälle. Lernkarten bestellt man als Fragen; die Antworten schreiben
  die Lernenden aus dem Glossar. **Im Plus** darf die KI Behauptungen aufstellen,
  die die Lernenden dann nachschlagen — ein Einwand mit dem Recht dahinter, eine
  Quelle mit Titel: Das Prüfen ist dort die Aufgabe. Beim Muster `ai_redaktion`
schreibt die KI einen kurzen Entwurf, und die Lernenden prüfen ihn: Das ist
erlaubt, wenn ihre eigene Antwort **vorher ohne KI** dasteht und der Entwurf nur
Gegenstand der Prüfung ist, nie die Abgabe. Auch im Plus liefert sie nicht,
  was die Lernenden selbst herstellen sollen oder was ein Kriterium ihnen
  zuschreibt.

→ Check **BP8**.

---

## 2. Was Basis ist und wo es steht

| Dokument | Basis | Plus |
|---|---|---|
| `ki.json` | **`ki_1`** — der Basis-Auftrag → **2 Seiten** | **`ki_2`** — der Plus-Auftrag → 3 Seiten |
| `lernprompt.json` | Technik 1 + 2 und `stacking_seite_1` → **Seite 1** | Technik 3 + 4 und `stacking_seite_2` → Seiten 2-3 |
| `lernbegleiter.json` | Karte 1 + 2 → **Seite 1**; KN-Seite → **Seite 2** | Karte 3-5 → Seite 3 |

Die Seiten ergeben sich aus den Daten — der Renderer erkennt die Basis-Form am
Versionsstempel `2.x` **und** an dem, was fehlt (`src/lib/einheiten/ki-toolbox.ts`,
E41/E42). Eine Toolbox mit Stempel 1.x behält Seitenfolge und Inhalt unverändert.

Unter jedem Prompt der zwei Basis-Karten und am Schluss der KN-Seite zeichnet der
Renderer drei kleine Schreibfelder («Das hat die KI gesagt · Das stimmt · Das
stimmt nicht» bzw. «Mein Übungsfall · Das konnte ich · Das übe ich noch»). Sie
brauchen kein Datenfeld — aber sie brauchen den Platz: Wer die Längen in §5
überschreitet, schiebt sie über den Seitenrand.

- **KI-Auftrag:** höchstens 3 Schritte, 2 Reflexionsfragen und 3 Prompt-Zeilen →
  zwei Seiten (Auftrag mit Prompts und Schritten · Kontrolle und Reflexion). Sonst
  drei.
- **Lernprompt:** beide Techniken eines Blocks ohne `beispiel_fortgeschritten` und
  ohne `baukasten` → Karten und «Nachfragen» auf einer Seite. Sonst zwei.
- **Lernbegleiter:** Karte 1 + 2 ohne `prompt_fortgeschritten` → die KN-Seite folgt
  direkt auf Seite 1, die übrigen Karten stehen als «Plus» am Schluss.

**Die Reihenfolge und das Weglassen unten sind darum verbindlich** — sie
entscheiden, was die Lehrperson als Basis druckt. Schreibfelder nehmen den freien
Platz einer Seite auf.

**Versionsstempel.** Eine Toolbox in diesem Zuschnitt trägt in allen drei
JSON-Dateien `"version": "2.0.0"`. Daran erkennt `scripts/check-ki-toolbox.mjs`,
dass es sie prüfen soll; Toolboxen mit Version 1.x überspringt es.

---

## 3. `ki.json`

Auswahl der zwei Muster: `ki-scoring.md` (`ki_1` fest `ai_lernassistent`, ausser ein Handlungsprodukt ist selbst ein Entscheid; Punkte nur fürs Plus).

| Feld | `ki_1` (Basis) | `ki_2` (Plus) |
|---|---|---|
| `titel` | höchstens 6 Wörter | höchstens 8 Wörter, beginnt mit «Plus: » |
| `ziel` | 1 Satz | 1 Satz |
| `bezug` | höchstens 2 Sätze, zusammen ≤ 35 Wörter; nennt alle Herausforderungen und das Prinzip in einfachen Worten | wie Basis |
| `auftrag` | höchstens 3 Sätze, zusammen ≤ 45 Wörter; einer erklärt «Prompt» («Ein Prompt ist Ihre Eingabe an die KI.») | höchstens 5 Sätze, zusammen ≤ 80 Wörter; einer erklärt «Prompt» — der Plus-Auftrag ist ein eigenes Blatt |
| `ki_frei_vorher` | höchstens 2 Sätze | höchstens 2 Sätze |
| `prompt_strategie` | **genau 3**: «Prompt 1: «…»» · «Prompt 2, nach der dritten Frage: «…»» · «Prüfen: …» (1-2 kurze Sätze, siehe «Nachschlagen mit Ausweg»). Beide Prompts fertig, mit Sprachzeile, höchstens eine Lücke — Aufbau siehe unten | 3-4; mindestens ein fertiger Zweit-Prompt; jede weitere Zeile sagt etwas, das die Lernenden bei einem fertigen Prompt wirklich tun können |
| `schritte` | **genau 3**: ohne KI · Prompt 1 · Prompt 2 und entscheiden — Aufbau siehe unten | 4-5; nachschlagen steht **vor** dem Urteilen; der letzte verarbeitet das KI-Ergebnis kritisch |
| `guetekriterien` | **genau 3**; eines prüft das Nachschlagen (P5) und ist auch erfüllbar, wenn die KI nur gefragt hat | 3-4 |
| `reflexion` | **genau 2** | 3 |

**Aufbau des Basis-Auftrags (verbindlich).** Im Basis-Auftrag fragt die KI, die
Lernenden antworten. Damit das ein Ende hat und zusammenpasst:

| Teil | Regel | Beispiel |
|---|---|---|
| Prompt 1 | Die KI stellt **drei** Fragen zum eigenen Produkt oder Entscheid, eine nach der anderen | «Du bist mein Lerncoach. Mein Entscheid: [mein Entscheid mit Grund]. Stell mir dazu drei Fragen, eine nach der anderen. Sag mir nicht, was ich tun soll. Antworte in kurzen, einfachen Sätzen.» |
| Vorspann zu Prompt 2 | «Prompt 2, nach der dritten Frage:» — nie «wenn die KI geantwortet hat» (die KI fragt) | |
| Prompt 2 | Die KI zeigt auf **eine Stelle der Antworten** und fragt nach; sie liefert keinen Inhalt (§1 Nr. 4) | «Welche meiner drei Antworten war am schwächsten? Stell mir dazu eine letzte Frage. Sag mir nicht, was ich tun soll. Antworte in kurzen, einfachen Sätzen.» |
| «Prüfen:» | Bedingt formuliert und mit Ort: was nachschlagen, wo — und der Ausweg (unten) | «Prüfen: Nennt die KI eine Zahl oder eine Regel, schlagen Sie sie im Lehrmittel nach. Steht sie dort nicht, übernehmen Sie sie nicht.» |
| Schritt 1 | ohne KI — dasselbe wie `ki_frei_vorher`, in einem Satz | «Schreiben Sie Ihren Entscheid und Ihren Grund ohne KI auf.» |
| Schritt 2 | nennt **Prompt 1** und die drei Fragen | «Beantworten Sie mit Prompt 1 die drei Fragen der KI.» |
| Schritt 3 | nennt **Prompt 2** und den Entscheid | «Entscheiden Sie nach Prompt 2, was Sie ändern.» |
| Kriterium Nachschlagen | erfüllbar in beiden Fällen | «Nachgeschlagen — Jede Angabe der KI haben Sie nachgeschlagen. Hat die KI nur gefragt, gilt das als erfüllt.» |

Vier Ergänzungen aus der zweiten Lesung (07.10.2026):

- **Die Lücke sagt, was hineinkommt.** «[mein Produkt]» lässt offen, ob der Name
  oder der ganze Text gemeint ist — und niemand tippt 300 handgeschriebene Wörter
  ab. Die Lücke nennt einen **kleinen, benannten Teil**: «[meine wichtigste
  Aussage]», «[mein erster Satz]», «[meine Regel mit Grund]». `auftrag` oder
  `ki_frei_vorher` sagt in denselben Worten, was die Lernenden dafür bereitlegen.
  **Jedes Blatt erklärt seine Lücke selbst:** Steht dieselbe Lücke auch im
  Lernprompt, sagt dort ein `thema_bezug`, woher ihr Inhalt kommt («Ihre wichtigste
  Aussage steht in Ihrem Positionspapier, Schreiben oder Drehbuch.») — der
  Lernprompt wird vor den Aufträgen eingesetzt. Zwei verschiedene Dinge bekommen
  nicht fast denselben Lückennamen.
- **Keine Namen in den Prompt.** Geben die Lernenden eigenen Text ein, steht der
  Satz «Schreiben Sie keine Namen in den Prompt.» einmal auf **jedem** Blatt — im
  Basis- und im Plus-Auftrag als zweiter Satz von `ki_frei_vorher`. Im Lernprompt
  steht er in der `warnung` von «Kontext geben», im Lernbegleiter in der `warnung`
  der Karte «Rückmeldung holen» (dort geht eigener Text in die KI). Der Liesmich
  nennt genau diese Stellen — er schreibt nicht «auf jedem Blatt», denn die Karte
  steht auf der Plus-Seite.
- **Nachschlagen mit Ausweg.** Die Zeile «Prüfen:» darf zwei kurze Sätze haben
  (zusammen ≤ 28 Wörter): **was** nachgeschlagen wird und wo — und was die
  Lernenden tun, wenn die Angabe dort nicht steht. «Prüfen: Nennt die KI ein Recht
  oder eine Regel, schlagen Sie die Angabe im Lehrmittel nach (Kap. 1.4). Steht
  sie dort nicht, übernehmen Sie sie nicht.» Zwei Fallen: Der Ausweg heisst
  «übernehmen Sie sie nicht», **nicht «gilt sie nicht»** (ein Artikel, der im
  Kapitel fehlt, gilt trotzdem). Und die Zeile nennt die **Art** der Angabe (Recht,
  Regel, Zahl, Begriff) — «jede Angabe der KI» träfe im Plus auch jeden Einwand,
  dann bliebe nichts abzuwägen. Zeile, Schritt, Kriterium und Liesmich nennen
  dieselbe Art.
- **Kein Kriterium verlangt, was kein Schritt verlangt.** Sagt das Kriterium
  «notiert», sagt der Schritt «Notieren Sie»; sagt es «und warum», fragt ein
  Schritt nach dem Grund. Lässt das Kriterium «bleibt oder ändert sich» zu, setzt
  der Schritt keine Änderung voraus.
- **Die KN-Brücke verspricht nur, was jede KN-Form verlangt.** Sie stützt sich auf
  `kern_kompetenzversprechen`, nicht auf eine Stufe der Rubrik und nicht auf den
  gemeinsamen Auftrag. **«ohne KI» steht nur da, wenn `kn.json` es für jede Form
  sagt.** Oft ist eine Form die Werkschau: Dort zeigen die Lernenden genau die
  Produkte, an denen der Basis-Auftrag mit der KI arbeitet — «im Kompetenznachweis
  arbeiten Sie ohne KI» wäre dann falsch, und «nie bei der Abgabe» widerspräche dem
  eigenen Auftrag. Dann sagt die Brücke, was die Lernenden **selbst können müssen**
  («Im Kompetenznachweis erklären Sie selbst, was Sie zeigen und was Sie
  weglassen.»). Nicht: «Im Kompetenznachweis antworten Sie auf einen
  Einwand» (das verlangt keine Form).
- **Ein Produkt, ein Name — in allen drei Dateien.** Das Produkt heisst überall
  wie im Heft («meine Regel für zweifelhafte Inhalte», nicht einmal «für Inhalte
  aus dem Feed»); für eine Sache steht ein Wort («Fakt», nicht daneben
  «Tatsache»; «Einwand», nicht daneben «Gegenargument»). Passt die Glossar-
  Definition eines Begriffs nicht zum Gebrauch im Auftrag («Einwand» = das
  stärkste Argument der Gegenseite, also nicht «drei Einwände»), wählt der Auftrag
  ein anderes Wort.

Fünf Ergänzungen aus dem Hauptlauf (07.10.2026, je in zwei oder mehr Einheiten):

- **Prompt 2 braucht den Chat von Prompt 1.** Der Vorspann oder ein Schritt sagt
  es («Prompt 2, nach der dritten Frage, im selben Chat:»); im Lernprompt steht es
  in `logik_und_ziel` der Seite mit zwei Prompts.
- **Wer wählen soll, braucht Nummern.** Verlangt Prompt 2 des Plus-Auftrags (oder
  `stacking_seite_2.prompt_2`) einen von mehreren Einwänden, bestellt Prompt 1 sie
  nummeriert («Nenne zwei Einwände dagegen, je in einem Satz. Nummeriere sie.») und
  Prompt 2 nennt die Nummer («Ich antworte auf Einwand Nummer [Nummer]: …»). Ziel,
  Schritt und Kriterium sagen dasselbe über die Wahl («den stärksten Einwand»).
- **Die Lücke nennt, was auf dem Blatt der Lernenden wirklich so steht.** Ist das
  «Urteil» im Heft ein ganzer Abschnitt, heisst die Lücke nach dem einen Satz, der
  hineinkommt («der erste Satz im Abschnitt Urteil»); gibt es auf der Karte
  «Position» und «Argument» getrennt, gibt es keine Lücke «Position mit
  Begründung».
- **Zwei Hefte, zwei Glossare.** Bei v4.2 zeigt «Prüfen:» auf «Ihre Hefte (Glossar,
  S. 8)», nicht auf «das Heft». Ein Glossar führt keine **Zahlen**: Nennt die Zeile
  Zahlen, nennt sie auch den Ort, an dem sie stehen (Tabelle in Heft B), oder den
  Weg («rechnen Sie nach»).
- **Die KI erfährt den Gegenstand.** Fragt die KI zu einem Satz über ein Werk, ein
  Budget, einen Brief, sagt der Prompt, worüber der Satz geht — und die bestellten
  Fragen brauchen die Glossarwörter in der Bedeutung der Einheit («Wirkung» ist die
  Wirkung des Werks, nicht die des Satzes).

**3er-Set: nicht alle haben alle drei Herausforderungen gemacht.** Der Begleiter
kennt Varianten, in denen Lernende nur eine oder zwei bearbeiten. Darum: `bezug`
sagt, **worum es** in A, B und C geht («In Herausforderung A, B und C geht es um
…»), nicht was «Sie» dort getan haben. Die Basis-Prompts des Lernprompts
(`beispiel_basis` von Technik 1 + 2, `stacking_seite_1`) docken an Begriffen oder
an **einem beliebigen** Produkt an — nicht einer an B und einer an C, sodass nur
Seite 1 hat, wer alles gemacht hat. Kein Prompt setzt eine Wahl fest, die die
Lernenden in der Einheit selbst treffen («Mein Kanal ist eine E-Mail»).

`ziel`, Prompt 1, Schritte und Reflexion reden vom **selben Gegenstand** und mit
demselben Wort (Produkt · Entscheid · Text). Im 3er-Set passt der Gegenstand zu
allen drei Handlungsprodukten — ein Drehbuch hat keine «Begründung». Bei v4.2
heissen die Produkte wie im Heft («Standort», «Regel»); ein Sammelwort wie
«Entscheid» nur, wenn `auftrag` es erklärt.

**Richtwerte für Seite 2 des Basis-Auftrags.** Seite 2 trägt die drei Kriterien,
die zwei Reflexionsfragen mit Schreibfeldern und die zwei Leitfragen. Sie läuft
über, wenn Kriterien und Reflexion lang sind (Lauf vom 07.10.2026: 28.3 px, nach
Kürzen auf Wörter immer noch 10.4 px — es zählen die **Zeilen**). Name und
Indikator eines Kriteriums stehen hintereinander auf einer Zeile von rund 90
Zeichen. Darum: Bei **zwei** der drei Kriterien sind `kriterium` + `indikator`
zusammen ≤ 85 Zeichen (eine Zeile; Name höchstens zwei Wörter: «Zuerst ohne KI»,
«Selbst entschieden»); das Kriterium zum Nachschlagen ≤ 110 Zeichen (zwei Zeilen);
`reflexion[0]` ≤ 70 Zeichen, die KN-Brücke ≤ 110 Zeichen; die zwei Leitfragen je
≤ 80 Zeichen. Bei v4.2 ist die Seite enger als im 3er-Set (eigenes Satzbild).

**«jede» und «mindestens eine» nie gemischt.** Wie viel nachgeschlagen wird, sagen
die Zeile «Prüfen», der Schritt und das Kriterium eines Auftrags mit demselben
Wort. Basis: «jede Angabe». Plus: «mindestens eine Angabe» — oder ebenfalls «jede».

Einmal je Datei:

- `ki_leitfragen`: nur `offen` und `kritisch` gesetzt, je höchstens 16 Wörter.
  `vergleichend` und `urteilend` fehlen (der Renderer zeigt nur gesetzte Fragen).
- `nrlp_anker.schluesselkompetenzen_texte`: höchstens 3 Einträge.
- `nrlp_anker.thema_text`: ein Satz **ohne Code** — nicht «T1 — Ins Berufsleben
  einsteigen: …», sondern «Ins Berufsleben einsteigen: …». Der Word-Export druckt
  das Feld auf das Blatt der Lernenden.

Die **KN-Brücke** (Check `KN_BRIDGE`) steht in der **letzten** Reflexionsfrage
mindestens eines Auftrags — bei `ki_1` ist das die zweite, bei `ki_2` die dritte.
Sie sagt «Im Kompetenznachweis …» und nennt **keine Form**: Welche Form die Klasse
bekommt, wählt die Lehrperson. Eine Form («Im Fachgespräch …») nur, wenn
`kn.kn_typen` genau eine hat. Die Frage greift auf, was der Auftrag geübt hat —
fragt der Auftrag nach Inhalt und Ton, fragt die Brücke nicht nach einer
«Begründung».

---

## 4. `lernprompt.json`

Reihenfolge von `techniken` (verbindlich): `rollen_prompting`, `kontextualisieren`,
dann die zwei gewählten. `titel` steht wörtlich wie in der Titelliste von
`lernprompt-techniken.md` — in jeder Einheit gleich.

`thema_kontext`: höchstens 2 Sätze, zusammen ≤ 25 Wörter; einer erklärt «Prompt»
und schreibt «KI» einmal aus («Ein Prompt ist Ihre Eingabe an die KI (künstliche
Intelligenz).»).

| Feld | Technik 1 + 2 (Basis) | Technik 3 + 4 (Plus) |
|---|---|---|
| `erklaerung` | höchstens 2 Sätze, zusammen ≤ 30 Wörter | höchstens 3 Sätze |
| `thema_bezug` | 1 Satz | 1-2 Sätze |
| `beispiel_basis` | fertiger Prompt mit Sprachzeile, höchstens eine Lücke | fertiger Prompt mit Sprachzeile |
| `beispiel_fortgeschritten` | **fehlt** | gesetzt |
| `baukasten` | **fehlt** | gesetzt (`rolle/kontext/aufgabe/format`) |
| `warnung` | 1 Satz | 1-2 Sätze |

- `stacking_seite_1` (Basis): `logik_und_ziel` höchstens 2 Sätze; `prompt_1` und
  `prompt_2` fertig, je mit Sprachzeile; `prompt_2` baut auf der Antwort auf.
- `stacking_seite_2` (Plus): wie bisher.
- `stacking_seite_*.technik_keys`: die **Titel** der zwei Techniken («Der KI eine
  Rolle geben», «Kontext geben»), nicht die Schlüssel — der Renderer druckt das Feld wörtlich,
  und `rollen_prompting` ist kein Wort für Lernende.
- **Kein Basis-Prompt ohne Andockpunkt.** `beispiel_basis` von Technik 1 + 2
  fragt entweder benannte Begriffe ab oder hat eine Lücke für etwas Eigenes. Nicht:
  «Stell mir drei Fragen zu Interesse und Wert hinter einer Aussage» — die KI
  erfindet die Aussage, das ist ein neuer Fall durch die Hintertür. Gibt der Prompt
  eine Rückmeldung auf eigenen Text, steht «Schreib … nicht neu» dabei, auch wenn
  die Lücke anders heisst als «[mein Text]».
- Eine `erklaerung` behauptet nichts über die Welt, was die Einheit anders lehrt
  (nicht: «Eine Angabe ohne Quelle können Sie nicht nachprüfen», wenn Heft B genau
  das übt), und nichts über «die KI» im Allgemeinen, was nur für diesen Prompt gilt.
- In `stacking_seite_2` (Plus) gilt wie überall: Lässt `prompt_2` die KI
  widersprechen oder einwenden, steht die Position der Lernenden schon in
  `prompt_1` (als Lücke). Die KI widerspricht nie ihrer eigenen Liste.
- `logik_und_ziel` beschreibt, was die zwei Prompts **wirklich** tun — wer liefert,
  wer fragt. Nach jeder Änderung an einem Prompt neu lesen.
- `prompt_vorlage` (fest): «Ein guter Prompt nennt vier Dinge: Rolle, Kontext,
  Aufgabe, Form der Antwort.» Einzige Ausnahme: Lehrt die Einheit selbst eine
  Prompt-Formel (ein Heft über das Lernen mit KI: «Rolle, Ziel, Kontext, Format»),
  steht hier die Formel der Einheit — die Toolbox widerspricht dem Heft nie. Die
  vierte Zeile des Baukastens im Plus trägt dasselbe Wort wie die Vorlage: Der
  Renderer druckt «Form der Antwort», sobald die Vorlage so heisst, sonst «Format»
  (`baukastenFormatLabel` in `src/lib/einheiten/ki-toolbox.ts`, seit 07.10.2026).
  Die Vorlage darum wörtlich schreiben — ein abweichender Wortlaut fällt auf
  «Format» zurück.
- **`beispiel_dialog`** (Pflicht, Basis, Seite 1 unter «Nachfragen»): ein kurzer
  Verlauf in drei Teilen, der zeigt, wie Prüfen aussieht.

  | Schlüssel | Inhalt | Grenze |
  |---|---|---|
  | `frage` | ein fertiger Prompt, wie ihn Lernende schreiben — mit Sprachzeile, **ohne Lücke** (die Angaben sind als Beispiel ausgefüllt) | ≤ 45 Wörter |
  | `antwort` | was die KI darauf sagt — kurz, in einfachen Sätzen, und mit **genau einem Fehler**, den man nachprüfen kann (falsch gerechnet, falsche Angabe) | ≤ 30 Wörter |
  | `pruefung` | was die/der Lernende damit tut, in Ich-Form: den Fehler finden, das Brauchbare behalten | ≤ 30 Wörter |

  Der Fehler ist der Zweck: Die Lernenden sehen einmal, dass eine Antwort der KI
  falsch sein kann und wie man es merkt. Gegenstand und Zahlen stammen aus der
  Einheit (Begriffe, ein Heft) — kein neuer Fall, bei v4.2 nichts aus einer Spur,
  kein Begriff des KN-Falls. Die Antwort der KI ist erfunden und steht unter der
  Überschrift «Beispiel»; sie behauptet nichts über die Welt, was nicht im
  Lehrmittel steht.

  Drei Proben vor dem Schreiben:
  - **Zahlen wie im Heft.** Nennt die `frage` Zahlen oder Angaben, die ein Heft
    auch führt (Zahlen-Tabelle, Beispiel), sind es **dieselben** Werte. Sonst
    findet, wer nachschlägt, einen zweiten scheinbaren Fehler.
  - **Höchstens zwei Angaben, beide geprüft.** Die `antwort` macht höchstens zwei
    prüfbare Angaben — eine falsch, eine richtig —, dazu allenfalls eine Frage. Die
    `pruefung` nennt beide: den Fehler und was stimmt.
  - **Wortlaut der Quelle.** Die `pruefung` berichtigt mit den Worten des Glossars
    oder des Lehrmittels, nicht mit einem Schluss daraus.

**Richtwerte für Seite 1.** Seite 1 des Lernprompts trägt zwei Karten, die zwei
Prompts zum Nachfragen und den Beispiel-Verlauf — sie läuft über, auch wenn jede
Grenze oben eingehalten ist (Lauf vom 07.10.2026: 6.5 px bei voller Länge). Darum
unter den Grenzen bleiben: `thema_bezug` und `warnung` der Basis ≤ 12 Wörter,
`beispiel_basis` und die Prompts von `stacking_seite_1` ≤ 38 Wörter,
`beispiel_dialog.frage` ≤ 25 Wörter, `antwort` und `pruefung` je ≤ 20 Wörter.

---

## 5. `lernbegleiter.json`

Reihenfolge von `strategie_karten` (verbindlich): `retrieval`, `feynman`, dann
`uebungs_feedback`, `mock_transfer`, `repetitionsplan`.

| Feld | Karte 1 + 2 (Basis) | Karte 3-5 (Plus) |
|---|---|---|
| `technik` | deutsches Wort, höchstens 3 Wörter, ohne Klammer («Abfragen lassen», «Selbst erklären») | wie Basis («Rückmeldung holen», «Übungsfall lösen», «Lernplan machen») |
| `wann` | 1 Satz | 1 Satz |
| `prompt_basis` | fertiger Prompt mit Sprachzeile, höchstens eine Lücke | fertiger Prompt mit Sprachzeile |
| `prompt_fortgeschritten` | **fehlt** | gesetzt |
| `warnung` | 1 Satz, technik-spezifisch (L3) | 1-2 Sätze |

**Einheit ohne Lehrmittel.** Steht in `prinzip.quellen_anker` kein Kapitel, gibt es
kein «gilt das Lehrmittel». Vergleichsort ist dann, was die Lernenden in der Hand
haben: ihr Heft und ihre Notizen zu einer **benannten** Leitfrage; die `warnung` sagt,
dass sie bei einem Unterschied die Lehrperson fragen. Abgefragt werden nur Begriffe,
die in einer Leitfrage wörtlich stehen. Der Ausweg heisst hier **nicht** «übernehmen
Sie sie nicht»: Die Notizen sind der eigene Text, eine echte Lücke steht dort gerade
nicht — «Steht es nicht in Ihren Notizen, fragen Sie die Lehrperson.» Das gilt für
jede Karte und jede Zeile «Prüfen:», die auf die Notizen zeigt.

**Die Karten und §1 Nr. 5** (die KI kennt die Einheit nicht):

| Karte | Prompt | `warnung` |
|---|---|---|
| `retrieval` | nennt das Thema und die Begriffe; «Sag mir die Lösung erst nach meiner Antwort.» Nur Begriffe, die die Lernenden dort **nachschlagen können**, wohin die `warnung` zeigt: bei v4.2 Glossarbegriffe, im 3er-Set Begriffe, die im genannten Kapitel wörtlich stehen (in `material/_lehrmittel/` nachsehen — ein Konzept wie «Register» steht in `prinzip.json`, aber in keinem Kapitel) | sagt, womit verglichen wird und was gilt: «Weicht die Lösung der KI vom Glossar in Ihrem Heft ab, gilt das Glossar.» (3er-Set: «… vom Lehrmittel ab, gilt das Lehrmittel.») |
| `feynman` | nennt das Thema; die Lücke verlangt Begriff **und** Erklärung («Mein Begriff und meine Erklärung: [Begriff und Erklärung]»); die KI nennt Lücken und schreibt nichts neu | «Prüfen Sie jede Lücke, die die KI nennt, im Glossar, bevor Sie Ihre Erklärung ändern.» |
| `uebungs_feedback` | Kriterium mit dem, was es verlangt (höchstens zwei). Die KI kennt den Übungsfall nur im selben Chat — `wann` sagt das («Wenn Sie einen Übungsfall im selben Chat gelöst haben.») | wie bisher; dazu der Satz «Schreiben Sie keine Namen in den Prompt.» |
| `mock_transfer` | nennt das Thema; sagt in Wörtern der Hefte, was der Fall **nicht** sein soll; bestellt zum Fall **eine Frage oder Aufgabe** («Gib mir dazu eine Aufgabe. Warte auf meine Lösung.») — ein Fall ohne Aufgabe hat keine «Lösung»; Kriterien wie oben. Gibt `prompt_fortgeschritten` einen Gegenstand vor, kommt er in **keiner Datei der Einheit** vor — auch nicht als Transferbeispiel in `prinzip.json` oder in einer Musterlösung (sonst stimmt der Selbstcheck «nicht an den Fällen aus meinen Heften» nicht) | «Verlangen Sie von der KI nie eine Lösung für Ihren Kompetenznachweis. Üben Sie an neuen Fällen.» — nicht: «Der Übungsfall muss ein anderer sein als Ihr Kompetenznachweis» (den Fall kennt vorher niemand) |
| `repetitionsplan` | `prompt_fortgeschritten` bestellt Lernkarten **nur mit Fragen**, nach Themen geordnet; die Antworten schreiben die Lernenden aus dem Glossar. Nennt der Prompt Gruppen, lässt sich **jeder** Begriff des Glossars einer zuordnen | sagt, woher die Antworten kommen — und stimmt für **beide** Prompts (`prompt_basis` bestellt einen Plan, erst das Plus Lernkarten); v4.2: «im Glossar in Ihren Heften» (zwei Hefte) |

**Richtwerte für Seite 1.** Seite 1 des Lernbegleiters trägt Ziel,
Selbsteinschätzung, Begriffe und zwei Karten mit Notizfeldern. Sie läuft über,
wenn die Begriffe lang sind (Lauf vom 07.10.2026: 13.8 px bei 20 Begriffen mit
318 Zeichen; mit 12 Begriffen und 201 Zeichen blieben 7.5 px). Darum: `begriffe`
zusammen ≤ 200 Zeichen und höchstens vier Einträge über 18 Zeichen; `ziel` ≤ 125 Zeichen; `wann` und `warnung` der Basis-Karten je
≤ 90 Zeichen; `retrieval.prompt_basis` nennt höchstens sechs Begriffe. Im 3er-Set
heisst das: weniger Begriffe (weglassen nach der Regel unten, nie einen Begriff,
den ein Prompt nennt). Bei v4.2 stehen alle Glossarbegriffe ohne `spur` da —
gekürzt wird an den anderen Feldern.

**Richtwert für Seite 3 (Plus-Karten).** Die drei Plus-Karten stehen zusammen auf
einer Seite. Alle Felder der Karten 3-5 zusammen (`technik`, `wann`, `prompt_basis`,
`prompt_fortgeschritten`, `warnung`) ≤ 2'600 Zeichen. Gemessen am 07.10.2026: 2'770
Zeichen liessen 7.6 px, 3'043 Zeichen liefen 21.5 px über. Die neuen Regeln (Thema,
Ausschlussliste, erklärte Kriterien, Aufgabe zum Fall) machen diese Prompts lang —
darum `prompt_fortgeschritten` bei rund 55 Wörtern halten, nicht bei 70.

Übrige Felder (alle Basis, sie stehen auf Seite 1 und auf der KN-Seite):

| Feld | Vorgabe |
|---|---|
| `ziel` | 1 Satz; dazu einmal «KI» ausgeschrieben und «Prompt» erklärt, zusammen höchstens 12 Wörter mehr («… mit der KI (künstliche Intelligenz). Ein Prompt ist Ihre Eingabe an die KI.») |
| **`begriffe`** (Pflicht) | die Begriffe der Einheit zum Abhaken («Kann ich das erklären?»), 6 bis 20 Einträge, Schreibweise wie in der Quelle. v4.2: **alle** `set.glossar[].begriff` ohne `spur`, in der Reihenfolge des Glossars. 3er-Set: `prinzip.quellen_anker.konzepte`. EBA: `dossier.glossar[].begriff`. Kein Begriff, der nicht dort steht. **Hat die Quelle des 3er-Sets mehr als 20 Einträge oder einen mit Sperrwort:** zuerst Einträge mit Sperrwort weglassen (ausser die Einheit lehrt das Wort selbst, `b1-language-rules.md` §4 — dann bleibt es), dann Einträge, die einen anderen nur ausschreiben («Behauptung Begründung Beispiel» neben «3B-Schema», die vier Ohren einzeln neben «Kommunikationsquadrat (Vier Ohren)»), dann Einträge, die in keiner Leitfrage und keinem Handlungsprodukt der Herausforderungen vorkommen, erst dann von hinten — Reihenfolge der Quelle bleibt. Was wegfällt, steht in der Rückmeldung |
| `ki_frei_zuerst.auftrag` | höchstens 2 Sätze. Der erste nennt die **Skala**, weil der Renderer fünf Kästchen ohne Legende druckt: «Schätzen Sie sich zuerst ohne KI ein, von 1 (unsicher) bis 5 (sicher).» |
| `ki_frei_zuerst.selbsteinschaetzung` | 2-3 Zeilen, je ein «Ich kann …»-Satz. Fundstellen (Kapitel, Seite) nur, wenn sie für den Kern gelten — bei v4.2 keine Seite, die nur eine Spur liest — und nur, wenn das Kapitel die Wörter des Satzes auch erklärt (heft-eigene Begriffe verweisen aufs Glossar, nicht auf ein Kapitel) |
| `kn_typ_tracks[]` | einer pro KN-Typ; `uebungsfokus` 1 Satz; `prompt` fertig, mit Sprachzeile, ≤ 45 Wörter. Jeder Prompt, der einen neuen Fall bestellt, nennt das **Thema** der Einheit und sagt in Wörtern der Hefte, was der Fall nicht sein soll (wie `mock_transfer`). Das Wort «Prinzip» steht hier nicht: Die Lücke heisst «[was ich gelernt habe]», und der `uebungsfokus` sagt, was gemeint ist («Sie sagen in einem Satz, was Sie gelernt haben, und prüfen ihn an einem neuen Fall.»). Fragt die KI, dann mit **fester Zahl** («Stell mir dazu zwei Fragen, eine nach der anderen.») — die volle Sprachzeile sprengt hier die 45 Wörter. **Der Prompt bestellt, was der `uebungsfokus` verspricht:** Sagt der Fokus «Sie erklären, was ein Werk zeigt und wie es wirkt», fragt die KI danach («Frag, was das Werk zeigt und wie es wirkt.»); sagt er «und begründen Ihre Wahl», verlangt die bestellte Aufgabe eine Begründung. Die **Ausschlussliste** ist in allen Tracks dieselbe wie in `mock_transfer`. Der `uebungsfokus` sagt nicht «mündlich»: Im Chat wird getippt («Sie beantworten Fragen zu einem neuen Fall.») |
| `rubrik_fokus[].so_uebst_du` | 1 Satz, Verb vorn («Sie üben …», «Üben Sie …») — nicht zwei, drei Infinitive vor dem Verb («Begriffe richtig brauchen und … abwägen üben Sie mit …»). Die Kriterien darüber stehen nur als Name da («Ethisches Prinzip»); `so_uebst_du` sagt darum in einfachen Worten, **was sie verlangen**, und womit man es **in der Basis** übt: Karte 1 oder 2 oder ein Übungsfall auf derselben Seite — nie eine Plus-Karte (wer nur die Basis druckt, hat sie nicht). **Der Satz verspricht nur, was dieser Prompt wirklich bestellt:** Nennt er den Übungsfall, steht «in Ich-Form sagen, was Sie verlangen» oder «einen Preis erklären» nur da, wenn ein Track-Prompt der KN-Seite genau das bestellt — nicht, weil das Kriterium es verlangt und erst die Plus-Karte `mock_transfer` es übt. Die Übungsfälle stehen auf der Seite **oberhalb** der Kriterien — nie «am Übungsfall unten» |
| «Übungstext» und ähnliche Wörter | Wo eine Karte einen Text der Lernenden verlangt, sagt `wann`, **welcher** Text gemeint ist (ein Produkt aus der Einheit, die Lösung eines Übungsfalls). Ein Prompt sagt der KI eines: antworten **oder** fragen |
| `integritaet_warnung` | höchstens 2 Sätze. Sie behauptet über den KN nur, was `kn.json` sagt: «allein und ohne KI» nur, wenn das für **jede** Form dort steht. Ist eine Form die Werkschau (eigene Arbeiten zeigen), heisst die Leitplanke: «Die KI stellt Fragen und zeigt Lücken. Was auf Ihrem Blatt steht, schreiben Sie selbst.» |
| `selbstcheck` | 3-4 Zeilen. Darunter: «Ich habe an neuen Fällen geübt, nicht an den Fällen aus meinen Heften.» (3er-Set und EBA: «… aus meinen Herausforderungen.») und «Ich habe Angaben der KI nachgeschlagen.» — nicht: «Meine Übungsfälle waren andere als mein Kompetenznachweis» (vor dem KN nicht abhakbar) |

---

## 6. Wörter zählen

Wort, Satz und Lücke zählen nach der Mess-Konvention in `b1-language-rules.md` §2
(EBA: `a2-language-rules.md`). Ein fertiger Prompt hat mit Sprachzeile höchstens
**45 Wörter** in der Basis und höchstens **70** im Plus. Eine Lücke ist ein Paar
eckiger Klammern mit höchstens vier Wörtern («[mein Text]», «[meine Antwort auf
die Leitfrage]»).

## 7. Checks

| # | Check | Code |
|---|---|---|
| BP1 | Reihenfolge: `ki_1` aus dem Basis-Pool; Technik 1 + 2 = `rollen_prompting`, `kontextualisieren`; Karte 1 + 2 = `retrieval`, `feynman` | `ERR_BP_REIHENFOLGE` |
| BP2 | Anzahl nach §3-§5 (3 Prompt-Zeilen, 3 Schritte, 3 Kriterien, 2 Reflexionen bei `ki_1`; 2 Leitfragen) | `ERR_BP_ANZAHL` |
| BP3 | Basis-Teile ohne `beispiel_fortgeschritten`, `baukasten`, `prompt_fortgeschritten` | `ERR_BP_PLUS_IN_BASIS` |
| BP4 | Jeder fertige Prompt hat eine Sprachzeile mit den Pflichtteilen aus §1 Nr. 2 | `ERR_BP_SPRACHZEILE` |
| BP5 | Basis-Prompt: höchstens eine Lücke, ≤ 45 Wörter, kein neuer Fall, nur Begriffe / eigenes Produkt / Kriterien (§1 Nr. 3) | `ERR_BP_ANDOCKEN` |
| BP6 | Feldlängen nach §3-§5 | `ERR_BP_LAENGE` |
| BP7 | `lernprompt.beispiel_dialog` mit `frage` (Sprachzeile, keine Lücke), `antwort`, `pruefung`; `lernbegleiter.begriffe` 6-20 Einträge, bei v4.2 jeder ein Glossarbegriff ohne `spur` | `ERR_BP_ZUSATZ` |
| BP8 | Die KI kennt die Einheit nicht (§1 Nr. 5): Thema im Prompt, wo die KI abfragt, beurteilt oder einen Fall erfindet · `warnung` von `retrieval` und `feynman` nennt, womit verglichen wird · kein Kriterium nur als Name · die KI liefert keinen Stoff · in der Basis liefert auch Prompt 2 keinen Inhalt (§1 Nr. 4) | `ERR_BP_KONTEXT` |
| BP9 | Der Basis-Auftrag passt zusammen (§3 «Aufbau»): drei Fragen in Prompt 1 · Vorspann «Prompt 2, nach der dritten Frage:» · Schritt 2 nennt Prompt 1, Schritt 3 nennt Prompt 2 · Kriterium Nachschlagen erfüllbar · «jede» und «mindestens eine» nicht gemischt · ein Gegenstand, ein Wort | `ERR_BP_AUFBAU` |

Alle blockieren den Write: kürzen oder ins Plus verschieben, nie die Regel
dehnen. **`node scripts/check-ki-toolbox.mjs <ordner>`** prüft BP1-BP4, BP6, die
gezählten B1-Regeln und bei v4.2 Fall-Ausschluss, Spur und Wörter. Nicht prüfen
kann es, ob ein Wort ein Fachbegriff ist (B6), ob ein Basis-Prompt wirklich
andockt (BP5, ausser der Zahl der Lücken) und BP8/BP9 — das bleibt Urteil der
Skill. Das Skript zählt im Prompt auch nur Sie-Imperative; die feste Sprachzeile
(§1 Nr. 2) hält B4 von sich aus ein.

**Kein Wortlaut aus einer anderen Toolbox.** Jede Toolbox wird aus den Regeln und
aus der eigenen Einheit geschrieben. Die Toolboxen, die vor dem 07.10.2026
entstanden sind — auch der Pilot `1.3.1_konsum_verantworten_v42` —, kennen §1
Nr. 5, den Aufbau in §3 und die feste Sprachzeile noch nicht; ihre Prompts sind
keine Vorlage.

## 8. Bestehende Toolboxen

Die Toolboxen der Bestandseinheiten mit Stempel 1.x sind in voller Dichte
geschrieben. Sie bleiben, bis jemand sie ausdrücklich neu bestellt. Welche das
sind, sagt `node scripts/check-ki-toolbox.mjs` ohne Argument («Übersprungen»).
`1.1.1_konflikt_kommunizieren` — lange die Gold-Referenz in voller Dichte — ist
seit dem Lauf vom 07.10.2026 neu geschrieben (2.0.0). Für die **Form** der Dateien
gelten `assets/*.json`, nicht eine einzelne Einheit.
