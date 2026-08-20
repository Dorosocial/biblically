import React from 'react';

/**
 * Reusable single-hand analog clock overlay for time-dilation comparisons
 * — a simplified single hand (not hour+minute) so the SPEED difference
 * between two instances reads clearly at a glance, which is the entire
 * point of putting two of these side by side.
 */
export const TwinClock: React.FC<{
  label: string;
  angleDeg: number;
  size?: number;
  accentColor?: string;
  opacity?: number;
}> = ({label, angleDeg, size = 140, accentColor = '#eaf3ff', opacity = 1}) => {
  const ticks = Array.from({length: 12}, (_, i) => i);
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', opacity}}>
      <div
        style={{
          position: 'relative',
          width: size,
          height: size,
          borderRadius: '50%',
          border: `2px solid ${accentColor}`,
          boxShadow: `0 0 26px ${accentColor}55`,
          background: 'rgba(255,255,255,0.03)',
        }}
      >
        {ticks.map((i) => {
          const a = (i / 12) * 360;
          const long = i % 3 === 0;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: 2,
                height: long ? 13 : 6,
                background: accentColor,
                opacity: long ? 0.9 : 0.55,
                transform: `rotate(${a}deg) translate(-50%, -${size / 2 - 2}px)`,
                transformOrigin: 'top left',
              }}
            />
          );
        })}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: 3,
            height: size * 0.36,
            background: accentColor,
            transformOrigin: 'top center',
            transform: `translate(-50%, 0) rotate(${angleDeg}deg)`,
            borderRadius: 2,
            boxShadow: `0 0 10px ${accentColor}`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: 8,
            height: 8,
            marginLeft: -4,
            marginTop: -4,
            borderRadius: '50%',
            background: accentColor,
          }}
        />
      </div>
      <div
        style={{
          marginTop: 16,
          fontFamily: '"Helvetica Neue", Arial, sans-serif',
          fontWeight: 800,
          letterSpacing: '0.14em',
          fontSize: 24,
          color: accentColor,
          textShadow: `0 0 18px ${accentColor}99`,
        }}
      >
        {label}
      </div>
    </div>
  );
};
