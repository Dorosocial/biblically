import React from 'react';
import {AbsoluteFill} from 'remotion';
import {SceneState} from '../physics';

/**
 * On-screen text/diagram overlays — but NOT narration captions. Per the
 * brief: no caption bar, no subtitle text following the voiceover anywhere
 * in this video. Only specific beats that explicitly call for on-screen
 * diagram text render anything here: equations (beats 22/23/83), "∞"
 * symbols (beat 23), HYPOTHESIS -> PREDICTION -> TEST (beat 84), and the
 * "gets crossed out" diagram annotation (beat 51). Plain HTML/CSS, same
 * pattern as reality/overlays/Overlays.tsx's microscope vignette — no 3D
 * text rendering (avoids depending on troika's network font fetch).
 */

const glowText = (opacity: number, warp: number): React.CSSProperties => ({
  position: 'absolute',
  left: '50%',
  top: '46%',
  transform: `translate(-50%, -50%) skewX(${warp * 8}deg) scale(${1 + warp * 0.15})`,
  color: '#eaf3ff',
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontSize: 52,
  letterSpacing: 1,
  opacity,
  textShadow: `0 0 ${18 + warp * 30}px rgba(140,190,255,${0.8}), 0 0 4px rgba(255,255,255,0.9)`,
  filter: warp > 0.3 ? `blur(${(warp - 0.3) * 2.5}px)` : undefined,
  whiteSpace: 'nowrap',
});

const Equation: React.FC<{text: string; opacity: number; warp: number}> = ({text, opacity, warp}) => {
  if (opacity <= 0.001) return null;
  return <div style={glowText(opacity, warp)}>{text}</div>;
};

const InfinitySymbols: React.FC<{opacity: number}> = ({opacity}) => {
  if (opacity <= 0.001) return null;
  const positions = [
    [22, 30], [72, 22], [42, 68], [80, 62], [15, 70], [58, 40], [30, 15], [65, 85],
  ];
  return (
    <>
      {positions.map(([x, y], i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${x}%`,
            top: `${y}%`,
            transform: 'translate(-50%, -50%)',
            color: '#eaf3ff',
            fontSize: 28 + (i % 3) * 20,
            opacity: opacity * (0.6 + 0.4 * ((i % 2) as number)),
            textShadow: '0 0 20px rgba(150,200,255,0.9)',
          }}
        >
          ∞
        </div>
      ))}
    </>
  );
};

const HPTSequence: React.FC<{stage: number; opacity: number}> = ({stage, opacity}) => {
  if (opacity <= 0.001) return null;
  const words = ['HYPOTHESIS', 'PREDICTION', 'TEST'];
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        alignItems: 'center',
        gap: 28,
        fontFamily: 'Arial, sans-serif',
        fontWeight: 700,
        fontSize: 34,
        letterSpacing: 2,
        opacity,
      }}
    >
      {words.map((w, i) => (
        <React.Fragment key={w}>
          {i > 0 && <span style={{color: '#5be3ff', opacity: i <= stage ? 1 : 0.25}}>→</span>}
          <span
            style={{
              color: i <= stage ? '#eaf3ff' : '#3a4560',
              textShadow: i <= stage ? '0 0 18px rgba(140,190,255,0.85)' : 'none',
              transition: 'color 0.2s',
            }}
          >
            {w}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
};

const CrossOut: React.FC<{opacity: number}> = ({opacity}) => {
  if (opacity <= 0.001) return null;
  const line: React.CSSProperties = {
    position: 'absolute',
    left: '30%',
    top: '50%',
    width: '40%',
    height: 6,
    background: '#ff5a4a',
    boxShadow: '0 0 16px rgba(255,90,74,0.9)',
    opacity,
    transformOrigin: 'center',
  };
  return (
    <>
      <div style={{...line, transform: 'translateY(-50%) rotate(22deg)'}} />
      <div style={{...line, transform: 'translateY(-50%) rotate(-22deg)'}} />
    </>
  );
};

export const Overlays: React.FC<{frame: number; s: SceneState}> = ({s}) => {
  const hasAny = s.equation || s.infinity || s.hpt || s.crossOut;
  if (!hasAny) return null;
  return (
    <AbsoluteFill style={{pointerEvents: 'none', overflow: 'hidden'}}>
      {s.equation && <Equation text={s.equation.text} opacity={s.equation.opacity} warp={s.equation.warp} />}
      {s.infinity && <InfinitySymbols opacity={s.infinity.opacity} />}
      {s.hpt && <HPTSequence stage={s.hpt.stage} opacity={s.hpt.opacity} />}
      {s.crossOut && <CrossOut opacity={s.crossOut.opacity} />}
    </AbsoluteFill>
  );
};
