import React from 'react';

export const BACKDROP_COLOR = '#05070d';

/**
 * All lighting is built directly in the Three.js scene — no HDRI/environment
 * map. Ambient gives a low base fill so nothing ever goes pure-black-and-
 * unreadable; one directional key light provides the dramatic shadow/
 * highlight direction; a focus/rim light is positioned per-shot (by
 * physics.ts) to spotlight whatever object is the current hero — a tight
 * rim light on the proton during close-ups, a broader fill during wide
 * reveals.
 */
export const Lighting: React.FC<{
  focus: [number, number, number];
  focusColor?: string;
  focusIntensity?: number;
  fillIntensity?: number;
}> = ({focus, focusColor = '#dfe9ff', focusIntensity = 30, fillIntensity = 0.55}) => {
  // A real key/rim light is never positioned exactly at its subject's own
  // center — but several shots here scale an object up until it grows to
  // fill/overtake that exact point, which would put the light effectively
  // inside the mesh and blow the near surface out to white at near-zero
  // distance. Offsetting it like a practical light rig sidesteps that
  // regardless of how large the focused object grows.
  const lightPos: [number, number, number] = [focus[0] + 1.4, focus[1] + 1.8, focus[2] + 2.6];
  return (
    <>
      <color attach="background" args={[BACKDROP_COLOR]} />
      <ambientLight intensity={0.4} color="#aebbdd" />
      <directionalLight position={[6, 10, 7]} intensity={1.2 * fillIntensity + 0.5} color="#ffffff" />
      <directionalLight position={[-8, -3, -5]} intensity={0.4 * fillIntensity + 0.15} color="#5c7fb8" />
      <pointLight position={lightPos} intensity={focusIntensity} color={focusColor} distance={60} decay={2} />
    </>
  );
};
