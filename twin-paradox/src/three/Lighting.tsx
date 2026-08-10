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
  keyIntensity = 5,
  ambientIntensity = 0.85,
  keyColor = '#d9e6ff',
  ambientColor = '#5a6ea0',
}) => {
  return (
    <>
      <ambientLight color={ambientColor} intensity={ambientIntensity} />
      <directionalLight
        color={keyColor}
        intensity={keyIntensity}
        position={[40, 30, 20]}
      />
      {/* soft cool rim from behind, keeps silhouettes readable on the dark backdrop */}
      <directionalLight color="#6ea8ff" intensity={1.4} position={[-30, 10, -25]} />
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

export const BACKDROP_COLOR = '#0a1020';
export const FOG = new THREE.FogExp2(0x0a1020, 0.0038);
