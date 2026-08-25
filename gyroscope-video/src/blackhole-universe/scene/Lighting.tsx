import React from 'react';

// A hint of deep indigo rather than flat #000 — per the clarity/color
// rule ("don't default to a flat near-black palette"), even the backdrop
// should carry a little real hue instead of reading as a void.
export const BACKDROP_COLOR = '#05060f';

/**
 * All lighting is built in code — no HDRI, same convention as every other
 * video in this project. CLARITY & COLOR RULE: this video must read as
 * genuinely clear and well-lit, not moody-dark — bumped substantially from
 * this file's first draft (0.08+0.1*fillIntensity baseline ambient read as
 * near-black in practice). The event horizon/disk/grid are all
 * self-illuminating (MeshBasicMaterial, unaffected by these lights) and
 * carry their own vivid color per docs/black_hole_visual_reference.md —
 * this lighting mainly lifts Earth/other lit materials and the general
 * scene fill so nothing reads as an indistinct shape against near-black.
 * `fillIntensity` is still the dial physics.ts uses to dim the scene for
 * the beat 6 hard-cut pause, just off a much brighter baseline now.
 */
export const Lighting: React.FC<{fillIntensity?: number}> = ({fillIntensity = 0.4}) => {
  return (
    <>
      <color attach="background" args={[BACKDROP_COLOR]} />
      <ambientLight intensity={0.25 + 0.35 * fillIntensity} color="#aebfe6" />
      <directionalLight position={[10, 8, 6]} intensity={0.8 * fillIntensity + 0.3} color="#eef3ff" />
      <directionalLight position={[-8, -5, -10]} intensity={0.4 * fillIntensity + 0.15} color="#6d84c4" />
    </>
  );
};
