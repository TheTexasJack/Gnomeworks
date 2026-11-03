/* Wires it all together: input, the game loop, popups, saving. */
window.GW = window.GW || {};

(function () {
  var C = GW.CONFIG, U = GW.util, E = GW.econ, UI = GW.ui, G = GW.gears;
  var loaded = GW.state.load();
  var s = loaded.state;
  GW.game = { s: s };

  // ---------- startup ----------
  G.build(document.getElementById('gearSvg'));
  var SFX = GW.sfx;
  SFX.load(s.audio);
  UI.init(s, function (kind, id) {
    if (E.buy(s, kind, id)) { SFX.buy(); UI.updateShop(s); UI.updateCrew(s); UI.updateHeader(s); }
    else SFX.nope();
  });
  // Browsers only allow sound after a real tap or key press.
  ['pointerdown', 'keydown'].forEach(function (ev) {
    document.addEventListener(ev, function (e) { if (e.isTrusted) SFX.unlock(); }, true);
  });

  if (loaded.note === 'newseason') UI.toast('A new season has begun!  Fresh gears, fresh gnomes.');
  if (loaded.note === 'nostorage') UI.toast('Your browser is blocking saves, so progress will not be kept.', 'warn');
  if (loaded.note === 'loaded' && !s.paused) {
    var away = (Date.now() - s.savedAt) / 1000;
    var off = E.offline(s, away);
    if (off) {
      UI.toast('Welcome back!  Your gnomes made ' + C.currency.icon + ' ' + U.fmt(off.cogs) + ' and ' + U.fmt(off.items) + ' items while you were away.');
      UI.buildShelf(s);
    }
  }

  // ---------- tapping ----------
  var machine = document.getElementById('machine');
  var bucket = C.tap.maxTapsPerSecond, lastRefill = performance.now(), lastHumanTap = -Infinity;

  function allowTap() {
    var now = performance.now();
    bucket = Math.min(C.tap.maxTapsPerSecond, bucket + (now - lastRefill) / 1000 * C.tap.maxTapsPerSecond);
    lastRefill = now;
    if (bucket < 1) return false;
    bucket -= 1;
    return true;
  }

  function doTap(xPct, yPct) {
    if (s.paused) return;
    var ev = E.newEvents();
    var v = E.tap(s, ev);
    lastHumanTap = performance.now();
    G.bumpDrive();
    SFX.tap();
    UI.floatText(xPct, yPct, '+' + U.fmt(v));
    handleEvents(ev);
  }

  machine.addEventListener('pointerdown', function (e) {
    if (!e.isTrusted || e.button > 0) return;     // scripted or right clicks do nothing
    if (e.target.closest('.rare-popup, .wild-target')) return;
    e.preventDefault();
    if (!allowTap()) return;
    var box = machine.getBoundingClientRect();
    doTap((e.clientX - box.left) / box.width * 100, (e.clientY - box.top) / box.height * 100 - 6);
  });
  machine.addEventListener('keydown', function (e) {
    if (!e.isTrusted || e.repeat) return;
    if (e.key !== ' ' && e.key !== 'Enter') return;
    e.preventDefault();
    if (!allowTap()) return;
    var c = G.driveCenter();
    doTap(c.x, c.y - 10);
  });
  machine.addEventListener('contextmenu', function (e) { e.preventDefault(); });

  // ---------- item events ----------
  var popQueue = [], popBudget = C.machine.maxVisualItemsPerSecond, extraItems = 0, shelfDirty = false;

  function handleEvents(ev) {
    if (!ev.itemsMade) return;
    shelfDirty = true;
    ev.visualItems.forEach(function (it) { popQueue.push(it); });
    extraItems += Math.max(0, ev.itemsMade - ev.visualItems.length);
    ev.newItems.forEach(function (it) { UI.toast('New item for the shelf: ' + it.name + '!', 'new'); });
  }

  function drainPops(dt) {
    popBudget = Math.min(C.machine.maxVisualItemsPerSecond, popBudget + dt * C.machine.maxVisualItemsPerSecond);
    while (popQueue.length && popBudget >= 1) { var it = popQueue.shift(); UI.popItem(it); SFX.drop(it.tier, s.view === 'floor'); popBudget -= 1; }
    if (popQueue.length > 6) { extraItems += popQueue.length - 6; popQueue.length = 6; }
  }

  // ---------- rare popups ----------
  var popup = null, nextPopupAt = performance.now() + U.rand(C.popup.minSeconds, C.popup.maxSeconds) * 1000;

  function spawnPopup() {
    var slot = document.getElementById('rareSlot');
    var b = U.el('button', 'rare-popup');
    b.type = 'button';
    b.setAttribute('aria-label', 'Something shiny!  Tap to grab it.');
    b.textContent = '✨';
    var left = Math.random() < 0.5;
    b.style.left = left ? '3%' : '';
    b.style.right = left ? '' : '3%';
    b.style.top = U.rand(12, 60).toFixed(0) + '%';
    b.addEventListener('pointerdown', function (e) {
      e.stopPropagation();
      if (!e.isTrusted) return;               // only a real person can claim it
      e.preventDefault();
      claim(b);
    });
    b.addEventListener('keydown', function (e) {
      if (!e.isTrusted || (e.key !== ' ' && e.key !== 'Enter')) return;
      e.preventDefault(); claim(b);
    });
    slot.appendChild(b);
    s.stats.popupsSeen += 1;
    SFX.shiny(isHot(performance.now()));
    popup = { el: b, expires: performance.now() + C.popup.lifetimeSeconds * 1000 };
    var flash = document.getElementById('edgeFlash');
    flash.classList.remove('on'); void flash.offsetWidth; flash.classList.add('on');
  }

  function claim(b) {
    if (!popup || popup.el !== b) return;
    var res = E.claimPopup(s, isHot(performance.now()));
    b.classList.add('claimed');
    setTimeout(function () { b.remove(); }, 400);
    popup = null;
    if (res.type === 'legendary') SFX.legendary(); else if (res.type === 'superrare') SFX.superRare(); else SFX.sprocket();
    if (res.type === 'superrare' || res.type === 'legendary') {
      var label = res.type === 'legendary' ? 'LEGENDARY!  ' : 'SUPER RARE!  ';
      UI.toast((res.isNew ? label : 'Another one!  ') + res.item.name + ' goes on the shelf!', res.type === 'legendary' ? 'legendary' : 'super');
      UI.buildShelf(s); UI.flashItem(res.item.id);
    } else {
      UI.toast('Lucky Sprocket!  +' + C.currency.icon + ' ' + U.fmt(res.cogs), 'lucky');
    }
    UI.updateHeader(s);
  }

  function updatePopups(now) {
    if (popup && now > popup.expires) {
      var gone = popup.el; gone.classList.add('fade'); setTimeout(function () { gone.remove(); }, 500);
      popup = null;
    }
    if (!popup && now >= nextPopupAt) {
      if (!document.hidden) {
        spawnPopup();
        nextPopupAt = now + U.rand(C.popup.minSeconds, C.popup.maxSeconds) * 1000;
      } else {
        nextPopupAt = now + 5000;
      }
    }
    if (popup) popup.el.classList.toggle('hot', isHot(now));
  }

  function isHot(now) { return now - lastHumanTap < C.tap.activeWindowSeconds * 1000; }

  // ---------- main loop ----------
  var last = performance.now(), slowTimer = 0, saveTimer = 0;
  var lastItems = s.itemsMade, lastAngle = s.bigAngle, pending = 0, display = s.bigAngle;

  function frame(now) {
    var dt = (now - last) / 1000;
    last = now;
    if (s.paused) {
      // Frozen: push timers forward so nothing expires or spawns while paused.
      if (popup) popup.expires += dt * 1000;
      nextPopupAt += dt * 1000;
      GW.wild.shift(dt * 1000);
    } else if (dt > 5) {
      // Tab was asleep.  Catch up quietly instead of dumping thousands of pops.
      var off = E.offline(s, dt);
      if (off && off.items) shelfDirty = true;
    } else if (dt > 0) {
      var ev = E.newEvents();
      E.tick(s, dt, ev);
      handleEvents(ev);
    }

    // Big gear display chases the logical angle, capped so it never blurs into nothing.
    pending += (s.itemsMade - lastItems) * 360 + (s.bigAngle - lastAngle);
    lastItems = s.itemsMade; lastAngle = s.bigAngle;
    if (pending > 720) pending = 360 + (pending % 360);
    var step = Math.min(pending, Math.max(pending * Math.min(1, dt * 14), 0), C.machine.maxVisualDegPerSec * Math.min(dt, 0.1));
    pending -= step; display = (display + step) % 360;
    G.update(display);

    drainPops(Math.min(dt, 1));
    if (extraItems >= 1 && Math.random() < dt * 2) {
      var m = s.view === 'floor' ? { x: 92, y: 104 } : G.hatchMouth();
      UI.floatText(m.x - 8, m.y - 14, '+' + U.fmt(extraItems) + ' items', 'items');
      extraItems = 0;
    }
    updatePopups(now);
    UI.animateFloor(now, s);
    UI.updateHeader(s);

    slowTimer += dt;
    if (slowTimer > 0.25) {
      slowTimer = 0;
      UI.updateShop(s); UI.updateCrew(s); UI.updateStats(s);
      if (shelfDirty) { UI.buildShelf(s); shelfDirty = false; }
    }
    saveTimer += dt;
    if (saveTimer > C.autosaveSeconds) { saveTimer = 0; GW.state.save(s); }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  // ---------- clipboard: border-image sizes follow the panel width ----------
  U.$all('.side-col, .shelf-col').forEach(function (col) {
    function fitClipboard() { if (col.offsetWidth) col.style.setProperty('--cb', (col.offsetWidth / 844).toFixed(4)); }
    if (window.ResizeObserver) new ResizeObserver(fitClipboard).observe(col);
    fitClipboard();
  });

  // ---------- side rails: on wide screens the progress gauge and crew stand beside the machine ----------
  var machineCol = document.querySelector('.machine-col');
  function fitRails() {
    var colW = machineCol.clientWidth;
    var machW = s.view === 'floor' ? colW : Math.min(colW, window.innerHeight - 245);
    machineCol.classList.toggle('rails', (colW - machW) / 2 >= C.layout.railMinWidth);
  }
  window.addEventListener('resize', fitRails);

  // ---------- view toggle: The Machine / Shop Floor ----------
  function applyView() {
    var floor = s.view === 'floor';
    machine.classList.toggle('floor-mode', floor);
    U.$all('.view-toggle button').forEach(function (b) {
      var on = b.dataset.view === s.view;
      b.classList.toggle('active', on); b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    fitRails();
    machine.setAttribute('aria-label', floor ? 'The Shop Floor.  Tap anywhere to crank the machine.' : 'The machine.  Tap to turn the little gear.');
  }
  U.$all('.view-toggle button').forEach(function (b) {
    b.addEventListener('click', function () { s.view = b.dataset.view; SFX.click(); applyView(); UI.updateFloor(s); });
  });
  applyView();

  // ---------- TAP label: fades out after a minute, the ring keeps pulsing ----------
  if (C.tap.labelFadeSeconds > 0) {
    setTimeout(function () { document.body.classList.add('tap-hint-done'); }, C.tap.labelFadeSeconds * 1000);
  }

  // ---------- sound settings ----------
  var muteBtn = document.getElementById('muteBtn');
  var fxSlider = document.getElementById('fxVol'), chatterBox = document.getElementById('chatterOn');
  function applyAudioUI() {
    var a = SFX.settings();
    muteBtn.innerHTML = a.muted ? U.ICONS.mute : U.ICONS.sound;
    muteBtn.setAttribute('aria-label', a.muted ? 'Sound is off.  Turn sound on.' : 'Sound is on.  Turn sound off.');
    muteBtn.setAttribute('aria-pressed', a.muted ? 'true' : 'false');
    fxSlider.value = Math.round(a.fx * 100);
    chatterBox.checked = a.chatter;
    s.audio = { fx: a.fx, chatter: a.chatter, muted: a.muted };
  }
  muteBtn.addEventListener('click', function () { SFX.set('muted', !SFX.settings().muted); applyAudioUI(); SFX.click(); });
  fxSlider.addEventListener('input', function () { SFX.set('fx', fxSlider.value / 100); applyAudioUI(); });
  fxSlider.addEventListener('change', function () { SFX.buy(); });
  chatterBox.addEventListener('change', function () { SFX.set('chatter', chatterBox.checked); applyAudioUI(); });
  applyAudioUI();

  // ---------- pause ----------
  var pauseBtn = document.getElementById('pauseBtn');
  function applyPause() {
    document.body.classList.toggle('paused', !!s.paused);
    pauseBtn.innerHTML = s.paused ? U.ICONS.play : U.ICONS.pause;
    pauseBtn.setAttribute('aria-label', s.paused ? 'Resume' : 'Pause');
    pauseBtn.title = s.paused ? 'Resume (P)' : 'Pause (P)';
    pauseBtn.classList.toggle('go', !!s.paused);
    pauseBtn.setAttribute('aria-pressed', s.paused ? 'true' : 'false');
    document.getElementById('pauseOverlay').hidden = !s.paused;
  }
  function togglePause() {
    s.paused = !s.paused;
    applyPause();
    SFX.pause(s.paused);
    GW.state.save(s);
  }
  pauseBtn.addEventListener('click', togglePause);
  document.getElementById('resumeBtn').addEventListener('click', function (e) { e.stopPropagation(); togglePause(); });
  document.getElementById('pauseOverlay').addEventListener('pointerdown', function (e) { e.stopPropagation(); });
  document.addEventListener('keydown', function (e) {
    if ((e.key === 'p' || e.key === 'P') && !e.repeat && !e.ctrlKey && !e.metaKey && !e.altKey) togglePause();
  });
  applyPause();

  // ---------- saving ----------
  document.addEventListener('visibilitychange', function () { if (document.hidden) GW.state.save(s); });
  window.addEventListener('pagehide', function () { GW.state.save(s); });

  // ---------- player reset (their own browser save only) ----------
  document.getElementById('resetBtn').addEventListener('click', function () {
    if (!window.confirm('Reset YOUR Gnomeworks progress in this browser?')) return;
    if (!window.confirm('Really?  Every gnome, cog, and sock will be gone.')) return;
    GW.state.wipe();
    GW.state.save = function () { return false; }; // stop the autosave from writing the old game back
    window.location.reload();
  });

  // ---------- testing helpers: add ?debug=1 to the address ----------
  if (/[?&]debug=1/.test(window.location.search)) {
    var bar = U.el('div', 'debug-bar');
    [['+1K', 1e3], ['+1M', 1e6], ['+1B', 1e9]].forEach(function (b) {
      var btn = U.el('button', '', b[0]);
      btn.addEventListener('click', function () { s.cogs += b[1]; s.cogsSeen += b[1]; });
      bar.appendChild(btn);
    });
    var pop = U.el('button', '', 'Popup');
    pop.addEventListener('click', function () { lastHumanTap = performance.now(); nextPopupAt = 0; });
    bar.appendChild(pop);
    ['spin', 'whoosh', 'storm'].forEach(function (st) {
      var w = U.el('button', '', 'Wild: ' + st);
      w.addEventListener('click', function () { GW.wild.start(s, st); });
      bar.appendChild(w);
    });
    var hour = U.el('button', '', '+1 hour');
    hour.addEventListener('click', function () { E.offline(s, 3600); shelfDirty = true; });
    bar.appendChild(hour);
    bar.appendChild(U.el('span', '', 'DEBUG'));
    document.body.appendChild(bar);
  }
})();
