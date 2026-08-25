import React, {useMemo} from 'react';
import * as THREE from 'three';
import {Line} from '@react-three/drei';

/**
 * A single beam of light visibly bending inward toward the horizon (beat
 * 12 — "not even light" escapes). A quadratic bezier curve (straight-ish
 * start, bent hard toward the origin) stands in for gravity bending the
 * light's path.
 *
 * BUG FOUND + FIXED: this used to fade the curve toward its horizon end
 * (a few segments of decreasing opacity, brightest at the far/off-screen
 * start and dimmest at the horizon) to depict light fading as it's pulled
 * in. But at this beat's camera framing, the far/start end of the curve
 * sits off-frame — the ONLY part actually ever visible on screen is the
 * horizon-adjacent end, which is exactly the end that fade was dimming.
 * The result (confirmed via direct still-frame checks after already
 * fixing a separate progress/opacity-timing bug) was a beam that stayed a
 * barely-visible thin line no matter when in the beat you looked, because
 * the one visible segment was always at ~25% brightness by design. Fixed
 * by drawing the visible portion at uniform full brightness and letting
 * `opacity` (driven by physics.ts, already fixed to hold at 1 during a
 * real "fully drawn and bright" window before fading only in the beat's
 * last frames) carry the actual "fades out" beat — over TIME, not space.
 */
export const LightBeam: React.FC<{
  progress: number; // 0 = beam not yet visible, 1 = fully bent in toward the horizon
  opacity?: number;
  color?: string;
}> = ({progress, opacity = 1, color = '#d8ecff'}) => {
  // BUG FOUND + FIXED (round 2): this path was designed for beat 11-13's
  // ORIGINAL camera distances (~2-2.4 units from origin) before those were
  // found to be far too close (see cameraTimeline.ts's beat 11 note) and
  // corrected to ~7-8 units. At that closer distance the start point
  // (-8, 2.2, 3.5) sat off-frame, which the fade-direction fix above
  // accounted for — but at the corrected ~7-8 unit distance the situation
  // flipped: the whole curve, including its horizon end, fell outside the
  // (now much wider) frustum on the side, so nothing was visible at all.
  // Confirmed via a direct still-frame check post-camera-fix. Rescaled the
  // whole path inward to sit comfortably within the corrected framing.
  const fullCurvePoints = useMemo(() => {
    const start = new THREE.Vector3(2.6, 1.6, 1.0);
    const control = new THREE.Vector3(0.8, 0.5, 0.35);
    const end = new THREE.Vector3(0.15, 0.05, 0.1); // just grazing the horizon, not dead-center
    const curve = new THREE.QuadraticBezierCurve3(start, control, end);
    return curve.getPoints(48);
  }, []);

  if (opacity <= 0.001 || progress <= 0.001) return null;

  const visibleCount = Math.max(2, Math.round(fullCurvePoints.length * THREE.MathUtils.clamp(progress, 0, 1)));
  const visiblePoints = fullCurvePoints.slice(0, visibleCount);

  return (
    <Line points={visiblePoints} color={color} transparent opacity={opacity} lineWidth={4} toneMapped={false} />
  );
};
