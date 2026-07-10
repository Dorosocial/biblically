import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {AbsoluteFill} from 'remotion';
import {Scene} from '../Scene';
import {RoadCountIcon} from '../RoadCountIcon';
import {BigText} from '../BigText';
import {PhraseCaption} from '../PhraseCaption';
import {COLORS} from '../colors';

const PHASE1_END = 110;

const PHRASES = [
  {at: 0, words: [{text: '...THINGS'}, {text: 'GET'}, {text: 'WEIRD', accent: true}]},
  {at: 35, words: [{text: 'NOT'}, {text: 'A'}, {text: 'ROAD', accent: true}, {text: 'PROBLEM'}]},
  {at: 95, words: [{text: "IT'S"}, {text: 'A'}, {text: 'CHOICE', accent: true}, {text: 'PROBLEM'}]},
  {at: 145, words: [{text: 'EVERYONE'}, {text: 'MAKES'}, {text: 'THE'}, {text: 'SAME'}, {text: 'CHOICE'}]},
  {at: 200, words: [{text: 'INSTEAD'}, {text: 'OF'}, {text: 'SPREADING'}, {text: 'OUT'}]},
];

// Beat 7 (900-1140, 0:30-0:38): one clean hard cut — no shake — into
// "NOT A ROAD PROBLEM" with a strike-through icon, then a calm punch-in
// on "A CHOICE PROBLEM".
export const Beat7: React.FC = () => {
  const frame = useCurrentFrame();
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

  const iconOpacity = interpolate(frame, [0, 10], [0, 1], clampOpts);
  const strikeProgress = interpolate(frame, [26, 50], [0, 1], clampOpts);
  const text1Opacity = interpolate(frame, [40, 55], [0, 1], clampOpts);

  const phase2Frame = Math.max(0, frame - PHASE1_END);
  const punchScale = interpolate(phase2Frame, [0, 16], [0.85, 1], clampOpts);
  const text2Opacity = interpolate(phase2Frame, [0, 10], [0, 1], clampOpts);

  return (
    <>
      <AbsoluteFill style={{backgroundColor: COLORS.bg}} />
      {frame < PHASE1_END ? (
        <>
          <Scene>
            <g transform="translate(540 760) scale(0.62)">
              <RoadCountIcon x={0} y={0} opacity={iconOpacity} strikeProgress={strikeProgress} />
            </g>
          </Scene>
          <BigText lines={[{text: 'NOT A ROAD PROBLEM', opacity: text1Opacity, color: COLORS.bone, fontSize: 62}]} top={1120} />
        </>
      ) : (
        <BigText
          lines={[{text: 'A CHOICE PROBLEM', opacity: text2Opacity, scale: punchScale, color: COLORS.pink, fontSize: 66, glow: true}]}
        />
      )}
      <PhraseCaption frame={frame} phrases={PHRASES} />
    </>
  );
};
