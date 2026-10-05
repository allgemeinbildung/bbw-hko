# Nachtrag — 3.1.1_konsum_verantworten_3j (Abschluss vor der Freigabe)

Stand 2026-10-05, Branch `v42-skill`. Grundlage: `BERICHT.md` dieses Laufs und
der Abschluss-Auftrag. Kein Lehrmittel-, Transkript- oder Artikeltext in dieser
Datei. Kein Commit, kein Index-Build; `set.status` bleibt `entwurf`.

**Urteil: freigabereif nach Gegenhören — ja, mit zwei Vorbehalten:** dem
Entscheid zur Spur (§1) und den offenen Punkten der Lösung LF3 Heft B (§4).

Geänderte Dateien:

- `src/data/einheiten/3.1.1_konsum_verantworten_3j/herausforderung_A.json`
- `src/data/einheiten/3.1.1_konsum_verantworten_3j/herausforderung_B.json`
- `src/data/einheiten/3.1.1_konsum_verantworten_3j/set.json` (nur Glossar «Lohnpfändung»)
- `src/data/einheiten/3.1.1_konsum_verantworten_3j/begleiter.md`
- `src/data/quellen/q-311a-pflicht.json`, `q-311a-pflicht-ersatz.json`,
  `q-311b-pflicht.json`, `q-311b-pflicht-ersatz.json` (Kurzbeschrieb; bei
  Ersatz B dazu ein Satz im `lizenz_hinweis`)

Nicht angefasst: `kn.json`, `prinzip.json`, die vier Gold-Karten `q-131*`
(gehören auch zu `1.3.1_konsum_verantworten_v42`), Gold, Renderer, Skill,
Methodenkarten, Index.

Tor nach der letzten Änderung:

```
check-all 3.1.1_konsum_verantworten_3j   GRUEN — keine Fehler.
begleiter-marker                         223 Marker · 0 neu gefuellt · 0 unaufloesbar
export-v42 + messen-v42                  Exit 0 — kein Überlauf (Hefte je 8, Auftragsbogen 4, Lösungen je 5 Seiten;
                                         Reserven wie im Bericht, S. 6 beider Hefte weiter 0 px)
```

`bestand-v42`, `npm run build` und `build:einheiten-index` sind **nicht**
gelaufen (Auftrag: macht der Orchestrator).

## 1. Entscheid für Pietro: nur mit Medien — oder Spur ohne Medien nachziehen?

**Feststellung.** Der Bericht stimmt: Beide Hefte haben nur `spuren.mit_medien`.
Gold (`1.3.1_konsum_verantworten_v42`) hat in beiden Heften beide Spuren. Das
Fehlen ist kein Versehen, sondern **dein Entscheid vom 04.10.2026 («Weg 1»,
Bauplan §4.1)**: Alle drei 3J-Kompetenzen (3.1.1–3.1.3) nennen im Datensatz
genau einen Sprachmodus, «Rezeption audiovisuell», und `regel4` in
`scripts/check-v42.mjs` verbietet eine Spur ohne Medien, sobald ein Heft diesen
Modus führt (`ERR_V42_R4`). Ich habe keine Spur gebaut.

| | Variante 1 — Freigabe nur mit Medien (Ist) | Variante 2 — Spur ohne Medien aus Gold nachziehen |
|---|---|---|
| Was es für Klassen ohne Geräte heisst | S. 3 (Raster, LF3) und der Bezug in LF4 Heft A sind ohne das Video nicht lösbar. Der Begleiter sagt heute: «Geht gar nichts, verschiebst du die Lektion.» Praktischer Ausweg ohne Lernendengeräte: Die Lehrperson zeigt das Video **im Plenum** (A 3:15, B 3:31, je zweimal = rund 7 Minuten); das Raster ist auf Papier. Dann braucht es ein Gerät mit Beamer und Ton, nicht eines je Person. Die Vertiefungen (S. 4) entfallen dann oder werden Hausaufgabe | Heft läuft ganz auf Papier mit dem Lehrmittel |
| Lehrplan | der einzige Sprachmodus des Lebensbezugs ist abgedeckt | die Spur ohne Medien deckt «Rezeption audiovisuell» nicht ab — das war der Grund, Weg 2 zu verwerfen |
| Tor | grün | **rot** (`ERR_V42_R4`), solange das Heft den Modus führt. Es braucht also zusätzlich einen Entscheid über die Regel (Ausnahme im Skript = geteilte Datei) oder über die Modi im Heft |
| Aufwand | keiner | je Heft den Block `spuren.ohne_medien` aus Gold zurückholen (LF3 mit Lehrmittel-Raster, LF4, Denkhilfe, Lösungen), zwei Glossarbegriffe («Nachfrage», «Betreibung»), `eigene_knoten.ohne_medien`, `prinzip.pol_typ_verteilung`; Begleiter Präambel, §1, §2 und die Abschnitte je Heft zurückbauen; Tor, Messung, Gegenleser für zwei weitere Hefte und zwei Lösungsdokumente. Kapitel: Heft A Kap. 2.7 (S. 73–77), Heft B Kap. 8.2 (S. 199–200) und Kap. 2.4 (S. 62). Geschätzt ein halber Lauf; inhaltlich wenig Risiko, weil Gold die Texte hat und der Kern gleich ist |

**Empfehlung: Variante 1**, ergänzt um einen Satz im Begleiter (§2
«Vorbereitung» und im Kasten «Wenn ein Link nicht geht»): «Ohne Geräte der
Lernenden zeigst du das Video zweimal im Plenum; das Raster füllen alle auf
Papier.» Ich habe ihn nicht eingefügt, weil er am Entscheid hängt. Variante 2
lohnt sich nur, wenn du `regel4` für angepasste Einheiten lockern willst — das
ist ein Entscheid für `ENTSCHEIDE.md`, nicht für diese Einheit.

## 2. Befunde aus dem Bericht — behoben, stehen gelassen, Entscheid

| # | Befund | Ergebnis |
|---|---|---|
| 1 | Karte `q-311b-pflicht`: Kurzbeschrieb nennt «ungeöffnete Post» und drei Gründe | **behoben.** Neuer Kurzbeschrieb ohne Gründe. Beim Nachprüfen gefunden: **alle vier Karten** nahmen das Raster vorweg (Quelle A nannte wörtlich die vier erwarteten Zeilen). Alle vier neu gefasst (106–141 Zeichen, Grenze 180). Der Text steht im Heft auf S. 3 direkt über dem Raster und auf der QR-Seite |
| 2 | Heft B S. 2 «geschätzte genügen» gegen S. 6 «nur realistische, eigene Zahlen» | **behoben.** LF2: «… für Ihr eigenes Monatsbudget, wo nötig realistisch geschätzt: …». Begleiter (Coaching LF1/LF2) angepasst: Schätzen ist in LF2 erlaubt, fürs saubere Budget auf S. 7 gilt die Methodenkarte (Schätzungen durch echte Beträge ersetzen). Gegenleser Runde 2: kein Widerspruch mehr |
| 3 | «Betreibungsamt», «Existenzminimum» fehlen im Glossar | **behoben im Rahmen des Budgets** (zwei Spur-Begriffe je Heft): Die Definition von «Lohnpfändung» erklärt beide Wörter mit: «Das Betreibungsamt zieht für Schulden Lohn ein; es bleibt das Nötige (Existenzminimum).» (87 Zeichen). Keine neuen Einträge |
| 4 | Quelle B zeigt keinen Kauf auf Rechnung — trägt sie die Aufgabe? | **stehen gelassen, begründet.** LF3 fragt, welche Gründe die Quelle nennt und welcher sich im eigenen Budget zeigt. Die Quelle nennt: wenig Lohn/Einteilen, mit 18 allein zuständig, kein Überblick, zu hoher Lebensstandard, zu spät bezahlte Versicherung. Zur Situation passen «kein Überblick» (schreibt nichts auf) und unbezahlte Rechnungen. Der Satzanfang «Die Quelle zeigt nicht, …» fängt den Rest. Beide Lernenden-Gegenleser fanden vier Zeilen; die Zuordnung zu einem Begriff bleibt bei zwei Zeilen «nicht elegant» (Q) |
| 5 | Lohnpfändung ist Folge, nicht Grund | **behoben in Lösung und Begleiter.** Lösung LF3 Heft B trennt jetzt Gründe, Verschärfendes und Folgen; die Rasterzeile «Post vom Betreibungsamt» ist durch «Zu hoher Lebensstandard» (05:01) ersetzt; Befund neu. Begleiter S. 3: Folgen gelten als Rasterzeile, wenn die Lernenden sie so benennen. Offen: §4 |
| 6 | Leere Knoten S. 8 Heft B (Überschuldung, Lohnpfändung) kamen im Lösungsraster nicht vor | **behoben.** Rasterzeile 03:17 führt «Überschuldung» (das Wort fällt bei 03:13); Zeile «Begriffe» nennt die zwei Knoten |
| 7 | Heft A, Methodenkarte «Echt oder geweckt prüfen»: Beispiel endet mit «Doppelsymbol» und «teilweise echt» — das Heft kennt drei Markierungen | **behoben über die Ausnahme `beispiel` in der Methoden-Referenz** (`methoden[2].beispiel`, fünf Zeilen wie bisher): Der Hund ist jetzt «geweckt, aber berechtigt · Einfluss: Video», mit einem Grund, der dem Wegdenk-Test nicht widerspricht. Die Karte selbst ist unverändert → Vorschlag §6 |
| 8 | Heft A, Beispielbild: Massstab «nach einem Monat», Entscheid «spare zwei Monate» | **stehen gelassen.** Kein Widerspruch: Der Massstab hat zwei Bedingungen (Geld gespart, Wunsch nach einem Monat noch da); das Geld ist erst in zwei Monaten gespart. S. 6 hat 0 px Reserve |
| 9 | Zuordnung Prominente → Werbung ist Deutung | **stehen gelassen.** Lösung («Begriffe: Deutung der Lernenden, mehrere gelten») und Begleiter (Stolperstein «Quelle und eigene Beobachtung vermischen») sagen es. Runde 2: Lernende ordnete «Werbung» der Marketingstrategie (02:05) zu — beides gilt |
| 10 | Kriterien-Wortlaut mit Begriffen ausserhalb des Hefts (Budget, Leasing/Kredit) | **stehen gelassen.** Wortlaut des KN ist Pflicht (`ERR_V42_R6`); der Begleiter erklärt es; die Zeile «Woran sehe ich das in meinem Produkt?» trägt die Einschätzung. Beide Gegenleser: «verwirrt kurz, blockiert nicht» |
| 11 | Begleiter sagt «Stufe» statt «Punkte» | **behoben** an fünf Stellen (`sprache.md` §5). «Stufentexte» (Name des Datenfelds) und «Maslow-Stufen» bleiben. Der Renderer druckt im Heft selbst «Kreuzen Sie … Ihre Stufe an» und den Spaltenkopf «Stufe» → Vorschlag §6 |
| 12 | Begleiter nennt bei Heft B Vertiefung 1 «Berichte von Betroffenen», das Heft nicht | **behoben im Heft.** Das Transkript trägt es (02:35); die Erwartung im Heft nennt es jetzt auch |
| 13 | Player stoppt nicht bei 05:03 | **behoben im Begleiter** (S. 3 Heft B und «Was du über die Quellen wissen musst»): Unmittelbar danach (05:03–05:09) geht es um Kleinkredite — nahe am Fall des KN. Im Heft nennt die Quellenkarte auf S. 3 den Ausschnitt 01:32–05:03; den Auftrag habe ich nicht verlängert (Budget 220) |
| 14 | Raster-Beispiel auf S. 6 sagt «Begriff aus LF1», Auftrag und Checkliste «LF1 oder Glossar» | **behoben** in beiden Heften (`methoden_ref_rezeption.beispiel`) und im Begleiter (S. 3 Heft A) |
| 15 | Heft A S. 3 «Ins Produkt»: «… mit Farbe oder Symbol und Zeitmarke auf der Karte» — Zeitmarken auf der Karte verlangt sonst nichts | **behoben:** «Die Einflüsse notieren Sie auf der Karte bei den geweckten Einträgen (Schritt 03).» |
| 16 | Heft A S. 5 Plus: «eine Vertiefungsquelle, falls Ihr Heft eine nennt» | **behoben:** «eine Vertiefung von S. 4» |
| 17 | Heft B S. 5 Schritt 03: «Markieren Sie mit dem Raster aus LF3 die Posten …» — das Raster enthält Aussagen aus dem Video, keine Budgetposten (Gegenleser Runde 1, störendste Stelle) | **behoben:** «Markieren Sie die Posten, die zu Schulden führen können — Ihr Befund aus LF3 zeigt, worauf Sie achten.» Runde 2: lösbar |
| 18 | `lernfortschritt.scaffold_90` des Kerns nennt eine Beispielzeile, die es nicht gibt | **behoben** (gleicher Wortlaut wie in der Spur) |
| 19 | Begleiter, Tafelbild: fünfte Verbindung führt zum «Zentrum», das Heft verlangt eine zum Feld «gilt auch bei …» und die Lösung des Hefts zeigt sie | **behoben** in beiden Heft-Abschnitten (jetzt wie `abschluss.loesung.verbindungen`) |
| 20 | Vertiefung A2, Erwartung: «der Zoll hält Pakete zurück; Verfahren und Kosten gehen vom Markeninhaber aus» — der Ausschnitt sagt: Kontrolle, der Zoll sanktioniert nicht, Strafverfahren oder Bussen kommen vom Rechtsinhaber (06:16–06:27) | **behoben** in Heft A und Begleiter. Gold hat den alten Wortlaut noch → §6 |
| 21 | Vertiefung B2, Erwartung: «ohne Rechtsvorschlag Fortsetzung bis zur Lohnpfändung» klingt nach Automatismus | **behoben:** «sofort bzw. innert 10 Tagen Rechtsvorschlag → ohne Rechtsvorschlag kann der Gläubiger die Betreibung fortsetzen, bis zur Lohnpfändung» (SchKG Art. 74, 88) |
| 22 | Heft A, Lösungsraster: «Glücksspiel (02:26)» — das Wort fällt bei 02:30 | **behoben:** 02:26–02:30 |
| 23 | «Das geben Sie ab» nennt Befund und Begriffsnetz nicht; Checkliste S. 8 verlangt mehr | **stehen gelassen** (Gold-Kern, feste Trennung Abgabe/Vollständigkeit) |
| 24 | Heft B: «eigenes Monatsbudget» — die echten Zahlen der Lernenden oder die der Ich-Situation (CHF 800)? Lösungsbild rechnet mit der Situation, Begleiter verlangt echte Zahlen | **braucht keinen Entscheid für die Freigabe**, aber einen Satz der Lehrperson. Begleiter sagt es (Coaching LF1/LF2, Hinweis im Lösungsbild). Gold-Kern, gilt gleich für 1.3.1 |
| 25 | Profil b (Sprachlast, B1) | **nicht bearbeitet** (Entscheid 05.10.2026) |

## 3. Geprüfte Fakten

| Angabe in der Einheit | Quelle | Abruf | Ergebnis |
|---|---|---|---|
| Zahlungsbefehl: 20 Tage zum Zahlen | SchKG Art. 69 Abs. 2 Ziff. 2, fedlex.admin.ch (SR 281.1), Stand 1. Januar 2026 | 05.10.2026, im Browser gerendert | stimmt |
| Rechtsvorschlag sofort oder innert 10 Tagen | SchKG Art. 69 Abs. 2 Ziff. 3, Art. 74 Abs. 1 | 05.10.2026 | stimmt; «sofort» im Heft ergänzt |
| Fortsetzung frühestens 20 Tage nach Zustellung, auf Begehren des Gläubigers | SchKG Art. 88 Abs. 1 | 05.10.2026 | stimmt; «kann» im Heft ergänzt |
| Lohnpfändung: nur so weit, als das Einkommen für Schuldner und Familie nicht unbedingt notwendig ist; längstens ein Jahr | SchKG Art. 93 Abs. 1 und 2 | 05.10.2026 | Glossar «es bleibt das Nötige (Existenzminimum)» trägt |
| Lohnpfändung: Arbeitgeber überweist den pfändbaren Teil ans Betreibungsamt; Mahnung üblich, aber keine Voraussetzung; Abschnitt «Werden Sie betrieben?» | ch.ch, Seite «Betreibung: Zahlungsbefehl, Rechtsvorschlag, Pfändung» | 05.10.2026, im Browser (curl und WebFetch liefern nur eine 404-Hülle — die Seite ist eine JavaScript-Anwendung, im Browser vollständig) | stimmt; Abschnittstitel lautet ganz «Werden Sie betrieben? Informationen für Schuldnerinnen und Schuldner» |
| AHV/IV/EO-Beiträge ab 1. Januar nach dem 17. Geburtstag (Lösung LF2 Heft B: «ab dem 1. Januar des Jahres, in dem Lernende 18 werden») | Merkblatt 2.01 der Informationsstelle AHV/IV (ahv-iv.ch), Stand 1. Januar 2026 — über Websuche gelesen, nicht das PDF selbst | 05.10.2026 | stimmt (gleiche Aussage, anders gesagt) |
| Rechenproben: Abos 45+20+65=130; Rechnung 180+20=200; Lösungsbild −140 → 0; Beispielbild −52 → +28 | nachgerechnet | 05.10.2026 | stimmen |
| Alle Zeitmarken beider Lösungen | Untertitel im Archiv (`D:\OS\_lab\quellen-archiv\bbw-hko\q-311*`) | 05.10.2026, zwei Audits | innerhalb ±3 s und innerhalb der Ausschnitte |

**Links** (alle am 05.10.2026 aufgerufen): die sieben SRF-Adressen antworten
mit 200; die SRG-Metadaten (Integration Layer, `mediaComposition`) melden für
alle sieben Medien keinen `blockReason` und kein Ablaufdatum (Vertiefung A2:
gültig bis 2099). ch.ch lädt im Browser. Kein Link ersetzt. Ob die Player
wirklich abspielen und an der Startmarke einsetzen, ist **nicht geprüft**.

**Nicht an amtlicher Quelle geprüft:** «Die Einfuhr (von Fälschungen) ist auch
für den Eigengebrauch verboten» (Vertiefung A2, steht als Aussage des Beitrags
da); die Mahngebühr von 20 Franken in der Situation (Fallannahme — eine
Mahngebühr ist nur geschuldet, wenn sie vereinbart wurde; das Heft behauptet
nichts dazu). Die Lehrmittelseiten sind die Fachprüfung von Gold und nicht
wiederholt.

## 4. Gegenleser

Modell Sonnet, nur lesend, parallel. Profil b ist nicht gelaufen.

| Runde | Gegenleser | Befunde | Übernommen | Nicht übernommen / offen |
|---|---|---|---|---|
| 1 | Lernende/r a, Heft A | 3 Hauptstellen | Hund-Beispiel widersprach sich (mein erster Ersatztext) → neu gefasst | Abgabe gegen Checkliste (S, Gold-Kern) · «Sicherheit später» im Kriterium ohne Einführung (S, KN-Wortlaut und Zentrum) · Seiten 381–382 auf der Karte gegen 381–383 auf S. 1 (S, Karte) |
| 1 | Lernende/r a, Heft B | 3 Hauptstellen | Schritt 03 (Nr. 17) | Beispiel der Karte «Ein Budget aufstellen» endet mit Saldo 0 direkt über «Typischer Fehler: Saldo genau null» (S, Karte → §6) · «Fix: Verpflegung auswärts» gegen Glossar «fix = lässt sich kurzfristig nicht ändern» (S, Lehrmittel führt es so) · eigene oder Persona-Zahlen (Nr. 24) · Checkliste «✔ … ☐» ist ein Artefakt der Textaufbereitung, fällt weg |
| 1 | Lösungs-Audit A und B | 14 | 9: Gründe/Folgen in Heft B, Beleg «Eltern helfen nicht mehr» gestrichen, «Erzählstimme», 02:26–02:30, A2, B2 | A: «Erwartet» führt Beobachtungen als Wege (in «Begriffe», Befund und Begleiter als Deutung benannt, V) · Titel ohne «Plüschtier» (Karte führt `titel_original`) · B1 «nicht immer gelernt» ist schwächer als der Beitrag (vorsichtiger ist richtig) |
| 1 | Sweep | 6 | LF2 in Sie-Form, Glossar «Lohnpfändung» sagt jetzt, dass Lohn eingezogen wird, «Stufe», Tafelbild | `kn.json` `emotion_tag: ""` (wie Gold, Tor grün) · kein «ß», keine Platzhalter, keine Transliteration |
| 2 | Lernende/r a, Heft A (S. 3, 5, 6) | 0 Widersprüche | — | «möglicherweise»: Schritt 03 sagt nicht, ob bei «geweckt, aber berechtigt» auch der Einfluss steht (das Beispiel zeigt es) · Karte 4, Schritt 4 nennt nur zwei Markierungen (S, Karte → §6) |
| 2 | Lernende/r a, Heft B (S. 2, 3, 5, 8) | 0 Widersprüche | — | für «Steuern nicht bezahlt» und «Betreibungsamt» passt kein Begriff genau (Q) |
| 2 | Lösungs-Audit B | 10 | **keine — nach Runde 2 wird nicht mehr geändert** | siehe unten |

Zuletzt gelesen in Runde 2 (zwei von höchstens zwei). Zeitsumme Runde 1 ohne
Vertiefung: Heft A rund 113, Heft B rund 128 Minuten (Seitenplan 135).

**Offen nach Runde 2 — nur Dokument «Lösungen» Heft B, LF3 (Lehrperson, nicht
Lernende).** Die Zeitmarken stimmen; offen ist die Einordnung:

1. Rasterzeile 05:01: Beleg «Steuern, Krankenkasse nicht bezahlt (04:55)» steht
   dort als Beleg für «Zu hoher Lebensstandard», in der Zeile «Auch gültig»
   aber unter «verschärft». Vorschlag: Beleg ersetzen durch «sagt die zweite
   Frau über sich».
2. «Post bleibt liegen» steht in «Erwartet» als Weg, im Raster und im Befund
   als «verschärft». Die Quelle sagt nur, die Lage am Briefkasten sei für viele
   Überschuldete ein Problem (03:13) — «verschärft» ist meine Deutung und im
   Befund nicht als Deutung gekennzeichnet. Vorschlag: in «Erwartet» streichen,
   im Befund «Ich schliesse daraus» vor diesen Teil ziehen.
3. Befund: «Die Folgen waren Post vom Betreibungsamt und Lohnpfändung» — die
   Quelle nennt beides ohne Kausalangabe; die Briefe vom Betreibungsamt kamen
   schon mit 18. Vorschlag: «Die Quelle nennt ausserdem …».
4. «Mit Ersatzquelle»: «Mahnkosten verdoppeln Rechnungen» ist schärfer als die
   Quelle («vielleicht» 200 → 400). Vorschlag: «können … verdoppeln».
5. Vertiefung B1: «Gründe laut Beitrag» sind die Einschätzung des
   Vereinspräsidenten; «Eine konkrete Anlaufstelle nennt der Ausschnitt nicht»
   — er nennt eine Website und eine geplante App des Vereins, ohne Namen.

Keiner der fünf Punkte macht eine Aufgabe unlösbar; es sind Unschärfen in der
Musterlösung. Wer sie behebt, bleibt in Heft B bei 893 von 900 Zeichen.

## 5. Gegenhör-Liste für Pietro

Alle Zeitmarken zählen **ab Beginn des verlinkten Beitrags** (so zeigt sie der
Player). Geprüft sind nur Untertitel bzw. Begleittext. Für alle vier Videos
gilt: **Sprache des Tons unbekannt** — nach Sendung vermutlich mindestens
teilweise Mundart (G&G, Kassensturz, DOK-Protagonistinnen, Unzipped); bei
Quelle A und Ersatz A kommen Westschweizer O-Töne dazu (Genf; Übernahme von
RTS). Die Untertitel sind Hochdeutsch. Bitte je Video notieren: Hochdeutsch /
Mundart / übersprochen, und ob die Untertitel im eingebetteten Player
einschaltbar sind.

### A · Quelle — Labubu (SRF Gesichter & Geschichten, 26.06.2025)
`https://www.srf.ch/play/embed?urn=urn:srf:video:4a21282d-cb9f-4ef5-acfd-600f47fafe1a&subdivisions=false`
Segment einer Sendung (51.9–246.5 s der Episode); Untertitel laut SRG-Metadaten vorhanden.

| ☐ | Marke | Erwartet | Wer | Hängt daran |
|---|---|---|---|---|
| ☐ | 00:00 | Beitrag beginnt mit der Anmoderation, nicht mit dem Sendungsbeginn | Moderation | Ausschnitt 00:00–03:15 (S. 3, QR-Seite) |
| ☐ | 00:06–00:08 | Figur hängt an Taschen und Koffern, vor allem bei Jüngeren | Moderation | Rasterzeile 1; «Hinweis»; Befund |
| ☐ | 00:32 | Trend begann in Asien | Sprecherstimme | «Auch gültig»; Glossar «Trend» |
| ☐ | 00:43–00:51 | Schlange bis auf die Strasse (Genf) | Person vom Warenhaus — O-Ton evtl. französisch | Rasterzeile 2 |
| ☐ | 01:04, 01:22 | begrenzte Stückzahl, sechs pro Person | Sprecherstimme / Person vom Warenhaus | «Erwartet» |
| ☐ | 01:32–01:40 | zwei bekannte Sängerinnen tragen die Figur; Alter 79 und 29 | Sprecherstimme | Rasterzeile 3; «Hinweis» (nicht nur Jugendliche) |
| ☐ | 02:05 | «Marketingstrategie» | Sprecherstimme | «Auch gültig» |
| ☐ | 02:08–02:15 | Blind-Box: Inhalt beim Kauf unbekannt | Sprecherstimme | Rasterzeile 4; Glossar «Blind-Box»; Knoten S. 8 |
| ☐ | 02:26–02:30 | Vorfreude; Vergleich mit Glücksspiel | Fachperson oder Sprecherstimme (unklar) | Beleg Rasterzeile 4 |
| ☐ | 02:36–02:52 | Auspack-Videos aus sozialen Medien | Sprecherstimme, dann O-Töne (wohl Hochdeutsch) | «Auch gültig»; Befund; LF4 Beispiel 2 |
| ☐ | 03:09–03:15 | Schutz von Kindern (China); **was folgt nach 03:15?** Laut Metadaten der nächste Beitrag der Sendung | Sprecherstimme | Ende des Ausschnitts |

### A · Ersatzquelle — Kosmetiktrend (SRF Kassensturz, 20.08.2024), 00:59–04:16
`https://www.srf.ch/play/embed?urn=urn:srf:video:6cfa4203-1b81-452c-8412-22db9e4b8412&subdivisions=false`
Untertitel vorhanden. Übernahme aus der Westschweiz: O-Töne des Mädchens vermutlich französisch, übersprochen oder untertitelt.

| ☐ | Marke | Erwartet | Wer | Hängt daran |
|---|---|---|---|---|
| ☐ | 00:59 | Einstieg: Schminktisch, zwölfjähriges Mädchen | Sprecherstimme | Startmarke der QR-Seite (59 s) |
| ☐ | 01:32–01:41 | die meisten in der Klasse machen mit («90 %») | Sprecherstimme, Mädchen | Zeile «Mit Ersatzquelle» |
| ☐ | 01:50 | auf den Trend gekommen über Freundinnen und Internet | Sprecherstimme | dito |
| ☐ | 03:06–03:34 | soziale Medien befeuern; Jüngere ahmen Influencer nach | Sprecherstimme, Clips | dito |
| ☐ | 03:51–04:02 | Industrie zielt auf Jüngere; Stars werben | Sprecherstimme | dito |
| ☐ | 04:16 | Ende; was folgt? | | Ende des Ausschnitts |

### B · Quelle — In der Schuldenfalle (SRF DOK, 05.01.2023), 01:32–05:03
`https://www.srf.ch/play/embed?urn=urn:srf:video:9b5371b1-95ff-4792-8319-d1be17cb07d0&subdivisions=false`
Ganzer Film (50 Min.), Untertitel vorhanden. Protagonistinnen vermutlich Mundart.

| ☐ | Marke | Erwartet | Wer | Hängt daran |
|---|---|---|---|---|
| ☐ | 01:32 | Player setzt hier ein: «Das Leben ist teuer …» | Erzählstimme | Startmarke der QR-Seite (92 s) |
| ☐ | 01:35–01:38 | wer wenig verdient, muss einteilen; vielen Jungen fällt das schwer | Erzählstimme | Rasterzeile 1 |
| ☐ | 01:41–01:55 | Miete nicht mehr bezahlt, Kündigung, Lohnpfändung | erste Frau, Erzählstimme | «Auch gültig» (Folgen); Glossar und Knoten «Lohnpfändung» |
| ☐ | 02:04–02:18 | mit 18 Briefe vom Betreibungsamt; ab 18 selbst zuständig | Erzählstimme, erste Frau | «Erwartet»; Glossar (Betreibungsamt) |
| ☐ | 02:21–02:29 | nie begriffen, wie wichtig es ist zu wissen, wo man finanziell steht | erste Frau | Rasterzeile 2; Befund |
| ☐ | 02:33 | «Existenzminimum» fällt | Erzählstimme | Glossar |
| ☐ | 03:13–03:26 | Briefkasten als Problem für «Überschuldete»; Briefe im Milchkasten | Erzählstimme, erste Frau | Rasterzeile 3; Glossar und Knoten «Überschuldung» |
| ☐ | 04:24–04:36 | zweite Frau: mit der Volljährigkeit in die Schulden, Schuldenberatung | Erzählstimme | Befund («zwei Frauen»); Lesehilfe |
| ☐ | 04:40–05:01 | Versicherung zu spät bezahlt; Steuern, Krankenkasse nicht bezahlt; zu hoher Lebensstandard | zweite Frau — **ist sie im Bild?** (laut Untertitel bei 05:18 wollte der Arbeitgeber nicht, dass sie sich zeigt) | Rasterzeile 4; «Auch gültig» |
| ☐ | **05:03** | **hier stoppen.** 05:03–05:09: Kleinkredite, um Steuern zu zahlen — nahe am Fall des KN | zweite Frau | Begleiter S. 3 Heft B; Ausschnitt-Ende. Prüfen: Reicht eine Ansage, oder soll die QR-Seite das sagen? |

### B · Ersatzquelle — Schuldenfalle (SRF Unzipped, 10.01.2021), 02:30–05:05
`https://www.srf.ch/play/embed?urn=urn:srf:video:8307a9a3-ed77-42c0-afd8-18da54cbd6bb&subdivisions=false`
**Im SRF-Player keine Untertitel** (SRG-Metadaten 05.10.2026). **Alle Zeitmarken stammen aus der YouTube-Kopie** (`youtube.com/watch?v=VWOglNd1Ez8`, Fassungen auf eine Sekunde gleich lang) und sind am SRF-Player nie geprüft. Ton vermutlich Mundart: Ohne Untertitel ist diese Ersatzquelle für Lernende, die Mundart nicht verstehen, kaum brauchbar — bitte entscheiden, ob sie Ersatzquelle bleiben kann.

| ☐ | Marke | Erwartet | Wer | Hängt daran |
|---|---|---|---|---|
| ☐ | 02:30 | Frage «wie es angefangen hat»; Antwort: mit 18 | Reporter, junge Frau | Startmarke der QR-Seite (150 s) |
| ☐ | 02:47 | Abos abgeschlossen, Produkte auf ihren Namen bestellt (für andere) | junge Frau | Zeile «Mit Ersatzquelle» (Gründe) |
| ☐ | 03:14–03:26 | nur temporär gearbeitet; verdrängt | junge Frau | dito |
| ☐ | 03:36–03:46 | Rechnung von 200 wird mit Mahnungen «vielleicht» 400 | junge Frau | dito («verschärft»; siehe §4 Nr. 4) |
| ☐ | 03:58–04:05 | Steuerschulden, Krankenkasse | junge Frau | dito |
| ☐ | 04:44–04:59 | Briefe nicht mehr angesehen | junge Frau | dito |
| ☐ | 05:05 | Ende; was folgt? | | Ende des Ausschnitts |

### Vertiefungen (freiwillig, S. 4)

| ☐ | Medium | Adresse | Zu prüfen | Hängt daran |
|---|---|---|---|---|
| ☐ | A1 Audio, SRF Ratgeber, 23.08.2023, ganz (5:54) — **nie gehört, kein Transkript, keine Untertitel** | `https://www.srf.ch/play/embed?urn=urn:srf:audio:c6435615-4741-4d5c-9f28-92f267610f08&subdivisions=false` | Sprache; nennt der Beitrag die vier Merkmale: Kennzeichnungswörter (Werbung, Ad, gesponsert), Rabattcode / Produkt im Mittelpunkt, nur Positives, Prüffrage vor dem Kauf? | Erwartung A1 in Heft A und Begleiter (dort als «nicht gegengehört» gekennzeichnet) |
| ☐ | A2 Video, SRF Impact, 10.01.2024, 00:35–06:29, Mundart mit Untertiteln | `https://www.srf.ch/play/embed?urn=urn:srf:video:7b5768ea-7783-4f3d-baa7-e7982a23c61d&subdivisions=false` | 05:14 Kontrolle des Pakets; 06:16–06:27 der Zoll sanktioniert nicht, Verfahren und Bussen kommen vom Rechtsinhaber; wo fällt «auch für den Eigengebrauch verboten»? | Erwartung A2 (neu gefasst) |
| ☐ | B1 Audio, SRF Regionaljournal AG/SO, 06.02.2025, 00:04–03:10, Mundart | `https://www.srf.ch/play/embed?urn=urn:srf:audio:8e303064-455e-330b-bf96-45e5449aecf8&subdivisions=false` | 02:03 Gründe (Einschätzung des Vereinspräsidenten); 02:35 Betroffene sollen berichten; 02:52 Website und geplante App | Erwartung B1 |
| ☐ | B2 Webseite ch.ch | `https://www.ch.ch/de/steuern-und-finanzen/schulden--betreibungen-und-konkurs/betreibungen/` | gelesen am 05.10.2026; nichts zu hören | Erwartung B2 |

## 6. Vorschläge für geteilte Dateien (nicht geändert)

| Datei | Alt | Neu | Beleg |
|---|---|---|---|
| `src/data/methoden/hko-bedarf-oder-wunsch.json`, `schritte[3]` | «Mit Symbol markieren: echt oder geweckt — und den Einfluss benennen.» | «Markieren: echt, geweckt oder geweckt, aber berechtigt — und den Einfluss benennen.» | Hefte A (1.3.1 und 3.1.1) führen drei Markierungen; Gegenleser Runde 2 |
| dieselbe Datei, `beispiel[2..4]` | «… Ohne das Video hätte ich nie daran gedacht. → geweckt» / «Aber: Ich habe schon als Kind einen gewollt. → teilweise echt» / «Markierung: Doppelsymbol, Einfluss: Video» | «Wegdenk-Test: Ohne das Video wäre der Wunsch jetzt nicht da. → geweckt» / «Aber: Ich bin gern draussen und habe Zeit für ein Tier. → berechtigt» / «Markierung: geweckt, aber berechtigt · Einfluss: Video» | «Doppelsymbol» und «teilweise echt» gibt es in keiner Legende; in 3.1.1 über die Referenz überschrieben, in Gold steht noch der Kartentext |
| `src/data/methoden/lm-2-2-budget.json`, `beispiel[5]` | «Saldo: 1 200 − 1 200 = 0.— → kein Puffer» | Beispiel mit kleinem Plus, z. B. Material 50.— und «Saldo: 1 200 − 1 180 = 20.— → kleiner Puffer» | steht direkt über «Typischer Fehler: Saldo genau null»; Gegenleser Heft B, Runde 1 |
| `src/data/methoden/lm-17-2-stichwortnotizen.json`, `seiten` | «S. 381–382» | mit `quellen_anker` der Hefte A abgleichen («Seite 381-383») | Gegenleser Heft A |
| Renderer `src/components/einheiten/docs/heft-v42/seiten-5-8.tsx` (und DOCX-Pendant), fester Text S. 5 | «Kreuzen Sie vor der Abgabe in der Spalte «Selbst» Ihre Stufe an.» · Spaltenkopf «Stufe» | «… Ihre Punkte an.» · Spaltenkopf «Punkte» | `references/sprache.md` §5 (E17) |
| `src/data/einheiten/1.3.1_konsum_verantworten_v42/` (Gold) | Erwartung A2 «der Zoll hält Pakete zurück; Verfahren und Kosten gehen vom Markeninhaber aus»; Erwartung B2 «Fortsetzung bis zur Lohnpfändung»; LF2 Heft B «geschätzte genügen»; Tafelbild im Begleiter «→ Zentrum»; «Stufe» im Begleiter; Schritt 03 Heft B | wie hier in §2 Nr. 2, 11, 17, 19, 20, 21 | dieselben Texte, dieselben Befunde |
| `.claude/skills/bbw-hko-heft-v42/references/phase-q-quellen.md` | — | Regel ergänzen: Der Kurzbeschrieb einer Quelle nennt Thema und Form, **nicht** die Aussagen, die das Raster sucht | alle vier Karten dieser Einheit nahmen das Raster vorweg |
| QR-Seite `/m/<ordner>` (Renderer) | zeigt bei Ausschnitten nur die Startmarke | bei Quellen mit `bis` vor dem Ende des Mediums einen Satz «Stoppen Sie bei …» | Heft B, 05:03 |

## 7. Nicht geprüft

- Bild und Ton aller vier Videos und von Vertiefung A1; Tonsprache; ob der
  Player an Start- und Endmarke das Erwartete zeigt; Zeitmarken von Ersatz B am
  SRF-Player.
- Arbeitsansicht, Präsentation, Werkstatt, Katalogkarte und QR-Seite im Browser
  (KT1-Login); die QR-Seite zeigt die neuen Kurzbeschriebe — nicht angesehen.
- Profil b.
- Das Seitenbild von Auge (nur `messen-v42`: kein Überlauf; S. 6 beider Hefte
  bleibt bei 0 px Reserve).
- `bestand-v42 --pruefen`, `npm run build`, Index.
- Die Lehrmittelseiten (Fachprüfung von Gold).
