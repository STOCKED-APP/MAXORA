import osmium, json, sys, math
class R(osmium.SimpleHandler):
    def __init__(s): super().__init__(); s.rel=[]
    def relation(s, r):
        t=dict(r.tags)
        if t.get('type')=='route' and t.get('route') in ('hiking','foot','bicycle','mtb','running','walking'):
            s.rel.append({'id':r.id,'route':t.get('route'),'name':t.get('name') or t.get('ref') or '','ref':t.get('ref',''),'network':t.get('network',''),'n':len([m for m in r.members if m.type=='w']),'dist':t.get('distance','')})
h=R(); h.apply_file(sys.argv[1])
h.rel.sort(key=lambda x:(x['route'],x['name']))
open('probe_out.txt','w').write('\n'.join(json.dumps(x,ensure_ascii=False) for x in h.rel)+'\n'+str(len(h.rel)))
