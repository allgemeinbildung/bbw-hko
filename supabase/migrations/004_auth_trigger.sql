-- Auto-create a profiles row for every new Supabase Auth user.
-- Role defaults to 'lp'; admins must be promoted manually via SQL.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    'lp'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Backfill: create profiles for users who registered before this trigger existed.
insert into public.profiles (id, full_name, role)
select id, coalesce(raw_user_meta_data->>'full_name', email), 'lp'
from auth.users
where id not in (select id from public.profiles)
on conflict (id) do nothing;
