/* Everything the player sees outside the gears: shop, shelf, stats, crew, effects. */
window.GW = window.GW || {};

GW.ui = (function () {
  var C = GW.CONFIG, U = GW.util, E = GW.econ;
  var fmt = U.fmt, el = U.el, $ = U.$, $all = U.$all;
  var shopRows = [];   // { kind, def, row, costEl, ownedEl }
  var onBuy = null;

  // ---------- hats ----------
  function currentHat() {
    var q = /[?&]hat=([a-z_]+)/.exec(window.location.search);
    if (q) {
      var all = [C.hats.default].concat(Object.keys(C.hats.byMonth).map(function (k) { return C.hats.byMonth[k]; }));
      var found = all.filter(function (h) { return h.id === q[1]; })[0];
      if (found) return found;
    }
    return C.hats.byMonth[new Date().getMonth() + 1] || C.hats.default;
  }

  // Placeholder gnome drawn in SVG.  Real art replaces this later.
  function gnomeSVG(kind, hat) {
    var weapon = '';
    if (kind === 'warrior') {
      var w = E.weapon(GW.game.s);
      var icon = { 3: '🗡️', 4: '⚔️', 5: '🔨', 6: '🪄', 7: '🔱', 8: '🧙' }[w.value] || '🗡️';
      weapon = '<text x="46" y="44" font-size="22" class="weapon">' + icon + '</text>';
    }
    var trim = hat.trim ? '<text x="22" y="16" font-size="11" text-anchor="middle">' + hat.trim + '</text>' : '';
    return '<svg viewBox="0 0 64 72" class="gnome-svg" aria-hidden="true">' +
      '<ellipse cx="32" cy="68" rx="16" ry="3" fill="#000" opacity=".35"/>' +
      '<rect x="18" y="44" width="28" height="22" rx="9" fill="' + (kind === 'warrior' ? '#5b6b7a' : '#2f6b3a') + '"/>' +
      '<circle cx="32" cy="38" r="11" fill="#f2c9a0"/>' +
      '<path d="M21 40 Q32 64 43 40 Q32 48 21 40Z" fill="#eee"/>' +
      '<circle cx="32" cy="41" r="3" fill="#e08a7a"/>' +
      '<circle cx="28" cy="35" r="1.5" fill="#222"/><circle cx="36" cy="35" r="1.5" fill="#222"/>' +
      '<path d="M19 31 L32 2 L45 31 Z" fill="' + hat.color + '" stroke="rgba(0,0,0,.35)" stroke-width="1"/>' +
      '<rect x="18" y="29" width="28" height="4" rx="2" fill="rgba(255,255,255,.35)"/>' +
      trim + weapon + '</svg>';
  }

  // ---------- items ----------
  function emojiFile(e) {
    var cps = Array.from(e).map(function (c) { return c.codePointAt(0).toString(16); });
    if (cps.indexOf('200d') < 0) cps = cps.filter(function (c) { return c !== 'fe0f'; });
    return 'assets/emoji/' + cps.join('-') + '.svg';
  }

  function itemIcon(item, big) {
    var wrap = el('span', 'item-icon' + (big ? ' big' : '') + (item.tint ? ' tint-' + item.tint : ''));
    var src = item.img || (item.emoji ? emojiFile(item.emoji) : null);
    if (src) {
      var img = el('img'); img.src = src; img.alt = item.name; img.draggable = false;
      img.onerror = function () { wrap.textContent = item.emoji || '?'; }; // fall back to the device emoji
      wrap.appendChild(img);
    } else {
      wrap.textContent = item.emoji || '?';
    }
    return wrap;
  }

  // ---------- shop ----------
  function buildShop(container) {
    container.innerHTML = '';
    var sections = [
      { title: 'Gnomes', kind: 'producer', list: C.producers },
      { title: 'Upgrades', kind: 'leveled', list: C.leveled },
      { title: 'Inventions & Weapons', kind: 'oneTime', list: C.oneTime }
    ];
    sections.forEach(function (sec) {
      var h = el('h3', 'shop-head', sec.title);
      container.appendChild(h);
      sec.list.forEach(function (def) {
        var row = el('button', 'shop-row');
        row.type = 'button';
        var left = el('div', 'shop-left');
        left.appendChild(el('div', 'shop-name', def.name));
        left.appendChild(el('div', 'shop-desc', def.desc));
        var right = el('div', 'shop-right');
        var costEl = el('div', 'shop-cost');
        var ownedEl = el('div', 'shop-owned');
        right.appendChild(costEl); right.appendChild(ownedEl);
        row.appendChild(left); row.appendChild(right);
        row.addEventListener('click', function () { if (onBuy) onBuy(sec.kind, def.id); });
        container.appendChild(row);
        shopRows.push({ kind: sec.kind, def: def, row: row, costEl: costEl, ownedEl: ownedEl, head: h });
      });
    });
  }

  function updateShop(s) {
    var headsVisible = {};
    shopRows.forEach(function (r) {
      var vis = E.isVisible(s, r.kind, r.def), cost, owned = '', done = false;
      if (r.kind === 'producer') { cost = E.producerCost(s, r.def.id); owned = 'Owned ' + s.producers[r.def.id]; }
      else if (r.kind === 'leveled') {
        done = s.leveled[r.def.id] >= r.def.maxLevel;
        cost = E.leveledCost(s, r.def.id); owned = 'Lv ' + s.leveled[r.def.id] + (done ? ' (max)' : '');
      } else { done = !!s.oneTime[r.def.id]; cost = r.def.cost; owned = done ? 'Owned' : ''; }
      if (r.kind === 'oneTime' && done) vis = false; // owned inventions leave the shop
      r.row.hidden = !vis;
      if (vis) headsVisible[r.head.textContent] = r.head;
      r.costEl.textContent = done ? '✔' : C.currency.icon + ' ' + fmt(cost);
      r.ownedEl.textContent = owned;
      r.row.classList.toggle('done', done);
      r.row.classList.toggle('cant', !done && s.cogs < cost);
      r.row.disabled = done;
    });
    $all('.shop-head').forEach(function (h) { h.hidden = !headsVisible[h.textContent]; });
  }

  // ---------- shelf ----------
  // Built once, then updated in place so open groups stay open while items roll in.
  var shelves = [];          // one per [data-shelf] container
  var openGroups = {};       // group id -> true, shared by both shelves
  var tierOrder = ['legendary', 'superrare', 'rare', 'uncommon', 'common'];

  function groupItems(gid) {
    var list = C.items.filter(function (i) { return i.group === gid; });
    var g = C.groups.filter(function (x) { return x.id === gid; })[0];
    if (g && g.layout === 'families') return list; // config order
    return list.sort(function (a, b) { return tierOrder.indexOf(a.tier) - tierOrder.indexOf(b.tier); });
  }

  function makeShelf(box) {
    box.innerHTML = '';
    var sh = { box: box, groups: {}, tiles: {}, foot: null };
    C.groups.forEach(function (g) {
      var items = groupItems(g.id);
      if (!items.length) return;
      var det = el('details', 'shelf-group');
      det.dataset.group = g.id;
      var sum = el('summary', 'shelf-sum');
      var name = el('span', 'shelf-gname', g.name);
      var newPill = el('span', 'new-pill', 'NEW');
      var count = el('span', 'shelf-gcount');
      sum.appendChild(name); sum.appendChild(newPill); sum.appendChild(count);
      det.appendChild(sum);
      var grid = el('div', 'shelf-grid' + (g.layout === 'families' ? ' families' : ''));
      var slots = items;
      if (g.layout === 'families') {
        // One row per family, one column per variant.  Missing variants leave a gap.
        slots = [];
        var famOrder = [];
        items.forEach(function (i) { if (famOrder.indexOf(i.family) < 0) famOrder.push(i.family); });
        famOrder.forEach(function (f) {
          g.variants.forEach(function (v) {
            slots.push(items.filter(function (i) { return i.family === f && i.variant === v; })[0] || null);
          });
        });
      }
      slots.forEach(function (item) {
        if (!item) { grid.appendChild(el('div', 'shelf-gap')); return; }
        var tile = el('div', 'shelf-tile unknown');
        tile.dataset.item = item.id;
        tile.style.borderColor = C.tiers[item.tier].color;
        tile.title = '???';
        var icon = el('span', 'item-icon', '?');
        var nm = el('div', 'tile-name', '???');
        var ct = el('div', 'tile-count');
        var badge = el('span', 'tile-new', 'NEW');
        tile.appendChild(badge); tile.appendChild(icon); tile.appendChild(nm); tile.appendChild(ct);
        grid.appendChild(tile);
        sh.tiles[item.id] = { tile: tile, icon: icon, name: nm, count: ct, known: false, item: item };
      });
      det.appendChild(grid);
      det.addEventListener('toggle', function () {
        openGroups[g.id] = det.open;
        shelves.forEach(function (o) { var d = o.groups[g.id]; if (d && d.det !== det && d.det.open !== det.open) d.det.open = det.open; });
        if (det.open) setTimeout(function () { markSeen(g.id); }, 2500);
      });
      box.appendChild(det);
      sh.groups[g.id] = { det: det, count: count, newPill: newPill, items: items };
    });
    sh.foot = el('div', 'shelf-foot');
    box.appendChild(sh.foot);
    return sh;
  }

  function markSeen(gid) {
    var s = GW.game.s, changed = false;
    groupItems(gid).forEach(function (i) { if (s.items[i.id] && !s.seen[i.id]) { s.seen[i.id] = true; changed = true; } });
    if (changed) updateShelf(s);
  }

  function updateShelf(s) {
    s.seen = s.seen || {};
    shelves.forEach(function (sh) {
      var found = 0;
      Object.keys(sh.groups).forEach(function (gid) {
        var g = sh.groups[gid], have = 0, fresh = false;
        g.items.forEach(function (item) {
          var n = s.items[item.id] || 0, t = sh.tiles[item.id];
          if (n) {
            have++;
            if (!t.known) {
              t.known = true;
              t.tile.classList.remove('unknown');
              t.tile.title = item.name + ' (' + C.tiers[item.tier].label + ')';
              var ic = itemIcon(item); t.tile.replaceChild(ic, t.icon); t.icon = ic;
              t.name.textContent = item.name;
            }
            t.count.textContent = '\u00D7' + fmt(n);
            var isNew = !s.seen[item.id];
            t.tile.classList.toggle('is-new', isNew);
            if (isNew) fresh = true;
          }
        });
        found += have;
        g.count.textContent = have + ' / ' + g.items.length;
        g.newPill.hidden = !fresh;
        g.det.classList.toggle('complete', have === g.items.length);
        if (openGroups[gid] !== undefined && g.det.open !== openGroups[gid]) g.det.open = openGroups[gid];
      });
      sh.foot.textContent = 'Found ' + found + ' of ' + C.items.length;
    });
  }

  function buildShelf(s) {
    if (!shelves.length) shelves = $all('[data-shelf]').map(makeShelf);
    updateShelf(s);
  }

  function flashShelf(itemId) {
    $all('[data-item="' + itemId + '"]').forEach(function (t) {
      t.classList.remove('flash'); void t.offsetWidth; t.classList.add('flash');
    });
  }

  // ---------- stats ----------
  function updateStats(s) {
    var box = $('#stats');
    if (!box || box.closest('[hidden]')) return;
    var r = E.rates(s), w = E.weapon(s);
    var totalClicks = 0;
    GW.state.SOURCES.forEach(function (k) { totalClicks += s.clicks[k] || 0; });
    var supers = C.items.filter(function (i) { return i.tier === 'superrare' || i.tier === 'legendary'; })
      .reduce(function (a, i) { return a + (s.items[i.id] || 0); }, 0);
    var rows = [
      ['Clicks by who clicked it', null],
      ['You (' + fmt(s.stats.taps) + ' taps)', s.clicks.tap],
      ['Tiny Gnomes', s.clicks.tiny],
      ['Tinier Gnomes', s.clicks.tinier],
      ['Warrior Gnomes', s.clicks.warrior],
      ['Gnome on a Stick', s.clicks.stick],
      ['Total clicks', totalClicks],
      ['The machine', null],
      ['Items made', s.itemsMade],
      ['Clicks per item', E.clicksPerItem(s)],
      ['Super rares and legendaries', supers],
      ['Lucky Sprockets', s.stats.sprockets],
      ['Cogs', null],
      ['Lifetime cogs', s.cogsSeen],
      ['From items', s.bonusCogs.items],
      ['From Lucky Sprockets', s.bonusCogs.sprockets],
      ['Gnome clicks per second', r.total],
      ['Best per second', s.stats.bestCps],
      ['Your tap hits for', E.tapValue(s)],
      ['Warrior weapon', w.name + ' (' + w.value + (w.stick ? ' +1' : '') + ')'],
      ['Time played', U.fmtTime(s.stats.playSeconds)]
    ];
    var html = '<table class="stats-table">';
    rows.forEach(function (row) {
      if (row[1] === null) { html += '<tr class="stats-sec"><th colspan="2">' + row[0] + '</th></tr>'; return; }
      var v = typeof row[1] === 'number' ? fmt(row[1]) : row[1];
      html += '<tr><td>' + row[0] + '</td><td>' + v + '</td></tr>';
    });
    box.innerHTML = html + '</table>';
  }

  // ---------- crew (gnomes shown under the machine) ----------
  var crewSig = '';
  function updateCrew(s) {
    var hat = currentHat();
    var w = E.weapon(s).value;
    var sig = [s.producers.tiny, s.producers.tinier, s.producers.warrior, w, hat.id].join('|');
    if (sig === crewSig) return;
    crewSig = sig;
    var box = $('#crew');
    box.innerHTML = '';
    [['tiny', 'Tiny', 10], ['tinier', 'Tinier', 10], ['warrior', 'Warrior', 6]].forEach(function (k) {
      var n = s.producers[k[0]];
      if (!n) return;
      var group = el('div', 'crew-group crew-' + k[0]);
      var shown = Math.min(n, k[2]);
      for (var i = 0; i < shown; i++) {
        var g = el('span', 'crew-gnome');
        g.innerHTML = gnomeSVG(k[0], hat);
        g.style.animationDelay = (-Math.random() * 1.2).toFixed(2) + 's';
        group.appendChild(g);
      }
      group.appendChild(el('span', 'crew-count', k[1] + ' ×' + fmt(n)));
      box.appendChild(group);
    });
    if (!box.children.length) box.appendChild(el('div', 'crew-empty', 'No gnomes yet.  Tap the little gear!'));
  }

  // ---------- effects ----------
  var fx;
  function floatText(xPct, yPct, text, cls) {
    var t = el('div', 'float-text ' + (cls || ''), text);
    t.style.left = (xPct + U.rand(-4, 4)) + '%';
    t.style.top = (yPct + U.rand(-3, 3)) + '%';
    fx.appendChild(t);
    setTimeout(function () { t.remove(); }, 1000);
  }

  function popItem(item) {
    var m = GW.gears.hatchMouth();
    var p = el('div', 'pop-item tier-' + item.tier);
    p.appendChild(itemIcon(item, true));
    p.style.left = m.x + '%'; p.style.top = m.y + '%';
    p.style.setProperty('--dx', U.rand(-160, -40).toFixed(0) + 'px');
    p.style.setProperty('--rot', U.rand(-200, 200).toFixed(0) + 'deg');
    fx.appendChild(p);
    GW.gears.openFlap();
    setTimeout(function () { p.remove(); }, 1300);
    flashShelf(item.id);
  }

  var toastTimer;
  function toast(msg, cls) {
    var t = $('#toast');
    t.textContent = msg;
    t.className = 'show ' + (cls || '');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.className = ''; }, 3500);
  }

  // ---------- header ----------
  function updateHeader(s) {
    $('#cogs').textContent = fmt(s.cogs);
    $('#cps').textContent = fmt(E.rates(s).total);
    $('#nextBar').style.width = (s.bigAngle / 360 * 100).toFixed(1) + '%';
    $('#itemsMade').textContent = fmt(s.itemsMade);
  }

  // ---------- tabs ----------
  function initTabs() {
    $all('.tabs button').forEach(function (b) {
      b.addEventListener('click', function () {
        $all('.tabs button').forEach(function (x) { x.classList.toggle('active', x === b); });
        $all('[data-tabpanel]').forEach(function (p) { p.hidden = p.dataset.tabpanel !== b.dataset.tab; });
        if (b.dataset.tab === 'stats') updateStats(GW.game.s);
      });
    });
  }

  function init(s, buyHandler) {
    onBuy = buyHandler;
    fx = $('#fx');
    $all('[data-version]').forEach(function (e) { e.textContent = 'v' + GW.VERSION; });
    var b = C.branding || {}, made = $('#madeFor');
    if (made && b.shopName) {
      made.textContent = ' \u00B7 made for ';
      if (b.logo) { var lg = el('img', 'shop-logo'); lg.src = b.logo; lg.alt = b.shopName; made.appendChild(lg); }
      else made.appendChild(document.createTextNode(b.shopName));
    }
    buildShop($('#shop'));
    buildShelf(s);
    initTabs();
    updateShop(s); updateCrew(s); updateHeader(s);
    var hat = currentHat();
    $('#hatNote').textContent = 'This month the gnomes are wearing: ' + hat.name + '.';
  }

  return {
    init: init, updateShop: updateShop, updateStats: updateStats, updateCrew: updateCrew, updateHeader: updateHeader,
    buildShelf: buildShelf, flashItem: flashShelf, floatText: floatText, popItem: popItem, toast: toast, itemIcon: itemIcon
  };
})();
