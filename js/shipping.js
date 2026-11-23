/* The shipping room, the Packing Line's view (layer 1a): the room art and the door chain.
   Hidden from players while CONFIG.shipping.enabled is false; ?ship=1 in the address shows it for testing.
   Nothing ships yet.  The door starts closed each time the view opens and is not saved. */
window.GW = window.GW || {};

GW.ship = (function () {
  var C = GW.CONFIG, P = C.shipping, U = GW.util;
  var tallQuery = window.matchMedia(P.tallQuery);
  var built = false, active = false, open = false;
  var box, closedImg, openImg, chain, bounceTimer;

  function enabled() {
    return !!P.enabled || new RegExp('[?&]' + P.testParam + '=1(&|$)').test(window.location.search);
  }
  function layout() { return P.layouts[tallQuery.matches ? 'tall' : 'wide']; }

  function build() {
    box = document.getElementById('ship');
    closedImg = U.el('img', 'ship-room'); openImg = U.el('img', 'ship-room ship-open');
    [closedImg, openImg].forEach(function (im) { im.alt = ''; im.draggable = false; box.appendChild(im); });
    chain = U.el('div', 'ship-chain');
    chain.setAttribute('aria-hidden', 'true');
    var ci = U.el('img'); ci.src = P.chain.img; ci.alt = ''; ci.draggable = false;
    chain.appendChild(ci);
    chain.style.setProperty('--pull', P.chain.pullPercent + '%');
    chain.style.setProperty('--pull-ms', P.chain.pullMs + 'ms');
    chain.addEventListener('pointerdown', function (e) {
      e.stopPropagation();
      if (!e.isTrusted || e.button > 0) return;     // a real tap only, like the gear
      e.preventDefault();
      pull();
    });
    box.appendChild(chain);
    built = true;
    tallQuery.addEventListener('change', redraw);
  }

  // Both twins stay loaded and stacked, so opening is an instant swap with no jump.
  function redraw() {
    if (!built) return;
    var L = layout(), m = document.getElementById('machine'), wh = L.aspect.split('/');
    closedImg.src = GW.theme.img(L.closed);
    openImg.src = GW.theme.img(L.open);
    box.classList.toggle('is-open', open);
    m.style.setProperty('--ship-aspect', L.aspect);
    m.style.setProperty('--ship-ratio', (parseFloat(wh[0]) / parseFloat(wh[1])).toFixed(4));
    chain.style.left = L.chain.x + '%';
    chain.style.top = L.chain.top + '%';
    chain.style.height = L.chain.h + '%';
    chain.style.width = L.chain.hitW + '%';
  }

  function pull() {
    open = !open;
    box.classList.toggle('is-open', open);
    chain.classList.remove('pull'); void chain.offsetWidth; chain.classList.add('pull');
    clearTimeout(bounceTimer);
    bounceTimer = setTimeout(function () { chain.classList.remove('pull'); }, P.chain.pullMs);
    GW.sfx.click();
  }

  // main.js calls this whenever the view changes.  Entering the room always starts with the door closed.
  function setActive(on) {
    if (on && !built) build();
    if (on && !active) { open = false; redraw(); }
    active = on;
  }

  return { enabled: enabled, setActive: setActive, redraw: redraw, isOpen: function () { return open; } };
})();
