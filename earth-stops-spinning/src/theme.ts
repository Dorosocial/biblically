// Shared visual language for the earth-stops-spinning channel. Every scene
// and component should pull colors/type from here rather than hardcoding
// hex values, so a channel-wide palette change is a one-file edit.

export const theme = {
  color: {
    background: '#0b0f1a',
    surface: '#121a2c',
    grid: '#26324a',
    text: '#eef3ff',
    textMuted: '#8ea0c6',

    // The two roles every diagram in this channel keeps coming back to:
    // "the reference frame" (the ground, what's stationary/what we're
    // measuring against) vs. "the thing in motion" (what keeps its
    // velocity when the reference frame suddenly changes underneath it).
    // Every figure, marker, or vector should pick one of these two, not
    // an arbitrary color, so the two roles stay visually consistent
    // across every video.
    accentReference: '#5fc9ff', // cool blue -- stationary / ground truth
    accentMotion: '#ff9d5c', // warm orange -- inertial / still moving
  },
  font: {
    family:
      '"Inter", "Helvetica Neue", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
} as const;

export type Theme = typeof theme;
