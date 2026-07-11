import React from 'react';
import {COLORS} from './colors';

// A fixed, hand-placed dot scatter (never Math.random() — Remotion may
// render frames out of order) used to give the "bigger infinity" symbol
// a denser, uncountable-feeling texture next to the plain one.
const DENSE_DOTS: {dx: number; dy: number; r: number}[] = [
  {dx: -60, dy: -18, r: 3},
  {dx: -40, dy: 22, r: 2.5},
  {dx: -20, dy: -28, r: 2},
  {dx: 0, dy: 18, r: 3},
  {dx: 20, dy: -20, r: 2.5},
  {dx: 40, dy: 24, r: 2},
  {dx: 60, dy: -16, r: 3},
  {dx: -70, dy: 6, r: 2},
  {dx: 70, dy: 8, r: 2},
  {dx: -10, dy: 0, r: 2.5},
  {dx: 10, dy: -4, r: 2},
  {dx: -50, dy: -6, r: 2},
  {dx: 50, dy: 4, r: 2},
];

export const InfinitySymbol: React.FC<{
  fontSize: number;
  opacity?: number;
  scale?: number;
  color?: string;
  dense?: boolean;
  glow?: boolean;
}> = ({fontSize, opacity = 1, scale = 1, color = COLORS.bone, dense = false, glow = false}) => {
  return (
    <div style={{position: 'relative', opacity, transform: `scale(${scale})`, display: 'inline-block'}}>
      <span
        style={{
          fontFamily: 'Helvetica, Arial, sans-serif',
          fontWeight: 800,
          fontSize,
          color,
          lineHeight: 1,
          textShadow: glow ? `0 0 26px ${color}, 0 0 60px ${color}` : undefined,
        }}
      >
        &#8734;
      </span>
      {dense ? (
        <svg
          width={fontSize * 1.4}
          height={fontSize}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
          }}
        >
          {DENSE_DOTS.map((d, i) => (
            <circle key={i} cx={fontSize * 0.7 + d.dx} cy={fontSize / 2 + d.dy} r={d.r} fill={color} opacity={0.55} />
          ))}
        </svg>
      ) : null}
    </div>
  );
};
