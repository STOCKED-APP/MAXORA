/* Maxora — tutorial al primo avvio + suggerimenti la prima volta in ogni modalità */
(function () {
  'use strict';
  const M = window.MAXORA;
  if (!M) return;
  const { el, store } = M;
  const $ = (id) => document.getElementById(id);

  const TX = {
    it: {
      skip: 'Salta', next: 'Avanti', start: 'Inizia', done: 'Ho capito', back: 'Indietro',
      w1t: 'Maxora', w1s: 'Fuerteventura in tempo reale', w1a: 'Avvisi sulla strada mandati da chi guida, aggiornati al minuto', w1b: 'Onde e maree per il surf, percorsi per bici e corsa', w1c: 'Gratis, senza registrazione',
      langQ: 'Lingua',
      p1t: 'La tua posizione', p1s: 'Serve per avvisarti di cosa hai davanti mentre guidi.', p1a: 'Non la salviamo e non la vede nessuno', p1b: 'Parte solo quando segnali qualcosa, nel punto della segnalazione', p1c: 'I controlli di polizia si vedono solo come zona, mai il punto esatto',
      p1go: 'Attiva la posizione', p1later: 'Più tardi',
      m1t: 'Cosa ti interessa?', m1s: 'Puoi cambiarlo quando vuoi dal tasto modalità.',
      road: 'Strada', surf: 'Surf', bike: 'Bici', run: 'Corsa',
      dRoad: 'Avvisi, traffico e controlli', dSurf: 'Onde, vento, maree e spot', dBike: 'Percorsi, vento e salite', dRun: 'Percorsi e ora migliore',
      lvlQ: 'Il tuo livello nel surf', lvl1: 'Principiante', lvl2: 'Intermedio', lvl3: 'Esperto',
      r1t: 'Due regole', r1a: 'Segnala solo da fermo o se sei passeggero.', r1b: 'Quando passi vicino a un avviso, conferma con ✓ se c\'è ancora o ✕ se non c\'è più. Così la mappa resta vera.',
      c_search: 'Cerca vie, spiagge, ristoranti o benzinai. Scrivi "ristoranti" e li vedi tutti sulla mappa.',
      c_sheet: 'Qui vedi cosa hai davanti sulla strada. Tocca la linguetta per aprire o chiudere il pannello.',
      c_report: 'Vedi un incidente, lavori, sabbia o traffico? Toccalo e scegli cosa succede.',
      c_modes: 'Il tasto delle modalità: Strada, Surf, Bici e Corsa.',
      c_layers: 'Mappa normale o vista satellite.',
      c_locate: 'Torna sulla tua posizione e la mappa ti segue.',
      c_discover: 'Scopri l\'isola: posti da vedere e attività locali.',
      s_list: 'Gli spot migliori in questo momento per il tuo livello, con stelle, onde, energia e vento.',
      s_times: 'Scorri le ore e i giorni: tutta la mappa si aggiorna con le previsioni.',
      s_level: 'Cambia il livello: il voto degli spot si adatta a te.',
      s_pin: 'Ogni stella è uno spot. Toccala per previsioni, maree, com\'è adesso e indicazioni.',
      b_now: 'Condizioni adesso: voto, temperatura, vento e luce.',
      b_times: 'L\'ora migliore per uscire nei prossimi giorni.',
      b_list: 'I percorsi: tocca per altimetria, vento sul percorso, avvisi e GPX.',
      b_report: 'In bici su strada? Avvisa gli automobilisti che ci sono ciclisti.',
      again: 'Rivedi il tutorial'
    },
    es: {
      skip: 'Saltar', next: 'Siguiente', start: 'Empezar', done: 'Entendido', back: 'Atrás',
      w1t: 'Maxora', w1s: 'Fuerteventura en tiempo real', w1a: 'Avisos en la carretera enviados por quien conduce, al minuto', w1b: 'Olas y mareas para surf, rutas para bici y correr', w1c: 'Gratis, sin registro',
      langQ: 'Idioma',
      p1t: 'Tu ubicación', p1s: 'Sirve para avisarte de lo que tienes delante mientras conduces.', p1a: 'No la guardamos y nadie la ve', p1b: 'Solo se envía cuando avisas de algo, en el punto del aviso', p1c: 'Los controles de policía se muestran solo como zona, nunca el punto exacto',
      p1go: 'Activar ubicación', p1later: 'Más tarde',
      m1t: '¿Qué te interesa?', m1s: 'Puedes cambiarlo cuando quieras con el botón de modos.',
      road: 'Carretera', surf: 'Surf', bike: 'Bici', run: 'Correr',
      dRoad: 'Avisos, tráfico y controles', dSurf: 'Olas, viento, mareas y spots', dBike: 'Rutas, viento y subidas', dRun: 'Rutas y mejor hora',
      lvlQ: 'Tu nivel de surf', lvl1: 'Principiante', lvl2: 'Intermedio', lvl3: 'Experto',
      r1t: 'Dos reglas', r1a: 'Avisa solo parado o si vas de pasajero.', r1b: 'Al pasar cerca de un aviso, confirma con ✓ si sigue o ✕ si ya no está. Así el mapa es fiable.',
      c_search: 'Busca calles, playas, restaurantes o gasolineras. Escribe "restaurantes" y los ves todos en el mapa.',
      c_sheet: 'Aquí ves lo que tienes delante en la carretera. Toca la pestaña para abrir o cerrar el panel.',
      c_report: '¿Ves un accidente, obras, arena o tráfico? Tócalo y elige qué pasa.',
      c_modes: 'El botón de modos: Carretera, Surf, Bici y Correr.',
      c_layers: 'Mapa normal o vista satélite.',
      c_locate: 'Vuelve a tu posición y el mapa te sigue.',
      c_discover: 'Descubre la isla: lugares y negocios locales.',
      s_list: 'Los mejores spots ahora para tu nivel, con estrellas, olas, energía y viento.',
      s_times: 'Desliza las horas y los días: todo el mapa se actualiza.',
      s_level: 'Cambia tu nivel: la nota de los spots se adapta a ti.',
      s_pin: 'Cada estrella es un spot. Tócala para previsión, mareas, cómo está ahora y cómo llegar.',
      b_now: 'Condiciones ahora: nota, temperatura, viento y luz.',
      b_times: 'La mejor hora para salir en los próximos días.',
      b_list: 'Las rutas: toca para perfil, viento en la ruta, avisos y GPX.',
      b_report: '¿En bici por carretera? Avisa a los conductores de que hay ciclistas.',
      again: 'Ver el tutorial otra vez'
    },
    en: {
      skip: 'Skip', next: 'Next', start: 'Start', done: 'Got it', back: 'Back',
      w1t: 'Maxora', w1s: 'Fuerteventura in real time', w1a: 'Road alerts sent by drivers, updated by the minute', w1b: 'Waves and tides for surfing, routes for cycling and running', w1c: 'Free, no sign-up',
      langQ: 'Language',
      p1t: 'Your location', p1s: 'Used to warn you about what\'s ahead while you drive.', p1a: 'We don\'t store it and nobody sees it', p1b: 'It is only sent when you report something, at that spot', p1c: 'Police checks are shown only as an area, never the exact spot',
      p1go: 'Turn on location', p1later: 'Later',
      m1t: 'What are you into?', m1s: 'Change it any time with the modes button.',
      road: 'Road', surf: 'Surf', bike: 'Bike', run: 'Run',
      dRoad: 'Alerts, traffic and checks', dSurf: 'Waves, wind, tides and spots', dBike: 'Routes, wind and climbs', dRun: 'Routes and best time',
      lvlQ: 'Your surf level', lvl1: 'Beginner', lvl2: 'Intermediate', lvl3: 'Expert',
      r1t: 'Two rules', r1a: 'Only report when stopped or as a passenger.', r1b: 'When you pass an alert, confirm with ✓ if it\'s still there or ✕ if it\'s gone. That keeps the map true.',
      c_search: 'Search streets, beaches, restaurants or fuel. Type "restaurants" to see them all on the map.',
      c_sheet: 'What\'s ahead of you on the road. Tap the tab to open or close the panel.',
      c_report: 'See an accident, roadworks, sand or traffic? Tap here and pick what\'s happening.',
      c_modes: 'The modes button: Road, Surf, Bike and Run.',
      c_layers: 'Normal map or satellite view.',
      c_locate: 'Back to your position, with the map following you.',
      c_discover: 'Discover the island: places and local businesses.',
      s_list: 'The best spots right now for your level, with stars, waves, energy and wind.',
      s_times: 'Slide through hours and days: the whole map updates.',
      s_level: 'Change your level: spot ratings adapt to you.',
      s_pin: 'Each star is a spot. Tap it for forecast, tides, live reports and directions.',
      b_now: 'Conditions now: rating, temperature, wind and light.',
      b_times: 'The best time to go out over the next days.',
      b_list: 'Routes: tap for elevation, wind on the route, alerts and GPX.',
      b_report: 'Cycling on the road? Let drivers know there are cyclists.',
      again: 'See the tutorial again'
    },
    de: {
      skip: 'Überspringen', next: 'Weiter', start: 'Los geht\'s', done: 'Verstanden', back: 'Zurück',
      w1t: 'Maxora', w1s: 'Fuerteventura in Echtzeit', w1a: 'Straßenmeldungen von Autofahrern, minutengenau', w1b: 'Wellen und Gezeiten zum Surfen, Strecken für Rad und Laufen', w1c: 'Kostenlos, ohne Anmeldung',
      langQ: 'Sprache',
      p1t: 'Dein Standort', p1s: 'Damit wir dich unterwegs vor dem warnen, was vor dir liegt.', p1a: 'Wir speichern ihn nicht und niemand sieht ihn', p1b: 'Er wird nur gesendet, wenn du etwas meldest, an dieser Stelle', p1c: 'Polizeikontrollen erscheinen nur als Bereich, nie als genauer Punkt',
      p1go: 'Standort aktivieren', p1later: 'Später',
      m1t: 'Was interessiert dich?', m1s: 'Jederzeit über den Modus-Knopf änderbar.',
      road: 'Straße', surf: 'Surf', bike: 'Rad', run: 'Laufen',
      dRoad: 'Meldungen, Verkehr, Kontrollen', dSurf: 'Wellen, Wind, Gezeiten, Spots', dBike: 'Strecken, Wind, Anstiege', dRun: 'Strecken und beste Zeit',
      lvlQ: 'Dein Surf-Level', lvl1: 'Anfänger', lvl2: 'Fortgeschritten', lvl3: 'Experte',
      r1t: 'Zwei Regeln', r1a: 'Nur im Stand oder als Beifahrer melden.', r1b: 'Kommst du an einer Meldung vorbei, bestätige mit ✓ oder ✕, wenn sie weg ist. So bleibt die Karte richtig.',
      c_search: 'Suche Straßen, Strände, Restaurants oder Tankstellen. Tippe "Restaurants" und sieh alle auf der Karte.',
      c_sheet: 'Was auf der Straße vor dir liegt. Tippe auf die Lasche, um das Feld zu öffnen oder zu schließen.',
      c_report: 'Unfall, Baustelle, Sand oder Stau? Hier tippen und auswählen.',
      c_modes: 'Der Modus-Knopf: Straße, Surf, Rad und Laufen.',
      c_layers: 'Normale Karte oder Satellit.',
      c_locate: 'Zurück zu deiner Position, die Karte folgt dir.',
      c_discover: 'Entdecke die Insel: Orte und lokale Betriebe.',
      s_list: 'Die besten Spots jetzt für dein Level, mit Sternen, Wellen, Energie und Wind.',
      s_times: 'Wische durch Stunden und Tage: die ganze Karte aktualisiert sich.',
      s_level: 'Ändere dein Level: die Bewertung passt sich an.',
      s_pin: 'Jeder Stern ist ein Spot. Tippen für Vorhersage, Gezeiten, Live-Meldungen und Weg.',
      b_now: 'Bedingungen jetzt: Bewertung, Temperatur, Wind und Licht.',
      b_times: 'Die beste Zeit zum Rausgehen in den nächsten Tagen.',
      b_list: 'Strecken: tippen für Höhenprofil, Wind, Meldungen und GPX.',
      b_report: 'Mit dem Rad auf der Straße? Sag Autofahrern Bescheid.',
      again: 'Tutorial nochmal ansehen'
    }
  };
  const lang = () => (TX[M.lang()] ? M.lang() : 'es');
  const tr = (k) => TX[lang()][k] || TX.es[k] || k;
  const ICON = {
    road: '<path d="M4 20L9 4M20 20L15 4M12 6v2M12 11v2M12 16v2"/>',
    surf: '<path d="M2 16c2 0 2.5-1.5 5-1.5S9.5 16 12 16s2.5-1.5 5-1.5 3 1.5 5 1.5"/><path d="M2 20c2 0 2.5-1.5 5-1.5S9.5 20 12 20s2.5-1.5 5-1.5 3 1.5 5 1.5"/><path d="M5.5 12.5C6 8 9 5 13 5c2.5 0 4.2 1.3 4.2 3.2 0 1.6-1.2 2.6-2.7 2.6-1.3 0-2.2-.8-2.2-1.9"/>',
    bike: '<circle cx="5.5" cy="16.5" r="3.5"/><circle cx="18.5" cy="16.5" r="3.5"/><path d="M5.5 16.5L9 9h6l3.5 7.5M9 9l3.5 7.5L15 9M13 5.5h2.5"/>',
    run: '<circle cx="15" cy="4.5" r="2"/><path d="M8 21l3-6 3 2v4M6 12l3-4 4 1 2 4 3 1M11 15l-2-3"/>',
    pin: '<path d="M12 21s-7-6.2-7-11.5A7 7 0 0119 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    rules: '<path d="M5 12l5 5 9-10"/>'
  };
  const svg = (k, sz) => '<svg width="' + (sz || 24) + '" height="' + (sz || 24) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICON[k] + '</svg>';
  const icon = (k, sz, cls) => { const s = el('span', { class: cls || 'tu-ico' }); s.innerHTML = svg(k, sz); return s; };

  // ------------------------------------------------------------------
  // Schermate di benvenuto
  // ------------------------------------------------------------------
  const st = { step: 0, mode: 'road', level: store.get('surfLevel', 2) };
  let root = null;
  const STEPS = ['welcome', 'location', 'mode', 'rules'];

  function open() {
    st.step = 0; st.mode = 'road';
    if (!root) { root = el('div', { class: 'tu-root', role: 'dialog', 'aria-modal': 'true' }); document.body.appendChild(root); }
    root.classList.remove('hidden');
    draw();
  }
  function close(finished) {
    if (root) root.classList.add('hidden');
    store.set('tourDone', true);
    if (finished !== false) {
      if (st.mode !== 'road' && window.MAXORA_MODES) {
        if (st.mode === 'surf') store.set('surfLevel', st.level);
        window.MAXORA_MODES.choose(st.mode);
      } else setTimeout(() => coach(ROAD), 500);
    }
  }
  function bullet(t) { return el('li', {}, [icon('rules', 18, 'tu-check'), el('span', { text: t })]); }
  function draw() {
    root.innerHTML = '';
    const name = STEPS[st.step];
    const card = el('div', { class: 'tu-card tu-s-' + name });
    const dots = el('div', { class: 'tu-dots' }, STEPS.map((_, i) => el('i', { class: i === st.step ? 'on' : '' })));
    const skip = el('button', { class: 'tu-skip', text: tr('skip'), onclick: () => close(false) });
    if (name === 'welcome') {
      card.append(
        el('div', { class: 'tu-logo', text: 'maxora' }),
        el('div', { class: 'tu-sub', text: tr('w1s') }),
        el('ul', { class: 'tu-list' }, [bullet(tr('w1a')), bullet(tr('w1b')), bullet(tr('w1c'))]),
        el('div', { class: 'tu-k', text: tr('langQ') }),
        el('div', { class: 'seg wide tu-lang' }, ['es', 'en', 'it', 'de'].map((l) => el('button', { class: lang() === l ? 'on' : '', text: l.toUpperCase(), onclick: () => { M.setLang(l); draw(); } })))
      );
    } else if (name === 'location') {
      card.append(
        icon('pin', 40, 'tu-big'),
        el('h2', { text: tr('p1t') }),
        el('p', { class: 'tu-p', text: tr('p1s') }),
        el('ul', { class: 'tu-list' }, [bullet(tr('p1a')), bullet(tr('p1b')), bullet(tr('p1c'))]),
        el('button', { class: 'tu-main', text: tr('p1go'), onclick: () => { M.startGps(); go(1); } }),
        el('button', { class: 'tu-link', text: tr('p1later'), onclick: () => go(1) })
      );
    } else if (name === 'mode') {
      const grid = el('div', { class: 'tu-modes' }, ['road', 'surf', 'bike', 'run'].map((k) => {
        const b = el('button', { class: 'tu-mode m-' + k + (st.mode === k ? ' on' : ''), onclick: () => { st.mode = k; draw(); } }, [icon(k, 28), el('b', { text: tr(k) }), el('small', { text: tr('d' + k.charAt(0).toUpperCase() + k.slice(1)) })]);
        return b;
      }));
      card.append(el('h2', { text: tr('m1t') }), el('p', { class: 'tu-p', text: tr('m1s') }), grid);
      if (st.mode === 'surf') card.append(el('div', { class: 'tu-k', text: tr('lvlQ') }), el('div', { class: 'seg wide' }, [1, 2, 3].map((v) => el('button', { class: st.level === v ? 'on' : '', text: tr('lvl' + v), onclick: () => { st.level = v; draw(); } }))));
    } else if (name === 'rules') {
      card.append(
        el('h2', { text: tr('r1t') }),
        el('div', { class: 'tu-rule' }, [el('b', { text: '1' }), el('span', { text: tr('r1a') })]),
        el('div', { class: 'tu-rule' }, [el('b', { text: '2' }), el('span', { text: tr('r1b') })]),
        el('div', { class: 'tu-votes' }, [el('span', { class: 'vote yes', text: '✓' }), el('span', { class: 'vote no', text: '✕' })])
      );
    }
    const nav = el('div', { class: 'tu-nav' }, [
      st.step > 0 ? el('button', { class: 'tu-back', text: tr('back'), onclick: () => go(-1) }) : el('span'),
      name === 'location' ? el('span') : el('button', { class: 'tu-next', text: st.step === STEPS.length - 1 ? tr('start') : tr('next'), onclick: () => (st.step === STEPS.length - 1 ? close(true) : go(1)) })
    ]);
    root.append(el('div', { class: 'tu-top' }, [dots, skip]), card, nav);
  }
  function go(d) { st.step = Math.max(0, Math.min(STEPS.length - 1, st.step + d)); draw(); }

  // ------------------------------------------------------------------
  // Spiegazioni sui pulsanti veri (lo schermo si scurisce, resta acceso solo il pulsante)
  // ------------------------------------------------------------------
  const ROAD = [['searchOpen', 'c_search'], ['sheetToggle', 'c_sheet'], ['reportBtn', 'c_report'], ['surfBtn', 'c_modes'], ['layersBtn', 'c_layers'], ['centerBtn', 'c_locate'], ['discoverBtn', 'c_discover']];
  const MODE_TIPS = {
    surf: [['.sf-pin', 's_pin'], ['sfList', 's_list'], ['sfTimes', 's_times'], ['sfLevel', 's_level']],
    bike: [['spNow', 'b_now'], ['spTimes', 'b_times'], ['spList', 'b_list'], ['.sp-report', 'b_report']],
    run: [['spNow', 'b_now'], ['spTimes', 'b_times'], ['spList', 'b_list']]
  };
  let cm = null;
  function target(sel) { return sel.charAt(0) === '.' ? document.querySelector(sel) : $(sel); }
  function visible(n) { if (!n) return false; const r = n.getBoundingClientRect(); return r.width > 4 && r.height > 4 && r.bottom > 0 && r.top < window.innerHeight; }
  function coach(list) {
    const items = list.filter(([sel]) => visible(target(sel)));
    if (!items.length) return;
    let i = 0;
    if (!cm) {
      cm = el('div', { class: 'cm-root' }, [el('div', { class: 'cm-hole' }), el('div', { class: 'cm-tip' })]);
      document.body.appendChild(cm);
    }
    cm.classList.remove('hidden');
    const hole = cm.querySelector('.cm-hole'), tip = cm.querySelector('.cm-tip');
    function show() {
      const [sel, key] = items[i];
      const n = target(sel);
      const r = n.getBoundingClientRect();
      const padd = 6;
      const h = Math.min(r.height, window.innerHeight * 0.45);
      Object.assign(hole.style, { left: (r.left - padd) + 'px', top: (r.top - padd) + 'px', width: (r.width + padd * 2) + 'px', height: (h + padd * 2) + 'px' });
      tip.innerHTML = '';
      tip.append(
        el('p', { text: tr(key) }),
        el('div', { class: 'cm-nav' }, [
          el('span', { class: 'cm-n', text: (i + 1) + ' / ' + items.length }),
          el('button', { class: 'cm-skip', text: tr('skip'), onclick: end }),
          el('button', { class: 'cm-next', text: i === items.length - 1 ? tr('done') : tr('next'), onclick: () => { if (i === items.length - 1) end(); else { i++; show(); } } })
        ])
      );
      // il fumetto va sopra o sotto il pulsante, dove c'è più spazio
      const below = r.top + h / 2 < window.innerHeight / 2;
      tip.style.top = below ? Math.min(window.innerHeight - 170, r.top + h + 18) + 'px' : '';
      tip.style.bottom = below ? '' : Math.max(16, window.innerHeight - r.top + 18) + 'px';
    }
    function end() { cm.classList.add('hidden'); }
    show();
  }
  function modeTips(k) {
    if (!MODE_TIPS[k] || store.get('tips_' + k, false)) return;
    store.set('tips_' + k, true);
    setTimeout(() => coach(MODE_TIPS[k]), 1900);
  }

  // ------------------------------------------------------------------
  // Avvio
  // ------------------------------------------------------------------
  const again = $('tourAgain');
  if (again) {
    again.textContent = tr('again');
    again.addEventListener('click', () => { M.closeOverlays(); ['road', 'surf', 'bike', 'run'].forEach((k) => store.set('tips_' + k, false)); open(); });
  }
  M.onTexts(() => { if (again) again.textContent = tr('again'); if (root && !root.classList.contains('hidden')) draw(); });
  window.MAXORA_TOUR = { open, coach, modeTips };
  if (!store.get('tourDone', false)) setTimeout(open, 400);
})();
