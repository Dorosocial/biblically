import React from 'react';
import {useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import {Scene} from '../Scene';
import {Gauge} from '../Gauge';
import {PhraseCaption} from '../PhraseCaption';
import {COLORS} from '../colors';
import {easeInOutCubic} from '../ease';

const PHASE_A_END = 70; // equation + question mark
const PHASE_B_END = 140; // gauge at GUESSING
const PHASE_C_END = 200; // "HOPE?" strike-through
// PHASE_D: 200-300 -- gauge swings to METHOD + checkmark

const PHRASES = [
  {at: 0, words: [{text: 'YOU'}, {text: 'JUST'}, {text: 'SOLVED'}]},
  {at: 30, words: [{text: 'A'}, {text: 'MATH'}, {text: 'PROBLEM'}]},
  {at: 65, words: [{text: 'HOW'}, {text: 'DO'}, {text: 'YOU'}, {text: 'KNOW'}]},
  {at: 100, words: [{text: 'YOUR'}, {text: 'ANSWER'}, {text: 'IS'}]},
  {at: 130, words: [{text: 'ACTUALLY'}, {text: 'RIGHT?'}]},
  {at: 165, words: [{text: 'MOST'}, {text: 'PEOPLE'}, {text: 'JUST'}, {text: 'HOPE'}]},
  {at: 210, words: [{text: "THAT"}, {text: "THERE'S"}]},
  {at: 235, words: [{text: 'AN'}, {text: 'ACTUAL'}, {text: 'METHOD'}]},
  {at: 270, words: [{text: "IT'S..."}]},
];

const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

// Beat 1 (0-300, 0:00-0:10): four quick, hard-cut vector diagrams — no
// camera movement, no shake — narrating "how do you know your answer is
// right": an equation with a circled answer and a pulsing question
// mark, a confidence gauge stuck on GUESSING, "HOPE?" struck through,
// then the gauge swings over to METHOD as a checkmark pops in.
export const Beat1: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const aOpacity = interpolate(frame, [0, 10, PHASE_A_END - 10, PHASE_A_END], [0, 1, 1, 0], clampOpts);
  const qPulse = 0.6 + 0.4 * Math.sin(frame / 6);
  const qScale = spring({frame, fps, config: {damping: 12, mass: 0.5, stiffness: 200}});

  const bOpacity = interpolate(
    frame,
    [PHASE_A_END, PHASE_A_END + 10, PHASE_B_END - 10, PHASE_B_END],
    [0, 1, 1, 0],
    clampOpts
  );

  const cOpacity = interpolate(
    frame,
    [PHASE_B_END, PHASE_B_END + 10, PHASE_C_END - 10, PHASE_C_END],
    [0, 1, 1, 0],
    clampOpts
  );
  const strikeProgress = interpolate(frame, [PHASE_B_END + 20, PHASE_B_END + 55], [0, 1], clampOpts);

  const dOpacity = interpolate(frame, [PHASE_C_END, PHASE_C_END + 10], [0, 1], clampOpts);
  const swingT = easeInOutCubic(interpolate(frame, [PHASE_C_END + 10, 300], [0, 1], clampOpts));
  const needleAngle = 180 - 180 * swingT;
  const checkOpacity = interpolate(frame, [280, 295], [0, 1], clampOpts);
  const checkScale = spring({frame: Math.max(0, frame - 280), fps, config: {damping: 11, mass: 0.5, stiffness: 220}});

  return (
    <>
      <Scene>
        {aOpacity > 0.01 ? (
          <g opacity={aOpacity}>
            <text
              x={340}
              y={900}
              fill={COLORS.bone}
              fontSize={72}
              fontWeight={800}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily="Helvetica, Arial, sans-serif"
            >
              12 &#215; 8 =
            </text>
            <circle cx={620} cy={900} r={80} fill="none" stroke={COLORS.cyan} strokeWidth={7} />
            <text
              x={620}
              y={900}
              fill={COLORS.cyan}
              fontSize={72}
              fontWeight={800}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily="Helvetica, Arial, sans-serif"
            >
              96
            </text>
            <g transform={`translate(830 780) scale(${qScale})`} opacity={0.5 + 0.5 * qPulse}>
              <text
                x={0}
                y={0}
                fill={COLORS.yellow}
                fontSize={130}
                fontWeight={800}
                textAnchor="middle"
                dominantBaseline="central"
                fontFamily="Helvetica, Arial, sans-serif"
                style={{filter: `drop-shadow(0 0 ${18 * qPulse}px ${COLORS.yellow})`}}
              >
                ?
              </text>
            </g>
          </g>
        ) : null}

        {bOpacity > 0.01 ? <Gauge cx={540} cy={950} needleAngleDeg={180} opacity={bOpacity} /> : null}

        {cOpacity > 0.01 ? (
          <g opacity={cOpacity}>
            <text
              x={540}
              y={900}
              fill={COLORS.bone}
              fontSize={100}
              fontWeight={800}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily="Helvetica, Arial, sans-serif"
            >
              HOPE?
            </text>
            <line
              x1={280}
              y1={900}
              x2={800}
              y2={900}
              stroke={COLORS.red}
              strokeWidth={10}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - strikeProgress}
            />
          </g>
        ) : null}

        {dOpacity > 0.01 ? (
          <g opacity={dOpacity}>
            <Gauge cx={540} cy={950} needleAngleDeg={needleAngle} />
            <g transform={`translate(540 620) scale(${checkScale})`} opacity={checkOpacity}>
              <circle cx={0} cy={0} r={54} fill={COLORS.green} opacity={0.18} />
              <path
                d="M -22,0 L -6,18 L 24,-20"
                stroke={COLORS.green}
                strokeWidth={12}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </g>
          </g>
        ) : null}
      </Scene>
      <PhraseCaption frame={frame} phrases={PHRASES} />
    </>
  );
};
