# Bericht — 3.3.1_kaufvertrag_beurteilen (bbw-hko-heft-v42, Auto-Modus, lokal)

Lauf vom 2026-10-04, ein Durchgang von `docs/cloud-run/prompts/alle-bauplaene-seriell.md`,
Bauplan `docs/cloud-run/bauplaene/3.3.1_kaufvertrag_beurteilen.md` (freigegeben
am 2026-10-04). Ergebnis: **grün**. Daneben lief eine zweite Session an
`3.2.1_konsumfolgen_beurteilen`; bis zu ihrem Commit (`c954488`) wurde nur
geschrieben, nicht gemessen.

## 1. Einheit

| | |
|---|---|
| Ordner | `src/data/einheiten/3.3.1_kaufvertrag_beurteilen/` (sechs Dateien) |
| Lehrgang | EFZ_3J (kanonisch) · `lehrgaenge`: EFZ_3J, EFZ_4J — Lebensbezug 3.3 ist in beiden Datensätzen zeichengleich (am Datensatz nachgeprüft; `check-all` «nRLP-Abgleich … Lehrgaenge» ok) |
| Heft A | 3.3.1 · «Geklickt und bereut – bin ich an den Kauf gebunden?» · Prüfbericht als Tabelle mit Entscheid · Spuren `ohne_medien`, `mit_medien` |
| Heft B | 3.3.2 · «Nach fünf Monaten defekt – was fordere ich, und wie?» · Mängelrüge mit Antwort aus der Gegenrolle, Reklamationsgespräch, Ergebnisnotiz · Spuren `ohne_medien`, `mit_medien` |
| Auftrag | «Am Telefon zugesagt – kommt Grossmutter da heraus?» · Fristenplan (`flaeche`) und Erklärung (`spur`) · Lebensbereich Familie |
| KN | «Gebraucht gekauft, Schaden entdeckt – was fordere ich?» · Kauf unter Privatpersonen |
| Status | `"entwurf"` |
| Neue Methodenkarten | `src/data/methoden/lm-1-3-rechtsfall.json`, `lm-17-4-geschaeftsbrief.json` (Bauplan §9) |
| Quellenkarten | `q-331a-*` (4), `q-331b-*` (4) — lagen aus Phase Q vor, unverändert |

## 2. Tor (letzte Ausgaben, nach der letzten Änderung)

- `npm run build:einheiten-index`: 24 Sets geschrieben (siehe §10, fremde Ordner).
- `begleiter-marker --check`: 275 Marker · 0 abweichend · 0 unauflösbar.
- `check-all 3.3.1_kaufvertrag_beurteilen`: **GRUEN — keine Fehler.** (Datei `check-all.txt`)
- `export-v42` + `messen-v42`: Exit 0, 56 Seiten ok, kein Überlauf (Datei `messung.txt`).
  Je Heft und Spur 8 Seiten, Auftragsbogen 4, je Dokument «Lösungen» 5.
  Reserve 0 px auf S. 1, 6, 7 der Hefte und A2/A3 (Füllflächen); knapp: S. 8
  (4.2 px in drei von vier Heften), A1 (4.6 px), A4 (10.2 px), Lösungen B ohne
  Medien S. 3 (11.3 px).
- `bestand-v42 --pruefen`: OK — 26 Dokumente unverändert.
- `npm run build`: Exit 0.
- `check-all 1.3.1_konsum_verantworten_v42 2.3.1_anliegen_vertreten 2.1.1_informationen_hinterfragen`: GRUEN.

Reparaturrunden am Tor: eine (drei Überläufe aus der ungemessenen
Schreibphase: Heft A S. 6 um 40.7 px, Lösungen A mit Medien S. 3 um 103.2 px,
Lösungen B mit Medien S. 3 um 177.8 px — alle in den Daten gekürzt). `check-all`
war von Anfang an grün.

## 3. Kapitel, Seiten, Quellen

Lehrmittel (am Kapiteltext gelesen): Kap. 2.4 S. 55–64 · Kap. 1.3 S. 24–27 ·
Kap. 17.4 S. 398–399 · Kap. 19.2 S. 429 (ausserhalb der Crosswalk-Zeile,
Bauplan §2). Nur über Methodenkarten: Kap. 17.1 S. 380, Kap. 17.3 S. 394–395,
Kap. 19.2 S. 427–429. Lösungen von Heft A zitieren zusätzlich Kap. 2.4 S. 62
(Geschäftsbedingungen als Teil des Vertrags) — als «ausserhalb der Heftseiten»
gekennzeichnet.

| Slot | ID | Typ | Herausgeber · Datum | Ausschnitt | geprüft |
|---|---|---|---|---|---|
| A Quelle | `q-331a-pflicht` | Artikel | ch.ch · o. D. (Abruf 2026-10-04) | Abs. 1–16 | 2026-10-04 |
| A Ersatz | `q-331a-pflicht-ersatz` | Artikel | Konsumentenschutz · 2026-02-24 | Abs. 1–19 | 2026-10-04 |
| A Vertiefung 1 | `q-331a-vertiefung-1` | Rechtstext | Fedlex · Stand 2026-10-01 | OR 40a, 40b, 40e | 2026-10-04 |
| A Vertiefung 2 | `q-331a-vertiefung-2` | Artikel | SRF Espresso · 2022-09-29 | ganzer Text | 2026-10-04 |
| B Quelle | `q-331b-pflicht` | Video | SRF Kassensturz · 2026-05-19 | 00:00–02:53 | 2026-10-04 |
| B Ersatz | `q-331b-pflicht-ersatz` | Video | SRF Kassensturz · 2026-03-03 | 00:52–04:22 | 2026-10-04 |
| B Vertiefung 1 | `q-331b-vertiefung-1` | Rechtstext | Fedlex · Stand 2026-10-01 | OR 201, 205, 206, 210 | 2026-10-04 |
| B Vertiefung 2 | `q-331b-vertiefung-2` | Artikel | SECO · o. D. (Abruf 2026-10-04) | Abschnitt Sachmängel | 2026-10-04 |

Zugeständnisse wie Bauplan §7. Keine Recherche in diesem Lauf, kein Swissdox.

## 4. Abdeckung (kohaerenz.md §3)

Die Tabelle A1–A14 des Bauplans §8 ist an den fertigen Dateien nachgeprüft;
sie gilt unverändert.

| # | Befund an den Dateien |
|---|---|
| A1 | `modi_kn` (vier): Rezeption schriftlich und bildlich → Heft A S. 3 · Interaktion mündlich → Heft B Produkt · Produktion schriftlich und bildlich → Auftrag A2 · Produktion mündlich → Auftrag A3 |
| A2 | A: Rezeption schriftlich und bildlich an S. 3 und im Prüfbericht · B: Interaktion schriftlich (Brief, Antwort) und mündlich (Gespräch, Notiz) am Produkt |
| A3 | Heft B übt auf S. 3 Rezeption (ohne Medien schriftlich, mit Medien audiovisuell), führt sie nicht; `nrlp.sprachmodi` von B = die zwei Interaktionsmodi |
| A4 | `produkte[0]` flaeche, Schritt 4 · `produkte[1]` spur, Schritt 5 |
| A5 | zwei Lücken wie Bauplan: keine Grafik/Umfrage in Heft A; das formale Konfliktgespräch ist ein Rollenspiel zu zweit |
| A6/A7 | SK A 1·5·3, B 1·9·3, KN 1·3·5 (Werkschau 5·1·3); SK 9 in Heft B an LF4 über die Strategie «Folgen: für Sie, das Geschäft und die Umwelt» — schwächste Zuordnung (Bauplan §9), als Fallüberlegung gekennzeichnet |
| A8/A9 | Produkte und Lebensbereiche paarweise verschieden (Onlineshop · Fachgeschäft · Familie · Kauf unter Privaten) |
| A10 | A: Fachkorrektheit + Rechtliches Prinzip · B: Argumentation + Position / Werthaltung · Auftrag: alle vier; Stufentexte zeichengleich mit `kn.rubrik_shared` (`regel6` ok) |
| A11 | Pol-Typen: A `modell_eigener_fall` / `lehrmittel_quelle`, B `recht_praxis` / `recht_praxis` — wie `prinzip.pol_typ_verteilung` |
| A12 | beide Hefte mit beiden Spuren |
| A13 | Fall-Begriffe: kein Treffer in Heften, Auftrag, Glossar, Karten (`check-v42`, Sweep) |
| A14 | siehe §5 |

Beleg für Stufe 3 «übertragen» (Kriterium 3): Transfer-Ast des Begriffsnetzes
auf S. 8 beider Hefte und `abschluss.loesung.transfer`.

## 5. Vergleich mit Gold (nur Kurzliste aus kohaerenz.md §4)

| | diese Einheit | Gold 1.3.1 | Herleitung |
|---|---|---|---|
| Modi Heft A | Rezeption schriftlich und bildlich | gleich | 3.3.1 nennt allein diesen Modus |
| Modi Heft B | Interaktion mündlich · Interaktion schriftlich | anders | 3.3.2, Kompetenz-Ebene |
| Modi Auftrag | Produktion mündlich · Produktion schriftlich und bildlich | gleich | Formel `modi_kn − (A ∪ B)`; kein Heft führt einen Produktionsmodus |
| `modi_kn` | Gerüst-Wert | gleich | E27, kein Befund |
| SK | A 1·5·3 · B 1·9·3 · KN 1·3·5 | A 5·11·1 · B 2·6·11 · KN 5·11·6 | SK des Themas T3, Bauplan §3 |
| Produkte | Prüfbericht (Tabelle) · Mängelrüge mit Antwort und Gespräch (Fliesstext, Wechselrede) · Fristenplan · Erklärung für eine Person | alle anders | Verben der Kompetenzen, Modi |
| Quellentyp B | Video | — | Modus des Themas, geübt nicht geführt |

Nicht alle drei (Modi des Auftrags, Produkte, SK) sind gleich. Die Gold-Dateien
wurden für Inhalte nicht gelesen; die Executors haben sie nur als Form-Referenz
geöffnet.

## 6. Entscheide im Lauf (auto-modus §4)

Kein Entscheid des Bauplans wurde geändert. Wo er schwieg:

- **Prinzip/KN:** `aktivierte_trade_offs` des KN = Spannungsfelder 2, 3, 4
  (Bauplan §5: «verbindet A und B, aktiviert zusätzlich 4»). Leitfrage des KN
  und die Stufentexte der Rubrik sind eigene Formulierungen; die Stufen nennen
  «Urteil oder Forderung», damit sie auf beide Hefte und den Auftrag passen.
  `quellen_anker.chapters` führt Kap. 17.4 und 19.2 mit, weil Heft B dort
  Fachinhalt für LF1/LF2 holt (nicht nur eine Karte). `transferfeld` mit drei
  Beispielen ausserhalb von A, B, Auftrag, KN und Gold.
- **Heft A:** LF1 trägt auch den Widerruf (S. 60), weil der Abschnitt ohne
  Medien (S. 63–64) nur «Rücktritt» kennt. Zehnter Knoten «Internetkauf».
  Beispielbild «unbestelltes Buch» mit eigenen Prüffragen (die vier des Hefts
  passen nicht auf den Fall). Lösungsbild entscheidet «Ausweg beim Shop».
  `zahlen_tabelle` Zeile 4 gekürzt (Wert ≤ 15 Zeichen). Plus-Aufgabe «Haustür»
  statt «Telefon» (Fall des Auftrags). `kn_aktivierung` ohne die Fall-Begriffe.
  Die letzte Spalte heisst überall «Rechtsfolge» (Bauplan nennt in §4 «Rechtsfolge
  für mich» im Format und «Rechtsfolge» im Kopf des Produktbilds).
- **Heft B:** LF1 reicht bis S. 62 Absatz 1 (zwei Jahre), weil das Video sie
  nicht nennt. «Zwei Belege» = einer aus dem Fall, eine Regel aus dem Raster
  (ohne Fundstelle im Brief; die Fundstelle bleibt im Raster). Die Antwort auf
  den erwartbaren Einwand «nur Reparatur» steht in Stichworten neben dem Brief
  und kommt im Gespräch. Wortzahl 80–100 vom Brieftitel bis zum Schluss. Die
  Situation ergänzt einen Satz (Geschäftsleitung lädt zum Gespräch).
  **Abweichung von phase-6 §5:** Das Produktbild zeigt nur Brief und
  Gesprächsausschnitt, nicht Antwort und Ergebnisnotiz — die engen Masse des
  Bauplans lassen keinen dritten Block zu; Beispiele für beide stehen im
  Hinweis des Lösungsbilds. Zehnter Knoten «Ich-Botschaft».
- **Set:** «Geschäftsbedingungen» technisch zwei Glossareinträge (je Heft)
  mit gleicher Definition (`regelGlossar` prüft je Heft). «Noch fünf Tage»
  steht nicht in der Situation, sondern nur im Erwartungshorizont; der Auftrag
  sagt «die Frist rechnen Sie ab dem Tag der Zusage» (Bauplan §9).
  `zahlen_tabelle` mit drei Zeilen. Entscheid und Antwort an den Onkel stehen
  zuoberst im Fristenplan.
- **Begleiter:** nennt neun Lektionen (nRLP) gegen den Plan der Einheit;
  Frontmatter `lehrgang` einwertig, beide Lehrjahre in Präambel und Kap. 0;
  SK des Auftrags 3·5; «vor dem Druck» als `warnung`-Callout unter
  «Vorbereitung der Spur mit Medien»; Dreiergruppe bei ungerader Klassengrösse
  (eigene Ergänzung).
- **Gegenleser:** die Lösungs-Audits je Heft für beide Spuren in einem Auftrag
  (zwei statt vier Audits); der Text der QR-Seite fehlte in den Paketen (kein
  Dev-Server), die Lernenden bekamen den Archivausschnitt.
- **Index:** siehe §10 (zwei fremde, uncommittete Einheiten im Index).

## 7. Gegenleser (gegenleser.md §6)

Besetzung, gleichzeitig: Lernende/r Profil a an Heft A ohne, Heft A mit, Heft B
ohne, Heft B mit, Auftragsbogen; Profil b an Heft A mit und Heft B mit;
Lösungs-Audit Heft A (beide Spuren), Heft B (beide Spuren); Sweep. Pakete mit
`seitentext.mjs`, dazu die genannten Lehrmittelseiten und der Archivausschnitt;
nie Begleiter, Lösungen, Bauplan.

| Gegenleser | Runde 1 | übernommen | nicht übernommen |
|---|---|---|---|
| Lernende a, Heft A ohne | 3 Stellen + 27 Hänger | Tabelle überall gleich beschrieben, Herkunft von «Rechtslage» geteilt, Schritt 01, «offen» erlaubt, Titel des Beispiels, Checkliste Raster, Glossar | Widerspruch S. 60 gegen S. 63 (Lehrmittel; das Heft lässt die Frage offen), «gekauft ist gekauft» (Bauplan, Situation), SuK/Ges und «Wortlaut Kompetenznachweis» (R), Karte SQ3R/S. 380 und feste Kartenschritte (S), S. 7 leere Fläche (R) |
| Lernende a, Heft A mit | 3 Stellen + 20 Hänger | wie oben; Kartenbeispiel als «Erfunden» gekennzeichnet | «Das geben Sie ab» nennt nur Prüfbericht und Entscheid, die Checkliste auch Raster und Befund (V, Bauplan); zwei Bedeutungen von «Widerrufsrecht» in Quelle und Glossar (Q) |
| Lernende b, Heft A mit | 3 Stellen, Wortliste | wie oben; Glossar «Handlungsfähigkeit» | unerklärte Wörter des Gerüsts (Persona, Sprachmodus, Quer-Check, Begriffsnetz — R); QR-Code im Textpaket nicht sichtbar (Artefakt) |
| Lernende a, Heft B ohne | 3 Stellen + 28 Hänger | Partnerteil (Reihenfolge, Rollen, Abgaben), Denkhilfe (Gesetz gegen Angebot des Geschäfts), Beispielzeile des Rasters, Satzanfänge, Karte 3B, zweiter Beleg im Beispielbild | Pflicht «aufbewahren, ohne zu benutzen» gegen täglichen Bedarf (bleibt als Spannung; die Frage erlaubt «offen»), ein Schreibfeld auf S. 7 (R) |
| Lernende a, Heft B mit | 3 Stellen + 20 Hänger | wie oben; Auftrag zur Quelle nennt Möbelkauf und was in «Bild» gehört; Quer-Check zum Garantieschein | Video nennt weder Ersatz noch Garantieschein (Q, Zugeständnis im Bauplan); QR-Adresse mit 3.3.1 (V, E21); Tabelle S. 1 ohne Kopf (R) |
| Lernende b, Heft B mit | 3 Stellen, Wortliste | wie oben; leere Klammern bei Minderung/Wandelung, Verweis «Schritt 04» | LF4-Wortlaut (V); Wörter der Stufentexte («schlüssig», «ansatzweise» — KN-Wortlaut) |
| Lernende a, Auftragsbogen | 3 Stellen + 12 Hänger | Schreibort der Schritte 01–03, Fristberechnung ab Zusage, Form und «Tag (heute + n)», Indikatoren | «ohne Fachbegriffe» im Hinweis A3 (V, Bauplan wörtlich); «Zahlen \| Betrag», «Ende Ziel 2 Minuten», «Erklärung planen» (R); Stufe 3 «auf einen neuen Fall übertragen» (V) |
| Audit Heft A | 8 Befunde, keiner «falsch» | alle 8 (einheitliche Fassung «der Klick bindet mich an mein Angebot; ob der Shop schon angenommen hat, ist offen»; Annahmen gekennzeichnet; S. 62 als ausserhalb der Heftseiten; Markt- und Messestand genau; Art. 40b/40e genau) | — |
| Audit Heft B | 11 Befunde, keiner «falsch» | alle 11 (Garantie/Gewährleistung, Datum im Schluss, Annahmen gekennzeichnet, Zeitmarke 01:30–01:42, Ersatzquelle, Deutung zum Garantieschein, Transfer-Beispiel ersetzt) | — |
| Sweep | kein Regelverstoss | — | — |

Weggefallen nach Nachprüfung: «Ich Ich möchte …» und «Versand» als Name
(Sprecher und Text der Wechselrede, in der Textaufbereitung zusammengezogen);
«✔ … ☐» doppelt (Artefakt); «Kap. 17.1/17.3 fehlen im Paket» (so gewollt: nur
die Karte).

**Runde 2** (alle sieben Lernenden an den geänderten Seiten): Kernbefunde
behoben oder deutlich besser. Neu aus den Änderungen: Checkliste «Beispielzeile
zählt» (stimmte mit Medien nicht), «eine Frage darf offen bleiben» zu vage,
Titel «eigene Prüffragen», Prüffragen ohne Nummer, Widerruf aus LF1 ohne Ziel
(Heft A); «zweiter Beleg ohne Fundstelle» gegen die Karte, «zwei Begründungen»
gegen «2 Belege», «ob ein Gerät weggeworfen wird», Quer-Check nicht ehrlich
abhakbar (Heft B); «Mindestbetrag», überladene erste Planzeile, Ort der Antwort
an den Onkel, Glossar «wo es das erlaubt» (Set).
**Runde 3** (dieselben sieben, nur die geänderten Zeilen): siehe unten
«Offen nach drei Runden». Danach wurde nichts mehr geändert. Zuletzt gelesen:
Runde 3.

Ergebnis Runde 3: Drei der sieben Lesenden nennen keine Stelle mehr, die am
Arbeiten hindert (Heft A mit Medien Profil a, Heft B ohne Medien,
Auftragsbogen). Alle Hänger aus Runde 2 sind behoben oder «teilweise».

**Offen nach drei Runden** (nicht mehr geändert):

- **Heft A S. 5 gegen S. 8:** «Das geben Sie ab» nennt nur Prüfbericht und
  Entscheid (Bauplan), die Checkliste hakt auch Raster, Befund und Begriffsnetz
  ab. Lernende wissen nicht, ob diese abgegeben werden.
- **Heft A S. 8 gegen S. 3 ohne Medien:** «Raster S. 3: vier Zeilen gefüllt»
  gegen «Zeile 1 ist ein Beispiel; suchen Sie drei weitere» — ob drei eigene
  plus Beispiel oder vier eigene, bleibt für eine Leserin unscharf.
- **Heft A, «anfechtbar»:** LF1 und die Checkliste verlangen es, kein «Ins
  Produkt» nimmt es auf. «Offen» bei Prüffrage 1 ist erlaubt, das Beispiel auf
  S. 6 zeigt aber keine offene Zelle.
- **Heft A S. 4:** «gekauft ist gekauft» und «Ausweg beim Shop suchen» haben
  keinen Lehrmittelbezug (Situation und Fallangabe, Bauplan).
- **Heft A, Glossar «Widerrufsrecht»:** meint das gesetzliche Recht; die Quelle
  nennt in Abs. 3 auch eine freiwillige Bedenkzeit so.
- **Heft B mit Medien, S. 8 Quer-Check 1 und LF4:** Das Video nennt keinen
  Garantieschein; dass er vorgeht, ist eine Übertragung (in der Lösung als
  Deutung gekennzeichnet). Zwei Lesende entscheiden hier «nach Gefühl». Ohne
  Medien trägt S. 62 die Antwort.
- **Heft B mit Medien, S. 3 Spalte «Bild»:** bei einem Studiogespräch kaum zu
  füllen (Bauplan-Spalten, Quelle).
- **Heft B S. 5:** «Woran sehe ich das» nennt «2 Belege», die Stufe für
  2 Punkte «einem Beleg» (KN-Wortlaut) — die Grenze zwischen 2 und 3 Punkten
  ist für eine Leserin unklar. «Folge für mich» ohne Beispiel.
- **Heft B S. 6:** Karte 3B sagt «die Antwort auf den Einwand folgt im
  Gespräch», S. 5 verlangt die Stichworte dazu schon neben dem Brief; der
  Merksatz der Karte spricht von «drei Argumenten».
- **Heft B S. 8:** «Preisnachlass/Rücktritt» neben «Minderung/Wandelung» —
  vier Wörter für zwei Sachen (das Glossar verbindet sie).
- **Heft B S. 5/S. 7:** Das Heft geht für die Antwort der Partnerperson aus der
  Hand; ein Schreibfeld für alles. Schritt 01 «Markieren Sie …» ohne Ort.
- **Auftragsbogen:** «Beleg» beim Widerruf ohne Mangel bleibt geraten
  (gemeint: Einschreibequittung); woher die 100 Franken kommen, steht nur in
  Heft A S. 2 bzw. Lehrmittel S. 60; «ohne Fachbegriffe» (A3) gegen Stufentexte
  «Begriffe und Regeln» (A4).
- **Alle Hefte:** Glossar «Geschäftsbedingungen … Das Gesetz lässt Abweichungen
  oft zu» — «oft» sagt nicht, ob im eigenen Fall.

Zeitsummen der Lernenden gegen den Seitenplan (Schätzungen, Runde 1): Heft A
Profil a 88 Min. (mit Medien) und 95 Min. (ohne), Profil b 153 Min.; Heft B
Profil a 104 Min. (ohne) und 150 Min. (mit), Profil b 178 Min.; Auftragsbogen
54 Min. Profil b braucht in beiden Heften etwa das Doppelte.

Kein Gegenleser konnte prüfen: Ton und Bild der Videos, Seitenbild und
Feldgrössen (die Messung prüft nur Überlauf), die QR-Seite.

## 8. Vor dem Druck gegenhören / gegensehen

- **`q-331b-pflicht`** (Heft B, Quelle): Zeitmarken 00:26, 00:35, 00:50,
  01:30–01:42, 01:52, 02:16, 02:31 — nur nach Untertiteln, Ton nicht gehört;
  ob der Player bei 00:00 des Segments beginnt; was in der Spalte «Bild» zu
  sehen ist (im Heft «Studio», aus dem Audit des Bauplans). Der Bauplan führt
  00:49 und 02:15, das Heft 00:50 und 02:16.
- **`q-331b-pflicht-ersatz`:** 00:57, 02:07, 02:14, 04:01; wer bei 02:07
  spricht; ob sich der Ausschnitt 00:52–04:22 im Player ansteuern lässt.
- **`q-331a-pflicht`** (ch.ch): Absatzzählung auf dem Handy (Zwischentitel und
  Listenpunkte zählen mit; Abschnitte müssen aufgeklappt werden); ob Abs. 1–16
  noch so stehen (Seite ohne Datum).
- **`q-331a-vertiefung-1`, `q-331b-vertiefung-1`:** Die Fedlex-Adresse lädt
  nur im Browser; Stand der Artikel am Drucktag.
- **Alle QR-Adressen** auf einem Handy ohne Konto.
- **Heft B S. 7:** ob ein Schreibfeld für Brief, Stichworte, Antwort der
  Partnerperson und Ergebnisnotiz reicht.
- **Heft A S. 7:** leere Fläche, die Tabelle zeichnen die Lernenden selbst.

## 9. Unbelegt, nicht geprüft

- **Vertrag im Onlineshop:** Kap. 2.4 S. 60 und S. 63 sagen Verschiedenes dazu,
  wer annimmt; ob die Bestätigung per E-Mail schon die Annahme ist, lässt das
  Lehrmittel offen. Heft und Lösungen lassen es offen (Prüffrage 1 darf «offen»
  bleiben).
- **Rückgabe gegen Gutschein** (Heft A) und **Garantieschein «nur Reparatur»**
  (Heft B): Angaben des Falls, nicht aus dem Lehrmittel; in den Lösungen so
  gekennzeichnet.
- **Reparatur, Leihgerät, Abwägung nach Folgen (SK 9):** Fallüberlegungen.
- **Form des Widerrufs** (eingeschrieben nach S. 60, formfrei nach OR 40e) und
  **zwei oder drei Mängelrechte** (Juristin gegen S. 61): beide Fassungen mit
  Fundstelle, keine als einzig richtige.
- **Fristbeginn im Auftrag:** das Lehrmittel sagt es nicht; gerechnet wird ab
  der Zusage (Bauplan §9).
- **KN:** kein abschliessendes Rechtsurteil verlangt (Ausschluss der Garantie
  gegen Anfechtung wegen Täuschung).
- **Glossar:** «Bestellbestätigung» steht als Wort nicht im Lehrmittel (S. 64
  nennt die Pflicht zu bestätigen); die vier Glossarbegriffe der Medien-Spur
  stützen sich auf Bauplan §7 und die Lösungen der Hefte.
- **Begleiter:** die Erwartungshorizonte der Vertiefungen sind aus den Heften
  paraphrasiert; KN-Frage 1 verweist auf Kap. 2.4 S. 59 nach Bauplan §2.
- Nicht geprüft: Ton, Bild, QR-Seite, Aussehen in Word (nur Seiten gezählt),
  Workbench im Browser (kein Dev-Server in diesem Lauf), Seitenangaben der
  Karten `lm-17-1-sq3r` und `lm-17-3-3b-schema`.

## 10. Fehler in Skill, Skript, Renderer, Bestand (nicht repariert)

Neu in diesem Lauf:

- **Budgets fangen die Lösungsseite 3 der Medien-Spur nicht:** LF4-Erwartungshorizont
  und zwei Vertiefungs-Erwartungen im Budget liefen 103 px und 178 px über.
  `check-v42` kennt kein Budget für `erwartung` (bekannt) — hier zum ersten Mal
  mit grossem Überlauf.
- **Beispielbild mit vierspaltiger Tabelle (S. 6):** nur die erste Zelle hat ein
  Budget (≤ 30); mit zwei angereicherten Karten lief die Seite 40.7 px über.
- **Karte `hko-gezielt-suchen`:** druckt «nach zwanzig Minuten» und ein Beispiel
  mit Probezeit und Vertrag — eine Minutenangabe im Heft, die nicht
  überschreibbar ist.
- **Karte `lm-1-3-rechtsfall`** (neu, Wortlaut aus Bauplan §9): das Musterbeispiel
  sagt «am Marktstand gibt es keinen Widerruf (Kap. 2.4, S. 60)»; S. 60 knüpft
  das an eine Bedingung. Die Lösung von Heft A fasst es genau, die Karte nicht.
- **Karte `lm-17-4-geschaeftsbrief`** (neu): nennt «Absicht», das Heft
  «Forderung mit Frist»; Merksatz («der zweite Absatz die Forderung») gegen
  `fehler` («nach zwei Sätzen»).
- **Skelett `herausforderung-template.json`:** Checkliste «Begriff aus LF1»
  gegen phase-5 §8 «(LF1 oder Glossar)». phase-5 §6: `loesung.kern` von LF4 mit
  «Erwartungshorizont: …» ist mit echten Polnamen fast am Limit von 55.
- **Kein Platz für eine Video-Sehkarte:** `hko-quelle-raster` ist die einzige
  Rezeptionskarte; für ein Studiogespräch trägt die Spalte «Bild» fast nichts.
- **phase-6 §5 gegen Produkte mit vier Teilen:** Ein Produktbild mit Fliesstext
  und Wechselrede kann nicht jeden Teil der Abgaben zeigen (Heft B).
- **Begleiter-Skelett:** `kn.mehrdeutigkeits_pflicht` im Callout «Der Grundsatz»
  ohne Marker führt zu `WARN_BEGLEITER_KOPIE_OHNE_MARKER`; kein Ort für mehrere
  Lehrgänge mit verschiedenem Lehrjahr; keine Regel für `lehrgang` im
  Frontmatter bei zwei `lehrgaenge`.
- **Leck-Prüfung nur in `check-all`:** Ein Executor ohne `check-all` kann die
  14-Wörter-Regel nicht prüfen (hier wegen der Sperre relevant).
- **Persona «1. Lehrjahr» bei `lehrgaenge` EFZ_3J und EFZ_4J:** Sie wird auf
  Auftragsbogen und KN gedruckt und stimmt für 4J nicht (T3 liegt dort im
  2. Lehrjahr). Der Bauplan nimmt es hin.
- **`budgetAuftrag`:** kein Minimum für `situation_text`.
- **Crosswalk:** Zeile 3J 3.3 führt Kap. 19.2 noch nicht (Bauplan §2).

Bekannt aus früheren Läufen, hier wieder berührt: E30 in der Skill nicht
nachgeführt; `tun` wird für `hko-`Karten nicht gedruckt; Renderer druckt
«Erklärung planen» und «Ende Ziel 2 Minuten · Probelauf» (Form `spur`),
«Zahlen | Betrag» als Tabellenkopf, «SuK/Ges» und «Wortlaut Kompetenznachweis»
ohne Erklärung; `hko-quelle-raster` spricht ohne Medien von «sehen, hören» und
«Zeitmarke»; Merksatz von `lm-17-3-3b-schema`; kein Budget für `erwartung` und
`beispiel_pol_*`; `set-template.json` zeigt `produkte[].schritt` als String;
jede Änderung an Heft oder Set nach Phase 8 verlangt einen neuen Lauf des
Marker-Skripts (hier dreimal: 3, 23, 13 Marker neu gefüllt); A1 und A4 des
Auftragsbogens sind knapp, sobald Schritte zweizeilig sind.

Bestand und Arbeitsbaum:

- Im Arbeitsbaum liegen fremde, uncommittete Änderungen (Skill,
  `scripts/check-v42.mjs`, Renderer `seiten-1-4.tsx`, `seiten-5-8.tsx`,
  `heft-1-4.css`, `EinheitWorkbench.tsx`, `docx-heft-v42-*.ts`, `tracking.ts`,
  `.gitignore`, die Einheiten 2.1.1 und 2.3.1, `hko-quelle-raster.json`, Karten
  `q-…` anderer Baupläne). Ein Teil kam während des Laufs dazu. Sie sind nicht
  angefasst und nicht im Commit; Messung und Build liefen mit ihnen.
- **Index:** Während des Laufs begannen zwei weitere Sessions
  (`4.1.1_wohlbefinden_staerken`, `4.2.1_risiken_absichern`, Ordner ohne
  Commit). `build:einheiten-index` schreibt darum 24 Sets; die zwei
  committeten Index-Dateien enthalten Einträge dieser zwei Einheiten, deren
  Ordner nicht im Commit sind. Das heilt der Commit jener Sessions.

## 11. Commit

Ein Commit «Einheit 3.3.1_kaufvertrag_beurteilen (bbw-hko-heft-v42)»: Ordner der
Einheit, die acht Karten `q-331a-*`/`q-331b-*`, die zwei neuen Methodenkarten,
dieser Bericht mit `check-all.txt` und `messung.txt`, die zwei Index-Dateien.
Der Bauplan bleibt untracked wie die übrigen Baupläne. Kein Push.
