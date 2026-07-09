import React from 'react';
import {WIDTH, HEIGHT} from './constants';

export type CameraShot = {
  cx: number;
  cy: number;
  scale: number;
};

// A camera: uniform scale around a focus point, so aspect ratio is always
// preserved. Beats compute {cx,cy,scale} per-frame (dot-tracking,
// path-following, interpolated whip-pans) — this is what makes the
// retention-cut camera language possible, not a discrete shot lookup.
export const Camera: React.FC<{shot: CameraShot; children: React.ReactNode}> = ({
  shot,
  children,
}) => {
  const tx = WIDTH / 2 - shot.cx * shot.scale;
  const ty = HEIGHT / 2 - shot.cy * shot.scale;
  return <g transform={`translate(${tx} ${ty}) scale(${shot.scale})`}>{children}</g>;
};
