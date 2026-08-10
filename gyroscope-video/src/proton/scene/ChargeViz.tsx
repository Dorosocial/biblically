import React from 'react';
import {ObjectState} from '../types';

/** A soft pulsing halo of rings around the proton — the "+" positive-charge visualization. */
export const ChargeViz: React.FC<{state: ObjectState; frame: number}> = ({state, frame}) => {
  if (!state.visible || state.opacity <= 0.001) return null;
  const pulse = 1 + Math.sin(frame * 0.15) * 0.08;
  return (
    <group position={state.position} scale={state.scale * pulse}>
      {[1.5, 1.9, 2.3].map((r, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[r, 0.015, 8, 48]} />
          <meshBasicMaterial color="#ffb44d" transparent opacity={state.opacity * (0.5 - i * 0.13)} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
};
