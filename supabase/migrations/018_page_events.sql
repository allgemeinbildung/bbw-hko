-- 018_page_events.sql
-- Eigenes, plattformunabhängiges Nutzungs-Tracking für bbw-hko.ch.
--
-- Warum eine eigene Tabelle statt eines externen Dienstes:
--   * Der Einheiten-ZIP wird komplett clientseitig gebaut (JSZip) — kein
--     Serverlog und kein externer Tracker sieht diesen Download je.
--   * Nur hier lässt sich die Nutzung mit der Rolle (lp / kt1 / gast / anon)
--     verknüpfen, ohne die Personendaten aus `profiles` zu exportieren.
--
-- Datensparsamkeit (bewusst): keine IP, kein User-Agent, keine Query-Strings.
--   `session_id` = Zufalls-ID im sessionStorage  → zählt Besuche.
--   `visitor_id` = Zufalls-ID im localStorage    → zählt wiederkehrende Geräte.
-- Beide sind pseudonym und für das Gastkonto der einzige Weg, mehrere Personen
-- hinter dem einen geteilten Login auseinanderzuhalten.
--
-- Geschrieben wird ausschliesslich serverseitig über /api/track mit dem
-- Service-Role-Client — es gibt deshalb absichtlich KEINE insert-Policy.

create table if not exists public.page_events (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  session_id  text not null,
  visitor_id  text,
  user_id     uuid references public.profiles(id) on delete set null,
  role        text not null default 'anon'
                check (role in ('anon', 'lp', 'kt1', 'reviewer', 'gast')),
  event       text not null default 'pageview'
                check (event in ('pageview', 'download', 'begleiter', 'feedback')),
  area        text not null default 'sonstiges',
  path        text not null,
  ref         text,
  referrer    text,
  meta        jsonb not null default '{}'
);

comment on table  public.page_events is 'Pseudonyme Nutzungsereignisse (Seitenaufrufe + Downloads). Schreibzugriff nur via Service-Role in /api/track.';
comment on column public.page_events.session_id is 'sessionStorage-Zufalls-ID — ein Besuch.';
comment on column public.page_events.visitor_id is 'localStorage-Zufalls-ID — ein wiederkehrendes Gerät.';
comment on column public.page_events.ref        is 'Normalisierte Ressource: Einheiten-Slug, Situations-ID, Thema-Nr.';

create index if not exists page_events_created_idx     on public.page_events(created_at desc);
create index if not exists page_events_area_ref_idx    on public.page_events(area, ref);
create index if not exists page_events_event_idx       on public.page_events(event);
create index if not exists page_events_session_idx     on public.page_events(session_id);

alter table public.page_events enable row level security;

-- Lesen dürfen nur KT1/Reviewer. Kein insert/update/delete für irgendeine
-- Rolle: das Gastkonto wird gezählt, darf die Zahlen aber nicht sehen, und
-- niemand kann seine eigenen Spuren nachträglich verändern.
drop policy if exists page_events_select_kt1 on public.page_events;
create policy page_events_select_kt1 on public.page_events
  for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('kt1', 'reviewer')
    )
  );

-- ── Auswertung ───────────────────────────────────────────────────────────────
-- Eine security-definer-Funktion statt vieler Einzel-Selects: die Aggregation
-- läuft in Postgres (kein PostgREST-Zeilenlimit, keine 100k Zeilen über die
-- Leitung) und der Rollencheck steht an genau einer Stelle.

-- Top-Ressourcen eines Bereichs (Aufrufe + Downloads pro Slug/ID).
create or replace function public.hko_usage_top(p_from timestamptz, p_area text, p_limit int)
returns jsonb
language sql
security definer
set search_path = public
as $$
  select coalesce(jsonb_agg(jsonb_build_object(
           'ref', ref, 'aufrufe', a, 'besuche', b, 'downloads', dl, 'zuletzt', z
         ) order by a desc, dl desc), '[]'::jsonb)
  from (
    select ref,
           count(*) filter (where event = 'pageview') as a,
           count(*) filter (where event = 'download') as dl,
           count(distinct session_id)                 as b,
           max(created_at)                            as z
    from page_events
    where created_at >= p_from and area = p_area and ref is not null
    group by ref
    order by count(*) filter (where event = 'pageview') desc,
             count(*) filter (where event = 'download') desc
    limit greatest(coalesce(p_limit, 20), 1)
  ) t;
$$;

create or replace function public.hko_usage_stats(p_days int default 30)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role text;
  v_from timestamptz := now() - make_interval(days => greatest(coalesce(p_days, 30), 1));
  v_out  jsonb;
begin
  select role into v_role from public.profiles where id = auth.uid();
  if v_role is null or v_role not in ('kt1', 'reviewer') then
    raise exception 'Nicht berechtigt.' using errcode = '42501';
  end if;

  select jsonb_build_object(
    'von',  v_from,
    'tage', greatest(coalesce(p_days, 30), 1),

    -- Kennzahlen im Zeitfenster
    'zeitraum', (
      select jsonb_build_object(
        'aufrufe',   count(*) filter (where event = 'pageview'),
        'besuche',   count(distinct session_id),
        'besucher',  count(distinct coalesce(visitor_id, session_id)),
        'downloads', count(*) filter (where event = 'download')
      )
      from page_events where created_at >= v_from
    ),

    -- Kennzahlen seit Messbeginn
    'gesamt', (
      select jsonb_build_object(
        'aufrufe',   count(*) filter (where event = 'pageview'),
        'besuche',   count(distinct session_id),
        'besucher',  count(distinct coalesce(visitor_id, session_id)),
        'downloads', count(*) filter (where event = 'download'),
        'seit',      min(created_at)
      )
      from page_events
    ),

    -- Tagesverlauf (lückenlos, damit der Balken-Verlauf keine Tage überspringt)
    'verlauf', (
      select coalesce(jsonb_agg(jsonb_build_object(
               'tag', d::date, 'aufrufe', a, 'besuche', b
             ) order by d), '[]'::jsonb)
      from (
        select d,
               count(e.id) filter (where e.event = 'pageview') as a,
               count(distinct e.session_id)                    as b
        from generate_series(v_from::date, now()::date, interval '1 day') d
        left join page_events e
               on e.created_at >= d and e.created_at < d + interval '1 day'
        group by d
      ) t
    ),

    'rollen', (
      select coalesce(jsonb_agg(jsonb_build_object(
               'rolle', role, 'aufrufe', a, 'besuche', b, 'besucher', v
             ) order by a desc), '[]'::jsonb)
      from (
        select role,
               count(*) filter (where event = 'pageview')      as a,
               count(distinct session_id)                      as b,
               count(distinct coalesce(visitor_id, session_id)) as v
        from page_events where created_at >= v_from group by role
      ) t
    ),

    'einheiten',   (select public.hko_usage_top(v_from, 'einheiten', 30)),
    'situationen', (select public.hko_usage_top(v_from, 'situationen', 20)),

    'bereiche', (
      select coalesce(jsonb_agg(jsonb_build_object(
               'bereich', area, 'aufrufe', a, 'besuche', b
             ) order by a desc), '[]'::jsonb)
      from (
        select area,
               count(*) filter (where event = 'pageview') as a,
               count(distinct session_id)                 as b
        from page_events where created_at >= v_from group by area
      ) t
    ),

    'seiten', (
      select coalesce(jsonb_agg(jsonb_build_object(
               'pfad', path, 'aufrufe', a, 'besuche', b
             ) order by a desc), '[]'::jsonb)
      from (
        select path,
               count(*) as a,
               count(distinct session_id) as b
        from page_events
        where created_at >= v_from and event = 'pageview'
        group by path order by count(*) desc limit 25
      ) t
    ),

    'herkunft', (
      select coalesce(jsonb_agg(jsonb_build_object(
               'quelle', referrer, 'besuche', b
             ) order by b desc), '[]'::jsonb)
      from (
        select referrer, count(distinct session_id) as b
        from page_events
        where created_at >= v_from and referrer is not null
        group by referrer order by count(distinct session_id) desc limit 15
      ) t
    )
  ) into v_out;

  return v_out;
end;
$$;

revoke all on function public.hko_usage_stats(int)                  from public, anon;
revoke all on function public.hko_usage_top(timestamptz, text, int) from public, anon;
grant execute on function public.hko_usage_stats(int) to authenticated;
-- hko_usage_top ist nur ein Helfer von hko_usage_stats (dort steht der
-- Rollencheck) und wird bewusst nicht an Clients vergeben.

notify pgrst, 'reload schema';
