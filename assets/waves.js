/* Maxora — il mare che si muove: in modalità surf le onde previste (ECMWF) scorrono sulla mappa
   nella loro direzione; il colore dice l'altezza, la velocità il periodo. Tocca il mare per i dettagli. */
(function () {
  'use strict';
  const M = window.MAXORA;
  if (!M) return;
  const { map, el } = M;

  const TX = {
    it: { here: 'Il mare qui', from: 'da {d}', energy: 'energia', near: 'Spot più vicino', legend: 'Onde (m) · tocca il mare', fc: 'Previsione ECMWF per l\'ora scelta' },
    es: { here: 'El mar aquí', from: 'del {d}', energy: 'energía', near: 'Spot más cercano', legend: 'Olas (m) · toca el mar', fc: 'Previsión ECMWF para la hora elegida' },
    en: { here: 'The sea here', from: 'from {d}', energy: 'energy', near: 'Nearest spot', legend: 'Waves (m) · tap the sea', fc: 'ECMWF forecast for the chosen time' },
    de: { here: 'Das Meer hier', from: 'aus {d}', energy: 'Energie', near: 'Nächster Spot', legend: 'Wellen (m) · Meer antippen', fc: 'ECMWF-Prognose für die gewählte Zeit' }
  };
  const LOC = { it: 'it-IT', es: 'es-ES', en: 'en-GB', de: 'de-DE' };
  const COMPASS = { es: ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'], it: ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'], en: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'], de: ['N', 'NO', 'O', 'SO', 'S', 'SW', 'W', 'NW'] };
  const lang = () => (TX[M.lang()] ? M.lang() : 'es');
  const tr = (k, v) => { let s = TX[lang()][k]; if (v) Object.keys(v).forEach((x) => { s = s.replace('{' + x + '}', v[x]); }); return s; };
  const num = (v, d) => new Intl.NumberFormat(LOC[lang()], { maximumFractionDigits: d, minimumFractionDigits: d }).format(v);
  const compass = (deg) => COMPASS[lang()][Math.round(((deg % 360) + 360) % 360 / 45) % 8];

  // colore per altezza d'onda
  const SCALE = [[0, '#a8dcff'], [0.5, '#62b6ff'], [1, '#22c7b0'], [1.5, '#8fd63a'], [2, '#ffd23a'], [3, '#ff8a3d'], [4, '#ff4d6d']];
  function colorOf(h) { let c = SCALE[0][1]; for (const [v, col] of SCALE) if (h >= v) c = col; return c; }

  // ------------------------------------------------------------------
  // Terraferma: griglia "mare / terra" calcolata una volta dalla sagoma OSM
  // ------------------------------------------------------------------
  const BOX = { w: -14.75, e: -13.55, s: 27.85, n: 28.95 }, RES = 0.004;
  const NX = Math.ceil((BOX.e - BOX.w) / RES), NY = Math.ceil((BOX.n - BOX.s) / RES);
  let mask = null;   // 1 = terra
  async function loadLand() {
    if (mask) return;
    try {
      const f = await (await fetch('data/land.json', { cache: 'no-cache' })).json();
      const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
      const m = new Uint8Array(NX * NY);
      for (let j = 0; j < NY; j++) {
        const lat = BOX.s + (j + 0.5) * RES;
        for (const poly of polys) for (const ring of poly) {
          const xs = [];
          for (let i = 0, k = ring.length - 1; i < ring.length; k = i++) {
            const [x1, y1] = ring[i], [x2, y2] = ring[k];
            if ((y1 > lat) !== (y2 > lat)) xs.push(x1 + (lat - y1) * (x2 - x1) / (y2 - y1));
          }
          xs.sort((a, b) => a - b);
          for (let q = 0; q + 1 < xs.length; q += 2) {
            const a = Math.max(0, Math.floor((xs[q] - BOX.w) / RES)), b = Math.min(NX - 1, Math.floor((xs[q + 1] - BOX.w) / RES));
            for (let x = a; x <= b; x++) m[j * NX + x] ^= 1;   // anelli interni = buchi
          }
        }
      }
      mask = m;
    } catch (e) { mask = new Uint8Array(NX * NY); }
  }
  const isSea = (lng, lat) => {
    if (lng < BOX.w || lng > BOX.e || lat < BOX.s || lat > BOX.n) return false;
    return !mask || !mask[Math.floor((lat - BOX.s) / RES) * NX + Math.floor((lng - BOX.w) / RES)];
  };

  // ------------------------------------------------------------------
  // Campo d'onda: dai punti del modello davanti agli spot (media pesata con la distanza)
  // ------------------------------------------------------------------
  let field = [];
  function buildField() {
    const S = window.MAXORA_SURF && window.MAXORA_SURF.state;
    field = [];
    if (!S || !S.fc) return;
    const seen = new Set();
    Object.values(S.fc.spots).forEach((d) => {
      const k = d.cell.join(',');
      const hs = d.hs[S.idx], tp = d.tp[S.idx], dir = d.dir[S.idx];
      if (seen.has(k) || hs == null || dir == null) return;
      seen.add(k);
      field.push({ lat: d.cell[0], lng: d.cell[1], hs, tp: tp || 8, u: Math.sin(dir * Math.PI / 180), v: Math.cos(dir * Math.PI / 180) });
    });
  }
  function sample(lng, lat) {
    let w = 0, hs = 0, tp = 0, u = 0, v = 0;
    for (const p of field) {
      const d2 = (p.lat - lat) ** 2 + ((p.lng - lng) * 0.88) ** 2;
      if (d2 > 0.5) continue;
      const k = 1 / (d2 + 0.0004);
      w += k; hs += p.hs * k; tp += p.tp * k; u += p.u * k; v += p.v * k;
    }
    if (!w) return null;
    const dir = (Math.atan2(u, v) * 180 / Math.PI + 360) % 360;
    return { hs: hs / w, tp: tp / w, dir };
  }

  // ------------------------------------------------------------------
  // Animazione
  // ------------------------------------------------------------------
  const cv = el('canvas', { class: 'wv-canvas' });
  map.getCanvasContainer().appendChild(cv);
  const ctx = cv.getContext('2d');
  let parts = [], raf = 0, on = false, moving = false, dpr = 1;
  function resize() {
    const c = map.getCanvas();
    dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = c.clientWidth * dpr; cv.height = c.clientHeight * dpr;
    cv.style.width = c.clientWidth + 'px'; cv.style.height = c.clientHeight + 'px';
  }
  function spawn(p) {
    const W = cv.width / dpr, H = cv.height / dpr;
    for (let t = 0; t < 12; t++) {
      const x = Math.random() * W, y = Math.random() * H;
      const ll = map.unproject([x, y]);
      if (!isSea(ll.lng, ll.lat)) continue;
      const s = sample(ll.lng, ll.lat);
      if (!s) continue;
      const a = (s.dir + 180) * Math.PI / 180;           // le onde vanno verso dir + 180
      const sp = 0.12 + s.tp * 0.022;
      Object.assign(p, { x, y, dx: Math.sin(a) * sp, dy: -Math.cos(a) * sp, age: 0, max: 90 + Math.random() * 90, col: colorOf(s.hs), w: 1.4 + Math.min(1.8, s.hs * 0.6), len: 7 + Math.min(16, s.hs * 6) + Math.random() * 4 });
      return true;
    }
    p.age = p.max = 0;
    return false;
  }
  // ogni particella è una cresta d'onda: un arco perpendicolare alla direzione, che avanza e svanisce
  function frame() {
    raf = 0;
    if (!on || moving || document.hidden) return;
    ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.lineCap = 'round';
    for (const p of parts) {
      if (p.age >= p.max) { spawn(p); continue; }
      p.x += p.dx; p.y += p.dy; p.age++;
      if (p.age % 10 === 0) { const ll = map.unproject([p.x, p.y]); if (!isSea(ll.lng, ll.lat)) { p.age = p.max; continue; } }
      const life = p.age / p.max;
      const fade = Math.sin(Math.PI * life);
      const sp = Math.hypot(p.dx, p.dy) || 1, nx = p.dx / sp, ny = p.dy / sp;   // avanti
      const half = p.len / 2, px = -ny * half, py = nx * half;                     // lungo la cresta
      const bow = p.len * 0.22;
      ctx.globalAlpha = 0.9 * fade;
      ctx.strokeStyle = p.col; ctx.lineWidth = p.w * dpr;
      ctx.beginPath();
      ctx.moveTo((p.x - px - nx * bow * 0.3) * dpr, (p.y - py - ny * bow * 0.3) * dpr);
      ctx.quadraticCurveTo((p.x + nx * bow) * dpr, (p.y + ny * bow) * dpr, (p.x + px - nx * bow * 0.3) * dpr, (p.y + py - ny * bow * 0.3) * dpr);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    raf = requestAnimationFrame(frame);
  }
  function restart() {
    ctx.clearRect(0, 0, cv.width, cv.height);
    if (!on || !field.length) return;
    const n = Math.round(Math.min(500, (cv.width / dpr) * (cv.height / dpr) / 900));
    parts = Array.from({ length: n }, () => { const p = {}; spawn(p); p.age = Math.random() * (p.max || 1); return p; });
    if (!raf) raf = requestAnimationFrame(frame);
  }
  async function set(v) {
    on = v;
    cv.style.display = v ? 'block' : 'none';
    if (!v) { ctx.clearRect(0, 0, cv.width, cv.height); return; }
    await loadLand();
    resize(); buildField(); restart();
  }
  map.on('movestart', () => { moving = true; ctx.clearRect(0, 0, cv.width, cv.height); });
  map.on('moveend', () => { moving = false; if (on) restart(); });
  map.on('resize', () => { if (on) { resize(); restart(); } });
  document.addEventListener('visibilitychange', () => { if (on && !document.hidden) restart(); });

  // ------------------------------------------------------------------
  // Tocca il mare: dettagli del punto e spot più vicino
  // ------------------------------------------------------------------
  let pop = null;
  map.on('click', (e) => {
    if (!on) return;
    const { lng, lat } = e.lngLat;
    if (!isSea(lng, lat)) return;
    const s = sample(lng, lat);
    if (!s) return;
    const S = window.MAXORA_SURF.state;
    let best = null;
    for (const sp of S.spots) { const d = M.distKm({ lat, lng }, sp); if (!best || d < best.d) best = { sp, d }; }
    const r = best && window.MAXORA_SURF.rate(best.sp.id, S.idx);
    const kj = Math.round(1025 * 9.81 * 9.81 * s.hs * s.hs * s.tp * s.tp / (16 * Math.PI) / 1000);
    const box = el('div', { class: 'wv-pop' }, [
      el('div', { class: 'k', text: tr('here') }),
      el('div', { class: 'big' }, [el('span', { class: 'dot', style: 'background:' + colorOf(s.hs) }), num(s.hs, 1) + ' m · ' + num(s.tp, 0) + ' s']),
      el('div', { class: 's', text: tr('from', { d: compass(s.dir) }) + ' · ' + tr('energy') + ' ' + kj + ' kJ' }),
      best ? el('button', { class: 'go', onclick: () => { if (pop) pop.remove(); window.MAXORA_SURF.openCard(best.sp.id); } }, [
        el('span', { text: tr('near') + ': ' }), el('b', { text: best.sp.name }), r ? el('span', { text: ' · ★ ' + num(r.r, r.r % 1 ? 1 : 0) }) : null, el('span', { text: ' ›' })
      ]) : null,
      el('div', { class: 'n', text: tr('fc') })
    ]);
    if (pop) pop.remove();
    pop = new maplibregl.Popup({ closeButton: false, offset: 10, maxWidth: '260px', className: 'wv-popup' }).setLngLat(e.lngLat).setDOMContent(box).addTo(map);
  });

  // legenda (va sotto il consiglio, in alto)
  const legend = el('div', { id: 'wvLegend', class: 'wv-legend' });
  function drawLegend() {
    legend.innerHTML = '';
    legend.append(el('span', { class: 't', text: tr('legend') }), el('span', { class: 'bar' }, SCALE.map(([v, c]) => el('i', { style: 'background:' + c }, [v ? num(v, v % 1 ? 1 : 0) : '0']))));
  }
  drawLegend();
  document.body.appendChild(legend);
  M.onTexts(drawLegend);

  window.MAXORA_WAVES = { set, update: () => { if (on) { buildField(); restart(); } }, legend };
})();
