// Gnomeworks smoke test.  Loads the game in a headless browser at desktop and
// phone sizes, taps the machine, buys every gnome type, flips to the Shop Floor,
// claims a shiny, reloads, and fails if anything logs an error or a file 404s.
// Screenshots land in tools/out/.
//
// Needs: Node 18+ and Playwright with Chromium  (npm install playwright; npx playwright install chromium)
// Run from the repo root:  node tools/smoke-test.js
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const URL = 'file://' + path.join(ROOT, 'index.html');
const OUT = path.join(__dirname, 'out');
fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const browser = await chromium.launch();
  const errors = [];
  for (const [name, viewport, touch] of [['desktop', { width: 1400, height: 900 }, false], ['phone', { width: 390, height: 844 }, true]]) {
    const ctx = await browser.newContext({ viewport, hasTouch: touch, isMobile: touch });
    const page = await ctx.newPage();
    page.on('pageerror', e => errors.push(`${name} page error: ${e.message}`));
    page.on('console', m => { if (m.type() === 'error') errors.push(`${name} console: ${m.text()}`); });
    page.on('requestfailed', r => errors.push(`${name} missing file: ${r.url()}`));

    await page.goto(URL + '?debug=1');
    await page.waitForTimeout(500);
    const box = await (await page.$('#machine')).boundingBox();
    for (let i = 0; i < 30; i++) {
      if (touch) await page.touchscreen.tap(box.x + box.width * 0.2, box.y + box.height * 0.45);
      else await page.mouse.click(box.x + box.width * 0.2, box.y + box.height * 0.45);
      await page.waitForTimeout(40);
    }
    const taps = await page.evaluate(() => GW.game.s.stats.taps);
    if (taps < 20) errors.push(`${name}: only ${taps} taps registered`);

    await page.evaluate(() => {
      const s = GW.game.s; s.cogs = 1e12; s.cogsSeen = 1e12;
      GW.CONFIG.producers.forEach(p => { for (let i = 0; i < 12; i++) GW.econ.buy(s, 'producer', p.id); });
      GW.econ.buy(s, 'oneTime', 'two_hands'); GW.econ.buy(s, 'oneTime', 'w_sword');
    });
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(OUT, `${name}-machine.png`) });

    await page.click('[data-view="floor"]');
    await page.waitForTimeout(2500);
    await page.screenshot({ path: path.join(OUT, `${name}-floor.png`) });

    await page.evaluate(() => { GW.game.s.stats.legPity = 0; });
    await page.click('.debug-bar button:nth-child(4)');   // spawn a shiny
    await page.waitForTimeout(400);
    const shiny = await page.$('.rare-popup');
    if (!shiny) errors.push(`${name}: shiny did not appear`);
    else await shiny.click({ force: true });

    await page.evaluate(() => GW.state.save(GW.game.s));
    const before = await page.evaluate(() => GW.game.s.itemsMade);
    await page.reload();
    await page.waitForTimeout(400);
    const after = await page.evaluate(() => GW.game.s.itemsMade);
    if (after < before) errors.push(`${name}: save did not survive reload (${before} -> ${after})`);

    const version = await page.textContent('.footer');
    console.log(`${name}: ok  taps=${taps}  items=${after}  ${version.trim()}`);
    await ctx.close();
  }
  await browser.close();
  if (errors.length) { console.log('\nPROBLEMS:\n' + errors.join('\n')); process.exit(1); }
  console.log('\nAll clear.  Screenshots in tools/out/');
})();
