-- 029_fork_schalter.sql
-- Fork-Pilot «Meine Fassung»: Not-Aus, Tagesgrenzen und Löschfrist als Einstellung in der
-- Datenbank (Entscheid F16, docs/fork/ENTSCHEIDE.md). Wirkt sofort, ohne Deploy.
--
-- Bedienung (SQL-Editor im Supabase-Dashboard):
--   update public.fork_einstellungen set aktiv = false;              -- Not-Aus
--   update public.fork_einstellungen set max_pro_tag_gesamt = 0;     -- dasselbe über die Grenze
--   update public.fork_einstellungen set max_pro_tag_person = 10;    -- null = FORK_MAX_AUFRUFE_PRO_TAG
--   update public.fork_einstellungen set text_aufbewahrung_tage = 14;
--
-- Gezählt wird in `fork_aufrufe`, eine Zeile pro Modellaufruf (Bündel, Dossier,
-- Korrekturrunde). Die Reservierung prüft und schreibt unter einer Sperre in derselben
-- Transaktion — zwei gleichzeitige Anfragen können die Grenze nicht gemeinsam überschreiten.
-- Fehlt die Einstellungszeile, ist die Funktion aus (fail closed).
-- Idempotent. Wird von Pietro angewendet, nicht automatisch.

create table if not exists public.fork_einstellungen (
  id                      smallint primary key default 1 check (id = 1),
  aktiv                   boolean not null default true,
  max_pro_tag_person      integer check (max_pro_tag_person >= 0),
  max_pro_tag_gesamt      integer not null default 100 check (max_pro_tag_gesamt >= 0),
  text_aufbewahrung_tage  integer not null default 30 check (text_aufbewahrung_tage >= 1),
  updated_at              timestamptz not null default now()
);

comment on table  public.fork_einstellungen is 'Fork-Pilot: eine Zeile. aktiv=false schaltet neue Vorschläge sofort ab.';
comment on column public.fork_einstellungen.max_pro_tag_person     is 'Bündel pro Person und Tag (Europe/Zurich); null = Umgebungsvariable FORK_MAX_AUFRUFE_PRO_TAG.';
comment on column public.fork_einstellungen.max_pro_tag_gesamt     is 'Modellaufrufe aller Personen pro Tag, inkl. Dossier und Korrekturrunden; 0 = aus.';
comment on column public.fork_einstellungen.text_aufbewahrung_tage is 'Hochgeladene Klartexte (Bucket fassung-texte) werden nach so vielen Tagen gelöscht.';

insert into public.fork_einstellungen (id) values (1) on conflict (id) do nothing;

drop trigger if exists fork_einstellungen_touch on public.fork_einstellungen;
create trigger fork_einstellungen_touch before update on public.fork_einstellungen
  for each row execute function public.touch_updated_at();

create table if not exists public.fork_aufrufe (
  id          bigint generated always as identity primary key,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  art         text not null check (art in ('buendel', 'korrektur')),
  created_at  timestamptz not null default now()
);

comment on table public.fork_aufrufe is 'Fork-Pilot: ein Eintrag pro Modellaufruf, nur für die Tagesgrenzen. Kein Inhalt.';

create index if not exists fork_aufrufe_zeit_idx on public.fork_aufrufe(created_at);
create index if not exists fork_aufrufe_user_idx on public.fork_aufrufe(user_id, created_at);

-- Vermerk, dass ein hochgeladener Klartext nach der Frist gelöscht wurde.
alter table public.einheit_fassung_buendel add column if not exists text_geloescht_am timestamptz;

alter table public.fork_einstellungen enable row level security;
alter table public.fork_aufrufe       enable row level security;

-- Lesen nur KT1; geschrieben wird über die Funktion bzw. im SQL-Editor.
drop policy if exists fork_einstellungen_select on public.fork_einstellungen;
create policy fork_einstellungen_select on public.fork_einstellungen
  for select to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'kt1'));

drop policy if exists fork_aufrufe_select on public.fork_aufrufe;
create policy fork_aufrufe_select on public.fork_aufrufe
  for select to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'kt1'));

-- Prüft Schalter und Grenzen und vermerkt die Aufrufe — atomar.
-- Rückgabe: 'ok' | 'aus' | 'gesamt' | 'person'.
create or replace function public.fork_aufruf_reservieren(p_user uuid, p_anzahl integer, p_art text, p_max_person integer)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  e      public.fork_einstellungen;
  seit   timestamptz := date_trunc('day', now() at time zone 'Europe/Zurich') at time zone 'Europe/Zurich';
  n      integer;
  max_p  integer;
begin
  if p_anzahl < 1 or p_art not in ('buendel', 'korrektur') then
    raise exception 'ungültige Reservierung';
  end if;
  perform pg_advisory_xact_lock(hashtext('fork_aufrufe'));

  select * into e from public.fork_einstellungen where id = 1;
  if not found or not e.aktiv then
    return 'aus';
  end if;

  select count(*) into n from public.fork_aufrufe where created_at >= seit;
  if n + p_anzahl > e.max_pro_tag_gesamt then
    return 'gesamt';
  end if;

  -- Die Grenze pro Person zählt Bündel; Korrekturrunden zählen nur zur Gesamtgrenze.
  if p_art = 'buendel' then
    max_p := coalesce(e.max_pro_tag_person, p_max_person, 20);
    select count(*) into n from public.fork_aufrufe
      where user_id = p_user and art = 'buendel' and created_at >= seit;
    if n + p_anzahl > max_p then
      return 'person';
    end if;
  end if;

  insert into public.fork_aufrufe (user_id, art)
    select p_user, p_art from generate_series(1, p_anzahl);
  return 'ok';
end;
$$;

revoke all on function public.fork_aufruf_reservieren(uuid, integer, text, integer) from public, anon, authenticated;
grant execute on function public.fork_aufruf_reservieren(uuid, integer, text, integer) to service_role;

notify pgrst, 'reload schema';
