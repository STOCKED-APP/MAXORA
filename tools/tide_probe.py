import urllib.request, urllib.parse
def get(u, n=1500):
    try:
        r = urllib.request.urlopen(urllib.request.Request(u, headers={'User-Agent': 'maxora-probe'}), timeout=120)
        b = r.read().decode('utf-8', 'replace')
        return f"{r.status} len={len(b)} {b[:n]}"
    except Exception as e:
        return f"ERR {e}"
E = 'https://erddap.emodnet-physics.eu/erddap/tabledap/ERD_EP_SLEV_NRT_60m'
def n(s): print('::notice::' + s.replace('\n', ' | '))
for p in ['FuerteventuraTG', 'Fuerteventura3TG', 'fuer2', 'fue2', '1114', '1115']:
    q = f'PLATFORMCODE,SOURCE,time&PLATFORMCODE="{p}"&orderByMinMax("PLATFORMCODE,SOURCE,time")'
    n(p + ' range -> ' + get(E + '.csv?' + urllib.parse.quote(q, safe='=&,()"'), 600))
q = 'PLATFORMCODE,time,SLEV,SLEV_QC&PLATFORMCODE="FuerteventuraTG"&time>=2026-10-20T00:00:00Z&time<=2026-10-20T12:00:00Z'
n('sample -> ' + get(E + '.csv?' + urllib.parse.quote(q, safe='=&,()"'), 1200))
n('info -> ' + get('https://erddap.emodnet-physics.eu/erddap/info/ERD_EP_SLEV_NRT_60m/index.csv', 2500))
n('ioc -> ' + get('https://www.ioc-sealevelmonitoring.org/service.php?query=data&code=fue2&timestart=2026-10-28T00:00&timestop=2026-10-28T02:00&format=json', 800))
n('ioc2 -> ' + get('https://www.ioc-sealevelmonitoring.org/service.php?query=stationlist&showall=all&format=json', 300))
