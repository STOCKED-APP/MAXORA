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
    p.on('console', (m) => { if (m.type() === 'error' && !/INTERNET_DISCONNECTED|WebSocket/.test(m.text())) errs.push(m.text().slice(0, 140)); });
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
  await run('o', { ctx: { geolocation: { latitude: 28.7205, longitude: -13.8695 }, permissions: ['geolocation'] } }, [
    ['online', async (p) => { await p.reload({ waitUntil: 'load' }); }, 8000],
    ['offline-reload', async (p, ctx) => { await ctx.setOffline(true); await p.reload({ waitUntil: 'load' }).catch(() => {}); }, 8000],
    ['offline-surf', ev(() => window.MAXORA_MODES.choose('surf')), 5000],
    ['offline-place', ev(() => { window.MAXORA_MODES.choose('road'); document.getElementById('discoverBtn').click(); }), 3000]
  ]);
  await run('g', { ctx: { locale: 'de-DE', geolocation: { latitude: 28.7205, longitude: -13.8695 }, permissions: ['geolocation'] } }, [['run', ev(() => window.MAXORA_MODES.choose('run')), 6000]]);
  await run('n', { ctx: {} }, [['home']]);
  await b.close();
})().catch((e) => { log('ERRORE: ' + e.message); process.exit(0); });
