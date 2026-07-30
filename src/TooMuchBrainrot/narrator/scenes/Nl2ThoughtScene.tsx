import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {CENTER_X, CENTER_Y} from '../../constants';
import {YELLOW} from '../palette';

const FRAGMENT_COUNT = 6;

// "You start a thought, then lose it." A dot forms, holds, then dissolves
// into fragments drifting outward and fading. No text.
export const Nl2ThoughtScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const formEnd = fps * 0.5;
	const holdEnd = formEnd + fps * 0.25;
	const dissolveEnd = holdEnd + fps * 0.7;

	const form = interpolate(frame, [0, formEnd], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const dissolve = interpolate(frame, [holdEnd, dissolveEnd], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const coreOpacity = form * (1 - dissolve);
	const coreScale = form;

	return (
		<>
			<div
				style={{
					position: 'absolute',
					left: CENTER_X - 34 * coreScale,
					top: CENTER_Y - 34 * coreScale,
					width: 68 * coreScale,
					height: 68 * coreScale,
					borderRadius: '50%',
					backgroundColor: YELLOW,
					opacity: coreOpacity,
				}}
			/>
			{Array.from({length: FRAGMENT_COUNT}).map((_, i) => {
				const angle = (i / FRAGMENT_COUNT) * Math.PI * 2;
				const travel = dissolve * 210;
				const x = CENTER_X + Math.cos(angle) * travel;
				const y = CENTER_Y + Math.sin(angle) * travel;
				const size = 14 * (1 - dissolve * 0.6);
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: x - size / 2,
							top: y - size / 2,
							width: size,
							height: size,
							borderRadius: '50%',
							backgroundColor: YELLOW,
							opacity: dissolve > 0 ? (1 - dissolve) * 0.9 : 0,
						}}
					/>
				);
			})}
		</>
	);
};
