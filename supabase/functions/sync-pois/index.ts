// Maxora — copia dei punti d'interesse (OpenStreetMap / Overpass) nella tabella "pois".
// Una categoria alla volta, con più server di riserva. Ogni esecuzione aggiorna solo le
// categorie più vecchie di 20 ore (o mai copiate) finché resta tempo; il resto alla prossima.
// Si avvia dal pianificatore (header x-cron-secret) o dal pannello admin (token di un admin; ?force=1 rifà tutto).
import { createClient } from 'npm:@supabase/supabase-js@2';

const AREA = { name: 'fuerteventura', s: 27.99, w: -14.55, n: 28.80, e: -13.80 };

const CATS: { id: string; osm: string[]; unnamed?: boolean; test: (t: Record<string, string>) => boolean }[] = [
  { id: 'food', osm: ['nwr["amenity"="restaurant"]', 'nwr["amenity"="fast_food"]'], test: (t) => t.amenity === 'restaurant' || t.amenity === 'fast_food' },
  { id: 'beach', osm: ['nwr["natural"="beach"]'], test: (t) => t.natural === 'beach' },
  { id: 'fuel', osm: ['nwr["amenity"="fuel"]'], unnamed: true, test: (t) => t.amenity === 'fuel' },
  { id: 'drink', osm: ['nwr["amenity"="cafe"]', 'nwr["amenity"="bar"]', 'nwr["amenity"="pub"]'], test: (t) => ['cafe', 'bar', 'pub'].includes(t.amenity) },
  { id: 'super', osm: ['nwr["shop"="supermarket"]', 'nwr["shop"="convenience"]'], test: (t) => t.shop === 'supermarket' || t.shop === 'convenience' },
  { id: 'pharmacy', osm: ['nwr["amenity"="pharmacy"]'], unnamed: true, test: (t) => t.amenity === 'pharmacy' },
  { id: 'view', osm: ['nwr["tourism"="viewpoint"]'], test: (t) => t.tourism === 'viewpoint' },
  { id: 'surf', osm: ['nwr["shop"="surf"]', 'nwr["sport"="surfing"]', 'nwr["sport"="kitesurfing"]', 'nwr["sport"="windsurfing"]'], test: (t) => t.shop === 'surf' || ['surfing', 'kitesurfing', 'windsurfing'].includes(t.sport) },
  { id: 'hotel', osm: ['nwr["tourism"="hotel"]', 'nwr["tourism"="apartment"]', 'nwr["tourism"="hostel"]', 'nwr["tourism"="guest_house"]'], test: (t) => ['hotel', 'apartment', 'hostel', 'guest_house'].includes(t.tourism) },
  { id: 'parking', osm: ['nwr["amenity"="parking"]["access"!="private"]'], unnamed: true, test: (t) => t.amenity === 'parking' && t.access !== 'private' }
];

const MIRRORS = [
  'https://overpass.private.coffee/api/interpreter',
  'https://overpass-api.de/api/interpreter',
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter'
];
const KEEP = ['name', 'brand', 'operator', 'cuisine', 'opening_hours', 'phone', 'contact:phone', 'website', 'contact:website',
  'addr:street', 'addr:housenumber', 'addr:city', 'addr:place', 'addr:postcode', 'wheelchair', 'stars', 'fee', 'surface', 'access', 'capacity', 'description'];
const BUDGET_MS = 120_000;
const STALE_MS = 20 * 3600 * 1000;

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-cron-secret',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

async function overpass(ql: string, deadline: number) {
  const errs: string[] = [];
  for (const url of MIRRORS) {
    const left = deadline - Date.now();
    if (left < 8000) { errs.push('tempo finito'); break; }
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': 'Maxora/0.3 (+https://github.com/STOCKED-APP/MAXORA)', 'Referer': 'https://stocked-app.github.io/MAXORA/' },
        body: 'data=' + encodeURIComponent(ql),
        signal: AbortSignal.timeout(Math.min(35_000, left - 3000))
      });
      if (!res.ok) { errs.push(new URL(url).host + ' ' + res.status); continue; }
      const data = await res.json();
      if (data.remark && /runtime error|timed out|out of memory/i.test(data.remark)) { errs.push(new URL(url).host + ' ' + data.remark.slice(0, 80)); continue; }
      return data.elements || [];
    } catch (e) { errs.push(new URL(url).host + ' ' + ((e as Error).name === 'TimeoutError' ? 'timeout' : (e as Error).message)); }
  }
  throw new Error(errs.join(' · '));
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  const t0 = Date.now();
  const deadline = t0 + BUDGET_MS;
  const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });

  // Autorizzazione: segreto del pianificatore oppure admin
  let ok = false;
  const cron = req.headers.get('x-cron-secret');
  if (cron) {
    const { data } = await db.from('app_secrets').select('value').eq('key', 'cron_secret').maybeSingle();
    ok = !!data && data.value === cron;
  }
  if (!ok) {
    const jwt = (req.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '');
    if (jwt) {
      const { data: u } = await db.auth.getUser(jwt);
      if (u?.user) {
        const { data: a } = await db.from('admins').select('user_id').eq('user_id', u.user.id).maybeSingle();
        ok = !!a;
      }
    }
  }
  if (!ok) return json({ error: 'non autorizzato' }, 401);

  const force = new URL(req.url).searchParams.get('force') === '1';
  const { data: state } = await db.from('poi_sync').select('*').eq('area', AREA.name);
  const last = new Map((state || []).map((r: { cat: string; synced_at: string | null }) => [r.cat, r.synced_at ? new Date(r.synced_at).getTime() : 0]));
  const todo = CATS.filter((c) => force || !last.get(c.id) || Date.now() - (last.get(c.id) || 0) > STALE_MS)
    .sort((a, b) => (last.get(a.id) || 0) - (last.get(b.id) || 0));
  if (!todo.length) return json({ ok: true, items: 0, note: 'tutto aggiornato' });

  const { data: run } = await db.from('import_runs').insert({ source: 'osm-pois' }).select('id').single();
  const done: Record<string, number> = {};
  const errors: string[] = [];
  for (const cat of todo) {
    if (deadline - Date.now() < 15_000) break;
    const started = new Date().toISOString();
    const box = `(${AREA.s},${AREA.w},${AREA.n},${AREA.e});`;
    const ql = `[out:json][timeout:30];(${cat.osm.map((f) => f + box).join('')});out center tags;`;
    try {
      const elements = await overpass(ql, deadline);
      const rows: Record<string, unknown>[] = [];
      for (const e of elements) {
        const t = (e.tags || {}) as Record<string, string>;
        if (!cat.test(t)) continue;
        const lat = e.lat ?? e.center?.lat, lng = e.lon ?? e.center?.lon;
        if (lat == null || lng == null) continue;
        const name = t.name || t.brand || t.operator || '';
        if (!name && !cat.unnamed) continue;
        const tags: Record<string, string> = {};
        for (const k of KEEP) if (t[k]) tags[k] = t[k];
        rows.push({ id: e.type[0] + e.id, cat: cat.id, area: AREA.name, name, lat, lng, tags, updated_at: started });
      }
      for (let i = 0; i < rows.length; i += 500) {
        const { error } = await db.from('pois').upsert(rows.slice(i, i + 500));
        if (error) throw error;
      }
      // tolgo ciò che non esiste più (solo dopo una copia riuscita)
      await db.from('pois').delete().eq('area', AREA.name).eq('cat', cat.id).lt('updated_at', started);
      await db.from('poi_sync').upsert({ cat: cat.id, area: AREA.name, synced_at: new Date().toISOString(), items: rows.length, error: null });
      done[cat.id] = rows.length;
    } catch (e) {
      const msg = String((e as Error).message || e).slice(0, 300);
      errors.push(cat.id + ': ' + msg);
      await db.from('poi_sync').upsert({ cat: cat.id, area: AREA.name, error: msg, tried_at: new Date().toISOString() });
    }
  }
  const items = Object.values(done).reduce((a, b) => a + b, 0);
  const allOk = errors.length === 0;
  await db.from('import_runs').update({ finished_at: new Date().toISOString(), ok: allOk, items, error: errors.join(' | ').slice(0, 900) || null }).eq('id', run!.id);
  const pending = todo.length - Object.keys(done).length - errors.length;
  return json({ ok: allOk, items, done, errors, pending }, allOk ? 200 : 207);
});
