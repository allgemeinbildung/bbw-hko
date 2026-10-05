# Nachtrag — 1.3.1_konsum_verantworten_v42 (Gold): Fehler aus dem Abschluss von 3.1.1 nachgezogen

Stand 2026-10-05, Branch `v42-skill`. Auftrag Pietro über den Orchestrator: die
im Nachtrag zu 3.1.1 (`docs/cloud-run/laeufe/2026-10-04-311/NACHTRAG.md`, §6
Zeile Gold; §2 Nr. 2, 11, 17, 19, 20, 21) gemeldeten Fehler in der Gold-Einheit
beheben. Kein Lehrmittel-, Transkript- oder Artikeltext in dieser Datei. Kein
Commit, kein Index-Build; `set.status` bleibt `entwurf`.

**Urteil: freigabereif nach Gegenhören — ja.** Pflichtquellen von Gold sind ein
Artikel und eine Statistik; zu hören sind nur die drei freiwilligen
Vertiefungen (§5). Offen bleiben Unschärfen in den Musterlösungen LF3 und drei
Stellen des Gold-Kerns, die einen Entscheid brauchen (§4, §6).

Geändert:

- `src/data/einheiten/1.3.1_konsum_verantworten_v42/herausforderung_A.json`
- `src/data/einheiten/1.3.1_konsum_verantworten_v42/herausforderung_B.json`
- `src/data/einheiten/1.3.1_konsum_verantworten_v42/begleiter.md`
- `src/data/quellen/q-131a-pflicht.json`, `q-131a-pflicht-ersatz.json`,
  `q-131a-vertiefung-2.json`, `q-131b-vertiefung-1.json`,
  `q-131b-vertiefung-2.json` (nur `kurzbeschrieb`)

Nicht angefasst: `kn.json`, `prinzip.json`, `set.json`, die publizierte
`1.3.1_konsum_verantworten`, `3.1.1_konsum_verantworten_3j`, Methodenkarten,
Renderer, Skill, Index.

**Nebenwirkung, gewollt:** Die drei Vertiefungskarten `q-131a-vertiefung-2`,
`q-131b-vertiefung-1`, `q-131b-vertiefung-2` verwendet auch
`3.1.1_konsum_verantworten_3j` (S. 4 beider Hefte, QR-Seite). Dort werden die
Kurzbeschriebe kürzer; `check-all 3.1.1_konsum_verantworten_3j` bleibt grün.
Die Messung von 3.1.1 habe ich nicht wiederholt (Texte sind kürzer geworden,
S. 4 hatte 18.9 px Reserve).

Tor nach der letzten Änderung:

```
begleiter-marker 1.3.1_konsum_verantworten_v42   223 Marker · 2 neu gefuellt · 0 unaufloesbar
check-all 1.3.1_konsum_verantworten_v42 3.1.1_konsum_verantworten_3j   GRUEN — keine Fehler.
export-v42 + messen-v42 (Gold)                   Exit 0 — kein Überlauf: vier Hefte je 8 Seiten, Auftragsbogen 4,
                                                 vier Lösungsdokumente je 5; S. 1, 6, 7 der Hefte bei 0 px Reserve wie zuvor
```

`bestand-v42`, `npm run build`, `build:einheiten-index`: nicht gelaufen.

## 1. Stellen — alt / neu

Kern-Felder gelten für beide Spuren; wo ein Feld je Spur steht, ist es genannt.

| # | Datei · Feld | Alt | Neu | Grund |
|---|---|---|---|---|
| 1 | Heft A · `spuren.mit_medien.quellen[2].erwartung` (Vertiefung A2) und Begleiter, Erwartungshorizont Vertiefung 2 Heft A | «… verboten, der Zoll hält Pakete zurück; Verfahren und Kosten gehen vom Markeninhaber aus.» | «… verboten; verdächtige Pakete werden kontrolliert, und Strafverfahren oder Bussen können vom Markeninhaber kommen, nicht vom Zoll.» | Der Ausschnitt sagt: Kontrolle (05:14), der Zoll sanktioniert nicht, Strafverfahren oder Bussen kommen vom Rechtsinhaber (06:16–06:27). «Kosten» nennt er nicht. Nur Spur mit Medien (die Spur ohne Medien hat keine Vertiefung) |
| 2 | Heft B · `spuren.mit_medien.quellen[2].erwartung` (Vertiefung B2) | «… 20 Tage zum Zahlen oder innert 10 Tagen Rechtsvorschlag → ohne Rechtsvorschlag Fortsetzung bis zur Lohnpfändung.» | «… 20 Tage zum Zahlen oder sofort bzw. innert 10 Tagen Rechtsvorschlag → ohne Rechtsvorschlag kann der Gläubiger die Betreibung fortsetzen, bis zur Lohnpfändung.» | SchKG Art. 74 Abs. 1 (sofort oder innert zehn Tagen), Art. 88 Abs. 1 (auf Begehren des Gläubigers) — kein Automatismus. Der Begleiter sagte schon «kann fortgesetzt werden»; jetzt wortgleich mit dem Heft |
| 3 | Heft B · `leitfragen[1].text` (LF2, Kern) | «… für Ihr eigenes Monatsbudget — geschätzte genügen: Einnahmen, …» | «… für Ihr eigenes Monatsbudget, wo nötig realistisch geschätzt: Einnahmen, …» | S. 6, Karte «Ein Budget aufstellen»: «Nur realistische, eigene Zahlen»; «Schätzungen durch echte Beträge ersetzen». 213 Zeichen (Grenze 220) |
| 4 | Begleiter · Coaching «LF1 und LF2» Heft B | «Wer seine echten Zahlen nicht zeigen will, darf schätzen — das Heft erlaubt geschätzte Zahlen ausdrücklich.» | «Wer einen Betrag nicht genau weiss oder nicht zeigen will, schätzt realistisch — LF2 erlaubt das («wo nötig realistisch geschätzt»). Für das saubere Budget auf S. 7 verlangt die Methodenkarte, Schätzungen wo möglich durch echte Beträge zu ersetzen.» | Folge von Nr. 3 |
| 5 | Heft B · `handlungsprodukt.schritte[2].hint` (Schritt 03, Kern) | «Markieren Sie mit dem Raster aus LF3 die Posten, die zu Schulden führen können.» | «Markieren Sie die Posten, die zu Schulden führen können — Ihr Befund aus LF3 zeigt, worauf Sie achten.» | Das Raster enthält Aussagen aus Lehrmittel bzw. Statistik, keine Budgetposten; mit dem Raster lässt sich nichts markieren. Gilt in beiden Spuren. Der Marker im Begleiter ist nachgeführt |
| 6 | Begleiter · Tafelbild Heft A | «Wahlbedürfnis → Zentrum («kann warten»)» | «Massstab → «gilt auch bei …» («hilft auch dort beim Entscheiden»)» | Das Heft verlangt eine Verbindung zum Feld «gilt auch bei …», der Begleiter (S. 8) sagt dasselbe, und `abschluss.loesung.verbindungen` zeigt sie; die fünf Beispiele des Begleiters enthielten keine |
| 7 | Begleiter · Tafelbild Heft B | «Rückstellung → Zentrum («Sicherheit später»)» | «Rückstellung → «gilt auch bei …» («braucht es auch dort»)» | wie Nr. 6 |
| 8 | Begleiter · «Stufe» (sechs Stellen: §0 zweimal, Seitenplan S. 5, Hinweis S. 5 Heft A, Abschnitt Auftrag, Vergleichstabelle Auftrag/KN) | «mit denselben vier Stufen», «ihre Stufe an», «Stufe ankreuzen», «gleiche Stufen» | «mit denselben 0 bis 3 Punkten», «ihre Punkte an», «Punkte ankreuzen», «gleiche Punkte» | E17 Nr. 5 und `sprache.md` §5: Der Begleiter spricht von Punkten. «Stufentexte» (Datenfeld) und «Maslow-Stufen» bleiben |
| 9 | Heft A · `methoden[2]` (Referenz auf `hko-bedarf-oder-wunsch`), neu `beispiel` | Kartentext: «… Ohne das Video hätte ich nie daran gedacht. → geweckt» · «Aber: Ich habe schon als Kind einen gewollt. → teilweise echt» · «Markierung: Doppelsymbol, Einfluss: Video» | «Wegdenk-Test: Ohne das Video wäre der Wunsch jetzt nicht da. → geweckt» · «Aber: Ich bin gern draussen und habe Zeit für ein Tier. → berechtigt» · «Markierung: geweckt, aber berechtigt · Einfluss: Video» (fünf Zeilen wie die Karte) | Das Heft kennt drei Markierungen (echt · geweckt · geweckt, aber berechtigt); «Doppelsymbol» und «teilweise echt» gibt es in keiner Legende, und «seit der Kindheit gewollt» widerspricht dem Wegdenk-Test. Die Karte bleibt unverändert (E31 Nr. 3); gilt in beiden Spuren |
| 10 | Karte `q-131a-pflicht` · `kurzbeschrieb` | «…: wie Social-Media-Werbung und Influencer Jugendliche auf Produkte bringen und was sie online kaufen.» | «…: wie Jugendliche auf Produkte aufmerksam werden und was sie online kaufen.» | nannte zwei der vier gesuchten Rasterzeilen; steht auf S. 3 über dem Raster |
| 11 | Karte `q-131a-pflicht-ersatz` · `kurzbeschrieb` | «… (2025): wie Influencer-Werbung getarnt wird, Spontankäufe fördert und mit Gefühlen spielt.» | «… (2025) zu Influencer-Werbung für Mode und Lebensmittel in sozialen Medien.» | nannte drei der vier Zeilen «Mit Ersatzquelle» |
| 12 | Karte `q-131a-vertiefung-2` · `kurzbeschrieb` | «… kaufen, um mit dem Trend mitzugehen, und was am Zoll und rechtlich droht. …» | «… kaufen und was am Zoll und rechtlich droht. …» | nahm die erste Hälfte der Antwort vorweg («Welches Bedürfnis steckt dahinter?») — die Karte steht auf S. 4 über «Meine Antwort» |
| 13 | Karte `q-131b-vertiefung-1` · `kurzbeschrieb` | «… warum junge Leute in Schulden geraten (Druck durch soziale Medien, kein Vorbild zu Hause) und wie ein Verein sie früh an Beratungsstellen verweisen will.» | «… warum junge Leute in Schulden geraten und was ein neuer Verein dagegen tun will.» | nannte beide Hälften der Antwort |
| 14 | Karte `q-131b-vertiefung-2` · `kurzbeschrieb` | «…: von der Mahnung über den Zahlungsbefehl (20 Tage zum Zahlen, 10 Tage für den Rechtsvorschlag) bis zur Pfändung.» | «…: was bei einer Betreibung der Reihe nach geschieht und welche Fristen gelten.» | nannte Ablauf und Fristen, nach denen die Karte fragt |

Die Karten `q-131b-pflicht` und `q-131b-pflicht-ersatz` (Statistik, Grafik) und
`q-131a-vertiefung-1` nennen Thema und Form, keine Antworten — unverändert.
E16 Nr. 4 (jede Vertiefungskarte hat Hinweis, Kurzbeschrieb, Schreibfeld)
bleibt erfüllt.

## 2. Geprüft und stehen gelassen

| Stelle | Ergebnis |
|---|---|
| `quellen_anker` Heft A «Kap. 17.2 … Seite 381-383» gegen Karte «S. 381–382» | **bleibt.** Der Anker heisst «Dokumentieren · Notiztechniken, Markierungen»; S. 383 ist die Seite der Markierungen, und das Produkt ist eine «Landkarte (dokumentiert, Markiertechnik)», Schritt 03 lässt markieren. S. 383 wird gebraucht. Die Karte deckt nur die Stichwortnotizen (381–382). Zwei Gegenleser haben die Abweichung trotzdem bemerkt — sie ist erklärbar, aber sichtbar. **Dasselbe steht in 3.1.1** (`herausforderung_A.json`, `quellen_anker[1].seiten` und `prinzip_handoff.lehrmittel_anker`) und bleibt dort aus demselben Grund |
| Auftrag und Checkliste «Begriff aus LF1», Karte S. 6 «aus den Leitfragen oder dem Glossar» | **bleibt** (Regel der Skill, `phase-5-spuren.md` §1: «jeder Begriff dort stammt aus LF1»; die Lösungsraster verwenden LF1-Begriffe). Drei von vier Lernenden-Gegenlesern nennen es als störendste Stelle: Mit LF1-Begriffen ist das Raster nur gezwungen zu füllen, sie greifen zum Glossar. In 3.1.1 heisst es nach dem ersten Lauf «LF1 oder Glossar». → Entscheid §6 |
| `lernfortschritt.scaffold_100` Heft A «… eine Vertiefungsquelle, falls Ihr Heft eine nennt» | **bleibt.** In Gold richtig: Die Spur ohne Medien hat keine Vertiefung |
| `lernfortschritt.scaffold_90` des Kerns («eine Beispielzeile im Raster der Quelle») | **bleibt** (E17 Nr. 5; die Spur überschreibt es beim Laden) |
| Karte «Aufbau eines Statements»: `tun` «Ausgangslage, Begründung, Schluss» gegen `lesen` «Einleitung … Hauptteil … Schluss» | **bleibt.** Drei Teile, gleiche Reihenfolge; die Merkzeile der Karte benutzt dieselben Wörter wie `tun`. Passungsfrage nach E31 Nr. 3 |
| Karte «Echt oder geweckt prüfen», Schritt 4 nennt nur «echt oder geweckt» | **bleibt** (Karte unverändert, E31); das Beispiel zeigt jetzt die dritte Markierung. `tun` wird bei `hko-`Karten nicht gedruckt (E31 Nr. 2) |
| Kriterien im Wortlaut des KN (Budget, Leasing/Kredit; «Sicherheit später») | **bleibt** (`ERR_V42_R6`; Begleiter erklärt es). Alle vier Lernenden-Gegenleser nennen es |
| Vertiefung B1: Heft «Der Verein verweist …», Begleiter «will … verweisen … sowie mit Berichten von Betroffenen» | **nicht mehr geändert** (nach der Leserunde gefunden, Sweep). Kein Widerspruch in der Sache; der Begleiter ist genauer. Vorschlag: Heft-Erwartung auf den Wortlaut des Begleiters setzen |
| `methoden[1].fuer` «Rezeptionswerkzeug der gewählten Spur» | kein Befund: Der Renderer ersetzt den Platzhalter `__spur__`; im Heft steht «für das Raster zur Quelle (S. 3)» |
| Glossar «Betreibung», «Überschuldung» | sachlich in Ordnung |

## 3. Geprüfte Fakten und Links

| Angabe | Quelle | Abruf | Ergebnis |
|---|---|---|---|
| 20 Tage zum Zahlen; Rechtsvorschlag sofort oder innert 10 Tagen; Fortsetzung frühestens nach 20 Tagen auf Begehren des Gläubigers; Lohnpfändung nur über das Notwendige hinaus | SchKG Art. 69 Abs. 2, 74 Abs. 1, 88 Abs. 1, 93 Abs. 1 (fedlex.admin.ch, SR 281.1, Stand 1. Januar 2026) | 05.10.2026, im Browser | stimmt |
| Abschnitt «Werden Sie betrieben?»; Mahnung üblich, aber keine Pflicht; Ratenvereinbarung, Beratung; Lohnpfändung über den Arbeitgeber | ch.ch, «Betreibung: Zahlungsbefehl, Rechtsvorschlag, Pfändung» | 05.10.2026, im Browser (curl/WebFetch zeigen nur eine 404-Hülle) | stimmt |
| Einfuhr von Fälschungen ist auch zu privaten Zwecken verboten; der Zoll kann Sendungen zurückbehalten und vernichten; seit 1. Juli 2025 vereinfachtes Verfahren für Kleinsendungen | IGE, «Was sagt das Gesetz?» (MSchG Art. 13 Abs. 2bis); BAZG, «Produktepiraterie und Markenfälschungen» — über Websuche gelesen, nicht die Seiten selbst | 05.10.2026 | Erwartung A2 trägt. Der Beitrag ist von Januar 2024, also vor dem vereinfachten Verfahren; die Erwartung gibt wieder, was der Ausschnitt sagt |
| AHV/IV/EO-Beiträge ab 1. Januar nach dem 17. Geburtstag (Lösung LF2 Heft B) | Merkblatt 2.01 der Informationsstelle AHV/IV, Stand 1. Januar 2026 — über Websuche | 05.10.2026 | stimmt |
| Statistik Heft B: 21 %, 15 % (2023: 6 %), 11 %, 29/27/23 %, 33 %, 44 % (20 + 24); Ersatzquelle 8,8 / 10,4 / 12,9 / 11,4 % | Archivtexte `q-131b-pflicht`, `q-131b-pflicht-ersatz` (Stand 01.10.2026) | Audit 05.10.2026 | alle Zahlen stimmen |
| Artikel Heft A: 47 %, 40 %, 43,6 %, Absätze 1–8; Ersatzquelle Absätze 6–10 | Archivtexte `q-131a-pflicht`, `-ersatz` | Audit 05.10.2026 | Absätze und Zahlen stimmen |

Links, alle am 05.10.2026 aufgerufen: nau.ch (200), watson.ch (200, Titel
stimmt), schulden.ch PDF (200, `application/pdf`), Datawrapper-Grafik des BFS
(200), ch.ch (im Browser vollständig), drei SRF-Adressen (200; SRG-Metadaten
ohne Sperre, A2 gültig bis 2099). Kein Link ersetzt. Nicht geprüft: ob die
Datawrapper-Grafik noch dieselben Werte zeigt (nur Erreichbarkeit).

## 4. Gegenleser

Modell Sonnet, nur lesend, je drei gleichzeitig im Vordergrund. Kein Profil b.
Eine Runde; danach wurde **nichts mehr geändert**.

| Gegenleser | Gelesen | Zu den geänderten Stellen | Sonst (nicht geändert) |
|---|---|---|---|
| Lernende/r a, Heft A mit Medien | S. 3–6, Abgleich 1, 2, 8 | Kurzbeschrieb S. 3 und Vertiefungskarten verraten die Antwort nicht mehr; Hund-Beispiel in sich stimmig und passend zu den drei Markierungen | «Begriff aus LF1» (§2) · Kriterien-Wortlaut · Karte 4 Schritt 4 · «Ins Produkt» S. 3 verlangt den Absatz auf der Karte, S. 5 und Beispiel S. 6 nicht · Titel der ch.ch-Karte nennt die drei Stationen (Titel der Seite) |
| Lernende/r a, Heft B mit Medien | S. 2–6, Abgleich 1, 8 | LF2 gegen Karte: kein Widerspruch; Schritt 03 verständlich und passend zu «Ins Produkt»; Budget-Karte mit Saldo 20.— stimmig | eigene oder Persona-Zahlen (S. 1 gibt 800/130/200 vor, LF2 sagt «eigenes») · «Begriff aus LF1» · «eine für die offene Rechnung» steht nur in den Abgaben, nicht in LF4 · Schritt 02 und 03 sagen beide «markieren», ohne zwei Zeichen zu nennen (die Legende des Beispiels auf S. 6 zeigt sie) |
| Lernende/r a, Heft B ohne Medien | S. 2, 3, 5, 6, Abgleich 1, 4, 8 | wie oben: kein Widerspruch LF2/Karte; Schritt 03 lösbar | «Begriff aus LF1» für Ursachen und Folgen aus Kap. 8.2 · Raster-Spalte «Absatz», das Lehrmittel hat keine nummerierten Absätze · wer bringt im Gespräch den Einwand |
| Lernende/r a, Heft A ohne Medien | S. 4–6, Abgleich 1–3, 8 | Hund-Beispiel stimmig, passt zu Schritt 03 und zur Landkarte | Kriterien-Wortlaut · «Ins Produkt» S. 3 verlangt die Seitenangabe auf der Karte, S. 5/6 nicht · Raster-Karte nennt «Zeitmarke» auch in der Fassung ohne Medien (geteilte Karte) |
| Lösungs-Audit, Medien-Spur A und B | LF3, LF4, vier Vertiefungen | A2 und B2 (geändert): ohne Befund, alles im Ausschnitt belegt | neun Unschärfen, siehe unten |
| Sweep | sechs Dateien, acht Karten | Begleiter und Hefte an allen geänderten Stellen deckungsgleich; kein «ß», keine Platzhalter, keine Transliteration, Anrede in Ordnung | B1 Heft/Begleiter (§2) |

Zeitsumme der Lernenden: Heft B mit Medien 100–110 Minuten ohne Vertiefung
(Seitenplan 135). Was kein Gegenleser prüfen konnte: Bild und Ton der
Vertiefungen, das Seitenbild, die Arbeitsansicht.

**Offen aus dem Audit — Musterlösungen LF3 der Medien-Spur (nicht geändert,
nicht Teil des Auftrags; Zahlen und Absätze stimmen):**

1. Heft A, Befund: «entstehen Kaufwünsche … vor allem über …» — der Artikel
   sagt «werden aufmerksam» und nennt keine Rangfolge.
2. Heft A, Rasterzeile Abs. 4, Beleg «Feed zeigt passende Angebote» — steht
   nicht im Artikel (dort: algorithmisch beeinflusste Wünsche und Impulse).
3. Heft A, Rasterzeile Abs. 6 «Billigplattformen» — das Wort stammt aus der
   Ersatzquelle; der Artikel nennt zwei Plattformen und niedrige Preise.
4. Heft A, Hinweis «Studie aus Deutschland … Quelle, Abs. 2, 8» — die Absätze
   nennen die Institute, nicht das Land.
5. Heft A, Vertiefung A2: «Anerkennung» und «trotz knappem Geld» sind Deutung
   (der Ausschnitt nennt Trend und Preis).
6. Heft B, Rasterzeile «Auszug aus dem Elternhaus»: «Der erste eigene Haushalt
   ist ein Risiko» ist Deutung.
7. Heft B, Rasterzeile Dauer und Befund: «Wer Schulden hat, bleibt oft lange
   darin» verallgemeinert von Ratsuchenden auf alle (die Lesehilfe fängt es).
8. Heft B, «Rund jeder fünfte Haushalt nennt fehlende Planung» — der Bericht
   fasst Überforderung und Planung zusammen; die Zahl stimmt.
9. Heft B, Vertiefung B1: Die «Gründe laut Beitrag» sind die Einschätzung des
   Vereinspräsidenten.

## 5. Gegenhör-Liste für Pietro (Gold)

Die Quellen und Ersatzquellen von Gold sind Text und Grafik — dort ist nichts
zu hören. Zu hören und zu sehen sind die drei freiwilligen Vertiefungen der
Spur mit Medien (S. 4). Zeitmarken ab Beginn des Beitrags.

### A1 — «So erkennt man Influencer-Werbung» (SRF Ratgeber, 23.08.2023), Audio, ganz (5:54)
`https://www.srf.ch/play/embed?urn=urn:srf:audio:c6435615-4741-4d5c-9f28-92f267610f08&subdivisions=false`
**Nie gehört; kein Transkript, keine Untertitel.** Die Erwartung stützt sich nur auf den Begleittext von SRF.

| ☐ | Zu prüfen | Hängt daran |
|---|---|---|
| ☐ | Sprache des Tons (Hochdeutsch / Mundart) | Einsatz überhaupt |
| ☐ | Nennt der Beitrag: Kennzeichnungswörter (Werbung, Ad, gesponsert), oft versteckt? | Erwartung A1, Merkmal 1 |
| ☐ | Rabattcode oder Produkt auffällig im Mittelpunkt? | Merkmal 2 |
| ☐ | nur Positives, kein Nachteil? | Merkmal 3 |
| ☐ | Prüffrage vor dem Kauf (Vertraue ich der Person, brauche ich das)? | Merkmal 4 |
| ☐ | Dauert der Beitrag 5:54, beginnt er bei 00:00 ohne Vorspann einer anderen Sendung? | «Hören Sie den ganzen Beitrag» (S. 4) |

### A2 — «Designer-Fälschungen» (SRF Impact, 10.01.2024), Video, 00:35–06:29, Mundart mit hochdeutschen Untertiteln
`https://www.srf.ch/play/embed?urn=urn:srf:video:7b5768ea-7783-4f3d-baa7-e7982a23c61d&subdivisions=false`

| ☐ | Marke | Erwartet | Wer | Hängt daran |
|---|---|---|---|---|
| ☐ | 00:35 | Player setzt hier ein | | Startmarke QR-Seite (35 s) |
| ☐ | 01:42 | knappes Geld als eigenes Motiv | Wiederverkäufer | «Markenlook trotz knappem Geld» (Deutung, §4 Nr. 5) |
| ☐ | 03:02, 03:23 | mit dem Trend mitgehen, dazugehören | Wiederverkäufer / Käufer | Erwartung A2, Bedürfnis |
| ☐ | 04:00 | der Preis als Hauptgrund | Wiederverkäufer | dito |
| ☐ | 04:15–04:19 | Einfuhr auch für den Eigengebrauch verboten | Zoll oder Sprecherstimme | Erwartung A2, Risiko |
| ☐ | 04:42, 05:14 | Paket wird kontrolliert | Zoll | «verdächtige Pakete werden kontrolliert» |
| ☐ | 06:16–06:27 | der Zoll sanktioniert nicht; Strafverfahren oder Bussen kommen vom Rechtsinhaber | Zoll | «… vom Markeninhaber, nicht vom Zoll» |
| ☐ | 06:29 | Ende; danach (06:43) «verboten, aber nicht strafbar» — gehört nicht mehr zum Ausschnitt | | Ausschnitt-Ende; Untertitel im Player einschaltbar? |

### B1 — «Neuer Aargauer Verein hilft jungen Leuten mit Schulden» (SRF Regionaljournal AG/SO, 06.02.2025), Audio, 00:04–03:10, Mundart
`https://www.srf.ch/play/embed?urn=urn:srf:audio:8e303064-455e-330b-bf96-45e5449aecf8&subdivisions=false`
Keine Untertitel. Die Datei dauert 5:04; nach 03:10 folgen andere Themen der Sendung.

| ☐ | Marke | Erwartet | Wer | Hängt daran |
|---|---|---|---|---|
| ☐ | 00:04 | Anmoderation: Druck durch soziale Medien | Moderation | Startmarke (4 s); Erwartung B1, Gründe |
| ☐ | 00:43–01:46 | Verein verweist an bestehende Stellen; Umgang mit Geld wird in manchen Familien nicht gelernt | Vereinspräsident | Gründe, Hilfe |
| ☐ | 02:03 | Konsumgesellschaft, steigende Preise («ich denke») | Vereinspräsident | Gründe (Einschätzung, §4 Nr. 9) |
| ☐ | 02:35 | Betroffene sollen berichten | Vereinspräsident | Begleiter (im Heft noch nicht, §2) |
| ☐ | 02:52 | Website und geplante App, ohne Namen | Vereinspräsident | «Eine konkrete Anlaufstelle nennt der Ausschnitt nicht» |
| ☐ | 03:10 | Ende des Beitrags; die im Beitrag genannte Zahl stammt von 2021 | | Ausschnitt-Ende |

### Nichts zu hören, aber einmal ansehen

| ☐ | Was | Adresse |
|---|---|---|
| ☐ | Quelle A: Artikel, acht Absätze, frei lesbar ohne Anmeldung | nau.ch (Karte `q-131a-pflicht`) |
| ☐ | Quelle B: PDF Seite 7 — zeigt die Seite Darstellung 3 (Alter), 4 (Dauer) und 5 (Gründe)? Das Heft nennt «Seite 7, Darstellung 4 und 5»; der Tipp auf S. 3 nennt «Alter» | schulden.ch (Karte `q-131b-pflicht`) |
| ☐ | Ersatz B: Grafik des BFS lädt, Zeilen Gesamt / Alter / Bildung / Erwerb sichtbar | Datawrapper (Karte `q-131b-pflicht-ersatz`) |
| ☐ | B2: ch.ch lädt im Browser; Abschnitt heisst «Werden Sie betrieben? Informationen für Schuldnerinnen und Schuldner» | ch.ch (Karte `q-131b-vertiefung-2`) |

## 6. Offen — braucht einen Entscheid

1. **«Begriff aus LF1» oder «aus LF1 oder dem Glossar»?** Gold und die Skill
   (§1) sagen LF1; 3.1.1 und die Skill (§8) sagen «LF1 oder Glossar»; die
   geteilte Karte sagt «Leitfragen oder Glossar». Drei von vier Lernenden
   kommen mit LF1 allein nicht durch. Variante a: Gold bleibt, Lehrperson sagt
   es an. Variante b: Auftrag, Checkliste, Karten-Beispiel und Begleiter in
   Gold auf «LF1 oder Glossar» (vier Aufträge ≤ 220 Zeichen prüfen, zwei
   Checklisten, drei Beispiele, drei Begleiter-Stellen), dazu die
   Lösungsraster um Glossarbegriffe ergänzen. **Empfehlung b** — aber als
   Entscheid für die Skill, weil Gold ihre Referenz ist.
2. **Beleg auf der Landkarte (Heft A).** «Ins Produkt» bei LF3 verlangt
   «Farbe oder Symbol und Absatz» bzw. «Seitenangabe» auf der Karte; Schritt 03,
   Beispielbild, Lösungsbild und Checkliste verlangen und zeigen nur den
   Einfluss. Variante a: Beleg streichen (so habe ich es in 3.1.1 gemacht —
   dort stand «und Zeitmarke»). Variante b: Beleg behalten und in Schritt 03
   und den zwei Bildern nachziehen (S. 6 hat 0 px Reserve). **Empfehlung a**,
   damit Gold und 3.1.1 gleich sind; Schritt 03 heisst dann weiter «Einflüsse
   belegen», belegt wird im Raster.
3. **Eigene oder Persona-Zahlen (Heft B).** S. 1 gibt 800/130/200 vor, LF2 und
   die Karte verlangen eigene Zahlen, das Lösungsbild rechnet mit der
   Situation, die Abgabe verlangt «eine Anpassung für die offene Rechnung».
   Der Begleiter sagt «eigene Zahlen». Ein Satz im Heft würde es klären; er
   kostet Platz auf S. 2.

## 7. Nicht geprüft

- Ton und Bild der drei Vertiefungen; ob die Player an der Startmarke
  einsetzen.
- Arbeitsansicht, Präsentation, QR-Seite, Katalogkarte im Browser.
- Messung von 3.1.1 nach der Änderung der drei geteilten Karten.
- Profil b.
- Lösungen der Spur ohne Medien gegen das Lehrmittel (nicht geändert; Fachprüfung
  vom 01.10.2026).
- `bestand-v42 --pruefen`, `npm run build`, Index.
