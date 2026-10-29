"""Maxora — aree protette di Fuerteventura da OpenStreetMap (parchi naturali, riserve, ZEPA…):
lì non si può pernottare né campeggiare. Geometrie semplificate (~25 m) per pesare poco.
Uso: python3 build_protected.py prot.geojsonseq data/protected.json
"""
import json, sys
from shapely.geometry import shape, mapping
from shapely.ops import unary_union

BOX = (-14.55, 27.99, -13.80, 28.80)


def main(src, dst):
    feats = []
    for line in open(src, encoding='utf-8'):
        line = line.strip().lstrip('\x1e')
        if not line:
            continue
        ft = json.loads(line)
        p = ft.get('properties') or {}
        try:
            g = shape(ft['geometry'])
        except Exception:
            continue
        if not g.is_valid:
            g = g.buffer(0)
        x0, y0, x1, y1 = g.bounds
        if x1 < BOX[0] or x0 > BOX[2] or y1 < BOX[1] or y0 > BOX[3] or g.area < 1e-6:
            continue
        name = p.get('name') or p.get('name:es') or ''
        if not name:
            continue
        g = g.simplify(0.00025, preserve_topology=True)
        m = mapping(g)
        def rnd(c):
            return [rnd(x) for x in c] if isinstance(c[0], (list, tuple)) else [round(c[0], 5), round(c[1], 5)]
        m['coordinates'] = rnd(m['coordinates'])
        feats.append({'type': 'Feature', 'properties': {'name': name, 'cls': p.get('protect_class') or p.get('protection_title') or p.get('leisure') or ''}, 'geometry': m})
    # niente doppioni con lo stesso nome (relazione e via): tengo il più grande
    best = {}
    for f in feats:
        a = shape(f['geometry']).area
        if f['properties']['name'] not in best or a > best[f['properties']['name']][0]:
            best[f['properties']['name']] = (a, f)
    out = [f for _, f in sorted(best.values(), key=lambda x: -x[0])]
    doc = {'type': 'FeatureCollection', 'source': '© OpenStreetMap contributors (ODbL)', 'features': out}
    with open(dst, 'w', encoding='utf-8') as fh:
        json.dump(doc, fh, ensure_ascii=False, separators=(',', ':'))
    print('::notice::aree protette %d: %s' % (len(out), ', '.join(f['properties']['name'] for f in out)[:900]))


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
