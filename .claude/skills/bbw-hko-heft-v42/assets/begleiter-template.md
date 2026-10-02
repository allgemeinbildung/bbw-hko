---
titel: "Begleit-Dokument — {{= set.einheit_titel}} ({{X.Y — Lebensbezug}})"
untertitel: "{{EINE ZEILE: was die Einheit umfasst — Hefte, Spuren, Auftrag, KN}}"
kompetenz: "{{X.Y}} — {{= kn.kern_kompetenzversprechen, zeichengenau}}"
autor: "Kernteam 1 — BBW Winterthur"
stand: "{{JJJJ-MM-TT — Tag, an dem die Datei geschrieben wird}}"
version: "{{= set.version}}"
lehrgang: "{{EFZ 3J|EFZ 4J}}"
thema: "T{{N}} — {{THEMA-TITEL aus dem nRLP-Datensatz des Lehrgangs}}"
lebensbezug: "{{X.Y}}"
quellen_json:
  - "set.json"
  - "prinzip.json"
  - "herausforderung_A.json"
  - "herausforderung_B.json"
  - "kn.json"
  - "{{NUR MIT MEDIEN-SPUR: ../../quellen/<Muster der Karten-IDs> (Anzahl Quellenkarten) — sonst diese Zeile löschen}}"
---

> {{PRÄAMBEL, 4–7 Zeilen, Du-Form: an wen sich das Dokument richtet; was die Lernenden erhalten (Hefte, Spuren dieser Einheit, Auftragsbogen, KN-Blatt); dass es je Heft und vorhandener Spur ein Dokument «Lösungen» nur für die Lehrperson gibt; was dieses Dokument leistet}}

## 0. Die Einheit in einem Blick

**Das Kompetenzversprechen**

> «<!--hko:kn.kern_kompetenzversprechen-->{{= kn.kern_kompetenzversprechen}}<!--/hko-->»

**Das Prinzip, das durch alles trägt**

> «<!--hko:prinzip.dekontextualisierungs_anker.anker_statement-->{{= prinzip.dekontextualisierungs_anker.anker_statement}}<!--/hko-->»

{{ABSATZ, 2–3 Sätze: Beide Hefte enden mit einem Begriffsnetz um dasselbe Zentrum — hier den Marker setzen:}} «<!--hko:prinzip.mindmap_zentrum_kurz-->{{= prinzip.mindmap_zentrum_kurz}}<!--/hko-->» {{… und wohin der Weg von dort führt: Lebensbereich des Auftrags, dann KN}}

**Die Bausteine**

| Baustein | Woche | Lektionen | Umfang | Was die Lernenden tun |
|---|---|---|---|---|
| Heft A «<!--hko:hf_A.titel-->{{= hf_A.titel}}<!--/hko-->» | 1 | 3 | 8 Seiten | {{TÄTIGKEIT in Verben, aus den Schritten von Heft A}} |
| Heft B «<!--hko:hf_B.titel-->{{= hf_B.titel}}<!--/hko-->» | 2 | 3 | 8 Seiten | {{TÄTIGKEIT in Verben, aus den Schritten von Heft B}} |
| Gemeinsamer Auftrag «<!--hko:set.gemeinsamer_auftrag.titel-->{{= set.gemeinsamer_auftrag.titel}}<!--/hko-->» | 3 | 3 | 4 Seiten | {{NEUER FALL, die zwei Produkte des Auftrags, Rückmeldung}} |
| Kompetenznachweis (KN) | 4 | 2 + 1 Puffer | KN-Blatt | {{NACHWEIS in einer von drei Formen (Kap. 7)}} |

{{ABSATZ, 1–2 Sätze: Alle Lernenden bearbeiten beide Hefte nacheinander; der Auftrag führt sie vor dem KN zusammen}}

**Die Kompetenzen (nRLP {{LEHRGANG}}, Lebensbezug {{X.Y}})**

| Heft | Nr. | Kompetenz |
|---|---|---|
| A | {{X.Y.Z}} | <!--hko:hf_A.nrlp.kompetenz_text-->{{= hf_A.nrlp.kompetenz_text}}<!--/hko--> |
| B | {{X.Y.Z}} | <!--hko:hf_B.nrlp.kompetenz_text-->{{= hf_B.nrlp.kompetenz_text}}<!--/hko--> |
| {{A oder B}} | {{X.Y.Z}} | {{NUR WENN ein Heft zwei Kompetenzen trägt: der Satz der zweiten Kompetenz, zeichengenau aus dem nRLP-Datensatz des Lehrgangs, OHNE Marker (nrlp.kompetenzen wird nicht geschrieben) — sonst diese Zeile löschen (Regel in phase-8-begleiter.md §3.2)}} |

Lebensbezug: «<!--hko:hf_A.nrlp.lebensbezug_text-->{{= hf_A.nrlp.lebensbezug_text}}<!--/hko-->» {{EIN SATZ zum Lektionenrahmen, nur wenn im nRLP-Datensatz belegt — sonst weglassen}}

**Sprachmodi, Schlüsselkompetenzen und Produkte — was wo geübt wird**

| Baustein | Sprachmodi | Schlüsselkompetenzen | Produkt |
|---|---|---|---|
| Heft A | <!--hko:prinzip.modi_pro_heft.A[0]-->{{= prinzip.modi_pro_heft.A[0]}}<!--/hko--> | SK<!--hko:prinzip.sk_pro_situation.A[0]-->{{= prinzip.sk_pro_situation.A[0]}}<!--/hko--> | <!--hko:hf_A.handlungsprodukt.titel-->{{= hf_A.handlungsprodukt.titel}}<!--/hko--> |
| Heft B | <!--hko:prinzip.modi_pro_heft.B[0]-->{{= prinzip.modi_pro_heft.B[0]}}<!--/hko--> | SK<!--hko:prinzip.sk_pro_situation.B[0]-->{{= prinzip.sk_pro_situation.B[0]}}<!--/hko--> | <!--hko:hf_B.handlungsprodukt.titel-->{{= hf_B.handlungsprodukt.titel}}<!--/hko--> |
| Gemeinsamer Auftrag | <!--hko:prinzip.modi_auftrag[0]-->{{= prinzip.modi_auftrag[0]}}<!--/hko--> | {{SK, die der Auftrag aus A und B wieder aufnimmt — als Nummern, ohne Marker}} | {{DIE ZWEI PRODUKTE des Auftrags, je mit ihrem Modus}} |
| KN | <!--hko:prinzip.modi_kn[0]-->{{= prinzip.modi_kn[0]}}<!--/hko--> | SK<!--hko:prinzip.sk_schnittmenge_kn.primary[0]-->{{= prinzip.sk_schnittmenge_kn.primary[0]}}<!--/hko--> | {{DIE DREI KN-FORMEN, kurz}} |

{{WIEDERHOLEN in jeder Zelle: je Array-Eintrag ein Marker mit Index [0], [1], [2] …, getrennt durch « · » — so viele, wie das Array in der fertigen Datei hat}}

{{ABSATZ, 2–4 Sätze, hergeleitet: welcher Modus des KN in welchem Baustein vorbereitet wird; ob ein Modus des KN nirgends geübt wird (Lücke aus dem Prinzip-Dokument nennen); welche SK des Themas in der Einheit nicht vorkommen}}

### Bewertung: Note nur im KN

{{EIN SATZ: das KN-Raster als Ausgangspunkt — Hefte je zwei Kriterien, Auftrag alle vier, KN weist nach}}

| Baustein | Funktion | Kriterien | Note |
|---|---|---|---|
| Heft A | Übung | <!--hko:prinzip.kn_kriterien_verteilung.A[0]-->{{= prinzip.kn_kriterien_verteilung.A[0]}}<!--/hko--> · <!--hko:prinzip.kn_kriterien_verteilung.A[1]-->{{= prinzip.kn_kriterien_verteilung.A[1]}}<!--/hko--> | nein |
| Heft B | Übung | <!--hko:prinzip.kn_kriterien_verteilung.B[0]-->{{= prinzip.kn_kriterien_verteilung.B[0]}}<!--/hko--> · <!--hko:prinzip.kn_kriterien_verteilung.B[1]-->{{= prinzip.kn_kriterien_verteilung.B[1]}}<!--/hko--> | nein |
| Gemeinsamer Auftrag | Generalprobe mit Rückmeldung | alle vier KN-Kriterien | nein |
| KN | Nachweis | alle vier KN-Kriterien | ja |

{{EIN SATZ: wo die Indikatoren im Heft stehen (S. 5)}}

| Heft | KN-Kriterium | Dim. | Indikator am Produkt |
|---|---|---|---|
| A | <!--hko:hf_A.feedback_kriterien[0].kn_kriterium-->{{= hf_A.feedback_kriterien[0].kn_kriterium}}<!--/hko--> | <!--hko:hf_A.feedback_kriterien[0].dimension-->{{= …dimension}}<!--/hko--> | <!--hko:hf_A.feedback_kriterien[0].indikator_produkt-->{{= …indikator_produkt}}<!--/hko--> |
| A | <!--hko:hf_A.feedback_kriterien[1].kn_kriterium-->{{= hf_A.feedback_kriterien[1].kn_kriterium}}<!--/hko--> | <!--hko:hf_A.feedback_kriterien[1].dimension-->{{= …dimension}}<!--/hko--> | <!--hko:hf_A.feedback_kriterien[1].indikator_produkt-->{{= …indikator_produkt}}<!--/hko--> |
| B | <!--hko:hf_B.feedback_kriterien[0].kn_kriterium-->{{= hf_B.feedback_kriterien[0].kn_kriterium}}<!--/hko--> | <!--hko:hf_B.feedback_kriterien[0].dimension-->{{= …dimension}}<!--/hko--> | <!--hko:hf_B.feedback_kriterien[0].indikator_produkt-->{{= …indikator_produkt}}<!--/hko--> |
| B | <!--hko:hf_B.feedback_kriterien[1].kn_kriterium-->{{= hf_B.feedback_kriterien[1].kn_kriterium}}<!--/hko--> | <!--hko:hf_B.feedback_kriterien[1].dimension-->{{= …dimension}}<!--/hko--> | <!--hko:hf_B.feedback_kriterien[1].indikator_produkt-->{{= …indikator_produkt}}<!--/hko--> |

{{ABSATZ, 2–3 Sätze: warum diese Verteilung — je Heft am Produkt begründet}}

- {{PUNKT: Kriterien im Wortlaut des KN, vier Stufen, 0 bis 3 Punkte, in allen Spuren gleich}}
- {{PUNKT: Spalte «Selbst» vor der Abgabe; Rückmeldung auf derselben Skala}}
- {{PUNKT: im KN zwei getrennte Noten SuK und Ges (Kap. 7)}}

> [!coaching] {{TITEL: KN-Wortlaut im Heft lesen}}
> {{3–5 Sätze: Die Stufentexte sind die des KN und nennen darum Begriffe oder Leistungen, die im einzelnen Heft nicht vorkommen — an EINEM Stufentext dieser Einheit zeigen. Massgebend für die Rückmeldung zum Heft ist die Indikator-Zeile}}

> [!hinweis] {{TITEL: Hefte und Auftrag sind formativ}}
> {{2–3 Sätze: keine Note ausserhalb des KN; eine Gewichtung des Auftrags wäre ein eigener Entscheid}}

**Mehrdeutigkeit — ein Spannungsfeld je Baustein**

1. Heft A: <!--hko:hf_A.mehrdeutigkeit.trade_off-->{{= hf_A.mehrdeutigkeit.trade_off}}<!--/hko-->
2. Heft B: <!--hko:hf_B.mehrdeutigkeit.trade_off-->{{= hf_B.mehrdeutigkeit.trade_off}}<!--/hko-->
3. Gemeinsamer Auftrag: <!--hko:set.gemeinsamer_auftrag.mehrdeutigkeit.trade_off-->{{= set.gemeinsamer_auftrag.mehrdeutigkeit.trade_off}}<!--/hko--> {{HALBSATZ: welche Spannungsfelder er zugleich aktiviert}}
4. KN: {{WIE VIELE Spannungsfelder die Szene verbindet (Kap. 7)}}

> [!mehrdeutigkeit] {{TITEL: Der Grundsatz}}
> {{2–4 Sätze, auf das Prinzip DIESER Einheit bezogen: warum beide Seiten begründbar bleiben und woran du erkennst, dass ein Spannungsfeld aufgelöst statt gehalten wurde}}

## 1. Zeitplan: ein Vorschlag für zwölf Lektionen

{{ABSATZ, 2 Sätze: Hefte und Auftragsbogen nennen weder Woche noch Lektion; der Plan ist ein Vorschlag, die Lehrperson teilt selbst ein}}

| Woche | Lektionen | Inhalt |
|---|---|---|
| <!--hko:set.wochenplan[0].woche-->{{= set.wochenplan[0].woche}}<!--/hko--> | <!--hko:set.wochenplan[0].lektionen-->{{= set.wochenplan[0].lektionen}}<!--/hko--> | <!--hko:set.wochenplan[0].inhalt-->{{= set.wochenplan[0].inhalt}}<!--/hko--> |

{{WIEDERHOLEN: eine Zeile je Eintrag von set.wochenplan, Index [1], [2], [3]}}

### Lektion für Lektion (Vorschlag)

| Woche | Lektion | Was geschieht | Unterlagen |
|---|---|---|---|
| 1 | 1 | <!--hko:hf_A.wochen_plan[0].text-->{{= hf_A.wochen_plan[0].text}}<!--/hko--> | Heft A, S. {{SEITEN}} |
| 1 | 2 | <!--hko:hf_A.wochen_plan[1].text-->{{= hf_A.wochen_plan[1].text}}<!--/hko--> | Heft A, S. {{SEITEN}} |
| 1 | 3 | <!--hko:hf_A.wochen_plan[2].text-->{{= hf_A.wochen_plan[2].text}}<!--/hko--> | Heft A, S. {{SEITEN}} |
| 2 | 1 | <!--hko:hf_B.wochen_plan[0].text-->{{= hf_B.wochen_plan[0].text}}<!--/hko--> | Heft B, S. {{SEITEN}} |
| 2 | 2 | <!--hko:hf_B.wochen_plan[1].text-->{{= hf_B.wochen_plan[1].text}}<!--/hko--> | Heft B, S. {{SEITEN}} |
| 2 | 3 | <!--hko:hf_B.wochen_plan[2].text-->{{= hf_B.wochen_plan[2].text}}<!--/hko--> | Heft B, S. {{SEITEN}} |
| 3 | 1 | {{AUFTRAG, Lektion 1: Situation und erstes Produkt}} | Auftragsbogen {{SEITEN}}, Hefte A und B |
| 3 | 2 | {{AUFTRAG, Lektion 2: zweites Produkt, Selbsteinschätzung}} | Auftragsbogen {{SEITEN}} |
| 3 | 3 | {{RÜCKMELDUNG und Verbesserung}} | Auftragsbogen A4 |
| 4 | 1–2 | {{KN in der gewählten Form}} | KN-Blatt |
| 4 | 3 | Puffer | — |

> [!hinweis] {{TITEL: Wozu der Puffer da ist}}
> {{2–3 Sätze: was ohne Puffer als Erstes wegfällt und warum er nicht mit Stoff verplant wird}}

> [!warnung] {{TITEL: welche KN-Form oder welches Produkt mehr Zeit braucht}}
> {{3–4 Sätze, hergeleitet aus kn.kn_typen[].format und aus den Produkten: welche Form nicht in die zwei KN-Lektionen passt und wie sie gestaffelt wird. Bei einem mündlichen oder interaktiven Heftprodukt zusätzlich: Zeitbedarf je Paar oder Gruppe mal Anzahl — siehe phase-8-begleiter.md §7}}

### Seitenplan eines Hefts (135 Minuten, beide Spuren)

{{ABSATZ, 2 Sätze: zwei Bogen A3, acht Seiten A4, Doppelseite 6–7; Seitenfolge in beiden Heften und in allen Spuren gleich. Hat ein Heft nur eine Spur, hier sagen}}

| S. | Titel | Lernende tun | Spur-abhängig | Min. |
|---|---|---|---|---|
| 1 | Herausforderung | {{TÄTIGKEIT}} | {{WAS in der Medien-Spur dazukommt — oder «—»}} | 8 |
| 2 | Wissensecke I | {{TÄTIGKEIT: LF1 und LF2}} | — | 27 |
| 3 | Quelle | {{TÄTIGKEIT je nach Typ der Quelle: lesen, hören, sehen; Raster; Befund}} | {{LF3: Quelle bzw. Lehrmittel-Abschnitt mit Beispielzeile}} | 25 |
| 4 | Wissensecke II | {{TÄTIGKEIT: LF4}} | {{KASTEN: Vertiefung bzw. Denkhilfe}} | 15 |
| 5 | Auftrag | {{TÄTIGKEIT}} | — | 5 |
| 6 | Methoden und Beispiel | {{TÄTIGKEIT}} | {{KARTE 2: Rezeptionswerkzeug der Spur}} | — |
| 7 | Arbeitsfläche | {{TÄTIGKEIT: was hier entsteht — bei mündlichem oder interaktivem Produkt Planung und Notiz}} | — | 40 |
| 8 | Abschluss | {{TÄTIGKEIT}} | {{GLOSSAR: Begriffe der Quelle}} | 15 |

{{ABSATZ, 2–3 Sätze: wie knapp S. 3 gerechnet ist; Minuten gelten pro Seite, nicht pro Lektion; im Heft steht auf S. 1 nur die Übersicht in drei Teilen}}

> [!hinweis] {{TITEL: welche Lektion überläuft}}
> {{2–3 Sätze, an den Seitenminuten DIESER Einheit nachgerechnet: welche Lektion mehr als 45 Minuten trägt und wie der Vorschlag das auffängt}}

## 2. Zwei Spuren: ohne Medien und mit Medien

{{ABSATZ, 2 Sätze: was die Spuren teilen und worin sie sich unterscheiden. Hat ein Heft oder die Einheit nur eine Spur: das hier im ersten Satz sagen, mit dem Grund aus dem Lehrplan (phase-8-begleiter.md §7)}}

### Was gleich ist, was abweicht

| Gleich in beiden Spuren (Kern) | Spur-abhängig |
|---|---|
| {{KERN-ELEMENT}} | {{SPUR-ELEMENT}} |

{{WIEDERHOLEN: sechs Zeilen nach Leitfaden §4.1, ergänzt um Glossar und Stütze (E17) — in eigenen Worten}}

### Die Spuren in dieser Einheit

| Was | Heft A | Heft B |
|---|---|---|
| LF3, Spur ohne Medien | {{KAPITEL und SEITEN; Raster mit Beispielzeile — oder «entfällt», mit Grund}} | {{…}} |
| LF3, Spur mit Medien | {{TYP und HERAUSGEBER der Quelle, Ausschnitt; Raster ohne Beispielzeile — oder «entfällt»}} | {{…}} |
| LF4, Pol-Typ ohne Medien | {{= prinzip.pol_typ_verteilung.A.ohne_medien, in Worten}} | {{…}} |
| LF4, Pol-Typ mit Medien | {{= prinzip.pol_typ_verteilung.A.mit_medien, in Worten}} | {{…}} |
| Kasten S. 4 | {{ohne: Denkhilfe · mit: Vertiefung (Anzahl Karten)}} | {{…}} |
| Methodenkarte 2 | {{TITEL der Rezeptionskarte je Spur}} | {{…}} |

{{ABSATZ, falls nötig: Besonderheit eines Hefts — etwa LF4 in beiden Spuren wortgleich}}

### Spur ohne Medien

- {{LF3: Lehrmittel-Abschnitt, Raster mit vorausgefüllter erster Zeile, gesucht sind weitere Aussagen}}
- {{LF4: zwei Pole ohne Medium; Denkhilfe auf S. 4}}
- {{WARUM: Differenzierung, nicht Notbehelf}}

{{HAT KEIN HEFT DIESE SPUR: statt der Liste ein Absatz, warum sie fehlt (Prüfregel, Kompetenz verlangt Rezeption mündlich oder audiovisuell)}}

### Spur mit Medien

- {{LF3: Quelle — Kurzeintrag S. 1, Karte mit QR-Code, Auftrag und Raster S. 3, ohne Beispielzeile}}
- {{LF4: ob und wie die Quelle einbezogen wird}}
- {{S. 4: Kasten «Vertiefung» — was jede Karte enthält; freiwillig}}

{{HAT KEIN HEFT DIESE SPUR: statt der Liste ein Absatz, warum sie fehlt (keine Quellenkarte oder kein Archivtext)}}

### Welche Spur wann

- {{WAHL pro Klasse oder pro Lernende/n; warum beide Spuren im selben Raum laufen können}}
- {{PRÜFREGEL und ihr Ergebnis für jedes Heft dieser Einheit, mit den Modi aus dem Lehrplan}}
- {{WELCHE Spur die Plattform zuerst zeigt; was der Export enthält}}

> [!coaching] {{TITEL: Zwei Spuren in einem Zimmer}}
> {{3–4 Sätze: was im Plenum besprochen wird, was nach Spur getrennt; warum die Rückmeldung vergleichbar bleibt. Bei nur einer Spur: Callout weglassen}}

### Vorbereitung der Spur mit Medien

- **QR-Seite:** {{KURZLINK https://bbw-hko.ch/m/<ordner>, Anker #a und #b; vor der Lektion einmal öffnen}}
- **Geräte:** {{WAS die Lernenden brauchen, je Quelle: Typ, Ton ja/nein, Seite oder Zeitmarke}}
- **Kopfhörer:** {{FÜR welche Quellen und Vertiefungen; Sprache, Untertitel}}
- **Links:** {{VOR dem Einsatz die Links in Kap. 5 prüfen (Spalte «Geprüft am»)}}

> [!warnung] {{TITEL: Wenn ein Link nicht geht}}
> {{4–6 Sätze: Quelle fällt aus → Ersatzquelle, gleicher Auftrag, gleiches Raster; was die Ersatzquelle NICHT zeigt (Zugeständnis aus der Karte); Vertiefung fällt aus → entfällt; geht gar nichts → Spur ohne Medien, sofern das Heft sie hat}}

{{HAT DIE EINHEIT KEINE MEDIEN-SPUR: unter dieser Überschrift ein einziger Satz, dass keine Vorbereitung nötig ist; Liste und Callout entfallen}}

## 3. Herausforderung A — {{= hf_A.herausforderung.label, als Text ohne Marker}}

| Feld | Inhalt |
|---|---|
| Titel | <!--hko:hf_A.titel-->{{= hf_A.titel}}<!--/hko--> |
| Herausforderung | <!--hko:hf_A.herausforderung.label-->{{= hf_A.herausforderung.label}}<!--/hko--> ({{X.Y.Z}}) |
| Persona | <!--hko:hf_A.persona.beruf-->{{= hf_A.persona.beruf}}<!--/hko--> — <!--hko:hf_A.persona.betrieb-->{{= hf_A.persona.betrieb}}<!--/hko-->, <!--hko:hf_A.persona.ort-->{{= hf_A.persona.ort}}<!--/hko--> |
| Aspekte (Ges) | <!--hko:hf_A.nrlp.gesellschaft[0].aspekt-->{{= …aspekt}}<!--/hko--> (<!--hko:hf_A.nrlp.gesellschaft[0].iteration-->{{= …iteration}}<!--/hko-->) |
| Sprachmodi | <!--hko:hf_A.nrlp.sprachmodi[0]-->{{= hf_A.nrlp.sprachmodi[0]}}<!--/hko--> |
| Schlüsselkompetenzen | SK<!--hko:hf_A.nrlp.sk[0]-->{{= hf_A.nrlp.sk[0]}}<!--/hko--> |
| Spannungsfeld | <!--hko:hf_A.mehrdeutigkeit.trade_off-->{{= hf_A.mehrdeutigkeit.trade_off}}<!--/hko--> |
| KN-Kriterien | {{NAME (SuK), NAME (Ges) — wie in Kap. 0}} |
| Lehrmittel | {{KAPITEL}}, <!--hko:hf_A.quellen_anker[0].seiten-->{{= hf_A.quellen_anker[0].seiten}}<!--/hko--> |

{{WIEDERHOLEN in den Zeilen Aspekte, Sprachmodi, Schlüsselkompetenzen und Lehrmittel: je Array-Eintrag ein Marker mit Index [1], [2] …}}

{{NUR WENN das Heft zwei Kompetenzen trägt: Absatz und Tabelle «Verb aus dem nRLP | Wo im Heft», je Verb der Kompetenzen eine Zeile mit Leitfrage oder Schritt}}

**Die Situation**

<!--hko:hf_A.situation_text|quote-->
> {{= hf_A.situation_text, jede Zeile mit «> » davor}}
<!--/hko-->

**Leitfrage:** «<!--hko:hf_A.leitfrage-->{{= hf_A.leitfrage}}<!--/hko-->»

| Zahl | Wert |
|---|---|
| <!--hko:hf_A.zahlen_tabelle[0].label-->{{= hf_A.zahlen_tabelle[0].label}}<!--/hko--> | <!--hko:hf_A.zahlen_tabelle[0].wert-->{{= hf_A.zahlen_tabelle[0].wert}}<!--/hko--> |

{{WIEDERHOLEN: eine Zeile je Eintrag von hf_A.zahlen_tabelle. Ist das Array leer: Tabelle samt Kopf löschen}}

> [!hinweis] {{TITEL: Was die Situation trägt}}
> {{3–4 Sätze: an den Merkmalen einer guten Situation zeigen, was DIESE Situation leistet und wo ihr Reibungspunkt liegt}}

### Produkt: <!--hko:hf_A.handlungsprodukt.titel-->{{= hf_A.handlungsprodukt.titel}}<!--/hko-->

**Format:** <!--hko:hf_A.handlungsprodukt.format_detail-->{{= hf_A.handlungsprodukt.format_detail}}<!--/hko-->

Die fünf Schritte auf S. 5:

- Schritt <!--hko:hf_A.handlungsprodukt.schritte[0].label-->{{= …schritte[0].label}}<!--/hko-->: <!--hko:hf_A.handlungsprodukt.schritte[0].hint-->{{= …schritte[0].hint}}<!--/hko-->
- Schritt <!--hko:hf_A.handlungsprodukt.schritte[1].label-->{{= …schritte[1].label}}<!--/hko-->: <!--hko:hf_A.handlungsprodukt.schritte[1].hint-->{{= …schritte[1].hint}}<!--/hko-->
- Schritt <!--hko:hf_A.handlungsprodukt.schritte[2].label-->{{= …schritte[2].label}}<!--/hko-->: <!--hko:hf_A.handlungsprodukt.schritte[2].hint-->{{= …schritte[2].hint}}<!--/hko-->
- Schritt <!--hko:hf_A.handlungsprodukt.schritte[3].label-->{{= …schritte[3].label}}<!--/hko-->: <!--hko:hf_A.handlungsprodukt.schritte[3].hint-->{{= …schritte[3].hint}}<!--/hko-->
- Schritt <!--hko:hf_A.handlungsprodukt.schritte[4].label-->{{= …schritte[4].label}}<!--/hko-->: <!--hko:hf_A.handlungsprodukt.schritte[4].hint-->{{= …schritte[4].hint}}<!--/hko-->

**Abgaben**

<!--hko:hf_A.handlungsprodukt.abgaben|liste-->
- {{= je Eintrag von hf_A.handlungsprodukt.abgaben eine Zeile «- …»}}
<!--/hko-->

### Hinweise zu jeder Seite

**S. 1 — Herausforderung (8 Min.).** {{2–3 Sätze: was die Lernenden beim Lesen tun; was an der Situation nachrechenbar oder zu klären ist; was die Medien-Spur hier zeigt}}

**S. 2 — Wissensecke I (27 Min.).** {{2–3 Sätze: was LF1 klärt und was LF2 verlangt — mit Kapitel und Seite als Verweis, in eigenen Worten}}

> [!coaching] {{TITEL: LF1 und LF2}}
> {{2–4 Sätze: ein Coaching-Zug zum Fach DIESES Hefts — worauf du bestehst, welche Rückfrage hilft}}

**S. 3 — Quelle (25 Min.).**

- *Spur ohne Medien:* {{KAPITEL, SEITEN; was die Beispielzeile belegt; wo die weiteren Fundstellen liegen; was im Lehrmittel NICHT steht}}
- *Spur mit Medien:* {{TYP der Quelle, Länge, Ausschnitt; wonach das Raster fragt; welches Rezeptionswerkzeug gilt}}

**S. 4 — Wissensecke II (15 Min.).** {{1–2 Sätze: was LF4 verlangt}}

- *Spur ohne Medien:* {{POL-TYP in Worten; die Denkhilfe und ihre Spalten}}
- *Spur mit Medien:* {{POL-TYP in Worten; was der Kasten «Vertiefung» bietet — freiwillig}}

> [!erwartungshorizont] Vertiefung 1 (Spur mit Medien, {{TYP und FUNDSTELLE: Zeitmarke, Absatz oder Abschnitt}}) — {{STICHWORT}}
> {{ERWARTET: zwei bis drei Punkte, eigene Formulierung, aus dem Archivtext belegt}}
> {{GRENZE: was der Ausschnitt nicht nennt; Sprache; ob der Beitrag gegengehört ist}}

{{WIEDERHOLEN: ein Erwartungshorizont je Vertiefungskarte dieses Hefts. Ohne Medien-Spur: Callouts und die Zeilen «Spur mit Medien» weglassen}}

> [!coaching] {{TITEL zu LF4 oder zum Kern des Produkts}}
> {{3–4 Sätze: woran eine gute Antwort zu erkennen ist; welche Methodenkarte hilft; ein Gegenbeispiel und ein gelungenes Beispiel in je einem Satz}}

**S. 5 — Auftrag (5 Min.).** {{2–3 Sätze: was die Lernenden lesen; Spalte «Selbst»; was Schritt 05 in DIESEM Heft ist}}

**S. 6 — Methoden.** {{2–4 Sätze: die vier Karten und wofür jede dient; welche zwei ein Beispiel tragen}}

**S. 6 unten — «So kann Ihr Produkt aussehen».** {{2–3 Sätze: an welchem anderen Fall das Beispiel steht und was es zeigt (Form, nicht Lösung); wo die mögliche Lösung liegt (Dokument «Lösungen»)}}

**S. 7 — Arbeitsfläche ({{40 Min.}}).** {{2–4 Sätze: was hier entsteht. Bei mündlichem oder interaktivem Produkt: Paare oder Gruppen, Rollen, Rollentausch, Dauer je Durchgang, was als Notiz abgegeben wird}}

{{NUR BEI mündlichem oder interaktivem Produkt: Callout [!coaching] mit Titel zum Produkt — Struktur vorgeben, Rolle des Gegenübers, was zuhören heisst}}

**S. 8 — Abschluss (15 Min.).** {{3–5 Sätze: Begriffsnetz (Linien, Beschriftung, leere Knoten, «gilt auch bei …»), Glossar des Hefts, die drei Zeilen «Das nehme ich mit» mit ihren Titeln aus abschluss; dass der Auftragsbogen darauf zurückgreift}}

### Typische Stolpersteine

> [!warnung] {{STOLPERSTEIN 1 — Titel}}
> {{2–3 Sätze: der Fehler, woran du ihn erkennst, deine Rückfrage}}

> [!warnung] {{STOLPERSTEIN 2 — Titel}}
> {{2–3 Sätze}}

{{WIEDERHOLEN: drei bis vier Stolpersteine, hergeleitet aus den Lösungen und Erwartungshorizonten dieses Hefts (was dort als «nicht tragfähig» steht) und aus den Zugeständnissen der Quelle; je Spur höchstens einer mit dem Zusatz «(Spur mit Medien)» im Titel}}

> [!troubleshooting] Herausforderung A — {{«TYPISCHER SATZ einer blockierten Person»}}
> {{2–3 Sätze: spiegeln statt erklären — eine Frage, die weiterführt, ohne die Lösung vorzugeben}}

> [!mehrdeutigkeit] Herausforderung A
> Leitsatz im Heft: «<!--hko:hf_A.mehrdeutigkeit.hint-->{{= hf_A.mehrdeutigkeit.hint}}<!--/hko-->»
> {{1–2 Sätze: dein Eingriff, wenn jemand eine Seite vorschnell für falsch erklärt}}

{{NUR WENN Heft A nur eine Spur hat: EIN SATZ — das Heft hat nur diese Spur; wo die folgenden Lösungen «in beiden Spuren» sagen, heisst das für dieses Heft «in dieser Spur» (phase-8-begleiter.md §7.1). Sonst diese Zeile löschen}}

### Tafelbild — Begriffsnetz Heft A

> [!tafelbild] {{TITEL: Erwartungsbild — Begriffsnetz um das gemeinsame Zentrum}}
> **Zentrum:** «<!--hko:hf_A.mindmap_zentrum-->{{= hf_A.mindmap_zentrum}}<!--/hko-->»
>
> **Vorgegebene Knoten (zugleich das Glossar des Hefts):**
> - «<!--hko:hf_A.mindmap_aeste[0].titel-->{{= …aeste[0].titel}}<!--/hko-->»: <!--hko:hf_A.mindmap_aeste[0].punkte[0]-->{{= …aeste[0].punkte[0]}}<!--/hko-->
> - «<!--hko:hf_A.mindmap_aeste[1].titel-->{{= …aeste[1].titel}}<!--/hko-->»: <!--hko:hf_A.mindmap_aeste[1].punkte[0]-->{{= …aeste[1].punkte[0]}}<!--/hko-->
> - «<!--hko:hf_A.mindmap_aeste[2].titel-->{{= …aeste[2].titel}}<!--/hko-->»: <!--hko:hf_A.mindmap_aeste[2].punkte[0]-->{{= …aeste[2].punkte[0]}}<!--/hko-->
> - {{ZWEI LEERE KNOTEN: je Spur ein möglicher Begriff aus abschluss.loesung.eigene_knoten}}
> - {{«gilt auch bei …»: mögliche eigene Beispiele}}
>
> **Tragfähige Verbindungen, zum Beispiel:** {{FÜNF Verbindungen «Knoten → Knoten («Beschriftung»)» aus abschluss.loesung.verbindungen; Schlusssatz: es zählt die Beschriftung, nicht die Wahl der Linien}}
>
> **Optionale Vertiefung (für 100 %):** <!--hko:hf_A.lernfortschritt.scaffold_100-->{{= hf_A.lernfortschritt.scaffold_100}}<!--/hko-->

{{WIEDERHOLEN in jeder Ast-Zeile: je Begriff ein Marker …punkte[1], …punkte[2] …, getrennt durch « · ». Der vierte Ast (Transfer, punkte leer) bekommt keinen Marker}}

### Wann ist das Heft fertig? (Selbstcheck — formativ, nicht benotet)

**<!--hko:hf_A.bewertungsraster[0].produkt-->{{= hf_A.bewertungsraster[0].produkt}}<!--/hko-->**
<!--hko:hf_A.bewertungsraster[0].vollstaendig_wenn|checkliste-->
☐ {{= je Eintrag von bewertungsraster[0].vollstaendig_wenn eine Zeile «☐ …»}}
<!--/hko-->

**<!--hko:hf_A.bewertungsraster[1].produkt-->{{= hf_A.bewertungsraster[1].produkt}}<!--/hko-->**
<!--hko:hf_A.bewertungsraster[1].vollstaendig_wenn|checkliste-->
☐ {{= je Eintrag eine Zeile «☐ …»}}
<!--/hko-->

**<!--hko:hf_A.bewertungsraster[2].produkt-->{{= hf_A.bewertungsraster[2].produkt}}<!--/hko-->**
<!--hko:hf_A.bewertungsraster[2].vollstaendig_wenn|checkliste-->
☐ {{= je Eintrag eine Zeile «☐ …»}}
<!--/hko-->

**<!--hko:hf_A.bewertungsraster[3].produkt-->{{= hf_A.bewertungsraster[3].produkt}}<!--/hko-->**
<!--hko:hf_A.bewertungsraster[3].vollstaendig_wenn|checkliste-->
☐ {{= je Eintrag eine Zeile «☐ …»}}
<!--/hko-->

> [!differenzieren] 80 vs. 100 — Herausforderung A
> {{**80 % (alle):** das vollständige Produkt in einem Satz; als Stütze NUR, was es im Heft gibt (Beispiel auf S. 6, Beispielzeile im Raster). **100 % (Vertiefung):** die Plus-Aufgabe in eigenen Worten}}

## 4. Herausforderung B — {{= hf_B.herausforderung.label, als Text ohne Marker}}

| Feld | Inhalt |
|---|---|
| Titel | <!--hko:hf_B.titel-->{{= hf_B.titel}}<!--/hko--> |
| Herausforderung | <!--hko:hf_B.herausforderung.label-->{{= hf_B.herausforderung.label}}<!--/hko--> ({{X.Y.Z}}) |
| Persona | <!--hko:hf_B.persona.beruf-->{{= hf_B.persona.beruf}}<!--/hko--> — <!--hko:hf_B.persona.betrieb-->{{= hf_B.persona.betrieb}}<!--/hko-->, <!--hko:hf_B.persona.ort-->{{= hf_B.persona.ort}}<!--/hko--> |
| Aspekte (Ges) | <!--hko:hf_B.nrlp.gesellschaft[0].aspekt-->{{= …aspekt}}<!--/hko--> (<!--hko:hf_B.nrlp.gesellschaft[0].iteration-->{{= …iteration}}<!--/hko-->) |
| Sprachmodi | <!--hko:hf_B.nrlp.sprachmodi[0]-->{{= hf_B.nrlp.sprachmodi[0]}}<!--/hko--> |
| Schlüsselkompetenzen | SK<!--hko:hf_B.nrlp.sk[0]-->{{= hf_B.nrlp.sk[0]}}<!--/hko--> |
| Spannungsfeld | <!--hko:hf_B.mehrdeutigkeit.trade_off-->{{= hf_B.mehrdeutigkeit.trade_off}}<!--/hko--> |
| KN-Kriterien | {{NAME (SuK), NAME (Ges) — wie in Kap. 0}} |
| Lehrmittel | {{KAPITEL}}, <!--hko:hf_B.quellen_anker[0].seiten-->{{= hf_B.quellen_anker[0].seiten}}<!--/hko--> |

{{WIEDERHOLEN wie in Kap. 3: je Array-Eintrag ein Marker mit Index [1], [2] …}}

{{NUR WENN das Heft zwei Kompetenzen trägt: Absatz und Tabelle «Verb aus dem nRLP | Wo im Heft», je Verb der Kompetenzen eine Zeile mit Leitfrage oder Schritt}}

**Die Situation**

<!--hko:hf_B.situation_text|quote-->
> {{= hf_B.situation_text, jede Zeile mit «> » davor}}
<!--/hko-->

**Leitfrage:** «<!--hko:hf_B.leitfrage-->{{= hf_B.leitfrage}}<!--/hko-->»

| Zahl | Wert |
|---|---|
| <!--hko:hf_B.zahlen_tabelle[0].label-->{{= hf_B.zahlen_tabelle[0].label}}<!--/hko--> | <!--hko:hf_B.zahlen_tabelle[0].wert-->{{= hf_B.zahlen_tabelle[0].wert}}<!--/hko--> |

{{WIEDERHOLEN: eine Zeile je Eintrag von hf_B.zahlen_tabelle. Ist das Array leer: Tabelle samt Kopf löschen}}

> [!hinweis] {{TITEL: Was die Situation trägt}}
> {{3–4 Sätze, wie in Kap. 3, für die Situation von Heft B}}

### Produkt: <!--hko:hf_B.handlungsprodukt.titel-->{{= hf_B.handlungsprodukt.titel}}<!--/hko-->

**Format:** <!--hko:hf_B.handlungsprodukt.format_detail-->{{= hf_B.handlungsprodukt.format_detail}}<!--/hko-->

Die fünf Schritte auf S. 5:

- Schritt <!--hko:hf_B.handlungsprodukt.schritte[0].label-->{{= …schritte[0].label}}<!--/hko-->: <!--hko:hf_B.handlungsprodukt.schritte[0].hint-->{{= …schritte[0].hint}}<!--/hko-->
- Schritt <!--hko:hf_B.handlungsprodukt.schritte[1].label-->{{= …schritte[1].label}}<!--/hko-->: <!--hko:hf_B.handlungsprodukt.schritte[1].hint-->{{= …schritte[1].hint}}<!--/hko-->
- Schritt <!--hko:hf_B.handlungsprodukt.schritte[2].label-->{{= …schritte[2].label}}<!--/hko-->: <!--hko:hf_B.handlungsprodukt.schritte[2].hint-->{{= …schritte[2].hint}}<!--/hko-->
- Schritt <!--hko:hf_B.handlungsprodukt.schritte[3].label-->{{= …schritte[3].label}}<!--/hko-->: <!--hko:hf_B.handlungsprodukt.schritte[3].hint-->{{= …schritte[3].hint}}<!--/hko-->
- Schritt <!--hko:hf_B.handlungsprodukt.schritte[4].label-->{{= …schritte[4].label}}<!--/hko-->: <!--hko:hf_B.handlungsprodukt.schritte[4].hint-->{{= …schritte[4].hint}}<!--/hko-->

**Abgaben**

<!--hko:hf_B.handlungsprodukt.abgaben|liste-->
- {{= je Eintrag von hf_B.handlungsprodukt.abgaben eine Zeile «- …»}}
<!--/hko-->

### Hinweise zu jeder Seite

**S. 1 — Herausforderung (8 Min.).** {{2–3 Sätze}}

**S. 2 — Wissensecke I (27 Min.).** {{2–3 Sätze}}

> [!coaching] {{TITEL: LF1 und LF2}}
> {{2–4 Sätze}}

**S. 3 — Quelle (25 Min.).**

- *Spur ohne Medien:* {{…}}
- *Spur mit Medien:* {{…}}

**S. 4 — Wissensecke II (15 Min.).** {{1–2 Sätze}}

- *Spur ohne Medien:* {{…}}
- *Spur mit Medien:* {{…}}

> [!erwartungshorizont] Vertiefung 1 (Spur mit Medien, {{TYP und FUNDSTELLE}}) — {{STICHWORT}}
> {{ERWARTET: zwei bis drei Punkte, eigene Formulierung, aus dem Archivtext belegt}}
> {{GRENZE: was der Ausschnitt nicht nennt}}

{{WIEDERHOLEN: ein Erwartungshorizont je Vertiefungskarte dieses Hefts}}

**S. 5 — Auftrag (5 Min.).** {{2–3 Sätze}}

**S. 6 — Methoden.** {{2–4 Sätze}}

**S. 6 unten — «So kann Ihr Produkt aussehen».** {{2–3 Sätze}}

**S. 7 — Arbeitsfläche ({{40 Min.}}).** {{2–4 Sätze; bei mündlichem oder interaktivem Produkt mit Organisation im Zimmer}}

> [!coaching] {{TITEL zum Produkt von Heft B}}
> {{3–4 Sätze: der Coaching-Zug, der zu DIESEM Produkt passt}}

**S. 8 — Abschluss (15 Min.).** {{3–5 Sätze}}

### Typische Stolpersteine

> [!warnung] {{STOLPERSTEIN 1 — Titel}}
> {{2–3 Sätze}}

> [!warnung] {{STOLPERSTEIN 2 — Titel}}
> {{2–3 Sätze}}

{{WIEDERHOLEN: drei bis vier Stolpersteine, hergeleitet wie in Kap. 3}}

> [!troubleshooting] Herausforderung B — {{«TYPISCHER SATZ einer blockierten Person»}}
> {{2–3 Sätze}}

> [!mehrdeutigkeit] Herausforderung B
> Leitsatz im Heft: «<!--hko:hf_B.mehrdeutigkeit.hint-->{{= hf_B.mehrdeutigkeit.hint}}<!--/hko-->»
> {{1–2 Sätze: dein Eingriff}}

{{NUR WENN Heft B nur eine Spur hat: EIN SATZ wie bei Heft A. Sonst diese Zeile löschen}}

### Tafelbild — Begriffsnetz Heft B

> [!tafelbild] {{TITEL: Erwartungsbild — Begriffsnetz um das gemeinsame Zentrum}}
> **Zentrum:** «<!--hko:hf_B.mindmap_zentrum-->{{= hf_B.mindmap_zentrum}}<!--/hko-->»
>
> **Vorgegebene Knoten (zugleich das Glossar des Hefts):**
> - «<!--hko:hf_B.mindmap_aeste[0].titel-->{{= …aeste[0].titel}}<!--/hko-->»: <!--hko:hf_B.mindmap_aeste[0].punkte[0]-->{{= …aeste[0].punkte[0]}}<!--/hko-->
> - «<!--hko:hf_B.mindmap_aeste[1].titel-->{{= …aeste[1].titel}}<!--/hko-->»: <!--hko:hf_B.mindmap_aeste[1].punkte[0]-->{{= …aeste[1].punkte[0]}}<!--/hko-->
> - «<!--hko:hf_B.mindmap_aeste[2].titel-->{{= …aeste[2].titel}}<!--/hko-->»: <!--hko:hf_B.mindmap_aeste[2].punkte[0]-->{{= …aeste[2].punkte[0]}}<!--/hko-->
> - {{ZWEI LEERE KNOTEN: je Spur ein möglicher Begriff}}
> - {{«gilt auch bei …»: mögliche eigene Beispiele}}
>
> **Tragfähige Verbindungen, zum Beispiel:** {{FÜNF Verbindungen aus abschluss.loesung.verbindungen}}
>
> **Optionale Vertiefung (für 100 %):** <!--hko:hf_B.lernfortschritt.scaffold_100-->{{= hf_B.lernfortschritt.scaffold_100}}<!--/hko-->

{{WIEDERHOLEN in jeder Ast-Zeile: je Begriff ein Marker …punkte[1], …punkte[2] …}}

### Wann ist das Heft fertig? (Selbstcheck — formativ, nicht benotet)

**<!--hko:hf_B.bewertungsraster[0].produkt-->{{= hf_B.bewertungsraster[0].produkt}}<!--/hko-->**
<!--hko:hf_B.bewertungsraster[0].vollstaendig_wenn|checkliste-->
☐ {{= je Eintrag eine Zeile «☐ …»}}
<!--/hko-->

**<!--hko:hf_B.bewertungsraster[1].produkt-->{{= hf_B.bewertungsraster[1].produkt}}<!--/hko-->**
<!--hko:hf_B.bewertungsraster[1].vollstaendig_wenn|checkliste-->
☐ {{= je Eintrag eine Zeile «☐ …»}}
<!--/hko-->

**<!--hko:hf_B.bewertungsraster[2].produkt-->{{= hf_B.bewertungsraster[2].produkt}}<!--/hko-->**
<!--hko:hf_B.bewertungsraster[2].vollstaendig_wenn|checkliste-->
☐ {{= je Eintrag eine Zeile «☐ …»}}
<!--/hko-->

**<!--hko:hf_B.bewertungsraster[3].produkt-->{{= hf_B.bewertungsraster[3].produkt}}<!--/hko-->**
<!--hko:hf_B.bewertungsraster[3].vollstaendig_wenn|checkliste-->
☐ {{= je Eintrag eine Zeile «☐ …»}}
<!--/hko-->

> [!differenzieren] 80 vs. 100 — Herausforderung B
> {{**80 % (alle):** … **100 % (Vertiefung):** … — wie in Kap. 3}}

## 5. Quellen-Stand

{{ABSATZ, 2 Sätze: Die Tabelle entsteht beim Laden aus der Quellenkartei und zeigt den Prüfstand; das Repository enthält nur Metadaten, keine Volltexte}}

<!--hko:quellen|quellenstand-->
| Rolle | Titel | Herausgeber | Datum | Verortung | Länge | Geprüft am | Link |
|---|---|---|---|---|---|---|---|
| {{JE KARTE EINE ZEILE in der Form, die der Loader erzeugt — phase-8-begleiter.md §4.2: A · Quelle (id) | Titel | Herausgeber | TT.MM.JJJJ | Verortung | Länge | TT.MM.JJJJ | [host](url)}} |
<!--/hko-->

**Was du über die Quellen wissen musst**

- {{JE QUELLE mit einem Zugeständnis ein Punkt: Herkunft und Reichweite der Daten, Sprache, was nicht zum Auftrag gehört, ob gegengehört, Stand von Zahlen und Rechtslage — aus den Quellenkarten und den Lösungen zu LF3}}

> [!hinweis] {{TITEL: Links pflegen}}
> {{2–3 Sätze: prüfen vor jedem Einsatz der Medien-Spur und halbjährlich; was geschieht, wenn eine Quelle dauerhaft ausfällt}}

{{HAT DIE EINHEIT KEINE MEDIEN-SPUR: Marker-Block, Liste und Callout löschen; unter der Überschrift steht ein Absatz, dass die Einheit ohne Quellenkarten auskommt und welche Lehrmittel-Abschnitte die Hefte tragen (Kapitel und Seite)}}

## 6. Gemeinsamer Auftrag «{{= set.gemeinsamer_auftrag.titel, als Text ohne Marker}}»

### Funktion

{{ABSATZ, 2–3 Sätze: Generalprobe mit Rückmeldung — neuer Fall im Lebensbereich}} (<!--hko:set.gemeinsamer_auftrag.lebensbereich-->{{= set.gemeinsamer_auftrag.lebensbereich}}<!--/hko-->) {{… alle vier KN-Kriterien, gleicher Wortlaut, ohne Note}}

- **Gleiche Anforderung, anderer Fall:** {{EIN SATZ}}
- **In allen Spuren identisch:** {{EIN SATZ: der Auftrag braucht kein Medium}}
- **Hefte erlaubt und erwünscht:** {{EIN SATZ: Kasten auf A1, mit Seitenzahlen aus heft_bezug}}
- **Sprachmodi:** {{HERLEITUNG in einem Satz: welche KN-Modi die Hefte nicht abdecken}} <!--hko:set.gemeinsamer_auftrag.sprachmodi[0]-->{{= set.gemeinsamer_auftrag.sprachmodi[0]}}<!--/hko--> {{WIEDERHOLEN: je weiterer Modus ein Marker mit Index [1]}}

### Die Situation

<!--hko:set.gemeinsamer_auftrag.situation_text|quote-->
> {{= set.gemeinsamer_auftrag.situation_text, jede Zeile mit «> » davor}}
<!--/hko-->

**Leitfrage:** «<!--hko:set.gemeinsamer_auftrag.leitfrage-->{{= set.gemeinsamer_auftrag.leitfrage}}<!--/hko-->»

**Spannungsfeld:** <!--hko:set.gemeinsamer_auftrag.mehrdeutigkeit.trade_off-->{{= set.gemeinsamer_auftrag.mehrdeutigkeit.trade_off}}<!--/hko-->. Aktiviert werden zugleich:

<!--hko:set.gemeinsamer_auftrag.aktivierte_trade_offs|liste-->
- {{= je Eintrag von aktivierte_trade_offs eine Zeile «- …»}}
<!--/hko-->

**Auftrag an die Lernenden:** <!--hko:set.gemeinsamer_auftrag.auftrag-->{{= set.gemeinsamer_auftrag.auftrag}}<!--/hko-->

- Schritt <!--hko:set.gemeinsamer_auftrag.schritte[0].label-->{{= …schritte[0].label}}<!--/hko-->: <!--hko:set.gemeinsamer_auftrag.schritte[0].hint-->{{= …schritte[0].hint}}<!--/hko-->
- Schritt <!--hko:set.gemeinsamer_auftrag.schritte[1].label-->{{= …schritte[1].label}}<!--/hko-->: <!--hko:set.gemeinsamer_auftrag.schritte[1].hint-->{{= …schritte[1].hint}}<!--/hko-->
- Schritt <!--hko:set.gemeinsamer_auftrag.schritte[2].label-->{{= …schritte[2].label}}<!--/hko-->: <!--hko:set.gemeinsamer_auftrag.schritte[2].hint-->{{= …schritte[2].hint}}<!--/hko-->
- Schritt <!--hko:set.gemeinsamer_auftrag.schritte[3].label-->{{= …schritte[3].label}}<!--/hko-->: <!--hko:set.gemeinsamer_auftrag.schritte[3].hint-->{{= …schritte[3].hint}}<!--/hko-->
- Schritt <!--hko:set.gemeinsamer_auftrag.schritte[4].label-->{{= …schritte[4].label}}<!--/hko-->: <!--hko:set.gemeinsamer_auftrag.schritte[4].hint-->{{= …schritte[4].hint}}<!--/hko-->

**Abgaben**

<!--hko:set.gemeinsamer_auftrag.abgaben|liste-->
- {{= je Eintrag von abgaben eine Zeile «- …»}}
<!--/hko-->

> [!coaching] {{TITEL: die Stelle der Situation, an der Lernende eine Annahme treffen müssen}}
> {{2–4 Sätze: was die Situation offen lässt und was als begründete Annahme genügt. Lässt sie nichts offen: Callout weglassen}}

### Ablauf über drei Lektionen (Vorschlag)

{{ABSATZ: die vier Seiten des Bogens — A1 Situation und Auftrag · A2 und A3 nach den zwei Produkten (aus gemeinsamer_auftrag.produkte bzw. den Schritten 04 und 05) · A4 Selbsteinschätzung mit den Spalten «Selbst» und «Fremd»}}

| Lektion | Was geschieht | Bogen | Sozialform |
|---|---|---|---|
| 1 | {{SITUATION, Schritte 01–03, erstes Produkt}} | {{SEITEN}} | {{SOZIALFORM}} |
| 2 | {{ZWEITES PRODUKT, Selbsteinschätzung}} | {{SEITEN}} | {{SOZIALFORM}} |
| 3 | {{RÜCKMELDUNG, Verbesserung}} | A4 | {{SOZIALFORM}} |

> [!hinweis] Sozialform
> {{1–2 Sätze, hergeleitet aus den Sprachmodi: mit Interaktionsmodus Partner- oder Gruppenarbeit mit ausgewiesenem Anteil je Person; sonst frei, Produkt individuell}} Empfehlung: <!--hko:set.gemeinsamer_auftrag.sozialform.empfehlung-->{{= set.gemeinsamer_auftrag.sozialform.empfehlung}}<!--/hko-->

### {{ÜBERSCHRIFT: das Produkt des Auftrags, das Organisation braucht — in der Regel das zweite, benannt wie in Schritt 05}}

{{ABSATZ, 2–3 Sätze: an wen sich das Produkt richtet, Umfang oder Dauer, was es enthält, was es nicht ist}}

- {{WIE es abgegeben oder gezeigt wird (live, als Aufnahme direkt an die Lehrperson, auf Papier)}}
- {{NICHTS wird auf die Plattform geladen — bei Aufnahmen ausdrücklich}}

### Kriterien und Indikatoren

{{EIN SATZ: die vier Kriterien stehen auf A4 im Wortlaut des KN (Kap. 7)}}

| Kriterium | Dim. | Indikator im Auftrag |
|---|---|---|
| <!--hko:set.gemeinsamer_auftrag.feedback_kriterien[0].kn_kriterium-->{{= …[0].kn_kriterium}}<!--/hko--> | <!--hko:set.gemeinsamer_auftrag.feedback_kriterien[0].dimension-->{{= …[0].dimension}}<!--/hko--> | <!--hko:set.gemeinsamer_auftrag.feedback_kriterien[0].indikator_produkt-->{{= …[0].indikator_produkt}}<!--/hko--> |
| <!--hko:set.gemeinsamer_auftrag.feedback_kriterien[1].kn_kriterium-->{{= …[1].kn_kriterium}}<!--/hko--> | <!--hko:set.gemeinsamer_auftrag.feedback_kriterien[1].dimension-->{{= …[1].dimension}}<!--/hko--> | <!--hko:set.gemeinsamer_auftrag.feedback_kriterien[1].indikator_produkt-->{{= …[1].indikator_produkt}}<!--/hko--> |
| <!--hko:set.gemeinsamer_auftrag.feedback_kriterien[2].kn_kriterium-->{{= …[2].kn_kriterium}}<!--/hko--> | <!--hko:set.gemeinsamer_auftrag.feedback_kriterien[2].dimension-->{{= …[2].dimension}}<!--/hko--> | <!--hko:set.gemeinsamer_auftrag.feedback_kriterien[2].indikator_produkt-->{{= …[2].indikator_produkt}}<!--/hko--> |
| <!--hko:set.gemeinsamer_auftrag.feedback_kriterien[3].kn_kriterium-->{{= …[3].kn_kriterium}}<!--/hko--> | <!--hko:set.gemeinsamer_auftrag.feedback_kriterien[3].dimension-->{{= …[3].dimension}}<!--/hko--> | <!--hko:set.gemeinsamer_auftrag.feedback_kriterien[3].indikator_produkt-->{{= …[3].indikator_produkt}}<!--/hko--> |

### Erwartungshorizont

> [!erwartungshorizont] Gemeinsamer Auftrag — {{STICHWORT: was vertretbar ist}}
> - **Gut, wenn:** <!--hko:set.gemeinsamer_auftrag.erwartungshorizont.gut_wenn[0]-->{{= …gut_wenn[0]}}<!--/hko-->
> - **Tragfähig:** <!--hko:set.gemeinsamer_auftrag.erwartungshorizont.tragfaehig-->{{= …tragfaehig}}<!--/hko-->
> - **Nicht tragfähig:** <!--hko:set.gemeinsamer_auftrag.erwartungshorizont.nicht_tragfaehig-->{{= …nicht_tragfaehig}}<!--/hko-->

{{WIEDERHOLEN: je Eintrag von gut_wenn eine Zeile «> - **Gut, wenn:** …» mit Index [1], [2], vor der Zeile «Tragfähig»}}

### Rückmeldung vor dem KN

{{ABSATZ, 4–5 Sätze, als Vorschlag formuliert: zwischen Abgabe und KN mindestens eine Lektion Rückmeldung; der Bogen lässt offen, wer die Spalte «Fremd» ausfüllt, und nennt weder Lehrperson noch Note; was du im Vorschlag tust; wozu der Puffer dient (Kap. 1)}}

### Abgrenzung zum KN

| | Gemeinsamer Auftrag | KN |
|---|---|---|
| Zweck | Übung mit Rückmeldung | Nachweis |
| Kriterien | {{DIESELBEN vier, gleicher Wortlaut, gleiche Stufen}} | vier KN-Kriterien |
| Situation | {{NEU, verbindet A und B, Lebensbereich des Auftrags}} | {{NEU, verbindet A und B, anderer Lebensbereich}} |
| Produkt | {{DIE ZWEI PRODUKTE des Auftrags}} | eine der drei KN-Formen |
| Rückmeldung | {{WER, WANN}} | Note |

{{ABSATZ, 1–2 Sätze: worin sich Auftrag und KN unterscheiden — Lebensbereich, Produktform —, OHNE den Fall des KN zu beschreiben. Schlusssatz leitet die Liste ein}}

<!--hko:set.gemeinsamer_auftrag.kontext_ausschluss|liste-->
- {{= je Eintrag von kontext_ausschluss eine Zeile «- …»}}
<!--/hko-->

## 7. Der Kompetenznachweis (KN)

**Hybrid-Herausforderung: «<!--hko:kn.hybrid_situation.titel-->{{= kn.hybrid_situation.titel}}<!--/hko-->»**

<!--hko:kn.hybrid_situation.text|quote-->
> {{= kn.hybrid_situation.text, jede Zeile mit «> » davor}}
<!--/hko-->

> [!hinweis] {{TITEL: Warum der Fall neu sein muss}}
> {{3–4 Sätze: Persona gleich und neutral, den Transfer trägt der Fall; was im KN anders vorliegt als in den Heften; was der eigentliche Prüfgegenstand ist}}

| Aus Heft | zeigt sich im KN als |
|---|---|
| A ({{STICHWORT}}) | <!--hko:kn.hybrid_situation.alignment_note.herausforderungen_mapping[0].scene_element-->{{= …herausforderungen_mapping[0].scene_element}}<!--/hko--> |
| B ({{STICHWORT}}) | <!--hko:kn.hybrid_situation.alignment_note.herausforderungen_mapping[1].scene_element-->{{= …herausforderungen_mapping[1].scene_element}}<!--/hko--> |

**Methodenwahl**

| Methode | Format | Prüft primär | Sprachmodi | Wähle, wenn |
|---|---|---|---|---|
| Fachgespräch | <!--hko:kn.kn_typen[0].format-->{{= kn.kn_typen[0].format}}<!--/hko--> | {{WAS}} | {{MODI aus kn.kn_typen[0].sprachmodi, gekürzt}} | {{BEDINGUNG}} |
| Mini Case schriftlich | <!--hko:kn.kn_typen[1].format-->{{= kn.kn_typen[1].format}}<!--/hko--> | {{WAS}} | {{MODI}} | {{BEDINGUNG}} |
| Werkschau + Transfer | <!--hko:kn.kn_typen[2].format-->{{= kn.kn_typen[2].format}}<!--/hko--> | {{WAS}} | {{MODI}} | {{BEDINGUNG}} |

> [!coaching] {{TITEL: Methodenwahl an die Zeit koppeln}}
> {{2–3 Sätze: welche Formen in die zwei KN-Lektionen passen, welche gestaffelt werden (Kap. 1); die Rubrik ist in allen Formen dieselbe}}

**Fachgespräch — Fragen**

| # | Typ | K | Frage |
|---|---|---|---|
| 1 | {{TYP}} | {{K}} | <!--hko:kn.kn_typen[0].fragestruktur[0].frage-->{{= …fragestruktur[0].frage}}<!--/hko--> |
| 2 | {{TYP}} | {{K}} | <!--hko:kn.kn_typen[0].fragestruktur[1].frage-->{{= …fragestruktur[1].frage}}<!--/hko--> |
| 3 | {{TYP}} | {{K}} | <!--hko:kn.kn_typen[0].fragestruktur[2].frage-->{{= …fragestruktur[2].frage}}<!--/hko--> |
| 4 | {{TYP}} | {{K}} | <!--hko:kn.kn_typen[0].fragestruktur[3].frage-->{{= …fragestruktur[3].frage}}<!--/hko--> |
| 5 | {{TYP}} | {{K}} | <!--hko:kn.kn_typen[0].fragestruktur[4].frage-->{{= …fragestruktur[4].frage}}<!--/hko--> |

{{EIN SATZ zum Ablauf: Vorbereitung, erlaubte Hilfsmittel, Dauer — aus kn.kn_typen[0].ablauf, in eigenen Worten}}

> [!erwartungshorizont] Frage {{N}} ({{TYP}}, K{{N}}) — {{STICHWORT}}
> {{2 Punkte: …}}
> {{3 Punkte zusätzlich: …}}
> {{Nicht 3 Punkte: eine Antwort, die souverän klingt, das Spannungsfeld aber vorschnell auflöst}}

{{WIEDERHOLEN: ein Erwartungshorizont je Frage — mindestens für die Fragen der Typen Erklären, Beurteilen und Werthaltung}}

**Mini Case schriftlich — Aufgaben** {{KLAMMER: Rahmen der Prüfung}}

1. «<!--hko:kn.kn_typen[1].aufgaben[0].aufgabe-->{{= …aufgaben[0].aufgabe}}<!--/hko-->» ({{TYP, K}})
2. «<!--hko:kn.kn_typen[1].aufgaben[1].aufgabe-->{{= …aufgaben[1].aufgabe}}<!--/hko-->» ({{TYP, K}})
3. «<!--hko:kn.kn_typen[1].aufgaben[2].aufgabe-->{{= …aufgaben[2].aufgabe}}<!--/hko-->» ({{TYP, K}})
4. «<!--hko:kn.kn_typen[1].aufgaben[3].aufgabe-->{{= …aufgaben[3].aufgabe}}<!--/hko-->» ({{TYP, K}})

**Werkschau + Transfer-Reflexion**

<!--hko:kn.kn_typen[2].ablauf|liste-->
- {{= je Eintrag von kn.kn_typen[2].ablauf eine Zeile «- …»}}
<!--/hko-->

Die drei Reflexionsfragen:

1. «<!--hko:kn.kn_typen[2].reflexionsfragen[0]-->{{= …reflexionsfragen[0]}}<!--/hko-->»
2. «<!--hko:kn.kn_typen[2].reflexionsfragen[1]-->{{= …reflexionsfragen[1]}}<!--/hko-->»
3. «<!--hko:kn.kn_typen[2].reflexionsfragen[2]-->{{= …reflexionsfragen[2]}}<!--/hko-->»

**Bi-dimensionale Bewertung** (0 bis 3 Punkte je Kriterium — dieselbe Skala wie in den Heften und im Auftragsbogen)

| Kriterium | 0 Punkte | 1 Punkt | 2 Punkte | 3 Punkte |
|---|---|---|---|---|
| **<!--hko:kn.rubrik_shared.kriterien[0].name-->{{= …[0].name}}<!--/hko-->** (<!--hko:kn.rubrik_shared.kriterien[0].dimension-->{{= …[0].dimension}}<!--/hko-->) | <!--hko:kn.rubrik_shared.kriterien[0].stufen[0]-->{{= …[0].stufen[0]}}<!--/hko--> | <!--hko:kn.rubrik_shared.kriterien[0].stufen[1]-->{{= …[0].stufen[1]}}<!--/hko--> | <!--hko:kn.rubrik_shared.kriterien[0].stufen[2]-->{{= …[0].stufen[2]}}<!--/hko--> | <!--hko:kn.rubrik_shared.kriterien[0].stufen[3]-->{{= …[0].stufen[3]}}<!--/hko--> |
| **<!--hko:kn.rubrik_shared.kriterien[1].name-->{{= …[1].name}}<!--/hko-->** (<!--hko:kn.rubrik_shared.kriterien[1].dimension-->{{= …[1].dimension}}<!--/hko-->) | <!--hko:kn.rubrik_shared.kriterien[1].stufen[0]-->{{= …[1].stufen[0]}}<!--/hko--> | <!--hko:kn.rubrik_shared.kriterien[1].stufen[1]-->{{= …[1].stufen[1]}}<!--/hko--> | <!--hko:kn.rubrik_shared.kriterien[1].stufen[2]-->{{= …[1].stufen[2]}}<!--/hko--> | <!--hko:kn.rubrik_shared.kriterien[1].stufen[3]-->{{= …[1].stufen[3]}}<!--/hko--> |
| **<!--hko:kn.rubrik_shared.kriterien[2].name-->{{= …[2].name}}<!--/hko-->** (<!--hko:kn.rubrik_shared.kriterien[2].dimension-->{{= …[2].dimension}}<!--/hko-->) | <!--hko:kn.rubrik_shared.kriterien[2].stufen[0]-->{{= …[2].stufen[0]}}<!--/hko--> | <!--hko:kn.rubrik_shared.kriterien[2].stufen[1]-->{{= …[2].stufen[1]}}<!--/hko--> | <!--hko:kn.rubrik_shared.kriterien[2].stufen[2]-->{{= …[2].stufen[2]}}<!--/hko--> | <!--hko:kn.rubrik_shared.kriterien[2].stufen[3]-->{{= …[2].stufen[3]}}<!--/hko--> |
| **<!--hko:kn.rubrik_shared.kriterien[3].name-->{{= …[3].name}}<!--/hko-->** (<!--hko:kn.rubrik_shared.kriterien[3].dimension-->{{= …[3].dimension}}<!--/hko-->) | <!--hko:kn.rubrik_shared.kriterien[3].stufen[0]-->{{= …[3].stufen[0]}}<!--/hko--> | <!--hko:kn.rubrik_shared.kriterien[3].stufen[1]-->{{= …[3].stufen[1]}}<!--/hko--> | <!--hko:kn.rubrik_shared.kriterien[3].stufen[2]-->{{= …[3].stufen[2]}}<!--/hko--> | <!--hko:kn.rubrik_shared.kriterien[3].stufen[3]-->{{= …[3].stufen[3]}}<!--/hko--> |

Niveaubänder: {{DIE DREI BÄNDER aus kn.rubrik_shared.niveaubaender, in einer Zeile, in Punkten formuliert}}

```
Endnote SuK = Mittel({{KRITERIUM}}, {{KRITERIUM}})
Endnote Ges = Mittel({{KRITERIUM}}, {{KRITERIUM}})
→ zwei Noten: SuK und Ges bleiben getrennt und werden nicht verrechnet.
```

> [!warnung] {{TITEL: Zwei Noten, nicht eine}}
> {{2 Sätze: warum die zwei Dimensionen getrennt bleiben}}

> [!mehrdeutigkeit] {{TITEL: Der häufigste Bewertungsfehler}}
> {{2–3 Sätze, am Spannungsfeld DIESER Einheit: warum die klarste Lösung nicht die höchste Punktzahl ergibt}}
