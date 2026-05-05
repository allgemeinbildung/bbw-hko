# nrlp.json — Strukturdokumentation

Generiert aus `nrlp.md` via `parse_nrlp.py`.

---

## Wurzelstruktur

```json
{
  "meta": { ... },
  "zirkularitaet": { ... },
  "themen": [ ... ],
  "umsetzungsbeispiele": [ ... ]
}
```

---

## `meta`

Allgemeine Metadaten des Lehrplans.

```json
{
  "titel": "Schullehrplan ABU EFZ",
  "typ": "3-jährige Grundbildung",
  "kanton": "Zürich",
  "version": "ABU Reform 2030",
  "anzahl_themen": 7,
  "lehrjahre": 3,
  "hinweis": "..."
}
```

---

## `zirkularitaet`

Drei Tabellen zeigen, in welchen Themen ein Aspekt erstmals eingeführt (R1) bzw. vertieft wird (R2, R3, …).

```json
{
  "gesellschaftsinhalte": [ ... ],   // 8 Einträge
  "sprachmodi":           [ ... ],   // 9 Einträge
  "schluesselkompetenzen":[ ... ]    // 12 Einträge
}
```

Jeder Eintrag folgt diesem Schema:

```json
{
  "bezeichnung": "Recht",
  "beschreibung": "Kontinuierlich aufgebaut: Lehrvertrag (T1)…",  // nur bei Gesellschaftsinhalte
  "wiederholungen": {
    "T1": "R1",
    "T3": "R2",
    "T4": "R3"
  }
}
```

> `beschreibung` ist nur bei `gesellschaftsinhalte` vorhanden.  
> Themen ohne Behandlung erscheinen **nicht** im `wiederholungen`-Objekt.

---

## `themen`

Array mit 7 Themen. Je nach Ausarbeitungsstand gibt es zwei Varianten.

### Vollständig ausgearbeitete Themen (T1–T3)

```json
{
  "nr": 1,
  "titel": "Ins Berufsleben einsteigen",
  "lehrjahr": 1,
  "lektionen": 21,
  "vollstaendig": true,
  "leitidee": {
    "kurz": "Der Beginn meiner beruflichen Grundbildung…",
    "detail": "Ich setze mich mit den Inhalten meines Lehrvertrags…"
  },
  "sprachmodi": [
    "Rezeption schriftlich und bildlich",
    "Interaktion und Kollaboration mündlich"
  ],
  "schluesselkompetenzen": [
    "Sich selbst Ziele setzen…",
    "In unterschiedlichen Teams zielgerichtet arbeiten"
  ],
  "lebensbezuege": [ ... ]
}
```

#### `lebensbezuege`

```json
{
  "nr": "1.1",
  "text": "Ich finde mich in meiner Ausbildung zurecht…",
  "lektionen": 15,
  "kompetenzen": [ ... ]
}
```

#### `kompetenzen`

```json
{
  "nr": "1.1.1",
  "text": "Ich kann Informationen zu meiner Ausbildung… entnehmen.",
  "gesellschaftliche_inhalte": [
    { "aspekt": "Recht", "detail": "Lehrvertragsrecht, sozial akzeptable Lösungen" },
    { "aspekt": "Ethik", "detail": "Perspektivenübernahme, gegenseitiger Respekt" }
  ],
  "sprachmodi": [
    { "modus": "Rezeption schriftlich und bildlich", "detail": "Zentrale Aussagen aus Texten entnehmen…" }
  ]
}
```

### Skizzen (T4–T7)

```json
{
  "nr": 5,
  "titel": "Mich im Staat orientieren…",
  "lehrjahr": 2,
  "lektionen": null,
  "vollstaendig": false,
  "skizze": {
    "leitidee": "Wichtige Schritte auf dem Weg in ein selbstbestimmtes Leben…",
    "detail": "Ich lerne, wie ich eine Steuererklärung ausfülle…",
    "individuelle_lebensbezuege": [
      "Ich gehe selbstständig mit meinem Geld um…",
      "Ich kenne meine Rechte und Pflichten in der Gemeinschaft…"
    ]
  }
}
```

> Bei Skizzen fehlen `lebensbezuege`, `sprachmodi` und `schluesselkompetenzen` — diese Felder existieren im Objekt nicht.

---

## `umsetzungsbeispiele`

Konkrete Aufgabenszenarien (aktuell nur für T1, je Standard- und erweitertes Niveau).

```json
{
  "thema_nr": 1,
  "variante": "1.1",
  "niveau": "standard",          // oder "erweitert"
  "lebensbezug": "Ich finde mich in meiner Ausbildung zurecht…",
  "herausforderung": "Ich habe eine Unklarheit zu meinen Rechten…",
  "produkt": "Ich erstelle einen klar strukturierten Gesprächsleitfaden…",
  "sprachmodi": [
    { "modus": "Rezeption schriftlich und bildlich", "detail": "Informationen aus Lehrvertrag entnehmen…" }
  ],
  "scaffolds": [
    { "modus": "Interaktion und Kollaboration mündlich", "detail": "Gesprächsbausteine, Argumentstruktur" }
  ],
  "bewertungspositionen": {
    "sprache": [
      "Adressatengerechter Gesprächseinstieg mit klar formulierter Absicht",
      "Klar strukturierte Argumente mit logischem Aufbau"
    ],
    "gesellschaft": [
      "Nachvollziehbare Beschreibung des Falls auf Grundlage rechtlicher Grundlagen",
      "Präzise Angabe der passenden Informationsquelle"
    ]
  }
}
```

---

## Kurzreferenz Feldtypen

| Feld | Typ | Bemerkung |
|---|---|---|
| `nr` | `int` | Thema-Nummer 1–7 |
| `lektionen` | `int \| null` | `null` bei Skizzen |
| `vollstaendig` | `bool` | `false` → nur `skizze` vorhanden |
| `wiederholungen` | `object` | Keys `T1`–`T7`, Values `R1`–`R6` |
| `niveau` | `string` | `"standard"` oder `"erweitert"` |