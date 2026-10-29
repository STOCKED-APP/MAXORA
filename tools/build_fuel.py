"""Maxora — prezzi carburante di Fuerteventura dal Ministerio para la Transición Ecológica (dati aperti, aggiornati più volte al giorno).

Scrive data/fuel.json: media e minimo dell'isola per tipo, e l'elenco delle stazioni con i prezzi.
Uso: python3 build_fuel.py data/fuel.json
"""
import json, sys, time, urllib.request
from datetime import datetime, timezone

URL = 'https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/FiltroProvincia/35'
MUNI = {'antigua', 'betancuria', 'la oliva', 'oliva (la)', 'pájara', 'pajara', 'puerto del rosario', 'tuineje'}
TYPES = {'g95': 'Precio Gasolina 95 E5', 'g98': 'Precio Gasolina 98 E5', 'diesel': 'Precio Gasoleo A', 'diesel_plus': 'Precio Gasoleo Premium', 'glp': 'Precio Gases licuados del petróleo'}


def note(m):
    print('::notice::' + str(m), flush=True)


def num(s):
    s = (s or '').strip().replace(',', '.')
    try:
        v = float(s)
        return v if v > 0 else None
    except ValueError:
        return None


def coord(s):
    try:
        return float((s or '').strip().replace(',', '.'))
    except ValueError:
        return None


def fetch():
    for k in range(5):
        try:
            req = urllib.request.Request(URL, headers={'Accept': 'application/json', 'User-Agent': 'Maxora/0.12 (+https://github.com/STOCKED-APP/MAXORA)'})
            return json.loads(urllib.request.urlopen(req, timeout=90).read().decode('utf-8-sig'))
        except Exception as e:
            print('::warning::tentativo ' + str(k + 1) + ': ' + repr(e)[:300], flush=True)
            time.sleep(20 * (k + 1))
    print('::error::download prezzi fallito', flush=True)
    sys.exit(1)


def main():
    doc = fetch()
    out = []
    for e in doc.get('ListaEESSPrecio', []):
        lat, lng = coord(e.get('Latitud')), coord(e.get('Longitud (WGS84)'))
        if lat is None or lng is None:
            continue
        mun = (e.get('Municipio') or '').strip().lower()
        if mun not in MUNI and not (27.99 <= lat <= 28.80 and -14.55 <= lng <= -13.80):
            continue
        p = {k: num(e.get(v)) for k, v in TYPES.items()}
        if not any(p.values()):
            continue
        out.append({'id': e.get('IDEESS'), 'name': (e.get('Rótulo') or '').strip().title(), 'addr': (e.get('Dirección') or '').strip().title(),
                    'town': (e.get('Localidad') or '').strip().title(), 'hours': (e.get('Horario') or '').strip(),
                    'lat': round(lat, 6), 'lng': round(lng, 6), **{k: v for k, v in p.items() if v}})
    if len(out) < 10:
        print('::notice::esempio ' + json.dumps(doc.get('ListaEESSPrecio', [{}])[0], ensure_ascii=False)[:900], flush=True)
        print(f'::error::troppo poche stazioni: {len(out)} su {len(doc.get("ListaEESSPrecio", []))}', flush=True)
        sys.exit(1)
    stats = {}
    for k in TYPES:
        vals = sorted(s[k] for s in out if s.get(k))
        if vals:
            stats[k] = {'avg': round(sum(vals) / len(vals), 3), 'min': vals[0], 'max': vals[-1], 'n': len(vals)}
    res = {'generated': datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%MZ'), 'date': doc.get('Fecha'),
           'source': 'Ministerio para la Transición Ecológica y el Reto Demográfico — Geoportal Gasolineras', 'stats': stats,
           'stations': sorted(out, key=lambda s: (s['town'], s['name']))}
    with open(sys.argv[1], 'w') as f:
        json.dump(res, f, ensure_ascii=False, separators=(',', ':'))
    note(f"fuel.json: {len(out)} stazioni, data {res['date']}; " + ', '.join(f"{k} media {v['avg']} min {v['min']} ({v['n']})" for k, v in stats.items()))


if __name__ == '__main__':
    try:
        main()
    except SystemExit:
        raise
    except Exception as e:
        import traceback
        print('::error::' + traceback.format_exc().replace('\n', ' | ')[-900:], flush=True)
        sys.exit(1)
