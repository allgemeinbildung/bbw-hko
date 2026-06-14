-- 015: Jahresplan-Skopus (Lehrgang + Lehrjahr) — Mehrjahres-Planung
--
-- Bisher war ein gespeicherter Plan implizit "EFZ 3-jaehrig, 1. Lehrjahr,
-- Schuljahr 2025/26". Mit der Mehrjahres-Jahresplanung wird jeder Plan zu
-- einer *Scheibe* (lehrgang, lehrjahr, schuljahr): die Lehrperson fuehrt pro
-- Klasse und Lehrjahr eine eigene Plan-Instanz. Eine Kohorte (dieselbe Klasse
-- ueber mehrere Jahre) ist einfach eine Gruppe von Scheiben mit gleichem label.
--
--   lehrgang  : 'EFZ-3J' | 'EFZ-4J'   (Default 'EFZ-3J')
--   lehrjahr  : 1..4                   (Default 1)
--   schuljahr : Textlabel, existiert bereits aus Migration 011
--
-- Bestehende Zeilen werden auf EFZ-3J / 1. Lehrjahr / 2025/26 zurueckgesetzt
-- (das war der einzige bisher planbare Slice). Die Unique-Bedingung wandert von
-- (user_id, label) auf (user_id, lehrgang, lehrjahr, schuljahr, label), damit
-- dasselbe Klassen-Label in mehreren Lehrjahren existieren darf.
--
-- Idempotent. Reihenfolge: nach 011.

alter table public.jahresplanung_plans
  add column if not exists lehrgang text not null default 'EFZ-3J',
  add column if not exists lehrjahr smallint not null default 1;

-- Backfill schuljahr fuer Altzeilen (war in 011 nullable)
update public.jahresplanung_plans
set schuljahr = '2025/26'
where schuljahr is null or schuljahr = '';

-- Wertebereiche absichern (idempotent: erst droppen)
alter table public.jahresplanung_plans
  drop constraint if exists jahresplanung_plans_lehrgang_chk;
alter table public.jahresplanung_plans
  add constraint jahresplanung_plans_lehrgang_chk
  check (lehrgang in ('EFZ-3J', 'EFZ-4J', 'EBA'));

alter table public.jahresplanung_plans
  drop constraint if exists jahresplanung_plans_lehrjahr_chk;
alter table public.jahresplanung_plans
  add constraint jahresplanung_plans_lehrjahr_chk
  check (lehrjahr between 1 and 4);

-- Unique-Bedingung auf den vollen Slice erweitern
alter table public.jahresplanung_plans
  drop constraint if exists jahresplanung_plans_user_id_label_key;
alter table public.jahresplanung_plans
  drop constraint if exists jahresplanung_plans_scope_label_key;
alter table public.jahresplanung_plans
  add constraint jahresplanung_plans_scope_label_key
  unique (user_id, lehrgang, lehrjahr, schuljahr, label);

create index if not exists jahresplanung_plans_scope_idx
  on public.jahresplanung_plans(lehrgang, lehrjahr, schuljahr);

notify pgrst, 'reload schema';
