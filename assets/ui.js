/* Maxora — interfaccia "mappa libera" per le modalità (surf, bici, corsa, camper):
   in alto il consiglio (si apre verso il basso), a destra le scelte, in basso orari e una fila di schede da scorrere.
   La lista completa resta disponibile con "Vedi tutti". I moduli registrano i loro pezzi; qui si dispongono. */
(function () {
  'use strict';
  const M = window.MAXORA;
  if (!M) return;
  const { map, el } = M;
  const $ = (id) => document.getElementById(id);

  const TX = { it: { all: 'Vedi tutti', list: 'Lista', map: 'Mappa' }, es: { all: 'Ver todos', list: 'Lista', map: 'Mapa' }, en: { all: 'See all', list: 'List', map: 'Map' }, de: { all: 'Alle zeigen', list: 'Liste', map: 'Karte' } };
  const tr = (k) => (TX[M.lang()] || TX.es)[k];

  const top = el('div', { id: 'uiTop', class: 'ui-top hidden' });
  const rail = el('div', { id: 'uiRail', class: 'ui-rail hidden' });
  // maniglia: tocca o trascina in su per aprire la lista completa
  const grab = el('button', { class: 'ui-grab', 'aria-label': 'Lista' }, [el('i'), el('span', { id: 'uiGrabL' })]);
  const bottom = el('div', { id: 'uiBottom', class: 'ui-bottom hidden' }, [grab, el('div', { id: 'uiTime', class: 'ui-time' }), el('div', { id: 'uiCards', class: 'ui-cards' })]);
  document.body.append(top, rail, bottom);
  grab.addEventListener('click', () => showList());
  let y0 = null;
  bottom.addEventListener('touchstart', (e) => { y0 = e.touches[0].clientY; }, { passive: true });
  bottom.addEventListener('touchend', (e) => { if (y0 != null && e.changedTouches[0].clientY - y0 < -45) showList(); y0 = null; }, { passive: true });
  const back = el('button', { class: 'ui-back', onclick: () => hideList() }, ['🗺 ']);
  document.body.appendChild(back);

  const REG = {};        // mode -> { top: () => [nodes], rail: () => [items], time: () => node, sheet: id }
  const stash = [];      // nodi spostati: [node, placeholder]
  let cur = null;

  function adopt(node, into) {
    if (!node) return;
    if (!node.__ph) { const ph = document.createComment('ui'); node.parentNode && node.parentNode.insertBefore(ph, node); node.__ph = ph; stash.push(node); }
    into.appendChild(node);
  }
  function restore() {
    while (stash.length) { const n = stash.pop(); if (n.__ph && n.__ph.parentNode) { n.__ph.parentNode.insertBefore(n, n.__ph); n.__ph.remove(); } n.__ph = null; }
  }

  function mode(k) {
    if (k === cur) { drawRail(); return; }
    restore();
    top.innerHTML = ''; rail.innerHTML = ''; $('uiTime').innerHTML = ''; $('uiCards').innerHTML = '';
    document.body.classList.remove('ui-compact', 'ui-list');
    cur = k;
    const R = REG[k];
    [top, rail, bottom].forEach((n) => n.classList.toggle('hidden', !R));
    if (!R) return;
    document.body.classList.add('ui-compact');
    (R.top ? R.top() : []).forEach((n) => adopt(n, top));
    const t = R.time && R.time();
    $('uiTime').classList.toggle('hidden', !t);
    if (t) adopt(t, $('uiTime'));
    drawRail();
    if (R.refresh) setTimeout(R.refresh, 0);
    setTimeout(pad, 50);
  }

  // ------------------------------------------------------------------
  // Pulsanti a destra (anche con scelta multipla a comparsa)
  // ------------------------------------------------------------------
  let pop = null;
  function closePop() { if (pop) { pop.remove(); pop = null; } }
  function drawRail() {
    rail.innerHTML = '';
    const R = REG[cur];
    if (!R || !R.rail) return;
    R.rail().filter(Boolean).forEach((it) => {
      const b = el('button', { class: 'ui-rb' + (it.on ? ' on' : ''), 'aria-label': it.label, title: it.label }, [el('span', { class: 'i', text: it.icon }), el('span', { class: 'l', text: it.short || it.label })]);
      b.addEventListener('click', (e) => {
        e.stopPropagation();
        if (it.choices) {
          if (pop) { closePop(); return; }
          pop = el('div', { class: 'ui-pop' }, it.choices.map((c) => el('button', { class: c.on ? 'on' : '', onclick: (ev) => { ev.stopPropagation(); closePop(); c.onclick(); drawRail(); } }, [c.label])));
          const r = b.getBoundingClientRect();
          pop.style.top = r.top + 'px'; pop.style.right = (window.innerWidth - r.left + 8) + 'px';
          document.body.appendChild(pop);
        } else { it.onclick(); drawRail(); }
      });
      rail.appendChild(b);
    });
  }
  document.addEventListener('click', closePop);

  // ------------------------------------------------------------------
  // Fila di schede in basso: scorri = la mappa va lì; tocca = apri
  // ------------------------------------------------------------------
  let focusT, lastFocus = null, lastKey = '';
  function cards(k, items, total) {
    if (k !== cur) return;
    const box = $('uiCards');
    const key = items.map((x) => x.id).join('|');
    const keep = key === lastKey ? box.scrollLeft : 0;
    lastKey = key;
    box.innerHTML = '';
    items.forEach((x) => {
      const c = el('button', { class: 'uc', 'data-id': x.id, onclick: () => x.onOpen() }, [
        el('span', { class: 'uc-badge', style: '--c:' + (x.color || 'var(--mode)') }, [].concat(x.badge || '')),
        el('span', { class: 'uc-txt' }, [el('span', { class: 'uc-t', text: x.title }), el('span', { class: 'uc-s', style: x.subColor ? 'color:' + x.subColor : '' }, [x.sub || ''])]),
        x.right ? el('span', { class: 'uc-r', text: x.right }) : null
      ]);
      c.__item = x;
      box.appendChild(c);
    });
    if (REG[cur] && REG[cur].sheet) box.appendChild(el('button', { class: 'uc uc-all', onclick: showList }, ['☰ ' + tr('all') + (total ? ' (' + total + ')' : '')]));
    $('uiGrabL').textContent = tr('all') + (total ? ' (' + total + ')' : '');
    grab.classList.toggle('hidden', !(REG[cur] && REG[cur].sheet));
    // la scheda descritta dalla barra orari resta evidenziata
    const fid = lastFocus && items.some((x) => x.id === lastFocus) ? lastFocus : items[0] && items[0].id;
    box.querySelectorAll('.uc[data-id]').forEach((c) => c.classList.toggle('f', c.dataset.id === String(fid)));
    box.scrollLeft = keep;
    setTimeout(pad, 30);
  }
  $('uiCards').addEventListener('scroll', () => {
    clearTimeout(focusT);
    focusT = setTimeout(() => {
      const box = $('uiCards'), mid = box.getBoundingClientRect().left + 24;
      let best = null;
      box.querySelectorAll('.uc[data-id]').forEach((c) => { const d = Math.abs(c.getBoundingClientRect().left - mid); if (!best || d < best.d) best = { d, c }; });
      if (!best || !best.c.__item || best.c.__item.id === lastFocus) return;
      lastFocus = best.c.__item.id;
      box.querySelectorAll('.uc.f').forEach((c) => c.classList.remove('f'));
      best.c.classList.add('f');
      if (best.c.__item.onFocus) best.c.__item.onFocus();
    }, 180);
  }, { passive: true });

  // ------------------------------------------------------------------
  // Lista completa (il pannello della modalità) e ritorno alla mappa
  // ------------------------------------------------------------------
  function showList() {
    const R = REG[cur]; if (!R || !R.sheet) return;
    const s = $(R.sheet);
    s.classList.remove('collapsed');
    back.textContent = '🗺 ' + tr('map');
    document.body.classList.add('ui-list');
  }
  function hideList() { document.body.classList.remove('ui-list'); setTimeout(pad, 50); }
  document.addEventListener('click', (e) => {
    if (!document.body.classList.contains('ui-list')) return;
    const h = e.target.closest && e.target.closest('.sheet-handle');
    if (h) { e.stopPropagation(); e.preventDefault(); hideList(); }
  }, true);

  // ------------------------------------------------------------------
  // Margini della mappa: niente sotto il consiglio e sotto le schede
  // ------------------------------------------------------------------
  function pad() {
    if (!cur || !REG[cur] || document.body.classList.contains('ui-list')) return;
    const t = top.getBoundingClientRect(), b = bottom.getBoundingClientRect();
    const topPx = Math.min(window.innerHeight * 0.35, Math.round((t.height ? t.top + Math.min(t.height, 70) : 140) + 10));
    const botPx = Math.round(b.height ? window.innerHeight - b.top + 8 : 0);
    const p = map.getPadding();
    if (Math.abs((p.top || 0) - topPx) < 6 && Math.abs((p.bottom || 0) - botPx) < 6) return;
    if (map.isMoving()) { map.once('moveend', pad); return; }
    map.setPadding({ top: topPx, bottom: botPx, left: 0, right: 64 });
  }
  window.addEventListener('resize', pad);
  new ResizeObserver(() => pad()).observe(bottom);

  // la mappa si centra sull'elemento, tenendo conto dei margini
  function focusOn(lng, lat, zoom) { map.easeTo({ center: [lng, lat], zoom: zoom ? Math.max(map.getZoom(), zoom) : map.getZoom(), duration: 600 }); }

  window.MAXORA_UI = { register: (k, R) => { REG[k] = R; }, mode, cards, rail: drawRail, pad, focusOn, compact: () => !!(cur && REG[cur]), current: () => cur, showList, hideList };
})();
