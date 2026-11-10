-- 026: Erfahrungen von Kolleg:innen — Namen nur mit Zustimmung, Stellungnahme von KT1
--
-- Entscheid KT1 10.11.2026: Rückmeldungen werden nicht mehr zwingend anonym gezeigt.
-- Bisherige Freigaben (fuer_lp_sichtbar, Migration 022) galten aber ausdrücklich «ohne
-- Namen». Darum ein eigenes Feld: Der Name erscheint nur, wenn namen_freigegeben = true,
-- und das setzt ein KT1-Mitglied erst, nachdem die Lehrperson zugestimmt hat.
--
-- kt1_stellungnahme / kt1_stellungnahme_text: kurze Antwort von KT1 unter der Rückmeldung
-- («wird aufgenommen», «nicht aufgenommen», «später»), sichtbar bei der Einheit.
--
-- Idempotent. RLS unverändert (Lesen für Lehrpersonen läuft serverseitig, erfahrungen.ts).

alter table public.einheit_feedbacks
  add column if not exists namen_freigegeben boolean not null default false,
  add column if not exists kt1_stellungnahme text,
  add column if not exists kt1_stellungnahme_text text;

do $$
begin
  if not exists (select 1 from pg_constraint
                 where conrelid = 'public.einheit_feedbacks'::regclass
                   and conname = 'einheit_feedbacks_kt1_stellungnahme_check') then
    alter table public.einheit_feedbacks
      add constraint einheit_feedbacks_kt1_stellungnahme_check
      check (kt1_stellungnahme is null or kt1_stellungnahme in ('aufgenommen', 'nicht_aufgenommen', 'spaeter'));
  end if;
  if not exists (select 1 from pg_constraint
                 where conrelid = 'public.einheit_feedbacks'::regclass
                   and conname = 'einheit_feedbacks_kt1_stellungnahme_text_check') then
    alter table public.einheit_feedbacks
      add constraint einheit_feedbacks_kt1_stellungnahme_text_check
      check (kt1_stellungnahme_text is null or char_length(kt1_stellungnahme_text) <= 500);
  end if;
end $$;

notify pgrst, 'reload schema';
