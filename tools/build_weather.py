"""Maxora — meteo per bici e corsa: temperatura, vento, raffiche e pioggia sull'isola (ECMWF Open Data, CC BY 4.0).

Prende l'ultima corsa del modello (ogni 6 ore), passi di 3 ore fino a 90 ore,
su una griglia di 0,25° che copre Fuerteventura, e scrive data/weather.json.

Uso: python3 build_weather.py data/weather.json
"""
import json, math, os, sys, time
from datetime import timedelta, timezone, datetime
import numpy as np
import xarray as xr
from ecmwf.opendata import Client

UTC = timezone.utc
STEPS = list(range(0, 91, 3))
LATS = [28.75, 28.5, 28.25, 28.0]
LONS = [-14.5, -14.25, -14.0, -13.75]


def note(m):
    print('::notice::' + str(m).replace('\n', ' | '), flush=True)


def get(c, run, params, target):
    for k in range(4):
        try:
            c.retrieve(date=run.strftime('%Y%m%d'), time=run.hour, type='fc', stream='oper', param=params, step=STEPS, target=target)
            return True
        except Exception as e:
            print('retry', params, e, flush=True)
            time.sleep(15 * (k + 1))
    return False


def main():
    out = sys.argv[1]
    c = Client(source='ecmwf')
    run = c.latest(type='fc', stream='oper', param='2t', step=0).replace(tzinfo=UTC)
    if not get(c, run, ['2t', '10u', '10v', 'tp'], 'm.grib2'):
        sys.exit('download fallito')
    gust = get(c, run, ['10fg'], 'g.grib2')
    ds = xr.open_dataset('m.grib2', engine='cfgrib', backend_kwargs={'indexpath': '', 'filter_by_keys': {'typeOfLevel': 'heightAboveGround', 'level': 2}})
    dw = xr.open_dataset('m.grib2', engine='cfgrib', backend_kwargs={'indexpath': '', 'filter_by_keys': {'typeOfLevel': 'heightAboveGround', 'level': 10}})
    dp = xr.open_dataset('m.grib2', engine='cfgrib', backend_kwargs={'indexpath': '', 'filter_by_keys': {'shortName': 'tp'}})
    dg = xr.open_dataset('g.grib2', engine='cfgrib', backend_kwargs={'indexpath': ''}) if gust else None
    steps = [int(s / np.timedelta64(1, 'h')) for s in ds.step.values]
    times = [run + timedelta(hours=h) for h in steps]
    pts = []
    for la in LATS:
        for lo in LONS:
            sel = dict(latitude=la, longitude=lo, method='nearest')
            t2 = ds['t2m'].sel(**sel).values - 273.15
            u = dw['u10'].sel(**sel).values; v = dw['v10'].sel(**sel).values
            tp = dp['tp'].sel(**sel).values * 1000.0
            pr = np.diff(np.concatenate([[0.0], tp]))
            pr[0] = 0.0 if steps[0] == 0 else pr[0]
            g = dg[list(dg.data_vars)[0]].sel(**sel).values * 3.6 if dg is not None else None
            pts.append({
                'lat': la, 'lng': lo,
                't': [round(float(x), 1) for x in t2],
                'ws': [round(float(math.hypot(a, b) * 3.6)) for a, b in zip(u, v)],
                'wd': [round(float((math.degrees(math.atan2(-a, -b)) + 360) % 360)) for a, b in zip(u, v)],
                'g': [round(float(x)) for x in g] if g is not None else None,
                'p': [round(max(0.0, float(x)), 1) for x in pr],
            })
    now = datetime.now(UTC)
    doc = {'generated': now.strftime('%Y-%m-%dT%H:%MZ'), 'run': run.strftime('%Y-%m-%dT%HZ'),
           'source': 'ECMWF Open Data (IFS), CC BY 4.0', 'times': [t.strftime('%Y-%m-%dT%H:%MZ') for t in times], 'points': pts}
    with open(out, 'w') as f:
        json.dump(doc, f, separators=(',', ':'))
    p0 = pts[5]
    note(f"weather.json: corsa {doc['run']}, {len(times)} passi, raffiche={'sì' if gust else 'no'}; punto {p0['lat']},{p0['lng']}: {p0['t'][0]}°C vento {p0['ws'][0]} km/h da {p0['wd'][0]} raffiche {p0['g'][0] if p0['g'] else '-'}")


if __name__ == '__main__':
    main()
