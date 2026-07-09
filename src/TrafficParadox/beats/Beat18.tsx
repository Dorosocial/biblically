import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {AbsoluteFill} from 'remotion';
import {Scene} from '../Scene';
import {BigText} from '../BigText';
import {Caption} from '../Caption';
import {COLORS} from '../colors';
import {BEATS} from '../constants';

// Beat 18 (2100-2280, 1:10-1:16): text builds progressively — "MORE
// OPTIONS", then "= WORSE SYSTEM" beneath it, then a downward red arrow.
export const Beat18: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat18.duration;
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

  const line1Opacity = interpolate(frame, [0, 16], [0, 1], clampOpts);
  const line2Opacity = interpolate(frame, [50, 70], [0, 1], clampOpts);
  const arrowOpacity = interpolate(frame, [90, 110], [0, 1], clampOpts);
  const arrowY = interpolate(frame, [90, 130], [0, 40], clampOpts);

  return (
    <>
      <AbsoluteFill style={{backgroundColor: COLORS.bg}} />
      <BigText
        lines={[
          {text: 'MORE OPTIONS', opacity: line1Opacity, color: COLORS.bone, fontSize: 70},
          {text: '= WORSE SYSTEM', opacity: line2Opacity, color: COLORS.red, fontSize: 70, glow: true},
        ]}
        top={520}
      />
      <Scene>
        <g opacity={arrowOpacity} transform={`translate(540 ${1280 + arrowY})`}>
          <line x1={0} y1={-70} x2={0} y2={50} stroke={COLORS.red} strokeWidth={14} strokeLinecap="round" />
          <polygon points="0,110 -50,30 50,30" fill={COLORS.red} />
        </g>
      </Scene>
      <Caption
        frame={frame}
        duration={duration}
        text="It's a mathematical phenomenon where adding a new option can actually make the whole system worse."
      />
    </>
  );
};
