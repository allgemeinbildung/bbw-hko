# SCORM-Export

Erzeugt aus einer Herausforderung ein SCORM-1.2-Paket, das in OLAT als eigener
Kursbaustein läuft und Punktestand und Antworten ans LMS zurückmeldet.

```bash
node scripts/build-scorm.mjs 3.2.1_wahre_kosten A
node scripts/build-scorm.mjs 3.2.1_wahre_kosten --all
node scripts/build-scorm.mjs --all --no-zip
```

Ausgabe: `scorm/generated/<slug>_hf_<X>/` plus `…​.zip` (gitignoriert, entsteht
jederzeit neu). Das ZIP ist das, was in OLAT hochgeladen wird —
`imsmanifest.xml` liegt auf oberster Ebene.

## Woher das kommt

Vorbild sind die beiden handgebauten Pakete von Pascal Rusch
(`_scorm-rusch/`, Mail vom 17.09.2026, Analyse in `_scorm-rusch/HERKUNFT.md`).
Übernommen sind seine Feedback-Architektur (formale Prüfung lokal +
inhaltliche Prüfung über den KI-Proxy, zusammengeführt in **einem** Feedback,
mit Rückfall auf die formale Liste), die SCORM-Anbindung und die druckbare
Leistungsdokumentation.

Der Unterschied: bei ihm standen Inhalt und Prüfregeln als Literale im `app.js`
und mussten pro Einheit von Hand geschrieben werden. Hier ist `app.js` eine
feste Engine plus ein eingesetztes `DATA`-Objekt, das aus
`herausforderung_<X>.json` abgeleitet wird.

## Was mitgenommen wird, das sein Template nicht kannte

Pascals Vorlage stammt aus `1.1.1_konflikt_kommunizieren`. Seither sind Felder
dazugekommen, die der Generator ausliest:

| Feld | Wirkung im Paket |
|---|---|
| `methoden[]` + `src/data/methoden/*.json` | eigene Sektion «Womit Sie das herstellen», 2×2-Raster, zwei Kartenarten (Lehrmittel / Methodenkarte) wie in `DocS.tsx` |
| `leitfragen[].scaffolding` | aufklappbare Hilfe je Leitfrage: Vorgehen, Aufbau, und Satzanfänge als Chips, die in das Textfeld einsetzen |
| `leitfragen[].liefert` bzw. `scaffolding.produkt` | «Das liefert»-Zeile auf jeder Karte — die Kette von der Leitfrage zum Handlungsprodukt |
| `leitfragen[].bloom` | Stufenangabe auf der Karte |
| `mehrdeutigkeit` | Callout in der Ausgangslage, ein formales Kriterium «Zielkonflikt benannt» — und ein Absatz im KI-Systemprompt, der ausdrücklich verbietet, die gewählte Position zu bewerten |
| `lernfortschritt.kriterien[]` | die KI-Rubrik des Handlungsprodukts |
| `dekontextualisierung.frage` | Transferaufgabe T1 im Selbstcheck |
| `handlungsprodukt.schritte[]` | «So gehen Sie vor» über den Abgabefeldern |
| `zahlen_tabelle` | Tabelle in der Ausgangslage + ein Kriterium «Bezug auf die Zahlen» |
| `quellen_anker[]` | Ressourcentabelle mit Kapitel und Seiten |
| `wochen_plan[]` | Fahrplan-Streifen |
| `sit_farbe` / `_light` / `_mid` | CSS-Variablen `--sit-akzent…` wie in `einheiten-renderer.css` |

## Die zwei Stellen, an denen Urteil nötig war

**1. Handlungsprodukte, die kein Text sind.** `handlungsprodukt.abgaben[]` ist
der Vertrag. Was eine Wortzahl nennt, wird getippt und geprüft; alles andere
(Bildstrecke, Preisschild, Aufnahme) entsteht ausserhalb und kann hier nur
bestätigt werden. Der Generator baut daraus zwei Posten: ein Textfeld mit
vollem Feedback und eine Selbstdeklaration, deren Punkte aus dem
`bewertungsraster`-Eintrag «Handlungsprodukt» stammen. Die Gewichtung des
Handlungsprodukts (40) teilt sich dann 30 / 10.

**2. Formale Prüfkriterien stehen nirgends in den Daten.** Abgeleitet wird nur,
was wirklich ableitbar ist:

- Wortzahl-Bänder aus den Wortangaben in `abgaben[]` (mit ±15 % Toleranz)
- Zeilen- und Umfangsprüfung bei Mindmap-Ästen
- Zahlenbezug aus `zahlen_tabelle`
- Zielkonflikt-Marker, wenn `mehrdeutigkeit.explizit`
- Stichwortprüfung aus den Labels von `loesung.zeilen[]` — aber nur, wenn die
  Labels Sachbegriffe sind. Einwortig, ziffernfrei, kein didaktisches Etikett
  («Erwartet», «Zweiter Fall», «Satz 1 — zeigt an»). Getroffen wird ab dem
  Wortstamm, damit «knapper» für «Knappheit» zählt.

Über den ganzen Korpus (30 Pakete, Stand 18.09.2026) ergibt das bei **56 von
120 Leitfragen** eine Stichwortprüfung; die übrigen 64 laufen mit Umfang + KI.
Das ist Absicht: ein erfundenes Stichwortkriterium misst Wortwahl statt
Verständnis. Der Generator meldet pro Posten, was er herleiten konnte.

Wer das erhöhen will, gibt den Generatoren-Skills ein explizites Feld mit —
das ist die saubere Lösung, nicht eine schlauere Heuristik.

## Bekannte Grenzen

- **`cmi.suspend_data` ist in SCORM 1.2 auf 4096 Zeichen begrenzt.** Eine
  vollständig ausgefüllte Einheit liegt bei rund 3100 Zeichen — es passt, aber
  knapp. Der Wrapper misst die Länge, schreibt zusätzlich immer in den
  `localStorage` des Geräts und blendet bei Überschreitung im Abschluss einen
  Hinweis ein. Ob OLAT mehr akzeptiert, ist noch nicht gemessen.
- **Der KI-Proxy gehört nicht uns.** `ki-chat-claude-pool-pama.vercel.app` ist
  Pascals zentral betriebener Proxy und laut seinem Code an den Aufruf aus
  `olat.bbw.ch` gebunden (sonst 403). Lokal und in jeder anderen Umgebung
  greift der Rückfall auf die formale Liste. Austauschbar über
  `HKO_SCORM_PROXY=…`. Zu klären: ob der Pool für weitere Einheiten frei ist —
  und die Datei `ANLEITUNG-KI-Baustein.md`, die sein Code zitiert und die uns
  nicht vorliegt.
- **Die KI-Rubriken stehen im Klartext im Paket** (F12 lesbar). Deshalb nur
  Stichpunkte aus `loesung.zeilen[]`, nie der Musterlösungstext — gleiche
  Entscheidung wie bei Pascal. `musterloesung.abschnitte` wandert allerdings in
  den `kontext` des Handlungsprodukt-Prompts; wenn das zu viel ist, gehört dort
  eine Kürzung hin.
- **Kein Webfont.** Das Paket läuft in einem LMS-iframe ohne garantierten
  Zugriff auf fonts.googleapis.com; IBM Plex wird genutzt, wenn vorhanden.
