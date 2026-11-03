/* Clone Attack: escaped clones snatch junk off the conveyor and run the Shop Floor stairs.
   Press and hold a clone, drag him into the vat behind the Cloner, and SPLOOSH: the junk comes
   back plus a few cogs.  Clones that finish their laps run off with it.  Shop Floor only;
   on the Machine view a warning appears instead, and the clones give up if nobody comes.
   Tuning lives in GW.CONFIG.clones. */
window.GW = window.GW || {};

GW.clones = (function () {
  var C = GW.CONFIG, U = GW.util, E = GW.econ, K = C.clones;
  var active = null, nextAt = 0;
  var IMG = function (v, pose) { return 'assets/clones/clone_' + v + '_' + pose + '.webp'; };

  function layoutName() { return window.matchMedia('(max-width: 720px)').matches ? 'tall' : 'wide'; }
  function interval(s) {
    var base = U.rand(K.minSeconds, K.maxSeconds);
    return Math.max(K.floorSeconds, base / (1 + (s.producers.cloner || 0) / K.clonersPerHalving)) * 1000;
  }
  function reward(s) { return Math.max(E.rates(s).total * K.rescueSeconds, E.tapValue(s) * 20); }

  // ---------- start: warn on the Machine view, or go straight to the floor ----------
  function trigger(s) {
    if (active) return;
    active = { s: s, phase: 'waiting', waitEnds: performance.now() + K.waitForFloorSeconds * 1000, clones: [], count: K.count };
    if (s.view === 'floor') { launch(); return; }
    // Not watching the floor: the Megagnome deals with what he can before anyone escapes.
    var ate = 0;
    while (ate < active.count && GW.mega.spend('clone')) ate++;
    if (ate) {
      var amt = reward(s) * ate;
      s.cogs += amt; s.cogsSeen += amt;
      s.stats.clonesSplooshed = (s.stats.clonesSplooshed || 0) + ate;
      active.count -= ate;
      GW.sfx.burp();
      GW.ui.toast('The Megagnome ate ' + ate + ' escaped clone' + (ate > 1 ? 's' : '') + ' while you were busy.  BURP.  +' + C.currency.icon + ' ' + U.fmt(amt), 'lucky');
      if (active.count <= 0) { active = null; nextAt = performance.now() + interval(s); return; }
    }
    var alertEl = document.getElementById('cloneAlert');
    alertEl.hidden = false;
    GW.sfx.hehe();
  }

  function launch() {
    var s = active.s, L = K.paths[layoutName()], floor = document.getElementById('floor');
    document.getElementById('cloneAlert').hidden = true;
    active.phase = 'run'; active.layout = layoutName();
    active.megaAt = performance.now() + C.mega.firstCrackSeconds * 1000;
    var pool = K.variants.slice();
    for (var i = 0; i < active.count; i++) {
      var v = pool.splice(Math.floor(Math.random() * pool.length), 1)[0];
      active.clones.push(makeClone(floor, v, L, i));
    }
    showArrow(true);
  }

  function makeClone(floor, v, L, i) {
    var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var el = U.el('div', 'clone' + (calm ? ' calm' : ''));
    var img = U.el('img', 'clone-img'); img.alt = ''; img.draggable = false; img.src = IMG(v, 'run');
    el.appendChild(img);
    var scale = C.floor.layouts[layoutName()].scale;
    el.style.height = (K.height * scale) + 'cqh';
    el.setAttribute('role', 'button');
    el.setAttribute('aria-label', 'An escaped clone.  Drag him into the vat.');
    floor.appendChild(el);
    var c = { el: el, img: img, v: v, x: L.start[0] - i * 4, y: L.start[1], route: [], phase: 'wander',
      wanderEnds: performance.now() + (K.wanderSeconds + i * 0.8) * 1000, target: null, held: false, done: false,
      item: null, stolen: 0, grabPause: 0 };
    place(c);
    // Drag to the vat.  Real pointers only.
    el.addEventListener('pointerdown', function (e) {
      e.stopPropagation();
      if (!e.isTrusted || c.done || !active || active.s.paused) return;
      e.preventDefault();
      el.setPointerCapture(e.pointerId);
      c.held = true; el.classList.add('held'); c.img.src = IMG(c.v, 'held');
      document.getElementById('floor').classList.add('dragging', 'dragging-clone');
      hint(true);
      placeArrow();
      moveTo(c, e);
    });
    el.addEventListener('pointermove', function (e) { if (c.held) { moveTo(c, e); markVat(overVat(e)); } });
    var up = function (e) {
      if (!c.held) return;
      c.held = false; el.classList.remove('held');
      document.getElementById('floor').classList.remove('dragging');
      markVat(false);
      document.getElementById('floor').classList.remove('dragging-clone');
      hint(false);
      if (overVat(e)) sploosh(c); else drop(c);
    };
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    return c;
  }

  function place(c) {
    c.el.style.left = c.x + '%'; c.el.style.top = c.y + '%';
  }
  function moveTo(c, e) {
    var r = document.getElementById('floor').getBoundingClientRect();
    c.x = (e.clientX - r.left) / r.width * 100;
    c.y = (e.clientY - r.top) / r.height * 100;
    place(c);
  }
  // The pointer is the pinching hand, so the clone dangles below it.  A good drop is with the
  // clone hanging over the mouth of the vat: pointer above the rim, about one clone-height up.
  // Where the hand should be to drop a clone in: centered over the vat, high enough that the
  // dangling clone clears the rim.  The glowing arrow marks this spot.
  function dropSpot() {
    var vat = document.querySelector('#floor .part-vat');
    if (!vat) return null;
    var r = vat.getBoundingClientRect(), fr = document.getElementById('floor').getBoundingClientRect();
    var one = document.querySelector('#floor .clone');
    var hang = (one ? one.offsetHeight : fr.height * K.height * C.floor.layouts[layoutName()].scale / 100) * 1.12;   // held clone, hand to toes
    return { x: r.left + r.width / 2, y: r.top - hang * 0.9, w: r.width, hang: hang, fr: fr };
  }
  function overVat(e) {
    var d = dropSpot();
    if (!d) return false;
    return Math.abs(e.clientX - d.x) < d.w * 0.65 && Math.abs(e.clientY - d.y) < d.hang * 0.6;
  }
  function placeArrow() {
    var a = document.getElementById('cloneArrow'), d = dropSpot();
    if (!a || !d) return;
    var xp = (d.x - d.fr.left) / d.fr.width * 100;
    a.style.left = xp + '%';
    a.classList.toggle('label-left', xp > 70);   // keep the label on screen near the right edge
    a.style.top = ((d.y - d.fr.top) / d.fr.height * 100) + '%';
  }
  function showArrow(on) {
    var a = document.getElementById('cloneArrow');
    if (on && !a) {
      a = U.el('div', 'clone-arrow'); a.id = 'cloneArrow';
      a.innerHTML = '<svg viewBox="0 0 60 80" aria-hidden="true"><path d="M18 4h24v34h14L30 76 4 38h14z"/></svg><span>Drop here!</span>';
      document.getElementById('floor').appendChild(a);
    }
    if (a) { a.hidden = !on; if (on) placeArrow(); }
    // Big instruction banner across the top of the floor, up for the whole attack.
    var h = document.getElementById('cloneHint');
    if (on && !h) {
      h = U.el('div', 'clone-hint'); h.id = 'cloneHint';
      document.getElementById('floor').appendChild(h);
    }
    if (h) { h.hidden = !on; if (on) hint(false); }
  }
  function hint(holding) {
    var h = document.getElementById('cloneHint');
    if (!h) return;
    h.classList.toggle('holding', !!holding);
    h.innerHTML = holding
      ? '<b>Now drop him in the vat!</b><span>Let go on the green arrow</span>'
      : '<b>Clones are stealing your junk!</b><span>Grab a clone and drop him in the vat</span>';
  }
  function markVat(on) {
    var vat = document.querySelector('#floor .part-vat');
    if (vat) vat.classList.toggle('vat-ready', !!on);
  }

  // ---------- the run ----------
  function floorsOf() {
    var L = K.paths[active.layout], ys = {};
    L.loop.forEach(function (p) { ys[p[1]] = true; }); ys[L.start[1]] = true;
    return Object.keys(ys).map(Number).sort(function (a, b) { return a - b; });
  }

  function grab(c) {
    var s = active.s;
    var owned = C.items.filter(function (i) { return i.emoji && i.group !== 'treasures' && (s.items[i.id] || 0) >= 1; });
    c.img.src = IMG(c.v, 'grab');
    c.el.classList.add('has-loot');
    if (owned.length) {
      var it = owned[Math.floor(Math.random() * owned.length)];
      var n = Math.max(1, Math.floor(s.items[it.id] * K.stealShare));
      s.items[it.id] -= n;
      c.item = it; c.stolen = n;
      var ic = GW.ui.itemIcon(it, true); ic.classList.add('clone-loot');
      c.el.appendChild(ic);
      GW.ui.buildShelf(s);
    }
    GW.sfx.hehe();
    var L = K.paths[active.layout], route = [];
    for (var k = 0; k < K.loops; k++) route = route.concat(L.loop);
    c.route = route.concat(L.exit);
    c.phase = 'route'; c.grabPause = 0.5;
  }

  function step(c, dt) {
    if (c.done || c.held) return;
    if (c.phase === 'falling') {
      c.y = Math.min(c.fallTo, c.y + K.fallSpeed * dt);
      if (c.y >= c.fallTo) c.phase = c.after;
      place(c); return;
    }
    if (c.phase === 'wander') {
      var L = K.paths[active.layout];
      if (!c.target) c.target = [U.rand(L.wander[0], L.wander[1]), L.start[1]];
      if (performance.now() >= c.wanderEnds) { grab(c); return; }
    } else if (c.phase === 'route') {
      if (c.grabPause > 0) { c.grabPause -= dt; return; }
      if (!c.route.length) { escape(c); return; }
      c.target = c.route[0];
    }
    var t = c.target, dx = t[0] - c.x, dy = t[1] - c.y, dist = Math.hypot(dx, dy);
    var sp = t[2] === 'f' ? K.fallSpeed : (Math.abs(dy) > 0.5 ? K.climbSpeed : K.speed);
    if (t[2] === 'f' && Math.abs(dx) < 0.5) sp = K.fallSpeed;
    var mv = sp * dt;
    if (dist <= mv) {
      c.x = t[0]; c.y = t[1];
      if (c.phase === 'route') c.route.shift(); else c.target = null;
    } else {
      c.x += dx / dist * mv; c.y += dy / dist * mv;
    }
    if (Math.abs(dx) > 0.3) c.el.classList.toggle('flip', dx < 0);
    place(c);
  }

  // Dropped somewhere other than the vat: he falls to the floor below and carries on.
  function drop(c) {
    var ys = floorsOf(), below = ys.filter(function (y) { return y >= c.y - 1; });
    var fy = below.length ? below[0] : ys[ys.length - 1];
    c.img.src = IMG(c.v, c.item ? 'grab' : 'run');
    c.after = c.phase === 'falling' ? c.after : c.phase;
    c.phase = 'falling'; c.fallTo = fy;
    if (c.after === 'route') {
      // Pick up the route again from the next point on this floor.
      var i = c.route.findIndex(function (p) { return Math.abs(p[1] - fy) < 1; });
      if (i > 0) c.route = c.route.slice(i);
      else if (i < 0) c.route = K.paths[active.layout].exit.slice();
    }
  }

  function sploosh(c) {
    var s = active.s;
    c.done = true;
    var vat = document.querySelector('#floor .part-vat');
    if (vat) {
      var r = vat.getBoundingClientRect(), fr = document.getElementById('floor').getBoundingClientRect();
      c.x = (r.left + r.width / 2 - fr.left) / fr.width * 100; c.y = (r.top + r.height * 0.3 - fr.top) / fr.height * 100; place(c);
      var vimg = vat.querySelector('.f-static');
      vimg.src = 'assets/clones/vat_sploosh.webp'; vat.classList.add('splooshing');
      setTimeout(function () { vimg.src = 'assets/crew/../clones/vat_full.webp'; vat.classList.remove('splooshing'); }, 700);
    }
    c.el.classList.add('splooshed');
    setTimeout(function () { c.el.remove(); }, 450);
    GW.sfx.sploop();
    var amt = reward(s);
    s.cogs += amt; s.cogsSeen += amt;
    s.stats.clonesSplooshed = (s.stats.clonesSplooshed || 0) + 1;
    if (c.item) {
      s.items[c.item.id] = (s.items[c.item.id] || 0) + c.stolen;
      GW.ui.buildShelf(s);
      GW.ui.toast('SPLOOSH!  Got back ' + U.fmt(c.stolen) + ' ' + c.item.name + ', plus ' + C.currency.icon + ' ' + U.fmt(amt) + '.', 'lucky');
    } else {
      GW.ui.toast('SPLOOSH!  Back in the vat before he grabbed anything.  +' + C.currency.icon + ' ' + U.fmt(amt), 'lucky');
    }
    maybeEnd();
  }

  function escape(c) {
    c.done = true; c.el.remove();
    var s = active.s;
    s.stats.clonesEscaped = (s.stats.clonesEscaped || 0) + 1;
    if (c.item) GW.ui.toast('A clone escaped with ' + U.fmt(c.stolen) + ' ' + c.item.name + '!', '');
    maybeEnd();
  }

  function maybeEnd() {
    if (!active || active.clones.some(function (c) { return !c.done; })) return;
    var s = active.s; active = null;
    showArrow(false);
    nextAt = performance.now() + interval(s);
  }

  // Something rebuilt the floor (screen rotated past the phone size): call it off, give the junk back.
  function abort() {
    var s = active.s;
    active.clones.forEach(function (c) { if (!c.done && c.item) s.items[c.item.id] += c.stolen; c.el.remove(); });
    document.getElementById('cloneAlert').hidden = true;
    var a = document.getElementById('cloneArrow'); if (a) a.remove();
    var h = document.getElementById('cloneHint'); if (h) h.remove();
    active = null; nextAt = performance.now() + interval(s);
    GW.ui.buildShelf(s);
  }

  // ---------- every frame (not called while paused) ----------
  function tick(now, dt, s) {
    if (active) {
      if (active.phase === 'waiting') {
        if (s.view === 'floor') launch();
        else if (now >= active.waitEnds) {
          document.getElementById('cloneAlert').hidden = true;
          active = null; nextAt = now + interval(s);
          GW.ui.toast('The clones slunk back into the vat.  Nothing was taken.', '');
        }
        return;
      }
      if (active.clones.some(function (c) { return !c.done && !c.el.isConnected; })) { abort(); return; }
      if (s.view !== 'floor') { shift(dt * 1000); return; }   // frozen while you're not watching
      active.clones.forEach(function (c) { step(c, Math.min(dt, 0.1)); });
      if (active && now >= active.megaAt) megaHelp(now);
      return;
    }
    if (!(s.producers.cloner > 0)) { nextAt = 0; return; }
    if (!nextAt) { nextAt = now + interval(s); return; }
    if (now >= nextAt && !document.hidden) trigger(s);
  }
  // The Megagnome eats one loose clone (not one you're holding) every few seconds while he has food.
  function megaHelp(now) {
    if (!GW.mega.canHelp()) return;
    var c = active.clones.filter(function (k) { return !k.done && !k.held; })[0];
    var m = GW.mega.mouth();
    if (!c || !m || !GW.mega.spend('clone')) return;
    active.megaAt = now + C.mega.helpEverySeconds * 1000;
    var s = active.s;
    c.done = true;
    c.el.style.transition = 'left .45s ease-in, top .45s ease-in, transform .45s ease-in, opacity .45s';
    c.el.style.left = m.x + '%'; c.el.style.top = m.y + '%';
    c.el.style.transform = 'translate(-50%, -100%) scale(.25)'; c.el.style.opacity = '0';
    c.el.style.pointerEvents = 'none';
    setTimeout(function () { c.el.remove(); }, 480);
    GW.mega.chomp();
    var amt = reward(s);
    s.cogs += amt; s.cogsSeen += amt;
    s.stats.clonesSplooshed = (s.stats.clonesSplooshed || 0) + 1;
    if (c.item) { s.items[c.item.id] = (s.items[c.item.id] || 0) + c.stolen; GW.ui.buildShelf(s); }
    GW.ui.toast('CHOMP!  The Megagnome ate a clone' + (c.item ? ' and spat out ' + U.fmt(c.stolen) + ' ' + c.item.name : '') + '.', 'lucky');
    maybeEnd();
  }

  function shift(ms) {
    if (nextAt) nextAt += ms;
    if (active) {
      if (active.megaAt) active.megaAt += ms;
      if (active.waitEnds) active.waitEnds += ms;
      active.clones.forEach(function (c) { c.wanderEnds += ms; });
    }
  }

  return { trigger: trigger, tick: tick, shift: shift, isActive: function () { return !!active; } };
})();
