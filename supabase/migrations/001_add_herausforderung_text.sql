-- Herausforderungstext als eigenes Feld (war vorher im Titel versteckt)
-- Typ-Constraint anpassen: immer 'kompetenznachweis', da Herausforderung + KN ein Paar bilden

alter table public.materials
  add column if not exists herausforderung_text text;

-- Bestehende Materialien: typ auf 'kompetenznachweis' vereinheitlichen
update public.materials set typ = 'kompetenznachweis' where typ = 'herausforderung';

-- Constraint anpassen: typ kann jetzt wegfallen oder vereinfacht werden
alter table public.materials
  drop constraint if exists materials_typ_check;

alter table public.materials
  add constraint materials_typ_check
  check (typ in ('kompetenznachweis'));
