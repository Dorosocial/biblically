import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {degToRad, pointOnCircle, tangentHeading} from '../physics/rotation';
import {PosedFigure} from '../components/PosedFigure';
import {theme} from '../theme';

// The payoff beat: the instant the ground stops turning under you, you
// don't stop -- you keep moving at whatever speed the ground was carrying
// you at. Two markers, same starting point: one glued to the (now
// stationary) ground, one obeying inertia and drifting off along the
// tangent it was already moving on.

const EARTH_RADIUS = 260;
const EARTH_CENTER = {x: 960, y: 540};
const DEGREES_PER_SECOND = 40; // must match Hook.tsx -- same rotation, same speed at freeze
const FREEZE_ANGLE_DEG = 55; // where the marker was on the circle when everything stopped

export const FreezeFrame: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const secondsSinceFreeze = frame / fps;

  const freezePoint = pointOnCircle(EARTH_CENTER, EARTH_RADIUS, FREEZE_ANGLE_DEG);
  const heading = tangentHeading(FREEZE_ANGLE_DEG);
  const headingUnit = pointOnCircle({x: 0, y: 0}, 1, heading);

  // Tangential speed = angular velocity * radius, so the drift continues
  // at exactly the speed the ground was carrying it at the instant it froze.
  const driftPxPerSecond = degToRad(DEGREES_PER_SECOND) * EARTH_RADIUS;
  const driftDistance = driftPxPerSecond * secondsSinceFreeze;
  const inertialPos = {
    x: freezePoint.x + headingUnit.x * driftDistance,
    y: freezePoint.y + headingUnit.y * driftDistance,
  };

  const facing: 'left' | 'right' = headingUnit.x >= 0 ? 'right' : 'left';

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
        <circle
          cx={EARTH_CENTER.x}
          cy={EARTH_CENTER.y}
          r={EARTH_RADIUS}
          fill="none"
          stroke={theme.color.accentReference}
          strokeWidth={2}
          strokeDasharray="6 10"
          opacity={0.4}
        />
        {/* the straight-line path inertia takes it on, per Newton's first law */}
        <line
          x1={freezePoint.x}
          y1={freezePoint.y}
          x2={freezePoint.x + headingUnit.x * 900}
          y2={freezePoint.y + headingUnit.y * 900}
          stroke={theme.color.accentMotion}
          strokeWidth={2}
          strokeDasharray="4 10"
          opacity={0.35}
        />
      </svg>

      {/* Frozen ground marker: stayed exactly where the ground stopped. */}
      <PosedFigure
        pose="standing"
        x={freezePoint.x}
        y={freezePoint.y}
        scale={1.1}
        color={theme.color.accentReference}
        facing={facing}
      />
      <div
        style={{
          position: 'absolute',
          left: freezePoint.x,
          top: freezePoint.y + 90,
          transform: 'translateX(-50%)',
          fontFamily: theme.font.family,
          fontSize: 20,
          fontWeight: 600,
          letterSpacing: '0.16em',
          color: theme.color.accentReference,
          textAlign: 'center',
        }}
      >
        THE GROUND
      </div>

      {/* Inertial marker: still moving at the ground's old speed, off
          balance and tumbling since nothing is under its feet anymore. */}
      <PosedFigure
        pose="falling"
        x={inertialPos.x}
        y={inertialPos.y}
        scale={1.1}
        color={theme.color.accentMotion}
        facing={facing}
      />
      <div
        style={{
          position: 'absolute',
          left: inertialPos.x,
          top: inertialPos.y - 130,
          transform: 'translateX(-50%)',
          fontFamily: theme.font.family,
          fontSize: 20,
          fontWeight: 600,
          letterSpacing: '0.16em',
          color: theme.color.accentMotion,
          textAlign: 'center',
        }}
      >
        YOU
      </div>

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
        <div style={{fontSize: 44, fontWeight: 800}}>The ground stops. You don't.</div>
      </div>
    </AbsoluteFill>
  );
};
