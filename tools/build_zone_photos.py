#!/usr/bin/env python3
"""Maxora — una foto della zona per ogni spot surf e ogni percorso bici/corsa.

Cerca su Wikimedia Commons le foto geolocalizzate vicino al punto (licenza libera, orizzontali),
scarta mappe, cartelli, interni, cibo, ritratti… e tiene la più adatta (paesaggio, costa, onde).
Scrive data/zone_photos.json:  { "surf": {id: foto}, "routes": {id: foto} }
foto = { url (640 px), author, license, source }
Con SHEET=cartella crea anche dei fogli di controllo (miniature con il nome) per verificare a occhio.
"""
import json, math, os, re, sys, time, html, urllib.parse, urllib.request

UA = 'Maxora/0.6 (https://github.com/STOCKED-APP/MAXORA; zone photo picker)'
API = 'https://commons.wikimedia.org/w/api.php'
FREE = re.compile(r'^(CC0|Public domain|PD|CC BY(-SA)? ?\d|CC BY(-SA)?$|CC-BY|Attribution)', re.I)
GOOD = ['playa', 'beach', 'surf', 'ola', 'wave', 'coast', 'costa', 'dune', 'duna', 'sea', 'mar ', 'ocean', 'océano', 'faro', 'lighthouse',
        'sunset', 'atardecer', 'mirador', 'view', 'vista', 'paisaje', 'landscape', 'volcan', 'volcán', 'montaña', 'mountain', 'barranco',
        'camino', 'path', 'trail', 'sendero', 'road', 'carretera', 'cliff', 'acantilado', 'bay', 'bahía', 'reef', 'arrecife', 'panorama', 'shore']
BAD = ['map', 'mapa', 'plano', 'logo', 'sign', 'cartel', 'señal', 'panel', 'interior', 'room', 'habitación', 'hotel', 'apartment', 'apartamento',
       'menu', 'food', 'comida', 'restaurant', 'selfie', 'portrait', 'retrato', 'people', 'bus ', 'coche', 'airport', 'aeropuerto', 'graffiti',
       'shop', 'tienda', 'supermarket', 'flower', 'flor', 'plant', 'planta', 'insect', 'lizard', 'lagarto', 'bird', 'pájaro', 'macro', 'goat',
       'cabra', 'cat ', 'dog', 'perro', 'gato', 'diagram', 'coat of arms', 'escudo', 'stamp', 'poster', 'screenshot', 'satellite', 'aerial photo',
       'license plate', 'matrícula', 'statue', 'estatua', 'museum', 'museo', 'pool', 'piscina', 'bed ', 'cama', 'toilet', 'baño']

# foto scartate a occhio (non mostrano la zona)
BLOCK = set(['File:January Desert Storm Africa Las Dunas Ocean Beach Corralejo - Fuertaventura Photography 1992 Zahara Winds - panoramio.jpg', 'File:Vintage Reflection (36368057374).jpg', 'File:Antigua - panoramio - brunobarbato.jpg', 'File:Punica granatum (32872961882).jpg', 'File:Colonia Agrícola Penitenciaria de Tefía 06.jpg', 'File:Betancuria, 35637, Las Palmas, Spain - panoramio (122).jpg', 'File:Morro Jable (Fuerteventura, Spain), Strand -- 2025 -- 2483.jpg', 'File:Balaenoptera physalus skeleton - Salinas del Carmen.jpg'])

def get(params):
    q = API + '?' + urllib.parse.urlencode(params)
    last = None
    for attempt in range(4):
        try:
            with urllib.request.urlopen(urllib.request.Request(q, headers={'User-Agent': UA}), timeout=40) as r:
                return json.load(r)
        except Exception as e:
            last = e; time.sleep(2 + attempt * 3)
    raise last

def clean(s):
    return html.unescape(re.sub(r'<[^>]+>', '', s or '')).strip()

def km(a, b):
    dl = math.radians(b[0] - a[0]); dn = math.radians(b[1] - a[1])
    x = math.sin(dl / 2) ** 2 + math.cos(math.radians(a[0])) * math.cos(math.radians(b[0])) * math.sin(dn / 2) ** 2
    return 6371 * 2 * math.asin(math.sqrt(x))

def near(lat, lng, radius):
    d = get({'action': 'query', 'format': 'json', 'generator': 'geosearch', 'ggscoord': '%f|%f' % (lat, lng), 'ggsradius': radius,
             'ggsnamespace': 6, 'ggslimit': 60, 'prop': 'imageinfo|coordinates', 'iiprop': 'url|size|extmetadata|mime', 'iiurlwidth': 640})
    return list(((d.get('query') or {}).get('pages') or {}).values())

def candidates(points, radius, used):
    out = {}
    for (lat, lng) in points:
        try: pages = near(lat, lng, radius)
        except Exception as e: print('geosearch', e); continue
        for p in pages:
            ii = (p.get('imageinfo') or [{}])[0]
            t = p['title']
            if t in used or t in out or t in BLOCK or not ii.get('thumburl'): continue
            if ii.get('mime') != 'image/jpeg': continue
            w, h = ii.get('width', 0), ii.get('height', 0)
            if w < 1200 or w < h * 1.25: continue
            md = ii.get('extmetadata') or {}
            lic = clean((md.get('LicenseShortName') or {}).get('value'))
            if not FREE.match(lic): continue
            hay = (t + ' ' + clean((md.get('ImageDescription') or {}).get('value')) + ' ' + clean((md.get('Categories') or {}).get('value'))).lower()
            if any(b in hay for b in BAD): continue
            c = (p.get('coordinates') or [{}])[0]
            dist = min(km((c.get('lat', lat), c.get('lon', lng)), pt) for pt in points)
            cats = clean((md.get('Categories') or {}).get('value'))
            s = -dist * 1.2
            if re.search(r'Quality images|Featured pictures|Valued images', cats): s += 3
            s += min(3, sum(1 for g in GOOD if g in hay)) * 0.8
            if 'fuerteventura' in hay: s += 0.5
            out[t] = (s, {'url': ii['thumburl'], 'author': clean((md.get('Artist') or {}).get('value'))[:100] or 'Wikimedia Commons',
                          'license': lic, 'source': ii.get('descriptionurl'), 'title': t})
        time.sleep(0.4)
    return sorted(out.values(), key=lambda x: -x[0])

def main():
    root = sys.argv[1] if len(sys.argv) > 1 else '.'
    spots = json.load(open(os.path.join(root, 'data/surf_spots.json'), encoding='utf-8'))['spots']
    routes = json.load(open(os.path.join(root, 'data/routes.json'), encoding='utf-8'))['routes']
    res = {'generated': time.strftime('%Y-%m-%dT%H:%MZ', time.gmtime()), 'source': 'Wikimedia Commons', 'surf': {}, 'routes': {}}
    used = set()
    jobs = [('surf', s['id'], s['name'], [(s['lat'], s['lng'])], 1500) for s in spots]
    for r in routes:
        line = r.get('line') or []
        pts = [(r['start'][0], r['start'][1])] + [(line[i][1], line[i][0]) for i in range(len(line) // 4, len(line), max(1, len(line) // 4))][:3]
        jobs.append(('routes', r['id'], (r.get('name') or {}).get('es', r['id']), pts, 1000))
    sheet = []
    for kind, id_, name, pts, radius in jobs:
        c = candidates(pts, radius, used)
        if not c or c[0][0] < -2.5:
            print('::notice::%s %s: nessuna foto adatta' % (kind, id_)); continue
        best = c[0][1]
        used.add(best['title'])
        res[kind][id_] = {k: best[k] for k in ('url', 'author', 'license', 'source')}
        sheet.append((kind + ':' + id_, name, best['url']))
        print('::notice::%s %s -> %s (%.1f)' % (kind, id_, best['title'], c[0][0]))
    with open(os.path.join(root, 'data/zone_photos.json'), 'w', encoding='utf-8') as f:
        json.dump(res, f, ensure_ascii=False, indent=1)
    out = os.environ.get('SHEET')
    if out: contact(sheet, out)

def contact(items, out):
    from PIL import Image, ImageDraw
    import io
    os.makedirs(out, exist_ok=True)
    W, H, cols = 320, 214, 4
    for n in range(0, len(items), 16):
        part = items[n:n + 16]
        rows = math.ceil(len(part) / cols)
        img = Image.new('RGB', (W * cols, (H + 22) * rows), 'white')
        d = ImageDraw.Draw(img)
        for i, (key, name, url) in enumerate(part):
            x, y = (i % cols) * W, (i // cols) * (H + 22)
            try:
                with urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': UA}), timeout=40) as r:
                    im = Image.open(io.BytesIO(r.read())).convert('RGB')
                im.thumbnail((W - 4, H)); img.paste(im, (x + 2, y + 22))
            except Exception as e: print('thumb', key, e)
            d.text((x + 4, y + 4), (key + ' ' + name)[:52], fill='black')
            time.sleep(0.3)
        img.save(os.path.join(out, 'sheet-%02d.jpg' % (n // 16 + 1)), quality=82)

if __name__ == '__main__':
    main()
