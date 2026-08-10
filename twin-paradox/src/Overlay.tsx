import React from 'react';
import {AbsoluteFill, interpolate, Easing} from 'remotion';
import {BeatWithFrames, getBeatAtFrame} from './timing';

// All numerals / key words are HTML+CSS, per the brief -- no 3D text
// objects anywhere in the scene.

const FONT =
  '"Inter", "Helvetica Neue", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

const fadeAt = (frame: number, beat: BeatWithFrames, inMs = 180, outMs = 180) => {
  const duration = Math.max(1, beat.endFrame - beat.startFrame);
  // Clamp so in+out never exceeds the beat itself -- very short beats
  // ("Yes.") would otherwise produce a non-monotonic input range.
  // Leave at least half a frame of flat "hold" in the middle so the four
  // breakpoints never collapse into each other on very short beats.
  const half = Math.max(0.01, duration / 2 - 0.5);
  const inFrames = Math.min(half, (inMs / 1000) * 30);
  const outFrames = Math.min(half, (outMs / 1000) * 30);
  return interpolate(
    frame,
    [
      beat.startFrame,
      beat.startFrame + inFrames,
      beat.endFrame - outFrames,
      beat.endFrame,
    ],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.ease)}
  );
};

const glowText: React.CSSProperties = {
  fontFamily: FONT,
  color: '#eaf6ff',
  textShadow: '0 0 18px rgba(127,224,255,0.65), 0 0 46px rgba(127,224,255,0.35)',
  letterSpacing: '0.04em',
};

const Numeral: React.FC<{
  years: number;
  color: string;
  x: string;
  y: string;
  opacity: number;
  scale?: number;
  align?: 'left' | 'center' | 'right';
}> = ({years, color, x, y, opacity, scale = 1, align = 'center'}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      transform: `translate(${align === 'center' ? '-50%' : align === 'right' ? '-100%' : '0'}, -50%) scale(${scale})`,
      textAlign: align,
      opacity,
      ...glowText,
      color,
      textShadow: `0 0 20px ${color}99, 0 0 50px ${color}55`,
    }}
  >
    <div style={{fontSize: 64, fontWeight: 700, lineHeight: 1}}>{years}</div>
    <div style={{fontSize: 20, fontWeight: 500, letterSpacing: '0.3em', marginTop: 4}}>
      {years === 1 ? 'YEAR' : 'YEARS'}
    </div>
  </div>
);

const SplitLabel: React.FC<{
  label: string;
  years: number;
  color: string;
  side: 'left' | 'right';
  opacity: number;
}> = ({label, years, color, side, opacity}) => (
  <div
    style={{
      position: 'absolute',
      top: '76%',
      [side]: '8%',
      transform: 'translateY(-50%)',
      opacity,
      ...glowText,
      color,
      textAlign: side === 'left' ? 'left' : 'right',
      textShadow: `0 0 20px ${color}99, 0 0 50px ${color}55`,
    } as React.CSSProperties}
  >
    <div style={{fontSize: 22, fontWeight: 600, letterSpacing: '0.28em', opacity: 0.85}}>
      {label}
    </div>
    <div style={{fontSize: 56, fontWeight: 800, marginTop: 6}}>
      {years} {years === 1 ? 'YEAR' : 'YEARS'}
    </div>
  </div>
);

const BigWord: React.FC<{text: string; opacity: number; scale?: number; sub?: string}> = ({
  text,
  opacity,
  scale = 1,
  sub,
}) => (
  <div
    style={{
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: `translate(-50%, -50%) scale(${scale})`,
      opacity,
      textAlign: 'center',
      ...glowText,
    }}
  >
    <div style={{fontSize: 140, fontWeight: 800, letterSpacing: '0.02em'}}>{text}</div>
    {sub ? (
      <div style={{fontSize: 26, fontWeight: 500, letterSpacing: '0.2em', marginTop: 8, opacity: 0.8}}>
        {sub}
      </div>
    ) : null}
  </div>
);

const SpeedReadout: React.FC<{value: number; opacity: number}> = ({value, opacity}) => (
  <div
    style={{
      position: 'absolute',
      left: '50%',
      bottom: '10%',
      transform: 'translateX(-50%)',
      opacity,
      ...glowText,
      color: '#7fe0ff',
      textAlign: 'center',
    }}
  >
    <div style={{fontSize: 20, fontWeight: 500, letterSpacing: '0.3em', opacity: 0.8}}>VELOCITY</div>
    <div style={{fontSize: 58, fontWeight: 800, marginTop: 4}}>{value.toFixed(1)}% c</div>
  </div>
);

export const Overlay: React.FC<{frame: number}> = ({frame}) => {
  const beat = getBeatAtFrame(frame);
  const t = interpolate(frame, [beat.startFrame, beat.endFrame], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const op = fadeAt(frame, beat);

  const clockCue = (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        bottom: '6%',
        transform: 'translateX(-50%)',
        opacity: op * 0.55,
        ...glowText,
        fontSize: 17,
        fontWeight: 500,
        letterSpacing: '0.18em',
        textTransform: 'uppercase' as const,
        color: '#9fb4d6',
      }}
    >
      {beat.cue}
    </div>
  );

  switch (beat.id) {
    case 0: {
      const clocksOn = t > 0.35 && t < 0.8;
      const co = clocksOn ? op : 0;
      return (
        <>
          <Numeral years={0} color="#7fe0ff" x="46%" y="38%" opacity={co} scale={0.55} />
          <Numeral years={0} color="#ffb27f" x="54%" y="38%" opacity={co} scale={0.55} />
        </>
      );
    }
    case 2: {
      const years = Math.round(interpolate(t, [0.15, 0.9], [0, 5], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
      return <Numeral years={years} color="#7fe0ff" x="50%" y="50%" opacity={op} scale={1.3} />;
    }
    case 3: {
      const years = Math.round(interpolate(t, [0.1, 0.85], [0, 10], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
      return <Numeral years={years} color="#ffb27f" x="50%" y="30%" opacity={op} scale={1.1} />;
    }
    case 4: {
      // KEY MOMENT 1: locked-off split-frame contradiction.
      return (
        <>
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 0,
              bottom: 0,
              width: 1,
              background:
                'linear-gradient(to bottom, transparent, rgba(255,255,255,0.35), transparent)',
              opacity: op,
            }}
          />
          <SplitLabel label="TRAVELER" years={5} color="#7fe0ff" side="left" opacity={op} />
          <SplitLabel label="EARTH" years={10} color="#ffb27f" side="right" opacity={op} />
        </>
      );
    }
    case 5: {
      return (
        <>
          <Numeral years={5} color="#7fe0ff" x="30%" y="45%" opacity={op} />
          <Numeral years={10} color="#ffb27f" x="70%" y="45%" opacity={op} />
        </>
      );
    }
    case 6: {
      const leftTarget = t < 0.5;
      return (
        <>
          <Numeral years={5} color="#7fe0ff" x="30%" y="45%" opacity={op * (leftTarget ? 1 : 0.4)} />
          <Numeral years={10} color="#ffb27f" x="70%" y="45%" opacity={op * (leftTarget ? 0.4 : 1)} />
        </>
      );
    }
    case 7: {
      return (
        <>
          <Numeral years={5} color="#7fe0ff" x="30%" y="45%" opacity={op * 0.5} />
          <Numeral years={10} color="#ffb27f" x="70%" y="45%" opacity={op * 0.5} />
          <BigWord text="?" opacity={op} scale={0.9} />
        </>
      );
    }
    case 9: {
      return <BigWord text="BOTH ARE RIGHT" opacity={op} scale={0.32} sub="τ_traveler ≠ τ_earth" />;
    }
    case 11: {
      const speed = interpolate(t, [0, 1], [40, 99.9]);
      return <SpeedReadout value={speed} opacity={op} />;
    }
    case 12: {
      return (
        <>
          <Numeral years={5} color="#7fe0ff" x="25%" y="50%" opacity={op} scale={0.8} />
          <Numeral years={10} color="#ffb27f" x="75%" y="50%" opacity={op} scale={0.8} />
        </>
      );
    }
    case 14: {
      const years = Math.min(5, Math.max(1, Math.floor(interpolate(t, [0, 1], [1, 5.99]))));
      return <Numeral years={years} color="#7fe0ff" x="50%" y="50%" opacity={op} scale={1.2} />;
    }
    case 17: {
      return (
        <>
          <SplitLabel label="TRAVELER" years={5} color="#7fe0ff" side="left" opacity={op} />
          <SplitLabel label="EARTH" years={10} color="#ffb27f" side="right" opacity={op} />
        </>
      );
    }
    case 20: {
      return (
        <>
          <Numeral years={5} color="#7fe0ff" x="35%" y="45%" opacity={op} scale={0.8} />
          <Numeral years={10} color="#ffb27f" x="65%" y="45%" opacity={op} scale={0.8} />
        </>
      );
    }
    case 21: {
      // KEY BEAT: "Yes." -- SFX PLACEHOLDER cue lives in Scene.tsx case 21.
      return <BigWord text="YES" opacity={op} scale={1} />;
    }
    case 27: {
      return (
        <>
          <SplitLabel label="TRAVELER" years={5} color="#7fe0ff" side="left" opacity={op} />
          <SplitLabel label="EARTH" years={10} color="#ffb27f" side="right" opacity={op} />
        </>
      );
    }
    case 30: {
      // KEY MOMENT 2: THE BIG REVEAL -- spacetime-path labels.
      // SFX PLACEHOLDER: riser + impact synced to the pull-back finishing.
      return (
        <>
          <div
            style={{
              position: 'absolute',
              left: '8%',
              top: '18%',
              opacity: op,
              ...glowText,
              color: '#ffb27f',
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: '0.22em',
            }}
          >
            EARTH — STRAIGHT WORLDLINE
          </div>
          <div
            style={{
              position: 'absolute',
              right: '8%',
              top: '26%',
              opacity: op,
              ...glowText,
              color: '#7fe0ff',
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: '0.22em',
              textAlign: 'right',
            }}
          >
            TRAVELER — BENT PATH THROUGH SPACETIME
          </div>
        </>
      );
    }
    case 33: {
      return (
        <>
          <Numeral years={5} color="#7fe0ff" x="40%" y="72%" opacity={op} scale={0.7} />
          <Numeral years={10} color="#ffb27f" x="60%" y="72%" opacity={op} scale={0.7} />
        </>
      );
    }
    case 34: {
      // KEY MOMENT 3: LOOP -- clocks visually reset to 0 YEARS.
      const flashesOn = t > 0.5;
      const fo = flashesOn ? op : 0;
      return (
        <>
          <Numeral years={0} color="#7fe0ff" x="46%" y="38%" opacity={fo} scale={0.55} />
          <Numeral years={0} color="#ffb27f" x="54%" y="38%" opacity={fo} scale={0.55} />
        </>
      );
    }
    default:
      return beat.cue ? clockCue : null;
  }
};
