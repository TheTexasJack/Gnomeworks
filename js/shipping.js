/* The shipping room, the Packing Line's view (layers 1a to 1c-2): the room art, the door chain,
   Gnomerica's truck and driver, and the work orders on the order board.  Hidden from players while CONFIG.shipping.enabled is false; ?ship=1 in
   the address shows it for testing.  Nothing ships yet.  The door starts closed each time the view opens
   and is not saved.
   A trip: pulling the chain opens the door, the truck backs through the doorway into the room and settles, then the driver
   walks in a short way and waits, grumpy.  Pulling again sends him out, the truck drives off, and the door
   shows closed.
   Work orders (1c-2): when the driver finishes walking in, up to three slips pin to the order board, each a
   Gnomerica place asking for an item the shelf holds more than 1 of, at a count set by the item's packing tag (1h)
   that the shelf can spare.  A tap opens a slip full size; any tap
   or Escape closes it.  Orders are not saved, and closing the door clears them.
   Packing (1d): a tap on the conveyor opens the item menu.  The active order (the leftmost unpacked one) has an
   open box on the bench; dragging a tile onto it puts the order's count of that item in (or what the shelf can spare).  A tap closes a
   filled box (or opens a closed one again).  A tap on the computer opens the supplies menu (1g), on the same frame;
   dragging a region stamp from it onto the closed box stamps it, and a stamped box moves to the stack by the truck
   while the next order's box appears.  An open box shakes off a stamp; a closed box shakes off junk and inside
   supplies.  Only one menu is open at a time.  The record of what was packed is GW.ship.packed().
   Inside supplies (1i): the supplies menu opens with the "Packing rules" chart, then a Packing section (packing
   peanuts and bubble wrap) that goes into the open box.  Each junk tile shows its packing tag's icon, and the open
   box shows the item's picture with its tag beside it and the supplies in its opening.  Scoring wants peanuts in
   every box and bubble wrap around a Breakable item.
   Outside stickers (1j): the Stickers section (FRAGILE, HEAVY) goes on a closed box before its stamp, in the box
   face's upper left; scoring wants FRAGILE on a Breakable item and HEAVY on a Heavy one.  The chart shows only while
   the instructions setting is on (css).
   The room's tips (1g): the belt glows with a tag at the start of each trip until the item menu first opens, the
   computer's screen glows while a closed box waits for its stamp, and the chain glows when the shift is ready.  All
   of them follow the instructions setting (the no-hints class on the page, css).
   The hand-off (1e): once every order has a stamped box, the chain glows and sways and a tag by its handle says to
   pull it.  Pulling the chain with the driver in place scores each order (CONFIG.shipping.score), takes each box's count
   off the shelf (never below the display copy), moves Stonks (saved, never below 0), and adds the shift to the history.
   A perfect shift gets the driver's thumbs up before he leaves.  Once the door shows closed, the report card shows
   over the room; closing it ticks the GRIP line on the STONKS screen up to the new total.  A trip with no orders
   scores nothing and shows no card.
   Leaving (1f): tapping The Machine or Shop Floor while the driver waits with orders on the board shows the leave
   warning.  Stay (or a tap outside it, or Escape) changes nothing; Send it off runs the same hand-off as the chain,
   and main.js switches views once the report card closes.  Leaving while the truck is already leaving waits for
   the card the same way, so a scored shift's card is never skipped. */
window.GW = window.GW || {};

GW.ship = (function () {
  var C = GW.CONFIG, P = C.shipping, T = P.trip, U = GW.util;
  var tallQuery = window.matchMedia(P.tallQuery);
  var calmQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var built = false, active = false, open = false;
  var trip = 'closed';            // 'closed' | 'arriving' | 'here' | 'leaving'
  var tripId = 0, anims = [];
  var box, closedImg, openImg, bay, truck, driver, driverImg, chain, roller, rollerClosed, rollerOpen, bounceTimer;
  var board, viewer, orders = [], slipOpen = false;
  var K = P.pack, conveyor, computer, packLayer, boxEl = null, menus = {}, menuKind = null, stacked = [];
  var beltGlow, beltImg, beltTag, screenGlow, screenImg, beltTip = false;
  var packed = [], boxItem = null, boxCount = 0, boxState = 'none', boxIn = {}, boxOut = {};
  // boxState: 'none' | 'open' | 'closed' | 'stamped'; boxIn = the inside supplies in the box (1i); boxOut = the
  // stickers on it (1j)
  var screenEl, screenNum, screenLine, screenDot, tag, cardView, cardOpen = false, pendingCard = null, shown = null, tickAnim = 0;
  var warnView, warnPanel, warnStay, warnOpen = false, warnGo = null, afterCard = null;

  function enabled() {
    return !!P.enabled || new RegExp('[?&]' + P.testParam + '=1(&|$)').test(window.location.search);
  }
  function layout() { return P.layouts[tallQuery.matches ? 'tall' : 'wide']; }
  function img(cls, src) { var i = U.el('img', cls); i.alt = ''; i.draggable = false; if (src) i.src = src; return i; }

  function build() {
    box = document.getElementById('ship');
    closedImg = img('ship-room'); openImg = img('ship-room ship-open');
    box.appendChild(closedImg); box.appendChild(openImg);
    // The tips' glows (1g): the room art again, cut to the belt's and the screen's outlines, glowing.  They sit
    // just above the room, under everything else.
    beltGlow = makeGlow('ship-belt-glow'); beltImg = beltGlow.firstChild;
    screenGlow = makeGlow('ship-screen-glow'); screenImg = screenGlow.firstChild;
    // The order board sits on the back wall, so the truck and the driver draw in front of it.
    board = U.el('div', 'ship-board');
    box.appendChild(board);
    buildScreen();
    // The bay is clipped to the doorway, so the truck only shows through the opening, behind the frame.
    bay = U.el('div', 'ship-bay');
    truck = img('ship-truck', P.truck.img);
    bay.appendChild(truck);
    box.appendChild(bay);
    driver = U.el('div', 'ship-driver');
    driverImg = img('', P.driver.img);
    driver.appendChild(driverImg);
    new Image().src = P.driver.happy.img;       // loaded ahead, so the thumbs up shows at once
    box.appendChild(driver);
    // Packing (1d): the box and the stack draw in front of the driver (the box has the stage).  The two menu
    // buttons: the conveyor opens the item menu, the computer the supplies menu (1g).  A tap on the open menu's
    // own button closes it; a tap on the other button switches menus.
    conveyor = menuButton('ship-conveyor', 'items');
    computer = menuButton('ship-computer', 'supplies');
    packLayer = U.el('div', 'ship-pack');
    box.appendChild(packLayer);
    chain = U.el('div', 'ship-chain');
    chain.setAttribute('aria-hidden', 'true');
    chain.appendChild(img('', P.chain.img));
    chain.style.setProperty('--pull', P.chain.pullPercent + '%');
    chain.style.setProperty('--pull-ms', P.chain.pullMs + 'ms');
    chain.addEventListener('pointerdown', function (e) {
      e.stopPropagation();
      if (!e.isTrusted || e.button > 0) return;     // a real tap only, like the gear
      e.preventDefault();
      if (slipOpen || cardOpen || trip === 'arriving' || trip === 'leaving') return;   // one trip at a time
      pull();
    });
    box.appendChild(chain);
    // The roller: the same room art again, cut to the roller's outline and drawn in front of the chain, so the
    // chain's top end stays hidden behind it while the chain is pulled.  Its twins follow the door like the room's.
    roller = U.el('div', 'ship-roller');
    rollerClosed = img('ship-room'); rollerOpen = img('ship-room ship-open');
    roller.appendChild(rollerClosed); roller.appendChild(rollerOpen);
    box.appendChild(roller);
    // The "Pull to ship!" tag by the chain's handle (1e), shown once every order is packed.
    tag = div('ship-finish ship-tip');
    tag.appendChild(U.el('span', '', P.finish.text));
    tag.hidden = true;
    box.appendChild(tag);
    // The belt's tag (1g), shown with its glow at the start of each trip.
    beltTag = div('ship-finish ship-belt-tag ship-tip');
    beltTag.appendChild(U.el('span', '', P.tips.belt));
    beltTag.hidden = true;
    box.appendChild(beltTag);
    chain.style.setProperty('--sway', P.finish.swayDeg + 'deg');
    chain.style.setProperty('--sway-ms', P.finish.swayMs + 'ms');
    // An open slip covers the whole room, so the chain and everything else under it get no taps.
    menus.items = buildMenu('items', K.menuLabel);
    menus.supplies = buildMenu('supplies', K.supplies.label);
    viewer = U.el('div', 'ship-slip-view');
    viewer.hidden = true;
    viewer.addEventListener('pointerdown', function (e) {
      e.stopPropagation(); e.preventDefault();
      closeSlip();
    });
    box.appendChild(viewer);
    // The report card covers the whole room too; any tap or Escape closes it.
    cardView = U.el('div', 'ship-card-view');
    cardView.hidden = true;
    cardView.addEventListener('pointerdown', function (e) {
      e.stopPropagation(); e.preventDefault();
      closeCard();
    });
    box.appendChild(cardView);
    buildWarn();
    box.style.setProperty('--slip-night', P.slip.nightBrightness);
    box.style.setProperty('--tip-pulse', P.tips.pulseMs + 'ms');
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (warnOpen) { e.preventDefault(); closeWarn(); }
      else if (cardOpen) { e.preventDefault(); closeCard(); }
      else if (slipOpen) { e.preventDefault(); closeSlip(); } else if (menuKind) { e.preventDefault(); closeMenu(); }
    });
    // A tap outside the open menu closes it.  Inside the room that tap does nothing else.
    document.addEventListener('pointerdown', function (e) {
      if (warnOpen && !warnPanel.contains(e.target)) {          // a tap outside the warning is Stay
        closeWarn();
        if (box.contains(e.target)) { e.stopPropagation(); e.preventDefault(); }
        return;
      }
      if (!menuKind || menus[menuKind].el.contains(e.target)) return;
      if (e.target === conveyor || e.target === computer) return;   // the buttons switch or close menus themselves
      closeMenu();
      if (box.contains(e.target)) { e.stopPropagation(); e.preventDefault(); }
    }, true);
    built = true;
    tallQuery.addEventListener('change', redraw);
  }

  // ---------- work orders (all numbers in CONFIG.shipping.orders) ----------
  function shuffled(list) {
    var a = list.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  // How many of an item an order asks for (1h): one of its packing tag's friendly numbers that the shelf can spare,
  // or everything it can spare when none fit.  spare is always at least 1 here.
  function pickCount(item, spare) {
    var C = P.orders.counts, list = (C[item.pack || ''] || C['']).filter(function (n) { return n <= spare; });
    return list.length ? list[Math.floor(Math.random() * list.length)] : spare;
  }
  // One order from a random place that buys something the shelf can spare; a place with nothing to spare is
  // passed over for another.  used = item ids already asked for on this board.
  function pickOrder(places, used) {
    var O = P.orders, shelf = GW.game.s.items || {}, list = shuffled(places);
    for (var i = 0; i < list.length; i++) {
      var ok = list[i].buys.filter(function (id) { return (shelf[id] || 0) > O.keep && !used[id] && GW.econ.itemDef(id); });
      if (!ok.length) continue;
      var item = GW.econ.itemDef(ok[Math.floor(Math.random() * ok.length)]);
      return { place: list[i], item: item, qty: pickCount(item, shelf[item.id] - O.keep) };
    }
    return null;
  }
  // "500 × Toilet Paper", for the slips and the report card.
  function countName(qty, item) { return qty + ' ' + P.orders.countSign + ' ' + item.name; }
  function makeOrders() {
    var O = P.orders, used = {}, list = [];
    var places = GW.DESTINATIONS.places.filter(function (p) { return p.region === O.region; });
    for (var k = 0; k < O.count; k++) {
      var o = pickOrder(places, used) || (O.repeatItems ? pickOrder(places, {}) : null);
      if (!o) break;
      used[o.item.id] = true;
      list.push(o);
    }
    return list;
  }
  function regionOf(id) {
    var r = GW.DESTINATIONS.regions.filter(function (x) { return x.id === id; })[0];
    return r || { id: id, name: id };
  }

  // ---------- the slips ----------
  function div(cls, text) { return U.el('div', cls, text); }
  // A slip: the parchment with live text over it.  order null makes the "nothing to ship" note.
  function makeSlip(order, stampPct) {
    var S = P.slip, el = div('ship-slip' + (order ? '' : ' slip-note'));
    el.style.setProperty('--stamp', stampPct);
    el.appendChild(img('slip-paper', S.paper));
    el.appendChild(U.el('i', 'slip-pin'));
    el.appendChild(U.el('i', 'slip-stripes slip-top'));
    el.appendChild(U.el('i', 'slip-stripes slip-bottom'));
    if (!order) { el.appendChild(div('slip-note-text', P.orders.emptyText)); return el; }
    var region = regionOf(order.place.region);
    el.appendChild(img('slip-grip', S.grip));
    el.appendChild(div('slip-title', 'WORK ORDER'));
    el.appendChild(U.el('i', 'slip-rule'));
    var ship = div('slip-block slip-ship');
    ship.appendChild(div('slip-label', 'SHIP TO'));
    ship.appendChild(div('slip-town', order.place.name));
    ship.appendChild(div('slip-region', region.name));
    el.appendChild(ship);
    var what = div('slip-block slip-what');
    what.appendChild(div('slip-label', 'ITEM'));
    var line = div('slip-item');
    // The item's name and picture never break apart: when the line is too narrow, the count takes the first line
    // ("500 ×" / "Toilet Paper 🧻"), and fitSlips shrinks a name still too wide for its line.
    var tail = U.el('span', 'slip-tail', order.item.name);
    line.appendChild(U.el('span', '', order.qty + ' ' + P.orders.countSign + ' '));   // the space stays outside the tail, so the line can break there
    tail.appendChild(GW.ui.itemIcon(order.item));
    line.appendChild(tail);
    what.appendChild(line);
    el.appendChild(what);
    el.appendChild(img('slip-stamp', S.stampImg.replace('{region}', region.id)));
    el.setAttribute('aria-label', 'Work order: ship ' + order.qty + ' ' + order.item.name + ' to ' + order.place.name + ', ' + region.name);
    return el;
  }

  // The board shows the orders (or the note) while the driver waits, and nothing otherwise.
  function showBoard() {
    if (!built) return;
    board.textContent = '';
    updateReady();
    if (trip !== 'here') return;
    var list = orders.length ? orders : [null];
    list.forEach(function (o, i) {
      var el = makeSlip(o, P.slip.stamp.board);
      if (o && packed[i]) { el.classList.add('is-packed'); el.appendChild(U.el('i', 'slip-check', '\u2714')); }
      else if (o && i === activeIndex()) el.classList.add('is-active');
      el.addEventListener('pointerdown', function (e) {      // the note opens too, so it can be read on a phone
        e.stopPropagation();
        if (!e.isTrusted || e.button > 0 || slipOpen) return;   // a real tap only
        e.preventDefault();
        openSlip(o);
      });
      board.appendChild(el);
    });
    fitSlips(board);
  }
  // Each slip's ITEM line shrinks when its unbreakable piece (the item's name and picture) is wider than the line (CONFIG.shipping.slip.itemFont).  Sizes are in cqw, so the fit holds as the slip grows or shrinks.
  function fitSlips(box) {
    var F = P.slip.itemFont;
    function fit() {
      Array.prototype.forEach.call(box.querySelectorAll('.slip-item'), function (line) {
        var tail = line.querySelector('.slip-tail'), size = F.size;
        line.style.fontSize = size + 'cqw';
        var need = Math.max(tail ? tail.offsetWidth : 0, line.scrollWidth), room = line.clientWidth;   // layout sizes, untouched by the pop-in's scale
        if (need > room && room > 0) size = Math.max(F.min, size * room / need * P.card.fitSlack);
        line.style.fontSize = size + 'cqw';
      });
    }
    fit();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
  }
  // Sizes the board and its slips for the layout: every slip the same size, as tall as the board allows
  // with room for all three side by side.
  function placeBoard(L, ratio) {
    var b = L.board, S = P.slip, n = P.orders.count;
    board.style.left = b[0] + '%'; board.style.top = b[1] + '%';
    board.style.width = b[2] + '%'; board.style.height = b[3] + '%';
    var boardRatio = b[2] * ratio / b[3];                        // the board's width / height on screen
    var w = Math.min((100 - S.gap * (n - 1)) / n, 100 * S.aspect / boardRatio);   // % of the board's width
    board.style.setProperty('--slip-w', w + '%');
    board.style.setProperty('--slip-h', (w * boardRatio / S.aspect) + '%');
    board.style.setProperty('--slip-gap', S.gap + '%');
    // Open: as big as fits in openSize % of the room's height and of its width (the tall room is narrow).
    var ow = Math.min(S.openSize * S.aspect / ratio, S.openSize);
    viewer.style.setProperty('--slip-w', ow + '%');
    viewer.style.setProperty('--slip-h', (ow * ratio / S.aspect) + '%');
    var Cd = P.card, cw = Math.min(Cd.openSize * Cd.aspect / ratio, Cd.openSize);
    cardView.style.setProperty('--card-w', cw + '%');
    cardView.style.setProperty('--card-h', (cw * ratio / Cd.aspect) + '%');
  }
  function openSlip(order) {
    viewer.textContent = '';
    viewer.appendChild(makeSlip(order, P.slip.stamp.open));
    viewer.hidden = false;
    fitSlips(viewer);
    slipOpen = true;
    GW.sfx.click();
  }
  function closeSlip() {
    if (!slipOpen) return;
    viewer.hidden = true; viewer.textContent = '';
    slipOpen = false;
  }
  function clearOrders() { orders = []; closeSlip(); resetPack(); showBoard(); }
  function newOrders() { orders = makeOrders(); beltTip = true; resetPack(); showBoard(); nextBox(); }


  // ---------- packing (layer 1d; all numbers in CONFIG.shipping.pack and layouts.<layout>) ----------
  function activeIndex() {
    for (var i = 0; i < orders.length; i++) if (!packed[i]) return i;
    return -1;
  }
  function boxWidth(L, h) { return h / roomRatio(L); }     // a square canvas h % of the room's height, as % of its width
  function roomRatio(L) { var wh = L.aspect.split('/'); return parseFloat(wh[0]) / parseFloat(wh[1]); }
  function setBoxPlace(el, x, y, h, tilt) {
    el.style.left = x + '%'; el.style.top = y + '%'; el.style.height = h + '%';
    el.style.setProperty('--tilt', (tilt || 0) + 'deg');
  }
  function stackSpot(L, k) {
    var S = L.stack, sp = S.spots[Math.min(k, S.spots.length - 1)];
    return { x: S.x + sp[0] * boxWidth(L, S.h), y: S.y + sp[1] * S.h, h: S.h, tilt: sp[2] };
  }
  // A box: the open and closed pictures stacked (same canvas, so they swap with no jump), the label (the item's
  // picture, only while the box is open and filled), and the stamp.
  function makeBox() {
    var el = div('ship-box'), body = div('box-body');
    body.appendChild(img('box-art box-open', K.boxOpen));
    body.appendChild(img('box-art box-closed', K.boxClosed));
    var label = div('box-label'); label.hidden = true;
    // The inside supplies (1i) sit in the open box's opening, each at its own spot.
    K.inside.forEach(function (sp) {
      var pic = img('box-in', sp.img);
      pic.dataset.supply = sp.id; pic.hidden = true;
      pic.style.left = sp.spot[0] + '%'; pic.style.top = sp.spot[1] + '%'; pic.style.width = sp.spot[2] + '%';
      body.appendChild(pic);
    });
    body.appendChild(label);
    // The outside stickers (1j), placed in their slots by showBox.
    var St = K.stickers;
    St.list.forEach(function (st) {
      var pic = img('box-sticker', st.img);
      pic.dataset.sticker = st.id; pic.hidden = true; pic.alt = st.name;
      body.appendChild(pic);
    });
    el.style.setProperty('--sticker-w', St.width + '%'); el.style.setProperty('--sticker-tilt', St.tilt + 'deg');
    var mark = img('box-mark'); mark.hidden = true;
    body.appendChild(mark);
    el.appendChild(body);
    el.style.setProperty('--label-x', K.label[0] + '%'); el.style.setProperty('--label-y', K.label[1] + '%');
    el.style.setProperty('--label-w', K.label[2] + '%');
    el.style.setProperty('--mark-x', K.mark[0] + '%'); el.style.setProperty('--mark-y', K.mark[1] + '%');
    el.style.setProperty('--mark-w', K.mark[2] + '%'); el.style.setProperty('--mark-tilt', K.mark[3] + 'deg');
    return el;
  }
  function boxPart(cls) { return boxEl && boxEl.querySelector('.' + cls); }
  function showBox() {
    if (!boxEl) return;
    boxEl.classList.toggle('is-closed', boxState === 'closed' || boxState === 'stamped');
    var label = boxPart('box-label');
    label.textContent = '';
    label.hidden = !boxItem || boxState !== 'open';
    if (!label.hidden) {
      label.appendChild(GW.ui.itemIcon(boxItem));
      var t = tagIcon(boxItem, 'box-tag');          // the item's packing tag beside its picture (1i)
      if (t) label.appendChild(t);
      label.setAttribute('aria-label', boxItem.name + (t ? ', ' + K.tags[boxItem.pack].name : ''));
    }
    Array.prototype.forEach.call(boxEl.querySelectorAll('.box-in'), function (pic) {
      pic.hidden = boxState !== 'open' || !boxIn[pic.dataset.supply];
    });
    // The stickers show only on the closed box, side by side in menu order from the first slot (1j).
    var closed = boxState === 'closed' || boxState === 'stamped', slots = K.stickers.slots, k = 0;
    K.stickers.list.forEach(function (st) {
      var pic = boxEl.querySelector('.box-sticker[data-sticker="' + st.id + '"]');
      pic.hidden = !closed || !boxOut[st.id];
      if (!boxOut[st.id]) return;
      var sl = slots[Math.min(k++, slots.length - 1)];
      pic.style.left = sl[0] + '%'; pic.style.top = sl[1] + '%';
    });
    boxEl.classList.toggle('is-stickered', closed && k > 0);
    updateReady();
  }
  function resetPack() {
    packed = []; boxItem = null; boxCount = 0; boxState = 'none'; boxIn = {}; boxOut = {};
    if (boxEl) { boxEl.remove(); boxEl = null; }
    stacked.forEach(function (el) { el.remove(); }); stacked = [];
  }
  // The active order's empty box appears on the bench; with every order packed, none does.
  function nextBox() {
    if (boxEl || trip !== 'here' || activeIndex() < 0) return;
    var L = layout();
    boxItem = null; boxCount = 0; boxState = 'open'; boxIn = {}; boxOut = {};
    boxEl = makeBox();
    setBoxPlace(boxEl, L.box.x, L.box.y, L.box.h, 0);
    boxEl.addEventListener('pointerdown', function (e) {
      e.stopPropagation();
      if (!e.isTrusted || e.button > 0) return;
      e.preventDefault();
      tapBox();
    });
    packLayer.appendChild(boxEl);
    showBox();
    if (!calmQuery.matches) boxEl.firstChild.animate([{ transform: 'scale(.6)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }],
      { duration: K.nextMs, easing: 'cubic-bezier(.3,1.4,.5,1)' });
  }
  function tapBox() {
    if (boxState === 'open' && boxItem) { boxState = 'closed'; GW.sfx.click(); showBox(); }
    else if (boxState === 'closed') { boxState = 'open'; GW.sfx.click(); showBox(); }
  }
  // Drop an item in the open box: the active order's count of it (1h), right item or wrong, or everything the shelf
  // can spare if it has fewer.  What the stamped boxes already hold of the same item is not spare.  A different
  // item replaces the first.
  function fillBox(item) {
    if (boxState !== 'open') return;
    var spare = ((GW.game.s.items || {})[item.id] || 0) - P.orders.keep, o = orders[activeIndex()];
    packed.forEach(function (r) { if (r && r.item === item.id) spare -= r.count; });
    if (spare <= 0 || !o) return;
    boxItem = item; boxCount = Math.min(o.qty, spare);
    GW.sfx.drop(item.tier, true);
    showBox();
    if (!calmQuery.matches) boxEl.firstChild.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(2%) scaleY(.97)' }, { transform: 'translateY(0)' }],
      { duration: K.thumpMs, easing: 'ease-out' });
  }
  // An inside supply into the open box (1i).  Adding one twice changes nothing.
  function addSupply(id) {
    if (boxState !== 'open' || boxIn[id]) return;
    boxIn[id] = true;
    GW.sfx.drop('common', true);
    showBox();
    if (!calmQuery.matches) boxEl.firstChild.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(1.5%) scaleY(.98)' }, { transform: 'translateY(0)' }],
      { duration: K.thumpMs, easing: 'ease-out' });
  }
  // A sticker onto the closed box (1j): it presses on, the box jolts a little, and a soft pat.  Adding one twice
  // changes nothing.
  function addSticker(id) {
    if (boxState !== 'closed' || boxOut[id]) return;
    var St = K.stickers, calm = calmQuery.matches;
    boxOut[id] = true;
    showBox();
    var pic = boxEl.querySelector('.box-sticker[data-sticker="' + id + '"]'), turn = 'translate(-50%, 0) rotate(' + St.tilt + 'deg) ';
    GW.sfx.pat(St.pat);
    if (calm) return;
    pic.animate([{ transform: turn + 'scale(1.5)', opacity: 0 }, { transform: turn + 'scale(1)', opacity: 1 }], { duration: St.pressMs, easing: 'ease-out' });
    boxEl.firstChild.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(' + St.jolt + '%) scaleY(' + (1 - St.jolt / 100) + ')' }, { transform: 'translateY(0)' }],
      { duration: K.thumpMs, easing: 'ease-out' });
  }
  // The stickers on the box, in menu order (1j).
  function outsideList() { return K.stickers.list.filter(function (st) { return boxOut[st.id]; }).map(function (st) { return st.id; }); }
  // The inside supplies in the box, in menu order.
  function insideList() { return K.inside.filter(function (sp) { return boxIn[sp.id]; }).map(function (sp) { return sp.id; }); }
  // A packing tag's icon for an item (1i), or null when the item has no tag.
  function tagIcon(item, cls) {
    var t = item && item.pack && K.tags[item.pack];
    if (!t) return null;
    var i = img(cls, t.img);
    i.alt = t.name; i.title = t.name;
    return i;
  }
  function stampBox(rid) {
    if (boxState !== 'closed') return;
    var i = activeIndex(), el = boxEl, calm = calmQuery.matches;
    boxState = 'stamped';
    updateReady();
    el.classList.add('is-stamped');
    var mark = boxPart('box-mark');
    mark.src = P.slip.stampImg.replace('{region}', rid);
    mark.hidden = false;
    var turn = 'translate(-50%, -50%) rotate(' + K.mark[3] + 'deg) ';
    var down = calm ? Promise.resolve() : mark.animate([{ transform: turn + 'scale(2.2)', opacity: 0 }, { transform: turn + 'scale(1)', opacity: 1 }],
      { duration: K.stampMs, easing: 'ease-in' }).finished;
    var id = tripId;
    down.then(function () {
      if (id !== tripId || el !== boxEl) return;
      GW.sfx.thump();
      if (!calm) el.firstChild.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(2.5%) scaleY(.96)' }, { transform: 'translateY(0)' }],
        { duration: K.thumpMs, easing: 'ease-out' });
      // The record for 1e: the item, its count at packing time, the inside supplies (1i), the stickers (1j), and
      // the stamp used.
      packed[i] = { item: boxItem.id, count: boxCount, inside: insideList(), outside: outsideList(), stamp: rid };
      showBoard();
      return new Promise(function (r) { setTimeout(r, K.setAsideDelayMs); });
    }).then(function () {
      if (id !== tripId || el !== boxEl) return;
      var L = layout(), spot = stackSpot(L, stacked.length), from = { left: el.style.left, top: el.style.top, height: el.style.height };
      setBoxPlace(el, spot.x, spot.y, spot.h, spot.tilt);
      el.classList.add('is-stacked');
      stacked.push(el);
      boxEl = null; boxItem = null; boxState = 'none'; boxIn = {}; boxOut = {};
      if (!calm) el.animate([from, { left: spot.x + '%', top: spot.y + '%', height: spot.h + '%' }], { duration: K.slideMs, easing: 'ease-in-out' });
      nextBox();
    }).catch(function () {});
  }
  // A shake when something is dropped on the wrong side of the box (a sticker or stamp on an open box; junk or an
  // inside supply on a closed one).
  function shakeBox() {
    if (!boxEl) return;
    var Sh = K.shake, calm = calmQuery.matches, d = calm ? Sh.calmPct : Sh.pct, n = calm ? Sh.calmTimes : Sh.times, frames = [{ transform: 'translateX(0)' }];
    for (var k = 0; k < n; k++) frames.push({ transform: 'translateX(-' + d + '%)' }, { transform: 'translateX(' + d + '%)' });
    frames.push({ transform: 'translateX(0)' });
    boxEl.firstChild.animate(frames, { duration: Sh.ms, easing: 'ease-in-out' });
  }
  function setRect(el, r) { el.style.left = r[0] + '%'; el.style.top = r[1] + '%'; el.style.width = r[2] + '%'; el.style.height = r[3] + '%'; }
  // The stacked boxes, the box, the two menu buttons, the menus, and the tips, for the layout.
  function placePack(L) {
    setRect(conveyor, L.conveyor);
    setRect(computer, L.computer.hit);
    ['items', 'supplies'].forEach(function (k) {
      setRect(menus[k].el, L.menu);
      menus[k].el.style.setProperty('--frame-w', K.menuFrame.border[tallQuery.matches ? 'tall' : 'wide'] + 'px');   // the frame's drawn width
    });
    beltImg.style.clipPath = polygon(L.belt);
    screenImg.style.clipPath = polygon(L.computer.screen);
    var t = L.beltTag;
    beltTag.style.left = t[0] + '%'; beltTag.style.top = t[1] + '%'; beltTag.style.width = t[2] + '%';
    if (boxEl) setBoxPlace(boxEl, L.box.x, L.box.y, L.box.h, 0);
    stacked.forEach(function (el, k) { var sp = stackSpot(L, k); setBoxPlace(el, sp.x, sp.y, sp.h, sp.tilt); });
  }

  // ---------- the hand-off (layer 1e; numbers in CONFIG.shipping.score, .finish, .card, and .ticker) ----------
  function allPacked() {
    return trip === 'here' && orders.length > 0 && orders.every(function (o, i) { return !!packed[i]; });
  }
  // The room's tips.  The chain shows how to finish: glow and sway (css; no sway with reduced motion) and the tag.
  // The belt glows with its tag from the trip's first box until the item menu first opens (1g), and the computer's
  // screen glows while a closed box waits for its stamp.  With instructions off, css hides them all.
  function updateReady() {
    var on = allPacked();
    chain.classList.toggle('is-ready', on);
    tag.hidden = !on;
    var belt = beltTip && trip === 'here' && !!boxEl;
    beltGlow.hidden = beltTag.hidden = !belt;
    screenGlow.hidden = !(trip === 'here' && boxEl && boxState === 'closed');
  }
  function makeGlow(cls) {
    var g = div('ship-glow ship-tip ' + cls);
    g.appendChild(img('ship-room'));
    g.hidden = true;
    box.appendChild(g);
    return g;
  }
  function setPose(happy) {
    var H = P.driver.happy;
    driverImg.src = happy ? H.img : P.driver.img;
    driverImg.style.translate = happy ? H.shiftX + '% 0' : '';
  }
  // One row per order.  The box still on the bench counts when it is closed with an item in it (it ships with no
  // stamp); an open or empty box is not packed and does not ship.
  function scoreShift() {
    var Sc = P.score, R = Sc.reasons, rows = [], delta = 0, shipped = [], a = activeIndex();
    var bench = a >= 0 && boxState === 'closed' && boxItem ? { item: boxItem.id, count: boxCount, inside: insideList(), outside: outsideList(), stamp: null } : null;
    orders.forEach(function (o, i) {
      var rec = packed[i] || (i === a ? bench : null), miss = {};
      if (!rec) miss.notPacked = true;
      else {
        // The supplies follow what is in the box: bubble wrap only matters around a Breakable item (1i), and each
        // sticker only on an item with its tag (1j: FRAGILE on a Breakable, HEAVY on a Heavy).
        var def = GW.econ.itemDef(rec.item), inside = rec.inside || [], outside = rec.outside || [];
        if (rec.item !== o.item.id) miss.item = true;
        if (inside.indexOf('peanuts') < 0) miss.noPeanuts = true;
        if (def && def.pack === 'breakable' && inside.indexOf('bubble') < 0) miss.noBubble = true;
        K.stickers.list.forEach(function (st) { if (def && def.pack === st.need && outside.indexOf(st.id) < 0) miss[st.reason] = true; });
        if (!rec.stamp) miss.noStamp = true;
        else if (rec.stamp !== o.place.region) miss.wrongStamp = true;
        shipped.push(rec);
      }
      var why = Sc.order.filter(function (k) { return miss[k]; }).map(function (k) { return R[k]; });   // main reason first
      var pts = Sc.regions[o.place.region] || Sc.regions[P.orders.region];
      delta += why.length ? -pts.wrong : pts.right;
      rows.push({ order: o, ok: !why.length, why: why });
    });
    return { rows: rows, delta: delta, shipped: shipped, perfect: rows.every(function (r) { return r.ok; }) };
  }
  // Into the save: each shipped box takes its recorded count off the shelf (never below the display copy; a wrong
  // item still shipped),
  // Stonks move (never below 0), and the new total joins the history.
  function applyShift(r) {
    var s = GW.game.s, keep = P.orders.keep, before = s.stonks || 0;
    r.shipped.forEach(function (rec) {
      var have = s.items[rec.item] || 0;
      s.items[rec.item] = Math.max(Math.min(have, keep), have - rec.count);
    });
    s.stonks = Math.max(0, before + r.delta);
    r.change = s.stonks - before;
    s.stonksHistory = (s.stonksHistory || []).concat([s.stonks]).slice(-P.ticker.history);
    GW.ui.buildShelf(s);
    GW.state.save(s);
  }

  // The report card: the paper with live rows over it, laid out from CONFIG.shipping.card.
  function makeCard(r) {
    var Cd = P.card, el = div('ship-card');
    el.appendChild(img('card-paper', Cd.img));
    r.rows.forEach(function (row, k) {
      var y = Cd.rows[k];
      if (!y) return;
      var o = row.order, line = div('card-row ' + (row.ok ? 'is-right' : 'is-wrong'));
      line.style.top = y[0] + '%'; line.style.height = (y[1] - y[0]) + '%';
      var mark = div('card-mark', row.ok ? '\u2714' : '\u2718');
      mark.style.left = (Cd.box[0] - Cd.box[1] / 2) + '%'; mark.style.width = Cd.box[1] + '%';
      line.appendChild(mark);
      var words = div('card-words');
      words.style.left = Cd.text[0] + '%'; words.style.width = (Cd.text[1] - Cd.text[0]) + '%';
      words.appendChild(cardLine('town', o.place.name));
      words.appendChild(cardLine('item', countName(o.qty, o.item)));
      if (!row.ok) words.appendChild(cardLine('why', mainWhy(row.why)));
      line.appendChild(words);
      var pic = div('card-pic');
      pic.style.left = Cd.pic[0] + '%'; pic.style.width = (Cd.pic[1] - Cd.pic[0]) + '%';
      pic.appendChild(GW.ui.itemIcon(o.item));
      line.appendChild(pic);
      line.setAttribute('aria-label', o.place.name + ', ' + countName(o.qty, o.item) + ': ' + (row.ok ? 'shipped' : row.why.join(', ')));
      el.appendChild(line);
    });
    var c = r.change, total = div('card-total', 'Stonks this shift: ' + (c > 0 ? '+' : c < 0 ? '\u2212' : '') + Math.abs(c));
    total.style.top = Cd.total + '%';
    el.appendChild(total);
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', 'Report card');
    return el;
  }
  // A row's main reason and a count of the rest (1i): "No peanuts +1".
  function mainWhy(why) {
    return why[0] + (why.length > 1 ? P.score.more.replace('{n}', why.length - 1) : '');
  }
  // One line of a card row at its full size; fitCard shrinks it once it is on screen.
  function cardLine(kind, text) {
    var el = div('card-' + kind + ' card-line', text);
    el.dataset.kind = kind;
    el.title = text;
    el.style.fontSize = P.card.font[kind] + 'cqw';
    return el;
  }
  // Each line that is wider than its row shrinks its own text to fit, down to CONFIG.shipping.card.fontMin;
  // past that the css ends it with "...".  Sizes are in cqw, so the fit holds as the card grows or shrinks.
  function fitCard() {
    var Cd = P.card;
    Array.prototype.forEach.call(cardView.querySelectorAll('.card-line'), function (el) {
      var k = el.dataset.kind, size = Cd.font[k];
      el.style.fontSize = size + 'cqw';
      var need = el.scrollWidth, room = el.clientWidth;
      if (need > room && need > 0) size = Math.max(Cd.fontMin[k], size * room / need * Cd.fitSlack);
      el.style.fontSize = size + 'cqw';
    });
  }
  function showCard(r) {
    pendingCard = null;
    cardView.textContent = '';
    cardView.appendChild(makeCard(r));
    cardView.hidden = false;
    cardOpen = true;
    fitCard();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (cardOpen) fitCard(); });
    GW.sfx.click();
  }
  function closeCard() {
    if (!cardOpen) return;
    cardView.hidden = true; cardView.textContent = '';
    cardOpen = false;
    tickTo();
    var go = afterCard;                // a leave that waited for the card (1f)
    afterCard = null;
    if (go) go();
  }

  // ---------- leaving mid-trip (1f; words and sizes in CONFIG.shipping.leave) ----------
  function buildWarn() {
    var W = P.leave;
    warnView = div('ship-warn-view');
    warnView.hidden = true;
    warnView.addEventListener('pointerdown', function (e) { e.stopPropagation(); });   // the room under it gets nothing
    warnPanel = div('ship-warn');
    warnPanel.setAttribute('role', 'alertdialog');
    warnPanel.setAttribute('aria-label', W.title);
    warnPanel.style.borderImageSource = 'url("' + P.slip.paper + '")';
    warnPanel.style.borderImageSlice = W.slice + ' fill';
    var body = div('warn-body');                // the panel is the size container, so its insides use cqw
    body.appendChild(U.el('i', 'slip-stripes'));
    body.appendChild(div('warn-title', W.title));
    body.appendChild(div('warn-text', W.text));
    var row = div('warn-buttons');
    warnStay = U.el('button', 'warn-btn warn-stay', W.stay);
    var go = U.el('button', 'warn-btn warn-go', W.go);
    warnStay.type = go.type = 'button';
    warnStay.addEventListener('click', function () { closeWarn(); });
    go.addEventListener('click', function (e) { if (e.isTrusted) sendOff(); });
    row.appendChild(warnStay); row.appendChild(go);
    body.appendChild(row);
    warnPanel.appendChild(body);
    warnView.appendChild(warnPanel);
    box.appendChild(warnView);
  }
  function openWarn(go) {
    closeSlip(); closeMenu();
    warnGo = go;
    warnView.hidden = false; warnOpen = true;
    GW.sfx.click();
    warnStay.focus({ preventScroll: true });
  }
  function closeWarn() {
    if (!warnOpen) return;
    warnView.hidden = true; warnOpen = false; warnGo = null;
  }
  // Send it off: the same hand-off as pulling the chain, then leave once the report card closes.
  function sendOff() {
    var go = warnGo;
    closeWarn();
    if (trip !== 'here') return;
    afterCard = go;
    pull();
  }
  // main.js asks before leaving the room for another view.  true = held here (go runs later, or never on Stay);
  // false = leave now.
  function holdLeave(go) {
    if (!active) return false;
    if (trip === 'leaving') { afterCard = go; return true; }          // the chain is pulled: wait for the card
    if (trip === 'closed' && pendingCard) { afterCard = go; showCard(pendingCard); return true; }
    if (trip === 'here' && orders.length && !cardOpen) { openWarn(go); return true; }
    return false;
  }

  // The STONKS screen: GRIP, our Stonks, and a line of the last shifts' totals, drawn inside the painted glass.
  function buildScreen() {
    var NS = 'http://www.w3.org/2000/svg';
    screenEl = div('ship-stonks');
    screenEl.style.setProperty('--ticker', P.ticker.color);
    var top = div('stonks-top');
    top.appendChild(div('stonks-label', P.ticker.label));
    screenNum = div('stonks-num', '0');
    top.appendChild(screenNum);
    screenEl.appendChild(top);
    var chart = div('stonks-chart'), svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('preserveAspectRatio', 'none');
    screenLine = document.createElementNS(NS, 'polyline');
    screenLine.setAttribute('vector-effect', 'non-scaling-stroke');
    svg.appendChild(screenLine);
    chart.appendChild(svg);
    screenDot = U.el('i', 'stonks-dot');
    chart.appendChild(screenDot);
    screenEl.appendChild(chart);
    screenEl.setAttribute('aria-label', 'Stonks');
    box.appendChild(screenEl);
  }
  // hist = the totals to plot, oldest first, spread across the glass's full width, first to last.  One shift
  // draws a flat line across at its value, with the dot at its right end.
  function drawTicker(value, hist) {
    var max = Math.max(1, Math.max.apply(null, hist.concat([value]))) * 1.15;
    screenNum.textContent = U.fmt(Math.round(value));
    screenEl.setAttribute('aria-label', P.ticker.label + ' Stonks: ' + Math.round(value));
    var row = hist.length === 1 ? [hist[0], hist[0]] : hist;
    var pts = row.map(function (v, i) { return [i * 100 / (row.length - 1), 100 - v / max * 100]; });
    screenLine.setAttribute('points', pts.map(function (p) { return p[0].toFixed(2) + ',' + p[1].toFixed(2); }).join(' '));
    var last = pts[pts.length - 1];
    screenDot.hidden = !last;
    if (last) { screenDot.style.left = last[0] + '%'; screenDot.style.top = last[1] + '%'; }
  }
  // Counts the number (and the newest point) up from what the screen shows to the saved total.
  function tickTo() {
    var s = GW.game.s, to = s.stonks || 0, hist = (s.stonksHistory || []).slice(), from = shown === null ? to : shown;
    cancelAnimationFrame(tickAnim);
    shown = to;
    if (calmQuery.matches || from === to || !hist.length) { drawTicker(to, hist); return; }
    screenEl.classList.remove('is-ticking'); void screenEl.offsetWidth; screenEl.classList.add('is-ticking');
    var t0 = performance.now(), prev = hist.length > 1 ? hist[hist.length - 2] : from;
    function frame(now) {
      var k = Math.min(1, (now - t0) / P.ticker.tickMs), e = 1 - Math.pow(1 - k, 3), h = hist.slice();
      h[h.length - 1] = prev + (to - prev) * e;
      drawTicker(from + (to - from) * e, h);
      if (k < 1) tickAnim = requestAnimationFrame(frame);
    }
    tickAnim = requestAnimationFrame(frame);
  }
  function placeHandoff(L) {
    var st = L.stonks, t = L.finishTag;
    screenEl.style.left = st[0] + '%'; screenEl.style.top = st[1] + '%'; screenEl.style.width = st[2] + '%'; screenEl.style.height = st[3] + '%';
    tag.style.right = (100 - t[0]) + '%'; tag.style.top = t[1] + '%'; tag.style.width = t[2] + '%';
    var k = tallQuery.matches ? 'tall' : 'wide';
    warnPanel.style.width = P.leave.width[k] + '%';
    warnPanel.style.borderWidth = P.leave.edge[k] + 'px';
  }

  // ---------- the menus: the item menu (1d) and the supplies menu (1g) ----------
  // Both are built the same way: the same place, size, 05a frame, scrolling, and drag.  kind = 'items' | 'supplies'.
  function buildMenu(kind, label) {
    var m = { kind: kind, el: div('ship-menu ship-menu-' + kind) };
    m.el.hidden = true;
    m.el.setAttribute('role', 'dialog');
    m.el.setAttribute('aria-label', label);
    // The frame (05a) sits behind the tiles as a nine-slice; Night dims the frame only, as it does the slips.
    var frame = div('ship-menu-frame');
    frame.style.borderImageSource = 'url("' + K.menuFrame.img + '")';
    frame.style.borderImageSlice = K.menuFrame.slice + ' fill';
    frame.style.borderImageRepeat = 'stretch';
    m.el.appendChild(frame);
    m.list = div('ship-menu-list');
    m.el.appendChild(m.list);
    m.list.addEventListener('pointerdown', function (e) { menuDown(e, m); });
    m.list.addEventListener('pointermove', menuMove);
    m.list.addEventListener('pointerup', menuUp);
    m.list.addEventListener('pointercancel', function () { endDrag(); });
    m.list.addEventListener('lostpointercapture', function () { if (drag && drag.mode !== 'drag') endDrag(); });
    box.appendChild(m.el);
    return m;
  }
  // An invisible tap area over a painted button in the room: a real tap opens its menu, or closes it when open.
  function menuButton(cls, kind) {
    var b = U.el('div', cls);
    b.addEventListener('pointerdown', function (e) {
      e.stopPropagation();
      if (!e.isTrusted || e.button > 0 || slipOpen) return;
      e.preventDefault();
      if (menuKind === kind) closeMenu(); else openMenu(kind);
    });
    box.appendChild(b);
    return b;
  }
  function section(list, name) {
    list.appendChild(div('ship-menu-head', name));
    var grid = div('ship-menu-grid');
    list.appendChild(grid);
    return grid;
  }
  // Tiles like the shelf's: icon, name, count.  Items with keep (1) or fewer are greyed out and can't be picked up.
  function fillItems(list) {
    var shelf = GW.game.s.items || {};
    list.textContent = '';
    K.groups.forEach(function (gid) {
      var g = C.groups.filter(function (x) { return x.id === gid; })[0];
      var items = C.items.filter(function (it) { return it.group === gid; });
      if (!g || !items.length) return;
      var grid = section(list, g.name);
      items.forEach(function (item) {
        var n = shelf[item.id] || 0, known = n > 0;
        var t = div('shelf-tile ship-tile' + (known ? '' : ' unknown') + (n > P.orders.keep ? '' : ' is-off'));
        t.dataset.item = item.id;
        t.style.borderColor = C.tiers[item.tier].color;
        t.appendChild(known ? GW.ui.itemIcon(item) : U.el('span', 'item-icon', '?'));
        t.appendChild(div('tile-name', known ? item.name : '???'));
        t.appendChild(div('tile-count', known ? '×' + U.fmt(n) : ''));
        var tg = known && tagIcon(item, 'tile-tag');       // the item's packing tag in the tile's corner (1i)
        if (tg) t.appendChild(tg);
        grid.appendChild(t);
      });
    });
  }
  // The supplies the player has, by section (layer 1: the inside supplies, the stickers, and the region stamps).
  // side = which box takes it: 'outside' marks go on a closed box, 'inside' supplies in an open one.
  function supplies(sid) {
    if (sid === 'packing') return K.inside.map(function (sp) {
      return { kind: 'supply', side: 'inside', id: sp.id, name: sp.name, img: sp.img };
    });
    if (sid === 'stickers') return K.stickers.list.map(function (st) {
      return { kind: 'sticker', side: 'outside', id: st.id, name: st.name, img: st.img };
    });
    if (sid === 'stamps') return K.stamps.map(function (rid) {
      return { kind: 'stamp', side: 'outside', id: rid, name: regionOf(rid).name, img: P.slip.stampImg.replace('{region}', rid) };
    });
    return [];
  }
  function supplyIcon(s) { var w = U.el('span', 'item-icon supply-icon'); w.appendChild(img('', s.img)); return w; }
  // The "Packing rules" chart (1i), live text, one line per rule with its icon.
  function makeChart() {
    var Ch = K.chart, el = div('ship-rules');
    el.appendChild(div('ship-rules-title', Ch.title));
    Ch.rows.forEach(function (r) {
      var row = div('ship-rule'), sp = K.inside.filter(function (x) { return x.id === r.icon; })[0], tg = K.tags[r.icon];
      var pic = img('ship-rule-icon', sp ? sp.img : tg ? tg.img : '');
      row.appendChild(pic);
      row.appendChild(U.el('span', 'ship-rule-text', r.text));
      el.appendChild(row);
    });
    return el;
  }
  // The chart, then headed sections like the item menu's groups; an empty section is not shown.
  function fillSupplies(list) {
    list.textContent = '';
    list.appendChild(makeChart());
    K.supplies.sections.forEach(function (sec) {
      var things = supplies(sec.id);
      if (!things.length) return;
      var grid = section(list, sec.name);
      things.forEach(function (s) {
        var t = div('shelf-tile ship-tile supply-tile');
        t.dataset.supply = s.kind + ':' + s.id;
        t.appendChild(supplyIcon(s));
        t.appendChild(div('tile-name', s.name));
        t.appendChild(div('tile-count', ''));
        t.setAttribute('aria-label', s.name + ' ' + sec.name);
        grid.appendChild(t);
      });
    });
  }
  function openMenu(kind) {
    if (menuKind === kind) return;
    closeMenu();
    var m = menus[kind];
    if (kind === 'items') { fillItems(m.list); beltTip = false; updateReady(); }
    else fillSupplies(m.list);
    m.el.hidden = false; menuKind = kind;
    m.list.scrollTop = 0;
    GW.sfx.click();
  }
  function closeMenu() {
    endDrag();
    if (!menuKind) return;
    menus[menuKind].el.hidden = true; menuKind = null;
  }

  // Dragging a tile: a mouse picks it up after a small move.  A finger scrolls the menu, unless it holds still
  // on a tile (holdMs) or carries the tile out of the menu.  The picked-up tile follows the pointer as a ghost.
  // A pressed tile shows it is picked up (is-held); a tap that never moves does nothing else.
  // thing = what a tile carries: { side: 'inside', item } for junk, or a supply from supplies().
  var drag = null;
  function tileThing(t, m) {
    if (!t || t.classList.contains('is-off')) return null;
    if (m.kind === 'items') { var item = GW.econ.itemDef(t.dataset.item); return item ? { kind: 'item', side: 'inside', item: item } : null; }
    var key = t.dataset.supply, all = [];
    K.supplies.sections.forEach(function (sec) { all = all.concat(supplies(sec.id)); });
    return all.filter(function (s) { return s.kind + ':' + s.id === key; })[0] || null;
  }
  function menuDown(e, m) {
    if (!e.isTrusted || e.button > 0 || !e.isPrimary) return;
    e.preventDefault();
    endDrag();
    var t = e.target.closest('.ship-tile');
    drag = { id: e.pointerId, m: m, x0: e.clientX, y0: e.clientY, scroll0: m.list.scrollTop, thing: tileThing(t, m), tile: t,
      touch: e.pointerType !== 'mouse', mode: 'press', hold: null, ghost: null };
    if (drag.thing) t.classList.add('is-held');
    try { m.list.setPointerCapture(e.pointerId); } catch (err) {}
    if (drag.touch && drag.thing) {
      var d = drag;
      d.hold = setTimeout(function () { if (drag === d && d.mode === 'press') startDrag(d.x0, d.y0); }, K.holdMs);
    }
  }
  function outsideMenu(x, y) {
    var r = drag.m.el.getBoundingClientRect();
    return x < r.left || x > r.right || y < r.top || y > r.bottom;
  }
  function menuMove(e) {
    if (!drag || e.pointerId !== drag.id) return;
    var dx = e.clientX - drag.x0, dy = e.clientY - drag.y0, far = Math.abs(dx) > K.slopPx || Math.abs(dy) > K.slopPx;
    if (drag.mode === 'press' && far) {
      clearTimeout(drag.hold);
      if (!drag.touch) { if (drag.thing) startDrag(e.clientX, e.clientY); else drag.mode = 'none'; }
      else { drag.mode = 'scroll'; if (drag.tile) drag.tile.classList.remove('is-held'); }
    }
    if (drag.mode === 'scroll') {
      if (drag.thing && outsideMenu(e.clientX, e.clientY)) { drag.m.list.scrollTop = drag.scroll0; startDrag(e.clientX, e.clientY); }
      else drag.m.list.scrollTop = drag.scroll0 - dy;
    }
    if (drag.mode === 'drag') moveGhost(e.clientX, e.clientY);
  }
  // The right side of the box takes it; anything dropped on the wrong side only shakes it (a stamp on an open box,
  // junk or an inside supply on a closed one).
  function menuUp(e) {
    if (!drag || e.pointerId !== drag.id) return;
    if (drag.mode === 'drag' && overBox(e.clientX, e.clientY)) {
      var th = drag.thing;
      if (!fits(th)) shakeBox();
      else if (th.kind === 'item') fillBox(th.item);
      else if (th.kind === 'supply') addSupply(th.id);
      else if (th.kind === 'sticker') addSticker(th.id);
      else stampBox(th.id);
    }
    endDrag();
  }
  // An open box takes junk and inside supplies; a closed, unstamped box takes outside marks (stickers and stamps).
  function fits(th) { return th.side === 'inside' ? boxState === 'open' : boxState === 'closed'; }
  function startDrag(x, y) {
    drag.mode = 'drag';
    drag.tile.classList.remove('is-held');
    drag.tile.classList.add('is-lifted');
    drag.ghost = U.el('div', 'ship-ghost' + (drag.touch ? ' touch' : ''));
    drag.ghost.appendChild(drag.thing.kind === 'item' ? GW.ui.itemIcon(drag.thing.item, true) : supplyIcon(drag.thing));
    document.body.appendChild(drag.ghost);
    moveGhost(x, y);
  }
  function moveGhost(x, y) {
    drag.ghost.style.left = x + 'px'; drag.ghost.style.top = y + 'px';
    if (boxEl) boxEl.classList.toggle('drop-ok', overBox(x, y) && fits(drag.thing));
  }
  function overBox(x, y) {
    if (!boxEl || (boxState !== 'open' && boxState !== 'closed')) return false;
    var r = boxEl.getBoundingClientRect(), padX = r.width * K.dropPad / 100, padY = r.height * K.dropPad / 100;
    return x >= r.left - padX && x <= r.right + padX && y >= r.top - padY && y <= r.bottom + padY;
  }
  function endDrag() {
    if (!drag) return;
    clearTimeout(drag.hold);
    if (drag.ghost) drag.ghost.remove();
    if (drag.tile) drag.tile.classList.remove('is-lifted', 'is-held');
    if (boxEl) boxEl.classList.remove('drop-ok');
    var id = drag.id, list = drag.m.list;
    drag = null;
    try { if (list.hasPointerCapture(id)) list.releasePointerCapture(id); } catch (err) {}
  }

  // ---------- placing things (all positions in % of the room) ----------
  function polygon(points) { return 'polygon(' + points.map(function (p) { return p[0] + '% ' + p[1] + '%'; }).join(', ') + ')'; }
  // He stands at his feet point.
  function driverTransform(scale) { return 'translate(-50%, -100%) scale(' + scale + ')'; }
  function placeTruck(x) { truck.style.left = x + '%'; }
  function placeDriver(xy, scale, shown) {
    driver.style.left = xy[0] + '%'; driver.style.top = xy[1] + '%';
    driver.style.transform = driverTransform(scale);
    driver.style.opacity = shown ? '1' : '0';
  }
  // Puts everything where the current trip state says, with no motion.
  function settle() {
    var L = layout(), here = trip === 'here';
    box.classList.toggle('is-open', open);
    placeTruck(here ? L.truck.xTo : L.truck.xFrom);
    truck.style.visibility = here ? 'visible' : 'hidden';
    placeDriver(here ? L.driver.at : L.driver.from, here ? 1 : L.driver.fromScale, here);
  }

  // Both twins stay loaded and stacked, so opening is an instant swap with no jump.
  // A theme change only swaps pictures; a layout change (or entering the view) also re-places everything.
  var drawnLayout = null;
  function redraw(force) {
    if (!built) return;
    var L = layout(), m = document.getElementById('machine'), wh = L.aspect.split('/');
    closedImg.src = GW.theme.img(L.closed);
    openImg.src = GW.theme.img(L.open);
    rollerClosed.src = closedImg.src; rollerOpen.src = openImg.src;
    beltImg.src = screenImg.src = closedImg.src;       // the belt and the computer look the same with the door open
    if (L === drawnLayout && force !== true) return;
    drawnLayout = L;
    m.style.setProperty('--ship-aspect', L.aspect);
    m.style.setProperty('--ship-ratio', (parseFloat(wh[0]) / parseFloat(wh[1])).toFixed(4));
    chain.style.left = L.chain.x + '%';
    chain.style.top = L.chain.top + '%';
    chain.style.height = L.chain.h + '%';
    chain.style.width = L.chain.hitW + '%';
    // The truck shows inside the doorway, or inside truckClip where the layout has one (it backs into the room).
    bay.style.clipPath = polygon(L.truckClip || L.doorway);
    roller.style.display = L.roller ? '' : 'none';
    if (L.roller) roller.style.clipPath = polygon(L.roller);
    truck.style.height = L.truck.h + '%';
    truck.style.top = L.truck.top + '%';
    driver.style.height = L.driver.h + '%';
    placeBoard(L, parseFloat(wh[0]) / parseFloat(wh[1]));
    // A layout change mid-trip skips to where the trip was heading.
    placePack(L);
    placeHandoff(L);
    var made = false;
    if (trip === 'arriving') { trip = 'here'; made = true; }
    if (trip === 'leaving') { trip = 'closed'; open = false; }
    stopAnims();
    settle();
    if (made) newOrders(); else showBoard();
    if (trip === 'closed' && pendingCard) showCard(pendingCard);
  }

  // ---------- the trip ----------
  function stopAnims() { tripId++; anims.forEach(function (a) { a.cancel(); }); anims = []; }
  function play(el, frames, opts) {
    var a = el.animate(frames, opts);
    anims.push(a);
    return a.finished;
  }
  // Runs the steps in order; a newer trip (or leaving the view) stops the rest.
  function steps(list) {
    var id = tripId, p = Promise.resolve();
    list.forEach(function (fn) { p = p.then(function () { if (id === tripId) return fn(); }); });
    return p.catch(function () {});   // cancelled animations reject; that's fine
  }
  function walk(fromXY, fromScale, toXY, toScale, fadeIn, fadeOut) {
    var calm = calmQuery.matches;
    var a = { left: fromXY[0] + '%', top: fromXY[1] + '%', transform: driverTransform(fromScale), opacity: fadeIn ? 0 : 1 };
    var mid = { offset: 0.2, opacity: 1 };
    var nearEnd = { offset: 0.8, opacity: 1 };
    var b = { left: toXY[0] + '%', top: toXY[1] + '%', transform: driverTransform(toScale), opacity: fadeOut ? 0 : 1 };
    var frames = fadeIn ? [a, mid, b] : fadeOut ? [a, nearEnd, b] : [a, b];
    placeDriver(toXY, toScale, !fadeOut);
    if (!calm) {
      var stepCount = Math.max(1, Math.round(T.walkMs / T.stepMs));
      play(driverImg, [{ transform: 'translateY(0)' }, { transform: 'translateY(-' + T.bob + '%)' }, { transform: 'translateY(0)' }],
        { duration: T.stepMs, iterations: stepCount, easing: 'ease-in-out' });
    }
    return play(driver, frames, { duration: T.walkMs, easing: 'ease-in-out' });
  }

  function arrive() {
    var L = layout();
    stopAnims();
    setPose(false);
    trip = 'arriving'; open = true;
    settle();
    truck.style.visibility = 'visible';
    steps([
      function () {
        placeTruck(L.truck.xTo);
        return play(truck, [{ left: L.truck.xFrom + '%' }, { left: L.truck.xTo + '%' }], { duration: T.truckInMs, easing: 'cubic-bezier(.2,.7,.3,1)' });
      },
      function () {
        if (calmQuery.matches) return;
        return play(truck, [{ transform: 'translateY(0)' }, { transform: 'translateY(' + T.settle + '%)', offset: 0.35 },
          { transform: 'translateY(-' + (T.settle * 0.3) + '%)', offset: 0.7 }, { transform: 'translateY(0)' }], { duration: T.settleMs, easing: 'ease-out' });
      },
      function () { return new Promise(function (r) { setTimeout(r, T.walkDelayMs); }); },
      function () { return walk(L.driver.from, L.driver.fromScale, L.driver.at, 1, true, false); },
      function () { trip = 'here'; anims = []; newOrders(); }
    ]);
  }

  // r = the scored shift (null when there were no orders).  A perfect shift gets the thumbs up first.
  function leave(r) {
    var L = layout();
    stopAnims();
    trip = 'leaving';
    pendingCard = r;
    clearOrders();                  // closing the door takes the orders with it
    steps([
      function () {
        if (!r || !r.perfect) return;
        setPose(true);
        return new Promise(function (ok) { setTimeout(ok, P.driver.happyMs); });
      },
      function () { return walk(L.driver.at, 1, L.driver.from, L.driver.fromScale, false, true); },
      function () {
        placeTruck(L.truck.xFrom);
        return play(truck, [{ left: L.truck.xTo + '%' }, { left: L.truck.xFrom + '%' }], { duration: T.truckOutMs, easing: 'cubic-bezier(.6,0,.8,.4)' });
      },
      function () { truck.style.visibility = 'hidden'; return new Promise(function (r) { setTimeout(r, T.closeDelayMs); }); },
      function () { open = false; trip = 'closed'; anims = []; settle(); if (pendingCard) showCard(pendingCard); }
    ]);
  }

  function pull() {
    chain.classList.remove('pull'); void chain.offsetWidth; chain.classList.add('pull');
    clearTimeout(bounceTimer);
    bounceTimer = setTimeout(function () { chain.classList.remove('pull'); }, P.chain.pullMs);
    GW.sfx.click();
    if (trip === 'closed') arrive();
    else if (trip === 'here') {
      var r = orders.length ? scoreShift() : null;
      if (r) applyShift(r);
      leave(r);
    }
  }

  // main.js calls this whenever the view changes.  Entering the room always starts with the door closed.
  function setActive(on) {
    if (on && !built) build();
    if (on && !active) {
      stopAnims(); trip = 'closed'; open = false; orders = []; closeSlip(); resetPack(); setPose(false); redraw(true);
      cancelAnimationFrame(tickAnim); shown = GW.game.s.stonks || 0; drawTicker(shown, (GW.game.s.stonksHistory || []).slice());
    }
    if (!on && active) { stopAnims(); closeSlip(); closeMenu(); closeWarn(); afterCard = null; pendingCard = null; cardOpen = false; cardView.hidden = true; cardView.textContent = ''; }
    document.documentElement.classList.toggle('ship-still', on);   // phones: the page holds still (css)
    // Drags in the room no longer scroll the page, so on a phone the whole room (the conveyor included) is
    // scrolled into view as it opens.  Desktop is left as it is.
    if (on && tallQuery.matches) requestAnimationFrame(function () {
      var r = box.getBoundingClientRect(), dy = r.bottom > window.innerHeight ? Math.min(r.bottom - window.innerHeight, r.top) : Math.min(r.top, 0);
      if (dy) window.scrollBy(0, dy);
    });
    active = on;
  }

  return {
    enabled: enabled, setActive: setActive, redraw: redraw,
    isOpen: function () { return open; }, tripState: function () { return trip; },
    orders: function () { return orders.slice(); }, slipOpen: function () { return slipOpen; },
    menuOpen: function () { return !!menuKind; }, menuKind: function () { return menuKind; }, boxState: function () { return boxState; },
    activeOrder: activeIndex, cardOpen: function () { return cardOpen; },
    holdLeave: holdLeave, warnOpen: function () { return warnOpen; },
    // Tapping Shipping again while a leave waits for the card stays in the room.
    stay: function () { closeWarn(); afterCard = null; },
    // Test hook (1e.1): shows a report card for a made-up result ({ rows: [{ order, ok, why }], change }),
    // without scoring or saving, so screenshots can try the longest names.
    testCard: function (r) { if (built) showCard(r); },
    // What was packed, for the hand-off (1e): one entry per order, null until stamped.
    packed: function () { return packed.map(function (r) { return r && { item: r.item, count: r.count, inside: r.inside.slice(), outside: r.outside.slice(), stamp: r.stamp }; }); },
    // What is in the box on the bench (1i): its state, item, inside supplies, and stickers (1j).
    bench: function () { return { state: boxState, item: boxItem && boxItem.id, inside: insideList(), outside: outsideList() }; }
  };
})();
