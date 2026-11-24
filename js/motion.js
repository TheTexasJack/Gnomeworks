/* Calm motion: one question for the whole game.  GW.calm() is true when the device asks for less motion
   (prefers-reduced-motion) or the player turned on Calm motion in the Info tab.  The device always wins.
   While calm, <html> wears the `calm` class, and every reduced-motion rule in style.css also applies under it.
   An inline script in index.html sets the class before anything draws.  GW.motion.onChange(fn) runs fn
   whenever either one changes, so nothing needs a reload. */
window.GW = window.GW || {};

GW.motion = (function () {
  var M = GW.CONFIG.motion, root = document.documentElement, fns = [];
  var device = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  function deviceCalm() { return !!(device && device.matches); }
  function setting() { try { return localStorage.getItem(M.key) === 'on'; } catch (e) { return false; } }
  function calm() { return deviceCalm() || setting(); }
  function apply() {
    root.classList.toggle('calm', calm());
    fns.forEach(function (fn) { fn(calm()); });
  }
  function set(on) { try { localStorage.setItem(M.key, on ? 'on' : 'off'); } catch (e) {} apply(); }
  function onChange(fn) { fns.push(fn); }
  if (device) {
    if (device.addEventListener) device.addEventListener('change', apply);
    else if (device.addListener) device.addListener(apply);
  }
  root.classList.toggle('calm', calm());
  return { calm: calm, deviceCalm: deviceCalm, setting: setting, set: set, onChange: onChange, apply: apply };
})();

GW.calm = GW.motion.calm;
