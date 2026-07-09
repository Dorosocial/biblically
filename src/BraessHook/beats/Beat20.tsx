import React from 'react';
import {useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import {AbsoluteFill} from 'remotion';
import {Caption} from '../Caption';
import {COLORS} from '../colors';
import {HEIGHT, BEATS} from '../constants';

const VIRTUAL_GAP = 420;
const PAN_START = 50;
const PAN_END = 72;

// Beat 20 (2130-2250, 1:11-1:15): "MORE OPTIONS" builds, then a single
// virtual-scroll pan reveals "= WORSE SYSTEM" beneath it.
export const Beat20: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const duration = BEATS.beat20.duration;
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

  const punchScale = spring({frame, fps, config: {damping: 14, mass: 0.5, stiffness: 180}});
  const scrollOffset = interpolate(frame, [PAN_START, PAN_END], [0, VIRTUAL_GAP], clampOpts);
  const line2Opacity = interpolate(frame, [PAN_START, PAN_START + 10], [0, 1], clampOpts);

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
        </div>
      </AbsoluteFill>
      <Caption
        frame={frame}
        duration={duration}
        text="where adding a new option can actually make the whole system worse."
      />
    </>
  );
};
