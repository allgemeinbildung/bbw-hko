-- 009: Einheit-Feedbacks (Workflow 3 — vollstaendige Unterrichtseinheiten)
--
-- Speichert Erfahrungsberichte der LPs zu kompletten Einheiten aus dem
-- /einheiten Katalog (Renderer + Begleiter). Bewusst eigene Tabelle, weil
-- der LP eine ganze Einheit (3 Situationen + KN + Begleiter) unterrichtet
-- — nicht eine einzelne Situation wie in `feedbacks`.

create table if not exists public.einheit_feedbacks (
  id                  uuid primary key default gen_random_uuid(),
  einheit_id          text not null,                                    -- z.B. "1.1.1_konflikt_kommunizieren"
  lp_id               uuid not null references auth.users(id) on delete cascade,

  -- Kontext der Erprobung
  klasse              text,
  lehrjahr            int,
  abteilung           text,
  getestet_von        date,
  getestet_bis        date,
  dauer_lektionen     numeric(4,1),

  -- Welche Komponenten der Einheit genutzt? (alle voreingestellt true)
  genutzt_sit_a       boolean not null default true,
  genutzt_sit_b       boolean not null default true,
  genutzt_sit_c       boolean not null default true,
  genutzt_kn          boolean not null default true,
  kn_typ_verwendet    text check (kn_typ_verwendet in ('fachgespraech','mini_case_schriftlich','werkschau_transfer', null)),

  -- Quantitative Bewertung (1-5)
  tauglichkeit        int check (tauglichkeit between 1 and 5),
  qualitaet           int check (qualitaet between 1 and 5),
  schwierigkeit       int check (schwierigkeit between 1 and 5),
  motivation          int check (motivation between 1 and 5),
  kn_validitaet       int check (kn_validitaet between 1 and 5),
  weiterempfehlung    boolean,

  -- Qualitative Rueckmeldung
  was_funktionierte       text,
  was_nicht_funktionierte text,
  aenderungsvorschlaege   text,
  eigene_anpassungen      text,
  begleiter_nuetzlich     text,
  anmerkungen             text,

  -- Workflow
  status              text not null default 'entwurf'
                      check (status in ('entwurf','eingereicht','gesichtet','weitergeleitet_kt2')),
  kt1_kommentar       text,
  reviewed_by         uuid references auth.users(id),
  reviewed_at         timestamptz,

  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists einheit_feedbacks_einheit_idx on public.einheit_feedbacks(einheit_id);
create index if not exists einheit_feedbacks_lp_idx      on public.einheit_feedbacks(lp_id);
create index if not exists einheit_feedbacks_status_idx  on public.einheit_feedbacks(status);

drop trigger if exists einheit_feedbacks_touch on public.einheit_feedbacks;
create trigger einheit_feedbacks_touch
  before update on public.einheit_feedbacks
  for each row execute function public.touch_updated_at();

alter table public.einheit_feedbacks enable row level security;

drop policy if exists einheit_feedbacks_select on public.einheit_feedbacks;
create policy einheit_feedbacks_select on public.einheit_feedbacks
  for select using (
    auth.uid() = lp_id
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('kt1','reviewer'))
  );

drop policy if exists einheit_feedbacks_insert on public.einheit_feedbacks;
create policy einheit_feedbacks_insert on public.einheit_feedbacks
  for insert with check (auth.uid() = lp_id);

drop policy if exists einheit_feedbacks_update on public.einheit_feedbacks;
create policy einheit_feedbacks_update on public.einheit_feedbacks
  for update using (
    (auth.uid() = lp_id and status in ('entwurf','eingereicht'))
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('kt1','reviewer'))
  );

drop policy if exists einheit_feedbacks_delete on public.einheit_feedbacks;
create policy einheit_feedbacks_delete on public.einheit_feedbacks
  for delete using (auth.uid() = lp_id and status = 'entwurf');
