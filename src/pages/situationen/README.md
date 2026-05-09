# Situationen-Katalog (Parallelsystem)

Pilot zur Umsetzung des Vorgehens nach der Sitzung mit M. Däniker (19.5.2026):
LPs erproben die 60 bestehenden Situationen aus `hko-deploy` und melden Erfahrungen
zurück. KT1 sammelt, sichtet und leitet an KT2 weiter.

Bewusst **parallel** zur bestehenden `materials`-Welt aufgebaut — nichts an
`/einreichen`, `/meine-materialien`, `/admin` ist verändert (ausser je einer
zusätzlichen Nav-Verknüpfung).

## Routen

| Pfad | Rolle | Zweck |
|---|---|---|
| `/situationen` | LP/KT1 | Katalog mit nRLP-Filtern |
| `/situationen/[id]` | LP/KT1 | Detail einer Situation + Feedback-CTA |
| `/situationen/[id]/feedback` | LP | Feedback-Formular (Likert + offene Felder) |
| `/situationen/admin` | KT1 | Liste aller Feedbacks, Sichtung, Weiterleitung |
| `POST /api/feedbacks` | LP | Neues Feedback (entwurf/eingereicht) |
| `PATCH /api/feedbacks/[id]` | LP/KT1 | LP bearbeitet eigenes; KT1 ändert Status/Kommentar |
| `DELETE /api/feedbacks/[id]` | LP | Eigenen Entwurf löschen |

## Datenfluss

```
hko-deploy/                                bbw-hko/
  public/missions-renderer/    → sync →     src/data/situationen/*.json
    public/data/*_sit_*.json                 src/data/situationen.index.json
                                                ↓
                                              /situationen/* (Astro pages)
                                                ↓
                                              feedbacks (Supabase, RLS)
```

## Lokaler Sync

```powershell
npm run sync:situationen
# Optional: explizite Quelle
node scripts/sync-situationen.mjs --source "D:/path/to/hko-deploy"
```

Standardquelle ist `<parent>/hko-deploy/public/missions-renderer/public/data/`.
Nach dem Sync zeigen sich Änderungen in `/situationen` automatisch beim nächsten
`npm run dev`/`build`.

## DB-Migration

`supabase/migrations/006_situation_feedbacks.sql` — noch **nicht** angewendet.
Vor dem Deploy:

1. Migration im Supabase-SQL-Editor laufen lassen (oder in `setup_full.sql` einfügen).
2. RLS-Policies prüfen.

## Was bewusst NICHT umgesetzt ist

- Themenzuweisung KT1 → LP (Entscheid offen, siehe Sitzungs-Traktanden).
- Vorlage Kompetenzraster — Slot vorhanden, später ergänzen.
- Export für KT2 (CSV) — kommt nach erstem Feedback-Lauf.
- "Eigenes Material aus Situation ableiten" (Verknüpfung `materials.based_on_situation_id`).
