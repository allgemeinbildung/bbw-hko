# Kosten «Meine Fassung» (Fork-Pilot)

Stand 15.11.2026. Laufende Zahlen: `/admin/fassungen/nutzung` (ab Migration 030 mit echten Tokens).
Preise im Code: `src/lib/fork/kosten.ts`.

## Kurz

| | USD | CHF |
|---|---|---|
| ein Bündel (Mittel inkl. Korrekturrunden) | ≈ 0.005 | ≈ 0.004 |
| teuerster einzelner Aufruf (32 000 Ausgabe-Tokens) | 0.017 | 0.014 |
| 10 KT1-Lehrpersonen, mittlere Nutzung, pro Monat | ≈ 2 | ≈ 1.60 |
| 80 Lehrpersonen, starke Nutzung, pro Monat | ≈ 60 | ≈ 49 |
| Höchstbetrag pro Tag (Grenze 100 Aufrufe, jeder maximal teuer) | 1.72 | 1.41 |

## Grundlagen

- **Modell:** keine Vorgabe im Code (F4), gewählt über `OPENAI_MODEL`. Lokal und in allen gespeicherten Bündeln: `gpt-6-luna`. Welcher Wert in Vercel steht, ist hier nicht geprüft.
- **Endpunkt:** Responses API `POST https://api.openai.com/v1/responses` (`src/lib/fork/openai.ts`), `store: false`, `max_output_tokens` 32 000, strukturierte Ausgabe (`json_schema`, strict). Kein `prompt_cache_key`.
- **Preise** (OpenAI, [developers.openai.com/api/docs/pricing](https://developers.openai.com/api/docs/pricing), abgefragt 15.11.2026, Standard-Tarif, bis 272 000 Eingabe-Tokens), USD pro 1 Mio. Tokens:

  | Modell | Eingabe | gecacht | Ausgabe |
  |---|---|---|---|
  | gpt-6-luna | 0.10 | 0.01 | 0.50 |
  | gpt-6.1-terra | 1.00 | 0.05 | 5.00 |
  | gpt-6-sol / gpt-6.1-sol | 2.00 | 0.20 / 0.10 | 10.00 |

  Ausgabe-Tokens enthalten die Denk-Tokens. Über 272 000 Eingabe-Tokens gilt ein Aufschlag; die Anfragen hier liegen weit darunter. Mit Datenresidenz kämen 10 % dazu (nicht eingerichtet).
- **Kurs:** 1 USD = 0.82 CHF (Mittelkurs Anfang November 2026, z. B. xe.com 06.11.2026: 0.8205; gerundet).
- **Grenzen** (DB `fork_einstellungen`, 15.11.2026): aktiv, `max_pro_tag_gesamt` 100 Modellaufrufe inkl. Dossier und Korrekturrunden, `max_pro_tag_person` leer → Umgebung `FORK_MAX_AUFRUFE_PRO_TAG` (Vorgabe 20 Bündel; lokal steht 60, Vercel nicht geprüft). Korrekturrunden zählen nur zur Gesamtgrenze.

## Tokens pro Aufruf

Gemessen: Länge der Anfrage, mit `baueAnfrage` für die beiden Gold-Einheiten gebaut, Kommentar je ein Satz, eigener Text 4 000 Zeichen. Ausgabe: Länge der Pflicht- und Zielfelder als JSON.

| Auftrag | Heft | Anfrage (Zeichen) | Ausgabe (Zeichen) |
|---|---|---|---|
| Leitfrage umformulieren | A | 25 000–34 000 | ≈ 300 |
| Leitfrage umformulieren | Auftrag | 12 000–15 000 | ≈ 300 |
| Eigenen Text verwenden | A | 30 000–39 000 | 7 000–8 000 |
| Situation umformulieren | A | 25 000–34 000 | 11 000–17 000 |
| Handlungsprodukt ändern | A | 26 000–35 000 | 13 000–15 000 |

Umrechnung (Annahme A1): **3.3 Zeichen pro Token** (deutscher Text in JSON-Form). Denk-Tokens (Annahme A2): **so viele wie sichtbare Ausgabe, mindestens 1 000**.

| Fall | Eingabe | Ausgabe inkl. Denken | USD |
|---|---|---|---|
| klein (Leitfrage) | 11 000 | 1 200 | 0.0017 |
| mittel (eigener Text) | 12 000 | 5 000 | 0.0037 |
| gross (Situation, Handlungsprodukt; EBA-Dossier gleich) | 11 000 | 12 000 | 0.0071 |
| Korrekturrunde | 11 500 | 2 000 | 0.0021 |
| Höchstfall (Ausgabe am Limit) | 12 000 | 32 000 | 0.0172 |

**Ein Bündel im Mittel** (Annahme A3: 40 % klein, 20 % mittel, 40 % gross, 0.3 Korrekturrunden pro Bündel): ≈ **USD 0.005**. Selbst bearbeiten kostet nichts (kein Modellaufruf).

## Pro Monat

Annahme A4: leicht 10, mittel 40, stark 150 Bündel pro Lehrperson und Monat (stark ≈ 20 an 7–8 Tagen).

| | leicht | mittel | stark |
|---|---|---|---|
| 1 Lehrperson | USD 0.05 / CHF 0.04 | USD 0.20 / CHF 0.16 | USD 0.75 / CHF 0.62 |
| 10 KT1-Lehrpersonen | USD 0.50 / CHF 0.41 | USD 2.00 / CHF 1.64 | USD 7.50 / CHF 6.15 |
| 80 ABU-Lehrpersonen | USD 4 / CHF 3.30 | USD 16 / CHF 13 | USD 60 / CHF 49 |

## Obergrenze

- **Pro Tag:** höchstens 100 Modellaufrufe. Realistisch (alle «gross») USD 0.71; jeder am Ausgabe-Limit USD 1.72 = **CHF 1.41**.
- **Pro Monat** (30 Tage voll ausgeschöpft): höchstens USD 52 = **CHF 42**. Bei 80 Lehrpersonen mit starker Nutzung reicht die Grenze von 100 nicht (≈ 150 Bündel × 80 / 22 Schultage ≈ 550 pro Tag) — dann müsste sie erhöht werden; die Kosten blieben mit gpt-6-luna unter CHF 50 im Monat.
- Ein anderes Modell verschiebt alles linear: gpt-6.1-terra ×10, gpt-6-sol ×20.

## Echte Zahlen

Bis 15.11.2026 sind 9 Modellaufrufe vermerkt (7 Bündel, 2 Korrekturrunden, eine Person). Tokens wurden bis dahin nicht gespeichert; `openai.ts` las `usage` zwar aus, die Route verwarf die Zahl. Mit **Migration `030_fork_tokens.sql`** speichert jedes Bündel die Summe aus Hauptaufruf und Korrekturrunden (Eingabe, davon gecacht, Ausgabe, davon Denken) und die Fehlerart. Danach Annahmen A1–A3 an `/admin/fassungen/nutzung` prüfen.

## Annahmen, offen

- **A1** 3.3 Zeichen pro Token — nicht mit dem Tokenizer gezählt.
- **A2** Denk-Tokens: Menge bei gpt-6-luna unbekannt; grösster Unsicherheitsfaktor (Ausgabe kostet das Fünffache der Eingabe).
- **A3** Mischung der Aufträge und Häufigkeit der Korrekturrunden.
- **A4** Nutzung pro Lehrperson — reine Annahme.
- Automatisches Prompt-Caching (gleicher Anfang ab 1 024 Tokens) würde bei Korrekturrunden die Eingabe verbilligen; nicht eingerechnet.
- Modell und Tagesgrenze in Vercel nicht geprüft.
