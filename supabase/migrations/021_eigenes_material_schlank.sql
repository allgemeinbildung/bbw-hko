-- 021: Ein schlankes Formular für eigenes Material (Entscheid KT 29.09.2026)
--
-- Bisher gab es zwei Masken für dieselbe Sache: /einreichen (HKO-Formular,
-- Tabelle `materials`) und /eigenes-material (schlanker Bogen, Tabelle
-- `einheit_feedbacks` mit feedback_art = 'eigenes'). Es bleibt der schlanke Bogen;
-- er bekommt die Verortung im Lehrplan, Links statt/neben Dateien und einen
-- aufklappbaren Block «Erweiterte Angaben». Alte `materials`-Zeilen bleiben
-- unverändert lesbar und bearbeitbar.
--
-- Ausserdem im Feedbackbogen zu Einheiten: KN-Typ «andere» mit Freitext.
-- Idempotent.

-- ── Verortung + Material-Links für eigenes Material ─────────────────────────
alter table public.einheit_feedbacks
  add column if not exists eigen_lehrgang            text
    check (eigen_lehrgang in ('EBA','EFZ-3J','EFZ-4J')),
  add column if not exists eigen_thema_nr            int,
  add column if not exists eigen_lebensbezug_nr      text,
  add column if not exists eigen_kompetenz_nrs       text[] not null default '{}',
  add column if not exists eigen_sprachmodus_primaer text,
  -- Links (OneNote, Teams, SCORM …) statt oder neben hochgeladenen Dateien:
  -- [{ url, titel }]
  add column if not exists eigen_links               jsonb not null default '[]',
  -- Aufklappbare Zusatzangaben, bewusst als ein JSONB-Feld:
  -- { kompetenzversprechen, schluesselkompetenzen[], aspekte[],
  --   sprachmodi_sekundaer[], bewertungskriterien[{name, dimension}],
  --   lehrmittel_anker, didaktischer_kniff }
  add column if not exists eigen_erweitert           jsonb not null default '{}';

-- ── KN-Typ «andere» im Einheiten-Feedback ──────────────────────────────────
-- Eine Anpassung kann einen anderen Produkttyp ergeben als die drei vorgesehenen.
alter table public.einheit_feedbacks
  drop constraint if exists einheit_feedbacks_kn_typ_verwendet_check;
alter table public.einheit_feedbacks
  add constraint einheit_feedbacks_kn_typ_verwendet_check
    check (kn_typ_verwendet is null
        or kn_typ_verwendet in ('fachgespraech','mini_case_schriftlich','werkschau_transfer','andere'));
alter table public.einheit_feedbacks
  add column if not exists kn_typ_anders text;

notify pgrst, 'reload schema';
