/**
 * Deterministic seeded PRNG (mulberry32) — used anywhere a scene needs
 * "random-looking" but reproducible layout (star positions, cluster
 * packing, etc.), since a real Math.random() would make every frame's
 * render differ, or every standalone-still differ from the full render.
 */
export const mulberry32 = (seed: number): (() => number) => {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};
