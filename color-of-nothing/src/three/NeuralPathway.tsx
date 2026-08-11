import React, {useMemo} from 'react';
import * as THREE from 'three';
import {clamp01} from './lib/utils';

interface NeuralPathwayProps {
  from: [number, number, number];
  to: [number, number, number];
  /** How much of the path is drawn/lit, 0..1 (a "reveal" wipe from eye to brain). */
  reveal: number;
  /** Position (0..1) of an optional bright traveling pulse along the path; omit to hide it. */
  pulseT?: number;
  color?: string;
  opacity?: number;
  bow?: number;
}

/**
 * A simple glowing curved line representing the neural pathway from eye to
 * brain — built from a handful of overlaid thin tubes for a soft glow
 * without needing custom shaders.
 */
export const NeuralPathway: React.FC<NeuralPathwayProps> = ({
  from,
  to,
  reveal,
  pulseT,
  color = '#9fb4ff',
  opacity = 1,
  bow = 0.9,
}) => {
  const curve = useMemo(() => {
    const start = new THREE.Vector3(...from);
    const end = new THREE.Vector3(...to);
    const mid = start.clone().lerp(end, 0.5);
    mid.y += bow;
    mid.z += bow * 0.3;
    return new THREE.CatmullRomCurve3([start, mid, end]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from[0], from[1], from[2], to[0], to[1], to[2], bow]);

  const r = clamp01(reveal);
  const tubeGeo = useMemo(() => {
    if (r <= 0.01) return null;
    const segments = Math.max(2, Math.round(64 * r));
    const partial = curve.getPoints(64).slice(0, segments + 1);
    if (partial.length < 2) return null;
    const partialCurve = new THREE.CatmullRomCurve3(partial);
    return new THREE.TubeGeometry(partialCurve, segments, 0.012, 8, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curve, r]);

  const pulsePos = useMemo(() => {
    if (pulseT === undefined) return null;
    return curve.getPointAt(clamp01(pulseT));
  }, [curve, pulseT]);

  if (opacity <= 0.002 || !tubeGeo) return null;

  return (
    <group>
      {/* soft glow: three overlaid tubes of increasing radius / decreasing opacity */}
      <mesh geometry={tubeGeo}>
        <meshBasicMaterial color={color} transparent opacity={opacity * 0.9} />
      </mesh>
      <mesh geometry={tubeGeo} scale={[1, 1, 1]}>
        <meshBasicMaterial color={color} transparent opacity={opacity * 0.25} />
      </mesh>
      {pulsePos && (
        <mesh position={pulsePos}>
          <sphereGeometry args={[0.045, 12, 12]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={opacity} />
        </mesh>
      )}
    </group>
  );
};
