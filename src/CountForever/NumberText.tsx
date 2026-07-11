import React from 'react';
import {COLORS} from './colors';

export const formatNumber = (n: number): string => Math.round(n).toLocaleString('en-US');

// Big centered numeral. `y` nudges it off dead-center (px, +down) so it
// can share the frame with other elements without overlapping.
export const NumberText: React.FC<{
  value: number;
  scale?: number;
  opacity?: number;
  color?: string;
  y?: number;
  fontSize?: number;
  suffix?: string;
  suffixOpacity?: number;
  glow?: boolean;
}> = ({
  value,
  scale = 1,
  opacity = 1,
  color = COLORS.bone,
  y = 0,
  fontSize = 140,
  suffix,
  suffixOpacity = 1,
  glow = false,
}) => {
  const text = formatNumber(value);
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translateY(calc(-50% + ${y}px)) scale(${scale})`,
        opacity,
      }}
    >
      <span
        style={{
          fontFamily: 'Helvetica, Arial, sans-serif',
          fontWeight: 800,
          fontSize,
          color,
          letterSpacing: 1,
          whiteSpace: 'nowrap',
          textShadow: glow ? `0 0 30px ${color}, 0 0 70px ${color}` : '0 4px 24px rgba(0,0,0,0.7)',
        }}
      >
        {text}
        {suffix ? <span style={{opacity: suffixOpacity}}>{suffix}</span> : null}
      </span>
    </div>
  );
};
