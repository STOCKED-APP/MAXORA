-- Maxora 007 — account facoltativo (preferenze sincronizzate) e note sui percorsi (pannello admin)
-- Già applicata sul progetto con execute_sql; qui per riferimento.
create table if not exists public.user_prefs (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.user_prefs enable row level security;
create policy user_prefs_select_own on public.user_prefs for select to authenticated using (user_id = (select auth.uid()));
create policy user_prefs_insert_own on public.user_prefs for insert to authenticated with check (user_id = (select auth.uid()) and pg_column_size(data) < 20000);
create policy user_prefs_update_own on public.user_prefs for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()) and pg_column_size(data) < 20000);
grant select, insert, update on public.user_prefs to authenticated;
insert into app_settings(key, value) values ('accounts_enabled', 'false'::jsonb) on conflict (key) do nothing;

create table if not exists public.route_notes (
  id uuid primary key default gen_random_uuid(),
  route_id text,
  sport text check (sport in ('bike','run')),
  kind text not null default 'warn' check (kind in ('info','warn','danger','water','closed')),
  lat double precision not null check (lat between 27.5 and 29.5),
  lng double precision not null check (lng between -15 and -13),
  text jsonb not null default '{}'::jsonb,
  active boolean not null default true,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  created_by uuid default auth.uid()
);
alter table public.route_notes enable row level security;
create policy route_notes_public_read on public.route_notes for select to anon, authenticated using (active and (expires_at is null or expires_at > now()));
create policy route_notes_admin_all on public.route_notes for all to authenticated using (public.is_admin()) with check (public.is_admin());
grant select on public.route_notes to anon, authenticated;
grant insert, update, delete on public.route_notes to authenticated;
create trigger route_notes_audit after insert or update or delete on public.route_notes for each row execute function public.audit_admin();
alter publication supabase_realtime add table public.route_notes;
