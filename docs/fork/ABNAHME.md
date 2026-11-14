# Abnahme Fork-Pilot gegen `docs/ORCHESTRATION-fork.md` (14.11.2026)

Jede Zeile nennt den Punkt des Briefs und den Beleg aus dieser Session. Stand: Commit `d56e914` + diese Datei.

## Fertig-Kriterium (Brief, Mission)

| Teil | Beleg |
|---|---|
| KT1 spielt auf EFZ- **und** EBA-Einheit v4.2 alle vier Aufträge von der Markierung bis zum Download durch | EFZ `1.3.1_konsum_verantworten_v42`: leitfrage_umformulieren ganz über die Leiste (markieren → Kommentar → abschicken → Vorschau → übernehmen → ZIP geprüft); eigener_text, situation_umformulieren, handlungsprodukt_aendern mit echtem Modell vollständig übernommen, Schrittliste umbenannt. EBA `1.1.1_lehrvertrag_orientieren_v42`: leitfrage_umformulieren vollständig; frische Fassung situation → handlungsprodukt → eigener_text über die Leiste, je Heft + Dossier, ZIP geprüft (Dossier dabei, Vermerk, ohne Begleiter/KI/Medien-Spur). Belege: `docs/fork/STAND.md` |
| Tore grün | siehe unten, frisch gelaufen |
| Original rendert unverändert | `vergleich-export.mjs` gegen Referenz vor Schritt 2: «gleich: 50 Dateien» |

## Verification gates (Brief)

| Tor | Ergebnis |
|---|---|
| `npm run build` | exit 0 |
| `node --test scripts/check-eba.test.mjs scripts/fork/*.test.mjs` | 177 pass, 0 fail |
| `check-all` beider Gold-Einheiten | nur `ERR_BELEGE_FEHLT`, `ERR_FAKTEN_FEHLT` (fehlende `_pruefung/…/belege.json`, `fakten.json` der EBA-Gold) — auf Tag `vor-fork-pilot` identisch, also nicht vom Bau |
| `export-v42` EFZ + EBA | 53 Dateien geschrieben |
| `messen-v42` EFZ + EBA | 0 Überläufe |
| Positivliste Code = Vertrag | 60 = 60 (`check-data-feld.mjs`) |
| `data-feld` → Rohfeld | 162/162 (EFZ), 149/149 (EBA) |
| `git grep OPENAI_API_KEY` | nur `src/lib/fork/openai.ts`, `.env.example` (+ Doku) |
| lp / gast: kein Knopf, API 403 | Dev-Server: ohne Anmeldung 401, gast 403, lp (Seed) 403; kein Umschalter, keine Fork-Prop |

## Bauschritte (Brief, Suggested build order)

| Schritt | Beleg |
|---|---|
| 1 Inventar + Vertrag, Stopp für Pietro | sechs Sonnet-Lesungen; `VERTRAG.md`; Pietro «Freigegeben, weiter» |
| 2 Kern ohne Netz | `adresse.ts`, `positivliste.ts`, `anwenden.ts`, `loadEinheit({fassung})`, Tests |
| 3 Speicher | Migration 028 (auf Pietros Erlaubnis angewendet), `src/pages/api/fassungen/**` |
| 4 Markieren | `data-feld` in allen v4.2-Renderern, `ForkPanel.tsx` |
| 5 Modellaufruf | `anfrage.ts`, `openai.ts`, `vorschlag.ts`, `text.ts` (unpdf) |
| 6 Vorschau + Übernehmen | Vorschau im Heft, pro Block / alle übernehmen, Überlaufmessung in der Leiste |
| 7 Umschalter, Warnungen, Download | «Original \| Meine Fassung», Warnbanner, Vermerk (HTML Fusszeile, Word Kopfzeile), ZIP ohne unpassende Bausteine + `HINWEIS-FASSUNG.txt` |
| 8 Admin-Sicht | `src/pages/admin/fassungen.astro` |
| 9 Durchgang, blinde Lesung, Leck, Übergabe | Durchgang oben; blinde Lesung letzter Stand EFZ und EBA je «mit kleinen Korrekturen einsetzbar»; Leck-Durchsicht ohne Funde; Übergabe `HANDOFF-2026-11-14_fork-pilot-meine-fassung.md` |

## Was die blinde Lesung als «kleine Korrekturen» nennt

Inhaltliche Feinheiten der Modellvorschläge (einzelne Wortreste, Beispiel nah an der Lösung, Glossar-Feinheiten). Die Lehrperson sieht jeden Block in der Vorschau und übernimmt oder verwirft ihn einzeln — das ist der vorgesehene Weg (Brief, Mission). Kein Mangel der Funktion.

## Offen bei Pietro (Brief Invariante 16)

Push, Deploy, Vercel-Variablen (`OPENAI_API_KEY`, `OPENAI_MODEL`, `FORK_MAX_AUFRUFE_PRO_TAG`), Mitteilung an KT1.
