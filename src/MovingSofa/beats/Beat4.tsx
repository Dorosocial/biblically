import React from 'react';
import {useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import {Scene} from '../Scene';
import {Camera} from '../Camera';
import {Hallway} from '../Hallway';
import {SofaShape} from '../SofaShape';
import {PhraseCaption} from '../PhraseCaption';
import {COLORS} from '../colors';
import {buildSofaLocalPoints, SOFA_SHAPES} from '../geometry';
import {easeInOutCubic} from '../ease';

const WIDE = {cx: 580, cy: 780, scale: 0.92};
const TIGHT = {cx: 500, cy: 800, scale: 1.28};
const PUSH_END = 60;

const PHRASES = [
  {at: 0, words: [{text: 'OVER'}, {text: 'THE'}, {text: 'YEARS'}]},
  {at: 30, words: [{text: 'MATHEMATICIANS'}, {text: 'HAVE'}, {text: 'DISCOVERED'}]},
  {at: 65, words: [{text: 'BIGGER'}, {text: 'AND'}, {text: 'STRANGER'}, {text: 'SHAPES'}]},
  {at: 100, words: [{text: 'THAT'}, {text: 'WORK'}]},
  {at: 130, words: [{text: 'BUT'}, {text: 'NOBODY'}, {text: 'HAS'}, {text: 'PROVEN'}]},
  {at: 175, words: [{text: 'ANY'}, {text: 'OF'}, {text: 'THEM'}, {text: 'IS'}, {text: 'THE'}]},
  {at: 210, words: [{text: 'ABSOLUTE...'}]},
];

const gerverPoints = buildSofaLocalPoints(SOFA_SHAPES[3]);

// Beat 4 (480-600, 0:16-0:20): the Gerver-approximation holds in the
// vertical corridor, highlighted with a soft glow, as a single clean
// push tightens toward it and "IS THIS THE BIGGEST?" appears.
export const Beat4: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

  const pushT = easeInOutCubic(interpolate(frame, [0, PUSH_END], [0, 1], clampOpts));
  const shot = {
    cx: WIDE.cx + (TIGHT.cx - WIDE.cx) * pushT,
    cy: WIDE.cy + (TIGHT.cy - WIDE.cy) * pushT,
    scale: WIDE.scale + (TIGHT.scale - WIDE.scale) * pushT,
  };

  const glowPulse = 0.6 + 0.4 * Math.sin(frame / 14);
  const textScale = spring({frame: Math.max(0, frame - 70), fps, config: {damping: 12, mass: 0.5, stiffness: 190}});
  const textOpacity = interpolate(frame, [70, 82], [0, 1], clampOpts);

  return (
    <>
      <Scene>
        <Camera shot={shot}>
          <Hallway />
          <SofaShape
            localPoints={gerverPoints}
            theta={-Math.PI / 2}
            color={COLORS.green}
            fillOpacity={0.16 + 0.08 * glowPulse}
            glow
          />
        </Camera>
        <g
          opacity={textOpacity}
          transform={`translate(540 300) scale(${textScale})`}
          fontFamily="Helvetica, Arial, sans-serif"
        >
          <text x={0} y={0} fill={COLORS.bone} fontSize={56} fontWeight={800} textAnchor="middle" dominantBaseline="central">
            IS THIS THE
          </text>
          <text x={0} y={64} fill={COLORS.bone} fontSize={56} fontWeight={800} textAnchor="middle" dominantBaseline="central">
            BIGGEST?
          </text>
        </g>
      </Scene>
      <PhraseCaption frame={frame} phrases={PHRASES} />
    </>
  );
};
