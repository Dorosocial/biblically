import React from 'react';
import {interpolate} from 'remotion';
import {COLORS} from './colors';

// Lower-third narration caption. Fades in/out within the local beat frame
// range so it works regardless of how short the beat is.
export const Caption: React.FC<{
  frame: number;
  duration: number;
  text: string;
  color?: string;
}> = ({frame, duration, text, color = COLORS.bone}) => {
  const inEnd = Math.min(8, duration * 0.25);
  const outStart = Math.max(duration - 8, duration * 0.75);
  const opacity = interpolate(frame, [0, inEnd, outStart, duration], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const rise = interpolate(frame, [0, inEnd], [10, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{position: 'absolute', left: 64, right: 64, bottom: 170, opacity, transform: `translateY(${rise}px)`}}>
      <p
        style={{
          margin: 0,
          fontFamily: 'Helvetica, Arial, sans-serif',
          fontWeight: 700,
          fontSize: 40,
          lineHeight: 1.28,
          color,
          textAlign: 'center',
          textShadow: '0 2px 18px rgba(0,0,0,0.75)',
        }}
      >
        {text}
      </p>
    </div>
  );
};
