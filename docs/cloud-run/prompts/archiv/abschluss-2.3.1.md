# Abschluss der Korrekturen: 2.3.1_anliegen_vertreten

> **Historisch, Stand vom 04.10.2026** — archiviert am 07.10.2026, nicht mehr ausführen. Der geltende Ablauf steht in der Skill `bbw-hko-heft-v42` (`SKILL.md`, `references/lauf.md`).

Du arbeitest in `D:\OS\dev\bbw-hko`, Branch `v42-skill`. Ziel dieser Session: die
Einheit `src/data/einheiten/2.3.1_anliegen_vertreten/` so weit bringen, dass Pietro
sie nach einmaligem Gegenhören der zwei Audios für Lehrpersonen freigeben kann.
KT1 macht kein Review — was du nicht findest, findet vor dem Unterricht niemand.

## Ausgangslage

- Die Einheit ist am 03.10.2026 in einem Cloud-Lauf entstanden. Bericht:
  `docs/cloud-run/laeufe/2026-10-03-231/BERICHT.md` (dazu `ENTSCHEIDE.md`).
- Danach lasen neun Lernenden-Gegenleser: `docs/upgrade-v4.2/REVIEW-lernende-t2.md`.
  Abschnitt 8.2 nennt, was in der Einheit schon geändert wurde, 8.4, was offen blieb.
- **Die Korrekturen aus 8.2 liegen uncommittet im Arbeitsverzeichnis**
  (`begleiter.md`, `herausforderung_A.json`, `herausforderung_B.json`): LF4 und LF3
  in Heft A, Auftrag S. 3 in beiden Heften, Checkliste zum Raster-Begriff. Sie sind
  gewollt. Nicht zurücksetzen — zuerst `git diff` auf den Ordner lesen.
- Nach diesen Korrekturen lief nur noch das Skript-Tor, kein Gegenleser.
- `node scripts/check-all.mjs 2.3.1_anliegen_vertreten` ist grün (04.10.2026).
- Der Überlauf von 1,8 px auf S. 6 von Heft A ist hingenommen
  (`docs/upgrade-v4.2/ENTSCHEIDE.md`, E28 Punkt 2). Nicht deswegen kürzen.

## Auftrag

1. **Offene Befunde abarbeiten.** Aus der Befundtabelle des Reviews (Abschnitt 2)
   alle Zeilen heraussuchen, die 2.3.1 betreffen und in 8.4 als «nicht geändert»
   stehen, dazu die offenen Punkte aus BERICHT §Gegenleser und §«Unbelegt, nicht
   geprüft». Jeden Befund am heutigen Text nachprüfen (er kann durch 8.2 schon
   erledigt sein), dann beheben oder begründet stehen lassen. Ausdrücklich prüfen:
   - Rasterauftrag («LF1 oder Glossar») und Checkliste sagen jetzt dasselbe, in
     beiden Heften und beiden Spuren.
   - Die QR-Adresse auf S. 3 enthielt laut Blindleser ein unsichtbares Zeichen:
     in den Daten suchen und entfernen.
2. **Fakten absichern, soweit ohne Hören möglich:**
   - Ausgang der Graubünden-Abstimmung («Nein, 27.09.2026») an einer **amtlichen**
     Quelle prüfen. Bisher stützt er sich auf ein Transkript, dessen Karte gelöscht ist.
   - Stand Luzern nach Juni 2023.
   - Die Sprecheraussagen, auf denen Raster oder Lösungen aufbauen (Studie 09:46,
     Abgaben 07:53, Glarus-Dauer und Beteiligung 10:40, «Volljährigkeit» 08:44):
     gegen eine zweite Quelle prüfen; trägt das Transkript die Verknüpfung
     Glarus–tiefe Beteiligung nicht, die Lösung entsprechend vorsichtig fassen.
   - Referendum und Initiative auf Gemeindeebene, «Vorstoss»: im Lehrmittel nicht
     belegt — prüfen, ob das Heft sie als Fallüberlegung kennzeichnet.
3. **Gegenlesen nach der letzten Änderung** nach
   `.claude/skills/bbw-hko-heft-v42/references/gegenleser.md` (Besetzung, Paket,
   Zeitpunkt) und Sinnprobe nach `references/phase-9-tor.md` §3 Nr. 9. Gegenleser
   dürfen parallel laufen. Höchstens drei Runden; gelesen wird zuletzt, nicht
   geändert.
4. **Tor und Messung** nach der letzten Änderung: `check-all` grün; ausser den
   hingenommenen 1,8 px kein Überlauf.

## Grenzen

- Du änderst **nur** Dateien in `src/data/einheiten/2.3.1_anliegen_vertreten/` und
  die Quellenkarten `src/data/quellen/q-231*.json`.
- **Nicht anfassen:** Renderer, Styles, Skripte, Skill, Methodenkarten
  (`src/data/methoden/`), andere Einheiten, den Bauplan. Parallel läuft eine zweite
  Session an `2.1.1_informationen_hinterfragen` im selben Arbeitsverzeichnis.
  Fehler in geteilten Dateien nur melden — bekannt sind: `lm-16-3-gestaltung`
  (falsche Seitenangabe, «acht Regeln», aber fünf aufgezählt, «drei Argumente»
  gegen zwei im Heft), Renderer-Texte «Wortlaut Kompetenznachweis», Du-Form im
  Auftragsbogen, «Wissensecke II», ✔ und ☐ zugleich.
- **Nicht entscheiden, sondern Pietro vorlegen:** Review 8.4 erster Punkt —
  Kriterien Stufe 3 und «SuK»/«Ges» (B03, B04), Schritte ohne Abgabe und Abschreiben
  (B08, B09, B49), Widersprüche Methodenkarte gegen Auftrag (B12).
- `set.json` bleibt `"status": "entwurf"`. Kein Merge, kein Push, kein Deploy.
- Keine wörtliche Lehrmittelpassage in die Daten (Leck-Prüfung im Tor).
- Hochdeutsch Schweiz, kein «ß», Sie-Form im Heft.

## Abgabe

1. `docs/cloud-run/laeufe/2026-10-03-231/NACHTRAG.md` mit:
   - je Befund: behoben / stehen gelassen (warum) / braucht Entscheid;
   - Gegenleser-Runden und was nach der letzten Runde noch offen ist;
   - **Gegenhör-Liste für Pietro:** für beide Mundart-Audios je Adresse, jede im
     Heft verwendete Zeitmarke, der erwartete Inhalt an dieser Stelle auf
     Hochdeutsch, wer spricht (Rolle), wo der Ausschnitt von Heft A endet, und
     welche Aufgabe oder Lösung daran hängt. So, dass er mit Kopfhörer in einem
     Durchgang abhaken kann;
   - was du nicht prüfen konntest.
2. Letzte Ausgaben von `check-all` und der Messung.
3. Ein Commit nur mit den eigenen Pfaden (`git add` mit ausdrücklichen Pfaden:
   Einheitenordner, `q-231*.json`, `NACHTRAG.md`). `npm run build:einheiten-index`
   laufen lassen, die Index-Dateien aber **nicht** committen, wenn sie sich geändert
   haben — nur melden.
4. Schlussmeldung in drei Zeilen: freigabereif nach Gegenhören ja/nein, was Pietro
   entscheiden muss, was er anhören muss.
