import React from 'react';
import {useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import {AbsoluteFill} from 'remotion';
import {Scene} from '../Scene';
import {TitleCard} from '../TitleCard';
import {GlobePin} from '../GlobePin';
import {PhraseCaption} from '../PhraseCaption';
import {COLORS} from '../colors';
import {HEIGHT} from '../constants';

const PHASE1_END = 90;
const PHASE2_END = 220;
const VIRTUAL_GAP = 420;
const PAN_START = 40;
const PAN_END = 62;

const PHRASES = [
  {at: 0, words: [{text: '...PARADOX', accent: true}]},
  {at: 40, words: [{text: 'A'}, {text: 'MATHEMATICAL'}, {text: 'PHENOMENON'}]},
  {at: 100, words: [{text: 'ADDING'}, {text: 'AN'}, {text: 'OPTION'}, {text: 'CAN'}]},
  {at: 150, words: [{text: 'MAKE'}, {text: 'THE'}, {text: 'SYSTEM'}, {text: 'WORSE', accent: true}]},
  {at: 230, words: [{text: 'SOME'}, {text: 'CITIES'}, {text: 'DISCOVERED'}]},
  {at: 280, words: [{text: 'SOMETHING'}, {text: 'SURPRISING'}]},
];

// Beat 11 (1800-2130, 1:00-1:11): the title (already popped in during the
// previous beat) gains its Zombie Math kicker, then a single virtual
// scroll reveals "MORE OPTIONS" -> "= WORSE SYSTEM", then one hard cut to
// a calm globe/pin icon.
export const Beat11: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

  if (frame < PHASE1_END) {
    const kickerOpacity = interpolate(frame, [10, 40], [0, 1], clampOpts);
    const glowPulse = 0.8 + 0.3 * Math.sin(frame / 9);
    return (
      <>
        <AbsoluteFill style={{backgroundColor: COLORS.bg}} />
        <TitleCard scale={1} opacity={1} kickerOpacity={kickerOpacity} glowPulse={glowPulse} />
        <PhraseCaption frame={frame} phrases={PHRASES} />
      </>
    );
  }

  if (frame < PHASE2_END) {
    const subFrame = frame - PHASE1_END;
    const punchScale = spring({frame: subFrame, fps, config: {damping: 14, mass: 0.5, stiffness: 180}});
    const scrollOffset = interpolate(subFrame, [PAN_START, PAN_END], [0, VIRTUAL_GAP], clampOpts);
    const line2Opacity = interpolate(subFrame, [PAN_START, PAN_START + 10], [0, 1], clampOpts);
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
        <PhraseCaption frame={frame} phrases={PHRASES} />
      </>
    );
  }

  const globeFrame = frame - PHASE2_END;
  const scale = spring({frame: globeFrame, fps, config: {damping: 14, mass: 0.6, stiffness: 170}});
  const opacity = interpolate(globeFrame, [0, 10], [0, 1], clampOpts);
  const rotation = globeFrame * 0.3;

  return (
    <>
      <Scene>
        <GlobePin x={540} y={880} scale={scale} opacity={opacity} rotationDeg={rotation} />
      </Scene>
      <PhraseCaption frame={frame} phrases={PHRASES} />
    </>
  );
};
