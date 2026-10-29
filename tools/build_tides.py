"""Maxora — maree di Fuerteventura dal mareografo reale (IOC Sea Level Monitoring, stazione fue2 = Puerto del Rosario).

1. scarica lo storico minuto per minuto, lo pulisce e lo riduce a valori orari
2. analisi armonica (UTide) -> costanti della marea locale
3. verifica: allena fino al 31/12/2025 e prevede il 2026, confrontando con le misure reali
4. scrive data/tides.json: estremi (alte/basse) per ~13 mesi + curva ogni 10 min per 16 giorni

Uso: python3 build_tides.py OUT_DIR [--years 4]
"""
import json, sys, os, time, math, urllib.request
from datetime import datetime, timedelta, timezone
import numpy as np, pandas as pd, utide

IOC = 'https://www.ioc-sealevelmonitoring.org/service.php'
LAT = 28.4925
UTC = timezone.utc


def note(msg):
    print('::notice::' + str(msg).replace('\n', ' | '), flush=True)


def fetch(code, t0, t1):
    u = f'{IOC}?query=data&code={code}&timestart={t0:%Y-%m-%dT%H:%M}&timestop={t1:%Y-%m-%dT%H:%M}&format=json'
    for k in range(3):
        try:
            r = urllib.request.urlopen(urllib.request.Request(u, headers={'User-Agent': 'maxora-tides (github.com/STOCKED-APP/MAXORA)'}), timeout=90)
            return json.loads(r.read().decode())
        except Exception as e:
            err = e
            time.sleep(5 * (k + 1))
    print('fetch fail', code, t0, err)
    return []


_CACHE = {}


def minutes(code, start, end):
    """serie al minuto pulita (sensore principale), scaricata in parallelo a blocchi di 10 giorni"""
    key = (code, start, end)
    if key in _CACHE:
        return _CACHE[key]
    from concurrent.futures import ThreadPoolExecutor
    spans, t = [], start
    while t < end:
        spans.append((t, min(t + timedelta(days=10), end)))
        t = spans[-1][1]
    t0 = time.time()
    with ThreadPoolExecutor(6) as ex:
        parts = list(ex.map(lambda sp: fetch(code, *sp), spans))
    rows = [x for d in parts for x in d if isinstance(x, dict) and x.get('slevel') is not None]
    print(f'{code}: {len(rows)} righe in {time.time()-t0:.0f}s', flush=True)
    if not rows:
        _CACHE[key] = (pd.Series(dtype=float), None)
        return _CACHE[key]
    df = pd.DataFrame(rows)
    main = df['sensor'].value_counts().idxmax()  # sensore principale = quello con più dati
    df = df[df['sensor'] == main]
    s = pd.Series(df['slevel'].astype(float).values, index=pd.to_datetime(df['stime'], utc=True)).sort_index()
    s = s[~s.index.duplicated()]
    s = s[(s > -50) & (s < 50)]
    med = s.rolling('15min', center=True).median()  # via picchi > 25 cm dalla mediana di 15 min
    s = s[(s - med).abs() < 0.25]
    _CACHE[key] = (s, main)
    return _CACHE[key]


def history(code, start, end):
    s, main = minutes(code, start, end)
    if s.empty:
        return pd.Series(dtype=float), None
    # valore istantaneo allo scoccare dell'ora (media di 11 min centrata): nessuno sfasamento
    sm = s.rolling('11min', center=True, min_periods=5).mean()
    grid = pd.date_range(s.index[0].ceil('1h'), s.index[-1].floor('1h'), freq='1h')
    h = sm.reindex(grid, method='nearest', tolerance=pd.Timedelta('3min'))
    return h, main


def solve(h):
    h = h.dropna()
    t = h.index.tz_convert(None).to_pydatetime()
    return utide.solve(t, h.values, lat=LAT, method='ols', conf_int='linear', trend=False, nodal=True, verbose=False)


def predict(coef, idx):
    t = pd.DatetimeIndex(idx).tz_convert(None).to_pydatetime() if getattr(idx, 'tz', None) else pd.DatetimeIndex(idx).to_pydatetime()
    return utide.reconstruct(t, coef, verbose=False).h


def extremes(times, vals):
    """alte/basse dalla curva fine, con raffinamento parabolico"""
    out = []
    for i in range(1, len(vals) - 1):
        a, b, c = vals[i - 1], vals[i], vals[i + 1]
        if (b > a and b >= c) or (b < a and b <= c):
            den = a - 2 * b + c
            off = 0.5 * (a - c) / den if den else 0.0
            dt = (times[i + 1] - times[i]).total_seconds()
            tt = times[i] + timedelta(seconds=off * dt)
            hh = b - 0.25 * (a - c) * off
            out.append((tt, hh, 'H' if b > a else 'L'))
    return out


def main():
    out_dir = sys.argv[1] if len(sys.argv) > 1 else 'data'
    years = 4
    if '--years' in sys.argv:
        years = int(sys.argv[sys.argv.index('--years') + 1])
    os.makedirs(out_dir, exist_ok=True)
    now = datetime.now(UTC).replace(minute=0, second=0, microsecond=0)
    start = now - timedelta(days=365 * years)

    h, sensor = history('fue2', start, now)
    good = h.dropna()
    note(f'fue2 sensore={sensor} ore valide={len(good)} da {good.index.min()} a {good.index.max()} copertura={len(good)/max(1,len(h)):.0%}')

    # --- verifica su dati mai visti ---
    split = pd.Timestamp('2026-01-01', tz='UTC')
    train, test = h[h.index < split], h[h.index >= split].dropna()
    report = {}
    if train.dropna().shape[0] > 24 * 300 and len(test) > 24 * 60:
        c1 = solve(train)
        p = predict(c1, test.index)
        resid = test.values - p
        resid_d = resid - np.nanmean(resid)  # datum identico, ma toglie eventuale deriva del sensore
        rmse = float(np.sqrt(np.nanmean(resid_d ** 2)))
        # estremi: curva prevista ogni 6 min vs osservata (min 1) lisciata
        fine_idx = pd.date_range(split, split + timedelta(days=60), freq='6min', tz='UTC')
        pf = predict(c1, fine_idx)
        pe = extremes(list(fine_idx.to_pydatetime()), pf)
        # osservati: serie al minuto lisciata (30 min)
        so = minutes('fue2', start, now)[0]
        so = so[(so.index >= split) & (so.index < split + timedelta(days=60))]
        sm = so.resample('6min').mean().interpolate(limit=5).rolling(5, center=True).mean()
        oe = extremes(list(sm.index.to_pydatetime()), sm.values)
        oe = [e for e in oe if not math.isnan(e[1])]
        # accoppia ogni estremo previsto con l'osservato dello stesso tipo più vicino (entro 2 h)
        dts, dhs = [], []
        off = float(np.nanmean(resid))
        for tt, hh, k in pe:
            cand = [e for e in oe if e[2] == k and abs((e[0] - tt).total_seconds()) < 7200]
            if cand:
                e = min(cand, key=lambda e: abs((e[0] - tt).total_seconds()))
                dts.append((e[0] - tt).total_seconds() / 60)
                dhs.append((e[1] - (hh + off)) * 100)
        dts, dhs = np.array(dts), np.array(dhs)
        report = {
            'test_hours': int(len(test)), 'rmse_cm_all_effects': round(rmse * 100, 1),
            'extremes_matched': int(len(dts)),
            'time_err_min_median_abs': round(float(np.median(np.abs(dts))), 1) if len(dts) else None,
            'time_err_min_p90_abs': round(float(np.percentile(np.abs(dts), 90)), 1) if len(dts) else None,
            'height_err_cm_median_abs': round(float(np.median(np.abs(dhs))), 1) if len(dhs) else None,
            'height_err_cm_p90_abs': round(float(np.percentile(np.abs(dhs), 90)), 1) if len(dhs) else None,
        }
        note('VERIFICA 2026 (mai vista): ' + json.dumps(report))

    # --- modello finale su tutto lo storico ---
    coef = solve(h)
    names = list(coef['name'])
    top = sorted(zip(names, coef['A'], coef['g']), key=lambda x: -x[1])[:8]
    note('costanti principali: ' + ', '.join(f'{n} {a*100:.1f}cm {g:.0f}°' for n, a, g in top))

    # zero = livello più basso previsto nei prossimi ~19 anni (≈ LAT / cero hidrográfico)
    long_idx = pd.date_range(now, now + timedelta(days=365 * 19), freq='1h', tz='UTC')
    lp = predict(coef, long_idx)
    zero = float(lp.min())
    note(f'escursione max prevista 19 anni: {(lp.max()-lp.min())*100:.0f} cm')

    fine = pd.date_range(now - timedelta(days=1), now + timedelta(days=400), freq='6min', tz='UTC')
    pf = predict(coef, fine) - zero
    ex = extremes(list(fine.to_pydatetime()), pf)
    curve_idx = pd.date_range(now - timedelta(days=1), now + timedelta(days=16), freq='10min', tz='UTC')
    cv = predict(coef, curve_idx) - zero

    data = {
        'station': {'name': 'Puerto del Rosario', 'source': 'IOC Sea Level Station Monitoring Facility (fue2) · REDMAR Puertos del Estado', 'lat': 28.4925, 'lng': -13.8582},
        'generated': now.isoformat(), 'datum': 'min previsto 19 anni (≈ cero hidrográfico)', 'units': 'cm',
        'sensor_zero_offset_m': round(zero, 4),
        'validation': report,
        'extremes': [[e[0].strftime('%Y-%m-%dT%H:%MZ'), round(e[1] * 100), e[2]] for e in ex],
        'curve': {'start': curve_idx[0].strftime('%Y-%m-%dT%H:%MZ'), 'step_min': 10, 'cm': [int(round(v * 100)) for v in cv]},
        'constituents': [{'n': n, 'A': round(float(a), 4), 'g': round(float(g), 2)} for n, a, g in zip(names, coef['A'], coef['g'])],
        'mean_m': round(float(coef['mean']), 4),
    }
    with open(os.path.join(out_dir, 'tides.json'), 'w') as f:
        json.dump(data, f, separators=(',', ':'))
    nxt = [e for e in data['extremes'] if e[0] >= now.strftime('%Y-%m-%dT%H:%MZ')][:4]
    note('prossime maree (UTC): ' + json.dumps(nxt))

    # differenze con altri mareografi delle Canarie (per stimare Corralejo / costa ovest)
    try:
        sl = json.loads(urllib.request.urlopen(IOC + '?query=stationlist&showall=all&format=json', timeout=120).read().decode())
        can = [x for x in sl if x.get('Lat') and 27.5 < x['Lat'] < 29.5 and -18.5 < x['Lon'] < -13.2]
        note('mareografi Canarie IOC: ' + ', '.join(f"{x['Code']}({x['Location']},{x['Lat']:.2f},{x['Lon']:.2f},st={x.get('status')})" for x in can))
        ref = dict(zip(names, zip(coef['A'], coef['g'])))
        for x in can:
            if x['Code'] in ('fue2', 'fuer2'):
                continue
            hh, _ = history(x['Code'], now - timedelta(days=120), now)
            if hh.dropna().shape[0] < 24 * 90:
                continue
            c = solve(hh)
            d = dict(zip(c['name'], zip(c['A'], c['g'])))
            if 'M2' in d:
                dg = (d['M2'][1] - ref['M2'][1] + 180) % 360 - 180
                note(f"{x['Code']} {x['Location']}: M2 {d['M2'][0]*100:.1f}cm vs {ref['M2'][0]*100:.1f}cm, ritardo M2 {dg*12.42*60/360:+.1f} min")
    except Exception as e:
        note('confronto stazioni fallito: ' + repr(e))


if __name__ == '__main__':
    main()
