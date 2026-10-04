# Bericht — 3.1.1_konsum_verantworten_3j (Anpassung von 1.3.1, bbw-hko-heft-v42)

Lauf vom 2026-10-04, lokal, Branch `v42-skill`, aus dem Prompt
`docs/cloud-run/prompts/anpassung-3.1.1-lokal.md`. Plan:
`docs/cloud-run/bauplaene/3.1.1_konsum_verantworten_3j.md`, freigegeben am
2026-10-04. Die Einheit ist eine **Anpassung** der Gold-Einheit
`1.3.1_konsum_verantworten_v42` (EFZ 4J, Lebensbezug 1.3) an EFZ 3J,
Lebensbezug 3.1 — keine Neuerzeugung. Kein Lehrmittel-, Transkript- oder
Artikeltext in dieser Datei.

**Ergebnis: grün.**

## 1. Einheit

| | |
|---|---|
| Ordner | `src/data/einheiten/3.1.1_konsum_verantworten_3j/` (sechs Dateien) |
| Lehrgang | EFZ_3J, Thema T3, Lebensbezug 3.1; kein `set.lehrgaenge` |
| Heft A | 3.1.1 · «Marke oder echtes Bedürfnis?» · **nur Spur mit Medien** · Quelle `q-311a-pflicht` (Video, 00:00–03:15), Ersatz `q-311a-pflicht-ersatz` |
| Heft B | 3.1.2 + 3.1.3 · «Am 20. ist das Konto leer» · **nur Spur mit Medien** · Quelle `q-311b-pflicht` (Video, 01:32–05:03), Ersatz `q-311b-pflicht-ersatz` |
| Vertiefungen | die vier Gold-Karten `q-131a-vertiefung-1/-2`, `q-131b-vertiefung-1/-2`, unverändert gelesen |
| Auftrag, KN | wie Gold (nur IDs, Lehrgang, Nummern, SK) |
| Status | `entwurf` |
| Quellenkarten | vier neue `q-311*` — in Phase Q angelegt, in diesem Lauf nicht verändert, mit diesem Commit erstmals eingecheckt |

Soll war die Änderungsliste §6 des Plans, Ist ist der Diff gegen Gold:
6 Dateien, 281 Zeilen dazu, 637 weg (der grösste Teil ist die entfernte Spur
`ohne_medien` in beiden Heften). Gold selbst ist unverändert
(`git status` auf dem Gold-Ordner: leer; `check-all` auf Gold: grün).

Ablauf nach §11: Gold kopiert → Ordnername ersetzt (18 Treffer: A 2 · B 2 ·
Prinzip 1 · KN 5 · Set 7 · Begleiter 1; danach 0) → Teil M (Prinzip, KN, A, B,
Set) → Teil S (Spuren, Modi, LF3 an den Archivtexten, Glossar) → Begleiter
(§6.6) → Marker-Skript → Tor → Gegenleser → Tor neu.

## 2. Tor (letzte Ausgaben, nach der letzten Änderung)

```
build:einheiten-index      einheiten.index.json: 22 sets written (src + public/nrlp)
begleiter-marker --check   223 Marker · 0 abweichend · 0 unaufloesbar · nichts geschrieben
check-all 3.1.1_konsum_verantworten_3j
  ok  Lehrmittel  150 Kapitel und 279 Quellentexte fuer die Leck-Pruefung geladen
  ok  Struktur · Status · Methoden · Sprache · Leck  0 Fehler, 0 Warnungen
  ok  nRLP-Abgleich (Kompetenz-/Lebensbezugstexte, Lehrgaenge)
  ok  Kopplung · Autarkie · Begleiter-Marker
  ok  Leitfragen-Loesungen
  ok  Heft v4.x (Budgets, Spuren, Quellen)
  GRUEN — keine Fehler.
export-v42                 Exit 0 — 11 Dateien (2 Hefte, 2 Lösungen, Auftragsbogen je HTML + DOCX, begleiter.docx)
messen-v42                 Exit 0 — 30 Seiten ok, kein Überlauf
bestand-v42 --pruefen      OK — 26 Dokumente unverändert.
check-all 1.3.1_konsum_verantworten_v42 2.3.1_anliegen_vertreten 2.1.1_informationen_hinterfragen
                           GRUEN — keine Fehler.   (Gold bleibt grün)
npm run build              Exit 0 — [build] Complete!
```

Messung im Einzelnen (Reserve in px): Heft A S. 1–8: 0 · 18.9 · 17 · 18.9 ·
64 · 0 · 0 · 31.8 — Heft B: 0 · 18.9 · 17 · 18.9 · 62.9 · 0 · 0 · 6.5 —
Auftragsbogen: 36.3 · 0 · 0 · 86.8 — Lösungen A und B je fünf Seiten, Reserve
überall über 150 px. Die im Plan genannten Risiken (Kopfzeile mit längerem
`modul_titel`, S. 3 mit neuem Raster, S. 6 Heft B mit anderer Rezeptionskarte)
halten ohne Überlauf.

## 3. Abweichungen vom Plan

Kein Entscheid des Plans ist geändert. Abgewichen ist der Lauf an diesen
Stellen, jeweils mit Grund:

| # | Stelle | Plan | Ist | Grund |
|---|---|---|---|---|
| 1 | Heft A, LF3 `text` und `quellen[0].auftrag` | «bei Jugendlichen» bleibt; streichen, wenn das Gegenlesen stört (A23) | die zwei Wörter sind in Leitfrage **und** Auftrag gestrichen | Gegenleser A, Stelle 1: Die Quelle spricht von der jüngeren Generation und zeigt ausdrücklich auch Ältere. Der Plan sieht genau diesen Rückweg vor |
| 2 | Beide Hefte, `quellen[0].auftrag` | «… einen Begriff aus LF1 zu» | «… einen Begriff aus LF1 oder dem Glossar zu» | Gegenleser A, Stelle 3: Die Begriffe der Lösung (Konsumdruck, Werbung, Impulskauf, Saldo, Mahnung) stehen im Glossar, nicht alle in LF1. Wortlaut nach `phase-5-spuren.md` §8 |
| 3 | Beide Hefte, `bewertungsraster[1]` | bleibt (A35, B38) | «Jede Zeile hat einen Begriff (LF1 oder Glossar)» | Folge von Nr. 2 — Gegenleser B meldete den Widerspruch S. 3 gegen S. 8. Wortlaut der Skill (`phase-5-spuren.md` §8) |
| 4 | Heft B, `quellen[0].auftrag` | «… in Schulden geraten und was daraus folgt» | ohne «und was daraus folgt» | Budget 220 Zeichen nach Nr. 2 (234) |
| 5 | Heft A, Raster Zeile 2 (A28) | Kernaussage «Knappes Angebot macht begehrt» | «Grosser Andrang beim Verkaufsstart», Beleg nur die Schlange | Lösungs-Audit A: Die Quelle zeigt Andrang und eine Höchstmenge je Person, sagt aber nicht, dass Knappheit begehrt macht |
| 6 | Heft A und B, `loesung.befund` (A30, B33) | «Laut Quelle entstehen Kaufwünsche, weil …» / «Die Quelle nennt … als Wege» | Befund trennt, was die Quelle zeigt, von dem, was die Lernenden daraus schliessen | Audits A und B: Deutung war nicht als Deutung erkennbar |
| 7 | Heft B, Raster Zeile 2 (B31) | «Mit 18 kommen die ersten Betreibungen» → Mahnung | «Mit 18 kommt erste Post vom Betreibungsamt» → «Mahnung (Stufe davor)» | Audit B: Post vom Betreibungsamt ist keine Mahnung; der Begriff des Plans bleibt, aber als Vorstufe gekennzeichnet |
| 8 | Heft B, Raster Zeilen 3 und 4, Zeilen «Erwartet» und «Mit Ersatzquelle» | Stichworte des Plans | näher an der Quelle (ohne «ungeöffnet», «Eltern helfen nicht mehr», «nur temporär gearbeitet», «Briefe nicht mehr angesehen») | Audit B, Befunde 3, 4, 5, 9, 10, 11 |
| 9 | Heft A, LF4 `beispiel_pol_2` (A31) | «… solche Videos …, wie sie die Quelle zeigt» | «… Videos, die Lust auf Neues machen, ähnlich wie die Auspack-Videos in der Quelle» | Audit A: Die Quelle zeigt keine Videos zu Handys |
| 10 | Heft A, Zeile «Hinweis», Feld `quelle` | — | Fundstellen 00:08 und 01:32 | Audit A: «nicht nur Jugendliche» belegt 01:32, nicht 03:09 |
| 11 | `set.glossar` | Heft B, Spur mit Medien: nur «Überschuldung» (S15) | dazu «Lohnpfändung» (Herkunft Quelle, 01:55; Sache belegt in Kap. 8.2, S. 201) | Gegenleser B, Stelle 3: Das Wort fällt im Ausschnitt und ist einer der zwei eigenen Knoten (B25). Budget «je Heft und Spur ≤ 2» eingehalten; 24 Einträge statt 23 |
| 12 | `set.glossar`, «Blind-Box» (S14) | Definition «Schachtel, bei der man beim Kauf nicht weiss, welche Figur drin ist» | «Verpackung, deren genauen Inhalt man erst nach dem Kauf sieht.» | der Vorschlag lag zu nahe am Wortlaut der Untertitel |
| 13 | `begleiter.md`, Präambel | nicht in §6.6 | «beide nur mit Medien», «ein Dokument Lösungen», ohne «Denkhilfe», ohne «pro Spur» | sonst sachlich falsch für diese Einheit |
| 14 | `begleiter.md` §0 Bewertung, ein Halbsatz | «bleibt» (Nr. 33) | «… und sind in beiden Spuren identisch» gestrichen | es gibt nur eine Spur |
| 15 | `begleiter.md` §1 Seitenplan | nur Spalte «Spur-abhängig» (Nr. 8) | zusätzlich Zeile S. 3 «Video zweimal ansehen, …», der Satz zu den zehn Leseminuten nennt das Video, «in beiden Spuren» im Satz zur Seitenfolge gestrichen | «lesen» stimmt für ein Video nicht |
| 16 | `begleiter.md` §2 Tabelle «Die Spuren in dieser Einheit» | Zellen der Spur ohne Medien «entfällt» (Nr. 10) | auch die Zeile «LF4, Pol-Typ ohne Medien» ist «entfällt»; Kasten S. 4 nur «Vertiefung (2 Karten)» | gleiche Regel, zwei Zeilen mehr |
| 17 | `begleiter.md` §3 Stolperstein 1 (Nr. 21) | «Die Quelle belegt Trend, Vorbilder, Knappheit und Videos» | vier Beobachtungen der Quelle, der Schluss auf Kaufwünsche ist als Schluss der Lernenden benannt | folgt aus Nr. 5 und 6 |
| 18 | `begleiter.md` §5 (Nr. 30) | «Alle vier: geprüft an den Untertiteln» | «Die vier Videos der Quellen und Ersatzquellen …» | Sweep: Vertiefung A2 ist ein fünftes Video und nicht gemeint |
| 19 | Gegenleser | Plan §11 Nr. 7 nennt zusätzlich je Heft Profil b | nach dem Aufruf: je Heft Profil a, je Heft ein Lösungs-Audit, ein Sweep; dazu eine zweite Runde über die geänderten Seiten | der Aufruf nennt die Besetzung ausdrücklich; Profil b (Sprachlast, B1) ist **nicht** gelaufen |

Wie im Plan vorgesehen und darum keine Abweichung: `gemeinsamer_auftrag.produkte`
fehlt wie in Gold; `nrlp.kompetenzen` steht in Heft B auf der Platte (B15, B16;
zwei Marker des Begleiters zeigen darauf).

Zeichenzählung der neu geschriebenen Texte: Lösungszeilen LF3 zusammen A 873,
B 894 (Grenze 900); Aufträge über dem Raster ≤ 220; Strategien ≤ 90;
Satzanfänge ≤ 60; Spaltenköpfe 9 · 11 · 16 · 9; Rasterzellen der Lösung
höchstens 47 (A) und 45 (B) Zeichen.

## 4. Prüftabelle §11 — Risiko «beide Hefte nur mit Medien»

| Stelle | Ergebnis | Wie geprüft |
|---|---|---|
| Arbeitsansicht `/einheiten/3.1.1_konsum_verantworten_3j` | **nicht im Browser gesehen.** Die angemeldete Sitzung am laufenden Dev-Server ist kein KT1-Konto; die Entwurf-Einheit leitet auf `/einheiten` um. Am Code: `loadEinheit` löst nur die Variante `mit_medien` auf (`spur_varianten` hat einen Schlüssel, die wirksame Spur ist die erste vorhandene); der Schalter liest `spuren_verfuegbar` je Heft (E28 Nr. 3). Ob er für **beide** Hefte «nur mit Medien» zeigt, muss ein Mensch mit KT1-Login ansehen | Dev-Server (Umleitung), `src/lib/einheiten/index.ts`, `EinheitWorkbench.tsx` |
| Export (`export-v42.mjs`) | je Heft genau `heft-<a\|b>-mit-medien` und `loesungen-<a\|b>-mit-medien` (HTML + DOCX), dazu Auftragsbogen und `begleiter.docx`; kein leeres, kein doppeltes Dokument. ZIP der Arbeitsansicht: nicht gesehen (siehe oben) | Export ausgeführt, Dateiliste |
| Dokument «Lösungen» | der feste Text «in beiden Spuren» steht im Renderer; der Begleiter stellt es je Heft in einem Satz vor «Tafelbild» klar (§6.6 Nr. 22, 29). Lösungen A und B je fünf Seiten ohne Überlauf | Export, Messung |
| QR-Seite `/m/3.1.1_konsum_verantworten_3j` | Anker `#a` und `#b` vorhanden. Sieben eingebettete Player; Startzeiten in der Einbett-Adresse: Quelle A ohne Startzeit (00:00), Ersatz A 59 s (00:59), Quelle B 92 s (01:32), Ersatz B 150 s (02:30); Vertiefungen A1 (ohne), A2 35 s, B1 4 s; B2 ist ein Link. Titel der Seite «Quellen · Konsum verantworten (EFZ 3J)». Ob die Player wirklich an der Zeitmarke **abspielen**, ist nicht geprüft (nur die Adresse) | Dev-Server `localhost:4321`, Seitentext und iframe-Adressen |
| Präsentation | **nicht im Browser gesehen** (KT1-Login). Am Code: `deck.astro` baut die Fassung der Spur, in der `loadEinheit` aufgelöst hat — hier `mit_medien`; `?spur=ohne_medien` fällt auf die vorhandene Spur zurück. Eine Folie zur fehlenden Spur ist im Code nicht angelegt | `src/pages/einheiten/[setKey]/deck.astro`, `index.ts` |
| Werkstatt | **nicht im Browser gesehen.** Am Code: Der Auftrag «Weiteres Heft C» **blockiert nicht** (`v42HeftC.blockiert` prüft Hefte, Anker, Zentrum, Rubrik — nicht die Spur). Der Vertrag entsteht ohne das Muster der Spur ohne Medien (`musterOhneMedien` ist leer, der Block entfällt), verlangt aber weiter ein Heft in dieser Spur. Das ist kein falscher, aber ein dünnerer Vertrag — gemeldet, nicht repariert | `src/lib/werkstatt/auftraege.ts`, `kontext.ts` |
| Katalog und Index | Indexeintrag: `status` entwurf, `lehrgang` EFZ_3J, `lehrgaenge` [EFZ_3J], Thema 3, `modul` 3.1, `sprachmodi` [Rezeption audiovisuell], `sk` [1, 3, 5, 9], `hat_medien` wahr, `hat_spuren` wahr. Drei Einträge «Konsum verantworten», «… (v4.2)», «… (EFZ 3J)». Beide Index-Kopien gleich. Katalogkarten für KT1: nicht gesehen | `src/data/einheiten.index.json`, `public/nrlp/einheiten.index.json` |
| `messen-v42` | S. 3 beider Hefte Reserve 17 px; S. 6 Heft B Reserve 0 px, kein Überlauf; Kopfzeile (S. 1) Reserve 0 px, kein Überlauf | Messung |

## 5. Gegenleser

Einzeln nacheinander, Modell Sonnet, nur lesend. Jeder Befund ist am Dokument
bzw. am Archivtext nachgeprüft. Kürzel: E Fehler dieser Einheit · S Skill /
Gold-Vorlage · R Renderer · Q Quelle · V so gewollt.

| Gegenleser | Runde | Befunde | Übernommen | Nicht übernommen |
|---|---|---|---|---|
| Lernende/r a, Heft A | 1 | 3 Hauptstellen + 3 kleine | 2 (E): «bei Jugendlichen»; «Begriff aus LF1» gegen Glossar → Abweichungen 1, 2 | Wortlaut der KN-Kriterien nennt Begriffe ausserhalb des Hefts (V, E8; der Begleiter erklärt es) · Beispielbild S. 6: «Doppelsymbol», Massstab «nach einem Monat» (S, Gold-Kern, nicht angefasst) · «Das geben Sie ab» nennt Befund und Begriffsnetz nicht (S, Gold-Kern) |
| Lernende/r a, Heft B | 1 | 3 | 2 (E): Checkliste S. 8 gegen Auftrag S. 3 → Abweichung 3; «Lohnpfändung» fehlt im Glossar → Abweichung 11 | S. 2 «geschätzte genügen» gegen S. 6 «nur realistische, eigene Zahlen» (S, Gold-Kern und Methodenkarte) · «Betreibungsamt», «Existenzminimum» nicht im Glossar (Budget zwei Spur-Begriffe; Q) · das Video zeigt keinen Kauf auf Rechnung (Q; der Übertrag ins eigene Budget ist die Aufgabe von LF3) |
| Lösungs-Audit A | 1 | 8 | 7 (E) → Abweichungen 5, 6, 9, 10; dazu «Marketingstrategie» statt «Verkaufsstrategie», Zeitmarke 02:26 beim Beleg der vierten Rasterzeile | 1: Zuordnung Prominente → Werbung, Box → Impulskauf ist Deutung — steht in der Zeile «Begriffe» so (V) |
| Lösungs-Audit B | 1 | 12 | 10 (E) → Abweichungen 6, 7, 8; dazu «zweite Frau» bei 04:55–05:01 | Saldo und Schuldenspirale als Begriffe sind weit gefasst — in der Zeile «Begriffe» als Deutung gekennzeichnet (V); Begriffsnetz «Mahnung → Schuldenspirale» ist Fallüberlegung (S, Gold-Kern) |
| Sweep | 1 | 9 | 1 (E) → Abweichung 18 | `prinzip.modi_auftrag_herleitung` nennt «EFZ 4J» (V, Wortlaut des Plans P17) · `set.spur: "wahl"` (V, Konstante) · `lernfortschritt.scaffold_90` des Kerns nennt eine Beispielzeile im Raster (S, Gold-Kern; beim Laden überschreibt ihn `spuren.mit_medien.scaffold_90`) · feste Überschriften «beide Spuren», «Spur-abhängig» im Begleiter (V, Code-Anker bzw. feste H3) · Auftragsbogen nennt die Lehrperson in einer Abgabe; «Stufe» statt «Punkte» an mehreren Stellen des Begleiters; Vertiefung B1 im Begleiter nennt «Berichte von Betroffenen», das Heft nicht (alle drei S, unverändert aus Gold) · «zwei Frauen … mit 18»: nach Nachprüfung am Archivtext richtig (04:26), fällt weg |
| Lernende/r a, Runde 2 (S. 1, 2, 3, 8 beider Hefte) | 2 | 6 Stellen | 0 — kein neuer Fehler der Einheit | Begriff je Rasterzeile bleibt eine Deutung, «Werbung» passt auf Videos von Privaten nur lose; Teile des Videos A handeln vom Verkauf, nicht vom Wunsch; Lohnpfändung ist Folge, nicht Grund (alle Q — Zugeständnisse aus §7 des Plans) · die zwei leeren Knoten des Begriffsnetzes lassen sich nur mit Trend / Blind-Box bzw. Überschuldung / Lohnpfändung füllen (V, so angelegt) · «gemäss QR-Seite» und Zeitmarken «wie im Player» (V) · Link trägt 3.1.1, Heft B behandelt 3.1.2/3.1.3 (V, Ordnerregel) |

Zuletzt gelesen in Runde 2; sie hat keinen sichtbaren Text mehr geändert.
Runden: zwei von höchstens drei. Zeitschätzung der Lernenden: Heft A rund
128 Minuten ohne Vertiefung (Seitenplan 135), S. 3 je Heft 20–25 Minuten
(Seitenplan 25).

**Was kein Gegenleser prüfen konnte:** Bild und Ton der vier Videos, die
Zeitmarken im Player, das Seitenbild (dafür `messen-v42`), die Arbeitsansicht.

## 6. Fehler und Auffälligkeiten ausserhalb der Einheit (nicht repariert)

- **Gold-Kern, an die neue Einheit vererbt** (Kern «bleibt» laut Plan): Kriterien-Wortlaut mit Begriffen ausserhalb des Hefts; Beispielbild Heft A; S. 2 gegen S. 6 in Heft B (geschätzte gegen echte Zahlen); `lernfortschritt.scaffold_90` mit Beispielzeile; Abgabe des Auftrags «direkt an die Lehrperson»; «Stufe» im Begleiter. Gilt gleich für `1.3.1_konsum_verantworten_v42`.
- **Quellenkarte `q-311b-pflicht`, Kurzbeschrieb:** Er nennt auf der QR-Seite bereits drei der gesuchten Gründe und das Wort «ungeöffnete Post», das die Untertitel so nicht hergeben. Karte nicht geändert (Zaun); vor dem Druck kürzen.
- **Auftrag auf der QR-Seite:** Die Seite druckt `quellen[0].auftrag` — dort steht dann «gemäss QR-Seite» auf der QR-Seite selbst (wie in Gold).
- **Werkstatt, «Weiteres Heft C»:** siehe §4.
- **Skill:** Die Tabelle der Rasterspalten (`phase-5-spuren.md` §4) kennt für Video «Bild · Ton · Aussage»; der Plan setzt «Zeitmarke · Kernaussage · Beleg / Beispiel». Der Plan gilt; die Skill kennt diese Form nicht. Die sechs Wörter aus E24 stehen in der Skill weiter als gesperrt (E30 geht vor).
- **Crosswalk:** Zeile 3J 3.1 nennt Kap. 2.7, 2.4, 8.1 und 1.5 nicht (Plan §2) — nicht nachgeführt.
- **Arbeitsbaum:** Die Vorbedingung «keine andere Session erzeugt gerade eine Einheit» war nicht erfüllt. Während des Laufs hat eine andere Session `3.2.1_konsumfolgen_beurteilen` eingecheckt, `3.3.1_kaufvertrag_beurteilen` angelegt und Dateien unter `src/components`, `src/lib`, `src/pages` und `.gitignore` geändert. Dieser Lauf hat davon nichts angefasst. Folgen: Der Index zählt 22 Einheiten und enthält auch 3.3.1; der Build und die Messung liefen gegen den Renderer-Stand jener Session. Der Commit dieses Laufs nimmt in den Index nur den Eintrag von 3.1.1 auf (der Eintrag von 3.3.1 bleibt im Arbeitsbaum und gehört zum Commit jener Einheit).

## 7. Vor dem Druck gegensehen

1. **Die vier Videos einmal ganz ansehen** (Quelle A, Ersatz A, Quelle B, Ersatz B). Geprüft sind nur die Untertitel. Offen: Sprache des Tons (Quelle A und Ersatz A können aus der Westschweiz übernommen sein, Quelle B und Ersatz B Mundart enthalten), ob das Bild trägt, was die Untertitel nicht sagen, und ob die Zeitmarken im Player stimmen.
2. **Ersatz B:** Zeitmarken stammen aus der YouTube-Fassung; am SRF-Player gegenprüfen (Plan §9).
3. **Player stoppt nicht bei `bis`:** In Heft B folgt nach 05:03 eine Stelle nahe am KN-Fall (von Pietro hingenommen); Lehrperson sagt den Schluss an — steht im Begleiter.
4. **Arbeitsansicht, Präsentation, Werkstatt, Katalogkarte** mit KT1-Login ansehen (§4): Spur-Schalter für beide Hefte, ZIP ohne leeres Dokument, Präsentation ohne Folie zur fehlenden Spur.
5. **Vertiefung A1** ist weiter nicht gegengehört (wie Gold).
6. **Profil b** (Deutsch als Zweitsprache) hat die neuen Seiten nicht gelesen. Die Videos bringen Wörter mit, die das Glossar nicht erklärt (Betreibungsamt, Existenzminimum, Blind-Box-Prinzip im Ton).
7. **Kurzbeschrieb der Karte `q-311b-pflicht`** (§6).
8. Die Fachprüfung der Lehrmittelseiten ist die von Gold und nicht wiederholt (Plan §2).

## 8. Commit

Ein Commit nach grünem Tor: «Einheit 3.1.1_konsum_verantworten_3j (Anpassung
von 1.3.1, bbw-hko-heft-v42)» — Ordner der Einheit, die vier Karten `q-311*`,
der Indexeintrag in beiden Kopien, dieser Bericht. Kein Push, kein Deploy, kein
Merge, kein Branchwechsel.
