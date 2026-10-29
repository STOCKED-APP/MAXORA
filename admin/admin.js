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
  // contraseña olvidada: email con enlace → vuelve aquí → nueva contraseña
  let recovering = /type=recovery/.test(location.hash);
  $('forgotBtn').addEventListener('click', async () => {
    const email = $('loginEmail').value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { $('loginErr').textContent = 'Escribe primero tu email arriba.'; return; }
    $('forgotBtn').disabled = true;
    const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: location.origin + location.pathname });
    $('forgotBtn').disabled = false;
    $('loginErr').textContent = error ? 'No se pudo enviar: ' + error.message : 'Te hemos enviado un email con un enlace. Ábrelo en este mismo dispositivo (revisa también el spam).';
  });
  function showNewPass() {
    recovering = true;
    $('login').classList.remove('hidden'); $('shell').classList.add('hidden');
    $('loginForm').classList.add('hidden'); $('newPassForm').classList.remove('hidden');
  }
  sb.auth.onAuthStateChange((ev) => { if (ev === 'PASSWORD_RECOVERY') showNewPass(); });
  $('newPassForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const a = $('newPass').value, b = $('newPass2').value;
    if (a.length < 10) { $('newPassErr').textContent = 'Mínimo 10 caracteres.'; return; }
    if (a !== b) { $('newPassErr').textContent = 'Las dos contraseñas no coinciden.'; return; }
    $('newPassBtn').disabled = true;
    const { error } = await sb.auth.updateUser({ password: a });
    $('newPassBtn').disabled = false;
    if (error) { $('newPassErr').textContent = 'Error: ' + error.message; return; }
    $('newPass').value = ''; $('newPass2').value = '';
    recovering = false;
    history.replaceState(null, '', location.pathname);
    if (await checkAdmin()) { $('newPassForm').classList.add('hidden'); $('loginForm').classList.remove('hidden'); start(); }
    else $('newPassErr').textContent = 'Contraseña cambiada, pero esta cuenta no es administradora.';
  });
  // cambiar la contraseña desde dentro del panel
  $('passBtn').addEventListener('click', () => {
    if (document.querySelector('.pass-modal')) return;
    const p1 = el('input', { type: 'password', autocomplete: 'new-password', minlength: '10' });
    const p2 = el('input', { type: 'password', autocomplete: 'new-password', minlength: '10' });
    const err = el('p', { class: 'err', role: 'alert' });
    const ok = el('button', { class: 'btn primary', type: 'submit', text: 'Guardar' });
    const close = () => modal.remove();
    const form = el('form', { class: 'login-card' }, [
      el('h1', { text: 'Cambiar contraseña' }),
      el('p', { class: 'sub', text: 'Cuenta: ' + (me && me.email || '') }),
      el('label', {}, ['Nueva contraseña (mín. 10 caracteres)', p1]),
      el('label', {}, ['Repite la contraseña', p2]),
      ok, el('button', { class: 'btn ghost', type: 'button', text: 'Cancelar', onclick: close }), err
    ]);
    const modal = el('div', { class: 'pass-modal' }, [form]);
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (p1.value.length < 10) { err.textContent = 'Mínimo 10 caracteres.'; return; }
      if (p1.value !== p2.value) { err.textContent = 'Las dos contraseñas no coinciden.'; return; }
      ok.disabled = true;
      const { error } = await sb.auth.updateUser({ password: p1.value });
      ok.disabled = false;
      if (error) { err.textContent = /reauth|nonce/i.test(error.message) ? 'Por seguridad, sal y vuelve a entrar, luego repite el cambio.' : 'Error: ' + error.message; return; }
      p1.value = ''; p2.value = '';
      close(); toast('Contraseña cambiada');
    });
    document.body.appendChild(modal);
    setTimeout(() => p1.focus(), 50);
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

  function photosEditor(list, folder, single, creditList) {
    let urls = (list || []).slice();
    // crediti allineati alle foto: togliendo una foto si toglie anche il suo credito; le foto caricate da te non ne hanno
    let credits = urls.map((_, i) => (creditList && creditList[i]) || null);
    const box = el('div', { class: 'photos' });
    const input = el('input', { type: 'file', accept: 'image/*', multiple: !single, style: 'max-width:260px' });
    function draw() {
      box.innerHTML = '';
      urls.forEach((u, k) => box.appendChild(el('div', { class: 'ph' }, [el('img', { src: u, alt: '' }), el('button', { type: 'button', 'aria-label': 'Quitar foto', text: '×', onclick: () => { urls.splice(k, 1); credits.splice(k, 1); draw(); } }), credits[k] ? el('span', { class: 'ph-cr', title: credits[k].author + ' · ' + credits[k].license, text: '©' }) : null])));
    }
    input.addEventListener('change', async () => {
      const files = [...input.files];
      for (const file of files) {
        if (file.size > 8 * 1024 * 1024) { toast('Foto demasiado grande (máx. 8 MB)'); continue; }
        try { toast('Subiendo foto…'); const u = await upload(file, folder); if (single) { urls = [u]; credits = [null]; } else { urls.push(u); credits.push(null); } draw(); }
        catch (e) { fail(e, 'Foto'); }
      }
      input.value = '';
    });
    draw();
    return { node: el('div', { class: 'grid' }, [box, input]), get: () => urls, credits: () => credits.map((c) => c || {}) };
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
    const photos = photosEditor(x.photos, kind, false, x.photo_credits);
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
      const row = { name: f.name.value.trim(), category: f.cat.value, description, lat: Number(f.lat.value), lng: Number(f.lng.value), photos: photos.get(), photo_credits: photos.credits(), active: f.active.checked };
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
      head.append(el('a', { class: 'btn', href: 'https://github.com/STOCKED-APP/MAXORA/actions/workflows/pois.yml', target: '_blank', rel: 'noopener', text: 'Ver actualizaciones en GitHub' }));
      const CAT_NAMES = { food: 'Restaurantes', drink: 'Bares y cafés', beach: 'Playas', fuel: 'Gasolineras', super: 'Supermercados', pharmacy: 'Farmacias', view: 'Miradores', surf: 'Surf y kite', parking: 'Aparcamientos', hotel: 'Alojamiento' };
      let doc = null;
      try { const r = await fetch('../data/pois.json', { cache: 'no-cache' }); if (r.ok) doc = await r.json(); } catch (e) { /* nada */ }
      view.appendChild(el('div', { class: 'panel', style: 'margin-bottom:16px' }, [
        el('h2', { text: 'Lugares de OpenStreetMap en Maxora' }),
        el('p', { class: 'sub', text: doc ? 'Última actualización: ' + fmtDT(doc.generated_at) + '. Se actualizan solos cada noche (03:23 UTC) desde el extracto oficial de OpenStreetMap. La app los guarda en el teléfono: la búsqueda por categoría es instantánea.' : 'Todavía no hay archivo de lugares: la primera actualización automática está en curso (unos minutos).' }),
        el('div', { class: 'kpis', style: 'margin:0' }, Object.keys(CAT_NAMES).map((k) => kpi(CAT_NAMES[k], doc && doc.cats[k] ? doc.cats[k].length : 0)))
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
  // SURF: spot (finestre ideali) e segnalazioni "cómo está ahora"
  // ------------------------------------------------------------------
  const SURF_SIZE = ['Plano', 'Rodilla', 'Cintura-pecho', 'Cabeza', 'Más de cabeza'];
  const SURF_QUAL = { 1: 'Roto por el viento', 2: 'Picado', 3: 'Limpio' };
  const SURF_CROWD = ['Vacío', 'Algo de gente', 'Lleno'];
  const TIDE_OPTS = [['low', 'Baja'], ['lowmid', 'Baja–media'], ['mid', 'Media'], ['midhigh', 'Media–alta'], ['high', 'Alta'], ['all', 'Cualquiera']];

  function surfSpotEditor(item, onDone) {
    const d = item ? item.data : { lvl: [1, 3], win: [250, 350], facing: 280, off: 90, tide: 'all', minH: 0.5, maxH: 2.5, type: 'beach', wave: 'LR', zone: {}, note: {}, haz: {} };
    const num = (v, step) => el('input', { type: 'number', step: step || 'any', value: v ?? '' });
    const sel = (opts, v) => { const s = el('select', {}, opts.map(([a, b]) => el('option', { value: a, text: b }))); s.value = v; return s; };
    const f = {
      id: el('input', { value: item ? item.id : '', placeholder: 'ej. rocky-point', disabled: !!item }),
      name: el('input', { value: d.name || '', maxlength: '80' }),
      lat: num(d.lat), lng: num(d.lng), mlat: num(d.m ? d.m[0] : ''), mlng: num(d.m ? d.m[1] : ''),
      facing: num(d.facing, '1'), w0: num(d.win[0], '1'), w1: num(d.win[1], '1'), off: num(d.off, '1'),
      tide: sel(TIDE_OPTS, d.tide), l0: sel([[1, 'Principiante'], [2, 'Intermedio'], [3, 'Experto']], d.lvl[0]), l1: sel([[1, 'Principiante'], [2, 'Intermedio'], [3, 'Experto']], d.lvl[1]),
      minH: num(d.minH, '0.1'), maxH: num(d.maxH, '0.1'),
      type: sel([['beach', 'Playa'], ['reef', 'Arrecife'], ['point', 'Punta']], d.type), wave: sel([['LR', 'Derecha e izquierda'], ['R', 'Derecha'], ['L', 'Izquierda']], d.wave),
      zone: LANGS.map((l) => el('input', { value: (d.zone || {})[l] || '', placeholder: 'Zona · ' + LANG_NAMES[l] })),
      note: LANGS.map((l) => el('textarea', { value: (d.note || {})[l] || '', placeholder: 'Descripción · ' + LANG_NAMES[l], maxlength: '300' })),
      haz: LANGS.map((l) => el('input', { value: (d.haz || {})[l] || '', placeholder: 'Peligros · ' + LANG_NAMES[l] })),
      approx: el('input', { type: 'checkbox', checked: !!d.approx }),
      active: el('input', { type: 'checkbox', checked: item ? item.active : true }),
      sort: num(item ? item.sort : 50, '1')
    };
    const mapBox = el('div', { class: 'amap small' });
    const save = el('button', { class: 'btn primary', text: item ? 'Guardar cambios' : 'Crear spot' });
    const help = 'Grados: 0 = norte, 90 = este, 180 = sur, 270 = oeste. "Mar de fondo de" = desde dónde llegan las olas que funcionan (de… a…, en sentido horario). "Viento terral" = desde dónde sopla el viento ideal. Punto del modelo = celda del modelo de olas ECMWF (cada 0,25°) delante del spot, en el mar.';
    const panel = el('div', { class: 'panel' }, [
      el('div', { class: 'row' }, [el('h2', { text: item ? 'Editar: ' + d.name : 'Nuevo spot' }), el('span', { class: 'spacer' }), el('button', { class: 'btn small ghost', text: 'Cerrar', onclick: () => onDone(false) })]),
      el('p', { class: 'sub', text: help }),
      el('div', { class: 'grid cols-2', style: 'margin-top:14px;align-items:start' }, [
        el('div', { class: 'grid' }, [
          el('div', { class: 'grid cols-2' }, [el('label', {}, ['Código (no cambia)', f.id]), el('label', {}, ['Nombre', f.name])]),
          el('div', { class: 'grid cols-3' }, [el('label', {}, ['Orientación de la costa (°)', f.facing]), el('label', {}, ['Mar de fondo de (°)', f.w0]), el('label', {}, ['… a (°)', f.w1])]),
          el('div', { class: 'grid cols-3' }, [el('label', {}, ['Viento terral desde (°)', f.off]), el('label', {}, ['Marea ideal', f.tide]), el('label', {}, ['Tipo', f.type])]),
          el('div', { class: 'grid cols-3' }, [el('label', {}, ['Nivel mínimo', f.l0]), el('label', {}, ['Nivel máximo', f.l1]), el('label', {}, ['Ola', f.wave])]),
          el('div', { class: 'grid cols-2' }, [el('label', {}, ['Funciona desde (m)', f.minH]), el('label', {}, ['Aguanta hasta (m)', f.maxH])]),
          el('div', { class: 'grid cols-2' }, f.zone.map((x) => el('label', {}, [x.placeholder, x]))),
          el('div', { class: 'grid cols-2' }, f.note.map((x) => el('label', {}, [x.placeholder, x]))),
          el('div', { class: 'grid cols-2' }, f.haz.map((x) => el('label', {}, [x.placeholder, x]))),
          el('div', { class: 'grid cols-3' }, [el('label', {}, ['Latitud', f.lat]), el('label', {}, ['Longitud', f.lng]), el('label', {}, ['Orden', f.sort])]),
          el('div', { class: 'grid cols-2' }, [el('label', {}, ['Modelo: latitud', f.mlat]), el('label', {}, ['Modelo: longitud', f.mlng])]),
          el('div', { class: 'row' }, [el('label', { class: 'check' }, [f.active, 'Visible en la app']), el('label', { class: 'check' }, [f.approx, 'Posición aproximada'])])
        ]),
        el('div', {}, [el('p', { class: 'sub', text: 'Toca el mapa para colocar el spot.' }), mapBox])
      ]),
      el('div', { class: 'row', style: 'margin-top:16px' }, [save])
    ]);
    setTimeout(() => {
      const pk = pickerMap(mapBox, d.lat, d.lng, (la, ln) => {
        f.lat.value = la; f.lng.value = ln;
        if (f.mlat.value === '') { f.mlat.value = Math.round(la * 4) / 4; f.mlng.value = Math.round(ln * 4) / 4; }
      });
      [f.lat, f.lng].forEach((i) => i.addEventListener('change', () => pk.setPos(f.lat.value, f.lng.value)));
    }, 0);
    save.addEventListener('click', async () => {
      const id = f.id.value.trim().toLowerCase();
      if (!item && !/^[a-z0-9-]{3,40}$/.test(id)) return toast('Código: solo letras minúsculas, números y guiones');
      if (!f.name.value.trim() || f.lat.value === '' || f.lng.value === '') return toast('Nombre y posición son obligatorios');
      const L = (arr) => { const o = {}; LANGS.forEach((l, k) => { if (arr[k].value.trim()) o[l] = arr[k].value.trim(); }); return o; };
      const n = (x) => Number(x.value);
      const data = Object.assign({}, d, {
        name: f.name.value.trim(), lat: n(f.lat), lng: n(f.lng), type: f.type.value, wave: f.wave.value,
        facing: n(f.facing), win: [n(f.w0), n(f.w1)], off: n(f.off), tide: f.tide.value,
        lvl: [n(f.l0), Math.max(n(f.l0), n(f.l1))], minH: n(f.minH), maxH: n(f.maxH),
        m: [f.mlat.value === '' ? Math.round(n(f.lat) * 4) / 4 : n(f.mlat), f.mlng.value === '' ? Math.round(n(f.lng) * 4) / 4 : n(f.mlng)],
        zone: L(f.zone), note: L(f.note), haz: L(f.haz)
      });
      if (f.approx.checked) data.approx = true; else delete data.approx;
      save.disabled = true;
      const row = { data, active: f.active.checked, sort: n(f.sort) || 0 };
      const res = item ? await sb.from('surf_spots').update(row).eq('id', item.id) : await sb.from('surf_spots').insert(Object.assign({ id }, row));
      if (res.error) { save.disabled = false; return fail(res.error, 'Guardar'); }
      toast('Guardado. La app lo usa ya; la previsión del spot llega en la próxima actualización (máx. 3 h).');
      onDone(true);
    });
    return panel;
  }

  // ------------------------------------------------------------------
  // RUTAS: notas sobre los recorridos (la app las muestra y las lee en voz alta al acercarse)
  // ------------------------------------------------------------------
  const NOTE_KINDS = [['warn', '⚠️ Atención'], ['danger', '⛔ Peligro'], ['closed', '🚧 Cortado'], ['water', '💧 Agua'], ['info', 'ℹ️ Información']];
  const kindLabel = (k) => (NOTE_KINDS.find((x) => x[0] === k) || [k, k])[1];
  VIEWS.routes = {
    eyebrow: 'Isla', title: 'Rutas bici y correr',
    async render(view, head) {
      head.append(el('a', { class: 'btn', href: 'https://github.com/STOCKED-APP/MAXORA/actions/workflows/routes.yml', target: '_blank', rel: 'noopener', text: 'Rutas en GitHub' }));
      let RT = null;
      try { RT = await (await fetch('../data/routes.json', { cache: 'no-cache' })).json(); } catch (e) { /* nada */ }
      const routes = (RT && RT.routes) || [];
      const nameOf = (r) => (r.name && (r.name.es || r.name.it || r.name.en)) || r.id;
      const { data: notes, error } = await sb.from('route_notes').select('*').order('created_at', { ascending: false }).limit(500);
      if (error) return fail(error, 'Notas');
      const liveN = notes.filter((n) => n.active && (!n.expires_at || new Date(n.expires_at) > new Date()));
      view.appendChild(el('div', { class: 'kpis' }, [kpi('Rutas', routes.length), kpi('Bici', routes.filter((r) => r.sport === 'bike').length), kpi('Correr', routes.filter((r) => r.sport === 'run').length), kpi('Notas activas', liveN.length, 'hot')]));

      // formulario
      const f = {
        route: el('select', {}, [el('option', { value: '', text: 'Todas las rutas que pasan por ese punto' })].concat(routes.map((r) => el('option', { value: r.id, text: (r.sport === 'bike' ? '🚴 ' : '🏃 ') + nameOf(r) })))),
        kind: el('select', {}, NOTE_KINDS.map(([a, b]) => el('option', { value: a, text: b }))),
        until: el('input', { type: 'date' }),
        lat: el('input', { type: 'number', step: 'any', readonly: true, placeholder: 'toca el mapa' }),
        lng: el('input', { type: 'number', step: 'any', readonly: true, placeholder: 'toca el mapa' }),
        text: LANGS.map((l) => el('input', { maxlength: '140', placeholder: 'Texto · ' + LANG_NAMES[l] + (l === 'es' ? ' (obligatorio)' : ' (si falta, se usa el español)') }))
      };
      const mapBox = el('div', { class: 'amap' });
      const save = el('button', { class: 'btn primary', text: 'Publicar nota' });
      view.appendChild(el('div', { class: 'panel', style: 'margin-bottom:16px' }, [
        el('h2', { text: 'Nueva nota en un recorrido' }),
        el('p', { class: 'sub', text: 'Ejemplos: "Arena en la pista después de la curva", "Carretera cortada hasta el viernes", "Fuente sin agua". Toca el mapa en el punto exacto. La app la muestra en el recorrido y la lee en voz alta a quien usa "Seguir recorrido" cuando está a unos 300 m.' }),
        el('div', { class: 'grid cols-2', style: 'margin-top:12px;align-items:start' }, [
          el('div', { class: 'grid' }, [
            el('label', {}, ['Ruta', f.route]),
            el('div', { class: 'grid cols-2' }, [el('label', {}, ['Tipo', f.kind]), el('label', {}, ['Válida hasta (vacío = sin fecha)', f.until])]),
            el('div', { class: 'grid' }, f.text.map((x) => el('label', {}, [x.placeholder.split(' (')[0], x]))),
            el('div', { class: 'grid cols-2' }, [el('label', {}, ['Latitud', f.lat]), el('label', {}, ['Longitud', f.lng])]),
            el('div', { class: 'row' }, [save])
          ]),
          mapBox
        ])
      ]));
      const listBox = el('div', { class: 'panel' });
      view.appendChild(listBox);

      setTimeout(() => {
        const pk = pickerMap(mapBox, null, null, (la, ln) => { f.lat.value = la; f.lng.value = ln; });
        const m = pk.map;
        m.on('load', () => {
          m.addSource('rt', { type: 'geojson', data: { type: 'FeatureCollection', features: routes.map((r) => ({ type: 'Feature', properties: { id: r.id, c: r.sport === 'bike' ? '#2f9e5b' : '#f2711c' }, geometry: { type: 'LineString', coordinates: r.line } })) } });
          m.addLayer({ id: 'rt', type: 'line', source: 'rt', paint: { 'line-color': ['get', 'c'], 'line-width': ['case', ['==', ['get', 'id'], f.route.value || '-'], 6, 3], 'line-opacity': 0.85 } });
          liveN.forEach((n) => new maplibregl.Marker({ element: el('div', { class: 'note-pin', title: (n.text.es || ''), text: kindLabel(n.kind).split(' ')[0] }) }).setLngLat([n.lng, n.lat]).addTo(m));
        });
        f.route.addEventListener('change', () => {
          if (m.getLayer('rt')) m.setPaintProperty('rt', 'line-width', ['case', ['==', ['get', 'id'], f.route.value || '-'], 6, 3]);
          const r = routes.find((x) => x.id === f.route.value);
          if (r) { const b = new maplibregl.LngLatBounds(r.line[0], r.line[0]); r.line.forEach((p) => b.extend(p)); m.fitBounds(b, { padding: 40 }); }
        });
      }, 0);

      save.addEventListener('click', async () => {
        const text = {}; LANGS.forEach((l, k) => { const v = f.text[k].value.trim(); if (v) text[l] = v; });
        if (!text.es) return toast('Escribe al menos el texto en español');
        if (f.lat.value === '' || f.lng.value === '') return toast('Toca el mapa en el punto de la nota');
        const r = routes.find((x) => x.id === f.route.value);
        save.disabled = true;
        const row = { route_id: r ? r.id : null, sport: r ? r.sport : null, kind: f.kind.value, lat: Number(f.lat.value), lng: Number(f.lng.value), text,
          expires_at: f.until.value ? new Date(f.until.value + 'T23:59:00').toISOString() : null };
        const res = await sb.from('route_notes').insert(row);
        save.disabled = false;
        if (res.error) return fail(res.error, 'Guardar');
        toast('Nota publicada: la app la ve ya.');
        route();
      });

      listBox.append(el('h2', { text: 'Notas' }), notes.length ? el('div', { class: 'table-wrap' }, [el('table', {}, [
        el('thead', {}, [el('tr', {}, ['Tipo', 'Texto', 'Ruta', 'Válida hasta', 'Estado', ''].map((h) => el('th', { text: h })))]),
        el('tbody', {}, notes.map((n) => {
          const r = routes.find((x) => x.id === n.route_id);
          const expired = n.expires_at && new Date(n.expires_at) <= new Date();
          return el('tr', {}, [
            el('td', { text: kindLabel(n.kind) }),
            el('td', { text: n.text.es || Object.values(n.text)[0] || '' }),
            el('td', { text: r ? nameOf(r) : 'Todas' }),
            el('td', { text: n.expires_at ? fmtD(new Date(n.expires_at)) : '—' }),
            el('td', { text: !n.active ? 'Oculta' : expired ? 'Caducada' : 'Activa' }),
            el('td', {}, [el('div', { class: 'row' }, [
              el('button', { class: 'btn small', text: n.active ? 'Ocultar' : 'Mostrar', onclick: async () => { const x = await sb.from('route_notes').update({ active: !n.active }).eq('id', n.id); if (x.error) return fail(x.error); route(); } }),
              el('button', { class: 'btn small ghost', text: 'Borrar', onclick: async () => { if (!confirm('¿Borrar esta nota?')) return; const x = await sb.from('route_notes').delete().eq('id', n.id); if (x.error) return fail(x.error); route(); } })
            ])])
          ]);
        }))
      ])]) : el('div', { class: 'empty', text: 'Todavía no hay notas. Crea la primera arriba.' }));
    }
  };

  VIEWS.surf = {
    eyebrow: 'Isla', title: 'Surf',
    async render(view, head) {
      head.append(
        el('button', { class: 'btn primary', text: 'Nuevo spot', onclick: () => openEditor(null) }),
        el('a', { class: 'btn', href: 'https://github.com/STOCKED-APP/MAXORA/actions/workflows/surf.yml', target: '_blank', rel: 'noopener', text: 'Previsiones en GitHub' })
      );
      let fc = null, td = null;
      try { fc = await (await fetch('../data/surf.json', { cache: 'no-cache' })).json(); } catch (e) { /* nada */ }
      try { td = await (await fetch('../data/tides.json', { cache: 'no-cache' })).json(); } catch (e) { /* nada */ }
      const [spots, reps] = await Promise.all([
        sb.from('surf_spots').select('*').order('sort'),
        sb.from('surf_reports').select('*').gte('created_at', new Date(Date.now() - 7 * 86400000).toISOString()).order('created_at', { ascending: false }).limit(300)
      ]);
      if (spots.error) {
        view.appendChild(el('div', { class: 'panel empty', text: 'Falta activar las tablas de surf en la base de datos (migración 006_surf.sql). Hasta entonces la app usa la lista de spots del archivo.' }));
        return;
      }
      const live = (reps.data || []).filter(isLive);
      const v = td && td.validation;
      view.appendChild(el('div', { class: 'kpis' }, [
        kpi('Spots', (spots.data || []).length),
        kpi('Avisos surf activos', live.length, 'hot'),
        kpi('Avisos surf 7 días', (reps.data || []).length),
        kpi('Previsión olas', fc ? ago(fc.generated.replace('Z', ':00Z')) : '—'),
        kpi('Mareas: error horario', v ? '±' + v.time_err_min_median_abs + ' min' : '—'),
        kpi('Mareas: error altura', v ? '±' + v.height_err_cm_median_abs + ' cm' : '—')
      ]));
      const editorBox = el('div', { style: 'margin-bottom:16px' });
      const listBox = el('div');
      const repBox = el('div', { style: 'margin-top:16px' });
      view.append(editorBox, listBox, repBox);
      function openEditor(item) {
        maps.forEach((m) => { try { m.remove(); } catch (e) {} }); maps = [];
        editorBox.innerHTML = '';
        editorBox.appendChild(surfSpotEditor(item, (changed) => { editorBox.innerHTML = ''; if (changed) route(); }));
        editorBox.scrollIntoView({ behavior: 'smooth' });
      }
      const byId = new Map((spots.data || []).map((x) => [x.id, x]));
      listBox.appendChild(el('div', { class: 'table-wrap' }, [el('table', {}, [
        el('thead', {}, [el('tr', {}, ['Spot', 'Nivel', 'Mar de fondo', 'Terral', 'Marea', 'Altura útil', 'Avisos ahora', 'Visible', ''].map((h) => el('th', { text: h })))]),
        el('tbody', {}, (spots.data || []).map((x) => {
          const d = x.data, n = live.filter((r) => r.spot_id === x.id).length;
          return el('tr', {}, [
            el('td', {}, [el('b', { text: d.name }), d.approx ? el('span', { class: 'muted', text: ' · aprox.' }) : null]),
            el('td', { text: ['', 'Princ.', 'Inter.', 'Exp.'][d.lvl[0]] + '–' + ['', 'Princ.', 'Inter.', 'Exp.'][d.lvl[1]] }),
            el('td', { text: d.win[0] + '°–' + d.win[1] + '°' }), el('td', { text: d.off + '°' }),
            el('td', { text: (TIDE_OPTS.find((t) => t[0] === d.tide) || ['', d.tide])[1] }),
            el('td', { text: d.minH + '–' + d.maxH + ' m' }),
            el('td', { text: String(n) }),
            el('td', {}, [el('span', { class: 'pill ' + (x.active ? 'ok' : ''), text: x.active ? 'sí' : 'no' })]),
            el('td', {}, [el('div', { class: 'acts' }, [el('button', { class: 'btn small', text: 'Editar', onclick: () => openEditor(x) })])])
          ]);
        }))
      ])]));
      repBox.appendChild(el('div', { class: 'panel' }, [
        el('h2', { text: 'Avisos de surfistas (7 días)' }),
        el('p', { class: 'sub', text: 'Cada aviso dura 3 horas y corrige la nota del spot en la app. Quita los falsos y bloquea a quien abuse.' }),
        (reps.data || []).length ? el('div', { class: 'table-wrap' }, [el('table', {}, [
          el('thead', {}, [el('tr', {}, ['Cuándo', 'Spot', 'Tamaño', 'Estado', 'Gente', 'Usuario', 'Estado', ''].map((h) => el('th', { text: h })))]),
          el('tbody', {}, reps.data.map((r) => el('tr', {}, [
            el('td', { text: fmtDT(r.created_at) }),
            el('td', { text: byId.get(r.spot_id) ? byId.get(r.spot_id).data.name : r.spot_id }),
            el('td', { text: SURF_SIZE[r.size] || '' }), el('td', { text: SURF_QUAL[r.quality] || '' }), el('td', { text: r.crowd == null ? '—' : SURF_CROWD[r.crowd] }),
            el('td', { class: 'id', text: shortId(r.user_id) }),
            el('td', {}, [el('span', { class: 'pill ' + (isLive(r) ? 'ok' : r.removed_at ? 'bad' : ''), text: isLive(r) ? 'activo' : r.removed_at ? 'quitado' : 'caducado' })]),
            el('td', {}, [el('div', { class: 'acts' }, [
              isLive(r) ? el('button', { class: 'btn small', text: 'Quitar', onclick: async () => { const { error } = await sb.from('surf_reports').update({ removed_at: new Date().toISOString() }).eq('id', r.id); if (error) return fail(error); toast('Quitado'); route(); } }) : null,
              r.user_id ? el('button', { class: 'btn small danger', text: 'Bloquear', onclick: async () => { if (!confirm('¿Bloquear este dispositivo? No podrá avisar más.')) return; const { error } = await sb.from('blocked_users').upsert({ user_id: r.user_id, reason: 'surf' }); if (error) return fail(error); toast('Bloqueado'); } }) : null
            ])])
          ])))
        ])]) : el('div', { class: 'empty', text: 'Todavía no hay avisos de surfistas.' })
      ]));
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
    if (recovering) { showNewPass(); return; }
    if (await checkAdmin()) start();
    else $('login').classList.remove('hidden');
  })();
})();
