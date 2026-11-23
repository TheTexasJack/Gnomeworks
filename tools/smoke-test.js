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

// Packing (1d, 1g): open the door, drag each order's item from the conveyor menu into the box, close it, and drag the
// stamp from the computer's supplies menu onto it.  The record must match the orders, the shelf must not change,
// and closing the door clears it all.  On the way: the belt's tip shows until the item menu opens, the computer
// glows while a closed box waits, a stamp dropped on an open box only shakes it, and instructions off hides every tip.
async function packCheck(page, errors) {
  const fail = m => errors.push('packing: ' + m);
  const mid = async sel => { const b = await page.locator(sel).first().boundingBox(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; };
  await page.goto(URL + '?debug=1&ship=1');
  await page.waitForTimeout(400);
  await page.click('[data-view="shipping"]');
  await page.waitForTimeout(300);
  await page.evaluate(() => GW.CONFIG.items.forEach(it => { GW.game.s.items[it.id] = 5000; }));   // in the room, where counts hold still
  let c = await mid('.ship-chain'); await page.mouse.click(c.x, c.y);
  await page.waitForFunction(() => GW.ship.tripState() === 'here', null, { timeout: 8000 });
  const orders = await page.evaluate(() => GW.ship.orders().map(o => o.item.id));
  const shelf = await page.evaluate(() => JSON.stringify(GW.game.s.items));
  const shown = sel => page.evaluate(q => { const el = document.querySelector(q); return !!el && !el.hidden && getComputedStyle(el).display !== 'none'; }, sel);
  const dragTo = async (from, to) => {
    await page.locator(from).scrollIntoViewIfNeeded();
    const a = await mid(from), b = await mid(to);
    await page.mouse.move(a.x, a.y); await page.mouse.down();
    for (let i = 1; i <= 8; i++) await page.mouse.move(a.x + (b.x - a.x) * i / 8, a.y + (b.y - a.y) * i / 8);
    await page.mouse.up();
  };
  if (!await shown('.ship-belt-glow') || !await shown('.ship-belt-tag')) fail('the belt tip did not show at the start of the trip');
  await page.evaluate(() => document.documentElement.classList.add('no-hints'));
  if (await shown('.ship-belt-glow') || await shown('.ship-belt-tag')) fail('the belt tip showed with instructions off');
  await page.evaluate(() => document.documentElement.classList.remove('no-hints'));
  // A stamp dropped on the open, empty box does nothing.
  c = await mid('.ship-computer'); await page.mouse.click(c.x, c.y);
  if (await page.evaluate(() => GW.ship.menuKind()) !== 'supplies') { fail('the computer did not open the supplies menu'); return; }
  if (await page.$$eval('.ship-menu-supplies .ship-menu-head', h => h.map(x => x.textContent).join()) !== 'Stamps') fail('the supplies menu does not show just Stamps');
  await dragTo('.supply-tile', '.ship-box:not(.is-stacked)');
  if (await page.evaluate(() => GW.ship.boxState()) !== 'open') fail('a stamp changed an open box');
  // The conveyor's uncovered end switches menus straight from the supplies menu.
  const cv = await page.locator('.ship-conveyor').boundingBox();
  await page.mouse.click(cv.x + cv.width * 0.92, cv.y + cv.height * 0.5);
  if (await page.evaluate(() => GW.ship.menuKind()) !== 'items') fail('the conveyor did not switch from the supplies menu');
  await page.keyboard.press('Escape');
  for (const id of orders) {
    c = await mid('.ship-conveyor'); await page.mouse.click(c.x, c.y);
    if (await page.evaluate(() => GW.ship.menuKind()) !== 'items') { fail('the conveyor did not open the item menu'); return; }
    if (await shown('.ship-belt-glow') || await shown('.ship-belt-tag')) fail('the belt tip stayed after the item menu opened');
    if (await page.isVisible('.ship-menu-supplies')) fail('two menus open at once');
    await dragTo(`.ship-tile[data-item="${id}"]`, '.ship-box:not(.is-stacked)');
    await page.keyboard.press('Escape');
    const b = await mid('.ship-box:not(.is-stacked)');
    await page.mouse.click(b.x, b.y);                                     // close the box
    if (await page.evaluate(() => GW.ship.boxState()) !== 'closed') { fail('the filled box did not close'); return; }
    if (!await shown('.ship-screen-glow')) fail('the computer did not glow beside a closed box');
    c = await mid('.ship-computer'); await page.mouse.click(c.x, c.y);
    if (await page.evaluate(() => GW.ship.menuKind()) !== 'supplies') { fail('the computer did not open the supplies menu'); return; }
    c = await mid('.supply-tile'); await page.mouse.click(c.x, c.y);   // a tap on the tile alone does nothing
    if (await page.evaluate(() => GW.ship.boxState()) !== 'closed' || !await page.evaluate(() => GW.ship.menuOpen())) fail('a tap on the stamp tile did something');
    await dragTo('.supply-tile', '.ship-box:not(.is-stacked)');
    await page.waitForFunction(() => GW.ship.boxState() !== 'stamped' && GW.ship.boxState() !== 'closed', null, { timeout: 4000 });
    await page.keyboard.press('Escape');
  }
  const rec = await page.evaluate(() => GW.ship.packed());
  if (rec.length !== orders.length || rec.some((r, i) => !r || r.item !== orders[i] || r.count !== 4999 || r.stamp !== 'gnomerica')) fail('record wrong: ' + JSON.stringify(rec));
  if (await page.$('.ship-box:not(.is-stacked)')) fail('a box appeared after every order was packed');
  if (await page.evaluate(() => JSON.stringify(GW.game.s.items)) !== shelf) fail('the shelf changed');
  if (!await page.evaluate(() => document.querySelector('.ship-chain').classList.contains('is-ready') && !document.querySelector('.ship-finish').hidden)) fail('the chain did not show how to finish');
  const stonks0 = await page.evaluate(() => GW.game.s.stonks);
  c = await mid('.ship-chain'); await page.mouse.click(c.x, c.y);
  if (await page.evaluate(() => GW.ship.packed().length + document.querySelectorAll('.ship-box').length)) fail('closing the door did not clear the packing');
  // The hand-off (1e): a perfect shift ships the piles down to 1, adds Stonks, and shows the report card once the door closes.
  const left = await page.evaluate(ids => ids.map(id => GW.game.s.items[id]), orders);
  if (left.some(n => n !== 1)) fail('shipping left the shelf at ' + left.join(', ') + ' (expected 1 each)');
  const want = stonks0 + orders.length * await page.evaluate(() => GW.CONFIG.shipping.score.regions.gnomerica.right);
  if (await page.evaluate(() => GW.game.s.stonks) !== want) fail('Stonks did not rise to ' + want);
  try { await page.waitForFunction(() => GW.ship.cardOpen(), null, { timeout: 12000 }); } catch (e) { fail('no report card after the door closed'); return; }
  const rights = await page.$$eval('.ship-card .card-row.is-right', r => r.length);
  if (rights !== orders.length) fail(`report card shows ${rights} right of ${orders.length}`);
  await page.keyboard.press('Escape');
  if (await page.evaluate(() => GW.ship.cardOpen())) fail('Escape did not close the report card');
  await page.waitForTimeout(1200);
  if (await page.textContent('.stonks-num') !== String(want)) fail('the STONKS screen did not tick up to ' + want);
  await page.reload();
  await page.waitForTimeout(400);
  if (await page.evaluate(() => GW.game.s.stonks + ',' + GW.game.s.stonksHistory.length) !== want + ',1') fail('Stonks were not saved');
  // An old save with no Stonks loads at 0.
  await page.evaluate(() => { const k = GW.CONFIG.saveKey, o = JSON.parse(localStorage.getItem(k)); delete o.stonks; delete o.stonksHistory;
    GW.state.save = () => false; localStorage.setItem(k, JSON.stringify(o)); });
  await page.reload();
  await page.waitForTimeout(400);
  if (await page.evaluate(() => GW.game.s.stonks + ',' + JSON.stringify(GW.game.s.stonksHistory)) !== '0,[]') fail('an old save did not load with Stonks at 0');
  console.log(`packing: ${orders.length} orders packed and shipped (${orders.join(', ')}), Stonks ${want}`);
}

// Leaving mid-trip (1f): a view button shows the warning; Stay keeps the trip; Send it off scores the shift, shows
// the card, and lands on the tapped view once the card closes.  Leaving after the chain is pulled waits for the card.
async function leaveCheck(page, errors) {
  const fail = m => errors.push('leaving: ' + m);
  const mid = async sel => { const b = await page.locator(sel).first().boundingBox(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; };
  const open = async () => { const c = await mid('.ship-chain'); await page.mouse.click(c.x, c.y);
    await page.waitForFunction(() => GW.ship.tripState() === 'here', null, { timeout: 8000 }); };
  await page.goto(URL + '?debug=1&ship=1');
  await page.waitForTimeout(400);
  await page.click('[data-view="shipping"]');
  await page.waitForTimeout(300);
  await page.evaluate(() => GW.CONFIG.items.forEach(it => { GW.game.s.items[it.id] = 5000; }));
  await page.click('[data-view="floor"]');
  if (await page.evaluate(() => GW.ship.warnOpen() || GW.game.s.view !== 'floor')) fail('leaving with the door closed warned or did not leave');
  await page.click('[data-view="shipping"]');
  await page.waitForTimeout(300);
  await page.evaluate(() => GW.CONFIG.items.forEach(it => { GW.game.s.items[it.id] = 5000; }));
  await open();
  const orders = await page.evaluate(() => JSON.stringify(GW.ship.orders().map(o => o.item.id)));
  const h0 = await page.evaluate(() => GW.game.s.stonksHistory.length);
  await page.click('[data-view="floor"]');
  if (!await page.evaluate(() => GW.ship.warnOpen())) { fail('no warning mid-trip'); return; }
  if (await page.evaluate(() => GW.game.s.view) !== 'shipping') fail('the view switched under the warning');
  await page.click('.warn-stay');
  if (await page.evaluate(() => GW.ship.warnOpen() || GW.ship.tripState() !== 'here' || GW.game.s.view !== 'shipping')) fail('Stay changed something');
  if (await page.evaluate(() => JSON.stringify(GW.ship.orders().map(o => o.item.id))) !== orders) fail('Stay changed the orders');
  await page.click('[data-view="machine"]');
  await page.keyboard.press('Escape');
  if (await page.evaluate(() => GW.ship.warnOpen() || GW.game.s.view !== 'shipping')) fail('Escape did not close the warning');
  await page.click('[data-view="floor"]');
  await page.click('.warn-go');
  if (await page.evaluate(() => GW.game.s.stonksHistory.length) !== h0 + 1) fail('Send it off did not score the shift');
  try { await page.waitForFunction(() => GW.ship.cardOpen(), null, { timeout: 12000 }); } catch (e) { fail('no report card after Send it off'); return; }
  const wrong = await page.$$eval('.ship-card .card-row.is-wrong', r => r.length);
  if (wrong !== JSON.parse(orders).length) fail(`the card shows ${wrong} misses (expected every order Not packed)`);
  if (await page.evaluate(() => GW.game.s.view) !== 'shipping') fail('the view switched before the card closed');
  await page.keyboard.press('Escape');
  if (await page.evaluate(() => GW.game.s.view) !== 'floor') fail('did not land on the Shop Floor after the card');
  // After the pull: no warning, the trip finishes, the card shows, then the view switches.
  await page.click('[data-view="shipping"]');
  await page.waitForTimeout(300);
  await page.evaluate(() => GW.CONFIG.items.forEach(it => { GW.game.s.items[it.id] = 5000; }));
  await open();
  const c = await mid('.ship-chain'); await page.mouse.click(c.x, c.y);
  await page.click('[data-view="machine"]');
  if (await page.evaluate(() => GW.ship.warnOpen() || GW.game.s.view !== 'shipping')) fail('leaving after the pull warned or skipped the card');
  try { await page.waitForFunction(() => GW.ship.cardOpen(), null, { timeout: 12000 }); } catch (e) { fail('no report card when leaving after the pull'); return; }
  await page.mouse.click(c.x, c.y);    // any tap closes the card
  if (await page.evaluate(() => GW.game.s.view) !== 'machine') fail('did not land on the Machine after the card');
  console.log('leaving: warning, Stay, Escape, Send it off, and leaving after the pull all ok');
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
    if (name === 'desktop') await packCheck(page, errors);
    if (name === 'desktop') await leaveCheck(page, errors);

    const version = await page.textContent('.footer');
    console.log(`${name}: ok  taps=${taps}  items=${after}  ${version.trim()}`);
    await ctx.close();
  }
  await browser.close();
  if (errors.length) { console.log('\nPROBLEMS:\n' + errors.join('\n')); process.exit(1); }
  console.log('\nAll clear.  Screenshots in tools/out/');
})();
