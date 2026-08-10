import React from 'react';
import * as THREE from 'three';

// All lighting is authored in code — no HDRI / environment map anywhere.
// A soft ambient fill keeps nothing pure-black, one directional "key" light
// gives everything a consistent sense of a sun, and a focus light (point or
// spot, per-shot) is aimed at whatever the camera wants us to read right now
// — a tight rim on a clock in a macro shot, a broad fill across Earth/grid
// wide shots.

export interface FocusLight {
  position: [number, number, number];
  target?: [number, number, number];
  color?: string;
  intensity?: number;
  distance?: number;
  kind?: 'point' | 'spot';
  angle?: number;
  penumbra?: number;
}

export const Lighting: React.FC<{
  focus?: FocusLight | null;
  keyIntensity?: number;
  ambientIntensity?: number;
  keyColor?: string;
  ambientColor?: string;
}> = ({
  focus,
  keyIntensity = 7.5,
  ambientIntensity = 1.5,
  keyColor = '#e4ecff',
  ambientColor = '#7c8fc4',
}) => {
  return (
    <>
      <ambientLight color={ambientColor} intensity={ambientIntensity} />
      <directionalLight
        color={keyColor}
        intensity={keyIntensity}
        position={[40, 30, 20]}
      />
      {/* soft cool rim from behind, keeps silhouettes readable on the backdrop */}
      <directionalLight color="#8fbaff" intensity={2.4} position={[-30, 10, -25]} />
      {/* front fill, roughly camera-ward -- keeps the near/unlit side of
          Earth and other big objects from crushing to near-black */}
      <directionalLight color="#9fc6ff" intensity={1.8} position={[0, 6, 40]} />
      {focus ? (
        focus.kind === 'spot' ? (
          <spotLight
            position={focus.position}
            target-position={focus.target ?? [0, 0, 0]}
            color={focus.color ?? '#ffffff'}
            intensity={focus.intensity ?? 3}
            distance={focus.distance ?? 40}
            angle={focus.angle ?? 0.5}
            penumbra={focus.penumbra ?? 0.6}
            decay={1}
          />
        ) : (
          <pointLight
            position={focus.position}
            color={focus.color ?? '#ffffff'}
            intensity={focus.intensity ?? 3}
            distance={focus.distance ?? 40}
            decay={1}
          />
        )
      ) : null}
    </>
  );
};

// A richer, lighter navy than pure black -- keeps the "plain backdrop"
// requirement while giving the glow/metal/texture work something to pop
// against instead of crushing to near-black on export.
export const BACKDROP_COLOR = '#182036';
export const FOG = new THREE.FogExp2(0x182036, 0.0032);
