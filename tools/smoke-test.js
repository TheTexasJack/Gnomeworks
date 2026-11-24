// Gnomeworks smoke test.  Loads the game in a headless browser at desktop and
// phone sizes, taps the machine, buys every gnome type, flips to the Shop Floor,
// claims a shiny, reloads, tries the Calm motion switch, and fails if anything logs an error or a file 404s.
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

// Packing (1d, 1g, 1h): open the door, drag each order's item from the conveyor menu into the box, close it, and drag
// the stamp from the computer's supplies menu onto it.  Every order asks for a count from its item's packing tag that
// the shelf can spare; the record must hold exactly those counts, the shelf must not change while packing, and closing
// the door clears it all.  Shipping takes exactly the recorded counts off the shelf, and a second shift right after,
// from the same ordinary shelf, can still be filled.  On the way: the belt's tip shows until the item menu opens, the
// computer glows while a closed box waits, a stamp dropped on an open box only shakes it, and instructions off hides
// every tip.  Inside supplies (1i): every junk tile with a packing tag shows its icon, the supplies menu opens with
// the 4-line chart, the first shift is perfect (peanuts in every box, bubble wrap around Breakables, peanuts added
// twice change nothing, peanuts and junk dropped on a closed box only shake it), and the second leaves every box
// without supplies, so each row reads "No peanuts" (plus "+N" for the rest).  Outside stickers (1j): the supplies menu
// shows Packing, Stickers, Stamps; the chart hides with instructions off; a sticker on an open box only shakes it;
// shift 1 adds FRAGILE to Breakables and HEAVY to Heavies (one added twice changes nothing) and each lands in the
// first slot;
// shift 2 adds none, so a Breakable reads "No peanuts +2" and a Heavy "No peanuts +1".
// APPROVED or DENIED (1l): no box comes out until an order is APPROVED; the full-size slip has the two stamp buttons,
// DENIED gives no box, changing it to APPROVED brings one, and the board's slip shows the stamp.  The Packing Rules
// bar shows with instructions off too.  Glitter fakes are off here (fakeCheck forces them).
// Then a shelf with only 3 Toilet Paper gets one order for the 2 it can spare, and a shelf with only Toilets gets
// one order that, packed with peanuts and stamped but no HEAVY sticker, reads "No HEAVY".
async function packCheck(page, errors) {
  const fail = m => errors.push('packing: ' + m);
  const mid = async sel => { const b = await page.locator(sel).first().boundingBox(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; };
  const shown = sel => page.evaluate(q => { const el = document.querySelector(q); return !!el && !el.hidden && getComputedStyle(el).display !== 'none'; }, sel);
  const dragTo = async (from, to) => {
    await page.locator(from).scrollIntoViewIfNeeded();
    const a = await mid(from), b = await mid(to);
    await page.mouse.move(a.x, a.y); await page.mouse.down();
    for (let i = 1; i <= 8; i++) await page.mouse.move(a.x + (b.x - a.x) * i / 8, a.y + (b.y - a.y) * i / 8);
    await page.mouse.up();
  };
  const stamp = (i, v) => stampSlip(page, i, v);
  const hand = () => handToDriver(page);
  const bench = () => page.evaluate(() => !!document.querySelector('.ship-box:not(.is-stacked)'));
  const SHELF = 40;                                                   // an ordinary shelf: 40 of every junk item
  await page.goto(URL + '?debug=1&ship=1');
  await page.waitForTimeout(400);
  await page.click('[data-view="shipping"]');
  await page.waitForTimeout(300);
  await page.evaluate(() => { GW.CONFIG.shipping.fakes.chance = 0; GW.CONFIG.shipping.fakes.elfChance = 0; });   // no glitter fakes or elves in these shifts
  await page.evaluate(n => GW.CONFIG.items.forEach(it => { GW.game.s.items[it.id] = it.group === 'monsters' ? 0 : n; }), SHELF);   // in the room, where counts hold still
  await page.evaluate(() => { GW.game.s.lastShift = null; });
  for (const k of ['card', 'log']) { const p = await mid('.ship-clip-' + k); await page.mouse.click(p.x, p.y); }
  if (await page.evaluate(() => GW.ship.cardOpen() || GW.ship.logMode() !== null)) fail('a clipboard opened something before the first shift');
  const stonks0 = await page.evaluate(() => GW.game.s.stonks);
  const right = await page.evaluate(() => GW.CONFIG.shipping.score.regions.gnomerica.right);
  const wrong = await page.evaluate(() => GW.CONFIG.shipping.score.regions.gnomerica.wrong);
  let c, shipped = [];
  // Shift 1 draws from one Breakable, one Heavy, and one Soft item that Gnomerica buys (the rest of the shelf waits),
  // so the stickers are always tried; shift 2 gets the whole ordinary shelf back, with shift 1's piles as shipped.
  const trio = await page.evaluate(() => {
    const buys = new Set(), pick = t => GW.CONFIG.items.find(it => it.pack === t && buys.has(it.id)).id;
    GW.DESTINATIONS.places.filter(p => p.region === 'gnomerica').forEach(p => p.buys.forEach(id => buys.add(id)));
    return [pick('breakable'), pick('heavy'), pick('soft')];
  });
  await page.evaluate(t => GW.CONFIG.items.forEach(it => { if (!t.includes(it.id)) GW.game.s.items[it.id] = 0; }), trio);
  // Shift 1's towns all get the work order's long name (1o), so the label's shrink is tried; shift 2 has the real ones.
  const realNames = await page.evaluate(() => GW.DESTINATIONS.places.map(p => p.name));
  await page.evaluate(() => GW.DESTINATIONS.places.forEach(p => { if (p.region === 'gnomerica') p.name = 'Grit Spit and Fellers'; }));
  for (let shift = 1; shift <= 2; shift++) {
    const tag = `shift ${shift}: `;
    if (shift === 2) await page.evaluate(names => GW.DESTINATIONS.places.forEach((p, i) => { p.name = names[i]; }), realNames);
    if (shift === 2) await page.evaluate(([t, n]) => GW.CONFIG.items.forEach(it => { if (!t.includes(it.id) && it.group !== 'monsters') GW.game.s.items[it.id] = n; }), [trio, SHELF]);
    c = await mid('.ship-chain'); await page.mouse.click(c.x, c.y);
    await page.waitForFunction(() => GW.ship.tripState() === 'here', null, { timeout: 8000 });
    const orders = await page.evaluate(() => GW.ship.orders().map(o => ({ id: o.item.id, qty: o.qty, pack: o.item.pack || '', town: o.place.name })));
    const shelf = await page.evaluate(() => JSON.stringify(GW.game.s.items));
    const before = await page.evaluate(() => Object.assign({}, GW.game.s.items));
    if (orders.length !== 3) fail(tag + `only ${orders.length} orders from an ordinary shelf`);
    if (shift === 1 && orders.map(o => o.id).sort().join() !== trio.slice().sort().join()) fail(tag + `orders ${orders.map(o => o.id)} from a shelf of ${trio}`);
    if (shift === 1) { const fp = await faceProblem(page, [false, false]); if (fp) fail('before the first shift, clipboard faces: ' + fp); }   // empty boxes, no glow (1p)
    const counts = await page.evaluate(() => GW.CONFIG.shipping.orders.counts);
    orders.forEach(o => {
      const spare = before[o.id] - 1, fits = counts[o.pack].filter(n => n <= spare);
      if (fits.length ? !fits.includes(o.qty) : o.qty !== spare) fail(tag + `${o.id} (${o.pack || 'no tag'}) asks for ${o.qty} of ${before[o.id]}`);
    });
    const slips = await page.$$eval('.ship-board .slip-item', els => els.map(e => e.textContent));
    if (orders.some((o, i) => !slips[i] || !slips[i].startsWith(o.qty + ' × '))) fail(tag + 'a slip does not show its count: ' + slips.join(' | '));
    // Stamp it, then pack it (1l): no box until an order is APPROVED.
    if (await bench()) fail(tag + 'a box came out before any order was APPROVED');
    if (await page.$$eval('.ship-board .ship-slip.is-unstamped', e => e.length) !== orders.length) fail(tag + 'the unstamped slips do not glow');
    if (shift === 1) {
      c = await mid('.ship-board .ship-slip'); await page.mouse.click(c.x, c.y);
      if (await page.$$eval('.ship-slip-view .slip-stamp-btn', b => b.length) !== 2) fail('the open slip does not have two stamp buttons');
      await page.keyboard.press('Escape');
      await stamp(0, 'denied');
      if (await bench()) fail('a DENIED order got a box');
      await stamp(0, 'approved');                                       // a mis-tap changed
      if (!await bench()) fail('changing DENIED to APPROVED brought no box');
      if (await page.$eval('.ship-board .ship-slip', e => (e.querySelector('.slip-verdict') || {}).dataset?.verdict) !== 'approved') fail('the board slip does not show APPROVED');
    }
    for (let i = shift === 1 ? 1 : 0; i < orders.length; i++) await stamp(i, 'approved');
    if (await page.evaluate(() => GW.ship.verdicts().join()) !== 'approved,approved,approved') fail(tag + 'stamps are ' + await page.evaluate(() => GW.ship.verdicts().join()));
    if (await page.evaluate(() => GW.ship.activeOrder()) !== 0) fail(tag + 'the box is not the leftmost APPROVED order\'s');
    if (shift === 1) {
      if (!await shown('.ship-belt-glow') || !await shown('.ship-belt-tag')) fail('the belt tip did not show at the start of the trip');
      await page.evaluate(() => document.documentElement.classList.add('no-hints'));
      if (await shown('.ship-belt-glow') || await shown('.ship-belt-tag')) fail('the belt tip showed with instructions off');
      await page.evaluate(() => document.documentElement.classList.remove('no-hints'));
      // A stamp dropped on the open, empty box does nothing.
      c = await mid('.ship-computer'); await page.mouse.click(c.x, c.y);
      if (await page.evaluate(() => GW.ship.menuKind()) !== 'supplies') { fail('the computer did not open the supplies menu'); return; }
      if (await page.$$eval('.ship-menu-supplies .ship-menu-head', h => h.map(x => x.textContent).join()) !== 'Packing,Stickers,Stamps') fail('the supplies menu does not show Packing, Stickers, and Stamps');
      if (await page.$$eval('.ship-menu-supplies .ship-rules .ship-rule', r => r.length) !== 4) fail('the Packing rules chart does not show 4 rules');
      if (!await shown('.ship-menu-supplies .ship-rules')) fail('the chart is hidden with instructions on');
      if (await page.evaluate(() => document.querySelector('.ship-rules').classList.contains('is-min'))) fail('the chart was minimized on its first showing in a fresh browser');
      await page.evaluate(() => document.documentElement.classList.add('no-hints'));
      if (!await shown('.ship-menu-supplies .ship-rules')) fail('the Packing Rules bar hid with instructions off (it always shows, 1l)');
      await page.evaluate(() => document.documentElement.classList.remove('no-hints'));
      if (await page.$eval('.ship-menu-supplies .ship-menu-list', l => l.firstElementChild.classList.contains('ship-rules')) !== true) fail('the Packing Rules bar is not first in the menu');
      await dragTo('.supply-tile[data-supply="stamp:gnomerica"]', '.ship-box:not(.is-stacked)');
      if (await page.evaluate(() => GW.ship.boxState()) !== 'open') fail('a stamp changed an open box');
      await dragTo('.supply-tile[data-supply="sticker:heavy"]', '.ship-box:not(.is-stacked)');
      const shookOpen = await page.evaluate(() => document.querySelector('.ship-box:not(.is-stacked) .box-body').getAnimations().length > 0);
      if (!shookOpen) fail('a sticker dropped on an open box did not shake it');
      if (await page.evaluate(() => GW.ship.boxState() + ':' + GW.ship.bench().outside.join()) !== 'open:') fail('a sticker changed an open box');
      // The conveyor's uncovered end switches menus straight from the supplies menu.
      const cv = await page.locator('.ship-conveyor').boundingBox();
      await page.mouse.click(cv.x + cv.width * 0.92, cv.y + cv.height * 0.5);
      if (await page.evaluate(() => GW.ship.menuKind()) !== 'items') fail('the conveyor did not switch from the supplies menu');
      await page.keyboard.press('Escape');
    }
    for (const o of orders) {
      c = await mid('.ship-conveyor'); await page.mouse.click(c.x, c.y);
      if (await page.evaluate(() => GW.ship.menuKind()) !== 'items') { fail('the conveyor did not open the item menu'); return; }
      if (await shown('.ship-belt-glow') || await shown('.ship-belt-tag')) fail('the belt tip stayed after the item menu opened');
      if (await page.isVisible('.ship-menu-supplies')) fail('two menus open at once');
      if (await page.textContent(`.ship-tile[data-item="${o.id}"]`).then(t => !t.includes(String(before[o.id])))) fail(tag + `the ${o.id} tile does not show the shelf count ${before[o.id]}`);
      if (shift === 1 && o === orders[0]) {                                // every known tagged tile shows its tag; untagged and "???" ones none
        const bad = await page.$$eval('.ship-menu-items .ship-tile', ts => ts.filter(t => !!t.querySelector('.tile-tag') !== (t.querySelector('.tile-name').textContent !== '???' && !!(GW.econ.itemDef(t.dataset.item) || {}).pack)).map(t => t.dataset.item));
        if (bad.length) fail('tag icons wrong on tiles: ' + bad.join(', '));
      }
      await dragTo(`.ship-tile[data-item="${o.id}"]`, '.ship-box:not(.is-stacked)');
      await page.keyboard.press('Escape');
      if (shift === 1) {                                                  // the right supplies inside
        c = await mid('.ship-computer'); await page.mouse.click(c.x, c.y);
        await dragTo('.supply-tile[data-supply="supply:peanuts"]', '.ship-box:not(.is-stacked)');
        if (o === orders[0]) await dragTo('.supply-tile[data-supply="supply:peanuts"]', '.ship-box:not(.is-stacked)');
        if (o.pack === 'breakable') await dragTo('.supply-tile[data-supply="supply:bubble"]', '.ship-box:not(.is-stacked)');
        await page.keyboard.press('Escape');
        const want = o.pack === 'breakable' ? 'peanuts,bubble' : 'peanuts';
        if (await page.evaluate(() => GW.ship.bench().inside.join()) !== want) fail(tag + `${o.id} box holds "${await page.evaluate(() => GW.ship.bench().inside.join())}", expected ${want}`);
        if (await page.$$eval('.ship-box:not(.is-stacked) .box-in:not([hidden])', p => p.length) !== want.split(',').length) fail('the open box does not show its supplies');
        if (o.pack && !await page.$('.ship-box:not(.is-stacked) .box-label .box-tag')) fail('the open box does not show the item\'s tag');
      }
      const b = await mid('.ship-box:not(.is-stacked)');
      await page.mouse.click(b.x, b.y);                                     // close the box
      if (await page.evaluate(() => GW.ship.boxState()) !== 'closed') { fail('the filled box did not close'); return; }
      if (await page.$$eval('.ship-box:not(.is-stacked) .box-in:not([hidden]), .ship-box:not(.is-stacked) .box-label:not([hidden])', p => p.length)) fail('a closed box shows what is inside');
      // The shipping label (1o): on as the box closes, with the order's town, region, and "via GRIP".
      const addr = await page.evaluate(() => { const a = document.querySelector('.ship-box:not(.is-stacked) .box-addr'); return getComputedStyle(a).visibility + '|' + [...a.querySelectorAll('.addr-line')].map(l => l.textContent).join('|'); });
      if (addr !== 'visible|' + o.town + '|Gnomerica|via GRIP') fail(tag + 'the closed box\'s label reads "' + addr + '", expected ' + o.town);
      const fit = await page.evaluate(() => { const l = document.querySelector('.ship-box:not(.is-stacked) .addr-town'); return [l.scrollWidth <= l.clientWidth, parseFloat(l.style.fontSize)]; });
      const full = await page.evaluate(() => GW.CONFIG.shipping.pack.addr.font[0]);
      if (!fit[0]) fail(tag + `the town "${o.town}" overflows its label line`);
      if (shift === 1 && !(fit[1] < full)) fail('"Grit Spit and Fellers" did not shrink on the label (' + fit[1] + 'cqw)');
      if (shift === 1 && o === orders[0]) {                                // junk and peanuts on a closed box only shake it
        const was = await page.evaluate(() => JSON.stringify(GW.ship.bench()));
        c = await mid('.ship-conveyor'); await page.mouse.click(c.x, c.y);
        await dragTo(`.ship-tile[data-item="${orders[1].id}"]`, '.ship-box:not(.is-stacked)');
        const shook = await page.evaluate(() => document.querySelector('.ship-box:not(.is-stacked) .box-body').getAnimations().length > 0);
        await page.keyboard.press('Escape');
        c = await mid('.ship-computer'); await page.mouse.click(c.x, c.y);
        await dragTo('.supply-tile[data-supply="supply:bubble"]', '.ship-box:not(.is-stacked)');
        await page.keyboard.press('Escape');
        if (!shook) fail('junk dropped on a closed box did not shake it');
        if (await page.evaluate(() => JSON.stringify(GW.ship.bench())) !== was) fail('junk or a supply changed a closed box');
      }
      if (!await shown('.ship-screen-glow')) fail('the computer did not glow beside a closed box');
      c = await mid('.ship-computer'); await page.mouse.click(c.x, c.y);
      if (await page.evaluate(() => GW.ship.menuKind()) !== 'supplies') { fail('the computer did not open the supplies menu'); return; }
      // Stamp first, then FRAGILE (1n): the Breakable box gets its stamp before its sticker, and the box stays put.
      const stampFirst = shift === 1 && o.pack === 'breakable';
      if (stampFirst) {
        await dragTo('.supply-tile[data-supply="stamp:gnomerica"]', '.ship-box:not(.is-stacked)');
        await page.waitForTimeout(500);
        if (await page.evaluate(() => GW.ship.boxState() + ':' + GW.ship.bench().stamp + ':' + GW.ship.packed().filter(Boolean).length) !== 'closed:gnomerica:' + orders.indexOf(o)) fail('the stamp sent the box or did not land: ' + await page.evaluate(() => GW.ship.boxState() + ':' + GW.ship.bench().stamp));
      }
      if (shift === 1) {                                                  // the right stickers outside (1j)
        const st = o.pack === 'breakable' ? 'fragile' : o.pack === 'heavy' ? 'heavy' : '';
        if (st) {
          await dragTo(`.supply-tile[data-supply="sticker:${st}"]`, '.ship-box:not(.is-stacked)');
          await dragTo(`.supply-tile[data-supply="sticker:${st}"]`, '.ship-box:not(.is-stacked)');
        }
        if (await page.evaluate(() => GW.ship.bench().outside.join()) !== st) fail(tag + `${o.id} box has stickers "${await page.evaluate(() => GW.ship.bench().outside.join())}", expected "${st}"`);
        const pics = await page.$$eval('.ship-box:not(.is-stacked) .box-sticker:not([hidden])', p => p.map(x => x.dataset.sticker + '@' + x.style.left));
        const slot = await page.evaluate(() => GW.CONFIG.shipping.pack.stickers.slots[0][0] + '%');
        if (pics.join() !== (st ? st + '@' + slot : '')) fail(tag + `the box shows stickers "${pics.join()}"`);
      }
      if (shift === 1 && o === orders[0]) {
        await page.locator('.supply-tile[data-supply="stamp:gnomerica"]').scrollIntoViewIfNeeded();
        c = await mid('.supply-tile[data-supply="stamp:gnomerica"]'); await page.mouse.click(c.x, c.y);   // a tap on the tile alone does nothing
        if (await page.evaluate(() => GW.ship.boxState()) !== 'closed' || !await page.evaluate(() => GW.ship.menuOpen())) fail('a tap on the stamp tile did something');
      }
      if (!stampFirst) await dragTo('.supply-tile[data-supply="stamp:gnomerica"]', '.ship-box:not(.is-stacked)');
      await page.keyboard.press('Escape');
      await page.waitForTimeout(400);
      if (await page.evaluate(() => GW.ship.boxState() + ':' + GW.ship.bench().stamp) !== 'closed:gnomerica') fail(tag + 'the stamped box left the bench before it was handed over');
      if (await page.evaluate(() => !document.querySelector('.ship-box:not(.is-stacked) .box-mark').hidden) !== true) fail('the stamp does not show on the closed box');
      if (!await shown('.ship-hand-tag') || !await page.evaluate(() => document.querySelector('.ship-driver').classList.contains('is-hand'))) fail('the driver tip did not show beside a closed box');
      if (shift === 1 && o === orders[0]) {
        await page.evaluate(() => document.documentElement.classList.add('no-hints'));
        if (await shown('.ship-hand-tag')) fail('the driver tip showed with instructions off');
        await page.evaluate(() => document.documentElement.classList.remove('no-hints'));
        // A tap on a closed, stamped box still reopens it; the stamp hides and is kept.  An open box dropped on the
        // driver springs back.
        c = await mid('.ship-box:not(.is-stacked)'); await page.mouse.click(c.x, c.y);
        if (await page.evaluate(() => GW.ship.boxState() + ':' + GW.ship.bench().stamp + ':' + document.querySelector('.ship-box:not(.is-stacked) .box-mark').hidden) !== 'open:gnomerica:true') fail('a tap did not reopen the stamped box');
        if (await page.evaluate(() => getComputedStyle(document.querySelector('.ship-box:not(.is-stacked) .box-addr')).visibility) !== 'hidden') fail('the label showed on an open box');
        if (await shown('.ship-hand-tag')) fail('the driver tip showed beside an open box');
        const at = await page.locator('.ship-box:not(.is-stacked)').boundingBox();
        await hand();
        await page.waitForTimeout(500);
        const back = await page.locator('.ship-box:not(.is-stacked)').boundingBox();
        if (await page.evaluate(() => GW.ship.boxState() + ':' + GW.ship.packed().filter(Boolean).length) !== 'open:0') fail('an open box dropped on the driver was taken');
        if (Math.abs(back.x - at.x) > 2 || Math.abs(back.y - at.y) > 2) fail('the open box did not spring back to the bench');
        c = await mid('.ship-box:not(.is-stacked)'); await page.mouse.click(c.x, c.y);
        if (await page.evaluate(() => GW.ship.boxState() + ':' + GW.ship.bench().stamp) !== 'closed:gnomerica') fail('closing again lost the stamp');
        // A closed box dropped short of the driver springs back too.
        const bx = await mid('.ship-box:not(.is-stacked)');
        await page.mouse.move(bx.x, bx.y); await page.mouse.down();
        for (let i = 1; i <= 6; i++) await page.mouse.move(bx.x, bx.y - i * 12);
        await page.mouse.up();
        await page.waitForTimeout(500);
        if (await page.evaluate(() => GW.ship.boxState() + ':' + GW.ship.packed().filter(Boolean).length) !== 'closed:0') fail('a closed box dropped away from the driver was taken');
      }
      const n0 = await page.evaluate(() => GW.ship.packed().filter(Boolean).length);
      const watch = shift === 1 && o === orders[0];
      if (watch) await page.evaluate(() => {             // the drop's path (1o), sampled every frame for 1.2 s
        window.__drop = []; const t1 = performance.now() + 1200;
        (function f() { const b = document.querySelector('.ship-box.is-stacked'); if (b) { const r = b.getBoundingClientRect(); window.__drop.push([r.left + r.width / 2, r.bottom]); } if (performance.now() < t1) requestAnimationFrame(f); })();
      });
      await hand();
      try { await page.waitForFunction(n => GW.ship.packed().filter(Boolean).length === n + 1, n0, { timeout: 2000 }); } catch (e) { fail(tag + 'a closed box dropped on the driver was not handed over'); }
      await page.waitForTimeout(watch ? 1300 : 700);
      if (watch) {
        // One smooth arc: x never turns back, y turns at most once (up, then down), it ends on its stack spot, and
        // nothing is still moving.  The settle squashes the box's picture, never its place.
        const d = await page.evaluate(() => {
          const el = document.querySelector('.ship-box.is-stacked'), S = GW.CONFIG.shipping.layouts[matchMedia(GW.CONFIG.shipping.tallQuery).matches ? 'tall' : 'wide'].stack;
          const wh = GW.CONFIG.shipping.layouts[matchMedia(GW.CONFIG.shipping.tallQuery).matches ? 'tall' : 'wide'].aspect.split('/'), sp = S.spots[0];
          const x = S.x + sp[0] * S.h / (parseFloat(wh[0]) / parseFloat(wh[1]));
          return { pts: window.__drop, left: parseFloat(el.style.left), top: parseFloat(el.style.top), x, y: S.y + sp[1] * S.h, moving: el.getAnimations({ subtree: true }).length };
        });
        const turns = k => { let n = 0, dir = 0; for (let i = 1; i < d.pts.length; i++) { const v = d.pts[i][k] - d.pts[i - 1][k]; if (Math.abs(v) < 0.3) continue; const sg = Math.sign(v); if (dir && sg !== dir) n++; dir = sg; } return n; };
        if (d.pts.length < 10) fail('the drop was not seen (' + d.pts.length + ' frames)');
        if (turns(0) > 0 || turns(1) > 1) fail(`the drop wiggles: x turns ${turns(0)} times, y ${turns(1)}`);
        if (Math.abs(d.left - d.x) > 0.01 || Math.abs(d.top - d.y) > 0.01) fail(`the drop ended at ${d.left}, ${d.top}, not its stack spot ${d.x}, ${d.y}`);
        if (d.moving) fail('the box was still moving after the drop');
        const last = d.pts[d.pts.length - 1], still = await page.evaluate(() => { const r = document.querySelector('.ship-box.is-stacked').getBoundingClientRect(); return [r.left + r.width / 2, r.bottom]; });
        if (Math.abs(still[0] - last[0]) > 0.5 || Math.abs(still[1] - last[1]) > 0.5) fail('the stacked box moved after the drop ended');
      }
    }
    const towns = await page.$$eval('.ship-box.is-stacked .addr-town', t => t.map(x => x.textContent + ':' + getComputedStyle(x.closest('.box-addr')).visibility));
    if (towns.join() !== orders.map(o => o.town + ':visible').join()) fail(tag + 'the stacked boxes\' labels read ' + towns.join());
    const rec = await page.evaluate(() => GW.ship.packed());
    const inside = o => shift === 2 ? '' : o.pack === 'breakable' ? 'peanuts,bubble' : 'peanuts';
    const outside = o => shift === 2 ? '' : o.pack === 'breakable' ? 'fragile' : o.pack === 'heavy' ? 'heavy' : '';
    if (rec.length !== orders.length || rec.some((r, i) => !r || r.item !== orders[i].id || r.count !== orders[i].qty || r.stamp !== 'gnomerica' || r.inside.join() !== inside(orders[i]) || r.outside.join() !== outside(orders[i]))) fail(tag + 'record wrong: ' + JSON.stringify(rec));
    if (await page.$('.ship-box:not(.is-stacked)')) fail('a box appeared after every order was packed');
    if (await page.evaluate(() => JSON.stringify(GW.game.s.items)) !== shelf) fail(tag + 'the shelf changed while packing');
    if (!await page.evaluate(() => document.querySelector('.ship-chain').classList.contains('is-ready') && !document.querySelector('.ship-finish').hidden)) fail('the chain did not show how to finish');
    c = await mid('.ship-chain'); await page.mouse.click(c.x, c.y);
    if (await page.evaluate(() => GW.ship.packed().length + document.querySelectorAll('.ship-box').length)) fail('closing the door did not clear the packing');
    // The hand-off (1e, 1h): shipping takes exactly the ordered counts off the shelf and nothing else.
    const after = await page.evaluate(() => Object.assign({}, GW.game.s.items));
    const moved = Object.keys(after).filter(id => after[id] !== before[id]);
    orders.forEach(o => { if (after[o.id] !== before[o.id] - o.qty) fail(tag + `${o.id} went ${before[o.id]} to ${after[o.id]}, ordered ${o.qty}`); });
    if (moved.length !== orders.length) fail(tag + 'shipping changed other piles: ' + moved.join(', '));
    const want = stonks0 + 3 * right - (shift === 2 ? orders.length * wrong : 0);   // shift 1 all right; shift 2 has no supplies: every row wrong
    if (await page.evaluate(() => GW.game.s.stonks) !== want) fail(tag + 'Stonks did not rise to ' + want);
    try { await page.waitForFunction(() => GW.ship.cardOpen(), null, { timeout: 12000 }); } catch (e) { fail(tag + 'no report card after the door closed'); return; }
    const rights = await page.$$eval('.ship-card .card-row.is-right', r => r.length);
    if (rights !== (shift === 1 ? orders.length : 0)) fail(tag + `report card shows ${rights} right of ${orders.length}`);
    if (shift === 2) {
      const whys = await page.$$eval('.ship-card .card-why', els => els.map(e => e.textContent));
      const exp = orders.map(o => 'No peanuts' + (o.pack === 'breakable' ? ' +2' : o.pack === 'heavy' ? ' +1' : ''));
      if (whys.join('|') !== exp.join('|')) fail(tag + `the card reads "${whys.join(' | ')}", expected "${exp.join(' | ')}"`);
    }
    const items = await page.$$eval('.ship-card .card-item', els => els.map(e => e.textContent));
    if (orders.some((o, i) => !items[i] || !items[i].startsWith(o.qty + ' × '))) fail(tag + 'a report card row does not show its count: ' + items.join(' | '));
    await page.keyboard.press('Escape');
    if (await page.evaluate(() => GW.ship.cardOpen())) fail('Escape did not close the report card');
    const fp = await faceProblem(page, [false, true]);                 // the new marks; the card popped up on its own, so only the Log glows (1q)
    if (fp) fail(tag + 'clipboard faces: ' + fp);
    if (shift === 1) await clipCheck(page, fail, orders);
    await page.waitForTimeout(1200);
    if (await page.textContent('.stonks-num') !== String(want)) fail(tag + 'the STONKS screen did not move to ' + want);
    shipped.push(orders.map(o => o.qty + ' ' + o.id).join(', '));
  }
  // Too few for any friendly number: 3 Toilet Paper (and nothing else) asks for the 2 the shelf can spare.
  await page.evaluate(() => GW.CONFIG.items.forEach(it => { GW.game.s.items[it.id] = it.id === 'tp' ? 3 : 0; }));
  c = await mid('.ship-chain'); await page.mouse.click(c.x, c.y);
  await page.waitForFunction(() => GW.ship.tripState() === 'here', null, { timeout: 8000 });
  const few = await page.evaluate(() => GW.ship.orders().map(o => o.qty + ' ' + o.item.id).join());
  if (few !== '2 tp') fail('a shelf of 3 Toilet Paper made orders "' + few + '" (expected 2 tp)');
  c = await mid('.ship-chain'); await page.mouse.click(c.x, c.y);   // send it off unpacked
  try { await page.waitForFunction(() => GW.ship.cardOpen(), null, { timeout: 12000 }); } catch (e) { fail('no report card after the small shift'); return; }
  await page.keyboard.press('Escape');
  if (await page.evaluate(() => GW.game.s.items.tp) !== 3) fail('an unpacked order took Toilet Paper off the shelf');
  // A Heavy box with peanuts and its stamp but no HEAVY sticker (1j): "No HEAVY".
  await page.evaluate(() => GW.CONFIG.items.forEach(it => { GW.game.s.items[it.id] = it.id === 'toilet' ? 40 : 0; }));
  c = await mid('.ship-chain'); await page.mouse.click(c.x, c.y);
  await page.waitForFunction(() => GW.ship.tripState() === 'here', null, { timeout: 8000 });
  await stamp(0, 'approved');
  c = await mid('.ship-conveyor'); await page.mouse.click(c.x, c.y);
  await dragTo('.ship-tile[data-item="toilet"]', '.ship-box:not(.is-stacked)');
  await page.keyboard.press('Escape');
  c = await mid('.ship-computer'); await page.mouse.click(c.x, c.y);
  await dragTo('.supply-tile[data-supply="supply:peanuts"]', '.ship-box:not(.is-stacked)');
  await page.keyboard.press('Escape');
  c = await mid('.ship-box:not(.is-stacked)'); await page.mouse.click(c.x, c.y);
  c = await mid('.ship-computer'); await page.mouse.click(c.x, c.y);
  await dragTo('.supply-tile[data-supply="stamp:gnomerica"]', '.ship-box:not(.is-stacked)');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
  if (await page.evaluate(() => GW.ship.boxState() + ':' + !GW.ship.packed()[0]) !== 'closed:true') fail('the Toilet box left the bench when stamped');
  c = await mid('.ship-chain'); await page.mouse.click(c.x, c.y);   // the closed box left on the bench ships as it is (1n)
  try { await page.waitForFunction(() => GW.ship.cardOpen(), null, { timeout: 12000 }); } catch (e) { fail('no report card after the Toilet shift'); return; }
  const heavyWhy = await page.$$eval('.ship-card .card-why', els => els.map(e => e.textContent).join('|'));
  if (heavyWhy !== 'No HEAVY') fail(`a Toilet left on the bench without its HEAVY sticker reads "${heavyWhy}", expected "No HEAVY"`);
  await page.keyboard.press('Escape');
  const notApproved = await page.evaluate(() => GW.CONFIG.shipping.score.notApproved.ours);   // the small shift went off unstamped (1m)
  const want = stonks0 + 3 * right - 3 * wrong + notApproved - wrong;
  await page.waitForTimeout(400);
  const shownLog = await openLogRow(page, 0);
  await page.keyboard.press('Escape'); await page.keyboard.press('Escape');
  const kept = await page.evaluate(() => JSON.stringify(GW.game.s.lastShift));   // after the log is opened (1p: its glow is off)
  await page.reload();
  await page.waitForTimeout(400);
  if (await page.evaluate(() => JSON.stringify(GW.game.s.lastShift)) !== kept) fail('the last shift was not saved as it was');
  await page.click('[data-view="shipping"]');
  await page.waitForTimeout(300);
  if (await openLogRow(page, 0) !== shownLog || !shownLog) fail('the log read differently after a reload');
  await page.keyboard.press('Escape'); await page.keyboard.press('Escape');
  await page.click('[data-view="machine"]');
  await page.waitForTimeout(300);
  if (await page.evaluate(() => GW.game.s.stonks + ',' + GW.game.s.stonksHistory.length) !== want + ',4') fail('Stonks were not saved');
  if (await page.evaluate(() => GW.game.s.tnpHistory.length + ',' + GW.game.s.shifts) !== '4,4') fail('the TNP history or the shift count was not saved');
  // A save from before 1l loads with TNP at 0 and its shifts counted from its history.
  await page.evaluate(() => { const k = GW.CONFIG.saveKey, o = JSON.parse(localStorage.getItem(k)); delete o.tnp; delete o.tnpHistory; delete o.shifts; delete o.lastShift;
    GW.state.save = () => false; localStorage.setItem(k, JSON.stringify(o)); location.reload(); });
  await page.waitForTimeout(600);
  if (await page.evaluate(() => GW.game.s.lastShift) !== null) fail('a pre-1o save did not load with lastShift null');
  if (await page.evaluate(() => GW.game.s.tnp + ',' + JSON.stringify(GW.game.s.tnpHistory) + ',' + GW.game.s.shifts) !== '0,[],4') fail('a pre-1l save did not load with TNP 0 and 4 shifts: ' + await page.evaluate(() => GW.game.s.tnp + ',' + JSON.stringify(GW.game.s.tnpHistory) + ',' + GW.game.s.shifts));
  // An old save with no Stonks loads at 0.
  await page.evaluate(() => { const k = GW.CONFIG.saveKey, o = JSON.parse(localStorage.getItem(k)); delete o.stonks; delete o.stonksHistory;
    GW.state.save = () => false; localStorage.setItem(k, JSON.stringify(o)); });
  await page.reload();
  await page.waitForTimeout(400);
  if (await page.evaluate(() => GW.game.s.stonks + ',' + JSON.stringify(GW.game.s.stonksHistory)) !== '0,[]') fail('an old save did not load with Stonks at 0');
  console.log(`packing: two shifts (a Breakable, a Heavy, and a Soft, then an ordinary shelf of ${SHELF} each) (${shipped.join('; ')}), then 2 tp from 3, then a Toilet with no HEAVY; Stonks ${want}`);
}

// The clipboards' faces (1p): each face's title, the card face's marks ('ok', 'x', or '' for an empty box), the log
// face's truck and ruled lines, and whether each news glow shows.  faceProblem compares them with the save's last
// shift (empty boxes before the first) and returns a problem or ''.
async function faceProblem(page, glows) {
  return page.evaluate(glows => {
    const F = GW.CONFIG.shipping.clipFace, L = GW.game.s.lastShift, q = s => document.querySelector(s);
    const shown = el => !!el && !el.hidden && getComputedStyle(el).display !== 'none' && el.getBoundingClientRect().width > 0;
    const card = q('.clip-face-card'), log = q('.clip-face-log');
    if (!shown(card) || !shown(log)) return 'a face does not show';
    const t = el => [...el.querySelectorAll('.face-title > div')].map(d => d.textContent).join(' ');
    if (t(card) !== F.card.title.join(' ') || t(log) !== F.log.title.join(' ')) return 'the titles read "' + t(card) + '" and "' + t(log) + '"';
    if (parseFloat(getComputedStyle(card.querySelector('.face-title')).fontSize) < 6) return 'the title is under 6 px';
    const marks = [...card.querySelectorAll('.face-row')].map(r => r.classList.contains('is-right') ? 'ok' : r.classList.contains('is-wrong') ? 'x' : '');
    const boxes = [...card.querySelectorAll('.face-box')].map(b => b.textContent);
    const want = [...Array(F.rows)].map((_, k) => L && L.rows[k] ? (L.rows[k].ok ? 'ok' : 'x') : '');
    if (marks.join() !== want.join()) return 'the card face shows ' + marks.join() + ', the last shift ' + want.join();
    if (boxes.join() !== want.map(m => m === 'ok' ? '\u2714' : m === 'x' ? '\u2718' : '').join()) return 'the card face\'s boxes read ' + boxes.join();
    if (!shown(log.querySelector('svg.face-truck')) || log.querySelectorAll('.face-rule').length !== F.lines) return 'the log face has no truck or not ' + F.lines + ' lines';
    const g = ['card', 'log'].map(k => shown(q('.ship-clip-glow-' + k)));
    if (glows && g.join() !== glows.join()) return 'the glows show ' + g.join() + ', expected ' + glows.join();
    return '';
  }, glows || null);
}

// The shipping log (1o): the end line a saved row's log must finish with (docs/lore/shipping-log-v0.1.md).  An
// approved fake's box (1p) always ends with its own line.
function logEndOk(L, x, tnp) {
  const last = x.log[x.log.length - 1][1], fill = t => t.split('{town}').join(x.town);
  if (tnp) return last === L.tnp.end;
  if (x.fake) return last === fill(L.fake.end);
  if (x.ok) return L.end.right.map(fill).includes(last);
  return last === fill(x.why.includes('Wrong item') ? L.end.item : x.why.includes('No stamp') ? L.end.noStamp : L.end.other);
}
// Every saved log: starts with the start line at 08:00, ends with its result's end line, has 7 to 9 lines with times
// that climb, and every middle line is a road or packing line from the config.  Returns a problem or ''.
async function logProblem(page, tnp) {
  return page.evaluate(([tnp, endSrc]) => {
    const logEndOk = eval('(' + endSrc + ')'), L = GW.CONFIG.shipping.log, S = GW.game.s.lastShift;
    if (!S) return 'no lastShift saved';
    for (const x of S.rows) {
      if (!x.log) continue;
      const f = t => t.split('{town}').join(x.town).split('{count}').join(String(x.qty)).split('{item}').join((GW.econ.itemDef(x.item) || {}).name);
      const mids = new Set((tnp ? L.tnp.road : L.road[x.region].concat(L.road.any)).concat(L.packing.map(p => f(p.text)), x.fake ? L.fake.road.map(f) : []));
      if (x.log[0][0] !== '08:00' || x.log[0][1] !== L.start) return x.town + ': does not start with the start line';
      if (!logEndOk(L, x, tnp)) return x.town + ': ends with "' + x.log[x.log.length - 1][1] + '"';
      const more = x.fake && !tnp ? 1 : 0;                                 // an approved fake's own line (1p)
      if (x.log.length < 7 + more || x.log.length > 9 + more) return x.town + ': ' + x.log.length + ' lines';
      if (x.log.some((e, k) => k && e[0] <= x.log[k - 1][0])) return x.town + ': the times do not climb';
      const bad = x.log.slice(1, -1).filter(e => !mids.has(e[1]));
      if (bad.length) return x.town + ': a line not from the config: ' + bad[0][1];
    }
    return '';
  }, [tnp, logEndOk.toString()]);
}

// After a shift (1o): the left clipboard reopens the report card (same rows, nothing scored), the right one opens the
// Shipping Log with one row per shipped box, a tap opens a box's log, and Escape steps back, then closes.
async function clipCheck(page, fail, orders) {
  const mid = async sel => { const b = await page.locator(sel).first().boundingBox(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; };
  const s0 = await page.evaluate(() => GW.game.s.stonks + ',' + GW.game.s.shifts);
  // The news glows (1p): off with instructions off, on again with them on; each stops once its clipboard opens.
  await page.evaluate(() => document.documentElement.classList.add('no-hints'));
  let fp = await faceProblem(page, [false, false]);
  if (fp) fail('instructions off: ' + fp);
  await page.evaluate(() => document.documentElement.classList.remove('no-hints'));
  let c = await mid('.ship-clip-card'); await page.mouse.click(c.x, c.y);
  if (!await page.evaluate(() => GW.ship.cardOpen())) { fail('the Report Card clipboard did not open the card'); return; }
  const towns = await page.$$eval('.ship-card .card-town', t => t.map(x => x.textContent));
  if (towns.join() !== orders.map(o => o.town).join()) fail('the reopened card reads ' + towns.join());
  await page.keyboard.press('Escape');
  if (await page.evaluate(() => GW.game.s.stonks + ',' + GW.game.s.shifts) !== s0) fail('reopening the card scored again');
  fp = await faceProblem(page, [false, true]);
  if (fp) fail('after opening the card: ' + fp);
  c = await mid('.ship-clip-log'); await page.mouse.click(c.x, c.y);
  if (await page.evaluate(() => GW.ship.logMode()) !== 'list') { fail('the Log clipboard did not open the Shipping Log'); return; }
  const rows = await page.$$eval('.ship-log .log-row .log-town', t => t.map(x => x.textContent));
  if (rows.join() !== orders.map(o => o.town).join()) fail('the Shipping Log lists ' + rows.join());
  c = await mid('.ship-log .log-row'); await page.mouse.click(c.x, c.y);
  if (await page.evaluate(() => GW.ship.logMode()) !== 0) fail('a tap on a row did not open its log');
  const lines = await page.$$eval('.ship-log .log-entry', e => e.map(x => x.textContent));
  const saved = await page.evaluate(() => GW.game.s.lastShift.rows[0].log.map(e => e[0] + e[1]));
  if (lines.join('|') !== saved.join('|')) fail('the box\'s page does not show its saved log');
  const p = await logProblem(page, false);
  if (p) fail('log: ' + p);
  await page.keyboard.press('Escape');
  if (await page.evaluate(() => GW.ship.logMode()) !== 'list') fail('Escape did not step back to the list');
  c = await mid('.ship-log .log-row'); await page.mouse.click(c.x, c.y);
  const v = await page.locator('.ship-log-view').boundingBox();
  await page.mouse.click(v.x + 6, v.y + 6);                             // a tap anywhere on the room steps back too
  if (await page.evaluate(() => GW.ship.logMode()) !== 'list') fail('a tap did not step back to the list');
  await page.keyboard.press('Escape');
  if (await page.evaluate(() => GW.ship.logMode()) !== null) fail('Escape did not close the Shipping Log');
  fp = await faceProblem(page, [false, false]);
  if (fp) fail('after opening both: ' + fp);
  const kept = await page.evaluate(() => JSON.stringify(GW.game.s.lastShift.unread));
  if (kept !== '{"card":false,"log":false}') fail('the save does not remember both clipboards opened: ' + kept);
}
// Opens the Shipping Log from its clipboard and row k's log; returns the page's lines ('' if it did not open).
async function openLogRow(page, k) {
  const mid = async loc => { const b = await loc.boundingBox(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; };
  let c = await mid(page.locator('.ship-clip-log')); await page.mouse.click(c.x, c.y);
  if (!await page.$('.ship-log .log-row')) return '';
  c = await mid(page.locator('.ship-log .log-row').nth(k)); await page.mouse.click(c.x, c.y);
  return (await page.$$eval('.ship-log .log-entry', e => e.map(x => x.textContent))).join('|');
}

// Drags the box on the bench onto the driver with the mouse and lets go (1n).
async function handToDriver(page) {
  const a = await page.locator('.ship-box:not(.is-stacked)').boundingBox(), d = await page.locator('.ship-driver img').boundingBox();
  const x0 = a.x + a.width / 2, y0 = a.y + a.height / 2, x1 = d.x + d.width / 2, y1 = d.y + d.height * 0.45;
  await page.mouse.move(x0, y0); await page.mouse.down();
  for (let i = 1; i <= 10; i++) await page.mouse.move(x0 + (x1 - x0) * i / 10, y0 + (y1 - y0) * i / 10);
  await page.mouse.up();
}

// Opens order i's slip full size, taps its APPROVED or DENIED button, and closes the slip (1l).
async function stampSlip(page, i, v) {
  const slip = page.locator('.ship-board .ship-slip').nth(i), b = await slip.boundingBox();
  await page.mouse.click(b.x + b.width / 2, b.y + b.height / 2);
  const btn = await page.locator(`.ship-slip-view .slip-stamp-btn[data-verdict="${v}"]`).boundingBox();
  await page.mouse.click(btn.x + btn.width / 2, btn.y + btn.height / 2);
  await page.waitForTimeout(350);                                        // the stamp lands
  await page.keyboard.press('Escape');
}

// Glitter fakes and TNP's line (1l): before shift 4 no fakes come even at a 100% chance; from shift 4 a forced fake
// board has exactly one glitter slip (glitter on the board and full size).  DENIED: "Caught a fake!" (ours +5, TNP
// -5); APPROVED: "Approved a fake" (TNP +10), with the real orders DENIED reading "Denied a real order"; a one-order
// board with its fake DENIED is perfect (TNP -5 more); left unstamped, "Missed a fake" (TNP +5).  The STONKS screen
// then shows both lines and both numbers.
async function fakeCheck(page, errors) {
  const fail = m => errors.push('fakes: ' + m);
  const mid = async sel => { const b = await page.locator(sel).first().boundingBox(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; };
  const s = () => page.evaluate(() => ({ stonks: GW.game.s.stonks, tnp: GW.game.s.tnp, shifts: GW.game.s.shifts }));
  const trip = async (shelf) => {
    await page.evaluate(n => GW.CONFIG.items.forEach(it => { GW.game.s.items[it.id] = n === 'socks' ? (it.id === 'socks' ? 40 : 0) : it.group === 'monsters' ? 0 : 40; }), shelf);
    const c = await mid('.ship-chain'); await page.mouse.click(c.x, c.y);
    await page.waitForFunction(() => GW.ship.tripState() === 'here', null, { timeout: 8000 });
    return page.evaluate(() => GW.ship.fakes());
  };
  const ship = async (tag) => {
    const c = await mid('.ship-chain'); await page.mouse.click(c.x, c.y);
    try { await page.waitForFunction(() => GW.ship.cardOpen(), null, { timeout: 12000 }); } catch (e) { fail(tag + ': no report card'); return null; }
    const card = await page.evaluate(() => ({ rows: [...document.querySelectorAll('.ship-card .card-row')].map(r => (r.classList.contains('is-right') ? 'ok:' : 'x:') + ((r.querySelector('.card-why') || {}).textContent || '')),
      total: document.querySelector('.ship-card .card-total').textContent }));
    await page.keyboard.press('Escape');
    return card;
  };
  await page.goto(URL + '?debug=1&ship=1');
  await page.waitForTimeout(400);
  await page.click('[data-view="shipping"]');
  await page.waitForTimeout(300);
  await page.evaluate(() => { GW.CONFIG.shipping.fakes.chance = 1; GW.CONFIG.shipping.fakes.elfChance = 0; GW.game.s.shifts = 1; GW.game.s.tnp = 20; });
  let f = await trip('all');
  if (f.some(x => x)) fail('a glitter fake came before shift 4');
  await ship('shift 2');
  await page.evaluate(() => { GW.game.s.shifts = 3; });
  // A: the fake DENIED, the real orders left unstamped.
  let s0 = await s();
  f = await trip('all');
  const k = f.indexOf(true);
  if (f.filter(x => x).length !== 1) { fail(`a forced board has ${f.filter(x => x).length} fakes (expected 1)`); return; }
  if (!await page.$(`.ship-board .ship-slip:nth-child(${k + 1}).is-fake .slip-glitter .glitter-star`)) fail('the fake has no glitter on the board');
  if (await page.$$eval('.ship-board .slip-glitter', g => g.length) !== 1) fail('glitter on a real slip');
  const slip = page.locator('.ship-board .ship-slip').nth(k), b = await slip.boundingBox();
  await page.mouse.click(b.x + b.width / 2, b.y + b.height / 2);
  if (!await page.$('.ship-slip-view .ship-slip.is-fake .slip-glitter .glitter-star')) fail('the open fake has no glitter');
  await page.keyboard.press('Escape');
  await stampSlip(page, k, 'denied');
  let card = await ship('A');
  let s1 = await s();
  if (card && card.rows[k] !== 'ok:Caught a fake!') fail(`a DENIED fake reads "${card.rows[k]}"`);
  if (card && card.rows.filter((r, i) => i !== k).some(r => r !== 'x:Not approved')) fail('unstamped real orders read ' + card.rows.join(' | '));
  const naPts = await page.evaluate(() => GW.CONFIG.shipping.score.notApproved.ours);
  if (s1.tnp !== s0.tnp - 5 || s1.stonks !== Math.max(0, s0.stonks + 5 + 2 * naPts) || s1.shifts !== s0.shifts + 1) fail(`caught: ${JSON.stringify(s0)} -> ${JSON.stringify(s1)}`);
  if (card && !card.total.includes('TNP: \u22125')) fail(`the card's bottom line reads "${card.total}"`);
  // B: the fake APPROVED, the real orders DENIED.
  f = await trip('all');
  const k2 = f.indexOf(true);
  for (let i = 0; i < f.length; i++) await stampSlip(page, i, i === k2 ? 'approved' : 'denied');
  if (await page.evaluate(() => GW.ship.activeOrder()) !== k2) fail('the APPROVED fake did not get the box');
  // Packed and handed over (1p), so it ships on GRIP's truck with its own log.
  const fid = await page.evaluate(k => GW.ship.orders()[k].item.id, k2);
  let fc = await mid('.ship-conveyor'); await page.mouse.click(fc.x, fc.y);
  await page.locator(`.ship-menu-items .ship-tile[data-item="${fid}"]`).scrollIntoViewIfNeeded();
  const fa = await mid(`.ship-menu-items .ship-tile[data-item="${fid}"]`), fb = await mid('.ship-box:not(.is-stacked)');
  await page.mouse.move(fa.x, fa.y); await page.mouse.down();
  for (let i = 1; i <= 8; i++) await page.mouse.move(fa.x + (fb.x - fa.x) * i / 8, fa.y + (fb.y - fa.y) * i / 8);
  await page.mouse.up();
  await page.keyboard.press('Escape');
  fc = await mid('.ship-box:not(.is-stacked)'); await page.mouse.click(fc.x, fc.y);
  await handToDriver(page);
  await page.waitForTimeout(900);
  if (!await page.evaluate(k => !!GW.ship.packed()[k], k2)) fail('the APPROVED fake\'s box was not handed over');
  card = await ship('B');
  const s2 = await s();
  if (card && card.rows[k2] !== 'x:Approved a fake') fail(`an APPROVED fake reads "${card.rows[k2]}"`);
  if (card && card.rows.filter((r, i) => i !== k2).some(r => r !== 'x:Denied a real order')) fail('DENIED real orders read ' + card.rows.join(' | '));
  if (s2.tnp !== s1.tnp + 10) fail(`approved a fake: TNP ${s1.tnp} -> ${s2.tnp}`);
  // An approved fake's log (1p, lore v0.2): GRIP's lines, one of its own lines in the middle, and its own end.
  const fx = await page.evaluate(k => GW.game.s.lastShift.rows[k], k2), FL = await page.evaluate(() => GW.CONFIG.shipping.log);
  if (!fx || !fx.log || !fx.fake) fail('the approved fake\'s box has no log');
  else {
    const fill = t => t.split('{town}').join(fx.town), own = fx.log.map(e => e[1]).map((l, k) => FL.fake.road.map(fill).includes(l) ? k : -1).filter(k => k >= 0);
    if (fx.log[fx.log.length - 1][1] !== fill(FL.fake.end)) fail('the approved fake\'s log ends with "' + fx.log[fx.log.length - 1][1] + '"');
    if (own.length !== 1 || own[0] === 0 || own[0] === fx.log.length - 1) fail('the approved fake\'s log has its own line at ' + own.join());
    const lp = await logProblem(page, false);
    if (lp) fail('log: ' + lp);
  }
  // C: one order, a fake, DENIED: a perfect shift.
  f = await trip('socks');
  if (f.join() !== 'true') { fail('the one-order board is ' + f.join()); return; }
  await stampSlip(page, 0, 'denied');
  card = await ship('C');
  const s3 = await s();
  if (card && card.rows.join() !== 'ok:Caught a fake!') fail('the perfect fake shift reads ' + card.rows.join());
  if (s3.tnp !== s2.tnp - 10) fail(`a perfect shift with a caught fake: TNP ${s2.tnp} -> ${s3.tnp} (expected -10)`);
  // D: one fake left unstamped.
  await trip('socks');
  card = await ship('D');
  const s4 = await s();
  if (card && card.rows.join() !== 'x:Missed a fake') fail('an unstamped fake reads ' + card.rows.join());
  if (s4.tnp !== s3.tnp + 5) fail(`missed a fake: TNP ${s3.tnp} -> ${s4.tnp}`);
  await page.waitForTimeout(1200);
  const screen = await page.evaluate(() => ({ nums: [...document.querySelectorAll('.stonks-num')].map(n => n.textContent), lines: [...document.querySelectorAll('.stonks-chart polyline')].map(l => l.getAttribute('points').split(' ').length) }));
  if (screen.nums.join() !== s4.stonks + ',' + s4.tnp || screen.lines.length !== 2 || screen.lines.some(n => n < 2)) fail('the STONKS screen shows ' + JSON.stringify(screen));
  console.log(`fakes: none before shift 4; caught, approved, perfect caught, and missed all scored; TNP ${s0.tnp} -> ${s1.tnp} -> ${s2.tnp} -> ${s3.tnp} -> ${s4.tnp}`);
}

// TNP trips (1m), run in both layouts: with every trip forced TNP from shift 4, the first is the elf in his fake truck
// with no glitter (at a 100% glitter chance); sent away with nothing handed over, TNP drops by sentAway and the card is the one "sent packing"
// row.  The second is TNP too: one packed box handed over moves ours down and TNP up per box, the elf goes happy, and
// that row reads "Shipped to TNP" (the rest "Kept from TNP").  The third must be GRIP's (no more than 2 in a row):
// sent away with nothing stamped, every row reads "Not approved" at notApproved each.  Then 60 rolls at a 100%
// chance never give 3 TNP trips in a row, and none come before shift 4.
async function elfCheck(page, errors, name) {
  const fail = m => errors.push(`elves (${name}): ` + m);
  const mid = async (sel, n = 0) => { const b = await page.locator(sel).nth(n).boundingBox(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; };
  const s = () => page.evaluate(() => ({ stonks: GW.game.s.stonks, tnp: GW.game.s.tnp }));
  const Sc = await page.evaluate(() => GW.CONFIG.shipping.score);
  const pull = async () => { const c = await mid('.ship-chain'); await page.mouse.click(c.x, c.y); };
  const arrive = async () => { await pull(); await page.waitForFunction(() => GW.ship.tripState() === 'here', null, { timeout: 8000 }); };
  const ship = async (tag) => {
    await pull();
    try { await page.waitForFunction(() => GW.ship.cardOpen(), null, { timeout: 12000 }); } catch (e) { fail(tag + ': no report card'); return null; }
    const card = await page.evaluate(() => [...document.querySelectorAll('.ship-card .card-row')].map(r => (r.classList.contains('is-right') ? 'ok:' : 'x:') +
      ((r.querySelector('.card-why') || r.querySelector('.card-note') || {}).textContent || '')));
    await page.keyboard.press('Escape');
    return card;
  };
  await page.goto(URL + '?ship=1');                 // no debug bar: on a phone it covers the conveyor
  await page.waitForTimeout(400);
  await page.click('[data-view="shipping"]');
  await page.waitForTimeout(300);
  await page.evaluate(() => { const g = GW.game.s, F = GW.CONFIG.shipping.fakes; F.chance = 1; F.elfChance = 1; g.shifts = 3; g.tnpRow = 0; g.stonks = 40; g.tnp = 40;
    GW.CONFIG.items.forEach(it => { g.items[it.id] = it.group === 'monsters' ? 0 : 400; }); });
  // 1: sent packing.
  let s0 = await s();
  await arrive();
  const look = await page.evaluate(() => ({ tnp: GW.ship.tnpTrip(), truck: document.querySelector('.ship-truck').getAttribute('src'), driver: document.querySelector('.ship-driver img').getAttribute('src'),
    glitter: document.querySelectorAll('.ship-board .slip-glitter').length, P: GW.CONFIG.shipping.tnp }));
  if (!look.tnp) { fail('a forced TNP trip did not come'); return; }
  if (look.truck !== look.P.truck.img || look.driver !== look.P.driver.img) fail(`the TNP trip shows ${look.truck} and ${look.driver}`);
  if (look.glitter) fail('an elf\'s slip has glitter');
  let card = await ship('sent away');
  let s1 = await s();
  if (card && card.join() !== 'ok:' + Sc.sentPacking) fail('the sent-away card reads ' + card.join(' | '));
  if (s1.tnp !== s0.tnp + Sc.elf.sentAway.tnp || s1.stonks !== s0.stonks + Sc.elf.sentAway.ours) fail(`sent away: ${JSON.stringify(s0)} -> ${JSON.stringify(s1)}`);
  const fp = await faceProblem(page, [false, true]);                    // the faces in this layout (1p): one ✔, two empty; only the Log glows (1q)
  if (fp) fail('clipboard faces: ' + fp);
  // 2: one box handed to the elf.
  await arrive();
  if (!await page.evaluate(() => GW.ship.tnpTrip())) fail('the second forced trip was not TNP');
  await stampSlip(page, 0, 'approved');
  const id = await page.evaluate(() => GW.ship.orders()[0].item.id), n0 = await page.evaluate(i => GW.game.s.items[i], id), qty = await page.evaluate(() => GW.ship.orders()[0].qty);
  let c = await mid('.ship-conveyor'); await page.mouse.click(c.x, c.y);
  await page.locator(`.ship-menu-items .ship-tile[data-item="${id}"]`).scrollIntoViewIfNeeded();
  const a = await mid(`.ship-menu-items .ship-tile[data-item="${id}"]`), b = await mid('.ship-box:not(.is-stacked)');
  await page.mouse.move(a.x, a.y); await page.mouse.down();
  for (let i = 1; i <= 8; i++) await page.mouse.move(a.x + (b.x - a.x) * i / 8, a.y + (b.y - a.y) * i / 8);
  await page.mouse.up();
  await page.keyboard.press('Escape');
  c = await mid('.ship-box:not(.is-stacked)'); await page.mouse.click(c.x, c.y);
  if (await page.evaluate(() => GW.ship.boxState()) !== 'closed') fail('the elf\'s box did not close');
  await pull();
  await page.waitForTimeout(250);
  if (!await page.evaluate(h => document.querySelector('.ship-driver img').getAttribute('src') === h, look.P.driver.happy.img)) fail('the elf did not go happy');
  try { await page.waitForFunction(() => GW.ship.cardOpen(), null, { timeout: 12000 }); } catch (e) { fail('no card after filling'); return; }
  card = await page.evaluate(() => [...document.querySelectorAll('.ship-card .card-row')].map(r => (r.classList.contains('is-right') ? 'ok:' : 'x:') + ((r.querySelector('.card-why') || {}).textContent || '')));
  await page.keyboard.press('Escape');
  const s2 = await s();
  if (card[0] !== 'x:' + Sc.reasons.shippedTnp || card.slice(1).some(r => r !== 'ok:' + Sc.kept)) fail('the filled card reads ' + card.join(' | '));
  if (s2.stonks !== s1.stonks + Sc.elf.shipped.ours || s2.tnp !== s1.tnp + Sc.elf.shipped.tnp) fail(`filled: ${JSON.stringify(s1)} -> ${JSON.stringify(s2)}`);
  if (await page.evaluate(i => GW.game.s.items[i], id) !== n0 - qty) fail('the shelf did not drop for the box shipped to TNP');
  // The elf's box has a TNP log (1o): only it has one (the kept orders have none), built from TNP's lines.
  const tnpLogs = await page.evaluate(() => GW.game.s.lastShift.rows.map(x => !!x.log).join());
  if (tnpLogs !== ['true'].concat(card.slice(1).map(() => 'false')).join()) fail('the TNP shift\'s logs: ' + tnpLogs);
  const tp = await logProblem(page, true);
  if (tp) fail('TNP log: ' + tp);
  if (name === 'desktop' || name === 'phone') {
    const lines = await openLogRow(page, 0);
    if (!lines.endsWith(await page.evaluate(() => GW.CONFIG.shipping.log.tnp.end))) fail('the TNP box\'s page does not end with the North Pole: ' + lines);
    if (process.env.SHOTS) await page.screenshot({ path: path.join(OUT, `1o-${name === 'desktop' ? 'wide' : 'tall'}-day-log-tnp.png`) });
    await page.keyboard.press('Escape'); await page.keyboard.press('Escape');
    if (await page.evaluate(() => GW.ship.logMode()) !== null) fail('the TNP log did not close');
  }
  // 3: GRIP's, sent away unstamped (glitter off again: the elf's boards had none at a 100% chance).
  await page.evaluate(() => { GW.CONFIG.shipping.fakes.chance = 0; });
  await arrive();
  if (await page.evaluate(() => GW.ship.tnpTrip())) fail('a third TNP trip in a row');
  const nOrders = await page.evaluate(() => GW.ship.orders().length);
  card = await ship('unstamped GRIP');
  const s3 = await s();
  if (card && (card.length !== nOrders || card.some(r => r !== 'x:' + Sc.reasons.notApproved))) fail('the unstamped GRIP board reads ' + (card || []).join(' | '));
  if (s3.stonks !== s2.stonks + nOrders * Sc.notApproved.ours || s3.tnp !== s2.tnp) fail(`not approved: ${JSON.stringify(s2)} -> ${JSON.stringify(s3)}`);
  // Many rolls.
  const rolls = await page.evaluate(() => { const g = GW.game.s, out = []; g.tnpRow = 0; for (let i = 0; i < 60; i++) out.push(GW.ship.testRoll() ? 'T' : 'G');
    GW.CONFIG.shipping.fakes.elfChance = 0.5; for (let i = 0; i < 200; i++) out.push(GW.ship.testRoll() ? 'T' : 'G');
    g.shifts = 0; GW.CONFIG.shipping.fakes.elfChance = 1; const early = GW.ship.testRoll(); g.tnpRow = 0; return { seq: out.join(''), early }; });
  if (/TTT/.test(rolls.seq)) fail('3 TNP trips in a row: ' + rolls.seq);
  if (!/TT/.test(rolls.seq)) fail('never 2 TNP trips in a row at a 100% chance');
  if (rolls.early) fail('a TNP trip before shift 4');
  console.log(`elves (${name}): sent packing (TNP ${s0.tnp} -> ${s1.tnp}), filled (ours ${s1.stonks} -> ${s2.stonks}, TNP ${s1.tnp} -> ${s2.tnp}), then GRIP Not approved x${nOrders}; 260 rolls, never 3 in a row`);
}

// Leaving mid-trip (1f): a view button shows the warning; Stay keeps the trip; Send it off scores the shift, shows
// the card, and lands on the tapped view once the card closes.  Leaving after the chain is pulled waits for the card.
// The polish (1k): after a reload the "Packing rules" chart starts minimized, its bar opens it with a code-drawn
// chevron (no text), and the choice is kept; the door rolls up before the truck comes in and the trip completes.
async function polishCheck(page, errors) {
  const fail = m => errors.push('polish: ' + m);
  const mid = async sel => { const b = await page.locator(sel).first().boundingBox(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; };
  const isMin = () => page.evaluate(() => document.querySelector('.ship-menu-supplies .ship-rules').classList.contains('is-min'));
  const openRoom = async () => {
    await page.reload(); await page.waitForTimeout(400);
    await page.click('[data-view="shipping"]'); await page.waitForTimeout(300);
    await page.evaluate(() => { GW.CONFIG.shipping.fakes.elfChance = 0; GW.CONFIG.items.forEach(it => { GW.game.s.items[it.id] = it.group === 'monsters' ? 0 : 40; }); });
  };
  await openRoom();
  let c = await mid('.ship-chain'); await page.mouse.click(c.x, c.y);
  await page.waitForTimeout(150);
  const rolling = await page.evaluate(() => { const d = document.querySelector('.ship-door'); return !d.hidden && d.getAnimations().length > 0 && getComputedStyle(document.querySelector('.ship-truck')).visibility === 'hidden'; });
  if (!rolling) fail('the door did not roll up ahead of the truck');
  try { await page.waitForFunction(() => GW.ship.tripState() === 'here', null, { timeout: 8000 }); } catch (e) { fail('the trip did not arrive with the rolling door'); return; }
  if (await page.evaluate(() => !document.querySelector('.ship-door').hidden)) fail('the rolled-up door still shows');
  c = await mid('.ship-computer'); await page.mouse.click(c.x, c.y);
  if (!await isMin()) fail('the chart was not minimized after a reload');
  if (await page.evaluate(() => { const b = document.querySelector('.ship-rules-head'); return !b.querySelector('svg.ship-rules-chev') || b.textContent.trim() !== GW.CONFIG.shipping.pack.chart.title; })) fail('the chart bar is not its title and a drawn chevron');
  c = await mid('.ship-rules-head'); await page.mouse.click(c.x, c.y);
  if (await isMin() || await page.evaluate(() => document.querySelector('.ship-rules-head').getAttribute('aria-expanded')) !== 'true') fail('a tap on the bar did not open the chart');
  await page.keyboard.press('Escape');
  c = await mid('.ship-chain'); await page.mouse.click(c.x, c.y);    // send him off unpacked: the door rolls down after the truck
  try { await page.waitForFunction(() => GW.ship.cardOpen(), null, { timeout: 12000 }); } catch (e) { fail('no report card after the door rolled down'); return; }
  if (await page.evaluate(() => GW.ship.isOpen() || !document.querySelector('.ship-door').hidden)) fail('the door did not end closed');
  await page.keyboard.press('Escape');
  await openRoom();
  c = await mid('.ship-chain'); await page.mouse.click(c.x, c.y);
  await page.waitForFunction(() => GW.ship.tripState() === 'here', null, { timeout: 8000 });
  c = await mid('.ship-computer'); await page.mouse.click(c.x, c.y);
  if (await isMin()) fail('the player\'s choice to open the chart was not kept');
  c = await mid('.ship-rules-head'); await page.mouse.click(c.x, c.y);   // leave it minimized
  console.log('polish: the chart (open first, minimized after a reload, kept when opened) and the rolling door ok');
}

async function leaveCheck(page, errors) {
  const fail = m => errors.push('leaving: ' + m);
  const mid = async sel => { const b = await page.locator(sel).first().boundingBox(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; };
  const open = async () => { const c = await mid('.ship-chain'); await page.mouse.click(c.x, c.y);
    await page.waitForFunction(() => GW.ship.tripState() === 'here', null, { timeout: 8000 }); };
  await page.goto(URL + '?debug=1&ship=1');
  await page.waitForTimeout(400);
  await page.click('[data-view="shipping"]');
  await page.waitForTimeout(300);
  await page.evaluate(() => { GW.CONFIG.shipping.fakes.elfChance = 0; GW.CONFIG.items.forEach(it => { GW.game.s.items[it.id] = 5000; }); });
  await page.click('[data-view="floor"]');
  if (await page.evaluate(() => GW.ship.warnOpen() || GW.game.s.view !== 'floor')) fail('leaving with the door closed warned or did not leave');
  await page.click('[data-view="shipping"]');
  await page.waitForTimeout(300);
  await page.evaluate(() => { GW.CONFIG.shipping.fakes.elfChance = 0; GW.CONFIG.items.forEach(it => { GW.game.s.items[it.id] = 5000; }); });
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
  if (wrong !== JSON.parse(orders).length) fail(`the card shows ${wrong} misses (expected every order Not approved)`);
  if (await page.evaluate(() => GW.game.s.view) !== 'shipping') fail('the view switched before the card closed');
  await page.keyboard.press('Escape');
  if (await page.evaluate(() => GW.game.s.view) !== 'floor') fail('did not land on the Shop Floor after the card');
  // After the pull: no warning, the trip finishes, the card shows, then the view switches.
  await page.click('[data-view="shipping"]');
  await page.waitForTimeout(300);
  await page.evaluate(() => { GW.CONFIG.shipping.fakes.elfChance = 0; GW.CONFIG.items.forEach(it => { GW.game.s.items[it.id] = 5000; }); });
  await open();
  const c = await mid('.ship-chain'); await page.mouse.click(c.x, c.y);
  await page.click('[data-view="machine"]');
  if (await page.evaluate(() => GW.ship.warnOpen() || GW.game.s.view !== 'shipping')) fail('leaving after the pull warned or skipped the card');
  try { await page.waitForFunction(() => GW.ship.cardOpen(), null, { timeout: 12000 }); } catch (e) { fail('no report card when leaving after the pull'); return; }
  await page.mouse.click(c.x, c.y);    // any tap closes the card
  if (await page.evaluate(() => GW.game.s.view) !== 'machine') fail('did not land on the Machine after the card');
  console.log('leaving: warning, Stay, Escape, Send it off, and leaving after the pull all ok');
}

// The tutorial (1q), on both layouts, from a fresh save: each page shows at its moment and only once, fits the screen
// with its picture, and only a real tap or Enter on "Got it!" closes it (a script's click, a tap on the room, Escape,
// and a tap in the first armMs do nothing, and the room under it hears nothing).  Pages due together queue (stamp,
// then fakes, on a save at the fakes shift).  An older save skips the pages it has lived through; ?tutorial=reset
// brings them back.  The How to Ship bookshelf (1q.1) shows on the wall with no words, answers taps, and opens the
// book with only the seen pages, with back and next.  It glows from the first page seen until the book is first
// opened (saved), and not with instructions off.  Day shows the day shelf and Night the painted night shelf, with no
// brightness filter (1q.2).  A good shift shows its line and counts; a shift with an approved
// glitter fake and every real order right does not (1q.1); a TNP trip does not either.  After a shift only the Log clipboard glows (the card that
// popped up on its own counts as opened), and the card's clipboard does not glow while that card is on its way.
async function tutorialCheck(page, errors, name) {
  const fail = m => errors.push(`tutorial (${name}): ` + m);
  const mid = async sel => { const b = await page.locator(sel).first().boundingBox(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; };
  const tap = async sel => { const c = await mid(sel); await page.mouse.click(c.x, c.y); };
  const cur = () => page.evaluate(() => GW.tutorial.current());
  const seen = () => page.evaluate(() => GW.tutorial.seenList().join());
  const arm = () => page.waitForTimeout(450);                          // past the page's armMs
  const got = async () => { await arm(); await tap('.tut-got'); await page.waitForTimeout(100); };
  const shelf = (only) => page.evaluate(o => GW.CONFIG.items.forEach(it => { GW.game.s.items[it.id] = o ? (o.split(',').includes(it.id) ? 40 : 0) : it.group === 'monsters' ? 0 : 40; }), only || null);
  const arrive = async () => { await tap('.ship-chain'); await page.waitForFunction(() => GW.ship.tripState() === 'here', null, { timeout: 10000 }); };
  const ship = async () => { await tap('.ship-chain'); await page.waitForFunction(() => GW.ship.cardOpen(), null, { timeout: 15000 }); };
  const setSave = (edit) => page.evaluate(src => { const k = GW.CONFIG.saveKey, o = JSON.parse(localStorage.getItem(k)); eval(src)(o);
    GW.state.save = () => false; localStorage.setItem(k, JSON.stringify(o)); }, edit.toString());
  // A fresh save.
  await page.evaluate(() => { GW.state.save = () => false; localStorage.clear(); });
  await page.goto(URL + '?ship=1');
  await page.waitForTimeout(500);
  if (await seen() !== '') fail('a fresh save has seen pages: ' + await seen());
  await page.evaluate(() => { const F = GW.CONFIG.shipping.fakes; F.chance = 0; F.elfChance = 0; });
  await page.click('[data-view="shipping"]');
  await page.waitForTimeout(300);
  if (await cur() !== 'welcome') { fail('the welcome page did not show on entering the Shipping view (' + await cur() + ')'); return; }
  // The bookshelf (1q.1): the painted shelf, no words, its screen reader name, inside the room; no glow before a page is seen.
  const sh = await page.evaluate(() => { const b = document.querySelector('.ship-book'), i = b.querySelector('img'), r = b.getBoundingClientRect(), R = document.getElementById('ship').getBoundingClientRect();
    return { art: !!i && i.complete && i.naturalWidth > 0 && i.getAttribute('src') === GW.CONFIG.shipping.tutorial.book.img, words: b.textContent.trim(), spans: b.querySelectorAll('span').length,
      label: b.getAttribute('aria-label'), inRoom: r.left >= R.left && r.top >= R.top && r.right <= R.right && r.bottom <= R.bottom && r.width > 20 && r.height > 10, glow: GW.ship.bookGlow() }; });
  if (!sh.art || sh.words || sh.spans || sh.label !== 'How to Ship' || !sh.inRoom) fail('the bookshelf: ' + JSON.stringify(sh));
  if (sh.glow) fail('the bookshelf glowed before any page was seen');
  // Day and Night (1q.2): Day shows the day shelf, Night Nathan's painted night shelf with no brightness filter on it.
  const dn = await page.evaluate(async () => { const was = GW.theme.setting(), out = {};
    for (const t of ['day', 'night']) { GW.theme.set(t); const b = document.querySelector('.ship-book'), i = b.querySelector('img');
      if (!i.complete) await new Promise(r => { i.onload = i.onerror = r; });
      out[t] = { src: i.getAttribute('src'), ok: i.naturalWidth > 0, night: document.documentElement.classList.contains('night'),
        filter: getComputedStyle(b).filter + ' / ' + getComputedStyle(i).filter }; }
    GW.theme.set(was); return out; });
  if (dn.day.src !== 'assets/packing/how_to_ship_shelf.webp' || !dn.day.ok || dn.day.night) fail('the Day bookshelf: ' + JSON.stringify(dn.day));
  if (dn.night.src !== 'assets/packing/how_to_ship_shelf_night.webp' || !dn.night.ok || !dn.night.night) fail('the Night bookshelf: ' + JSON.stringify(dn.night));
  if (dn.night.filter !== 'none / none') fail('the Night bookshelf has a filter on it: ' + dn.night.filter);
  const fit = await page.evaluate(() => { const r = document.querySelector('.tut-page').getBoundingClientRect(), p = document.querySelector('.tut-pic');
    return { ok: r.top >= 0 && r.left >= 0 && r.bottom <= innerHeight && r.right <= innerWidth, pic: p.complete && p.naturalWidth > 0, h: Math.round(r.height) }; });
  if (!fit.ok) fail(`the page does not fit the screen (${fit.h} px tall)`);
  if (!fit.pic) fail('the welcome page\'s picture did not load');
  // Only a real tap or Enter, after armMs, closes it.
  await page.waitForTimeout(450);
  await page.evaluate(() => { const b = document.querySelector('.tut-got'); b.click(); b.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })); });
  if (await cur() !== 'welcome') fail('a script\'s click closed the page');
  await tap('.ship-chain');
  await page.keyboard.press('Escape');
  if (await cur() !== 'welcome') fail('a tap on the room or Escape closed the page');
  if (await page.evaluate(() => GW.ship.tripState()) !== 'closed') fail('the room heard a tap under the page');
  await got();
  if (await cur() !== null || await seen() !== 'welcome') fail('Got it! did not close the welcome page: ' + await cur() + ' / ' + await seen());
  if (!await page.evaluate(() => GW.ship.bookGlow())) fail('the bookshelf did not glow once the book had its first page');
  // A tip: no glow with instructions off.
  if (await page.evaluate(() => { document.documentElement.classList.add('no-hints'); const f = getComputedStyle(document.querySelector('.ship-book-art')).filter;
    document.documentElement.classList.remove('no-hints'); return f; }) !== 'none') fail('the bookshelf glowed with instructions off');
  await page.click('[data-view="machine"]'); await page.click('[data-view="shipping"]'); await page.waitForTimeout(200);
  if (await cur() !== null) fail('the welcome page showed twice');
  // The first orders: the stamp page (fakes not yet: shift 1).  A tap in its first moment does nothing; Enter closes it.
  await shelf();
  await arrive();
  if (await cur() !== 'stamp') fail('the stamp page did not show with the first orders (' + await cur() + ')');
  await tap('.tut-got');
  if (await cur() !== 'stamp') fail('a tap in the page\'s first moment closed it');
  await arm(); await page.keyboard.press('Enter'); await page.waitForTimeout(100);
  if (await cur() !== null) fail('Enter did not close the stamp page');
  // The first box on the bench: the pack page.  The first box closed: the hand page.
  await stampSlip(page, 0, 'approved');
  if (await cur() !== 'pack') fail('the pack page did not show with the first box (' + await cur() + ')');
  await got();
  await page.keyboard.press('Escape');                                   // stampSlip's Escape was the page's to swallow
  const item = await page.evaluate(() => GW.ship.orders()[0].item.id);
  await tap('.ship-conveyor');
  await page.locator(`.ship-menu-items .ship-tile[data-item="${item}"]`).scrollIntoViewIfNeeded();
  { const a = await mid(`.ship-menu-items .ship-tile[data-item="${item}"]`), b = await mid('.ship-box:not(.is-stacked)');
    await page.mouse.move(a.x, a.y); await page.mouse.down();
    for (let i = 1; i <= 8; i++) await page.mouse.move(a.x + (b.x - a.x) * i / 8, a.y + (b.y - a.y) * i / 8);
    await page.mouse.up(); }
  await page.keyboard.press('Escape');
  if (await cur() !== null) fail('a page showed before the box was closed: ' + await cur());
  await tap('.ship-box:not(.is-stacked)');
  if (await cur() !== 'hand') fail('the hand page did not show when the box closed (' + await cur() + ')');
  await got();
  if (await seen() !== 'welcome,stamp,pack,hand') fail('seen after the first shift\'s pages: ' + await seen());
  // The shift (not good: two orders left unstamped): only the Log glows after it, and the card's clipboard never
  // glows while its card is on the way.
  await tap('.ship-chain');
  await page.waitForTimeout(200);
  if (await page.evaluate(() => GW.ship.clipGlow('card'))) fail('the card clipboard glowed while its card was on the way');
  await page.waitForFunction(() => GW.ship.cardOpen(), null, { timeout: 15000 });
  await page.keyboard.press('Escape');
  if (await page.evaluate(() => GW.ship.clipGlow('card') + ',' + GW.ship.clipGlow('log') + ',' + JSON.stringify(GW.game.s.lastShift.unread)) !== 'false,true,{"card":false,"log":true}')
    fail('after a shift the glows are ' + await page.evaluate(() => GW.ship.clipGlow('card') + ',' + GW.ship.clipGlow('log')));
  if (await page.evaluate(() => GW.game.s.goodShifts) !== 0) fail('a shift with misses counted as good');
  // Each page only once: the next trip shows nothing.
  await shelf(); await arrive();
  if (await cur() !== null) fail('a page showed again on the second trip: ' + await cur());
  await ship(); await page.keyboard.press('Escape');
  // A good shift: one Socks order, packed right.  packSoft packs each box on the bench right (Soft items: the item
  // and peanuts, then the stamp).
  const packSoft = async n => { for (let i = 0; i < n; i++) {
    const it = await page.evaluate(() => GW.ship.orders()[GW.ship.activeOrder()].item.id);
    await tap('.ship-conveyor');
    await page.locator(`.ship-menu-items .ship-tile[data-item="${it}"]`).scrollIntoViewIfNeeded();
    const drag = async (from) => { const a = await mid(from), b = await mid('.ship-box:not(.is-stacked)');
      await page.mouse.move(a.x, a.y); await page.mouse.down();
      for (let k = 1; k <= 8; k++) await page.mouse.move(a.x + (b.x - a.x) * k / 8, a.y + (b.y - a.y) * k / 8);
      await page.mouse.up(); };
    await drag(`.ship-menu-items .ship-tile[data-item="${it}"]`);
    await page.keyboard.press('Escape');                                 // the menu covers the computer on desktop
    await tap('.ship-computer');
    await page.locator('.supply-tile[data-supply="supply:peanuts"]').scrollIntoViewIfNeeded();
    await drag('.supply-tile[data-supply="supply:peanuts"]');
    await page.keyboard.press('Escape');
    await tap('.ship-box:not(.is-stacked)');
    await tap('.ship-computer');
    await page.locator('.supply-tile[data-supply="stamp:gnomerica"]').scrollIntoViewIfNeeded();
    await drag('.supply-tile[data-supply="stamp:gnomerica"]');
    await page.keyboard.press('Escape');
    await handToDriver(page);
    await page.waitForTimeout(500);
  } };
  await shelf('socks'); await arrive();
  const n = await page.evaluate(() => GW.ship.orders().length);
  for (let i = 0; i < n; i++) await stampSlip(page, i, 'approved');
  await packSoft(n);
  await ship();
  const good = await page.evaluate(() => ({ line: (document.querySelector('.ship-card .card-good') || {}).textContent || '', n: GW.game.s.goodShifts, kept: GW.game.s.lastShift.good,
    want: GW.CONFIG.shipping.card.good.text, why: [...document.querySelectorAll('.ship-card .card-why')].map(e => e.textContent).join('|') }));
  if (good.line !== good.want || good.n !== 1 || good.kept !== true) fail(`a good shift: line "${good.line}", goodShifts ${good.n}, saved ${good.kept} (misses: ${good.why})`);
  await page.screenshot({ path: path.join(OUT, `1q-${name}-good-shift-check.png`) });
  await page.keyboard.press('Escape');
  await tap('.ship-clip-card');
  if (!await page.$('.ship-card .card-good')) fail('the reopened card lost its good shift line');
  await page.keyboard.press('Escape');
  // Every row a check (1q.1): a shift with an approved glitter fake (made a fake here) and every real order packed
  // right is not a good shift.  (Shift 2 again, so the fakes page is not due yet.)
  await page.evaluate(() => { GW.game.s.shifts = 1; });
  await shelf('socks,sponge'); await arrive();
  const n2 = await page.evaluate(() => { const o = GW.ship.orders(); o[0].fake = true; return o.length; });
  if (n2 < 2) fail('the approved fake check needs 2 or more orders, got ' + n2);
  for (let i = 0; i < n2; i++) await stampSlip(page, i, 'approved');
  await packSoft(n2);
  await ship();
  const fk = await page.evaluate(() => ({ rows: GW.game.s.lastShift.rows.map(r => r.ok).join(), good: GW.game.s.lastShift.good, n: GW.game.s.goodShifts, line: !!document.querySelector('.ship-card .card-good') }));
  if (fk.rows !== [false].concat(Array(n2 - 1).fill(true)).join() || fk.good || fk.n !== 1 || fk.line) fail('a shift with an approved fake: ' + JSON.stringify(fk));
  await page.keyboard.press('Escape');
  // The book from the bookshelf: only the seen pages (fakes not seen yet), back and next.  Its glow stops for good.
  if (!await page.evaluate(() => GW.ship.bookGlow())) fail('the bookshelf stopped glowing before the book was opened');
  { const c = await mid('.ship-book');
    if (!await page.evaluate(([x, y]) => !!document.elementFromPoint(x, y).closest('.ship-book'), [c.x, c.y])) fail('something covers the bookshelf'); }
  await tap('.ship-book');
  const b = await page.evaluate(() => ({ cur: GW.tutorial.current(), book: GW.tutorial.inBook(), count: document.querySelector('.tut-count').textContent, back: document.querySelector('.tut-step').disabled,
    glow: GW.ship.bookGlow(), saved: GW.game.s.tutorial.bookOpened }));
  if (b.cur !== 'welcome' || !b.book || b.count !== '1 / 4' || !b.back) fail(`the book from the bookshelf: ${JSON.stringify(b)}`);
  if (b.glow || b.saved !== true) fail(`the bookshelf's glow after the book opened: ${JSON.stringify(b)}`);
  const pages = [];
  for (let i = 0; i < 5; i++) { pages.push(await cur()); await tap('.tut-step:last-of-type'); }
  if (pages.join() !== 'welcome,stamp,pack,hand,hand') fail(`the book pages through ${pages.join()}`);
  await tap('.tut-step');
  if (await cur() !== 'pack') fail('Back did not step back');
  await got();
  if (await cur() !== null) fail('Got it! did not close the book');
  // Pages due together queue: the stamp page again and the fakes shift (shift 4).
  await page.evaluate(() => { delete GW.game.s.tutorial.seen.stamp; GW.game.s.shifts = 3; });
  await shelf(); await arrive();
  if (await cur() !== 'stamp' || (await page.evaluate(() => GW.tutorial.waiting().join())) !== 'fakes') fail('two pages due together: ' + await cur() + ' then ' + await page.evaluate(() => GW.tutorial.waiting().join()));
  await got();
  if (await cur() !== 'fakes') fail('the fakes page did not follow the stamp page');
  await got();
  if (await cur() !== null || await seen() !== 'welcome,stamp,pack,hand,fakes') fail('after the queue: ' + await cur() + ' / ' + await seen());
  if (await page.evaluate(() => GW.ship.bookGlow())) fail('the bookshelf glowed again after a new page, once the book was opened');
  // A TNP trip counts neither way.
  await ship(); await page.keyboard.press('Escape');
  await page.evaluate(() => { GW.CONFIG.shipping.fakes.elfChance = 1; GW.game.s.tnpRow = 0; });
  const g0 = await page.evaluate(() => GW.game.s.goodShifts);
  await shelf(); await arrive();
  if (!await page.evaluate(() => GW.ship.tnpTrip())) fail('the forced elf did not come');
  await ship();
  if (await page.$('.ship-card .card-good') || await page.evaluate(() => GW.game.s.goodShifts) !== g0) fail('a TNP trip counted as a good shift');
  await page.keyboard.press('Escape');
  await page.click('[data-view="machine"]');
  // Older saves (no tutorial): 1 or more shifts skips pages 1 to 4, fakes.startShift or more skips page 5 too.
  for (const [shifts, want] of [[0, ''], [1, 'welcome,stamp,pack,hand'], [3, 'welcome,stamp,pack,hand'], [4, 'welcome,stamp,pack,hand,fakes']]) {
    await setSave(`o => { delete o.tutorial; o.shifts = ${shifts}; }`);
    await page.reload(); await page.waitForTimeout(400);
    if (await seen() !== want) fail(`an older save with ${shifts} shifts has seen "${await seen()}", expected "${want}"`);
    if (await page.evaluate(() => GW.tutorial.bookNew()) !== (shifts >= 1)) fail(`an older save with ${shifts} shifts: the book new is ${!(shifts >= 1)}`);
  }
  // The book opened is remembered in the save (1q.1).
  await setSave(`o => { o.tutorial = { seen: { welcome: true }, bookOpened: true }; }`);
  await page.reload(); await page.waitForTimeout(400);
  if (await page.evaluate(() => GW.tutorial.bookNew())) fail('a save with the book opened made it new again');
  // ?tutorial=reset brings them back.
  await page.goto(URL + '?ship=1&tutorial=reset'); await page.waitForTimeout(400);
  if (await seen() !== '') fail('?tutorial=reset left ' + await seen());
  await page.click('[data-view="shipping"]'); await page.waitForTimeout(200);
  if (await cur() !== 'welcome') fail('after ?tutorial=reset the welcome page did not show');
  await got();
  if (!await page.evaluate(() => GW.ship.bookGlow())) fail('after ?tutorial=reset the bookshelf did not glow again');
  await page.click('[data-view="machine"]');
  console.log(`tutorial (${name}): pages at their moments, once each, queue, real taps only, older saves, reset, bookshelf and its glow, good shift (not with an approved fake), glows ok (page ${fit.h} px tall)`);
}

// Calm motion (Info tab): the switch gives what a device set to reduce motion gives, with no reload, and is
// remembered; a device that asks for less motion locks it on.  Desktop, its own context.  Screenshots of the Info tab.
async function calmCheck(browser, errors) {
  const fail = m => errors.push('calm motion: ' + m);
  const ctx = await browser.newContext({ viewport: { width: 1400, height: 900 } });
  const page = await ctx.newPage();
  page.on('pageerror', e => fail('page error: ' + e.message));
  await page.goto(URL + '?debug=1&ship=1');
  await page.waitForTimeout(400);
  await page.evaluate(() => {
    GW.CONFIG.shipping.tutorial.pages.forEach(p => { GW.game.s.tutorial.seen[p.id] = true; });
    const s = GW.game.s; s.cogs = 1e12; s.cogsSeen = 1e12;
    GW.CONFIG.producers.forEach(p => { for (let i = 0; i < 12; i++) GW.econ.buy(s, 'producer', p.id); });
    GW.econ.buy(s, 'oneTime', 'two_hands'); GW.econ.buy(s, 'oneTime', 'w_sword');
    GW.state.save(s);
  });
  // Samples of the calm rules: the chain's sway, a slip's glitter, the shiny's pulse (test copies, off screen).
  const sample = () => page.evaluate(() => {
    let t = document.getElementById('calmSamples');
    if (!t) {
      t = document.createElement('div'); t.id = 'calmSamples'; t.style.cssText = 'position:fixed;left:-500px;top:0';
      t.innerHTML = '<div class="ship-chain is-ready"><img alt=""></div><div class="ship-slip"><svg class="glitter-star"></svg></div><div class="rare-popup"></div>';
      document.body.appendChild(t);
    }
    const a = sel => getComputedStyle(t.querySelector(sel)).animationName;
    return { chain: a('.ship-chain'), glitter: a('.glitter-star'), calm: GW.calm(), cls: document.documentElement.classList.contains('calm'),
      box: document.getElementById('calmOn').checked, locked: document.getElementById('calmOn').disabled,
      note: document.getElementById('motionNote').textContent };
  });
  // The Shop Floor: calm swaps poses (the act class) and runs no squash or boing animations on the gnomes.
  const floor = async () => {
    await page.click('[data-view="floor"]');
    await page.evaluate(() => {
      window.__partAnims = 0; window.__acts = 0;
      if (!window.__wrapped) {
        window.__wrapped = true;
        const orig = Element.prototype.animate;
        Element.prototype.animate = function () { if (this.closest && this.closest('.part')) window.__partAnims++; return orig.apply(this, arguments); };
        new MutationObserver(ms => ms.forEach(m => { if (m.target.classList && m.target.classList.contains('act')) window.__acts++; }))
          .observe(document.body, { subtree: true, attributes: true, attributeFilter: ['class'] });
      }
    });
    await page.waitForTimeout(3500);
    const r = await page.evaluate(() => ({ anims: window.__partAnims, acts: window.__acts }));
    await page.click('[data-view="machine"]');
    return r;
  };
  const info = async shot => {
    await page.click('[data-tab="info"]');
    await page.$eval('#calmOn', e => e.scrollIntoView({ block: 'center' }));
    await page.waitForTimeout(150);
    await page.screenshot({ path: path.join(OUT, shot) });
  };
  const label = await page.evaluate(() => [document.getElementById('calmLabel').textContent, GW.CONFIG.motion.label]);
  if (label[0] !== label[1]) fail(`the switch reads "${label[0]}"`);

  let r = await sample();
  if (r.calm || r.cls || r.box) fail('on by default');
  if (r.chain === 'none' || r.glitter === 'none') fail(`normal motion missing with the switch off (${r.chain}, ${r.glitter})`);
  let f = await floor();
  if (!f.anims) fail('no squash or boing on the Shop Floor with the switch off');
  await info('calm-info-off.png');

  await page.click('#calmOn');
  r = await sample();
  if (!r.calm || !r.cls || !r.box) fail(`the switch did not turn calm on (calm ${r.calm}, class ${r.cls})`);
  if (r.chain !== 'none') fail('the chain still sways with the switch on');
  if (r.glitter !== 'none') fail('a slip\'s glitter still moves with the switch on');
  if (r.note) fail(`the motion note shows "${r.note}" with only the switch on`);
  await info('calm-info-on.png');
  f = await floor();
  if (f.anims) fail(`${f.anims} squash or boing animations on the Shop Floor with the switch on`);
  if (!f.acts) fail('the Shop Floor gnomes did not swap poses with the switch on');

  await page.reload(); await page.waitForTimeout(400);
  r = await sample();
  if (!r.calm || !r.cls || !r.box) fail('the switch did not survive a reload');
  if (r.chain !== 'none' || r.glitter !== 'none') fail('calm rules lost after a reload');

  await page.click('[data-tab="info"]');
  await page.click('#calmOn');
  r = await sample();
  if (r.calm || r.cls || r.box) fail('the switch did not turn off');
  if (r.chain === 'none' || r.glitter === 'none') fail('normal motion did not come back with the switch off');
  f = await floor();
  if (!f.anims) fail('the Shop Floor did not bounce again with the switch off');

  // The device asks for less motion: calm, the switch locked on, the note says why, all with no reload.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForTimeout(100);
  r = await sample();
  const note = await page.evaluate(() => GW.CONFIG.motion.deviceNote);
  if (!r.calm || !r.cls) fail('the device setting did not turn calm on');
  if (!r.box || !r.locked) fail(`the switch is not locked on under the device setting (checked ${r.box}, disabled ${r.locked})`);
  if (r.note !== note) fail(`the motion note reads "${r.note}" under the device setting`);
  await info('calm-info-locked.png');
  await page.reload(); await page.waitForTimeout(400);
  r = await sample();
  if (!r.calm || !r.box || !r.locked || r.note !== note) fail('the device lock did not hold after a reload');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.waitForTimeout(100);
  r = await sample();
  if (r.calm || r.cls || r.box || r.locked || r.note) fail('the device lock did not let go with the switch off');
  await ctx.close();
  console.log('calm motion: switch off by default, on, saved over a reload, off again, device lock and note, Shop Floor poses, CSS samples ok');
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
    // Every tutorial page seen (1q), so none covers the room in the checks below; tutorialCheck tries them.
    await page.evaluate(() => { GW.CONFIG.shipping.tutorial.pages.forEach(p => { GW.game.s.tutorial.seen[p.id] = true; }); GW.state.save(GW.game.s); });
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
    if (name === 'desktop') await polishCheck(page, errors);
    if (name === 'desktop') await leaveCheck(page, errors);
    if (name === 'desktop') await fakeCheck(page, errors);
    await elfCheck(page, errors, name);
    await tutorialCheck(page, errors, name);

    const version = await page.textContent('.footer');
    console.log(`${name}: ok  taps=${taps}  items=${after}  ${version.trim()}`);
    await ctx.close();
  }
  await calmCheck(browser, errors);
  await browser.close();
  if (errors.length) { console.log('\nPROBLEMS:\n' + errors.join('\n')); process.exit(1); }
  console.log('\nAll clear.  Screenshots in tools/out/');
})();
