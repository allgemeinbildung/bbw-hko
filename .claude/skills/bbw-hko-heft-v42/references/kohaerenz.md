# Kohärenz-Raster — was fest ist, was hergeleitet wird

Leitprinzip (Pietro, 02.10.2026): Die Einheiten sind untereinander kohärent
und behalten zugleich die HKO-Flexibilität bei **Sprachmodi,
Schlüsselkompetenzen und Handlungsprodukten**. Die Gold-Einheit 1.3.1 ist die
Referenz für das Gerüst, nicht für den Inhalt. Eine Einheit, die wieder auf
«Karte, Budget, Entscheidungsblatt und Sprachnachricht» hinausläuft, obwohl ihr
Lehrplan anderes verlangt, ist ein Fehler der Skill.

Diese Datei wird zweimal gebraucht: **vor dem Bauplan-Stopp** (Phase 1, die
Abdeckungstabelle) und **am Schluss** (Phase 9, der Vergleich).

## 1. Fest — in jeder Einheit gleich

| # | Was | Woran man es prüft |
|---|---|---|
| F1 | Aufbau: Prinzip, zwei Hefte A/B, gemeinsamer Auftrag, KN, Begleiter, Lösungen | sechs Dateien im Ordner; `check-all` STRUKTUR |
| F2 | Heft: acht Seiten in fester Folge, Template `heft_8page_v42` | `template`; `messen-v42` |
| F3 | Kern einmal, Spuren nur das Abweichende; eine Spur fehlt, wenn der Modus sie nicht trägt | `leitfragen` = LF1, LF2; `spuren.*` = LF3, LF4, Quellen, Kasten, Rezeptionskarte, `scaffold_90`; `regel1`, `regel4` |
| F4 | Vier Leitfragen mit fester Funktion: LF1 verstehen (K2) · LF2 anwenden (K3) · LF3 analysieren, Raster + Befund (K4) · LF4 beurteilen und entscheiden, Pol-Typ (K4) | `bloom`, `antwortform`, `pol_typ`; `prinzip.bloom_zielprofil` |
| F5 | Fünf Schritte zum Produkt, die sagen, welche Leitfrage was liefert | `handlungsprodukt.schritte`, `liefert`; `check-einheiten` |
| F6 | Feedback-Kriterien im Wortlaut des KN, 0–3 Punkte; Hefte je 2 (1 SuK + 1 Ges), zusammen alle 4; Auftrag alle 4 | `regel6` |
| F7 | Begriffsnetz aus dem Glossar des Hefts, gleiches Zentrum in A und B, ein Transfer-Ast | `regel7`, `regelGlossar` |
| F8 | Abschluss: zwei Quer-Check-Fragen, drei Zeilen «Das nehme ich mit», vier Checklisten-Zeilen | Budgets |
| F9 | Gemeinsamer Auftrag: neuer Fall in neuem Lebensbereich, fünf Schritte, zwei Produkte, Bogen mit vier Seiten | `budgetAuftrag`, `regel8`, `regel9Kontext` |
| F10 | KN: eine Hybrid-Situation, drei Formen **mit ihren Sprachmodi** (`prinzip.modi_kn`, `kn.kn_typen[].sprachmodi` — die Formen sind fest, also auch ihre Modi), ein Raster mit vier Kriterien | Schlüsselmenge von `kn.json`; `modi_kn` = Vereinigung der Modi der drei Formen |
| F11 | Lösung zu jedem Feld, mit Fundstelle | `regelLoesungen`, `check-lf-loesung` |
| F12 | Benennung, IDs, Kurzlink, Quellen-IDs | `references/ableitungsregeln.md` |
| F13 | Sprache und Anrede; neutrale Persona; ein Akzent | `references/sprache.md` |

Diese dreizehn Zeilen werden **nie** an eine Einheit angepasst. Passt ein
Inhalt nicht hinein, ist der Inhalt falsch geschnitten — nicht das Gerüst.

## 2. Hergeleitet — je Einheit aus Lehrplan und Prinzip

| # | Was | Woraus | Wo es landet |
|---|---|---|---|
| H1 | **Sprachmodi je Heft — «geführt»** | die Modi der Kompetenz(en) des Hefts im nRLP-Datensatz, **Kompetenz-Ebene**; nichts von der Themen-Ebene (`regel4` würde sonst jede Spur ohne Medien sperren) | `nrlp.sprachmodi` = `prinzip.modi_pro_heft[L]`; bestimmt die zulässigen Spuren; nur geführte Modi gehen in die Formel des Auftrags |
| H2 | **Sprachmodi des Auftrags** | `modi_kn − (A geführt ∪ B geführt)`, Leitfaden §7.2 mit beiden Sonderfällen. Ergibt die Formel einen Rezeptionsmodus: Das Produkt ist die sichtbare Auswertung eines Dokuments, das vollständig in der Situation steht (Form `flaeche`) | `prinzip.modi_auftrag`, `gemeinsamer_auftrag.sprachmodi`, `produkte[].modus` |
| H3 | **Schlüsselkompetenzen** | SK des nRLP-Themas mit ihrer Iteration, auf A und B verteilt: je drei, so viele verschiedene wie möglich, mindestens eine gemeinsam. Der KN trägt die gemeinsame(n), ergänzt auf drei aus A und B. Eine SK des Themas ohne Platz nennt der Bauplan als Lücke | `nrlp.sk`, `sk_anker`, `prinzip.sk_pro_situation`, `sk_schnittmenge_kn`, `kn_typen[].sk` |
| H4 | **Handlungsprodukt je Heft**: Typ und Format | Produktions- oder Interaktionsmodus des Hefts und die Verben der Kompetenz | `handlungsprodukt.*`, Schritte, Abgaben, Checkliste, Beispiel- und Lösungsbild (Blockart) |
| H5 | **Produkte des Auftrags** und ihre Form auf dem Bogen | H2 | `gemeinsamer_auftrag.schritte`, `abgaben`, `produkte` (Form `flaeche` oder `spur`), `sozialform` |
| H6 | Typ der Quelle, Spalten des Rasters | Rezeptionsmodus der Kompetenz des Hefts (geführt). Nennt sie keinen: Modus des Themas (Leitfaden §5) mit der Ausweichfolge Audio → Video mit Untertiteln → Artikel — die Rezeption ist dann «geübt, nicht geführt» | Quellenkarte `typ`, `raster.spalten` |
| H7 | Pol-Typ von LF4 je Heft und Spur | die Spannung des Hefts und was als zweiter Pol verfügbar ist | `pol_typ`, `prinzip.pol_typ_verteilung` |
| H8 | Aspekte, dominanter Aspekt, Name des zweiten Ges-Kriteriums | nRLP-Datensatz | `prinzip.aspekte`, `kn.dominanter_aspekt`, `rubrik_shared` |
| H9 | Fall, Zahlen, Lebensbereiche, Methodenkarten, Glossar | Lehrmittelkapitel, Bauplan | überall |

**«Geführt» und «geübt» (ENTSCHEIDE E27).** *Geführt* heisst: Der Modus steht
in `nrlp.sprachmodi` des Hefts und in `prinzip.modi_pro_heft` — das sind die
Modi der Kompetenz(en), sonst keine. *Geübt* heisst: Das Heft übt den Modus,
ohne ihn zu führen. Seite 3 übt in jedem Heft Rezeption (LF3 analysiert eine
Quelle; das gehört zum Gerüst). Nennt die Kompetenz keinen Rezeptionsmodus, ist
diese Rezeption «geübt, nicht geführt» — sie steht in keinem der zwei Felder,
geht nicht in die Formel des Auftrags, und die Abdeckungstabelle weist sie als
«geübt» aus, nicht als Lücke. Nennt eine Kompetenz **zwei** Rezeptionsmodi
(mündlich und audiovisuell), werden beide geführt: Die Quelle trägt den zuerst
genannten, der andere bekommt seine Stelle über eine Vertiefung des anderen
Typs und steht in der Abdeckung als «freiwillig geübt».

**Regel:** Kein Wert der rechten Spalte wird aus der Gold-Einheit oder aus
einem Skelett übernommen. Jede Phase, die einen dieser Werte schreibt, nennt
im Bauplan bzw. im Bericht die Herleitung in einem Satz.

## 3. Abdeckungstabelle (im Bauplan §8, vor dem Stopp; im Bericht am Schluss)

Jede Zeile muss sich füllen lassen. Eine leere Zelle ist ein Befund, kein
Schönheitsfehler.

Bauplan §8 (`docs/cloud-run/bauplaene/_VORLAGE.md`) führt dieselben vierzehn
Zeilen mit den Spalten «Befund» und «Lücke».

| # | Prüfung | Soll |
|---|---|---|
| A1 | jeder Modus aus `modi_kn` → Heft A, Heft B oder Auftrag | mit der Stelle, an der er geführt oder geübt wird |
| A2 | jeder geführte Modus eines Hefts → S. 3 (Rezeption) oder Produkt | eine benannte Stelle im Heft |
| A3 | Rezeption auf S. 3, die das Heft nicht führt → «geübt»; zweiter Rezeptionsmodus einer Kompetenz → «freiwillig geübt» | Modus und Typ der Quelle bzw. der Vertiefung genannt; keine Lücke |
| A4 | jeder Modus des Auftrags → mindestens ein Produkt | `modus` mindestens eines Eintrags in `produkte` (bei nur einem Modus tragen ihn beide) |
| A5 | jeder Kompetenz-Modus des Lebensbezugs → geführt | in dem Heft, das die Kompetenz trägt — sonst Lücke |
| A6 | jede SK des Themas → A, B oder KN | sonst im Bauplan als Lücke genannt |
| A7 | jede SK eines Hefts → Stelle im Heft | ein `sk_anker` mit der Stelle |
| A8 | Produkttyp A ≠ B; jedes Produkt des Auftrags ≠ A, ≠ B | verschieden in der Form |
| A9 | Lebensbereiche A, B, Auftrag, KN paarweise verschieden | sechs Paare |
| A10 | KN-Kriterien: je Heft 1 SuK + 1 Ges, zusammen alle vier; Auftrag alle vier | A ∪ B = alle; Auftrag = alle |
| A11 | Pol-Typ A ≠ B je Spur; Medien-Typen nur mit Medien | `lehrmittel_quelle`, `quelle_quelle` nur in `mit_medien` |
| A12 | je Heft mindestens eine Spur; nur Medien-Spur → Quelle und Ersatzquelle vorhanden | Karte **und** Archivtext für beide |
| A13 | Fall-Begriffe: kein Treffer in §4, §6, §7 | Situationen, Produkte, Quellen-Ausschnitte; Bauplan §5 selbst ist ausgenommen |
| A14 | Vergleich mit 1.3.1: Modi des Auftrags, Produkttypen, SK nicht alle gleich (`modi_kn` zählt nicht) | sonst Herleitung nachprüfen (Abschnitt 4) |

Hart sind A8–A13: Scheitert eine davon, wird der Entscheid geändert, bevor
gestoppt wird.

## 4. Der Vergleich mit der Gold-Einheit (Phase 9, im Bericht)

Zwei Tabellen, Gold links, die neue Einheit rechts:

1. **Fest (F1–F13):** je Zeile «gleich» mit dem Beleg (Feld, Skript, Zahl).
   Eine Abweichung ist ein Fehler der Skill. Dazu gehört `modi_kn` (F10): Die
   drei KN-Formen sind fest, also auch ihre Modi — **Gleichheit mit Gold ist
   hier kein Befund.**
2. **Hergeleitet (H1–H9):** je Zeile beide Werte nebeneinander und ein Satz
   zur Herleitung. Gleichheit ist hier kein Ziel: Stimmen Modi des Auftrags,
   Produkttypen **und** SK mit Gold überein, obwohl Thema und Kompetenz andere
   sind, ist das ein Hinweis, dass kopiert statt hergeleitet wurde — dann die
   Herleitung nachprüfen.

Zum Vergleich die Werte der Gold-Einheit (nur als Messlatte, nie als Vorlage;
diese Kurzliste ist die einzige Vergleichsgrundlage — die Gold-Dateien werden
dafür nicht gelesen):
Modi A = Rezeption schriftlich und bildlich; Modi B = dasselbe + Interaktion
und Kollaboration mündlich; Auftrag = Produktion mündlich + Produktion
schriftlich und bildlich; SK A = 5, 11, 1; SK B = 2, 6, 11; KN = 5, 11, 6;
Produkt A = kommentierte Karte (Listenbild); Produkt B = Tabelle mit Regeln +
Gespräch (Tabellenbild); Auftrag = Blatt (Fläche) + Sprachnachricht (Spur).

## 5. Wo der Renderer die Herleitung einengt

Zwei Stellen sind verallgemeinert und datengesteuert (ENTSCHEIDE E25, E26):
die Seiten A2/A3 des Auftragsbogens über `gemeinsamer_auftrag.produkte` und
das Produktbild über die Blockarten Liste, Tabelle, Fliesstext, Wechselrede.

Stösst eine Einheit an eine **andere** feste Stelle (vier Leitfragen, vier
Äste, vier Methodenkarten, acht Seiten, Word-Höhen), wird der Inhalt in das
Gerüst geschnitten (Teil 1). Lässt er sich nicht hineinschneiden, ohne die
Kompetenz zu verfehlen: nicht verbiegen, sondern als Befund in den Bericht —
den Renderer ändert die Skill nie.
