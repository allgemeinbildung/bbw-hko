-- 030_fork_tokens.sql
-- Fork-Pilot «Meine Fassung»: Tokens und Fehlerart pro Bündel, für die Nutzungsseite
-- /admin/fassungen/nutzung und die Kostenschätzung (docs/fork/KOSTEN.md).
--
-- Ein Bündel umfasst den Hauptaufruf und bis zu zwei Korrekturrunden; die Zahlen sind die
-- Summe dieser Aufrufe, so wie OpenAI sie in `usage` meldet (`input_tokens`,
-- `input_tokens_details.cached_tokens`, `output_tokens`, `output_tokens_details.reasoning_tokens`).
-- Gespeichert wird nur die Zahl, nie ein Text. `fehler_art` ist die Kategorie aus
-- src/lib/fork/openai.ts (ModellFehler) bzw. `pruefung`, nie eine Meldung des Modells (F11).
--
-- RLS: Die Spalten gehören zu `einheit_fassung_buendel` und erben deren Policies aus 028
-- (lesen: eigene Zeilen bzw. kt1; `deny_gast`; keine insert/update-Policy). Geschrieben wird
-- nur über /api/fassungen/** mit dem Service-Role-Client.
-- Ohne diese Migration läuft alles weiter: Die Route lässt die Spalten dann weg, die Seite
-- zeigt «noch nicht erfasst».
-- Idempotent. Wird von Pietro angewendet, nicht automatisch.

alter table public.einheit_fassung_buendel add column if not exists tokens_eingabe  integer check (tokens_eingabe  >= 0);
alter table public.einheit_fassung_buendel add column if not exists tokens_gecacht  integer check (tokens_gecacht  >= 0);
alter table public.einheit_fassung_buendel add column if not exists tokens_ausgabe  integer check (tokens_ausgabe  >= 0);
alter table public.einheit_fassung_buendel add column if not exists tokens_denken   integer check (tokens_denken   >= 0);
alter table public.einheit_fassung_buendel add column if not exists modell_aufrufe  smallint check (modell_aufrufe >= 0);
alter table public.einheit_fassung_buendel add column if not exists fehler_art      text;

comment on column public.einheit_fassung_buendel.tokens_eingabe is 'Summe input_tokens über Hauptaufruf und Korrekturrunden (inkl. gecachter).';
comment on column public.einheit_fassung_buendel.tokens_gecacht is 'Davon gecacht (input_tokens_details.cached_tokens).';
comment on column public.einheit_fassung_buendel.tokens_ausgabe is 'Summe output_tokens (inkl. Denk-Tokens).';
comment on column public.einheit_fassung_buendel.tokens_denken  is 'Davon Denk-Tokens (output_tokens_details.reasoning_tokens).';
comment on column public.einheit_fassung_buendel.modell_aufrufe is 'Anzahl Modellaufrufe dieses Bündels, die OpenAI beantwortet hat.';
comment on column public.einheit_fassung_buendel.fehler_art     is 'Bei status=fehler: Kategorie (nicht_konfiguriert, zeitueberschreitung, abgelehnt, unvollstaendig, http, format, pruefung). Nie Modelltext.';

notify pgrst, 'reload schema';
