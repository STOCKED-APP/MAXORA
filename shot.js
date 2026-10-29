const { chromium } = require('playwright');
const out = [];
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, locale: 'it-IT' });
  await ctx.addInitScript(() => { localStorage.setItem('maxora_lang', JSON.stringify('it')); localStorage.setItem('maxora_surfLevel', '2'); });
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', (e) => errs.push('PAGE ' + e.message));
  p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text().slice(0, 200)); });
  await p.goto('https://stocked-app.github.io/MAXORA/?v=' + Date.now(), { waitUntil: 'load' });
  await p.waitForTimeout(6000);
  await p.click('#surfBtn');
  await p.waitForTimeout(8000);
  const rateBefore = await p.evaluate(() => { const S = window.MAXORA_SURF; return S && S.rate ? S.rate('la-pared', S.state.idx, 2) : null; });
  out.push('prima: ' + JSON.stringify(rateBefore && { r: rateBefore.r, h: rateBefore.h }));
  await p.evaluate(() => { const b = [...document.querySelectorAll('.sf-pin')].find((e) => e.getAttribute('aria-label') === 'La Pared'); b.click(); });
  await p.waitForTimeout(2000);
  await p.click('.sf-repbtn');
  await p.waitForTimeout(400);
  const chips = await p.$$('.sf-form .sf-chips');
  await (await chips[0].$$('.sf-chip'))[1].click(); await p.waitForTimeout(200);
  await (await (await p.$$('.sf-form .sf-chips'))[1].$$('.sf-chip'))[0].click(); await p.waitForTimeout(200);
  await (await (await p.$$('.sf-form .sf-chips'))[2].$$('.sf-chip'))[0].click(); await p.waitForTimeout(200);
  await p.screenshot({ path: 'shots/rep-form.png' });
  await p.click('.sf-form .p-go');
  await p.waitForTimeout(4000);
  out.push('toast: ' + await p.evaluate(() => document.getElementById('toast').textContent));
  out.push('lista: ' + await p.evaluate(() => [...document.querySelectorAll('.sf-rep')].map((e) => e.innerText).join(' // ')));
  const rateAfter = await p.evaluate(() => { const S = window.MAXORA_SURF; return S.rate('la-pared', S.state.idx, 2); });
  out.push('dopo: ' + JSON.stringify(rateAfter && { r: rateAfter.r, h: rateAfter.h, comm: rateAfter.comm || rateAfter.community || null }));
  await p.evaluate(() => { const c = document.getElementById('sfCard'); const h = [...c.querySelectorAll('.sf-h')].find((e) => /adesso/i.test(e.textContent)); if (h) h.scrollIntoView(); });
  await p.waitForTimeout(400);
  await p.screenshot({ path: 'shots/rep-done.png' });
  // secondo invio subito: deve essere rifiutato
  await p.click('.sf-repbtn').catch(() => {});
  await p.waitForTimeout(300);
  try {
    await (await (await p.$$('.sf-form .sf-chips'))[0].$$('.sf-chip'))[1].click(); await p.waitForTimeout(150);
    await (await (await p.$$('.sf-form .sf-chips'))[1].$$('.sf-chip'))[0].click(); await p.waitForTimeout(150);
    await p.click('.sf-form .p-go'); await p.waitForTimeout(2500);
    out.push('secondo invio: ' + await p.evaluate(() => document.getElementById('toast').textContent));
  } catch (e) { out.push('secondo invio: ' + e.message); }
  out.push('lista spot: ' + await p.evaluate(() => [...document.querySelectorAll('.sf-row')].slice(0, 4).map((r) => r.innerText.replace(/\n/g, ' | ')).join(' // ')));
  out.push('errori: ' + (errs.join(' | ') || 'nessuno'));
  require('fs').writeFileSync('shots/out.txt', out.join('\n'));
  await b.close();
})().catch((e) => { out.push('ERRORE: ' + e.message); require('fs').writeFileSync('shots/out.txt', out.join('\n')); process.exit(0); });
