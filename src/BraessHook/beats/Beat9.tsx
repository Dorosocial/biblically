import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {AbsoluteFill} from 'remotion';
import {NetworkScene} from '../NetworkScene';
import {CheckoutScene, LANE_X, LANE_BOTTOM} from '../CheckoutScene';
import {PhraseCaption} from '../PhraseCaption';
import {COLORS} from '../colors';
import {WIDTH, HEIGHT} from '../constants';
import {ROUTE_MIX_VIA_M1_FIRST, ROUTE_MIX_VIA_M2_FIRST, NODE_M2} from '../geometry';

const PHASE1_END = 150;
const EXPRESS_X = LANE_X[2];
const ARRIVE_FRAME = 120;
const STORE_WIDE = {cx: 540, cy: 900, scale: 1.15};
const STORE_TIGHT = {cx: EXPRESS_X, cy: 900, scale: 1.55};

const SHOPPER_STARTS = [
  {x: LANE_X[0], startFrame: 8},
  {x: LANE_X[1], startFrame: 20},
  {x: LANE_X[3], startFrame: 14},
];

const PHRASES = [
  {at: 0, words: [{text: 'CARS'}, {text: 'PILE'}, {text: 'ONTO'}, {text: 'THE'}, {text: 'SHORTCUT', accent: true}]},
  {at: 55, words: [{text: 'CREATING'}, {text: 'BOTTLENECKS', accent: true}]},
  {at: 110, words: [{text: 'WHERE'}, {text: 'IT'}, {text: 'CONNECTS'}]},
  {at: 155, words: [{text: 'TO'}, {text: 'THE'}, {text: 'ORIGINAL'}, {text: 'ROADS'}]},
  {at: 210, words: [{text: 'LIKE'}, {text: 'A'}, {text: 'FASTER'}, {text: 'CHECKOUT', accent: true}, {text: 'LANE'}]},
  {at: 265, words: [{text: 'AT'}, {text: 'A'}, {text: 'STORE...'}]},
];

// Beat 9 (1200-1500, 0:40-0:50): a single slow push toward the chokepoint
// as it shifts amber, then one hard cut to the store scene with shoppers
// rushing toward the express lane sign — a single steady push there too.
export const Beat9: React.FC = () => {
  const frame = useCurrentFrame();
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

  if (frame < PHASE1_END) {
    const congestion = interpolate(frame, [0, PHASE1_END], [0.15, 0.55], clampOpts);
    const jam = interpolate(frame, [0, PHASE1_END], [0.1, 0.5], clampOpts);
    const scale = interpolate(frame, [0, PHASE1_END], [2.1, 2.8], clampOpts);
    const shot = {cx: NODE_M2.x, cy: NODE_M2.y, scale};

    return (
      <>
        <NetworkScene
          frame={frame}
          shot={shot}
          showShortcut
          showMidNodes
          leftCongestion={congestion * 0.6}
          rightCongestion={congestion * 0.6}
          shortcutCongestion={congestion}
          streams={[
            {route: ROUTE_MIX_VIA_M1_FIRST, count: 11, speed: 0.012, phase: 0.1, radius: 10, congestion, jam},
            {route: ROUTE_MIX_VIA_M2_FIRST, count: 11, speed: 0.012, phase: 0.55, radius: 10, congestion, jam},
          ]}
        />
        <PhraseCaption frame={frame} phrases={PHRASES} />
      </>
    );
  }

  const subFrame = frame - PHASE1_END;
  const shopperY = LANE_BOTTOM - 200;
  const movingShoppers = SHOPPER_STARTS.map((s) => {
    const t = interpolate(subFrame, [s.startFrame, ARRIVE_FRAME], [0, 1], clampOpts);
    return {x: s.x + (EXPRESS_X - s.x) * t, y: shopperY, color: COLORS.green};
  });
  const signOpacity = interpolate(subFrame, [0, 20], [0, 1], clampOpts);

  const pushT = interpolate(subFrame, [0, PHASE1_END], [0, 1], clampOpts);
  const cx = STORE_WIDE.cx + (STORE_TIGHT.cx - STORE_WIDE.cx) * pushT;
  const cy = STORE_WIDE.cy + (STORE_TIGHT.cy - STORE_WIDE.cy) * pushT;
  const scale = STORE_WIDE.scale + (STORE_TIGHT.scale - STORE_WIDE.scale) * pushT;
  const tx = WIDTH / 2 - cx * scale;
  const ty = HEIGHT / 2 - cy * scale;

  return (
    <>
      <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} width={WIDTH} height={HEIGHT} style={{position: 'absolute', top: 0, left: 0}}>
          <g transform={`translate(${tx} ${ty}) scale(${scale})`}>
            <CheckoutScene
              expressLaneIndex={2}
              signOpacity={signOpacity}
              signColor={COLORS.green}
              lanes={[
                {queueCount: 1, congestion: 0},
                {queueCount: 1, congestion: 0},
                {queueCount: 2, congestion: 0},
                {queueCount: 1, congestion: 0},
              ]}
              movingShoppers={movingShoppers}
            />
          </g>
        </svg>
      </AbsoluteFill>
      <PhraseCaption frame={frame} phrases={PHRASES} />
    </>
  );
};
