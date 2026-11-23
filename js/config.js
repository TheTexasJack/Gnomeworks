/* Gnomeworks tuning file.
   Almost every number that shapes the game lives here.
   Change a value, reload the page, done.  Bump GW.VERSION on every change. */
window.GW = window.GW || {};

GW.VERSION = '0.2.0-draft.86';

GW.CONFIG = {
  // Shop branding.  Leave logo null until the shop's new logo is final.
  branding: { shopName: 'The Stoned Gnome', logo: null },

  // Bumping the season wipes every player's local save on their next visit.
  season: 1,
  saveKey: 'gnomeworks.save',
  autosaveSeconds: 10,

  offline: { maxHours: 8, efficiency: 1.0 },

  currency: { name: 'Cogs', icon: '⚙️' },

  // Hard ceiling for every running total.  JavaScript numbers break past about 1.8e308
  // (they turn into Infinity), so nothing is allowed to grow past this.
  maxNumber: 1e300,

  machine: {
    tickerItemsPerSec: 2,      // past this many items a second the next-item bar becomes a steady ticker
    baseClicksPerItem: 20,      // clicks for one full turn of the big gear (one item)
    minClicksPerItem: 3,
    maxVisualItemsPerSecond: 3, // extra items still count, they just skip the pop animation
    maxVisualDegPerSec: 540     // keeps the big gear readable at huge speeds
  },

  // Wide screens: when the space beside the machine is at least this wide (px), the
  // next-item gauge and the crew move into side rails next to it.
  layout: {
    railMinWidth: 100,
    // Height taken by the banner, view buttons, and gaps around the square machine.  The CSS uses the same numbers.
    machineChrome: 245,
    // Phones held sideways (landscape, short screens): a slim banner, so the machine gets more of the height.
    landscapeQuery: '(orientation: landscape) and (max-height: 540px)',
    landscapeChrome: 118,
  },

  // "Not the Cog, But You": each Wizard adds this much to every other gnome type, up to the cap.
  wizardAura: { perWizard: 0.01, cap: 0.5 },

  // Wild Magic event (unlocked by the Wild Magic upgrade).  Junk spins around the machine;
  // tap each one before it fizzles.  style: 'spin' (bare spinning emoji), 'whoosh' (emoji in a
  // purple swirl), 'storm' (whoosh, plus one golden cog-swirl bonus target).  ?wild=<style> overrides.
  wild: {
    style: 'storm', targets: 6, durationSeconds: 9, staggerSeconds: 1.2,
    secondsPerTarget: 8, bonusMultiplier: 3, allClearSeconds: 30,
    minSeconds: 120, maxSeconds: 300, wizardsPerHalving: 40, floorSeconds: 45
  },

  // Clone Attack (needs at least one Cloner).  Escaped clones snatch junk off the belt and
  // run the Shop Floor stairs.  Drag one into the vat to get the junk back.
  clones: {
    count: 4, stealShare: 0.10, wanderSeconds: 3, loops: 2, speed: 24, climbSpeed: 16, fallSpeed: 70,
    rescueSeconds: 10, waitForFloorSeconds: 20,
    minSeconds: 150, maxSeconds: 360, clonersPerHalving: 40, floorSeconds: 60,
    variants: ['normal', 'cyclops', 'goblin', 'twohead', 'slime', 'mushroom', 'crystal', 'cyborg', 'ghost', 'wolf'],
    height: 16,   // cqh on the wide floor (scaled by the layout's scale)
    // Paths are [x %, feet y %] points on each floor picture.  'f' marks a fall (drop straight down).
    paths: {
      wide: { start: [84, 80], loop: [[3, 80], [9.5, 56], [3.5, 55], [12.5, 29], [88, 29], [88, 55, 'f'], [90.5, 55], [97, 80], [84, 80]], exit: [[112, 80]], wander: [70, 92] },
      tall: { start: [84, 80], loop: [[4, 80], [13, 36], [87, 36], [87, 52, 'f'], [93, 52], [98, 80], [84, 80]], exit: [[112, 80]], wander: [68, 92] }
    }
  },

  // The Megagnome: one per player, events only.  He spends food automatically to help with
  // Clone Attack and Wild Magic.  Food comes from the crossbow hunt.
  mega: {
    cost: 100000000000, requires: { producer: 'cloner', oneTime: 'wiz_wild' },
    maxFood: 5, firstCrackSeconds: 4, helpEverySeconds: 2.5,
    huntCooldownSeconds: 600, bolts: 5, shotSeconds: 5, minShotTaps: 20,
    preySpeed: 16, speedUpPerHit: 1.15, boltFlightSeconds: 0.28,
    bossChance: 0.15, bossHits: 3, bossFood: 3, trophyChance: 0.25, trophyPity: 4,
    // Prey: img in assets/mega, which way the picture faces, burst color, size (1 = normal; smaller is harder to hit).
    prey: [
      { id: 'cockatrice', face: 1, burst: 'yellow' }, { id: 'boar', face: 1, burst: 'red' },
      { id: 'octopanther', face: 1, burst: 'purple' }, { id: 'fishfrog', face: -1, burst: 'green' },
      { id: 'shroomturtle', face: 1, burst: 'green', size: 0.75 }, { id: 'wyvern', face: 1, burst: 'purple' },
      { id: 'elk', face: 1, burst: 'red', size: 0.85 }, { id: 'crystalizard', face: -1, burst: 'blue' }
    ],
    boss: { id: 'banana', face: 1, burst: 'white' }
  },

  // Secret game report: tap the bolt next to the version on the Info tab this many times.
  secretTaps: 10,

  // Views in swipe order (phones: swipe left for the next view, right for the previous).
  // 'shipping' counts only while shipping.enabled is true or the address has ?ship=1.
  views: ['machine', 'floor', 'shipping'],
  swipe: { minPixels: 60, maxMilliseconds: 600 },   // how far and how fast a swipe must be

  // The Packing Line's shipping room (layer 1a: the room and the door chain).  Hidden from players until
  // Nathan says otherwise: while enabled is false, the view exists only with ?ship=1 in the address.
  // Each layout has the closed room, its open twin (same size, only the door differs), and the chain:
  // x = the chain's center (% of room width), top (% of room height), h = chain height (% of room height),
  // hitW = width of the invisible tap area around the thin chain (% of room width), so a finger can find it.
  // doorway = the opening just inside the door frame, [x %, y %] corners clockwise from top left.  Traced from
  // where the closed and open twins differ (both themes agree within 1%).  The truck shows only inside it,
  // unless the layout has a truckClip (wide: the truck backs into the room).
  // roller (optional) = an outline of the room art drawn again in front of the chain, so the chain's top hides
  // behind it.
  // truck: h = height (% of room height), top (% of room height), xFrom / xTo = its left edge (% of room width)
  // before it slides in and where it stops.  Tall: top is set so the truck rests on the doorway's floor line
  // (its lowest point touches the line, nothing hangs below).
  // driver: h (% of room height), from = [x of his center %, y of his feet %] at the doorway, fromScale = his
  // size there (farther away), at = [x %, y %] where his feet stand while he waits, full size (grumpy pose,
  // arms crossed).  Depth rule: whatever he stands in front of, his feet sit lower on screen than its floor
  // contact.  Wide: in front of the parked truck, feet 4% lower than its lowest point (76.0), clear of the bench,
  // the chain (1.7% gap), and the conveyor.
  // Tall: in front of the bench's right end, feet 3.3% lower than its front legs (Nathan, 2026-11-22).
  // Sizes on phones match the wide room's proportions: truck height / doorway height = 1.121 in both,
  // driver height / bench height = 2.01 in both (bench = front top edge to the foot of the legs).
  shipping: {
    enabled: false,
    testParam: 'ship',                      // ?ship=1 shows the view for testing
    tallQuery: '(max-width: 720px)',        // same breakpoint as the Shop Floor
    layouts: {
      wide: {
        closed: 'assets/packing/room_wide.webp', open: 'assets/packing/room_wide_open.webp', aspect: '1600 / 901',
        // The chain hangs right of the doorway, in front of the truck's wheel (Nathan's mock 2).  Its top end sits
        // behind the roller's gear cap (roller, below) through the whole pull and bounce, so the spot where it
        // meets the roller never moves: top 12.2 + 7% of h = 16.3 stays above the cap's bottom (16.9 at the
        // chain), and 12.2 - 30% of the pull = 11.0 stays below its top (9).  Handle bottom at 70.
        chain: { x: 93.45, top: 12.2, h: 57.8, hitW: 4 },
        // roller = the outline of the roller's gear cap, drawn again in front of the chain.
        roller: [[90.06, 11.65], [90.63, 9.99], [91.88, 9.1], [93.75, 8.88], [94.5, 9.1], [94.5, 16.87], [93.44, 17.54],
          [91.56, 17.65], [90.5, 16.65], [90.06, 14.43]],
        doorway: [[80.3, 26.2], [92.2, 20.3], [92.4, 76.9], [80.3, 68.02]],
        // truckClip = where the truck may draw (replaces the doorway clip when present).  The truck backs into the
        // room (Nathan's mock 1): it draws over the left jamb, the wall, and the floor, and only the header (the
        // opening's top line) and the right jamb (its inner edge, measured Day and Night) stay in front of it.
        truckClip: [[-10, -10], [80.3, -10], [80.3, 26.2], [93.2, 19.8], [93.0, 110], [-10, 110]],
        // Size and stopping place measured from Nathan's mock 1 (both mocks agree to the pixel).
        truck: { h: 54.04, top: 22.14, xFrom: 93, xTo: 74.24 },
        driver: {
          h: 32, from: [86.5, 74], fromScale: 0.8, at: [86.5, 80]
        },
        // board = where the work orders pin, inside the lower left parchment frame (its parchment runs x 31.6 to
        // 50.9, y 40.4 to 54.5, Day and Night): [x, y, w, h] in % of the room.
        board: [32.3, 41.1, 17.9, 12.7],
        // Packing (1d), all in % of the room.  conveyor = the painted belt's tap area [x, y, w, h].  box = the open box
        // on the bench: x is its center, y the bottom of its square canvas (the art's own shadow margin sits below the
        // box), h its height.  It stands right of the order board, clear of the slips.  tray = the stamp tray beside
        // it on the bench (x center, y bottom, w width).  stack = where packed boxes go, on the floor at the truck's
        // rear (x, y, h as for box), and spots = each packed box's place in the stack, in box widths and heights
        // from (x, y), with a small tilt in degrees.  menu = the item menu [x, y, w, h]: the wide room is short, so it
        // covers the left half (the desk and the board) and leaves the box, the tray, and the stack in view.
        conveyor: [0, 84, 84, 16],
        box: { x: 57, y: 66.4, h: 24 },
        tray: { x: 67.6, y: 63.4, w: 6.2 },
        stack: { x: 77.6, y: 84, h: 16, spots: [[-0.36, 0, -3], [0.36, 0, 2], [0, -0.66, -1]] },
        menu: [1, 2, 50, 95],
        // Hand-off (1e), in % of the room.  finishTag = the "Pull to ship!" tag beside the chain's handle: [x of its
        // right edge, y of its center, width].  stonks = the STONKS screen's black glass [x, y, w, h], measured from
        // the Day room (x 855 to 1169, y 155 to 301 of 1600 x 901; the Night twin lines up), inset for its round corners.
        finishTag: [91.6, 66, 9],
        stonks: [54.2, 18.6, 18.2, 13.6]
      },
      tall: {
        closed: 'assets/packing/room_tall.webp', open: 'assets/packing/room_tall_open.webp', aspect: '900 / 1599',
        // The chain hangs right of the doorway, in front of the truck's wheel (Nathan's phone mock), centered on the
        // hub of the roller's gear cap.  Its top end stays behind the cap through the whole pull and bounce:
        // top 18.5 + 7% of h = 21.65 stays above the cap's bottom (22.2 at the chain), and the bounce (17.55)
        // stays inside the roller outline (top 16.5).  Handle bottom at 63.5, as in the mock.
        chain: { x: 95.0, top: 18.5, h: 45, hitW: 9 },
        // roller = the outline of the roller's gear cap (and the dark housing above it), drawn again in front of the chain.
        roller: [[90.42, 20.0], [91.1, 18.84], [92.2, 18.14], [92.6, 16.5], [96.73, 16.5], [96.73, 22.2], [95.56, 22.3],
          [93.33, 22.5], [91.67, 22.33], [90.56, 21.26]],
        doorway: [[79.3, 28.9], [94.1, 24.8], [93.8, 67.1], [78.6, 62.6]],
        // The truck backs into the room (Nathan's phone mock): only the header (the opening's top line) and the right
        // jamb (its inner edge, measured row by row Day and Night: 95.0 to 95.33) stay in front of it.
        truckClip: [[-10, -10], [79.3, -10], [79.3, 28.9], [95.3, 24.47], [95.0, 110], [-10, 110]],
        // Size and stopping place measured from Nathan's phone mock.
        truck: { h: 28.48, top: 37.99, xFrom: 95, xTo: 63.7 },
        // In front of the bench's right end, where the mock has him, at full size (the 1b.2 ratio).
        driver: {
          h: 23, from: [86, 65], fromScale: 0.8, at: [83.7, 85.1]
        },
        // board = inside the parchment frame under the STONKS screen (its parchment runs x 31.8 to 69.7, y 38.6 to
        // 48.3).  The parked truck covers the frame from x 63.7, so the board ends at 62 and every slip, stamp
        // corner included, sits clear of the truck (1c-2 addendum).
        board: [32.4, 39.2, 29.6, 8.5],
        // Packing (1d), as in the wide room.  The box sits on the bench left of center, the tray beside it, and the
        // stack on the floor at the bench's right end, in front of the driver (the box has the stage).  The menu
        // covers the top of the room, so the board and the box stay in view under it.
        conveyor: [0, 87, 100, 13],
        box: { x: 38, y: 71.4, h: 17 },
        tray: { x: 63.5, y: 69.6, w: 15 },
        stack: { x: 78, y: 92, h: 11.5, spots: [[-0.36, 0, -3], [0.36, 0, 2], [0, -0.66, -1]] },
        menu: [2, 1, 96, 37],
        // Hand-off (1e), as in the wide room.  stonks: the glass runs x 282 to 630, y 414 to 571 of 900 x 1599.
        finishTag: [93.2, 60.5, 19],
        stonks: [32.6, 26.6, 36.2, 8.5]
      }
    },
    // Layer 1 has one region: Gnomerica's truck and driver (he waits grumpy; drivers always arrive grumpy).
    truck: { img: 'assets/packing/truck_gnomerica.webp' },
    // happy = the thumbs-up pose for a perfect shift (1e), the same 400 px canvas height so the baseline holds.
    // shiftX moves it sideways (% of its own width) so its feet stand where the grumpy pose's do: the happy
    // canvas is wider (the thumb), and its feet sit 9 px right of its center.  happyMs = how long he beams
    // before he walks out (he leaves smiling).
    driver: {
      img: 'assets/packing/driver_gnomerica_grumpy.webp',
      happy: { img: 'assets/packing/driver_gnomerica_happy.webp', shiftX: -3.33 },
      happyMs: 1300
    },
    // A trip: the door opens, the truck backs in and settles, then the driver walks in.  Closing reverses it,
    // and the door shows closed once the truck is gone.  Taps on the chain mid-trip are ignored.
    trip: {
      truckInMs: 1600,      // the truck sliding in from the right
      settleMs: 450,        // the small settle bounce when it stops
      settle: 1.2,          // how far it dips, as a share of its height (%)
      walkDelayMs: 150,     // pause between the truck stopping and the driver setting off
      walkMs: 1400,         // the driver walking in (and out)
      stepMs: 280,          // one step of his walking bob
      bob: 3,               // how high each step lifts him, as a share of his height (%)
      truckOutMs: 1300,     // the truck sliding away
      closeDelayMs: 200     // after the truck is gone, then the door shows closed
    },
    chain: {
      img: 'assets/packing/chain.webp',
      pullPercent: 7,       // how far a tap pulls the chain down, as a share of its own height
      pullMs: 450           // the pull-down and bounce back
    },
    // Work orders (layer 1c-2).  When the driver finishes walking in, the board gets up to `count` orders.  Each
    // picks a random place in `region` from GW.DESTINATIONS, then one item from that place's buys that the shelf
    // holds more than `keep` of (the last one is the display copy and never ships).  Gnomerica orders ask for
    // `perOrder` = 1 item (the first tier).  Every order asks for a different item; with repeatItems false, a
    // board with fewer different items to ask for shows fewer slips (one drag ships a whole pile, so a repeated
    // item could not be packed twice).  Orders last one trip: not saved, cleared when the door closes.
    orders: {
      region: 'gnomerica',
      count: 3,
      perOrder: 1,
      keep: 1,
      repeatItems: false,
      emptyText: 'Nothing to ship yet.  Make more junk!'    // draft wording (Claudia), shown when no order can be made
    },
    // A work order slip: Nathan's parchment with live text on top, laid out from the approved mock
    // (art-masters/packing-line/06-work-order/work_order_mock_v0.1.png).  aspect = the paper's width / height.
    // On the board the slips sit side by side, `gap` apart (% of the board's width), as tall as the board allows.
    // stamp = the region stamp's width as % of the slip's width: larger on the board so the stamp corner reads
    // at small size, the mock's size when open.  openSize = an open slip's largest height and width (% of the room's).
    // nightBrightness dims the paper to match the Night room's own parchment.
    slip: {
      paper: 'assets/packing/work_order_paper.webp',
      grip: 'assets/packing/grip-mark-v1.0.svg',
      stampImg: 'assets/packing/stamp_{region}.webp',   // {region} = the region's id
      aspect: 566 / 800,
      gap: 3,
      stamp: { board: 27, open: 20 },
      openSize: 92,
      nightBrightness: 0.88
    },
    // Packing (layer 1d).  Orders are packed one at a time, left to right; the box on the bench belongs to the
    // active order.  A tap on the conveyor opens the item menu (the junk `groups`, in shelf order).  Dragging a tile
    // with more than orders.keep on the shelf onto the open box puts the whole pile in, down to the display copy.
    // Nothing ships and the shelf does not change until the hand-off (1e).
    pack: {
      groups: ['laundry', 'bathroom', 'office', 'workshop', 'kitchen', 'toys', 'inventions', 'random'],
      stamps: ['gnomerica'],              // the region stamps the player has (layer 1: Gnomerica's only)
      boxOpen: 'assets/packing/box_plain_open.webp',
      boxClosed: 'assets/packing/box_plain_closed.webp',
      // On the box's front face, in % of its square canvas: label = [x center, y center, width] (the item's picture,
      // shown only while the box is open and filled), mark = the stamp once stamped [x center, y center, width,
      // tilt in degrees], drawn solid and on top of the box, the stack, the tray, and the driver.
      // The mark sits in the postage corner (box face v0.3, docs/DESIGNS.md): the box art fills x 55 to 345 and
      // y 53 to 346 of the 400 x 400 canvas, its front face runs 3 to 97% across and 21 to 97% down that art, and
      // the stamp (10% of the box's width, straight) sits 4.5% of the box's width in from the face's top and right.
      label: [48, 69, 62],
      mark: [77.2, 36.4, 7.25, 0],
      // The item menu's frame: the approved supply drawer (05a), drawn as a nine-slice so the brass corners keep
      // their shape, the wood sides stretch, and the parchment fills the middle.  slice = the corner size in the
      // game copy's pixels (512 x 768; 62 = 124 in the 1024 x 1536 master, the brass corner and the parchment's
      // round corner), border = how wide the frame draws on screen per layout, in px.
      menuFrame: { img: 'assets/packing/menu_frame.webp', slice: 62, border: { wide: 34, tall: 24 } },
      // The menu on touch: a finger that holds still holdMs on a tile picks it up; one that moves slopPx first
      // scrolls the menu, and becomes a drag of the tile it pressed once it leaves the menu.  A mouse picks a tile
      // up after slopPx.  dropPad widens the box's drop area (% of its size on each side).
      holdMs: 220,
      slopPx: 8,
      dropPad: 12,
      stampMs: 260,         // the stamp coming down
      thumpMs: 220,         // the box's little jolt as it lands
      setAsideDelayMs: 450, // stamped, then it moves to the stack
      slideMs: 650,         // the box sliding to the stack
      nextMs: 300           // the next order's box appearing
    },
    // Scoring a hand-off (1e).  Each order with the ordered item and the right region stamp is right and adds
    // `right` Stonks for its region (set by region difficulty, never by pile size); any other order subtracts
    // `wrong`.  Stonks never go below 0.  Draft amounts (Claude Code, 1e); Gnomerica is the first, easiest region.
    // reasons = the report card's words for each kind of miss.  A closed box with an item ships even without a
    // stamp ("No stamp"); an open or empty box does not ship ("Not packed").
    score: {
      regions: { gnomerica: { right: 10, wrong: 3 } },
      reasons: { item: 'Wrong item', noStamp: 'No stamp', wrongStamp: 'Wrong stamp', notPacked: 'Not packed' }
    },
    // When every order has a stamped box, the chain glows and sways gently and a brass tag by its handle shows
    // `text` until it is pulled (draft wording, Claudia).  swayDeg = how far it swings each way, swayMs = one swing.
    // Reduced motion: the glow and the tag, no sway.
    finish: { text: 'Pull to ship!', swayDeg: 1.6, swayMs: 1400 },
    // The report card (09), shown over the room once the door has closed.  aspect = the paper's width / height;
    // openSize = its largest height and width (% of the room's), as for an open slip.  Places on the card, in %
    // of the card, measured from the master (1199 x 1312): rows = each row's top and bottom, box = the tick box's
    // center x and width, text = the words' left and right, pic = the dashed picture frame's left and right,
    // total = the band under the last row (its center y).  font = each line's size in cqw (1% of the card's width):
    // town, item, and reason each stay on one line, and a line too long for the row shrinks its own text to fit,
    // never below its `fontMin`, and only past that ends with "..." (1e.1).  The three lines fill about 85% of a row.
    card: {
      img: 'assets/packing/report_card.webp',
      aspect: 822 / 900,
      openSize: 94,
      rows: [[26.3, 44.4], [45.0, 63.6], [64.3, 82.5]],
      box: [13.6, 8.8],
      text: [22.4, 62],
      pic: [63.1, 92.0],
      total: 86.3,
      font: { town: 5.2, item: 4.2, why: 4.2 },
      fontMin: { town: 3.4, item: 3.2, why: 3.2 },
      fitSlack: 0.97        // shrink to this share of the exact fit, so rounding never leaves a sliver cut off
    },
    // The GRIP line on the STONKS screen: our Stonks and a line of the last `history` shift totals.  It moves
    // when the report card closes, counting up over tickMs.
    // The saved shifts spread across the glass's full width, first to last; a single shift draws a flat line
    // across at its value, with the dot at its right end (1f).
    ticker: { label: 'GRIP', history: 10, tickMs: 900, color: '#46f06a' },
    // The leave warning (1f): tapping The Machine or Shop Floor while the driver waits with orders on the board
    // shows this over the room.  `go` runs the same hand-off as pulling the chain, and the view switches once the
    // report card closes.  Draft wording (Claudia).  width = the pop-up's width in % of the room, per layout;
    // slice = the parchment's edge in the slip paper's pixels (566 x 800), drawn `edge` px wide on screen.
    leave: {
      title: 'Leave the Packing Line?',
      text: 'This ends the day and sends the truck off as it is.',
      stay: 'Stay',
      go: 'Send it off',
      width: { wide: 62, tall: 86 },
      slice: 60,
      edge: { wide: 26, tall: 20 }
    }
  },

  tap: {
    maxTapsPerSecond: 12,       // human cap; extra taps are ignored (fast humans hold 6 to 10 a second)
    // Auto clicker check: people tap with uneven timing, auto clickers tap like a metronome.  Over the last
    // `window` taps, if tapping is at least `minRate` a second and the typical distance from the middle gap
    // is under `maxSpread` (as a share of the middle gap, so one browser stutter doesn't count), the gnomes
    // go on strike: taps do nothing until the timing passes `humanSpread` or the gear rests `restSeconds`.
    // Taking a Break: after `workSeconds` of nonstop gear tapping (no pause longer than `pauseSeconds`),
    // the gnomes take a break.  Taps do nothing until the gear has been left alone for `seconds`;
    // tapping during the break starts the timer over, so an auto clicker stays on break.
    break: { workSeconds: 60, pauseSeconds: 2, seconds: 5 },
    robot: {
      window: 40, minRate: 4, maxSpread: 0.015, humanSpread: 0.03, restSeconds: 3,
      lines: [
        'Beep boop?  The gnomes spotted a robot on the gear and went on strike.',
        'Gnome Union Rule #1: no robots on the gear.  Taps paused until a real hand shows up.',
        'The Tiny Gnome says your finger is suspiciously perfect.',
        'Nice try, TNP Corp.  Robots don\'t get cogs here.',
        'The gear refuses to be clicked by a toaster.'
      ]
    },
    activeWindowSeconds: 30,    // tapping the gear this recently makes popups "hot" (Legendary possible)
    labelFadeSeconds: 60        // the word TAP under the little gear fades away this long after the page opens (0 = never)
  },

  // Rare popups on the side of the machine.  Only a real tap can claim them.
  popup: {
    minSeconds: 45,
    maxSeconds: 120,
    lifetimeSeconds: 20,
    legendaryChance: 0.09,      // chance a claimed HOT popup is a Legendary (only if you have been tapping)
    superRareChance: 0.45,       // chance it is a Super Rare (otherwise a Lucky Sprocket)
    pityCount: 6,               // guarantees a Super Rare or better after this many Sprockets
    legendaryPity: 25,          // guarantees a Legendary on a hot popup after this many popups without one
    luckySprocketSeconds: 60    // Lucky Sprocket pays this many seconds of production (min 50 taps worth)
  },

  // Item rarity tiers for the machine.  bonus = extra cogs as a fraction of one turn.
  tiers: {
    common:    { label: 'Common',     weight: 70, bonus: 0.10, color: '#c9b79c' },
    uncommon:  { label: 'Uncommon',   weight: 22, bonus: 0.50, color: '#7fc97f' },
    rare:      { label: 'Rare',       weight: 12, bonus: 2.00, color: '#6fa8ff' },
    superrare: { label: 'Super Rare', weight: 0,  bonus: 0,    color: '#c77dff' },  // popups only
    legendary: { label: 'Legendary',  weight: 0,  bonus: 0,    color: '#ffb703' }   // popups only
  },

  // Item groups for the shelf, in display order.
  groups: [
    { id: "treasures", name: "Legendary Treasures" },
    { id: "monsters", name: "Tiny Monsters", layout: 'families', variants: ['normal', 'glowing', 'goopy', 'evil'] },
    { id: 'plops', name: 'Number Twos', layout: 'families', variants: ['normal', 'steam', 'prize', 'golden'] },
    { id: "laundry", name: "Laundry & Clothing" },
    { id: "bathroom", name: "Bathroom Disasters" },
    { id: "office", name: "Office Nonsense" },
    { id: "workshop", name: "Workshop Junk" },
    { id: "kitchen", name: "Kitchen Experiments" },
    { id: "toys", name: "Toys & Curiosities" },
    { id: "inventions", name: "Questionable Inventions" },
    { id: "random", name: "Absolutely Random" },
  ],

  // Emoji items use the bundled Twemoji art in assets/emoji.  img paths override it.
  items: [
    // Laundry & Clothing
    { id: "socks", name: "Socks", group: "laundry", tier: "common", emoji: "🧦" },
    { id: "underpants", name: "Underpants", group: "laundry", tier: "common", emoji: "🩲" },
    { id: "shorts", name: "Shorts", group: "laundry", tier: "common", emoji: "🩳" },
    { id: "sneaker", name: "Sneaker", group: "laundry", tier: "common", emoji: "👟" },
    { id: "boot", name: "Work Boot", group: "laundry", tier: "uncommon", emoji: "🥾" },
    { id: "gloves", name: "Gloves", group: "laundry", tier: "uncommon", emoji: "🧤" },
    { id: "scarf", name: "Scarf", group: "laundry", tier: "common", emoji: "🧣" },
    { id: "necktie", name: "Necktie", group: "laundry", tier: "common", emoji: "👔" },
    { id: "flipflop", name: "Flip-Flop", group: "laundry", tier: "common", emoji: "🩴" },
    { id: "cap", name: "Ball Cap", group: "laundry", tier: "common", emoji: "🧢" },
    { id: "jeans", name: "Jeans", group: "laundry", tier: "common", emoji: "👖" },
    { id: "coat", name: "Coat", group: "laundry", tier: "common", emoji: "🧥" },
    // Bathroom Disasters
    { id: "toilet", name: "Toilet", group: "bathroom", tier: "common", emoji: "🚽" },
    { id: "poop_knife", name: "Poop Knife", group: "bathroom", tier: "uncommon", emoji: "🔪" },
    { id: "plunger", name: "Plunger", group: "bathroom", tier: "common", emoji: "🪠" },
    { id: "tp", name: "Toilet Paper", group: "bathroom", tier: "common", emoji: "🧻" },
    { id: "soap", name: "Soap", group: "bathroom", tier: "common", emoji: "🧼" },
    { id: "sponge", name: "Sponge", group: "bathroom", tier: "common", emoji: "🧽" },
    { id: "toothbrush", name: "Toothbrush", group: "bathroom", tier: "common", emoji: "🪥" },
    { id: "bucket", name: "Bucket", group: "bathroom", tier: "common", emoji: "🪣" },
    { id: "bathtub", name: "Bathtub", group: "bathroom", tier: "uncommon", emoji: "🛁" },
    { id: "lotion", name: "Lotion", group: "bathroom", tier: "common", emoji: "🧴" },
    { id: "razor", name: "Razor", group: "bathroom", tier: "common", emoji: "🪒" },
    { id: "comb", name: "Hair Pick", group: "bathroom", tier: "common", emoji: "🪮" },
    // Office Nonsense
    { id: "pencil", name: "Pencil", group: "office", tier: "common", emoji: "✏️" },
    { id: "pen", name: "Pen", group: "office", tier: "common", emoji: "🖊️" },
    { id: "crayon", name: "Crayon", group: "office", tier: "common", emoji: "🖍️" },
    { id: "paperclip", name: "Paperclip", group: "office", tier: "common", emoji: "📎" },
    { id: "pushpin", name: "Pushpin", group: "office", tier: "common", emoji: "📌" },
    { id: "scissors", name: "Scissors", group: "office", tier: "uncommon", emoji: "✂️" },
    { id: "ruler", name: "Ruler", group: "office", tier: "common", emoji: "📏" },
    { id: "triangle", name: "Triangle Ruler", group: "office", tier: "common", emoji: "📐" },
    { id: "books", name: "Stack of Books", group: "office", tier: "uncommon", emoji: "📚" },
    { id: "wastebasket", name: "Wastebasket", group: "office", tier: "common", emoji: "🗑️" },
    { id: "clipboard", name: "Clipboard", group: "office", tier: "common", emoji: "📋" },
    { id: "printer", name: "Printer", group: "office", tier: "common", emoji: "🖨️" },
    // Workshop Junk
    { id: "cog", name: "Spare Cog", group: "workshop", tier: "common", emoji: "⚙️" },
    { id: "bolt", name: "Nut and Bolt", group: "workshop", tier: "common", emoji: "🔩" },
    { id: "wrench", name: "Wrench", group: "workshop", tier: "common", emoji: "🔧" },
    { id: "hammer", name: "Hammer", group: "workshop", tier: "common", emoji: "🔨" },
    { id: "screwdriver", name: "Screwdriver", group: "workshop", tier: "common", emoji: "🪛" },
    { id: "saw", name: "Saw", group: "workshop", tier: "common", emoji: "🪚" },
    { id: "magnet", name: "Magnet", group: "workshop", tier: "common", emoji: "🧲" },
    { id: "toolbox", name: "Toolbox", group: "workshop", tier: "uncommon", emoji: "🧰" },
    { id: "brick", name: "Brick", group: "workshop", tier: "common", emoji: "🧱" },
    { id: "ladder", name: "Ladder", group: "workshop", tier: "uncommon", emoji: "🪜" },
    { id: "clamp", name: "Clamp", group: "workshop", tier: "common", emoji: "🗜️" },
    { id: "hook", name: "Hook", group: "workshop", tier: "common", emoji: "🪝" },
    // Kitchen Experiments
    { id: "spoon", name: "Spoon", group: "kitchen", tier: "common", emoji: "🥄" },
    { id: "beans", name: "Can o' Beans", group: "kitchen", tier: "common", emoji: "🥫" },
    { id: "salt", name: "Salt Shaker", group: "kitchen", tier: "common", emoji: "🧂" },
    { id: "teapot", name: "Teapot", group: "kitchen", tier: "uncommon", emoji: "🫖" },
    { id: "bowl", name: "Bowl", group: "kitchen", tier: "common", emoji: "🥣" },
    { id: "fork_knife", name: "Fork and Knife", group: "kitchen", tier: "common", emoji: "🍴" },
    { id: "potato", name: "Potato", group: "kitchen", tier: "common", emoji: "🥔" },
    { id: "cheese", name: "Wedge of Cheese", group: "kitchen", tier: "uncommon", emoji: "🧀" },
    { id: "pretzel", name: "Pretzel", group: "kitchen", tier: "common", emoji: "🥨" },
    { id: "banana", name: "Banana", group: "kitchen", tier: "common", emoji: "🍌" },
    { id: "frying_pan", name: "Frying Pan", group: "kitchen", tier: "common", emoji: "🍳" },
    { id: "jar", name: "Jar", group: "kitchen", tier: "common", emoji: "🫙" },
    // Toys & Curiosities
    { id: "dice", name: "Lucky Die", group: "toys", tier: "common", emoji: "🎲" },
    { id: "puzzle", name: "Puzzle Piece", group: "toys", tier: "common", emoji: "🧩" },
    { id: "yoyo", name: "Yo-Yo", group: "toys", tier: "common", emoji: "🪀" },
    { id: "kite", name: "Kite", group: "toys", tier: "common", emoji: "🪁" },
    { id: "dart", name: "Dartboard", group: "toys", tier: "common", emoji: "🎯" },
    { id: "balloon", name: "Balloon", group: "toys", tier: "common", emoji: "🎈" },
    { id: "eightball", name: "Magic 8-Ball", group: "toys", tier: "uncommon", emoji: "🎱" },
    { id: "maracas", name: "Maracas", group: "toys", tier: "common", emoji: "🪇" },
    { id: "magic_wand", name: "Magic Wand", group: "toys", tier: "uncommon", emoji: "🪄" },
    { id: "fishing_rod", name: "Fishing Rod", group: "toys", tier: "common", emoji: "🎣" },
    { id: "teddy", name: "Teddy Bear", group: "toys", tier: "common", emoji: "🧸" },
    { id: "boomerang", name: "Boomerang", group: "toys", tier: "common", emoji: "🪃" },
    // Questionable Inventions
    { id: "test_tube", name: "Test Tube", group: "inventions", tier: "common", emoji: "🧪" },
    { id: "petri", name: "Petri Dish", group: "inventions", tier: "common", emoji: "🧫" },
    { id: "battery", name: "Battery", group: "inventions", tier: "common", emoji: "🔋" },
    { id: "dead_battery", name: "Dead Battery", group: "inventions", tier: "common", emoji: "🪫" },
    { id: "lightbulb", name: "Lightbulb", group: "inventions", tier: "common", emoji: "💡" },
    { id: "plug", name: "Plug", group: "inventions", tier: "common", emoji: "🔌" },
    { id: "extinguisher", name: "Fire Extinguisher", group: "inventions", tier: "uncommon", emoji: "🧯" },
    { id: "firecracker", name: "Firecracker", group: "inventions", tier: "uncommon", emoji: "🧨" },
    { id: "alarm_clock", name: "Alarm Clock", group: "inventions", tier: "common", emoji: "⏰" },
    { id: "control_knobs", name: "Control Knobs", group: "inventions", tier: "common", emoji: "🎛️" },
    { id: "microscope", name: "Microscope", group: "inventions", tier: "common", emoji: "🔬" },
    { id: "dish", name: "Satellite Dish", group: "inventions", tier: "common", emoji: "📡" },
    // Absolutely Random
    { id: "mousetrap", name: "Mousetrap", group: "random", tier: "common", emoji: "🪤" },
    { id: "log", name: "Log", group: "random", tier: "common", emoji: "🪵" },
    { id: "chair", name: "Chair", group: "random", tier: "common", emoji: "🪑" },
    { id: "plant", name: "Potted Plant", group: "random", tier: "common", emoji: "🪴" },
    { id: "candle", name: "Candle", group: "random", tier: "uncommon", emoji: "🕯️" },
    { id: "broom", name: "Broom", group: "random", tier: "common", emoji: "🧹" },
    { id: "basket", name: "Laundry Basket", group: "random", tier: "common", emoji: "🧺" },
    { id: "box", name: "Cardboard Box", group: "random", tier: "common", emoji: "📦" },
    { id: "flute", name: "Flute", group: "random", tier: "common", emoji: "🪈" },
    { id: "amphora", name: "Old Vase", group: "random", tier: "uncommon", emoji: "🏺" },
    { id: "pet_rock", name: "Pet Rock", group: "random", tier: "common", emoji: "🪨" },
    { id: "cart", name: "Shopping Cart", group: "random", tier: "common", emoji: "🛒" },
    // Tiny Monsters.  One family per row on the shelf: normal, glowing, goopy, evil.
    // Normal ones come out of the machine (Rare).  The rest only come from popups.
    { id: 'rabbit_normal', name: 'Tickhop', group: 'monsters', family: 'rabbit', variant: 'normal', tier: 'rare', img: 'assets/monsters/rabbit_normal.webp' },
    { id: 'rabbit_glowing', name: 'Glowhop', group: 'monsters', family: 'rabbit', variant: 'glowing', tier: 'superrare', img: 'assets/monsters/rabbit_glowing.webp' },
    { id: 'rabbit_goopy', name: 'Goophop', group: 'monsters', family: 'rabbit', variant: 'goopy', tier: 'superrare', img: 'assets/monsters/rabbit_goopy.webp' },
    { id: 'rabbit_evil', name: 'Hexhop', group: 'monsters', family: 'rabbit', variant: 'evil', tier: 'legendary', img: 'assets/monsters/rabbit_evil.webp' },
    { id: 'owl_normal', name: 'Hootgear', group: 'monsters', family: 'owl', variant: 'normal', tier: 'rare', img: 'assets/monsters/owl_normal.webp' },
    { id: 'owl_glowing', name: 'Glowl', group: 'monsters', family: 'owl', variant: 'glowing', tier: 'superrare', img: 'assets/monsters/owl_glowing.webp' },
    { id: 'owl_goopy', name: 'Goowl', group: 'monsters', family: 'owl', variant: 'goopy', tier: 'superrare', img: 'assets/monsters/owl_goopy.webp' },
    { id: 'owl_evil', name: 'Scowl', group: 'monsters', family: 'owl', variant: 'evil', tier: 'legendary', img: 'assets/monsters/owl_evil.webp' },
    { id: 'lizard_normal', name: 'Magmander', group: 'monsters', family: 'lizard', variant: 'normal', tier: 'rare', img: 'assets/monsters/lizard_normal.webp' },
    { id: 'lizard_glowing', name: 'Glimmander', group: 'monsters', family: 'lizard', variant: 'glowing', tier: 'superrare', img: 'assets/monsters/lizard_glowing.webp' },
    { id: 'lizard_goopy', name: 'Goomander', group: 'monsters', family: 'lizard', variant: 'goopy', tier: 'superrare', img: 'assets/monsters/lizard_goopy.webp' },
    { id: 'lizard_evil', name: 'Doomander', group: 'monsters', family: 'lizard', variant: 'evil', tier: 'legendary', img: 'assets/monsters/lizard_evil.webp' },
    { id: 'turtle_normal', name: 'Shroomtle', group: 'monsters', family: 'turtle', variant: 'normal', tier: 'rare', img: 'assets/monsters/turtle_normal.webp' },
    { id: 'turtle_glowing', name: 'Runetle', group: 'monsters', family: 'turtle', variant: 'glowing', tier: 'superrare', img: 'assets/monsters/turtle_glowing.webp' },
    { id: 'turtle_goopy', name: 'Slimetle', group: 'monsters', family: 'turtle', variant: 'goopy', tier: 'superrare', img: 'assets/monsters/turtle_goopy.webp' },
    { id: 'turtle_evil', name: 'Grimtle', group: 'monsters', family: 'turtle', variant: 'evil', tier: 'legendary', img: 'assets/monsters/turtle_evil.webp' },
    { id: 'fox_normal', name: 'Zapfox', group: 'monsters', family: 'fox', variant: 'normal', tier: 'rare', img: 'assets/monsters/fox_normal.webp' },
    { id: 'fox_glowing', name: 'Lumifox', group: 'monsters', family: 'fox', variant: 'glowing', tier: 'superrare', img: 'assets/monsters/fox_glowing.webp' },
    { id: 'fox_goopy', name: 'Goofox', group: 'monsters', family: 'fox', variant: 'goopy', tier: 'superrare', img: 'assets/monsters/fox_goopy.webp' },
    { id: 'fox_evil', name: 'Snarlfox', group: 'monsters', family: 'fox', variant: 'evil', tier: 'legendary', img: 'assets/monsters/fox_evil.webp' },
    { id: 'mouse_normal', name: 'Potamice', group: 'monsters', family: 'mouse', variant: 'normal', tier: 'rare', img: 'assets/monsters/mouse_normal.webp' },
    { id: 'mouse_glowing', name: 'Lumimouse', group: 'monsters', family: 'mouse', variant: 'glowing', tier: 'superrare', img: 'assets/monsters/mouse_glowing.webp' },
    { id: 'mouse_goopy', name: 'Goopamice', group: 'monsters', family: 'mouse', variant: 'goopy', tier: 'superrare', img: 'assets/monsters/mouse_goopy.webp' },
    { id: 'mouse_evil', name: 'Hexamice', group: 'monsters', family: 'mouse', variant: 'evil', tier: 'legendary', img: 'assets/monsters/mouse_evil.webp' },
    { id: 'fluffbat_normal', name: 'Fluffbat', group: 'monsters', family: 'fluffbat', variant: 'normal', tier: 'rare', img: 'assets/monsters/fluffbat_normal.webp' },
    { id: 'fluffbat_glowing', name: 'Glowbat', group: 'monsters', family: 'fluffbat', variant: 'glowing', tier: 'superrare', img: 'assets/monsters/fluffbat_glowing.webp' },
    { id: 'fluffbat_goopy', name: 'Gloopbat', group: 'monsters', family: 'fluffbat', variant: 'goopy', tier: 'superrare', img: 'assets/monsters/fluffbat_goopy.webp' },
    { id: 'fluffbat_evil', name: 'Vampuff', group: 'monsters', family: 'fluffbat', variant: 'evil', tier: 'legendary', img: 'assets/monsters/fluffbat_evil.webp' },
    { id: 'golem_normal', name: 'Pebblem', group: 'monsters', family: 'golem', variant: 'normal', tier: 'rare', img: 'assets/monsters/golem_normal.webp' },
    { id: 'golem_glowing', name: 'Glowlem', group: 'monsters', family: 'golem', variant: 'glowing', tier: 'superrare', img: 'assets/monsters/golem_glowing.webp' },
    { id: 'golem_goopy', name: 'Goolem', group: 'monsters', family: 'golem', variant: 'goopy', tier: 'superrare', img: 'assets/monsters/golem_goopy.webp' },
    { id: 'golem_evil', name: 'Grimlem', group: 'monsters', family: 'golem', variant: 'evil', tier: 'legendary', img: 'assets/monsters/golem_evil.webp' },
    { id: 'sprout_normal', name: 'Bloomlet', group: 'monsters', family: 'sprout', variant: 'normal', tier: 'rare', img: 'assets/monsters/sprout_normal.webp' },
    { id: 'sprout_glowing', name: 'Glowbulb', group: 'monsters', family: 'sprout', variant: 'glowing', tier: 'superrare', img: 'assets/monsters/sprout_glowing.webp' },
    { id: 'sprout_goopy', name: 'Goobloom', group: 'monsters', family: 'sprout', variant: 'goopy', tier: 'superrare', img: 'assets/monsters/sprout_goopy.webp' },
    { id: 'sprout_evil', name: 'Chomplet', group: 'monsters', family: 'sprout', variant: 'evil', tier: 'legendary', img: 'assets/monsters/sprout_evil.webp' },
    { id: 'snake_normal', name: 'Cogsnake', group: 'monsters', family: 'snake', variant: 'normal', tier: 'rare', img: 'assets/monsters/snake_normal.webp' },
    { id: 'snake_glowing', name: 'Neonsnake', group: 'monsters', family: 'snake', variant: 'glowing', tier: 'superrare', img: 'assets/monsters/snake_glowing.webp' },
    { id: 'snake_goopy', name: 'Gooconda', group: 'monsters', family: 'snake', variant: 'goopy', tier: 'superrare', img: 'assets/monsters/snake_goopy.webp' },
    { id: 'snake_evil', name: 'Venomcog', group: 'monsters', family: 'snake', variant: 'evil', tier: 'legendary', img: 'assets/monsters/snake_evil.webp' },
    { id: 'slime_normal', name: 'Jellybub', group: 'monsters', family: 'slime', variant: 'normal', tier: 'rare', img: 'assets/monsters/slime_normal.webp' },
    { id: 'slime_glowing', name: 'Glowjelly', group: 'monsters', family: 'slime', variant: 'glowing', tier: 'superrare', img: 'assets/monsters/slime_glowing.webp' },
    { id: 'slime_goopy', name: 'Gloob', group: 'monsters', family: 'slime', variant: 'goopy', tier: 'superrare', img: 'assets/monsters/slime_goopy.webp' },
    { id: 'slime_evil', name: 'Shadooze', group: 'monsters', family: 'slime', variant: 'evil', tier: 'legendary', img: 'assets/monsters/slime_evil.webp' },
    // Number Twos.  Made when Mara's image generator was being a real turd.
    { id: 'plop_normal', name: 'Ploppy',    group: 'plops', family: 'plop', variant: 'normal', tier: 'rare',      img: 'assets/plops/plop_normal.webp' },
    { id: 'plop_steam',  name: 'Cogplop',   group: 'plops', family: 'plop', variant: 'steam',  tier: 'superrare', img: 'assets/plops/plop_steam.webp' },
    { id: 'plop_prize',  name: 'Prizeplop', group: 'plops', family: 'plop', variant: 'prize',  tier: 'superrare', img: 'assets/plops/plop_prize.webp' },
    { id: 'plop_golden', name: 'Goldplop',  group: 'plops', family: 'plop', variant: 'golden', tier: 'legendary', img: 'assets/plops/plop_golden.webp' },
    // Legendary Treasures (popups only)
    { id: 'purple_underpants', name: 'Lucky Purple Underpants', group: 'treasures', tier: 'legendary', img: 'assets/treasures/purple_underpants.png', pixel: true },
    { id: 'diamond_pick', name: 'Diamond Pickaxe', group: 'treasures', tier: 'legendary', img: 'assets/treasures/diamond_pick.webp' },
    { id: 'magic_sword', name: 'Magical Sword', group: 'treasures', tier: 'legendary', img: 'assets/treasures/magic_sword.webp' },
    // Only from beating the Banana Monster in a hunt (never from shinies).
    { id: 'banana_trophy', name: 'Banana Monster Trophy', group: 'treasures', tier: 'legendary', img: 'assets/treasures/banana_trophy.webp', huntOnly: true }
  ],

  // Hat of the month.  Month 1 = January.  Missing months use the default.
  // Hat of the month for the gnomes on the Shop Floor.  Month 1 = January.  Missing months use the default.
  // Preview any hat by adding ?hat=witch (or santa, easter, clover, valentine, classic) to the address.
  hats: {
    default: { id: 'classic', name: 'Classic Gnome Hat' },
    byMonth: {
      2:  { id: 'valentine', name: 'Valentine Hat' },
      3:  { id: 'clover',    name: 'Shamrock Hat' },
      4:  { id: 'easter',    name: 'Bunny Hat' },
      10: { id: 'witch',     name: 'Witch Hat' },
      12: { id: 'santa',     name: 'Santa Hat' }
    },
    // Where the hat sits on each picture: [center x %, brim y %, width %].
    spots: {
      tiny_static:    [74.5, 21.5, 31], tiny_action:    [58.6, 25.5, 31],
      twohand_static: [74.7, 21.5, 30], twohand_action: [58.1, 31.5, 28],
      cloner_static:  [74.1, 29.0, 27], cloner_action:  [63.4, 36.0, 26],
      warrior_static: [55.5, 18.5, 31], warrior_action: [50.5, 13.0, 32],
      necro_static:   [58.5, 19.0, 24], necro_action:   [70.3, 19.5, 23]
    }
  },

  // Gnomes that click for you.  rate = clicks per second each.
  producers: [
    { id: 'tiny',    icon: 'icon_tiny', name: 'Tiny Gnome',    desc: 'Cranks the little gear with one hand.',
      baseCost: 15,   growth: 1.15, rate: 0.5, unlock: { cogsSeen: 10 } },
    { id: 'tinier',  icon: 'icon_necro', name: 'Gnome Necromancer', desc: 'Raises skeleton gnomes to crank for him.  No lunch breaks.  No lungs.',
      baseCost: 250,  growth: 1.15, rate: 4,   unlock: { producer: 'tiny', count: 10 } },
    { id: 'warrior', icon: 'icon_warrior', name: 'Warrior Gnome', desc: 'The might of adventure powers the machine.',
      baseCost: 1100, growth: 1.15, swipesPerSec: 2, unlock: { cogsSeen: 800 } },
    { id: 'cloner',  icon: 'icon_cloner', name: 'Gnome Cloner',  desc: 'Bubbling vat, questionable ethics, endless coworkers.',
      baseCost: 12000, growth: 1.15, rate: 40, unlock: { cogsSeen: 8000 } },
    { id: 'matryoshka', icon: 'icon_matryoshka', name: 'Matryoshka Gnome', desc: 'Open him up.  There is another gnome inside.  And another.',
      baseCost: 140000, growth: 1.15, rate: 260, unlock: { cogsSeen: 90000 } },
    { id: 'wizard', icon: 'icon_wizard', name: 'Gnome Wizard', desc: 'It is not the cog that turns, but you.',
      baseCost: 1600000, growth: 1.15, rate: 1400, unlock: { cogsSeen: 1000000 } }
  ],

  // The Shop Floor: where each gnome type works.  slot = station number (0 to 11, bottom row first).
  // parts are drawn left to right, h = height as a percent of the floor.
  floor: {
    // Two backgrounds: wide for desktop, tall for phones.  slots are [x %, feet line %].
    layouts: {
      wide: {
        bg: 'assets/bg/floor.webp', aspect: '1600 / 900', scale: 1, plateDrop: 2.1, plateW: 8.6, plateFont: 1.05,
        belt: { left: 9.4, width: 81.2, top: 87.4, height: 5.6, ride: 89.6 },
        slots: [
          [22.9, 80.0], [41.0, 80.0], [59.5, 80.0], [78.1, 80.0],
          [22.9, 54.0], [41.0, 54.0], [59.5, 54.0], [78.1, 54.0],
          [22.9, 28.0], [41.0, 28.0], [59.5, 28.0], [78.1, 28.0]
        ]
      },
      tall: {
        bg: 'assets/bg/floor_tall.webp', aspect: '900 / 1599', scale: 0.5, plateDrop: 1.5, plateW: 11.4, plateFont: 1.9,
        belt: { left: 11.5, width: 77, top: 83.4, height: 4.2, ride: 85.4 },
        slots: [
          [22.0, 66.1], [42.3, 66.1], [62.2, 66.1], [81.8, 66.1],
          [22.8, 51.5], [43.0, 51.5], [62.2, 51.5], [81.6, 51.5],
          [25.2, 35.6], [43.6, 35.6], [62.2, 35.6], [80.8, 35.6]
        ]
      }
    },
    stations: {
      tiny:       { label: 'Tiny', slot: 0, parts: [{ img: 'tiny_static', h: 17, upgrade: { two_hands: 'twohand_static' } }] },
      tinier:     { label: 'Necro', slot: 1, parts: [{ img: 'skeleton_static', h: 8.5, overlap: 3 }, { img: 'necro_static', h: 16, actionDx: -21 }] },
      warrior:    { label: 'Warrior', slot: 2, parts: [{ img: 'warrior_static', h: 17, weapon: true, z: 2 }, { img: 'dummy_static', h: 12, anim: 'hit' }] },
      cloner:     { label: 'Cloner', slot: 3, parts: [{ img: 'cloner_static', h: 17, z: 2, overlap: 3 }, { img: '../clones/vat_full', h: 13, anim: 'none', cls: 'part-vat' }] },
      matryoshka: { label: 'Matryoshka', slot: 4, parts: [{ img: 'matry_closed', h: 15, stages: [[25, 'matry_set5', 13], [10, 'matry_set3', 14]] }] },
      wizard:     { label: 'Wizard', slot: 5, parts: [{ img: 'wizard_static', h: 17, anim: 'spin' }] },
      mega:       { label: 'Megagnome', slot: 6, parts: [{ img: '../mega/mega_idle', h: 22, anim: 'jiggle', cls: 'part-mega' }] }
    },

    // Squish and boing.  Faster gnome types bounce faster, within these limits (seconds per bounce).
    anim: { slowest: 2.2, fastest: 0.45, boing: 0.55,
      // The Megagnome is not a producer, so he jiggles on his own beat (seconds between jiggles, jiggle length).
      megaEvery: 2.4, megaJiggle: 0.9 },

    // Warrior weapons, pinned to his fists.  len = length as a share of his height.
    // fist / fistAct = [x %, y %] of the warrior picture.  rot = weapon angle in each pose.
    weapons: {
      grip: 80, fist: [76, 57], fistAct: [91, 52], rot: 115, rotAct: 188,
      byValue: {
        3: { img: 'weapon_dagger', len: 0.5 }, 4: { img: 'weapon_sword', len: 0.7 },
        5: { img: 'weapon_hammer', len: 0.66 },  6: { img: 'weapon_wand', len: 0.58 },
        7: { img: 'weapon_staff', len: 0.8 },   8: { img: 'weapon_stick', len: 0.8 }
      }
    }
  },

  // Leveled upgrades (buy many times).
  leveled: [
    { id: 'knuckles', name: 'Brass Knuckles',    desc: '+1 click per tap.',
      baseCost: 50,   growth: 2.5, maxLevel: 50, unlock: { cogsSeen: 30 } },
    { id: 'faster',   name: 'Faster Gears',      desc: '+25% to everything that clicks.',
      baseCost: 1000, growth: 4,   maxLevel: 40, unlock: { cogsSeen: 600 } },
    { id: 'ratio',    name: 'Better Gear Ratio', desc: 'The big gear needs 15% fewer clicks per item.',
      baseCost: 200,  growth: 3,   maxLevel: 12, unlock: { itemsMade: 3 } },
    { id: 'poker',    name: 'Auto Poker',        desc: 'Buggers every gnome into clicking 10% faster.',
      baseCost: 500,  growth: 2,   maxLevel: 60, unlock: { producer: 'tiny', count: 5 } }
  ],

  // One-time upgrades.
  oneTime: [
    { id: 'two_hands',  name: 'Double-Handed Cranking', desc: 'Tiny gnomes use both hands.  Tiny gnomes x2.',
      cost: 200,     unlock: { producer: 'tiny', count: 5 } },
    { id: 'inv_mitts',  name: 'Spring-Loaded Mitts',    desc: 'A tiny gnome invention.  Tiny gnomes x2.',
      cost: 2000,    unlock: { producer: 'tiny', count: 15 } },
    { id: 'inv_elbows', name: 'Clockwork Elbows',       desc: 'Another tiny gnome invention.  Tiny gnomes x2.',
      cost: 25000,   unlock: { producer: 'tiny', count: 30 } },
    { id: 'inv_steam',  name: 'Steam Gauntlets',        desc: 'Wildly unsafe.  Tiny gnomes x2.',
      cost: 300000,  unlock: { producer: 'tiny', count: 50 } },
    // Wizard line.  mult = { producer, x }: that gnome type's output is multiplied by x.
    { id: 'wiz_robes',    name: 'Dizzy Robes',               desc: 'Robes cut for maximum twirl.  Wizards x2.',
      cost: 20000000,     mult: { producer: 'wizard', x: 2 }, unlock: { producer: 'wizard', count: 5 } },
    { id: 'wiz_ccw',      name: 'Counter-Clockwise Casting', desc: 'Spin the other way.  Nobody knows why it works.  Wizards x2.',
      cost: 200000000,    mult: { producer: 'wizard', x: 2 }, unlock: { producer: 'wizard', count: 15 } },
    { id: 'wiz_beard',    name: 'Tornado Beard',             desc: 'The beard spins too.  Wizards x2.',
      cost: 2500000000,   mult: { producer: 'wizard', x: 2 }, unlock: { producer: 'wizard', count: 30 } },
    { id: 'wiz_pirouette', name: 'Perpetual Pirouette',      desc: 'He has not stopped since Tuesday.  Wizards x2.',
      cost: 30000000000,  mult: { producer: 'wizard', x: 2 }, unlock: { producer: 'wizard', count: 50 } },
    { id: 'wiz_not_cog',  name: 'Not the Cog, But You',      desc: 'Every Wizard makes all other gnomes 1% faster (up to +50%).',
      cost: 1000000000,   aura: true, unlock: { producer: 'wizard', count: 25 } },
    { id: 'wiz_wild',     name: 'Wild Magic',                desc: 'Let the Wizards lose control now and then.  Tap the spinning junk for cogs.',
      cost: 100000000,    unlock: { producer: 'wizard', count: 10 } },
    { id: 'rally',      name: 'Rally Cry',              desc: 'Each tap also adds 5% of your gnome clicks per second.',
      cost: 25000,   unlock: { cogsSeen: 10000 } },
    // Warrior weapons.  Each one replaces the last.
    { id: 'w_sword',  name: 'Sword',           desc: 'Warrior swipes now hit for 4.',  cost: 5000,     weapon: 4, unlock: { producer: 'warrior', count: 1 } },
    { id: 'w_hammer', name: 'Hammer',          desc: 'Warrior swipes now hit for 5.',  cost: 25000,    weapon: 5, requires: 'w_sword' },
    { id: 'w_wand',   name: 'Wand',            desc: 'Warrior swipes now hit for 6.',  cost: 100000,   weapon: 6, requires: 'w_hammer' },
    { id: 'w_staff',  name: 'Staff',           desc: 'Warrior swipes now hit for 7.',  cost: 400000,   weapon: 7, requires: 'w_wand' },
    { id: 'w_stick',  name: 'Gnome on a Stick', desc: 'Swipes hit for 8, and the gnome on the stick clicks +1.', cost: 1500000, weapon: 8, stick: true, requires: 'w_staff' }
  ],

  warrior: { baseWeapon: 3, baseWeaponName: 'Dagger' }
};
