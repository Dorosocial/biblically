export const COLORS = {
  bg: '#0D0D0D',
  green: '#39FF14',
  amber: '#FFA500',
  red: '#E63946',
  pink: '#FF3EC9',
  bone: '#E8E4D8',
  boneDim: 'rgba(232,228,216,0.45)',
};

const hexToRgb = (hex: string) => {
  const n = parseInt(hex.replace('#', ''), 16);
  return {r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255};
};

const clamp01 = (t: number) => Math.max(0, Math.min(1, t));

const mix = (a: string, b: string, t: number): string => {
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  const r = Math.round(ca.r + (cb.r - ca.r) * t);
  const g = Math.round(ca.g + (cb.g - ca.g) * t);
  const bl = Math.round(ca.b + (cb.b - ca.b) * t);
  return `rgb(${r},${g},${bl})`;
};

// Congestion color ramp: green (free-flowing) -> amber -> red (gridlock).
export const trafficColor = (t: number): string => {
  const tt = clamp01(t);
  if (tt <= 0.5) return mix(COLORS.green, COLORS.amber, tt / 0.5);
  return mix(COLORS.amber, COLORS.red, (tt - 0.5) / 0.5);
};
