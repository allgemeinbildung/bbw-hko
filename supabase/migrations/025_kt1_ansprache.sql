-- 025: «Meine Abteilung» — Ansprache-Protokoll + Status «weitergeleitet_kt2» für Materialien
--
-- 1) lp_ansprache: Jedes KT1-Mitglied vermerkt, dass es eine Lehrperson der eigenen
--    Abteilung angesprochen hat (art='angesprochen') oder nicht erreichen konnte
--    (art='nicht_erreichbar', Notausgang). Erst danach schaltet /admin/meine-abteilung
--    «An KT2 weiterleiten» für deren Inhalte frei. Mehrere Zeilen pro Person erlaubt;
--    massgeblich ist die jüngste.
-- 2) materials.status darf auch 'weitergeleitet_kt2' tragen (Feedback-Tabellen kennen den Wert schon).
--
-- Idempotent. Lesen/Schreiben nur KT1 (und Reviewer lesen); Gast ausgeschlossen.

create table if not exists public.lp_ansprache (
  id          uuid primary key default gen_random_uuid(),
  lp_id       uuid not null references public.profiles(id) on delete cascade,
  kt1_id      uuid not null references public.profiles(id),
  art         text not null check (art in ('angesprochen', 'nicht_erreichbar')),
  notiz       text check (char_length(notiz) <= 1000),
  created_at  timestamptz not null default now()
);

create index if not exists lp_ansprache_lp_idx on public.lp_ansprache(lp_id, created_at desc);

alter table public.lp_ansprache enable row level security;

drop policy if exists lp_ansprache_select on public.lp_ansprache;
create policy lp_ansprache_select on public.lp_ansprache
  for select to authenticated
  using (exists (select 1 from public.profiles p
                 where p.id = auth.uid() and p.role in ('kt1', 'reviewer')));

drop policy if exists lp_ansprache_insert on public.lp_ansprache;
create policy lp_ansprache_insert on public.lp_ansprache
  for insert to authenticated
  with check (kt1_id = auth.uid()
              and exists (select 1 from public.profiles p
                          where p.id = auth.uid() and p.role = 'kt1'));

drop policy if exists deny_gast on public.lp_ansprache;
create policy deny_gast on public.lp_ansprache
  as restrictive for all to authenticated
  using (not public.is_gast()) with check (not public.is_gast());

-- materials.status um 'weitergeleitet_kt2' erweitern (Name der Check-Constraint nicht annehmen).
do $$
declare c text;
begin
  for c in
    select conname from pg_constraint
    where conrelid = 'public.materials'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) ilike '%revision_noetig%'
  loop
    execute format('alter table public.materials drop constraint %I', c);
  end loop;
  alter table public.materials
    add constraint materials_status_check
    check (status in ('eingereicht', 'gesichtet', 'freigegeben', 'revision_noetig', 'weitergeleitet_kt2'));
end $$;

notify pgrst, 'reload schema';
