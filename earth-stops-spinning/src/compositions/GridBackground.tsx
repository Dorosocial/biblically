import React from 'react';
import { AbsoluteFill } from 'remotion';
import { colors } from '../theme';

const GRID_SPACING_PX = 80;
const GRID_LINE_COLOR = colors.textPrimary;
const GRID_OPACITY = 0.04;

/**
 * Fixed background layer rendered once, underneath every scene: a deep
 * navy field with a fine coordinate-grid ("physics graph paper") and a
 * soft radial vignette so the grid recedes and doesn't compete with
 * foreground content.
 */
export const GridBackground: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      <AbsoluteFill
        style={{
          backgroundImage: `
            linear-gradient(to right, ${GRID_LINE_COLOR} 1px, transparent 1px),
            linear-gradient(to bottom, ${GRID_LINE_COLOR} 1px, transparent 1px)
          `,
          backgroundSize: `${GRID_SPACING_PX}px ${GRID_SPACING_PX}px`,
          opacity: GRID_OPACITY,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(11,18,32,0) 45%, rgba(11,18,32,0.85) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};
