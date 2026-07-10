import React from 'react';
import {useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import {Scene} from '../Scene';
import {NetworkScene} from '../NetworkScene';
import {Lightbulb} from '../Lightbulb';
import {PhraseCaption} from '../PhraseCaption';
import {COLORS} from '../colors';
import {ROUTE_LEFT, ROUTE_RIGHT} from '../geometry';

const COMPARE_END = 70;
const LIGHTBULB_SHOT = {cx: 540, cy: 890, scale: 2.4};

const PHRASES = [
  {at: 0, words: [{text: 'SAME'}, {text: 'AMOUNT'}, {text: 'OF'}, {text: 'TIME'}]},
  {at: 45, words: [{text: 'THE'}, {text: 'CITY'}, {text: 'HAS'}, {text: 'AN'}, {text: 'IDEA'}]},
  {at: 92, words: [{text: 'BUILD'}, {text: 'A'}, {text: 'NEW'}, {text: 'SHORTCUT', accent: true}]},
];

const TravelTimeCompare: React.FC<{frame: number}> = ({frame}) => {
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
  const barW = interpolate(frame, [6, 30], [0, 340], clampOpts);
  const labelOpacity = interpolate(frame, [30, 42], [0, 1], clampOpts);

  return (
    <Scene>
      <g transform="translate(540 900)">
        <text x={0} y={-190} fill={COLORS.bone} fontSize={34} fontWeight={800} textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif">
          TRAVEL TIME
        </text>
        {[-100, 100].map((y, i) => (
          <g key={i} transform={`translate(0 ${y})`}>
            <text x={-360} y={-18} fill={COLORS.boneDim} fontSize={24} fontWeight={800} fontFamily="Helvetica, Arial, sans-serif">
              ROAD {i + 1}
            </text>
            <rect x={-360} y={0} width={340} height={28} rx={8} fill="none" stroke={COLORS.green} strokeWidth={3} />
            <rect x={-360} y={0} width={barW} height={28} rx={8} fill={COLORS.green} opacity={0.7} />
            <text x={-360 + 360} y={14} dx={20} fill={COLORS.bone} fontSize={26} fontWeight={800} opacity={labelOpacity} dominantBaseline="central" fontFamily="Helvetica, Arial, sans-serif">
              20 MIN
            </text>
          </g>
        ))}
      </g>
    </Scene>
  );
};

// Beat 3 (300-450, 0:10-0:15): a quick travel-time comparison graphic —
// one clean beat — then a hard cut to the lightbulb pop-in, no shake.
export const Beat3: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const bulbFrame = Math.max(0, frame - COMPARE_END);
  const bulbScale = spring({frame: bulbFrame, fps, config: {damping: 12, mass: 0.6, stiffness: 200}});
  const pulse = 0.5 + 0.5 * Math.sin(bulbFrame / 6);

  return (
    <>
      {frame < COMPARE_END ? (
        <TravelTimeCompare frame={frame} />
      ) : (
        <NetworkScene
          frame={frame}
          shot={LIGHTBULB_SHOT}
          streams={[
            {route: ROUTE_LEFT, count: 8, speed: 0.006},
            {route: ROUTE_RIGHT, count: 8, speed: 0.006, phase: 0.5},
          ]}
        >
          <Lightbulb x={540} y={890} scale={bulbScale} pulse={pulse} />
        </NetworkScene>
      )}
      <PhraseCaption frame={frame} phrases={PHRASES} />
    </>
  );
};
