import React from 'react';
import {Obj3DState} from '../types';

const SKIN = '#e2b18c';

/**
 * A deliberately simple, stylized hand — a flattened palm block plus five
 * capsule "fingers" — not an anatomically detailed model, per the brief.
 * `curl` (0 = relaxed/open, 1 = wrapped tight) and `press` (0-1, extends
 * just the index finger further/forward) drive the whole gesture from two
 * numbers so the same component covers the pickup, press, and catch beats.
 */
export const Hand: React.FC<{state: Obj3DState; curl?: number; press?: number}> = ({state, curl = 0.6, press = 0}) => {
  if (!state.visible || state.opacity <= 0.001) return null;
  const op = state.opacity;
  const skinMat = <meshStandardMaterial color={SKIN} roughness={0.75} metalness={0.02} transparent={op < 1} opacity={op} />;

  const fingerBend = curl * 1.15; // radians of downward curl at the knuckle

  const fingers = [-0.24, -0.08, 0.08, 0.24].map((x, i) => {
    const isIndex = i === 1;
    const len = 0.42 - Math.abs(x) * 0.12; // middle fingers slightly longer
    const extra = isIndex ? press : 0;
    return (
      <group
        key={i}
        position={[x, 0.22, 0.05 + extra * 0.16]}
        rotation={[-fingerBend + extra * 0.5, 0, 0]}
      >
        <mesh position={[0, len / 2, 0]}>
          <capsuleGeometry args={[0.045, len, 4, 8]} />
          {skinMat}
        </mesh>
      </group>
    );
  });

  return (
    <group position={state.position} rotation={state.rotation} scale={state.scale}>
      {/* palm */}
      <mesh>
        <boxGeometry args={[0.62, 0.5, 0.16]} />
        {skinMat}
      </mesh>
      {fingers}
      {/* thumb */}
      <group position={[-0.36, -0.02, 0.1]} rotation={[0, 0, 0.9 - curl * 0.6]}>
        <mesh position={[0, 0.16, 0]}>
          <capsuleGeometry args={[0.05, 0.3, 4, 8]} />
          {skinMat}
        </mesh>
      </group>
    </group>
  );
};
