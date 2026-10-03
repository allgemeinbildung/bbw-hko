# Bericht — lokaler Lauf 2026-10-03, Einheit 2.2.1_meinungsfreiheit_reflektieren

Branch `v42-skill` · Skill `bbw-hko-heft-v42`, Auto-Modus (Phasen 2–9) · lokal im
Arbeitsbaum, kein Cloud-Lauf · Start 03.10.2026, Abschluss 04.10.2026 (Unterbruch
durch ein Nutzungslimit; die Daten tragen `erstellt_am` und `quelle_stand`
2026-10-03).

**Ergebnis: GRÜN.** Die Einheit ist erzeugt, das Tor ist grün, keine Seite läuft
über.

Kein Lehrmittel-, Transkript- oder Artikeltext in dieser Datei.

## 1. Ablauf und Rollen

| Rolle | Modell | Was |
|---|---|---|
| Orchestrator | Opus 5.5 | Vorprüfung, `prinzip.json`, `kn.json`, Tor, Nachprüfung jedes Befunds, Bericht |
| Executor A | Opus | `herausforderung_A.json` (Phasen 4–6), nur Spur mit Medien |
| Executor B | Opus | `herausforderung_B.json` (Phasen 4–6), beide Spuren |
| Executor Set | Opus | `set.json` (Phase 7) |
| Executor Begleiter | Opus | `begleiter.md` (Phase 8), Marker nur über `begleiter-marker.mjs` |
| Gegenleser | Sonnet | Runde 1: fünf Lernende an den Heften, eine am Auftragsbogen, drei Lösungs-Audits, ein Sweep · Runde 2: vier Lernende · Runde 3: zwei Lernende |

**Vorprüfung (bestanden):** Freigabe-Zeile «freigegeben am 2026-10-03» · §9 nennt
keine Blockade · Ordner existierte nicht · sechs Kapiteldateien und `7.1_Medien.md`
vorhanden, alle genannten Seiten am Marker gefunden · sieben von acht Quellen mit
Karte **und** Archivtext; `q-221.2b-vertiefung-2` steht im Bauplan als «offen» →
Heft B hat in der Medien-Spur eine Vertiefung (E23, zulässig) · Datensatz
`nrlp_4j.json`: Kompetenztexte, Modi, Aspekte und die fünf SK von T2 stimmen mit
Bauplan §1 überein.

**Hinweis zum Auftrag:** Der Aufruf nannte als BAUPLAN `1.2.1_lernzeit_planen` und
als Ordner `2.2.1_meinungsfreiheit_reflektieren`. Auf Rückfrage vor dem Lauf hat
Pietro die 2.2.1 gewählt. Das war die einzige Rückfrage.

**Zweite Session im selben Arbeitsbaum:** Während des Laufs ist
`src/data/einheiten/1.2.1_lernzeit_planen/` (dazu `lm-17-1-sq3r.json`) von einer
anderen Session entstanden. Dieser Lauf hat nichts davon angefasst. Der Index auf
der Platte führt beide neuen Einheiten; in den Commit dieses Laufs geht der Index
**ohne** den Eintrag 1.2.1 (siehe §12).

## 2. Tor (letzter Lauf, nach der dritten Leserunde)

| Befehl | Ergebnis |
|---|---|
| `npm run build:einheiten-index` | 16 Sets geschrieben (src + public/nrlp) |
| `begleiter-marker.mjs --check` | 264 Marker · 0 abweichend · 0 unaufloesbar |
| `check-all.mjs 2.2.1_meinungsfreiheit_reflektieren` | GRUEN — keine Fehler (Ausgabe: `check-all.txt`) |
| `export-v42.mjs` | 15 Dateien: Heft A mit Medien, Heft B ohne und mit Medien, drei Dokumente «Lösungen», Auftragsbogen, Begleiter |
| `messen-v42.mjs` (Segoe Print) | Exit 0, 43 Seiten ohne Überlauf (Ausgabe: `messung.txt`). Seite 6 liegt in allen drei Heften bei Reserve 0 px, **kein** Überlauf — die Duldung aus E28 wird nicht gebraucht |
| `bestand-v42.mjs --pruefen` | OK — 26 Dokumente unverändert |
| `npm run build` | Exit 0; der `prebuild`-Abgleich hat keine Datei der Einheit geändert |
| `check-all` auf 1.3.1 v42, 2.3.1, 2.1.1 | GRUEN |

**Reparaturrunden:** eine vor den Gegenlesern (Überlauf), dann drei Leserunden mit
je einem neuen Tor. Erste Messung: Überlauf auf Heft A S. 3 (4 px) und S. 6 (8 px),
Heft B S. 6 (27 px) und S. 8 (14 px), Auftragsbogen S. 1 (73 px) und S. 4 (5 px),
Lösungen A S. 3 (29 px), Lösungen B mit Medien S. 3 (10 px). Behoben durch
Neuformulieren in den Daten. Auf dem Auftragsbogen fielen dabei — wie Bauplan §9
vorsieht — die zwei Reaktionen aus dem Protokoll; S. 4 passte erst, als eine Stufe
des KN («Argumentation», 3 Punkte) von 96 auf 80 Zeichen gekürzt war (`kn.json`,
zeichengleich nach `set.json` und Heft B).

## 3. Kapitel und Seiten

| Heft | Kapitel | Seiten | Wofür |
|---|---|---|---|
| A | 3.4 Migration, Integration und Rassismus | 116, 117–118 | LF1 (Kette Stereotyp, Vorurteil, Diskriminierung), LF2 (Schwelle der Strafnorm) |
| A | 18.3 Perspektivenwechsel | 418 | LF1 (Vorurteil, Ausgrenzung) |
| A | 7.1 Medien (ausserhalb der Crosswalk-Zeile, Bauplan §2) | 186 | LF2 (Meinungs- und Informationsfreiheit, Schranken), Glossar |
| A | 12.1 Werte | 296–297 | LF1 (Begriffe zum Thema der Quelle); nicht in `quellen_anker` des Hefts (höchstens drei) |
| B | 3.4 | 112, 115 | LF1; LF3 ohne Medien (S. 115, eine Seite); LF4 |
| B | 18.2 Werte, Normen, Moral und Ethik | 413–415 | LF2 |
| B | 18.3 | 419 | LF2 (Empathie) |
| B | 17.3 Argumentieren, 16.1 Diskussion | — | nur über die Methodenkarten; keine Fachaussage daraus |

Nicht verwendet: 3.4 S. 119 (Reserve), die Bildbeschreibung auf S. 115, das
Musterargument 17.3 S. 394, die Schätzung 12.1 S. 296.

## 4. Quellen (Karten lagen vor, keine Recherche)

| ID | Typ | Titel · Herausgeber · Datum | Ausschnitt | Länge | geprüft | Zugeständnis |
|---|---|---|---|---|---|---|
| `q-221.2a-pflicht` | Video | «Anti-Rassismus-Strafnorm: Warum Homosexuelle dagegen sind» · SRF 10 vor 10 · 2019-12-20 | 01:05–04:23 | 198 s | 2026-10-03 | Video statt Audio (Bauplan §9, Entscheid 2); Vorbericht zu einer entschiedenen Abstimmung; Player stoppt nicht von selbst |
| `q-221.2a-pflicht-ersatz` | Video | «Deutliches Ja zum Anti-Diskriminierungs-Gesetz» · SRF Tagesschau · 2020-02-09 | 00:00–03:50 | 230 s | 2026-10-03 | Gegenseite nur referiert — der Befund hat dann eine Stimme zur freien Rede (steht in der Lösung) |
| `q-221.2a-vertiefung-1` | Audio | «Strafnorm hat vor allem Signalwirkung» · SRF HeuteMorgen · 2020-01-14 | 00:00–02:14 | 134 s | 2026-10-03 | nur Begleittext, `erwartung` mit Vermerk «nicht gegengehört» |
| `q-221.2a-vertiefung-2` | Video | «Anti-Diskriminierungs-Gesetz: Das ändert sich» · SRF Arena · 2020-01-24 | 00:00–01:02 | 62 s | 2026-10-03 | derbes Beispiel im Beitrag — im Heft nur umschrieben |
| `q-221.2b-pflicht` | Video | «Nationalrat empfiehlt Demokratie-Initiative zur Ablehnung» · SRF Tagesschau · 2026-04-30 | 00:00–02:28 | 148 s | 2026-10-03 | Vorlage offen; Untertitel nennen die Redenden nicht |
| `q-221.2b-pflicht-ersatz` | Video | «Neue EKM-Studie: Einbürgerung als Privileg» · SRF Tagesschau · 2024-05-23 | 00:00–02:39 | 159 s | 2026-10-03 | anderer Anlass; «Teilhabe» kommt dort nicht vor (steht in der Lösung) |
| `q-221.2b-vertiefung-1` | Artikel | ««Wollen Sie hier im Bundeshaus Schweizermacher spielen?»» · SRF News · 2026-04-30 | Abs. 1–2 und 13–20 | 349 Wörter | 2026-10-03 | Titel für den Druck gekürzt |
| `q-221.2b-vertiefung-2` | — | — | — | — | — | **fehlt** (Bauplan: offen, braucht Swissdox) — nicht eingebunden |

Lösungen der Medien-Spur: `quelle_stand` 2026-10-03, geschrieben am Archivtext.

## 5. Spuren

- **Heft A: nur `mit_medien`.** 2.2.1 verlangt Rezeption mündlich und
  audiovisuell (`regel4`). Export, Dokument «Lösungen» und Begleiter tragen das
  ohne Sonderfall; die Arbeitsansicht zeigt die fehlende Spur als gesperrt (E28).
- **Heft B: `ohne_medien` und `mit_medien`.**

## 6. Selbstprüfung nach Phase 3 (phase-2-3 §3.7)

1. Fall neu — ja. 2. Lebensbereiche paarweise verschieden (Lehrbetrieb ·
Freundeskreis · Freizeit im Netz · Wohnen und Nachbarschaft) — ja. 3. Fall-Ausschluss:
vier Begriffe, je ≥ 5 Zeichen, kein Treffer in Stufen, `konzepte`, Karten und
Archiv-Ausschnitten (die Archivdateien nennen sie nur in ihrer eigenen Kopfzeile
«Ausschluss-Prüfung») — ja. 4. `modi_kn` = Vereinigung der drei KN-Typen — ja.
5. Abdeckung Modi — ja. 6. Modi der Hefte = Kompetenz-Ebene — ja. 7. SK:
A 1·5·6, B 7·6·12, KN 6·5·7, Werkschau 5·6·7 — ja. 8. Drei aktivierte
Spannungsfelder, wörtlich; `mehrdeutigkeits_pflicht` = `verbindlich` — ja.
9. Rubrik 2 + 2, alle Stufen ≤ 120 (längste 105) — ja. 10. Zählwörter: «drei»
steht dreimal und «dritt» einmal, alle im Wortlaut des Bauplans («drei Aussagen …
drei Sätze» im Produkttyp von Heft A, «drei Fragen» der Werkschau, «im dritten
Stock» im Fall) — kein Bezug auf eine dritte Herausforderung. 11. Szene 80 Wörter,
endet mit der Leitfrage — ja. 12. Gold-Probe — nichts übernommen. 13. Schlüsselmenge
wie Skelett; `pol_typ_verteilung.A` ohne `ohne_medien` (Heft A hat die Spur
nicht) — ja.

## 7. Abdeckung (kohaerenz.md §3)

| # | Befund | Lücke |
|---|---|---|
| A1 | Rezeption schriftlich: Auftrag A2 · Produktion mündlich: Heft B, Votum · Produktion schriftlich: Heft B, Stellungnahme · Interaktion mündlich: Auftrag A3 | keine |
| A2 | A: Rezeption audiovisuell → S. 3 (Video) · B: Stellungnahme, Votum | **A: Rezeption mündlich** nur freiwillig über Vertiefung 1 (Audio, nicht gegengehört) — wie Bauplan §8 |
| A3 | B ohne Medien: Rezeption schriftlich geübt · B mit Medien: Rezeption audiovisuell geübt | keine |
| A4 | Befundblatt (Rezeption schriftlich) · Schlichtungsgespräch (Interaktion mündlich) | keine |
| A5 | 2.2.1 in A, 2.2.2 in B | wie A2 |
| A6 | 1: A · 5: A, KN · 6: A, B, KN · 7: B, KN · 12: B | keine |
| A7 | `sk_anker` je SK in beiden Heften gesetzt | keine |
| A8 | Vergleichstabelle · Stellungnahme mit Votum · Befundblatt · Schlichtungsgespräch | keine |
| A9 | vier Lebensbereiche, sechs Paare verschieden | keine |
| A10 | A: Fachkorrektheit + Politisches Prinzip · B: Argumentation + Position / Werthaltung · Auftrag: alle vier | keine |
| A11 | mit Medien `lehrmittel_quelle` ≠ `position_gegenposition`; ohne Medien nur B | keine |
| A12 | A: Quelle und Ersatzquelle mit Karte und Archivtext | keine |
| A13 | Sweep: kein Fall-Begriff in Heften, Auftrag, Glossar | keine |
| A14 | siehe §8 | keine |

## 8. Vergleich mit Gold (kohaerenz.md §4)

**Fest (F1–F13): gleich.** Sechs Dateien, Template `heft_8page_v42`, acht Seiten je
Heft und vier im Bogen (Messung), Kern einmal und Spuren getrennt (`regel1`,
`regel4`), vier Leitfragen mit fester Funktion, fünf Schritte, Kriterien im
KN-Wortlaut (`regel6`), Begriffsnetz mit gleichem Zentrum und je zehn Knoten aus
dem Glossar (`regel7`, `regelGlossar`), Abschluss, Auftrag mit `produkte`, KN mit
drei Formen und `modi_kn` wie Gold (F10, kein Befund), Lösung zu jedem Feld
(`regelLoesungen`), Benennung nach E21, Sprache (Sweep ohne sicheren Verstoss).

**Hergeleitet (H1–H9):**

| | Gold 1.3.1 | diese Einheit | Herleitung |
|---|---|---|---|
| Modi A | Rezeption schriftlich | Rezeption mündlich · audiovisuell | Kompetenz 2.2.1 |
| Modi B | Rezeption schriftlich · Interaktion mündlich | Produktion mündlich · Produktion schriftlich | Kompetenz 2.2.2 |
| Modi Auftrag | Produktion mündlich · Produktion schriftlich | Rezeption schriftlich · Interaktion mündlich | Formel §7.2 |
| SK A · B · KN | 5·11·1 · 2·6·11 · 5·11·6 | 1·5·6 · 7·6·12 · 6·5·7 | fünf SK von T2, gemeinsame SK 6 |
| Produkt A | kommentierte Karte (Liste) | Vergleichstabelle (Tabelle + Fliesstext) | «analysieren» an zwei Orten, «reflektieren» |
| Produkt B | Tabelle mit Regeln + Gespräch | Stellungnahme (Fliesstext) + Votum | drei Verben von 2.2.2 |
| Auftrag | Blatt + Sprachnachricht | Befundblatt (Fläche) + Schlichtungsgespräch (Stationen) | Modi des Auftrags |
| Quelle / Raster | Artikel, Grafik | Video, Spalten Bild · Ton · Aussage · → Begriff | Modus der Kompetenz bzw. des Themas |
| drittes Kriterium | — | Politisches Prinzip | dominanter Aspekt Politik |

Modi des Auftrags, Produkttypen und SK sind alle verschieden von Gold.

## 9. Gegenleser (Sonnet) — Befunde und was daraus wurde

Jeder Befund ist am exportierten Text, an den Daten oder am Archivtext
nachgeprüft, bevor er Auftrag wurde. Kürzel nach `gegenleser.md` §5.

**Runde 1 (nach dem ersten grünen Tor ohne Überlauf)**

| Gegenleser | Befunde | übernommen (E) | nicht übernommen |
|---|---|---|---|
| Lernende a, Heft A | 3 + 28 | Prüffragen nirgends ausgeschrieben, «vierte Zeile» mehrdeutig · «drei Pfeile» bei zwei · Spaltenname «am Tisch» / «im Gespräch» · Beispiel S. 6 in sich widersprüchlich · Vertiefung 2 «drei Handlungen» bei vier · LF3-Frage nicht auffindbar | R: SuK/Ges, Checkliste ✔ ☐, «Teil 1–3» · V: Abgabe kürzer als Checkliste, Leitfrage · S: Karte «höchstens fünf Wörter pro Zelle» gegen «wörtlich» |
| Lernende b, Heft A | 3 + 30, dazu 47 unverstandene Wörter | wie oben; dazu Auftrag über dem Raster («Zeitmarke» ohne Spalte) | Q: Sprecher ab 02:58 im Untertitel unbenannt; drei Namen für die Strafnorm im Lehrmittel · V: «obwohl ich im ersten Lehrjahr bin» hat keinen Stoff im Heft (Leitfrage des Bauplans) |
| Lernende a, Heft B ohne | 3 + 22 | Stellungnahme überladen · Beispiel S. 6 zeigt nur eine Sichtweise · S. 115 trägt fast nur eine Seite → Strategie ergänzt · Denkhilfe «Eine Zeile genügt» | S: «acht Diskussionsregeln», fünf genannt; «drei Argumente» · Q: fremde Bildbeschreibung auf S. 115 |
| Lernende a, Heft B mit | 3 + 23 | Raster-Auftrag · wer die «Runde» ist und wofür die Kriterien gelten · Alter des Kollegen in der Situation · Strategie LF4 gegen Satzanfänge | R: ein Feld auf S. 7 für Text und Stichwortzettel · V: Titel der QR-Adresse |
| Lernende b, Heft B mit | 3 + 44, dazu 16 Wörter | wie oben | V/R wie oben |
| Lernende, Auftragsbogen | 3 + 30 | Titel «Empfehlung aushandeln planen» → Schritt-Labels als Nomen · Ort für Schritt 01, 02, 05 · worüber die Empfehlung geht · Lager ohne Grund · Indikator Fachkorrektheit | V: Stationen und Hinweis von A3 (Bauplan, wörtlich); anderer Fall als die Hefte (Absicht) · R: «Möglich: Partner- oder Gruppenarbeit» neben «Zu dritt» |
| Audit A | 19 | «nicht strafbar (S. 117–118)» als Lehrmittelaussage an vier Stellen → überall die Fassung des Bauplans (Schwelle nicht erreicht, kein rechtliches Urteil) · Stimme bei 03:20 nicht «Befürworter»/«Betroffener» · «Sonderrecht» bei 02:37 statt 02:15 · Ersatzquelle: Hinweis auf anderen Befund · Vertiefung 1 ohne eigene Folgerung · LF1-Lösung zu nah am Lehrmittel · Glossar «Verallgemeinerung» → Herkunft `heft`, «Diskriminierung» neu gefasst | Verbindung Herabsetzung → Ausgrenzung im Netz (Setzung des Hefts, bleibt) |
| Audit B ohne | 12, kein falscher | «hat alle Pflichten» gestrichen · «entscheidet die Gemeinde» → vollzieht nach Vorgaben · Deutung der Bildlegende gekennzeichnet · Seitenangaben nur am Belegten · Glossar «Einbürgerung» | — |
| Audit B mit | 7, kein falscher | «Straffällige» bei 01:08 → Zuordnung 00:45 / 01:08 · «soll früher möglich sein» gestrichen · Fundstelle Abs. 1–2 · Glossar «Bürgerrecht» | Spalte «Bild» nicht belegbar (offen markiert, siehe §10) |
| Sweep | 0 sichere, 7 Zweifelsfälle | — | alle V: `methoden[].fuer` des Platzhalters ist Konstante; «Sie» im Begleiter sind Wiedergaben der Hefttexte; «Mitarbeiter» ist eine bestimmte Person; der Spott der Situation ist Wortlaut des Bauplans |

Nach Nachprüfung weggefallen: «Kap. 12.1 steht nicht auf der Lehrmittelseite»
(Artefakt des Pakets), «Lehrmittelseiten der Methodenkarten fehlen» (Paket),
«Welches Beispiel von Ausgrenzung» als falsch (der Ausschnitt trägt es bei 01:51;
die Frage wurde dennoch deutlicher gestellt).

**Runde 2 (nach den Korrekturen):** Heft B ohne und mit Medien: Die Stellungnahme
liess sich schreiben (118 und 122 Wörter). Übernommen: unklarer Satzanfang bei
LF2, «Interesse» in einer Strategie erklärt, Glossar «Landessprache» (vom
Orchestrator direkt korrigiert, eine Zeile). Heft A: Zeile «Gedeckt?» in Schritt
02 und 04 verschieden zugeordnet, Rasterbeispiel mit fünf Angaben für vier
Spalten, LF3 («berichtet» statt «zeigt») — übernommen. Auftragsbogen: nichts mehr
übernommen (Rest V/R).

**Runde 3 (letzte, nach den Korrekturen der Runde 2):** Heft B, S. 2 und 8:
«nichts Hartes». Heft A, S. 3 und 5: Tabelle und drei Sätze liessen sich
herstellen; **offen bleibt ein Punkt** (siehe §11, Nr. 1). Danach wurde kein
sichtbarer Text mehr geändert.

**Zeitsummen der Lernenden gegen den Seitenplan (Schätzungen):** Heft A 115–134
Min. (Profil a), 210 Min. (Profil b) · Heft B 95–161 Min. (Profil a), 145–245 Min.
(Profil b) · Auftragsbogen 42–60 Min. Der Vorschlag im Begleiter rechnet mit drei
Lektionen je Heft; für Lernende mit Deutsch als Zweitsprache reicht das nach
diesen Schätzungen nicht.

**Was kein Gegenleser prüfen konnte:** Bild und Ton der Videos, das Audio von
Vertiefung 1, das Seitenbild.

## 10. Unbelegt, nicht geprüft

- **Spalte «Bild» und Zuordnung der Stimmen** in den Rasterlösungen beider Hefte:
  aus den Untertiteln erschlossen, nicht am Bild gesehen. Steht so in den Lösungen.
- **Zeitmarken** aller Videos stammen aus den Untertiteln (Blöcke von rund 20 s).
- **Vertiefung 1 von Heft A:** nicht gegengehört (nur Begleittext).
- **Ob der Pausenraum als öffentlich gilt:** lassen die Seiten offen; LF2 von Heft
  A fällt kein rechtliches Urteil.
- **«Interesse»** als Begriff und die Zuordnung von Werten zu den zwei Stimmen
  (Heft B, LF2): Fallüberlegung, in der Lösung so gekennzeichnet.
- **«Seit 1. Juli 2020»** (Erwartung Vertiefung 2, Begleiter): aus der Karte und
  Bauplan §7, nicht am Gesetzestext. **63,1 % Ja** im Begleiter: aus dem
  Archivtext der Ersatzquelle (Abs. 3).
- **Stand der Initiative** (Heft B): «offen, 03.10.2026» aus Bauplan §7, nicht an
  der Quelle des Parlaments geprüft.
- **Seitenangaben der Methodenkarten** (17.2, 19.2, 16.1, 17.3): aus den Karten.
- **QR-Seite mit Quellen-ID mit Punkt**, Wiedergabe auf dem Handy und im
  Schulnetz: nicht geprüft (siehe §12, Dev-Server).
- **Word-Dateien:** nur erzeugt, nicht geöffnet.

## 11. Offen nach drei Leserunden

1. **Heft A, Zeile «Gedeckt?».** Schritt 02 trägt sie für die Aussage vom Tisch
   ein (aus LF2), Schritt 04 prüft sie mit LF4 für alle drei Aussagen; LF4 selbst
   fragt nur nach dem Spott. Der Leser der Runde 3 nennt das als einzigen harten
   Punkt: Er weiss nicht, wann er die Zeile füllt, und das Kriterium für «gedeckt»
   steht erst in Schritt 04 in der Klammer. Wählt jemand in Schritt 02 die Aussage
   zum Gesetz, steht der Spott — der Gegenstand von LF4 — nicht in der Tabelle.
   Beides folgt aus dem Zuschnitt des Bauplans (eine Aussage aus dem Gespräch, zwei
   aus der Quelle).
2. **Beispiel auf S. 6 von Heft A:** «Herabsetzung» und «gedeckt: ja» stehen in
   derselben Spalte. Das ist der Punkt der Einheit (herabsetzend und doch nicht
   verboten), wird aber von zwei Lesenden als Widerspruch gelesen.
3. **Heft B ohne Medien:** S. 115 trägt die Sicht «dazugehören» nur über die
   Begründungspflicht und die Bildlegende; die Lösung kennzeichnet das als Deutung.
4. **Auftragsbogen:** Schritt 01 und 02 haben kein eigenes Feld (Stichworte auf
   A2); die Stationen von A3 und der Hinweis darüber sagen Verschiedenes über den
   Ablauf (beide wörtlich aus dem Bauplan).

## 12. Entscheide, die sonst ein Mensch getroffen hätte

| Entscheid | Grund | verworfen |
|---|---|---|
| `prinzip.quellen_anker.chapters` ohne 17.3 und 16.1 | liefern nur Methodenkarten; keine Lösung zitiert sie | 17.3 wegen der Herleitung des Produkts aufnehmen |
| Wortlaut der vier Kriterien; Stufen ohne Stoff («Recht und Grenze» statt eines Fachworts) | Stufen wandern in beide Hefte und den Auftrag | Grundrecht/Schranke in den Stufen nennen |
| Stufe «Argumentation», 3 Punkte, auf 80 Zeichen gekürzt | einzige Möglichkeit, A4 des Bogens ohne Überlauf zu setzen | Indikatoren kürzen (wirkungslos, gemessen) |
| Schritt-Labels des Auftrags: «03 Befundblatt zum Protokoll», «04 Schlichtungsgespräch» statt «Protokoll auswerten», «Empfehlung aushandeln» | der Bogen hängt «planen» an das Label; phase-7 §4.1 verlangt ein Nomen. Umformulierung, die Produkte des Bauplans bleiben | Labels des Bauplans mit schiefem Seitentitel |
| Zwei Reaktionen aus dem Protokoll des Auftrags gestrichen | Bauplan §9 nennt genau das für den Fall, dass es eng wird | Regel kürzen (verboten) |
| Wortlaut der Regel der Spielgemeinschaft erfunden | Bauplan verlangt eine vage Regel im Wortlaut | — |
| Heft A: Lernende wählen eine der zwei Aussagen vom Tisch | den Spott vorschreiben nähme die Einordnung vorweg | Spott vorgeben (siehe §11 Nr. 1) |
| Heft A: Tabelle mit Zeile «Wortlaut» und vier Prüffragen; Spaltenköpfe «Aussage im Gespräch», «Aussage 1/2 der Quelle» | Beispiel- und Lösungsbild brauchen denselben Aufbau | — |
| Heft B: LF3 ohne Medien fragt nach der Zuordnung der Aussagen von S. 115 zu den zwei Stimmen | S. 115 enthält keine zwei Sichtweisen (phase-5 §3) | dieselbe Frage wie mit Medien |
| Heft B: Begriffsnetz mit «Dilemma» statt «Standpunkt» | zehn Knoten; trägt das `detail` «Wertekonflikte» | — |
| Heft B: Beispielbild sagt im Titel, dass nur eine von zwei Sichtweisen gezeigt ist | Bauplan verlangt die gekürzte Fassung, zwei Lesende wurden fehlgeleitet | zweite Sichtweise in den Block (kein Platz, 0 px) |
| `zahlen_tabelle` leer in A, B und Auftrag | Bauplan: keine Fallzahlen | Faktenzeilen |
| Begleiter: Lücke «Rezeption mündlich» offen benannt, Rat, Vertiefung 1 im Plenum zu hören | Abdeckung A2 | — |
| Index im Commit ohne den Eintrag `1.2.1_lernzeit_planen` | der Ordner gehört einer anderen Session und ist nicht Teil dieses Commits; ein Index-Eintrag ohne Ordner bräche einen sauberen Checkout | Index wie auf der Platte committen |
| Glossar «Landessprache» und die gekürzte KN-Stufe vom Orchestrator direkt in `set.json` bzw. Heft B nachgezogen | je eine mechanische Zeile | Executor neu wecken |

**Ausnahmen laut Bauplan §9, so ausgeführt:** Video statt Audio als Quelle von
Heft A · Kap. 7.1 S. 186 ausserhalb der Crosswalk-Zeile · Stellungnahme statt
Kommentar · Quellen-IDs mit `.2` · kein `lehrgaenge`.

## 13. Fehler in Skill, Skript, Renderer (nicht repariert)

Bekannt aus den Läufen 211 und 231 und hier wieder aufgefallen (nicht neu
gemeldet): «Wissensecke II» auf S. 4, «Wortlaut Kompetenznachweis» und «Stufe» auf
S. 5, Checkliste mit ✔ und ☐, Du-Form in der Bedienzeile des Bogens,
`lm-16-1-diskussion` «acht Regeln», `lm-17-3-…` «drei Argumente», Karte
`hko-quelle-raster` mit «sehen, hören» und Zeitmarke auch ohne Medien, Skelett
«Begriff aus LF1» gegen phase-5 §8, fehlendes Budget für gemischte Produktbilder.

Neu:

1. **`gegenleser.md` / `phase-9-tor.md`:** Die Seitenzuordnung im Dokument
   «Lösungen» ist nirgends beschrieben; LF4 und die Vertiefungen stehen auf S. 3,
   LF3 auf S. 2. Ein Überlauf auf «Lösungen S. 3» wird sonst am falschen Feld
   behoben (hier in beiden Heften geschehen).
2. **`check-v42`:** kein Budget für Tabellenzellen ausser der ersten Spalte und
   keines für `raster_zeilen`; kein Budget für `erwartungshorizont.beispiel_pol_*`
   und `erwartung`, obwohl genau sie «Lösungen S. 3» füllen.
3. **Auftragsbogen, Renderer:** hängt bei `form: "spur"` das Wort «planen» an das
   Schritt-Label; Labels als Tätigkeit («Empfehlung aushandeln») ergeben einen
   schiefen Titel. Die Bauplan-Vorlage sollte das Nomen verlangen.
4. **Auftragsbogen A4:** Sechs Stufen über rund 95 Zeichen brechen um; das
   Budget «≤ 120 je Stufe» reicht für A4 nicht, wenn mehrere Stufen zweizeilig sind.
5. **`phase-5-spuren.md` §9:** schreibt für das Beispiel der Rezeptionskarte
   «(Beispielwert)» und «→ hier ein Begriff aus LF1» vor; fünf Lesende lesen das
   als Platzhalter.
6. **Karte `lm-17-2-stichwortnotizen`:** «höchstens fünf Wörter pro Zelle» steht
   auf S. 6 neben einer Tabelle, die den Wortlaut verlangt.
7. **Methodenkartei:** keine Karte für das Sehen und Hören einer Quelle (Raster
   Bild · Ton); `hko-quelle-raster` trägt ein Artikel-Beispiel.
8. **Bauplan-Vorlage:** kennt keine Kollision zweier Baupläne zur selben Nummer
   (hier 2.2.1 zweimal) und keine Regel für den Index, wenn zwei Sessions im
   selben Arbeitsbaum arbeiten.
9. **`check-einheiten`** ohne `--strict` zeigt, solange `set.json` fehlt, keine
   Befundliste (phase-4 §13 verspricht eine).

## 14. Für die Abnahme

Vor dem Druck gegensehen und gegenhören: Zeitmarken, Bild und Sprecherzuordnung
der vier Videos (Heft A: Quelle, Ersatzquelle, Vertiefung 2; Heft B: Quelle,
Ersatzquelle) und das Audio von Vertiefung 1. Dazu ein Blick auf S. 6 der drei
Hefte am Papier (Reserve 0 px).
