-- 020_vorschau_feedback.sql
-- Vorschau neuer Einheiten: Lehrpersonen sehen das Download-Bundle einer noch
-- nicht freigegebenen Einheit unter /vorschau/{setKey}/ und bewerten die neuen
-- Bausteine (Scaffolding, Methodenkarten, KI-Toolbox).
--
-- Eine Zeile pro Person und Einheit; erneutes Absenden überschreibt sie.
-- `bewertungen` = { "<baustein>": { "wert": "einsetzen"|"nicht" } }, Bausteine: scaffolding, methodenkarten, ki;
-- die gültigen Schlüssel stehen in src/lib/vorschau.ts.
--
-- Geschrieben wird ausschliesslich serverseitig über /api/vorschau-feedback mit
-- dem Service-Role-Client (Rollenprüfung im Code) — deshalb keine insert/update-Policies.
--
-- Die Bundle-Dateien liegen im privaten Bucket `vorschau` unter `{setKey}/…`;
-- ausgeliefert nur über /vorschau/** nach Login-Prüfung. Idempotent.

create table if not exists public.vorschau_feedback (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  einheit_id  text not null,
  lp_id       uuid not null references public.profiles(id) on delete cascade,
  rolle       text not null check (rolle in ('lp', 'kt1', 'reviewer')),
  bewertungen jsonb not null default '{}',
  kommentar   text check (char_length(kommentar) <= 2000),
  unique (einheit_id, lp_id)
);

comment on table public.vorschau_feedback is 'Rückmeldungen zu Einheiten-Vorschauen (/vorschau). Schreibzugriff nur via Service-Role in /api/vorschau-feedback.';

create index if not exists vorschau_feedback_einheit_idx on public.vorschau_feedback(einheit_id, updated_at desc);

alter table public.vorschau_feedback enable row level security;

-- Lesen: eigene Rückmeldung, KT1 alle.
drop policy if exists vorschau_feedback_select on public.vorschau_feedback;
create policy vorschau_feedback_select on public.vorschau_feedback
  for select to authenticated
  using (
    lp_id = auth.uid()
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'kt1')
  );

-- Privater Bucket für die Bundle-Dateien (keine Storage-Policies: Zugriff nur über die Service-Role).
insert into storage.buckets (id, name, public)
values ('vorschau', 'vorschau', false)
on conflict (id) do nothing;
