# Orchestration brief — «Meine Fassung»: Einheiten forken mit Kommentar und Bot (Pilot KT1)

Füge dies als Eröffnungsanweisung der Claude-Code-Session ein, die den Pilot
baut. Arbeitsverzeichnis: `D:\OS\dev\bbw-hko`. Hauptsession: **Opus 5.5**.

---

## Mission

Lehrpersonen sollen eine v4.2-Einheit an ihre Klasse anpassen können, ohne das
Original zu verändern. Sie markieren im Heft Blöcke, schreiben Kommentare dazu
(optional mit einem eigenen Text als Word, PDF oder eingefügt), schicken das
Bündel ab, sehen die Vorschläge des Modells als **Vorschau im Heft** und
übernehmen sie Block für Block. Das Ergebnis ist ihre **eigene Fassung** der
Einheit. Auf der Einheitenseite schalten sie zwischen «Original» und «Meine
Fassung» um.

Das ist **Feature-Bau auf einem fertigen Datenvertrag**: kein neues Layout,
kein neuer Renderer, keine Änderung an bestehenden Einheiten. Eine Fassung ist
eine **Liste von Feld-Ersetzungen** über dem Original (wie
`jahresplanung_plans` über dem Basiskalender), nie eine Kopie der Einheit. Das
Modell wird über **direkte API-Aufrufe** an OpenAI angesprochen, ein Aufruf pro
abgeschicktem Bündel und Heft. Es gibt keinen Agenten, keine Warteschlange und
keinen Worker.

Vier Aufträge im Pilot:

| Auftrag | Was die Lehrperson will |
|---|---|
| `leitfrage_umformulieren` | Eine Leitfrage anders oder einfacher formulieren; die Lösung gilt weiter |
| `eigener_text` | Leitfragen (und ihre Lösungen) auf einen hochgeladenen Text umstellen |
| `situation_umformulieren` | Handlungssituation anpassen: anderer Beruf, andere Lage |
| `handlungsprodukt_aendern` | Ein anderes Handlungsprodukt, bei gleichen fünf Schritten |

Fertig ist der Pilot, wenn eine KT1-Person auf einer EFZ- und einer
EBA-Einheit im Format v4.2 alle vier Aufträge von der Markierung bis zum
Download der eigenen Fassung durchspielen kann, die Tore unten grün sind und
das Original Byte für Byte unverändert rendert. Ein Datum gibt es nicht.

Bewusst zurückgestellt: der Hintergrund-Prüfer, der Unstimmigkeiten in KN,
Begleiter und KI-Toolbox findet und Anpassungen vorschlägt; die Öffnung für
alle Lehrpersonen; das Zurückführen guter Anpassungen ins Original; mehrere
Fassungen pro Lehrperson; Einheiten in älteren Layouts.

**Entscheide von Pietro (14.11.2026) — gelten:**

- OpenAI direkt mit API-Key, kein Azure.
- Eigene Texte als eingefügter Text, Word und PDF.
- Nur das neuste Layout (`template: "heft_8page_v42"`), EBA eingeschlossen.
- Zuerst testet nur KT1.
- Die Anpassungen werden zugunsten aller Lehrpersonen weiterverarbeitet; das
  steht beim Start sichtbar in der Oberfläche.
- Eine Fassung pro Lehrperson und Einheit, Umschalter auf der Einheitenseite.
- Kommentare werden gebündelt abgeschickt, Vorschläge zuerst als Vorschau im
  Heft gezeigt und dann pro Block übernommen.
- Ändert sich das Handlungsprodukt, gibt es eine Warnung, dass der KN der
  Plattform möglicherweise nicht mehr passt. Der KN wird nicht mitgeändert.

**Offen — du entscheidest nach diesen Vorgaben und hältst es in
`docs/fork/ENTSCHEIDE.md` fest; Pietro kann widersprechen:**

- *Original ändert sich nach dem Forken.* Vorgabe: Jede Ersetzung merkt sich
  den Hash des Originalwerts, den sie ersetzt. Stimmt er nicht mehr, wird die
  Ersetzung nicht angewendet und als «Original hat sich geändert» gezeigt.
- *Hochgeladener Text.* Vorgabe: Der extrahierte Klartext wird gespeichert
  (privater Bucket), die Originaldatei nicht. Grund: die Weiterverarbeitung
  durch KT1 braucht den Text, das Layout der Datei nicht.
- *Wie weit das neue EBA-Dossier reicht.* Entschieden ist (Pietro,
  14.11.2026): Bei EBA entsteht mit dem Auftrag `eigener_text` auch ein neues
  Dossier. Offen ist nur der Zuschnitt. Vorgabe: Die Fassung ersetzt die
  Inhaltsfelder von `dossier.json` (Wissensteile, Glossar, Leseblatt,
  Sprachhilfen), die sich auf den alten Text stützen; `kopf`, `id`, Lehrgang,
  Sprachniveau A2 und der Aufbau des Dossiers bleiben. Lies den Aufbau an
  `1.1.1_lehrvertrag_orientieren_v42/dossier.json` und `DocEbaDossier.tsx`
  ab, lege die Feldliste im Vertrag fest und zeige sie Pietro beim
  Vertragsstopp. Das Dossier ist der grösste Einzelvorschlag des Pilots:
  eigener Aufruf, getrennt vom Heft, mit eigener Vorschau.
- *Modell und Kostendach.* Vorgabe: Modell über `OPENAI_MODEL`, Tagesgrenze der
  Aufrufe pro Person über `FORK_MAX_AUFRUFE_PRO_TAG`. Kein Modellname im Code.

## State of the repo

Schon vorhanden — nicht neu bauen:

- **Ein Ladepunkt für alle Renderer.** `loadEinheit(slug, opts)` in
  `src/lib/einheiten/index.ts` baut aus den Rohdateien die Renderer-Form:
  `resolveSpur` → `withMethoden` → `withQuellen` → `withGlossar` (`ladeHeft`).
  HTML, Word, ZIP, Deck und Begleiter lesen nur dieses Ergebnis. Die
  Einheitenseite ruft ihn in `src/pages/einheiten/[setKey].astro` auf und
  reicht das Set an die Insel `EinheitWorkbench.tsx` (`client:only`).
- **Zwei Stadien der Daten.** Auf der Platte liegen LF1/LF2 im Kern und
  LF3/LF4 unter `spuren.<spur>.leitfragen`; Methoden und Quellen sind Kürzel.
  Nach `loadEinheit` ist alles aufgelöst. Typen und Kommentare dazu:
  `src/lib/einheiten/types.ts` (`SituationJson`, `Spur`, `Leitfrage`,
  `LeitfrageLoesung`, `GemeinsamerAuftrag`, `FeedbackKriterium`).
- **EFZ/EBA-Unterschiede an einer Stelle.** `src/lib/einheiten/v42-profil.ts`
  (`istEba`, `rasterLeitfrage`, `beurteilenLeitfrage`, `kernLeitfragen`). EBA
  hat drei Leitfragen, eine Spur und ein Dossier.
- **v4.2-Renderer.** `src/components/einheiten/docs/DocHeftV42.tsx` mit
  `heft-v42/seiten-1-4.tsx`, `seiten-5-8.tsx`, `gemeinsam.tsx`; Word in
  `src/lib/einheiten/docx-heft-v42*.ts`. Die Renderer tragen heute **keine**
  Feldmarken im DOM.
- **Der Konsistenz-Vertrag.** `src/lib/werkstatt/kontext.ts` reduziert ein
  geladenes Set auf die Felder, die erzeugtes Material mit der Einheit
  konsistent halten; `prompt.ts` rendert sie als Auflagen. Wiederverwenden,
  nicht nachbauen.
- **Muster für private Uploads.** `src/pages/api/materials/[id]/files.ts`:
  Service-Role-Client nach expliziter Eigentums- und Rollenprüfung, privater
  Bucket, Auslieferung nur über signierte URL.
- **Muster für Delta-Tabellen.** `jahresplanung_plans` (Migration `011`) und
  `src/pages/api/jahresplan/`.
- **Überlauf messen.** `node scripts/export-v42.mjs <slug> --out <dir>`
  schreibt alle v4.2-Dokumente, `node scripts/messen-v42.mjs <dir>` misst jede
  A4-Seite im Browser. Unterbau: `scripts/v42-ssr.mjs`.
- 19 Einheiten tragen `heft_8page_v42`. Gold EFZ:
  `1.3.1_konsum_verantworten_v42`. Gold EBA:
  `1.1.1_lehrvertrag_orientieren_v42`. Eine Einheit ist als Rohdaten rund
  150 KB gross, ein Heft rund 40 KB.
- Letzte Migration: `027_ansprache_zurueckgenommen.sql`. Die nächste ist `028`.
- **Rückkehrpunkt.** Der Tag `vor-fork-pilot` zeigt auf den Stand von
  `origin/main` am 14.11.2026, vor jeder Zeile dieses Baus. `eba-v42-gold` ist
  inhaltlich mit `origin/main` identisch (die EBA-Renderer sind in `main`).
  Gearbeitet wird auf dem Branch `fork-pilot`, der von diesem Stand abzweigt
  und diesen Brief bereits enthält. Zurück zum Ursprung heisst:
  `git switch main`. Der Tag wird nie verschoben oder gelöscht.

Noch nicht vorhanden: jede OpenAI-Anbindung (kein Paket, keine Env-Variable),
jede Text-Extraktion aus Word oder PDF, `maxDuration` für Vercel-Funktionen.

Massgebliche Quellen, in dieser Rangfolge:

| Pfad | Was es ist |
|---|---|
| Dieser Brief | Auftrag, Invarianten, Rollen. Entschieden. |
| `docs/fork/VERTRAG.md` | Entsteht in Schritt 1 durch dich. Danach bindend für alle Executor. |
| `src/lib/einheiten/types.ts` | Der Datenvertrag der Einheiten. Wird nicht geändert. |
| `docs/upgrade-v4.2/01_Leitfaden_v4.2.md` | Was auf welcher Heftseite steht, Zeichenbudgets. Nachschlagen bei Fragen. |
| `docs/upgrade-v4.2/ENTSCHEIDE.md` | Frühere Entscheide zum Format (E19 Lösungen, E25 Auftragsprodukte, E46/E47 EBA). |
| `.claude/skills/bbw-hko-heft-v42/references/` | Regeln, nach denen die Originale entstanden sind (`kohaerenz.md`, `eba-profil.md`, B1/A2-Sprache). Quelle für die Auflagen im Prompt. |
| `CLAUDE.md` | Architektur, Befehle, Rollen, Designregeln. |

## Non-negotiable invariants

Bei jedem Zusammenführen prüfen. Ein Verstoss ist ein Fehler, egal wie gut der
Rest ist.

1. **Das Adressformat einer Ersetzung ist endgültig, sobald die erste Fassung
   gespeichert ist.** Eine Ersetzung adressiert ein Feld in der **Rohform auf
   der Platte** (Datei + Pfad, z. B. `herausforderung_A` +
   `spuren.ohne_medien.leitfragen[nr=3].text`), nie in der aufgelösten Form.
   Listenelemente werden über ihren Schlüssel adressiert (`nr`, `kn_kriterium`,
   `label`), nie über den Index. Wird das Format später geändert, lassen sich
   gespeicherte Fassungen nicht mehr lesen.
2. **Die Ersetzungen werden vor `ladeHeft` angewendet**, auf die Rohdateien,
   über eine Option von `loadEinheit`. Nur so sehen HTML, Word, ZIP und Deck
   dieselbe Fassung, ohne dass ein Renderer davon weiss.
3. **Ohne Fassung ist alles wie vorher.** `loadEinheit(slug)` ohne
   Fassungs-Option liefert für jede Einheit dasselbe Ergebnis wie vor dem Bau.
   Der Export der beiden Gold-Einheiten ist vor und nach jeder Aufgabe
   dateigleich, abgesehen von den neuen `data-feld`-Attributen im HTML.
4. **Ersetzt werden nur Felder der Positivliste.** Die Liste steht in
   `docs/fork/VERTRAG.md` und als Code an genau einer Stelle. Der Server
   verwirft jede Ersetzung ausserhalb der Liste, auch wenn das Modell sie
   liefert. Nie ersetzbar: `template`, `lehrgang`, `nrlp`, `buchstabe`, IDs,
   Anzahl und Reihenfolge von Leitfragen, Schritten und Kriterien, bei den
   Kriterien ausserdem `kn_kriterium` (der Name), `dimension` und die Zahl der
   vier Stufen, `raster.spalten/zeilen`-Anzahl, `quellen`, alles in `kn.json`,
   `prinzip.json`, `ki.json`, `lernprompt.json`, `lernbegleiter.json`,
   `begleiter.md`.
4a. **Für die Lehrperson muss das Heft stimmen** (Entscheid Pietro,
   14.11.2026). Eine Fassung gilt nur für eine Person; darum zieht ein
   Auftrag alles nach, was im Heft, im Auftragsbogen und im Dokument
   «Lösungen» davon abhängt. Ein Vorschlag, der ein abhängiges Feld
   stehen lässt, ist unvollständig und wird nicht zur Übernahme angeboten.
   Das gilt ausdrücklich für die Kriterien im Heft: `indikator_produkt`
   folgt immer dem Handlungsprodukt; der Wortlaut von `stufen` (bei EBA auch
   `name_lernende`, `stufen_lernende`) wird dort angepasst, wo er Begriffe
   oder ein Produkt nennt, die es in der Fassung nicht mehr gibt. Die
   Abstufung der vier Stufen bleibt. Ebenso folgen `beispielbild`,
   `loesungsbild`, `scaffolding`, `abgaben`, die `hint` der Schritte und das
   `tun` der Methoden; `methoden[].ref` darf auf eine andere **bestehende**
   Karte aus `src/data/methoden/` wechseln, neue Karten entstehen nicht.
   Bei EBA gehört das Dossier dazu: Mit einem eigenen Text entsteht ein
   neues Dossier in A2, im selben Aufbau wie das Original.
4b. **Ausserhalb des Hefts wird gewarnt, nicht geändert.** KN, Begleiter und
   KI-Toolbox bleiben im Original. Die Fassung zeigt, was dort nicht mehr
   passt, und nennt die Kriterien, deren Wortlaut im Heft jetzt vom KN der
   Plattform abweicht.
5. **Die fünf Schritte bleiben.** `handlungsprodukt.schritte` und
   `gemeinsamer_auftrag.schritte` behalten Anzahl und `label`; ersetzbar ist
   nur `hint`.
6. **Lösungen bleiben bei der Lehrperson.** Eine Ersetzung darf kein Feld, das
   nur die Lehrperson sieht (`loesung`, `erwartungshorizont`, `loesungsbild`,
   `loesung_zeilen`, `abschluss.loesung`), in ein Feld für Lernende
   verschieben. Die Trennung im Renderer wird nicht angefasst.
7. **Nichts aus einer Fassung gelangt ins Repo.** Das Repo ist öffentlich.
   Hochgeladene Texte, Kommentare und Ersetzungen liegen nur in Supabase.
   Keine Testdatei mit fremdem Text unter `src/`, `docs/` oder `scripts/`.
   Zum Testen eigene, selbst geschriebene Texte verwenden.
8. **Der OpenAI-Key bleibt auf dem Server.** `OPENAI_API_KEY` ohne
   `PUBLIC_`-Präfix, nur in API-Routen gelesen, nie geloggt, nie in einer
   Antwort an den Browser.
9. **An OpenAI geht kein Personenbezug.** Kein Name, keine E-Mail, keine
   Nutzer-ID der Lehrperson. Beim Upload steht der Hinweis, dass keine Namen
   und keine Texte von Lernenden hochgeladen werden.
10. **Schreiben nur über die API mit Service-Role nach Eigentumsprüfung**, wie
    bei `meldungen`. RLS: Eigentümerin liest die eigene Fassung, `kt1` liest
    alle, `deny_gast`. Keine insert/update-Policies.
11. **Zugang im Pilot nur für `kt1`.** Eine Funktion `darfForken(role)` an
    einer Stelle; Seite, Knopf und jede API-Route fragen sie.
12. **Nur Einheiten mit `heft_8page_v42`.** Bei jeder anderen Einheit erscheint
    weder Knopf noch Umschalter, und die API lehnt ab.
13. **Die QR-Seite `/m/<ordner>` zeigt immer das Original.** Sie kennt keine
    Fassungen.
14. **Zaun.** Nicht ändern, ausser eine Aufgabe sagt es ausdrücklich:
    `src/data/**`, `public/nrlp*`, `src/lib/einheiten/types.ts`,
    `src/lib/einheiten/docx-*.ts`, `scripts/check-*.mjs`, `.claude/skills/**`,
    `supabase/setup_full.sql`, alle Seiten ausserhalb `/einheiten/**` und
    `/admin/**`. Lässt sich eine Aufgabe innerhalb des Zauns nicht lösen:
    anhalten und melden, nicht den Zaun erweitern.
15. **Sprache und Gestaltung.** Oberfläche und Kommentare im Code auf Deutsch,
    Schweizer Schreibweise ohne Eszett, echte Umlaute. Ein Grün, keine neue
    Farbe (`CLAUDE.md` › Design system). Geänderte Blöcke werden über Kontur
    oder Hinterlegung in `--brand-tint` gezeigt.
16. **Migration und Deploy macht Pietro.** Du schreibst
    `supabase/migrations/028_einheit_fassungen.sql` idempotent und wendest sie
    nicht auf das Live-Projekt an. Kein Push, kein Deploy, kein Setzen von
    Vercel-Variablen.

## Verification gates

Nichts ist fertig, bevor das vom Repo-Wurzelverzeichnis aus durchläuft:

```
npm run build
node --test scripts/check-eba.test.mjs scripts/fork/*.test.mjs
node scripts/check-all.mjs 1.3.1_konsum_verantworten_v42 1.1.1_lehrvertrag_orientieren_v42
node scripts/export-v42.mjs 1.3.1_konsum_verantworten_v42 --out <temp>/efz
node scripts/export-v42.mjs 1.1.1_lehrvertrag_orientieren_v42 --out <temp>/eba
node scripts/messen-v42.mjs <temp>/efz
node scripts/messen-v42.mjs <temp>/eba
```

`node --test scripts/` (das Verzeichnis als Argument) schlägt fehl; die
Testdateien werden einzeln genannt. `scripts/fork/*.test.mjs` gibt es ab
Schritt 2. `npm run build` schliesst über `prebuild` die nRLP-Prüfung und den
Index-Builder ein; `src/data/einheiten.index.json` und `public/nrlp/` werden
erzeugt und nie von Hand geändert. `check-all` beweist, dass die Originale
unberührt sind. Der Export vor und nach einer Aufgabe wird verglichen
(Invariante 3): Nimm den Stand vor Schritt 2 einmal als Referenz auf.

Was kein Befehl prüft, prüfst du am Schluss jeder Aufgabe selbst:

- Die Positivliste im Code und in `docs/fork/VERTRAG.md` nennen dieselben Felder.
- Jeder Block mit `data-feld` im HTML zeigt auf ein Feld, das in der Rohdatei
  existiert (ein kleines Skript unter `scripts/fork/` darf das prüfen).
- `git grep -n "OPENAI_API_KEY"` trifft nur Dateien unter `src/pages/api/` und
  `src/lib/fork/` sowie `.env.example`.
- Im Dev-Server als `kt1` angemeldet: Die vier Aufträge laufen auf beiden
  Gold-Einheiten bis zum Download. Als `lp` und `gast`: kein Knopf, API 403.
  Pietro meldet sich für die Session selbst als Admin im Browser an; du
  fragst nie nach dem Passwort und gibst keines ein. Für die Gegenprobe als
  `lp` gelten die Seed-Konten aus `CLAUDE.md` › Database Setup.

---

# Role policy

## OPUS 5.5 — Orchestrator, Hauptsession, hoher Aufwand

"Der Orchestrator besitzt die Hauptsession, die Anforderungen, das Urteil, die
Integration und die Schlussprüfung."

"Der Orchestrator führt grosse Bauten nicht selbst aus. Für eine begrenzte,
schwierige Umsetzung schreibt er die Spezifikation, startet einen
Opus-5.5-Executor als Subagenten und prüft das Ergebnis. Er bleibt bei
Anforderungen, Urteil und Integration; ein Executor, der auf einer
freigegebenen Spezifikation schnell zum Ziel kommt, ist erwünscht und kein
Mangel."

"Im Auftrag stehen nur das genaue Delta, der Umfang, die Ausgabe, die
Abbruchbedingung und die Ausschlüsse."

Der Orchestrator entscheidet selbst und delegiert nicht:

- **Den Vertrag `docs/fork/VERTRAG.md`**: Adressformat der Ersetzungen
  (Invariante 1), Positivliste der Felder je Auftrag, Abhängigkeiten zwischen
  Feldern (welche Felder ein Auftrag zusammen anfassen muss), Zeichenbudget je
  Feld, Form der Tabelle. Alles andere im Bau bezieht sich darauf.
- **Die Abhängigkeiten je Auftrag** (Invariante 4a): die vollständige Liste
  der Felder in Heft, Auftragsbogen und Lösungen, die ein Auftrag zusammen
  anfassen muss, und der Wortlaut der Warnungen nach 4b.
- **Was an OpenAI geht.** Der genaue Inhalt der Anfrage (Invariante 9) und die
  Auflagen aus dem Konsistenz-Vertrag.
- **Die Migration `028`** vor der Übergabe an Pietro, Zeile für Zeile.
- Die Schlussprüfung vor der Übergabe.

Der Orchestrator fragt Pietro, statt allein zu entscheiden, wenn: ein Auftrag
sich mit der Positivliste nicht sinnvoll erfüllen lässt; ein Feld gebraucht
würde, das Invariante 4 sperrt; die Laufzeit einer Vercel-Funktion für ein
Bündel pro Heft nicht reicht; der Vertrag von OpenAI etwas über Speicherung
oder Training sagt, das Invariante 9 oder dem Hinweis in der Oberfläche
widerspricht; der Zaun (Invariante 14) aufgehen müsste.

## OPUS 5.5 — Executor für schwierige, begrenzte Aufgaben

In jeden Executor-Auftrag einfügen:

"Liefere den verlangten Umfang und halte an, bevor du Ungefragtes tust."

"Korrigiere einen unwesentlichen Fehler stillschweigend. Melde ihn nur, wenn
er eine Zahl, eine Schlussfolgerung oder einen Entscheid ändert."

"Ersetze Belege und frisches Nachschlagen nicht durch Zuversicht oder
Selbstprüfung." Dazu für dieses Projekt: Feldnamen und Seitenzuordnung kommen
ausschliesslich aus `src/lib/einheiten/types.ts`, den Renderern unter
`src/components/einheiten/docs/heft-v42/` und den beiden Gold-Einheiten, nie
aus der Erinnerung. Alles zur OpenAI-API (Endpunkt, Structured Outputs,
Datei-Eingabe, Grenzen) wird in der aktuellen offiziellen Dokumentation
nachgeschlagen und im Rückgabefeld mit URL belegt; nichts davon wird aus dem
Gedächtnis geschrieben.

Ein Executor pro begrenzter Einheit Arbeit:

- **Ein Modul mit seinem Test** (eine Datei unter `src/lib/fork/` plus
  `scripts/fork/<name>.test.mjs`), oder **eine API-Route**, oder **eine
  Oberfläche in einer Komponente**. Braucht eine Aufgabe zwei
  Spezifikationen, sind es zwei Aufgaben.

Vorlage für den Executor-Auftrag:

```
<Ein Satz im Imperativ, z. B.: Schreibe src/lib/fork/anwenden.ts.>

Spec:      docs/fork/VERTRAG.md § <Abschnitt>
Sources:   <genau die Dateien, auf die sich die Aufgabe stützen darf>
Pattern:   <nächstes bestehendes Beispiel, z. B. src/pages/api/jahresplan/[id].ts>
Budget:    <Obergrenze, z. B. eine Datei, höchstens 250 Zeilen, plus Test>

Must hold: <die 3–5 Invarianten aus dem Brief, die hier gelten, mit Nummer>

Out of scope: <benannte Dateien und Anliegen, die nicht angefasst werden>

Done when: <beobachtbare Bedingung, in der Regel ein Befehl, der durchläuft>
Return:    geänderte Dateien · Ergebnis des Done-when-Befehls ·
           was du NICHT belegen konntest · Fragen an den Orchestrator
```

## SONNET 5.5 — einfache und parallele Aufgaben

"Setze es frei für parallele Arbeit ein, die pro Stück ein Urteil braucht:
Lesungen, Audits, Durchsichten. Gib ihm einen genauen Auftrag, eine definierte
Ausgabe und eine Abbruchbedingung."

"Erledige genau das Verlangte und halte an. Prüfe nicht das umliegende System,
melde keine Nachbarprobleme und empfiehl keine weiteren Verbesserungen."

"Feststellen oder berichten ist keine Erlaubnis zu korrigieren. Ein Auftrag
für eine Datei ist keine Erlaubnis für verwandte Änderungen."

"Erzeuge keine Subagenten und delegiere nicht."

Sonnet übernimmt hier auch das Mechanische (es gibt keine Haiku-Stufe):
Rückgaben sind herausgezogene Kennzahlen und Pfade, nie Rohauszüge.

Natürliche Aufteilung für diesen Bau, je ein Worker, parallel:

- **Feldinventar je Heftseite.** Ein Worker pro Renderer-Datei
  (`seiten-1-4.tsx`, `seiten-5-8.tsx`, `gemeinsam.tsx`, Auftragsbogen): Welches
  Datenfeld wird in welchem Block gedruckt, in welcher Rohdatei liegt es?
  Ausgabe als Tabelle. Keine Änderungen.
- **Abhängigkeits-Lesung.** Ein Worker pro Auftrag und Gold-Einheit: Welche
  Felder nennen Person, Beruf oder Betrieb der Situation; welche nennen das
  Handlungsprodukt? Ausgabe: Liste der Feldpfade. Keine Änderungen.
- **`data-feld` einsetzen**, nachdem der Vertrag steht: ein Worker pro
  Renderer-Datei, nur das Attribut, kein anderes Zeichen.
- **Blinde Lesung der Vorschläge.** Ein Worker pro Auftrag liest Original und
  übernommene Fassung einer Gold-Einheit als Lehrperson: Stimmt das Heft in
  sich? Bei EBA: bleibt die Sprache auf A2? Keine Korrekturen.
- **Leck-Durchsicht am Schluss.** Enthält der Diff des Branches fremden Text,
  einen Schlüssel oder einen Namen? Keine Korrekturen.
- Kleine, klar umrissene Bauteile: `.env.example` ergänzen, Hinweis- und
  Warntexte setzen, Admin-Liste nach bestehendem Muster.

---

## Suggested build order

Der Abhängigkeitsgraph, kein Zeitplan:

1. **Inventar und Vertrag.** Sonnet-Lesungen (Feldinventar, Abhängigkeiten) →
   du schreibst `docs/fork/VERTRAG.md`: Adressformat, Positivliste je Auftrag,
   Abhängigkeiten, Budgets, Tabellenform, Anfrage- und Antwortschema. **Stopp:
   Pietro liest den Vertrag**, bevor irgendetwas gespeichert wird.
2. **Kern ohne Netz** (Opus-Executor, je mit Test):
   `src/lib/fork/adresse.ts` (Pfad lesen und setzen auf der Rohform),
   `positivliste.ts`, `anwenden.ts` (Ersetzungen mit Hash-Prüfung anwenden),
   dann die Fassungs-Option in `loadEinheit`. Tor: Invariante 3.
3. **Speicher.** Migration `028` (Tabelle `einheit_fassungen`: Eigentümerin,
   Einheit, Ersetzungen, Verlauf der Bündel mit Kommentaren und Vorschlägen
   samt angenommen/verworfen; Bucket für Klartexte) und die API-Routen unter
   `src/pages/api/fassungen/`. Hängt an 1.
4. **Markieren.** `data-feld` in den Renderern (Sonnet), dann die
   Kommentar-Oberfläche in der Workbench (Opus): Block anklicken, Auftrag
   wählen, Kommentar schreiben, sammeln, abschicken. Hängt an 1.
5. **Modellaufruf** (Opus): `src/lib/fork/anfrage.ts` baut aus Bündel,
   Positivliste und Konsistenz-Vertrag die Anfrage; `src/lib/fork/openai.ts`
   ruft auf und prüft die Antwort gegen Schema, Positivliste und Budget. Dazu
   die Text-Extraktion für Word und PDF. Hängt an 2 und 3.
6. **Vorschau und Übernehmen** (Opus): Vorschläge über das Heft legen,
   geänderte Blöcke zeigen, pro Block annehmen oder verwerfen, Überlauf im
   Browser messen und warnen. Hängt an 4 und 5.
7. **Umschalter, Warnungen, Download.** «Original | Meine Fassung» auf der
   Einheitenseite; Warnung zum KN nach geändertem Handlungsprodukt; Vermerk
   «angepasst, nicht von KT1 geprüft» in der Fusszeile der eigenen Fassung;
   ZIP der Fassung ohne die Bausteine, die nicht mehr passen. Hängt an 6.
8. **Admin-Sicht** (Sonnet nach Muster von `src/pages/admin/`): Liste aller
   Fassungen mit Person, Einheit, Aufträgen und Ersetzungen im Vergleich.
9. Vollständiger Durchgang durch dich auf beiden Gold-Einheiten, danach die
   Sonnet-Lesungen (blind, Leck), dann Übergabe an Pietro mit Migration,
   Liste der Env-Variablen und offenen Punkten.

## Explicitly out of scope

Nicht anfassen; gehört in eine spätere Phase oder eine andere Session:

- Ein Agent oder Worker im Hintergrund, Auftragstabellen, Warteschlangen.
- Anpassungen an `kn.json`, `begleiter.md`, `ki.json`, `lernprompt.json`,
  `lernbegleiter.json` in einer Fassung, auch nicht als Vorschlag.
  `dossier.json` nur beim Auftrag `eigener_text` einer EBA-Einheit.
- Einheiten ohne `heft_8page_v42` (3er-Sets, ältere EBA-Einheiten),
  `/situationen/**`, `/einreichen`, `/vorlagen`, `/jahresplanung`,
  `/prompt-builder`, `public/nrlp/**`.
- Die Werkstatt (`src/pages/einheiten/[setKey]/werkstatt.astro`,
  `src/lib/werkstatt/auftraege.ts`, `prompt.ts`): `kontext.ts` wird gelesen
  und importiert, nicht verändert.
- Die Skills unter `.claude/skills/` und alle Prüfskripte `scripts/check-*.mjs`.
- Freigabe für `lp`, Teilen von Fassungen zwischen Lehrpersonen, Zurückführen
  ins Original, mehrere Fassungen pro Person.
- Mailversand (Resend ist bewusst nicht eingerichtet), Statistik-Erweiterungen
  über einen Eintrag in `classifyPath()` hinaus.
- Die unversionierten Dateien im Arbeitsbaum, die nicht zu diesem Bau gehören
  (Screenshots unter `docs/cloud-run/laeufe/`, `docs/kt1-auswertung/`,
  `docs/nrlp-medien/`, `docs/nrlp-sprachmodi-ra-pm-ps.md`, das Transkript
  unter `docs/eba/`, `supabase/migrations/020_kt1_email_sarah_zh.sql`): nicht
  committen, nicht löschen, nicht verschieben. Committe nie mit `git add -A`
  oder `git add .`, sondern immer mit benannten Pfaden.
- Astro-5-Migration, `scripts/patch-vercel-runtime.mjs`, Abhängigkeiten
  ausser dem, was Text-Extraktion zwingend braucht (vorher beim Orchestrator
  melden, welches Paket und warum).
