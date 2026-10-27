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
    $('routeChip').textContent = S.pos && S.follow ? t('following') : t('active', { n: S.reports.size });
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
  async function openDiscover() {
    openOverlay('discoverOverlay');
    if (S.places === null) {
      const [p, b] = await Promise.all([
        sb.from('places').select('*').order('featured', { ascending: false }).order('sort'),
        sb.from('businesses').select('*').order('plan', { ascending: false }).order('name')
      ]);
      S.places = p.data || []; S.businesses = b.data || [];
    }
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
    S.follow = false;
    if (tempMarker) tempMarker.remove();
    const n = el('div', { class: 'mk-place' + (isBiz ? ' biz' : ''), 'aria-label': x.name });
    tempMarker = new maplibregl.Marker({ element: n }).setLngLat([x.lng, x.lat]).addTo(map);
    map.flyTo({ center: [x.lng, x.lat], zoom: 14, duration: 900 });
    if (isBiz) bizEvent(x.id, 'click');
    toast(x.name);
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
    subscribe();
    startGps();
    setInterval(loadAll, 60000);
    setInterval(() => { for (const r of S.reports.values()) if (!isLive(r)) S.reports.delete(r.id); refresh(); }, 20000);
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
  }
  boot();
})();
