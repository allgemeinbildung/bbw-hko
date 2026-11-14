# Baustand Fork-Pilot — Übergabe an Pietro (14.11.2026)

Branch `fork-pilot`. Nicht gepusht, nicht deployt. Migration 028 ist im Live-Projekt
angewendet (auf Pietros ausdrückliche Erlaubnis, 14.11.2026). Rückkehr: `git switch main`
(Tag `vor-fork-pilot`).

## Tore (aus dem Brief)

| Tor | Ergebnis |
|---|---|
| `npm run build` | grün |
| `node --test scripts/check-eba.test.mjs scripts/fork/*.test.mjs` | 169/169 grün |
| `check-all` beider Gold-Einheiten | ROT wie vor dem Bau: nur `ERR_BELEGE_FEHLT` und `ERR_FAKTEN_FEHLT` (fehlende `_pruefung/1.1.1_lehrvertrag_orientieren_v42/{belege,fakten}.json`); auf Tag `vor-fork-pilot` identisch |
| Export + `messen-v42` (Original) | kein Überlauf; dateigleich zur Referenz vor Schritt 2 (`scripts/fork/vergleich-export.mjs`, 50 Dateien) |
| `scripts/fork/check-data-feld.mjs` | alle Marken gültig (Original und beide Fassungen); Positivliste Code = Vertrag (58 Nummern) |
| `OPENAI_API_KEY` | nur `src/lib/fork/openai.ts`, `.env.example`, Doku |
| Durchgang ohne Netz (`durchgang.test.mjs`) | alle vier Aufträge × EFZ/EBA bis zum Export, grün |
| Dev-Server ohne Anmeldung / gast / lp (Seed) | API 401 / 403 / 403; kein Umschalter, keine Fork-Prop |

## KT1-Durchgang im Dev-Server (14.11.2026, Modell `gpt-6-luna`)

| Einheit | Auftrag | Ergebnis |
|---|---|---|
| EFZ 1.3.1 | leitfrage_umformulieren | **über die Oberfläche**: markieren → Kommentar → abschicken → Vorschau im Heft (grün hinterlegt, Vermerk) → übernehmen → «Meine Fassung» → ZIP (neuer Text in Heft A, Vermerk, `HINWEIS-FASSUNG.txt`) |
| EFZ 1.3.1 | eigener_text | vollständig, 4 Ersetzungen + 1 Bestätigung, übernommen (`nur_spur` = ohne Medien) |
| EFZ 1.3.1 | situation_umformulieren | vollständig, 16 Ersetzungen, übernommen |
| EFZ 1.3.1 | handlungsprodukt_aendern | vollständig, 36 + 19 + 37 Ersetzungen (drei Runden, siehe Befunde) |
| EBA 1.1.1 | leitfrage_umformulieren | vollständig, 1 Ersetzung |
| EBA 1.1.1 | eigener_text | Heft 7 Ersetzungen + **neues Dossier** 5 Ersetzungen, vollständig |
| EBA 1.1.1 | situation_umformulieren | vollständig, 7 Ersetzungen + 9 Bestätigungen |
| EBA 1.1.1 | handlungsprodukt_aendern | vollständig, 30 Ersetzungen, **über die Oberfläche** übernommen; ZIP: neues Dossier, neue Leitfrage, Vermerk, Begleiter/KI-Toolbox weggelassen, keine Medien-Spur |

Export der echten Fassungen (`export-v42.mjs --fassung`): keine Seite läuft über (EFZ, EBA inkl. Dossier und Leseblatt), alle Marken gültig.

**Blinde Lesung** (Sonnet, als Lehrperson): EFZ und EBA je «einsetzbar mit kleinen Korrekturen».
- Behoben nach der ersten Lesung: Wochenplan (H7), Einleitung der Leitfragen (H9) und Leitfragen-Text (H10) ziehen beim Produktwechsel mit; Regeln gegen Reste des alten Falls/Produkts und für Bezüge auf den eigenen Text (F12). Danach steht in Heft A (EFZ) nur noch das gesperrte Schritt-Label «Karte einteilen».
- Bleibt, weil der Brief es sperrt: Schritt-Labels (Invariante 5) und Blockart des Beispielbilds nennen das alte Produkt.
- EBA: Das Dossier wird nur bei `eigener_text` neu gebaut; spätere Situations- oder Produktwechsel ziehen es nicht nach (Vertrag D1–D8). Dazu Fehler des Modells (Lohn 700 statt 650, Du-Anrede in einer Leitfrage).

## Befunde aus dem Durchgang, behoben

- **Budgets (F12):** Grenze je Feld in der Anfrage + eine Korrekturrunde für offene Pflichtfelder. Vorher war jeder grössere Auftrag «unvollständig».
- **Netz (F13):** Node-Verbindungsaufbau brauchte mehr als 250 ms pro Adresse; `openai.ts` setzt 2 s.
- **Modellname:** `gpt-6.1-luna` gibt es für den Key nicht; `.env` auf `gpt-6-luna` gesetzt (Pietros Wahl).

## Offene Punkte für dich

- **F11 Aufbewahrung bei OpenAI:** Hinweis sagt «nicht für Training, bis zu 30 Tage Missbrauchskontrolle». Stimmt der Wortlaut für dich und die Schule?
- **Schritt-Labels sperren** (Invariante 5) passt schlecht zu `handlungsprodukt_aendern`: «01 Karte einteilen» bleibt bei einem Plakat. Freigeben?
- **Dossier bei Situations-/Produktwechsel (EBA):** heute nur mit eigenem Text ersetzbar. Ausweiten?
- **Laufzeit 300 s gilt für alle Seiten** (eine SSR-Funktion). Alternative: `functionPerRoute`. Mit Korrekturrunde dauert ein Bündel bis ~2 × 110 s.
- **EBA-Auftragsbogen** hat kaum Reserve; nach Produktwechsel kann er überlaufen (die Vorschau warnt).
- **Word-Vermerk** steht in der Kopfzeile (`docx-*.ts` im Zaun). **Deck-Link** zeigt das Original. **Auftragsbogen-Titel (G1)** ohne Marke. **Entscheid ohne Transaktion.**
- Echte Word-/PDF-Dateien beim eigenen Text und `unpdf` auf Vercel sind nicht getestet (nur eingefügter Text).
- Die Testfassungen beider Gold-Einheiten stehen in deinem Konto; «Fassung löschen» in der Leiste entfernt sie.
