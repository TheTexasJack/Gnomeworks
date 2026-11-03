/* Day and Night themes.  The <html> element gets the "night" class (set early in index.html).
   Painted art swaps to its _night twin through GW.theme.img(); the rest is CSS under .night. */
window.GW = window.GW || {};

GW.theme = (function () {
  var KEY = 'gnomeworks.theme', root = document.documentElement;
  var dark = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  // Art that has a night version.  Anything not listed keeps its day picture.
  var NIGHT = {
    'assets/bg/machine_wall.webp': 'assets/bg/machine_wall_night.webp',
    'assets/bg/floor.webp': 'assets/bg/floor_night.webp',
    'assets/bg/floor_tall.webp': 'assets/bg/floor_tall_night.webp',
    'assets/crew/help_wanted.webp': 'assets/crew/help_wanted_night.webp',
    'assets/ui/title.webp': 'assets/ui/title_night.webp'
  };
  function setting() { try { return localStorage.getItem(KEY) || 'auto'; } catch (e) { return 'auto'; } }
  function isNight() { var t = setting(); return t === 'night' || (t === 'auto' && !!(dark && dark.matches)); }
  function img(path) { return isNight() && NIGHT[path] ? NIGHT[path] : path; }

  function apply() {
    root.classList.toggle('night', isNight());
    var w = document.getElementById('machineWall');
    if (w) w.setAttribute('href', img('assets/bg/machine_wall.webp'));
    var t = document.querySelector('.title img');
    if (t) t.src = img('assets/ui/title.webp');
    if (GW.ui && GW.ui.rebuildFloor && GW.game) GW.ui.rebuildFloor();
  }
  function set(t) { try { localStorage.setItem(KEY, t); } catch (e) {} apply(); }
  if (dark && dark.addEventListener) dark.addEventListener('change', function () { if (setting() === 'auto') apply(); });

  return { img: img, isNight: isNight, setting: setting, set: set, apply: apply };
})();
