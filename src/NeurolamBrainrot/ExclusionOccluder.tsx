import React from 'react';
import {BG_COLOR, CENTER_X, CENTER_Y, EXCLUSION_RADIUS} from './constants';

// A flat disc painted in the background color, sitting between the
// distractor layer and the dot. Since the background is a solid flat
// color, this seamlessly guarantees nothing ever visually overlaps the
// exclusion zone, regardless of how a distractor's path is randomized.
export const ExclusionOccluder: React.FC = () => {
	const size = EXCLUSION_RADIUS * 2;
	return (
		<div
			style={{
				position: 'absolute',
				left: CENTER_X,
				top: CENTER_Y,
				width: size,
				height: size,
				borderRadius: '50%',
				background: BG_COLOR,
				transform: 'translate(-50%, -50%)',
			}}
		/>
	);
};
