import React, {useMemo} from 'react';
import * as THREE from 'three';

export interface ClockFaceProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  visible?: boolean;
  glowColor?: string;
  handAngle?: number; // radians, drives the "ticking" second hand
  ringPulse?: number; // 0..1 extra emissive pulse (e.g. for "glowing frame" beats)
}

// Flat cylinder clock face + 12 tick marks + a sweeping hand + a glowing
// rim. The digital numeral ("5 YEARS" etc.) is an HTML overlay layered on
// top in Overlay.tsx, not 3D geometry/text.
export const ClockFace: React.FC<ClockFaceProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  visible = true,
  glowColor = '#7fe0ff',
  handAngle = 0,
  ringPulse = 0,
}) => {
  const faceMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#0e1626',
        metalness: 0.3,
        roughness: 0.4,
        emissive: new THREE.Color(glowColor),
        emissiveIntensity: 0.08,
      }),
    [glowColor]
  );
  const rimMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: glowColor,
        emissive: new THREE.Color(glowColor),
        emissiveIntensity: 1.1 + ringPulse * 1.5,
        metalness: 0.6,
        roughness: 0.25,
      }),
    [glowColor, ringPulse]
  );
  const tickMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: glowColor,
        emissive: new THREE.Color(glowColor),
        emissiveIntensity: 0.9,
      }),
    [glowColor]
  );

  const ticks = useMemo(() => {
    return new Array(12).fill(0).map((_, i) => {
      const a = (i / 12) * Math.PI * 2;
      const r = 1.55;
      return {
        pos: [Math.cos(a) * r, Math.sin(a) * r, 0.07] as [number, number, number],
        rot: [0, 0, a] as [number, number, number],
        big: i % 3 === 0,
      };
    });
  }, []);

  if (!visible) return null;

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* face */}
      <mesh material={faceMat} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.7, 1.7, 0.14, 48]} />
      </mesh>
      {/* glowing rim */}
      <mesh material={rimMat} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.7, 0.06, 16, 64]} />
      </mesh>
      {/* tick marks */}
      {ticks.map((t, i) => (
        <mesh key={i} material={tickMat} position={t.pos} rotation={t.rot}>
          <boxGeometry args={t.big ? [0.05, 0.22, 0.03] : [0.03, 0.12, 0.03]} />
        </mesh>
      ))}
      {/* sweeping hand */}
      <group rotation={[0, 0, -handAngle]}>
        <mesh position={[0, 0.6, 0.09]} material={tickMat}>
          <boxGeometry args={[0.045, 1.15, 0.03]} />
        </mesh>
      </group>
      {/* center hub */}
      <mesh position={[0, 0, 0.1]} material={rimMat}>
        <sphereGeometry args={[0.09, 12, 12]} />
      </mesh>
    </group>
  );
};
