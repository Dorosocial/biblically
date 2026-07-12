import React from 'react';
import {useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import {Scene} from '../Scene';
import {NumberBlock} from '../NumberBlock';
import {NumberLine} from '../NumberLine';
import {PhraseCaption} from '../PhraseCaption';
import {COLORS} from '../colors';

const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

const TITLE_END = 40;
const BLOCKS_FADE_IN = [35, 55];
const ROUND_PROGRESS = [75, 105];
const BLOCKS_FADE_OUT = [140, 158];
const LINE1_WINDOW = [150, 268];
const LINE2_WINDOW = [263, 300];

const PHRASES = [
  {at: 0, words: [{text: 'CALLED'}, {text: 'ESTIMATION'}]},
  {at: 35, words: [{text: 'ROUND'}, {text: 'EVERY'}, {text: 'NUMBER'}]},
  {at: 65, words: [{text: 'IN'}, {text: 'THE'}, {text: 'PROBLEM'}]},
  {at: 95, words: [{text: 'BEFORE'}, {text: 'YOU'}, {text: 'EVEN'}, {text: 'SOLVE'}, {text: 'IT'}]},
  {at: 135, words: [{text: 'IF'}, {text: 'YOUR'}, {text: 'REAL'}, {text: 'ANSWER'}]},
  {at: 165, words: [{text: 'IS'}, {text: 'WAY'}, {text: 'OFF'}]},
  {at: 190, words: [{text: 'FROM'}, {text: 'YOUR'}, {text: 'ROUNDED'}, {text: 'ESTIMATE'}]},
  {at: 225, words: [{text: 'YOU'}, {text: 'MADE'}, {text: 'A'}, {text: 'MISTAKE'}]},
  {at: 260, words: [{text: 'BEFORE'}, {text: 'YOU'}, {text: 'EVEN'}]},
  {at: 280, words: [{text: 'CHECK'}, {text: 'YOUR'}, {text: 'WORK'}]},
];

// Beat 2 (300-600, 0:10-0:20): "ESTIMATION" pops in, then "47 x 23"
// visibly rounds to "50 x 20" (a real snap transition, not a static
// swap), then two number-line examples: one where the estimate and the
// real answer land close together (good), and one where they land far
// apart with a flashing red warning zone between them (a mistake).
export const Beat2: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], clampOpts);
  const titleScale = spring({frame, fps, config: {damping: 13, mass: 0.5, stiffness: 190}});

  const blocksOpacity = interpolate(
    frame,
    [BLOCKS_FADE_IN[0], BLOCKS_FADE_IN[1], BLOCKS_FADE_OUT[0], BLOCKS_FADE_OUT[1]],
    [0, 1, 1, 0],
    clampOpts
  );
  const roundProgress = interpolate(frame, ROUND_PROGRESS, [0, 1], clampOpts);

  const line1Opacity = interpolate(
    frame,
    [LINE1_WINDOW[0], LINE1_WINDOW[0] + 15, LINE1_WINDOW[1] - 15, LINE1_WINDOW[1]],
    [0, 1, 1, 0],
    clampOpts
  );
  const line1Draw = interpolate(frame, [LINE1_WINDOW[0], LINE1_WINDOW[0] + 30], [0, 1], clampOpts);
  const line1FlagPop = spring({
    frame: Math.max(0, frame - (LINE1_WINDOW[0] + 35)),
    fps,
    config: {damping: 12, mass: 0.5, stiffness: 200},
  });

  const line2Opacity = interpolate(frame, [LINE2_WINDOW[0], LINE2_WINDOW[0] + 8], [0, 1], clampOpts);
  const line2Draw = interpolate(frame, [LINE2_WINDOW[0], LINE2_WINDOW[0] + 12], [0, 1], clampOpts);
  const line2FlagPop = spring({
    frame: Math.max(0, frame - (LINE2_WINDOW[0] + 10)),
    fps,
    config: {damping: 12, mass: 0.5, stiffness: 210},
  });
  const warnFlash = 0.55 + 0.45 * Math.sin(frame / 3);

  return (
    <>
      <Scene>
        <g opacity={titleOpacity} transform={`translate(540 280) scale(${titleScale})`}>
          <text
            x={0}
            y={0}
            fill={COLORS.green}
            fontSize={78}
            fontWeight={800}
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily="Helvetica, Arial, sans-serif"
            style={{textShadow: `0 0 20px ${COLORS.green}`}}
          >
            ESTIMATION
          </text>
        </g>

        {blocksOpacity > 0.01 ? (
          <g opacity={blocksOpacity}>
            <NumberBlock x={330} y={800} from={47} to={50} progress={roundProgress} color={COLORS.cyan} />
            <text
              x={540}
              y={800}
              fill={COLORS.bone}
              fontSize={64}
              fontWeight={800}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily="Helvetica, Arial, sans-serif"
            >
              &#215;
            </text>
            <NumberBlock x={750} y={800} from={23} to={20} progress={roundProgress} color={COLORS.pink} />
          </g>
        ) : null}

        {line1Opacity > 0.01 ? (
          <g opacity={line1Opacity}>
            <text
              x={540}
              y={950}
              fill={COLORS.boneDim}
              fontSize={30}
              fontWeight={700}
              textAnchor="middle"
              fontFamily="Helvetica, Arial, sans-serif"
            >
              SAME BALLPARK
            </text>
            <NumberLine
              x={140}
              y={1100}
              width={800}
              min={800}
              max={1200}
              drawProgress={line1Draw}
              flags={[
                {value: 1000, color: COLORS.green, label: '~1,000', scale: line1FlagPop},
                {value: 1081, color: COLORS.cyan, label: '1,081', scale: line1FlagPop},
              ]}
            />
          </g>
        ) : null}

        {line2Opacity > 0.01 ? (
          <g opacity={line2Opacity}>
            <text
              x={540}
              y={950}
              fill={COLORS.red}
              fontSize={30}
              fontWeight={700}
              textAnchor="middle"
              fontFamily="Helvetica, Arial, sans-serif"
            >
              THAT'S A MISTAKE
            </text>
            <NumberLine
              x={140}
              y={1100}
              width={800}
              min={0}
              max={11500}
              drawProgress={line2Draw}
              warningZone={{from: 1000, to: 10810, opacity: warnFlash}}
              flags={[
                {value: 1000, color: COLORS.green, label: '~1,000', scale: line2FlagPop},
                {value: 10810, color: COLORS.red, label: '10,810', scale: line2FlagPop},
              ]}
            />
          </g>
        ) : null}
      </Scene>
      <PhraseCaption frame={frame} phrases={PHRASES} />
    </>
  );
};
