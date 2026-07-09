import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {AbsoluteFill} from 'remotion';
import {CheckoutScene, LANE_X, LANE_BOTTOM} from '../CheckoutScene';
import {Caption} from '../Caption';
import {COLORS} from '../colors';
import {WIDTH, HEIGHT, BEATS} from '../constants';

const EXPRESS_X = LANE_X[2];
const ARRIVE_FRAME = 160;
const WIDE = {cx: 540, cy: 900, scale: 1.15};
const TIGHT = {cx: EXPRESS_X, cy: 900, scale: 1.6};

const SHOPPER_STARTS = [
  {x: LANE_X[0], startFrame: 10},
  {x: LANE_X[1], startFrame: 24},
  {x: LANE_X[3], startFrame: 18},
];

// Beat 16 (1560-1830, 0:52-1:01): cut to the store scene — one slow,
// steady push toward the express lane as shoppers rush into it.
export const Beat16: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat16.duration;
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

  const shopperY = LANE_BOTTOM - 200;
  const movingShoppers = SHOPPER_STARTS.map((s) => {
    const t = interpolate(frame, [s.startFrame, ARRIVE_FRAME], [0, 1], clampOpts);
    return {x: s.x + (EXPRESS_X - s.x) * t, y: shopperY, color: COLORS.green};
  });

  const pushT = interpolate(frame, [0, duration], [0, 1], clampOpts);
  const cx = WIDE.cx + (TIGHT.cx - WIDE.cx) * pushT;
  const cy = WIDE.cy + (TIGHT.cy - WIDE.cy) * pushT;
  const scale = WIDE.scale + (TIGHT.scale - WIDE.scale) * pushT;

  const queueCount = Math.round(interpolate(frame, [ARRIVE_FRAME, duration], [2, 7], clampOpts));

  const tx = WIDTH / 2 - cx * scale;
  const ty = HEIGHT / 2 - cy * scale;

  return (
    <>
      <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} width={WIDTH} height={HEIGHT} style={{position: 'absolute', top: 0, left: 0}}>
          <g transform={`translate(${tx} ${ty}) scale(${scale})`}>
            <CheckoutScene
              expressLaneIndex={2}
              signOpacity={1}
              signColor={frame >= ARRIVE_FRAME ? COLORS.red : COLORS.green}
              lanes={[
                {queueCount: 1, congestion: 0},
                {queueCount: 1, congestion: 0},
                {
                  queueCount: frame >= ARRIVE_FRAME ? queueCount : 2,
                  congestion: frame >= ARRIVE_FRAME ? Math.min(1, (queueCount - 2) / 5) : 0,
                },
                {queueCount: 1, congestion: 0},
              ]}
              movingShoppers={frame < ARRIVE_FRAME ? movingShoppers : []}
            />
          </g>
        </svg>
      </AbsoluteFill>
      <Caption
        frame={frame}
        duration={duration}
        text="It's like adding a faster checkout lane at a store — only for everyone to rush into that one lane until it becomes the"
      />
    </>
  );
};
