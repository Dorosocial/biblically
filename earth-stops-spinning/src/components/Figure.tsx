import React from 'react';
import {degToRad} from '../physics/rotation';
import {theme} from '../theme';

// ---------------------------------------------------------------------------
// Figure -- the channel's one and only human figure component.
//
// Minimal, geometric, faceless: a head circle, a rounded-capsule torso, and
// four limbs, each a straight rounded-cap segment chain (shoulder->elbow
// ->hand, hip->knee->foot). No face, no clothing -- a kinematic diagram
// figure, not a cartoon character.
//
// Every pose is just numbers. There is no per-pose artwork anywhere in this
// file: a "pose" is a `FigureJoints` object, and the component turns those
// angles into segment endpoints with the same angle-in/position-out trig
// pattern as physics/rotation.ts (see `segmentEnd` below).
//
// Joint-angle convention (all degrees):
//   - shoulderL/R and hipL/R are ABSOLUTE angles measured from "hanging
//     straight down" (0deg), positive rotating toward the figure's front
//     (+x in local space, before the `facing` mirror is applied).
//   - elbowL/R and kneeL/R are RELATIVE bends on top of their parent
//     segment's angle (elbow bend is added to the shoulder angle to get
//     the forearm's absolute angle) -- this is what makes a bent arm
//     actually continue from the upper arm instead of floating
//     disconnected.
//   - headTilt leans the head off the top of the neck (0 = upright).
//   - torsoTilt (an addition beyond the brief's joint list, needed to
//     actually build the "falling/tumbling, torso tilted" preset) rotates
//     the whole figure -- torso, arms, legs, head together -- around the
//     pelvis. Optional, defaults to 0.
//
// (x, y) anchors the figure at its PELVIS (hip-center), not its feet or
// its bounding-box corner -- that's the one point every pose agrees on.
// ---------------------------------------------------------------------------

export interface FigureJoints {
  shoulderL?: number;
  elbowL?: number;
  shoulderR?: number;
  elbowR?: number;
  hipL?: number;
  kneeL?: number;
  hipR?: number;
  kneeR?: number;
  headTilt?: number;
  /** Whole-body lean around the pelvis. Not in the original joint list --
   * added because "falling, torso tilted" isn't buildable without it. */
  torsoTilt?: number;
}

export interface FigureProps {
  x: number;
  y: number;
  scale?: number;
  color?: string;
  facing?: 'left' | 'right';
  joints?: FigureJoints;
}

// ---------------------------------------------------------------------------
// Pose presets. Reference these as `FIGURE_POSES.standing` etc, or more
// commonly via <PosedFigure pose="standing" .../> (PosedFigure.tsx), which
// is what scene files should actually import.
// ---------------------------------------------------------------------------
export const FIGURE_POSES = {
  // Relaxed, upright, arms hanging at the sides with a small natural bend.
  standing: {
    shoulderL: 6,
    elbowL: 4,
    shoulderR: -6,
    elbowR: -4,
    hipL: 0,
    kneeL: 0,
    hipR: 0,
    kneeR: 0,
    headTilt: 0,
    torsoTilt: 0,
  },
  // Mid-stride: leading (left) leg forward and nearly straight, trailing
  // (right) leg swept back with the knee folded up behind; arms swing
  // contralateral to the legs (right arm forward with the left leg).
  walking: {
    shoulderL: -45,
    elbowL: 20,
    shoulderR: 45,
    elbowR: -15,
    hipL: 40,
    kneeL: -8,
    hipR: -35,
    kneeR: -45,
    headTilt: 2,
    torsoTilt: 6,
  },
  // One arm raised out toward the side (mirrors with `facing`), the other
  // relaxed. Reads as "look at that" / "over there". Shoulder angles are
  // measured from hanging straight down toward the front (+x); a little
  // past horizontal (90deg) is a clean raised-and-out point.
  pointing: {
    shoulderL: 8,
    elbowL: 4,
    shoulderR: 104,
    elbowR: -10,
    hipL: 4,
    kneeL: 0,
    hipR: -4,
    kneeR: 0,
    headTilt: -8,
    torsoTilt: 0,
  },
  // Limbs loose and asymmetric, torso tilted hard -- off-balance, tumbling.
  falling: {
    shoulderL: -52,
    elbowL: 46,
    shoulderR: 68,
    elbowR: -38,
    hipL: 46,
    kneeL: -54,
    hipR: -36,
    kneeR: 58,
    headTilt: 20,
    torsoTilt: 24,
  },
} as const satisfies Record<string, Required<FigureJoints>>;

export type FigurePoseName = keyof typeof FIGURE_POSES;

// ---------------------------------------------------------------------------
// Geometry constants (local, unscaled units). Pelvis sits at local (0, 0);
// +y is down, matching the segment-angle convention (0deg = straight down).
// ---------------------------------------------------------------------------
const HEAD_RADIUS = 9;
const NECK = 5;
const TORSO_LEN = 44;
const SHOULDER_SPAN = 30;
const HIP_SPAN = 20;
const UPPER_ARM = 26;
const LOWER_ARM = 23;
const UPPER_LEG = 32;
const LOWER_LEG = 30;
const LIMB_WIDTH = 11;
const TORSO_WIDTH = 17;

// Drawing canvas (local svg pixel space, before the outer scale/facing
// transform). Pelvis lands at (PX, PY) inside it -- asymmetric on purpose,
// since a figure needs more headroom above the pelvis for an upstretched
// arm than it needs below (legs are a fixed, known length).
const VIEW_W = 220;
const VIEW_H = 250;
const PX = VIEW_W / 2;
const PY = 100;

/** angle-in, position-out, same pattern as physics/rotation.ts's
 * pointOnCircle: given a segment's origin/length/absolute-angle (0deg =
 * straight down), return where it ends. */
const segmentEnd = (origin: {x: number; y: number}, length: number, angleDeg: number) => {
  const a = degToRad(angleDeg);
  return {
    x: origin.x + length * Math.sin(a),
    y: origin.y + length * Math.cos(a),
  };
};

const Limb: React.FC<{
  a: {x: number; y: number};
  b: {x: number; y: number};
  color: string;
  width?: number;
}> = ({a, b, color, width = LIMB_WIDTH}) => (
  <line
    x1={a.x}
    y1={a.y}
    x2={b.x}
    y2={b.y}
    stroke={color}
    strokeWidth={width}
    strokeLinecap="round"
  />
);

export const Figure: React.FC<FigureProps> = ({
  x,
  y,
  scale = 1,
  color = theme.color.accentReference,
  facing = 'right',
  joints = {},
}) => {
  const j: Required<FigureJoints> = {...FIGURE_POSES.standing, ...joints};

  const pelvis = {x: 0, y: 0};
  const shoulderCenter = {x: 0, y: -TORSO_LEN};
  const shoulderL = {x: -SHOULDER_SPAN / 2, y: -TORSO_LEN};
  const shoulderR = {x: SHOULDER_SPAN / 2, y: -TORSO_LEN};
  const hipL = {x: -HIP_SPAN / 2, y: 0};
  const hipR = {x: HIP_SPAN / 2, y: 0};

  const elbowL = segmentEnd(shoulderL, UPPER_ARM, j.shoulderL);
  const handL = segmentEnd(elbowL, LOWER_ARM, j.shoulderL + j.elbowL);
  const elbowR = segmentEnd(shoulderR, UPPER_ARM, j.shoulderR);
  const handR = segmentEnd(elbowR, LOWER_ARM, j.shoulderR + j.elbowR);

  const kneeL = segmentEnd(hipL, UPPER_LEG, j.hipL);
  const footL = segmentEnd(kneeL, LOWER_LEG, j.hipL + j.kneeL);
  const kneeR = segmentEnd(hipR, UPPER_LEG, j.hipR);
  const footR = segmentEnd(kneeR, LOWER_LEG, j.hipR + j.kneeR);

  // Head hangs off the top of the neck; 180deg = straight up in our
  // "0 = down" convention, so headTilt leans it left/right from there.
  const headCenter = segmentEnd(shoulderCenter, NECK + HEAD_RADIUS, 180 + j.headTilt);

  const mirror = facing === 'left' ? -1 : 1;

  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `scaleX(${mirror})`, transformOrigin: '0 0'}}>
      <svg
        width={VIEW_W}
        height={VIEW_H}
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        style={{
          position: 'absolute',
          left: -PX * scale,
          top: -PY * scale,
          transform: `scale(${scale})`,
          transformOrigin: '0 0',
          overflow: 'visible',
        }}
      >
        <g transform={`translate(${PX} ${PY}) rotate(${j.torsoTilt})`}>
          {/* legs first so the torso/arms overlap them cleanly at the hips */}
          <Limb a={hipL} b={kneeL} color={color} />
          <Limb a={kneeL} b={footL} color={color} />
          <Limb a={hipR} b={kneeR} color={color} />
          <Limb a={kneeR} b={footR} color={color} />

          <Limb a={shoulderCenter} b={pelvis} color={color} width={TORSO_WIDTH} />

          <Limb a={shoulderL} b={elbowL} color={color} />
          <Limb a={elbowL} b={handL} color={color} />
          <Limb a={shoulderR} b={elbowR} color={color} />
          <Limb a={elbowR} b={handR} color={color} />

          <circle cx={headCenter.x} cy={headCenter.y} r={HEAD_RADIUS} fill={color} />
        </g>
      </svg>
    </div>
  );
};
