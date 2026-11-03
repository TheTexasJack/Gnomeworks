/* Sound effects, synthesized in code with Web Audio.  No sound files, no licenses.
   Nothing plays until the player's first tap (browsers require that).
   On iPhones the sounds are marked "ambient" so they mix with the player's own music
   instead of pausing it, and they follow the silent switch. */
window.GW = window.GW || {};

GW.sfx = (function () {
  var ctx = null, master = null, fxBus = null, noiseBuf = null;
  var settings = { fx: 0.6, chatter: true, muted: false };
  var last = {};            // per-sound timestamps for rate limits
  var combo = 0, lastTap = 0;
  var chatterBudget = 2, chatterRefill = 0;

  try { if (navigator.audioSession) navigator.audioSession.type = 'ambient'; } catch (e) { /* older browsers */ }

  function load(saved) {
    if (saved && typeof saved === 'object') {
      if (typeof saved.fx === 'number') settings.fx = Math.max(0, Math.min(1, saved.fx));
      if (typeof saved.chatter === 'boolean') settings.chatter = saved.chatter;
      if (typeof saved.muted === 'boolean') settings.muted = saved.muted;
    }
    apply();
    return settings;
  }

  function apply() {
    if (fxBus) fxBus.gain.setTargetAtTime(settings.muted ? 0 : settings.fx * 0.9, ctx.currentTime, 0.02);
  }

  // Call from a real user gesture.  Safe to call many times.
  function unlock() {
    if (!ctx) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      try { ctx = new AC(); } catch (e) { return; }
      master = ctx.createDynamicsCompressor();
      master.threshold.value = -14; master.ratio.value = 6;
      master.connect(ctx.destination);
      fxBus = ctx.createGain(); fxBus.connect(master);
      var len = ctx.sampleRate * 0.5;
      noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate);
      var d = noiseBuf.getChannelData(0);
      for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      apply();
    }
    if (ctx.state === 'suspended') ctx.resume();
  }

  function ready() { return ctx && ctx.state === 'running' && !settings.muted && settings.fx > 0; }

  function limit(name, perSec) {
    var now = performance.now();
    if (last[name] && now - last[name] < 1000 / perSec) return false;
    last[name] = now;
    return true;
  }

  function vary(f) { return f * (0.96 + Math.random() * 0.08); }

  // ---- building blocks ----
  function tone(o) {
    var t = ctx.currentTime + (o.at || 0);
    var osc = ctx.createOscillator(), g = ctx.createGain();
    osc.type = o.type || 'sine';
    osc.frequency.setValueAtTime(o.f, t);
    if (o.to) osc.frequency.exponentialRampToValueAtTime(o.to, t + (o.glide || o.dur));
    var peak = o.vol || 0.2, atk = o.atk || 0.004;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + atk);
    g.gain.exponentialRampToValueAtTime(0.0001, t + o.dur);
    var node = osc;
    if (o.lp) { var f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = o.lp; osc.connect(f); node = f; }
    node.connect(g); g.connect(fxBus);
    osc.start(t); osc.stop(t + o.dur + 0.05);
  }

  function noise(o) {
    var t = ctx.currentTime + (o.at || 0);
    var src = ctx.createBufferSource(); src.buffer = noiseBuf;
    var f = ctx.createBiquadFilter(); f.type = o.filter || 'bandpass'; f.frequency.setValueAtTime(o.f, t); f.Q.value = o.q || 1;
    if (o.to) f.frequency.exponentialRampToValueAtTime(o.to, t + o.dur);
    var g = ctx.createGain(), peak = o.vol || 0.2;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + (o.atk || 0.003));
    g.gain.exponentialRampToValueAtTime(0.0001, t + o.dur);
    src.connect(f); f.connect(g); g.connect(fxBus);
    src.start(t, Math.random() * 0.3); src.stop(t + o.dur + 0.05);
  }

  // ---- the sounds ----
  // Tap: wooden ratchet tick with a brass ping.  Pitch climbs while you tap fast.
  function tap() {
    var now = performance.now();
    combo = now - lastTap < 450 ? Math.min(combo + 1, 14) : 0;
    lastTap = now;
    if (!ready() || !limit('tap', 12)) return;
    var up = Math.pow(2, combo / 24);
    noise({ f: vary(2600), q: 3, dur: 0.035, vol: 0.28 });
    tone({ f: vary(1250) * up, dur: 0.07, vol: 0.07, type: 'triangle' });
  }

  // Item out of the hatch: clunk, pop, plus a rarity layer.
  function drop(tier, quiet) {
    if (!ready() || !limit('drop', 4)) return;
    var v = quiet ? 0.5 : 1;
    if (!quiet) {
      tone({ f: vary(150), to: 70, dur: 0.12, vol: 0.22 * v, type: 'triangle' });
      noise({ f: 400, q: 0.8, dur: 0.06, vol: 0.12 * v });
    }
    tone({ f: vary(560), to: 900, glide: 0.05, dur: 0.09, vol: 0.12 * v, at: quiet ? 0 : 0.05 });
    if (tier === 'uncommon') {
      tone({ f: 1760, dur: 0.18, vol: 0.05 * v, at: 0.08 }); tone({ f: 2349, dur: 0.22, vol: 0.04 * v, at: 0.12 });
    } else if (tier === 'rare') {
      [880, 1109, 1319, 1760].forEach(function (f, i) { tone({ f: f, dur: 0.45, vol: 0.06 * v, at: 0.08 + i * 0.05 }); });
    }
  }

  function buy() {
    if (!ready() || !limit('buy', 8)) return;
    tone({ f: 1480, dur: 0.12, vol: 0.09, type: 'square', lp: 4000 });
    tone({ f: 1975, dur: 0.35, vol: 0.09, type: 'square', lp: 4000, at: 0.07 });
    noise({ f: 7000, q: 0.7, dur: 0.2, vol: 0.05, at: 0.07 });
  }

  function nope() {
    if (!ready() || !limit('nope', 4)) return;
    tone({ f: 110, to: 80, dur: 0.14, vol: 0.2, type: 'triangle' });
    noise({ f: 300, q: 1, dur: 0.06, vol: 0.08 });
  }

  function click() {
    if (!ready() || !limit('click', 10)) return;
    noise({ f: 1800, q: 4, dur: 0.03, vol: 0.18 });
  }

  function shiny(hot) {
    if (!ready()) return;
    var notes = hot ? [1319, 1760, 2093, 2637] : [1319, 1760, 2093];
    notes.forEach(function (f, i) { tone({ f: f, dur: 0.35, vol: 0.06, at: i * 0.07 }); });
  }

  function sprocket() {
    if (!ready()) return;
    for (var i = 0; i < 7; i++) tone({ f: 2000 + Math.random() * 1200, dur: 0.12, vol: 0.06, type: 'triangle', at: i * 0.045 + Math.random() * 0.02 });
  }

  function superRare() {
    if (!ready()) return;
    [1047, 1319, 1568, 2093, 2637].forEach(function (f, i) {
      tone({ f: f, dur: 0.7, vol: 0.07, at: i * 0.08 });
      tone({ f: f * 2, dur: 0.4, vol: 0.02, at: i * 0.08 + 0.02 });
    });
  }

  function legendary() {
    if (!ready()) return;
    var seq = [[392, 0], [523, 0.13], [659, 0.26], [784, 0.39]];
    seq.forEach(function (n) { tone({ f: n[0], dur: 0.3, vol: 0.12, type: 'sawtooth', lp: 2200, at: n[1] }); });
    [523, 659, 784, 1047].forEach(function (f) { tone({ f: f, dur: 1.3, vol: 0.07, type: 'sawtooth', lp: 1800, at: 0.55, atk: 0.03 }); });
    for (var i = 0; i < 6; i++) tone({ f: 2400 + Math.random() * 1600, dur: 0.3, vol: 0.03, at: 0.6 + i * 0.09 });
  }

  function pause(on) {
    if (!ready()) return;
    var a = on ? [660, 440] : [440, 660];
    tone({ f: a[0], dur: 0.12, vol: 0.08, type: 'triangle' });
    tone({ f: a[1], dur: 0.18, vol: 0.08, type: 'triangle', at: 0.1 });
  }

  // Shop Floor chatter: one little noise per gnome type.  Shares a budget of about 2 a second.
  function chatter(pid) {
    if (!ready() || !settings.chatter) return;
    var now = performance.now();
    chatterBudget = Math.min(2, chatterBudget + (now - chatterRefill) / 1000 * 2);
    chatterRefill = now;
    if (chatterBudget < 1) return;
    chatterBudget -= 1;
    var q = 0.55;
    switch (pid) {
      case 'tiny':
        tone({ f: vary(500), to: 760, dur: 0.12, vol: 0.06 * q, type: 'triangle' }); break;
      case 'tinier':
        for (var i = 0; i < 3; i++) noise({ f: vary(3200), q: 6, dur: 0.025, vol: 0.12 * q, at: i * 0.05 });
        noise({ f: 900, to: 300, q: 2, dur: 0.3, vol: 0.05 * q, at: 0.02 }); break;
      case 'warrior':
        tone({ f: vary(120), to: 60, dur: 0.14, vol: 0.2 * q, type: 'triangle' });
        noise({ f: 700, q: 1, dur: 0.08, vol: 0.14 * q }); break;
      case 'cloner':
        tone({ f: vary(300), to: 700, glide: 0.08, dur: 0.14, vol: 0.09 * q });
        tone({ f: vary(420), to: 900, glide: 0.06, dur: 0.1, vol: 0.06 * q, at: 0.09 }); break;
      case 'wizard':
        noise({ f: 600, to: 2400, q: 3, dur: 0.32, vol: 0.09 * q });
        tone({ f: vary(660), to: 990, glide: 0.25, dur: 0.3, vol: 0.05 * q, type: 'sine', at: 0.05 }); break;
      case 'matryoshka':
        noise({ f: 1400, q: 2, dur: 0.025, vol: 0.2 * q });
        tone({ f: vary(420), to: 220, dur: 0.1, vol: 0.12 * q }); break;
    }
  }

  // Clone Attack: a nasal gremlin giggle when a clone grabs something...
  function hehe() {
    if (!ready()) return;
    [0, 0.17].forEach(function (at, i) {
      var f = vary(i ? 330 : 380);
      tone({ f: f, to: f * 0.78, dur: 0.11, vol: 0.13, type: 'square', lp: 1800, at: at });
      tone({ f: f * 2.02, to: f * 1.5, dur: 0.09, vol: 0.05, type: 'sawtooth', lp: 2600, at: at + 0.005 });
      noise({ f: 1400, q: 5, dur: 0.06, vol: 0.06, at: at });
    });
  }
  // ...and a deep gloopy SPLOOP with bubbles when one goes back in the vat.
  function sploop() {
    if (!ready()) return;
    tone({ f: 260, to: 60, dur: 0.38, vol: 0.32, type: 'sine', glide: 0.3 });
    noise({ f: 700, to: 160, q: 1.5, dur: 0.32, vol: 0.18, filter: 'lowpass' });
    [0.22, 0.3, 0.37, 0.46].forEach(function (at) { tone({ f: vary(600 + Math.random() * 500), to: 1300, dur: 0.06, vol: 0.06, at: at }); });
  }

  return {
    hehe: hehe, sploop: sploop,
    load: load, unlock: unlock, settings: function () { return settings; },
    set: function (k, v) { settings[k] = v; apply(); return settings; },
    tap: tap, drop: drop, buy: buy, nope: nope, click: click, shiny: shiny,
    sprocket: sprocket, superRare: superRare, legendary: legendary, pause: pause, chatter: chatter
  };
})();
