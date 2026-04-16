-- Temporary: Allow anon read access for demo (remove after auth is set up)
create policy "Anon can read applications (temp demo)"
  on public.applications for select
  to anon
  using (true);

create policy "Anon can read customers (temp demo)"
  on public.customers for select
  to anon
  using (true);

create policy "Anon can read branches (temp demo)"
  on public.branches for select
  to anon
  using (true);

create policy "Anon can read activity_log (temp demo)"
  on public.activity_log for select
  to anon
  using (true);
