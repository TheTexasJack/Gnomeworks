/* The Packing Line's tutorial (1q): short pages, each shown the first time its thing appears in the room, once per
   save (the save's tutorial.seen), and the How to Ship book that reopens the pages seen so far.  Words, pictures, and
   sizes are in CONFIG.shipping.tutorial; js/shipping.js says when each page is due.
   A page is a pop-up on document.body over everything: a title, its words, one small picture, and one button,
   "Got it!".  Only a real tap or Enter counts, and not in the first armMs, so a stray tap during play can't skip it.
   Nothing under it gets a tap or a key while it shows.  Pages due together wait in a queue and show one after the
   other.  "Show instructions" does not hide it: the tutorial is the explaining layer, the tips are the hint layer.
   ?tutorial=reset in the address clears the seen pages once, as the page loads.
   The book is new (its bookshelf glows, 1q.1) from the first page seen until it is first opened: the save's
   tutorial.bookOpened. */
window.GW = window.GW || {};

GW.tutorial = (function () {
  var C = GW.CONFIG, T = C.shipping.tutorial, U = GW.util;
  var view = null, panel, title, words, pic, gotIt, nav, backBtn, nextBtn, count;
  var queue = [], showing = null, book = null, shownAt = 0, resetDone = false, listeners = [];
  // showing = the page id on screen (null when closed); book = { list, at } while the book is open

  function page(id) { return T.pages.filter(function (p) { return p.id === id; })[0] || null; }
  // The save's seen pages.  ?tutorial=reset clears them the first time they are read after the page loads.
  function seen() {
    var s = GW.game.s;
    if (!s.tutorial || typeof s.tutorial !== 'object') s.tutorial = { seen: {} };
    if (!s.tutorial.seen) s.tutorial.seen = {};
    if (!resetDone) {
      resetDone = true;
      if (/[?&]tutorial=reset(&|$)/.test(window.location.search)) { s.tutorial.seen = {}; s.tutorial.bookOpened = false; GW.state.save(s); }
    }
    return s.tutorial.seen;
  }
  // The book is new (1q.1): it has a page, and the save has never opened it.
  function bookNew() {
    var s = seen();
    return !GW.game.s.tutorial.bookOpened && T.pages.some(function (p) { return s[p.id]; });
  }
  function changed() { listeners.forEach(function (fn) { fn(); }); }
  // An older save (no tutorial in it) has lived through some pages already: 1 or more shifts covers the pages marked
  // 'shifts', and fakes.startShift or more covers the 'fakes' page too.  state.js calls this as it loads a save.
  function oldSeen(shifts) {
    var out = {};
    T.pages.forEach(function (p) {
      if ((p.old === 'shifts' && shifts >= 1) || (p.old === 'fakes' && shifts >= C.shipping.fakes.startShift)) out[p.id] = true;
    });
    return out;
  }

  function build() {
    view = U.el('div', 'tut-view');
    view.hidden = true;
    view.style.setProperty('--tut-w', 'min(' + T.vw + 'vw, ' + T.width + 'px)');
    view.style.setProperty('--tut-night', C.shipping.slip.nightBrightness);
    panel = U.el('div', 'tut-page');
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.style.borderImageSource = 'url("' + C.shipping.slip.paper + '")';
    panel.style.borderImageSlice = C.shipping.leave.slice + ' fill';
    var body = U.el('div', 'tut-body');
    body.appendChild(U.el('i', 'tut-stripes'));
    title = U.el('div', 'tut-title');
    words = U.el('div', 'tut-text');
    pic = U.el('img', 'tut-pic');
    pic.draggable = false;
    pic.width = T.pic[0]; pic.height = T.pic[1];
    pic.style.aspectRatio = T.pic[0] + ' / ' + T.pic[1];
    body.appendChild(title); body.appendChild(pic); body.appendChild(words);
    nav = U.el('div', 'tut-nav');
    backBtn = U.el('button', 'tut-btn tut-step', T.back);
    count = U.el('span', 'tut-count');
    nextBtn = U.el('button', 'tut-btn tut-step', T.next);
    backBtn.type = nextBtn.type = 'button';
    nav.appendChild(backBtn); nav.appendChild(count); nav.appendChild(nextBtn);
    body.appendChild(nav);
    gotIt = U.el('button', 'tut-btn tut-got', T.gotIt);
    gotIt.type = 'button';
    body.appendChild(gotIt);
    panel.appendChild(body);
    view.appendChild(panel);
    document.body.appendChild(view);
    // Caught first, on the window, so nothing under the page hears a tap or a key while it shows.
    window.addEventListener('pointerdown', function (e) {
      if (!showing) return;
      e.stopPropagation(); e.preventDefault();
      if (!e.isTrusted || e.button > 0) return;
      var b = e.target.closest && e.target.closest('.tut-btn');
      if (b === gotIt) press();
      else if (b === backBtn) step(-1);
      else if (b === nextBtn) step(1);
    }, true);
    ['pointerup', 'click', 'touchstart', 'touchend', 'mousedown', 'mouseup', 'dblclick', 'contextmenu'].forEach(function (t) {
      window.addEventListener(t, function (e) {
        if (!showing) return;
        e.stopPropagation();
        if (t !== 'touchstart' && t !== 'touchend' && e.cancelable) e.preventDefault();
      }, true);
    });
    window.addEventListener('keydown', function (e) {
      if (!showing) return;
      if (e.key === 'Tab') return;                        // focus may move between the page's buttons
      e.stopPropagation(); e.preventDefault();
      if (!e.isTrusted || e.repeat) return;
      if (e.key === 'Enter') press();
      else if (book && e.key === 'ArrowLeft') step(-1);
      else if (book && e.key === 'ArrowRight') step(1);
      else if (book && e.key === 'Escape') close();
    }, true);
  }

  function draw(id) {
    var p = page(id);
    showing = id;
    title.textContent = p.title;
    words.textContent = p.text;
    pic.src = p.pic; pic.alt = p.alt;
    panel.setAttribute('aria-label', p.title);
    panel.dataset.page = id;
    nav.hidden = !book;
    if (book) {
      count.textContent = (book.at + 1) + ' / ' + book.list.length;
      backBtn.disabled = book.at === 0;
      nextBtn.disabled = book.at === book.list.length - 1;
    }
    view.hidden = false;
    shownAt = performance.now();
    gotIt.focus({ preventScroll: true });
  }
  // "Got it!": a first-time page is now seen (and the next one waiting shows); the book closes.
  function press() {
    if (performance.now() - shownAt < T.armMs) return;
    if (book) { close(); return; }
    seen()[showing] = true;
    GW.state.save(GW.game.s);
    GW.sfx.click();
    showing = null;
    if (queue.length) draw(queue.shift());
    else view.hidden = true;
    changed();
  }
  function step(d) {
    if (!book) return;
    var at = book.at + d;
    if (at < 0 || at >= book.list.length) return;
    book.at = at;
    GW.sfx.click();
    draw(book.list[at]);
  }
  function close() { GW.sfx.click(); book = null; showing = null; view.hidden = true; }

  // A page's moment came: it shows now (or after the pages already waiting) unless this save has seen it.
  function due(id) {
    if (!page(id) || seen()[id] || showing === id || queue.indexOf(id) >= 0) return;
    if (!view) build();
    if (showing) { if (!book) { queue.push(id); return; } book = null; }   // a page due while the book is open replaces the book
    draw(id);
  }
  // The How to Ship book: every page seen so far, in order, opened on the first.
  function openBook() {
    if (showing) return;
    var s = seen(), list = T.pages.filter(function (p) { return s[p.id]; }).map(function (p) { return p.id; });
    if (!list.length) return;
    if (!view) build();
    book = { list: list, at: 0 };
    if (!GW.game.s.tutorial.bookOpened) { GW.game.s.tutorial.bookOpened = true; GW.state.save(GW.game.s); }
    GW.sfx.click();
    draw(list[0]);
    changed();
  }

  return {
    due: due, openBook: openBook, oldSeen: oldSeen, bookNew: bookNew,
    onChange: function (fn) { listeners.push(fn); },
    isOpen: function () { return !!showing; },
    // What shows: the page id, whether it is the book, and the pages waiting (for tests and screenshots).
    current: function () { return showing; }, inBook: function () { return !!book; },
    waiting: function () { return queue.slice(); },
    seenList: function () { var s = seen(); return T.pages.filter(function (p) { return s[p.id]; }).map(function (p) { return p.id; }); }
  };
})();
