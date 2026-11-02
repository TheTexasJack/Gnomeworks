// Rebuilds docs/INVENTORY.md from js/config.js, so the list never drifts from the game.
// Run from the repo root:  node tools/inventory.js
const fs = require('fs');
global.window = global; global.GW = {};
require('../js/config.js');
const C = GW.CONFIG;
const tierName = { common: 'Common', uncommon: 'Uncommon', rare: 'Rare', superrare: 'Super Rare', legendary: 'Legendary' };
const cp = e => Array.from(e).map(c => c.codePointAt(0).toString(16)).filter(c => c !== 'fe0f').join('-');
let out = [];
out.push('# Inventory');
out.push('');
out.push('Every collectible in the game, by shelf group.  Generated from `js/config.js` by `node tools/inventory.js`, so rerun it after any item change instead of editing this file by hand.');
out.push('');
out.push(`Total: **${C.items.length}** collectibles.  Game version ${GW.VERSION}.`);
out.push('');
out.push('| Group | Items |');
out.push('| --- | --- |');
C.groups.forEach(g => out.push(`| ${g.name} | ${C.items.filter(i => i.group === g.id).length} |`));
out.push('');
C.groups.forEach(g => {
  const items = C.items.filter(i => i.group === g.id);
  out.push(`## ${g.name} (${items.length})`);
  out.push('');
  if (g.layout === 'families') {
    const fams = [...new Set(items.map(i => i.family))];
    out.push('| Family | ' + g.variants.map(v => v[0].toUpperCase() + v.slice(1)).join(' | ') + ' |');
    out.push('| --- |' + g.variants.map(() => ' --- |').join(''));
    fams.forEach(f => {
      const cells = g.variants.map(v => {
        const it = items.find(i => i.family === f && i.variant === v);
        return it ? `${it.name} (${tierName[it.tier]})` : '**missing**';
      });
      out.push(`| ${f} | ${cells.join(' | ')} |`);
    });
  } else {
    out.push('| Item | Tier | Emoji | Twemoji file |');
    out.push('| --- | --- | --- | --- |');
    items.forEach(i => out.push(`| ${i.name} | ${tierName[i.tier]} | ${i.emoji || ''} | ${i.emoji ? cp(i.emoji) + '.svg' : i.img} |`));
  }
  out.push('');
});
out.push('## Emoji already used');
out.push('');
out.push('Check here before picking a new junk emoji, so nothing repeats.');
out.push('');
out.push(C.items.filter(i => i.emoji).map(i => i.emoji).join(' '));
out.push('');
fs.writeFileSync(__dirname + '/../docs/INVENTORY.md', out.join('\n'));
console.log('wrote docs/INVENTORY.md:', C.items.length, 'items');
