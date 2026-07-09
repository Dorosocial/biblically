import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {AbsoluteFill} from 'remotion';
import {Camera} from '../Camera';
import {CheckoutScene, LANE_X, LANE_TOP} from '../CheckoutScene';
import {Caption} from '../Caption';
import {COLORS} from '../colors';
import {WIDTH, HEIGHT, BEATS} from '../constants';
import {lerpShot} from '../ease';

const WIDE = {cx: 540, cy: 900, scale: 1.3};
const SIGN_TIGHT = {cx: LANE_X[2], cy: 545, scale: 2.6};

const SNAP_START = 35;
const SNAP_END = 50;
const HOLD_END = 75;

// Beat 19 (1350-1500, 45s-56s): HARD CUT to the store scene. The camera
// snap-zooms onto the EXPRESS LANE sign the instant it's mentioned, then
// pans across the other lanes.
export const Beat19: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat19.duration;
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

  const signOpacity = interpolate(frame, [24, SNAP_START], [0, 1], clampOpts);

  let shot = WIDE;
  if (frame >= SNAP_START && frame < HOLD_END) {
    const t = interpolate(frame, [SNAP_START, SNAP_END], [0, 1], clampOpts);
    shot = lerpShot(WIDE, SIGN_TIGHT, t);
  } else if (frame >= HOLD_END) {
    const panT = interpolate(frame, [HOLD_END, duration], [0, 1], clampOpts);
    const panTarget = {cx: LANE_X[0], cy: 900, scale: 1.9};
    shot = lerpShot(SIGN_TIGHT, panTarget, panT);
  }

  const tx = WIDTH / 2 - shot.cx * shot.scale;
  const ty = HEIGHT / 2 - shot.cy * shot.scale;

  return (
    <>
      <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} width={WIDTH} height={HEIGHT} style={{position: 'absolute', top: 0, left: 0}}>
          <g transform={`translate(${tx} ${ty}) scale(${shot.scale})`}>
            <CheckoutScene
              expressLaneIndex={2}
              signOpacity={signOpacity}
              signColor={COLORS.green}
              lanes={[
                {queueCount: 2, congestion: 0},
                {queueCount: 2, congestion: 0},
                {queueCount: 2, congestion: 0},
                {queueCount: 2, congestion: 0},
              ]}
            />
          </g>
        </svg>
      </AbsoluteFill>
      <Caption
        frame={frame}
        duration={duration}
        text="the shortcut connects to the original roads. It's like adding a faster check-out lane"
      />
    </>
  );
};
