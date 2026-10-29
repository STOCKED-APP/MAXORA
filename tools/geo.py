#!/usr/bin/env python3
"""Maxora — coordinate esatte da OpenStreetMap (Nominatim) per nomi di luoghi. Uso: geo.py "Nome 1" "Nome 2" ..."""
import json, sys, time, urllib.parse, urllib.request
UA = 'Maxora/0.5 (https://github.com/STOCKED-APP/MAXORA)'
for q in sys.argv[1:]:
    url = 'https://nominatim.openstreetmap.org/search?' + urllib.parse.urlencode({'q': q, 'format': 'jsonv2', 'limit': 3, 'viewbox': '-14.6,28.85,-13.75,27.95', 'bounded': 1})
    with urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': UA}), timeout=30) as r:
        res = json.load(r)
    for x in res:
        print('::notice::%s => %s %s %s/%s %s' % (q, x['lat'], x['lon'], x.get('category'), x.get('type'), x['display_name'][:80]))
    if not res: print('::notice::%s => nessun risultato' % q)
    time.sleep(1.2)
