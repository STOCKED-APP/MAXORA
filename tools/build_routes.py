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
    for e in ele[1:]:        # isteresi 5 m: ignora il rumore del modello del terreno
        if e - ref >= 5: gain += e - ref; ref = e
        elif ref - e >= 5: loss += ref - e; ref = e
    # pendenza massima su tratti di 500 m (più corti sono troppo influenzati dal modello)
    maxg, j = 0.0, 0
    for i in range(len(dist)):
        while j < len(dist) and dist[j] - dist[i] < 500: j += 1
        if j < len(dist): maxg = max(maxg, (ele[j] - ele[i]) / (dist[j] - dist[i]) * 100)
    # salita principale: tratto in salita che non scende mai più di 15 m
    best, start, top = None, 0, 0
    for i in range(1, len(ele)):
        if ele[i] > ele[top]: top = i
        if ele[top] - ele[i] > 15 or i == len(ele) - 1:
            g = ele[top] - ele[start]
            if g >= 40 and (best is None or g > best[0]): best = (g, start, top)
            start = top = i
        if ele[i] < ele[start]: start = top = i
    main = None
    if best:
        L = dist[best[2]] - dist[best[1]]
        main = {'from_km': round(dist[best[1]] / 1000, 1), 'km': round(L / 1000, 1), 'gain': int(round(best[0])), 'avg': round(float(best[0] / L * 100), 1)}
    return int(round(gain)), int(round(loss)), round(float(maxg), 1), main


REPORT = []
MAX_SNAP = 250      # se il tracciato passa a più di 250 m da una tappa, il percorso è sbagliato: non lo pubblico


def main():
    src, dst = sys.argv[1], sys.argv[2]
    pbf = sys.argv[3] if len(sys.argv) > 3 else None
    routes = json.load(open(src))['routes']
    peaks = osm_peaks(pbf) if pbf else {}
    out = []
    for r in routes:
        try:
            o = build_one(r, peaks)
        except Exception as e:
            import traceback; traceback.print_exc()
            REPORT.append({'id': r['id'], 'error': repr(e)})
            continue
        if o:
            out.append(o)
        time.sleep(1.5)
    if pbf:
        for r in osm_routes(pbf):
            try:
                o = finalize(r, r.pop('_coords'), [])
            except Exception as e:
                REPORT.append({'id': r['id'], 'error': repr(e)})
                continue
            if o:
                out.append(o)
    return finish(routes, out, dst)


def resolve_via(via, peaks):
    """una tappa può essere ["@Nome della cima"]: la posizione si prende da OpenStreetMap"""
    res = []
    for v in via:
        if isinstance(v[0], str) and v[0].startswith('@'):
            p = peaks.get(v[0][1:])
            if not p:
                raise ValueError('cima non trovata: ' + v[0])
            res.append([v[0][1:], p[0], p[1]])
        else:
            res.append(v)
    return res


def build_one(r, peaks):
    via = resolve_via(r['via'], peaks)
    rt = route(r['sport'], via)
    if not rt:
        REPORT.append({'id': r['id'], 'error': 'non tracciato'})
        return None
    coords = rt['geometry']['coordinates']
    snap = [round(hav([lng, lat], min(coords, key=lambda c: hav(c, [lng, lat])))) for _, lat, lng in via]
    # una cima deve essere raggiunta davvero (entro 120 m), le altre tappe entro 250 m
    peak_bad = any(isinstance(v[0], str) and v[0].startswith('@') and sn > 120 for v, sn in zip(r['via'], snap))
    if max(snap) > MAX_SNAP or peak_bad:
        REPORT.append({'id': r['id'], 'error': 'tappa lontana dal tracciato', 'snap': snap})
        note(f"{r['id']}: scartato, tappe a {snap} m dal tracciato")
        return None
    return finalize(r, coords, snap)


def finalize(r, coords, snap):
        pts, dist, total = resample(coords, 25)
        ele = smooth(elevations(pts), 7)
        gain, loss, maxg, main_climb = climb_stats(dist, list(ele))
        if r.get('official') and not r.get('loop') and loss > gain:
            # sentiero lineare: lo mostriamo nel verso in salita, come si percorre di solito
            coords = list(reversed(coords))
            pts, dist, total = resample(coords, 25)
            ele = smooth(elevations(pts), 7)
            gain, loss, maxg, main_climb = climb_stats(dist, list(ele))
        if r.get('back'):          # andata e ritorno
            total2 = total * 2
            gain, loss = gain + loss, loss + gain
        else:
            total2 = total
        if r.get('level') is None:   # difficoltà stimata per i sentieri importati
            r['level'] = 3 if (gain > 600 or total2 > 25000) else 2 if (gain > 250 or total2 > 10000) else 1
        n = len(dist)
        idx = sorted(set([round(i * (n - 1) / 159) for i in range(160)])) if n > 160 else list(range(n))
        prof = [[round(dist[i] / 1000, 2), round(float(ele[i]))] for i in idx]
        line = [[round(p[0], 5), round(p[1], 5)] for p in pts]
        o = {k: r[k] for k in ('id', 'sport', 'surface', 'loop', 'level', 'name', 'note', 'ref', 'official') if k in r}
        o.update({
            'back': bool(r.get('back')),
            'km': round(total2 / 1000, 1), 'oneway_km': round(total / 1000, 1),
            'gain': gain, 'loss': loss, 'max_grade': maxg, 'climb': main_climb,
            'ele_min': round(float(min(ele))), 'ele_max': round(float(max(ele))),
            'start': [line[0][1], line[0][0]],
            'line': line, 'profile': prof,
        })
        REPORT.append({'id': r['id'], 'km': o['km'], 'gain': gain, 'max_grade': maxg, 'ele': [o['ele_min'], o['ele_max']], 'snap': snap, 'loop': o.get('loop')})
        return o


def osm_peaks(pbf):
    import osmium
    class H(osmium.SimpleHandler):
        def __init__(s): super().__init__(); s.p = {}
        def node(s, n):
            t = n.tags
            if t.get('natural') in ('volcano', 'peak') and t.get('name'):
                s.p[t.get('name')] = (n.location.lat, n.location.lon)
    h = H(); h.apply_file(pbf)
    return h.p


SKIP_REL = {'GR 131', 'E7'}
NOTE_TRAIL = {'es': 'Sendero oficial {ref}, señalizado en el terreno.', 'en': 'Official trail {ref}, waymarked on the ground.',
              'it': 'Sentiero ufficiale {ref}, segnalato sul terreno.', 'de': 'Offizieller Wanderweg {ref}, vor Ort markiert.'}
NOTE_BIKE = {'es': 'Ruta ciclista señalizada {ref}.', 'en': 'Signed cycling route {ref}.', 'it': 'Percorso ciclabile segnalato {ref}.', 'de': 'Beschilderte Radroute {ref}.'}


def osm_routes(pbf):
    """sentieri e percorsi ufficiali mappati su OpenStreetMap (relazioni route=hiking/bicycle/mtb…)"""
    import osmium
    class Rel(osmium.SimpleHandler):
        def __init__(s): super().__init__(); s.rels = []
        def relation(s, r):
            t = r.tags
            if t.get('type') == 'route' and t.get('route') in ('hiking', 'foot', 'walking', 'running', 'bicycle', 'mtb'):
                ref = t.get('ref', '')
                if ref in SKIP_REL or t.get('network') in ('iwn', 'nwn'):
                    return
                s.rels.append({'id': r.id, 'route': t.get('route'), 'name': t.get('name') or ref, 'ref': ref,
                               'ways': [m.ref for m in r.members if m.type == 'w']})
    rh = Rel(); rh.apply_file(pbf)
    need = {w for r in rh.rels for w in r['ways']}
    class Way(osmium.SimpleHandler):
        def __init__(s): super().__init__(); s.g = {}
        def way(s, w):
            if w.id in need:
                try: s.g[w.id] = [[n.lon, n.lat] for n in w.nodes]
                except osmium.InvalidLocationError: pass
    wh = Way(); wh.apply_file(pbf, locations=True)
    out = []
    for r in rh.rels:
        segs = [wh.g[w] for w in r['ways'] if w in wh.g and len(wh.g[w]) > 1]
        if not segs:
            continue
        line = list(segs[0])
        if len(segs) > 1 and min(hav(line[0], segs[1][0]), hav(line[0], segs[1][-1])) < min(hav(line[-1], segs[1][0]), hav(line[-1], segs[1][-1])):
            line.reverse()
        gaps = 0
        for sgm in segs[1:]:
            a, b = hav(line[-1], sgm[0]), hav(line[-1], sgm[-1])
            sg = sgm if a <= b else list(reversed(sgm))
            if min(a, b) > 150: gaps += 1
            line.extend(sg[1:] if min(a, b) < 1 else sg)
        if gaps > 2:
            REPORT.append({'id': 'osm-%d' % r['id'], 'name': r['name'], 'error': 'tracciato a pezzi (%d salti)' % gaps})
            continue
        is_bike = r['route'] in ('bicycle', 'mtb')
        nm = r['name'] if (not r['ref'] or r['ref'] in r['name']) else r['name'] + ' · ' + r['ref']
        loop = hav(line[0], line[-1]) < 300
        out.append({'id': 'osm-%d' % r['id'], 'sport': 'bike' if is_bike else 'run',
                    'surface': ('gravel' if r['route'] == 'mtb' else 'road') if is_bike else 'trail',
                    'loop': loop, 'level': None, 'official': True, 'ref': r['ref'],
                    'name': {k: nm for k in ('es', 'en', 'it', 'de')},
                    'note': {k: (NOTE_BIKE if is_bike else NOTE_TRAIL)[k].replace('{ref}', r['ref'] or '') for k in NOTE_TRAIL},
                    '_coords': line})
    return out


def finish(routes, out, dst):
    doc = {'generated': time.strftime('%Y-%m-%dT%H:%MZ', time.gmtime()),
           'source': 'Percorsi: © OpenStreetMap contributors (ODbL), router FOSSGIS OSRM · Quote: Copernicus DEM GLO-30 © DLR/Airbus, ESA',
           'routes': out}
    with open(dst, 'w') as f:
        json.dump(doc, f, separators=(',', ':'), ensure_ascii=False)
    with open(dst.replace('.json', '_report.json'), 'w') as f:
        json.dump(REPORT, f, ensure_ascii=False, indent=0)
    note(f'{len(out)} percorsi pubblicati; scartati: ' + ', '.join(x['id'] for x in REPORT if 'error' in x))
    if len(out) < len(routes) // 2:
        sys.exit('troppi percorsi mancanti')


if __name__ == '__main__':
    main()
