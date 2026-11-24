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
   dragging a region stamp from it onto the closed box stamps it.  An open box shakes off a stamp; a closed box shakes
   off junk and inside supplies.  Only one menu is open at a time.  The record of what was packed is GW.ship.packed().
   Inside supplies (1i): the supplies menu opens with the "Packing rules" chart, then a Packing section (packing
   peanuts and bubble wrap) that goes into the open box.  Each junk tile shows its packing tag's icon, and the open
   box shows the item's picture with its tag beside it and the supplies in its opening.  Scoring wants peanuts in
   every box and bubble wrap around a Breakable item.
   Outside stickers (1j): the Stickers section (FRAGILE, HEAVY) goes on a closed box, before or after its stamp (1n),
   in the box face's upper left; scoring wants FRAGILE on a Breakable item and HEAVY on a Heavy one.
   The room's tips (1g): the belt glows with a tag at the start of each trip until the item menu first opens, the
   computer's screen glows while a closed box waits for its stamp, and the chain glows when the shift is ready.  All
   of them follow the instructions setting (the no-hints class on the page, css).
   The hand-off (1e): once every order has a box handed to the driver (1n), the chain glows and sways and a tag by its handle says to
   pull it.  Pulling the chain with the driver in place scores each order (CONFIG.shipping.score), takes each box's count
   off the shelf (never below the display copy), moves Stonks (saved, never below 0), and adds the shift to the history.
   A perfect shift gets the driver's thumbs up before he leaves.  Once the door shows closed, the report card shows
   over the room; closing it ticks the GRIP line on the STONKS screen up to the new total.  A trip with no orders
   scores nothing and shows no card.
   Leaving (1f): tapping The Machine or Shop Floor while the driver waits with orders on the board shows the leave
   warning.  Stay (or a tap outside it, or Escape) changes nothing; Send it off runs the same hand-off as the chain,
   and main.js switches views once the report card closes.  Leaving while the truck is already leaving waits for
   the card the same way, so a scored shift's card is never skipped.
   Polish (1k): the "Packing rules" chart opens and minimizes from its heading bar, the door rolls up before the
   truck and down after it, and a view button tapped while the leave waits for the card stays lit (main.js).
   APPROVED or DENIED (1l): the full-size slip has the two stamp buttons under it, and a tap slams that stamp onto the
   slip with a BAM; the board's small slip shows it too.  A stamp can change until its order's box is packed.  The
   box on the bench belongs to the leftmost APPROVED order not yet packed (an empty box moves to a newly approved
   order further left; a box with an item stays with its order), so nothing is packed before it is stamped, and a
   DENIED order gets no box.  Unstamped slips glow softly (a tip).  From CONFIG.shipping.fakes.startShift, a board
   can carry one glitter fake, which should be DENIED.  Scoring adds the stamp calls, and TNP's line (saved as tnp
   and tnpHistory) joins GRIP's on the STONKS screen.  The "Packing Rules" bar always shows.
   TNP trips (1m): from the same shift, a trip can be a TNP trip instead (CONFIG.shipping.fakes.elfChance, never more
   than maxTnpInRow in a row): the elf imposter in his fake truck, placed by the real pair's numbers, with no glitter
   slips.  Pulling the chain with nothing handed over sends him packing (TNP down, a short card); each packed box
   handed to him moves ours down and TNP up, and he goes happy.  A real order never stamped is "Not approved", a small
   hit.
   Hand it to the driver (1n): the stamp is only a mark, so marks go on in any order and the box stays on the bench.
   A closed box dragged onto the driver (his outline, padded) goes to the stack at his feet and the next order's box
   comes out; dropped anywhere else, or open, it springs back.  A tag near the driver and a glow on him say so.
   The label, the drop, and the log (1o): every closed box wears its shipping label (the town, the region, and "via
   GRIP") in the middle of its face.  The driver sets a handed-over box on the stack in one eased arc with one small
   settle.  The two clipboards under STONKS open the last shift's report card again and the Shipping Log, a page per
   shipped box with its log, made once at the hand-off and saved with the card's rows (the save's lastShift).
   The clipboards' faces (1p): each painted clipboard wears a face drawn in code, a tiny report card with the last
   shift's marks on the left and SHIPPING LOG with a red truck on the right.  After a shift both glow softly until
   each is opened (a tip).  An approved fake's box gets its own log line and end.
   The tutorial (1q, js/tutorial.js): each page is due at its moment here (entering the view, the first orders on the
   board, the first box on the bench, the first box closed, the first shift where fakes can appear), and the How to
   Ship bookshelf on the wall (CONFIG.shipping.tutorial.book, 1q.1) reopens the pages seen so far; it glows until the
   book is first opened.  The report card that pops up
   on its own at the end of a shift counts as opening the Report Card clipboard, so only the Log glows after a shift.
   A good shift (every row on the card a check, on a GRIP trip) adds its line to the card and counts in the save. */
window.GW = window.GW || {};

GW.ship = (function () {
  var C = GW.CONFIG, P = C.shipping, T = P.trip, U = GW.util;
  var tallQuery = window.matchMedia(P.tallQuery);
  var calmQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var built = false, active = false, open = false;
  var trip = 'closed';            // 'closed' | 'arriving' | 'here' | 'leaving'
  var tripId = 0, anims = [];
  var box, closedImg, openImg, door, doorImg, bay, truck, driver, driverImg, chain, roller, rollerClosed, rollerOpen, bounceTimer;
  var board, viewer, orders = [], slipOpen = false;
  var K = P.pack, conveyor, computer, packLayer, boxEl = null, menus = {}, menuKind = null, stacked = [];
  var beltGlow, beltImg, beltTag, screenGlow, screenImg, beltTip = false;
  var packed = [], boxItem = null, boxCount = 0, boxState = 'none', boxIn = {}, boxOut = {};
  var verdicts = [], boxFor = -1, slipIndex = -1;
  // verdicts[i] = 'approved' | 'denied' | undefined, the stamp on order i (1l); boxFor = the order the bench box
  // belongs to (-1 with no box); slipIndex = the order open full size (-1 for none or the note)
  // boxState: 'none' | 'open' | 'closed'; boxIn = the inside supplies in the box (1i); boxOut = the
  // stickers on it (1j)
  var screenEl, screenLines = [], tag, cardView, cardOpen = false, pendingCard = null, shown = null, tickAnim = 0;
  var warnView, warnPanel, warnStay, warnOpen = false, warnGo = null, warnHeard = null, afterCard = null;
  var tnpTrip = false;            // this trip is TNP's: the elf in his fake truck (1m)
  var boxStamp = null, boxDrag = null, handTag;
  var clips = {}, logView, logMode = null;
  var faces = {}, clipGlows = {}, faceKey = null;   // the clipboards' faces and their news glows (1p)
  var bookBtn;                    // the How to Ship bookshelf (1q.1)
  // clips = the clipboards' tap areas (1o); logMode = what the Shipping Log shows: null (closed), 'list', or a row's index
  // boxStamp = the region stamp on the bench box, or null (1n: a mark like the stickers); boxDrag = the box being
  // pressed or dragged; handTag = the "Hand it to the driver!" tag

  function enabled() {
    return !!P.enabled || new RegExp('[?&]' + P.testParam + '=1(&|$)').test(window.location.search);
  }
  function layout() { return P.layouts[tallQuery.matches ? 'tall' : 'wide']; }
  function img(cls, src) { var i = U.el('img', cls); i.alt = ''; i.draggable = false; if (src) i.src = src; return i; }

  function build() {
    box = document.getElementById('ship');
    closedImg = img('ship-room'); openImg = img('ship-room ship-open');
    box.appendChild(closedImg); box.appendChild(openImg);
    // The rolling door (1k): a copy of the closed room clipped to the doorway, over the open twin while the door
    // rolls up or down.  Hidden the rest of the time.
    door = U.el('div', 'ship-door'); doorImg = img('ship-room');
    door.appendChild(doorImg); door.hidden = true;
    box.appendChild(door);
    // The How to Ship bookshelf (1q.1): Nathan's painted shelf on the wall, the button that reopens the tutorial's
    // pages seen so far.  It sits just over the room art, under everything else.  Placed in placeBook; its glow in
    // bookGlow.
    bookBtn = div('ship-book');
    bookBtn.setAttribute('role', 'button');
    bookBtn.setAttribute('aria-label', P.tutorial.book.label);
    bookBtn.appendChild(img('ship-book-art', P.tutorial.book.img));
    bookBtn.addEventListener('pointerdown', function (e) {
      e.stopPropagation();
      if (!e.isTrusted || e.button > 0) return;
      e.preventDefault();
      if (slipOpen || cardOpen || warnOpen || logMode !== null || boxDrag) return;
      closeMenu();
      GW.tutorial.openBook();
    });
    box.appendChild(bookBtn);
    GW.tutorial.onChange(bookGlow);
    // The tips' glows (1g): the room art again, cut to the belt's and the screen's outlines, glowing.  They sit
    // just above the room, under everything else.
    beltGlow = makeGlow('ship-belt-glow'); beltImg = beltGlow.firstChild;
    screenGlow = makeGlow('ship-screen-glow'); screenImg = screenGlow.firstChild;
    // The order board sits on the back wall, so the truck and the driver draw in front of it.
    board = U.el('div', 'ship-board');
    box.appendChild(board);
    // The clipboards under STONKS (1o): the left one reopens the last report card, the right one the Shipping Log.
    // They sit under the truck, the driver, and the box, so those keep their taps.
    // Each clipboard's news glow, then its face drawn on its paper (1p), under the tap areas.
    ['card', 'log'].forEach(function (k) {
      clipGlows[k] = makeGlow('ship-clip-glow ship-clip-glow-' + k);
      faces[k] = div('ship-clip-face clip-face-' + k);
      faces[k].setAttribute('aria-hidden', 'true');
      box.appendChild(faces[k]);
    });
    box.style.setProperty('--clip-pulse', P.clipFace.glow.pulseMs + 'ms');
    clips.card = clipButton('card', openLastCard);
    clips.log = clipButton('log', function () { openLog(); });
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
    [P.tnp.truck.img, P.tnp.driver.img, P.tnp.driver.happy.img].forEach(function (src) { new Image().src = src; });   // the elf's trip (1m)
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
    // The driver's tag (1n), shown with his glow while a closed box sits on the bench.
    handTag = div('ship-finish ship-hand-tag ship-tip');
    handTag.appendChild(U.el('span', '', P.tips.hand));
    handTag.hidden = true;
    box.appendChild(handTag);
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
    // The Shipping Log (1o) covers the room the same way.  A tap on a box's row opens its log; any other tap (or
    // Escape) steps back, then closes.
    logView = U.el('div', 'ship-log-view');
    logView.hidden = true;
    logView.addEventListener('pointerdown', function (e) {
      e.stopPropagation(); e.preventDefault();
      var row = logMode === 'list' && e.target.closest('.log-row');
      if (row) showLogBox(+row.dataset.row); else logBack();
    });
    box.appendChild(logView);
    buildWarn();
    box.style.setProperty('--slip-night', P.slip.nightBrightness);
    box.style.setProperty('--tip-pulse', P.tips.pulseMs + 'ms');
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (warnOpen) { e.preventDefault(); closeWarn(); }
      else if (cardOpen) { e.preventDefault(); closeCard(); }
      else if (logMode !== null) { e.preventDefault(); logBack(); }
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
    if (!tnpTrip) addFakes(list);          // an elf's own slips have no glitter (1m)
    return list;
  }
  // Glitter fakes (1l): from the player's startShift-th shift on, up to perBoard of the board's orders become fakes,
  // each with its own chance.  A fake is made like any order, so it reads as a normal order from a real town.
  function fakesOn() { return (GW.game.s.shifts || 0) + 1 >= P.fakes.startShift; }
  // TNP trips (1m): rolled as the door opens, from startShift on, never more than maxTnpInRow in a row (saved).
  function rollTnp() {
    var F = P.fakes, s = GW.game.s, row = s.tnpRow || 0;
    var tnp = fakesOn() && row < F.maxTnpInRow && Math.random() < F.elfChance;
    s.tnpRow = tnp ? row + 1 : 0;
    return tnp;
  }
  function addFakes(list) {
    var F = P.fakes;
    if (!fakesOn()) return;
    var spots = shuffled(list.map(function (o, i) { return i; })).slice(0, F.perBoard);
    spots.forEach(function (i) { if (Math.random() < F.chance) { list[i].fake = true; list[i].glitter = sparkles(); } });
  }
  // A fake's sparkles, made once per order so they hold still as the board redraws: x, y (% of the slip), size
  // (% of its width), color, the twinkle's delay (a share of twinkleMs), and a small turn.
  function sparkles() {
    var F = P.fakes, list = [];
    for (var k = 0; k < F.stars; k++) {
      list.push({ x: 8 + Math.random() * 84, y: 6 + Math.random() * 88, size: F.size[0] + Math.random() * (F.size[1] - F.size[0]),
        color: F.colors[k % F.colors.length], delay: Math.random(), turn: Math.round(Math.random() * 40 - 20) });
    }
    return list;
  }
  function regionOf(id) {
    var r = GW.DESTINATIONS.regions.filter(function (x) { return x.id === id; })[0];
    return r || { id: id, name: id };
  }

  // ---------- the slips ----------
  function div(cls, text) { return U.el('div', cls, text); }
  // A slip: the parchment with live text over it.  order null makes the "nothing to ship" note.  verdict = its
  // APPROVED or DENIED stamp (1l), if any.  A fake's glitter sits over the paper, under the text.
  function makeSlip(order, stampPct, verdict) {
    var S = P.slip, el = div('ship-slip' + (order ? '' : ' slip-note') + (order && order.fake ? ' is-fake' : ''));
    el.style.setProperty('--stamp', stampPct);
    el.appendChild(img('slip-paper', S.paper));
    if (order && order.fake) el.appendChild(makeGlitter(order.glitter || []));
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
    if (verdict) el.appendChild(verdictMark(verdict));
    el.setAttribute('aria-label', 'Work order: ship ' + order.qty + ' ' + order.item.name + ' to ' + order.place.name + ', ' + region.name +
      (verdict ? ', ' + verdict.toUpperCase() : ''));
    return el;
  }
  // The APPROVED or DENIED stamp on a slip, placed as in the approved mock (CONFIG.shipping.approval).
  function verdictMark(v) {
    var A = P.approval[v], m = img('slip-verdict', A.img);
    m.dataset.verdict = v;
    m.style.left = A.place[0] + '%'; m.style.top = A.place[1] + '%'; m.style.width = A.place[2] + '%';
    return m;
  }
  // The glitter (1l): a pastel shimmer over the paper and four-point sparkles drawn in code.  Each twinkles on its
  // own delay; the css holds them still with reduced motion.
  function makeGlitter(stars) {
    var NS = 'http://www.w3.org/2000/svg', g = div('slip-glitter');
    g.style.setProperty('--twinkle-ms', P.fakes.twinkleMs + 'ms');
    g.appendChild(U.el('i', 'glitter-sheen'));
    stars.forEach(function (st) {
      var svg = document.createElementNS(NS, 'svg'), path = document.createElementNS(NS, 'path');
      svg.setAttribute('viewBox', '0 0 24 24'); svg.setAttribute('class', 'glitter-star'); svg.setAttribute('aria-hidden', 'true');
      path.setAttribute('d', 'M12 0C13 8 16 11 24 12C16 13 13 16 12 24C11 16 8 13 0 12C8 11 11 8 12 0Z');
      path.setAttribute('fill', st.color);
      svg.appendChild(path);
      svg.style.left = st.x + '%'; svg.style.top = st.y + '%'; svg.style.width = st.size + 'cqw';
      svg.style.setProperty('--turn', st.turn + 'deg');
      svg.style.animationDelay = (-st.delay * P.fakes.twinkleMs) + 'ms';
      g.appendChild(svg);
    });
    return g;
  }

  // The board shows the orders (or the note) while the driver waits, and nothing otherwise.
  function showBoard() {
    if (!built) return;
    board.textContent = '';
    updateReady();
    if (trip !== 'here') return;
    var list = orders.length ? orders : [null];
    list.forEach(function (o, i) {
      var el = makeSlip(o, P.slip.stamp.board, o && verdicts[i]);
      if (o && packed[i]) { el.classList.add('is-packed'); el.appendChild(U.el('i', 'slip-check', '\u2714')); }
      else if (o && i === boxFor) el.classList.add('is-active');
      else if (o && !verdicts[i]) el.classList.add('is-unstamped');     // the soft glow, a tip (css)
      el.addEventListener('pointerdown', function (e) {      // the note opens too, so it can be read on a phone
        e.stopPropagation();
        if (!e.isTrusted || e.button > 0 || slipOpen) return;   // a real tap only
        e.preventDefault();
        openSlip(o ? i : -1);
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
    // Open: as big as fits in openSize % of the room's height and of its width (the tall room is narrow), with the
    // stamp buttons' row under it (1l): the slip and the row share the height.
    var B = P.approval.buttons, k = 1 + (B.h + B.gap) / 100;
    var ow = Math.min(S.openSize * S.aspect / ratio / k, S.openSize), oh = ow * ratio / S.aspect;
    viewer.style.setProperty('--open-w', ow + '%');
    viewer.style.setProperty('--open-h', (oh * k) + '%');
    viewer.style.setProperty('--slip-share', (100 / k) + '%');
    viewer.style.setProperty('--row-share', (100 * B.h / 100 / k) + '%');
    viewer.style.setProperty('--slip-w', ow + '%');
    viewer.style.setProperty('--slip-h', oh + '%');
    var Cd = P.card, cw = Math.min(Cd.openSize * Cd.aspect / ratio, Cd.openSize);
    cardView.style.setProperty('--card-w', cw + '%');
    cardView.style.setProperty('--card-h', (cw * ratio / Cd.aspect) + '%');
    var Lg = P.log, lw = Math.min(Lg.openSize * Lg.aspect / ratio, Lg.openSize);
    logView.style.setProperty('--log-w', lw + '%');
    logView.style.setProperty('--log-h', (lw * ratio / Lg.aspect) + '%');
    if (logMode !== null) fitLog();
  }
  // i = the order to open full size, or -1 for the note.  An order's slip has the two stamp buttons under it (1l).
  function openSlip(i) {
    var o = i >= 0 ? orders[i] : null;
    viewer.textContent = '';
    slipIndex = o ? i : -1;
    var wrap = div('slip-open' + (o ? ' has-stamps' : ''));
    wrap.appendChild(makeSlip(o, P.slip.stamp.open, o && verdicts[i]));
    if (o) wrap.appendChild(stampButtons(i));
    viewer.appendChild(wrap);
    viewer.hidden = false;
    fitSlips(viewer);
    slipOpen = true;
    GW.sfx.click();
  }
  function closeSlip() {
    if (!slipOpen) return;
    viewer.hidden = true; viewer.textContent = '';
    slipOpen = false; slipIndex = -1;
  }
  // The APPROVED and DENIED buttons, each drawn from its stamp's art.  A real tap stamps; keys work through click.
  // Once the order's box is handed over the buttons are locked.
  function stampButtons(i) {
    var row = div('slip-stamp-row');
    ['approved', 'denied'].forEach(function (v) {
      var A = P.approval[v], b = U.el('button', 'slip-stamp-btn');
      b.type = 'button'; b.dataset.verdict = v;
      b.setAttribute('aria-label', A.label);
      b.appendChild(img('', A.img));
      b.addEventListener('pointerdown', function (e) {
        e.stopPropagation(); e.preventDefault();         // the slip view's own tap would close it
        if (!e.isTrusted || e.button > 0) return;
        stampSlip(i, v);
      });
      b.addEventListener('click', function (e) { e.stopPropagation(); if (e.detail === 0 && e.isTrusted) stampSlip(i, v); });
      row.appendChild(b);
    });
    row.addEventListener('pointerdown', function (e) { e.stopPropagation(); e.preventDefault(); });   // the gap between them
    showStampButtons(row, i);
    return row;
  }
  function locked(i) { return !!packed[i]; }
  function showStampButtons(row, i) {
    Array.prototype.forEach.call(row.children, function (b) {
      var on = verdicts[i] === b.dataset.verdict;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      b.disabled = locked(i);
    });
  }
  // Stamps order i APPROVED or DENIED: the stamp starts big and lands with a BAM, the slip jolts, and the board and
  // the bench follow.  The same stamp again does nothing.
  function stampSlip(i, v) {
    if (i < 0 || !orders[i] || locked(i) || verdicts[i] === v) return;
    verdicts[i] = v;
    var Bm = P.approval.bam, calm = calmQuery.matches, slip = viewer.querySelector('.ship-slip');
    if (slip) {
      var old = slip.querySelector('.slip-verdict');
      if (old) old.remove();
      var m = verdictMark(v);
      slip.appendChild(m);
      slip.setAttribute('aria-label', slip.getAttribute('aria-label').replace(/, (APPROVED|DENIED)$/, '') + ', ' + v.toUpperCase());
      var turn = 'translate(-50%, -50%) ';
      var down = calm ? Promise.resolve() : m.animate([{ transform: turn + 'scale(' + Bm.scale + ')', opacity: 0 }, { transform: turn + 'scale(1)', opacity: 1 }],
        { duration: Bm.ms, easing: 'ease-in' }).finished;
      down.then(function () {
        GW.sfx.bam(Bm);
        if (!calm && slip.isConnected) slip.animate([{ transform: 'scale(1)' }, { transform: 'scale(' + (1 - Bm.jolt / 100) + ')' }, { transform: 'scale(1)' }],
          { duration: P.pack.thumpMs, easing: 'ease-out' });
      }).catch(function () {});
      var row = viewer.querySelector('.slip-stamp-row');
      if (row) showStampButtons(row, i);
    } else GW.sfx.bam(Bm);
    syncBox();
  }
  function clearOrders() { orders = []; closeSlip(); resetPack(); showBoard(); }
  function newOrders() {
    orders = makeOrders(); beltTip = true; resetPack(); showBoard(); nextBox();
    if (orders.length) GW.tutorial.due('stamp');           // the tutorial (1q): the first orders on the board
    if (fakesOn()) GW.tutorial.due('fakes');               // and the first shift where fakes can appear
  }


  // ---------- packing (layer 1d; all numbers in CONFIG.shipping.pack and layouts.<layout>) ----------
  // The leftmost APPROVED order not yet packed (1l), or -1.
  function activeIndex() {
    for (var i = 0; i < orders.length; i++) if (verdicts[i] === 'approved' && !packed[i]) return i;
    return -1;
  }
  // The bench follows the stamps (1l): a box whose order is no longer APPROVED goes away (nothing in it ever left the
  // shelf), an empty box moves to the leftmost APPROVED order, and with no box one appears for that order.
  function syncBox() {
    if (trip !== 'here') return;
    if (boxEl && verdicts[boxFor] !== 'approved') {
      endBoxDrag(false);
      boxEl.remove(); boxEl = null; boxFor = -1;
      boxItem = null; boxCount = 0; boxState = 'none'; boxIn = {}; boxOut = {}; boxStamp = null;
    }
    if (boxEl && boxState === 'open' && !boxItem && !insideList().length && activeIndex() >= 0) boxFor = activeIndex();
    nextBox();
    showBoard();
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
    // The shipping label (1o), above the box and below the stickers and the stamp: shown while the box is closed (css).
    var A = K.addr, addr = div('box-addr');
    addr.appendChild(img('addr-paper', A.img));
    ['town', 'region', 'via'].forEach(function (k, n) {
      var line = div('addr-line addr-' + k);
      line.dataset.n = n;
      line.style.bottom = (100 - A.lines[n]) + '%';
      line.style.left = A.left + '%'; line.style.width = (A.right - A.left) + '%';
      line.style.fontSize = A.font[n] + 'cqw';
      addr.appendChild(line);
    });
    addr.style.left = A.place[0] + '%'; addr.style.top = A.place[1] + '%'; addr.style.width = A.place[2] + '%';
    body.appendChild(addr);
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
    boxEl.classList.toggle('is-closed', boxState === 'closed');
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
    var closed = boxState === 'closed', slots = K.stickers.slots, k = 0;
    K.stickers.list.forEach(function (st) {
      var pic = boxEl.querySelector('.box-sticker[data-sticker="' + st.id + '"]');
      pic.hidden = !closed || !boxOut[st.id];
      if (!boxOut[st.id]) return;
      var sl = slots[Math.min(k++, slots.length - 1)];
      pic.style.left = sl[0] + '%'; pic.style.top = sl[1] + '%';
    });
    boxEl.classList.toggle('is-stickered', closed && k > 0);
    // The region stamp (1n) shows like the stickers: only while the box is closed, kept when it is reopened.
    var mark = boxPart('box-mark');
    if (boxStamp) mark.src = P.slip.stampImg.replace('{region}', boxStamp);
    mark.hidden = !closed || !boxStamp;
    boxEl.classList.toggle('is-stamped', closed && !!boxStamp);
    addrText(boxEl, orders[boxFor]);
    updateReady();
  }
  // The shipping label's three lines for order o (1o): the town, the region, and "via GRIP".  A line too long for
  // the label shrinks its own text to fit (sizes in cqw of the label, so the fit holds as the box grows or shrinks).
  function addrText(el, o) {
    var A = K.addr, lines = el.querySelectorAll('.addr-line');
    if (!o) return;
    var words = [o.place.name, regionOf(o.place.region).name, A.via];
    if (el.dataset.addr === words.join('|')) return;
    el.dataset.addr = words.join('|');
    Array.prototype.forEach.call(lines, function (line, n) { line.textContent = words[n]; });
    el.querySelector('.box-addr').setAttribute('aria-label', words.join(', '));
    fitAddr(el);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { fitAddr(el); });
  }
  function fitAddr(el) {
    var A = K.addr;
    Array.prototype.forEach.call(el.querySelectorAll('.addr-line'), function (line) {
      var size = A.font[+line.dataset.n];
      line.style.fontSize = size + 'cqw';
      var need = line.scrollWidth, room = line.clientWidth;
      if (need > room && room > 0) size = Math.max(A.min, size * room / need * P.card.fitSlack);
      line.style.fontSize = size + 'cqw';
    });
  }
  function resetPack() {
    endBoxDrag(false);
    packed = []; verdicts = []; boxFor = -1; boxItem = null; boxCount = 0; boxState = 'none'; boxIn = {}; boxOut = {}; boxStamp = null;
    if (boxEl) { boxEl.remove(); boxEl = null; }
    stacked.forEach(function (el) { el.remove(); }); stacked = [];
  }
  // The active order's empty box appears on the bench; with no APPROVED order waiting, none does.
  function nextBox() {
    if (boxEl || trip !== 'here' || activeIndex() < 0) return;
    var L = layout();
    boxFor = activeIndex();
    boxItem = null; boxCount = 0; boxState = 'open'; boxIn = {}; boxOut = {}; boxStamp = null;
    boxEl = makeBox();
    setBoxPlace(boxEl, L.box.x, L.box.y, L.box.h, 0);
    boxEl.addEventListener('pointerdown', boxDown);       // a tap opens or closes it; a drag hands it over (1n)
    boxEl.addEventListener('pointermove', boxMove);
    boxEl.addEventListener('pointerup', boxUp);
    boxEl.addEventListener('pointercancel', function () { endBoxDrag(true); });
    boxEl.addEventListener('lostpointercapture', function () { if (boxDrag && boxDrag.mode !== 'drag') endBoxDrag(false); });
    packLayer.appendChild(boxEl);
    showBox();
    GW.tutorial.due('pack');                               // the tutorial (1q): the first box on the bench
    if (!calmQuery.matches) boxEl.firstChild.animate([{ transform: 'scale(.6)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }],
      { duration: K.nextMs, easing: 'cubic-bezier(.3,1.4,.5,1)' });
  }
  function tapBox() {
    if (boxState === 'open' && boxItem) { boxState = 'closed'; GW.sfx.click(); showBox(); GW.tutorial.due('hand'); }
    else if (boxState === 'closed') { boxState = 'open'; GW.sfx.click(); showBox(); }
  }
  // Drop an item in the open box: the active order's count of it (1h), right item or wrong, or everything the shelf
  // can spare if it has fewer.  What the handed-over boxes already hold of the same item is not spare.  A different
  // item replaces the first.
  function fillBox(item) {
    if (boxState !== 'open') return;
    var spare = ((GW.game.s.items || {})[item.id] || 0) - P.orders.keep, o = orders[boxFor];
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
  // The region stamp onto the closed box (1n: only a mark; the box stays on the bench).  It comes down and lands with
  // its thump.  A different region's stamp replaces it; the same one again changes nothing.
  function stampBox(rid) {
    if (boxState !== 'closed' || boxStamp === rid) return;
    var el = boxEl, calm = calmQuery.matches;
    boxStamp = rid;
    showBox();
    var mark = boxPart('box-mark'), turn = 'translate(-50%, -50%) rotate(' + K.mark[3] + 'deg) ';
    var down = calm ? Promise.resolve() : mark.animate([{ transform: turn + 'scale(2.2)', opacity: 0 }, { transform: turn + 'scale(1)', opacity: 1 }],
      { duration: K.stampMs, easing: 'ease-in' }).finished;
    var id = tripId;
    down.then(function () {
      if (id !== tripId || el !== boxEl) return;
      GW.sfx.thump();
      if (!calm) el.firstChild.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(2.5%) scaleY(.96)' }, { transform: 'translateY(0)' }],
        { duration: K.thumpMs, easing: 'ease-out' });
    }).catch(function () {});
  }

  // ---------- handing the box to the driver (1n; numbers in CONFIG.shipping.pack.hand) ----------
  // The box drags like a menu tile: a mouse picks it up after slopPx, a finger after holdMs held still or a move past
  // slopPx.  A press that never becomes a drag is a tap (it closes or reopens the box).  While dragged the box itself
  // follows the pointer.
  function boxDown(e) {
    e.stopPropagation();
    if (!e.isTrusted || e.button > 0 || !e.isPrimary || boxDrag || trip !== 'here') return;
    e.preventDefault();
    var d = boxDrag = { id: e.pointerId, el: boxEl, x0: e.clientX, y0: e.clientY, touch: e.pointerType !== 'mouse', mode: 'press', hold: null };
    try { boxEl.setPointerCapture(e.pointerId); } catch (err) {}
    if (d.touch) d.hold = setTimeout(function () { if (boxDrag === d && d.mode === 'press') liftBox(d.x0, d.y0); }, K.holdMs);
  }
  function boxMove(e) {
    var d = boxDrag;
    if (!d || e.pointerId !== d.id) return;
    if (d.mode === 'press' && (Math.abs(e.clientX - d.x0) > K.slopPx || Math.abs(e.clientY - d.y0) > K.slopPx)) liftBox(e.clientX, e.clientY);
    if (d.mode === 'drag') moveBox(e.clientX, e.clientY);
  }
  function boxUp(e) {
    var d = boxDrag;
    if (!d || e.pointerId !== d.id) return;
    if (d.mode === 'press') { endBoxDrag(false); tapBox(); return; }
    if (boxState === 'closed' && overDriver(e.clientX, e.clientY)) handOver();
    else endBoxDrag(true);
  }
  function liftBox(x, y) {
    var d = boxDrag;
    clearTimeout(d.hold);
    d.mode = 'drag';
    d.el.classList.add('is-dragged');
    GW.sfx.click();
    moveBox(x, y);
  }
  function moveBox(x, y) {
    var d = boxDrag;
    d.dx = x - d.x0; d.dy = y - d.y0;
    d.el.style.translate = d.dx + 'px ' + d.dy + 'px';
    driver.classList.toggle('is-target', boxState === 'closed' && overDriver(x, y));
  }
  // The driver's drop area: his picture's outline grown by hand.pad % of its size on each side, so a finger finds him
  // even where the box or the stack covers part of him.
  function overDriver(x, y) {
    if (trip !== 'here') return false;
    var r = driverImg.getBoundingClientRect(), H = K.hand, px = r.width * H.padX / 100, py = r.height * H.padY / 100;
    return r.width > 0 && x >= r.left - px && x <= r.right + px && y >= r.top - py && y <= r.bottom + py;
  }
  // Ends a press or drag.  back = slide the box back to the bench from where it was dragged (none with reduced motion).
  function endBoxDrag(back) {
    var d = boxDrag;
    if (!d) return;
    boxDrag = null;
    clearTimeout(d.hold);
    driver.classList.remove('is-target');
    try { if (d.el.hasPointerCapture(d.id)) d.el.releasePointerCapture(d.id); } catch (err) {}
    if (d.mode !== 'drag') return;
    d.el.classList.remove('is-dragged');
    d.el.style.translate = '';
    if (back && !calmQuery.matches && d.el.isConnected) {
      d.el.animate([{ translate: d.dx + 'px ' + d.dy + 'px' }, { translate: '0px 0px' }], { duration: K.hand.backMs, easing: 'cubic-bezier(.3,1.3,.5,1)' });
    }
  }
  // Dropped on the driver: the record for the hand-off (the item, its count at packing time, the inside supplies
  // (1i), the stickers (1j), and the stamp, or null), and he puts the box on the ground: it slides from where it was
  // dropped to its spot in the stack.  The next APPROVED order's box comes out.
  function handOver() {
    var d = boxDrag, el = boxEl, i = boxFor, r = box.getBoundingClientRect();
    var from = { x: parseFloat(el.style.left) + d.dx / r.width * 100, y: parseFloat(el.style.top) + d.dy / r.height * 100, h: parseFloat(el.style.height), tilt: 0 };
    endBoxDrag(false);
    packed[i] = { item: boxItem.id, count: boxCount, inside: insideList(), outside: outsideList(), stamp: boxStamp };
    var L = layout(), spot = stackSpot(L, stacked.length);
    setBoxPlace(el, spot.x, spot.y, spot.h, spot.tilt);
    el.classList.add('is-stacked');
    stacked.push(el);
    boxEl = null; boxFor = -1; boxItem = null; boxState = 'none'; boxIn = {}; boxOut = {}; boxStamp = null;
    dropBox(el, from, spot);
    showBoard();
    nextBox();
    updateReady();
  }
  // The driver sets the box on the stack (1o): one eased arc from where it was dropped (a short rise, then down), its
  // size and tilt changing on the way, then one small settle and the thump, and it stops.  The arc is drawn as many
  // points on one linear animation, so nothing eases twice.  Reduced motion: a straight slide, the thump, no settle.
  function dropBox(el, from, to) {
    var Dp = K.hand.drop, calm = calmQuery.matches, frames = [], n = calm ? 1 : Dp.frames, rise = calm ? 0 : from.h * Dp.rise / 100;
    for (var k = 0; k <= n; k++) {
      var t = k / n, e = calm ? t : 0.5 - Math.cos(Math.PI * t) / 2;     // ease in and out
      frames.push({ left: (from.x + (to.x - from.x) * e) + '%', top: (from.y + (to.y - from.y) * e - rise * Math.sin(Math.PI * e)) + '%',
        height: (from.h + (to.h - from.h) * e) + '%', transform: 'translate(-50%, -100%) rotate(' + (from.tilt + (to.tilt - from.tilt) * e) + 'deg)' });
    }
    var id = tripId, a = el.animate(frames, { duration: calm ? Dp.calmMs : Dp.ms, easing: calm ? 'ease-out' : 'linear' });
    a.finished.then(function () {
      if (id !== tripId || !el.isConnected) return;
      GW.sfx.thump();
      if (!calm) el.firstChild.animate([{ transform: 'none' }, { transform: 'translateY(' + Dp.settle / 2 + '%) scaleY(' + (1 - Dp.settle / 100) + ')', offset: 0.35 },
        { transform: 'none' }], { duration: Dp.settleMs, easing: 'ease-out' });
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
    var t2 = L.handTag;
    handTag.style.left = (t2[0] - t2[2] / 2) + '%'; handTag.style.top = t2[1] + '%'; handTag.style.width = t2[2] + '%';
    endBoxDrag(false);
    if (boxEl) setBoxPlace(boxEl, L.box.x, L.box.y, L.box.h, 0);
    stacked.forEach(function (el, k) {
      el.getAnimations().forEach(function (a) { a.cancel(); });          // a drop in flight lands at once
      var sp = stackSpot(L, k); setBoxPlace(el, sp.x, sp.y, sp.h, sp.tilt);
    });
    setRect(clips.card, L.clips.card); setRect(clips.log, L.clips.log);
    ['card', 'log'].forEach(function (k) {                // the faces on the paper, the glows on the whole clipboard (1p)
      setRect(faces[k], L.paper[k]);
      var r = L.clips[k];
      clipGlows[k].style.clipPath = polygon([[r[0], r[1]], [r[0] + r[2], r[1]], [r[0] + r[2], r[1] + r[3]], [r[0], r[1] + r[3]]]);
    });
  }

  // ---------- the hand-off (layer 1e; numbers in CONFIG.shipping.score, .finish, .card, and .ticker) ----------
  // Ready to ship (1l): every order stamped, and every APPROVED one packed (1n: handed to the driver).
  function allPacked() {
    return trip === 'here' && orders.length > 0 && orders.every(function (o, i) { return verdicts[i] === 'denied' || (verdicts[i] === 'approved' && !!packed[i]); });
  }
  // The room's tips.  The chain shows how to finish: glow and sway (css; no sway with reduced motion) and the tag.
  // The belt glows with its tag from the trip's first box until the item menu first opens (1g), and the computer's
  // screen glows while a closed box waits for its stamp.  While a closed box sits on the bench, the driver glows and
  // his tag says to hand it over (1n).  With instructions off, css hides them all.
  function updateReady() {
    var on = allPacked();
    box.classList.toggle('has-last-shift', !!lastShift());      // the clipboards answer taps (1o)
    drawFaces();
    bookGlow();
    chain.classList.toggle('is-ready', on);
    tag.hidden = !on;
    var belt = beltTip && trip === 'here' && !!boxEl;
    beltGlow.hidden = beltTag.hidden = !belt;
    screenGlow.hidden = !(trip === 'here' && boxEl && boxState === 'closed' && !boxStamp);
    var hand = trip === 'here' && !!boxEl && boxState === 'closed';
    handTag.hidden = !hand;
    driver.classList.toggle('is-hand', hand);
  }
  function makeGlow(cls) {
    var g = div('ship-glow ship-tip ' + cls);
    g.appendChild(img('ship-room'));
    g.hidden = true;
    box.appendChild(g);
    return g;
  }
  function setPose(happy) {
    var D = tnpTrip ? P.tnp.driver : P.driver, H = D.happy;
    driverImg.src = happy ? H.img : D.img;
    driverImg.style.translate = happy ? H.shiftX + '% 0' : '';
  }
  // Which pair comes through the door (1m): Gnomerica's truck and driver, or the elf in his fake truck.
  function setKind(tnp) {
    tnpTrip = !!tnp;
    truck.src = tnpTrip ? P.tnp.truck.img : P.truck.img;
    truck.classList.toggle('is-fake', tnpTrip);
    driver.classList.toggle('is-elf', tnpTrip);
    sizePair(layout());
    setPose(false);
  }
  // The truck's and driver's sizes: the real pair's numbers, with the fake truck's fit and the elf's scale (1m).
  function sizePair(L) {
    var f = tnpTrip ? P.tnp.truck.fit : null;
    truck.style.height = L.truck.h * (f ? f.scale : 1) + '%';
    truck.style.top = (L.truck.top + (f ? f.dy * L.truck.h / 100 : 0)) + '%';
    driver.style.height = L.driver.h * (tnpTrip ? P.tnp.driver.scale : 1) + '%';
  }
  // A truck's left edge for the real truck's x (% of the room's width), with the fake truck's sideways fit.
  function truckX(L, x) { var f = tnpTrip ? P.tnp.truck.fit : null; return x + (f ? f.dx * L.truck.h / 100 / roomRatio(L) : 0); }
  // One row per order.  The box still on the bench counts when it is closed with an item in it (it ships as it is,
  // with its stamp if it has one, 1n); an open or empty box is not packed and does not ship.  The stamp calls come first (1l): a fake is scored
  // by its stamp alone, and a real order DENIED or unstamped never reaches the box checks.
  function scoreShift() {
    var Sc = P.score, R = Sc.reasons, Fk = Sc.fake, rows = [], delta = 0, tnp = 0, shipped = [], a = boxFor;
    var bench = a >= 0 && boxState === 'closed' && boxItem ? { item: boxItem.id, count: boxCount, inside: insideList(), outside: outsideList(), stamp: boxStamp } : null;
    if (tnpTrip) return scoreTnp(bench);
    orders.forEach(function (o, i) {
      var v = verdicts[i], rec = v === 'approved' ? packed[i] || (i === a ? bench : null) : null, miss = {}, note = null;
      if (o.fake) {
        var call = v === 'denied' ? 'caught' : v === 'approved' ? 'approved' : 'missed';
        if (call === 'caught') note = Sc.caught;
        else miss[call === 'approved' ? 'approvedFake' : 'missedFake'] = true;
        if (rec) shipped.push(rec);              // a packed fake's box still goes on the truck
        delta += Fk[call].ours; tnp += Fk[call].tnp;
        var fw = Sc.order.filter(function (k) { return miss[k]; }).map(function (k) { return R[k]; });
        rows.push({ order: o, ok: !fw.length, why: fw, note: note, rec: rec });
        return;
      }
      if (v === 'denied') miss.deniedReal = true;
      else if (!v) miss.notApproved = true;        // never stamped: a small hit (1m v0.2)
      else if (!rec) miss.notPacked = true;
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
      if (miss.notApproved) { delta += Sc.notApproved.ours; tnp += Sc.notApproved.tnp; }
      else delta += why.length ? -pts.wrong : pts.right;
      rows.push({ order: o, ok: !why.length, why: why, note: null, rec: rec });
    });
    var perfect = rows.every(function (r) { return r.ok; });
    if (perfect) tnp += Sc.perfectTnp;           // clean shifts push TNP back down
    // A good shift (1q.1, Claudia's ruling approved by Nathan 2026-11-23): every row on the card is a check, so an
    // approved glitter fake (its row a cross) makes it not a good shift.
    var good = rows.length > 0 && perfect;
    return { rows: rows, delta: delta, tnpDelta: tnp, shipped: shipped, perfect: perfect, happy: perfect, good: good };
  }
  // A TNP trip (1m): every packed box handed to the elf (a closed box on the bench with an item goes too, as on a GRIP
  // trip) is "Shipped to TNP", and he goes happy.  With nothing handed over he is sent packing: the short card.
  function scoreTnp(bench) {
    var Sc = P.score, E = Sc.elf, rows = [], delta = 0, tnp = 0, shipped = [];
    orders.forEach(function (o, i) {
      var rec = verdicts[i] === 'approved' ? packed[i] || (i === boxFor ? bench : null) : null;
      if (rec) {
        shipped.push(rec);
        delta += E.shipped.ours; tnp += E.shipped.tnp;
        rows.push({ order: o, ok: false, why: [Sc.reasons.shippedTnp], note: null, rec: rec });
      } else rows.push({ order: o, ok: true, why: [], note: Sc.kept });
    });
    if (!shipped.length) {
      delta += E.sentAway.ours; tnp += E.sentAway.tnp;
      rows = [{ order: null, ok: true, why: [], note: Sc.sentPacking }];
    }
    return { rows: rows, delta: delta, tnpDelta: tnp, shipped: shipped, perfect: !shipped.length, happy: shipped.length > 0, tnp: true, sentAway: !shipped.length };
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
    var tnp0 = s.tnp || 0;                       // TNP's line (1l), never below 0
    s.tnp = Math.max(0, tnp0 + (r.tnpDelta || 0));
    r.tnpChange = s.tnp - tnp0;
    s.tnpHistory = (s.tnpHistory || []).concat([s.tnp]).slice(-P.ticker.history);
    s.shifts = (s.shifts || 0) + 1;
    if (r.good) s.goodShifts = (s.goodShifts || 0) + 1;   // TNP trips are never good (1q)
    s.lastShift = keepShift(r);
    drawFaces();                                 // the card's face shows the new marks, and both glow (1p)
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
      if (!o) {                                  // the elf sent packing (1m): one line, and the elf in the picture frame
        line.classList.add('is-sent');
        words.appendChild(cardLine('town', row.note)).classList.add('card-note', 'card-wrap');   // it may take two lines (1n)
        line.appendChild(words);
        var elf = div('card-pic');
        elf.style.left = Cd.pic[0] + '%'; elf.style.width = (Cd.pic[1] - Cd.pic[0]) + '%';
        elf.appendChild(img('card-elf', P.tnp.driver.img));
        line.appendChild(elf);
        line.setAttribute('aria-label', row.note);
        el.appendChild(line);
        return;
      }
      words.appendChild(cardLine('town', o.place.name));
      words.appendChild(cardLine('item', countName(o.qty, o.item)));
      if (!row.ok) words.appendChild(cardLine('why', mainWhy(row.why)));
      else if (row.note) words.appendChild(cardLine('why', row.note)).classList.add('card-note');   // "Caught a fake!" (1l)
      line.appendChild(words);
      var pic = div('card-pic');
      pic.style.left = Cd.pic[0] + '%'; pic.style.width = (Cd.pic[1] - Cd.pic[0]) + '%';
      pic.appendChild(GW.ui.itemIcon(o.item));
      line.appendChild(pic);
      line.setAttribute('aria-label', o.place.name + ', ' + countName(o.qty, o.item) + ': ' + (row.ok ? row.note || 'shipped' : row.why.join(', ')));
      el.appendChild(line);
    });
    // The bottom line: both lines' changes (1l).
    var total = cardLine('total', Cd.totalText.replace('{ours}', signed(r.change || 0)).replace('{tnp}', signed(r.tnpChange || 0)));
    total.classList.add('card-total');
    total.style.top = Cd.total + '%';
    el.appendChild(total);
    if (r.good) {                                // a good shift's tag over the bottom stripes (1q)
      var good = div('card-good', Cd.good.text);
      good.style.top = Cd.good.y + '%'; good.style.fontSize = Cd.good.font + 'cqw';
      el.appendChild(good);
    }
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', 'Report card');
    return el;
  }
  function signed(c) { return (c > 0 ? '+' : c < 0 ? '\u2212' : '') + Math.abs(c); }
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
    var auto = !!pendingCard && r === pendingCard;   // the card popping up on its own after a shift (1q)
    pendingCard = null;
    if (auto) markRead('card');                    // counts as opening the Report Card clipboard
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

  // ---------- the clipboards and the Shipping Log (1o; words and numbers in CONFIG.shipping.log) ----------
  // What the save keeps of a scored shift: the report card's rows (as plain words and ids) and each shipped box's log,
  // made here, once, so reopening shows the same lines.
  function keepShift(r) {
    // unread (1p): the clipboards glow until each is opened once.
    return { tnp: !!r.tnp, sentAway: !!r.sentAway, good: !!r.good, change: r.change || 0, tnpChange: r.tnpChange || 0, unread: { card: true, log: true }, rows: r.rows.map(function (row) {
      var o = row.order;
      return { town: o ? o.place.name : null, region: o ? o.place.region : null, item: o ? o.item.id : null, qty: o ? o.qty : 0,
        ok: row.ok, why: row.why.slice(), note: row.note || null, fake: !!(o && o.fake), log: o && row.rec ? makeLog(row, r.tnp) : null };
    }) };
  }
  function pickN(list, n) { return shuffled(list).slice(0, n); }
  function between(r) { return r[0] + Math.floor(Math.random() * (r[1] - r[0] + 1)); }
  // One box's log, built as docs/lore/shipping-log-v0.1.md says: the start, road lines and packing lines shuffled
  // together, then the end line for its result, each with a clock time.  An approved fake on GRIP's truck (1p, lore
  // v0.2) also gets one of its own lines in the middle and always its own end.  Returns [[time, line], ...].
  function makeLog(row, tnp) {
    var Lg = P.log, o = row.order, rec = row.rec, def = GW.econ.itemDef(rec.item) || {}, inside = rec.inside || [], outside = rec.outside || [];
    var road = tnp ? Lg.tnp.road : (Lg.road[o.place.region] || []).concat(Lg.road.any);
    var on = { peanuts: inside.indexOf('peanuts') >= 0, noPeanuts: inside.indexOf('peanuts') < 0, bubble: inside.indexOf('bubble') >= 0,
      fragile: outside.indexOf('fragile') >= 0, heavy: outside.indexOf('heavy') >= 0, heavyBare: def.pack === 'heavy' && outside.indexOf('heavy') < 0,
      soft: def.pack === 'soft', many: o.qty >= Lg.manyAt };
    var packing = Lg.packing.filter(function (p) { return on[p.when]; }).map(function (p) { return p.text; });
    var middle = shuffled(pickN(road, between(Lg.roadCount)).concat(pickN(packing, between(Lg.packCount))));
    var fake = !tnp && !!o.fake;
    if (fake) middle.splice(Math.floor(middle.length / 2), 0, Lg.fake.road[Math.floor(Math.random() * Lg.fake.road.length)]);
    var R = P.score.reasons, why = row.why, end = tnp ? Lg.tnp.end : fake ? Lg.fake.end : row.ok ? Lg.end.right[Math.floor(Math.random() * Lg.end.right.length)]
      : why.indexOf(R.item) >= 0 ? Lg.end.item : why.indexOf(R.noStamp) >= 0 ? Lg.end.noStamp : Lg.end.other;
    var t = Lg.startMin;
    return [Lg.start].concat(middle, [end]).map(function (line, k) {
      if (k) t += Math.round(between(Lg.stepMin) / Lg.stepRound) * Lg.stepRound;
      var h = Math.floor(t / 60) % 24, m = t % 60;
      return [(h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m,
        line.split('{town}').join(o.place.name).split('{item}').join(o.item.name).split('{count}').join(String(o.qty))];
    });
  }
  // A saved row back as the report card's row: the order's place and item, or null for the sent-packing line.
  function savedOrder(x) {
    if (!x.town) return null;
    return { place: { name: x.town, region: x.region }, qty: x.qty, item: GW.econ.itemDef(x.item) || { id: x.item, name: x.item, emoji: '\ud83d\udce6' } };
  }
  function lastShift() { return GW.game.s.lastShift || null; }
  // An invisible tap area over a painted clipboard.  A real tap only; nothing happens before the first shift, or
  // while something else covers the room or the truck is leaving.
  function clipButton(kind, go) {
    var b = U.el('div', 'ship-clip ship-clip-' + kind);
    b.addEventListener('pointerdown', function (e) {
      e.stopPropagation();
      if (!e.isTrusted || e.button > 0) return;
      e.preventDefault();
      if (!lastShift() || slipOpen || cardOpen || warnOpen || logMode !== null || boxDrag || trip === 'leaving') return;
      go();
    });
    box.appendChild(b);
    return b;
  }
  // The left clipboard: the last shift's report card again, from the save.  Nothing is scored.
  function openLastCard() {
    var L = lastShift();
    if (!L) return;
    markRead('card');
    showCard({ rows: L.rows.map(function (x) { return { order: savedOrder(x), ok: x.ok, why: x.why, note: x.note }; }), change: L.change, tnpChange: L.tnpChange, good: !!L.good });
  }
  // The right clipboard: the Shipping Log, opened on its list.
  function openLog() {
    if (!lastShift()) return;
    markRead('log');
    logMode = 'list';
    drawLog();
    logView.hidden = false;
    GW.sfx.click();
  }
  // A clipboard opened (1p): its news glow stops, and the save remembers it.
  function markRead(k) {
    var L = lastShift();
    if (!L || !L.unread || !L.unread[k]) return;
    L.unread[k] = false;
    drawFaces();
    GW.state.save(GW.game.s);
  }
  // The clipboards' faces (1p; sizes and words in CONFIG.shipping.clipFace).  The card's marks follow the last
  // shift's rows; the glows show while lastShift.unread says so (css hides them with instructions off).  Drawn again
  // only when something they show changes.
  function drawFaces() {
    if (!faces.card) return;
    var F = P.clipFace, L = lastShift(), rows = L ? L.rows : [], u = (L && L.unread) || {};
    clipGlows.card.hidden = !u.card || !!pendingCard; clipGlows.log.hidden = !u.log;
    var marks = [];
    for (var k = 0; k < F.rows; k++) marks.push(rows[k] ? (rows[k].ok ? 'ok' : 'x') : '');
    var key = marks.join();
    if (key === faceKey) return;
    faceKey = key;
    var inner = {};                                      // the face is the size container; its inside takes the padding
    ['card', 'log'].forEach(function (kind) {
      var el = inner[kind] = div('face-in');
      faces[kind].textContent = '';
      faces[kind].appendChild(el);
      el.style.padding = F.pad[0] + 'cqh ' + F.pad[1] + 'cqw 0';
      var t = div('face-title');
      t.style.font = 'bold ' + F.title[0] + 'cqw/' + F.title[1] + ' var(--font)';
      F[kind].title.forEach(function (w) { t.appendChild(div('', w)); });
      el.appendChild(t);
    });
    var list = div('face-rows');
    list.style.marginTop = F.rowGap + 'cqh';
    marks.forEach(function (m) {
      var row = div('face-row' + (m === 'ok' ? ' is-right' : m === 'x' ? ' is-wrong' : ''));
      row.style.height = F.rowH + 'cqh';
      var b = div('face-box', m === 'ok' ? '\u2714' : m === 'x' ? '\u2718' : '');
      b.style.width = b.style.height = F.box + 'cqw';
      b.style.fontSize = F.mark + 'cqw';
      var line = U.el('i', 'face-line');
      line.style.width = F.lineW + '%';
      row.appendChild(b); row.appendChild(div('face-line-room')).appendChild(line);
      list.appendChild(row);
    });
    inner.card.appendChild(list);
    var truck = faceTruck();
    truck.style.width = F.truck[0] + 'cqw'; truck.style.marginTop = F.truck[1] + 'cqh';
    inner.log.appendChild(truck);
    for (var n = 0; n < F.lines; n++) {
      var rule = U.el('i', 'face-rule');
      rule.style.marginTop = F.rule + 'cqh';
      inner.log.appendChild(rule);
    }
  }
  // The address label's red truck, drawn in code (1p): speed lines, the box, the cab with its window, two wheels.
  function faceTruck() {
    var NS = 'http://www.w3.org/2000/svg', svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 64 32'); svg.setAttribute('class', 'face-truck');
    var parts = [
      ['rect', { x: 0, y: 8, width: 10, height: 2.6, rx: 1.3 }], ['rect', { x: 3, y: 13.5, width: 8, height: 2.6, rx: 1.3 }],
      ['rect', { x: 0, y: 19, width: 10, height: 2.6, rx: 1.3 }],
      ['rect', { x: 14, y: 3, width: 29, height: 20, rx: 1.6 }],
      ['path', { d: 'M45 9 h9.5 l7 7.5 v8.5 h-16.5 z' }],
      ['path', { d: 'M47.5 11.5 h6 l4.6 5 h-10.6 z', 'class': 'face-truck-glass' }],
      ['rect', { x: 14, y: 23, width: 48, height: 2.5, rx: 1 }],
      ['circle', { cx: 23, cy: 26, r: 4.6 }], ['circle', { cx: 23, cy: 26, r: 1.7, 'class': 'face-truck-glass' }],
      ['circle', { cx: 53, cy: 26, r: 4.6 }], ['circle', { cx: 53, cy: 26, r: 1.7, 'class': 'face-truck-glass' }]
    ];
    parts.forEach(function (p) {
      var e = document.createElementNS(NS, p[0]);
      Object.keys(p[1]).forEach(function (a) { e.setAttribute(a, p[1][a]); });
      svg.appendChild(e);
    });
    return svg;
  }
  // A tap or Escape: from a box's log back to the list, from the list closed.
  function logBack() {
    if (logMode === null) return;
    if (logMode !== 'list') { logMode = 'list'; drawLog(); GW.sfx.click(); return; }
    logMode = null;
    logView.hidden = true; logView.textContent = '';
  }
  function showLogBox(k) {
    var x = lastShift() && lastShift().rows[k];
    if (!x || !x.log) return;
    logMode = k;
    drawLog();
    GW.sfx.click();
  }
  // The page: the work order's parchment with its stripes and live text.  The list shows each shipped box (its mark,
  // town, and count and item); a box's page shows its town, its line, and its log, a clock time beside each entry.
  function drawLog() {
    var Lg = P.log, L = lastShift(), page = div('ship-log'), body = div('log-body');
    logView.textContent = '';
    page.appendChild(img('slip-paper', P.slip.paper));
    page.appendChild(U.el('i', 'slip-stripes slip-top'));
    page.appendChild(U.el('i', 'slip-stripes slip-bottom'));
    page.setAttribute('role', 'dialog');
    function head(title, x) {
      body.appendChild(div('log-title', title));
      if (x) {
        var sub = div('log-sub ' + (x.ok ? 'is-right' : 'is-wrong'));
        sub.appendChild(U.el('span', 'log-mark', x.ok ? '\u2714' : '\u2718'));
        sub.appendChild(U.el('span', '', countName(x.qty, savedOrder(x).item)));
        body.appendChild(sub);
      }
      body.appendChild(U.el('i', 'log-rule'));
    }
    if (logMode === 'list') {
      head(Lg.title);
      var list = div('log-list'), n = 0;
      L.rows.forEach(function (x, k) {
        if (!x.log) return;
        n++;
        var row = div('log-row ' + (x.ok ? 'is-right' : 'is-wrong')), words = div('log-words');
        row.dataset.row = k;
        row.appendChild(div('log-mark', x.ok ? '\u2714' : '\u2718'));
        words.appendChild(div('log-town', x.town));
        words.appendChild(div('log-item', countName(x.qty, savedOrder(x).item)));
        row.appendChild(words);
        row.appendChild(div('log-go', '\u203a'));
        row.setAttribute('aria-label', x.town + ', ' + countName(x.qty, savedOrder(x).item) + (x.ok ? ', right' : ', ' + x.why.join(', ')));
        list.appendChild(row);
      });
      if (!n) list.appendChild(div('log-empty', Lg.empty));
      body.appendChild(list);
      page.setAttribute('aria-label', Lg.title);
    } else {
      var x = L.rows[logMode], entries = div('log-entries');
      head(x.town, x);
      x.log.forEach(function (e) {
        var line = div('log-entry');
        line.appendChild(U.el('span', 'log-time', e[0]));
        line.appendChild(U.el('span', 'log-text', e[1]));
        entries.appendChild(line);
      });
      body.appendChild(entries);
      page.setAttribute('aria-label', Lg.title + ': ' + x.town);
    }
    page.appendChild(body);
    logView.appendChild(page);
    fitLog();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (logMode !== null) fitLog(); });
  }
  // The page's text shrinks until it fits the paper, never below fontMin (sizes in cqw of the page).
  function fitLog() {
    var Lg = P.log, body = logView.querySelector('.log-body'), size = Lg.font;
    if (!body) return;
    body.style.fontSize = size + 'cqw';
    while (body.scrollHeight > body.clientHeight + 1 && size > Lg.fontMin) {
      size = Math.max(Lg.fontMin, size * 0.94);
      body.style.fontSize = size + 'cqw';
    }
  }
  function closeLog() { logMode = null; if (logView) { logView.hidden = true; logView.textContent = ''; } }

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
  function openWarn(go, heard) {
    closeSlip(); closeMenu();
    warnGo = go; warnHeard = heard;
    warnView.hidden = false; warnOpen = true;
    GW.sfx.click();
    warnStay.focus({ preventScroll: true });
  }
  function closeWarn() {
    if (!warnOpen) return;
    warnView.hidden = true; warnOpen = false; warnGo = null; warnHeard = null;
  }
  // Send it off: the same hand-off as pulling the chain, then leave once the report card closes.
  function sendOff() {
    var go = warnGo, heard = warnHeard;
    closeWarn();
    if (trip !== 'here') return;
    waitCard(go, heard);
    pull();
  }
  // A leave that waits for the report card; heard tells main.js, which keeps the tapped view button lit (1k).
  function waitCard(go, heard) { afterCard = go; if (heard) heard(); }
  // main.js asks before leaving the room for another view.  true = held here (go runs later, or never on Stay);
  // false = leave now.  heard (optional) runs once the leave is set to wait for the card.
  function holdLeave(go, heard) {
    if (!active) return false;
    if (trip === 'leaving') { waitCard(go, heard); return true; }          // the chain is pulled: wait for the card
    if (trip === 'closed' && pendingCard) { waitCard(go, heard); showCard(pendingCard); return true; }
    if (trip === 'here' && orders.length && !cardOpen) { openWarn(go, heard); return true; }
    return false;
  }

  // The STONKS screen: two labeled lines of the last shifts' totals, GRIP (our Stonks) and TNP (1l), drawn inside the
  // painted glass on one scale.  screenLines[k] = { team, num, line, dot } for GRIP (0) and TNP (1).
  function buildScreen() {
    var NS = 'http://www.w3.org/2000/svg', Tk = P.ticker;
    screenEl = div('ship-stonks');
    var top = div('stonks-top'), chart = div('stonks-chart'), svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('preserveAspectRatio', 'none');
    chart.appendChild(svg);
    [{ label: Tk.label, color: Tk.color, cls: 'is-grip' }, { label: Tk.tnp.label, color: Tk.tnp.color, cls: 'is-tnp' }].forEach(function (t) {
      var team = div('stonks-team ' + t.cls), num = div('stonks-num', '0'), line = document.createElementNS(NS, 'polyline'), dot = U.el('i', 'stonks-dot ' + t.cls);
      team.style.setProperty('--ticker', t.color); dot.style.setProperty('--ticker', t.color);
      team.appendChild(div('stonks-label', t.label));
      team.appendChild(num);
      top.appendChild(team);
      line.setAttribute('vector-effect', 'non-scaling-stroke');
      line.setAttribute('class', t.cls);
      line.style.setProperty('--ticker', t.color);
      svg.appendChild(line);
      chart.appendChild(dot);
      screenLines.push({ label: t.label, team: team, num: num, line: line, dot: dot });
    });
    screenEl.appendChild(top);
    screenEl.appendChild(chart);
    screenEl.setAttribute('aria-label', 'Stonks');
    box.appendChild(screenEl);
  }
  // values = [GRIP, TNP] now; hists = their totals to plot, oldest first.  Both spread across the glass's full width,
  // first to last, padded at the left with 0 to the longer one's length.  One shift draws a flat line across at its
  // value, with the dot at its right end.
  function drawTicker(values, hists) {
    var n = Math.max(1, hists[0].length, hists[1].length), all = values.slice();
    hists.forEach(function (h) { all = all.concat(h); });
    var max = Math.max(1, Math.max.apply(null, all)) * 1.15, said = [];
    screenLines.forEach(function (S, k) {
      var h = hists[k], v = values[k];
      S.num.textContent = U.fmt(Math.round(v));
      said.push(S.label + ' ' + Math.round(v));
      var row = h.length ? new Array(n - h.length).fill(0).concat(h) : [];
      if (row.length === 1) row = [row[0], row[0]];
      var pts = row.map(function (x, i) { return [i * 100 / (row.length - 1), 100 - x / max * 100]; });
      S.line.setAttribute('points', pts.map(function (p) { return p[0].toFixed(2) + ',' + p[1].toFixed(2); }).join(' '));
      var last = pts[pts.length - 1];
      S.dot.hidden = !last;
      if (last) { S.dot.style.left = last[0] + '%'; S.dot.style.top = last[1] + '%'; }
    });
    screenEl.setAttribute('aria-label', 'Stonks: ' + said.join(', '));
  }
  function saved() {
    var s = GW.game.s;
    return { values: [s.stonks || 0, s.tnp || 0], hists: [(s.stonksHistory || []).slice(), (s.tnpHistory || []).slice()] };
  }
  // Counts both numbers (and each line's newest point) from what the screen shows to the saved totals.
  function tickTo() {
    var now = saved(), to = now.values, from = shown === null ? to : shown;
    cancelAnimationFrame(tickAnim);
    shown = to;
    var same = from[0] === to[0] && from[1] === to[1];
    if (calmQuery.matches || same || !now.hists[0].length) { drawTicker(to, now.hists); return; }
    screenEl.classList.remove('is-ticking'); void screenEl.offsetWidth; screenEl.classList.add('is-ticking');
    var t0 = performance.now(), prev = now.hists.map(function (h, k) { return h.length > 1 ? h[h.length - 2] : from[k]; });
    function frame(t) {
      var p = Math.min(1, (t - t0) / P.ticker.tickMs), e = 1 - Math.pow(1 - p, 3);
      var hs = now.hists.map(function (h, k) { h = h.slice(); if (h.length) h[h.length - 1] = prev[k] + (to[k] - prev[k]) * e; return h; });
      drawTicker(to.map(function (v, k) { return from[k] + (v - from[k]) * e; }), hs);
      if (p < 1) tickAnim = requestAnimationFrame(frame);
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
  // The "Packing Rules" bar (1i), live text, one line per rule with its icon.  It always shows, first in the menu (1l).  Its heading bar opens or minimizes
  // it (1k): open the first time it shows, minimized after that unless the player opens it, kept in this browser.
  function rulesPref() { try { return localStorage.getItem(K.chart.storeKey); } catch (e) { return null; } }
  function setRulesPref(v) { try { localStorage.setItem(K.chart.storeKey, v); } catch (e) {} }
  function makeChart() {
    var Ch = K.chart, el = div('ship-rules'), bar = U.el('button', 'ship-rules-head'), rows = div('ship-rules-rows');
    bar.type = 'button';
    bar.appendChild(U.el('span', 'ship-rules-title', Ch.title));
    bar.appendChild(chevron());
    bar.addEventListener('click', function (e) { if (e.detail === 0) toggleRules(el); });   // keys; taps go through menuUp
    el.appendChild(bar);
    el.appendChild(rows);
    el.style.setProperty('--turn-ms', Ch.turnMs + 'ms');
    el.style.setProperty('--bar-min', Ch.barMinPx + 'px');
    var pref = rulesPref();
    if (pref === null) setRulesPref('min');      // this first showing is open; later ones start minimized
    setRulesOpen(el, pref === null || pref === 'open');
    Ch.rows.forEach(function (r) {
      var row = div('ship-rule'), sp = K.inside.filter(function (x) { return x.id === r.icon; })[0], tg = K.tags[r.icon];
      var pic = img('ship-rule-icon', sp ? sp.img : tg ? tg.img : '');
      row.appendChild(pic);
      row.appendChild(U.el('span', 'ship-rule-text', r.text));
      rows.appendChild(row);
    });
    return el;
  }
  function setRulesOpen(el, on) {
    el.classList.toggle('is-min', !on);
    el.firstChild.setAttribute('aria-expanded', on ? 'true' : 'false');
  }
  function toggleRules(el) {
    var on = el.classList.contains('is-min');
    setRulesOpen(el, on);
    setRulesPref(on ? 'open' : 'min');
    GW.sfx.click();
  }
  // A thin chevron drawn in code (no font glyph): points down; the css turns it up while the chart is open.
  function chevron() {
    var NS = 'http://www.w3.org/2000/svg', svg = document.createElementNS(NS, 'svg'), path = document.createElementNS(NS, 'path');
    svg.setAttribute('viewBox', '0 0 24 24'); svg.setAttribute('class', 'ship-rules-chev'); svg.setAttribute('aria-hidden', 'true');
    path.setAttribute('d', 'M6 9l6 6 6-6');
    svg.appendChild(path);
    return svg;
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
      bar: e.target.closest('.ship-rules-head'),
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
    if (drag.mode === 'press' && drag.bar) toggleRules(drag.bar.parentNode);   // a tap (not a scroll) on the chart's bar
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
  // An open box takes junk and inside supplies; a closed box takes outside marks (stickers and stamps, in any order, 1n).
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
  function placeTruck(x) { truck.style.left = truckX(layout(), x) + '%'; }
  function placeDriver(xy, scale, shown) {
    driver.style.left = xy[0] + '%'; driver.style.top = xy[1] + '%';
    driver.style.transform = driverTransform(scale);
    driver.style.opacity = shown ? '1' : '0';
  }
  // Puts everything where the current trip state says, with no motion.
  function settle() {
    var L = layout(), here = trip === 'here';
    box.classList.toggle('is-open', open);
    hideDoor();
    placeTruck(here ? L.truck.xTo : L.truck.xFrom);
    truck.style.visibility = here ? 'visible' : 'hidden';
    placeDriver(here ? L.driver.at : L.driver.from, here ? 1 : L.driver.fromScale, here);
  }

  // ---------- the rolling door (1k; numbers in CONFIG.shipping.trip) ----------
  // The doorway grown by doorPad on every side, corners clockwise from top left.
  function doorQuad(L) {
    var q = L.doorway, d = T.doorPad;
    return [[q[0][0] - d, q[0][1] - d], [q[1][0] + d, q[1][1] - d], [q[2][0] + d, q[2][1] + d], [q[3][0] - d, q[3][1] + d]];
  }
  // The closed door's clip with the door k of the way up (0 down, 1 up): its bottom edge climbs to its top edge.
  function doorClip(L, k) {
    var q = doorQuad(L);
    function lerp(a, b) { return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k]; }
    return polygon([q[0], q[1], lerp(q[2], q[1]), lerp(q[3], q[0])]);
  }
  function hideDoor() {
    door.getAnimations().forEach(function (a) { a.cancel(); });
    door.hidden = true;
  }
  // Rolls the door up or down over the open twin, with its rattle.  Reduced motion: a short crossfade.
  function rollDoor(up) {
    var L = layout(), calm = calmQuery.matches, ms = calm ? T.doorCalmMs : up ? T.doorUpMs : T.doorDownMs;
    hideDoor();
    box.classList.add('is-open');
    door.style.clipPath = doorClip(L, 0);
    door.hidden = false;
    GW.sfx.rattle(T.rattle, ms / 1000);
    var frames = calm ? [{ opacity: 1 }, { opacity: 0 }] : [{ clipPath: doorClip(L, 0) }, { clipPath: doorClip(L, 1) }];
    if (!up) frames.reverse();
    return play(door, frames, { duration: ms, easing: 'ease-in-out', fill: 'forwards' });
  }

  // Both twins stay loaded and stacked, so opening is an instant swap with no jump.
  // A theme change only swaps pictures; a layout change (or entering the view) also re-places everything.
  var drawnLayout = null;
  function redraw(force) {
    if (!built) return;
    var L = layout(), m = document.getElementById('machine'), wh = L.aspect.split('/');
    closedImg.src = GW.theme.img(L.closed);
    openImg.src = GW.theme.img(L.open);
    rollerClosed.src = doorImg.src = closedImg.src; rollerOpen.src = openImg.src;
    beltImg.src = screenImg.src = closedImg.src;       // the belt and the computer look the same with the door open
    clipGlows.card.firstChild.src = clipGlows.log.firstChild.src = closedImg.src;
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
    sizePair(L);
    placeBoard(L, parseFloat(wh[0]) / parseFloat(wh[1]));
    // A layout change mid-trip skips to where the trip was heading.
    placePack(L);
    placeHandoff(L);
    placeBook();
    var made = false;
    if (trip === 'arriving') { trip = 'here'; made = true; }
    if (trip === 'leaving') { trip = 'closed'; open = false; }
    stopAnims();
    settle();
    if (made) newOrders(); else showBoard();
    if (trip === 'closed' && pendingCard) showCard(pendingCard);
  }

  // The How to Ship bookshelf's spot (1q.1): CONFIG.shipping.tutorial.book.spot, per layout.
  function placeBook() {
    var at = P.tutorial.book.spot[tallQuery.matches ? 'tall' : 'wide'];
    bookBtn.style.left = at[0] + '%'; bookBtn.style.top = at[1] + '%'; bookBtn.style.width = at[2] + '%';
    bookGlow();
  }
  // Its glow (1q.1): from the first page seen until the book is first opened (css hides it with instructions off).
  function bookGlow() { if (bookBtn) bookBtn.classList.toggle('is-new', GW.tutorial.bookNew()); }

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
    setKind(rollTnp());                                  // GRIP or TNP, decided as the door opens (1m)
    trip = 'arriving'; open = true;
    settle();
    steps([
      function () { return rollDoor(true); },            // the door rolls up first (1k)
      function () {
        hideDoor();
        truck.style.visibility = 'visible';
        placeTruck(L.truck.xTo);
        return play(truck, [{ left: truckX(L, L.truck.xFrom) + '%' }, { left: truckX(L, L.truck.xTo) + '%' }], { duration: T.truckInMs, easing: 'cubic-bezier(.2,.7,.3,1)' });
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
        if (!r || !r.happy) return;               // GRIP: a perfect shift; the elf: he got packages (1m)
        setPose(true);
        return new Promise(function (ok) { setTimeout(ok, P.driver.happyMs); });
      },
      function () { return walk(L.driver.at, 1, L.driver.from, L.driver.fromScale, false, true); },
      function () {
        placeTruck(L.truck.xFrom);
        return play(truck, [{ left: truckX(L, L.truck.xTo) + '%' }, { left: truckX(L, L.truck.xFrom) + '%' }], { duration: T.truckOutMs, easing: 'cubic-bezier(.6,0,.8,.4)' });
      },
      function () { truck.style.visibility = 'hidden'; return new Promise(function (r) { setTimeout(r, T.closeDelayMs); }); },
      function () { return rollDoor(false); },           // then it rolls back down (1k)
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
      pendingCard = r;                // set first, so the card's clipboard never glows for a card about to pop up (1q)
      if (r) applyShift(r);
      leave(r);
    }
  }

  // main.js calls this whenever the view changes.  Entering the room always starts with the door closed.
  function setActive(on) {
    if (on && !built) build();
    if (on && !active) {
      stopAnims(); trip = 'closed'; open = false; orders = []; closeSlip(); resetPack(); setPose(false); redraw(true);
      cancelAnimationFrame(tickAnim); var now = saved(); shown = now.values; drawTicker(now.values, now.hists);
    }
    if (!on && active) { stopAnims(); endBoxDrag(false); closeSlip(); closeMenu(); closeWarn(); closeLog(); afterCard = null; pendingCard = null; cardOpen = false; cardView.hidden = true; cardView.textContent = ''; drawFaces(); }
    if (on) GW.tutorial.due('welcome');                    // the tutorial's first page (1q)
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
    activeOrder: function () { return boxFor; }, cardOpen: function () { return cardOpen; },
    // The stamps on the orders (1l): 'approved', 'denied', or null for each.
    verdicts: function () { return orders.map(function (o, i) { return verdicts[i] || null; }); },
    // Which orders are glitter fakes (1l), for tests and screenshots.
    fakes: function () { return orders.map(function (o) { return !!o.fake; }); },
    // Whether this trip is TNP's, the elf in his fake truck (1m).
    tnpTrip: function () { return tnpTrip; },
    // Test hook (1m): rolls the next trip's kind as the door would (and counts it in the save's tnpRow).
    testRoll: function () { return rollTnp(); },
    holdLeave: holdLeave, warnOpen: function () { return warnOpen; },
    // Tapping Shipping again while a leave waits for the card stays in the room.
    stay: function () { closeWarn(); afterCard = null; },
    // Test hook (1e.1): shows a report card for a made-up result ({ rows: [{ order, ok, why }], change }),
    // without scoring or saving, so screenshots can try the longest names.
    testCard: function (r) { if (built) showCard(r); },
    // What was packed, for the hand-off (1e): one entry per order, null until handed to the driver (1n).
    packed: function () { return packed.map(function (r) { return r && { item: r.item, count: r.count, inside: r.inside.slice(), outside: r.outside.slice(), stamp: r.stamp }; }); },
    // What is in the box on the bench (1i): its state, item, inside supplies, and stickers (1j).
    bench: function () { return { state: boxState, item: boxItem && boxItem.id, inside: insideList(), outside: outsideList(), stamp: boxStamp }; },
    // Whether the box on the bench is being dragged (1n).
    dragging: function () { return !!(boxDrag && boxDrag.mode === 'drag'); },
    // The clipboards (1o): what the Shipping Log shows (null closed, 'list', or a row's index).
    logMode: function () { return logMode; },
    // The clipboards' news glows (1p): whether each one's glow is on (true while the save says it is unread).
    clipGlow: function (k) { return !!clipGlows[k] && !clipGlows[k].hidden; },
    // The How to Ship bookshelf's glow (1q.1): whether it is on.
    bookGlow: function () { return !!bookBtn && bookBtn.classList.contains('is-new'); }
  };
})();
