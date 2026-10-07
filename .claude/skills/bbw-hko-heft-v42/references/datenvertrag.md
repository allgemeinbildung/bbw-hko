# Datenvertrag v4.2 — jedes Feld, jede Regel

Dieses Dokument sagt für jedes Feld der fünf Einheitsdateien und der
Quellenkarte: was es ist, woher sein Wert kommt und welche Prüfung es bestehen
muss. Grundlage sind die Gold-Einheit
`src/data/einheiten/1.3.1_konsum_verantworten_v42/`, die Karten
`src/data/quellen/q-131*.json`, `src/lib/einheiten/types.ts` und die vier
Prüfskripte. **Der Vertrag ist eingefroren: Es gibt genau die Felder, die hier
stehen. Kein neues Feld, kein umbenanntes, keine andere Form.**

Die Abschnitte 2–8 führen jedes Feld der Gold-Dateien und kein anderes. Was
nach der Gold-Einheit durch einen Entscheid dazugekommen ist und in Gold nicht
vorkommt (E25, E26), steht in Abschnitt 12.

Die Skelette unter `assets/` zeigen dieselbe Struktur als JSON. Widerspricht
ein Skelett diesem Dokument, gilt dieses Dokument; widerspricht dieses Dokument
einem Skript, gilt das Skript.

## 1. Lesehilfe

**Feldpfad.** `a.b[].c` heisst: Schlüssel `c` in jedem Element der Liste `b`.
Steht in einer Zeile mehr als ein Pfad, sind es der Behälter und seine Teile.

**Herkunft** — vier Arten:

| Kürzel | Bedeutung |
|---|---|
| KONSTANT | Der Wert steht fest und wird wörtlich aus dem Skelett übernommen. |
| ABGELEITET | Der Wert folgt ohne Urteil aus einer anderen Stelle: aus dem Ordnernamen (`references/ableitungsregeln.md`), aus dem nRLP-Datensatz des Lehrgangs (`public/nrlp_3j.json`, `public/nrlp_4j.json`), aus `kn.json` oder `prinzip.json`. |
| BAUPLAN | Der Wert ist ein Entscheid, der im Bauplan steht (`docs/cloud-run/bauplaene/<ordner>.md`) und beim Schreiben nur übernommen wird. |
| GENERIERT Phase n | Der Wert wird in dieser Phase geschrieben (Phasentabelle in `SKILL.md` §4): 2 Prinzip · 3 KN · 4 Heft-Kern · 5 Spuren · 6 Abschluss und Bilder · 7 Set · Q Quellen. |

**Budget / Regel.** Genannt ist der Fehlercode des Skripts. Zeichen zählt
`check-v42.mjs` als Codepoints, Leerzeichen inbegriffen; «≤ 220» heisst
höchstens 220 Zeichen. Steht «—», prüft kein Skript die Länge; ob der Text auf
die Seite passt, zeigt dann erst die Messung in Phase 9. `ERR_V42_*` kommt aus
`scripts/check-v42.mjs`, `ERR_LF_*` und `WARN_LF_*` aus
`scripts/check-lf-loesung.mjs`, die übrigen `ERR_*` und `WARN_*` aus
`scripts/check-einheiten.mjs` und `scripts/check-all.mjs`.

**Zwei Stadien.** Auf der Platte steht der Kern eines Hefts einmal und jede
Spur für sich unter `spuren`. Erst `loadEinheit` setzt Kern und Spur zusammen
(ENTSCHEIDE E3). Dieses Dokument beschreibt nur die Platte. Was beim Laden
entsteht, steht in Abschnitt 11 — und gehört in keine Datei.

**Nur für die Lehrperson.** Felder mit dem Vermerk «nur LP» erscheinen nie im
Heft und nie auf der QR-Seite, sondern im Dokument «Lösungen» und im Begleiter.

## 2. herausforderung_A.json und herausforderung_B.json — Kern

Der Kern ist in beiden Spuren gleich. Er darf nichts voraussetzen, was nur eine
Spur liefert (kein Verweis auf «die Quelle» als Medium, keine Zahl aus einem
Artikel).

### 2.1 Kopf und Lehrplanbezug

| Feldpfad | Typ / Wertform | Bedeutung | Herkunft | Budget / Regel |
|---|---|---|---|---|
| `id` | string `<ordner>_hf_A` bzw. `_hf_B` | Kennung des Hefts. | ABGELEITET ← Ordner | `ERR_ID`: beginnt mit `<ordner>_` |
| `template` | string | Einziger Schalter für allen v4.2-Code. | KONSTANT `heft_8page_v42` | `ERR_V42_TEMPLATE`, `ERR_TEMPLATE` |
| `modul` | string `X.Y` | Nummer des Lebensbezugs. | ABGELEITET ← Kompetenznummer | — |
| `modul_titel` | string | Titel des Themas aus dem Datensatz, Gedankenstrich, Kurzform des Lebensbezugs. In A, B und `set.json` gleich. | ABGELEITET ← `themen[].titel`; Kurzform GENERIERT Phase 4 | — |
| `lehrgang` | string `EFZ_3J` oder `EFZ_4J` | Kanonischer Lehrgang; entscheidet, aus welchem Datensatz Texte aufgelöst werden. Einwertig. | BAUPLAN | `ERR_LEHRGANG`, `ERR_LEHRGANG_UNEINIG` (A und B gleich) |
| `buchstabe` | string `A` oder `B` | Welches Heft. | KONSTANT je Datei | `ERR_BUCHSTABE`: gleich wie im Dateinamen |
| `sit_farbe` · `sit_farbe_light` · `sit_farbe_mid` | string, Hex-Farbe | Farbtripel des Hefts. | KONSTANT je Buchstabe — A: `#C0392B`, `#FADBD8`, `#E74C3C` · B: `#2471A3`, `#D6EAF8`, `#3498DB` | — |
| `titel` | string | Titel des Hefts auf Seite 1. | BAUPLAN | `ERR_V42_BUDGET` ≤ 60 |
| `herausforderung` · `herausforderung.buchstabe` · `herausforderung.label` | object · string · string | Kurzbezeichnung der Herausforderung; `buchstabe` wie oben, `label` = `prinzip.herausforderungen.<A/B>.herausforderung`. | ABGELEITET ← `prinzip.json` | — |
| `prinzip_ref` | string `<ordner>_prinzip` | Verweis auf das Prinzip. | ABGELEITET ← Ordner | — |
| `nrlp` | object | Lehrplanbezug dieses Hefts. | — | — |
| `nrlp.nr` | string `X.Y.Z` | Erste Kompetenz des Hefts. | BAUPLAN | `sync-einheiten-nrlp --check` löst darüber `kompetenz_text` auf |
| `nrlp.nr_primary` | string[] 1–2 | Alle Kompetenzen, die das Heft real abdeckt; erster Eintrag = `nrlp.nr`. | BAUPLAN | — |
| `nrlp.lebensbezug` | string `X.Y` | Lebensbezug der Kompetenz. | ABGELEITET ← Kompetenznummer | — |
| `nrlp.themen` | string[] `T<n>` | Thema der Kompetenz. | ABGELEITET ← Kompetenznummer | — |
| `nrlp.gesellschaft` · `nrlp.gesellschaft[].aspekt` · `nrlp.gesellschaft[].iteration` | object[] · string · string `R1`–`R4` | Aspekte, die das Heft aktiviert, mit Wiederholungsstufe. Immer eine Liste von Objekten, nie ein Objekt. `aspekt` wörtlich wie im Datensatz. | ABGELEITET ← `themen[].lebensbezuege[].kompetenzen[].gesellschaftliche_inhalte[].aspekt` (Auswahl) und `zirkularitaet.gesellschaftsinhalte[].wiederholungen` für das Thema; gleich wie `prinzip.aspekte.<Aspekt>` | — |
| `nrlp.sprachmodi` | string[] | Sprachmodi der Kompetenzen dieses Hefts, wörtlich. **Quelle ist die Kompetenz-Ebene** `themen[].lebensbezuege[].kompetenzen[].sprachmodi[].modus`, **nie** die Themen-Ebene `themen[].sprachmodi`: Die Themen-Ebene nennt Modi des ganzen Themas, und ein dort stehendes «Rezeption mündlich» sperrt die Spur ohne Medien. | ABGELEITET ← Datensatz (Kompetenz-Ebene) | `ERR_V42_R4`: enthält die Liste oder `prinzip.modi_pro_heft.<A/B>` einen Eintrag, der mit «Rezeption mündlich» oder «Rezeption audiovisuell» beginnt, darf das Heft keine Spur `ohne_medien` haben |
| `nrlp.sprachmodus_ids` | string[] `SM1`–`SM9` | Kennungen parallel zu `nrlp.sprachmodi`: gleiche Reihenfolge, gleiche Länge. | ABGELEITET ← `references/sprachmodus-ids.md` | — |
| `nrlp.sk` | number[] | Schlüsselkompetenzen, die das Heft übt. Zahl = Position in `zirkularitaet.schluesselkompetenzen[]`, bei 1 beginnend. Redaktionelle Auswahl. | BAUPLAN | — |
| `nrlp.kompetenz_id` | string | Gleich wie `nrlp.nr`. | ABGELEITET | — |
| `nrlp.lebensbezug_id` | string | Gleich wie `nrlp.lebensbezug`. | ABGELEITET | — |
| `nrlp.kompetenz_text` | string | Satz der Kompetenz `nrlp.nr`, zeichengenau. | ABGELEITET ← Datensatz, `kompetenzen[].text` | `sync-einheiten-nrlp --check`: jede Abweichung ist ein Befund im Tor |
| `nrlp.lebensbezug_text` | string | Satz des Lebensbezugs, zeichengenau. | ABGELEITET ← Datensatz, `lebensbezuege[].text` | wie oben |
| `nrlp.kompetenzen` · `nrlp.kompetenzen[].nr` · `nrlp.kompetenzen[].text` | object[] · string · string | Alle Kompetenzen des Hefts mit ihrem Satz. **Die Skill schreibt dieses Feld nicht** (Form von Gold-Heft A). Beleg: `enrichKompetenzen()` in `src/lib/einheiten/kompetenz-text.ts` füllt es bei jedem Rendern frisch aus `nrlp.nr_primary` und überschreibt, was auf der Platte steht — aufgerufen von `src/pages/einheiten/[setKey].astro`, der Werkstatt und `scripts/export-v42.mjs`; die Renderer lesen es und fallen sonst auf `nrlp.kompetenz_text` zurück. `scripts/sync-einheiten-nrlp.mjs` gleicht nur `kompetenz_text` und `lebensbezug_text` ab, dieses Feld nicht. Eine Kopie auf der Platte wird also von keinem Skript verlangt und von keinem nachgeführt. Gold-Heft B (zwei Kompetenzen) trägt eine solche Kopie; sie ist zulässig, aber nicht nötig: `nr_primary` genügt, damit Seite 1 beide Sätze druckt. | — (entsteht beim Laden) | — |
| `persona` · `persona.beruf` · `persona.betrieb` · `persona.ort` | object · string × 3 | Neutrale Person, keine erfundene Figur. `beruf` = «Lernende/r EFZ, N. Lehrjahr» mit dem Lehrjahr des Themas (`themen[].lehrjahr`). | KONSTANT `Lernende/r EFZ, <N>. Lehrjahr` · `eigener Lehrbetrieb` · `eigener Wohnort` | `ERR_PERSONA_SPEZIFISCH` |
| `wochen` | number | Altfeld des Bogens; im Heft ohne sichtbare Wirkung. | KONSTANT `1` | — |

### 2.2 Seite 1 — Situation

| Feldpfad | Typ / Wertform | Bedeutung | Herkunft | Budget / Regel |
|---|---|---|---|---|
| `situation_text` | string | Fall des Hefts in Ich-Form. Voraussetzungsfrei: Alles, was die Lernenden brauchen, steht im Text oder im Lehrmittel. | GENERIERT Phase 4 (Fall: BAUPLAN) | `ERR_V42_BUDGET` 650–900 · `ERR_V42_R9_FALL` · `ERR_VORAUSSETZUNG_VOR_START` · `ERR_QUERVERWEIS_ALS_BEDINGUNG` |
| `zahlen_tabelle` · `zahlen_tabelle[].label` · `zahlen_tabelle[].wert` | object[] 0–4 · string · string | Zahlen des Falls als Tabelle. Erfundene Fallzahlen, keine Zahlen über die Welt. | GENERIERT Phase 4 | `ERR_V42_BUDGET` ≤ 4 Zeilen · Label ≤ 45 · Wert ≤ 15 |
| `leitfrage` | string | Die eine Frage des Hefts, Ich-Form. | GENERIERT Phase 4 | `ERR_V42_BUDGET` ≤ 140 |
| `mehrdeutigkeit` · `mehrdeutigkeit.explizit` | object · boolean | Spannungsfeld des Hefts. | KONSTANT `explizit: true` | — |
| `mehrdeutigkeit.trade_off` | string «X vs. Y» | Das Spannungsfeld; ein Eintrag aus `prinzip.mehrdeutigkeits_architektur.trade_off_raum`. | ABGELEITET ← `prinzip.json` | `ERR_V42_BUDGET` ≤ 70 |
| `mehrdeutigkeit.hint` | string | Benennt beide Pole konkret, nimmt die Wahl nicht ab. Sie-Form. | GENERIERT Phase 4 | `ERR_V42_BUDGET` ≤ 160 |
| `quellen_anker` · `quellen_anker[].ref` · `quellen_anker[].titel` · `quellen_anker[].unterueberschrift` · `quellen_anker[].seiten` · `quellen_anker[].fuer_leitfrage` | object[] 0–3 · string `Kap. X.Y` · string · string · string `Seite aa-bb` · number[] | Lehrmittel-Kapitel, auf die das Heft sich stützt, mit den Leitfragen, denen sie dienen. Seiten am Kapiteltext geprüft (Marker `[seite: NN]`). `unterueberschrift` nennt in eigenen Worten, was auf den Seiten steht. | GENERIERT Phase 4 ← Verortung Phase 0 | `ERR_V42_BUDGET` ≤ 3 Einträge; gedruckte Zeile «Titel · Unterüberschrift · Ref · Seiten» ≤ 90 |
| `wochen_plan` · `wochen_plan[].label` · `wochen_plan[].text` · `wochen_plan[].aktiv` | object[3] · string · string · boolean | «Übersicht» auf Seite 1 in drei Teilen. Der Feldname ist alt; im Text steht keine Woche, keine Lektion, keine Minute (E17). | KONSTANT Labels `Teil 1`, `Teil 2`, `Teil 3`; `aktiv`: `true`, `false`, `false` · Text GENERIERT Phase 6 | `ERR_V42_BUDGET` genau 3 · Text ≤ 80 |

### 2.3 Seite 2 — Leitfragen 1 und 2

`leitfragen` trägt auf der Platte **genau** LF1 und LF2. LF3 und LF4 stehen
unter `spuren` (Abschnitte 3 und 4).

| Feldpfad | Typ / Wertform | Bedeutung | Herkunft | Budget / Regel |
|---|---|---|---|---|
| `leitfragen_intro` | string | Sagt, was jede der vier Leitfragen zum Produkt beiträgt. In beiden Spuren wahr. | GENERIERT Phase 4 | `ERR_V42_BUDGET` ≤ 300 |
| `auftakt_typ` | string | Wozu das Intro dient. | KONSTANT `pfad` | `WARN_AUFTAKT_VORBEREITUNG` bei `vorbereitung` |
| `leitfragen` | object[2] | LF1 und LF2. | — | `ERR_V42_R1`: genau `nr` 1 und 2 |
| `leitfragen[].nr` | number | Nummer der Leitfrage. | KONSTANT `1`, `2` | `ERR_V42_R1` |
| `leitfragen[].bloom` | string | Denkstufe als Wort. | KONSTANT LF1 `Verstehen`, LF2 `Anwenden` | — |
| `leitfragen[].knoten_ref` | string `Kap. X.Y \| S. aa-bb` | Fundstelle im Lehrmittel; bei LF2 mit Zusatz «· eigener Fall». Stützt sich LF2 auf zwei Kapitel: «Kap. X.Y \| S. NN · Kap. A.B \| S. NN · eigener Fall» (kein Skript erzwingt ein Muster). Bindestrich zwischen den Seiten. | GENERIERT Phase 4 ← Verortung Phase 0 | — |
| `leitfragen[].text` | string | Die Frage, Sie-Form. LF1: Begriffe und Kategorien. LF2: auf den eigenen Fall anwenden. | GENERIERT Phase 4 | `ERR_V42_BUDGET` ≤ 220 · `WARN_LF_MEHRFACHAUFTRAG`: höchstens zwei Aufträge der Form «Verb Sie» |
| `leitfragen[].liefert` | string | Baustein des Produkts, den die Antwort liefert. Nominal, ohne «Sie» und ohne «Ihr/Ihre». | GENERIERT Phase 4 | `ERR_V42_BUDGET` ≤ 50 und 3–7 Wörter · `ERR_LF_LIEFERT_MISSING` · `WARN_LIEFERT_LAENGE` · `WARN_LIEFERT_VERBFORM` |
| `leitfragen[].antwortform` | string | Art des Antwortfelds. | KONSTANT `schreibfeld` | — |
| `leitfragen[].feld_hoehe_mm` | number | Mindesthöhe des Schreibfelds (E16); der Renderer gibt freien Platz dazu. | KONSTANT LF1 `35`, LF2 `45` | `ERR_V42_BUDGET` exakt |
| `leitfragen[].scaffolding` · `leitfragen[].scaffolding.strategien` · `leitfragen[].scaffolding.satzanfaenge` · `leitfragen[].scaffolding.produkt` | object · string[2] · string[2–3] · string | Schreibhilfe neben der Frage: «So gehen Sie vor», Satzanfänge in Guillemets, «Ins Produkt». | GENERIERT Phase 4 | `ERR_V42_BUDGET` genau 2 × ≤ 90 · 2–3 × ≤ 60 · ≤ 110 |
| `leitfragen[].loesung` · `leitfragen[].loesung.kern` | object · string | Lösung, nur LP. `kern` ist die Kurzzeile. | GENERIERT Phase 4, zusammen mit der Frage | `WARN_LF_LOESUNG_ZU_LANG` kern ≤ 55 · `ERR_LF_LOESUNG_MISSING` |
| `leitfragen[].loesung.zeilen` · `leitfragen[].loesung.zeilen[].label` · `leitfragen[].loesung.zeilen[].text` · `leitfragen[].loesung.zeilen[].quelle` | object[3–6] · string · string · string | Der Massstab in Zeilen. `quelle` = Fundstelle «Kap. X.Y, S. aa»; fehlt, wo die Zeile vom eigenen Fall der Lernenden handelt. Eigene Worte, kein Lehrmittelsatz. | GENERIERT Phase 4 ← Kapiteltext | `WARN_LF_LOESUNG_ZU_LANG`: 3–6 Zeilen · alle `text` zusammen ≤ 900 · `label` ≤ 24 · `quelle` ≤ 30 · `ERR_ESZETT_FOUND` |

### 2.4 Seite 5 — Auftrag und Feedback-Kriterien

| Feldpfad | Typ / Wertform | Bedeutung | Herkunft | Budget / Regel |
|---|---|---|---|---|
| `handlungsprodukt` | object | Das Produkt des Hefts. | — | — |
| `handlungsprodukt.format` | string | Format in einer Zeile. | BAUPLAN | — |
| `handlungsprodukt.titel` | string | Titel des Produkts. | GENERIERT Phase 4 | `ERR_V42_BUDGET` ≤ 60 |
| `handlungsprodukt.format_detail` | string | Was das Produkt ist und woraus es besteht, Sie-Form. | GENERIERT Phase 4 | `ERR_QUERVERWEIS_ALS_BEDINGUNG` |
| `handlungsprodukt.beschreibung` | string | Was ich mit dem Produkt tue, Ich-Form. | GENERIERT Phase 4 | `ERR_V42_BUDGET` ≤ 200 |
| `handlungsprodukt.schritte` · `handlungsprodukt.schritte[].label` · `handlungsprodukt.schritte[].hint` | object[5] · string · string | Fünf Schritte zum Produkt. Label beginnt mit `01` bis `05`. Die Hinweise der Schritte 1–4 nennen ihre Leitfrage wörtlich («LF1» … «LF4»). Schritt 5 darf ein Prüfschritt oder ein Produktschritt sein (E12). Immer Objekte `{label, hint}`, nie Strings. | GENERIERT Phase 4 | `ERR_V42_BUDGET` genau 5 · Label ≤ 30 · Hint ≤ 140 · `ERR_KOPPLUNG_NICHT_1ZU1` · `WARN_HINT_OHNE_ABSENDER` |
| `handlungsprodukt.hilfe_verweis` | string | Verweis auf die Methodenseite. | KONSTANT `Hilfe: Methoden auf der nächsten Seite` | `ERR_V42_BUDGET` ≤ 70 |
| `handlungsprodukt.abgaben` | string[0–3] | Was abgegeben wird. In beiden Spuren wahr. | GENERIERT Phase 4 | `ERR_V42_BUDGET` ≤ 3 × ≤ 80 |
| `feedback_kriterien` | object[2] | Zwei KN-Kriterien, die das Heft übt: eines mit Dimension SuK, eines mit Ges. A und B zusammen decken alle vier. | — | `ERR_V42_R6` |
| `feedback_kriterien[].kn_kriterium` | string | Name eines Kriteriums, zeichengenau wie `kn.rubrik_shared.kriterien[].name`. | ABGELEITET ← `prinzip.kn_kriterien_verteilung` und `kn.json` | `ERR_V42_R6` |
| `feedback_kriterien[].dimension` | string `SuK` oder `Ges` | Dimension wie im KN. | ABGELEITET ← `kn.json`; im Skelett erst SuK, dann Ges | `ERR_V42_R6` |
| `feedback_kriterien[].stufen` | string[4] | Die vier Stufen, zeichengenau aus `kn.rubrik_shared.kriterien[].stufen`. Kein eigenes Wort. Index = Punkte 0–3. | ABGELEITET ← `kn.json` | `ERR_V42_R6` zeichengenau · `ERR_V42_BUDGET` je ≤ 120 · vom Fall-Ausschluss ausgenommen (E8) |
| `feedback_kriterien[].indikator_produkt` | string | Woran das Kriterium an diesem Produkt zu sehen ist. Einziger eigener Text im Kriterium. | GENERIERT Phase 4 | `ERR_V42_BUDGET` ≤ 90 |
| `lernfortschritt` · `lernfortschritt.scaffold_90` | object · string | Stütze für Lernende, die mehr Gerüst brauchen. Jede Spur überschreibt den Wert mit ihrem eigenen `scaffold_90`. Nennt nur Stützen, die es im Heft gibt. | GENERIERT Phase 4 | — |
| `lernfortschritt.scaffold_100` | string | «Plus»: Zusatzaufgabe. Ohne das Wort «Spur». | GENERIERT Phase 4 | `ERR_V42_BUDGET` ≤ 150 |

### 2.5 Seite 6 — Methoden und Beispielbild

| Feldpfad | Typ / Wertform | Bedeutung | Herkunft | Budget / Regel |
|---|---|---|---|---|
| `methoden` | object[4] | Vier Karten der Methodenkartei. Genau ein Eintrag ist der Platzhalter der Spur; im Skelett steht er an zweiter Stelle. Für das Layout gilt `docs/methodenkartei.md`: genau zwei der vier Karten tragen ein Beispiel — die Rezeptionskarte der Spur zählt mit. Kein Skript zählt das bei v4.2. | Refs BAUPLAN | `ERR_V42_METHODEN`: genau 4, genau 1 mit `__spur__` |
| `methoden[].ref` | string | ID einer Karte in `src/data/methoden/` oder `__spur__`. | BAUPLAN · Platzhalter KONSTANT `__spur__` | `ERR_V42_KARTE_FEHLT_METHODE` |
| `methoden[].fuer` | string | Wofür die Karte in dieser Abgabe dient. | GENERIERT Phase 4 · beim Platzhalter KONSTANT `Rezeptionswerkzeug der gewählten Spur` | — |
| `methoden[].tun` | string | Übertragung der Methode auf diese Abgabe. Nur bei Lehrmittel-Karten (`lm-…`); bei `hko-…`-Karten und beim Platzhalter fehlt der Schlüssel. | GENERIERT Phase 4 | — |
| `handlungsprodukt.beispielbild` | object | Ausgefülltes Produkt an einem **anderen** Fall, im Heft unter den Methodenkarten, in beiden Spuren. Der Fall kommt weder im Heft noch im Auftrag noch im KN vor. | GENERIERT Phase 6 | `ERR_V42_PRODUKTBILD`: muss vorhanden sein |
| `handlungsprodukt.beispielbild.titel` | string | Kopfzeile, nennt den Fall. | GENERIERT Phase 6 | `ERR_V42_BUDGET` ≤ 90 |
| `handlungsprodukt.beispielbild.legende` · `handlungsprodukt.beispielbild.legende[].key` · `handlungsprodukt.beispielbild.legende[].text` | object[0–3] · string · string | Markierungen. Die Position bestimmt das Zeichen: gefüllter, leerer, halb gefüllter Kreis. `key` ist ein frei wählbares kurzes Kennwort in Kleinbuchstaben. | GENERIERT Phase 6 | `ERR_V42_BUDGET` ≤ 3 · Text ≤ 28 |
| `handlungsprodukt.beispielbild.bloecke` · `handlungsprodukt.beispielbild.bloecke[].titel` | object[2–3] · string | Blöcke nebeneinander; je Block genau eine Blockart (2.7 und Abschnitt 12). | GENERIERT Phase 6 | `ERR_V42_BUDGET` 2–3 Blöcke · Titel ≤ 32 · `ERR_V42_PRODUKTBILD`: genau eine Blockart je Block |
| `handlungsprodukt.beispielbild.bloecke[].eintraege` · `handlungsprodukt.beispielbild.bloecke[].eintraege[].text` · `handlungsprodukt.beispielbild.bloecke[].eintraege[].marke` · `handlungsprodukt.beispielbild.bloecke[].eintraege[].notiz` | object[0–5] · string · string · string | Listenform. `marke` und `notiz` nur, wo der Eintrag eine Markierung oder Randnotiz trägt. | GENERIERT Phase 6 | `ERR_V42_BUDGET` ≤ 5 Einträge · Text ≤ 105 · Notiz ≤ 60 · `ERR_V42_PRODUKTBILD`: `marke` ist ein `key` der Legende |
| `handlungsprodukt.beispielbild.bloecke[].kopf` · `handlungsprodukt.beispielbild.bloecke[].zeilen` · `handlungsprodukt.beispielbild.bloecke[].zeilen[].zellen` · `handlungsprodukt.beispielbild.bloecke[].zeilen[].marke` · `handlungsprodukt.beispielbild.bloecke[].zeilen[].stark` | string[] · object[0–12] · string[] · string · boolean | Tabellenform (2.7). `stark: true` setzt eine Zeile fett (Kopf- oder Summenzeile); sonst fehlt der Schlüssel. | GENERIERT Phase 6 | `ERR_V42_BUDGET` ≤ 12 Zeilen · erste Zelle ≤ 30 · `ERR_V42_PRODUKTBILD` wie oben |

### 2.6 Seite 8 — Begriffsnetz, Abschluss, Checkliste

| Feldpfad | Typ / Wertform | Bedeutung | Herkunft | Budget / Regel |
|---|---|---|---|---|
| `mindmap_zentrum` | string | Zentrum des Begriffsnetzes, in A und B identisch. Flaches Feld. | ABGELEITET ← `prinzip.mindmap_zentrum_kurz` | `ERR_V42_BUDGET` ≤ 40 · `ERR_V42_R7`: A = B |
| `mindmap_aeste` | object[4] | Drei Äste des Hefts und der Transfer-Ast. | — | `ERR_V42_BUDGET` genau 4 · `ERR_V42_R7`: genau ein Ast mit `transfer: true` |
| `mindmap_aeste[].titel` | string | Titel des Asts. | GENERIERT Phase 6 · Transfer-Ast KONSTANT `gilt auch bei …` | `ERR_V42_BUDGET` ≤ 30 |
| `mindmap_aeste[].punkte` | string[0–5] | Die Knoten des Netzes. **Jeder Knoten ist ein `set.glossar[].begriff` dieses Hefts ohne `spur`, und jeder solche Glossarbegriff ist ein Knoten** — gleiche Schreibweise. Beim Transfer-Ast leer. | GENERIERT Phase 6 | `ERR_V42_BUDGET` ≤ 5 je Ast · je ≤ 25 · ≤ 10 Knoten im Heft · `ERR_V42_GLOSSAR` |
| `mindmap_aeste[].optional` | boolean | Altfeld. | KONSTANT `false` | — |
| `mindmap_aeste[].transfer` | boolean | Markiert den einen Ast «gilt auch bei …». Nur dort gesetzt. | KONSTANT `true` beim vierten Ast | `ERR_V42_R7` |
| `abschluss` · `abschluss.quercheck` | object · string[2] | Die offenen Fragen der Situation zum Abhaken, Ich-Form. | GENERIERT Phase 6 | `ERR_V42_BUDGET` genau 2 × ≤ 110 |
| `abschluss.mitnahme` | string[3] | «Das nehme ich mit»: drei Zeilenanfänge. Kein Verweis auf den gemeinsamen Auftrag (E17). | GENERIERT Phase 6 · dritte Zeile KONSTANT `Mir noch unklar` | `ERR_V42_BUDGET` genau 3 × ≤ 50 |
| `abschluss.loesung` | object | Mögliche Lösung der Seite 8, nur LP. | GENERIERT Phase 6 | `ERR_V42_LOESUNG`: muss vorhanden sein |
| `abschluss.loesung.verbindungen` · `abschluss.loesung.verbindungen[].von` · `abschluss.loesung.verbindungen[].nach` · `abschluss.loesung.verbindungen[].text` | object[≥ 5] · string × 3 | Beschriftete Verbindungen. `von` und `nach` sind je ein Knoten aus `mindmap_aeste[].punkte` oder der Titel des Transfer-Asts; mindestens eine Verbindung führt zum Transfer-Ast. Begriffe aus `eigene_knoten` sind keine zulässigen Enden. | GENERIERT Phase 6 | `ERR_V42_LOESUNG` |
| `abschluss.loesung.transfer` | string | Eintrag für das Feld «gilt auch bei …». | GENERIERT Phase 6 | `ERR_V42_LOESUNG`: nicht leer |
| `abschluss.loesung.eigene_knoten` · `abschluss.loesung.eigene_knoten.ohne_medien` · `abschluss.loesung.eigene_knoten.mit_medien` | object · string[2] · string[2] | Begriffe für die zwei leeren Knoten «aus meinem Raster», je Spur. Je vorhandene Spur ein Schlüssel mit genau zwei Begriffen. | GENERIERT Phase 6 ← Raster der Spur | `ERR_V42_LOESUNG`: genau 2 je vorhandene Spur |
| `abschluss.loesung.quercheck` | string[2] | Antworten auf die Quer-Check-Fragen, gleiche Reihenfolge. | GENERIERT Phase 6 | `ERR_V42_LOESUNG`: so viele wie Fragen |
| `abschluss.loesung.mitnahme` | string[3] | Mögliche Einträge zu den drei Zeilen. | GENERIERT Phase 6 | `ERR_V42_LOESUNG`: so viele wie Zeilen |
| `bewertungsraster` · `bewertungsraster[].produkt` · `bewertungsraster[].vollstaendig_wenn` | object[4] · string · string[0–3] | Checkliste «vollständig, wenn …». Vier Zeilen: Leitfragen, Quelle, das Produkt, Abschluss. Jeder Punkt in beiden Spuren wahr. Kein Gewicht, keine Note. | KONSTANT `produkt`: `Leitfragen`, `Quelle`, (Produktname GENERIERT), `Abschluss`; KONSTANT die drei Punkte von «Abschluss» und die Punkte 2 und 3 von «Quelle» (Skelett) · Rest GENERIERT Phase 6 | `ERR_V42_BUDGET` genau 4 Zeilen · ≤ 3 Punkte · je ≤ 70 · `ERR_QUERVERWEIS_ALS_BEDINGUNG` |

### 2.7 Lösungsbild und die zwei Formen des Produktbilds

| Feldpfad | Typ / Wertform | Bedeutung | Herkunft | Budget / Regel |
|---|---|---|---|---|
| `handlungsprodukt.loesungsbild` | object | Mögliche Lösung zum Fall **des Hefts**, nur LP (Dokument «Lösungen»). Gleiche Blöcke und gleiche Legende wie das Beispielbild. | GENERIERT Phase 6 | `ERR_V42_PRODUKTBILD`: muss vorhanden sein · `ERR_V42_R9_FALL` gilt auch hier |
| `handlungsprodukt.loesungsbild.titel` | string | Kopfzeile, nennt den Fall des Hefts. | GENERIERT Phase 6 | `ERR_V42_BUDGET` ≤ 90 |
| `handlungsprodukt.loesungsbild.hinweis` | string | An die Lehrperson: eine mögliche Lösung, keine Vorlage; wann zeigen. Angenommene Posten oder Zahlen, die die Situation nicht nennt, sind hier als Annahme gekennzeichnet. Nur im Lösungsbild. | GENERIERT Phase 6 | — |
| `handlungsprodukt.loesungsbild.legende` · `handlungsprodukt.loesungsbild.legende[].key` · `handlungsprodukt.loesungsbild.legende[].text` | object[0–3] · string · string | Wie im Beispielbild. | ABGELEITET ← Beispielbild | `ERR_V42_BUDGET` ≤ 3 · Text ≤ 28 |
| `handlungsprodukt.loesungsbild.bloecke` · `handlungsprodukt.loesungsbild.bloecke[].titel` | object[2–3] · string | Wie im Beispielbild. | GENERIERT Phase 6 | `ERR_V42_BUDGET` 2–3 · Titel ≤ 32 |
| `handlungsprodukt.loesungsbild.bloecke[].eintraege` · `handlungsprodukt.loesungsbild.bloecke[].eintraege[].text` · `handlungsprodukt.loesungsbild.bloecke[].eintraege[].marke` · `handlungsprodukt.loesungsbild.bloecke[].eintraege[].notiz` | object[0–7] · string × 3 | Listenform. Das Blatt der Lehrperson ist grösser als die halbe Heftseite, darum die weiteren Grenzen. | GENERIERT Phase 6 | `ERR_V42_BUDGET` ≤ 7 Einträge · Text ≤ 130 · Notiz ≤ 60 · `ERR_V42_PRODUKTBILD` |
| `handlungsprodukt.loesungsbild.bloecke[].kopf` · `handlungsprodukt.loesungsbild.bloecke[].zeilen` · `handlungsprodukt.loesungsbild.bloecke[].zeilen[].zellen` · `handlungsprodukt.loesungsbild.bloecke[].zeilen[].marke` · `handlungsprodukt.loesungsbild.bloecke[].zeilen[].stark` | string[] · object[0–12] · string[] · string · boolean | Tabellenform. | GENERIERT Phase 6 | `ERR_V42_BUDGET` ≤ 12 Zeilen · erste Zelle ≤ 30 · `ERR_V42_PRODUKTBILD` |

**Listenform** (alle Blöcke von Gold-Heft A; die Blöcke 2 und 3 von Gold-Heft B)
— ein Block ist eine Liste von Einträgen:

```json
{ "titel": "…", "eintraege": [ { "marke": "<key>", "text": "…", "notiz": "…" }, { "text": "…" } ] }
```

**Tabellenform** (Block 1 von Gold-Heft B) — ein Block ist eine Tabelle mit
Kopfzeile; jede Zeile hat so viele Zellen wie `kopf`:

```json
{ "titel": "…", "kopf": [ "…", "…", "…" ], "zeilen": [ { "zellen": [ "…", "…", "…" ], "stark": true }, { "zellen": [ "…", "…", "…" ], "marke": "<key>" } ] }
```

**Wann welche.** Entschieden wird je Block, nicht je Heft. Ein Block trägt
**genau eine** Blockart (`ERR_V42_PRODUKTBILD`); zu Liste und Tabelle sind mit
E26 Fliesstext und Wechselrede gekommen (Abschnitt 12). Welche Art zum Produkt
passt, leitet `references/phase-6-abschluss.md` aus dem Produkttyp her. In
Kürze:

| Blockart | Schlüssel | Wofür |
|---|---|---|
| Liste | `eintraege` | Stichworte, Sätze, Regeln, Notizen |
| Tabelle | `kopf`, `zeilen` | mehrere gleichartige Zeilen mit Werten in festen Spalten |
| Fliesstext (E26) | `text` | Brief, Statement, Kommentar, Leserbrief |
| Wechselrede (E26) | `wechsel` | Gespräch, Diskussion, Interview |

Das Skelett führt nur die Listenform; wer eine andere Art braucht, ersetzt in
dem einen Block `eintraege`. Beispielbild und Lösungsbild eines Hefts haben
denselben Aufbau: gleiche Blocktitel, gleiche Legende, je Block dieselbe Art.

### 2.8 Übergabe an Prinzip und KN, Spuren

| Feldpfad | Typ / Wertform | Bedeutung | Herkunft | Budget / Regel |
|---|---|---|---|---|
| `dekontextualisierung` · `dekontextualisierung.frage` · `dekontextualisierung.ziel` | object · string · string | Frage, die vom Fall wegführt, und das Prinzip des Hefts in einem Satz. | GENERIERT Phase 4 ← `prinzip.dekontextualisierungs_anker` | — |
| `prinzip_handoff` · `prinzip_handoff.kernkonzept` · `prinzip_handoff.lehrmittel_anker` · `prinzip_handoff.transfer_check` | object · string × 3 | Was das Heft zum Prinzip beiträgt: Kernkonzept (= `set.konzept_progression[].konzept`), alle Kapitel und Seiten, Prüffrage für den Transfer. | GENERIERT Phase 4 | `ERR_QUERVERWEIS_ALS_BEDINGUNG` (`lehrmittel_anker`) |
| `prinzip_handoff.kn_aktivierung` | string | Was der KN aus diesem Heft verlangt. Einziges Feld des Hefts, das den Fall des KN nennen darf. | GENERIERT Phase 4 ← `kn.json` | vom Fall-Ausschluss ausgenommen |
| `sk_anker` · `sk_anker[].sk` · `sk_anker[].wo` | object[] · number · string | Je Schlüsselkompetenz aus `nrlp.sk`, wo im Heft sie geübt wird. Form von `wo`: «<Feldpfad oder Seite> — <was dort geübt wird>», etwa «leitfragen[3] + Produkt — …». | GENERIERT Phase 4 | — |
| `spuren` | object | Die Spuren des Hefts: `ohne_medien` und/oder `mit_medien`. Eine Spur fehlt, wenn sie nicht zulässig ist oder ihre Voraussetzung fehlt. | — | `ERR_V42_R4`: mindestens eine Spur |

## 3. spuren.ohne_medien

Lehrmittel-Abschnitt statt Medium, dafür mehr Gerüst: Beispielzeile im Raster,
Denkhilfe zu LF4. Die Spur gibt es nicht, wenn das Heft Rezeption mündlich
oder audiovisuell verlangt (`ERR_V42_R4`). Sie hat keine `quellen`
(`ERR_V42_R3`).

| Feldpfad | Typ / Wertform | Bedeutung | Herkunft | Budget / Regel |
|---|---|---|---|---|
| `spuren.ohne_medien` · `spuren.ohne_medien.leitfragen` | object · object[2] | LF3 und LF4 dieser Spur. | — | `ERR_V42_R1`: genau `nr` 3 und 4 |
| `spuren.ohne_medien.leitfragen[].nr` | number | Nummer. | KONSTANT `3`, `4` | `ERR_V42_R1` |
| `spuren.ohne_medien.leitfragen[].bloom` | string | Denkstufe. | KONSTANT LF3 `Analysieren`, LF4 `Beurteilen` | — |
| `spuren.ohne_medien.leitfragen[].knoten_ref` | string | LF3: der Lehrmittel-Abschnitt `Kap. X.Y \| S. aa-bb`, gleich wie im Raster. LF4: die zwei Pole in der Form des Pol-Typs (`references/phase-5-spuren.md` §6), etwa `Kap. X.Y ↔ eigener Fall` oder `Kap. X.Y · <Position> ↔ <Gegenposition>`. | GENERIERT Phase 5 | — |
| `spuren.ohne_medien.leitfragen[].text` | string | LF3: Raster auswerten und Befund in zwei bis drei Sätzen festhalten. LF4: Spannung zwischen zwei Polen beurteilen und entscheiden. Erst schreiben, wenn am Kapiteltext geprüft ist, was auf den Seiten steht. | GENERIERT Phase 5 | `ERR_V42_BUDGET` ≤ 220 · `WARN_LF_MEHRFACHAUFTRAG` |
| `spuren.ohne_medien.leitfragen[].liefert` | string | Baustein des Produkts. In beiden Spuren gleich, weil der Kern (Schritte, Intro) darauf verweist. | GENERIERT Phase 5 | `ERR_V42_BUDGET` ≤ 50, 3–7 Wörter · `WARN_LIEFERT_VERBFORM` |
| `spuren.ohne_medien.leitfragen[].antwortform` | string | Art des Antwortfelds. | KONSTANT LF3 `raster`, LF4 `schreibfeld` | `ERR_V42_R1` |
| `spuren.ohne_medien.leitfragen[].feld_hoehe_mm` | number | Mindesthöhe: bei LF3 das Feld für den Befund. | KONSTANT LF3 `25`, LF4 `45` | `ERR_V42_BUDGET` exakt |
| `spuren.ohne_medien.leitfragen[].pol_typ` | string | Nur LF4: Art der zwei Pole. In dieser Spur `position_gegenposition`, `modell_eigener_fall` oder `recht_praxis`; anderer Wert als im anderen Heft derselben Spur. | ABGELEITET ← `prinzip.pol_typ_verteilung.<A/B>.ohne_medien` | `ERR_V42_R1` gesetzt · `ERR_V42_R5` |
| `spuren.ohne_medien.leitfragen[].raster` | object | Nur LF3: das Raster auf Seite 3. | — | `ERR_V42_R3` |
| `spuren.ohne_medien.leitfragen[].raster.knoten_ref` | string `Kap. X.Y \| S. aa-bb` | Der Lehrmittel-Abschnitt, am Kapiteltext geprüft. | GENERIERT Phase 5 ← Verortung | `ERR_V42_R3`: gesetzt |
| `spuren.ohne_medien.leitfragen[].raster.auftrag` | string | Leseauftrag über dem Raster: drei weitere Aussagen, die erste Zeile ist ein Beispiel, je ein Begriff aus LF1. | GENERIERT Phase 5 | `ERR_V42_BUDGET` ≤ 220 |
| `spuren.ohne_medien.leitfragen[].raster.spalten` | string[4] | Spaltenköpfe. | KONSTANT `Absatz`, `Kernaussage`, `Beleg / Beispiel`, `→ Begriff` | `ERR_V42_BUDGET` genau 4 × ≤ 18 |
| `spuren.ohne_medien.leitfragen[].raster.zeilen` | number | Zahl der Rasterzeilen, die Beispielzeile mitgezählt. | KONSTANT `4` | `ERR_V42_BUDGET` = 4 |
| `spuren.ohne_medien.leitfragen[].raster.beispielzeile` | string[4] | Vorausgefüllte erste Zeile, eine Zelle je Spalte, in eigenen Worten. | GENERIERT Phase 5 ← Kapiteltext | `ERR_V42_R3`: alle Zellen gefüllt · `ERR_V42_BUDGET` genau 4 × ≤ 25 |
| `spuren.ohne_medien.leitfragen[].scaffolding` · `spuren.ohne_medien.leitfragen[].scaffolding.strategien` · `spuren.ohne_medien.leitfragen[].scaffolding.satzanfaenge` · `spuren.ohne_medien.leitfragen[].scaffolding.produkt` | object · string[2] · string[2–3] · string | Wie im Kern. Bei LF4 Satzanfänge für beide Pole und den Entscheid. | KONSTANT erste Strategie von LF3 und LF4 (Skelett) · Rest GENERIERT Phase 5 | `ERR_V42_BUDGET` genau 2 × ≤ 90 · 2–3 × ≤ 60 · ≤ 110 |
| `spuren.ohne_medien.leitfragen[].loesung` · `spuren.ohne_medien.leitfragen[].loesung.kern` | object · string | Lösung, nur LP. | GENERIERT Phase 5, zusammen mit der Frage | `WARN_LF_LOESUNG_ZU_LANG` kern ≤ 55 · `ERR_LF_LOESUNG_MISSING` |
| `spuren.ohne_medien.leitfragen[].loesung.quelle_ref` | string | Nur LF3: der Abschnitt, an dem die Lösung geprüft ist; gleich wie `raster.knoten_ref`. | ABGELEITET | — |
| `spuren.ohne_medien.leitfragen[].loesung.quelle_stand` | string `JJJJ-MM-TT` | Nur LF3: Tag, an dem die Lösung am Kapiteltext geprüft wurde. | GENERIERT Phase 5 (Tag der Prüfung) | — |
| `spuren.ohne_medien.leitfragen[].loesung.zeilen` · `spuren.ohne_medien.leitfragen[].loesung.zeilen[].label` · `spuren.ohne_medien.leitfragen[].loesung.zeilen[].text` · `spuren.ohne_medien.leitfragen[].loesung.zeilen[].quelle` | object[3–6] · string × 3 | Nur LF3: Massstab in Zeilen, je mit Seite. Labels im Skelett: Erwartet, Auch gültig, Begriffe, Befund. | GENERIERT Phase 5 ← Kapiteltext | `WARN_LF_LOESUNG_ZU_LANG`: 3–6 Zeilen · `text` zusammen ≤ 900 · `label` ≤ 24 · `quelle` ≤ 30 |
| `spuren.ohne_medien.leitfragen[].loesung.raster_zeilen` | string[4][4] | Nur LF3: das ausgefüllte Raster. Erste Zeile ist zeichengleich mit `raster.beispielzeile`. | GENERIERT Phase 5 ← Kapiteltext | `ERR_V42_LOESUNG`: so viele Zeilen wie `raster.zeilen`, je so viele Zellen wie Spalten, Zeile 1 = Beispielzeile |
| `spuren.ohne_medien.leitfragen[].loesung.befund` | string | Nur LF3: ein möglicher Befund, zwei bis drei Sätze. | GENERIERT Phase 5 | `ERR_V42_LOESUNG`: nicht leer |
| `spuren.ohne_medien.leitfragen[].loesung.erwartungshorizont` · `spuren.ohne_medien.leitfragen[].loesung.erwartungshorizont.gut_wenn` · `spuren.ohne_medien.leitfragen[].loesung.erwartungshorizont.beispiel_pol_1` · `spuren.ohne_medien.leitfragen[].loesung.erwartungshorizont.beispiel_pol_2` · `spuren.ohne_medien.leitfragen[].loesung.erwartungshorizont.nicht_tragfaehig` | object · string[] · string × 3 | Nur LF4: Merkmale einer guten Antwort, je eine Beispielantwort für beide Entscheide, und was nicht genügt. Trägt bei LF4 die Lösung; `zeilen` fehlt. | GENERIERT Phase 5 | `ERR_LF_LOESUNG_MISSING`, wenn weder `zeilen` noch ein nicht-leerer Erwartungshorizont da ist · `ERR_ESZETT_FOUND` |
| `spuren.ohne_medien.kasten_s4` · `spuren.ohne_medien.kasten_s4.typ` · `spuren.ohne_medien.kasten_s4.titel` | object · string · string | Kasten auf Seite 4: die Denkhilfe. | KONSTANT `denkhilfe` · `Denkhilfe zu LF4` | — |
| `spuren.ohne_medien.kasten_s4.spalten` | string[2–3] | Spaltenköpfe der Denkhilfe. | GENERIERT Phase 5 | `ERR_V42_BUDGET` 2–3 × ≤ 30 |
| `spuren.ohne_medien.kasten_s4.hinweis` | string | Wie die Denkhilfe zu füllen ist. | GENERIERT Phase 5 | `ERR_V42_BUDGET` ≤ 140 |
| `spuren.ohne_medien.kasten_s4.loesung_zeilen` | string[][] | Mögliche Einträge, nur LP: je Zeile eine Zelle je Spalte. | GENERIERT Phase 5 | `ERR_V42_LOESUNG`: mindestens 1 Zeile, Zellen = Spalten |
| `spuren.ohne_medien.methoden_ref_rezeption` · `spuren.ohne_medien.methoden_ref_rezeption.ref` | object · string | Karte, die den Platzhalter `__spur__` in `methoden` ersetzt. | KONSTANT `hko-quelle-raster` | `ERR_V42_KARTE_FEHLT_METHODE` |
| `spuren.ohne_medien.methoden_ref_rezeption.fuer` | string | Wofür: das Raster zum Abschnitt auf Seite 3. | GENERIERT Phase 5 | — |
| `spuren.ohne_medien.methoden_ref_rezeption.beispiel` | string[] | Eigenes, neutrales Beispiel statt des Karten-Beispiels: Sujet weder aus dem Heft noch aus einer Quelle, im Muster der Karte. | GENERIERT Phase 5 | — |
| `spuren.ohne_medien.scaffold_90` | string | Stütze dieser Spur; überschreibt `lernfortschritt.scaffold_90`. | GENERIERT Phase 5 | — |

## 4. spuren.mit_medien

Eine Quelle mit Raster, bis zu zwei Vertiefungen. Die Spur gibt es nur, wenn
für die Quelle Karte **und** Volltext im Archiv vorliegen. Im Heft heisst die
Quelle «Quelle»; `rolle: "pflicht"` ist nur der interne Wert (E16).

| Feldpfad | Typ / Wertform | Bedeutung | Herkunft | Budget / Regel |
|---|---|---|---|---|
| `spuren.mit_medien` · `spuren.mit_medien.leitfragen` | object · object[2] | LF3 und LF4 dieser Spur. | — | `ERR_V42_R1`: genau `nr` 3 und 4 |
| `spuren.mit_medien.leitfragen[].nr` | number | Nummer. | KONSTANT `3`, `4` | `ERR_V42_R1` |
| `spuren.mit_medien.leitfragen[].bloom` | string | Denkstufe. | KONSTANT LF3 `Analysieren`, LF4 `Beurteilen` | — |
| `spuren.mit_medien.leitfragen[].knoten_ref` | string | LF3 fest; LF4 die zwei Pole in der Form des Pol-Typs (`references/phase-5-spuren.md` §6), etwa `Kap. X.Y ↔ Quelle`. | KONSTANT LF3 `Quelle · Raster` · LF4 GENERIERT Phase 5 | — |
| `spuren.mit_medien.leitfragen[].text` | string | Wie in Abschnitt 3, bezogen auf die Quelle. Erst schreiben, wenn die Quelle gewählt und gelesen ist. | GENERIERT Phase 5 | `ERR_V42_BUDGET` ≤ 220 · `WARN_LF_MEHRFACHAUFTRAG` |
| `spuren.mit_medien.leitfragen[].liefert` | string | Gleich wie in der Spur ohne Medien. | GENERIERT Phase 5 | `ERR_V42_BUDGET` ≤ 50, 3–7 Wörter |
| `spuren.mit_medien.leitfragen[].antwortform` | string | Art des Antwortfelds. | KONSTANT LF3 `raster`, LF4 `schreibfeld` | `ERR_V42_R1` |
| `spuren.mit_medien.leitfragen[].feld_hoehe_mm` | number | Mindesthöhe. | KONSTANT LF3 `25`, LF4 `60` | `ERR_V42_BUDGET` exakt |
| `spuren.mit_medien.leitfragen[].pol_typ` | string | Nur LF4. Zulässig alle fünf: `lehrmittel_quelle`, `position_gegenposition`, `modell_eigener_fall`, `recht_praxis`, `quelle_quelle`; anderer Wert als im anderen Heft derselben Spur. | ABGELEITET ← `prinzip.pol_typ_verteilung.<A/B>.mit_medien` | `ERR_V42_R1` · `ERR_V42_R5` |
| `spuren.mit_medien.leitfragen[].raster` · `spuren.mit_medien.leitfragen[].raster.quelle_ref` | object · string | Nur LF3. ID der Quelle mit `rolle: "pflicht"`. Kein `auftrag`, keine `beispielzeile`, kein `knoten_ref`. | ABGELEITET ← `quellen[]` | `ERR_V42_KARTE_FEHLT_QUELLE` |
| `spuren.mit_medien.leitfragen[].raster.spalten` | string[4] | Spaltenköpfe nach Typ der Quelle; die letzte heisst immer «→ Begriff». Artikel: Absatz · Kernaussage · Beleg / Zahl. Grafik: Was gemessen · auffälliger Wert · Aussage. Video: Bild · Ton · Aussage. Audio: Wer spricht · Kernaussage · Absicht. Rechtstext: Art./Abs. · Voraussetzung · Folge. | ABGELEITET ← `typ` der Quellenkarte (Leitfaden §5) · vierte Spalte KONSTANT `→ Begriff` | `ERR_V42_BUDGET` genau 4 × ≤ 18 |
| `spuren.mit_medien.leitfragen[].raster.zeilen` | number | Zahl der Rasterzeilen. | KONSTANT `4` | `ERR_V42_BUDGET` = 4 |
| `spuren.mit_medien.leitfragen[].scaffolding` · `spuren.mit_medien.leitfragen[].scaffolding.strategien` · `spuren.mit_medien.leitfragen[].scaffolding.satzanfaenge` · `spuren.mit_medien.leitfragen[].scaffolding.produkt` | object · string[2] · string[2–3] · string | Wie im Kern. | GENERIERT Phase 5 | `ERR_V42_BUDGET` genau 2 × ≤ 90 · 2–3 × ≤ 60 · ≤ 110 |
| `spuren.mit_medien.leitfragen[].loesung` · `spuren.mit_medien.leitfragen[].loesung.kern` | object · string | Lösung, nur LP. | GENERIERT Phase 5 | `WARN_LF_LOESUNG_ZU_LANG` kern ≤ 55 |
| `spuren.mit_medien.leitfragen[].loesung.quelle_ref` | string | Nur LF3: ID der Quelle, an der die Lösung geprüft ist. | ABGELEITET ← `raster.quelle_ref` | `ERR_V42_KARTE_FEHLT_QUELLE` |
| `spuren.mit_medien.leitfragen[].loesung.quelle_stand` | string `JJJJ-MM-TT` | Nur LF3: Tag, an dem die Lösung am Archivtext geschrieben wurde (heute) — nicht `sachlage_geprueft` der Karte. | GENERIERT Phase 5 | — |
| `spuren.mit_medien.leitfragen[].loesung.zeilen` · `spuren.mit_medien.leitfragen[].loesung.zeilen[].label` · `spuren.mit_medien.leitfragen[].loesung.zeilen[].text` · `spuren.mit_medien.leitfragen[].loesung.zeilen[].quelle` | object[3–6] · string × 3 | Nur LF3: Massstab in Zeilen, je mit Fundstelle im Ausschnitt (Absatz, Zeitmarke). Hat die Karte ein `ersatz_ref`, trägt eine Zeile «Mit Ersatzquelle» die Lösung für die Ersatzquelle. Eigene Worte, kein Satz der Quelle. | GENERIERT Phase 5 ← Archivtext | `WARN_LF_LOESUNG_ZU_LANG` wie Abschnitt 3 |
| `spuren.mit_medien.leitfragen[].loesung.raster_zeilen` | string[4][4] | Nur LF3: das ausgefüllte Raster. | GENERIERT Phase 5 ← Archivtext | `ERR_V42_LOESUNG`: 4 Zeilen, Zellen = Spalten |
| `spuren.mit_medien.leitfragen[].loesung.befund` | string | Nur LF3: möglicher Befund. | GENERIERT Phase 5 | `ERR_V42_LOESUNG` |
| `spuren.mit_medien.leitfragen[].loesung.erwartungshorizont` · `spuren.mit_medien.leitfragen[].loesung.erwartungshorizont.gut_wenn` · `spuren.mit_medien.leitfragen[].loesung.erwartungshorizont.beispiel_pol_1` · `spuren.mit_medien.leitfragen[].loesung.erwartungshorizont.beispiel_pol_2` · `spuren.mit_medien.leitfragen[].loesung.erwartungshorizont.nicht_tragfaehig` | object · string[] · string × 3 | Nur LF4, wie Abschnitt 3. | GENERIERT Phase 5 | wie Abschnitt 3 |
| `spuren.mit_medien.quellen` | object[1–3] | Einsatz der Quellenkarten: genau eine mit `rolle: "pflicht"`, null bis zwei mit `rolle: "vertiefung"`. | BAUPLAN (Quellen-IDs) | `ERR_V42_R2` |
| `spuren.mit_medien.quellen[].ref` | string | ID einer Karte in `src/data/quellen/`. | ABGELEITET ← `references/ableitungsregeln.md` | `ERR_V42_KARTE_FEHLT_QUELLE` |
| `spuren.mit_medien.quellen[].rolle` | string | Einsatz. | KONSTANT erster Eintrag `pflicht`, die übrigen `vertiefung` | `ERR_V42_R2` |
| `spuren.mit_medien.quellen[].fuer_leitfrage` | number[] | Nur bei `pflicht`: `[3, 4]`, wenn LF4 die Quelle einbezieht, sonst `[3]`. | ABGELEITET ← LF4 der Spur | — |
| `spuren.mit_medien.quellen[].auftrag` | string | Nur bei `pflicht`: Lese-, Seh- oder Hörauftrag über dem Raster. | GENERIERT Phase 5 | `ERR_V42_BUDGET` ≤ 220 |
| `spuren.mit_medien.quellen[].raster` · `spuren.mit_medien.quellen[].raster.spalten` · `spuren.mit_medien.quellen[].raster.zeilen` | object · string[4] · number | Nur bei `pflicht`: Spiegel des Rasters von LF3 — gleiche Spalten, gleiche Zeilenzahl. | ABGELEITET ← `leitfragen[LF3].raster` | `ERR_V42_BUDGET` genau 4 × ≤ 18 · = 4 |
| `spuren.mit_medien.quellen[].leitfrage_vertiefung` | string | Nur bei `vertiefung`: die eine Frage auf der Karte (Seite 4). Der Ausschnitt muss sie ganz tragen. | GENERIERT Phase 5 ← Archivtext | `ERR_V42_BUDGET` ≤ 100 |
| `spuren.mit_medien.quellen[].erwartung` | string | Nur bei `vertiefung`, nur LP: was eine tragfähige Antwort enthält. Liegt nur ein Begleittext des Herausgebers vor, endet sie mit dem Vermerk «nicht gegengehört» (E23). | GENERIERT Phase 5 ← Archivtext | `ERR_V42_LOESUNG`: nicht leer |
| `spuren.mit_medien.kasten_s4` · `spuren.mit_medien.kasten_s4.typ` · `spuren.mit_medien.kasten_s4.titel` | object · string · string | Kasten auf Seite 4: die Vertiefungen. Keine weiteren Schlüssel. | KONSTANT `vertiefung` · `Vertiefung (freiwillig)` | — |
| `spuren.mit_medien.methoden_ref_rezeption` · `spuren.mit_medien.methoden_ref_rezeption.ref` | object · string | Rezeptionskarte in `src/data/methoden/`, passend zum Typ der Quelle: `hko-quelle-raster` (laut Karte für Video, Audio, Artikel und Grafik; Gold-Heft A, Artikel) oder `hko-grafik-lesen` (Gold-Heft B, Grafik). | ABGELEITET ← `typ` der Quellenkarte | `ERR_V42_KARTE_FEHLT_METHODE` |
| `spuren.mit_medien.methoden_ref_rezeption.fuer` | string | Wofür. | KONSTANT `für das Raster zur Quelle (S. 3)` | — |
| `spuren.mit_medien.methoden_ref_rezeption.beispiel` | string[] | Eigenes, neutrales Beispiel im Muster der Karte; darf nicht wie ein Befund aus der Quelle aussehen (E15). | GENERIERT Phase 5 | — |
| `spuren.mit_medien.scaffold_90` | string | Stütze dieser Spur. | GENERIERT Phase 5 | — |

## 5. set.json

| Feldpfad | Typ / Wertform | Bedeutung | Herkunft | Budget / Regel |
|---|---|---|---|---|
| `id` | string `<ordner>_set` | Kennung. | ABGELEITET ← Ordner | — |
| `modul` · `modul_titel` | string · string | Wie in den Heften. Nur Gold, nicht in `types.ts`. | ABGELEITET ← Hefte | — |
| `einheit_titel` | string | Titel der Einheit im Katalog. Gleichnamigkeit wird im Index geprüft (`src/data/einheiten.index.json`, Feld `einheit_titel`). | ABGELEITET ← `references/ableitungsregeln.md` §7 | — |
| `lehrgang` | string | Kanonischer Lehrgang, wie in den Heften. | BAUPLAN | — |
| `thema` | string `T<n>` | Thema. Nur Gold, nicht in `types.ts`. | ABGELEITET ← Kompetenznummer | — |
| `version` | string | Formatstand der Datei. Nur Gold, nicht in `types.ts`. | KONSTANT `2.1.0` | — |
| `status` | string | Sichtbarkeit: nur KT1. Der Index-Builder kennt `entwurf`, `publiziert` und `archiviert` (abgelöste Einheit, E37) und bricht bei jedem anderen Wert ab. | KONSTANT `entwurf` | `ERR_V42_STATUS` · `ERR_STATUS_UNBEKANNT` · `ERR_STATUS_NICHT_ENTWURF` |
| `prinzip_ref` · `kn_ref` | string `<ordner>_prinzip` · `<ordner>_kn` | Verweise. | ABGELEITET ← Ordner | — |
| `herausforderungen` | string[2] | IDs der zwei Hefte. | ABGELEITET ← Ordner | — |
| `wochenplan` · `wochenplan[].woche` · `wochenplan[].lektionen` · `wochenplan[].inhalt` | object[4] · number · number · string | Vorschlag für die Lehrperson: zwölf Lektionen über vier Wochen. Erscheint nie im Heft. | KONSTANT (Skelett): 1 · 3 · `Heft A` / 2 · 3 · `Heft B` / 3 · 3 · `Gemeinsamer Auftrag (2) + Rückmeldung (1)` / 4 · 3 · `KN (2) + Puffer (1)` | — |
| `konzept_progression` · `konzept_progression[].position` · `konzept_progression[].herausforderung` · `konzept_progression[].konzept` | object[2] · number · string · string | Kernkonzept je Heft, in der Reihenfolge A, B. `konzept` = `prinzip_handoff.kernkonzept` des Hefts. | KONSTANT `position` 1, 2 · ID ABGELEITET · Konzept GENERIERT Phase 7 | — |
| `glossar` | object[] | Glossar der Einheit, je Heft. Speist das Glossar auf Seite 8 des Hefts. | GENERIERT Phase 7 | `ERR_V42_GLOSSAR`: je Heft mindestens ein Eintrag · `ERR_V42_R9_FALL` |
| `glossar[].begriff` | string | Der Begriff. Einträge ohne `spur` sind genau die Knoten in `mindmap_aeste[].punkte` des Hefts, gleiche Schreibweise. | GENERIERT Phase 7 ← Phase 6 | `ERR_V42_BUDGET` ≤ 25 · `ERR_V42_GLOSSAR` |
| `glossar[].definition` | string | Erklärung in eigenen Worten; nichts, was nicht im Lehrmittel oder in der Quelle steht. | GENERIERT Phase 7 | `ERR_V42_BUDGET` ≤ 90 |
| `glossar[].herkunft` | string `lehrmittel` · `heft` · `quelle` | Woher der Begriff stammt. `lehrmittel` gilt auch, wenn der Begriff in einem Lehrmittelkapitel ausserhalb der Heft-Kapitel belegt ist (Kapitel und Seite in den Bericht). | GENERIERT Phase 7 | — |
| `glossar[].heft` | string `A` oder `B` | Zu welchem Heft der Eintrag gehört. | GENERIERT Phase 7 | `ERR_V42_GLOSSAR` |
| `glossar[].spur` | string `ohne_medien` oder `mit_medien` | Nur bei Begriffen, die allein aus dem Raster einer Spur stammen. Fehlt der Schlüssel, gilt der Eintrag in beiden Spuren. | GENERIERT Phase 7 | `ERR_V42_BUDGET`: je Heft und Spur ≤ 2 |
| `spur` | string | Welche Spur die Einheit zeigt; `wahl` = beide werden exportiert, die Lehrperson schaltet um. | KONSTANT `wahl` | — |
| `gemeinsamer_auftrag` | object | Auftragsbogen (vier Seiten), in beiden Spuren identisch, braucht kein Medium. | GENERIERT Phase 7 | `ERR_V42_R8`: muss vorhanden sein |
| `gemeinsamer_auftrag.titel` | string | Titel. | GENERIERT Phase 7 | `ERR_V42_R9` · `ERR_V42_R9_FALL` |
| `gemeinsamer_auftrag.lebensbereich` | string | Lebensbereich; anders als Heft A, Heft B und KN. | ABGELEITET ← `prinzip.auftrag_lebensbereich` | `ERR_V42_R9`: gesetzt |
| `gemeinsamer_auftrag.persona` · `gemeinsamer_auftrag.persona.beruf` · `gemeinsamer_auftrag.persona.betrieb` · `gemeinsamer_auftrag.persona.ort` | object · string × 3 | Dieselbe neutrale Person wie in den Heften. | KONSTANT wie Abschnitt 2.1 | — |
| `gemeinsamer_auftrag.situation_text` | string | Neue Situation in Ich-Form; alle Angaben stehen im Text. | GENERIERT Phase 7 (Fall: BAUPLAN) | `ERR_V42_BUDGET` ≤ 900 · `ERR_V42_R9` · `ERR_V42_R9_FALL` |
| `gemeinsamer_auftrag.zahlen_tabelle` · `gemeinsamer_auftrag.zahlen_tabelle[].label` · `gemeinsamer_auftrag.zahlen_tabelle[].wert` | object[0–4] · string · string | Zahlen der Situation. | GENERIERT Phase 7 | `ERR_V42_BUDGET` ≤ 4 Zeilen |
| `gemeinsamer_auftrag.leitfrage` | string | Leitfrage, Ich-Form. | GENERIERT Phase 7 | `ERR_V42_R9` |
| `gemeinsamer_auftrag.mehrdeutigkeit` · `gemeinsamer_auftrag.mehrdeutigkeit.trade_off` · `gemeinsamer_auftrag.mehrdeutigkeit.hint` | object · string · string | Spannungsfeld des Auftrags und Hinweis. | GENERIERT Phase 7 | `ERR_V42_R9` |
| `gemeinsamer_auftrag.aktivierte_trade_offs` | string[≥ 2] | Spannungsfelder, wörtlich aus `prinzip.mehrdeutigkeits_architektur.trade_off_raum`. | ABGELEITET ← `prinzip.json` (Auswahl) | — |
| `gemeinsamer_auftrag.sprachmodi` | string[] | Sprachmodi des Auftrags; als Menge gleich `prinzip.modi_auftrag`. | ABGELEITET ← `prinzip.json` | `ERR_V42_R8` |
| `gemeinsamer_auftrag.sozialform` · `gemeinsamer_auftrag.sozialform.zulaessig` | object · string[] aus `einzel`, `partner`, `gruppe` | Zulässige Sozialformen. Enthält `sprachmodi` einen Modus, der mit «Interaktion» beginnt: ohne `einzel`. Sonst alle drei. | ABGELEITET ← `sprachmodi` (Leitfaden §7.3) | `ERR_V42_R8` |
| `gemeinsamer_auftrag.sozialform.empfehlung` | string | Wird auf A1 gedruckt: ein Vorschlag, an die Lernenden lesbar formuliert — kein Auftrag an die Lehrperson (E18, `references/phase-7-set.md` §4.2). | GENERIERT Phase 7 | — |
| `gemeinsamer_auftrag.auftrag` | string | Der Auftrag in einem Satz, Sie-Form. | GENERIERT Phase 7 | `ERR_V42_R9` |
| `gemeinsamer_auftrag.schritte` · `gemeinsamer_auftrag.schritte[].label` · `gemeinsamer_auftrag.schritte[].hint` | object[5] · string · string | Fünf Schritte; Label beginnt mit `01` bis `05`. | GENERIERT Phase 7 | `ERR_V42_BUDGET` genau 5 · Label ≤ 30 · Hint ≤ 140 · `ERR_V42_R9` |
| `gemeinsamer_auftrag.abgaben` | string[0–3] | Abgaben; je Sprachmodus des Auftrags eine. | GENERIERT Phase 7 | `ERR_V42_BUDGET` ≤ 3 × ≤ 80 · `ERR_V42_R9` |
| `gemeinsamer_auftrag.heft_bezug` · `gemeinsamer_auftrag.heft_bezug[].heft` · `gemeinsamer_auftrag.heft_bezug[].titel` · `gemeinsamer_auftrag.heft_bezug[].inhalte` | object[2] · string · string · string[1–3] | Kasten «Das brauchen Sie aus Ihren Heften»: je Heft, was der Auftrag braucht, mit Seitenzahl. Ersetzt jeden Verweis vom Heft auf den Auftrag (E17). `titel` = Titel des Hefts. | KONSTANT `heft`: `A`, `B` · Titel ABGELEITET · Inhalte GENERIERT Phase 7 | `ERR_V42_BUDGET` ≤ 2 Einträge · Titel ≤ 60 · 1–3 Inhalte je ≤ 60 |
| `gemeinsamer_auftrag.feedback_kriterien` · `gemeinsamer_auftrag.feedback_kriterien[].kn_kriterium` · `gemeinsamer_auftrag.feedback_kriterien[].dimension` · `gemeinsamer_auftrag.feedback_kriterien[].stufen` | object[4] · string · string · string[4] | Alle vier KN-Kriterien, Name, Dimension und Stufen zeichengenau aus `kn.rubrik_shared`, in der Reihenfolge des KN. | ABGELEITET ← `kn.json` | `ERR_V42_R6` |
| `gemeinsamer_auftrag.feedback_kriterien[].indikator_produkt` | string | Woran das Kriterium am Produkt des Auftrags zu sehen ist. | GENERIERT Phase 7 | — |
| `gemeinsamer_auftrag.kontext_ausschluss` | string[] | Gegenstände, die im Auftrag nicht vorkommen dürfen. Form je Eintrag: Begriffe durch Komma getrennt, am Schluss die Herkunft in Klammern — «Begriff, Begriff (Heft A)». Drei Einträge: Heft A, Heft B, KN. | GENERIERT Phase 7 ← Hefte und `prinzip.hybrid_situation_spec.fall_ausschluss_hefte_und_auftrag` | `ERR_V42_R9`: nicht leer; kein Begriff daraus (ab 4 Zeichen, als Teilwort) in Titel, Situation, Zahlen, Leitfrage, Mehrdeutigkeit, Auftrag, Schritten, Abgaben |
| `gemeinsamer_auftrag.erwartungshorizont` · `gemeinsamer_auftrag.erwartungshorizont.gut_wenn` · `gemeinsamer_auftrag.erwartungshorizont.tragfaehig` · `gemeinsamer_auftrag.erwartungshorizont.nicht_tragfaehig` | object · string[] · string · string | Nur LP (Begleiter): Merkmale einer guten Lösung, ein tragfähiges Beispiel, was nicht genügt. | GENERIERT Phase 7 | `ERR_V42_R9_FALL` |
| `gemeinsamer_auftrag.bogen` | string[4] | Seitenfolge des Bogens; informativ — der Wert bleibt, auch wenn `produkte` (Abschnitt 12) die Seiten 2 und 3 anders belegt. Seite 4 heisst «Selbsteinschätzung» (E18). | KONSTANT `situation_auftrag`, `arbeitsflaeche`, `sprechspur`, `selbsteinschaetzung` | — |

Dazu trägt `gemeinsamer_auftrag` in jeder neuen Einheit das Feld `produkte`
(E25). Es steht nicht in Gold; im Skelett steht es nach `abgaben`: Abschnitt 12.1.

## 6. kn.json

Der KN entsteht vor den Heften, weil `rubrik_shared` den Wortlaut der
Feedback-Kriterien liefert. `check-v42.mjs` liest für seine Regeln aus dieser
Datei nur `rubrik_shared.kriterien`; Eszett und Platzhalter prüft es in der
ganzen Datei. Den Fall-Ausschluss wendet es hier nicht an — der Fall des KN
steht ja hier. Felder mit «nur Gold» stehen nicht in `types.ts`.

| Feldpfad | Typ / Wertform | Bedeutung | Herkunft | Budget / Regel |
|---|---|---|---|---|
| `id` | string `<ordner>_kn` | Kennung. | ABGELEITET ← Ordner | — |
| `modul` | string `X.Y` | Lebensbezug. Nur Gold. | ABGELEITET | — |
| `kompetenz_nr` | string `X.Y.Z` | Kompetenznummer der Einheit, wie im Ordnernamen. | ABGELEITET ← Ordner | — |
| `topic_slug` | string | Der slug des Ordners ohne Nummer. | ABGELEITET ← Ordner | — |
| `lehrgang` | string | Wie in den Heften. | BAUPLAN | — |
| `version` | string | Formatstand. Nur Gold. | KONSTANT `1.0.0` | — |
| `erstellt_am` | string `JJJJ-MM-TT` | Tag der Erzeugung. Nur Gold. | GENERIERT Phase 3 (heute) | — |
| `set_ref` · `prinzip_ref` | string | Verweise. Nur Gold. | ABGELEITET ← Ordner | — |
| `anchored_situations` | string[2] | IDs der zwei Hefte. Nur Gold. | ABGELEITET ← Ordner | — |
| `dominanter_aspekt` | string | Aspekt, der die Einheit trägt, wörtlich wie im Datensatz. Der Index übernimmt ihn. | BAUPLAN | — |
| `kern_kompetenzversprechen` | string | Gleich wie im Prinzip. | ABGELEITET ← `prinzip.json` | — |
| `mehrdeutigkeits_pflicht` | string | Gleich wie `prinzip.mehrdeutigkeits_architektur.verbindlich`. | ABGELEITET ← `prinzip.json` | — |
| `hybrid_situation` | object | Der Fall des KN: eine Szene, die beide Hefte zugleich verlangt. | — | — |
| `hybrid_situation.titel` | string | Titel des Falls. | GENERIERT Phase 3 | — |
| `hybrid_situation.persona` · `hybrid_situation.persona.beruf` · `hybrid_situation.persona.betrieb` · `hybrid_situation.persona.ort` | object · string × 3 | Dieselbe neutrale Person; neu ist der Fall, nicht die Person. | KONSTANT wie Abschnitt 2.1 | — |
| `hybrid_situation.emotion_tag` | string | Altfeld. | KONSTANT leerer String | — |
| `hybrid_situation.text` | string | Die Szene in Ich-Form; endet mit der Leitfrage. Gegenstand, Beteiligte und Lebensbereich kommen in keinem Heft, im Auftrag und in keiner Quelle vor. | GENERIERT Phase 3 (Fall: BAUPLAN) | höchstens `prinzip.hybrid_situation_spec.max_woerter` Wörter (kein Skript) |
| `hybrid_situation.leitfrage` | string | Letzter Satz der Szene. | GENERIERT Phase 3 | — |
| `hybrid_situation.aktivierte_trade_offs` | string[≥ 2] | Mindestens zwei, wörtlich aus `prinzip.mehrdeutigkeits_architektur.trade_off_raum` (die Gold-Konstante `must_activate_trade_offs_min` bleibt `1`). | ABGELEITET ← `prinzip.json` (Auswahl) | — |
| `hybrid_situation.definition_kurz` | string | Erklärt den Lernenden den Begriff bei der ersten Verwendung. | KONSTANT (Skelett) | — |
| `hybrid_situation.definition_lang` | string | Erklärung für die Lehrperson. | GENERIERT Phase 3 | — |
| `hybrid_situation.alignment_note` · `hybrid_situation.alignment_note.herausforderungen_mapping` · `hybrid_situation.alignment_note.herausforderungen_mapping[].hf_letter` · `hybrid_situation.alignment_note.herausforderungen_mapping[].scene_element` | object · object[2] · string · string | Welches Element der Szene welches Heft aktiviert. | KONSTANT `hf_letter`: `A`, `B` · Rest GENERIERT Phase 3 | — |
| `hybrid_situation.alignment_note.new_dimensions` | Liste, leer | Altfeld. Nur Gold. | KONSTANT `[]` | — |
| `kn_typen` | object[3] | Die drei Formen des KN, immer alle drei, in dieser Reihenfolge. | — | — |
| `kn_typen[].typ` · `kn_typen[].label` | string · string | Kennung und Name der Form. | KONSTANT `fachgespraech` / `Fachgespräch` · `mini_case_schriftlich` / `Mini Case schriftlich` · `werkschau_transfer` / `Werkschau + Transfer-Reflexion` | — |
| `kn_typen[].format` · `kn_typen[].ablauf` | string · string[] | Rahmen und Ablauf. | KONSTANT (Skelett); einzig die erste Ablaufzeile der Werkschau nennt die zwei Produkte der Hefte | — |
| `kn_typen[].fragestruktur` · `kn_typen[].fragestruktur[].nr` · `kn_typen[].fragestruktur[].typ` · `kn_typen[].fragestruktur[].frage` · `kn_typen[].fragestruktur[].k_stufe` | object[5] · number · string · string · number | Nur Fachgespräch: fünf Fragen steigender Komplexität, Sie-Form. | KONSTANT `nr`, `typ`, `k_stufe` (Skelett) · `frage` GENERIERT Phase 3 | — |
| `kn_typen[].aufgaben` · `kn_typen[].aufgaben[].nr` · `kn_typen[].aufgaben[].typ` · `kn_typen[].aufgaben[].aufgabe` · `kn_typen[].aufgaben[].k_stufe` | object[4] · number · string · string · number | Nur Mini Case: vier Aufgaben, Sie-Form. | KONSTANT `nr`, `typ`, `k_stufe` (Skelett) · `aufgabe` GENERIERT Phase 3 | — |
| `kn_typen[].reflexionsfragen` | string[3] | Nur Werkschau: drei Fragen zur Transfer-Reflexion, Sie-Form. | KONSTANT die erste (Skelett) · Rest GENERIERT Phase 3 | — |
| `kn_typen[].optional_praesentation` | string | Nur Werkschau. | KONSTANT (Skelett) | — |
| `kn_typen[].sk` | number[] | Schlüsselkompetenzen, die die Form prüft; höchstens drei, alle aus den SK der zwei Hefte. | ABGELEITET ← `prinzip.sk_schnittmenge_kn.primary` und `prinzip.sk_pro_situation` (Regel je Form: `references/phase-2-3-prinzip-kn.md`) | — |
| `kn_typen[].aspekte` | string[] | Aspekte der Einheit. | ABGELEITET ← Schlüssel von `prinzip.aspekte` | — |
| `kn_typen[].sprachmodi` | string[] | Sprachmodi der Form: was vorgelegt und was geleistet wird. Nur Gold. Ihre Vereinigung ist `prinzip.modi_kn`. | ABGELEITET ← Form des KN-Typs (`references/phase-2-3-prinzip-kn.md`); für die drei festen Formen stehen die Werte im Skelett | — |
| `kn_typen[].rubrik_ref` | string | Verweis auf die geteilte Rubrik. Nur Gold. | KONSTANT `#rubrik_shared` | — |
| `rubrik_shared` · `rubrik_shared.dimensionen` | object · string[2] | Die eine Rubrik für alle drei Formen. `dimensionen` nur Gold. | KONSTANT `SuK`, `Ges` | — |
| `rubrik_shared.kriterien` · `rubrik_shared.kriterien[].name` · `rubrik_shared.kriterien[].dimension` · `rubrik_shared.kriterien[].stufen` | object[4] · string · string · string[4] | Vier Kriterien: zwei SuK, dann zwei Ges. Je vier Stufen; der Index ist die Punktzahl 0–3. **Dieser Wortlaut wandert zeichengenau in beide Hefte und in den Auftrag** — jede Stufe muss darum auch im Heft passen: höchstens 120 Zeichen, und wenn möglich kein Wort, das nur zum Fall des KN gehört. | GENERIERT Phase 3 · `dimension` KONSTANT `SuK`, `SuK`, `Ges`, `Ges` | `ERR_V42_R6`: Liste vorhanden · über die Hefte `ERR_V42_BUDGET` je Stufe ≤ 120 |
| `rubrik_shared.niveaubaender` · `rubrik_shared.niveaubaender[].label` · `rubrik_shared.niveaubaender[].definition` | object[3] · string · string | Niveaubänder über die Punkte. | KONSTANT (Skelett) | — |
| `template` | string | Kennung der KN-Vorlage. Nur Gold. | KONSTANT `kn_3er_default` | — |
| `legacy` · `source_refs` · `registry_tags` | object, leer | Altfelder. Nur Gold. Nur im KN, nie in einem Heft. | KONSTANT `{}` | — |

## 7. prinzip.json

Der rote Faden der Einheit und alle Verteilungen. Felder mit «nur Gold» stehen
nicht in `types.ts`.

| Feldpfad | Typ / Wertform | Bedeutung | Herkunft | Budget / Regel |
|---|---|---|---|---|
| `id` | string `<ordner>_prinzip` | Kennung. | ABGELEITET ← Ordner | — |
| `modul` · `kompetenz_nr` · `topic_slug` · `lehrgang` | string × 4 | Wie in `kn.json`. | ABGELEITET · `lehrgang` BAUPLAN | — |
| `version` | string | Formatstand. Nur Gold. | KONSTANT `2.1.0` | — |
| `erstellt_am` | string `JJJJ-MM-TT` | Tag der Erzeugung. Nur Gold. | GENERIERT Phase 2 (heute) | — |
| `kern_kompetenzversprechen` | string «Ich kann …» | Das Versprechen der Einheit, ein Satz. | BAUPLAN | — |
| `bloom_zielprofil` · `bloom_zielprofil.LF1` · `bloom_zielprofil.LF2` · `bloom_zielprofil.LF3` · `bloom_zielprofil.LF4` | object · string × 4 | K-Stufe je Leitfrage. | KONSTANT `K2`, `K3`, `K4`, `K4` | — |
| `herausforderungen` · `herausforderungen.A` · `herausforderungen.B` | object | Je Heft ein Eintrag. Kein `C`. | — | — |
| `herausforderungen.A.herausforderung` · `herausforderungen.B.herausforderung` | string | Kurzbezeichnung; wird `herausforderung.label` im Heft. | BAUPLAN | — |
| `herausforderungen.A.konfliktart` · `herausforderungen.B.konfliktart` | string «X vs. Y» | Konfliktart des Hefts. | BAUPLAN | — |
| `herausforderungen.A.handlungsprodukt_typ` · `herausforderungen.B.handlungsprodukt_typ` | string | Typ und Format des Produkts. | BAUPLAN | — |
| `herausforderungen.A.kompetenzen` · `herausforderungen.B.kompetenzen` | string[] | Kompetenzen des Hefts; gleich wie dessen `nrlp.nr_primary`. | BAUPLAN | — |
| `herausforderungen.A.transferrable` · `herausforderungen.B.transferrable` | boolean | Altfeld. | KONSTANT `true` | — |
| `sk_pro_situation` · `sk_pro_situation.A` · `sk_pro_situation.B` | object · number[] × 2 | Schlüsselkompetenzen je Heft; gleich wie `nrlp.sk` des Hefts. | BAUPLAN | — |
| `sk_schnittmenge_kn` · `sk_schnittmenge_kn.primary` | object · number[] | Schlüsselkompetenzen, die der KN prüft. | BAUPLAN | — |
| `aspekte` · `aspekte.*` | object · je Aspekt ein Schlüssel mit Wert `R1`–`R4` | Aspekte der Einheit mit Wiederholungsstufe. Der Schlüssel ist der Name des Aspekts, wörtlich wie im Datensatz (`*` steht für diesen Namen). | BAUPLAN · Stufe ABGELEITET ← `zirkularitaet.gesellschaftsinhalte[].wiederholungen` | — |
| `modi_units` | string[] | Sprachmodi der Hefte zusammen: `modi_pro_heft.A` ∪ `modi_pro_heft.B`. Nur Gold. | ABGELEITET | — |
| `modi_kn` | string[] | Sprachmodi, die der KN über seine drei Formen verlangt: die Vereinigung von `kn.kn_typen[].sprachmodi`. In Phase 2 aus den drei Formen gesetzt, nach Phase 3 gegen `kn.json` geprüft. | ABGELEITET ← `kn.kn_typen[].sprachmodi` | — |
| `mehrdeutigkeits_architektur` · `mehrdeutigkeits_architektur.trade_off_raum` · `mehrdeutigkeits_architektur.verbindlich` | object · string[] «X vs. Y» · string | Die Spannungsfelder der Einheit und der Satz, dass beide Seiten begründbar bleiben. | BAUPLAN · `verbindlich` GENERIERT Phase 2 | — |
| `dekontextualisierungs_anker` · `dekontextualisierungs_anker.anker_statement` · `dekontextualisierungs_anker.transferfeld` | object · string · string | Das Prinzip in einem Satz ohne Fall, und worauf es übertragbar ist. | BAUPLAN (Transfer-Anker) · `transferfeld` GENERIERT Phase 2 | — |
| `zirkularitaet` · `zirkularitaet.r1_aktuell` · `zirkularitaet.r2_voraussicht` · `zirkularitaet.r3_voraussicht` | object · string · string · string | Wo der Gegenstand im Lehrplan steht und wo er wiederkommt. Form: `r1_aktuell` «R<n>» (Iteration des dominanten Aspekts im Thema der Einheit); `r2_voraussicht`, `r3_voraussicht` «T<n> '<Titel>' — <Stichwort>» oder «—». | GENERIERT Phase 2 ← Datensatz (`zirkularitaet`) | — |
| `quellen_anker` · `quellen_anker.chapters` · `quellen_anker.chapters[].ref` · `quellen_anker.chapters[].titel` · `quellen_anker.chapters[].seiten` · `quellen_anker.konzepte` | object · object[] · string `Kap. X.Y` · string · string `Seite aa-bb` · string[] | Die Kapitel aus Bauplan §2, dazu jedes Kapitel, aus dem eine Lösung eine Fundstelle zitiert, und ihre Fachbegriffe; Methodenkarten-Kapitel gehören nicht hinein. Hier ein Objekt, im Heft eine Liste. Nur Gold. | GENERIERT Phase 2 ← Verortung Phase 0 | — |
| `hybrid_situation_spec` · `hybrid_situation_spec.max_woerter` · `hybrid_situation_spec.perspektive` · `hybrid_situation_spec.must_activate_trade_offs_min` · `hybrid_situation_spec.must_combine_herausforderungen` · `hybrid_situation_spec.lehrjahr_constraint` | object · number · string · number · string[2] · string | Vorgaben für den Fall des KN. | KONSTANT `120` · `ICH` · `1` · `A`, `B` · `match_units` | — |
| `hybrid_situation_spec.persona_neutral` · `hybrid_situation_spec.endet_mit_leitfrage` · `hybrid_situation_spec.qualitaetskriterien` | string · boolean · string[5] | Weitere Vorgaben. Nur Gold. In `persona_neutral` wird «{{N}}. Lehrjahr» durch das Lehrjahr der Einheit ersetzt (wie `persona.beruf`). | KONSTANT (Skelett) | — |
| `hybrid_situation_spec.fall_ausschluss_hefte_und_auftrag` | string[] | Begriffe des KN-Falls. Jeder ist in beiden Heften, im Auftrag, im Glossar und in jeder Quellenkarte verboten — als Teilwort, ohne Rücksicht auf Gross- und Kleinschreibung. Darum nur Begriffe, die lang und eindeutig genug sind, dass sie in keinem anderen Wort stecken. | BAUPLAN («dem KN vorbehalten») | `ERR_V42_R9`: nicht leer · speist `ERR_V42_R9_FALL` |
| `modi_pro_heft` · `modi_pro_heft.A` · `modi_pro_heft.B` | object · string[] × 2 | Sprachmodi je Heft; gleich wie `nrlp.sprachmodi` des Hefts. | ABGELEITET ← Datensatz (Kompetenz-Ebene) | `ERR_V42_R4` (zusammen mit `nrlp.sprachmodi`) |
| `kn_kriterien_verteilung` · `kn_kriterien_verteilung.A` · `kn_kriterien_verteilung.B` | object · string[2] × 2 | Welche zwei KN-Kriterien welches Heft übt: je eines SuK und eines Ges; A und B zusammen alle vier. Namen wie in `kn.rubrik_shared`. | GENERIERT Phase 2 und 3 (Entscheid gehört in den Bauplan, wenn er dort geführt ist) | über die Hefte `ERR_V42_R6` |
| `pol_typ_verteilung` · `pol_typ_verteilung.A` · `pol_typ_verteilung.A.ohne_medien` · `pol_typ_verteilung.A.mit_medien` · `pol_typ_verteilung.B` · `pol_typ_verteilung.B.ohne_medien` · `pol_typ_verteilung.B.mit_medien` | object · string × 4 | Pol-Typ von LF4 je Heft und Spur. Je Spur A ≠ B; `lehrmittel_quelle` und `quelle_quelle` nur unter `mit_medien`. Ein Schlüssel fehlt, wenn das Heft die Spur nicht hat. | GENERIERT Phase 2 (wie oben) | über die Hefte `ERR_V42_R5` |
| `mindmap_zentrum_kurz` | string | Kurzform des Ankers; wird `mindmap_zentrum` in A und B. | GENERIERT Phase 2 | über die Hefte `ERR_V42_BUDGET` ≤ 40 |
| `modi_auftrag` | string[1–2] | `modi_kn` ohne die Modi der Hefte. Ist die Differenz leer: der KN-Modus mit dem geringsten Gewicht in den Heften. Sind es mehr als zwei: zwei, der Rest steht als Lücke im Bericht (Leitfaden §7.2). | ABGELEITET | `ERR_V42_R8`: vorhanden und als Menge gleich `set.gemeinsamer_auftrag.sprachmodi` |
| `modi_auftrag_herleitung` | string | Die Formel. Nur Gold. | KONSTANT `modi_kn − (modi_pro_heft.A ∪ modi_pro_heft.B)` | — |
| `auftrag_lebensbereich` | string | Lebensbereich des gemeinsamen Auftrags. Nur Gold. | GENERIERT Phase 2 (wie oben) | — |

## 8. Quellenkarte src/data/quellen/&lt;id&gt;.json

Die Karte trägt nur Metadaten und einen eigenen Kurzbeschrieb. Kein Satz der
Quelle, kein Transkript. Welche Schlüssel eine Karte hat, hängt vom Typ ab:
Text und Grafik tragen `verortung.absaetze` und `woerter`; Audio und Video
tragen `verortung.von`, `verortung.bis` und `dauer_sek`, SRF-Beiträge dazu
`urn`. Das Skelett führt alle Schlüssel; die nicht passenden werden gelöscht.

| Feldpfad | Typ / Wertform | Bedeutung | Herkunft | Budget / Regel |
|---|---|---|---|---|
| `id` | string | Gleich wie der Dateiname ohne `.json`. | ABGELEITET ← `references/ableitungsregeln.md` | `ERR_V42_KARTE_PFLICHTFELD` |
| `typ` | string | Für die Quelle mit Raster (und ihre Ersatzquelle): `artikel`, `grafik`, `datensatz`, `video`, `audio` oder `rechtstext`. `webseite` nur für eine Vertiefung. | GENERIERT Phase Q | `ERR_V42_KARTE_PFLICHTFELD` · `ERR_V42_R2_LAENGE`, wenn eine Karte mit anderem Typ als Quelle mit Raster eingesetzt ist |
| `titel` | string | Titel, wie er im Heft gedruckt wird. | GENERIERT Phase Q | `ERR_V42_BUDGET` ≤ 80, als Vertiefung ≤ 70 · Kurzeintrag «Titel · Herausgeber, Datum» ≤ 100 (Quelle mit Raster) |
| `titel_original` | string | Wörtlicher Titel der Quelle; nur wenn `titel` für den Druck gekürzt ist. | GENERIERT Phase Q | `ERR_V42_R10_VOLLTEXT` ≤ 400 |
| `herausgeber` | string | Wer publiziert hat. | GENERIERT Phase Q | `ERR_V42_BUDGET`: mit `datum` zusammen ≤ 40 |
| `datum` | string | Publikationsdatum `JJJJ-MM-TT`; `JJJJ-MM` oder `JJJJ`, wenn die Quelle nicht mehr nennt; `o. D.`, wenn sie keines trägt. | GENERIERT Phase Q | `ERR_V42_KARTE_PFLICHTFELD`: nicht leer |
| `url` | string | Adresse, möglichst direkt auf den Ausschnitt. | GENERIERT Phase Q | `ERR_V42_KARTE_PFLICHTFELD` · der Fall-Ausschluss gilt auch für die Adresse |
| `urn` | string | SRF: URN des Beitrags. | GENERIERT Phase Q | — |
| `sprachmodus` | string | Rezeptionsmodus der Quelle, wörtlich wie im Datensatz. | GENERIERT Phase Q | `ERR_V42_ERSATZ` (siehe `ersatz_ref`) |
| `verortung` · `verortung.absaetze` · `verortung.von` · `verortung.bis` | object · string · string `mm:ss` × 2 | Welcher Ausschnitt gilt. Massgebend für den Fall-Ausschluss ist dieser Ausschnitt (E11). | GENERIERT Phase Q | `ERR_V42_BUDGET`: gedruckt (`absaetze` bzw. «von–bis») ≤ 40 |
| `dauer_sek` | number | Länge des Ausschnitts, gemessen. Audio und Video. | GENERIERT Phase Q | `ERR_V42_R2_LAENGE`: Quelle mit Raster ≤ 240, Vertiefung ≤ 360; muss eine Zahl sein |
| `woerter` | number | Wörter des Ausschnitts, gezählt. Text und Grafik. | GENERIERT Phase Q | `ERR_V42_R2_LAENGE`: Artikel ≤ 450, Grafik und Datensatz ≤ 250 (Quelle mit Raster); muss eine Zahl sein |
| `kurzbeschrieb` | string | Was die Quelle zeigt, in eigenen Worten. | GENERIERT Phase Q | `ERR_V42_BUDGET` ≤ 180 · `ERR_V42_KARTE_PFLICHTFELD` |
| `sachlage_geprueft` | string `JJJJ-MM-TT` | Tag, an dem Abruf, Titel, Datum und Sachlage geprüft wurden. | GENERIERT Phase Q | `ERR_V42_KARTE_PFLICHTFELD` |
| `archiv_ref` | string `<id>/gewaehlt` | Ordner im privaten Archiv. Nie ein Volltext. | ABGELEITET ← `references/ableitungsregeln.md` | — |
| `ersatz_ref` | string oder `null` | ID der Ersatzquelle. Nur gültig mit gleichem Auftrag und gleichem Raster; die Ersatzkarte erbt Rolle und Längengrenzen. `null`, wenn es keine gibt. | ABGELEITET | `ERR_V42_ERSATZ`: Karte vorhanden, kein Kreis, gleicher `typ` oder gleicher `sprachmodus` |
| `lizenz_hinweis` | string | Was aus der Quelle im Repo steht (nur der Link) und was sonst zu Rechten oder Prüfung gilt. | GENERIERT Phase Q | — |
| `konstruiert` | boolean | Fallmaterial wäre `true`; in der Kartei immer `false`. | KONSTANT `false` | `ERR_V42_KARTE_PFLICHTFELD` |

Für jedes String-Feld der Karte gilt: höchstens 400 Zeichen
(`ERR_V42_R10_VOLLTEXT`), kein «ß», kein Begriff des KN-Falls.

## 9. Vom Leitfaden abweichend (E16–E19)

`docs/upgrade-v4.2/01_Leitfaden_v4.2.md` gilt für die Didaktik. An diesen
Stellen ist er überholt:

| Leitfaden | Gilt stattdessen | Entscheid |
|---|---|---|
| §3: QR und Kurzeintrag der Quelle auf Seite 1 und auf Seite 3 | QR nur auf Seite 3 in der Quellenkarte; Seite 1 nennt die Quelle in einer Zeile. Das Budget für den Kurzeintrag (≤ 100) prüft das Skript weiter. | E16 |
| durchgehend «Pflichtquelle» | In jedem sichtbaren Text «Quelle», daneben «Ersatzquelle» und «Vertiefung (freiwillig)». Intern bleiben `rolle: "pflicht"` und die IDs `…-pflicht`. | E16 |
| §3.1: `feld_hoehe_mm` als feste Höhe | Mindesthöhe; der freie Platz der Seiten 2–4 geht an die Schreibflächen. Die Werte bleiben und werden exakt geprüft. | E16 |
| §4.3, §5: Vertiefung = Karte mit einer Leitfrage | Dazu Hinweis, was zu lesen, hören oder sehen ist, Kurzbeschrieb und ein Schreibfeld; für die Lehrperson `erwartung`. | E16, E19 |
| §3, §8: «Ihre Woche», Lektionen und Minuten im Heft | «Übersicht» in drei Teilen; `wochen_plan[].label` = «Teil 1–3»; im Heft keine Woche, keine Lektion, keine Minute. Der Zeitplan steht nur als Vorschlag im Begleiter und in `set.wochenplan`. | E17 |
| §6.3: «Mitnahme in den gemeinsamen Auftrag» | Seite 8 heisst «Das nehme ich mit»; das Heft verweist nicht auf den Auftrag. Dafür nennt der Auftragsbogen in `gemeinsamer_auftrag.heft_bezug`, was er aus den Heften braucht. | E17 |
| — (neu) | `handlungsprodukt.beispielbild` (im Heft, Seite 6) und `handlungsprodukt.loesungsbild` (nur LP). | E17 |
| §6.2, §3.1: Mindmap mit 3 Punkten je Ast | Begriffsnetz: bis 5 Punkte je Ast, höchstens 10 im Heft; jeder Punkt ist ein Glossarbegriff des Hefts; zwei leere Knoten «aus meinem Raster». | E17 |
| §7.5, §11.2: Glossar der Einheit auf Seite A3 des Auftragsbogens | Kein Glossar auf dem Bogen. `set.glossar` trägt `heft` und neu `spur` und speist Seite 8 des Hefts. | E17 |
| §2: «Stufe» 1–4 | «Punkte» 0–3 in Heft, Auftragsbogen, KN und Begleiter. Das Feld heisst weiter `stufen`. | E17 |
| §7.5: Seite A4 «Rückmeldung», Spalten «Selbst» und «LP», «Bis zum KN verbessere ich …» | Seite A4 «Selbsteinschätzung», Spalten «Selbst» und «Fremd»; der Bogen schreibt der Lehrperson nichts vor und nennt weder KN noch Note. | E18 |
| §11.1: Lösung = `kern`, `zeilen`, `erwartungshorizont` | Dazu `raster_zeilen` und `befund` (LF3), `kasten_s4.loesung_zeilen`, `quellen[].erwartung`, `abschluss.loesung`. Ohne sie ist das Tor rot (`ERR_V42_LOESUNG`). | E19 |
| §9.1 mit `check-einheiten`: Schritt 05 als Kontrollschritt | Schritt 05 darf ein Produktschritt sein; die Kontrolle leisten die Feedback-Kriterien. | E12 |
| §4.4: Wort «Spur» | Gehört der Lehrperson. In keinem Text für Lernende. | E15 |

## 10. Was die Skripte über alle Strings prüfen

Diese Prüfungen hängen an keinem einzelnen Feld. Sie gelten für jeden String —
auch für Lösungen, Bilder und Hinweise, die nur die Lehrperson sieht.

**Eszett.** Kein «ß»: `ERR_V42_R10_ESZETT` (fünf Einheitsdateien,
Quellenkarten, eingebundene Methodenkarten), `ERR_ESZETT` (jede `.json` im
Ordner und jeder Absatz von `begleiter.md`), `ERR_ESZETT_FOUND` (Lösungen).

**Platzhalter.** `ERR_V42_PLATZHALTER` meldet in den fünf Dateien und den
Quellenkarten jede dieser Zeichenfolgen: `[QUELLE SUCHEN`, `[URL`, `[JJJJ`,
`[HERAUSGEBER`, `verifizieren]`, `[Beispiel aus`, `[nach `, `[abhängig`,
`[Datum`, `[Vier `. `ERR_PLATZHALTER` meldet in jeder `.json` des Ordners und
in `begleiter.md` dazu die Wörter TODO und TBD, jedes Paar doppelter
geschweifter Klammern und jedes Wort aus vier oder mehr Grossbuchstaben,
Ziffern, Punkten oder Unterstrichen in einfachen geschweiften Klammern. Folge:
Ein stehengebliebener Platzhalter eines Skeletts macht das Tor rot — das ist
gewollt. Und: Eine eckige Klammer, auf die «nach », «abhängig», «Datum» oder
«Vier » folgt, ist auch in echtem Text ein Befund.

**Fall-Ausschluss** (`ERR_V42_R9_FALL`). Kein Begriff des KN-Falls als Teilwort,
ohne Rücksicht auf Gross- und Kleinschreibung, in: beiden Heften ganz,
`set.gemeinsamer_auftrag`, `set.glossar`, jeder Quellenkarte der Einheit
(Ersatzkarten eingeschlossen, alle Felder, auch `url`). Die Begriffe sind die
Liste `prinzip.hybrid_situation_spec.fall_ausschluss_hefte_und_auftrag` —
nur sie; fest im Skript eingebaute Wörter gibt es seit E30 nicht mehr.
Ausgenommen sind genau drei Feldarten:
`feedback_kriterien[].stufen[]` (KN-Wortlaut, E8), `kontext_ausschluss` und
`prinzip_handoff.kn_aktivierung`. Nicht geprüft werden `kn.json`,
`prinzip.json`, `begleiter.md` und die übrigen Felder von `set.json`.

**Gegenstände von A und B im Auftrag** (`ERR_V42_R9`). Jeder Begriff aus
`gemeinsamer_auftrag.kontext_ausschluss` — durch Komma getrennt, die Klammer am
Schluss abgeschnitten, ab vier Zeichen — ist als Teilwort verboten in Titel,
Situation, Zahlentabelle, Leitfrage, Mehrdeutigkeit, Auftrag, Schritten und
Abgaben des Auftrags. Ob die Lebensbereiche von A, B, Auftrag und KN wirklich
verschieden sind, prüft kein Skript; das bleibt ein Urteil.

**Leck-Prüfung** (`check-all.mjs`). Jeder String über 80 Zeichen in den
`.json` des Ordners und jeder Absatz von `begleiter.md` wird in Fenstern von
8 Wörtern mit `material/_lehrmittel*/` und den Archivordnern `q-…` verglichen.
Ab **25** Wörtern am Stück: `ERR_LEHRMITTEL_WOERTLICH` (Tor rot). Ab **14**
Wörtern: `WARN_LEHRMITTEL_NAH` (Warnung; umformulieren). Fehlt das Lehrmittel,
läuft die Prüfung nicht — lokal ein Hinweis, mit `--cloud` ein Fehler. Die
Quellenkarten liegen nicht im Ordner der Einheit; dort greift
`ERR_V42_R10_VOLLTEXT` (kein String über 400 Zeichen).

**Voraussetzungsfreier Start** (`check-einheiten.mjs`, je Heft und Spur, über
alle Strings). `ERR_VORAUSSETZUNG_VOR_START` bei: «vor der ersten Lektion»,
«bringen Sie … mit» (bis 40 Zeichen dazwischen, ohne Punkt), «erfragen Sie
vorab», «… vorher», «… im Voraus», «im Voraus», «schon vorher», «schon
vorab». `ERR_QUERVERWEIS_ALS_BEDINGUNG` (in tragenden Feldern) bzw.
`WARN_QUERVERWEIS` bei «aus», «in» oder «wie in» vor «Herausforderung A», «B»
oder «C» und bei «aus A und B»; «Heft A» trifft das Muster nicht.

**Warnungen sind Fehler.** `check-einheiten.mjs` endet mit Exit 1, sobald eine
neue Einheit mit `status: "entwurf"` irgendeinen Befund hat — auch jeden
`WARN_*`. `check-lf-loesung.mjs` zählt seine `WARN_*` ebenfalls als Befund.
Einzig die Warnungen, die `check-all.mjs` selbst ausgibt (`WARN_LEHRMITTEL_NAH`),
lassen das Tor grün. `--baseline` ist verboten.

**Lösung für jede Leitfrage.** Sobald eine der vier Leitfragen eines Hefts in
einer Spur `loesung` trägt, verlangt `check-lf-loesung.mjs` sie für alle vier.
Eine LF4 ganz ohne `loesung` lässt das Skript abstürzen. Jede Leitfrage
bekommt darum ihre Lösung, in derselben Phase wie die Frage.

**Lehrplantexte.** `sync-einheiten-nrlp.mjs --check` meldet jede Abweichung von
`nrlp.kompetenz_text` und `nrlp.lebensbezug_text` gegenüber dem Datensatz des
Lehrgangs.

**Struktur** (`check-all.mjs`). Die sechs Dateien vorhanden (`ERR_DATEI_FEHLT`,
auch `begleiter.md`), jede `.json` gültig (`ERR_JSON_INVALID`), `id` der Hefte
beginnt mit dem Ordnernamen (`ERR_ID`).

## 11. Felder, die NICHT auf die Platte gehören

### 11.1 Entsteht erst beim Laden

`loadEinheit` setzt diese Felder ein. Wer sie in eine Datei schreibt, verdoppelt
Daten, die danach auseinanderlaufen.

| Feld | Entsteht aus |
|---|---|
| `spur`, `spuren_verfuegbar` im Heft | `resolveSpur`: gewählte Spur und Liste der vorhandenen Spuren |
| `leitfragen` mit vier Einträgen | Kern (LF1, LF2) + `spuren.<spur>.leitfragen` (LF3, LF4) |
| `quellen` und `kasten_s4` auf der obersten Ebene des Hefts | `spuren.<spur>.quellen` bzw. `.kasten_s4` |
| die Felder der Quellenkarte in `quellen[]` (`titel`, `url`, `kurzbeschrieb` …) und `quellen[].ersatz` | `withQuellen`: Karte aus `src/data/quellen/` + Einsatz im Heft |
| die Felder der Methodenkarte in `methoden[]` (`name`, `quelle`, `kap`, `seiten`, `lesen`, `schritte`, `ankommt`, `beispiel`, `fehler`, `merk`) | `withMethoden`: Karte aus `src/data/methoden/` |
| der Eintrag an der Stelle von `__spur__` | `spuren.<spur>.methoden_ref_rezeption` |
| `glossar` im Heft | Einträge von `set.glossar` mit passendem `heft`, ohne `spur` oder mit der wirksamen Spur |
| `nrlp.kompetenzen` | `enrichKompetenzen()` aus `nrlp.nr_primary` und dem Datensatz des Lehrgangs |
| `spur_varianten` der Einheit | `loadEinheit` |
| `src/data/einheiten.index.json` (auch `hat_spuren`, `hat_medien`) | `npm run build:einheiten-index` — nie von Hand |

### 11.2 Altfelder des 3er-Formats — gibt es in v4.2 nicht

| Feld | Ersetzt durch |
|---|---|
| `herausforderung_C.json`, `prinzip.herausforderungen.C`, `sk_pro_situation.C` | zwei Hefte A und B |
| `reflexion_fragen` | `abschluss` |
| `set.austausch_phase`, `set.dekontextualisierungs_aufgabe` (mit `gewicht_prozent`) | `set.gemeinsamer_auftrag` |
| `handlungsprodukt.scaffolding`, `handlungsprodukt.schreib_label`, `handlungsprodukt.schreib_note` | Scaffolding je Leitfrage; Methodenseite |
| `handlungsprodukt.musterloesung` | `handlungsprodukt.loesungsbild` |
| `lernfortschritt.kriterien` (mit `gewicht_prozent`) | `feedback_kriterien` |
| `bewertungsraster[].abgabe`, `.gewicht`, `.kriterium` | nur `produkt` und `vollstaendig_wenn` |
| `emotion_tag` im Heft | entfällt (im KN bleibt `hybrid_situation.emotion_tag` als leerer String) |
| `wissensknoten`, `zirkularitaet_anker`, `bereitet_vor`, `quellen_anker[].nugget_ref` | entfällt |
| `legacy`, `source_refs`, `registry_tags` im Heft | entfällt (nur in `kn.json`) |
| `prinzip.persona_pool_units`, `prinzip.persona_pool_kn_neu` | neutrale Persona, wörtlich aus dem Skelett |
| `set.erstellt_am`, `set.sprachfoerderung` | entfällt |

### 11.3 In `types.ts` erlaubt, in der Gold-Form nicht verwendet

Diese Stellen lässt der Typ zu, die Gold-Einheit nutzt sie nicht. Die Skill
schreibt sie nicht.

| Feld | Stattdessen |
|---|---|
| `handlungsprodukt.beispielbild.hinweis` | `hinweis` nur im Lösungsbild |
| `erwartungshorizont.tragfaehig` bei LF4 | bei LF4 `beispiel_pol_1` und `beispiel_pol_2`; `tragfaehig` nur im gemeinsamen Auftrag |
| `erwartungshorizont.beispiel_pol_1` / `_2` im gemeinsamen Auftrag | dort `tragfaehig` |
| `raster`, `pol_typ`, `loesung.raster_zeilen`, `loesung.befund`, `loesung.erwartungshorizont`, `loesung.quelle_ref`, `loesung.quelle_stand` bei LF1 und LF2 | nur bei LF3 bzw. LF4 in den Spuren |
| `raster.quelle_ref` in `ohne_medien`; `raster.knoten_ref`, `raster.auftrag`, `raster.beispielzeile` in `mit_medien` | je nur in der anderen Spur |
| `quellen` in `ohne_medien` | verboten (`ERR_V42_R3`) |
| `kasten_s4.spalten`, `.hinweis`, `.loesung_zeilen` in `mit_medien` | nur bei `typ: "denkhilfe"` |
| `methoden[].beispiel` im Kern; `methoden_ref_rezeption.tun` | `beispiel` nur in `methoden_ref_rezeption` — Ausnahme (ENTSCHEIDE E31 Nr. 2): Die Übertragung einer `hko-`Karte, deren `tun` nicht gedruckt wird, darf ausnahmsweise über ein überschriebenes `beispiel` in der Methoden-Referenz des Kerns laufen (`docs/methodenkartei.md`); der Bericht nennt es |
| `set.entwurf_komponenten` | entfällt; die ganze Einheit trägt `status: "entwurf"` |

### 11.4 Das eine Feld ausserhalb der Gold-Form: `set.lehrgaenge`

Die Gold-Einheit gilt für einen Lehrgang und führt das Feld nicht; `types.ts`
kennt es (`SetJson.lehrgaenge`). Es ist das einzige Feld ausserhalb der
Gold-Form, das die Skill setzen darf — und nur unter diesen Bedingungen:

- Der Bauplan nennt einen zweiten EFZ-Lehrgang.
- Jede Kompetenz aus `nrlp.nr_primary` beider Hefte steht im Datensatz des
  zweiten Lehrgangs unter derselben Nummer, und der Satz der Hauptkompetenz
  und der Satz des Lebensbezugs sind dort zeichengleich
  (`references/phase-0-verortung.md`).
- Form: `"lehrgaenge": ["EFZ_3J", "EFZ_4J"]`, direkt nach `lehrgang`; der
  kanonische Lehrgang steht in der Liste. `lehrgang` selbst bleibt einwertig.

`scripts/sync-einheiten-nrlp.mjs --check` meldet einen unzulässigen Eintrag
(«LEHRGANG … ist unzulaessig»), das Tor ist dann rot. Im Zweifel fehlt das
Feld. Das Skelett `assets/set-template.json` führt es nicht.

## 12. Nach der Gold-Einheit dazugekommen (E25, E26)

Zwei Entscheide haben nach der Gold-Einheit Felder hinzugefügt. Sie stehen in
`ENTSCHEIDE.md`, in `types.ts` und in `check-v42.mjs`, aber nicht in den
Gold-Dateien. Ohne sie zeichnet der Renderer die Gold-Form — für jede andere
Einheit falsch.

### 12.1 `gemeinsamer_auftrag.produkte` (E25) — die Skill setzt es immer

Die zwei Produkte des Auftrags und die Seite des Auftragsbogens, die jedes
trägt: der erste Eintrag belegt Seite A2, der zweite Seite A3. Fehlt das Feld,
druckt der Bogen den Sonderfall der Gold-Einheit (Schritt 04 als freie Fläche,
Schritt 05 als Sprachnachricht mit drei festen Stationen). Platz in der Datei:
in `gemeinsamer_auftrag`, nach `abgaben` — wie im Skelett
`assets/set-template.json`.

| Feldpfad (unter `gemeinsamer_auftrag`) | Typ / Wertform | Bedeutung | Herkunft | Budget / Regel (`ERR_V42_AUFTRAG_PRODUKTE`) |
|---|---|---|---|---|
| `produkte` | object[2] | Die zwei Produkte. | GENERIERT Phase 7 (Produkte: BAUPLAN) | genau 2 Einträge |
| `produkte[].schritt` | number 1–5 | Der Schritt aus `schritte`, dessen Produkt die Seite trägt; Titel und Hinweis der Seite kommen von dort. Frei wählbar, nicht immer 4 und 5. | GENERIERT Phase 7 | ganze Zahl 1–5; die zwei Werte verschieden |
| `produkte[].form` | string `flaeche` oder `spur` | `flaeche`: freie Arbeitsfläche für alles Schriftliche und Bildliche. `spur`: Stationen mit Schreibzeilen, um einen mündlichen Beitrag, ein Gespräch oder eine Diskussion zu planen. (Dieses `spur` hat nichts mit den Spuren eines Hefts zu tun.) | ABGELEITET ← Modus des Produkts (`references/phase-7-set.md`) | einer der zwei Werte |
| `produkte[].modus` | string | Sprachmodus dieses Produkts, wörtlich einer aus `gemeinsamer_auftrag.sprachmodi`. Trägt der Auftrag nur einen Modus, haben beide Einträge denselben. | ABGELEITET ← `sprachmodi` | steht in `sprachmodi`; jeder Modus aus `sprachmodi` ist `modus` mindestens eines Eintrags |
| `produkte[].stationen` | string[2–4] | Nur bei `spur`: die Stationen, Ich-Form. | GENERIERT Phase 7 | Pflicht bei `spur`: 2–4, keine leer, je ≤ 60 |
| `produkte[].hinweis` | string | Nur bei `spur`: der Satz über den Stationen — wie vorgehen, wie abgeben. Sie-Form. | GENERIERT Phase 7 | Pflicht bei `spur`: ≤ 260 |
| `produkte[].dauer` | string | Nur bei `spur`, freiwillig: Zieldauer des Beitrags. Ohne Angabe entfällt die Zeile «Ziel … · Probelauf». | GENERIERT Phase 7 | wenn gesetzt: ≤ 30 |

Der Fall-Ausschluss (`ERR_V42_R9_FALL`) gilt auch für `stationen` und
`hinweis`. Die Dauer eines Produkts ist keine Zeitangabe zum Unterricht und
darum erlaubt (`references/sprache.md` §2).

### 12.2 Produktbild: Fliesstext und Wechselrede (E26)

Zwei weitere Blockarten für `handlungsprodukt.beispielbild.bloecke[]` und
`handlungsprodukt.loesungsbild.bloecke[]`. Ein Block trägt genau eine der vier
Arten; `titel`, Legende und die Zahl der Blöcke (2–3) bleiben wie in 2.5.

| Feldpfad (unter `bloecke[]`) | Typ / Wertform | Bedeutung | Budget / Regel |
|---|---|---|---|
| `text` | string[] | Fliesstext: Absätze, in Schreibschrift gezeichnet. Für Brief, Statement, Kommentar, Leserbrief. | `ERR_V42_PRODUKTBILD`: Liste nicht-leerer Absätze · `ERR_V42_BUDGET`: Zahl der Absätze und Zeichen über alle Absätze des Blocks (`absaetze`, `textZeichen`) |
| `wechsel` · `wechsel[].wer` · `wechsel[].text` · `wechsel[].marke` | object[] · string × 3 | Wechselrede: Sprecherin oder Sprecher links, Beitrag rechts. Für Gespräch, Diskussion, Interview. `marke` wie bei Listen: ein `key` der Legende. | `ERR_V42_PRODUKTBILD`: jeder Beitrag hat `wer` und `text` · `ERR_V42_BUDGET`: mindestens 2 Beiträge, Höchstzahl und Zeichen über alle Beiträge (`beitraege`, `wechselZeichen`) · `wer` ≤ 12 |

```json
{ "titel": "…", "text": [ "Absatz 1 …", "Absatz 2 …" ] }
{ "titel": "…", "wechsel": [ { "wer": "…", "text": "…" }, { "wer": "…", "text": "…", "marke": "<key>" } ] }
```

**Beide Blockarten sind verwendbar.** Die Grenzen sind am gerenderten Blatt
gemessen und stehen im Skript, nicht hier: `check-v42.mjs` führt sie in der
Konstante `PB_E26` — `klein` für das Beispielbild (Heft, Seite 6), `gross` für
das Lösungsbild, je für zwei und für drei Blöcke; die Tabelle dazu steht in
ENTSCHEIDE E26. Vor dem Schreiben eines solchen Blocks die Konstante lesen,
keine Zahl aus dem Gedächtnis. Gemischte Blätter (Fliesstext oder Wechselrede
neben Tabelle oder Liste) sind nicht abgetastet — dort entscheidet
`messen-v42.mjs` (`references/phase-9-tor.md`).

