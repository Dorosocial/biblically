import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {earthRotationAngle, pointOnCircle} from '../physics/rotation';
import {PosedFigure} from '../components/PosedFigure';
import {theme} from '../theme';

// Opening hook: Earth spinning, a figure riding the equator with it,
// setting up the premise before we ask "what if it just... stopped?"

const EARTH_RADIUS = 260;
const EARTH_CENTER = {x: 960, y: 540};
const DEGREES_PER_SECOND = 40; // stylized -- fast enough to read as "spinning" in a few seconds

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const angle = earthRotationAngle({frame, fps, degreesPerSecond: DEGREES_PER_SECOND});
  const markerPos = pointOnCircle(EARTH_CENTER, EARTH_RADIUS, angle);

  return (
    <AbsoluteFill style={{backgroundColor: theme.color.background}}>
      <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{position: 'absolute'}}>
        <circle
          cx={EARTH_CENTER.x}
          cy={EARTH_CENTER.y}
          r={EARTH_RADIUS}
          fill={theme.color.surface}
          stroke={theme.color.grid}
          strokeWidth={3}
        />
        {/* equator -- the circle the figure rides */}
        <circle
          cx={EARTH_CENTER.x}
          cy={EARTH_CENTER.y}
          r={EARTH_RADIUS}
          fill="none"
          stroke={theme.color.accentReference}
          strokeWidth={2}
          strokeDasharray="6 10"
          opacity={0.6}
        />
      </svg>

      {/* Was: a plain circle marker riding the equator. Now the channel's
          reusable figure -- same position, same scale, same role (the
          thing in motion, so accentMotion). */}
      <PosedFigure
        pose="standing"
        x={markerPos.x}
        y={markerPos.y}
        scale={1.1}
        color={theme.color.accentMotion}
        facing={Math.cos(((angle - 90) * Math.PI) / 180) >= 0 ? 'right' : 'left'}
      />

      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: 90,
          transform: 'translateX(-50%)',
          textAlign: 'center',
          fontFamily: theme.font.family,
          color: theme.color.text,
        }}
      >
        <div style={{fontSize: 44, fontWeight: 800}}>
          What if Earth suddenly stopped spinning?
        </div>
      </div>
    </AbsoluteFill>
  );
};
