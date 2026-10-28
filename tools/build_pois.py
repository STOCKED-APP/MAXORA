#!/usr/bin/env python3
"""Maxora — costruisce data/pois.json dai dati OpenStreetMap (estratto Geofabrik).

Uso:  python3 tools/build_pois.py <filtrato.geojsonseq> data/pois.json
Il file d'ingresso è prodotto da `osmium export` (vedi .github/workflows/pois.yml).
"""
import json, sys, datetime

AREAS = {'fuerteventura': (27.99, -14.55, 28.80, -13.80)}  # s, w, n, e

def cat_of(t):
    a, s, tu, sp = t.get('amenity'), t.get('shop'), t.get('tourism'), t.get('sport')
    if a in ('restaurant', 'fast_food'): return 'food'
    if a in ('cafe', 'bar', 'pub'): return 'drink'
    if t.get('natural') == 'beach': return 'beach'
    if a == 'fuel': return 'fuel'
    if s in ('supermarket', 'convenience'): return 'super'
    if a == 'pharmacy': return 'pharmacy'
    if tu == 'viewpoint': return 'view'
    if s == 'surf' or sp in ('surfing', 'kitesurfing', 'windsurfing'): return 'surf'
    if tu in ('hotel', 'apartment', 'hostel', 'guest_house'): return 'hotel'
    if a == 'parking' and t.get('access') != 'private': return 'parking'
    return None

UNNAMED_OK = {'fuel', 'pharmacy', 'parking'}
KEEP = ['brand', 'operator', 'cuisine', 'opening_hours', 'phone', 'contact:phone', 'website', 'contact:website',
        'addr:street', 'addr:housenumber', 'addr:city', 'addr:place', 'wheelchair', 'stars', 'fee', 'surface', 'capacity']

def center(geom):
    pts = []
    def walk(c):
        if isinstance(c[0], (int, float)): pts.append(c)
        else:
            for x in c: walk(x)
    walk(geom['coordinates'])
    if not pts: return None
    xs = [p[0] for p in pts]; ys = [p[1] for p in pts]
    # centro del riquadro: stabile anche per spiagge lunghe
    return (round((min(ys) + max(ys)) / 2, 6), round((min(xs) + max(xs)) / 2, 6))

def main(src, dst):
    out = {}
    seen = set()
    count = 0
    with open(src, encoding='utf-8') as f:
        for line in f:
            line = line.strip().lstrip('\x1e')
            if not line: continue
            ft = json.loads(line)
            t = ft.get('properties') or {}
            cat = cat_of(t)
            if not cat: continue
            c = center(ft['geometry'])
            if not c: continue
            lat, lng = c
            area = next((k for k, (s, w, n, e) in AREAS.items() if s <= lat <= n and w <= lng <= e), None)
            if not area: continue
            name = t.get('name') or t.get('brand') or t.get('operator') or ''
            if not name and cat not in UNNAMED_OK: continue
            oid = str(ft.get('id') or t.get('@id') or '')
            if oid in seen: continue
            seen.add(oid)
            tags = {k: t[k] for k in KEEP if t.get(k)}
            out.setdefault(cat, []).append([oid, name, lat, lng, tags])
            count += 1
    for v in out.values(): v.sort(key=lambda r: r[1])
    doc = {'generated_at': datetime.datetime.now(datetime.timezone.utc).isoformat(timespec='seconds'),
           'source': '© OpenStreetMap contributors (ODbL), extract by Geofabrik',
           'areas': list(AREAS), 'count': count, 'cats': out}
    with open(dst, 'w', encoding='utf-8') as f:
        json.dump(doc, f, ensure_ascii=False, separators=(',', ':'))
    print('::notice::pois %d %s' % (count, {k: len(v) for k, v in out.items()}))
    if count < 200:
        sys.exit('Troppo pochi punti (%d): qualcosa non va, non pubblico.' % count)

if __name__ == '__main__':
    try:
        main(sys.argv[1], sys.argv[2])
    except SystemExit as e:
        if e.code not in (0, None):
            print('::error::' + str(e.code).replace('\n', ' '))
        raise
    except Exception as e:
        import traceback
        tb = traceback.format_exc().strip().splitlines()
        print('::error::' + type(e).__name__ + ': ' + str(e)[:300] + ' | ' + ' / '.join(tb[-4:])[:600])
        sys.exit(1)
