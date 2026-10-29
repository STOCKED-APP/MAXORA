-- Maxora — modalità surf: spot modificabili dall'admin e segnalazioni "com'è adesso"

create table if not exists public.surf_spots (
  id         text primary key,
  data       jsonb not null,               -- nome, posizione, orientamento, finestre (vedi data/surf_spots.json)
  active     boolean not null default true,
  sort       int not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.surf_reports (
  id         uuid primary key default gen_random_uuid(),
  spot_id    text not null references public.surf_spots(id) on delete cascade,
  user_id    uuid default auth.uid(),
  size       smallint not null check (size between 0 and 4),     -- 0 piatto · 1 ginocchio · 2 vita-petto · 3 testa · 4 sopra la testa
  quality    smallint not null check (quality between 1 and 3),  -- 1 rovinato dal vento · 2 mosso · 3 pulito
  crowd      smallint check (crowd between 0 and 2),             -- 0 vuoto · 1 qualcuno · 2 affollato
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '3 hours',
  removed_at timestamptz
);
create index if not exists surf_reports_live on public.surf_reports (spot_id, expires_at desc);

create or replace function public.surf_reports_before_insert()
returns trigger language plpgsql security definer set search_path = public as $$
declare recent int; same int;
begin
  if public.is_admin() then
    new.user_id := auth.uid(); new.created_at := now(); new.expires_at := now() + interval '3 hours'; new.removed_at := null;
    return new;
  end if;
  if auth.uid() is null then raise exception 'Sessione mancante'; end if;
  if exists (select 1 from public.blocked_users where user_id = auth.uid()) then raise exception 'Utente bloccato'; end if;
  if public.setting('maintenance') = 'true'::jsonb then raise exception 'In manutenzione'; end if;
  if not exists (select 1 from public.surf_spots where id = new.spot_id and active) then raise exception 'Spot non valido'; end if;
  select count(*) into recent from public.surf_reports where user_id = auth.uid() and created_at > now() - interval '30 minutes';
  if recent >= 4 then raise exception 'Troppi avvisi, riprova più tardi'; end if;
  select count(*) into same from public.surf_reports where user_id = auth.uid() and spot_id = new.spot_id and created_at > now() - interval '20 minutes';
  if same >= 1 then raise exception 'Hai già segnalato questo spot'; end if;
  new.user_id := auth.uid(); new.created_at := now(); new.expires_at := now() + interval '3 hours'; new.removed_at := null;
  return new;
end $$;

drop trigger if exists surf_reports_before_insert on public.surf_reports;
create trigger surf_reports_before_insert before insert on public.surf_reports
  for each row execute function public.surf_reports_before_insert();

create or replace function public.surf_spots_touch()
returns trigger language plpgsql as $$ begin new.updated_at := now(); return new; end $$;
drop trigger if exists surf_spots_touch on public.surf_spots;
create trigger surf_spots_touch before update on public.surf_spots for each row execute function public.surf_spots_touch();

drop trigger if exists audit_surf_spots on public.surf_spots;
create trigger audit_surf_spots after insert or update or delete on public.surf_spots for each row execute function public.audit_admin();
drop trigger if exists audit_surf_reports on public.surf_reports;
create trigger audit_surf_reports after update or delete on public.surf_reports for each row execute function public.audit_admin();

alter table public.surf_spots   enable row level security;
alter table public.surf_reports enable row level security;

drop policy if exists "admin totale" on public.surf_spots;
create policy "admin totale" on public.surf_spots for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admin totale" on public.surf_reports;
create policy "admin totale" on public.surf_reports for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "leggi spot" on public.surf_spots;
create policy "leggi spot" on public.surf_spots for select to anon, authenticated using (active);
drop policy if exists "leggi segnalazioni surf" on public.surf_reports;
create policy "leggi segnalazioni surf" on public.surf_reports for select to anon, authenticated using (expires_at > now() and removed_at is null);
drop policy if exists "crea segnalazioni surf" on public.surf_reports;
create policy "crea segnalazioni surf" on public.surf_reports for insert to authenticated with check (true);   -- le regole vere sono nel trigger

do $$ begin
  alter publication supabase_realtime add table public.surf_reports;
exception when duplicate_object then null; end $$;

insert into public.surf_spots (id, data, active, sort) values
  ('el-cotillo', '{"name": "El Cotillo · Piedra Playa", "lat": 28.67312, "lng": -14.00963, "type": "beach", "wave": "LR", "facing": 275, "win": [250, 360], "off": 95, "tide": "midhigh", "lvl": [1, 3], "minH": 0.5, "maxH": 3.0, "m": [28.75, -14.25], "zone": {"es": "Noroeste", "en": "North-west", "it": "Nord-ovest", "de": "Nordwesten"}, "note": {"es": "Playa larga con picos que cambian con la arena. Mejor por la mañana, antes de que entre el alisio.", "en": "Long beach with peaks that shift with the sand. Best in the morning before the trade wind picks up.", "it": "Spiaggia lunga con picchi che cambiano con la sabbia. Meglio la mattina, prima che arrivi l''aliseo.", "de": "Langer Strand mit Peaks, die mit dem Sand wandern. Am besten morgens, bevor der Passat kommt."}, "haz": {"es": "Corrientes con mar grande", "en": "Currents in big surf", "it": "Correnti con mare grosso", "de": "Strömungen bei großer Brandung"}}'::jsonb, true, 0),
  ('esquinzo', '{"name": "Playa de Esquinzo", "lat": 28.63437, "lng": -14.0275, "type": "beach", "wave": "LR", "facing": 280, "win": [250, 350], "off": 90, "tide": "midhigh", "lvl": [1, 3], "minH": 0.5, "maxH": 2.5, "m": [28.5, -14.25], "zone": {"es": "Noroeste, al sur de El Cotillo", "en": "North-west, south of El Cotillo", "it": "Nord-ovest, a sud di El Cotillo", "de": "Nordwesten, südlich von El Cotillo"}, "note": {"es": "Bahía de arena con picos tranquilos; se llega por pista.", "en": "Sandy bay with mellow peaks; reached by a dirt track.", "it": "Baia di sabbia con picchi tranquilli; si arriva su pista sterrata.", "de": "Sandbucht mit sanften Peaks; über eine Piste erreichbar."}, "haz": {"es": "Rocas en los extremos", "en": "Rocks at both ends", "it": "Rocce ai lati", "de": "Felsen an den Enden"}}'::jsonb, true, 1),
  ('garcey', '{"name": "Playa del Garcey", "lat": 28.34659, "lng": -14.17688, "type": "beach", "wave": "LR", "facing": 265, "win": [230, 330], "off": 85, "tide": "midhigh", "lvl": [1, 3], "minH": 0.5, "maxH": 2.5, "m": [28.25, -14.25], "zone": {"es": "Oeste", "en": "West", "it": "Ovest", "de": "Westen"}, "note": {"es": "Algo resguardada del alisio. Con mar pequeño apta para empezar.", "en": "Partly sheltered from the trade wind. Beginner-friendly when small.", "it": "Un po'' riparata dall''aliseo. Con mare piccolo adatta a chi inizia.", "de": "Etwas windgeschützt. Bei kleinen Wellen für Anfänger geeignet."}, "haz": {"es": "Sin socorrista, acceso por pista", "en": "No lifeguard, dirt-track access", "it": "Niente bagnino, accesso su pista", "de": "Keine Rettungsschwimmer, Zufahrt über Piste"}}'::jsonb, true, 2),
  ('la-pared', '{"name": "La Pared", "lat": 28.21819, "lng": -14.2211, "type": "beach", "wave": "LR", "facing": 285, "win": [240, 340], "off": 80, "tide": "lowmid", "lvl": [1, 3], "minH": 0.4, "maxH": 2.5, "m": [28.25, -14.25], "zone": {"es": "Oeste", "en": "West", "it": "Ovest", "de": "Westen"}, "note": {"es": "Playa con varios picos y escuelas de surf. Con marea baja o media.", "en": "Beach with several peaks and surf schools. Works on low to mid tide.", "it": "Spiaggia con più picchi e scuole di surf. Con marea bassa o media.", "de": "Strand mit mehreren Peaks und Surfschulen. Bei Niedrig- bis Halbtide."}, "haz": {"es": "Corrientes fuertes, rocas al norte", "en": "Strong currents, rocks to the north", "it": "Correnti forti, rocce a nord", "de": "Starke Strömungen, Felsen im Norden"}}'::jsonb, true, 3),
  ('cofete', '{"name": "Cofete", "lat": 28.111667, "lng": -14.390278, "type": "beach", "wave": "LR", "facing": 305, "win": [260, 340], "off": 135, "tide": "midhigh", "lvl": [2, 3], "minH": 0.5, "maxH": 2.0, "m": [28.25, -14.5], "zone": {"es": "Jandía, suroeste", "en": "Jandía, south-west", "it": "Jandía, sud-ovest", "de": "Jandía, Südwesten"}, "note": {"es": "Playa salvaje y remota. Funciona con mar pequeño y sin viento.", "en": "Wild, remote beach. Works with small swell and no wind.", "it": "Spiaggia selvaggia e isolata. Funziona con mare piccolo e senza vento.", "de": "Wilder, abgelegener Strand. Funktioniert bei kleinem Swell und ohne Wind."}, "haz": {"es": "Corrientes muy peligrosas, sin socorrista ni cobertura", "en": "Very dangerous currents, no lifeguard or phone signal", "it": "Correnti molto pericolose, niente bagnino né campo", "de": "Sehr gefährliche Strömungen, keine Rettungsschwimmer, kein Netz"}}'::jsonb, true, 4),
  ('majanicho', '{"name": "Majanicho", "lat": 28.73923, "lng": -13.93743, "type": "reef", "wave": "R", "facing": 355, "win": [285, 30], "off": 160, "tide": "midhigh", "lvl": [2, 3], "minH": 1.0, "maxH": 3.5, "m": [28.75, -14.0], "zone": {"es": "Costa norte", "en": "North shore", "it": "Costa nord", "de": "Nordküste"}, "note": {"es": "Derecha sobre arrecife delante del pueblo. Necesita mar de fondo del noroeste.", "en": "Right-hander over reef in front of the village. Needs a north-west groundswell.", "it": "Destra su reef davanti al paese. Serve mareggiata lunga da nord-ovest.", "de": "Rechte über Riff vor dem Dorf. Braucht Grundswell aus Nordwest."}, "haz": {"es": "Arrecife poco profundo con marea baja", "en": "Shallow reef at low tide", "it": "Reef basso con marea bassa", "de": "Flaches Riff bei Niedrigwasser"}}'::jsonb, true, 5),
  ('el-hierro', '{"name": "El Hierro", "lat": 28.73881, "lng": -13.95184, "type": "reef", "wave": "R", "facing": 350, "win": [270, 350], "off": 150, "tide": "mid", "lvl": [3, 3], "minH": 1.2, "maxH": 4.0, "m": [28.75, -14.0], "zone": {"es": "Costa norte", "en": "North shore", "it": "Costa nord", "de": "Nordküste"}, "note": {"es": "Derecha potente y hueca sobre arrecife volcánico. Solo expertos.", "en": "Powerful, hollow right over volcanic reef. Experts only.", "it": "Destra potente e cava su reef vulcanico. Solo esperti.", "de": "Kraftvolle, hohle Rechte über Lavariff. Nur für Könner."}, "haz": {"es": "Arrecife cortante, mucha gente local", "en": "Sharp reef, crowded with locals", "it": "Reef tagliente, molto affollato di locali", "de": "Scharfes Riff, viele Locals"}}'::jsonb, true, 6),
  ('bristol', '{"name": "Shooting Gallery · Bristol", "lat": 28.74551, "lng": -13.87183, "type": "reef", "wave": "LR", "facing": 0, "win": [290, 20], "off": 150, "tide": "midhigh", "lvl": [3, 3], "minH": 1.2, "maxH": 3.5, "m": [28.75, -14.0], "zone": {"es": "Corralejo, zona de Bristol", "en": "Corralejo, Bristol area", "it": "Corralejo, zona Bristol", "de": "Corralejo, Bristol"}, "note": {"es": "Ola hueca sobre arrecife a la salida de Corralejo.", "en": "Hollow wave over reef at the edge of Corralejo.", "it": "Onda cava su reef all''uscita di Corralejo.", "de": "Hohle Welle über Riff am Rand von Corralejo."}, "haz": {"es": "Arrecife poco profundo", "en": "Shallow reef", "it": "Reef basso", "de": "Flaches Riff"}}'::jsonb, true, 7),
  ('generoso', '{"name": "Generoso", "lat": 28.75124, "lng": -13.87809, "type": "reef", "wave": "L", "facing": 15, "win": [310, 30], "off": 200, "tide": "high", "lvl": [2, 3], "minH": 0.8, "maxH": 3.0, "m": [28.75, -14.0], "zone": {"es": "Corralejo, costa norte", "en": "Corralejo, north shore", "it": "Corralejo, costa nord", "de": "Corralejo, Nordküste"}, "note": {"es": "Izquierda sobre lava, mejor con marea alta.", "en": "Left over lava reef, best at high tide.", "it": "Sinistra su lava, meglio con marea alta.", "de": "Linke über Lavariff, am besten bei Hochwasser."}, "haz": {"es": "Rocas volcánicas", "en": "Volcanic rocks", "it": "Rocce vulcaniche", "de": "Lavafelsen"}}'::jsonb, true, 8),
  ('lobos', '{"name": "Isla de Lobos · La Derecha", "lat": 28.7505, "lng": -13.8325, "approx": true, "go": [28.7397, -13.8628], "type": "point", "wave": "R", "facing": 300, "win": [280, 350], "off": 130, "tide": "all", "lvl": [3, 3], "minH": 1.5, "maxH": 4.5, "m": [28.75, -14.0], "zone": {"es": "Isla de Lobos, en barco desde Corralejo", "en": "Lobos island, by boat from Corralejo", "it": "Isola di Lobos, in barca da Corralejo", "de": "Insel Lobos, per Boot ab Corralejo"}, "note": {"es": "Derecha larguísima al pie del volcán. Solo con mar grande del noroeste.", "en": "Very long right below the volcano. Only with a big north-west swell.", "it": "Destra lunghissima ai piedi del vulcano. Solo con mareggiata grande da nord-ovest.", "de": "Sehr lange Rechte unter dem Vulkan. Nur bei großem Nordwest-Swell."}, "haz": {"es": "Lejos de la costa, arrecife, permiso del parque", "en": "Remote, reef, park permit needed", "it": "Isolata, reef, serve permesso del parco", "de": "Abgelegen, Riff, Parkgenehmigung nötig"}}'::jsonb, true, 9),
  ('playa-del-moro', '{"name": "Playa del Moro", "lat": 28.674, "lng": -13.83382, "type": "beach", "wave": "LR", "facing": 75, "win": [20, 110], "off": 270, "tide": "mid", "lvl": [1, 2], "minH": 0.4, "maxH": 1.8, "m": [28.75, -13.75], "zone": {"es": "Dunas de Corralejo, este", "en": "Corralejo dunes, east", "it": "Dune di Corralejo, est", "de": "Dünen von Corralejo, Osten"}, "note": {"es": "Olas suaves con mar del noreste. Viento de tierra con poniente.", "en": "Soft waves with a north-east swell. Offshore with westerly wind.", "it": "Onde morbide con mare da nord-est. Offshore con vento da ovest.", "de": "Sanfte Wellen bei Nordost-Swell. Ablandig bei Westwind."}, "haz": {"es": "Viento fuerte habitual", "en": "Often very windy", "it": "Spesso molto ventoso", "de": "Oft sehr windig"}}'::jsonb, true, 10),
  ('el-burro', '{"name": "El Burro · Glass Beach", "lat": 28.68773, "lng": -13.83209, "type": "reef", "wave": "LR", "facing": 65, "win": [10, 100], "off": 250, "tide": "mid", "lvl": [1, 3], "minH": 0.4, "maxH": 2.5, "m": [28.75, -13.75], "zone": {"es": "Dunas de Corralejo, este", "en": "Corralejo dunes, east", "it": "Dune di Corralejo, est", "de": "Dünen von Corralejo, Osten"}, "note": {"es": "Fácil en verano con mar pequeño; en invierno para avanzados.", "en": "Easy in summer when small; for advanced surfers in winter.", "it": "Facile d''estate con mare piccolo; d''inverno per avanzati.", "de": "Im Sommer bei kleinen Wellen leicht; im Winter für Fortgeschrittene."}, "haz": {"es": "Fondo de roca", "en": "Rocky bottom", "it": "Fondo di roccia", "de": "Felsiger Grund"}}'::jsonb, true, 11)
on conflict (id) do nothing;
