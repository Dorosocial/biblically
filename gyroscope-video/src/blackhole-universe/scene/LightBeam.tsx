import React, {useMemo} from 'react';
import * as THREE from 'three';
import {Line} from '@react-three/drei';

/**
 * A single beam of light visibly bending inward and fading out near the
 * horizon (beat 12 — "not even light" escapes). A quadratic bezier curve
 * (straight-ish start, bent hard toward the origin) stands in for gravity
 * bending the light's path; the beam's own opacity ramps down toward its
 * horizon-ward end via per-segment opacity isn't supported by drei's <Line>
 * in one draw call, so it's approximated with a few overlapping segments
 * of decreasing opacity — cheap, and reads fine at this line thickness.
 */
export const LightBeam: React.FC<{
  progress: number; // 0 = beam not yet visible, 1 = fully bent in and faded at the horizon
  opacity?: number;
  color?: string;
}> = ({progress, opacity = 1, color = '#bfe0ff'}) => {
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

  // Split into a few chunks with decreasing opacity toward the horizon end,
  // so the beam visibly fades as it approaches/bends in rather than
  // stopping abruptly.
  const CHUNKS = 4;
  const chunkSize = Math.max(1, Math.floor(visiblePoints.length / CHUNKS));

  return (
    <group>
      {Array.from({length: CHUNKS}).map((_, i) => {
        const from = i * chunkSize;
        const to = i === CHUNKS - 1 ? visiblePoints.length : (i + 1) * chunkSize + 1;
        const chunk = visiblePoints.slice(from, to);
        if (chunk.length < 2) return null;
        const fadeToward = 1 - i / CHUNKS; // brighter near the start, dimmer near the horizon
        return (
          <Line
            key={i}
            points={chunk}
            color={color}
            transparent
            opacity={opacity * fadeToward}
            lineWidth={2.5}
            toneMapped={false}
          />
        );
      })}
    </group>
  );
};
