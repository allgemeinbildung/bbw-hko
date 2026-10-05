# Nachtrag — 3.3.1_kaufvertrag_beurteilen (Abschlussrunde, 5. Oktober 2026)

Grundlage: `BERICHT.md` dieses Laufs und `abschluss-brief.md` des Orchestrators.
Geändert wurden nur der Ordner der Einheit, die acht Karten `q-331a-*` / `q-331b-*`
und diese Datei. Kein Commit, kein Index-Build. `set.json` bleibt `"entwurf"`.

Letzter Stand nach der letzten Änderung:

- `node scripts/check-all.mjs 3.3.1_kaufvertrag_beurteilen` → **GRUEN — keine Fehler.**
- `export-v42` + `messen-v42` → Exit 0, kein Überlauf (56 Seiten). Knapp: Auftragsbogen
  A1 4.6 px, Hefte S. 8 4.2 px, Lösungen A S. 4 6.4 px, Lösungen B mit Medien S. 3 8.7 px.
- `begleiter-marker --check` → 275 Marker · 0 abweichend.

## 1. Sachfehler und Rechtsangaben (Vorrang a)

Alle Artikel am Fedlex-Text der konsolidierten Fassung gelesen (OR, SR 220, Stand
1. Oktober 2026; Abruf 5. Oktober 2026, Datei der Fassung `20261001`).

| Punkt | Was das Gesetz sagt | Was geändert wurde |
|---|---|---|
| **Marktstand (Karte `lm-1-3-rechtsfall`)** | OR Art. 40c: kein Widerrufsrecht, wenn der Kunde «a. die Vertragsverhandlungen ausdrücklich gewünscht hat; b. seine Erklärung an einem Markt- oder Messestand abgegeben hat» — **zwei getrennte Fälle**. Die Karte («am Marktstand gibt es keinen Widerruf») ist also **rechtlich richtig**; ungenau ist das Lehrmittel S. 60, das beide Fälle in einen Satz zieht, und falsch ist nur die Fundstelle «S. 60» der Karte. Der Befund im Bericht war umgekehrt gestellt. | Heft A überschreibt das Beispiel der Karte (`methoden[].beispiel`): die Zeile «Rechtslage» stützt sich jetzt auf die 100-Franken-Grenze, die auf S. 60 wörtlich steht — nichts Gedrucktes widerspricht mehr dem Lehrmittel. Lösung LF1 nennt Art. 40c mit beiden Fällen. Begleiter: neuer Warnkasten «Markt- und Messestand». Karte selbst: Vorschlag in §6. |
| **Form des Widerrufs** | OR Art. 40e Abs. 1: «an keine Form gebunden», Nachweis beim Kunden; Abs. 4: Frist gewahrt mit Mitteilung oder Postaufgabe am letzten Tag. S. 60 («muss … per eingeschriebenem Brief») ist überholt. | Lösung LF1 Heft A, Erwartung Vertiefung 1, Erwartungshorizont des Auftrags und Begleiter sagen jetzt eindeutig: formfrei; Einschreiben dient dem Beweis. «Beide Fassungen gelten» ist gestrichen. |
| **Fristbeginn im Auftrag** | OR Art. 40e Abs. 2: Frist läuft erst, wenn der Kunde zugesagt **und** die Angaben nach Art. 40d (Widerrufsrecht, Form, Frist, Adresse; in Textform) erhalten hat. Im Fall also frühestens mit dem Vertragsdoppel von gestern, nicht mit der Zusage vor neun Tagen. | Der Auftrag sagt jetzt «die Frist rechnen Sie **vorsichtig** ab der Zusage» (bleibt bei fünf Tagen, ist aber als sichere Rechnung gekennzeichnet). Erwartungshorizont und Begleiter (Coaching «Ab wann die Frist läuft») nennen die Rechtslage und lassen die spätere Rechnung gelten, wenn sie begründet ist. |
| **Rückabwicklung nach Widerruf** | OR Art. 40f Abs. 1: empfangene Leistungen zurück. | Erwartungshorizont und Begleiter nennen den Artikel statt «Fallüberlegung». |
| **Kein gesetzliches Widerrufsrecht im Onlinehandel** | OR Art. 40b nennt Arbeitsplatz/Wohnräume, öffentliche Verkehrsmittel/Strassen/Plätze, Werbeveranstaltung, Telefon — keinen Onlinekauf. Bestätigt von ch.ch (Abs. 9) und SECO («kein allgemeines Widerrufsrecht bei Internetkäufen»). | Heft A stellt «Ausweg beim Shop» durchgehend als freiwilliges Entgegenkommen dar; das war richtig. Hinweis zum Lösungsbild nennt jetzt Art. 40b. Glossar «Widerrufsrecht» trennt Gesetz und freiwillige Frist. |
| **Vertragsschluss im Onlineshop (S. 60 gegen S. 63)** | Kein Widerspruch: S. 60 meint die Bestellung auf ein verbindliches Angebot (OR Art. 7 Abs. 3: Auslage mit Preis gilt in der Regel als Antrag); S. 63 den Webshop, dessen Darstellung in der Regel kein Antrag ist. Ob die Bestätigungs-E-Mail die Annahme ist, entscheidet das Gesetz nicht (UWG Art. 3 Abs. 1 Bst. s Ziff. 4 verlangt nur die unverzügliche Bestätigung der Bestellung); es hängt von Wortlaut und Geschäftsbedingungen ab. | Lösung LF1, Hinweis zum Lösungsbild und Begleiter erklären das so. Prüffrage 1 bleibt «offen» zulässig; Lösungsbild Zeile 1: «an mein Angebot gebunden; Vertrag, sobald der Shop annimmt (E-Mail: offen)». Die Aussage, die Bestätigung sei «allein noch keine Annahme», ist Auslegung und so gekennzeichnet. |
| **Zwei oder drei Mängelrechte** | OR Art. 205 Abs. 1: Wandelung oder Minderung. Art. 206 Abs. 1: zusätzlich Ersatz bei «einer bestimmten Menge vertretbarer Sachen». Keine Nachbesserung im Kaufrecht. | Lösung LF1 Heft B, Zeile «Begriffe» (mit Medien), Erwartung Vertiefung 1 und Begleiter («Zwei oder drei Forderungen?») sagen: Juristin nennt die zwei Rechte, die immer gelten, das Lehrmittel alle drei; beides stimmt. Dass ein neues Seriengerät «vertretbar» ist, ist Auslegung und so gekennzeichnet. |
| **Gewährleistungsfrist** | OR Art. 210 Abs. 1: zwei Jahre ab Ablieferung; Abs. 4: bei Konsumkauf vom Gewerbe nicht unter zwei Jahre (gebraucht: ein Jahr) kürzbar. Art. 199: Ausschluss ungültig bei arglistigem Verschweigen. Art. 201 Abs. 3: später entdeckte Mängel sofort anzeigen. | Lösung LF1 Heft B nennt Art. 201, 205, 206, 210. Art. 199 steht im Begleiter beim KN (Frage 2) als Hinweis für die Lehrperson. Hinweis zum Lösungsbild B: ob der Garantieschein die gesetzlichen Rechte ersetzt oder nur ergänzt, hängt von seinem Wortlaut ab; der Fall sagt es nicht. |
| **Handlungsfähigkeit mit 17** | ZGB Art. 13, 14, 19 Abs. 1, 323 Abs. 1 (Fedlex, Stand 1. Juli 2026). Die Faustregel «zwei Monatslöhne» steht im Lehrmittel (Kap. 1.3, S. 27), nicht im Gesetz. | Glossar «Handlungsfähigkeit»: «ab 18; vorher mit Lohn, Taschengeld oder Ja der Eltern». Sonst unverändert. |
| **Karte `lm-17-4-geschaeftsbrief`, `hko-gezielt-suchen`** | — | Nicht überschreibbar (`merk`, `fehler`, `ankommt`). Stehen gelassen; Vorschläge in §6. «Nach zwanzig Minuten» ist eine Redensart der Karte, keine Unterrichtszeit. |

Weitere geprüfte Fakten (Abruf 5. Oktober 2026):

- `q-331a-pflicht` (ch.ch): im Browser geöffnet, «Alle öffnen» geklickt; Text und
  Absatzzählung 1–16 stimmen zeichengleich mit dem Archiv überein; die Seite trägt
  weiterhin kein Datum. Abs. 24 (ausserhalb des Ausschnitts) nennt ausdrücklich, dass
  Geschäftsbedingungen nur eine Reparatur vorsehen dürfen.
- `q-331a-pflicht-ersatz` (Konsumentenschutz): erreichbar, «Zuletzt aktualisiert:
  24.02.2026», Kernaussagen stimmen.
- `q-331a-vertiefung-2` (SRF Espresso): erreichbar, 29. September 2022, Inhalt stimmt.
- `q-331b-vertiefung-2` (SECO): erreichbar, Abschnitt Sachmängel stimmt, ohne Datum.
- Fedlex-Adresse beider Rechtstext-Karten: HTTP 200 (lädt den Text nur im Browser).
- Beide Videos: SRG-API liefert die Segmente ohne Sperre (Quelle 173 s, markIn 709280;
  Ersatz 643 s). Zeitmarken des Hefts (00:50, 02:16) stimmen mit den Untertiteln im
  Archiv; die Abweichung 00:49/02:15 steht nur im Bauplan (nicht angefasst).
- Alle acht Karten: `sachlage_geprueft` auf 2026-10-05; `quelle_stand` der Lösungen ebenso.

## 2. Befunde aus dem Bericht («Offen nach drei Runden»)

| Befund | Stand |
|---|---|
| Heft A S. 5 gegen S. 8 (Abgaben gegen Checkliste) | **behoben**: dritte Abgabe «Sie geben das ganze Heft ab; was sonst dazugehört, zeigt die Checkliste (S. 8)» (deckt sich mit dem Begleiter). |
| Heft A S. 8 gegen S. 3 («vier Zeilen gefüllt») | **behoben**: «Raster S. 3: keine Zeile leer, jede mit Fundstelle» (stimmt in beiden Spuren). |
| Heft A, «anfechtbar» ohne Ziel | **behoben**: Prüffrage 3 heisst «Ausweg laut Gesetz (Widerruf, anfechtbar)?»; LF1 «Ins Produkt» schickt beides dorthin; Lösungsbild Zeile 3 nennt «nicht anfechtbar» als Folgerung. Schritt 01 verlangt jetzt, die Tabelle zu zeichnen; Schritt 03 sagt, woher die Rechtslage je Prüffrage kommt. |
| Heft A S. 4 «gekauft ist gekauft» | **umformuliert** als Sprichwort und Haltungsfrage (SK 5); ein Lehrmittelbezug ist nicht nötig. |
| Glossar «Widerrufsrecht» (zwei Bedeutungen) | **behoben**: «Gesetz: nur Haustür- und Telefonkauf, 14 Tage. Shops nennen freiwillige Fristen auch so.» |
| Glossar «Das Gesetz lässt Abweichungen oft zu» | **behoben**: «… gehen vor, wo kein Gesetz zwingend ist.» Dazu «Rechtslage: Was Gesetz und Vertrag zum Fall sagen». |
| Heft B mit Medien: Video nennt keinen Garantieschein | **entschärft**: LF4 nennt den Garantieschein «eine eigene Regel des Geschäfts»; Quer-Check 1 fragt, ob das Raster zeigt, dass Geschäfte vom Gesetz abweichen dürfen (00:35 bzw. S. 62 Abs. 2). In Runde 2 beantwortbar; der Schluss vom Video (Geschäftsbedingungen) auf den Garantieschein bleibt ein Schritt der Lernenden. |
| Spalte «Bild» beim Studiogespräch | **stehen gelassen** (Spalten aus dem Bauplan; der Auftrag sagt, dass Zeitmarke und «wer zu sehen ist» genügen). |
| Heft B S. 5: «2 Belege» gegen «einem Beleg» | **behoben**: «2 Punkte: Forderung mit mind. einem Beleg. 3 Punkte: dazu Einwand beantwortet, Folge». |
| Karte 3B gegen S. 5 | **behoben** im `tun`: «Antwort auf den Einwand: Stichworte daneben, dann im Gespräch.» Der Merksatz «Drei Argumente …» ist Kartentext (§6). |
| Preisnachlass/Rücktritt neben Minderung/Wandelung | **stehen gelassen**: das Glossar der Spur verbindet sie ausdrücklich. |
| Ein Schreibfeld für alles (S. 7) | **stehen gelassen** (Renderer). Schritt 01 nennt jetzt den Ort; Schritt 05 nennt den Schluss des Briefs; die zweite Abgabe sagt, wer die Antwort schreibt. |
| Beispiel S. 6 Heft B zu kurz | Titel sagt jetzt «Gekürztes Beispiel (halbe Länge; ohne Schluss, Antwort, Notiz)». |
| Auftragsbogen «Beleg» | **behoben**: «Beleg (etwa Postquittung)»; zuoberst «Entscheid als Ich-Satz, Antwort an den Onkel». |
| Auftragsbogen, 100 Franken | **teilweise**: der Heft-Bezug nennt jetzt «Widerruf: wann er gilt (S. 2; Kap. 2.4, S. 60)». Die Zahl selbst steht nicht auf dem Bogen (so gewollt: der Bogen braucht Heft und Lehrmittel). |
| «ohne Fachbegriffe» gegen «Begriffe und Regeln» | **behoben**: «in einfachen Worten; Fachbegriffe übersetzen Sie»; Erwartungshorizont und Begleiter angepasst. Abweichung vom Wortlaut des Bauplans. |
| Persona «1. Lehrjahr» | **behoben**: `persona.beruf` = «Lernende/r EFZ» in beiden Heften, Auftrag, KN und `prinzip.persona_neutral` (vom Tor zugelassen). Der Begleiter nennt weiterhin, in welchem Lehrjahr T3 je Lehrgang liegt. |
| Zeitmarken Bauplan gegen Heft | Heft stimmt mit den Untertiteln; Raster-Zeile 3 jetzt 00:55 (dort fällt die Aussage), Spanne 00:50–01:02. |
| Nur je ein Lösungs-Audit pro Heft | **nachgeholt**: vier Audits, je Heft und Spur (§3). |

## 3. Gegenleser

Modell Sonnet, höchstens drei gleichzeitig. Profil b entfällt (Entscheid 5. Oktober).
Pakete mit `seitentext.mjs`, den genannten Lehrmittelseiten und den Archivausschnitten;
der Text der QR-Seite fehlte wieder (kein Dev-Server).

**Runde 1** (ganzes Dokument): Lernende a an Heft A ohne, A mit, B ohne, B mit;
Bogen-Leser; Lösungs-Audit A ohne, A mit, B ohne, B mit.

| Gegenleser | übernommen | nicht übernommen |
|---|---|---|
| Heft A ohne (3 Stellen, 43 Hänger, 127 Min.) | Prüffrage 3 umbenannt; Glossar «Rechtslage»; Beispiel der Karte ohne «Art. 40c» (das Lehrmittel der Lernenden kennt den Artikel nicht) | S. 60 gegen S. 63 (bleibt offene Frage des Falls, gewollt); Stufe 3 «neuer Fall», SuK/Ges, «Wortlaut Kompetenznachweis», leere S. 7, Karten SQ3R/Gezielt suchen (R/S) |
| Heft A mit (3 Stellen, 27 Hänger, 124 Min.) | Glossar «Widerrufsrecht»; Schritte 01 und 03 | «mit dem Handy bezahlt» gegen «Telefonverträge» (Verwechslung möglich, nicht geändert); Kriterien (R) |
| Heft B ohne (3 Stellen, 31 Hänger, 128 Min.) | Schritt 05 mit Schluss; Titel des Beispiels; Indikator | Wortlaut des Garantiescheins fehlt (Falldesign; Lösung benennt es); «aufbewahren, ohne zu benutzen» gegen täglichen Gebrauch (gewollte Spannung); Merksatz 3B (S) |
| Heft B mit (3 Stellen, 38 Hänger, 132 Min.) | zweite Abgabe («Antwort der Partnerperson»); Kurzbeschrieb der Karte Vertiefung 1 («Serienware» statt «Gattungsware») | Spalte «Bild»; ein Schreibfeld; URL mit 3.3.1 (V) |
| Auftragsbogen (3 Stellen, 26 Hänger, 55 Min.) | «Antwort an den Onkel» in Schritt 04 | 100 Franken nur über Heft/Lehrmittel; «Ende Ziel 2 Minuten», «Fremd» (R); Stufe 3 (V) |
| Audit A ohne (11) / A mit (7) | Form des Widerrufs eindeutig; Art. 40c mit beiden Fällen; Lösungsbild Zeile 1 und 3; «wesentlicher Irrtum» im Begriffsnetz; Befund «keinen Rücktritt» statt «keinen Ausweg»; Daten | Faustregel als Lehrmittelregel (so im Lehrmittel); Schema S. 58 gegen Vorauszahlung (gering) |
| Audit B ohne (11) / B mit (13) | Zeitmarke 00:55; Ersatzquelle 00:57/01:03; Sprecher bei 04:01 als offen; Art. 206 als Auslegung gekennzeichnet; «nicht erkennbar» in Vertiefung 1; Beleg ch.ch/SECO genau gefasst | «Vertrag geht vor» (steht so auf S. 62; Vorbehalt im Hinweis zum Lösungsbild); Antwort 1 «bestehen, Mindestziel Reparatur» (gewollter Pol); Wortzahl des Musterbriefs (ein Audit zählte 85, eines 90; mit Skript nachgezählt: 90) |

**Runde 2** (zuletzt gelesen, danach nichts mehr geändert): Heft A (Paket ohne Medien),
Heft B (Paket mit Medien), Auftragsbogen — je nur die überarbeiteten Stellen.
Ergebnis: keine Stelle blockiert. Offen danach:

- **Heft A:** Zu Prüffrage 3 kommen zwei Zuträger (LF1: Widerruf und «anfechtbar»;
  Raster: eine Zeile). Schritt 03 nennt für Frage 3 nur das Raster — eine Leserin weiss
  nicht, ob eine oder zwei Eintragungen. Schritt 01 nennt drei Spalten, das Beispiel
  zeigt vier (Prüffrage als erste). Für Prüffrage 4 ist die «Fundstelle» der Text der
  Situation; das Heft sagt es nicht.
- **Heft B:** «Antwort» meint zweierlei (der Partnerperson; auf «nur Reparatur»).
  Stufe 3 «Einwand beantwortet» stützt sich auf den erwarteten Einwand in den Stichworten.
  Was «zwingend» im Glossar heisst, zeigen nur die Vertiefungen.
- **Auftragsbogen:** «Nach der Frist?» ist sehr knapp; ob der Tag der Zusage mitzählt
  und ob «abgeschickt» genügt, steht nicht da (Art. 40e Abs. 4: Postaufgabe am letzten
  Tag genügt — steht im Begleiter nicht ausdrücklich). «Beleg» in Schritt 02 (für die
  Forderung) und Schritt 04 (für den Versand).

**Sweep:** der Sonnet-Sweep kam wegen des Nutzungslimits nicht zustande. Ersatzweise
mit Skript geprüft: kein «ß», keine Platzhalter, keine geraden Anführungszeichen, keine
Doppelwörter, keine Du-Anrede in den JSON-Dateien, Persona überall gleich. Gesperrte
Wörter nach `sprache.md` prüft `check-all` («Sprache»: ok). Kein Leser hat die
Transliterationsliste von Hand durchgesehen.

Nicht noch einmal gelesen: die Lösungen nach den letzten Korrekturen aus den Audits
(nur Tor und Messung liefen danach).

## 4. Gegenhör-Liste für Pietro

Ein Durchgang je Video; Zeitmarken ab Beginn des Segments. Alle Angaben stammen aus
den Untertiteln (SWISS TXT), **nichts ist gehört**.

**A. Quelle Heft B — `q-331b-pflicht`**, SRF Kassensturz, 19. Mai 2026, 02:53
`https://www.srf.ch/play/embed?urn=urn:srf:video:b348bb7b-4e77-4937-8f6a-af2612460f88&subdivisions=false`

| ☐ | Marke | Erwarteter Inhalt | Wer spricht | Hängt daran |
|---|---|---|---|---|
| ☐ | 00:00 | Player startet am Segmentanfang (Abspann des Berichts, dann Studio) | Sprecherstimme, Moderatorin | «Ausschnitt 00:00–02:53» auf S. 3 und der Karte |
| ☐ | 00:26–00:33 | Gesetz: bei mangelhafter Ware Preisnachlass oder Rücktritt | Juristin | Lösung Raster Zeile 1; Befund; LF4 «Gut, wenn»; beide Beispielantworten; Glossar Preisnachlass/Rücktritt |
| ☐ | 00:35–00:42 | Gesetz nicht zwingend, Anbieter machen eigene Regeln; dann gelten die Geschäftsbedingungen (bei 00:40 evtl. Einwurf der Moderatorin) | Juristin | Raster Zeile 2; Befund; Quer-Check 1 (S. 8); LF4 |
| ☐ | 00:50–01:02 (Raster: 00:55) | Geschäftsbedingungen des Unternehmens: es entscheidet selbst, ob repariert oder zurückgenommen wird | Juristin | Raster Zeile 3 |
| ☐ | 01:30–01:42 | «Muss ich das hinnehmen?» — «Faktisch ja» | Moderatorin fragt, Juristin antwortet | Lösung LF3 «Erwartet» (auch gültig) |
| ☐ | 01:52–02:02 | Rat: standhaft bleiben, reklamieren, Lösungen vorschlagen | Juristin | Raster Zeile 4; beide Beispielantworten zu LF4 |
| ☐ | 02:16 | Klage vor Gericht möglich, aber aufwendig | Juristin | Lösung LF3 (auch gültig) |
| ☐ | 02:31 | Vor teuren Käufen Geschäftsbedingungen lesen | Juristin | Lösung LF3 (auch gültig) |
| ☐ | ganzes Bild | Ist durchgehend das Studio zu sehen? | — | Spalte «Bild» der Rasterlösung («Studio» in allen Zeilen, aus den Untertiteln nicht belegbar) |

**B. Ersatzquelle Heft B — `q-331b-pflicht-ersatz`**, SRF Kassensturz, 3. März 2026,
Ausschnitt 00:52–04:22 aus einem Segment von 10:43
`https://www.srf.ch/play/embed?urn=urn:srf:video:2a511d6a-d862-4a7f-8ae6-6321cfcf7344&subdivisions=false`

| ☐ | Marke | Erwarteter Inhalt | Wer spricht | Hängt daran |
|---|---|---|---|---|
| ☐ | 00:52 | Lässt sich die Startmarke im Player ansteuern? | — | Verortung der Karte; Hinweis im Begleiter |
| ☐ | 00:57 | Im April bestellt, bis heute nichts erhalten | Kundin (Mundart, hochdeutsch untertitelt) | Lösung LF3, Zeile «Mit Ersatzquelle» |
| ☐ | 01:03 | Geld (668 Fr.) ist abgebucht | Sprecherstimme | dieselbe Zeile |
| ☐ | 02:07 | Rechtlich klar: Kaufvertrag geschlossen | **unklar: Juristin im O-Ton oder Sprecherstimme, die sie wiedergibt** | dieselbe Zeile («Juristin: Vertrag gilt») |
| ☐ | 02:14–02:21 | Kurze Nachfrist (z. B. zehn Tage), dann Rücktritt und Geld zurück | wie 02:07 | dieselbe Zeile |
| ☐ | 04:01 | Die Kundin muss nicht ewig auf die Reparatur warten | **unklar** (in der Lösung als «wer spricht: offen» geführt) | dieselbe Zeile; LF4 «Gut, wenn», vierter Punkt |

Spricht bei 02:07 oder 04:01 nicht die Juristin, in `herausforderung_B.json`
(`spuren.mit_medien.leitfragen[0].loesung.zeilen[2]`) «Juristin:» durch «Sendung:» ersetzen.

**C. Textquellen am Handy** (kein Ton, aber einmal ansehen)

- ☐ `q-331a-pflicht` (ch.ch): «Alle öffnen» tippen; Zwischentitel und Listenpunkte
  mitzählen; Abs. 2, 3, 4–7, 9 müssen den Rasterzeilen der Lösung entsprechen (am
  5. Oktober am Desktop-Browser bestätigt).
- ☐ Fedlex (beide Vertiefungen 1): lädt nur im Browser; Sprung zu Art. 40b bzw. 201.
- ☐ QR-Seite `/m/3.3.1_kaufvertrag_beurteilen` auf einem Handy ohne Konto.

## 5. Entscheide für Pietro

1. **Fristbeginn im Auftrag.** Jetzt: «vorsichtig ab der Zusage» (fünf Tage), die
   Rechtslage steht in Erwartungshorizont und Begleiter. Variante B: Situation ändern
   («Das Vertragsdoppel mit dem Hinweis kam am Tag nach der Zusage») — dann decken sich
   Fall und Gesetz fast, aber der Reiz «die Frist läuft schon» wird schwächer.
   Empfehlung: so lassen.
2. **Garantieschein in Heft B.** Die Situation gibt nur die Aussage des Verkäufers
   wieder. Variante B: einen Satz Wortlaut in die Situation («Anstelle der gesetzlichen
   Rechte: kostenlose Reparatur innert zwei Jahren») — macht LF4 juristisch sauber,
   nimmt den Lernenden aber die Frage «steht das wirklich so da?». Empfehlung: so
   lassen; der Hinweis zum Lösungsbild trägt den Vorbehalt.
3. **Heft A, Prüffrage 3 mit zwei Zuträgern** und **«Nach der Frist?»** auf dem Bogen:
   nach Runde 2 nicht mehr geändert. Beides liesse sich mit je einem Halbsatz klären
   (Schritt 03: «zu Prüffrage 3 zusätzlich Widerruf und ‹anfechtbar› aus LF1»; Schritt
   04: «Was gilt nach der Frist?»), braucht aber Platz auf S. 5 bzw. A1 (4.6 px Reserve).

## 6. Vorschläge für geteilte Dateien (nicht geändert)

| Datei | Alt | Neu | Beleg |
|---|---|---|---|
| `src/data/methoden/lm-1-3-rechtsfall.json`, `beispiel[1]` | «Rechtslage: Auch eine mündliche Zusage bindet; am Marktstand gibt es keinen Widerruf (Kap. 2.4, S. 60).» | «Rechtslage: Auch eine mündliche Zusage bindet (Kap. 2.4, S. 60); widerrufen lassen sich nur bestimmte Käufe über 100 Franken.» | Die Aussage ist nach OR Art. 40c Bst. b richtig, steht aber so nicht auf S. 60; die 100-Franken-Grenze steht dort wörtlich und trägt das Beispiel (CHF 40). |
| `src/data/methoden/lm-17-4-geschaeftsbrief.json`, `merk` | «Der Titel nennt die Sache, der zweite Absatz die Forderung.» | «Der Titel nennt die Sache; spätestens der zweite Absatz sagt, was Sie wollen.» | deckt sich dann mit `fehler` («nach zwei Sätzen») und mit «Absicht» (Kap. 17.4, S. 398) |
| `src/data/methoden/hko-gezielt-suchen.json`, `ankommt` | «… ist nach zwanzig Minuten in der Mitte und hat die Antwort immer noch nicht.» | «… ist lange unterwegs und hat die Antwort immer noch nicht.» | keine Minutenangabe im Heft (phase-9 §3 Nr. 4) |
| `src/data/methoden/lm-17-3-3b-schema.json`, `merk` | «Drei Argumente nach 3B tragen weiter als sechs Behauptungen.» | «Ein Argument nach 3B trägt weiter als drei Behauptungen.» | Hefte verlangen oft zwei Belege; «drei Argumente» wird als Vorgabe gelesen |
| `docs/cloud-run/bauplaene/3.3.1_kaufvertrag_beurteilen.md` | Zeitmarken 00:49, 02:15; «ohne Fachbegriffe»; Persona «1. Lehrjahr» | 00:50 (Aussage ab 00:55), 02:16; «Fachbegriffe übersetzen»; «Lernende/r EFZ» | Untertitel im Archiv; dieser Nachtrag |
| Skill, `check-lf-loesung` | Budget 900 Zeichen je LF-Lösung, `quelle` ≤ 30 | Rechtsthemen brauchen Platz für Lehrmittelseite **und** Artikel | hier nur mit starkem Kürzen eingehalten |

## 7. Nicht geprüft

- Ton und Bild beider Videos; Sprecher bei 02:07 und 04:01 der Ersatzquelle.
- Die QR-Seite, die Workbench im Browser, das Aussehen der Word-Dateien.
- UWG Art. 3 Abs. 1 Bst. s: gelesen in der Fedlex-Fassung Stand 1. Januar 2022 (neuere
  Fassungen liessen sich nicht als Datei laden); ZGB in der Fassung Stand 1. Juli 2026.
- Ob ein Smartphone «vertretbare Sache» nach OR Art. 206 ist: Auslegung, kein Wortlaut.
- Seitenangaben der Karten `lm-17-1-sq3r`, `lm-17-3-3b-schema`, `lm-19-2-vier-ohren`.
- Die Lösungen nach den letzten Audit-Korrekturen wurden nicht noch einmal gegengelesen.
