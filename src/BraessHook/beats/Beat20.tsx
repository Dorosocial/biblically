import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {AbsoluteFill} from 'remotion';
import {CheckoutScene, LANE_X, LANE_BOTTOM} from '../CheckoutScene';
import {Caption} from '../Caption';
import {COLORS} from '../colors';
import {WIDTH, HEIGHT, BEATS} from '../constants';

const EXPRESS_X = LANE_X[2];
const ARRIVE_FRAME = 70;

const SHOPPER_STARTS = [
  {x: LANE_X[0], startFrame: 0},
  {x: LANE_X[1], startFrame: 8},
  {x: LANE_X[3], startFrame: 4},
];

// Beat 20 (1500-1650, 56s-1:02): the camera FOLLOWS shopper-figures
// physically rushing into the express lane, then holds tight on the
// resulting jam as it visibly grows.
export const Beat20: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat20.duration;
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

  const shopperY = LANE_BOTTOM - 200;
  const movingShoppers = SHOPPER_STARTS.map((s) => {
    const t = interpolate(frame, [s.startFrame, ARRIVE_FRAME], [0, 1], clampOpts);
    return {x: s.x + (EXPRESS_X - s.x) * t, y: shopperY, color: COLORS.green};
  });
  const leadX = movingShoppers[0].x;

  const pan = interpolate(frame, [0, ARRIVE_FRAME], [0, 1], clampOpts);
  const scale = 1.7 + 0.5 * pan;
  const cx = leadX;
  const cy = 900;

  const queueCount = Math.round(
    interpolate(frame, [ARRIVE_FRAME, duration], [2, 8], clampOpts)
  );

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
                {queueCount: 0, congestion: 0},
                {queueCount: 1, congestion: 0},
                {queueCount: frame >= ARRIVE_FRAME ? queueCount : 2, congestion: frame >= ARRIVE_FRAME ? Math.min(1, (queueCount - 2) / 6) : 0},
                {queueCount: 0, congestion: 0},
              ]}
              movingShoppers={frame < ARRIVE_FRAME ? movingShoppers : []}
            />
          </g>
        </svg>
      </AbsoluteFill>
      <Caption
        frame={frame}
        duration={duration}
        text="only for everyone to rush into that one lane until it becomes the slowest line."
      />
    </>
  );
};
