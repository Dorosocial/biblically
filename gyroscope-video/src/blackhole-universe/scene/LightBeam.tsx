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
  const fullCurvePoints = useMemo(() => {
    const start = new THREE.Vector3(-8, 2.2, 3.5);
    const control = new THREE.Vector3(-2, 1.2, 1.2);
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
