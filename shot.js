const { chromium } = require('playwright');
const out = [];
(async () => {
  const b = await chromium.launch();
  const errs = [];
  for (const [name, scheme, zoom, center] of [['light', 'light', 9, [-14.02, 28.42]], ['dark', 'dark', 9, [-14.02, 28.42]], ['light-z14', 'light', 14, [-13.868, 28.735]], ['dark-z14', 'dark', 14, [-13.868, 28.735]]]) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, locale: 'it-IT', colorScheme: scheme });
    await ctx.addInitScript(() => { ['tourDone', 'tips2_surf', 'tips2_bike', 'tips2_run', 'tips2_camper'].forEach((k) => localStorage.setItem('maxora_' + k, 'true')); });
    const p = await ctx.newPage();
    p.on('pageerror', (e) => errs.push(name + ' PAGE ' + e.message));
    p.on('console', (m) => { if (m.type() === 'error') errs.push(name + ' ' + m.text().slice(0, 160)); });
    await p.goto('https://stocked-app.github.io/MAXORA/?v=' + Date.now(), { waitUntil: 'load' });
    await p.waitForTimeout(4000);
    await p.evaluate(([z, c]) => { const m = window.MAXORA.map; m.jumpTo({ center: c, zoom: z }); window.MAXORA.closeOverlays && window.MAXORA.closeOverlays(); }, [zoom, center]);
    await p.waitForTimeout(5000);
    await p.screenshot({ path: 'shots/' + name + '.png' });
    out.push(name + ' versione: ' + await p.evaluate(() => window.MAXORA_CONFIG.version));
    await ctx.close();
  }
  out.push('errori: ' + (errs.join(' | ') || 'nessuno'));
  require('fs').writeFileSync('shots/out.txt', out.join('\n'));
  await b.close();
})().catch((e) => { out.push('ERRORE: ' + e.message); require('fs').writeFileSync('shots/out.txt', out.join('\n')); process.exit(0); });
