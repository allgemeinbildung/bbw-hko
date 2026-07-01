-- 017: Entscheidungsbaum Feedback — feedback_art + eigenes-Material-Selbsteinschätzung
--
-- Die Feedback-Seite verzweigt neu in drei Fälle:
--   '1zu1'      — Einheit 1:1 übernommen (kein Upload)
--   'angepasst' — vorgegebene Einheit verändert (Standard-Feedback + Datei-Upload, Pflichtfeld «was angepasst»)
--   'eigenes'   — komplett eigenes Material (getrennter Einstieg, kein Einheit-Bezug, kurzer
--                 Selbsteinschätzungsbogen + PDF-Upload)
--
-- Für 'eigenes' hängt der Feedback-Eintrag an KEINER Einheit → einheit_id wird nullable.
-- Idempotent (add column if not exists / drop not null ist wiederholbar).

-- einheit_id darf für eigenes Material fehlen
alter table public.einheit_feedbacks
  alter column einheit_id drop not null;

-- Verzweigungs-Marker
alter table public.einheit_feedbacks
  add column if not exists feedback_art text not null default '1zu1'
    check (feedback_art in ('1zu1','angepasst','eigenes'));

-- Vereinfachter Selbsteinschätzungsbogen für eigenes Material
alter table public.einheit_feedbacks
  add column if not exists eigen_titel              text,
  add column if not exists eigen_handlungssituation text,
  add column if not exists eigen_handlungsprodukt   text,
  add column if not exists eigen_kn_format          text
    check (eigen_kn_format in ('fachgespraech','mini_case_schriftlich','werkschau_transfer','andere')),
  add column if not exists eigen_kn_aufgabe         text,
  add column if not exists eigen_selbstcheck        jsonb not null default '{}';

-- Sicherstellen, dass eigenes Material ohne einheit_id integritätskonform ist:
-- entweder einheit_id gesetzt ODER feedback_art = 'eigenes'
alter table public.einheit_feedbacks
  drop constraint if exists einheit_feedbacks_einheit_or_eigenes;
alter table public.einheit_feedbacks
  add constraint einheit_feedbacks_einheit_or_eigenes
    check (einheit_id is not null or feedback_art = 'eigenes');

create index if not exists einheit_feedbacks_art_idx on public.einheit_feedbacks(feedback_art);

notify pgrst, 'reload schema';
