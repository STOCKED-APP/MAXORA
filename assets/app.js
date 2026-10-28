/* Maxora — app pubblica */
(function () {
  'use strict';

  const CFG = window.MAXORA_CONFIG;
  const sb = supabase.createClient(CFG.supabaseUrl, CFG.supabaseKey, {
    auth: { persistSession: true, autoRefreshToken: true }
  });

  // ------------------------------------------------------------------
  // Testi (ES / EN / IT / DE)
  // ------------------------------------------------------------------
  const T = {
    es: {
      next: 'Próximo aviso', clear: 'Vía despejada', clearSub: 'Nada en {km} km', report: 'AVISAR',
      reportTitle: '¿Qué pasa aquí?', reportSub: 'Se marca en tu posición. Avisa solo si vas de pasajero o estás parado.',
      still: 'Sigue', gone: 'Ya no', discover: 'Descubre la isla', settings: 'Ajustes',
      theme: 'Tema', auto: 'Auto', light: 'Claro', dark: 'Oscuro', lang: 'Idioma',
      voice: 'Aviso por voz', sound: 'Sonido de aviso', ago: 'hace {t}', confirms: '{n} confirman',
      approx: 'zona aproximada', expires: 'caduca en {t}', official: 'Oficial', now: 'AHORA',
      sent: 'Aviso enviado', thanks: 'Gracias', already: 'Ya has votado este aviso', own: 'Es tu aviso',
      expired: 'Este aviso ya no está', errBlocked: 'Tu dispositivo está bloqueado',
      errRate: 'Demasiados avisos, prueba más tarde', errZone: 'Solo disponible en Canarias',
      errOff: 'Función no disponible', errMaint: 'Maxora está en mantenimiento', errGeneric: 'No se pudo enviar',
      errNoSession: 'Sin conexión con Maxora', noGps: 'Sin GPS: aviso en el centro del mapa',
      places: 'Lugares', businesses: 'Negocios', soon: 'Muy pronto', call: 'Llamar', web: 'Web',
      sponsor: 'DESTACADO', active: '{n} avisos activos', following: 'Siguiéndote',
      voiceAt: '{type} a {dist}', inZone: 'Zona con presencia policial', maint: 'Maxora está en mantenimiento. Los avisos vuelven pronto.'
      ,searchPh: '¿A dónde vas?', sRecent: 'Recientes', sOurs: 'En Maxora', sStreets: 'Calles y lugares', sNone: 'Sin resultados. Prueba con otro nombre.', sOffline: 'Sin conexión: solo resultados de Maxora.',
      sNear: 'Cerca de ti', cBeach: 'Playas', cFood: 'Comer', cFuel: 'Gasolineras', cSurf: 'Surf', cView: 'Miradores',
      go: 'IR', openWith: 'Abrir navegación con', fromYou: 'Desde ti', alertsNear: 'Avisos cerca', alertsRoute: 'Avisos en el camino', none0: 'Ninguno',
      routeNote: 'Maxora sigue avisándote en segundo plano mientras navegas.', approxRoute: 'aprox., en línea recta', share: 'Compartir', street: 'Calle', place: 'Lugar', town: 'Localidad', beachT: 'Playa', biz: 'Negocio', clearHist: 'Borrar historial', loadingMap: 'buscando…', nResults: '{n} en el mapa', noResultsArea: 'nada en esta zona', seeAll: 'Ver todos en el mapa', searchArea: 'Buscar en esta zona', hours: 'Horario', list: 'Lista'
    },
    en: {
      next: 'Next alert', clear: 'Road clear', clearSub: 'Nothing within {km} km', report: 'REPORT',
      reportTitle: 'What is happening?', reportSub: 'Marked at your position. Only report as a passenger or when stopped.',
      still: 'Still there', gone: 'Gone', discover: 'Discover the island', settings: 'Settings',
      theme: 'Theme', auto: 'Auto', light: 'Light', dark: 'Dark', lang: 'Language',
      voice: 'Voice alerts', sound: 'Alert sound', ago: '{t} ago', confirms: '{n} confirmed',
      approx: 'approximate area', expires: 'expires in {t}', official: 'Official', now: 'NOW',
      sent: 'Alert sent', thanks: 'Thanks', already: 'You already voted', own: 'This is your alert',
      expired: 'This alert is gone', errBlocked: 'Your device is blocked',
      errRate: 'Too many alerts, try later', errZone: 'Only available in the Canary Islands',
      errOff: 'Feature not available', errMaint: 'Maxora is under maintenance', errGeneric: 'Could not send',
      errNoSession: 'No connection to Maxora', noGps: 'No GPS: alert placed at map centre',
      places: 'Places', businesses: 'Businesses', soon: 'Coming soon', call: 'Call', web: 'Website',
      sponsor: 'FEATURED', active: '{n} active alerts', following: 'Following you',
      voiceAt: '{type} in {dist}', inZone: 'Police nearby', maint: 'Maxora is under maintenance. Alerts will be back soon.'
      ,searchPh: 'Where to?', sRecent: 'Recent', sOurs: 'On Maxora', sStreets: 'Streets & places', sNone: 'No results. Try another name.', sOffline: 'Offline: Maxora results only.',
      sNear: 'Near you', cBeach: 'Beaches', cFood: 'Food', cFuel: 'Fuel', cSurf: 'Surf', cView: 'Viewpoints',
      go: 'GO', openWith: 'Navigate with', fromYou: 'From you', alertsNear: 'Alerts nearby', alertsRoute: 'Alerts on the way', none0: 'None',
      routeNote: 'Maxora keeps alerting you in the background while you drive.', approxRoute: 'approx., straight line', share: 'Share', street: 'Street', place: 'Place', town: 'Town', beachT: 'Beach', biz: 'Business', clearHist: 'Clear history', loadingMap: 'searching…', nResults: '{n} on the map', noResultsArea: 'nothing in this area', seeAll: 'Show all on the map', searchArea: 'Search this area', hours: 'Hours', list: 'List'
    },
    it: {
      next: 'Prossimo avviso', clear: 'Strada libera', clearSub: 'Niente entro {km} km', report: 'AVVISA',
      reportTitle: 'Cosa succede qui?', reportSub: 'Viene segnato sulla tua posizione. Segnala solo da passeggero o da fermo.',
      still: "C'è ancora", gone: 'Non più', discover: "Scopri l'isola", settings: 'Impostazioni',
      theme: 'Tema', auto: 'Auto', light: 'Chiaro', dark: 'Scuro', lang: 'Lingua',
      voice: 'Avvisi vocali', sound: 'Suono di avviso', ago: '{t} fa', confirms: '{n} confermano',
      approx: 'zona approssimativa', expires: 'scade tra {t}', official: 'Ufficiale', now: 'ORA',
      sent: 'Avviso inviato', thanks: 'Grazie', already: 'Hai già votato', own: 'È il tuo avviso',
      expired: 'Questo avviso non c’è più', errBlocked: 'Il tuo dispositivo è bloccato',
      errRate: 'Troppi avvisi, riprova più tardi', errZone: 'Disponibile solo alle Canarie',
      errOff: 'Funzione non disponibile', errMaint: 'Maxora è in manutenzione', errGeneric: 'Invio non riuscito',
      errNoSession: 'Nessuna connessione a Maxora', noGps: 'Senza GPS: avviso al centro della mappa',
      places: 'Luoghi', businesses: 'Attività', soon: 'In arrivo', call: 'Chiama', web: 'Sito',
      sponsor: 'IN EVIDENZA', active: '{n} avvisi attivi', following: 'Ti seguo',
      voiceAt: '{type} a {dist}', inZone: 'Zona con presenza polizia', maint: 'Maxora è in manutenzione. Gli avvisi tornano presto.'
      ,searchPh: 'Dove vai?', sRecent: 'Recenti', sOurs: 'Su Maxora', sStreets: 'Vie e luoghi', sNone: 'Nessun risultato. Prova un altro nome.', sOffline: 'Offline: solo risultati Maxora.',
      sNear: 'Vicino a te', cBeach: 'Spiagge', cFood: 'Mangiare', cFuel: 'Benzinai', cSurf: 'Surf', cView: 'Panorami',
      go: 'VAI', openWith: 'Apri navigazione con', fromYou: 'Da te', alertsNear: 'Avvisi vicini', alertsRoute: 'Avvisi sul percorso', none0: 'Nessuno',
      routeNote: 'Maxora continua ad avvisarti in sottofondo mentre guidi.', approxRoute: 'approssimato, in linea d’aria', share: 'Condividi', street: 'Via', place: 'Luogo', town: 'Località', beachT: 'Spiaggia', biz: 'Attività', clearHist: 'Cancella cronologia', loadingMap: 'cerco…', nResults: '{n} sulla mappa', noResultsArea: 'niente in questa zona', seeAll: 'Vedi tutti sulla mappa', searchArea: 'Cerca in questa zona', hours: 'Orari', list: 'Lista'
    },
    de: {
      next: 'Nächste Meldung', clear: 'Freie Fahrt', clearSub: 'Nichts im Umkreis von {km} km', report: 'MELDEN',
      reportTitle: 'Was ist los?', reportSub: 'Wird an deiner Position markiert. Nur als Beifahrer oder im Stand melden.',
      still: 'Noch da', gone: 'Weg', discover: 'Insel entdecken', settings: 'Einstellungen',
      theme: 'Design', auto: 'Auto', light: 'Hell', dark: 'Dunkel', lang: 'Sprache',
      voice: 'Sprachansagen', sound: 'Warnton', ago: 'vor {t}', confirms: '{n} bestätigt',
      approx: 'ungefährer Bereich', expires: 'läuft in {t} ab', official: 'Offiziell', now: 'JETZT',
      sent: 'Meldung gesendet', thanks: 'Danke', already: 'Du hast schon abgestimmt', own: 'Das ist deine Meldung',
      expired: 'Diese Meldung ist weg', errBlocked: 'Dein Gerät ist gesperrt',
      errRate: 'Zu viele Meldungen, versuche es später', errZone: 'Nur auf den Kanaren verfügbar',
      errOff: 'Funktion nicht verfügbar', errMaint: 'Maxora wird gewartet', errGeneric: 'Senden fehlgeschlagen',
      errNoSession: 'Keine Verbindung zu Maxora', noGps: 'Kein GPS: Meldung in der Kartenmitte',
      places: 'Orte', businesses: 'Betriebe', soon: 'Bald verfügbar', call: 'Anrufen', web: 'Webseite',
      sponsor: 'EMPFOHLEN', active: '{n} aktive Meldungen', following: 'Folgt dir',
      voiceAt: '{type} in {dist}', inZone: 'Polizei in der Nähe', maint: 'Maxora wird gewartet. Meldungen sind bald zurück.'
      ,searchPh: 'Wohin?', sRecent: 'Zuletzt', sOurs: 'Auf Maxora', sStreets: 'Straßen & Orte', sNone: 'Keine Ergebnisse. Anderen Namen versuchen.', sOffline: 'Offline: nur Maxora-Ergebnisse.',
      sNear: 'In deiner Nähe', cBeach: 'Strände', cFood: 'Essen', cFuel: 'Tankstellen', cSurf: 'Surfen', cView: 'Aussichtspunkte',
      go: 'LOS', openWith: 'Navigieren mit', fromYou: 'Von dir', alertsNear: 'Meldungen in der Nähe', alertsRoute: 'Meldungen unterwegs', none0: 'Keine',
      routeNote: 'Maxora warnt dich während der Fahrt im Hintergrund weiter.', approxRoute: 'ca., Luftlinie', share: 'Teilen', street: 'Straße', place: 'Ort', town: 'Ortschaft', beachT: 'Strand', biz: 'Betrieb', clearHist: 'Verlauf löschen', loadingMap: 'suche…', nResults: '{n} auf der Karte', noResultsArea: 'nichts in diesem Bereich', seeAll: 'Alle auf der Karte zeigen', searchArea: 'In diesem Bereich suchen', hours: 'Öffnungszeiten', list: 'Liste'
    }
  };
  const LOCALES = { es: 'es-ES', en: 'en-GB', it: 'it-IT', de: 'de-DE' };

  // ------------------------------------------------------------------
  // Stato
  // ------------------------------------------------------------------
  const store = {
    get(k, d) { try { const v = localStorage.getItem('maxora_' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('maxora_' + k, JSON.stringify(v)); } catch (e) {} }
  };
  let lang = store.get('lang', null) || (navigator.language || 'es').slice(0, 2);
  if (!T[lang]) lang = 'es';

  const S = {
    session: null,
    settings: {},
    types: new Map(),
    reports: new Map(),
    broadcasts: [],
    pos: null,          // {lat, lng}
    prevPos: null,
    heading: null,      // gradi
    speed: 0,           // m/s
    follow: true,
    selectedId: null,
    ahead: [],
    alerted: new Set(store.get('alerted', [])),
    voted: new Set(store.get('voted', [])),
    voice: store.get('voice', true),
    sound: store.get('sound', true),
    theme: store.get('theme', 'auto'),
    collapsed: store.get('collapsed', false),
    dismissed: new Set(store.get('dismissed', [])),
    places: null, businesses: null
  };
  const MAX_KM = 20;

  const $ = (id) => document.getElementById(id);
  const t = (k, vars) => {
    let s = (T[lang] && T[lang][k]) || T.es[k] || k;
    if (vars) Object.keys(vars).forEach((v) => { s = s.replace('{' + v + '}', vars[v]); });
    return s;
  };
  const num = (v, d) => new Intl.NumberFormat(LOCALES[lang], { maximumFractionDigits: d, minimumFractionDigits: d }).format(v);
  const setting = (k, d) => (S.settings[k] === undefined ? d : S.settings[k]);
  const typeOf = (r) => S.types.get(r.type) || { key: r.type, icon: '•', labels: { es: r.type }, color: '#888', is_police: false };
  const labelOf = (ty) => (ty.labels && (ty.labels[lang] || ty.labels.es)) || ty.key;

  function el(tag, attrs, kids) {
    const n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach((k) => {
      if (k === 'class') n.className = attrs[k];
      else if (k === 'text') n.textContent = attrs[k];
      else if (k === 'style') n.setAttribute('style', attrs[k]);
      else if (k.startsWith('on')) n.addEventListener(k.slice(2), attrs[k]);
      else n.setAttribute(k, attrs[k]);
    });
    (kids || []).forEach((c) => { if (c != null) n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return n;
  }

  let toastTimer;
  function toast(msg) {
    const n = $('toast');
    n.textContent = msg;
    n.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => n.classList.remove('show'), 2800);
  }

  // ------------------------------------------------------------------
  // Geografia
  // ------------------------------------------------------------------
  const rad = (d) => d * Math.PI / 180;
  function distKm(a, b) {
    const R = 6371, dLat = rad(b.lat - a.lat), dLng = rad(b.lng - a.lng);
    const x = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(x));
  }
  function bearing(a, b) {
    const y = Math.sin(rad(b.lng - a.lng)) * Math.cos(rad(b.lat));
    const x = Math.cos(rad(a.lat)) * Math.sin(rad(b.lat)) - Math.sin(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.cos(rad(b.lng - a.lng));
    return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
  }
  const angleDiff = (a, b) => { const d = Math.abs(a - b) % 360; return d > 180 ? 360 - d : d; };
  function fmtDist(km) {
    if (km < 1) return { v: String(Math.max(50, Math.round(km * 1000 / 50) * 50)), u: 'm' };
    return { v: num(km, km < 10 ? 1 : 0), u: 'km' };
  }
  function fmtMin(m) {
    m = Math.max(0, Math.round(m));
    if (m < 60) return m + ' min';
    return Math.floor(m / 60) + ' h ' + (m % 60 ? (m % 60) + ' min' : '');
  }
  function circlePoly(lng, lat, km, steps = 48) {
    const c = [];
    for (let i = 0; i <= steps; i++) {
      const a = (i / steps) * 2 * Math.PI;
      c.push([lng + (km / (111.32 * Math.cos(rad(lat)))) * Math.cos(a), lat + (km / 111.32) * Math.sin(a)]);
    }
    return { type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: [c] } };
  }

  // ------------------------------------------------------------------
  // Tema
  // ------------------------------------------------------------------
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  const isDark = () => S.theme === 'dark' || (S.theme === 'auto' && mq.matches);
  function applyTheme() {
    const dark = isDark();
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    document.querySelector('meta[name="theme-color"]').setAttribute('content', dark ? '#13171c' : '#f7f6f2');
    if (map) {
      const want = dark ? CFG.mapStyles.dark : CFG.mapStyles.light;
      if (map.__style !== want) { map.__style = want; map.setStyle(want); }
    }
    document.querySelectorAll('#themeSeg button').forEach((b) => b.classList.toggle('on', b.dataset.themeVal === S.theme));
  }
  mq.addEventListener('change', () => { if (S.theme === 'auto') applyTheme(); });

  // ------------------------------------------------------------------
  // Mappa
  // ------------------------------------------------------------------
  const center0 = { lat: 28.40, lng: -14.02, zoom: 8.6 };
  const map = new maplibregl.Map({
    container: 'map',
    style: isDark() ? CFG.mapStyles.dark : CFG.mapStyles.light,
    center: [center0.lng, center0.lat],
    zoom: center0.zoom,
    attributionControl: { compact: true },
    pitchWithRotate: false
  });
  map.__style = isDark() ? CFG.mapStyles.dark : CFG.mapStyles.light;
  map.touchZoomRotate.disableRotation();

  map.on('style.load', () => {
    if (!map.getSource('police')) map.addSource('police', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
    if (!map.getLayer('police-fill')) map.addLayer({ id: 'police-fill', type: 'fill', source: 'police', paint: { 'fill-color': '#2b8fb0', 'fill-opacity': 0.12 } });
    if (!map.getLayer('police-line')) map.addLayer({ id: 'police-line', type: 'line', source: 'police', paint: { 'line-color': '#2b8fb0', 'line-width': 1.5, 'line-dasharray': [2, 2] } });
    drawPoliceZones();
  });
  map.on('dragstart', () => { S.follow = false; updateChip(); });

  const meEl = el('div', { class: 'me' });
  const meMarker = new maplibregl.Marker({ element: meEl, rotationAlignment: 'map' });
  let meAdded = false;
  const markers = new Map();
  let tempMarker = null;

  function padMap() {
    const h = $('sheet').getBoundingClientRect().height;
    map.setPadding({ top: 70, bottom: Math.max(0, h - 10), left: 0, right: 0 });
  }

  function markerFor(r) {
    const ty = typeOf(r);
    const n = el('div', { class: 'mk' + (ty.is_police ? ' police' : '') + (r.official ? ' official' : ''), role: 'button', 'aria-label': labelOf(ty) });
    if (!ty.is_police) { n.style.background = ty.color; n.textContent = ty.icon; }
    n.addEventListener('click', (e) => { e.stopPropagation(); select(r.id, true); });
    return n;
  }

  function drawMarkers() {
    for (const [id, m] of markers) if (!S.reports.has(id)) { m.remove(); markers.delete(id); }
    for (const r of S.reports.values()) {
      let m = markers.get(r.id);
      if (!m) { m = new maplibregl.Marker({ element: markerFor(r) }).setLngLat([r.lng, r.lat]).addTo(map); markers.set(r.id, m); }
      m.getElement().classList.toggle('sel', r.id === S.selectedId);
    }
    drawPoliceZones();
  }

  function drawPoliceZones() {
    const src = map.getSource && map.getSource('police');
    if (!src) return;
    const km = Number(setting('police_radius_km', 2.5));
    const feats = [];
    for (const r of S.reports.values()) if (typeOf(r).is_police) feats.push(circlePoly(r.lng, r.lat, km));
    src.setData({ type: 'FeatureCollection', features: feats });
  }

  // ------------------------------------------------------------------
  // Dati
  // ------------------------------------------------------------------
  function isLive(r) { return !r.removed_at && new Date(r.expires_at) > new Date(); }
  function upsertReport(r) { if (isLive(r)) S.reports.set(r.id, r); else S.reports.delete(r.id); }

  async function loadAll() {
    const [st, ty, rp, bc] = await Promise.all([
      sb.from('app_settings').select('key,value'),
      sb.from('report_types').select('*').order('sort'),
      sb.from('reports').select('*').gt('expires_at', new Date().toISOString()),
      sb.from('broadcasts').select('*').order('created_at', { ascending: false })
    ]);
    if (st.data) { S.settings = {}; st.data.forEach((x) => { S.settings[x.key] = x.value; }); }
    if (ty.data) { S.types = new Map(ty.data.map((x) => [x.key, x])); }
    if (rp.data) { S.reports = new Map(); rp.data.forEach(upsertReport); }
    if (bc.data) S.broadcasts = bc.data;
    if (rp.error) toast(t('errNoSession'));
    refresh();
    showBroadcast();
  }

  function subscribe() {
    sb.channel('live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reports' }, (p) => {
        if (p.eventType === 'DELETE') S.reports.delete(p.old.id); else upsertReport(p.new);
        refresh();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'broadcasts' }, () => reloadBroadcasts())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'app_settings' }, (p) => {
        if (p.new && p.new.key) S.settings[p.new.key] = p.new.value;
        refresh();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'report_types' }, (p) => {
        if (p.new && p.new.key) S.types.set(p.new.key, p.new);
        refresh();
      })
      .subscribe();
  }

  async function reloadBroadcasts() {
    const { data } = await sb.from('broadcasts').select('*').order('created_at', { ascending: false });
    S.broadcasts = data || [];
    showBroadcast();
  }

  // ------------------------------------------------------------------
  // Sessione anonima
  // ------------------------------------------------------------------
  async function ensureSession() {
    const { data } = await sb.auth.getSession();
    if (data && data.session) { S.session = data.session; }
    else {
      const res = await sb.auth.signInAnonymously();
      if (res.error) { console.warn('Accesso anonimo non disponibile', res.error); return; }
      S.session = res.data.session;
    }
    const plat = /iPhone|iPad/.test(navigator.userAgent) ? 'ios' : /Android/.test(navigator.userAgent) ? 'android' : 'web';
    const r = await sb.rpc('touch_device', { p_lang: lang, p_platform: plat, p_version: CFG.version });
    if (r.data && r.data.blocked) toast(t('errBlocked'));
  }

  // ------------------------------------------------------------------
  // Posizione e avvisi di prossimità
  // ------------------------------------------------------------------
  function onPosition(p) {
    const now = { lat: p.coords.latitude, lng: p.coords.longitude, ts: Date.now() };
    const prev = S.pos;
    let speed = p.coords.speed;
    if ((speed == null || isNaN(speed)) && prev) {
      const dt = (now.ts - prev.ts) / 1000;
      speed = dt > 0 ? (distKm(prev, now) * 1000) / dt : 0;
    }
    S.speed = speed || 0;
    if (p.coords.heading != null && !isNaN(p.coords.heading) && S.speed > 1.5) S.heading = p.coords.heading;
    else if (prev && distKm(prev, now) > 0.015) S.heading = bearing(prev, now);
    S.pos = now;

    meMarker.setLngLat([now.lng, now.lat]);
    if (!meAdded) { meMarker.addTo(map); meAdded = true; }
    meEl.style.setProperty('--heading-op', S.heading != null && S.speed > 1.5 ? 1 : 0);
    meMarker.setRotation(S.heading || 0);
    $('gpsDot').classList.add('on');

    if (S.follow) map.easeTo({ center: [now.lng, now.lat], zoom: Math.max(map.getZoom(), S.speed > 15 ? 12.5 : 13.5), duration: 800 });
    refresh();
    checkProximity();
  }

  function onPositionError() { $('gpsDot').classList.remove('on'); updateChip(); }

  function startGps() {
    if (!('geolocation' in navigator)) return;
    navigator.geolocation.watchPosition(onPosition, onPositionError, { enableHighAccuracy: true, maximumAge: 4000, timeout: 20000 });
  }

  function computeAhead() {
    const ref = S.pos || (() => { const c = map.getCenter(); return { lat: c.lat, lng: c.lng }; })();
    const moving = S.pos && S.speed > 2 && S.heading != null;
    const out = [];
    for (const r of S.reports.values()) {
      const d = distKm(ref, r);
      if (d > MAX_KM) continue;
      if (moving && d > 0.3 && angleDiff(bearing(ref, r), S.heading) > 70) continue;
      out.push({ r, d });
    }
    out.sort((a, b) => a.d - b.d);
    S.ahead = out;
    return out;
  }

  function checkProximity() {
    if (!S.pos) return;
    const moving = S.speed > 2;
    const radiusKm = Number(setting('police_radius_km', 2.5));
    for (const { r, d } of S.ahead) {
      if (S.alerted.has(r.id) || (S.session && r.user_id === S.session.user.id)) continue;
      const ty = typeOf(r);
      const limit = ty.is_police ? radiusKm + 0.5 : (S.speed > 22 ? 1.5 : moving ? 1.0 : 0.5);
      if (d <= limit) {
        S.alerted.add(r.id);
        store.set('alerted', [...S.alerted].slice(-300));
        showAlert(r, d);
        break;
      }
    }
  }

  // ------------------------------------------------------------------
  // Avviso a tutto schermo + voce + suono
  // ------------------------------------------------------------------
  let alertTimer, alertId = null;
  function showAlert(r, d) {
    const ty = typeOf(r);
    alertId = r.id;
    const mark = $('alertMark');
    mark.className = 'alert-mark' + (ty.is_police ? ' police' : '');
    mark.style.background = ty.is_police ? '' : ty.color;
    mark.textContent = ty.is_police ? '' : ty.icon;
    const fd = fmtDist(d);
    $('alertDist').textContent = ty.is_police ? t('approx') : fd.v + ' ' + fd.u;
    $('alertTitle').textContent = (r.title || labelOf(ty));
    $('alertYes').textContent = t('still');
    $('alertNo').textContent = t('gone');
    $('alert').classList.remove('hidden');
    clearTimeout(alertTimer);
    alertTimer = setTimeout(hideAlert, 9000);

    if (navigator.vibrate) navigator.vibrate([180, 90, 180]);
    if (S.sound) beep();
    if (S.voice && 'speechSynthesis' in window) {
      const phrase = ty.is_police ? t('inZone') : t('voiceAt', { type: labelOf(ty), dist: fd.v + (fd.u === 'm' ? ' metros' : ' km') });
      const u = new SpeechSynthesisUtterance(lang === 'en' ? phrase.replace('metros', 'metres') : lang === 'it' ? phrase.replace('metros', 'metri') : lang === 'de' ? phrase.replace('metros', 'Meter') : phrase);
      u.lang = LOCALES[lang];
      try { speechSynthesis.cancel(); speechSynthesis.speak(u); } catch (e) {}
    }
  }
  function hideAlert() { $('alert').classList.add('hidden'); alertId = null; }

  let audioCtx;
  function beep() {
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      [0, 0.18].forEach((delay, i) => {
        const o = audioCtx.createOscillator(), g = audioCtx.createGain();
        o.frequency.value = i ? 880 : 660;
        g.gain.setValueAtTime(0.0001, audioCtx.currentTime + delay);
        g.gain.exponentialRampToValueAtTime(0.25, audioCtx.currentTime + delay + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + delay + 0.16);
        o.connect(g).connect(audioCtx.destination);
        o.start(audioCtx.currentTime + delay);
        o.stop(audioCtx.currentTime + delay + 0.18);
      });
    } catch (e) {}
  }

  // ------------------------------------------------------------------
  // Disegno della scheda
  // ------------------------------------------------------------------
  const ARC = { cx: 195, cy: 210, r: 150 };
  const arcPoint = (deg, r) => ({ x: ARC.cx + (r || ARC.r) * Math.cos(rad(deg)), y: ARC.cy - (r || ARC.r) * Math.sin(rad(deg)) });

  function refresh() {
    computeAhead();
    drawMarkers();
    drawArc();
    drawNext();
    drawCard();
    updateChip();
    const maint = setting('maintenance', false) === true;
    $('reportBtn').disabled = maint;
  }

  function updateChip() {
    const b = $('centerBtn');
    const following = !!(S.pos && S.follow);
    b.classList.toggle('following', following);
    b.setAttribute('aria-label', following ? t('following') : t('active', { n: S.reports.size }));
  }

  function drawArc() {
    const g = $('arcMarks'), labels = $('arcLabels');
    g.innerHTML = ''; labels.innerHTML = '';
    $('capLeft').textContent = t('now');
    $('capRight').textContent = MAX_KM + ' KM';
    const items = S.ahead.slice(0, 4);
    if (!items.length) {
      labels.appendChild(el('div', { class: 'arc-empty', text: t('clearSub', { km: MAX_KM }) }));
      return;
    }
    let lastDeg = 999, flip = false;
    items.forEach(({ r, d }) => {
      const ty = typeOf(r);
      const deg = 172 - Math.min(1, d / MAX_KM) * 162;
      const p = arcPoint(deg);
      const ns = 'http://www.w3.org/2000/svg';
      let shape;
      if (ty.is_police) {
        shape = document.createElementNS(ns, 'circle');
        shape.setAttribute('cx', p.x); shape.setAttribute('cy', p.y); shape.setAttribute('r', 11);
        shape.setAttribute('fill', 'var(--sheet)'); shape.setAttribute('stroke', 'var(--blue)');
        shape.setAttribute('stroke-width', '2.5'); shape.setAttribute('stroke-dasharray', '3 2.5');
      } else {
        shape = document.createElementNS(ns, 'rect');
        shape.setAttribute('x', p.x - 10); shape.setAttribute('y', p.y - 10);
        shape.setAttribute('width', 20); shape.setAttribute('height', 20); shape.setAttribute('rx', 5);
        shape.setAttribute('fill', ty.color); shape.setAttribute('stroke', 'var(--sheet)'); shape.setAttribute('stroke-width', '3');
      }
      shape.setAttribute('class', 'arc-mark');
      shape.addEventListener('click', () => select(r.id, true));
      g.appendChild(shape);

      flip = Math.abs(lastDeg - deg) < 24 ? !flip : false;
      lastDeg = deg;
      const lp = arcPoint(deg, flip ? 108 : 178);
      const x = Math.min(352, Math.max(38, lp.x));
      const fd = fmtDist(d);
      const kmColor = ty.is_police ? 'var(--blue-text)' : 'var(--text)';
      const b = el('button', { class: 'arc-label', style: 'left:' + (x / 390 * 100) + '%;top:' + ((flip ? lp.y + 34 : lp.y) / 230 * 100) + '%' }, [
        el('span', { class: 'km', style: 'color:' + kmColor }, [(ty.is_police ? '~' : '') + fd.v, el('small', { text: ' ' + fd.u })]),
        el('span', { class: 'nm', text: shortLabel(labelOf(ty)) })
      ]);
      b.addEventListener('click', () => select(r.id, true));
      labels.appendChild(b);
    });
  }
  const shortLabel = (s) => (s.length > 16 ? s.slice(0, 15) + '…' : s);

  function drawNext() {
    $('nextLabel').textContent = S.ahead.length ? t('next') : t('clear');
    const first = S.ahead[0];
    if (!first) {
      $('nextKm').textContent = '—'; $('nextUnit').textContent = '';
      $('nextSide').textContent = setting('maintenance', false) === true ? t('errMaint') : '';
      return;
    }
    const fd = fmtDist(first.d);
    const ty = typeOf(first.r);
    $('nextKm').textContent = (ty.is_police ? '~' : '') + fd.v;
    $('nextUnit').textContent = fd.u;
    $('nextSide').innerHTML = '';
    $('nextSide').appendChild(el('b', { text: first.r.title || labelOf(ty) }));
    $('nextSide').appendChild(document.createElement('br'));
    $('nextSide').appendChild(document.createTextNode(t('ago', { t: fmtMin((Date.now() - new Date(first.r.created_at)) / 60000) })));
  }

  function drawCard() {
    const sel = (S.selectedId && S.reports.get(S.selectedId)) || (S.ahead[0] && S.ahead[0].r);
    const card = $('card');
    if (!sel) { card.classList.add('hidden'); return; }
    card.classList.remove('hidden');
    const ty = typeOf(sel);
    const mark = $('cardMark');
    mark.className = 'card-mark' + (ty.is_police ? ' police' : '');
    mark.style.background = ty.is_police ? '' : ty.color;
    $('cardTitle').textContent = (sel.official ? t('official') + ' · ' : '') + (sel.title || labelOf(ty));
    const mins = (Date.now() - new Date(sel.created_at)) / 60000;
    const left = (new Date(sel.expires_at) - Date.now()) / 60000;
    const bits = [t('ago', { t: fmtMin(mins) })];
    if (ty.is_police) { bits.push(t('approx')); bits.push(t('expires', { t: fmtMin(left) })); }
    else if (sel.confirms) bits.push(t('confirms', { n: sel.confirms }));
    $('cardMeta').textContent = bits.join(' · ');
    $('voteYes').textContent = t('still');
    $('voteNo').textContent = t('gone');
    card.dataset.id = sel.id;
    $('cardActions').classList.toggle('hidden', sel.source === 'dgt');
  }

  function select(id, fly) {
    S.selectedId = id;
    const r = S.reports.get(id);
    if (r && fly) { S.follow = false; map.easeTo({ center: [r.lng, r.lat], zoom: Math.max(map.getZoom(), 13), duration: 600 }); }
    if (S.collapsed) toggleSheet(false);
    drawMarkers(); drawCard(); updateChip();
  }

  // ------------------------------------------------------------------
  // Voti
  // ------------------------------------------------------------------
  async function vote(id, still) {
    if (!id) return;
    if (S.voted.has(id)) { toast(t('already')); return; }
    if (!S.session) { toast(t('errNoSession')); return; }
    const { data, error } = await sb.rpc('vote_report', { p_id: id, p_still: still });
    if (error) { toast(errMsg(error)); return; }
    if (data === 'own') { toast(t('own')); return; }
    if (data === 'expired') { toast(t('expired')); S.reports.delete(id); refresh(); return; }
    S.voted.add(id); store.set('voted', [...S.voted].slice(-500));
    toast(data === 'already' ? t('already') : t('thanks'));
    const { data: fresh } = await sb.from('reports').select('*').eq('id', id).maybeSingle();
    if (fresh) upsertReport(fresh); else S.reports.delete(id);
    refresh();
  }

  function errMsg(error) {
    const m = (error && error.message) || '';
    if (/bloccato/i.test(m)) return t('errBlocked');
    if (/Troppi/i.test(m)) return t('errRate');
    if (/fuori zona/i.test(m)) return t('errZone');
    if (/disattivata|non disponibile/i.test(m)) return t('errOff');
    if (/manutenzione/i.test(m)) return t('errMaint');
    if (/Sessione/i.test(m)) return t('errNoSession');
    return t('errGeneric');
  }

  // ------------------------------------------------------------------
  // Segnalazione
  // ------------------------------------------------------------------
  function openTypes() {
    if (setting('maintenance', false) === true) { toast(t('errMaint')); return; }
    const grid = $('typesGrid');
    grid.innerHTML = '';
    const policeOn = setting('police_enabled', true) === true;
    [...S.types.values()]
      .filter((ty) => ty.enabled && !ty.admin_only && (!ty.is_police || policeOn))
      .sort((a, b) => a.sort - b.sort)
      .forEach((ty) => {
        const sw = el('span', { class: 'sw' + (ty.is_police ? ' police' : ''), 'aria-hidden': 'true' });
        if (!ty.is_police) { sw.style.background = ty.color; sw.textContent = ty.icon; }
        grid.appendChild(el('button', { class: 'type', onclick: () => send(ty.key) }, [sw, labelOf(ty)]));
      });
    openOverlay('typesOverlay');
  }

  async function send(type) {
    closeOverlays();
    if (!S.session) { await ensureSession(); if (!S.session) { toast(t('errNoSession')); return; } }
    let p = S.pos;
    if (!p) { const c = map.getCenter(); p = { lat: c.lat, lng: c.lng }; toast(t('noGps')); }
    const { data, error } = await sb.from('reports').insert({ type, lat: p.lat, lng: p.lng }).select().maybeSingle();
    if (error) { toast(errMsg(error)); return; }
    if (data) { upsertReport(data); S.alerted.add(data.id); S.voted.add(data.id); }
    if (navigator.vibrate) navigator.vibrate(60);
    toast(t('sent'));
    refresh();
  }

  // ------------------------------------------------------------------
  // Messaggio admin
  // ------------------------------------------------------------------
  function showBroadcast() {
    const now = new Date();
    const b = S.broadcasts.find((x) => x.active && new Date(x.starts_at) <= now && (!x.ends_at || new Date(x.ends_at) > now) && !S.dismissed.has(x.id));
    const box = $('broadcast');
    if (!b) {
      if (setting('maintenance', false) === true) {
        box.className = 'broadcast warning'; $('broadcastText').textContent = t('maint'); box.dataset.id = '';
        return;
      }
      box.classList.add('hidden'); return;
    }
    box.className = 'broadcast ' + b.level;
    $('broadcastText').textContent = (b.message && (b.message[lang] || b.message.es)) || '';
    box.dataset.id = b.id;
  }

  // ------------------------------------------------------------------
  // Scheda apribile / richiudibile
  // ------------------------------------------------------------------
  function toggleSheet(force) {
    S.collapsed = typeof force === 'boolean' ? force : !S.collapsed;
    store.set('collapsed', S.collapsed);
    $('sheet').classList.toggle('collapsed', S.collapsed);
    $('sheetToggle').setAttribute('aria-expanded', String(!S.collapsed));
    setTimeout(padMap, 320);
  }
  (function swipe() {
    let y0 = null;
    const h = $('sheetToggle');
    h.addEventListener('touchstart', (e) => { y0 = e.touches[0].clientY; }, { passive: true });
    h.addEventListener('touchend', (e) => {
      if (y0 == null) return;
      const dy = e.changedTouches[0].clientY - y0;
      if (dy > 40) toggleSheet(true); else if (dy < -40) toggleSheet(false);
      y0 = null;
    });
  })();

  // ------------------------------------------------------------------
  // Pannelli
  // ------------------------------------------------------------------
  function openOverlay(id) { $(id).classList.remove('hidden'); }
  function closeOverlays() { document.querySelectorAll('.overlay').forEach((o) => o.classList.add('hidden')); }
  document.querySelectorAll('.overlay').forEach((o) => {
    o.addEventListener('click', (e) => { if (e.target === o || e.target.closest('[data-close]')) closeOverlays(); });
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeOverlays(); });

  // Scopri l'isola
  let discTab = 'places';
  // Catalogo Maxora (luoghi + attività): salvato sul telefono per la ricerca istantanea, anche offline
  let catalogPromise = null;
  function loadCatalog(force) {
    if (S.places === null) {
      const cached = store.get('catalog', null);
      if (cached) { S.places = cached.places || []; S.businesses = cached.businesses || []; }
    }
    if (catalogPromise && !force) return catalogPromise;
    catalogPromise = Promise.all([
      sb.from('places').select('*').order('featured', { ascending: false }).order('sort'),
      sb.from('businesses').select('*').order('plan', { ascending: false }).order('name')
    ]).then(([p, b]) => {
      if (!p.error) S.places = p.data || [];
      if (!b.error) S.businesses = b.data || [];
      if (S.places === null) S.places = [];
      if (S.businesses === null) S.businesses = [];
      store.set('catalog', { places: S.places, businesses: S.businesses });
    }).catch(() => { if (S.places === null) { S.places = []; S.businesses = []; } });
    return catalogPromise;
  }
  async function openDiscover() {
    openOverlay('discoverOverlay');
    if (S.places === null) await loadCatalog();
    drawDiscover();
  }
  function drawDiscover() {
    document.querySelectorAll('#discoverTabs button').forEach((b) => b.classList.toggle('on', b.dataset.tab === discTab));
    const list = $('discoverList');
    list.innerHTML = '';
    const items = discTab === 'places' ? S.places : S.businesses;
    if (!items || !items.length) { list.appendChild(el('div', { class: 'disc-empty', text: t('soon') })); return; }
    items.forEach((x) => {
      const isBiz = discTab === 'businesses';
      const img = (x.photos && x.photos[0]) || x.logo_url;
      const desc = (x.description && (x.description[lang] || x.description.es)) || '';
      const sponsor = isBiz && x.plan !== 'free' && (!x.sponsor_until || new Date(x.sponsor_until) >= new Date(new Date().toDateString()));
      const textBox = el('div', { style: 'flex:1;min-width:0' }, [
        sponsor ? el('span', { class: 'tag', text: t('sponsor') }) : null,
        el('div', { class: 't', text: x.name }),
        el('div', { class: 's', text: (x.category || '') + (desc ? ' · ' + desc : '') })
      ]);
      if (isBiz && (x.phone || x.website)) {
        const acts = el('div', { class: 'disc-actions' });
        if (x.phone) acts.appendChild(el('a', { href: 'tel:' + x.phone.replace(/\s/g, ''), text: t('call'), onclick: (e) => { e.stopPropagation(); bizEvent(x.id, 'call'); } }));
        if (x.website && /^https?:\/\//.test(x.website)) acts.appendChild(el('a', { href: x.website, target: '_blank', rel: 'noopener', text: t('web'), onclick: (e) => { e.stopPropagation(); bizEvent(x.id, 'web'); } }));
        textBox.appendChild(acts);
      }
      const row = el('button', { class: 'disc', onclick: () => goTo(x, isBiz) }, [
        img ? el('img', { src: img, alt: '', loading: 'lazy' }) : el('div', { class: 'ph' }),
        textBox
      ]);
      list.appendChild(row);
      if (isBiz) bizEvent(x.id, 'view');
    });
  }
  function goTo(x, isBiz) {
    closeOverlays();
    openPlace(isBiz ? fromBiz(x) : fromPlace(x));
  }

  // ------------------------------------------------------------------
  // RICERCA (C: catalogo Maxora istantaneo + vie e luoghi da OpenStreetMap/Photon)
  // ------------------------------------------------------------------
  const PHOTON = 'https://photon.komoot.io';
  const PHOTON_LANGS = ['en', 'de', 'fr'];
  const ICONS = {
    pin: '<path d="M12 21s-6-5.5-6-11a6 6 0 0112 0c0 5.5-6 11-6 11z"/><circle cx="12" cy="10" r="2"/>',
    road: '<path d="M8 3L5 21M16 3l3 18M12 4v3M12 11v3M12 18v2"/>',
    town: '<path d="M3 21V10l5-4 5 4v11M13 21V6l4-3 4 3v15M3 21h18"/>',
    beach: '<path d="M3 18c2 0 2-1.5 4.5-1.5S9.5 18 12 18s2-1.5 4.5-1.5S18.5 18 21 18M12 4v10M12 4c-4 0-6 3-6 5h12c0-2-2-5-6-5z"/>',
    food: '<path d="M7 3v8M5 3v5a2 2 0 004 0V3M7 11v10M16 21V3c-2 0-3 3-3 7h3"/>',
    fuel: '<path d="M5 20V5a1 1 0 011-1h7a1 1 0 011 1v15M4 20h11M14 9h2a2 2 0 012 2v5a1.5 1.5 0 003 0V8l-3-3M8 8h3"/>',
    view: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    cup: '<path d="M5 8h11v5a5 5 0 01-5 5h-1a5 5 0 01-5-5zM16 10h1.5a2.5 2.5 0 010 5H16M8 3v2M11 3v2"/>',
    cart: '<path d="M3 4h2l2.4 11h10.2L20 7H6.3"/><circle cx="9" cy="19" r="1.5"/><circle cx="17" cy="19" r="1.5"/>',
    cross: '<path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z"/>',
    parking: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M10 17V8h3a2.5 2.5 0 010 5h-3"/>',
    bed: '<path d="M3 19V6M3 15h18v4M21 15v-3a3 3 0 00-3-3h-7v6"/><circle cx="7" cy="11" r="2"/>',
    surf: '<path d="M3 17c3-1 4-4 9-4s6 3 9 4M7 13c1-5 5-9 10-9-2 3-3 6-3 9"/>'
  };
  const svgIcon = (k) => {
    const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('width', '20'); s.setAttribute('height', '20'); s.setAttribute('viewBox', '0 0 24 24');
    s.setAttribute('fill', 'none'); s.setAttribute('stroke', 'currentColor'); s.setAttribute('stroke-width', '1.8');
    s.setAttribute('stroke-linecap', 'round'); s.setAttribute('stroke-linejoin', 'round'); s.setAttribute('aria-hidden', 'true');
    s.innerHTML = ICONS[k] || ICONS.pin;
    return s;
  };
  const norm = (s) => (s || '').toString().normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const descOf = (x) => (x.description && (x.description[lang] || x.description.es)) || '';
  const isSponsor = (x) => x.plan && x.plan !== 'free' && (!x.sponsor_until || new Date(x.sponsor_until) >= new Date(new Date().toDateString()));

  function fromPlace(x) {
    const ic = /playa|beach/i.test(x.category) ? 'beach' : /mirador/i.test(x.category) ? 'view' : /surf/i.test(x.category) ? 'surf' : 'star';
    return { kind: 'place', id: x.id, name: x.name, sub: x.category, lat: x.lat, lng: x.lng, icon: ic, ours: true, raw: x };
  }
  function fromBiz(x) {
    const ic = /restaurante|bar/i.test(x.category) ? 'food' : /surf/i.test(x.category) ? 'surf' : 'star';
    return { kind: 'biz', id: x.id, name: x.name, sub: x.category + (x.address ? ' · ' + x.address : ''), lat: x.lat, lng: x.lng, icon: ic, ours: true, sponsor: isSponsor(x), raw: x };
  }
  function fromPhoton(f) {
    const p = f.properties || {};
    const [lng, lat] = f.geometry.coordinates;
    const isRoad = p.osm_key === 'highway';
    const isTown = p.osm_key === 'place';
    const street = p.street ? p.street + (p.housenumber ? ' ' + p.housenumber : '') : '';
    let name = p.name || street || p.city || '';
    if (!p.name && p.housenumber && p.street) name = street;
    const where = [p.name && street ? street : '', p.district || p.locality, p.city && p.city !== name ? p.city : '', !p.city ? p.county : ''].filter(Boolean);
    const icon = isRoad ? 'road' : isTown ? 'town' : p.osm_value === 'beach' ? 'beach' : p.osm_value === 'fuel' ? 'fuel'
      : /restaurant|cafe|bar|fast_food/.test(p.osm_value || '') ? 'food' : p.osm_value === 'viewpoint' ? 'view' : 'pin';
    const kindLabel = isRoad ? t('street') : isTown ? t('town') : p.osm_value === 'beach' ? t('beachT') : t('place');
    return { kind: 'osm', id: (p.osm_type || '') + (p.osm_id || lat + ',' + lng), name, sub: where.length ? where.join(', ') : kindLabel, kindLabel, lat, lng, icon, ours: false, raw: p };
  }

  function localSearch(q) {
    const nq = norm(q).trim();
    if (!nq) return [];
    const toks = nq.split(/\s+/);
    const out = [];
    const scan = (list, mk) => (list || []).forEach((x) => {
      const n = norm(x.name), hay = n + ' ' + norm(x.category) + ' ' + norm(descOf(x)) + ' ' + norm(x.address);
      if (!toks.every((tk) => hay.includes(tk))) return;
      let score = n.startsWith(nq) ? 100 : n.includes(nq) ? 70 : 40;
      const item = mk(x);
      if (item.sponsor) score += 15;
      if (x.featured) score += 10;
      if (S.pos) score -= Math.min(20, distKm(S.pos, x) / 3);
      out.push({ item, score });
    });
    scan(S.places, fromPlace);
    scan(S.businesses, fromBiz);
    return out.sort((a, b) => b.score - a.score).slice(0, 6).map((x) => x.item);
  }

  const photonCache = new Map();
  let photonCtrl = null;
  async function photonSearch(q, tag) {
    const bbox = setting('bbox', { min_lat: 27.5, max_lat: 29.5, min_lng: -18.5, max_lng: -13.2 });
    const ref = S.pos || (() => { const c = map.getCenter(); return { lat: c.lat, lng: c.lng }; })();
    const params = new URLSearchParams({ q, limit: '10' });
    params.set('bbox', [bbox.min_lng, bbox.min_lat, bbox.max_lng, bbox.max_lat].join(','));
    params.set('lat', ref.lat.toFixed(4)); params.set('lon', ref.lng.toFixed(4));
    if (PHOTON_LANGS.includes(lang)) params.set('lang', lang);
    if (tag) params.append('osm_tag', tag);
    const key = params.toString();
    if (photonCache.has(key)) return photonCache.get(key);
    if (photonCtrl) photonCtrl.abort();
    photonCtrl = new AbortController();
    const res = await fetch(PHOTON + '/api/?' + key, { signal: photonCtrl.signal });
    if (!res.ok) throw new Error('photon ' + res.status);
    const json = await res.json();
    const seen = new Set();
    const items = (json.features || []).map(fromPhoton).filter((x) => {
      if (!x.name) return false;
      const k = norm(x.name) + '|' + norm(x.sub);
      if (seen.has(k)) return false;
      seen.add(k); return true;
    }).slice(0, 8);
    photonCache.set(key, items);
    return items;
  }

  // Interfaccia ricerca
  // Categorie: risultati mostrati TUTTI sulla mappa (dati OpenStreetMap via Overpass)
  const CATS = [
    { id: 'food', icon: 'food', color: '#e5484d', l: { es: 'Restaurantes', en: 'Restaurants', it: 'Ristoranti', de: 'Restaurants' },
      syn: ['restaurante', 'restaurantes', 'ristorante', 'ristoranti', 'restaurant', 'restaurants', 'comer', 'mangiare', 'essen', 'food', 'cenar', 'cena', 'pranzo', 'tapas'],
      osm: ['nwr["amenity"="restaurant"]', 'nwr["amenity"="fast_food"]'], ours: /restaurante/i },
    { id: 'drink', icon: 'cup', color: '#8e4ec6', l: { es: 'Bares y cafés', en: 'Bars & cafés', it: 'Bar e caffè', de: 'Bars & Cafés' },
      syn: ['bar', 'bares', 'cafe', 'cafes', 'cafeteria', 'caffe', 'pub', 'kneipe', 'copas', 'aperitivo'],
      osm: ['nwr["amenity"="cafe"]', 'nwr["amenity"="bar"]', 'nwr["amenity"="pub"]'], ours: /^bar/i },
    { id: 'beach', icon: 'beach', color: '#2b8fb0', l: { es: 'Playas', en: 'Beaches', it: 'Spiagge', de: 'Strände' },
      syn: ['playa', 'playas', 'spiaggia', 'spiagge', 'beach', 'beaches', 'strand', 'strande', 'mare'],
      osm: ['nwr["natural"="beach"]'], places: /playa/i },
    { id: 'fuel', icon: 'fuel', color: '#f5a524', l: { es: 'Gasolineras', en: 'Fuel', it: 'Benzinai', de: 'Tankstellen' },
      syn: ['gasolinera', 'gasolineras', 'benzinaio', 'benzinai', 'benzina', 'fuel', 'petrol', 'tankstelle', 'tankstellen', 'gasolina', 'diesel'],
      osm: ['nwr["amenity"="fuel"]'], unnamed: true },
    { id: 'super', icon: 'cart', color: '#2f9e5b', l: { es: 'Supermercados', en: 'Supermarkets', it: 'Supermercati', de: 'Supermärkte' },
      syn: ['supermercado', 'supermercados', 'supermercato', 'supermercati', 'supermarket', 'supermarkt', 'supermarkte', 'spesa', 'hiperdino', 'mercadona', 'lidl', 'spar'],
      osm: ['nwr["shop"="supermarket"]', 'nwr["shop"="convenience"]'], ours: /tienda/i },
    { id: 'pharmacy', icon: 'cross', color: '#2f9e5b', l: { es: 'Farmacias', en: 'Pharmacies', it: 'Farmacie', de: 'Apotheken' },
      syn: ['farmacia', 'farmacias', 'farmacie', 'pharmacy', 'apotheke', 'apotheken'],
      osm: ['nwr["amenity"="pharmacy"]'], unnamed: true },
    { id: 'view', icon: 'view', color: '#8e8c99', l: { es: 'Miradores', en: 'Viewpoints', it: 'Panorami', de: 'Aussichtspunkte' },
      syn: ['mirador', 'miradores', 'panorama', 'panorami', 'belvedere', 'viewpoint', 'viewpoints', 'aussicht', 'aussichtspunkt'],
      osm: ['nwr["tourism"="viewpoint"]'], places: /mirador/i },
    { id: 'surf', icon: 'surf', color: '#14c8b0', l: { es: 'Surf y kite', en: 'Surf & kite', it: 'Surf e kite', de: 'Surfen & Kite' },
      syn: ['surf', 'kite', 'kitesurf', 'windsurf', 'surfschule'],
      osm: ['nwr["shop"="surf"]', 'nwr["sport"="surfing"]', 'nwr["sport"="kitesurfing"]', 'nwr["sport"="windsurfing"]'], ours: /surf/i, places: /surf/i },
    { id: 'parking', icon: 'parking', color: '#3e63dd', l: { es: 'Aparcamientos', en: 'Parking', it: 'Parcheggi', de: 'Parkplätze' },
      syn: ['parking', 'aparcamiento', 'aparcamientos', 'parcheggio', 'parcheggi', 'parkplatz', 'parkplatze'],
      osm: ['nwr["amenity"="parking"]["access"!="private"]'], unnamed: true },
    { id: 'hotel', icon: 'bed', color: '#c2a878', l: { es: 'Alojamiento', en: 'Hotels', it: 'Hotel', de: 'Unterkünfte' },
      syn: ['hotel', 'hoteles', 'albergo', 'alberghi', 'alojamiento', 'apartamento', 'apartamentos', 'hostel', 'unterkunft', 'dormire'],
      osm: ['nwr["tourism"="hotel"]', 'nwr["tourism"="apartment"]', 'nwr["tourism"="hostel"]', 'nwr["tourism"="guest_house"]'], ours: /alojamiento/i }
  ];
  const catLabel = (c) => c.l[lang] || c.l.es;
  const FV_BOX = { s: 27.99, w: -14.55, n: 28.80, e: -13.80 };
  const STOP = ['en', 'a', 'in', 'cerca', 'near', 'bei', 'di', 'de', 'del', 'la', 'el', 'los', 'las', 'i', 'le', 'a'];

  // "ristoranti corralejo" -> { cat: Ristoranti, rest: "corralejo" }
  function matchCat(q) {
    const words = norm(q).trim().split(/\s+/).filter(Boolean);
    if (!words.length) return null;
    for (const c of CATS) {
      const syn = c.syn.map(norm);
      for (let i = 0; i < words.length; i++) {
        if (syn.includes(words[i])) return { cat: c, rest: words.filter((_, k) => k !== i).filter((w) => !STOP.includes(w)).join(' ') };
      }
    }
    return null;
  }

  const OVERPASS = ['https://overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter'];
  let overCtrl = null;
  async function overpass(cat, box) {
    const b = [box.s, box.w, box.n, box.e].map((v) => v.toFixed(4)).join(',');
    const ql = '[out:json][timeout:20];(' + cat.osm.map((f) => f + '(' + b + ');').join('') + ');out center tags 400;';
    if (overCtrl) overCtrl.abort();
    overCtrl = new AbortController();
    let lastErr;
    for (const url of OVERPASS) {
      try {
        const res = await fetch(url + '?data=' + encodeURIComponent(ql), { signal: overCtrl.signal });
        if (!res.ok) throw new Error('overpass ' + res.status);
        const json = await res.json();
        return (json.elements || []).map((e) => fromOverpass(e, cat)).filter(Boolean);
      } catch (e) { if (e.name === 'AbortError') throw e; lastErr = e; }
    }
    throw lastErr;
  }
  function fromOverpass(e, cat) {
    const tg = e.tags || {};
    const lat = e.lat != null ? e.lat : e.center && e.center.lat;
    const lng = e.lon != null ? e.lon : e.center && e.center.lon;
    if (lat == null || lng == null) return null;
    const name = tg.name || tg.brand || tg.operator || (cat.unnamed ? catLabel(cat) : '');
    if (!name) return null;
    const cuisine = tg.cuisine ? tg.cuisine.split(';').slice(0, 2).map((x) => x.replace(/_/g, ' ')).join(', ') : '';
    const addr = [tg['addr:street'] ? tg['addr:street'] + (tg['addr:housenumber'] ? ' ' + tg['addr:housenumber'] : '') : '', tg['addr:city'] || tg['addr:place'] || ''].filter(Boolean).join(', ');
    return { kind: 'osm', id: e.type[0] + e.id, name, sub: [cuisine, addr].filter(Boolean).join(' · ') || catLabel(cat), kindLabel: catLabel(cat), lat, lng, icon: cat.icon, ours: false, raw: { tags: tg } };
  }

  // ------------------------------------------------------------------
  // MODALITÀ "RISULTATI SULLA MAPPA"
  // ------------------------------------------------------------------
  const R = { on: false, cat: null, items: [], markers: new Map(), sel: null, box: null, where: '' };

  function boxAround(p, km) {
    const dLat = km / 110.57, dLng = km / (111.32 * Math.cos(rad(p.lat)));
    return { s: p.lat - dLat, n: p.lat + dLat, w: p.lng - dLng, e: p.lng + dLng };
  }
  function viewBox() {
    const b = map.getBounds();
    return { s: b.getSouth(), w: b.getWest(), n: b.getNorth(), e: b.getEast() };
  }

  async function mapSearch(cat, rest) {
    closeSearch();
    closePlace();
    R.on = true; R.cat = cat; R.sel = null; R.where = '';
    S.follow = false;
    document.body.classList.add('results-on');
    setResultsBar(catLabel(cat) + ' · ' + t('loadingMap'));
    $('areaBtn').classList.add('hidden');
    $('rTrack').innerHTML = '';
    $('rTrack').appendChild(el('div', { class: 'rcard empty' }, [el('div', { class: 's-spin', style: 'width:100%' })]));
    $('results').classList.remove('hidden');
    let box;
    if (rest) {
      // "ristoranti corralejo": prima trovo il paese, poi cerco lì intorno
      try {
        const hits = await photonSearch(rest);
        const town = hits.find((h) => h.raw && h.raw.osm_key === 'place') || hits[0];
        if (town) { box = boxAround(town, 3.5); R.where = town.name; }
      } catch (e) { /* senza rete: cerco nella vista */ }
    }
    if (!R.on || R.cat !== cat) return;
    if (!box) {
      if (map.getZoom() >= 11.5) box = viewBox();
      else if (S.pos) box = boxAround(S.pos, 12);
      else box = FV_BOX;
    }
    await loadResults(box, true);
  }

  async function loadResults(box, fit) {
    const cat = R.cat;
    R.box = box;
    let items = [];
    let failed = false;
    try { items = await overpass(cat, box); }
    catch (e) { if (e.name === 'AbortError') return; failed = true; }
    if (!R.on || R.cat !== cat) return;
    // le schede Maxora della stessa categoria vanno sempre in testa
    const inBox = (x) => x.lat >= box.s && x.lat <= box.n && x.lng >= box.w && x.lng <= box.e;
    const ours = [
      ...(cat.ours ? (S.businesses || []).filter((x) => cat.ours.test(x.category) && inBox(x)).map(fromBiz) : []),
      ...(cat.places ? (S.places || []).filter((x) => cat.places.test(x.category) && inBox(x)).map(fromPlace) : [])
    ];
    const ourNames = new Set(ours.map((x) => norm(x.name)));
    items = items.filter((x) => !ourNames.has(norm(x.name)));
    const ref = S.pos || { lat: (box.s + box.n) / 2, lng: (box.w + box.e) / 2 };
    items.sort((a, b) => distKm(ref, a) - distKm(ref, b));
    ours.sort((a, b) => (b.sponsor ? 1 : 0) - (a.sponsor ? 1 : 0));
    R.items = [...ours, ...items];
    R.sel = null;
    drawResults();
    const n = R.items.length;
    setResultsBar(catLabel(cat) + (R.where ? ' · ' + R.where : '') + ' · ' + (failed && !n ? t('sOffline') : n ? t('nResults', { n }) : t('noResultsArea')));
    if (fit && n) {
      const bb = new maplibregl.LngLatBounds([R.items[0].lng, R.items[0].lat], [R.items[0].lng, R.items[0].lat]);
      R.items.forEach((x) => bb.extend([x.lng, x.lat]));
      const bottom = ($('results').getBoundingClientRect().height || 150) + 24;
      R.fitting = true;
      map.fitBounds(bb, { padding: { top: 90, bottom, left: 40, right: 40 }, maxZoom: 15, duration: 900 });
      setTimeout(() => { R.fitting = false; }, 1200);
    }
    $('areaBtn').classList.add('hidden');
  }

  function pinFor(item, i) {
    const n = el('div', { class: 'rpin' + (item.sponsor ? ' spon' : item.ours ? ' ours' : ''), role: 'button', 'aria-label': item.name });
    n.style.setProperty('--c', R.cat.color);
    const dot = el('span', { class: 'rpin-dot' });
    dot.appendChild(svgIcon(item.icon));
    n.append(dot, el('span', { class: 'rpin-name', text: item.name }));
    n.addEventListener('click', (e) => { e.stopPropagation(); if (R.sel === i) openPlace(item); else selectResult(i, false); });
    return n;
  }

  function drawResults() {
    clearResultMarkers();
    const track = $('rTrack');
    track.innerHTML = '';
    R.items.forEach((item, i) => {
      const m = new maplibregl.Marker({ element: pinFor(item, i), anchor: 'center' }).setLngLat([item.lng, item.lat]).addTo(map);
      R.markers.set(i, m);
      const d = S.pos ? fmtDist(distKm(S.pos, item)) : null;
      const img = item.raw && ((item.raw.photos && item.raw.photos[0]) || item.raw.logo_url);
      const tags = (item.raw && item.raw.tags) || {};
      const ico = el('span', { class: 'rc-ico' + (item.sponsor ? ' spon' : '') });
      ico.style.setProperty('--c', R.cat.color);
      if (img) ico.appendChild(el('img', { src: img, alt: '', loading: 'lazy' })); else ico.appendChild(svgIcon(item.icon));
      const card = el('button', { class: 'rcard', 'data-i': String(i), onclick: () => { if (R.sel === i) openPlace(item); else selectResult(i, true); } }, [
        ico,
        el('span', { class: 'rc-txt' }, [
          item.sponsor ? el('span', { class: 'rc-tag', text: t('sponsor') }) : null,
          el('span', { class: 'rc-t', text: item.name }),
          el('span', { class: 'rc-s', text: item.sub || '' }),
          el('span', { class: 'rc-m' }, [d ? el('b', { text: d.v + ' ' + d.u }) : null, tags.opening_hours ? el('span', { text: (d ? ' · ' : '') + tags.opening_hours }) : null])
        ])
      ]);
      track.appendChild(card);
    });
    if (!R.items.length) track.appendChild(el('div', { class: 'rcard empty', text: t('noResultsArea') }));
    $('results').classList.remove('hidden');
    track.scrollLeft = 0;
  }

  function markSelected(i) {
    R.sel = i;
    R.markers.forEach((m, k) => m.getElement().classList.toggle('sel', k === i));
    const sel = R.markers.get(i);
    if (sel) { const e = sel.getElement(); if (e.parentNode) e.parentNode.appendChild(e); }
    document.querySelectorAll('.rcard').forEach((c) => c.classList.toggle('sel', c.dataset.i === String(i)));
  }
  function selectResult(i, fly) {
    markSelected(i);
    const card = document.querySelector('.rcard[data-i="' + i + '"]');
    if (card && card.scrollIntoView) { R.scrolling = true; card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' }); setTimeout(() => { R.scrolling = false; }, 600); }
    const item = R.items[i];
    if (item) map.easeTo({ center: [item.lng, item.lat], zoom: fly ? Math.max(map.getZoom(), 14) : map.getZoom(), duration: 600 });
  }

  function clearResultMarkers() { R.markers.forEach((m) => m.remove()); R.markers.clear(); }

  function exitResults() {
    R.on = false; R.cat = null; R.items = []; R.sel = null;
    if (overCtrl) overCtrl.abort();
    clearResultMarkers();
    $('results').classList.add('hidden');
    $('areaBtn').classList.add('hidden');
    document.body.classList.remove('results-on');
    $('searchPh').textContent = t('searchPh');
    $('searchInput').value = '';
    $('resultsClose').classList.add('hidden');
    padMap();
  }

  function setResultsBar(text) {
    $('searchPh').textContent = text;
    $('resultsClose').classList.remove('hidden');
  }

  // il carosello scorre -> la mappa segue la scheda al centro
  function syncCarousel() {
    if (R.scrolling) return;
    const tr = $('rTrack'), mid = tr.scrollLeft + tr.clientWidth / 2;
    let best = null, bd = 1e9;
    tr.querySelectorAll('.rcard[data-i]').forEach((c) => { const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid); if (d < bd) { bd = d; best = c; } });
    if (!best || Number(best.dataset.i) === R.sel) return;
    const i = Number(best.dataset.i);
    markSelected(i);
    const it = R.items[i];
    if (it) map.easeTo({ center: [it.lng, it.lat], duration: 500 });
  }

  let searchTimer = null, searchSeq = 0, kbIndex = -1, lastRows = [];

  function openSearch() {
    $('search').classList.remove('hidden');
    loadCatalog();
    const inp = $('searchInput');
    inp.placeholder = t('searchPh');
    setTimeout(() => inp.focus(), 30);
    runSearch(inp.value);
  }
  function closeSearch() { $('search').classList.add('hidden'); $('searchInput').blur(); }

  function row(item, hl) {
    const ico = el('span', { class: 's-ico' + (item.sponsor ? ' spon' : item.ours ? ' ours' : '') });
    ico.appendChild(svgIcon(item.icon));
    const title = el('div', { class: 's-t' });
    const name = item.name || '';
    const i = hl ? norm(name).indexOf(norm(hl).trim()) : -1;
    if (i >= 0 && hl.trim()) {
      const L = hl.trim().length;
      title.append(name.slice(0, i), el('mark', { text: name.slice(i, i + L) }), name.slice(i + L));
    } else title.textContent = name;
    const d = S.pos ? fmtDist(distKm(S.pos, item)) : null;
    const b = el('button', { class: 's-row', onclick: () => pick(item) }, [
      ico,
      el('span', { class: 's-txt' }, [title, el('div', { class: 's-s', text: (item.sponsor ? t('sponsor') + ' · ' : '') + (item.sub || '') })]),
      d ? el('span', { class: 's-d', text: d.v + ' ' + d.u }) : null
    ]);
    return b;
  }

  function renderSearch(parts) {
    const body = $('searchBody');
    body.innerHTML = '';
    lastRows = [];
    kbIndex = -1;
    parts.forEach((p) => {
      if (!p) return;
      if (p.node) { body.appendChild(p.node); if (p.row) lastRows.push(p.node); return; }
      if (p.title) body.appendChild(el('div', { class: 's-sec', text: p.title }));
      (p.items || []).forEach((it) => { const r = row(it, p.hl); lastRows.push(r); body.appendChild(r); });
      if (p.note) body.appendChild(el('div', { class: 's-note', text: p.note }));
    });
  }

  function emptyState() {
    const chips = el('div', { class: 's-chips' }, CATS.map((c) => el('button', { onclick: () => mapSearch(c) }, [svgIcon(c.icon), catLabel(c)])));
    const recent = store.get('recent', []);
    const parts = [{ node: chips }];
    if (recent.length) {
      parts.push({ title: t('sRecent'), items: recent.map((r) => ({ ...r, icon: 'clock' })) });
      parts.push({ node: el('button', { class: 's-row', style: 'min-height:44px;color:var(--muted);font-size:13px', text: t('clearHist'), onclick: () => { store.set('recent', []); runSearch(''); } }) });
    }
    const featured = (S.places || []).filter((x) => x.featured).slice(0, 4).map(fromPlace);
    const spons = (S.businesses || []).filter(isSponsor).slice(0, 4).map(fromBiz);
    if (featured.length || spons.length) parts.push({ title: t('sOurs'), items: [...spons, ...featured] });
    renderSearch(parts);
  }

  function catRow(m) {
    const ico = el('span', { class: 's-ico cat' });
    ico.style.setProperty('--c', m.cat.color);
    ico.appendChild(svgIcon(m.cat.icon));
    return el('button', { class: 's-row s-cat', onclick: () => mapSearch(m.cat, m.rest) }, [
      ico,
      el('span', { class: 's-txt' }, [el('div', { class: 's-t', text: catLabel(m.cat) + (m.rest ? ' · ' + m.rest : '') }), el('div', { class: 's-s', text: t('seeAll') })]),
      el('span', { class: 's-d', text: '→' })
    ]);
  }

  function runSearch(q) {
    $('searchClear').classList.toggle('hidden', !q);
    clearTimeout(searchTimer);
    const seq = ++searchSeq;
    if (!q.trim()) { emptyState(); return; }
    // 0) è una categoria? ("ristoranti", "playas corralejo"...) -> prima riga: tutti sulla mappa
    const m = matchCat(q);
    const catPart = m ? { node: catRow(m), row: true } : null;
    // 1) all'istante: catalogo Maxora
    const local = localSearch(q);
    const localPart = local.length ? { title: t('sOurs'), items: local, hl: q } : null;
    renderSearch([catPart, localPart, q.trim().length >= 2 ? { node: el('div', { class: 's-spin' }) } : null]);
    if (q.trim().length < 2) return;
    // 2) dopo una breve pausa: vie e luoghi
    searchTimer = setTimeout(async () => {
      try {
        const items = await photonSearch(q.trim());
        if (seq !== searchSeq) return;
        const ourNames = new Set(local.map((x) => norm(x.name)));
        const rest = items.filter((x) => !ourNames.has(norm(x.name)));
        renderSearch([catPart, localPart, { title: t('sStreets'), items: rest, hl: q, note: !rest.length && !local.length && !m ? t('sNone') : null }]);
      } catch (e) {
        if (e.name === 'AbortError' || seq !== searchSeq) return;
        renderSearch([catPart, localPart, { note: t('sOffline') }]);
      }
    }, 180);
  }

  function pick(item) {
    const keep = { kind: item.kind, id: item.id, name: item.name, sub: item.sub, lat: item.lat, lng: item.lng, icon: item.icon, ours: item.ours };
    const recent = store.get('recent', []).filter((r) => !(r.kind === keep.kind && r.id === keep.id));
    recent.unshift(keep);
    store.set('recent', recent.slice(0, 6));
    closeSearch();
    // un recente salvato non ha i dati completi: li riprendo dal catalogo se esiste
    if (item.kind === 'biz' && !item.raw) { const b = (S.businesses || []).find((x) => x.id === item.id); if (b) item = fromBiz(b); }
    if (item.kind === 'place' && !item.raw) { const p = (S.places || []).find((x) => x.id === item.id); if (p) item = fromPlace(p); }
    openPlace(item);
  }

  // ------------------------------------------------------------------
  // Scheda luogo
  // ------------------------------------------------------------------
  let destMarker = null;
  function segDistKm(p, a, b) {
    // distanza (km) di p dal segmento a-b, in piano locale
    const kx = 111.32 * Math.cos(rad(a.lat)), ky = 110.57;
    const ax = 0, ay = 0, bx = (b.lng - a.lng) * kx, by = (b.lat - a.lat) * ky, px = (p.lng - a.lng) * kx, py = (p.lat - a.lat) * ky;
    const L2 = bx * bx + by * by;
    const u = L2 ? Math.max(0, Math.min(1, (px * bx + py * by) / L2)) : 0;
    return Math.hypot(px - (ax + u * bx), py - (ay + u * by));
  }

  function openPlace(item) {
    S.follow = false;
    S.dest = item;
    if (destMarker) destMarker.remove();
    if (tempMarker) { tempMarker.remove(); tempMarker = null; }
    if (!R.on) destMarker = new maplibregl.Marker({ element: el('div', { class: 'dest-pin', 'aria-label': item.name }), anchor: 'bottom' }).setLngLat([item.lng, item.lat]).addTo(map);
    const box = $('placeBody');
    box.innerHTML = '';
    const x = item.raw || {};

    const kicker = item.sponsor ? t('sponsor') : item.kind === 'biz' ? t('biz') : item.kind === 'place' ? t('place') : (item.kindLabel || t('place'));
    box.append(
      el('div', { class: 'p-kicker' + (item.sponsor ? ' spon' : '') }, [kicker + (item.ours ? ' · Maxora' : '')]),
      el('div', { class: 'p-name', text: item.name }),
      el('div', { class: 'p-sub', text: item.sub || '' })
    );

    // Numeri: distanza + avvisi
    const near = [], onWay = [];
    for (const r of S.reports.values()) {
      const dDest = distKm(item, r);
      if (dDest <= 3) near.push({ r, d: dDest });
      else if (S.pos && segDistKm(r, S.pos, item) <= 1.2 && distKm(S.pos, r) < distKm(S.pos, item)) onWay.push({ r, d: distKm(S.pos, r) });
    }
    near.sort((a, b) => a.d - b.d); onWay.sort((a, b) => a.d - b.d);
    const stats = el('div', { class: 'p-stats' });
    if (S.pos) { const fd = fmtDist(distKm(S.pos, item)); stats.appendChild(el('div', { class: 'p-stat' }, [el('div', { class: 'k', text: t('fromYou') }), el('div', { class: 'v', text: fd.v + ' ' + fd.u })])); }
    stats.appendChild(el('div', { class: 'p-stat' }, [el('div', { class: 'k', text: t('alertsNear') }), el('div', { class: 'v ' + (near.length ? 'warn' : 'ok'), text: near.length ? String(near.length) : t('none0') })]));
    if (S.pos) stats.appendChild(el('div', { class: 'p-stat' }, [el('div', { class: 'k', text: t('alertsRoute') }), el('div', { class: 'v ' + (onWay.length ? 'warn' : 'ok'), text: onWay.length ? String(onWay.length) : t('none0') })]));
    box.appendChild(stats);

    const alertList = [...onWay.slice(0, 3), ...near.slice(0, 3)];
    if (alertList.length) {
      const list = el('div', { class: 'p-alerts' });
      alertList.forEach(({ r }) => {
        const ty = typeOf(r);
        const m = el('span', { class: 'm' + (ty.is_police ? ' police' : '') });
        if (!ty.is_police) m.style.background = ty.color;
        const dd = S.pos ? fmtDist(distKm(S.pos, r)) : null;
        list.appendChild(el('button', { class: 'p-alert', style: 'text-align:left;color:inherit;width:100%', onclick: () => { closePlace(); select(r.id, true); } }, [
          m, el('span', { class: 't', text: (r.title || labelOf(ty)) }), dd ? el('span', { class: 'd', text: (ty.is_police ? '~' : '') + dd.v + ' ' + dd.u }) : null
        ]));
      });
      box.appendChild(list);
      if (onWay.length) box.appendChild(el('div', { class: 'p-note', text: t('alertsRoute') + ': ' + t('approxRoute') }));
    }

    // Foto e descrizione (solo schede Maxora)
    const photos = [...(x.photos || [])];
    if (photos.length) box.appendChild(el('div', { class: 'p-photos' }, photos.slice(0, 6).map((u) => el('img', { src: u, alt: '', loading: 'lazy' }))));
    const desc = item.ours ? descOf(x) : '';
    if (desc) box.appendChild(el('p', { class: 'p-desc', text: desc }));
    if (x.tags && x.tags.opening_hours) box.appendChild(el('p', { class: 'p-desc' }, [el('b', { text: t('hours') + ': ' }), x.tags.opening_hours]));

    // Azioni
    const acts = el('div', { class: 'p-actions' });
    const apps = el('div', { class: 'p-apps' });
    const appsBox = el('div', { class: 'hidden' }, [el('div', { class: 'p-note', text: t('openWith') }), apps]);
    const ll = item.lat + ',' + item.lng;
    apps.append(
      el('a', { href: 'https://www.google.com/maps/dir/?api=1&destination=' + ll + '&travelmode=driving', target: '_blank', rel: 'noopener', text: 'Google', onclick: () => goEvent(item) }),
      el('a', { href: 'https://waze.com/ul?ll=' + ll + '&navigate=yes', target: '_blank', rel: 'noopener', text: 'Waze', onclick: () => goEvent(item) }),
      el('a', { href: 'https://maps.apple.com/?daddr=' + ll + '&dirflg=d', target: '_blank', rel: 'noopener', text: 'Apple', onclick: () => goEvent(item) })
    );
    const goBtn = el('button', { class: 'p-go', onclick: () => { appsBox.classList.toggle('hidden'); goBtn.setAttribute('aria-expanded', String(!appsBox.classList.contains('hidden'))); } }, [t('go')]);
    goBtn.setAttribute('aria-expanded', 'false');
    acts.appendChild(goBtn);
    const tg = x.tags || {};
    const phone = x.phone || tg.phone || tg['contact:phone'];
    const web = x.website || tg.website || tg['contact:website'];
    if (phone) acts.appendChild(el('a', { href: 'tel:' + String(phone).split(';')[0].replace(/\s/g, ''), text: t('call'), onclick: () => { if (item.kind === 'biz') bizEvent(item.id, 'call'); } }));
    if (web && /^https?:\/\//.test(web)) acts.appendChild(el('a', { href: web, target: '_blank', rel: 'noopener', text: t('web'), onclick: () => { if (item.kind === 'biz') bizEvent(item.id, 'web'); } }));
    if (navigator.share) acts.appendChild(el('button', { class: 'p-sec', text: t('share'), onclick: () => navigator.share({ title: item.name, text: item.name, url: 'https://www.google.com/maps/search/?api=1&query=' + ll }).catch(() => {}) }));
    box.append(acts, appsBox, el('div', { class: 'p-note', text: t('routeNote') }));

    if (item.kind === 'biz') bizEvent(item.id, 'click');
    $('results').classList.add('hidden');
    $('place').classList.remove('hidden');
    $('place').scrollTop = 0;
    // inquadra me + destinazione, oppure solo la destinazione
    const ph = Math.min(window.innerHeight * 0.6, $('place').getBoundingClientRect().height || 360);
    if (S.pos && distKm(S.pos, item) < 80) {
      const b = new maplibregl.LngLatBounds([S.pos.lng, S.pos.lat], [S.pos.lng, S.pos.lat]).extend([item.lng, item.lat]);
      map.fitBounds(b, { padding: { top: 90, bottom: ph + 30, left: 50, right: 50 }, maxZoom: 15, duration: 900 });
    } else {
      map.flyTo({ center: [item.lng, item.lat], zoom: 14.5, duration: 900, padding: { top: 70, bottom: ph, left: 0, right: 0 } });
    }
    updateChip();
  }
  function goEvent(item) { if (item.kind === 'biz') bizEvent(item.id, 'directions'); }
  function closePlace() {
    $('place').classList.add('hidden');
    if (destMarker) { destMarker.remove(); destMarker = null; }
    S.dest = null;
    if (R.on) $('results').classList.remove('hidden');
    padMap();
  }
  const sentEvents = new Set();
  function bizEvent(id, kind) {
    if (!S.session) return;
    const k = id + kind;
    if (kind === 'view' && sentEvents.has(k)) return;
    sentEvents.add(k);
    sb.from('business_events').insert({ business_id: id, kind, user_id: S.session.user.id }).then(() => {});
  }

  // Impostazioni
  function drawSettings() {
    $('settingsTitle').textContent = t('settings');
    $('lblTheme').textContent = t('theme');
    $('lblLang').textContent = t('lang');
    $('lblVoice').textContent = t('voice');
    $('lblSound').textContent = t('sound');
    const tb = document.querySelectorAll('#themeSeg button');
    tb[0].textContent = t('auto'); tb[1].textContent = t('light'); tb[2].textContent = t('dark');
    tb.forEach((b) => b.classList.toggle('on', b.dataset.themeVal === S.theme));
    document.querySelectorAll('#langSeg button').forEach((b) => b.classList.toggle('on', b.dataset.lang === lang));
    $('voiceToggle').checked = S.voice;
    $('soundToggle').checked = S.sound;
    $('settingsNote').textContent = 'Maxora ' + CFG.version;
  }

  function applyTexts() {
    document.documentElement.lang = lang;
    $('reportLabel').textContent = t('report');
    $('searchPh').textContent = t('searchPh');
    $('searchInput').placeholder = t('searchPh');
    $('discoverLabel').textContent = t('discover');
    $('typesTitle').textContent = t('reportTitle');
    $('typesSub').textContent = t('reportSub');
    $('discoverTitle').textContent = t('discover');
    const dt = document.querySelectorAll('#discoverTabs button');
    dt[0].textContent = t('places'); dt[1].textContent = t('businesses');
    drawSettings();
    refresh();
    showBroadcast();
  }

  // ------------------------------------------------------------------
  // Eventi interfaccia
  // ------------------------------------------------------------------
  $('searchOpen').addEventListener('click', () => { if (R.on) $('searchInput').value = ''; openSearch(); });
  $('searchBack').addEventListener('click', closeSearch);
  $('searchInput').addEventListener('input', (e) => runSearch(e.target.value));
  $('searchClear').addEventListener('click', () => { $('searchInput').value = ''; runSearch(''); $('searchInput').focus(); });
  $('searchInput').addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeSearch(); return; }
    if (!lastRows.length) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      kbIndex = (kbIndex + (e.key === 'ArrowDown' ? 1 : -1) + lastRows.length) % lastRows.length;
      lastRows.forEach((r, i) => r.classList.toggle('kb', i === kbIndex));
      lastRows[kbIndex].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      lastRows[Math.max(0, kbIndex)].click();
    }
  });
  $('placeClose').addEventListener('click', closePlace);
  $('resultsClose').addEventListener('click', (e) => { e.stopPropagation(); exitResults(); });
  $('areaBtn').addEventListener('click', () => { if (R.on) { $('areaBtn').classList.add('hidden'); setResultsBar(catLabel(R.cat) + ' · ' + t('loadingMap')); R.where = ''; loadResults(viewBox(), false); } });
  (function () { let tm; $('rTrack').addEventListener('scroll', () => { clearTimeout(tm); tm = setTimeout(syncCarousel, 140); }, { passive: true }); })();
  map.on('moveend', () => {
    if (!R.on || R.fitting || !R.box) return;
    const c = map.getCenter();
    const inside = c.lat > R.box.s && c.lat < R.box.n && c.lng > R.box.w && c.lng < R.box.e;
    const b = viewBox();
    const bigger = (b.n - b.s) > (R.box.n - R.box.s) * 1.6;
    if (!inside || bigger) { $('areaBtn').textContent = t('searchArea'); $('areaBtn').classList.remove('hidden'); }
  });
  $('sheetToggle').addEventListener('click', () => toggleSheet());
  $('reportBtn').addEventListener('click', openTypes);
  $('discoverBtn').addEventListener('click', openDiscover);
  $('settingsBtn').addEventListener('click', () => { drawSettings(); openOverlay('settingsOverlay'); });
  $('voteYes').addEventListener('click', () => vote($('card').dataset.id, true));
  $('voteNo').addEventListener('click', () => vote($('card').dataset.id, false));
  $('alertYes').addEventListener('click', () => { vote(alertId, true); hideAlert(); });
  $('alertNo').addEventListener('click', () => { vote(alertId, false); hideAlert(); });
  $('broadcastClose').addEventListener('click', () => {
    const id = $('broadcast').dataset.id;
    if (id) { S.dismissed.add(id); store.set('dismissed', [...S.dismissed].slice(-100)); }
    $('broadcast').classList.add('hidden');
  });
  $('centerBtn').addEventListener('click', () => {
    S.follow = true;
    if (S.pos) map.easeTo({ center: [S.pos.lng, S.pos.lat], zoom: 13.5, duration: 700 });
    else startGps();
    updateChip();
  });
  document.querySelectorAll('#themeSeg button').forEach((b) => b.addEventListener('click', () => {
    S.theme = b.dataset.themeVal; store.set('theme', S.theme); applyTheme();
  }));
  document.querySelectorAll('#langSeg button').forEach((b) => b.addEventListener('click', () => {
    lang = b.dataset.lang; store.set('lang', lang); applyTexts();
  }));
  document.querySelectorAll('#discoverTabs button').forEach((b) => b.addEventListener('click', () => { discTab = b.dataset.tab; drawDiscover(); }));
  $('voiceToggle').addEventListener('change', (e) => { S.voice = e.target.checked; store.set('voice', S.voice); });
  $('soundToggle').addEventListener('change', (e) => { S.sound = e.target.checked; store.set('sound', S.sound); if (S.sound) beep(); });
  map.on('click', () => { if (S.selectedId) { S.selectedId = null; drawMarkers(); drawCard(); } });
  map.on('moveend', () => { if (!S.pos) refresh(); });
  window.addEventListener('resize', padMap);

  // ------------------------------------------------------------------
  // Avvio
  // ------------------------------------------------------------------
  async function boot() {
    $('sheet').classList.toggle('collapsed', S.collapsed);
    $('sheetToggle').setAttribute('aria-expanded', String(!S.collapsed));
    applyTheme();
    applyTexts();
    padMap();
    await ensureSession();
    await loadAll();
    loadCatalog();
    subscribe();
    startGps();
    setInterval(loadAll, 60000);
    setInterval(() => { for (const r of S.reports.values()) if (!isLive(r)) S.reports.delete(r.id); refresh(); }, 20000);
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
  }
  boot();
})();
