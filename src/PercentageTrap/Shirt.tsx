import React from 'react';
import {COLORS} from './colors';

// A minimal geometric t-shirt icon: collar notch, short sleeves, body —
// straight lines only, no detail, just enough to read as "clothing."
const SHIRT_PATH =
  'M -55,-260 L -125,-260 L -260,-180 L -215,-70 L -150,-120 L -150,260 ' +
  'L 150,260 L 150,-120 L 215,-70 L 260,-180 L 125,-260 L 55,-260 ' +
  'Q 0,-205 -55,-260 Z';

export const Shirt: React.FC<{
  x?: number;
  y?: number;
  scale?: number;
  opacity?: number;
  color?: string;
}> = ({x = 540, y = 560, scale = 1, opacity = 1, color = COLORS.boneDim}) => {
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`} opacity={opacity}>
      <path d={SHIRT_PATH} fill="none" stroke={color} strokeWidth={7} strokeLinejoin="round" />
    </g>
  );
};
