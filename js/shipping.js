/* The shipping room, the Packing Line's view (layers 1a and 1b): the room art, the door chain, and
   Gnomerica's truck and driver.  Hidden from players while CONFIG.shipping.enabled is false; ?ship=1 in
   the address shows it for testing.  Nothing ships yet.  The door starts closed each time the view opens
   and is not saved.
   A trip: pulling the chain opens the door, the truck backs into the doorway (on desktop, through it into the room) and settles, then the driver
   walks in a short way and waits, grumpy.  Pulling again sends him out, the truck drives off, and the door
   shows closed. */
window.GW = window.GW || {};

GW.ship = (function () {
  var C = GW.CONFIG, P = C.shipping, T = P.trip, U = GW.util;
  var tallQuery = window.matchMedia(P.tallQuery);
  var calmQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var built = false, active = false, open = false;
  var trip = 'closed';            // 'closed' | 'arriving' | 'here' | 'leaving'
  var tripId = 0, anims = [];
  var box, closedImg, openImg, bay, truck, driver, driverImg, chain, roller, rollerClosed, rollerOpen, bounceTimer;

  function enabled() {
    return !!P.enabled || new RegExp('[?&]' + P.testParam + '=1(&|$)').test(window.location.search);
  }
  function layout() { return P.layouts[tallQuery.matches ? 'tall' : 'wide']; }
  function img(cls, src) { var i = U.el('img', cls); i.alt = ''; i.draggable = false; if (src) i.src = src; return i; }

  function build() {
    box = document.getElementById('ship');
    closedImg = img('ship-room'); openImg = img('ship-room ship-open');
    box.appendChild(closedImg); box.appendChild(openImg);
    // The bay is clipped to the doorway, so the truck only shows through the opening, behind the frame.
    bay = U.el('div', 'ship-bay');
    truck = img('ship-truck', P.truck.img);
    bay.appendChild(truck);
    box.appendChild(bay);
    driver = U.el('div', 'ship-driver');
    driverImg = img('', P.driver.img);
    driver.appendChild(driverImg);
    box.appendChild(driver);
    chain = U.el('div', 'ship-chain');
    chain.setAttribute('aria-hidden', 'true');
    chain.appendChild(img('', P.chain.img));
    chain.style.setProperty('--pull', P.chain.pullPercent + '%');
    chain.style.setProperty('--pull-ms', P.chain.pullMs + 'ms');
    chain.addEventListener('pointerdown', function (e) {
      e.stopPropagation();
      if (!e.isTrusted || e.button > 0) return;     // a real tap only, like the gear
      e.preventDefault();
      if (trip === 'arriving' || trip === 'leaving') return;   // one trip at a time
      pull();
    });
    box.appendChild(chain);
    // The roller: the same room art again, cut to the roller's outline and drawn in front of the chain, so the
    // chain's top end stays hidden behind it while the chain is pulled.  Its twins follow the door like the room's.
    roller = U.el('div', 'ship-roller');
    rollerClosed = img('ship-room'); rollerOpen = img('ship-room ship-open');
    roller.appendChild(rollerClosed); roller.appendChild(rollerOpen);
    box.appendChild(roller);
    built = true;
    tallQuery.addEventListener('change', redraw);
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
    // A layout change mid-trip skips to where the trip was heading.
    if (trip === 'arriving') trip = 'here';
    if (trip === 'leaving') { trip = 'closed'; open = false; }
    stopAnims();
    settle();
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
      function () { trip = 'here'; anims = []; }
    ]);
  }

  function leave() {
    var L = layout();
    stopAnims();
    trip = 'leaving';
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
    if (on && !active) { stopAnims(); trip = 'closed'; open = false; redraw(true); }
    if (!on && active) stopAnims();
    active = on;
  }

  return {
    enabled: enabled, setActive: setActive, redraw: redraw,
    isOpen: function () { return open; }, tripState: function () { return trip; }
  };
})();
