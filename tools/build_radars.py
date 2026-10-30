#!/usr/bin/env python3
"""Maxora — radar fissi e tutor (tramo) da OpenStreetMap -> data/radars.json

Uso:  python3 tools/build_radars.py radar.opl data/radars.json
Ingresso: `osmium cat -f opl` dei nodi highway=speed_camera e delle relazioni type=enforcement
(con i nodi che referenziano). Vedi .github/workflows/pois.yml.
"""
import json, sys, re, datetime

DIRS = {'N': 0, 'NNE': 22, 'NE': 45, 'ENE': 67, 'E': 90, 'ESE': 112, 'SE': 135, 'SSE': 157,
        'S': 180, 'SSW': 202, 'SW': 225, 'WSW': 247, 'W': 270, 'WNW': 292, 'NW': 315, 'NNW': 337}


def unesc(s):
    return re.sub(r'%([0-9a-fA-F]+)%', lambda m: chr(int(m.group(1), 16)), s)


def tags_of(s):
    out = {}
    if not s:
        return out
    for kv in s.split(','):
        if '=' in kv:
            k, v = kv.split('=', 1)
            out[unesc(k)] = unesc(v)
    return out


def speed(v):
    if not v:
        return None
    m = re.match(r'\s*(\d+)', v)
    return int(m.group(1)) if m else None


def bearing(v):
    if not v:
        return None
    v = v.strip().upper()
    if v in DIRS:
        return DIRS[v]
    m = re.match(r'^(\d+(?:\.\d+)?)$', v)
    return int(float(m.group(1))) % 360 if m else None


def main(src, dst):
    nodes, rels = {}, []
    with open(src, encoding='utf-8') as f:
        for line in f:
            parts = line.rstrip('\n').split(' ')
            if not parts or not parts[0]:
                continue
            head, fields = parts[0], {p[0]: p[1:] for p in parts[1:] if p}
            if head[0] == 'n' and 'x' in fields and fields['x']:
                nodes[head[1:]] = {'lng': float(fields['x']), 'lat': float(fields['y']), 'tags': tags_of(fields.get('T'))}
            elif head[0] == 'r':
                rels.append({'id': head[1:], 'tags': tags_of(fields.get('T')), 'members': fields.get('M', '')})

    out, used = [], set()
    # tutor e radar descritti da una relazione "enforcement"
    for r in rels:
        t = r['tags']
        if t.get('type') != 'enforcement':
            continue
        kind = t.get('enforcement', '')
        if kind not in ('maxspeed', 'average_speed', 'mindistance', 'traffic_signals'):
            continue
        ms = speed(t.get('maxspeed'))
        roles = {}
        for m in r['members'].split(','):
            mm = re.match(r'^n(\d+)@(.*)$', m)
            if mm and mm.group(1) in nodes:
                roles.setdefault(unesc(mm.group(2)) or 'device', []).append(mm.group(1))
        if kind == 'average_speed':
            for role, k in (('from', 'section_start'), ('to', 'section_end')):
                for nid in roles.get(role, []):
                    n = nodes[nid]
                    out.append({'id': 'osm-r' + r['id'] + '-' + role, 'kind': k, 'lat': round(n['lat'], 6), 'lng': round(n['lng'], 6),
                                'maxspeed': ms or speed(n['tags'].get('maxspeed')), 'bearing': bearing(n['tags'].get('direction'))})
                    used.add(nid)
            for nid in roles.get('device', []):
                used.add(nid)
            continue
        for nid in roles.get('device', []) or roles.get('from', []):
            n = nodes[nid]
            out.append({'id': 'osm-n' + nid, 'kind': 'traffic_light' if kind == 'traffic_signals' else 'fixed',
                        'lat': round(n['lat'], 6), 'lng': round(n['lng'], 6),
                        'maxspeed': ms or speed(n['tags'].get('maxspeed')), 'bearing': bearing(n['tags'].get('direction'))})
            used.add(nid)

    # telecamere isolate (senza relazione)
    for nid, n in nodes.items():
        t = n['tags']
        if t.get('highway') != 'speed_camera' or nid in used:
            continue
        out.append({'id': 'osm-n' + nid, 'kind': 'fixed', 'lat': round(n['lat'], 6), 'lng': round(n['lng'], 6),
                    'maxspeed': speed(t.get('maxspeed')), 'bearing': bearing(t.get('direction') or t.get('camera:direction'))})

    out.sort(key=lambda x: x['id'])
    with open(dst, 'w', encoding='utf-8') as f:
        json.dump({'source': 'OpenStreetMap (ODbL)', 'updated': datetime.date.today().isoformat(), 'radars': out}, f, ensure_ascii=False, separators=(',', ':'))
    print('radar:', len(out))


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
