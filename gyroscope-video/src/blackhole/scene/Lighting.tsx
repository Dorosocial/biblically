import React from 'react';

export const BACKDROP_COLOR = '#020204';

/**
 * All lighting is built directly in the Three.js scene — no HDRI. A very
 * low ambient keeps deep space from ever being unreadable-flat-black;
 * one directional key light gives a consistent global light direction;
 * the accretion disk/halo/sun are self-illuminating (MeshBasicMaterial,
 * always "on" regardless of scene lights) rather than lit — that's what
 * "emissive glow as a key light source" means for a body that makes its
 * own light. `sunLight` is a separate optional point light standing in
 * for the actual Sun illuminating Earth in the solar-system shots.
 */
export const Lighting: React.FC<{
  fillIntensity?: number;
  sunLightPosition?: [number, number, number] | null;
  sunLightIntensity?: number;
  sunLightColor?: string;
}> = ({fillIntensity = 0.4, sunLightPosition = null, sunLightIntensity = 0, sunLightColor = '#fff3d6'}) => {
  return (
    <>
      <color attach="background" args={[BACKDROP_COLOR]} />
      <ambientLight intensity={0.12 + 0.1 * fillIntensity} color="#9fb0d8" />
      <directionalLight position={[8, 10, 6]} intensity={0.5 * fillIntensity + 0.15} color="#dfe8ff" />
      <directionalLight position={[-6, -4, -8]} intensity={0.25 * fillIntensity + 0.05} color="#4d5f99" />
      {sunLightPosition && sunLightIntensity > 0.01 && (
        <pointLight position={sunLightPosition} intensity={sunLightIntensity} color={sunLightColor} distance={80} decay={2} />
      )}
    </>
  );
};
