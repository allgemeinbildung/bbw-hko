-- 010: HKO-Beitragsfelder + Zusatzmaterialien (Upload)
--
-- Erweitert `materials` um die "DNA"-Felder einer handlungskompetenz-
-- orientierten Einheit, damit eine LP-Eigeneinreichung dieselbe Struktur
-- traegt wie die fertigen Einheiten aus dem /einheiten-Katalog:
--   Kompetenzversprechen -> Handlungssituation (Leitfrage + Mehrdeutigkeit)
--   -> Kompetenznachweis (Format + Aufgabe + bi-dimensionale Kriterien).
-- Zusaetzlich: Datei-Upload (Zusatzmaterialien) via Supabase Storage.
--
-- Alle Spalten sind nullable bzw. defaulted -> bestehende Zeilen und der
-- Seed bleiben gueltig.

alter table public.materials
  -- Tier 1 — Verortung
  add column if not exists kompetenzversprechen text,
  -- Tier 2 — Handlungssituation
  add column if not exists leitfrage text,
  add column if not exists mehrdeutigkeit text,
  -- Tier 3 — Kompetenznachweis
  add column if not exists kn_format text,
  add column if not exists kn_aufgabe text,
  -- bi-dimensionale Kriterien: [{ "name": "...", "dimension": "SuK" | "Ges" }]
  add column if not exists bewertungskriterien jsonb not null default '[]',
  -- Tier 5 — optionale Anreicherung
  add column if not exists lehrmittel_anker text,
  add column if not exists didaktischer_kniff text,
  -- Zusatzmaterialien: [{ "name","path","size","type","uploaded_at" }]
  add column if not exists zusatzmaterialien jsonb not null default '[]';

-- Privater Storage-Bucket fuer hochgeladene Zusatzmaterialien.
-- Zugriff laeuft ausschliesslich serverseitig ueber den Service-Role-Client
-- (nach Besitz-/Rollenpruefung) + zeitlich begrenzte Signed URLs — der
-- Bucket ist daher bewusst nicht oeffentlich.
insert into storage.buckets (id, name, public)
values ('zusatzmaterialien', 'zusatzmaterialien', false)
on conflict (id) do nothing;
