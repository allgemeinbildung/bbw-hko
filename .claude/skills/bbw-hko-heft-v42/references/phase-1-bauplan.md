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

1. **Bauplan-Entwurf** aus dem Verortungsblatt (Phase 0): §1–§6, §8 und §10
   («Fakten», Abschnitt 3.14) gefüllt; §7 nennt je Slot den gesuchten Typ, Stand «offen», und im
   Unterabschnitt «Suchaufträge», was die Quelle zeigen muss.
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

### 3.0 Titel und Kennungen (§1)
Ordnername, IDs und `topic_slug` nach `references/ableitungsregeln.md`.
`einheit_titel`: der Fokus als Titel (Prüfung auf Gleichnamigkeit dort, §7).
`modul_titel`, Kurzform: «<Titel des Themas> — <Fokus in zwei bis vier
Wörtern, Kleinschreibung nach dem Gedankenstrich>». Der Titel des Themas
steht wörtlich im Datensatz (`themen[].titel`).

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
- **`verbindlich`:** ein Satz, der die Spannung offen hält (beide Seiten
  bleiben begründbar); er wird `mehrdeutigkeits_pflicht` im KN.
- **`mindmap_zentrum_kurz`:** Kurzform des Ankers, **≤ 40 Zeichen, gezählt**,
  identisch in A und B. Default: die zwei Pole des Spannungsfelds, das beide
  Hefte teilen, als «X oder Y».

### 3.3 Label, Konfliktart und Spannungsfeld je Heft (§4)
`herausforderung.label`: eine Tätigkeit (Gegenstand + Verb in der Grundform),
kein Thema. `mehrdeutigkeit.trade_off` des Hefts: **genau ein** Eintrag aus
dem Trade-off-Raum (§3), wörtlich — der, den die Konfliktart des Hefts trägt.

Konfliktart: Form «X vs. Y», je Heft eine, A ≠ B. Herleitung: die Verben der
Heft-Kompetenz(en) und das, was die geprüften Seiten tragen. Aspekte der
Einheit = Aspekte der Kompetenzen aus Phase 0; ein weiterer nur, wenn eine
Konfliktart ihn ausdrücklich trägt — dann mit Grund.

### 3.4 Situation, Fallzahlen, Leitfrage (§4)
Situation in zwei Sätzen: Ich-Form, neutrale Persona, ein Lebensbereich, die
Konfliktart spürbar, ohne sie zu benennen. Erfundene Fallzahlen sind erlaubt
(bei einem Fall mit Zahlen im Bauplan ausgeschrieben und nachgerechnet,
höchstens vier Zeilen), Zahlen über die Welt nicht. Kein Fall-Begriff aus §5.
Dazu die **Leitfrage der Situation**: Ich-Form, benennt
die Spannung, gibt keine Antwort vor.

**Heft mit nur der Medien-Spur:** Die Situation bleibt im Entwurf
themenneutral (sie nennt die Lage, nicht das Thema der Quelle); das Thema
trägt Phase Q nach, bevor der Bauplan vorgelegt wird (E27).

### 3.5 Sprachmodi je Heft — geführt und geübt (§4, E27)
Das Heft **führt** die Sprachmodi seiner Kompetenz(en) von der Kompetenz-Ebene
des Datensatzes (Phase 0) — nichts von der Themen-Ebene. Einen
Rezeptionsmodus übt es auf S. 3 an der Quelle des passenden Typs, einen
Produktions- oder Interaktionsmodus am Handlungsprodukt. **Default: alle
Kompetenz-Modi.** Gestrichen wird ein Modus nur, wenn das Produkt ihn nicht
tragen kann; er steht dann in §8 als Lücke und in §9 als Ausnahme. Rezeption
mündlich und audiovisuell werden nicht gestrichen (Phase 0, Abschnitt 4). Was
das Heft führt, bestimmt die Spuren (`regel4`); nach diesem Entscheid die
Spuren neu ablesen.

- **Kein Rezeptionsmodus in der Kompetenz:** Die Rezeption auf S. 3 ist
  «geübt, nicht geführt». Sie steht nicht unter den Modi des Hefts; §4 nennt
  sie in derselben Zeile als «geübt», §8 in Zeile A3.
- **Zwei Rezeptionsmodi in einer Kompetenz** (mündlich und audiovisuell):
  beide werden geführt. Die Quelle trägt den zuerst genannten; der andere
  bekommt seine Stelle über eine Vertiefung des anderen Typs und steht in §8
  als «freiwillig geübt».

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
nennt; sonst der mit dem engsten Bezug zum Verb. `handlungsprodukt_typ` steht
im Bauplan als eine Zeile (Typ und Format, kein «oder»), dazu die **Schritte
01–05** und die **Abgaben** in Stichworten — Schritt 03 nimmt auf, was LF3
liefert, Schritt 04, was LF4 liefert.

**Produktbild-Art** (Beispiel- und Lösungsbild) folgt dem Produkttyp; der
Bauplan nennt die Art des Hauptblocks:

| Produkttyp | Blockart |
|---|---|
| Plakat, Flyer, Merkblatt, Übersicht, Ablaufplan | Liste (`eintraege`) |
| Vergleich, Rechnung, Raster, Prüfbericht | Tabelle (`kopf`, `zeilen`) |
| Brief, Stellungnahme, Leserbrief, Statement | Fliesstext (`text`) |
| Gespräch, Diskussion, Interview, Beratung | Wechselrede (`wechsel`) |

Verlangt das Produkt Markierungen, nennt der Bauplan die **Legende** (höchstens
drei Einträge: `key` als kurzes Kennwort in Kleinbuchstaben, Text ≤ 28).

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
Vereinigung der Sprachmodi der drei KN-Formen — aus dem, was jede Form vorlegt
und verlangt (`references/phase-2-3-prinzip-kn.md`), wörtlich wie im
Datensatz. **`modi_kn` gehört zum Gerüst** (E27): Die drei Formen sind fest,
also auch ihre Modi; der Wert ist in jeder Einheit derselbe, und Gleichheit
mit Gold ist hier kein Befund. Ein Modus eines Hefts muss nicht in `modi_kn`
stehen.

### 3.10 `modi_auftrag`, Produkte, Sozialform (§6, Leitfaden §7.2–§7.3, E25)
**Formel:** `modi_auftrag = modi_kn − (modi_heft_A ∪ modi_heft_B)` — mit den
**geführten** Modi der Hefte (3.5). Was ein Heft auf S. 3 nur übt, zählt nicht.

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
Arbeitsschritte desselben Produkts. Ist ein Rezeptionsmodus dabei (die Formel
ergibt ihn, wenn kein Heft ihn führt), ist das Produkt die sichtbare
Auswertung eines Dokuments, das **vollständig** in der Situation steht (der
Auftrag braucht kein Medium, Leitfaden §7.4); Form `flaeche`.

| Produkt | `form` |
|---|---|
| Auswertung eines Dokuments aus der Situation (Rezeptionsmodus) | `flaeche` |
| schriftlich, bildlich, multimedial; Interaktion schriftlich oder digital | `flaeche` |
| mündlicher Beitrag, Gespräch, Diskussion (Planung über Stationen) | `spur` — mit `stationen` (2–4, je ≤ 60 Zeichen), `hinweis` (≤ 260), `dauer` optional |

**Sozialform:** Enthält `modi_auftrag` einen Interaktionsmodus → Partner- oder
Gruppenarbeit, keine Einzelarbeit, jede Person mit ausgewiesenem Anteil. Sonst
frei; das Produkt bleibt individuell. Dazu eine Empfehlung: Sie wird auf A1
gedruckt und ist an die Lernenden lesbar formuliert, kein Auftrag an die
Lehrperson.

**Dazu im Bauplan §6:** Titel des Auftrags · `mehrdeutigkeit.trade_off` des
Auftrags (die Spannung dieses Falls, «X vs. Y») · die fünf Schritte und die
Abgaben in Stichworten · `kontext_ausschluss` (drei Einträge, Gegenstände der
Fälle von A, B und KN — keine Werkzeuge, keine Fachbegriffe;
`references/phase-7-set.md` §4.4).

### 3.11 SK je Heft und KN-Schnittmenge (§3)
Grundlage ist allein die SK-Liste des Themas aus Phase 0. Die SK des Themas
werden auf A und B **verteilt** (E27): **je Heft drei, so viele verschiedene
wie möglich, mindestens eine gemeinsam** — je eine für das, was LF3 an der
Quelle tut, für das, was LF4 entscheidet, und für das Produkt; je SK ein
Halbsatz mit der Stelle. **Der KN trägt die gemeinsame(n) SK, ergänzt auf
drei** mit je der SK von A und von B, die der Hybrid-Fall am stärksten
verlangt (stehen schon drei in beiden, sind es diese). Danach **jede** SK des
Themas prüfen: steht sie in A, B oder KN? Eine SK des Themas, die nirgends
Platz hat, nennt §8 als Lücke. Hat das Thema weniger als drei SK, trägt jedes
Heft alle. Eine SK ausserhalb des Themas ist eine Ausnahme und steht in §9.

### 3.12 Hybrid-Fall des KN und Fall-Begriffe (§5)
Dazu der **Titel des KN-Falls** (nennt den Fall, nicht die Lösung). Bauplan §5
ist die eine Stelle des Bauplans, an der Fall und Fall-Begriffe stehen dürfen:
**§5 selbst ist vom Fall-Ausschluss ausgenommen.**

Drei Sätze: eine Szene, die beide Konfliktarten verbindet, mindestens zwei Spannungsfelder aufspannt, neu ist (anderer Gegenstand, andere Beteiligte,
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
| **Methodenkarten** (§4; `docs/methodenkartei.md`, E13) | Je Heft vier Einträge: drei feste Karten und der Platz der Rezeptionskarte, die je Spur gesetzt wird. Nur **vorhandene** Refs aus `src/data/methoden/`: zuerst `lm-…`-Karten der Methodenkapitel 16–20, die zu Modus und Produkttyp passen — auch wenn die Crosswalk-Zeile des Lebensbezugs das Kapitel nicht nennt (E27: die Karte ist die Fundstelle) —, dann `hko-…`-Karten. Rezeptionskarte nach Quellentyp der Spur. **Genau zwei angereicherte Karten** (mit `beispiel` oder `fehler`) — die Rezeptionskarte zählt mit. Passt keine vorhandene Karte: §9 «neue Karte nötig» mit Grund. |
| **«Das nehme ich mit»** (§4) | Drei Zeilen je Heft, je ≤ 50 Zeichen: zwei benennen, was das Produkt des Hefts dem gemeinsamen Auftrag als Werkzeug mitgibt; die dritte lautet immer «Mir noch unklar». |
| **Quellen-Slots** (§7) | Je Heft mit `mit_medien`: Quelle, Ersatz, Vertiefung 1, Vertiefung 2; IDs nach `references/ableitungsregeln.md`. **Typ** = Rezeptionsmodus der Heft-Kompetenz; nennt sie keinen, der Modus des Themas (Leitfaden §5) mit der Ausweichfolge Audio → Video mit Untertiteln → Artikel (`references/phase-q-quellen.md` §3); A und B möglichst verschieden. Im Entwurf: Spalte «Typ (gesucht)», Stand «offen», und im Unterabschnitt «Suchaufträge», was die Quelle zeigen muss — die Fragen entstehen erst nach der Wahl. Nach Phase Q je Slot: Titel, Herausgeber, Datum, Ausschnitt, Länge, Karte, Archivtext, Zugeständnis, Stand. Dazu die Zeile **«Rasterspalten je Heft und Spur»** (`references/phase-5-spuren.md` §4). **Heft mit nur der Medien-Spur:** Die Ersatzquelle ist Pflicht, mit demselben Typ oder Sprachmodus. |

### 3.14 Fakten (§10)

Jede **Rechts- und Sachaussage über die Welt**, die die Einheit tragen soll,
steht vor dem Schreiben im Bauplan §10: Artikelnummer, Frist, Betrag, Prozent,
Datum, Zahl der Unterschriften, Ergebnis einer Abstimmung, jedes «Stand …».
Je Zeile:

| Spalte | Inhalt |
|---|---|
| Aussage | in eigenen Worten — kein Satz aus Gesetz, Lehrmittel oder Quelle |
| Wo gebraucht | Heft und Stelle (LF, Raster, Lösung, Beispiel), Auftrag, KN, Begleiter |
| Fundstelle im Lehrmittel | Kapitel und Seite, oder «—» |
| Primärquelle | Gesetz oder Amt mit Artikel bzw. Titel der Seite |
| URL | die Adresse, an der es heute steht |
| Abruf | JJJJ-MM-TT |
| Urteil | stimmt · vertretbar vereinfacht · nicht belegbar |

Regeln:

- **Primärquelle** heisst Gesetz oder Amt (fedlex.admin.ch, admin.ch,
  bfs.admin.ch, ch.ch, Kanton, Gericht) — nicht das Lehrmittel, nicht ein
  Medienbericht. Das Lehrmittel bleibt die Fundstelle, die das Heft nennt;
  §10 hält fest, dass die Aussage heute an Gesetz oder Amt stimmt.
- **Die Erzeugung zitiert nur daraus.** Eine Aussage dieser Art, die nicht in
  §10 steht, wird nicht geschrieben. Braucht ein Heft sie doch, fehlt sie im
  Bauplan: vor dem Stopp nachtragen.
- **Nicht belegbar** → die Aussage entfällt, oder der Bauplan sagt, dass das
  Heft sie als Fallüberlegung bzw. als Aussage der Quelle wiedergibt, nicht
  als Tatsache. Sie steht zusätzlich in §9.
- **Sachaussagen einer Medienquelle**, auf denen eine Rasterzeile oder eine
  Lösung aufbaut (Zahl einer Studie, Ausgang einer Abstimmung, Dauer einer
  Regelung), gehören auch hierher, nach Phase Q.
- **Nicht hierher** gehören die erfundenen Fallzahlen einer Situation; sie
  werden nachgerechnet (Abschnitt 3.4), nicht belegt.
- Widerspricht das Lehrmittel der Primärquelle, steht das hier und in §9; der
  Entscheid, was das Heft schreibt, fällt am Stopp.

Nach dem Schreiben prüft das Fakten-Audit jede Zeile am fertigen Text noch
einmal, dazu alles, was hinzukam (`references/phase-10-abschluss.md` §2).

Herkunft: Rückblick `docs/upgrade-v4.2/RUECKBLICK-produktion-2026-10-06.md` §4
(rund 35–40 falsche oder überzogene Rechts- und Sachaussagen in mindestens
neun Einheiten, gefunden erst an Primärquellen), §5.2 («Fakten im Bauplan
**und** Fakten-Audit nach dem Schreiben»), §5.4 («Bauplan → Einheit»);
ENTSCHEIDE E34.

## 4. Abdeckungsprüfung vor dem Stopp

Tabelle im Bauplan §8. Die Zeilen A1–A14 und ihr Soll stehen **nur** in
`references/kohaerenz.md` §3; die Vorlage führt dieselben Zeilen. Jede Zeile
füllt sich oder steht als **Lücke** da — eine Lücke ist erlaubt, eine
verschwiegene nicht.

Scheitert eine harte Zeile (A8–A13: Produkttyp, Lebensbereich, Kriterien,
Pol-Typ, Spuren, Fall-Begriffe), wird der Entscheid geändert, bevor gestoppt
wird.

## 5. Der Stopp

**Was Pietro sieht** — eine Nachricht, kein JSON: (1) Pfad des Bauplans und
der Zuschnitt (Lehrgang, Hefte, Spuren mit Grund); (2) die Entscheide als
Liste, je mit Empfehlung und den Alternativen «(1)», «(2)»; (3) die Quellen
mit ihrem Zugeständnis und offene Slots; (4) die Abdeckungstabelle, Lücken
zuoberst; (5) Ausnahmen (§9) und alles, was nicht belegt ist — darunter jede
Zeile aus §10 mit Urteil «nicht belegbar»; (6) ein Satz:
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

**Davon getrennt — der Bauplan trägt die Freigabe schon** (Auto-Modus,
`references/auto-modus.md` §1): Dann findet dieser Stopp nicht statt. Die
Skill setzt und ändert die Zeile nicht, legt nichts vor und beginnt nach der
Prüfung des Bauplans (dort §7) mit Phase 2.
