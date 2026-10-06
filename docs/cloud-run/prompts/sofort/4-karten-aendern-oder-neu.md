# Karten: ändern oder neu anlegen — Regel und Skript

Session in `D:\OS\dev\bbw-hko`, Branch `v42-skill`. Darf `scripts/`, die
Skill und `docs/methodenkartei.md` ändern; keine Karte, keine Einheit.

```
Methodenkarten (src/data/methoden/) und Quellenkarten (src/data/quellen/)
werden von vielen Einheiten geteilt, die meisten sind publiziert. Jede
Änderung an einer Karte ändert gedruckte Hefte. Es braucht vor jeder
Kartenänderung eine feste Prüfung: darf die Karte geändert werden, oder
braucht es eine neue, damit die alte bleibt, wie sie ist?

1. SKRIPT scripts/karten.mjs
   node scripts/karten.mjs verbraucher <karten-id>
     → jede Einheit, jedes Heft, jede Spur, die die Karte führt, mit status
       (entwurf/publiziert/archiviert) und den Feldern, die die Einheit
       überschreibt (fuer, beispiel). Auch indirekte Nutzung: Quellenkarten
       anderer Einheiten (3.1.1 führt q-131*).
   node scripts/karten.mjs darf <karten-id>
     → Entscheid nach der Regel unten, mit Begründung, Exit 0/1.
   node scripts/karten.mjs geaendert [--gegen origin/main]
     → jede Karte, die sich gegenüber dem Vergleichsstand unterscheidet, mit
       Verbrauchern; Exit 1, wenn eine geänderte Karte von einer publizierten
       Einheit geführt wird und kein Freigabe-Vermerk vorliegt (siehe 2).
   In scripts/check-all.mjs als Zeile «Karten» aufnehmen (ruft `geaendert`).

2. REGEL (in docs/methodenkartei.md und als references/karten.md der Skill;
   Herkunft ENTSCHEIDE E31 Punkt 3)
   a) Karte hat keinen publizierten Verbraucher → ändern erlaubt.
   b) FEHLER in der Karte (Aussage steht nicht auf der genannten Seite,
      falsche Seite, Rechenfehler, Widerspruch in sich): ändern, auch bei
      publizierten Verbrauchern — aber nur mit Vermerk in
      src/data/methoden/_aenderungen.json bzw. src/data/quellen/
      _aenderungen.json: {karte, datum, art: "fehler", beleg, verbraucher[]}
      und danach für JEDEN Verbraucher: check-all, Export, Messung; bei
      sichtbarer Änderung bestand-v42 neu schreiben. Ohne Vermerk ist
      `geaendert` rot.
   c) PASSUNG (Karte stimmt, passt aber nicht zu dieser Einheit — Anzahl,
      Format, Beispiel, Begriff): Karte NICHT ändern. Reihenfolge:
      1. Einheit überschreibt (`fuer`, ausnahmsweise `beispiel`);
      2. reicht das nicht: NEUE Karte mit eigener ID (Ableitungsregeln),
         die alte bleibt unverändert.
   d) Quellenkarten: Inhalt einer Karte (Titel, URL/URN, Ausschnitt) wird
      nach der ersten Freigabe nie mehr ausgetauscht — eine andere Quelle
      ist eine neue Karte mit neuer ID. Korrigierbar bleiben Zeitmarken,
      Wortzahl, Prüfdatum, kurzbeschrieb (mit Vermerk wie b).
   e) Karten für alle: keine festen Zahlen und Formate in `merk`/`schritte`
      («6 bis 8 Bilder», «A4», «drei Argumente») — die nennt die Einheit.
      Als Warnung in karten.mjs (Ziffern und Formatwörter in geteilten
      Karten).

3. SKILL
   - SKILL.md Regel 12 und phase-4/6/q: vor jeder Kartenänderung
     `karten.mjs darf <id>`; das Ergebnis steht im Bericht.
   - auto-modus.md: Im Auto-Modus wird nie eine bestehende Karte geändert —
     Fall b geht in den Bericht («offen», Kürzel S) und in die Sammelliste.

4. BESTAND PRÜFEN (nur berichten)
   - `karten.mjs geaendert --gegen` den Stand vor a288b61: Liste der 17
     Kartenänderungen vom 05.10. mit Verbrauchern — sind alle Verbraucher
     danach gemessen worden? Was nicht belegt ist, als Liste.
   - Überschreibungen `beispiel` in Einheiten (1.1.1, 3.3.1, 4.1.1, 4.2.1,
     Gold): Datenvertrag §11.3 verbietet oder erlaubt das? Text und Praxis
     angleichen (Vorschlag, kein stiller Entscheid).

BEWEIS
verbraucher für lm-17-3-3b-schema und hko-quelle-raster stimmt mit einer
Textsuche überein; eine Probeänderung an einer Karte (nicht committen) macht
check-all rot, mit Vermerk grün. Commit ohne Push.
```
