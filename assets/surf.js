/* Maxora — modalità surf (onde, vento, maree, voto per livello) */
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
      surf: 'Surf', on: 'Modalità surf', off: 'Modalità strada', lvl1: 'Principiante', lvl2: 'Intermedio', lvl3: 'Esperto',
      best: 'I migliori', now: 'adesso', today: 'Oggi', tomorrow: 'Domani', tide: 'Marea', rising: 'sale', falling: 'scende',
      high: 'Alta', low: 'Bassa', live: 'Reale ora', above: '+{n} cm sulla previsione', below: '−{n} cm sotto la previsione', asfc: 'come da previsione',
      waves: 'Onde', period: 'Periodo', wind: 'Vento', tideK: 'Marea', offshore: 'offshore', cross: 'laterale', onshore: 'onshore', calm: 'calmo',
      notYou: 'Non adatto al tuo livello', ideal: 'Quando funziona', swellFrom: 'Mareggiata da {d}', windFrom: 'Vento offshore da {d}', tideBest: 'Marea {x}',
      tlow: 'bassa', tlowmid: 'bassa–media', tmid: 'media', tmidhigh: 'media–alta', thigh: 'alta', tall: 'qualsiasi', levels: 'Livello: {a}',
      haz: 'Attenzione', next48: 'Prossime 48 ore', days: 'Prossimi giorni', bestAt: 'meglio alle {h}', updated: 'ECMWF · aggiornato {t}',
      loading: 'Carico le previsioni…', noData: 'Previsioni non disponibili adesso', disc: 'Previsione, non garanzia: guarda sempre il mare prima di entrare.',
      beach: 'Spiaggia', reef: 'Reef', point: 'Punta', L: 'sinistra', R: 'destra', LR: 'destra e sinistra', approx: 'Posizione indicativa',
      tides: 'Maree del giorno', flat: 'piatto', poor: 'scarso', fair: 'discreto', good: 'buono', great: 'ottimo', offsh: 'largo {h} m',
      night: 'notte', src: 'Onde e vento: ECMWF Open Data (CC BY 4.0). Maree: calcolate da Maxora sul mareografo di Puerto del Rosario (IOC · REDMAR).',
      ago: '{t} fa', from: 'da {d}', levelQ: 'Il tuo livello', go: 'VAI', openWith: 'Apri navigazione con', boat: 'Si raggiunge in barca dal porto di Corralejo'
    },
    es: {
      surf: 'Surf', on: 'Modo surf', off: 'Modo carretera', lvl1: 'Principiante', lvl2: 'Intermedio', lvl3: 'Experto',
      best: 'Los mejores', now: 'ahora', today: 'Hoy', tomorrow: 'Mañana', tide: 'Marea', rising: 'sube', falling: 'baja',
      high: 'Alta', low: 'Baja', live: 'Real ahora', above: '+{n} cm sobre la previsión', below: '−{n} cm bajo la previsión', asfc: 'como la previsión',
      waves: 'Olas', period: 'Periodo', wind: 'Viento', tideK: 'Marea', offshore: 'terral', cross: 'lateral', onshore: 'de mar', calm: 'calma',
      notYou: 'No apto para tu nivel', ideal: 'Cuándo funciona', swellFrom: 'Mar de fondo del {d}', windFrom: 'Viento terral del {d}', tideBest: 'Marea {x}',
      tlow: 'baja', tlowmid: 'baja–media', tmid: 'media', tmidhigh: 'media–alta', thigh: 'alta', tall: 'cualquiera', levels: 'Nivel: {a}',
      haz: 'Cuidado', next48: 'Próximas 48 horas', days: 'Próximos días', bestAt: 'mejor a las {h}', updated: 'ECMWF · actualizado {t}',
      loading: 'Cargando previsiones…', noData: 'Previsiones no disponibles ahora', disc: 'Previsión, no garantía: mira siempre el mar antes de entrar.',
      beach: 'Playa', reef: 'Arrecife', point: 'Punta', L: 'izquierda', R: 'derecha', LR: 'derecha e izquierda', approx: 'Posición aproximada',
      tides: 'Mareas del día', flat: 'plano', poor: 'flojo', fair: 'regular', good: 'bueno', great: 'excelente', offsh: 'fuera {h} m',
      night: 'noche', src: 'Olas y viento: ECMWF Open Data (CC BY 4.0). Mareas: calculadas por Maxora con el mareógrafo de Puerto del Rosario (IOC · REDMAR).',
      ago: 'hace {t}', from: 'del {d}', levelQ: 'Tu nivel', go: 'IR', openWith: 'Abrir navegación con', boat: 'Se llega en barco desde el puerto de Corralejo'
    },
    en: {
      surf: 'Surf', on: 'Surf mode', off: 'Road mode', lvl1: 'Beginner', lvl2: 'Intermediate', lvl3: 'Expert',
      best: 'Best spots', now: 'now', today: 'Today', tomorrow: 'Tomorrow', tide: 'Tide', rising: 'rising', falling: 'falling',
      high: 'High', low: 'Low', live: 'Live now', above: '+{n} cm above forecast', below: '−{n} cm below forecast', asfc: 'as forecast',
      waves: 'Waves', period: 'Period', wind: 'Wind', tideK: 'Tide', offshore: 'offshore', cross: 'cross-shore', onshore: 'onshore', calm: 'calm',
      notYou: 'Not for your level', ideal: 'When it works', swellFrom: 'Swell from {d}', windFrom: 'Offshore wind from {d}', tideBest: '{x} tide',
      tlow: 'low', tlowmid: 'low–mid', tmid: 'mid', tmidhigh: 'mid–high', thigh: 'high', tall: 'any', levels: 'Level: {a}',
      haz: 'Watch out', next48: 'Next 48 hours', days: 'Next days', bestAt: 'best at {h}', updated: 'ECMWF · updated {t}',
      loading: 'Loading forecast…', noData: 'Forecast not available right now', disc: 'A forecast, not a guarantee: always check the sea before paddling out.',
      beach: 'Beach', reef: 'Reef', point: 'Point', L: 'left', R: 'right', LR: 'left and right', approx: 'Approximate position',
      tides: 'Tides of the day', flat: 'flat', poor: 'poor', fair: 'fair', good: 'good', great: 'great', offsh: 'out {h} m',
      night: 'night', src: 'Waves and wind: ECMWF Open Data (CC BY 4.0). Tides: computed by Maxora from the Puerto del Rosario tide gauge (IOC · REDMAR).',
      ago: '{t} ago', from: 'from {d}', levelQ: 'Your level', go: 'GO', openWith: 'Navigate with', boat: 'Reached by boat from Corralejo harbour'
    },
    de: {
      surf: 'Surf', on: 'Surfmodus', off: 'Straßenmodus', lvl1: 'Anfänger', lvl2: 'Fortgeschritten', lvl3: 'Experte',
      best: 'Die besten Spots', now: 'jetzt', today: 'Heute', tomorrow: 'Morgen', tide: 'Gezeiten', rising: 'steigend', falling: 'fallend',
      high: 'Hoch', low: 'Niedrig', live: 'Live jetzt', above: '+{n} cm über Prognose', below: '−{n} cm unter Prognose', asfc: 'wie vorhergesagt',
      waves: 'Wellen', period: 'Periode', wind: 'Wind', tideK: 'Tide', offshore: 'ablandig', cross: 'sideshore', onshore: 'auflandig', calm: 'still',
      notYou: 'Nicht für dein Level', ideal: 'Wann es läuft', swellFrom: 'Swell aus {d}', windFrom: 'Ablandiger Wind aus {d}', tideBest: 'Tide {x}',
      tlow: 'niedrig', tlowmid: 'niedrig–mittel', tmid: 'mittel', tmidhigh: 'mittel–hoch', thigh: 'hoch', tall: 'egal', levels: 'Level: {a}',
      haz: 'Achtung', next48: 'Nächste 48 Stunden', days: 'Nächste Tage', bestAt: 'am besten um {h}', updated: 'ECMWF · aktualisiert {t}',
      loading: 'Lade Vorhersage…', noData: 'Vorhersage gerade nicht verfügbar', disc: 'Vorhersage, keine Garantie: schau dir immer das Meer an, bevor du rausgehst.',
      beach: 'Strand', reef: 'Riff', point: 'Pointbreak', L: 'links', R: 'rechts', LR: 'links und rechts', approx: 'Ungefähre Position',
      tides: 'Gezeiten des Tages', flat: 'flach', poor: 'schwach', fair: 'ok', good: 'gut', great: 'super', offsh: 'drau. {h} m',
      night: 'Nacht', src: 'Wellen und Wind: ECMWF Open Data (CC BY 4.0). Gezeiten: von Maxora aus dem Pegel Puerto del Rosario berechnet (IOC · REDMAR).',
      ago: 'vor {t}', from: 'aus {d}', levelQ: 'Dein Level', go: 'LOS', openWith: 'Navigieren mit', boat: 'Per Boot ab dem Hafen von Corralejo'
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
  const angleDiff = (a, b) => { const d = Math.abs(a - b) % 360; return d > 180 ? 360 - d : d; };
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const rad = (d) => d * Math.PI / 180;

  // ------------------------------------------------------------------
  // Stato
  // ------------------------------------------------------------------
  const SF = {
    on: false, level: store.get('surfLevel', 2), spots: [], byId: new Map(), fc: null, tides: null,
    times: [], idx: 0, markers: new Map(), live: null, loadedAt: 0, open: null, collapsed: store.get('surfCollapsed', false)
  };

  // ------------------------------------------------------------------
  // Sole (per non consigliare spot di notte)
  // ------------------------------------------------------------------
  function sunAlt(ms, lat, lng) {
    const d = (ms - Date.UTC(2000, 0, 1, 12)) / 86400000;
    const g = rad(357.529 + 0.98560028 * d);
    const q = 280.459 + 0.98564736 * d;
    const L = rad(q + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g));
    const e = rad(23.439 - 0.00000036 * d);
    const ra = Math.atan2(Math.cos(e) * Math.sin(L), Math.cos(L));
    const dec = Math.asin(Math.sin(e) * Math.sin(L));
    const gmst = (18.697374558 + 24.06570982441908 * d) % 24;
    const ha = rad(gmst * 15 + lng) - ra;
    return Math.asin(Math.sin(rad(lat)) * Math.sin(dec) + Math.cos(rad(lat)) * Math.cos(dec) * Math.cos(ha)) * 180 / Math.PI;
  }
  const isDay = (ms) => sunAlt(ms, 28.4, -14.0) > -2;

  // ------------------------------------------------------------------
  // Maree: tra due estremi la curva segue un coseno
  // ------------------------------------------------------------------
  let EXT = [];
  function tideAt(ms) {
    if (!EXT.length) return null;
    let i = 0, lo = 0, hi = EXT.length - 1;
    while (lo <= hi) { const mid = (lo + hi) >> 1; if (EXT[mid].t <= ms) { i = mid; lo = mid + 1; } else hi = mid - 1; }
    const a = EXT[i], b = EXT[i + 1];
    if (!a || !b || ms < a.t) return null;
    const f = (ms - a.t) / (b.t - a.t);
    const h = (a.h + b.h) / 2 + (a.h - b.h) / 2 * Math.cos(Math.PI * f);
    const lowH = Math.min(a.h, b.h), highH = Math.max(a.h, b.h);
    return { h, u: (h - lowH) / Math.max(1, highH - lowH), rising: b.h > a.h, next: b, prev: a };
  }

  // ------------------------------------------------------------------
  // Voto 0–5, trasparente
  // ------------------------------------------------------------------
  const SIZE = { 1: [0.5, 1.1, 0.3, 1.5], 2: [0.9, 2.0, 0.5, 2.6], 3: [1.5, 3.5, 0.9, 5.0] };
  const TIDE = { low: [0, 0.35], lowmid: [0, 0.6], mid: [0.25, 0.75], midhigh: [0.4, 1], high: [0.65, 1], all: [0, 1] };

  function exposure(sp, dir) {
    let [a, b] = sp.win;
    const width = ((b - a) + 360) % 360 || 360;
    const center = (a + width / 2) % 360;
    const half = width / 2;
    const d = angleDiff(dir, center);
    if (d <= half) return 1 - 0.35 * Math.pow(d / half, 2);
    if (d <= half + 35) return 0.65 * (1 - (d - half) / 35) + 0.05;
    return 0.05;
  }
  function sizeScore(h, lvl) {
    const [i0, i1, o0, o1] = SIZE[lvl];
    if (h >= i0 && h <= i1) return 1;
    if (h < i0) return h <= o0 ? 0.45 * h / o0 : 0.45 + 0.55 * (h - o0) / (i0 - o0);
    if (h <= o1) return 1 - 0.55 * (h - i1) / (o1 - i1);
    return Math.max(0.05, 0.45 - (h - o1) * 0.4);
  }
  function windInfo(sp, ws, wd) {
    if (ws == null || wd == null) return { score: 0.7, kind: 'cross' };
    if (ws < 7) return { score: 1, kind: 'calm' };
    const rel = angleDiff(wd, sp.off);
    if (rel <= 50) return { score: ws <= 30 ? 1 : 0.75, kind: 'offshore' };
    if (rel <= 110) return { score: clamp(1 - (ws - 7) / 35, 0.35, 0.95), kind: 'cross' };
    return { score: clamp(1 - (ws - 5) / 15, 0, 0.85), kind: 'onshore' };
  }
  const periodScore = (tp) => (tp == null ? 0.6 : tp < 6 ? 0.35 : tp < 8 ? 0.55 : tp < 10 ? 0.75 : tp < 12 ? 0.9 : 1);

  function rate(sp, k, lvl) {
    const d = SF.fc && SF.fc.spots[sp.id];
    if (!d || d.hs[k] == null) return null;
    const hs = d.hs[k], tp = d.tp[k], dir = d.dir[k], ws = d.ws[k], wd = d.wd[k];
    const pf = clamp(0.8 + 0.035 * ((tp || 8) - 8), 0.7, 1.3);
    let h = hs * exposure(sp, dir == null ? sp.facing : dir) * pf;
    let size = sizeScore(h, lvl);
    if (h < sp.minH) size *= Math.pow(h / sp.minH, 2);
    if (h > sp.maxH * 1.15) size *= 0.4;
    const w = windInfo(sp, ws, wd);
    const td = tideAt(SF.times[k]);
    let tideS = 1;
    if (td) {
      const [t0, t1] = TIDE[sp.tide] || TIDE.all;
      const out = td.u < t0 ? t0 - td.u : td.u > t1 ? td.u - t1 : 0;
      tideS = clamp(1 - 1.2 * out, 0.5, 1);
    }
    let r = 5 * size * (0.2 + 0.8 * w.score) * (0.55 + 0.45 * periodScore(tp)) * tideS;
    const notYou = lvl < sp.lvl[0];
    if (notYou) r = Math.min(r, 1);
    r = Math.round(clamp(r, 0, 5) * 2) / 2;
    return { r, h, hs, tp, dir, ws, wd, wind: w.kind, tide: td, notYou };
  }
  const color = (r) => (r == null ? '#9aa4ae' : r < 1 ? '#9aa4ae' : r < 2 ? '#e5484d' : r < 3 ? '#f5a524' : r < 4 ? '#2f9e5b' : '#14c8b0');
  const word = (x) => (x.r < 1 ? (x.h < 0.3 ? tr('flat') : tr('poor')) : x.r < 2 ? tr('poor') : x.r < 3 ? tr('fair') : x.r < 4 ? tr('good') : tr('great'));
  const fmtR = (r) => (r == null ? '–' : num(r, r % 1 ? 1 : 0));
  function line(x) {
    const parts = [num(Math.max(0.1, x.h), 1) + ' m'];
    if (x.tp) parts.push(num(x.tp, 0) + ' s');
    if (x.dir != null) parts.push(compass(x.dir));
    if (x.ws != null) parts.push(tr('wind').toLowerCase() + ' ' + tr(x.wind) + ' ' + x.ws + ' km/h');
    return parts.join(' · ');
  }

  // ------------------------------------------------------------------
  // Dati
  // ------------------------------------------------------------------
  async function getJSON(u) { const r = await fetch(u + '?v=' + Math.floor(Date.now() / 300000), { cache: 'no-cache' }); if (!r.ok) throw new Error(u); return r.json(); }
  async function load(force) {
    if (!force && SF.fc && Date.now() - SF.loadedAt < 20 * 60000) return;
    const [sp, fc, td] = await Promise.all([getJSON('data/surf_spots.json'), getJSON('data/surf.json'), getJSON('data/tides.json').catch(() => null)]);
    SF.spots = sp.spots; SF.byId = new Map(sp.spots.map((s) => [s.id, s]));
    SF.fc = fc;
    SF.times = fc.times.map((s) => Date.parse(s.replace('Z', ':00Z')));
    SF.tides = td;
    EXT = td ? td.extremes.map((e) => ({ t: Date.parse(e[0].replace('Z', ':00Z')), h: e[1], k: e[2] })) : [];
    SF.loadedAt = Date.now();
    const now = Date.now();
    let best = 0;
    SF.times.forEach((t, i) => { if (Math.abs(t - now) < Math.abs(SF.times[best] - now)) best = i; });
    if (!SF.picked) SF.idx = best;
  }
  async function loadLive() {
    try {
      const { data, error } = await M.sb.functions.invoke('tide-now', { method: 'GET' });
      if (!error && data && data.resid_cm != null) { SF.live = data; drawTide(); if (SF.open) drawCard(); }
    } catch (e) { /* facoltativo */ }
  }

  // ------------------------------------------------------------------
  // Mappa
  // ------------------------------------------------------------------
  function pin(sp) {
    const n = el('div', { class: 'sf-pin', role: 'button', 'aria-label': sp.name }, [el('span', { class: 'sf-arrow' }), el('b', { class: 'sf-num' })]);
    n.addEventListener('click', (e) => { e.stopPropagation(); openCard(sp.id); });
    return n;
  }
  function drawPins() {
    if (!SF.on) { SF.markers.forEach((m) => m.remove()); SF.markers.clear(); return; }
    for (const sp of SF.spots) {
      let m = SF.markers.get(sp.id);
      if (!m) { m = new maplibregl.Marker({ element: pin(sp) }).setLngLat([sp.lng, sp.lat]).addTo(map); SF.markers.set(sp.id, m); }
      const x = rate(sp, SF.idx, SF.level);
      const e = m.getElement();
      e.style.setProperty('--c', color(x && x.r));
      e.querySelector('.sf-num').textContent = x ? fmtR(x.r) : '–';
      const a = e.querySelector('.sf-arrow');
      a.style.transform = 'rotate(' + (((x && x.dir != null ? x.dir : sp.facing) + 180) % 360) + 'deg)';
      e.classList.toggle('dim', !x || x.notYou);
      e.classList.toggle('sel', SF.open === sp.id);
      e.title = sp.name + (x ? ' · ' + fmtR(x.r) + '/5' : '');
    }
  }

  // ------------------------------------------------------------------
  // Pannello surf
  // ------------------------------------------------------------------
  function slots() {
    // solo le ore di luce, raggruppate per giorno
    const out = [];
    SF.times.forEach((t, i) => { if (isDay(t) || i === SF.idx) out.push(i); });
    return out;
  }
  function dayLabel(ms) {
    const k = dayKey(ms), today = dayKey(Date.now()), tom = dayKey(Date.now() + 86400000);
    if (k === today) return tr('today');
    if (k === tom) return tr('tomorrow');
    const s = fmt({ weekday: 'short', day: 'numeric' }).format(ms);
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
  function bestAt(k) {
    let b = null;
    for (const sp of SF.spots) { const x = rate(sp, k, SF.level); if (x && !x.notYou && (!b || x.r > b.r)) b = x; }
    return b;
  }
  function drawTimes() {
    const box = $('sfTimes');
    box.innerHTML = '';
    let lastDay = '';
    for (const i of slots()) {
      const t = SF.times[i];
      const dk = dayKey(t);
      if (dk !== lastDay) { box.appendChild(el('span', { class: 'sf-day', text: dayLabel(t) })); lastDay = dk; }
      const b = bestAt(i);
      const btn = el('button', { class: 'sf-slot' + (i === SF.idx ? ' on' : ''), 'aria-pressed': String(i === SF.idx), onclick: () => pick(i) }, [
        el('span', { class: 'h', text: hh(t) }),
        el('span', { class: 'bar', style: 'background:' + color(b && b.r) + ';height:' + (6 + (b ? b.r : 0) * 4) + 'px' })
      ]);
      box.appendChild(btn);
    }
    const on = box.querySelector('.sf-slot.on');
    if (on) on.scrollIntoView({ block: 'nearest', inline: 'center' });
  }
  function drawTide() {
    const box = $('sfTide');
    if (!box) return;
    box.innerHTML = '';
    const t = SF.times[SF.idx];
    const td = tideAt(t);
    if (!td) return;
    box.append(
      el('span', { class: 'k', text: tr('tide') }),
      el('span', { class: 'v', text: (td.rising ? '↗ ' + tr('rising') : '↘ ' + tr('falling')) }),
      el('span', { class: 'n', text: (td.next.k === 'H' ? tr('high') : tr('low')) + ' ' + hhmm(td.next.t) })
    );
    if (SF.live && Math.abs(Date.now() - t) < 3 * 3600000) {
      const r = SF.live.resid_cm;
      box.appendChild(el('span', { class: 'live', title: SF.live.source }, [el('i'), tr('live') + ': ' + (Math.abs(r) < 4 ? tr('asfc') : r > 0 ? tr('above', { n: r }) : tr('below', { n: -r }))]));
    }
  }
  function drawList() {
    const box = $('sfList');
    box.innerHTML = '';
    const rows = SF.spots.map((sp) => ({ sp, x: rate(sp, SF.idx, SF.level) })).filter((o) => o.x)
      .sort((a, b) => (a.x.notYou - b.x.notYou) || (b.x.r - a.x.r) || (b.x.h - a.x.h));
    rows.slice(0, 6).forEach(({ sp, x }) => {
      box.appendChild(el('button', { class: 'sf-row' + (x.notYou ? ' dim' : ''), onclick: () => openCard(sp.id, true) }, [
        el('span', { class: 'sf-badge', style: '--c:' + color(x.r) }, [fmtR(x.r)]),
        el('span', { class: 'sf-txt' }, [
          el('span', { class: 't', text: sp.name }),
          el('span', { class: 's', text: x.notYou ? tr('notYou') : word(x) + ' · ' + line(x) })
        ])
      ]));
    });
  }
  function drawHead() {
    $('sfTitle').textContent = tr('surf');
    const t = SF.times[SF.idx];
    $('sfSub').textContent = SF.fc ? tr('best') + ' · ' + (Math.abs(t - Date.now()) < 90 * 60000 ? tr('now') : dayLabel(t).toLowerCase() + ' ' + hh(t) + ':00') : tr('loading');
    document.querySelectorAll('#sfLevel button').forEach((b) => { b.textContent = tr('lvl' + b.dataset.lvl); b.classList.toggle('on', Number(b.dataset.lvl) === SF.level); });
    if (SF.fc) {
      const ago = Math.max(1, Math.round((Date.now() - Date.parse(SF.fc.generated.replace('Z', ':00Z'))) / 60000));
      $('sfNote').textContent = tr('updated', { t: tr('ago', { t: ago < 60 ? ago + ' min' : Math.round(ago / 60) + ' h' }) }) + ' · ' + tr('disc');
    }
  }
  function drawAll() {
    if (!SF.on) return;
    drawHead();
    if (!SF.fc) return;
    drawTimes(); drawTide(); drawList(); drawPins();
    if (SF.open) drawCard();
    pad();
  }
  function pick(i) { SF.idx = i; SF.picked = true; drawAll(); }

  // ------------------------------------------------------------------
  // Scheda spot
  // ------------------------------------------------------------------
  function openCard(id, fly) {
    SF.open = id;
    const sp = SF.byId.get(id);
    drawCard();
    $('sfCard').classList.remove('hidden');
    $('sfCard').scrollTop = 0;
    drawPins();
    const ph = Math.min(window.innerHeight * 0.62, $('sfCard').getBoundingClientRect().height || 380);
    if (fly !== false) map.flyTo({ center: [sp.lng, sp.lat], zoom: Math.max(map.getZoom(), 12), duration: 800, padding: { top: 80, bottom: ph, left: 0, right: 0 } });
  }
  function closeCard() { SF.open = null; $('sfCard').classList.add('hidden'); drawPins(); pad(); }

  function stat(k, v, sub) { return el('div', { class: 'p-stat' }, [el('div', { class: 'k', text: k }), el('div', { class: 'v', text: v }), sub ? el('div', { class: 'sf-sub', text: sub }) : null]); }

  function drawCard() {
    const sp = SF.byId.get(SF.open);
    if (!sp) return;
    const box = $('sfCardBody');
    box.innerHTML = '';
    const x = rate(sp, SF.idx, SF.level);
    const t = SF.times[SF.idx];
    box.append(
      el('div', { class: 'p-kicker' }, [sp.zone[lang()] || sp.zone.es, ' · ', tr(sp.type), ' · ', tr(sp.wave)]),
      el('div', { class: 'p-name', text: sp.name })
    );
    if (sp.approx) box.appendChild(el('div', { class: 'p-sub', text: tr('approx') + (sp.go ? ' · ' + tr('boat') : '') }));
    if (x) {
      box.appendChild(el('div', { class: 'sf-score', style: '--c:' + color(x.r) }, [
        el('div', { class: 'big' }, [fmtR(x.r), el('small', { text: '/5' })]),
        el('div', { class: 'txt' }, [
          el('div', { class: 'w', text: x.notYou ? tr('notYou') : word(x) }),
          el('div', { class: 'when', text: dayLabel(t) + ' ' + hhmm(t) + (isDay(t) ? '' : ' · ' + tr('night')) })
        ])
      ]));
      const st = el('div', { class: 'p-stats sf-stats' });
      st.append(
        stat(tr('waves'), num(Math.max(0.1, x.h), 1) + ' m', tr('offsh', { h: num(x.hs, 1) })),
        stat(tr('period'), x.tp ? num(x.tp, 0) + ' s' : '–', x.dir != null ? tr('from', { d: compass(x.dir) }) : ''),
        stat(tr('wind'), x.ws != null ? x.ws + ' km/h' : '–', x.wd != null ? tr(x.wind) + ' · ' + compass(x.wd) : ''),
        stat(tr('tideK'), x.tide ? (x.tide.rising ? '↗' : '↘') : '–', x.tide ? (x.tide.rising ? tr('rising') : tr('falling')) : '')
      );
      box.appendChild(st);
    }
    // 48 ore
    box.appendChild(el('div', { class: 'sf-h', text: tr('next48') }));
    const ch = el('div', { class: 'sf-chart' });
    const start = SF.times.findIndex((tt) => tt >= Date.now() - 90 * 60000);
    const s0 = start < 0 ? 0 : start;
    let lastD = '';
    for (let i = s0; i < SF.times.length && SF.times[i] < SF.times[s0] + 48 * 3600000; i++) {
      const y = rate(sp, i, SF.level);
      const tt = SF.times[i];
      const dk = dayKey(tt);
      const col = el('button', { class: 'col' + (i === SF.idx ? ' on' : '') + (isDay(tt) ? '' : ' night'), onclick: () => pick(i), 'aria-label': hhmm(tt) + ' ' + (y ? fmtR(y.r) : '') }, [
        el('span', { class: 'v', text: y ? num(Math.max(0.1, y.h), 1) : '' }),
        el('span', { class: 'b', style: 'height:' + (4 + (y ? y.r : 0) * 12) + 'px;background:' + color(y && y.r) }),
        el('span', { class: 'h', text: hh(tt) }),
        el('span', { class: 'd', text: dk !== lastD ? dayLabel(tt) : '' })
      ]);
      lastD = dk;
      ch.appendChild(col);
    }
    box.appendChild(ch);
    // giorni
    box.appendChild(el('div', { class: 'sf-h', text: tr('days') }));
    const days = new Map();
    SF.times.forEach((tt, i) => {
      if (!isDay(tt) || tt < Date.now() - 90 * 60000) return;
      const dk = dayKey(tt);
      const y = rate(sp, i, SF.level);
      if (!y) return;
      const d = days.get(dk) || { t: tt, best: null, i: i, hmin: 9, hmax: 0, wsum: 0, n: 0 };
      if (!d.best || y.r > d.best.r) { d.best = y; d.i = i; }
      d.hmin = Math.min(d.hmin, y.h); d.hmax = Math.max(d.hmax, y.h); d.wsum += y.ws || 0; d.n++;
      days.set(dk, d);
    });
    const tb = el('div', { class: 'sf-days' });
    [...days.values()].slice(0, 10).forEach((d) => {
      tb.appendChild(el('button', { class: 'sf-dayrow' + (d.i === SF.idx ? ' on' : ''), onclick: () => pick(d.i) }, [
        el('span', { class: 'dn', text: dayLabel(d.t) }),
        el('span', { class: 'sf-badge sm', style: '--c:' + color(d.best.r) }, [fmtR(d.best.r)]),
        el('span', { class: 'dh', text: num(Math.max(0.1, d.hmin), 1) + '–' + num(Math.max(0.1, d.hmax), 1) + ' m' }),
        el('span', { class: 'dw', text: tr('bestAt', { h: hh(SF.times[d.i]) + ':00' }) })
      ]));
    });
    box.appendChild(tb);
    // maree del giorno
    const dk = dayKey(t);
    const ex = EXT.filter((e) => dayKey(e.t) === dk);
    if (ex.length) {
      box.appendChild(el('div', { class: 'sf-h', text: tr('tides') + ' · ' + dayLabel(t) }));
      const tl = el('div', { class: 'sf-tides' });
      ex.forEach((e) => tl.appendChild(el('span', { class: 'sf-tide-x ' + e.k }, [el('b', { text: e.k === 'H' ? tr('high') : tr('low') }), ' ' + hhmm(e.t)])));
      box.appendChild(tl);
      if (SF.live && dk === dayKey(Date.now())) {
        const r = SF.live.resid_cm;
        box.appendChild(el('div', { class: 'p-note' }, [el('span', { class: 'sf-livedot' }), tr('live') + ' (' + hhmm(Date.parse(SF.live.t)) + '): ' + (SF.live.rising ? tr('rising') : tr('falling')) + ' · ' + (Math.abs(r) < 4 ? tr('asfc') : r > 0 ? tr('above', { n: r }) : tr('below', { n: -r }))]));
      }
    }
    // quando funziona
    box.appendChild(el('div', { class: 'sf-h', text: tr('ideal') }));
    const idl = el('ul', { class: 'sf-ideal' });
    idl.append(
      el('li', { text: tr('swellFrom', { d: compass(sp.win[0]) + '–' + compass(sp.win[1]) }) + ' · ' + num(sp.minH, 1) + '–' + num(sp.maxH, 1) + ' m' }),
      el('li', { text: tr('windFrom', { d: compass(sp.off) }) }),
      el('li', { text: tr('tideBest', { x: tr('t' + sp.tide) }) }),
      el('li', { text: tr('levels', { a: [...new Set([sp.lvl[0], sp.lvl[1]])].map((l) => tr('lvl' + l)).join(' – ') }) })
    );
    box.appendChild(idl);
    box.appendChild(el('p', { class: 'p-desc', text: sp.note[lang()] || sp.note.es }));
    if (sp.haz) box.appendChild(el('p', { class: 'sf-haz' }, [el('b', { text: tr('haz') + ': ' }), sp.haz[lang()] || sp.haz.es]));
    // VAI
    const g = sp.go || [sp.lat, sp.lng];
    const ll = g[0] + ',' + g[1];
    const apps = el('div', { class: 'p-apps' }, [
      el('a', { href: 'https://www.google.com/maps/dir/?api=1&destination=' + ll + '&travelmode=driving', target: '_blank', rel: 'noopener', text: 'Google' }),
      el('a', { href: 'https://waze.com/ul?ll=' + ll + '&navigate=yes', target: '_blank', rel: 'noopener', text: 'Waze' }),
      el('a', { href: 'https://maps.apple.com/?daddr=' + ll + '&dirflg=d', target: '_blank', rel: 'noopener', text: 'Apple' })
    ]);
    const appsBox = el('div', { class: 'hidden' }, [el('div', { class: 'p-note', text: tr('openWith') }), apps]);
    box.append(
      el('div', { class: 'p-actions' }, [el('button', { class: 'p-go', onclick: () => appsBox.classList.toggle('hidden') }, [tr('go')])]),
      appsBox,
      el('div', { class: 'p-note', text: tr('disc') }),
      el('div', { class: 'p-note sf-src', text: tr('src') })
    );
  }

  // ------------------------------------------------------------------
  // Entrare / uscire
  // ------------------------------------------------------------------
  function pad() {
    if (!SF.on) return;
    const h = $('sfSheet').getBoundingClientRect().height;
    map.setPadding({ top: 70, bottom: Math.max(0, Math.min(h, window.innerHeight * 0.6) - 10), left: 0, right: 0 });
  }
  async function setOn(on, quiet) {
    SF.on = on;
    store.set('surfOn', on);
    document.body.classList.toggle('surf-on', on);
    $('surfBtn').classList.toggle('on', on);
    $('surfBtn').setAttribute('aria-pressed', String(on));
    $('sfSheet').classList.toggle('hidden', !on);
    if (!on) { closeCard(); drawPins(); M.padMap(); if (!quiet) M.toast(tr('off')); return; }
    M.closePlace(); M.exitResults(); if (!quiet) M.unfollow();
    if (!quiet) M.toast(tr('on'));
    drawHead(); pad();
    try {
      await load();
      drawAll();
      if (!quiet) map.fitBounds([[-14.52, 28.04], [-13.80, 28.78]], { padding: { top: 16, bottom: 16, left: 24, right: 64 }, duration: 800 });
      loadLive(); setTimeout(loadLive, 5000);
    } catch (e) {
      console.warn('surf', e);
      $('sfSub').textContent = tr('noData');
    }
  }

  // ------------------------------------------------------------------
  // Eventi
  // ------------------------------------------------------------------
  $('surfBtn').addEventListener('click', () => setOn(!SF.on));
  $('sfClose').addEventListener('click', closeCard);
  $('sfToggle').addEventListener('click', () => {
    SF.collapsed = !SF.collapsed; store.set('surfCollapsed', SF.collapsed);
    $('sfSheet').classList.toggle('collapsed', SF.collapsed);
    $('sfToggle').setAttribute('aria-expanded', String(!SF.collapsed));
    setTimeout(pad, 320);
  });
  document.querySelectorAll('#sfLevel button').forEach((b) => b.addEventListener('click', () => { SF.level = Number(b.dataset.lvl); store.set('surfLevel', SF.level); drawAll(); }));
  map.on('click', () => { if (SF.open) closeCard(); });
  window.addEventListener('resize', pad);
  M.onTexts(() => { $('surfBtn').setAttribute('aria-label', tr('surf')); drawAll(); });
  setInterval(() => { if (SF.on) { load(true).then(drawAll).catch(() => {}); loadLive(); } }, 15 * 60000);

  $('sfSheet').classList.toggle('collapsed', SF.collapsed);
  $('surfBtn').setAttribute('aria-label', tr('surf'));
  if (store.get('surfOn', false)) setOn(true, true);
  window.MAXORA_SURF = { rate: (id, k, l) => rate(SF.byId.get(id), k, l || SF.level), state: SF, tideAt };
})();
