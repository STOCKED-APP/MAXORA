"""Maxora — previsioni surf gratuite dai dati aperti ECMWF (CC BY 4.0).

Scarica il modello d'onda (altezza, periodo di picco, direzione) e il vento a 10 m,
li legge nel punto giusto davanti a ogni spot e scrive data/surf.json.
Usa l'ultima corsa disponibile: le corse 06/18 coprono 90 h, quelle 00/12 arrivano a 10 giorni;
le due si uniscono (prima la più recente, poi la lunga).

Uso: python3 build_surf.py data/surf_spots.json data/surf.json
"""
import json, math, os, sys, time
from datetime import datetime, timedelta, timezone
import numpy as np
import xarray as xr
from ecmwf.opendata import Client

UTC = timezone.utc
LONG_STEPS = list(range(0, 145, 3)) + list(range(150, 241, 6))
SHORT_STEPS = list(range(0, 91, 3))


def note(msg):
    print('::notice::' + str(msg).replace('\n', ' | '), flush=True)


def retrieve(c, run, stream, params, steps, target):
    for k in range(4):
        try:
            c.retrieve(date=run.strftime('%Y%m%d'), time=run.hour, type='fc', stream=stream, param=params, step=steps, target=target)
            return True
        except Exception as e:
            print('retry', stream, run, e, flush=True)
            time.sleep(20 * (k + 1))
    return False


def open_grib(path):
    return xr.open_dataset(path, engine='cfgrib', backend_kwargs={'indexpath': ''})


def cell_picker(ds, var, lat, lng, need_sea):
    """indice (i, j) della cella più vicina; per le onde la più vicina con un valore (mare)"""
    lats, lons = ds.latitude.values, ds.longitude.values
    i0, j0 = int(np.abs(lats - lat).argmin()), int(np.abs(lons - lng).argmin())
    if not need_sea:
        return i0, j0
    first = ds[var].isel(step=0).values
    best = None
    for di in range(-3, 4):
        for dj in range(-3, 4):
            i, j = i0 + di, j0 + dj
            if 0 <= i < len(lats) and 0 <= j < len(lons) and np.isfinite(first[i, j]):
                d = (lats[i] - lat) ** 2 + ((lons[j] - lng) * math.cos(math.radians(lat))) ** 2
                if best is None or d < best[0]:
                    best = (d, i, j)
    return (best[1], best[2]) if best else (i0, j0)


def series(ds, var, i, j):
    return [None if not np.isfinite(v) else float(v) for v in ds[var].values[:, i, j]]


def run_data(c, run, steps, spots, tag):
    wf, af = f'w_{tag}.grib2', f'a_{tag}.grib2'
    t0 = time.time()
    ok = retrieve(c, run, 'wave', ['swh', 'mwd', 'pp1d'], steps, wf) and retrieve(c, run, 'oper', ['10u', '10v'], steps, af)
    if not ok:
        return None
    w, a = open_grib(wf), open_grib(af)
    note(f'corsa {run:%Y-%m-%d %HZ} ({tag}): {len(w.step)} passi onde, {len(a.step)} vento, {time.time()-t0:.0f}s')
    times = [run + timedelta(hours=int(s / np.timedelta64(1, 'h'))) for s in w.step.values]
    a_steps = [int(s / np.timedelta64(1, 'h')) for s in a.step.values]
    w_steps = [int(s / np.timedelta64(1, 'h')) for s in w.step.values]
    out = {}
    for sp in spots:
        mi, mj = cell_picker(w, 'swh', sp['m'][0], sp['m'][1], True)
        ai, aj = cell_picker(a, 'u10', sp['lat'], sp['lng'], False)
        u, v = series(a, 'u10', ai, aj), series(a, 'v10', ai, aj)
        amap = dict(zip(a_steps, zip(u, v)))
        hs, tp, dr = series(w, 'swh', mi, mj), series(w, 'pp1d', mi, mj), series(w, 'mwd', mi, mj)
        ws, wd = [], []
        for s in w_steps:
            uv = amap.get(s)
            if not uv or uv[0] is None:
                ws.append(None); wd.append(None); continue
            uu, vv = uv
            ws.append(round(math.hypot(uu, vv) * 3.6))
            wd.append(round((math.degrees(math.atan2(-uu, -vv)) + 360) % 360))
        out[sp['id']] = {
            'cell': [float(w.latitude.values[mi]), float(w.longitude.values[mj])],
            'hs': [None if x is None else round(x, 2) for x in hs],
            'tp': [None if x is None else round(x, 1) for x in tp],
            'dir': [None if x is None else round(x) for x in dr],
            'ws': ws, 'wd': wd,
        }
    for f in (wf, af):
        try: os.remove(f)
        except OSError: pass
    return times, out


def load_spots(spots_path):
    """spot dal database (modificabili dal pannello admin); il file è la riserva"""
    try:
        import re, urllib.request
        cfg = open(os.path.join(os.path.dirname(__file__), '..', 'assets', 'config.js')).read()
        url = re.search(r"supabaseUrl:\s*'([^']+)'", cfg).group(1)
        key = re.search(r"supabaseKey:\s*'([^']+)'", cfg).group(1)
        req = urllib.request.Request(url + '/rest/v1/surf_spots?select=id,data&active=eq.true&order=sort', headers={'apikey': key, 'Authorization': 'Bearer ' + key})
        rows = json.loads(urllib.request.urlopen(req, timeout=30).read().decode())
        if isinstance(rows, list) and rows:
            note(f'spot dal database: {len(rows)}')
            return [dict(r['data'], id=r['id']) for r in rows]
    except Exception as e:
        print('spot dal database non disponibili:', e, flush=True)
    note('spot dal file (riserva)')
    return json.load(open(spots_path))['spots']


def main():
    spots_path, out_path = sys.argv[1], sys.argv[2]
    spots = load_spots(spots_path)
    c = Client(source='ecmwf')
    latest = c.latest(type='fc', stream='wave', param='swh', step=0).replace(tzinfo=UTC)
    if latest.hour in (6, 18):
        short_run, long_run = latest, latest - timedelta(hours=6)
    else:
        short_run, long_run = None, latest
    long = run_data(c, long_run, LONG_STEPS, spots, 'long')
    if long is None:
        sys.exit('download corsa lunga fallito')
    times, data = long
    runs = {'long': long_run.strftime('%Y-%m-%dT%HZ')}
    if short_run:
        short = run_data(c, short_run, SHORT_STEPS, spots, 'short')
        if short:
            st, sd = short
            cut = st[-1]
            keep = [k for k, tt in enumerate(times) if tt > cut]
            times = st + [times[k] for k in keep]
            for sid in data:
                for var in ('hs', 'tp', 'dir', 'ws', 'wd'):
                    sd[sid][var] = sd[sid][var] + [data[sid][var][k] for k in keep]
            data = sd
            runs['short'] = short_run.strftime('%Y-%m-%dT%HZ')
    now = datetime.now(UTC)
    # si tengono le ultime ~27 ore (per le condizioni delle sessioni del diario)
    first = next((k for k, tt in enumerate(times) if tt >= now - timedelta(hours=27)), 0)   # anche ieri: serve al diario surf
    times = times[first:]
    for sid in data:
        for var in ('hs', 'tp', 'dir', 'ws', 'wd'):
            data[sid][var] = data[sid][var][first:]
    doc = {
        'generated': now.strftime('%Y-%m-%dT%H:%MZ'),
        'source': 'ECMWF Open Data (IFS / WAM), CC BY 4.0',
        'runs': runs,
        'times': [tt.strftime('%Y-%m-%dT%H:%MZ') for tt in times],
        'spots': data,
    }
    os.makedirs(os.path.dirname(out_path) or '.', exist_ok=True)
    with open(out_path, 'w') as f:
        json.dump(doc, f, separators=(',', ':'))
    s0 = data[spots[0]['id']]
    note(f"surf.json: {len(times)} passi da {doc['times'][0]} a {doc['times'][-1]}, corse {runs}; {spots[0]['id']} ora hs={s0['hs'][0]} tp={s0['tp'][0]} dir={s0['dir'][0]} vento={s0['ws'][0]}km/h da {s0['wd'][0]}")
    note('celle modello: ' + ', '.join(f"{k}={v['cell']}" for k, v in data.items()))


if __name__ == '__main__':
    main()
