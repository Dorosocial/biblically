import React from 'react';
import {spring, useVideoConfig} from 'remotion';
import {COLORS} from './colors';

export type CaptionWord = {text: string; accent?: boolean};
export type CaptionPhrase = {at: number; words: CaptionWord[]};

// Word/short-phrase captions: a hard pop-in (no opacity fade — just a
// quick scale snap), positioned in the center-lower third rather than a
// fixed bottom bar. Key words get the pop-accent color; everything else
// is bone white. `phrases` are beat-local frame offsets — the active
// phrase is the last one whose `at` has been reached.
export const PhraseCaption: React.FC<{
  frame: number;
  phrases: CaptionPhrase[];
  y?: number;
  accentColor?: string;
}> = ({frame, phrases, y = 1440, accentColor = COLORS.pink}) => {
  const {fps} = useVideoConfig();

  let activeIndex = -1;
  for (let i = 0; i < phrases.length; i++) {
    if (frame >= phrases[i].at) activeIndex = i;
  }
  if (activeIndex === -1) return null;
  const phrase = phrases[activeIndex];

  const localFrame = frame - phrase.at;
  const pop = spring({frame: localFrame, fps, config: {damping: 13, mass: 0.4, stiffness: 280}});
  const scale = 0.75 + 0.25 * pop;

  return (
    <div
      style={{
        position: 'absolute',
        left: 60,
        right: 60,
        top: y,
        display: 'flex',
        justifyContent: 'center',
        transformOrigin: 'center',
        transform: `scale(${scale})`,
      }}
    >
      <p
        style={{
          margin: 0,
          fontFamily: 'Helvetica, Arial, sans-serif',
          fontWeight: 800,
          fontSize: 46,
          lineHeight: 1.25,
          textAlign: 'center',
          textTransform: 'uppercase',
          letterSpacing: 0.5,
          textShadow: '0 3px 16px rgba(0,0,0,0.85)',
        }}
      >
        {phrase.words.map((w, i) => (
          <span key={i} style={{color: w.accent ? accentColor : COLORS.bone, marginRight: 16}}>
            {w.text}
          </span>
        ))}
      </p>
    </div>
  );
};
