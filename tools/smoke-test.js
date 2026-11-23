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

// The factory rests in the Shipping view (docs/EVENTS.md): counts hold still, nothing starts or expires,
// a running event resumes on leaving, and the time is paid once, on leaving or on a reload in the room.
const gnomeClicks = s => Object.keys(s.clicks).filter(k => k !== 'tap').reduce((n, k) => n + s.clicks[k], 0);
async function restCheck(page, errors) {
  const fail = m => errors.push('resting: ' + m);
  await page.goto(URL + '?debug=1&ship=1');
  await page.waitForTimeout(400);
  await page.click('.debug-bar button:has-text("Wild: spin")');
  await page.waitForTimeout(200);
  await page.click('[data-view="shipping"]');
  const rate = await page.evaluate(() => GW.econ.rates(GW.game.s).total);
  const before = await page.evaluate(`(${gnomeClicks})(GW.game.s) + ',' + GW.game.s.cogs + ',' + GW.game.s.itemsMade`);
  await page.click('.debug-bar button:has-text("Popup")');   // a shiny now due must not spawn in the room
  await page.click('.debug-bar button:has-text("Clones")');
  const t0 = Date.now();
  await page.waitForTimeout(10500);                          // longer than Wild Magic lasts
  const held = await page.evaluate(`(${gnomeClicks})(GW.game.s) + ',' + GW.game.s.cogs + ',' + GW.game.s.itemsMade`);
  if (held !== before) fail(`counts changed in the room (${before} -> ${held})`);
  if (await page.$('.rare-popup')) fail('a shiny spawned in the room');
  if (await page.evaluate(() => GW.clones.isActive())) fail('a Clone Attack started in the room');
  if (await page.isVisible('.wild-target')) fail('Wild Magic shows in the room');
  const c0 = await page.evaluate(`(${gnomeClicks})(GW.game.s)`);
  await page.click('[data-view="machine"]');
  const secs = (Date.now() - t0) / 1000;
  const paid = await page.evaluate(`(${gnomeClicks})(GW.game.s)`) - c0;
  if (paid < rate * secs * 0.8 || paid > rate * secs * 1.2) fail(`leaving paid ${paid} clicks, expected about ${Math.round(rate * secs)}`);
  if (!await page.evaluate(() => GW.wild.isActive())) fail('Wild Magic did not resume after the room');
  if (await page.evaluate(() => GW.game.restOwed()) !== 0) fail('rest still owed after leaving');
  await page.waitForTimeout(1000);
  const ticking = await page.evaluate(`(${gnomeClicks})(GW.game.s)`) - c0 - paid;
  if (ticking > rate * 2) fail(`paid twice: ${ticking} extra clicks a second after leaving`);
  // Reload in the room: the rest is paid once, by the welcome-back catch-up.
  await page.click('[data-view="shipping"]');
  const r0 = await page.evaluate(`(${gnomeClicks})(GW.game.s)`), t1 = Date.now();
  await page.waitForTimeout(6000);
  await page.reload();
  await page.waitForTimeout(400);
  const secs2 = (Date.now() - t1) / 1000;
  const paid2 = await page.evaluate(`(${gnomeClicks})(GW.game.s)`) - r0;
  if (paid2 < rate * (secs2 - 1) * 0.8 || paid2 > rate * secs2 * 1.2) fail(`reload in the room paid ${paid2} clicks, expected about ${Math.round(rate * secs2)}`);
  await page.click('[data-view="machine"]');
  const r1 = await page.evaluate(`(${gnomeClicks})(GW.game.s)`);
  if (r1 - r0 - paid2 > rate * 2) fail(`reload in the room was paid again on leaving (${r1 - r0 - paid2} clicks)`);
  console.log(`resting: rate ${Math.round(rate)}/s, room ${secs.toFixed(1)}s paid ${Math.round(paid)}, reload ${secs2.toFixed(1)}s paid ${Math.round(paid2)}`);
}

(async () => {
  const browser = await chromium.launch();
  const errors = [];
  // Every CSS and JS link must carry the current version (run tools/stamp.js after bumping it).
  const ver = (fs.readFileSync(path.join(ROOT, 'js/config.js'), 'utf8').match(/GW\.VERSION\s*=\s*'([^']+)'/) || [])[1];
  const links = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8').match(/(?:src|href)="(?:css|js)\/[^"]+"/g) || [];
  links.filter(l => !l.includes('?v=' + ver + '"')).forEach(l => errors.push('index.html: stale or missing version stamp on ' + l + ' (run node tools/stamp.js)'));
  for (const [name, viewport, touch] of [['desktop', { width: 1400, height: 900 }, false], ['phone', { width: 390, height: 844 }, true]]) {
    const ctx = await browser.newContext({ viewport, hasTouch: touch, isMobile: touch });
    const page = await ctx.newPage();
    page.on('pageerror', e => errors.push(`${name} page error: ${e.message}`));
    page.on('console', m => { if (m.type() === 'error') errors.push(`${name} console: ${m.text()}`); });
    page.on('requestfailed', r => {
      const why = (r.failure() && r.failure().errorText) || 'unknown';
      if (why === 'net::ERR_ABORTED') return;  // the page cancelled the load (image removed before it finished); the file exists
      errors.push(`${name} missing file: ${r.url()} [${why}]`);
    });

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

    if (name === 'desktop') await restCheck(page, errors);

    const version = await page.textContent('.footer');
    console.log(`${name}: ok  taps=${taps}  items=${after}  ${version.trim()}`);
    await ctx.close();
  }
  await browser.close();
  if (errors.length) { console.log('\nPROBLEMS:\n' + errors.join('\n')); process.exit(1); }
  console.log('\nAll clear.  Screenshots in tools/out/');
})();
