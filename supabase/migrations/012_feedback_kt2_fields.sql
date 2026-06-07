-- 012: Feedback-Ausbau für den gemeinsamen Kompetenznachweis (KT2)
--
-- Erweitert feedbacks, einheit_feedbacks und legt material_feedbacks neu an.
-- Alle ALTER TABLE Statements sind idempotent (add column if not exists).
-- Neuer privater Storage-Bucket: feedback-uploads.

-- ── P1: Qualität aufsplitten + Niveau-Richtung ─────────────────────────────

alter table public.feedbacks
  add column if not exists qualitaet_situation        int check (qualitaet_situation between 1 and 5),
  add column if not exists qualitaet_handlungsprodukt int check (qualitaet_handlungsprodukt between 1 and 5),
  add column if not exists niveau_passung             text check (niveau_passung in ('zu_leicht','passend','zu_schwer')),
  add column if not exists noetiges_scaffolding       text;

alter table public.einheit_feedbacks
  add column if not exists qualitaet_situation        int check (qualitaet_situation between 1 and 5),
  add column if not exists qualitaet_handlungsprodukt int check (qualitaet_handlungsprodukt between 1 and 5),
  add column if not exists niveau_passung             text check (niveau_passung in ('zu_leicht','passend','zu_schwer')),
  add column if not exists noetiges_scaffolding       text;

-- ── P2: KN-Erfolg-Block (nur einheit_feedbacks) ───────────────────────────

alter table public.einheit_feedbacks
  add column if not exists kn_fairness        int check (kn_fairness between 1 and 5),
  add column if not exists kn_zeit_angemessen int check (kn_zeit_angemessen between 1 and 5),
  add column if not exists kn_raster_brauchbar int check (kn_raster_brauchbar between 1 and 5),
  add column if not exists kn_ergebnis        text check (kn_ergebnis in ('unter_50','50_75','75_90','ueber_90'));

-- ── P3: Taxonomie-Echo ─────────────────────────────────────────────────────

alter table public.feedbacks
  add column if not exists wirksame_sk      text[] not null default '{}',
  add column if not exists wirksame_aspekte text[] not null default '{}';

alter table public.einheit_feedbacks
  add column if not exists wirksame_sk      text[] not null default '{}',
  add column if not exists wirksame_aspekte text[] not null default '{}';

-- ── P4: Strukturierte Neue/angepasste Idee + Upload + Freigabe ────────────

alter table public.feedbacks
  add column if not exists neue_idee              boolean not null default false,
  add column if not exists idee_typ               text check (idee_typ in ('herausforderung','handlungsprodukt','kn_aufgabe')),
  add column if not exists idee_titel             text,
  add column if not exists idee_beschreibung      text,
  add column if not exists freigabe_gemeinsamer_kn boolean not null default false,
  add column if not exists idee_dateien           jsonb not null default '[]';

alter table public.einheit_feedbacks
  add column if not exists neue_idee              boolean not null default false,
  add column if not exists idee_typ               text check (idee_typ in ('herausforderung','handlungsprodukt','kn_aufgabe')),
  add column if not exists idee_titel             text,
  add column if not exists idee_beschreibung      text,
  add column if not exists freigabe_gemeinsamer_kn boolean not null default false,
  add column if not exists idee_dateien           jsonb not null default '[]';

-- Privater Storage-Bucket für Feedback-Uploads
insert into storage.buckets (id, name, public)
values ('feedback-uploads', 'feedback-uploads', false)
on conflict (id) do nothing;

-- ── P6: Erprobungs-Loop für eingereichte Materialien ──────────────────────

create table if not exists public.material_feedbacks (
  id                  uuid primary key default gen_random_uuid(),
  material_id         uuid not null references public.materials(id) on delete cascade,
  lp_id               uuid not null references auth.users(id) on delete cascade,

  -- Kontext der Erprobung
  klasse              text,
  lehrjahr            int,
  abteilung           text,
  getestet_am         date,
  dauer_lektionen     numeric(4,1),

  -- Quantitative Bewertung (1-5)
  tauglichkeit        int check (tauglichkeit between 1 and 5),
  qualitaet_situation        int check (qualitaet_situation between 1 and 5),
  qualitaet_handlungsprodukt int check (qualitaet_handlungsprodukt between 1 and 5),
  schwierigkeit       int check (schwierigkeit between 1 and 5),
  motivation          int check (motivation between 1 and 5),
  weiterempfehlung    boolean,

  -- Niveau
  niveau_passung      text check (niveau_passung in ('zu_leicht','passend','zu_schwer')),
  noetiges_scaffolding text,

  -- KN-Erfolg
  kn_fairness         int check (kn_fairness between 1 and 5),
  kn_zeit_angemessen  int check (kn_zeit_angemessen between 1 and 5),
  kn_raster_brauchbar int check (kn_raster_brauchbar between 1 and 5),
  kn_ergebnis         text check (kn_ergebnis in ('unter_50','50_75','75_90','ueber_90')),
  kn_validitaet       int check (kn_validitaet between 1 and 5),

  -- Taxonomie-Echo
  wirksame_sk         text[] not null default '{}',
  wirksame_aspekte    text[] not null default '{}',

  -- Qualitative Rückmeldung
  was_funktionierte       text,
  was_nicht_funktionierte text,
  aenderungsvorschlaege   text,
  eigene_anpassungen      text,
  anmerkungen             text,

  -- Neue Idee + Upload + Freigabe
  neue_idee               boolean not null default false,
  idee_typ                text check (idee_typ in ('herausforderung','handlungsprodukt','kn_aufgabe')),
  idee_titel              text,
  idee_beschreibung       text,
  freigabe_gemeinsamer_kn boolean not null default false,
  idee_dateien            jsonb not null default '[]',

  -- Workflow
  status              text not null default 'entwurf'
                      check (status in ('entwurf','eingereicht','gesichtet','weitergeleitet_kt2')),
  kt1_kommentar       text,
  reviewed_by         uuid references auth.users(id),
  reviewed_at         timestamptz,

  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists material_feedbacks_material_idx on public.material_feedbacks(material_id);
create index if not exists material_feedbacks_lp_idx       on public.material_feedbacks(lp_id);
create index if not exists material_feedbacks_status_idx   on public.material_feedbacks(status);

drop trigger if exists material_feedbacks_touch on public.material_feedbacks;
create trigger material_feedbacks_touch
  before update on public.material_feedbacks
  for each row execute function public.touch_updated_at();

alter table public.material_feedbacks enable row level security;

drop policy if exists material_feedbacks_select on public.material_feedbacks;
create policy material_feedbacks_select on public.material_feedbacks
  for select using (
    auth.uid() = lp_id
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('kt1','reviewer'))
  );

drop policy if exists material_feedbacks_insert on public.material_feedbacks;
create policy material_feedbacks_insert on public.material_feedbacks
  for insert with check (auth.uid() = lp_id);

drop policy if exists material_feedbacks_update on public.material_feedbacks;
create policy material_feedbacks_update on public.material_feedbacks
  for update using (
    (auth.uid() = lp_id and status in ('entwurf','eingereicht'))
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('kt1','reviewer'))
  );

drop policy if exists material_feedbacks_delete on public.material_feedbacks;
create policy material_feedbacks_delete on public.material_feedbacks
  for delete using (auth.uid() = lp_id and status = 'entwurf');
