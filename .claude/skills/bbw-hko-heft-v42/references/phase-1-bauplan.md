# Phase 1 — Bauplan

**Ergebnis:** `docs/cloud-run/bauplaene/<ordner>.md` nach
`docs/cloud-run/bauplaene/_VORLAGE.md` — jeder Entscheid, den früher ein Mensch
im Dialog traf, mit einer Empfehlung, höchstens zwei Alternativen, Herleitung.

**Leitprinzip.** Der Bauplan ist die Stelle, an der sich entscheidet, ob eine
Einheit hergeleitet oder kopiert ist. Fest ist das Gerüst
(`references/kohaerenz.md`, Teil 1). Sprachmodi, Schlüsselkompetenzen,
Produkttyp, Pol-Typ, Quellentyp, Lebensbereiche und Sozialform werden **je
Einheit aus dem nRLP-Datensatz und dem Prinzip hergeleitet**. Kein Wert stammt
aus der Gold-Einheit oder aus einem Skelett. Steht am Ende dasselbe wie dort,
obwohl Thema und Kompetenz andere sind, ist die Herleitung nachzuprüfen.

## 1. Ablauf

1. **Bauplan-Entwurf** aus dem Verortungsblatt (Phase 0): §1–§6 und §8
   gefüllt, §7 nennt je Slot nur Typ und was die Quelle zeigen muss.
2. **Phase Q** (nur lokal, nur für Hefte mit `mit_medien`):
   `references/phase-q-quellen.md`. Danach ist §7 gefüllt. Passt eine geprüfte
   Quelle nicht zum Entwurf, wird der **Entwurf** angepasst (Pol-Typ, Raster,
   Zugeständnis), nicht die Quelle zurechtgebogen.
3. **Bauplan vollständig**, Abdeckungsprüfung (Abschnitt 4) gelaufen.
4. **Ein Stopp** (Abschnitt 5). Davor und danach keine Rückfrage.

**Kein Lehrmitteltext im Bauplan**, kein Transkript, kein Artikeltext — nur
Kapitel, Seite, Fundstelle, eigene Formulierungen. Er liegt im öffentlichen Repo.

## 2. Form jedes Entscheids

**empfohlen** (eine Variante, sie gilt) · **Herleitung** (Feld im Datensatz,
Verb der Kompetenz, Seite, Regel) · **Alternativen** (höchstens zwei, oder
«keine»). Im Bauplan steht die Auswahl, nicht die Sammlung der Kandidaten.

## 3. Die Entscheide — Auswahlregel, Default, Herleitung

### 3.1 Kern-Kompetenzversprechen (§3)
Intern drei Kandidaten: je ein Satz, Ich-Form, Verb auf K3 oder K4, trägt
beide Hefte. **Empfohlen** wird der Kandidat mit dem engsten Bezug zu den
Verben der Kompetenzen: Er nimmt die meisten Verben aus den
`kompetenzen[].text` aller abgedeckten Kompetenzen auf; bei Gleichstand der,
der Verben aus A **und** B verbindet. Die zwei anderen sind die Alternativen.

### 3.2 Trade-off-Raum, Anker, Mindmap-Zentrum (§3)
- **Trade-off-Raum:** drei bis vier Spannungsfelder «X vs. Y», hergeleitet aus
  den Konfliktarten beider Hefte, den `detail`-Angaben der Aspekte und der
  `leitidee` des Themas. Mindestens eines je Heft; mindestens zwei lassen sich
  in einem neuen Fall zugleich aufspannen (Auftrag und Hybrid-Fall, Leitfaden
  §7.1). Default bei mehr Kandidaten: die am Kapiteltext belegbaren.
- **Anker:** das Prinzip der Einheit in einem Satz, ohne Fall.
- **`mindmap_zentrum_kurz`:** Kurzform des Ankers, **≤ 40 Zeichen, gezählt**,
  identisch in A und B. Default: die zwei Pole des Spannungsfelds, das beide
  Hefte teilen, als «X oder Y».

### 3.3 Konfliktart je Heft (§4)
Form «X vs. Y», je Heft eine, A ≠ B. Herleitung: die Verben der
Heft-Kompetenz(en) und das, was die geprüften Seiten tragen. Aspekte der
Einheit = Aspekte der Kompetenzen aus Phase 0; ein weiterer nur, wenn eine
Konfliktart ihn ausdrücklich trägt — dann mit Grund.

### 3.4 Situation in zwei Sätzen (§4)
Ich-Form, neutrale Persona, ein Lebensbereich, die Konfliktart spürbar, ohne
sie zu benennen. Erfundene Fallzahlen sind erlaubt, Zahlen über die Welt
nicht. Kein Fall-Begriff aus §5, kein gesperrtes Wort.

### 3.5 Sprachmodi je Heft (§4)
Ausgangswert ist die Vereinigung der Kompetenz-Modi des Hefts (Phase 0). Das
Heft **führt** davon die Modi, die es wirklich übt: einen Rezeptionsmodus
übt es auf S. 3 an der Quelle des passenden Typs, einen Produktions- oder
Interaktionsmodus am Handlungsprodukt. **Default: alle Kompetenz-Modi.**
Gestrichen wird ein Modus nur, wenn das Produkt ihn nicht tragen kann; er
steht dann in §8 als Lücke. Rezeption mündlich und audiovisuell werden nicht
gestrichen (Phase 0, Abschnitt 4). Was das Heft führt, bestimmt die Spuren
(`regel4`); nach diesem Entscheid die Spuren neu ablesen.

### 3.6 Handlungsprodukt je Heft — Typ, Format, Produktbild (§4, E26)
Der **Typ folgt dem Produktions- oder Interaktionsmodus** des Hefts und den
**Verben der Kompetenz**. Erste Quelle ist `sprachmodi[].detail` der
Kompetenz: Es nennt oft schon die Produktform.

| Modus des Hefts | Geeignete Produkttypen |
|---|---|
| Produktion schriftlich und bildlich | Brief, Stellungnahme, Leserbrief, Flyer, Plakat, Merkblatt, Vergleichstabelle, Ablaufplan |
| Produktion mündlich | Statement, Kurzvortrag, Erklärung für eine bestimmte Person |
| Produktion multimedial | Folien mit Sprechtext, Storyboard, gestalteter Beitrag |
| Interaktion und Kollaboration mündlich | Gespräch, Diskussion, Interview, Beratung — mit schriftlichem Träger (Gesprächsplan, Protokoll) |
| Interaktion und Kollaboration schriftlich / digital | Briefwechsel, Rückmeldung mit Antwort, gemeinsam geführtes Dokument |
| nur Rezeptionsmodi | Auswertungsprodukt: Vergleichstabelle, kommentierte Übersicht, Prüfbericht |

Regeln: **Produkttyp A ≠ Produkttyp B.** Das Verb entscheidet innerhalb der
Zeile (formulieren → Brief oder Stellungnahme; vergleichen → Tabelle;
vertreten → Statement oder Diskussion; planen → Ablaufplan). Jedes Produkt
entsteht auf der Arbeitsfläche oder wird dort geplant. Format nennen (Umfang,
Adressat, Dauer). Default bei mehreren passenden Typen: der, den `detail`
nennt; sonst der mit dem engsten Bezug zum Verb.

**Produktbild-Art** (Beispiel- und Lösungsbild) folgt dem Produkttyp; der
Bauplan nennt die Art des Hauptblocks:

| Produkttyp | Blockart |
|---|---|
| Plakat, Flyer, Merkblatt, Übersicht, Ablaufplan | Liste (`eintraege`) |
| Vergleich, Rechnung, Raster, Prüfbericht | Tabelle (`kopf`, `zeilen`) |
| Brief, Stellungnahme, Leserbrief, Statement | Fliesstext (`text`) |
| Gespräch, Diskussion, Interview, Beratung | Wechselrede (`wechsel`) |

### 3.7 Pol-Typ je Heft und Spur (§4, Leitfaden §6.1, `regel5`)
Zulässig: `lehrmittel_quelle` · `position_gegenposition` ·
`modell_eigener_fall` · `recht_praxis` · `quelle_quelle`. Hart: A ≠ B
innerhalb derselben Spur; `lehrmittel_quelle` und `quelle_quelle` nur in
`mit_medien`. Auswahl nach dem, **was als zweiter Pol wirklich vorliegt**:

| Was die Spannung des Hefts ausmacht | Pol-Typ |
|---|---|
| eine Norm (Gesetz, Vertrag, Reglement) und das, was tatsächlich geschieht | `recht_praxis` |
| ein Modell oder Schema des Lehrmittels und der eigene Fall | `modell_eigener_fall` |
| zwei begründbare Haltungen zur selben Frage | `position_gegenposition` |
| Lehrmittelaussage und das, was die Quelle zeigt (nur mit Medien) | `lehrmittel_quelle` |
| zwei Quellen, die sich widersprechen — nur wenn beide Pflichtlektüre sind | `quelle_quelle` (kein Default) |

Kollidieren A und B in einer Spur, behält das Heft seinen Typ, dessen
Konfliktart ihn enger trägt; das andere nimmt den nächsten passenden. Hat ein
Heft nur eine Spur, entfällt der Schlüssel der anderen.

### 3.8 KN-Kriterien und Verteilung (§4, §5)
Vier Kriterien, zwei SuK und zwei Ges; Namen nach
`references/phase-2-3-prinzip-kn.md` (Abschnitt `rubrik_shared`): Das dritte
heisst nach dem **dominanten Aspekt** der Einheit, hergeleitet aus den
`aspekt`-Angaben der Kompetenzen. Ein anderes SuK-Kriterium nur mit Grund und
mit der Angabe, welches es ersetzt. **Verteilung: je Heft 1 SuK + 1 Ges,
zusammen alle vier.** Regel: Ein Kriterium geht in das Heft, dessen Produkt es
am deutlichsten zeigt; der Bauplan nennt je Kriterium diesen Grund. Default
bei Gleichstand: das Ges-Kriterium des dominanten Aspekts in das Heft, dessen
Kompetenz diesen Aspekt trägt.

### 3.9 `modi_kn` (§5)
Vereinigung der Sprachmodi der drei KN-Formen — hergeleitet aus dem, was jede
Form vorlegt und verlangt (`references/phase-2-3-prinzip-kn.md`), wörtlich wie
im Datensatz. Ein Modus eines Hefts muss nicht in `modi_kn` stehen.

### 3.10 `modi_auftrag`, Produkte, Sozialform (§6, Leitfaden §7.2–§7.3, E25)
**Formel:** `modi_auftrag = modi_kn − (modi_heft_A ∪ modi_heft_B)`.

- **Sonderfall leer:** Der Auftrag trägt den einen KN-Modus mit dem geringsten
  Gewicht in den Heften — der in weniger Heften steht; bei Gleichstand der,
  den mehr KN-Formen führen; dann die Reihenfolge SM1–SM9.
- **Sonderfall mehr als zwei:** Der Auftrag trägt zwei — die, die mehr
  KN-Formen führen; bei Gleichstand Produktion vor Interaktion vor Rezeption.
  Die übrigen stehen in §8 als Lücke.

Der Bauplan schreibt die Rechnung aus (drei Mengen, Ergebnis, Sonderfall).

**Produkte:** `gemeinsamer_auftrag.produkte` hat genau zwei Einträge (der
erste belegt A2, der zweite A3): `schritt` (1–5, verschieden), `modus`
(wörtlich aus den Modi des Auftrags; jeder Modus mindestens einmal), `form`.
Typ je Modus nach der Tabelle in 3.6, **verschieden von den Produkttypen der
Hefte**. Trägt der Auftrag nur einen Modus, zeigen die zwei Seiten zwei
Arbeitsschritte desselben Produkts. Ist ein Rezeptionsmodus dabei, ist das
Produkt die sichtbare Auswertung eines Dokuments, das in der Situation steht
(der Auftrag braucht kein Medium, Leitfaden §7.4).

| Produkt | `form` |
|---|---|
| schriftlich, bildlich, multimedial; Interaktion schriftlich oder digital | `flaeche` |
| mündlicher Beitrag, Gespräch, Diskussion (Planung über Stationen) | `spur` — mit `stationen` (2–4, je ≤ 60 Zeichen), `hinweis` (≤ 260), `dauer` optional |

**Sozialform:** Enthält `modi_auftrag` einen Interaktionsmodus → Partner- oder
Gruppenarbeit, keine Einzelarbeit, jede Person mit ausgewiesenem Anteil. Sonst
frei; das Produkt bleibt individuell. Dazu eine Empfehlung an die Lehrperson.

### 3.11 SK je Heft und KN-Schnittmenge (§3)
Grundlage ist allein die SK-Liste des Themas aus Phase 0. **Je Heft drei:**
eine für das, was LF3 an der Quelle tut, eine für das, was LF4 entscheidet,
eine für das Produkt — je SK ein Halbsatz mit der Stelle. **KN-Schnittmenge =
die SK, die A und B gemeinsam haben, ergänzt auf drei** mit je der SK von A
und von B, die der Hybrid-Fall am stärksten verlangt (stehen schon drei in
beiden, sind es diese). Danach **jede** SK des Themas prüfen: steht sie in A,
B oder KN? Nicht abgedeckte nennt §8. Hat das Thema weniger als drei SK,
trägt jedes Heft alle.

### 3.12 Hybrid-Fall des KN und Fall-Begriffe (§5)
Drei Sätze: eine Szene, die beide Konfliktarten verbindet, mindestens ein
Spannungsfeld aufspannt, neu ist (anderer Gegenstand, andere Beteiligte,
anderer Lebensbereich als A, B und Auftrag). Default: der Fall, der die
wenigsten Wörter mit Heften und Quellen teilt.

**Fall-Begriffe** (`fall_ausschluss_hefte_und_auftrag`): `fallAusschluss`
sucht jeden Begriff als **Teilzeichenkette ohne Unterschied von Gross- und
Kleinschreibung** in allen Strings der Hefte, des Auftrags, des Glossars und
der Quellenkarten. Darum:

- nur Begriffe **ab fünf Zeichen**;
- kein Begriff, der Teil eines gängigen Worts ist (Probe: steckt er in einer
  Zusammensetzung oder Beugung, die ein Heft, der Auftrag oder das Glossar
  braucht?);
- **kein Kernbegriff der Hefte** und kein Wort aus den KN-Kriterien-Namen;
- **keine ganze Quellengattung sperren**: Nennt fast jede Statistik oder
  jeder Bericht zum Thema den Begriff, ist der Fall falsch gewählt — anderen
  Fall nehmen (BERICHT §8 Punkt 3);
- zwei bis fünf Begriffe; der Gegenstand des Falls muss darunter sein.

### 3.13 Lebensbereiche, Methodenkarten, Mitnahme, Quellen-Slots

| Entscheid | Regel und Default |
|---|---|
| **Lebensbereiche** (§4–§6) | Vier, **paarweise verschieden**: Heft A, Heft B, Auftrag, KN. Herleitung: `leitidee` und `lebensbezuege[].text` nennen die Bereiche, in denen die Kompetenz gebraucht wird. Default: A und B in den zwei Bereichen, die den Kompetenztexten am nächsten sind; KN dort, wo beide Konfliktarten in eine Szene passen; Auftrag im verbleibenden — er muss ohne Medium spielbar sein. |
| **Methodenkarten** (§4; `docs/methodenkartei.md`, E13) | Je Heft vier Einträge: drei feste Karten und der Platz der Rezeptionskarte, die je Spur gesetzt wird. Nur **vorhandene** Refs aus `src/data/methoden/`: zuerst `lm-…`-Karten der Methodenkapitel aus der Crosswalk-Zeile, die zu Modus und Produkttyp passen, dann `hko-…`-Karten. Rezeptionskarte nach Quellentyp der Spur. **Genau zwei angereicherte Karten** (mit `beispiel` oder `fehler`) — die Rezeptionskarte zählt mit. Passt keine vorhandene Karte: §9 «neue Karte nötig» mit Grund. |
| **«Das nehme ich mit»** (§4) | Drei Zeilen je Heft, je ≤ 50 Zeichen: zwei benennen, was das Produkt des Hefts dem gemeinsamen Auftrag als Werkzeug mitgibt; die dritte hält fest, was noch offen ist. |
| **Quellen-Slots** (§7) | Je Heft mit `mit_medien`: Quelle, Ersatz, Vertiefung 1, Vertiefung 2; IDs nach `references/ableitungsregeln.md`. **Typ** = Rezeptionsmodus der Heft-Kompetenz, sonst des Themas (Leitfaden §5); A und B möglichst verschieden. Der Entwurf nennt, was die Quelle zeigen muss — die Fragen entstehen erst nach der Wahl. Nach Phase Q je Slot: Titel, Herausgeber, Datum, Ausschnitt, Länge, Karte, Archivtext, Zugeständnis. |

## 4. Abdeckungsprüfung vor dem Stopp

Tabelle im Bauplan §8 (Form: `references/kohaerenz.md`, Teil 3). Jede Zeile
füllt sich oder steht als **Lücke** da — eine Lücke ist erlaubt, eine
verschwiegene nicht.

| Prüfung | Soll |
|---|---|
| jeder Modus aus `modi_kn` | Heft A, Heft B oder Auftrag — mit der Stelle |
| jeder Modus eines Hefts | S. 3 (Rezeption) oder Produkt (Produktion, Interaktion) |
| jeder Modus des Auftrags | `modus` mindestens eines Produkts |
| jeder Kompetenz-Modus des Lebensbezugs | geführt — sonst Lücke |
| jede SK des Themas | A, B oder KN — sonst Lücke |
| Produkttyp A, B, Auftrag | A ≠ B; Auftrag ≠ A und ≠ B |
| Lebensbereich A, B, Auftrag, KN | paarweise verschieden |
| KN-Kriterien | je Heft 1 SuK + 1 Ges; A ∪ B = alle vier |
| Pol-Typ | A ≠ B je Spur; Medien-Typen nur mit Medien |
| Spuren | je Heft mindestens eine; nur `mit_medien` → Quelle vorhanden |
| Fall-Begriffe | kein Treffer in Situationen, Produkten, Quellen-Ausschnitten des Bauplans |
| Vergleich mit Gold | Modi des Auftrags, Produkttypen, SK: nicht alle drei gleich — sonst Herleitung nachprüfen |

Scheitert eine harte Zeile (Produkttyp, Lebensbereich, Kriterien, Pol-Typ,
Spuren, Fall-Begriffe), wird der Entscheid geändert, bevor gestoppt wird.

## 5. Der Stopp

**Was Pietro sieht** — eine Nachricht, kein JSON: (1) Pfad des Bauplans und
der Zuschnitt (Lehrgang, Hefte, Spuren mit Grund); (2) die Entscheide als
Liste, je mit Empfehlung und den Alternativen «(1)», «(2)»; (3) die Quellen
mit ihrem Zugeständnis und offene Slots; (4) die Abdeckungstabelle, Lücken
zuoberst; (5) Ausnahmen (§9) und alles, was nicht belegt ist; (6) ein Satz:
«ok» startet die Erzeugung ohne weitere Rückfrage.

**Antwort verarbeiten:**

- **«ok»** → Zeile im Bauplan ersetzen durch
  `**Freigabe:** freigegeben am JJJJ-MM-TT` (heutiges Datum in Ziffern).
  Weiter mit Phase 2.
- **Korrektur** (auch «bei X Alternative 1») → Entscheid ändern, alles davon
  Abhängige nachziehen (Modi → Spuren → `modi_auftrag` → Produkte →
  Sozialform; Fall → Fall-Begriffe), Abdeckungsprüfung erneut, dann dieselbe
  Freigabe-Zeile setzen und weiter. **Kein zweiter Stopp.** Verletzt die
  Korrektur eine harte Regel, gilt die nächstliegende zulässige Variante;
  Abweichung in den Bericht. Verlangt sie eine neue Quelle: Phase Q für
  diesen Slot, dann weiter.
- **Keine Antwort / etwas anderes** → nichts erzeugen; die Zeile bleibt
  `**Freigabe:** offen`.

Die Freigabe-Zeile setzt die Skill nur auf Pietros Antwort hin, nie von sich
aus. `scripts/cloud-preflight.mjs` liest genau diese Zeile.
