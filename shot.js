const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  for (const [name, theme, mode] of [['chiaro','light','map'],['scuro','dark','map'],['satellite','light','sat']]) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, colorScheme: theme });
    await ctx.addInitScript(([t, m]) => { localStorage.setItem('maxora_theme', t); localStorage.setItem('maxora_mapMode', JSON.stringify(m)); }, [theme, mode]);
    const p = await ctx.newPage();
    const errs = [];
    p.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.text()); });
    p.on('requestfailed', (r) => errs.push('FAIL ' + r.url().slice(0, 100)));
    await p.goto('https://stocked-app.github.io/MAXORA/?v=' + Date.now(), { waitUntil: 'load' });
    await p.waitForTimeout(9000);
    if (mode === 'sat') {
      const on = await p.evaluate(() => document.getElementById('layersBtn').classList.contains('on'));
      if (!on) { await p.click('#layersBtn'); await p.waitForTimeout(8000); }
    }
    await p.screenshot({ path: `shots/${name}.png` });
    console.log(`::notice::${name}: ${errs.slice(0, 6).join(' | ') || 'nessun errore'}`);
    await ctx.close();
  }
  await b.close();
})();
