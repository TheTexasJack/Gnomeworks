/* The machine: wall, meshing gears, and the hatch, drawn as SVG.
   Gears are generated in code so their teeth really mesh.  Speed follows tooth count. */
window.GW = window.GW || {};

GW.gears = (function () {
  var NS = 'http://www.w3.org/2000/svg';
  var VIEW = { w: 600, h: 440 };
  var MODULE = 6; // tooth size; pitch radius = MODULE * teeth / 2
  var HATCH = { x: 478, y: 236, size: 84 };
  var gears = [];  // { id, teeth, cx, cy, rotG, driver, theta }

  function rad(d) { return d * Math.PI / 180; }
  function deg(r) { return r * 180 / Math.PI; }

  function mk(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }

  function gearPath(teeth) {
    var rp = MODULE * teeth / 2, ro = rp + MODULE, rr = rp - 1.25 * MODULE;
    var step = 2 * Math.PI / teeth, d = '';
    function pt(r, a) { return (r * Math.cos(a)).toFixed(2) + ' ' + (r * Math.sin(a)).toFixed(2); }
    for (var k = 0; k < teeth; k++) {
      var a = k * step;
      d += (k === 0 ? 'M' : 'L') + pt(rr, a - 0.5 * step);
      d += 'L' + pt(rr, a - 0.27 * step) + 'L' + pt(ro, a - 0.13 * step);
      d += 'L' + pt(ro, a + 0.13 * step) + 'L' + pt(rr, a + 0.27 * step);
    }
    return d + 'Z';
  }

  function defs(svg) {
    var d = mk('defs', {}, svg);
    var brass = mk('radialGradient', { id: 'gwBrass', cx: '35%', cy: '30%', r: '75%' }, d);
    mk('stop', { offset: '0%', 'stop-color': '#fff1b8' }, brass);
    mk('stop', { offset: '35%', 'stop-color': '#e0b04a' }, brass);
    mk('stop', { offset: '80%', 'stop-color': '#a8741a' }, brass);
    mk('stop', { offset: '100%', 'stop-color': '#6e4a0e' }, brass);
    var copper = mk('radialGradient', { id: 'gwCopper', cx: '35%', cy: '30%', r: '75%' }, d);
    mk('stop', { offset: '0%', 'stop-color': '#ffd2b0' }, copper);
    mk('stop', { offset: '45%', 'stop-color': '#c4703a' }, copper);
    mk('stop', { offset: '100%', 'stop-color': '#6b3417' }, copper);
    var plank = mk('linearGradient', { id: 'gwPlank', x1: '0', y1: '0', x2: '1', y2: '0' }, d);
    mk('stop', { offset: '0%', 'stop-color': '#5c3a1e' }, plank);
    mk('stop', { offset: '50%', 'stop-color': '#6d4526' }, plank);
    mk('stop', { offset: '100%', 'stop-color': '#4e3018' }, plank);
    var shadow = mk('filter', { id: 'gwShadow', x: '-20%', y: '-20%', width: '140%', height: '140%' }, d);
    mk('feDropShadow', { dx: '3', dy: '5', stdDeviation: '3', 'flood-color': '#000', 'flood-opacity': '0.55' }, shadow);
  }

  function wall(svg) {
    var g = mk('g', { 'class': 'wall' }, svg);
    for (var x = 0; x < VIEW.w; x += 75) {
      mk('rect', { x: x, y: 0, width: 75, height: VIEW.h, fill: 'url(#gwPlank)' }, g);
      mk('rect', { x: x, y: 0, width: 2, height: VIEW.h, fill: '#2b1a0c', opacity: 0.8 }, g);
      mk('circle', { cx: x + 12, cy: 18, r: 2.5, fill: '#2b1a0c' }, g);
      mk('circle', { cx: x + 12, cy: 380, r: 2.5, fill: '#2b1a0c' }, g);
    }
    // floor ledge
    mk('rect', { x: 0, y: 402, width: VIEW.w, height: 38, fill: '#3b2412' }, g);
    mk('rect', { x: 0, y: 398, width: VIEW.w, height: 8, fill: '#b8862b' }, g);
  }

  function hatch(svg) {
    var g = mk('g', { 'class': 'hatch' }, svg), h = HATCH;
    mk('rect', { x: h.x - 8, y: h.y - 8, width: h.size + 16, height: h.size + 16, rx: 6, fill: 'url(#gwBrass)', filter: 'url(#gwShadow)' }, g);
    mk('rect', { x: h.x, y: h.y, width: h.size, height: h.size, rx: 3, fill: '#140b05' }, g);
    var flap = mk('rect', { id: 'gwFlap', x: h.x, y: h.y, width: h.size, height: h.size * 0.55, fill: '#7a5320', stroke: '#3a250c', 'stroke-width': 2 }, g);
    flap.style.transformOrigin = (h.x + h.size / 2) + 'px ' + h.y + 'px';
    [h.x + 6, h.x + h.size - 6].forEach(function (x) {
      [h.y - 2, h.y + h.size + 2].forEach(function (y) { mk('circle', { cx: x, cy: y, r: 3, fill: '#5a3d0c' }, g); });
    });
    // little chute arrows like the sketch
    for (var i = 0; i < 3; i++) {
      var y = h.y - 70 + i * 16;
      mk('path', { d: 'M' + (h.x + h.size / 2 - 10) + ' ' + y + ' l10 9 l10 -9', fill: 'none', stroke: '#e0b04a', 'stroke-width': 3, opacity: 0.35 + i * 0.2, 'stroke-linecap': 'round' }, g);
    }
  }

  function addGear(svg, opt) {
    var outer = mk('g', { transform: 'translate(' + opt.cx + ' ' + opt.cy + ')', filter: 'url(#gwShadow)' }, svg);
    var bump = mk('g', { 'class': 'gear-bump' }, outer);
    var rot = mk('g', {}, bump);
    var rp = MODULE * opt.teeth / 2;
    mk('path', { d: gearPath(opt.teeth), fill: opt.fill || 'url(#gwBrass)', stroke: '#4a300a', 'stroke-width': 1.5, 'stroke-linejoin': 'round' }, rot);
    mk('circle', { r: rp - 1.25 * MODULE - 6, fill: 'none', stroke: '#6e4a0e', 'stroke-width': 2, opacity: 0.6 }, rot);
    var holes = opt.holes || 0;
    for (var i = 0; i < holes; i++) {
      var a = i * 2 * Math.PI / holes;
      mk('circle', { cx: Math.cos(a) * rp * 0.55, cy: Math.sin(a) * rp * 0.55, r: rp * 0.13, fill: '#2a180a', stroke: '#6e4a0e', 'stroke-width': 1.5 }, rot);
    }
    mk('circle', { r: Math.max(6, rp * 0.16), fill: '#7a5320', stroke: '#3a250c', 'stroke-width': 2 }, rot);
    mk('circle', { r: Math.max(3, rp * 0.06), fill: '#1c1006' }, rot);
    var g = { id: opt.id, teeth: opt.teeth, cx: opt.cx, cy: opt.cy, rot: rot, bump: bump, driver: opt.driver || null, angle: 0 };
    gears.push(g);
    return g;
  }

  function place(from, teeth, dirDeg) {
    var dist = MODULE * (from.teeth + teeth) / 2;
    return { cx: from.cx + dist * Math.cos(rad(dirDeg)), cy: from.cy + dist * Math.sin(rad(dirDeg)) };
  }

  // Angle a gear must sit at so its teeth slot between the driver's teeth.
  function meshAngle(driver, gear) {
    var theta = Math.atan2(gear.cy - driver.cy, gear.cx - driver.cx);
    return theta + Math.PI + (theta - driver.angle) * driver.teeth / gear.teeth - Math.PI / gear.teeth;
  }

  var drive;

  function build(svg) {
    svg.setAttribute('viewBox', '0 0 ' + VIEW.w + ' ' + VIEW.h);
    defs(svg); wall(svg); hatch(svg);
    // Positions are worked out from the big gear so everything fits the wall.
    var bigPos = { cx: 300, cy: 200, teeth: 40 };
    var idlerPos = place(bigPos, 20, 150); idlerPos.teeth = 20;
    var drivePos = place(idlerPos, 10, 200);
    var decorPos = place(bigPos, 16, -55); decorPos.teeth = 16;
    var decor2Pos = place(decorPos, 12, 8);

    // Draw small to big so the big gear's shadow falls on the wall, not on the others.
    var decor2 = addGear(svg, { id: 'decor2', teeth: 12, cx: decor2Pos.cx, cy: decor2Pos.cy, holes: 0, fill: 'url(#gwCopper)' });
    var decor = addGear(svg, { id: 'decor', teeth: 16, cx: decorPos.cx, cy: decorPos.cy, holes: 4 });
    var big = addGear(svg, { id: 'big', teeth: 40, cx: bigPos.cx, cy: bigPos.cy, holes: 7 });
    var idler = addGear(svg, { id: 'idler', teeth: 20, cx: idlerPos.cx, cy: idlerPos.cy, holes: 5, fill: 'url(#gwCopper)' });
    drive = addGear(svg, { id: 'drive', teeth: 10, cx: drivePos.cx, cy: drivePos.cy, holes: 0 });
    idler.driver = drive; big.driver = idler; decor.driver = big; decor2.driver = decor;

    // Tap hint ring around the little gear
    var ring = mk('circle', { 'class': 'tap-ring', cx: drive.cx, cy: drive.cy, r: 44, fill: 'none', stroke: '#ffe08a', 'stroke-width': 3 }, svg);
    ring.style.transformOrigin = drive.cx + 'px ' + drive.cy + 'px';
    var label = mk('text', { 'class': 'tap-label', x: drive.cx, y: drive.cy + 72, 'text-anchor': 'middle' }, svg);
    label.textContent = 'TAP!';
  }

  // bigDeg is the display angle of the big gear in degrees.
  function update(bigDeg) {
    drive.angle = rad(bigDeg * 40 / 10);
    var order = ['drive', 'idler', 'big', 'decor', 'decor2'];
    order.forEach(function (id) {
      var g = gears.filter(function (x) { return x.id === id; })[0];
      if (g.driver) g.angle = meshAngle(g.driver, g);
      g.rot.setAttribute('transform', 'rotate(' + deg(g.angle).toFixed(2) + ')');
    });
  }

  function restartAnim(node, cls) {
    node.classList.remove(cls);
    void node.getBoundingClientRect();
    node.classList.add(cls);
  }

  function bumpDrive() { restartAnim(drive.bump, 'bump'); }
  function openFlap() { var f = document.getElementById('gwFlap'); if (f) restartAnim(f, 'flap-open'); }

  // Points in percent of the machine box, for positioning HTML effects over the SVG.
  function pct(x, y) { return { x: x / VIEW.w * 100, y: y / VIEW.h * 100 }; }
  function hatchMouth() { return pct(HATCH.x + HATCH.size / 2, HATCH.y + HATCH.size / 2); }
  function driveCenter() { return pct(drive.cx, drive.cy); }

  return { build: build, update: update, bumpDrive: bumpDrive, openFlap: openFlap, hatchMouth: hatchMouth, driveCenter: driveCenter, VIEW: VIEW };
})();
