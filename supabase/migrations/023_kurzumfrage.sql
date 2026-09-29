-- 023: Kurzumfrage «Hilft dir die Plattform?» (Entscheid KT 29.09.2026)
--
-- Einmal pro Semester, nach dem dritten Besuch an verschiedenen Tagen, fragt die
-- Plattform Lehrpersonen zwei Dinge: Hilft sie? Was könnte man verbessern?
--
-- Anonym: die Tabelle hat KEINE Personenspalte. Gespeichert werden nur die
-- Antwort, das Semester und die Rolle. Wer geantwortet hat, merkt sich der
-- Browser (localStorage), nicht die Datenbank — deshalb sind Doppelantworten
-- von verschiedenen Geräten möglich und werden in Kauf genommen.
--
-- Geschrieben wird ausschliesslich über /api/kurzumfrage mit dem
-- Service-Role-Client (keine insert-Policy); lesen darf nur KT1. Idempotent.

create table if not exists public.kurzumfrage (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  semester    text not null check (semester ~ '^[0-9]{4}-(HS|FS)$'),
  rolle       text not null check (rolle in ('lp', 'reviewer')),
  hilft       text not null check (hilft in ('ja', 'eher_ja', 'eher_nein', 'nein')),
  verbessern  text check (char_length(verbessern) <= 2000)
);

comment on table public.kurzumfrage is 'Anonyme Kurzumfrage (2 Fragen, 1× pro Semester). Keine Personenspalte. Schreiben nur via /api/kurzumfrage.';

create index if not exists kurzumfrage_semester_idx on public.kurzumfrage(semester, created_at desc);

alter table public.kurzumfrage enable row level security;

drop policy if exists kurzumfrage_select_kt1 on public.kurzumfrage;
create policy kurzumfrage_select_kt1 on public.kurzumfrage
  for select to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'kt1'));

notify pgrst, 'reload schema';
