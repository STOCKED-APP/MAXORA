// Maxora — importa ogni 5 minuti le incidenze ufficiali DGT (DATEX II v3.7) delle Canarie
// e le pubblica come avvisi "DGT" sulla mappa. Fonte: Punto de Acceso Nacional DGT (CC BY).
import { createClient } from 'npm:@supabase/supabase-js@2';

const FEED = 'https://nap.dgt.es/datex2/v3/dgt/SituationPublication/datex2_v37.xml';
const BOX = { s: 27.5, n: 29.5, w: -18.5, e: -13.2 };   // Canarie
const KEEP_ALIVE_MIN = 20;                                // rinnovato a ogni giro: se sparisce dal flusso, scade da solo

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-cron-secret',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};
const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

const one = (src: string, tag: string) => {
  const m = src.match(new RegExp('<(?:\\w+:)?' + tag + '(?:\\s[^>]*)?>([^<]*)</(?:\\w+:)?' + tag + '>'));
  return m ? m[1].trim() : null;
};
const all = (src: string, tag: string) => [...src.matchAll(new RegExp('<(?:\\w+:)?' + tag + '(?:\\s[^>]*)?>([^<]*)</(?:\\w+:)?' + tag + '>', 'g'))].map((m) => m[1].trim());

// testo breve in spagnolo per le cause più comuni
const LABELS: Record<string, string> = {
  roadworks: 'Obras', maintenanceWork: 'Mantenimiento', resurfacingWork: 'Asfaltado', roadClosed: 'Carretera cortada',
  laneClosures: 'Carril cortado', singleAlternateLineTraffic: 'Paso alternativo', accident: 'Accidente', brokenDownVehicle: 'Vehículo averiado',
  vehicleStuck: 'Vehículo detenido', vehicleOnFire: 'Vehículo en llamas', animalsOnTheRoad: 'Animales en la vía', objectOnTheRoad: 'Objeto en la vía',
  rockfalls: 'Desprendimientos', landslips: 'Desprendimientos', flooding: 'Inundación', fog: 'Niebla', strongWinds: 'Viento fuerte',
  sandOnRoad: 'Arena en la vía', iceOnRoad: 'Hielo', snowOnRoad: 'Nieve', stationaryTraffic: 'Retención', queuingTraffic: 'Retención',
  slowTraffic: 'Tráfico lento', heavyTraffic: 'Tráfico denso', sportsMeeting: 'Evento deportivo', event: 'Evento', infrastructureDamage: 'Daños en la vía',
  obstruction: 'Obstáculo', poorEnvironment: 'Condiciones adversas', roadMaintenance: 'Obras', abnormalTraffic: 'Retención'
};

function classify(rec: string, xsiType: string): { type: string; detail: string | null } {
  const t = xsiType.toLowerCase();
  const words = [...all(rec, 'causeType'), ...all(rec, 'roadMaintenanceType'), ...all(rec, 'roadOrCarriagewayOrLaneManagementType'),
    ...all(rec, 'accidentType'), ...all(rec, 'vehicleObstructionType'), ...all(rec, 'animalPresenceType'), ...all(rec, 'obstructionType'),
    ...all(rec, 'environmentalObstructionType'), ...all(rec, 'abnormalTrafficType'), ...all(rec, 'poorEnvironmentType'),
    ...all(rec, 'nonWeatherRelatedRoadConditionType'), ...all(rec, 'weatherRelatedRoadConditionType'), ...all(rec, 'infrastructureDamageType')];
  const has = (re: RegExp) => words.some((w) => re.test(w));
  const detail = words.map((w) => LABELS[w]).find(Boolean) || null;
  if (has(/^roadClosed$|carriagewayClosures/)) return { type: 'cortada', detail: detail || 'Carretera cortada' };
  if (t.includes('accident') || has(/^accident$/)) return { type: 'incidente', detail: detail || 'Accidente' };
  if (t.includes('abnormaltraffic')) return { type: 'atasco', detail: detail || 'Retención' };
  if (t.includes('animal') || has(/animal/i)) return { type: 'animales', detail: detail || 'Animales en la vía' };
  if (has(/sand/i)) return { type: 'arena', detail: 'Arena en la vía' };
  if (has(/obstruction|object|vehicleStuck|brokenDown|rockfall|landslip|flooding/i) && !has(/roadworks|maintenance|resurfacing/i)) return { type: 'peligro', detail: detail || 'Obstáculo' };
  if (t.includes('maintenance') || t.includes('roadworks') || t.includes('construction') || has(/roadworks|maintenance|resurfacing/i)) return { type: 'obras', detail: detail || 'Obras' };
  if (t.includes('roadorcarriagewayorlanemanagement')) return { type: 'obras', detail: detail || 'Restricción de carril' };
  return { type: 'peligro', detail: detail || 'Incidencia' };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
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
      if (u?.user) ok = !!(await db.from('admins').select('user_id').eq('user_id', u.user.id).maybeSingle()).data;
    }
  }
  if (!ok) return json({ error: 'non autorizzato' }, 401);

  const { data: run } = await db.from('import_runs').insert({ source: 'dgt' }).select('id').single();
  try {
    const res = await fetch(FEED, { headers: { 'User-Agent': 'Maxora/0.4 (+https://github.com/STOCKED-APP/MAXORA)' }, signal: AbortSignal.timeout(45_000) });
    if (!res.ok) throw new Error('DGT ' + res.status);
    const xml = await res.text();

    const now = Date.now();
    const keepUntil = new Date(now + KEEP_ALIVE_MIN * 60_000).toISOString();
    const rows: Record<string, unknown>[] = [];
    // spezzo per situationRecord: lavoro solo su quelli con coordinate nelle Canarie
    const parts = xml.split(/<(?:\w+:)?situationRecord[\s>]/).slice(1);
    for (const raw of parts) {
      const rec = raw.split(/<\/(?:\w+:)?situationRecord>/)[0];
      const lats = all(rec, 'latitude').map(Number), lngs = all(rec, 'longitude').map(Number);
      if (!lats.length || !lngs.length) continue;
      // punto: prima coordinata; tratto (da/a): punto medio
      const lat = lats.length >= 2 ? (lats[0] + lats[lats.length - 1]) / 2 : lats[0];
      const lng = lngs.length >= 2 ? (lngs[0] + lngs[lngs.length - 1]) / 2 : lngs[0];
      if (!(lat >= BOX.s && lat <= BOX.n && lng >= BOX.w && lng <= BOX.e)) continue;

      const head = raw.slice(0, 400);
      const id = (head.match(/\bid="([^"]+)"/) || [])[1];
      if (!id) continue;
      const xsiType = ((head.match(/xsi:type="(?:\w+:)?([^"]+)"/) || [])[1]) || '';
      const end = one(rec, 'overallEndTime');
      if (end && new Date(end).getTime() < now) continue;              // già finito
      const start = one(rec, 'overallStartTime');
      if (start && new Date(start).getTime() > now + 15 * 60_000) continue;  // programmato più avanti
      const { type, detail } = classify(rec, xsiType);
      const road = one(rec, 'roadName') || one(rec, 'roadNumber');
      const km = one(rec, 'kilometerPoint');
      const title = [road, detail].filter(Boolean).join(' · ') + (km && /^\d+(\.\d+)?$/.test(km) ? ' (km ' + Number(km).toFixed(1).replace('.0', '') + ')' : '');
      rows.push({
        external_id: 'dgt:' + id, type, lat, lng, title: title || 'Incidencia DGT', source: 'dgt', official: true,
        user_id: null, created_at: start && new Date(start).getTime() < now ? start : new Date(now).toISOString(),
        expires_at: keepUntil, removed_at: null
      });
    }

    // non resuscito quelli che l'admin ha tolto a mano
    if (rows.length) {
      const { data: removed } = await db.from('reports').select('external_id').eq('source', 'dgt').not('removed_at', 'is', null).in('external_id', rows.map((r) => r.external_id as string));
      const skip = new Set((removed || []).map((r: { external_id: string }) => r.external_id));
      for (let i = rows.length - 1; i >= 0; i--) if (skip.has(rows[i].external_id as string)) rows.splice(i, 1);
    }
    // stesso id ripetuto nel flusso: tengo l'ultimo
    // la DGT pubblica una voce per senso di marcia/corsia: tengo una sola voce per stesso tipo, strada e punto (~10 m)
    const byId = new Map(rows.map((r) => [r.external_id as string, r]));
    const byPlace = new Map<string, Record<string, unknown>>();
    for (const r of byId.values()) {
      const road = String(r.title).split(' · ')[0];
      const k = r.type + '|' + road + '|' + (r.lat as number).toFixed(4) + '|' + (r.lng as number).toFixed(4);
      const prev = byPlace.get(k);
      if (!prev || String(r.external_id) < String(prev.external_id)) byPlace.set(k, r);
    }
    rows.length = 0; rows.push(...byPlace.values());
    // salvo / rinnovo
    for (let i = 0; i < rows.length; i += 200) {
      const { error } = await db.from('reports').upsert(rows.slice(i, i + 200), { onConflict: 'external_id' });
      if (error) throw error;
    }
    // ciò che la DGT non pubblica più: scade subito (non tocco quelli tolti a mano dall'admin)
    const live = new Set(rows.map((r) => r.external_id as string));
    const { data: old } = await db.from('reports').select('id,external_id').eq('source', 'dgt').gt('expires_at', new Date(now).toISOString()).is('removed_at', null);
    const gone = (old || []).filter((r: { external_id: string }) => !live.has(r.external_id)).map((r: { id: string }) => r.id);
    if (gone.length) await db.from('reports').update({ expires_at: new Date(now).toISOString() }).in('id', gone);

    // pulizia registro: tengo 7 giorni
    await db.from('import_runs').delete().eq('source', 'dgt').lt('started_at', new Date(now - 7 * 86400_000).toISOString());
    await db.from('import_runs').update({ finished_at: new Date().toISOString(), ok: true, items: rows.length }).eq('id', run!.id);
    return json({ ok: true, items: rows.length, expired: gone.length, bytes: xml.length });
  } catch (e) {
    const msg = String((e as Error).message || e).slice(0, 500);
    await db.from('import_runs').update({ finished_at: new Date().toISOString(), ok: false, error: msg }).eq('id', run!.id);
    return json({ ok: false, error: msg }, 502);
  }
});
