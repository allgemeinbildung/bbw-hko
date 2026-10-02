# Ableitungsregeln — Ordner, IDs, Kurzlink, Quellen-IDs

Grundlage: `docs/upgrade-v4.2/ENTSCHEIDE.md` E21 (dazu E5 für die Form der
Gold-Einheit). Alles auf dieser Seite ist **nach dem ersten Druck fest**: Der
Ordnername steht im QR-Code jedes gedruckten Hefts. Darum gilt:

- **Ableiten, nicht fragen.** Die Regel liefert ohne Rückfrage ein Ergebnis.
- **Prüfen vor dem Schreiben.** Jede Regel hat einen Prüfschritt; erst wenn er
  bestanden ist, wird der Wert verwendet.
- **Nie überschreiben.** Weder einen vorhandenen Ordner noch eine vorhandene
  Karte, noch einen vorhandenen Archivordner.
- Im Auto-Modus stehen die Werte schon im Bauplan. Sie werden nicht neu
  erfunden, sondern gegen diese Regeln geprüft; weicht einer ab, ist der
  Bauplan nicht ausführbar — ausser Bauplan §9 nennt die Abweichung
  ausdrücklich als Ausnahme: Dann gilt der Wert des Bauplans
  (`references/auto-modus.md` §7).

Die Beispiele auf dieser Seite sind erfunden. Die Kompetenznummern darin sind
am Datensatz geprüft (Stand 02.10.2026), die Einheiten gibt es nicht.

---

## 1. Ordnername

```
src/data/einheiten/<X.Y.Z>_<slug>[_3j|_4j]/
```

### 1.1 Nummer

`X.Y.Z` ist die **erste Kompetenz von Heft A** im kanonischen Lehrgang —
auch wenn Heft B andere Kompetenzen trägt.

### 1.2 slug

1. Den Fokus der Einheit nehmen (ein Satz aus Phase 0).
2. Daraus zwei bis drei Wörter: der Gegenstand und das Verb in der Grundform.
3. Kleinbuchstaben; `ä → ae`, `ö → oe`, `ü → ue`; Wörter mit `_` verbinden.
4. Nur die Zeichen `a–z`, `0–9` und `_`. Kein Bindestrich, kein Punkt, kein
   Leerzeichen.

| Fokus | Gegenstand + Verb | slug |
|---|---|---|
| «Quellen prüfen, bevor ich etwas teile» | Quellen · prüfen | `quellen_pruefen` |
| «Gerüchte im Betrieb einordnen» | Gerüchte · einordnen | `geruechte_einordnen` |
| «Den Mietvertrag lesen und nachfragen» | Mietvertrag · lesen | `mietvertrag_lesen` |

### 1.3 Lehrgang-Suffix

Ein Suffix `_3j` bzw. `_4j` steht **genau dann**, wenn beides zutrifft:

1. die Einheit gilt nur für einen Lehrgang, **und**
2. dieselbe Nummer `X.Y.Z` existiert im anderen EFZ-Lehrgang mit **anderem**
   Text.

Sonst kein Suffix. **Nie `_v42`** — das trug nur die Gold-Einheit, weil ihr
Name vergeben war.

Prüfschritt: `X.Y.Z` in `public/nrlp_3j.json` **und** `public/nrlp_4j.json`
nachschlagen (`themen[].lebensbezuege[].kompetenzen[]`, Felder `nr` und
`text`) und die zwei Texte zeichengenau vergleichen. Nicht vermuten: Dieselbe
Nummer bedeutet in 3J und 4J oft nicht dasselbe.

| Fall | Kanonisch | Nummer im anderen Lehrgang | Suffix | Ordner |
|---|---|---|---|---|
| A | EFZ_3J, `2.1.2` | vorhanden, Text gleich | keines | `2.1.2_quellen_pruefen` |
| B | EFZ_4J, `3.1.1` | vorhanden, Text anders | `_4j` | `3.1.1_werbung_durchschauen_4j` |
| C | EFZ_4J, `2.4.1` | nicht vorhanden | keines | `2.4.1_kunst_beurteilen` |

Zu Fall A: Ob die Einheit zusätzlich für den zweiten Lehrgang ausgewiesen wird
(`set.lehrgaenge`), ist eine eigene Frage (`references/datenvertrag.md` §11.4).
Der Ordnername hängt nicht davon ab.

### 1.4 Der Ordner existiert schon

Prüfschritt: Gibt es `src/data/einheiten/<ordner>/`? Gilt auch für einen
leeren oder halbfertigen Ordner.

| Befund | Folge |
|---|---|
| existiert nicht | Name gilt |
| existiert | **Nie überschreiben, nichts hineinschreiben.** Den slug um das nächste Kernwort des Fokus verlängern; ein Lehrgang-Suffix bleibt am Schluss. Neu prüfen. |
| auch der verlängerte Ordner existiert | Einheit **nicht erzeugbar**. Nichts schreiben, Meldung in den Bericht. |

Beispiel: `2.1.2_quellen_pruefen` existiert. Fokus «Quellen prüfen, bevor ich
etwas teile», nächstes Kernwort «teilen» → `2.1.2_quellen_pruefen_teilen`.
Mit Suffix hiesse es `…_quellen_pruefen_teilen_4j`.

---

## 2. IDs

Aus dem Ordnernamen, ohne Ausnahme:

| Datei | `id` |
|---|---|
| `herausforderung_A.json` | `<ordner>_hf_A` |
| `herausforderung_B.json` | `<ordner>_hf_B` |
| `set.json` | `<ordner>_set` |
| `kn.json` | `<ordner>_kn` |
| `prinzip.json` | `<ordner>_prinzip` |

Dieselben Werte stehen in allen Verweisen: `prinzip_ref` (Hefte, Set, KN),
`kn_ref` und `herausforderungen[]` (Set), `konzept_progression[].herausforderung`
(Set), `set_ref` und `anchored_situations[]` (KN).

Beispiel für `2.1.2_quellen_pruefen`:
`2.1.2_quellen_pruefen_hf_A` · `2.1.2_quellen_pruefen_hf_B` ·
`2.1.2_quellen_pruefen_set` · `2.1.2_quellen_pruefen_kn` ·
`2.1.2_quellen_pruefen_prinzip`.

`topic_slug` in `kn.json` und `prinzip.json` ist der slug ohne Nummer und ohne
Lehrgang-Suffix: `quellen_pruefen` (Form der Gold-Einheit, deren `topic_slug`
den Zusatz des Ordners nicht trägt).

Prüfschritt: `check-all.mjs` meldet `ERR_ID`, wenn die `id` eines Hefts nicht
mit `<ordner>_` beginnt. Die übrigen IDs und Verweise prüft kein Skript — von
Hand vergleichen, bevor das Tor läuft.

---

## 3. Kurzlink und QR

| Was | Wert |
|---|---|
| Landing-Seite | `/m/<ordner>` |
| Anker | `#a` für Heft A, `#b` für Heft B |
| QR-Inhalt | `https://bbw-hko.ch/m/<ordner>#a` bzw. `#b` |

Beispiel: `https://bbw-hko.ch/m/2.1.2_quellen_pruefen#a`.

Die Skill schreibt den Link in keine Datei; der Renderer bildet ihn aus dem
Ordnernamen. Er ist der Grund, warum der Ordnername nach dem Druck nicht mehr
ändert.

---

## 4. Quellen-IDs

Nur für Hefte mit der Spur `mit_medien`. Je Heft bis zu vier Karten:

```
q-<n><h>-pflicht
q-<n><h>-pflicht-ersatz
q-<n><h>-vertiefung-1
q-<n><h>-vertiefung-2
```

- `<n>` = die Ziffern der **Ordnernummer** ohne Punkte: `2.1.2` → `212`. Das
  gilt auch für Heft B, selbst wenn es andere Kompetenzen trägt.
- `<h>` = `a` für Heft A, `b` für Heft B.
- Das Wort `pflicht` ist nur Teil der ID. Im Heft heisst diese Quelle «Quelle».

Beispiel für `2.1.2_quellen_pruefen`: `q-212a-pflicht`,
`q-212a-pflicht-ersatz`, `q-212a-vertiefung-1`, `q-212a-vertiefung-2`,
`q-212b-pflicht`, `q-212b-pflicht-ersatz`, `q-212b-vertiefung-1`,
`q-212b-vertiefung-2`.

Die Karte liegt unter `src/data/quellen/<id>.json`; ihr Feld `id` ist gleich
dem Dateinamen ohne `.json`.

### 4.1 Die ID ist schon vergeben

Prüfschritt, für `q-<n>a-pflicht` **und** `q-<n>b-pflicht`:

1. Gibt es `src/data/quellen/<id>.json`?
2. Gibt es den Archivordner `<id>\` (Abschnitt 5)?
3. Wenn eines von beiden: Gehört es zu **dieser** Einheit? Ja, wenn der Bauplan
   dieses Ordners die ID in seinem Quellen-Abschnitt führt (dann stammt sie aus
   Phase Q dieses Laufs). Nein, wenn ein Heft eines **anderen** Ordners unter
   `src/data/einheiten/` die ID referenziert oder der Bauplan sie nicht kennt.

| Befund | Folge |
|---|---|
| weder Karte noch Archivordner | Muster `q-<n><h>-…` gilt |
| vorhanden, gehört dieser Einheit | verwenden, nichts neu anlegen |
| vorhanden, gehört einer anderen Einheit | Alle Quellen-IDs dieser Einheit — beide Hefte — heissen `q-<n>.<k><h>-…` mit der kleinsten Zahl `k ≥ 2`, für die weder eine Karte noch ein Archivordner `q-<n>.<k>a-pflicht` oder `q-<n>.<k>b-pflicht` existiert. |

**Ein Satz, ein Muster — nie gemischt.** Eine Einheit trägt entweder nur IDs
ohne `.<k>` oder nur IDs mit demselben `.<k>`.

**Ausnahme aus Bauplan §9.** Nennt Bauplan §9 ausdrücklich, dass die Einheit
die Quellen-IDs (Karten und Archivtexte) einer anderen Einheit verwendet,
gelten diese IDs — auch im Auto-Modus; der Bauplan ist deswegen nicht «nicht
erzeugbar». Die fremden Karten werden gelesen, nie geändert. Ohne Eintrag in
§9 bleibt es bei der Tabelle oben, und ein Bauplan, der eine vergebene ID
führt, ist nicht erzeugbar.

Beispiel: Eine frühere Einheit führt schon `q-212a-pflicht`. Die neue Einheit
`2.1.2_quellen_pruefen_teilen` bekommt `q-212.2a-pflicht`,
`q-212.2a-pflicht-ersatz`, `q-212.2a-vertiefung-1`, `q-212.2a-vertiefung-2`
und dasselbe mit `q-212.2b-…`. Gäbe es auch `q-212.2a-pflicht` schon, wäre
`k = 3`.

### 4.2 Eine Karte fehlt

Die Regel vergibt Namen, sie erzeugt keine Quelle. Fehlt für einen Slot die
Karte oder der Volltext im Archiv, gilt `references/auto-modus.md` (E23): keine
erfundene Karte, für dieses Heft nur die Spur `ohne_medien`.

---

## 5. Archiv

```
D:\OS\_lab\quellen-archiv\bbw-hko\<quellen-id>\gewaehlt\quelle.md
D:\OS\_lab\quellen-archiv\bbw-hko\<quellen-id>\kandidat-1\
D:\OS\_lab\quellen-archiv\bbw-hko\<quellen-id>\kandidat-2\
```

- `gewaehlt\quelle.md` ist der Volltext oder das Transkript der gewählten
  Quelle. Verworfene Kandidaten liegen daneben unter `kandidat-N\`.
- Das Feld `archiv_ref` der Karte ist `<quellen-id>/gewaehlt` — mit
  Schrägstrich, relativ zum Archiv.
- **Nie im Repo.** Kein Volltext, kein Transkript, kein Auszug in irgendeiner
  Datei unter `D:\OS\dev\bbw-hko\`.

Beispiel: `D:\OS\_lab\quellen-archiv\bbw-hko\q-212a-pflicht\gewaehlt\quelle.md`,
`archiv_ref`: `q-212a-pflicht/gewaehlt`.

Prüfschritt vor Phase 5: Für jede Quelle, die ein Heft einbindet, existieren
die Karte **und** `gewaehlt\quelle.md`. Fehlt eines, gilt Abschnitt 4.2.

---

## 6. `status`

`set.json` trägt exakt `"status": "entwurf"`. Kein anderer Wert, kein
Weglassen: Der Index-Builder behandelt alles andere als live.

Prüfschritt: `ERR_V42_STATUS` (`check-v42.mjs`), `ERR_STATUS_UNBEKANNT` und
`ERR_STATUS_NICHT_ENTWURF` (`check-all.mjs`).

---

## 7. `einheit_titel`

Der Fokus als Titel, in normaler Schreibweise mit Umlauten, **ohne
Versionszusatz**.

Prüfschritt: Trägt schon eine andere Einheit denselben `einheit_titel`?
Nachsehen im Index `src/data/einheiten.index.json` (je Einheit das Feld
`einheit_titel`) — nicht durch Lesen fremder `set.json`.

| Befund | `einheit_titel` |
|---|---|
| kein gleicher Titel | «Quellen prüfen» |
| gleicher Titel vorhanden | derselbe Titel mit einem Zusatz in Klammern, der die zwei Einheiten unterscheidet — zuerst der Lehrgang: «Quellen prüfen (EFZ 4J)» |

Der Titel ist nicht Teil des Ordnernamens und lässt sich später ändern; der
Ordner nicht.

---

## 8. Ein ganzes Beispiel

Auftrag: EFZ 3-jährig, Kompetenz `2.1.2`. Fokus aus Phase 0: «Quellen prüfen,
bevor ich etwas teile».

| Schritt | Prüfung | Ergebnis |
|---|---|---|
| Nummer | erste Kompetenz von Heft A | `2.1.2` |
| slug | Gegenstand + Verb | `quellen_pruefen` |
| Suffix | `2.1.2` in 4J: vorhanden, Text gleich | keines |
| Ordner | `src/data/einheiten/2.1.2_quellen_pruefen/` existiert nicht | `2.1.2_quellen_pruefen` |
| IDs | — | `2.1.2_quellen_pruefen_hf_A`, `_hf_B`, `_set`, `_kn`, `_prinzip` |
| `topic_slug` | — | `quellen_pruefen` |
| Kurzlink | — | `/m/2.1.2_quellen_pruefen`, QR `https://bbw-hko.ch/m/2.1.2_quellen_pruefen#a` und `#b` |
| Quellen-IDs | weder Karte noch Archivordner `q-212a-pflicht`, `q-212b-pflicht` | `q-212a-…`, `q-212b-…` |
| Archiv | — | `D:\OS\_lab\quellen-archiv\bbw-hko\q-212a-pflicht\gewaehlt\quelle.md` usw. |
| `status` | — | `entwurf` |
| `einheit_titel` | kein gleicher Titel | «Quellen prüfen» |

## 9. Rückgängig

Solange nichts gedruckt ist: Ordner umbenennen, alle IDs und Verweise
ersetzen, Karten und Archivordner umbenennen, Index neu bauen. Nach dem ersten
Druck: nichts davon.
