// Maxora — service worker minimo: l'app si apre anche con rete debole.
// Prima la rete, poi la copia salvata. I dati live (Supabase) non vengono mai salvati.
const CACHE = 'maxora-v37';
const SHELL = ['./', 'index.html', 'assets/theme.css', 'assets/app.css', 'assets/app.js', 'assets/ui.js', 'assets/surf.js', 'assets/camper.js', 'assets/sport.js', 'assets/waves.js', 'assets/tour.js', 'assets/account.js', 'assets/fuel.js', 'assets/follow.js', 'assets/config.js', 'assets/icon.svg'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== self.location.origin || url.pathname.includes('/admin')) return;
  e.respondWith(
    fetch(e.request)
      .then((res) => { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); return res; })
      .catch(() => caches.match(e.request))
  );
});
