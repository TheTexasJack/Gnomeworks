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
        if (def.icon) {
          var ic = el('img', 'shop-icon'); ic.src = 'assets/icons/' + def.icon + '.webp'; ic.alt = ''; ic.draggable = false;
          row.appendChild(ic);
        }
        var left = el('div', 'shop-left');
        left.appendChild(el('div', 'shop-name', def.name));
        left.appendChild(el('div', 'shop-desc', def.desc));
        var right = el('div', 'shop-right');
        var costEl = el('div', 'shop-cost');
        var ownedEl = el('div', 'shop-owned');
        var meter = el('div', 'shop-meter'); var fill = el('i'); meter.appendChild(fill);
        right.appendChild(costEl); right.appendChild(ownedEl); right.appendChild(meter);
        row.appendChild(left); row.appendChild(right);
        row.addEventListener('click', function () { if (onBuy) onBuy(sec.kind, def.id); });
        container.appendChild(row);
        shopRows.push({ kind: sec.kind, def: def, row: row, costEl: costEl, ownedEl: ownedEl, head: h, fill: fill });
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
      var cant = !done && s.cogs < cost;
      r.row.classList.toggle('cant', cant);
      r.row.classList.toggle('ready', !done && !cant);
      r.fill.style.width = (done ? 100 : Math.min(100, s.cogs / cost * 100)).toFixed(1) + '%';
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
      ['Skeleton Crew (Necromancers)', s.clicks.tinier],
      ['Warrior Gnomes', s.clicks.warrior],
      ['Gnome on a Stick', s.clicks.stick],
      ['Gnome Cloners', s.clicks.cloner || 0],
      ['Matryoshka Gnomes', s.clicks.matryoshka || 0],
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

  // ---------- crew strip under the machine + the Shop Floor ----------
  var F = C.floor;
  function crewImg(name) { return 'assets/crew/' + name + '.webp'; }

  // Which picture a station part shows right now (upgrades and count stages can swap it).
  function partImg(s, pid, part) {
    var img = part.img, h = part.h;
    if (part.upgrade) Object.keys(part.upgrade).forEach(function (u) { if (s.oneTime[u]) img = part.upgrade[u]; });
    if (part.stages) {
      for (var i = 0; i < part.stages.length; i++) {
        if ((s.producers[pid] || 0) >= part.stages[i][0]) { img = part.stages[i][1]; h = part.stages[i][2] || h; break; }
      }
    }
    return { img: img, h: h };
  }

  function stationSig(s) {
    return E.weapon(s).value + '#' + Object.keys(F.stations).map(function (pid) {
      return pid + ':' + (s.producers[pid] || 0) + ':' + F.stations[pid].parts.map(function (p) { return partImg(s, pid, p).img; }).join(',');
    }).join('|');
  }

  var crewSig = '', floorSig = '', floorBuilt = false, slotEls = [];
  function updateCrew(s) {
    var sig = stationSig(s);
    if (sig === crewSig) return;
    crewSig = sig;
    var box = $('#crew');
    box.innerHTML = '';
    C.producers.forEach(function (p) {
      var n = s.producers[p.id], st = F.stations[p.id];
      if (!n || !st) return;
      var group = el('div', 'crew-group crew-' + p.id);
      var im = el('img', 'crew-thumb'); im.alt = p.name;
      im.src = p.icon ? 'assets/icons/' + p.icon + '.webp' : crewImg(partImg(s, p.id, st.parts[0]).img);
      group.appendChild(im);
      group.title = p.name + ' \u00D7' + fmt(n);
      var cnt = el('span', 'crew-count');
      cnt.appendChild(el('span', 'crew-name', p.name + ' '));
      cnt.appendChild(document.createTextNode('\u00D7' + fmt(n)));
      group.appendChild(cnt);
      box.appendChild(group);
    });
    if (!box.children.length) box.appendChild(el('div', 'crew-empty', 'No gnomes yet.  Tap the little gear!'));
    updateFloor(s);
  }

  var tallQuery = window.matchMedia('(max-width: 720px)');
  function layout() { return F.layouts[tallQuery.matches ? 'tall' : 'wide']; }

  function buildFloor() {
    var floor = $('#floor');
    floor.innerHTML = '';
    slotEls = [];
    var L = layout();
    floor.style.backgroundImage = "url('" + L.bg + "')";
    $('#machine').style.setProperty('--floor-aspect', L.aspect);
    var belt = el('div', 'belt');
    belt.style.left = L.belt.left + '%'; belt.style.width = L.belt.width + '%';
    belt.style.top = L.belt.top + '%'; belt.style.height = L.belt.height + '%';
    floor.appendChild(belt);
    floor.style.setProperty('--ride-top', L.belt.ride + '%');
    floor.style.setProperty('--ride-from', L.belt.left + '%');
    floor.style.setProperty('--ride-to', (L.belt.left + L.belt.width) + '%');
    L.slots.forEach(function (xy) {
      var st = el('div', 'station'); st.style.left = xy[0] + '%'; st.style.bottom = (100 - xy[1]) + '%';
      var plate = el('div', 'plate', '???'); plate.style.left = xy[0] + '%'; plate.style.top = (xy[1] + L.plateDrop) + '%';
      plate.style.width = L.plateW + 'cqw'; plate.style.fontSize = L.plateFont + 'cqw';
      floor.appendChild(st); floor.appendChild(plate);
      slotEls.push({ st: st, plate: plate });
    });
    floor.appendChild(el('div', 'belt-items'));
    floorBuilt = true;
    floorSig = '';
  }
  tallQuery.addEventListener('change', function () { buildFloor(); updateFloor(GW.game.s); });

  function updateFloor(s) {
    if (!floorBuilt) buildFloor();
    var sig = stationSig(s);
    if (sig === floorSig) return;
    floorSig = sig;
    var used = {};
    Object.keys(F.stations).forEach(function (pid) {
      var cfg = F.stations[pid], slot = slotEls[cfg.slot], n = s.producers[pid] || 0;
      used[cfg.slot] = true;
      slot.st.innerHTML = '';
      delete anims[pid];
      if (!n) { helpWanted(slot); return; }
      slot.st.className = 'station';
      var parts = [];
      cfg.parts.forEach(function (part) {
        var pi = partImg(s, pid, part);
        var wrap = el('span', 'part');
        wrap.style.height = (pi.h * layout().scale) + 'cqh';
        if (part.z) wrap.style.zIndex = part.z;
        if (part.anim === 'spin') wrap.classList.add('part-spin');
        if (part.cls) wrap.classList.add(part.cls);
        if (part.overlap) wrap.style.marginRight = -(part.overlap * (layout().scale < 1 ? 0.9 : 1)) + 'cqw';
        var im = el('img', 'f-static'); im.src = crewImg(pi.img); im.alt = ''; im.draggable = false;
        wrap.appendChild(im);
        var act = actionFor(pi.img);
        if (act) {
          var ai = el('img', 'f-action'); ai.src = crewImg(act); ai.alt = ''; ai.draggable = false;
          if (part.actionDx) ai.style.transform = 'translateX(' + part.actionDx + '%)';
          wrap.appendChild(ai);
        }
        addHat(wrap, pi.img, act, part.actionDx || 0);
        if (part.weapon) addWeapon(wrap, s);
        if (part.fx) {
          var fxi = el('img', 'f-swirl'); fxi.src = crewImg(part.fx); fxi.alt = ''; fxi.draggable = false;
          wrap.insertBefore(fxi, wrap.firstChild);
        }
        if (part.anim === 'hit') {
          var sl = el('img', 'f-slash'); sl.src = crewImg('slash'); sl.alt = ''; sl.draggable = false;
          wrap.appendChild(sl);
        }
        slot.st.appendChild(wrap);
        parts.push({ el: wrap, anim: part.anim || 'boing', hasAction: !!act });
      });
      anims[pid] = { parts: parts, next: performance.now() + Math.random() * 800 };
      slot.plate.textContent = cfg.label + ' \u00D7' + fmt(n);
      slot.plate.classList.remove('locked');
    });
    slotEls.forEach(function (slot, i) { if (!used[i]) helpWanted(slot); });
  }

  function actionFor(img) {
    if (/_static$/.test(img)) return img.replace(/_static$/, '_action');
    return { matry_closed: 'matry_open' }[img] || null;
  }

  function addHat(wrap, img, act, dx) {
    var spots = C.hats.spots, sp = spots[img];
    if (!sp) return;
    var sa = (act && spots[act]) || sp;
    var hat = currentHat();
    var im = el('img', 'f-hat'); im.src = 'assets/hats/hat_' + hat.id + '.webp'; im.alt = ''; im.draggable = false;
    im.style.setProperty('--hx', sp[0] + '%'); im.style.setProperty('--hy', sp[1] + '%'); im.style.setProperty('--hw', sp[2] + '%');
    im.style.setProperty('--hxa', (sa[0] + dx) + '%'); im.style.setProperty('--hya', sa[1] + '%'); im.style.setProperty('--hwa', sa[2] + '%');
    wrap.appendChild(im);
  }

  function addWeapon(wrap, s) {
    var W = F.weapons, w = W.byValue[E.weapon(s).value];
    if (!w) return;
    var im = el('img', 'f-weapon'); im.src = crewImg(w.img); im.alt = ''; im.draggable = false;
    // Width as a share of the warrior picture's width (picture is 486 x 560).
    im.style.width = (w.len * 560 / 486 * 100) + '%';
    im.style.setProperty('--grip', W.grip + '%');
    im.style.setProperty('--fx', W.fist[0] + '%'); im.style.setProperty('--fy', W.fist[1] + '%');
    im.style.setProperty('--fxa', W.fistAct[0] + '%'); im.style.setProperty('--fya', W.fistAct[1] + '%');
    im.style.setProperty('--rot', W.rot + 'deg'); im.style.setProperty('--rota', W.rotAct + 'deg');
    wrap.appendChild(im);
  }

  // ---------- squish and boing ----------
  var anims = {};
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  function animateFloor(now, s) {
    if (s.view !== 'floor' || s.paused) return;
    var calm = reduceMotion.matches;   // device asks for less motion: frame swaps only, slower, no squash
    var r = E.rates(s), A = F.anim;
    Object.keys(anims).forEach(function (pid) {
      var a = anims[pid];
      if (!a.parts.length || now < a.next) return;
      var rate = pid === 'warrior' ? (s.producers.warrior || 0) * E.producerDef('warrior').swipesPerSec : (r[pid] || 0);
      var period = Math.max(A.fastest, Math.min(A.slowest, A.slowest / (1 + Math.log10(1 + rate))));
      if (calm) period = Math.max(period, 1.4);
      a.next = now + period * 1000 * (0.85 + Math.random() * 0.3);
      var d = Math.min(A.boing, period * 0.85) * 1000;
      a.parts.forEach(function (p) { playPart(p, d, calm); });
      setTimeout(function () { GW.sfx.chatter(pid); }, d * 0.36);
    });
  }

  function playPart(p, d, calm) {
    var e = p.el;
    if (p.anim === 'none') return;
    if (calm) {
      // Gentle version: swap to the action pose and back, nothing moves or shakes.
      if (p.hasAction || p.anim === 'hit' || e.querySelector('.f-weapon')) {
        setTimeout(function () { e.classList.add('act'); }, d * 0.36);
        setTimeout(function () { e.classList.remove('act'); }, d * 1.6);
      }
      return;
    }
    if (p.anim === 'spin') {
      // Wizard: flips to the upside-down pose and spins in place, swirl flaring behind him.
      var turns = d > 450 ? 1 : 2;
      setTimeout(function () {
        e.classList.add('act', 'spinning');
        e.animate([{ transform: 'rotate(0deg) scale(1)' }, { transform: 'rotate(' + (180 * turns) + 'deg) scale(.92)' }, { transform: 'rotate(' + (360 * turns) + 'deg) scale(1)' }],
          { duration: d * 1.1, easing: 'ease-in-out' });
        setTimeout(function () { e.classList.remove('act', 'spinning'); }, d * 1.1);
      }, d * 0.2);
      return;
    }
    if (p.anim === 'hit') {
      setTimeout(function () {
        e.classList.add('act');
        e.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(7deg)' }, { transform: 'rotate(-4deg)' }, { transform: 'rotate(0)' }],
          { duration: d * 0.9, easing: 'ease-out' });
        setTimeout(function () { e.classList.remove('act'); }, d * 0.6);
      }, d * 0.38);
      return;
    }
    e.animate([
      { transform: 'scale(1, 1)' },
      { transform: 'scale(1.12, 0.86)', offset: 0.3 },
      { transform: 'scale(0.92, 1.12)', offset: 0.45 },
      { transform: 'scale(1.04, 0.97)', offset: 0.7 },
      { transform: 'scale(1, 1)' }
    ], { duration: d, easing: 'ease-in-out' });
    if (p.hasAction || e.querySelector('.f-weapon')) {
      setTimeout(function () { e.classList.add('act'); }, d * 0.36);
      setTimeout(function () { e.classList.remove('act'); }, d * 1.05);
    }
  }

  function helpWanted(slot) {
    slot.st.className = 'station hiring';
    slot.st.innerHTML = '';
    var im = el('img'); im.src = crewImg('help_wanted'); im.alt = 'Help wanted'; im.draggable = false; im.style.height = (15 * layout().scale) + 'cqh';
    slot.st.appendChild(im);
    slot.plate.textContent = '???';
    slot.plate.classList.add('locked');
  }

  function beltItem(item) {
    var box = $('#floor .belt-items');
    if (!box) return;
    var p = el('div', 'belt-item tier-' + item.tier);
    p.appendChild(itemIcon(item));
    box.appendChild(p);
    setTimeout(function () { p.remove(); }, 6200);
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
    flashShelf(item.id);
    if (GW.game.s.view === 'floor') { beltItem(item); return; }
    var m = GW.gears.hatchMouth();
    var p = el('div', 'pop-item tier-' + item.tier);
    p.appendChild(itemIcon(item, true));
    p.style.left = m.x + '%'; p.style.top = m.y + '%';
    p.style.setProperty('--dx', U.rand(-160, -40).toFixed(0) + 'px');
    p.style.setProperty('--rot', U.rand(-200, 200).toFixed(0) + 'deg');
    fx.appendChild(p);
    GW.gears.openFlap();
    setTimeout(function () { p.remove(); }, 1300);
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
    $('#nextBar').style.setProperty('--p', (s.bigAngle / 360 * 100).toFixed(1) + '%');
    $('#itemsMade').textContent = fmt(s.itemsMade);
  }

  // ---------- tabs ----------
  function initTabs() {
    $all('.tabs button').forEach(function (b) {
      b.addEventListener('click', function () {
        $all('.tabs button').forEach(function (x) { x.classList.toggle('active', x === b); });
        $all('[data-tabpanel]').forEach(function (p) { p.hidden = p.dataset.tabpanel !== b.dataset.tab; });
        if (b.dataset.tab === 'stats') updateStats(GW.game.s);
        GW.sfx.click();
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
    var mn = $('#motionNote');
    if (mn) {
      var sync = function () { mn.textContent = reduceMotion.matches ? 'Your device is set to reduce motion, so the Shop Floor gnomes switch poses gently instead of bouncing.' : ''; };
      sync(); if (reduceMotion.addEventListener) reduceMotion.addEventListener('change', sync);
    }
    var hn = $('#hatNote');
    if (hn) hn.textContent = 'This month the gnomes are wearing: ' + currentHat().name + '.';
  }

  return {
    init: init, updateShop: updateShop, updateFloor: updateFloor, animateFloor: animateFloor, updateStats: updateStats, updateCrew: updateCrew, updateHeader: updateHeader,
    floorLayout: layout,
    buildShelf: buildShelf, flashItem: flashShelf, floatText: floatText, popItem: popItem, toast: toast, itemIcon: itemIcon
  };
})();
