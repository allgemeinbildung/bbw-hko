-- Update the new-user trigger to auto-assign kt1 role for known admin emails.
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
    'manuel.beck@bbw.ch'
  ]) then
    v_role := 'kt1';
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

-- Elevate any of those accounts that already registered.
update public.profiles
set role = 'kt1'
where id in (
  select id from auth.users
  where email = any(array[
    'peter.huber@bbw.ch',
    'sarah.guadagnino@bbw.ch',
    'matthias.daeniker@bbw.ch',
    'pascal.rusch@bbw.ch',
    'tamara.piana@bbw.ch',
    'manuel.beck@bbw.ch'
  ])
);
