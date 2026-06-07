-- 011: Jahresplanung-Pläne (Feature 4/6/8 — anpassbarer Jahresplan pro Klasse)
--
-- Jede Lehrperson kann mehrere benannte Planungs-Instanzen ("26EFZ-A",
-- "26EFZ-B") für parallele Klassen führen. Die schulweite Basisvorlage lebt
-- weiterhin im Code (src/pages/jahresplanung.astro); hier werden nur die
-- Abweichungen + Zusatzdaten der einzelnen LP gespeichert:
--   • calendar_overrides — Delta zur Basis, keyed nach Wochen-Ordinal n
--       { "11": { "type": "teaching", "title": "…", "lb": "1.2" }, … }
--   • kn_plans — geplante Kompetenznachweise
--       [ { "id": "kn1", "label": "…", "week_n": 10, "format": "fachgespraech",
--           "notes": "…" }, … ]
--   • coverage — pro tatsächlich unterrichtetem Lebensbezug abgehakte
--       Schlüsselkompetenzen / Sprachmodi (Feature 8)
--       { "1.1": { "sk_done": ["Teamarbeit"], "sprachmodus_done": ["…"] }, … }
--
-- RLS: LP sieht/ändert nur eigene Pläne. kt1/reviewer dürfen alle Pläne LESEN
-- (für die Aggregat-Sicht /admin/jahresplanung), aber nicht schreiben.
--
-- Idempotent. touch_updated_at() stammt aus Migration 006.

create table if not exists public.jahresplanung_plans (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references public.profiles(id) on delete cascade,
  label               text not null default 'Standard',
  schuljahr           text,                                   -- z.B. "2025/26"
  calendar_overrides  jsonb not null default '{}'::jsonb,
  kn_plans            jsonb not null default '[]'::jsonb,
  coverage            jsonb not null default '{}'::jsonb,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  unique (user_id, label)
);

create index if not exists jahresplanung_plans_user_idx on public.jahresplanung_plans(user_id);

drop trigger if exists jahresplanung_plans_touch on public.jahresplanung_plans;
create trigger jahresplanung_plans_touch
  before update on public.jahresplanung_plans
  for each row execute function public.touch_updated_at();

alter table public.jahresplanung_plans enable row level security;

-- SELECT: eigene Pläne ODER kt1/reviewer (Aggregat-Sicht)
drop policy if exists jahresplanung_plans_select on public.jahresplanung_plans;
create policy jahresplanung_plans_select on public.jahresplanung_plans
  for select using (
    auth.uid() = user_id
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('kt1','reviewer'))
  );

-- INSERT/UPDATE/DELETE: ausschliesslich eigene Pläne
drop policy if exists jahresplanung_plans_insert on public.jahresplanung_plans;
create policy jahresplanung_plans_insert on public.jahresplanung_plans
  for insert with check (auth.uid() = user_id);

drop policy if exists jahresplanung_plans_update on public.jahresplanung_plans;
create policy jahresplanung_plans_update on public.jahresplanung_plans
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists jahresplanung_plans_delete on public.jahresplanung_plans;
create policy jahresplanung_plans_delete on public.jahresplanung_plans
  for delete using (auth.uid() = user_id);
