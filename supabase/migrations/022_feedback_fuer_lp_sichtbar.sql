-- 022: Feedbacks zu Einheiten für Kolleg:innen lesbar — ohne Namen
-- (Entscheid KT 29.09.2026)
--
-- Lehrpersonen sehen auf der Detailseite einer Einheit die Rückmeldungen
-- anderer Lehrpersonen: Bewertungen und Freitext, aber nie Name, Klasse,
-- Abteilung oder Dateien. Nur KT1 sieht, wer was geschrieben hat.
--
-- Sichtbar wird nur, was die Person beim Absenden ausdrücklich freigibt
-- (Häkchen im Bogen, standardmässig gesetzt). Bestehende Rückmeldungen wurden
-- in der Annahme geschrieben, dass nur KT1 sie liest — sie bleiben verborgen
-- (default false), bis die Person sie selbst freigibt.
--
-- Gelesen wird serverseitig mit dem Service-Role-Client und einer festen
-- Spaltenliste (src/lib/erfahrungen.ts); an RLS ändert sich nichts. Idempotent.

alter table public.einheit_feedbacks
  add column if not exists fuer_lp_sichtbar boolean not null default false;

create index if not exists einheit_feedbacks_sichtbar_idx
  on public.einheit_feedbacks(einheit_id)
  where fuer_lp_sichtbar;

notify pgrst, 'reload schema';
