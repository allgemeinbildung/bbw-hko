-- 014: Mehrere Kompetenzen pro eingereichtem Material
--
-- Das Intake-Formular (/einreichen) erlaubt neu die Auswahl mehrerer
-- Kompetenzen innerhalb eines Lebensbezugs. Bisher hielt `kompetenz_nr`
-- (text) nur eine einzige Kompetenz. Wir ergaenzen ein Array `kompetenz_nrs`
-- und behalten `kompetenz_nr` als "primaere" Kompetenz (erste Auswahl) fuer
-- Rueckwaertskompatibilitaet (Admin-Filter, KT2-Referenzlabel etc.).
--
-- Idempotent: add column if not exists + Backfill nur wo noch leer.

alter table public.materials
  add column if not exists kompetenz_nrs text[] not null default '{}';

-- Backfill: bestehende Einreichungen mit genau ihrer bisherigen Einzel-Kompetenz.
update public.materials
set kompetenz_nrs = array[kompetenz_nr]
where kompetenz_nr is not null
  and kompetenz_nr <> ''
  and (kompetenz_nrs is null or kompetenz_nrs = '{}');

-- PostgREST-Schema-Cache neu laden, damit die neue Spalte sofort sichtbar ist.
notify pgrst, 'reload schema';
