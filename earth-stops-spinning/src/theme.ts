/**
 * Shared design tokens for "Earth Stops Spinning". Import from here rather
 * than repeating hex codes/font names in individual scene components, so
 * the look stays consistent across all six scenes.
 */

export const colors = {
  /** Deep space navy — base background for the whole video. */
  background: '#0B1220',
  /** Slightly lighter navy — cards / panels / readout boxes. */
  panel: '#131B2E',
  /** Primary text. */
  textPrimary: '#EDEFF4',
  /** Secondary / caption text. */
  textMuted: '#8792A6',
  /** Motion / velocity vectors — the recurring motif of the whole video. */
  gold: '#F2A65A',
  /** Stationary / reference elements (frozen ground, axis, gridlines). */
  cyan: '#5EC8D8',
  /** Supersonic / danger moments only — used sparingly. */
  coral: '#E85D4C',
} as const;

export const fonts = {
  /** Headlines, equations, big numeric readouts. */
  headline: 'Space Grotesk',
  /** Captions / narration text / small labels. */
  caption: 'Inter',
} as const;

export const layout = {
  width: 1920,
  height: 1080,
  fps: 30,
} as const;
