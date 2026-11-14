# Baustand Fork-Pilot (laufend nachgeführt)

Referenz-Export vor Schritt 2: `%TEMP%\fork-referenz-vor-schritt2` (efz/eba, 50 Dateien).
Vergleich: `node scripts/fork/vergleich-export.mjs <referenz> <neu>` (ignoriert data-feld, docx-Zeitstempel, zufällige Hyperlink-IDs).

| Schritt | Stand |
|---|---|
| 1 Inventar + Vertrag | fertig, von Pietro freigegeben 14.11.2026 (`VERTRAG.md`, `ENTSCHEIDE.md` F1–F10) |
| 2 Kern | `adresse.ts`, `anwenden.ts`, `loadEinheit({fassung, fassungPruefer})` fertig, Tests grün, Export gleich. `positivliste.ts` bei Executor |
| 4 Marken | alle Renderer markiert (Seiten 1–8, Auftragsbogen, Lösungen, Dossier mit Prop `fork`, Beispielband). Offen: Workbench muss `fork={istV42}` an DocEbaDossier/DocLeseblatt geben; G1-Titel ohne Marke (SectionHead) |
| 5 Modell | `text.ts` (unpdf 2.1) fertig; `anfrage.ts` geschrieben (Orchestrator); `openai.ts` bei Executor |
| 3 Speicher | `supabase/migrations/028_einheit_fassungen.sql` geschrieben (nicht angewendet). API-Routen offen |
| 4 Markieren | `src/lib/fork/feld.ts` (Helfer fm/fmLf/fmSpur/fmSet/fmDossier). data-feld: seiten-1-4 fertig; seiten-5-8+DocS, Auftragsbogen+Lösungen, Dossier bei Workern. Kommentar-Oberfläche offen |
| 5 Modell | `text.ts` (unpdf) und `openai.ts` (Transport) bei Executor. `anfrage.ts` (Inhalt der Anfrage) schreibt der Orchestrator |
| 2b | `positivliste.ts` fertig (10 Tests), `openai.ts` fertig (10 Tests), `typen.ts` (Orchestrator: ForkProp, API-Formen, Hinweistexte) |
| laufend | Executor: `vorschlag.ts`; API `src/pages/api/fassungen/**` + `server.ts` + `ladeRohdateien`; Seite `[setKey].astro` + `seite.ts`; Workbench + `fork/ForkPanel.tsx` |
| 8–9 | Admin-Seite (nach API), Schlussprüfung |

Geplante Oberfläche (Orchestrator-Entscheid, noch nicht gebaut):
- `/einheiten/[setKey]?ansicht=original|fassung` und `?vorschau=<buendel_id>`; SSR wendet Fassung (+ Vorschlag) an und gibt der Workbench eine Prop `fork`.
- Vermerk «Angepasst, nicht von KT1 geprüft»: HTML per CSS an `.page-foot .foot-titel`, Word über die Kopfzeile (Abteilung), weil `docx-*.ts` im Zaun liegt.
- ZIP der Fassung: Begleiter und KI-Toolbox fallen bei Situations-/Textwechsel weg; KN bleibt, Hinweisdatei im ZIP.
