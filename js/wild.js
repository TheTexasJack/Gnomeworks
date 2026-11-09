/* Wild Magic: the Wizards lose control and junk starts spinning around the machine.
   Tap each spinning thing (real taps only) before the spell fizzles out on its own.
   Unlocked by the Wild Magic upgrade.  Tuning lives in GW.CONFIG.wild. */
window.GW = window.GW || {};

GW.wild = (function () {
  var C = GW.CONFIG, U = GW.util, E = GW.econ, W = C.wild;
  var active = null, nextAt = 0;

  function style() {
    var m = /[?&]wild=(\w+)/.exec(window.location.search);
    return (m && m[1]) || W.style;
  }
  function junk() { return C.items.filter(function (i) { return i.emoji && (i.tier === 'common' || i.tier === 'uncommon'); }); }
  function reward(s, secs) { return Math.max(E.rates(s).total * secs, E.tapValue(s) * secs * 2); }

  function interval(s) {
    var base = U.rand(W.minSeconds, W.maxSeconds);
    return Math.max(W.floorSeconds, base / (1 + (s.producers.wizard || 0) / W.wizardsPerHalving)) * 1000;
  }
  function unlocked(s) { return !!s.oneTime.wiz_wild; }

  function start(s, forceStyle) {
    if (active) return;
    var st = forceStyle || style();
    var box = document.getElementById('rareSlot');
    var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var pool = junk(), now = performance.now();
    active = { s: s, left: W.targets, caught: 0, ends: now + W.durationSeconds * 1000, els: [], style: st, megaAt: now + GW.CONFIG.mega.firstCrackSeconds * 1000 };
    var bonusIdx = st === 'storm' ? Math.floor(Math.random() * W.targets) : -1;
    var spots = [];
    for (var i = 0; i < W.targets; i++) {
      // Spread them out: pick a spot not too close to the others.
      var x, y, tries = 0;
      do { x = U.rand(10, 82); y = U.rand(10, 78); tries++; }
      while (tries < 30 && spots.some(function (p) { return Math.abs(p[0] - x) < 17 && Math.abs(p[1] - y) < 17; }));
      spots.push([x, y]);
      makeTarget(box, pool[Math.floor(Math.random() * pool.length)], x, y, i * W.staggerSeconds * 1000 / W.targets, i === bonusIdx, st, calm);
    }
    document.getElementById('machine').classList.add('wild-on');
    GW.sfx.shiny(true);
    GW.ui.toast('Wild Magic!  The Wizards lost control.  Tap the spinning junk!', 'super');
  }

  function makeTarget(box, item, x, y, delay, bonus, st, calm) {
    var b = U.el('button', 'wild-target wt-' + st + (bonus ? ' wt-bonus' : '') + (calm ? ' wt-calm' : ''));
    b.type = 'button';
    b.setAttribute('aria-label', 'Spinning ' + item.name + '.  Tap to stop it.');
    b.style.left = x + '%'; b.style.top = y + '%';
    b.style.animationDelay = (delay / 1000) + 's';
    b.style.setProperty('--spin', (0.6 + Math.random() * 0.5).toFixed(2) + 's');
    b.style.setProperty('--dir', Math.random() < 0.5 ? '1' : '-1');
    if (st !== 'spin') {
      var sw = U.el('img', 'wt-swirl'); sw.alt = ''; sw.draggable = false;
      sw.src = 'assets/crew/' + (bonus ? 'fx_swirl_cogs' : 'fx_swirl') + '.webp';
      b.appendChild(sw);
    }
    var ic = GW.ui.itemIcon(item, true); ic.classList.add('wt-item');
    b.appendChild(ic);
    b.addEventListener('pointerdown', function (e) {
      e.stopPropagation();
      if (!e.isTrusted) return;          // only a real person can break the spell
      e.preventDefault(); hit(b, bonus);
    });
    b.addEventListener('keydown', function (e) {
      if (!e.isTrusted || (e.key !== ' ' && e.key !== 'Enter')) return;
      e.preventDefault(); hit(b, bonus);
    });
    box.appendChild(b);
    active.els.push(b);
  }

  function hit(b, bonus, byMega) {
    if (!active || b.classList.contains('caught')) return;
    var s = active.s;
    b.classList.add('caught');
    var amt = reward(s, W.secondsPerTarget * (bonus ? W.bonusMultiplier : 1));
    s.cogs += amt; s.cogsSeen += amt;
    var burst = U.el('img', 'wt-burst'); burst.alt = ''; burst.src = 'assets/crew/fx_swirl_debris.webp';
    burst.style.left = b.style.left; burst.style.top = b.style.top;
    document.getElementById('fx').appendChild(burst);
    setTimeout(function () { burst.remove(); }, 700);
    GW.ui.floatText(parseFloat(b.style.left) + 4, parseFloat(b.style.top), '+' + C.currency.icon + ' ' + U.fmt(amt), bonus ? 'big' : '');
    if (byMega) { GW.sfx.yum(); GW.mega.chomp(true); } else { GW.sfx.click(); GW.sfx.sprocket(); }
    setTimeout(function () { b.remove(); }, 350);
    active.caught += 1; active.left -= 1;
    if (active.left <= 0) finish(true);
  }

  function finish(all) {
    var a = active; if (!a) return;
    active = null;
    document.getElementById('machine').classList.remove('wild-on');
    a.els.forEach(function (b) {
      if (b.classList.contains('caught')) return;
      b.classList.add('fizzle'); setTimeout(function () { b.remove(); }, 600);
    });
    a.s.stats.wildEvents = (a.s.stats.wildEvents || 0) + 1;
    if (all) {
      var amt = reward(a.s, W.allClearSeconds);
      a.s.cogs += amt; a.s.cogsSeen += amt;
      a.s.stats.wildCleared = (a.s.stats.wildCleared || 0) + 1;
      GW.sfx.superRare();
      GW.ui.toast('Spell broken!  All ' + W.targets + ' caught.  Bonus +' + C.currency.icon + ' ' + U.fmt(amt), 'lucky');
    } else {
      GW.ui.toast(a.caught ? 'The magic fizzled out.  You caught ' + a.caught + ' of ' + W.targets + '.' : 'The magic fizzled out.', '');
    }
    nextAt = performance.now() + interval(a.s);
  }

  // Called every frame while the game is running.
  function tick(now, s) {
    if (active) {
      if (now >= active.ends) { finish(false); return; }
      // The Megagnome snaps up a regular spinning item now and then.  The golden one is for real hands.
      if (now >= active.megaAt && GW.mega.canHelp()) {
        var t = active.els.filter(function (b) { return !b.classList.contains('caught') && !b.classList.contains('wt-bonus') && b.isConnected; })[0];
        if (t && GW.mega.spend('wild')) {
          active.megaAt = now + GW.CONFIG.mega.helpEverySeconds * 1000;
          GW.ui.floatText(parseFloat(t.style.left), parseFloat(t.style.top) - 6, 'CHOMP!', 'big');
          hit(t, false, true);
        }
      }
      return;
    }
    if (!unlocked(s)) { nextAt = 0; return; }
    if (!nextAt) { nextAt = now + interval(s); return; }
    if (now >= nextAt && !document.hidden) start(s);
  }
  // Called while paused so nothing expires or starts.
  function shift(ms) { if (active) { active.ends += ms; active.megaAt += ms; } if (nextAt) nextAt += ms; }

  return { nextIn: function () { return nextAt ? Math.round((nextAt - performance.now()) / 1000) : null; }, start: start, tick: tick, shift: shift, isActive: function () { return !!active; } };
})();
