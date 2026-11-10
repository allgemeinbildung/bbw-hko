-- 027: «Angesprochen» rückgängig machen
--
-- lp_ansprache bleibt ein Protokoll (es wird nichts gelöscht). Eine Rücknahme ist eine
-- weitere Zeile mit art = 'zurueckgenommen'; massgeblich ist die jüngste Zeile pro
-- Lehrperson. Idempotent.

do $$
declare c text;
begin
  for c in
    select conname from pg_constraint
    where conrelid = 'public.lp_ansprache'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) ilike '%nicht_erreichbar%'
  loop
    execute format('alter table public.lp_ansprache drop constraint %I', c);
  end loop;
  alter table public.lp_ansprache
    add constraint lp_ansprache_art_check
    check (art in ('angesprochen', 'nicht_erreichbar', 'zurueckgenommen'));
end $$;

notify pgrst, 'reload schema';
