# Belege als Daten, Prüfskripte, neue Audits, keine Vererbung

Session in `D:\OS\dev\bbw-hko`, Branch `v42-skill`, Modell Opus 5.5. Darf
`scripts/` und die Skill `bbw-hko-heft-v42` ändern. Grundlage:
`docs/upgrade-v4.2/RUECKBLICK-produktion-2026-10-06.md` §4 und §5.1–5.4.
Entscheid Pietro 07.10.2026: **Beleg-Dateien liegen ausserhalb des Repos.**

Am besten nach den Prompts 3, 4 und 8. Sind sie noch nicht gelaufen
(`references/lauf.md`, `scripts/karten.mjs`, `scripts/check-namen.mjs` fehlen),
baut diese Session nichts davon nach — sie lässt die Anschlussstellen offen
und nennt sie in der Schlussmeldung.

```
ZIEL
Was das Tor heute nicht sieht, wird geprüft: alles Skriptbare durch Skripte
im Tor, alles andere durch eine feste Rolle der Skill, die ihr Ergebnis als
Datei abgibt, die wieder ein Skript prüft. Das Lösungs-Audit wird neu
gebaut. Kein Fehler wird vererbt.

ZUERST LESEN
RUECKBLICK-produktion-2026-10-06.md ganz; scripts/check-all.mjs,
check-v42.mjs, check-lf-loesung.mjs, messen-v42.mjs; die Skill: SKILL.md,
references/phase-9-tor.md, gegenleser.md, datenvertrag.md (Lösungsfelder),
phase-q-quellen.md (Form der Archivtexte); zwei Laufordner mit NACHTRAG
(2026-10-04-331, 2026-10-04-421) als Beispiele echter Fehler.

GRENZEN
- Keine Einheit, keine Karte, kein Renderer, kein Datenvertrag wird geändert.
  Die Beleg-Dateien sind NEBEN den Daten, nicht in ihnen.
- Kein Wortlaut aus Lehrmittel oder Quelle ins Repo — auch nicht in Tests,
  Beispielen, Fehlermeldungen von Dateien, die committet werden (Ausgaben
  auf der Konsole dürfen Anker zeigen; nach laeufe/ geschriebene Protokolle
  nennen nur Feld, Urteil und Fundstelle, nie den Anker).
- Jedes neue Skript: reines Node ohne Abhängigkeiten, nur lesend (ausser es
  schreibt ausdrücklich sein Protokoll), Exit 0/1/2 wie check-all, läuft
  ohne Netz (Ausnahme check-links). Fehlt das Archiv lokal: Exit 2 und
  HINWEIS, nie «grün».
- Bestand bleibt grün: Nach jeder Stufe check-all für alle publizierten
  v4.2-Einheiten. Macht ein neuer Check eine publizierte Einheit rot, ist
  das ein BEFUND (Liste), kein Grund, den Check zu lockern oder die Einheit
  zu ändern. Neue Checks sind für `status: publiziert` zunächst Warnungen,
  für Entwürfe Fehler.

STUFE A — Ablage und Format der Belege (ausserhalb des Repos)
Ort: <ARCHIV>/_pruefung/<ordnername>/  (ARCHIV = D:\OS\_lab\quellen-archiv\
bbw-hko, überschreibbar mit QUELLEN_ARCHIV wie in check-all). Unter
_pruefung/ liegen heute lose Dateien einer früheren Prüfung: nicht anfassen,
nur Unterordner anlegen.
- belege.json — eine Zeile je Lösungsfeld jedes Hefts und jeder Spur
  (LF1–LF4, jede Rasterzeile, Befund, Denkhilfe, Erwartungen der Vertiefung,
  Lösungsbild, Abschluss) und des Auftragsbogens:
    feld (Datei › JSON-Pfad) · spur · herkunft: quelle | lehrmittel |
    fallueberlegung | nrlp · anker (wörtlich, 5–12 Wörter; bei
    fallueberlegung leer) · wo (Karten-ID bzw. Kapiteldatei) · stelle
    (Zeitmarke mm:ss bzw. Seite) · urteil: stimmt | fundstelle_falsch |
    ableitung | falsch · hash (SHA-256 des geprüften Lösungstexts) ·
    geprueft_am · von (Rolle, Modell)
- fakten.json — eine Zeile je Rechts- oder Sachaussage über die Welt
  (Artikelnummer, Frist, Betrag, Prozent, Datum, «Stand …», Ergebnis einer
  Abstimmung): wortlaut_im_heft · feld · primaerquelle (URL) · abgerufen_am ·
  urteil: belegt | abweichend | nicht_belegbar · bemerkung
- fall.json — die erfundenen Fallzahlen der Situationen (Lohn, Preis,
  Mengen, Wochentage) je Heft: name · wert · einheit. Geschrieben vom
  Executor des Hefts, nicht vom Audit.
- JSON-Schemas dazu IM Repo unter scripts/schema/ (ohne Beispielinhalt aus
  Quellen); Beschreibung als references/belege.md der Skill.
Erhebe zuerst die Form der Archivtexte (quelle.md mit Zeilen «[mm:ss] …»;
Artikel ohne Zeitmarken; PDF/PNG ohne Text) und lege fest, was «stelle» je
Form heisst. Wo ein Archivtext keine Zeitmarken trägt, ist die Zeitmarken-
Prüfung nicht möglich: als HINWEIS je Karte ausgeben, nicht still bestehen.

STUFE B — Skripte im Tor
Jedes als eigene Datei, alle als Zeilen in check-all (für v4.2-Einheiten):
1. check-belege.mjs <ordner>
   - jedes Lösungsfeld der Einheit hat genau eine Zeile; keine Zeile ohne Feld
   - hash stimmt mit dem heutigen Text überein — sonst ERR_AUDIT_VERALTET
     (das erzwingt das erneute Audit nach jeder Änderung)
   - herkunft quelle/lehrmittel: der Anker steht (nach Normalisierung von
     Gross/Klein, Satzzeichen, Leerraum) im Archivtext der genannten Karte
     bzw. in der Kapiteldatei; bei Lehrmittel auf der genannten Seite
     (Marker [seite: N])
   - Zeitmarke: Die Zeile des Ankers liegt im Ausschnitt der Karte
     (verortung.von/bis) UND die im Heft bzw. in der Lösung genannte
     Zeitmarke weicht höchstens 3 Sekunden von der des Ankers ab
   - urteil falsch oder fundstelle_falsch → Fehler; ableitung → das Heft
     bzw. die Lösung muss die Aussage als Fallüberlegung/Deutung
     kennzeichnen (Wortliste aus references/sprache.md, sonst Fehler)
   - die Lösung nennt keine Karte, Seite oder Zeitmarke, die in ihren
     Belegzeilen nicht vorkommt
2. check-fakten.mjs <ordner>
   - findet im sichtbaren Text (Hefte, Lösungen, Auftragsbogen, Begleiter,
     Glossar) jede Aussage mit Gesetzeskürzel + Artikel (OR, ZGB, SVG, KVG,
     UVG, BV, SchKG, StGB, ArG, BBG …), jedes «Stand <Datum>», jede Zahl mit
     Einheit ausserhalb der Fallzahlen aus fall.json — und verlangt je
     Treffer eine Zeile in fakten.json mit urteil «belegt»
   - «abweichend» → Fehler; «nicht_belegbar» → Fehler, ausser die Stelle
     ist als Fallüberlegung gekennzeichnet
   - abgerufen_am älter als 12 Monate → Warnung
3. check-zeiger.mjs <ordner>
   - Quellenkarten: archiv_ref existiert; woerter stimmt mit dem Archivtext
     des Ausschnitts (±5 %); absaetze/Abs. N ≤ Absatzzahl; von < bis ≤ Dauer
   - «Heft A/B, S. n» und «S. n» in Schritten, Hinweisen, Checkliste,
     Auftragsbogen: Die Seite existiert und trägt das genannte Element
     (Zuordnung Feld → Seite aus dem Renderer herleiten, nicht raten;
     gemeinsam mit seitentext.mjs nutzen)
   - Lehrmittelseiten in Heften, Karten und Begleiter liegen in der
     genannten Kapiteldatei
   - jeder Schritt-Hinweis nennt eine Seite
4. check-zahlen.mjs <ordner>
   - Rechnungen im Text (a × b = c, a − b = c, Summen in Tabellen des
     Produkt- und Lösungsbilds, «x von y», Prozent) nachrechnen
   - jede Fallzahl aus fall.json steht überall mit demselben Wert; eine
     Zahl mit gleicher Einheit und gleichem Namen, aber anderem Wert → Fehler
   - Wochentage und Daten des Beispiels (S. 6) widersprechen der Situation
     nicht (einfache Regel: was die Situation ausschliesst, steht als Liste
     in fall.json)
5. check-kohaerenz.mjs <ordner> — der skriptbare Teil der Widersprüche:
   - die Handprüfungen aus phase-9-tor.md §3 Nr. 2–5 (gleiche Werte in
     Prinzip/Heft/Set; kein markanter Lösungssatz im Lernenden-Export;
     gesperrte Wörter im sichtbaren Text — der Einzeiler steht dort schon;
     Transliterationen)
   - gleiche Bezeichner und gleiche Anzahl in format_detail/«Das geben Sie
     ab», Checkliste S. 8, Lösungsbild, Bewertungsraster, Stationen des
     Auftragsbogens
   - kurzbeschrieb einer Quellenkarte gegen die Lösungen ihres Rasters:
     Wortüberlappung über Schwelle → Warnung «verrät die Lösung»
   - Begleiter sagt «Punkte», nicht «Stufe», wo das Raster Punkte führt
6. check-links.mjs [<ordner> | --alle] — mit Netz, NICHT im Tor: jede URL
   der Karten und Hefte, Status, Weiterleitung; Protokoll nach
   docs/cloud-run/laeufe/links-<datum>.txt. Für einen wöchentlichen Lauf
   vorbereiten (nur den Befehl nennen, nichts einplanen).
7. Budgets in check-v42.mjs nachtragen, die die Berichte als fehlend melden
   (erwartung, Lösungen S. 3 mit Medien, Kartentexte fuer/tun/beispiel,
   Stufentexte über 120 Zeichen, Zahlentabelle des Auftrags) — Werte an den
   16 vorhandenen Einheiten MESSEN (messen-v42), nicht schätzen; im Skript
   kommentieren, woran gemessen.
8. Bekannte Skriptfehler: seitentext.mjs verliert den Quellentext
   (CRLF/Archivformat); begleiter-marker.mjs braucht mehrere Durchgänge;
   check-einheiten schweigt ohne set.json; falsche Treffer und
   UTF-16-Zählung bei ERR_V42_AUFTRAG_SPALTEN.

STUFE C — Rollen der Skill (ersetzen das heutige Lösungs-Audit)
In references/gegenleser.md, neu references/audits.md, phase-9-tor.md und
(sobald vorhanden) lauf.md:
1. Lösungs-Audit, neu (Opus, je Heft und Spur):
   a) BLIND LÖSEN: Der Auditor bekommt Frage, Raster und Quelle bzw.
      Lehrmittelseiten in voller Auflösung (jede Zeile mit Zeitmarke bzw.
      Seitenmarke) — NICHT die Lösung. Er schreibt seine Antwort mit Ankern.
   b) VERGLEICHEN: Erst dann die Lösung; je Feld Urteil, Anker, Stelle.
   c) ABGEBEN: belege.json. Kein Prosabericht. check-belege muss grün sein,
      bevor der Lauf weitergeht.
   Der Auditor ändert nichts an der Einheit. Jede Änderung einer Lösung
   macht ihre Zeile ungültig (Hash) → nur die betroffenen Felder neu.
2. Fakten-Audit (Opus, mit Netz, je Einheit einmal und nach Änderungen):
   jede Aussage, die check-fakten findet, an der Primärquelle prüfen
   (fedlex.admin.ch, admin.ch, bfs.admin.ch, bag.admin.ch, ch.ch,
   Kantonsseiten; keine Medien, kein Wikipedia als Beleg). Ergebnis:
   fakten.json. Im Bauplan (Abschnitt «Fakten») Vorgegebenes wird
   nachgeprüft, nicht übernommen.
3. Lösbarkeitsprobe (ersetzt nichts, ergänzt die Lernenden-Gegenleser):
   Der Lernenden-Gegenleser gibt sein hergestelltes Produkt als Datei ab.
   Ein zweiter Agent (Sonnet), der nur Produkt, «Das geben Sie ab»,
   Kriterien mit Stufen und das Lösungsbild sieht, bewertet es. Befund,
   wenn ein sorgfältiges Produkt Stufe 3 in einem Kriterium nicht erreichen
   KANN, wenn es vom Lösungsbild in der Form abweicht, oder wenn LF4 nur
   eine vertretbare Antwort zulässt. Ergebnis: probe.json im selben
   Ordner (feld · befund · beleg), von check-belege mitgelesen (offener
   Befund → Fehler).
4. Gegenhör-Liste für Pietro wird ERZEUGT (scripts/gegenhoeren.mjs
   <ordner>): je Audio/Video Titel, Adresse der QR-Seite, von–bis, jede
   Zeitmarke, die Heft oder Lösung nennt, und je Stelle die Frage «hört man
   hier …?» aus dem Feldnamen — ohne Anker-Wortlaut.

STUFE D — Keine Vererbung
1. Einheit aus Einheit: set.json führt bei einer Anpassung KEIN neues Feld
   (Datenvertrag bleibt) — die Abstammung steht in
   <ARCHIV>/_pruefung/<ordner>/herkunft.json {abgeleitet_von, stand_commit}.
   check-belege: Eine abgeleitete Einheit braucht eigene belege.json und
   fakten.json (keine Kopie: gleicher Hash wie in der Vorlage bei anderem
   Text → Fehler). Ändert sich die Vorlage nach stand_commit in einem
   Lösungs- oder Faktenfeld, meldet das Tor die Abgeleitete «neu zu prüfen».
2. Geteilte Karten: Anschluss an scripts/karten.mjs (Prompt 4). Zusätzlich
   hier: Anker und Fakten einer Methodenkarte (Seite, «acht Regeln») werden
   wie Lösungsfelder belegt — <ARCHIV>/_pruefung/_karten/<id>.json.
3. Skelette und Skill: scripts/check-skelette.mjs füllt die Templates unter
   assets/ nicht mit Inhalt, prüft aber, dass sie selbst keine Regel
   verletzen (Anrede, gesperrte Wörter, Platzhalterform, Felder gegen
   types.ts). Feste Texte der Auftragsvorlagen in gegenleser.md (z. B.
   «1. Lehrjahr») werden aus der Einheit hergeleitet.
4. Rückweg: scripts/gleiche-stelle.mjs <feldpfad> <muster> sucht eine
   gefundene Fehlerform in allen Einheiten (Feld und regulärer Ausdruck)
   und listet Treffer. Regel in phase-9/audits.md: Stammt ein Fehler aus
   Skill, Skelett, Karte oder Renderer (Kürzel S, K, R), läuft diese Suche,
   bevor der Lauf endet; das Ergebnis steht im Bericht und in OFFEN.md.
5. Start-Riegel (in auto-modus.md bzw. lauf.md): Ein Lauf beginnt nicht,
   solange docs/cloud-run/OFFEN.md (sobald vorhanden) einen offenen Punkt
   der Art S oder P mit dem Vermerk «erzeugt Fehler» führt.

BEWEIS — an den echten Fehlern vom 05.10.
Die Abschlussrunden haben bekannte Fehler behoben. Sie sind die Messlatte:
1. Für drei Einheiten (3.3.1_kaufvertrag_beurteilen,
   4.2.1_risiken_absichern, 1.2.1_lernzeit_planen) den Stand VOR der
   Abschlussrunde in einen Temp-Ordner ausserhalb des Repos holen
   (git show <commit vor 10:20 am 05.10.>:<pfad>) und dort die neuen Audits
   und Skripte laufen lassen (Skripte brauchen dafür einen Schalter
   --wurzel <ordner>).
2. Tabelle: jeder Fehler, den der zugehörige NACHTRAG und der Korrektur-
   Commit nennen · gefunden von welchem Skript / welcher Rolle · nicht
   gefunden. Ziel: jeder Zeiger-, Zahlen- und Zeitmarkenfehler vom Skript;
   jeder Rechts- und Sachfehler vom Fakten-Audit; die Fälle «keine echte
   Wahl», «Stufe 3 unerreichbar» von der Lösbarkeitsprobe. Was nicht
   gefunden wird, steht mit Grund in der Tabelle — nicht nachbessern, bis es
   passt, sondern ehrlich ausweisen.
3. Dieselben drei Einheiten im heutigen Stand: Was melden die neuen Checks
   noch? Das ist die Befundliste für die publizierten Hefte (nicht beheben).
4. Kosten: Dauer und Zahl der Agenten des neuen Lösungs-Audits gegen das
   alte an einer Einheit, und Opus gegen Sonnet beim Blindlösen an
   denselben Feldern (Trefferquote an den bekannten Fehlern).
5. check-all für alle 16 v4.2-Einheiten: kein neuer FEHLER bei publizierten
   (nur Warnungen), bestand-v42 --pruefen unverändert, npm run build Exit 0.
6. Leck: git diff --cached enthält keinen Anker, keinen Quellen- oder
   Lehrmittelsatz (mit check-leck.mjs --staged, falls vorhanden; sonst die
   Leck-Funktion aus check-all über die neuen Dateien).

ABSCHLUSS
- Je Stufe ein Commit, kein Push. ENTSCHEIDE.md: neue Nummer mit dem
  Entscheid «Belege ausserhalb des Repos», Format, Folgen (das Tor braucht
  das Archiv; im Backup ist _pruefung/ mitzusichern — nur nennen).
- phase-9-tor.md §1: neue Reihenfolge des Tors; §3 «von Hand» schrumpft auf
  das, was wirklich kein Skript prüft.
- RUECKBLICK-produktion-2026-10-06.md nicht umschreiben; ein Abschnitt 7
  «Umgesetzt am …» mit der Beweis-Tabelle.
- Schlussmeldung: Beweis-Tabelle in Kurzform, Befundliste der publizierten
  Einheiten, offene Anschlussstellen (Prompts 3, 4, 8), und was ich
  entscheiden muss. Keine Rückfrage unterwegs, ausser ein Skript würde eine
  publizierte Einheit sichtbar verändern.
```
