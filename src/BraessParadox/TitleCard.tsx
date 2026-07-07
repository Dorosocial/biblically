import React from 'react';
import {COLORS} from './colors';

// `top` pins the card at a fixed vertical offset instead of centering it —
// used when the title has to share the frame with other content (e.g. the
// bar graph) and needs to sit in empty space rather than on top of it.
export const TitleCard: React.FC<{opacity: number; top?: number; fontSize?: number}> = ({
  opacity,
  top,
  fontSize = 64,
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: top !== undefined ? top : 0,
        left: 0,
        right: 0,
        bottom: top !== undefined ? undefined : 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity,
      }}
    >
      <div
        style={{
          padding: '24px 36px',
          border: `2px solid ${COLORS.amber}`,
        }}
      >
        <h1
          style={{
            margin: 0,
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 800,
            fontSize,
            letterSpacing: 3,
            color: COLORS.text,
            textAlign: 'center',
            textShadow: '0 4px 30px rgba(0,0,0,0.7)',
          }}
        >
          BRAESS&apos;S PARADOX
        </h1>
      </div>
    </div>
  );
};
