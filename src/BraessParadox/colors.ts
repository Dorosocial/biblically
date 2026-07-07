export const COLORS = {
  bg: '#1A1A1A',
  bgDeep: '#141414',
  amber: '#FFA500',
  red: '#E63946',
  text: '#F5F3EE',
  textDim: 'rgba(245,243,238,0.62)',
  nodeFill: '#1A1A1A',
  nodeStroke: '#F5F3EE',
  panelLine: 'rgba(245,243,238,0.14)',
};

const hexToRgb = (hex: string) => {
  const n = parseInt(hex.replace('#', ''), 16);
  return {r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255};
};

const clamp01 = (t: number) => Math.max(0, Math.min(1, t));

// Mixes from amber -> red as t goes 0 -> 1.
export const trafficColor = (t: number): string => {
  const tt = clamp01(t);
  const a = hexToRgb(COLORS.amber);
  const b = hexToRgb(COLORS.red);
  const r = Math.round(a.r + (b.r - a.r) * tt);
  const g = Math.round(a.g + (b.g - a.g) * tt);
  const bl = Math.round(a.b + (b.b - a.b) * tt);
  return `rgb(${r},${g},${bl})`;
};
