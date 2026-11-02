/* Game state: creation, saving, loading.  Saves live only in this browser (localStorage). */
window.GW = window.GW || {};

GW.state = (function () {
  var C = GW.CONFIG;
  var SOURCES = ['tap', 'tiny', 'tinier', 'warrior', 'stick'];

  function fresh() {
    var s = {
      schema: 1,
      season: C.season,
      createdAt: Date.now(),
      savedAt: Date.now(),
      paused: false,
      cogs: 0,
      cogsSeen: 0,          // lifetime cogs earned, drives unlocks
      bigAngle: 0,          // 0..360, logical position of the big gear
      itemsMade: 0,
      producers: {},
      leveled: {},
      oneTime: {},
      revealed: {},         // shop entries stay visible once unlocked
      items: {}, 
      seen: {},             // items the player has looked at on the shelf
          // id -> count
      clicks: {},           // source -> lifetime clicks
      bonusCogs: { items: 0, sprockets: 0 },
      stats: { taps: 0, playSeconds: 0, popupsSeen: 0, popupsClaimed: 0, pity: 0, bestCps: 0, sprockets: 0 }
    };
    C.producers.forEach(function (p) { s.producers[p.id] = 0; });
    C.leveled.forEach(function (u) { s.leveled[u.id] = 0; });
    SOURCES.forEach(function (k) { s.clicks[k] = 0; });
    return s;
  }

  // Fill any fields missing from older saves so new versions never crash on old data.
  function migrate(saved) {
    var base = fresh();
    Object.keys(base).forEach(function (k) {
      if (saved[k] === undefined) saved[k] = base[k];
      else if (base[k] && typeof base[k] === 'object' && !Array.isArray(base[k])) {
        Object.keys(base[k]).forEach(function (kk) {
          if (saved[k][kk] === undefined) saved[k][kk] = base[k][kk];
        });
      }
    });
    return saved;
  }

  function valid(s) {
    return s && typeof s === 'object' && typeof s.cogs === 'number' && isFinite(s.cogs) && s.cogs >= 0;
  }

  function load() {
    var raw = null;
    try { raw = window.localStorage.getItem(C.saveKey); } catch (e) { return { state: fresh(), note: 'nostorage' }; }
    if (!raw) return { state: fresh(), note: 'new' };
    var s;
    try { s = JSON.parse(raw); } catch (e) { return { state: fresh(), note: 'corrupt' }; }
    if (!valid(s)) return { state: fresh(), note: 'corrupt' };
    if (s.season !== C.season) return { state: fresh(), note: 'newseason' };
    return { state: migrate(s), note: 'loaded' };
  }

  function save(s) {
    s.savedAt = Date.now();
    try { window.localStorage.setItem(C.saveKey, JSON.stringify(s)); return true; }
    catch (e) { return false; }
  }

  function wipe() {
    try { window.localStorage.removeItem(C.saveKey); } catch (e) { /* storage blocked */ }
  }

  return { fresh: fresh, load: load, save: save, wipe: wipe, SOURCES: SOURCES };
})();
