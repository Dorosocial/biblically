import React from 'react';

interface TextOverlayProps {
  text: string;
  opacity: number;
  fontSize?: number;
  letterSpacing?: string;
  color?: string;
  top?: string;
  left?: string;
  transform?: string;
  fontWeight?: number;
  textAlign?: React.CSSProperties['textAlign'];
  extraStyle?: React.CSSProperties;
}

const FONT_STACK =
  "'Helvetica Neue', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif";

/** Minimal, clean sans-serif text overlay — used sparingly across the video. */
export const TextOverlay: React.FC<TextOverlayProps> = ({
  text,
  opacity,
  fontSize = 44,
  letterSpacing = '0.04em',
  color = '#e7ebf1',
  top = '50%',
  left = '50%',
  transform = 'translate(-50%, -50%)',
  fontWeight = 300,
  textAlign = 'center',
  extraStyle,
}) => {
  if (opacity <= 0.002) return null;
  return (
    <div
      style={{
        position: 'absolute',
        top,
        left,
        transform,
        opacity,
        fontFamily: FONT_STACK,
        fontSize,
        fontWeight,
        letterSpacing,
        color,
        textAlign,
        whiteSpace: 'nowrap',
        ...extraStyle,
      }}
    >
      {text}
    </div>
  );
};
