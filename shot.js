const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const out = [];
  for (const [name, theme] of [['surf-chiaro', 'light'], ['surf-scuro', 'dark']]) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, colorScheme: theme, locale: 'it-IT' });
    await ctx.addInitScript(([t]) => { localStorage.setItem('maxora_theme', JSON.stringify(t)); localStorage.setItem('maxora_lang', JSON.stringify('it')); }, [theme]);
    const p = await ctx.newPage();
    const errs = [];
    p.on('pageerror', (e) => errs.push('PAGE ' + e.message));
    p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text().slice(0, 160)); });
    p.on('response', async (r) => { if (r.url().includes('tide-now')) { try { out.push('tide-now ' + r.status() + ' ' + (await r.text()).slice(0, 300)); } catch (e) {} } });
    await p.goto('https://stocked-app.github.io/MAXORA/?v=' + Date.now(), { waitUntil: 'load' });
    await p.waitForTimeout(6000);
    await p.click('#surfBtn');
    await p.waitForTimeout(9000);
    await p.screenshot({ path: `shots/${name}-1.png` });
    const rows = await p.evaluate(() => [...document.querySelectorAll('.sf-row')].map((r) => r.innerText.replace(/\n/g, ' | ')).join(' // ') + ' ## ' + document.getElementById('sfTide').innerText.replace(/\n/g, ' ') + ' ## ' + document.getElementById('sfNote').innerText);
    out.push(name + ': ' + rows);
    await p.click('.sf-row');
    await p.waitForTimeout(2500);
    await p.screenshot({ path: `shots/${name}-2.png` });
    out.push(name + ' errori: ' + (errs.join(' | ') || 'nessuno'));
    await ctx.close();
  }
  require('fs').writeFileSync('shots/out.txt', out.join('\n'));
  await b.close();
})();
