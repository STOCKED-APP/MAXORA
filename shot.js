const { webkit, chromium, devices } = require('playwright');
const fs = require('fs');
const out = [];
const log = (s) => { out.push(s); fs.writeFileSync('shots/out.txt', out.join('\n')); };
(async () => {
  for (const [name, bt] of [['wk', webkit], ['cr', chromium]]) {
    const b = await bt.launch();
    const ctx = await b.newContext(Object.assign({}, devices['iPhone 13'], { locale: 'it-IT' }));
    const p = await ctx.newPage();
    p.on('pageerror', (e) => log(name + ' PAGE ' + e.message));
    p.on('console', (m) => { if (m.type() === 'error') log(name + ' ' + m.text().slice(0, 160)); });
    const t0 = Date.now();
    p.goto('https://stocked-app.github.io/MAXORA/?v=' + Date.now()).catch(() => {});
    for (const ms of [800, 1600, 2400, 3000]) {
      await p.waitForTimeout(Math.max(0, ms - (Date.now() - t0)));
      await p.screenshot({ path: 'shots/' + name + '-' + ms + '.png' }).catch((e) => log('shot ' + e.message));
    }
    log(name + ' info ' + JSON.stringify(await p.evaluate(() => { const a = document.querySelector('.sp-art'); const l = document.querySelector('.sp-v1'); const sv = l && l.querySelector('svg'); return { art: a && a.getBoundingClientRect().toJSON(), v1: l && l.getBoundingClientRect().toJSON(), svg: sv && sv.getBoundingClientRect().toJSON(), css: !!document.styleSheets.length, ver: window.MAXORA_CONFIG && window.MAXORA_CONFIG.version }; }).catch((e) => e.message)));
    await b.close();
  }
})().catch((e) => { log('ERRORE ' + e.message); });
