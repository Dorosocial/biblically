import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {CENTER_X, CENTER_Y, DOT_COLOR, HEIGHT, WIDTH} from '../../constants';
import {driftValue} from '../../drift';
import {LargeDot} from '../LargeDot';
import {PALE_GOLD, SOFT_GRAY} from '../palette';

const DOT_RADIUS = 60;

// ex1 — full-scale dot, static/minimal motion.
export const Ex1Preview: React.FC = () => {
	const frame = useCurrentFrame();
	return <LargeDot x={CENTER_X} y={CENTER_Y} radius={DOT_RADIUS + driftValue(frame, 40, 2)} />;
};

// ex2 — dot with a couple of distractor shapes briefly flashing around it.
export const Ex2Preview: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const flash1 = (Math.sin((frame / (fps * 0.7)) * Math.PI * 2) + 1) / 2;
	const flash2 = (Math.sin((frame / (fps * 0.55)) * Math.PI * 2 + 2) + 1) / 2;

	return (
		<svg width="100%" height="100%" style={{position: 'absolute'}}>
			<circle cx={CENTER_X - 220} cy={CENTER_Y - 90} r={28} fill={PALE_GOLD} opacity={0.15 + flash1 * 0.5} />
			<polygon
				points={`${CENTER_X + 210},${CENTER_Y + 110 - 30} ${CENTER_X + 240},${CENTER_Y + 110 + 26} ${CENTER_X + 180},${CENTER_Y + 110 + 26}`}
				fill={SOFT_GRAY}
				opacity={0.12 + flash2 * 0.45}
			/>
			<circle cx={CENTER_X} cy={CENTER_Y} r={DOT_RADIUS} fill={DOT_COLOR} style={{filter: `drop-shadow(0 0 30px ${DOT_COLOR})`}} />
		</svg>
	);
};

// ex3 — dot beginning to trace a short movement path.
export const Ex3Preview: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const t = interpolate(frame, [0, durationInFrames], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const x = CENTER_X + t * 260;
	const y = CENTER_Y + Math.sin(t * Math.PI) * -80;
	return <LargeDot x={x} y={y} radius={DOT_RADIUS} />;
};

// ex4 — dot jumping once between two points.
export const Ex4Preview: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const jumpAt = durationInFrames * 0.5;
	const x = interpolate(frame, [jumpAt, jumpAt + 6], [CENTER_X - 220, CENTER_X + 220], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	return <LargeDot x={x} y={CENTER_Y} radius={DOT_RADIUS} />;
};

// ex5 — two dots appearing and pulsing together.
export const Ex5Preview: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const pulse = (Math.sin((frame / (fps * 1.1)) * Math.PI * 2) + 1) / 2;
	const r = DOT_RADIUS * 0.7 + pulse * 12;
	return (
		<>
			<LargeDot x={CENTER_X - 160} y={CENTER_Y} radius={r} />
			<LargeDot x={CENTER_X + 160} y={CENTER_Y} radius={r} />
		</>
	);
};

// ex6 — dot with a brief flash suggesting an incoming sound cue.
export const Ex6Preview: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const cueEvery = fps * 2.4;
	const localT = frame % cueEvery;
	const flash = interpolate(localT, [0, fps * 0.2, fps * 0.5], [0, 1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const ringRadius = DOT_RADIUS + 20 + flash * 60;

	return (
		<svg width="100%" height="100%" style={{position: 'absolute'}}>
			<circle cx={CENTER_X} cy={CENTER_Y} r={ringRadius} fill="none" stroke={SOFT_GRAY} strokeWidth={3} opacity={flash * 0.6} />
			<circle cx={CENTER_X} cy={CENTER_Y} r={DOT_RADIUS} fill={DOT_COLOR} style={{filter: `drop-shadow(0 0 30px ${DOT_COLOR})`}} />
		</svg>
	);
};

// ex7 — dot sitting still with a very faint suggestion of "waiting".
export const Ex7Preview: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const waitPulse = (Math.sin((frame / (fps * 3.2)) * Math.PI * 2) + 1) / 2;
	return (
		<svg width="100%" height="100%" style={{position: 'absolute'}}>
			<circle cx={CENTER_X} cy={CENTER_Y} r={DOT_RADIUS + 40 + waitPulse * 20} fill="none" stroke={PALE_GOLD} strokeWidth={1.5} opacity={0.12 + waitPulse * 0.1} />
			<circle cx={CENTER_X} cy={CENTER_Y} r={DOT_RADIUS} fill={DOT_COLOR} style={{filter: `drop-shadow(0 0 30px ${DOT_COLOR})`}} />
		</svg>
	);
};

// ex8 — three points appearing briefly.
export const Ex8Preview: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const angle = (frame / (fps * 5)) * Math.PI * 2;
	const orbitRadius = 260;

	return (
		<>
			{[0, 1, 2].map((i) => {
				const a = angle + (i * Math.PI * 2) / 3;
				const x = CENTER_X + Math.cos(a) * orbitRadius;
				const y = CENTER_Y + Math.sin(a) * orbitRadius;
				const appear = interpolate(frame, [i * 8, i * 8 + 18], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
				return <LargeDot key={i} x={x} y={y} radius={26} opacity={appear} />;
			})}
		</>
	);
};

// ex9 — two dots, one centered, one peripheral.
export const Ex9Preview: React.FC = () => {
	const frame = useCurrentFrame();
	const peripheralX = CENTER_X + WIDTH * 0.22 + driftValue(frame, 100, 10);
	const peripheralY = CENTER_Y - HEIGHT * 0.12 + driftValue(frame, 80, 8, 1);
	return (
		<>
			<LargeDot x={CENTER_X} y={CENTER_Y} radius={DOT_RADIUS} />
			<LargeDot x={peripheralX} y={peripheralY} radius={26} opacity={0.75} />
		</>
	);
};

// ex10 — quick motion-trail/ghost-frame flash previewing Speed Remix.
export const Ex10Preview: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const posAt = (f: number) => ({
		x: CENTER_X + driftValue(f, fps * 0.55, 300, 0),
		y: CENTER_Y + driftValue(f, fps * 0.42, 160, 1.4),
	});
	return (
		<>
			{Array.from({length: 5}).map((_, i) => {
				const {x, y} = posAt(frame - i * 2);
				return <LargeDot key={i} x={x} y={y} radius={DOT_RADIUS - i * 8} opacity={0.5 * (1 - i / 5)} />;
			})}
		</>
	);
};

// ex11 — dot still with a very brief suggestion of something at the frame's edge.
export const Ex11Preview: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const edgeAppear = interpolate(
		frame,
		[durationInFrames * 0.4, durationInFrames * 0.6, durationInFrames * 0.85],
		[0, 1, 0],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
	);
	return (
		<svg width="100%" height="100%" style={{position: 'absolute'}}>
			<circle cx={WIDTH - 90} cy={90} r={20} fill={SOFT_GRAY} opacity={edgeAppear * 0.5} />
			<circle cx={CENTER_X} cy={CENTER_Y} r={DOT_RADIUS} fill={DOT_COLOR} style={{filter: `drop-shadow(0 0 30px ${DOT_COLOR})`}} />
		</svg>
	);
};
