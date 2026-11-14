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

**F10 · Laufzeit.** Ein Aufruf pro Heft kann 30–90 s dauern. Die Route setzt
die Vercel-Laufzeit auf 120 s (Astro-Adapter `maxDuration`). Reicht das im
Plan von Pietro nicht, ist das eine Frage an Pietro (offen, siehe Übergabe).
