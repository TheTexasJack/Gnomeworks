/* Game state: creation, saving, loading.  Saves live only in this browser (localStorage). */
window.GW = window.GW || {};

GW.state = (function () {
  var C = GW.CONFIG;
  var SOURCES = ['tap', 'tiny', 'tinier', 'warrior', 'stick', 'cloner', 'matryoshka', 'wizard'];

  function fresh() {
    var s = {
      schema: 1,
      season: C.season,
      createdAt: Date.now(),
      savedAt: Date.now(),
      paused: false,
      audio: { fx: 0.6, chatter: true, muted: false },
      view: 'machine',      // 'machine' or 'floor'
      cogs: 0,
      cogsSeen: 0,          // lifetime cogs earned, drives unlocks
      bigAngle: 0,          // 0..360, logical position of the big gear
      itemsMade: 0,
      producers: {},
      leveled: {},
      oneTime: {},
      revealed: {},         // shop entries stay visible once unlocked
      items: {},            // item id -> count found
      seen: {},             // items the player has looked at on the shelf
      clicks: {},           // source -> lifetime clicks
      bonusCogs: { items: 0, sprockets: 0 },
      stonks: 0,            // the Packing Line's score (never spent); changes only on a hand-off
      stonksHistory: [],    // Stonks at the end of each recent shift, oldest first (CONFIG.shipping.ticker.history)
      tnp: 0,               // TNP Corp's line on the STONKS screen (1l); moves only on a hand-off, never below 0
      tnpHistory: [],       // TNP at the end of each recent shift, oldest first, like stonksHistory
      shifts: 0,            // completed hand-offs (scored shifts); glitter fakes start from CONFIG.shipping.fakes.startShift
      tnpRow: 0,            // TNP trips in a row (1m), never more than CONFIG.shipping.fakes.maxTnpInRow
      goodShifts: 0,        // GRIP shifts where every real order scored a check (1q); TNP trips count neither way
      tutorial: { seen: {}, bookOpened: false },   // the Packing Line tutorial's pages seen (1q): page id -> true (CONFIG.shipping.tutorial); bookOpened = the How to Ship book opened once (1q.1, its shelf stops glowing)
      lastShift: null,      // the last scored shift (1o): its report card rows and each shipped box's log, for the clipboards; null before the first
      mega: { owned: false, food: 0, nextHunt: 0, hunts: 0, kills: 0, bossKills: 0, trophyPity: 0, eaten: 0 },
      stats: { taps: 0, playSeconds: 0, popupsSeen: 0, popupsClaimed: 0, pity: 0, legPity: 0, bestCps: 0, sprockets: 0 }
    };
    C.producers.forEach(function (p) { s.producers[p.id] = 0; });
    C.leveled.forEach(function (u) { s.leveled[u.id] = 0; });
    SOURCES.forEach(function (k) { s.clicks[k] = 0; });
    return s;
  }

  // Fill any fields missing from older saves so new versions never crash on old data.
  function migrate(saved) {
    var base = fresh();
    // Saves from before 1l count their shifts from the GRIP history (it keeps only the latest few, so this is a floor).
    if (saved.shifts === undefined) saved.shifts = Array.isArray(saved.stonksHistory) ? saved.stonksHistory.length : 0;
    // Saves from before 1q have no tutorial: the pages they have already lived through count as seen.
    if (saved.tutorial === undefined || !saved.tutorial || typeof saved.tutorial !== 'object') saved.tutorial = { seen: GW.tutorial.oldSeen(saved.shifts || 0) };
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
    // Unpaid seconds the factory has rested in the Shipping view count as time away, so a close or reload
    // in the room pays them once through the welcome-back catch-up (main.js restOwed).
    var owed = GW.game && GW.game.restOwed ? GW.game.restOwed() : 0;
    s.savedAt = Date.now() - owed * 1000;
    try { window.localStorage.setItem(C.saveKey, JSON.stringify(s)); return true; }
    catch (e) { return false; }
  }

  function wipe() {
    try { window.localStorage.removeItem(C.saveKey); } catch (e) { /* storage blocked */ }
  }

  return { fresh: fresh, load: load, save: save, wipe: wipe, SOURCES: SOURCES };
})();
