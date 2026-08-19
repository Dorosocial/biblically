import React from 'react';
import {RoundedBox} from '@react-three/drei';
import {Obj3DState} from '../types';

const BODY_W = 0.74;
const BODY_H = 1.52;
const BODY_D = 0.09;

/**
 * A procedurally-built phone — no model sourcing. A rounded metal body
 * (the "metallic edge trim"), a slightly-inset glossy glass face that
 * catches specular highlights for the glint/macro-detail beats, and a
 * small camera-lens bump on the back for extra procedural macro detail
 * ordinary phones actually have.
 */
export const Phone: React.FC<{state: Obj3DState; glintIntensity?: number}> = ({state, glintIntensity = 0}) => {
  if (!state.visible || state.opacity <= 0.001) return null;
  const op = state.opacity;
  return (
    <group position={state.position} rotation={state.rotation} scale={state.scale}>
      {/* metal body / edge trim */}
      <RoundedBox args={[BODY_W, BODY_H, BODY_D]} radius={0.07} smoothness={4}>
        <meshStandardMaterial color="#c7cdd6" metalness={0.9} roughness={0.28} transparent={op < 1} opacity={op} />
      </RoundedBox>
      {/* glossy glass screen face — kept off pure-black: a mirror-black
          material only reads as anything when a highlight lands exactly in
          frame, which an extreme macro crop (shots E/F) can't guarantee */}
      <RoundedBox args={[BODY_W - 0.035, BODY_H - 0.035, 0.008]} radius={0.055} smoothness={4} position={[0, 0, BODY_D / 2 + 0.003]}>
        <meshPhysicalMaterial
          color="#12141d"
          metalness={0}
          roughness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.08}
          reflectivity={1}
          transparent={op < 1}
          opacity={op}
        />
      </RoundedBox>
      {/* camera-lens bump on the back — extra procedural macro detail */}
      <mesh position={[BODY_W / 2 - 0.16, BODY_H / 2 - 0.22, -BODY_D / 2 - 0.006]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.012, 24]} />
        <meshStandardMaterial color="#0c0d10" metalness={0.7} roughness={0.35} transparent={op < 1} opacity={op} />
      </mesh>
      {/* moving specular sweep — "the viewer's own perspective" glinting off the glass */}
      {glintIntensity > 0.01 && (
        <pointLight position={[0.15 - glintIntensity * 0.3, 0.4, BODY_D / 2 + 0.25]} intensity={glintIntensity * 7} distance={1.5} color="#eaf3ff" />
      )}
    </group>
  );
};
