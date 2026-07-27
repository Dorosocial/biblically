import React, {useMemo} from 'react';
import {useCurrentFrame} from 'remotion';
import {getBackgroundState} from './backgroundState';
import {generateWashSchedule} from './washes';
import {hsl, hsla} from './colorHsl';
import {HEIGHT, WIDTH} from './constants';

const GRID_SIZE = 72;

// Grid + occasional full-color wash, rendered as one unit so the
// ExclusionWindow can clip an identical copy of it and always match the
// real background pixel-for-pixel, regardless of what round or wash state
// is active.
export const Background: React.FC = () => {
	const frame = useCurrentFrame();
	const state = getBackgroundState(frame);
	const washSchedule = useMemo(() => generateWashSchedule(), []);
	const activeWash = washSchedule.find(
		(w) => frame >= w.startFrame && frame < w.startFrame + w.duration
	);

	let washOpacity = 0;
	if (activeWash) {
		const t = Math.min(1, Math.max(0, (frame - activeWash.startFrame) / activeWash.duration));
		washOpacity = Math.sin(Math.PI * t) * activeWash.peakOpacity;
	}

	const gridColor = hsla(state.gridH, state.gridS, state.gridL, state.gridOpacity);

	return (
		<div
			style={{
				position: 'absolute',
				top: 0,
				left: 0,
				width: WIDTH,
				height: HEIGHT,
				backgroundColor: hsl(state.baseH, state.baseS, state.baseL),
			}}
		>
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					width: '100%',
					height: '100%',
					backgroundImage: `linear-gradient(${gridColor} 1px, transparent 1px), linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`,
					backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
				}}
			/>
			{activeWash ? (
				<div
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						width: '100%',
						height: '100%',
						background: hsl(activeWash.hue, 85, 55),
						opacity: washOpacity,
						mixBlendMode: 'screen',
					}}
				/>
			) : null}
		</div>
	);
};
