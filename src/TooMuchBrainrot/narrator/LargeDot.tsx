import React from 'react';
import {DOT_COLOR} from '../constants';

interface Props {
	x: number;
	y: number;
	radius: number;
	opacity?: number;
}

// Full-scale dot for narrator/preview scenes — deliberately not the tiny
// ambient PrimaryDot used during exercise holds.
export const LargeDot: React.FC<Props> = ({x, y, radius, opacity = 1}) => (
	<div
		style={{
			position: 'absolute',
			left: x - radius,
			top: y - radius,
			width: radius * 2,
			height: radius * 2,
			borderRadius: '50%',
			backgroundColor: DOT_COLOR,
			opacity,
			boxShadow: `0 0 ${radius * 0.9}px ${DOT_COLOR}`,
		}}
	/>
);
