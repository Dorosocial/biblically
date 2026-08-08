import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { colors } from '../../theme';
import { captionFontFamily } from '../../fonts';

type CaptionProps = {
  text: string;
  /** Local frame (within the scene) at which the caption starts fading in. */
  fadeInStart?: number;
};

/**
 * Narration caption, docked to the bottom of the frame. Every scene passes
 * its narration line through this so captions read consistently.
 */
export const Caption: React.FC<CaptionProps> = ({ text, fadeInStart = 0 }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [fadeInStart, fadeInStart + 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const translateY = interpolate(frame, [fadeInStart, fadeInStart + 15], [16, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 72,
        display: 'flex',
        justifyContent: 'center',
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          padding: '18px 36px',
          borderRadius: 16,
          backgroundColor: 'rgba(19, 27, 46, 0.82)',
          border: `1px solid rgba(237, 239, 244, 0.08)`,
          fontFamily: captionFontFamily,
          fontWeight: 500,
          fontSize: 34,
          lineHeight: 1.4,
          color: colors.textPrimary,
          textAlign: 'center',
        }}
      >
        {text}
      </div>
    </div>
  );
};
