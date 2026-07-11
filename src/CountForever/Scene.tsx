import React from 'react';
import {AbsoluteFill} from 'remotion';
import {COLORS} from './colors';

export const Scene: React.FC<{children: React.ReactNode}> = ({children}) => {
  return <AbsoluteFill style={{backgroundColor: COLORS.bg}}>{children}</AbsoluteFill>;
};
