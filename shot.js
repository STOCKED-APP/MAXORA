const { chromium } = require('playwright');
const fs = require('fs');
const out = [];
const log = (s) => { out.push(s); fs.writeFileSync('shots/out.txt', out.join('\n')); };
const URL = 'https://stocked-app.github.io/MAXORA/';
const tips = () => { ['tourDone', 'tips2_surf', 'tips2_bike', 'tips2_run', 'tips2_camper', 'tips2_card_surf', 'tips2_card_sport'].forEach((k) => localStorage.setItem('maxora_' + k, 'true')); };
(async () => {
  const b = await chromium.launch();
  async function run(tag, opts, steps) {
    const ctx = await b.newContext(Object.assign({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, locale: 'it-IT', hasTouch: true, isMobile: true }, opts.ctx || {}));
    await ctx.addInitScript(opts.init || tips, opts.arg);
    const p = await ctx.newPage();
    const errs = [];
    p.on('pageerror', (e) => errs.push(e.message));
    p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text().slice(0, 140)); });
    await p.goto(URL + '?v=' + Date.now(), { waitUntil: 'load' });
    await p.waitForTimeout(6000);
    let i = 0;
    for (const [name, fn, wait] of steps) {
      try { if (fn) await fn(p, ctx); await p.waitForTimeout(wait || 2500); await p.screenshot({ path: `shots/${tag}${++i}-${name}.png` }); } catch (e) { log(tag + ' ' + name + ' ERR ' + e.message.slice(0, 120)); }
    }
    log(tag + ' errori: ' + (errs.join(' | ') || 'nessuno'));
    await ctx.close();
  }
  const ev = (f, a) => (p) => p.evaluate(f, a);
  // 1) telefono piccolo, GPS ok
  await run('s', { ctx: { viewport: { width: 360, height: 640 }, geolocation: { latitude: 28.7205, longitude: -13.8695 }, permissions: ['geolocation'] } }, [
    ['home'], ['report', ev(() => document.getElementById('reportBtn').click())],
    ['surf', ev(() => { window.MAXORA.closeOverlays(); window.MAXORA_MODES.choose('surf'); }), 6000],
    ['surfcard', ev(() => document.querySelector('#uiCards .uc[data-id]').click()), 3000],
    ['bike', ev(() => { document.getElementById('sfClose').click(); window.MAXORA_MODES.choose('bike'); }), 6000],
  ]);
  // 2) GPS negato
  await run('n', { ctx: {} }, [['home'], ['search', ev(() => document.getElementById('searchOpen').click())], ['discover', ev(() => { document.getElementById('searchBack').click(); document.getElementById('discoverBtn').click(); }), 3500], ['report', ev(() => { window.MAXORA.closeOverlays(); document.getElementById('reportBtn').click(); })]]);
  // 3) prima apertura (tutorial) in inglese e tedesco
  await run('e', { ctx: { locale: 'en-GB' }, init: () => {} }, [['tour1'], ['home', ev(() => { localStorage.setItem('maxora_tourDone', 'true'); location.reload(); }), 7000], ['settings', ev(() => document.getElementById('settingsBtn').click())]]);
  await run('g', { ctx: { locale: 'de-DE', geolocation: { latitude: 28.7205, longitude: -13.8695 }, permissions: ['geolocation'] } }, [['home'], ['camper', ev(() => window.MAXORA_MODES.choose('camper')), 6000], ['run', ev(() => window.MAXORA_MODES.choose('run')), 6000]]);
  // 4) senza rete dopo il primo caricamento
  await run('o', { ctx: { geolocation: { latitude: 28.7205, longitude: -13.8695 }, permissions: ['geolocation'] } }, [
    ['online'], ['offline-reload', async (p, ctx) => { await p.waitForTimeout(3000); await ctx.setOffline(true); await p.reload({ waitUntil: 'load' }).catch(() => {}); }, 7000],
    ['offline-report', ev(() => document.getElementById('reportBtn').click())],
    ['offline-search', async (p) => { await p.evaluate(() => { window.MAXORA.closeOverlays(); document.getElementById('searchOpen').click(); }); await p.fill('#searchInput', 'cotillo'); }, 4000]
  ]);
  // 5) tablet orizzontale
  await run('t', { ctx: { viewport: { width: 1180, height: 820 }, isMobile: false, geolocation: { latitude: 28.7205, longitude: -13.8695 }, permissions: ['geolocation'] } }, [['home'], ['surf', ev(() => window.MAXORA_MODES.choose('surf')), 6000], ['place', ev(() => { window.MAXORA_MODES.choose('road'); document.getElementById('discoverBtn').click(); }), 3500]]);
  await b.close();
})().catch((e) => { log('ERRORE: ' + e.message); process.exit(0); });
