// Stamps the game version onto every CSS and JS link in index.html (style.css?v=0.2.0-draft.54),
// so a new release never mixes freshly downloaded files with old cached ones.
// Run from the repo root after bumping GW.VERSION:  node tools/stamp.js
// (tools/smoke-test.js fails if the stamps don't match the version.)
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const cfg = fs.readFileSync(path.join(ROOT, 'js/config.js'), 'utf8');
const v = (cfg.match(/GW\.VERSION\s*=\s*'([^']+)'/) || [])[1];
if (!v) { console.error('GW.VERSION not found in js/config.js'); process.exit(1); }
const file = path.join(ROOT, 'index.html');
let html = fs.readFileSync(file, 'utf8'), n = 0;
html = html.replace(/((?:src|href)=")((?:css|js)\/[^"?]+\.(?:css|js))(\?v=[^"]*)?"/g, (m, a, p) => { n++; return a + p + '?v=' + v + '"'; });
fs.writeFileSync(file, html);
console.log(`stamped ${n} links with v=${v}`);
