import React from 'react';
import {Figure, FIGURE_POSES, FigurePoseName} from './Figure';
import {theme} from '../theme';

// This is what scene files should import -- never Figure.tsx directly.
// Figure.tsx and PosedFigure.tsx are the only two files in the channel
// that define what a person looks like; every scene just picks a named
// pose and a color.

export interface PosedFigureProps {
  pose: FigurePoseName;
  x: number;
  y: number;
  scale?: number;
  color?: string;
  facing?: 'left' | 'right';
}

export const PosedFigure: React.FC<PosedFigureProps> = ({
  pose,
  x,
  y,
  scale,
  color = theme.color.accentReference,
  facing,
}) => <Figure x={x} y={y} scale={scale} color={color} facing={facing} joints={FIGURE_POSES[pose]} />;
