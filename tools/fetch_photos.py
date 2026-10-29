#!/usr/bin/env python3
"""Maxora — cerca su Wikimedia Commons foto con licenza libera per le mete più belle.

Per ogni meta: prima le "Quality/Featured/Valued images", poi la ricerca normale.
Tiene solo licenze libere (CC0, PD, CC BY, CC BY-SA), orizzontali e grandi.
Scrive out/<slug>/<n>.jpg (1280 px) e out/<slug>/meta.json con autore, licenza, link.
"""
import json, os, re, sys, time, html, urllib.parse, urllib.request

UA = 'Maxora/0.5 (https://github.com/STOCKED-APP/MAXORA; places photo picker)'
API = 'https://commons.wikimedia.org/w/api.php'
WD = 'https://www.wikidata.org/w/api.php'
OUT = sys.argv[1] if len(sys.argv) > 1 else 'out'
PER_PLACE = 5

PLACES = [
    ('cofete', 'Playa de Cofete', ['Cofete beach', 'Playa de Cofete'], 'Playa de Cofete'),
    ('sotavento', 'Playa de Sotavento', ['Playa de Sotavento', 'Risco del Paso'], 'Playa de Sotavento'),
    ('dunas-corralejo', 'Dunas de Corralejo', ['Corralejo dunes', 'Parque Natural de Corralejo'], 'Parque natural de Corralejo'),
    ('isla-de-lobos', 'Isla de Lobos', ['Isla de Lobos', 'Lobos Fuerteventura'], 'Isla de Lobos'),
    ('el-cotillo', 'Lagunas de El Cotillo', ['El Cotillo lagoons', 'El Cotillo playa'], 'El Cotillo'),
    ('ajuy', 'Cuevas de Ajuy', ['Ajuy caves', 'Ajuy Fuerteventura'], 'Cuevas de Ajuy'),
    ('garcey', 'Playa del Garcey', ['Playa de Garcey', 'American Star wreck'], 'Playa de Garcey'),
    ('morro-velosa', 'Mirador Morro Velosa', ['Morro Velosa', 'Mirador Morro Velosa'], 'Mirador de Morro Velosa'),
    ('calderon-hondo', 'Calderón Hondo', ['Calderon Hondo', 'Calderón Hondo Lajares'], 'Calderón Hondo'),
    ('entallada', 'Faro de la Entallada', ['Faro de la Entallada', 'Entallada lighthouse'], 'Faro de la Entallada'),
    ('betancuria', 'Betancuria', ['Betancuria', 'Betancuria church'], 'Betancuria'),
    ('morro-jable', 'Playa del Matorral, Morro Jable', ['Morro Jable beach', 'Playa del Matorral'], 'Playa del Matorral'),
    ('la-pared', 'Playa de La Pared', ['Playa de La Pared', 'La Pared Fuerteventura'], 'Playa de La Pared'),
    ('las-penitas', 'Barranco de las Peñitas', ['Barranco de las Peñitas', 'Vega de Rio Palmas'], 'Barranco de las Peñitas'),
    ('punta-jandia', 'Faro de Punta Jandía', ['Faro de Punta Jandia', 'Punta Jandia lighthouse'], 'Faro de Punta Jandía'),
]
FREE = re.compile(r'^(CC0|Public domain|PD|CC BY(-SA)? ?\d|CC BY(-SA)?$|CC-BY|Attribution)', re.I)

def get(url, params):
    q = url + '?' + urllib.parse.urlencode(params)
    for attempt in range(4):
        try:
            req = urllib.request.Request(q, headers={'User-Agent': UA})
            with urllib.request.urlopen(req, timeout=40) as r:
                return json.load(r)
        except Exception as e:
            time.sleep(2 + attempt * 3)
            last = e
    raise last

def clean(s):
    s = re.sub(r'<[^>]+>', '', s or '')
    return html.unescape(s).strip()

def search_files(query):
    data = get(API, {'action': 'query', 'format': 'json', 'generator': 'search', 'gsrnamespace': 6,
                     'gsrsearch': query + ' filetype:bitmap', 'gsrlimit': 30,
                     'prop': 'imageinfo', 'iiprop': 'url|size|extmetadata|mime', 'iiurlwidth': 1280})
    pages = (data.get('query') or {}).get('pages') or {}
    return sorted(pages.values(), key=lambda p: p.get('index', 99))

def coords(term):
    try:
        s = get(WD, {'action': 'wbsearchentities', 'format': 'json', 'language': 'es', 'search': term, 'limit': 5})
        for hit in s.get('search', []):
            e = get(WD, {'action': 'wbgetentities', 'format': 'json', 'ids': hit['id'], 'props': 'claims'})
            c = e['entities'][hit['id']]['claims'].get('P625')
            if c:
                v = c[0]['mainsnak']['datavalue']['value']
                if 27.9 < v['latitude'] < 28.9 and -14.6 < v['longitude'] < -13.7:   # solo Fuerteventura
                    return {'lat': round(v['latitude'], 6), 'lng': round(v['longitude'], 6), 'wikidata': hit['id']}
    except Exception as e:
        print('coords', term, e)
    return None

def main():
    os.makedirs(OUT, exist_ok=True)
    index = []
    for slug, name, queries, wd in PLACES:
        picked, seen = [], set()
        tiers = []
        for q in queries:
            tiers.append('incategory:"Quality images" ' + q)
            tiers.append('incategory:"Featured pictures on Wikimedia Commons" ' + q)
            tiers.append('incategory:"Valued images" ' + q)
        tiers += queries
        for q in tiers:
            if len(picked) >= PER_PLACE: break
            try: pages = search_files(q)
            except Exception as e: print('search', q, e); continue
            for p in pages:
                if len(picked) >= PER_PLACE: break
                ii = (p.get('imageinfo') or [{}])[0]
                if p['title'] in seen or not ii.get('thumburl'): continue
                if ii.get('mime') not in ('image/jpeg', 'image/png', 'image/webp'): continue
                w, h = ii.get('width', 0), ii.get('height', 0)
                if w < 1600 or w < h * 1.2: continue           # grande e orizzontale
                md = ii.get('extmetadata') or {}
                lic = clean((md.get('LicenseShortName') or {}).get('value'))
                if not FREE.match(lic): continue
                seen.add(p['title'])
                n = len(picked) + 1
                fn = os.path.join(OUT, slug, '%d.jpg' % n)
                os.makedirs(os.path.dirname(fn), exist_ok=True)
                req = urllib.request.Request(ii['thumburl'], headers={'User-Agent': UA})
                with urllib.request.urlopen(req, timeout=60) as r, open(fn, 'wb') as f: f.write(r.read())
                picked.append({
                    'file': '%d.jpg' % n, 'title': p['title'], 'tier': 'quality' if 'incategory' in q else 'search',
                    'author': clean((md.get('Artist') or {}).get('value'))[:120] or 'Wikimedia Commons',
                    'license': lic, 'license_url': clean((md.get('LicenseUrl') or {}).get('value')),
                    'source': ii.get('descriptionurl'), 'width': w, 'height': h,
                    'description': clean((md.get('ImageDescription') or {}).get('value'))[:200]
                })
                time.sleep(0.5)
        c = coords(wd)
        meta = {'slug': slug, 'name': name, 'coords': c, 'photos': picked}
        with open(os.path.join(OUT, slug, 'meta.json') if picked else os.path.join(OUT, slug + '.json'), 'w', encoding='utf-8') as f:
            json.dump(meta, f, ensure_ascii=False, indent=1)
        index.append({'slug': slug, 'n': len(picked), 'coords': c})
        print('::notice::%s foto=%d coords=%s' % (slug, len(picked), c))
    with open(os.path.join(OUT, 'index.json'), 'w', encoding='utf-8') as f:
        json.dump(index, f, ensure_ascii=False, indent=1)

if __name__ == '__main__':
    main()
