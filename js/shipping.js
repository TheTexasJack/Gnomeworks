/* The shipping room, the Packing Line's view (layers 1a to 1c-2): the room art, the door chain,
   Gnomerica's truck and driver, and the work orders on the order board.  Hidden from players while CONFIG.shipping.enabled is false; ?ship=1 in
   the address shows it for testing.  Nothing ships yet.  The door starts closed each time the view opens
   and is not saved.
   A trip: pulling the chain opens the door, the truck backs through the doorway into the room and settles, then the driver
   walks in a short way and waits, grumpy.  Pulling again sends him out, the truck drives off, and the door
   shows closed.
   Work orders (1c-2): when the driver finishes walking in, up to three slips pin to the order board, each a
   Gnomerica place asking for one item the shelf holds more than 1 of.  A tap opens a slip full size; any tap
   or Escape closes it.  Orders are not saved, and closing the door clears them.
   Packing (1d): a tap on the conveyor opens the item menu.  The active order (the leftmost unpacked one) has an
   open box on the bench; dragging a tile onto it puts that pile in, down to the display copy.  A tap closes a
   filled box (or opens a closed one again), the stamp tray then offers the region stamps, and a stamped box moves
   to the stack by the truck while the next order's box appears.  The record of what was packed (GW.ship.packed())
   is for the hand-off (1e); nothing ships, nothing is saved, and closing the door clears it all. */
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
  var K = P.pack, conveyor, packLayer, boxEl = null, tray, menu, menuList, menuOpen = false, stacked = [];
  var packed = [], boxItem = null, boxCount = 0, boxState = 'none';   // boxState: 'none' | 'open' | 'closed' | 'stamped'

  function enabled() {
    return !!P.enabled || new RegExp('[?&]' + P.testParam + '=1(&|$)').test(window.location.search);
  }
  function layout() { return P.layouts[tallQuery.matches ? 'tall' : 'wide']; }
  function img(cls, src) { var i = U.el('img', cls); i.alt = ''; i.draggable = false; if (src) i.src = src; return i; }

  function build() {
    box = document.getElementById('ship');
    closedImg = img('ship-room'); openImg = img('ship-room ship-open');
    box.appendChild(closedImg); box.appendChild(openImg);
    // The order board sits on the back wall, so the truck and the driver draw in front of it.
    board = U.el('div', 'ship-board');
    box.appendChild(board);
    // The bay is clipped to the doorway, so the truck only shows through the opening, behind the frame.
    bay = U.el('div', 'ship-bay');
    truck = img('ship-truck', P.truck.img);
    bay.appendChild(truck);
    box.appendChild(bay);
    driver = U.el('div', 'ship-driver');
    driverImg = img('', P.driver.img);
    driver.appendChild(driverImg);
    box.appendChild(driver);
    // Packing (1d): the box, the stamp tray, and the stack draw in front of the driver (the box has the stage).
    conveyor = U.el('div', 'ship-conveyor');
    conveyor.addEventListener('pointerdown', function (e) {
      e.stopPropagation();
      if (!e.isTrusted || e.button > 0 || slipOpen) return;
      e.preventDefault();
      openMenu();
    });
    box.appendChild(conveyor);
    packLayer = U.el('div', 'ship-pack');
    tray = U.el('div', 'ship-tray');
    tray.hidden = true;
    K.stamps.forEach(function (rid) {
      var b = U.el('button', 'tray-stamp');
      b.type = 'button';
      b.setAttribute('aria-label', regionOf(rid).name + ' stamp');
      b.appendChild(img('', P.slip.stampImg.replace('{region}', rid)));
      b.addEventListener('pointerdown', function (e) {
        e.stopPropagation();
        if (!e.isTrusted || e.button > 0) return;
        e.preventDefault();
        stampBox(rid);
      });
      tray.appendChild(b);
    });
    packLayer.appendChild(tray);
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
      if (slipOpen || trip === 'arriving' || trip === 'leaving') return;   // one trip at a time
      pull();
    });
    box.appendChild(chain);
    // The roller: the same room art again, cut to the roller's outline and drawn in front of the chain, so the
    // chain's top end stays hidden behind it while the chain is pulled.  Its twins follow the door like the room's.
    roller = U.el('div', 'ship-roller');
    rollerClosed = img('ship-room'); rollerOpen = img('ship-room ship-open');
    roller.appendChild(rollerClosed); roller.appendChild(rollerOpen);
    box.appendChild(roller);
    // An open slip covers the whole room, so the chain and everything else under it get no taps.
    buildMenu();
    viewer = U.el('div', 'ship-slip-view');
    viewer.hidden = true;
    viewer.addEventListener('pointerdown', function (e) {
      e.stopPropagation(); e.preventDefault();
      closeSlip();
    });
    box.appendChild(viewer);
    box.style.setProperty('--slip-night', P.slip.nightBrightness);
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (slipOpen) { e.preventDefault(); closeSlip(); } else if (menuOpen) { e.preventDefault(); closeMenu(); }
    });
    // A tap outside the open menu closes it.  Inside the room that tap does nothing else.
    document.addEventListener('pointerdown', function (e) {
      if (!menuOpen || menu.contains(e.target)) return;
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
  // One order from a random place that buys something the shelf can spare; a place with nothing to spare is
  // passed over for another.  used = item ids already asked for on this board.
  function pickOrder(places, used) {
    var O = P.orders, shelf = GW.game.s.items || {}, list = shuffled(places);
    for (var i = 0; i < list.length; i++) {
      var ok = list[i].buys.filter(function (id) { return (shelf[id] || 0) > O.keep && !used[id] && GW.econ.itemDef(id); });
      if (ok.length) return { place: list[i], item: GW.econ.itemDef(ok[Math.floor(Math.random() * ok.length)]), qty: O.perOrder };
    }
    return null;
  }
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
    line.appendChild(U.el('span', '', order.item.name));
    line.appendChild(GW.ui.itemIcon(order.item));
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
  }
  function openSlip(order) {
    viewer.textContent = '';
    viewer.appendChild(makeSlip(order, P.slip.stamp.open));
    viewer.hidden = false;
    slipOpen = true;
    GW.sfx.click();
  }
  function closeSlip() {
    if (!slipOpen) return;
    viewer.hidden = true; viewer.textContent = '';
    slipOpen = false;
  }
  function clearOrders() { orders = []; closeSlip(); resetPack(); showBoard(); }
  function newOrders() { orders = makeOrders(); resetPack(); showBoard(); nextBox(); }


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
  // A box: the open and closed pictures stacked (same canvas, so they swap with no jump), the label, and the stamp.
  function makeBox() {
    var el = div('ship-box'), body = div('box-body');
    body.appendChild(img('box-art box-open', K.boxOpen));
    body.appendChild(img('box-art box-closed', K.boxClosed));
    var label = div('box-label'); label.hidden = true;
    body.appendChild(label);
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
    label.hidden = !boxItem;
    if (boxItem) {
      label.appendChild(GW.ui.itemIcon(boxItem));
      label.appendChild(U.el('span', 'box-count', U.fmt(boxCount)));
      label.setAttribute('aria-label', U.fmt(boxCount) + ' ' + boxItem.name);
    }
    tray.hidden = boxState !== 'closed';
  }
  function resetPack() {
    packed = []; boxItem = null; boxCount = 0; boxState = 'none';
    if (boxEl) { boxEl.remove(); boxEl = null; }
    stacked.forEach(function (el) { el.remove(); }); stacked = [];
    if (tray) tray.hidden = true;
  }
  // The active order's empty box appears on the bench; with every order packed, none does.
  function nextBox() {
    if (boxEl || trip !== 'here' || activeIndex() < 0) return;
    var L = layout();
    boxItem = null; boxCount = 0; boxState = 'open';
    boxEl = makeBox();
    setBoxPlace(boxEl, L.box.x, L.box.y, L.box.h, 0);
    boxEl.addEventListener('pointerdown', function (e) {
      e.stopPropagation();
      if (!e.isTrusted || e.button > 0) return;
      e.preventDefault();
      tapBox();
    });
    packLayer.insertBefore(boxEl, tray);
    showBox();
    if (!calmQuery.matches) boxEl.firstChild.animate([{ transform: 'scale(.6)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }],
      { duration: K.nextMs, easing: 'cubic-bezier(.3,1.4,.5,1)' });
  }
  function tapBox() {
    if (boxState === 'open' && boxItem) { boxState = 'closed'; GW.sfx.click(); showBox(); }
    else if (boxState === 'closed') { boxState = 'open'; GW.sfx.click(); showBox(); }
  }
  // Drop a pile in the open box: the whole pile down to the display copy.  A different item replaces the first.
  function fillBox(item) {
    if (boxState !== 'open') return;
    var have = (GW.game.s.items || {})[item.id] || 0;
    if (have <= P.orders.keep) return;
    boxItem = item; boxCount = have - P.orders.keep;
    GW.sfx.drop(item.tier, true);
    showBox();
    if (!calmQuery.matches) boxEl.firstChild.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(2%) scaleY(.97)' }, { transform: 'translateY(0)' }],
      { duration: K.thumpMs, easing: 'ease-out' });
  }
  function stampBox(rid) {
    if (boxState !== 'closed') return;
    var i = activeIndex(), el = boxEl, calm = calmQuery.matches;
    boxState = 'stamped';
    tray.hidden = true;
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
      // The record for 1e: the item, its count at packing time, and the stamp used.
      packed[i] = { item: boxItem.id, count: boxCount, stamp: rid };
      showBoard();
      return new Promise(function (r) { setTimeout(r, K.setAsideDelayMs); });
    }).then(function () {
      if (id !== tripId || el !== boxEl) return;
      var L = layout(), spot = stackSpot(L, stacked.length), from = { left: el.style.left, top: el.style.top, height: el.style.height };
      setBoxPlace(el, spot.x, spot.y, spot.h, spot.tilt);
      el.classList.add('is-stacked');
      stacked.push(el);
      boxEl = null; boxItem = null; boxState = 'none';
      if (!calm) el.animate([from, { left: spot.x + '%', top: spot.y + '%', height: spot.h + '%' }], { duration: K.slideMs, easing: 'ease-in-out' });
      nextBox();
    }).catch(function () {});
  }
  // The stacked boxes, the box, the tray, the conveyor, and the menu, for the layout.
  function placePack(L) {
    var c = L.conveyor, m = L.menu;
    conveyor.style.left = c[0] + '%'; conveyor.style.top = c[1] + '%'; conveyor.style.width = c[2] + '%'; conveyor.style.height = c[3] + '%';
    menu.style.left = m[0] + '%'; menu.style.top = m[1] + '%'; menu.style.width = m[2] + '%'; menu.style.height = m[3] + '%';
    tray.style.left = L.tray.x + '%'; tray.style.top = L.tray.y + '%'; tray.style.width = L.tray.w + '%';
    if (boxEl) setBoxPlace(boxEl, L.box.x, L.box.y, L.box.h, 0);
    stacked.forEach(function (el, k) { var sp = stackSpot(L, k); setBoxPlace(el, sp.x, sp.y, sp.h, sp.tilt); });
  }

  // ---------- the item menu ----------
  function buildMenu() {
    menu = div('ship-menu');
    menu.hidden = true;
    menu.setAttribute('role', 'dialog');
    menu.setAttribute('aria-label', 'Junk from the conveyor');
    menuList = div('ship-menu-list');
    menu.appendChild(menuList);
    menuList.addEventListener('pointerdown', menuDown);
    menuList.addEventListener('pointermove', menuMove);
    menuList.addEventListener('pointerup', menuUp);
    menuList.addEventListener('pointercancel', function () { endDrag(); });
    menuList.addEventListener('lostpointercapture', function () { if (drag && drag.mode !== 'drag') endDrag(); });
    box.appendChild(menu);
  }
  // Tiles like the shelf's: icon, name, count.  Items with keep (1) or fewer are greyed out and can't be picked up.
  function fillMenu() {
    var shelf = GW.game.s.items || {};
    menuList.textContent = '';
    K.groups.forEach(function (gid) {
      var g = C.groups.filter(function (x) { return x.id === gid; })[0];
      var items = C.items.filter(function (it) { return it.group === gid; });
      if (!g || !items.length) return;
      menuList.appendChild(div('ship-menu-head', g.name));
      var grid = div('ship-menu-grid');
      items.forEach(function (item) {
        var n = shelf[item.id] || 0, known = n > 0;
        var t = div('shelf-tile ship-tile' + (known ? '' : ' unknown') + (n > P.orders.keep ? '' : ' is-off'));
        t.dataset.item = item.id;
        t.style.borderColor = C.tiers[item.tier].color;
        t.appendChild(known ? GW.ui.itemIcon(item) : U.el('span', 'item-icon', '?'));
        t.appendChild(div('tile-name', known ? item.name : '???'));
        t.appendChild(div('tile-count', known ? '×' + U.fmt(n) : ''));
        grid.appendChild(t);
      });
      menuList.appendChild(grid);
    });
  }
  function openMenu() {
    if (menuOpen) return;
    fillMenu();
    menu.hidden = false; menuOpen = true;
    menuList.scrollTop = 0;
    GW.sfx.click();
  }
  function closeMenu() {
    endDrag();
    if (!menuOpen) return;
    menu.hidden = true; menuOpen = false;
  }

  // Dragging a tile: a mouse picks it up after a small move.  A finger scrolls the menu, unless it holds still
  // on a tile (holdMs) or carries the tile out of the menu.  The picked-up tile follows the pointer as a ghost.
  var drag = null;
  function tileItem(t) { return t && !t.classList.contains('is-off') ? GW.econ.itemDef(t.dataset.item) : null; }
  function menuDown(e) {
    if (!e.isTrusted || e.button > 0 || !e.isPrimary) return;
    e.preventDefault();
    endDrag();
    var t = e.target.closest('.ship-tile');
    drag = { id: e.pointerId, x0: e.clientX, y0: e.clientY, scroll0: menuList.scrollTop, item: tileItem(t), tile: t,
      touch: e.pointerType !== 'mouse', mode: 'press', hold: null, ghost: null };
    try { menuList.setPointerCapture(e.pointerId); } catch (err) {}
    if (drag.touch && drag.item) {
      var d = drag;
      d.hold = setTimeout(function () { if (drag === d && d.mode === 'press') startDrag(d.x0, d.y0); }, K.holdMs);
    }
  }
  function outsideMenu(x, y) {
    var r = menu.getBoundingClientRect();
    return x < r.left || x > r.right || y < r.top || y > r.bottom;
  }
  function menuMove(e) {
    if (!drag || e.pointerId !== drag.id) return;
    var dx = e.clientX - drag.x0, dy = e.clientY - drag.y0, far = Math.abs(dx) > K.slopPx || Math.abs(dy) > K.slopPx;
    if (drag.mode === 'press' && far) {
      clearTimeout(drag.hold);
      if (!drag.touch) { if (drag.item) startDrag(e.clientX, e.clientY); else drag.mode = 'none'; }
      else drag.mode = 'scroll';
    }
    if (drag.mode === 'scroll') {
      if (drag.item && outsideMenu(e.clientX, e.clientY)) { menuList.scrollTop = drag.scroll0; startDrag(e.clientX, e.clientY); }
      else menuList.scrollTop = drag.scroll0 - dy;
    }
    if (drag.mode === 'drag') moveGhost(e.clientX, e.clientY);
  }
  function menuUp(e) {
    if (!drag || e.pointerId !== drag.id) return;
    if (drag.mode === 'drag' && overBox(e.clientX, e.clientY)) fillBox(drag.item);
    endDrag();
  }
  function startDrag(x, y) {
    drag.mode = 'drag';
    drag.tile.classList.add('is-lifted');
    drag.ghost = U.el('div', 'ship-ghost' + (drag.touch ? ' touch' : ''));
    drag.ghost.appendChild(GW.ui.itemIcon(drag.item, true));
    document.body.appendChild(drag.ghost);
    moveGhost(x, y);
  }
  function moveGhost(x, y) {
    drag.ghost.style.left = x + 'px'; drag.ghost.style.top = y + 'px';
    if (boxEl) boxEl.classList.toggle('drop-ok', overBox(x, y));
  }
  function overBox(x, y) {
    if (!boxEl || boxState !== 'open') return false;
    var r = boxEl.getBoundingClientRect(), padX = r.width * K.dropPad / 100, padY = r.height * K.dropPad / 100;
    return x >= r.left - padX && x <= r.right + padX && y >= r.top - padY && y <= r.bottom + padY;
  }
  function endDrag() {
    if (!drag) return;
    clearTimeout(drag.hold);
    if (drag.ghost) drag.ghost.remove();
    if (drag.tile) drag.tile.classList.remove('is-lifted');
    if (boxEl) boxEl.classList.remove('drop-ok');
    var id = drag.id;
    drag = null;
    try { if (menuList.hasPointerCapture(id)) menuList.releasePointerCapture(id); } catch (err) {}
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
    var made = false;
    if (trip === 'arriving') { trip = 'here'; made = true; }
    if (trip === 'leaving') { trip = 'closed'; open = false; }
    stopAnims();
    settle();
    if (made) newOrders(); else showBoard();
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

  function leave() {
    var L = layout();
    stopAnims();
    trip = 'leaving';
    clearOrders();                  // closing the door takes the orders with it
    steps([
      function () { return walk(L.driver.at, 1, L.driver.from, L.driver.fromScale, false, true); },
      function () {
        placeTruck(L.truck.xFrom);
        return play(truck, [{ left: L.truck.xTo + '%' }, { left: L.truck.xFrom + '%' }], { duration: T.truckOutMs, easing: 'cubic-bezier(.6,0,.8,.4)' });
      },
      function () { truck.style.visibility = 'hidden'; return new Promise(function (r) { setTimeout(r, T.closeDelayMs); }); },
      function () { open = false; trip = 'closed'; anims = []; settle(); }
    ]);
  }

  function pull() {
    chain.classList.remove('pull'); void chain.offsetWidth; chain.classList.add('pull');
    clearTimeout(bounceTimer);
    bounceTimer = setTimeout(function () { chain.classList.remove('pull'); }, P.chain.pullMs);
    GW.sfx.click();
    if (trip === 'closed') arrive(); else if (trip === 'here') leave();
  }

  // main.js calls this whenever the view changes.  Entering the room always starts with the door closed.
  function setActive(on) {
    if (on && !built) build();
    if (on && !active) { stopAnims(); trip = 'closed'; open = false; orders = []; closeSlip(); resetPack(); redraw(true); }
    if (!on && active) { stopAnims(); closeSlip(); closeMenu(); }
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
    menuOpen: function () { return menuOpen; }, boxState: function () { return boxState; },
    activeOrder: activeIndex,
    // What was packed, for the hand-off (1e): one entry per order, null until stamped.
    packed: function () { return packed.map(function (r) { return r && { item: r.item, count: r.count, stamp: r.stamp }; }); }
  };
})();
