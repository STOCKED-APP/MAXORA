const { chromium } = require('playwright');
const out = [];
(async () => {
  try { const st = await (await fetch('https://tiles.openfreemap.org/styles/liberty')).json(); require('fs').writeFileSync('shots/liberty.json', JSON.stringify(st, null, 1)); } catch (e) { out.push('liberty: ' + e.message); }
  const b = await chromium.launch();
  const errs = [];
  for (const [name, scheme, zoom, center] of [['corr-light-15', 'light', 15, [-13.874, 28.737]], ['corr-dark-15', 'dark', 15, [-13.874, 28.737]], ['corr-light-14', 'light', 14, [-13.88, 28.735]]]) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, locale: 'it-IT', colorScheme: scheme });
    await ctx.addInitScript((n) => { if (n.startsWith('sat')) localStorage.setItem('maxora_mapMode', JSON.stringify('sat')); ['tourDone', 'tips2_surf', 'tips2_bike', 'tips2_run', 'tips2_camper'].forEach((k) => localStorage.setItem('maxora_' + k, 'true')); }, name);
    const p = await ctx.newPage();
    p.on('pageerror', (e) => errs.push(name + ' PAGE ' + e.message));
    p.on('console', (m) => { if (m.type() === 'error') errs.push(name + ' ' + m.text().slice(0, 160)); });
    await p.goto('https://stocked-app.github.io/MAXORA/?v=' + Date.now(), { waitUntil: 'load' });
    await p.waitForTimeout(4000);
    out.push(name + ' surf: ' + await p.evaluate(() => typeof window.MAXORA_SURF)); if (errs.length) out.push(errs.join(' / ')); await p.evaluate(() => window.MAXORA_MODES.choose('surf')).catch((e) => out.push('choose: ' + e.message)); await p.waitForTimeout(6000);
    await p.evaluate(([z, c]) => { const m = window.MAXORA.map; m.jumpTo({ center: c, zoom: z }); }, [zoom, center]);
    await p.waitForTimeout(5000);
    await p.screenshot({ path: 'shots/' + name + '.png' });
    out.push(name + ' versione: ' + await p.evaluate(() => window.MAXORA_CONFIG.version));
    await ctx.close();
  }
  out.push('errori: ' + (errs.join(' | ') || 'nessuno'));
  require('fs').writeFileSync('shots/out.txt', out.join('\n'));
  await b.close();
})().catch((e) => { out.push('ERRORE: ' + e.message); require('fs').writeFileSync('shots/out.txt', out.join('\n')); process.exit(0); });
