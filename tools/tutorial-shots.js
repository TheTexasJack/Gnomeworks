// Makes the tutorial's pictures (1q): plays the Packing Line in a headless browser the way the smoke test does,
// crops a shot of the real room for each page, and saves it small as WebP in assets/tutorial/ (the size in
// CONFIG.shipping.tutorial.pic).  Run it again whenever the room changes.  The How to Ship bookshelf (1q.1) shows
// on the wall in any shot that takes in that part of the room.
//
//   welcome.webp  the truck at the door, with its driver
//   stamp.webp    an open slip with its APPROVED and DENIED buttons
//   pack.webp     the belt, the computer, and an open box with an item in it
//   hand.webp     a closed box held over the driver
//   fakes.webp    a glitter slip beside the elf in his fake truck
//
// Needs: Node 18+ and Playwright with Chromium (as the smoke test).  The WebP is made by Chromium's own canvas, so
// nothing else is needed.  Run from the repo root:  node tools/tutorial-shots.js
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const URL = 'file://' + path.join(ROOT, 'index.html');
const OUT = path.join(ROOT, 'assets', 'tutorial');
const QUALITY = 0.82;                 // WebP quality
fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1400, height: 900 }, deviceScaleFactor: 2, colorScheme: 'light' });   // Day
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(URL + '?ship=1');
  await page.waitForTimeout(500);
  const [W, H] = await page.evaluate(() => GW.CONFIG.shipping.tutorial.pic);
  // Every page seen, so none covers the room; no fakes or elves until the fakes shot; a full shelf.
  await page.evaluate(() => {
    const s = GW.game.s, F = GW.CONFIG.shipping.fakes;
    GW.CONFIG.shipping.tutorial.pages.forEach(p => { s.tutorial.seen[p.id] = true; });
    s.tutorial.bookOpened = true;                        // the bookshelf shows on the wall without its new-book glow (1q.1)
    F.chance = 0; F.elfChance = 0; s.shifts = 0;
    GW.state.save = () => true;                          // the shots never touch the saved game
    document.documentElement.classList.remove('night');
  });
  await page.click('[data-view="shipping"]');
  await page.waitForTimeout(400);
  await page.evaluate(() => GW.CONFIG.items.forEach(it => { GW.game.s.items[it.id] = it.group === 'monsters' ? 0 : 40; }));
  const room = await page.locator('#ship').boundingBox();
  const mid = async sel => { const b = await page.locator(sel).first().boundingBox(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; };
  const tap = async sel => { const c = await mid(sel); await page.mouse.click(c.x, c.y); };
  // A shot of part of the room: [x, y, w] in % of the room (y = the top), at the picture's shape.
  const shot = async (x, y, w, aspect) => {
    const cw = room.width * w / 100, ch = cw / (aspect || W / H);
    return page.screenshot({ clip: { x: room.x + room.width * x / 100, y: room.y + room.height * y / 100, width: cw, height: ch } });
  };
  const dragTo = async (from, to, letGo) => {
    await page.locator(from).first().scrollIntoViewIfNeeded();
    const a = await mid(from), b = await mid(to);
    await page.mouse.move(a.x, a.y); await page.mouse.down();
    for (let i = 1; i <= 10; i++) await page.mouse.move(a.x + (b.x - a.x) * i / 10, a.y + (b.y - a.y) * i / 10);
    if (letGo !== false) await page.mouse.up();
  };
  // Draws the shots side by side on a canvas at W x H and returns the WebP bytes.
  const webp = async (pngs) => {
    const urls = pngs.map(b => 'data:image/png;base64,' + b.toString('base64'));
    const data = await page.evaluate(async ([urls, W, H, q]) => {
      const imgs = await Promise.all(urls.map(u => new Promise(ok => { const i = new Image(); i.onload = () => ok(i); i.src = u; })));
      const c = document.createElement('canvas'); c.width = W; c.height = H;
      const g = c.getContext('2d'); g.imageSmoothingQuality = 'high';
      const each = W / imgs.length;
      imgs.forEach((im, k) => g.drawImage(im, k * each, 0, each, H));
      if (imgs.length > 1) { g.fillStyle = '#8a5a2b'; for (let k = 1; k < imgs.length; k++) g.fillRect(k * each - 2, 0, 4, H); }
      const out = c.toDataURL('image/webp', q);
      return out.startsWith('data:image/webp') ? out : null;
    }, [urls, W, H, QUALITY]);
    if (!data) throw new Error('this Chromium cannot write WebP from a canvas');
    return Buffer.from(data.split(',')[1], 'base64');
  };
  const save = (name, buf) => { fs.writeFileSync(path.join(OUT, name), buf); console.log(`${name}: ${buf.length} bytes`); };
  const open = async () => { await tap('.ship-chain'); await page.waitForFunction(() => GW.ship.tripState() === 'here', null, { timeout: 10000 }); await page.waitForTimeout(400); };

  // 1. The truck at the door, with its driver.
  await open();
  save('welcome.webp', await webp([await shot(48, 22, 52)]));

  // 2. An open slip with its stamp buttons (the whole room's height, so the slip and the buttons both show).
  await tap('.ship-board .ship-slip');
  await page.waitForTimeout(300);
  save('stamp.webp', await webp([await shot((100 - 160 * room.height / room.width) / 2, 0, 160 * room.height / room.width)]));
  await page.click('.slip-stamp-btn[data-verdict="approved"]');
  await page.waitForTimeout(400);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);

  // 3. The belt, the computer, and an open box with the ordered item in it (the belt's tip glowing).
  const item = await page.evaluate(() => GW.ship.orders()[0].item.id);
  await tap('.ship-conveyor');
  await dragTo(`.ship-menu-items .ship-tile[data-item="${item}"]`, '.ship-box:not(.is-stacked)');
  await page.keyboard.press('Escape');
  await page.evaluate(() => document.querySelectorAll('.ship-belt-glow, .ship-belt-tag').forEach(e => { e.hidden = false; }));
  await page.waitForTimeout(300);
  save('pack.webp', await webp([await shot(0, 20, 72)]));

  // 4. The closed box held over the driver.
  await tap('.ship-box:not(.is-stacked)');
  await page.waitForTimeout(200);
  const d = await page.locator('.ship-driver img').boundingBox(), a = await page.locator('.ship-box:not(.is-stacked)').boundingBox();
  await page.mouse.move(a.x + a.width / 2, a.y + a.height / 2); await page.mouse.down();
  for (let i = 1; i <= 10; i++) await page.mouse.move(a.x + a.width / 2 + (d.x + d.width / 2 - a.x - a.width / 2) * i / 10, a.y + a.height / 2 + (d.y + d.height * 0.45 - a.y - a.height / 2) * i / 10);
  await page.waitForTimeout(300);
  save('hand.webp', await webp([await shot(52, 30, 48)]));
  await page.mouse.move(a.x + a.width / 2, a.y + a.height / 2); await page.mouse.up();
  await page.waitForTimeout(300);

  // 5. A glitter slip (open full size) beside the elf in his fake truck.
  await tap('.ship-chain');
  await page.waitForFunction(() => GW.ship.cardOpen(), null, { timeout: 15000 });
  await page.keyboard.press('Escape');
  await page.evaluate(() => { const F = GW.CONFIG.shipping.fakes; F.chance = 1; GW.game.s.shifts = 3; GW.game.s.tnpRow = 0;
    GW.CONFIG.items.forEach(it => { GW.game.s.items[it.id] = it.group === 'monsters' ? 0 : 40; }); });
  await open();
  const fake = await page.evaluate(() => GW.ship.fakes().indexOf(true));
  await page.locator('.ship-board .ship-slip').nth(fake).click();
  await page.waitForTimeout(500);
  const half = W / 2 / H, sw = 92 * room.height / room.width * half;   // the open slip, at the half picture's shape
  const glitter = await shot((100 - sw) / 2, 4, sw, half);
  await page.keyboard.press('Escape');
  await tap('.ship-chain');
  await page.waitForFunction(() => GW.ship.cardOpen(), null, { timeout: 15000 });
  await page.keyboard.press('Escape');
  await page.evaluate(() => { GW.CONFIG.shipping.fakes.elfChance = 1; GW.game.s.tnpRow = 0;
    GW.CONFIG.items.forEach(it => { GW.game.s.items[it.id] = it.group === 'monsters' ? 0 : 40; }); });
  await open();
  if (!await page.evaluate(() => GW.ship.tnpTrip())) throw new Error('the elf did not come');
  const elf = await shot(63, 18, 34, half);
  save('fakes.webp', await webp([glitter, elf]));

  await browser.close();
  if (errors.length) { console.log('PROBLEMS:\n' + errors.join('\n')); process.exit(1); }
  console.log('Done.  Pictures in assets/tutorial/');
})();
