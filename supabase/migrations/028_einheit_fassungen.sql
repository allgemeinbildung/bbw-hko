-- 028_einheit_fassungen.sql
-- Fork-Pilot «Meine Fassung» (docs/ORCHESTRATION-fork.md, docs/fork/VERTRAG.md §8).
--
-- Eine Fassung ist eine Liste von Feld-Ersetzungen über den Rohdateien einer
-- v4.2-Einheit — nie eine Kopie (wie jahresplanung_plans über dem Basiskalender).
-- Eine Fassung pro Person und Einheit. Jedes abgeschickte Bündel (Kommentare +
-- Vorschlag des Modells + Entscheide pro Block) bleibt als Verlauf stehen;
-- KT1 verarbeitet die Anpassungen weiter (Hinweis steht in der Oberfläche).
--
-- Geschrieben wird ausschliesslich serverseitig über /api/fassungen/** mit dem
-- Service-Role-Client nach Eigentums- und Rollenprüfung — darum keine
-- insert/update/delete-Policies (Muster: 019_meldungen).
-- Hochgeladene Texte: nur der extrahierte Klartext im privaten Bucket
-- `fassung-texte` unter `{user_id}/{buendel_id}.txt`; die Originaldatei nicht.
-- Idempotent. Wird von Pietro angewendet, nicht automatisch.

create table if not exists public.einheit_fassungen (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.profiles(id) on delete cascade,
  einheit_id   text not null check (char_length(einheit_id) between 1 and 200),
  nur_spur     text check (nur_spur in ('ohne_medien', 'mit_medien')),
  ersetzungen  jsonb not null default '[]' check (jsonb_typeof(ersetzungen) = 'array'),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (user_id, einheit_id)
);

comment on table  public.einheit_fassungen is 'Fork-Pilot: eigene Fassung einer v4.2-Einheit als Liste von Ersetzungen (VERTRAG §1). Schreiben nur via Service-Role in /api/fassungen.';
comment on column public.einheit_fassungen.ersetzungen is 'Übernommene Ersetzungen {datei, pfad, wert, original_hash, auftrag, buendel_id}. Adressformat endgültig (Invariante 1).';
comment on column public.einheit_fassungen.nur_spur    is 'Gesetzt beim Auftrag eigener_text: die Fassung gilt nur in dieser Spur (Entscheid F6).';

create table if not exists public.einheit_fassung_buendel (
  id          uuid primary key default gen_random_uuid(),
  fassung_id  uuid not null references public.einheit_fassungen(id) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  heft        text not null check (heft in ('A', 'B', 'auftrag', 'dossier')),
  kommentare  jsonb not null default '[]' check (jsonb_typeof(kommentare) = 'array'),
  text_pfad   text,
  status      text not null default 'offen'
                check (status in ('offen', 'vorschlag', 'unvollstaendig', 'fehler', 'abgeschlossen')),
  vorschlag   jsonb,
  entscheide  jsonb not null default '{}' check (jsonb_typeof(entscheide) = 'object'),
  modell      text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table  public.einheit_fassung_buendel is 'Fork-Pilot: ein abgeschicktes Bündel von Kommentaren zu einem Heft, mit Vorschlag des Modells und Entscheid pro Block.';
comment on column public.einheit_fassung_buendel.vorschlag  is '{ersetzungen[], bestaetigt[], verworfen[], fehlend[], hinweis} — geprüft gegen die Positivliste.';
comment on column public.einheit_fassung_buendel.entscheide is '{pfad: angenommen|verworfen}, Schlüssel = "<datei>:<pfad>".';
comment on column public.einheit_fassung_buendel.text_pfad  is 'Pfad des Klartexts im privaten Bucket fassung-texte; nie die Originaldatei.';

create index if not exists einheit_fassungen_einheit_idx on public.einheit_fassungen(einheit_id);
create index if not exists einheit_fassung_buendel_f_idx on public.einheit_fassung_buendel(fassung_id, created_at);
-- Tagesgrenze der Modellaufrufe pro Person (FORK_MAX_AUFRUFE_PRO_TAG).
create index if not exists einheit_fassung_buendel_u_idx on public.einheit_fassung_buendel(user_id, created_at);

alter table public.einheit_fassungen       enable row level security;
alter table public.einheit_fassung_buendel enable row level security;

-- Lesen: eigene Fassung, KT1 alle.
drop policy if exists einheit_fassungen_select on public.einheit_fassungen;
create policy einheit_fassungen_select on public.einheit_fassungen
  for select to authenticated
  using (
    user_id = auth.uid()
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'kt1')
  );

drop policy if exists einheit_fassung_buendel_select on public.einheit_fassung_buendel;
create policy einheit_fassung_buendel_select on public.einheit_fassung_buendel
  for select to authenticated
  using (
    user_id = auth.uid()
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'kt1')
  );

-- Gastkonto wie in 013 grundsätzlich aussperren.
drop policy if exists deny_gast on public.einheit_fassungen;
create policy deny_gast on public.einheit_fassungen
  as restrictive for all to authenticated
  using (not public.is_gast()) with check (not public.is_gast());

drop policy if exists deny_gast on public.einheit_fassung_buendel;
create policy deny_gast on public.einheit_fassung_buendel
  as restrictive for all to authenticated
  using (not public.is_gast()) with check (not public.is_gast());

-- updated_at nachführen (touch_updated_at stammt aus 006).
drop trigger if exists einheit_fassungen_touch on public.einheit_fassungen;
create trigger einheit_fassungen_touch before update on public.einheit_fassungen
  for each row execute function public.touch_updated_at();

drop trigger if exists einheit_fassung_buendel_touch on public.einheit_fassung_buendel;
create trigger einheit_fassung_buendel_touch before update on public.einheit_fassung_buendel
  for each row execute function public.touch_updated_at();

-- Privater Bucket für die extrahierten Klartexte (kein public-Zugriff, keine
-- Storage-Policies: Lesen und Schreiben nur über den Service-Role-Client).
insert into storage.buckets (id, name, public)
values ('fassung-texte', 'fassung-texte', false)
on conflict (id) do nothing;

notify pgrst, 'reload schema';
