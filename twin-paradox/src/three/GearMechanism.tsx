import React, {useMemo} from 'react';
import * as THREE from 'three';

// A single procedural gear: a cylinder with small box "teeth" around the rim.
const Gear: React.FC<{
  radius: number;
  teeth: number;
  thickness?: number;
  position: [number, number, number];
  angle: number;
  color?: string;
}> = ({radius, teeth, thickness = 0.22, position, angle, color = '#c9b27a'}) => {
  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color,
        metalness: 0.85,
        roughness: 0.32,
      }),
    [color]
  );

  const toothMeshes = useMemo(() => {
    return new Array(teeth).fill(0).map((_, i) => {
      const a = (i / teeth) * Math.PI * 2;
      return {
        pos: [Math.cos(a) * (radius + 0.09), Math.sin(a) * (radius + 0.09), 0] as [
          number,
          number,
          number
        ],
        rot: a,
      };
    });
  }, [teeth, radius]);

  return (
    <group position={position} rotation={[0, 0, angle]}>
      <mesh material={mat} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[radius, radius, thickness, 32]} />
      </mesh>
      <mesh material={mat}>
        <cylinderGeometry args={[radius * 0.18, radius * 0.18, thickness * 1.4, 16]} />
      </mesh>
      {toothMeshes.map((t, i) => (
        <mesh key={i} material={mat} position={t.pos} rotation={[0, 0, t.rot]}>
          <boxGeometry args={[0.16, 0.16, thickness]} />
        </mesh>
      ))}
    </group>
  );
};

export interface GearMechanismProps {
  position?: [number, number, number];
  scale?: number;
  visible?: boolean;
  time?: number; // drives rotation, radians-ish accumulator
}

// Three meshing gears (macro shot: "the clock mechanism").
export const GearMechanism: React.FC<GearMechanismProps> = ({
  position = [0, 0, 0],
  scale = 1,
  visible = true,
  time = 0,
}) => {
  if (!visible) return null;

  // Gear centers spaced so an 18-tooth gear (r=1.1) meshes with two
  // 10-tooth gears (r=0.65): center distance ~= r1+r2.
  const bigR = 1.1;
  const smallR = 0.65;
  const dist = bigR + smallR + 0.03;

  return (
    <group position={position} scale={scale}>
      <Gear radius={bigR} teeth={18} position={[0, 0, 0]} angle={time} color="#d8bf7f" />
      <Gear
        radius={smallR}
        teeth={10}
        position={[dist * Math.cos(Math.PI * 0.28), dist * Math.sin(Math.PI * 0.28), 0.02]}
        angle={-time * (bigR / smallR)}
        color="#bfa25f"
      />
      <Gear
        radius={smallR}
        teeth={10}
        position={[dist * Math.cos(-Math.PI * 0.55), dist * Math.sin(-Math.PI * 0.55), -0.02]}
        angle={-time * (bigR / smallR)}
        color="#bfa25f"
      />
    </group>
  );
};
