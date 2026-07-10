import React from 'react';
import {COLORS} from './colors';

export const TitleBlock: React.FC<{opacity: number; subOpacity: number}> = ({
  opacity,
  subOpacity,
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 1060,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          padding: '20px 34px',
          border: `2px solid ${COLORS.green}`,
          opacity,
        }}
      >
        <h1
          style={{
            margin: 0,
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 800,
            fontSize: 58,
            letterSpacing: 4,
            color: COLORS.bone,
            textAlign: 'center',
            textShadow: '0 4px 30px rgba(0,0,0,0.7)',
          }}
        >
          TUSI COUPLE
        </h1>
      </div>
      <p
        style={{
          marginTop: 22,
          opacity: subOpacity,
          fontFamily: 'Helvetica, Arial, sans-serif',
          fontWeight: 500,
          fontSize: 26,
          color: COLORS.boneDim,
          letterSpacing: 1,
          textAlign: 'center',
        }}
      >
        Nasir al-Din al-Tusi, 1247
      </p>
    </div>
  );
};
