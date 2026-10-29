import osmium, json, sys
class R(osmium.SimpleHandler):
    def __init__(s): super().__init__(); s.p=[]
    def node(s, n):
        t=dict(n.tags)
        if t.get('natural') in ('volcano','peak') and t.get('name'):
            s.p.append([t.get('natural'), t['name'], round(n.location.lat,5), round(n.location.lon,5), t.get('ele','')])
h=R(); h.apply_file(sys.argv[1])
h.p.sort(key=lambda x: x[1])
open('probe_out.txt','w').write('\n'.join(json.dumps(x,ensure_ascii=False) for x in h.p)+'\n'+str(len(h.p)))
