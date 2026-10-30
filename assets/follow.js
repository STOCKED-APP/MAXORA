/* Maxora — "Segui percorso" per bici e corsa: posizione sulla linea, km, velocità/passo, arrivo stimato,
   fuori percorso, avvisi vocali (note del team, segnalazioni, salita, vento contro, ultima acqua), riepilogo e GPX.
   Funziona con lo schermo acceso (il browser non dà il GPS a schermo spento). */
(function () {
  'use strict';
  const M = window.MAXORA;
  if (!M) return;
  const { map, sb, el, store, toast } = M;

  const TX = {
    it: { follow: 'Segui percorso', done: 'fatti', left: 'mancano', speed: 'km/h', pace: 'min/km', time: 'tempo', eta: 'arrivo', stop: 'Termina', voiceOn: 'Voce attiva', voiceOff: 'Voce spenta',
      toStart: 'Vai alla partenza: {d}', onRoute: 'Sul percorso', off: 'Fuori percorso di {d}: torna sulla linea', offV: 'Sei fuori percorso. Torna sulla linea.', backV: 'Di nuovo sul percorso.',
      startV: 'Percorso avviato: {n}. {km} chilometri.', windV: 'Vento {v} chilometri orari da {d}.', inD: 'tra {d}', noteV: 'Tra {d}: {t}', hazV: 'Tra {d}: {t} segnalato sul percorso.',
      climbV: 'Tra {d} inizia la salita principale: {km} chilometri al {avg} per cento.', headV: 'Tra {d} tratto controvento per {km} chilometri.', head: 'Tratto controvento per {km} km',
      waterV: 'Ultima acqua per {km} chilometri.', water: 'Ultima acqua per {km} km', turnV: 'Punto di ritorno. Ora si torna indietro.', turn: 'Punto di ritorno', finishV: 'Arrivo. Bravo!',
      climb: 'Salita principale · {km} km al {avg}%', sumT: 'Uscita terminata', dist: 'distanza', moving: 'in movimento', avg: 'media', gpx: 'Invia a Strava, Garmin…', close: 'Fatto',
      gpsWait: 'Cerco il GPS…', gpsNo: 'GPS non disponibile: attiva la posizione', keep: 'Tieni lo schermo acceso: il GPS del browser si ferma a schermo spento.', confirmStop: 'Terminare l\'uscita?' },
    es: { follow: 'Seguir ruta', done: 'hechos', left: 'faltan', speed: 'km/h', pace: 'min/km', time: 'tiempo', eta: 'llegada', stop: 'Terminar', voiceOn: 'Voz activada', voiceOff: 'Voz desactivada',
      toStart: 'Ve a la salida: {d}', onRoute: 'En el recorrido', off: 'Fuera del recorrido {d}: vuelve a la línea', offV: 'Estás fuera del recorrido. Vuelve a la línea.', backV: 'De nuevo en el recorrido.',
      startV: 'Recorrido iniciado: {n}. {km} kilómetros.', windV: 'Viento de {v} kilómetros por hora del {d}.', inD: 'en {d}', noteV: 'En {d}: {t}', hazV: 'En {d}: {t} avisado en el recorrido.',
      climbV: 'En {d} empieza la subida principal: {km} kilómetros al {avg} por ciento.', headV: 'En {d} tramo con viento en contra durante {km} kilómetros.', head: 'Viento en contra durante {km} km',
      waterV: 'Último punto de agua en {km} kilómetros.', water: 'Último agua en {km} km', turnV: 'Punto de vuelta. Ahora se regresa.', turn: 'Punto de vuelta', finishV: 'Llegada. ¡Bien hecho!',
      climb: 'Subida principal · {km} km al {avg}%', sumT: 'Salida terminada', dist: 'distancia', moving: 'en movimiento', avg: 'media', gpx: 'Enviar a Strava, Garmin…', close: 'Listo',
      gpsWait: 'Buscando GPS…', gpsNo: 'GPS no disponible: activa la ubicación', keep: 'Mantén la pantalla encendida: el GPS del navegador se para con la pantalla apagada.', confirmStop: '¿Terminar la salida?' },
    en: { follow: 'Follow route', done: 'done', left: 'to go', speed: 'km/h', pace: 'min/km', time: 'time', eta: 'arrival', stop: 'Finish', voiceOn: 'Voice on', voiceOff: 'Voice off',
      toStart: 'Go to the start: {d}', onRoute: 'On route', off: 'Off route by {d}: get back on the line', offV: 'You are off route. Get back on the line.', backV: 'Back on route.',
      startV: 'Route started: {n}. {km} kilometres.', windV: 'Wind {v} kilometres per hour from {d}.', inD: 'in {d}', noteV: 'In {d}: {t}', hazV: 'In {d}: {t} reported on the route.',
      climbV: 'In {d} the main climb starts: {km} kilometres at {avg} percent.', headV: 'In {d} headwind section for {km} kilometres.', head: 'Headwind for {km} km',
      waterV: 'Last water for {km} kilometres.', water: 'Last water for {km} km', turnV: 'Turnaround point. Head back now.', turn: 'Turnaround point', finishV: 'Finish. Well done!',
      climb: 'Main climb · {km} km at {avg}%', sumT: 'Activity finished', dist: 'distance', moving: 'moving', avg: 'average', gpx: 'Send to Strava, Garmin…', close: 'Done',
      gpsWait: 'Looking for GPS…', gpsNo: 'GPS not available: turn on location', keep: 'Keep the screen on: browser GPS stops when the screen is off.', confirmStop: 'Finish the activity?' },
    de: { follow: 'Strecke folgen', done: 'gefahren', left: 'übrig', speed: 'km/h', pace: 'min/km', time: 'Zeit', eta: 'Ankunft', stop: 'Beenden', voiceOn: 'Stimme an', voiceOff: 'Stimme aus',
      toStart: 'Zum Start: {d}', onRoute: 'Auf der Strecke', off: '{d} neben der Strecke: zurück zur Linie', offV: 'Du bist von der Strecke abgekommen. Zurück zur Linie.', backV: 'Wieder auf der Strecke.',
      startV: 'Strecke gestartet: {n}. {km} Kilometer.', windV: 'Wind {v} Kilometer pro Stunde aus {d}.', inD: 'in {d}', noteV: 'In {d}: {t}', hazV: 'In {d}: {t} auf der Strecke gemeldet.',
      climbV: 'In {d} beginnt der Hauptanstieg: {km} Kilometer mit {avg} Prozent.', headV: 'In {d} Gegenwind auf {km} Kilometern.', head: 'Gegenwind auf {km} km',
      waterV: 'Letztes Wasser für {km} Kilometer.', water: 'Letztes Wasser für {km} km', turnV: 'Wendepunkt. Jetzt zurück.', turn: 'Wendepunkt', finishV: 'Ziel. Gut gemacht!',
      climb: 'Hauptanstieg · {km} km mit {avg}%', sumT: 'Aktivität beendet', dist: 'Distanz', moving: 'in Bewegung', avg: 'Schnitt', gpx: 'An Strava, Garmin… senden', close: 'Fertig',
      gpsWait: 'Suche GPS…', gpsNo: 'GPS nicht verfügbar: Standort aktivieren', keep: 'Bildschirm anlassen: das Browser-GPS stoppt bei ausgeschaltetem Bildschirm.', confirmStop: 'Aktivität beenden?' }
  };
  const LOC = { it: 'it-IT', es: 'es-ES', en: 'en-GB', de: 'de-DE' };
  const COMPASS = { es: ['norte', 'noreste', 'este', 'sureste', 'sur', 'suroeste', 'oeste', 'noroeste'], it: ['nord', 'nord-est', 'est', 'sud-est', 'sud', 'sud-ovest', 'ovest', 'nord-ovest'],
    en: ['north', 'north-east', 'east', 'south-east', 'south', 'south-west', 'west', 'north-west'], de: ['Nord', 'Nordost', 'Ost', 'Südost', 'Süd', 'Südwest', 'West', 'Nordwest'] };
  const KIND_ICON = { info: 'ℹ️', warn: '⚠️', danger: '⛔', closed: '🚧', water: '💧' };
  const lang = () => (TX[M.lang()] ? M.lang() : 'es');
  const tr = (k, v) => { let s = TX[lang()][k] || TX.es[k] || k; if (v) Object.keys(v).forEach((x) => { s = s.replace('{' + x + '}', v[x]); }); return s; };
  const NF = new Map();
  const num = (v, d) => { const k = lang() + d; let f = NF.get(k); if (!f) { f = new Intl.NumberFormat(LOC[lang()], { maximumFractionDigits: d, minimumFractionDigits: d }); NF.set(k, f); } return f.format(v); };
  const fmtD = (m) => (m < 1000 ? Math.round(m / 10) * 10 + ' m' : num(m / 1000, m < 10000 ? 1 : 0) + ' km');
  const MW = { it: 'metri', es: 'metros', en: 'metres', de: 'Meter' }, KMW = { it: 'chilometri', es: 'kilómetros', en: 'kilometres', de: 'Kilometer' };
  const fmtDv = (m) => (m < 1000 ? (Math.round(m / 50) * 50 || 50) + ' ' + MW[lang()] : num(m / 1000, 1) + ' ' + KMW[lang()]);
  const hms = (s) => { s = Math.max(0, Math.round(s)); const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), x = s % 60; return (h ? h + ':' + String(m).padStart(2, '0') : m) + ':' + String(x).padStart(2, '0'); };
  const clock = (ms) => new Intl.DateTimeFormat(LOC[lang()], { timeZone: 'Atlantic/Canary', hour: '2-digit', minute: '2-digit', hour12: false }).format(ms);
  const rad = (d) => d * Math.PI / 180;

  // ------------------------------------------------------------------
  // Note del team (pannello admin)
  // ------------------------------------------------------------------
  let NOTES = [];
  async function loadNotes() {
    try {
      const { data } = await sb.from('route_notes').select('id,route_id,sport,kind,lat,lng,text,expires_at');
      NOTES = data || [];
    } catch (e) { NOTES = []; }
    return NOTES;
  }
  try {
    sb.channel('route_notes').on('postgres_changes', { event: '*', schema: 'public', table: 'route_notes' }, () => loadNotes().then(() => { if (window.MAXORA_SPORT && window.MAXORA_SPORT.redraw) window.MAXORA_SPORT.redraw(); })).subscribe();
  } catch (e) { /* senza tempo reale */ }
  const noteText = (n) => (n.text && (n.text[lang()] || n.text.es || Object.values(n.text)[0])) || '';
  function notesFor(r) {
    const sample = r.line.filter((_, i) => i % 2 === 0);
    return NOTES.filter((n) => (n.route_id === r.id) || (!n.route_id && (!n.sport || n.sport === r.sport) && sample.some((p) => M.distKm({ lat: p[1], lng: p[0] }, n) < 0.06)));
  }

  // ------------------------------------------------------------------
  // Geometria locale (metri) sulla linea da seguire
  // ------------------------------------------------------------------
  function prep(r, pre) {
    const base = r.back ? r.line.concat(r.line.slice(0, -1).reverse()) : r.line.slice();
    const pts = (pre && pre.length > 1 ? pre.slice(0, -1) : []).concat(base);
    const lat0 = pts[0][1], kx = 111320 * Math.cos(rad(lat0)), ky = 110540;
    const xy = pts.map((p) => [p[0] * kx, p[1] * ky]);
    const cum = [0];
    for (let i = 1; i < xy.length; i++) cum.push(cum[i - 1] + Math.hypot(xy[i][0] - xy[i - 1][0], xy[i][1] - xy[i - 1][1]));
    const off = pre && pre.length > 1 ? cum[pre.length - 2 + 1] || 0 : 0;   // metri dell'avvicinamento (da te alla partenza)
    return { pts, xy, cum, kx, ky, len: cum[cum.length - 1], pre: off, turnAt: r.back ? cum[(pre && pre.length > 1 ? pre.length - 1 : 0) + r.line.length - 1] : null };
  }
  // punto più vicino sulla linea; con "near" sceglie, tra i tratti quasi alla stessa distanza,
  // quello più vicino al punto già raggiunto (andata e ritorno sulla stessa strada)
  function project(G, lng, lat, from, to, near) {
    const px = lng * G.kx, py = lat * G.ky;
    const c = [];
    let best = { d: 1e12, s: 0, i: 0 };
    for (let i = Math.max(0, from); i < Math.min(G.xy.length - 1, to); i++) {
      const a = G.xy[i], b = G.xy[i + 1];
      const vx = b[0] - a[0], vy = b[1] - a[1], L = vx * vx + vy * vy || 1;
      const t = Math.max(0, Math.min(1, ((px - a[0]) * vx + (py - a[1]) * vy) / L));
      const qx = a[0] + t * vx, qy = a[1] + t * vy, d = Math.hypot(px - qx, py - qy);
      const x = { d, s: G.cum[i] + t * Math.sqrt(L), i };
      c.push(x);
      if (d < best.d) best = x;
    }
    if (near == null) return best;
    const tol = Math.max(40, best.d + 20);
    let pick = best, cost = 1e12;
    for (const x of c) {
      if (x.d > tol) continue;
      const k = (x.s >= near - 40 ? Math.abs(x.s - near) : (near - x.s) * 4) + x.d * 6;   // avanti costa poco, indietro molto, lontano dalla linea moltissimo
      if (k < cost) { cost = k; pick = x; }
    }
    return pick;
  }
  const along = (G, p) => project(G, p.lng, p.lat, 0, G.xy.length);
  function pointAt(G, s) {
    let i = 0;
    while (i < G.cum.length - 2 && G.cum[i + 1] < s) i++;
    const f = (s - G.cum[i]) / Math.max(1e-6, G.cum[i + 1] - G.cum[i]);
    const a = G.pts[i], b = G.pts[i + 1];
    return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
  }

  // ------------------------------------------------------------------
  // Avvisi lungo la linea (posizione in metri dalla partenza)
  // ------------------------------------------------------------------
  function buildEvents(r, G, ctx) {
    const ev = [];
    const onLine = (p, maxM) => { const q = along(G, p); return q.d <= maxM ? q.s : null; };
    // note del team
    notesFor(r).forEach((n) => { const s = onLine(n, 80); if (s != null) ev.push({ s, kind: 'note', icon: KIND_ICON[n.kind] || '⚠️', text: noteText(n), voice: (d) => tr('noteV', { d, t: noteText(n) }) }); });
    // salita principale
    if (r.climb && r.climb.km >= 1) {
      const s = G.pre + r.climb.from_km * 1000;
      ev.push({ s, kind: 'climb', icon: '⛰', text: tr('climb', { km: num(r.climb.km, 1), avg: num(r.climb.avg, 1) }), voice: (d) => tr('climbV', { d, km: num(r.climb.km, 1), avg: num(r.climb.avg, 1) }) });
    }
    // ritorno (andata e ritorno)
    if (G.turnAt) ev.push({ s: G.turnAt, kind: 'turn', icon: '↩️', text: tr('turn'), voice: () => tr('turnV'), at: 40 });
    // vento contro: tratti ≥ 1 km con componente frontale > 12 km/h
    const w = ctx.wind;
    if (w && w.ws >= 15) {
      let run = null;
      const STEP = 200;
      for (let s = 0; s < G.len - STEP; s += STEP) {
        const a = pointAt(G, s), b = pointAt(G, s + STEP);
        const brg = (Math.atan2((b[0] - a[0]) * Math.cos(rad(a[1])), b[1] - a[1]) * 180 / Math.PI + 360) % 360;
        const rel = Math.abs(((w.wd - brg) % 360 + 540) % 360 - 180);
        const head = Math.cos(rad(rel)) * w.ws > 12;
        if (head && !run) run = { s0: s };
        if ((!head || s + 2 * STEP >= G.len) && run) {
          const km = (s - run.s0) / 1000;
          if (km >= 1) ev.push({ s: run.s0, kind: 'head', icon: '💨', text: tr('head', { km: num(km, 1) }), voice: (d) => tr('headV', { d, km: num(km, 1) }) });
          run = null;
        }
      }
    }
    // acqua: annuncia "ultima acqua" quando dopo un punto acqua il prossimo è lontano
    const ws = (ctx.water || []).map((p) => onLine(p, 150)).filter((s) => s != null).sort((a, b) => a - b);
    const gap = r.sport === 'bike' ? 20000 : 7000;
    ws.forEach((s, k) => {
      const next = k + 1 < ws.length ? ws[k + 1] : G.len;
      if (next - s > gap && G.len - s > gap) ev.push({ s, kind: 'water', icon: '💧', text: tr('water', { km: num((next - s) / 1000, 0) }), voice: () => tr('waterV', { km: num((next - s) / 1000, 0) }), at: 60 });
    });
    return ev.sort((a, b) => a.s - b.s);
  }
  function hazardEvents(G) {
    const out = [];
    (M.reports() || []).forEach((rep) => {
      const q = along(G, rep);
      if (q.d < 80) out.push({ s: q.s, kind: 'haz', id: rep.id, icon: '⚠️', text: M.typeLabel(rep), voice: (d) => tr('hazV', { d, t: M.typeLabel(rep) }) });
    });
    return out;
  }

  // ------------------------------------------------------------------
  // Sessione
  // ------------------------------------------------------------------
  let F = null;
  const voiceOn = () => store.get('followVoice', true);
  function say(text) {
    if (!voiceOn() || !('speechSynthesis' in window) || !text) return;
    try { const u = new SpeechSynthesisUtterance(text); u.lang = LOC[lang()]; speechSynthesis.speak(u); } catch (e) {}
  }
  async function wake() {
    try { if ('wakeLock' in navigator && document.visibilityState === 'visible' && F) F.lock = await navigator.wakeLock.request('screen'); } catch (e) {}
  }
  document.addEventListener('visibilitychange', () => { if (F && document.visibilityState === 'visible') wake(); });

  async function start(r, ctx) {
    if (F) stop(true);
    if (!navigator.geolocation) { toast(tr('gpsNo')); return; }
    await loadNotes();
    // si parte da dove sei: strada vera fino alla partenza, poi il percorso
    let pre = null;
    const me = M.pos();
    if (me) {
      const st0 = { lat: r.line[0][1], lng: r.line[0][0] };
      if (M.distKm(me, st0) > 0.08) {
        try {
          const ctl = new AbortController(); setTimeout(() => ctl.abort(), 6000);
          const j = await (await fetch('https://routing.openstreetmap.de/routed-' + (r.sport === 'bike' ? 'bike' : 'foot') + '/route/v1/driving/' + me.lng + ',' + me.lat + ';' + st0.lng + ',' + st0.lat + '?overview=full&geometries=geojson', { signal: ctl.signal })).json();
          if (j.routes && j.routes[0]) pre = j.routes[0].geometry.coordinates.concat([r.line[0]]);
        } catch (e) { /* senza avvicinamento: si va alla partenza da soli */ }
        if (!pre) pre = [[me.lng, me.lat], r.line[0]];
      }
    }
    const G = prep(r, pre);
    F = { r, G, ctx, ev: buildEvents(r, G, ctx), haz: [], hazAt: 0, said: new Set(), track: [], t0: Date.now(), moving: 0, dist: 0, last: null, s: null, idx: 0,
      off: false, offN: 0, offSaid: 0, started: false, finished: false, speeds: [] };
    document.body.classList.add('following');
    M.closeOverlays && M.closeOverlays();
    ui();
    ensureLayers();
    F.watch = navigator.geolocation.watchPosition(onPos, (e) => { if (F) { F.gpsErr = true; draw(); } }, { enableHighAccuracy: true, maximumAge: 0, timeout: 30000 });
    wake();
    F.timer = setInterval(draw, 1000);
    const w = ctx.wind;
    say(tr('startV', { n: r.name[lang()] || r.name.es, km: num((G.len - G.pre) / 1000, 1) }) + (G.pre > 80 ? ' ' + tr('toStart', { d: fmtDv(G.pre) }) + '.' : '') + (w && w.ws >= 12 ? ' ' + tr('windV', { v: w.ws, d: COMPASS[lang()][Math.round(w.wd / 45) % 8] }) : ''));
    toast(tr('keep'));
    const b = new maplibregl.LngLatBounds(r.line[0], r.line[0]); r.line.forEach((p) => b.extend(p));
    map.setPadding({ top: 0, bottom: 0, left: 0, right: 0 });
    map.fitBounds(b, { padding: { top: 120, bottom: 220, left: 30, right: 30 }, duration: 600 });
  }

  function onPos(p) {
    if (!F) return;
    const now = p.timestamp || Date.now();
    const pos = { lat: p.coords.latitude, lng: p.coords.longitude, acc: p.coords.accuracy || 30, t: now, ele: p.coords.altitude };
    F.gpsErr = false;
    if (pos.acc > 80) { F.pos = pos; draw(); return; }
    // traccia registrata e distanza percorsa
    if (F.last) {
      const d = M.distKm(F.last, pos) * 1000, dt = (now - F.last.t) / 1000;
      if (dt > 0 && d > 3 && d / dt < 30) {
        F.dist += d;
        const v = d / dt;
        if (v > 0.8) F.moving += dt;
        F.speeds.push({ t: now, d, dt });
        F.speeds = F.speeds.filter((x) => now - x.t < 30000);
      }
    }
    if (!F.last || M.distKm(F.last, pos) * 1000 > 3) { F.track.push(pos); F.last = pos; }
    F.pos = pos;
    // posizione sulla linea: cerco vicino all'ultima posizione (così nell'andata e ritorno non salto sull'altra metà)
    const G = F.G;
    const q = project(G, pos.lng, pos.lat, 0, G.xy.length, F.started ? (F.s || 0) : 0);
    if (!F.started) {
      if (q.d < 60 && q.s < Math.min(1500, G.len * 0.3)) { F.started = true; }
      else if (q.d < 60 && F.track.length > 3) { F.started = true; }
    }
    if (F.started && q.d <= 60) { F.idx = q.i; F.s = q.s; }
    // fuori percorso (2 letture di fila oltre 50 m, tenendo conto della precisione)
    const offNow = F.started && q.d > Math.max(50, pos.acc);
    F.offN = offNow ? F.offN + 1 : 0;
    if (F.offN >= 2 && !F.off) { F.off = true; F.offSaid = now; say(tr('offV')); if (navigator.vibrate) navigator.vibrate([200, 100, 200]); }
    else if (F.off && F.offN >= 2 && now - F.offSaid > 60000) { F.offSaid = now; say(tr('offV')); }
    if (F.off && !offNow) { F.off = false; say(tr('backV')); }
    F.offD = q.d;
    // avvisi in arrivo
    if (F.started && !F.off && F.s != null) {
      if (now - F.hazAt > 60000) { F.haz = hazardEvents(G); F.hazAt = now; }
      const ahead = r => r.s - F.s;
      const lead = F.r.sport === 'bike' ? 350 : 180;
      for (const e of F.ev.concat(F.haz)) {
        const key = e.kind + ':' + Math.round(e.s) + ':' + (e.id || '');
        const d = ahead(e);
        if (F.said.has(key)) continue;
        const at = e.at || lead;
        if (d <= at && d > -30) { F.said.add(key); say(e.voice(fmtDv(Math.max(0, d)))); if (navigator.vibrate) navigator.vibrate(120); }
        else if (d < -30) F.said.add(key);
      }
      if (!F.finished && F.s > G.len - 60 && F.s > G.len * 0.8) { F.finished = true; say(tr('finishV')); setTimeout(() => stop(false), 1500); }
    }
    draw();
  }

  // ------------------------------------------------------------------
  // Schermata
  // ------------------------------------------------------------------
  let H = null;
  function ui() {
    if (H) H.remove();
    H = el('div', { class: 'fw', role: 'region', 'aria-label': tr('follow') }, [
      el('div', { class: 'fw-top' }, [
        el('div', { class: 'fw-name', id: 'fwName' }),
        el('button', { class: 'fw-voice', id: 'fwVoice', onclick: () => { store.set('followVoice', !voiceOn()); if (!voiceOn() && 'speechSynthesis' in window) speechSynthesis.cancel(); toast(voiceOn() ? tr('voiceOn') : tr('voiceOff')); draw(); } }),
        el('button', { class: 'fw-stop', text: tr('stop'), onclick: () => { if (confirm(tr('confirmStop'))) stop(false); } })
      ]),
      el('div', { class: 'fw-next', id: 'fwNext' }),
      el('div', { class: 'fw-bar' }, [el('i', { id: 'fwProg' })]),
      el('div', { class: 'fw-grid', id: 'fwGrid' })
    ]);
    document.body.appendChild(H);
  }
  function stat(v, k, big) { return el('div', { class: 'fw-s' + (big ? ' big' : '') }, [el('b', { text: v }), el('span', { text: k })]); }
  function draw() {
    if (!F || !H) return;
    const G = F.G, r = F.r;
    H.querySelector('#fwName').textContent = (r.sport === 'bike' ? '🚴 ' : '🏃 ') + (r.name[lang()] || r.name.es);
    H.querySelector('#fwVoice').textContent = voiceOn() ? '🔊' : '🔇';
    const s = F.s || 0, left = Math.max(0, G.len - s);
    const el0 = Date.now() - F.t0;
    const recent = F.speeds.reduce((a, x) => a + x.d, 0) / Math.max(1, F.speeds.reduce((a, x) => a + x.dt, 0));
    const avg = F.moving > 60 ? F.dist / F.moving : (r.sport === 'bike' ? 20 : 10) / 3.6;
    const v = F.speeds.length ? recent : 0;
    const eta = Date.now() + left / Math.max(0.5, avg) * 1000;
    const grid = H.querySelector('#fwGrid'); grid.innerHTML = '';
    grid.append(
      stat(num(s / 1000, 1), 'km ' + tr('done'), true),
      stat(num(left / 1000, 1), 'km ' + tr('left'), true),
      r.sport === 'bike' ? stat(num(v * 3.6, 0), tr('speed')) : stat(v > 0.5 ? hms(1000 / v).replace(/^0:/, '') : '–', tr('pace')),
      stat(hms(el0 / 1000), tr('time')),
      stat(F.started ? clock(eta) : '–', tr('eta'))
    );
    H.querySelector('#fwProg').style.width = Math.min(100, s / G.len * 100) + '%';
    // riga "prossimo": GPS, partenza, fuori percorso o prossimo avviso
    const nx = H.querySelector('#fwNext');
    let txt = '', cls = '';
    if (!F.pos) { txt = F.gpsErr ? tr('gpsNo') : tr('gpsWait'); cls = 'muted'; }
    else if (!F.started) { const q = along(G, F.pos); const d0 = M.distKm(F.pos, { lat: G.pts[0][1], lng: G.pts[0][0] }) * 1000; txt = '📍 ' + tr('toStart', { d: fmtD(Math.min(d0, q.d)) }); cls = 'muted'; }
    else if (F.off) { txt = '↩️ ' + tr('off', { d: fmtD(F.offD || 0) }); cls = 'bad'; }
    else {
      const up = F.ev.concat(F.haz).filter((e) => e.s - s > -20).sort((a, b) => a.s - b.s)[0];
      if (G.pre && s < G.pre - 20) { txt = '📍 ' + tr('toStart', { d: fmtD(G.pre - s) }); cls = ''; }
      else if (up && up.s - s < 5000) { txt = up.icon + ' ' + (up.s - s < 30 ? '' : tr('inD', { d: fmtD(up.s - s) }) + ' · ') + up.text; cls = up.kind === 'note' || up.kind === 'haz' ? 'warn' : ''; }
      else { txt = '✓ ' + tr('onRoute'); cls = 'ok'; }
    }
    nx.textContent = txt; nx.className = 'fw-next ' + cls;
    drawMap();
  }
  function ensureLayers() {
    if (!map.getSource('fw')) map.addSource('fw', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
    if (!map.getLayer('fw-todo')) map.addLayer({ id: 'fw-todo', type: 'line', source: 'fw', filter: ['==', ['get', 'k'], 'todo'], layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': ['get', 'c'], 'line-width': 7, 'line-opacity': 0.95 } });
    if (!map.getLayer('fw-done')) map.addLayer({ id: 'fw-done', type: 'line', source: 'fw', filter: ['==', ['get', 'k'], 'done'], layout: { 'line-cap': 'round' }, paint: { 'line-color': '#8a96a3', 'line-width': 6, 'line-opacity': 0.9 } });
    if (!map.getLayer('fw-me')) map.addLayer({ id: 'fw-me', type: 'circle', source: 'fw', filter: ['==', ['get', 'k'], 'me'], paint: { 'circle-radius': 9, 'circle-color': '#2f7cf6', 'circle-stroke-color': '#fff', 'circle-stroke-width': 3 } });
  }
  let lastCam = 0;
  function drawMap() {
    if (!F || !map.getStyle()) return;
    ensureLayers();
    const feats = [];
    {
      const G = F.G, todo = [pointAt(G, F.s || 0)];
      for (let i = 0; i < G.pts.length; i++) if (G.cum[i] > (F.s || 0)) todo.push(G.pts[i]);
      if (todo.length > 1) feats.push({ type: 'Feature', properties: { k: 'todo', c: F.r.sport === 'bike' ? '#2f9e5b' : '#f2711c' }, geometry: { type: 'LineString', coordinates: todo } });
    }
    if (F.s > 5) {
      const G = F.G, line = [];
      for (let i = 0; i < G.pts.length && G.cum[i] <= F.s; i++) line.push(G.pts[i]);
      line.push(pointAt(G, F.s));
      if (line.length > 1) feats.push({ type: 'Feature', properties: { k: 'done' }, geometry: { type: 'LineString', coordinates: line } });
    }
    if (F.pos) feats.push({ type: 'Feature', properties: { k: 'me' }, geometry: { type: 'Point', coordinates: [F.pos.lng, F.pos.lat] } });
    map.getSource('fw').setData({ type: 'FeatureCollection', features: feats });
    if (F.pos && Date.now() - lastCam > 2500 && !F.userMoved) {
      lastCam = Date.now();
      const hud = H ? H.querySelector('.fw-grid').getBoundingClientRect().height + 90 : 200;
      map.easeTo({ center: [F.pos.lng, F.pos.lat], zoom: Math.max(map.getZoom(), 15), padding: { top: 120, bottom: hud, left: 0, right: 0 }, duration: 800 });
    }
  }
  map.on('dragstart', () => { if (F) { F.userMoved = true; clearTimeout(F.reCam); F.reCam = setTimeout(() => { if (F) F.userMoved = false; }, 15000); } });

  // ------------------------------------------------------------------
  // Fine: riepilogo e GPX della traccia registrata
  // ------------------------------------------------------------------
  function stop(silent) {
    if (!F) return;
    const S = F;
    if (S.watch != null) navigator.geolocation.clearWatch(S.watch);
    clearInterval(S.timer);
    try { if (S.lock) S.lock.release(); } catch (e) {}
    if ('speechSynthesis' in window && silent) speechSynthesis.cancel();
    F = null;
    if (H) { H.remove(); H = null; }
    document.body.classList.remove('following');
    if (map.getSource('fw')) map.getSource('fw').setData({ type: 'FeatureCollection', features: [] });
    if (silent || S.track.length < 2) return;
    const r = S.r;
    const avg = S.moving > 0 ? S.dist / S.moving : 0;
    const box = el('div', { class: 'fw-sum' }, [
      el('div', { class: 'fw-sum-card' }, [
        el('h2', { text: tr('sumT') }),
        el('p', { class: 'fw-sum-n', text: r.name[lang()] || r.name.es }),
        el('div', { class: 'fw-grid' }, [
          stat(num(S.dist / 1000, 2), 'km ' + tr('dist'), true),
          stat(hms(S.moving), tr('moving'), true),
          r.sport === 'bike' ? stat(num(avg * 3.6, 1), tr('speed') + ' ' + tr('avg')) : stat(avg > 0.5 ? hms(1000 / avg).replace(/^0:/, '') : '–', tr('pace') + ' ' + tr('avg'))
        ]),
        el('button', { class: 'p-go', onclick: () => box.remove(), text: tr('close') }),
        el('button', { class: 'p-sec', onclick: () => gpx(S), text: '↗ ' + tr('gpx') })
      ])
    ]);
    document.body.appendChild(box);
  }
  function gpx(S) {
    const name = (S.r.name[lang()] || S.r.name.es).replace(/[<&>]/g, '');
    const pts = S.track.map((p) => '<trkpt lat="' + p.lat.toFixed(6) + '" lon="' + p.lng.toFixed(6) + '">' + (p.ele != null ? '<ele>' + Math.round(p.ele) + '</ele>' : '') + '<time>' + new Date(p.t).toISOString() + '</time></trkpt>');
    const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<gpx version="1.1" creator="Maxora" xmlns="http://www.topografix.com/GPX/1/1"><trk><name>' + name + '</name><type>' + (S.r.sport === 'bike' ? 'cycling' : 'running') + '</type><trkseg>' + pts.join('') + '</trkseg></trk></gpx>';
    const fname = 'maxora-' + S.r.id + '-' + new Date(S.t0).toISOString().slice(0, 10) + '.gpx';
    try {
      const f = new File([xml], fname, { type: 'application/gpx+xml' });
      if (navigator.canShare && navigator.canShare({ files: [f] })) { navigator.share({ files: [f], title: name }).catch(() => {}); return; }
    } catch (e) {}
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([xml], { type: 'application/gpx+xml' }));
    a.download = fname;
    document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  }

  loadNotes();
  window.MAXORA_FOLLOW = { start, stop, notesFor, noteText, loadNotes, label: () => tr('follow'), active: () => !!F, _state: () => F, KIND_ICON };
})();
