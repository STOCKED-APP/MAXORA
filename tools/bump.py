#!/usr/bin/env python3
"""Maxora — nuova versione: aggiorna numero in config.js, cache del service worker
e il ?v= dei file dell'app in index.html (così il telefono non mescola file vecchi e nuovi).
Uso: python3 tools/bump.py 0.26.2"""
import re, sys
v = sys.argv[1]
c = open('assets/config.js').read()
c = re.sub(r"version: '[^']*'", "version: '" + v + "'", c)
open('assets/config.js', 'w').write(c)
s = open('sw.js').read()
s = re.sub(r"const CACHE = 'maxora-v(\d+)'", lambda m: "const CACHE = 'maxora-v" + str(int(m.group(1)) + 1) + "'", s)
open('sw.js', 'w').write(s)
h = open('index.html').read()
h = re.sub(r'(href|src)="(assets/[\w.-]+\.(?:css|js))(?:\?v=[^"]*)?"', lambda m: m.group(1) + '="' + m.group(2) + '?v=' + v + '"', h)
open('index.html', 'w').write(h)
print('versione', v)
