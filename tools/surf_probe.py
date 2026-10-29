import json, sys, time
LOG=open('probe_out.txt','w')
def note(s): LOG.write(str(s)+'\n'); LOG.flush()
# --- OSM: luoghi surf e spiagge con nome
try:
    feats = [json.loads(l) for l in open('surf.geojsonseq') if l.strip().startswith('{')] if False else []
    import subprocess
    out = []
    for l in open('surf.geojsonseq'):
        l = l.strip().lstrip('\x1e')
        if not l: continue
        f = json.loads(l); p = f['properties']; g = f['geometry']
        c = g['coordinates']
        if g['type'] != 'Point':
            pts = c[0] if g['type'] == 'Polygon' else c
            while isinstance(pts[0][0], list): pts = pts[0]
            c = [sum(x[0] for x in pts)/len(pts), sum(x[1] for x in pts)/len(pts)]
        out.append(f"{p.get('name','?')}|{p.get('sport','')}{p.get('natural','')}{p.get('leisure','')}|{c[1]:.5f},{c[0]:.5f}")
    for i in range(0, len(out), 40): note('OSM ' + ' ;; '.join(out[i:i+40]))
except Exception as e: note('OSM err ' + repr(e))
# --- ECMWF open data
try:
    from ecmwf.opendata import Client
    c = Client(source='ecmwf')
    t0 = time.time()
    lw = c.latest(type='fc', stream='wave', param='swh', step=0)
    note(f'ECMWF ultimo run onde: {lw}')
    r = c.retrieve(type='fc', stream='wave', param=['swh', 'mwd', 'pp1d', 'mwp'], step=[0, 3, 6, 144, 240], target='w.grib2')
    r2 = c.retrieve(type='fc', stream='oper', param=['10u', '10v'], step=[0, 3, 6], target='a.grib2')
    import os
    note(f'download {time.time()-t0:.0f}s onde={os.path.getsize("w.grib2")/1e6:.1f}MB aria={os.path.getsize("a.grib2")/1e6:.1f}MB')
    import xarray as xr
    ds = xr.open_dataset('w.grib2', engine='cfgrib')
    note('vars onde ' + str(list(ds.data_vars)) + ' dims ' + str(dict(ds.sizes)) + ' lat0 ' + str(float(ds.latitude[0])) + ' lon0 ' + str(float(ds.longitude[0])))
    sub = ds.sel(latitude=slice(29.2, 27.8), longitude=slice(-14.8, -13.2)).isel(step=0)
    note('swh griglia FV: ' + json.dumps([[None if v != v else round(float(v), 2) for v in row] for row in sub['swh'].values]))
    note('lats ' + str([float(x) for x in sub.latitude.values]) + ' lons ' + str([float(x) for x in sub.longitude.values]))
    da = xr.open_dataset('a.grib2', engine='cfgrib')
    note('vars aria ' + str(list(da.data_vars)) + ' dims ' + str(dict(da.sizes)))
except Exception as e:
    import traceback; note('ECMWF err ' + traceback.format_exc())
