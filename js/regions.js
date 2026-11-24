/* Regions (1r): the wall map in the Packing Line room, the map viewer it opens, and the card that shows when a
   region unlocks.  Every number and word is in CONFIG.shipping.regions.
   The save's `regions` = how many regions are unlocked, in the unlock order of GW.DESTINATIONS.regions (Gnomerica
   first); 1 for every save, old and new.  Nothing in play unlocks a region while regions.liveUnlock is false: only the
   debug bar's test button (?debug=1) does, until the Gnohio build turns the real unlock on.  Orders, drivers,
   stamps, the label, and the tutorial still use Gnomerica only, whatever `regions` says.
   The wall map: Nathan's clean map in the room's upper parchment frame, built and tapped through js/shipping.js
   (wallEl, placeWall).  Night dims it like the slips (css).
   The map viewer: a pop-up on document.body with the map picture for the unlocked count (map-state-NN.webp, loaded
   only when the viewer opens).  It fits the screen at first; a pinch (phones) or the wheel (desktop) zooms, a drag
   pans, zoom stops at the picture's full size (map.maxZoom), and the map can't be dragged off screen.  The close
   button or Escape closes it.  While it is open, window-level listeners take every tap, wheel, and key, so the room
   hears nothing (the room locks page zoom on phones, so the viewer runs its own pinch).
   The unlock card: built like a tutorial page (the slip paper, --font, "Got it!" with tutorial.armMs), with Nathan's
   heading, the region's name, its close-up, and its three postcards in a slightly fanned stack.  A tap on the stack
   brings the next postcard to the top.  Only a real tap or Enter on "Got it!" closes it. */
window.GW = window.GW || {};

GW.regions = (function () {
  var C = GW.CONFIG, P = C.shipping, R = P.regions, U = GW.util;
  var tallQuery = window.matchMedia(P.tallQuery);
  // the viewer
  var vEl = null, vStage, vPic, vClose, vOpen = false, vs = { s: 1, x: 0, y: 0, fit: 1 }, pts = {}, gesture = null, loadedSrc = '';
  // the card
  var cEl = null, cPanel, cName, cClose, cPics, cStack, cGot, cOpen = false, cShownAt = 0, cRegion = 0, cards = [], turning = false;

  function save() { return GW.game.s; }
  // How many regions are unlocked: 1 to regions.max.
  function count() {
    var n = Math.floor(+save().regions || 1);
    return Math.max(1, Math.min(R.max, n));
  }
  function regionDef(n) { return GW.DESTINATIONS.regions[n - 1]; }
  function statePic(n) { return R.map.state.replace('{n}', (n < 10 ? '0' : '') + n); }
  function postcardPic(name) { return R.postcardPath.replace('{name}', name); }

  // ---------- the wall map (the room builds it; placed from shipping's redraw) ----------
  function wallEl() {
    var el = U.el('div', 'ship-wallmap');
    el.setAttribute('role', 'button');
    el.setAttribute('aria-label', R.wall.label);
    var i = U.el('img', 'ship-wallmap-art'); i.alt = ''; i.draggable = false; i.src = R.wall.img;
    el.appendChild(i);
    return el;
  }
  // Fits the map inside the frame's parchment with `inset` (% of the frame's height) showing all around, centered.
  // Returns [x, y, w, h] in % of the room, for the Result and the tests.
  function placeWall(el, tall, roomRatio) {
    var f = R.wall.frame[tall ? 'tall' : 'wide'];
    var fw = f[2] / 100 * roomRatio, fh = f[3] / 100, gap = R.wall.inset / 100 * fh;   // in room heights
    var iw = fw - 2 * gap, ih = fh - 2 * gap, a = R.wall.aspect;
    var mh = Math.min(ih, iw / a), mw = mh * a;
    var cx = f[0] / 100 * roomRatio + fw / 2, cy = f[1] / 100 + fh / 2;
    var r = [(cx - mw / 2) / roomRatio * 100, (cy - mh / 2) * 100, mw / roomRatio * 100, mh * 100];
    el.style.left = r[0] + '%'; el.style.top = r[1] + '%'; el.style.width = r[2] + '%'; el.style.height = r[3] + '%';
    return r;
  }

  // ---------- the map viewer ----------
  function buildViewer() {
    vEl = U.el('div', 'map-view');
    vEl.hidden = true;
    vEl.setAttribute('role', 'dialog');
    vEl.setAttribute('aria-modal', 'true');
    vEl.setAttribute('aria-label', R.map.label);
    vEl.style.setProperty('--map-night', P.slip.nightBrightness);   // Night dims the map like the slips
    vStage = U.el('div', 'map-stage');
    vPic = U.el('img', 'map-pic');
    vPic.alt = R.map.label; vPic.draggable = false;
    vPic.width = R.map.size[0]; vPic.height = R.map.size[1];
    vStage.appendChild(vPic);
    vEl.appendChild(vStage);
    vClose = U.el('button', 'map-close', '✕');
    vClose.type = 'button';
    vClose.setAttribute('aria-label', R.map.close);
    vClose.title = R.map.close;
    vEl.appendChild(vClose);
    document.body.appendChild(vEl);

    // Caught first, on the window, so nothing under the viewer hears a tap, a wheel, or a key while it is open.
    window.addEventListener('pointerdown', function (e) {
      if (!vOpen) return;
      e.stopPropagation(); e.preventDefault();
      if (e.target === vClose || (e.target.closest && e.target.closest('.map-close'))) { if (e.button <= 0) closeMap(); return; }
      if (e.button > 0) return;
      try { vStage.setPointerCapture(e.pointerId); } catch (err) {}
      pts[e.pointerId] = { x: e.clientX, y: e.clientY };
      startGesture();
    }, true);
    window.addEventListener('pointermove', function (e) {
      if (!vOpen) return;
      e.stopPropagation();
      if (!pts[e.pointerId]) return;
      e.preventDefault();
      pts[e.pointerId] = { x: e.clientX, y: e.clientY };
      moveGesture();
    }, true);
    ['pointerup', 'pointercancel'].forEach(function (t) {
      window.addEventListener(t, function (e) {
        if (!vOpen) return;
        e.stopPropagation();
        if (!pts[e.pointerId]) return;
        delete pts[e.pointerId];
        startGesture();                                   // a pinch that loses a finger carries on as a drag
      }, true);
    });
    ['click', 'touchstart', 'touchmove', 'touchend', 'mousedown', 'mouseup', 'dblclick', 'contextmenu'].forEach(function (t) {
      window.addEventListener(t, function (e) {
        if (!vOpen) return;
        e.stopPropagation();
        if (e.cancelable && t !== 'touchstart' && t !== 'touchend') e.preventDefault();
      }, { capture: true, passive: false });
    });
    ['gesturestart', 'gesturechange'].forEach(function (t) {   // Safari's own pinch
      window.addEventListener(t, function (e) { if (vOpen) e.preventDefault(); }, { capture: true, passive: false });
    });
    window.addEventListener('wheel', function (e) {
      if (!vOpen) return;
      e.stopPropagation(); e.preventDefault();
      var dy = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 400 : 1);
      if (!dy) return;
      zoomAt(e.clientX, e.clientY, vs.s * Math.pow(R.map.wheelStep, -dy / 100));
    }, { capture: true, passive: false });
    window.addEventListener('keydown', function (e) {
      if (!vOpen) return;
      if (e.key === 'Tab') { e.preventDefault(); vClose.focus({ preventScroll: true }); return; }
      e.stopPropagation(); e.preventDefault();
      if (e.key === 'Escape' || ((e.key === 'Enter' || e.key === ' ') && document.activeElement === vClose)) closeMap();
    }, true);
    window.addEventListener('resize', function () { if (vOpen) refit(false); });
  }

  function screenSize() { return { w: vEl.clientWidth || window.innerWidth, h: vEl.clientHeight || window.innerHeight }; }
  function maxScale() { return Math.max(vs.fit, R.map.maxZoom); }
  // fresh = back to the whole map, fitted; otherwise the zoom holds (as far as the new screen allows).
  function refit(fresh) {
    var sz = screenSize(), m = R.map.margin, W = R.map.size[0], H = R.map.size[1];
    vs.fit = Math.min((sz.w - 2 * m) / W, (sz.h - 2 * m) / H);
    if (fresh || vs.s < vs.fit) vs.s = vs.fit;
    vs.s = Math.min(vs.s, maxScale());
    if (fresh) { vs.x = (sz.w - W * vs.s) / 2; vs.y = (sz.h - H * vs.s) / 2; }
    apply();
  }
  // Keeps the map on screen: smaller than the screen it stays centered, bigger it can't leave a gap at an edge.
  function clamp() {
    var sz = screenSize(), w = R.map.size[0] * vs.s, h = R.map.size[1] * vs.s;
    vs.x = w <= sz.w ? (sz.w - w) / 2 : Math.min(0, Math.max(sz.w - w, vs.x));
    vs.y = h <= sz.h ? (sz.h - h) / 2 : Math.min(0, Math.max(sz.h - h, vs.y));
  }
  function apply() {
    clamp();
    vPic.style.transform = 'translate(' + vs.x + 'px, ' + vs.y + 'px) scale(' + vs.s + ')';
  }
  // Zooms to scale s, keeping the picture's point under (cx, cy) where it is.
  function zoomAt(cx, cy, s) {
    s = Math.max(vs.fit, Math.min(maxScale(), s));
    var k = s / vs.s;
    vs.x = cx - (cx - vs.x) * k; vs.y = cy - (cy - vs.y) * k; vs.s = s;
    apply();
  }
  function fingers() { return Object.keys(pts).map(function (k) { return pts[k]; }); }
  // One finger (or the mouse) drags; two pinch.  Each change in the fingers starts a new gesture from where things are.
  function startGesture() {
    var f = fingers();
    if (!f.length) { gesture = null; return; }
    if (f.length === 1) { gesture = { kind: 'drag', x0: f[0].x, y0: f[0].y, vx: vs.x, vy: vs.y }; return; }
    var mid = { x: (f[0].x + f[1].x) / 2, y: (f[0].y + f[1].y) / 2 };
    gesture = { kind: 'pinch', d0: Math.max(1, Math.hypot(f[0].x - f[1].x, f[0].y - f[1].y)), s0: vs.s,
      px: (mid.x - vs.x) / vs.s, py: (mid.y - vs.y) / vs.s };   // the picture's point under the fingers
  }
  function moveGesture() {
    var f = fingers();
    if (!gesture) return;
    if (gesture.kind === 'drag' && f.length === 1) {
      vs.x = gesture.vx + f[0].x - gesture.x0; vs.y = gesture.vy + f[0].y - gesture.y0;
      apply();
    } else if (gesture.kind === 'pinch' && f.length >= 2) {
      var d = Math.hypot(f[0].x - f[1].x, f[0].y - f[1].y), mid = { x: (f[0].x + f[1].x) / 2, y: (f[0].y + f[1].y) / 2 };
      vs.s = Math.max(vs.fit, Math.min(maxScale(), gesture.s0 * d / gesture.d0));
      vs.x = mid.x - gesture.px * vs.s; vs.y = mid.y - gesture.py * vs.s;
      apply();
    }
  }

  function openMap() {
    if (vOpen || cOpen) return;
    if (!vEl) buildViewer();
    var src = statePic(count());
    if (loadedSrc !== src) { vEl.classList.add('is-loading'); vPic.onload = function () { vEl.classList.remove('is-loading'); }; vPic.src = src; loadedSrc = src; }
    pts = {}; gesture = null;
    vEl.hidden = false;
    vOpen = true;
    refit(true);
    vClose.focus({ preventScroll: true });
    GW.sfx.click();
  }
  function closeMap() {
    if (!vOpen) return;
    vOpen = false; pts = {}; gesture = null;
    vEl.hidden = true;
    GW.sfx.click();
  }

  // ---------- the unlock card ----------
  function buildCard() {
    cEl = U.el('div', 'tut-view reg-view');
    cEl.hidden = true;
    cEl.style.setProperty('--tut-night', P.slip.nightBrightness);
    cPanel = U.el('div', 'tut-page reg-page');
    cPanel.setAttribute('role', 'dialog');
    cPanel.setAttribute('aria-modal', 'true');
    cPanel.style.borderImageSource = 'url("' + P.slip.paper + '")';
    cPanel.style.borderImageSlice = P.leave.slice + ' fill';
    var body = U.el('div', 'tut-body reg-body');
    body.appendChild(U.el('i', 'tut-stripes'));
    body.appendChild(U.el('div', 'tut-title reg-title', R.card.heading));
    cName = U.el('div', 'reg-name');
    body.appendChild(cName);
    cPics = U.el('div', 'reg-pics');
    cClose = U.el('img', 'reg-closeup');
    cClose.draggable = false;
    cClose.width = R.card.closeup[0]; cClose.height = R.card.closeup[1];
    cPics.appendChild(cClose);
    cStack = U.el('div', 'reg-stack');
    cStack.style.setProperty('--turn-ms', R.card.stack.turnMs + 'ms');
    cPics.appendChild(cStack);
    body.appendChild(cPics);
    cGot = U.el('button', 'tut-btn tut-got', P.tutorial.gotIt);
    cGot.type = 'button';
    body.appendChild(cGot);
    cPanel.appendChild(body);
    cEl.appendChild(cPanel);
    document.body.appendChild(cEl);
    // As the tutorial does: caught first on the window, so nothing under the card hears a tap or a key.
    window.addEventListener('pointerdown', function (e) {
      if (!cOpen) return;
      e.stopPropagation(); e.preventDefault();
      if (e.button > 0) return;
      if (e.target.closest && e.target.closest('.tut-got') === cGot) { if (e.isTrusted) press(); }
      else if (e.target.closest && e.target.closest('.reg-stack') === cStack) turn();
    }, true);
    ['pointerup', 'click', 'touchstart', 'touchend', 'mousedown', 'mouseup', 'dblclick', 'contextmenu'].forEach(function (t) {
      window.addEventListener(t, function (e) {
        if (!cOpen) return;
        e.stopPropagation();
        if (t !== 'touchstart' && t !== 'touchend' && e.cancelable) e.preventDefault();
      }, true);
    });
    window.addEventListener('keydown', function (e) {
      if (!cOpen) return;
      if (e.key === 'Tab') return;
      e.stopPropagation(); e.preventDefault();
      if (!e.isTrusted || e.repeat) return;
      if (e.key === 'Enter') press();
    }, true);
    tallQuery.addEventListener('change', sizeCard);
  }
  function sizeCard() {
    if (!cEl) return;
    var k = tallQuery.matches ? 'tall' : 'wide';
    cEl.style.setProperty('--tut-w', 'min(' + R.card.vw + 'vw, ' + R.card.width[k] + 'px)');
    cEl.classList.toggle('is-wide', k === 'wide');
  }
  // The stack: postcards in DOM order bottom to top; each takes the tilt of its place.
  function tiltStack() {
    var t = R.card.stack.tilts;
    cards.forEach(function (el, k) { el.style.setProperty('--tilt', t[k % t.length] + 'deg'); });
  }
  // A tap brings the next postcard to the top: the top one slides off and tucks in at the bottom.
  function turn() {
    if (turning || cards.length < 2) return;
    var top = cards[cards.length - 1];
    function done() {
      cards.pop(); cards.unshift(top);
      cStack.insertBefore(top, cStack.firstChild);
      top.classList.remove('is-turning');
      tiltStack();
      turning = false;
    }
    GW.sfx.click();
    if (GW.calm()) { done(); return; }
    turning = true;
    top.classList.add('is-turning');
    setTimeout(done, R.card.stack.turnMs);
  }
  function showCard(n) {
    var def = regionDef(n), cfg = R.list[n - 1];
    if (!def || !cfg) return;
    if (vOpen) closeMap();
    if (!cEl) buildCard();
    sizeCard();
    cRegion = n;
    cName.textContent = def.name;
    cName.style.setProperty('--region', def.color);
    cPanel.setAttribute('aria-label', R.card.heading + ' ' + def.name);
    cPanel.dataset.region = def.id;
    cClose.src = cfg.closeup; cClose.alt = def.name;
    cStack.textContent = ''; cards = []; turning = false;
    cfg.postcards.forEach(function (name) {
      var el = U.el('div', 'reg-card');
      var i = U.el('img', ''); i.alt = ''; i.draggable = false; i.src = postcardPic(name);
      el.dataset.card = name;
      el.appendChild(i);
      cStack.appendChild(el);
      cards.push(el);
    });
    tiltStack();
    cEl.hidden = false;
    cOpen = true;
    cShownAt = performance.now();
    cGot.focus({ preventScroll: true });
  }
  // "Got it!": the same 400 ms guard as the tutorial's pages.
  function press() {
    if (performance.now() - cShownAt < P.tutorial.armMs) return;
    GW.sfx.click();
    cOpen = false; cRegion = 0;
    cEl.hidden = true;
  }

  // ---------- unlocking ----------
  // Called after each good shift.  Nothing unlocks while liveUnlock is false; the Gnohio build adds its rule here
  // (goodShiftsFor good shifts open Gnohio).
  function afterGoodShift() {
    if (!R.liveUnlock) return;
  }
  // The debug bar's test button: one more region (up to max), saved, and its card shows.
  function testUnlock() {
    var n = count();
    if (n >= R.max) return false;
    save().regions = n + 1;
    GW.state.save(save());
    showCard(n + 1);
    return true;
  }
  function testReset() {
    save().regions = 1;
    GW.state.save(save());
    if (cOpen) { cOpen = false; cEl.hidden = true; }
    return true;
  }

  return {
    count: count, wallEl: wallEl, placeWall: placeWall, openMap: openMap, closeMap: closeMap,
    afterGoodShift: afterGoodShift, testUnlock: testUnlock, testReset: testReset,
    isOpen: function () { return vOpen || cOpen; },
    // For tests and screenshots.
    mapOpen: function () { return vOpen; },
    mapSrc: function () { return vPic ? vPic.getAttribute('src') : null; },
    mapView: function () { return { s: vs.s, x: vs.x, y: vs.y, fit: vs.fit, max: vEl ? maxScale() : null }; },
    mapZoom: function (cx, cy, s) { if (vOpen) zoomAt(cx, cy, s); },
    cardOpen: function () { return cOpen; },
    cardRegion: function () { return cRegion ? regionDef(cRegion).id : null; },
    stackOrder: function () { return cards.map(function (el) { return el.dataset.card; }); },
    showCard: showCard
  };
})();
