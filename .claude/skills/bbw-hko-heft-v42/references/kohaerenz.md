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
| F10 | KN: eine Hybrid-Situation, drei Formen, ein Raster mit vier Kriterien | Schlüsselmenge von `kn.json` |
| F11 | Lösung zu jedem Feld, mit Fundstelle | `regelLoesungen`, `check-lf-loesung` |
| F12 | Benennung, IDs, Kurzlink, Quellen-IDs | `references/ableitungsregeln.md` |
| F13 | Sprache und Anrede; neutrale Persona; ein Akzent | `references/sprache.md` |

Diese dreizehn Zeilen werden **nie** an eine Einheit angepasst. Passt ein
Inhalt nicht hinein, ist der Inhalt falsch geschnitten — nicht das Gerüst.

## 2. Hergeleitet — je Einheit aus Lehrplan und Prinzip

| # | Was | Woraus | Wo es landet |
|---|---|---|---|
| H1 | **Sprachmodi je Heft** | Modi der Kompetenz(en) des Hefts im nRLP-Datensatz (Kompetenz-Ebene); davon die, die das Heft wirklich übt | `nrlp.sprachmodi` = `prinzip.modi_pro_heft[L]`; bestimmt die zulässigen Spuren |
| H2 | **Sprachmodi des KN** | die drei KN-Formen | `prinzip.modi_kn`, `kn.kn_typen[].sprachmodi` |
| H3 | **Sprachmodi des Auftrags** | `modi_kn − (A ∪ B)`, Leitfaden §7.2 mit beiden Sonderfällen | `prinzip.modi_auftrag`, `gemeinsamer_auftrag.sprachmodi`, `produkte[].modus` |
| H4 | **Schlüsselkompetenzen** | SK des nRLP-Themas mit ihrer Iteration; je Heft drei, KN-Schnittmenge drei | `nrlp.sk`, `sk_anker`, `prinzip.sk_pro_situation`, `sk_schnittmenge_kn`, `kn_typen[].sk` |
| H5 | **Handlungsprodukt je Heft**: Typ und Format | Produktions- oder Interaktionsmodus des Hefts und die Verben der Kompetenz | `handlungsprodukt.*`, Schritte, Abgaben, Checkliste, Beispiel- und Lösungsbild (Blockart) |
| H6 | **Produkte des Auftrags** und ihre Form auf dem Bogen | H3 | `gemeinsamer_auftrag.schritte`, `abgaben`, `produkte` (Form `flaeche` oder `spur`), `sozialform` |
| H7 | Typ der Quelle, Spalten des Rasters | Rezeptionsmodus des Hefts | Quellenkarte `typ`, `raster.spalten` |
| H8 | Pol-Typ von LF4 je Heft und Spur | die Spannung des Hefts und was als zweiter Pol verfügbar ist | `pol_typ`, `prinzip.pol_typ_verteilung` |
| H9 | Aspekte, dominanter Aspekt, Name des zweiten Ges-Kriteriums | nRLP-Datensatz | `prinzip.aspekte`, `kn.dominanter_aspekt`, `rubrik_shared` |
| H10 | Fall, Zahlen, Lebensbereiche, Methodenkarten, Glossar | Lehrmittelkapitel, Bauplan | überall |

**Regel:** Kein Wert der rechten Spalte wird aus der Gold-Einheit oder aus
einem Skelett übernommen. Jede Phase, die einen dieser Werte schreibt, nennt
im Bauplan bzw. im Bericht die Herleitung in einem Satz.

## 3. Abdeckungstabelle (im Bauplan §8, vor dem Stopp; im Bericht am Schluss)

Jede Zeile muss sich füllen lassen. Eine leere Zelle ist ein Befund, kein
Schönheitsfehler.

| Prüfung | Soll |
|---|---|
| Jeder Modus aus `modi_kn` | steht in Heft A, Heft B oder im Auftrag — mit der Stelle, an der er geübt wird |
| Jeder Modus des Auftrags | ist `modus` mindestens eines Eintrags in `produkte` (bei nur einem Modus tragen ihn beide) |
| Jeder Modus eines Hefts | hat eine benannte Stelle im Heft (Rezeption: S. 3; Produktion/Interaktion: Produkt) |
| Jede SK des Themas, die für das Lehrjahr gilt | steht in A, B oder im KN — sonst im Bauplan als Lücke genannt |
| Jede SK eines Hefts | hat einen `sk_anker` mit der Stelle |
| Produkttyp A, Produkttyp B, Produkte des Auftrags | paarweise verschieden in der Form |
| Lebensbereich A, B, Auftrag, KN | paarweise verschieden |
| Alle vier KN-Kriterien | A ∪ B = alle; Auftrag = alle |

## 4. Der Vergleich mit der Gold-Einheit (Phase 9, im Bericht)

Zwei Tabellen, Gold links, die neue Einheit rechts:

1. **Fest (F1–F13):** je Zeile «gleich» mit dem Beleg (Feld, Skript, Zahl).
   Eine Abweichung ist ein Fehler der Skill.
2. **Hergeleitet (H1–H10):** je Zeile beide Werte nebeneinander und ein Satz
   zur Herleitung. Gleichheit ist hier kein Ziel: Stimmen Modi des Auftrags,
   Produkttypen **und** SK mit Gold überein, obwohl Thema und Kompetenz andere
   sind, ist das ein Hinweis, dass kopiert statt hergeleitet wurde — dann die
   Herleitung nachprüfen.

Zum Vergleich die Werte der Gold-Einheit (nur als Messlatte, nie als Vorlage):
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
