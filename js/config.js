/* Gnomeworks tuning file.
   Almost every number that shapes the game lives here.
   Change a value, reload the page, done.  Bump GW.VERSION on every change. */
window.GW = window.GW || {};

GW.VERSION = '0.2.0-draft.51';

GW.CONFIG = {
  // Shop branding.  Leave logo null until the shop's new logo is final.
  branding: { shopName: 'The Stoned Gnome', logo: null },

  // Bumping the season wipes every player's local save on their next visit.
  season: 1,
  saveKey: 'gnomeworks.save',
  autosaveSeconds: 10,

  offline: { maxHours: 8, efficiency: 1.0 },

  currency: { name: 'Cogs', icon: '⚙️' },

  machine: {
    baseClicksPerItem: 20,      // clicks for one full turn of the big gear (one item)
    minClicksPerItem: 3,
    maxVisualItemsPerSecond: 3, // extra items still count, they just skip the pop animation
    maxVisualDegPerSec: 540     // keeps the big gear readable at huge speeds
  },

  // Wide screens: when the space beside the machine is at least this wide (px), the
  // next-item gauge and the crew move into side rails next to it.
  layout: { railMinWidth: 100 },

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

  tap: {
    maxTapsPerSecond: 20,       // human cap; extra taps are ignored
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
    { id: 'magic_sword', name: 'Magical Sword', group: 'treasures', tier: 'legendary', img: 'assets/treasures/magic_sword.webp' }
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
      wizard:     { label: 'Wizard', slot: 5, parts: [{ img: 'wizard_static', h: 17, anim: 'spin' }] }
    },

    // Squish and boing.  Faster gnome types bounce faster, within these limits (seconds per bounce).
    anim: { slowest: 2.2, fastest: 0.45, boing: 0.55 },

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
