# Dossier-Architektur (EBA) — Generierungs- und Validierungsregeln

Das Wissens-Dossier ersetzt im EBA-2er-Set das fehlende Lehrmittel. Es ist ein **separates
Glossar+**, kein integrierter Modell-Teil. Schema: `assets/dossier-template.json`. Generiert in
**Phase 7** (zuletzt), geschrieben nach `src/data/einheiten/{X.Y.Z}_{topic_slug}/dossier.json`.

---

## 1. Grundprinzip: Backward Design, nie vorab

Das Dossier wird **rueckwaerts** aus den fertigen Herausforderungen A/B + dem KN abgeleitet — so
liefert es genau das Wissen, das die Auftraege und der KN voraussetzen, nichts Beliebiges.

Reihenfolge zwingend: Prinzip → Herausforderungen → Set → **Wissensbedarf-Analyse (Phase 3.5)** →
KN → (Begleiter) → **Dossier (Phase 7)**. Wer das Dossier zuerst baut, produziert Stoff, den
niemand braucht, und verfehlt die Deckung (Check Wissen↔KN).

---

## 2. Geschichtete Bausteine

| Baustein | Funktion | Kopplung | Tag |
|---|---|---|---|
| **Wissens-Nuggets** | kurze, situationsnahe Wissenseinheiten, schnell auffindbar | an `mission.leitfragen[].nr` + Handlungsprodukt der Herausforderung | primaer A/B (auch AB) |
| **Sprachmodi-Scaffolds (erweitert)** | Strategien + Satzbausteine + „so gehst du vor", komplementaer zum Handlungsprodukt | an Output-`sm_id` jeder Herausforderung | A/B |
| **Transfer-Wissensblatt** | hebt die zwei Einzelfaelle in Fachsystematik; sitzt in der Dekontextualisierung | an Set-Transfer + KN-Prinzip | transfer (set-weit) |
| **Austausch-Scaffolds** | Hilfen, um Austausch + Transfer zu meistern | an `set.austausch_phase` | transfer (set-weit) |
| **Glossar** | Fachbegriffe A2-konform erklaert, mit konkretem Beispiel | quer ueber alles | quer |

**Ordnung:** primaer nach Herausforderung (A/B-Tag), Wissensart sekundaer. Lernende sollen „schnell
je nach Herausforderung finden". `tag`-Werte: `A` | `B` | `AB` | `transfer`.

---

## 3. Kopplungsregeln (verbindlich)

1. **Jedes Nugget hat eine Aufgabe.** `fuer_leitfrage` referenziert mindestens eine
   `mission.leitfragen[].nr` der Herausforderung mit gleichem Tag — oder das Nugget ist `AB`/
   `transfer` und deckt einen KN-Anspruch. Kein verwaistes Nugget.
2. **Jeder Scaffold an den Output-Modus.** `sprachmodi_scaffolds[].sm_id` == Output-Sprachmodus der
   Herausforderung mit gleichem Tag (Paritaet, siehe `sprachmodus-ids.md`).
3. **Jeder Anker zeigt zurueck.** `mission.leitfragen[].knoten_ref` (sichtbar „Dossier | Info-Karte A-01", interne ID `nugget_A_01`),
   `mission.quellen_anker[].nugget_ref`, `prinzip.quellen_anker.dossier_nuggets` und
   `mission.prinzip_handoff.dossier_anker` muessen auf real existierende Nugget-IDs zeigen.
4. **Transfer-Blatt deckt das Prinzip.** `transfer_wissensblatt.prinzip_in_einfach` ist die A2-Fassung
   von `prinzip.dekontextualisierungs_anker.anker_statement`.

---

## 4. A2-Pflicht

Jedes Prosa-Feld des Dossiers durchlaeuft den Pre-Write-Check aus `a2-language-rules.md` (ERR-Gate).
Besonders streng: **jeder Fachbegriff in `nugget.inhalt` braucht einen `glossar`-Eintrag**
(`ERR_A2_BEGRIFF_OHNE_GLOSSAR`) und muss in `nugget.glossar_refs` verlinkt sein. `so_gehst_du_vor`
und `so_tauschst_du_aus` sind Schritt-fuer-Schritt, kurze Imperativ-Saetze in Sie-Form.

---

## 5. Fakten-Validierungs-Workflow (Phase 7, durch Claude)

EBA-Inhalte sind niederschwellig (Loehne, Fristen, einfache Rechtsbegriffe) — gut web-pruefbar.

1. **Markieren.** Beim Dossier-Bau wird jeder konkrete Fakt (Betrag, Frist, Rechtsstand, Zahl,
   Datum) als `fakten_anker` erfasst: `{behauptung, wert, quelle, validiert:false, lp_pruefen:false}`.
2. **Validieren.** Claude prueft kritische Fakten per Web-Suche (aktuelle, serioese Quelle —
   admin.ch, berufsbildung.ch, seco, kantonale Stellen, Berufsverband). Quelle in `quelle` notieren.
3. **Flaggen.**
   - bestaetigt → `validiert: true`.
   - nicht sicher web-pruefbar oder veraenderlich/lokal → `lp_pruefen: true` (LP-Review-Markierung).
4. **Kein Fakt bleibt ungeflaggt.** Jeder `fakten_anker` ist am Ende `validiert:true` ODER
   `lp_pruefen:true`. Sonst `WARN_FAKT_UNGEPRUEFT` (Check Fakten-Validierung).

Niemals einen unbestaetigten Wert als gesichert ausgeben. Im Zweifel `lp_pruefen:true` setzen — die
LP traegt die didaktische Letztverantwortung.

**Wichtig (Render-Aenderung):** `fakten_anker` mit `validiert`/`lp_pruefen` ist ab jetzt **reine
interne QA** — der Renderer zeigt diese Zeilen **nicht mehr** den Lernenden. Aus den validierten
Fakten leitet Phase 7 stattdessen die learner-facing **Recherche-Hinweise** ab (siehe §8). Die
Validierung selbst bleibt unveraendert (Check Fakten), nur die Ausgabe wandert von „Provenienz" zu
„Lernauftrag".

---

## 6. Wissen↔KN-Alignment (Check NEU B)

Nach dem Dossier-Bau wird die Deckung geprueft: **jede `mission.leitfragen[]` und jeder KN-Anspruch**
(`kn.kn_typen[].fragestruktur[]` / `aufgaben[]` / `reflexionsfragen[]` sowie das KN-Kernprinzip) hat
mindestens ein deckendes Dossier-Element (Nugget, Scaffold oder Transfer-Blatt). Fehlt Deckung:
`ERR_DOSSIER_GAP` mit Angabe, welche Leitfrage / welcher KN-Anspruch unbedeckt ist → Nugget ergaenzen
und erneut pruefen.

---

## 7. Mindestumfang (EBA = mehr Scaffold)

- Pro Herausforderung A und B: **>= 2-3 Nuggets**, so dass jede der 4 Leitfragen gedeckt ist.
- Pro Herausforderung A und B: **genau 1** `sprachmodi_scaffolds`-Eintrag (am Output-Modus).
- **1** `transfer_wissensblatt` (set-weit) inkl. `austausch_scaffolds`.
- Glossar: jeder verwendete Fachbegriff; je Eintrag `erklaerung_a2` + `beispiel`.
- Pro Nugget (Renderer zeigt **ein Nugget pro Seite**): `recherche.suchbegriffe` (2-3) +
  `recherche.ki_beispiel` (`so_fragst_du` + `prompt`) + `recherche.ki_lernen` (2 Lern-Prompts) +
  `recherche.selbst_pruefen` — alle Pflicht (nur `ki_beispiel.tipp` optional).
- **`leseblatt`** (optional, Lesefoerderung): `einleitung` + **5** `richtig_falsch` + **3** `w_fragen`
  + **6** `vokabeln` (glossar-IDs). Gesamttext auto aus `nuggets[].inhalt`. Siehe §10.

---

## 8. Recherche-Scaffolds pro Nugget (learner-facing, P2 + P5)

Jedes Nugget bekommt einen **reichen** `recherche`-Block — er ersetzt die frueher gerenderten
Fakten-Zeilen und macht aus interner Provenienz aktive Lernauftraege. Der Renderer zeigt **ein Nugget
pro Seite**, also ist Platz fuer mehrere Hinweise. Wichtiges Ziel: EBA-Lernende sollen **lernen, wie
man die KI fragt** — nicht nur einen fertigen Prompt kopieren. Alle Felder A2, Sie-Form, **aus dem
Unit-Material** gebaut:

| Feld | Pflicht | Inhalt | Regel |
|---|---|---|---|
| `suchbegriffe` (Array) | **ja, 2-3** | mehrere Plain-Keyword-Suchen | **Keine Gesetzesartikel** (nicht „OR Art. 346"), sondern Alltagsworte + serioese Domain. Aus `quelle`-Topic + Nugget-Thema. Z. B. `["berufsbildung.ch Probezeit", "Probezeit Lehre wie lange"]`. |
| `ki_beispiel.so_fragst_du` | **ja** | vereinfachte Anleitung, **wie** man fragt | 1 kurzer A2-Satz in Sie-Form, nennt die Bausteine (wer Sie sind / Thema / was die KI tun soll / „geben Sie ein Beispiel"). Lehrt die Technik, nicht nur das Ergebnis. |
| `ki_beispiel.prompt` | **ja** | ein kopierbarer A2-Prompt, **gewaehlt nach Nugget-Typ** (Menu unten) | **Geerdet**: enthaelt einen konkreten Inhalt des Nuggets (Zahl, Frist, Beispiel, die Situation) — NICHT nur „was ist X". Keine feste Schablone; der Move passt zum Nugget (Fakt→Erklaeren, Verfahren→Checkliste, Schreiben→2 Versionen, Kontakt/lokal→Finden). |
| `ki_beispiel.tipp` | optional | ein Nachfrage-Move | A2, Sie-Form, z. B. „Verstehen Sie die Antwort nicht? Schreiben Sie: «Erklaeren Sie das noch einfacher.»" |
| `ki_lernen` (Array) | **ja, 2** | zwei **verschiedene** Lern-MIT-KI-Moves aus dem Menu, passend zum Nugget | Je `{strategie, prompt}`. **Nicht** immer retrieval+feynman — die zwei Moves nach Nugget-Typ waehlen und am Nugget-Inhalt erden. Ueber das ganze Dossier die Moves variieren (Anti-Sameness). |
| `selbst_pruefen` | **ja, je Nugget** | kurzer Anwendungs-/Pruefauftrag | Sie-Form. Bei lokal/persoenlich variierenden Fakten konkret („Schauen Sie in Ihren Lehrvertrag: …"); sonst ein Anwendungs-/Retrieval-Auftrag („Schreiben Sie in einem Satz, was X ist"). **Fachlich-unsichere** `lp_pruefen`-Fakten werden NICHT zum Schuelerauftrag — die bleiben interne LP-Review. |

**Ableitung aus den Fakten:** `validiert:true`-Fakten → `suchbegriffe` + `ki_beispiel`. Lokal/
persoenlich variierende `lp_pruefen`-Fakten → konkretes `selbst_pruefen`. Fachlich unsichere
`lp_pruefen`-Fakten → kein learner-Hinweis (interne QA).

**Integritaets-Leitplanke (KI):** Der Renderer haengt ans KI-Beispiel automatisch „Pruefen Sie die
Antwort an einer sicheren Quelle." — der Prompt-Text muss das nicht wiederholen. KI-Zugang gilt als
in der Regel vorhanden, aber nicht zwingend: die `suchbegriffe` tragen das Nugget auch ohne KI.

**Sprache:** A2, kurze Saetze, Sie-Form in Anweisungen; echte Umlaute, kein `ß`; in `suchbegriffe`
keine ae/oe/ue-Transliteration (sichtbare Suchworte, keine IDs).

### Prompt-Qualitaet: Strategie-Menu + Grounding + Anti-Sameness (verbindlich)

Die KI-Prompts (`ki_beispiel` + die zwei `ki_lernen`) duerfen **nicht** Variationen desselben Satzes
sein. Drei Regeln (vom EFZ-Lernbegleiter abgeleitet, A2-vereinfacht):

**1. Strategie-Menu** — pro Prompt **einen** Move waehlen (nicht ueberall denselben):

| Move (`strategie`) | Was die KI tut | Passt zu |
|---|---|---|
| Erklaeren Sie es mir | erklaert einfach + Alltagsbeispiel | Wissens-/Fakt-Nugget |
| Lassen Sie sich abfragen | stellt Fragen, **Loesung erst nach meiner Antwort** | Fakten/Begriffe wiederholen |
| Erklaeren Sie es selbst (Feynman) | ich erklaere, KI nennt nur Luecken (keine fertige Loesung) | pruefen ob verstanden |
| Spielen Sie es durch | Rollenspiel/Simulation der Situation | Konflikt, Gespraech, Entscheid |
| Machen Sie mir eine Checkliste | kurze Schritt-Liste | Verfahrens-/Prozess-Nugget |
| Geben Sie mir Feedback | bewertet meinen Text, **nur Luecken als Fragen** | Schreib-/Kommunikations-Nugget |
| Finden Sie es fuer mich | sucht/vergleicht, fragt nach meiner Lage | lokale/kantonale/Kontakt-Fakten |

> **Sie-Form (P5):** Die `strategie`-Labels und alle Prompt-Texte siezen — auch die KI. Kein
> du/dein/dir/dich, keine Du-Imperative (Anrede-Scan `ERR_ANREDE_DU`). Die ICH-Stimme der Lernenden
> („Ich habe meinen Vertrag vor mir …") bleibt.

**2. Grounding** — jeder Prompt nennt einen **konkreten** Inhalt des Nuggets (Zahl, Frist, das
Beispiel, die Persona-Situation), nicht nur den Titel. Schlecht: „Erklaeren Sie mir die Probezeit." Gut:
„Meine Probezeit dauert 3 Monate. Was heisst das fuer mich? Was passiert am Ende?"

**3. Anti-Sameness (Check, `WARN_PROMPT_EINTOENIG`)** — ueber das ganze Dossier muessen die Moves
variieren; **kein** zweites Nugget benutzt dieselbe Prompt-Schablone. Faustregel: pro Nugget passen
`ki_beispiel`-Move + die 2 `ki_lernen`-Moves zum **Typ** des Nuggets, und nebeneinander gelegt lesen
sich die Nugget-Seiten unterschiedlich.

---

## 9. Titelseite (`kopf`), Einleitung (`einleitung`) + Notizen-Seite

Das Dossier beginnt mit einer **Titelseite** und endet mit einer **Notizen-Seite** (beide rendert der
Renderer automatisch aus den Daten / als leere linierte Flaeche).

**`kopf` — Kerndaten DIREKT aus `public/nrlp_2j.json`** (per `kompetenz_nr` nachschlagen, **nicht**
erfinden):
- `thema_nr` + `thema_titel` ← `themen[].nr` / `.titel`
- `lebensbezug_nr` + `lebensbezug_text` ← `themen[].lebensbezuege[].nr` / `.text`
- `kompetenz_nr` + `kompetenz_text` ← `…kompetenzen[].nr` / `.text` (verbatim, NICHT A2-vereinfacht —
  das ist der offizielle nRLP-Wortlaut)
- `lehrjahr` ← `themen[].lehrjahr`
- `einheit_titel` ← `set.einheit_titel`, sonst kurzer Titel aus `topic_slug` (z. B. „Sich im
  Lehrvertrag orientieren")
- `lehrgang: "EBA_2J"`, `sprachniveau: "A2"` konstant

**`einleitung` — Gebrauchsanleitung** (A2, Sie-Ansprache):
- `was_ist_das`: 1-2 Saetze — das Dossier ersetzt das (fehlende) Lehrmittel und hilft bei den
  Auftraegen.
- `so_benutzt_du_es`: 4-5 kurze Schritte — nicht von vorne lesen; Anker nutzen (z. B. „Info-Karte A-02");
  Glossar fuer schwierige Woerter; pro Nugget Such-/KI-/Lern-Tipps; letzte Seite = eigene Notizen.
- **KI-Tool benennen (P2):** Einer der Schritte nennt ein **konkretes, schulseitig verfuegbares
  KI-Tool** (Default: **Microsoft Copilot**, „an unserer Schule verfuegbar") oder „ein aehnliches
  Tool" — EBA-Anfaenger brauchen konkrete Starthilfe. Die Beispiel-Prompts (`ki_beispiel` /
  `ki_lernen`) bleiben dagegen **toolneutral** (kein Produktname im Prompt-Text).

**Notizen-Seite:** rein im Renderer (leere linierte Flaeche „Meine Notizen") — **keine** Daten noetig.

Reihenfolge der Seiten: **Titel → Wissen (1 Nugget/Seite) → Sprachhilfe → Grundprinzip → Glossar →
Notizen.**


---

## 10. Lese-Arbeitsblatt (`leseblatt`) — optionales SuS-Zusatzdokument

EBA-Lernende sollen **regelmaessig lesen und das Leseverstaendnis trainieren** (Feedback Pascal). Dazu
traegt `dossier.json` einen optionalen `leseblatt`-Block. Er rendert **nicht** als Glossar+-Seite,
sondern als **eigenes** SuS-Dokument (`DocLeseblatt`) — im Workbench unter «Zusatzmaterialien», im
ZIP als `*_doc-leseblatt.html/.docx`. Die Lehrperson entscheidet, ob sie es austeilt. Fehlt der
Block, erscheint das Dokument nicht (voll additiv).

**Was du autorierst (und was der Renderer automatisch macht):**

| Feld | Pflicht | Inhalt | Regel |
|---|---|---|---|
| Gesamttext | — (auto) | durchgehender, nummerierter Lesetext | Der Renderer zieht ihn **automatisch aus `nuggets[].inhalt`** (Reihenfolge A->B). **NICHT** ins `leseblatt` duplizieren. |
| `titel` | ja | „Lesen und Verstehen: <Kurztitel>" | A2, echte Umlaute. |
| `einleitung` | ja | 1-2 Saetze Leseauftrag | A2, Sie-Form. |
| `richtig_falsch` | **ja, 5** | je `{text, loesung}` | Jede Aussage aus einem Nugget-Inhalt **klar** ableitbar; Mischung richtig/falsch. `loesung` (bool) dokumentiert die Absicht/den Loesungsschluessel — der Renderer **druckt sie nicht** auf dem SuS-Blatt. |
| `w_fragen` | **ja, 3** | offene Verstaendnisfragen (Strings) | Beziehen sich auf den Lesetext; in ganzen Saetzen beantwortbar. |
| `vokabeln` | **ja, 6** | Array von `glossar`-IDs | Zentrale Begriffe; der Renderer zieht `begriff` + `erklaerung_a2` aus dem Glossar (keine neuen Texte). |

**Kopplungsregeln:** (1) Jede `richtig_falsch`/`w_fragen`-Aussage muss durch den Gesamttext (also die
Nugget-Inhalte) **gedeckt** sein — keine Frage zu Wissen, das nicht im Lesetext steht. (2) Jede
`vokabeln`-ID muss im `glossar[]` existieren (sonst faellt der Eintrag beim Rendern weg). (3) Alle
Prosa (`einleitung`, `richtig_falsch[].text`, `w_fragen[]`) unterliegt dem A2-Gate + Anrede-Scan
(Sie-Form) wie jede andere Dossier-Prosa.
