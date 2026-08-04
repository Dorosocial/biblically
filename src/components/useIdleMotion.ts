/**
 * Continuous idle motion so nothing ever holds a fully static frame.
 * Pure function of the current frame (deterministic, renderable), so a
 * >2s static hold is structurally impossible: the output keeps changing
 * every single frame by construction.
 */
export interface IdleMotion {
  scale: number;
  opacityMul: number;
}

const hashPhase = (seed: string): number => {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) | 0;
  }
  return (Math.abs(h) % 1000) / 1000;
};

export const useIdleMotion = (
  frame: number,
  fps: number,
  seed: string,
  kind: "breathing" | "shimmer" = "breathing"
): IdleMotion => {
  const periodSeconds = kind === "breathing" ? 2.6 : 1.8;
  const periodFrames = periodSeconds * fps;
  const phaseOffset = hashPhase(seed) * Math.PI * 2;
  const phase = (frame / periodFrames) * Math.PI * 2 + phaseOffset;

  if (kind === "shimmer") {
    return {
      scale: 1 + 0.008 * Math.sin(phase),
      opacityMul: 1 - 0.06 * (0.5 + 0.5 * Math.sin(phase * 1.7)),
    };
  }

  return {
    scale: 1 + 0.02 * Math.sin(phase),
    opacityMul: 1 - 0.035 * (0.5 + 0.5 * Math.cos(phase)),
  };
};
