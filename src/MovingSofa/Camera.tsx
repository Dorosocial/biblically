import React from 'react';
import {WIDTH, HEIGHT} from './constants';

export type CameraShot = {cx: number; cy: number; scale: number};

export const Camera: React.FC<{shot: CameraShot; children: React.ReactNode}> = ({shot, children}) => {
  const tx = WIDTH / 2 - shot.cx * shot.scale;
  const ty = HEIGHT / 2 - shot.cy * shot.scale;
  return <g transform={`translate(${tx} ${ty}) scale(${shot.scale})`}>{children}</g>;
};
