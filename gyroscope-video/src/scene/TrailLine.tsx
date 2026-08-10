import React from 'react';
import {Line} from '@react-three/drei';
import * as THREE from 'three';

/**
 * Renders a static polyline built from points that were computed directly
 * from the physics timeline (see physics.ts's `*TrailPoints` helpers).
 *
 * IMPORTANT: this is NOT drei's <Trail> — that component accumulates its
 * point history via useFrame on the real-time render loop, which is not
 * safe for Remotion (frames can be rendered standalone/out of order during
 * export). Every point here is re-derived from `frame` upstream, so the
 * whole line is a pure function of the current frame, like everything else.
 */
export const TrailLine: React.FC<{
  points: THREE.Vector3[];
  color: string;
  opacity?: number;
  lineWidth?: number;
}> = ({points, color, opacity = 0.5, lineWidth = 2}) => {
  if (points.length < 2) return null;
  return (
    <Line
      points={points}
      color={color}
      transparent
      opacity={opacity}
      lineWidth={lineWidth}
      depthWrite={false}
      toneMapped={false}
    />
  );
};
