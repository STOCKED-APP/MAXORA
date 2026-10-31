/* Maxora — ponte con l'app nativa (App Store / Google Play, Capacitor).
   Si carica SOLO nella versione nativa (native/scripts/build-www.js lo inserisce prima di config.js).
   Nel browser non fa nulla. Il resto dell'app non cambia: qui si sostituiscono solo i pezzi che
   da app vera funzionano meglio (GPS anche a schermo spento, notifiche, splash, barra di stato). */
(function () {
  'use strict';
  const C = window.Capacitor;
  if (!C || !C.isNativePlatform || !C.isNativePlatform()) return;
  const plugin = (name) => (C.registerPlugin ? C.registerPlugin(name) : (C.Plugins || {})[name]);
  const BG = plugin('BackgroundGeolocation');
  const Splash = plugin('SplashScreen');
  const Status = plugin('StatusBar');
  const Local = plugin('LocalNotifications');
  const Push = plugin('PushNotifications');
  const AppP = plugin('App');
  const WEB = 'https://stocked-app.github.io/MAXORA/';
  document.documentElement.classList.add('native', 'native-' + C.getPlatform());

  // ------------------------------------------------------------------
  // Dati pubblicati (data/*.json): sempre freschi da GitHub Pages, copia interna se manca la rete
  // ------------------------------------------------------------------
  const _fetch = window.fetch.bind(window);
  window.fetch = function (input, init) {
    const u = typeof input === 'string' ? input : input && input.url;
    if (typeof u === 'string' && /^(\.\/)?data\//.test(u)) {
      const rel = u.replace(/^\.\//, '');
      return _fetch(WEB + rel, init).then((r) => (r.ok ? r : _fetch(rel, init))).catch(() => _fetch(rel, init));
    }
    return _fetch(input, init);
  };

  // ------------------------------------------------------------------
  // Posizione: il GPS nativo continua anche a schermo spento o con un'altra app aperta.
  // Si sostituisce navigator.geolocation, così app.js / follow.js restano identici.
  // ------------------------------------------------------------------
  if (BG && navigator.geolocation) {
    const T = {
      es: ['Maxora te avisa en la carretera', 'Avisos activos mientras conduces'],
      en: ['Maxora is watching the road', 'Alerts on while you drive'],
      it: ['Maxora ti avvisa sulla strada', 'Avvisi attivi mentre guidi'],
      de: ['Maxora warnt dich unterwegs', 'Warnungen während der Fahrt aktiv']
    };
    const lang = () => { try { return JSON.parse(localStorage.getItem('maxora_lang')) || 'es'; } catch (e) { return 'es'; } };
    const subs = new Map();
    let watcher = null, last = null, seq = 0;
    const toPos = (l) => ({ coords: { latitude: l.latitude, longitude: l.longitude, accuracy: l.accuracy, altitude: l.altitude, altitudeAccuracy: l.altitudeAccuracy, heading: l.bearing, speed: l.speed }, timestamp: l.time || Date.now() });
    function ensure() {
      if (watcher) return;
      const tx = T[lang()] || T.es;
      watcher = 'starting';
      BG.addWatcher({ backgroundTitle: tx[0], backgroundMessage: tx[1], requestPermissions: true, stale: false, distanceFilter: 5 }, (loc, err) => {
        if (err) { subs.forEach((s) => s.ko && s.ko({ code: err.code === 'NOT_AUTHORIZED' ? 1 : 2, message: err.message })); return; }
        if (!loc) return;
        last = toPos(loc);
        subs.forEach((s) => s.ok(last));
      }).then((id) => { watcher = id; }).catch(() => { watcher = null; });
    }
    navigator.geolocation.watchPosition = function (ok, ko) { const id = ++seq; subs.set(id, { ok, ko }); ensure(); if (last) setTimeout(() => ok(last), 0); return id; };
    navigator.geolocation.clearWatch = function (id) {
      subs.delete(id);
      if (!subs.size && watcher && watcher !== 'starting') { BG.removeWatcher({ id: watcher }).catch(() => {}); watcher = null; }
    };
    navigator.geolocation.getCurrentPosition = function (ok, ko) {
      if (last && Date.now() - last.timestamp < 15000) { setTimeout(() => ok(last), 0); return; }
      const id = navigator.geolocation.watchPosition((p) => { navigator.geolocation.clearWatch(id); ok(p); }, (e) => { navigator.geolocation.clearWatch(id); if (ko) ko(e); });
    };
    window.MAXORA_NATIVE_SETTINGS = () => BG.openSettings && BG.openSettings();
  }

  // ------------------------------------------------------------------
  // Avvisi con l'app in sottofondo: notifica locale (voce e suono restano quando è aperta)
  // ------------------------------------------------------------------
  if (Local) {
    let perm = false, nid = 1;
    Local.requestPermissions().then((r) => { perm = r && r.display === 'granted'; }).catch(() => {});
    window.addEventListener('maxora:alert', (e) => {
      if (!perm || !document.hidden) return;
      const d = e.detail || {};
      Local.schedule({ notifications: [{ id: (nid = (nid % 100000) + 1), title: d.title || 'Maxora', body: d.body || '' }] }).catch(() => {});
    });
  }

  // ------------------------------------------------------------------
  // Notifiche push (messaggi a tutti dal pannello admin)
  // ------------------------------------------------------------------
  if (Push) {
    Push.addListener('registration', (t) => {
      try { localStorage.setItem('maxora_push_token', JSON.stringify({ token: t.value, platform: C.getPlatform() })); } catch (e) {}
      window.dispatchEvent(new CustomEvent('maxora:push-token', { detail: { token: t.value, platform: C.getPlatform() } }));
    });
    // il permesso si chiede più tardi, non all'apertura (lo fa app.js dopo il primo avviso utile)
    window.MAXORA_PUSH_ASK = () => Push.requestPermissions().then((r) => { if (r.receive === 'granted') Push.register(); }).catch(() => {});
  }

  // ------------------------------------------------------------------
  // Aspetto: barra di stato scura su fondo chiaro, splash nativo che passa la mano a quello animato
  // ------------------------------------------------------------------
  if (Status) { Status.setOverlaysWebView({ overlay: true }).catch(() => {}); Status.setStyle({ style: 'LIGHT' }).catch(() => {}); }
  document.addEventListener('DOMContentLoaded', () => { if (Splash) Splash.hide({ fadeOutDuration: 150 }).catch(() => {}); });
  if (AppP) AppP.addListener('backButton', () => {
    const open = document.querySelector('.overlay:not(.hidden), .nav-ov');
    if (open) { if (window.MAXORA) window.MAXORA.closeOverlays(); const n = document.querySelector('.nav-ov'); if (n) n.remove(); }
    else AppP.minimizeApp && AppP.minimizeApp();
  });
})();
