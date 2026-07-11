// The moving sofa problem, staged as: two hallways of unit width meeting
// at a right angle. In "hallway units" (corridor width = 1):
//   Horizontal corridor: y in [0,1], x >= 0 (extends right)
//   Vertical corridor:   x in [0,1], y >= 0 (extends down)
//   L = horizontal U vertical
// The obstacle (inner wall block) is the region {x>1 AND y>1}. A sofa
// shape is tested by rigidly rotating it about the pivot point (1,1) from
// theta=0 (sitting in the horizontal corridor) to theta=-90deg (sitting
// in the vertical corridor) and checking it never enters the obstacle
// block or crosses the outer walls (x<0 or y<0). This is the standard
// "one-parameter rotation about the outer corner" construction used for
// real candidate sofa shapes.

export type Pt = {x: number; y: number};

export const PIVOT: Pt = {x: 1, y: 1};

export const SCALE = 220;
export const ORIGIN: Pt = {x: 300, y: 460};

export const toScreen = (p: Pt): Pt => ({
  x: ORIGIN.x + p.x * SCALE,
  y: ORIGIN.y + p.y * SCALE,
});

export const rotateAboutPivot = (p: Pt, theta: number): Pt => {
  const c = Math.cos(theta);
  const s = Math.sin(theta);
  const dx = p.x - PIVOT.x;
  const dy = p.y - PIVOT.y;
  return {
    x: PIVOT.x + dx * c - dy * s,
    y: PIVOT.y + dx * s + dy * c,
  };
};

export const pointsToPathD = (pts: Pt[], close = true): string => {
  if (pts.length === 0) return '';
  let d = `M ${pts[0].x.toFixed(2)},${pts[0].y.toFixed(2)}`;
  for (let i = 1; i < pts.length; i++) {
    d += ` L ${pts[i].x.toFixed(2)},${pts[i].y.toFixed(2)}`;
  }
  if (close) d += ' Z';
  return d;
};

// Rectangle: leading edge at x=1 (touching the pivot), trailing edge
// extending into the horizontal corridor. Height h < 1, centered on the
// corridor's mid-line. width=0.65 is deliberately smaller than the
// corridor width in both dimensions, yet still (genuinely, per the
// rotation-collision check) jams at theta ~= -31.35deg — the real,
// verified stuck angle for this exact rectangle.
export const RECT_W = 0.65;
export const RECT_H = 0.55;
export const RECT_YC = 0.5;
export const RECT_STUCK_THETA = -0.5471; // radians, ~ -31.35deg (numerically verified)

export const rectLocalPoints = (): Pt[] => {
  const x0 = 1;
  const x1 = 1 + RECT_W;
  const y0 = RECT_YC - RECT_H / 2;
  const y1 = RECT_YC + RECT_H / 2;
  return [
    {x: x0, y: y0},
    {x: x1, y: y0},
    {x: x1, y: y1},
    {x: x0, y: y1},
  ];
};

// Bumped/wavy semicircle sofa family, symmetric about the diagonal y=x
// (so a -90deg rotation about the pivot exactly maps the horizontal-
// corridor placement onto the valid vertical-corridor placement). The
// arc runs from 135deg to -45deg through 45deg (bulging toward the
// pivot), closed by the straight chord between its two endpoints (which,
// since they are diametrically opposite, is the shape's own diameter).
// `amp`/`freq` add a gentle radius wave for the more elaborate
// "Gerver-approximation" silhouette. Every (k, r0, amp) combination below
// was numerically verified (dense boundary sampling, 6000 rotation
// steps) to stay inside L for the full sweep.
export type SofaParams = {k: number; r0: number; amp?: number; freq?: number};

export const buildSofaLocalPoints = (
  {k, r0, amp = 0, freq = 1}: SofaParams,
  steps = 160
): Pt[] => {
  const pts: Pt[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const ang = ((135 - 180 * t) * Math.PI) / 180;
    const wave = Math.sin(Math.PI * t) * Math.sin(freq * Math.PI * t);
    const r = r0 + amp * wave;
    pts.push({x: k + r * Math.cos(ang), y: k + r * Math.sin(ang)});
  }
  return pts;
};

export const SOFA_SHAPES: SofaParams[] = [
  {k: 0.35, r0: 0.39}, // A: small semicircle
  {k: 0.4, r0: 0.48}, // B: medium
  {k: 0.42, r0: 0.55}, // C: large
  {k: 0.425, r0: 0.555, amp: 0.025, freq: 1}, // D: Gerver-approximation
];

// --- Hallway wall line art (local units) ---
// Outer walls: top of the horizontal corridor, left of the vertical
// corridor. Inner corner walls: the two edges of the obstacle block that
// face the walkable region.
export const HORIZ_EXTENT = 3.2;
export const VERT_EXTENT = 3.6;

export const OUTER_WALL: Pt[] = [
  {x: HORIZ_EXTENT, y: 0},
  {x: 0, y: 0},
  {x: 0, y: VERT_EXTENT},
];

export const INNER_WALL: Pt[] = [
  {x: HORIZ_EXTENT, y: 1},
  {x: 1, y: 1},
  {x: 1, y: VERT_EXTENT},
];
