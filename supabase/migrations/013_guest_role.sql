-- 013_guest_role.sql
-- Adds a read-only "gast" role used by the shared guest account (GAST-BBW code).
-- A guest may browse the file-based Situationen/Einheiten/Jahresplanung catalogs
-- but must never write to, or read, any user-data table. Registration itself is
-- now invitation-only (enforced in the app via REGISTER_CODE), so the only new
-- accounts are code-holders and the shared guest account.

-- 1) Allow 'gast' in the profiles.role check constraint.
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles
  add constraint profiles_role_check check (role in ('lp', 'kt1', 'reviewer', 'gast'));

-- 2) New-user trigger: keep KT1 auto-assignment, add 'gast' for the guest email.
--    (The guest-login endpoint also sets this role explicitly; this is a backup.)
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
    'christof.glaus@bbw.ch'
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

-- Backfill: if the guest account already exists, ensure it carries role 'gast'.
update public.profiles
set role = 'gast'
where id in (select id from auth.users where email = 'gast@bbw.ch');

-- 3) Defense-in-depth: deny the guest account ANY access to user-data tables.
--    SECURITY DEFINER avoids RLS recursion when reading the caller's own role.
create or replace function public.is_gast()
returns boolean
language sql stable security definer set search_path = public
as $$
  select coalesce((select role = 'gast' from public.profiles where id = auth.uid()), false);
$$;

-- Restrictive policies combine with AND, so a guest is blocked regardless of the
-- permissive policies on each table. Non-guests evaluate to TRUE (no restriction).
drop policy if exists deny_gast on public.materials;
create policy deny_gast on public.materials
  as restrictive for all to authenticated
  using (not public.is_gast()) with check (not public.is_gast());

drop policy if exists deny_gast on public.feedbacks;
create policy deny_gast on public.feedbacks
  as restrictive for all to authenticated
  using (not public.is_gast()) with check (not public.is_gast());

drop policy if exists deny_gast on public.einheit_feedbacks;
create policy deny_gast on public.einheit_feedbacks
  as restrictive for all to authenticated
  using (not public.is_gast()) with check (not public.is_gast());

drop policy if exists deny_gast on public.material_feedbacks;
create policy deny_gast on public.material_feedbacks
  as restrictive for all to authenticated
  using (not public.is_gast()) with check (not public.is_gast());

drop policy if exists deny_gast on public.jahresplanung_plans;
create policy deny_gast on public.jahresplanung_plans
  as restrictive for all to authenticated
  using (not public.is_gast()) with check (not public.is_gast());
