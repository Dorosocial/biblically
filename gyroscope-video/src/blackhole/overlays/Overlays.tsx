import React from 'react';
import {AbsoluteFill} from 'remotion';
import {CUE, DURATION_IN_FRAMES} from '../timing';
import {kf, SceneState} from '../physics';
import {TwinClock} from '../../shared/TwinClock';

const FONT = '"Helvetica Neue", Arial, sans-serif';

/**
 * On-screen captions carrying every narration line — there is no audio in
 * this video, so this is the viewer's only way to receive the script.
 */
const CAPTIONS: {start: number; end: number; text: string}[] = [
  {start: CUE.hook, end: CUE.bendStars, text: 'This black hole is so extreme...'},
  {start: CUE.bendStars, end: CUE.blackHoleReveal, text: '...space, time, and information starts to break down.'},
  {start: CUE.blackHoleReveal, end: CUE.approachDisk, text: "We don't fully understand what happens beyond its event horizon."},
  {start: CUE.approachDisk, end: CUE.spacetimeGridIntro, text: "A black hole isn't simply a giant object..."},
  {start: CUE.spacetimeGridIntro, end: CUE.dominateFrame, text: '...where gravity has become so extreme...'},
  {start: CUE.dominateFrame, end: CUE.titleCard, text: "But the black hole I'm talking about..."},
  {start: CUE.spacecraftApproach, end: CUE.scaleComparison, text: "Imagine you're approaching a supermassive black hole."},
  {start: CUE.scaleComparison, end: CUE.sunToBlackHole, text: 'From far away...'},
  {start: CUE.sunToBlackHole, end: CUE.earthContinuesOrbit, text: 'If the Sun were magically replaced...'},
  {start: CUE.earthContinuesOrbit, end: CUE.sideBySideGravity, text: "We'd continue orbiting almost exactly as before."},
  {start: CUE.sideBySideGravity, end: CUE.accelerateToward, text: "That's because... gravity depends primarily on its mass."},
  {start: CUE.accelerateToward, end: CUE.gridWarpsDive, text: 'The terrifying part begins when you get very close.'},
  {start: CUE.gridWarpsDive, end: CUE.twinClocks, text: 'Spacetime becomes increasingly curved.'},
  {start: CUE.twinClocks, end: CUE.redshift, text: "Your clock and a distant observer's clock start ticking at very different rates."},
  {start: CUE.redshift, end: CUE.eventHorizonFill, text: 'Light becomes increasingly redshifted.'},
  {start: CUE.eventHorizonFill, end: DURATION_IN_FRAMES, text: 'Eventually you reach the event horizon.'},
];

const captionOpacity = (frame: number, segStart: number, segEnd: number) =>
  Math.min(kf(frame, segStart, segStart + 6, 0, 1, true), kf(frame, segEnd - 6, segEnd, 1, 0, true));

const Captions: React.FC<{frame: number}> = ({frame}) => {
  const seg = CAPTIONS.find((c) => frame >= c.start && frame < c.end);
  if (!seg) return null;
  const opacity = captionOpacity(frame, seg.start, seg.end);
  // Subtle animated entrance — a small upward drift as it fades in, not a static pop-in.
  const entrance = kf(frame, seg.start, seg.start + 10, 10, 0, true);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, bottom: '13%', textAlign: 'center', padding: '0 9%'}}>
      <span
        style={{
          display: 'inline-block',
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 38,
          lineHeight: 1.35,
          color: '#f2f6ff',
          textShadow: '0 2px 14px rgba(0,0,0,0.9), 0 0 26px rgba(90,130,255,0.35)',
          letterSpacing: '0.005em',
          opacity,
          transform: `translateY(${entrance}px)`,
        }}
      >
        {seg.text}
      </span>
    </div>
  );
};

/** "FORGET THE HOLLYWOOD VERSION" — brief, bold title beat. */
const TitleCard: React.FC<{frame: number; opacity: number}> = ({frame, opacity}) => {
  if (opacity <= 0.001) return null;
  const shotStart = CUE.titleCard;
  const scale = kf(frame, shotStart, shotStart + 10, 0.85, 1);
  const letterSpread = kf(frame, shotStart, shotStart + 12, 0.35, 0.08);
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', pointerEvents: 'none'}}>
      <div
        style={{
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 64,
          textAlign: 'center',
          padding: '0 6%',
          lineHeight: 1.15,
          color: '#ffffff',
          letterSpacing: `${letterSpread}em`,
          textShadow: '0 0 40px rgba(255,150,60,0.55), 0 4px 20px rgba(0,0,0,0.85)',
          opacity,
          transform: `scale(${scale})`,
        }}
      >
        FORGET THE
        <br />
        HOLLYWOOD VERSION
      </div>
    </AbsoluteFill>
  );
};

const ClocksOverlay: React.FC<{opacity: number; youAngle: number; earthAngle: number}> = ({opacity, youAngle, earthAngle}) => {
  if (opacity <= 0.001) return null;
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', pointerEvents: 'none'}}>
      <div style={{display: 'flex', gap: 80, opacity}}>
        <TwinClock label="YOU" angleDeg={youAngle} accentColor="#ffb15c" />
        <TwinClock label="EARTH" angleDeg={earthAngle} accentColor="#7fc4ff" />
      </div>
    </AbsoluteFill>
  );
};

/** Animated blue-white -> red wavelength shift, standing in for redshift. */
const RedshiftOverlay: React.FC<{opacity: number; t: number}> = ({opacity, t}) => {
  if (opacity <= 0.001) return null;
  const hue = 210 - t * 210; // 210 (blue) -> 0 (red)
  const stretch = 1 + t * 1.8;
  const barCount = 5;
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', pointerEvents: 'none'}}>
      <div style={{display: 'flex', flexDirection: 'column', gap: 14, opacity, transform: `scaleX(${stretch})`}}>
        {Array.from({length: barCount}).map((_, i) => (
          <div
            key={i}
            style={{
              width: 220,
              height: 8,
              borderRadius: 4,
              background: `hsl(${hue}, 95%, ${62 - i * 2}%)`,
              boxShadow: `0 0 ${18 + t * 14}px hsl(${hue}, 95%, 60%)`,
            }}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};

export const Overlays: React.FC<{frame: number; s: SceneState}> = ({frame, s}) => (
  <AbsoluteFill style={{pointerEvents: 'none', overflow: 'hidden'}}>
    <ClocksOverlay opacity={s.clocksOpacity} youAngle={s.clockYouAngle} earthAngle={s.clockEarthAngle} />
    <RedshiftOverlay opacity={s.redshiftOpacity} t={s.redshiftT} />
    <TitleCard frame={frame} opacity={s.titleOpacity} />
    <Captions frame={frame} />
  </AbsoluteFill>
);
