/* Maxora — modalità bici e corsa + menu delle modalità (strada · surf · bici · corsa) */
(function () {
  'use strict';
  const M = window.MAXORA;
  if (!M) return;
  const { map, el, store } = M;
  const $ = (id) => document.getElementById(id);

  // ------------------------------------------------------------------
  // Testi
  // ------------------------------------------------------------------
  const TX = {
    it: {
      advLabel: 'Consiglio', v4: 'Ottimo momento per uscire', v3: 'Buon momento, con qualche attenzione', v2: 'Si può uscire, ma non è l\'ideale', v1: 'Meglio un altro momento',
      aNight: 'Buio: luci e capo riflettente', aRain: 'Pioggia prevista: fondo scivoloso', aWind: 'Vento {v} km/h da {d}: parti controvento, evita i tratti esposti', aGust: 'Raffiche fino a {g} km/h nei tratti aperti',
      aHot: '{t}°: porta acqua, evita le ore centrali', aCold: '{t}°: strato antivento', aGood: 'Temperatura e vento nella norma', aBetter: 'Finestra migliore: {h}', aRoute: 'Percorso più adatto: {n}',
      camper: 'Camper', dCamper: 'Sosta, scarico, acqua, docce', dRoad: 'Avvisi, traffico e controlli', dSurf: 'Onde, vento, maree e spot', dBike: 'Percorsi, vento e salite', dRun: 'Percorsi e ora migliore', exitMode: 'Esci', modeNow: 'Modalità {m}', road: 'Strada', surf: 'Surf', bike: 'Bici', run: 'Corsa', modes: 'Modalità',
      bikeOn: 'Modalità bici', runOn: 'Modalità corsa', roadOn: 'Modalità strada',
      bestTime: 'Ora migliore: {h}', now: 'Adesso', temp: 'Temperatura', wind: 'Vento', gust: 'raffiche', rain: 'Pioggia', dry: 'asciutto', light: 'Luce',
      sunrise: 'alba {h}', sunset: 'tramonto {h}', night: 'notte', today: 'Oggi', tomorrow: 'Domani',
      routes: 'Percorsi', km: 'km', up: 'salita', surface_road: 'asfalto', surface_gravel: 'sterrato', surface_paved: 'lungomare', surface_trail: 'sentiero',
      oneway: 'solo andata', official: 'segnalato', lvl1: 'facile', lvl2: 'medio', lvl3: 'impegnativo', loop: 'giro ad anello', back: 'andata e ritorno',
      alertsOn1: '1 avviso sul percorso', water1: '1 punto acqua vicino al percorso', alertsOn: '{n} avvisi sul percorso', noAlerts: 'nessun avviso sul percorso', water: '{n} punti acqua vicino al percorso', noWater: 'nessuna fontanella sul percorso: porta acqua',
      profile: 'Altimetria', maxGrade: 'pendenza max {g}%', climb: 'Salita principale: {km} km al {avg}% (+{gain} m) dal km {from}',
      windRoute: 'Il vento sul percorso', headFirst: 'Parti controvento ({d}) e torni con il vento a favore.', tailFirst: 'All\'andata hai il vento a favore: il ritorno sarà controvento ({d}). Tieni energie.',
      reverse: 'Conviene fare il giro al contrario: così il tratto controvento è all\'inizio.', loopOk: 'Il verso del giro va bene: il tratto controvento è all\'inizio.', windCalm: 'Vento debole: nessun problema.',
      crossStrong: 'Attenzione al vento laterale forte nei tratti esposti.',
      bestFor: 'Le ore migliori per questo percorso', go: 'VAI ALLA PARTENZA', openWith: 'Apri navigazione con', gpx: 'Scarica GPX (Garmin, Strava, Komoot)',
      reportBikes: 'Segnala ciclisti qui', reportBikesSub: 'Gli automobilisti ricevono l\'avviso per 30 minuti',
      adviceHot: 'Fa caldo: esci presto o dopo le 18 e porta acqua.', adviceWind: 'Vento forte da {d}: scegli percorsi riparati o parti controvento.',
      adviceGood: 'Condizioni buone per uscire.', adviceNight: 'È buio: luci e giubbino riflettente.', adviceRain: 'Possibile pioggia.',
      src: 'Meteo: ECMWF Open Data (CC BY 4.0). Percorsi: OpenStreetMap (ODbL). Quote: Copernicus DEM. ', updated: 'aggiornato {t}', ago: '{t} fa',
      loading: 'Carico…', noData: 'Dati non disponibili adesso', stars: 'condizioni', score: 'Condizioni per {s}',
      future: 'Registrare le uscite arriverà più avanti: per ora scarica il GPX e registra con l\'app che usi.'
    },
    es: {
      advLabel: 'Consejo', v4: 'Momento ideal para salir', v3: 'Buen momento, con alguna precaución', v2: 'Se puede salir, pero no es lo ideal', v1: 'Mejor otro momento',
      aNight: 'Oscuridad: luces y prenda reflectante', aRain: 'Lluvia prevista: firme resbaladizo', aWind: 'Viento {v} km/h del {d}: sal en contra, evita tramos expuestos', aGust: 'Rachas de hasta {g} km/h en tramos abiertos',
      aHot: '{t}°: lleva agua, evita las horas centrales', aCold: '{t}°: capa cortavientos', aGood: 'Temperatura y viento normales', aBetter: 'Mejor franja: {h}', aRoute: 'Ruta más adecuada: {n}',
      camper: 'Camper', dCamper: 'Pernocta, vaciado, agua, duchas', dRoad: 'Avisos, tráfico y controles', dSurf: 'Olas, viento, mareas y spots', dBike: 'Rutas, viento y subidas', dRun: 'Rutas y mejor hora', exitMode: 'Salir', modeNow: 'Modo {m}', road: 'Carretera', surf: 'Surf', bike: 'Bici', run: 'Correr', modes: 'Modos',
      bikeOn: 'Modo bici', runOn: 'Modo correr', roadOn: 'Modo carretera',
      bestTime: 'Mejor hora: {h}', now: 'Ahora', temp: 'Temperatura', wind: 'Viento', gust: 'rachas', rain: 'Lluvia', dry: 'seco', light: 'Luz',
      sunrise: 'amanecer {h}', sunset: 'atardecer {h}', night: 'noche', today: 'Hoy', tomorrow: 'Mañana',
      routes: 'Rutas', km: 'km', up: 'desnivel', surface_road: 'asfalto', surface_gravel: 'pista', surface_paved: 'paseo', surface_trail: 'sendero',
      oneway: 'solo ida', official: 'señalizado', lvl1: 'fácil', lvl2: 'media', lvl3: 'exigente', loop: 'circular', back: 'ida y vuelta',
      alertsOn1: '1 aviso en la ruta', water1: '1 punto de agua cerca de la ruta', alertsOn: '{n} avisos en la ruta', noAlerts: 'ningún aviso en la ruta', water: '{n} puntos de agua cerca de la ruta', noWater: 'ninguna fuente en la ruta: lleva agua',
      profile: 'Perfil', maxGrade: 'pendiente máx. {g}%', climb: 'Subida principal: {km} km al {avg}% (+{gain} m) desde el km {from}',
      windRoute: 'El viento en la ruta', headFirst: 'Sales con viento en contra ({d}) y vuelves a favor.', tailFirst: 'A la ida el viento va a favor: la vuelta será en contra ({d}). Guarda fuerzas.',
      reverse: 'Mejor hacer la vuelta al revés: así el tramo en contra queda al principio.', loopOk: 'El sentido de la vuelta es bueno: el tramo en contra queda al principio.', windCalm: 'Viento flojo: sin problema.',
      crossStrong: 'Cuidado con el viento lateral fuerte en los tramos expuestos.',
      bestFor: 'Las mejores horas para esta ruta', go: 'IR A LA SALIDA', openWith: 'Abrir navegación con', gpx: 'Descargar GPX (Garmin, Strava, Komoot)',
      reportBikes: 'Avisar ciclistas aquí', reportBikesSub: 'Los conductores reciben el aviso durante 30 minutos',
      adviceHot: 'Hace calor: sal temprano o después de las 18 y lleva agua.', adviceWind: 'Viento fuerte del {d}: elige rutas resguardadas o sal en contra.',
      adviceGood: 'Buenas condiciones para salir.', adviceNight: 'Es de noche: luces y chaleco reflectante.', adviceRain: 'Posible lluvia.',
      src: 'Tiempo: ECMWF Open Data (CC BY 4.0). Rutas: OpenStreetMap (ODbL). Altitud: Copernicus DEM. ', updated: 'actualizado {t}', ago: 'hace {t}',
      loading: 'Cargando…', noData: 'Datos no disponibles ahora', stars: 'condiciones', score: 'Condiciones para {s}',
      future: 'Registrar las salidas llegará más adelante: por ahora descarga el GPX y registra con tu app.'
    },
    en: {
      advLabel: 'Advice', v4: 'Great time to go out', v3: 'Good time, with some caution', v2: 'Possible, but not ideal', v1: 'Better another time',
      aNight: 'Dark: lights and reflective layer', aRain: 'Rain expected: slippery surface', aWind: 'Wind {v} km/h from {d}: start into the wind, avoid exposed sections', aGust: 'Gusts up to {g} km/h on open sections',
      aHot: '{t}°: carry water, avoid midday', aCold: '{t}°: windproof layer', aGood: 'Temperature and wind normal', aBetter: 'Best window: {h}', aRoute: 'Best route now: {n}',
      camper: 'Camper', dCamper: 'Overnight, dump, water, showers', dRoad: 'Alerts, traffic and checks', dSurf: 'Waves, wind, tides and spots', dBike: 'Routes, wind and climbs', dRun: 'Routes and best time', exitMode: 'Exit', modeNow: '{m} mode', road: 'Road', surf: 'Surf', bike: 'Bike', run: 'Run', modes: 'Modes',
      bikeOn: 'Bike mode', runOn: 'Run mode', roadOn: 'Road mode',
      bestTime: 'Best time: {h}', now: 'Now', temp: 'Temperature', wind: 'Wind', gust: 'gusts', rain: 'Rain', dry: 'dry', light: 'Light',
      sunrise: 'sunrise {h}', sunset: 'sunset {h}', night: 'night', today: 'Today', tomorrow: 'Tomorrow',
      routes: 'Routes', km: 'km', up: 'climbing', surface_road: 'road', surface_gravel: 'gravel', surface_paved: 'promenade', surface_trail: 'trail',
      oneway: 'one way', official: 'waymarked', lvl1: 'easy', lvl2: 'moderate', lvl3: 'hard', loop: 'loop', back: 'out and back',
      alertsOn1: '1 alert on the route', water1: '1 water point near the route', alertsOn: '{n} alerts on the route', noAlerts: 'no alerts on the route', water: '{n} water points near the route', noWater: 'no fountains on the route: carry water',
      profile: 'Elevation', maxGrade: 'max grade {g}%', climb: 'Main climb: {km} km at {avg}% (+{gain} m) from km {from}',
      windRoute: 'Wind on the route', headFirst: 'Headwind on the way out ({d}), tailwind home.', tailFirst: 'Tailwind on the way out: the return will be into the wind ({d}). Save energy.',
      reverse: 'Ride the loop the other way: the headwind section comes first.', loopOk: 'Loop direction is good: the headwind section comes first.', windCalm: 'Light wind: no problem.',
      crossStrong: 'Watch out for strong crosswinds on exposed sections.',
      bestFor: 'Best hours for this route', go: 'GO TO THE START', openWith: 'Navigate with', gpx: 'Download GPX (Garmin, Strava, Komoot)',
      reportBikes: 'Report cyclists here', reportBikesSub: 'Drivers get the alert for 30 minutes',
      adviceHot: 'It\'s hot: go early or after 6 pm and carry water.', adviceWind: 'Strong wind from {d}: pick sheltered routes or start into the wind.',
      adviceGood: 'Good conditions to go out.', adviceNight: 'It\'s dark: lights and a reflective vest.', adviceRain: 'Rain possible.',
      src: 'Weather: ECMWF Open Data (CC BY 4.0). Routes: OpenStreetMap (ODbL). Elevation: Copernicus DEM. ', updated: 'updated {t}', ago: '{t} ago',
      loading: 'Loading…', noData: 'Data not available right now', stars: 'conditions', score: 'Conditions for {s}',
      future: 'Recording your rides is coming later: for now download the GPX and record with your usual app.'
    },
    de: {
      advLabel: 'Empfehlung', v4: 'Sehr gute Zeit zum Rausgehen', v3: 'Gute Zeit, mit etwas Vorsicht', v2: 'Möglich, aber nicht ideal', v1: 'Besser ein andermal',
      aNight: 'Dunkel: Licht und Reflektoren', aRain: 'Regen erwartet: rutschiger Untergrund', aWind: 'Wind {v} km/h aus {d}: gegen den Wind starten, offene Abschnitte meiden', aGust: 'Böen bis {g} km/h auf offenen Abschnitten',
      aHot: '{t}°: Wasser mitnehmen, Mittagshitze meiden', aCold: '{t}°: winddichte Schicht', aGood: 'Temperatur und Wind normal', aBetter: 'Bestes Zeitfenster: {h}', aRoute: 'Passendste Strecke: {n}',
      camper: 'Camper', dCamper: 'Stellplatz, Entsorgung, Wasser, Duschen', dRoad: 'Meldungen, Verkehr, Kontrollen', dSurf: 'Wellen, Wind, Gezeiten, Spots', dBike: 'Strecken, Wind, Anstiege', dRun: 'Strecken und beste Zeit', exitMode: 'Beenden', modeNow: 'Modus {m}', road: 'Straße', surf: 'Surf', bike: 'Rad', run: 'Laufen', modes: 'Modi',
      bikeOn: 'Radmodus', runOn: 'Laufmodus', roadOn: 'Straßenmodus',
      bestTime: 'Beste Zeit: {h}', now: 'Jetzt', temp: 'Temperatur', wind: 'Wind', gust: 'Böen', rain: 'Regen', dry: 'trocken', light: 'Licht',
      sunrise: 'Aufgang {h}', sunset: 'Untergang {h}', night: 'Nacht', today: 'Heute', tomorrow: 'Morgen',
      routes: 'Strecken', km: 'km', up: 'Anstieg', surface_road: 'Asphalt', surface_gravel: 'Schotter', surface_paved: 'Promenade', surface_trail: 'Pfad',
      oneway: 'einfache Strecke', official: 'markiert', lvl1: 'leicht', lvl2: 'mittel', lvl3: 'schwer', loop: 'Rundkurs', back: 'hin und zurück',
      alertsOn1: '1 Meldung auf der Strecke', water1: '1 Wasserstelle nahe der Strecke', alertsOn: '{n} Meldungen auf der Strecke', noAlerts: 'keine Meldungen auf der Strecke', water: '{n} Wasserstellen nahe der Strecke', noWater: 'keine Brunnen auf der Strecke: Wasser mitnehmen',
      profile: 'Höhenprofil', maxGrade: 'max. Steigung {g}%', climb: 'Hauptanstieg: {km} km mit {avg}% (+{gain} m) ab km {from}',
      windRoute: 'Wind auf der Strecke', headFirst: 'Hinweg mit Gegenwind ({d}), zurück mit Rückenwind.', tailFirst: 'Hinweg mit Rückenwind: zurück geht es gegen den Wind ({d}). Kräfte sparen.',
      reverse: 'Fahr die Runde andersherum: dann kommt der Gegenwind zuerst.', loopOk: 'Die Richtung passt: der Gegenwind kommt zuerst.', windCalm: 'Schwacher Wind: kein Problem.',
      crossStrong: 'Vorsicht vor starkem Seitenwind auf offenen Abschnitten.',
      bestFor: 'Beste Stunden für diese Strecke', go: 'ZUM START', openWith: 'Navigieren mit', gpx: 'GPX herunterladen (Garmin, Strava, Komoot)',
      reportBikes: 'Radfahrer hier melden', reportBikesSub: 'Autofahrer sehen die Meldung 30 Minuten lang',
      adviceHot: 'Es ist heiß: früh oder nach 18 Uhr los und Wasser mitnehmen.', adviceWind: 'Starker Wind aus {d}: geschützte Strecken wählen oder gegen den Wind starten.',
      adviceGood: 'Gute Bedingungen zum Rausgehen.', adviceNight: 'Es ist dunkel: Licht und Warnweste.', adviceRain: 'Regen möglich.',
      src: 'Wetter: ECMWF Open Data (CC BY 4.0). Strecken: OpenStreetMap (ODbL). Höhen: Copernicus DEM. ', updated: 'aktualisiert {t}', ago: 'vor {t}',
      loading: 'Lade…', noData: 'Daten gerade nicht verfügbar', stars: 'Bedingungen', score: 'Bedingungen für {s}',
      future: 'Aufzeichnen kommt später: lade jetzt das GPX und zeichne mit deiner App auf.'
    }
  };
  const LOC = { es: 'es-ES', en: 'en-GB', it: 'it-IT', de: 'de-DE' };
  const COMPASS = {
    es: ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'], it: ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'],
    en: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'], de: ['N', 'NO', 'O', 'SO', 'S', 'SW', 'W', 'NW']
  };
  const lang = () => (TX[M.lang()] ? M.lang() : 'es');
  const tr = (k, v) => {
    let s = TX[lang()][k] || TX.es[k] || k;
    if (v) Object.keys(v).forEach((x) => { s = s.replace('{' + x + '}', v[x]); });
    return s;
  };
  const TZ = 'Atlantic/Canary';
  const fmt = (o) => new Intl.DateTimeFormat(LOC[lang()], Object.assign({ timeZone: TZ }, o));
  const hhmm = (ms) => fmt({ hour: '2-digit', minute: '2-digit', hour12: false }).format(ms);
  const hh = (ms) => fmt({ hour: '2-digit', hour12: false }).format(ms);
  const dayKey = (ms) => new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(ms);
  const num = (v, d) => new Intl.NumberFormat(LOC[lang()], { maximumFractionDigits: d, minimumFractionDigits: d }).format(v);
  const compass = (deg) => COMPASS[lang()][Math.round(((deg % 360) + 360) % 360 / 45) % 8];
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const rad = (d) => d * Math.PI / 180;
  const angleDiff = (a, b) => { const d = Math.abs(a - b) % 360; return d > 180 ? 360 - d : d; };
  function dayLabel(ms) {
    const k = dayKey(ms);
    if (k === dayKey(Date.now())) return tr('today');
    if (k === dayKey(Date.now() + 86400000)) return tr('tomorrow');
    const s = fmt({ weekday: 'short', day: 'numeric' }).format(ms);
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  // ------------------------------------------------------------------
  // Sole
  // ------------------------------------------------------------------
  function sunAlt(ms, lat, lng) {
    const d = (ms - Date.UTC(2000, 0, 1, 12)) / 86400000;
    const g = rad(357.529 + 0.98560028 * d), q = 280.459 + 0.98564736 * d;
    const L = rad(q + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g)), e = rad(23.439 - 0.00000036 * d);
    const ra = Math.atan2(Math.cos(e) * Math.sin(L), Math.cos(L)), dec = Math.asin(Math.sin(e) * Math.sin(L));
    const ha = rad(((18.697374558 + 24.06570982441908 * d) % 24) * 15 + lng) - ra;
    return Math.asin(Math.sin(rad(lat)) * Math.sin(dec) + Math.cos(rad(lat)) * Math.cos(dec) * Math.cos(ha)) * 180 / Math.PI;
  }
  function sunTimes(ms) {
    const k = dayKey(ms);
    let t0 = Date.parse(k + 'T00:00:00Z');
    let rise = null, set = null, prev = sunAlt(t0, 28.4, -14);
    for (let t = t0 + 600000; t <= t0 + 86400000; t += 600000) {
      const a = sunAlt(t, 28.4, -14);
      if (prev < -0.83 && a >= -0.83) rise = t;
      if (prev >= -0.83 && a < -0.83) set = t;
      prev = a;
    }
    return { rise, set };
  }

  // ------------------------------------------------------------------
  // Stato e dati
  // ------------------------------------------------------------------
  const SP = { mode: null, routes: [], wx: null, times: [], idx: 0, open: null, pois: null, collapsed: store.get('spCollapsed', false), loadedAt: 0 };
  async function getJSON(u) { const r = await fetch(u + '?v=' + Math.floor(Date.now() / 300000), { cache: 'no-cache' }); if (!r.ok) throw new Error(u); return r.json(); }
  async function load(force) {
    if (!force && SP.wx && Date.now() - SP.loadedAt < 20 * 60000) return;
    const [rt, wx, pois] = await Promise.all([getJSON('data/routes.json'), getJSON('data/weather.json'), getJSON('data/pois.json').catch(() => null)]);
    SP.routes = rt.routes; SP.src = rt.source;
    SP.wx = wx; SP.times = wx.times.map((s) => Date.parse(s.replace('Z', ':00Z')));
    SP.pois = pois;
    SP.loadedAt = Date.now();
    let best = 0;
    SP.times.forEach((t, i) => { if (Math.abs(t - Date.now()) < Math.abs(SP.times[best] - Date.now())) best = i; });
    if (!SP.picked) SP.idx = best;
    // pre-calcolo: punto meteo più vicino, rilevamenti e punti acqua per ogni percorso
    const water = pois ? [...(pois.cats.water || []), ...(pois.cats.fuel || [])].map((r) => ({ lat: r[2], lng: r[3], name: r[1], kind: (pois.cats.water || []).includes(r) ? 'water' : 'fuel' })) : [];
    SP.water = water;
    SP.bikeShops = pois ? (pois.cats.bike || []).map((r) => ({ lat: r[2], lng: r[3], name: r[1] || 'Bike', tags: r[4] || {} })) : [];
    for (const r of SP.routes) {
      const mid = r.line[Math.floor(r.line.length / 2)];
      let bi = 0, bd = 1e9;
      wx.points.forEach((p, i) => { const d = (p.lat - mid[1]) ** 2 + (p.lng - mid[0]) ** 2; if (d < bd) { bd = d; bi = i; } });
      r._wx = wx.points[bi];
      r._segs = segments(r.line);
      const sample = r.line.filter((_, i) => i % 4 === 0);
      r._water = water.filter((w) => sample.some((p) => M.distKm({ lat: p[1], lng: p[0] }, w) < 0.3));
    }
  }
  function segments(line) {
    // tratti di ~500 m con direzione di marcia
    const out = [];
    for (let i = 0; i + 20 < line.length; i += 20) {
      const a = line[i], b = line[i + 20];
      const y = Math.sin(rad(b[0] - a[0])) * Math.cos(rad(b[1]));
      const x = Math.cos(rad(a[1])) * Math.sin(rad(b[1])) - Math.sin(rad(a[1])) * Math.cos(rad(b[1])) * Math.cos(rad(b[0] - a[0]));
      out.push({ brg: (Math.atan2(y, x) * 180 / Math.PI + 360) % 360, half: i < line.length / 2 ? 0 : 1 });
    }
    return out;
  }
  function wxAt(p, k) {
    if (!p || k < 0 || k >= p.t.length) return null;
    return { t: p.t[k], ws: p.ws[k], wd: p.wd[k], g: p.g ? Math.max(p.g[k] || 0, p.ws[k]) : null, p: p.p[k] };
  }
  // punto all'interno dell'isola (28,5 N · 14,0 O): rappresenta le condizioni generali
  function centerPoint() { return SP.wx.points.find((p) => p.lat === 28.5 && p.lng === -14) || SP.wx.points[0]; }

  // ------------------------------------------------------------------
  // Voto delle condizioni 0–5
  // ------------------------------------------------------------------
  function score(sport, w, ms, surface) {
    if (!w) return null;
    let s = 1;
    const day = sunAlt(ms + 5400000, 28.4, -14) > -2;      // centro della fascia di 3 ore
    if (sport === 'bike') {
      s *= w.t > 24 ? clamp(1 - (w.t - 24) / 10, 0.2, 1) : w.t < 14 ? clamp(1 - (14 - w.t) / 12, 0.4, 1) : 1;
      s *= w.ws < 15 ? 1 : clamp(1 - (w.ws - 15) / 30, 0.1, 1);
      if (w.g && w.g > 45) s *= 0.7;
      if (!day) s *= 0.25;
    } else {
      s *= w.t > 19 ? clamp(1 - (w.t - 19) / 9, 0.15, 1) : w.t < 10 ? clamp(1 - (10 - w.t) / 12, 0.5, 1) : 1;
      if (w.t > 22 && sunAlt(ms + 5400000, 28.4, -14) > 40) s *= 0.8;
      s *= w.ws < 20 ? 1 : clamp(1 - (w.ws - 20) / 35, 0.2, 1);
      if (!day) s *= surface === 'trail' ? 0.3 : 0.8;
    }
    if (w.p > 0.3) s *= 0.5;
    return Math.round(clamp(s * 5, 0, 5) * 2) / 2;
  }
  const color = (r) => (r == null ? '#9aa4ae' : r < 1 ? '#9aa4ae' : r < 2 ? '#e5484d' : r < 3 ? '#f5a524' : r < 4 ? '#2f9e5b' : '#14c8b0');
  const fmtR = (r) => (r == null ? '–' : num(r, r % 1 ? 1 : 0));
  function stars(r) { return el('span', { class: 'sf-stars', style: '--p:' + ((r || 0) / 5 * 100) + '%' }); }

  // vento lungo il percorso: quanto è controvento all'andata e al ritorno
  function windOnRoute(r, w) {
    if (!w || w.ws < 12) return { calm: true };
    let h = [0, 0], n = [0, 0], cross = 0;
    for (const s of r._segs) {
      const rel = angleDiff(w.wd, s.brg);           // vento che arriva da davanti = 0°
      h[s.half] += Math.cos(rad(rel)) * w.ws; n[s.half]++;
      if (Math.abs(Math.sin(rad(rel))) * w.ws > 25) cross++;
    }
    const head0 = n[0] ? h[0] / n[0] : 0, head1 = n[1] ? h[1] / n[1] : 0;
    return { calm: false, head0, head1, cross: cross / Math.max(1, r._segs.length) };
  }
  function hazardsOn(r) {
    const sample = r.line.filter((_, i) => i % 3 === 0);
    return M.reports().filter((rep) => sample.some((p) => M.distKm({ lat: p[1], lng: p[0] }, rep) < 0.15));
  }
  function bestSlots(r, n) {
    const out = [];
    SP.times.forEach((t, k) => {
      if (t < Date.now() - 90 * 60000 || t > Date.now() + 48 * 3600000) return;
      const s = score(r.sport, wxAt(r._wx, k), t, r.surface);
      if (s != null) out.push({ k, t, s });
    });
    return out.sort((a, b) => b.s - a.s || a.t - b.t).slice(0, n);
  }

  // ------------------------------------------------------------------
  // Mappa: linee dei percorsi, fontanelle, officine
  // ------------------------------------------------------------------
  const markers = [];
  function ensureLayers() {
    if (!map.getSource('sp-routes')) map.addSource('sp-routes', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
    if (!map.getLayer('sp-casing')) map.addLayer({ id: 'sp-casing', type: 'line', source: 'sp-routes', layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': '#ffffff', 'line-width': ['case', ['get', 'sel'], 9, 5], 'line-opacity': 0.9 } });
    if (!map.getLayer('sp-line')) map.addLayer({ id: 'sp-line', type: 'line', source: 'sp-routes', layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': ['get', 'c'], 'line-width': ['case', ['get', 'sel'], 5, 3], 'line-opacity': ['case', ['get', 'dim'], 0.45, 1] } });
  }
  function drawMap() {
    markers.forEach((m) => m.remove()); markers.length = 0;
    if (!map.getStyle()) return;
    ensureLayers();
    const feats = !SP.mode ? [] : SP.routes.filter((r) => r.sport === SP.mode).map((r) => {
      const s = score(r.sport, wxAt(r._wx, SP.idx), SP.times[SP.idx], r.surface);
      return { type: 'Feature', properties: { id: r.id, c: color(s), sel: SP.open === r.id, dim: !!SP.open && SP.open !== r.id }, geometry: { type: 'LineString', coordinates: r.line } };
    });
    map.getSource('sp-routes').setData({ type: 'FeatureCollection', features: feats });
    if (!SP.mode) return;
    // partenze
    SP.routes.filter((r) => r.sport === SP.mode).forEach((r) => {
      const n = el('div', { class: 'sp-start' + (SP.open === r.id ? ' sel' : ''), role: 'button', 'aria-label': r.name[lang()] || r.name.es }, [el('span', { text: SP.mode === 'bike' ? '🚴' : '🏃' })]);
      n.addEventListener('click', (e) => { e.stopPropagation(); openCard(r.id); });
      markers.push(new maplibregl.Marker({ element: n }).setLngLat([r.line[0][0], r.line[0][1]]).addTo(map));
    });
    // acqua e officine (solo i punti utili)
    (SP.water || []).filter((w) => w.kind === 'water').forEach((w) => markers.push(new maplibregl.Marker({ element: el('div', { class: 'sp-poi water', title: w.name || 'Agua', text: '💧' }) }).setLngLat([w.lng, w.lat]).addTo(map)));
    if (window.MAXORA_FOLLOW) {
      const seen = new Set();
      SP.routes.filter((r) => r.sport === SP.mode).forEach((r) => window.MAXORA_FOLLOW.notesFor(r).forEach((n) => {
        if (seen.has(n.id)) return; seen.add(n.id);
        markers.push(new maplibregl.Marker({ element: el('div', { class: 'sp-poi note', title: window.MAXORA_FOLLOW.noteText(n), text: window.MAXORA_FOLLOW.KIND_ICON[n.kind] || '⚠️' }) }).setLngLat([n.lng, n.lat]).addTo(map));
      }));
    }
    if (SP.mode === 'bike') (SP.bikeShops || []).forEach((b) => markers.push(new maplibregl.Marker({ element: el('div', { class: 'sp-poi bike', title: b.name, text: '🔧' }) }).setLngLat([b.lng, b.lat]).addTo(map)));
  }
  map.on('style.load', () => { if (SP.mode) { ensureLayers(); drawMap(); } });
  map.on('click', 'sp-line', (e) => { const f = e.features && e.features[0]; if (f) openCard(f.properties.id); });

  // ------------------------------------------------------------------
  // Pannello
  // ------------------------------------------------------------------
  function drawHead() {
    $('spTitle').textContent = tr(SP.mode);
    if (!SP.wx) { $('spSub').textContent = tr('loading'); return; }
    const p = centerPoint();
    const best = [];
    SP.times.forEach((t, k) => { if (t >= Date.now() - 90 * 60000 && t < Date.now() + 24 * 3600000) best.push({ t, s: score(SP.mode, wxAt(p, k), t, 'road') }); });
    best.sort((a, b) => b.s - a.s || a.t - b.t);
    $('spSub').textContent = best.length ? tr('bestTime', { h: dayLabel(best[0].t).toLowerCase() + ' ' + hh(best[0].t) + '–' + hh(best[0].t + 3 * 3600000) }) : '';
    const ago = Math.max(1, Math.round((Date.now() - Date.parse(SP.wx.generated.replace('Z', ':00Z'))) / 60000));
    $('spNote').textContent = tr('src') + 'ECMWF ' + tr('updated', { t: tr('ago', { t: ago < 60 ? ago + ' min' : Math.round(ago / 60) + ' h' }) }) + '. ' + tr('future');
  }
  function drawNow() {
    const box = $('spNow'); box.innerHTML = '';
    const w = wxAt(centerPoint(), SP.idx);
    if (!w) return;
    const t = SP.times[SP.idx];
    const st = sunTimes(t);
    const s = score(SP.mode, w, t, 'road');
    box.append(
      el('div', { class: 'sp-big', style: '--c:' + color(s) }, [el('b', { text: fmtR(s) }), stars(s)]),
      el('div', { class: 'sp-cell' }, [el('div', { class: 'k', text: tr('temp') }), el('div', { class: 'v', text: Math.round(w.t) + '°' })]),
      el('div', { class: 'sp-cell' }, [el('div', { class: 'k', text: tr('wind') }), el('div', { class: 'v' }, [el('span', { class: 'sp-arrow', style: 'transform:rotate(' + ((w.wd + 180) % 360) + 'deg)', text: '↑' }), ' ' + w.ws]), el('div', { class: 's', text: compass(w.wd) + (w.g ? ' · ' + tr('gust') + ' ' + w.g : '') })]),
      el('div', { class: 'sp-cell' }, [el('div', { class: 'k', text: tr('light') }), el('div', { class: 's', text: st.rise ? tr('sunrise', { h: hhmm(st.rise) }) : '' }), el('div', { class: 's', text: st.set ? tr('sunset', { h: hhmm(st.set) }) : '' })])
    );
  }
  function drawTimes() {
    const box = $('spTimes'); box.innerHTML = '';
    const p = centerPoint();
    let lastDay = '';
    SP.times.forEach((t, i) => {
      if (t < Date.now() - 90 * 60000 || t > Date.now() + 72 * 3600000) return;
      const dk = dayKey(t);
      if (dk !== lastDay) { box.appendChild(el('span', { class: 'sf-day', text: dayLabel(t) })); lastDay = dk; }
      const s = score(SP.mode, wxAt(p, i), t, 'road');
      const day = sunAlt(t + 5400000, 28.4, -14) > -2;
      box.appendChild(el('button', { class: 'sf-slot' + (i === SP.idx ? ' on' : '') + (day ? '' : ' night'), onclick: () => { SP.idx = i; SP.picked = true; drawAll(); } }, [
        el('span', { class: 'h', text: hh(t) }),
        el('span', { class: 'bar', style: 'background:' + color(s) + ';height:' + (6 + (s || 0) * 4) + 'px' })
      ]));
    });
    const on = box.querySelector('.sf-slot.on');
    if (on) on.scrollIntoView({ block: 'nearest', inline: 'center' });
  }
  // riquadro CONSIGLIO: giudizio, motivi, ora migliore e percorso più adatto
  function advBox(box, s, title, lines, acts) {
    box.innerHTML = '';
    const lvl = s == null ? 'bad' : s >= 4 ? 'good' : s >= 3 ? 'ok' : s >= 2 ? 'warn' : 'bad';
    box.className = 'adv ' + lvl + (store.get('advOpen', false) ? '' : ' closed');
    box.append(
      el('button', { class: 'adv-top', 'aria-expanded': String(store.get('advOpen', false)) }, [
        el('div', { class: 'adv-h' }, [el('span', { class: 'adv-i', text: '💡' }), el('span', { text: tr('advLabel') + ' · ' + title })]),
        el('div', { class: 'adv-v', text: tr(s >= 4 ? 'v4' : s >= 3 ? 'v3' : s >= 2 ? 'v2' : 'v1') })
      ]),
      el('ul', {}, lines.map(([ic, tx]) => el('li', {}, [el('span', { class: 'ic', text: ic }), el('span', { text: tx })])))
    );
    acts.filter(Boolean).forEach((x) => box.appendChild(el('button', { class: 'adv-a', onclick: x.go }, [el('span', { class: 'ic', text: x.ic }), el('span', { text: x.tx }), el('b', { text: '›' })])));
  }
  function drawAdvice() {
    const box = $('spAdvice');
    const p = centerPoint(), w = wxAt(p, SP.idx);
    if (!w) { box.innerHTML = ''; box.className = 'adv'; return; }
    const t = SP.times[SP.idx];
    const s = score(SP.mode, w, t, 'road');
    const L = [];
    if (sunAlt(t + 5400000, 28.4, -14) <= -2) L.push(['🔦', tr('aNight')]);
    if (w.p > 0.3) L.push(['🌧', tr('aRain')]);
    if (w.ws >= (SP.mode === 'bike' ? 20 : 25)) L.push(['💨', tr('aWind', { v: w.ws, d: compass(w.wd) })]);
    if (w.g && w.g > 45) L.push(['⚠️', tr('aGust', { g: w.g })]);
    if (w.t >= (SP.mode === 'run' ? 22 : 27)) L.push(['🌡', tr('aHot', { t: Math.round(w.t) })]);
    else if (w.t < (SP.mode === 'run' ? 10 : 14)) L.push(['🧥', tr('aCold', { t: Math.round(w.t) })]);
    if (!L.length) L.push(['✓', tr('aGood')]);
    // finestra migliore nelle prossime 48 ore, se è davvero meglio
    let best = null;
    SP.times.forEach((tt, k) => {
      if (tt < Date.now() - 90 * 60000 || tt > Date.now() + 48 * 3600000) return;
      const x = score(SP.mode, wxAt(p, k), tt, 'road');
      if (x != null && (!best || x > best.s)) best = { k, t: tt, s: x };
    });
    const better = best && best.k !== SP.idx && best.s >= (s || 0) + 1 ? { ic: '⏱', tx: tr('aBetter', { h: dayLabel(best.t).toLowerCase() + ' ' + hh(best.t) + '–' + hh(best.t + 3 * 3600000) + ' · ★ ' + fmtR(best.s) }), go: () => { SP.idx = best.k; SP.picked = true; drawAll(); } } : null;
    // percorso più adatto adesso: voto più alto, poi meno vento contro al ritorno
    let route = null;
    SP.routes.filter((r) => r.sport === SP.mode).forEach((r) => {
      const ww = wxAt(r._wx, SP.idx), rs = score(r.sport, ww, t, r.surface);
      if (rs == null) return;
      const wr = windOnRoute(r, ww), pen = wr.calm ? 0 : Math.max(0, wr.head1) - Math.max(0, wr.head0) + (wr.cross || 0) * 20;
      const v = rs * 100 - pen - hazardsOn(r).length * 50;
      if (!route || v > route.v) route = { r, v, s: rs };
    });
    const rt = route && route.s >= 2 ? { ic: '🧭', tx: tr('aRoute', { n: route.r.name[lang()] || route.r.name.es }) + ' · ★ ' + fmtR(route.s), go: () => openCard(route.r.id, true) } : null;
    const when = Math.abs(t - Date.now()) < 90 * 60000 ? tr('now') : dayLabel(t) + ' ' + hh(t) + '–' + hh(t + 3 * 3600000);
    // giudizio = percorso migliore (coerente con la lista), altrimenti meteo generale
    advBox(box, route ? route.s : s, when, L, [better, rt]);
  }
  function routeRow(r) {
    const s = score(r.sport, wxAt(r._wx, SP.idx), SP.times[SP.idx], r.surface);
    const hz = hazardsOn(r).length;
    return el('button', { class: 'sf-row', onclick: () => openCard(r.id, true) }, [
      el('span', { class: 'sf-badge', style: '--c:' + color(s) }, [el('i', { text: '★' }), fmtR(s)]),
      el('span', { class: 'sf-txt' }, [
        el('span', { class: 't', text: r.name[lang()] || r.name.es }),
        el('span', { class: 's', text: num(r.km, 1) + ' km · +' + r.gain + ' m · ' + tr('surface_' + r.surface) + ' · ' + tr('lvl' + r.level) + (r.official && r.ref ? ' · ' + r.ref : '') + (hz ? ' · ⚠ ' + hz : '') })
      ])
    ]);
  }
  function drawList() {
    const box = $('spList'); box.innerHTML = '';
    let list = SP.routes.filter((r) => r.sport === SP.mode);
    const me = M.pos();
    if (me) list = list.sort((a, b) => M.distKm(me, { lat: a.start[0], lng: a.start[1] }) - M.distKm(me, { lat: b.start[0], lng: b.start[1] }));
    list.forEach((r) => box.appendChild(routeRow(r)));
  }
  function drawActions() {
    const box = $('spActions'); box.innerHTML = '';
    if (SP.mode !== 'bike') return;
    box.appendChild(el('button', { class: 'sp-report', onclick: () => M.report('ciclistas') }, [el('b', { text: '🚴 ' + tr('reportBikes') }), el('span', { text: tr('reportBikesSub') })]));
  }
  function drawAll() {
    if (!SP.mode) return;
    drawHead();
    if (!SP.wx) return;
    drawNow(); drawTimes(); drawAdvice(); drawList(); drawActions(); drawMap();
    if (SP.open) drawCard();
    pad();
  }

  // ------------------------------------------------------------------
  // Scheda percorso
  // ------------------------------------------------------------------
  function profileSvg(r) {
    const P = r.profile, W = 320, H = 96, pad = 4;
    const maxD = P[P.length - 1][0] || 1, lo = Math.min(...P.map((p) => p[1])), hi = Math.max(...P.map((p) => p[1]), lo + 20);
    const x = (d) => pad + (d / maxD) * (W - 2 * pad), y = (e) => H - pad - ((e - lo) / (hi - lo)) * (H - 2 * pad - 14);
    const pts = P.map((p) => x(p[0]).toFixed(1) + ',' + y(p[1]).toFixed(1)).join(' ');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H); svg.setAttribute('class', 'sp-prof'); svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', tr('profile') + ' ' + lo + '–' + hi + ' m');
    svg.innerHTML = '<polygon points="' + pad + ',' + (H - pad) + ' ' + pts + ' ' + (W - pad) + ',' + (H - pad) + '" class="fill"/><polyline points="' + pts + '" class="ln"/>' +
      '<text x="' + pad + '" y="11" class="lb">' + hi + ' m</text><text x="' + (W - pad) + '" y="11" class="lb" text-anchor="end">' + num(maxD, 1) + ' km</text>' +
      '<text x="' + pad + '" y="' + (H - 8) + '" class="lb lo">' + lo + ' m</text>';
    return svg;
  }
  function gpx(r) {
    const name = (r.name[lang()] || r.name.es).replace(/[<&>]/g, '');
    let pts = r.line.map((p) => '<trkpt lat="' + p[1] + '" lon="' + p[0] + '"></trkpt>');
    if (r.back) pts = pts.concat(pts.slice(0, -1).reverse());
    const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<gpx version="1.1" creator="Maxora" xmlns="http://www.topografix.com/GPX/1/1"><metadata><name>' + name + '</name><copyright author="OpenStreetMap contributors"><license>https://opendatacommons.org/licenses/odbl/</license></copyright></metadata><trk><name>' + name + '</name><trkseg>' + pts.join('') + '</trkseg></trk></gpx>';
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([xml], { type: 'application/gpx+xml' }));
    a.download = 'maxora-' + r.id + '.gpx';
    document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  }
  function openCard(id, fly) {
    SP.open = id;
    const r = SP.routes.find((x) => x.id === id);
    if (!r) return;
    drawCard();
    $('spCard').classList.remove('hidden');
    $('spCard').scrollTop = 0;
    if (window.MAXORA_TOUR) window.MAXORA_TOUR.cardTips('sport');
    drawMap();
    const b = new maplibregl.LngLatBounds(r.line[0], r.line[0]);
    r.line.forEach((p) => b.extend(p));
    const ph = Math.min(window.innerHeight * 0.62, $('spCard').getBoundingClientRect().height || 380);
    // margini espliciti: la scheda copre la parte bassa dello schermo
    map.setPadding({ top: 0, bottom: 0, left: 0, right: 0 });
    map.fitBounds(b, { padding: { top: 84, bottom: Math.round(ph) + 16, left: 28, right: 72 }, maxZoom: 15, duration: fly === false ? 0 : 800 });
  }
  function closeCard() { SP.open = null; $('spCard').classList.add('hidden'); drawMap(); pad(); }
  function followRoute(r) {
    let k = 0;
    SP.times.forEach((t, i) => { if (Math.abs(t - Date.now()) < Math.abs(SP.times[k] - Date.now())) k = i; });
    closeCard();
    window.MAXORA_FOLLOW.start(r, { wind: wxAt(r._wx, k), water: (SP.water || []).filter((w) => w.kind === 'water') });
  }
  function drawCard() {
    const r = SP.routes.find((x) => x.id === SP.open);
    if (!r) return;
    const box = $('spCardBody'); box.innerHTML = '';
    const w = wxAt(r._wx, SP.idx);
    const t = SP.times[SP.idx];
    const s = score(r.sport, w, t, r.surface);
    box.append(
      el('div', { class: 'p-kicker', text: tr(r.sport) + ' · ' + tr('surface_' + r.surface) + ' · ' + tr(r.back ? 'back' : r.loop ? 'loop' : 'oneway') + (r.official ? ' · ' + tr('official') + (r.ref ? ' ' + r.ref : '') : '') + ' · ' + tr('lvl' + r.level) }),
      el('div', { class: 'p-name', text: r.name[lang()] || r.name.es })
    );
    const st = el('div', { class: 'p-stats sf-stats' });
    st.append(
      el('div', { class: 'p-stat' }, [el('div', { class: 'k', text: tr('km') }), el('div', { class: 'v', text: num(r.km, 1) })]),
      el('div', { class: 'p-stat' }, [el('div', { class: 'k', text: tr('up') }), el('div', { class: 'v', text: '+' + r.gain + ' m' })]),
      el('div', { class: 'p-stat' }, [el('div', { class: 'k', text: tr('stars') }), el('div', { class: 'v', style: 'color:' + color(s) }, ['★ ' + fmtR(s)]), el('div', { class: 'sf-sub', text: dayLabel(t) + ' ' + hh(t) + ':00' })])
    );
    box.appendChild(st);
    // altimetria
    box.appendChild(el('div', { class: 'sf-h', text: tr('profile') + ' · ' + tr('maxGrade', { g: num(r.max_grade, 0) }) }));
    box.appendChild(profileSvg(r));
    if (r.climb) box.appendChild(el('div', { class: 'p-note', text: tr('climb', { km: num(r.climb.km, 1), avg: num(r.climb.avg, 1), gain: r.climb.gain, from: num(r.climb.from_km, 1) }) }));
    // vento sul percorso
    box.appendChild(el('div', { class: 'sf-h', text: tr('windRoute') + (w ? ' · ' + w.ws + ' km/h ' + compass(w.wd) : '') }));
    const wr = windOnRoute(r, w);
    let msg;
    if (wr.calm) msg = tr('windCalm');
    else if (r.back) msg = wr.head0 > 0 ? tr('headFirst', { d: compass(w.wd) }) : tr('tailFirst', { d: compass(w.wd) });
    else msg = wr.head0 >= wr.head1 ? tr('loopOk') : tr('reverse');
    box.appendChild(el('p', { class: 'p-desc sp-wind', text: msg + (!wr.calm && wr.cross > 0.15 && r.sport === 'bike' ? ' ' + tr('crossStrong') : '') }));
    // ore migliori
    const bs = bestSlots(r, 4);
    if (bs.length) {
      box.appendChild(el('div', { class: 'sf-h', text: tr('bestFor') }));
      box.appendChild(el('div', { class: 'sf-tides' }, bs.map((b) => el('button', { class: 'sf-tide-x', onclick: () => { SP.idx = b.k; SP.picked = true; drawAll(); } }, [el('b', { style: 'color:' + color(b.s), text: '★ ' + fmtR(b.s) }), ' ' + dayLabel(b.t) + ' ' + hh(b.t) + ':00']))));
    }
    // avvisi e acqua sul percorso
    const hz = hazardsOn(r);
    box.appendChild(el('div', { class: 'sf-h', text: hz.length === 1 ? tr('alertsOn1') : hz.length ? tr('alertsOn', { n: hz.length }) : tr('noAlerts') }));
    if (hz.length) box.appendChild(el('div', { class: 'p-alerts' }, hz.slice(0, 5).map((rep) => el('div', { class: 'p-alert' }, [el('span', { class: 'm', style: 'background:' + M.typeColor(rep) }), el('span', { class: 't', text: rep.title || M.typeLabel(rep) })]))));
    const FW = window.MAXORA_FOLLOW;
    const notes = FW ? FW.notesFor(r) : [];
    if (notes.length) box.appendChild(el('div', { class: 'p-alerts' }, notes.map((n) => el('div', { class: 'p-alert' }, [el('span', { text: FW.KIND_ICON[n.kind] || '⚠️' }), el('span', { class: 't', text: FW.noteText(n) })]))));
    const wn = (r._water || []).length;
    box.appendChild(el('p', { class: 'p-note', text: '💧 ' + (wn === 1 ? tr('water1') : wn ? tr('water', { n: wn }) : tr('noWater')) }));
    box.appendChild(el('p', { class: 'p-desc', text: r.note[lang()] || r.note.es }));
    // azioni
    const ll = r.start[0] + ',' + r.start[1];
    const apps = el('div', { class: 'p-apps' }, [
      el('a', { href: 'https://www.google.com/maps/dir/?api=1&destination=' + ll, target: '_blank', rel: 'noopener', text: 'Google' }),
      el('a', { href: 'https://waze.com/ul?ll=' + ll + '&navigate=yes', target: '_blank', rel: 'noopener', text: 'Waze' }),
      el('a', { href: 'https://maps.apple.com/?daddr=' + ll, target: '_blank', rel: 'noopener', text: 'Apple' })
    ]);
    const appsBox = el('div', { class: 'hidden' }, [el('div', { class: 'p-note', text: tr('openWith') }), apps]);
    box.append(
      el('div', { class: 'p-actions' }, [
        window.MAXORA_FOLLOW ? el('button', { class: 'p-go fw-go', onclick: () => followRoute(r) }, ['▶ ' + window.MAXORA_FOLLOW.label()]) : null,
        el('button', { class: window.MAXORA_FOLLOW ? 'p-sec' : 'p-go', onclick: () => appsBox.classList.toggle('hidden') }, [tr('go')]),
        el('button', { class: 'p-sec', onclick: () => gpx(r), text: '⬇ ' + tr('gpx') })
      ]),
      appsBox,
      el('div', { class: 'p-note sf-src', text: SP.src || '' })
    );
  }

  // ------------------------------------------------------------------
  // Entrare / uscire
  // ------------------------------------------------------------------
  function pad() {
    if (!SP.mode || SP.open) return;
    const h = $('spSheet').getBoundingClientRect().height;
    map.setPadding({ top: 70, bottom: Math.max(0, Math.min(h, window.innerHeight * 0.6) - 10), left: 0, right: 0 });
  }
  async function setSport(mode, quiet) {
    SP.mode = mode;
    store.set('sportMode', mode);
    document.body.classList.toggle('sport-on', !!mode);
    $('spSheet').classList.toggle('hidden', !mode);
    if (!mode) { closeCard(); drawMap(); M.padMap(); return; }
    SP.open = null; $('spCard').classList.add('hidden');
    M.closePlace(); M.exitResults(); if (!quiet) M.unfollow();
    drawHead(); pad();
    try {
      await load();
      drawAll();
      if (!quiet) map.fitBounds([[-14.52, 28.04], [-13.80, 28.78]], { padding: { top: 16, bottom: 16, left: 24, right: 64 }, duration: 800 });
    } catch (e) {
      console.warn('sport', e);
      $('spSub').textContent = tr('noData');
    }
  }

  // ------------------------------------------------------------------
  // Menu modalità
  // ------------------------------------------------------------------
  const ICON = {
    road: '<path d="M4 20L9 4M20 20L15 4M12 6v2M12 11v2M12 16v2"/>',
    surf: '<path d="M2 16c2 0 2.5-1.5 5-1.5S9.5 16 12 16s2.5-1.5 5-1.5 3 1.5 5 1.5"/><path d="M2 20c2 0 2.5-1.5 5-1.5S9.5 20 12 20s2.5-1.5 5-1.5 3 1.5 5 1.5"/><path d="M5.5 12.5C6 8 9 5 13 5c2.5 0 4.2 1.3 4.2 3.2 0 1.6-1.2 2.6-2.7 2.6-1.3 0-2.2-.8-2.2-1.9"/>',
    bike: '<circle cx="5.5" cy="16.5" r="3.5"/><circle cx="18.5" cy="16.5" r="3.5"/><path d="M5.5 16.5L9 9h6l3.5 7.5M9 9l3.5 7.5L15 9M13 5.5h2.5"/>',
    run: '<circle cx="15" cy="4.5" r="2"/><path d="M8 21l3-6 3 2v4M6 12l3-4 4 1 2 4 3 1M11 15l-2-3"/>',
    camper: '<path d="M2 17V8a2 2 0 0 1 2-2h11l5 5v6"/><path d="M2 17h20"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/><path d="M6 9h4v3H6zM13 9h2"/>',
    modes: '<rect x="4" y="4" width="6.5" height="6.5" rx="2"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="2"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="2"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="2"/>'
  };
  const DESC = { road: 'dRoad', surf: 'dSurf', bike: 'dBike', run: 'dRun', camper: 'dCamper' };
  const svg = (k) => '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICON[k] + '</svg>';
  const surfOn = () => window.MAXORA_SURF && window.MAXORA_SURF.isOn();
  const camperOn = () => window.MAXORA_CAMPER && window.MAXORA_CAMPER.isOn();
  const current = () => (surfOn() ? 'surf' : camperOn() ? 'camper' : SP.mode || 'road');
  const menu = el('div', { class: 'mode-menu hidden', id: 'modeMenu', role: 'menu' });
  document.body.appendChild(menu);
  function drawMenu() {
    menu.innerHTML = '';
    ['road', 'surf', 'bike', 'run', 'camper'].forEach((k) => {
      const b = el('button', { class: 'mode-item m-' + k + (current() === k ? ' on' : ''), role: 'menuitemradio', 'aria-checked': String(current() === k), onclick: () => choose(k) }, []);
      const ic = el('span', { class: 'mi-ico' }); ic.innerHTML = svg(k);
      b.append(ic, el('span', { class: 'mi-txt' }, [el('b', { text: tr(k) }), el('small', { text: tr(DESC[k]) })]));
      menu.appendChild(b);
    });
  }
  async function choose(k) {
    menu.classList.add('hidden');
    if (k === current()) return;
    if (surfOn() && k !== 'surf') await window.MAXORA_SURF.setOn(false, true);
    if (SP.mode && k !== SP.mode) await setSport(null, true);
    if (camperOn() && k !== 'camper') await window.MAXORA_CAMPER.setOn(false);
    splash(k);
    if (k === 'camper') { window.MAXORA_CAMPER.setOn(true); }
    else if (k === 'surf') await window.MAXORA_SURF.setOn(true, false, true);
    else if (k === 'bike' || k === 'run') await setSport(k);
    sync();
    if (window.MAXORA_TOUR) window.MAXORA_TOUR.modeTips(k);
  }
  // annuncio grande al cambio di modalità: niente dubbi su dove sei
  let splashT;
  function splash(k) {
    let n = $('modeSplash');
    if (!n) { n = el('div', { id: 'modeSplash', class: 'mode-splash', 'aria-live': 'polite' }); document.body.appendChild(n); }
    n.className = 'mode-splash m-' + k;
    n.innerHTML = '';
    const ic = el('span', { class: 'ms-ico' }); ic.innerHTML = svg(k);
    n.append(ic, el('b', { text: tr('modeNow', { m: tr(k) }) }), el('small', { text: tr(DESC[k]) }));
    n.classList.add('show');
    clearTimeout(splashT); splashT = setTimeout(() => n.classList.remove('show'), 1400);
  }
  // etichetta fissa in alto con la modalità attiva e la ✕ per tornare alla strada
  const chip = el('div', { class: 'mode-chip hidden', id: 'modeChip' });
  document.body.appendChild(chip);
  function drawChip(k) {
    chip.className = 'mode-chip m-' + k + (k === 'road' ? ' hidden' : '');
    chip.innerHTML = '';
    const ic = el('span', { class: 'mc-ico' }); ic.innerHTML = svg(k);
    chip.append(
      el('button', { class: 'mc-main', onclick: (e) => { e.stopPropagation(); drawMenu(); menu.classList.remove('hidden'); } }, [ic, el('b', { text: tr(k) })]),
      el('button', { class: 'mc-help', 'aria-label': '?', title: '?', onclick: (e) => { e.stopPropagation(); if (window.MAXORA_TOUR) window.MAXORA_TOUR.legend(k); } }, ['?']),
      el('button', { class: 'mc-x', 'aria-label': tr('exitMode'), title: tr('exitMode'), onclick: (e) => { e.stopPropagation(); choose('road'); } }, ['✕'])
    );
  }
  function sync() {
    const k = current();
    document.body.dataset.mode = k;
    drawChip(k);
    const btn = $('surfBtn');
    btn.innerHTML = svg(k === 'road' ? 'modes' : k);
    btn.classList.toggle('on', k !== 'road');
    btn.setAttribute('aria-pressed', String(k !== 'road'));
    btn.setAttribute('aria-label', tr('modes'));
    btn.setAttribute('aria-haspopup', 'menu');
    drawMenu();
  }
  $('surfBtn').addEventListener('click', (e) => { e.stopPropagation(); drawMenu(); menu.classList.toggle('hidden'); });
  document.addEventListener('click', (e) => { if (!menu.contains(e.target)) menu.classList.add('hidden'); });
  window.MAXORA_MODES = { sync, choose };

  // ------------------------------------------------------------------
  // Eventi
  // ------------------------------------------------------------------
  $('spClose').addEventListener('click', closeCard);
  $('spToggle').addEventListener('click', () => {
    SP.collapsed = !SP.collapsed; store.set('spCollapsed', SP.collapsed);
    $('spSheet').classList.toggle('collapsed', SP.collapsed);
    $('spToggle').setAttribute('aria-expanded', String(!SP.collapsed));
    setTimeout(pad, 320);
  });
  map.on('click', (e) => { if (SP.open && !(map.getLayer('sp-line') && map.queryRenderedFeatures(e.point, { layers: ['sp-line'] }).length)) closeCard(); });
  window.addEventListener('resize', pad);
  M.onTexts(() => { sync(); drawAll(); });
  setInterval(() => { if (SP.mode) load(true).then(drawAll).catch(() => {}); }, 15 * 60000);
  setInterval(() => { if (SP.mode) { drawList(); if (SP.open) drawCard(); } }, 60000);   // avvisi aggiornati

  $('spSheet').classList.toggle('collapsed', SP.collapsed);
  const saved = store.get('sportMode', null);
  if (saved && !surfOn()) setSport(saved, true).then(sync);
  else if (!surfOn() && store.get('camperOn', false) && window.MAXORA_CAMPER) window.MAXORA_CAMPER.setOn(true).then(sync);
  else sync();
  // consiglio: chiuso = una riga; si apre toccandolo (vale per surf, bici e corsa)
  document.addEventListener('click', (e) => {
    const top = e.target.closest && e.target.closest('.adv-top');
    if (!top) return;
    const open = !store.get('advOpen', false);
    store.set('advOpen', open);
    document.querySelectorAll('.adv').forEach((b) => b.classList.toggle('closed', !open));
    document.querySelectorAll('.adv-top').forEach((b) => b.setAttribute('aria-expanded', String(open)));
  });
  window.MAXORA_SPORT = { state: SP, score, setSport, redraw: () => { if (SP.mode) { drawMap(); if (SP.open) drawCard(); } } };
})();
