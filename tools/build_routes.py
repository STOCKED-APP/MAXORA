"""Maxora — percorsi bici e corsa.

Per ogni percorso di data/routes_src.json:
1. lo traccia sulle strade/sentieri veri (router OSRM di FOSSGIS su dati OpenStreetMap, profilo bici o a piedi);
2. legge la quota ogni ~25 m dal modello del terreno Copernicus GLO-30 (gratuito, uso commerciale ammesso);
3. calcola distanza, dislivello, pendenza massima e la salita principale.
Scrive data/routes.json.

Uso: python3 build_routes.py data/routes_src.json data/routes.json
"""
import json, math, sys, time, urllib.request
import numpy as np

ROUTER = {'bike': 'https://routing.openstreetmap.de/routed-bike/route/v1/driving/',
          'run': 'https://routing.openstreetmap.de/routed-foot/route/v1/driving/'}
DEM = {
    (28, -14): 'https://copernicus-dem-30m.s3.amazonaws.com/Copernicus_DSM_COG_10_N28_00_W014_00_DEM/Copernicus_DSM_COG_10_N28_00_W014_00_DEM.tif',
    (28, -15): 'https://copernicus-dem-30m.s3.amazonaws.com/Copernicus_DSM_COG_10_N28_00_W015_00_DEM/Copernicus_DSM_COG_10_N28_00_W015_00_DEM.tif',
}
UA = {'User-Agent': 'Maxora/0.8 (+https://github.com/STOCKED-APP/MAXORA)'}


def note(m):
    print('::notice::' + str(m).replace('\n', ' | '), flush=True)


def hav(a, b):
    R = 6371000.0
    la1, lo1, la2, lo2 = map(math.radians, (a[1], a[0], b[1], b[0]))
    d = math.sin((la2 - la1) / 2) ** 2 + math.cos(la1) * math.cos(la2) * math.sin((lo2 - lo1) / 2) ** 2
    return 2 * R * math.asin(math.sqrt(d))


def route(sport, via):
    pts = ';'.join(f'{lng},{lat}' for _, lat, lng in via)
    u = ROUTER[sport] + pts + '?overview=full&geometries=geojson&continue_straight=false'
    for k in range(4):
        try:
            r = json.loads(urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=60).read().decode())
            if r.get('code') == 'Ok':
                return r['routes'][0]
            print('router', r.get('code'), r.get('message'), flush=True)
        except Exception as e:
            print('router errore', e, flush=True)
        time.sleep(3 * (k + 1))
    return None


def resample(coords, step):
    """punti ogni `step` metri lungo la linea"""
    out, dist = [coords[0]], [0.0]
    acc, total = 0.0, 0.0
    for a, b in zip(coords, coords[1:]):
        seg = hav(a, b)
        if seg == 0:
            continue
        pos = step - acc
        while pos <= seg:
            f = pos / seg
            out.append([a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f])
            dist.append(total + pos)
            pos += step
        acc = (acc + seg) % step
        total += seg
    if out[-1] != coords[-1]:
        out.append(coords[-1]); dist.append(total)
    return out, dist, total


_dem = {}
def elevations(pts):
    import rasterio
    res = []
    for lng, lat in pts:
        key = (math.floor(lat), math.floor(lng))
        if key not in _dem:
            _dem[key] = rasterio.open(DEM[key])
        ds = _dem[key]
        v = next(ds.sample([(lng, lat)]))[0]
        res.append(float(v))
    return res


def smooth(a, w=5):
    a = np.array(a, dtype=float)
    k = np.ones(w) / w
    pad = np.pad(a, (w // 2, w // 2), mode='edge')
    return np.convolve(pad, k, mode='valid')


def climb_stats(dist, ele):
    gain = loss = 0.0
    ref = ele[0]
    for e in ele[1:]:        # isteresi 3 m: ignora il rumore del modello
        if e - ref >= 3: gain += e - ref; ref = e
        elif ref - e >= 3: loss += ref - e; ref = e
    # pendenza su tratti di 200 m
    grades = []
    j = 0
    for i in range(len(dist)):
        while j < len(dist) and dist[j] - dist[i] < 200: j += 1
        if j < len(dist): grades.append((ele[j] - ele[i]) / (dist[j] - dist[i]) * 100)
    maxg = max(grades) if grades else 0
    # salita principale: tratto continuo in salita con più metri guadagnati
    best = (0, 0, 0)  # guadagno, inizio, fine
    lo_i = 0
    for i in range(1, len(ele)):
        if ele[i] < ele[lo_i]: lo_i = i
        g = ele[i] - ele[lo_i]
        if g > best[0]: best = (g, lo_i, i)
    main = None
    if best[0] >= 40:
        L = dist[best[2]] - dist[best[1]]
        main = {'from_km': round(dist[best[1]] / 1000, 1), 'km': round(L / 1000, 1), 'gain': round(best[0]), 'avg': round(best[0] / L * 100, 1)}
    return round(gain), round(loss), round(maxg, 1), main


def main():
    src, dst = sys.argv[1], sys.argv[2]
    routes = json.load(open(src))['routes']
    out = []
    for r in routes:
        rt = route(r['sport'], r['via'])
        if not rt:
            note(f"{r['id']}: percorso non tracciato, salto")
            continue
        coords = rt['geometry']['coordinates']
        # tappe: quanto lontano è finito il router dal punto voluto
        snap = [round(hav([lng, lat], min(coords, key=lambda c: hav(c, [lng, lat])))) for _, lat, lng in r['via']]
        pts, dist, total = resample(coords, 25)
        ele = smooth(elevations(pts), 7)
        gain, loss, maxg, main_climb = climb_stats(dist, list(ele))
        if r.get('back'):          # andata e ritorno
            total2 = total * 2
            gain, loss = gain + loss, loss + gain
        else:
            total2 = total
        # profilo: al massimo 160 punti
        n = len(dist)
        idx = sorted(set([round(i * (n - 1) / 159) for i in range(160)])) if n > 160 else list(range(n))
        prof = [[round(dist[i] / 1000, 2), round(float(ele[i]))] for i in idx]
        # linea per la mappa: un punto ogni ~25 m, 5 decimali
        line = [[round(p[0], 5), round(p[1], 5)] for p in pts]
        o = {k: r[k] for k in ('id', 'sport', 'surface', 'loop', 'level', 'name', 'note') if k in r}
        o.update({
            'back': bool(r.get('back')),
            'km': round(total2 / 1000, 1), 'oneway_km': round(total / 1000, 1),
            'gain': gain, 'loss': loss, 'max_grade': maxg, 'climb': main_climb,
            'ele_min': round(float(min(ele))), 'ele_max': round(float(max(ele))),
            'start': [line[0][1], line[0][0]],
            'line': line, 'profile': prof,
        })
        out.append(o)
        note(f"{r['id']}: {o['km']} km, +{gain} m, max {maxg}%, quota {o['ele_min']}–{o['ele_max']} m, scarto tappe {snap} m, salita {main_climb}")
        time.sleep(1.5)
    doc = {'generated': time.strftime('%Y-%m-%dT%H:%MZ', time.gmtime()),
           'source': 'Percorsi: © OpenStreetMap contributors (ODbL), router FOSSGIS OSRM · Quote: Copernicus DEM GLO-30 © DLR/Airbus, ESA',
           'routes': out}
    with open(dst, 'w') as f:
        json.dump(doc, f, separators=(',', ':'), ensure_ascii=False)
    if len(out) < len(routes) // 2:
        sys.exit('troppi percorsi mancanti')


if __name__ == '__main__':
    main()
