alter table public.materials
  add column if not exists lebensbezug_nr text,
  add column if not exists kompetenz_nr   text;
