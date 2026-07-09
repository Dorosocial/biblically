import React from 'react';
import {useCurrentFrame} from 'remotion';
import {AbsoluteFill} from 'remotion';
import {CheckoutScene, LANE_X} from '../CheckoutScene';
import {Caption} from '../Caption';
import {COLORS} from '../colors';
import {WIDTH, HEIGHT, BEATS} from '../constants';

const EXPRESS_X = LANE_X[2];
const SHOT = {cx: EXPRESS_X, cy: 900, scale: 1.6};

// Beat 17 (1830-1860, 1:01-1:02): a static hold on the now-jammed express
// lane, red highlight.
export const Beat17: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat17.duration;

  const tx = WIDTH / 2 - SHOT.cx * SHOT.scale;
  const ty = HEIGHT / 2 - SHOT.cy * SHOT.scale;

  return (
    <>
      <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} width={WIDTH} height={HEIGHT} style={{position: 'absolute', top: 0, left: 0}}>
          <g transform={`translate(${tx} ${ty}) scale(${SHOT.scale})`}>
            <CheckoutScene
              expressLaneIndex={2}
              signOpacity={1}
              signColor={COLORS.red}
              lanes={[
                {queueCount: 1, congestion: 0},
                {queueCount: 1, congestion: 0},
                {queueCount: 7, congestion: 1},
                {queueCount: 1, congestion: 0},
              ]}
            />
          </g>
        </svg>
      </AbsoluteFill>
      <Caption frame={frame} duration={duration} text="slowest lane." />
    </>
  );
};
