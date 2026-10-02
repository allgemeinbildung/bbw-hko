# Cloud-Lauf starten — Anleitung

Für den Moment, in dem Gold-Einheit und Skill fertig sind. Hintergrund und
Begründungen: `README.md` im selben Ordner.

Der private Spiegel existiert seit 02.10.2026:
<https://github.com/allgemeinbildung/bbw-hko-produktion> (privat, Standard-Branch
`cloud`, lokal unter `D:\OS\dev\bbw-hko-produktion`).

## A. Einmalig (ca. 5 Minuten, im Browser)

1. **Claude Zugriff auf den Spiegel geben.**
   GitHub → Settings → Applications → *Claude* → Configure → unter «Repository
   access» `allgemeinbildung/bbw-hko-produktion` hinzufügen.
2. **Umgebung anlegen.** <https://claude.ai/code> → Repo
   `bbw-hko-produktion` wählen → Umgebung neu:
   - Netzwerkzugriff: **Trusted** (Standard)
   - Setup-Skript: `npm ci`
   - keine Umgebungsvariablen, keine Secrets
3. **Probe (empfohlen, 2 Minuten).** Eine Session auf dem Spiegel starten mit:
   > Führe `npm ci` und `node scripts/cloud-preflight.mjs` aus und zeige mir die
   > Ausgabe. Ändere nichts.

   Erwartet: `PREFLIGHT GRUEN.` Damit ist bewiesen, dass Lehrmittel, `CLAUDE.md`
   und Skill in der Cloud ankommen.

## B. Vor jedem Lauf (lokal, in `D:\OS\dev\bbw-hko`)

1. **Alles committen**, was der Lauf sehen soll — Skill, Renderer, Checks.
   Uncommittetes geht nicht in den Spiegel.
2. **Auftragsliste füllen:** `docs/cloud-run/auftragsliste.md`. Vorschlag:

   ```bash
   npm run --silent abdeckung > docs/cloud-run/abdeckung.md
   ```

   Nicht aufnehmen: Zeilen mit ⚠, T7, EBA. Für den ersten Lauf **zwei bis drei
   Zeilen**, nicht zwanzig. Datei committen.
3. **Tor lokal prüfen** — die Gold-Einheit muss grün sein, sonst ist das Tor
   oder die Einheit nicht bereit:

   ```bash
   npm run check:all -- 1.3.1_konsum_verantworten_v42
   ```

4. **Spiegel auffrischen und pushen:**

   ```bash
   node scripts/cloud-spiegel.mjs --push
   ```

   Die Ausgabe nennt Branch und Commit, auf dem der Spiegel jetzt steht. Stimmt
   der Commit nicht mit `git log -1` überein, fehlt ein Commit aus Schritt 1.

## C. Starten

1. <https://claude.ai/code> → Repo `bbw-hko-produktion`, Branch `cloud`, die
   Umgebung aus A.2.
2. Als erste Nachricht den **ganzen Inhalt von `docs/cloud-run/RUN.md`**
   einfügen. Darunter eine Zeile mit dem Datum:
   > Datum des Laufs: 2026-10-02

3. Laufen lassen. Die Session meldet am Ende den Branch `lauf/<datum>`, die
   Anzahl grüner und nicht erzeugbarer Einheiten und drei Punkte für die Abnahme.

Stoppt sie mit einer Rückfrage, hat die Skill noch einen Halt ohne Auswahlregel.
Antwort geben, und die Stelle für die Skill notieren.

## D. Ergebnis zurückholen (lokal)

```bash
node scripts/cloud-import.mjs lauf/2026-10-02
```

zeigt, was käme. Dann übernehmen:

```bash
node scripts/cloud-import.mjs lauf/2026-10-02 --anwenden
```

```bash
npm run build:einheiten-index
```

Der Import läuft das Tor noch einmal lokal und committet nichts. Danach:

1. `docs/cloud-run/laeufe/<datum>/BERICHT.md` und `ENTSCHEIDE.md` lesen.
2. `npm run dev`, Einheiten als KT1 unter `/einheiten` ansehen (sie sind Entwurf).
3. Bei v4.x-Heften: Seitenüberlauf im Browser prüfen und Quellen-Slots lokal
   füllen (Swissdox/SRG gibt es in der Cloud nicht).
4. Committen. Push nach `main` erst nach deiner Abnahme — das ist der Deploy.

## Wenn etwas schiefgeht

| Zeichen | Ursache | Abhilfe |
|---|---|---|
| Preflight rot «Lehrmittel fehlt» | Session läuft auf dem öffentlichen Repo oder nicht auf `cloud` | Repo und Branch in C.1 prüfen |
| Preflight rot «node_modules» | Setup-Skript fehlt | `npm ci` in der Umgebung eintragen |
| `cloud-spiegel --push` bricht ab «nicht nachweislich privat» | Sichtbarkeit des Spiegels geändert oder `gh` nicht angemeldet | `gh auth status`, Repo auf privat stellen |
| Tor rot `ERR_LEHRMITTEL_WOERTLICH` | Absatz aus dem Lehrmittel übernommen | Stelle umformulieren, nie ins öffentliche Repo committen |
| Import meldet Dateien «NICHT uebernommen» | Der Lauf hat ausserhalb des erlaubten Bereichs geschrieben | Im Bericht nachlesen, bewusst von Hand entscheiden |
| Jede v4.x-Einheit im Tor rot wegen Quellenkarten | Skill lässt Medien-Slots offen, `check-v42` kennt den Zustand nicht | Offener Punkt, siehe `README.md` «Was die Cloud nicht kann» |

## Nie

- Im Spiegel `git remote add` auf das öffentliche Repo oder einen Merge von dort
  ins öffentliche Repo: die Historie des Spiegels enthält das Lehrmittel.
- Den Spiegel öffentlich stellen oder mit Vercel verbinden.
