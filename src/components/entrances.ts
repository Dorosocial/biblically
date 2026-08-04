import { interpolate, spring, Easing } from "remotion";

export type EntranceVariant =
  | "scaleUp"
  | "slideLeft"
  | "slideRight"
  | "fadeRise"
  | "drawOn";

// Order used to cycle variants across the whole timeline so consecutive
// beats never repeat the same entrance style.
export const IMAGE_ENTRANCE_CYCLE: EntranceVariant[] = [
  "scaleUp",
  "slideLeft",
  "slideRight",
  "fadeRise",
];

export const GRAPHIC_ENTRANCE_CYCLE: EntranceVariant[] = [
  "drawOn",
  "fadeRise",
  "scaleUp",
];

export const ENTRANCE_DURATION_FRAMES = 18;

export interface EntranceStyle {
  transform: string;
  opacity: number;
  /** 0 (not started) -> 1 (fully drawn), for stroke-dasharray driven reveals */
  drawProgress: number;
}

export const getEntranceStyle = (
  variant: EntranceVariant,
  localFrame: number,
  fps: number
): EntranceStyle => {
  const clamped = Math.max(0, localFrame);

  if (variant === "scaleUp") {
    const s = spring({
      frame: clamped,
      fps,
      config: { damping: 14, stiffness: 120, mass: 0.6 },
    });
    return {
      transform: `scale(${interpolate(s, [0, 1], [0.72, 1])})`,
      opacity: interpolate(clamped, [0, ENTRANCE_DURATION_FRAMES], [0, 1], {
        extrapolateRight: "clamp",
      }),
      drawProgress: interpolate(clamped, [0, ENTRANCE_DURATION_FRAMES], [0, 1], {
        extrapolateRight: "clamp",
      }),
    };
  }

  if (variant === "slideLeft") {
    const x = interpolate(clamped, [0, ENTRANCE_DURATION_FRAMES], [140, 0], {
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });
    return {
      transform: `translateX(${x}px)`,
      opacity: interpolate(clamped, [0, ENTRANCE_DURATION_FRAMES], [0, 1], {
        extrapolateRight: "clamp",
      }),
      drawProgress: interpolate(clamped, [0, ENTRANCE_DURATION_FRAMES], [0, 1], {
        extrapolateRight: "clamp",
      }),
    };
  }

  if (variant === "slideRight") {
    const x = interpolate(clamped, [0, ENTRANCE_DURATION_FRAMES], [-140, 0], {
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });
    return {
      transform: `translateX(${x}px)`,
      opacity: interpolate(clamped, [0, ENTRANCE_DURATION_FRAMES], [0, 1], {
        extrapolateRight: "clamp",
      }),
      drawProgress: interpolate(clamped, [0, ENTRANCE_DURATION_FRAMES], [0, 1], {
        extrapolateRight: "clamp",
      }),
    };
  }

  if (variant === "drawOn") {
    // Graphics use drawProgress to animate stroke-dasharray; the container
    // itself just fades/settles slightly.
    const y = interpolate(clamped, [0, ENTRANCE_DURATION_FRAMES], [10, 0], {
      extrapolateRight: "clamp",
    });
    return {
      transform: `translateY(${y}px)`,
      opacity: interpolate(clamped, [0, 8], [0, 1], { extrapolateRight: "clamp" }),
      drawProgress: interpolate(
        clamped,
        [0, ENTRANCE_DURATION_FRAMES + 10],
        [0, 1],
        { extrapolateRight: "clamp", easing: Easing.inOut(Easing.ease) }
      ),
    };
  }

  // fadeRise (default)
  const y = interpolate(clamped, [0, ENTRANCE_DURATION_FRAMES], [36, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return {
    transform: `translateY(${y}px)`,
    opacity: interpolate(clamped, [0, ENTRANCE_DURATION_FRAMES], [0, 1], {
      extrapolateRight: "clamp",
    }),
    drawProgress: interpolate(clamped, [0, ENTRANCE_DURATION_FRAMES], [0, 1], {
      extrapolateRight: "clamp",
    }),
  };
};
