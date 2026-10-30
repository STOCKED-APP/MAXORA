"""Maxora — sagoma della terraferma (Fuerteventura e Lobos) dalla linea di costa OpenStreetMap.
Serve all'animazione del mare: le onde si disegnano solo fuori da questi poligoni.
Uso: python3 build_land.py coast.geojsonseq data/land.json
"""
import json, sys
from shapely.geometry import shape, mapping, MultiPolygon
from shapely.ops import linemerge, polygonize, unary_union


def main(src, dst):
    lines = []
    for line in open(src, encoding='utf-8'):
        line = line.strip().lstrip('\x1e')
        if not line:
            continue
        g = shape(json.loads(line)['geometry'])
        if g.geom_type in ('LineString', 'MultiLineString'):
            lines.append(g)
    merged = linemerge(unary_union(lines))
    polys = [p for p in polygonize(merged) if p.area > 2e-6]
    land = unary_union(polys).simplify(0.0002, preserve_topology=True)
    if land.geom_type == 'Polygon':
        land = MultiPolygon([land])
    def rnd(c):
        return [rnd(x) for x in c] if isinstance(c[0], (list, tuple)) else [round(c[0], 5), round(c[1], 5)]
    m = mapping(land)
    m['coordinates'] = rnd(m['coordinates'])
    with open(dst, 'w') as f:
        json.dump({'type': 'Feature', 'properties': {'source': '© OpenStreetMap contributors (ODbL)'}, 'geometry': m}, f, separators=(',', ':'))
    n = sum(len(p[0]) for p in m['coordinates'])
    print('::notice::terraferma: %d poligoni, %d punti, area %.4f' % (len(m['coordinates']), n, land.area))
    if land.area < 0.1:
        sys.exit('sagoma troppo piccola: costa incompleta')


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
