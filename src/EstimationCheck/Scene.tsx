import React from 'react';
import {AbsoluteFill} from 'remotion';
import {WIDTH, HEIGHT} from './constants';
import {COLORS} from './colors';

// Generic full-bleed SVG canvas shared by every beat's vector content.
export const Scene: React.FC<{children: React.ReactNode}> = ({children}) => {
  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        width={WIDTH}
        height={HEIGHT}
        style={{position: 'absolute', top: 0, left: 0}}
      >
        {children}
      </svg>
    </AbsoluteFill>
  );
};
