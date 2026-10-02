# Produktionslauf in der Claude-Cloud

Stand 02.10.2026. Wie ein unbeaufsichtigter Lauf der Einheiten-Skill in einer
Cloud-Session vorbereitet, gestartet und zurückgeholt wird.

## Warum ein privater Spiegel

Eine Cloud-Session klont genau das Repo, das ihr angehängt ist, und sonst
nichts. `allgemeinbildung/bbw-hko` ist öffentlich; das Lehrmittel
(`material/_lehrmittel/`) und `CLAUDE.md` sind dort gitignored. Ein zweites
privates Repo dazuzuklonen geht laut Dokumentation nicht (der GitHub-Proxy der
Cloud reicht nur an angehängte Repos durch), und eine Upload-Funktion für
private Dateien gibt es nicht.

Darum läuft die Produktion in einem **privaten Spiegel**
`allgemeinbildung/bbw-hko-produktion`: derselbe Code, plus eine Privat-Schicht
(Lehrmittel LM-26, Quellenarchiv mit Transkripten und Artikeltexten, `CLAUDE.md`) als oberster Commit auf dem Branch `cloud`.

Das löst nebenbei zwei weitere Risiken:

- **Kein Deploy möglich.** Der Spiegel hängt nicht an Vercel. Die Cloud darf
  laut Dokumentation auf jeden Branch pushen, auch auf `main` — im öffentlichen
  Repo wäre das eine sofortige Veröffentlichung.
- **Kein Leck in die öffentliche Historie.** Zurück geht es nie per merge, nur
  pfadweise über `scripts/cloud-import.mjs`.

## Einmalig einrichten

1. Spiegel lokal bauen (liegt neben dem Repo, `D:\OS\dev\bbw-hko-produktion`):
   `node scripts/cloud-spiegel.mjs`
2. Privates Repo anlegen (Entscheid Pietro: Verlagstext liegt danach bei GitHub
   und wird in der Cloud verarbeitet):
   `gh repo create allgemeinbildung/bbw-hko-produktion --private --source "D:\OS\dev\bbw-hko-produktion" --remote origin`
3. `node scripts/cloud-spiegel.mjs --push` — prüft vor dem Push, dass das Ziel
   privat ist und nicht das öffentliche Repo.
4. Auf GitHub: Standard-Branch des Spiegels auf `cloud` stellen; der Claude-App
   Zugriff auf das neue Repo geben.
5. Auf claude.ai/code eine Umgebung für das Repo anlegen. Netzwerk «Trusted»
   genügt (npm). Setup-Skript: `npm ci`. Keine Secrets nötig.

## Vor jedem Lauf

1. Im öffentlichen Checkout alles committen, was der Lauf sehen soll (Skill,
   Renderer, Checks). Uncommittetes geht nicht in den Spiegel.
2. `node scripts/cloud-spiegel.mjs --push` — setzt `cloud` neu auf den
   aktuellen Branch plus Privat-Schicht.
3. Auftragsliste füllen: `docs/cloud-run/auftragsliste.md` (Vorschlag aus
   `npm run abdeckung`), committen, Schritt 2 wiederholen.
4. Cloud-Session auf dem Spiegel starten, Branch `cloud`, mit dem Inhalt von
   `docs/cloud-run/RUN.md` als erster Nachricht.

## Nach dem Lauf

```
node scripts/cloud-import.mjs lauf/2026-10-02            # zeigt, was käme
node scripts/cloud-import.mjs lauf/2026-10-02 --anwenden # legt es in den Arbeitsbaum
npm run build:einheiten-index
```

Der Import übernimmt nur `src/data/einheiten/`, `src/data/methoden/`,
`src/data/quellen/` und `docs/cloud-run/laeufe/`, lässt danach das Tor laufen
und committet nichts. Alles, was der Lauf sonst geändert hat (Skill, Skripte,
Renderer), wird gemeldet und bleibt draussen.

## Das Tor

`npm run check:all -- <ordner>` (oder `--neu`, `--entwurf`) bündelt alle
bestehenden Checks und ergänzt Struktur, Status, Methoden-Refs, Platzhalter und
die **Leck-Prüfung** gegen das Lehrmittel (ab 25 Wörtern am Stück ein Fehler,
ab 14 eine Warnung). `--cloud` verlangt zusätzlich, dass das Lehrmittel
vorhanden ist und jede Einheit `status: "entwurf"` trägt.

Bewusst **nicht** in `prebuild` gehängt: das würde den Produktions-Build auf
Vercel verändern. Wenn gewünscht, ist es eine Zeile.

## Was die Cloud nicht kann

- **Quellen recherchieren.** Swissdox (Login) und die SRG-API-Skills sind
  lokal. Die Recherche gehört zum Bauplan: Karten liegen vor dem Lauf unter
  `src/data/quellen/`, die Volltexte spiegelt `cloud-spiegel.mjs` aus
  `D:\OS\_lab\quellen-archiv\bbw-hko\` nach `material/_quellen-archiv/` (nur
  `.md`, `.txt`, `.pdf`). Damit kann die Cloud die Medien-Spur ausformulieren.
  Bleibt ein Slot im Bauplan offen, verlangt `check-v42` trotzdem gefüllte
  Karten — **wie eine Einheit Quellen-Slots offen lässt, muss die neue Skill
  (v4.2/4.3) festlegen**, und das Tor muss diesen Zustand kennen.
- **NotebookLM-Gegenlesung** des Crosswalks. Lebensbezüge ohne Zeile oder ohne
  Kernkapitel gehören nicht auf die Auftragsliste (in `abdeckung.md` mit ⚠).
- **Browser-Messung des Seitenüberlaufs.** Die Zeichenbudgets in `check-v42`
  ersetzen sie für den Lauf; die Messung im Browser bleibt Abnahme lokal.
- **EBA.** Kein Lehrmittel, eigene Skill auf altem Stand.
