-- Profiles (erweitert auth.users)
create table public.profiles (
  id uuid references auth.users primary key,
  full_name text not null,
  abteilung text,
  role text not null default 'lp' check (role in ('lp', 'kt1', 'reviewer')),
  created_at timestamptz default now()
);

-- Materials
create table public.materials (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  submitted_by uuid references public.profiles not null,

  -- Block A: Identifikation
  typ text not null check (typ in ('herausforderung', 'kompetenznachweis')),
  lehrdauer text not null check (lehrdauer in ('EBA', 'EFZ-3J', 'EFZ-4J')),
  lehrjahr int not null check (lehrjahr between 1 and 4),
  thema_nr int not null,
  thema_titel text not null,
  titel text not null,
  abteilung text,

  -- Block B: nRLP-Taxonomie
  schluesselkompetenzen text[] not null default '{}',
  aspekte text[] not null default '{}',
  sprachmodus_primaer text not null,
  sprachmodi_sekundaer text[] not null default '{}',

  -- Block C: Handlungsprodukt
  handlungsprodukt_typ text not null check (
    handlungsprodukt_typ in ('schriftlich', 'mündlich', 'multimedial', 'mischform')
  ),
  handlungsprodukt_beschreibung text not null,
  beurteilungsraster boolean not null default false,
  datei_name text,

  -- Block D: Selbstcheck
  selbstcheck jsonb not null default '{}',

  -- KT1 Workflow
  status text not null default 'eingereicht' check (
    status in ('eingereicht', 'gesichtet', 'freigegeben', 'revision_noetig')
  ),
  kt1_kommentar text,
  reviewed_by uuid references public.profiles,
  reviewed_at timestamptz
);

-- Trigger: updated_at automatisch setzen
create or replace function update_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create trigger materials_updated_at
  before update on public.materials
  for each row execute function update_updated_at();

-- ── Row-Level Security ──────────────────────────────────────────────────────

alter table public.profiles enable row level security;
alter table public.materials enable row level security;

-- Profiles
create policy "profiles_select_all" on public.profiles
  for select using (true);
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- Materials: LP sieht nur eigene, KT1 sieht alle
create policy "materials_insert_lp" on public.materials
  for insert with check (auth.uid() = submitted_by);

create policy "materials_select" on public.materials
  for select using (
    auth.uid() = submitted_by
    or exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('kt1', 'reviewer')
    )
  );

-- LP kann eigene bearbeiten (nur wenn Status = 'eingereicht')
create policy "materials_update_lp_own" on public.materials
  for update using (
    auth.uid() = submitted_by and status = 'eingereicht'
  );

-- KT1 kann alles updaten (Status, Kommentar)
create policy "materials_update_kt1" on public.materials
  for update using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'kt1'
    )
  );
