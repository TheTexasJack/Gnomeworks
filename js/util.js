/* Small helpers: number formatting, randomness, DOM shortcuts. */
window.GW = window.GW || {};

GW.util = (function () {
  var SUFFIXES = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];

  function fmt(n) {
    if (!isFinite(n)) return '∞';
    if (n < 0) return '-' + fmt(-n);
    if (n < 1000) {
      if (n < 10 && n % 1 !== 0) return n.toFixed(1);
      return Math.floor(n).toString();
    }
    var tier = Math.floor(Math.log10(n) / 3);
    if (tier >= SUFFIXES.length) return n.toExponential(2).replace('+', '');
    var scaled = n / Math.pow(1000, tier);
    var digits = scaled < 10 ? 2 : scaled < 100 ? 1 : 0;
    return scaled.toFixed(digits) + SUFFIXES[tier];
  }

  function fmtTime(sec) {
    sec = Math.floor(sec);
    var h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
    if (h) return h + 'h ' + m + 'm';
    if (m) return m + 'm ' + s + 's';
    return s + 's';
  }

  function rand(min, max) { return min + Math.random() * (max - min); }

  function pickWeighted(list, weightFn) {
    var total = 0, i;
    for (i = 0; i < list.length; i++) total += weightFn(list[i]);
    var r = Math.random() * total;
    for (i = 0; i < list.length; i++) {
      r -= weightFn(list[i]);
      if (r <= 0) return list[i];
    }
    return list[list.length - 1];
  }

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  // Small inline icons (fonts on some systems are missing the media symbols).
  var ICONS = {
    pause: '<svg viewBox="0 0 24 24" class="ico" aria-hidden="true"><rect x="5" y="4" width="5" height="16" rx="1.5"/><rect x="14" y="4" width="5" height="16" rx="1.5"/></svg>',
    play: '<svg viewBox="0 0 24 24" class="ico" aria-hidden="true"><path d="M7 4.5v15a1 1 0 0 0 1.5.86l12-7.5a1 1 0 0 0 0-1.72l-12-7.5A1 1 0 0 0 7 4.5z"/></svg>',
    sound: '<svg viewBox="0 0 24 24" class="ico" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    mute: '<svg viewBox="0 0 24 24" class="ico" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16 9l5 6M21 9l-5 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>'
  };

  function median(list) {
    var a = list.slice().sort(function (x, y) { return x - y; }), m = a.length >> 1;
    return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2;
  }

  return { median: median, ICONS: ICONS, fmt: fmt, fmtTime: fmtTime, rand: rand, pickWeighted: pickWeighted, el: el, $: $, $all: $all };
})();
