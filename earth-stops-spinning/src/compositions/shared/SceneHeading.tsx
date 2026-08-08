import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { colors } from '../../theme';
import { headlineFontFamily } from '../../fonts';

type SceneHeadingProps = {
  eyebrow?: string;
  title: string;
  fadeInStart?: number;
};

/** Top-left scene label: a small eyebrow tag plus a headline. */
export const SceneHeading: React.FC<SceneHeadingProps> = ({
  eyebrow,
  title,
  fadeInStart = 0,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [fadeInStart, fadeInStart + 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{ position: 'absolute', top: 72, left: 96, opacity }}>
      {eyebrow ? (
        <div
          style={{
            fontFamily: headlineFontFamily,
            fontWeight: 600,
            fontSize: 24,
            letterSpacing: 4,
            textTransform: 'uppercase',
            color: colors.cyan,
            marginBottom: 12,
          }}
        >
          {eyebrow}
        </div>
      ) : null}
      <div
        style={{
          fontFamily: headlineFontFamily,
          fontWeight: 700,
          fontSize: 56,
          color: colors.textPrimary,
        }}
      >
        {title}
      </div>
    </div>
  );
};
