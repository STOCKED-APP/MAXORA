-- =====================================================================
-- MAXORA · database base (versioni 1, 2, 3)
-- =====================================================================
create extension if not exists pgcrypto;

-- ---------- TABELLE ---------------------------------------------------

create table public.admins (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.app_settings (
  key   text primary key,
  value jsonb not null
);

create table public.report_types (
  key          text primary key,
  icon         text not null,
  labels       jsonb not null,            -- {"es":..,"en":..,"it":..,"de":..}
  color        text not null default '#d9622b',
  duration_min int  not null,
  enabled      boolean not null default true,
  admin_only   boolean not null default false,
  is_police    boolean not null default false,
  sort         int  not null default 0
);

create table public.reports (
  id          uuid primary key default gen_random_uuid(),
  type        text not null references public.report_types(key) on update cascade,
  lat         double precision not null,
  lng         double precision not null,
  title       text,
  user_id     uuid default auth.uid(),
  source      text not null default 'user' check (source in ('user','admin','dgt')),
  official    boolean not null default false,
  external_id text unique,
  confirms    int not null default 0,
  denies      int not null default 0,
  created_at  timestamptz not null default now(),
  expires_at  timestamptz not null,
  removed_at  timestamptz,
  removed_by  uuid
);
create index reports_expires_idx on public.reports (expires_at);
create index reports_created_idx on public.reports (created_at);
create index reports_user_idx    on public.reports (user_id);

create table public.report_votes (
  report_id  uuid not null references public.reports(id) on delete cascade,
  user_id    uuid not null,
  still      boolean not null,
  created_at timestamptz not null default now(),
  primary key (report_id, user_id)
);

create table public.blocked_users (
  user_id    uuid primary key,
  reason     text,
  blocked_at timestamptz not null default now(),
  blocked_by uuid default auth.uid()
);

create table public.devices (
  user_id     uuid primary key,
  first_seen  timestamptz not null default now(),
  last_seen   timestamptz not null default now(),
  lang        text,
  platform    text,
  app_version text
);

create table public.broadcasts (
  id         uuid primary key default gen_random_uuid(),
  message    jsonb not null,               -- {"es":..,"en":..,"it":..,"de":..}
  level      text not null default 'info' check (level in ('info','warning','danger')),
  starts_at  timestamptz not null default now(),
  ends_at    timestamptz,
  active     boolean not null default true,
  created_at timestamptz not null default now(),
  created_by uuid default auth.uid()
);

create table public.admin_log (
  id         bigserial primary key,
  admin_id   uuid,
  action     text not null,
  entity     text not null,
  entity_id  text,
  details    jsonb,
  created_at timestamptz not null default now()
);
create index admin_log_created_idx on public.admin_log (created_at desc);

-- Versione 2: turismo e attività
create table public.places (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  category    text not null,               -- spiaggia, panorama, villaggio, natura...
  description jsonb not null default '{}',
  lat         double precision not null,
  lng         double precision not null,
  photos      text[] not null default '{}',
  featured    boolean not null default false,
  active      boolean not null default true,
  sort        int not null default 0,
  created_at  timestamptz not null default now()
);

create table public.businesses (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  category      text not null,             -- ristorante, surf, escursioni, noleggio...
  description   jsonb not null default '{}',
  lat           double precision not null,
  lng           double precision not null,
  address       text,
  phone         text,
  website       text,
  logo_url      text,
  photos        text[] not null default '{}',
  plan          text not null default 'free' check (plan in ('free','sponsor','premium')),
  sponsor_until date,
  active        boolean not null default true,
  created_at    timestamptz not null default now()
);

create table public.business_admin (           -- dati visibili solo all'admin
  business_id   uuid primary key references public.businesses(id) on delete cascade,
  contact_name  text,
  contact_email text,
  price_eur     numeric(10,2),
  notes         text
);

create table public.business_events (
  id          bigserial primary key,
  business_id uuid not null references public.businesses(id) on delete cascade,
  kind        text not null check (kind in ('view','click','call','web','directions')),
  user_id     uuid default auth.uid(),
  created_at  timestamptz not null default now()
);
create index business_events_idx on public.business_events (business_id, created_at);

create table public.import_runs (               -- stato importazione dati DGT
  id          bigserial primary key,
  source      text not null,
  started_at  timestamptz not null default now(),
  finished_at timestamptz,
  ok          boolean,
  items       int,
  error       text
);

-- Versione 3: notifiche push
create table public.push_tokens (
  token      text primary key,
  user_id    uuid not null default auth.uid(),
  platform   text,
  lang       text,
  zone_lat   double precision,
  zone_lng   double precision,
  updated_at timestamptz not null default now()
);

create table public.push_campaigns (
  id         uuid primary key default gen_random_uuid(),
  title      jsonb not null,
  body       jsonb not null,
  area       jsonb,                         -- null = tutti; {"lat","lng","radius_km"}
  status     text not null default 'draft' check (status in ('draft','sending','sent','failed')),
  recipients int,
  sent_at    timestamptz,
  created_at timestamptz not null default now(),
  created_by uuid default auth.uid()
);

-- ---------- DATI INIZIALI --------------------------------------------

insert into public.app_settings (key, value) values
  ('police_enabled',     'true'),
  ('maintenance',        'false'),
  ('police_grid_km',     '3'),
  ('police_radius_km',   '2.5'),
  ('deny_threshold',     '2'),
  ('confirm_extend_min', '15'),
  ('rate_limit',         '{"count":5,"minutes":10}'),
  ('bbox',               '{"min_lat":27.5,"max_lat":29.5,"min_lng":-18.5,"max_lng":-13.2}'),
  ('map_center',         '{"lat":28.40,"lng":-14.02,"zoom":8.6}');

insert into public.report_types (key, icon, labels, color, duration_min, admin_only, is_police, sort) values
  ('incidente',     '💥', '{"es":"Accidente","en":"Accident","it":"Incidente","de":"Unfall"}',                         '#e5484d',  60, false, false, 1),
  ('atasco',        '🚗', '{"es":"Atasco","en":"Traffic jam","it":"Traffico","de":"Stau"}',                             '#f76b15',  30, false, false, 2),
  ('peligro',       '⚠️', '{"es":"Peligro","en":"Hazard","it":"Pericolo","de":"Gefahr"}',                               '#ffb224',  60, false, false, 3),
  ('obras',         '🚧', '{"es":"Obras","en":"Roadworks","it":"Lavori","de":"Baustelle"}',                             '#ffb224', 240, false, false, 4),
  ('cortada',       '⛔', '{"es":"Carretera cortada","en":"Road closed","it":"Strada chiusa","de":"Straße gesperrt"}',  '#e5484d', 180, false, false, 5),
  ('animales',      '🐐', '{"es":"Animales en la vía","en":"Animals on road","it":"Animali in strada","de":"Tiere auf der Straße"}', '#8e8c99', 30, false, false, 6),
  ('arena',         '🏜️', '{"es":"Arena en la vía","en":"Sand on road","it":"Sabbia in strada","de":"Sand auf der Straße"}', '#c2a878', 120, false, false, 7),
  ('parking_lleno', '🅿️', '{"es":"Parking lleno","en":"Parking full","it":"Parcheggio pieno","de":"Parkplatz voll"}',   '#3e63dd',  45, false, false, 8),
  ('policia',       '👮', '{"es":"Presencia policial","en":"Police nearby","it":"Presenza polizia","de":"Polizei in der Nähe"}', '#1f6f8b', 20, false, true, 9),
  ('evento',        '🎉', '{"es":"Evento","en":"Event","it":"Evento","de":"Veranstaltung"}',                            '#8e4ec6', 180, true,  false, 10);

-- ---------- FUNZIONI DI SUPPORTO -------------------------------------

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

create or replace function public.setting(p_key text)
returns jsonb language sql stable security definer set search_path = public as $$
  select value from public.app_settings where key = p_key;
$$;

-- ---------- REGOLE SULLE SEGNALAZIONI --------------------------------

create or replace function public.reports_before_insert()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  t      public.report_types;
  b      jsonb;
  rl     jsonb;
  recent int;
  grid   double precision;
begin
  select * into t from public.report_types where key = new.type;
  if not found then raise exception 'Tipo non valido'; end if;

  -- Importazione automatica (DGT) con chiave di servizio
  if coalesce(auth.jwt() ->> 'role', '') = 'service_role' then
    if new.expires_at is null then
      new.expires_at := now() + make_interval(mins => t.duration_min);
    end if;
    return new;
  end if;

  -- Admin: avvisi ufficiali con durata libera
  if public.is_admin() then
    new.user_id    := auth.uid();
    new.source     := 'admin';
    new.confirms   := 0;
    new.denies     := 0;
    new.created_at := now();
    new.removed_at := null;
    if new.expires_at is null then
      new.expires_at := now() + make_interval(mins => t.duration_min);
    end if;
    return new;
  end if;

  -- Utenti normali
  if auth.uid() is null then raise exception 'Sessione mancante'; end if;
  if exists (select 1 from public.blocked_users where user_id = auth.uid()) then
    raise exception 'Utente bloccato';
  end if;
  if public.setting('maintenance') = 'true'::jsonb then raise exception 'In manutenzione'; end if;
  if not t.enabled or t.admin_only then raise exception 'Tipo non disponibile'; end if;
  if t.is_police and public.setting('police_enabled') is distinct from 'true'::jsonb then
    raise exception 'Funzione disattivata';
  end if;

  b := public.setting('bbox');
  if new.lat not between (b->>'min_lat')::float8 and (b->>'max_lat')::float8
     or new.lng not between (b->>'min_lng')::float8 and (b->>'max_lng')::float8 then
    raise exception 'Posizione fuori zona';
  end if;

  rl := public.setting('rate_limit');
  select count(*) into recent from public.reports
   where user_id = auth.uid()
     and created_at > now() - make_interval(mins => (rl->>'minutes')::int);
  if recent >= (rl->>'count')::int then
    raise exception 'Troppi avvisi, riprova più tardi';
  end if;

  -- Polizia: mai il punto esatto
  if t.is_police then
    grid := (public.setting('police_grid_km') #>> '{}')::float8 / 111.0;
    new.lat := round(new.lat / grid) * grid;
    new.lng := round(new.lng / grid) * grid;
  end if;

  new.user_id     := auth.uid();
  new.source      := 'user';
  new.official    := false;
  new.title       := null;
  new.external_id := null;
  new.confirms    := 0;
  new.denies      := 0;
  new.created_at  := now();
  new.removed_at  := null;
  new.removed_by  := null;
  new.expires_at  := now() + make_interval(mins => t.duration_min);
  return new;
end $$;

create trigger reports_before_insert
  before insert on public.reports
  for each row execute function public.reports_before_insert();

-- Voto "c'è ancora / non c'è più" (un voto per utente)
create or replace function public.vote_report(p_id uuid, p_still boolean)
returns text language plpgsql security definer set search_path = public as $$
declare
  r   public.reports;
  t   public.report_types;
  thr int;
  ext int;
begin
  if auth.uid() is null then raise exception 'Sessione mancante'; end if;
  if exists (select 1 from public.blocked_users where user_id = auth.uid()) then
    raise exception 'Utente bloccato';
  end if;

  select * into r from public.reports
   where id = p_id and expires_at > now() and removed_at is null;
  if not found then return 'expired'; end if;
  if r.user_id = auth.uid() then return 'own'; end if;

  insert into public.report_votes (report_id, user_id, still)
  values (p_id, auth.uid(), p_still)
  on conflict do nothing;
  if not found then return 'already'; end if;

  select * into t from public.report_types where key = r.type;
  thr := coalesce((public.setting('deny_threshold') #>> '{}')::int, 2);
  ext := coalesce((public.setting('confirm_extend_min') #>> '{}')::int, 15);

  if p_still then
    update public.reports
       set confirms   = confirms + 1,
           expires_at = least(
             expires_at + make_interval(mins => ext),
             now() + make_interval(mins => case when t.is_police then t.duration_min
                                                else greatest(t.duration_min, 240) end))
     where id = p_id;
  else
    update public.reports
       set denies     = denies + 1,
           expires_at = case when denies + 1 >= thr and denies + 1 > confirms
                             then now() else expires_at end
     where id = p_id;
  end if;
  return 'ok';
end $$;

-- Registrazione dispositivo (per statistiche e blocchi)
create or replace function public.touch_device(p_lang text default null, p_platform text default null, p_version text default null)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then return '{}'::jsonb; end if;
  insert into public.devices (user_id, lang, platform, app_version)
  values (auth.uid(), p_lang, p_platform, p_version)
  on conflict (user_id) do update
     set last_seen   = now(),
         lang        = coalesce(excluded.lang, public.devices.lang),
         platform    = coalesce(excluded.platform, public.devices.platform),
         app_version = coalesce(excluded.app_version, public.devices.app_version);
  return jsonb_build_object(
    'blocked', exists (select 1 from public.blocked_users where user_id = auth.uid()));
end $$;

-- Statistiche per la dashboard admin
create or replace function public.admin_stats(p_days int default 7)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare since timestamptz := now() - make_interval(days => p_days);
begin
  if not public.is_admin() then raise exception 'Non autorizzato'; end if;
  return jsonb_build_object(
    'active_now',    (select count(*) from reports where expires_at > now() and removed_at is null),
    'today',         (select count(*) from reports where created_at >= date_trunc('day', now() at time zone 'Atlantic/Canary') at time zone 'Atlantic/Canary'),
    'period_total',  (select count(*) from reports where created_at >= since),
    'disputed',      (select count(*) from reports where expires_at > now() and removed_at is null and denies > 0 and denies >= confirms),
    'devices_24h',   (select count(*) from devices where last_seen > now() - interval '24 hours'),
    'devices_7d',    (select count(*) from devices where last_seen > now() - interval '7 days'),
    'devices_total', (select count(*) from devices),
    'blocked',       (select count(*) from blocked_users),
    'by_type', (select coalesce(jsonb_object_agg(type, n), '{}'::jsonb)
                  from (select type, count(*) n from reports where created_at >= since group by type) s),
    'by_hour', (select coalesce(jsonb_object_agg(h, n), '{}'::jsonb)
                  from (select extract(hour from created_at at time zone 'Atlantic/Canary')::int h, count(*) n
                          from reports where created_at >= since group by 1) s),
    'by_day',  (select coalesce(jsonb_agg(jsonb_build_object('day', d, 'n', n) order by d), '[]'::jsonb)
                  from (select (created_at at time zone 'Atlantic/Canary')::date d, count(*) n
                          from reports where created_at >= since group by 1) s),
    'hot_zones', (select coalesce(jsonb_agg(z), '[]'::jsonb) from (
                    select jsonb_build_object('lat', round(lat::numeric, 2), 'lng', round(lng::numeric, 2), 'n', count(*)) z
                      from reports where created_at >= since
                     group by round(lat::numeric, 2), round(lng::numeric, 2)
                     order by count(*) desc limit 20) s)
  );
end $$;

-- Registro automatico delle azioni admin
create or replace function public.audit_admin()
returns trigger language plpgsql security definer set search_path = public as $$
declare rec jsonb;
begin
  if public.is_admin() then
    rec := case when tg_op = 'DELETE' then to_jsonb(old) else to_jsonb(new) end;
    insert into public.admin_log (admin_id, action, entity, entity_id, details)
    values (auth.uid(), lower(tg_op), tg_table_name,
            coalesce(rec->>'id', rec->>'key', rec->>'user_id', rec->>'business_id', rec->>'token'),
            jsonb_build_object(
              'old', case when tg_op <> 'INSERT' then to_jsonb(old) end,
              'new', case when tg_op <> 'DELETE' then to_jsonb(new) end));
  end if;
  return coalesce(new, old);
end $$;

do $$
declare t text;
begin
  foreach t in array array['app_settings','report_types','reports','blocked_users','broadcasts',
                           'places','businesses','business_admin','push_campaigns','admins']
  loop
    execute format('create trigger audit_%1$s after insert or update or delete on public.%1$s
                    for each row execute function public.audit_admin()', t);
  end loop;
end $$;

-- ---------- PERMESSI (RLS) -------------------------------------------

alter table public.admins          enable row level security;
alter table public.app_settings    enable row level security;
alter table public.report_types    enable row level security;
alter table public.reports         enable row level security;
alter table public.report_votes    enable row level security;
alter table public.blocked_users   enable row level security;
alter table public.devices         enable row level security;
alter table public.broadcasts      enable row level security;
alter table public.admin_log       enable row level security;
alter table public.places          enable row level security;
alter table public.businesses      enable row level security;
alter table public.business_admin  enable row level security;
alter table public.business_events enable row level security;
alter table public.import_runs     enable row level security;
alter table public.push_tokens     enable row level security;
alter table public.push_campaigns  enable row level security;

-- Admin: accesso totale a tutto
do $$
declare t text;
begin
  foreach t in array array['admins','app_settings','report_types','reports','report_votes','blocked_users',
                           'devices','broadcasts','admin_log','places','businesses','business_admin',
                           'business_events','import_runs','push_tokens','push_campaigns']
  loop
    execute format('create policy "admin totale" on public.%I for all to authenticated
                    using (public.is_admin()) with check (public.is_admin())', t);
  end loop;
end $$;

-- Pubblico
create policy "vedo me stesso" on public.admins
  for select to authenticated using (user_id = auth.uid());

create policy "leggi impostazioni" on public.app_settings
  for select to anon, authenticated using (true);

create policy "leggi tipi" on public.report_types
  for select to anon, authenticated using (true);

create policy "leggi avvisi attivi" on public.reports
  for select to anon, authenticated
  using (
    expires_at > now() and removed_at is null
    and (not exists (select 1 from public.report_types rt where rt.key = type and rt.is_police)
         or public.setting('police_enabled') = 'true'::jsonb)
  );

create policy "crea avvisi" on public.reports
  for insert to authenticated with check (true);   -- le regole vere sono nel trigger

create policy "leggi messaggi attivi" on public.broadcasts
  for select to anon, authenticated
  using (active and starts_at <= now() and (ends_at is null or ends_at > now()));

create policy "leggi posti" on public.places
  for select to anon, authenticated using (active);

create policy "leggi attività" on public.businesses
  for select to anon, authenticated using (active);

create policy "registra eventi attività" on public.business_events
  for insert to authenticated with check (user_id = auth.uid());

create policy "salva mio token" on public.push_tokens
  for insert to authenticated with check (user_id = auth.uid());
create policy "aggiorna mio token" on public.push_tokens
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

grant execute on function public.vote_report(uuid, boolean)   to authenticated;
grant execute on function public.touch_device(text, text, text) to authenticated;
grant execute on function public.admin_stats(int)            to authenticated;
grant execute on function public.is_admin()                  to anon, authenticated;

-- ---------- FOTO (storage) -------------------------------------------

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "admin carica foto" on storage.objects
  for insert to authenticated with check (bucket_id = 'media' and public.is_admin());
create policy "admin modifica foto" on storage.objects
  for update to authenticated using (bucket_id = 'media' and public.is_admin());
create policy "admin elimina foto" on storage.objects
  for delete to authenticated using (bucket_id = 'media' and public.is_admin());

-- ---------- TEMPO REALE ----------------------------------------------

alter publication supabase_realtime add table public.reports;
alter publication supabase_realtime add table public.broadcasts;
alter publication supabase_realtime add table public.app_settings;
alter publication supabase_realtime add table public.report_types;
