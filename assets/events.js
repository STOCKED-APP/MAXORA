/* Maxora — eventi: feste di paese, mercati, musica, gare.
   Lista per paese scelto (ricordato sul telefono) e per sport della modalità attiva.
   Chiunque può proporre un evento: resta "in revisione" finché l'admin non lo approva. */
(function () {
  'use strict';
  const M = window.MAXORA;
  if (!M) return;
  const { sb, el, store } = M;
  const TZ = 'Atlantic/Canary';

  const TX = {
    it: { events: 'Eventi', evMode: 'Eventi {s}', upcoming: '{n} in arrivo', none0: 'Nessun evento in arrivo', all: 'Tutta l\'isola', today: 'Oggi', weekend: 'Questo weekend', next: 'Prossimi', cAll: 'Tutto', cParty: 'Feste', cCult: 'Musica e cultura', cMarket: 'Mercati e cibo', cSport: 'Sport', cFam: 'Famiglie',
      fiesta: 'Festa', musica: 'Musica', mercado: 'Mercato', cultura: 'Cultura', gastro: 'Gastronomia', familia: 'Famiglie', deporte: 'Sport', surf: 'Surf e vela', bike: 'Bici', run: 'Corsa', otro: 'Altro',
      empty: 'Nessun evento in vista {w}.', emptyHint: 'Conosci una festa, un mercato o una gara? Aggiungila tu.', inTown: 'a {t}', propose: 'Proponi un evento', back: 'Eventi', allDay: 'tutto il giorno', from: 'dal {a} al {b}', go: 'Portami lì', cal: 'Calendario', share: 'Condividi', web: 'Sito web', price: 'Prezzo', pending: 'In revisione: lo vedi solo tu finché non viene approvato.', pendTag: 'in revisione', showAll: 'Tutti gli eventi', onlySport: 'Solo {s}',
      fTitle: 'Nome dell\'evento', fCat: 'Tipo', fDate: 'Giorno', fTime: 'Ora (se la sai)', fEnd: 'Ultimo giorno (se dura più giorni)', fTown: 'Paese', fPlace: 'Luogo preciso (piazza, spiaggia…)', fUrl: 'Link (facoltativo)', fDesc: 'Descrizione (facoltativa)', fHere: 'Usa la mia posizione come luogo', send: 'Invia', sent: 'Grazie! Lo controlliamo e poi appare a tutti.', need: 'Servono nome, giorno e paese.', past: 'La data è già passata.', err: 'Non inviato: {e}', note: 'Ogni evento viene controllato prima di essere pubblicato.', town: 'Paese' },
    es: { events: 'Eventos', evMode: 'Eventos de {s}', upcoming: '{n} próximos', none0: 'Sin eventos próximos', all: 'Toda la isla', today: 'Hoy', weekend: 'Este fin de semana', next: 'Próximos', cAll: 'Todo', cParty: 'Fiestas', cCult: 'Música y cultura', cMarket: 'Mercados y comida', cSport: 'Deporte', cFam: 'Familias',
      fiesta: 'Fiesta', musica: 'Música', mercado: 'Mercado', cultura: 'Cultura', gastro: 'Gastronomía', familia: 'Familias', deporte: 'Deporte', surf: 'Surf y vela', bike: 'Bici', run: 'Carrera', otro: 'Otro',
      empty: 'No hay eventos a la vista {w}.', emptyHint: '¿Conoces una fiesta, un mercadillo o una carrera? Añádela tú.', inTown: 'en {t}', propose: 'Proponer un evento', back: 'Eventos', allDay: 'todo el día', from: 'del {a} al {b}', go: 'Llévame', cal: 'Calendario', share: 'Compartir', web: 'Web', price: 'Precio', pending: 'En revisión: solo lo ves tú hasta que se apruebe.', pendTag: 'en revisión', showAll: 'Todos los eventos', onlySport: 'Solo {s}',
      fTitle: 'Nombre del evento', fCat: 'Tipo', fDate: 'Día', fTime: 'Hora (si la sabes)', fEnd: 'Último día (si dura varios días)', fTown: 'Pueblo', fPlace: 'Lugar exacto (plaza, playa…)', fUrl: 'Enlace (opcional)', fDesc: 'Descripción (opcional)', fHere: 'Usar mi ubicación como lugar', send: 'Enviar', sent: '¡Gracias! Lo revisamos y luego lo verán todos.', need: 'Faltan nombre, día y pueblo.', past: 'Esa fecha ya pasó.', err: 'No enviado: {e}', note: 'Cada evento se revisa antes de publicarse.', town: 'Pueblo' },
    en: { events: 'Events', evMode: '{s} events', upcoming: '{n} coming up', none0: 'No upcoming events', all: 'Whole island', today: 'Today', weekend: 'This weekend', next: 'Coming up', cAll: 'All', cParty: 'Fiestas', cCult: 'Music & culture', cMarket: 'Markets & food', cSport: 'Sport', cFam: 'Family',
      fiesta: 'Fiesta', musica: 'Music', mercado: 'Market', cultura: 'Culture', gastro: 'Food', familia: 'Family', deporte: 'Sport', surf: 'Surf & sailing', bike: 'Bike', run: 'Running', otro: 'Other',
      empty: 'No events coming up {w}.', emptyHint: 'Know a fiesta, a market or a race? Add it yourself.', inTown: 'in {t}', propose: 'Suggest an event', back: 'Events', allDay: 'all day', from: '{a} to {b}', go: 'Take me there', cal: 'Calendar', share: 'Share', web: 'Website', price: 'Price', pending: 'Under review: only you can see it until it is approved.', pendTag: 'under review', showAll: 'All events', onlySport: 'Only {s}',
      fTitle: 'Event name', fCat: 'Type', fDate: 'Day', fTime: 'Time (if you know it)', fEnd: 'Last day (if it runs several days)', fTown: 'Town', fPlace: 'Exact place (square, beach…)', fUrl: 'Link (optional)', fDesc: 'Description (optional)', fHere: 'Use my location as the place', send: 'Send', sent: 'Thanks! We\'ll check it, then everyone will see it.', need: 'Name, day and town are needed.', past: 'That date has passed.', err: 'Not sent: {e}', note: 'Every event is checked before it goes live.', town: 'Town' },
    de: { events: 'Events', evMode: '{s}-Events', upcoming: '{n} demnächst', none0: 'Keine Events demnächst', all: 'Ganze Insel', today: 'Heute', weekend: 'Dieses Wochenende', next: 'Demnächst', cAll: 'Alle', cParty: 'Feste', cCult: 'Musik & Kultur', cMarket: 'Märkte & Essen', cSport: 'Sport', cFam: 'Familie',
      fiesta: 'Fest', musica: 'Musik', mercado: 'Markt', cultura: 'Kultur', gastro: 'Essen', familia: 'Familie', deporte: 'Sport', surf: 'Surf & Segeln', bike: 'Rad', run: 'Laufen', otro: 'Sonstiges',
      empty: 'Keine Events in Sicht {w}.', emptyHint: 'Du kennst ein Fest, einen Markt oder ein Rennen? Trag es ein.', inTown: 'in {t}', propose: 'Event vorschlagen', back: 'Events', allDay: 'ganztägig', from: '{a} bis {b}', go: 'Hinbringen', cal: 'Kalender', share: 'Teilen', web: 'Website', price: 'Preis', pending: 'In Prüfung: nur du siehst es, bis es freigegeben ist.', pendTag: 'in Prüfung', showAll: 'Alle Events', onlySport: 'Nur {s}',
      fTitle: 'Name des Events', fCat: 'Art', fDate: 'Tag', fTime: 'Uhrzeit (falls bekannt)', fEnd: 'Letzter Tag (falls mehrtägig)', fTown: 'Ort', fPlace: 'Genauer Ort (Platz, Strand…)', fUrl: 'Link (optional)', fDesc: 'Beschreibung (optional)', fHere: 'Meinen Standort als Ort nehmen', send: 'Senden', sent: 'Danke! Wir prüfen es, dann sehen es alle.', need: 'Name, Tag und Ort fehlen.', past: 'Dieses Datum ist vorbei.', err: 'Nicht gesendet: {e}', note: 'Jedes Event wird vor der Veröffentlichung geprüft.', town: 'Ort' }
  };
  const L = () => (TX[M.lang()] ? M.lang() : 'es');
  const tr = (k, v) => ((TX[L()] || TX.es)[k] || TX.es[k] || k).replace(/\{(\w+)\}/g, (_, x) => (v && v[x] != null ? v[x] : ''));
  const LOC = { it: 'it-IT', es: 'es-ES', en: 'en-GB', de: 'de-DE' };

  // paesi di Fuerteventura (centro approssimativo): filtro e posizione di default per le proposte
  const TOWNS = [
    ['Corralejo', 28.7300, -13.8670], ['Lajares', 28.6780, -13.9380], ['El Cotillo', 28.6830, -14.0110], ['La Oliva', 28.6100, -13.9290],
    ['Villaverde', 28.6380, -13.9050], ['Tindaya', 28.5880, -13.9850], ['Puerto del Rosario', 28.5000, -13.8620], ['Tetir', 28.5260, -13.9280],
    ['Casillas del Ángel', 28.4880, -13.9550], ['Antigua', 28.4220, -14.0130], ['Caleta de Fuste', 28.3940, -13.8580], ['Betancuria', 28.4250, -14.0570],
    ['Ajuy', 28.4000, -14.1540], ['Pájara', 28.3500, -14.1080], ['Tuineje', 28.3240, -14.0480], ['Gran Tarajal', 28.2120, -14.0200],
    ['Tarajalejo', 28.1920, -14.1220], ['La Lajita', 28.1880, -14.1530], ['Costa Calma', 28.1600, -14.2280], ['Morro Jable', 28.0510, -14.3540]
  ];
  const townAt = (name) => TOWNS.find((x) => x[0] === name);
  const CATS = ['fiesta', 'musica', 'cultura', 'mercado', 'gastro', 'familia', 'deporte', 'surf', 'bike', 'run', 'otro'];
  const EMO = { fiesta: '🎉', musica: '🎵', cultura: '🎭', mercado: '🧺', gastro: '🍽', familia: '🧸', deporte: '🏅', surf: '🏄', bike: '🚴', run: '🏃', otro: '📌' };
  const GROUPS = [['all', 'cAll', null], ['party', 'cParty', ['fiesta']], ['cult', 'cCult', ['musica', 'cultura']], ['market', 'cMarket', ['mercado', 'gastro']], ['sport', 'cSport', ['deporte', 'surf', 'bike', 'run']], ['fam', 'cFam', ['familia']]];
  const SPORT_NAME = { surf: 'Surf', bike: { it: 'Bici', es: 'Bici', en: 'Bike', de: 'Rad' }, run: { it: 'Corsa', es: 'Running', en: 'Running', de: 'Lauf' } };
  const sportName = (s) => (typeof SPORT_NAME[s] === 'string' ? SPORT_NAME[s] : (SPORT_NAME[s] || {})[L()] || s);

  // ---- date nel fuso delle Canarie ----
  const fmtParts = new Intl.DateTimeFormat('en-US', { timeZone: TZ, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  function parts(d) {
    const p = {}; fmtParts.formatToParts(d).forEach((x) => { p[x.type] = x.value; });
    return { key: p.year + '-' + p.month + '-' + p.day, h: +p.hour % 24, mi: +p.minute };
  }
  const addDays = (key, n) => new Date(Date.parse(key + 'T12:00:00Z') + n * 864e5).toISOString().slice(0, 10);
  const wday = (key) => new Date(key + 'T12:00:00Z').getUTCDay();
  function toISO(dateKey, time) { // "2026-12-12" + "09:30" ora delle Canarie -> ISO UTC
    const [y, m, d] = dateKey.split('-').map(Number); const [h, mi] = (time || '00:00').split(':').map(Number);
    const guess = Date.UTC(y, m - 1, d, h, mi);
    const p = parts(new Date(guess)); const shown = Date.UTC(+p.key.slice(0, 4), +p.key.slice(5, 7) - 1, +p.key.slice(8, 10), p.h, p.mi);
    return new Date(guess - (shown - guess)).toISOString();
  }
  function info(e) {
    const s = parts(new Date(e.starts_at)), en = e.ends_at ? parts(new Date(e.ends_at)) : null;
    return { sk: s.key, ek: en ? en.key : s.key, allDay: s.h === 0 && s.mi === 0, time: String(s.h).padStart(2, '0') + ':' + String(s.mi).padStart(2, '0') };
  }
  const dayFmt = (key, o) => new Date(key + 'T12:00:00Z').toLocaleDateString(LOC[L()], Object.assign({ timeZone: 'UTC' }, o));

  // ---- dati ----
  let list = store.get('evCache', []) || [];
  let loadedAt = 0, loading = null;
  function load(force) {
    if (!force && Date.now() - loadedAt < 5 * 60000) return Promise.resolve(list);
    if (loading) return loading;
    const since = new Date(Date.now() - 60 * 864e5).toISOString();
    loading = sb.from('events').select('id,title,description,category,town,place_name,lat,lng,starts_at,ends_at,url,price,status,created_by')
      .neq('status', 'rejected').gte('starts_at', since).order('starts_at').limit(400)
      .then(({ data, error }) => { if (!error && data) { list = data; loadedAt = Date.now(); store.set('evCache', data.filter((x) => x.status === 'approved')); } return list; })
      .catch(() => list).finally(() => { loading = null; });
    return loading;
  }
  const todayKey = () => parts(new Date()).key;
  function upcoming(sport) {
    const tk = todayKey(), max = addDays(tk, 365);
    return list.filter((e) => { const i = info(e); return i.ek >= tk && i.sk <= max && (!sport || e.category === sport); }).sort((a, b) => Date.parse(a.starts_at) - Date.parse(b.starts_at));
  }
  function nearTown(e, town) {
    if (!town) return true;
    if (e.town === town) return true;
    const c = townAt(town);
    return !!(c && e.lat != null && M.distKm({ lat: c[1], lng: c[2] }, e) < 5);
  }

  // ---- lista ----
  const ui = { group: 'all' };
  function draw(box, opts) {
    opts = opts || {};
    const sport = opts.sport || null;
    const town = store.get('evTown', '') || '';
    box.innerHTML = '';
    box.classList.add('ev-box');
    // filtri: paese + tipo (o sport della modalità)
    const sel = el('select', { class: 'ev-town', 'aria-label': tr('town'), onchange: () => { store.set('evTown', sel.value); draw(box, opts); } },
      [el('option', { value: '', text: '📍 ' + tr('all') }), ...TOWNS.map((x) => el('option', { value: x[0], text: '📍 ' + x[0] }))]);
    sel.value = town;
    box.appendChild(el('div', { class: 'ev-filters' }, [sel]));
    if (sport) {
      box.appendChild(el('div', { class: 'disc-chips ev-chips' }, [
        el('button', { class: 'on', text: EMO[sport] + ' ' + tr('onlySport', { s: sportName(sport) }) }),
        el('button', { text: tr('showAll'), onclick: () => draw(box, Object.assign({}, opts, { sport: null })) })
      ]));
    } else {
      box.appendChild(el('div', { class: 'disc-chips ev-chips' }, GROUPS.map(([k, lbl]) => el('button', { class: ui.group === k ? 'on' : '', text: tr(lbl), onclick: () => { ui.group = k; draw(box, opts); } }))));
    }
    const listBox = el('div', { class: 'ev-list' });
    box.appendChild(listBox);
    const fill = () => {
      listBox.innerHTML = '';
      const cats = sport ? [sport] : (GROUPS.find((g) => g[0] === ui.group) || [])[2];
      const mine = (e) => e.status === 'approved' || e.created_by === M.uid;
      const items = upcoming(null).filter((e) => mine(e) && (!cats || cats.includes(e.category)) && nearTown(e, town));
      const tk = todayKey();
      // weekend: i prossimi ven/sab/dom (se è già weekend, i giorni che restano)
      const W = []; for (let i = 1; i <= 6 && W.length < 3; i++) { const k = addDays(tk, i), w = wday(k); if (w === 5 || w === 6 || w === 0) W.push(k); if (w === 0) break; }
      const g = { today: [], weekend: [], next: [] };
      items.forEach((e) => { const i = info(e); if (i.sk <= tk && i.ek >= tk) g.today.push(e); else if (W.length && i.sk <= W[W.length - 1] && i.ek >= W[0]) g.weekend.push(e); else g.next.push(e); });
      if (!items.length) {
        listBox.appendChild(el('div', { class: 'ev-empty' }, [el('div', { class: 'ev-empty-i', text: sport ? EMO[sport] : '🎉' }), el('b', { text: tr('empty', { w: town ? tr('inTown', { t: town }) : '' }).replace(' .', '.') }), el('span', { text: tr('emptyHint') })]));
      }
      [['today', g.today], ['weekend', g.weekend], ['next', g.next]].forEach(([k, arr]) => {
        if (!arr.length) return;
        listBox.appendChild(el('div', { class: 'disc-h', text: tr(k) }));
        arr.forEach((e) => listBox.appendChild(row(e, () => detail(box, e, opts))));
      });
      listBox.appendChild(el('button', { class: 'ev-add', onclick: () => form(box, opts, sport) }, [el('span', { text: '+' }), tr('propose')]));
    };
    fill();
    load().then(() => { if (box.isConnected && box.classList.contains('ev-box')) fill(); });
  }
  function row(e, onclick) {
    const i = info(e), pos = M.pos();
    const d = pos && e.lat != null ? M.distKm(pos, e) : null;
    const when = i.sk !== i.ek ? tr('from', { a: dayFmt(i.sk, { day: 'numeric', month: 'short' }), b: dayFmt(i.ek, { day: 'numeric', month: 'short' }) }) : dayFmt(i.sk, { weekday: 'short' }) + (i.allDay ? '' : ' · ' + i.time);
    return el('button', { class: 'ev-row', onclick }, [
      el('span', { class: 'ev-date' }, [el('b', { text: String(+i.sk.slice(8, 10)) }), el('small', { text: dayFmt(i.sk, { month: 'short' }).replace('.', '') })]),
      el('span', { class: 'ev-tx' }, [
        el('b', { text: e.title }),
        el('small', { text: [EMO[e.category] + ' ' + tr(e.category), e.town, when].filter(Boolean).join(' · ') }),
        e.status !== 'approved' ? el('em', { class: 'ev-pend', text: tr('pendTag') }) : null
      ]),
      d != null ? el('span', { class: 'ev-dist', text: d < 10 ? d.toFixed(1).replace('.', L() === 'en' ? '.' : ',') + ' km' : Math.round(d) + ' km' }) : null
    ]);
  }

  // ---- scheda evento ----
  function detail(box, e, opts) {
    const i = info(e);
    box.innerHTML = '';
    box.classList.remove('ev-box');
    const back = () => { draw(box, opts); box.scrollTop = 0; };
    const longDay = (k) => dayFmt(k, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const when = i.sk !== i.ek ? tr('from', { a: dayFmt(i.sk, { weekday: 'short', day: 'numeric', month: 'long' }), b: longDay(i.ek) }) : longDay(i.sk);
    const place = [e.place_name, e.town].filter(Boolean).join(', ');
    const pos = M.pos();
    const d = pos && e.lat != null ? M.distKm(pos, e) : null;
    box.append(
      el('button', { class: 'ev-back', onclick: back }, ['‹ ' + tr('back')]),
      el('div', { class: 'ev-card' }, [
        el('div', { class: 'ev-kick c-' + e.category, text: EMO[e.category] + ' ' + tr(e.category) }),
        el('h3', { class: 'ev-title', text: e.title }),
        el('div', { class: 'ev-line' }, [el('span', { text: '🗓' }), el('span', { text: when + (i.allDay ? '' : ' · ' + i.time) })]),
        place ? el('div', { class: 'ev-line' }, [el('span', { text: '📍' }), el('span', { text: place + (d != null ? ' · ' + (d < 10 ? d.toFixed(1) : Math.round(d)) + ' km' : '') })]) : null,
        e.price ? el('div', { class: 'ev-line' }, [el('span', { text: '🎟' }), el('span', { text: tr('price') + ': ' + e.price })]) : null,
        e.description ? el('p', { class: 'ev-desc', text: e.description }) : null,
        e.status !== 'approved' ? el('p', { class: 'ev-note', text: tr('pending') }) : null,
        el('div', { class: 'ev-acts' }, [
          e.lat != null ? el('button', { class: 'ev-go', onclick: () => go(e) }, [tr('go')]) : null,
          el('button', { onclick: () => ics(e) }, ['🗓 ' + tr('cal')]),
          el('button', { onclick: () => share(e, when) }, ['↗ ' + tr('share')]),
          e.url ? el('a', { href: e.url, target: '_blank', rel: 'noopener' }, ['🌐 ' + tr('web')]) : null
        ])
      ])
    );
    box.scrollTop = 0;
  }
  function go(e) {
    M.closeOverlays();
    const i = info(e);
    M.map.flyTo({ center: [e.lng, e.lat], zoom: Math.max(M.map.getZoom(), 14.5) });
    M.openPlace({ kind: 'event', kindLabel: EMO[e.category] + ' ' + tr(e.category), name: e.title, sub: [e.place_name || e.town, dayFmt(i.sk, { weekday: 'short', day: 'numeric', month: 'short' }) + (i.allDay ? '' : ' · ' + i.time)].filter(Boolean).join(' · '), lat: e.lat, lng: e.lng, icon: 'pin' });
  }
  function ics(e) {
    const i = info(e);
    const esc = (s) => String(s || '').replace(/\\/g, '\\\\').replace(/([,;])/g, '\\$1').replace(/\n/g, '\\n');
    const z = (iso) => iso.replace(/[-:]/g, '').replace(/\.\d+/, '');
    const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Maxora//Eventos//ES', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT', 'UID:' + e.id + '@maxora', 'DTSTAMP:' + z(new Date().toISOString())];
    if (i.allDay) lines.push('DTSTART;VALUE=DATE:' + i.sk.replace(/-/g, ''), 'DTEND;VALUE=DATE:' + addDays(i.ek, 1).replace(/-/g, ''));
    else lines.push('DTSTART:' + z(new Date(e.starts_at).toISOString()), 'DTEND:' + z(new Date(e.ends_at && i.sk === i.ek ? e.ends_at : Date.parse(e.starts_at) + 2 * 3600e3).toISOString()));
    lines.push('SUMMARY:' + esc(e.title));
    const place = [e.place_name, e.town, 'Fuerteventura'].filter(Boolean).join(', ');
    lines.push('LOCATION:' + esc(place));
    if (e.lat != null) lines.push('GEO:' + e.lat + ';' + e.lng);
    if (e.description || e.url) lines.push('DESCRIPTION:' + esc([e.description, e.url].filter(Boolean).join('\n\n')));
    if (e.url) lines.push('URL:' + e.url);
    lines.push('END:VEVENT', 'END:VCALENDAR');
    const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const a = el('a', { href: URL.createObjectURL(blob), download: e.title.replace(/[^\w\- ]+/g, '').trim().slice(0, 40) + '.ics' });
    document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  }
  function share(e, when) {
    const text = e.title + ' — ' + when + (e.town ? ' · ' + e.town : '');
    const url = e.url || location.origin + location.pathname;
    if (navigator.share) navigator.share({ title: e.title, text, url }).catch(() => {});
    else { try { navigator.clipboard.writeText(text + '\n' + url); M.toast('✓'); } catch (x) {} }
  }

  // ---- proponi un evento ----
  function form(box, opts, sport) {
    box.innerHTML = '';
    box.classList.remove('ev-box');
    const town0 = store.get('evTown', '') || '';
    const f = (lbl, input) => el('label', { class: 'ev-f' }, [el('span', { text: lbl }), input]);
    const title = el('input', { type: 'text', maxlength: '120', required: 'required' });
    const cat = el('select', {}, CATS.map((c) => el('option', { value: c, text: EMO[c] + ' ' + tr(c) })));
    cat.value = sport || 'fiesta';
    const date = el('input', { type: 'date', min: todayKey(), value: todayKey() });
    const time = el('input', { type: 'time' });
    const end = el('input', { type: 'date', min: todayKey() });
    const town = el('select', {}, [el('option', { value: '', text: '—' }), ...TOWNS.map((x) => el('option', { value: x[0], text: x[0] }))]);
    town.value = town0;
    const place = el('input', { type: 'text', maxlength: '120' });
    const url = el('input', { type: 'url', placeholder: 'https://', inputmode: 'url' });
    const desc = el('textarea', { rows: '3', maxlength: '1500' });
    const here = el('input', { type: 'checkbox' });
    const pos = M.pos();
    const send = el('button', { class: 'ev-go ev-send', text: tr('send') });
    send.addEventListener('click', async () => {
      const tv = title.value.trim();
      if (tv.length < 3 || !date.value || !town.value) { M.toast(tr('need')); return; }
      if (date.value < todayKey()) { M.toast(tr('past')); return; }
      const c = townAt(town.value);
      const ll = here.checked && pos ? pos : { lat: c[1], lng: c[2] };
      const u = url.value.trim();
      const row = {
        title: tv, category: cat.value, town: town.value, place_name: place.value.trim() || null,
        lat: +ll.lat.toFixed(5), lng: +ll.lng.toFixed(5), starts_at: toISO(date.value, time.value),
        ends_at: end.value && end.value > date.value ? toISO(end.value, '23:59') : null,
        url: u ? (/^https?:\/\//.test(u) ? u : 'https://' + u) : null, description: desc.value.trim() || null
      };
      send.disabled = true;
      const { error } = await sb.from('events').insert(row);
      send.disabled = false;
      if (error) { M.toast(tr('err', { e: error.message })); return; }
      M.toast(tr('sent'));
      store.set('evTown', town.value);
      await load(true);
      draw(box, opts);
    });
    box.append(
      el('button', { class: 'ev-back', onclick: () => draw(box, opts) }, ['‹ ' + tr('back')]),
      el('h3', { class: 'ev-title', text: tr('propose') }),
      el('div', { class: 'ev-form' }, [
        f(tr('fTitle'), title), f(tr('fCat'), cat),
        el('div', { class: 'ev-2' }, [f(tr('fDate'), date), f(tr('fTime'), time)]),
        f(tr('fEnd'), end), f(tr('fTown'), town), f(tr('fPlace'), place),
        pos ? el('label', { class: 'ev-chk' }, [here, el('span', { text: tr('fHere') })]) : null,
        f(tr('fUrl'), url), f(tr('fDesc'), desc),
        send, el('p', { class: 'p-note', text: tr('note') })
      ])
    );
    box.scrollTop = 0;
    setTimeout(() => title.focus(), 50);
  }

  // ---- pannello proprio (dal menu delle modalità) ----
  let ov = null;
  function open(sport) {
    if (!ov) {
      ov = el('div', { class: 'overlay hidden', id: 'eventsOverlay' }, [
        el('div', { class: 'panel tall', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'evTitle' }, [
          el('div', { class: 'panel-head' }, [el('h2', { id: 'evTitle' }), el('button', { class: 'icon-btn', 'data-close': '', 'aria-label': '✕', text: '✕' })]),
          el('div', { class: 'discover-list', id: 'evList' })
        ])
      ]);
      ov.addEventListener('click', (e) => { if (e.target === ov || e.target.closest('[data-close]')) ov.classList.add('hidden'); });
      document.body.appendChild(ov);
    }
    M.closeOverlays();
    ov.querySelector('#evTitle').textContent = sport ? tr('evMode', { s: sportName(sport) }) : tr('events');
    draw(ov.querySelector('#evList'), { sport });
    ov.classList.remove('hidden');
  }
  // per il menu delle modalità: "3 in arrivo"
  function countLabel(sport) { const n = upcoming(sport).filter((e) => e.status === 'approved').length; return n ? tr('upcoming', { n }) : tr('none0'); }

  // l'id dell'utente serve per mostrargli i suoi eventi in revisione
  sb.auth.getSession().then(({ data }) => { M.uid = data && data.session && data.session.user && data.session.user.id; }).catch(() => {});
  sb.auth.onAuthStateChange((_e, s) => { M.uid = s && s.user && s.user.id; });
  setTimeout(() => load(), 3000);

  window.MAXORA_EVENTS = { draw, open, load, label: () => tr('events'), countLabel, emoji: (s) => EMO[s] || '🎉' };
})();
