import React from 'react';
import {useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import {AbsoluteFill} from 'remotion';
import {Caption} from '../Caption';
import {COLORS} from '../colors';
import {HEIGHT, BEATS} from '../constants';

const VIRTUAL_GAP = 480;
const PAN_START = 70;
const PAN_END = 92;

// Beat 23 (1860-2040, 1:10-1:16): the camera punches in on "MORE
// OPTIONS", then whip-pans down to "= WORSE SYSTEM" as it appears
// beneath — simulated as a virtual vertical scroll between two stacked
// text blocks, since this beat has no world-space map to move through.
export const Beat23: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const duration = BEATS.beat23.duration;
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

  const punchScale = spring({frame, fps, config: {damping: 12, mass: 0.5, stiffness: 210}});
  const scrollOffset = interpolate(frame, [PAN_START, PAN_END], [0, VIRTUAL_GAP], {
    ...clampOpts,
  });
  const line2Opacity = interpolate(frame, [PAN_START, PAN_START + 10], [0, 1], clampOpts);
  const arrowOpacity = interpolate(frame, [PAN_END + 20, PAN_END + 36], [0, 1], clampOpts);
  const arrowY = interpolate(frame, [PAN_END + 20, PAN_END + 60], [0, 40], clampOpts);

  const block1Top = HEIGHT / 2 - 60;
  const block2Top = block1Top + VIRTUAL_GAP;

  return (
    <>
      <AbsoluteFill style={{backgroundColor: COLORS.bg, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 0, transform: `translateY(${-scrollOffset}px)`}}>
          <div style={{position: 'absolute', left: 0, right: 0, top: block1Top, display: 'flex', justifyContent: 'center'}}>
            <span
              style={{
                display: 'block',
                transform: `scale(${punchScale})`,
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 800,
                fontSize: 78,
                letterSpacing: 2,
                color: COLORS.bone,
                textAlign: 'center',
                textTransform: 'uppercase',
              }}
            >
              MORE OPTIONS
            </span>
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, top: block2Top, display: 'flex', justifyContent: 'center'}}>
            <span
              style={{
                display: 'block',
                opacity: line2Opacity,
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 800,
                fontSize: 78,
                letterSpacing: 2,
                color: COLORS.red,
                textAlign: 'center',
                textTransform: 'uppercase',
                textShadow: `0 0 24px ${COLORS.red}, 0 0 60px ${COLORS.red}`,
              }}
            >
              = WORSE SYSTEM
            </span>
          </div>
          <svg
            width={1080}
            height={300}
            viewBox="0 0 1080 300"
            style={{position: 'absolute', left: 0, top: block2Top + 140, opacity: arrowOpacity, transform: `translateY(${arrowY}px)`}}
          >
            <line x1={540} y1={0} x2={540} y2={120} stroke={COLORS.red} strokeWidth={14} strokeLinecap="round" />
            <polygon points="540,180 490,100 590,100" fill={COLORS.red} />
          </svg>
        </div>
      </AbsoluteFill>
      <Caption
        frame={frame}
        duration={duration}
        text="It's a mathematical phenomenon where adding a new option can actually make the whole system worse."
      />
    </>
  );
};
