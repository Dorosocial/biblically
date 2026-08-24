import React from 'react';

export const BACKDROP_COLOR = '#010102';

/**
 * All lighting is built in code — no HDRI, same convention as every other
 * video in this project. A very low ambient keeps deep space from ever
 * being unreadable-flat-black; one directional key light gives a
 * consistent global light direction. The nested-universe motif and Earth
 * are self-illuminating or lit brightly enough to read on their own —
 * `fillIntensity` is the dial physics.ts uses to dim the whole scene for
 * the beat 6 held-black pause without a hard light-off pop.
 */
export const Lighting: React.FC<{fillIntensity?: number}> = ({fillIntensity = 0.2}) => {
  return (
    <>
      <color attach="background" args={[BACKDROP_COLOR]} />
      <ambientLight intensity={0.08 + 0.1 * fillIntensity} color="#9fb0d8" />
      <directionalLight position={[10, 8, 6]} intensity={0.4 * fillIntensity + 0.1} color="#dfe8ff" />
      <directionalLight position={[-8, -5, -10]} intensity={0.2 * fillIntensity + 0.04} color="#4d5f99" />
    </>
  );
};
