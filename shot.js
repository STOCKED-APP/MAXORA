const { chromium } = require('playwright');
const fs = require('fs');
const out = [];
const log = (s) => { out.push(s); fs.writeFileSync('shots/out.txt', out.join('\n')); };
(async () => {
  const b = await chromium.launch();
  const sets = [['ios', 440, 956], ['android', 360, 720]];
  for (const lang of ['es', 'en', 'it', 'de']) for (const [dev, w, h] of sets) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 3, locale: lang, geolocation: { latitude: 28.7205, longitude: -13.8695 }, permissions: ['geolocation'], hasTouch: true, isMobile: true });
    await ctx.addInitScript((l) => { localStorage.setItem('maxora_lang', JSON.stringify(l)); ['tourDone', 'tips2_surf', 'tips2_bike', 'tips2_run', 'tips2_camper', 'tips2_card_surf', 'tips2_card_sport'].forEach((k) => localStorage.setItem('maxora_' + k, 'true')); }, lang);
    const p = await ctx.newPage();
    p.on('pageerror', (e) => log(lang + dev + ' ' + e.message));
    await p.goto('https://stocked-app.github.io/MAXORA/?v=' + Date.now(), { waitUntil: 'load' });
    await p.waitForTimeout(7000);
    const ev = (f, a) => p.evaluate(f, a).catch((e) => log('ev ' + e.message));
    const shot = async (n, wait) => { await p.waitForTimeout(wait || 3000); await p.screenshot({ path: `shots/${dev}-${lang}-${n}.png` }); };
    await ev(() => { window.MAXORA.map.jumpTo({ center: [-13.866, 28.733], zoom: 13.6 }); });
    await shot('1-strada', 4000);
    await ev(() => document.getElementById('reportBtn').click()); await shot('2-segnala', 1500);
    await ev(() => window.MAXORA.closeOverlays());
    await ev(() => window.MAXORA_MODES.choose('surf')); await shot('3-surf', 7000);
    await ev(() => { const c = document.querySelector('#uiCards .uc[data-id]'); c && c.click(); }); await shot('4-spot', 3500);
    await ev(() => { const x = document.getElementById('sfClose'); x && x.click(); window.MAXORA_MODES.choose('bike'); }); await shot('5-bici', 7000);
    await ev(() => window.MAXORA_MODES.choose('camper')); await shot('6-camper', 7000);
    await ev(() => { window.MAXORA_MODES.choose('road'); document.getElementById('discoverBtn').click(); }); await shot('7-scopri', 4000);
    await ctx.close();
  }
  log('fatto');
  await b.close();
})().catch((e) => { log('ERRORE ' + e.message); });
