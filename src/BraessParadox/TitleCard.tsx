import React from 'react';
import {COLORS} from './colors';

export const TitleCard: React.FC<{opacity: number}> = ({opacity}) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity,
      }}
    >
      <div
        style={{
          padding: '28px 40px',
          border: `2px solid ${COLORS.amber}`,
        }}
      >
        <h1
          style={{
            margin: 0,
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 800,
            fontSize: 64,
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
