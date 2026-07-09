import React from 'react';
import {WIDTH, HEIGHT} from './constants';

export type CameraShot = {
  cx: number;
  cy: number;
  scale: number;
};

// A hard-cut "camera": uniform scale around a focus point, so aspect
// ratio is always preserved. Beats pick a discrete CameraShot rather than
// interpolating between shots, giving punch-in/pull-back cuts instead of
// smooth animated zooms.
export const Camera: React.FC<{shot: CameraShot; children: React.ReactNode}> = ({
  shot,
  children,
}) => {
  const tx = WIDTH / 2 - shot.cx * shot.scale;
  const ty = HEIGHT / 2 - shot.cy * shot.scale;
  return <g transform={`translate(${tx} ${ty}) scale(${shot.scale})`}>{children}</g>;
};
