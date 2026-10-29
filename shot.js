const { chromium } = require('playwright');
const out = [];
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, locale: 'it-IT' });
  await ctx.addInitScript(() => { localStorage.setItem('maxora_lang', JSON.stringify('it')); });
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', (e) => errs.push('PAGE ' + e.message));
  p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text().slice(0, 200)); });
  await p.goto('https://stocked-app.github.io/MAXORA/?v=' + Date.now(), { waitUntil: 'load' });
  await p.waitForTimeout(6000);
  for (const [idx, ids] of [[2, ['pista-norte']], [3, ['bayuyo', 'osm-4243263', 'osm-4243063', 'gairia', 'majanicho-run']]]) {
    await p.click('#surfBtn'); await p.waitForTimeout(300);
    await (await p.$$('.mode-item'))[idx].click();
    await p.waitForTimeout(6000);
    out.push('lista: ' + await p.evaluate(() => document.querySelectorAll('#spList .sf-row').length));
    for (const id of ids) {
      await p.evaluate((id) => { const S = window.MAXORA_SPORT.state; const r = S.routes.find((x) => x.id === id); const b = [...document.querySelectorAll('#spList .sf-row')].find((e) => e.innerText.includes(r.name.it)); b.scrollIntoView(); b.click(); }, id);
      await p.waitForTimeout(3500);
      await p.screenshot({ path: `shots/r-${id}.png` });
      out.push(id + ': ' + await p.evaluate(() => document.getElementById('spCardBody').innerText.replace(/\n+/g, ' | ').slice(0, 220)));
      await p.click('#spClose'); await p.waitForTimeout(400);
    }
  }
  out.push('errori: ' + (errs.join(' | ') || 'nessuno'));
  require('fs').writeFileSync('shots/out.txt', out.join('\n'));
  await b.close();
})().catch((e) => { out.push('ERRORE: ' + e.message); require('fs').writeFileSync('shots/out.txt', out.join('\n')); process.exit(0); });
