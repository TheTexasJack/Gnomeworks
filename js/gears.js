/* The machine: wall, meshing gears, and the hatch, drawn as SVG.
   Gears are generated in code so their teeth really mesh.  Speed follows tooth count. */
window.GW = window.GW || {};

GW.gears = (function () {
  var NS = 'http://www.w3.org/2000/svg';
  var VIEW = { w: 1000, h: 1000 };
  var HATCH = { x: 692, y: 752, w: 116, h: 109 };   // the opening in Mara's machine wall
  var PITCH = 0.355;   // pitch radius as a fraction of the gear image width (measured from Mara's art)
  var gears = {};

  function rad(d) { return d * Math.PI / 180; }
  function deg(r) { return r * 180 / Math.PI; }

  function mk(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }

  function defs(svg) {
    var d = mk('defs', {}, svg);
    var brass = mk('radialGradient', { id: 'gwBrass', cx: '35%', cy: '30%', r: '75%' }, d);
    mk('stop', { offset: '0%', 'stop-color': '#fff1b8' }, brass);
    mk('stop', { offset: '35%', 'stop-color': '#e0b04a' }, brass);
    mk('stop', { offset: '80%', 'stop-color': '#a8741a' }, brass);
    mk('stop', { offset: '100%', 'stop-color': '#6e4a0e' }, brass);
    var shadow = mk('filter', { id: 'gwShadow', x: '-20%', y: '-20%', width: '140%', height: '140%' }, d);
    mk('feDropShadow', { dx: '6', dy: '10', stdDeviation: '6', 'flood-color': '#1a0c02', 'flood-opacity': '0.6' }, shadow);
    var glow = mk('radialGradient', { id: 'gwGlow', cx: '50%', cy: '30%', r: '70%' }, d);
    mk('stop', { offset: '0%', 'stop-color': '#ffd27a', 'stop-opacity': '0.0' }, glow);
    mk('stop', { offset: '70%', 'stop-color': '#000', 'stop-opacity': '0.15' }, glow);
    mk('stop', { offset: '100%', 'stop-color': '#000', 'stop-opacity': '0.55' }, glow);
  }

  function wall(svg) {
    mk('image', { id: 'machineWall', href: GW.theme.img('assets/bg/machine_wall.webp'), x: 0, y: 0, width: VIEW.w, height: VIEW.h, preserveAspectRatio: 'xMidYMid slice' }, svg);
    mk('rect', { x: 0, y: 0, width: VIEW.w, height: VIEW.h, fill: '#2a1004', opacity: 0.22 }, svg);
  }

  function vignette(svg) {
    mk('rect', { x: 0, y: 0, width: VIEW.w, height: VIEW.h, fill: 'url(#gwGlow)', 'pointer-events': 'none' }, svg);
  }

  function hatch(svg) {
    // The frame is part of the wall art now.  Only the flap is drawn, so it can swing open.
    var g = mk('g', { 'class': 'hatch' }, svg), h = HATCH;
    var flap = mk('rect', { id: 'gwFlap', x: h.x + 2, y: h.y + 2, width: h.w - 4, height: h.h * 0.5, rx: 2, fill: 'url(#gwBrass)', stroke: '#4a300a', 'stroke-width': 3, opacity: 0.95 }, g);
    flap.style.transformOrigin = (h.x + h.w / 2) + 'px ' + h.y + 'px';
  }

  // A gear drawn from one of Mara's images.  phase = angle of a tooth center in the image.
  function addGear(svg, opt) {
    var size = opt.rp / PITCH;
    var outer = mk('g', { transform: 'translate(' + opt.cx.toFixed(1) + ' ' + opt.cy.toFixed(1) + ')', filter: 'url(#gwShadow)' }, svg);
    var bump = mk('g', { 'class': 'gear-bump' }, outer);
    var rot = mk('g', {}, bump);
    mk('image', { href: 'assets/gears/' + opt.img + '.webp', x: -size / 2, y: -size / 2, width: size, height: size }, rot);
    var g = { id: opt.id, teeth: opt.teeth, phase: opt.phase, cx: opt.cx, cy: opt.cy, rp: opt.rp, rot: rot, bump: bump, angle: 0 };
    gears[opt.id] = g;
    return g;
  }

  function at(from, dist, dirDeg) {
    return { cx: from.cx + dist * Math.cos(rad(dirDeg)), cy: from.cy + dist * Math.sin(rad(dirDeg)) };
  }

  // Angle a gear must sit at so its teeth slot between the driver's teeth.
  function meshAngle(driver, gear) {
    var theta = Math.atan2(gear.cy - driver.cy, gear.cx - driver.cx);
    return theta + Math.PI + (theta - driver.angle) * driver.teeth / gear.teeth - Math.PI / gear.teeth;
  }

  // The gear train:  drive (8) -> compound (12, with a 7 tooth pinion in front) -> big (15).
  var TRAIN = {
    module1: 9.015,            // tooth size for drive <-> compound
    bigRp: 162.1,          // sized so the gears sit on the mounts in Mara's machine wall
    big:   { img: 'gear_brass_02', teeth: 15, phase: 5.71 },
    comp:  { img: 'gear_brass_04', teeth: 12, phase: 15.22 },
    pin:   { img: 'gear_brass_06', teeth: 7,  phase: 38.03 },
    drive: { img: 'gear_brass_05', teeth: 8,  phase: 21.43 }
  };
  var RATIO = (TRAIN.big.teeth / TRAIN.pin.teeth) * (TRAIN.comp.teeth / TRAIN.drive.teeth);
  var drive;

  function build(svg) {
    svg.setAttribute('viewBox', '0 0 ' + VIEW.w + ' ' + VIEW.h);
    defs(svg); wall(svg);
    var T = TRAIN, m2 = T.bigRp / T.big.teeth;
    // Axle positions measured from the mounts painted on the wall.
    var bigPos = { cx: 616.4, cy: 466.5 };
    var pinRp = m2 * T.pin.teeth;
    var compPos = { cx: 385.2, cy: 521.5 };
    var compRp = T.module1 * T.comp.teeth, driveRp = T.module1 * T.drive.teeth;
    var drivePos = { cx: 211.3, cy: 473.7 };

    hatch(svg);
    var comp = addGear(svg, { id: 'comp', img: T.comp.img, teeth: T.comp.teeth, phase: T.comp.phase, rp: compRp, cx: compPos.cx, cy: compPos.cy });
    addGear(svg, { id: 'big', img: T.big.img, teeth: T.big.teeth, phase: T.big.phase, rp: T.bigRp, cx: bigPos.cx, cy: bigPos.cy });
    addGear(svg, { id: 'pin', img: T.pin.img, teeth: T.pin.teeth, phase: T.pin.phase, rp: pinRp, cx: compPos.cx, cy: compPos.cy });
    drive = addGear(svg, { id: 'drive', img: T.drive.img, teeth: T.drive.teeth, phase: T.drive.phase, rp: driveRp, cx: drivePos.cx, cy: drivePos.cy });
    comp.rot.parentNode.parentNode.removeAttribute('filter'); // sits behind, keep its shadow soft
    vignette(svg);

    var ring = mk('circle', { 'class': 'tap-ring', cx: drive.cx, cy: drive.cy, r: driveRp * 1.35, fill: 'none', stroke: '#ffe08a', 'stroke-width': 5 }, svg);
    ring.style.transformOrigin = drive.cx + 'px ' + drive.cy + 'px';
    var label = mk('text', { 'class': 'tap-label', x: drive.cx, y: drive.cy + driveRp * 1.35 + 44, 'text-anchor': 'middle' }, svg);
    label.textContent = 'TAP!';
  }

  function setRot(g) {
    g.rot.setAttribute('transform', 'rotate(' + (deg(g.angle) - g.phase).toFixed(2) + ')');
  }

  // bigDeg is the display angle of the big gear in degrees.
  function update(bigDeg) {
    var G = gears;
    G.drive.angle = rad(bigDeg * RATIO);
    G.comp.angle = meshAngle(G.drive, G.comp);
    G.pin.angle = G.comp.angle;
    G.big.angle = meshAngle(G.pin, G.big);
    ['drive', 'comp', 'pin', 'big'].forEach(function (id) { setRot(G[id]); });
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
  function hatchMouth() { return pct(HATCH.x + HATCH.w / 2, HATCH.y + HATCH.h / 2); }
  function driveCenter() { return pct(drive.cx, drive.cy); }

  return { build: build, update: update, bumpDrive: bumpDrive, openFlap: openFlap, hatchMouth: hatchMouth, driveCenter: driveCenter, VIEW: VIEW };
})();
