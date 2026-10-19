-- 024: Feedback zu Einheiten — Begründungen, Bewertungspositionen, Scaffolds
-- (Rückmeldung Christof, 19.10.2026)
--
-- Zahlen ohne Begründung helfen nicht, eine Einheit zu verbessern. Neu:
--   bewertung_kommentare            jsonb  { <bewertungsfeld>: "Warum …" } — optional je Bewertung
--   bewertungspositionen_feedback   text   welche Positionen genutzt, welche fehlten
--   scaffolds_feedback              text   welche Scaffolds eingesetzt, was fehlte
--
-- Rein additiv, alle Spalten nullable: bestehende Rückmeldungen bleiben unverändert.
-- MUSS vor dem Deploy des Codes angewendet sein, der die Felder schreibt
-- (api/einheit-feedbacks, lib/erfahrungen.ts). Idempotent.

alter table public.einheit_feedbacks
  add column if not exists bewertung_kommentare jsonb,
  add column if not exists bewertungspositionen_feedback text,
  add column if not exists scaffolds_feedback text;

notify pgrst, 'reload schema';
