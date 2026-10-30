/* Maxora — quanto costa il viaggio in auto: distanza su strada × consumo × prezzo ufficiale del carburante a Fuerteventura */
(function () {
  'use strict';
  const M = window.MAXORA;
  if (!M) return;
  const { el, store } = M;

  const TX = {
    it: { title: 'Carburante', oneWay: 'andata', ret: 'andata e ritorno', byCar: '{km} km in auto · {min}', approx: 'circa {km} km in auto', price: '{f} {p} €/L · media isola', cons: '{c} L/100 km',
      edit: 'Modifica auto', done: 'Fatto', fuel: 'Carburante', consK: 'Consumo', g95: 'Benzina 95', g98: 'Benzina 98', diesel: 'Gasolio', glp: 'GPL',
      cheap: 'Più economico vicino a te', note: 'Stima: dipende da auto, carico e guida. Prezzi: Ministerio (Geoportal Gasolineras), {d}.' },
    es: { title: 'Combustible', oneWay: 'ida', ret: 'ida y vuelta', byCar: '{km} km en coche · {min}', approx: 'unos {km} km en coche', price: '{f} {p} €/L · media isla', cons: '{c} L/100 km',
      edit: 'Cambiar coche', done: 'Listo', fuel: 'Combustible', consK: 'Consumo', g95: 'Gasolina 95', g98: 'Gasolina 98', diesel: 'Gasóleo', glp: 'GLP',
      cheap: 'Más barata cerca de ti', note: 'Estimación: depende del coche, la carga y la conducción. Precios: Ministerio (Geoportal Gasolineras), {d}.' },
    en: { title: 'Fuel', oneWay: 'one way', ret: 'return trip', byCar: '{km} km by car · {min}', approx: 'about {km} km by car', price: '{f} {p} €/L · island average', cons: '{c} L/100 km',
      edit: 'Change car', done: 'Done', fuel: 'Fuel', consK: 'Consumption', g95: 'Petrol 95', g98: 'Petrol 98', diesel: 'Diesel', glp: 'LPG',
      cheap: 'Cheapest near you', note: 'Estimate: depends on car, load and driving. Prices: Spanish Ministry (Geoportal Gasolineras), {d}.' },
    de: { title: 'Kraftstoff', oneWay: 'Hinweg', ret: 'hin und zurück', byCar: '{km} km mit dem Auto · {min}', approx: 'etwa {km} km mit dem Auto', price: '{f} {p} €/L · Inseldurchschnitt', cons: '{c} L/100 km',
      edit: 'Auto ändern', done: 'Fertig', fuel: 'Kraftstoff', consK: 'Verbrauch', g95: 'Benzin 95', g98: 'Benzin 98', diesel: 'Diesel', glp: 'Autogas',
      cheap: 'Am günstigsten in deiner Nähe', note: 'Schätzung: hängt von Auto, Beladung und Fahrweise ab. Preise: spanisches Ministerium (Geoportal Gasolineras), {d}.' }
  };
  const LOC = { it: 'it-IT', es: 'es-ES', en: 'en-GB', de: 'de-DE' };
  const lang = () => (TX[M.lang()] ? M.lang() : 'es');
  const tr = (k, v) => { let s = TX[lang()][k] || TX.es[k] || k; if (v) Object.keys(v).forEach((x) => { s = s.replace('{' + x + '}', v[x]); }); return s; };
  const NF = new Map();
  const num = (v, d) => { const k = lang() + d; let f = NF.get(k); if (!f) { f = new Intl.NumberFormat(LOC[lang()], { maximumFractionDigits: d, minimumFractionDigits: d }); NF.set(k, f); } return f.format(v); };
  const DEF = { g95: 6.5, g98: 6.8, diesel: 5.5, glp: 8.5 };
  const car = () => Object.assign({ f: 'g95', c: null }, store.get('car', {}));
  const cons = (c) => c.c || DEF[c.f] || 6.5;

  let FUEL = null, loading = null;
  function load() {
    if (FUEL) return Promise.resolve(FUEL);
    if (!loading) loading = fetch('data/fuel.json?v=' + Math.floor(Date.now() / 1800000), { cache: 'no-cache' })
      .then((r) => (r.ok ? r.json() : null)).then((d) => { FUEL = d; return d; }).catch(() => null);
    return loading;
  }
  const routeCache = new Map();
  function drive(a, b) {
    const k = [a.lng.toFixed(3), a.lat.toFixed(3), b.lng.toFixed(3), b.lat.toFixed(3)].join(',');
    if (routeCache.has(k)) return routeCache.get(k);
    const ctl = new AbortController();
    setTimeout(() => ctl.abort(), 6000);
    const p = fetch('https://routing.openstreetmap.de/routed-car/route/v1/driving/' + a.lng + ',' + a.lat + ';' + b.lng + ',' + b.lat + '?overview=false', { signal: ctl.signal })
      .then((r) => r.json()).then((j) => (j && j.routes && j.routes[0] ? { km: j.routes[0].distance / 1000, s: j.routes[0].duration, real: true } : null))
      .catch(() => null)
      .then((x) => x || { km: M.distKm(a, b) * 1.35, s: null, real: false });
    routeCache.set(k, p);
    return p;
  }
  const dur = (s) => { const m = Math.round(s / 60); return m < 60 ? m + ' min' : Math.floor(m / 60) + ' h ' + String(m % 60).padStart(2, '0'); };

  function card(box, item, pos) {
    if (!pos || M.distKm(pos, item) < 0.8 || M.distKm(pos, item) > 150) return;
    const wrap = el('div', { class: 'fuel' });
    box.appendChild(wrap);
    Promise.all([load(), drive(pos, item)]).then(([F, d]) => { if (wrap.isConnected) draw(wrap, F, d, pos, false); });
  }
  function draw(wrap, F, d, pos, editing) {
    wrap.innerHTML = '';
    const c = car();
    const st = F && F.stats && (F.stats[c.f] || F.stats.g95);
    const price = st ? st.avg : null;
    const liters = d.km * cons(c) / 100;
    const cost = price ? liters * price : null;
    // viaggio corto: basta una riga (si apre toccandola)
    if (!editing && d.km < 5 && !wrap.__full) {
      wrap.className = 'fuel fuel-mini';
      const v = (x) => (cost != null ? '≈ ' + num(x, 2) + ' €' : num(x / (price || 1), 1) + ' L');
      wrap.appendChild(el('button', { class: 'fuel-line', onclick: () => { wrap.__full = true; draw(wrap, F, d, pos, false); } }, [
        el('span', { text: '⛽ ' + tr('title') }), el('b', { text: v(cost != null ? cost : liters) }), el('span', { class: 'm', text: tr('ret') + ' ' + v(cost != null ? cost * 2 : liters * 2) }), el('i', { text: '›' })
      ]));
      return;
    }
    wrap.className = 'fuel';
    wrap.append(
      el('div', { class: 'fuel-h' }, [el('span', { text: '⛽ ' + tr('title') }), el('button', { class: 'fuel-e', onclick: () => draw(wrap, F, d, pos, !editing), text: editing ? tr('done') : tr('edit') })]),
      el('div', { class: 'fuel-row' }, [
        el('div', { class: 'fuel-c' }, [el('b', { text: cost != null ? '≈ ' + num(cost, 2) + ' €' : num(liters, 1) + ' L' }), el('span', { text: tr('oneWay') })]),
        el('div', { class: 'fuel-c' }, [el('b', { text: cost != null ? '≈ ' + num(cost * 2, 2) + ' €' : num(liters * 2, 1) + ' L' }), el('span', { text: tr('ret') })])
      ]),
      el('div', { class: 'fuel-s', text: (d.real ? tr('byCar', { km: num(d.km, 1), min: dur(d.s) }) : tr('approx', { km: num(d.km, 0) })) + ' · ' + tr('cons', { c: num(cons(c), 1) }) }),
      price ? el('div', { class: 'fuel-s', text: tr('price', { f: tr(c.f), p: num(price, 3) }) }) : null
    );
    if (editing) {
      const seg = el('div', { class: 'seg fuel-seg' }, ['g95', 'diesel', 'g98', 'glp'].filter((f) => !F || !F.stats || F.stats[f]).map((f) =>
        el('button', { class: f === c.f ? 'on' : '', text: tr(f), onclick: () => { store.set('car', { f, c: null }); draw(wrap, F, d, pos, true); } })));
      const step = (dv) => { const v = Math.round(Math.max(2, Math.min(25, cons(c) + dv)) * 10) / 10; store.set('car', { f: c.f, c: v }); draw(wrap, F, d, pos, true); };
      wrap.append(el('div', { class: 'fuel-k', text: tr('fuel') }), seg, el('div', { class: 'fuel-k', text: tr('consK') }),
        el('div', { class: 'fuel-step' }, [el('button', { text: '−', onclick: () => step(-0.5) }), el('b', { text: num(cons(c), 1) + ' L/100 km' }), el('button', { text: '+', onclick: () => step(0.5) })]));
    }
    // stazione più economica entro 10 km da te
    if (F && F.stations) {
      const near = F.stations.filter((s) => s[c.f] && M.distKm(pos, s) < 10).sort((a, b) => a[c.f] - b[c.f])[0];
      if (near) wrap.appendChild(el('div', { class: 'fuel-cheap' }, [el('span', { text: tr('cheap') }), el('b', { text: near.name + ' · ' + near.town + ' · ' + num(near[c.f], 3) + ' €' })]));
    }
    if (F) wrap.appendChild(el('div', { class: 'fuel-n', text: tr('note', { d: (F.date || F.generated || '').slice(0, 16) }) }));
  }
  window.MAXORA_FUEL = { card, load };
})();
