import React from 'react';
import {AbsoluteFill} from 'remotion';
import {WIDTH, HEIGHT} from './constants';
import {COLORS} from './colors';

// Shared SVG canvas for the vector shapes (price tags, stamps, bars,
// strike-throughs). Glow filters live here once so every beat can
// reference them by id. Only ever applied to shapes with a non-zero
// bounding box in both axes (text, rects, diagonal lines) — never to a
// perfectly horizontal/vertical zero-height line, which Chromium clips to
// nothing under objectBoundingBox filter units.
export const Scene: React.FC<{children: React.ReactNode}> = ({children}) => {
  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        width={WIDTH}
        height={HEIGHT}
        style={{position: 'absolute', top: 0, left: 0}}
      >
        <defs>
          <filter id="glowGreen" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="14" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glowRed" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="14" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {children}
      </svg>
    </AbsoluteFill>
  );
};
