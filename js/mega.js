/* The Megagnome: one per player, events only.  He sits on the Shop Floor and spends food
   automatically to help with events (eats escaped clones, catches Wild Magic junk).
   Food comes from the crossbow hunt (hunt.js).  Tuning lives in GW.CONFIG.mega. */
window.GW = window.GW || {};

GW.mega = (function () {
  var C = GW.CONFIG, U = GW.util, E = GW.econ, M = C.mega;
  var row = null, poseTimer = null;

  function st() { return GW.game.s.mega; }
  function hintsOn() { return !document.documentElement.classList.contains('no-hints'); }
  function owned() { return !!(GW.game && st().owned); }
  function canHelp() { return owned() && st().food > 0; }
  function reqs(s) {
    return [
      { label: 'A Gnome Cloner', ok: (s.producers[M.requires.producer] || 0) > 0 },
      { label: 'The Wild Magic upgrade', ok: !!s.oneTime[M.requires.oneTime] }
    ];
  }
  function huntReadyIn(s) { return Math.max(0, (s.mega.nextHunt - Date.now()) / 1000); }

  // ---------- shop row (always listed, like a goal on the board) ----------
  function buildRow() {
    var shop = document.getElementById('shop'); if (!shop) return;
    var heads = shop.querySelectorAll('.shop-head'), after = heads[1] || null;   // before "Upgrades"
    row = U.el('button', 'shop-row mega-row'); row.type = 'button';
    var icw = U.el('span', 'mega-icon');
    var ic = U.el('img', 'shop-icon'); ic.src = 'assets/icons/icon_mega.webp'; ic.alt = ''; ic.draggable = false;
    icw.appendChild(ic); icw.appendChild(U.el('span', 'food-badge'));
    row.appendChild(icw);
    var left = U.el('div', 'shop-left');
    left.appendChild(U.el('div', 'shop-name', 'The Megagnome'));
    left.appendChild(U.el('div', 'shop-desc mega-desc'));
    var right = U.el('div', 'shop-right');
    right.appendChild(U.el('div', 'shop-cost'));
    right.appendChild(U.el('div', 'shop-owned'));
    var meter = U.el('div', 'shop-meter'); meter.appendChild(U.el('i')); right.appendChild(meter);
    row.appendChild(left); row.appendChild(right);
    row.addEventListener('click', onRow);
    shop.insertBefore(row, after);
  }

  function onRow(e) {
    var s = GW.game.s;
    if (!s.mega.owned) {
      var ok = reqs(s).every(function (r) { return r.ok; });
      if (!ok || s.cogs < M.cost) { GW.sfx.nope(); return; }
      s.cogs -= M.cost; s.mega.owned = true; s.mega.food = 0;
      GW.sfx.buy(); GW.ui.toast('The Megagnome has joined the crew!  Go hunting to feed him.', 'super');
      GW.ui.updateCrew(s); GW.ui.rebuildFloor();
      return;
    }
    if (!e.isTrusted) return;
    if (s.mega.food >= M.maxFood) { GW.ui.toast('He is stuffed.  Save the hunt for when he is hungry.', ''); return; }
    if (huntReadyIn(s) > 0) { GW.sfx.nope(); return; }
    GW.hunt.open();
  }

  function update(s) {
    if (!row) return;
    var cost = row.querySelector('.shop-cost'), own = row.querySelector('.shop-owned'), desc = row.querySelector('.mega-desc');
    var fill = row.querySelector('.shop-meter i'), badge = row.querySelector('.food-badge');
    var m = s.mega;
    badge.hidden = !m.owned;
    badge.textContent = '🍖' + m.food;
    row.classList.remove('cant', 'ready', 'done');
    if (!m.owned) {
      var rq = reqs(s), allOk = rq.every(function (r) { return r.ok; });
      var html = 'Eats escaped clones and wild magic for you.<br>' + rq.map(function (r) {
        return '<span class="req ' + (r.ok ? 'ok' : 'no') + '">' + (r.ok ? '✔' : '✘') + ' ' + r.label + '</span>';
      }).join(' ');
      if (allOk && s.cogs < M.cost) {
        var cps = E.rates(s).total;
        html += '<br><span class="req">' + (cps > 0 ? 'Ready in about ' + U.fmtTime((M.cost - s.cogs) / cps) : 'Need more gnomes') + '</span>';
      }
      if (desc.innerHTML !== html) desc.innerHTML = html;
      cost.textContent = C.currency.icon + ' ' + U.fmt(M.cost);
      own.textContent = '';
      var can = allOk && s.cogs >= M.cost;
      row.classList.add(can ? 'ready' : 'cant');
      fill.style.width = Math.min(100, s.cogs / M.cost * 100).toFixed(1) + '%';
      return;
    }
    var wait = huntReadyIn(s), full = m.food >= M.maxFood;
    var d = 'Food ' + m.food + ' of ' + M.maxFood + '.  He spends it on events by himself.' + (hintsOn() && !full && wait <= 0 ? '  Tap here to go hunting.' : '');
    if (desc.textContent !== d) desc.textContent = d;
    cost.textContent = full ? 'Stuffed' : wait > 0 ? 'Hunt in ' + U.fmtTime(wait) : '🏹 Go hunting!';
    own.textContent = 'Owned';
    row.classList.add(!full && wait <= 0 ? 'ready' : 'cant');
    fill.style.width = full ? '100%' : (100 - Math.min(100, wait / M.huntCooldownSeconds * 100)).toFixed(1) + '%';
  }

  // ---------- poses on the Shop Floor ----------
  function poseImg() { return document.querySelector('#floor .part-mega .f-static'); }
  function pose(name) {
    var im = poseImg(); if (im) im.src = 'assets/mega/mega_' + name + '.webp';
  }
  // Chomp, then burp, then back to idle.
  function chomp(quiet) {
    clearTimeout(poseTimer);
    pose('eat'); if (!quiet) GW.sfx.yum();
    var w = document.querySelector('#floor .part-mega');
    if (w) w.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.06, .95)' }, { transform: 'scale(1)' }], { duration: 500 });
    poseTimer = setTimeout(function () {
      pose('burp'); if (!quiet) GW.sfx.burp();
      poseTimer = setTimeout(function () { pose('idle'); }, 900);
    }, 900);
  }
  // Where he stands, in % of the floor (for things flying into his mouth).
  function mouth() {
    var w = document.querySelector('#floor .part-mega'), f = document.getElementById('floor');
    if (!w || !f) return null;
    var r = w.getBoundingClientRect(), fr = f.getBoundingClientRect();
    return { x: (r.left + r.width * 0.55 - fr.left) / fr.width * 100, y: (r.top + r.height * 0.3 - fr.top) / fr.height * 100 };
  }

  // Spend one food.  Returns false if he has none.
  function spend(what) {
    if (!canHelp()) return false;
    var s = GW.game.s;
    s.mega.food -= 1; s.mega.eaten += 1;
    s.stats.megaHelps = (s.stats.megaHelps || 0) + 1;
    GW.ui.updateCrew(s);
    return true;
  }
  function feed(n) {
    var s = GW.game.s;
    s.mega.food = Math.min(M.maxFood, s.mega.food + n);
    GW.ui.updateCrew(s);
  }

  return { buildRow: buildRow, update: update, owned: owned, canHelp: canHelp, spend: spend, feed: feed,
    chomp: chomp, mouth: mouth, huntReadyIn: huntReadyIn };
})();
