-- Migration 002: LP can delete own materials while status = 'eingereicht'
create policy "materials_delete_lp_own" on public.materials
  for delete using (
    auth.uid() = submitted_by and status = 'eingereicht'
  );
