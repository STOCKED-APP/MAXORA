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

  // ------------------------------------------------------------------
  // Guida degli indicatori: [titolo, spiegazione] per ogni elemento
  // ------------------------------------------------------------------
  const G = {
    it: {
      r_search: ['Ricerca', 'Cerca vie, spiagge, ristoranti o benzinai. Scrivi "ristoranti" e li vedi tutti sulla mappa.'],
      r_road: ['La strada davanti a te', 'Il cerchio a sinistra sei tu. I quadratini sono gli avvisi in ordine di distanza, con i km sopra. Linea verde e vuota = strada libera.'],
      r_hero: ['L\'avviso più vicino', 'Tipo, distanza e da quanto tempo è stato segnalato. Tocca ✓ se c\'è ancora o ✕ se non c\'è più.'],
      r_marker: ['Avvisi sulla mappa', 'Ogni colore è un tipo: arancione traffico, giallo lavori, rosso incidente o pericolo. Il cerchio blu tratteggiato è una zona con controlli di polizia (mai il punto esatto).'],
      r_report: ['Segnala', 'Vedi un incidente, lavori, sabbia o traffico? Toccalo e scegli cosa succede. Solo da fermo o da passeggero.'],
      r_modes: ['Modalità', 'Passa da Strada a Surf, Bici o Corsa. L\'etichetta colorata in alto ti dice sempre dove sei; la ✕ ti riporta alla strada.'],
      r_layers: ['Mappa o satellite', 'Cambia tra mappa normale e foto satellitare.'],
      r_locate: ['La tua posizione', 'Torna su di te e la mappa ti segue. Il pallino verde vuol dire che il GPS è acceso.'],
      r_discover: ['Scopri l\'isola', 'Posti da vedere e attività locali, con foto e indicazioni.'],
      s_pin: ['Gli spot', 'Ogni stella è uno spot e il numero è il voto da 0 a 5 per il tuo livello. Colori: grigio piatto, rosso scarso, arancione discreto, verde buono, azzurro ottimo. La freccetta indica da dove arriva l\'onda. Stelle grigie e sbiadite = non adatte al tuo livello.'],
      s_level: ['Il tuo livello', 'Principiante, intermedio o esperto: lo stesso mare ha un voto diverso per ognuno.'],
      s_times: ['Le ore', 'Ogni colonna è una fascia di 3 ore: altezza e colore mostrano lo spot migliore in quel momento. Tocca un\'ora e tutta la mappa si aggiorna.'],
      s_tide: ['Marea e dati reali', 'Se la marea sale o scende e l\'ora della prossima alta o bassa. "Reale ora" è la misura del mareografo del porto confrontata con la previsione. "Vento misurato" arriva dall\'aeroporto.'],
      s_row: ['Uno spot nella lista', 'Stelle = voto. Poi: altezza dell\'onda allo spot (m), periodo in secondi (più alto = onda più potente), direzione da cui arriva, energia in kJ (la forza dell\'onda), vento in km/h. 👁 = segnalazioni dei surfisti in spiaggia.'],
      s_wind: ['Stato del vento', 'glassy = mare liscio, senza vento · offshore = da terra, il migliore · cross-off = laterale da terra · cross-shore = laterale · cross-on = laterale dal mare · onshore = dal mare, rovina le onde.'],
      sc_score: ['Voto dello spot', 'Voto per l\'ora scelta e il tuo livello. "Corretto dai surfisti" vuol dire che tiene conto di chi è in spiaggia adesso.'],
      sc_stats: ['I numeri', 'Onde: altezza allo spot ("largo" = in mare aperto). Periodo: secondi tra un\'onda e l\'altra. Energia: forza dell\'onda. Vento e stato del vento. Marea: sale o scende e la prossima alta o bassa.'],
      sc_chart: ['Prossime 48 ore', 'Il numero è l\'altezza dell\'onda, la barra è il voto. Le ore di notte sono più chiare. Tocca una colonna per sceglierla.'],
      sc_days: ['Prossimi giorni', 'Per ogni giorno: voto migliore, altezza minima–massima e l\'ora migliore.'],
      sc_tides: ['Maree del giorno', 'Orari di alta (blu) e bassa (arancione) marea.'],
      sc_rep: ['Com\'è adesso', 'Sei in spiaggia? Dì grandezza, qualità e folla: lo vedono tutti per 3 ore e il voto si corregge.'],
      b_big: ['Voto delle condizioni', 'Da 0 a 5 stelle per uscire adesso: verde o azzurro buono, arancione così così, rosso sconsigliato. Conta caldo, vento, raffiche, pioggia e luce.'],
      b_temp: ['Temperatura', 'Temperatura prevista nell\'interno dell\'isola.'],
      b_wind: ['Vento', 'La freccia indica verso dove soffia, il numero è la velocità in km/h. Sotto: da dove arriva e le raffiche massime.'],
      b_light: ['Luce', 'Alba e tramonto di oggi.'],
      b_times: ['L\'ora migliore', 'Ogni colonna è una fascia di 3 ore: più alta e più verde, meglio è. Le ore di buio sono sbiadite. Tocca per scegliere un\'ora.'],
      b_adv: ['Consiglio', 'Il suggerimento del momento: caldo, vento forte, buio o pioggia.'],
      b_row: ['Un percorso', 'Stelle = condizioni all\'ora scelta. Poi: km totali, +m di salita, fondo (asfalto, sterrato, lungomare, sentiero), difficoltà, sigla del sentiero ufficiale e ⚠ avvisi stradali sul percorso.'],
      b_map: ['Sulla mappa', 'L\'icona segna la partenza, la linea ha il colore delle condizioni. 💧 fontanelle · 🔧 officine e noleggi bici.'],
      b_report: ['Ciclisti in strada', 'In bici su strada? Avvisa gli automobilisti: vedono l\'avviso per 30 minuti.'],
      bc_stats: ['I numeri del percorso', 'Chilometri totali, metri di salita e voto delle condizioni per l\'ora scelta.'],
      bc_prof: ['Altimetria', 'Quanto sali e scendi lungo il percorso: quota massima in alto a sinistra, lunghezza a destra. Sotto, la salita principale con la pendenza media.'],
      bc_wind: ['Vento sul percorso', 'Ti dice se partire controvento e tornare col vento a favore, o se conviene fare il giro al contrario.'],
      bc_best: ['Ore migliori', 'Le fasce orarie migliori per questo percorso nelle prossime 48 ore. Tocca per sceglierle.'],
      bc_gpx: ['GPX', 'Scarica il percorso per Garmin, Strava o Komoot e seguilo con la tua app.'],
      legend: 'Legenda', legendSub: 'Cosa vuol dire ogni indicatore'
    },
    es: {
      r_search: ['Búsqueda', 'Busca calles, playas, restaurantes o gasolineras. Escribe "restaurantes" y los ves todos en el mapa.'],
      r_road: ['La carretera delante', 'El círculo de la izquierda eres tú. Los cuadraditos son los avisos por distancia, con los km encima. Línea verde y vacía = vía despejada.'],
      r_hero: ['El aviso más cercano', 'Tipo, distancia y hace cuánto se avisó. Toca ✓ si sigue o ✕ si ya no está.'],
      r_marker: ['Avisos en el mapa', 'Cada color es un tipo: naranja tráfico, amarillo obras, rojo accidente o peligro. El círculo azul discontinuo es una zona con controles de policía (nunca el punto exacto).'],
      r_report: ['Avisar', '¿Ves un accidente, obras, arena o tráfico? Tócalo y elige qué pasa. Solo parado o de pasajero.'],
      r_modes: ['Modos', 'Cambia entre Carretera, Surf, Bici o Correr. La etiqueta de color arriba te dice dónde estás; la ✕ te devuelve a la carretera.'],
      r_layers: ['Mapa o satélite', 'Cambia entre mapa normal y foto de satélite.'],
      r_locate: ['Tu posición', 'Vuelve a ti y el mapa te sigue. El punto verde indica que el GPS está activo.'],
      r_discover: ['Descubre la isla', 'Lugares para ver y negocios locales, con fotos y cómo llegar.'],
      s_pin: ['Los spots', 'Cada estrella es un spot y el número es la nota de 0 a 5 para tu nivel. Colores: gris plano, rojo flojo, naranja regular, verde bueno, azul excelente. La flecha indica de dónde llega la ola. Estrellas grises y apagadas = no aptas para tu nivel.'],
      s_level: ['Tu nivel', 'Principiante, intermedio o experto: el mismo mar tiene una nota distinta para cada uno.'],
      s_times: ['Las horas', 'Cada columna es una franja de 3 horas: altura y color muestran el mejor spot en ese momento. Toca una hora y todo el mapa se actualiza.'],
      s_tide: ['Marea y datos reales', 'Si la marea sube o baja y la hora de la próxima alta o baja. "Real ahora" es la medida del mareógrafo del puerto comparada con la previsión. "Viento medido" viene del aeropuerto.'],
      s_row: ['Un spot en la lista', 'Estrellas = nota. Luego: altura de la ola en el spot (m), periodo en segundos (más alto = ola más potente), dirección de llegada, energía en kJ (la fuerza de la ola), viento en km/h. 👁 = avisos de surfistas en la playa.'],
      s_wind: ['Estado del viento', 'glassy = mar liso, sin viento · offshore = de tierra, el mejor · cross-off = lateral de tierra · cross-shore = lateral · cross-on = lateral de mar · onshore = de mar, estropea las olas.'],
      sc_score: ['Nota del spot', 'Nota para la hora elegida y tu nivel. "Corregido por surfistas" significa que tiene en cuenta a quien está en la playa ahora.'],
      sc_stats: ['Los números', 'Olas: altura en el spot ("fuera" = mar abierto). Periodo: segundos entre olas. Energía: fuerza de la ola. Viento y su estado. Marea: sube o baja y la próxima alta o baja.'],
      sc_chart: ['Próximas 48 horas', 'El número es la altura de la ola, la barra es la nota. Las horas de noche están más claras. Toca una columna para elegirla.'],
      sc_days: ['Próximos días', 'Para cada día: mejor nota, altura mínima–máxima y la mejor hora.'],
      sc_tides: ['Mareas del día', 'Horas de marea alta (azul) y baja (naranja).'],
      sc_rep: ['Cómo está ahora', '¿Estás en la playa? Di tamaño, calidad y gente: lo ven todos durante 3 horas y la nota se corrige.'],
      b_big: ['Nota de las condiciones', 'De 0 a 5 estrellas para salir ahora: verde o azul bueno, naranja regular, rojo desaconsejado. Cuenta calor, viento, rachas, lluvia y luz.'],
      b_temp: ['Temperatura', 'Temperatura prevista en el interior de la isla.'],
      b_wind: ['Viento', 'La flecha indica hacia dónde sopla, el número es la velocidad en km/h. Debajo: de dónde viene y las rachas máximas.'],
      b_light: ['Luz', 'Amanecer y atardecer de hoy.'],
      b_times: ['La mejor hora', 'Cada columna es una franja de 3 horas: más alta y más verde, mejor. Las horas de noche están apagadas. Toca para elegir una hora.'],
      b_adv: ['Consejo', 'La recomendación del momento: calor, viento fuerte, oscuridad o lluvia.'],
      b_row: ['Una ruta', 'Estrellas = condiciones a la hora elegida. Luego: km totales, +m de desnivel, firme (asfalto, pista, paseo, sendero), dificultad, código del sendero oficial y ⚠ avisos en la ruta.'],
      b_map: ['En el mapa', 'El icono marca la salida, la línea tiene el color de las condiciones. 💧 fuentes · 🔧 talleres y alquiler de bicis.'],
      b_report: ['Ciclistas en la vía', '¿En bici por carretera? Avisa a los conductores: ven el aviso durante 30 minutos.'],
      bc_stats: ['Los números de la ruta', 'Kilómetros totales, metros de desnivel y nota de las condiciones para la hora elegida.'],
      bc_prof: ['Perfil', 'Cuánto subes y bajas en la ruta: altitud máxima arriba a la izquierda, longitud a la derecha. Debajo, la subida principal con la pendiente media.'],
      bc_wind: ['Viento en la ruta', 'Te dice si salir con viento en contra y volver a favor, o si conviene hacer la vuelta al revés.'],
      bc_best: ['Mejores horas', 'Las mejores franjas para esta ruta en las próximas 48 horas. Toca para elegirlas.'],
      bc_gpx: ['GPX', 'Descarga la ruta para Garmin, Strava o Komoot y síguela con tu app.'],
      legend: 'Leyenda', legendSub: 'Qué significa cada indicador'
    },
    en: {
      r_search: ['Search', 'Search streets, beaches, restaurants or fuel. Type "restaurants" to see them all on the map.'],
      r_road: ['The road ahead', 'The circle on the left is you. The small squares are alerts by distance, with km above. A green, empty line = road clear.'],
      r_hero: ['The nearest alert', 'Type, distance and how long ago it was reported. Tap ✓ if it\'s still there or ✕ if it\'s gone.'],
      r_marker: ['Alerts on the map', 'Each colour is a type: orange traffic, yellow roadworks, red accident or hazard. The dashed blue circle is an area with police checks (never the exact spot).'],
      r_report: ['Report', 'See an accident, roadworks, sand or traffic? Tap and choose what\'s happening. Only when stopped or as a passenger.'],
      r_modes: ['Modes', 'Switch between Road, Surf, Bike and Run. The coloured label at the top always shows where you are; the ✕ takes you back to Road.'],
      r_layers: ['Map or satellite', 'Switch between the normal map and satellite imagery.'],
      r_locate: ['Your position', 'Back to you, with the map following. The green dot means GPS is on.'],
      r_discover: ['Discover the island', 'Places to see and local businesses, with photos and directions.'],
      s_pin: ['The spots', 'Each star is a spot and the number is its 0–5 rating for your level. Colours: grey flat, red poor, orange fair, green good, blue great. The small arrow shows where the swell comes from. Grey, faded stars = not for your level.'],
      s_level: ['Your level', 'Beginner, intermediate or expert: the same sea rates differently for each.'],
      s_times: ['The hours', 'Each column is a 3-hour slot: height and colour show the best spot at that time. Tap an hour and the whole map updates.'],
      s_tide: ['Tide and live data', 'Whether the tide is rising or falling and the next high or low. "Live now" is the harbour tide gauge compared with the forecast. "Measured wind" comes from the airport.'],
      s_row: ['A spot in the list', 'Stars = rating. Then: wave height at the spot (m), period in seconds (higher = more powerful), direction, energy in kJ (the wave\'s power), wind in km/h. 👁 = reports from surfers on the beach.'],
      s_wind: ['Wind state', 'glassy = smooth sea, no wind · offshore = from land, the best · cross-off = side wind from land · cross-shore = side wind · cross-on = side wind from sea · onshore = from the sea, spoils the waves.'],
      sc_score: ['Spot rating', 'Rating for the chosen hour and your level. "Corrected by surfers" means it takes into account people on the beach now.'],
      sc_stats: ['The numbers', 'Waves: height at the spot ("out" = open sea). Period: seconds between waves. Energy: wave power. Wind and wind state. Tide: rising or falling and the next high or low.'],
      sc_chart: ['Next 48 hours', 'The number is the wave height, the bar is the rating. Night hours are lighter. Tap a column to pick it.'],
      sc_days: ['Next days', 'For each day: best rating, min–max height and the best hour.'],
      sc_tides: ['Tides of the day', 'High (blue) and low (orange) tide times.'],
      sc_rep: ['How it is now', 'On the beach? Share size, quality and crowd: everyone sees it for 3 hours and the rating adjusts.'],
      b_big: ['Conditions rating', '0 to 5 stars for going out now: green or blue good, orange so-so, red not advised. Based on heat, wind, gusts, rain and daylight.'],
      b_temp: ['Temperature', 'Forecast temperature inland.'],
      b_wind: ['Wind', 'The arrow shows where it blows to, the number is the speed in km/h. Below: where it comes from and the strongest gusts.'],
      b_light: ['Light', 'Today\'s sunrise and sunset.'],
      b_times: ['The best time', 'Each column is a 3-hour slot: taller and greener is better. Dark hours are faded. Tap to choose an hour.'],
      b_adv: ['Tip', 'Advice for the moment: heat, strong wind, darkness or rain.'],
      b_row: ['A route', 'Stars = conditions at the chosen hour. Then: total km, +m climbing, surface (road, gravel, promenade, trail), difficulty, official trail code and ⚠ road alerts on the route.'],
      b_map: ['On the map', 'The icon marks the start, the line has the colour of the conditions. 💧 fountains · 🔧 bike shops and rentals.'],
      b_report: ['Cyclists on the road', 'Riding on the road? Let drivers know: they see the alert for 30 minutes.'],
      bc_stats: ['Route numbers', 'Total kilometres, metres of climbing and conditions rating for the chosen hour.'],
      bc_prof: ['Elevation', 'How much you climb and descend: max altitude top left, length on the right. Below, the main climb with its average gradient.'],
      bc_wind: ['Wind on the route', 'Tells you whether to start into the wind and come back with it, or ride the loop the other way.'],
      bc_best: ['Best hours', 'The best slots for this route in the next 48 hours. Tap to pick one.'],
      bc_gpx: ['GPX', 'Download the route for Garmin, Strava or Komoot and follow it in your app.'],
      legend: 'Legend', legendSub: 'What each indicator means'
    },
    de: {
      r_search: ['Suche', 'Suche Straßen, Strände, Restaurants oder Tankstellen. Tippe "Restaurants" und sieh alle auf der Karte.'],
      r_road: ['Die Straße vor dir', 'Der Kreis links bist du. Die Quadrate sind Meldungen nach Entfernung, mit km darüber. Grüne, leere Linie = freie Fahrt.'],
      r_hero: ['Die nächste Meldung', 'Art, Entfernung und wie lange es her ist. Tippe ✓, wenn sie noch da ist, oder ✕, wenn sie weg ist.'],
      r_marker: ['Meldungen auf der Karte', 'Jede Farbe ist eine Art: orange Stau, gelb Baustelle, rot Unfall oder Gefahr. Der gestrichelte blaue Kreis ist ein Bereich mit Polizeikontrollen (nie der genaue Punkt).'],
      r_report: ['Melden', 'Unfall, Baustelle, Sand oder Stau? Tippen und auswählen. Nur im Stand oder als Beifahrer.'],
      r_modes: ['Modi', 'Wechsle zwischen Straße, Surf, Rad und Laufen. Das farbige Etikett oben zeigt immer, wo du bist; das ✕ bringt dich zurück zur Straße.'],
      r_layers: ['Karte oder Satellit', 'Wechsle zwischen normaler Karte und Satellitenbild.'],
      r_locate: ['Deine Position', 'Zurück zu dir, die Karte folgt dir. Der grüne Punkt heißt: GPS ist an.'],
      r_discover: ['Insel entdecken', 'Sehenswertes und lokale Betriebe, mit Fotos und Weg.'],
      s_pin: ['Die Spots', 'Jeder Stern ist ein Spot, die Zahl ist die Bewertung 0–5 für dein Level. Farben: grau flach, rot schwach, orange ok, grün gut, blau super. Der Pfeil zeigt, woher der Swell kommt. Graue, blasse Sterne = nicht für dein Level.'],
      s_level: ['Dein Level', 'Anfänger, Fortgeschritten oder Experte: dasselbe Meer wird für jeden anders bewertet.'],
      s_times: ['Die Stunden', 'Jede Spalte ist ein 3-Stunden-Fenster: Höhe und Farbe zeigen den besten Spot. Tippe auf eine Stunde, die ganze Karte aktualisiert sich.'],
      s_tide: ['Gezeiten und Live-Daten', 'Ob das Wasser steigt oder fällt und das nächste Hoch oder Niedrig. "Live jetzt" ist der Hafenpegel im Vergleich zur Prognose. "Gemessener Wind" kommt vom Flughafen.'],
      s_row: ['Ein Spot in der Liste', 'Sterne = Bewertung. Dann: Wellenhöhe am Spot (m), Periode in Sekunden (höher = kräftiger), Richtung, Energie in kJ (Wellenkraft), Wind in km/h. 👁 = Meldungen von Surfern am Strand.'],
      s_wind: ['Windlage', 'glassy = glattes Meer, kein Wind · offshore = vom Land, am besten · cross-off = seitlich vom Land · cross-shore = seitlich · cross-on = seitlich vom Meer · onshore = vom Meer, macht die Wellen kaputt.'],
      sc_score: ['Spot-Bewertung', 'Bewertung für die gewählte Stunde und dein Level. "Von Surfern korrigiert" heißt: Meldungen vom Strand fließen ein.'],
      sc_stats: ['Die Zahlen', 'Wellen: Höhe am Spot ("draußen" = offenes Meer). Periode: Sekunden zwischen Wellen. Energie: Wellenkraft. Wind und Windlage. Tide: steigend oder fallend und das nächste Hoch oder Niedrig.'],
      sc_chart: ['Nächste 48 Stunden', 'Die Zahl ist die Wellenhöhe, der Balken die Bewertung. Nachtstunden sind heller. Tippe auf eine Spalte.'],
      sc_days: ['Nächste Tage', 'Pro Tag: beste Bewertung, min–max Höhe und die beste Stunde.'],
      sc_tides: ['Gezeiten des Tages', 'Zeiten für Hoch- (blau) und Niedrigwasser (orange).'],
      sc_rep: ['Wie es jetzt ist', 'Am Strand? Teile Größe, Qualität und Andrang: alle sehen es 3 Stunden lang, die Bewertung passt sich an.'],
      b_big: ['Bewertung der Bedingungen', '0 bis 5 Sterne fürs Rausgehen jetzt: grün oder blau gut, orange so lala, rot nicht empfohlen. Hitze, Wind, Böen, Regen und Licht zählen.'],
      b_temp: ['Temperatur', 'Vorhergesagte Temperatur im Inland.'],
      b_wind: ['Wind', 'Der Pfeil zeigt, wohin er weht, die Zahl ist die Geschwindigkeit in km/h. Darunter: woher er kommt und die stärksten Böen.'],
      b_light: ['Licht', 'Sonnenauf- und -untergang heute.'],
      b_times: ['Die beste Zeit', 'Jede Spalte ist ein 3-Stunden-Fenster: höher und grüner ist besser. Dunkle Stunden sind blass. Tippe, um eine Stunde zu wählen.'],
      b_adv: ['Tipp', 'Der Hinweis für jetzt: Hitze, starker Wind, Dunkelheit oder Regen.'],
      b_row: ['Eine Strecke', 'Sterne = Bedingungen zur gewählten Stunde. Dann: km gesamt, +m Anstieg, Untergrund (Asphalt, Schotter, Promenade, Pfad), Schwierigkeit, Code des offiziellen Wegs und ⚠ Meldungen auf der Strecke.'],
      b_map: ['Auf der Karte', 'Das Symbol markiert den Start, die Linie hat die Farbe der Bedingungen. 💧 Brunnen · 🔧 Radläden und Verleih.'],
      b_report: ['Radfahrer auf der Straße', 'Mit dem Rad auf der Straße? Sag Autofahrern Bescheid: sie sehen die Meldung 30 Minuten lang.'],
      bc_stats: ['Zahlen der Strecke', 'Kilometer gesamt, Höhenmeter und Bewertung für die gewählte Stunde.'],
      bc_prof: ['Höhenprofil', 'Wie viel du hoch und runter fährst: maximale Höhe oben links, Länge rechts. Darunter der Hauptanstieg mit mittlerer Steigung.'],
      bc_wind: ['Wind auf der Strecke', 'Sagt dir, ob du gegen den Wind starten und mit ihm zurückkommen sollst, oder die Runde andersherum fährst.'],
      bc_best: ['Beste Stunden', 'Die besten Zeitfenster für diese Strecke in den nächsten 48 Stunden. Tippe zum Auswählen.'],
      bc_gpx: ['GPX', 'Lade die Strecke für Garmin, Strava oder Komoot herunter und folge ihr in deiner App.'],
      legend: 'Legende', legendSub: 'Was jedes Symbol bedeutet'
    }
  };
  const g = (k) => (G[lang()] && G[lang()][k]) || G.es[k];

  // [elemento, voce della guida]
  const ROAD = [['#searchOpen', 'r_search'], ['#road', 'r_road'], ['#hero', 'r_hero'], ['.mk', 'r_marker'], ['#reportBtn', 'r_report'], ['#surfBtn', 'r_modes'], ['#layersBtn', 'r_layers'], ['#centerBtn', 'r_locate'], ['#discoverBtn', 'r_discover']];
  const MODE_TIPS = {
    surf: [['.sf-pin', 's_pin'], ['#sfLevel', 's_level'], ['#sfTimes', 's_times'], ['#sfTide', 's_tide'], ['#sfList .sf-row', 's_row'], ['#sfList .sf-row', 's_wind']],
    bike: [['#spNow .sp-big', 'b_big'], ['#spNow .sp-cell:nth-child(2)', 'b_temp'], ['#spNow .sp-cell:nth-child(3)', 'b_wind'], ['#spNow .sp-cell:nth-child(4)', 'b_light'], ['#spTimes', 'b_times'], ['#spAdvice', 'b_adv'], ['#spList .sf-row', 'b_row'], ['.sp-start', 'b_map'], ['.sp-report', 'b_report']],
    run: [['#spNow .sp-big', 'b_big'], ['#spNow .sp-cell:nth-child(2)', 'b_temp'], ['#spNow .sp-cell:nth-child(3)', 'b_wind'], ['#spNow .sp-cell:nth-child(4)', 'b_light'], ['#spTimes', 'b_times'], ['#spAdvice', 'b_adv'], ['#spList .sf-row', 'b_row'], ['.sp-start', 'b_map']]
  };
  const CARD_TIPS = {
    surf: [['#sfCardBody .sf-score', 'sc_score'], ['#sfCardBody .sf-stats', 'sc_stats'], ['#sfCardBody .sf-repbtn', 'sc_rep'], ['#sfCardBody .sf-chart', 'sc_chart'], ['#sfCardBody .sf-days', 'sc_days'], ['#sfCardBody .sf-tides', 'sc_tides']],
    sport: [['#spCardBody .sf-stats', 'bc_stats'], ['#spCardBody .sp-prof', 'bc_prof'], ['#spCardBody .sp-wind', 'bc_wind'], ['#spCardBody .sf-tides', 'bc_best'], ['#spCardBody .p-sec', 'bc_gpx']]
  };
  const SHEETS = { road: ['sheet', 'sheetToggle'], surf: ['sfSheet', 'sfToggle'], bike: ['spSheet', 'spToggle'], run: ['spSheet', 'spToggle'] };

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
        el('p', { text: text }),
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
    const sets = k === 'surf' ? [MODE_TIPS.surf, CARD_TIPS.surf] : k === 'bike' || k === 'run' ? [MODE_TIPS[k], CARD_TIPS.sport] : [ROAD];
    const seen = new Set();
    const rows = [];
    sets.flat().forEach(([, key]) => { if (!seen.has(key)) { seen.add(key); const [t, x] = g(key); rows.push(el('div', { class: 'lg-row' }, [el('b', { text: t }), el('p', { text: x })])); } });
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
