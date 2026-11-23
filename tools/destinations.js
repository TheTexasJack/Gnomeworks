// Builds js/destinations.js (GW.DESTINATIONS) from the map's locations file, so lore and game never drift apart.
// Item names come from js/config.js itself.  Every place whose Factory Imports names at least one game item
// goes in, and every place with a buys list also buys the whole Bathroom group ("Everybody needs a bathroom").
// A Factory Imports name that matches no item is skipped and reported, never guessed.
// Run from the repo root:  node tools/destinations.js
const fs = require('fs');
const path = require('path');
global.window = global; global.GW = {};
require('../js/config.js');
const C = GW.CONFIG;

const ROOT = path.resolve(__dirname, '..');
const SRC = 'docs/lore/map/gnomadica-locations-v0.29.json';
const OUT = 'js/destinations.js';

// Unlock order (DESIGNS.md, "Regions unlock as you go") and stamps (docs/lore/regions.md, "Region stamps").
const REGIONS = [
  { name: 'Gnomerica', color: '#d9a441', symbol: 'Gear' },
  { name: 'Gnohio', color: '#7fa65a', symbol: 'Wheat' },
  { name: 'Gnafrica', color: '#cf7346', symbol: 'Cactus' },
  { name: 'Slanic', color: '#4f9a8f', symbol: 'Mushroom' },
  { name: 'Gno Dao Cradle', color: '#8a77b0', symbol: 'Mountains' },
  { name: 'Gni', color: '#b0609a', symbol: "Knight's helm" },
  { name: 'Slaanilok', color: '#e0887a', symbol: 'Step pyramid' },
  { name: 'Shen Shin', color: '#9a6b3f', symbol: 'Table' },
  { name: 'Gnufoundland', color: '#8fb3d6', symbol: 'Mitten' },
  { name: 'Gnonmoon', color: '#4f5f86', symbol: 'Crescent moon' }
];
const BATHROOM = 'bathroom';

const key = s => String(s).toLowerCase().replace(/[^a-z0-9]/g, '');
const regionId = name => name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');

const src = JSON.parse(fs.readFileSync(path.join(ROOT, SRC), 'utf8'));
const byName = {};
C.items.forEach(i => { byName[key(i.name)] = i.id; });
const bathroom = C.items.filter(i => i.group === BATHROOM).map(i => i.id);

const order = REGIONS.map(r => r.name);
const unmatched = [], skippedRegion = [];
let places = [];
src.locations.concat(src.added_places || []).forEach((loc, n) => {
  const g = loc.gazetteer || {};
  const raw = (g['Factory Imports'] || '').trim();
  if (!raw || /^none\b/i.test(raw)) return;
  const buys = [];
  raw.split(';').map(s => s.trim()).filter(Boolean).forEach(name => {
    const id = byName[key(name)];
    if (!id) { unmatched.push({ place: loc.name, region: loc.region, name }); return; }
    if (buys.indexOf(id) < 0) buys.push(id);
  });
  if (!buys.length) return;
  if (order.indexOf(loc.region) < 0) { skippedRegion.push(loc.name + ' (' + loc.region + ')'); return; }
  bathroom.forEach(id => { if (buys.indexOf(id) < 0) buys.push(id); });
  places.push({ n, place: { id: loc.id, name: loc.name, type: loc.type, region: regionId(loc.region), buys } });
});
// Unlock order, then the source file's order within a region.
places.sort((a, b) => order.indexOf(nameOf(a)) - order.indexOf(nameOf(b)) || a.n - b.n);
function nameOf(p) { return REGIONS.find(r => regionId(r.name) === p.place.region).name; }
places = places.map(p => p.place);

const regions = REGIONS.map(r => ({ id: regionId(r.name), name: r.name, color: r.color, symbol: r.symbol }));
const q = JSON.stringify;
let out = [];
out.push('/* GENERATED FILE: do not edit.  Rerun  node tools/destinations.js  instead.');
out.push('   Source: ' + SRC + ' (map version ' + src.version + ') and the item names in js/config.js.');
out.push('   regions: the ten regions in unlock order, each with its stamp color and symbol (docs/lore/regions.md).');
out.push('   places: every location whose Factory Imports names at least one game item; buys = game item ids, the');
out.push('   listed imports first, then the whole Bathroom group (everybody needs a bathroom). */');
out.push('window.GW = window.GW || {};');
out.push('');
out.push('GW.DESTINATIONS = {');
out.push('  source: ' + q(SRC) + ',');
out.push('  version: ' + q(String(src.version)) + ',');
out.push('  regions: [');
regions.forEach((r, i) => out.push('    { id: ' + q(r.id) + ', name: ' + q(r.name) + ', color: ' + q(r.color) + ', symbol: ' + q(r.symbol) + ' }' + (i < regions.length - 1 ? ',' : '')));
out.push('  ],');
out.push('  places: [');
places.forEach((p, i) => out.push('    { id: ' + q(p.id) + ', name: ' + q(p.name) + ', type: ' + q(p.type) + ', region: ' + q(p.region) +
  ',\n      buys: [' + p.buys.map(q).join(', ') + '] }' + (i < places.length - 1 ? ',' : '')));
out.push('  ]');
out.push('};');
out.push('');
fs.writeFileSync(path.join(ROOT, OUT), out.join('\n'));

// The report.
console.log('Wrote ' + OUT + ' from ' + SRC + ': ' + places.length + ' places.');
console.log('\nPlaces per region:');
regions.forEach(r => console.log('  ' + r.name + ': ' + places.filter(p => p.region === r.id).length));
const sizes = places.map(p => p.buys.length);
const min = Math.min(...sizes), max = Math.max(...sizes);
console.log('\nItems per place (bathroom included): smallest ' + min + ' (' + places.filter(p => p.buys.length === min).map(p => p.name).join(', ') +
  '), largest ' + max + ' (' + places.filter(p => p.buys.length === max).map(p => p.name).join(', ') + ').');
console.log('\nUnmatched names (skipped): ' + (unmatched.length ? '' : 'none'));
unmatched.forEach(u => console.log('  "' + u.name + '" at ' + u.place + ' (' + u.region + ')'));
if (skippedRegion.length) console.log('\nSkipped, region not in the unlock list: ' + skippedRegion.join(', '));
