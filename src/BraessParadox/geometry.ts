// Pure geometry: node positions, road curves, and route sampling for car-dots.
// World space matches the final canvas 1:1 (1080 x 1920) so a "scale=1" camera
// shows the whole network without any transform.

export type Pt = {x: number; y: number};

type CubicSeg = {type: 'cubic'; p0: Pt; p1: Pt; p2: Pt; p3: Pt};
type QuadSeg = {type: 'quad'; p0: Pt; p1: Pt; p2: Pt};
export type Segment = CubicSeg | QuadSeg;

const lerp = (a: Pt, b: Pt, t: number): Pt => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
});

const cubicPoint = (seg: CubicSeg, t: number): Pt => {
  const {p0, p1, p2, p3} = seg;
  const mt = 1 - t;
  const x =
    mt * mt * mt * p0.x +
    3 * mt * mt * t * p1.x +
    3 * mt * t * t * p2.x +
    t * t * t * p3.x;
  const y =
    mt * mt * mt * p0.y +
    3 * mt * mt * t * p1.y +
    3 * mt * t * t * p2.y +
    t * t * t * p3.y;
  return {x, y};
};

const quadPoint = (seg: QuadSeg, t: number): Pt => {
  const {p0, p1, p2} = seg;
  const mt = 1 - t;
  const x = mt * mt * p0.x + 2 * mt * t * p1.x + t * t * p2.x;
  const y = mt * mt * p0.y + 2 * mt * t * p1.y + t * t * p2.y;
  return {x, y};
};

export const segmentPoint = (seg: Segment, t: number): Pt =>
  seg.type === 'cubic' ? cubicPoint(seg, t) : quadPoint(seg, t);

export const reverseSegment = (seg: Segment): Segment =>
  seg.type === 'cubic'
    ? {type: 'cubic', p0: seg.p3, p1: seg.p2, p2: seg.p1, p3: seg.p0}
    : {type: 'quad', p0: seg.p2, p1: seg.p1, p2: seg.p0};

// De Casteljau split of a cubic bezier at t, exact subdivision of the curve.
const splitCubic = (seg: CubicSeg, t: number): {left: CubicSeg; right: CubicSeg} => {
  const {p0, p1, p2, p3} = seg;
  const p01 = lerp(p0, p1, t);
  const p12 = lerp(p1, p2, t);
  const p23 = lerp(p2, p3, t);
  const p012 = lerp(p01, p12, t);
  const p123 = lerp(p12, p23, t);
  const p0123 = lerp(p012, p123, t);
  return {
    left: {type: 'cubic', p0, p1: p01, p2: p012, p3: p0123},
    right: {type: 'cubic', p0: p0123, p1: p123, p2: p23, p3},
  };
};

export const segmentsToPathD = (segments: Segment[]): string => {
  const first = segments[0];
  let d = `M ${first.p0.x},${first.p0.y}`;
  for (const seg of segments) {
    if (seg.type === 'cubic') {
      d += ` C ${seg.p1.x},${seg.p1.y} ${seg.p2.x},${seg.p2.y} ${seg.p3.x},${seg.p3.y}`;
    } else {
      d += ` Q ${seg.p1.x},${seg.p1.y} ${seg.p2.x},${seg.p2.y}`;
    }
  }
  return d;
};

// Constant-speed sampler along a chain of segments, built once from arc-length samples.
export type RouteSampler = (t: number) => Pt;

export const buildRouteSampler = (segments: Segment[]): RouteSampler => {
  const samplesPerSeg = 48;
  const pts: Pt[] = [];
  segments.forEach((seg, segIndex) => {
    const startI = segIndex === 0 ? 0 : 1;
    for (let i = startI; i <= samplesPerSeg; i++) {
      pts.push(segmentPoint(seg, i / samplesPerSeg));
    }
  });
  const dists: number[] = [0];
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i].x - pts[i - 1].x;
    const dy = pts[i].y - pts[i - 1].y;
    dists.push(dists[i - 1] + Math.sqrt(dx * dx + dy * dy));
  }
  const total = dists[dists.length - 1];

  return (t: number): Pt => {
    const clamped = Math.max(0, Math.min(1, t));
    const target = clamped * total;
    let lo = 0;
    let hi = dists.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (dists[mid] < target) lo = mid + 1;
      else hi = mid;
    }
    const i = Math.max(1, lo);
    const d0 = dists[i - 1];
    const d1 = dists[i];
    const localT = d1 > d0 ? (target - d0) / (d1 - d0) : 0;
    return lerp(pts[i - 1], pts[i], localT);
  };
};

// ---- Network layout ----

export const NODE_A: Pt = {x: 540, y: 260};
export const NODE_B: Pt = {x: 540, y: 1560};

export const ROAD_LEFT: CubicSeg = {
  type: 'cubic',
  p0: NODE_A,
  p1: {x: 180, y: 640},
  p2: {x: 180, y: 1180},
  p3: NODE_B,
};

export const ROAD_RIGHT: CubicSeg = {
  type: 'cubic',
  p0: NODE_A,
  p1: {x: 900, y: 640},
  p2: {x: 900, y: 1180},
  p3: NODE_B,
};

const roadLeftSplit = splitCubic(ROAD_LEFT, 0.5);
const roadRightSplit = splitCubic(ROAD_RIGHT, 0.5);

export const ROAD_LEFT_A = roadLeftSplit.left; // A -> M1
export const ROAD_LEFT_B = roadLeftSplit.right; // M1 -> B
export const ROAD_RIGHT_A = roadRightSplit.left; // A -> M2
export const ROAD_RIGHT_B = roadRightSplit.right; // M2 -> B

export const NODE_M1: Pt = ROAD_LEFT_A.p3;
export const NODE_M2: Pt = ROAD_RIGHT_A.p3;

export const SHORTCUT: QuadSeg = {
  type: 'quad',
  p0: NODE_M1,
  p1: {x: (NODE_M1.x + NODE_M2.x) / 2, y: (NODE_M1.y + NODE_M2.y) / 2 - 40},
  p2: NODE_M2,
};

export const PATH_D = {
  roadLeft: segmentsToPathD([ROAD_LEFT]),
  roadRight: segmentsToPathD([ROAD_RIGHT]),
  shortcut: segmentsToPathD([SHORTCUT]),
};

// Routes: pure roads (pre-shortcut / post-removal) and the two paradox-era
// mixed routes that funnel through the shortcut via the chokepoints M1/M2.
export const ROUTE_LEFT = buildRouteSampler([ROAD_LEFT]);
export const ROUTE_RIGHT = buildRouteSampler([ROAD_RIGHT]);
export const ROUTE_MIX_VIA_M1_FIRST = buildRouteSampler([ROAD_LEFT_A, SHORTCUT, ROAD_RIGHT_B]);
export const ROUTE_MIX_VIA_M2_FIRST = buildRouteSampler([
  ROAD_RIGHT_A,
  reverseSegment(SHORTCUT),
  ROAD_LEFT_B,
]);
