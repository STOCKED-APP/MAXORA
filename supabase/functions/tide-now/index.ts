// Maxora — marea reale adesso a Puerto del Rosario.
// Legge il mareografo (IOC Sea Level Monitoring, stazione fue2, dato al minuto)
// e lo confronta con la nostra previsione (data/tides.json): la differenza è l'effetto
// di vento e pressione che nessuna previsione conosce.
// In più: vento misurato all'aeroporto di Fuerteventura (METAR GCFV, aviationweather.gov, dominio pubblico).
const IOC = 'https://www.ioc-sealevelmonitoring.org/service.php';
const TIDES = 'https://stocked-app.github.io/MAXORA/data/tides.json';
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
  'Cache-Control': 'public, max-age=300',
};

let cache: { at: number; body: string } | null = null;
let tides: any = null;
let tidesAt = 0;

const iso = (d: Date) => d.toISOString().slice(0, 16);

let windCache: { at: number; v: any } | null = null;
async function windNow() {
  if (windCache && Date.now() - windCache.at < 10 * 60000) return windCache.v;
  try {
    const r = await fetch('https://aviationweather.gov/api/data/metar?ids=GCFV&format=json&hours=3', {
      headers: { 'User-Agent': 'maxora (github.com/STOCKED-APP/MAXORA)' },
    });
    const a = await r.json();
    const m = Array.isArray(a) ? a.sort((x: any, y: any) => y.obsTime - x.obsTime)[0] : null;
    const v = m ? {
      t: new Date(m.obsTime * 1000).toISOString(),
      kmh: m.wspd == null ? null : Math.round(m.wspd * 1.852),
      gust_kmh: m.wgst == null ? null : Math.round(m.wgst * 1.852),
      dir: typeof m.wdir === 'number' ? m.wdir : null,
      variable: m.wdir === 'VRB',
      temp: m.temp ?? null,
      station: 'Aeropuerto de Fuerteventura (GCFV)',
    } : null;
    windCache = { at: Date.now(), v };
    return v;
  } catch (_e) {
    return windCache?.v ?? null;
  }
}

function predictedCm(t: number): number | null {
  const c = tides?.curve;
  if (!c) return null;
  const start = Date.parse(c.start.replace('Z', ':00Z'));
  const k = (t - start) / (c.step_min * 60000);
  const i = Math.floor(k);
  if (i < 0 || i + 1 >= c.cm.length) return null;
  return c.cm[i] + (c.cm[i + 1] - c.cm[i]) * (k - i);
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  try {
    if (cache && Date.now() - cache.at < 5 * 60000) return new Response(cache.body, { headers: CORS });
    const windP = windNow();
    if (!tides || Date.now() - tidesAt > 6 * 3600000) {
      tides = await (await fetch(TIDES + '?t=' + Date.now())).json();
      tidesAt = Date.now();
    }
    const now = new Date();
    const from = new Date(now.getTime() - 3 * 3600000);
    const r = await fetch(`${IOC}?query=data&code=fue2&timestart=${iso(from)}&timestop=${iso(now)}&format=json`, {
      headers: { 'User-Agent': 'maxora (github.com/STOCKED-APP/MAXORA)' },
    });
    const all = (await r.json()).filter((x: any) => x && x.slevel != null);
    const sensor = tides.station?.sensor || 'rad';
    let rows = all.filter((x: any) => x.sensor === sensor);
    if (rows.length < 20) rows = all;
    const pts = rows.map((x: any) => ({ t: Date.parse(x.stime.replace(' ', 'T') + 'Z'), v: Number(x.slevel) }))
      .filter((p: any) => isFinite(p.t) && isFinite(p.v)).sort((a: any, b: any) => a.t - b.t);
    if (pts.length < 20) throw new Error('pochi dati dal mareografo');
    // media degli ultimi 10 minuti, scartando i picchi (onde, rumore)
    const med = (a: number[]) => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
    const lastT = pts[pts.length - 1].t;
    const win = (t1: number) => pts.filter((p: any) => p.t > t1 - 10 * 60000 && p.t <= t1).map((p: any) => p.v);
    const nowV = med(win(lastT));
    const prevV = med(win(lastT - 30 * 60000).length ? win(lastT - 30 * 60000) : win(lastT));
    const zero = Number(tides.sensor_zero_offset_m || 0);
    const obsCm = Math.round((nowV - zero) * 100);
    const pred = predictedCm(lastT - 5 * 60000);
    const body = JSON.stringify({
      t: new Date(lastT).toISOString(),
      age_min: Math.round((now.getTime() - lastT) / 60000),
      obs_cm: obsCm,
      pred_cm: pred == null ? null : Math.round(pred),
      resid_cm: pred == null ? null : Math.round(obsCm - pred),
      rising: nowV > prevV,
      station: 'Puerto del Rosario',
      source: 'IOC Sea Level Station Monitoring Facility · REDMAR Puertos del Estado',
      wind: await windP,
    });
    cache = { at: Date.now(), body };
    return new Response(body, { headers: CORS });
  } catch (e) {
    // senza marea, almeno il vento
    const wind = await windNow().catch(() => null);
    return new Response(JSON.stringify({ error: String(e), wind }), { status: 200, headers: CORS });
  }
});
