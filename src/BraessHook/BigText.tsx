import React from 'react';
import {COLORS} from './colors';

export type BigTextLine = {
  text: string;
  opacity: number;
  color?: string;
  fontSize?: number;
  scale?: number;
  glow?: boolean;
};

// Full-screen centered stacked bold caps text — used for the punchy
// standalone callout beats (not the road map). `shake` offsets the whole
// block in screen pixels for impact moments.
export const BigText: React.FC<{
  lines: BigTextLine[];
  top?: number;
  shake?: {x: number; y: number};
}> = ({lines, top, shake}) => {
  const shakeTransform = shake ? `translate(${shake.x}px, ${shake.y}px)` : '';
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: top ?? 0,
        bottom: top !== undefined ? undefined : 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: top !== undefined ? 'flex-start' : 'center',
        gap: '20px',
        padding: '0 60px',
        transform: shakeTransform || undefined,
      }}
    >
      {lines.map((line, i) => (
        <div key={i} style={{opacity: line.opacity, transform: `scale(${line.scale ?? 1})`}}>
          <span
            style={{
              display: 'block',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 800,
              fontSize: line.fontSize ?? 76,
              letterSpacing: 2,
              color: line.color ?? COLORS.bone,
              textAlign: 'center',
              textTransform: 'uppercase',
              textShadow: line.glow
                ? `0 0 24px ${line.color ?? COLORS.bone}, 0 0 60px ${line.color ?? COLORS.bone}`
                : '0 3px 20px rgba(0,0,0,0.7)',
            }}
          >
            {line.text}
          </span>
        </div>
      ))}
    </div>
  );
};
