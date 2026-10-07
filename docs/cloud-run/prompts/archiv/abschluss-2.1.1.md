# Abschluss der Korrekturen: 2.1.1_informationen_hinterfragen

> **Historisch, Stand vom 04.10.2026** — archiviert am 07.10.2026, nicht mehr ausführen. Der geltende Ablauf steht in der Skill `bbw-hko-heft-v42` (`SKILL.md`, `references/lauf.md`).

Du arbeitest in `D:\OS\dev\bbw-hko`, Branch `v42-skill`. Ziel dieser Session: die
Einheit `src/data/einheiten/2.1.1_informationen_hinterfragen/` so weit bringen, dass
Pietro sie nach einmaligem Gegenhören der Audios für Lehrpersonen freigeben kann.
KT1 macht kein Review — was du nicht findest, findet vor dem Unterricht niemand.

## Ausgangslage

- Die Einheit ist am 03.10.2026 in einem Cloud-Lauf entstanden. Bericht:
  `docs/cloud-run/laeufe/2026-10-03-211/BERICHT.md` (dazu `ENTSCHEIDE.md`, `messung.txt`).
- Danach lasen neun Lernenden-Gegenleser: `docs/upgrade-v4.2/REVIEW-lernende-t2.md`.
  Abschnitt 8.2 nennt, was in der Einheit schon geändert wurde, 8.4, was offen blieb.
- **Die Korrekturen aus 8.2 liegen uncommittet im Arbeitsverzeichnis**
  (`begleiter.md`, `herausforderung_A.json`, `herausforderung_B.json`). Sie sind
  gewollt. Nicht zurücksetzen, nicht neu erfinden — zuerst `git diff` auf den Ordner lesen.
- Nach diesen Korrekturen lief nur noch das Skript-Tor, kein Gegenleser. Genau so
  ist laut Review 8.1 der Fehler B19 entstanden.
- `node scripts/check-all.mjs 2.1.1_informationen_hinterfragen` ist grün (04.10.2026).

## Auftrag

1. **Offene Befunde abarbeiten.** Aus der Befundtabelle des Reviews (Abschnitt 2)
   alle Zeilen heraussuchen, die 2.1.1 betreffen und in 8.4 als «nicht geändert»
   stehen, dazu die offenen Punkte aus BERICHT §Gegenleser und §12 «Für die Abnahme».
   Jeden Befund am heutigen Text nachprüfen (er kann durch 8.2 schon erledigt sein),
   dann beheben oder begründet stehen lassen.
2. **Quellen von Heft A (nur Spur mit Medien) absichern, soweit ohne Hören möglich:**
   - Link von `q-211a-vertiefung-2` (Bundeskanzlei) gab zweimal HTTP 403. Prüfen;
     hält er nicht, eine gleichwertige amtliche Adresse einsetzen. An dieser Quelle
     hängt LF4, wenn die Ersatzquelle gebraucht wird.
   - Der «Heiratsstrafe»-Satz auf S. 3 ist eine eigene Kurzfassung: gegen das
     Transkript im Quellenarchiv lesen.
   - Sprechende (Funktion, Partei) gegen eine zweite Quelle prüfen, nicht nur gegen
     das automatische Transkript.
   - Der Ja-Anteil der Abstimmung steht nirgends in den Daten: an amtlicher Quelle
     nachschlagen und in die Lösungen aufnehmen, wo eine Aufgabe ihn braucht.
3. **Gegenlesen nach der letzten Änderung** nach
   `.claude/skills/bbw-hko-heft-v42/references/gegenleser.md` (Besetzung, Paket,
   Zeitpunkt) und Sinnprobe nach `references/phase-9-tor.md` §3 Nr. 9. Gegenleser
   dürfen parallel laufen. Höchstens drei Runden; gelesen wird zuletzt, nicht
   geändert.
4. **Tor und Messung** nach der letzten Änderung: `check-all` grün, kein Überlauf.

## Grenzen

- Du änderst **nur** Dateien in `src/data/einheiten/2.1.1_informationen_hinterfragen/`
  und die Quellenkarten `src/data/quellen/q-211*.json`.
- **Nicht anfassen:** Renderer, Styles, Skripte, Skill, Methodenkarten
  (`src/data/methoden/`), andere Einheiten, den Bauplan. Parallel läuft eine zweite
  Session an `2.3.1_anliegen_vertreten` im selben Arbeitsverzeichnis. Fehler in
  geteilten Dateien (z. B. Du-Form im Auftragsbogen-Renderer, Text der Karte
  `hko-quelle-raster`) nur melden.
- **Nicht entscheiden, sondern Pietro vorlegen:** Review 8.4 erster Punkt —
  Kriterien Stufe 3 und «SuK»/«Ges» (B03, B04), Schritte ohne Abgabe und Abschreiben
  (B08, B09, B49), Widersprüche Methodenkarte gegen Auftrag (B12).
- `set.json` bleibt `"status": "entwurf"`. Kein Merge, kein Push, kein Deploy.
- Keine wörtliche Lehrmittelpassage in die Daten (Leck-Prüfung im Tor).
- Hochdeutsch Schweiz, kein «ß», Sie-Form im Heft.

## Abgabe

1. `docs/cloud-run/laeufe/2026-10-03-211/NACHTRAG.md` mit:
   - je Befund: behoben / stehen gelassen (warum) / braucht Entscheid;
   - Gegenleser-Runden und was nach der letzten Runde noch offen ist;
   - **Gegenhör-Liste für Pietro:** je Quelle Adresse, jede im Heft verwendete
     Zeitmarke, der erwartete Wortlaut oder Inhalt an dieser Stelle, wer spricht,
     und welche Aufgabe oder Lösung daran hängt. So, dass er mit Kopfhörer in einem
     Durchgang abhaken kann;
   - was du nicht prüfen konntest.
2. Letzte Ausgaben von `check-all` und der Messung.
3. Ein Commit nur mit den eigenen Pfaden (`git add` mit ausdrücklichen Pfaden:
   Einheitenordner, `q-211*.json`, `NACHTRAG.md`). `npm run build:einheiten-index`
   laufen lassen, die Index-Dateien aber **nicht** committen, wenn sie sich geändert
   haben — nur melden.
4. Schlussmeldung in drei Zeilen: freigabereif nach Gegenhören ja/nein, was Pietro
   entscheiden muss, was er anhören muss.
