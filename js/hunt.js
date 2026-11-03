/* The hunt: a crossbow mini-game that feeds the Megagnome.
   A box pops up over the machine.  Prey runs back and forth.  Press, drag down to pull the
   string back (drag sideways to aim, slingshot style), let go to fire.  Every shot costs cogs.
   One hit kills (the Banana Monster boss takes three).  Each kill is food.  Real hands only.
   Tuning lives in GW.CONFIG.mega. */
window.GW = window.GW || {};

GW.hunt = (function () {
  var C = GW.CONFIG, U = GW.util, E = GW.econ, M = C.mega;
  var h = null;   // the open hunt, or null
  // Crossbow picture is 600 x 418.  Bow tips and the resting nock point, in picture pixels.
  var TIP_L = [32, 146], TIP_R = [568, 146], NOCK = [292, 112], PULL_PX = 150;
  var LANE_Y = 47;   // prey lane, % of the box height (center of the prey)

  function shotCost(s) { return Math.max(E.rates(s).total * M.shotSeconds, E.tapValue(s) * M.minShotTaps); }
  function calm() { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }

  // ---------- open / close ----------
  function open() {
    var s = GW.game.s;
    if (h || !s.mega.owned || s.paused) return;
    s.mega.nextHunt = Date.now() + M.huntCooldownSeconds * 1000;
    s.mega.hunts += 1;
    var box = U.el('div', 'hunt'); box.id = 'hunt';
    box.innerHTML =
      '<div class="hunt-box" style="background-image:url(\'assets/mega/hunt_' + (GW.theme.isNight() ? 'night' : 'day') + '.webp\')">' +
        '<div class="hunt-top"><span class="hunt-bolts"></span><span class="hunt-food"></span><span class="hunt-cost"></span>' +
          '<button type="button" class="btn hunt-done">Done</button></div>' +
        '<div class="hunt-tip"><b>Feed the Megagnome!</b><span>Drag down to pull back, sideways to aim, let go to shoot.  Each kill is 1 food; he spends it on events by himself.</span></div>' +
        '<div class="hunt-field"></div>' +
        '<div class="hunt-reticle" hidden></div>' +
        '<div class="hunt-bow"><img class="bow-img" src="assets/mega/crossbow.webp" alt="" draggable="false">' +
          '<svg class="bow-string" viewBox="0 0 600 418" aria-hidden="true"><polyline points="" /></svg>' +
          '<img class="bow-bolt" src="assets/mega/bolt.webp" alt="" draggable="false"></div>' +
      '</div>';
    document.body.appendChild(box);
    h = { s: s, el: box, field: box.querySelector('.hunt-field'), bolts: M.bolts, food0: s.mega.food, speed: M.preySpeed,
      prey: null, drag: null, flying: 0, ending: false, kills: 0 };
    box.addEventListener('pointerdown', down);
    box.addEventListener('pointermove', move);
    box.addEventListener('pointerup', up);
    box.addEventListener('pointercancel', function () { h && (h.drag = null); pull(0, 50); });
    box.querySelector('.hunt-done').addEventListener('pointerdown', function (e) { e.stopPropagation(); });
    box.querySelector('.hunt-done').addEventListener('click', function () { end(); });
    spawn(false);
    pull(0, 50);
    hud();
  }

  function end() {
    if (!h || h.ending) return;
    h.ending = true;
    var gained = h.s.mega.food - h.food0, el = h.el;
    var note = U.el('div', 'hunt-over', gained > 0 ? 'Hunt over!  +' + gained + ' food 🍖' : 'Hunt over.  Nothing for the big guy this time.');
    h.el.querySelector('.hunt-box').appendChild(note);
    setTimeout(function () {
      el.classList.add('closing');
      setTimeout(function () { el.remove(); }, 300);
      if (gained > 0) GW.mega.chomp();
    }, 1500);
    h = null;
  }

  // ---------- prey ----------
  function spawn(allowBoss) {
    // The boss only shows up while there are enough bolts left to actually beat him.
    var boss = allowBoss && h.bolts >= M.bossHits && Math.random() < M.bossChance;
    var def = boss ? M.boss : M.prey[Math.floor(Math.random() * M.prey.length)];
    var el = U.el('div', 'prey' + (boss ? ' boss' : ''));
    var im = U.el('img'); im.src = 'assets/mega/prey_' + def.id + '.webp'; im.alt = ''; im.draggable = false;
    el.appendChild(im);
    if (boss) el.appendChild(U.el('div', 'boss-tag', 'BOSS!'));
    h.field.appendChild(el);
    var dir = Math.random() < 0.5 ? 1 : -1;
    h.prey = { el: el, def: def, boss: boss, hp: boss ? M.bossHits : 1, x: dir > 0 ? 12 : 88, dir: dir, t: 0, dead: false };
    placePrey();
    if (boss) GW.sfx.shiny(true);
  }
  function placePrey() {
    var p = h.prey; if (!p) return;
    var bob = calm() ? 0 : Math.sin(p.t * 7) * 1.2;
    p.el.style.left = p.x + '%'; p.el.style.top = (LANE_Y + bob) + '%';
    p.el.classList.toggle('flip', p.dir * p.def.face < 0);
  }

  // ---------- aiming ----------
  function boxRect() { return h.el.querySelector('.hunt-box').getBoundingClientRect(); }
  function down(e) {
    if (!h || h.ending || !e.isTrusted || h.s.paused || h.bolts <= 0) return;
    e.preventDefault(); e.stopPropagation();
    h.el.setPointerCapture(e.pointerId);
    h.drag = { x0: e.clientX, y0: e.clientY, pull: 0, aim: 50 };
  }
  function move(e) {
    if (!h || !h.drag) return;
    var r = boxRect(), d = h.drag;
    d.pull = Math.max(0, Math.min(1, (e.clientY - d.y0) / (r.height * 0.28)));
    d.aim = Math.max(4, Math.min(96, 50 - (e.clientX - d.x0) / r.width * 100 * 1.6));
    pull(d.pull, d.aim);
  }
  function up(e) {
    if (!h || !h.drag) return;
    var d = h.drag; h.drag = null;
    if (!e.isTrusted || d.pull < 0.3) { pull(0, d.aim); return; }
    fire(d.aim);
  }
  // Draw the bow: string bent back to the nock, bolt riding the string, reticle on the lane.
  function pull(p, aim) {
    var bow = h.el.querySelector('.hunt-bow'), line = bow.querySelector('polyline'), bolt = bow.querySelector('.bow-bolt');
    var ny = NOCK[1] + p * PULL_PX;
    line.setAttribute('points', TIP_L.join(',') + ' ' + NOCK[0] + ',' + ny + ' ' + TIP_R.join(','));
    bolt.style.top = ((ny - 150) / 418 * 100) + '%';
    bolt.hidden = h.bolts <= 0;
    // Swing from a pivot below the box, small angles only, so the cut-off arms never come into view.
    bow.style.transform = 'translateX(-50%) rotate(' + ((aim - 50) * 0.22) + 'deg) translateY(' + (p * 4) + '%)';
    var ret = h.el.querySelector('.hunt-reticle');
    ret.hidden = p < 0.3;
    ret.style.left = aim + '%'; ret.style.top = LANE_Y + '%';
  }

  // ---------- shooting ----------
  function fire(aim) {
    var s = h.s, cost = shotCost(s);
    if (s.cogs < cost) { GW.ui.toast('Not enough cogs for a bolt (' + C.currency.icon + ' ' + U.fmt(cost) + ').', ''); pull(0, aim); return; }
    s.cogs -= cost;
    h.bolts -= 1; h.flying += 1;
    s.stats.huntShots = (s.stats.huntShots || 0) + 1;
    GW.sfx.twang();
    pull(0, aim);
    hud();
    // The bolt flies away from you, shrinking with distance, to the aim point on the lane.
    var r = boxRect(), b = U.el('img', 'flying-bolt'); b.src = 'assets/mega/bolt.webp'; b.alt = '';
    h.el.querySelector('.hunt-box').appendChild(b);
    var ang = Math.atan2((aim - 50) / 100 * r.width, (0.92 - LANE_Y / 100) * r.height) * 180 / Math.PI;
    b.animate([
      { left: '50%', top: '86%', transform: 'translate(-50%, -50%) rotate(' + ang + 'deg) scale(1)' },
      { left: aim + '%', top: LANE_Y + '%', transform: 'translate(-50%, -50%) rotate(' + ang + 'deg) scale(.35)' }
    ], { duration: M.boltFlightSeconds * 1000, easing: 'ease-out', fill: 'forwards' });
    var hh = h;
    setTimeout(function () {
      b.remove();
      if (h !== hh) return;
      h.flying -= 1;
      land(aim);
      if (h && h.bolts <= 0 && h.flying <= 0) setTimeout(end, 500);
    }, M.boltFlightSeconds * 1000);
  }

  function land(aim) {
    var p = h.prey;
    if (!p || p.dead) { puff(aim, 'Miss!'); return; }
    var half = p.el.getBoundingClientRect().width / boxRect().width * 100 * 0.42;
    if (Math.abs(p.x - aim) > half) { puff(aim, 'Miss!'); return; }
    p.hp -= 1;
    if (p.boss && p.hp > 0) {
      // Boss takes a hit: knocked back, a couple of bananas fly.
      p.el.animate([{ transform: 'translate(-50%, -50%) scale(1)' }, { transform: 'translate(-50%, -50%) scale(.85) rotate(-8deg)' }, { transform: 'translate(-50%, -50%) scale(1)' }], { duration: 300 });
      bananas(p.x, 3);
      GW.sfx.ugh('bossHit');
      return;
    }
    kill(p);
  }

  function kill(p) {
    var s = h.s;
    p.dead = true;
    burst(p.x, p.def.burst, p.boss);
    p.el.classList.add('dead');
    setTimeout(function () { p.el.remove(); }, 250);
    GW.sfx.ugh(p.boss ? 'bossDie' : 'kill');
    s.mega.kills += 1; h.kills += 1;
    var food = p.boss ? M.bossFood : 1;
    GW.mega.feed(food);
    floatHunt(p.x, '+' + food + ' 🍖');
    if (p.boss) {
      s.mega.bossKills += 1;
      bananas(p.x, 14);
      s.mega.trophyPity += 1;
      if (Math.random() < M.trophyChance || s.mega.trophyPity >= M.trophyPity) {
        s.mega.trophyPity = 0;
        var isNew = !s.items.banana_trophy;
        s.items.banana_trophy = (s.items.banana_trophy || 0) + 1;
        GW.sfx.legendary();
        GW.ui.toast((isNew ? 'LEGENDARY!  ' : 'Another one!  ') + 'Banana Monster Trophy goes on the shelf!', 'legendary');
        GW.ui.buildShelf(s); GW.ui.flashItem('banana_trophy');
      }
    }
    h.speed *= M.speedUpPerHit;
    hud();
    if (s.mega.food >= M.maxFood) { setTimeout(end, 700); return; }
    var hh = h;
    setTimeout(function () { if (h === hh && !h.ending) spawn(!p.boss); }, 650);
  }

  // ---------- effects ----------
  function burst(x, color, big) {
    var b = U.el('img', 'hunt-burst' + (big ? ' big' : ''));
    b.src = 'assets/mega/splat_' + color + '.webp'; b.alt = '';
    b.style.left = x + '%'; b.style.top = LANE_Y + '%';
    b.style.setProperty('--r', U.rand(-40, 40).toFixed(0) + 'deg');
    h.el.querySelector('.hunt-box').appendChild(b);
    setTimeout(function () { b.remove(); }, 700);
  }
  function bananas(x, n) {
    var box = h.el.querySelector('.hunt-box');
    for (var i = 0; i < n; i++) {
      var b = U.el('img', 'flying-banana'); b.src = 'assets/emoji/1f34c.svg'; b.alt = '';
      b.style.left = x + '%'; b.style.top = LANE_Y + '%';
      box.appendChild(b);
      var dx = U.rand(-30, 30), dy = U.rand(-30, -5), rot = U.rand(-540, 540);
      b.animate([
        { transform: 'translate(-50%, -50%) rotate(0deg)', opacity: 1 },
        { transform: 'translate(calc(-50% + ' + dx + 'cqw), calc(-50% + ' + dy + 'cqh)) rotate(' + rot + 'deg)', opacity: 1, offset: 0.6 },
        { transform: 'translate(calc(-50% + ' + (dx * 1.2) + 'cqw), calc(-50% + ' + (dy + 40) + 'cqh)) rotate(' + (rot * 1.3) + 'deg)', opacity: 0 }
      ], { duration: 1100, easing: 'ease-out' });
      (function (bb) { setTimeout(function () { bb.remove(); }, 1100); })(b);
    }
  }
  function puff(x, text) { floatHunt(x, text, 'miss'); }
  function floatHunt(x, text, cls) {
    var t = U.el('div', 'hunt-float ' + (cls || ''), text);
    t.style.left = x + '%'; t.style.top = (LANE_Y - 10) + '%';
    h.el.querySelector('.hunt-box').appendChild(t);
    setTimeout(function () { t.remove(); }, 900);
  }
  function hud() {
    if (!h) return;
    var b = '';
    for (var i = 0; i < M.bolts; i++) b += i < h.bolts ? '▲' : '△';
    h.el.querySelector('.hunt-bolts').textContent = 'Bolts ' + b;
    h.el.querySelector('.hunt-food').textContent = '🍖 ' + h.s.mega.food + '/' + M.maxFood;
    h.el.querySelector('.hunt-cost').textContent = 'Shot ' + C.currency.icon + ' ' + U.fmt(shotCost(h.s));
  }

  // ---------- every frame (main.js), not while paused ----------
  function tick(dt) {
    if (!h || !h.prey || h.prey.dead) return;
    var p = h.prey;
    p.t += dt;
    p.x += p.dir * h.speed * dt * (p.boss ? 0.75 : 1);
    if (p.x > 88) { p.x = 88; p.dir = -1; }
    if (p.x < 12) { p.x = 12; p.dir = 1; }
    placePrey();
  }

  return { open: open, tick: tick, isOpen: function () { return !!h; } };
})();
