import React from 'react';
import {useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import {AbsoluteFill} from 'remotion';
import {Wordmark} from '../Wordmark';
import {PhraseCaption} from '../PhraseCaption';
import {COLORS} from '../colors';

const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

const LINES = [
  {text: 'ESTIMATE FIRST.', color: COLORS.green, at: 0},
  {text: 'SOLVE SECOND.', color: COLORS.cyan, at: 15},
  {text: 'COMPARE.', color: COLORS.pink, at: 30},
];

const PHRASES = [{at: 0, words: [{text: 'AND'}, {text: 'COMPARE'}]}];

// Beat 4 (900-960, 0:30-0:32): the three-step mantra lands in rapid,
// color-coded succession, then the Zombie Math wordmark settles in as
// the final frame.
export const Beat4: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const wordmarkOpacity = interpolate(frame, [45, 60], [0, 0.85], clampOpts);

  return (
    <>
      <AbsoluteFill style={{backgroundColor: COLORS.bg}} />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 800,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 22,
        }}
      >
        {LINES.map((line, i) => {
          const opacity = interpolate(frame, [line.at, line.at + 10], [0, 1], clampOpts);
          const scale = spring({frame: Math.max(0, frame - line.at), fps, config: {damping: 13, mass: 0.5, stiffness: 220}});
          return (
            <div key={i} style={{opacity, transform: `scale(${scale})`}}>
              <span
                style={{
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  fontWeight: 800,
                  fontSize: 56,
                  color: line.color,
                  textShadow: `0 0 18px ${line.color}`,
                }}
              >
                {line.text}
              </span>
            </div>
          );
        })}
      </div>
      <Wordmark opacity={wordmarkOpacity} />
      <PhraseCaption frame={frame} phrases={PHRASES} y={1260} />
    </>
  );
};
