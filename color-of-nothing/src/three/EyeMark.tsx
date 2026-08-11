import React, {useMemo} from 'react';
import * as THREE from 'three';
import {gentleSine} from './lib/utils';
import {EYE_RIM_DIM, EYE_RIM_BRIGHT} from './lib/palette';
import {getDotTexture} from './lib/dotTexture';

interface SingleEyeProps {
  position: [number, number, number];
  radius: number;
  rimOpacity: number;
  rimColor: string;
  lensOpacity: number;
  seconds: number;
  pulsePhase: number;
}

/** One dark lens: a near-invisible flat disc with a hair-thin reflective rim
 *  that visibly breathes — a soft glow halo pulsing under it. */
const SingleEye: React.FC<SingleEyeProps> = ({
  position,
  radius,
  rimOpacity,
  rimColor,
  lensOpacity,
  seconds,
  pulsePhase,
}) => {
  // A genuine breathing cycle: faster and more pronounced than a barely-there
  // shimmer, so the "alive, pulsing glow" reads even when nothing else moves.
  const breath = 0.5 + gentleSine(seconds, 3.4, 0.5, pulsePhase);
  const pulse = 1 + breath * 0.16;
  const tubeRadius = radius * 0.02;

  return (
    <group position={position}>
      {/* soft glow halo behind the rim — this is what sells "glowing", not just a thin line */}
      <sprite scale={[radius * 3.2, radius * 3.2, 1]}>
        <spriteMaterial
          map={getDotTexture()}
          color={rimColor}
          transparent
          opacity={rimOpacity * (0.35 + breath * 0.5)}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
      {/* the lens itself: almost pure black, barely distinguishable from the void */}
      <mesh>
        <circleGeometry args={[radius * 0.96, 48]} />
        <meshBasicMaterial color="#020202" transparent opacity={lensOpacity} />
      </mesh>
      {/* the thin reflective rim */}
      <mesh scale={[pulse, pulse, 1]}>
        <torusGeometry args={[radius, tubeRadius, 16, 64]} />
        <meshBasicMaterial color={rimColor} transparent opacity={rimOpacity * pulse} />
      </mesh>
    </group>
  );
};

interface EyeMarkProps {
  /** Overall opacity multiplier, 0..1 — drives fade in/out. */
  opacity: number;
  /** World-space center point between the two lenses. */
  center?: [number, number, number];
  /** Distance between the two lenses. */
  gap?: number;
  radius?: number;
  /** How bright/visible the rim reads — kept tiny for the recurring motif, higher for diagram use. */
  rimStrength?: number;
  seconds: number;
  z?: number;
}

/**
 * The recurring "eyes" motif: two dark circular lens shapes with a very thin,
 * barely-visible reflective rim. Not cartoon eyes — intentionally almost
 * unnoticeable. Also reused (at higher rimStrength/scale) as the more overt
 * diagram eye in the photon/neural-pathway explainer beats.
 */
export const EyeMark: React.FC<EyeMarkProps> = ({
  opacity,
  center = [0, 0, 0],
  gap = 0.62,
  radius = 0.32,
  rimStrength = 0.22,
  seconds,
  z = 0,
}) => {
  const rimColor = useMemo(
    () => new THREE.Color(EYE_RIM_DIM).lerp(new THREE.Color(EYE_RIM_BRIGHT), 0.4).getStyle(),
    [],
  );

  if (opacity <= 0.002) return null;

  return (
    <group position={[center[0], center[1], center[2] + z]}>
      <SingleEye
        position={[-gap / 2, 0, 0]}
        radius={radius}
        rimOpacity={rimStrength * opacity}
        rimColor={rimColor}
        lensOpacity={0.5 * opacity}
        seconds={seconds}
        pulsePhase={0}
      />
      <SingleEye
        position={[gap / 2, 0, 0]}
        radius={radius}
        rimOpacity={rimStrength * opacity}
        rimColor={rimColor}
        lensOpacity={0.5 * opacity}
        seconds={seconds}
        pulsePhase={Math.PI * 0.6}
      />
    </group>
  );
};
