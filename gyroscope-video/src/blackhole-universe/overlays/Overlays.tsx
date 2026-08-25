import React from 'react';
import {AbsoluteFill} from 'remotion';
import {SceneState} from '../physics';

/**
 * On-screen text/diagram overlays — but NOT narration captions. Per the
 * brief: no caption bar, no subtitle text following the voiceover anywhere
 * in this video. Only specific beats that explicitly call for on-screen
 * diagram text render anything here: equations, "∞" symbols, IDEA ->
 * PREDICTION -> TEST, the "gets crossed out" diagram annotation, plus (new
 * for the 125-beat rebuild) brief lightning-flash punctuation, a subtle
 * always-on film-grain texture (per the new "cinematic... subtle film
 * grain" visual-style note), and the SPECULATIVE IDEA / NOT ESTABLISHED /
 * HYPOTHESIS honesty labels the storyboard calls for. Plain HTML/CSS, same
 * pattern as reality/overlays/Overlays.tsx's microscope vignette — no 3D
 * text rendering (avoids depending on troika's network font fetch), and no
 * extra render pass (grain is a static tiled texture, not a per-frame
 * shader), consistent with this project's established performance
 * constraints.
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
  const words = ['IDEA', 'PREDICTION', 'TEST'];
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

/** A brief bright full-frame flash — lightning-style visual punctuation at
 * the storyboard's called-out moments (black-hole reveal, singularity,
 * universe transition, parent-universe reveal, cosmic family tree). Plain
 * white overlay, no shader — cheap. */
const Lightning: React.FC<{opacity: number}> = ({opacity}) => {
  if (opacity <= 0.001) return null;
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle, rgba(230,240,255,1) 0%, rgba(180,210,255,0.6) 55%, rgba(140,180,255,0) 100%)',
        opacity: opacity * 0.85,
        mixBlendMode: 'screen',
      }}
    />
  );
};

/** The scientific-honesty labels ("SPECULATIVE IDEA", "NOT ESTABLISHED",
 * "HYPOTHESIS") — small, unobtrusive, bottom-left, so the video stays
 * visually terrifying/cinematic without implying this is established
 * physics. */
const SpeculativeLabel: React.FC<{text: string; opacity: number}> = ({text, opacity}) => {
  if (opacity <= 0.001) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: 48,
        bottom: 48,
        padding: '8px 16px',
        border: '1px solid rgba(255,200,120,0.6)',
        borderRadius: 4,
        color: '#ffd27a',
        fontFamily: 'Arial, sans-serif',
        fontWeight: 700,
        fontSize: 18,
        letterSpacing: 2,
        opacity,
        background: 'rgba(10,8,4,0.35)',
      }}
    >
      {text}
    </div>
  );
};

// A static, tiled film-grain texture (SVG feTurbulence baked into a data
// URI) — always present at very low opacity per the "cinematic... subtle
// film grain" visual-style note. Static (not re-randomized per frame) so
// it costs nothing extra to render; at this opacity a static grain pattern
// still reads as texture, not an obviously-repeating tile.
const GRAIN_DATA_URI =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>";

const Grain: React.FC = () => (
  <div
    style={{
      position: 'absolute',
      inset: -20,
      backgroundImage: `url("${GRAIN_DATA_URI}")`,
      backgroundRepeat: 'repeat',
      opacity: 0.05,
      mixBlendMode: 'overlay',
    }}
  />
);

export const Overlays: React.FC<{frame: number; s: SceneState}> = ({s}) => {
  return (
    <AbsoluteFill style={{pointerEvents: 'none', overflow: 'hidden'}}>
      {s.equation && <Equation text={s.equation.text} opacity={s.equation.opacity} warp={s.equation.warp} />}
      {s.infinity && <InfinitySymbols opacity={s.infinity.opacity} />}
      {s.hpt && <HPTSequence stage={s.hpt.stage} opacity={s.hpt.opacity} />}
      {s.crossOut && <CrossOut opacity={s.crossOut.opacity} />}
      {s.speculative && <SpeculativeLabel text={s.speculative.text} opacity={s.speculative.opacity} />}
      {s.lightning && <Lightning opacity={s.lightning.opacity} />}
      <Grain />
    </AbsoluteFill>
  );
};
