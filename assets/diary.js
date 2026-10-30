/* Maxora — diario surf: una riga per sessione (spot, quando, quanto, voto). Le condizioni del mare le salviamo noi.
   Dopo qualche sessione l'app impara cosa piace a te e mostra un voto personale ("Per te"). */
(function () {
  'use strict';
  const M = window.MAXORA;
  if (!M) return;
  const { sb, el, toast } = M;

  const TX = {
    it: { log: 'Ho surfato qui', title: 'Com\'è andata?', when: 'Quando', now: 'Adesso', morning: 'Stamattina', afternoon: 'Oggi pomeriggio', yMorning: 'Ieri mattina', yAfternoon: 'Ieri pomeriggio', dur: 'Quanto', rate: 'Voto alla sessione', note: 'Nota (facoltativa)', save: 'Salva', saved: 'Sessione salvata', pickRate: 'Dai un voto da 1 a 5',
      diary: 'Diario', diaryT: 'Il tuo diario surf', empty: 'Nessuna sessione ancora. Dopo il surf apri lo spot e tocca «Ho surfato qui»: ci vogliono 5 secondi.', month: 'questo mese', total: 'sessioni', hours: 'ore in acqua', top: 'spot preferito',
      learn: 'Il tuo mare ideale', learnN: 'Servono almeno {n} sessioni con voto per capire cosa ti piace ({k} finora).', bestWaves: 'Onde', bestPeriod: 'Periodo', bestWind: 'Vento', bestTide: 'Marea', from: 'dalle tue sessioni da 4–5 stelle',
      forYou: 'Per te', forYouN: 'da {n} sessioni', del: 'Elimina', delQ: 'Eliminare questa sessione?', noAcc: 'Il diario resta su questo telefono finché non salvi i dati con l\'email (Impostazioni).', err: 'Salvataggio non riuscito',
      low: 'bassa', mid: 'media', high: 'alta', min: 'min', h: 'h' },
    es: { log: 'He surfeado aquí', title: '¿Qué tal fue?', when: 'Cuándo', now: 'Ahora', morning: 'Esta mañana', afternoon: 'Esta tarde', yMorning: 'Ayer por la mañana', yAfternoon: 'Ayer por la tarde', dur: 'Cuánto', rate: 'Nota de la sesión', note: 'Nota (opcional)', save: 'Guardar', saved: 'Sesión guardada', pickRate: 'Pon una nota de 1 a 5',
      diary: 'Diario', diaryT: 'Tu diario de surf', empty: 'Aún no hay sesiones. Después de surfear abre el spot y toca «He surfeado aquí»: son 5 segundos.', month: 'este mes', total: 'sesiones', hours: 'horas en el agua', top: 'spot favorito',
      learn: 'Tu mar ideal', learnN: 'Hacen falta al menos {n} sesiones con nota para saber qué te gusta ({k} hasta ahora).', bestWaves: 'Olas', bestPeriod: 'Periodo', bestWind: 'Viento', bestTide: 'Marea', from: 'de tus sesiones de 4–5 estrellas',
      forYou: 'Para ti', forYouN: 'de {n} sesiones', del: 'Borrar', delQ: '¿Borrar esta sesión?', noAcc: 'El diario se queda en este teléfono hasta que guardes tus datos con el email (Ajustes).', err: 'No se pudo guardar',
      low: 'baja', mid: 'media', high: 'alta', min: 'min', h: 'h' },
    en: { log: 'I surfed here', title: 'How was it?', when: 'When', now: 'Now', morning: 'This morning', afternoon: 'This afternoon', yMorning: 'Yesterday morning', yAfternoon: 'Yesterday afternoon', dur: 'How long', rate: 'Rate the session', note: 'Note (optional)', save: 'Save', saved: 'Session saved', pickRate: 'Give it 1 to 5 stars',
      diary: 'Diary', diaryT: 'Your surf diary', empty: 'No sessions yet. After surfing open the spot and tap “I surfed here”: it takes 5 seconds.', month: 'this month', total: 'sessions', hours: 'hours in the water', top: 'favourite spot',
      learn: 'Your ideal sea', learnN: 'At least {n} rated sessions are needed to learn what you like ({k} so far).', bestWaves: 'Waves', bestPeriod: 'Period', bestWind: 'Wind', bestTide: 'Tide', from: 'from your 4–5 star sessions',
      forYou: 'For you', forYouN: 'from {n} sessions', del: 'Delete', delQ: 'Delete this session?', noAcc: 'Your diary stays on this phone until you save your data with email (Settings).', err: 'Could not save',
      low: 'low', mid: 'mid', high: 'high', min: 'min', h: 'h' },
    de: { log: 'Hier gesurft', title: 'Wie war es?', when: 'Wann', now: 'Jetzt', morning: 'Heute Morgen', afternoon: 'Heute Nachmittag', yMorning: 'Gestern Morgen', yAfternoon: 'Gestern Nachmittag', dur: 'Wie lange', rate: 'Bewertung', note: 'Notiz (optional)', save: 'Speichern', saved: 'Session gespeichert', pickRate: 'Gib 1 bis 5 Sterne',
      diary: 'Tagebuch', diaryT: 'Dein Surf-Tagebuch', empty: 'Noch keine Sessions. Nach dem Surfen den Spot öffnen und «Hier gesurft» tippen: 5 Sekunden.', month: 'diesen Monat', total: 'Sessions', hours: 'Stunden im Wasser', top: 'Lieblingsspot',
      learn: 'Dein ideales Meer', learnN: 'Mindestens {n} bewertete Sessions nötig, um zu lernen, was dir gefällt ({k} bisher).', bestWaves: 'Wellen', bestPeriod: 'Periode', bestWind: 'Wind', bestTide: 'Tide', from: 'aus deinen 4–5-Sterne-Sessions',
      forYou: 'Für dich', forYouN: 'aus {n} Sessions', del: 'Löschen', delQ: 'Diese Session löschen?', noAcc: 'Das Tagebuch bleibt auf diesem Telefon, bis du deine Daten per E-Mail sicherst (Einstellungen).', err: 'Speichern fehlgeschlagen',
      low: 'niedrig', mid: 'mittel', high: 'hoch', min: 'Min', h: 'Std' }
  };
  const LOC = { it: 'it-IT', es: 'es-ES', en: 'en-GB', de: 'de-DE' };
  const lang = () => (TX[M.lang()] ? M.lang() : 'es');
  const tr = (k, v) => { let s = TX[lang()][k] || TX.es[k] || k; if (v) Object.keys(v).forEach((x) => { s = s.replace('{' + x + '}', v[x]); }); return s; };
  const num = (v, d) => new Intl.NumberFormat(LOC[lang()], { maximumFractionDigits: d, minimumFractionDigits: d }).format(v);
  const S = () => window.MAXORA_SURF && window.MAXORA_SURF.state;
  const MIN_LEARN = 5;
  const WLABEL = { glassy: 'glassy', offshore: 'offshore', crossoff: 'cross-off', cross: 'cross-shore', crosson: 'cross-on', onshore: 'onshore' };

  let sessions = [], loaded = false;
  async function load(force) {
    if (loaded && !force) return sessions;
    try {
      const { data } = await sb.from('surf_sessions').select('*').order('started_at', { ascending: false }).limit(500);
      sessions = data || [];
      loaded = true;
    } catch (e) { /* senza rete */ }
    return sessions;
  }
  const linked = () => window.MAXORA_ACCOUNT && window.MAXORA_ACCOUNT.linked();

  // condizioni del mare al momento della sessione (dalla previsione che l'app ha già)
  function conditionsAt(spotId, ms) {
    const st = S();
    if (!st || !st.fc) return null;
    let k = -1, best = 1e15;
    st.times.forEach((t, i) => { const d = Math.abs(t - ms); if (d < best) { best = d; k = i; } });
    if (k < 0 || best > 2.5 * 3600000) return null;
    const x = window.MAXORA_SURF.rate(spotId, k);
    if (!x) return null;
    const r2 = (v) => (v == null ? null : Math.round(v * 100) / 100);
    return { t: new Date(st.times[k]).toISOString(), r: x.r, h: r2(x.h), hs: r2(x.hs), tp: r2(x.tp), dir: x.dir, ws: x.ws, wd: x.wd, wind: x.wind, tide: x.tide ? r2(x.tide.u) : null, rising: x.tide ? x.tide.rising : null, level: st.level };
  }

  // ------------------------------------------------------------------
  // Scheda "Com'è andata?"
  // ------------------------------------------------------------------
  function log(spotId) {
    const st = S();
    const sp = st && st.byId.get(spotId);
    if (!sp) return;
    const day = (d, h) => { const x = new Date(); x.setDate(x.getDate() - d); x.setHours(h, 0, 0, 0); return x.getTime(); };
    const nowH = new Date().getHours();
    const WHEN = [['now', null], nowH >= 11 ? ['morning', day(0, 9)] : null, nowH >= 17 ? ['afternoon', day(0, 15)] : null, ['yMorning', day(1, 9)], ['yAfternoon', day(1, 15)]].filter(Boolean);
    const DUR = [30, 60, 90, 120, 180];
    const f = { when: 'now', dur: 90, rate: 0 };
    const ov = el('div', { class: 'nav-ov', onclick: (e) => { if (e.target === ov) ov.remove(); } });
    const sh = el('div', { class: 'nav-sh dy-sh', role: 'dialog', 'aria-modal': 'true' });
    ov.appendChild(sh);
    function chips(list, key, label) {
      return el('div', { class: 'dy-chips' }, list.map((it) => el('button', { class: f[key] === it[0] ? 'on' : '', onclick: () => { f[key] = it[0]; draw(); } }, [label(it)])));
    }
    const note = el('input', { class: 'acct-in', maxlength: '300', placeholder: tr('note') });
    function draw() {
      const keep = note.value;
      sh.innerHTML = '';
      sh.append(
        el('div', { class: 'nav-k', text: '🏄 ' + sp.name }), el('div', { class: 'nav-n', text: tr('title') }),
        el('div', { class: 'dy-l', text: tr('when') }), chips(WHEN, 'when', (it) => tr(it[0])),
        el('div', { class: 'dy-l', text: tr('dur') }), chips(DUR.map((d) => [d]), 'dur', (it) => (it[0] < 60 ? it[0] + ' ' + tr('min') : num(it[0] / 60, it[0] % 60 ? 1 : 0) + ' ' + tr('h'))),
        el('div', { class: 'dy-l', text: tr('rate') }),
        el('div', { class: 'dy-stars' }, [1, 2, 3, 4, 5].map((n) => el('button', { class: n <= f.rate ? 'on' : '', 'aria-label': n + '/5', onclick: () => { f.rate = n; draw(); } }, ['★']))),
        note,
        el('button', { class: 'acct-b dy-save', onclick: save, text: tr('save') }),
        linked() ? null : el('p', { class: 'p-note', text: tr('noAcc') }),
        el('button', { class: 'nav-x', onclick: () => ov.remove(), text: '✕' })
      );
      note.value = keep;
    }
    async function save() {
      if (!f.rate) { toast(tr('pickRate')); return; }
      const w = WHEN.find((x) => x[0] === f.when);
      const start = w[1] || (Date.now() - f.dur * 60000);
      const row = { spot_id: spotId, started_at: new Date(start).toISOString(), minutes: f.dur, rating: f.rate, note: note.value.trim() || null, conditions: conditionsAt(spotId, start + f.dur * 30000) };
      const { data, error } = await sb.from('surf_sessions').insert(row).select().maybeSingle();
      if (error) { toast(tr('err')); return; }
      if (data) sessions.unshift(data);
      ov.remove();
      toast('🏄 ' + tr('saved'));
      if (window.MAXORA_SURF && window.MAXORA_SURF.redraw) window.MAXORA_SURF.redraw();
    }
    draw();
    document.body.appendChild(ov);
  }

  // ------------------------------------------------------------------
  // Cosa ti piace: dalle sessioni da 4–5 stelle
  // ------------------------------------------------------------------
  const q = (arr, p) => { const a = arr.slice().sort((x, y) => x - y); return a[Math.min(a.length - 1, Math.max(0, Math.round((a.length - 1) * p)))]; };
  function profile() {
    const rated = sessions.filter((s) => s.conditions && s.conditions.h != null);
    if (rated.length < MIN_LEARN) return { ready: false, k: rated.length };
    const good = rated.filter((s) => s.rating >= 4), bad = rated.filter((s) => s.rating <= 2);
    if (good.length < 2) return { ready: false, k: rated.length };
    const hs = good.map((s) => s.conditions.h), tps = good.map((s) => s.conditions.tp).filter((v) => v != null), tides = good.map((s) => s.conditions.tide).filter((v) => v != null);
    const count = (list) => { const m = {}; list.forEach((s) => { const k = s.conditions.wind; if (k) m[k] = (m[k] || 0) + 1; }); return m; };
    const gw = count(good), bw = count(bad);
    return { ready: true, n: rated.length, h: [q(hs, 0.2), q(hs, 0.8)], tp: tps.length ? q(tps, 0.25) : null, goodWind: Object.keys(gw).sort((a, b) => gw[b] - gw[a]).slice(0, 2), badWind: Object.keys(bw).filter((k) => !gw[k] || bw[k] > gw[k]), tide: tides.length ? [q(tides, 0.2), q(tides, 0.8)] : null };
  }
  // voto personale: il voto del modello spostato verso i tuoi gusti (massimo ±1,5 stelle)
  function personal(x) {
    const p = profile();
    if (!p.ready || !x) return null;
    let d = 0;
    const [h0, h1] = p.h, w = Math.max(0.2, h1 - h0);
    if (x.h >= h0 && x.h <= h1) d += 0.5; else d -= Math.min(1, Math.min(Math.abs(x.h - h0), Math.abs(x.h - h1)) / w);
    if (p.tp && x.tp != null && x.tp < p.tp - 1.5) d -= 0.4;
    if (p.goodWind.includes(x.wind)) d += 0.4; else if (p.badWind.includes(x.wind)) d -= 0.6;
    if (p.tide && x.tide) { const u = x.tide.u; if (u < p.tide[0] - 0.15 || u > p.tide[1] + 0.15) d -= 0.3; }
    const r = Math.round(Math.max(0, Math.min(5, x.r + Math.max(-1.5, Math.min(1.5, d)))) * 2) / 2;
    return { r, n: p.n };
  }
  function personalNode(x) {
    const p = personal(x);
    if (!p) return null;
    return el('div', { class: 'dy-you' }, [el('b', { text: '🎯 ' + tr('forYou') + ' ★ ' + num(p.r, p.r % 1 ? 1 : 0) }), el('span', { text: ' · ' + tr('forYouN', { n: p.n }) })]);
  }

  // ------------------------------------------------------------------
  // Il diario
  // ------------------------------------------------------------------
  async function open() {
    await load();
    const st = S();
    const ov = el('div', { class: 'nav-ov', onclick: (e) => { if (e.target === ov) ov.remove(); } });
    const sh = el('div', { class: 'nav-sh dy-sh dy-big', role: 'dialog', 'aria-modal': 'true' });
    ov.appendChild(sh);
    sh.append(el('div', { class: 'nav-k', text: '📓 ' + tr('diary') }), el('div', { class: 'nav-n', text: tr('diaryT') }), el('button', { class: 'nav-x', onclick: () => ov.remove(), text: '✕' }));
    if (!sessions.length) { sh.appendChild(el('p', { class: 'p-desc', text: tr('empty') })); document.body.appendChild(ov); return; }
    const now = new Date(), m0 = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    const month = sessions.filter((s) => Date.parse(s.started_at) >= m0);
    const per = {}; sessions.forEach((s) => { per[s.spot_id] = (per[s.spot_id] || 0) + 1; });
    const topId = Object.keys(per).sort((a, b) => per[b] - per[a])[0];
    const nameOf = (id) => (st && st.byId.get(id) ? st.byId.get(id).name : id);
    sh.appendChild(el('div', { class: 'dy-stats' }, [
      el('div', {}, [el('b', { text: String(month.length) }), el('span', { text: tr('total') + ' ' + tr('month') })]),
      el('div', {}, [el('b', { text: num(sessions.reduce((a, s) => a + s.minutes, 0) / 60, 0) }), el('span', { text: tr('hours') })]),
      el('div', {}, [el('b', { text: nameOf(topId).split(' · ')[0] }), el('span', { text: tr('top') })])
    ]));
    // il tuo mare ideale
    const p = profile();
    const lv = (u) => (u < 0.35 ? tr('low') : u > 0.65 ? tr('high') : tr('mid'));
    sh.appendChild(el('div', { class: 'dy-h', text: '🎯 ' + tr('learn') }));
    if (!p.ready) sh.appendChild(el('p', { class: 'p-note', text: tr('learnN', { n: MIN_LEARN, k: p.k }) }));
    else sh.appendChild(el('div', { class: 'cp-facts' }, [
      [tr('bestWaves'), num(p.h[0], 1) + '–' + num(p.h[1], 1) + ' m'], p.tp ? [tr('bestPeriod'), '≥ ' + num(p.tp, 0) + ' s'] : null,
      p.goodWind.length ? [tr('bestWind'), p.goodWind.map((k) => WLABEL[k]).join(', ')] : null, p.tide ? [tr('bestTide'), lv(p.tide[0]) + (lv(p.tide[0]) !== lv(p.tide[1]) ? '–' + lv(p.tide[1]) : '')] : null
    ].filter(Boolean).map(([k, v]) => el('div', { class: 'cp-f' }, [el('span', { class: 'k', text: k }), el('span', { class: 'v', text: v })]))));
    if (p.ready) sh.appendChild(el('p', { class: 'p-note', text: tr('from') }));
    // sessioni
    const fmt = new Intl.DateTimeFormat(LOC[lang()], { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'Atlantic/Canary' });
    const list = el('div', { class: 'dy-list' });
    sessions.slice(0, 60).forEach((s) => {
      const c = s.conditions || {};
      list.appendChild(el('div', { class: 'dy-row' }, [
        el('div', { class: 'dy-r', text: '★'.repeat(s.rating) + '☆'.repeat(5 - s.rating) }),
        el('div', { class: 'dy-t' }, [el('b', { text: nameOf(s.spot_id) }), el('span', { text: fmt.format(new Date(s.started_at)) + ' · ' + (s.minutes < 60 ? s.minutes + ' ' + tr('min') : num(s.minutes / 60, s.minutes % 60 ? 1 : 0) + ' ' + tr('h')) }),
          c.h != null ? el('span', { class: 'c', text: num(c.h, 1) + ' m · ' + (c.tp ? num(c.tp, 0) + ' s · ' : '') + (c.ws != null ? c.ws + ' km/h ' + (WLABEL[c.wind] || '') : '') }) : null,
          s.note ? el('span', { class: 'c', text: '“' + s.note + '”' }) : null]),
        el('button', { class: 'dy-del', 'aria-label': tr('del'), onclick: async () => { if (!confirm(tr('delQ'))) return; const r = await sb.from('surf_sessions').delete().eq('id', s.id); if (!r.error) { sessions = sessions.filter((x) => x.id !== s.id); ov.remove(); open(); } } }, ['🗑'])
      ]));
    });
    sh.appendChild(list);
    document.body.appendChild(ov);
  }

  load();
  window.MAXORA_DIARY = { log, open, personalNode, label: () => tr('log'), short: () => tr('diary'), load };
})();
