# Phase 0 — Verortung

**Ergebnis:** das Verortungsblatt (Bauplan §1 und §2): Lehrgang, Lebensbezug,
Kompetenzen je Heft, Sprachmodi je Kompetenz, zulässige Spuren je Heft, SK des
Themas, Aspekte, Kapiteldateien mit geprüften Seiten, Ordnername und IDs.

**Eingabe:** Lehrgang (`EFZ_3J` oder `EFZ_4J`) und eine Kompetenznummer
`X.Y.Z`. Fehlt der Lehrgang, ist das die einzige Rückfrage vor dieser Phase.
EBA ist nicht Gegenstand dieser Skill.

**Grundsatz (Leitprinzip):** Phase 0 legt fest, **woraus** später Sprachmodi,
Schlüsselkompetenzen und Produkte hergeleitet werden — aus dem nRLP-Datensatz
des Lehrgangs, nie aus der Gold-Einheit. Was hier falsch gelesen wird, kopiert
sich in jede Datei. Darum: Texte, Namen und Nummern **wörtlich aus dem
Datensatz**, nichts aus dem Gedächtnis.

Phase 0 schreibt nichts ins Repo. Sie liest nur.

---

## 1. Lehrgang zuerst

| Lehrgang | Datensatz |
|---|---|
| `EFZ_3J` | `public/nrlp_3j.json` |
| `EFZ_4J` | `public/nrlp_4j.json` |

Dieselbe Nummer bedeutet in den zwei Dateien nicht dasselbe. Nie eine Nummer
auflösen, bevor der Lehrgang feststeht; nie im «anderen» Datensatz nachsehen,
wenn die Nummer im eigenen fehlt — dann ist die Eingabe falsch und die Einheit
nicht erzeugbar (Meldung).

Der genannte Lehrgang ist der **kanonische** (`lehrgang`, einwertig, in jeder
Datei gleich). Ob ein zweiter dazukommt, klärt Abschnitt 7.

## 2. Nachschlagen — Feldpfade

`X` = Thema, `X.Y` = Lebensbezug, `X.Y.Z` = Kompetenz.

| Was | Feldpfad | Hinweis |
|---|---|---|
| Thema | `themen[]` mit `nr == X` → `titel`, `lehrjahr`, `leitidee` | `nr` ist eine Zahl |
| Lebensbezug | `themen[].lebensbezuege[]` mit `nr == "X.Y"` → `text`, `lektionen` | T7 hat keine `lebensbezuege` → nicht erzeugbar |
| Kompetenzen | `themen[].lebensbezuege[].kompetenzen[]` → `nr`, `text` | **alle** Kompetenzen des Lebensbezugs lesen, nicht nur die genannte |
| Aspekte je Kompetenz | `…kompetenzen[].gesellschaftliche_inhalte[]` → `aspekt`, `detail` | `aspekt` zeichengenau übernehmen |
| Sprachmodi je Kompetenz | `…kompetenzen[].sprachmodi[]` → `modus`, `detail` | Abschnitt 4 |
| SK des Themas | `zirkularitaet.schluesselkompetenzen[]` → `bezeichnung`, `wiederholungen["T<X>"]` | Abschnitt 5 |
| Iteration der Aspekte | `zirkularitaet.gesellschaftsinhalte[]` → `bezeichnung`, `wiederholungen["T<X>"]` | Abschnitt 5 |

`text` von Lebensbezug und Kompetenz wird später wörtlich in die Hefte
geschrieben (`nrlp.lebensbezug_text`, `nrlp.kompetenz_text`,
`nrlp.kompetenzen[].text`). Nicht kürzen, nicht glätten.

## 3. Zuschnitt — eine Einheit ist ein Lebensbezug

Die Einheit deckt den **ganzen Lebensbezug** `X.Y` ab, nicht nur die genannte
Kompetenz. Reihenfolge = Reihenfolge von `kompetenzen[]` im Datensatz.

| Kompetenzen im Lebensbezug | Heft A | Heft B |
|---|---|---|
| eine | diese Kompetenz, Verben **verstehen / analysieren** | dieselbe Kompetenz, Verben **anwenden / handeln** |
| zwei | die erste | die zweite |
| drei | die erste | die zweite und die dritte |
| mehr als drei | die erste | die ein bis zwei **nächstliegenden**; der Rest steht im Bauplan §8 als Lücke |

- **Heft B trägt höchstens zwei Kompetenzen**, Heft A immer genau eine.
- **Nächstliegend** (nur bei mehr als drei): zuerst die Kompetenz, die Pietro
  genannt hat, falls sie nicht die erste ist; danach die mit demselben `aspekt`
  wie eine schon gewählte B-Kompetenz; bei Gleichstand die kleinere Nummer.
- **Nennt Pietro eine Kompetenz, die nicht die erste ist**, ändert das den
  Zuschnitt nicht: Heft A bleibt die erste Kompetenz des Lebensbezugs, die
  genannte liegt in Heft B. Das Verortungsblatt sagt es in einem Satz.
- **Eine Kompetenz, zwei Hefte:** Die Verben der Kompetenz werden auf A und B
  verteilt (A die erkennenden, B die handelnden). Das Verortungsblatt nennt je
  Heft die Verben wörtlich aus `text`.
- **Ordnernummer** = `nr` der ersten (einzigen) Kompetenz von Heft A im
  kanonischen Lehrgang.

Je Heft entsteht `nrlp.nr_primary` (Liste der Kompetenznummern) und `nrlp.nr`
(die erste davon).

## 4. Sprachmodi je Kompetenz und zulässige Spuren je Heft

**Quelle ist die Kompetenz-Ebene:**
`themen[].lebensbezuege[].kompetenzen[].sprachmodi[].modus`.

Nie die Themen-Ebene (`themen[].sprachmodi[]`) und nie die Spirale
(`zirkularitaet.sprachmodi[]`) in ein Heft übernehmen. Die Themen-Ebene nennt
oft «Rezeption mündlich» für das ganze Thema; wer sie kopiert, sperrt die Spur
ohne Medien für jedes Heft dieses Themas.

Die neun zulässigen Bezeichnungen und ihre IDs stehen in
`references/sprachmodus-ids.md`. Ein leeres `modus` (kommt im Datensatz vor)
zählt als «kein Modus» und wird im Verortungsblatt als Lücke vermerkt.

**Modi je Heft (Ausgangswert):** die Vereinigung der `modus`-Werte aller
Kompetenzen des Hefts. Phase 1 legt daraus fest, welche das Heft führt
(`nrlp.sprachmodi` = `prinzip.modi_pro_heft[L]`).

**Zulässige Spuren je Heft** — nach `regel4` in `scripts/check-v42.mjs`:

| Modi des Hefts | Zulässige Spuren |
|---|---|
| enthalten «Rezeption mündlich» oder «Rezeption audiovisuell» | **nur** `mit_medien` |
| sonst | `ohne_medien` und `mit_medien` |

`regel4` liest nicht den Datensatz, sondern `nrlp.sprachmodi` des Hefts
vereinigt mit `prinzip.modi_pro_heft[L]`. Massgebend ist also, **welche Modi
das Heft führt**. Daraus folgen zwei Regeln:

1. Verlangt eine Kompetenz des Hefts Rezeption mündlich oder audiovisuell,
   führt das Heft diesen Modus — er wird nicht gestrichen, um die Spur ohne
   Medien zu retten (Leitfaden §4.4). Eine Abweichung ist eine Ausnahme im
   Bauplan §9 und eine Lücke in §8; sie entscheidet Pietro im Stopp.
2. Das Verortungsblatt nennt je Heft die Spuren **mit Grund**: den Modus und
   die Kompetenz, aus der er stammt.

Hat ein Heft nur `mit_medien`, braucht es zwingend eine Quelle (Phase Q). Das
steht im Verortungsblatt als Voraussetzung.

## 5. Schlüsselkompetenzen und Aspekte des Themas

**SK:** Die Nummer einer SK ist ihre Position in
`zirkularitaet.schluesselkompetenzen[]` (1–12). Zum Thema gehören alle
Einträge, deren `wiederholungen` den Schlüssel `"T<X>"` tragen; der Wert ist
die Iteration (`R1`, `R2`, …). Notiert wird: Nummer, `bezeichnung`, Iteration.

Gegenprobe: `themen[].schluesselkompetenzen[]` (Langtexte) hat gleich viele
Einträge. Weicht die Zahl ab: die Liste aus der Zirkularität verwenden, die
Abweichung im Verortungsblatt und im Bericht nennen, den Datensatz nicht
ändern. `npm run check:nrlp` prüft dieselbe Übereinstimmung.

Diese Liste ist die **einzige** Grundlage für die SK je Heft und die
KN-Schnittmenge (Phase 1). SK-Nummern anderer Einheiten sind keine Quelle.

**Aspekte:** je Kompetenz die Namen aus `gesellschaftliche_inhalte[].aspekt`,
zeichengenau (zum Beispiel «Technologische und digitale Transformation»,
«Identität und Sozialisation»). Die Iteration kommt aus
`zirkularitaet.gesellschaftsinhalte[]`: Eintrag mit gleicher `bezeichnung`,
`wiederholungen["T<X>"]`. Fehlt dort der Schlüssel für das Thema, steht im
Verortungsblatt «keine Iteration im Datensatz» — keine Stufe erfinden.

## 6. Lehrmittel — Crosswalk, Datei, Text

1. **Zeile suchen:** `references/nrlp-lehrmittel-crosswalk.md`, Tabelle des
   Lehrgangs, Zeile des Lebensbezugs. Steht dort «wie 3J x.y», gilt die
   genannte Zeile der 3J-Tabelle; Kern- und Methodenkapitel je für sich
   auflösen. Nie ein Kapitel aus der nRLP-Nummer ableiten.
2. **Datei bestimmen:** je Kapitel genau eine Datei unter
   `material/_lehrmittel/`, über den **exakten Dateinamen** (Kapitelnummer,
   Unterstrich, Kapiteltitel mit Unterstrichen, `.md`) — kein Muster auf die
   Nummer, nie eine Datei, die auf `_combo.md` endet.
3. **Existenz prüfen:** Fehlt der Ordner oder eine Datei der Zeile, ist die
   Einheit **nicht erzeugbar**. Nichts schreiben, Grund melden. Kein anderes
   Kapitel auf Verdacht.
4. **Am Text prüfen, was auf den Seiten steht.** Jede Datei lesen; aus den
   Markern `[seite: NN]` den Seitenindex bauen (erste und letzte Seite, je
   Seite die Abschnitte). Dann je Heft festhalten:
   - welche Seiten die Begriffe und Kategorien für LF1 tragen,
   - welche Seiten das Verfahren oder Schema für LF2 tragen,
   - welcher zusammenhängende Abschnitt als Lehrmittel-Abschnitt für LF3 ohne
     Medien taugt (nur wenn das Heft die Spur hat),
   - was die Kompetenz verlangt, das Lehrmittel aber **nicht** trägt.
   Notiert werden Kapitel, Seiten und Stichworte in eigenen Worten — nie ein
   Satz aus dem Lehrmittel. Eine Seite, die nicht am Marker geprüft ist, wird
   nicht genannt.
5. **Methodenkapitel** (16.x–20.x) nur aufführen, wenn sie zu einem Modus der
   Kompetenzen passen; sie liefern später die Methodenkarten.
6. **Kapitel ausserhalb der Zeile:** lokal mit Begründung in den Bauplan §2
   und den Crosswalk nachführen, bevor es verwendet wird. Unbeaufsichtigt:
   nicht verwenden.

Trägt das Lehrmittel eine Kompetenz nicht wörtlich (das kommt vor), wird das
hier festgestellt und nicht in Phase 5 entdeckt: Das Verortungsblatt nennt,
welche Aussage belegt ist und welche nicht.

## 7. Zweiter Lehrgang (`lehrgaenge`)

Ein zweiter EFZ-Lehrgang ist nur zulässig, wenn im anderen Datensatz

- **jede** abgedeckte Kompetenz (alle aus Heft A und Heft B) unter **derselben
  Nummer** steht,
- ihr `text` **zeichengleich** ist, und
- der `text` des Lebensbezugs zeichengleich ist.

Prüfen durch Lesen beider Dateien, nicht durch Vermuten. Trifft alles zu,
führt `set.json` `lehrgaenge` mit beiden Werten; `lehrgang` bleibt der
kanonische. Trifft eines nicht zu: nur der kanonische Lehrgang.
`scripts/sync-einheiten-nrlp.mjs` prüft dasselbe beim Build und meldet einen
unzulässigen Eintrag (Hintergrund: `CLAUDE.md`, Abschnitt «Mehrfach-Lehrgang»).

## 8. Ordnername und IDs

Nach `references/ableitungsregeln.md` (ENTSCHEIDE E21) — ableiten, nicht
fragen. Phase 0 liefert:

- **Fokus** in einem Satz: Gegenstand des Lebensbezugs und das tragende Verb
  der Kompetenzen, aus `lebensbezuege[].text` und `kompetenzen[].text`.
- **Ordnername-Kandidat** `<X.Y.Z>_<slug>`: `X.Y.Z` = erste Kompetenz von
  Heft A; `slug` = zwei bis drei Wörter aus dem Fokus.
- **Lehrgang-Suffix** nur, wenn die Einheit für einen Lehrgang gilt und
  dieselbe Nummer im anderen EFZ-Lehrgang mit anderem Text existiert
  (Ergebnis aus Abschnitt 7).
- **Frei?** `src/data/einheiten/<ordner>/` darf nicht existieren. Die
  Quellen-ID `q-<n><h>-pflicht` darf weder als Karte unter `src/data/quellen/`
  noch als Archivordner einer anderen Einheit gehören.

## 9. Gesperrte Wörter (ENTSCHEIDE E24)

`check-v42.mjs` sperrt sechs Wörter in jeder Einheit, als Teilzeichenkette und
ohne Unterschied von Gross- und Kleinschreibung: Leasing, Konsumkredit,
Kleinkredit, E-Bike, Ebike, Mobilität.

Prüfen: Kommt eines davon in `lebensbezuege[].text`, in einem
`kompetenzen[].text`, in einem `detail` der Kompetenzen oder im Titel eines
Kernkapitels vor, das die Hefte nennen müssten? Dann ist die Einheit **nicht
erzeugbar**, bis das Skript korrigiert ist. Das Skript wird nicht geändert.

## 10. Verortungsblatt

Ausgabe in dieser Form (lokal: als Bauplan §1–§2; im Auto-Modus steht sie
schon im Bauplan und wird nur gegen den Datensatz nachgeprüft):

```
Lehrgang (kanonisch): …      Datensatz: public/nrlp_….json
Weitere Lehrgänge:    … | keiner — Grund
Thema:                T<X> — <titel> · Lehrjahr <n>
Lebensbezug:          <X.Y> — <text wörtlich>
Heft A:  <X.Y.Z> — <text wörtlich>
         Modi: … (je Modus die Kompetenz)   Spuren: … — Grund
         Aspekte: <aspekt> (<Iteration>) …
Heft B:  <X.Y.Z> [+ <X.Y.Z>] — <text wörtlich>
         Modi: …                              Spuren: … — Grund
         Aspekte: …
Nicht abgedeckte Kompetenzen des Lebensbezugs: … | keine
SK des Themas: <Nr> <bezeichnung> (<Iteration>) · …   Gegenprobe: gleich | abweichend
Kapitel:  <Datei> · S. aa–bb · wofür (Heft, Leitfrage) · am Text geprüft am JJJJ-MM-TT
          nicht belegt: …
Fokus:    …
Ordner:   <X.Y.Z>_<slug>   frei: ja | nein     IDs: <ordner>_{hf_A,hf_B,set,kn,prinzip}
Gesperrte Wörter (E24): kein Treffer | Treffer: …
```

## 11. Wann Phase 0 abbricht

| Befund | Folge |
|---|---|
| Nummer steht im Datensatz des Lehrgangs nicht; Thema ohne Lebensbezüge | nicht erzeugbar, Meldung |
| Lebensbezug fehlt im Crosswalk | lokal: Kapitel suchen, begründen, Crosswalk nachführen; unbeaufsichtigt: nicht erzeugbar |
| Kapiteldatei fehlt | nicht erzeugbar, nichts schreiben |
| gesperrtes Wort im Gegenstand | nicht erzeugbar bis zur Korrektur des Skripts |
| Ordner existiert, auch mit verlängertem slug | nicht erzeugbar (E21) |
| Heft hat nur `mit_medien` und es gibt keine Quelle | lokal: Phase Q zuerst; unbeaufsichtigt: nicht erzeugbar |

Alles andere ist kein Abbruch, sondern ein Eintrag im Verortungsblatt.
