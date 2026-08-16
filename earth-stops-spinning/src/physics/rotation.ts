// Core rotation math for the channel. The pattern used throughout: a pure
// function takes an angle (plus whatever else it needs) and returns a
// position -- never a mutable transform, never DOM/SVG-specific. Every
// other rotation-flavored helper in this codebase (including the limb
// forward-kinematics in components/Figure.tsx) follows this same shape:
// angle in, position out.

export interface Point {
  x: number;
  y: number;
}

export const degToRad = (deg: number): number => (deg * Math.PI) / 180;
export const radToDeg = (rad: number): number => (rad * 180) / Math.PI;

/**
 * The point at `radius` from `center`, at `angleDeg` measured clockwise
 * from straight up (12 o'clock = 0deg, 3 o'clock = 90deg). This is the
 * convention every "rides the circle" marker in this channel uses --
 * matches how a clock face or a compass bearing reads, which is easier to
 * reason about than raw trig convention when the thing on screen is
 * literally the Earth.
 */
export const pointOnCircle = (center: Point, radius: number, angleDeg: number): Point => {
  const a = degToRad(angleDeg - 90);
  return {
    x: center.x + radius * Math.cos(a),
    y: center.y + radius * Math.sin(a),
  };
};

/** The unit tangent direction (degrees, clock convention) at `angleDeg`
 * on a circle -- i.e. the direction something at that point would keep
 * moving in if it flew off the circle. Used to give an inertial marker
 * its drift heading the instant rotation stops. */
export const tangentHeading = (angleDeg: number): number => (angleDeg + 90) % 360;

export interface EarthRotationInput {
  frame: number;
  fps: number;
  /** How fast the marker sweeps around the circle, in degrees/second. */
  degreesPerSecond: number;
  /** Starting angle (degrees, clock convention). Defaults to 0. */
  startAngleDeg?: number;
}

/** Angle in, frame out (well -- frame in, angle out): where a marker
 * riding a steadily-rotating Earth sits at a given frame. */
export const earthRotationAngle = ({
  frame,
  fps,
  degreesPerSecond,
  startAngleDeg = 0,
}: EarthRotationInput): number => {
  const seconds = frame / fps;
  return (startAngleDeg + seconds * degreesPerSecond) % 360;
};
