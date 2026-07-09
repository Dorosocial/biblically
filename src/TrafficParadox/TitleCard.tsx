import React from 'react';
import {COLORS} from './colors';

export const TitleCard: React.FC<{scale: number; opacity: number; kickerOpacity: number}> = ({
  scale,
  opacity,
  kickerOpacity,
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '26px',
      }}
    >
      <span
        style={{
          opacity: kickerOpacity,
          fontFamily: 'Helvetica, Arial, sans-serif',
          fontWeight: 800,
          fontSize: 28,
          letterSpacing: 8,
          color: COLORS.pink,
          textTransform: 'uppercase',
        }}
      >
        Zombie Math
      </span>
      <div
        style={{
          padding: '30px 42px',
          border: `3px solid ${COLORS.green}`,
          opacity,
          transform: `scale(${scale})`,
        }}
      >
        <h1
          style={{
            margin: 0,
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 800,
            fontSize: 66,
            letterSpacing: 3,
            color: COLORS.bone,
            textAlign: 'center',
            textShadow: `0 0 26px ${COLORS.green}, 0 0 64px ${COLORS.green}`,
          }}
        >
          BRAESS&apos;S PARADOX
        </h1>
      </div>
    </div>
  );
};
