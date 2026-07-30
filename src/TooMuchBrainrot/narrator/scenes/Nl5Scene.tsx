import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {CENTER_X, CENTER_Y} from '../../constants';
import {BoldLabel} from '../BoldLabel';
import {WHITE, YELLOW} from '../palette';

interface Props {
	durationInFrames: number;
}

// Attention-decline chart: a jagged line draws itself left to right, trending
// downward. No fabricated numbers — just the shape of decline.
export const Nl5Scene: React.FC<Props> = ({durationInFrames}) => {
	const frame = useCurrentFrame();

	const w = 1220;
	const h = 460;
	const left = CENTER_X - w / 2;
	const top = CENTER_Y - h / 2 + 40;

	const points: [number, number][] = [
		[0, h * 0.08],
		[w * 0.18, h * 0.22],
		[w * 0.32, h * 0.18],
		[w * 0.5, h * 0.48],
		[w * 0.68, h * 0.4],
		[w * 0.86, h * 0.8],
		[w, h * 0.92],
	];
	const path = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ');
	const pathLength = 1900;

	const draw = interpolate(frame, [0, durationInFrames * 0.8], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const labelOpacity = interpolate(frame, [0, 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const endpointOpacity = interpolate(draw, [0.96, 1], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<>
			<div style={{position: 'absolute', left, top: top - 70}}>
				<BoldLabel color={WHITE} size={26} opacity={labelOpacity * 0.75}>
					Attention switches
				</BoldLabel>
			</div>
			<svg style={{position: 'absolute', left, top, width: w, height: h, overflow: 'visible'}} viewBox={`0 0 ${w} ${h}`}>
				<line x1={0} y1={h} x2={w} y2={h} stroke={WHITE} strokeWidth={2} opacity={0.15} />
				<path
					d={path}
					fill="none"
					stroke={YELLOW}
					strokeWidth={6}
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeDasharray={pathLength}
					strokeDashoffset={pathLength * (1 - draw)}
				/>
				<circle cx={w} cy={h * 0.92} r={12} fill={YELLOW} opacity={endpointOpacity} />
			</svg>
		</>
	);
};
