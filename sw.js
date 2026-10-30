// Maxora — service worker: l'app si apre anche con rete debole o assente.
// File dell'app: prima la rete (max 4 s), poi la copia salvata.
// Librerie e font esterni: copia salvata subito, aggiornata in sottofondo.
// Mappa: le ultime ~600 tessere viste restano sul telefono. I dati live (Supabase) non vengono mai salvati.
const CACHE = 'maxora-v52';
const LIBS = 'maxora-libs-v1';
const TILES = 'maxora-tiles-v1';
const SHELL = ['./', 'index.html', 'assets/theme.css', 'assets/app.css', 'assets/app.js', 'assets/ui.js', 'assets/surf.js', 'assets/camper.js', 'assets/sport.js', 'assets/waves.js', 'assets/diary.js', 'assets/tour.js', 'assets/account.js', 'assets/fuel.js', 'assets/follow.js', 'assets/radar.js', 'assets/config.js', 'assets/icon.svg'];
const LIB_HOSTS = ['unpkg.com', 'cdn.jsdelivr.net', 'fonts.googleapis.com', 'fonts.gstatic.com'];
const TILE_HOSTS = ['tiles.openfreemap.org'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  const keep = [CACHE, LIBS, TILES];
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => !keep.includes(k)).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

function withTimeout(p, ms) {
  return new Promise((ok, ko) => { const t = setTimeout(() => ko(new Error('timeout')), ms); p.then((r) => { clearTimeout(t); ok(r); }, (e) => { clearTimeout(t); ko(e); }); });
}
let trimming = false;
async function trimTiles() {
  if (trimming) return; trimming = true;
  try { const c = await caches.open(TILES); const ks = await c.keys(); for (let i = 0; i < ks.length - 600; i++) await c.delete(ks[i]); } catch (e) {}
  trimming = false;
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // librerie e font: cache subito, aggiornamento in sottofondo
  if (LIB_HOSTS.includes(url.hostname)) {
    e.respondWith(caches.open(LIBS).then(async (c) => {
      const hit = await c.match(req);
      const net = fetch(req).then((res) => { if (res.ok || res.type === 'opaque') c.put(req, res.clone()); return res; });
      if (hit) { e.waitUntil(net.catch(() => {})); return hit; }
      return net;
    }));
    return;
  }
  // tessere della mappa: rete se c'è, altrimenti quelle già viste
  if (TILE_HOSTS.includes(url.hostname)) {
    e.respondWith(caches.open(TILES).then(async (c) => {
      try {
        const res = await withTimeout(fetch(req), 6000);
        if (res.ok) { c.put(req, res.clone()); e.waitUntil(trimTiles()); }
        return res;
      } catch (err) {
        const hit = await c.match(req);
        if (hit) return hit;
        throw err;
      }
    }));
    return;
  }
  if (url.origin !== self.location.origin || url.pathname.includes('/admin')) return;

  // file dell'app e dati pubblicati: rete (max 4 s) poi copia
  const net = fetch(req).then((res) => { if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); } return res; });
  e.respondWith(
    withTimeout(net, 4000).catch(async () => (await caches.match(req)) || (await caches.match(req, { ignoreSearch: true })) || net)
  );
});
