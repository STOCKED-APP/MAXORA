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
      } else setTimeout(roadTips, 500);
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

  // Guida degli indicatori: [titolo, righe "simbolo — significato"]
  const G = {
    it: {
      r_search: ['Ricerca', 'Vie, luoghi, spiagge\nCategoria (es. "ristoranti") — tutti i risultati sulla mappa'],
      r_road: ['Strada davanti', '○ — la tua posizione\n■ — avvisi, in ordine di distanza\nkm — distanza dall\'avviso\nLinea verde — strada libera'],
      r_hero: ['Avviso più vicino', 'Tipo · distanza · età della segnalazione\n✓ — ancora presente\n✕ — non più presente'],
      r_marker: ['Avvisi sulla mappa', 'Arancione — traffico\nGiallo — lavori\nRosso — incidente / pericolo\nCerchio blu tratteggiato — zona controlli polizia'],
      r_report: ['Segnala', 'Nuovo avviso nella tua posizione\nSolo da fermo o passeggero'],
      r_modes: ['Modalità', 'Strada · Surf · Bici · Corsa\nEtichetta in alto — modalità attiva\n✕ — torna a Strada'],
      r_layers: ['Livelli', 'Mappa / satellite'],
      r_locate: ['Posizione', 'Centra e segui la tua posizione\n● verde — GPS attivo'],
      r_discover: ['Scopri', 'Luoghi e attività locali'],
      s_pin: ['Spot', 'Numero — voto 0–5 per il tuo livello\nColore — grigio (piatto) → azzurro (ottimo)\nFreccia — direzione dell\'onda\nSbiadito — non adatto al tuo livello'],
      s_level: ['Livello', 'Principiante · Intermedio · Esperto\nIl voto si adatta al livello'],
      s_times: ['Fasce orarie', 'Colonna — 3 ore\nAltezza / colore — miglior voto disponibile\nTocca — previsione per quell\'ora'],
      s_tide: ['Marea', '↗ / ↘ — crescente / calante\nOrario — prossima alta o bassa\nReale ora — mareografo vs previsione (cm)\nVento misurato — aeroporto, in tempo reale'],
      s_adv: ['💡 Consiglio', 'Colore — verde vai · arancione attenzione · rosso meglio di no\nRiga in grassetto — giudizio per il tuo livello\n📍 🌊 💨 🌗 — spot migliore, mare, vento, marea\n★ — apre lo spot · ⏱ — orario migliore'],
      c_rules: ['🚐 Regole di sosta', 'Verde — puoi dormire nel veicolo\nRosso — sei in un\'area protetta: niente pernottamento\nTocca per leggere le regole'],
      c_chips: ['Cosa ti serve', '🛏 Dormire — dove passare la notte\n🚰 Acqua e scarico — carico e scarico\n⛽ Benzina — prezzi ufficiali\n🚿 Docce e bagni — docce, bagni, palestre, lavanderie'],
      c_row: ['Riga luogo', '✅ — si può dormire nel veicolo\n⚠️ — possibili divieti, guarda i cartelli\n⛔ — area protetta, niente pernottamento\n⛺ — campeggio con permesso\n★ — punto controllato da Maxora'],
      c_map: ['Mappa camper', 'Zone verdi tratteggiate — aree protette\nPallini — servizi; i grandi con alone sono controllati da Maxora'],
      s_row: ['Riga spot', '★ — voto 0–5\nm — altezza onda allo spot\ns — periodo (più alto = più potente)\nNO, N… — direzione onda\nkJ — energia dell\'onda\nkm/h — vento\n👁 — segnalazioni dalla spiaggia'],
      s_wind: ['Stato del vento', 'glassy — assente\noffshore — da terra (ideale)\ncross-off — laterale da terra\ncross-shore — laterale\ncross-on — laterale dal mare\nonshore — dal mare (sfavorevole)'],
      sc_score: ['Voto', 'Voto 0–5 per ora e livello scelti\n👁 Corretto dai surfisti — include segnalazioni recenti'],
      sc_stats: ['Dati', 'Onde — altezza allo spot · largo = mare aperto\nPeriodo — secondi tra le onde\nEnergia — kJ\nVento — km/h e direzione\nStato vento — glassy → onshore\nMarea — andamento e prossimo estremo'],
      sc_chart: ['48 ore', 'Numero — altezza onda (m)\nBarra — voto\nChiaro — ore notturne'],
      sc_days: ['Giorni', 'Voto migliore · altezza min–max · ora migliore'],
      sc_tides: ['Maree', 'Alta / bassa — orari del giorno'],
      sc_rep: ['Segnalazione dalla spiaggia', 'Grandezza · qualità · affollamento\nVisibile 3 ore · corregge il voto'],
      b_big: ['Voto condizioni', '0–5 ★\nVerde / azzurro — buono\nArancione — discreto\nRosso — sconsigliato\nFattori: temperatura, vento, raffiche, pioggia, luce'],
      b_temp: ['Temperatura', 'Prevista, entroterra (°C)'],
      b_wind: ['Vento', 'Freccia — verso dove soffia\nNumero — velocità (km/h)\nSotto — provenienza · raffiche'],
      b_light: ['Luce', 'Alba · tramonto'],
      b_times: ['Fasce orarie', 'Colonna — 3 ore\nAltezza / colore — voto\nSbiadito — buio\nTocca — seleziona l\'ora'],
      b_adv: ['💡 Consiglio', 'Colore — verde vai · arancione attenzione · rosso meglio di no\nRiga in grassetto — giudizio del momento\nRighe — motivi: vento, caldo, pioggia, buio\n⏱ — finestra migliore (tocca per vederla)\n🧭 — percorso più adatto ora'],
      b_row: ['Riga percorso', '★ — voto all\'ora scelta\nkm — distanza totale\n+m — dislivello in salita\nFondo — asfalto · sterrato · lungomare · sentiero\nDifficoltà · sigla sentiero ufficiale\n⚠ — avvisi stradali sul percorso'],
      b_map: ['Mappa', 'Icona — partenza\nColore linea — voto\n💧 — fontanella\n🔧 — officina / noleggio bici'],
      b_report: ['Ciclisti in strada', 'Avviso per gli automobilisti · 30 min'],
      bc_stats: ['Dati percorso', 'km · dislivello · voto all\'ora scelta'],
      bc_prof: ['Altimetria', 'Quota max · lunghezza\nSalita principale — km, pendenza media, dislivello'],
      bc_wind: ['Vento sul percorso', 'Verso consigliato in base al vento'],
      bc_best: ['Ore migliori', 'Fasce con voto più alto nelle prossime 48 ore'],
      bc_gpx: ['GPX', 'Esporta per Garmin, Strava, Komoot'],
      legend: 'Legenda', legendSub: 'Significato degli indicatori'
    },
    es: {
      r_search: ['Búsqueda', 'Calles, lugares, playas\nCategoría (p. ej. "restaurantes") — todos los resultados en el mapa'],
      r_road: ['Carretera delante', '○ — tu posición\n■ — avisos, por distancia\nkm — distancia al aviso\nLínea verde — vía despejada'],
      r_hero: ['Aviso más cercano', 'Tipo · distancia · antigüedad\n✓ — sigue\n✕ — ya no está'],
      r_marker: ['Avisos en el mapa', 'Naranja — tráfico\nAmarillo — obras\nRojo — accidente / peligro\nCírculo azul discontinuo — zona de control policial'],
      r_report: ['Avisar', 'Nuevo aviso en tu posición\nSolo parado o de pasajero'],
      r_modes: ['Modos', 'Carretera · Surf · Bici · Correr\nEtiqueta superior — modo activo\n✕ — volver a Carretera'],
      r_layers: ['Capas', 'Mapa / satélite'],
      r_locate: ['Posición', 'Centrar y seguir tu posición\n● verde — GPS activo'],
      r_discover: ['Descubre', 'Lugares y negocios locales'],
      s_pin: ['Spots', 'Número — nota 0–5 para tu nivel\nColor — gris (plano) → azul (excelente)\nFlecha — dirección de la ola\nApagado — no apto para tu nivel'],
      s_level: ['Nivel', 'Principiante · Intermedio · Experto\nLa nota se adapta al nivel'],
      s_times: ['Franjas horarias', 'Columna — 3 horas\nAltura / color — mejor nota disponible\nToca — previsión para esa hora'],
      s_tide: ['Marea', '↗ / ↘ — subiendo / bajando\nHora — próxima alta o baja\nReal ahora — mareógrafo vs previsión (cm)\nViento medido — aeropuerto, en tiempo real'],
      s_adv: ['💡 Consejo', 'Color — verde adelante · naranja precaución · rojo mejor no\nLínea en negrita — valoración para tu nivel\n📍 🌊 💨 🌗 — mejor spot, mar, viento, marea\n★ — abre el spot · ⏱ — mejor hora'],
      c_rules: ['🚐 Normas de pernocta', 'Verde — puedes dormir en el vehículo\nRojo — estás en un espacio protegido: no se pernocta\nToca para leer las normas'],
      c_chips: ['Qué necesitas', '🛏 Dormir — dónde pasar la noche\n🚰 Agua y vaciado — llenado y vaciado\n⛽ Gasolina — precios oficiales\n🚿 Duchas y baños — duchas, baños, gimnasios, lavanderías'],
      c_row: ['Fila de lugar', '✅ — se puede dormir en el vehículo\n⚠️ — posibles prohibiciones, mira las señales\n⛔ — espacio protegido, no se pernocta\n⛺ — acampada con permiso\n★ — revisado por Maxora'],
      c_map: ['Mapa camper', 'Zonas verdes discontinuas — espacios protegidos\nPuntos — servicios; los grandes con halo están revisados por Maxora'],
      s_row: ['Fila de spot', '★ — nota 0–5\nm — altura de ola en el spot\ns — periodo (más alto = más potente)\nNO, N… — dirección de la ola\nkJ — energía de la ola\nkm/h — viento\n👁 — avisos desde la playa'],
      s_wind: ['Estado del viento', 'glassy — sin viento\noffshore — de tierra (ideal)\ncross-off — lateral de tierra\ncross-shore — lateral\ncross-on — lateral de mar\nonshore — de mar (desfavorable)'],
      sc_score: ['Nota', 'Nota 0–5 para la hora y nivel elegidos\n👁 Corregido por surfistas — incluye avisos recientes'],
      sc_stats: ['Datos', 'Olas — altura en el spot · fuera = mar abierto\nPeriodo — segundos entre olas\nEnergía — kJ\nViento — km/h y dirección\nEstado viento — glassy → onshore\nMarea — tendencia y próximo extremo'],
      sc_chart: ['48 horas', 'Número — altura de ola (m)\nBarra — nota\nClaro — horas nocturnas'],
      sc_days: ['Días', 'Mejor nota · altura mín–máx · mejor hora'],
      sc_tides: ['Mareas', 'Alta / baja — horas del día'],
      sc_rep: ['Aviso desde la playa', 'Tamaño · calidad · gente\nVisible 3 horas · corrige la nota'],
      b_big: ['Nota de condiciones', '0–5 ★\nVerde / azul — bueno\nNaranja — regular\nRojo — desaconsejado\nFactores: temperatura, viento, rachas, lluvia, luz'],
      b_temp: ['Temperatura', 'Prevista, interior (°C)'],
      b_wind: ['Viento', 'Flecha — hacia dónde sopla\nNúmero — velocidad (km/h)\nDebajo — procedencia · rachas'],
      b_light: ['Luz', 'Amanecer · atardecer'],
      b_times: ['Franjas horarias', 'Columna — 3 horas\nAltura / color — nota\nApagado — noche\nToca — elegir hora'],
      b_adv: ['💡 Consejo', 'Color — verde adelante · naranja precaución · rojo mejor no\nLínea en negrita — valoración del momento\nLíneas — motivos: viento, calor, lluvia, oscuridad\n⏱ — mejor franja (toca para verla)\n🧭 — ruta más adecuada ahora'],
      b_row: ['Fila de ruta', '★ — nota a la hora elegida\nkm — distancia total\n+m — desnivel positivo\nFirme — asfalto · pista · paseo · sendero\nDificultad · código de sendero oficial\n⚠ — avisos en la ruta'],
      b_map: ['Mapa', 'Icono — salida\nColor de línea — nota\n💧 — fuente\n🔧 — taller / alquiler de bicis'],
      b_report: ['Ciclistas en la vía', 'Aviso para conductores · 30 min'],
      bc_stats: ['Datos de la ruta', 'km · desnivel · nota a la hora elegida'],
      bc_prof: ['Perfil', 'Altitud máx · longitud\nSubida principal — km, pendiente media, desnivel'],
      bc_wind: ['Viento en la ruta', 'Sentido recomendado según el viento'],
      bc_best: ['Mejores horas', 'Franjas con mejor nota en las próximas 48 horas'],
      bc_gpx: ['GPX', 'Exportar para Garmin, Strava, Komoot'],
      legend: 'Leyenda', legendSub: 'Significado de los indicadores'
    },
    en: {
      r_search: ['Search', 'Streets, places, beaches\nCategory (e.g. "restaurants") — all results on the map'],
      r_road: ['Road ahead', '○ — your position\n■ — alerts, by distance\nkm — distance to alert\nGreen line — road clear'],
      r_hero: ['Nearest alert', 'Type · distance · age\n✓ — still there\n✕ — gone'],
      r_marker: ['Alerts on the map', 'Orange — traffic\nYellow — roadworks\nRed — accident / hazard\nDashed blue circle — police check area'],
      r_report: ['Report', 'New alert at your position\nOnly when stopped or as a passenger'],
      r_modes: ['Modes', 'Road · Surf · Bike · Run\nTop label — active mode\n✕ — back to Road'],
      r_layers: ['Layers', 'Map / satellite'],
      r_locate: ['Position', 'Centre and follow your position\nGreen ● — GPS on'],
      r_discover: ['Discover', 'Places and local businesses'],
      s_pin: ['Spots', 'Number — 0–5 rating for your level\nColour — grey (flat) → blue (great)\nArrow — swell direction\nFaded — not for your level'],
      s_level: ['Level', 'Beginner · Intermediate · Expert\nRating adapts to level'],
      s_times: ['Time slots', 'Column — 3 hours\nHeight / colour — best available rating\nTap — forecast for that time'],
      s_tide: ['Tide', '↗ / ↘ — rising / falling\nTime — next high or low\nLive now — tide gauge vs forecast (cm)\nMeasured wind — airport, live'],
      s_adv: ['💡 Advice', 'Colour — green go · orange caution · red better not\nBold line — verdict for your level\n📍 🌊 💨 🌗 — best spot, sea, wind, tide\n★ — opens the spot · ⏱ — best time'],
      c_rules: ['🚐 Overnight rules', 'Green — you can sleep in the vehicle\nRed — you are in a protected area: no overnight stay\nTap to read the rules'],
      c_chips: ['What you need', '🛏 Sleep — where to spend the night\n🚰 Water & dump — fill and empty\n⛽ Fuel — official prices\n🚿 Showers & WC — showers, toilets, gyms, laundries'],
      c_row: ['Place row', '✅ — you can sleep in the vehicle\n⚠️ — possible bans, check the signs\n⛔ — protected area, no overnight stay\n⛺ — camping with permit\n★ — checked by Maxora'],
      c_map: ['Camper map', 'Dashed green areas — protected areas\nDots — services; large ones with a halo are checked by Maxora'],
      s_row: ['Spot row', '★ — 0–5 rating\nm — wave height at the spot\ns — period (higher = more powerful)\nNW, N… — swell direction\nkJ — wave energy\nkm/h — wind\n👁 — reports from the beach'],
      s_wind: ['Wind state', 'glassy — no wind\noffshore — from land (ideal)\ncross-off — side wind from land\ncross-shore — side wind\ncross-on — side wind from sea\nonshore — from sea (unfavourable)'],
      sc_score: ['Rating', '0–5 rating for chosen time and level\n👁 Corrected by surfers — includes recent reports'],
      sc_stats: ['Data', 'Waves — height at spot · out = open sea\nPeriod — seconds between waves\nEnergy — kJ\nWind — km/h and direction\nWind state — glassy → onshore\nTide — trend and next extreme'],
      sc_chart: ['48 hours', 'Number — wave height (m)\nBar — rating\nLighter — night hours'],
      sc_days: ['Days', 'Best rating · min–max height · best time'],
      sc_tides: ['Tides', 'High / low — times of the day'],
      sc_rep: ['Beach report', 'Size · quality · crowd\nVisible 3 hours · adjusts the rating'],
      b_big: ['Conditions rating', '0–5 ★\nGreen / blue — good\nOrange — fair\nRed — not advised\nFactors: temperature, wind, gusts, rain, daylight'],
      b_temp: ['Temperature', 'Forecast, inland (°C)'],
      b_wind: ['Wind', 'Arrow — where it blows to\nNumber — speed (km/h)\nBelow — origin · gusts'],
      b_light: ['Light', 'Sunrise · sunset'],
      b_times: ['Time slots', 'Column — 3 hours\nHeight / colour — rating\nFaded — dark\nTap — select time'],
      b_adv: ['💡 Advice', 'Colour — green go · orange caution · red better not\nBold line — verdict for that time\nLines — reasons: wind, heat, rain, darkness\n⏱ — best window (tap to view)\n🧭 — best route now'],
      b_row: ['Route row', '★ — rating at chosen time\nkm — total distance\n+m — climbing\nSurface — road · gravel · promenade · trail\nDifficulty · official trail code\n⚠ — road alerts on route'],
      b_map: ['Map', 'Icon — start\nLine colour — rating\n💧 — fountain\n🔧 — bike shop / rental'],
      b_report: ['Cyclists on the road', 'Alert for drivers · 30 min'],
      bc_stats: ['Route data', 'km · climbing · rating at chosen time'],
      bc_prof: ['Elevation', 'Max altitude · length\nMain climb — km, average gradient, gain'],
      bc_wind: ['Wind on route', 'Recommended direction based on wind'],
      bc_best: ['Best times', 'Highest-rated slots in the next 48 hours'],
      bc_gpx: ['GPX', 'Export for Garmin, Strava, Komoot'],
      legend: 'Legend', legendSub: 'What the indicators mean'
    },
    de: {
      r_search: ['Suche', 'Straßen, Orte, Strände\nKategorie (z. B. "Restaurants") — alle Treffer auf der Karte'],
      r_road: ['Straße voraus', '○ — deine Position\n■ — Meldungen, nach Entfernung\nkm — Entfernung zur Meldung\nGrüne Linie — freie Fahrt'],
      r_hero: ['Nächste Meldung', 'Art · Entfernung · Alter\n✓ — noch da\n✕ — weg'],
      r_marker: ['Meldungen auf der Karte', 'Orange — Stau\nGelb — Baustelle\nRot — Unfall / Gefahr\nGestrichelter blauer Kreis — Polizeikontrollbereich'],
      r_report: ['Melden', 'Neue Meldung an deiner Position\nNur im Stand oder als Beifahrer'],
      r_modes: ['Modi', 'Straße · Surf · Rad · Laufen\nEtikett oben — aktiver Modus\n✕ — zurück zur Straße'],
      r_layers: ['Ebenen', 'Karte / Satellit'],
      r_locate: ['Position', 'Zentrieren und folgen\n● grün — GPS an'],
      r_discover: ['Entdecken', 'Orte und lokale Betriebe'],
      s_pin: ['Spots', 'Zahl — Bewertung 0–5 für dein Level\nFarbe — grau (flach) → blau (super)\nPfeil — Swellrichtung\nBlass — nicht für dein Level'],
      s_level: ['Level', 'Anfänger · Fortgeschritten · Experte\nBewertung passt sich an'],
      s_times: ['Zeitfenster', 'Spalte — 3 Stunden\nHöhe / Farbe — beste Bewertung\nTippen — Vorhersage für diese Zeit'],
      s_tide: ['Gezeiten', '↗ / ↘ — steigend / fallend\nZeit — nächstes Hoch oder Niedrig\nLive jetzt — Pegel vs Prognose (cm)\nGemessener Wind — Flughafen, live'],
      s_adv: ['💡 Empfehlung', 'Farbe — grün los · orange Vorsicht · rot lieber nicht\nFette Zeile — Urteil für dein Level\n📍 🌊 💨 🌗 — bester Spot, Meer, Wind, Tide\n★ — öffnet den Spot · ⏱ — beste Zeit'],
      c_rules: ['🚐 Übernachtungsregeln', 'Grün — Schlafen im Fahrzeug erlaubt\nRot — du bist im Schutzgebiet: keine Übernachtung\nAntippen für die Regeln'],
      c_chips: ['Was du brauchst', '🛏 Schlafen — wo übernachten\n🚰 Wasser & Entsorgung\n⛽ Tanken — offizielle Preise\n🚿 Duschen & WC — Duschen, Toiletten, Fitness, Waschsalons'],
      c_row: ['Ortszeile', '✅ — Schlafen im Fahrzeug erlaubt\n⚠️ — mögliche Verbote, Schilder beachten\n⛔ — Schutzgebiet, keine Übernachtung\n⛺ — Camping mit Genehmigung\n★ — von Maxora geprüft'],
      c_map: ['Camper-Karte', 'Grün gestrichelt — Schutzgebiete\nPunkte — Service; große mit Ring sind von Maxora geprüft'],
      s_row: ['Spot-Zeile', '★ — Bewertung 0–5\nm — Wellenhöhe am Spot\ns — Periode (höher = kräftiger)\nNW, N… — Swellrichtung\nkJ — Wellenenergie\nkm/h — Wind\n👁 — Meldungen vom Strand'],
      s_wind: ['Windlage', 'glassy — windstill\noffshore — vom Land (ideal)\ncross-off — seitlich vom Land\ncross-shore — seitlich\ncross-on — seitlich vom Meer\nonshore — vom Meer (ungünstig)'],
      sc_score: ['Bewertung', '0–5 für gewählte Zeit und Level\n👁 Von Surfern korrigiert — inkl. aktueller Meldungen'],
      sc_stats: ['Daten', 'Wellen — Höhe am Spot · draußen = offenes Meer\nPeriode — Sekunden zwischen Wellen\nEnergie — kJ\nWind — km/h und Richtung\nWindlage — glassy → onshore\nTide — Trend und nächstes Extrem'],
      sc_chart: ['48 Stunden', 'Zahl — Wellenhöhe (m)\nBalken — Bewertung\nHeller — Nachtstunden'],
      sc_days: ['Tage', 'Beste Bewertung · Höhe min–max · beste Zeit'],
      sc_tides: ['Gezeiten', 'Hoch / Niedrig — Zeiten des Tages'],
      sc_rep: ['Strandmeldung', 'Größe · Qualität · Andrang\n3 Stunden sichtbar · korrigiert die Bewertung'],
      b_big: ['Bewertung', '0–5 ★\nGrün / blau — gut\nOrange — mäßig\nRot — nicht empfohlen\nFaktoren: Temperatur, Wind, Böen, Regen, Licht'],
      b_temp: ['Temperatur', 'Vorhersage, Inland (°C)'],
      b_wind: ['Wind', 'Pfeil — wohin er weht\nZahl — Geschwindigkeit (km/h)\nDarunter — Herkunft · Böen'],
      b_light: ['Licht', 'Sonnenaufgang · Sonnenuntergang'],
      b_times: ['Zeitfenster', 'Spalte — 3 Stunden\nHöhe / Farbe — Bewertung\nBlass — dunkel\nTippen — Zeit wählen'],
      b_adv: ['💡 Empfehlung', 'Farbe — grün los · orange Vorsicht · rot lieber nicht\nFette Zeile — Urteil für diese Zeit\nZeilen — Gründe: Wind, Hitze, Regen, Dunkelheit\n⏱ — bestes Zeitfenster (antippen)\n🧭 — passendste Strecke jetzt'],
      b_row: ['Strecken-Zeile', '★ — Bewertung zur gewählten Zeit\nkm — Gesamtdistanz\n+m — Höhenmeter\nUntergrund — Asphalt · Schotter · Promenade · Pfad\nSchwierigkeit · offizieller Wegcode\n⚠ — Meldungen auf der Strecke'],
      b_map: ['Karte', 'Symbol — Start\nLinienfarbe — Bewertung\n💧 — Brunnen\n🔧 — Radladen / Verleih'],
      b_report: ['Radfahrer auf der Straße', 'Meldung für Autofahrer · 30 Min.'],
      bc_stats: ['Streckendaten', 'km · Höhenmeter · Bewertung zur gewählten Zeit'],
      bc_prof: ['Höhenprofil', 'Max. Höhe · Länge\nHauptanstieg — km, mittlere Steigung, Höhenmeter'],
      bc_wind: ['Wind auf der Strecke', 'Empfohlene Richtung je nach Wind'],
      bc_best: ['Beste Zeiten', 'Fenster mit bester Bewertung in 48 Stunden'],
      bc_gpx: ['GPX', 'Export für Garmin, Strava, Komoot'],
      legend: 'Legende', legendSub: 'Bedeutung der Anzeigen'
    }
  };
  const g = (k) => (G[lang()] && G[lang()][k]) || G.es[k];

  // [elemento, voce della guida]
  const ROAD = [['#searchOpen', 'r_search'], ['#road', 'r_road'], ['#hero', 'r_hero'], ['.mk', 'r_marker'], ['#reportBtn', 'r_report'], ['#surfBtn', 'r_modes'], ['#layersBtn', 'r_layers'], ['#centerBtn', 'r_locate'], ['#discoverBtn', 'r_discover']];
  const MODE_TIPS = {
    surf: [['.sf-pin', 's_pin'], ['#sfLevel', 's_level'], ['#sfTimes', 's_times'], ['#sfTide', 's_tide'], ['#sfAdvice', 's_adv'], ['#sfList .sf-row', 's_row'], ['#sfList .sf-row', 's_wind']],
    bike: [['#spNow .sp-big', 'b_big'], ['#spNow .sp-cell:nth-child(2)', 'b_temp'], ['#spNow .sp-cell:nth-child(3)', 'b_wind'], ['#spNow .sp-cell:nth-child(4)', 'b_light'], ['#spTimes', 'b_times'], ['#spAdvice', 'b_adv'], ['#spList .sf-row', 'b_row'], ['.sp-start', 'b_map'], ['.sp-report', 'b_report']],
    camper: [['#cpTabs', 'c_chips'], ['#cpRules', 'c_rules'], ['#cpList .cp-row', 'c_row'], ['.cp-pin', 'c_map']],
    run: [['#spNow .sp-big', 'b_big'], ['#spNow .sp-cell:nth-child(2)', 'b_temp'], ['#spNow .sp-cell:nth-child(3)', 'b_wind'], ['#spNow .sp-cell:nth-child(4)', 'b_light'], ['#spTimes', 'b_times'], ['#spAdvice', 'b_adv'], ['#spList .sf-row', 'b_row'], ['.sp-start', 'b_map']]
  };
  const CARD_TIPS = {
    surf: [['#sfCardBody .sf-score', 'sc_score'], ['#sfCardBody .sf-stats', 'sc_stats'], ['#sfCardBody .sf-repbtn', 'sc_rep'], ['#sfCardBody .sf-chart', 'sc_chart'], ['#sfCardBody .sf-days', 'sc_days'], ['#sfCardBody .sf-tides', 'sc_tides']],
    sport: [['#spCardBody .sf-stats', 'bc_stats'], ['#spCardBody .sp-prof', 'bc_prof'], ['#spCardBody .sp-wind', 'bc_wind'], ['#spCardBody .sf-tides', 'bc_best'], ['#spCardBody .p-sec', 'bc_gpx']]
  };
  const SHEETS = { camper: ['cpSheet', 'cpToggle'], road: ['sheet', 'sheetToggle'], surf: ['sfSheet', 'sfToggle'], bike: ['spSheet', 'spToggle'], run: ['spSheet', 'spToggle'] };

  // ------------------------------------------------------------------
  // Spiegazioni sui pulsanti veri: lo schermo si scurisce e resta acceso un elemento alla volta
  // ------------------------------------------------------------------
  let cm = null;
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  function openSheet(k) {
    const s = SHEETS[k] && $(SHEETS[k][0]);
    if (s && s.classList.contains('collapsed')) { $(SHEETS[k][1]).click(); return true; }
    return false;
  }
  async function reveal(n) {
    // porta l'elemento in vista dentro il pannello o la scheda che lo contiene
    try { n.scrollIntoView({ block: 'nearest', inline: 'nearest' }); } catch (e) { /* niente */ }
    await wait(250);
    const r = n.getBoundingClientRect();
    if (r.width < 4 || r.height < 4 || r.bottom < 0 || r.top > window.innerHeight) return false;
    const x = Math.min(window.innerWidth - 2, Math.max(1, r.left + r.width / 2)), y = Math.min(window.innerHeight - 2, Math.max(1, r.top + Math.min(r.height, 40) / 2));
    const hit = document.elementFromPoint(x, y);
    return !!hit && (n === hit || n.contains(hit) || hit.closest('.cm-root'));
  }
  async function coach(list) {
    if (!cm) { cm = el('div', { class: 'cm-root hidden' }, [el('div', { class: 'cm-hole' }), el('div', { class: 'cm-tip' })]); document.body.appendChild(cm); }
    const hole = cm.querySelector('.cm-hole'), tip = cm.querySelector('.cm-tip');
    let i = 0, alive = true;
    const end = () => { alive = false; cm.classList.add('hidden'); };
    async function show(dir) {
      while (alive && i >= 0 && i < list.length) {
        const n = document.querySelector(list[i][0]);
        cm.classList.add('hidden');
        if (n && await reveal(n)) break;
        i += dir || 1;
      }
      if (!alive || i < 0 || i >= list.length) return end();
      cm.classList.remove('hidden');
      const n = document.querySelector(list[i][0]);
      const r = n.getBoundingClientRect();
      const pad = 6, h = Math.min(r.height, window.innerHeight * 0.4);
      Object.assign(hole.style, { left: (r.left - pad) + 'px', top: (r.top - pad) + 'px', width: (r.width + pad * 2) + 'px', height: (h + pad * 2) + 'px' });
      const [title, text] = g(list[i][1]);
      tip.innerHTML = '';
      tip.append(
        el('b', { class: 'cm-t', text: title }),
        defs(text),
        el('div', { class: 'cm-nav' }, [
          el('span', { class: 'cm-n', text: (i + 1) + ' / ' + list.length }),
          el('button', { class: 'cm-skip', text: tr('skip'), onclick: end }),
          el('button', { class: 'cm-next', text: i === list.length - 1 ? tr('done') : tr('next'), onclick: () => { i++; show(1); } })
        ])
      );
      const below = r.top + h / 2 < window.innerHeight / 2;
      tip.style.top = below ? Math.min(window.innerHeight - tip.offsetHeight - 12, r.top + h + 18) + 'px' : '';
      tip.style.bottom = below ? '' : Math.max(12, window.innerHeight - r.top + 18) + 'px';
    }
    await show(1);
  }
  // "simbolo — significato" su righe separate → tabella compatta
  function defs(text) {
    return el('div', { class: 'cm-defs' }, text.split('\n').map((ln) => {
      const i = ln.indexOf(' — ');
      return i < 0 ? el('div', { class: 'cm-row one' }, [el('span', { text: ln })]) : el('div', { class: 'cm-row' }, [el('b', { text: ln.slice(0, i) }), el('span', { text: ln.slice(i + 3) })]);
    }));
  }
  async function modeTips(k) {
    if (!MODE_TIPS[k] || store.get('tips2_' + k, false)) return;
    store.set('tips2_' + k, true);
    await wait(1700);
    if (openSheet(k)) await wait(400);
    coach(MODE_TIPS[k]);
  }
  async function cardTips(k) {
    if (!CARD_TIPS[k] || store.get('tips2_card_' + k, false)) return;
    store.set('tips2_card_' + k, true);
    await wait(1200);
    coach(CARD_TIPS[k]);
  }
  async function roadTips() {
    if (openSheet('road')) await wait(400);
    coach(ROAD);
  }

  // ------------------------------------------------------------------
  // Legenda: tutte le spiegazioni della modalità, sempre a portata di mano
  // ------------------------------------------------------------------
  let lg = null;
  function legend(k) {
    const sets = k === 'surf' ? [MODE_TIPS.surf, CARD_TIPS.surf] : k === 'bike' || k === 'run' ? [MODE_TIPS[k], CARD_TIPS.sport] : k === 'camper' ? [MODE_TIPS.camper] : [ROAD];
    const seen = new Set();
    const rows = [];
    sets.flat().forEach(([, key]) => { if (!seen.has(key)) { seen.add(key); const [t, x] = g(key); rows.push(el('div', { class: 'lg-row' }, [el('b', { text: t }), defs(x)])); } });
    if (!lg) { lg = el('div', { class: 'overlay lg-ov' }); document.body.appendChild(lg); lg.addEventListener('click', (e) => { if (e.target === lg) lg.classList.add('hidden'); }); }
    lg.innerHTML = '';
    lg.classList.remove('hidden');
    const close = el('button', { class: 'icon-btn', 'aria-label': 'OK', onclick: () => lg.classList.add('hidden') });
    close.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
    lg.appendChild(el('div', { class: 'panel tall lg-panel', role: 'dialog', 'aria-modal': 'true' }, [
      el('div', { class: 'panel-head' }, [el('h2', { text: g('legend') }), close]),
      el('p', { class: 'panel-sub', text: g('legendSub') }),
      el('div', { class: 'lg-list' }, rows)
    ]));
  }

  // ------------------------------------------------------------------
  // Avvio
  // ------------------------------------------------------------------
  const again = $('tourAgain');
  const leg = el('button', { class: 'tour-again', id: 'legendBtn', onclick: () => { M.closeOverlays(); legend(document.body.dataset.mode || 'road'); } });
  if (again) { again.parentNode.insertBefore(leg, again); leg.textContent = g('legend') + ' · ' + g('legendSub'); }
  if (again) {
    again.textContent = tr('again');
    again.addEventListener('click', () => { M.closeOverlays(); ['road', 'surf', 'bike', 'run', 'card_surf', 'card_sport'].forEach((k) => store.set('tips2_' + k, false)); open(); });
  }
  M.onTexts(() => { if (again) again.textContent = tr('again'); leg.textContent = g('legend') + ' · ' + g('legendSub'); if (root && !root.classList.contains('hidden')) draw(); });
  window.MAXORA_TOUR = { open, coach, modeTips, cardTips, legend };
  if (!store.get('tourDone', false)) setTimeout(open, 400);
})();
