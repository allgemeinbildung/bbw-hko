# Bericht — 4.3.1_vielfalt_untersuchen (bbw-hko-heft-v42, Abschluss eines abgebrochenen Laufs, lokal)

Lauf vom 2026-10-06 nach dem Prompt `docs/cloud-run/prompts/sofort/1b-abschluss-4.3.1.md`.
Bauplan: `docs/cloud-run/bauplaene/4.3.1_vielfalt_untersuchen.md` (freigegeben am
2026-10-04). Ergebnis: **grün**, Status `entwurf`, kein Push. Die Freigabe wartet
auf Pietros «ok» (Abschnitt 8).

Ausgangslage: Der Lauf vom 05.10.2026 war nach `set.json` abgebrochen. Fünf Dateien
lagen uncommittet vor, `begleiter.md` fehlte, `check-all` war deshalb rot. Es gab
weder Bericht noch Gegenlesen noch Messung.

## 1. Einheit

| | |
|---|---|
| Ordner | `src/data/einheiten/4.3.1_vielfalt_untersuchen/` (sechs Dateien) |
| Lehrgang | EFZ_3J kanonisch, `lehrgaenge` EFZ_3J und EFZ_4J (Lebensbezug 4.3 in beiden Datensätzen nummern- und textgleich; `sync-einheiten-nrlp` ohne Meldung) · 2. Lehrjahr |
| Heft A | 4.3.1 · «Unser Team im Porträt – was frage ich, was lasse ich?» · Interview mit Leitfaden, Stichwortnotizen und Fazit · Spuren `ohne_medien`, `mit_medien` |
| Heft B | 4.3.2 · «Wer kommt, wer bleibt? Mein Leserbrief zur Zuwanderung» · Leserbrief (120–150 Wörter) mit zwei Belegen und Forderung · Spuren `ohne_medien`, `mit_medien` |
| Auftrag | «Die Cousine geht nach Kanada – was sage ich am Tisch?» · Kurzrede (2 Minuten) und Antwort auf den stärksten Einwand (1 Minute), beide `spur` · Lebensbereich Familie |
| KN | «Ein starker Mitspieler ohne sicheren Aufenthalt» · Verein und Freizeit |
| Status | `"entwurf"` |
| Neue Methodenkarten | keine |
| Quellenkarten | `q-431a-*` (4), `q-431b-*` (4) — aus Phase Q vom 04.10.; in diesem Lauf vier Kurzbeschriebe und eine Wortzahl berichtigt (Abschnitt 6) |

## 2. Tor (letzte Ausgaben, nach der letzten Änderung)

| Befehl | Ergebnis |
|---|---|
| `npm run build:einheiten-index` | 27 Sets geschrieben (beide Kopien) |
| `begleiter-marker.mjs --check` | 277 Marker · 0 abweichend · 0 unauflösbar |
| `node scripts/check-all.mjs 4.3.1_vielfalt_untersuchen` | **GRUEN — keine Fehler** (`check-all.txt`) |
| `export-v42` + `messen-v42` | Exit 0, 56 Seiten, kein Überlauf (`messung.txt`): je Heft und Spur 8, Auftragsbogen 4, je Dokument «Lösungen» 5 |
| `bestand-v42 --pruefen` | OK — 26 Dokumente unverändert |
| `npm run build` | Exit 0 |
| `git status` | neu: Ordner der Einheit, acht Karten `q-431*`, Bauplan, dieser Laufordner; geändert: die zwei Index-Dateien |

Reserve 0 px haben, wie in den anderen Einheiten, die Seiten 1, 6 und 7 der Hefte
und A3 des Bogens; Seite 8 von Heft A hat 4,2 px.

**Messung im Lauf:** Die erste Messung nach dem Begleiter zeigte fünf Überläufe
bei grünem `check-all`: Heft A S. 8 (9 px), Lösungen A mit Medien S. 3 (458 px),
Lösungen B mit Medien S. 3 (66 px), Lösungen B S. 4 beider Spuren (19 px). Ursache:
`erwartung` der Vertiefungen (bis 1623 Zeichen, Gold rund 300) und `hinweis` des
Lösungsbilds (2439 Zeichen, Gold 171) — beide ohne Skript-Budget. In den Daten
gekürzt; was die Lehrperson dadurch im Heft nicht mehr liest, steht im Begleiter.

Von Hand (phase-9 §3): kein «Spur», «Pflichtquelle», «Lektion», «Lehrperson» und
kein Fall-Begriff im sichtbaren Text der Hefte und des Bogens; «Minuten» und
«Woche» nur als Dauer eines Produkts bzw. Frist im Fall. Sechs markante
Lösungssätze in den Lernenden-Dokumenten gesucht: kein Treffer. Bauplan,
Fakten-Tabelle, Begleiter und dieser Bericht gegen Lehrmittel und die acht
Archivtexte geprüft (Wortfolgen ab zwölf Wörtern): kein Treffer.

## 3. Kapitel, Seiten, Quellen

Lehrmittel (alle Seiten am Text gelesen): Heft A — Kap. 3.4, S. 111–112; Kap. 12.1,
S. 292; Kap. 12.2, S. 299; über Karten Kap. 16.4, S. 372–373 und Kap. 17.2,
S. 381–382. Heft B — Kap. 3.4, S. 106–109, 111, 113–114; über Karten Kap. 17.3,
S. 394, 397. Auftrag — Kap. 3.4, S. 106, 109, 112; im Begleiter Kap. 16.2, S. 368.

| ID | Typ | Titel · Herausgeber · Datum | Ausschnitt | Länge | geprüft | Zugeständnis |
|---|---|---|---|---|---|---|
| `q-431a-pflicht` | Artikel | «Baselbieter Spital stoppt Projekt mit philippinischen Pflegenden» · SRF News · 15.10.2025 | Vorspann, Absätze 1–12 | 439 Wörter | 04.10. / URL und Absätze 06.10. | Bericht mit drei Sichten; Gewinn nur als Absicht und Einschätzung; nennt ein Herkunftsland; Bildergalerie zwischen Abs. 3 und 4; Audiobeitrag auf der Seite nicht geprüft |
| `q-431a-pflicht-ersatz` | Artikel | «Ergebnisse der Erhebung ‹Zusammenleben in der Schweiz 2024›» · Bundesamt für Statistik · 11.03.2025 | Absätze 1–5 | 260 Wörter | 04.10. / Zahlen 06.10. | Behördenmitteilung, keine Stimme aus einem Team; Seite zeigt den Text nur mit JavaScript |
| `q-431a-vertiefung-1` | Video | «Baustelle auf der Hardbrücke …» · SRF DOK · 19.12.2018 | 22:49–26:52 | 243 Sek. | 04.10. / Zeitmarken 06.10. | kein eigenes Segment; Film von 2018; **nur Untertitel gelesen** — siehe Abschnitt 8 |
| `q-431a-vertiefung-2` | Webseite | «Ein vielfältiges Team für ein vielfältiges Publikum» · SWI swissinfo.ch · 19.09.2022 | Absätze 1–3 | 189 Wörter | 04.10. / 06.10. | Selbstdarstellung eines Unternehmens (so gewählt) |
| `q-431b-pflicht` | Grafik | «Jahresstatistik Zuwanderung 2025: Einwanderung nach Grund» · Staatssekretariat für Migration · 02.2026 | S. 11, Darstellung 3.1 | 131 Wörter | 04.10. / PDF 06.10. | Balken 8119, Begleittext 8199; zählt nur die ständige ausländische Wohnbevölkerung; Publikationsmonat nicht bestätigt |
| `q-431b-pflicht-ersatz` | Grafik | dasselbe, Ausgabe 2024 · 02.2025 | S. 11, Darstellung 3.1 | 136 Wörter | 04.10. / PDF 06.10. | gleicher Herausgeber, gleiche Website, eigene Adresse |
| `q-431b-vertiefung-1` | Artikel | «Integration durch Pflegeausbildung im Berner Jura» · SRF News · 02.09.2025 | Vorspann, Absätze 1–11 | 485 Wörter | 04.10. / 06.10. | der Artikel nennt eine Person in einem offenen Verfahren mit Namen (Heft, Karte und Begleiter nicht); seit 02.09.2025 nicht aktualisiert |
| `q-431b-vertiefung-2` | Webseite | «Ausweis F (Vorläufig aufgenommene Ausländer)» · Staatssekretariat für Migration · 10.11.2025 | ein Absatz | 101 Wörter | 04.10. / 06.10. unverändert | juristische Sprache |

Alle acht Adressen am 06.10.2026 erreichbar (HTTP 200); der Sprung `#page=11`
trifft in beiden PDF.

## 4. Abdeckung (kohaerenz.md §3)

| # | Befund |
|---|---|
| A1 | `modi_kn`: Rezeption schriftlich und bildlich → A und B, S. 3 · Produktion mündlich → Auftrag (A2, A3) · Interaktion und Kollaboration mündlich → Heft A, Interview · Produktion schriftlich und bildlich → Heft B, Leserbrief |
| A2 | jeder geführte Modus hat seine Stelle (S. 3 bzw. Produkt) |
| A3 | freiwillig geübt: Rezeption audiovisuell (Vertiefung 1 von Heft A) |
| A4 | Produktion mündlich → beide Produkte des Auftrags |
| A5 | alle Kompetenz-Modi geführt. **Teil-Lücke ohne Medien** (Bauplan §8): statt Reportage ein Sachtext, statt Grafik die Tabelle S. 109 |
| A6 | SK 5, 7, 10, 11 (Thema T4 in 3J) alle in A, B oder KN. **Für 4J** bleiben SK 2, 3 und 6 ohne Platz (Bauplan §9) |
| A7 | A: 7 Produkt · 10 LF3 · 11 LF4 und Schritt 04 — B: 7 LF3 · 11 LF4 und Schritt 04 · 5 Produkt |
| A8 | Interview ≠ Leserbrief ≠ Kurzrede mit Antwort |
| A9 | Lehrbetrieb · Wohngemeinde · Familie · Verein und Freizeit |
| A10 | A: Fachkorrektheit + Identitätskonstrukt · B: Argumentation + Position / Werthaltung · Auftrag: alle vier; Wortlaut zeichengleich mit `kn.rubrik_shared` |
| A11 | A `position_gegenposition`, B `recht_praxis`, je in beiden Spuren |
| A12 | beide Hefte mit beiden Spuren; Karte und Archivtext für alle acht Slots |
| A13 | «Unihockey», «Spielerlizenz», «Meisterschaft»: kein Treffer ausserhalb von KN, Prinzip, `kontext_ausschluss`, `kn_aktivierung` und Begleiter Kap. 7 |
| A14 | siehe Abschnitt 5 |

## 5. Vergleich mit Gold (nur Kurzliste aus kohaerenz.md §4)

Fest (F1–F13): gleich — sechs Dateien, Template `heft_8page_v42`, vier Leitfragen
mit fester Funktion, fünf Schritte, Kriterien im KN-Wortlaut, Begriffsnetz mit
gleichem Zentrum, Auftrag mit fünf Schritten und zwei Produkten, KN mit drei
Formen, Lösung zu jedem Feld.

| | Gold 1.3.1 | 4.3.1 | Herleitung |
|---|---|---|---|
| Modi A | Rezeption schr./bildl. | Interaktion mündl. · Rezeption schr./bildl. | Modi von 4.3.1 im Datensatz |
| Modi B | Rezeption schr./bildl. · Interaktion mündl. | Rezeption schr./bildl. · Produktion schr./bildl. | Modi von 4.3.2 |
| Modi Auftrag | Produktion mündl. · Produktion schr./bildl. | Produktion mündl. | `modi_kn` − (A ∪ B) |
| SK | A 5·11·1 · B 2·6·11 · KN 5·11·6 | A 7·10·11 · B 7·11·5 · KN 7·11·5 | SK von T4 (3J) |
| Produkte | Karte · Tabelle mit Gespräch · Blatt und Sprachnachricht | Interview · Leserbrief · Kurzrede mit Antwort | Modus und Verb der Kompetenz |

## 6. Was dieser Lauf an den fünf vorhandenen Dateien geändert hat

Die Dateien waren strukturell vollständig (Phasen 4–6 je Spur, Glossar, Auftrag,
Wochenplan), aber nicht fehlerfrei. Je Befund am Dokument nachgeprüft.

**Bestandsaufnahme (zwei Prüfer, Opus), dann Executor je Datei:**
- Heft A: LF1-Begriffe (Migrationshintergrund, Lebensform …) sollten in Fragen und
  Fazit, während das Heft Fragen nach Herkunft und Familie verbietet — LF1 dient
  jetzt dem Beschreiben, dem Raster und dem Netz; im Fazit zählt ein Begriff aus
  LF2. Die Quelle war falsch wiedergegeben («Sprache die grösste Hürde»; der
  Artikel nennt zuerst Aufwand und Wirtschaftlichkeit). «Was, Wie oder Wann» als
  Merkmal offener Fragen stand nicht auf S. 373. Zwei unübersetzte Stellen im
  Video waren eine.
- Heft B: eine Musterantwort las die Übertritte als «bleiben dauerhaft»; der
  Muster-Leserbrief belegte mit einer Bestandszahl ohne Jahr gegen den heutigen
  Zuzug und machte eine Einzelperson erkennbar.

**Fakten-Audit an Primärquellen (Opus, mit Netz; `fakten-tabelle.md`):** 94
Aussagen, 70 stimmen, 8 stimmen nicht, 2 überholt, 11 nicht belegbar. Was
geändert wurde, steht im Nachtrag der Tabelle. Zwei der acht Fehler hatte dieser
Lauf selbst in der ersten Korrektur eingeführt (Angleichung an das Lehrmittel bei
«unzulässig/unzumutbar» und bei «EU»); das Audit hat sie gefunden.

**Schutzsätze, die nur die Lehrperson las, stehen jetzt im Heft** (soweit das
Budget reicht): «Es geht um ein Projekt, nicht um ein Land» (Auftrag zur Quelle);
«Alle meint alle im Team, auch Langjährige»; Schritt 05: Zweck nennen, die Person
darf eine Frage auslassen, Fazit zeigen.

**Karten:** `q-431b-vertiefung-1` (kein Herkunftsland, kein «Asylentscheid steht
noch aus»), `q-431b-vertiefung-2` (verriet die halbe Antwort), `q-431a-vertiefung-1`
(wer spricht, ist nicht belegt), `q-431a-vertiefung-2` (Mitarbeitende und
Publikationssprachen), `q-431a-pflicht.woerter` 448 → 439.

**Entscheide im Lauf (auto-modus §4):**

| Entscheid | Grund | Verworfen |
|---|---|---|
| Leitfrage von Heft A bleibt «Zeige ich im Porträt nur …» statt Bauplan «Frage ich nur …» | Der Bauplan verlangt selbst mindestens zwei Fragen zu Schwierigem; die Bauplan-Fassung liesse keine Wahl. Der Entscheid aus LF4 bestimmt jetzt Satz 2 des Fazits | Rückkehr zum Bauplan-Wortlaut |
| Heft B führt eine `zahlen_tabelle` (vier Zeilen), der Bauplan sagt «—» | Die Zeilen sind Angaben zum Produkt und kennzeichnen den Brief der Situation als erfunden | Tabelle leeren |
| Heft B: Abgabe mit «meine Wertung in einem Satz», Schluss mit Einwand und Antwort | SK 5, Legende `wertung` und die höchste Stufe beider Kriterien verlangen es | nur zwei Belege und Forderung |
| Muster-Leserbrief: Belege S. 109 (Tabelle) und Personenfreizügigkeit seit 2002 | nur diese zwei sind an Primärquellen bestätigt | S. 107 («mehr als die Hälfte»), S. 111 (Branchenanteile), S. 114 (2,4 Prozent) |
| Bei Recht gilt das Gesetz; die Abweichung des Lehrmittels steht in Lösung und Begleiter | Prompt Schritt 4; AIG Art. 83 Abs. 2–4, FZA | Angleichung an das Lehrmittel |
| `set.heft_bezug` und Schritt 02 des Auftrags nennen Heft B, S. 2 (nicht S. 7 wie im Bauplan-Vorschlag) | die Kette steht bei LF2 auf S. 2, die Karte auf S. 6 | Bauplan-Vorschlag |
| Ausschnitt des Videos bleibt 22:49–26:52 | Entscheid des Bauplans | früheres Ende (26:36), um Aufzählung und Zuruf auszulassen — Empfehlung in Abschnitt 8 |

## 7. Gegenleser (gegenleser.md §6)

Modell Sonnet (Bestand, Executors, Fakten-Audit und Schlussprüfung des Begleiters:
Opus). Kein Profil b (E31).

| Lesung | Wer | Ergebnis |
|---|---|---|
| 1 | 4 Lernende a, 1 Bogen-Leser, 4 Lösungs-Audits (Untertitel und Absätze in voller Auflösung), 1 Sweep | Audits: keine falsche Zahl, Absatznummer oder Zeitmarke; 23 Zuschreibungs- und Kennzeichnungsbefunde, alle übernommen. Lernende und Bogen: 11 Befunde übernommen (Schritt 02, 03, 04; Frage 6; zwei Verbotslisten; Checkliste; Stationen im Bogen), Rest V, R oder S. Sweep: 0 Treffer bei «ß», Platzhaltern, Umlauten, Anrede, Namen; 8 Abweichungen und 4 unbelegte Aussagen im Begleiter, alle behoben. **Die zwei Lernenden der Medien-Fassung lasen ohne Quellentext** (Fehler im Paketskript des Orchestrators: Zeilenenden der Archivdateien); ihre Lesung von S. 3 zählt nicht und wurde in Lesung 2 nachgeholt |
| 2 | dieselben 4 Lernenden (Medien-Fassung mit vollem Quellentext), Bogen-Leser, 2 Lösungs-Audits (je Heft beide Fassungen, rund 400 Aussagen) | Raster, Befund und Produkt in allen vier Fassungen herstellbar. 17 kleine Befunde übernommen, darunter ein Fehler aus Runde 1 (Netz-Verbindung «hat nur, wer selbst eingewandert ist») und die Formulierung «die Quelle zeigt Gewinn» (der Artikel nennt ihn nur als Absicht) |
| 3 | 1 Lernende/r an den geänderten Seiten (Heft A mit Medien, Heft B, Bogen); Schlussprüfung des Begleiters (rund 340 Absätze) | Hefte und Bogen: acht Punkte in Ordnung, keine unbearbeitbare Stelle, kein Widerspruch. Begleiter: 3 Fehler, 5 unbelegte Aussagen, 10 Hinweise; 12 behoben, Rest in Abschnitt 9 |

Zuletzt gelesen wurde nach der letzten sichtbaren Änderung der Hefte. Die letzten
Korrekturen am Begleiter (zwölf Stellen) und die Wortzahl der Karte sind danach
nicht mehr gegengelesen, nur vom Tor geprüft.

Zeitsummen der Lernenden (Schätzung) gegen den Seitenplan von 135 Minuten: Heft A
117–140, Heft B 90–128, Bogen 29–53. Heft A liegt am oberen Rand; der Begleiter
rechnet das Interview eigens (46 Minuten für S. 7).

Was kein Gegenleser prüfen kann: Bild und Ton, das Seitenbild, die Darstellung auf
dem Handy.

## 8. Vor der Freigabe gegenhören und gegensehen

| Quelle | Ausschnitt | Worauf achten |
|---|---|---|
| `q-431a-vertiefung-1`, Film «Baustelle auf der Hardbrücke», SRF DOK | 22:49–26:52, dazu je eine Minute davor und danach | **22:49** Einführung einer Person mit vollem Namen, Jahrgang und Geburtsland. **26:08–26:28** rund 20 Sekunden in einer anderen Sprache, nicht übersetzt, Inhalt unbekannt. **26:39–26:46** Aufzählung von Ländern, Nationalitäten und einer Sprache. **26:47** ein Mann wird mit einer Nationalitätsbezeichnung gerufen (zweimal); **26:49** Scherz, wer «gewonnen» habe. Ob neckend oder abwertend, zeigen nur Bild und Ton. **Nach dem Stopp:** 27:27 unübersetzt, 27:42 nächstes Porträt mit vollem Namen. Davor (21:42–22:48): ein Bauleiter über Termin- und Gelddruck, nichts zu Herkunft. Stimmen 22:49 und 26:52 im Player auf die Sekunde? Der Player stoppt nicht von selbst. **Empfehlung:** wirkt 26:47–26:49 nicht eindeutig freundschaftlich, die Vertiefung streichen oder bei 26:36 enden lassen (Karte, Heft und Begleiter nachziehen) |
| `q-431a-pflicht`, SRF-Artikel | ganze Seite | Zählen auf der Seite: Absatz 1 nach dem Vorspann, Galerie zwischen 3 und 4, zwei Zwischentitel — kommt eine Lernende auf 12 Absätze? Audiobeitrag auf der Seite: nicht geprüft |
| `q-431b-vertiefung-1`, SRF-Artikel | ganze Seite | nennt die junge Frau mit Namen, Alter und Herkunftsland; Audiobeitrag nicht geprüft; Stand September 2025 |
| `q-431a-pflicht-ersatz`, BFS | ganze Seite | baut den Text im Browser auf — auf dem Handy der Lernenden lesbar? |
| `q-431b-pflicht` und Ersatz, PDF des SEM | S. 11 | springt der Link auf dem Handy auf S. 11? |
| QR-Seite `/m/4.3.1_vielfalt_untersuchen` | `#a`, `#b` | nach der Freigabe: Player startet bei 22:49 |

## 9. Offen, unbelegt, nicht geprüft

**Für Pietro zum Entscheid:**
1. Video-Vertiefung von Heft A einsetzen, kürzen oder streichen (Abschnitt 8).
2. Leitfrage von Heft A weicht vom Bauplan ab (Abschnitt 6).
3. Karte `hko-stille-aushalten` passt nur halb: Ihr gedruckter Text verlangt «einen
   einzigen Impulssatz» und Nachfragen nur bei Unverständnis; das Heft verlangt
   sechs Fragen und eine vorbereitete Klärungsfrage. Zwei Lernende blieben daran
   hängen, in Lesung 2 noch einer. Die Karte ist Entscheid des Bauplans und nach
   E31 nicht zu ändern; der Begleiter erklärt die Auflösung. Alternative: eine
   andere vierte Karte.
4. Ausweichen im KN: Auch die Werkschau nennt den Fall (Reflexionsfrage 2 in
   `kn.json`). Der Begleiter sagt jetzt, die Frage für eine betroffene Person zu
   ersetzen. `kn.json` ist nicht geändert.

**Nicht belegbar (im Material als «laut Lehrmittel» gekennzeichnet, nicht als Beleg empfohlen):**
- «Mehr als die Hälfte verliess die Heimat aus wirtschaftlichen Gründen» (S. 107).
- Branchenanteile: ein Drittel im Gesundheits- und Sozialwesen, rund die Hälfte in
  Gastgewerbe und Bau (S. 111) — BFS-Tabelle nicht abrufbar.
- «Etwa 2,4 Prozent der ausländischen Wohnbevölkerung über das Asylverfahren»
  (S. 114) — an amtlichen Zahlen nicht nachvollziehbar.
- «In Krisenjahren gingen mehr, als kamen» (S. 111); höhere Arbeitslosenquote;
  frühere Integrationspolitik (S. 112); Kettenmigration, Einbürgerungshürden.
- Rund 120 Millionen Vertriebene, Stand Mai 2024: Grössenordnung gedeckt, die
  Quelle selbst nicht abrufbar.
- Publikationsmonat der Jahresstatistik 2025 («2026-02» in der Karte).

**Überholt:** «ein Viertel im Ausland geboren» (S. 111); die Lösung nennt den
heutigen Wert des BFS.

**Nicht geprüft:** Bild und Ton des Films; Audiobeiträge der zwei SRF-Seiten;
Darstellung auf dem Handy; Player auf der Produktions-Domain; Seitenbild auf
Papier; laufende Vorlagen zu Zuwanderung und Asyl (das Heft behauptet dazu
nichts); der Begleiter nach seinen letzten zwölf Korrekturen (nur Tor).

**Bleibt, wie es ist (gewollt oder Renderer):** Überschriften der Stationen 3 und
4 auf A2 nennen weder die zwei Fragen noch die Position (Stationen sind Bauplan);
«Möglich: Einzelarbeit» trotz Gegenüber in Schritt 05 (Bauplan §6); die
Checkliste zeigt «✔ … ☐» (Renderer); `herausgeber` der Karte `q-431b-vertiefung-2`
abgekürzt (Budget); Glossar «Arbeitslosenquote» und «Landessprache» mit eigener
Erklärung und Herkunft `lehrmittel`; im Begleiter: Interview im Betrieb «zwischen
zwei Schultagen» lässt offen, wann die befragte Person das Fazit sieht.

**Der Bauplan ist nicht geändert.** Sein Audit in §7 enthält vier Aussagen, die am
Archivtext nicht halten («Sprache die grösste Hürde», «Patienten und Team
zufrieden», «zwei Stellen in anderen Sprachen», «deckt sich mit S. 114») und nennt
448 Wörter. Massgebend sind die Hefte.

## 10. Fehler in Skill, Skript, Renderer, Bestand (nicht repariert)

- **Kein Budget für `quellen[].erwartung` und `loesungsbild.hinweis`.** `check-v42`
  verlangt nur «nicht leer»; die Lösungsseite lief um bis zu 458 px über (§2).
- **Die Leck-Prüfung liest `docs/` nicht** (Rückblick §3 Punkt 2). Bauplan,
  Fakten-Tabelle und Bericht sind hier von Hand geprüft.
- **Archivtexte tragen Windows-Zeilenenden**; wer sie mit `\n---\n` trennt, bekommt
  nur den Kopf. `gegenleser.md` §3 beschreibt das Paket, liefert aber kein Skript
  dafür — das Paket der ersten Lesung war deshalb unvollständig.
- **Phase 6 verlangt für den `hinweis` zwei bis drei Sätze**, die Lösungs-Audits
  verlangen dort Kennzeichnungen, die mehr Platz brauchen.
- **Das Lehrmittel ordnet auf S. 114 die «konkrete Gefährdung» dem Grund
  «unzulässig» zu**, das Gesetz (AIG Art. 83 Abs. 4) dem Grund «unzumutbar»; auf
  S. 111 nennt es bei der Personenfreizügigkeit nur die EU. Beides betrifft jede
  Einheit, die Kap. 3.4 verwendet (auch die zwei Einheiten zu 2.2).
- **`1a-abschluss-5.2.1.md` ist nicht gelaufen**, obwohl der Prompt die
  Reihenfolge 1a vor 1b nennt. `5.2.1_gesetze_veraendern` liegt unverändert
  uncommittet im Arbeitsbaum, steht als Entwurf im Index und ist in diesem Lauf
  nicht angefasst und nicht committet.

## 11. Commit

«Einheit 4.3.1_vielfalt_untersuchen (bbw-hko-heft-v42)» auf `v42-skill`: Ordner der
Einheit, acht Karten `q-431*`, Bauplan, dieser Laufordner (`BERICHT.md`,
`check-all.txt`, `messung.txt`, `fakten-tabelle.md`), die zwei Index-Dateien.
Status `entwurf`. Kein Push.
