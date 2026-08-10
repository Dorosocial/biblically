import React from 'react';
import {AbsoluteFill} from 'remotion';
import {CUE, sec} from '../timing';
import {kf, ORIGIN, BESIDE_RIGHT} from '../physics';
import {projectToScreen} from './project';

const fadeOpacity = (frame: number, inStart: number, inEnd: number, outStart: number, outEnd: number) => {
  if (frame < inStart || frame > outEnd) return 0;
  if (frame < inEnd) return kf(frame, inStart, inEnd, 0, 1, true);
  if (frame > outStart) return kf(frame, outStart, outEnd, 1, 0, true);
  return 1;
};

const FONT = '"Helvetica Neue", Arial, sans-serif';

const tag: React.CSSProperties = {
  position: 'absolute',
  fontFamily: FONT,
  fontWeight: 700,
  letterSpacing: '0.14em',
  color: '#eaf3ff',
  textShadow: '0 0 18px rgba(120,170,255,0.75), 0 2px 6px rgba(0,0,0,0.7)',
  whiteSpace: 'nowrap',
};

/** "PROTON" tag tracking the tiny glowing dot wherever it is on screen. */
const ProtonTag: React.FC<{frame: number}> = ({frame}) => {
  let opacity = 0;
  if (frame < CUE.protonToBasketball) {
    const dotIn = CUE.hook + Math.round((CUE.protonToBasketball - CUE.hook) * 0.45);
    opacity = fadeOpacity(frame, dotIn + 6, dotIn + 20, CUE.protonToBasketball - 8, CUE.protonToBasketball);
  } else if (frame >= CUE.reverseToProton && frame < CUE.numberTyping) {
    const dotIn = CUE.reverseToProton + 24;
    opacity = fadeOpacity(frame, dotIn + 4, dotIn + 16, CUE.numberTyping - 10, CUE.numberTyping);
  }
  if (opacity <= 0.001) return null;
  const p = projectToScreen(frame, BESIDE_RIGHT);
  return (
    <div style={{...tag, left: p.x + 26, top: p.y - 10, fontSize: 22, opacity}}>PROTON</div>
  );
};

/** "1.7 × 10⁻¹⁵ m" scale marker beside the proton. */
const ScaleMarker: React.FC<{frame: number}> = ({frame}) => {
  const opacity = fadeOpacity(frame, CUE.protonScaleLabel + 10, CUE.protonScaleLabel + 26, CUE.numberTyping - 12, CUE.numberTyping);
  if (opacity <= 0.001) return null;
  const p = projectToScreen(frame, BESIDE_RIGHT);
  return (
    <div style={{...tag, left: p.x + 30, top: p.y + 14, fontSize: 30, letterSpacing: '0.02em', opacity}}>
      1.7 × 10<sup>-15</sup> m
    </div>
  );
};

/** The decimal-to-scientific-notation typing/counting animation. */
const NumberTyping: React.FC<{frame: number}> = ({frame}) => {
  const shotStart = CUE.numberTyping;
  const shotEnd = CUE.hairCut;
  if (frame < shotStart || frame > shotEnd) return null;

  const digitsStart = sec(23.22);
  const digitsEnd = sec(31.56);
  const collapseStart = shotEnd - 14;
  const digits = '00000000017';

  const introOpacity = fadeOpacity(frame, shotStart, shotStart + 8, digitsStart, digitsStart + 4);
  const revealed = digits.slice(0, Math.floor(kf(frame, digitsStart, digitsEnd, 0, digits.length, true)));
  const decimalOpacity = fadeOpacity(frame, digitsStart - 4, digitsStart + 4, collapseStart, shotEnd);
  const collapseT = kf(frame, collapseStart, shotEnd, 0, 1, true);
  const sciOpacity = kf(frame, collapseStart, shotEnd, 0, 1, true);

  const wrap: React.CSSProperties = {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '46%',
    textAlign: 'center',
    fontFamily: FONT,
    fontWeight: 800,
    color: '#ffffff',
  };

  return (
    <>
      {decimalOpacity > 0.001 && (
        <div style={{...wrap, fontSize: 46, opacity: Math.max(introOpacity, decimalOpacity) * (1 - collapseT), transform: `scale(${1 + collapseT * 0.4})`}}>
          0.{revealed}
          <span style={{opacity: 0.35}}>{digits.slice(revealed.length)}</span> m
        </div>
      )}
      {sciOpacity > 0.001 && (
        <div style={{...wrap, fontSize: 64, opacity: sciOpacity, transform: `scale(${0.7 + collapseT * 0.3})`, textShadow: '0 0 26px rgba(255,180,80,0.7)'}}>
          1.7 × 10<sup>-15</sup> m
        </div>
      )}
    </>
  );
};

/** "BUT LOOK AT THE EMPTY SPACE" — the retention-reset freeze shot. */
const EmptySpaceText: React.FC<{frame: number}> = ({frame}) => {
  const opacity = fadeOpacity(frame, CUE.freezeReset + 8, CUE.freezeReset + 22, CUE.reverseToEmptySpace - 10, CUE.reverseToEmptySpace);
  if (opacity <= 0.001) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: '20%',
        textAlign: 'center',
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: 40,
        letterSpacing: '0.06em',
        color: '#ffe27a',
        textShadow: '0 0 30px rgba(255,226,122,0.6)',
        opacity,
        padding: '0 8%',
      }}
    >
      BUT LOOK AT THE EMPTY SPACE.
    </div>
  );
};

/** "+" charge label beside the proton during the charge-visualization beat. */
const ChargeLabel: React.FC<{frame: number}> = ({frame}) => {
  const opacity = fadeOpacity(frame, CUE.protonCharge + 6, CUE.protonCharge + 18, CUE.explosiveReverseZoom - 14, CUE.explosiveReverseZoom);
  if (opacity <= 0.001) return null;
  const p = projectToScreen(frame, ORIGIN);
  return (
    <div style={{...tag, left: p.x + 46, top: p.y - 60, fontSize: 54, color: '#ffb44d', opacity}}>+</div>
  );
};

/** "PROTON -> QUARKS -> ?" as the video pulls past the proton into darkness. */
const QuarkLabels: React.FC<{frame: number}> = ({frame}) => {
  const opacity = fadeOpacity(frame, CUE.finalPullToDarkness + 14, CUE.finalPullToDarkness + 30, 1e9, 1e9 + 1);
  if (opacity <= 0.001) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: '48%',
        textAlign: 'center',
        fontFamily: FONT,
        fontWeight: 700,
        fontSize: 30,
        letterSpacing: '0.1em',
        color: '#dfe9ff',
        textShadow: '0 0 20px rgba(120,170,255,0.6)',
        opacity,
      }}
    >
      PROTON → QUARKS → ?
    </div>
  );
};

export const Labels: React.FC<{frame: number}> = ({frame}) => (
  <AbsoluteFill style={{pointerEvents: 'none', overflow: 'hidden'}}>
    <ProtonTag frame={frame} />
    <ScaleMarker frame={frame} />
    <NumberTyping frame={frame} />
    <EmptySpaceText frame={frame} />
    <ChargeLabel frame={frame} />
    <QuarkLabels frame={frame} />
  </AbsoluteFill>
);
