# Produktionslauf — Eröffnungsanweisung

Du produzierst Einheiten für die ABU-Materialplattform bbw-hko, unbeaufsichtigt.
Niemand beantwortet Rückfragen. Arbeite die Auftragsliste ab, halte jeden
Entscheid fest und höre erst auf, wenn jede Zeile entweder grün ist oder mit
Grund als nicht erzeugbar im Bericht steht.

## 1. Start

```
npm ci
node scripts/cloud-preflight.mjs
git checkout -b lauf/<JJJJ-MM-TT>
```

Ist der Preflight rot: **nicht produzieren.** Schreibe den Befund in die
Antwort und stoppe. Eine Einheit ohne Lehrmittel-Quelltext ist wertlos, auch
wenn sie gut aussieht.

Lies danach `CLAUDE.md`, `docs/cloud-run/auftragsliste.md` und
`.claude/skills/bbw-hko-3er-set/SKILL.md`.

## 2. Pro Zeile der Auftragsliste

0. Bauplan lesen: `docs/cloud-run/bauplaene/<ordner>.md`. Er muss «freigegeben» tragen.
   Ordnername, Versprechen, Herausforderungen, Hybrid-Fall, Kapitel und Quellen
   daraus übernehmen — **kein Entscheid des Bauplans wird geändert.** Fehlt der
   Bauplan oder ist er nicht freigegeben: Zeile gilt als nicht erzeugbar.
1. Einheit mit der Skill `bbw-hko-3er-set` erzeugen. Die Phasen, die der
   Bauplan bereits entscheidet (Prinzip, Auswahl der Herausforderungen,
   Hybrid-Freigabe), nicht neu aufrollen, sondern mit seinen Werten füllen. Grundlage für jede
   Fachaussage, Zahl, Seitenangabe und jeden Rechtsstand ist ausschliesslich das
   Kapitel aus `material/_lehrmittel/`, das der Crosswalk der Skill nennt, und
   der nRLP-Datensatz des Lehrgangs. Nichts aus dem Gedächtnis.
   Für alles, was von einer Quelle abhängt (Lösungen und Beispielwerte der
   Medien-Spur), gilt der Volltext unter `material/_quellen-archiv/<quellen-id>/gewaehlt/`
   — und nur für Quellen, deren Karte in `src/data/quellen/` liegt. Fehlt Karte
   oder Volltext: nur die Spur ohne Medien erzeugen, im Bericht melden.
2. Wo die Skill trotzdem auf eine Eingabe wartet, die der Bauplan nicht deckt: die Variante nehmen, die sie selbst
   empfiehlt; fehlt eine Empfehlung, die mit dem engsten Bezug zum Wortlaut der
   nRLP-Kompetenz. Entscheid, Grund und die verworfenen Alternativen in
   `docs/cloud-run/laeufe/<datum>/ENTSCHEIDE.md` festhalten.
3. `node scripts/check-all.mjs <ordner> --cloud` — bis grün. Befunde in den
   Daten beheben, nie im Skript, nie über `--baseline`.
4. `npm run build:einheiten-index` und `npm run build` müssen durchlaufen.
5. Ein Commit pro Einheit: `Lauf <datum>: <ordner>`.

Bis zu drei Einheiten parallel über Subagenten; jeder Subagent bekommt genau
eine Zeile der Auftragsliste, diese Regeln und den Auftrag, bei grünem Tor
aufzuhören. Die Übernahme und das Tor prüfst du selbst nach.

## 3. Was immer gilt

1. **`status: "entwurf"`** in jeder `set.json`, exakt so geschrieben. Jeder
   andere Wert gilt als veröffentlicht.
2. **Kein Lehrmitteltext und kein Quellentext in den Daten** (Transkripte,
   Artikel). Die Einheiten gehen in ein
   öffentliches Repo. Eigene Formulierungen, Kapitel und Seite als Verweis. Das
   Tor meldet wörtliche Übernahmen; eine Warnung dazu ist ebenfalls zu beheben.
3. **Keine erfundenen Quellen, Zahlen, Zitate, Links.** Was sich am Lehrmittel
   nicht belegen lässt, wird weggelassen und im Bericht genannt.
4. **Nur schreiben unter** `src/data/einheiten/<neuer ordner>/`,
   `src/data/methoden/` (neue Karten), `src/data/quellen/` und
   `docs/cloud-run/laeufe/<datum>/`. Bestehende Einheiten, die Skill, Skripte,
   Renderer und `CLAUDE.md` bleiben unverändert. Alles andere wird beim Import
   verworfen. Fällt ein Fehler in Skill oder Skript auf: in den Bericht, nicht
   reparieren.
5. **Nur der Branch `lauf/<datum>` wird gepusht.** Nie `cloud`, nie `main`, kein
   Force-Push, kein Pull Request in ein anderes Repo.
6. Schweizer Hochdeutsch, kein «ß», echte Umlaute, Aufträge in Sie-Form,
   Situationen in Ich-Form, neutrale Persona.
7. Eine Zeile gilt als **nicht erzeugbar**, wenn der Bauplan fehlt oder nicht
   freigegeben ist, ein im Bauplan genanntes Kapitel fehlt, oder das Tor nach drei
   Reparaturrunden noch rot ist. Dann: Ordner entfernen, Grund in den Bericht,
   nächste Zeile.

## 4. Abschluss

`docs/cloud-run/laeufe/<datum>/BERICHT.md`:

- je Zeile: Ordnername, Tor-Ergebnis (letzte Ausgabe von `check-all`), Kapitel
  und Seiten, auf denen die Einheit steht;
- alle Entscheide, die sonst ein Mensch getroffen hätte;
- was nicht belegt, nicht geprüft oder nicht erzeugbar war;
- Fehler in Skill, Skripten oder Daten, die aufgefallen sind.

Dann `git push -u origin lauf/<datum>` und in der letzten Nachricht: Branch,
Anzahl grün / nicht erzeugbar, die drei wichtigsten Punkte für die Abnahme.
