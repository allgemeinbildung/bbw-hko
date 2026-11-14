# Vertrag «Meine Fassung» (Fork-Pilot)

> Bindend für alle Executor ab Schritt 2. Auftrag und Invarianten:
> `docs/ORCHESTRATION-fork.md`. Entscheide und Begründungen:
> `docs/fork/ENTSCHEIDE.md`. Stand: 14.11.2026, Entwurf zur Freigabe durch Pietro.

Eine **Fassung** ist eine Liste von Ersetzungen über den Rohdateien einer
v4.2-Einheit. Sie ist nie eine Kopie. Ohne Fassung ist alles wie vorher.

---

## §1 Adressformat (endgültig ab der ersten gespeicherten Fassung)

```ts
interface Ersetzung {
  datei: 'herausforderung_A' | 'herausforderung_B' | 'set' | 'dossier'
  pfad: string            // Grammatik unten, adressiert die ROHFORM auf der Platte
  wert: unknown           // JSON-Wert, der den Originalwert ganz ersetzt
  original_hash: string   // 'sha256:' + 64 hex, über den kanonischen Originalwert
  auftrag: AuftragKey     // aus welchem Auftrag die Ersetzung stammt
  buendel_id: string      // aus welchem Bündel (uuid)
}
```

**Pfad-Grammatik**

```
pfad    = segment *( "." segment )
segment = name [ "[" schluessel "=" wert "]" ]
name    = 1*( a-z / 0-9 / "_" )
schluessel = "nr" / "label" / "kn_kriterium" / "ref" / "id" / "tag" / "heft"
wert    = 1*( jedes Zeichen ausser "]" )      ; für nr eine Ganzzahl
```

- Ein Listenelement wird **nur über seinen Schlüssel** adressiert, nie über den
  Index. Erlaubte Schlüssel je Liste:

  | Liste | Schlüssel |
  |---|---|
  | `leitfragen`, `spuren.<s>.leitfragen` | `nr` |
  | `handlungsprodukt.schritte`, `gemeinsamer_auftrag.schritte` | `label` |
  | `feedback_kriterien`, `gemeinsamer_auftrag.feedback_kriterien` | `kn_kriterium` |
  | `methoden` | `ref` |
  | `gemeinsamer_auftrag.heft_bezug` | `heft` |
  | `dossier: nuggets`, `dossier: glossar` | `id` |
  | `dossier: sprachmodi_scaffolds` | `tag` |

- **Listen ohne Schlüssel** (z. B. `abgaben`, `zahlen_tabelle`, `stufen`,
  `beispielbild`, `abschluss.quercheck`) sind nie selbst adressierbar; das
  Feld ist die ganze Liste bzw. das ganze Objekt, das sie enthält.
- `spuren.<s>` steht wörtlich mit `ohne_medien` oder `mit_medien`.
- Beispiel: `herausforderung_A` + `spuren.ohne_medien.leitfragen[nr=3].text`.

**Hash.** `original_hash = sha256(kanonisch(originalwert))`, wobei
`kanonisch` JSON mit alphabetisch sortierten Objektschlüsseln ohne Leerraum
ist (`undefined` → Feld fehlt → Hash von `null`). Beim Anwenden wird der
aktuelle Originalwert neu gehasht; weicht er ab, wird die Ersetzung **nicht**
angewendet und als «Original hat sich geändert» gemeldet.

**Reihenfolge.** Ersetzungen werden in der gespeicherten Reihenfolge
angewendet. Eine Ersetzung von `methoden[ref=X]` mit einem anderen `ref`
ändert den Schlüssel; spätere Ersetzungen im selben Element adressieren den
**alten** Schlüssel nicht mehr. Darum ersetzt der Methoden-Block immer das
ganze Element (§3).

---

## §2 Wo die Fassung wirkt

- `loadEinheit(slug, { fassung })` mit
  `fassung = { ersetzungen: Ersetzung[]; nur_spur?: SpurKey }`.
- Angewendet wird auf **tiefe Kopien** der Rohdateien `herausforderung_A/B`,
  `set`, `dossier` vor `ladeHeft` (Invariante 2). Die Module von
  `import.meta.glob` werden nie verändert.
- `nur_spur` beschränkt `spur_varianten` auf diese Spur (Auftrag
  `eigener_text`, §5).
- **Begleiter, KN, KI-Toolbox bleiben Original** (4b): `withFeldern` und
  `withLeitfragenLoesungen` bekommen die **unveränderten** Rohhefte.
- Rückgabe zusätzlich: `fassung_bericht = { angewendet: n, veraltet: Ersetzung[], verworfen: { e: Ersetzung, grund: string }[] }`.
  Ohne Option fehlt das Feld ganz (Invariante 3).
- Die QR-Seite `/m/<ordner>` ruft `loadEinheit` nie mit `fassung` auf.

---

## §3 Positivliste (eine Stelle im Code: `src/lib/fork/positivliste.ts`)

Muster: `*` steht für einen beliebigen Schlüsselwert, `<s>` für
`ohne_medien|mit_medien`. «Form» ist die Prüfung des Werts; «≤» ist das
Zeichenbudget (§6). Felder für die Lehrperson sind mit **LP** markiert.

### Heft (`herausforderung_A`, `herausforderung_B`)

| Nr | Pfad | Form | Block (data-feld) |
|---|---|---|---|
| H1 | `titel` | Text | S1 Kopf |
| H2 | `persona` | `{beruf,betrieb,ort}` Text | S1 Kopf |
| H3 | `situation_text` | Text | S1 Situation |
| H4 | `zahlen_tabelle` | Liste `{label,wert}`, gleiche Anzahl | S1 Situation |
| H5 | `leitfrage` | Text | S1 Situation |
| H6 | `mehrdeutigkeit.hint` | Text | S1 Spannungsfeld |
| H7 | `wochen_plan` | Liste `{label,text,aktiv}`, gleiche Anzahl, `label`/`aktiv` unverändert | S1 Übersicht |
| H8 | `quellen_anker` | Liste `{ref,titel,unterueberschrift?,seiten?,fuer_leitfrage?}`, 1–3 | S1 Im Lehrmittel |
| H9 | `leitfragen_intro` | Text | S2 Intro |
| H10 | `leitfragen[nr=*].text` / `spuren.<s>.leitfragen[nr=*].text` | Text | LF n |
| H11 | `…leitfragen[nr=*].liefert` | Text | LF n |
| H12 | `…leitfragen[nr=*].knoten_ref` | Text | LF n |
| H13 | `…leitfragen[nr=*].scaffolding` | `{strategien[],satzanfaenge[],produkt}`, Listen gleich lang | LF n Hilfe |
| H14 | `…leitfragen[nr=*].loesung` **LP** | Objekt `LeitfrageLoesung`; `raster_zeilen` gleich viele Zellen wie `raster.spalten` | LF n Lösung |
| H15 | `spuren.<s>.leitfragen[nr=*].raster.auftrag` | Text | S3 Auftrag |
| H16 | `spuren.ohne_medien.leitfragen[nr=*].raster.knoten_ref` | Text | S3 Auftrag |
| H17 | `spuren.<s>.leitfragen[nr=*].raster.spalten` | Liste Text, gleiche Anzahl, letzte Spalte unverändert | S3 Raster |
| H18 | `spuren.ohne_medien.leitfragen[nr=*].raster.beispielzeile` | Liste Text, Länge = `spalten` | S3 Raster |
| H19 | `spuren.ohne_medien.kasten_s4` | `{typ,titel,spalten,hinweis,loesung_zeilen}`, `typ` und Anzahl `spalten` unverändert; `loesung_zeilen` **LP** | S4 Kasten |
| H20 | `spuren.<s>.scaffold_90` | Text | – (Lösungen/Begleitung) |
| H21 | `lernfortschritt.scaffold_90`, `lernfortschritt.scaffold_100` | Text | S5/7 Plus |
| H22 | `handlungsprodukt.titel` | Text | S5 Auftrag |
| H23 | `handlungsprodukt.format`, `.format_detail`, `.beschreibung` | Text | S5 Auftrag |
| H24 | `handlungsprodukt.schritte[label=*].hint` | Text (`label` nie) | S5 Schritt n |
| H24L | `handlungsprodukt.schritte` | ganze Liste `{label,hint}`; gleiche Anzahl; jedes `label` beginnt mit derselben Nummer wie das Original an dieser Stelle (Präfix bis zum ersten Leerzeichen, z. B. «01»); Budget wie Objekt (Summe × 1.15) (F14) | S5 Schritte |
| H25 | `handlungsprodukt.hilfe_verweis`, `.schreib_label`, `.schreib_note` | Text | S5 |
| H26 | `handlungsprodukt.abgaben` | Liste Text, 1–4 | S5 Abgabe |
| H27 | `handlungsprodukt.scaffolding` | `{satzanfaenge[],strategien[],struktur[]}` | S5 |
| H28 | `handlungsprodukt.beispielbild` | `ProduktBild`, gleiche Blockart je Block | S6 Beispiel |
| H29 | `handlungsprodukt.loesungsbild` **LP** | `ProduktBild` | Lösungen |
| H30 | `feedback_kriterien[kn_kriterium=*].indikator_produkt` | Text | S5/7 Kriterium |
| H31 | `feedback_kriterien[kn_kriterium=*].stufen` | Liste Text, genau 4 | S5/7 Kriterium |
| H32 | `feedback_kriterien[kn_kriterium=*].name_lernende`, `.stufen_lernende` (nur EBA) | Text / Liste genau 4 | S7 Kriterium |
| H33 | `methoden[ref=*]` | ganzes Element `{ref,fuer?,tun?,beispiel?}`; `ref` ∈ `src/data/methoden/`, nie `__spur__` | S6 Karte |
| H34 | `mindmap_zentrum` | Text | S8 Netz |
| H35 | `mindmap_aeste` | Liste gleicher Anzahl, `transfer`/`optional` unverändert, `punkte` nur Begriffe aus dem Glossar des Hefts | S8 Netz |
| H36 | `abschluss` | `{quercheck[],mitnahme[],loesung}`; Anzahl `quercheck`/`mitnahme` unverändert, `loesung` **LP** | S8 Abschluss |
| H37 | `bewertungsraster` | Liste gleicher Anzahl `{produkt,vollstaendig_wenn[]}` | S8 Checkliste |

### Auftragsbogen (`set`)

| Nr | Pfad | Form |
|---|---|---|
| G1 | `gemeinsamer_auftrag.titel` | Text |
| G2 | `gemeinsamer_auftrag.persona` | `{beruf,betrieb,ort}` |
| G3 | `gemeinsamer_auftrag.situation_text` | Text |
| G4 | `gemeinsamer_auftrag.zahlen_tabelle` | Liste gleicher Anzahl |
| G5 | `gemeinsamer_auftrag.leitfrage`, `.mehrdeutigkeit.hint`, `.auftrag`, `.sozialform.empfehlung` | Text |
| G6 | `gemeinsamer_auftrag.schritte[label=*].hint` | Text |
| G6L | `gemeinsamer_auftrag.schritte` | wie H24L (F14) |
| G7 | `gemeinsamer_auftrag.abgaben` | Liste Text, 1–4 |
| G8 | `gemeinsamer_auftrag.heft_bezug[heft=*].inhalte` | Liste Text |
| G9 | `gemeinsamer_auftrag.produkte` | Liste gleicher Anzahl, `schritt`/`form`/`modus` unverändert |
| G10 | `gemeinsamer_auftrag.feedback_kriterien[kn_kriterium=*].indikator_produkt`, `.stufen`, `.name_lernende`, `.stufen_lernende` | wie H30–H32 |
| G11 | `gemeinsamer_auftrag.erwartungshorizont` **LP** | `Erwartungshorizont` |
| G12 | `gemeinsamer_auftrag.woerter` | Liste `{begriff,definition}` |
| G13 | `gemeinsamer_auftrag.kontext_ausschluss` | Liste Text (nicht gedruckt) |

### Dossier (`dossier`, nur EBA; Aufträge `eigener_text`, `situation_umformulieren`, `handlungsprodukt_aendern`)

| Nr | Pfad | Form |
|---|---|---|
| D1 | `einleitung.was_ist_das` | Text |
| D2 | `nuggets[id=*]` | ganzes Element; `id`, `tag`, `fuer_leitfrage` unverändert; `fakten_anker` = `[]` |
| D3 | `sprachmodi_scaffolds[tag=*]` | ganzes Element; `tag`, `sm_id`, `modus_label`, `strategien`, Anzahl `so_gehst_du_vor` unverändert |
| D4 | `transfer_wissensblatt` | `{fachsystematik,prinzip_in_einfach}` |
| D5 | `glossar` | Liste `{id,begriff,erklaerung_a2,beispiel}`, 12–30 Einträge, `id` eindeutig |
| D6 | `leseblatt.richtig_falsch` | genau 5 `{text,loesung}` |
| D7 | `leseblatt.w_fragen` | genau 3 Text |
| D8 | `leseblatt.vokabeln` | genau 6 IDs aus `glossar` (nach Ersetzung) |

Unverändert bleiben im Dossier: `id`, `kopf`, `lehrgang`, `sprachniveau`
(A2), `template`, Anzahl und `id` der Nuggets, `einleitung.so_benutzt_du_es`,
`leseblatt.titel/einleitung/gesamttext_quelle`.

### Nie ersetzbar (Invariante 4, Server verwirft)

Alles, was in keiner Zeile oben steht. Ausdrücklich: `template`, `lehrgang`,
`nrlp`, `buchstabe`, `id`, `modul*`, `sit_farbe*`, `nr`, `bloom`,
`antwortform`, `pol_typ`, `feld_hoehe_mm`, `raster.zeilen`, `raster.vorgabe`,
`raster.quelle_ref`, `mehrdeutigkeit.trade_off`, `quellen` jeder Spur,
`methoden_ref_rezeption`, `set.glossar`, `kn_kriterium`, `dimension`,
`schritte[].label` (ausser über die ganze Liste H24L/G6L, F14), `prinzip_handoff`, `sk_anker`, `dekontextualisierung`,
sowie jede Datei ausser den vier oben (`kn.json`, `prinzip.json`, `ki.json`,
`lernprompt.json`, `lernbegleiter.json`, `begleiter.md`).

---

## §4 Die vier Aufträge

Je Auftrag: **Ziel** (was die Lehrperson markieren darf), **erlaubt** (was das
Modell ersetzen darf) und **Pflicht-Abhängigkeiten** (4a). Jede
Pflicht-Abhängigkeit, die im Heft vorhanden ist, muss in der Antwort
**entweder ersetzt oder ausdrücklich bestätigt** sein
(`bestaetigt: { pfad, begruendung }`). Fehlt eine, ist der Vorschlag
**unvollständig** und wird nicht zur Übernahme angeboten (Status
`unvollstaendig`, mit Liste der fehlenden Pfade).

### `leitfrage_umformulieren`
- Ziel: H10 einer Leitfrage (Heft) oder G5 `leitfrage` (Auftragsbogen).
- Erlaubt: H10, H11, H13, H15 derselben Leitfrage.
- Pflicht: keine. Die Lösung (H14) darf **nicht** geändert werden; der Server
  verwirft sie.
- Auflage an das Modell: Die gespeicherte Lösung muss weiter passen.

### `eigener_text`
- Ziel: H10 einer oder mehrerer Leitfragen. Mit hochgeladenem oder
  eingefügtem Text (Pflicht).
- Spur: Die Fassung wird auf **`ohne_medien`** festgelegt (`nur_spur`);
  Ersetzungen unter `spuren.mit_medien.*` werden verworfen (die Pflichtquelle
  der Medien-Spur ist nicht ersetzbar).
- Erlaubt: H8–H19, H34–H36 und bei EBA D1–D8.
- Pflicht je geänderter Leitfrage: H10, H12, H14; bei der Raster-Leitfrage
  zusätzlich H15, H16, H18; bei der Beurteilen-Leitfrage H19. Immer: H8,
  H36. Bei EBA: D2 für **jedes** Nugget, das `fuer_leitfrage` einer geänderten
  Leitfrage nennt, sowie D5, D6, D7, D8 (eigener Aufruf, §7).

### `situation_umformulieren`
- Ziel: H1–H5 (Heft) oder G1–G4 (Auftragsbogen).
- Erlaubt im Heft: H1–H7, H9–H14, H17–H21, H24, H26, H28, H29, H30, H34–H37.
  Im Auftragsbogen: G1–G13. Bei EBA im Dossier: D1–D8 (F15).
- Pflicht (Heft): H2, H3, H4, H5, H6, H7, H9, H14 jeder Leitfrage,
  H19, H28, H29, H36. (Auftragsbogen): G2, G3, G4, G5, G11, G13.
  Bei EBA (nur Heft A/B, eigener Aufruf, §7): D2 für jedes Nugget mit `tag` =
  Heft und D3 `sprachmodi_scaffolds[tag=Heft]`.

### `handlungsprodukt_aendern`
- Ziel: H22/H23 (Heft) oder G5 `auftrag` / G9 (Auftragsbogen).
- Erlaubt im Heft: H7, H9, H10 (nur wo der Wortlaut das Produkt nennt), H11, H13, H20–H33, H24L, H37. Im Auftragsbogen: G5–G10, G6L. Bei EBA im Dossier: D1–D8 (F15).
- Pflicht (Heft): H22, H23, H24L (die ganze Schrittliste; Labels nach der Nummer dürfen sich ändern, F14), H26, H27 (falls
  vorhanden), H28, H29, H30 für **alle** Kriterien, H31 (und H32 bei EBA) für
  alle Kriterien, H33 für jede Methode ausser `__spur__`, H37, H11 und H13 jeder
  Leitfrage, H20 (wirksam im Heft, überschreibt H21 `scaffold_90`), H21, H7 (Wochenplan), H9 (Einleitung der Leitfragen) — beide nennen das Produkt (blinde Lesung 14.11.2026). (Auftragsbogen): G6L, G7, G9, G10.
  Bei EBA (nur Heft A/B, eigener Aufruf, §7): D2 für jedes Nugget mit `tag` =
  Heft und D3 `sprachmodi_scaffolds[tag=Heft]`.
- Vorrang (F14): Enthält eine Antwort die ganze Schrittliste (H24L/G6L) und
  zugleich Einzel-Hints (H24/G6) derselben Datei, gilt die Liste; die Hints
  werden «durch Schrittliste ersetzt» verworfen.
- Bekannte Kante (F14, nicht gelöst): Nach einem Label-Wechsel zeigen die
  Einzelmarken der Hints auf ein Label, das es im Original nicht gibt. Eine
  Ersetzung dorthin verwirft der Server mit «Dieser Schritt wurde umbenannt —
  bitte die ganze Schrittliste markieren.» Die Lehrperson markiert die
  Schrittliste (`data-feld` auf der ganzen Liste).
- Die vier Stufen behalten ihre Abstufung; nur Begriffe und Produkt werden
  angepasst.

---

## §5 Warnungen (4b) — Wortlaut

Erscheinen über der eigenen Fassung, solange die auslösenden Ersetzungen
gelten. Keine Warnung ändert etwas.

| Auslöser | Text |
|---|---|
| H22/H23 ersetzt | «Das Handlungsprodukt Ihrer Fassung ist ein anderes als in der Einheit. Der Kompetenznachweis der Plattform prüft möglicherweise etwas anderes, als Ihre Klasse geübt hat. Prüfen Sie den KN vor dem Einsatz.» |
| H31/H32/G10 ersetzt | «Die Kriterien {liste} haben in Ihrer Fassung einen anderen Wortlaut als im Kompetenznachweis der Plattform. Für die Bewertung gilt der KN.» |
| H3/H5 oder G3 ersetzt | «Die Situation ist angepasst. Begleitdokument, KI-Toolbox und Präsentation erzählen weiter die ursprüngliche Situation.» |
| `eigener_text` | «Ihre Fassung stützt sich auf Ihren eigenen Text. Begleitdokument, KI-Toolbox und Präsentation beziehen sich weiter auf das Lehrmittel. Die Fassung gilt nur für die Spur ohne Medien.» |
| immer | Fusszeile jedes Dokuments der Fassung: «Angepasst, nicht von KT1 geprüft» |

Im ZIP der Fassung fehlen die Bausteine, auf die eine Warnung zeigt
(Begleiter, KI-Toolbox, Deck bei Situations- oder Textwechsel); der KN bleibt
drin, mit der Warnung im README.

---

## §6 Budgets und Formprüfung

- **Text:** höchstens Zeichenzahl des Originals × 1.15, aufgerundet; bei
  Originalen unter 40 Zeichen höchstens 60 Zeichen.
- **Listen von Text:** Anzahl wie in §3; jedes Element nach der Textregel
  gegen das längste Originalelement.
- **Objekte** (`loesung`, `beispielbild`, `abschluss`, Dossier-Elemente):
  Summe aller Textfelder ≤ Summe im Original × 1.15; Blockart je Block
  (`eintraege`/`zeilen`/`text`/`wechsel`) unverändert.
- **Dossier-Nugget:** `inhalt` ≤ 700 Zeichen (eine A4-Seite).
- Lösungsfelder (LP) dürfen nicht in Lernenden-Felder wandern: Enthält ein
  Lernenden-Feld der Antwort eine Zeichenfolge von ≥ 40 Zeichen aus einem
  LP-Feld desselben Hefts (Original oder Vorschlag), wird die Ersetzung
  verworfen (Invariante 6).
- Nach dem Übernehmen misst der Browser die Seiten (Überlauf); eine
  übervolle Seite wird gewarnt, nicht gesperrt.

---

## §7 Anfrage an OpenAI

- Endpunkt: OpenAI Responses API, `text.format` = JSON Schema (`strict`).
  Modell aus `OPENAI_MODEL`. Ein Aufruf **pro Bündel und Heft** (A, B,
  Auftragsbogen getrennt); bei EBA + `eigener_text`, `situation_umformulieren`
  oder `handlungsprodukt_aendern` (Heft A/B) ein **eigener Aufruf** für das
  Dossier (F15), mit einem synthetischen Kommentar je Auftrag. Er zählt zur
  Tagesgrenze.
- `store: false`. Kein `user`-Feld, keine `metadata` mit Personenbezug.
- **Inhalt (abschliessend):**
  1. Systemteil: Rolle, Sprachregeln (EFZ: B1; EBA: A2, kurze Sätze), Schweizer
     Schreibweise ohne Eszett, Auflagen aus dem Konsistenz-Vertrag
     (`werkstattKontext`: Kompetenzversprechen, Anker, Trade-off-Raum,
     Bloom-Profil, Aspekte), die Regeln aus §3–§6.
  2. Das Heft als **Rohauszug**: nur Felder der Positivliste plus `nr`,
     `antwortform`, `pol_typ`, `raster.zeilen` als Lesekontext. Keine IDs von
     Personen, keine Kommentare anderer.
  3. Die Kommentare des Bündels: `{ auftrag, pfad, kommentar }`.
  4. Optional der eigene Text (Klartext, höchstens 20 000 Zeichen).
  5. Liste der Pflicht-Abhängigkeiten dieses Hefts (aufgelöste Pfade).
- **Antwortschema:**

```json
{
  "ersetzungen": [{ "datei": "...", "pfad": "...", "wert_json": "<JSON-Text>", "begruendung": "..." }],
  "bestaetigt":  [{ "pfad": "...", "begruendung": "..." }],
  "hinweis": "..."
}
```

`wert_json` ist ein JSON-String (die Werte haben verschiedene Formen; das
strikte Schema erlaubt kein `any`). Der Server parst ihn, prüft Pfad gegen §3
und den Auftrag (§4), Form und Budget (§6), setzt `original_hash` selbst und
verwirft alles andere mit Grund.

---

## §8 Speicher (Migration `028_einheit_fassungen.sql`)

```
einheit_fassungen
  id uuid pk · user_id uuid → profiles · einheit_id text
  nur_spur text null ('ohne_medien'|'mit_medien')
  ersetzungen jsonb default '[]'      -- übernommene Ersetzung[] (§1)
  created_at, updated_at
  unique (user_id, einheit_id)        -- eine Fassung pro Person und Einheit

einheit_fassung_buendel
  id uuid pk · fassung_id uuid → einheit_fassungen on delete cascade
  user_id uuid · heft text ('A'|'B'|'auftrag'|'dossier')
  kommentare jsonb                    -- [{auftrag, datei, pfad, kommentar}]
  text_pfad text null                 -- Bucket-Pfad des Klartexts
  status text ('offen'|'vorschlag'|'unvollstaendig'|'fehler'|'abgeschlossen')
  vorschlag jsonb null                -- {ersetzungen[], bestaetigt[], verworfen[], fehlend[], hinweis}
  entscheide jsonb default '{}'       -- {pfad: 'angenommen'|'verworfen'}
  modell text null · created_at
```

RLS: Eigentümerin SELECT eigene Zeilen, `kt1` SELECT alle, `deny_gast`
restriktiv; keine insert/update/delete-Policies. Bucket `fassung-texte`
(privat), Pfad `{user_id}/{buendel_id}.txt`. Tagesgrenze: Anzahl
`einheit_fassung_buendel` der Person mit Modellaufruf seit 00:00 Europe/Zurich
< `FORK_MAX_AUFRUFE_PRO_TAG` (Vorgabe 20).

## §9 API (`src/pages/api/fassungen/`)

| Route | Was |
|---|---|
| `GET /api/fassungen/[einheit]` | eigene Fassung + Bündel |
| `POST /api/fassungen/[einheit]/buendel` | multipart: `heft`, `kommentare` (JSON), optional `text` oder `datei` (.docx/.pdf/.txt ≤ 5 MB) → Extraktion, Klartext speichern, Modellaufruf, Vorschlag speichern |
| `POST /api/fassungen/[einheit]/entscheid` | `{buendel_id, entscheide: {pfad: 'angenommen'\|'verworfen'}}` → angenommene Ersetzungen an `ersetzungen` anhängen (gleicher Pfad ersetzt den älteren Eintrag) |
| `DELETE /api/fassungen/[einheit]` | Fassung samt Bündel löschen («zurück zum Original») |

Jede Route: Session prüfen → `darfForken(role)` (Pilot: nur `kt1`) → Einheit
hat `heft_8page_v42` → sonst 403/404. Schreiben nur mit Service-Role.

## §10 Markierung im DOM

`data-feld="<datei>:<pfad>"` auf dem Block, z. B.
`data-feld="herausforderung_A:spuren.ohne_medien.leitfragen[nr=3].text"`.
Der Wert ist eine Rohadresse nach §1, bezogen auf die **Platte** (LF1/LF2 im
Kern, LF3/LF4 unter der wirksamen Spur). Nur auf Blöcken, deren Pfad in §3
steht.
