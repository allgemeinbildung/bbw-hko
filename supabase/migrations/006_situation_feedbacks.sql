-- 006: Situation-Feedbacks (Parallelsystem zum Situationen-Katalog)
--
-- Speichert Erfahrungsberichte der LPs zu den 60 Situationen aus
-- hko-deploy. Bewusst entkoppelt von `materials` — eine Lehrperson
-- kann ohne eigenes Material trotzdem Feedback geben.

create table if not exists public.feedbacks (
  id                  uuid primary key default gen_random_uuid(),
  situation_id        text not null,                                  -- z.B. "1.1.1_identitaet_lernorte_sit_A"
  lp_id               uuid not null references auth.users(id) on delete cascade,

  -- Kontext der Erprobung
  klasse              text,                                           -- z.B. "FaGe24a"
  lehrjahr            int,
  abteilung           text,
  getestet_am         date,
  dauer_lektionen     numeric(4,1),                                   -- z.B. 3.5

  -- Quantitative Bewertung (1-5 Skala, Likert)
  tauglichkeit        int check (tauglichkeit between 1 and 5),       -- "passt der Auftrag in den Unterricht"
  qualitaet           int check (qualitaet between 1 and 5),          -- "Qualität von Situation + Handlungsprodukt"
  schwierigkeit       int check (schwierigkeit between 1 and 5),      -- "Anspruch für die Lernenden"
  motivation          int check (motivation between 1 and 5),         -- "Engagement der Lernenden"
  weiterempfehlung    boolean,                                        -- "weiteren LP empfehlen"

  -- Qualitative Rückmeldung (offene Felder)
  was_funktionierte       text,
  was_nicht_funktionierte text,
  aenderungsvorschlaege   text,
  eigene_anpassungen      text,
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

create index if not exists feedbacks_situation_idx on public.feedbacks(situation_id);
create index if not exists feedbacks_lp_idx        on public.feedbacks(lp_id);
create index if not exists feedbacks_status_idx    on public.feedbacks(status);

-- updated_at trigger
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists feedbacks_touch on public.feedbacks;
create trigger feedbacks_touch
  before update on public.feedbacks
  for each row execute function public.touch_updated_at();

-- RLS: LP sieht/bearbeitet nur eigene Feedbacks; KT1 sieht alle.
alter table public.feedbacks enable row level security;

drop policy if exists feedbacks_lp_select on public.feedbacks;
create policy feedbacks_lp_select on public.feedbacks
  for select using (
    auth.uid() = lp_id
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('kt1','reviewer'))
  );

drop policy if exists feedbacks_lp_insert on public.feedbacks;
create policy feedbacks_lp_insert on public.feedbacks
  for insert with check (auth.uid() = lp_id);

drop policy if exists feedbacks_lp_update on public.feedbacks;
create policy feedbacks_lp_update on public.feedbacks
  for update using (
    (auth.uid() = lp_id and status in ('entwurf','eingereicht'))
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('kt1','reviewer'))
  );

drop policy if exists feedbacks_lp_delete on public.feedbacks;
create policy feedbacks_lp_delete on public.feedbacks
  for delete using (auth.uid() = lp_id and status = 'entwurf');
