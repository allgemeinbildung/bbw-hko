# B1-Sprachregeln (EFZ) — hartes Gate für die KI-Toolbox

**Geltung:** Jedes Feld von `ki.json`, `lernprompt.json` und `lernbegleiter.json`,
das Lernende lesen — bei `lehrgang` `EFZ_3J` und `EFZ_4J`, in jedem Format (v4.2
und 3er-Set). Die Feldliste ist dieselbe wie im EBA-Gate (SKILL.md, Abschnitt
«EBA-A2-Pre-Write-Gate»). Für EBA gilt weiterhin die strengere A2-Liste des
Set-Generators; `ki-liesmich.md` ist ausgenommen (Lehrperson).

**Warum:** Bis Oktober 2026 hatte nur EBA ein Sprach-Gate. Die EFZ-Toolbox schrieb
Sätze mit über dreissig Wörtern, fünf Aufträge in einem Absatz und Wörter wie
«Retrieval» oder «Verifikation». Rückmeldung der Lehrpersonen: zu schwer. Die
Toolbox ist ein Zusatzangebot — sie darf nicht schwerer zu lesen sein als das
Heft, zu dem sie gehört.

**Prinzip:** B1 wird gezählt, nicht geschätzt. Der Scan läuft **vor** jedem Write
eines Felds für Lernende, wie der Umlaut/Eszett-Scan. `ERR_*` blockiert den Write
(neu formulieren, bis bestanden), `WARN_*` wird gemeldet und nach Möglichkeit
behoben. Die Sie-Form in Aufträgen und die Du-Form im Prompt an die KI bleiben —
B1 senkt die Schwierigkeit, nicht die Höflichkeit.

---

## 1. Zählbare Regeln

| # | Regel | Schwelle | Code | Typ |
|---|---|---|---|---|
| B1 | Mittlere Satzlänge (Wörter je Satz, Durchschnitt im Feld) | ≤ 14 | `WARN_B1_SATZLAENGE` | WARN |
| B2 | Längster Satz im Feld | ≤ 22 Wörter | `ERR_B1_SATZ_ZU_LANG` | ERR |
| B3 | Nebensätze je Satz | höchstens 1 | `WARN_B1_NEBENSATZKETTE` | WARN |
| B4 | Aufträge je Satz (Imperativ «Verb Sie») | höchstens 1 | `ERR_B1_MEHRFACHAUFTRAG` | ERR |
| B5 | Ein Schritt (`schritte[]`) | 1 Satz, ≤ 16 Wörter | `ERR_B1_SCHRITT_ZU_LANG` | ERR |
| B6 | Fachbegriff ohne Deckung | jeder Fachbegriff ist gedeckt (§3) | `ERR_B1_BEGRIFF_OHNE_DECKUNG` | ERR |
| B7 | Sperrwort (§4) | keines | `ERR_B1_SPERRWORT` | ERR |
| B8 | Passiv, Nominalstil, Funktionsverbgefüge | aktiv, Verben statt Nomen | `WARN_B1_STIL` | WARN |
| B9 | Abkürzung beim ersten Vorkommen im Dokument | ausgeschrieben («Kompetenznachweis», danach «KN») | `WARN_B1_ABKUERZUNG` | WARN |

## 2. Mess-Konvention

- *Satz* = Folge bis `.`, `!`, `?` oder bis zu einem Doppelpunkt, der eine Liste
  einleitet. Abkürzungen («z. B.», «Kap.», «S.», «CHF») beenden keinen Satz.
- *Wort* = durch Leerraum getrennt; Zusammensetzungen mit Bindestrich und Zahlen
  je ein Wort. Eine Lücke in eckigen Klammern zählt als ein Wort.
- *Nebensatz* = Teilsatz mit dem gebeugten Verb am Ende, eingeleitet durch weil,
  dass, wenn, obwohl, damit, ob, bevor, nachdem … oder ein Relativpronomen.
- *Auftrag* = Imperativ in Sie-Form («Lesen Sie», «Notieren Sie»). In einem Prompt
  an die KI zählt der Du-Imperativ («Stell», «Nenne») gleich.
- *Feld* = ein String. Bei Listen (`schritte[]`, `prompt_strategie[]`,
  `selbstcheck[]`) zählt jeder Eintrag für sich.
- Ein **Prompt** wird als Text an die KI gemessen, mit denselben Regeln; B4 gilt
  dort je Satz, die Sprachzeile (`basis-plus.md` §1) zählt mit. Darum hat die
  Sprachzeile eine feste Form mit einem Auftrag je Satz («Stell immer nur eine
  Frage. Warte auf meine Antwort.») — das Skript zählt im Prompt nur
  Sie-Imperative und sieht einen Verstoss hier nicht.

## 3. Deckung von Fachbegriffen (B6)

Ein Fachbegriff ist ein inhaltstragendes Substantiv, das nicht zum Alltagswortschatz
einer 16-jährigen Person gehört. Im Zweifel ist es einer.

| Format | Gedeckt, wenn der Begriff … |
|---|---|
| v4.2 | in `set.glossar[].begriff` steht (Eintrag ohne `spur`), in derselben Schreibweise |
| 3er-Set | in `prinzip.quellen_anker.konzepte` steht oder in einem `leitfragen[].text` der Herausforderungen vorkommt |
| alle | im selben Feld in einem Nebensatz oder in Klammern erklärt ist, in höchstens acht Wörtern |

Ist ein Begriff nicht gedeckt: durch einen gedeckten ersetzen oder im Feld
erklären. Glossar und Unit-Dateien werden nicht angefasst (Scope).

Die Wörter der KI-Arbeit selbst sind gedeckt, wenn das Dokument sie beim ersten
Vorkommen erklärt: «Prompt» (Ihre Eingabe an die KI), «KI» (künstliche
Intelligenz). Mehr KI-Wörter braucht die Basis nicht. **Dokument** heisst hier:
jedes Blatt, das die Lehrperson einzeln drucken kann — Basis-Auftrag, Plus-Auftrag,
Lernprompt, Lernbegleiter. Wo die Erklärung steht: `ki_1.auftrag` · `ki_2.auftrag` ·
`lernprompt.thema_kontext` · `lernbegleiter.ziel` (`basis-plus.md` §3-§5).

Ein Wort, das einen ganzen Auftrag trägt und weder in den Begriffen der Einheit
noch im Lehrmittel steht («Einwand», «Gegenseite», «Position»), wird einmal im
`auftrag` erklärt («Ein Einwand ist, was die andere Seite dagegen sagt.»).
Redewendungen («das Gesicht wahren») stehen in keinem Text für Lernende.

Ein Wort, das die Einheit anders braucht als der Alltag («Prinzip», «Standort»,
«Regel», «Entscheid» als Sammelwort), ist nur gedeckt, wenn es im selben Blatt so
erklärt ist, wie die Einheit es meint.

## 4. Sperrwörter (B7)

Wörter der Didaktik und der KI-Fachsprache. Sie stehen in keinem Feld für
Lernende — auch nicht in Klammern hinter dem deutschen Wort.

| Nicht | Sondern |
|---|---|
| Retrieval | abfragen lassen |
| Feynman, Feynman-Methode | selbst erklären |
| Stacking | nachfragen; zwei Prompts nacheinander |
| Mock, Mock-Fall, Transfer-Simulation | Übungsfall |
| Chain of Thought | Schritt für Schritt |
| Verifikation, verifizieren | nachschlagen, prüfen |
| Halluzination, halluzinieren | erfundene Angabe; die KI erfindet etwas |
| Rubrik, Dimension, Indikator, Gütekriterium | Kriterium; «daran erkennen Sie …» |
| formativ, summativ, dekontextualisieren, Transfer-Prinzip, Konsistenz | weglassen oder sagen, was gemeint ist («auf einen neuen Fall übertragen») |
| Trade-off | Spannungsfeld, Zielkonflikt |
| tragfähig, adressatengerecht, wertungsfrei | hält, passt zur Leserin/zum Leser, ohne Urteil |
| AI-Fluency, KI-Fluency, Sparring, challengen | weglassen |
| Mini Case, Mini Case schriftlich, Werkschau, Transfer-Reflexion (Namen der KN-Formen) | sagen, was dort geschieht: «im schriftlichen Kompetenznachweis», «wenn Sie Ihre Arbeiten zeigen und erklären». «Fachgespräch» bleibt — das Wort kennen Lernende aus der Lehre |
| SuK, Ges, SK6, SM3 (rohe Codes) | ausschreiben oder weglassen — Ausnahme: `rubrik_fokus[].dimension` und `nrlp_anker.schluesselkompetenzen_texte` (Vertragsfelder) |

**Ausnahme: Die Einheit lehrt das Wort selbst.** Steht ein Sperrwort in den
Begriffen der Einheit (`konzepte`, Glossar) **und** in einer Leitfrage oder in einem
Kriterium des KN — «Halluzination» in einer Einheit über das Lernen mit KI —, ist
es Stoff, nicht Jargon. Dann steht es in `lernbegleiter.begriffe` (dort lässt das
Skript es zu). In allen anderen Feldern sperrt `check-ki-toolbox.mjs` es weiter als
Teilwort: dort umschreiben («falsch oder erfunden») und im Final-Summary melden,
dass das Skript ein Prüfwort der Einheit sperrt — die Ausnahme im Skript ist
Pietros Entscheid. **Entschieden am 07.10.2026: Die Ausnahme gilt nur für die
Einheit über KI** (`1.2.2_ki_kompetenznachweis_vorbereiten`, «Halluzination»;
`SPERRWORT_AUSNAHMEN` im Skript). Dort darf das Wort in jedem Feld stehen, in dem
die Einheit es auch braucht — beim ersten Vorkommen je Blatt erklärt. Andere
Kernwörter («Absender», «Stufe», «Ich-Form») bleiben gesperrt und werden
umschrieben.

Gross- und Kleinschreibung zählen nicht; ein Sperrwort gilt auch als Teilwort
(«Retrieval-Übung»). Einige feste Überschriften des Renderers tragen solche Wörter
noch («Gütekriterien», «Rubrik-Fokus», «KN-Typen»); die Skill fügt keine weiteren
hinzu. Die Liste wächst: Meldet eine Lehrperson ein Wort, kommt es
hier dazu.

## 5. Paare zum Kalibrieren

**B2 / B4 — ein Gedanke, ein Auftrag je Satz**
- NEIN (38 Wörter, drei Aufträge): «Wählen Sie einen Konflikt aus Ihren
  Herausforderungen, formulieren Sie zuerst Ihre eigene begründete Position mit dem
  Recht, auf das Sie sich stützen, und beauftragen Sie dann eine KI, die
  Gegenposition so stark wie möglich zu vertreten.»
- JA: «Nehmen Sie Ihr Produkt aus Heft A. Die KI stellt Ihnen dazu Fragen. Sie
  antworten und entscheiden, was Sie ändern.»

**B5 — ein Schritt, ein Satz**
- NEIN: «Jede rechtliche Behauptung im Lehrmittel oder Gesetzestext nachschlagen:
  Stimmt sie — oder ist sie verzerrt oder erfunden?»
- JA: «Schlagen Sie eine Angabe der KI im Lehrmittel nach.»

**B7 — kein Fachwort der Didaktik**
- NEIN: «Abfragen lassen (Retrieval)» · «Rechts-Verifikation»
- JA: «Abfragen lassen» · «Nachgeschlagen»

**B8 — Verben statt Nomen**
- NEIN: «Sie beurteilen die Tragfähigkeit Ihrer Position durch Konfrontation mit
  der Gegenseite.»
- JA: «Sie prüfen, ob Ihre Begründung hält.»

**Prompt mit Sprachzeile**
- NEIN: «Du bist mein Berufsbildner/in und fühlst dich durch meine Kritik in Frage
  gestellt. Reagiere so, wie du es im Betrieb tun würdest, auf folgende
  Ich-Botschaft und sag mir danach, welcher Satz dich am ehesten verärgert hat.»
- JA: «Du bist mein Lerncoach. Hier ist mein Text: [mein Text]. Stell mir drei
  Fragen dazu, eine nach der anderen. Schreib meinen Text nicht neu. Antworte in
  kurzen, einfachen Sätzen.»

## 6. Was B1 nicht ändert

- `kompetenzversprechen` und die Namen der Kriterien bleiben **wörtlich** wie in
  der Einheit — auch wenn sie länger sind als 22 Wörter und auch wenn sie ein
  Sperrwort tragen («adressatengerecht»). Die Skill ändert sie nicht und meldet
  das Sperrwort in der Rückmeldung; in der Selbsteinschätzung umschreibt sie es.
- Namen aus dem Lehrplan (Aspekte, Schlüsselkompetenzen) bleiben wörtlich.
- Die Leitplanken bleiben: «ohne KI zuerst», keine Lösung für den KN, jede Angabe
  der KI nachschlagen. B1 macht sie kürzer, nicht weicher.
