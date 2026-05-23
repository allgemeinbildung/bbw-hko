-- Migration 007: rename two Gesellschafts-Aspekte to match the 2026-01
-- Bildungsrat naming used in nrlp_3j.json / nrlp_4j.json.
--   "Identität & Sozialisation"             → "Identität und Sozialisation"
--   "Technologie und digitale Transformation"
--                                           → "Technologische und digitale Transformation"

update public.materials
set aspekte = array(
  select case a
    when 'Identität & Sozialisation'              then 'Identität und Sozialisation'
    when 'Technologie und digitale Transformation' then 'Technologische und digitale Transformation'
    else a
  end
  from unnest(aspekte) a
)
where aspekte && ARRAY[
  'Identität & Sozialisation',
  'Technologie und digitale Transformation'
];
