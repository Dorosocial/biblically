import React from 'react';

export const BACKDROP_COLOR = '#07080d';

/**
 * All lighting is built directly in the Three.js scene — no HDRI/environment
 * map. Ambient gives a low base fill so nothing goes pure-black-and-
 * unreadable; one directional key light provides the dramatic shadow/
 * highlight direction on the phone's glass/metal surfaces; a focus/rim
 * light is positioned per-shot (by physics.ts) to spotlight the current
 * macro detail — the fingertip-glass contact point, the falling phone, etc.
 */
export const Lighting: React.FC<{
  focus: [number, number, number];
  focusColor?: string;
  focusIntensity?: number;
  fillIntensity?: number;
}> = ({focus, focusColor = '#eaf3ff', focusIntensity = 26, fillIntensity = 0.6}) => {
  // Never positioned exactly at the focus point itself — several shots push
  // the camera (and the light) to within centimeters of a surface, which
  // would blow it out to white at near-zero distance otherwise.
  const lightPos: [number, number, number] = [focus[0] + 1.1, focus[1] + 1.5, focus[2] + 2.0];
  return (
    <>
      <color attach="background" args={[BACKDROP_COLOR]} />
      <ambientLight intensity={0.35} color="#aab3c9" />
      <directionalLight position={[5, 8, 6]} intensity={1.1 * fillIntensity + 0.4} color="#ffffff" />
      <directionalLight position={[-6, -2, -4]} intensity={0.35 * fillIntensity + 0.1} color="#4d6aa8" />
      <pointLight position={lightPos} intensity={focusIntensity} color={focusColor} distance={50} decay={2} />
    </>
  );
};
