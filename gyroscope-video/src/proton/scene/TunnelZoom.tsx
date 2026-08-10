import React, {useMemo} from 'react';
import * as THREE from 'three';
import {Line} from '@react-three/drei';

const RING_COUNT = 36;

/**
 * A fixed "hyperspace tunnel" of receding rings along +Z that the camera
 * dollies through during the continuous hair -> atom zoom. Log-spaced so
 * rings appear to whip past faster as the camera accelerates deeper in —
 * colored from warm (skin/hair) to cool (molecular/atomic) along its
 * length so the trip visually reads as changing scale, not just speed.
 */
export const TunnelZoom: React.FC<{visible: boolean; opacity: number; length?: number}> = ({
  visible,
  opacity,
  length = 60,
}) => {
  const rings = useMemo(() => {
    const arr: {z: number; radius: number; color: string}[] = [];
    for (let i = 1; i <= RING_COUNT; i++) {
      const t = i / RING_COUNT;
      const z = -Math.pow(t, 1.6) * length;
      const radius = THREE.MathUtils.lerp(0.9, 2.6, Math.sin(t * Math.PI * 3) * 0.15 + t);
      const warm = new THREE.Color('#caa06a');
      const cool = new THREE.Color('#6fa8ff');
      const color = warm.clone().lerp(cool, t).getStyle();
      arr.push({z, radius, color});
    }
    return arr;
  }, [length]);

  if (!visible || opacity <= 0.001) return null;

  return (
    <group>
      {rings.map((r, i) => {
        const points: THREE.Vector3[] = [];
        for (let a = 0; a <= 48; a++) {
          const ang = (a / 48) * Math.PI * 2;
          points.push(new THREE.Vector3(Math.cos(ang) * r.radius, Math.sin(ang) * r.radius, r.z));
        }
        return <Line key={i} points={points} color={r.color} lineWidth={2} transparent opacity={opacity * 0.8} toneMapped={false} />;
      })}
    </group>
  );
};
