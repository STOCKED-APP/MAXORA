/* Maxora — centro de control (admin) */
(function () {
  'use strict';

  const CFG = window.MAXORA_CONFIG;
  // Sessione separata dall'app pubblica (stesso dominio, chiave diversa)
  const sb = supabase.createClient(CFG.supabaseUrl, CFG.supabaseKey, {
    auth: { storageKey: 'maxora-admin-auth', persistSession: true, autoRefreshToken: true }
  });

  // ------------------------------------------------------------------
  // Utilità
  // ------------------------------------------------------------------
  const $ = (id) => document.getElementById(id);
  function el(tag, attrs, kids) {
    const n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach((k) => {
      const v = attrs[k];
      if (v === undefined || v === null || v === false) return;
      if (k === 'class') n.className = v;
      else if (k === 'text') n.textContent = v;
      else if (k === 'style') n.setAttribute('style', v);
      else if (k === 'value') n.value = v;
      else if (k === 'checked') n.checked = !!v;
      else if (k.startsWith('on')) n.addEventListener(k.slice(2), v);
      else n.setAttribute(k, v === true ? '' : v);
    });
    (kids || []).forEach((c) => { if (c !== null && c !== undefined && c !== false) n.appendChild(typeof c === 'string' || typeof c === 'number' ? document.createTextNode(String(c)) : c); });
    return n;
  }
  let toastTimer;
  function toast(msg) {
    const n = $('toast');
    n.textContent = msg; n.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => n.classList.remove('show'), 2800);
  }
  const TZ = 'Atlantic/Canary';
  const fmtDT = (v) => v ? new Intl.DateTimeFormat('es-ES', { timeZone: TZ, day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(v)) : '—';
  const fmtD = (v) => v ? new Intl.DateTimeFormat('es-ES', { timeZone: TZ, day: '2-digit', month: 'short' }).format(new Date(v)) : '—';
  function ago(v) {
    const m = Math.round((Date.now() - new Date(v)) / 60000);
    if (m < 1) return 'ahora';
    if (m < 60) return 'hace ' + m + ' min';
    if (m < 1440) return 'hace ' + Math.floor(m / 60) + ' h';
    return 'hace ' + Math.floor(m / 1440) + ' d';
  }
  function until(v) {
    const m = Math.round((new Date(v) - Date.now()) / 60000);
    if (m <= 0) return 'caducado';
    if (m < 60) return m + ' min';
    return Math.floor(m / 60) + ' h ' + (m % 60) + ' min';
  }
  const shortId = (id) => (id ? String(id).slice(0, 8) : '—');
  const toLocalInput = (d) => { const x = new Date(d); x.setMinutes(x.getMinutes() - x.getTimezoneOffset()); return x.toISOString().slice(0, 16); };
  const fromLocalInput = (s) => (s ? new Date(s).toISOString() : null);
  const isLive = (r) => !r.removed_at && new Date(r.expires_at) > new Date();
  const LANGS = ['es', 'en', 'it', 'de'];
  const LANG_NAMES = { es: 'Español', en: 'English', it: 'Italiano', de: 'Deutsch' };
  function fail(error, what) { console.error(error); toast((what || 'Error') + ': ' + ((error && error.message) || 'desconocido')); }

  let TYPES = new Map();
  const typeOf = (k) => TYPES.get(k) || { key: k, icon: '•', labels: { es: k }, color: '#888', is_police: false };
  const typeLabel = (k) => { const t = typeOf(k); return (t.labels && t.labels.es) || k; };
  function typeSwatch(k) {
    const t = typeOf(k);
    const s = el('span', { class: 'sw' + (t.is_police ? ' police' : '') });
    if (!t.is_police) s.style.background = t.color;
    return s;
  }
  async function loadTypes() {
    const { data } = await sb.from('report_types').select('*').order('sort');
    TYPES = new Map((data || []).map((x) => [x.key, x]));
  }

  // ------------------------------------------------------------------
  // Tema
  // ------------------------------------------------------------------
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  let theme = localStorage.getItem('maxora_admin_theme') || 'auto';
  const isDark = () => theme === 'dark' || (theme === 'auto' && mq.matches);
  const mapStyle = () => (isDark() ? CFG.mapStyles.dark : CFG.mapStyles.light);
  function applyTheme() {
    document.documentElement.dataset.theme = isDark() ? 'dark' : 'light';
    $('themeBtn').textContent = 'Tema: ' + ({ auto: 'auto', light: 'claro', dark: 'oscuro' })[theme];
  }
  $('themeBtn').addEventListener('click', () => {
    theme = ({ auto: 'light', light: 'dark', dark: 'auto' })[theme];
    localStorage.setItem('maxora_admin_theme', theme);
    applyTheme();
    route();
  });
  mq.addEventListener('change', () => { if (theme === 'auto') { applyTheme(); route(); } });

  // ------------------------------------------------------------------
  // Mappe
  // ------------------------------------------------------------------
  let maps = [];
  function makeMap(container, center, zoom) {
    const m = new maplibregl.Map({
      container, style: mapStyle(),
      center: center ? [center.lng, center.lat] : [-14.02, 28.40],
      zoom: zoom || 8.3, attributionControl: { compact: true }
    });
    m.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
    maps.push(m);
    return m;
  }
  function pickerMap(container, lat, lng, onPick) {
    const has = lat != null && lng != null && lat !== '' && lng !== '';
    const m = makeMap(container, has ? { lat: Number(lat), lng: Number(lng) } : null, has ? 13 : 8.3);
    const mk = new maplibregl.Marker({ element: el('div', { class: 'pick' }), draggable: true });
    if (has) mk.setLngLat([Number(lng), Number(lat)]).addTo(m);
    const set = (ll) => { mk.setLngLat(ll).addTo(m); onPick(Number(ll.lat.toFixed(6)), Number(ll.lng.toFixed(6))); };
    m.on('click', (e) => set(e.lngLat));
    mk.on('dragend', () => set(mk.getLngLat()));
    return { map: m, setPos: (la, ln) => { if (la !== '' && ln !== '' && !isNaN(la) && !isNaN(ln)) mk.setLngLat([Number(ln), Number(la)]).addTo(m); } };
  }

  // ------------------------------------------------------------------
  // Foto (bucket "media")
  // ------------------------------------------------------------------
  async function upload(file, folder) {
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '');
    const path = folder + '/' + crypto.randomUUID() + '.' + ext;
    const { error } = await sb.storage.from('media').upload(path, file, { cacheControl: '31536000', upsert: false, contentType: file.type });
    if (error) throw error;
    return sb.storage.from('media').getPublicUrl(path).data.publicUrl;
  }

  // ------------------------------------------------------------------
  // Accesso
  // ------------------------------------------------------------------
  let me = null;
  async function checkAdmin() {
    const { data: { session } } = await sb.auth.getSession();
    if (!session || session.user.is_anonymous) return false;
    const { data, error } = await sb.rpc('is_admin');
    if (error || !data) return false;
    me = session.user;
    return true;
  }
  $('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    $('loginErr').textContent = '';
    $('loginBtn').disabled = true;
    const { error } = await sb.auth.signInWithPassword({ email: $('loginEmail').value.trim(), password: $('loginPass').value });
    $('loginBtn').disabled = false;
    if (error) { $('loginErr').textContent = 'Email o contraseña incorrectos.'; return; }
    if (!(await checkAdmin())) {
      await sb.auth.signOut();
      $('loginErr').textContent = 'Esta cuenta no tiene permisos de administrador.';
      return;
    }
    start();
  });
  $('logoutBtn').addEventListener('click', async () => { await sb.auth.signOut(); location.hash = ''; location.reload(); });

  // ------------------------------------------------------------------
  // Router
  // ------------------------------------------------------------------
  let timers = [];
  let pendingCenter = null;
  const VIEWS = {};
  function clearView() {
    timers.forEach(clearInterval); timers = [];
    maps.forEach((m) => { try { m.remove(); } catch (e) {} }); maps = [];
    $('view').innerHTML = ''; $('headActions').innerHTML = '';
  }
  function route() {
    const key = (location.hash || '#dashboard').slice(1);
    const v = VIEWS[key] || VIEWS.dashboard;
    clearView();
    document.querySelectorAll('.rail > button').forEach((b) => b.classList.toggle('on', b.dataset.view === key || (!VIEWS[key] && b.dataset.view === 'dashboard')));
    $('viewEyebrow').textContent = v.eyebrow;
    $('viewTitle').textContent = v.title;
    document.title = v.title + ' · Maxora';
    v.render($('view'), $('headActions'));
  }
  document.querySelectorAll('.rail > button').forEach((b) => b.addEventListener('click', () => { location.hash = b.dataset.view; }));
  window.addEventListener('hashchange', route);

  // ------------------------------------------------------------------
  // PANORAMA
  // ------------------------------------------------------------------
  let statDays = 7;
  VIEWS.dashboard = {
    eyebrow: 'En directo', title: 'Panorama',
    async render(view, head) {
      const seg = el('div', { class: 'seg' }, [1, 7, 30].map((d) => el('button', { class: d === statDays ? 'on' : '', text: d === 1 ? 'Hoy' : d + ' días', onclick: () => { statDays = d; route(); } })));
      head.append(seg, el('button', { class: 'btn small', text: 'Actualizar', onclick: route }));
      const { data: s, error } = await sb.rpc('admin_stats', { p_days: statDays });
      if (error) return fail(error, 'Estadísticas');

      view.appendChild(el('div', { class: 'kpis' }, [
        kpi('Avisos activos', s.active_now, 'hot'),
        kpi('Hoy', s.today),
        kpi(statDays === 1 ? 'Últimas 24 h' : 'Últimos ' + statDays + ' días', s.period_total),
        kpi('En disputa', s.disputed, s.disputed ? 'warn' : ''),
        kpi('Dispositivos 24 h', s.devices_24h),
        kpi('Dispositivos 7 días', s.devices_7d),
        kpi('Dispositivos total', s.devices_total),
        kpi('Bloqueados', s.blocked)
      ]));

      // Por día
      const days = [];
      const byDay = new Map((s.by_day || []).map((x) => [x.day, x.n]));
      const span = Math.max(statDays, 1);
      for (let i = span - 1; i >= 0; i--) {
        const d = new Date(Date.now() - i * 86400000);
        const key = new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(d);
        days.push({ label: fmtD(d), n: byDay.get(key) || 0 });
      }
      const hours = [];
      for (let h = 0; h < 24; h++) hours.push({ label: String(h).padStart(2, '0'), n: (s.by_hour || {})[h] || 0 });

      view.appendChild(el('div', { class: 'grid cols-2' }, [
        el('div', { class: 'panel' }, [el('h2', { text: 'Avisos por día' }), el('p', { class: 'sub', text: 'Cuántos avisos crea la gente cada día.' }), bars(days, span > 10 ? 5 : 1)]),
        el('div', { class: 'panel' }, [el('h2', { text: 'Horas con más avisos' }), el('p', { class: 'sub', text: 'Hora de Canarias. Útil para saber cuándo vigilar.' }), bars(hours, 3)])
      ]));

      const byType = Object.entries(s.by_type || {}).sort((a, b) => b[1] - a[1]);
      const maxT = Math.max(1, ...byType.map((x) => x[1]));
      const zones = s.hot_zones || [];
      view.appendChild(el('div', { class: 'grid cols-2', style: 'margin-top:16px' }, [
        el('div', { class: 'panel' }, [
          el('h2', { text: 'Por tipo' }),
          el('p', { class: 'sub', text: 'Qué se avisa más en el periodo.' }),
          byType.length ? el('div', { class: 'hbars' }, byType.map(([k, n]) => {
            const t = typeOf(k);
            return el('div', { class: 'hbar' }, [
              el('span', { class: 'row', style: 'gap:8px;flex-wrap:nowrap' }, [typeSwatch(k), typeLabel(k)]),
              el('div', { class: 'track' }, [el('i', { style: 'width:' + (n / maxT * 100) + '%;background:' + (t.is_police ? 'var(--blue)' : t.color) })]),
              el('b', { text: String(n) })
            ]);
          })) : el('div', { class: 'empty', text: 'Todavía no hay avisos.' })
        ]),
        el('div', { class: 'panel' }, [
          el('h2', { text: 'Puntos calientes' }),
          el('p', { class: 'sub', text: 'Zonas (~1 km) con más avisos en el periodo.' }),
          zones.length ? el('div', { class: 'table-wrap' }, [el('table', {}, [
            el('thead', {}, [el('tr', {}, [el('th', { text: 'Zona' }), el('th', { text: 'Avisos' }), el('th', {})])]),
            el('tbody', {}, zones.map((z) => el('tr', {}, [
              el('td', { class: 'id', text: z.lat + ', ' + z.lng }),
              el('td', {}, [el('b', { text: String(z.n) })]),
              el('td', {}, [el('button', { class: 'btn small', text: 'Ver en mapa', onclick: () => { pendingCenter = { lat: Number(z.lat), lng: Number(z.lng) }; reportFilter = 'recent'; location.hash = 'reports'; } })])
            ])))
          ])]) : el('div', { class: 'empty', text: 'Sin datos todavía.' })
        ])
      ]));
    }
  };
  function kpi(k, v, cls) { return el('div', { class: 'kpi ' + (cls || '') }, [el('div', { class: 'k', text: k }), el('div', { class: 'v', text: String(v ?? 0) })]); }
  function bars(items, labelEvery) {
    const max = Math.max(1, ...items.map((x) => x.n));
    return el('div', { class: 'bars' }, items.map((x, i) => el('div', { class: 'b', title: x.label + ': ' + x.n }, [
      x.n ? el('em', { text: String(x.n) }) : null,
      el('i', { style: 'height:' + (x.n / max * 100) + '%' }),
      el('span', { text: i % labelEvery === 0 ? x.label : '' })
    ])));
  }

  // ------------------------------------------------------------------
  // AVISOS (moderación)
  // ------------------------------------------------------------------
  let reportFilter = 'active';
  VIEWS.reports = {
    eyebrow: 'En directo', title: 'Avisos',
    async render(view, head) {
      const filters = [['active', 'Activos'], ['disputed', 'En disputa'], ['recent', 'Últimos 7 días'], ['removed', 'Eliminados']];
      head.append(
        el('div', { class: 'seg' }, filters.map(([k, l]) => el('button', { class: k === reportFilter ? 'on' : '', text: l, onclick: () => { reportFilter = k; route(); } }))),
        el('button', { class: 'btn small', text: 'Actualizar', onclick: () => load() })
      );
      const mapBox = el('div', { class: 'amap' });
      const tableBox = el('div');
      view.append(mapBox, tableBox);
      const m = makeMap(mapBox, pendingCenter, pendingCenter ? 13 : null);
      pendingCenter = null;
      const mks = new Map();
      let rows = [];
      let selected = null;

      async function load() {
        const now = new Date().toISOString();
        let q = sb.from('reports').select('*').order('created_at', { ascending: false }).limit(500);
        if (reportFilter === 'active' || reportFilter === 'disputed') q = q.gt('expires_at', now).is('removed_at', null);
        if (reportFilter === 'disputed') q = q.gt('denies', 0);
        if (reportFilter === 'recent') q = q.gte('created_at', new Date(Date.now() - 7 * 86400000).toISOString());
        if (reportFilter === 'removed') q = q.not('removed_at', 'is', null);
        const { data, error } = await q;
        if (error) return fail(error, 'Avisos');
        rows = reportFilter === 'disputed' ? data.filter((r) => r.denies >= r.confirms) : data;
        draw();
      }

      function draw() {
        for (const [, mk] of mks) mk.remove();
        mks.clear();
        rows.forEach((r) => {
          const t = typeOf(r.type);
          const n = el('div', { class: 'mk' + (t.is_police ? ' police' : '') + (isLive(r) ? '' : ' dead') + (r.id === selected ? ' sel' : ''), title: typeLabel(r.type) });
          if (!t.is_police) { n.style.background = t.color; n.textContent = t.icon; }
          n.addEventListener('click', () => { selected = r.id; draw(); });
          mks.set(r.id, new maplibregl.Marker({ element: n }).setLngLat([r.lng, r.lat]).addTo(m));
        });

        tableBox.innerHTML = '';
        if (!rows.length) { tableBox.appendChild(el('div', { class: 'panel empty', text: 'No hay avisos en este filtro.' })); return; }
        tableBox.appendChild(el('div', { class: 'table-wrap' }, [el('table', {}, [
          el('thead', {}, [el('tr', {}, ['Tipo', 'Creado', 'Caduca', 'Votos', 'Origen', 'Dispositivo', ''].map((h) => el('th', { text: h })))]),
          el('tbody', {}, rows.map((r) => {
            const live = isLive(r);
            const status = r.removed_at ? el('span', { class: 'pill bad', text: 'eliminado' }) : live ? el('span', { text: until(r.expires_at) }) : el('span', { class: 'muted', text: 'caducado' });
            const acts = el('div', { class: 'acts' });
            if (!r.removed_at) {
              acts.append(
                el('button', { class: 'btn small', text: '+30 min', onclick: (e) => { e.stopPropagation(); extend(r, 30); } }),
                live ? el('button', { class: 'btn small', text: 'Caducar', onclick: (e) => { e.stopPropagation(); expire(r); } }) : null,
                el('button', { class: 'btn small danger', text: 'Eliminar', onclick: (e) => { e.stopPropagation(); removeR(r); } })
              );
            } else {
              acts.append(el('button', { class: 'btn small', text: 'Restaurar', onclick: (e) => { e.stopPropagation(); restore(r); } }));
            }
            if (r.user_id && r.source === 'user') acts.append(el('button', { class: 'btn small danger', text: 'Bloquear', onclick: (e) => { e.stopPropagation(); blockUser(r.user_id).then(load); } }));
            return el('tr', { class: r.id === selected ? 'sel' : '', style: 'cursor:pointer', onclick: () => { selected = r.id; m.flyTo({ center: [r.lng, r.lat], zoom: 13 }); draw(); } }, [
              el('td', {}, [el('span', { class: 'row', style: 'gap:8px;flex-wrap:nowrap' }, [typeSwatch(r.type), el('span', {}, [typeLabel(r.type), r.title ? el('div', { class: 'muted', text: r.title }) : null])])]),
              el('td', { title: fmtDT(r.created_at), text: ago(r.created_at) }),
              el('td', {}, [status]),
              el('td', {}, [el('span', { class: 'pill ok', text: '✓ ' + r.confirms }), ' ', el('span', { class: 'pill bad', text: '✗ ' + r.denies })]),
              el('td', {}, [el('span', { class: 'pill' + (r.official ? ' warn' : ''), text: r.source === 'admin' ? (r.official ? 'oficial' : 'admin') : r.source === 'dgt' ? 'DGT' : 'usuario' })]),
              el('td', { class: 'id', text: shortId(r.user_id) }),
              el('td', {}, [acts])
            ]);
          }))
        ])]));
      }

      async function upd(r, patch, msg) {
        const { error } = await sb.from('reports').update(patch).eq('id', r.id);
        if (error) return fail(error, 'Aviso');
        toast(msg); load();
      }
      const extend = (r, mins) => upd(r, { expires_at: new Date(Math.max(Date.now(), new Date(r.expires_at)) + mins * 60000).toISOString() }, 'Ampliado ' + mins + ' min');
      const expire = (r) => upd(r, { expires_at: new Date().toISOString() }, 'Aviso caducado');
      const removeR = (r) => { if (confirm('¿Eliminar este aviso? Desaparece de la app al momento.')) upd(r, { removed_at: new Date().toISOString(), removed_by: me.id }, 'Aviso eliminado'); };
      const restore = (r) => upd(r, { removed_at: null, removed_by: null, expires_at: isLive({ ...r, removed_at: null }) ? r.expires_at : new Date(Date.now() + 3600000).toISOString() }, 'Aviso restaurado');

      await load();
      timers.push(setInterval(load, 30000));
    }
  };

  async function blockUser(userId, reasonIn) {
    const reason = reasonIn !== undefined ? reasonIn : prompt('Motivo del bloqueo (opcional):', 'Avisos falsos');
    if (reason === null) return;
    const { error } = await sb.from('blocked_users').upsert({ user_id: userId, reason: reason || null, blocked_by: me.id });
    if (error) return fail(error, 'Bloqueo');
    toast('Dispositivo bloqueado');
  }

  // ------------------------------------------------------------------
  // AVISO OFICIAL
  // ------------------------------------------------------------------
  VIEWS.official = {
    eyebrow: 'En directo', title: 'Aviso oficial',
    async render(view) {
      const types = [...TYPES.values()].sort((a, b) => a.sort - b.sort);
      const f = {
        type: el('select', {}, types.map((t) => el('option', { value: t.key, text: t.labels.es + (t.admin_only ? ' (solo admin)' : '') }))),
        title: el('input', { placeholder: 'Ej. FV-1 cortada por carrera ciclista', maxlength: '120' }),
        dur: el('input', { type: 'number', min: '5', max: '10080', value: '60' }),
        official: el('input', { type: 'checkbox', checked: true }),
        lat: el('input', { type: 'number', step: 'any', placeholder: '28.5' }),
        lng: el('input', { type: 'number', step: 'any', placeholder: '-13.86' })
      };
      f.type.addEventListener('change', () => { f.dur.value = typeOf(f.type.value).duration_min; });
      f.dur.value = types[0] ? types[0].duration_min : 60;
      const mapBox = el('div', { class: 'amap small' });
      const save = el('button', { class: 'btn primary', text: 'Publicar aviso' });

      view.appendChild(el('div', { class: 'grid cols-2' }, [
        el('div', { class: 'panel' }, [
          el('h2', { text: 'Nuevo aviso con tu firma' }),
          el('p', { class: 'sub', text: 'Aparece con la etiqueta "Oficial", con la duración que elijas. Toca el mapa para colocarlo.' }),
          el('div', { class: 'grid' }, [
            el('label', {}, ['Tipo', f.type]),
            el('label', {}, ['Texto (opcional)', f.title]),
            el('div', { class: 'grid cols-3' }, [el('label', {}, ['Duración (min)', f.dur]), el('label', {}, ['Latitud', f.lat]), el('label', {}, ['Longitud', f.lng])]),
            el('label', { class: 'check' }, [f.official, 'Mostrar como oficial']),
            el('div', { class: 'row' }, [save])
          ])
        ]),
        el('div', { class: 'panel' }, [el('h2', { text: 'Posición' }), el('p', { class: 'sub', text: 'Toca o arrastra el punto.' }), mapBox])
      ]));
      const pk = pickerMap(mapBox, null, null, (la, ln) => { f.lat.value = la; f.lng.value = ln; });
      [f.lat, f.lng].forEach((i) => i.addEventListener('change', () => pk.setPos(f.lat.value, f.lng.value)));

      const listBox = el('div', { style: 'margin-top:16px' });
      view.appendChild(listBox);
      async function loadMine() {
        const { data } = await sb.from('reports').select('*').eq('source', 'admin').gt('expires_at', new Date().toISOString()).is('removed_at', null).order('created_at', { ascending: false });
        listBox.innerHTML = '';
        listBox.appendChild(el('div', { class: 'panel' }, [
          el('h2', { text: 'Tus avisos activos' }),
          (data || []).length ? el('div', { class: 'table-wrap', style: 'margin-top:12px' }, [el('table', {}, [
            el('thead', {}, [el('tr', {}, ['Tipo', 'Texto', 'Caduca', ''].map((h) => el('th', { text: h })))]),
            el('tbody', {}, data.map((r) => el('tr', {}, [
              el('td', {}, [el('span', { class: 'row', style: 'gap:8px' }, [typeSwatch(r.type), typeLabel(r.type)])]),
              el('td', { text: r.title || '—' }),
              el('td', { text: until(r.expires_at) }),
              el('td', {}, [el('button', { class: 'btn small', text: 'Terminar ahora', onclick: async () => {
                const { error } = await sb.from('reports').update({ expires_at: new Date().toISOString() }).eq('id', r.id);
                if (error) return fail(error); toast('Aviso terminado'); loadMine();
              } })])
            ])))
          ])]) : el('p', { class: 'sub', text: 'Ninguno ahora mismo.' })
        ]));
      }
      save.addEventListener('click', async () => {
        if (!f.lat.value || !f.lng.value) return toast('Coloca el aviso en el mapa');
        const mins = Math.max(5, Number(f.dur.value) || 60);
        save.disabled = true;
        const { error } = await sb.from('reports').insert({
          type: f.type.value, title: f.title.value.trim() || null,
          lat: Number(f.lat.value), lng: Number(f.lng.value),
          official: f.official.checked, expires_at: new Date(Date.now() + mins * 60000).toISOString()
        });
        save.disabled = false;
        if (error) return fail(error, 'Aviso');
        toast('Aviso publicado');
        f.title.value = '';
        loadMine();
      });
      loadMine();
    }
  };

  // ------------------------------------------------------------------
  // DISPOSITIVOS
  // ------------------------------------------------------------------
  VIEWS.users = {
    eyebrow: 'En directo', title: 'Dispositivos',
    async render(view, head) {
      const search = el('input', { placeholder: 'Buscar por ID…', style: 'width:200px' });
      head.append(search);
      const since = new Date(Date.now() - 30 * 86400000).toISOString();
      const [dv, bl, rp] = await Promise.all([
        sb.from('devices').select('*').order('last_seen', { ascending: false }).limit(1000),
        sb.from('blocked_users').select('*').order('blocked_at', { ascending: false }),
        sb.from('reports').select('user_id').gte('created_at', since).eq('source', 'user').limit(10000)
      ]);
      if (dv.error) return fail(dv.error, 'Dispositivos');
      const counts = new Map();
      (rp.data || []).forEach((r) => counts.set(r.user_id, (counts.get(r.user_id) || 0) + 1));
      const blocked = new Map((bl.data || []).map((b) => [b.user_id, b]));

      // Blocco manuale
      const mId = el('input', { placeholder: 'ID completo del dispositivo' });
      const mWhy = el('input', { placeholder: 'Motivo' });
      view.appendChild(el('div', { class: 'panel' }, [
        el('h2', { text: 'Bloqueados (' + blocked.size + ')' }),
        el('p', { class: 'sub', text: 'Un dispositivo bloqueado puede ver la app pero no puede avisar ni votar.' }),
        blocked.size ? el('div', { class: 'table-wrap' }, [el('table', {}, [
          el('thead', {}, [el('tr', {}, ['Dispositivo', 'Motivo', 'Desde', ''].map((h) => el('th', { text: h })))]),
          el('tbody', {}, [...blocked.values()].map((b) => el('tr', {}, [
            el('td', { class: 'id', text: b.user_id }),
            el('td', { text: b.reason || '—' }),
            el('td', { text: fmtDT(b.blocked_at) }),
            el('td', {}, [el('button', { class: 'btn small', text: 'Desbloquear', onclick: () => unblock(b.user_id) })])
          ])))
        ])]) : null,
        el('div', { class: 'grid cols-3', style: 'margin-top:14px;align-items:end' }, [
          el('label', {}, ['Bloquear por ID', mId]), el('label', {}, ['Motivo', mWhy]),
          el('button', { class: 'btn dark', text: 'Bloquear', onclick: async () => {
            const id = mId.value.trim();
            if (!/^[0-9a-f-]{36}$/i.test(id)) return toast('ID no válido');
            await blockUser(id, mWhy.value.trim()); route();
          } })
        ])
      ]));

      const tableBox = el('div', { style: 'margin-top:16px' });
      view.appendChild(tableBox);
      function draw() {
        const q = search.value.trim().toLowerCase();
        const rows = (dv.data || []).filter((d) => !q || d.user_id.startsWith(q));
        tableBox.innerHTML = '';
        if (!rows.length) { tableBox.appendChild(el('div', { class: 'panel empty', text: 'Todavía no hay dispositivos.' })); return; }
        tableBox.appendChild(el('div', { class: 'table-wrap' }, [el('table', {}, [
          el('thead', {}, [el('tr', {}, ['Dispositivo', 'Última vez', 'Primera vez', 'Idioma', 'Plataforma', 'Versión', 'Avisos 30 d', 'Estado', ''].map((h) => el('th', { text: h })))]),
          el('tbody', {}, rows.slice(0, 300).map((d) => {
            const isB = blocked.has(d.user_id);
            return el('tr', {}, [
              el('td', { class: 'id', title: d.user_id, text: shortId(d.user_id) }),
              el('td', { text: ago(d.last_seen) }),
              el('td', { text: fmtD(d.first_seen) }),
              el('td', { text: (d.lang || '—').toUpperCase() }),
              el('td', { text: d.platform || '—' }),
              el('td', { class: 'id', text: d.app_version || '—' }),
              el('td', {}, [el('b', { text: String(counts.get(d.user_id) || 0) })]),
              el('td', {}, [el('span', { class: 'pill ' + (isB ? 'bad' : 'ok'), text: isB ? 'bloqueado' : 'activo' })]),
              el('td', {}, [isB ? el('button', { class: 'btn small', text: 'Desbloquear', onclick: () => unblock(d.user_id) }) : el('button', { class: 'btn small danger', text: 'Bloquear', onclick: () => blockUser(d.user_id).then(route) })])
            ]);
          }))
        ])]));
      }
      search.addEventListener('input', draw);
      draw();
      async function unblock(id) {
        const { error } = await sb.from('blocked_users').delete().eq('user_id', id);
        if (error) return fail(error); toast('Desbloqueado'); route();
      }
    }
  };

  // ------------------------------------------------------------------
  // INTERRUTTORI E REGOLE
  // ------------------------------------------------------------------
  VIEWS.rules = {
    eyebrow: 'Configuración', title: 'Interruptores y reglas',
    async render(view) {
      const { data } = await sb.from('app_settings').select('*');
      const S = {}; (data || []).forEach((x) => { S[x.key] = x.value; });
      async function put(key, value, msg) {
        const { error } = await sb.from('app_settings').upsert({ key, value });
        if (error) { fail(error, 'Ajuste'); return false; }
        S[key] = value; if (msg) toast(msg); return true;
      }

      // Interruttori
      function sw(key, title, desc, onMsg, offMsg) {
        const input = el('input', { type: 'checkbox', checked: S[key] === true, 'aria-label': title });
        input.addEventListener('change', async () => {
          if (key === 'maintenance' && input.checked && !confirm('¿Activar mantenimiento? Nadie podrá avisar hasta que lo apagues.')) { input.checked = false; return; }
          if (!(await put(key, input.checked, input.checked ? onMsg : offMsg))) input.checked = !input.checked;
        });
        return el('div', { class: 'switch-row' }, [el('div', {}, [el('div', { class: 't', text: title }), el('div', { class: 'd', text: desc })]), el('label', { class: 'switch' }, [input, el('span')])]);
      }
      view.appendChild(el('div', { class: 'panel' }, [
        el('h2', { text: 'Interruptores' }),
        el('p', { class: 'sub', text: 'Cambian la app de todos al instante, sin publicar nada.' }),
        sw('police_enabled', 'Presencia policial', 'Apagado: desaparece el botón y todas las zonas policiales de la mapa. Úsalo si cambia la ley.', 'Policía activada', 'Policía desactivada en toda la app'),
        sw('maintenance', 'Modo mantenimiento', 'La app sigue mostrando la mapa pero nadie puede crear avisos. Aparece un mensaje arriba.', 'Mantenimiento activado', 'Mantenimiento desactivado')
      ]));

      // Numeri
      const rl = S.rate_limit || { count: 5, minutes: 10 };
      const n = {
        grid: el('input', { type: 'number', step: '0.5', min: '1', value: S.police_grid_km ?? 3 }),
        radius: el('input', { type: 'number', step: '0.5', min: '0.5', value: S.police_radius_km ?? 2.5 }),
        deny: el('input', { type: 'number', min: '1', value: S.deny_threshold ?? 2 }),
        ext: el('input', { type: 'number', min: '0', value: S.confirm_extend_min ?? 15 }),
        rlc: el('input', { type: 'number', min: '1', value: rl.count }),
        rlm: el('input', { type: 'number', min: '1', value: rl.minutes })
      };
      view.appendChild(el('div', { class: 'panel' }, [
        el('h2', { text: 'Reglas' }),
        el('p', { class: 'sub', text: 'Cómo se comportan los avisos.' }),
        el('div', { class: 'grid cols-3' }, [
          el('label', {}, ['Policía: tamaño cuadrícula (km)', n.grid]),
          el('label', {}, ['Policía: radio mostrado (km)', n.radius]),
          el('label', {}, ['"Ya no" para quitar un aviso', n.deny]),
          el('label', {}, ['Minutos extra por cada "Sigue"', n.ext]),
          el('label', {}, ['Máx. avisos por dispositivo', n.rlc]),
          el('label', {}, ['…cada (minutos)', n.rlm])
        ]),
        el('div', { class: 'row', style: 'margin-top:14px' }, [el('button', { class: 'btn primary', text: 'Guardar reglas', onclick: async () => {
          const ok = await put('police_grid_km', Number(n.grid.value)) && await put('police_radius_km', Number(n.radius.value)) &&
            await put('deny_threshold', Number(n.deny.value)) && await put('confirm_extend_min', Number(n.ext.value)) &&
            await put('rate_limit', { count: Number(n.rlc.value), minutes: Number(n.rlm.value) });
          if (ok) toast('Reglas guardadas');
        } })])
      ]));

      // Zona
      const bb = S.bbox || {}; const mc = S.map_center || {};
      const z = {
        minLat: el('input', { type: 'number', step: 'any', value: bb.min_lat }), maxLat: el('input', { type: 'number', step: 'any', value: bb.max_lat }),
        minLng: el('input', { type: 'number', step: 'any', value: bb.min_lng }), maxLng: el('input', { type: 'number', step: 'any', value: bb.max_lng }),
        cLat: el('input', { type: 'number', step: 'any', value: mc.lat }), cLng: el('input', { type: 'number', step: 'any', value: mc.lng }), cZoom: el('input', { type: 'number', step: '0.1', value: mc.zoom })
      };
      view.appendChild(el('div', { class: 'panel' }, [
        el('h2', { text: 'Zona de servicio' }),
        el('p', { class: 'sub', text: 'Fuera de este rectángulo no se aceptan avisos. Hoy cubre todas las Canarias.' }),
        el('div', { class: 'grid cols-4' }, [
          el('label', {}, ['Lat. mín.', z.minLat]), el('label', {}, ['Lat. máx.', z.maxLat]), el('label', {}, ['Long. mín.', z.minLng]), el('label', {}, ['Long. máx.', z.maxLng]),
          el('label', {}, ['Centro mapa: lat.', z.cLat]), el('label', {}, ['Centro mapa: long.', z.cLng]), el('label', {}, ['Zoom inicial', z.cZoom])
        ]),
        el('div', { class: 'row', style: 'margin-top:14px' }, [el('button', { class: 'btn primary', text: 'Guardar zona', onclick: async () => {
          const ok = await put('bbox', { min_lat: Number(z.minLat.value), max_lat: Number(z.maxLat.value), min_lng: Number(z.minLng.value), max_lng: Number(z.maxLng.value) }) &&
            await put('map_center', { lat: Number(z.cLat.value), lng: Number(z.cLng.value), zoom: Number(z.cZoom.value) });
          if (ok) toast('Zona guardada');
        } })])
      ]));

      // Tipi di avviso
      await loadTypes();
      const typesPanel = el('div', { class: 'panel' }, [
        el('h2', { text: 'Tipos de aviso' }),
        el('p', { class: 'sub', text: 'Nombre en 4 idiomas, color, duración y si los usuarios pueden usarlo. "Solo admin" = solo desde Aviso oficial.' })
      ]);
      const tbody = el('tbody');
      [...TYPES.values()].sort((a, b) => a.sort - b.sort).forEach((t) => {
        const i = {
          icon: el('input', { value: t.icon, style: 'width:56px;text-align:center', maxlength: '4' }),
          color: el('input', { type: 'color', value: t.color, style: 'width:56px' }),
          labels: LANGS.map((l) => el('input', { value: (t.labels || {})[l] || '', placeholder: l.toUpperCase(), style: 'min-width:120px' })),
          dur: el('input', { type: 'number', min: '5', value: t.duration_min, style: 'width:80px' }),
          sort: el('input', { type: 'number', value: t.sort, style: 'width:64px' }),
          enabled: el('input', { type: 'checkbox', checked: t.enabled }),
          admin: el('input', { type: 'checkbox', checked: t.admin_only })
        };
        tbody.appendChild(el('tr', {}, [
          el('td', { class: 'id', text: t.key + (t.is_police ? ' · policía' : '') }),
          el('td', {}, [i.icon]), el('td', {}, [i.color]),
          ...i.labels.map((x) => el('td', {}, [x])),
          el('td', {}, [i.dur]), el('td', {}, [i.sort]), el('td', {}, [i.enabled]), el('td', {}, [i.admin]),
          el('td', {}, [el('button', { class: 'btn small dark', text: 'Guardar', onclick: async () => {
            const labels = {}; LANGS.forEach((l, k) => { if (i.labels[k].value.trim()) labels[l] = i.labels[k].value.trim(); });
            if (!labels.es) return toast('El nombre en español es obligatorio');
            const { error } = await sb.from('report_types').update({ icon: i.icon.value || '•', color: i.color.value, labels, duration_min: Math.max(5, Number(i.dur.value)), sort: Number(i.sort.value), enabled: i.enabled.checked, admin_only: i.admin.checked }).eq('key', t.key);
            if (error) return fail(error, 'Tipo'); toast('Tipo guardado'); loadTypes();
          } })])
        ]));
      });
      typesPanel.appendChild(el('div', { class: 'table-wrap' }, [el('table', {}, [
        el('thead', {}, [el('tr', {}, ['Clave', 'Icono', 'Color', 'ES', 'EN', 'IT', 'DE', 'Min', 'Orden', 'Activo', 'Solo admin', ''].map((h) => el('th', { text: h })))]),
        tbody
      ])]));

      const nt = { key: el('input', { placeholder: 'ej. niebla', pattern: '[a-z_]+' }), icon: el('input', { placeholder: '🌫️', maxlength: '4' }), es: el('input', { placeholder: 'Niebla' }), color: el('input', { type: 'color', value: '#8e8c99' }), dur: el('input', { type: 'number', value: '60' }) };
      typesPanel.appendChild(el('div', { class: 'grid cols-4', style: 'margin-top:16px;align-items:end' }, [
        el('label', {}, ['Nueva clave', nt.key]), el('label', {}, ['Icono', nt.icon]), el('label', {}, ['Nombre ES', nt.es]), el('label', {}, ['Color', nt.color]), el('label', {}, ['Minutos', nt.dur]),
        el('button', { class: 'btn primary', text: 'Añadir tipo', onclick: async () => {
          const key = nt.key.value.trim().toLowerCase();
          if (!/^[a-z_]{3,30}$/.test(key) || !nt.es.value.trim()) return toast('Clave (solo letras minúsculas) y nombre obligatorios');
          const { error } = await sb.from('report_types').insert({ key, icon: nt.icon.value || '•', labels: { es: nt.es.value.trim() }, color: nt.color.value, duration_min: Math.max(5, Number(nt.dur.value) || 60), sort: TYPES.size + 1 });
          if (error) return fail(error, 'Tipo'); toast('Tipo añadido'); await loadTypes(); route();
        } })
      ]));
      view.appendChild(typesPanel);
    }
  };

  // ------------------------------------------------------------------
  // MESSAGGI
  // ------------------------------------------------------------------
  VIEWS.broadcasts = {
    eyebrow: 'Configuración', title: 'Mensajes a todos',
    async render(view) {
      const f = {
        level: el('select', {}, [['info', 'Información'], ['warning', 'Atención'], ['danger', 'Peligro']].map(([v, l]) => el('option', { value: v, text: l }))),
        msg: LANGS.map((l) => el('textarea', { placeholder: LANG_NAMES[l] + (l === 'es' ? ' (obligatorio)' : ' (opcional, si falta se usa español)'), maxlength: '280' })),
        start: el('input', { type: 'datetime-local', value: toLocalInput(new Date()) }),
        end: el('input', { type: 'datetime-local' }),
        active: el('input', { type: 'checkbox', checked: true })
      };
      view.appendChild(el('div', { class: 'panel' }, [
        el('h2', { text: 'Nuevo mensaje' }),
        el('p', { class: 'sub', text: 'Aparece arriba en la app de todos. Cada usuario puede cerrarlo. Ej.: "Calima fuerte hoy, visibilidad reducida".' }),
        el('div', { class: 'grid cols-2' }, f.msg.map((x, k) => el('label', {}, [LANG_NAMES[LANGS[k]], x]))),
        el('div', { class: 'grid cols-4', style: 'margin-top:14px;align-items:end' }, [
          el('label', {}, ['Nivel', f.level]), el('label', {}, ['Desde', f.start]), el('label', {}, ['Hasta (opcional)', f.end]),
          el('label', { class: 'check' }, [f.active, 'Activo'])
        ]),
        el('div', { class: 'row', style: 'margin-top:14px' }, [el('button', { class: 'btn primary', text: 'Publicar mensaje', onclick: async () => {
          const message = {}; LANGS.forEach((l, k) => { if (f.msg[k].value.trim()) message[l] = f.msg[k].value.trim(); });
          if (!message.es) return toast('El texto en español es obligatorio');
          const { error } = await sb.from('broadcasts').insert({ message, level: f.level.value, starts_at: fromLocalInput(f.start.value) || new Date().toISOString(), ends_at: fromLocalInput(f.end.value), active: f.active.checked });
          if (error) return fail(error, 'Mensaje'); toast('Mensaje publicado'); route();
        } })])
      ]));

      const { data } = await sb.from('broadcasts').select('*').order('created_at', { ascending: false }).limit(100);
      const now = new Date();
      view.appendChild(el('div', { style: 'margin-top:16px' }, [(data || []).length ? el('div', { class: 'table-wrap' }, [el('table', {}, [
        el('thead', {}, [el('tr', {}, ['Mensaje', 'Nivel', 'Periodo', 'Estado', 'Activo', ''].map((h) => el('th', { text: h })))]),
        el('tbody', {}, data.map((b) => {
          const live = b.active && new Date(b.starts_at) <= now && (!b.ends_at || new Date(b.ends_at) > now);
          const tg = el('input', { type: 'checkbox', checked: b.active, 'aria-label': 'Activo' });
          tg.addEventListener('change', async () => { const { error } = await sb.from('broadcasts').update({ active: tg.checked }).eq('id', b.id); if (error) return fail(error); route(); });
          return el('tr', {}, [
            el('td', { style: 'max-width:380px', text: b.message.es }),
            el('td', {}, [el('span', { class: 'pill ' + (b.level === 'danger' ? 'bad' : b.level === 'warning' ? 'warn' : ''), text: b.level })]),
            el('td', { text: fmtDT(b.starts_at) + ' → ' + (b.ends_at ? fmtDT(b.ends_at) : 'sin fin') }),
            el('td', {}, [el('span', { class: 'pill ' + (live ? 'ok' : ''), text: live ? 'visible' : 'no visible' })]),
            el('td', {}, [el('label', { class: 'switch' }, [tg, el('span')])]),
            el('td', {}, [el('button', { class: 'btn small danger', text: 'Borrar', onclick: async () => {
              if (!confirm('¿Borrar el mensaje?')) return;
              const { error } = await sb.from('broadcasts').delete().eq('id', b.id); if (error) return fail(error); route();
            } })])
          ]);
        }))
      ])]) : el('div', { class: 'panel empty', text: 'Todavía no has enviado mensajes.' })]));
    }
  };

  // ------------------------------------------------------------------
  // REGISTRO
  // ------------------------------------------------------------------
  let logEntity = '';
  VIEWS.log = {
    eyebrow: 'Configuración', title: 'Registro de acciones',
    async render(view, head) {
      const ents = ['', 'reports', 'app_settings', 'report_types', 'blocked_users', 'broadcasts', 'places', 'businesses', 'business_admin', 'push_campaigns', 'admins'];
      const sel = el('select', { style: 'width:200px' }, ents.map((e) => el('option', { value: e, text: e || 'Todas las tablas' })));
      sel.value = logEntity;
      sel.addEventListener('change', () => { logEntity = sel.value; route(); });
      head.append(sel);
      let q = sb.from('admin_log').select('*').order('created_at', { ascending: false }).limit(200);
      if (logEntity) q = q.eq('entity', logEntity);
      const { data, error } = await q;
      if (error) return fail(error, 'Registro');
      view.appendChild((data || []).length ? el('div', { class: 'table-wrap' }, [el('table', {}, [
        el('thead', {}, [el('tr', {}, ['Cuándo', 'Acción', 'Tabla', 'Elemento', 'Detalle'].map((h) => el('th', { text: h })))]),
        el('tbody', {}, data.map((x) => el('tr', {}, [
          el('td', { text: fmtDT(x.created_at) }),
          el('td', {}, [el('span', { class: 'pill ' + (x.action === 'delete' ? 'bad' : x.action === 'insert' ? 'ok' : 'warn'), text: ({ insert: 'creado', update: 'cambiado', delete: 'borrado' })[x.action] || x.action })]),
          el('td', { class: 'id', text: x.entity }),
          el('td', { class: 'id', text: x.entity_id ? String(x.entity_id).slice(0, 24) : '—' }),
          el('td', {}, [el('details', {}, [el('summary', { text: 'ver' }), el('pre', { class: 'json', text: JSON.stringify(x.details, null, 2) })])])
        ])))
      ])]) : el('div', { class: 'panel empty', text: 'Sin acciones registradas.' }));
    }
  };

  // ------------------------------------------------------------------
  // LUOGHI e ATTIVITÀ (editor comune)
  // ------------------------------------------------------------------
  const PLACE_CATS = ['playa', 'mirador', 'pueblo', 'naturaleza', 'cultura', 'surf', 'otro'];
  const BIZ_CATS = ['restaurante', 'bar', 'surf / kite', 'excursiones', 'alquiler', 'alojamiento', 'tienda', 'servicios', 'otro'];

  function photosEditor(list, folder, single) {
    let urls = (list || []).slice();
    const box = el('div', { class: 'photos' });
    const input = el('input', { type: 'file', accept: 'image/*', multiple: !single, style: 'max-width:260px' });
    function draw() {
      box.innerHTML = '';
      urls.forEach((u, k) => box.appendChild(el('div', { class: 'ph' }, [el('img', { src: u, alt: '' }), el('button', { type: 'button', 'aria-label': 'Quitar foto', text: '×', onclick: () => { urls.splice(k, 1); draw(); } })])));
    }
    input.addEventListener('change', async () => {
      const files = [...input.files];
      for (const file of files) {
        if (file.size > 8 * 1024 * 1024) { toast('Foto demasiado grande (máx. 8 MB)'); continue; }
        try { toast('Subiendo foto…'); const u = await upload(file, folder); if (single) urls = [u]; else urls.push(u); draw(); }
        catch (e) { fail(e, 'Foto'); }
      }
      input.value = '';
    });
    draw();
    return { node: el('div', { class: 'grid' }, [box, input]), get: () => urls };
  }

  function editorPanel(kind, item, onDone) {
    const isBiz = kind === 'businesses';
    const x = item || { description: {}, photos: [], active: true, featured: false, sort: 0, plan: 'free' };
    const f = {
      name: el('input', { value: x.name || '', maxlength: '80' }),
      cat: el('select', {}, (isBiz ? BIZ_CATS : PLACE_CATS).map((c) => el('option', { value: c, text: c }))),
      desc: LANGS.map((l) => el('textarea', { value: (x.description || {})[l] || '', placeholder: LANG_NAMES[l], maxlength: '400' })),
      lat: el('input', { type: 'number', step: 'any', value: x.lat ?? '' }),
      lng: el('input', { type: 'number', step: 'any', value: x.lng ?? '' }),
      active: el('input', { type: 'checkbox', checked: x.active !== false }),
      featured: el('input', { type: 'checkbox', checked: !!x.featured }),
      sort: el('input', { type: 'number', value: x.sort || 0 }),
      phone: el('input', { value: x.phone || '', placeholder: '+34 …' }),
      web: el('input', { value: x.website || '', placeholder: 'https://…' }),
      addr: el('input', { value: x.address || '' }),
      plan: el('select', {}, [['free', 'Gratis'], ['sponsor', 'Sponsor'], ['premium', 'Premium']].map(([v, l]) => el('option', { value: v, text: l }))),
      until: el('input', { type: 'date', value: x.sponsor_until || '' }),
      cname: el('input'), cmail: el('input', { type: 'email' }), price: el('input', { type: 'number', step: '0.01' }), notes: el('textarea')
    };
    f.cat.value = x.category || (isBiz ? BIZ_CATS[0] : PLACE_CATS[0]);
    f.plan.value = x.plan || 'free';
    const photos = photosEditor(x.photos, kind);
    const logo = isBiz ? photosEditor(x.logo_url ? [x.logo_url] : [], 'logos', true) : null;
    const mapBox = el('div', { class: 'amap small' });

    const fields = [
      el('div', { class: 'grid cols-2' }, [el('label', {}, ['Nombre', f.name]), el('label', {}, ['Categoría', f.cat])]),
      el('div', { class: 'grid cols-2' }, f.desc.map((d, k) => el('label', {}, ['Descripción · ' + LANG_NAMES[LANGS[k]], d])))
    ];
    if (isBiz) {
      fields.push(el('div', { class: 'grid cols-3' }, [el('label', {}, ['Teléfono', f.phone]), el('label', {}, ['Web', f.web]), el('label', {}, ['Dirección', f.addr])]));
      fields.push(el('div', { class: 'grid cols-3' }, [el('label', {}, ['Plan', f.plan]), el('label', {}, ['Destacado hasta', f.until]), el('label', {}, ['Logo', logo.node])]));
      fields.push(el('div', { class: 'panel', style: 'background:var(--card)' }, [
        el('h2', { text: 'Datos privados (solo tú)' }),
        el('div', { class: 'grid cols-3', style: 'margin-top:10px' }, [el('label', {}, ['Contacto', f.cname]), el('label', {}, ['Email', f.cmail]), el('label', {}, ['Precio / mes (€)', f.price])]),
        el('label', { style: 'margin-top:10px' }, ['Notas', f.notes])
      ]));
    }
    fields.push(el('label', {}, ['Fotos', photos.node]));
    fields.push(el('div', { class: 'grid cols-3' }, [el('label', {}, ['Latitud', f.lat]), el('label', {}, ['Longitud', f.lng]), el('label', {}, ['Orden', f.sort])]));
    fields.push(el('div', { class: 'row' }, [el('label', { class: 'check' }, [f.active, 'Visible en la app']), isBiz ? null : el('label', { class: 'check' }, [f.featured, 'Destacado'])]));

    const save = el('button', { class: 'btn primary', text: item ? 'Guardar cambios' : 'Crear' });
    const panel = el('div', { class: 'panel' }, [
      el('div', { class: 'row' }, [el('h2', { text: item ? 'Editar: ' + x.name : (isBiz ? 'Nuevo negocio' : 'Nuevo lugar') }), el('span', { class: 'spacer' }), el('button', { class: 'btn small ghost', text: 'Cerrar', onclick: () => onDone(false) })]),
      el('div', { class: 'grid cols-2', style: 'margin-top:14px;align-items:start' }, [el('div', { class: 'grid' }, fields), el('div', {}, [el('p', { class: 'sub', text: 'Toca el mapa para colocarlo.' }), mapBox])]),
      el('div', { class: 'row', style: 'margin-top:16px' }, [save])
    ]);

    if (isBiz && item) {
      sb.from('business_admin').select('*').eq('business_id', item.id).maybeSingle().then(({ data }) => {
        if (!data) return;
        f.cname.value = data.contact_name || ''; f.cmail.value = data.contact_email || ''; f.price.value = data.price_eur ?? ''; f.notes.value = data.notes || '';
      });
    }

    setTimeout(() => {
      const pk = pickerMap(mapBox, x.lat, x.lng, (la, ln) => { f.lat.value = la; f.lng.value = ln; });
      [f.lat, f.lng].forEach((i) => i.addEventListener('change', () => pk.setPos(f.lat.value, f.lng.value)));
    }, 0);

    save.addEventListener('click', async () => {
      if (!f.name.value.trim()) return toast('El nombre es obligatorio');
      if (f.lat.value === '' || f.lng.value === '') return toast('Coloca el punto en el mapa');
      if (isBiz && f.web.value && !/^https?:\/\//.test(f.web.value.trim())) return toast('La web debe empezar por https://');
      const description = {}; LANGS.forEach((l, k) => { if (f.desc[k].value.trim()) description[l] = f.desc[k].value.trim(); });
      const row = { name: f.name.value.trim(), category: f.cat.value, description, lat: Number(f.lat.value), lng: Number(f.lng.value), photos: photos.get(), active: f.active.checked };
      if (isBiz) Object.assign(row, { phone: f.phone.value.trim() || null, website: f.web.value.trim() || null, address: f.addr.value.trim() || null, plan: f.plan.value, sponsor_until: f.until.value || null, logo_url: logo.get()[0] || null });
      else Object.assign(row, { featured: f.featured.checked, sort: Number(f.sort.value) || 0 });
      save.disabled = true;
      const res = item ? await sb.from(kind).update(row).eq('id', item.id).select().single() : await sb.from(kind).insert(row).select().single();
      if (res.error) { save.disabled = false; return fail(res.error, 'Guardar'); }
      if (isBiz) {
        const priv = { business_id: res.data.id, contact_name: f.cname.value.trim() || null, contact_email: f.cmail.value.trim() || null, price_eur: f.price.value === '' ? null : Number(f.price.value), notes: f.notes.value.trim() || null };
        const r2 = await sb.from('business_admin').upsert(priv);
        if (r2.error) fail(r2.error, 'Datos privados');
      }
      toast('Guardado');
      onDone(true);
    });
    return panel;
  }

  function catalogView(kind) {
    const isBiz = kind === 'businesses';
    return {
      eyebrow: 'Isla', title: isBiz ? 'Negocios y sponsors' : 'Lugares para visitar',
      async render(view, head) {
        const editorBox = el('div', { style: 'margin-bottom:16px' });
        const listBox = el('div');
        view.append(editorBox, listBox);
        head.append(el('button', { class: 'btn primary', text: isBiz ? 'Nuevo negocio' : 'Nuevo lugar', onclick: () => openEditor(null) }));

        function openEditor(item) {
          maps.forEach((m) => { try { m.remove(); } catch (e) {} }); maps = [];
          editorBox.innerHTML = '';
          editorBox.appendChild(editorPanel(kind, item, (changed) => { editorBox.innerHTML = ''; if (changed) load(); }));
          editorBox.scrollIntoView({ behavior: 'smooth' });
        }

        async function load() {
          const q = sb.from(kind).select('*').order(isBiz ? 'name' : 'sort');
          const [{ data, error }, ev] = await Promise.all([q, isBiz ? sb.from('business_events').select('business_id,kind').gte('created_at', new Date(Date.now() - 30 * 86400000).toISOString()).limit(20000) : Promise.resolve({ data: [] })]);
          if (error) return fail(error);
          const stats = new Map();
          (ev.data || []).forEach((e) => { const s = stats.get(e.business_id) || { view: 0, click: 0, call: 0, web: 0, directions: 0 }; s[e.kind]++; stats.set(e.business_id, s); });
          listBox.innerHTML = '';
          if (!(data || []).length) { listBox.appendChild(el('div', { class: 'panel empty', text: isBiz ? 'Todavía no hay negocios. Empieza por el tuyo.' : 'Todavía no hay lugares. Añade las playas y miradores más buscados.' })); return; }
          const head = isBiz ? ['', 'Nombre', 'Categoría', 'Plan', 'Vistas 30 d', 'Clics', 'Llamadas', 'Web', 'Visible', ''] : ['', 'Nombre', 'Categoría', 'Destacado', 'Orden', 'Visible', ''];
          const today = new Date(new Date().toDateString());
          listBox.appendChild(el('div', { class: 'table-wrap' }, [el('table', {}, [
            el('thead', {}, [el('tr', {}, head.map((h) => el('th', { text: h })))]),
            el('tbody', {}, data.map((x) => {
              const img = (x.photos && x.photos[0]) || x.logo_url;
              const thumb = el('td', {}, [img ? el('img', { src: img, alt: '', style: 'width:44px;height:44px;border-radius:10px;object-fit:cover;display:block' }) : el('div', { style: 'width:44px;height:44px;border-radius:10px;background:var(--card)' })]);
              const edit = el('td', {}, [el('div', { class: 'acts' }, [
                el('button', { class: 'btn small', text: 'Editar', onclick: () => openEditor(x) }),
                el('button', { class: 'btn small danger', text: 'Borrar', onclick: async () => {
                  if (!confirm('¿Borrar "' + x.name + '"?')) return;
                  const { error: e2 } = await sb.from(kind).delete().eq('id', x.id); if (e2) return fail(e2); toast('Borrado'); load();
                } })
              ])]);
              const vis = el('td', {}, [el('span', { class: 'pill ' + (x.active ? 'ok' : ''), text: x.active ? 'sí' : 'no' })]);
              if (isBiz) {
                const s = stats.get(x.id) || { view: 0, click: 0, call: 0, web: 0 };
                const expired = x.sponsor_until && new Date(x.sponsor_until) < today;
                const planPill = el('span', { class: 'pill ' + (x.plan === 'free' ? '' : expired ? 'bad' : 'warn'), text: x.plan + (x.sponsor_until ? ' · ' + (expired ? 'vencido ' : 'hasta ') + fmtD(x.sponsor_until) : '') });
                return el('tr', {}, [thumb, el('td', {}, [el('b', { text: x.name })]), el('td', { text: x.category }), el('td', {}, [planPill]),
                  el('td', { text: String(s.view) }), el('td', { text: String(s.click) }), el('td', { text: String(s.call) }), el('td', { text: String(s.web) }), vis, edit]);
              }
              return el('tr', {}, [thumb, el('td', {}, [el('b', { text: x.name })]), el('td', { text: x.category }), el('td', { text: x.featured ? '★' : '' }), el('td', { text: String(x.sort) }), vis, edit]);
            }))
          ])]));
        }
        load();
      }
    };
  }
  VIEWS.places = catalogView('places');
  VIEWS.businesses = catalogView('businesses');

  // ------------------------------------------------------------------
  // DGT
  // ------------------------------------------------------------------
  VIEWS.dgt = {
    eyebrow: 'Datos y app', title: 'Datos: DGT y lugares',
    async render(view, head) {
      const syncBtn = el('button', { class: 'btn primary', text: 'Actualizar lugares ahora' });
      syncBtn.addEventListener('click', async () => {
        syncBtn.disabled = true; syncBtn.textContent = 'Actualizando… (hasta 2 min)';
        const { data, error } = await sb.functions.invoke('sync-pois', { body: {} });
        syncBtn.disabled = false; syncBtn.textContent = 'Actualizar lugares ahora';
        if (error || !data || !data.ok) return toast('Error: ' + ((data && data.error) || (error && error.message) || 'desconocido'));
        toast(data.items + ' lugares actualizados'); route();
      });
      head.append(syncBtn);
      const CAT_KEYS = ['food', 'drink', 'beach', 'fuel', 'super', 'pharmacy', 'view', 'surf', 'parking', 'hotel'];
      const cnt = await Promise.all(CAT_KEYS.map((k) => sb.from('pois').select('id', { count: 'exact', head: true }).eq('cat', k)));
      const counts = {};
      CAT_KEYS.forEach((k, i) => { counts[k] = cnt[i].count || 0; });
      const CAT_NAMES = { food: 'Restaurantes', drink: 'Bares y cafés', beach: 'Playas', fuel: 'Gasolineras', super: 'Supermercados', pharmacy: 'Farmacias', view: 'Miradores', surf: 'Surf y kite', parking: 'Aparcamientos', hotel: 'Alojamiento' };
      view.appendChild(el('div', { class: 'panel', style: 'margin-bottom:16px' }, [
        el('h2', { text: 'Lugares de OpenStreetMap en Maxora' }),
        el('p', { class: 'sub', text: 'Se copian solos cada noche a las 04:17. La app los guarda en el teléfono: la búsqueda por categoría es instantánea.' }),
        el('div', { class: 'kpis', style: 'margin:0' }, Object.keys(CAT_NAMES).map((k) => kpi(CAT_NAMES[k], counts[k] || 0)))
      ]));
      const [runs, live] = await Promise.all([
        sb.from('import_runs').select('*').order('started_at', { ascending: false }).limit(50),
        sb.from('reports').select('id', { count: 'exact', head: true }).eq('source', 'dgt').gt('expires_at', new Date().toISOString()).is('removed_at', null)
      ]);
      const last = (runs.data || [])[0];
      view.appendChild(el('div', { class: 'kpis' }, [
        kpi('Avisos DGT activos', live.count || 0, 'hot'),
        kpi('Última importación', last ? ago(last.started_at) : '—'),
        kpi('Estado', last ? (last.ok ? 'OK' : 'Error') : 'Pendiente', last && !last.ok ? 'warn' : '')
      ]));
      view.appendChild(el('div', { class: 'panel' }, [
        el('h2', { text: 'Cómo funciona' }),
        el('p', { class: 'sub', text: 'Un proceso automático leerá cada 2 minutos las incidencias de la DGT (Punto de Acceso Nacional, formato DATEX II) y las pondrá en el mapa con origen "DGT". Lo activamos en el siguiente paso; aquí verás cada importación, cuántos avisos trajo y si hubo errores.' })
      ]));
      view.appendChild(el('div', { style: 'margin-top:16px' }, [(runs.data || []).length ? el('div', { class: 'table-wrap' }, [el('table', {}, [
        el('thead', {}, [el('tr', {}, ['Inicio', 'Fin', 'Fuente', 'Avisos', 'Estado', 'Error'].map((h) => el('th', { text: h })))]),
        el('tbody', {}, runs.data.map((r) => el('tr', {}, [
          el('td', { text: fmtDT(r.started_at) }), el('td', { text: fmtDT(r.finished_at) }), el('td', { class: 'id', text: r.source === 'osm-pois' ? 'lugares OSM' : r.source }),
          el('td', { text: String(r.items ?? '—') }),
          el('td', {}, [el('span', { class: 'pill ' + (r.ok ? 'ok' : r.ok === false ? 'bad' : ''), text: r.ok ? 'ok' : r.ok === false ? 'error' : 'en curso' })]),
          el('td', { class: 'muted', text: r.error || '' })
        ])))
      ])]) : el('div', { class: 'panel empty', text: 'Todavía no hay importaciones.' })]));
    }
  };

  // ------------------------------------------------------------------
  // NOTIFICHE PUSH
  // ------------------------------------------------------------------
  VIEWS.push = {
    eyebrow: 'Datos y app', title: 'Notificaciones push',
    async render(view) {
      const [tok, camps] = await Promise.all([
        sb.from('push_tokens').select('token', { count: 'exact', head: true }),
        sb.from('push_campaigns').select('*').order('created_at', { ascending: false }).limit(50)
      ]);
      view.appendChild(el('div', { class: 'kpis' }, [kpi('Teléfonos suscritos', tok.count || 0, 'hot'), kpi('Campañas', (camps.data || []).length)]));
      const f = {
        title: LANGS.map((l) => el('input', { placeholder: 'Título · ' + LANG_NAMES[l], maxlength: '60' })),
        body: LANGS.map((l) => el('textarea', { placeholder: 'Texto · ' + LANG_NAMES[l], maxlength: '180' })),
        zone: el('input', { type: 'checkbox' }),
        lat: el('input', { type: 'number', step: 'any', placeholder: '28.5' }), lng: el('input', { type: 'number', step: 'any', placeholder: '-13.86' }),
        radius: el('input', { type: 'number', value: '10' })
      };
      view.appendChild(el('div', { class: 'panel' }, [
        el('h2', { text: 'Nueva campaña (borrador)' }),
        el('p', { class: 'sub', text: 'El envío real se activa con la app de iPhone/Android (versión 3). Ya puedes preparar los textos y la zona.' }),
        el('div', { class: 'grid cols-2' }, LANGS.map((l, k) => el('div', { class: 'grid' }, [el('label', {}, [LANG_NAMES[l], f.title[k]]), f.body[k]]))),
        el('div', { class: 'grid cols-4', style: 'margin-top:14px;align-items:end' }, [
          el('label', { class: 'check' }, [f.zone, 'Solo una zona']), el('label', {}, ['Latitud', f.lat]), el('label', {}, ['Longitud', f.lng]), el('label', {}, ['Radio (km)', f.radius])
        ]),
        el('div', { class: 'row', style: 'margin-top:14px' }, [el('button', { class: 'btn primary', text: 'Guardar borrador', onclick: async () => {
          const title = {}, body = {};
          LANGS.forEach((l, k) => { if (f.title[k].value.trim()) title[l] = f.title[k].value.trim(); if (f.body[k].value.trim()) body[l] = f.body[k].value.trim(); });
          if (!title.es || !body.es) return toast('Título y texto en español obligatorios');
          const area = f.zone.checked ? { lat: Number(f.lat.value), lng: Number(f.lng.value), radius_km: Number(f.radius.value) } : null;
          const { error } = await sb.from('push_campaigns').insert({ title, body, area });
          if (error) return fail(error, 'Campaña'); toast('Borrador guardado'); route();
        } })])
      ]));
      view.appendChild(el('div', { style: 'margin-top:16px' }, [(camps.data || []).length ? el('div', { class: 'table-wrap' }, [el('table', {}, [
        el('thead', {}, [el('tr', {}, ['Creada', 'Título', 'Zona', 'Estado', 'Destinatarios', ''].map((h) => el('th', { text: h })))]),
        el('tbody', {}, camps.data.map((c) => el('tr', {}, [
          el('td', { text: fmtDT(c.created_at) }), el('td', { text: c.title.es }),
          el('td', { class: 'id', text: c.area ? c.area.radius_km + ' km' : 'todos' }),
          el('td', {}, [el('span', { class: 'pill ' + (c.status === 'sent' ? 'ok' : c.status === 'failed' ? 'bad' : ''), text: c.status })]),
          el('td', { text: c.recipients != null ? String(c.recipients) : '—' }),
          el('td', {}, [c.status === 'draft' ? el('button', { class: 'btn small danger', text: 'Borrar', onclick: async () => {
            const { error } = await sb.from('push_campaigns').delete().eq('id', c.id); if (error) return fail(error); route();
          } }) : null])
        ])))
      ])]) : el('div', { class: 'panel empty', text: 'Sin campañas todavía.' })]));
    }
  };

  // ------------------------------------------------------------------
  // Avvio
  // ------------------------------------------------------------------
  async function start() {
    $('login').classList.add('hidden');
    $('shell').classList.remove('hidden');
    await loadTypes();
    route();
  }
  (async function boot() {
    applyTheme();
    if (await checkAdmin()) start();
    else $('login').classList.remove('hidden');
  })();
})();
