/* Maxora — modalità camper: dove dormire, scaricare, caricare acqua, docce, benzinai, parcheggi; regole di sosta e aree protette */
(function () {
  'use strict';
  const M = window.MAXORA;
  if (!M) return;
  const { map, sb, el, store } = M;
  const $ = (id) => document.getElementById(id);

  const TX = {
    it: {
      n_service: 'Area camper', n_dump: 'Punto di scarico', n_water: 'Fontanella', n_fuel: 'Distributore', n_shower: 'Doccia pubblica', n_toilets: 'Bagni pubblici', n_parking: 'Parcheggio', n_food: 'Ristorante', n_super: 'Supermercato', n_laundry: 'Lavanderia', n_gym: 'Palestra',
      title: 'Camper', near: 'Vicino a te', nearMap: 'Vicino al centro mappa', loading: 'Carico…', none: 'Niente qui intorno con questi filtri.',
      c_service: 'Aree camper', c_dump: 'Scarico', c_water: 'Acqua', c_fuel: 'Benzinai', c_shower: 'Docce', c_toilets: 'Bagni', c_parking: 'Parcheggi', c_food: 'Mangiare + parcheggio', c_super: 'Supermercati', c_laundry: 'Lavanderie', c_gym: 'Palestre',
      rulesLabel: 'Regole di sosta', rulesV: 'Dormire nel camper sì · campeggiare no', inProt: 'Sei in un\'area protetta: qui non si pernotta', inProtS: '{n}',
      r1: 'Dormire nel veicolo è permesso se è parcheggiato correttamente', r2: 'Niente fuori dal mezzo: tendalino, sedie, tavoli, piedini = campeggio (vietato)', r3: 'Niente scarichi a terra: usa i punti di scarico',
      r4: 'Aree protette (in verde sulla mappa): niente pernottamento', r5: 'I Comuni possono vietare la sosta notturna in certi parcheggi: rispetta i cartelli',
      r6: 'Nuovo decreto delle Canarie in arrivo: aree camper fino a 72 h', rulesSrc: 'Fonti: DGT, Governo delle Canarie (decreto in approvazione), Cabildo. Aggiornato ottobre 2026.',
      verified: 'Info aggiornate a {d}', approx: 'Posizione indicativa', free: 'Gratis', paid: 'A pagamento', hours: 'Orari', maxh: 'Altezza max', price: 'Prezzo', services: 'Servizi',
      s_dump: 'scarico', s_water: 'acqua', s_power: 'corrente', s_shower: 'doccia', s_wc: 'bagno', s_wifi: 'wifi', s_laundry: 'lavatrice', s_overnight: 'si può dormire', s_trash: 'rifiuti',
      nearby: 'Più vicini da qui', go: 'VAI', openWith: 'Apri navigazione con', protHere: 'Questo punto è dentro un\'area protetta ({n}): niente pernottamento.',
      pricesF: 'Benzina 95 {g} · Gasolio {d} €/L', parkNear: '🅿️ parcheggio a {d}', osm: 'Dati: OpenStreetMap (ODbL), Maxora, Ministerio (prezzi). Controlla sempre i cartelli sul posto.',
      hot: 'acqua calda', cold: 'acqua fredda', outdoor: 'all\'aperto', customers: 'solo clienti', k_service: 'Area camper', k_camp: 'Campeggio', k_sleep: 'Sosta notturna', k_other: 'Punto camper'
    },
    es: {
      n_service: 'Área camper', n_dump: 'Punto de vaciado', n_water: 'Fuente', n_fuel: 'Gasolinera', n_shower: 'Ducha pública', n_toilets: 'Baños públicos', n_parking: 'Aparcamiento', n_food: 'Restaurante', n_super: 'Supermercado', n_laundry: 'Lavandería', n_gym: 'Gimnasio',
      title: 'Camper', near: 'Cerca de ti', nearMap: 'Cerca del centro del mapa', loading: 'Cargando…', none: 'Nada por aquí con estos filtros.',
      c_service: 'Áreas camper', c_dump: 'Vaciado', c_water: 'Agua', c_fuel: 'Gasolineras', c_shower: 'Duchas', c_toilets: 'Baños', c_parking: 'Aparcamientos', c_food: 'Comer + aparcar', c_super: 'Supermercados', c_laundry: 'Lavanderías', c_gym: 'Gimnasios',
      rulesLabel: 'Normas de pernocta', rulesV: 'Dormir en el camper sí · acampar no', inProt: 'Estás en un espacio protegido: aquí no se pernocta', inProtS: '{n}',
      r1: 'Dormir dentro del vehículo está permitido si está bien estacionado', r2: 'Nada fuera del vehículo: toldo, sillas, mesas, patas = acampada (prohibida)', r3: 'Nada de vertidos: usa los puntos de vaciado',
      r4: 'Espacios protegidos (en verde en el mapa): no se pernocta', r5: 'Los ayuntamientos pueden prohibir la pernocta en ciertos aparcamientos: respeta las señales',
      r6: 'Nuevo decreto canario en camino: áreas camper hasta 72 h', rulesSrc: 'Fuentes: DGT, Gobierno de Canarias (decreto en tramitación), Cabildo. Actualizado octubre 2026.',
      verified: 'Información de {d}', approx: 'Posición aproximada', free: 'Gratis', paid: 'De pago', hours: 'Horario', maxh: 'Altura máx.', price: 'Precio', services: 'Servicios',
      s_dump: 'vaciado', s_water: 'agua', s_power: 'luz', s_shower: 'ducha', s_wc: 'baño', s_wifi: 'wifi', s_laundry: 'lavadora', s_overnight: 'se puede pernoctar', s_trash: 'basura',
      nearby: 'Lo más cerca desde aquí', go: 'IR', openWith: 'Abrir navegación con', protHere: 'Este punto está dentro de un espacio protegido ({n}): no se pernocta.',
      pricesF: 'Gasolina 95 {g} · Gasóleo {d} €/L', parkNear: '🅿️ aparcamiento a {d}', osm: 'Datos: OpenStreetMap (ODbL), Maxora, Ministerio (precios). Respeta siempre las señales.',
      hot: 'agua caliente', cold: 'agua fría', outdoor: 'al aire libre', customers: 'solo clientes', k_service: 'Área camper', k_camp: 'Camping', k_sleep: 'Pernocta', k_other: 'Punto camper'
    },
    en: {
      n_service: 'Camper area', n_dump: 'Dump station', n_water: 'Water tap', n_fuel: 'Petrol station', n_shower: 'Public shower', n_toilets: 'Public toilets', n_parking: 'Car park', n_food: 'Restaurant', n_super: 'Supermarket', n_laundry: 'Laundry', n_gym: 'Gym',
      title: 'Camper', near: 'Near you', nearMap: 'Near map centre', loading: 'Loading…', none: 'Nothing around here with these filters.',
      c_service: 'Camper areas', c_dump: 'Dump station', c_water: 'Water', c_fuel: 'Fuel', c_shower: 'Showers', c_toilets: 'Toilets', c_parking: 'Parking', c_food: 'Eat + park', c_super: 'Supermarkets', c_laundry: 'Laundries', c_gym: 'Gyms',
      rulesLabel: 'Overnight rules', rulesV: 'Sleeping in the van yes · camping no', inProt: 'You are in a protected area: no overnight stays here', inProtS: '{n}',
      r1: 'Sleeping inside the vehicle is allowed if it is parked correctly', r2: 'Nothing outside: awning, chairs, tables, levelling jacks = camping (banned)', r3: 'No discharges on the ground: use dump stations',
      r4: 'Protected areas (green on the map): no overnight stays', r5: 'Councils may ban overnight parking in some car parks: follow the signs',
      r6: 'New Canary Islands decree coming: camper areas up to 72 h', rulesSrc: 'Sources: DGT, Canary Islands Government (decree pending), Cabildo. Updated October 2026.',
      verified: 'Info as of {d}', approx: 'Approximate position', free: 'Free', paid: 'Paid', hours: 'Hours', maxh: 'Max height', price: 'Price', services: 'Services',
      s_dump: 'dump', s_water: 'water', s_power: 'power', s_shower: 'shower', s_wc: 'toilet', s_wifi: 'wifi', s_laundry: 'washing machine', s_overnight: 'overnight ok', s_trash: 'bins',
      nearby: 'Closest from here', go: 'GO', openWith: 'Navigate with', protHere: 'This point is inside a protected area ({n}): no overnight stays.',
      pricesF: 'Petrol 95 {g} · Diesel {d} €/L', parkNear: '🅿️ parking {d} away', osm: 'Data: OpenStreetMap (ODbL), Maxora, Spanish Ministry (prices). Always check the signs.',
      hot: 'hot water', cold: 'cold water', outdoor: 'outdoor', customers: 'customers only', k_service: 'Camper area', k_camp: 'Campsite', k_sleep: 'Overnight spot', k_other: 'Camper point'
    },
    de: {
      n_service: 'Wohnmobilplatz', n_dump: 'Entsorgungsstation', n_water: 'Wasserstelle', n_fuel: 'Tankstelle', n_shower: 'Öffentliche Dusche', n_toilets: 'Öffentliche Toiletten', n_parking: 'Parkplatz', n_food: 'Restaurant', n_super: 'Supermarkt', n_laundry: 'Waschsalon', n_gym: 'Fitnessstudio',
      title: 'Camper', near: 'In deiner Nähe', nearMap: 'Nahe Kartenmitte', loading: 'Lade…', none: 'Mit diesen Filtern nichts in der Nähe.',
      c_service: 'Wohnmobilplätze', c_dump: 'Entsorgung', c_water: 'Wasser', c_fuel: 'Tankstellen', c_shower: 'Duschen', c_toilets: 'Toiletten', c_parking: 'Parkplätze', c_food: 'Essen + parken', c_super: 'Supermärkte', c_laundry: 'Waschsalons', c_gym: 'Fitnessstudios',
      rulesLabel: 'Übernachtungsregeln', rulesV: 'Im Camper schlafen ja · campen nein', inProt: 'Du bist in einem Schutzgebiet: hier nicht übernachten', inProtS: '{n}',
      r1: 'Im Fahrzeug schlafen ist erlaubt, wenn es korrekt geparkt ist', r2: 'Nichts nach draußen: Markise, Stühle, Tische, Stützen = Camping (verboten)', r3: 'Nichts ablassen: Entsorgungsstationen nutzen',
      r4: 'Schutzgebiete (grün auf der Karte): keine Übernachtung', r5: 'Gemeinden können das Übernachten auf manchen Parkplätzen verbieten: Schilder beachten',
      r6: 'Neues Dekret der Kanaren kommt: Wohnmobilplätze bis 72 h', rulesSrc: 'Quellen: DGT, Regierung der Kanaren (Dekret in Arbeit), Cabildo. Stand Oktober 2026.',
      verified: 'Stand {d}', approx: 'Ungefähre Position', free: 'Kostenlos', paid: 'Kostenpflichtig', hours: 'Öffnungszeiten', maxh: 'Max. Höhe', price: 'Preis', services: 'Service',
      s_dump: 'Entsorgung', s_water: 'Wasser', s_power: 'Strom', s_shower: 'Dusche', s_wc: 'WC', s_wifi: 'WLAN', s_laundry: 'Waschmaschine', s_overnight: 'Übernachten ok', s_trash: 'Müll',
      nearby: 'Am nächsten von hier', go: 'LOS', openWith: 'Navigieren mit', protHere: 'Dieser Punkt liegt in einem Schutzgebiet ({n}): keine Übernachtung.',
      pricesF: 'Benzin 95 {g} · Diesel {d} €/L', parkNear: '🅿️ Parkplatz in {d}', osm: 'Daten: OpenStreetMap (ODbL), Maxora, span. Ministerium (Preise). Schilder vor Ort beachten.',
      hot: 'Warmwasser', cold: 'Kaltwasser', outdoor: 'im Freien', customers: 'nur Kunden', k_service: 'Wohnmobilplatz', k_camp: 'Campingplatz', k_sleep: 'Übernachtungsplatz', k_other: 'Camper-Punkt'
    }
  };
  const LOC = { it: 'it-IT', es: 'es-ES', en: 'en-GB', de: 'de-DE' };
  const lang = () => (TX[M.lang()] ? M.lang() : 'es');
  const tr = (k, v) => { let s = TX[lang()][k] || TX.es[k] || k; if (v) Object.keys(v).forEach((x) => { s = s.replace('{' + x + '}', v[x]); }); return s; };
  const num = (v, d) => new Intl.NumberFormat(LOC[lang()], { maximumFractionDigits: d, minimumFractionDigits: d }).format(v);
  const fmtD = (km) => (km < 1 ? Math.round(km * 100) * 10 + ' m' : num(km, km < 10 ? 1 : 0) + ' km');

  // categorie: icona, colore, attive di default
  const CATS = [
    ['service', '🚐', '#8b5cf6', true], ['dump', '🚽', '#7c4a1e', true], ['water', '💧', '#2f7cf6', true], ['fuel', '⛽', '#e5484d', true], ['shower', '🚿', '#14a090', true],
    ['toilets', '🚻', '#64748b', false], ['parking', '🅿️', '#3b82f6', false], ['food', '🍽', '#f2711c', false], ['super', '🛒', '#2f9e5b', false], ['laundry', '🧺', '#a855f7', false], ['gym', '🏋️', '#0ea5e9', false]
  ];
  const CAT = Object.fromEntries(CATS.map((c) => [c[0], { icon: c[1], color: c[2] }]));
  const CP = { on: false, pts: [], prot: null, spots: [], fuel: null, filt: new Set(store.get('cpFilt', CATS.filter((c) => c[3]).map((c) => c[0]))), open: null, collapsed: store.get('cpCollapsed', false), loaded: false };

  // ------------------------------------------------------------------
  // Dati
  // ------------------------------------------------------------------
  const getJSON = (u) => fetch(u + '?v=' + Math.floor(Date.now() / 1800000), { cache: 'no-cache' }).then((r) => (r.ok ? r.json() : null)).catch(() => null);
  async function load() {
    if (CP.loaded) return;
    const [pois, prot, fuel, spots] = await Promise.all([getJSON('data/pois.json'), getJSON('data/protected.json'), getJSON('data/fuel.json'),
      sb.from('camper_spots').select('*').then((r) => r.data || [], () => [])]);
    CP.prot = prot; CP.fuel = fuel; CP.spots = spots;
    const pts = [];
    const C = (pois && pois.cats) || {};
    const add = (cat, r, extra) => pts.push(Object.assign({ id: 'o' + r[0], cat, name: r[1], lat: r[2], lng: r[3], tags: r[4] || {} }, extra || {}));
    // aree camper: prima quelle verificate da Maxora, poi OpenStreetMap (escluse quelle chiuse)
    spots.forEach((s) => pts.push({ id: 's' + s.id, cat: s.kind === 'dump' ? 'dump' : s.kind === 'water' ? 'water' : s.kind === 'shower' ? 'shower' : s.kind === 'parking' ? 'parking' : 'service', name: s.name, lat: s.lat, lng: s.lng, tags: {}, spot: s }));
    (C.camp || []).forEach((r) => { const t = r[4] || {}; if (t['disused:tourism'] || /not active|abandon|cerrad|closed/i.test(t.description || '')) return; if (!near(pts, r[2], r[3], 0.15, 'service')) add('service', r); });
    (C.dump || []).forEach((r) => { if (!near(pts, r[2], r[3], 0.1, 'dump')) add('dump', r); });
    (C.water || []).forEach((r) => add('water', r));
    (C.shower || []).forEach((r) => add('shower', r));
    (C.toilets || []).forEach((r) => add('toilets', r));
    (C.laundry || []).forEach((r) => add('laundry', r));
    (C.gym || []).forEach((r) => { if (!near(pts, r[2], r[3], 0.02, 'gym')) add('gym', r); });
    (C.super || []).forEach((r) => add('super', r));
    (C.parking || []).forEach((r) => { const t = r[4] || {}; if (t.access === 'private' || t.motorhome === 'no') return; add('parking', r); });
    // benzinai: quelli del Ministerio hanno i prezzi; altrimenti OpenStreetMap
    const fs = (fuel && fuel.stations) || [];
    fs.forEach((s) => pts.push({ id: 'f' + s.id, cat: 'fuel', name: s.name, lat: s.lat, lng: s.lng, tags: { opening_hours: s.hours }, fuel: s, sub: s.town }));
    (C.fuel || []).forEach((r) => { if (!fs.some((s) => M.distKm(s, { lat: r[2], lng: r[3] }) < 0.25) && !near(pts, r[2], r[3], 0.2, 'fuel')) add('fuel', r); });
    // mangiare con parcheggio vicino (entro 200 m)
    const parks = pts.filter((p) => p.cat === 'parking');
    (C.food || []).forEach((r) => {
      let best = null;
      for (const p of parks) { const d = M.distKm(p, { lat: r[2], lng: r[3] }); if (d < 0.2 && (!best || d < best)) best = d; }
      if (best != null) add('food', r, { park: best });
    });
    // spot verificati con servizi: compaiono anche nelle altre categorie
    spots.forEach((s) => (s.services || []).forEach((sv) => {
      const c = sv === 'dump' ? 'dump' : sv === 'water' ? 'water' : sv === 'shower' ? 'shower' : null;
      if (c && c !== pts.find((p) => p.id === 's' + s.id).cat) pts.push({ id: 's' + s.id + c, cat: c, name: s.name, lat: s.lat, lng: s.lng, tags: {}, spot: s });
    }));
    CP.pts = pts;
    CP.loaded = true;
  }
  function near(pts, lat, lng, km, cat) { return pts.some((p) => p.cat === cat && M.distKm(p, { lat, lng }) < km); }

  // punto dentro un'area protetta?
  function inPoly(pt, ring) {
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
      for (const p of polys) if (inPoly(pt, p[0]) && !p.slice(1).some((h) => inPoly(pt, h))) return f.properties.name;
    }
    return null;
  }

  // ------------------------------------------------------------------
  // Pannello
  // ------------------------------------------------------------------
  let sheet, card;
  function build() {
    if (sheet) return;
    sheet = el('section', { id: 'cpSheet', class: 'sheet sp-sheet cp-sheet hidden' }, [
      el('button', { class: 'sheet-handle', id: 'cpToggle', 'aria-expanded': 'true', onclick: toggle }, [
        el('span', { class: 'grip' }), el('span', { class: 'sh-title', id: 'cpTitle' }), el('span', { class: 'sh-sub', id: 'cpSub' })
      ]),
      el('div', { class: 'sheet-body', id: 'cpBody' }, [
        el('div', { class: 'adv', id: 'cpRules' }),
        el('div', { class: 'cp-chips', id: 'cpChips' }),
        el('div', { class: 'sf-list', id: 'cpList' }),
        el('p', { class: 'sf-note', id: 'cpNote' })
      ])
    ]);
    card = el('section', { id: 'cpCard', class: 'place sf-card sp-card hidden', 'aria-live': 'polite' }, [
      el('button', { class: 'icon-btn place-close', 'aria-label': '✕', onclick: closeCard, text: '✕' }),
      el('div', { id: 'cpCardBody' })
    ]);
    document.body.append(sheet, card);
  }
  function toggle() {
    CP.collapsed = !CP.collapsed; store.set('cpCollapsed', CP.collapsed);
    sheet.classList.toggle('collapsed', CP.collapsed);
    $('cpToggle').setAttribute('aria-expanded', String(!CP.collapsed));
    setTimeout(pad, 320);
  }
  const ref = () => { const p = M.pos(); if (p) return { lat: p.lat, lng: p.lng, gps: true }; const c = map.getCenter(); return { lat: c.lat, lng: c.lng, gps: false }; };

  function drawRules() {
    const box = $('cpRules');
    const r = ref();
    const prot = r.gps ? protOf(r) : null;
    const open = store.get('advOpen', false);
    box.className = 'adv ' + (prot ? 'bad' : 'ok') + (open ? '' : ' closed');
    box.innerHTML = '';
    box.append(
      el('button', { class: 'adv-top', 'aria-expanded': String(open) }, [
        el('div', { class: 'adv-h' }, [el('span', { class: 'adv-i', text: prot ? '⛔' : '🚐' }), el('span', { text: tr('rulesLabel') })]),
        el('div', { class: 'adv-v', text: prot ? tr('inProt') : tr('rulesV') })
      ]),
      el('ul', {}, [prot ? ['🌿', prot] : null, ['🛏', tr('r1')], ['⛺', tr('r2')], ['🚱', tr('r3')], ['🌿', tr('r4')], ['🪧', tr('r5')], ['📜', tr('r6')]].filter(Boolean)
        .map(([ic, t]) => el('li', {}, [el('span', { class: 'ic', text: ic }), el('span', { text: t })]))),
      el('div', { class: 'adv-src', text: tr('rulesSrc') })
    );
  }
  function drawChips() {
    const box = $('cpChips'); box.innerHTML = '';
    CATS.forEach(([k, ic]) => {
      if (!CP.pts.some((p) => p.cat === k)) return;
      box.appendChild(el('button', { class: 'cp-chip' + (CP.filt.has(k) ? ' on' : ''), style: '--cc:' + CAT[k].color, 'aria-pressed': String(CP.filt.has(k)), onclick: () => {
        if (CP.filt.has(k)) CP.filt.delete(k); else CP.filt.add(k);
        store.set('cpFilt', [...CP.filt]); drawAll();
      } }, [ic + ' ' + tr('c_' + k)]));
    });
  }
  function visible() {
    const r = ref();
    return CP.pts.filter((p) => CP.filt.has(p.cat)).map((p) => Object.assign({}, p, { d: M.distKm(r, p) })).sort((a, b) => a.d - b.d);
  }
  function label(p) {
    if (p.name) return p.name;
    if (p.spot) return p.spot.name;
    return tr('n_' + p.cat);
  }
  function subline(p) {
    const t = p.tags || {}, out = [];
    if (p.spot) out.push('★ ' + tr('k_' + (['service', 'camp', 'sleep'].includes(p.spot.kind) ? p.spot.kind : 'other')));
    if (p.fuel) { const g = p.fuel.g95, d = p.fuel.diesel; out.push(tr('pricesF', { g: g ? num(g, 3) : '–', d: d ? num(d, 3) : '–' })); }
    if (p.park != null) out.push(tr('parkNear', { d: fmtD(p.park) }));
    if (t.fee === 'no') out.push(tr('free')); else if (t.fee === 'yes') out.push(tr('paid'));
    if (t.access === 'customers') out.push(tr('customers'));
    if (t.hot_water === 'yes') out.push(tr('hot')); else if (p.cat === 'shower' && t.hot_water === 'no') out.push(tr('cold'));
    if (t.maxheight) out.push(tr('maxh') + ' ' + t.maxheight + ' m');
    if (p.sub) out.push(p.sub);
    return out.join(' · ');
  }
  function drawList() {
    const box = $('cpList'); box.innerHTML = '';
    const r = ref();
    $('cpSub').textContent = r.gps ? tr('near') : tr('nearMap');
    const rows = visible().slice(0, 40);
    if (!rows.length) { box.appendChild(el('p', { class: 'sf-note', text: tr('none') })); return; }
    rows.forEach((p) => box.appendChild(el('button', { class: 'sf-row cp-row', onclick: () => openCard(p.id, true) }, [
      el('span', { class: 'cp-ico', style: '--cc:' + CAT[p.cat].color, text: CAT[p.cat].icon }),
      el('span', { class: 'sf-txt' }, [el('span', { class: 't', text: label(p) }), el('span', { class: 's', text: subline(p) || (p.name ? tr('n_' + p.cat) : '') })]),
      el('span', { class: 'cp-d', text: fmtD(p.d) })
    ])));
  }

  // ------------------------------------------------------------------
  // Mappa: aree protette + punti (i 150 più vicini al centro)
  // ------------------------------------------------------------------
  const markers = [];
  function ensureLayers() {
    if (!map.getStyle()) return;
    if (!map.getSource('cp-prot')) map.addSource('cp-prot', { type: 'geojson', data: CP.prot || { type: 'FeatureCollection', features: [] } });
    const vis = CP.on ? 'visible' : 'none';
    if (!map.getLayer('cp-prot-fill')) map.addLayer({ id: 'cp-prot-fill', type: 'fill', source: 'cp-prot', paint: { 'fill-color': '#2f9e5b', 'fill-opacity': 0.16 } });
    if (!map.getLayer('cp-prot-line')) map.addLayer({ id: 'cp-prot-line', type: 'line', source: 'cp-prot', paint: { 'line-color': '#2f9e5b', 'line-width': 1.6, 'line-dasharray': [2, 1.5] } });
    ['cp-prot-fill', 'cp-prot-line'].forEach((l) => map.setLayoutProperty(l, 'visibility', vis));
  }
  function drawMap() {
    markers.forEach((m) => m.remove()); markers.length = 0;
    ensureLayers();
    if (!CP.on) return;
    if (CP.prot && map.getSource('cp-prot')) map.getSource('cp-prot').setData(CP.prot);
    const c = map.getCenter();
    const pts = CP.pts.filter((p) => CP.filt.has(p.cat)).map((p) => [p, M.distKm(c, p)]).sort((a, b) => a[1] - b[1]).slice(0, 150);
    const seen = new Set();
    pts.forEach(([p]) => {
      const key = p.cat + p.lat.toFixed(4) + p.lng.toFixed(4); if (seen.has(key)) return; seen.add(key);
      const n = el('div', { class: 'cp-pin' + (p.spot ? ' star' : '') + (CP.open === p.id ? ' sel' : ''), style: '--cc:' + CAT[p.cat].color, title: label(p), text: CAT[p.cat].icon });
      n.addEventListener('click', (e) => { e.stopPropagation(); openCard(p.id); });
      markers.push(new maplibregl.Marker({ element: n }).setLngLat([p.lng, p.lat]).addTo(map));
    });
  }
  let mt;
  map.on('moveend', () => { if (!CP.on) return; clearTimeout(mt); mt = setTimeout(() => { drawMap(); if (!M.pos()) drawList(); }, 250); });
  map.on('style.load', () => { if (CP.on) drawMap(); });

  // ------------------------------------------------------------------
  // Scheda
  // ------------------------------------------------------------------
  function openCard(id, fly) {
    const p = CP.pts.find((x) => x.id === id);
    if (!p) return;
    CP.open = id;
    const box = $('cpCardBody'); box.innerHTML = '';
    const r = ref(), t = p.tags || {}, s = p.spot;
    const kind = s ? tr('k_' + (['service', 'camp', 'sleep'].includes(s.kind) ? s.kind : 'other')) : tr('c_' + p.cat);
    box.append(el('div', { class: 'p-kicker', text: CAT[p.cat].icon + ' ' + (s ? kind : tr('n_' + p.cat)) + (s ? ' · Maxora' : '') }), el('div', { class: 'p-name', text: label(p) }));
    const stats = el('div', { class: 'p-stats' });
    stats.appendChild(el('div', { class: 'p-stat' }, [el('div', { class: 'k', text: r.gps ? '📍' : '⌖' }), el('div', { class: 'v', text: fmtD(M.distKm(r, p)) })]));
    if (p.fuel) [['g95', 'Gasolina 95'], ['diesel', 'Gasóleo']].forEach(([k, n]) => { if (p.fuel[k]) stats.appendChild(el('div', { class: 'p-stat' }, [el('div', { class: 'k', text: n }), el('div', { class: 'v', text: num(p.fuel[k], 3) + ' €' })])); });
    if (s && s.price) stats.appendChild(el('div', { class: 'p-stat' }, [el('div', { class: 'k', text: tr('price') }), el('div', { class: 'v', text: s.price })]));
    box.appendChild(stats);
    if (s) {
      const txt = s.text && (s.text[lang()] || s.text.es || Object.values(s.text)[0]);
      if (txt) box.appendChild(el('p', { class: 'p-desc', text: txt }));
      if ((s.services || []).length) box.appendChild(el('div', { class: 'cp-tags' }, s.services.map((x) => el('span', { text: tr('s_' + x) }))));
      const meta = [s.verified_at ? '✓ ' + tr('verified', { d: new Intl.DateTimeFormat(LOC[lang()], { month: 'short', year: 'numeric' }).format(new Date(s.verified_at)) }) : null, s.approx ? '≈ ' + tr('approx') : null, s.source].filter(Boolean);
      if (meta.length) box.appendChild(el('p', { class: 'p-note', text: meta.join(' · ') }));
    }
    const info = [];
    if (t.fee === 'no') info.push(tr('free')); else if (t.fee === 'yes') info.push(tr('paid'));
    if (t.opening_hours) info.push(tr('hours') + ': ' + t.opening_hours);
    if (t.maxheight) info.push(tr('maxh') + ': ' + t.maxheight + ' m');
    if (t.hot_water === 'yes') info.push(tr('hot')); else if (t.hot_water === 'no') info.push(tr('cold'));
    if (t.shower === 'outdoor') info.push(tr('outdoor'));
    if (t.access === 'customers') info.push(tr('customers'));
    if (p.park != null) info.push(tr('parkNear', { d: fmtD(p.park) }));
    if (t.description) info.push(t.description);
    if (info.length) box.appendChild(el('p', { class: 'p-desc', text: info.join(' · ') }));
    const prot = protOf(p);
    if (prot) box.appendChild(el('div', { class: 'p-alert cp-prot' }, [el('span', { text: '🌿' }), el('span', { class: 't', text: tr('protHere', { n: prot }) })]));
    // i servizi essenziali più vicini a questo punto
    const ess = ['dump', 'water', 'fuel', 'shower', 'super'].filter((k) => k !== p.cat).map((k) => {
      let b = null;
      for (const q of CP.pts) if (q.cat === k) { const d = M.distKm(p, q); if (!b || d < b.d) b = { q, d }; }
      return b;
    }).filter((x) => x && x.d < 25);
    if (ess.length) box.append(el('div', { class: 'sp-h', text: tr('nearby') }), el('div', { class: 'p-alerts' }, ess.map(({ q, d }) =>
      el('button', { class: 'p-alert', style: 'text-align:left;color:inherit;width:100%', onclick: () => openCard(q.id, true) }, [el('span', { text: CAT[q.cat].icon }), el('span', { class: 't', text: q.name || q.spot ? tr('n_' + q.cat) + ' · ' + label(q) : label(q) }), el('span', { class: 'd', text: fmtD(d) })]))));
    const ll = p.lat + ',' + p.lng;
    const apps = el('div', { class: 'p-apps' }, [
      el('a', { href: 'https://www.google.com/maps/dir/?api=1&destination=' + ll, target: '_blank', rel: 'noopener', text: 'Google' }),
      el('a', { href: 'https://waze.com/ul?ll=' + ll + '&navigate=yes', target: '_blank', rel: 'noopener', text: 'Waze' }),
      el('a', { href: 'https://maps.apple.com/?daddr=' + ll, target: '_blank', rel: 'noopener', text: 'Apple' })
    ]);
    const appsBox = el('div', { class: 'hidden' }, [el('div', { class: 'p-note', text: tr('openWith') }), apps]);
    box.append(el('div', { class: 'p-actions' }, [el('button', { class: 'p-go', onclick: () => appsBox.classList.toggle('hidden'), text: tr('go') })]), appsBox,
      el('p', { class: 'p-note', text: tr('osm') }));
    card.classList.remove('hidden'); card.scrollTop = 0;
    drawMap();
    if (fly) {
      map.setPadding({ top: 0, bottom: 0, left: 0, right: 0 });
      const ph = Math.min(window.innerHeight * 0.62, card.getBoundingClientRect().height || 380);
      map.easeTo({ center: [p.lng, p.lat], zoom: Math.max(map.getZoom(), 14), padding: { top: 80, bottom: ph + 20, left: 0, right: 0 }, duration: 700 });
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
    if (!CP.loaded) { $('cpSub').textContent = tr('loading'); return; }
    drawRules(); drawChips(); drawList(); drawMap();
    $('cpNote').textContent = tr('osm');
    if (CP.open) openCard(CP.open);
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
    if (!r.gps) map.easeTo({ center: [-14.02, 28.4], zoom: 8.6, duration: 600 });
    else map.easeTo({ center: [r.lng, r.lat], zoom: Math.max(map.getZoom(), 11), duration: 600 });
  }
  map.on('click', () => { if (CP.on && CP.open) closeCard(); });
  M.onTexts(() => drawAll());
  setInterval(() => { if (CP.on) { drawRules(); if (M.pos()) drawList(); } }, 60000);
  window.addEventListener('resize', pad);
  window.MAXORA_CAMPER = { setOn, isOn: () => CP.on, state: CP, protOf };
})();
