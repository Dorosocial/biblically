import React from 'react';
import {AbsoluteFill} from 'remotion';
import {CUE, DURATION_IN_FRAMES} from '../timing';
import {kf} from '../physics';

const FONT = '"Helvetica Neue", Arial, sans-serif';

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * On-screen captions carrying every narration line — there is no audio in
 * this video, so this is the viewer's only way to receive the script.
 * Each line fades in/out over 5 frames at its own boundaries (a plain
 * clamped fade, not a shared-instant idiom) so two adjacent captions never
 * both sit at zero opacity at once.
 */
const CAPTIONS: {start: number; end: number; text: string}[] = [
  {start: CUE.emerge, end: CUE.ordinary, text: 'What is reality actually made of?'},
  {start: CUE.ordinary, end: CUE.pickup, text: 'Not philosophically. Physically.'},
  {start: CUE.pickup, end: CUE.rapidCuts, text: "Take the phone you're watching this on."},
  {start: CUE.rapidCuts, end: CUE.macroTouch, text: 'You can hold it, touch it, drop it.'},
  {start: CUE.macroTouch, end: CUE.microscope, text: 'It feels like a solid object.'},
  {start: CUE.microscope, end: DURATION_IN_FRAMES, text: 'But imagine you had a microscope powerful enough to keep zooming in.'},
];

const Captions: React.FC<{frame: number}> = ({frame}) => {
  const seg = CAPTIONS.find((c) => frame >= c.start && frame < c.end) ?? CAPTIONS[CAPTIONS.length - 1];
  const opacity = Math.min(kf(frame, seg.start, seg.start + 5, 0, 1, true), kf(frame, seg.end - 5, seg.end, 1, 0, true));
  return (
    <div style={{position: 'absolute', left: 0, right: 0, bottom: '11%', textAlign: 'center', padding: '0 14%'}}>
      <span
        style={{
          display: 'inline-block',
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 40,
          lineHeight: 1.3,
          color: '#f5f8ff',
          textShadow: '0 2px 10px rgba(0,0,0,0.85), 0 0 24px rgba(0,0,0,0.6)',
          letterSpacing: '0.005em',
          opacity,
        }}
      >
        {seg.text}
      </span>
    </div>
  );
};

/**
 * The "microscope lens" frame — a circular vignette that appears at
 * CUE.microscope and tightens gradually as the dive continues, selling the
 * idea that we're looking through an increasingly powerful lens rather
 * than just a camera push.
 */
const MicroscopeVignette: React.FC<{frame: number}> = ({frame}) => {
  if (frame < CUE.microscope) return null;
  const t = kf(frame, CUE.microscope, DURATION_IN_FRAMES, 0, 1, true);
  const introOpacity = kf(frame, CUE.microscope, CUE.microscope + 10, 0, 1, true);
  const radiusPct = lerp(38, 26, t); // tightens as the dive continues

  return (
    <div style={{position: 'absolute', inset: 0, opacity: introOpacity, pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 50% 50%, transparent ${radiusPct - 1.5}%, rgba(0,0,0,0.97) ${radiusPct + 1}%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: `${radiusPct * 2}%`,
          aspectRatio: '1 / 1',
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          border: '2px solid rgba(234,243,255,0.55)',
          boxShadow: '0 0 40px rgba(234,243,255,0.25) inset',
        }}
      />
    </div>
  );
};

export const Overlays: React.FC<{frame: number}> = ({frame}) => (
  <AbsoluteFill style={{pointerEvents: 'none', overflow: 'hidden'}}>
    <MicroscopeVignette frame={frame} />
    <Captions frame={frame} />
  </AbsoluteFill>
);
