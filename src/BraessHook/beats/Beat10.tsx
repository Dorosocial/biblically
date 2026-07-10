import React from 'react';
import {useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import {AbsoluteFill} from 'remotion';
import {NetworkScene} from '../NetworkScene';
import {CheckoutScene, LANE_X} from '../CheckoutScene';
import {TitleCard} from '../TitleCard';
import {PhraseCaption} from '../PhraseCaption';
import {COLORS} from '../colors';
import {WIDTH, HEIGHT} from '../constants';
import {ROUTE_MIX_VIA_M1_FIRST, ROUTE_MIX_VIA_M2_FIRST, NODE_M2} from '../geometry';

const PHASE1_END = 70;
const PHASE2_END = 200;
const EXPRESS_X = LANE_X[2];
const JAM_SHOT = {cx: EXPRESS_X, cy: 900, scale: 1.55};

const PHRASES = [
  {at: 0, words: [{text: 'EVERYONE'}, {text: 'RUSHES'}, {text: 'IN'}]},
  {at: 50, words: [{text: 'UNTIL'}, {text: "IT'S"}, {text: 'THE'}, {text: 'SLOWEST', accent: true}, {text: 'LINE'}]},
  {at: 110, words: [{text: 'THE'}, {text: 'CITY'}, {text: 'ADDED'}, {text: 'A'}, {text: 'ROAD'}]},
  {at: 165, words: [{text: 'BUT'}, {text: 'CREATED'}, {text: 'A'}, {text: 'TRAFFIC'}, {text: 'JAM', accent: true}]},
  {at: 230, words: [{text: 'THIS'}, {text: 'IS'}, {text: 'CALLED...'}]},
  {at: 270, words: [{text: "BRAESS'S..."}]},
];

// Beat 10 (1500-1800, 0:50-1:00): a static hold on the jammed express
// lane, then one hard-cut pull-back to the full congested network, then
// the title card begins a clean pop-in (no shake — the kicker branding
// arrives in the next beat).
export const Beat10: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

  if (frame < PHASE1_END) {
    const tx = WIDTH / 2 - JAM_SHOT.cx * JAM_SHOT.scale;
    const ty = HEIGHT / 2 - JAM_SHOT.cy * JAM_SHOT.scale;
    return (
      <>
        <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
          <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} width={WIDTH} height={HEIGHT} style={{position: 'absolute', top: 0, left: 0}}>
            <g transform={`translate(${tx} ${ty}) scale(${JAM_SHOT.scale})`}>
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
        <PhraseCaption frame={frame} phrases={PHRASES} />
      </>
    );
  }

  if (frame < PHASE2_END) {
    const subFrame = frame - PHASE1_END;
    const pullback = interpolate(subFrame, [0, PHASE2_END - PHASE1_END], [0, 1], clampOpts);
    const cx = NODE_M2.x + (540 - NODE_M2.x) * pullback;
    const cy = NODE_M2.y + (910 - NODE_M2.y) * pullback;
    const scale = 2.4 - 1.3 * pullback;
    const shot = {cx, cy, scale};

    return (
      <>
        <NetworkScene
          frame={frame}
          shot={shot}
          showShortcut
          showMidNodes
          leftCongestion={1}
          rightCongestion={1}
          shortcutCongestion={1}
          streams={[
            {route: ROUTE_MIX_VIA_M1_FIRST, count: 13, speed: 0.004, phase: 0.1, radius: 9, congestion: 1, jam: 0.95},
            {route: ROUTE_MIX_VIA_M2_FIRST, count: 13, speed: 0.004, phase: 0.55, radius: 9, congestion: 1, jam: 0.95},
          ]}
        />
        <PhraseCaption frame={frame} phrases={PHRASES} />
      </>
    );
  }

  const titleFrame = frame - PHASE2_END;
  const scale = spring({frame: titleFrame, fps, config: {damping: 14, mass: 0.6, stiffness: 170}});
  const opacity = interpolate(titleFrame, [0, 10], [0, 1], clampOpts);

  return (
    <>
      <AbsoluteFill style={{backgroundColor: COLORS.bg}} />
      <TitleCard scale={scale} opacity={opacity} kickerOpacity={0} glowPulse={1} />
      <PhraseCaption frame={frame} phrases={PHRASES} />
    </>
  );
};
