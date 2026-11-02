/* Gnomeworks tuning file.
   Almost every number that shapes the game lives here.
   Change a value, reload the page, done.  Bump GW.VERSION on every change. */
window.GW = window.GW || {};

GW.VERSION = '0.2.0-draft.2';

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

  tap: {
    maxTapsPerSecond: 20,       // human cap; extra taps are ignored
    activeWindowSeconds: 30     // rare popups only appear if a human tapped this recently
  },

  // Rare popups on the side of the machine.  Only a real tap can claim them.
  popup: {
    minSeconds: 75,
    maxSeconds: 200,
    lifetimeSeconds: 12,
    superRareChance: 0.3,       // otherwise it is a Lucky Sprocket
    pityCount: 6,               // guarantees a super rare after this many misses
    luckySprocketSeconds: 60    // Lucky Sprocket pays this many seconds of production (min 50 taps worth)
  },

  // Item rarity tiers for the machine.  bonus = extra cogs as a fraction of one turn.
  tiers: {
    common:    { label: 'Common',     weight: 70, bonus: 0.10, color: '#c9b79c' },
    uncommon:  { label: 'Uncommon',   weight: 22, bonus: 0.50, color: '#7fc97f' },
    rare:      { label: 'Rare',       weight: 8,  bonus: 2.00, color: '#6fa8ff' },
    superrare: { label: 'Super Rare', weight: 0,  bonus: 0,    color: '#c77dff' }
  },

  // img paths are used once the real art exists.  Until then the emoji shows.
  items: [
    { id: 'socks',         name: 'Socks',              tier: 'common',    emoji: '🧦' },
    { id: 'pencil',        name: 'Pencil',             tier: 'common',    emoji: '✏️' },
    { id: 'chips',         name: 'Bag of Chips',       tier: 'common',    emoji: '🍟' },
    { id: 'beans',         name: "Can o' Beans",       tier: 'common',    emoji: '🥫' },
    { id: 'shirt',         name: 'Shirt',              tier: 'common',    emoji: '👕' },
    { id: 'underpants',    name: 'Underpants',         tier: 'common',    emoji: '🩲' },
    { id: 'tcg_card',      name: 'Trading Card',       tier: 'uncommon',  emoji: '🃏' },
    { id: 'dice',          name: 'Lucky Die',          tier: 'uncommon',  emoji: '🎲' },
    { id: 'tiny_monster',  name: 'Tiny Monster',       tier: 'rare',      emoji: '👾' },
    { id: 'purple_underpants', name: 'Purple Underpants', tier: 'superrare', emoji: '🩲', tint: 'purple' },
    { id: 'diamond_pick',  name: 'Diamond Pickaxe',    tier: 'superrare', emoji: '⛏️' },
    { id: 'magic_sword',   name: 'Magical Sword',      tier: 'superrare', emoji: '🗡️' }
  ],

  // Hat of the month.  Month 1 = January.  Missing months use the default.
  hats: {
    default: { id: 'classic', name: 'Classic Gnome Hat', color: '#b22222' },
    byMonth: {
      1:  { id: 'party',    name: 'Party Hat',     color: '#e6c229', trim: '🎉' },
      2:  { id: 'heart',    name: 'Heart Hat',     color: '#d6336c', trim: '❤️' },
      3:  { id: 'clover',   name: 'Clover Hat',    color: '#2b9348', trim: '☘️' },
      4:  { id: 'flower',   name: 'Flower Hat',    color: '#f28482', trim: '🌸' },
      7:  { id: 'firework', name: 'Firework Hat',  color: '#1d4e89', trim: '🎆' },
      10: { id: 'witch',    name: 'Witch Hat',     color: '#3c1361', trim: '🎃' },
      11: { id: 'harvest',  name: 'Harvest Hat',   color: '#9c6644', trim: '🍂' },
      12: { id: 'santa',    name: 'Santa Hat',     color: '#c1121f', trim: '❄️' }
    }
  },

  // Gnomes that click for you.  rate = clicks per second each.
  producers: [
    { id: 'tiny',    name: 'Tiny Gnome',    desc: 'Cranks the little gear with one hand.',
      baseCost: 15,   growth: 1.15, rate: 0.5, unlock: { cogsSeen: 10 } },
    { id: 'tinier',  name: 'Tinier Gnome',  desc: 'Summoned by your tiny gnomes.  Smaller.  Faster.  Louder.',
      baseCost: 250,  growth: 1.15, rate: 4,   unlock: { producer: 'tiny', count: 10 } },
    { id: 'warrior', name: 'Warrior Gnome', desc: 'Swipes the gear with a weapon twice a second.',
      baseCost: 1100, growth: 1.15, swipesPerSec: 2, unlock: { cogsSeen: 800 } }
  ],

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
