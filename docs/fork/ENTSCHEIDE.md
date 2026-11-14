# Entscheide Fork-Pilot «Meine Fassung»

> Von der Orchestrierung getroffen nach den Vorgaben in
> `docs/ORCHESTRATION-fork.md`. Pietro kann jedem widersprechen.

**F1 · Original ändert sich nach dem Forken (14.11.2026).** Jede Ersetzung
trägt `original_hash` (sha256 über den kanonischen Originalwert). Stimmt er
beim Laden nicht mehr, wird sie nicht angewendet und als «Original hat sich
geändert» gezeigt. Sie bleibt gespeichert; die Lehrperson kann sie verwerfen.

**F2 · Hochgeladener Text.** Gespeichert wird nur der extrahierte Klartext im
privaten Bucket `fassung-texte`, die Originaldatei nicht. Word (.docx) wird mit
dem vorhandenen `jszip` aus `word/document.xml` gelesen (kein neues Paket).
PDF braucht ein Paket: **`unpdf`** (reines JS, für Serverless gebaut, keine
nativen Abhängigkeiten). Grenze 5 MB Datei, 20 000 Zeichen Klartext.

**F3 · Zuschnitt des EBA-Dossiers.** Ersetzt werden Einleitung «Was ist das»,
die Inhalte der sechs Info-Karten (Anzahl und Kennung bleiben, weil die Hefte
«Info-Karte A-01» usw. nennen), Satzanfänge und Vorgehen der zwei
Sprachkarten, das Grundprinzip, das Glossar und die Aufgaben des Leseblatts.
Kopf, Kennungen, Lehrgang, A2 und Aufbau bleiben (VERTRAG §3 D1–D8). Eigener
Modellaufruf, eigene Vorschau.

**F4 · Modell und Kostendach.** `OPENAI_MODEL` (kein Modellname im Code),
`FORK_MAX_AUFRUFE_PRO_TAG` (Vorgabe 20, gezählt pro Person und Tag in
Europe/Zurich). `store: false` bei jedem Aufruf.

**F5 · Granularität.** Die adressierbare Einheit ist der **Block**, wie ihn
die Lehrperson im Heft sieht (VERTRAG §3), nicht jedes einzelne Blatt im
JSON. Listen ohne Schlüssel werden ganz ersetzt. So bleibt das Adressformat
klein und stabil.

**F6 · `eigener_text` nur in der Spur ohne Medien.** Die Pflichtquelle der
Medien-Spur ist nicht ersetzbar (Invariante 4: `quellen`). Eine Fassung mit
eigenem Text ist darum auf `ohne_medien` festgelegt; die Medien-Variante
fehlt in Vorschau und ZIP der Fassung, mit Warnung.

**F7 · Vollständigkeit (4a) über Bestätigen.** Das Modell muss jede
Pflicht-Abhängigkeit entweder ersetzen oder ausdrücklich als «stimmt weiter»
bestätigen. Fehlt eine, ist der Vorschlag unvollständig und wird nicht zur
Übernahme angeboten. Übernommen wird pro Block, aber ein Block, von dem ein
anderer angenommener Block abhängt, wird mit angeboten (Gruppe je Auftrag).

**F8 · Begleiter bleibt Original.** `loadEinheit` baut den Begleiter aus den
unveränderten Rohheften, auch wenn eine Fassung aktiv ist (4b). Das Dokument
«Lösungen» dagegen folgt der Fassung (es gehört zum Heft, 4a).

**F9 · Glossar der Einheit bleibt.** `set.glossar` ist nicht ersetzbar; die
Begriffe gehören zur Kompetenz, nicht zum Fall. Punkte im Begriffsnetz einer
Fassung müssen Begriffe aus diesem Glossar sein.

**F11 · Hinweis zur Aufbewahrung bei OpenAI (offen für Pietro).** `store: false`
verhindert nur die Speicherung des Antwortzustands. Laut
https://developers.openai.com/api/docs/guides/your-data bewahrt OpenAI Anfragen
zur Missbrauchskontrolle standardmässig bis 30 Tage auf; für Training werden
API-Daten standardmässig nicht verwendet; ganz ohne Aufbewahrung nur mit
Zero Data Retention (Genehmigung durch OpenAI). Der Hinweis in der Oberfläche
sagt das so und verspricht nicht «nichts wird gespeichert». Ablehnungstexte
des Modells gehen nicht an den Browser (nur eine allgemeine Meldung).
`max_output_tokens` ist fest 32 000.

**F12 · Grenzen je Feld und eine Korrekturrunde (14.11.2026, nach dem ersten
echten Durchgang).** Mit nur «höchstens 15 % länger» überschritt das Modell bei
grösseren Aufträgen einzelne Budgets knapp (z. B. 116 statt 115 Zeichen); jedes
verworfene Pflichtfeld machte den ganzen Vorschlag unvollständig. Die Feldliste
nennt darum je Feld die Grenze in Zeichen (`anfrage.ts › grenze`, dieselbe Rechnung
wie `pruefeWert`, gemessen am Original). Bleiben Pflichtfelder offen, fragt die
Route einmal nach — nur für diese Pfade, mit dem Grund des Servers. Die
Nachfrage zählt nicht als eigenes Bündel für die Tagesgrenze; sie verdoppelt im
schlechtesten Fall Laufzeit und Kosten des Bündels.

**F13 · Netz: Wartezeit beim Verbindungsaufbau.** Node gibt jeder Adresse beim
Wechsel zwischen IPv4/IPv6 nur 250 ms; im lokalen Netz liefen alle Versuche ab
(`ETIMEDOUT`), obwohl curl die API erreichte. `openai.ts` setzt die Wartezeit auf
2 s (nur Server).

**F10 · Laufzeit.** Ein Aufruf pro Heft kann 30–90 s dauern. Die Route setzt
die Vercel-Laufzeit auf 120 s (Astro-Adapter `maxDuration`). Reicht das im
Plan von Pietro nicht, ist das eine Frage an Pietro (offen, siehe Übergabe).

**F14 · Schritt-Labels beim Produktwechsel (Entscheid Pietro, 14.11.2026).**
Invariante 5 wird gelockert: Bei `handlungsprodukt_aendern` darf der Text eines
Schritt-Labels nach der Nummer ersetzt werden; Nummer («01 »…), Anzahl und
Reihenfolge der fünf Schritte bleiben. Weil das Label der Listenschlüssel ist,
bleibt das Adressformat unverändert (Invariante 1): Neu ist nur das ganze Feld
`handlungsprodukt.schritte` (H24L) bzw. `gemeinsamer_auftrag.schritte` (G6L) als
ein Block. Es ersetzt beim Produktwechsel die Einzel-Hints als Pflicht.

**F15 · EBA-Dossier zieht bei Situations- und Produktwechsel mit (Entscheid
Pietro, 14.11.2026).** Bei EBA ruft die Bündel-Route auch bei
`situation_umformulieren` und `handlungsprodukt_aendern` das Dossier auf (eigener
Aufruf wie beim eigenen Text). Pflicht: Info-Karten und Sprachkarte des
betroffenen Hefts; erlaubt: D1–D8.

**F11, F10:** Wortlaut zu OpenAI und Laufzeit 300 s global bestätigt (Pietro, 14.11.2026).

**F16 · Not-Aus und Grenzen in der Datenbank (Pietro «2–4 bauen», 14.11.2026).**
Migration 029: Tabelle `fork_einstellungen` (eine Zeile) mit `aktiv`,
`max_pro_tag_person` (null = `FORK_MAX_AUFRUFE_PRO_TAG`), `max_pro_tag_gesamt`
(Vorgabe 100, alle Personen) und `text_aufbewahrung_tage`. Wirkt sofort, ohne
Deploy: `update public.fork_einstellungen set aktiv = false;` im SQL-Editor.
Gezählt wird in `fork_aufrufe`, eine Zeile pro Modellaufruf. Die Funktion
`fork_aufruf_reservieren` prüft und vermerkt unter einer Sperre in einer
Transaktion — die frühere Zählung «zählen, dann einfügen» liess zwei gleichzeitige
Anfragen gemeinsam über die Grenze. Korrekturrunden (F12) zählen jetzt zur
Gesamtgrenze, nicht zur Grenze pro Person, und halten beim Not-Aus an. Fehlt die
Einstellungszeile, ist die Funktion aus. Ohne Migration 029 gilt die alte Zählung
pro Person (Warnung im Log).

**F17 · Löschfrist für hochgeladene Texte (Pietro, 14.11.2026).** Klartexte im
Bucket `fassung-texte` werden nach `text_aufbewahrung_tage` (Vorgabe 30) gelöscht.
Ohne Cron: Jedes neue Bündel räumt bis zu 100 abgelaufene Texte aller Personen mit
auf; das Bündel vermerkt `text_geloescht_am`. Folge: Wird die Plattform länger
nicht genutzt, liegen Texte länger als die Frist — bis zum nächsten Bündel.

**F18 · Automatische Prüfungen (Pietro, 14.11.2026).** `pruefungen.ts`:
Du-Anrede in Feldern für Lernende wird verworfen (Hausregel «Sie»), ausser das
Original desselben Felds duzt schon; Zitate in Anführungszeichen und Gesprächszüge
(`wechsel[n]`) zählen nicht. Bei einem Pflichtfeld fragt die Korrekturrunde mit
diesem Grund nach. Zahlen (ab drei Ziffern, mit Trennzeichen oder Dezimalstelle;
Daten und Nummern wie 1.3.1 nicht), die im Heft mehrmals stehen und vom Vorschlag
nur an einem Teil der Stellen geändert werden, ergeben eine Warnung in der
Vorschau, kein Verwerfen. Geprüft wird pro Datei — zwischen Heft und Dossier nicht.
