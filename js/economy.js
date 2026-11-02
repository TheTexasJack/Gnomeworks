/* The math: rates, taps, gear turns, item drops, purchases, popups, offline progress.
   No DOM in here.  Anything visual is reported back through an "events" object. */
window.GW = window.GW || {};

GW.econ = (function () {
  var C = GW.CONFIG, U = GW.util;

  function byId(list, id) { for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return null; }
  var producerDef = function (id) { return byId(C.producers, id); };
  var leveledDef = function (id) { return byId(C.leveled, id); };
  var oneTimeDef = function (id) { return byId(C.oneTime, id); };
  var itemDef = function (id) { return byId(C.items, id); };

  function clicksPerItem(s) {
    return Math.max(C.machine.minClicksPerItem, C.machine.baseClicksPerItem * Math.pow(0.85, s.leveled.ratio || 0));
  }
  function globalMult(s) { return 1 + 0.25 * (s.leveled.faster || 0); }
  function pokerMult(s) { return 1 + 0.10 * (s.leveled.poker || 0); }

  function tinyEach(s) {
    var m = 1;
    ['two_hands', 'inv_mitts', 'inv_elbows', 'inv_steam'].forEach(function (id) { if (s.oneTime[id]) m *= 2; });
    return producerDef('tiny').rate * m;
  }

  function weapon(s) {
    var best = { value: C.warrior.baseWeapon, name: C.warrior.baseWeaponName, stick: false };
    C.oneTime.forEach(function (u) {
      if (u.weapon && s.oneTime[u.id] && u.weapon > best.value) best = { value: u.weapon, name: u.name, stick: !!u.stick };
    });
    return best;
  }

  // Clicks per second from every automatic source.
  function rates(s) {
    var g = globalMult(s) * pokerMult(s);
    var w = weapon(s);
    var swipes = s.producers.warrior * producerDef('warrior').swipesPerSec;
    var r = {
      tiny: s.producers.tiny * tinyEach(s) * g,
      tinier: s.producers.tinier * producerDef('tinier').rate * g,
      warrior: swipes * w.value * g,
      stick: w.stick ? swipes * 1 * g : 0
    };
    r.total = r.tiny + r.tinier + r.warrior + r.stick;
    return r;
  }

  function tapValue(s) {
    var v = (1 + (s.leveled.knuckles || 0)) * globalMult(s);
    if (s.oneTime.rally) v += 0.05 * rates(s).total;
    return v;
  }

  // ---- item drops ----
  function machinePool() { return C.items.filter(function (i) { return C.tiers[i.tier].weight > 0; }); }

  function rollOne() {
    var tiers = Object.keys(C.tiers).filter(function (t) { return C.tiers[t].weight > 0; });
    var tier = U.pickWeighted(tiers, function (t) { return C.tiers[t].weight; });
    var pool = machinePool().filter(function (i) { return i.tier === tier; });
    if (!pool.length) pool = machinePool();
    return pool[Math.floor(Math.random() * pool.length)];
  }

  // Returns { counts: {id: n}, visual: [itemDef...] }.  Large batches are split by expected value.
  function rollMany(n, visualCap) {
    var counts = {}, visual = [];
    function add(item, k) { counts[item.id] = (counts[item.id] || 0) + k; }
    if (n <= 200) {
      for (var i = 0; i < n; i++) { var it = rollOne(); add(it, 1); if (visual.length < visualCap) visual.push(it); }
      return { counts: counts, visual: visual };
    }
    var pool = machinePool(), totalW = 0;
    Object.keys(C.tiers).forEach(function (t) { totalW += C.tiers[t].weight; });
    var assigned = 0;
    Object.keys(C.tiers).forEach(function (t) {
      var items = pool.filter(function (i) { return i.tier === t; });
      if (!items.length || !C.tiers[t].weight) return;
      var share = n * C.tiers[t].weight / totalW;
      items.forEach(function (item) {
        var exp = share / items.length;
        var k = Math.floor(exp) + (Math.random() < exp % 1 ? 1 : 0);
        add(item, k); assigned += k;
      });
    });
    if (assigned < n) add(rollOne(), n - assigned);
    for (var j = 0; j < visualCap; j++) visual.push(rollOne());
    return { counts: counts, visual: visual };
  }

  function grantItems(s, n, events, visualCap) {
    if (n <= 0) return;
    var res = rollMany(n, visualCap);
    var cpi = clicksPerItem(s), bonus = 0;
    Object.keys(res.counts).forEach(function (id) {
      var k = res.counts[id], def = itemDef(id);
      if (!s.items[id] && events) events.newItems.push(def);
      s.items[id] = (s.items[id] || 0) + k;
      bonus += k * C.tiers[def.tier].bonus * cpi;
    });
    s.itemsMade += n;
    s.cogs += bonus; s.cogsSeen += bonus; s.bonusCogs.items += bonus;
    if (events) { events.itemsMade += n; res.visual.forEach(function (v) { events.visualItems.push(v); }); }
  }

  // Every click from any source goes through here.
  function addClicks(s, source, n, events, visualCap) {
    if (!(n > 0)) return;
    s.clicks[source] = (s.clicks[source] || 0) + n;
    s.cogs += n; s.cogsSeen += n;
    s.bigAngle += n * 360 / clicksPerItem(s);
    if (s.bigAngle >= 360) {
      var turns = Math.floor(s.bigAngle / 360);
      s.bigAngle -= turns * 360;
      grantItems(s, turns, events, visualCap == null ? 3 : visualCap);
    }
  }

  function newEvents() { return { itemsMade: 0, visualItems: [], newItems: [] }; }

  function tick(s, dt, events) {
    var r = rates(s);
    ['tiny', 'tinier', 'warrior', 'stick'].forEach(function (k) { if (r[k] > 0) addClicks(s, k, r[k] * dt, events, 1); });
    s.stats.playSeconds += dt;
    var cps = r.total;
    if (cps > s.stats.bestCps) s.stats.bestCps = cps;
  }

  function tap(s, events) {
    var v = tapValue(s);
    s.stats.taps += 1;
    addClicks(s, 'tap', v, events, 1);
    return v;
  }

  // ---- shop ----
  function producerCost(s, id) { var p = producerDef(id); return Math.ceil(p.baseCost * Math.pow(p.growth, s.producers[id])); }
  function leveledCost(s, id) { var u = leveledDef(id); return Math.ceil(u.baseCost * Math.pow(u.growth, s.leveled[id])); }

  function meets(s, unlock) {
    if (!unlock) return true;
    if (unlock.cogsSeen != null && s.cogsSeen < unlock.cogsSeen) return false;
    if (unlock.itemsMade != null && s.itemsMade < unlock.itemsMade) return false;
    if (unlock.producer && s.producers[unlock.producer] < unlock.count) return false;
    return true;
  }

  function isVisible(s, kind, def) {
    var key = kind + ':' + def.id;
    if (s.revealed[key]) return true;
    var ok = meets(s, def.unlock) && (!def.requires || s.oneTime[def.requires]);
    if (ok) s.revealed[key] = true;
    return ok;
  }

  function buy(s, kind, id) {
    var cost;
    if (kind === 'producer') {
      cost = producerCost(s, id);
      if (s.cogs < cost) return false;
      s.cogs -= cost; s.producers[id] += 1; return true;
    }
    if (kind === 'leveled') {
      var u = leveledDef(id);
      if (s.leveled[id] >= u.maxLevel) return false;
      cost = leveledCost(s, id);
      if (s.cogs < cost) return false;
      s.cogs -= cost; s.leveled[id] += 1; return true;
    }
    if (kind === 'oneTime') {
      var o = oneTimeDef(id);
      if (s.oneTime[id] || s.cogs < o.cost) return false;
      s.cogs -= o.cost; s.oneTime[id] = true; return true;
    }
    return false;
  }

  // ---- rare popups (claimed only by a real tap) ----
  function claimPopup(s) {
    s.stats.popupsClaimed += 1;
    s.stats.legPity = (s.stats.legPity || 0) + 1;
    var roll = Math.random(), tier = null;
    if (s.stats.legPity >= C.popup.legendaryPity || roll < C.popup.legendaryChance) tier = 'legendary';
    else if (s.stats.pity >= C.popup.pityCount - 1 || roll < C.popup.legendaryChance + C.popup.superRareChance) tier = 'superrare';
    if (tier) {
      s.stats.pity = 0;
      if (tier === 'legendary') s.stats.legPity = 0;
      var pool = C.items.filter(function (i) { return i.tier === tier; });
      var item = U.pickWeighted(pool, function (i) { return s.items[i.id] ? 1 : 3; }); // favors ones you lack
      var isNew = !s.items[item.id];
      s.items[item.id] = (s.items[item.id] || 0) + 1;
      return { type: tier, item: item, isNew: isNew };
    }
    s.stats.pity += 1;
    var amount = Math.max(rates(s).total * C.popup.luckySprocketSeconds, tapValue(s) * 50);
    s.cogs += amount; s.cogsSeen += amount; s.bonusCogs.sprockets += amount; s.stats.sprockets += 1;
    return { type: 'sprocket', cogs: amount };
  }

  // ---- offline progress ----
  function offline(s, seconds) {
    var capped = Math.min(seconds, C.offline.maxHours * 3600) * C.offline.efficiency;
    if (capped < 5) return null;
    var before = s.cogs, itemsBefore = s.itemsMade, r = rates(s);
    if (r.total <= 0) return null;
    ['tiny', 'tinier', 'warrior', 'stick'].forEach(function (k) { if (r[k] > 0) addClicks(s, k, r[k] * capped, null, 0); });
    return { seconds: capped, cogs: s.cogs - before, items: s.itemsMade - itemsBefore };
  }

  return {
    clicksPerItem: clicksPerItem, rates: rates, tapValue: tapValue, weapon: weapon,
    tick: tick, tap: tap, newEvents: newEvents,
    producerCost: producerCost, leveledCost: leveledCost, isVisible: isVisible, buy: buy,
    claimPopup: claimPopup, offline: offline,
    producerDef: producerDef, itemDef: itemDef
  };
})();
