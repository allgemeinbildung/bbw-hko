# Karten — ändern oder neu anlegen

Methodenkarten (`src/data/methoden/`) und Quellenkarten (`src/data/quellen/`)
werden von vielen Einheiten geführt, die meisten sind publiziert. Wer eine
Karte ändert, ändert gedruckte Hefte — auch solche, die er nie geöffnet hat.
Darum gibt es **vor jeder Kartenänderung** eine feste Prüfung: Darf die Karte
geändert werden, oder braucht es eine neue, damit die alte bleibt, wie sie ist?

Dieselbe Regel steht für Menschen in `docs/methodenkartei.md` §9. Weichen die
zwei Texte voneinander ab, gilt `docs/upgrade-v4.2/ENTSCHEIDE.md` E36.

**Herkunft:** ENTSCHEIDE E31 Nr. 3 (Fehler gegen Passung), E36 (Regel, Skript,
Vermerk); Rückblick `docs/upgrade-v4.2/RUECKBLICK-produktion-2026-10-06.md`
§3 Nr. 4–5, §4 («Methodenkarte widerspricht dem Heft», 17 Kartenänderungen am
05.10.2026) und §5.4 («geteilte Karte»).

## 1. Die Prüfung — drei Befehle

```
node scripts/karten.mjs verbraucher <karten-id>
node scripts/karten.mjs darf <karten-id>
node scripts/karten.mjs geaendert [--gegen origin/main]
```

Dazu, für die Belege einer Karte (Abschnitt 5):
`node scripts/karten.mjs belege [<karten-id>]`.

| Befehl | Zeigt | Exit |
|---|---|---|
| `verbraucher` | jede Einheit, jedes Heft, jede Spur, die die Karte führt — getrennt nach `publiziert`, `archiviert`, `entwurf` —, dazu die Felder, die die Einheit überschreibt. Auch indirekt: die Ersatzkarte einer geführten Quellenkarte, Karten einer anderen Einheit (3.1.1 führt Vertiefungen `q-131…`), Nennungen in einer Lösung (`quelle_ref`), Baupläne, die die Karte nennen | 0 |
| `darf` | den Entscheid nach Abschnitt 2 mit Begründung | 0 = ändern erlaubt (Fall a) · 1 = gebunden |
| `geaendert` | jede Karte, die sich vom Vergleichsstand unterscheidet (Standard `origin/main`, der Stand, der live ist), mit Verbrauchern. Neue Karten sind kein Befund. Dazu jede Karte, deren Kartenbelege nicht mehr zu ihrem Text passen (`KARTE_BELEGE_VERALTET`, Warnung — Abschnitt 5) | 1, wenn eine gebundene Karte ohne neuen Vermerk geändert ist |

`geaendert` läuft im Tor mit: `check-all`, Zeile «Karten». Fehlt der
Vergleichsstand, endet das Skript mit Exit 2 — nie grün. `karten.mjs warnungen`
listet Regel e über die ganze Methodenkartei.

**Gebunden** heisst: Mindestens eine Einheit mit `status: "publiziert"` (auch
ohne Feld — das gilt als live) oder `"archiviert"` führt die Karte.
**Archivierte Einheiten binden wie publizierte:** Ihre Hefte sind gedruckt im
Umlauf, und die QR-Seite `/m/<ordner>` einer archivierten Einheit funktioniert
weiter (Entscheid Pietro, 07.10.2026) — eine geänderte Quellenkarte erschiene
dort neben einem Heft, das den alten Stand druckt. Das Skript weist sie
getrennt aus.

## 2. Die Regel

| Fall | Lage | Was gilt |
|---|---|---|
| **a** | Die Karte hat **keinen** publizierten und keinen archivierten Verbraucher | Ändern erlaubt. Dazu gehört die *eigene Karte* aus `references/lauf.md` §10: die Quellenkarte, die nur diese noch nicht publizierte Einheit führt, und die Methodenkarte, die der Orchestrator in diesem Lauf neu angelegt hat. Entwürfe, die die Karte führen, werden danach neu geprüft und gemessen. Für Quellenkarten gilt zusätzlich Fall d |
| **b** | **Fehler** in der Karte: Die Aussage steht nicht auf der genannten Seite, die Seite ist falsch, ein Rechenfehler, ein Widerspruch in sich | Ändern, auch bei publizierten Verbrauchern — aber nur mit **Vermerk** (Abschnitt 3) und danach für **jeden** Verbraucher: `check-all`, Export, Messung; bei sichtbarer Änderung an einer Bestandseinheit `bestand-v42.mjs --schreiben`. Ohne Vermerk ist `geaendert` rot |
| **c** | **Passung:** Die Karte stimmt, passt aber nicht zu dieser Einheit — Anzahl, Format, Beispiel, Begriff | Karte **nicht** ändern. Reihenfolge: 1. Die Einheit überschreibt in der Methoden-Referenz (`fuer`, ausnahmsweise `beispiel`). 2. Reicht das nicht: **neue Karte** mit eigener ID (`references/ableitungsregeln.md` §10, `check-namen.mjs --vor <ordner> --karte <id>`); die alte bleibt unverändert |
| **d** | **Quellenkarte** | Der Inhalt einer Karte — Titel, URL bzw. URN, Ausschnitt — wird nach der ersten Freigabe (Freigabe des Bauplans, der die Quelle nennt) **nie** mehr ausgetauscht: Eine andere Quelle ist eine neue Karte mit neuer ID. Korrigierbar bleiben Zeitmarken, Wortzahl bzw. Dauer, Prüfdatum und `kurzbeschrieb` — bei gebundener Karte mit Vermerk wie in Fall b |
| **e** | **Karten für alle** | In `merk` und `schritte` stehen keine festen Zahlen und Formate («6 bis 8 Bilder», «A4», «drei Argumente») — die nennt die Einheit in `fuer`. Das Skript warnt bei Ziffern, Zahlwörtern und Formatwörtern; eine Warnung ist nie ein Fehler. Seiten-, Kapitel- und Artikelverweise zählen nicht |

**Fehler oder Passung?** Das Skript entscheidet es nicht. Probe: Wäre die Karte
auch falsch, wenn es diese Einheit nicht gäbe? Ja → Fehler (b). Nein → Passung
(c). «Die Karte verlangt drei Argumente, das Heft zwei» ist Passung; «die Karte
nennt S. 394–395, das Schema steht auf S. 394» ist ein Fehler.

**Zeitmarke oder Ausschnitt?** Auch das entscheidet das Skript nicht: Eine
Marke, die um Sekunden danebenliegt, ist eine Korrektur; ein anderer Abschnitt
desselben Beitrags ist eine andere Quelle. Das Skript warnt bei jeder Änderung
an `verortung` einer gebundenen Karte; der Beleg des Vermerks sagt, welches von
beiden vorliegt.

## 3. Der Vermerk

Ein Eintrag je Korrektur, angehängt an das Array in
`src/data/methoden/_aenderungen.json` bzw. `src/data/quellen/_aenderungen.json`:

```json
{
  "karte": "lm-17-3-3b-schema",
  "datum": "2026-10-07",
  "art": "fehler",
  "beleg": "Kap. 17.3, am Buch geprüft: Das Schema steht ganz auf S. 394; gemeldet im Bericht 2026-10-06-5.2.1_gesetze_veraendern",
  "verbraucher": ["1.3.1_konsum_verantworten_v42", "2.1.1_informationen_hinterfragen"]
}
```

(Beispiel für die Form; die Liste `verbraucher` ist hier gekürzt.)

- `art` ist immer `"fehler"` — für Passung gibt es keinen Vermerk, weil es dafür
  keine Kartenänderung gibt.
- `beleg` nennt die Fundstelle (Kapitel und Seite, Bericht, Primärquelle) in
  eigenen Worten. **Kein Zitat** aus Lehrmittel oder Quelle: Das Repo ist
  öffentlich.
- `verbraucher` nennt **jeden** Ordner, den `karten.mjs verbraucher` zeigt.
  Fehlt ein publizierter oder archivierter, ist `geaendert` rot; fehlt ein
  Entwurf, ist es eine Warnung.
- Ein Vermerk zählt nur, solange er im Vergleichsstand noch nicht steht: Ein
  alter Vermerk deckt keine neue Änderung derselben Karte.
- Die Dateien tragen keine `id`; Loader, `check-namen` und `check-all`
  überspringen Dateien mit führendem `_`.
- Ein Vermerk hebt Fall d nicht auf: Titel, URL und URN einer gebundenen
  Quellenkarte bleiben auch mit Vermerk rot.

## 4. Im Lauf

- **Vor jeder Kartenänderung** `node scripts/karten.mjs darf <id>`. Entscheid
  und Fall (a bis d) stehen im Bericht, Abschnitt 7 «Entscheide im Lauf».
- **Im Auto-Modus wird nie eine bestehende Karte geändert** — auch nicht in
  Fall b. Ein Fehler in einer bestehenden Karte geht in den Bericht, Abschnitt
  10 «Offen», mit Kürzel S, Karten-ID, Feld und Beleg, und von dort in die
  Sammelliste (`docs/cloud-run/OFFEN.md`, sobald vorhanden). Die Korrektur
  macht eine eigene Session mit Pietro, weil sie jeden Verbraucher neu misst.
- Erlaubt bleibt im Lauf Fall a an der eigenen Karte (`references/lauf.md`
  §10) und Fall c: überschreiben; eine neue Methodenkarte nur, wenn Bauplan §9
  sie verlangt (`references/auto-modus.md` §4).
- Läuft Seite 6 über, wird **nie die Karte gekürzt**: Gekürzt wird im Heft
  (`fuer`, ein überschriebenes `beispiel`, das Beispielbild).
- Das Tor zeigt in der Zeile «Karten», ob der Lauf eine bestehende Karte
  berührt hat. Rot heisst: zurücksetzen (`git restore <datei>`) und den Fall
  nach Abschnitt 2 lösen.

## 5. Kartenbelege — was eine Karte behauptet, wird belegt

Eine Lehrmittelkarte sagt, was auf einer Seite steht («das Schema hat drei
Teile», «acht Regeln»); stimmt das nicht, steht der Fehler in jedem Heft, das
die Karte führt. Darum wird der Text einer Karte **wie ein Lösungsfeld
belegt** — mit Anker, Fundstelle, Urteil und Hash — in
`<Quellenarchiv>/_pruefung/_karten/<karten-id>.json`, ausserhalb des Repos
(Form: `references/belege.md` §9, Schema
`scripts/schema/karte-belege.schema.json`).

```
node scripts/karten.mjs belege                 # alle Methodenkarten
node scripts/karten.mjs belege <karten-id>     # eine Karte, auch eine Quellenkarte
```

| Was | Regel |
|---|---|
| belegpflichtig | Lehrmittelkarte: `lesen` und `merk` (Belegzeile mit Anker im Kapitel `kap`, auf einer Seite aus `seiten`). Jede Methodenkarte: jede Aussage über die Welt (Artikel, Zahl mit Einheit, Datum, «Stand») — als Fakt oder Belegzeile |
| keine Datei | «nicht belegt»: ein **Hinweis**, kein Fehler. Stand 07.10.2026 hat keine der 42 Methodenkarten eine Datei |
| Datei vorhanden | Fehler, wenn: Schema verletzt · Hash einer Zeile passt nicht mehr zum Text des Felds (`KARTE_BELEGE_VERALTET`) · Anker steht nicht im Kapitel bzw. Archivtext · Anker steht auf einer anderen Seite als die Zeile sagt, oder auf einer Seite, die `seiten` nicht nennt · Urteil `falsch`, `fundstelle_falsch`, `abweichend`, `nicht_belegbar`. Warnung, wenn ein belegpflichtiges Feld keine Zeile hat |
| Karte geändert | Jede Änderung am Text eines Felds macht dessen Zeilen ungültig (Hash). `karten.mjs geaendert` — die Zeile «Karten» im Tor — meldet das als Warnung `KARTE_BELEGE_VERALTET`; `karten.mjs belege <id>` zeigt die Felder. Neu geprüft werden nur diese |
| Urteil «falsch» | ein **Fehler in der Karte**: Fall b (Abschnitt 2) — Vermerk, jeden Verbraucher neu prüfen. Im Lauf: nicht ändern, melden (Abschnitt 4) |

Wer die Datei schreibt und womit: `references/audits.md` §6 (Karten-Audit) —
eine eigene Session, kein Schritt eines Erzeugungslaufs. Bei der Korrektur
einer Karte nach Fall b gehört das erneute Karten-Audit der geänderten Felder
zur Korrektur. (Herkunft: Rückblick §5.4 «geteilte Karte»; Auftrag 10, Stufe D
Nr. 2; ENTSCHEIDE E38, Stufe D.)

## 6. Was das Skript nicht prüft

- ob die Verbraucher nach einer Korrektur wirklich neu gemessen sind — das
  belegt der Bericht der Korrektur;
- ob eine Änderung ein Fehler oder eine Passungsfrage ist (Abschnitt 2);
- ob eine Karte ohne Datei unter `_pruefung/_karten/` stimmt — «nicht belegt»
  heisst nicht «geprüft»;
- Karten, die nur ein Bauplan nennt: Sie erscheinen bei `verbraucher` als «nur
  im Bauplan genannt», binden aber nicht.
