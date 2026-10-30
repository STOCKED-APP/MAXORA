/* Maxora — radar fissi e tutor (tramo).
   Dati pubblici: OpenStreetMap (data/radars.json, aggiornato ogni notte) + quelli aggiunti dal pannello admin.
   Sulla mappa: cartello col limite. In auto: avviso a voce ~700 m prima e se vai troppo forte. */
(function () {
  'use strict';
  const M = window.MAXORA;
  if (!M) return;
  const { map, sb, el } = M;

  const TX = {
    it: { fixed: 'Autovelox fisso', section_start: 'Inizio tutor', section_end: 'Fine tutor', traffic_light: 'Telecamera semaforo', limit: 'limite {v} km/h', avg: 'media massima {v} km/h', in: 'tra {d}', slow: 'Rallenta', inSection: 'Tutor', sayFixed: 'Autovelox tra {d} metri', saySec: 'Inizio tutor, media massima {v}', sayEnd: 'Fine tutor', sayLimit: ', limite {v}', src: 'Posizione da OpenStreetMap: può non essere aggiornata.', srcAdmin: 'Verificato da Maxora.' },
    es: { fixed: 'Radar fijo', section_start: 'Inicio radar de tramo', section_end: 'Fin radar de tramo', traffic_light: 'Cámara de semáforo', limit: 'límite {v} km/h', avg: 'media máxima {v} km/h', in: 'a {d}', slow: 'Reduce', inSection: 'Tramo', sayFixed: 'Radar fijo a {d} metros', saySec: 'Inicio de radar de tramo, media máxima {v}', sayEnd: 'Fin del radar de tramo', sayLimit: ', límite {v}', src: 'Ubicación de OpenStreetMap: puede no estar actualizada.', srcAdmin: 'Verificado por Maxora.' },
    en: { fixed: 'Speed camera', section_start: 'Average speed check starts', section_end: 'Average speed check ends', traffic_light: 'Red light camera', limit: 'limit {v} km/h', avg: 'average max {v} km/h', in: 'in {d}', slow: 'Slow down', inSection: 'Section', sayFixed: 'Speed camera in {d} metres', saySec: 'Average speed check, max {v}', sayEnd: 'End of average speed check', sayLimit: ', limit {v}', src: 'Location from OpenStreetMap: may be out of date.', srcAdmin: 'Checked by Maxora.' },
    de: { fixed: 'Blitzer', section_start: 'Beginn Abschnittskontrolle', section_end: 'Ende Abschnittskontrolle', traffic_light: 'Rotlichtkamera', limit: 'Limit {v} km/h', avg: 'Schnitt max. {v} km/h', in: 'in {d}', slow: 'Langsamer', inSection: 'Abschnitt', sayFixed: 'Blitzer in {d} Metern', saySec: 'Abschnittskontrolle, Schnitt maximal {v}', sayEnd: 'Ende der Abschnittskontrolle', sayLimit: ', Limit {v}', src: 'Position aus OpenStreetMap: evtl. nicht aktuell.', srcAdmin: 'Von Maxora geprüft.' }
  };
  const tr = (k, v) => ((TX[M.lang()] || TX.es)[k] || k).replace(/\{(\w+)\}/g, (_, x) => (v && v[x] != null ? v[x] : ''));

  const rad = (d) => (d * Math.PI) / 180;
  function bearing(a, b) {
    const y = Math.sin(rad(b.lng - a.lng)) * Math.cos(rad(b.lat));
    const x = Math.cos(rad(a.lat)) * Math.sin(rad(b.lat)) - Math.sin(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.cos(rad(b.lng - a.lng));
    return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
  }
  const adiff = (a, b) => { const d = Math.abs(a - b) % 360; return d > 180 ? 360 - d : d; };

  let list = [];
  const markers = [];

  async function load() {
    if (M.setting && M.setting('radars_enabled', true) === false) return;
    let osm = [], db = [];
    try { const r = await fetch('data/radars.json', { cache: 'no-cache' }); if (r.ok) osm = (await r.json()).radars || []; } catch (e) {}
    try { const { data } = await sb.from('radars').select('*'); db = data || []; } catch (e) {}
    // le righe admin con osm_id correggono (o nascondono) quella di OSM
    const byOsm = new Map(db.filter((x) => x.osm_id).map((x) => [x.osm_id, x]));
    const out = [];
    osm.forEach((r) => { const o = byOsm.get(r.id); if (!o) out.push(Object.assign({ src: 'osm' }, r)); });
    db.forEach((r) => { if (r.active) out.push(Object.assign({ src: 'admin' }, r, { id: 'db-' + r.id })); });
    list = out;
    draw();
  }

  function sign(r, big) {
    const v = r.maxspeed;
    return el('span', { class: 'rd-sign' + (big ? ' big' : '') + (r.kind === 'section_start' || r.kind === 'section_end' ? ' sec' : '') }, [v ? String(v) : '📷']);
  }

  function draw() {
    markers.splice(0).forEach((m) => m.remove());
    list.forEach((r) => {
      const n = el('div', { class: 'rd-mk', role: 'button', 'aria-label': tr(r.kind) }, [el('span', { class: 'rd-cam', text: r.kind === 'traffic_light' ? '🚦' : '📷' }), r.maxspeed ? sign(r) : null]);
      n.addEventListener('click', (e) => { e.stopPropagation(); popup(r); });
      markers.push(new maplibregl.Marker({ element: n }).setLngLat([r.lng, r.lat]).addTo(map));
    });
    zoomCls();
  }
  function zoomCls() { document.body.classList.toggle('rd-far', map.getZoom() < 10.5); }
  map.on('zoomend', zoomCls);

  let pop = null;
  function popup(r) {
    if (pop) pop.remove();
    const lim = r.maxspeed ? (r.kind === 'section_start' || r.kind === 'section_end' ? tr('avg', { v: r.maxspeed }) : tr('limit', { v: r.maxspeed })) : '';
    const box = el('div', { class: 'rd-pop' }, [
      el('div', { class: 'rd-pop-h' }, [sign(r, true), el('div', {}, [el('b', { text: tr(r.kind) }), lim ? el('div', { class: 'rd-pop-l', text: lim }) : null, r.road ? el('div', { class: 'rd-pop-l', text: r.road }) : null])]),
      r.note ? el('div', { class: 'rd-pop-n', text: r.note }) : null,
      el('div', { class: 'rd-pop-s', text: r.src === 'admin' ? tr('srcAdmin') : tr('src') })
    ]);
    pop = new maplibregl.Popup({ closeButton: true, maxWidth: '260px', offset: 16 }).setLngLat([r.lng, r.lat]).setDOMContent(box).addTo(map);
  }

  // ------------------------------------------------------------------
  // Avvisi in auto
  // ------------------------------------------------------------------
  const told = new Map();       // id -> ora dell'ultimo avviso
  let banner = null, bannerFor = null, section = null;

  function showBanner(r, d) {
    hideBanner();
    bannerFor = r;
    banner = el('div', { class: 'rd-alert', role: 'status' }, [sign(r, true), el('div', { class: 'rd-a-t' }, [el('b', { text: tr(r.kind) }), el('span', { class: 'rd-a-d', text: d != null ? tr('in', { d: Math.round(d * 1000 / 50) * 50 + ' m' }) : '' })])]);
    banner.addEventListener('click', hideBanner);
    document.body.appendChild(banner);
    place();
  }
  // sotto l'avviso grande (se c'è), altrimenti in alto
  function place() {
    if (!banner) return;
    const al = document.getElementById('alert');
    const r = al && !al.classList.contains('hidden') ? al.getBoundingClientRect() : null;
    banner.style.top = (r && r.height ? Math.round(r.bottom + 8) : 70) + 'px';
  }
  function hideBanner() { if (banner) banner.remove(); banner = null; bannerFor = null; }

  function sectionPill() {
    let p = document.getElementById('rdSec');
    if (!section) { if (p) p.remove(); return; }
    if (!p) { p = el('div', { id: 'rdSec', class: 'rd-sec' }); document.body.appendChild(p); }
    const kmh = Math.round(M.speed() * 3.6);
    p.classList.toggle('over', !!(section.maxspeed && kmh > section.maxspeed));
    p.textContent = '';
    p.append(el('span', { text: tr('inSection') }), sign(section), el('span', { class: 'rd-kmh', text: kmh + ' km/h' }));
  }

  function tick() {
    const p = M.pos(), sp = M.speed(), h = M.heading();
    if (section && Date.now() - section.at > 20 * 60000) section = null;
    if (!p || !list.length) { sectionPill(); return; }
    const kmh = sp * 3.6;

    // banner già aperto: si aggiorna e si chiude quando l'hai superato
    if (bannerFor) {
      const d = M.distKm(p, bannerFor);
      const ahead = h == null || adiff(bearing(p, bannerFor), h) < 80;
      if (!ahead || d > 1.2) hideBanner();
      else {
        banner.querySelector('.rd-a-d').textContent = tr('in', { d: Math.round(d * 1000 / 50) * 50 + ' m' });
        banner.classList.toggle('over', !!(bannerFor.maxspeed && kmh > bannerFor.maxspeed + 2));
        place();
      }
    }

    if (kmh < 20 || h == null) { sectionPill(); return; }
    let best = null;
    for (const r of list) {
      const d = M.distKm(p, r);
      if (d > 0.8) continue;
      const last = told.get(r.id);
      if (last && Date.now() - last < 10 * 60000) continue;
      if (adiff(bearing(p, r), h) > 35) continue;            // solo se ce l'hai davanti
      if (!best || d < best.d) best = { r, d };
    }
    if (best) {
      const r = best.r;
      told.set(r.id, Date.now());
      if (r.kind === 'section_end') {
        if (section) { section = null; M.say(tr('sayEnd')); }
      } else if (r.kind === 'section_start') {
        section = Object.assign({ at: Date.now() }, r);
        showBanner(r, best.d);
        M.say(tr('saySec', { v: r.maxspeed || '' }));
      } else {
        showBanner(r, best.d);
        M.say(tr('sayFixed', { d: Math.round(best.d * 1000 / 50) * 50 }) + (r.maxspeed ? tr('sayLimit', { v: r.maxspeed }) : ''));
      }
    }
    sectionPill();
  }
  setInterval(tick, 2000);

  load();
  window.MAXORA_RADAR = { reload: load, list: () => list };
})();
