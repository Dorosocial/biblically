import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {AbsoluteFill} from 'remotion';
import {BigText} from '../BigText';
import {Flash} from '../Flash';
import {Caption} from '../Caption';
import {COLORS} from '../colors';
import {BEATS} from '../constants';
import {shakeOffset, flashOpacityAt} from '../shake';

const IMPACT_FRAME = 6;

// Beat 10 (570-660, 19s-22s): HARD CUT, tight punch-in on bold text
// slamming in with screen-shake.
export const Beat10: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat10.duration;
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

  const line1Opacity = interpolate(frame, [0, 6], [0, 1], clampOpts);
  const line2Opacity = interpolate(frame, [IMPACT_FRAME, IMPACT_FRAME + 8], [0, 1], clampOpts);
  const pulseScale = 1 + 0.08 * Math.sin(frame / 6);
  const shake = shakeOffset(frame, IMPACT_FRAME, 18, 12);
  const flash = flashOpacityAt(frame, IMPACT_FRAME, 0.5, 6);

  return (
    <>
      <AbsoluteFill style={{backgroundColor: COLORS.bg}} />
      <BigText
        shake={shake}
        lines={[
          {text: 'MORE ROADS', opacity: line1Opacity, color: COLORS.bone, fontSize: 78},
          {text: '= LESS TRAFFIC?', opacity: line2Opacity, color: COLORS.pink, fontSize: 78, scale: pulseScale, glow: true},
        ]}
      />
      <Flash opacity={flash} />
      <Caption frame={frame} duration={duration} text="More roads should mean less traffic, right?" />
    </>
  );
};
