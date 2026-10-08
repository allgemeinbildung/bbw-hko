# Laufordner — welcher Ordner gehört zu welcher Einheit

Stand 07.10.2026. Geprüft von `node scripts/check-namen.mjs`.

**Form seit 07.10.2026:** `<JJJJ-MM-TT>-<ordnername>[-<k>]` — der volle Ordnername der
Einheit, bei einem weiteren Lauf am selben Tag `-2`, `-3` (Regel:
`.claude/skills/bbw-hko-heft-v42/references/ableitungsregeln.md` §10). Eine
Einheit in neuer Form ordnet sich über ihren Namen selbst zu; sie muss hier nicht
stehen, steht aber zur Übersicht mit.

**Alte Form** `<JJJJ-MM-TT>-<Ziffern der Nummer>` (zum Beispiel `2026-10-03-221`) ist
nicht eindeutig: Zwei Einheiten mit der Nummer 2.2.1 unterscheiden sich dort nur
durchs Datum. Diese Ordner werden **nicht umbenannt** — Berichte und Commits
verweisen auf sie. Die Zuordnung steht nur hier. Ein Ordner, der in keiner der
beiden Formen steht und keinen `BERICHT.md` trägt, ist kein Lauf einer Einheit;
steht er hier mit «kein Einheiten-Lauf», ist das ausdrücklich so gewollt.

Die Spalte «Einheit» nennt den Ordner unter `src/data/einheiten/` (oder `—`).

| Laufordner | Einheit | Form | Anmerkung |
|---|---|---|---|
| `2026-10-03-121` | `1.2.1_lernzeit_planen` | alt | |
| `2026-10-03-211` | `2.1.1_informationen_hinterfragen` | alt | |
| `2026-10-03-221` | `2.2.1_meinungsfreiheit_reflektieren` | alt | zweite Einheit mit der Nummer 2.2.1 ist `2.2.1_ausgrenzung_analysieren` (`2026-10-04-221`) |
| `2026-10-03-231` | `2.3.1_anliegen_vertreten` | alt | |
| `2026-10-04-111` | `1.1.1_ausbildung_kommunizieren` | alt | |
| `2026-10-04-221` | `2.2.1_ausgrenzung_analysieren` | alt | nicht zu verwechseln mit `2026-10-03-221` |
| `2026-10-04-251` | `2.5.1_klimaveraenderung_diskutieren` | alt | |
| `2026-10-04-311` | `3.1.1_konsum_verantworten_3j` | alt | Anpassung der Gold-Einheit |
| `2026-10-04-321` | `3.2.1_konsumfolgen_beurteilen` | alt | |
| `2026-10-04-331` | `3.3.1_kaufvertrag_beurteilen` | alt | |
| `2026-10-04-411` | `4.1.1_wohlbefinden_staerken` | alt | |
| `2026-10-04-421` | `4.2.1_risiken_absichern` | alt | |
| `2026-10-05-131-gold` | `1.3.1_konsum_verantworten_v42` | alt | Nachtrag zur Gold-Einheit, kein eigener Lauf |
| `2026-10-05-241` | `2.4.1_haltung_zeigen` | alt | |
| `2026-10-06-4.3.1_vielfalt_untersuchen` | `4.3.1_vielfalt_untersuchen` | neu | |
| `2026-10-06-5.2.1_gesetze_veraendern` | `5.2.1_gesetze_veraendern` | neu | |
| `2026-10-07-umbau` | — | — | kein Einheiten-Lauf: Protokoll des Umbaus der Skill nach dem Rückblick |
| `2026-10-07-ki-toolbox-lehrjahr-1` | — | — | kein Einheiten-Lauf: KI-Toolbox (Skill `hko-ki-komplement`) für 14 Einheiten des 1. Lehrjahrs, E44 |
| `2026-10-08-ki-toolbox-lehrjahr-1-rest` | — | — | kein Einheiten-Lauf: KI-Toolbox für die letzten drei Einheiten des 1. Lehrjahrs (`3.2.1_konsumfolgen_beurteilen`, `3.3.1_kaufvertrag_beurteilen`, `3.2.1_wahre_kosten`) |
