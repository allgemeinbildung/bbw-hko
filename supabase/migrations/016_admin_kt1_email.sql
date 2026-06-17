-- 016_admin_kt1_email.sql
-- Adds a dedicated email/password admin account `admin@bbw-hko.ch` to the
-- auto-assigned KT1 emails. This gives KT1 a login that does NOT depend on
-- Microsoft SSO (useful for local testing against localhost, where the Azure
-- redirect bounces to the production Site URL, and as a durable break-glass
-- admin login). Mirrors 008/013: redefine handle_new_user (keeping the gast
-- branch from 013) + backfill any existing row. Idempotent.

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
declare
  v_role text := 'lp';
begin
  if new.email = any(array[
    'peter.huber@bbw.ch',
    'sarah.guadagnino@bbw.ch',
    'matthias.daeniker@bbw.ch',
    'pascal.rusch@bbw.ch',
    'tamara.piana@bbw.ch',
    'manuel.beck@bbw.ch',
    'christof.glaus@bbw.ch',
    'admin@bbw-hko.ch'
  ]) then
    v_role := 'kt1';
  elsif new.email = 'gast@bbw.ch' then
    v_role := 'gast';
  end if;

  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    v_role
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Backfill: if the admin account already exists, ensure it carries role 'kt1'.
update public.profiles
set role = 'kt1'
where id in (select id from auth.users where email = 'admin@bbw-hko.ch');
