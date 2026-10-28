-- Maxora · punti d'interesse copiati da OpenStreetMap (vedi functions/sync-pois)
create extension if not exists pg_net;
create extension if not exists pg_cron;
create table public.pois (
  id text primary key, cat text not null, area text not null default 'fuerteventura',
  name text not null, lat double precision not null, lng double precision not null,
  tags jsonb not null default '{}', updated_at timestamptz not null default now()
);
create index pois_cat_idx on public.pois (cat);
create index pois_area_idx on public.pois (area, updated_at);
alter table public.pois enable row level security;
create policy "leggi pois" on public.pois for select to anon, authenticated using (true);
create policy "admin totale" on public.pois for all to authenticated using (public.is_admin()) with check (public.is_admin());
create table public.app_secrets (key text primary key, value text not null);
alter table public.app_secrets enable row level security;  -- nessuna regola: solo il server legge
insert into public.app_secrets (key, value) values ('cron_secret', encode(gen_random_bytes(24), 'hex'));
-- Pianificazione: ogni notte alle 04:17 UTC
-- select cron.schedule('maxora-sync-pois', '17 4 * * *', $$ select net.http_post(url := 'https://<progetto>.supabase.co/functions/v1/sync-pois', headers := jsonb_build_object('Content-Type','application/json','x-cron-secret',(select value from public.app_secrets where key='cron_secret')), body := '{}'::jsonb, timeout_milliseconds := 150000) $$);
