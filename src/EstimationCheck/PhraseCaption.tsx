import React from 'react';
import {spring, useVideoConfig} from 'remotion';
import {COLORS} from './colors';

export type CaptionWord = {text: string};
export type CaptionPhrase = {at: number; words: CaptionWord[]};

// Word/short-phrase captions: a hard pop-in (no opacity fade — just a
// quick scale snap), positioned in the center-lower third rather than a
// fixed bottom bar. The diagrams already carry the color variety, so
// captions stay plain bone white for legibility.
export const PhraseCaption: React.FC<{
  frame: number;
  phrases: CaptionPhrase[];
  y?: number;
}> = ({frame, phrases, y = 1460}) => {
  const {fps} = useVideoConfig();

  let activeIndex = -1;
  for (let i = 0; i < phrases.length; i++) {
    if (frame >= phrases[i].at) activeIndex = i;
  }
  if (activeIndex === -1) return null;
  const phrase = phrases[activeIndex];

  const localFrame = frame - phrase.at;
  const pop = spring({frame: localFrame, fps, config: {damping: 14, mass: 0.4, stiffness: 260}});
  const scale = 0.8 + 0.2 * pop;

  return (
    <div
      style={{
        position: 'absolute',
        left: 70,
        right: 70,
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
          fontWeight: 700,
          fontSize: 42,
          lineHeight: 1.25,
          textAlign: 'center',
          color: COLORS.bone,
          letterSpacing: 0.3,
          textShadow: '0 3px 16px rgba(0,0,0,0.8)',
        }}
      >
        {phrase.words.map((w, i) => (
          <span key={i} style={{marginRight: 14}}>
            {w.text}
          </span>
        ))}
      </p>
    </div>
  );
};
