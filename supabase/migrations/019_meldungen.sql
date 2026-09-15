-- 019_meldungen.sql
-- «Problem melden»: schnelle Rückmeldung zu Problemen und Frust mit der
-- Plattform selbst (Text + optionaler Screenshot), geführt als kleines
-- Ticketsystem mit Verlauf zwischen meldender Person und KT1.
--
-- Bewusst getrennt von den Feedback-Tabellen (006/009/017): dort geht es um
-- didaktische Rückmeldung zu Material, hier um die Bedienung der Plattform.
--
-- Anders als page_events (018) wird hier die URL inkl. Query-String und der
-- User-Agent gespeichert: eine Meldung stammt absichtlich von einer
-- angemeldeten Person, und ohne diesen Kontext lässt sich ein Fehler oft
-- nicht nachstellen.
--
-- Geschrieben wird ausschliesslich serverseitig über /api/meldungen/** mit dem
-- Service-Role-Client (Prüfung im Code) — deshalb keine insert/update-Policies.
-- Screenshots liegen im privaten Bucket `feedback-uploads` (012) unter
-- `meldungen/{lp_id}/{meldung_id}.{ext}`. Idempotent.

create table if not exists public.meldungen (
  id              uuid primary key default gen_random_uuid(),
  nr              bigint generated always as identity unique,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  lp_id           uuid not null references public.profiles(id) on delete cascade,
  rolle           text not null check (rolle in ('lp', 'kt1', 'reviewer')),
  text            text not null check (char_length(text) between 1 and 5000),
  url             text,
  viewport        text,
  user_agent      text,
  js_fehler       jsonb not null default '[]',
  screenshot_path text,
  status          text not null default 'neu'
                    check (status in ('neu', 'in_arbeit', 'erledigt')),
  wartet_auf      text not null default 'kt1'
                    check (wartet_auf in ('kt1', 'meldend')),
  lp_ungelesen    boolean not null default false
);

comment on table  public.meldungen is 'Tickets aus «Problem melden». Schreibzugriff nur via Service-Role in /api/meldungen.';
comment on column public.meldungen.nr           is 'Fortlaufende Ticketnummer für Mails und Gespräche (#12).';
comment on column public.meldungen.wartet_auf   is 'Wer ist am Zug — speist den KT1-Zähler (kt1 + nicht erledigt).';
comment on column public.meldungen.lp_ungelesen is 'KT1 hat geantwortet oder den Status geändert, die meldende Person hat es noch nicht geöffnet.';
comment on column public.meldungen.js_fehler    is 'Die letzten JS-Fehler im Browser vor dem Absenden (max. 5).';

create table if not exists public.meldung_antworten (
  id          uuid primary key default gen_random_uuid(),
  meldung_id  uuid not null references public.meldungen(id) on delete cascade,
  created_at  timestamptz not null default now(),
  autor_id    uuid references public.profiles(id) on delete set null,
  von         text not null check (von in ('meldend', 'kt1')),
  text        text not null check (char_length(text) between 1 and 5000)
);

create index if not exists meldungen_lp_idx         on public.meldungen(lp_id, created_at desc);
create index if not exists meldungen_offen_idx      on public.meldungen(status, wartet_auf);
create index if not exists meldung_antworten_m_idx  on public.meldung_antworten(meldung_id, created_at);

alter table public.meldungen         enable row level security;
alter table public.meldung_antworten enable row level security;

-- Lesen: eigene Meldungen, KT1 alle.
drop policy if exists meldungen_select on public.meldungen;
create policy meldungen_select on public.meldungen
  for select to authenticated
  using (
    lp_id = auth.uid()
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'kt1')
  );

-- Antworten erben die Sichtbarkeit ihrer Meldung (die Unterabfrage läuft
-- selbst unter der Policy oben).
drop policy if exists meldung_antworten_select on public.meldung_antworten;
create policy meldung_antworten_select on public.meldung_antworten
  for select to authenticated
  using (exists (select 1 from public.meldungen m where m.id = meldung_id));

-- Gastkonto wie in 013 grundsätzlich aussperren.
drop policy if exists deny_gast on public.meldungen;
create policy deny_gast on public.meldungen
  as restrictive for all to authenticated
  using (not public.is_gast()) with check (not public.is_gast());

drop policy if exists deny_gast on public.meldung_antworten;
create policy deny_gast on public.meldung_antworten
  as restrictive for all to authenticated
  using (not public.is_gast()) with check (not public.is_gast());

notify pgrst, 'reload schema';
