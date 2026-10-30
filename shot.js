const { chromium } = require('playwright');
const fs = require('fs');
const out = [];
const log = (s) => { out.push(s); fs.writeFileSync('shots/out.txt', out.join('\n')); };
(async () => {
  const b = await chromium.launch();
  for (const scheme of ['light', 'dark']) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, locale: 'it-IT', colorScheme: scheme, geolocation: { latitude: 28.7205, longitude: -13.8695 }, permissions: ['geolocation'], hasTouch: true, isMobile: true });
    await ctx.addInitScript(() => { ['tourDone', 'tips2_surf', 'tips2_bike', 'tips2_run', 'tips2_camper', 'tips2_card_surf', 'tips2_card_sport'].forEach((k) => localStorage.setItem('maxora_' + k, 'true'));
      window.__lt = 0; try { new PerformanceObserver((l) => l.getEntries().forEach((e) => { window.__lt += e.duration; })).observe({ type: 'longtask', buffered: true }); } catch (e) {} });
    const p = await ctx.newPage();
    const errs = [];
    p.on('pageerror', (e) => errs.push(e.message));
    p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text().slice(0, 140)); });
    const t0 = Date.now();
    await p.goto('https://stocked-app.github.io/MAXORA/?v=' + Date.now(), { waitUntil: 'load' });
    await p.waitForFunction(() => window.MAXORA && window.MAXORA.map && window.MAXORA.map.loaded(), null, { timeout: 30000 }).catch(() => {});
    log(scheme + ' map ready ms: ' + (Date.now() - t0));
    const S = scheme[0];
    let i = 0;
    const shot = async (name, fn, wait) => {
      try {
        const lt0 = await p.evaluate(() => window.__lt);
        if (fn) await fn();
        await p.waitForTimeout(wait || 2500);
        await p.screenshot({ path: `shots/${S}${String(++i).padStart(2, '0')}-${name}.png` });
        const lt = await p.evaluate(() => window.__lt);
        log(`${S}${i} ${name} longtask+${Math.round(lt - lt0)}ms dom=${await p.evaluate(() => document.getElementsByTagName('*').length)}`);
      } catch (e) { log(name + ' ERR ' + e.message.slice(0, 160)); }
    };
    const ev = (f, a) => p.evaluate(f, a);
    const reset = async () => { await ev(() => { try { window.MAXORA.closeOverlays(); } catch (e) {} document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' })); }); await p.waitForTimeout(400); };
    await shot('home', null, 5000);
    await shot('sheet-toggle', () => ev(() => document.getElementById('sheetToggle').click()));
    await ev(() => document.getElementById('sheetToggle').click());
    await shot('report', () => ev(() => document.getElementById('reportBtn').click()));
    await reset();
    await shot('discover', () => ev(() => document.getElementById('discoverBtn').click()), 3500);
    await shot('discover-scroll', () => ev(() => { const l = document.getElementById('discoverList'); (l.closest('.overlay-sheet') || l.parentElement).scrollTop = 600; l.scrollTop = 600; }));
    await reset();
    await shot('search', () => ev(() => document.getElementById('searchOpen').click()));
    await shot('search-typed', async () => { await p.fill('#searchInput', 'farmacia'); }, 3500);
    await shot('results', () => p.keyboard.press('Enter'), 3500);
    await shot('place', () => ev(() => { const c = document.querySelector('#rTrack > *'); c && c.click(); }), 3500);
    await shot('place-scroll', () => ev(() => { const b = document.getElementById('placeBody'); const s = document.getElementById('place'); s.scrollTop = 500; b.scrollTop = 500; }));
    await reset(); await ev(() => { const x = document.getElementById('resultsClose'); x && x.click(); });
    await shot('settings', () => ev(() => document.getElementById('settingsBtn').click()));
    await reset();
    await shot('layers-sat', () => ev(() => document.getElementById('layersBtn').click()), 5000);
    await ev(() => document.getElementById('layersBtn').click());
    await shot('streets-z16', () => ev(() => { window.MAXORA.unfollow(); window.MAXORA.map.jumpTo({ center: [-13.8655, 28.7385], zoom: 16 }); }), 4000);
    await shot('modes-menu', () => ev(() => document.getElementById('surfBtn').click()));
    await reset();
    for (const m of ['surf', 'bike', 'run', 'camper']) {
      await shot(m, () => ev((k) => window.MAXORA_MODES.choose(k), m), 6000);
      await shot(m + '-card', () => ev(() => { const c = document.querySelector('#uiCards .uc[data-id]'); c && c.click(); }), 3500);
      await shot(m + '-card-scroll', () => ev(() => { document.querySelectorAll('.sp-card, #spCard, #sfCard, .cp-card, [id$=CardBody]').forEach((n) => { n.scrollTop = 700; }); }));
      await reset();
      await ev(() => { const c = document.querySelector('.sf-close, #sfClose, #spClose'); if (c && c.offsetParent) c.click(); });
      await shot(m + '-list', () => ev(() => window.MAXORA_UI.showList()), 2500);
      await ev(() => window.MAXORA_UI.hideList());
      if (scheme === 'dark') break;
    }
    await ev(() => window.MAXORA_MODES.choose('road'));
    log(scheme + ' errori: ' + (errs.join(' | ') || 'nessuno'));
    await ctx.close();
  }
  await b.close();
})().catch((e) => { log('ERRORE: ' + e.message); process.exit(0); });
