import urllib.request, urllib.parse, sys
def get(u, n=1500):
    try:
        r = urllib.request.urlopen(urllib.request.Request(u, headers={'User-Agent': 'maxora-probe'}), timeout=60)
        b = r.read().decode('utf-8', 'replace')
        return f"{r.status} {b[:n]}"
    except Exception as e:
        return f"ERR {e}"
E = 'https://erddap.emodnet-physics.eu/erddap/tabledap/'
q = 'PLATFORMCODE,SOURCE,latitude,longitude&latitude>=27.9&latitude<=29.0&longitude>=-14.7&longitude<=-13.2&distinct()'
for ds in ['EP_ERD_INT_SLEV_AL_TS_NRT', 'ERD_EP_SLEV_NRT_60m', 'TS_SLEV_PSMSL']:
    for base in [E, 'https://er1webapps.emodnet-physics.eu/erddap/tabledap/']:
        u = base + ds + '.csv?' + urllib.parse.quote(q, safe='=&,()')
        print('::notice::' + (ds + ' ' + base[8:20] + ' -> ' + get(u)).replace('\n', ' | '))
for u in ['https://portus.puertos.es/', 'https://portus.puertos.es/portussvr/api/RTData/station/3469?locale=es',
          'https://uhslc.soest.hawaii.edu/data/']:
    print('::notice::' + (u + ' -> ' + get(u, 400)).replace('\n', ' | '))
