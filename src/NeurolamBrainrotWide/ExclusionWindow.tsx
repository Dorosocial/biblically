import React from 'react';
import {Background} from './Background';
import {CENTER_X, CENTER_Y, EXCLUSION_RADIUS, HEIGHT, WIDTH} from './constants';

// Since the background is a grid (not a flat color), the exclusion zone
// can't be hidden with a plain solid disc. Instead this renders a circular
// window showing a duplicate copy of the exact same Background, offset so
// it lines up pixel-for-pixel with the real background beneath the
// distractor layer. Anything a distractor draws under this window is
// invisibly replaced by the true, undisturbed background.
export const ExclusionWindow: React.FC = () => {
	const size = EXCLUSION_RADIUS * 2;
	const left = CENTER_X - EXCLUSION_RADIUS;
	const top = CENTER_Y - EXCLUSION_RADIUS;

	return (
		<div
			style={{
				position: 'absolute',
				left,
				top,
				width: size,
				height: size,
				borderRadius: '50%',
				overflow: 'hidden',
			}}
		>
			<div style={{position: 'absolute', left: -left, top: -top, width: WIDTH, height: HEIGHT}}>
				<Background />
			</div>
		</div>
	);
};
