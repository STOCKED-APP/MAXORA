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
  const NF = new Map();
  const num = (v, d) => { const k = lang() + d; let f = NF.get(k); if (!f) { f = new Intl.NumberFormat(LOC[lang()], { maximumFractionDigits: d, minimumFractionDigits: d }); NF.set(k, f); } return f.format(v); };
  const compass = (deg) => COMPASS[lang()][Math.round(((deg % 360) + 360) % 360 / 45) % 8];

  // colore per altezza d'onda
  const SCALE = [[0, '#a8dcff'], [0.5, '#62b6ff'], [1, '#22c7b0'], [1.5, '#8fd63a'], [2, '#ffd23a'], [3, '#ff8a3d'], [4, '#ff4d6d']];
  function colorOf(h) { let c = SCALE[0][1]; for (const [v, col] of SCALE) if (h >= v) c = col; return c; }

  // ------------------------------------------------------------------
  // Terraferma: griglia "mare / terra" calcolata una volta dalla sagoma OSM
  // ------------------------------------------------------------------
  const BOX = { w: -14.75, e: -13.55, s: 27.85, n: 28.95 }, RES = 0.004;
    // terraferma esatta: punto-nel-poligono sulla sagoma OSM (con riquadro per andare veloci)
  let polys = null;
  async function loadLand() {
    if (polys) return;
    try {
      const f = await (await fetch('data/land.json', { cache: 'no-cache' })).json();
      const raw = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
      polys = raw.map((rings) => {
        let w = 180, e = -180, s = 90, n = -90;
        rings[0].forEach(([x, y]) => { w = Math.min(w, x); e = Math.max(e, x); s = Math.min(s, y); n = Math.max(n, y); });
        return { rings, w, e, s, n };
      });
    } catch (e) { polys = null; }
  }
  function inRing(lng, lat, ring) {
    let c = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const [xi, yi] = ring[i], [xj, yj] = ring[j];
      if ((yi > lat) !== (yj > lat) && lng < (xj - xi) * (lat - yi) / (yj - yi) + xi) c = !c;
    }
    return c;
  }
  const isLand = (lng, lat) => !!polys && polys.some((p) => lng >= p.w && lng <= p.e && lat >= p.s && lat <= p.n && inRing(lng, lat, p.rings[0]) && !p.rings.slice(1).some((h) => inRing(lng, lat, h)));
  const isSea = (lng, lat) => !!polys && lng > BOX.w && lng < BOX.e && lat > BOX.s && lat < BOX.n && !isLand(lng, lat);

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
  { const mc = map.getCanvas(); mc.parentNode.insertBefore(cv, mc.nextSibling); }   // subito sopra la mappa, sotto pin e fumetti
  const ctx = cv.getContext('2d');
  let raf = 0, on = false, moving = false, dpr = 1;
  function resize() {
    const c = map.getCanvas();
    dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = c.clientWidth * dpr; cv.height = c.clientHeight * dpr;
    cv.style.width = c.clientWidth + 'px'; cv.style.height = c.clientHeight + 'px';
  }
  // Linee di fronte d'onda: una griglia di celle; in ogni cella si disegna il fronte che la attraversa.
  // Celle vicine con la stessa direzione formano linee continue e ordinate che avanzano verso costa.
  const CELL = 58;
  let cells = [], phase = 0, last = 0;
  function buildCells() {
    cells = [];
    const W = cv.width / dpr, H = cv.height / dpr;
    for (let y = CELL / 2; y < H; y += CELL) for (let x = CELL / 2; x < W; x += CELL) {
      const ll = map.unproject([x, y]);
      if (!isSea(ll.lng, ll.lat)) continue;
      const sm = sample(ll.lng, ll.lat);
      if (!sm) continue;
      const a = (sm.dir + 180) * Math.PI / 180;            // verso dove vanno le onde
      cells.push({ x, y, dx: Math.sin(a), dy: -Math.cos(a), hs: sm.hs, tp: sm.tp, col: colorOf(sm.hs), k: 0.28 + Math.random() * 0.16 });   // lunghezze diverse: creste spezzate, naturali
    }
  }
  function segSea(x1, y1, x2, y2) {
    const a = map.unproject([x1, y1]), b = map.unproject([x2, y2]);
    return isSea(a.lng, a.lat) && isSea(b.lng, b.lat);
  }
  function frame(t) {
    raf = 0;
    if (!on || moving || document.hidden) return;
    const dt = last ? Math.min(50, t - last) : 16; last = t;
    phase += dt * 0.012;                                    // avanzamento (px)
    ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.lineCap = 'round';
    const light = document.documentElement.dataset.theme !== 'dark';
    for (const c of cells) {
      const sp = CELL;                                      // distanza tra due fronti
      const speed = 0.6 + c.tp * 0.08;
      const proj = c.x * c.dx + c.y * c.dy;
      let o = ((phase * speed - proj) % sp + sp) % sp; if (o > sp / 2) o -= sp;
      const qx = c.x + c.dx * o, qy = c.y + c.dy * o;
      const L = CELL * c.k, tx = -c.dy * L, ty = c.dx * L;
      if (!c.ok) { c.ok = segSea(c.x - tx, c.y - ty, c.x + tx, c.y + ty) ? 1 : -1; }
      if (c.ok < 0) continue;
      const fade = 1 - Math.abs(o) / (sp / 2) * 0.55;      // più nitida al centro della cella
      ctx.globalAlpha = 0.85 * fade;
      const w = Math.min(5, 1.6 + c.hs * 1.1) * dpr;
      if (light) { ctx.strokeStyle = 'rgba(8,35,70,0.5)'; ctx.lineWidth = w + 2 * dpr; ctx.beginPath(); ctx.moveTo((qx - tx) * dpr, (qy - ty) * dpr); ctx.lineTo((qx + tx) * dpr, (qy + ty) * dpr); ctx.stroke(); }
      ctx.strokeStyle = c.col; ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo((qx - tx) * dpr, (qy - ty) * dpr); ctx.lineTo((qx + tx) * dpr, (qy + ty) * dpr); ctx.stroke();
    }
    ctx.globalAlpha = 1;
    raf = requestAnimationFrame(frame);
  }
  function restart() {
    ctx.clearRect(0, 0, cv.width, cv.height);
    if (!on || !field.length) return;
    buildCells();
    last = 0;
    if (!raf) raf = requestAnimationFrame(frame);
  }
  async function set(v) {
    on = v;
    cv.style.display = 'none';   // animazione tolta (troppo confusa): resta solo "tocca il mare" per i dettagli
    if (!v) { ctx.clearRect(0, 0, cv.width, cv.height); return; }
    await loadLand();
    buildField();
  }
  map.on('movestart', () => { moving = true; ctx.clearRect(0, 0, cv.width, cv.height); });
  map.on('moveend', () => { moving = false; });



  // ------------------------------------------------------------------
  // Tocca il mare: dettagli del punto e spot più vicino
  // ------------------------------------------------------------------
  let pop = null, lastMove = 0, tapT = 0;
  map.on('move', () => { lastMove = Date.now(); });
  map.on('dblclick', () => { clearTimeout(tapT); });
  map.on('click', (e) => {
    if (!on) return;
    if (pop && pop.isOpen()) { pop.remove(); pop = null; return; }          // il tocco chiude il fumetto aperto
    if (Date.now() - lastMove < 500) return;                                // appena spostato o zoomato: niente
    if (e.originalEvent && e.originalEvent.target && e.originalEvent.target.closest && e.originalEvent.target.closest('.maplibregl-marker')) return;
    clearTimeout(tapT);
    tapT = setTimeout(() => showSea(e), 320);                               // aspetta: se è un doppio tocco (zoom) non apre
  });
  function showSea(e) {
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
    pop = new maplibregl.Popup({ closeButton: false, closeOnMove: true, offset: 10, maxWidth: '260px', className: 'wv-popup' }).setLngLat(e.lngLat).setDOMContent(box).addTo(map);
  }

  // legenda (va sotto il consiglio, in alto)
  const legend = el('div', { id: 'wvLegend', class: 'wv-legend' });
  function drawLegend() {
    legend.innerHTML = '';
    legend.append(el('span', { class: 't', text: tr('legend') }), el('span', { class: 'bar' }, SCALE.map(([v, c]) => el('i', { style: 'background:' + c }, [v ? num(v, v % 1 ? 1 : 0) : '0']))));
  }
  drawLegend();
  document.body.appendChild(legend);
  M.onTexts(drawLegend);

  window.MAXORA_WAVES = { set, update: () => { if (on) buildField(); }, legend };
})();
