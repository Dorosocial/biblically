import React from 'react';
import {useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import {Scene} from '../Scene';
import {Camera} from '../Camera';
import {Hallway} from '../Hallway';
import {SofaShape} from '../SofaShape';
import {PhraseCaption} from '../PhraseCaption';
import {COLORS} from '../colors';
import {rectLocalPoints, RECT_STUCK_THETA} from '../geometry';
import {easeInOutCubic} from '../ease';

const TIGHT = {cx: 520, cy: 680, scale: 1.35};
const TIGHTER = {cx: 520, cy: 680, scale: 1.5};

const PHRASES = [
  {at: 0, words: [{text: 'HAVE'}, {text: 'BEEN'}, {text: 'STUCK'}, {text: 'ON'}, {text: 'IT'}]},
  {at: 40, words: [{text: 'FOR'}, {text: 'SIXTY'}, {text: 'YEARS'}]},
];

// Beat 2 (300-390, 0:10-0:13): the jammed rectangle holds — a single slow
// continued push tightens the frame — as "60 YEARS" stamps in.
export const Beat2: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const duration = 90;
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

  const pushT = easeInOutCubic(interpolate(frame, [0, duration], [0, 1], clampOpts));
  const shot = {
    cx: TIGHT.cx + (TIGHTER.cx - TIGHT.cx) * pushT,
    cy: TIGHT.cy + (TIGHTER.cy - TIGHT.cy) * pushT,
    scale: TIGHT.scale + (TIGHTER.scale - TIGHT.scale) * pushT,
  };

  const stampScale = spring({frame: Math.max(0, frame - 40), fps, config: {damping: 11, mass: 0.5, stiffness: 220}});
  const stampOpacity = interpolate(frame, [40, 50], [0, 1], clampOpts);

  return (
    <>
      <Scene>
        <Camera shot={shot}>
          <Hallway />
          <SofaShape localPoints={rectLocalPoints()} theta={RECT_STUCK_THETA} color={COLORS.bone} fillOpacity={0.1} />
        </Camera>
        <g
          opacity={stampOpacity}
          transform={`translate(540 300) scale(${stampScale})`}
          fontFamily="Helvetica, Arial, sans-serif"
        >
          <rect x={-160} y={-56} width={320} height={112} rx={10} fill="none" stroke={COLORS.green} strokeWidth={4} />
          <text x={0} y={0} fill={COLORS.green} fontSize={54} fontWeight={800} textAnchor="middle" dominantBaseline="central">
            60 YEARS
          </text>
        </g>
      </Scene>
      <PhraseCaption frame={frame} phrases={PHRASES} />
    </>
  );
};
