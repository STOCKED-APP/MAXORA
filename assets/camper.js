/* Maxora — modalità camper, semplice: 4 bisogni (Dormire · Acqua e scarico · Benzina · Docce e bagni),
   una lista per distanza e una scheda chiara. Regole di sosta e aree protette sempre visibili. */
(function () {
  'use strict';
  const M = window.MAXORA;
  if (!M) return;
  const { map, sb, el, store } = M;
  const $ = (id) => document.getElementById(id);

  const TX = {
    it: {
      title: 'Camper', near: 'Vicino a te', nearMap: 'Vicino al centro mappa', loading: 'Carico…', none: 'Niente qui intorno.', more: 'Mostra altri',
      t_sleep: 'Dormire', t_water: 'Acqua e scarico', t_fuel: 'Benzina', t_wash: 'Docce e bagni',
      st_ok: 'Si può dormire nel veicolo', st_warn: 'Possibili divieti: guarda i cartelli', st_prot: 'Area protetta: niente pernottamento', st_camp: 'Campeggio: serve permesso, stagionale', st_check: 'Da verificare sul posto',
      n_sleep: 'Sosta', n_service: 'Area camper', n_camp: 'Zona campeggio', n_dump: 'Punto di scarico', n_water: 'Fontanella', n_fuel: 'Distributore', n_shower: 'Doccia pubblica', n_toilets: 'Bagni pubblici', n_gym: 'Palestra', n_laundry: 'Lavanderia',
      has_dump: 'scarico', has_water: 'acqua', cheapest: 'il più economico vicino', perL: '€/L',
      rulesLabel: 'Regole di sosta', rulesV: 'Dormire nel camper sì · campeggiare no', inProt: 'Sei in un\'area protetta: qui non si pernotta',
      r1: 'Dormire nel veicolo è permesso se è parcheggiato correttamente', r2: 'Niente fuori dal mezzo: tendalino, sedie, tavoli, piedini = campeggio (vietato)', r3: 'Niente scarichi a terra: usa i punti di scarico',
      r4: 'Aree protette (verde tratteggiato sulla mappa): niente pernottamento', r5: 'I Comuni possono vietare la sosta notturna: rispetta i cartelli', r6: 'Nuovo decreto delle Canarie in arrivo: aree camper fino a 72 h',
      rulesSrc: 'Fonti: DGT, Governo delle Canarie (decreto in approvazione), Cabildo. Ottobre 2026.',
      k_dist: 'Distanza', k_price: 'Prezzo', k_serv: 'Servizi', k_hours: 'Orari', k_near: 'Vicino', k_src: 'Fonte', approx: 'posizione indicativa', upd: 'aggiornato {d}',
      s_dump: 'scarico', s_water: 'acqua', s_power: 'corrente', s_shower: 'doccia', s_wc: 'bagno', s_wifi: 'wifi', s_laundry: 'lavatrice', s_overnight: 'si dorme', s_trash: 'rifiuti',
      free: 'gratis', paid: 'a pagamento', hot: 'acqua calda', cold: 'acqua fredda', customers: 'solo clienti', go: 'VAI', openWith: 'Apri navigazione con',
      nearWater: 'Acqua/scarico più vicino', nearFuel: 'Benzina più vicina', osm: 'Dati: Maxora, OpenStreetMap (ODbL), Ministerio (prezzi). Le regole cambiano: guarda sempre i cartelli.'
    },
    es: {
      title: 'Camper', near: 'Cerca de ti', nearMap: 'Cerca del centro del mapa', loading: 'Cargando…', none: 'Nada por aquí.', more: 'Ver más',
      t_sleep: 'Dormir', t_water: 'Agua y vaciado', t_fuel: 'Gasolina', t_wash: 'Duchas y baños',
      st_ok: 'Se puede dormir en el vehículo', st_warn: 'Posibles prohibiciones: mira las señales', st_prot: 'Espacio protegido: no se pernocta', st_camp: 'Acampada: con permiso, de temporada', st_check: 'Comprobar en el sitio',
      n_sleep: 'Pernocta', n_service: 'Área camper', n_camp: 'Zona de acampada', n_dump: 'Punto de vaciado', n_water: 'Fuente', n_fuel: 'Gasolinera', n_shower: 'Ducha pública', n_toilets: 'Baños públicos', n_gym: 'Gimnasio', n_laundry: 'Lavandería',
      has_dump: 'vaciado', has_water: 'agua', cheapest: 'la más barata cerca', perL: '€/L',
      rulesLabel: 'Normas de pernocta', rulesV: 'Dormir en el camper sí · acampar no', inProt: 'Estás en un espacio protegido: aquí no se pernocta',
      r1: 'Dormir dentro del vehículo está permitido si está bien estacionado', r2: 'Nada fuera del vehículo: toldo, sillas, mesas, patas = acampada (prohibida)', r3: 'Nada de vertidos: usa los puntos de vaciado',
      r4: 'Espacios protegidos (verde discontinuo en el mapa): no se pernocta', r5: 'Los ayuntamientos pueden prohibir la pernocta: respeta las señales', r6: 'Nuevo decreto canario en camino: áreas camper hasta 72 h',
      rulesSrc: 'Fuentes: DGT, Gobierno de Canarias (decreto en tramitación), Cabildo. Octubre 2026.',
      k_dist: 'Distancia', k_price: 'Precio', k_serv: 'Servicios', k_hours: 'Horario', k_near: 'Cerca', k_src: 'Fuente', approx: 'posición aproximada', upd: 'actualizado {d}',
      s_dump: 'vaciado', s_water: 'agua', s_power: 'luz', s_shower: 'ducha', s_wc: 'baño', s_wifi: 'wifi', s_laundry: 'lavadora', s_overnight: 'se pernocta', s_trash: 'basura',
      free: 'gratis', paid: 'de pago', hot: 'agua caliente', cold: 'agua fría', customers: 'solo clientes', go: 'IR', openWith: 'Abrir navegación con',
      nearWater: 'Agua/vaciado más cerca', nearFuel: 'Gasolinera más cerca', osm: 'Datos: Maxora, OpenStreetMap (ODbL), Ministerio (precios). Las normas cambian: mira siempre las señales.'
    },
    en: {
      title: 'Camper', near: 'Near you', nearMap: 'Near map centre', loading: 'Loading…', none: 'Nothing around here.', more: 'Show more',
      t_sleep: 'Sleep', t_water: 'Water & dump', t_fuel: 'Fuel', t_wash: 'Showers & WC',
      st_ok: 'You can sleep in the vehicle', st_warn: 'Possible bans: check the signs', st_prot: 'Protected area: no overnight stay', st_camp: 'Camping: permit needed, seasonal', st_check: 'Check on site',
      n_sleep: 'Overnight spot', n_service: 'Camper area', n_camp: 'Camping area', n_dump: 'Dump station', n_water: 'Water tap', n_fuel: 'Petrol station', n_shower: 'Public shower', n_toilets: 'Public toilets', n_gym: 'Gym', n_laundry: 'Laundry',
      has_dump: 'dump', has_water: 'water', cheapest: 'cheapest nearby', perL: '€/L',
      rulesLabel: 'Overnight rules', rulesV: 'Sleeping in the van yes · camping no', inProt: 'You are in a protected area: no overnight stays here',
      r1: 'Sleeping inside the vehicle is allowed if it is parked correctly', r2: 'Nothing outside: awning, chairs, tables, jacks = camping (banned)', r3: 'No discharges: use dump stations',
      r4: 'Protected areas (dashed green on the map): no overnight stays', r5: 'Councils may ban overnight parking: follow the signs', r6: 'New Canary Islands decree coming: camper areas up to 72 h',
      rulesSrc: 'Sources: DGT, Canary Islands Government (decree pending), Cabildo. October 2026.',
      k_dist: 'Distance', k_price: 'Price', k_serv: 'Services', k_hours: 'Hours', k_near: 'Nearby', k_src: 'Source', approx: 'approximate position', upd: 'updated {d}',
      s_dump: 'dump', s_water: 'water', s_power: 'power', s_shower: 'shower', s_wc: 'toilet', s_wifi: 'wifi', s_laundry: 'washing machine', s_overnight: 'overnight ok', s_trash: 'bins',
      free: 'free', paid: 'paid', hot: 'hot water', cold: 'cold water', customers: 'customers only', go: 'GO', openWith: 'Navigate with',
      nearWater: 'Nearest water/dump', nearFuel: 'Nearest fuel', osm: 'Data: Maxora, OpenStreetMap (ODbL), Spanish Ministry (prices). Rules change: always check the signs.'
    },
    de: {
      title: 'Camper', near: 'In deiner Nähe', nearMap: 'Nahe Kartenmitte', loading: 'Lade…', none: 'Nichts in der Nähe.', more: 'Mehr zeigen',
      t_sleep: 'Schlafen', t_water: 'Wasser & Entsorgung', t_fuel: 'Tanken', t_wash: 'Duschen & WC',
      st_ok: 'Schlafen im Fahrzeug erlaubt', st_warn: 'Mögliche Verbote: Schilder beachten', st_prot: 'Schutzgebiet: keine Übernachtung', st_camp: 'Camping: mit Genehmigung, saisonal', st_check: 'Vor Ort prüfen',
      n_sleep: 'Stellplatz', n_service: 'Wohnmobilplatz', n_camp: 'Zeltplatz', n_dump: 'Entsorgungsstation', n_water: 'Wasserstelle', n_fuel: 'Tankstelle', n_shower: 'Öffentliche Dusche', n_toilets: 'Öffentliche Toiletten', n_gym: 'Fitnessstudio', n_laundry: 'Waschsalon',
      has_dump: 'Entsorgung', has_water: 'Wasser', cheapest: 'am günstigsten in der Nähe', perL: '€/L',
      rulesLabel: 'Übernachtungsregeln', rulesV: 'Im Camper schlafen ja · campen nein', inProt: 'Du bist in einem Schutzgebiet: hier nicht übernachten',
      r1: 'Im Fahrzeug schlafen ist erlaubt, wenn es korrekt geparkt ist', r2: 'Nichts nach draußen: Markise, Stühle, Tische, Stützen = Camping (verboten)', r3: 'Nichts ablassen: Entsorgungsstationen nutzen',
      r4: 'Schutzgebiete (grün gestrichelt): keine Übernachtung', r5: 'Gemeinden können das Übernachten verbieten: Schilder beachten', r6: 'Neues Kanaren-Dekret kommt: Wohnmobilplätze bis 72 h',
      rulesSrc: 'Quellen: DGT, Regierung der Kanaren (Dekret in Arbeit), Cabildo. Oktober 2026.',
      k_dist: 'Entfernung', k_price: 'Preis', k_serv: 'Service', k_hours: 'Zeiten', k_near: 'In der Nähe', k_src: 'Quelle', approx: 'ungefähre Position', upd: 'Stand {d}',
      s_dump: 'Entsorgung', s_water: 'Wasser', s_power: 'Strom', s_shower: 'Dusche', s_wc: 'WC', s_wifi: 'WLAN', s_laundry: 'Waschmaschine', s_overnight: 'Übernachten ok', s_trash: 'Müll',
      free: 'kostenlos', paid: 'kostenpflichtig', hot: 'Warmwasser', cold: 'Kaltwasser', customers: 'nur Kunden', go: 'LOS', openWith: 'Navigieren mit',
      nearWater: 'Nächstes Wasser/Entsorgung', nearFuel: 'Nächste Tankstelle', osm: 'Daten: Maxora, OpenStreetMap (ODbL), span. Ministerium (Preise). Regeln ändern sich: Schilder beachten.'
    }
  };
  const LOC = { it: 'it-IT', es: 'es-ES', en: 'en-GB', de: 'de-DE' };
  const lang = () => (TX[M.lang()] ? M.lang() : 'es');
  const tr = (k, v) => { let s = TX[lang()][k] || TX.es[k] || k; if (v) Object.keys(v).forEach((x) => { s = s.replace('{' + x + '}', v[x]); }); return s; };
  const num = (v, d) => new Intl.NumberFormat(LOC[lang()], { maximumFractionDigits: d, minimumFractionDigits: d }).format(v);
  const fmtD = (km) => (km < 1 ? Math.max(10, Math.round(km * 100) * 10) + ' m' : num(km, km < 10 ? 1 : 0) + ' km');

  const TABS = [['sleep', '🛏'], ['water', '🚰'], ['fuel', '⛽'], ['wash', '🚿']];
  const ICON = { sleep: '🚐', service: '🚐', camp: '⛺', dump: '🚽', water: '💧', fuel: '⛽', shower: '🚿', toilets: '🚻', gym: '🏋️', laundry: '🧺' };
  const STC = { ok: '#2f9e5b', warn: '#e59a12', prot: '#e5484d', camp: '#8b5cf6', check: '#64748b' };
  const STI = { ok: '✅', warn: '⚠️', prot: '⛔', camp: '⛺', check: 'ℹ️' };
  const CP = { on: false, items: [], prot: null, fuel: null, tab: store.get('cpTab', 'sleep'), shown: 8, open: null, collapsed: store.get('cpCollapsed', false), loaded: false };

  // ------------------------------------------------------------------
  // Dati: punti Maxora (verificati dalle fonti) + OpenStreetMap + prezzi ufficiali
  // ------------------------------------------------------------------
  const getJSON = (u) => fetch(u + '?v=' + Math.floor(Date.now() / 1800000), { cache: 'no-cache' }).then((r) => (r.ok ? r.json() : null)).catch(() => null);
  async function load() {
    if (CP.loaded) return;
    const [pois, prot, fuel, spots] = await Promise.all([getJSON('data/pois.json'), getJSON('data/protected.json'), getJSON('data/fuel.json'),
      sb.from('camper_spots').select('*').then((r) => r.data || [], () => [])]);
    CP.prot = prot; CP.fuel = fuel;
    const C = (pois && pois.cats) || {};
    const it = [];
    const close = (tab, lat, lng, km) => it.some((x) => x.tab === tab && M.distKm(x, { lat, lng }) < km);
    // Maxora
    spots.forEach((s) => {
      const sv = s.services || [];
      const base = { id: 's' + s.id, name: s.name, lat: s.lat, lng: s.lng, spot: s, tags: {} };
      if (['sleep', 'service', 'camp'].includes(s.kind)) it.push(Object.assign({}, base, { tab: 'sleep', type: s.kind }));
      if (s.kind === 'dump' || s.kind === 'water' || sv.includes('dump') || sv.includes('water')) it.push(Object.assign({}, base, { id: base.id + 'w', tab: 'water', type: sv.includes('dump') || s.kind === 'dump' ? 'dump' : 'water', dump: sv.includes('dump') || s.kind === 'dump', water: sv.includes('water') || s.kind === 'water' }));
      if (s.kind === 'shower' || sv.includes('shower')) it.push(Object.assign({}, base, { id: base.id + 's', tab: 'wash', type: 'shower' }));
    });
    // OpenStreetMap
    (C.camp || []).forEach((r) => { const t = r[4] || {}; if (t['disused:tourism'] || /not active|abandon|closed|cerrad/i.test(t.description || '')) return; if (!close('sleep', r[2], r[3], 0.4)) it.push({ id: 'o' + r[0], tab: 'sleep', type: 'service', name: r[1], lat: r[2], lng: r[3], tags: t, osm: true }); });
    (C.dump || []).forEach((r) => { if (!close('water', r[2], r[3], 0.15)) it.push({ id: 'o' + r[0], tab: 'water', type: 'dump', dump: true, name: r[1], lat: r[2], lng: r[3], tags: r[4] || {}, osm: true }); });
    (C.water || []).forEach((r) => { if (!close('water', r[2], r[3], 0.05)) it.push({ id: 'o' + r[0], tab: 'water', type: 'water', water: true, name: r[1], lat: r[2], lng: r[3], tags: r[4] || {}, osm: true }); });
    (C.shower || []).forEach((r) => it.push({ id: 'o' + r[0], tab: 'wash', type: 'shower', name: r[1], lat: r[2], lng: r[3], tags: r[4] || {}, osm: true }));
    (C.toilets || []).forEach((r) => it.push({ id: 'o' + r[0], tab: 'wash', type: 'toilets', name: r[1], lat: r[2], lng: r[3], tags: r[4] || {}, osm: true }));
    (C.gym || []).forEach((r) => { if (!close('wash', r[2], r[3], 0.02)) it.push({ id: 'o' + r[0], tab: 'wash', type: 'gym', name: r[1], lat: r[2], lng: r[3], tags: r[4] || {}, osm: true }); });
    (C.laundry || []).forEach((r) => it.push({ id: 'o' + r[0], tab: 'wash', type: 'laundry', name: r[1], lat: r[2], lng: r[3], tags: r[4] || {}, osm: true }));
    // benzinai con prezzo ufficiale
    ((fuel && fuel.stations) || []).forEach((s) => it.push({ id: 'f' + s.id, tab: 'fuel', type: 'fuel', name: s.name, sub: s.town, lat: s.lat, lng: s.lng, tags: { opening_hours: s.hours }, fuel: s }));
    it.forEach((x) => { if (x.tab === 'sleep') x.st = status(x); });
    CP.items = it;
    CP.loaded = true;
  }

  // dentro un'area protetta?
  function inRing(pt, ring) {
    let c = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const [xi, yi] = ring[i], [xj, yj] = ring[j];
      if ((yi > pt.lat) !== (yj > pt.lat) && pt.lng < (xj - xi) * (pt.lat - yi) / (yj - yi) + xi) c = !c;
    }
    return c;
  }
  function protOf(pt) {
    if (!CP.prot) return null;
    for (const f of CP.prot.features) {
      const g = f.geometry, polys = g.type === 'Polygon' ? [g.coordinates] : g.type === 'MultiPolygon' ? g.coordinates : [];
      for (const p of polys) if (inRing(pt, p[0]) && !p.slice(1).some((h) => inRing(pt, h))) return f.properties.name;
    }
    return null;
  }
  function status(x) {
    x.protName = protOf(x);
    if (x.protName) return 'prot';
    const sv = (x.spot && x.spot.services) || [];
    if (x.type === 'camp') return 'camp';
    if (sv.includes('warn')) return 'warn';
    if (sv.includes('overnight') || (x.spot && x.type === 'service')) return 'ok';
    return 'check';
  }
  const fuelKind = () => { const c = store.get('car', {}); return c && c.f && c.f !== 'glp' ? c.f : 'g95'; };
  const ref = () => { const p = M.pos(); if (p) return { lat: p.lat, lng: p.lng, gps: true }; const c = map.getCenter(); return { lat: c.lat, lng: c.lng, gps: false }; };
  const nameOf = (x) => x.name || tr('n_' + x.type);
  const txt = (s) => s && s.text && (s.text[lang()] || s.text.es || Object.values(s.text)[0]);

  // ------------------------------------------------------------------
  // Pannello
  // ------------------------------------------------------------------
  let sheet, card;
  function build() {
    if (sheet) return;
    sheet = el('section', { id: 'cpSheet', class: 'sheet sp-sheet cp-sheet hidden' }, [
      el('button', { class: 'sheet-handle', id: 'cpToggle', 'aria-expanded': 'true', onclick: toggle }, [el('span', { class: 'grip' }), el('span', { class: 'sh-title', id: 'cpTitle' }), el('span', { class: 'sh-sub', id: 'cpSub' })]),
      el('div', { class: 'sheet-body', id: 'cpBody' }, [el('div', { class: 'cp-tabs', id: 'cpTabs', role: 'tablist' }), el('div', { class: 'adv', id: 'cpRules' }), el('div', { class: 'sf-list', id: 'cpList' }), el('p', { class: 'sf-note', id: 'cpNote' })])
    ]);
    card = el('section', { id: 'cpCard', class: 'place sf-card sp-card hidden', 'aria-live': 'polite' }, [el('button', { class: 'icon-btn place-close', 'aria-label': '✕', onclick: closeCard, text: '✕' }), el('div', { id: 'cpCardBody' })]);
    document.body.append(sheet, card);
  }
  function toggle() {
    CP.collapsed = !CP.collapsed; store.set('cpCollapsed', CP.collapsed);
    sheet.classList.toggle('collapsed', CP.collapsed);
    $('cpToggle').setAttribute('aria-expanded', String(!CP.collapsed));
    setTimeout(pad, 320);
  }
  function drawTabs() {
    const box = $('cpTabs'); box.innerHTML = '';
    TABS.forEach(([k, ic]) => box.appendChild(el('button', { class: 'cp-tab' + (CP.tab === k ? ' on' : ''), role: 'tab', 'aria-selected': String(CP.tab === k), onclick: () => { CP.tab = k; CP.shown = 8; store.set('cpTab', k); drawAll(); $('cpBody').scrollTop = 0; } }, [
      el('span', { class: 'i', text: ic }), el('span', { class: 'l', text: tr('t_' + k) })
    ])));
  }
  function drawRules() {
    const box = $('cpRules');
    const r = ref(), prot = r.gps ? protOf(r) : null, open = store.get('advOpen', false);
    box.className = 'adv ' + (prot ? 'bad' : 'ok') + (open ? '' : ' closed');
    box.innerHTML = '';
    box.append(
      el('button', { class: 'adv-top', 'aria-expanded': String(open) }, [el('div', { class: 'adv-h' }, [el('span', { class: 'adv-i', text: prot ? '⛔' : '🚐' }), el('span', { text: tr('rulesLabel') })]), el('div', { class: 'adv-v', text: prot ? tr('inProt') : tr('rulesV') })]),
      el('ul', {}, [prot ? ['🌿', prot] : null, ['🛏', tr('r1')], ['⛺', tr('r2')], ['🚱', tr('r3')], ['🌿', tr('r4')], ['🪧', tr('r5')], ['📜', tr('r6')]].filter(Boolean).map(([ic, t]) => el('li', {}, [el('span', { class: 'ic', text: ic }), el('span', { text: t })]))),
      el('div', { class: 'adv-src', text: tr('rulesSrc') })
    );
  }
  function list() {
    const r = ref();
    return CP.items.filter((x) => x.tab === CP.tab).map((x) => Object.assign(x, { d: M.distKm(r, x) })).sort((a, b) => a.d - b.d);
  }
  function rowSub(x) {
    if (x.tab === 'sleep') return el('span', { class: 's cp-st', style: '--sc:' + STC[x.st] }, [STI[x.st] + ' ' + tr('st_' + x.st)]);
    if (x.tab === 'water') return el('span', { class: 's' }, [[x.dump ? '🚽 ' + tr('has_dump') : null, x.water ? '💧 ' + tr('has_water') : null].filter(Boolean).join(' · ') + (x.spot && x.spot.price ? ' · ' + x.spot.price : '')]);
    if (x.tab === 'fuel') { const k = fuelKind(), p = x.fuel && x.fuel[k]; return el('span', { class: 's' }, [(p ? num(p, 3) + ' ' + tr('perL') : '') + (x.cheap ? ' · ★ ' + tr('cheapest') : '') + (x.sub ? ' · ' + x.sub : '')]); }
    const t = x.tags || {};
    return el('span', { class: 's' }, [[x.name ? tr('n_' + x.type) : null, t.hot_water === 'yes' ? tr('hot') : null, t.fee === 'no' ? tr('free') : t.fee === 'yes' ? tr('paid') : null, t.access === 'customers' ? tr('customers') : null].filter(Boolean).join(' · ')]);
  }
  function drawList() {
    const box = $('cpList'); box.innerHTML = '';
    const r = ref();
    $('cpSub').textContent = r.gps ? tr('near') : tr('nearMap');
    const all = list();
    if (CP.tab === 'fuel') { const k = fuelKind(); const near = all.filter((x) => x.d < 15 && x.fuel && x.fuel[k]); const min = Math.min(...near.map((x) => x.fuel[k])); all.forEach((x) => { x.cheap = near.includes(x) && x.fuel[k] === min; }); }
    if (!all.length) { box.appendChild(el('p', { class: 'sf-note', text: tr('none') })); return; }
    all.slice(0, CP.shown).forEach((x) => box.appendChild(el('button', { class: 'sf-row cp-row' + (x.spot ? ' star' : ''), onclick: () => openCard(x.id, true) }, [
      el('span', { class: 'cp-ico', style: '--cc:' + (x.st ? STC[x.st] : '#8b5cf6'), text: ICON[x.type] || '📍' }),
      el('span', { class: 'sf-txt' }, [el('span', { class: 't', text: nameOf(x) }), rowSub(x)]),
      el('span', { class: 'cp-d', text: fmtD(x.d) })
    ])));
    if (all.length > CP.shown) box.appendChild(el('button', { class: 'cp-more', onclick: () => { CP.shown += 8; drawList(); }, text: tr('more') + ' (' + (all.length - CP.shown) + ')' }));
  }

  // ------------------------------------------------------------------
  // Mappa: aree protette + i punti della scheda scelta
  // ------------------------------------------------------------------
  const markers = [];
  function ensureLayers() {
    if (!map.getStyle()) return;
    if (!map.getSource('cp-prot')) map.addSource('cp-prot', { type: 'geojson', data: CP.prot || { type: 'FeatureCollection', features: [] } });
    if (!map.getLayer('cp-prot-fill')) map.addLayer({ id: 'cp-prot-fill', type: 'fill', source: 'cp-prot', paint: { 'fill-color': '#2f9e5b', 'fill-opacity': 0.16 } });
    if (!map.getLayer('cp-prot-line')) map.addLayer({ id: 'cp-prot-line', type: 'line', source: 'cp-prot', paint: { 'line-color': '#2f9e5b', 'line-width': 1.6, 'line-dasharray': [2, 1.5] } });
    ['cp-prot-fill', 'cp-prot-line'].forEach((l) => map.setLayoutProperty(l, 'visibility', CP.on ? 'visible' : 'none'));
  }
  function drawMap() {
    markers.forEach((m) => m.remove()); markers.length = 0;
    ensureLayers();
    if (!CP.on) return;
    if (CP.prot && map.getSource('cp-prot')) map.getSource('cp-prot').setData(CP.prot);
    const c = map.getCenter();
    CP.items.filter((x) => x.tab === CP.tab).map((x) => [x, M.distKm(c, x)]).sort((a, b) => a[1] - b[1]).slice(0, 120).forEach(([x]) => {
      const n = el('div', { class: 'cp-pin' + (x.spot ? ' star' : '') + (CP.open === x.id ? ' sel' : ''), style: '--cc:' + (x.st ? STC[x.st] : '#8b5cf6'), title: nameOf(x), text: ICON[x.type] || '📍' });
      n.addEventListener('click', (e) => { e.stopPropagation(); openCard(x.id); });
      markers.push(new maplibregl.Marker({ element: n }).setLngLat([x.lng, x.lat]).addTo(map));
    });
  }
  let mt;
  map.on('moveend', () => { if (!CP.on) return; clearTimeout(mt); mt = setTimeout(() => { drawMap(); if (!M.pos()) drawList(); }, 250); });
  map.on('style.load', () => { if (CP.on) drawMap(); });

  // ------------------------------------------------------------------
  // Scheda: poche righe chiare
  // ------------------------------------------------------------------
  function factRow(k, v) { return v ? el('div', { class: 'cp-f' }, [el('span', { class: 'k', text: k }), el('span', { class: 'v' }, Array.isArray(v) ? v : [v])]) : null; }
  function nearestOf(p, tab, filt) {
    let b = null;
    for (const q of CP.items) if (q.tab === tab && (!filt || filt(q)) && !(q.spot && p.spot && q.spot.id === p.spot.id)) { const d = M.distKm(p, q); if (!b || d < b.d) b = { q, d }; }
    return b;
  }
  function openCard(id, fly) {
    const x = CP.items.find((i) => i.id === id);
    if (!x) return;
    CP.open = id;
    const box = $('cpCardBody'); box.innerHTML = '';
    const s = x.spot, t = x.tags || {}, r = ref();
    box.append(el('div', { class: 'p-kicker', text: (ICON[x.type] || '📍') + ' ' + tr('n_' + x.type) + (s ? ' · Maxora' : '') }), el('div', { class: 'p-name', text: nameOf(x) }));
    if (x.tab === 'sleep') box.appendChild(el('div', { class: 'cp-banner', style: '--sc:' + STC[x.st] }, [el('b', { text: STI[x.st] + ' ' + tr('st_' + x.st) }), x.protName ? el('span', { text: x.protName }) : null]));
    const d = txt(s);
    if (d) box.appendChild(el('p', { class: 'p-desc', text: d }));
    const facts = el('div', { class: 'cp-facts' });
    const k = fuelKind();
    const sv = ((s && s.services) || []).filter((v) => !['warn'].includes(v));
    [
      factRow('📍 ' + tr('k_dist'), fmtD(M.distKm(r, x))),
      factRow('💶 ' + tr('k_price'), x.fuel ? [['g95', 'Gasolina 95'], ['diesel', 'Gasóleo'], ['g98', 'Gasolina 98']].filter(([f]) => x.fuel[f]).map(([f, n]) => (f === k ? '▸ ' : '') + n + ' ' + num(x.fuel[f], 3) + ' €').join(' · ') : (s && s.price) || (t.fee === 'no' ? tr('free') : t.fee === 'yes' ? tr('paid') : null)),
      factRow('🧰 ' + tr('k_serv'), sv.length ? sv.map((v) => tr('s_' + v)).join(' · ') : [t.hot_water === 'yes' ? tr('hot') : t.hot_water === 'no' ? tr('cold') : null, t.access === 'customers' ? tr('customers') : null].filter(Boolean).join(' · ') || null),
      factRow('🕒 ' + tr('k_hours'), t.opening_hours || null)
    ].filter(Boolean).forEach((n) => facts.appendChild(n));
    // per chi dorme: dove scaricare e fare benzina
    if (x.tab === 'sleep') {
      const w = nearestOf(x, 'water'), f = nearestOf(x, 'fuel');
      if (w) facts.appendChild(el('button', { class: 'cp-f link', onclick: () => openCard(w.q.id, true) }, [el('span', { class: 'k', text: '🚰 ' + tr('nearWater') }), el('span', { class: 'v', text: nameOf(w.q) + ' · ' + fmtD(w.d) + ' ›' })]));
      if (f) facts.appendChild(el('button', { class: 'cp-f link', onclick: () => openCard(f.q.id, true) }, [el('span', { class: 'k', text: '⛽ ' + tr('nearFuel') }), el('span', { class: 'v', text: nameOf(f.q) + (f.q.fuel && f.q.fuel[k] ? ' ' + num(f.q.fuel[k], 3) + ' €' : '') + ' · ' + fmtD(f.d) + ' ›' })]));
    }
    box.appendChild(facts);
    if (s) box.appendChild(el('p', { class: 'p-note', text: [s.source ? tr('k_src') + ': ' + s.source : null, s.verified_at ? tr('upd', { d: new Intl.DateTimeFormat(LOC[lang()], { month: 'short', year: 'numeric' }).format(new Date(s.verified_at)) }) : null, s.approx ? '≈ ' + tr('approx') : null].filter(Boolean).join(' · ') }));
    const ll = x.lat + ',' + x.lng;
    const apps = el('div', { class: 'p-apps' }, [
      el('a', { href: 'https://www.google.com/maps/dir/?api=1&destination=' + ll, target: '_blank', rel: 'noopener', text: 'Google' }),
      el('a', { href: 'https://waze.com/ul?ll=' + ll + '&navigate=yes', target: '_blank', rel: 'noopener', text: 'Waze' }),
      el('a', { href: 'https://maps.apple.com/?daddr=' + ll, target: '_blank', rel: 'noopener', text: 'Apple' })
    ]);
    const appsBox = el('div', { class: 'hidden' }, [el('div', { class: 'p-note', text: tr('openWith') }), apps]);
    box.append(el('div', { class: 'p-actions' }, [el('button', { class: 'p-go', onclick: () => appsBox.classList.toggle('hidden'), text: tr('go') })]), appsBox);
    card.classList.remove('hidden'); card.scrollTop = 0;
    drawMap();
    if (fly) {
      map.setPadding({ top: 0, bottom: 0, left: 0, right: 0 });
      const ph = Math.min(window.innerHeight * 0.62, card.getBoundingClientRect().height || 380);
      map.easeTo({ center: [x.lng, x.lat], zoom: Math.max(map.getZoom(), 13), padding: { top: 80, bottom: ph + 20, left: 0, right: 0 }, duration: 700 });
    }
  }
  function closeCard() { CP.open = null; if (card) card.classList.add('hidden'); drawMap(); pad(); }

  function pad() {
    if (!CP.on || CP.open || !sheet) return;
    const h = sheet.getBoundingClientRect().height;
    map.setPadding({ top: 70, bottom: Math.max(0, Math.min(h, window.innerHeight * 0.6) - 10), left: 0, right: 0 });
  }
  function drawAll() {
    if (!CP.on) return;
    $('cpTitle').textContent = tr('title');
    drawTabs();
    if (!CP.loaded) { $('cpSub').textContent = tr('loading'); return; }
    drawRules(); drawList(); drawMap();
    $('cpNote').textContent = tr('osm');
    pad();
  }
  async function setOn(on) {
    build();
    CP.on = on;
    store.set('camperOn', on);
    sheet.classList.toggle('hidden', !on);
    sheet.classList.toggle('collapsed', CP.collapsed);
    if (!on) { closeCard(); drawMap(); map.setPadding({ top: 0, bottom: 0, left: 0, right: 0 }); return; }
    M.closePlace && M.closePlace();
    M.unfollow && M.unfollow();
    drawAll();
    await load();
    drawAll();
    const r = ref();
    map.easeTo(r.gps ? { center: [r.lng, r.lat], zoom: Math.max(map.getZoom(), 10.5), duration: 600 } : { center: [-14.02, 28.4], zoom: 8.6, duration: 600 });
  }
  map.on('click', () => { if (CP.on && CP.open) closeCard(); });
  M.onTexts(() => drawAll());
  setInterval(() => { if (CP.on && CP.loaded) { drawRules(); if (M.pos()) drawList(); } }, 60000);
  window.addEventListener('resize', pad);
  window.MAXORA_CAMPER = { setOn, isOn: () => CP.on, state: CP, protOf };
})();
