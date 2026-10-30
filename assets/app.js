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
      still: 'Sigue', gone: 'Ya no', dAll: 'Todo', dBeach: 'Playas', dNature: 'Naturaleza', dView: 'Miradores', dTown: 'Pueblos', dBiz: 'Negocios', dMore: 'Más sitios cerca de ti', dFeat: 'Imprescindibles', discShort: 'Descubrir', dOsm: 'Datos OpenStreetMap', gRoad: 'En la carretera', gHaz: 'Peligros', gOther: 'Otros', nearAlready: 'Ya avisado cerca de ti: ¿sigue ahí?', lasts: 'visible {t}', discover: 'Descubre la isla', settings: 'Ajustes',
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
      routeNote: 'Maxora sigue avisándote en segundo plano mientras navegas.', approxRoute: 'aprox., en línea recta', share: 'Compartir', street: 'Calle', place: 'Lugar', town: 'Localidad', beachT: 'Playa', biz: 'Negocio', clearHist: 'Borrar historial', loadingMap: 'buscando…', nResults: '{n} en el mapa', noResultsArea: 'nada en esta zona', seeAll: 'Ver todos en el mapa', searchArea: 'Buscar en esta zona', hours: 'Horario', list: 'Lista', ahead: 'Delante de ti', nextKm: 'próximos {km} km', then: 'Después', you: 'Tú', reportBig: 'Avisar de algo', inDist: 'a {d}', roadClear: 'Vía despejada', roadClearSub: 'Nada avisado en los próximos {km} km', zoneTitle: 'En esta zona', zoneCount: '{n} avisos aquí', zoneNone: 'Nada en esta zona', zoneNoneSub: 'Mueve el mapa para ver otras zonas', fromYouD: 'a {d} de ti', alsoHere: 'También aquí', satOn: 'Vista satélite', mapOn: 'Vista mapa', layers: 'Mapa / satélite'
    },
    en: {
      next: 'Next alert', clear: 'Road clear', clearSub: 'Nothing within {km} km', report: 'REPORT',
      reportTitle: 'What is happening?', reportSub: 'Marked at your position. Only report as a passenger or when stopped.',
      still: 'Still there', gone: 'Gone', dAll: 'All', dBeach: 'Beaches', dNature: 'Nature', dView: 'Viewpoints', dTown: 'Villages', dBiz: 'Businesses', dMore: 'More places near you', dFeat: 'Must-see', discShort: 'Discover', dOsm: 'OpenStreetMap data', gRoad: 'On the road', gHaz: 'Hazards', gOther: 'Other', nearAlready: 'Already reported near you: still there?', lasts: 'shown {t}', discover: 'Discover the island', settings: 'Settings',
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
      routeNote: 'Maxora keeps alerting you in the background while you drive.', approxRoute: 'approx., straight line', share: 'Share', street: 'Street', place: 'Place', town: 'Town', beachT: 'Beach', biz: 'Business', clearHist: 'Clear history', loadingMap: 'searching…', nResults: '{n} on the map', noResultsArea: 'nothing in this area', seeAll: 'Show all on the map', searchArea: 'Search this area', hours: 'Hours', list: 'List', ahead: 'Ahead of you', nextKm: 'next {km} km', then: 'Then', you: 'You', reportBig: 'Report something', inDist: 'in {d}', roadClear: 'Road clear', roadClearSub: 'Nothing reported in the next {km} km', zoneTitle: 'In this area', zoneCount: '{n} alerts here', zoneNone: 'Nothing in this area', zoneNoneSub: 'Move the map to see other areas', fromYouD: '{d} from you', alsoHere: 'Also here', satOn: 'Satellite view', mapOn: 'Map view', layers: 'Map / satellite'
    },
    it: {
      next: 'Prossimo avviso', clear: 'Strada libera', clearSub: 'Niente entro {km} km', report: 'AVVISA',
      reportTitle: 'Cosa succede qui?', reportSub: 'Viene segnato sulla tua posizione. Segnala solo da passeggero o da fermo.',
      still: 'Ancora lì', gone: 'Non c’è più', dAll: 'Tutto', dBeach: 'Spiagge', dNature: 'Natura', dView: 'Belvederi', dTown: 'Paesi', dBiz: 'Attività', dMore: 'Altri posti vicino a te', dFeat: 'Da non perdere', discShort: 'Scopri', dOsm: 'Dati OpenStreetMap', gRoad: 'Sulla strada', gHaz: 'Pericoli', gOther: 'Altro', nearAlready: 'Già segnalato vicino a te: c\'è ancora?', lasts: 'resta {t}', discover: "Scopri l'isola", settings: 'Impostazioni',
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
      routeNote: 'Maxora continua ad avvisarti in sottofondo mentre guidi.', approxRoute: 'approssimato, in linea d’aria', share: 'Condividi', street: 'Via', place: 'Luogo', town: 'Località', beachT: 'Spiaggia', biz: 'Attività', clearHist: 'Cancella cronologia', loadingMap: 'cerco…', nResults: '{n} sulla mappa', noResultsArea: 'niente in questa zona', seeAll: 'Vedi tutti sulla mappa', searchArea: 'Cerca in questa zona', hours: 'Orari', list: 'Lista', ahead: 'Davanti a te', nextKm: 'prossimi {km} km', then: 'Poi', you: 'Tu', reportBig: 'Segnala qualcosa', inDist: 'tra {d}', roadClear: 'Strada libera', roadClearSub: 'Niente segnalato nei prossimi {km} km', zoneTitle: 'In questa zona', zoneCount: '{n} avvisi qui', zoneNone: 'Niente in questa zona', zoneNoneSub: 'Sposta la mappa per vedere altre zone', fromYouD: 'a {d} da te', alsoHere: 'Anche qui', satOn: 'Vista satellite', mapOn: 'Vista mappa', layers: 'Mappa / satellite'
    },
    de: {
      next: 'Nächste Meldung', clear: 'Freie Fahrt', clearSub: 'Nichts im Umkreis von {km} km', report: 'MELDEN',
      reportTitle: 'Was ist los?', reportSub: 'Wird an deiner Position markiert. Nur als Beifahrer oder im Stand melden.',
      still: 'Noch da', gone: 'Weg', dAll: 'Alles', dBeach: 'Strände', dNature: 'Natur', dView: 'Aussichtspunkte', dTown: 'Dörfer', dBiz: 'Betriebe', dMore: 'Weitere Orte in deiner Nähe', dFeat: 'Nicht verpassen', discShort: 'Entdecken', dOsm: 'OpenStreetMap-Daten', gRoad: 'Auf der Straße', gHaz: 'Gefahren', gOther: 'Sonstiges', nearAlready: 'Schon gemeldet in deiner Nähe: noch da?', lasts: 'sichtbar {t}', discover: 'Insel entdecken', settings: 'Einstellungen',
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
      routeNote: 'Maxora warnt dich während der Fahrt im Hintergrund weiter.', approxRoute: 'ca., Luftlinie', share: 'Teilen', street: 'Straße', place: 'Ort', town: 'Ortschaft', beachT: 'Strand', biz: 'Betrieb', clearHist: 'Verlauf löschen', loadingMap: 'suche…', nResults: '{n} auf der Karte', noResultsArea: 'nichts in diesem Bereich', seeAll: 'Alle auf der Karte zeigen', searchArea: 'In diesem Bereich suchen', hours: 'Öffnungszeiten', list: 'Liste', ahead: 'Vor dir', nextKm: 'nächste {km} km', then: 'Danach', you: 'Du', reportBig: 'Etwas melden', inDist: 'in {d}', roadClear: 'Freie Fahrt', roadClearSub: 'Nichts gemeldet auf den nächsten {km} km', zoneTitle: 'In diesem Bereich', zoneCount: '{n} Meldungen hier', zoneNone: 'Nichts in diesem Bereich', zoneNoneSub: 'Karte verschieben, um andere Bereiche zu sehen', fromYouD: '{d} von dir', alsoHere: 'Auch hier', satOn: 'Satellitenansicht', mapOn: 'Kartenansicht', layers: 'Karte / Satellit'
    }
  };
  const LOCALES = { es: 'es-ES', en: 'en-GB', it: 'it-IT', de: 'de-DE' };

  // ------------------------------------------------------------------
  // Stato
  // ------------------------------------------------------------------
  const store = {
    get(k, d) { try { const v = localStorage.getItem('maxora_' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('maxora_' + k, JSON.stringify(v)); } catch (e) {} if (window.MAXORA_ACCOUNT) window.MAXORA_ACCOUNT.changed(k); }
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
    view: [],
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
      const key = styleKey();
      if (map.__style !== key) { map.__style = key; setMapStyle(key); }
      $('layersBtn').classList.toggle('on', S.mapMode === 'sat');
      $('layersBtn').setAttribute('aria-pressed', String(S.mapMode === 'sat'));
    }
    document.querySelectorAll('#themeSeg button').forEach((b) => b.classList.toggle('on', b.dataset.themeVal === S.theme));
  }
  mq.addEventListener('change', () => { if (S.theme === 'auto') applyTheme(); });

  // ------------------------------------------------------------------
  // Mappa
  // ------------------------------------------------------------------
  // Vista satellite: ortofoto ufficiali PNOA (Istituto Geografico Nazionale, CC BY 4.0)
  // + solo le scritte (strade, paesi) prese dallo stile scuro OpenFreeMap
  const SAT_BASE = {
    type: 'raster', tileSize: 256, maxzoom: 19,
    tiles: ['https://www.ign.es/wmts/pnoa-ma?request=GetTile&service=WMTS&VERSION=1.0.0&Layer=OI.OrthoimageCoverage&Style=default&Format=image%2Fjpeg&TileMatrixSet=GoogleMapsCompatible&TileMatrix={z}&TileRow={y}&TileCol={x}'],
    attribution: 'PNOA CC BY 4.0 scne.es · © Instituto Geográfico Nacional'
  };
  let satStyle = null;
  async function getSatStyle() {
    if (satStyle) return satStyle;
    // vista da lontano: Sentinel-2 senza nuvole (EOX, CC BY 4.0), uniforme anche sul mare; da vicino le ortofoto PNOA
    const S2 = { type: 'raster', tileSize: 256, maxzoom: 14, tiles: ['https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless_3857/default/g/{z}/{y}/{x}.jpg'], attribution: 'Sentinel-2 cloudless 2016 by EOX IT Services GmbH (CC BY 4.0)' };
    const st = { version: 8, sources: { s2: S2, sat: Object.assign({}, SAT_BASE, { minzoom: 12 }) }, layers: [
      { id: 'sea', type: 'background', paint: { 'background-color': '#0b2236' } },
      { id: 's2', type: 'raster', source: 's2', paint: { 'raster-fade-duration': 0 } },
      { id: 'sat', type: 'raster', source: 'sat', minzoom: 12.5, paint: { 'raster-fade-duration': 0, 'raster-opacity': ['interpolate', ['linear'], ['zoom'], 12.5, 0, 13.5, 1] } }
    ] };
    try {
      const d = await (await fetch(CFG.mapStyles.labels || CFG.mapStyles.dark)).json();
      st.glyphs = d.glyphs; st.sprite = d.sprite;
      st.sources.openmaptiles = d.sources.openmaptiles;
      d.layers.filter((l) => l.type === 'symbol' && !/oneway/.test(l.id)).forEach((l) => {
        const paint = Object.assign({}, l.paint, { 'text-color': '#ffffff', 'text-halo-color': 'rgba(0,0,0,0.85)', 'text-halo-width': 1.4 });
        st.layers.push(Object.assign({}, l, { paint }));
      });
      satStyle = st;
    } catch (e) { console.warn('scritte satellite non disponibili', e); return st; }
    return satStyle;
  }
  S.mapMode = store.get('mapMode', 'map');
  const styleKey = () => (S.mapMode === 'sat' ? 'sat' : isDark() ? 'dark' : 'light');
  const styleFor = (k) => (k === 'dark' ? CFG.mapStyles.dark : CFG.mapStyles.light);

  // Notte: la stessa mappa a colori, scurita mantenendo le tinte (mare blu, verde, sabbia), strade più chiare del fondo
  function parseColor(c) {
    if (typeof c !== 'string') return null;
    let m, r, g, b, a = 1;
    if ((m = c.match(/^#([0-9a-f]{3,8})$/i))) {
      let h = m[1]; if (h.length <= 4) h = h.split('').map((x) => x + x).join('');
      r = parseInt(h.slice(0, 2), 16); g = parseInt(h.slice(2, 4), 16); b = parseInt(h.slice(4, 6), 16); if (h.length === 8) a = parseInt(h.slice(6, 8), 16) / 255;
    } else if ((m = c.match(/^rgba?\(([^)]+)\)$/i))) { [r, g, b, a = 1] = m[1].split(',').map((x) => parseFloat(x)); }
    else if ((m = c.match(/^hsla?\(([^)]+)\)$/i))) { const v = m[1].split(',').map((x) => parseFloat(x)); return { h: v[0], s: v[1] / 100, l: v[2] / 100, a: v[3] == null ? 1 : v[3] }; }
    else return null;
    r /= 255; g /= 255; b /= 255;
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2;
    let h = 0, sat = 0;
    if (mx !== mn) { const d = mx - mn; sat = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn); h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; }
    return { h, s: sat, l, a };
  }
  const hsla = (c) => 'hsla(' + Math.round(c.h) + ',' + Math.round(c.s * 100) + '%,' + Math.round(c.l * 100) + '%,' + (+c.a.toFixed(2)) + ')';
  function nightColor(v, role) {
    const c = parseColor(v); if (!c) return v;
    if (role === 'text') { c.l = c.s > 0.25 ? 0.78 : 0.88; c.s = Math.min(c.s, 0.45); }
    else if (role === 'halo') { c.l = 0.08; c.s = 0.2; }
    else if (role === 'water') { c.l = 0.17 + c.l * 0.06; c.s = Math.min(0.55, c.s); }
    else if (role === 'road') { c.l = 0.2 + c.l * 0.2; c.s *= 0.5; }
    else if (role === 'minor') { c.l = 0.5; c.s *= 0.25; }
    else if (role === 'minorcase') { c.l = 0.22; c.s *= 0.3; }
    else if (role === 'path') { c.l = 0.58; c.s = Math.min(0.35, c.s); }
    else if (role === 'bg') { c.l = 0.1 + c.l * 0.03; c.s = Math.min(0.15, c.s); }
    else { c.l = 0.09 + c.l * 0.13; c.s *= 0.75; }
    return hsla(c);
  }
  function mapPaint(v, role) {
    if (typeof v === 'string') return nightColor(v, role);
    if (Array.isArray(v)) return v.map((x) => mapPaint(x, role));
    if (v && typeof v === 'object' && Array.isArray(v.stops)) return Object.assign({}, v, { stops: v.stops.map((s) => [s[0], mapPaint(s[1], role)]) });
    return v;
  }
  function nightStyle(st) {
    st.layers = st.layers.map((l) => {
      const id = l.id + ' ' + (l['source-layer'] || '');
      const role = (l.metadata && l.metadata['mx-role']) || (l.type === 'background' ? 'bg' : /water|ocean|river|lake/.test(id) && l.type !== 'symbol' ? 'water'
        : /road|highway|bridge|tunnel|street|path|track|rail|aeroway/.test(id) && l.type === 'line' ? 'road' : 'land');
      const p = Object.assign({}, l.paint);
      Object.keys(p).forEach((k) => {
        if (k === 'text-color') p[k] = mapPaint(p[k], 'text');
        else if (k === 'text-halo-color') p[k] = mapPaint(p[k], 'halo');
        else if (/-color$/.test(k)) p[k] = mapPaint(p[k], role);
      });
      if (l.type === 'raster') { p['raster-brightness-max'] = 0.35; p['raster-saturation'] = -0.2; }
      if (l.type === 'hillshade') { p['hillshade-shadow-color'] = '#000'; p['hillshade-highlight-color'] = 'rgba(255,255,255,0.06)'; }
      if (l.type === 'symbol' && p['icon-opacity'] == null) p['icon-opacity'] = 0.85;
      return Object.assign({}, l, { paint: p });
    });
    return st;
  }
  // Giorno: fondo color sabbia (Fuerteventura è un'isola desertica), il resto dei colori resta quello della mappa
  function dayStyle(st) {
    st.layers = st.layers.map((l) => (l.type === 'background' ? Object.assign({}, l, { paint: Object.assign({}, l.paint, { 'background-color': '#efe5cf' }) }) : l));
    return lighten(st);
  }
  // più fluida sul telefono: edifici piatti invece che in 3D.
  // E più dettaglio prima: stradine, sterrati e sentieri visibili già da vicino al paese (come le altre mappe)
  const W = (stops) => ['interpolate', ['exponential', 1.2], ['zoom']].concat(stops);
  function detail(l) {
    if (l.type !== 'line' || l['source-layer'] !== 'transportation') return l;
    const p = Object.assign({}, l.paint), id = l.id;
    let minzoom = l.minzoom;
    let role = null;
    if (/service_track_casing/.test(id)) { p['line-width'] = W([12, 1.2, 14, 3, 16, 5, 20, 11]); p['line-color'] = '#b8a98d'; minzoom = 12; role = 'minorcase'; }
    else if (/service_track/.test(id)) { p['line-width'] = W([12, 0.5, 14, 1.6, 16, 3, 20, 7.5]); p['line-color'] = '#fffdf7'; minzoom = 12; role = 'minor'; }
    else if (/path_pedestrian_casing/.test(id)) { minzoom = 13; role = 'minorcase'; }
    else if (/path_pedestrian/.test(id)) { p['line-color'] = '#8c7552'; p['line-width'] = W([13, 1, 16, 2, 20, 6]); minzoom = 13; role = 'path'; }
    else if (/(road|bridge|tunnel)_(minor|street)_casing/.test(id)) { p['line-width'] = W([12, 1.2, 13, 2.6, 14, 4, 20, 21]); p['line-opacity'] = 1; minzoom = 11.5; role = 'minorcase'; }
    else if (/(road|bridge|tunnel)_(minor|street)$/.test(id)) { p['line-width'] = W([12, 0.6, 13, 1.4, 14, 2.6, 20, 18]); minzoom = 11.5; role = 'minor'; }
    else return l;
    const out = Object.assign({}, l, { paint: p, metadata: Object.assign({}, l.metadata, { 'mx-role': role }) });
    if (minzoom != null) out.minzoom = minzoom; else delete out.minzoom;
    return out;
  }
  function lighten(st) {
    st.layers = st.layers.map(detail).map((l) => {
      if (l.type !== 'fill-extrusion') return l;
      return { id: l.id, type: 'fill', source: l.source, 'source-layer': l['source-layer'], minzoom: Math.max(14, l.minzoom || 0), filter: l.filter,
        paint: { 'fill-color': (l.paint && typeof l.paint['fill-extrusion-color'] === 'string') ? l.paint['fill-extrusion-color'] : '#d9d0c3', 'fill-opacity': 0.7 } };
    });
    return st;
  }
  async function setMapStyle(key) {
    const st = key === 'sat' ? await getSatStyle() : styleFor(key);
    if (map.__style !== key) return;
    if (key === 'dark') map.setStyle(st, { diff: false, transformStyle: (prev, next) => nightStyle(lighten(next)) });
    else if (key === 'light') map.setStyle(st, { diff: false, transformStyle: (prev, next) => dayStyle(next) });
    else map.setStyle(st, { diff: false });   // diff:false = ridisegna anche le zone polizia
  }

  const center0 = { lat: 28.40, lng: -14.02, zoom: 8.6 };
  const map = new maplibregl.Map({
    container: 'map',
    style: { version: 8, sources: {}, layers: [{ id: 'bg', type: 'background', paint: { 'background-color': isDark() ? '#15191d' : '#f2efe9' } }] },
    maxZoom: 19,
    center: [center0.lng, center0.lat],
    zoom: center0.zoom,
    attributionControl: { compact: true },
    pitchWithRotate: false,
    maxPitch: 0,
    renderWorldCopies: false,
    fadeDuration: 0
  });
  map.__style = styleKey();
  setMapStyle(map.__style);
  map.touchZoomRotate.disableRotation();

  // icone mancanti negli stili esterni: immagine vuota invece di un errore
  map.on('styleimagemissing', (e) => { if (!map.hasImage(e.id)) map.addImage(e.id, { width: 1, height: 1, data: new Uint8Array(4) }); });
  map.on('style.load', () => {
    if (!map.getSource('police')) map.addSource('police', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
    if (!map.getLayer('police-fill')) map.addLayer({ id: 'police-fill', type: 'fill', source: 'police', paint: { 'fill-color': '#2b8fb0', 'fill-opacity': 0.12 } });
    if (!map.getLayer('police-line')) map.addLayer({ id: 'police-line', type: 'line', source: 'police', paint: { 'line-color': '#2b8fb0', 'line-width': 1.5, 'line-dasharray': [2, 2] } });
    drawPoliceZones();
  });
  map.on('dragstart', () => { S.follow = false; S.selectedId = null; updateChip(); });

  const meEl = el('div', { class: 'me' });
  const meMarker = new maplibregl.Marker({ element: meEl, rotationAlignment: 'map' });
  let meAdded = false;
  const markers = new Map();
  let tempMarker = null;

  function padMap() {
    const h = $(document.body.classList.contains('surf-on') ? 'sfSheet' : 'sheet').getBoundingClientRect().height;
    map.setPadding({ top: 70, bottom: Math.max(0, h - 10), left: 0, right: 0 });
  }

  function markerFor(r) {
    const ty = typeOf(r);
    const n = el('div', { class: 'mk' + (ty.is_police ? ' police' : '') + (r.official ? ' official' : ''), role: 'button', 'aria-label': labelOf(ty) });
    if (!ty.is_police) { n.style.background = ty.color; n.appendChild(typeIcon(ty, '#ffffff')); }
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
    computeView();
    return out;
  }

  // Modalità esplorazione: se sposti la mappa (o non c'è GPS) il pannello descrive la zona che stai guardando
  const zoneMode = () => !S.pos || !S.follow;
  function computeView() {
    S.view = [];
    if (!zoneMode()) return;
    const c = map.getCenter(), b = map.getBounds();
    const out = [];
    for (const r of S.reports.values()) {
      if (r.lat < b.getSouth() || r.lat > b.getNorth() || r.lng < b.getWest() || r.lng > b.getEast()) continue;
      out.push({ r, d: S.pos ? distKm(S.pos, r) : null, dc: distKm({ lat: c.lat, lng: c.lng }, r) });
    }
    out.sort((a, b2) => a.dc - b2.dc);
    S.view = out;
  }
  const panelList = () => (zoneMode() ? S.view : S.ahead);

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
    mark.textContent = ''; if (!ty.is_police) mark.appendChild(typeIcon(ty, '#ffffff'));
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
  // Disegno del pannello "Davanti a te"
  // ------------------------------------------------------------------
  // Icone a linea per i tipi di avviso (al posto delle emoji)
  const TYPE_SVG = {
    incidente: '<path d="M12 3l9.5 17h-19z"/><path d="M12 10v4M12 17.5v.5"/>',
    atasco: '<path d="M5 16l1.5-5h11L19 16M5 16h14v3H5zM8 19v1M16 19v1"/>',
    peligro: '<path d="M12 3l9.5 17h-19z"/><path d="M12 10v4M12 17.5v.5"/>',
    obras: '<path d="M10 3h4l4.5 15h-13z"/><path d="M8.2 10h7.6M6.8 14.5h10.4M3 21h18"/>',
    cortada: '<circle cx="12" cy="12" r="9"/><path d="M7 12h10"/>',
    animales: '<circle cx="7" cy="9" r="1.8"/><circle cx="12" cy="6.5" r="1.8"/><circle cx="17" cy="9" r="1.8"/><path d="M12 12c-3 0-5 3.5-5 5.5S9 20 12 19s5 .5 5-1.5S15 12 12 12z"/>',
    arena: '<path d="M3 17c3-4 6-4 9 0s6 4 9 0M3 11c3-4 6-4 9 0s6 4 9 0"/>',
    parking_lleno: '<rect x="4" y="4" width="16" height="16" rx="4"/><path d="M10 17V8h3a2.5 2.5 0 010 5h-3"/>',
    policia: '<path d="M12 3l8 3v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z"/>',
    evento: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
    ciclistas: '<circle cx="5.5" cy="16.5" r="3.5"/><circle cx="18.5" cy="16.5" r="3.5"/><path d="M5.5 16.5L9 9h6l3.5 7.5M9 9l3.5 7.5L15 9M13 5.5h2.5"/>'
  };
  function typeIcon(ty, color) {
    const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('fill', 'none'); s.setAttribute('stroke', color || 'currentColor');
    s.setAttribute('stroke-width', '2'); s.setAttribute('stroke-linecap', 'round'); s.setAttribute('stroke-linejoin', 'round'); s.setAttribute('aria-hidden', 'true');
    s.innerHTML = TYPE_SVG[ty.key] || TYPE_SVG.peligro;
    return s;
  }
  function tint(hex, a) {
    const h = (hex || '#888888').replace('#', '');
    const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
    return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
  }
  const distText = (d, police) => { const f = fmtDist(d); return (police ? '~' : '') + f.v + ' ' + f.u; };

  function refresh() {
    computeAhead();
    drawMarkers();
    drawRoad();
    drawHero();
    drawThen();
    drawHeader();
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

  // L'avviso mostrato in grande: quello toccato sulla mappa, altrimenti il più vicino davanti
  function heroItem() {
    if (S.selectedId && S.reports.has(S.selectedId)) {
      const r = S.reports.get(S.selectedId);
      return { r, d: S.pos ? distKm(S.pos, r) : null };
    }
    return panelList()[0] || null;
  }

  function drawHeader() {
    const zone = zoneMode();
    $('aheadTitle').textContent = zone ? t('zoneTitle') : t('ahead');
    $('sheet').classList.toggle('zone', zone);
    const h = heroItem();
    // chiuso: il riassunto dice subito cosa c'è; aperto: quanta strada guardo
    if (S.collapsed && h) {
      const ty = typeOf(h.r);
      $('aheadSub').textContent = labelOf(ty) + (h.d != null ? ' · ' + distText(h.d, ty.is_police) : '');
    } else {
      $('aheadSub').textContent = setting('maintenance', false) === true ? t('errMaint')
        : zone ? (S.view.length ? t('zoneCount', { n: S.view.length }) : '') : t('nextKm', { km: MAX_KM });
    }
  }

  function drawRoad() {
    const road = $('road');
    road.innerHTML = '';
    road.classList.toggle('hidden', zoneMode());
    if (zoneMode()) return;
    road.append(el('div', { class: 'road-track' }), el('div', { class: 'road-me' }), el('div', { class: 'road-cap left', text: t('you') }), el('div', { class: 'road-cap right', text: MAX_KM + ' km' }));
    let lastLabel = -100;   // etichette mai sovrapposte: almeno 18% di distanza
    S.ahead.slice(0, 5).forEach(({ r, d }) => {
      const ty = typeOf(r);
      const pct = 17 + Math.min(1, d / MAX_KM) * 77;   // lo spazio iniziale resta per "Tu"
      const dot = el('button', { class: 'road-dot' + (ty.is_police ? ' police' : '') + (r.id === (heroItem() || {}).r?.id ? ' on' : ''), style: 'left:' + pct + '%', 'aria-label': labelOf(ty) });
      if (!ty.is_police) dot.style.background = ty.color;
      dot.addEventListener('click', () => select(r.id, true));
      road.appendChild(dot);
      if (pct - lastLabel >= 18) {
        lastLabel = pct;
        const col = ty.is_police ? 'var(--blue-text)' : 'var(--text)';
        road.appendChild(el('div', { class: 'road-km', style: 'left:' + pct + '%;color:' + col, text: distText(d, ty.is_police) }));
        road.appendChild(el('div', { class: 'road-nm', style: 'left:' + pct + '%', text: shortLabel(labelOf(ty)) }));
      }
    });
    road.classList.toggle('empty', !S.ahead.length);
  }
  const shortLabel = (s) => (s.length > 12 ? s.slice(0, 11) + '…' : s);

  function drawHero() {
    const h = heroItem();
    const ico = $('heroIco'), title = $('heroTitle'), meta = $('heroMeta'), hero = $('hero');
    ico.innerHTML = ''; title.innerHTML = '';
    if (!h) {
      // strada libera
      hero.className = 'hero clear';
      ico.style.background = tint('#2f9e5b', 0.14);
      const ok = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      ok.setAttribute('viewBox', '0 0 24 24'); ok.setAttribute('fill', 'none'); ok.setAttribute('stroke', 'var(--green)'); ok.setAttribute('stroke-width', '2.4'); ok.setAttribute('stroke-linecap', 'round'); ok.setAttribute('stroke-linejoin', 'round');
      ok.innerHTML = '<path d="M5 12l5 5 9-10"/>';
      ico.appendChild(ok);
      title.textContent = zoneMode() ? t('zoneNone') : t('roadClear');
      meta.textContent = zoneMode() ? t('zoneNoneSub') : t('roadClearSub', { km: MAX_KM });
      $('cardActions').classList.add('hidden');
      hero.dataset.id = '';
      return;
    }
    const r = h.r, ty = typeOf(r);
    const color = ty.is_police ? '#2b8fb0' : ty.color;
    hero.className = 'hero' + (ty.is_police ? ' police' : '');
    ico.style.background = tint(color, 0.15);
    ico.appendChild(typeIcon(ty, color));
    title.appendChild(document.createTextNode((r.title && r.source !== 'dgt' ? r.title : labelOf(ty)) + ' '));
    if (h.d != null && !zoneMode()) title.appendChild(el('span', { class: 'hero-d', style: 'color:' + (ty.is_police ? 'var(--blue-text)' : 'var(--text)'), text: t('inDist', { d: distText(h.d, ty.is_police) }) }));
    const mins = (Date.now() - new Date(r.created_at)) / 60000;
    const bits = [];
    if (r.source === 'dgt') { bits.push('DGT' + (r.title ? ' ' + r.title.replace(/ · [^(]*/, ' ').trim() : '')); }
    else if (r.official) bits.push(t('official'));
    if (zoneMode() && h.d != null) bits.push(t('fromYouD', { d: distText(h.d, ty.is_police) }));
    bits.push(t('ago', { t: fmtMin(mins) }));
    if (ty.is_police) bits.push(t('approx'));
    else if (r.confirms) bits.push(t('confirms', { n: r.confirms }));
    meta.textContent = bits.join(' · ');
    hero.dataset.id = r.id;
    $('cardActions').classList.toggle('hidden', r.source === 'dgt');
    $('voteYes').setAttribute('aria-label', t('still'));
    $('voteNo').setAttribute('aria-label', t('gone'));
  }

  function drawThen() {
    const h = heroItem();
    const rest = panelList().filter((x) => !h || x.r.id !== h.r.id).slice(0, zoneMode() ? 3 : 2);
    $('thenTitle').textContent = zoneMode() ? t('alsoHere') : t('then');
    const list = $('thenList');
    list.innerHTML = '';
    rest.forEach(({ r, d }) => {
      const ty = typeOf(r);
      const m = el('span', { class: 'then-dot' + (ty.is_police ? ' police' : '') });
      if (!ty.is_police) m.style.background = ty.color;
      list.appendChild(el('button', { class: 'then-row', onclick: () => select(r.id, true) }, [
        m, el('span', { class: 'then-n', text: r.source === 'dgt' && r.title ? r.title : labelOf(ty) }), el('span', { class: 'then-d', text: d != null ? distText(d, ty.is_police) : '' })
      ]));
    });
    $('thenBox').classList.toggle('hidden', !rest.length);
  }

  function select(id, fly) {
    S.selectedId = id;
    const r = S.reports.get(id);
    if (r && fly) { S.follow = false; map.easeTo({ center: [r.lng, r.lat], zoom: Math.max(map.getZoom(), 13), duration: 600 }); }
    if (S.collapsed) toggleSheet(false);
    drawMarkers(); drawRoad(); drawHero(); drawThen(); drawHeader(); updateChip();
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
  const TGROUP = { incidente: 'gRoad', atasco: 'gRoad', cortada: 'gRoad', obras: 'gRoad', peligro: 'gHaz', animales: 'gHaz', arena: 'gHaz' };
  function openTypes() {
    if (setting('maintenance', false) === true) { toast(t('errMaint')); return; }
    const grid = $('typesGrid');
    grid.innerHTML = '';
    grid.className = 'types2';
    // prima: quello che è già segnalato qui vicino (conferma invece di doppione)
    const me = S.pos;
    const near = me ? [...S.reports.values()].filter((r) => r.source !== 'dgt' && !S.voted.has(r.id)).map((r) => ({ r, d: distKm(me, r) })).filter((x) => x.d < 0.6).sort((a, b) => a.d - b.d).slice(0, 3) : [];
    if (near.length) {
      grid.appendChild(el('div', { class: 'tg-h', text: t('nearAlready') }));
      near.forEach(({ r, d }) => {
        const ty = typeOf(r);
        const dot = el('span', { class: 'then-dot' + (ty.is_police ? ' police' : '') }); if (!ty.is_police) dot.style.background = ty.color;
        grid.appendChild(el('div', { class: 'tg-near' }, [dot, el('span', { class: 'n', text: labelOf(ty) }), el('span', { class: 'd', text: distText(d, ty.is_police) }),
          el('button', { class: 'y', onclick: () => { closeOverlays(); vote(r.id, true); }, text: t('still') }),
          el('button', { class: 'x', onclick: () => { closeOverlays(); vote(r.id, false); }, text: t('gone') })]));
      });
    }
    const policeOn = setting('police_enabled', true) === true;
    const types = [...S.types.values()].filter((ty) => ty.enabled && !ty.admin_only && (!ty.is_police || policeOn)).sort((a, b) => a.sort - b.sort);
    const dur = (m) => (m >= 60 ? (m % 60 ? (m / 60).toFixed(1).replace('.', ',') : m / 60) + ' h' : m + ' min');
    ['gRoad', 'gHaz', 'gOther'].forEach((g) => {
      const list = types.filter((ty) => (TGROUP[ty.key] || 'gOther') === g);
      if (!list.length) return;
      grid.appendChild(el('div', { class: 'tg-h', text: t(g) }));
      const row = el('div', { class: 'tg-grid' });
      list.forEach((ty) => {
        const sw = el('span', { class: 'sw' + (ty.is_police ? ' police' : ''), 'aria-hidden': 'true' });
        if (!ty.is_police) { sw.style.background = ty.color; sw.appendChild(typeIcon(ty, '#fff')); }
        row.appendChild(el('button', { class: 'tg', style: '--tc:' + (ty.is_police ? '#1f6f8b' : ty.color), onclick: () => send(ty.key) }, [sw, el('b', { text: labelOf(ty) }), el('small', { text: t('lasts').replace('{t}', dur(ty.duration_min || 30)) })]));
      });
      grid.appendChild(row);
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
    drawHeader();
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
  let discTab = 'all';
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
  // Scopri: categorie in alto, schede con foto (luoghi curati da Maxora), poi altri posti vicini da OpenStreetMap
  const DCATS = [['all', 'dAll', null], ['playa', 'dBeach', /playa|beach/], ['naturaleza', 'dNature', /naturaleza|nature/], ['mirador', 'dView', /mirador/], ['pueblo', 'dTown', /pueblo|cultura/]];
  function drawDiscover() {
    const tabs = $('discoverTabs');
    tabs.className = 'disc-chips';
    tabs.innerHTML = '';
    const cats = DCATS.filter(([k, , re]) => !re || (S.places || []).some((x) => re.test(x.category || '')));
    if ((S.businesses || []).length) cats.push(['businesses', 'dBiz', null]);
    if (!cats.some((c) => c[0] === discTab)) discTab = 'all';
    cats.forEach(([k, lbl]) => tabs.appendChild(el('button', { class: discTab === k ? 'on' : '', onclick: () => { discTab = k; drawDiscover(); $('discoverList').scrollTop = 0; } }, [t(lbl)])));
    const list = $('discoverList');
    list.innerHTML = '';
    const ref = S.pos || null;
    const dist = (x) => (ref ? distKm(ref, x) : null);
    const fmt = (d) => (d == null ? '' : d < 1 ? Math.round(d * 1000) + ' m' : (d < 10 ? d.toFixed(1).replace('.', lang === 'en' ? '.' : ',') : Math.round(d)) + ' km');
    if (discTab === 'businesses') {
      (S.businesses || []).forEach((x) => {
        const img = (x.photos && x.photos[0]) || x.logo_url;
        list.appendChild(el('button', { class: 'disc', onclick: () => goTo(x, true) }, [img ? el('img', { src: img, alt: '', loading: 'lazy' }) : el('div', { class: 'ph' }),
          el('div', { style: 'flex:1;min-width:0' }, [isSponsor(x) ? el('span', { class: 'tag', text: t('sponsor') }) : null, el('div', { class: 't', text: x.name }), el('div', { class: 's', text: x.category || '' })])]));
        bizEvent(x.id, 'view');
      });
      return;
    }
    const re = (DCATS.find((c) => c[0] === discTab) || [])[2];
    const items = (S.places || []).filter((x) => !re || re.test(x.category || '')).map((x) => ({ x, d: dist(x) }))
      .sort((a, b) => (ref ? a.d - b.d : (b.x.featured - a.x.featured)));
    if (!items.length && !ref) { list.appendChild(el('div', { class: 'disc-empty', text: t('soon') })); return; }
    if (items.length) list.appendChild(el('div', { class: 'disc-h', text: t('dFeat') }));
    const grid = el('div', { class: 'disc-grid' });
    items.forEach(({ x, d }) => {
      const img = x.photos && x.photos[0];
      const desc = (x.description && (x.description[lang] || x.description.es)) || '';
      grid.appendChild(el('button', { class: 'dcard', onclick: () => goTo(x, false) }, [
        el('div', { class: 'dimg' }, [img ? el('img', { src: img, alt: '', loading: 'lazy' }) : null, el('span', { class: 'dcat', text: pcat(x.category) }), d != null ? el('span', { class: 'ddist', text: fmt(d) }) : null]),
        el('div', { class: 'dtxt' }, [el('b', { text: x.name }), desc ? el('span', { text: desc }) : null,
          (x.photo_credits && x.photo_credits[0] && x.photo_credits[0].author) ? el('small', { text: '© ' + x.photo_credits[0].author + ' · ' + x.photo_credits[0].license }) : null])
      ]));
    });
    list.appendChild(grid);
    // altri posti vicini (spiagge e belvederi da OpenStreetMap), solo con la posizione
    if (!ref || !['all', 'playa', 'mirador'].includes(discTab)) return;
    loadPoiFile().then((f) => {
      if (!$('discoverOverlay') || $('discoverOverlay').classList.contains('hidden')) return;
      const want = discTab === 'playa' ? ['beach'] : discTab === 'mirador' ? ['view'] : ['beach', 'view'];
      const more = [];
      want.forEach((c) => (f.cats[c] || []).forEach((r) => {
        if (!r[1]) return;
        const p = { lat: r[2], lng: r[3] };
        if ((S.places || []).some((x) => distKm(x, p) < 0.4) || more.some((m) => m.name === r[1] && distKm(m, p) < 0.5)) return;
        more.push({ name: r[1], lat: r[2], lng: r[3], c, d: distKm(ref, p) });
      }));
      more.sort((a, b) => a.d - b.d);
      if (!more.length) return;
      list.appendChild(el('div', { class: 'disc-h', text: t('dMore') }));
      more.slice(0, 15).forEach((m) => list.appendChild(el('button', { class: 'disc-row', onclick: () => { closeOverlays(); openPlace({ kind: 'place', name: m.name, sub: pcat(m.c === 'beach' ? 'playa' : 'mirador'), lat: m.lat, lng: m.lng, icon: m.c === 'beach' ? 'beach' : 'view' }); } }, [
        el('span', { class: 'ic' }, [svgIcon(m.c === 'beach' ? 'beach' : 'view')]), el('span', { class: 't', text: m.name }), el('span', { class: 'd', text: fmt(m.d) })
      ])));
      list.appendChild(el('p', { class: 'p-note', text: t('dOsm') }));
    }).catch(() => {});
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

  const PCAT = {
    playa: { es: 'Playa', en: 'Beach', it: 'Spiaggia', de: 'Strand' }, mirador: { es: 'Mirador', en: 'Viewpoint', it: 'Belvedere', de: 'Aussichtspunkt' },
    pueblo: { es: 'Pueblo', en: 'Village', it: 'Paese', de: 'Dorf' }, naturaleza: { es: 'Naturaleza', en: 'Nature', it: 'Natura', de: 'Natur' },
    cultura: { es: 'Cultura', en: 'Culture', it: 'Cultura', de: 'Kultur' }, surf: { es: 'Surf', en: 'Surf', it: 'Surf', de: 'Surfen' }, otro: { es: 'Lugar', en: 'Place', it: 'Luogo', de: 'Ort' }
  };
  const pcat = (c) => (PCAT[c] && (PCAT[c][lang] || PCAT[c].es)) || c || '';
  function fromPlace(x) {
    const ic = /playa|beach/i.test(x.category) ? 'beach' : /mirador/i.test(x.category) ? 'view' : /surf/i.test(x.category) ? 'surf' : 'star';
    return { kind: 'place', id: x.id, name: x.name, sub: pcat(x.category), lat: x.lat, lng: x.lng, icon: ic, ours: true, raw: x };
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
    const ctrl = photonCtrl;
    const tmo = setTimeout(() => ctrl.abort('timeout'), 6000);
    let res;
    try { res = await fetch(PHOTON + '/api/?' + key, { signal: ctrl.signal }); }
    catch (e) { if (ctrl.signal.reason === 'timeout') throw new Error('timeout'); throw e; }
    finally { clearTimeout(tmo); }
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

  // Punti d'interesse: copiati ogni notte da OpenStreetMap nel nostro database (tabella pois).
  // Dopo il primo caricamento stanno nel telefono: le ricerche successive sono istantanee.
  const POI = new Map();
  const POI_TTL = 12 * 3600 * 1000;
  // Fonte principale: data/pois.json, ricostruito ogni notte da GitHub dall'estratto ufficiale
  // OpenStreetMap (Geofabrik). Un solo file per tutte le categorie, poi resta nel telefono.
  let poiFile = null;
  async function loadPoiFile() {
    if (poiFile && Date.now() - poiFile.at < POI_TTL) return poiFile;
    const disk = store.get('poifile', null);
    if (disk && Date.now() - disk.at < POI_TTL) { poiFile = disk; return disk; }
    try {
      const ctrl = new AbortController();
      const tmo = setTimeout(() => ctrl.abort(), 10000);
      const res = await fetch('data/pois.json', { signal: ctrl.signal, cache: 'no-cache' });
      clearTimeout(tmo);
      if (!res.ok) throw new Error('pois.json ' + res.status);
      const doc = await res.json();
      poiFile = { at: Date.now(), cats: doc.cats || {}, generated: doc.generated_at };
      store.set('poifile', poiFile);
      return poiFile;
    } catch (e) {
      if (disk) { poiFile = disk; return disk; }
      throw e;
    }
  }
  async function getPois(cat) {
    const mem = POI.get(cat.id);
    if (mem && Date.now() - mem.at < POI_TTL) return mem.items;
    let rows = null;
    try {
      const f = await loadPoiFile();
      if (f.cats[cat.id]) rows = f.cats[cat.id].map((r) => ({ id: r[0], name: r[1], lat: r[2], lng: r[3], tags: r[4] || {} }));
    } catch (e) { /* passo alla riserva */ }
    if (!rows) {
      // riserva: tabella pois nel nostro database
      const { data, error } = await sb.from('pois').select('id,name,lat,lng,tags').eq('cat', cat.id).limit(1000);
      if (error) throw error;
      rows = data || [];
    }
    const items = rows.map((r) => fromPoi(r, cat));
    POI.set(cat.id, { at: Date.now(), items });
    return items;
  }
  function prefetchPois() { loadPoiFile().catch(() => {}); }
  function fromPoi(r, cat) { return fromOverpass({ type: String(r.id)[0] === 'n' ? 'node' : String(r.id)[0] === 'w' ? 'way' : 'relation', id: String(r.id).slice(1), lat: r.lat, lon: r.lng, tags: Object.assign({ name: r.name }, r.tags) }, cat); }
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
    try {
      const all = await getPois(cat);
      items = all.filter((x) => x.lat >= box.s && x.lat <= box.n && x.lng >= box.w && x.lng <= box.e);
    } catch (e) { failed = true; }
    if (!R.on || R.cat !== cat) return;
    // le schede Maxora della stessa categoria vanno sempre in testa
    const inBox = (x) => x.lat >= box.s && x.lat <= box.n && x.lng >= box.w && x.lng <= box.e;
    const ours = [
      ...(cat.ours ? (S.businesses || []).filter((x) => cat.ours.test(x.category) && inBox(x)).map(fromBiz) : []),
      ...(cat.places ? (S.places || []).filter((x) => cat.places.test(x.category) && inBox(x)).map(fromPlace) : [])
    ];
    const ourNames = new Set(ours.map((x) => norm(x.name)));
    items = items.filter((x) => !ourNames.has(norm(x.name)));
    const mid = { lat: (box.s + box.n) / 2, lng: (box.w + box.e) / 2 };
    // cercando "ristoranti corralejo" conta il centro del paese, non dove sono io
    const ref = R.where ? mid : (S.pos && inBox(S.pos) ? S.pos : mid);
    items.sort((a, b) => distKm(ref, a) - distKm(ref, b));
    ours.sort((a, b) => (b.sponsor ? 1 : 0) - (a.sponsor ? 1 : 0));
    R.items = [...ours, ...items];
    R.sel = null;
    drawResults();
    const n = R.items.length;
    setResultsBar(catLabel(cat) + (R.where ? ' · ' + R.where : '') + ' · ' + (failed && !n ? t('sOffline') : n ? t('nResults', { n }) : t('noResultsArea')));
    if (fit && n) {
      // inquadro i più vicini (non tutti): il paese si apre leggibile, gli altri si vedono spostando la mappa
      const core = [...ours, ...items.slice(0, 15)];
      const bb = new maplibregl.LngLatBounds([core[0].lng, core[0].lat], [core[0].lng, core[0].lat]);
      core.forEach((x) => bb.extend([x.lng, x.lat]));
      const bottom = ($('results').getBoundingClientRect().height || 150) + 24;
      R.fitting = true;
      map.fitBounds(bb, { padding: { top: 90, bottom, left: 40, right: 40 }, maxZoom: 15, duration: 900 });
      setTimeout(() => { R.fitting = false; }, 1200);
    }
    $('areaBtn').classList.add('hidden');
  }

  function pinFor(item, i) {
    const n = el('div', { class: 'rpin' + (item.sponsor ? ' spon' : item.ours ? ' ours' : ''), role: 'button', title: item.name, 'data-ll': item.lng + ',' + item.lat });
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

    const photos = [...(x.photos || [])];
    // ogni foto con il suo credito (autore · licenza), obbligatorio per le foto con licenza libera
    const credits = Array.isArray(x.photo_credits) ? x.photo_credits : [];
    if (photos.length) box.appendChild(el('div', { class: 'p-photos' }, photos.slice(0, 6).map((u, i) => {
      const c = credits[i];
      return el('figure', { class: 'p-fig' }, [
        el('img', { src: u, alt: item.name, loading: 'lazy' }),
        c && c.author ? el('figcaption', {}, [c.source ? el('a', { href: c.source, target: '_blank', rel: 'noopener', text: '© ' + c.author + ' · ' + c.license }) : '© ' + c.author + ' · ' + c.license]) : null
      ]);
    })));
    // descrizione e orari subito sotto le foto
    const desc = item.ours ? descOf(x) : '';
    if (desc) box.appendChild(el('p', { class: 'p-desc', text: desc }));
    if (x.tags && x.tags.opening_hours) box.appendChild(el('p', { class: 'p-desc' }, [el('b', { text: t('hours') + ': ' }), x.tags.opening_hours]));
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
    if (window.MAXORA_FUEL && S.pos) window.MAXORA_FUEL.card(box, item, S.pos);

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
    $('discoverBtn').setAttribute('aria-label', t('discover'));
    $('settingsBtn').setAttribute('aria-label', t('settings'));
    $('layersBtn').setAttribute('aria-label', t('layers'));
    $('reportLabel').textContent = t('reportBig');
    $('typesTitle').textContent = t('reportTitle');
    $('typesSub').textContent = t('reportSub');
    $('discoverTitle').textContent = t('discover');
    if ($('discoverLabel')) $('discoverLabel').textContent = t('discShort');
    if (!$('discoverOverlay').classList.contains('hidden')) drawDiscover();
    drawSettings();
    refresh();
    showBroadcast();
    textHooks.forEach((f) => { try { f(); } catch (e) { console.warn(e); } });
  }
  const textHooks = [];

  // ------------------------------------------------------------------
  // Eventi interfaccia
  // ------------------------------------------------------------------
  $('layersBtn').addEventListener('click', () => {
    S.mapMode = S.mapMode === 'sat' ? 'map' : 'sat';
    store.set('mapMode', S.mapMode);
    applyTheme();
    toast(S.mapMode === 'sat' ? t('satOn') : t('mapOn'));
  });
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
  $('voteYes').addEventListener('click', () => vote($('hero').dataset.id, true));
  $('voteNo').addEventListener('click', () => vote($('hero').dataset.id, false));
  $('alertYes').addEventListener('click', () => { vote(alertId, true); hideAlert(); });
  $('alertNo').addEventListener('click', () => { vote(alertId, false); hideAlert(); });
  $('broadcastClose').addEventListener('click', () => {
    const id = $('broadcast').dataset.id;
    if (id) { S.dismissed.add(id); store.set('dismissed', [...S.dismissed].slice(-100)); }
    $('broadcast').classList.add('hidden');
  });
  $('centerBtn').addEventListener('click', () => {
    S.follow = true;
    S.selectedId = null;
    if (S.pos) map.easeTo({ center: [S.pos.lng, S.pos.lat], zoom: 13.5, duration: 700 });
    else startGps();
    refresh();
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
  map.on('click', () => { if (S.selectedId) { S.selectedId = null; refresh(); } });
  let moveTimer;
  map.on('moveend', () => { clearTimeout(moveTimer); moveTimer = setTimeout(() => { if (!S.follow || !S.pos) refresh(); }, 120); });
  window.addEventListener('resize', padMap);

  // ------------------------------------------------------------------
  // Avvio
  // ------------------------------------------------------------------
  // Per i moduli aggiuntivi (modalità surf)
  window.MAXORA = {
    map, sb, el, store, toast, padMap, closePlace, exitResults, openPlace,
    lang: () => lang, onTexts: (f) => textHooks.push(f), pos: () => S.pos, startGps, closeOverlays,
    setLang: (l) => { if (T[l]) { lang = l; store.set('lang', l); applyTexts(); } },
    unfollow: () => { S.follow = false; S.selectedId = null; updateChip(); },
    reports: () => [...S.reports.values()], report: (type) => send(type),
    typeLabel: (r) => labelOf(typeOf(r)), typeColor: (r) => typeOf(r).color, distKm
  };

  async function boot() {
    $('sheet').classList.toggle('collapsed', S.collapsed);
    $('sheetToggle').setAttribute('aria-expanded', String(!S.collapsed));
    applyTheme();
    applyTexts();
    padMap();
    await ensureSession();
    await loadAll();
    loadCatalog();
    setTimeout(prefetchPois, 2500);
    subscribe();
    // al primo avvio la posizione si chiede dentro il tutorial, dopo averne spiegato il motivo
    if (store.get('tourDone', false)) startGps();
    setInterval(loadAll, 60000);
    setInterval(() => { for (const r of S.reports.values()) if (!isLive(r)) S.reports.delete(r.id); refresh(); }, 20000);
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
  }
  boot();
})();
