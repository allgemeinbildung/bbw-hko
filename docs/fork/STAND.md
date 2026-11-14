# Baustand Fork-Pilot — Übergabe an Pietro (14.11.2026)

Branch `fork-pilot`, Commit «Fork-Pilot «Meine Fassung»: Vertrag, Kern, API, Oberfläche, Admin-Sicht».
Nicht gepusht, nicht deployt, Migration nicht angewendet. Rückkehr: `git switch main` (Tag `vor-fork-pilot`).

## Tore (aus dem Brief) — Stand bei Übergabe

| Tor | Ergebnis |
|---|---|
| `npm run build` | grün |
| `node --test scripts/check-eba.test.mjs scripts/fork/*.test.mjs` | 155/155 grün |
| `check-all` beider Gold-Einheiten | ROT wie vor dem Bau: nur `ERR_BELEGE_FEHLT` und `ERR_FAKTEN_FEHLT` (fehlende `_pruefung/1.1.1_lehrvertrag_orientieren_v42/{belege,fakten}.json`); auf Tag `vor-fork-pilot` identisch |
| Export + `messen-v42` | kein Überlauf; Export dateigleich zur Referenz vor Schritt 2 (`scripts/fork/vergleich-export.mjs`, 50 Dateien) |
| `scripts/fork/check-data-feld.mjs` | 159/159 (EFZ) und 146/146 (EBA) Marken gültig; Positivliste Code = Vertrag (58 Nummern) |
| `OPENAI_API_KEY` | nur `src/lib/fork/openai.ts`, `.env.example`, Doku |
| Dev-Server ohne Anmeldung / als gast / als lp (Seed) | API 401 / 403 / 403; kein Umschalter, keine Fork-Prop |

## Was du tun musst, damit der Pilot läuft

1. `supabase/migrations/028_einheit_fassungen.sql` im SQL-Editor anwenden (idempotent; legt auch den privaten Bucket `fassung-texte` an).
2. In `.env` (lokal) bzw. Vercel: `OPENAI_API_KEY`, `OPENAI_MODEL` (Modellname deiner Wahl), optional `FORK_MAX_AUFRUFE_PRO_TAG` (Vorgabe 20).
3. Dev-Server, als Admin anmelden, eine Gold-Einheit öffnen (`/einheiten/1.3.1_konsum_verantworten_v42`, `/einheiten/1.1.1_lehrvertrag_orientieren_v42`), «Markieren» in der Leiste über der Vorschau.

## Noch nicht belegt (braucht Schritt 1–3)

- Durchgang der vier Aufträge auf beiden Gold-Einheiten bis zum Download (Fertig-Kriterium des Briefs).
- Blinde Lesung der übernommenen Fassungen (stimmt das Heft, bleibt EBA auf A2).
- Echte Word-/PDF-Dateien beim eigenen Text; `unpdf` auf Vercel.

## Offene Punkte für dich

- **F11 Aufbewahrung bei OpenAI:** Der Hinweis in der Oberfläche sagt «nicht für Training, bis zu 30 Tage Missbrauchskontrolle» — nicht «nichts gespeichert». Stimmt der Wortlaut für dich und die Schule?
- **Laufzeit 300 s gilt für alle Seiten** (eine SSR-Funktion). Alternative: `functionPerRoute`.
- **Word-Vermerk** «Angepasst, nicht von KT1 geprüft» steht in der Kopfzeile statt in der Fusszeile, weil `docx-*.ts` im Zaun liegt. HTML: Fusszeile.
- **Deck-Link** in der Fassung zeigt das Original (die Präsentation kennt keine Fassung).
- **Auftragsbogen-Titel (G1)** hat keine Marke (`SectionHead` in `chrome.tsx`).
- **Entscheid ohne Transaktion:** scheitert der zweite Schreibschritt, bleibt das Bündel auf `vorschlag`, obwohl die Ersetzung schon gilt.
